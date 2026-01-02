---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 451
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 451 of 552)

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

---[FILE: src/vs/workbench/contrib/speech/browser/speechService.ts]---
Location: vscode-main/src/vs/workbench/contrib/speech/browser/speechService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { DeferredPromise } from '../../../../base/common/async.js';
import { ISpeechService, ISpeechProvider, HasSpeechProvider, ISpeechToTextSession, SpeechToTextInProgress, KeywordRecognitionStatus, SpeechToTextStatus, speechLanguageConfigToLanguage, SPEECH_LANGUAGE_CONFIG, ITextToSpeechSession, TextToSpeechInProgress, TextToSpeechStatus } from '../common/speechService.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ExtensionsRegistry } from '../../../services/extensions/common/extensionsRegistry.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';

export interface ISpeechProviderDescriptor {
	readonly name: string;
	readonly description?: string;
}

const speechProvidersExtensionPoint = ExtensionsRegistry.registerExtensionPoint<ISpeechProviderDescriptor[]>({
	extensionPoint: 'speechProviders',
	jsonSchema: {
		description: localize('vscode.extension.contributes.speechProvider', 'Contributes a Speech Provider'),
		type: 'array',
		items: {
			additionalProperties: false,
			type: 'object',
			defaultSnippets: [{ body: { name: '', description: '' } }],
			required: ['name'],
			properties: {
				name: {
					description: localize('speechProviderName', "Unique name for this Speech Provider."),
					type: 'string'
				},
				description: {
					description: localize('speechProviderDescription', "A description of this Speech Provider, shown in the UI."),
					type: 'string'
				}
			}
		}
	}
});

export class SpeechService extends Disposable implements ISpeechService {

	readonly _serviceBrand: undefined;

	private readonly _onDidChangeHasSpeechProvider = this._register(new Emitter<void>());
	readonly onDidChangeHasSpeechProvider = this._onDidChangeHasSpeechProvider.event;

	get hasSpeechProvider() { return this.providerDescriptors.size > 0 || this.providers.size > 0; }

	private readonly providers = new Map<string, ISpeechProvider>();
	private readonly providerDescriptors = new Map<string, ISpeechProviderDescriptor>();

	private readonly hasSpeechProviderContext: IContextKey<boolean>;

	constructor(
		@ILogService private readonly logService: ILogService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IHostService private readonly hostService: IHostService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IExtensionService private readonly extensionService: IExtensionService
	) {
		super();

		this.hasSpeechProviderContext = HasSpeechProvider.bindTo(contextKeyService);
		this.textToSpeechInProgress = TextToSpeechInProgress.bindTo(contextKeyService);
		this.speechToTextInProgress = SpeechToTextInProgress.bindTo(contextKeyService);

		this.handleAndRegisterSpeechExtensions();
	}

	private handleAndRegisterSpeechExtensions(): void {
		speechProvidersExtensionPoint.setHandler((extensions, delta) => {
			const oldHasSpeechProvider = this.hasSpeechProvider;

			for (const extension of delta.removed) {
				for (const descriptor of extension.value) {
					this.providerDescriptors.delete(descriptor.name);
				}
			}

			for (const extension of delta.added) {
				for (const descriptor of extension.value) {
					this.providerDescriptors.set(descriptor.name, descriptor);
				}
			}

			if (oldHasSpeechProvider !== this.hasSpeechProvider) {
				this.handleHasSpeechProviderChange();
			}
		});
	}

	registerSpeechProvider(identifier: string, provider: ISpeechProvider): IDisposable {
		if (this.providers.has(identifier)) {
			throw new Error(`Speech provider with identifier ${identifier} is already registered.`);
		}

		const oldHasSpeechProvider = this.hasSpeechProvider;

		this.providers.set(identifier, provider);

		if (oldHasSpeechProvider !== this.hasSpeechProvider) {
			this.handleHasSpeechProviderChange();
		}

		return toDisposable(() => {
			const oldHasSpeechProvider = this.hasSpeechProvider;

			this.providers.delete(identifier);

			if (oldHasSpeechProvider !== this.hasSpeechProvider) {
				this.handleHasSpeechProviderChange();
			}
		});
	}

	private handleHasSpeechProviderChange(): void {
		this.hasSpeechProviderContext.set(this.hasSpeechProvider);

		this._onDidChangeHasSpeechProvider.fire();
	}

	//#region Speech to Text

	private readonly _onDidStartSpeechToTextSession = this._register(new Emitter<void>());
	readonly onDidStartSpeechToTextSession = this._onDidStartSpeechToTextSession.event;

	private readonly _onDidEndSpeechToTextSession = this._register(new Emitter<void>());
	readonly onDidEndSpeechToTextSession = this._onDidEndSpeechToTextSession.event;

	private activeSpeechToTextSessions = 0;
	get hasActiveSpeechToTextSession() { return this.activeSpeechToTextSessions > 0; }

	private readonly speechToTextInProgress: IContextKey<boolean>;

	async createSpeechToTextSession(token: CancellationToken, context: string = 'speech'): Promise<ISpeechToTextSession> {
		const provider = await this.getProvider();

		const language = speechLanguageConfigToLanguage(this.configurationService.getValue<unknown>(SPEECH_LANGUAGE_CONFIG));
		const session = provider.createSpeechToTextSession(token, typeof language === 'string' ? { language } : undefined);

		const sessionStart = Date.now();
		let sessionRecognized = false;
		let sessionError = false;
		let sessionContentLength = 0;

		const disposables = new DisposableStore();

		const onSessionStoppedOrCanceled = () => {
			this.activeSpeechToTextSessions = Math.max(0, this.activeSpeechToTextSessions - 1);
			if (!this.hasActiveSpeechToTextSession) {
				this.speechToTextInProgress.reset();
			}
			this._onDidEndSpeechToTextSession.fire();

			type SpeechToTextSessionClassification = {
				owner: 'bpasero';
				comment: 'An event that fires when a speech to text session is created';
				context: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Context of the session.' };
				sessionDuration: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Duration of the session.' };
				sessionRecognized: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'If speech was recognized.' };
				sessionError: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'If speech resulted in error.' };
				sessionContentLength: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Length of the recognized text.' };
				sessionLanguage: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Configured language for the session.' };
			};
			type SpeechToTextSessionEvent = {
				context: string;
				sessionDuration: number;
				sessionRecognized: boolean;
				sessionError: boolean;
				sessionContentLength: number;
				sessionLanguage: string;
			};
			this.telemetryService.publicLog2<SpeechToTextSessionEvent, SpeechToTextSessionClassification>('speechToTextSession', {
				context,
				sessionDuration: Date.now() - sessionStart,
				sessionRecognized,
				sessionError,
				sessionContentLength,
				sessionLanguage: language
			});

