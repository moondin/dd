---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 87
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 87 of 552)

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

---[FILE: extensions/terminal-suggest/src/fig/api-bindings/types.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/api-bindings/types.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface EnvironmentVariable {
	key: string;
	value?: string;
}

export interface ShellContext {
	/** The current PID of the shell process */
	pid?: number;
	/** /dev/ttys## of terminal session */
	ttys?: string;
	/** the name of the process */
	processName?: string;
	/** the directory where the user ran the command */
	currentWorkingDirectory?: string;
	/** the value of $TERM_SESSION_ID */
	sessionId?: string;
	/** the integration version of figterm */
	integrationVersion?: number;
	/** the parent terminal of figterm */
	terminal?: string;
	/** the hostname of the computer figterm is running on */
	hostname?: string;
	/** path to the shell being used in the terminal */
	shellPath?: string;
	/** the environment variables of the shell, note that only exported variables are included */
	environmentVariables?: EnvironmentVariable[];
	/** the raw output of alias */
	alias?: string;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/autocomplete/fig/hooks.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/autocomplete/fig/hooks.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as Types from '../../api-bindings/types';
import type { AliasMap } from '../../shell-parser';

export type FigState = {
	buffer: string;
	cursorLocation: number;
	cwd: string | null;
	processUserIsIn: string | null;
	sshContextString: string | null;
	aliases: AliasMap;
	environmentVariables: Record<string, string>;
	shellContext?: Types.ShellContext | undefined;
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/autocomplete/generators/cache.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/autocomplete/generators/cache.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

class CacheEntry<T> {
	private lastFetch = 0;

	private promise: Promise<T> | undefined = undefined;

	value: T | undefined = undefined;

	private isInitialized = false;

	private get isFetching() {
		return !!this.promise;
	}

	private async fetchSync(run: () => Promise<T>) {
		this.lastFetch = Date.now();
		this.promise = run();
		this.value = await this.promise;
		if (!this.isInitialized) {
			this.isInitialized = true;
		}
		this.promise = undefined;
		return this.value;
	}

	private async fetchAsync(run: () => Promise<T>): Promise<T | undefined> {
		if (this.isFetching) {
			await this.promise;
			return this.value;
		}
		return this.fetchSync(run);
	}

	private async maxAgeCache(run: () => Promise<T>, maxAge: number) {
		if (Date.now() > maxAge + this.lastFetch) {
			return this.fetchAsync(run);
		}
		return this.value;
	}

	private async swrCache(run: () => Promise<T>, maxAge = 0) {
		if (!this.isFetching && Date.now() > this.lastFetch + maxAge) {
			return this.fetchAsync(run);
		}
		return this.value as T;
	}

	async entry(run: () => Promise<T>, cache: Fig.Cache): Promise<T | undefined> {
		if (!this.isInitialized) {
			return this.fetchAsync(run);
		}
		switch (cache.strategy || 'stale-while-revalidate') {
			case 'max-age':
				return this.maxAgeCache(run, cache.ttl!);
			case 'stale-while-revalidate':
				// cache.ttl must be defined when no strategy is specified
				return this.swrCache(run, cache.ttl!);
			default:
				return this.fetchAsync(run);
		}
	}
}

export class Cache {
	private cache = new Map<string, CacheEntry<unknown>>();

	async entry<T>(
		key: string,
		run: () => Promise<T>,
		cache: Fig.Cache,
	): Promise<T> {
		if (!this.cache.has(key)) {
			this.cache.set(key, new CacheEntry());
		}
		return this.cache.get(key)!.entry(run, cache) as Promise<T>;
	}

	currentValue<T>(key: string, _cache: Fig.Cache): T | undefined {
		if (!this.cache.has(key)) {
			this.cache.set(key, new CacheEntry());
		}
		return this.cache.get(key)!.value as T | undefined;
	}

	clear() {
		this.cache.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/autocomplete/generators/customSuggestionsGenerator.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/autocomplete/generators/customSuggestionsGenerator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { IFigExecuteExternals } from '../../execute';
import {
	runCachedGenerator,
	GeneratorContext,
	haveContextForGenerator,
} from './helpers';

export async function getCustomSuggestions(
	generator: Fig.Generator,
	context: GeneratorContext,
	executableExternals: IFigExecuteExternals
): Promise<Fig.Suggestion[] | undefined> {
	if (!generator.custom) {
		return [];
	}

	if (!haveContextForGenerator(context)) {
		console.info('Don\'t have context for custom generator');
		return [];
	}

	const {
		tokenArray,
		currentWorkingDirectory,
		currentProcess,
		isDangerous,
		searchTerm,
		environmentVariables,
	} = context;

	try {
		const result = await runCachedGenerator(
			generator,
			context,
			() =>
				generator.custom!(tokenArray, executableExternals.executeCommand, {
					currentWorkingDirectory,
					currentProcess,
					sshPrefix: '',
					searchTerm,
					environmentVariables,
					isDangerous,
				}),
			generator.cache?.cacheKey,
		);

		return result?.map((name) => ({ ...name, type: name?.type || 'arg' }));
	} catch (e) {
		console.error('we had an error with the custom function generator', e);

		return [];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/autocomplete/generators/helpers.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/autocomplete/generators/helpers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Cache } from './cache';
import type { Annotation } from '../../autocomplete-parser/parseArguments';
import type { Suggestion } from '../../shared/internal';
import { getCWDForFilesAndFolders } from '../../shared/utils';

export type GeneratorContext = Fig.ShellContext & {
	annotations: Annotation[];
	tokenArray: string[];
	isDangerous?: boolean;
	searchTerm: string;
};

export type GeneratorState = {
	generator: Fig.Generator;
	context: GeneratorContext;
	loading: boolean;
	result: Suggestion[];
	request?: Promise<Fig.Suggestion[] | undefined>;
};

export const haveContextForGenerator = (context: GeneratorContext): boolean =>
	Boolean(context.currentWorkingDirectory);

export const generatorCache = new Cache();

export async function runCachedGenerator<T>(
	generator: Fig.Generator,
	context: GeneratorContext,
	initialRun: () => Promise<T>,
	cacheKey?: string /* This is generator.script or generator.script(...) */,
): Promise<T> {
	const cacheDefault = false; // getSetting<boolean>(SETTINGS.CACHE_ALL_GENERATORS) ?? false;
	let { cache } = generator;
	if (!cache && cacheDefault) {
		cache = { strategy: 'stale-while-revalidate', ttl: 1_000 };
	}
	if (!cache) {
		return initialRun();
	}
	const { tokenArray, currentWorkingDirectory, searchTerm } = context;

	const directory = generator.template
		? getCWDForFilesAndFolders(currentWorkingDirectory, searchTerm)
		: currentWorkingDirectory;

	// we cache generator results by script, if no script was provided we use the tokens instead
	const key = [
		cache.cacheByDirectory ? directory : undefined,
		cacheKey || tokenArray.join(' '),
	].toString();

	return generatorCache.entry(key, initialRun, cache);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/autocomplete/generators/scriptSuggestionsGenerator.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/autocomplete/generators/scriptSuggestionsGenerator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { IFigExecuteExternals } from '../../execute';
import {
	GeneratorContext,
	haveContextForGenerator,
	runCachedGenerator,
} from './helpers';

export async function getScriptSuggestions(
	generator: Fig.Generator,
	context: GeneratorContext,
	defaultTimeout: number = 5000,
	executeExternals: IFigExecuteExternals
): Promise<Fig.Suggestion[] | undefined> {
	const { script, postProcess, splitOn } = generator;
	if (!script) {
		return [];
	}

	if (!haveContextForGenerator(context)) {
		console.info('Don\'t have context for custom generator');
		return [];
	}

	try {
		const { isDangerous, tokenArray, currentWorkingDirectory, environmentVariables } = context;
		// A script can either be a string or a function that returns a string.
		// If the script is a function, run it, and get the output string.
		const commandToRun =
			script && typeof script === 'function'
				? script(tokenArray)
				: script;

		if (!commandToRun) {
			return [];
		}

		let executeCommandInput: Fig.ExecuteCommandInput;
		if (Array.isArray(commandToRun)) {
			executeCommandInput = {
				command: commandToRun[0],
				args: commandToRun.slice(1),
				cwd: currentWorkingDirectory,
				env: environmentVariables
			};
		} else {
			executeCommandInput = {
				cwd: currentWorkingDirectory,
				...commandToRun,
			};
		}

		// Use the longest duration timeout
		const timeout = Math.max(
			defaultTimeout,
			generator.scriptTimeout ?? 0,
			executeCommandInput.timeout ?? 0,
		);

		const { stdout } = await runCachedGenerator(
			generator,
			context,
			() => {
				return executeExternals.executeCommandTimeout(executeCommandInput, timeout);
			},
			generator.cache?.cacheKey ?? JSON.stringify(executeCommandInput),
		);
		//
		let result: Array<Fig.Suggestion | string | null> | undefined = [];

		// If we have a splitOn function
		if (splitOn) {
			result = stdout.trim() === '' ? [] : stdout.trim().split(splitOn);
		} else if (postProcess) {
			// If we have a post process function
			// The function takes one input and outputs an array
			// runPipingConsoleMethods(() => {
			result = postProcess(stdout, tokenArray);
			// });
			result = result?.filter(
				(item) => item && (typeof item === 'string' || !!item.name),
			);
		}

		// Generator can either output an array of strings or an array of suggestion objects.
		return result?.map((item) =>
			typeof item === 'string'
				? { type: 'arg', name: item, insertValue: item, isDangerous }
				: { ...item, type: item?.type || 'arg' },
		);
	} catch (e) {
		console.error('we had an error with the script generator', e);
		return [];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/autocomplete/state/generators.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/autocomplete/state/generators.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getScriptSuggestions } from '../generators/scriptSuggestionsGenerator';
// import { getCustomSuggestions } from '../generators/customSuggestionsGenerator';
import { AutocompleteState } from './types';
import { GeneratorState, GeneratorContext } from '../generators/helpers';
import { sleep } from '../../shared/utils';
import type { ArgumentParserResult } from '../../autocomplete-parser/parseArguments';
import { getCustomSuggestions } from '../generators/customSuggestionsGenerator';
import { IFigExecuteExternals } from '../../execute';

export const shellContextSelector = ({
	figState,
}: AutocompleteState): Fig.ShellContext => ({
	currentWorkingDirectory: figState.cwd || '',
	currentProcess: figState.processUserIsIn || '',
	environmentVariables: figState.environmentVariables,
	sshPrefix: '',
});

const getGeneratorContext = (state: AutocompleteState): GeneratorContext => {
	const { command, parserResult } = state;
	const { currentArg, searchTerm, annotations, commandIndex } = parserResult;
	const tokens = command?.tokens ?? [];
	return {
		...shellContextSelector(state),
		annotations: annotations.slice(commandIndex),
		tokenArray: tokens.slice(commandIndex).map((token: any) => token.text),
		isDangerous: Boolean(currentArg?.isDangerous),
		searchTerm,
	};
};

export const createGeneratorState = (
	// setNamed: NamedSetState<AutocompleteState>,
	state: AutocompleteState,
	executeExternals?: IFigExecuteExternals
): {
	triggerGenerators: (result: ArgumentParserResult, executeExternals: IFigExecuteExternals) => GeneratorState[];
} => {
	// function updateGenerator(
	// 	generatorState: GeneratorState,
	// 	getUpdate: () => Partial<GeneratorState>,
	// ) {
	// 	return setNamed('updateGenerator', (state) => {
	// 		let { generatorStates } = state;
	// 		// Double check to make sure we don't update if things are stale
	// 		const index = generatorStates.findIndex((s) => s === generatorState);
	// 		if (index === -1) {
	// 			console.info('stale update', { generatorStates, generatorState });
	// 			return { generatorStates };
	// 		}

	// 		generatorStates = [...generatorStates];
	// 		// If we are still loading after update (e.g. debounced) then make sure
	// 		// we re-call this when we get a result.
	// 		generatorStates[index] = updateGeneratorOnResult({
	// 			...generatorState,
	// 			...getUpdate(),
	// 		});
	// 		console.info('updating generator', {
	// 			generatorState: generatorStates[index],
	// 		});
	// 		return { generatorStates };
	// 	});
	// }

	// function updateGeneratorOnResult(generatorState: GeneratorState) {
	// 	const { generator, loading, request } = generatorState;
	// 	if (loading && request) {
	// 		request.then((result) =>
	// 			updateGenerator(generatorState, () => ({
	// 				loading: false,
	// 				result: result?.map((suggestion) => ({ ...suggestion, generator })),
	// 			})),
	// 		);
	// 	}
	// 	return generatorState;
	// }
	const triggerGenerator = (currentState: GeneratorState, executeExternals: IFigExecuteExternals) => {
		const { generator, context } = currentState;
		let request: Promise<Fig.Suggestion[] | undefined>;

		if (generator.template) {
			// TODO: Implement template generators
			// request = getTemplateSuggestions(generator, context);
			request = Promise.resolve(undefined);
		}
		else if (generator.script) {
			request = getScriptSuggestions(
				generator,
				context,
				undefined, // getSetting<number>(SETTINGS.SCRIPT_TIMEOUT, 5000),
				executeExternals
			);
		}
		else {
			request = getCustomSuggestions(generator, context, executeExternals);
			// filepaths/folders templates are now a sugar for two custom generators, we need to filter
			// the suggestion created by those two custom generators
			// if (generator.filterTemplateSuggestions) {
			// 	request = (async () => {
			// 		// TODO: use symbols to detect if the the generator fn is filepaths/folders
			// 		// If the first custom suggestion has template meta properties then all the custom
			// 		// suggestions are too
			// 		const suggestions = await request;
			// 		if (suggestions[0] && isTemplateSuggestion(suggestions[0])) {
			// 			return generator.filterTemplateSuggestions!(
			// 				suggestions as Fig.TemplateSuggestion[],
			// 			);
			// 		}
			// 		return suggestions;
			// 	})();
			// }
		}
		return { ...currentState, loading: true, request };
	};

	const triggerGenerators = (
		parserResult: ArgumentParserResult,
		executeExternals: IFigExecuteExternals,
	): GeneratorState[] => {
		const {
			parserResult: { currentArg: previousArg, searchTerm: previousSearchTerm },
		} = state;
		const { currentArg, searchTerm } = parserResult;
		const generators = currentArg?.generators ?? [];
		const context = getGeneratorContext({ ...state, parserResult });

		return generators.map((generator: Fig.Generator, index: number) => {
			const { trigger } = generator;
			const previousGeneratorState = state.generatorStates[index];
			let shouldTrigger = false;
			if (!previousGeneratorState || currentArg !== previousArg) {
				shouldTrigger = true;
			} else if (trigger === undefined) {
				// If trigger is undefined we never trigger, unless debounced in
				// which case we always trigger.
				// TODO: move debounce to generator.
				shouldTrigger = Boolean(currentArg?.debounce);
			} else {
				let triggerFn: (a: string, b: string) => boolean;
				if (typeof trigger === 'string') {
					triggerFn = (a, b) =>
						a.lastIndexOf(trigger) !== b.lastIndexOf(trigger);
				} else if (typeof trigger === 'function') {
					triggerFn = trigger;
				} else {
					switch (trigger.on) {
						case 'threshold': {
							triggerFn = (a, b) =>
								a.length > trigger.length && !(b.length > trigger.length);
							break;
						}
						case 'match': {
							const strings =
								typeof trigger.string === 'string'
									? [trigger.string]
									: trigger.string;
							triggerFn = (a, b) =>
								strings.findIndex((x) => x === a) !==
								strings.findIndex((x) => x === b);
							break;
						}
						case 'change':
						default: {
							triggerFn = (a, b) => a !== b;
							break;
						}
					}
				}
				try {
					shouldTrigger = triggerFn(searchTerm, previousSearchTerm);
				} catch (_err) {
					shouldTrigger = true;
				}
			}

			if (!shouldTrigger) {
				return previousGeneratorState;
			}

			const result = previousGeneratorState?.result || [];
			const generatorState = { generator, context, result, loading: true };

			const getTriggeredState = () => triggerGenerator(generatorState, executeExternals);
			if (currentArg?.debounce) {
				sleep(
					typeof currentArg.debounce === 'number' && currentArg.debounce > 0
						? currentArg.debounce
						: 200,
				); //.then(() => updateGenerator(generatorState, getTriggeredState));
				return generatorState;
			}
			return getTriggeredState();
		});
	};
	return { triggerGenerators };
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/autocomplete/state/types.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/autocomplete/state/types.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { GeneratorState } from '../generators/helpers';
import type { ArgumentParserResult } from '../../autocomplete-parser/parseArguments';
import type { Suggestion } from '../../shared/internal';
import type { Command } from '../../shell-parser';
import type { FigState } from '../fig/hooks';

export enum Visibility {
	VISIBLE = 'visible',
	// Can happen in several cases:
	// 1. We've just inserted text
	// 2. User has backspaced to new token
	// 3. A large buffer change (scrolling through history, or pasting text)
	// 4. An error occurs
	HIDDEN_UNTIL_KEYPRESS = 'hidden_until_keypress',
	// Hide until explicitly shown (or we enter a new line), can happen when:
	// 1. The escape key is pressed
	// 2. A keybinding to hide autocomplete is pressed
	// 3. User enters a new token with onlyShowOnTab set
	HIDDEN_UNTIL_SHOWN = 'hidden_until_shown',
	// User inserted full suggestion. Wait until text is rendered, then hide
	// until keypress (2 state updates).
	HIDDEN_BY_INSERTION = 'insertion',
}

// type AutocompleteActions = {
// 	setParserResult: (
// 		parserResult: ArgumentParserResult,
// 		hasBackspacedToNewToken: boolean,
// 		largeBufferChange: boolean,
// 	) => void;
// 	error: (error: string) => void;
// 	setVisibleState: (visibleState: Visibility) => void;
// 	scroll: (index: number, visibleState: Visibility) => void;
// 	// setFigState: React.Dispatch<React.SetStateAction<FigState>>;
// 	updateVisibilityPostInsert: (
// 		suggestion: Suggestion,
// 		isFullCompletion: boolean,
// 	) => void;
// 	insertTextForItem: (item: Suggestion, execute?: boolean) => void;
// 	insertCommonPrefix: () => void;
// 	// setHistoryModeEnabled: React.Dispatch<React.SetStateAction<boolean>>;
// 	// setUserFuzzySearchEnabled: React.Dispatch<React.SetStateAction<boolean>>;
// 	// setSettings: React.Dispatch<React.SetStateAction<SettingsMap>>;
// };

export type AutocompleteState = {
	figState: FigState;
	parserResult: ArgumentParserResult;
	generatorStates: GeneratorState[];
	command: Command | null;

	visibleState: Visibility;
	lastInsertedSuggestion: Suggestion | null;
	justInserted: boolean;

	suggestions: Suggestion[];
	selectedIndex: number;
	hasChangedIndex: boolean;

	historyModeEnabled: boolean;
	/**
	 * Store the user preference about fuzzy search
	 */
	userFuzzySearchEnabled: boolean;
	/**
	 * Sometimes we override fuzzy search user
	 * preference so we also store the "real" current state of fuzzy search
	 */
	fuzzySearchEnabled: boolean;
	// settings: SettingsMap;
}; // & AutocompleteActions;

export declare type NamedSetState<T> = {
	(
		name: string,
		partial: Partial<T> | ((s: T) => Partial<T>),
		replace?: boolean,
	): void;
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/autocomplete-parser/caches.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/autocomplete-parser/caches.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Subcommand } from '../shared/internal';

const allCaches: Array<Map<string, unknown>> = [];

export const createCache = <T>() => {
	const cache = new Map<string, T>();
	allCaches.push(cache);
	return cache;
};

export const resetCaches = () => {
	allCaches.forEach((cache) => {
		cache.clear();
	});
};

// window.resetCaches = resetCaches;

export const specCache = createCache<Subcommand>();
export const generateSpecCache = createCache<Subcommand>();

// window.listCache = () => {
//   console.log(specCache);
//   console.log(generateSpecCache);
// };
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/autocomplete-parser/errors.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/autocomplete-parser/errors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createErrorInstance } from '../shared/errors';

// LoadSpecErrors
export const MissingSpecError = createErrorInstance('MissingSpecError');
export const WrongDiffVersionedSpecError = createErrorInstance(
	'WrongDiffVersionedSpecError',
);
export const DisabledSpecError = createErrorInstance('DisabledSpecError');
export const LoadLocalSpecError = createErrorInstance('LoadLocalSpecError');
export const SpecCDNError = createErrorInstance('SpecCDNError');

// ParsingErrors
export const ParsingHistoryError = createErrorInstance('ParsingHistoryError');

export const ParseArgumentsError = createErrorInstance('ParseArgumentsError');
export const UpdateStateError = createErrorInstance('UpdateStateError');
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/autocomplete-parser/parseArguments.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/autocomplete-parser/parseArguments.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// import { filepaths, folders } from '@fig/autocomplete-generators';
import * as Internal from '../shared/internal';
import {
	firstMatchingToken,
	makeArray,
	SpecLocationSource,
	SuggestionFlag,
	SuggestionFlags,
} from '../shared/utils';
// import {
// 	executeCommand,
// 	executeLoginShell,
// 	getSetting,
// 	isInDevMode,
// 	SETTINGS,
// } from '../../api-bindings-wrappers/src';
import {
	Command,
	substituteAlias,
} from '../shell-parser';
// import {
// 	getSpecPath,
// 	loadSubcommandCached,
// 	serializeSpecLocation,
// } from './loadSpec.js';
import {
	ParseArgumentsError,
	ParsingHistoryError,
	UpdateStateError,
} from './errors.js';
import { convertSubcommand, initializeDefault } from '../fig-autocomplete-shared';
import { exec, type ExecException } from 'child_process';
import type { IFigExecuteExternals } from '../execute';

type ArgArrayState = {
	args: Array<Internal.Arg> | null;
	index: number;
	variadicCount?: number;
};

export enum TokenType {
	None = 'none',
	Subcommand = 'subcommand',
	Option = 'option',
	OptionArg = 'option_arg',
	SubcommandArg = 'subcommand_arg',

	// Option chain or option passed with arg in a single token.
	Composite = 'composite',
}

export type BasicAnnotation =
	| {
		text: string;
		type: Exclude<TokenType, TokenType.Composite>;

		// Same as text, unless in CompositeAnnotation, where, e.g. in ls -lah
		// the "a" token has text: "a" but tokenName: -a
		tokenName?: string;
	}
	| {
		text: string;
		type: TokenType.Subcommand;
		spec: Internal.Subcommand;
		specLocation: Internal.SpecLocation;
	};

type CompositeAnnotation = {
	text: string;
	type: TokenType.Composite;
	subtokens: BasicAnnotation[];
};

export type Annotation = BasicAnnotation | CompositeAnnotation;

export type ArgumentParserState = {
	completionObj: Internal.Subcommand;

	optionArgState: ArgArrayState;
	subcommandArgState: ArgArrayState;
	annotations: Annotation[];
	passedOptions: Internal.Option[];

	commandIndex: number;
	// Used to exclude subcommand suggestions after user has entered a subcommand arg.
	haveEnteredSubcommandArgs: boolean;
	isEndOfOptions: boolean;
};

// Result with derived completionObj/currentArg from cached state.
export type ArgumentParserResult = {
	completionObj: Internal.Subcommand;
	currentArg: Internal.Arg | null;
	passedOptions: Internal.Option[];
	searchTerm: string;
	commandIndex: number;
	suggestionFlags: SuggestionFlags;
	annotations: Annotation[];
};

export const createArgState = (args?: Internal.Arg[]): ArgArrayState => {
	const updatedArgs: Internal.Arg[] = [];

	for (const arg of args ?? []) {
		const updatedGenerators = new Set<Fig.Generator>();
		for (let i = 0; i < arg.generators.length; i += 1) {
			const generator = arg.generators[i];
			const templateArray = makeArray(generator.template ?? []);

			let updatedGenerator: Fig.Generator | undefined;
			// TODO: Pass templates out as a result
			if (templateArray.includes('filepaths') && templateArray.includes('folders')) {
				updatedGenerator = { template: ['filepaths', 'folders'] };
			} else if (templateArray.includes('filepaths')) {
				updatedGenerator = { template: 'filepaths' };
			} else if (templateArray.includes('folders')) {
				updatedGenerator = { template: 'folders' };
			}

			if (updatedGenerator && typeof generator !== 'string' && generator.filterTemplateSuggestions) {
				updatedGenerator.filterTemplateSuggestions =
					generator.filterTemplateSuggestions;
			}
			updatedGenerators.add(updatedGenerator ?? generator);
		}

		updatedArgs.push({
			...arg,
			generators: [...updatedGenerators],
		});
	}
	return {
		args: updatedArgs.length > 0 ? updatedArgs : null,
		index: 0,
	};
};

export const flattenAnnotations = (
	annotations: Annotation[],
): BasicAnnotation[] => {
	const result: BasicAnnotation[] = [];
	for (let i = 0; i < annotations.length; i += 1) {
		const annotation = annotations[i];
		if (annotation.type === TokenType.Composite) {
			result.push(...annotation.subtokens);
		} else {
			result.push(annotation);
		}
	}
	return result;
};

export const optionsAreEqual = (a: Internal.Option, b: Internal.Option) =>
	a.name.some((name) => b.name.includes(name));

export const countEqualOptions = (
	option: Internal.Option,
	options: Internal.Option[],
) =>
	options.reduce(
		(count, opt) => (optionsAreEqual(option, opt) ? count + 1 : count),
		0,
	);

export const updateArgState = (argState: ArgArrayState): ArgArrayState => {
	// Consume an argument and update the arg state accordingly.
	const { args, index, variadicCount } = argState;

	if (args && args[index] && args[index].isVariadic) {
		return { args, index, variadicCount: (variadicCount || 0) + 1 };
	}

	if (args && args[index] && index < args.length - 1) {
		return { args, index: index + 1 };
	}

	return { args: null, index: 0 };
};

export const getCurrentArg = (argState: ArgArrayState): Internal.Arg | null =>
	(argState.args && argState.args[argState.index]) || null;

export const isMandatoryOrVariadic = (arg: Internal.Arg | null): boolean =>
	!!arg && (arg.isVariadic || !arg.isOptional);

const preferOptionArg = (state: ArgumentParserState): boolean =>
	isMandatoryOrVariadic(getCurrentArg(state.optionArgState)) ||
	!getCurrentArg(state.subcommandArgState);

const getArgState = (state: ArgumentParserState): ArgArrayState =>
	preferOptionArg(state) ? state.optionArgState : state.subcommandArgState;

const canConsumeOptions = (state: ArgumentParserState): boolean => {
	const {
		subcommandArgState,
		optionArgState,
		isEndOfOptions,
		haveEnteredSubcommandArgs,
		completionObj,
	} = state;

	if (
		haveEnteredSubcommandArgs &&
		completionObj.parserDirectives?.optionsMustPrecedeArguments === true
	) {
		return false;
	}

	if (isEndOfOptions) {
		return false;
	}
	const subcommandArg = getCurrentArg(subcommandArgState);
	const optionArg = getCurrentArg(optionArgState);

	if (isMandatoryOrVariadic(getCurrentArg(optionArgState))) {
		// If option arg is mandatory or variadic, we may still be able to consume
		// an option if options can break and we have already passed at least one
		// variadic option arg.
		if (
			optionArg?.isVariadic &&
			optionArgState.variadicCount &&
			optionArg.optionsCanBreakVariadicArg !== false
		) {
			return true;
		}
		return false;
	}

	if (
		subcommandArg &&
		subcommandArgState.variadicCount &&
		subcommandArg?.optionsCanBreakVariadicArg === false
	) {
		// If we are in the middle of a variadic subcommand arg, we cannot consume the
		// next token as an option if optionsCanBreakVariadicArg is false
		return false;
	}

	return true;
};

export const findOption = (
	spec: Internal.Subcommand,
	token: string,
): Internal.Option => {
	const option = spec.options[token] || spec.persistentOptions[token];
	if (!option) {
		throw new UpdateStateError(`Option not found: ${token}`);
	}
	return option;
};

export const findSubcommand = (
	spec: Internal.Subcommand,
	token: string,
): Internal.Subcommand => {
	const subcommand = spec.subcommands[token];
	if (!subcommand) {
		throw new UpdateStateError('Subcommand not found');
	}
	return subcommand;
};

const updateStateForSubcommand = (
	state: ArgumentParserState,
	token: string,
	isFinalToken = false,
): ArgumentParserState => {
	const { completionObj, haveEnteredSubcommandArgs } = state;
	if (!completionObj.subcommands) {
		throw new UpdateStateError('No subcommands');
	}

	if (haveEnteredSubcommandArgs) {
		throw new UpdateStateError('Already entered subcommand args');
	}

	const newCompletionObj = findSubcommand(state.completionObj, token);

	const annotations: Annotation[] = [
		...state.annotations,
		{ text: token, type: TokenType.Subcommand },
	];

	if (isFinalToken) {
		return { ...state, annotations };
	}

	// Mutate for parser directives and persistent options: these are carried
	// down deterministically.
	if (!newCompletionObj.parserDirectives && completionObj.parserDirectives) {
		newCompletionObj.parserDirectives = completionObj.parserDirectives;
	}

	Object.assign(
		newCompletionObj.persistentOptions,
		completionObj.persistentOptions,
	);

	return {
		...state,
		annotations,
		// Inherit parserDirectives if not specified.
		completionObj: newCompletionObj,
		passedOptions: [],
		optionArgState: createArgState(),
		subcommandArgState: createArgState(newCompletionObj.args),
	};
};

const updateStateForOption = (
	state: ArgumentParserState,
	token: string,
	isFinalToken = false,
): ArgumentParserState => {
	const option = findOption(state.completionObj, token);
	let { isRepeatable } = option;
	if (isRepeatable === false) {
		isRepeatable = 1;
	}
	if (isRepeatable !== true && isRepeatable !== undefined) {
		const currentRepetitions = countEqualOptions(option, state.passedOptions);
		if (currentRepetitions >= isRepeatable) {
			throw new UpdateStateError(
				`Cannot pass option again, already passed ${currentRepetitions} times, ` +
				`and can only be passed ${isRepeatable} times`,
			);
		}
	}

	const annotations: Annotation[] = [
		...state.annotations,
		{ text: token, type: TokenType.Option },
	];

	if (isFinalToken) {
		return { ...state, annotations };
	}

	return {
		...state,
		annotations,
		passedOptions: [...state.passedOptions, option],
		optionArgState: createArgState(option.args),
	};
};

const updateStateForOptionArg = (
	state: ArgumentParserState,
	token: string,
	isFinalToken = false,
): ArgumentParserState => {
	if (!getCurrentArg(state.optionArgState)) {
		throw new UpdateStateError('Cannot consume option arg.');
	}

	const annotations: Annotation[] = [
		...state.annotations,
		{ text: token, type: TokenType.OptionArg },
	];

	if (isFinalToken) {
		return { ...state, annotations };
	}

	return {
		...state,
		annotations,
		optionArgState: updateArgState(state.optionArgState),
	};
};

const updateStateForSubcommandArg = (
	state: ArgumentParserState,
	token: string,
	isFinalToken = false,
): ArgumentParserState => {
	// Consume token as subcommand arg if possible.
	if (!getCurrentArg(state.subcommandArgState)) {
		throw new UpdateStateError('Cannot consume subcommand arg.');
	}

	const annotations: Annotation[] = [
		...state.annotations,
		{ text: token, type: TokenType.SubcommandArg },
	];

	if (isFinalToken) {
		return { ...state, annotations };
	}

	return {
		...state,
		annotations,
		subcommandArgState: updateArgState(state.subcommandArgState),
		haveEnteredSubcommandArgs: true,
	};
};

const updateStateForChainedOptionToken = (
	state: ArgumentParserState,
	token: string,
	isFinalToken = false,
): ArgumentParserState => {
	// Handle composite option tokens, accounting for different types of inputs.
	// https://en.wikipedia.org/wiki/Command-line_interface#Option_conventions_in_Unix-like_systems
	// See https://stackoverflow.com/a/10818697
	// Handle -- as special option flag.
	if (isFinalToken && ['-', '--'].includes(token)) {
		throw new UpdateStateError('Final token, not consuming as option');
	}

	if (token === '--') {
		return {
			...state,
			isEndOfOptions: true,
			annotations: [
				...state.annotations,
				{ text: token, type: TokenType.Option },
			],
			optionArgState: { args: null, index: 0 },
		};
	}

	const { parserDirectives } = state.completionObj;
	const isLongOption =
		parserDirectives?.flagsArePosixNoncompliant ||
		token.startsWith('--') ||
		!token.startsWith('-');

	if (isLongOption) {
		const optionSeparators = new Set(
			parserDirectives?.optionArgSeparators || '=',
		);
		const separatorMatches = firstMatchingToken(token, optionSeparators);

		if (separatorMatches) {
			// Handle long option with equals --num=10, -pnf=10, opt=10.
			const matchedSeparator = separatorMatches[0];
			const [flag, ...optionArgParts] = token.split(matchedSeparator);
			const optionArg = optionArgParts.join(matchedSeparator);
			const optionState = updateStateForOption(state, flag);

			if ((optionState.optionArgState.args?.length ?? 0) > 1) {
				throw new UpdateStateError(
					'Cannot pass argument with separator: option takes multiple args',
				);
			}

			const finalState = updateStateForOptionArg(
				optionState,
				optionArg,
				isFinalToken,
			);

			return {
				...finalState,
				annotations: [
					...state.annotations,
					{
						type: TokenType.Composite,
						text: token,
						subtokens: [
							{
								type: TokenType.Option,
								text: `${flag}${matchedSeparator}`,
								tokenName: flag,
							},
							{ type: TokenType.OptionArg, text: optionArg },
						],
					},
				],
			};
		}

		// Normal long option
		const finalState = updateStateForOption(state, token, isFinalToken);
		const option = findOption(state.completionObj, token);
		return option.requiresEquals || option.requiresSeparator
			? { ...finalState, optionArgState: { args: null, index: 0 } }
			: finalState;
	}

	let optionState = state;
	let optionArg = '';
	const subtokens: BasicAnnotation[] = [];
	let { passedOptions } = state;

	for (let i = 1; i < token.length; i += 1) {
		const [optionFlag, remaining] = [`-${token[i]}`, token.slice(i + 1)];
		passedOptions = optionState.passedOptions;
		try {
			optionState = updateStateForOption(optionState, optionFlag);
		} catch (err) {
			if (i > 1) {
				optionArg = token.slice(i);
				break;
			}
			throw err;
		}

		subtokens.push({
			type: TokenType.Option,
			text: i === 1 ? optionFlag : token[i],
			tokenName: optionFlag,
		});

		if (isMandatoryOrVariadic(getCurrentArg(optionState.optionArgState))) {
			optionArg = remaining;
			break;
		}
	}

	if (optionArg) {
		if ((optionState.optionArgState.args?.length ?? 0) > 1) {
			throw new UpdateStateError(
				'Cannot chain option argument: option takes multiple args',
			);
		}

		optionState = updateStateForOptionArg(optionState, optionArg, isFinalToken);
		passedOptions = optionState.passedOptions;
		subtokens.push({ type: TokenType.OptionArg, text: optionArg });
	}

	return {
		...optionState,
		annotations: [
			...state.annotations,
			{
				type: TokenType.Composite,
				text: token,
				subtokens,
			},
		],
		passedOptions: isFinalToken ? passedOptions : optionState.passedOptions,
	};
};

const canConsumeSubcommands = (state: ArgumentParserState): boolean =>
	!isMandatoryOrVariadic(getCurrentArg(state.optionArgState)) &&
	!state.haveEnteredSubcommandArgs;

// State machine for argument parser.
function updateState(
	state: ArgumentParserState,
	token: string,
	isFinalToken = false,
): ArgumentParserState {
	if (canConsumeSubcommands(state)) {
		try {
			return updateStateForSubcommand(state, token, isFinalToken);
		} catch (_err) {
			// Continue to other token types if we can't consume subcommand.
		}
	}

	if (canConsumeOptions(state)) {
		try {
			return updateStateForChainedOptionToken(state, token, isFinalToken);
		} catch (_err) {
			// Continue to other token types if we can't consume option.
		}
	}

	if (preferOptionArg(state)) {
		try {
			return updateStateForOptionArg(state, token, isFinalToken);
		} catch (_err) {
			// Continue to other token types if we can't consume option arg.
		}
	}

	return updateStateForSubcommandArg(state, token, isFinalToken);
}

const getInitialState = (
	spec: Internal.Subcommand,
	text?: string,
	specLocation?: Internal.SpecLocation,
): ArgumentParserState => ({
	completionObj: spec,
	passedOptions: [],

	annotations:
		text && specLocation
			? [{ text, type: TokenType.Subcommand, spec, specLocation }]
			: [],
	commandIndex: 0,

	optionArgState: createArgState(),
	subcommandArgState: createArgState(spec.args),

	haveEnteredSubcommandArgs: false,
	isEndOfOptions: false,
});

const historyExecuteShellCommand: Fig.ExecuteCommandFunction = async () => {
	throw new ParsingHistoryError(
		'Cannot run shell command while parsing history',
	);
};

function getExecuteShellCommandFunction(
	isParsingHistory = false,
	executeExternals: IFigExecuteExternals,
) {
	if (isParsingHistory) {
		return historyExecuteShellCommand;
	}
	return executeExternals.executeCommand;
}

// const getGenerateSpecCacheKey = (
// 	completionObj: Internal.Subcommand,
// 	tokenArray: string[],
// ): string | undefined => {
// 	let cacheKey: string | undefined;

// 	const generateSpecCacheKey = completionObj?.generateSpecCacheKey;
// 	if (generateSpecCacheKey) {
// 		if (typeof generateSpecCacheKey === 'string') {
// 			cacheKey = generateSpecCacheKey;
// 		} else if (typeof generateSpecCacheKey === 'function') {
// 			cacheKey = generateSpecCacheKey({
// 				tokens: tokenArray,
// 			});
// 		} else {
// 			console.error(
// 				'generateSpecCacheKey must be a string or function',
// 				generateSpecCacheKey,
// 			);
// 		}
// 	}

// 	// Return this late to ensure any generateSpecCacheKey side effects still happen
// 	// if (isInDevMode()) {
// 	// 	return undefined;
// 	// }
// 	if (typeof cacheKey === 'string') {
// 		// Prepend the spec name to the cacheKey to avoid collisions between specs.
// 		return `${tokenArray[0]}:${cacheKey}`;
// 	}
// 	return undefined;
// };

// const generateSpecForState = async (
// 	state: ArgumentParserState,
// 	tokenArray: string[],
// 	isParsingHistory = false,
// 	// localconsole: console.console = console,
// ): Promise<ArgumentParserState> => {
// 	console.debug('generateSpec', { state, tokenArray });
// 	const { completionObj } = state;
// 	const { generateSpec } = completionObj;
// 	if (!generateSpec) {
// 		return state;
// 	}

// 	try {
// 		const cacheKey = getGenerateSpecCacheKey(completionObj, tokenArray);
// 		let newSpec;
// 		if (cacheKey && generateSpecCache.has(cacheKey)) {
// 			newSpec = generateSpecCache.get(cacheKey)!;
// 		} else {
// 			const exec = getExecuteShellCommandFunction(isParsingHistory);
// 			const spec = await generateSpec(tokenArray, exec);
// 			if (!spec) {
// 				throw new UpdateStateError('generateSpec must return a spec');
// 			}
// 			newSpec = convertSubcommand(
// 				spec,
// 				initializeDefault,
// 			);
// 			if (cacheKey) generateSpecCache.set(cacheKey, newSpec);
// 		}

// 		const keepArgs = completionObj.args.length > 0;

// 		return {
// 			...state,
// 			completionObj: {
// 				...completionObj,
// 				subcommands: { ...completionObj.subcommands, ...newSpec.subcommands },
// 				options: { ...completionObj.options, ...newSpec.options },
// 				persistentOptions: {
// 					...completionObj.persistentOptions,
// 					...newSpec.persistentOptions,
// 				},
// 				args: keepArgs ? completionObj.args : newSpec.args,
// 			},
// 			subcommandArgState: keepArgs
// 				? state.subcommandArgState
// 				: createArgState(newSpec.args),
// 		};
// 	} catch (err) {
// 		if (!(err instanceof ParsingHistoryError)) {
// 			console.error(
// 				`There was an error with spec (generator owner: ${completionObj.name
// 				}, tokens: ${tokenArray.join(', ')}) generateSpec function`,
// 				err,
// 			);
// 		}
// 	}
// 	return state;
// };

export const getResultFromState = (
	state: ArgumentParserState,
): ArgumentParserResult => {
	const { completionObj, passedOptions, commandIndex, annotations } = state;

	const lastAnnotation: Annotation | undefined =
		annotations[annotations.length - 1];
	let argState = getArgState(state);
	let searchTerm = lastAnnotation?.text ?? '';

	let onlySuggestArgs = state.isEndOfOptions;

	if (lastAnnotation?.type === TokenType.Composite) {
		argState = state.optionArgState;

		const lastSubtoken =
			lastAnnotation.subtokens[lastAnnotation.subtokens.length - 1];
		if (lastSubtoken.type === TokenType.OptionArg) {
			searchTerm = lastSubtoken.text;
			onlySuggestArgs = true;
		}
	}

	const currentArg = getCurrentArg(argState);

	// Determine what to suggest from final state, always suggest args.
	let suggestionFlags: SuggestionFlags = SuggestionFlag.Args;

	// Selectively enable options or subcommand suggestions if it makes sense.
	if (!onlySuggestArgs) {
		if (canConsumeSubcommands(state)) {
			suggestionFlags |= SuggestionFlag.Subcommands;
		}
		if (canConsumeOptions(state)) {
			suggestionFlags |= SuggestionFlag.Options;
		}
	}

	return {
		completionObj,
		passedOptions,
		commandIndex,
		annotations,

		currentArg,
		searchTerm,
		suggestionFlags,
	};
};

export const initialParserState = getResultFromState(
	getInitialState({
		name: [''],
		subcommands: {},
		options: {},
		persistentOptions: {},
		parserDirectives: {},
		args: [],
	}),
);

// const parseArgumentsCache = createCache<ArgumentParserState>();
// const parseArgumentsGenerateSpecCache = createCache<ArgumentParserState>();
// const figCaches = new Set<string>();
// export const clearFigCaches = () => {
// 	for (const cache of figCaches) {
// 		parseArgumentsGenerateSpecCache.delete(cache);
// 	}
// 	return { unsubscribe: false };
// };

// const getCacheKey = (
// 	tokenArray: string[],
// 	context: Fig.ShellContext,
// 	specLocation: Internal.SpecLocation,
// ): string =>
// 	[
// 		tokenArray.slice(0, -1).join(' '),
// 		// serializeSpecLocation(specLocation),
// 		context.currentWorkingDirectory,
// 		context.currentProcess,
// 	].join(',');

// Parse all arguments in tokenArray.
const parseArgumentsCached = async (
	command: Command,
	context: Fig.ShellContext,
	spec: Fig.Spec,
	executeExternals: IFigExecuteExternals,
	// authClient: AuthClient,
	isParsingHistory?: boolean,
	startIndex = 0,
	// localconsole: console.console = console,
): Promise<ArgumentParserState> => {
	// Route to cp.exec instead, we don't need to deal with ipc
	const exec = getExecuteShellCommandFunction(isParsingHistory, executeExternals);

	let currentCommand = command;
	let tokens = currentCommand.tokens.slice(startIndex);
	// const tokenText = tokens.map((token) => token.text);

	const specPath: Fig.SpecLocation = { type: 'global', name: 'fake' };

	// tokenTest[0] is the command and the spec they need
	// const locations = specLocations || [
	// 	await getSpecPath(tokenText[0], context.currentWorkingDirectory),
	// ];
	// console.debug({ locations });

	// let cacheKey = '';
	// for (let i = 0; i < locations.length; i += 1) {
	// 	cacheKey = getCacheKey(tokenText, context, locations[i]);
	// 	if (
	// 		// !isInDevMode() &&
	// 		(parseArgumentsCache.has(cacheKey) ||
	// 			parseArgumentsGenerateSpecCache.has(cacheKey))
	// 	) {
	// 		return (
	// 			(parseArgumentsGenerateSpecCache.get(
	// 				cacheKey,
	// 			) as ArgumentParserState) ||
	// 			(parseArgumentsCache.get(cacheKey) as ArgumentParserState)
	// 		);
	// 	}
	// }

	// let spec: Internal.Subcommand | undefined;
	// let specPath: Internal.SpecLocation | undefined;
	// for (let i = 0; i < locations.length; i += 1) {
	// 	specPath = locations[i];
	// 	if (isParsingHistory && specPath?.type === SpecLocationSource.LOCAL) {
	// 		continue;
	// 	}

	// 	spec = await withTimeout(
	// 		5000,
	// 		loadSubcommandCached(specPath, context, console),
	// 	);
	// 	if (!specPath) {
	// 		throw new Error('specPath is undefined');
	// 	}

	// 	if (!spec) {
	// 		const path =
	// 			specPath.type === SpecLocationSource.LOCAL ? specPath?.path : '';
	// 		console.warn(
	// 			`Failed to load spec ${specPath.name} from ${specPath.type} ${path}`,
	// 		);
	// 	} else {
	// 		cacheKey = getCacheKey(tokenText, context, specPath);
	// 		break;
	// 	}
	// }

	if (!spec || !specPath) {
		throw new UpdateStateError('Failed loading spec');
	}

	let state: ArgumentParserState = getInitialState(
		convertSubcommand(spec, initializeDefault),
		tokens[0].text,
		specPath,
	);

	// let generatedSpec = false;

	const substitutedAliases = new Set<string>();
	let aliasError: Error | undefined;

	// Returns true if we should return state immediately after calling.
	// const updateStateForLoadSpec = async (
	// 	loadSpec: typeof state.completionObj.loadSpec,
	// 	index: number,
	// 	token?: string,
	// ) => {
	// 	const loadSpecResult =
	// 		typeof loadSpec === 'function'
	// 			? token !== undefined
	// 				? await loadSpec(token, exec)
	// 				: undefined
	// 			: loadSpec;

	// 	if (Array.isArray(loadSpecResult)) {
	// 		state = await parseArgumentsCached(
	// 			currentCommand,
	// 			context,
	// 			// authClient,
	// 			loadSpecResult,
	// 			isParsingHistory,
	// 			startIndex + index,
	// 		);
	// 		state = { ...state, commandIndex: state.commandIndex + index };
	// 		return true;
	// 	}

	// 	if (loadSpecResult) {
	// 		state = {
	// 			...state,
	// 			completionObj: {
	// 				...loadSpecResult,
	// 				parserDirectives: {
	// 					...state.completionObj.parserDirectives,
	// 					...loadSpecResult.parserDirectives,
	// 				},
	// 			},
	// 			optionArgState: createArgState(),
	// 			passedOptions: [],
	// 			subcommandArgState: createArgState(loadSpecResult.args),
	// 			haveEnteredSubcommandArgs: false,
	// 		};
	// 	}

	// 	return false;
	// };

	// if (await updateStateForLoadSpec(state.completionObj.loadSpec, 0)) {
	// 	return state;
	// }

	for (let i = 1; i < tokens.length; i += 1) {
		// TODO: Investigate generate spec
		// if (state.completionObj.generateSpec) {
		// 	state = await generateSpecForState(
		// 		state,
		// 		tokens.map((token) => token.text),
		// 		isParsingHistory,
		// 	);
		// 	generatedSpec = true;
		// }

		if (i === tokens.length - 1) {
			// Don't update state for last token.
			break;
		}

		const token = tokens[i].text;

		const lastArgObject = getCurrentArg(getArgState(state));
		const lastArgType = preferOptionArg(state)
			? TokenType.OptionArg
			: TokenType.SubcommandArg;

		const lastState = state;

		state = updateState(state, token);
		console.debug('Parser state update', { state });

		const { annotations } = state;
		const lastAnnotation = annotations[annotations.length - 1];
		const lastType =
			lastAnnotation.type === TokenType.Composite
				? lastAnnotation.subtokens[lastAnnotation.subtokens.length - 1].type
				: lastAnnotation.type;

		if (
			lastType === lastArgType &&
			lastArgObject?.parserDirectives?.alias &&
			!substitutedAliases.has(token)
		) {
			const { alias } = lastArgObject.parserDirectives;
			try {
				const aliasValue =
					typeof alias === 'string' ? alias : await alias(token, exec);
				try {
					currentCommand = substituteAlias(command, tokens[i], aliasValue);
					// tokens[...i] should be the same, but tokens[i+1...] may be different.
					substitutedAliases.add(token);
					tokens = currentCommand.tokens.slice(startIndex);
					state = lastState;
					i -= 1;
					continue;
				} catch (err) {
					console.error('Error substituting alias:', err);
					throw err;
				}
			} catch (err) {
				if (substitutedAliases.size === 0) {
					throw err;
				}
				aliasError = err as Error;
			}
		}

		// TODO: Investigate whether we want to support loadSpec, vs just importing them directly
		// let loadSpec =
		// 	lastType === TokenType.Subcommand
		// 		? state.completionObj.loadSpec
		// 		: undefined;

		// Recurse for load spec or special arg
		// if (lastType === lastArgType && lastArgObject) {
		// 	const {
		// 		isCommand,
		// 		isModule,
		// 		isScript,
		// 		loadSpec: argLoadSpec,
		// 	} = lastArgObject;
		// 	if (argLoadSpec) {
		// 		loadSpec = argLoadSpec;
		// 	} else if (isCommand || isScript) {
		// 		// const specLocation = await getSpecPath(
		// 		// 	token,
		// 		// 	context.currentWorkingDirectory,
		// 		// 	Boolean(isScript),
		// 		// );
		// 		// loadSpec = [specLocation];
		// 	} else if (isModule) {
		// 		loadSpec = [
		// 			{
		// 				name: `${isModule}${token}`,
		// 				type: SpecLocationSource.GLOBAL,
		// 			},
		// 		];
		// 	}
		// }

		// if (await updateStateForLoadSpec(loadSpec, i, token)) {
		// 	return state;
		// }

		// If error with alias and corresponding arg was not used in a loadSpec,
		// throw the error.
		if (aliasError) {
			throw aliasError;
		}

		substitutedAliases.clear();
	}

	// if (generatedSpec) {
	// 	if (tokenText[0] === 'fig') figCaches.add(cacheKey);
	// 	parseArgumentsGenerateSpecCache.set(cacheKey, state);
	// } else {
	// 	parseArgumentsCache.set(cacheKey, state);
	// }

	return state;
};

const firstTokenSpec: Internal.Subcommand = {
	name: ['firstTokenSpec'],
	subcommands: {},
	options: {},
	persistentOptions: {},
	loadSpec: undefined,
	args: [
		{
			name: 'command',
			generators: [
				{
					custom: async (_tokens, _exec, context) => {
						let result: Fig.Suggestion[] = [];
						if (context?.currentProcess.includes('fish')) {
							const commands = await executeLoginShell({
								command: 'complete -C ""',
								executable: context.currentProcess,
							});
							result = commands.split('\n').map((commandString) => {
								const splitIndex = commandString.indexOf('\t');
								const name = commandString.slice(0, splitIndex + 1);
								const description = commandString.slice(splitIndex + 1);
								return { name, description, type: 'subcommand' };
							});
						} else if (context?.currentProcess.includes('bash')) {
							const commands = await executeLoginShell({
								command: 'compgen -c',
								executable: context.currentProcess,
							});
							result = commands
								.split('\n')
								.map((name) => ({ name, type: 'subcommand' }));
						} else if (context?.currentProcess.includes('zsh')) {
							const commands = await executeLoginShell({
								command: `for key in \${(k)commands}; do echo $key; done && alias +r`,
								executable: context.currentProcess,
							});
							result = commands
								.split('\n')
								.map((name) => ({ name, type: 'subcommand' }));
						}

						const names = new Set();
						return result.filter((suggestion) => {
							if (names.has(suggestion.name)) {
								return false;
							}
							names.add(suggestion.name);
							return true;
						});
					},
					cache: {
						strategy: 'stale-while-revalidate',
						ttl: 10 * 1000, // 10s
					},
				},
			],
		},
	],
	parserDirectives: {},
};

const executeLoginShell = async ({
	command,
	executable,
}: {
	command: string;
	executable: string;
}): Promise<string> => {
	return new Promise((resolve, reject) => {
		exec(`${executable} -c "${command}"`, (error: ExecException | null, stdout: string, stderr: string) => {
			if (error) {
				reject(stderr);
			} else {
				resolve(stdout);
			}
		});
	});
};

export const parseArguments = async (
	command: Command | null,
	context: Fig.ShellContext,
	spec: Fig.Spec,
	executeExternals: IFigExecuteExternals,
	// authClient: AuthClient,
	isParsingHistory = false,
	// localconsole: console.console = console,
): Promise<ArgumentParserResult> => {
	const tokens = command?.tokens ?? [];
	if (!command || tokens.length === 0) {
		throw new ParseArgumentsError('Invalid token array');
	}

	if (tokens.length === 1) {
		const showFirstCommandCompletion = true;
		const spec = showFirstCommandCompletion
			? firstTokenSpec
			: { ...firstTokenSpec, args: [] };
		let specPath = { name: 'firstTokenSpec', type: SpecLocationSource.GLOBAL };
		if (tokens[0].text.includes('/')) {
			// special-case: Symfony has "bin/console" which can be invoked directly
			// and should not require a user to create script completions for it
			if (tokens[0].text === 'bin/console') {
				specPath = { name: 'php/bin-console', type: SpecLocationSource.GLOBAL };
			} else {
				specPath = { name: 'dotslash', type: SpecLocationSource.GLOBAL };
			}
			// spec = await loadSubcommandCached(specPath, context);
		}
		return getResultFromState(getInitialState(spec, tokens[0].text, specPath));
	}

	let state = await parseArgumentsCached(
		command,
		context,
		// authClient,
		spec,
		executeExternals,
		isParsingHistory,
		0,
	);

	const finalToken = tokens[tokens.length - 1].text;
	try {
		state = updateState(state, finalToken, true);
	} catch (_err) {
		state = {
			...state,
			annotations: [
				...state.annotations,
				{ type: TokenType.None, text: finalToken },
			],
		};
	}
	return getResultFromState(state);
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/fig-autocomplete-shared/convert.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/fig-autocomplete-shared/convert.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { makeArray } from './utils';

export type SuggestionType = Fig.SuggestionType | 'history' | 'auto-execute';

type Override<T, S> = Omit<T, keyof S> & S;
export type Suggestion = Override<Fig.Suggestion, { type?: SuggestionType }>;

export type Option<ArgT, OptionT> = OptionT & {
	name: string[];
	args: ArgT[];
};

export type Subcommand<ArgT, OptionT, SubcommandT> = SubcommandT & {
	name: string[];
	subcommands: Record<string, Subcommand<ArgT, OptionT, SubcommandT>>;
	options: Record<string, Option<ArgT, OptionT>>;
	persistentOptions: Record<string, Option<ArgT, OptionT>>;
	args: ArgT[];
};

const makeNamedMap = <T extends { name: string[] }>(items: T[] | undefined): Record<string, T> => {
	const nameMapping: Record<string, T> = {};
	if (!items) {
		return nameMapping;
	}

	for (let i = 0; i < items.length; i += 1) {
		items[i].name.forEach((name) => {
			nameMapping[name] = items[i];
		});
	}
	return nameMapping;
};

export type Initializer<ArgT, OptionT, SubcommandT> = {
	subcommand: (subcommand: Fig.Subcommand) => SubcommandT;
	option: (option: Fig.Option) => OptionT;
	arg: (arg: Fig.Arg) => ArgT;
};

function convertOption<ArgT, OptionT>(
	option: Fig.Option,
	initialize: Omit<Initializer<ArgT, OptionT, never>, 'subcommand'>
): Option<ArgT, OptionT> {
	return {
		...initialize.option(option),
		name: makeArray(option.name),
		args: option.args ? makeArray(option.args).map(initialize.arg) : [],
	};
}

export function convertSubcommand<ArgT, OptionT, SubcommandT>(
	subcommand: Fig.Subcommand,
	initialize: Initializer<ArgT, OptionT, SubcommandT>
): Subcommand<ArgT, OptionT, SubcommandT> {
	const { subcommands, options, args } = subcommand;
	return {
		...initialize.subcommand(subcommand),
		name: makeArray(subcommand.name),
		subcommands: makeNamedMap(subcommands?.map((s) => convertSubcommand(s, initialize))),
		options: makeNamedMap(
			options
				?.filter((option) => !option.isPersistent)
				?.map((option) => convertOption(option, initialize))
		),
		persistentOptions: makeNamedMap(
			options
				?.filter((option) => option.isPersistent)
				?.map((option) => convertOption(option, initialize))
		),
		args: args ? makeArray(args).map(initialize.arg) : [],
	};
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/fig-autocomplete-shared/index.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/fig-autocomplete-shared/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as Internal from './convert';
import type * as Metadata from './specMetadata';
import { revertSubcommand } from './revert';
import { convertSubcommand } from './convert';
import { convertLoadSpec, initializeDefault } from './specMetadata';
import { SpecMixin, applyMixin, mergeSubcommands } from './mixins';
import { SpecLocationSource, makeArray } from './utils';

export {
	Internal,
	revertSubcommand,
	convertSubcommand,
	Metadata,
	convertLoadSpec,
	initializeDefault,
	SpecMixin,
	applyMixin,
	mergeSubcommands,
	makeArray,
	SpecLocationSource,
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/fig-autocomplete-shared/mixins.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/fig-autocomplete-shared/mixins.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { makeArray } from './utils';

export type SpecMixin =
	| Fig.Subcommand
	| ((currentSpec: Fig.Subcommand, context: Fig.ShellContext) => Fig.Subcommand);

type NamedObject = { name: Fig.SingleOrArray<string> };

const concatArrays = <T>(a: T[] | undefined, b: T[] | undefined): T[] | undefined =>
	a && b ? [...a, ...b] : a || b;

const mergeNames = <T = string>(a: T | T[], b: T | T[]): T | T[] => [
	...new Set(concatArrays(makeArray(a), makeArray(b))),
];

const mergeArrays = <T>(a: T[] | undefined, b: T[] | undefined): T[] | undefined =>
	a && b ? [...new Set(concatArrays(makeArray(a), makeArray(b)))] : a || b;

const mergeArgs = (arg: Fig.Arg, partial: Fig.Arg): Fig.Arg => ({
	...arg,
	...partial,
	suggestions: concatArrays<Fig.Suggestion | string>(arg.suggestions, partial.suggestions),
	generators:
		arg.generators && partial.generators
			? concatArrays(makeArray(arg.generators), makeArray(partial.generators))
			: arg.generators || partial.generators,
	template:
		arg.template && partial.template
			? mergeNames<Fig.TemplateStrings>(arg.template, partial.template)
			: arg.template || partial.template,
});

const mergeArgArrays = (
	args: Fig.SingleOrArray<Fig.Arg> | undefined,
	partials: Fig.SingleOrArray<Fig.Arg> | undefined
): Fig.SingleOrArray<Fig.Arg> | undefined => {
	if (!args || !partials) {
		return args || partials;
	}
	const argArray = makeArray(args);
	const partialArray = makeArray(partials);
	const result = [];
	for (let i = 0; i < Math.max(argArray.length, partialArray.length); i += 1) {
		const arg = argArray[i];
		const partial = partialArray[i];
		if (arg !== undefined && partial !== undefined) {
			result.push(mergeArgs(arg, partial));
		} else if (partial !== undefined || arg !== undefined) {
			result.push(arg || partial);
		}
	}
	return result.length === 1 ? result[0] : result;
};

const mergeOptions = (option: Fig.Option, partial: Fig.Option): Fig.Option => ({
	...option,
	...partial,
	name: mergeNames(option.name, partial.name),
	args: mergeArgArrays(option.args, partial.args),
	exclusiveOn: mergeArrays(option.exclusiveOn, partial.exclusiveOn),
	dependsOn: mergeArrays(option.dependsOn, partial.dependsOn),
});

const mergeNamedObjectArrays = <T extends NamedObject>(
	objects: T[] | undefined,
	partials: T[] | undefined,
	mergeItems: (a: T, b: T) => T
): T[] | undefined => {
	if (!objects || !partials) {
		return objects || partials;
	}
	const mergedObjects = objects ? [...objects] : [];

	const existingNameIndexMap: Record<string, number> = {};
	for (let i = 0; i < objects.length; i += 1) {
		makeArray(objects[i].name).forEach((name) => {
			existingNameIndexMap[name] = i;
		});
	}

	for (let i = 0; i < partials.length; i += 1) {
		const partial = partials[i];
		if (!partial) {
			throw new Error('Invalid object passed to merge');
		}
		const existingNames = makeArray(partial.name).filter((name) => name in existingNameIndexMap);
		if (existingNames.length === 0) {
			mergedObjects.push(partial);
		} else {
			const index = existingNameIndexMap[existingNames[0]];
			if (existingNames.some((name) => existingNameIndexMap[name] !== index)) {
				throw new Error('Names provided for option matched multiple existing options');
			}
			mergedObjects[index] = mergeItems(mergedObjects[index], partial);
		}
	}
	return mergedObjects;
};

function mergeOptionArrays(
	options: Fig.Option[] | undefined,
	partials: Fig.Option[] | undefined
): Fig.Option[] | undefined {
	return mergeNamedObjectArrays(options, partials, mergeOptions);
}

function mergeSubcommandArrays(
	subcommands: Fig.Subcommand[] | undefined,
	partials: Fig.Subcommand[] | undefined
): Fig.Subcommand[] | undefined {
	return mergeNamedObjectArrays(subcommands, partials, mergeSubcommands);
}

export function mergeSubcommands(
	subcommand: Fig.Subcommand,
	partial: Fig.Subcommand
): Fig.Subcommand {
	return {
		...subcommand,
		...partial,
		name: mergeNames(subcommand.name, partial.name),
		args: mergeArgArrays(subcommand.args, partial.args),
		additionalSuggestions: concatArrays<Fig.Suggestion | string>(
			subcommand.additionalSuggestions,
			partial.additionalSuggestions
		),
		subcommands: mergeSubcommandArrays(subcommand.subcommands, partial.subcommands),
		options: mergeOptionArrays(subcommand.options, partial.options),
		parserDirectives:
			subcommand.parserDirectives && partial.parserDirectives
				? { ...subcommand.parserDirectives, ...partial.parserDirectives }
				: subcommand.parserDirectives || partial.parserDirectives,
	};
}

export const applyMixin = (
	spec: Fig.Subcommand,
	context: Fig.ShellContext,
	mixin: SpecMixin
): Fig.Subcommand => {
	if (typeof mixin === 'function') {
		return mixin(spec, context);
	}
	const partial = mixin;
	return mergeSubcommands(spec, partial);
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/fig-autocomplete-shared/revert.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/fig-autocomplete-shared/revert.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Option, Subcommand } from './convert';

function makeSingleOrArray<T>(arr: T[]): Fig.SingleOrArray<T> {
	return arr.length === 1 ? (arr[0] as Fig.SingleOrArray<T>) : (arr as Fig.SingleOrArray<T>);
}

function revertOption<ArgT extends Fig.Arg, OptionT>(option: Option<ArgT, OptionT>): Fig.Option {
	const { name, args } = option;

	return {
		name: makeSingleOrArray(name),
		args,
	};
}

export function revertSubcommand<ArgT extends Fig.Arg, OptionT, SubcommandT>(
	subcommand: Subcommand<ArgT, OptionT, SubcommandT>,
	postProcessingFn: (
		oldSub: Subcommand<ArgT, OptionT, SubcommandT>,
		newSub: Fig.Subcommand
	) => Fig.Subcommand
): Fig.Subcommand {
	const { name, subcommands, options, persistentOptions, args } = subcommand;

	const newSubcommand: Fig.Subcommand = {
		name: makeSingleOrArray(name),
		subcommands:
			Object.values(subcommands).length !== 0
				? Object.values(subcommands).map((sub) => revertSubcommand(sub, postProcessingFn))
				: undefined,
		options:
			Object.values(options).length !== 0
				? [
					...Object.values(options).map((option) => revertOption(option)),
					...Object.values(persistentOptions).map((option) => revertOption(option)),
				]
				: undefined,
		args: Object.values(args).length !== 0 ? makeSingleOrArray(Object.values(args)) : undefined,
	};
	return postProcessingFn(subcommand, newSubcommand);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/fig-autocomplete-shared/specMetadata.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/fig-autocomplete-shared/specMetadata.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Subcommand, convertSubcommand, Initializer } from './convert';
import { makeArray, SpecLocationSource } from './utils';

type FigLoadSpecFn = Fig.LoadSpec extends infer U ? (U extends Function ? U : never) : never;
export type LoadSpec<ArgT = ArgMeta, OptionT = OptionMeta, SubcommandT = SubcommandMeta> =
	| Fig.SpecLocation[]
	| Subcommand<ArgT, OptionT, SubcommandT>
	| ((
		...args: Parameters<FigLoadSpecFn>
	) => Promise<Fig.SpecLocation[] | Subcommand<ArgT, OptionT, SubcommandT>>);

export type OptionMeta = Omit<Fig.Option, 'args' | 'name'>;
export type ArgMeta = Omit<Fig.Arg, 'template' | 'generators' | 'loadSpec'> & {
	generators: Fig.Generator[];
	loadSpec?: LoadSpec<ArgMeta, OptionMeta, SubcommandMeta>;
};

type SubcommandMetaExcludes =
	| 'subcommands'
	| 'options'
	| 'loadSpec'
	| 'persistentOptions'
	| 'args'
	| 'name';
export type SubcommandMeta = Omit<Fig.Subcommand, SubcommandMetaExcludes> & {
	loadSpec?: LoadSpec<ArgMeta, OptionMeta, SubcommandMeta>;
};

export function convertLoadSpec<ArgT, OptionT, SubcommandT>(
	loadSpec: Fig.LoadSpec,
	initialize: Initializer<ArgT, OptionT, SubcommandT>
): LoadSpec<ArgT, OptionT, SubcommandT> {
	if (typeof loadSpec === 'string') {
		return [{ name: loadSpec, type: SpecLocationSource.GLOBAL }];
	}

	if (typeof loadSpec === 'function') {
		return (...args) =>
			loadSpec(...args).then((result) => {
				if (Array.isArray(result)) {
					return result;
				}
				if ('type' in result) {
					return [result];
				}
				return convertSubcommand(result, initialize);
			});
	}

	return convertSubcommand(loadSpec, initialize);
}

function initializeOptionMeta(option: Fig.Option): OptionMeta {
	return option;
}

// Default initialization functions:
function initializeArgMeta(arg: Fig.Arg): ArgMeta {
	const { template, ...rest } = arg;
	const generators = template ? [{ template }] : makeArray(arg.generators ?? []);
	return {
		...rest,
		loadSpec: arg.loadSpec
			? convertLoadSpec(arg.loadSpec, {
				option: initializeOptionMeta,
				subcommand: initializeSubcommandMeta,
				arg: initializeArgMeta,
			})
			: undefined,
		generators: generators.map((generator) => {
			let { trigger, getQueryTerm } = generator;
			if (generator.template) {
				const templates = makeArray(generator.template);
				if (templates.includes('folders') || templates.includes('filepaths')) {
					trigger = trigger ?? '/';
					getQueryTerm = getQueryTerm ?? '/';
				}
			}
			return { ...generator, trigger, getQueryTerm };
		}),
	};
}

function initializeSubcommandMeta(subcommand: Fig.Subcommand): SubcommandMeta {
	return {
		...subcommand,
		loadSpec: subcommand.loadSpec
			? convertLoadSpec(subcommand.loadSpec, {
				subcommand: initializeSubcommandMeta,
				option: initializeOptionMeta,
				arg: initializeArgMeta,
			})
			: undefined,
	};
}

export const initializeDefault: Initializer<ArgMeta, OptionMeta, SubcommandMeta> = {
	subcommand: initializeSubcommandMeta,
	option: initializeOptionMeta,
	arg: initializeArgMeta,
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/fig-autocomplete-shared/utils.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/fig-autocomplete-shared/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function makeArray<T>(object: T | T[]): T[] {
	return Array.isArray(object) ? object : [object];
}

export enum SpecLocationSource {
	GLOBAL = 'global',
	LOCAL = 'local',
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/shared/errors.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/shared/errors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const createErrorInstance = (name: string) =>
	class extends Error {
		constructor(message?: string) {
			super(message);
			this.name = `Fig.${name}`;
		}
	};
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/shared/index.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/shared/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as Errors from './errors.js';
import * as Internal from './internal.js';
import * as Utils from './utils.js';

export { Errors, Internal, Utils };
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/shared/internal.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/shared/internal.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Internal, Metadata } from '../fig-autocomplete-shared';

export type SpecLocation = Fig.SpecLocation & {
	diffVersionedFile?: string;
};

type Override<T, S> = Omit<T, keyof S> & S;
export type SuggestionType = Fig.SuggestionType | 'history' | 'auto-execute';
export type Suggestion<ArgT = Metadata.ArgMeta> = Override<
	Fig.Suggestion,
	{
		type?: SuggestionType;
		// Whether or not to add a space after suggestion, e.g. if user completes a
		// subcommand that takes a mandatory arg.
		shouldAddSpace?: boolean;
		// Whether or not to add a separator after suggestion, e.g. for options with requiresSeparator
		separatorToAdd?: string;
		args?: ArgT[];
		// Generator information to determine whether suggestion should be filtered.
		generator?: Fig.Generator;
		getQueryTerm?: (x: string) => string;
		// fuzzyMatchData?: (Result | null)[];
		originalType?: SuggestionType;
	}
>;

export type Arg = Metadata.ArgMeta;
export type Option = Internal.Option<Metadata.ArgMeta, Metadata.OptionMeta>;
export type Subcommand = Internal.Subcommand<
	Metadata.ArgMeta,
	Metadata.OptionMeta,
	Metadata.SubcommandMeta
>;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/shared/utils.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/shared/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { osIsWindows } from '../../helpers/os.js';
import { createErrorInstance } from './errors.js';

// Use bitwise representation of suggestion flags.
// See here: https://stackoverflow.com/questions/39359740/what-are-enum-flags-in-typescript/
//
// Given a number `flags` we can test `if (flags & Subcommands)` to see if we
// should be suggesting subcommands.
//
// This is more maintainable in the future if we add more options (e.g. if we
// distinguish between subcommand args and option args) as we can just add a
// number here instead of passing 3+ boolean flags everywhere.
export enum SuggestionFlag {
	None = 0,
	Subcommands = 1 << 0,
	Options = 1 << 1,
	Args = 1 << 2,
	Any = (1 << 2) | (1 << 1) | (1 << 0),
}

// Combination of suggestion flags.
export type SuggestionFlags = number;

export enum SpecLocationSource {
	GLOBAL = 'global',
	LOCAL = 'local',
}

export function makeArray<T>(object: T | T[]): T[] {
	return Array.isArray(object) ? object : [object];
}

export function firstMatchingToken(
	str: string,
	chars: Set<string>,
): string | undefined {
	for (const char of str) {
		if (chars.has(char)) {
			return char;
		}
	}
	return undefined;
}

export function makeArrayIfExists<T>(
	obj: T | T[] | null | undefined,
): T[] | null {
	return !obj ? null : makeArray(obj);
}

export function isOrHasValue(
	obj: string | Array<string>,
	valueToMatch: string,
) {
	return Array.isArray(obj) ? obj.includes(valueToMatch) : obj === valueToMatch;
}

export const TimeoutError = createErrorInstance('TimeoutError');

export async function withTimeout<T>(
	time: number,
	promise: Promise<T>,
): Promise<T> {
	let timeout: NodeJS.Timeout;
	return Promise.race<Promise<T>>([
		promise,
		new Promise<T>((_, reject) => {
			timeout = setTimeout(() => {
				reject(new TimeoutError('Function timed out'));
			}, time);
		}),
	]).finally(() => {
		clearTimeout(timeout);
	});
}

export const longestCommonPrefix = (strings: string[]): string => {
	const sorted = strings.sort();

	const { 0: firstItem, [sorted.length - 1]: lastItem } = sorted;
	const firstItemLength = firstItem.length;

	let i = 0;

	while (i < firstItemLength && firstItem.charAt(i) === lastItem.charAt(i)) {
		i += 1;
	}

	return firstItem.slice(0, i);
};

export function findLast<T>(
	values: T[],
	predicate: (v: T) => boolean,
): T | undefined {
	for (let i = values.length - 1; i >= 0; i -= 1) {
		if (predicate(values[i])) {
			return values[i];
		}
	}
	return undefined;
}

type NamedObject =
	| {
		name?: string[] | string;
	}
	| string;

export function compareNamedObjectsAlphabetically<
	A extends NamedObject,
	B extends NamedObject,
>(a: A, b: B): number {
	const getName = (object: NamedObject): string =>
		typeof object === 'string' ? object : makeArray(object.name)[0] || '';
	return getName(a).localeCompare(getName(b));
}

export const sleep = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

export type Func<S extends unknown[], T> = (...args: S) => T;
type EqualFunc<T> = (args: T, newArgs: T) => boolean;

// Memoize a function (cache the most recent result based on the most recent args)
// Optionally can pass an equals function to determine whether or not the old arguments
// and new arguments are equal.
//
// e.g. let fn = (a, b) => a * 2
//
// If we memoize this then we recompute every time a or b changes. if we memoize with
// isEqual = ([a, b], [newA, newB]) => newA === a
// then we will only recompute when a changes.
export function memoizeOne<S extends unknown[], T>(
	fn: Func<S, T>,
	isEqual?: EqualFunc<S>,
): Func<S, T> {
	let lastArgs = [] as unknown[] as S;
	let lastResult: T;
	let hasBeenCalled = false;
	const areArgsEqual: EqualFunc<S> =
		isEqual || ((args, newArgs) => args.every((x, idx) => x === newArgs[idx]));
	return (...args: S): T => {
		if (!hasBeenCalled || !areArgsEqual(lastArgs, args)) {
			hasBeenCalled = true;
			lastArgs = [...args] as unknown[] as S;
			lastResult = fn(...args);
		}
		return lastResult;
	};
}

function isNonNullObj(v: unknown): v is Record<string, unknown> {
	return typeof v === 'object' && v !== null;
}

function isEmptyObject(v: unknown): v is Record<string, never> {
	return isNonNullObj(v) && Object.keys(v).length === 0;
}

// TODO: to fix this we may want to have the default fields as Object.keys(A)
/**
 * If no fields are specified and A,B are not equal primitives/empty objects, this returns false
 * even if the objects are actually equal.
 */
export function fieldsAreEqual<T>(A: T, B: T, fields: (keyof T)[]): boolean {
	if (A === B || (isEmptyObject(A) && isEmptyObject(B))) {
		return true;
	}
	if (!fields.length || !A || !B) {
		return false;
	}
	return fields.every((field) => {
		const aField = A[field];
		const bField = B[field];

		if (typeof aField !== typeof bField) {
			return false;
		}
		if (isNonNullObj(aField) && isNonNullObj(bField)) {
			if (Object.keys(aField).length !== Object.keys(bField).length) {
				return false;
			}
			return fieldsAreEqual(aField, bField, Object.keys(aField) as never[]);
		}
		return aField === bField;
	});
}

export const splitPath = (path: string): [string, string] => {
	const idx = path.lastIndexOf('/') + 1;
	return [path.slice(0, idx), path.slice(idx)];
};

export const ensureTrailingSlash = (str: string) =>
	str.endsWith('/') ? str : `${str}/`;

// Outputs CWD with trailing `/`
export const getCWDForFilesAndFolders = (
	cwd: string | null,
	searchTerm: string,
): string => {
	if (cwd === null) {
		return '/';
	}
	const [dirname] = splitPath(searchTerm);

	if (dirname === '') {
		return ensureTrailingSlash(cwd);
	}

	return dirname.startsWith('~/') || dirname.startsWith('/')
		? dirname
		: `${cwd}/${dirname}`;
};

export function localProtocol(domain: string, path: string) {
	let modifiedDomain;
	//TODO@meganrogge
	// if (domain === 'path' && !window.fig?.constants?.newUriFormat) {
	if (domain === 'path') {
		modifiedDomain = '';
	} else {
		modifiedDomain = domain;
	}

	if (osIsWindows()) {
		return `https://fig.${modifiedDomain}/${path}`;
	}
	return `fig://${modifiedDomain}/${path}`;
}

type ExponentialBackoffOptions = {
	attemptTimeout: number; // The maximum time in milliseconds to wait for a function to execute.
	baseDelay: number; // The initial delay in milliseconds.
	maxRetries: number; // The maximum number of retries.
	jitter: number; // A random factor to add to the delay on each retry.
};

export async function exponentialBackoff<T>(
	options: ExponentialBackoffOptions,
	fn: () => Promise<T>,
): Promise<T> {
	let retries = 0;
	let delay = options.baseDelay;

	while (retries < options.maxRetries) {
		try {
			return await withTimeout(options.attemptTimeout, fn());
		} catch (_error) {
			retries += 1;
			delay *= 2;
			delay += Math.floor(Math.random() * options.jitter);

			await new Promise((resolve) => {
				setTimeout(resolve, delay);
			});
		}
	}

	throw new Error('Failed to execute function after all retries.');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/shared/test/utils.test.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/shared/test/utils.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual, ok } from 'node:assert';
import {
	makeArray,
	makeArrayIfExists,
	longestCommonPrefix,
	compareNamedObjectsAlphabetically,
	fieldsAreEqual,
} from '../utils';

function expect<T>(a: T): { toEqual: (b: T) => void } {
	return {
		toEqual: (b: T) => {
			deepStrictEqual(a, b);
		}
	};
}

suite('fig/shared/ fieldsAreEqual', () => {
	test('should return immediately if two values are the same', () => {
		expect(fieldsAreEqual('hello', 'hello', [])).toEqual(true);
		expect(fieldsAreEqual('hello', 'hell', [])).toEqual(false);
		expect(fieldsAreEqual(1, 1, ['valueOf'])).toEqual(true);
		expect(fieldsAreEqual(null, null, [])).toEqual(true);
		expect(fieldsAreEqual(null, undefined, [])).toEqual(false);
		expect(fieldsAreEqual(undefined, undefined, [])).toEqual(true);
		expect(fieldsAreEqual(null, 'hello', [])).toEqual(false);
		expect(fieldsAreEqual(100, null, [])).toEqual(false);
		expect(fieldsAreEqual({}, {}, [])).toEqual(true);
		expect(
			fieldsAreEqual(
				() => { },
				() => { },
				[],
			),
		).toEqual(false);
	});

	test('should return true if fields are equal', () => {
		const fn = () => { };
		expect(
			fieldsAreEqual(
				{
					a: 'hello',
					b: 100,
					c: undefined,
					d: false,
					e: fn,
					f: { fa: true, fb: { fba: true } },
					g: null,
				},
				{
					a: 'hello',
					b: 100,
					c: undefined,
					d: false,
					e: fn,
					f: { fa: true, fb: { fba: true } },
					g: null,
				},
				['a', 'b', 'c', 'd', 'e', 'f', 'g'],
			),
		).toEqual(true);
		expect(fieldsAreEqual({ a: {} }, { a: {} }, ['a'])).toEqual(true);
	});

	test('should return false if any field is not equal or fields are not specified', () => {
		expect(fieldsAreEqual({ a: null }, { a: {} }, ['a'])).toEqual(false);
		expect(fieldsAreEqual({ a: undefined }, { a: 'hello' }, ['a'])).toEqual(
			false,
		);
		expect(fieldsAreEqual({ a: false }, { a: true }, ['a'])).toEqual(false);
		expect(
			fieldsAreEqual(
				{ a: { b: { c: 'hello' } } },
				{ a: { b: { c: 'hell' } } },
				['a'],
			),
		).toEqual(false);
		expect(fieldsAreEqual({ a: 'true' }, { b: 'true' }, [])).toEqual(false);
	});
});

suite('fig/shared/ makeArray', () => {
	test('should transform an object into an array', () => {
		expect(makeArray(true)).toEqual([true]);
	});

	test('should not transform arrays with one value', () => {
		expect(makeArray([true])).toEqual([true]);
	});

	test('should not transform arrays with multiple values', () => {
		expect(makeArray([true, false])).toEqual([true, false]);
	});
});

suite('fig/shared/ makeArrayIfExists', () => {
	test('works', () => {
		expect(makeArrayIfExists(null)).toEqual(null);
		expect(makeArrayIfExists(undefined)).toEqual(null);
		expect(makeArrayIfExists('a')).toEqual(['a']);
		expect(makeArrayIfExists(['a'])).toEqual(['a']);
	});
});

suite('fig/shared/ longestCommonPrefix', () => {
	test('should return the shared match', () => {
		expect(longestCommonPrefix(['foo', 'foo bar', 'foo hello world'])).toEqual(
			'foo',
		);
	});

	test('should return nothing if not all items starts by the same chars', () => {
		expect(longestCommonPrefix(['foo', 'foo bar', 'hello world'])).toEqual('');
	});
});

suite('fig/shared/ compareNamedObjectsAlphabetically', () => {
	test('should return 1 to sort alphabetically z against b for string', () => {
		ok(compareNamedObjectsAlphabetically('z', 'b') > 0);
	});

	test('should return 1 to sort alphabetically z against b for object with name', () => {
		ok(compareNamedObjectsAlphabetically({ name: 'z' }, { name: 'b' }) > 0);
	});

	test('should return 1 to sort alphabetically c against x for object with name', () => {
		ok(compareNamedObjectsAlphabetically({ name: 'c' }, { name: 'x' }) < 0);
	});

	test('should return 1 to sort alphabetically z against b for object with name array', () => {
		ok(compareNamedObjectsAlphabetically({ name: ['z'] }, { name: ['b'] }) > 0);
	});

	test('should return 1 to sort alphabetically c against x for object with name array', () => {
		ok(compareNamedObjectsAlphabetically({ name: ['c'] }, { name: ['x'] }) < 0);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/shell-parser/command.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/shell-parser/command.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { NodeType, BaseNode, createTextNode, parse } from './parser.js';
import { ConvertCommandError, SubstituteAliasError } from './errors.js';

export * from './errors.js';

export type Token = {
	text: string;
	node: BaseNode;
	originalNode: BaseNode;
};

export type Command = {
	tokens: Token[];
	tree: BaseNode;

	originalTree: BaseNode;
};

export type AliasMap = Record<string, string>;

const descendantAtIndex = (
	node: BaseNode,
	index: number,
	type?: NodeType,
): BaseNode | null => {
	if (node.startIndex <= index && index <= node.endIndex) {
		const descendant = node.children
			.map((child) => descendantAtIndex(child, index, type))
			.find(Boolean);
		if (descendant) {
			return descendant;
		}
		return !type || node.type === type ? node : null;
	}
	return null;
};

export const createTextToken = (
	command: Command,
	index: number,
	text: string,
	originalNode?: BaseNode,
): Token => {
	const { tree, originalTree, tokens } = command;

	let indexDiff = 0;
	const tokenIndex = tokens.findIndex(
		(token) => index < token.originalNode.startIndex,
	);
	const token = tokens[tokenIndex];
	if (tokenIndex === 0) {
		indexDiff = token.node.startIndex - token.originalNode.startIndex;
	} else if (tokenIndex === -1) {
		indexDiff = tree.text.length - originalTree.text.length;
	} else {
		indexDiff = token.node.endIndex - token.originalNode.endIndex;
	}

	return {
		originalNode:
			originalNode || createTextNode(originalTree.text, index, text),
		node: createTextNode(text, index + indexDiff, text),
		text,
	};
};

const convertCommandNodeToCommand = (tree: BaseNode): Command => {
	if (tree.type !== NodeType.Command) {
		throw new ConvertCommandError('Cannot get tokens from non-command node');
	}

	const command = {
		originalTree: tree,
		tree,
		tokens: tree.children.map((child) => ({
			originalNode: child,
			node: child,
			text: child.innerText,
		})),
	};

	const { children, endIndex, text } = tree;
	if (
		+(children.length === 0 || children[children.length - 1].endIndex) <
		endIndex &&
		text.endsWith(' ')
	) {
		command.tokens.push(createTextToken(command, endIndex, ''));
	}
	return command;
};

const shiftByAmount = (node: BaseNode, shift: number): BaseNode => ({
	...node,
	startIndex: node.startIndex + shift,
	endIndex: node.endIndex + shift,
	children: node.children.map((child) => shiftByAmount(child, shift)),
});

export const substituteAlias = (
	command: Command,
	token: Token,
	alias: string,
): Command => {
	if (command.tokens.find((t) => t === token) === undefined) {
		throw new SubstituteAliasError('Token not in command');
	}
	const { tree } = command;

	const preAliasChars = token.node.startIndex - tree.startIndex;
	const postAliasChars = token.node.endIndex - tree.endIndex;

	const preAliasText = `${tree.text.slice(0, preAliasChars)}`;
	const postAliasText = postAliasChars
		? `${tree.text.slice(postAliasChars)}`
		: '';

	const commandBuffer = `${preAliasText}${alias}${postAliasText}`;

	// Parse command and shift indices to align with original command.
	const parseTree = shiftByAmount(parse(commandBuffer), tree.startIndex);

	if (parseTree.children.length !== 1) {
		throw new SubstituteAliasError('Invalid alias');
	}

	const newCommand = convertCommandNodeToCommand(parseTree.children[0]);

	const [aliasStart, aliasEnd] = [
		token.node.startIndex,
		token.node.startIndex + alias.length,
	];

	let tokenIndexDiff = 0;
	let lastTokenInAlias = false;
	// Map tokens from new command back to old command to attributing the correct original nodes.
	const tokens = newCommand.tokens.map((newToken, index) => {
		const tokenInAlias =
			aliasStart < newToken.node.endIndex &&
			newToken.node.startIndex < aliasEnd;
		tokenIndexDiff += tokenInAlias && lastTokenInAlias ? 1 : 0;
		const { originalNode } = command.tokens[index - tokenIndexDiff];
		lastTokenInAlias = tokenInAlias;
		return { ...newToken, originalNode };
	});

	if (newCommand.tokens.length - command.tokens.length !== tokenIndexDiff) {
		throw new SubstituteAliasError('Error substituting alias');
	}

	return {
		originalTree: command.originalTree,
		tree: newCommand.tree,
		tokens,
	};
};

export const expandCommand = (
	command: Command,
	_cursorIndex: number,
	aliases: AliasMap,
): Command => {
	let expanded = command;
	const usedAliases = new Set();

	// Check for aliases
	let [name] = expanded.tokens;
	while (
		expanded.tokens.length > 1 &&
		name &&
		aliases[name.text] &&
		!usedAliases.has(name.text)
	) {
		// Remove quotes
		const aliasValue = aliases[name.text].replace(/^'(.*)'$/g, '$1');
		try {
			expanded = substituteAlias(expanded, name, aliasValue);
		} catch (_err) {
			// TODO(refactoring): add logger again
			// console.error('Error substituting alias');
		}
		usedAliases.add(name.text);
		[name] = expanded.tokens;
	}

	return expanded;
};

export const getCommand = (
	buffer: string,
	aliases: AliasMap,
	cursorIndex?: number,
): Command | null => {
	const index = cursorIndex === undefined ? buffer.length : cursorIndex;
	const parseTree = parse(buffer);
	const commandNode = descendantAtIndex(parseTree, index, NodeType.Command);
	if (commandNode === null) {
		return null;
	}
	const command = convertCommandNodeToCommand(commandNode);
	return expandCommand(command, index, aliases);
};

const statements = [
	NodeType.Program,
	NodeType.CompoundStatement,
	NodeType.Subshell,
	NodeType.Pipeline,
	NodeType.List,
	NodeType.Command,
];

export const getTopLevelCommands = (parseTree: BaseNode): Command[] => {
	if (parseTree.type === NodeType.Command) {
		return [convertCommandNodeToCommand(parseTree)];
	}
	if (!statements.includes(parseTree.type)) {
		return [];
	}
	const commands: Command[] = [];
	for (let i = 0; i < parseTree.children.length; i += 1) {
		commands.push(...getTopLevelCommands(parseTree.children[i]));
	}
	return commands;
};

export const getAllCommandsWithAlias = (
	buffer: string,
	aliases: AliasMap,
): Command[] => {
	const parseTree = parse(buffer);
	const commands = getTopLevelCommands(parseTree);
	return commands.map((command) =>
		expandCommand(command, command.tree.text.length, aliases),
	);
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/shell-parser/errors.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/shell-parser/errors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createErrorInstance } from '../shared/errors';

export const SubstituteAliasError = createErrorInstance('SubstituteAliasError');
export const ConvertCommandError = createErrorInstance('ConvertCommandError');
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/shell-parser/index.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/shell-parser/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export * from './parser.js';
export * from './command.js';
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/shell-parser/parser.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/shell-parser/parser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Loosely follows the following grammar:
// terminator = ";" | "&" | "&;"
// literal = string | ansi_c_string | raw_string | expansion | simple_expansion | word
// concatenation = literal literal
// command = (concatenation | literal)+
//
// variable_name = word
// subscript = variable_name"["literal"]"
// assignment = (word | subscript)("=" | "+=")literal
// assignment_list = assignment+ command?
//
// statement =
//    | "{" (statement terminator)+ "}"
//    | "(" statements ")"
//    | statement "||" statement
//    | statement "&&" statement
//    | statement "|" statement
//    | statement "|&" statement
//    | command
//    | assignment_list
//
// statements = (statement terminator)* statement terminator?
// program = statements

export enum NodeType {
	Program = 'program',

	AssignmentList = 'assignment_list',
	Assignment = 'assignment',
	VariableName = 'variable_name',
	Subscript = 'subscript',

	CompoundStatement = 'compound_statement',
	Subshell = 'subshell',
	Command = 'command',
	Pipeline = 'pipeline',
	List = 'list',

	// TODO: implement <(commands)
	ProcessSubstitution = 'process_substitution',

	// Primary expressions
	Concatenation = 'concatenation',
	Word = 'word',
	String = 'string',
	Expansion = 'expansion',
	CommandSubstitution = 'command_substitution',

	// Leaf Nodes
	RawString = 'raw_string',
	AnsiCString = 'ansi_c_string',
	SimpleExpansion = 'simple_expansion',
	SpecialExpansion = 'special_expansion',
	ArithmeticExpansion = 'arithmetic_expansion',
}

export type LiteralNode =
	| BaseNode<NodeType.String>
	| BaseNode<NodeType.AnsiCString>
	| BaseNode<NodeType.RawString>
	| BaseNode<NodeType.CommandSubstitution>
	| BaseNode<NodeType.Concatenation>
	| BaseNode<NodeType.Expansion>
	| BaseNode<NodeType.ArithmeticExpansion>
	| BaseNode<NodeType.SimpleExpansion>
	| BaseNode<NodeType.SpecialExpansion>
	| BaseNode<NodeType.Word>;

export interface BaseNode<Type extends NodeType = NodeType> {
	text: string;
	// Unquoted text in node.
	innerText: string;

	startIndex: number;
	endIndex: number;

	complete: boolean;

	type: Type;
	children: BaseNode[];
}

export interface ListNode extends BaseNode {
	type: NodeType.List;
	operator: '||' | '&&' | '|' | '|&';
}

export interface AssignmentListNode extends BaseNode {
	type: NodeType.AssignmentList;
	children:
	| [...AssignmentNode[], BaseNode<NodeType.Command>]
	| AssignmentNode[];
	hasCommand: boolean;
}

export interface AssignmentNode extends BaseNode {
	type: NodeType.Assignment;
	operator: '=' | '+=';
	name: BaseNode<NodeType.VariableName> | SubscriptNode;
	children: LiteralNode[];
}

export interface SubscriptNode extends BaseNode {
	type: NodeType.Subscript;
	name: BaseNode<NodeType.VariableName>;
	index: LiteralNode;
}

const operators = [';', '&', '&;', '|', '|&', '&&', '||'] as const;

type Operator = (typeof operators)[number];

const parseOperator = (str: string, index: number): Operator | null => {
	const c = str.charAt(index);
	if (['&', ';', '|'].includes(c)) {
		const op = str.slice(index, index + 2);
		return operators.includes(op as unknown as Operator)
			? (op as Operator)
			: (c as Operator);
	}
	return null;
};

const getInnerText = (node: BaseNode): string => {
	const { children, type, complete, text } = node;
	if (type === NodeType.Concatenation) {
		return children.reduce((current, child) => current + child.innerText, '');
	}

	const terminalCharsMapping: { [key: string]: [string, string] | undefined } = {
		[NodeType.String]: ['"', '"'],
		[NodeType.RawString]: ['\'', '\''],
		[NodeType.AnsiCString]: ['$\'', '\''],
	};
	const terminalChars = terminalCharsMapping[type] ?? ['', ''];

	const startChars = terminalChars[0];
	const endChars = !complete ? '' : terminalChars[1];

	let innerText = '';
	for (let i = startChars.length; i < text.length - endChars.length; i += 1) {
		const c = text.charAt(i);
		const isWordEscape = c === '\\' && type === NodeType.Word;
		const isStringEscape =
			c === '\\' &&
			type === NodeType.String &&
			'$`"\\\n'.includes(text.charAt(i + 1));

		if (isWordEscape || isStringEscape) {
			i += 1;
		}

		innerText += text.charAt(i);
	}
	return innerText;
};

const createNode = <T extends BaseNode = BaseNode>(
	str: string,
	partial: Partial<T>,
): T => {
	// eslint-disable-next-line local/code-no-dangerous-type-assertions
	const node = {
		startIndex: 0,
		type: NodeType.Word,
		endIndex: str.length,
		text: '',
		innerText: '',
		complete: true,
		children: [],
		...partial,
	} as BaseNode as T;
	const text = str.slice(node.startIndex, node.endIndex);
	const innerText = getInnerText({ ...node, text });
	return { ...node, text, innerText };
};

export const createTextNode = (
	str: string,
	startIndex: number,
	text: string,
): BaseNode =>
	createNode(str, { startIndex, text, endIndex: startIndex + text.length });

const nextWordIndex = (str: string, index: number) => {
	const firstChar = str.slice(index).search(/\S/);
	if (firstChar === -1) {
		return -1;
	}
	return index + firstChar;
};

// Parse simple variable expansion ($foo or $$)
const parseSimpleExpansion = (
	str: string,
	index: number,
	terminalChars: string[],
):
	| BaseNode<NodeType.SimpleExpansion>
	| BaseNode<NodeType.SpecialExpansion>
	| null => {
	const node: Partial<BaseNode<NodeType.SimpleExpansion>> = {
		startIndex: index,
		type: NodeType.SimpleExpansion,
	};
	if (str.length > index + 1 && '*@?-$0_'.includes(str.charAt(index + 1))) {
		return createNode<BaseNode<NodeType.SpecialExpansion>>(str, {
			...node,
			type: NodeType.SpecialExpansion,
			endIndex: index + 2,
		});
	}
	const terminalSymbols = ['\t', ' ', '\n', '$', '\\', ...terminalChars];
	let i = index + 1;
	for (; i < str.length; i += 1) {
		if (terminalSymbols.includes(str.charAt(i))) {
			// Parse a literal $ if last token
			return i === index + 1
				? null
				: createNode<BaseNode<NodeType.SimpleExpansion>>(str, {
					...node,
					endIndex: i,
				});
		}
	}
	return createNode<BaseNode<NodeType.SimpleExpansion>>(str, {
		...node,
		endIndex: i,
	});
};

// Parse command substitution $(foo) or `foo`
function parseCommandSubstitution(
	str: string,
	startIndex: number,
	terminalChar: string,
): BaseNode<NodeType.CommandSubstitution> {
	const index =
		str.charAt(startIndex) === '`' ? startIndex + 1 : startIndex + 2;
	const { statements: children, terminatorIndex } = parseStatements(
		str,
		index,
		terminalChar,
	);
	const terminated = terminatorIndex !== -1;
	return createNode<BaseNode<NodeType.CommandSubstitution>>(str, {
		startIndex,
		type: NodeType.CommandSubstitution,
		complete: terminated && children.length !== 0,
		endIndex: terminated ? terminatorIndex + 1 : str.length,
		children,
	});
}

const parseString = parseLiteral<NodeType.String>(NodeType.String, '"', '"');
const parseRawString = parseLiteral<NodeType.RawString>(
	NodeType.RawString,
	'\'',
	'\'',
);
const parseExpansion = parseLiteral<NodeType.Expansion>(
	NodeType.Expansion,
	'${',
	'}',
);
const parseAnsiCString = parseLiteral<NodeType.AnsiCString>(
	NodeType.AnsiCString,
	'$\'',
	'\'',
);
const parseArithmeticExpansion = parseLiteral<NodeType.ArithmeticExpansion>(
	NodeType.ArithmeticExpansion,
	'$((',
	'))',
);

function childAtIndex(
	str: string,
	index: number,
	inString: boolean,
	terminators: string[],
): LiteralNode | null {
	const lookahead = [
		str.charAt(index),
		str.charAt(index + 1),
		str.charAt(index + 2),
	];
	switch (lookahead[0]) {
		case '$':
			if (lookahead[1] === '(') {
				return lookahead[2] === '('
					? parseArithmeticExpansion(str, index)
					: parseCommandSubstitution(str, index, ')');
			}
			if (lookahead[1] === '{') {
				return parseExpansion(str, index);
			}
			if (!inString && lookahead[1] === '\'') {
				return parseAnsiCString(str, index);
			}
			return parseSimpleExpansion(str, index, terminators);
		case '`':
			return parseCommandSubstitution(str, index, '`');
		case '\'':
			return inString ? null : parseRawString(str, index);
		case '"':
			return inString ? null : parseString(str, index);
		default:
			return null;
	}
}

function parseLiteral<T extends NodeType>(
	type: T,
	startChars: string,
	endChars: string,
) {
	const canHaveChildren =
		type === NodeType.Expansion || type === NodeType.String;
	const isString = type === NodeType.String;
	return (str: string, startIndex: number): BaseNode<T> => {
		const children = [];
		for (let i = startIndex + startChars.length; i < str.length; i += 1) {
			const child = canHaveChildren
				? childAtIndex(str, i, isString, [endChars])
				: null;
			if (child !== null) {
				children.push(child);
				i = child.endIndex - 1;
			} else if (str.charAt(i) === '\\' && type !== NodeType.RawString) {
				i += 1;
			} else if (str.slice(i, i + endChars.length) === endChars) {
				return createNode<BaseNode<T>>(str, {
					startIndex,
					type,
					children,
					endIndex: i + endChars.length,
				});
			}
		}
		return createNode<BaseNode<T>>(str, {
			startIndex,
			type,
			children,
			complete: false,
		});
	};
}

function parseStatements(
	str: string,
	index: number,
	terminalChar: string,
	mustTerminate = false,
): {
	statements: BaseNode[];
	terminatorIndex: number;
} {
	const statements = [];

	let i = index;
	while (i < str.length) {
		// Will only exit on EOF, terminalChar or terminator symbol (;, &, &;)
		let statement = parseStatement(str, i, mustTerminate ? '' : terminalChar);

		const opIndex = nextWordIndex(str, statement.endIndex);
		const reachedEnd = opIndex === -1;
		if (!mustTerminate && !reachedEnd && terminalChar === str.charAt(opIndex)) {
			statements.push(statement);
			return { statements, terminatorIndex: opIndex };
		}

		if (reachedEnd) {
			statements.push(statement);
			break;
		}

		const op = !reachedEnd && parseOperator(str, opIndex);
		if (op) {
			// Terminator symbol, ; | & | &;
			i = opIndex + op.length;
			const nextIndex = nextWordIndex(str, i);
			statements.push(statement);
			if (nextIndex !== -1 && str.charAt(nextIndex) === terminalChar) {
				return { statements, terminatorIndex: nextIndex };
			}
		} else {
			// Missing terminator but still have tokens left.
			// assignments do not require terminators
			statement = createNode(str, {
				...statement,
				complete:
					statement.type === NodeType.AssignmentList
						? statement.complete
						: false,
			});
			statements.push(statement);
			i = opIndex;
		}
	}
	return { statements, terminatorIndex: -1 };
}

const parseConcatenationOrLiteralNode = (
	str: string,
	startIndex: number,
	terminalChar: string,
): { children: LiteralNode[]; endIndex: number } => {
	const children: LiteralNode[] = [];

	let argumentChildren: LiteralNode[] = [];
	let wordStart = -1;

	const endWord = (endIndex: number) => {
		if (wordStart !== -1) {
			const word = createNode<BaseNode<NodeType.Word>>(str, {
				startIndex: wordStart,
				endIndex,
			});
			argumentChildren.push(word);
		}
		wordStart = -1;
	};

	const endArgument = (endIndex: number) => {
		endWord(endIndex);
		let [argument] = argumentChildren;
		if (argumentChildren.length > 1) {
			const finalPart = argumentChildren[argumentChildren.length - 1];
			argument = createNode<BaseNode<NodeType.Concatenation>>(str, {
				startIndex: argumentChildren[0].startIndex,
				type: NodeType.Concatenation,
				endIndex: finalPart.endIndex,
				complete: finalPart.complete,
				children: argumentChildren,
			});
		}
		if (argument) {
			children.push(argument);
		}
		argumentChildren = [];
	};

	const terminators = ['&', '|', ';', '\n', '\'', '"', '`'];
	if (terminalChar) {
		terminators.push(terminalChar);
	}

	let i = startIndex;
	for (; i < str.length; i += 1) {
		const c = str.charAt(i);
		const op = parseOperator(str, i);
		if (op !== null || c === terminalChar) {
			// TODO: handle terminator like ; as first token.
			break;
		}
		const childNode = childAtIndex(str, i, false, terminators);
		if (childNode !== null) {
			endWord(i);
			argumentChildren.push(childNode);
			i = childNode.endIndex - 1;
		} else if ([' ', '\t'].includes(c)) {
			endArgument(i);
		} else {
			if (c === '\\') {
				i += 1;
			}
			if (wordStart === -1) {
				wordStart = i;
			}
		}
	}

	endArgument(i);

	return { children, endIndex: i };
};

function parseCommand(
	str: string,
	idx: number,
	terminalChar: string,
): BaseNode<NodeType.Command> {
	const startIndex = Math.max(nextWordIndex(str, idx), idx);
	const { children, endIndex } = parseConcatenationOrLiteralNode(
		str,
		startIndex,
		terminalChar,
	);

	return createNode<BaseNode<NodeType.Command>>(str, {
		startIndex,
		type: NodeType.Command,
		complete: children.length > 0,
		// Extend command up to separator.
		endIndex: children.length > 0 ? endIndex : str.length,
		children,
	});
}

const parseAssignmentNode = (
	str: string,
	startIndex: number,
): AssignmentNode => {
	const equalsIndex = str.indexOf('=', startIndex);
	const operator = str.charAt(equalsIndex - 1) === '+' ? '+=' : '=';
	const firstOperatorCharIndex =
		operator === '=' ? equalsIndex : equalsIndex - 1;
	const firstSquareBracketIndex = str
		.slice(startIndex, firstOperatorCharIndex)
		.indexOf('[');
	let nameNode: SubscriptNode | BaseNode<NodeType.VariableName>;

	const variableName = createNode<BaseNode<NodeType.VariableName>>(str, {
		type: NodeType.VariableName,
		startIndex,
		endIndex:
			firstSquareBracketIndex !== -1
				? firstSquareBracketIndex
				: firstOperatorCharIndex,
	});

	if (firstSquareBracketIndex !== -1) {
		const index = createNode<BaseNode<NodeType.Word>>(str, {
			type: NodeType.Word,
			startIndex: firstSquareBracketIndex + 1,
			endIndex: firstOperatorCharIndex - 1,
		});
		nameNode = createNode<SubscriptNode>(str, {
			type: NodeType.Subscript,
			name: variableName,
			startIndex,
			endIndex: index.endIndex + 1,
			children: [index],
		});
	} else {
		nameNode = variableName;
	}

	const { children, endIndex } = parseConcatenationOrLiteralNode(
		str,
		equalsIndex + 1,
		' ',
	);
	return createNode<AssignmentNode>(str, {
		name: nameNode,
		startIndex,
		endIndex,
		type: NodeType.Assignment,
		operator,
		children,
		complete: children[children.length - 1].complete,
	});
};

const parseAssignments = (str: string, index: number): AssignmentNode[] => {
	const variables: AssignmentNode[] = [];
	let lastVariableEnd = index;
	while (lastVariableEnd < str.length) {
		const nextTokenStart = nextWordIndex(str, lastVariableEnd);
		if (/^[\w[\]]+\+?=.*/.test(str.slice(nextTokenStart))) {
			const assignmentNode = parseAssignmentNode(str, nextTokenStart);
			variables.push(assignmentNode);
			lastVariableEnd = assignmentNode.endIndex;
		} else {
			return variables;
		}
	}
	return variables;
};

const parseAssignmentListNodeOrCommandNode = (
	str: string,
	startIndex: number,
	terminalChar: string,
): AssignmentListNode | BaseNode<NodeType.Command> => {
	const assignments = parseAssignments(str, startIndex);
	if (assignments.length > 0) {
		const lastAssignment = assignments[assignments.length - 1];
		const operator = parseOperator(
			str,
			nextWordIndex(str, lastAssignment.endIndex),
		);
		let command: BaseNode<NodeType.Command> | undefined;
		if (
			!operator &&
			lastAssignment.complete &&
			lastAssignment.endIndex !== str.length
		) {
			command = parseCommand(str, lastAssignment.endIndex, terminalChar);
		}
		// if it makes sense to parse a command here do it else return the list
		return createNode<AssignmentListNode>(str, {
			type: NodeType.AssignmentList,
			startIndex,
			endIndex: command ? command.endIndex : lastAssignment.endIndex,
			hasCommand: !!command,
			children: command ? [...assignments, command] : assignments,
		});
	}
	return parseCommand(str, startIndex, terminalChar);
};

const reduceStatements = (
	str: string,
	lhs: BaseNode,
	rhs: BaseNode,
	type: NodeType,
): BaseNode =>
	createNode(str, {
		type,
		startIndex: lhs.startIndex,
		children: rhs.type === type ? [lhs, ...rhs.children] : [lhs, rhs],
		endIndex: rhs.endIndex,
		complete: lhs.complete && rhs.complete,
	});

function parseStatement(
	str: string,
	index: number,
	terminalChar: string,
): BaseNode {
	let i = nextWordIndex(str, index);
	i = i === -1 ? index : i;
	let statement = null;
	if (['{', '('].includes(str.charAt(i))) {
		// Parse compound statement or subshell
		const isCompound = str.charAt(i) === '{';
		const endChar = isCompound ? '}' : ')';

		const { statements: children, terminatorIndex } = parseStatements(
			str,
			i + 1,
			endChar,
			isCompound,
		);
		const hasChildren = children.length > 0;
		const terminated = terminatorIndex !== -1;
		let endIndex = terminatorIndex + 1;
		if (!terminated) {
			endIndex = hasChildren
				? children[children.length - 1].endIndex
				: str.length;
		}
		statement = createNode(str, {
			startIndex: i,
			type: isCompound ? NodeType.CompoundStatement : NodeType.Subshell,
			endIndex,
			complete: terminated && hasChildren,
			children,
		});
	} else {
		// statement = parseAssignmentListNodeOrCommandNode(str, i, terminalChar)
		statement = parseAssignmentListNodeOrCommandNode(str, i, terminalChar);
	}

	i = statement.endIndex;
	const opIndex = nextWordIndex(str, i);
	const op = opIndex !== -1 && parseOperator(str, opIndex);
	if (
		!op ||
		op === ';' ||
		op === '&' ||
		op === '&;' ||
		(opIndex !== -1 && terminalChar && str.charAt(opIndex) === terminalChar)
	) {
		return statement;
	}

	// Recursively parse rightHandStatement if theres an operator.
	const rightHandStatement = parseStatement(
		str,
		opIndex + op.length,
		terminalChar,
	);
	if (op === '&&' || op === '||') {
		return reduceStatements(str, statement, rightHandStatement, NodeType.List);
	}

	if (op === '|' || op === '|&') {
		if (rightHandStatement.type === NodeType.List) {
			const [oldFirstChild, ...otherChildren] = rightHandStatement.children;
			const newFirstChild = reduceStatements(
				str,
				statement,
				oldFirstChild,
				NodeType.Pipeline,
			);
			return createNode(str, {
				type: NodeType.List,
				startIndex: newFirstChild.startIndex,
				children: [newFirstChild, ...otherChildren],
				endIndex: rightHandStatement.endIndex,
				complete: newFirstChild.complete && rightHandStatement.complete,
			});
		}
		return reduceStatements(
			str,
			statement,
			rightHandStatement,
			NodeType.Pipeline,
		);
	}
	return statement;
}

export const printTree = (root: BaseNode) => {
	const getNodeText = (node: BaseNode, level = 0) => {
		const indent = ' '.repeat(level);
		let nodeText = `${indent}${node.type} [${node.startIndex},  ${node.endIndex}] - ${node.text}`;
		const childrenText = node.children
			.map((child) => getNodeText(child, level + 1))
			.join('\n');
		if (childrenText) {
			nodeText += `\n${childrenText}`;
		}
		if (!node.complete) {
			nodeText += `\n${indent}INCOMPLETE`;
		}
		return nodeText;
	};
	console.log(getNodeText(root));
};

export const parse = (str: string): BaseNode =>
	createNode<BaseNode<NodeType.Program>>(str, {
		startIndex: 0,
		type: NodeType.Program,
		children: parseStatements(str, 0, '').statements,
	});
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/shell-parser/test/command.test.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/shell-parser/test/command.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual } from 'node:assert';
import { getCommand, Command } from '../command';

suite('fig/shell-parser/ getCommand', () => {
	const aliases = {
		woman: 'man',
		quote: `'q'`,
		g: 'git',
	};
	const getTokenText = (command: Command | null) => command?.tokens.map((token) => token.text) ?? [];

	test('works without matching aliases', () => {
		deepStrictEqual(getTokenText(getCommand('git co ', {})), ['git', 'co', '']);
		deepStrictEqual(getTokenText(getCommand('git co ', aliases)), ['git', 'co', '']);
		deepStrictEqual(getTokenText(getCommand('woman ', {})), ['woman', '']);
		deepStrictEqual(getTokenText(getCommand('another string ', aliases)), [
			'another',
			'string',
			'',
		]);
	});

	test('works with regular aliases', () => {
		// Don't change a single token.
		deepStrictEqual(getTokenText(getCommand('woman', aliases)), ['woman']);
		// Change first token if length > 1.
		deepStrictEqual(getTokenText(getCommand('woman ', aliases)), ['man', '']);
		// Don't change later tokens.
		deepStrictEqual(getTokenText(getCommand('man woman ', aliases)), ['man', 'woman', '']);
		// Handle quotes
		deepStrictEqual(getTokenText(getCommand('quote ', aliases)), ['q', '']);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/shell-parser/test/parser.test.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/shell-parser/test/parser.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import fs from 'node:fs';
import path from 'node:path';
import { parse } from '../parser';
import { strictEqual } from 'node:assert';

function parseCommand(command: string): string {
	return JSON.stringify(parse(command), null, '  ');
}

/**
 *
 * @param filePath The path to the file to parse
 * @param nameComment The first character of each title line
 */
function getData(
	filePath: string,
	nameComment: string,
): [name: string, value: string][] {
	if (!fs.existsSync(filePath)) {
		fs.writeFileSync(filePath, '');
		return [];
	}
	return fs
		.readFileSync(filePath, { encoding: 'utf8' })
		.replaceAll('\r\n', '\n')
		.split('\n\n')
		.map((testCase) => {
			const firstNewline = testCase.indexOf('\n');
			const title = testCase.slice(0, firstNewline);
			const block = testCase.slice(firstNewline);
			return [title.slice(nameComment.length).trim(), block.trim()];
		});
}

// function outputNewFile(
// 	filePath: string,
// 	nameComment: string,
// 	data: [name: string, value: string][],
// ) {
// 	fs.writeFileSync(
// 		filePath,
// 		data.reduce(
// 			(previous, current, index) =>
// 				`${previous}${index > 0 ? '\n\n' : ''}${nameComment} ${current[0]}\n${current[1]
// 				}`,
// 			'',
// 		),
// 	);
// }

// function notIncludedIn<K>(setA: Set<K>, setB: Set<K>): K[] {
// 	const notIncluded: K[] = [];
// 	for (const v of setA) {
// 		if (!setB.has(v)) notIncluded.push(v);
// 	}
// 	return notIncluded;
// }

// function mapKeysDiff<K, V>(mapA: Map<K, V>, mapB: Map<K, V>) {
// 	const keysA = new Set(mapA.keys());
// 	const keysB = new Set(mapB.keys());
// 	return [
// 		notIncludedIn(keysA, keysB), // keys of A not included in B
// 		notIncludedIn(keysB, keysA), // keys of B not included in A
// 	];
// }

suite('fig/shell-parser/ fixtures', () => {
	const fixturesPath = path.join(__dirname, '../../../../fixtures/shell-parser');
	const fixtures = fs.readdirSync(fixturesPath);
	for (const fixture of fixtures) {
		// console.log('fixture', fixture);
		suite(fixture, () => {
			const inputFile = path.join(fixturesPath, fixture, 'input.sh');
			const outputFile = path.join(fixturesPath, fixture, 'output.txt');
			const inputData = new Map(getData(inputFile, '###'));
			const outputData = new Map(getData(outputFile, '//'));

			// clean diffs and regenerate files if required.
			// if (!process.env.NO_FIXTURES_EDIT) {
			// 	const [newInputs, extraOutputs] = mapKeysDiff(inputData, outputData);
			// 	extraOutputs.forEach((v) => outputData.delete(v));
			// 	newInputs.forEach((v) =>
			// 		outputData.set(v, parseCommand(inputData.get(v) ?? '')),
			// 	);
			// 	if (extraOutputs.length || newInputs.length) {
			// 		outputNewFile(outputFile, '//', [...outputData.entries()]);
			// 	}
			// }

			for (const [caseName, input] of inputData.entries()) {
				if (caseName) {
					test(caseName, () => {
						const output = outputData.get(caseName);
						strictEqual(parseCommand(input ?? ''), output);
					});
				}
			}
		});
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/helpers/completionItem.ts]---
Location: vscode-main/extensions/terminal-suggest/src/helpers/completionItem.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import type { ICompletionResource } from '../types';

export function createCompletionItem(cursorPosition: number, currentCommandString: string, commandResource: ICompletionResource, detail?: string, documentation?: string | vscode.MarkdownString, kind?: vscode.TerminalCompletionItemKind): vscode.TerminalCompletionItem {
	const endsWithSpace = currentCommandString.endsWith(' ');
	const lastWord = endsWithSpace ? '' : currentCommandString.split(' ').at(-1) ?? '';
	return {
		label: commandResource.label,
		detail: detail ?? commandResource.detail ?? '',
		documentation,
		replacementRange: [cursorPosition - lastWord.length, cursorPosition],
		kind: kind ?? commandResource.kind ?? vscode.TerminalCompletionItemKind.Method
	};
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/helpers/executable.ts]---
Location: vscode-main/extensions/terminal-suggest/src/helpers/executable.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { osIsWindows } from './os';
import * as fs from 'fs/promises';

export function isExecutable(filePath: string, windowsExecutableExtensions?: Set<string>): Promise<boolean> | boolean {
	if (osIsWindows()) {
		const extensions = windowsExecutableExtensions ?? defaultWindowsExecutableExtensionsSet;
		return hasWindowsExecutableExtension(filePath, extensions);
	}
	return isExecutableUnix(filePath);
}

export async function isExecutableUnix(filePath: string): Promise<boolean> {
	try {
		const stats = await fs.stat(filePath);
		// On macOS/Linux, check if the executable bit is set
		return (stats.mode & 0o100) !== 0;
	} catch (error) {
		// If the file does not exist or cannot be accessed, it's not executable
		return false;
	}
}

export const windowsDefaultExecutableExtensions: string[] = [
	'.exe',   // Executable file
	'.bat',   // Batch file
	'.cmd',   // Command script
	'.com',   // Command file

	'.msi',   // Windows Installer package

	'.ps1',   // PowerShell script

	'.vbs',   // VBScript file
	'.js',    // JScript file
	'.jar',   // Java Archive (requires Java runtime)
	'.py',    // Python script (requires Python interpreter)
	'.rb',    // Ruby script (requires Ruby interpreter)
	'.pl',    // Perl script (requires Perl interpreter)
	'.sh',    // Shell script (via WSL or third-party tools)
];

const defaultWindowsExecutableExtensionsSet = new Set<string>();
for (const ext of windowsDefaultExecutableExtensions) {
	defaultWindowsExecutableExtensionsSet.add(ext);
}

export class WindowsExecutableExtensionsCache {
	private _rawConfig: { [key: string]: boolean | undefined } | undefined;
	private _cachedExtensions: Set<string> | undefined;

	constructor(rawConfig?: { [key: string]: boolean | undefined }) {
		this._rawConfig = rawConfig;
	}

	update(rawConfig: { [key: string]: boolean | undefined } | undefined): void {
		this._rawConfig = rawConfig;
		this._cachedExtensions = undefined;
	}

	getExtensions(): Set<string> {
		if (!this._cachedExtensions) {
			this._cachedExtensions = resolveWindowsExecutableExtensions(this._rawConfig);
		}
		return this._cachedExtensions;
	}
}

function hasWindowsExecutableExtension(filePath: string, extensions: Set<string>): boolean {
	const fileName = filePath.slice(Math.max(filePath.lastIndexOf('\\'), filePath.lastIndexOf('/')) + 1);
	for (const ext of extensions) {
		if (fileName.endsWith(ext)) {
			return true;
		}
	}
	return false;
}

function resolveWindowsExecutableExtensions(configuredWindowsExecutableExtensions?: { [key: string]: boolean | undefined }): Set<string> {
	const extensions = new Set<string>();
	const configured = configuredWindowsExecutableExtensions ?? {};
	const excluded = new Set<string>();

	for (const [ext, value] of Object.entries(configured)) {
		if (value !== true) {
			excluded.add(ext);
		}
	}

	for (const ext of windowsDefaultExecutableExtensions) {
		if (!excluded.has(ext)) {
			extensions.add(ext);
		}
	}

	for (const [ext, value] of Object.entries(configured)) {
		if (value === true) {
			extensions.add(ext);
		}
	}

	return extensions;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/helpers/file.ts]---
Location: vscode-main/extensions/terminal-suggest/src/helpers/file.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function removeAnyFileExtension(label: string): string {
	return label.replace(/\.[a-zA-Z0-9!#\$%&'\(\)\-@\^_`{}~\+,;=\[\]]+$/, '');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/helpers/filepaths.ts]---
Location: vscode-main/extensions/terminal-suggest/src/helpers/filepaths.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function filepaths(options: { extensions?: string[]; editFileSuggestions?: { priority: number } }): Fig.Generator {
	return {
		custom: async (tokens, executeCommand, generatorContext) => {
			const fileExtensionsMap: Record<string, string[]> = { fileExtensions: options.extensions || [] };
			return [{ type: 'file', _internal: fileExtensionsMap }, { type: 'folder' }];
		},
		trigger: (oldToken, newToken) => {
			return true;
		},
		getQueryTerm: (token) => token
	};
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/helpers/keyvalue.ts]---
Location: vscode-main/extensions/terminal-suggest/src/helpers/keyvalue.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export type KeyValueSuggestions =
	| string[]
	| Fig.Suggestion[]
	| NonNullable<Fig.Generator['custom']>;

/** @deprecated use `KeyValueSuggestions` */
export type Suggestions = KeyValueSuggestions;

export type CacheValue = boolean | 'keys' | 'values';

export interface ValueListInit {
	/** String to use as the separator between keys and values */
	delimiter?: string;

	/** List of suggestions */
	values?: KeyValueSuggestions;

	/** Cache key and value suggestions */
	cache?: boolean;

	/** Insert the delimiter string after accepting a suggestion (default: false) */
	insertDelimiter?: boolean;

	/** Don't filter repeated values from suggestions (default: false) */
	allowRepeatedValues?: boolean;
}

export interface KeyValueInit {
	/** String to use as the separator between keys and values */
	separator?: string;

	/** List of key suggestions */
	keys?: KeyValueSuggestions;

	/** List of value suggestions */
	values?: KeyValueSuggestions;

	/** Cache key and value suggestions */
	cache?: CacheValue;

	/** Should the separator be inserted after a key? (default: true ) */
	insertSeparator?: boolean;
}

export interface KeyValueListInit {
	/** String to use as the separator between keys and values */
	separator?: string;

	/** String to use as the separator between key-value pairs */
	delimiter?: string;

	/** List of key suggestions */
	keys?: KeyValueSuggestions;

	/** List of value suggestions */
	values?: KeyValueSuggestions;

	/** Cache key and value suggestions */
	cache?: CacheValue;

	/** Should the separator be inserted after a key? (default: true ) */
	insertSeparator?: boolean;

	/** Insert the delimiter string after accepting a value suggestion (default: false) */
	insertDelimiter?: boolean;

	/** Don't filter repeated keys from suggestions (default: false) */
	allowRepeatedKeys?: boolean;

	/** Don't filter repeated values from suggestions (default: true) */
	allowRepeatedValues?: boolean;
}

/** Cache of Fig suggestions using the string[]/Suggestion[]/function as a key */
const suggestionCache = new Map<KeyValueSuggestions, Fig.Suggestion[]>();

function appendToInsertValue(append: string, suggestions: Fig.Suggestion[]): Fig.Suggestion[] {
	if (append.length === 0) {
		return suggestions;
	}
	return suggestions.map((item) =>
		item.insertValue ? item : { ...item, insertValue: item.name + append }
	);
}

async function kvSuggestionsToFigSuggestions(
	suggestions: KeyValueSuggestions,
	append: string,
	init: Parameters<NonNullable<Fig.Generator['custom']>>
): Promise<Fig.Suggestion[]> {
	if (typeof suggestions === 'function') {
		const out = await suggestions(...init);
		return appendToInsertValue(append, out?.filter(e => !!e) ?? []);
	}
	if (typeof suggestions[0] === 'string') {
		const out = (suggestions as string[]).map((name) => ({ name }));
		return appendToInsertValue(append, out);
	}
	return appendToInsertValue(append, suggestions as Fig.Suggestion[]);
}

async function getSuggestions(
	suggestions: KeyValueSuggestions,
	append: string,
	useSuggestionCache: boolean,
	init: Parameters<NonNullable<Fig.Generator['custom']>>
): Promise<Fig.Suggestion[]> {
	if (useSuggestionCache || Array.isArray(suggestions)) {
		let value = suggestionCache.get(suggestions);
		if (value === undefined) {
			value = await kvSuggestionsToFigSuggestions(suggestions, append, init);
			suggestionCache.set(suggestions, value);
		}
		return value;
	}
	return kvSuggestionsToFigSuggestions(suggestions, append, init);
}

function shouldUseCache(isKey: boolean, cache: CacheValue) {
	if (typeof cache === 'string') {
		return (isKey && cache === 'keys') || (!isKey && cache === 'values');
	}
	return cache;
}

/** Get the final index of any of the strings */
function lastIndexOf(haystack: string, ...needles: readonly string[]) {
	return Math.max(...needles.map((needle) => haystack.lastIndexOf(needle)));
}

function removeRepeatSuggestions(
	alreadyUsed: string[],
	suggestions: readonly Fig.Suggestion[]
): Fig.Suggestion[] {
	const seen = new Set(alreadyUsed);
	return suggestions.filter((suggestion) => {
		if (typeof suggestion.name === 'string') {
			return !seen.has(suggestion.name);
		}
		return !suggestion.name?.some((name) => seen.has(name));
	});
}

/**
 * Create a generator that gives suggestions for val,val,... arguments. You
 * can use a `string[]` or `Fig.Suggestion[]` for the values.
 *
 * You can set `cache: true` to enable caching results. The suggestions are cached
 * globally using the function as a key, so enabling caching for any one generator
 * will set the cache values for the functions for the entire spec. This behavior
 * can be used to compose expensive generators without incurring a cost every time
 * they're used.
 *
 * The primary use of this is to enable the same caching behavior as `keyValue`
 * and `keyValueList`. If your goal is to create a $PATH-like value, use a generator
 * object literal: `{ template: "filepaths", trigger: ":", getQueryTerm: ":" }`
 */
export function valueList({
	delimiter = ',',
	values = [],
	cache = false,
	insertDelimiter = false,
	allowRepeatedValues = false,
}: ValueListInit): Fig.Generator {
	return {
		trigger: (newToken, oldToken) =>
			newToken.lastIndexOf(delimiter) !== oldToken.lastIndexOf(delimiter),

		getQueryTerm: (token) => token.slice(token.lastIndexOf(delimiter) + delimiter.length),

		custom: async (...init) => {
			const out = await getSuggestions(values, insertDelimiter ? delimiter : '', cache, init);
			if (allowRepeatedValues) {
				return out;
			}
			const [tokens] = init;
			const valuesInList = tokens[tokens.length - 1]?.split(delimiter);
			return removeRepeatSuggestions(valuesInList, out);
		},
	};
}

/**
 * Create a generator that gives suggestions for key=value arguments. You
 * can use a `string[]` or `Fig.Suggestion[]` for the keys and values, or a
 * function with the same signature as `Fig.Generator["custom"]`.
 *
 * You can set `cache: true` to enable caching results. The suggestions are cached
 * globally using the function as a key, so enabling caching for any one generator
 * will set the cache values for the functions for the entire spec. This behavior
 * can be used to copmpose expensive key/value generators without incurring the
 * initial cost every time they're used.
 *
 * Note that you should only cache generators that produce the same output regardless
 * of their input. You can cache either the keys or values individually using `"keys"`
 * or `"values"` as the `cache` property value.
 *
 * @example
 *
 * ```typescript
 * // set-values a=1 b=3 c=2
 * const spec: Fig.Spec = {
 *   name: "set-values",
 *   args: {
 *     name: "values",
 *     isVariadic: true,
 *     generators: keyValue({
 *       keys: ["a", "b", "c"],
 *       values: ["1", "2", "3"],
 *     }),
 *   },
 * }
 * ```
 *
 * @example The separator between keys and values can be customized (default: `=`)
 *
 * ```typescript
 * // key1:value
 * keyValue({
 *   separator: ":",
 *   keys: [
 *     { name: "key1", icon: "fig://icon?type=string" },
 *     { name: "key2", icon: "fig://icon?type=string" },
 *   ],
 * }),
 * ```
 */
export function keyValue({
	separator = '=',
	keys = [],
	values = [],
	cache = false,
	insertSeparator = true,
}: KeyValueInit): Fig.Generator {
	return {
		trigger: (newToken, oldToken) => newToken.indexOf(separator) !== oldToken.indexOf(separator),
		getQueryTerm: (token) => token.slice(token.indexOf(separator) + 1),
		custom: async (...init) => {
			const [tokens] = init;
			const finalToken = tokens[tokens.length - 1];
			const isKey = !finalToken.includes(separator);
			const suggestions = isKey ? keys : values;
			const useCache = shouldUseCache(isKey, cache);
			const append = isKey ? (insertSeparator ? separator : '') : '';
			return getSuggestions(suggestions, append, useCache, init);
		},
	};
}

/**
 * Create a generator that gives suggestions for `k=v,k=v,...` arguments. You
 * can use a `string[]` or `Fig.Suggestion[]` for the keys and values, or a
 * function with the same signature as `Fig.Generator["custom"]`
 *
 * You can set `cache: true` to enable caching results. The suggestions are cached
 * globally using the function as a key, so enabling caching for any one generator
 * will set the cache values for the functions for the entire spec. This behavior
 * can be used to copmpose expensive key/value generators without incurring the
 * initial cost every time they're used.
 *
 * Note that you should only cache generators that produce the same output regardless
 * of their input. You can cache either the keys or values individually using `"keys"`
 * or `"values"` as the `cache` property value.
 *
 * @example
 *
 * ```typescript
 * // set-values a=1,b=3,c=2
 * const spec: Fig.Spec = {
 *   name: "set-values",
 *   args: {
 *     name: "values",
 *     generators: keyValueList({
 *       keys: ["a", "b", "c"],
 *       values: ["1", "2", "3"],
 *     }),
 *   },
 * }
 * ```
 *
 * @example
 *
 * The separator between keys and values can be customized. It's `=` by
 * default. You can also change the key/value pair delimiter, which is `,`
 * by default.
 *
 * ```typescript
 * // key1:value&key2:another
 * keyValueList({
 *   separator: ":",
 *   delimiter: "&"
 *   keys: [
 *     { name: "key1", icon: "fig://icon?type=string" },
 *     { name: "key2", icon: "fig://icon?type=string" },
 *   ],
 * }),
 * ```
 */
export function keyValueList({
	separator = '=',
	delimiter = ',',
	keys = [],
	values = [],
	cache = false,
	insertSeparator = true,
	insertDelimiter = false,
	allowRepeatedKeys = false,
	allowRepeatedValues = true,
}: KeyValueListInit): Fig.Generator {
	return {
		trigger: (newToken, oldToken) => {
			const newTokenIdx = lastIndexOf(newToken, separator, delimiter);
			const oldTokenIdx = lastIndexOf(oldToken, separator, delimiter);
			return newTokenIdx !== oldTokenIdx;
		},
		getQueryTerm: (token) => {
			const index = lastIndexOf(token, separator, delimiter);
			return token.slice(index + 1);
		},
		custom: async (...init) => {
			const [tokens] = init;

			const finalToken = tokens[tokens.length - 1];
			const index = lastIndexOf(finalToken, separator, delimiter);
			const isKey = index === -1 || finalToken.slice(index, index + separator.length) !== separator;

			const suggestions = isKey ? keys : values;
			const useCache = shouldUseCache(isKey, cache);
			const append = isKey ? (insertSeparator ? separator : '') : insertDelimiter ? delimiter : '';
			const out = await getSuggestions(suggestions, append, useCache, init);

			if (isKey) {
				if (allowRepeatedKeys) {
					return out;
				}
				const existingKeys = finalToken
					.split(delimiter)
					.map((chunk) => chunk.slice(0, chunk.indexOf(separator)));
				return removeRepeatSuggestions(existingKeys, out);
			}

			if (allowRepeatedValues) {
				return out;
			}
			const existingValues = finalToken
				.split(delimiter)
				.map((chunk) => chunk.slice(chunk.indexOf(separator) + separator.length));
			return removeRepeatSuggestions(existingValues, out);
		},
	};
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/helpers/os.ts]---
Location: vscode-main/extensions/terminal-suggest/src/helpers/os.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as os from 'os';

export function osIsWindows(): boolean {
	return os.platform() === 'win32';
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/helpers/promise.ts]---
Location: vscode-main/extensions/terminal-suggest/src/helpers/promise.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function createTimeoutPromise<T>(timeout: number, defaultValue: T): Promise<T> {
	return new Promise(resolve => setTimeout(() => resolve(defaultValue), timeout));
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/helpers/uri.ts]---
Location: vscode-main/extensions/terminal-suggest/src/helpers/uri.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export function getFriendlyResourcePath(uri: vscode.Uri, pathSeparator: string, kind?: vscode.TerminalCompletionItemKind): string {
	let path = uri.fsPath;
	// Ensure drive is capitalized on Windows
	if (pathSeparator === '\\' && path.match(/^[a-zA-Z]:\\/)) {
		path = `${path[0].toUpperCase()}:${path.slice(2)}`;
	}
	if (kind === vscode.TerminalCompletionItemKind.Folder) {
		if (!path.endsWith(pathSeparator)) {
			path += pathSeparator;
		}
	}
	return path;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/shell/bash.ts]---
Location: vscode-main/extensions/terminal-suggest/src/shell/bash.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import type { ICompletionResource } from '../types';
import { type ExecOptionsWithStringEncoding } from 'node:child_process';
import { execHelper, getAliasesHelper } from './common';

export async function getBashGlobals(options: ExecOptionsWithStringEncoding, existingCommands?: Set<string>): Promise<(string | ICompletionResource)[]> {
	return [
		...await getAliases(options),
		...await getBuiltins(options, 'compgen -b', existingCommands)
	];
}

async function getAliases(options: ExecOptionsWithStringEncoding): Promise<ICompletionResource[]> {
	const args = process.platform === 'darwin' ? ['-icl', 'alias'] : ['-ic', 'alias'];
	return getAliasesHelper('bash', args, /^alias (?<alias>[a-zA-Z0-9\.:-]+)='(?<resolved>.+)'$/, options);
}

export async function getBuiltins(
	options: ExecOptionsWithStringEncoding,
	scriptToRun: string,
	existingCommands?: Set<string>,
): Promise<(string | ICompletionResource)[]> {
	const compgenOutput = await execHelper(scriptToRun, options);
	const filter = (cmd: string) => cmd && !existingCommands?.has(cmd);
	const builtins: string[] = compgenOutput.split('\n').filter(filter);
	const completions: ICompletionResource[] = [];
	if (builtins.find(r => r === '.')) {
		completions.push({
			label: '.',
			detail: 'Source a file in the current shell',
			kind: vscode.TerminalCompletionItemKind.Method
		});
	}

	for (const cmd of builtins) {
		if (typeof cmd === 'string') {
			try {
				const helpOutput = (await execHelper(`help ${cmd}`, options))?.trim();
				const helpLines = helpOutput?.split('\n');
				//TODO: This still has some extra spaces in it
				const outputDescription = helpLines.splice(1).map(line => line.trim()).join('');
				const args = helpLines?.[0]?.split(' ').slice(1).join(' ').trim();
				const { detail, documentation, description } = generateDetailAndDocs(outputDescription, args);
				completions.push({
					label: { label: cmd, description },
					detail,
					documentation: new vscode.MarkdownString(documentation),
					kind: vscode.TerminalCompletionItemKind.Method
				});

			} catch (e) {
				// Ignore errors
				console.log(`Error getting info for ${e}`);
				completions.push({
					label: cmd,
					kind: vscode.TerminalCompletionItemKind.Method
				});
			}
		}
	}

	return completions;
}

export function generateDetailAndDocs(description?: string, args?: string): { detail?: string; documentation?: string; description?: string } {
	let detail, documentation = '';
	const firstSentence = (text: string): string => text.split('. ')[0] + '.';
	if (description) {
		description = firstSentence(description);
		detail = args;
		documentation = description;
	}
	return { detail, documentation, description };
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/shell/common.ts]---
Location: vscode-main/extensions/terminal-suggest/src/shell/common.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { exec, spawn, type ExecOptionsWithStringEncoding, type SpawnOptionsWithoutStdio } from 'node:child_process';
import type { ICompletionResource } from '../types';

export async function spawnHelper(command: string, args: string[], options: SpawnOptionsWithoutStdio): Promise<string> {
	// This must be run with interactive, otherwise there's a good chance aliases won't
	// be set up. Note that this could differ from the actual aliases as it's a new bash
	// session, for the same reason this would not include aliases that are created
	// by simply running `alias ...` in the terminal.
	return new Promise<string>((resolve, reject) => {
		const child = spawn(command, args, options);
		let stdout = '';
		child.stdout.on('data', (data) => {
			stdout += data;
		});
		child.on('close', (code) => {
			if (code !== 0) {
				reject(new Error(`process exited with code ${code}`));
			} else {
				resolve(stdout);
			}
		});
	});
}

export interface ISpawnHelperResult {
	stdout: string;
	stderr: string;
	exitCode: number;
}
export async function spawnHelper2(command: string, args: string[], options: SpawnOptionsWithoutStdio): Promise<ISpawnHelperResult> {
	// This must be run with interactive, otherwise there's a good chance aliases won't
	// be set up. Note that this could differ from the actual aliases as it's a new bash
	// session, for the same reason this would not include aliases that are created
	// by simply running `alias ...` in the terminal.
	return new Promise<ISpawnHelperResult>((resolve, reject) => {
		const stdout: string[] = [];
		const stderr: string[] = [];
		const child = spawn(command, args, options);
		child.stdout.on('data', (data) => stdout.push(data));
		child.stderr.on('data', (data) => stderr.push(data));
		child.on('error', (error) => reject(error));
		child.on('close', (code) => {
			resolve({
				stdout: stdout.join(''),
				stderr: stderr.join(''),
				exitCode: code ?? -1
			});
		});
	});
}

export async function execHelper(commandLine: string, options: ExecOptionsWithStringEncoding): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		exec(commandLine, options, (error, stdout) => {
			if (error) {
				reject(error);
			} else {
				resolve(stdout);
			}
		});
	});
}

export async function getAliasesHelper(command: string, args: string[], regex: RegExp, options: ExecOptionsWithStringEncoding): Promise<ICompletionResource[]> {
	// This must be run with interactive, otherwise there's a good chance aliases won't
	// be set up. Note that this could differ from the actual aliases as it's a new bash
	// session, for the same reason this would not include aliases that are created
	// by simply running `alias ...` in the terminal.
	const aliasOutput = await spawnHelper(command, args, options);
	const result: ICompletionResource[] = [];
	for (const line of aliasOutput.split('\n')) {
		const match = line.match(regex);
		if (!match?.groups) {
			continue;
		}
		let definitionCommand = '';
		let definitionIndex = match.groups.resolved.indexOf(' ');
		if (definitionIndex === -1) {
			definitionIndex = match.groups.resolved.length;
		}
		definitionCommand = match.groups.resolved.substring(0, definitionIndex);
		result.push({
			label: { label: match.groups.alias, description: match.groups.resolved },
			detail: match.groups.resolved,
			kind: vscode.TerminalCompletionItemKind.Alias,
			definitionCommand,
		});
	}
	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/shell/fish.ts]---
Location: vscode-main/extensions/terminal-suggest/src/shell/fish.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import type { ICompletionResource } from '../types';
import { getAliasesHelper } from './common';
import { type ExecOptionsWithStringEncoding } from 'node:child_process';
import { fishBuiltinsCommandDescriptionsCache } from './fishBuiltinsCache';

const commandDescriptionsCache: Map<string, { shortDescription?: string; description: string; args: string | undefined }> | undefined = parseCache(fishBuiltinsCommandDescriptionsCache);

export async function getFishGlobals(options: ExecOptionsWithStringEncoding, existingCommands?: Set<string>): Promise<(string | ICompletionResource)[]> {
	return [
		...await getAliases(options),
		...await getBuiltins(options),
	];
}

async function getBuiltins(options: ExecOptionsWithStringEncoding): Promise<(string | ICompletionResource)[]> {
	const completions: ICompletionResource[] = [];

	// Use the cache directly for all commands
	for (const cmd of [...commandDescriptionsCache!.keys()]) {
		try {
			const result = getCommandDescription(cmd);
			if (result) {
				completions.push({
					label: { label: cmd, description: result.description },
					detail: result.args,
					documentation: new vscode.MarkdownString(result.documentation),
					kind: vscode.TerminalCompletionItemKind.Method
				});
			} else {
				console.warn(`Fish command "${cmd}" not found in cache.`);
				completions.push({
					label: cmd,
					kind: vscode.TerminalCompletionItemKind.Method
				});
			}
		} catch (e) {
			// Ignore errors
			completions.push({
				label: cmd,
				kind: vscode.TerminalCompletionItemKind.Method
			});
		}
	}

	return completions;
}

export function getCommandDescription(command: string): { documentation?: string; description?: string; args?: string | undefined } | undefined {
	if (!commandDescriptionsCache) {
		return undefined;
	}
	const result = commandDescriptionsCache.get(command);
	if (!result) {
		return undefined;
	}

	if (result.shortDescription) {
		return {
			description: result.shortDescription,
			args: result.args,
			documentation: result.description
		};
	} else {
		return {
			description: result.description,
			args: result.args,
			documentation: result.description
		};
	}
}

function parseCache(cache: Object): Map<string, { shortDescription?: string; description: string; args: string | undefined }> | undefined {
	if (!cache) {
		return undefined;
	}
	const result = new Map<string, { shortDescription?: string; description: string; args: string | undefined }>();
	for (const [key, value] of Object.entries(cache)) {
		result.set(key, value);
	}
	return result;
}

async function getAliases(options: ExecOptionsWithStringEncoding): Promise<ICompletionResource[]> {
	return getAliasesHelper('fish', ['-ic', 'alias'], /^alias (?<alias>[a-zA-Z0-9\.:-]+) (?<resolved>.+)$/, options);
}
```

--------------------------------------------------------------------------------

````
