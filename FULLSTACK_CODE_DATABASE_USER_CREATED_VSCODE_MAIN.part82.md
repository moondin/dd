---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 82
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 82 of 552)

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

---[FILE: extensions/terminal-suggest/src/completions/index.d.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/index.d.ts

```typescript
/* eslint-disable @typescript-eslint/ban-types */
declare namespace Fig {
	/**
	 * Templates are generators prebuilt by Fig.
	 * @remarks
	 * Here are the three templates:
	 * - filepaths: show folders and filepaths. Allow autoexecute on filepaths
	 * - folders: show folders only. Allow autoexecute on folders
	 * - history: show suggestions for all items in history matching this pattern
	 * - help: show subcommands. Only includes the 'siblings' of the nearest 'parent' subcommand
	 */
	type TemplateStrings = "filepaths" | "folders" | "history" | "help";

	/**
	 * A template which is a single TemplateString or an array of TemplateStrings
	 *
	 * @remarks
	 * Templates are generators prebuilt by Fig. Here are the three templates:
	 * - filepaths: show folders and filepaths. Allow autoexecute on filepaths
	 * - folders: show folders only. Allow autoexecute on folders
	 * - history: show suggestions for all items in history matching this pattern
	 * - help: show subcommands. Only includes the 'siblings' of the nearest 'parent' subcommand
	 *
	 * @example
	 * `cd` uses the "folders" template
	 * `ls` used  ["filepaths", "folders"]. Why both? Because if I `ls` a directory, we want to enable a user to autoexecute on this directory. If we just did "filepaths" they couldn't autoexecute.
	 *
	 */
	type Template = TemplateStrings | TemplateStrings[];

	type HistoryContext = {
		currentWorkingDirectory: string;
		time: number;
		exitCode: number;
		shell: string;
	};

	type TemplateSuggestionContext =
		| { templateType: "filepaths" }
		| { templateType: "folders" }
		| { templateType: "help" }
		| ({ templateType: "history" } & Partial<HistoryContext>);

	type TemplateSuggestion = Modify<
		Suggestion,
		{ name?: string; context: TemplateSuggestionContext }
	>;

	/**
	 *
	 * The SpecLocation object defines well... the location of the completion spec we want to load.
	 * Specs can be "global" (ie hosted by Fig's cloud) or "local" (ie stored on your local machine)
	 *
	 * @remarks
	 * **The `SpecLocation` Object**
	 *
	 * The SpecLocation object defines well... the location of the completion spec we want to load.
	 * Specs can be "global" (ie hosted by Fig's cloud) or "local" (ie stored on your local machine).
	 *
	 * - Global `SpecLocation`:
	 * Load specs hosted in Fig's Cloud. Assume the current working directory is here: https://github.com/withfig/autocomplete/tree/master/src. Now set the value for the "name" prop to the relative location of your spec (without the .js file extension)
	 * ```js
	 * // e.g.
	 * { type: "global", name: "aws/s3" } // Loads up the aws s3 completion spec
	 * { type: "global", name: "python/http.server" } // Loads up the http.server completion spec
	 * ```
	 *
	 * - Local `SpecLocation`:
	 * Load specs saved on your local system / machine. Assume the current working directory is the user's current working directory.
	 * The `name` prop should take the name of the spec (without the .js file extension) e.g. my_cli_tool
	 * The `path` prop should take an absolute path OR a relative path (relative to the user's current working directory). The path should be to the directory that contains the `.fig` folder. Fig will then assume your spec is located in `.fig/autocomplete/build/`
	 * ```js
	 * // e.g.
	 * { type: "global", path: "node_modules/cowsay", name: "cowsay_cli" }  // will look for `cwd/node_modules/cowsay/.fig/autocomplete/build/cowsay_cli.js`
	 * { type: "global", path: "~", name: "my_cli" }  // will look for `~/.fig/autocomplete/build/my_cli.js`
	 * ```
	 * @irreplaceable
	 */
	type SpecLocation =
		| { type: "local"; path?: string; name: string }
		| { type: "global"; name: string };

	/**
	 * Dynamically load up another completion spec at runtime.
	 *
	 * See [`loadSpec` property in Subcommand Object](https://fig.io/docs/reference/subcommand#loadspec).
	 */
	type LoadSpec =
		| string
		| Subcommand
		| ((
			token: string,
			executeCommand: ExecuteCommandFunction
		) => Promise<SpecLocation | SpecLocation[] | Subcommand>);

	/**
	 * The type of a suggestion object.
	 * @remarks
	 * The type determines:
	 * - the default icon Fig uses (e.g. a file or folder searches for the system icon, a subcommand has a specific icon etc)
	 * - whether we allow users to auto-execute a command
	 */
	type SuggestionType =
		| "folder"
		| "file"
		| "arg"
		| "subcommand"
		| "option"
		| "special"
		| "mixin"
		| "shortcut";

	/**
	 * A single object of type `T` or an array of objects of type `T`.
	 */
	type SingleOrArray<T> = T | T[];

	/**
	 * An async function that returns the version of a given CLI tool.
	 * @remarks
	 * This is used in completion specs that want to version themselves the same way CLI tools are versioned. See fig.io/docs
	 *
	 * @param executeCommand -an async function that allows you to execute a shell command on the user's system and get the output as a string.
	 * @returns The version of a CLI tool
	 *
	 * @example
	 * `1.0.22`
	 *
	 * @example
	 * `v26`
	 *
	 */
	type GetVersionCommand = (executeCommand: ExecuteCommandFunction) => Promise<string>;

	/**
	 * Context about a current shell session.
	 */
	type ShellContext = {
		/**
		 * The current directory the shell is in
		 */
		currentWorkingDirectory: string;
		/**
		 * Exported environment variables from the shell
		 */
		environmentVariables: Record<string, string>;
		/**
		 * The name of the current process
		 */
		currentProcess: string;
		/**
		 * @hidden
		 * @deprecated
		 */
		sshPrefix: string;
	};

	type GeneratorContext = ShellContext & {
		isDangerous?: boolean;
		searchTerm: string;
	};

	/**
	 * A function which can have a `T` argument and a `R` result.
	 * @param param - A param of type `R`
	 * @returns Something of type `R`
	 */
	type Function<T = void, R = void> = (param: T) => R;

	/**
	 * A utility type to modify a property type
	 * @irreplaceable
	 */
	type Modify<T, R> = Omit<T, keyof R> & R;

	/**
	 * A `string` OR a `function` which can have a `T` argument and a `R` result.
	 * @param param - A param of type `R`
	 * @returns Something of type `R`
	 */
	type StringOrFunction<T = void, R = void> = string | Function<T, R>;

	/**
	 * @excluded
	 * @irreplaceable
	 */
	type ArgDiff = Modify<Fig.Arg, { remove?: true }>;

	/**
	 * @excluded
	 * @irreplaceable
	 */
	type OptionDiff = Modify<
		Fig.Option,
		{
			args?: ArgDiff | ArgDiff[];
			remove?: true;
		}
	>;

	/**
	 * @excluded
	 * @irreplaceable
	 */
	type SubcommandDiff = Modify<
		Fig.Subcommand,
		{
			subcommands?: SubcommandDiff[];
			options?: OptionDiff[];
			args?: ArgDiff | ArgDiff[];
			remove?: true;
		}
	>;

	/**
	 * @excluded
	 * @irreplaceable
	 */
	type SpecDiff = Omit<SubcommandDiff, "name" | "remove">;

	/**
	 * @excluded
	 * @irreplaceable
	 */
	type VersionDiffMap = Record<string, SpecDiff>;

	/**
	 * A spec object.
	 * Can be one of
	 * 1. A subcommand
	 * 2. A function that dynamically computes a subcommand
	 * 3. A function that returns the path to a versioned spec files (that exports a base subcommand and { versions: VersionDiffMap }
	 */
	type Spec =
		| Subcommand
		| ((version?: string) => Subcommand)
		| ((version?: string) => {
			versionedSpecPath: string;
			version?: string;
		});

	type ExecuteCommandInput = {
		/**
		 * The command to execute
		 */
		command: string;
		/**
		 * The arguments to the command to be run
		 */
		args: string[];
		/**
		 * The directory to run the command in
		 */
		cwd?: string;
		/**
		 * The environment variables to set when executing the command, `undefined` will unset the variable if it set
		 */
		env?: Record<string, string | undefined>;
		/**
		 * Duration of timeout in milliseconds, if the command takes longer than the timeout a error will be thrown.
		 * @defaultValue 5000
		 */
		timeout?: number;
	};

	/**
	 * The output of running a command
	 */
	type ExecuteCommandOutput = {
		/**
		 * The stdout (1) of running a command
		 */
		stdout: string;
		/**
		 * The stderr (2) of running a command
		 */
		stderr: string;
		/**
		 * The exit status of running a command
		 */
		status: number;
	};

	/**
	 * An async function to execute a command
	 * @returns The output of the command
	 */
	type ExecuteCommandFunction = (args: ExecuteCommandInput) => Promise<ExecuteCommandOutput>;

	type CacheMaxAge = {
		strategy: "max-age";
		/**
		 * The time to live for the cache in milliseconds.
		 * @example
		 * 3600
		 */
		ttl: number;
	};

	type CacheStaleWhileRevalidate = {
		strategy?: "stale-while-revalidate";
		/**
		 * The time to live for the cache in milliseconds.
		 * @example
		 * 3600
		 */
		ttl?: number;
	};

	type Cache = (CacheMaxAge | CacheStaleWhileRevalidate) & {
		/**
		 * Whether the cache should be based on the directory the user was currently in or not.
		 * @defaultValue false
		 */
		cacheByDirectory?: boolean;

		/**
		 * Hardcoded cache key that can be used to cache a single generator across
		 * multiple argument locations in a spec.
		 */
		cacheKey?: string;
	};

	type TriggerOnChange = {
		/** Trigger on any change to the token */
		on: "change";
	};

	type TriggerOnThreshold = {
		/** Trigger when the length of the token changes past a threshold */
		on: "threshold";
		length: number;
	};

	type TriggerOnMatch = {
		/** Trigger when the index of a string changes */
		on: "match";
		string: string | string[];
	};

	type Trigger =
		| string
		| ((newToken: string, oldToken: string) => boolean)
		| TriggerOnChange
		| TriggerOnThreshold
		| TriggerOnMatch;

	/**
	 * The BaseSuggestion object is the root of the Suggestion, Subcommand, and Option objects.
	 * It is where key properties like description, icon, and displayName are found
	 * @excluded
	 */
	interface BaseSuggestion {
		/**
		 * The string that is displayed in the UI for a given suggestion.
		 * @defaultValue the name prop
		 *
		 * @example
		 * The npm CLI has a subcommand called `install`. If we wanted
		 * to display some custom text like `Install an NPM package 📦` we would set
		 * `name: "install"` and `displayName: "Install an NPM package 📦"`
		 */
		displayName?: string;
		/**
		 * The value that's inserted into the terminal when a user presses enter/tab or clicks on a menu item.
		 *
		 * @remarks
		 * You can use `\n` to insert a newline or `\b` to insert a backspace.
		 * You can also optionally specify {cursor} in the string and Fig will automatically place the cursor there after insert.
		 *
		 * @defaultValue The value of the name prop.
		 *
		 * @example
		 * For the `git commit` subcommand, the `-m` option has an insert value of `-m '{cursor}'`
		 */
		insertValue?: string;
		/**
		 * When the suggestion is inserted, replace the command with this string
		 *
		 * @remarks
		 * You can use `\n` to insert a newline or `\b` to insert a backspace.
		 * You can also optionally specify {cursor} in the string and Fig will automatically place the cursor there after insert.
		 * Note that currently the entire edit buffer will be replaced. Eventually, only the root command will be replaced, preserving pipes and continuations.
		 */
		replaceValue?: string;
		/**
		 * The text that gets rendered at the bottom of the autocomplete box (or the side if you hit ⌘i)
		 *
		 * @example
		 * "Your commit message"
		 */
		description?: string;
		/**
		 * The icon that is rendered is based on the type.
		 *
		 * @remarks
		 * Icons can be a 1 character string, a URL, or Fig's [icon protocol](https://fig.io/docs/reference/suggestion/icon-api) (fig://) which lets you generate
		 * colorful and fun systems icons.
		 *
		 * @defaultValue related to the type of the object (e.g. `Suggestion`, `Subcommand`, `Option`, `Arg`)
		 *
		 * @example
		 * `A`
		 * @example
		 * `😊`
		 * @example
		 * `https://www.herokucdn.com/favicon.ico`
		 * @example
		 * `fig://icon?type=file`
		 *
		 */
		icon?: string;
		/**
		 * Specifies whether the suggestion is "dangerous".
		 *
		 * @remarks
		 * If true, Fig will not enable its autoexecute functionality. Autoexecute means if a user selects a suggestion it will insert the text and run the command. We signal this by changing the icon to red.
		 * Setting `isDangerous` to `true` will make it harder for a user to accidentally run a dangerous command.
		 *
		 * @defaultValue false
		 *
		 * @example
		 * This is used in the `rm` spec. Why? Because we don't want users to accidentally delete their files so we make it just a little bit harder...
		 */
		isDangerous?: boolean;
		/**
		 * The number used to rank suggestions in autocomplete. Number must be from 0-100. Higher priorities rank higher.
		 *
		 * @defaultValue 50
		 * @remarks
		 * Fig ranks suggestions by recency. To do this, we check if a suggestion has been selected before. If yes and the suggestions has:
		 * - a priority between 50-75, the priority will be replaced with 75, then we will add the timestamp of when that suggestion was selected as a decimal.
		 * - a priority outside of 50-75, the priority will be increased by the timestamp of when that suggestion was selected as a decimal.
		 * If it has not been selected before, Fig will keep the same priority as was set in the completion spec
		 * If it was not set in the spec, it will default to 50.
		 *
		 * @example
		 * Let's say a user has previously selected a suggestion at unix timestamp 1634087677:
		 *     - If completion spec did not set a priority (Fig treats this as priority 50), its priority would change to 75 + 0.1634087677 = 75.1634087677;
		 *     - If completion spec set a priority of 49 or less, its priority would change to 49 + 0.1634087677 = 49.1634087677;
		 *     - If completion spec set a priority of 76 or more, its priority would change to 76 + 0.1634087677 = 76.1634087677;
		 *     - If a user had never selected a suggestion, then its priority would just stay as is (or if not set, default to 50).
		 *
		 * @example
		 * If you want your suggestions to always be:
		 *     - at the top order, rank them 76 or above.
		 *     - at the bottom, rank them 49 or below
		 */
		priority?: number;
		/**
		 * Specifies whether a suggestion should be hidden from results.
		 * @remarks
		 * Fig will only show it if the user exactly types the name.
		 * @defaultValue false
		 * @example
		 * The "-" suggestion is hidden in the `cd` spec. You will only see it if you type exactly  `cd -`
		 */
		hidden?: boolean;
		/**
		 *
		 * Specifies whether a suggestion is deprecated.
		 * @remarks
		 * It is possible to specify a suggestion to replace the deprecated one.
		 * - The `description` of the deprecated object (e.g `deprecated: { description: 'The --no-ansi option has been deprecated in v2' }`) is used to provide infos about the deprecation.
		 * - `deprecated: true` and `deprecated: { }` behave the same and will just display the suggestion as deprecated.
		 * @example
		 * ```js
		 * deprecated: { insertValue: '--ansi never', description: 'The --no-ansi option has been deprecated in v2' }
		 * ```
		 */
		deprecated?: boolean | Omit<BaseSuggestion, "deprecated">;

		/**
		 * Specifies which component to use to render the preview window.
		 *
		 * @remarks This should be the path within the `src` directory to the component without the extension.
		 *
		 * @example 'ls/filepathPreview'
		 */
		previewComponent?: string;

		/**
		 * This is a way to pass data to the Autocomplete Engine that is not formalized in the spec, do not use this in specs as it may change at any time
		 *
		 * @ignore
		 */
		_internal?: Record<string, unknown>;
	}

	/**
	 * Each item in Fig's autocomplete popup window is a Suggestion object. It is probably the most important object in Fig.
	 * Subcommand and Option objects compile down to Suggestion objects. Generators return Suggestion objects.
	 * The main things you can customize in your suggestion object is the text that's displayed, the icon, and what's inserted after being selected. In saying that, most of these have very sane defaults.
	 */
	interface Suggestion extends BaseSuggestion {
		/**
		 * The string Fig uses when filtering over a list of suggestions to check for a match.
		 * @remarks
		 * When a a user is typing in the terminal, the query term (the token they are currently typing) filters over all suggestions in a list by checking if the queryTerm matches the prefix of the name.
		 * The `displayName` prop also defaults to the value of name.
		 *
		 * The `name` props of suggestion, subcommand, option, and arg objects are all different. It's important to read them all carefully.
		 *
		 * @example
		 * If a user types git `c`, any Suggestion objects with a name prop that has a value starting with "c" will match.
		 *
		 */
		name?: SingleOrArray<string>;
		/**
		 * The type of a suggestion object.
		 * @remarks
		 * The type determines
		 * - the default icon Fig uses (e.g. a file or folder searches for the system icon, a subcommand has a specific icon etc)
		 * - whether we allow users to auto-execute a command
		 */
		type?: SuggestionType;
	}

	/**
	 * The subcommand object represent the tree structure of a completion spec. We sometimes also call it the skeleton.
	 *
	 * A subcommand can nest options, arguments, and more subcommands (it's recursive)
	 */
	interface Subcommand extends BaseSuggestion {
		/**
		 * The name of the subcommand. Should exactly match the name defined by the CLI tool.
		 *
		 * @remarks
		 * If a subcommand has multiple aliases, they should be included as an array.
		 *
		 * Note that Fig's autocomplete engine requires this `name` to match the text typed by the user in the shell.
		 *
		 * To customize the title that is displayed to the user, use `displayName`.
		 *
		 *
		 * @example
		 * For `git checkout`, the subcommand `checkout` would have `name: "checkout"`
		 * @example
		 * For `npm install`, the subcommand `install` would have `name: ["install", "i"]` as these two values both represent the same subcommand.
		 */
		name: SingleOrArray<string>;

		/**
		 * An array of `Subcommand` objects representing all the subcommands that exist beneath the current command.
		 *     *
		 * To support large CLI tools, `Subcommands` can be nested recursively.
		 *
		 * @example
		 * A CLI tool like `aws` is composed of many top-level subcommands (`s3`, `ec2`, `eks`...), each of which include child subcommands of their own.
		 */
		subcommands?: Subcommand[];

		/**
		 * Specifies whether the command requires a subcommand. This is false by default.
		 *
		 * A space will always be inserted after this command if `requiresSubcommand` is true.
		 * If the property is omitted, a space will be inserted if there is at least one required argument.
		 */
		requiresSubcommand?: boolean;

		/**
		 * An array of `Option` objects representing the options that are available on this subcommand.
		 *
		 * @example
		 * A command like `git commit` accepts various flags and options, such as `--message` and `--all`. These `Option` objects would be included in the `options` field.
		 */
		options?: Option[];

		/**
		 * An array of `Arg` objects representing the various parameters or "arguments" that can be passed to this subcommand.
		 *
		 */
		args?: SingleOrArray<Arg>;
		/**
		 * This option allows to enforce the suggestion filtering strategy for a specific subcommand.
		 * @remarks
		 * Users always want to have the most accurate results at the top of the suggestions list.
		 * For example we can enable fuzzy search on a subcommand that always requires fuzzy search to show the best suggestions.
		 * This property is also useful when subcommands or options have a prefix (e.g. the npm package scope) because enabling fuzzy search users can omit that part (see the second example below)
		 * @example
		 * yarn workspace [name] with fuzzy search is way more useful since we can omit the npm package scope
		 * @example
		 * fig settings <setting name> uses fuzzy search to prevent having to add the `autocomplete.` prefix to each searched setting
		 * ```typescript
		 * const figSpec: Fig.Spec {
		 *   name: "fig",
		 *   subcommands: [
		 *     {
		 *       name: "settings",
		 *       filterStrategy: "fuzzy",
		 *       subcommands: [
		 *         {
		 *           name: "autocomplete.theme", // if a user writes `fig settings theme` it gets the correct suggestions
		 *         },
		 *         // ... other settings
		 *       ]
		 *     },
		 *     // ... other fig subcommands
		 *   ]
		 * }
		 * ```
		 */
		filterStrategy?: "fuzzy" | "prefix" | "default";
		/**
		 * A list of Suggestion objects that are appended to the suggestions shown beneath a subcommand.
		 *
		 * @remarks
		 * You can use this field to suggest common workflows.
		 *
		 */
		additionalSuggestions?: (string | Suggestion)[];
		/**
		 * Dynamically load another completion spec at runtime.
		 *
		 * @param tokens - a tokenized array of the text the user has typed in the shell.
		 * @param executeCommand - an async function that can execute a shell command on behalf of the user. The output is a string.
		 * @returns A `SpecLocation` object or an array of `SpecLocation` objects.
		 *
		 * @remarks
		 * `loadSpec` can be invoked as string (recommended) or a function (advanced).
		 *
		 * The API tells the autocomplete engine where to look for a completion spec. If you pass a string, the engine will attempt to locate a matching spec that is hosted by Fig.
		 *
		 * @example
		 * Suppose you have an internal CLI tool that wraps `kubectl`. Instead of copying the `kubectl` completion spec, you can include the spec at runtime.
		 * ```typescript
		 * {
		 *   name: "kube",
		 *   description: "a wrapper around kubectl"
		 *   loadSpec: "kubectl"
		 * }
		 * ```
		 * @example
		 * In the `aws` completion spec, `loadSpec` is used to optimize performance. The completion spec is split into multiple files, each of which can be loaded separately.
		 * ```typescript
		 * {
		 *   name: "s3",
		 *   loadSpec: "aws/s3"
		 * }
		 * ```
		 */
		loadSpec?: LoadSpec;
		/**
		 * Dynamically *generate* a `Subcommand` object a runtime. The generated `Subcommand` is merged with the current subcommand.
		 *
		 * @remarks
		 * This API is often used by CLI tools where the structure of the CLI tool is not *static*. For instance, if the tool can be extended by plugins or otherwise shows different subcommands or options depending on the environment.
		 *
		 * @param tokens - a tokenized array of the text the user has typed in the shell.
		 * @param executeCommand - an async function that can execute a shell command on behalf of the user. The output is a string.
		 * @returns a `Fig.Spec` object
		 *
		 * @example
		 * The `python` spec uses `generateSpec` to include the`django-admin` spec if `django manage.py` exists.
		 * ```typescript
		 * generateSpec: async (tokens, executeCommand) => {
		 *    // Load the contents of manage.py
		 *    const managePyContents = await executeCommand("cat manage.py");
		 *    // Heuristic to determine if project uses django
		 *    if (managePyContents.contains("django")) {
		 *      return {
		 *        name: "python",
		 *        subcommands: [{ name: "manage.py", loadSpec: "django-admin" }],
		 *      };
		 *    }
		 *  },
		 * ```
		 */
		generateSpec?: (tokens: string[], executeCommand: ExecuteCommandFunction) => Promise<Spec | undefined>;

		/**
		 * Generating a spec can be expensive, but due to current guarantees they are not cached.
		 * This function generates a cache key which is used to cache the result of generateSpec.
		 * If `undefined` is returned, the cache will not be used.
		 */
		generateSpecCacheKey?: Function<{ tokens: string[] }, string | undefined> | string;

		/**
		 * Configure how the autocomplete engine will map the raw tokens to a given completion spec.
		 *
		 * @param flagsArePosixNoncompliant - Indicates that flags with one hyphen may have *more* than one character. Enabling this directive, turns off support for option chaining.
		 * @param optionsMustPrecedeArguments - Options will not be suggested after any argument of the Subcommand has been typed.
		 * @param optionArgSeparators - Indicate that options which take arguments will require one of the specified separators between the 'verbose' option name and the argument.
		 *
		 * @example
		 * The `-work` option from the `go` spec is parsed as a single flag when `parserDirectives.flagsArePosixNoncompliant` is set to true. Normally, this would be chained and parsed as `-w -o -r -k` if `flagsArePosixNoncompliant` is not set to true.
		 */
		parserDirectives?: {
			flagsArePosixNoncompliant?: boolean;
			optionsMustPrecedeArguments?: boolean;
			optionArgSeparators?: SingleOrArray<string>;
		};

		/**
		 * Specifies whether or not to cache the result of loadSpec and generateSpec
		 *
		 * @remarks
		 * Caching is good because it reduces the time to completion on subsequent calls to a dynamic subcommand, but when the data does not outlive the cache this allows a mechanism for opting out of it.
		 */
		cache?: boolean;
	}

	/**
	 * The option object represent CLI options (sometimes called flags).
	 *
	 * A option can have an argument. An option can NOT have subcommands or other option
	 */
	interface Option extends BaseSuggestion {
		/**
		 * The exact name of the subcommand as defined in the CLI tool.
		 *
		 * @remarks
		 * Fig's parser relies on your option name being exactly what the user would type. (e.g. if the user types `git "-m"`, you must have `name: "-m"` and not something like `name: "your message"` or even with an `=` sign like`name: "-m="`)
		 *
		 * If you want to customize what the text the popup says, use `displayName`.
		 *
		 * The name prop in an Option object compiles down to the name prop in a Suggestion object
		 *
		 * Final note: the name prop can be a string (most common) or an array of strings
		 *
		 *
		 * @example
		 * For `git commit -m` in the, message option nested beneath `commit` would have `name: ["-m", "--message"]`
		 * @example
		 * For `ls -l` the `-l` option would have `name: "-l"`
		 */
		name: SingleOrArray<string>;

		/**
		 * An array of arg objects or a single arg object
		 *
		 * @remarks
		 * If a subcommand takes an argument, please at least include an empty Arg Object. (e.g. `{ }`). Why? If you don't, Fig will assume the subcommand does not take an argument. When the user types their argument
		 * If the argument is optional, signal this by saying `isOptional: true`.
		 *
		 * @example
		 * `npm run` takes one mandatory argument. This can be represented by `args: { }`
		 * @example
		 * `git push` takes two optional arguments. This can be represented by: `args: [{ isOptional: true }, { isOptional: true }]`
		 * @example
		 * `git clone` takes one mandatory argument and one optional argument. This can be represented by: `args: [{ }, { isOptional: true }]`
		 */
		args?: SingleOrArray<Arg>;
		/**
		 *
		 * Signals whether an option is persistent, meaning that it will still be available
		 * as an option for all child subcommands.
		 *
		 * @remarks
		 * As of now there is no way to disable this
		 * persistence for certain children. Also see
		 * https://github.com/spf13/cobra/blob/master/user_guide.md#persistent-flags.
		 *
		 * @defaultValue false
		 *
		 * @example
		 * Say the `git` spec had an option at the top level with `{ name: "--help", isPersistent: true }`.
		 * Then the spec would recognize both `git --help` and `git commit --help`
		 * as a valid as we are passing the `--help` option to all `git` subcommands.
		 *
		 */
		isPersistent?: boolean;
		/**
		 * Signals whether an option is required.
		 *
		 * @defaultValue false (option is NOT required)
		 * @example
		 * The `-m` option of `git commit` is required
		 *
		 */
		isRequired?: boolean;
		/**
		 *
		 * Signals whether an equals sign is required to pass an argument to an option (e.g. `git commit --message="msg"`)
		 * @defaultValue false (does NOT require an equal)
		 *
		 * @example
		 * When `requiresEqual: true` the user MUST do `--opt=value` and cannot do `--opt value`
		 *
		 * @deprecated use `requiresSeparator` instead
		 *
		 */
		requiresEquals?: boolean;
		/**
		 *
		 * Signals whether one of the separators specified in parserDirectives is required to pass an argument to an option (e.g. `git commit --message[separator]"msg"`)
		 * If set to true this will automatically insert an equal after the option name.
		 * If set to a separator (string) this will automatically insert the separator specified after the option name.
		 * @defaultValue false (does NOT require a separator)
		 *
		 * @example
		 * When `requiresSeparator: true` the user MUST do `--opt=value` and cannot do `--opt value`
		 * @example
		 * When `requiresSeparator: ':'` the user MUST do `--opt:value` and cannot do `--opt value`
		 */
		requiresSeparator?: boolean | string;
		/**
		 *
		 * Signals whether an option can be passed multiple times.
		 *
		 * @defaultValue false (option is NOT repeatable)
		 *
		 * @remarks
		 * Passing `isRepeatable: true` will allow an option to be passed any number
		 * of times, while passing `isRepeatable: 2` will allow it to be passed
		 * twice, etc. Passing `isRepeatable: false` is the same as passing
		 * `isRepeatable: 1`.
		 *
		 * If you explicitly specify the isRepeatable option in a spec, this
		 * constraint will be enforced at the parser level, meaning after the option
		 * (say `-o`) has been passed the maximum number of times, Fig's parser will
		 * not recognize `-o` as an option if the user types it again.
		 *
		 * @example
		 * In `npm install` doesn't specify `isRepeatable` for `{ name: ["-D", "--save-dev"] }`.
		 * When the user types `npm install -D`, Fig will no longer suggest `-D`.
		 * If the user types `npm install -D -D`. Fig will still parse the second
		 * `-D` as an option.
		 *
		 * Suppose `npm install` explicitly specified `{ name: ["-D", "--save-dev"], isRepeatable: false }`.
		 * Now if the user types `npm install -D -D`, Fig will instead parse the second
		 * `-D` as the argument to the `install` subcommand instead of as an option.
		 *
		 * @example
		 * SSH has `{ name: "-v", isRepeatable: 3 }`. When the user types `ssh -vv`, Fig
		 * will still suggest `-v`, when the user types `ssh -vvv` Fig will stop
		 * suggesting `-v` as an option. Finally if the user types `ssh -vvvv` Fig's
		 * parser will recognize that this is not a valid string of chained options
		 * and will treat this as an argument to `ssh`.
		 *
		 */
		isRepeatable?: boolean | number;
		/**
		 *
		 * Signals whether an option is mutually exclusive with other options (ie if the user has this option, Fig should not show the options specified).
		 * @defaultValue false
		 *
		 * @remarks
		 * Options that are mutually exclusive with flags the user has already passed will not be shown in the suggestions list.
		 *
		 * @example
		 * You might see `[-a | --interactive | --patch]` in a man page. This means each of these options are mutually exclusive on each other.
		 * If we were defining the exclusive prop of the "-a" option, then we would have `exclusive: ["--interactive", "--patch"]`
		 *
		 */
		exclusiveOn?: string[];
		/**
		 *
		 *
		 * Signals whether an option depends on other options (ie if the user has this option, Fig should only show these options until they are all inserted).
		 *
		 * @defaultValue false
		 *
		 * @remarks
		 * If the user has an unmet dependency for a flag they've already typed, this dependency will have boosted priority in the suggestion list.
		 *
		 * @example
		 * In a tool like firebase, we may want to delete a specific extension. The command might be `firebase delete --project ABC --extension 123` This would mean we delete the 123 extension from the ABC project.
		 * In this case, `--extension` dependsOn `--project`
		 *
		 */
		dependsOn?: string[];
	}

	/**
	 * The arg object represent CLI arguments (sometimes called positional arguments).
	 *
	 * An argument is different to a subcommand object and option object. It does not compile down to a suggestion object. Rather, it represents custom user input. If you want to generate suggestions for this custom user input, you should use the generator prop nested beneath an Arg object
	 */
	interface Arg {
		/**
		 * The name of an argument. This is different to the `name` prop for subcommands, options, and suggestion objects so please read carefully.
		 * This `name` prop signals a normal, human readable string. It usually signals to the user the type of argument they are inserting if there are no available suggestions.
		 * Unlike subcommands and options, Fig does NOT use this value for parsing. Therefore, it can be whatever you want.
		 *
		 * @example
		 * The name prop for the `git commit -m <msg>` arg object is "msg". But you could also make it "message" or "your message". It is only used for description purposes (you see it when you type the message), not for parsing!
		 */
		name?: string;

		/**
		 * The text that gets rendered at the bottom of the autocomplete box a) when the user is inputting an argument and there are no suggestions and b) for all generated suggestions for an argument
		 * Keep it short and direct!
		 *
		 * @example
		 * "Your commit message"
		 */
		description?: string;

		/**
		 * Specifies whether the suggestions generated for this argument are "dangerous".
		 *
		 * @remarks
		 * If true, Fig will not enable its autoexecute functionality. Autoexecute means if a user selects a suggestion it will insert the text and run the command. We signal this by changing the icon to red.
		 * Turning on isDangerous will make it harder for a user to accidentally run a dangerous command.
		 *
		 * @defaultValue false
		 *
		 * @example
		 * This is used for all arguments in the `rm` spec.
		 */
		isDangerous?: boolean;

		/**
		 * A list of Suggestion objects that are shown when a user is typing an argument.
		 *
		 * @remarks
		 * These suggestions are static meaning you know them beforehand and they are not generated at runtime. If you want to generate suggestions at runtime, use a generator
		 *
		 * @example
		 * For `git reset <branch or commit>`, a two common arguments to pass are "head" and "head^". Therefore, the spec suggests both of these by using the suggestion prop
		 */
		suggestions?: (string | Suggestion)[];
		/**
		 * A template which is a single TemplateString or an array of TemplateStrings
		 *
		 * @remarks
		 * Templates are generators prebuilt by Fig. Here are the three templates:
		 * - filepaths: show folders and filepaths. Allow autoexecute on filepaths
		 * - folders: show folders only. Allow autoexecute on folders
		 * - history: show suggestions for all items in history matching this pattern
		 * - help: show subcommands. Only includes the 'siblings' of the nearest 'parent' subcommand
		 *
		 * @example
		 * `cd` uses the "folders" template
		 * @example
		 * `ls` used  ["filepaths", "folders"]. Why both? Because if I `ls` a directory, we want to enable a user to autoexecute on this directory. If we just did "filepaths" they couldn't autoexecute.
		 *
		 */
		template?: Template;
		/**
		 *
		 * Generators let you dynamically generate suggestions for arguments by running shell commands on a user's device.
		 *
		 * This takes a single generator or an array of generators
		 */
		generators?: SingleOrArray<Generator>;
		/**
		 * This option allows to enforce the suggestion filtering strategy for a specific argument suggestions.
		 * @remarks
		 * Users always want to have the most accurate results at the top of the suggestions list.
		 * For example we can enable fuzzy search on an argument that always requires fuzzy search to show the best suggestions.
		 * This property is also useful when argument suggestions have a prefix (e.g. the npm package scope) because enabling fuzzy search users can omit that part (see the second example below)
		 * @example
		 * npm uninstall [packages...] uses fuzzy search to allow searching for installed packages ignoring the package scope
		 * ```typescript
		 * const figSpec: Fig.Spec {
		 *   name: "npm",
		 *   subcommands: [
		 *     {
		 *       args: {
		 *         name: "packages",
		 *         filterStrategy: "fuzzy", // search in suggestions provided by the generator (in this case) using fuzzy search
		 *         generators: generateNpmDeps,
		 *         isVariadic: true,
		 *       },
		 *     },
		 *     // ... other npm commands
		 *   ],
		 * }
		 * ```
		 */
		filterStrategy?: "fuzzy" | "prefix" | "default";
		/**
		 * Provide a suggestion at the top of the list with the current token that is being typed by the user.
		 */
		suggestCurrentToken?: boolean;
		/**
		 * Specifies that the argument is variadic and therefore repeats infinitely.
		 *
		 * @remarks
		 * Man pages represent variadic arguments with an ellipsis e.g. `git add <pathspec...>`
		 *
		 * @example
		 * `echo` takes a variadic argument (`echo hello world ...`)
		 * @example
		 * `git add` also takes a variadic argument
		 */
		isVariadic?: boolean;

		/**
		 * Specifies whether options can interrupt variadic arguments. There is
		 * slightly different behavior when this is used on an option argument and
		 * on a subcommand argument:
		 *
		 * - When an option breaks a *variadic subcommand argument*, after the option
		 * and any arguments are parsed, the parser will continue parsing variadic
		 * arguments to the subcommand
		 * - When an option breaks a *variadic option argument*, after the breaking
		 * option and any arguments are parsed, the original variadic options
		 * arguments will be terminated. See the second examples below for details.
		 *
		 *
		 * @defaultValue true
		 *
		 * @example
		 * When true for git add's argument:
		 * `git add file1 -v file2` will interpret `-v` as an option NOT an
		 * argument, and will continue interpreting file2 as a variadic argument to
		 * add after
		 *
		 * @example
		 * When true for -T's argument, where -T is a variadic list of tags:
		 * `cmd -T tag1 tag2 -p project tag3` will interpret `-p` as an option, but
		 * will then terminate the list of tags. So tag3 is not parsed as an
		 * argument to `-T`, but rather as a subcommand argument to `cmd` if `cmd`
		 * takes any arguments.
		 *
		 * @example
		 * When false:
		 * `echo hello -n world` will treat -n as an argument NOT an option.
		 * However, in `echo -n hello world` it will treat -n as an option as
		 * variadic arguments haven't started yet
		 *
		 */
		optionsCanBreakVariadicArg?: boolean;

		/**
		 * `true` if an argument is optional (ie the CLI spec says it is not mandatory to include an argument, but you can if you want to).
		 *
		 * @remarks
		 * NOTE: It is important you include this for our parsing. If you don't, Fig will assume the argument is mandatory. When we assume an argument is mandatory, we force the user to input the argument and hide all other suggestions.
		 *
		 * @example
		 * `git push [remote] [branch]` takes two optional args.
		 */
		isOptional?: boolean;
		/**
		 * Syntactic sugar over the `loadSpec` prop.
		 *
		 * @remarks
		 * Specifies that the argument is an entirely new command which Fig should start completing on from scratch.
		 *
		 * @example
		 * `time` and `builtin` have only one argument and this argument has the `isCommand` property. If I type `time git`, Fig will load up the git completion spec because the isCommand property is set.
		 */
		isCommand?: boolean;
		/**
		 * The same as the `isCommand` prop, except Fig will look for a completion spec in the `.fig/autocomplete/build` folder in the user's current working directory.
		 *
		 * @remarks
		 * See our docs for more on building completion specs for local scripts [Fig for Teams](https://fig.io/docs/)
		 * @example
		 * `python` take one argument which is a `.py` file. If I have a `main.py` file on my desktop and my current working directory is my desktop, if I type `python main.py[space]` Fig will look for a completion spec in `~/Desktop/.fig/autocomplete/build/main.py.js`
		 */
		isScript?: boolean;
		/**
		 * The same as the `isCommand` prop, except you specify a string to prepend to what the user inputs and fig will load the completion spec accordingly.
		 * @remarks
		 * If isModule: "python/", Fig would load up the `python/USER_INPUT.js` completion spec from the `~/.fig/autocomplete` folder.
		 * @example
		 * For `python -m`, the user can input a specific module such as http.server. Each module is effectively a mini CLI tool that should have its own completions. Therefore the argument object for -m has `isModule: "python/"`. Whatever the modules user inputs, Fig will look under the `~/.fig/autocomplete/python/` directory for completion spec.
		 *
		 * @deprecated use `loadSpec` instead
		 */
		isModule?: string;

		/**
		 * This will debounce every keystroke event for this particular arg.
		 * @remarks
		 * If there are no keystroke events after 100ms, Fig will execute all the generators in this arg and return the suggestions.
		 *
		 * @example
		 * `npm install` and `pip install` send debounced network requests after inactive typing from users.
		 */
		debounce?: boolean;
		/**
		 * The default value for an optional argument.
		 *
		 * @remarks
		 * Note: This is currently not used anywhere in Fig's autocomplete popup, but will be soon.
		 *
		 */
		default?: string;
		/**
		 * See [`loadSpec` in Subcommand Object](https://fig.io/docs/reference/subcommand#loadspec).
		 *
		 * @remarks
		 * There is a very high chance you want to use one of the following:
		 * 1. `isCommand` (See [Arg Object](https://fig.io/docs/reference/arg#iscommand))
		 * 2. `isScript` (See [Arg Object](https://fig.io/docs/reference/arg#isscript))
		 *
		 */
		loadSpec?: LoadSpec;

		/**
		 * The `arg.parserDirective.alias` prop defines whether Fig's tokenizer should expand out an alias into separate tokens then offer completions accordingly.
		 *
		 * @remarks
		 * This is similar to how Fig is able to offer autocomplete for user defined shell aliases, but occurs at the completion spec level.
		 *
		 * @param token - The token that the user has just typed that is an alias for something else
		 * @param executeCommand -an async function that allows you to execute a shell command on the user's system and get the output as a string.
		 * @returns The expansion of the alias that Fig's bash parser will reparse as if it were typed out in full, rather than the alias.
		 *
		 * If for some reason you know exactly what it will be, you may also just pass in the expanded alias, not a function that returns the expanded alias.
		 *
		 * @example
		 * git takes git aliases. These aliases are defined in a user's gitconfig file. Let's say a user has an alias for `p=push`, then if a user typed `git p[space]`, this function would take the `p` token, return `push` and then offer suggestions as if the user had typed `git push[space]`
		 *
		 * @example
		 * `npm run <script>` also takes an arg called "script". This arg is technically an alias for another shell command that is specified in the package.json.
		 * If the user typed `npm run start[space]`, the package.json had script `start=node index.js`, then Fig would start offering suggestions for as if you had just typed `node index.js[space]`
		 *
		 * Note: In both cases, the alias function is only used to expand a given alias NOT to generate the list of aliases. To generate a list of aliases, scripts etc, use a generator.
		 */
		parserDirectives?: {
			alias?: string | ((token: string, exec: ExecuteCommandFunction) => Promise<string>);
		};
	}

	/**
	 * The generator object is used to generate suggestions for an arg object. To do this, it runs a defined shell command on the user's device, gets the output, and returns a list of Suggestion objects.
	 *
	 */
	interface Generator {
		/**
		 * A template which is a single `TemplateString` or an array of `TemplateStrings`.
		 *
		 * @remarks
		 * Templates are generators prebuilt by Fig. Here are the three templates:
		 * - filepaths: show folders and filepaths. Allow autoexecute on filepaths
		 * - folders: show folders only. Allow autoexecute on folders
		 * - history: show suggestions for all items in history matching this pattern
		 * - help: show subcommands. Only includes the 'siblings' of the nearest 'parent' subcommand
		 *
		 * @example
		 * `cd` uses the "folders" template
		 * @example
		 * `ls` uses  ["filepaths", "folders"]. Why both? Because if I `ls` a directory, we want to enable a user to autoexecute on this directory. If we just did "filepaths" they couldn't autoexecute.
		 *
		 */
		template?: Template;
		/**
		 *
		 * A function to filter and modify suggestions returned by a template
		 *
		 * @param templateSuggestions - the array of suggestion objects returned by the given template.
		 * @returns An array of `Suggestion` objects.
		 *
		 * @example
		 * The python spec has an arg object which has a template for "filepaths". However, we don't want to suggest non `.py` files. Therefore, we take the output of the template, filter out all files that don't end in `.py`, keep all folders that end with `/` and return the list of suggestions.
		 */
		filterTemplateSuggestions?: Function<TemplateSuggestion[], Suggestion[]>;
		/**
		 *
		 * The command you wish to run on the user's device at their shell session's current working directory.
		 *
		 * @remarks
		 * You can either specify
		 * 1. a command and args to be executed (like `["ls"]` or `["git", "branch"]`)
		 * 2. a function to generate the command and args to be executed. The function takes in an array of tokens of the user input and should output a array of string (command and args). You use a function when the script you run is dependent upon one of the tokens the user has already input (for instance an app name, a Kubernetes token etc.)
		 * After executing the script, the stdout output will be passed to one of `splitOn` or `postProcess` for further processing to produce suggestion objects.
		 *
		 * @example
		 * `git checkout <branch>` takes one argument which is a git branch. Its arg object has a generator with a `script: ["git", "branch"]"`. The stdout output of this shell command is then passed into the postProcess function to generate the final suggestions.
		 */
		script?:
		| string[]
		| Function<string[], string[] | undefined> // <-- VS Code edit to make results correct
		| ExecuteCommandInput
		| Function<string[], ExecuteCommandInput>;
		/**
		 * Set the execution timeout of the command specified in the `script` prop.
		 * @defaultValue 5000
		 */
		scriptTimeout?: number;
		/**
		 *
		 * Process the string output from the `script` prop and return a list of suggestions
		 *
		 * @param out - The output of the script that was executed on the user's device
		 * @param tokens - a tokenized array of what the user has typed
		 * @returns An array of `Suggestion` objects.
		 *
		 */
		postProcess?: (out: string, tokens: string[]) => (Suggestion | null)[] | undefined; // <-- VS Code edit to make results correct
		/**
		 * Syntactic sugar for `postProcess` function
		 *
		 * @remarks
		 * This takes in the text output of `script`, splits it on the string you provide here, and then automatically generates an array of suggestion objects for each item.
		 *
		 * @example
		 * Specify `\n` and Fig will split on new lines, and turn each line into a suggestion object with `name` prop equal to the value on the line.
		 */
		splitOn?: string;
		/**
		 *
		 * A function run on every keystroke that determines whether Fig should invalidate its cached list of suggestions and instead regenerate its list of suggestions.
		 *
		 * @remarks
		 * A note on how Fig works: Suggestions vs Filtered Suggestions
		 * Suggestions: Whenever you type a space indicating the start of a new token, Fig will regenerate a new list of suggestions e.g. `git[space]` will generate a list of suggestions for every subcommand, option, and arg
		 * Filtered Suggestions: When you type within the same token (e.g. `git c` -> `git ch`), Fig takes the token you are currently typing in and uses it to filter over the list of suggestions you have cached. e.g. `git c`. The list of suggestions is the same as before, but the filtered suggestions are now `commit`, `clean`, `clone`, and `checkout`.
		 *
		 * **Why don't we recalculate suggestions on each keystroke?**
		 * 1. It's expensive
		 * 2. We don't need to. The caching works nicely
		 *
		 * **So what does the trigger do?**
		 * The trigger function is run on every keystroke and tells us whether or not we should invalidate the cache and regenerate a list of suggestions.
		 * The trigger function is almost always used with a `custom` generator and the `getQueryTerm` function to make the autocomplete experience really good (it's how suggestions for `cd` work)
		 * It is especially beneficial when you want to generate suggestions for an argument contained inside a single string that is not separated by a space.
		 *
		 * **What is important to remember?**
		 * This function looks at the CHANGE in a token, not the current state of the token. If my token goes from `desktop` to `desktop/`, should I regenerate suggestions? Remember, users can paste text so theoretically any change is possible. It is totally valid for oldToken to be an empty string and newToken to be a 50 character string!
		 *
		 *
		 * @param newToken - The new token that was just typed by the user e.g. "desktop/""
		 * @param oldToken - The old token that was there before e.g. "desktop"
		 * @returns A boolean of whether or not we should regenerate suggestions
		 *
		 * @defaultValue
		 * `false`
		 * It means that the function returns false ie we do not regenerate suggestion on each keystroke and instead, keep our cached list of suggestions while the user is editing the current token.
		 *
		 * @example
		 * `chmod`: If I type `chmod u` we should generate suggestions for `u+x`, `u+r`, `u-w` etc. Whereas if I typed `chmod 7` we should generate suggestions for `755` or `777` etc.
		 * The suggestion we generate depends on the new information we have. The oldToken was an empty string, the new token could be a `7` or a `u` etc...
		 *
		 *   All this function's job is to say whether or not we should generate new suggestions. It does not specify how to create these new suggestions. This is the job of the `script` or `custom` props. Annoyingly, you may have to implement some of the same parsing logic again. However, because this is javascript, just create a function so you don't have to repeat yourself :)
		 *
		 *   Note: yes, we could have generate a list of suggestions at the start for every single permutation of 777 or u+x etc, however, there are so many and this is just not performant!
		 *
		 * @example
		 * `cd`: Let's say a user has "cd desktop" currently typed then the user types a "/" so the changes to "cd ~/desktop/".
		 * The old token is "~/desktop", new token is "desktop/". This is a perfect time for us to generate a new list of suggestions. We previously had all the folders in my ~ directory as suggestions, but after the total number of `/` in the tokens changed, we should trigger a new set of suggestions to be generated. This new set of suggestions should then generate suggestions for the desktop directory, not the ~ directory.
		 */
		trigger?: Trigger;
		/**
		 * A function that takes the token that the user has typed and determines which part of it should be used to filter over all the suggestions.
		 *
		 * @param token - The full token the user is currently typing
		 * @returns The query term that Fig will use to filter over suggestions
		 *
		 * @remarks
		 * Read the note above on how triggers work. Triggers and query term may seem similar but are actually different.
		 *
		 * The `trigger` function defines when to regenerate new suggestions.
		 * The `query` term defines what characters we should use to filter over these suggestions.
		 * The `getQueryTerm` function defines the queryTerm
		 *
		 * @example
		 * `cd` has a `getQueryTerm` function that takes the token the user has typed and returns everything after the last "/".
		 * if the user types cd `~/desktop/a`, the list of suggestions will be all the folders on the user's desktop. We want to filter over these folders with the query term `"a"` not `~/desktop/a`
		 *
		 */
		getQueryTerm?: StringOrFunction<string, string>;
		/**
		 * An async function that is similar to the function version of `script`, however, it gives you full control.
		 *
		 * @remarks
		 * This function is effectively `script` and `postProcess` combined. It is very useful in combination with `trigger` and `getQueryTerm` to generate suggestions as the user is typing inside a token. Read the description of `trigger` for more.
		 *
		 * @param tokens - a tokenized array of what the user has typed
		 * @param executeCommand - an async function that allows you to execute a shell command on the user's system and get the output as a string.
		 * @param shellContext - an object containing a user's currentWorkingDirectory, currentProcess, and if relevant, the sshPrefix string that can be used if the user is in an SSH session.
		 *
		 * @returns An array of suggestion objects
		 *
		 * @example
		 * In `cd` the custom function will combine the current working directory with everything up to the last `"/"` in the last token. It will then run `ls` at this path and generate a list of suggestions accordingly.
		 * e.g. if the user was currently in their home directory and typed "cd desktop/abcdef", then the custom function would return a list of directories at the `~/desktop` directory
		 * if the user was currently in their home directory and typed "cd desktop/my_folder/second_folder/aaaaa", then the custom function would return a list of directories at the `~/desktop/my_folder/second_folder` directory
		 * if the user was currently in their home directory and typed "cd /usr/bin/", then the custom function would return a list of directories at the `/usr/bin/` directory
		 *
		 * @example
		 * ```ts
		 * const generator: Fig.Generator = {
		 *   custom: async (tokens, executeCommand) => {
		 *     const out = await executeCommand("ls");
		 *     return out.split("\n").map((elm) => ({ name: elm }));
		 *   },
		 * };
		 * ```
		 */
		custom?: (
			tokens: string[],
			executeCommand: ExecuteCommandFunction,
			generatorContext: GeneratorContext
		) => Promise<(Suggestion | null)[] | undefined>; // <-- VS Code edit to make results correct
		/**
		 *
		 * Cache the response of generators for a specific period time and optionally by directory the commands were executed in.
		 *
		 * @remarks
		 * For commands that take a long time to run, Fig gives you the option to cache their response. You can cache the response globally or just by the directory they were run in.
		 * We currently have two cache strategies:
		 * - `stale-while-revalidate` (default): when cache becomes stale fig will return the stale data while fetching the updated one. This strategy accepts a `ttl` (time to live) to configure how long it takes for the cache to become stale.
		 * - `max-age`: will show a loading indicator when cache is stale. You need to specify a `ttl` for how long it takes for the cache to become stale.
		 * You can also optionally turn on the ability to just cache by directory (`cacheByDirectory: true`)
		 *
		 * @example
		 * The kubernetes spec makes use of this.
		 *
		 */
		cache?: Cache;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/npx.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/npx.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const completionSpec: Fig.Spec = {
	name: 'npx',
	description: 'Execute binaries from npm packages',
	args: {
		name: 'command',
		isCommand: true,
		generators: {
			script: [
				'bash',
				'-c',
				'until [[ -d node_modules/ ]] || [[ $PWD = \'/\' ]]; do cd ..; done; ls -1 node_modules/.bin/',
			],
			postProcess: function (out) {
				return out
					.split('\n')
					.map((name) => ({
						name,
						icon: 'fig://icon?type=command',
						loadSpec: name,
					}));
			},
		},
		isOptional: true,
	},

	options: [
		{
			name: ['--package', '-p'],
			description: 'Package to be installed',
			args: {
				name: 'package',
			},
		},
		{
			name: '--cache',
			args: {
				name: 'path',
				template: 'filepaths',
			},
			description: 'Location of the npm cache',
		},
		{
			name: '--always-spawn',
			description: 'Always spawn a child process to execute the command',
		},
		{
			name: '-y',
			description: 'Execute npx command without prompting for confirmation',
		},
		{
			description: 'Skip installation if a package is missing',
			name: '--no-install',
		},
		{
			args: {
				name: 'path',
				template: 'filepaths',
			},
			description: 'Path to user npmrc',
			name: '--userconfig',
		},
		{
			name: ['--call', '-c'],
			args: {
				name: 'script',
			},
			description: 'Execute string as if inside `npm run-script`',
		},
		{
			name: ['--shell', '-s'],
			description: 'Shell to execute the command with, if any',
			args: {
				name: 'shell',
				suggestions: [
					{
						name: 'bash',
					},
					{
						name: 'fish',
					},
					{
						name: 'zsh',
					},
				],
			},
		},
		{
			args: {
				name: 'shell-fallback',
				suggestions: [
					{
						name: 'bash',
					},
					{
						name: 'fish',
					},
					{
						name: 'zsh',
					},
				],
			},
			name: '--shell-auto-fallback',
			description:
				'Generate shell code to use npx as the "command not found" fallback',
		},
		{
			name: '--ignore-existing',
			description:
				'Ignores existing binaries in $PATH, or in the localproject. This forces npx to do a temporary install and use the latest version',
		},
		{
			name: ['--quiet', '-q'],
			description:
				'Suppress output from npx itself. Subcommands will not be affected',
		},
		{
			name: '--npm',
			args: {
				name: 'path to binary',
				template: 'filepaths',
			},
			description: 'Npm binary to use for internal operations',
		},
		{
			args: {},
			description: 'Extra node argument when calling a node binary',
			name: ['--node-arg', '-n'],
		},
		{
			description: 'Show version number',
			name: ['--version', '-v'],
		},
		{
			description: 'Show help',
			name: ['--help', '-h'],
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/set-location.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/set-location.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const cdSpec: Fig.Spec = {
	name: 'Set-Location',
	description: 'Change the shell working directory',
	args: {
		name: 'folder',
		template: 'folders',
		suggestions: [
			{
				name: '-',
				description: 'Go to previous directory in history stack',
				hidden: true,
			},
			{
				name: '+',
				description: 'Go to next directory in history stack',
				hidden: true,
			},
		],
	}
};

export default cdSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/adb.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/adb.ts

```typescript
const installOptions: Fig.Option[] = [
	{
		name: "-l",
		description: "Forward-lock the app",
	},
	{
		name: "-r",
		description: "Replace existing application",
	},
	{
		name: "-t",
		description: "Allow test packages",
	},
	{
		name: "-d",
		description: "Allow version code downgrade (debuggable packages only)",
	},
	{
		name: "-s",
		description: "Install on SD card instead of internal storage",
	},
	{
		name: "-g",
		description: "Grant all runtime permissions",
	},
	{
		description: "Override platform's default ABI",
		name: "--abi",
		args: {
			name: "ABI",
		},
	},
	{
		description: "Cause the app to be installed as an ephemeral install app",
		name: "--instant",
	},
	{
		description:
			"Always push APK to device and invoke Package Manager as separate steps",
		name: "--no-streaming",
	},
	{
		description: "Force streaming APK directly into Package Manager",
		name: "--streaming",
	},
	{
		description: "Use fast deploy",
		name: "--fastdeploy",
	},
	{
		description: "Prevent use of fast deploy",
		name: "--no-fastdeploy",
	},
	{
		description: "Force update of deployment agent when using fast deploy",
		name: "--force-agent",
	},
	{
		description:
			"Update deployment agent when local version is newer and using fast deploy",
		name: "--date-check-agent",
	},
	{
		description:
			"Update deployment agent when local version has different version code and using fast deploy",
		name: "--version-check-agent",
	},
	{
		description:
			"Locate agent files from local source build (instead of SDK location)",
		name: "--local-agent",
	},
];

const compressionOptions: Fig.Option[] = [
	{
		description:
			"Enable compression with a specified algorithm (any, none, brotli)",
		name: "-z",
		args: {
			name: "ALGORITHM",
			suggestions: [
				{
					name: "any",
				},
				{
					name: "none",
				},
				{
					name: "brotli",
				},
			],
		},
	},
	{
		description: "Disable compression",
		name: "-Z",
	},
];

const forwardConnectionSuggestions: Fig.Suggestion[] = [
	{
		name: "tcp",
		insertValue: "tcp:",
	},
	{
		name: "localabstract",
		insertValue: "localabstract:",
	},
	{
		name: "localreserved",
		insertValue: "localreserved:",
	},
	{
		name: "localfilesystem",
		insertValue: "localfilesystem:",
	},
	{
		name: "dev",
		insertValue: "dev:",
	},
	{
		name: "jdwp",
		insertValue: "jdwp:",
	},
	{
		name: "acceptfd",
		insertValue: "acceptfd:",
	},
];

const reverseConnectionSuggestions: Fig.Suggestion[] = [
	{
		name: "tcp",
		insertValue: "tcp:",
	},
	{
		name: "localabstract",
		insertValue: "localabstract:",
	},
	{
		name: "localreserved",
		insertValue: "localreserved:",
	},
	{
		name: "localfilesystem",
		insertValue: "localfilesystem:",
	},
];

const completionSpec: Fig.Spec = {
	name: "adb",
	description: "Android Debug Bridge",
	subcommands: [
		{
			name: "devices",
			description: "List connected devices",
			options: [
				{
					name: "-l",
					description: "Long output",
				},
			],
		},
		{
			name: "help",
			description: "Show this help message",
		},
		{
			name: "get-state",
			description: "Print offline | bootloader | device",
		},
		{
			name: "get-serialno",
			description: "Print <serial-number>",
		},
		{
			name: "get-devpath",
			description: "Print <device-path>",
		},
		{
			name: "remount",
			options: [
				{
					name: "-R",
					description: "Reboot device",
				},
			],
			description:
				"Remount partitions read-write. if a reboot is required, -R will automatically reboot the device",
		},
		{
			name: "jdwp",
			description: "List pids of processes hosting a JDWP transport",
		},
		{
			name: "root",
			description: "Restart adbd with root permissions",
		},
		{
			name: "unroot",
			description: "Restart adbd without root permissions",
		},
		{
			name: "usb",
			description: "Restart adbd listening on USB",
		},
		{
			name: "sideload",
			description: "Sideload the given full OTA package",
			args: {
				name: "OTAPACKAGE",
			},
		},
		{
			description: "Ensure that there is a server running",
			name: "start-server",
		},
		{
			description: "Kill the server if it is running",
			name: "kill-server",
		},
		{
			description: "Kick connection from host side to force reconnect",
			name: "reconnect",
			subcommands: [
				{
					description: "Kick connection from device side to force reconnect",
					name: "device",
				},
				{
					description: "Reset offline/unauthorized devices to force reconnect`",
					name: "offline",
				},
			],
		},
		{
			name: "tcpip",
			description: "Restart adbd listening on TCP on PORT",
			args: {
				name: "PORT",
			},
		},
		{
			name: "reboot",
			args: {
				isOptional: true,
				name: "type",
				suggestions: [
					{
						name: "bootloader",
					},
					{
						name: "recovery",
					},
					{
						name: "sideload",
					},
					{
						name: "sideload-auto-reboot",
					},
				],
			},
			description:
				"Reboot the device; defaults to booting system image but supports bootloader and recovery too. sideload reboots into recovery and automatically starts sideload mode, sideload-auto-reboot is the same but reboots after sideloading",
		},
		{
			name: "disable-verity",
			description: "Disable dm-verity checking on userdebug builds",
		},
		{
			name: "enable-verity",
			description: "Re-enable dm-verity checking on userdebug builds",
		},
		{
			name: "wait-for-device",
			description: "Wait for state=device",
		},
		{
			name: "wait-for-recovery",
			description: "Wait for state=recovery",
		},
		{
			name: "wait-for-rescue",
			description: "Wait for state=rescue",
		},
		{
			name: "wait-for-sideload",
			description: "Wait for state=sideload",
		},
		{
			name: "wait-for-bootloader",
			description: "Wait for state=bootloader",
		},
		{
			name: "wait-for-disconnect",
			description: "Wait for state=disconnect",
		},
		{
			name: "wait-for-usb-device",
			description: "Wait for usb in state=device",
		},
		{
			name: "wait-for-usb-recovery",
			description: "Wait for usb in state=recovery",
		},
		{
			name: "wait-for-usb-rescue",
			description: "Wait for usb in state=rescue",
		},
		{
			name: "wait-for-usb-sideload",
			description: "Wait for usb in state=sideload",
		},
		{
			name: "wait-for-usb-bootloader",
			description: "Wait for usb in state=bootloader",
		},
		{
			name: "wait-for-usb-disconnect",
			description: "Wait for usb in state=disconnect",
		},
		{
			name: "wait-for-local-device",
			description: "Wait for local in state=device",
		},
		{
			name: "wait-for-local-recovery",
			description: "Wait for local in state=recovery",
		},
		{
			name: "wait-for-local-rescue",
			description: "Wait for local in state=rescue",
		},
		{
			name: "wait-for-local-sideload",
			description: "Wait for local in state=sideload",
		},
		{
			name: "wait-for-local-bootloader",
			description: "Wait for local in state=bootloader",
		},
		{
			name: "wait-for-local-disconnect",
			description: "Wait for local in state=disconnect",
		},
		{
			name: "wait-for-any-device",
			description: "Wait for any in state=device",
		},
		{
			name: "wait-for-any-recovery",
			description: "Wait for any in state=recovery",
		},
		{
			name: "wait-for-any-rescue",
			description: "Wait for any in state=rescue",
		},
		{
			name: "wait-for-any-sideload",
			description: "Wait for any in state=sideload",
		},
		{
			name: "wait-for-any-bootloader",
			description: "Wait for any in state=bootloader",
		},
		{
			name: "wait-for-any-disconnect",
			description: "Wait for any in state=disconnect",
		},
		{
			name: "keygen",
			description:
				"Generate adb public/private key; private key stored in FILE",
			args: {
				name: "FILE",
				template: "filepaths",
			},
		},
		{
			name: "logcat",
			description: "Show device log (logcat --help for more)",
		},
		{
			name: "version",
			description: "Show version num",
		},
		{
			name: "connect",
			description: "Connect to a device via TCP/IP [default port=5555]",
			args: {
				name: "HOST[:PORT]",
			},
		},
		{
			name: "disconnect",
			description:
				"Disconnect from given TCP/IP device [default port=5555], or all",
			args: {
				name: "HOST[:PORT]",
				isOptional: true,
			},
		},
		{
			name: "uninstall",
			description: "Remove this app package from the device",
			options: [
				{
					name: "-k",
					description: "Keep the data and cache directories",
				},
			],
		},
		{
			name: "bugreport",
			description: "Write bugreport to given PATH [default=bugreport.zip];",
			args: {
				name: "PATH",
				isOptional: true,
			},
		},
		{
			name: "pair",
			description: "Pair with a device for secure TCP/IP communication",
			args: [
				{
					name: "HOST[:PORT]",
				},
				{
					name: "[PAIRING CODE]",
					isOptional: true,
				},
			],
		},
		{
			name: "ppp",
			description: "Run PPP over USB",
			args: [
				{
					name: "TTY",
				},
				{
					name: "[PARAMETER...]",
					isVariadic: true,
					isOptional: true,
				},
			],
		},
		{
			name: "emu",
			description: "Run emulator console command",
			args: {
				name: "COMMAND",
			},
		},
		{
			name: "install",
			description: "Push a single package to the device and install it",
			args: {
				name: "PACKAGE",
				template: "filepaths",
			},
			options: installOptions,
		},
		{
			name: "install-multiple",
			description:
				"Push multiple APKs to the device for a single package and install them",
			args: {
				name: "PACKAGE",
				template: "filepaths",
				isVariadic: true,
			},
			options: [
				{
					name: "-p",
					description: "Partial application install (install-multiple only)",
				},
				...installOptions,
			],
		},
		{
			name: "install-multi-package",
			description:
				"Push one or more packages to the device and install them atomically",
			args: {
				name: "PACKAGE",
				template: "filepaths",
				isVariadic: true,
			},
			options: [
				{
					name: "-p",
					description: "Partial application install (install-multiple only)",
				},
				...installOptions,
			],
		},
		{
			name: "shell",
			description:
				"Run remote shell command (interactive shell if no command given)",
			options: [
				{
					name: "-e",
					description: "Choose escape character, or `none` default '~'",
				},
				{
					name: "-n",
					description: "Don't read from stdin",
				},
				{
					name: "-T",
					description: "Disable pty allocation",
				},
				{
					name: "-t",
					description: "Allocate a pty if on a tty",
				},
				{
					name: "-tt",
					description: "-tt: force pty allocation",
				},
				{
					name: "-x",
					description: "Disable remote exit codes and stdout/stderr separation",
				},
			],
			args: {
				isOptional: true,
				name: "COMMANDS ...",
				isVariadic: true,
			},
		},
		{
			name: "mdns",
			description: "Mdns utils",
			subcommands: [
				{
					name: "check",
					description: "Check if mdns discovery is available",
				},
				{
					name: "services",
					description: "List all discovered services",
				},
			],
		},
		{
			name: "push",
			description: "Copy local files/directories to device",
			options: [
				{
					description:
						"Only push files that are newer on the host than the device",
					name: "--sync",
				},
				{
					description:
						"Dry run: push files to device without storing to the filesystem",
					name: "-n",
				},
				...compressionOptions,
			],
			args: [
				{
					name: "LOCAL",
					isVariadic: true,
					template: "filepaths",
				},
				{
					name: "REMOTE",
				},
			],
		},
		{
			name: "sync",
			description:
				"Sync a local build from $ANDROID_PRODUCT_OUT to the device (default all)",
			options: [
				{
					description:
						"Dry run: push files to device without storing to the filesystem",
					name: "-n",
				},
				{
					description: "List files that would be copied, but don't copy them",
					name: "-l",
				},
				...compressionOptions,
			],
			args: {
				isOptional: true,
				suggestions: [
					{
						name: "all",
					},
					{
						name: "data",
					},
					{
						name: "odm",
					},
					{
						name: "oem",
					},
					{
						name: "product",
					},
					{
						name: "system",
					},
					{
						name: "system_ext",
					},
					{
						name: "vendor",
					},
				],
			},
		},
		{
			name: "pull",
			description: "Copy files/dirs from device",
			options: [
				{
					description: "Preserve file timestamp and mode",
					name: "-a",
				},
				...compressionOptions,
			],
			args: [
				{
					name: "REMOTE",
					isVariadic: true,
					template: "filepaths",
				},
				{
					name: "LOCAL",
				},
			],
		},
		{
			name: "forward",
			description: "Forward connection",
			options: [
				{
					name: "--list",
					description: "List all forward socket connections",
				},
				{
					name: "--remove",
					description: "Remove specific forward socket connection",
					args: {
						name: "LOCAL",
					},
				},
				{
					name: "--remove-all",
					description: "Remove all forward socket connections",
				},
				{
					name: "--no-rebind",
					description:
						"Reversal fails if the specified socket is already bound through a previous reverse command",
				},
			],
			args: [
				{
					name: "LOCAL -> port|domain|device|pid",
					suggestions: forwardConnectionSuggestions,
				},
				{
					name: "REMOTE -> port|domain|device|pid",
					suggestions: forwardConnectionSuggestions,
				},
			],
		},
		{
			name: "reverse",
			description: "Reverse connection",
			options: [
				{
					name: "--list",
					description: "List all reverse socket connections from device",
				},
				{
					name: "--remove",
					description: "Remove specific reverse socket connection",
					args: {
						name: "REMOTE",
					},
				},
				{
					name: "--remove-all",
					description: "Remove all reverse socket connections from device",
				},
				{
					name: "--no-rebind",
					description:
						"Reversal fails if the specified socket is already bound through a previous reverse command",
				},
			],
			args: [
				{
					name: "REMOTE -> port|domain|device|pid",
					suggestions: reverseConnectionSuggestions,
				},
				{
					name: "LOCAL -> port|domain|device|pid",
					suggestions: reverseConnectionSuggestions,
				},
			],
		},
	],
	options: [
		{
			description: "Listen on all network interfaces, not just localhost",
			name: "-a",
		},
		{
			description: "Use USB device (error if multiple devices connected)",
			name: "-d",
		},
		{
			description:
				"Use TCP/IP device (error if multiple TCP/IP devices available)",
			name: "-e",
		},
		{
			description: "Use device with given serial (overrides $ANDROID_SERIAL)",
			name: "-s",
			args: {
				name: "SERIAL",
			},
		},
		{
			description: "Use device with given transport id",
			name: "-t",
			args: {
				name: "ID",
			},
		},
		{
			description: "Name of adb server host [default=localhost]",
			name: "-H",
			args: {
				name: "host name",
			},
		},
		{
			description: "Port of adb server [default=5037]",
			name: "-P",
			args: {
				name: "port",
			},
		},
		{
			description:
				"Listen on given socket for adb server [default=tcp:localhost:5037]",
			name: "-L",
			args: {
				name: "socket",
			},
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/apt.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/apt.ts

```typescript
import { filepaths } from '../../helpers/filepaths';

const packages: Fig.Generator = {
	// only trigger when the token length transitions to or from 0
	trigger: (current, previous) =>
		current.length === 0 || (previous.length === 0 && current.length > 0),

	// have to use `custom` to skip running the script when length is 0
	custom: async (tokens, executeShellCommand) => {
		const finalToken = tokens[tokens.length - 1];
		if (finalToken.length === 0) {
			return [];
		}
		const { stdout } = await executeShellCommand({
			command: "apt",
			// eslint-disable-next-line @withfig/fig-linter/no-useless-arrays
			args: ["list"],
		});

		// Only lines matching the first character, delete characters after '/'
		return stdout
			.trim()
			.split("\n")
			.filter((name) => name.startsWith(finalToken))
			.map((name) => name.replace(/\/.*/, ""))
			.map((name) => ({
				name,
				description: "Package",
				icon: "📦",
				// make the suggestions... actually show up
				// see https://github.com/withfig/autocomplete/pull/1429#discussion_r950688126
				priority: 50,
			}));
	},
};

const installedPackages: Fig.Generator = {
	script: ["apt", "list", "--installed"],
	postProcess: function (a) {
		return a
			.trim()
			.split("\n")
			.map((b) => {
				return {
					name: b.substring(0, b.indexOf("/")),
					description: "Package",
					icon: "📦",
				};
			});
	},
};

const upgradablePackages: Fig.Generator = {
	script: ["apt", "list", "--upgradable"],
	postProcess: function (a) {
		return a
			.trim()
			.split("\n")
			.map((b) => {
				return {
					name: b.substring(0, b.indexOf("/")),
					description: "Package",
					icon: "📦",
				};
			});
	},
};

const yesNoOptions: Fig.Option[] = [
	{
		name: "-y",
		description: "Assume yes to all prompts",
		exclusiveOn: ["--assume-no"],
	},
	{
		name: "--assume-no",
		description: "Assume no to all prompts",
		exclusiveOn: ["-y"],
	},
];

const installationOptions: Fig.Option[] = [
	{
		name: ["-d", "--download-only"],
		description:
			"For any operation that would download packages, download them, but do nothing else",
	},
	{
		name: "--no-download",
		description:
			"Do not download packages, attempt to use already downloaded packages",
	},
];

const simulate: Fig.Option[] = [
	{
		name: ["-s", "--simulate"],
		description:
			"Simulate running this command and show it's output, without actually changing anything",
	},
];

const completionSpec: Fig.Spec = {
	name: "apt",
	description: "Package manager for Debian-based Linux distributions",
	subcommands: [
		{
			name: "update",
			description: "Update the package database",
			options: [...yesNoOptions],
		},
		{
			name: "upgrade",
			description: "Install all available upgrades",
			args: {
				name: "package",
				description: "Package(s) to upgrade",
				isVariadic: true,
				isOptional: true,
				generators: upgradablePackages,
			},
			options: [...installationOptions, ...yesNoOptions, ...simulate],
		},
		{
			name: "full-upgrade",
			description:
				"Install available upgrades, removing currently installed packages if needed to upgrade the system as a whole",
			options: [...installationOptions, ...yesNoOptions, ...simulate],
		},
		{
			name: "install",
			description: "Install package(s)",
			args: {
				name: "package",
				description: "The package you want to install",
				isVariadic: true,
				generators: [packages, filepaths({ extensions: ["deb"] })],
			},
			options: [
				...installationOptions,
				...yesNoOptions,
				...simulate,
				{
					name: "--reinstall",
					description: "Reinstall the package if it is already installed",
				},
				{
					name: ["-f", "--fix-broken"],
					description: "Attempt to fix broken packages",
				},
			],
		},
		{
			name: "reinstall",
			description: "Reinstall package(s)",
			args: {
				name: "package",
				description: "The package you want to reinstall",
				isVariadic: true,
				generators: installedPackages,
			},
			options: [...yesNoOptions, ...simulate],
		},
		{
			name: "remove",
			description: "Remove package(s)",
			args: {
				name: "package",
				description: "The package you want to remove",
				isVariadic: true,
				generators: installedPackages,
			},
			options: [
				...yesNoOptions,
				...simulate,
				{
					name: ["-f", "--fix-broken"],
					description: "Attempt to fix broken packages",
				},
			],
		},
		{
			name: "purge",
			description: "Remove package(s) and their configuration files",
			args: {
				name: "package",
				description: "The package you want to purge",
				isVariadic: true,
				generators: installedPackages,
			},
			options: [...yesNoOptions, ...simulate],
		},
		{
			name: ["autoremove", "auto-remove"],
			description: "Remove unused packages",
			options: [...yesNoOptions, ...simulate],
		},
		{
			name: "list",
			description: "List packages",
			options: [
				{
					name: "--installed",
					description: "List installed packages",
				},
				{
					name: "--upgradable",
					description: "List upgradable packages",
				},
			],
		},
		{
			name: "search",
			description: "Search for packages",
			args: {
				name: "query",
				description: "The query to search for",
			},
			options: [...yesNoOptions],
		},
		{
			name: "show",
			description: "Show package details",
			args: {
				name: "package",
				description: "The package you want to show",
				generators: packages,
			},
		},
		{
			name: "satisfy",
			description: "Satisfy package dependencies",
			args: {
				name: "package",
				description: "The package you want to satisfy",
				isVariadic: true,
				generators: packages,
			},
			options: [...installationOptions, ...yesNoOptions, ...simulate],
		},
		{
			name: "clean",
			description: "Remove downloaded package files",
			options: [...yesNoOptions, ...simulate],
		},
		{
			name: "edit-sources",
			description: "Edit the list of package sources",
			options: [...yesNoOptions],
		},
		{
			// docs for this weren't the greatest, some descriptions might be slightly (or very) wrong.
			name: "source",
			description: "Fetch package source files",
			args: {
				name: "package",
				description: "The package you want to get source files for",
				isVariadic: true,
				generators: packages,
			},
			options: [
				...installationOptions,
				...yesNoOptions,
				...simulate,
				{
					name: "--compile",
					description:
						"Compile the package to a binary using dpkg-buildpackage",
				},
				{
					name: "--only-source",
					// no idea how this works
				},
				{
					name: "--host-architecture",
					description: "The architecture to build for",
					args: {
						name: "architecture",
						description: "The architecture to build for",
					},
				},
			],
		},
		{
			// I don't understand this either
			name: "build-dep",
			description:
				"Install/remove packages in an attempt to satisfy the build dependencies for a source package",
			args: {
				name: "package",
				description: "The package you want to build dependencies for",
				generators: packages,
			},
			options: [
				...installationOptions,
				...yesNoOptions,
				...simulate,
				{
					name: "--host-architecture",
					description: "The architecture to build for",
					args: {
						name: "architecture",
						description: "The architecture to build for",
					},
				},
				{
					name: "--only-source",
				},
			],
		},
		{
			name: "download",
			description: "Download package binary into the current directory",
			args: {
				name: "package",
				description: "The package you want to download",
				generators: packages,
			},
			options: [...installationOptions, ...yesNoOptions],
		},
		{
			name: ["autoclean", "auto-clean"],
			description:
				"Like clean, but only removes package files that can no longer be downloaded",
			options: [...installationOptions, ...yesNoOptions, ...simulate],
		},
		{
			name: "changelog",
			description: "Show the changelog for a package",
			args: {
				name: "package",
				description: "The package you want to show the changelog for",
				generators: packages,
				isVariadic: true,
			},
			options: [...installationOptions, ...yesNoOptions],
		},
	],
	options: [
		{
			name: ["-h", "--help"],
			description: "Print help message and exit",
			isPersistent: true,
			priority: 40,
		},
		{
			name: ["-v", "--version"],
			description: "Print version information and exit",
			isPersistent: true,
			priority: 40,
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/basename.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/basename.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "basename",
	description: "Return filename portion of pathname",
	options: [
		{
			name: "-a",
			description: "Treat every argument as a string",
		},
		{
			name: "-s",
			description: "Suffix to remove from string",
			args: {
				name: "suffix",
			},
		},
	],
	args: {
		name: "string",
		description: "String to operate on (typically filenames)",
		isVariadic: true,
		template: "filepaths",
	},
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/brew.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/brew.ts

```typescript
const servicesGenerator = (action: string): Fig.Generator => ({
	script: ["bash", "-c", "brew services list | sed -e 's/ .*//' | tail -n +2"],
	postProcess: function (out) {
		return out
			.split("\n")
			.filter((line) => !line.includes("unbound"))
			.map((line) => ({
				name: line,
				icon: "fig://icon?type=package",
				description: `${action} ${line}`,
			}));
	},
});

const repositoriesGenerator = (): Fig.Generator => ({
	script: ["brew", "tap"],
	postProcess: (out) => {
		return out.split("\n").map((line) => ({ name: line }));
	},
});

const formulaeGenerator: Fig.Generator = {
	script: ["brew", "list", "-1"],
	postProcess: function (out) {
		return out
			.split("\n")
			.filter((line) => !line.includes("="))
			.map((formula) => ({
				name: formula,
				icon: "🍺",
				description: "Installed formula",
			}));
	},
};

const outdatedformulaeGenerator: Fig.Generator = {
	script: ["brew", "outdated", "-q"],
	postProcess: function (out) {
		return out.split("\n").map((formula) => ({
			name: formula,
			icon: "🍺",
			description: "Outdated formula",
		}));
	},
};

const generateAllFormulae: Fig.Generator = {
	script: ["brew", "formulae"],
	postProcess: function (out) {
		return out.split("\n").map((formula) => ({
			name: formula,
			icon: "🍺",
			description: "Formula",
			priority: 51,
		}));
	},
};

const generateAllCasks: Fig.Generator = {
	script: ["brew", "casks"],
	postProcess: function (out) {
		return out.split("\n").map((cask) => ({
			name: cask,
			icon: "🍺",
			description: "Cask",
			priority: 52,
		}));
	},
};
const generateAliases: Fig.Generator = {
	script: [
		"bash",
		"-c",
		'find ~/.brew-aliases/ -type f ! -name "*.*" -d 1 | sed "s/.*\\///"',
	],
	postProcess: function (out) {
		return out
			.split("\n")
			.filter((line) => line && line.trim() !== "")
			.map((line) => ({
				name: line,
				icon: "fig://icon?type=command",
				description: `Execute alias ${line}`,
			}));
	},
};

const commonOptions: Fig.Option[] = [
	{
		name: ["-d", "--debug"],
		description: "Display any debugging information",
	},
	{
		name: ["-q", "--quiet"],
		description: "Make some output more quiet",
	},
	{
		name: ["-v", "--verbose"],
		description: "Make some output more verbose",
	},
	{ name: ["-h", "--help"], description: "Show help message" },
];

const completionSpec: Fig.Spec = {
	name: "brew",
	description: "Package manager for macOS",
	subcommands: [
		{
			name: "list",
			description: "List all installed formulae",
			options: [
				...commonOptions,
				{
					name: ["--formula", "--formulae"],
					description:
						"List only formulae, or treat all named arguments as formulae",
				},
				{
					name: ["--cask", "--casks"],
					description: "List only casks, or treat all named arguments as casks",
				},
				{
					name: "--unbrewed",
					description:
						"List files in Homebrew's prefix not installed by Homebrew. (disabled; replaced by brew --prefix --unbrewed)",
				},
				{
					name: "--full-name",
					description:
						"Print formulae with fully-qualified names. Unless --full-name, --versions or",
				},
				{
					name: "--pinned",
					description:
						"List only pinned formulae, or only the specified (pinned) formulae if formula are provided",
				},
				{
					name: "--versions",
					description:
						"Show the version number for installed formulae, or only the specified formulae if formula are provided",
				},
				{
					name: "--multiple",
					description: "Only show formulae with multiple versions installed",
				},
				{
					name: "--pinned",
					description:
						"List only pinned formulae, or only the specified (pinned) formulae if formula are provided. See also pin, unpin",
				},
				{
					name: "-1",
					description:
						"Force output to be one entry per line. This is the default when output is not to a terminal",
				},
				{
					name: "-l",
					description:
						"List formulae and/or casks in long format. Has no effect when a formula or cask name is passed as an argument",
				},
				{
					name: "-r",
					description:
						"Reverse the order of the formulae and/or casks sort to list the oldest entries first. Has no effect when a formula or cask name is passed as an argument",
				},
				{
					name: "-t",
					description:
						"Sort formulae and/or casks by time modified, listing most recently modified first. Has no effect when a formula or cask name is passed as an argument",
				},
			],
			args: {
				isOptional: true,
				isVariadic: true,
				name: "formula",
				generators: formulaeGenerator,
			},
		},
		{
			name: "ls",
			description: "List all installed formulae",
			options: [
				...commonOptions,
				{
					name: "--formula",
					description:
						"List only formulae, or treat all named arguments as formulae",
				},
				{
					name: "--cask",
					description: "List only casks, or treat all named arguments as casks",
				},
				{
					name: "--unbrewed",
					description:
						"List files in Homebrew's prefix not installed by Homebrew. (disabled; replaced by brew --prefix --unbrewed)",
				},
				{
					name: "--full-name",
					description:
						"Print formulae with fully-qualified names. Unless --full-name, --versions or",
				},
				{
					name: "--pinned",
					description:
						"List only pinned formulae, or only the specified (pinned) formulae if formula are provided",
				},
				{
					name: "--versions",
					description:
						"Show the version number for installed formulae, or only the specified formulae if formula are provided",
				},
				{
					name: "--multiple",
					description: "Only show formulae with multiple versions installed",
				},
				{
					name: "--pinned",
					description:
						"List only pinned formulae, or only the specified (pinned) formulae if formula are provided",
				},
				{
					name: "-1",
					description:
						"Force output to be one entry per line. This is the default when output is not to a terminal",
				},
				{
					name: "-l",
					description:
						"List formulae and/or casks in long format. Has no effect when a formula or cask name is passed as an argument",
				},
				{
					name: "-r",
					description:
						"Reverse the order of the formulae and/or casks sort to list the oldest entries first. Has no effect when a formula or cask name is passed as an argument",
				},
				{
					name: "-t",
					description:
						"Sort formulae and/or casks by time modified, listing most recently modified first. Has no effect when a formula or cask name is passed as an argument",
				},
			],
			args: {
				isOptional: true,
				isVariadic: true,
				name: "formula",
				generators: formulaeGenerator,
			},
		},
		{
			name: "leaves",
			description:
				"List installed formulae that are not dependencies of another installed formula",
			options: [
				{
					name: ["-r", "--installed-on-request"],
					description: "Show manually installed formula",
				},
				{
					name: ["-p", "--installed-as-dependency"],
					description: "Show installed formula as dependencies",
				},
			],
		},
		{
			name: "doctor",
			description: "Check your system for potential problems",
			options: [
				...commonOptions,
				{
					name: "--list-checks",
					description: "List all audit methods",
				},
				{
					name: ["-D", "--audit-debug"],
					description: "Enable debugging and profiling of audit methods",
				},
			],
		},
		{
			name: ["abv", "info"],
			description: "Display brief statistics for your Homebrew installation",
			args: {
				isVariadic: true,
				isOptional: true,
				name: "formula",
				description: "Formula or cask to summarize",
				generators: [generateAllFormulae, generateAllCasks],
			},
			options: [
				{
					name: ["--cask", "--casks"],
					description: "List only casks, or treat all named arguments as casks",
				},
				{
					name: "--analytics",
					description:
						"List global Homebrew analytics data or, if specified, installation and build error data for formula",
				},
				{
					name: "--days",
					description: "How many days of analytics data to retrieve",
					exclusiveOn: ["--analytics"],
					args: {
						name: "days",
						description: "Number of days of data to retrieve",
						suggestions: ["30", "90", "365"],
					},
				},
				{
					name: "--category",
					description: "Which type of analytics data to retrieve",
					exclusiveOn: ["--analytics"],
					args: {
						generators: {
							custom: async (ctx) => {
								// if anything provided after the subcommand does not begin with '-'
								// then a formula has been provided and we should provide info on it
								if (
									ctx.slice(2, ctx.length - 1).some((token) => token[0] !== "-")
								) {
									return ["install", "install-on-request", "build-error"].map(
										(sugg) => ({
											name: sugg,
										})
									);
								}

								// if no formulas are specified, then we should provide system info
								return ["cask-install", "os-version"].map((sugg) => ({
									name: sugg,
								}));
							},
						},
					},
				},
				{
					name: "--github",
					description: "Open the GitHub source page for formula in a browser",
				},
				{
					name: "--json",
					description: "Print a JSON representation",
				},
				{
					name: "--installed",
					exclusiveOn: ["--json"],
					description: "Print JSON of formulae that are currently installed",
				},
				{
					name: "--all",
					exclusiveOn: ["--json"],
					description: "Print JSON of all available formulae",
				},
				{
					name: ["-v", "--verbose"],
					description: "Show more verbose analytics data for formulae",
				},
				{
					name: "--formula",
					description: "Treat all named arguments as formulae",
				},
				{
					name: "--cash",
					description: "Treat all named arguments as casks",
				},
				{
					name: ["-d", "--debug"],
					description: "Display any debugging information",
				},
				{
					name: ["-q", "--quiet"],
					description: "List only the names of outdated kegs",
				},
				{
					name: ["-h", "--help"],
					description: "Get help with services command",
				},
			],
		},
		{
			name: "update",
			description: "Fetch the newest version of Homebrew and all formulae",
			options: [
				{
					name: ["-f", "--force"],
					description: "Always do a slower, full update check",
				},
				{
					name: ["-v", "--verbose"],
					description:
						"Print the directories checked and git operations performed",
				},
				{
					name: ["-d", "--debug"],
					description:
						"Display a trace of all shell commands as they are executed",
				},
				{ name: ["-h", "--help"], description: "Show help message" },
				{
					name: "--merge",
					description:
						"Use git merge to apply updates (rather than git rebase)",
				},
				{
					name: "--preinstall",
					description:
						"Run on auto-updates (e.g. before brew install). Skips some slower steps",
				},
			],
		},
		{
			name: "outdated",
			description:
				"List installed casks and formulae that have an updated version available",
			options: [
				{
					name: ["-d", "--debug"],
					description: "Display any debugging information",
				},
				{
					name: ["-q", "--quiet"],
					description: "List only the names of outdated kegs",
				},
				{
					name: ["-v", "--verbose"],
					description: "Include detailed version information",
				},
				{
					name: ["-h", "--help"],
					description: "Show help message for the outdated command",
				},
				{ name: "--cask", description: "List only outdated casks" },
				{
					name: "--fetch-HEAD",
					description:
						"Fetch the upstream repository to detect if the HEAD installation of the formula is outdated",
				},
				{ name: "--formula", description: "List only outdated formulae" },
				{
					name: "--greedy",
					description:
						"Print outdated casks with auto_updates or version :latest",
				},
				{
					name: "--greedy-latest",
					description:
						"Print outdated casks including those with version :latest",
				},
				{
					name: "--greedy-auto-updates",
					description:
						"Print outdated casks including those with auto_updates true",
				},
				{ name: "--json", description: "Print output in JSON format" },
			],
		},
		{
			name: "pin",
			description: "Pin formula, preventing them from being upgraded",
			options: commonOptions,
			args: {
				isVariadic: true,
				name: "formula",
				generators: formulaeGenerator,
			},
		},
		{
			name: "unpin",
			description: "Unpin formula, allowing them to be upgraded",
			options: commonOptions,
			args: {
				isVariadic: true,
				name: "formula",
				generators: formulaeGenerator,
			},
		},
		{
			name: "upgrade",
			description:
				"Upgrade outdated casks and outdated, unpinned formulae using the same options they were originally installed with, plus any appended brew formula options",
			options: [
				{
					name: ["-d", "--debug"],
					description:
						"If brewing fails, open an interactive debugging session with access to IRB or a shell inside the temporary build directory",
				},
				{
					name: ["-f", "--force"],
					description:
						"Install formulae without checking for previously installed keg-only or non-migrated versions. When installing casks, overwrite existing files (binaries and symlinks are excluded, unless originally from the same cask)",
				},
				{
					name: ["-v", "--verbose"],
					description: "Print the verification and postinstall steps",
				},
				{
					name: ["-n", "--dry-run"],
					description:
						"Show what would be upgraded, but do not actually upgrade anything",
				},
				{
					name: ["-s", "--build-from-source"],
					description:
						"Compile formula from source even if a bottle is provided. Dependencies will still be installed from bottles if they are available",
				},
				{
					name: ["-i", "--interactive"],
					description: "Download and patch formula, then open a shell",
				},
				{ name: ["-g", "--git"], description: "Create a Git repository" },
				{
					name: ["-q", "--quiet"],
					description: "Make some output more quiet",
				},
				{ name: ["-h", "--help"], description: "Show this message" },
				{
					name: ["--formula", "--formulae"],
					description:
						"Treat all named arguments as formulae. If no named arguments are specified, upgrade only outdated formulae",
				},
				{
					name: "--env",
					description: "Disabled other than for internal Homebrew use",
				},
				{
					name: "--ignore-dependencies",
					description:
						"An unsupported Homebrew development flag to skip installing any dependencies of any kind. If the dependencies are not already present, the formula will have issues. If you're not developing Homebrew, consider adjusting your PATH rather than using this flag",
				},
				{
					name: "--only-dependencies",
					description:
						"Install the dependencies with specified options but do not install the formula itself",
				},
				{
					name: "--cc",
					description:
						"Attempt to compile using the specified compiler, which should be the name of the compiler's executable",
					args: {
						name: "compiler",
						suggestions: ["gcc-7", "llvm_clang", "clang"],
					},
				},
				{
					name: "--force-bottle",
					description:
						"Install from a bottle if it exists for the current or newest version of macOS, even if it would not normally be used for installation",
				},
				{
					name: "--include-test",
					description:
						"Install testing dependencies required to run brew test formula",
				},
				{
					name: "--HEAD",
					description:
						"If formula defines it, install the HEAD version, aka. main, trunk, unstable, master",
				},
				{
					name: "--fetch-HEAD",
					description:
						"Fetch the upstream repository to detect if the HEAD installation of the formula is outdated. Otherwise, the repository's HEAD will only be checked for updates when a new stable or development version has been released",
				},
				{
					name: "--ignore-pinned",
					description:
						"Set a successful exit status even if pinned formulae are not upgraded",
				},
				{
					name: "--keep-tmp",
					description: "Retain the temporary files created during installation",
				},
				{
					name: "--build-bottle",
					description:
						"Prepare the formula for eventual bottling during installation, skipping any post-install steps",
				},
				{
					name: "--bottle-arch",
					description:
						"Optimise bottles for the specified architecture rather than the oldest architecture supported by the version of macOS the bottles are built on",
				},
				{
					name: "--display-times",
					description:
						"Print install times for each formula at the end of the run",
				},
				{
					name: ["--cask", "--casks"],
					description:
						"Treat all named arguments as casks. If no named arguments are specified, upgrade only outdated casks",
				},
				{
					name: "--binaries",
					description:
						"Disable/enable linking of helper executables (default: enabled)",
					exclusiveOn: ["--no-binaries"],
				},
				{
					name: "--no-binaries",
					description:
						"Disable/enable linking of helper executables (default: enabled)",
					exclusiveOn: ["--binaries"],
				},
				{
					name: "--require-sha",
					description: "Require all casks to have a checksum",
				},
				{
					name: "--quarantine",
					description:
						"Disable/enable quarantining of downloads (default: enabled)",
					exclusiveOn: ["--no-quarantine"],
				},
				{
					name: "--no-quarantine",
					description:
						"Disable/enable quarantining of downloads (default: enabled)",
					exclusiveOn: ["--quarantine"],
				},
				{
					name: "--skip-cask-deps",
					description: "Skip installing cask dependencies",
				},
				{
					name: "--greedy",
					description:
						"Also include casks with auto_updates true or version :latest",
					exclusiveOn: ["--greedy-latest", "--greedy-auto-updates"],
				},
				{
					name: "--greedy-latest",
					description: "Also include casks with version :latest",
				},
				{
					name: "--greedy-auto-updates",
					description: "Also include casks with auto_updates true",
				},
				{
					name: "--appdir",
					description:
						"Target location for Applications (default: /Applications)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--colorpickerdir",
					description:
						"Target location for Color Pickers (default: ~/Library/ColorPickers)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--prefpanedir",
					description:
						"Target location for Preference Panes (default: ~/Library/PreferencePanes)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--qlplugindir",
					description:
						"Target location for QuickLook Plugins (default: ~/Library/QuickLook)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--mdimporterdir",
					description:
						"Target location for Spotlight Plugins (default: ~/Library/Spotlight)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--dictionarydir",
					description:
						"Target location for Dictionaries (default: ~/Library/Dictionaries)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--fontdir",
					description: "Target location for Fonts (default: ~/Library/Fonts)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--servicedir",
					description:
						"Target location for Services (default: ~/Library/Services)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--input-methoddir",
					description:
						"Target location for Input Methods (default: ~/Library/Input Methods)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--internet-plugindir",
					description:
						"Target location for Internet Plugins (default: ~/Library/Internet Plug-Ins)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--audio-unit-plugindir",
					description:
						"Target location for Audio Unit Plugins (default: ~/Library/Audio/Plug-Ins/Components)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--vst-plugindir",
					description:
						"Target location for VST Plugins (default: ~/Library/Audio/Plug-Ins/VST)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--vst3-plugindir",
					description:
						"Target location for VST3 Plugins (default: ~/Library/Audio/Plug-Ins/VST3)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--screen-saverdir",
					description:
						"Target location for Screen Savers (default: ~/Library/Screen Savers)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--language",
					description:
						"Comma-separated list of language codes to prefer for cask installation. The first matching language is used, otherwise it reverts to the cask's default language. The default value is the language of your system",
				},
			],
			args: {
				isVariadic: true,
				isOptional: true,
				name: "outdated_formula|outdated_cask",
				generators: outdatedformulaeGenerator,
			},
		},
		{
			name: "search",
			description:
				"Perform a substring search of cask tokens and formula names",
			options: [
				...commonOptions,
				{
					name: "--formula",
					description: "Search online and locally for formulae",
				},
				{
					name: "--cask",
					description: "Search online and locally for casks",
				},
				{
					name: "--desc",
					description:
						"Search for formulae with a description matching text and casks with a name matching text",
				},
				{
					name: "--pull-request",
					description: "Search for GitHub pull requests containing text",
				},
				{
					name: "--open",
					description: "Search for only open GitHub pull requests",
				},
				{
					name: "--closed",
					description: "Search for only closed GitHub pull requests",
				},
				{
					name: ["--repology", "--macports"],
					description: "Search for text in the given database",
				},
				{
					name: ["--fink", "--opensuse"],
					description: "Search for text in the given database",
				},
				{
					name: ["--fedora", "--debian"],
					description: "Search for text in the given database",
				},
				{
					name: "--ubuntu",
					description: "Search for text in the given database",
				},
			],
		},
		{
			name: "config",
			description: "Show Homebrew and system configuration info",
		},
		{
			name: "postinstall",
			description: "Rerun the post install step for formula",
			options: [
				{
					name: ["-d", "--debug"],
					description: "Display any debugging information",
				},
				{
					name: ["-v", "--verbose"],
					description: "Make some output more verbose",
				},
				{
					name: ["-q", "--quiet"],
					description: "Make some output more quiet",
				},
				{ name: ["-h", "--help"], description: "Show this message" },
			],
			args: {
				isVariadic: true,
				name: "formula",
				generators: formulaeGenerator,
			},
		},
		{
			name: "install",
			description: "Install <formula>",
			options: [
				{
					name: ["-f", "--force"],
					description:
						"Install formulae without checking for previously installed keg-only or non-migrated versions. When installing casks",
				},
				{
					name: ["-v", "--verbose"],
					description: "Print the verification and postinstall steps",
				},
				{
					name: ["-s", "--build-from-source"],
					description:
						"Compile formula from source even if a bottle is provided. Dependencies will still be installed from bottles if they are available",
				},
				{
					name: ["-i", "--interactive"],
					description: "Download and patch formula",
				},
				{ name: ["-g", "--git"], description: "Create a Git repository" },
				{
					name: ["-q", "--quiet"],
					description: "Make some output more quiet",
				},
				{ name: ["-h", "--help"], description: "Show this message" },
				{
					name: "--formula",
					description: "Treat all named arguments as formulae",
				},
				{
					name: "--env",
					description: "Disabled other than for internal Homebrew use",
				},
				{
					name: "--ignore-dependencies",
					description:
						"An unsupported Homebrew development flag to skip installing any dependencies of any kind. If the dependencies are not already present, the formula will have issues. If you're not developing Homebrew, consider adjusting your PATH rather than using this flag",
				},
				{
					name: "--only-dependencies",
					description:
						"Install the dependencies with specified options but do not install the formula itself",
				},
				{
					name: "--cc",
					description:
						"Attempt to compile using the specified compiler, which should be the name of the compiler's executable",
					args: {
						name: "compiler",
						suggestions: ["gcc-7", "llvm_clang", "clang"],
					},
				},
				{
					name: "--force-bottle",
					description:
						"Install from a bottle if it exists for the current or newest version of macOS, even if it would not normally be used for installation",
				},
				{
					name: "--include-test",
					description:
						"Install testing dependencies required to run brew test formula",
				},
				{
					name: "--HEAD",
					description:
						"If formula defines it, install the HEAD version, aka. main, trunk, unstable, master",
				},
				{
					name: "--fetch-HEAD",
					description:
						"Fetch the upstream repository to detect if the HEAD installation of the formula is outdated. Otherwise, the repository's HEAD will only be checked for updates when a new stable or development version has been released",
				},
				{
					name: "--keep-tmp",
					description: "Retain the temporary files created during installation",
				},
				{
					name: "--build-bottle",
					description:
						"Prepare the formula for eventual bottling during installation, skipping any post-install steps",
				},
				{
					name: "--bottle-arch",
					description:
						"Optimise bottles for the specified architecture rather than the oldest architecture supported by the version of macOS the bottles are built on",
				},
				{
					name: "--display-times",
					description:
						"Print install times for each formula at the end of the run",
				},
				{
					name: "--cask",
					description: "--casks Treat all named arguments as casks",
				},
				{
					name: "--binaries",
					description:
						"Disable/enable linking of helper executables (default: enabled)",
				},
				{
					name: "--no-binaries",
					description:
						"Disable/enable linking of helper executables (default: enabled)",
				},
				{
					name: "--require-sha",
					description: "Require all casks to have a checksum",
				},
				{
					name: "--quarantine",
					description:
						"Disable/enable quarantining of downloads (default: enabled)",
				},
				{
					name: "--no-quarantine",
					description:
						"Disable/enable quarantining of downloads (default: enabled)",
				},
				{
					name: "--skip-cask-deps",
					description: "Skip installing cask dependencies",
				},
				{
					name: "--appdir",
					description:
						"Target location for Applications (default: /Applications)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--colorpickerdir",
					description:
						"Target location for Color Pickers (default: ~/Library/ColorPickers)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--prefpanedir",
					description:
						"Target location for Preference Panes (default: ~/Library/PreferencePanes)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--qlplugindir",
					description:
						"Target location for QuickLook Plugins (default: ~/Library/QuickLook)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--mdimporterdir",
					description:
						"Target location for Spotlight Plugins (default: ~/Library/Spotlight)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--dictionarydir",
					description:
						"Target location for Dictionaries (default: ~/Library/Dictionaries)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--fontdir",
					description: "Target location for Fonts (default: ~/Library/Fonts)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--servicedir",
					description:
						"Target location for Services (default: ~/Library/Services)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--input-methoddir",
					description:
						"Target location for Input Methods (default: ~/Library/Input Methods)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--internet-plugindir",
					description:
						"Target location for Internet Plugins (default: ~/Library/Internet Plug-Ins)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--audio-unit-plugindir",
					description:
						"Target location for Audio Unit Plugins (default: ~/Library/Audio/Plug-Ins/Components)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--vst-plugindir",
					description:
						"Target location for VST Plugins (default: ~/Library/Audio/Plug-Ins/VST)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--vst3-plugindir",
					description:
						"Target location for VST3 Plugins (default: ~/Library/Audio/Plug-Ins/VST3)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--screen-saverdir",
					description:
						"Target location for Screen Savers (default: ~/Library/Screen Savers)",
					args: {
						name: "location",
						template: "folders",
					},
				},
				{
					name: "--language",
					description:
						"Comma-separated list of language codes to prefer for cask installation. The first matching language is used, otherwise it reverts to the cask's default language. The default value is the language of your system",
				},
			],
			args: {
				isVariadic: true,
				name: "formula",
				description: "Formula or cask to install",
				generators: [generateAllFormulae, generateAllCasks],
			},
		},
		{
			name: "reinstall",
			description:
				"Uninstall and then reinstall a formula or cask using the same options it was originally installed with, plus any appended options specific to a formula",
			options: [
				{
					name: ["-d", "--debug"],
					description:
						"If brewing fails, open an interactive debugging session with access to IRB or a shell inside the temporary build directory",
				},
				{
					name: ["-f", "--force"],
					description:
						"Install formulae without checking for previously installed keg-only or non-migrated versions. When installing casks",
				},
				{
					name: ["-v", "--verbose"],
					description: "Print the verification and postinstall steps",
				},
				{
					name: ["-s", "--build-from-source"],
					description:
						"Compile formula from source even if a bottle is provided. Dependencies will still be installed from bottles if they are available",
				},
				{
					name: ["-i", "--interactive"],
					description: "Download and patch formula",
				},
				{ name: ["-g", "--git"], description: "Create a Git repository" },
				{
					name: "--formula",
					description: "Treat all named arguments as formulae",
				},
				{
					name: "--force-bottle",
					description:
						"Install from a bottle if it exists for the current or newest version of macOS, even if it would not normally be used for installation",
				},
				{
					name: "--keep-tmp",
					description: "Retain the temporary files created during installation",
				},
				{
					name: "--display-times",
					description:
						"Print install times for each formula at the end of the run",
				},
				{
					name: "--cask",
					description: "--casks Treat all named arguments as casks",
				},
				{
					name: "--binaries",
					description:
						"Disable/enable linking of helper executables (default: enabled)",
					exclusiveOn: ["--no-binaries"],
				},
				{
					name: "--no-binaries",
					description:
						"Disable/enable linking of helper executables (default: enabled)",
					exclusiveOn: ["--binaries"],
				},
				{
					name: "--require-sha",
					description: "Require all casks to have a checksum",
				},
				{
					name: "--quarantine",
					description:
						"Disable/enable quarantining of downloads (default: enabled)",
					exclusiveOn: ["--no-quarantine"],
				},
				{
					name: "--no-quarantine",
					description:
						"Disable/enable quarantining of downloads (default: enabled)",
					exclusiveOn: ["--quarantine"],
				},
				{
					name: "--skip-cask-deps",
					description: "Skip installing cask dependencies",
				},
			],
			args: {
				isVariadic: true,
				name: "formula",
				generators: formulaeGenerator,
			},
		},
		{
			name: ["uninstall", "remove", "rm"],
			description: "Uninstall a formula or cask",
			args: {
				isVariadic: true,
				name: "formula",
				generators: formulaeGenerator,
			},
		},
		{
			// NOTE: this is actually a command even if it has the double dash in the front
			name: "--prefix",
			description: "Prefix of <formula>",
			args: {
				isVariadic: true,
				name: "formula",
				generators: formulaeGenerator,
			},
			options: [
				{
					name: "--unbrewed",
					description:
						"List files in Homebrew's prefix not installed by Homebrew",
				},
				{
					name: "--installed",
					description:
						"Outputs nothing and returns a failing status code if formula is not installed",
				},
			],
		},
		{
			name: "cask",
			description:
				"Homebrew Cask provides a friendly CLI workflow for the administration of macOS applications distributed as binaries",
			subcommands: [
				{
					name: "install",
					description: "Installs the given cask",
					args: {
						name: "cask",
						description: "Cask to install",
					},
				},
				{
					name: "uninstall",
					description: "Uninstalls the given cask",
					options: [
						...commonOptions,
						{
							name: "--zap",
							description:
								"Remove all files associated with a cask. May remove files which are shared between applications",
						},
						{
							name: "--ignore-dependencies",
							description:
								"Don't fail uninstall, even if formula is a dependency of any installed formulae",
						},
						{
							name: "--formula",
							description: "Treat all named arguments as formulae",
						},
						{
							name: "--cask",
							description: "Treat all named arguments as casks",
						},
					],
					args: {
						isVariadic: true,

						generators: {
							script: ["brew", "list", "-1", "--cask"],
							postProcess: function (out) {
								return out.split("\n").map((formula) => {
									return {
										name: formula,
										icon: "🍺",
										description: "Installed formula",
									};
								});
							},
						},
					},
				},
			],
		},
		{
			name: "cleanup",
			description:
				"Remove stale lock files and outdated downloads for all formulae and casks and remove old versions of installed formulae",
			options: [
				...commonOptions,
				{
					name: ["--prune", "--prune=all"],
					description: "Remove all cache files older than specified days",
				},
				{
					name: ["-n", "--dry-run"],
					description:
						"Show what would be removed, but do not actually remove anything",
				},
				{
					name: "-s",
					description:
						"Scrub the cache, including downloads for even the latest versions",
				},
				{
					name: "--prune-prefix",
					description:
						"Only prune the symlinks and directories from the prefix and remove no other files",
				},
			],
			args: {
				isVariadic: true,
				isOptional: true,
				generators: servicesGenerator("Cleanup"),
			},
		},
		{
			name: "services",
			description:
				"Manage background services with macOS' launchctl(1) daemon manager",
			options: [
				...commonOptions,
				{
					name: "--file",
					description:
						"Use the plist file from this location to start or run the service",
				},
				{
					name: "--all",
					description: "Run subcommand on all services",
				},
				{
					name: ["-v", "--verbose"],
					description: "Make some output more verbose",
				},
				{
					name: ["-h", "--help"],
					description: "Get help with services command",
				},
			],
			subcommands: [
				{
					name: "cleanup",
					description: "Remove all unused services",
				},
				{
					name: "list",
					description: "List all services",
				},
				{
					name: "run",
					description:
						"Run the service formula without registering to launch at login (or boot)",
					options: [
						{
							name: "--all",
							description: "Start all services",
						},
					],
					args: {
						isVariadic: true,
						generators: servicesGenerator("Run"),
					},
				},
				{
					name: "start",
					description:
						"Start the service formula immediately and register it to launch at login",
					options: [
						{
							name: "--all",
							description: "Start all services",
						},
					],
					args: {
						isVariadic: true,
						generators: servicesGenerator("Start"),
					},
				},
				{
					name: "stop",
					description:
						"Stop the service formula immediately and unregister it from launching at",
					options: [
						{
							name: "--all",
							description: "Start all services",
						},
					],
					args: {
						isVariadic: true,
						generators: servicesGenerator("Stop"),
					},
				},
				{
					name: "restart",
					description:
						"Stop (if necessary) and start the service formula immediately and register it to launch at login (or boot)",
					options: [
						{
							name: "--all",
							description: "Start all services",
						},
					],
					args: {
						isVariadic: true,
						generators: servicesGenerator("Restart"),
					},
				},
			],
		},
		{
			name: "analytics",
			description: "Manages analytics preferences",
			subcommands: [
				{
					name: "on",
					description: "Turns on analytics",
				},
				{
					name: "off",
					description: "Turns off analytics",
				},
				{
					name: "regenerate-uuid",
					description: "Regenerate the UUID used for analytics",
				},
			],
		},
		{
			name: "autoremove",
			description:
				"Uninstall formulae that were only installed as a dependency of another formula and are now no longer needed",
			options: [
				{
					name: ["-n", "--dry-run"],
					description:
						"List what would be uninstalled, but do not actually uninstall anything",
				},
			],
		},
		{
			name: "tap",
			description: "Tap a formula repository",
			options: [
				...commonOptions,
				{
					name: "--full",
					description:
						"Convert a shallow clone to a full clone without untapping",
				},
				{
					name: "--shallow",
					description: "Fetch tap as a shallow clone rather than a full clone",
				},
				{
					name: "--force-auto-update",
					description: "Auto-update tap even if it is not hosted on GitHub",
				},
				{
					name: "--repair",
					description:
						"Migrate tapped formulae from symlink-based to directory-based structure",
				},
				{
					name: "--list-pinned",
					description: "List all pinned taps",
				},
			],
			args: {
				name: "user/repo or URL",
			},
		},
		{
			name: "untap",
			description: "Remove a tapped formula repository",
			args: {
				name: "repository",
				generators: repositoriesGenerator(),
			},
			options: [
				{
					name: ["-f", "--force"],
					description:
						"Untap even if formulae or casks from this tap are currently installed",
				},
				{
					name: ["-d", "--debug"],
					description: "Display any debugging information",
				},
				{
					name: ["-q", "--quiet"],
					description: "Make some output more quiet",
				},
				{
					name: ["-v", "--verbose"],
					description: "Make some output more verbose",
				},
				{
					name: ["-h", "--help"],
					description: "Show help message",
				},
			],
		},
		{
			name: "link",
			description:
				"Symlink all of formula's installed files into Homebrew's prefix",
			args: {
				isOptional: true,
				isVariadic: true,
				name: "formula",
				generators: formulaeGenerator,
			},
			options: [
				{
					name: "--overwrite",
					description:
						"Delete files that already exist in the prefix while linking",
				},
				{
					name: ["-n", "--dry-run"],
					description:
						"List files which would be linked or deleted by brew link --overwrite without actually linking or deleting any files",
				},
				{
					name: ["-f", "--force"],
					description: "Allow keg-only formulae to be linked",
				},
				{
					name: "--HEAD",
					description:
						"Link the HEAD version of the formula if it is installed",
				},
			],
		},
		{
			name: "unlink",
			description: "Remove symlinks for formula from Homebrew's prefix",
			args: {
				isOptional: true,
				isVariadic: true,
				name: "formula",
				generators: formulaeGenerator,
			},
			options: [
				{
					name: ["-n", "--dry-run"],
					description:
						"List files which would be unlinked without actually unlinking or deleting any files",
				},
			],
		},
		{
			name: "formulae",
			description: "List all available formulae",
		},
		{
			name: "casks",
			description: "List all available casks",
		},
		{
			name: "edit",
			description: "",
			args: {
				isVariadic: true,
				isOptional: true,
				name: "formula",
				description: "Formula or cask to install",
				generators: [generateAllFormulae, generateAllCasks],
			},
			options: [
				...commonOptions,
				{
					name: ["--formula", "--formulae"],
					description: "Treat all named arguments as formulae",
				},
				{
					name: ["--cask", "--casks"],
					description: "Treat all named arguments as casks",
				},
			],
		},
		{
			name: ["home", "homepage"],
			description:
				"Open a formula, cask's homepage in a browser, or open Homebrew's own homepage if no argument is provided",
			args: {
				isVariadic: true,
				isOptional: true,
				name: "formula",
				description: "Formula or cask to open homepage for",
				generators: [generateAllFormulae, generateAllCasks],
			},
			options: [
				...commonOptions,
				{
					name: ["--formula", "--formulae"],
					description: "Treat all named arguments as formulae",
				},
				{
					name: ["--cask", "--casks"],
					description: "Treat all named arguments as casks",
				},
			],
		},
		{
			name: "alias",
			description: "Manage custom user created brew aliases",
			options: [
				{
					name: "--edit",
					description: "Edit aliases in a text editor",
				},
				{
					name: ["-d", "--debug"],
					description: "Display any debugging information",
				},
				{
					name: ["-q", "--quiet"],
					description: "Make some output more quiet",
				},
				{
					name: ["-v", "--verbose"],
					description: "Make some output more verbose",
				},
				{
					name: ["-h", "--help"],
					description: "Show help message",
				},
			],
			args: {
				name: "alias",
				generators: generateAliases,
				description: "Display the alias command",
				isOptional: true,
			},
		},
		{
			name: "developer",
			description: "Display the current state of Homebrew's developer mode",
			args: {
				name: "state",
				description: "Turn Homebrew's developer mode on or off respectively",
				suggestions: ["on", "off"],
				isOptional: true,
			},
		},
	],
	options: [
		{
			name: "--version",
			description: "The current Homebrew version",
		},
	],
	args: {
		name: "alias",
		generators: generateAliases,
		description: "Custom user defined brew alias",
		isOptional: true,
	},
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/bundle.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/bundle.ts

```typescript
const gemfileGemsGenerator: Fig.Generator = {
	script: ["bundle", "list", "--name-only"],
	postProcess: (out) => {
		return out.split("\n").map((gem) => {
			return {
				name: gem,
				icon: "📦",
				description: "Gem",
			};
		});
	},
};

const completionSpec: Fig.Spec = {
	name: "bundle",
	description: "Ruby Dependency Management",
	subcommands: [
		// Primary Commands
		{
			name: "install",
			description: "Install the gems specified by the Gemfile or Gemfile.lock",
			options: [
				{
					name: "--binstubs",
					args: { template: "folders" },
					description: "Create binstubs in dir",
				},
				{ name: "--clean", description: "Remove unused gems after install" },
				{ name: "--deployment", description: "For Production and CI use" },
				{
					name: ["--force", "--redownload"],
					description: "Redownload all gems",
				},
				{ name: "--frozen", description: "Do not allow lock file to update" },
				{ name: "--full-index", description: "Cache the full index locally" },
				{
					name: "--gemfile",
					args: { template: "filepaths" },
					description: "The gemfile to use",
				},
				{
					name: "--jobs",
					args: {},
					description: "Maximum number of parallel installs",
				},
				{
					name: "--local",
					description: "Use only gems already downloaded or cached",
				},
				{ name: "--no-cache", description: "Do not use vendor/cache" },
				{ name: "--no-prune", description: "Do not remove stale gems" },
				{
					name: "--path",
					args: { template: "folders" },
					description: "Path the install gems too",
				},
				{ name: "--quiet", description: "Do not print to stdout" },
				{
					name: "--retry",
					args: {},
					description: "Retry failed network requests N times",
				},
				{
					name: "--shebang",
					args: {},
					description: "Uses the specified ruby executable for binstubs",
				},
				{
					name: "--standalone",
					args: {},
					description:
						"Makes a bundle that can work without depending on Rubygems or Bundler at runtime",
				},
				{ name: "--system", description: "Use system Rubygems location" },
				{
					name: "--trust-policy",
					args: {},
					description: "Apply the Rubygems security policy",
				},
				{ name: "--with", args: {}, description: "Groups to install" },
				{ name: "--without", args: {}, description: "Groups to NOT install" },
			],
		},
		{
			name: "update",
			description: "Update dependencies to their latest versions",
			args: {
				name: "gem",
				generators: gemfileGemsGenerator,
				isOptional: true,
			},
			options: [
				{
					name: "--all",
					description: "Update all gems specified in Gemfile",
				},
				{
					name: ["--group", "-g"],
					description: "Only update the gems in the specified group",
					args: {},
				},
				{
					name: "--source",
					description: "The name of a :git or :path source used in the Gemfile",
					args: {},
				},
				{
					name: "--local",
					description: "Use only gems already downloaded or cached",
				},
				{
					name: "--ruby",
					description:
						"Update the locked version of Ruby to the current version of Ruby",
				},
				{
					name: "--bundler",
					description:
						"Update the locked version of bundler to the invoked bundler version",
				},
				{
					name: "--full-index",
					description: "Fall back to using the single-file index of all gems",
				},
				{
					name: ["--jobs", "-j"],
					description:
						"Specify the number of jobs to run in parallel. The default is 1",
					args: {},
				},
				{
					name: "--retry",
					description: "Retry failed network or git requests for number times",
					args: {},
				},
				{ name: "--quiet", description: "Only output warnings and errors" },
				{
					name: ["--force", "--redownload"],
					description: "Force downloading every gem",
				},
				{
					name: "--patch",
					description: "Prefer updating only to next patch version",
				},
				{
					name: "--minor",
					description: "Prefer updating only to next minor version",
				},
				{
					name: "--major",
					description: "Prefer updating to next major version (default)",
				},
				{
					name: "--strict",
					description:
						"Do not allow any gem to be updated past latest --patch | --minor | --major",
				},
				{
					name: "--conservative",
					description: "Do not allow shared dependencies to be updated",
				},
			],
		},
		{
			name: "package",
			description:
				"Package the .gem files required by your application into the vendor/cache directory",
		},
		{
			name: "exec",
			description: "Execute a command in the context of the bundle",
			options: [
				{
					name: "--keep-file-descriptors",
					description: "Pass all file descriptors to the new process",
				},
			],
			args: { isCommand: true },
		},
		{ name: "config", args: {} },
		{ name: "help" },

		// Utility Commands
		{
			name: "add",
			description: "Add gem to the Gemfile and run bundle install",
			args: {},
			options: [
				{
					name: ["--version", "-v"],
					description: "Specify version requirements",
				},
				{
					name: ["--group", "-g"],
					description: "Specify the group(s) for the added gem",
				},
				{
					name: ["--source", "-s"],
					description: "Specify the source",
				},
				{
					name: "--skip-install",
					description: "Adds the gem to the Gemfile but does not install it",
				},
				{
					name: "--optimistic",
					description: "Adds optimistic declaration of version",
				},
				{
					name: "--strict",
					description: "Adds strict declaration of version",
				},
			],
		},
		{
			name: "binstubs",
			description: "Install the binstubs of the listed gems",
			args: {},
			options: [
				{
					name: "--force",
					description: "Overwrite existing binstubs",
				},
				{
					name: "--path",
					description: "The location to install the specified binstubs to",
				},
				{
					name: "--standalone",
					description:
						"Makes binstubs that can work without depending on Rubygems or Bundler at runtime",
				},
				{
					name: "--shebang",
					description:
						"Specify a different shebang executable name than the default",
				},
			],
		},
		{
			name: "check",
			description:
				"Determine whether the requirements for your application are installed and available to Bundler",
			options: [
				{
					name: "--dry-run",
					description: "Locks the Gemfile before running the command",
				},
				{
					name: "--gemfile",
					description: "Use the specified gemfile instead of the Gemfile",
				},
				{
					name: "--path",
					description: "Specify a different path than the system default",
				},
			],
		},
		{
			name: "show",
			description: "Show the source location of a particular gem in the bundle",
			args: {
				name: "gem",
				generators: gemfileGemsGenerator,
				isOptional: true,
			},
			options: [
				{
					name: "--paths",
					description:
						"List the paths of all gems that are required by your Gemfile",
				},
			],
		},
		{
			name: "outdated",
			description: "Show all of the outdated gems in the current bundle",
			options: [
				{
					name: "--local",
					description:
						"Do not attempt to fetch gems remotely and use the gem cache instead",
				},
				{ name: "--pre", description: "Check for newer pre-release gems" },
				{ name: "--source", description: "Check against a specific source" },
				{
					name: "--strict",
					description:
						"Only list newer versions allowed by your Gemfile requirements",
				},
				{
					name: ["--parseable", "--porcelain"],
					description: "Use minimal formatting for more parseable output",
				},
				{ name: "--group", description: "List gems from a specific group" },
				{ name: "--groups", description: "List gems organized by groups" },
				{
					name: "--update-strict",
					description:
						"Strict conservative resolution, do not allow any gem to be updated past latest --patch | --minor| --major",
				},
				{
					name: "--minor",
					description: "Prefer updating only to next minor version",
				},
				{
					name: "--major",
					description: "Prefer updating to next major version (default)",
				},
				{
					name: "--patch",
					description: "Prefer updating only to next patch version",
				},
				{
					name: "--filter-major",
					description: "Only list major newer versions",
				},
				{
					name: "--filter-minor",
					description: "Only list minor newer versions",
				},
				{
					name: "--filter-patch",
					description: "Only list patch newer versions",
				},
				{
					name: "--only-explicit",
					description:
						"Only list gems specified in your Gemfile, not their dependencies",
				},
			],
		},
		{
			name: "console",
			description: "Start an IRB session in the current bundle",
		},
		{
			name: "open",
			description: "Open an installed gem in the editor",
			args: {
				name: "gem",
				generators: gemfileGemsGenerator,
			},
		},
		{
			name: "lock",
			description: "Generate a lockfile for your dependencies",
			options: [
				{
					name: "--update",
					description: "Ignores the existing lockfile",
					args: {},
				},
				{
					name: "--local",
					description: "Do not attempt to connect to rubygems.org",
				},
				{
					name: "--print",
					description:
						"Prints the lockfile to STDOUT instead of writing to the file\n system",
				},
				{
					name: "--lockfile",
					description: "The path where the lockfile should be written to",
					args: { name: "path" },
				},
				{
					name: "--full-index",
					description: "Fall back to using the single-file index of all gems",
				},
				{
					name: "--add-platform",
					description:
						"Add a new platform to the lockfile, re-resolving for the addi-\n tion of that platform",
				},
				{
					name: "--remove-platform",
					description: "Remove a platform from the lockfile",
				},
				{
					name: "--patch",
					description:
						"If updating, prefer updating only to next patch version",
				},
				{
					name: "--minor",
					description:
						"If updating, prefer updating only to next minor version",
				},
				{
					name: "--major",
					description:
						"If updating, prefer updating to next major version (default)",
				},
				{
					name: "--strict",
					description:
						"If updating, do not allow any gem to be updated past latest --patch | --minor | --major",
				},
				{
					name: "--conservative",
					description:
						"If updating, use bundle install conservative update behavior and do not allow shared dependencies to be updated",
				},
			],
		},
		{
			name: "viz",
			description: "Generate a visual representation of your dependencies",
			options: [
				{
					name: ["--file", "-f"],
					description:
						"The name to use for the generated file. See --format option",
				},
				{
					name: ["--format", "-F"],
					description: "This is output format option",
				},
				{
					name: ["--requirements", "-R"],
					description: "Set to show the version of each required dependency",
				},
				{
					name: ["--version", "-v"],
					description: "Set to show each gem version",
				},
				{
					name: ["--without", "-W"],
					description:
						"Exclude gems that are part of the specified named group",
				},
			],
		},
		{
			name: "init",
			description: "Generate a simple Gemfile, placed in the current directory",
			options: [
				{
					name: "--gemspec",
					description: "Use the specified .gemspec to create the Gemfile",
				},
			],
		},
		{
			name: "gem",
			description: "Create a simple gem, suitable for development with Bundler",
			options: [
				{
					name: ["--exe", "-b", "--bin"],
					description: "Specify that Bundler should create a binary executable",
				},
				{
					name: "--no-exe",
					description: "Do not create a binary",
				},
				{
					name: "--coc",
					description:
						"Add a CODE_OF_CONDUCT.md file to the root of the generated project",
				},
				{
					name: "--no-coc",
					description: "Do not create a CODE_OF_CONDUCT.md",
				},
				{
					name: "--ext",
					description:
						"Add boilerplate for C extension code to the generated project",
				},
				{
					name: "--no-ext",
					description: "Do not add C extension code",
				},
				{
					name: "--mit",
					description: "Add an MIT license",
				},
				{
					name: "--no-mit",
					description: "Do not create a LICENSE.txt",
				},
				{
					name: ["-t", "--test"],
					description: "Specify the test framework that Bundler should use",
					args: {},
				},
				{
					name: ["-e", "--edit"],
					description: "Open the resulting gemspec in EDITOR",
					args: {},
				},
			],
		},
		{
			name: "platform",
			description: "Display platform compatibility information",
			options: [
				{
					name: "--ruby",
					description:
						"It will display the ruby directive information so you don't have to parse it from the Gemfile",
				},
			],
		},
		{
			name: "clean",
			description: "Clean up unused gems in your Bundler directory",
			options: [
				{
					name: "--dry-run",
					description: "Print the changes, but do not clean the unused gems",
				},
				{
					name: "--force",
					description: "Force a clean even if --path is not set",
				},
			],
		},
		{
			name: "doctor",
			description: "Display warnings about common problems",
			options: [
				{ name: "--quiet", description: "Only output warnings and errors" },
				{
					name: "--gemfile",
					description: "The location of the Gemfile which Bundler should use",
					args: {},
				},
			],
		},
	],
	options: [
		{ name: "--no-color", description: "Print all output without color" },
		{
			name: ["--retry", "-r"],
			description:
				"Specify the number of times you wish to attempt network commands",
		},
		{
			name: ["--verbose", "-V"],
			description: "Print out additional logging information",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/cat.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/cat.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "cat",
	description: "Concatenate and print files",
	args: {
		isVariadic: true,
		template: "filepaths",
	},
	options: [
		{
			name: "-b",
			description: "Number the non-blank output lines, starting at 1",
		},

		{
			name: "-e",
			description:
				"Display non-printing characters (see the -v option), and display a dollar sign (‘$’) at the end of each line",
		},

		{
			name: "-l",
			description:
				"Set an exclusive advisory lock on the standard output file descriptor.  This lock is set using fcntl(2) with the F_SETLKW command. If the output file is already locked, cat will block until the lock is acquired",
		},

		{ name: "-n", description: "Number the output lines, starting at 1" },

		{
			name: "-s",
			description:
				"Squeeze multiple adjacent empty lines, causing the output to be single spaced",
		},

		{
			name: "-t",
			description:
				"Display non-printing characters (see the -v option), and display tab characters as ‘^I’",
		},

		{ name: "-u", description: "Disable output buffering" },

		{
			name: "-v",
			description:
				"Display non-printing characters so they are visible.  Control characters print as ‘^X’ for control-X; the delete character (octal 0177) prints as ‘^?’.  Non-ASCII characters (with the high bit set) are printed as ‘M-’ (for meta) followed by the character for the low 7 bits",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/chmod.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/chmod.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "chmod",
	description: "Change file modes or Access Control Lists",
	args: [
		{
			name: "mode",
			suggestions: [
				// Some of the most common chmod's (non-exhaustive)
				{
					name: "u+x",
					type: "arg",
					description: "Give execute permission for the user",
					icon: "🔐",
				},
				{
					name: "a+rx",
					type: "arg",
					description: "Adds read and execute permissions for all classes",
					icon: "🔐",
				},
				{
					name: "744",
					type: "arg",
					description:
						"Sets read, write, and execute permissions for user, and sets read permission for Group and Others",
					icon: "🔐",
				},
				{
					name: "664",
					type: "arg",
					description:
						"Sets read and write permissions for user and Group, and provides read to Others",
					icon: "🔐",
				},
				{
					name: "777",
					type: "arg",
					description: "⚠️ allows all actions for all users",
					icon: "🔐",
				},
			],
		},
		{
			// Modifying
			template: "filepaths",
		},
	],

	options: [
		{
			name: "-f",
			description:
				"Do not display a diagnostic message if chmod could not modify the mode for file, nor modify the exit status to reflect such failures",
		},
		{
			name: "-H",
			description:
				"If the -R option is specified, symbolic links on the command line are followed and hence unaffected by the command.  (Symbolic links encountered during tree traversal are not followed.)",
		},
		{
			name: "-h",
			description:
				"If the file is a symbolic link, change the mode of the link itself rather than the file that the link points to",
		},
		{
			name: "-L",
			description:
				"If the -R option is specified, all symbolic links are followed",
		},
		{
			name: "-P",
			description:
				"If the -R option is specified, no symbolic links are followed. This is the default",
		},
		{
			name: "-R",
			description:
				"Change the modes of the file hierarchies rooted in the files, instead of just the files themselves. Beware of unintentionally matching the ``..'' hard link to the parent directory when using wildcards like ``.*''",
		},
		{
			name: "-v",
			description:
				"Cause chmod to be verbose, showing filenames as the mode is modified. If the -v flag is specified more than once, the old and new modes of the file will also be printed, in both octal and symbolic notation",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/chown.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/chown.ts

```typescript
export const existingUsersandGroups: Fig.Generator = {
	custom: async function (tokens, executeShellCommand) {
		const colonAdded = tokens.find((token) => token.includes(":"));
		const nFlagUsed = tokens.find((token) => /^-.*n.*/.test(token));

		let shell: string;
		// Using `:` as a trigger, check to see if a colon is added
		// in the current command. If it is, get the system groups
		// else retrieve the list of system users
		if (colonAdded) {
			const { stdout } = await executeShellCommand({
				command: "bash",
				args: [
					"-c",
					"dscl . -list /Groups PrimaryGroupID | tr -s ' '| sort -r",
				],
			});
			shell = stdout;
		} else {
			const { stdout } = await executeShellCommand({
				command: "bash",
				args: ["-c", "dscl . -list /Users UniqueID | tr -s ' '| sort -r"],
			});
			shell = stdout;
		}

		return (
			shell
				.split("\n")
				// The shell command retrieves a table
				// with rows that look like `user uid`
				// so each row is split again to get the
				// user/group and uid/gid
				.map((line) => line.split(" "))
				.map((value) => {
					return {
						// If the user has entered the option n
						// suggest the uid/gid instead of user/group
						name: nFlagUsed ? value[1] : value[0],
						description: colonAdded
							? `Group - ${nFlagUsed ? value[0] : `gid: ${value[1]}`}`
							: `User - ${nFlagUsed ? value[0] : `uid: ${value[1]}`}`,
						icon: colonAdded ? "👥" : "👤",
						priority: 90,
					};
				})
		);
	},
	trigger: ":",
	getQueryTerm: ":",
};

const completionSpec: Fig.Spec = {
	name: "chown",
	description:
		"Change the user and/or group ownership of a given file, directory, or symbolic link",
	args: [
		{
			name: "owner[:group] or :group",
			generators: existingUsersandGroups,
		},
		{
			name: "file/directory",
			isVariadic: true,
			template: ["filepaths", "folders"],
		},
	],
	options: [
		{
			name: "-f",
			description:
				"Don't report any failure to change file owner or group, nor modify the exit status to reflect such failures",
		},
		{
			name: "-h",
			description:
				"If the file is a symbolic link, change the user ID and/or the group ID of the link itself",
		},
		{
			name: "-n",
			description:
				"Interpret user ID and group ID as numeric, avoiding name lookups",
		},
		{
			name: "-v",
			description:
				"Cause chown to be verbose, showing files as the owner is modified",
		},
		{
			name: "-R",
			description:
				"Change the user ID and/or the group ID for the file hierarchies rooted in the files instead of just the files themselves",
		},
		{
			name: "-H",
			description:
				"If the -R option is specified, symbolic links on the command line are followed",
			exclusiveOn: ["-L", "-P"],
			dependsOn: ["-R"],
		},
		{
			name: "-L",
			description:
				"If the -R option is specified, all symbolic links are followed",
			exclusiveOn: ["-H", "-P"],
			dependsOn: ["-R"],
		},
		{
			name: "-P",
			description:
				"If the -R option is specified, no symbolic links are followed",
			exclusiveOn: ["-H", "-L"],
			dependsOn: ["-R"],
		},
	],
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/clear.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/clear.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "clear",
	description: "Clear the terminal screen",
	options: [
		{
			name: "-T",
			description: "Indicates the type of terminal",
			args: {
				name: "type",
			},
		},
		{
			name: "-V",
			description: "Reports version of ncurses used in this program, and exits",
		},
		{
			name: "-x",
			description:
				"Do not attempt to clear terminal's scrollback buffer using the extended E3 capability",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/cp.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/cp.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "cp",
	description: "Copy files and directories",
	args: [
		{
			name: "source",
			template: ["filepaths", "folders"],
			isVariadic: true,
		},
		{
			name: "target",
			template: ["filepaths", "folders"],
		},
	],
	options: [
		{
			name: "-a",
			description:
				"Preserves structure and attributes of files but not directory structure",
		},
		{
			name: "-f",
			description:
				"If the destination file cannot be opened, remove it and create a new file, without prompting for confirmation",
			exclusiveOn: ["-n"],
		},
		{
			name: "-H",
			description:
				"If the -R option is specified, symbolic links on the command line are followed",
			exclusiveOn: ["-L", "-P"],
			dependsOn: ["-R"],
		},
		{
			name: "-i",
			description:
				"Cause cp to write a prompt to the standard error output before copying a file that would overwrite an existing file",
			exclusiveOn: ["-n"],
		},
		{
			name: "-L",
			description:
				"If the -R option is specified, all symbolic links are followed",
			exclusiveOn: ["-H", "-P"],
			dependsOn: ["-R"],
		},
		{
			name: "-n",
			description: "Do not overwrite an existing file",
			exclusiveOn: ["-f", "-i"],
		},
		{
			name: "-P",
			description:
				"If the -R option is specified, no symbolic links are followed",
			exclusiveOn: ["-H", "-L"],
			dependsOn: ["-R"],
		},
		{
			name: "-R",
			description:
				"If source designates a directory, cp copies the directory and the entire subtree connected at that point. If source ends in a /, the contents of the directory are copied rather than the directory itself",
		},
		{
			name: "-v",
			description: "Cause cp to be verbose, showing files as they are copied",
		},
		{
			name: "-X",
			description: "Do not copy Extended Attributes (EAs) or resource forks",
		},
		{
			name: "-c",
			description: "Copy files using clonefile",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/curl.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/curl.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "curl",
	description: "Transfer a URL",
	args: { name: "URL", template: "history" },
	options: [
		{
			name: ["-a", "--append"],
			description: "Append to target file when uploading",
		},
		{
			name: ["-E", "--cert"],
			description: "Client certificate file and password",
			args: {
				name: "certificate[:password]",
				generators: {
					getQueryTerm: ":",
				},
			},
		},
		{
			name: ["-K", "--config"],
			description: "Read config from a file",
			args: { name: "file", template: "filepaths" },
		},
		{
			name: ["-C", "--continue-at"],
			description: "Resumed transfer offset",
			args: { name: "offset" },
		},
		{
			name: ["-b", "--cookie"],
			description: "Send cookies from string/file",
			args: { name: "data or filename", template: "filepaths" },
		},
		{
			name: ["-c", "--cookie-jar"],
			description: "Write cookies to <filename> after operation",
			args: { name: "filename", template: "filepaths" },
		},
		{
			name: ["-d", "--data"],
			description: "HTTP POST data",
			insertValue: "-d '{cursor}'",
			args: { name: "data" },
			isRepeatable: true,
		},
		{ name: ["-q", "--disable"], description: "Disable .curlrc" },
		{
			name: ["-D", "--dump-header"],
			description: "Write the received headers to <filename>",
			args: { name: "filename", template: "filepaths" },
		},
		{
			name: ["-f", "--fail"],
			description: "Fail silently (no output at all) on HTTP errors",
		},
		{
			name: ["-F", "--form"],
			description: "Specify multipart MIME data",
			args: { name: "content" },
			isRepeatable: true,
		},
		{
			name: ["-P", "--ftp-port"],
			description: "Use PORT instead of PASV",
			args: { name: "address" },
		},
		{
			name: ["-G", "--get"],
			description: "Put the post data in the URL and use GET",
		},
		{
			name: ["-g", "--globoff"],
			description: "Disable URL sequences and ranges using {} and []",
		},
		{ name: ["-I", "--head"], description: "Show document info only" },
		{
			name: ["-H", "--header"],
			description: "Pass custom header(s) to server",
			args: {
				name: "header/file",
				suggestions: [
					{ name: "Content-Type: application/json" },
					{ name: "Content-Type: application/x-www-form-urlencoded" },
				],
			},
		},
		{ name: ["-h", "--help"], description: "This help text" },
		{ name: ["-0", "--http1.0"], description: "Use HTTP 1.0" },
		{
			name: ["-i", "--include"],
			description: "Include protocol response headers in the output",
		},
		{
			name: ["-k", "--insecure"],
			description: "Allow insecure server connections when using SSL",
		},
		{ name: ["-4", "--ipv4"], description: "Resolve names to IPv4 addresses" },
		{ name: ["-6", "--ipv6"], description: "Resolve names to IPv6 addresses" },
		{
			name: ["-j", "--junk-session-cookies"],
			description: "Ignore session cookies read from file",
		},
		{ name: ["-l", "--list-only"], description: "List only mode" },
		{ name: ["-L", "--location"], description: "Follow redirects" },
		{ name: ["-M", "--manual"], description: "Display the full manual" },
		{
			name: ["-m", "--max-time"],
			description: "Maximum time allowed for the transfer",
			args: { name: "seconds" },
		},
		{
			name: ["-n", "--netrc"],
			description: "Must read .netrc for user name and password",
		},
		{
			name: ["-:", "--next"],
			description: "Make next URL use its separate set of options",
		},
		{
			name: ["-N", "--no-buffer"],
			description: "Disable buffering of the output stream",
		},
		{
			name: ["-o", "--output"],
			description: "Write to file instead of stdout",
			args: { name: "file", template: "filepaths" },
		},
		{
			name: ["-#", "--progress-bar"],
			description: "Display transfer progress as a bar",
		},
		{
			name: ["-x", "--proxy"],
			description: "[protocol://]host[:port] Use this proxy",
		},
		{
			name: ["-U", "--proxy-user"],
			description: "Proxy user and password",
			args: { name: "user:password" },
		},
		{
			name: ["-p", "--proxytunnel"],
			description: "Operate through an HTTP proxy tunnel (using CONNECT)",
		},
		{
			name: ["-Q", "--quote"],
			description: "Send command(s) to server before transfer",
		},
		{
			name: ["-r", "--range"],
			description: "Retrieve only the bytes within RANGE",
			args: { name: "range" },
		},
		{
			name: ["-e", "--referer"],
			description: "Referrer URL",
			args: { name: "URL" },
		},
		{
			name: ["-J", "--remote-header-name"],
			description: "Use the header-provided filename",
		},
		{
			name: ["-O", "--remote-name"],
			description: "Write output to a file named as the remote file",
		},
		{
			name: ["-R", "--remote-time"],
			description: "Set the remote file's time on the local output",
		},
		{
			name: ["-X", "--request"],
			description: "Specify request command to use",
			args: {
				name: "command",
				suggestions: [
					{ name: "GET" },
					{ name: "HEAD" },
					{ name: "POST" },
					{ name: "PUT" },
					{ name: "DELETE" },
					{ name: "CONNECT" },
					{ name: "OPTIONS" },
					{ name: "TRACE" },
					{ name: "PATCH" },
				],
			},
		},
		{
			name: ["-S", "--show-error"],
			description: "Show error even when -s is used",
		},
		{ name: ["-s", "--silent"], description: "Silent mode" },
		{
			name: ["-Y", "--speed-limit"],
			description: "Stop transfers slower than this",
			args: { name: "speed" },
		},
		{
			name: ["-y", "--speed-time"],
			description: "Trigger 'speed-limit' abort after this time",
			args: { name: "seconds" },
		},
		{ name: ["-2", "--sslv2"], description: "Use SSLv2" },
		{ name: ["-3", "--sslv3"], description: "Use SSLv3" },
		{
			name: ["-t", "--telnet-option"],
			description: "Set telnet option",
			args: { name: "val" },
		},
		{
			name: ["-z", "--time-cond"],
			description: "Transfer based on a time condition",
			args: { name: "time" },
		},
		{ name: ["-1", "--tlsv1"], description: "Use TLSv1.0 or greater" },
		{
			name: ["-T", "--upload-file"],
			description: "Transfer local FILE to destination",
			args: { name: "file", template: "filepaths" },
		},
		{ name: ["-B", "--use-ascii"], description: "Use ASCII/text transfer" },
		{
			name: ["-u", "--user"],
			description: "Server user and password",
			args: { name: "user:password" },
		},
		{
			name: ["-A", "--user-agent"],
			description: "Send User-Agent <name> to server",
			args: { name: "name" },
		},
		{
			name: ["-v", "--verbose"],
			description: "Make the operation more talkative",
		},
		{ name: ["-V", "--version"], description: "Show version number and quit" },
		{
			name: ["-w", "--write-out"],
			description: "Use output FORMAT after completion",
			args: { name: "format" },
		},
		{
			name: "--abstract-unix-socket",
			description: "Connect via abstract Unix domain socket",
			args: { name: "path" },
		},
		{
			name: "--alt-svc",
			description: "Name> Enable alt-svc with this cache file",
			args: { name: "file", template: "filepaths" },
		},
		{ name: "--anyauth", description: "Pick any authentication method" },
		{ name: "--basic", description: "Use HTTP Basic Authentication" },
		{
			name: "--cacert",
			description: "CA certificate to verify peer against",
			args: { name: "file", template: "filepaths" },
		},
		{
			name: "--capath",
			description: "CA directory to verify peer against",
			args: { name: "dir", template: "folders" },
		},
		{
			name: "--cert-status",
			description: "Verify the status of the server certificate",
		},
		{
			name: "--cert-type",
			description: "Certificate file type",
			args: {
				name: "type",
				suggestions: [{ name: "DER" }, { name: "PEM" }, { name: "ENG" }],
			},
		},
		{
			name: "--ciphers",
			description: "Of ciphers> SSL ciphers to use",
			args: { name: "list" },
		},
		{ name: "--compressed", description: "Request compressed response" },
		{ name: "--compressed-ssh", description: "Enable SSH compression" },
		{
			name: "--connect-timeout",
			description: "Maximum time allowed for connection",
			args: { name: "seconds" },
		},
		{
			name: "--connect-to",
			description: "Connect to host",
			args: { name: "HOST1:PORT1:HOST2:PORT2" },
		},
		{
			name: "--create-dirs",
			description: "Create necessary local directory hierarchy",
		},
		{ name: "--crlf", description: "Convert LF to CRLF in upload" },
		{
			name: "--crlfile",
			description: "Get a CRL list in PEM format from the given file",
			args: { name: "file", template: "filepaths" },
		},
		{
			name: "--data-ascii",
			description: "HTTP POST ASCII data",
			args: { name: "data" },
		},
		{
			name: "--data-binary",
			description: "HTTP POST binary data",
			args: { name: "data" },
		},
		{
			name: "--data-raw",
			description: "HTTP POST data, '@' allowed",
			args: { name: "data" },
		},
		{
			name: "--data-urlencode",
			description: "HTTP POST data url encoded",
			args: { name: "data" },
		},
		{
			name: "--delegation",
			description: "GSS-API delegation permission",
			args: { name: "LEVEL" },
		},
		{ name: "--digest", description: "Use HTTP Digest Authentication" },
		{ name: "--disable-eprt", description: "Inhibit using EPRT or LPRT" },
		{ name: "--disable-epsv", description: "Inhibit using EPSV" },
		{
			name: "--disallow-username-in-url",
			description: "Disallow username in url",
		},
		{
			name: "--dns-interface",
			description: "Interface to use for DNS requests",
			args: { name: "interface" },
		},
		{
			name: "--dns-ipv4-addr",
			description: "IPv4 address to use for DNS requests",
			args: { name: "address" },
		},
		{
			name: "--dns-ipv6-addr",
			description: "IPv6 address to use for DNS requests",
			args: { name: "address" },
		},
		{
			name: "--dns-servers",
			description: "DNS server addrs to use",
			args: { name: "addresses" },
		},
		{
			name: "--doh-url",
			description: "Resolve host names over DOH",
			args: { name: "URL" },
		},
		{
			name: "--egd-file",
			description: "EGD socket path for random data",
			args: { name: "file", template: "filepaths" },
		},
		{
			name: "--engine",
			description: "Crypto engine to use",
			args: { name: "name" },
		},
		{
			name: "--etag-compare",
			description:
				"Make a conditional HTTP request for the ETag read from the given file",
			args: { name: "file" },
		},
		{
			name: "--etag-save",
			description: "Save an HTTP ETag to the specified file",
			args: { name: "file" },
		},
		{
			name: "--expect100-timeout",
			description: "How long to wait for 100-continue",
			args: { name: "seconds" },
		},
		{
			name: "--fail-early",
			description: "Fail on first transfer error, do not continue",
		},
		{
			name: "--fail-with-body",
			description:
				"On HTTP errors, return an error and also output any HTML response",
		},
		{ name: "--false-start", description: "Enable TLS False Start" },
		{
			name: "--form-string",
			description: "Specify multipart MIME data",
			args: { name: "string" },
		},
		{
			name: "--ftp-account",
			description: "Account data string",
			args: { name: "data" },
		},
		{
			name: "--ftp-alternative-to-user",
			description: "String to replace USER [name]",
			args: { name: "command" },
		},
		{
			name: "--ftp-create-dirs",
			description: "Create the remote dirs if not present",
		},
		{
			name: "--ftp-method",
			description: "Control CWD usage",
			args: { name: "method" },
		},
		{ name: "--ftp-pasv", description: "Use PASV/EPSV instead of PORT" },
		{ name: "--ftp-pret", description: "Send PRET before PASV" },
		{ name: "--ftp-skip-pasv-ip", description: "Skip the IP address for PASV" },
		{ name: "--ftp-ssl-ccc", description: "Send CCC after authenticating" },
		{
			name: "--ftp-ssl-ccc-mode",
			description: "Set CCC mode",
			args: {
				name: "mode",
				suggestions: [{ name: "active" }, { name: "passive" }],
			},
		},
		{
			name: "--ftp-ssl-control",
			description: "Require SSL/TLS for FTP login, clear for transfer",
		},
		{
			name: "--happy-eyeballs-timeout-ms",
			description:
				"How long to wait in milliseconds for IPv6 before trying IPv4",
			args: { name: "milliseconds" },
		},
		{
			name: "--haproxy-protocol",
			description: "Send HAProxy PROXY protocol v1 header",
		},
		{
			name: "--hostpubmd5",
			description: "Acceptable MD5 hash of the host public key",
			args: { name: "md5" },
		},
		{ name: "--http0.9", description: "Allow HTTP 0.9 responses" },
		{ name: "--http1.1", description: "Use HTTP 1.1" },
		{ name: "--http2", description: "Use HTTP 2" },
		{
			name: "--http2-prior-knowledge",
			description: "Use HTTP 2 without HTTP/1.1 Upgrade",
		},
		{
			name: "--ignore-content-length",
			description: "Ignore the size of the remote resource",
		},
		{
			name: "--interface",
			description: "Use network INTERFACE (or address)",
			args: { name: "name" },
		},
		{
			name: "--keepalive-time",
			description: "Interval time for keepalive probes",
			args: { name: "seconds" },
		},
		{
			name: "--key",
			description: "Private key file name",
			args: { name: "key" },
		},
		{
			name: "--key-type",
			description: "Private key file type",
			args: {
				name: "type",
				suggestions: [{ name: "DER" }, { name: "PEM" }, { name: "ENG" }],
			},
		},
		{
			name: "--krb",
			description: "Enable Kerberos with security <level>",
			args: { name: "level" },
		},
		{
			name: "--libcurl",
			description: "Dump libcurl equivalent code of this command line",
			args: { name: "file", template: "filepaths" },
		},
		{
			name: "--limit-rate",
			description: "Limit transfer speed to RATE",
			args: { name: "speed" },
		},
		{
			name: "--local-port",
			description: "Force use of RANGE for local port numbers",
			args: { name: "num/range" },
		},
		{
			name: "--location-trusted",
			description: "Like --location, and send auth to other hosts",
		},
		{
			name: "--login-options",
			description: "Server login options",
			args: { name: "options" },
		},
		{
			name: "--mail-auth",
			description: "Originator address of the original email",
			args: { name: "address" },
		},
		{
			name: "--mail-from",
			description: "Mail from this address",
			args: { name: "address" },
		},
		{
			name: "--mail-rcpt",
			description: "Mail to this address",
			args: { name: "address" },
		},
		{
			name: "--max-filesize",
			description: "Maximum file size to download",
			args: { name: "bytes" },
		},
		{
			name: "--max-redirs",
			description: "Maximum number of redirects allowed",
			args: { name: "num" },
		},
		{
			name: "--metalink",
			description: "Process given URLs as metalink XML file",
		},
		{
			name: "--negotiate",
			description: "Use HTTP Negotiate (SPNEGO) authentication",
		},
		{
			name: "--netrc-file",
			description: "Specify FILE for netrc",
			args: { name: "filename", template: "filepaths" },
		},
		{ name: "--netrc-optional", description: "Use either .netrc or URL" },
		{ name: "--no-alpn", description: "Disable the ALPN TLS extension" },
		{
			name: "--no-keepalive",
			description: "Disable TCP keepalive on the connection",
		},
		{ name: "--no-npn", description: "Disable the NPN TLS extension" },
		{ name: "--no-sessionid", description: "Disable SSL session-ID reusing" },
		{
			name: "--noproxy",
			description: "List of hosts which do not use proxy",
			args: { name: "no-proxy-list" },
		},
		{ name: "--ntlm", description: "Use HTTP NTLM authentication" },
		{
			name: "--ntlm-wb",
			description: "Use HTTP NTLM authentication with winbind",
		},
		{
			name: "--oauth2-bearer",
			description: "OAuth 2 Bearer Token",
			args: { name: "token" },
		},
		{
			name: "--pass",
			description: "Pass phrase for the private key",
			args: { name: "phrase" },
		},
		{
			name: "--path-as-is",
			description: "Do not squash .. sequences in URL path",
		},
		{
			name: "--pinnedpubkey",
			description: "FILE/HASHES Public key to verify peer against",
			args: { name: "hashes" },
		},
		{
			name: "--post301",
			description: "Do not switch to GET after following a 301",
		},
		{
			name: "--post302",
			description: "Do not switch to GET after following a 302",
		},
		{
			name: "--post303",
			description: "Do not switch to GET after following a 303",
		},
		{
			name: "--preproxy",
			description: "[protocol://]host[:port] Use this proxy first",
		},
		{
			name: "--proto",
			description: "Enable/disable PROTOCOLS",
			args: { name: "protocols" },
		},
		{
			name: "--proto-default",
			description: "Use PROTOCOL for any URL missing a scheme",
			args: { name: "protocol" },
		},
		{
			name: "--proto-redir",
			description: "Enable/disable PROTOCOLS on redirect",
			args: { name: "protocols" },
		},
		{
			name: "--proxy-anyauth",
			description: "Pick any proxy authentication method",
		},
		{
			name: "--proxy-basic",
			description: "Use Basic authentication on the proxy",
		},
		{
			name: "--proxy-cacert",
			description: "CA certificate to verify peer against for proxy",
			args: { name: "file", template: "filepaths" },
		},
		{
			name: "--proxy-capath",
			description: "CA directory to verify peer against for proxy",
			args: { name: "dir", template: "folders" },
		},
		{
			name: "--proxy-cert",
			description: "Set client certificate for proxy",
			args: { name: "cert[:passwd]" },
		},
		{
			name: "--proxy-cert-type",
			description: "Client certificate type for HTTPS proxy",
			args: { name: "type" },
		},
		{
			name: "--proxy-ciphers",
			description: "SSL ciphers to use for proxy",
			args: { name: "list" },
		},
		{
			name: "--proxy-crlfile",
			description: "Set a CRL list for proxy",
			args: { name: "file", template: "filepaths" },
		},
		{
			name: "--proxy-digest",
			description: "Use Digest authentication on the proxy",
		},
		{
			name: "--proxy-header",
			description: "Pass custom header(s) to proxy",
			args: {
				name: "header/file",
				suggestions: [
					{ name: "Content-Type: application/json" },
					{ name: "Content-Type: application/x-www-form-urlencoded" },
				],
			},
		},
		{
			name: "--proxy-insecure",
			description: "Do HTTPS proxy connections without verifying the proxy",
		},
		{
			name: "--proxy-key",
			description: "Private key for HTTPS proxy",
			args: { name: "key" },
		},
		{
			name: "--proxy-key-type",
			description: "Private key file type for proxy",
			args: { name: "type" },
		},
		{
			name: "--proxy-negotiate",
			description: "Use HTTP Negotiate (SPNEGO) authentication on the proxy",
		},
		{
			name: "--proxy-ntlm",
			description: "Use NTLM authentication on the proxy",
		},
		{
			name: "--proxy-pass",
			description: "Pass phrase for the private key for HTTPS proxy",
			args: { name: "phrase" },
		},
		{
			name: "--proxy-pinnedpubkey",
			description: "FILE/HASHES public key to verify proxy with",
			args: { name: "hashes" },
		},
		{
			name: "--proxy-service-name",
			description: "SPNEGO proxy service name",
			args: { name: "name" },
		},
		{
			name: "--proxy-ssl-allow-beast",
			description: "Allow security flaw for interop for HTTPS proxy",
		},
		{
			name: "--proxy-tls13-ciphers",
			description: "List> TLS 1.3 proxy cipher suites",
			args: { name: "ciphersuite" },
		},
		{
			name: "--proxy-tlsauthtype",
			description: "TLS authentication type for HTTPS proxy",
			args: { name: "type" },
		},
		{
			name: "--proxy-tlspassword",
			description: "TLS password for HTTPS proxy",
			args: { name: "string" },
		},
		{
			name: "--proxy-tlsuser",
			description: "TLS username for HTTPS proxy",
			args: { name: "name" },
		},
		{ name: "--proxy-tlsv1", description: "Use TLSv1 for HTTPS proxy" },
		{
			name: "--proxy1.0",
			description: "Use HTTP/1.0 proxy on given port",
			args: { name: "host[:port]" },
		},
		{
			name: "--pubkey",
			description: "SSH Public key file name",
			args: { name: "key", template: "filepaths" },
		},
		{
			name: "--random-file",
			description: "File for reading random data from",
			args: { name: "file", template: "filepaths" },
		},
		{ name: "--raw", description: 'Do HTTP "raw"; no transfer decoding' },
		{
			name: "--remote-name-all",
			description: "Use the remote file name for all URLs",
		},
		{
			name: "--request-target",
			description: "Specify the target for this request",
		},
		{
			name: "--resolve",
			description: "Resolve the host+port to this address",
			args: { name: "host:port:address[,address]..." },
		},
		{
			name: "--retry",
			description: "Retry request if transient problems occur",
			args: { name: "num" },
		},
		{
			name: "--retry-connrefused",
			description: "Retry on connection refused (use with --retry)",
		},
		{
			name: "--retry-delay",
			description: "Wait time between retries",
			args: { name: "seconds" },
		},
		{
			name: "--retry-max-time",
			description: "Retry only within this period",
			args: { name: "seconds" },
		},
		{
			name: "--sasl-ir",
			description: "Enable initial response in SASL authentication",
		},
		{
			name: "--service-name",
			description: "SPNEGO service name",
			args: { name: "name" },
		},
		{
			name: "--socks4",
			description: "SOCKS4 proxy on given host + port",
			args: { name: "host[:port]" },
		},
		{
			name: "--socks4a",
			description: "SOCKS4a proxy on given host + port",
			args: { name: "host[:port]" },
		},
		{
			name: "--socks5",
			description: "SOCKS5 proxy on given host + port",
			args: { name: "host[:port]" },
		},
		{
			name: "--socks5-basic",
			description: "Enable username/password auth for SOCKS5 proxies",
		},
		{
			name: "--socks5-gssapi",
			description: "Enable GSS-API auth for SOCKS5 proxies",
		},
		{
			name: "--socks5-gssapi-nec",
			description: "Compatibility with NEC SOCKS5 server",
		},
		{
			name: "--socks5-gssapi-service",
			description: "SOCKS5 proxy service name for GSS-API",
			args: { name: "name" },
		},
		{
			name: "--socks5-hostname",
			description: "SOCKS5 proxy, pass host name to proxy",
			args: { name: "host[:port]" },
		},
		{ name: "--ssl", description: "Try SSL/TLS" },
		{
			name: "--ssl-auto-client-cert",
			description: "Obtain and use a client certificate automatically",
		},
		{
			name: "--ssl-allow-beast",
			description: "Allow security flaw to improve interop",
		},
		{
			name: "--ssl-no-revoke",
			description: "Disable cert revocation checks (Schannel)",
		},
		{ name: "--ssl-reqd", description: "Require SSL/TLS" },
		{ name: "--stderr", description: "Where to redirect stderr" },
		{
			name: "--styled-output",
			description: "Enable styled output for HTTP headers",
		},
		{
			name: "--suppress-connect-headers",
			description: "Suppress proxy CONNECT response headers",
		},
		{ name: "--tcp-fastopen", description: "Use TCP Fast Open" },
		{ name: "--tcp-nodelay", description: "Use the TCP_NODELAY option" },
		{
			name: "--tftp-blksize",
			description: "Set TFTP BLKSIZE option",
			args: { name: "value" },
		},
		{ name: "--tftp-no-options", description: "Do not send any TFTP options" },
		{
			name: "--tls-max",
			description: "Set maximum allowed TLS version",
			args: { name: "VERSION" },
		},
		{
			name: "--tls13-ciphers",
			description: "Of TLS 1.3 ciphersuites> TLS 1.3 cipher suites to use",
			args: { name: "list" },
		},
		{
			name: "--tlsauthtype",
			description: "TLS authentication type",
			args: { name: "type" },
		},
		{ name: "--tlspassword", description: "TLS password" },
		{ name: "--tlsuser", description: "TLS user name", args: { name: "name" } },
		{ name: "--tlsv1.0", description: "Use TLSv1.0 or greater" },
		{ name: "--tlsv1.1", description: "Use TLSv1.1 or greater" },
		{ name: "--tlsv1.2", description: "Use TLSv1.2 or greater" },
		{ name: "--tlsv1.3", description: "Use TLSv1.3 or greater" },
		{
			name: "--tr-encoding",
			description: "Request compressed transfer encoding",
		},
		{
			name: "--trace",
			description: "Write a debug trace to FILE",
			args: { name: "file", template: "filepaths" },
		},
		{
			name: "--trace-ascii",
			description: "Like --trace, but without hex output",
			args: { name: "file", template: "filepaths" },
		},
		{
			name: "--trace-time",
			description: "Add time stamps to trace/verbose output",
		},
		{
			name: "--unix-socket",
			description: "Connect through this Unix domain socket",
			args: { name: "path" },
		},
		{ name: "--url", description: "URL to work with", args: { name: "url" } },
		{
			name: "--xattr",
			description: "Store metadata in extended file attributes",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/cut.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/cut.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "cut",
	description: "Cut out selected portions of each line of a file",
	args: {
		template: "filepaths",
		isOptional: true,
		isVariadic: true,
	},
	options: [
		{
			name: "-b",
			description: "Byte positions as a comma or - separated list of numbers",
			args: {
				name: "list",
				description: "Specifies byte positions",
			},
		},
		{
			name: "-c",
			description: "Column positions as a comma or - separated list of numbers",
			args: {
				name: "list",
				description: "Specifies column positions",
			},
		},
		{
			name: "-f",
			description: "Field positions as a comma or - separated list of numbers",
			args: {
				name: "list",
				description: "Specifies column positions",
			},
		},
		{
			name: "-n",
			description: "Do not split multi-byte characters",
		},
		{
			name: "-d",
			description:
				"Use delim as the field delimiter character instead of the tab character",
			args: {
				name: "delim",
				description: "Field deliminator to use instead of the tab character",
				isOptional: true,
			},
		},
		{
			name: "-s",
			description:
				"Suppress lines with no field delimiter characters.  unless specified, lines with no delimiters are passed through unmodified",
		},
		{
			name: "-w",
			description:
				"Use whitespace (spaces and tabs) as the delimiter.  Consecutive spaces and tabs count as one single field separator",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/date.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/date.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "date",
	description: "Display or set date and time",
	options: [
		{
			name: "-d",
			description: "Set the kernel's value for daylight saving time",
			args: {
				name: "dst",
			},
		},
		{
			name: "-f",
			description:
				"Use specified format for input instead of the default [[[mm]dd]HH]MM[[cc]yy][.ss] format",
			args: [
				{
					name: "input_fmt",
					description: "The format with which to parse the new date value",
				},
				{
					name: "new_date",
					description: "The new date to set",
				},
			],
		},
		{
			name: "-j",
			description: "Don't try to set the date",
		},
		{
			name: "-n",
			description:
				"Only set time on the current machine, instead of all machines in the local group",
		},
		{
			name: "-R",
			description: "Use RFC 2822 date and time output format",
		},
		{
			name: "-r",
			description:
				"Print the date and time represented by the specified number of seconds since the Epoch",
			args: {
				name: "seconds",
				description:
					"Number of seconds since the Epoch (00:00:00 UTC, January 1, 1970)",
			},
		},
		{
			name: "-t",
			description: "Set the system's value for minutes west of GMT",
			args: {
				name: "minutes_west",
			},
		},
		{
			name: "-u",
			description:
				"Display or set the date in UTC (Coordinated Universal) time",
		},
		{
			name: "-v",
			description:
				"Adjust and print (but don't set) the second, minute, hour, month day, week day, month, or year according to val",
			args: {
				name: "val",
				description: "[+|-]val[ymwdHMS]",
			},
		},
	],
	args: {
		name: "new_time OR output_fmt",
		description:
			"New_time: [[[mm]dd]HH]MM[[cc]yy][.ss], output_fmt: '+' followed by user-defined format string",
		isOptional: true,
		isDangerous: true,
	},
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/dd.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/dd.ts

```typescript
const convValues: Fig.Suggestion[] = [
	{
		name: "ascii",
		icon: "fig://icon?type=string",
		description:
			"The same as 'unblock' except characters are translated from EBCDIC to ASCII",
	},
	{
		name: "oldascii",
		icon: "fig://icon?type=string",
		description:
			"The same as 'unblock' except characters are translated from EBCDIC to ASCII",
	},
	{
		name: "block",
		icon: "fig://icon?type=string",
		description:
			"Treats the input as a sequence of newline or EOF-terminated variable length records of independent input and output block boundaries",
	},
	{
		name: "ebcdic",
		icon: "fig://icon?type=string",
		description:
			"The same as the 'block' value except that characters are translated from ASCII to EBCDIC after the records are converted",
	},
	{
		name: "ibm",
		icon: "fig://icon?type=string",
		description:
			"The same as the 'block' value except that characters are translated from ASCII to EBCDIC after the records are converted",
	},
	{
		name: "oldebcdic",
		icon: "fig://icon?type=string",
		description:
			"The same as the 'block' value except that characters are translated from ASCII to EBCDIC after the records are converted",
	},
	{
		name: "oldibm",
		icon: "fig://icon?type=string",
		description:
			"The same as the 'block' value except that characters are translated from ASCII to EBCDIC after the records are converted",
	},
	{
		name: "lcase",
		icon: "fig://icon?type=string",
		description: "Transform uppercase characters into lowercase characters",
	},
	{
		name: "noerror",
		icon: "fig://icon?type=string",
		description: "Do not stop processing on an input error",
	},
	{
		name: "notrunc",
		icon: "fig://icon?type=string",
		description:
			"Do not truncate the output file. This will preserve any blocks in the output file not explicitly written by dd",
	},
	{
		name: "osync",
		icon: "fig://icon?type=string",
		description: "Pad the final output block to the full output block size",
	},
	{
		name: "sparse",
		icon: "fig://icon?type=string",
		description:
			"If one or more output blocks would consist solely of NUL bytes, try to seek the output file by the required space instead of filling them with NULs, resulting in a sparse file",
	},
	{
		name: "swab",
		icon: "fig://icon?type=string",
		description: "Swap every pair of input bytes",
	},
	{
		name: "sync",
		icon: "fig://icon?type=string",
		description: "Pad every input block to the input buffer size",
	},
	{
		name: "ucase",
		icon: "fig://icon?type=string",
		description: "Transform lowercase characters into uppercase characters",
	},
	{
		name: "unblock",
		icon: "fig://icon?type=string",
		description:
			"Treats the input as a sequence of fixed length records independent of input and output block boundaries",
	},
];

const completionSpec: Fig.Spec = {
	name: "dd",
	description: "Convert and copy a file",
	parserDirectives: {
		flagsArePosixNoncompliant: true,
	},
	// dd has "operands", which are most closely modeled as options in a Fig spec.
	// Asterisk *feels* a lot better than the default option icon here.
	options: [
		{
			name: "bs",
			icon: "fig://icon?type=asterisk",
			description: "Set input and output block size",
			requiresSeparator: true,
			args: {
				name: "size",
			},
		},
		{
			name: "cbs",
			icon: "fig://icon?type=asterisk",
			description: "Set the conversion record size",
			requiresSeparator: true,
			args: {
				name: "size",
			},
		},
		{
			name: "count",
			icon: "fig://icon?type=asterisk",
			description: "Copy this many input blocks",
			requiresSeparator: true,
			args: {
				name: "number",
			},
		},
		{
			name: "files",
			icon: "fig://icon?type=asterisk",
			description: "Copy this many files before terminating",
			requiresSeparator: true,
			args: {
				name: "number",
			},
		},
		{
			name: "ibs",
			icon: "fig://icon?type=asterisk",
			description: "Set the input block size",
			requiresSeparator: true,
			args: {
				name: "size",
				default: "512",
			},
		},
		{
			name: "if",
			icon: "fig://icon?type=asterisk",
			description: "Read an input file instead of stdin",
			requiresSeparator: true,
			priority: 60,
			args: {
				name: "file",
				template: "filepaths",
			},
		},
		{
			name: "iseek",
			icon: "fig://icon?type=asterisk",
			description: "Seek this many blocks on the input file",
			requiresSeparator: true,
			args: {
				name: "blocks",
			},
		},
		{
			name: "obs",
			icon: "fig://icon?type=asterisk",
			description: "Set the output block size",
			requiresSeparator: true,
			args: {
				name: "size",
				default: "512",
			},
		},
		{
			name: "of",
			icon: "fig://icon?type=asterisk",
			description: "Write to an output file instead of stdout",
			requiresSeparator: true,
			priority: 59,
			args: {
				name: "file",
				template: "filepaths",
				suggestCurrentToken: true,
			},
		},
		{
			name: "oseek",
			icon: "fig://icon?type=asterisk",
			description: "Seek this many blocks on the output file",
			requiresSeparator: true,
			args: {
				name: "blocks",
			},
		},
		{
			name: "seek",
			icon: "fig://icon?type=asterisk",
			description:
				"Seek this many blocks from the beginning of the output before copying",
			requiresSeparator: true,
			args: {
				name: "blocks",
			},
		},
		{
			name: "skip",
			icon: "fig://icon?type=asterisk",
			description:
				"Skip this many blocks from the beginning of the input before copying",
			requiresSeparator: true,
			args: {
				name: "blocks",
			},
		},
		{
			name: "conv",
			icon: "fig://icon?type=asterisk",
			description: "Convert input data (comma-separated list)",
			requiresSeparator: true,
			args: {
				name: "value",
				generators: {
					getQueryTerm: ",",
					custom: async () => convValues,
				},
			},
		},
	],
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/df.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/df.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "df",
	description: "Display free disk space",
	args: {
		name: "file or filesystem",
	},
	options: [
		{
			name: "-a",
			description: "Show all mount points",
		},
		{
			name: ["-b", "-P"],
			description: "Use 512-byte blocks (default)",
			exclusiveOn: ["-g", "-k", "-m"],
		},
		{
			name: "-g",
			description: "Use 1073741824-byte (1-Gbyte) blocks",
			exclusiveOn: ["-b", "-P", "-m", "-k"],
		},
		{
			name: "-m",
			description: "Use 1048576-byte (1-Mbyte) blocks",
			exclusiveOn: ["-b", "-P", "-g", "-k"],
		},
		{
			name: "-k",
			description: "Use 1024-byte (1-Kbyte) blocks",
			exclusiveOn: ["-b", "-P", "-g", "-m"],
		},
		{
			name: "-H",
			description: '"Human-readable" output, uses base 10 unit suffixes',
			exclusiveOn: ["-h"],
		},
		{
			name: "-h",
			description: '"Human-readable" output, uses base 2 unit suffixes',
			exclusiveOn: ["-H"],
		},
		{
			name: "-i",
			description: "Include the number of free inodes",
		},
		{
			name: "-l",
			description: "Only display information about locally-mounted filesystems",
		},
		{
			name: "-n",
			description: "Print out the previously obtained statistics",
		},
		{
			name: "-T",
			description:
				"Only print out statistics for filesystems of the specified types (comma separated)",
			args: {
				name: "filesystem",
			},
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

````