			disposables.dispose();
		};

		disposables.add(token.onCancellationRequested(() => onSessionStoppedOrCanceled()));
		if (token.isCancellationRequested) {
			onSessionStoppedOrCanceled();
		}

		disposables.add(session.onDidChange(e => {
			switch (e.status) {
				case SpeechToTextStatus.Started:
					this.activeSpeechToTextSessions++;
					this.speechToTextInProgress.set(true);
					this._onDidStartSpeechToTextSession.fire();
					break;
				case SpeechToTextStatus.Recognizing:
					sessionRecognized = true;
					break;
				case SpeechToTextStatus.Recognized:
					if (typeof e.text === 'string') {
						sessionContentLength += e.text.length;
					}
					break;
				case SpeechToTextStatus.Stopped:
					onSessionStoppedOrCanceled();
					break;
				case SpeechToTextStatus.Error:
					this.logService.error(`Speech provider error in speech to text session: ${e.text}`);
					sessionError = true;
					break;
			}
		}));

		return session;
	}

	private async getProvider(): Promise<ISpeechProvider> {

		// Send out extension activation to ensure providers can register
		await this.extensionService.activateByEvent('onSpeech');

		const provider = Array.from(this.providers.values()).at(0);
		if (!provider) {
			throw new Error(`No Speech provider is registered.`);
		} else if (this.providers.size > 1) {
			this.logService.warn(`Multiple speech providers registered. Picking first one: ${provider.metadata.displayName}`);
		}

		return provider;
	}

	//#endregion

	//#region Text to Speech

	private readonly _onDidStartTextToSpeechSession = this._register(new Emitter<void>());
	readonly onDidStartTextToSpeechSession = this._onDidStartTextToSpeechSession.event;

	private readonly _onDidEndTextToSpeechSession = this._register(new Emitter<void>());
	readonly onDidEndTextToSpeechSession = this._onDidEndTextToSpeechSession.event;

	private activeTextToSpeechSessions = 0;
	get hasActiveTextToSpeechSession() { return this.activeTextToSpeechSessions > 0; }

	private readonly textToSpeechInProgress: IContextKey<boolean>;

	async createTextToSpeechSession(token: CancellationToken, context: string = 'speech'): Promise<ITextToSpeechSession> {
		const provider = await this.getProvider();

		const language = speechLanguageConfigToLanguage(this.configurationService.getValue<unknown>(SPEECH_LANGUAGE_CONFIG));
		const session = provider.createTextToSpeechSession(token, typeof language === 'string' ? { language } : undefined);

		const sessionStart = Date.now();
		let sessionError = false;

		const disposables = new DisposableStore();

		const onSessionStoppedOrCanceled = (dispose: boolean) => {
			this.activeTextToSpeechSessions = Math.max(0, this.activeTextToSpeechSessions - 1);
			if (!this.hasActiveTextToSpeechSession) {
				this.textToSpeechInProgress.reset();
			}
			this._onDidEndTextToSpeechSession.fire();

			type TextToSpeechSessionClassification = {
				owner: 'bpasero';
				comment: 'An event that fires when a text to speech session is created';
				context: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Context of the session.' };
				sessionDuration: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Duration of the session.' };
				sessionError: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'If speech resulted in error.' };
				sessionLanguage: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Configured language for the session.' };
			};
			type TextToSpeechSessionEvent = {
				context: string;
				sessionDuration: number;
				sessionError: boolean;
				sessionLanguage: string;
			};
			this.telemetryService.publicLog2<TextToSpeechSessionEvent, TextToSpeechSessionClassification>('textToSpeechSession', {
				context,
				sessionDuration: Date.now() - sessionStart,
				sessionError,
				sessionLanguage: language
			});

			if (dispose) {
				disposables.dispose();
			}
		};

		disposables.add(token.onCancellationRequested(() => onSessionStoppedOrCanceled(true)));
		if (token.isCancellationRequested) {
			onSessionStoppedOrCanceled(true);
		}

		disposables.add(session.onDidChange(e => {
			switch (e.status) {
				case TextToSpeechStatus.Started:
					this.activeTextToSpeechSessions++;
					this.textToSpeechInProgress.set(true);
					this._onDidStartTextToSpeechSession.fire();
					break;
				case TextToSpeechStatus.Stopped:
					onSessionStoppedOrCanceled(false);
					break;
				case TextToSpeechStatus.Error:
					this.logService.error(`Speech provider error in text to speech session: ${e.text}`);
					sessionError = true;
					break;
			}
		}));

		return session;
	}

	//#endregion

	//#region Keyword Recognition

	private readonly _onDidStartKeywordRecognition = this._register(new Emitter<void>());
	readonly onDidStartKeywordRecognition = this._onDidStartKeywordRecognition.event;

	private readonly _onDidEndKeywordRecognition = this._register(new Emitter<void>());
	readonly onDidEndKeywordRecognition = this._onDidEndKeywordRecognition.event;

	private activeKeywordRecognitionSessions = 0;
	get hasActiveKeywordRecognition() { return this.activeKeywordRecognitionSessions > 0; }

	async recognizeKeyword(token: CancellationToken): Promise<KeywordRecognitionStatus> {
		const result = new DeferredPromise<KeywordRecognitionStatus>();

		const disposables = new DisposableStore();
		disposables.add(token.onCancellationRequested(() => {
			disposables.dispose();
			result.complete(KeywordRecognitionStatus.Canceled);
		}));

		const recognizeKeywordDisposables = disposables.add(new DisposableStore());
		let activeRecognizeKeywordSession: Promise<void> | undefined = undefined;
		const recognizeKeyword = () => {
			recognizeKeywordDisposables.clear();

			const cts = new CancellationTokenSource(token);
			recognizeKeywordDisposables.add(toDisposable(() => cts.dispose(true)));
			const currentRecognizeKeywordSession = activeRecognizeKeywordSession = this.doRecognizeKeyword(cts.token).then(status => {
				if (currentRecognizeKeywordSession === activeRecognizeKeywordSession) {
					result.complete(status);
				}
			}, error => {
				if (currentRecognizeKeywordSession === activeRecognizeKeywordSession) {
					result.error(error);
				}
			});
		};

		disposables.add(this.hostService.onDidChangeFocus(focused => {
			if (!focused && activeRecognizeKeywordSession) {
				recognizeKeywordDisposables.clear();
				activeRecognizeKeywordSession = undefined;
			} else if (!activeRecognizeKeywordSession) {
				recognizeKeyword();
			}
		}));

		if (this.hostService.hasFocus) {
			recognizeKeyword();
		}

		let status: KeywordRecognitionStatus;
		try {
			status = await result.p;
		} finally {
			disposables.dispose();
		}

		type KeywordRecognitionClassification = {
			owner: 'bpasero';
			comment: 'An event that fires when a speech keyword detection is started';
			keywordRecognized: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'If the keyword was recognized.' };
		};
		type KeywordRecognitionEvent = {
			keywordRecognized: boolean;
		};
		this.telemetryService.publicLog2<KeywordRecognitionEvent, KeywordRecognitionClassification>('keywordRecognition', {
			keywordRecognized: status === KeywordRecognitionStatus.Recognized
		});

		return status;
	}

	private async doRecognizeKeyword(token: CancellationToken): Promise<KeywordRecognitionStatus> {
		const provider = await this.getProvider();

		const session = provider.createKeywordRecognitionSession(token);
		this.activeKeywordRecognitionSessions++;
		this._onDidStartKeywordRecognition.fire();

		const disposables = new DisposableStore();

		const onSessionStoppedOrCanceled = () => {
			this.activeKeywordRecognitionSessions = Math.max(0, this.activeKeywordRecognitionSessions - 1);
			this._onDidEndKeywordRecognition.fire();

			disposables.dispose();
		};

		disposables.add(token.onCancellationRequested(() => onSessionStoppedOrCanceled()));
		if (token.isCancellationRequested) {
			onSessionStoppedOrCanceled();
		}

		disposables.add(session.onDidChange(e => {
			if (e.status === KeywordRecognitionStatus.Stopped) {
				onSessionStoppedOrCanceled();
			}
		}));

		try {
			return (await Event.toPromise(session.onDidChange)).status;
		} finally {
			onSessionStoppedOrCanceled();
		}
	}

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/speech/common/speechService.ts]---
Location: vscode-main/src/vs/workbench/contrib/speech/common/speechService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { language } from '../../../../base/common/platform.js';

export const ISpeechService = createDecorator<ISpeechService>('speechService');

export const HasSpeechProvider = new RawContextKey<boolean>('hasSpeechProvider', false, { type: 'boolean', description: localize('hasSpeechProvider', "A speech provider is registered to the speech service.") });
export const SpeechToTextInProgress = new RawContextKey<boolean>('speechToTextInProgress', false, { type: 'boolean', description: localize('speechToTextInProgress', "A speech-to-text session is in progress.") });
export const TextToSpeechInProgress = new RawContextKey<boolean>('textToSpeechInProgress', false, { type: 'boolean', description: localize('textToSpeechInProgress', "A text-to-speech session is in progress.") });

export interface ISpeechProviderMetadata {
	readonly extension: ExtensionIdentifier;
	readonly displayName: string;
}

export enum SpeechToTextStatus {
	Started = 1,
	Recognizing = 2,
	Recognized = 3,
	Stopped = 4,
	Error = 5
}

export interface ISpeechToTextEvent {
	readonly status: SpeechToTextStatus;
	readonly text?: string;
}

export interface ISpeechToTextSession {
	readonly onDidChange: Event<ISpeechToTextEvent>;
}

export enum TextToSpeechStatus {
	Started = 1,
	Stopped = 2,
	Error = 3
}

export interface ITextToSpeechEvent {
	readonly status: TextToSpeechStatus;
	readonly text?: string;
}

export interface ITextToSpeechSession {
	readonly onDidChange: Event<ITextToSpeechEvent>;

	synthesize(text: string): Promise<void>;
}

export enum KeywordRecognitionStatus {
	Recognized = 1,
	Stopped = 2,
	Canceled = 3
}

export interface IKeywordRecognitionEvent {
	readonly status: KeywordRecognitionStatus;
	readonly text?: string;
}

export interface IKeywordRecognitionSession {
	readonly onDidChange: Event<IKeywordRecognitionEvent>;
}

export interface ISpeechToTextSessionOptions {
	readonly language?: string;
}

export interface ITextToSpeechSessionOptions {
	readonly language?: string;
}

export interface ISpeechProvider {
	readonly metadata: ISpeechProviderMetadata;

	createSpeechToTextSession(token: CancellationToken, options?: ISpeechToTextSessionOptions): ISpeechToTextSession;
	createTextToSpeechSession(token: CancellationToken, options?: ITextToSpeechSessionOptions): ITextToSpeechSession;
	createKeywordRecognitionSession(token: CancellationToken): IKeywordRecognitionSession;
}

export interface ISpeechService {

	readonly _serviceBrand: undefined;

	readonly onDidChangeHasSpeechProvider: Event<void>;

	readonly hasSpeechProvider: boolean;

	registerSpeechProvider(identifier: string, provider: ISpeechProvider): IDisposable;

	readonly onDidStartSpeechToTextSession: Event<void>;
	readonly onDidEndSpeechToTextSession: Event<void>;

	readonly hasActiveSpeechToTextSession: boolean;

	/**
	 * Starts to transcribe speech from the default microphone. The returned
	 * session object provides an event to subscribe for transcribed text.
	 */
	createSpeechToTextSession(token: CancellationToken, context?: string): Promise<ISpeechToTextSession>;

	readonly onDidStartTextToSpeechSession: Event<void>;
	readonly onDidEndTextToSpeechSession: Event<void>;

	readonly hasActiveTextToSpeechSession: boolean;

	/**
	 * Creates a synthesizer to synthesize speech from text. The returned
	 * session object provides a method to synthesize text and listen for
	 * events.
	 */
	createTextToSpeechSession(token: CancellationToken, context?: string): Promise<ITextToSpeechSession>;

	readonly onDidStartKeywordRecognition: Event<void>;
	readonly onDidEndKeywordRecognition: Event<void>;

	readonly hasActiveKeywordRecognition: boolean;

	/**
	 * Starts to recognize a keyword from the default microphone. The returned
	 * status indicates if the keyword was recognized or if the session was
	 * stopped.
	 */
	recognizeKeyword(token: CancellationToken): Promise<KeywordRecognitionStatus>;
}

export const enum AccessibilityVoiceSettingId {
	SpeechTimeout = 'accessibility.voice.speechTimeout',
	AutoSynthesize = 'accessibility.voice.autoSynthesize',
	SpeechLanguage = 'accessibility.voice.speechLanguage',
	IgnoreCodeBlocks = 'accessibility.voice.ignoreCodeBlocks'
}

export const SPEECH_LANGUAGE_CONFIG = AccessibilityVoiceSettingId.SpeechLanguage;

export const SPEECH_LANGUAGES = {
	['da-DK']: {
		name: localize('speechLanguage.da-DK', "Danish (Denmark)")
	},
	['de-DE']: {
		name: localize('speechLanguage.de-DE', "German (Germany)")
	},
	['en-AU']: {
		name: localize('speechLanguage.en-AU', "English (Australia)")
	},
	['en-CA']: {
		name: localize('speechLanguage.en-CA', "English (Canada)")
	},
	['en-GB']: {
		name: localize('speechLanguage.en-GB', "English (United Kingdom)")
	},
	['en-IE']: {
		name: localize('speechLanguage.en-IE', "English (Ireland)")
	},
	['en-IN']: {
		name: localize('speechLanguage.en-IN', "English (India)")
	},
	['en-NZ']: {
		name: localize('speechLanguage.en-NZ', "English (New Zealand)")
	},
	['en-US']: {
		name: localize('speechLanguage.en-US', "English (United States)")
	},
	['es-ES']: {
		name: localize('speechLanguage.es-ES', "Spanish (Spain)")
	},
	['es-MX']: {
		name: localize('speechLanguage.es-MX', "Spanish (Mexico)")
	},
	['fr-CA']: {
		name: localize('speechLanguage.fr-CA', "French (Canada)")
	},
	['fr-FR']: {
		name: localize('speechLanguage.fr-FR', "French (France)")
	},
	['hi-IN']: {
		name: localize('speechLanguage.hi-IN', "Hindi (India)")
	},
	['it-IT']: {
		name: localize('speechLanguage.it-IT', "Italian (Italy)")
	},
	['ja-JP']: {
		name: localize('speechLanguage.ja-JP', "Japanese (Japan)")
	},
	['ko-KR']: {
		name: localize('speechLanguage.ko-KR', "Korean (South Korea)")
	},
	['nl-NL']: {
		name: localize('speechLanguage.nl-NL', "Dutch (Netherlands)")
	},
	['pt-PT']: {
		name: localize('speechLanguage.pt-PT', "Portuguese (Portugal)")
	},
	['pt-BR']: {
		name: localize('speechLanguage.pt-BR', "Portuguese (Brazil)")
	},
	['ru-RU']: {
		name: localize('speechLanguage.ru-RU', "Russian (Russia)")
	},
	['sv-SE']: {
		name: localize('speechLanguage.sv-SE', "Swedish (Sweden)")
	},
	['tr-TR']: {
		// allow-any-unicode-next-line
		name: localize('speechLanguage.tr-TR', "Turkish (Türkiye)")
	},
	['zh-CN']: {
		name: localize('speechLanguage.zh-CN', "Chinese (Simplified, China)")
	},
	['zh-HK']: {
		name: localize('speechLanguage.zh-HK', "Chinese (Traditional, Hong Kong)")
	},
	['zh-TW']: {
		name: localize('speechLanguage.zh-TW', "Chinese (Traditional, Taiwan)")
	}
};

export function speechLanguageConfigToLanguage(config: unknown, lang = language): string {
	if (typeof config === 'string') {
		if (config === 'auto') {
			if (lang !== 'en') {
				const langParts = lang.split('-');

				return speechLanguageConfigToLanguage(`${langParts[0]}-${(langParts[1] ?? langParts[0]).toUpperCase()}`);
			}
		} else {
			if (SPEECH_LANGUAGES[config as keyof typeof SPEECH_LANGUAGES]) {
				return config;
			}
		}
	}

	return 'en-US';
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/speech/test/common/speechService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/speech/test/common/speechService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { speechLanguageConfigToLanguage } from '../../common/speechService.js';

suite('SpeechService', () => {

	test('resolve language', async () => {
		assert.strictEqual(speechLanguageConfigToLanguage(undefined), 'en-US');
		assert.strictEqual(speechLanguageConfigToLanguage(3), 'en-US');
		assert.strictEqual(speechLanguageConfigToLanguage('foo'), 'en-US');
		assert.strictEqual(speechLanguageConfigToLanguage('foo-bar'), 'en-US');

		assert.strictEqual(speechLanguageConfigToLanguage('tr-TR'), 'tr-TR');
		assert.strictEqual(speechLanguageConfigToLanguage('zh-TW'), 'zh-TW');

		assert.strictEqual(speechLanguageConfigToLanguage('auto', 'en'), 'en-US');
		assert.strictEqual(speechLanguageConfigToLanguage('auto', 'tr'), 'tr-TR');
		assert.strictEqual(speechLanguageConfigToLanguage('auto', 'zh-tw'), 'zh-TW');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/splash/browser/partsSplash.ts]---
Location: vscode-main/src/vs/workbench/contrib/splash/browser/partsSplash.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { onDidChangeFullscreen, isFullscreen } from '../../../../base/browser/browser.js';
import * as dom from '../../../../base/browser/dom.js';
import { Color } from '../../../../base/common/color.js';
import { Event } from '../../../../base/common/event.js';
import { DisposableStore, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { editorBackground, foreground } from '../../../../platform/theme/common/colorRegistry.js';
import { getThemeTypeSelector, IThemeService } from '../../../../platform/theme/common/themeService.js';
import { DEFAULT_EDITOR_MIN_DIMENSIONS } from '../../../browser/parts/editor/editor.js';
import * as themes from '../../../common/theme.js';
import { IWorkbenchLayoutService, Parts, Position } from '../../../services/layout/browser/layoutService.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import * as perf from '../../../../base/common/performance.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { ISplashStorageService } from './splash.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { ILifecycleService, LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { TitleBarSetting } from '../../../../platform/window/common/window.js';

export class PartsSplash {

	static readonly ID = 'workbench.contrib.partsSplash';

	private static readonly _splashElementId = 'monaco-parts-splash';

	private readonly _disposables = new DisposableStore();

	private _didChangeTitleBarStyle?: boolean;

	constructor(
		@IThemeService private readonly _themeService: IThemeService,
		@IWorkbenchLayoutService private readonly _layoutService: IWorkbenchLayoutService,
		@IWorkbenchEnvironmentService private readonly _environmentService: IWorkbenchEnvironmentService,
		@IConfigurationService private readonly _configService: IConfigurationService,
		@ISplashStorageService private readonly _partSplashService: ISplashStorageService,
		@IEditorGroupsService editorGroupsService: IEditorGroupsService,
		@ILifecycleService lifecycleService: ILifecycleService,
	) {
		Event.once(_layoutService.onDidLayoutMainContainer)(() => {
			this._removePartsSplash();
			perf.mark('code/didRemovePartsSplash');
		}, undefined, this._disposables);

		const lastIdleSchedule = this._disposables.add(new MutableDisposable());
		const savePartsSplashSoon = () => {
			lastIdleSchedule.value = dom.runWhenWindowIdle(mainWindow, () => this._savePartsSplash(), 2500);
		};
		lifecycleService.when(LifecyclePhase.Restored).then(() => {
			Event.any(Event.filter(onDidChangeFullscreen, windowId => windowId === mainWindow.vscodeWindowId), editorGroupsService.mainPart.onDidLayout, _themeService.onDidColorThemeChange)(savePartsSplashSoon, undefined, this._disposables);
			savePartsSplashSoon();
		});

		_configService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TitleBarSetting.TITLE_BAR_STYLE)) {
				this._didChangeTitleBarStyle = true;
				this._savePartsSplash();
			}
		}, this, this._disposables);
	}

	dispose(): void {
		this._disposables.dispose();
	}

	private _savePartsSplash() {
		const theme = this._themeService.getColorTheme();

		this._partSplashService.saveWindowSplash({
			zoomLevel: this._configService.getValue<undefined>('window.zoomLevel'),
			baseTheme: getThemeTypeSelector(theme.type),
			colorInfo: {
				foreground: theme.getColor(foreground)?.toString(),
				background: Color.Format.CSS.formatHex(theme.getColor(editorBackground) || themes.WORKBENCH_BACKGROUND(theme)),
				editorBackground: theme.getColor(editorBackground)?.toString(),
				titleBarBackground: theme.getColor(themes.TITLE_BAR_ACTIVE_BACKGROUND)?.toString(),
				titleBarBorder: theme.getColor(themes.TITLE_BAR_BORDER)?.toString(),
				activityBarBackground: theme.getColor(themes.ACTIVITY_BAR_BACKGROUND)?.toString(),
				activityBarBorder: theme.getColor(themes.ACTIVITY_BAR_BORDER)?.toString(),
				sideBarBackground: theme.getColor(themes.SIDE_BAR_BACKGROUND)?.toString(),
				sideBarBorder: theme.getColor(themes.SIDE_BAR_BORDER)?.toString(),
				statusBarBackground: theme.getColor(themes.STATUS_BAR_BACKGROUND)?.toString(),
				statusBarBorder: theme.getColor(themes.STATUS_BAR_BORDER)?.toString(),
				statusBarNoFolderBackground: theme.getColor(themes.STATUS_BAR_NO_FOLDER_BACKGROUND)?.toString(),
				windowBorder: theme.getColor(themes.WINDOW_ACTIVE_BORDER)?.toString() ?? theme.getColor(themes.WINDOW_INACTIVE_BORDER)?.toString()
			},
			layoutInfo: !this._shouldSaveLayoutInfo() ? undefined : {
				sideBarSide: this._layoutService.getSideBarPosition() === Position.RIGHT ? 'right' : 'left',
				editorPartMinWidth: DEFAULT_EDITOR_MIN_DIMENSIONS.width,
				titleBarHeight: this._layoutService.isVisible(Parts.TITLEBAR_PART, mainWindow) ? dom.getTotalHeight(assertReturnsDefined(this._layoutService.getContainer(mainWindow, Parts.TITLEBAR_PART))) : 0,
				activityBarWidth: this._layoutService.isVisible(Parts.ACTIVITYBAR_PART) ? dom.getTotalWidth(assertReturnsDefined(this._layoutService.getContainer(mainWindow, Parts.ACTIVITYBAR_PART))) : 0,
				sideBarWidth: this._layoutService.isVisible(Parts.SIDEBAR_PART) ? dom.getTotalWidth(assertReturnsDefined(this._layoutService.getContainer(mainWindow, Parts.SIDEBAR_PART))) : 0,
				auxiliaryBarWidth: this._layoutService.isAuxiliaryBarMaximized() ? Number.MAX_SAFE_INTEGER /* marker for maximized state */ : this._layoutService.isVisible(Parts.AUXILIARYBAR_PART) ? dom.getTotalWidth(assertReturnsDefined(this._layoutService.getContainer(mainWindow, Parts.AUXILIARYBAR_PART))) : 0,
				statusBarHeight: this._layoutService.isVisible(Parts.STATUSBAR_PART, mainWindow) ? dom.getTotalHeight(assertReturnsDefined(this._layoutService.getContainer(mainWindow, Parts.STATUSBAR_PART))) : 0,
				windowBorder: this._layoutService.hasMainWindowBorder(),
				windowBorderRadius: this._layoutService.getMainWindowBorderRadius()
			}
		});
	}

	private _shouldSaveLayoutInfo(): boolean {
		return !isFullscreen(mainWindow) && !this._environmentService.isExtensionDevelopment && !this._didChangeTitleBarStyle;
	}

	private _removePartsSplash(): void {
		// eslint-disable-next-line no-restricted-syntax
		const element = mainWindow.document.getElementById(PartsSplash._splashElementId);
		if (element) {
			element.style.display = 'none';
		}

		// remove initial colors
		// eslint-disable-next-line no-restricted-syntax
		const defaultStyles = mainWindow.document.head.getElementsByClassName('initialShellColors');
		defaultStyles[0]?.remove();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/splash/browser/splash.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/splash/browser/splash.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { ISplashStorageService } from './splash.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { PartsSplash } from './partsSplash.js';
import { IPartsSplash } from '../../../../platform/theme/common/themeService.js';

registerSingleton(ISplashStorageService, class SplashStorageService implements ISplashStorageService {

	declare readonly _serviceBrand: undefined;

	async saveWindowSplash(splash: IPartsSplash): Promise<void> {
		const raw = JSON.stringify(splash);
		localStorage.setItem('monaco-parts-splash', raw);
	}

}, InstantiationType.Delayed);

registerWorkbenchContribution2(
	PartsSplash.ID,
	PartsSplash,
	WorkbenchPhase.BlockStartup
);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/splash/browser/splash.ts]---
Location: vscode-main/src/vs/workbench/contrib/splash/browser/splash.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IPartsSplash } from '../../../../platform/theme/common/themeService.js';

export const ISplashStorageService = createDecorator<ISplashStorageService>('ISplashStorageService');

export interface ISplashStorageService {

	readonly _serviceBrand: undefined;

	saveWindowSplash(splash: IPartsSplash): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/splash/electron-browser/splash.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/splash/electron-browser/splash.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { ISplashStorageService } from '../browser/splash.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { PartsSplash } from '../browser/partsSplash.js';
import { IPartsSplash } from '../../../../platform/theme/common/themeService.js';

class SplashStorageService implements ISplashStorageService {

	_serviceBrand: undefined;

	readonly saveWindowSplash: (splash: IPartsSplash) => Promise<void>;

	constructor(@INativeHostService nativeHostService: INativeHostService) {
		this.saveWindowSplash = nativeHostService.saveWindowSplash.bind(nativeHostService);
	}
}

registerSingleton(ISplashStorageService, SplashStorageService, InstantiationType.Delayed);

registerWorkbenchContribution2(
	PartsSplash.ID,
	PartsSplash,
	WorkbenchPhase.BlockStartup
);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/surveys/browser/languageSurveys.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/surveys/browser/languageSurveys.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { language } from '../../../../base/common/platform.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { IWorkbenchContributionsRegistry, IWorkbenchContribution, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { ISurveyData } from '../../../../base/common/product.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { Severity, INotificationService, NotificationPriority } from '../../../../platform/notification/common/notification.js';
import { ITextFileService, ITextFileEditorModel } from '../../../services/textfile/common/textfiles.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { URI } from '../../../../base/common/uri.js';
import { platform } from '../../../../base/common/process.js';
import { RunOnceWorker } from '../../../../base/common/async.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';

class LanguageSurvey extends Disposable {

	constructor(
		data: ISurveyData,
		storageService: IStorageService,
		notificationService: INotificationService,
		telemetryService: ITelemetryService,
		languageService: ILanguageService,
		textFileService: ITextFileService,
		openerService: IOpenerService,
		productService: IProductService
	) {
		super();

		const SESSION_COUNT_KEY = `${data.surveyId}.sessionCount`;
		const LAST_SESSION_DATE_KEY = `${data.surveyId}.lastSessionDate`;
		const SKIP_VERSION_KEY = `${data.surveyId}.skipVersion`;
		const IS_CANDIDATE_KEY = `${data.surveyId}.isCandidate`;
		const EDITED_LANGUAGE_COUNT_KEY = `${data.surveyId}.editedCount`;
		const EDITED_LANGUAGE_DATE_KEY = `${data.surveyId}.editedDate`;

		const skipVersion = storageService.get(SKIP_VERSION_KEY, StorageScope.APPLICATION, '');
		if (skipVersion) {
			return;
		}

		const date = new Date().toDateString();

		if (storageService.getNumber(EDITED_LANGUAGE_COUNT_KEY, StorageScope.APPLICATION, 0) < data.editCount) {

			// Process model-save event every 250ms to reduce load
			const onModelsSavedWorker = this._register(new RunOnceWorker<ITextFileEditorModel>(models => {
				models.forEach(m => {
					if (m.getLanguageId() === data.languageId && date !== storageService.get(EDITED_LANGUAGE_DATE_KEY, StorageScope.APPLICATION)) {
						const editedCount = storageService.getNumber(EDITED_LANGUAGE_COUNT_KEY, StorageScope.APPLICATION, 0) + 1;
						storageService.store(EDITED_LANGUAGE_COUNT_KEY, editedCount, StorageScope.APPLICATION, StorageTarget.USER);
						storageService.store(EDITED_LANGUAGE_DATE_KEY, date, StorageScope.APPLICATION, StorageTarget.USER);
					}
				});
			}, 250));

			this._register(textFileService.files.onDidSave(e => onModelsSavedWorker.work(e.model)));
		}

		const lastSessionDate = storageService.get(LAST_SESSION_DATE_KEY, StorageScope.APPLICATION, new Date(0).toDateString());
		if (date === lastSessionDate) {
			return;
		}

		const sessionCount = storageService.getNumber(SESSION_COUNT_KEY, StorageScope.APPLICATION, 0) + 1;
		storageService.store(LAST_SESSION_DATE_KEY, date, StorageScope.APPLICATION, StorageTarget.USER);
		storageService.store(SESSION_COUNT_KEY, sessionCount, StorageScope.APPLICATION, StorageTarget.USER);

		if (sessionCount < 9) {
			return;
		}

		if (storageService.getNumber(EDITED_LANGUAGE_COUNT_KEY, StorageScope.APPLICATION, 0) < data.editCount) {
			return;
		}

		const isCandidate = storageService.getBoolean(IS_CANDIDATE_KEY, StorageScope.APPLICATION, false)
			|| Math.random() < data.userProbability;

		storageService.store(IS_CANDIDATE_KEY, isCandidate, StorageScope.APPLICATION, StorageTarget.USER);

		if (!isCandidate) {
			storageService.store(SKIP_VERSION_KEY, productService.version, StorageScope.APPLICATION, StorageTarget.USER);
			return;
		}

		notificationService.prompt(
			Severity.Info,
			localize('helpUs', "Help us improve our support for {0}", languageService.getLanguageName(data.languageId) ?? data.languageId),
			[{
				label: localize('takeShortSurvey', "Take Short Survey"),
				run: () => {
					telemetryService.publicLog(`${data.surveyId}.survey/takeShortSurvey`);
					openerService.open(URI.parse(`${data.surveyUrl}?o=${encodeURIComponent(platform)}&v=${encodeURIComponent(productService.version)}&m=${encodeURIComponent(telemetryService.machineId)}`));
					storageService.store(IS_CANDIDATE_KEY, false, StorageScope.APPLICATION, StorageTarget.USER);
					storageService.store(SKIP_VERSION_KEY, productService.version, StorageScope.APPLICATION, StorageTarget.USER);
				}
			}, {
				label: localize('remindLater', "Remind Me Later"),
				run: () => {
					telemetryService.publicLog(`${data.surveyId}.survey/remindMeLater`);
					storageService.store(SESSION_COUNT_KEY, sessionCount - 3, StorageScope.APPLICATION, StorageTarget.USER);
				}
			}, {
				label: localize('neverAgain', "Don't Show Again"),
				isSecondary: true,
				run: () => {
					telemetryService.publicLog(`${data.surveyId}.survey/dontShowAgain`);
					storageService.store(IS_CANDIDATE_KEY, false, StorageScope.APPLICATION, StorageTarget.USER);
					storageService.store(SKIP_VERSION_KEY, productService.version, StorageScope.APPLICATION, StorageTarget.USER);
				}
			}],
			{ priority: NotificationPriority.OPTIONAL }
		);
	}
}

class LanguageSurveysContribution implements IWorkbenchContribution {

	constructor(
		@IStorageService private readonly storageService: IStorageService,
		@INotificationService private readonly notificationService: INotificationService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@ITextFileService private readonly textFileService: ITextFileService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IProductService private readonly productService: IProductService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IExtensionService private readonly extensionService: IExtensionService
	) {
		this.handleSurveys();
	}

	private async handleSurveys() {
		if (!this.productService.surveys) {
			return;
		}

		// Make sure to wait for installed extensions
		// being registered to show notifications
		// properly (https://github.com/microsoft/vscode/issues/121216)
		await this.extensionService.whenInstalledExtensionsRegistered();

		// Handle surveys
		this.productService.surveys
			.filter(surveyData => surveyData.surveyId && surveyData.editCount && surveyData.languageId && surveyData.surveyUrl && surveyData.userProbability)
			.map(surveyData => new LanguageSurvey(surveyData, this.storageService, this.notificationService, this.telemetryService, this.languageService, this.textFileService, this.openerService, this.productService));
	}
}

if (language === 'en') {
	const workbenchRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
	workbenchRegistry.registerWorkbenchContribution(LanguageSurveysContribution, LifecyclePhase.Restored);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/surveys/browser/nps.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/surveys/browser/nps.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { language } from '../../../../base/common/platform.js';
import { IWorkbenchContributionsRegistry, IWorkbenchContribution, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { Severity, INotificationService, NotificationPriority } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { URI } from '../../../../base/common/uri.js';
import { platform } from '../../../../base/common/process.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';

const PROBABILITY = 0.15;
const SESSION_COUNT_KEY = 'nps/sessionCount';
const LAST_SESSION_DATE_KEY = 'nps/lastSessionDate';
const SKIP_VERSION_KEY = 'nps/skipVersion';
const IS_CANDIDATE_KEY = 'nps/isCandidate';

class NPSContribution implements IWorkbenchContribution {

	constructor(
		@IStorageService storageService: IStorageService,
		@INotificationService notificationService: INotificationService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IOpenerService openerService: IOpenerService,
		@IProductService productService: IProductService,
		@IConfigurationService configurationService: IConfigurationService
	) {
		if (!productService.npsSurveyUrl || !configurationService.getValue<boolean>('telemetry.feedback.enabled')) {
			return;
		}

		const skipVersion = storageService.get(SKIP_VERSION_KEY, StorageScope.APPLICATION, '');
		if (skipVersion) {
			return;
		}

		const date = new Date().toDateString();
		const lastSessionDate = storageService.get(LAST_SESSION_DATE_KEY, StorageScope.APPLICATION, new Date(0).toDateString());

		if (date === lastSessionDate) {
			return;
		}

		const sessionCount = (storageService.getNumber(SESSION_COUNT_KEY, StorageScope.APPLICATION, 0) || 0) + 1;
		storageService.store(LAST_SESSION_DATE_KEY, date, StorageScope.APPLICATION, StorageTarget.USER);
		storageService.store(SESSION_COUNT_KEY, sessionCount, StorageScope.APPLICATION, StorageTarget.USER);

		if (sessionCount < 9) {
			return;
		}

		const isCandidate = storageService.getBoolean(IS_CANDIDATE_KEY, StorageScope.APPLICATION, false)
			|| Math.random() < PROBABILITY;

		storageService.store(IS_CANDIDATE_KEY, isCandidate, StorageScope.APPLICATION, StorageTarget.USER);

		if (!isCandidate) {
			storageService.store(SKIP_VERSION_KEY, productService.version, StorageScope.APPLICATION, StorageTarget.USER);
			return;
		}

		notificationService.prompt(
			Severity.Info,
			nls.localize('surveyQuestion', "Do you mind taking a quick feedback survey?"),
			[{
				label: nls.localize('takeSurvey', "Take Survey"),
				run: () => {
					openerService.open(URI.parse(`${productService.npsSurveyUrl}?o=${encodeURIComponent(platform)}&v=${encodeURIComponent(productService.version)}&m=${encodeURIComponent(telemetryService.machineId)}`));
					storageService.store(IS_CANDIDATE_KEY, false, StorageScope.APPLICATION, StorageTarget.USER);
					storageService.store(SKIP_VERSION_KEY, productService.version, StorageScope.APPLICATION, StorageTarget.USER);
				}
			}, {
				label: nls.localize('remindLater', "Remind Me Later"),
				run: () => storageService.store(SESSION_COUNT_KEY, sessionCount - 3, StorageScope.APPLICATION, StorageTarget.USER)
			}, {
				label: nls.localize('neverAgain', "Don't Show Again"),
				run: () => {
					storageService.store(IS_CANDIDATE_KEY, false, StorageScope.APPLICATION, StorageTarget.USER);
					storageService.store(SKIP_VERSION_KEY, productService.version, StorageScope.APPLICATION, StorageTarget.USER);
				}
			}],
			{ priority: NotificationPriority.URGENT }
		);
	}
}

if (language === 'en') {
	const workbenchRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
	workbenchRegistry.registerWorkbenchContribution(NPSContribution, LifecyclePhase.Restored);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tags/browser/workspaceTagsService.ts]---
Location: vscode-main/src/vs/workbench/contrib/tags/browser/workspaceTagsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WorkbenchState, IWorkspace } from '../../../../platform/workspace/common/workspace.js';
import { URI } from '../../../../base/common/uri.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IWorkspaceTagsService, Tags } from '../common/workspaceTags.js';

export class NoOpWorkspaceTagsService implements IWorkspaceTagsService {

	declare readonly _serviceBrand: undefined;

	getTags(): Promise<Tags> {
		return Promise.resolve({});
	}

	async getTelemetryWorkspaceId(workspace: IWorkspace, state: WorkbenchState): Promise<string | undefined> {
		return undefined;
	}

	getHashedRemotesFromUri(workspaceUri: URI, stripEndingDotGit?: boolean): Promise<string[]> {
		return Promise.resolve([]);
	}
}

registerSingleton(IWorkspaceTagsService, NoOpWorkspaceTagsService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tags/common/javaWorkspaceTags.ts]---
Location: vscode-main/src/vs/workbench/contrib/tags/common/javaWorkspaceTags.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const GradleDependencyLooseRegex = /group\s*:\s*[\'\"](.*?)[\'\"]\s*,\s*name\s*:\s*[\'\"](.*?)[\'\"]\s*,\s*version\s*:\s*[\'\"](.*?)[\'\"]/g;
export const GradleDependencyCompactRegex = /[\'\"]([^\'\"\s]*?)\:([^\'\"\s]*?)\:([^\'\"\s]*?)[\'\"]/g;

export const MavenDependenciesRegex = /<dependencies>([\s\S]*?)<\/dependencies>/g;
export const MavenDependencyRegex = /<dependency>([\s\S]*?)<\/dependency>/g;
export const MavenGroupIdRegex = /<groupId>([\s\S]*?)<\/groupId>/;
export const MavenArtifactIdRegex = /<artifactId>([\s\S]*?)<\/artifactId>/;

export const JavaLibrariesToLookFor: { predicate: (groupId: string, artifactId: string) => boolean; tag: string }[] = [
	// azure mgmt sdk
	{ 'predicate': (groupId, artifactId) => groupId === 'com.microsoft.azure' && artifactId === 'azure', 'tag': 'azure' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.microsoft.azure' && artifactId.startsWith('azure-mgmt-'), 'tag': 'azure' },
	{ 'predicate': (groupId, artifactId) => groupId.startsWith('com.microsoft.azure') && artifactId.startsWith('azure-mgmt-'), 'tag': 'azure' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure.resourcemanager' && artifactId.startsWith('azure-resourcemanager'), 'tag': 'azure' }, // azure track2 sdk
	// java ee
	{ 'predicate': (groupId, artifactId) => groupId === 'javax' && artifactId === 'javaee-api', 'tag': 'javaee' },
	{ 'predicate': (groupId, artifactId) => groupId === 'javax.xml.bind' && artifactId === 'jaxb-api', 'tag': 'javaee' },
	// jdbc
	{ 'predicate': (groupId, artifactId) => groupId === 'mysql' && artifactId === 'mysql-connector-java', 'tag': 'jdbc' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.microsoft.sqlserver' && artifactId === 'mssql-jdbc', 'tag': 'jdbc' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.oracle.database.jdbc' && artifactId.startsWith('ojdbc'), 'tag': 'jdbc' },
	// jpa
	{ 'predicate': (groupId, artifactId) => groupId === 'org.hibernate', 'tag': 'jpa' },
	{ 'predicate': (groupId, artifactId) => groupId === 'org.eclipse.persistence' && artifactId === 'eclipselink', 'tag': 'jpa' },
	// lombok
	{ 'predicate': (groupId, artifactId) => groupId === 'org.projectlombok', 'tag': 'lombok' },
	// redis
	{ 'predicate': (groupId, artifactId) => groupId === 'org.springframework.data' && artifactId === 'spring-data-redis', 'tag': 'redis' },
	{ 'predicate': (groupId, artifactId) => groupId === 'redis.clients' && artifactId === 'jedis', 'tag': 'redis' },
	{ 'predicate': (groupId, artifactId) => groupId === 'org.redisson', 'tag': 'redis' },
	{ 'predicate': (groupId, artifactId) => groupId === 'io.lettuce' && artifactId === 'lettuce-core', 'tag': 'redis' },
	// spring boot
	{ 'predicate': (groupId, artifactId) => groupId === 'org.springframework.boot', 'tag': 'springboot' },
	// sql
	{ 'predicate': (groupId, artifactId) => groupId === 'org.jooq', 'tag': 'sql' },
	{ 'predicate': (groupId, artifactId) => groupId === 'org.mybatis', 'tag': 'sql' },
	// unit test
	{ 'predicate': (groupId, artifactId) => groupId === 'org.junit.jupiter' && artifactId === 'junit-jupiter-api', 'tag': 'unitTest' },
	{ 'predicate': (groupId, artifactId) => groupId === 'junit' && artifactId === 'junit', 'tag': 'unitTest' },
	{ 'predicate': (groupId, artifactId) => groupId === 'org.testng' && artifactId === 'testng', 'tag': 'unitTest' },
	// cosmos
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure' && artifactId.includes('cosmos'), 'tag': 'azure-cosmos' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure.spring' && artifactId.includes('cosmos'), 'tag': 'azure-cosmos' },
	// storage account
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure' && artifactId.includes('azure-storage'), 'tag': 'azure-storage' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure.spring' && artifactId.includes('storage'), 'tag': 'azure-storage' },
	// service bus
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure' && artifactId === 'azure-messaging-servicebus', 'tag': 'azure-servicebus' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure.spring' && artifactId.includes('servicebus'), 'tag': 'azure-servicebus' },
	// event hubs
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure' && artifactId.startsWith('azure-messaging-eventhubs'), 'tag': 'azure-eventhubs' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure.spring' && artifactId.includes('eventhubs'), 'tag': 'azure-eventhubs' },
	// ai related libraries
	{ 'predicate': (groupId, artifactId) => groupId === 'dev.langchain4j', 'tag': 'langchain4j' },
	{ 'predicate': (groupId, artifactId) => groupId === 'io.springboot.ai', 'tag': 'springboot-ai' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.microsoft.semantic-kernel', 'tag': 'semantic-kernel' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure' && artifactId === 'azure-ai-anomalydetector', 'tag': 'azure-ai-anomalydetector' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure' && artifactId === 'azure-ai-formrecognizer', 'tag': 'azure-ai-formrecognizer' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure' && artifactId === 'azure-ai-documentintelligence', 'tag': 'azure-ai-documentintelligence' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure' && artifactId === 'azure-ai-translation-document', 'tag': 'azure-ai-translation-document' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure' && artifactId === 'azure-ai-personalizer', 'tag': 'azure-ai-personalizer' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure' && artifactId === 'azure-ai-translation-text', 'tag': 'azure-ai-translation-text' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure' && artifactId === 'azure-ai-contentsafety', 'tag': 'azure-ai-contentsafety' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure' && artifactId === 'azure-ai-vision-imageanalysis', 'tag': 'azure-ai-vision-imageanalysis' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure' && artifactId === 'azure-ai-textanalytics', 'tag': 'azure-ai-textanalytics' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure' && artifactId === 'azure-search-documents', 'tag': 'azure-search-documents' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure' && artifactId === 'azure-ai-documenttranslator', 'tag': 'azure-ai-documenttranslator' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure' && artifactId === 'azure-ai-vision-face', 'tag': 'azure-ai-vision-face' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure' && artifactId === 'azure-ai-openai-assistants', 'tag': 'azure-ai-openai-assistants' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.microsoft.azure.cognitiveservices', 'tag': 'azure-cognitiveservices' },
	{ 'predicate': (groupId, artifactId) => groupId === 'com.microsoft.cognitiveservices.speech', 'tag': 'azure-cognitiveservices-speech' },
	// open ai
	{ 'predicate': (groupId, artifactId) => groupId === 'com.theokanning.openai-gpt3-java', 'tag': 'openai' },
	// azure open ai
	{ 'predicate': (groupId, artifactId) => groupId === 'com.azure' && artifactId === 'azure-ai-openai', 'tag': 'azure-openai' },
	// Azure Functions
	{ 'predicate': (groupId, artifactId) => groupId === 'com.microsoft.azure.functions' && artifactId === 'azure-functions-java-library', 'tag': 'azure-functions' },
	// quarkus
	{ 'predicate': (groupId, artifactId) => groupId === 'io.quarkus', 'tag': 'quarkus' },
	// microprofile
	{ 'predicate': (groupId, artifactId) => groupId.startsWith('org.eclipse.microprofile'), 'tag': 'microprofile' },
	// micronaut
	{ 'predicate': (groupId, artifactId) => groupId === 'io.micronaut', 'tag': 'micronaut' },
	// GraalVM
	{ 'predicate': (groupId, artifactId) => groupId.startsWith('org.graalvm'), 'tag': 'graalvm' }
];
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tags/common/workspaceTags.ts]---
Location: vscode-main/src/vs/workbench/contrib/tags/common/workspaceTags.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WorkbenchState, IWorkspace } from '../../../../platform/workspace/common/workspace.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { URI } from '../../../../base/common/uri.js';
import { getRemotes } from '../../../../platform/extensionManagement/common/configRemotes.js';

export type Tags = { [index: string]: boolean | number | string | undefined };

export const IWorkspaceTagsService = createDecorator<IWorkspaceTagsService>('workspaceTagsService');

export interface IWorkspaceTagsService {
	readonly _serviceBrand: undefined;

	getTags(): Promise<Tags>;

	/**
	 * Returns an id for the workspace, different from the id returned by the context service. A hash based
	 * on the folder uri or workspace configuration, not time-based, and undefined for empty workspaces.
	 */
	getTelemetryWorkspaceId(workspace: IWorkspace, state: WorkbenchState): Promise<string | undefined>;

	getHashedRemotesFromUri(workspaceUri: URI, stripEndingDotGit?: boolean): Promise<string[]>;
}

export async function getHashedRemotesFromConfig(text: string, stripEndingDotGit: boolean = false, sha1Hex: (str: string) => Promise<string>): Promise<string[]> {
	return Promise.all(getRemotes(text, stripEndingDotGit).map(remote => sha1Hex(remote)));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tags/electron-browser/tags.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/tags/electron-browser/tags.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { WorkspaceTags } from './workspaceTags.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';

// Register Workspace Tags Contribution
Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(WorkspaceTags, LifecyclePhase.Eventually);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/tags/electron-browser/workspaceTags.ts]---
Location: vscode-main/src/vs/workbench/contrib/tags/electron-browser/workspaceTags.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { onUnexpectedError } from '../../../../base/common/errors.js';
import { URI } from '../../../../base/common/uri.js';
import { IFileService, IFileStat } from '../../../../platform/files/common/files.js';
import { ITelemetryService, TelemetryLevel } from '../../../../platform/telemetry/common/telemetry.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { ITextFileService, } from '../../../services/textfile/common/textfiles.js';
import { IWorkspaceTagsService, Tags, getHashedRemotesFromConfig as baseGetHashedRemotesFromConfig } from '../common/workspaceTags.js';
import { IDiagnosticsService, IWorkspaceInformation } from '../../../../platform/diagnostics/common/diagnostics.js';
import { IRequestService } from '../../../../platform/request/common/request.js';
import { isWindows } from '../../../../base/common/platform.js';
import { AllowedSecondLevelDomains, getDomainsOfRemotes } from '../../../../platform/extensionManagement/common/configRemotes.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { hashAsync } from '../../../../base/common/hash.js';

export async function getHashedRemotesFromConfig(text: string, stripEndingDotGit: boolean = false): Promise<string[]> {
	return baseGetHashedRemotesFromConfig(text, stripEndingDotGit, hashAsync);
}

export class WorkspaceTags implements IWorkbenchContribution {

	constructor(
		@IFileService private readonly fileService: IFileService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IRequestService private readonly requestService: IRequestService,
		@ITextFileService private readonly textFileService: ITextFileService,
		@IWorkspaceTagsService private readonly workspaceTagsService: IWorkspaceTagsService,
		@IDiagnosticsService private readonly diagnosticsService: IDiagnosticsService,
		@IProductService private readonly productService: IProductService,
		@INativeHostService private readonly nativeHostService: INativeHostService
	) {
		if (this.telemetryService.telemetryLevel === TelemetryLevel.USAGE) {
			this.report();
		}
	}

	private async report(): Promise<void> {
		// Windows-only Edition Event
		this.reportWindowsEdition();

		// Workspace Tags
		this.workspaceTagsService.getTags()
			.then(tags => this.reportWorkspaceTags(tags), error => onUnexpectedError(error));

		// Cloud Stats
		this.reportCloudStats();

		this.reportProxyStats();

		this.getWorkspaceInformation().then(stats => this.diagnosticsService.reportWorkspaceStats(stats));
	}

	private async reportWindowsEdition(): Promise<void> {
		if (!isWindows) {
			return;
		}

		let value = await this.nativeHostService.windowsGetStringRegKey('HKEY_LOCAL_MACHINE', 'SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion', 'EditionID');
		if (value === undefined) {
			value = 'Unknown';
		}

		this.telemetryService.publicLog2<{ edition: string }, { owner: 'sbatten'; comment: 'Information about the Windows edition.'; edition: { classification: 'SystemMetaData'; purpose: 'BusinessInsight'; comment: 'The Windows edition.' } }>('windowsEdition', { edition: value });
	}

	private async getWorkspaceInformation(): Promise<IWorkspaceInformation> {
		const workspace = this.contextService.getWorkspace();
		const state = this.contextService.getWorkbenchState();
		const telemetryId = await this.workspaceTagsService.getTelemetryWorkspaceId(workspace, state);

		return {
			id: workspace.id,
			telemetryId,
			rendererSessionId: this.telemetryService.sessionId,
			folders: workspace.folders,
			transient: workspace.transient,
			configuration: workspace.configuration
		};
	}

	private reportWorkspaceTags(tags: Tags): void {
		/* __GDPR__
			"workspce.tags" : {
				"owner": "lramos15",
				"${include}": [
					"${WorkspaceTags}"
				]
			}
		*/
		this.telemetryService.publicLog('workspce.tags', tags);
	}

	private reportRemoteDomains(workspaceUris: URI[]): void {
		Promise.all<string[]>(workspaceUris.map(workspaceUri => {
			const path = workspaceUri.path;
			const uri = workspaceUri.with({ path: `${path !== '/' ? path : ''}/.git/config` });
			return this.fileService.exists(uri).then(exists => {
				if (!exists) {
					return [];
				}
				return this.textFileService.read(uri, { acceptTextOnly: true }).then(
					content => getDomainsOfRemotes(content.value, AllowedSecondLevelDomains),
					err => [] // ignore missing or binary file
				);
			});
		})).then(domains => {
			const set = domains.reduce((set, list) => list.reduce((set, item) => set.add(item), set), new Set<string>());
			const list: string[] = [];
			set.forEach(item => list.push(item));
			/* __GDPR__
				"workspace.remotes" : {
					"owner": "lramos15",
					"domains" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
				}
			*/
			this.telemetryService.publicLog('workspace.remotes', { domains: list.sort() });
		}, onUnexpectedError);
	}

	private reportRemotes(workspaceUris: URI[]): void {
		Promise.all<string[]>(workspaceUris.map(workspaceUri => {
			return this.workspaceTagsService.getHashedRemotesFromUri(workspaceUri, true);
		})).then(() => { }, onUnexpectedError);
	}

	/* __GDPR__FRAGMENT__
		"AzureTags" : {
			"node" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true }
		}
	*/
	private reportAzureNode(workspaceUris: URI[], tags: Tags): Promise<Tags> {
		// TODO: should also work for `node_modules` folders several levels down
		const uris = workspaceUris.map(workspaceUri => {
			const path = workspaceUri.path;
			return workspaceUri.with({ path: `${path !== '/' ? path : ''}/node_modules` });
		});
		return this.fileService.resolveAll(uris.map(resource => ({ resource }))).then(
			results => {
				const names = (<IFileStat[]>[]).concat(...results.map(result => result.success ? (result.stat!.children || []) : [])).map(c => c.name);
				const referencesAzure = WorkspaceTags.searchArray(names, /azure/i);
				if (referencesAzure) {
					tags['node'] = true;
				}
				return tags;
			},
			err => {
				return tags;
			});
	}

	private static searchArray(arr: string[], regEx: RegExp): boolean | undefined {
		return arr.some(v => v.search(regEx) > -1) || undefined;
	}

	/* __GDPR__FRAGMENT__
		"AzureTags" : {
			"java" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true }
		}
	*/
	private reportAzureJava(workspaceUris: URI[], tags: Tags): Promise<Tags> {
		return Promise.all(workspaceUris.map(workspaceUri => {
			const path = workspaceUri.path;
			const uri = workspaceUri.with({ path: `${path !== '/' ? path : ''}/pom.xml` });
			return this.fileService.exists(uri).then(exists => {
				if (!exists) {
					return false;
				}
				return this.textFileService.read(uri, { acceptTextOnly: true }).then(
					content => !!content.value.match(/azure/i),
					err => false
				);
			});
		})).then(javas => {
			if (javas.indexOf(true) !== -1) {
				tags['java'] = true;
			}
			return tags;
		});
	}

	private reportAzure(uris: URI[]) {
		const tags: Tags = Object.create(null);
		this.reportAzureNode(uris, tags).then((tags) => {
			return this.reportAzureJava(uris, tags);
		}).then((tags) => {
			if (Object.keys(tags).length) {
				/* __GDPR__
					"workspace.azure" : {
						"owner": "lramos15",
						"${include}": [
							"${AzureTags}"
						]
					}
				*/
				this.telemetryService.publicLog('workspace.azure', tags);
			}
		}).then(undefined, onUnexpectedError);
	}

	private reportCloudStats(): void {
		const uris = this.contextService.getWorkspace().folders.map(folder => folder.uri);
		if (uris.length && this.fileService) {
			this.reportRemoteDomains(uris);
			this.reportRemotes(uris);
			this.reportAzure(uris);
		}
	}

	private reportProxyStats() {
		const downloadUrl = this.productService.downloadUrl;
		if (!downloadUrl) {
			return;
		}
		this.requestService.resolveProxy(downloadUrl)
			.then(proxy => {
				let type = proxy ? String(proxy).trim().split(/\s+/, 1)[0] : 'EMPTY';
				if (['DIRECT', 'PROXY', 'HTTPS', 'SOCKS', 'EMPTY'].indexOf(type) === -1) {
					type = 'UNKNOWN';
				}
			}).then(undefined, onUnexpectedError);
	}
}
```

--------------------------------------------------------------------------------

````
