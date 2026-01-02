---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 84
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 84 of 552)

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

---[FILE: extensions/terminal-suggest/src/completions/upstream/echo.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/echo.ts

```typescript
const environmentVariableGenerator: Fig.Generator = {
	custom: async (tokens, _, context) => {
		if (tokens.length < 3 || tokens[tokens.length - 1].startsWith("$")) {
			return Object.keys(context.environmentVariables).map((suggestion) => ({
				name: `$${suggestion}`,
				type: "arg",
				description: "Environment Variable",
			}));
		} else {
			return [];
		}
	},
	trigger: "$",
};

const completionSpec: Fig.Spec = {
	name: "echo",
	description: "Write arguments to the standard output",
	args: {
		name: "string",
		isVariadic: true,
		optionsCanBreakVariadicArg: false,
		suggestCurrentToken: true,
		generators: environmentVariableGenerator,
	},
	options: [
		{
			name: "-n",
			description: "Do not print the trailing newline character",
		},
		{
			name: "-e",
			description: "Interpret escape sequences",
		},
		{
			name: "-E",
			description: "Disable escape sequences",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/env.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/env.ts

```typescript
const environmentVariables: Fig.Generator = {
	custom: async (_tokens, _executeCommand, generatorContext) => {
		return Object.values(generatorContext.environmentVariables).map(
			(envVar) => ({
				name: envVar,
				description: "Environment variable",
				icon: "🌎",
			})
		);
	},
};

const completionSpec: Fig.Spec = {
	name: "env",
	description: "Set environment and execute command, or print environment",
	options: [
		{
			name: "-0",
			description: "End each output line with NUL, not newline",
		},
		{
			name: ["-i", "-"],
			description: "Start with an empty environment",
		},
		{
			name: "-v",
			description: "Print verbose logs",
		},
		{
			name: "-u",
			description: "Remove variable from the environment",
			args: {
				name: "name",
				generators: environmentVariables,
			},
		},
		{
			name: "-P",
			description:
				"Search the given directories for the utility, rather than the PATH",
			args: {
				name: "altpath",
				template: "folders",
			},
		},
		{
			name: "-S",
			description: "Split the given string into separate arguments",
			args: {
				name: "string",
			},
		},
	],
	// Only uncomment if env takes an argument
	args: [
		{
			name: "name=value ...",
			description: "Set environment variables",
			isOptional: true,
		},
		{
			name: "utility",
			description: "Utility to run",
			isOptional: true,
			isCommand: true,
		},
	],
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/export.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/export.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "export",
	description: "Export variables",
	hidden: true,
	args: {
		isVariadic: true,
	},
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/fdisk.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/fdisk.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "fdisk",
	description: "Manipulate disk partition table",
	options: [
		{
			name: ["--help", "-h"],
			description: "Show help for fdisk",
		},
		{
			name: ["--version", "-V"],
			description: "Show version for lsblk",
		},
		{
			name: ["--sector-size", "-b"],
			description: "Specify the sector size of the disk",
			args: {
				name: "mode",
				description: "Valid values are 512, 1024, 2048, and 4096",
				suggestions: ["512", "1024", "2048", "4096"],
			},
		},
		{
			name: ["--protect-boot", "-B"],
			description:
				"Don't erase the beginning of the first disk sector when creating a new disk label",
		},
		{
			name: ["--compatibility", "-c"],
			description: "Specify the compatibility mode, 'dos' or 'nondos'",
			args: {
				name: "mode",
				isOptional: true,
				suggestions: ["dos", "nondos"],
			},
		},
		{
			name: ["--color", "-L"],
			description: "Colorize the output",
			args: {
				name: "when",
				isOptional: true,
				suggestions: ["always", "never", "auto"],
			},
		},
		{
			name: ["--list", "-l"],
			description:
				"List the partition tables for the specified devices and then exit",
		},
		{
			name: ["--list-details", "-x"],
			description: "Like --list, but provides more details",
		},
		{
			name: "--lock",
			description: "Use exclusive BSD lock for device or file it operates",
			args: {
				name: "mode",
				description:
					"Optional argument mode can be yes, no (or 1 and 0) or nonblock",
				isOptional: true,
				suggestions: ["yes", "no", "nonblock"],
			},
		},
		{
			name: ["--noauto-pt", "-n"],
			description:
				"Don't automatically create a default partition table on empty device",
		},
		{
			name: ["--output", "-o"],
			description: "Desc",
			args: {
				name: "list",
			},
		},
		{
			name: ["--getsz", "-s"],
			description:
				"Print the size in 512-byte sectors of each given block device. This option is DEPRECATED in favour of blockdev(8)",
			deprecated: {
				description: "This option is DEPRECATED in favour of blockdev(8)",
			},
		},
		{
			name: ["--type", "-t"],
			description:
				"Enable support only for disklabels of the specified type, and disable support for all other types",
			args: {
				name: "type",
			},
		},
		{
			name: ["--units", "-u"],
			description:
				"When listing partition tables, show sizes in 'sectors' or in 'cylinders'",
			args: {
				name: "unit",
				isOptional: true,
				suggestions: ["sectors", "cylinders"],
			},
		},
		{
			name: ["--cylinders", "-C"],
			description: "Specify the number of cylinders of the disk",
			args: {
				name: "number",
			},
		},
		{
			name: ["--heads", "-H"],
			description:
				"Specify the number of heads of the disk. (Not the physical number, of course, but the number used for partition tables.)",
			args: {
				name: "number",
			},
		},
		{
			name: ["--sectors", "-S"],
			description:
				"Specify the number of sectors per track of the disk. (Not the physical number, of course, but the number used for partition tables.)",
		},
		{
			name: ["--wipe", "-w"],
			description:
				"Wipe filesystem, RAID and partition-table signatures from the device, in order to avoid possible collisions",
			args: {
				name: "when",
				description: "The argument when can be auto, never or always",
				suggestions: ["auto", "never", "always"],
			},
		},
		{
			name: ["--wipe-partitions", "-W"],
			description:
				"Wipe filesystem, RAID and partition-table signatures from a newly created partitions, in order to avoid possible collisions",
			args: {
				name: "when",
				description: "The argument when can be auto, never or always",
			},
		},
	],
	args: {
		name: "device",
		description: "Device to list",
		isOptional: true,
		template: "filepaths",
	},
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/find.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/find.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "find",
	description: "Walk a file hierarchy",
	args: [
		{
			name: "path",
			isOptional: true,
			isVariadic: true,
			template: ["folders"],
		},
		{
			// TODO Suggestions for primaries and operands. See `man find`
			name: "expression",
			description: "Composition of primaries and operands",
			isOptional: true,
			isVariadic: true,
		},
	],
	options: [
		{
			name: "-E",
			description:
				"Interpret regular expressions followed by -regex and -iregex primaries as extended",
		},
		{
			name: "-H",
			description:
				"Cause the file information and file type returned for each symbolic link specified to be those referenced by the link",
			exclusiveOn: ["-L", "-P"],
		},
		{
			name: "-L",
			description:
				"Cause the file information and file type returned for each symbolic link to be those of the file referenced by the link",
			exclusiveOn: ["-H", "-P"],
		},
		{
			name: "-P",
			description:
				"Cause the file information and file type returned for each symbolic link to be those for the link itself",
			exclusiveOn: ["-H", "-L"],
		},
		{
			name: "-X",
			description: "Permit find to be safely used in conjunction with xargs",
		},
		{
			name: "-d",
			description: "Cause find to perform a depth-first traversal",
		},
		{
			name: "-f",
			description: "Specify a file hierarch for find to traverse",
			args: {
				name: "path",
			},
		},
		{
			name: "-s",
			description:
				"Cause find to traverse the file hierarchies in lexicographical order",
		},
		{
			name: "-x",
			description:
				"Prevent find from descending into directories that have a device number different than that of the file from which the descent began",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/fmt.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/fmt.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "fmt",
	description: "Simple text formatter",
	parserDirectives: {
		optionsMustPrecedeArguments: true,
	},
	options: [
		{
			name: "-c",
			description: `Center the text, line by line.  In this case, most of the other
options are ignored; no splitting or joining of lines is done`,
		},
		{
			name: "-m",
			description: `Try to format mail header lines contained in the input
sensibly`,
		},
		{
			name: "-n",
			description: `Format lines beginning with a ‘.’ (dot) character`,
		},
		{
			name: "-p",
			description: `Allow indented paragraphs.  Without the -p flag, any change in
the amount of whitespace at the start of a line results in a
new paragraph being begun`,
		},
		{
			name: "-s",
			description: `Collapse whitespace inside lines, so that multiple whitespace
characters are turned into a single space.  (Or, at the end of
a sentence, a double space.)`,
		},
		{
			name: "-d",
			description: `Treat the chars (and no others) as sentence-ending characters.
By default the sentence-ending characters are full stop (‘.’),
question mark (‘?’) and exclamation mark (‘!’).  Remember that
some characters may need to be escaped to protect them from
your shell`,
			args: {
				name: "chars",
				suggestions: [".", "?", "!"],
				default: ".",
			},
		},
		{
			name: "-l",
			description: `Replace multiple spaces with tabs at the start of each output
line, if possible.  Each number spaces will be replaced with
one tab.  The default is 8.  If number is 0, spaces are
preserved`,
			args: {
				name: "number",
				suggestions: ["8"],
				default: "8",
			},
		},
		{
			name: "-t",
			description: `Assume that the input files' tabs assume number spaces per tab
stop.  The default is 8`,
			args: {
				name: "number",
				suggestions: ["8"],
				default: "8",
			},
		},
	],
	args: {
		name: "file",
		description: "File(s) to format",
		isOptional: true,
		isVariadic: true,
		template: "filepaths",
	},
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/fold.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/fold.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "fold",
	description: "Fold long lines for finite width output device",
	parserDirectives: {
		optionsMustPrecedeArguments: true,
	},
	options: [
		{
			name: "-b",
			description: `Count width in bytes rather than column positions`,
		},
		{
			name: "-s",
			description: `Fold line after the last blank character within the first width
column positions (or bytes)`,
		},
		{
			name: "-w",
			description: `Specify a line width to use instead of the default 80 columns.
The width value should be a multiple of 8 if tabs are present,
or the tabs should be expanded using expand(1) before using
fold`,
			args: {
				name: "width",
				suggestions: ["80", "90", "100", "110", "120"],
				default: "80",
			},
		},
	],
	args: {
		name: "file",
		description: "File(s) to fold",
		isOptional: true,
		isVariadic: true,
		template: "filepaths",
	},
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/go.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/go.ts

```typescript
const buildModeSuggestions: Fig.Suggestion[] = [
	{
		name: "archive",
		description: "Build the listed non-main packages into .a files",
	},
	{
		name: "c-archive",
		description:
			"Build the listed main package, plus all packages it imports, into a C archive file",
	},
	{
		name: "c-shared",
		description:
			"Build the listed main package, plus all packages it imports, into a C shared library",
	},
	{
		name: "default",
		description:
			"Listed main packages are built into executables and listed non-main packages are built into .a files",
	},
	{
		name: "shared",
		description:
			"Combine all the listed non-main packages into a single shared library that will be used when building with the -linkshared option",
	},
	{
		name: "exe",
		description:
			"Build the listed main packages and everything they import into executables",
	},
	{
		name: "pie",
		description:
			"Build the listed main packages and everything they import into position independent executables (PIE)",
	},
	{
		name: "plugin",
		description:
			"Build the listed main packages, plus all packages that they import, into a Go plugin",
	},
];

const resolutionAndExecutionOptions: Fig.Option[] = [
	{
		name: "-n",
		description: "Print the commands but do not run them",
	},
	{
		name: "-v",
		description: "Print the names of packages as they are compiled",
	},
	{
		name: "-x",
		description: "Print the commands",
	},
	{
		name: "-tags",
		description:
			"A comma-separated list of build tags to consider satisfied during the build",
		args: {
			name: "tags",
		},
	},
	{
		name: "-toolexec",
		insertValue: "-toolexec '{cursor}'",
		description:
			"A program to use to invoke toolchain programs like vet and asm",
		args: {
			name: "cmd",
		},
	},
];

const globalOptions: Fig.Option[] = [
	...resolutionAndExecutionOptions,
	{
		name: "-a",
		description: "Force rebuilding of packages that are already up-to-date",
	},
	{
		name: "-p",
		description: "The number of programs, such as build commands or",
		args: {
			name: "programs",
		},
	},
	{
		name: "-race",
		description: `Enable data race detection.
Supported only on linux/amd64, freebsd/amd64, darwin/amd64, windows/amd64,
linux/ppc64le and linux/arm64 (only for 48-bit VMA)`,
	},
	{
		name: "-msan",
		description: `Enable interoperation with memory sanitizer.
Supported only on linux/amd64, linux/arm64
and only with Clang/LLVM as the host C compiler.
On linux/arm64, pie build mode will be used`,
	},
	{
		name: "-work",
		description: `Print the name of the temporary work directory and
do not delete it when exiting`,
	},
	{
		name: "-asmflags",
		insertValue: "-asmflags='{cursor}'",
		description: "Arguments to pass on each go tool asm invocation",
		args: {
			name: "flag",
			isVariadic: true,
		},
	},
	{
		name: "-buildmode",
		description: "Build mode to use. See 'go help buildmode' for more",
		args: {
			name: "mode",
			suggestions: buildModeSuggestions,
		},
	},
	{
		name: "-compiler",
		description:
			"Name of compiler to use, as in runtime.Compiler (gccgo or gc)",
		args: {
			name: "name",
		},
	},
	{
		name: "-gccgoflags",
		insertValue: "--gccgoflags='{cursor}'",
		description: "Arguments to pass on each gccgo compiler/linker invocation",
		args: {
			name: "flag",
			isVariadic: true,
		},
	},
	{
		name: "-gcflags",
		insertValue: "-gcflags='{cursor}'",
		description: "Arguments to pass on each go tool compile invocation",
		args: {
			name: "flag",
			isVariadic: true,
		},
	},
	{
		name: "-installsuffix",
		description:
			"A suffix to use in the name of the package installation directory,",
		args: {
			name: "suffix",
		},
	},
	{
		name: "-ldflags",
		insertValue: "-ldflags='{cursor}'",
		description: "Arguments to pass on each go tool link invocation",
		args: {
			name: "flag",
			isVariadic: true,
		},
	},
	{
		name: "-linkshared",
		description:
			"Build code that will be linked against shared libraries previously",
	},
	{
		name: "-mod",
		description: "Module download mode to use: readonly, vendor, or mod",
		args: {
			name: "mode",
			suggestions: [
				{
					name: "readonly",
				},
				{
					name: "vendor",
				},
				{
					name: "mod",
				},
			],
		},
	},
	{
		name: "-modcacherw",
		description:
			"Leave newly-created directories in the module cache read-write",
	},
	{
		name: "-modfile",
		description:
			"In module aware mode, read (and possibly write) an alternate go.mod file instead of the one in the module root directory",
		args: {
			name: "file",
		},
	},
	{
		name: "-overlay",
		description:
			"Read a JSON config file that provides an overlay for build operations",
		args: {
			name: "file",
		},
	},
	{
		name: "-pkgdir",
		description:
			"Install and load all packages from dir instead of the usual locations",
		args: {
			name: "dir",
		},
	},
	{
		name: "-trimpath",
		description: "Remove all file system paths from the resulting executable",
	},
];

const packagesArg: Fig.Arg = {
	name: "packages",
	isVariadic: true,
	isOptional: true,
	template: ["filepaths"],
};

const completionSpec: Fig.Spec = {
	name: "go",
	description: "Go is a tool for managing Go source code",
	parserDirectives: {
		flagsArePosixNoncompliant: true,
	},
	subcommands: [
		{
			name: "bug",
			description: "Start a bug report",
		},
		{
			name: "build",
			description: "Compile packages and dependencies",
			options: [
				...globalOptions,
				{
					name: "-o",
					description:
						"Write the resulting executable or object to the named output file or directory",
					args: {
						template: ["filepaths", "folders"],
					},
				},
				{
					name: "-i",
					description:
						"Install the packages that are dependencies of the target",
				},
			],
			args: packagesArg,
		},
		{
			name: "clean",
			description: "Remove object files and cached files",
			options: [
				...globalOptions,
				{
					name: "-i",
					description: "Remove the corresponding installed archive or binary",
				},
				{
					name: "-r",
					description:
						"Apply recursively to all the dependencies of the packages named by the import paths",
				},
				{
					name: "-cache",
					description: "Remove the entire go build cache",
				},
				{
					name: "-testcache",
					description: "Expire all test results in the go build cache",
				},
				{
					name: "-modcache",
					description:
						"Remove the entire module download cache, including unpacked source code of versioned dependencies",
				},
			],
		},
		{
			name: "doc",
			description: "Show documentation for package or symbol",
			options: [
				{
					name: "-all",
					description: "Show all the documentation for the package",
				},
				{
					name: "-c",
					description: "Respect case when matching symbols",
				},
				{
					name: "-cmd",
					description:
						"Treat a command (package main) like a regular package. Otherwise package main's exported symbols are hidden when showing the package's top-level documentation",
				},
				{
					name: "-short",
					description: "One-line representation for each symbol",
				},
				{
					name: "-src",
					description: "Show the full source code for the symbol",
				},
				{
					name: "-u",
					description:
						"Show documentation for unexported as well as exported symbols, methods, and fields",
				},
			],
			args: {
				name: "package",
			},
		},
		{
			name: "env",
			description: "Print Go environment information",
			options: [
				{
					name: "-json",
					description:
						"Prints the environment in JSON format instead of as a shell script",
				},
				{
					name: "-u",
					description:
						"Unset the default setting for the named environment variables",
					args: {
						isVariadic: true,
					},
				},
				{
					name: "-w",
					description:
						"Change the default settings of the named environment variables to the given values",
					args: {
						isVariadic: true,
					},
				},
			],
		},
		{
			name: "fix",
			description: "Update packages to use new APIs",
			args: packagesArg,
		},
		{
			name: "fmt",
			description: "Gofmt (reformat) package sources",
			options: [
				{
					name: "-n",
					description: "Print the commands that would be executed",
				},
				{
					name: "-x",
					description: "Print the commands as they are executed",
				},
				{
					name: "-mod",
					description: "Which module download mode to use",
					args: {
						name: "mode",
						suggestions: [
							{
								name: "readonly",
							},
							{
								name: "vendor",
							},
						],
					},
				},
			],
			args: packagesArg,
		},
		{
			name: "generate",
			description: "Generate Go files by processing source",
			options: [
				...globalOptions,
				{
					name: "-run",
					insertValue: '-run "{cursor}"',
					description:
						"Specifies a regular expression to select directives whose full original source text matches the expression",
				},
			],
		},
		{
			name: "get",
			description: "Add dependencies to current module and install them",
			options: [
				...globalOptions,
				{
					name: "-t",
					description:
						"Modules needed to build tests of packages specified on the command line",
				},
				{
					name: "-u",
					description: "Update to newer minor or patch releases when available",
					args: {
						isOptional: true,
						suggestions: [
							{
								name: "patch",
								description: "Update to newer patch releases",
							},
						],
					},
				},
				{
					name: "-insecure",
					description: "Permit fetching from insecure origins",
				},
				{
					name: "-d",
					description:
						"Only update go.mod and download source code needed to build packages",
				},
			],
			args: {
				name: "url",
				isOptional: true,
			},
		},
		{
			name: "install",
			description: "Compile and install packages and dependencies",
			options: [...globalOptions],
			args: {
				name: "packages",
				isVariadic: true,
			},
		},
		{
			name: "list",
			description: "List packages or modules",
			options: [
				...globalOptions,
				{
					name: "-compiled",
					description: "Set CompiledGoFiles to the Go source files",
				},
				{
					name: "-deps",
					description:
						"Terate over not just the named packages but also all their dependencies",
				},
				{
					name: "-f",
					insertValue: "-f '{cursor}'",
					description: "Specify an alternate format for the list",
					args: {
						name: "format",
					},
				},
				{
					name: "-e",
					description:
						"Processes the erroneous packages with the usual printing",
				},
				{
					name: "-export",
					description:
						"Set the Export field to the name of a file containing up-to-date export information for the given package",
				},
				{
					name: "-find",
					description:
						"Identify the named packages but not resolve their dependencies",
				},
				{
					name: "-test",
					description: "Report test binaries",
				},
				{
					name: "-m",
					description: "List modules instead of packages",
				},
				{
					name: "-u",
					description: "Add information about available upgrades",
				},
				{
					name: "-versions",
					description:
						"Set the Module's Versions field to a list of all known versions of that module",
				},
				{
					name: "-retracted",
					description: "Eport information about retracted module versions",
				},
			],
			args: {
				isOptional: true,
			},
		},
		{
			name: "mod",
			description: "Module maintenance",
			subcommands: [
				{
					name: "download",
					description: "Download the named modules into the module cache",
					options: [
						{
							name: "-json",
							description:
								"Print a sequence of JSON objects to standard output, describing each downloaded module (or failure)",
						},
						{
							name: "-x",
							description:
								"Print the commands download executes to standard error",
						},
					],
					args: {
						name: "modules",
						isVariadic: true,
					},
				},
				{
					name: "edit",
					description: "Edit and format go.mod files",
					options: [
						{
							name: "-module",
							description: "Change the module's path",
						},
						{
							name: "-go",
							requiresSeparator: true,
							description: "Set the expected Go language version",
							args: {
								name: "version",
							},
						},
						{
							name: "-require",
							requiresSeparator: true,
							description: "Add a requirement on the given module",
							args: {
								name: "path",
							},
						},
						{
							name: "-droprequire",
							requiresSeparator: true,
							description: "Drop a requirement on the given module",
							args: {
								name: "path",
							},
						},
						{
							name: "-exclude",
							requiresSeparator: true,
							description: "Add an exclusion on the given module",
							args: {
								name: "path",
							},
						},
						{
							name: "-dropexclude",
							requiresSeparator: true,
							description: "Drop an exclusion on the given module",
							args: {
								name: "path",
							},
						},
						{
							name: "-replace",
							requiresSeparator: true,
							description:
								"Add a replacement of the given module path and version pair",
							args: {
								name: "path",
							},
						},
						{
							name: "-dropreplace",
							requiresSeparator: true,
							description:
								"Drops a replacement of the given module path and version pair",
							args: {
								name: "path",
							},
						},
						{
							name: "-retract",
							requiresSeparator: true,
							description: "Add a retraction for the given version",
							args: {
								name: "version",
							},
						},
						{
							name: "-dropretract",
							requiresSeparator: true,
							description: "Drop a retraction for the given version",
							args: {
								name: "version",
							},
						},
						{
							name: "-fmt",
							description:
								"Format the go.mod file without making other changes",
						},
						{
							name: "-print",
							description:
								"Print the final go.mod in its text format instead of writing it back to disk",
						},
						{
							name: "-json",
							description:
								"Print the final go.mod in JSON format instead of writing it back to disk in text forma",
						},
					],
				},
				{
					name: "graph",
					description: "Print the module requirement graph",
				},
				{
					name: "init",
					description:
						"Initialize and write a new go.mod file in the current directory",
					args: {
						name: "module path",
						isOptional: true,
					},
				},
				{
					name: "tidy",
					description:
						"Ensure that the go.mod file matches the source code in the module",
					options: [
						{
							name: "-e",
							description:
								"Attempt to proceed despite errors encountered while loading packages",
						},
						{
							name: "-v",
							description: "Print information about removed modules",
						},
					],
				},
				{
					name: "vendor",
					description:
						"Construct a directory named vendor in the main module's root directory",
					options: [
						{
							name: "-e",
							description:
								"Attempt to proceed despite errors encountered while loading packages",
						},
						{
							name: "-v",
							description: "Print information about removed modules",
						},
					],
				},
				{
					name: "verify",
					description:
						"Check that dependencies of the main module stored in the module cache have not been modified since they were downloaded",
				},
				{
					name: "why",
					description:
						"Show a shortest path in the import graph from the main module to each of the listed packages",
					options: [
						{
							name: "-m",
							description: "Treat its arguments as a list of modules",
						},
						{
							name: "-vendor",
							description:
								"Ignore imports in tests of packages outside the main module",
						},
					],
					args: {
						name: "packages",
						isVariadic: true,
					},
				},
			],
		},
		{
			name: "work",
			description: "Workspace maintenance",
			subcommands: [
				{
					name: "edit",
					description: "Edit go.work from tools or scripts",
					options: [
						{
							name: "-fmt",
							description:
								"The -fmt flag reformats the go.work file without making other changes. This reformatting is also implied by any other modifications that use or rewrite the go.mod file. The only time this flag is needed is if no other flags are specified, as in 'go work edit -fmt'",
						},
						{
							name: "-use",
							requiresSeparator: true,
							description:
								"The -use=path and -dropuse=path flags add and drop a use directive from the go.work file's set of module directories",
							args: {
								name: "path",
							},
						},
						{
							name: "-dropuse",
							requiresSeparator: true,
							description:
								"The -use=path and -dropuse=path flags add and drop a use directive from the go.work file's set of module directories",
							args: {
								name: "path",
							},
						},
						{
							name: "-replace",
							requiresSeparator: true,
							description:
								"The -replace=old[@v]=new[@v] flag adds a replacement of the given module path and version pair. If the @v in old@v is omitted, a replacement without a version on the left side is added, which applies to all versions of the old module path. If the @v in new@v is omitted, the new path should be a local module root directory, not a module path. Note that -replace overrides any redundant replacements for old[@v], so omitting @v will drop existing replacements for specific versions",
							args: {
								name: "old[@v]=new[@v]",
							},
						},
						{
							name: "-dropreplace",
							requiresSeparator: true,
							description:
								"The -dropreplace=old[@v] flag drops a replacement of the given module path and version pair. If the @v is omitted, a replacement without a version on the left side is dropped",
							args: {
								name: "old[@v]",
							},
						},
						{
							name: "-go",
							requiresSeparator: true,
							description: "Set the expected Go language version",
							args: {
								name: "version",
							},
						},
						{
							name: "-print",
							description:
								"The -print flag prints the final go.work in its text format instead of writing it back to go.mod",
						},
						{
							name: "-json",
							description:
								"The -json flag prints the final go.work file in JSON format instead of writing it back to go.mod",
						},
					],
				},
				{
					name: "init",
					description: "Initialize workspace file",
					args: {
						name: "moddirs",
						isVariadic: true,
					},
				},
				{
					name: "sync",
					description: "Sync workspace build list to modules",
				},
				{
					name: "use",
					description: "Add modules to workspace file",
					options: [
						{
							name: "-r",
							description:
								"The -r flag searches recursively for modules in the argument directories, and the use command operates as if each of the directories were specified as arguments: namely, use directives will be added for directories that exist, and removed for directories that do not exist",
						},
					],
					args: {
						name: "moddirs",
						isVariadic: true,
					},
				},
			],
		},
		{
			name: "run",
			description: "Compile and run Go program",
			options: [
				...globalOptions,
				{
					name: "-exec",
					description: "Invoke the binary using xprog",
					args: {},
				},
			],
			args: {
				name: "package",
				isScript: true,
			},
		},
		{
			name: "test",
			description: "Test packages",
			options: [
				...globalOptions,
				{
					name: "-args",
					description:
						"Pass the remainder of the command line to the test binary",
					args: {
						isVariadic: true,
					},
				},
				{
					name: "-c",
					description: "Compile the test binary to pkg.test but do not run it",
				},
				{
					name: "-exec",
					description: "Invoke the binary using xprog",
					args: {},
				},
				{
					name: "-i",
					description: "Install packages that are dependencies of the test",
				},
				{
					name: "-json",
					description: "Convert test output to JSON suitable",
				},
				{
					name: "-o",
					description: "Compile the test binary to the named file",
					args: {
						name: "file",
						template: "filepaths",
					},
				},
			],
		},
		{
			name: "tool",
			description: "Run specified go tool",
			options: [
				{
					name: "-n",
					description:
						"Print the command that would be executed but not execute it",
				},
			],
			args: {
				name: "tool",
				generators: {
					script: ["go", "tool"],
					splitOn: "\n",
				},
			},
		},
		{
			name: "version",
			description: "Print Go version",
			options: [
				{
					name: "-m",
					description:
						"Print each executable's embedded module version information",
				},
				{
					name: "-v",
					description: "Report unrecognized files",
				},
			],
			args: {
				name: "file",
				isOptional: true,
			},
		},
		{
			name: "vet",
			description: "Report likely mistakes in packages",
			options: [
				...resolutionAndExecutionOptions,
				{
					name: "-vettool",
					requiresSeparator: true,
					description:
						"Select a different analysis tool with alternative or additional checks",
					args: {
						name: "tool",
					},
				},
			],
			args: {
				name: "package",
				isOptional: true,
			},
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/grep.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/grep.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "grep",
	description:
		"Matches patterns in input text. Supports simple patterns and regular expressions",
	args: [
		{
			name: "search pattern",
			suggestCurrentToken: true,
		},
		{
			name: "file",
			template: "filepaths",
		},
	],
	options: [
		{
			name: "--help",
			description:
				"Print a usage message briefly summarizing these command-line options and the bug-reporting address, then exit",
		},
		{
			name: ["-E", "--extended-regexp"],
			description:
				"Interpret PATTERN as an extended regular expression (-E is specified by POSIX.)",
		},
		{
			name: ["-F", "--fixed-string"],
			description:
				"Interpret PATTERN as a list of fixed strings, separated by newlines, any of which is to be matched. (-F is specified by POSIX.)",
		},
		{
			name: ["-G", "--basic-regexp"],
			description:
				"Interpret PATTERN as a basic regular expression (BRE, see below). This is the default",
		},
		{
			name: ["-e", "--regexp"],
			description:
				"Use PATTERN as the pattern. This can be used to specify multiple search patterns, or to protect a pattern beginning with a hyphen (-). (-e is specified by POSIX.)",
			args: {
				name: "pattern",
			},
		},
		{
			name: ["-i", "--ignore-case", "-y"],
			description:
				"Ignore case distinctions in both the PATTERN and the input files. (-i is specified by POSIX.)",
		},
		{
			name: ["-v", "--invert-match"],
			description:
				"Invert the sense of matching, to select non-matching lines. (-v is specified by POSIX.)",
		},
		{
			name: ["-w", "--word-regexp"],
			description:
				"Select only those lines containing matches that form whole words. The test is that the matching substring must either be at the beginning of the line, or preceded by a non-word constituent character. Similarly, it must be either at the end of the line or followed by a non-word constituent character. Word-constituent characters are letters, digits, and the underscore",
		},
		{
			name: ["-x", "--line-regexp"],
			description:
				"Select only those matches that exactly match the whole line. (-x is specified by POSIX.)",
		},
		{
			name: ["-c", "--count"],
			description:
				"Suppress normal output; instead print a count of matching lines for each input file. With the -v, --invert-match option, count non-matching lines. (-c is specified by POSIX.)",
		},
		{
			name: "--color",
			description:
				"Surround the matched (non-empty) strings, matching lines, context lines, file names, line numbers, byte offsets, and separators (for fields and groups of context lines) with escape sequences to display them in color on the terminal. The colors are defined by the environment variable GREP_COLORS. The deprecated environment variable GREP_COLOR is still supported, but its setting does not have priority",
			args: {
				name: "WHEN",
				default: "auto",
				suggestions: ["never", "always", "auto"],
			},
		},
		{
			name: ["-L", "--files-without-match"],
			exclusiveOn: ["-l", "--files-with-matches"],
			description:
				"Suppress normal output; instead print the name of each input file from which no output would normally have been printed. The scanning will stop on the first match",
		},
		{
			name: ["-l", "--files-with-matches"],
			exclusiveOn: ["-L", "--files-without-match"],
			description:
				"Suppress normal output; instead print the name of each input file from which output would normally have been printed. The scanning will stop on the first match. (-l is specified by POSIX.)",
		},
		{
			name: ["-m", "--max-count"],
			description:
				"Stop reading a file after NUM matching lines. If the input is standard input from a regular file, and NUM matching lines are output, grep ensures that the standard input is positioned to just after the last matching line before exiting, regardless of the presence of trailing context lines. This enables a calling process to resume a search. When grep stops after NUM matching lines, it outputs any trailing context lines. When the -c or --count option is also used, grep does not output a count greater than NUM. When the -v or --invert-match option is also used, grep stops after outputting NUM non-matching lines",
			args: {
				name: "NUM",
			},
		},
		{
			name: ["-o", "--only-matching"],
			description:
				"Print only the matched (non-empty) parts of a matching line, with each such part on a separate output line",
		},
		{
			name: ["-q", "--quiet", "--silent"],
			description:
				"Quiet; do not write anything to standard output. Exit immediately with zero status if any match is found, even if an error was detected. Also see the -s or --no-messages option. (-q is specified by POSIX.)",
		},
		{
			name: ["-s", "--no-messages"],
			description:
				"Suppress error messages about nonexistent or unreadable files. Portability note: unlike GNU grep, 7th Edition Unix grep did not conform to POSIX, because it lacked -q and its -s option behaved like GNU grep's -q option. USG -style grep also lacked -q but its -s option behaved like GNU grep. Portable shell scripts should avoid both -q and -s and should redirect standard and error output to /dev/null instead. (-s is specified by POSIX.)",
		},
		{
			name: ["-b", "--byte-offset"],
			description:
				"Print the 0-based byte offset within the input file before each line of output. If -o (--only-matching) is specified, print the offset of the matching part itself",
		},
		{
			name: ["-H", "--with-filename"],
			description:
				"Print the file name for each match. This is the default when there is more than one file to search",
		},
		{
			name: ["-h", "--no-filename"],
			description:
				"Suppress the prefixing of file names on output. This is the default when there is only one file (or only standard input) to search",
		},
		{
			name: "--label",
			description:
				"Display input actually coming from standard input as input coming from file LABEL. This is especially useful when implementing tools like zgrep, e.g., gzip -cd foo.gz | grep --label=foo -H something",
			args: {
				name: "LABEL",
			},
		},
		{
			name: ["-n", "--line-number"],
			description:
				"Prefix each line of output with the 1-based line number within its input file. (-n is specified by POSIX.)",
		},
		{
			name: ["-T", "--initial-tab"],
			description:
				"Make sure that the first character of actual line content lies on a tab stop, so that the alignment of tabs looks normal. This is useful with options that prefix their output to the actual content: -H,-n, and -b. In order to improve the probability that lines from a single file will all start at the same column, this also causes the line number and byte offset (if present) to be printed in a minimum size field width",
		},
		{
			name: ["-u", "--unix-byte-offsets"],
			description:
				"Report Unix-style byte offsets. This switch causes grep to report byte offsets as if the file were a Unix-style text file, i.e., with CR characters stripped off. This will produce results identical to running grep on a Unix machine. This option has no effect unless -b option is also used; it has no effect on platforms other than MS-DOS and MS -Windows",
		},
		{
			name: "--null",
			description:
				"Output a zero byte (the ASCII NUL character) instead of the character that normally follows a file name. For example, grep -lZ outputs a zero byte after each file name instead of the usual newline. This option makes the output unambiguous, even in the presence of file names containing unusual characters like newlines. This option can be used with commands like find -print0, perl -0, sort -z, and xargs -0 to process arbitrary file names, even those that contain newline characters",
		},
		{
			name: ["-A", "--after-context"],
			description: "Print num lines of trailing context after each match",
			args: {
				name: "NUM",
			},
		},
		{
			name: ["-B", "--before-context"],
			description:
				"Print num lines of leading context before each match. See also the -A and -C options",
			args: {
				name: "NUM",
			},
		},
		{
			name: ["-C", "--context"],
			description:
				"Print NUM lines of output context. Places a line containing a group separator (--) between contiguous groups of matches. With the -o or --only-matching option, this has no effect and a warning is given",
			args: {
				name: "NUM",
			},
		},
		{
			name: ["-a", "--text"],
			description:
				"Treat all files as ASCII text. Normally grep will simply print ``Binary file ... matches'' if files contain binary characters. Use of this option forces grep to output lines matching the specified pattern",
		},
		{
			name: "--binary-files",
			description: "Controls searching and printing of binary files",
			args: {
				name: "value",
				default: "binary",
				suggestions: [
					{
						name: "binary",
						description: "Search binary files but do not print them",
					},
					{
						name: "without-match",
						description: "Do not search binary files",
					},
					{
						name: "text",
						description: "Treat all files as text",
					},
				],
			},
		},
		{
			name: ["-D", "--devices"],
			description: "Specify the demanded action for devices, FIFOs and sockets",
			args: {
				name: "action",
				default: "read",
				suggestions: [
					{
						name: "read",
						description: "Read as if they were normal files",
					},
					{
						name: "skip",
						description: "Devices will be silently skipped",
					},
				],
			},
		},
		{
			name: ["-d", "--directories"],
			description: "Specify the demanded action for directories",
			args: {
				name: "action",
				default: "read",
				suggestions: [
					{
						name: "read",
						description:
							"Directories are read in the same manner as normal files",
					},
					{
						name: "skip",
						description: "Silently ignore the directories",
					},
					{
						name: "recurse",
						description: "Read directories recursively",
					},
				],
			},
		},
		{
			name: "--exclude",
			description:
				"Note that --exclude patterns take priority over --include patterns, and if no --include pattern is specified, all files are searched that are not excluded. Patterns are matched to the full path specified, not only to the filename component",
			args: {
				name: "GLOB",
				isOptional: true,
			},
		},
		{
			name: "--exclude-dir",
			description:
				"If -R is specified, only directories matching the given filename pattern are searched.  Note that --exclude-dir patterns take priority over --include-dir patterns",
			isRepeatable: true,
			args: {
				name: "dir",
				template: "folders",
				isOptional: true,
			},
		},
		{
			name: "-I",
			description:
				"Ignore binary files. This option is equivalent to --binary-file=without-match option",
		},
		{
			name: "--include",
			description:
				"If specified, only files matching the given filename pattern are searched. Note that --exclude patterns take priority over --include patterns. Patterns are matched to the full path specified, not only to the filename component",
			args: {
				name: "GLOB",
				isOptional: true,
			},
		},
		{
			name: "--include-dir",
			description:
				"If -R is specified, only directories matching the given filename pattern are searched. Note that --exclude-dir patterns take priority over --include-dir patterns",
			args: {
				name: "dir",
				template: "folders",
				isOptional: true,
			},
		},
		{
			name: ["-R", "-r", "--recursive"],
			description: "Recursively search subdirectories listed",
		},
		{
			name: "--line-buffered",
			description:
				"Force output to be line buffered. By default, output is line buffered when standard output is a terminal and block buffered otherwise",
		},
		{
			name: ["-U", "--binary"],
			description: "Search binary files, but do not attempt to print them",
		},
		{
			name: ["-J", "-bz2decompress"],
			description:
				"Decompress the bzip2(1) compressed file before looking for the text",
		},
		{
			name: ["-V", "--version"],
			description: "Print version number of grep to the standard output stream",
		},
		{
			name: ["-P", "--perl-regexp"],
			description: "Interpret pattern as a Perl regular expression",
		},
		{
			name: ["-f", "--file"],
			description:
				"Obtain patterns from FILE, one per line. The empty file contains zero patterns, and therefore matches nothing. (-f is specified by POSIX.)",
			args: {
				name: "FILE",
				template: "filepaths",
			},
		},
	],
	additionalSuggestions: [
		{
			name: "-RIn",
			description:
				"Search for a pattern [R]ecursively in the current directory, showing matching line [n]umbers, [I]gnoring non-text files",
			insertValue: "-RI{cursor}",
		},
		{
			name: "-Hn",
			description:
				"Print file name with the corresponding line number (n) for each match",
			insertValue: "-H{cursor}",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/head.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/head.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "head",
	description: "Output the first part of files",
	args: {
		name: "file",
		template: "filepaths",
	},
	options: [
		{
			name: ["-c", "--bytes"],
			description: "Print the first [numBytes] bytes of each file",
			args: { name: "numBytes" },
		},
		{
			name: ["-n", "--lines"],
			description: "Print the first [numLines] lines instead of the first 10",
			args: { name: "numLines" },
		},
		{
			name: ["-q", "--quiet", "--silent"],
			description: "Never print headers giving file names",
		},
		{
			name: ["-v", "--verbose"],
			description: "Always print headers giving file names",
		},
		{ name: "--help", description: "Display this help and exit" },
		{
			name: "--version",
			description: "Output version information and exit",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/htop.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/htop.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "htop",
	description: "Improved top (interactive process viewer)",
	options: [
		{
			name: ["--help", "-h"],
			description: "Show help for htop",
		},
		{
			name: ["--no-color", "-C"],
			description: "Use a monochrome color scheme",
		},
		{
			name: ["--delay", "-d"],
			description: "Delay between updates, in tenths of sec",
			args: {
				name: "delay",
				suggestions: ["10", "1", "60"],
			},
		},
		{
			name: ["--filter", "-F"],
			description: "Filter commands",
			args: {
				name: "filter",
			},
		},
		{
			name: ["--highlight-changes", "-H"],
			description: "Highlight new and old processes",
			args: {
				name: "delay",
				description: "Delay between updates of highlights, in tenths of sec",
				suggestions: ["10", "1", "60"],
				isOptional: true,
			},
		},
		{
			name: ["--no-mouse", "-M"],
			description: "Disable the mouse",
		},
		{
			name: ["--pid", "-p"],
			description: "Show only the given PIDs",
			args: {
				name: "PID",
				isVariadic: true,
			},
		},
		{
			name: ["--sort-key", "-s"],
			description: "Sort by COLUMN in list view",
			args: {
				name: "column",
			},
		},
		{
			name: ["--tree", "-t"],
			description: "Show the tree view",
		},
		{
			name: ["--user", "-u"],
			description: "Show only processes for a given user (or $USER)",
			args: {
				name: "user",
				isOptional: true,
				suggestions: ["$USER"],
			},
		},
		{
			name: ["--no-unicode", "-U"],
			description: "Do not use unicode but plain ASCII",
		},
		{
			name: ["--version", "-V"],
			description: "Print version info",
		},
	],
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/id.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/id.ts

```typescript
const exclusiveOptions = ["-A", "-F", "-G", "-M", "-P", "-g", "-p", "-u"];

const completionSpec: Fig.Spec = {
	name: "id",
	description:
		"The id utility displays the user and group names and numeric IDs, of the calling process, to the standard output.  If the real and effective IDs are different, both are displayed, otherwise only the real ID is displayed. If a user (login name or user ID) is specified, the user and group IDs of that user are displayed.  In this case, the real and effective IDs are assumed to be the same",
	options: [
		{
			name: "-A",
			description:
				"Display the process audit user ID and other process audit properties, which requires privilege",
			exclusiveOn: exclusiveOptions,
		},
		{
			name: "-F",
			description: "Display the full name of the user",
			exclusiveOn: exclusiveOptions,
		},
		{
			name: "-G",
			description:
				"Display the different group IDs (effective, real and supplementary) as white-space separated numbers, in no particular order",
			exclusiveOn: exclusiveOptions,
		},
		{
			name: "-M",
			description: "Display the MAC label of the current process",
			exclusiveOn: exclusiveOptions,
		},
		{
			name: "-P",
			description: "Display the id as a password file entry",
			exclusiveOn: exclusiveOptions,
		},
		{
			name: "-g",
			description: "Display the effective group ID as a number",
			exclusiveOn: exclusiveOptions,
		},
		{
			name: "-n",
			description:
				"Display the name of the user or group ID for the -G, -g and -u options instead of the number.  If any of the ID numbers cannot be mapped into names the number will be displayed as usual",
			dependsOn: ["-G", "-g", "-u"],
			exclusiveOn: exclusiveOptions,
		},
		{
			name: "-p",
			description: "Make the output human-readable",
			exclusiveOn: exclusiveOptions,
		},
		{
			name: "-u",
			description: "Display the effective user ID as a number",
			exclusiveOn: exclusiveOptions,
		},
	],
	args: {
		name: "user",
		isOptional: true,
		generators: {
			script: ["bash", "-c", "dscl . -list /Users | grep -v '^_'"],
			postProcess: (out) =>
				out
					.trim()
					.split("\n")
					.map((username) => ({
						name: username,
						icon: "fig://template?badge=👤",
					})),
		},
	},
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/jq.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/jq.ts

```typescript
const sharedOptions: Fig.Option[] = [
	{
		name: "--version",
		description: "Output the jq version and exit with zero",
	},
	{
		name: "--seq",
		description:
			"Use the application/json-seq MIME type scheme for separating JSON texts in jq's input and output",
	},
	{
		name: "--stream",
		description:
			"Parse the input in streaming fashion, outputting arrays of path and leaf values",
	},
	{
		name: ["--slurp", "-s"],
		description:
			"Instead of running the filter for each JSON object in the input, read the entire input stream into a large array and run the filter just once",
	},
	{
		name: ["--raw-input", "-R"],
		description:
			"Don't parse the input as JSON. Instead, each line of text is passed to the filter as a string",
	},
	{
		name: ["--null-input", "-n"],
		description:
			"Don't read any input at all! Instead, the filter is run once using null as the input",
	},
	{
		name: ["--compact-output", "-c"],
		description:
			"By default, jq pretty-prints JSON output. Using this option will result in more compact output by instead putting each JSON object on a single line",
	},
	{
		name: "--tab",
		description: "Use a tab for each indentation level instead of two spaces",
	},
	{
		name: "--indent",
		description: "Use the given number of spaces for indentation",
		args: {
			name: "n",
			description: "No more than 7",
		},
	},
	{
		name: ["--color-output", "-C"],
		description:
			"By default, jq outputs colored JSON if writing to a terminal. You can force it to produce color even if writing to a pipe or a file using -C",
	},
	{
		name: ["--monochrome-output", "-M"],
		description: "Disable color",
	},
	{
		name: ["--ascii-output", "-a"],
		description:
			"Jq usually outputs non-ASCII Unicode codepoints as UTF-8, even if the input specified them as escape sequences",
	},
	{
		name: "--unbuffered",
		description: "Flush the output after each JSON object is printed",
	},
	{
		name: ["--sort-keys", "-S"],
		description:
			"Output the fields of each object with the keys in sorted orde",
	},
	{
		name: ["--raw-output", "-r"],
		description:
			"If the filter's result is a string then it will be written directly to standard output rather than being formatted as a JSON string with quotes",
	},
	{
		name: ["--join-output", "-j"],
		description: "Like -r but jq won't print a newline after each output",
	},
	{
		name: ["-f", "--from-file"],
		description: "Read filter from the file rather than from a command line",
		args: {
			name: "filename",
			template: "filepaths",
		},
	},
	{
		name: "-L",
		description: "Prepend directory to the search list for modules",
		args: {
			name: "directory",
			template: "folders",
		},
	},
	{
		name: ["-e", "--exit-status"],
		description:
			"Sets the exit status of jq to 0 if the last output values was neither false nor null, 1 if the last output value was either false or null, or 4 if no valid result was ever produced",
	},
	{
		name: "--arg",
		description:
			"This option passes a value to the jq program as a predefined variable",
		args: [
			{
				name: "name",
			},
			{
				name: "value",
			},
		],
	},
	{
		name: "--argjson",
		description:
			"This option passes a JSON-encoded value to the jq program as a predefined variable",
		args: [
			{
				name: "name",
			},
			{
				name: "JSON-text",
			},
		],
	},
	{
		name: "--slurpfile",
		description:
			"This option reads all the JSON texts in the named file and binds an array of the parsed JSON values to the given global variable",
		args: [
			{
				name: "variable name",
			},
			{
				name: "filename",
				template: "filepaths",
			},
		],
	},
	{
		name: "--rawfile",
		description:
			"This option reads in the named file and binds its contents to the given global variable",
		args: [
			{
				name: "variable name",
			},
			{
				name: "filename",
				template: "filepaths",
			},
		],
	},
	{
		name: "--args",
		description:
			"Remaining arguments are positional string arguments. These are available to the jq program as $ARGS.positional[]",
	},
	{
		name: "--jsonargs",
		description:
			"Remaining arguments are positional JSON text arguments. These are available to the jq program as $ARGS.positional[]",
	},
	{
		name: "--run-tests",
		description:
			"Runs the tests in the given file or standard input. This must be the last option given and does not honor all preceding options",
		args: {
			name: "filename",
			isOptional: true,
			template: "filepaths",
		},
	},
];

const completionSpec: Fig.Spec = {
	name: "jq",
	description: "Command-line JSON processor",
	options: sharedOptions,
	args: [
		{
			name: "filter",
			description: "Must be enclosed in single quotes",
		},
		{
			name: "files",
			template: "filepaths",
			isOptional: true,
			isVariadic: true,
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/kill.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/kill.ts

```typescript
// Compatibility: macOS

function processIcon(path: string): string {
	const idx = path.indexOf(".app/");
	if (idx === -1) {
		return "fig://icon?type=gear";
	}
	return "fig://" + path.slice(0, idx + 4);
}

const completionSpec: Fig.Spec = {
	name: "kill",
	description: "Terminate or signal a process",
	args: {
		name: "pid",
		isVariadic: true,
		generators: {
			script: ["bash", "-c", "ps axo pid,comm | sed 1d"],
			postProcess: (result: string) => {
				return result.split("\n").map((line) => {
					const [pid, path] = line.trim().split(/\s+/);
					const name = path.slice(path.lastIndexOf("/") + 1);
					return {
						name: pid,
						description: path,
						displayName: `${pid} (${name})`,
						icon: processIcon(path),
					};
				});
			},
		},
	},
	options: [
		{
			name: "-s",
			description: "A symbolic signal name specifying the signal to be sent",
			args: {
				name: "signal_name",
				generators: {
					// Bash's `kill` builtin has different output to /bin/kill
					script: ["env", "kill", "-l"],
					postProcess: (out) =>
						out.match(/\w+/g)?.map((name) => ({
							name,
							description: `Send ${name} instead of TERM`,
							icon: "fig://icon?type=string",
						})),
				},
			},
		},
		{
			name: "-l",
			description:
				"If no operand is given, list the signal names; otherwise, write the signal name corresponding to exit_status",
			args: {
				name: "exit_status",
				isOptional: true,
			},
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/killall.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/killall.ts

```typescript
// Linux incompatible

const signals = [
	"hup",
	"int",
	"quit",
	"ill",
	"trap",
	"abrt",
	"emt",
	"fpe",
	"kill",
	"bus",
	"segv",
	"sys",
	"pipe",
	"alrm",
	// This is the default signal
	// "term",
	"urg",
	"stop",
	"tstp",
	"cont",
	"chld",
	"ttin",
	"ttou",
	"io",
	"xcpu",
	"xfsz",
	"vtalrm",
	"prof",
	"winch",
	"info",
	"usr1",
	"usr2",
];

const completionSpec: Fig.Spec = {
	name: "killall",
	description: "Kill processes by name",
	args: {
		name: "process_name",
		isVariadic: true,
		generators: {
			// All processes, only display the path
			script: ["bash", "-c", "ps -A -o comm | sort -u"],
			postProcess: (out) =>
				out
					.trim()
					.split("\n")
					.map((path) => {
						const appExtIndex = path.indexOf(".app/");
						const isApp = appExtIndex !== -1;
						const name = path.slice(path.lastIndexOf("/") + 1);
						const nameChars = new Set(name);
						const badChars = ["(", "_", "."];
						return {
							name,
							description: path,
							priority:
								!badChars.some((char) => nameChars.has(char)) && isApp
									? 51
									: 40,
							icon: isApp
								? "fig://" + path.slice(0, appExtIndex + 4)
								: "fig://icon?type=gear",
						};
					}),
		},
	},
	options: [
		{
			name: "-d",
			description: "Be verbose (dry run) and display number of user processes",
		},
		{
			name: "-e",
			description:
				"Use the effective user ID instead of the real user ID for matching processes with -u",
		},
		{
			name: "-help",
			description: "Display help and exit",
		},
		{
			name: "-I",
			description: "Request confirmation before killing each process",
		},
		{
			name: "-l",
			description: "List the names of the available signals and exit",
		},
		{
			name: "-m",
			description: "Match the process name as a regular expression",
		},
		{
			name: "-v",
			description: "Be verbose",
		},
		{
			name: "-s",
			description: "Be verbose (dry run)",
		},
		...signals.map((signal) => ({
			name: "-SIG" + signal.toUpperCase(),
			description: `Send ${signal.toUpperCase()} instead of TERM`,
		})),
		{
			name: "-u",
			description:
				"Limit potentially matching processes to those belonging to the user",
			args: {
				name: "user",
				generators: {
					script: ["bash", "-c", "dscl . -list /Users | grep -v '^_'"],
					postProcess: (out) =>
						out
							.trim()
							.split("\n")
							.map((username) => ({
								name: username,
								icon: "fig://template?badge=👤",
							})),
				},
			},
		},
		{
			name: "-t",
			description:
				"Limit matching processes to those running on the specified TTY",
			args: {
				name: "tty",
			},
		},
		{
			name: "-c",
			description: "Limit matching processes to those matching the given name",
			args: {
				name: "name",
			},
		},
		{
			name: "-q",
			description: "Suppress error message if no processes are matched",
		},
		{
			name: "-z",
			description: "Do not skip zombies",
		},
	],
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/less.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/less.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "less",
	description: "Opposite of more",
	args: {
		isVariadic: true,
		template: "filepaths",
	},
	options: [
		{
			name: ["-?", "--help"],
			description:
				'This option displays a summary of the commands accepted by less (the same as the h command).  (Depending on how your shell interprets the question mark, it may be necessary to quote the question mark, thus: "-?"',
		},
		{
			name: ["-a", "--search-skip-screen"],
			description: `By default, forward searches start at the top of the displayed
screen and backwards searches start at the bottom of the
displayed screen (except for repeated searches invoked by the n
or N commands, which start after or before the "target" line
respectively; see the -j option for more about the target line).
The -a option causes forward searches to instead start at the
bottom of the screen and backward searches to start at the top
of the screen, thus skipping all lines displayed on the screen`,
		},
		{
			name: ["-A", "--SEARCH-SKIP-SCREEN"],
			description: `Causes all forward searches (not just non-repeated searches) to
start just after the target line, and all backward searches to
start just before the target line.  Thus, forward searches will
skip part of the displayed screen (from the first line up to and
including the target line).  Similarly backwards searches will
skip the displayed screen from the last line up to and including
the target line.  This was the default behavior in less versions
prior to 441`,
		},

		{
			name: ["-b", "--buffers"],
			args: { name: "n" },
			description: `Specifies the amount of buffer space less will use for each
file, in units of kilobytes (1024 bytes).  By default 64 KB of
buffer space is used for each file (unless the file is a pipe;
see the -B option).  The -b option specifies instead that n
kilobytes of buffer space should be used for each file.  If n is
-1, buffer space is unlimited; that is, the entire file can be
read into memory`,
		},

		{
			name: ["-B", "--auto-buffers"],
			description: `By default, when data is read from a pipe, buffers are allocated
automatically as needed.  If a large amount of data is read from
the pipe, this can cause a large amount of memory to be
allocated.  The -B option disables this automatic allocation of
buffers for pipes, so that only 64 KB (or the amount of space
specified by the -b option) is used for the pipe.  Warning: use
of -B can result in erroneous display, since only the most
recently viewed part of the piped data is kept in memory; any
earlier data is lost`,
		},

		{
			name: ["-c", "--clear-screen"],
			description: `Causes full screen repaints to be painted from the top line
down.  By default, full screen repaints are done by scrolling
from the bottom of the screen`,
		},

		{
			name: ["-C", "--CLEAR-SCREEN"],
			description: `Same as -c, for compatibility with older versions of less`,
		},

		{
			name: ["-d", "--dumb"],
			description: `The -d option suppresses the error message normally displayed if
the terminal is dumb; that is, lacks some important capability,
such as the ability to clear the screen or scroll backward.  The
-d option does not otherwise change the behavior of less on a
dumb terminal`,
		},

		{
			name: ["-D", "--color"],
			args: { name: "xcolor" },
			description: `Changes the color of different parts of the displayed text.  x
is a single character which selects the type of text whose color
is being set:
B      Binary characters.
C      Control characters.
E      Errors and informational messages.
M      Mark letters in the status column.
N      Line numbers enabled via the -N option.
P      Prompts.
R      The rscroll character.
S      Search results.
W      The highlight enabled via the -w option.
d      Bold text.
k      Blinking text.
s      Standout text.
u      Underlined text.
The uppercase letters can be used only when the --use-color
option is enabled.  When text color is specified by both an
uppercase letter and a lowercase letter, the uppercase letter
takes precedence.  For example, error messages are normally
displayed as standout text.  So if both "s" and "E" are given a
color, the "E" color applies to error messages, and the "s"
color applies to other standout text.  The "d" and "u" letters
refer to bold and underline text formed by overstriking with
backspaces (see the -u option), not to text using ANSI escape
sequences with the -R option.
A lowercase letter may be followed by a + to indicate that both
the normal format change and the specified color should both be
used.  For example, -Dug displays underlined text as green
without underlining; the green color has replaced the usual
underline formatting.  But -Du+g displays underlined text as
both green and in underlined format.
color is either a 4-bit color string or an 8-bit color string:
A 4-bit color string is zero, one or two characters, where the
first character specifies the foreground color and the second
specifies the background color as follows:
b      Blue
c      Cyan
g      Green
k      Black
m      Magenta
r      Red
w      White
y      Yellow
The corresponding upper-case letter denotes a brighter shade of
the color.  For example, -DNGk displays line numbers as bright
green text on a black background, and -DEbR displays error
messages as blue text on a bright red background.  If either
character is a "-" or is omitted, the corresponding color is set
to that of normal text.
An 8-bit color string is one or two decimal integers separated
by a dot, where the first integer specifies the foreground color
and the second specifies the background color.  Each integer is
a value between 0 and 255 inclusive which selects a "CSI 38;5"
color value (see
https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_parameters)
If either integer is a "-" or is omitted, the corresponding
color is set to that of normal text.  On MS-DOS versions of
less, 8-bit color is not supported; instead, decimal values are
interpreted as 4-bit CHAR_INFO.Attributes values (see
https://docs.microsoft.com/en-us/windows/console/char-info-str)`,
		},

		{
			name: ["-e", "--quit-at-eof"],
			description: `Causes less to automatically exit the second time it reaches
end-of-file.  By default, the only way to exit less is via the
"q" command`,
		},

		{
			name: ["-E", "--QUIT-AT-EOF"],
			description: `Causes less to automatically exit the first time it reaches end-
of-file`,
		},

		{
			name: ["-f", "--force"],
			description: `Forces non-regular files to be opened.  (A non-regular file is a
directory or a device special file.)  Also suppresses the
warning message when a binary file is opened.  By default, less
will refuse to open non-regular files.  Note that some operating
systems will not allow directories to be read, even if -f is
set`,
		},

		{
			name: ["-F", "--quit-if-one-screen"],
			description: `Causes less to automatically exit if the entire file can be
displayed on the first screen`,
		},

		{
			name: ["-g", "--hilite-search"],
			description: `Normally, less will highlight ALL strings which match the last
search command.  The -g option changes this behavior to
highlight only the particular string which was found by the last
search command.  This can cause less to run somewhat faster than
the default`,
		},

		{
			name: ["-G", "--HILITE-SEARCH"],
			description: `The -G option suppresses all highlighting of strings found by
search commands`,
		},

		{
			name: ["-h", "--max-back-scroll"],
			args: { name: "n" },
			description: `Specifies a maximum number of lines to scroll backward.  If it
is necessary to scroll backward more than n lines, the screen is
repainted in a forward direction instead.  (If the terminal does
not have the ability to scroll backward, -h0 is implied.)`,
		},

		{
			name: ["-i", "--ignore-case"],
			description: `Causes searches to ignore case; that is, uppercase and lowercase
are considered identical.  This option is ignored if any
uppercase letters appear in the search pattern; in other words,
if a pattern contains uppercase letters, then that search does
not ignore case`,
		},

		{
			name: ["-I", "--IGNORE-CASE"],
			description: `Like -i, but searches ignore case even if the pattern contains
uppercase letters`,
		},

		{
			name: ["-j", "--jump-target"],
			args: { name: "n" },
			description: `Specifies a line on the screen where the "target" line is to be
positioned.  The target line is the line specified by any
command to search for a pattern, jump to a line number, jump to
a file percentage or jump to a tag.  The screen line may be
specified by a number: the top line on the screen is 1, the next
is 2, and so on.  The number may be negative to specify a line
relative to the bottom of the screen: the bottom line on the
screen is -1, the second to the bottom is -2, and so on.
Alternately, the screen line may be specified as a fraction of
the height of the screen, starting with a decimal point: .5 is
in the middle of the screen, .3 is three tenths down from the
first line, and so on.  If the line is specified as a fraction,
the actual line number is recalculated if the terminal window is
resized, so that the target line remains at the specified
fraction of the screen height.  If any form of the -j option is
used, repeated forward searches (invoked with "n" or "N") begin
at the line immediately after the target line, and repeated
backward searches begin at the target line, unless changed by -a
or -A.  For example, if "-j4" is used, the target line is the
fourth line on the screen, so forward searches begin at the
fifth line on the screen.  However nonrepeated searches (invoked
with "/" or "?") always begin at the start or end of the current
screen respectively`,
		},

		{
			name: ["-J", "--status-column"],
			description: `Displays a status column at the left edge of the screen.  The
status column shows the lines that matched the current search,
and any lines that are marked (via the m or M command)`,
		},

		{
			name: ["-k", "--lesskey-file"],
			args: { name: "filename", template: "filepaths" },
			description: `Causes less to open and interpret the named file as a lesskey(1)
file.  Multiple -k options may be specified.  If the LESSKEY or
LESSKEY_SYSTEM environment variable is set, or if a lesskey file
is found in a standard place (see KEY BINDINGS), it is also used
as a lesskey file`,
		},

		{
			name: ["-K", "--quit-on-intr"],
			description: `Causes less to exit immediately (with status 2) when an
interrupt character (usually ^C) is typed.  Normally, an
interrupt character causes less to stop whatever it is doing and
return to its command prompt.  Note that use of this option
makes it impossible to return to the command prompt from the "F"
command`,
		},

		{
			name: ["-L", "--no-lessopen"],
			description: `Ignore the LESSOPEN environment variable (see the INPUT
PREPROCESSOR section below).  This option can be set from within
less, but it will apply only to files opened subsequently, not
to the file which is currently open`,
		},

		{
			name: ["-m", "--long-prompt"],
			description: `Causes less to prompt verbosely (like more), with the percent
into the file.  By default, less prompts with a colon`,
		},

		{
			name: ["-M", "--LONG-PROMPT"],
			description: `Causes less to prompt even more verbosely than more`,
		},

		{
			name: ["-n", "--line-numbers"],
			description: `Suppresses line numbers.  The default (to use line numbers) may
cause less to run more slowly in some cases, especially with a
very large input file.  Suppressing line numbers with the -n
option will avoid this problem.  Using line numbers means: the
line number will be displayed in the verbose prompt and in the =
command, and the v command will pass the current line number to
the editor (see also the discussion of LESSEDIT in PROMPTS
below)`,
		},

		{
			name: ["-N", "--LINE-NUMBERS"],
			description: `Causes a line number to be displayed at the beginning of each
line in the display`,
		},

		{
			name: ["-o", "--log-file"],
			args: { name: "filename", template: "filepaths" },
			description: `Causes less to copy its input to the named file as it is being
viewed.  This applies only when the input file is a pipe, not an
ordinary file.  If the file already exists, less will ask for
confirmation before overwriting it`,
		},

		{
			name: ["-O", "--LOG-FILE"],
			args: { name: "filename", template: "filepaths" },
			description: `The -O option is like -o, but it will overwrite an existing file
without asking for confirmation.
If no log file has been specified, the -o and -O options can be
used from within less to specify a log file.  Without a file
name, they will simply report the name of the log file.  The "s"
command is equivalent to specifying -o from within less`,
		},

		{
			name: ["-p", "--pattern"],
			args: { name: "pattern" },
			description: `The -p option on the command line is equivalent to specifying
+/pattern; that is, it tells less to start at the first
occurrence of pattern in the file`,
		},

		{
			name: ["-P", "--prompt"],
			args: { name: "prompt" },
			description: `Provides a way to tailor the three prompt styles to your own
preference.  This option would normally be put in the LESS
environment variable, rather than being typed in with each less
command.  Such an option must either be the last option in the
LESS variable, or be terminated by a dollar sign.
-Ps followed by a string changes the default (short) prompt to
that string.
-Pm changes the medium (-m) prompt.
-PM changes the long (-M) prompt.
-Ph changes the prompt for the help screen.
-P= changes the message printed by the = command.
-Pw changes the message printed while waiting for data (in the
F command).
All prompt strings consist of a sequence of letters and special
escape sequences.  See the section on PROMPTS for more details`,
		},

		{
			name: ["-q", "--quiet", "--silent"],
			description: `Causes moderately "quiet" operation: the terminal bell is not
rung if an attempt is made to scroll past the end of the file or
before the beginning of the file.  If the terminal has a "visual
bell", it is used instead.  The bell will be rung on certain
other errors, such as typing an invalid character.  The default
is to ring the terminal bell in all such cases`,
		},

		{
			name: ["-Q", "--QUIET", "--SILENT"],
			description: `Causes totally "quiet" operation: the terminal bell is never
rung.  If the terminal has a "visual bell", it is used in all
cases where the terminal bell would have been rung`,
		},

		{
			name: ["-r", "--raw-control-chars"],
			description: `Causes "raw" control characters to be displayed.  The default is
to display control characters using the caret notation; for
example, a control-A (octal 001) is displayed as "^A".  Warning:
when the -r option is used, less cannot keep track of the actual
appearance of the screen (since this depends on how the screen
responds to each type of control character).  Thus, various
display problems may result, such as long lines being split in
the wrong place.
USE OF THE -r OPTION IS NOT RECOMMENDED`,
		},

		{
			name: ["-R", "--RAW-CONTROL-CHARS"],
			description: `Like -r, but only ANSI "color" escape sequences and OSC 8
hyperlink sequences are output in "raw" form.  Unlike -r, the
screen appearance is maintained correctly, provided that there
are no escape sequences in the file other than these types of
escape sequences.  Color escape sequences are only supported
when the color is changed within one line, not across lines.  In
other words, the beginning of each line is assumed to be normal
(non-colored), regardless of any escape sequences in previous
lines.  For the purpose of keeping track of screen appearance,
these escape sequences are assumed to not move the cursor.
OSC 8 hyperlinks are sequences of the form:
ESC ] 8 ; 
ANSI color escape sequences are sequences of the form:
ESC [ ... m
where the "..." is zero or more color specification characters.
You can make less think that characters other than "m" can end
ANSI color escape sequences by setting the environment variable
LESSANSIENDCHARS to the list of characters which can end a color
escape sequence.  And you can make less think that characters
other than the standard ones may appear between the ESC and the
m by setting the environment variable LESSANSIMIDCHARS to the
list of characters which can appear`,
		},

		{
			name: ["-s", "--squeeze-blank-lines"],
			description: `Causes consecutive blank lines to be squeezed into a single
blank line.  This is useful when viewing nroff output`,
		},

		{
			name: ["-S", "--chop-long-lines"],
			description: `Causes lines longer than the screen width to be chopped
(truncated) rather than wrapped.  That is, the portion of a long
line that does not fit in the screen width is not displayed
until you press RIGHT-ARROW.  The default is to wrap long lines;
that is, display the remainder on the next line`,
		},

		{
			name: ["-t", "--tag"],
			args: { name: "tag" },
			description: `The -t option, followed immediately by a TAG, will edit the file
containing that tag.  For this to work, tag information must be
available; for example, there may be a file in the current
directory called "tags", which was previously built by ctags(1)
or an equivalent command.  If the environment variable
LESSGLOBALTAGS is set, it is taken to be the name of a command
compatible with global(1), and that command is executed to find
the tag.  (See http://www.gnu.org/software/global/global.html).
The -t option may also be specified from within less (using the
- command) as a way of examining a new file.  The command ":t"
is equivalent to specifying -t from within less`,
		},

		{
			name: ["-T", "--tag-file"],
			args: { name: "tagsfile" },
			description: `Specifies a tags file to be used instead of "tags"`,
		},

		{
			name: ["-u", "--underline-special"],
			description: `Causes backspaces and carriage returns to be treated as
printable characters; that is, they are sent to the terminal
when they appear in the input`,
		},

		{
			name: ["-U", "--UNDERLINE-SPECIAL"],
			description: `Causes backspaces, tabs, carriage returns and "formatting
characters" (as defined by Unicode) to be treated as control
characters; that is, they are handled as specified by the -r
option.
By default, if neither -u nor -U is given, backspaces which
appear adjacent to an underscore character are treated
specially: the underlined text is displayed using the terminal's
hardware underlining capability.  Also, backspaces which appear
between two identical characters are treated specially: the
overstruck text is printed using the terminal's hardware
boldface capability.  Other backspaces are deleted, along with
the preceding character.  Carriage returns immediately followed
by a newline are deleted.  Other carriage returns are handled as
specified by the -r option.  Unicode formatting characters, such
as the Byte Order Mark, are sent to the terminal.  Text which is
overstruck or underlined can be searched for if neither -u nor
-U is in effect`,
		},

		{
			name: ["-V", "--version"],
			description: `Displays the version number of less`,
		},

		{
			name: ["-w", "--hilite-unread"],
			description: `Temporarily highlights the first "new" line after a forward
movement of a full page.  The first "new" line is the line
immediately following the line previously at the bottom of the
screen.  Also highlights the target line after a g or p command.
The highlight is removed at the next command which causes
movement.  The entire line is highlighted, unless the -J option
is in effect, in which case only the status column is
highlighted`,
		},

		{
			name: ["-W", "--HILITE-UNREAD"],
			description: `Like -w, but temporarily highlights the first new line after any
forward movement command larger than one line`,
		},

		{
			name: ["-x", "--tabs="],
			args: { name: "n,..." },
			description: `Sets tab stops.  If only one n is specified, tab stops are set
at multiples of n.  If multiple values separated by commas are
specified, tab stops are set at those positions, and then
continue with the same spacing as the last two.  For example,
-x9,17 will set tabs at positions 9, 17, 25, 33, etc.  The
default for n is 8`,
		},

		{
			name: ["-X", "--no-init"],
			description: `Disables sending the termcap initialization and deinitialization
strings to the terminal.  This is sometimes desirable if the
deinitialization string does something unnecessary, like
clearing the screen`,
		},

		{
			name: ["-y", "--max-forw-scroll"],
			args: { name: "n" },
			description: `Specifies a maximum number of lines to scroll forward.  If it is
necessary to scroll forward more than n lines, the screen is
repainted instead.  The -c or -C option may be used to repaint
from the top of the screen if desired.  By default, any forward
movement causes scrolling`,
		},

		{
			name: ["-z", "--window"],
			args: { name: "n" },
			description: `Changes the default scrolling window size to n lines.  The
default is one screenful.  The z and w commands can also be used
to change the window size.  The "z" may be omitted for
compatibility with some versions of more.  If the number n is
negative, it indicates n lines less than the current screen
size.  For example, if the screen is 24 lines, -z-4 sets the
scrolling window to 20 lines.  If the screen is resized to 40
lines, the scrolling window automatically changes to 36 lines`,
		},

		{
			name: "--quotes",
			description: `Changes the filename quoting character.  This may be necessary
if you are trying to name a file which contains both spaces and
quote characters.  Followed by a single character, this changes
the quote character to that character.  Filenames containing a
space should then be surrounded by that character rather than by
double quotes.  Followed by two characters, changes the open
quote to the first character, and the close quote to the second
character.  Filenames containing a space should then be preceded
by the open quote character and followed by the close quote
character.  Note that even after the quote characters are
changed, this option remains -" (a dash followed by a double
quote)`,
		},

		{
			name: ["-~", "--tilde"],
			description: `Normally lines after end of file are displayed as a single tilde
(~).  This option causes lines after end of file to be displayed
as blank lines`,
		},

		{
			name: ["-#", "--shift"],
			description: `Specifies the default number of positions to scroll horizontally
in the RIGHTARROW and LEFTARROW commands.  If the number
specified is zero, it sets the default number of positions to
one half of the screen width.  Alternately, the number may be
specified as a fraction of the width of the screen, starting
with a decimal point: .5 is half of the screen width, .3 is
three tenths of the screen width, and so on.  If the number is
specified as a fraction, the actual number of scroll positions
is recalculated if the terminal window is resized, so that the
actual scroll remains at the specified fraction of the screen
width`,
		},

		{
			name: "--follow-name",
			description: `Normally, if the input file is renamed while an F command is
executing, less will continue to display the contents of the
original file despite its name change.  If --follow-name is
specified, during an F command less will periodically attempt to
reopen the file by name.  If the reopen succeeds and the file is
a different file from the original (which means that a new file
has been created with the same name as the original (now
renamed) file), less will display the contents of that new file`,
		},
		{
			name: "--incsearch",
			description: `Subsequent search commands will be "incremental"; that is, less
will advance to the next line containing the search pattern as
each character of the pattern is typed in`,
		},

		{
			name: "--line-num-width",
			description: `Sets the minimum width of the line number field when the -N
option is in effect.  The default is 7 characters`,
		},
		{
			name: "--mouse",
			description: `Enables mouse input: scrolling the mouse wheel down moves
forward in the file, scrolling the mouse wheel up moves
backwards in the file, and clicking the mouse sets the "#" mark
to the line where the mouse is clicked.  The number of lines to
scroll when the wheel is moved can be set by the --wheel-lines
option.  Mouse input works only on terminals which support X11
mouse reporting, and on the Windows version of less`,
		},
		{
			name: "--MOUSE",
			description: `Like --mouse, except the direction scrolled on mouse wheel
movement is reversed`,
		},
		{
			name: "--no-keypad",
			description: `Disables sending the keypad initialization and deinitialization
strings to the terminal.  This is sometimes useful if the keypad
strings make the numeric keypad behave in an undesirable manner`,
		},
		{
			name: "--no-histdups",
			description: `This option changes the behavior so that if a search string or
file name is typed in, and the same string is already in the
history list, the existing copy is removed from the history list
before the new one is added.  Thus, a given string will appear
only once in the history list.  Normally, a string may appear
multiple times`,
		},
		{
			name: "--rscroll",
			description: `This option changes the character used to mark truncated lines.
It may begin with a two-character attribute indicator like
LESSBINFMT does.  If there is no attribute indicator, standout
is used.  If set to "-", truncated lines are not marked`,
		},
		{
			name: "--save-marks",
			description: `Save marks in the history file, so marks are retained across
different invocations of less`,
		},
		{
			name: "--status-col-width",
			description: `Sets the width of the status column when the -J option is in
effect.  The default is 2 characters`,
		},
		{
			name: "--use-backslash",
			description: `This option changes the interpretations of options which follow
this one.  After the --use-backslash option, any backslash in an
option string is removed and the following character is taken
literally.  This allows a dollar sign to be included in option
strings`,
		},
		{
			name: "--use-color",
			description: `Enables the colored text in various places.  The -D option can
be used to change the colors.  Colored text works only if the
terminal supports ANSI color escape sequences (as defined in
ECMA-48 SGR; see
https://www.ecma-international.org/publications-and-
standards/standards/ecma-48)`,
		},
		{
			name: "--wheel-lines",
			args: { name: "n" },
			description: `Set the number of lines to scroll when the mouse wheel is rolled`,
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/ln.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/ln.ts

```typescript
const sourceDestArgs: Fig.Arg[] = [
	{
		name: "source_file",
		template: ["filepaths", "folders"],
		// isVariadic: true,
		// source_file is variadic but usability wise having it is less useful
		// because it keeps recommending "source_file" repeatedly and not "link_name or link_dirname"
		// and since most people won't need multiple files and those who do can look it up
	},
	{
		name: "link_name or link_dirname",
		isOptional: true,
	},
];

const completionSpec: Fig.Spec = {
	name: "ln",
	description: "Create (default hard) symbolic links to files",
	args: sourceDestArgs,
	options: [
		{
			name: "-s",
			description: "Create a symbolic link",
			args: sourceDestArgs,
		},
		{
			name: "-v",
			description: "Verbose",
		},
		{
			name: "-F",
			description: "If link name already exists replace it",
			args: sourceDestArgs,
		},
		{
			name: "-h",
			description: "Don't follow symbolic links",
		},
		{
			name: "-f",
			description:
				"If link name already exists unlink the old one before creating the new one",
			args: sourceDestArgs,
		},
		{
			name: "-i",
			description: "Prompt if proposed link already exists",
			args: sourceDestArgs,
		},
		{
			name: "-n",
			description: "Same as -h don't follow symbolic links",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/ls.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/ls.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "ls",
	description: "List directory contents",
	args: {
		isVariadic: true,
		template: ["filepaths", "folders"],
		filterStrategy: "fuzzy",
	},
	options: [
		{
			name: "-@",
			description:
				"Display extended attribute keys and sizes in long (-l) output",
		},
		{
			name: "-1",
			description:
				"(The numeric digit ``one''.)  Force output to be one entry per line.  This is the default when output is not to a terminal",
		},
		{
			name: "-A",
			description:
				"List all entries except for . and ...  Always set for the super-user",
		},
		{
			name: "-a",
			description: "Include directory entries whose names begin with a dot (.)",
		},
		{
			name: "-B",
			description:
				"Force printing of non-printable characters (as defined by ctype(3) and current locale settings) in file names as xxx, where xxx is the numeric value of the character in octal",
		},
		{
			name: "-b",
			description: "As -B, but use C escape codes whenever possible",
		},
		{
			name: "-C",
			description:
				"Force multi-column output; this is the default when output is to a terminal",
		},
		{
			name: "-c",
			description:
				"Use time when file status was last changed for sorting (-t) or long printing (-l)",
		},
		{
			name: "-d",
			description:
				"Directories are listed as plain files (not searched recursively)",
		},
		{
			name: "-e",
			description:
				"Print the Access Control List (ACL) associated with the file, if present, in long (-l) output",
		},
		{
			name: "-F",
			description:
				"Display a slash (/) immediately after each pathname that is a directory, an asterisk (*) after each that is executable, an at sign (@) after each symbolic link, an equals sign (=) after each socket, a percent sign (%) after each whiteout, and a vertical bar (|) after each that is a FIFO",
		},
		{
			name: "-f",
			description: "Output is not sorted.  This option turns on the -a option",
		},
		{
			name: "-G",
			description:
				"Enable colorized output.  This option is equivalent to defining CLICOLOR in the environment.  (See below.)",
		},
		{
			name: "-g",
			description:
				"This option is only available for compatibility with POSIX; it is used to display the group name in the long (-l) format output (the owner name is suppressed)",
		},
		{
			name: "-H",
			description:
				"Symbolic links on the command line are followed.  This option is assumed if none of the -F, -d, or -l options are specified",
		},
		{
			name: "-h",
			description:
				"When used with the -l option, use unit suffixes: Byte, Kilobyte, Megabyte, Gigabyte, Terabyte and Petabyte in order to reduce the number of digits to three or less using base 2 for sizes",
		},
		{
			name: "-i",
			description:
				"For each file, print the file's file serial number (inode number)",
		},
		{
			name: "-k",
			description:
				"If the -s option is specified, print the file size allocation in kilobytes, not blocks.  This option overrides the environment variable BLOCKSIZE",
		},
		{
			name: "-L",
			description:
				"Follow all symbolic links to final target and list the file or directory the link references rather than the link itself.  This option cancels the -P option",
		},
		{
			name: "-l",
			description:
				"(The lowercase letter ``ell''.)  List in long format.  (See below.)  A total sum for all the file sizes is output on a line before the long listing",
		},
		{
			name: "-m",
			description:
				"Stream output format; list files across the page, separated by commas",
		},
		{
			name: "-n",
			description:
				"Display user and group IDs numerically, rather than converting to a user or group name in a long (-l) output.  This option turns on the -l option",
		},
		{
			name: "-O",
			description: "Include the file flags in a long (-l) output",
		},
		{ name: "-o", description: "List in long format, but omit the group id" },
		{
			name: "-P",
			description:
				"If argument is a symbolic link, list the link itself rather than the object the link references.  This option cancels the -H and -L options",
		},
		{
			name: "-p",
			description:
				"Write a slash (`/') after each filename if that file is a directory",
		},
		{
			name: "-q",
			description:
				"Force printing of non-graphic characters in file names as the character `?'; this is the default when output is to a terminal",
		},
		{ name: "-R", description: "Recursively list subdirectories encountered" },
		{
			name: "-r",
			description:
				"Reverse the order of the sort to get reverse lexicographical order or the oldest entries first (or largest files last, if combined with sort by size",
		},
		{ name: "-S", description: "Sort files by size" },
		{
			name: "-s",
			description:
				"Display the number of file system blocks actually used by each file, in units of 512 bytes, where partial units are rounded up to the next integer value.  If the output is to a terminal, a total sum for all the file sizes is output on a line before the listing.  The environment variable BLOCKSIZE overrides the unit size of 512 bytes",
		},
		{
			name: "-T",
			description:
				"When used with the -l (lowercase letter ``ell'') option, display complete time information for the file, including month, day, hour, minute, second, and year",
		},
		{
			name: "-t",
			description:
				"Sort by time modified (most recently modified first) before sorting the operands by lexicographical order",
		},
		{
			name: "-u",
			description:
				"Use time of last access, instead of last modification of the file for sorting (-t) or long printing (-l)",
		},
		{
			name: "-U",
			description:
				"Use time of file creation, instead of last modification for sorting (-t) or long output (-l)",
		},
		{
			name: "-v",
			description:
				"Force unedited printing of non-graphic characters; this is the default when output is not to a terminal",
		},
		{
			name: "-W",
			description: "Display whiteouts when scanning directories.  (-S) flag)",
		},
		{
			name: "-w",
			description:
				"Force raw printing of non-printable characters.  This is the default when output is not to a terminal",
		},
		{
			name: "-x",
			description:
				"The same as -C, except that the multi-column output is produced with entries sorted across, rather than down, the columns",
		},
		{
			name: "-%",
			description:
				"Distinguish dataless files and directories with a '%' character in long (-l) output, and don't materialize dataless directories when listing them",
		},
		{
			name: "-,",
			description: `When the -l option is set, print file sizes grouped and separated by thousands using the non-monetary separator returned
by localeconv(3), typically a comma or period.  If no locale is set, or the locale does not have a non-monetary separator, this
option has no effect.  This option is not defined in IEEE Std 1003.1-2001 (“POSIX.1”)`,
			dependsOn: ["-l"],
		},
		{
			name: "--color",
			description: `Output colored escape sequences based on when, which may be set to either always, auto, or never`,
			requiresSeparator: true,
			args: {
				name: "when",
				suggestions: [
					{
						name: ["always", "yes", "force"],
						description: "Will make ls always output color",
					},
					{
						name: "auto",
						description:
							"Will make ls output escape sequences based on termcap(5), but only if stdout is a tty and either the -G flag is specified or the COLORTERM environment variable is set and not empty",
					},
					{
						name: ["never", "no", "none"],
						description:
							"Will disable color regardless of environment variables",
					},
				],
			},
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/lsblk.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/lsblk.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "lsblk",
	description: "List block devices",
	options: [
		{
			name: ["--help", "-h"],
			description: "Show help for lsblk",
		},
		{
			name: ["--version", "-V"],
			description: "Show version for lsblk",
		},
		{
			name: ["--all", "-a"],
			description: "Also list empty devices and RAM disk devices",
		},
		{
			name: ["--bytes", "-b"],
			description: "Print the SIZE column in bytes",
		},
		{
			name: ["--discard", "-D"],
			description:
				"Print information about the discarding capabilities (TRIM, UNMAP) for each device",
		},
		{
			name: ["--nodeps", "-d"],
			description: "Do not print holder devices or slaves",
		},
		{
			name: ["--dedup", "-E"],
			description:
				"Use column as a de-duplication key to de-duplicate output tree",
			args: {
				name: "column",
			},
		},
		{
			name: ["--exclude", "-e"],
			description:
				"Exclude the devices specified by the comma-separated list of major device numbers",
			args: {
				name: "list",
			},
		},
		{
			name: ["--fs", "-f"],
			description: "Output info about filesystems",
		},
		{
			name: ["--include", "-I"],
			description:
				"Include devices specified by the comma-separated list of major device numbers",
			args: {
				name: "list",
			},
		},
		{
			name: ["--ascii", "-i"],
			description: "Use ASCII characters for tree formatting",
		},
		{
			name: ["--json", "-J"],
			description: "Use JSON output format",
		},
		{
			name: ["--list", "-l"],
			description: "Produce output in the form of a list",
		},
		{
			name: ["--merge", "-M"],
			description:
				"Group parents of sub-trees to provide more readable output for RAIDs and Multi-path devices",
		},
		{
			name: ["--perms", "-m"],
			description: "Output info about device owner, group and mode",
		},
		{
			name: ["--noheadings", "-n"],
			description: "Do not print a header line",
		},
		{
			name: ["--output", "-o"],
			description: "Specify which output columns to print",
			args: {
				name: "list",
				isVariadic: true,
			},
		},
		{
			name: ["--output-all", "-O"],
			description: "Output all available columns",
		},
		{
			name: ["--pairs", "-P"],
			description: "Produce output in the form of key-value pairs",
		},
		{
			name: ["--raw", "-r"],
			description: "Produce output in raw format",
		},
		{
			name: ["--scsi", "-S"],
			description: "Output info about SCSI devices only",
		},
		{
			name: ["--inverse", "-s"],
			description: "Print dependencies in inverse order",
		},
		{
			name: ["--tree", "-T"],
			description: "Force tree-like output format",
			args: {
				name: "column",
			},
		},
		{
			name: ["--topology", "-t"],
			description: "Output info about block-device topology",
		},
		{
			name: ["--width", "-w"],
			description: "Specifies output width as a number of characters",
			args: {
				name: "number",
			},
		},
		{
			name: ["--sort", "-x"],
			description: "Sort output lines by column",
			args: {
				name: "column",
			},
		},
		{
			name: ["--zoned", "-z"],
			description: "Print the zone model for each device",
		},
		{
			name: "--sysroot",
			description:
				"Gather data for a Linux instance other than the instance from which the lsblk command is issued",
			args: {
				name: "directory",
			},
		},
	],
	args: {
		name: "device",
		description: "Device to list",
		isOptional: true,
	},
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/lsof.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/lsof.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "lsof",
	description: "List open files",
	args: {
		name: "names",
		description: "Select named files or files on named file systems",
		template: ["folders"],
		isVariadic: true,
		isOptional: true,
	},
	options: [
		{
			name: ["-?", "-h", "--help"],
			description: "Help",
		},
		{
			name: "-a",
			description: "Apply AND to the selections (defaults to OR)",
		},
		{
			name: "-b",
			description: "Avoid kernel blocks",
		},
		{
			name: "-c",
			description:
				"Select the listing of files for processes executing a command",
			args: {
				name: "string or regexp (optional ending with /i /b /x)",
			},
		},
		{
			name: "+c",
			description: "COMMAND width (9)",
			args: {
				name: "number",
			},
		},
		{
			name: "+d",
			description:
				"Search for all open instances/files/directories of directory",
			args: {
				name: "file",
				template: ["folders"],
			},
		},
		{
			name: "-d",
			description:
				"Specify a list of file descriptors (FDs) to exclude from or include in the output listing",
			args: {
				name: "File descriptor number",
			},
		},
		{
			name: "+D",
			description:
				"Search tree for all open instances/files/directories of directory. *SLOW?*",
			args: {
				name: "file",
				template: ["folders"],
			},
		},
		{
			name: "+f",
			description: "Enable path name arguments to be interpreted",
			args: {
				isOptional: true,
				name: "flags",
				suggestions: [
					{
						name: "c",
						description: "File structure use count",
					},
					{
						name: "g",
						description: "File flag abbreviations",
					},
					{
						name: "G",
						description: "File flags in hexadecimal",
					},
				],
			},
		},
		{
			name: "-f",
			description: "Inhibit path name arguments to be interpreted",
			args: {
				name: "flags",
				suggestions: [
					{
						name: "c",
						description: "File structure use count",
					},
					{
						name: "g",
						description: "File flag abbreviations",
					},
					{
						name: "G",
						description: "File flags in hexadecimal",
					},
				],
			},
		},
		{
			name: "-F",
			description: "Select fields to output",
			args: {
				name: "options",
				isVariadic: true,
				suggestions: [
					{
						name: "a",
						description: "Access: r = read; w = write; u = read/write",
					},
					{
						name: "c",
						description: "Command name",
					},
					{
						name: "C",
						description: "File struct share count",
					},
					{
						name: "d",
						description: "Device character code",
					},
					{
						name: "D",
						description: "Major/minor device number as 0x<hex>",
					},
					{
						name: "f",
						description: "File descriptor (always selected)",
					},
					{
						name: "G",
						description: "File flaGs",
					},
					{
						name: "i",
						description: "Inode number",
					},
					{
						name: "k",
						description: "Link count",
					},
					{
						name: "K",
						description: "Task ID (TID)",
					},
					{
						name: "l",
						description: "Lock: r/R = read; w/W = write; u = read/write",
					},
					{
						name: "L",
						description: "Login name",
					},
					{
						name: "m",
						description: "Marker between repeated output",
					},
					{
						name: "M",
						description: "Task comMand name",
					},
					{
						name: "n",
						description: "Comment, name, Internet addresses",
					},
					{
						name: "o",
						description: "File offset as 0t<dec> or 0x<hex>",
					},
					{
						name: "p",
						description: "Process ID (PID)",
					},
					{
						name: "g",
						description: "Process group ID (PGID)",
					},
					{
						name: "P",
						description: "Protocol name",
					},
					{
						name: "r",
						description: "Raw device number as 0x<hex>",
					},
					{
						name: "R",
						description: "PaRent PID",
					},
					{
						name: "s",
						description: "File size",
					},
					{
						name: "S",
						description: "Stream module and device names",
					},
					{
						name: "t",
						description: "File type",
					},
					{
						name: "T",
						description: "TCP/TPI info",
					},
					{
						name: "u",
						description: "User ID (UID)",
					},
					{
						name: "0",
						description: "(zero) use NUL field terminator instead of N",
					},
				],
			},
		},
		{
			name: "-F?",
			description: "Show fields for -F",
		},
		{
			name: "-g",
			description: "Exclude or select by process group IDs (PGID)",
			args: {
				name: "PGID",
				description: "Process Group ID (comma separated)",
			},
		},
		{
			name: "-i",
			// below you will find a valiant attempt to codify the following description into generators
			description:
				"Selects files by [46][protocol][@hostname|hostaddr][:service|port]",
			args: {
				name: "options",
				generators: [
					{
						script: ["echo"],
						postProcess: function () {
							const startParams = ["4", "6"];
							return startParams.map((param) => ({
								name: param,
							}));
						},
					},
					{
						script: ["echo"],
						postProcess: function (out, tokens) {
							const startParams = ["tcp", "udp", "TCP", "UDP"];
							const token =
								tokens[1].match(/^(-i[46])/) ||
								(tokens[2] && tokens[2].match(/^[46]/));
							const prefix = token && token.length > 0 ? token[1] : "";
							const result = startParams.map((param) => ({
								name: prefix + param,
							}));
							return result;
						},
					},
					{
						script: ["ifconfig"],
						postProcess: function (out, tokens) {
							const ips = out
								.split("\n")
								.filter((line) => line.match(/inet\b/))
								.map((line) => {
									const parts = line.split(" ");
									return parts[1];
								});
							let token = "@";
							if (tokens[1].match("@[^:]*$")) {
								token = tokens[1];
							} else if (tokens[2] && tokens[2].match("@[^:]*$")) {
								token = tokens[2];
							}
							const prefix = token.split("@")[0] + "@";
							const result = ips.map((ip) => ({
								name: prefix + ip,
							}));
							return result;
						},
						trigger: "@",
					},
					{
						script: ["echo"],
						postProcess: function (out, tokens) {
							const colonParams = ["http", "https", "who", "time"];
							let token = ":";
							if (tokens[1].match(":[^:]*")) {
								token = tokens[1];
							} else if (tokens[2] && tokens[2].match(":[^:]+")) {
								token = tokens[2];
							}
							const prefix = token.split(":")[0] + ":";

							return colonParams.map((param) => ({
								name: prefix + param,
							}));
						},
						trigger: ":",
					},
				],
			},
		},
		{
			name: "-l",
			description: "Inhibit conversion of user IDs to login names",
		},
		{
			name: "+L",
			description: "Enable listing of file link counts",
			args: {
				isOptional: true,
				name: "number",
			},
		},
		{
			name: "-L",
			description: "Disable listing of file link counts",
			args: {
				isOptional: true,
				name: "number",
			},
		},
		{
			name: "+M",
			description: "Enable portMap registration",
		},
		{
			name: "-M",
			description: "Disable portMap registration",
		},
		{
			name: "-n",
			description: "No host names",
		},
		{
			name: "-N",
			description: "Select NFS files",
		},
		{
			name: "-o",
			description: "List file offset",
		},
		{
			name: "-O",
			description: "No overhead *RISKY*",
		},
		{
			name: "-p",
			description: "Exclude or select process identification numbers (PIDs)",
			args: {
				name: "PIDs",
				description: "PIDs to select or exclude ( with ^)",
			},
		},
		{
			name: "-P",
			description: "No port names",
		},
		{
			name: "+r",
			description: "Repeat every t seconds (15) until no files",
			args: {
				name: "time (seconds)",
				description: "Time per repeat",
			},
		},
		{
			name: "-r",
			description: "Repeat every t seconds (15) forever",
			args: {
				name: "time (seconds)",
				description: "Time per repeat",
			},
		},
		{
			name: "-R",
			description: "List parent PID",
		},
		{
			name: "-s",
			description: "List file size or exclude/select protocol",
			args: {
				isOptional: true,
				name: "protocol:state",
			},
		},
		{
			name: "-S",
			description: "Stat timeout in seconds (lstat/readlink/stat)",
			args: {
				isOptional: true,
				name: "timeout (seconds)",
			},
		},
		{
			name: "-T",
			description: "Disable TCP/TPI info",
			args: {
				name: "info",
				suggestions: [
					{
						name: "f",
						description:
							"Selects reporting of socket options/states/values and tcp flag values",
					},
					{ name: "q", description: "Selects queue length reporting" },
					{ name: "s", description: "Selects connection state reporting" },
					{ name: "w", description: "Selects window size reporting" },
					{ name: "", description: "Disables info" },
				],
			},
		},
		{
			name: "-t",
			description: "Specify terse listing",
		},
		{
			name: "-u",
			description: "Exclude/select login|UID set",
			args: {
				name: "UIDs",
			},
		},
		{
			name: "-U",
			description: "Select Unix socket",
		},
		{
			name: "-v",
			description: "List version info",
		},
		{
			name: "-V",
			description: "Verbose search",
		},
		{
			name: "+w",
			description: "Enable warnings",
		},
		{
			name: "-w",
			description: "Disable warnings",
		},
		{
			name: "-x",
			description: "Cross over +d|+D File systems or symbolic links",
			args: {
				name: "cross-over option",
				suggestions: [
					{
						name: "f",
						description: "File system mount point cross-over processing",
					},
					{
						name: "l",
						description: "Symbolic link cross-over processing",
					},
				],
			},
		},
		{
			name: "-X",
			description: "File descriptor table only",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/mkdir.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/mkdir.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "mkdir",
	description: "Make directories",
	args: {
		name: "directory name",
		template: "folders",
		suggestCurrentToken: true,
	},
	options: [
		{
			name: ["-m", "--mode"],
			description: "Set file mode (as in chmod), not a=rwx - umask",
			args: { name: "mode" },
		},
		{
			name: ["-p", "--parents"],
			description: "No error if existing, make parent directories as needed",
		},
		{
			name: ["-v", "--verbose"],
			description: "Print a message for each created directory",
		},
		{
			name: ["-Z", "--context"],
			description: "Set the SELinux security context of each created directory",
			args: { name: "context" },
		},
		{ name: "--help", description: "Display this help and exit" },
		{
			name: "--version",
			description: "Output version information and exit",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/more.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/more.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "more",
	description: "Opposite of less",
	options: [
		{
			name: ["-d", "--silent"],
			description:
				"Prompt with '[Press space to continue, 'q' to quit.]', and display '[Press 'h' for instructions.]' instead of ringing the bell when an illegal key is pressed",
		},
		{
			name: ["-l", "--logical"],
			description: "Do not pause after any line containing a ^L (form feed)",
		},
		{
			name: ["-f", "--no-pause"],
			description: "Count logical lines, rather than screen lines",
		},
		{
			name: ["-p", "--print-over"],
			description: "Instead, clear the whole screen and then display the text",
		},
		{
			name: ["-c", "--clean-print"],
			description:
				"Instead, paint each screen from the top, clearing the remainder of each line as it is displayed",
		},
		{
			name: ["-s", "--squeeze"],
			description: "Squeeze multiple blank lines into one",
		},
		{
			name: ["-u", "--plain"],
			description: "Silently ignored as backwards compatibility",
		},
		{
			name: ["-n", "--lines"],
			description: "Specify the number of lines per screenful",
			args: { name: "n" },
		},
		{
			name: "--help",
			description: "Display help text",
		},
		{
			name: ["-V", "--version"],
			description: "Display version information",
		},
	],
	args: {
		isVariadic: true,
		template: "filepaths",
	},
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/mount.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/mount.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "mount",
	description: "Mount disks and manage subtrees",
	args: [
		{
			name: "Disk/loopfile",
			template: "filepaths",
			generators: [
				{
					script: ["cat", "/proc/partitions"], // this way we don't depend on lsblk
					postProcess: (out) => {
						return out
							.trim()
							.split("\n")
							.splice(2, out.length)
							.map((line) => "/dev/" + line.split(" ").pop())
							.filter((x) => x != "/dev/")
							.map((blk) => {
								return { name: blk, description: "Block device" };
							});
					},
				},
				{
					script: ["ls", "-1", "/dev/mapper"], // usually LUKS encrypted partitions are here
					postProcess: (out) => {
						return out
							.trim()
							.split("\n")
							.filter((x) => x.length != 0)
							.map((blk) => {
								return {
									name: "/dev/mapper/" + blk,
									description: "Mapped block device",
								};
							});
					},
				},
			],
		},
		{
			name: "mountpoint",
			template: "folders",
			suggestions: ["/mnt", "/run/media/"],
		},
	],
	options: [
		{
			name: ["-h", "--help"],
			description: "Help for abc",
		},
		{
			name: ["-a", "--all"],
			description: "Mount all filesystems in fstab",
		},
		{
			name: ["-c", "--no-canonicalize"],
			description: "Don't canonicalize paths",
		},
		{
			name: ["-f", "--fake"],
			description: "Dry run; skip the mount(2) syscall",
		},
		{
			name: ["-F", "--fork"],
			description: "Fork off for each device (use with -a)",
		},
		{
			name: ["-T", "--fstab"],
			description: "Alternative file to /etc/fstab",
			args: {
				name: "fstab",
				template: "filepaths",
				default: "/etc/fstab",
			},
		},
		{
			name: ["-i", "--internal-only"],
			description: "Don't call the mount.<type> helpers",
		},
		{
			name: ["-l", "--show-labels"],
			description: "Show also filesystem labels",
		},
		{
			name: ["-m", "--mkdir"],
			description: "Alias to '-o X-mount.mkdir",
		},
		{
			name: ["-n", "--no-mtab"],
			description: "Don't write to /etc/mtab",
		},
		{
			name: "--options-mode",
			description: "What to do with options loaded from fstab",
			args: {
				name: "mode",
			},
		},
		{
			name: "--options-source",
			description: "Mount options source",
			args: {
				name: "source",
				template: "filepaths",
			},
		},
		{
			name: "--options-source-force",
			description: "Force use of options from fstab/mtab",
		},
		{
			name: ["-o", "--options"],
			description: "Comma-separated list of mount options",
			args: {
				name: "list",
			},
		},
		{
			name: ["-O", "--test-opts"],
			description: "Limit the set of filesystems (use with -a)",
			args: {
				name: "list",
			},
		},
		{
			name: ["-r", "--read-only"],
			description: "Mount the filesystem read-only (same as -o ro)",
		},
		{
			name: ["-t", "--types"],
			description: "Limit the set of filesystem types",
			args: {
				name: "list",
			},
		},
		{
			name: "--source",
			description: "Explicitly specifies source",
			args: {
				name: "source",
				suggestions: ["path", "label", "uuid"],
			},
		},
		{
			name: "--target",
			description: "Explicitly specifies mountpoint",
			args: {
				name: "mountpoint",
				template: "folders",
			},
		},
		{
			name: "--target-prefix",
			description: "Specifies path used for all mountpoints",
			args: {
				name: "path",
				template: "folders",
			},
		},
		{
			name: ["-v", "--verbose"],
			description: "Say what is being done",
		},
		{
			name: ["-w", "--rw", "--read-write"],
			description: "Mount the filesystem read-write (default)",
		},
		{
			name: ["-V", "--version"],
			description: "Display version",
		},
		{
			name: ["-B", "--bind"],
			description: "Mount a subtree somewhere else (same as -o bind)",
		},
		{
			name: ["-M", "--move"],
			description: "Move a subtree to some other place",
		},
		{
			name: ["-R", "-rbind"],
			description: "Mount a subtree and all submounts somewhere else",
		},
		{
			name: "--make-shared",
			description: "Mark a subtree as shared",
		},
		{
			name: "--make-slave",
			description: "Mark a subtree as slave",
		},
		{
			name: "--make-private",
			description: "Mark a subtree as private",
		},
		{
			name: "--make-unbindable",
			description: "Mark a subtree as unbindable",
		},
		{
			name: "--make-rshared",
			description: "Recursively mark a whole subtree as shared",
		},
		{
			name: "--make-rslave",
			description: "Recursively mark a whole subtree as slave",
		},
		{
			name: "--make-rprivate",
			description: "Recursively mark a whole subtree as private",
		},
		{
			name: "--make-runbindable",
			description: "Recursively mark a whole subtree as unbindable",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/mv.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/mv.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "mv",
	description: "Move & rename files and folders",
	args: [
		{
			name: "source",
			isVariadic: true,
			template: ["filepaths", "folders"],
		},
		{
			name: "target",
			template: ["filepaths", "folders"],
		},
	],
	options: [
		{
			name: "-f",
			description:
				"Do not prompt for confirmation before overwriting the destination path",
			exclusiveOn: ["-i", "-n"],
		},
		{
			name: "-i",
			description:
				"Cause mv to write a prompt to standard error before moving a file that would overwrite an existing file",
			exclusiveOn: ["-f", "-n"],
		},
		{
			name: "-n",
			description: "Do not overwrite existing file",
			exclusiveOn: ["-f", "-i"],
		},
		{
			name: "-v",
			description: "Cause mv to be verbose, showing files after they are moved",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/nano.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/nano.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "nano",
	description: "Nano's ANOther editor, an enhanced free Pico clone",
	args: {
		template: "filepaths",
	},
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/nl.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/nl.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "nl",
	description: "Line numbering filter",
	parserDirectives: {
		optionsMustPrecedeArguments: true,
	},
	options: [
		{
			name: "-b",
			description: "Specify the logical page body lines to be numbered",
			args: {
				name: "type",
				suggestions: [
					{
						name: "a",
						description: "Number all lines",
					},
					{
						name: "t",
						description: "Number only non-empty lines",
					},
					{
						name: "pexpr",
						description:
							"Only those lines that contain the basic regular expression specified by 'expr'",
					},
				],
				default: "t",
			},
		},
		{
			name: "-d",
			description: `Specify the delimiter characters used to indicate the
start of a logical page section in the input file. At most two
characters may be specified; if only one character is specified,
the first character is replaced and the second character remains unchanged`,
			args: {
				name: "delim",
				suggestions: ["\\:"],
				default: "\\:",
			},
		},
		{
			name: "-f",
			description:
				"Specify the same as -b type except for logical page footer lines",
			args: {
				name: "type",
				suggestions: ["n"],
				default: "n",
			},
		},
		{
			name: "-h",
			description:
				"Specify the same as -b type except for logical page header lines",
			args: {
				name: "type",
				suggestions: ["n"],
				default: "n",
			},
		},
		{
			name: "-i",
			description:
				"Specify the increment value used to number logical page lines",
			args: {
				name: "incr",
				suggestions: ["1"],
				default: "1",
			},
		},
		{
			name: "-l",
			description: `If numbering of all lines is specified for the current
logical section using the corresponding -b a, -f a or -h a option, specify
the number of adjacent blank lines to be considered as one. For example,
-l 2 results in only the second adjacent blank line being numbered`,
			args: {
				name: "num",
				suggestions: ["1"],
				default: "1",
			},
		},
		{
			name: "-n",
			description: "Specify the line numbering output format",
			args: {
				name: "format",
				suggestions: [
					{
						name: "ln",
						description: "Left justified",
					},
					{
						name: "rn",
						description: "Right justified (leading zeros suppressed)",
					},
					{
						name: "rz",
						description: "Right justified (leading zeros kept)",
					},
				],
				default: "rz",
			},
		},
		{
			name: "-p",
			description:
				"Specify that line numbering should not be restarted at logical page delimiters",
		},
		{
			name: "-s",
			description: `Specify the characters used in separating the line
number and the corresponding text line.  The default
sep setting is a single tab character`,
			args: {
				name: "sep",
				suggestions: ["\\t"],
				default: "\\t",
			},
		},
		{
			name: "-v",
			description:
				"Specify the initial value used to number logical page lines; see also the description of the -p option",
			args: {
				name: "startnum",
				suggestions: ["1", "2", "3"],
				default: "1",
			},
		},
		{
			name: "-w",
			description: `Specify the number of characters to be occupied by the
line number; in case the width is insufficient to hold the line number,
it will be truncated to its width least significant digits`,
			args: {
				name: "width",
				suggestions: ["6", "5", "4", "3", "2", "1"],
				default: "6",
			},
		},
	],
	args: {
		name: "file",
		description: "File(s) to number",
		template: "filepaths",
	},
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/node.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/node.ts

```typescript
import { filepaths } from '../../helpers/filepaths';

const completionSpec: Fig.Subcommand = {
	name: "node",
	description: "Run the node interpreter",
	args: {
		name: "node script",
		isScript: true,
		generators: filepaths({
			extensions: ["mjs", "js", "cjs"],
			editFileSuggestions: { priority: 76 },
		}),
	},
	options: [
		{
			name: ["-e", "--eval=..."],
			insertValue: "-e '{cursor}'",
			description: "Evaluate script",
			args: {},
		},
		{
			name: "--watch",
			description: "Watch input files",
		},
		{
			name: "--watch-path",
			description: "Specify a watch directory or file",
			args: {
				name: "path",
				template: "filepaths",
			},
			isRepeatable: true,
		},
		{
			name: "--watch-preserve-output",
			description:
				"Disable the clearing of the console when watch mode restarts the process",
			dependsOn: ["--watch", "--watch-path"],
		},
		{
			name: "--env-file",
			description: "Specify a file containing environment variables",
			args: {
				name: "path",
				template: "filepaths",
			},
			isRepeatable: true,
		},
		{
			name: ["-p", "--print"],
			description: "Evaluate script and print result",
		},
		{
			name: ["-c", "--check"],
			description: "Syntax check script without executing",
		},
		{
			name: ["-v", "--version"],
			description: "Print Node.js version",
		},
		{
			name: ["-i", "--interactive"],
			description:
				"Always enter the REPL even if stdin does not appear to be a terminal",
		},
		{
			name: ["-h", "--help"],
			description: "Print node command line options (currently set)",
		},
		{
			name: "--inspect",
			requiresSeparator: true,
			args: {
				name: "[host:]port",
				isOptional: true,
			},
			description: "Activate inspector on host:port (default: 127.0.0.1:9229)",
		},
		{
			name: "--preserve-symlinks",
			description:
				"Follows symlinks to directories when examining source code and templates for translation strings",
		},
	],
	generateSpec: async (tokens, executeShellCommand) => {
		if (
			(
				await executeShellCommand({
					command: "bash",
					args: ["-c", "isAdonisJsonPresentCommand"],
				})
			).status === 0
		) {
			return {
				name: "node",
				subcommands: [
					{
						name: "ace",
						description: "Run AdonisJS command-line",
						options: [
							{
								name: ["-h", "--help"],
								description: "Display AdonisJS Ace help",
							},
							{
								name: ["-v", "--version"],
								description: "Display AdonisJS version",
							},
						],
						subcommands: [
							{
								name: "build",
								description:
									"Compile project from Typescript to Javascript. Also compiles the frontend assets if using webpack encore",
								options: [
									{
										name: ["-prod", "--production"],
										description: "Build for production",
									},
									{
										name: "--assets",
										description:
											"Build frontend assets when webpack encore is installed",
									},
									{
										name: "--no-assets",
										description: "Disable building assets",
									},
									{
										name: "--ignore-ts-errors",
										description:
											"Ignore typescript errors and complete the build process",
									},
									{
										name: "--tsconfig",
										description:
											"Path to the TypeScript project configuration file",
										args: {
											name: "path",
											description: "Path to tsconfig.json",
										},
									},
									{
										name: "--encore-args",
										requiresSeparator: true,
										insertValue: "--encore-args='{cursor}'",
										description:
											"CLI options to pass to the encore command line",
									},
									{
										name: "--client",
										args: {
											name: "name",
										},
										description:
											"Select the package manager to decide which lock file to copy to the build folder",
									},
								],
							},
							{
								name: ["configure", "invoke"],
								description: "Configure a given AdonisJS package",
								args: {
									name: "name",
									description: "Name of the package you want to configure",
								},
								subcommands: [
									{
										name: "@adonisjs/auth",
										description: "Trigger auto configuring auth package",
									},
									{
										name: "@adonisjs/shield",
										description: "Trigger auto configuring shield package",
									},
									{
										name: "@adonisjs/redis",
										description: "Trigger auto configuring redis package",
									},
									{
										name: "@adonisjs/mail",
										description: "Trigger auto configuring mail package",
									},
								],
							},
							{
								name: "repl",
								description: "Start a new REPL session",
							},
							{
								name: "serve",
								description:
									"Start the AdonisJS HTTP server, along with the file watcher. Also starts the webpack dev server when webpack encore is installed",
								options: [
									{
										name: "--assets",
										description:
											"Start webpack dev server when encore is installed",
									},
									{
										name: "--no-assets",
										description: "Disable webpack dev server",
									},
									{
										name: ["-w", "--watch"],
										description:
											"Watch for file changes and re-start the HTTP server on change",
									},
									{
										name: ["-p", "--poll"],
										description:
											"Detect file changes by polling files instead of listening to filesystem events",
									},
									{
										name: "--node-args",
										requiresSeparator: true,
										insertValue: "--node-args='{cursor}'",
										description: "CLI options to pass to the node command line",
									},
									{
										name: "--encore-args",
										requiresSeparator: true,
										insertValue: "--encore-args='{cursor}'",
										description:
											"CLI options to pass to the encore command line",
									},
								],
							},
							{
								name: "db:seed",
								description: "Execute database seeder files",
								options: [
									{
										name: ["-c", "--connection"],
										description:
											"Define a custom database connection for the seeders",
										args: {
											name: "name",
										},
									},
									{
										name: ["-i", "--interactive"],
										description: "Run seeders in interactive mode",
									},
									{
										name: ["-f", "--files"],
										args: {
											name: "file",
											isVariadic: true,
											template: "filepaths",
										},
										description:
											"Define a custom set of seeders files names to run",
									},
								],
							},
							{
								name: "dump:rcfile",
								description:
									"Dump contents of .adonisrc.json file along with defaults",
							},
							{
								name: "generate:key",
								description: "Generate a new APP_KEY secret",
							},
							{
								name: "generate:manifest",
								description:
									"Generate ace commands manifest file. Manifest file speeds up commands lookup",
							},
							{
								name: "list:routes",
								description: "List application routes",
							},
							{
								name: "make:command",
								description: "Make a new ace command",
							},
							{
								name: "make:controller",
								description: "Make a new HTTP controller",
								args: {
									name: "name",
									description: "Name of the controller class",
								},
								options: [
									{
										name: ["-r", "--resource"],
										description:
											"Add resourceful methods to the controller class",
									},
									{
										name: ["-e", "--exact"],
										description:
											"Create the controller with the exact name as provided",
									},
								],
							},
							{
								name: "make:exception",
								description: "Make a new custom exception class",
							},
							{
								name: "make:listener",
								description: "Make a new event listener class",
							},
							{
								name: "make:mailer",
								description: "Make a new mailer class",
								args: {
									name: "name",
									description: "Mailer class name",
								},
							},
							{
								name: "make:middleware",
								description: "Make a new middleware",
								args: {
									name: "name",
									description: "Middleware class name",
								},
							},
							{
								name: "make:migration",
								description: "Make a new migration file",
								args: {
									name: "name",
									description: "Name of the migration file",
								},
								options: [
									{
										name: "--connection",
										description:
											"The connection flag is used to lookup the directory for the migration file",
										args: {
											name: "name",
										},
									},
									{
										name: "--folder",
										description: "Pre-select a migration directory",
										args: {
											name: "name",
											template: "filepaths",
										},
									},
									{
										name: "--create",
										description:
											"Define the table name for creating a new table",
										args: {
											name: "name",
										},
									},
									{
										name: "--table",
										description:
											"Define the table name for altering an existing table",
										args: {
											name: "name",
										},
									},
								],
							},
							{
								name: "make:model",
								description: "Make a new Lucid model",
								args: {
									name: "name",
									description: "Name of the model class",
								},
								options: [
									{
										name: ["-m", "--migration"],
										description: "Generate the migration for the model",
									},
									{
										name: ["-c", "--controller"],
										description: "Generate the controller for the model",
									},
								],
							},
							{
								name: "make:prldfile",
								description: "Make a new preload file",
								subcommands: [
									{
										name: "events",
										description: "Make events preload file",
									},
								],
							},
							{
								name: "make:provider",
								description: "Make a new provider class",
							},
							{
								name: "make:seeder",
								description: "Make a new Seeder file",
								args: {
									name: "name",
									description: "Name of the seeder class",
								},
							},
							{
								name: "make:validator",
								description: "Make a new validator",
								args: {
									name: "name",
									description: "Name of the validator class",
								},
								options: [
									{
										name: ["-e", "--exact"],
										description:
											"Create the validator with the exact name as provided",
									},
								],
							},
							{
								name: "make:view",
								description: "Make a new view template",
								args: {
									name: "name",
									description: "Name of the view",
								},
								options: [
									{
										name: ["-e", "--exact"],
										description:
											"Create the template file with the exact name as provided",
									},
								],
							},
							{
								name: "migration:rollback",
								description: "Rollback migrations to a given batch number",
								options: [
									{
										name: ["-c", "--connection"],
										description: "Define a custom database connection",
										args: {
											name: "name",
										},
									},
									{
										name: "--force",
										description:
											"Explicitly force to run migrations in production",
										isDangerous: true,
									},
									{
										name: "--dry-run",
										description:
											"Print SQL queries, instead of running the migrations",
									},
									{
										name: "--batch",
										args: {
											name: "number",
											description: "Use 0 to rollback to initial state",
										},
										description: "Define custom batch number for rollback",
									},
								],
							},
							{
								name: "migration:run",
								description: "Run pending migrations",
								options: [
									{
										name: ["-c", "--connection"],
										description: "Define a custom database connection",
										args: {
											name: "name",
										},
									},
									{
										name: "--force",
										description:
											"Explicitly force to run migrations in production",
										isDangerous: true,
									},
									{
										name: "--dry-run",
										description:
											"Print SQL queries, instead of running the migrations",
									},
								],
							},
							{
								name: "migration:status",
								description: "Check migrations current status",
							},
						],
					},
				],
			};
		}
	},
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/npm.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/npm.ts

```typescript
function uninstallSubcommand(named: string | string[]): Fig.Subcommand {
	return {
		name: named,
		description: "Uninstall a package",
		args: {
			name: "package",
			generators: dependenciesGenerator,
			filterStrategy: "fuzzy",
			isVariadic: true,
		},
		options: npmUninstallOptions,
	};
}

const atsInStr = (s: string) => (s.match(/@/g) || []).length;

export const createNpmSearchHandler =
	(keywords?: string[]) =>
	async (
		context: string[],
		executeShellCommand: Fig.ExecuteCommandFunction,
		shellContext: Fig.ShellContext
	): Promise<Fig.Suggestion[]> => {
		const searchTerm = context[context.length - 1];
		if (searchTerm === "") {
			return [];
		}
		// Add optional keyword parameter
		const keywordParameter =
			keywords && keywords.length > 0 ? `+keywords:${keywords.join(",")}` : "";

		const queryPackagesUrl = keywordParameter
			? `https://api.npms.io/v2/search?size=20&q=${searchTerm}${keywordParameter}`
			: `https://api.npms.io/v2/search/suggestions?q=${searchTerm}&size=20`;

		// Query the API with the package name
		const queryPackages = [
			"-s",
			"-H",
			"Accept: application/json",
			queryPackagesUrl,
		];
		// We need to remove the '@' at the end of the searchTerm before querying versions
		const queryVersions = [
			"-s",
			"-H",
			"Accept: application/vnd.npm.install-v1+json",
			`https://registry.npmjs.org/${searchTerm.slice(0, -1)}`,
		];
		// If the end of our token is '@', then we want to generate version suggestions
		// Otherwise, we want packages
		const out = (query: string) =>
			executeShellCommand({
				command: "curl",
				args: query[query.length - 1] === "@" ? queryVersions : queryPackages,
			});
		// If our token starts with '@', then a 2nd '@' tells us we want
		// versions.
		// Otherwise, '@' anywhere else in the string will indicate the same.
		const shouldGetVersion = searchTerm.startsWith("@")
			? atsInStr(searchTerm) > 1
			: searchTerm.includes("@");

		try {
			const data = JSON.parse((await out(searchTerm)).stdout);
			if (shouldGetVersion) {
				// create dist tags suggestions
				const versions = Object.entries(data["dist-tags"] || {}).map(
					([key, value]) => ({
						name: key,
						description: value,
					})
				) as Fig.Suggestion[];
				// create versions
				versions.push(
					...Object.keys(data.versions)
						.map((version) => ({ name: version }) as Fig.Suggestion)
						.reverse()
				);
				return versions;
			}

			const results = keywordParameter ? data.results : data;
			return results.map(
				(item: { package: { name: string; description: string } }) => ({
					name: item.package.name,
					description: item.package.description,
				})
			) as Fig.Suggestion[];
		} catch (error) {
			console.error({ error });
			return [];
		}
	};

// GENERATORS
export const npmSearchGenerator: Fig.Generator = {
	trigger: (newToken, oldToken) => {
		// If the package name starts with '@', we want to trigger when
		// the 2nd '@' is typed because we'll need to generate version
		// suggetsions
		// e.g. @typescript-eslint/types
		if (oldToken.startsWith("@")) {
			return !(atsInStr(oldToken) > 1 && atsInStr(newToken) > 1);
		}

		// If the package name doesn't start with '@', then trigger when
		// we see the first '@' so we can generate version suggestions
		return !(oldToken.includes("@") && newToken.includes("@"));
	},
	getQueryTerm: "@",
	cache: {
		ttl: 1000 * 60 * 60 * 24 * 2, // 2 days
	},
	custom: createNpmSearchHandler(),
};

const workspaceGenerator: Fig.Generator = {
	// script: "cat $(npm prefix)/package.json",
	custom: async (tokens, executeShellCommand) => {
		const { stdout: npmPrefix } = await executeShellCommand({
			command: "npm",
			// eslint-disable-next-line @withfig/fig-linter/no-useless-arrays
			args: ["prefix"],
		});

		const { stdout: out } = await executeShellCommand({
			command: "cat",
			// eslint-disable-next-line @withfig/fig-linter/no-useless-arrays
			args: [`${npmPrefix}/package.json`],
		});

		const suggestions: Fig.Suggestion[] = [];
		try {
			if (out.trim() == "") {
				return suggestions;
			}

			const packageContent = JSON.parse(out);
			const workspaces = packageContent["workspaces"];

			if (workspaces) {
				for (const workspace of workspaces) {
					suggestions.push({
						name: workspace,
						description: "Workspaces",
					});
				}
			}
		} catch (e) {
			console.log(e);
		}
		return suggestions;
	},
};

/** Generator that lists package.json dependencies */
export const dependenciesGenerator: Fig.Generator = {
	trigger: (newToken) => newToken === "-g" || newToken === "--global",
	custom: async function (tokens, executeShellCommand) {
		if (!tokens.includes("-g") && !tokens.includes("--global")) {
			const { stdout: npmPrefix } = await executeShellCommand({
				command: "npm",
				// eslint-disable-next-line @withfig/fig-linter/no-useless-arrays
				args: ["prefix"],
			});
			const { stdout: out } = await executeShellCommand({
				command: "cat",
				// eslint-disable-next-line @withfig/fig-linter/no-useless-arrays
				args: [`${npmPrefix}/package.json`],
			});
			const packageContent = JSON.parse(out);
			const dependencies = packageContent["dependencies"] ?? {};
			const devDependencies = packageContent["devDependencies"];
			const optionalDependencies = packageContent["optionalDependencies"] ?? {};
			Object.assign(dependencies, devDependencies, optionalDependencies);

			return Object.keys(dependencies)
				.filter((pkgName) => {
					const isListed = tokens.some((current) => current === pkgName);
					return !isListed;
				})
				.map((pkgName) => ({
					name: pkgName,
					icon: "📦",
					description: dependencies[pkgName]
						? "dependency"
						: optionalDependencies[pkgName]
							? "optionalDependency"
							: "devDependency",
				}));
		} else {
			const { stdout } = await executeShellCommand({
				command: "bash",
				args: ["-c", "ls -1 `npm root -g`"],
			});
			return stdout.split("\n").map((name) => ({
				name,
				icon: "📦",
				description: "Global dependency",
			}));
		}
	},
};

/** Generator that lists package.json scripts (with the respect to the `fig` field) */
export const npmScriptsGenerator: Fig.Generator = {
	cache: {
		strategy: "stale-while-revalidate",
		cacheByDirectory: true,
	},
	script: [
		"bash",
		"-c",
		"until [[ -f package.json ]] || [[ $PWD = '/' ]]; do cd ..; done; cat package.json",
	],
	postProcess: function (out, [npmClient]) {
		if (out.trim() == "") {
			return [];
		}

		try {
			const packageContent = JSON.parse(out);
			const scripts = packageContent["scripts"];
			const figCompletions = packageContent["fig"] || {};

			if (scripts) {
				return Object.entries(scripts).map(([scriptName, scriptContents]) => {
					const icon =
						npmClient === "yarn"
							? "fig://icon?type=yarn"
							: "fig://icon?type=npm";
					const customScripts: Fig.Suggestion = figCompletions[scriptName];
					return {
						name: scriptName,
						icon,
						description: scriptContents as string,
						priority: 51,
						/**
						 * If there are custom definitions for the scripts
						 * we want to override the default values
						 * */
						...customScripts,
					};
				});
			}
		} catch (e) {
			console.error(e);
		}

		return [];
	},
};

const globalOption: Fig.Option = {
	name: ["-g", "--global"],
	description:
		"Operates in 'global' mode, so that packages are installed into the prefix folder instead of the current working directory",
};

const jsonOption: Fig.Option = {
	name: "--json",
	description: "Show output in json format",
};

const omitOption: Fig.Option = {
	name: "--omit",
	description: "Dependency types to omit from the installation tree on disk",
	args: {
		name: "Package type",
		default: "dev",
		suggestions: ["dev", "optional", "peer"],
	},
	isRepeatable: 3,
};

const parseableOption: Fig.Option = {
	name: ["-p", "--parseable"],
	description:
		"Output parseable results from commands that write to standard output",
};

const longOption: Fig.Option = {
	name: ["-l", "--long"],
	description: "Show extended information",
};

const workSpaceOptions: Fig.Option[] = [
	{
		name: ["-w", "--workspace"],
		description:
			"Enable running a command in the context of the configured workspaces of the current project",
		args: {
			name: "workspace",
			generators: workspaceGenerator,
			isVariadic: true,
		},
	},
	{
		name: ["-ws", "--workspaces"],
		description:
			"Enable running a command in the context of all the configured workspaces",
	},
];

const npmUninstallOptions: Fig.Option[] = [
	{
		name: ["-S", "--save"],
		description: "Package will be removed from your dependencies",
	},
	{
		name: ["-D", "--save-dev"],
		description: "Package will appear in your `devDependencies`",
	},
	{
		name: ["-O", "--save-optional"],
		description: "Package will appear in your `optionalDependencies`",
	},
	{
		name: "--no-save",
		description: "Prevents saving to `dependencies`",
	},
	{
		name: "-g",
		description: "Uninstall global package",
	},
	...workSpaceOptions,
];

const npmListOptions: Fig.Option[] = [
	{
		name: ["-a", "-all"],
		description: "Show all outdated or installed packages",
	},
	jsonOption,
	longOption,
	parseableOption,
	{
		name: "--depth",
		description: "The depth to go when recursing packages",
		args: { name: "depth" },
	},
	{
		name: "--link",
		description: "Limits output to only those packages that are linked",
	},
	{
		name: "--package-lock-only",
		description:
			"Current operation will only use the package-lock.json, ignoring node_modules",
	},
	{
		name: "--no-unicode",
		description: "Uses unicode characters in the tree output",
	},
	globalOption,
	omitOption,
	...workSpaceOptions,
];

const registryOption: Fig.Option = {
	name: "--registry",
	description: "The base URL of the npm registry",
	args: { name: "registry" },
};

const verboseOption: Fig.Option = {
	name: "--verbose",
	description: "Show extra information",
	args: { name: "verbose" },
};

const otpOption: Fig.Option = {
	name: "--otp",
	description: "One-time password from a two-factor authenticator",
	args: { name: "otp" },
};

const ignoreScriptsOption: Fig.Option = {
	name: "--ignore-scripts",
	description:
		"If true, npm does not run scripts specified in package.json files",
};

const scriptShellOption: Fig.Option = {
	name: "--script-shell",
	description:
		"The shell to use for scripts run with the npm exec, npm run and npm init <pkg> commands",
	args: { name: "script-shell" },
};

const dryRunOption: Fig.Option = {
	name: "--dry-run",
	description:
		"Indicates that you don't want npm to make any changes and that it should only report what it would have done",
};

const completionSpec: Fig.Spec = {
	name: "npm",
	parserDirectives: {
		flagsArePosixNoncompliant: true,
	},
	description: "Node package manager",
	subcommands: [
		{
			name: ["install", "i", "add"],
			description: "Install a package and its dependencies",
			args: {
				name: "package",
				isOptional: true,
				generators: npmSearchGenerator,
				debounce: true,
				isVariadic: true,
			},
			options: [
				{
					name: ["-P", "--save-prod"],
					description:
						"Package will appear in your `dependencies`. This is the default unless `-D` or `-O` are present",
				},
				{
					name: ["-D", "--save-dev"],
					description: "Package will appear in your `devDependencies`",
				},
				{
					name: ["-O", "--save-optional"],
					description: "Package will appear in your `optionalDependencies`",
				},
				{
					name: "--no-save",
					description: "Prevents saving to `dependencies`",
				},
				{
					name: ["-E", "--save-exact"],
					description:
						"Saved dependencies will be configured with an exact version rather than using npm's default semver range operator",
				},
				{
					name: ["-B", "--save-bundle"],
					description:
						"Saved dependencies will also be added to your bundleDependencies list",
				},
				globalOption,
				{
					name: "--global-style",
					description:
						"Causes npm to install the package into your local node_modules folder with the same layout it uses with the global node_modules folder",
				},
				{
					name: "--legacy-bundling",
					description:
						"Causes npm to install the package such that versions of npm prior to 1.4, such as the one included with node 0.8, can install the package",
				},
				{
					name: "--legacy-peer-deps",
					description:
						"Bypass peerDependency auto-installation. Emulate install behavior of NPM v4 through v6",
				},
				{
					name: "--strict-peer-deps",
					description:
						"If set to true, and --legacy-peer-deps is not set, then any conflicting peerDependencies will be treated as an install failure",
				},
				{
					name: "--no-package-lock",
					description: "Ignores package-lock.json files when installing",
				},
				registryOption,
				verboseOption,
				omitOption,
				ignoreScriptsOption,
				{
					name: "--no-audit",
					description:
						"Submit audit reports alongside the current npm command to the default registry and all registries configured for scopes",
				},
				{
					name: "--no-bin-links",
					description:
						"Tells npm to not create symlinks (or .cmd shims on Windows) for package executables",
				},
				{
					name: "--no-fund",
					description:
						"Hides the message at the end of each npm install acknowledging the number of dependencies looking for funding",
				},
				dryRunOption,
				...workSpaceOptions,
			],
		},
		{
			name: ["run", "run-script"],
			description: "Run arbitrary package scripts",
			options: [
				...workSpaceOptions,
				{
					name: "--if-present",
					description:
						"Npm will not exit with an error code when run-script is invoked for a script that isn't defined in the scripts section of package.json",
				},
				{
					name: "--silent",
					description: "",
				},
				ignoreScriptsOption,
				scriptShellOption,
				{
					name: "--",
					args: {
						name: "args",
						isVariadic: true,
						// TODO: load the spec based on the runned script (see yarn spec `yarnScriptParsedDirectives`)
					},
				},
			],
			args: {
				name: "script",
				description: "Script to run from your package.json",
				filterStrategy: "fuzzy",
				generators: npmScriptsGenerator,
			},
		},
		{
			name: "init",
			description: "Trigger the initialization",
			options: [
				{
					name: ["-y", "--yes"],
					description:
						"Automatically answer 'yes' to any prompts that npm might print on the command line",
				},
				{
					name: "-w",
					description:
						"Create the folders and boilerplate expected while also adding a reference to your project workspaces property",
					args: { name: "dir" },
				},
			],
		},
		{ name: "access", description: "Set access controls on private packages" },
		{
			name: ["adduser", "login"],
			description: "Add a registry user account",
			options: [
				registryOption,
				{
					name: "--scope",
					description:
						"Associate an operation with a scope for a scoped registry",
					args: {
						name: "scope",
						description: "Scope name",
					},
				},
			],
		},
		{
			name: "audit",
			description: "Run a security audit",
			subcommands: [
				{
					name: "fix",
					description:
						"If the fix argument is provided, then remediations will be applied to the package tree",
					options: [
						dryRunOption,
						{
							name: ["-f", "--force"],
							description:
								"Removes various protections against unfortunate side effects, common mistakes, unnecessary performance degradation, and malicious input",
							isDangerous: true,
						},
						...workSpaceOptions,
					],
				},
			],
			options: [
				...workSpaceOptions,
				{
					name: "--audit-level",
					description:
						"The minimum level of vulnerability for npm audit to exit with a non-zero exit code",
					args: {
						name: "audit",
						suggestions: [
							"info",
							"low",
							"moderate",
							"high",
							"critical",
							"none",
						],
					},
				},
				{
					name: "--package-lock-only",
					description:
						"Current operation will only use the package-lock.json, ignoring node_modules",
				},
				jsonOption,
				omitOption,
			],
		},
		{
			name: "bin",
			description: "Print the folder where npm will install executables",
			options: [globalOption],
		},
		{
			name: ["bugs", "issues"],
			description: "Report bugs for a package in a web browser",
			args: {
				name: "package",
				isOptional: true,
				generators: npmSearchGenerator,
				debounce: true,
				isVariadic: true,
			},
			options: [
				{
					name: "--no-browser",
					description: "Display in command line instead of browser",
					exclusiveOn: ["--browser"],
				},
				{
					name: "--browser",
					description:
						"The browser that is called by the npm bugs command to open websites",
					args: { name: "browser" },
					exclusiveOn: ["--no-browser"],
				},
				registryOption,
			],
		},
		{
			name: "cache",
			description: "Manipulates packages cache",
			subcommands: [
				{
					name: "add",
					description: "Add the specified packages to the local cache",
				},
				{
					name: "clean",
					description: "Delete all data out of the cache folder",
				},
				{
					name: "verify",
					description:
						"Verify the contents of the cache folder, garbage collecting any unneeded data, and verifying the integrity of the cache index and all cached data",
				},
			],
			options: [
				{
					name: "--cache",
					args: { name: "cache" },
					description: "The location of npm's cache directory",
				},
			],
		},
		{
			name: ["ci", "clean-install", "install-clean"],
			description: "Install a project with a clean slate",
			options: [
				{
					name: "--audit",
					description:
						'When "true" submit audit reports alongside the current npm command to the default registry and all registries configured for scopes',
					args: {
						name: "audit",
						suggestions: ["true", "false"],
					},
					exclusiveOn: ["--no-audit"],
				},
				{
					name: "--no-audit",
					description:
						"Do not submit audit reports alongside the current npm command",
					exclusiveOn: ["--audit"],
				},
				ignoreScriptsOption,
				scriptShellOption,
				verboseOption,
				registryOption,
			],
		},
		{
			name: "cit",
			description: "Install a project with a clean slate and run tests",
		},
		{
			name: "clean-install-test",
			description: "Install a project with a clean slate and run tests",
		},
		{ name: "completion", description: "Tab completion for npm" },
		{
			name: ["config", "c"],
			description: "Manage the npm configuration files",
			subcommands: [
				{
					name: "set",
					description: "Sets the config key to the value",
					args: [{ name: "key" }, { name: "value" }],
					options: [
						{ name: ["-g", "--global"], description: "Sets it globally" },
					],
				},
				{
					name: "get",
					description: "Echo the config value to stdout",
					args: { name: "key" },
				},
				{
					name: "list",
					description: "Show all the config settings",
					options: [
						{ name: "-g", description: "Lists globally installed packages" },
						{ name: "-l", description: "Also shows defaults" },
						jsonOption,
					],
				},
				{
					name: "delete",
					description: "Deletes the key from all configuration files",
					args: { name: "key" },
				},
				{
					name: "edit",
					description: "Opens the config file in an editor",
					options: [
						{ name: "--global", description: "Edits the global config" },
					],
				},
			],
		},
		{ name: "create", description: "Create a package.json file" },
		{
			name: ["dedupe", "ddp"],
			description: "Reduce duplication in the package tree",
		},
		{
			name: "deprecate",
			description: "Deprecate a version of a package",
			options: [registryOption],
		},
		{ name: "dist-tag", description: "Modify package distribution tags" },
		{
			name: ["docs", "home"],
			description: "Open documentation for a package in a web browser",
			args: {
				name: "package",
				isOptional: true,
				generators: npmSearchGenerator,
				debounce: true,
				isVariadic: true,
			},
			options: [
				...workSpaceOptions,
				registryOption,
				{
					name: "--no-browser",
					description: "Display in command line instead of browser",
					exclusiveOn: ["--browser"],
				},
				{
					name: "--browser",
					description:
						"The browser that is called by the npm docs command to open websites",
					args: { name: "browser" },
					exclusiveOn: ["--no-browser"],
				},
			],
		},
		{
			name: "doctor",
			description: "Check your npm environment",
			options: [registryOption],
		},
		{
			name: "edit",
			description: "Edit an installed package",
			options: [
				{
					name: "--editor",
					description: "The command to run for npm edit or npm config edit",
				},
			],
		},
		{
			name: "explore",
			description: "Browse an installed package",
			args: {
				name: "package",
				filterStrategy: "fuzzy",
				generators: dependenciesGenerator,
			},
		},
		{ name: "fund", description: "Retrieve funding information" },
		{ name: "get", description: "Echo the config value to stdout" },
		{
			name: "help",
			description: "Get help on npm",
			args: {
				name: "term",
				isVariadic: true,
				description: "Terms to search for",
			},
			options: [
				{
					name: "--viewer",
					description: "The program to use to view help content",
					args: {
						name: "viewer",
					},
				},
			],
		},
		{
			name: "help-search",
			description: "Search npm help documentation",
			args: {
				name: "text",
				description: "Text to search for",
			},
			options: [longOption],
		},
		{ name: "hook", description: "Manage registry hooks" },
		{
			name: "install-ci-test",
			description: "Install a project with a clean slate and run tests",
		},
		{ name: "install-test", description: "Install package(s) and run tests" },
		{ name: "it", description: "Install package(s) and run tests" },
		{
			name: "link",
			description: "Symlink a package folder",
			args: { name: "path", template: "filepaths" },
		},
		{ name: "ln", description: "Symlink a package folder" },
		{
			name: "logout",
			description: "Log out of the registry",
			options: [
				registryOption,
				{
					name: "--scope",
					description:
						"Associate an operation with a scope for a scoped registry",
					args: {
						name: "scope",
						description: "Scope name",
					},
				},
			],
		},
		{
			name: ["ls", "list"],
			description: "List installed packages",
			options: npmListOptions,
			args: { name: "[@scope]/pkg", isVariadic: true },
		},
		{
			name: "org",
			description: "Manage orgs",
			subcommands: [
				{
					name: "set",
					description: "Add a user to an org or manage roles",
					args: [
						{
							name: "orgname",
							description: "Organization name",
						},
						{
							name: "username",
							description: "User name",
						},
						{
							name: "role",
							isOptional: true,
							suggestions: ["developer", "admin", "owner"],
						},
					],
					options: [registryOption, otpOption],
				},
				{
					name: "rm",
					description: "Remove a user from an org",
					args: [
						{
							name: "orgname",
							description: "Organization name",
						},
						{
							name: "username",
							description: "User name",
						},
					],
					options: [registryOption, otpOption],
				},
				{
					name: "ls",
					description:
						"List users in an org or see what roles a particular user has in an org",
					args: [
						{
							name: "orgname",
							description: "Organization name",
						},
						{
							name: "username",
							description: "User name",
							isOptional: true,
						},
					],
					options: [registryOption, otpOption, jsonOption, parseableOption],
				},
			],
		},
		{
			name: "outdated",
			description: "Check for outdated packages",
			args: {
				name: "[<@scope>/]<pkg>",
				isVariadic: true,
				isOptional: true,
			},
			options: [
				{
					name: ["-a", "-all"],
					description: "Show all outdated or installed packages",
				},
				jsonOption,
				longOption,
				parseableOption,
				{
					name: "-g",
					description: "Checks globally",
				},
				...workSpaceOptions,
			],
		},
		{
			name: ["owner", "author"],
			description: "Manage package owners",
			subcommands: [
				{
					name: "ls",
					description:
						"List all the users who have access to modify a package and push new versions. Handy when you need to know who to bug for help",
					args: { name: "[@scope/]pkg" },
					options: [registryOption],
				},
				{
					name: "add",
					description:
						"Add a new user as a maintainer of a package. This user is enabled to modify metadata, publish new versions, and add other owners",
					args: [{ name: "user" }, { name: "[@scope/]pkg" }],
					options: [registryOption, otpOption],
				},
				{
					name: "rm",
					description:
						"Remove a user from the package owner list. This immediately revokes their privileges",
					args: [{ name: "user" }, { name: "[@scope/]pkg" }],
					options: [registryOption, otpOption],
				},
			],
		},
		{
			name: "pack",
			description: "Create a tarball from a package",
			args: {
				name: "[<@scope>/]<pkg>",
			},
			options: [
				jsonOption,
				dryRunOption,
				...workSpaceOptions,
				{
					name: "--pack-destination",
					description: "Directory in which npm pack will save tarballs",
					args: {
						name: "pack-destination",
						template: ["folders"],
					},
				},
			],
		},
		{
			name: "ping",
			description: "Ping npm registry",
			options: [registryOption],
		},
		{
			name: "pkg",
			description: "Manages your package.json",
			subcommands: [
				{
					name: "get",
					description:
						"Retrieves a value key, defined in your package.json file. It is possible to get multiple values and values for child fields",
					args: {
						name: "field",
						description:
							"Name of the field to get. You can view child fields by separating them with a period",
						isVariadic: true,
					},
					options: [jsonOption, ...workSpaceOptions],
				},
				{
					name: "set",
					description:
						"Sets a value in your package.json based on the field value. It is possible to set multiple values and values for child fields",
					args: {
						// Format is <field>=<value>. How to achieve this?
						name: "field",
						description:
							"Name of the field to set. You can set child fields by separating them with a period",
						isVariadic: true,
					},
					options: [
						jsonOption,
						...workSpaceOptions,
						{
							name: ["-f", "--force"],
							description:
								"Removes various protections against unfortunate side effects, common mistakes, unnecessary performance degradation, and malicious input. Allow clobbering existing values in npm pkg",
							isDangerous: true,
						},
					],
				},
				{
					name: "delete",
					description: "Deletes a key from your package.json",
					args: {
						name: "key",
						description:
							"Name of the key to delete. You can delete child fields by separating them with a period",
						isVariadic: true,
					},
					options: [
						...workSpaceOptions,
						{
							name: ["-f", "--force"],
							description:
								"Removes various protections against unfortunate side effects, common mistakes, unnecessary performance degradation, and malicious input. Allow clobbering existing values in npm pkg",
							isDangerous: true,
						},
					],
				},
			],
		},
		{
			name: "prefix",
			description: "Display prefix",
			options: [
				{
					name: ["-g", "--global"],
					description: "Print the global prefix to standard out",
				},
			],
		},
		{
			name: "profile",
			description: "Change settings on your registry profile",
			subcommands: [
				{
					name: "get",
					description:
						"Display all of the properties of your profile, or one or more specific properties",
					args: {
						name: "property",
						isOptional: true,
						description: "Property name",
					},
					options: [registryOption, jsonOption, parseableOption, otpOption],
				},
				{
					name: "set",
					description: "Set the value of a profile property",
					args: [
						{
							name: "property",
							description: "Property name",
							suggestions: [
								"email",
								"fullname",
								"homepage",
								"freenode",
								"twitter",
								"github",
							],
						},
						{
							name: "value",
							description: "Property value",
						},
					],
					options: [registryOption, jsonOption, parseableOption, otpOption],
					subcommands: [
						{
							name: "password",
							description:
								"Change your password. This is interactive, you'll be prompted for your current password and a new password",
						},
					],
				},
				{
					name: "enable-2fa",
					description: "Enables two-factor authentication",
					args: {
						name: "mode",
						description:
							"Mode for two-factor authentication. Defaults to auth-and-writes mode",
						isOptional: true,
						suggestions: [
							{
								name: "auth-only",
								description:
									"Require an OTP when logging in or making changes to your account's authentication",
							},
							{
								name: "auth-and-writes",
								description:
									"Requires an OTP at all the times auth-only does, and also requires one when publishing a module, setting the latest dist-tag, or changing access via npm access and npm owner",
							},
						],
					},
					options: [registryOption, otpOption],
				},
				{
					name: "disable-2fa",
					description: "Disables two-factor authentication",
					options: [registryOption, otpOption],
				},
			],
		},
		{
			name: "prune",
			description: "Remove extraneous packages",
			args: {
				name: "[<@scope>/]<pkg>",
				isOptional: true,
			},
			options: [
				omitOption,
				dryRunOption,
				jsonOption,
				{
					name: "--production",
					description: "Remove the packages specified in your devDependencies",
				},
				...workSpaceOptions,
			],
		},
		{
			name: "publish",
			description: "Publish a package",
			args: {
				name: "tarball|folder",
				isOptional: true,
				description:
					"A url or file path to a gzipped tar archive containing a single folder with a package.json file inside | A folder containing a package.json file",
				template: ["folders"],
			},
			options: [
				{
					name: "--tag",
					description: "Registers the published package with the given tag",
					args: { name: "tag" },
				},
				...workSpaceOptions,
				{
					name: "--access",
					description:
						"Sets scoped package to be publicly viewable if set to 'public'",
					args: {
						default: "restricted",
						suggestions: ["restricted", "public"],
					},
				},
				dryRunOption,
				otpOption,
			],
		},
		{
			name: ["rebuild", "rb"],
			description: "Rebuild a package",
			args: {
				name: "[<@scope>/]<pkg>[@<version>]",
			},
			options: [
				globalOption,
				...workSpaceOptions,
				ignoreScriptsOption,
				{
					name: "--no-bin-links",
					description:
						"Tells npm to not create symlinks (or .cmd shims on Windows) for package executables",
				},
			],
		},
		{
			name: "repo",
			description: "Open package repository page in the browser",
			args: {
				name: "package",
				isOptional: true,
				generators: npmSearchGenerator,
				debounce: true,
				isVariadic: true,
			},
			options: [
				...workSpaceOptions,
				{
					name: "--no-browser",
					description: "Display in command line instead of browser",
					exclusiveOn: ["--browser"],
				},
				{
					name: "--browser",
					description:
						"The browser that is called by the npm repo command to open websites",
					args: { name: "browser" },
					exclusiveOn: ["--no-browser"],
				},
			],
		},
		{
			name: "restart",
			description: "Restart a package",
			options: [
				ignoreScriptsOption,
				scriptShellOption,
				{
					name: "--",
					args: {
						name: "arg",
						description: "Arguments to be passed to the restart script",
					},
				},
			],
		},
		{
			name: "root",
			description: "Display npm root",
			options: [
				{
					name: ["-g", "--global"],
					description:
						"Print the effective global node_modules folder to standard out",
				},
			],
		},
		{
			name: ["search", "s", "se", "find"],
			description: "Search for packages",
			args: {
				name: "search terms",
				isVariadic: true,
			},
			options: [
				longOption,
				jsonOption,
				{
					name: "--color",
					description: "Show colors",
					args: {
						name: "always",
						suggestions: ["always"],
						description: "Always show colors",
					},
					exclusiveOn: ["--no-color"],
				},
				{
					name: "--no-color",
					description: "Do not show colors",
					exclusiveOn: ["--color"],
				},
				parseableOption,
				{
					name: "--no-description",
					description: "Do not show descriptions",
				},
				{
					name: "--searchopts",
					description:
						"Space-separated options that are always passed to search",
					args: {
						name: "searchopts",
					},
				},
				{
					name: "--searchexclude",
					description:
						"Space-separated options that limit the results from search",
					args: {
						name: "searchexclude",
					},
				},
				registryOption,
				{
					name: "--prefer-online",
					description:
						"If true, staleness checks for cached data will be forced, making the CLI look for updates immediately even for fresh package data",
					exclusiveOn: ["--prefer-offline", "--offline"],
				},
				{
					name: "--prefer-offline",
					description:
						"If true, staleness checks for cached data will be bypassed, but missing data will be requested from the server",
					exclusiveOn: ["--prefer-online", "--offline"],
				},
				{
					name: "--offline",
					description:
						"Force offline mode: no network requests will be done during install",
					exclusiveOn: ["--prefer-online", "--prefer-offline"],
				},
			],
		},
		{ name: "set", description: "Sets the config key to the value" },
		{
			name: "set-script",
			description: "Set tasks in the scripts section of package.json",
			args: [
				{
					name: "script",
					description:
						"Name of the task to be added to the scripts section of package.json",
				},
				{
					name: "command",
					description: "Command to run when script is called",
				},
			],
			options: workSpaceOptions,
		},
		{
			name: "shrinkwrap",
			description: "Lock down dependency versions for publication",
		},
		{
			name: "star",
			description: "Mark your favorite packages",
			args: {
				name: "pkg",
				description: "Package to mark as favorite",
			},
			options: [
				registryOption,
				{
					name: "--no-unicode",
					description: "Do not use unicode characters in the tree output",
				},
			],
		},
		{
			name: "stars",
			description: "View packages marked as favorites",
			args: {
				name: "user",
				isOptional: true,
				description: "View packages marked as favorites by <user>",
			},
			options: [registryOption],
		},
		{
			name: "start",
			description: "Start a package",
			options: [
				ignoreScriptsOption,
				scriptShellOption,
				{
					name: "--",
					args: {
						name: "arg",
						description: "Arguments to be passed to the start script",
					},
				},
			],
		},
		{
			name: "stop",
			description: "Stop a package",
			options: [
				ignoreScriptsOption,
				scriptShellOption,
				{
					name: "--",
					args: {
						name: "arg",
						description: "Arguments to be passed to the stop script",
					},
				},
			],
		},
		{
			name: "team",
			description: "Manage organization teams and team memberships",
			subcommands: [
				{
					name: "create",
					args: { name: "scope:team" },
					options: [registryOption, otpOption],
				},
				{
					name: "destroy",
					args: { name: "scope:team" },
					options: [registryOption, otpOption],
				},
				{
					name: "add",
					args: [{ name: "scope:team" }, { name: "user" }],
					options: [registryOption, otpOption],
				},
				{
					name: "rm",
					args: [{ name: "scope:team" }, { name: "user" }],
					options: [registryOption, otpOption],
				},
				{
					name: "ls",
					args: { name: "scope|scope:team" },
					options: [registryOption, jsonOption, parseableOption],
				},
			],
		},
		{
			name: ["test", "tst", "t"],
			description: "Test a package",
			options: [ignoreScriptsOption, scriptShellOption],
		},
		{
			name: "token",
			description: "Manage your authentication tokens",
			subcommands: [
				{
					name: "list",
					description: "Shows a table of all active authentication tokens",
					options: [jsonOption, parseableOption],
				},
				{
					name: "create",
					description: "Create a new authentication token",
					options: [
						{
							name: "--read-only",
							description:
								"This is used to mark a token as unable to publish when configuring limited access tokens with the npm token create command",
						},
						{
							name: "--cidr",
							description:
								"This is a list of CIDR address to be used when configuring limited access tokens with the npm token create command",
							isRepeatable: true,
							args: {
								name: "cidr",
							},
						},
					],
				},
				{
					name: "revoke",
					description:
						"Immediately removes an authentication token from the registry. You will no longer be able to use it",
					args: { name: "idtoken" },
				},
			],
			options: [registryOption, otpOption],
		},
		uninstallSubcommand("uninstall"),
		uninstallSubcommand(["r", "rm"]),
		uninstallSubcommand("un"),
		uninstallSubcommand("remove"),
		uninstallSubcommand("unlink"),
		{
			name: "unpublish",
			description: "Remove a package from the registry",
			args: {
				name: "[<@scope>/]<pkg>[@<version>]",
			},
			options: [
				dryRunOption,
				{
					name: ["-f", "--force"],
					description:
						"Allow unpublishing all versions of a published package. Removes various protections against unfortunate side effects, common mistakes, unnecessary performance degradation, and malicious input",
					isDangerous: true,
				},
				...workSpaceOptions,
			],
		},
		{
			name: "unstar",
			description: "Remove an item from your favorite packages",
			args: {
				name: "pkg",
				description: "Package to unmark as favorite",
			},
			options: [
				registryOption,
				otpOption,
				{
					name: "--no-unicode",
					description: "Do not use unicode characters in the tree output",
				},
			],
		},
		{
			name: ["update", "upgrade", "up"],
			description: "Update a package",
			options: [
				{ name: "-g", description: "Update global package" },
				{
					name: "--global-style",
					description:
						"Causes npm to install the package into your local node_modules folder with the same layout it uses with the global node_modules folder",
				},
				{
					name: "--legacy-bundling",
					description:
						"Causes npm to install the package such that versions of npm prior to 1.4, such as the one included with node 0.8, can install the package",
				},
				{
					name: "--strict-peer-deps",
					description:
						"If set to true, and --legacy-peer-deps is not set, then any conflicting peerDependencies will be treated as an install failure",
				},
				{
					name: "--no-package-lock",
					description: "Ignores package-lock.json files when installing",
				},
				omitOption,
				ignoreScriptsOption,
				{
					name: "--no-audit",
					description:
						"Submit audit reports alongside the current npm command to the default registry and all registries configured for scopes",
				},
				{
					name: "--no-bin-links",
					description:
						"Tells npm to not create symlinks (or .cmd shims on Windows) for package executables",
				},
				{
					name: "--no-fund",
					description:
						"Hides the message at the end of each npm install acknowledging the number of dependencies looking for funding",
				},
				{
					name: "--save",
					description:
						"Update the semver values of direct dependencies in your project package.json",
				},
				dryRunOption,
				...workSpaceOptions,
			],
		},
		{
			name: "version",
			description: "Bump a package version",
			options: [
				...workSpaceOptions,
				jsonOption,
				{
					name: "--allow-same-version",
					description:
						"Prevents throwing an error when npm version is used to set the new version to the same value as the current version",
				},
				{
					name: "--no-commit-hooks",
					description:
						"Do not run git commit hooks when using the npm version command",
				},
				{
					name: "--no-git-tag-version",
					description:
						"Do not tag the commit when using the npm version command",
				},
				{
					name: "--preid",
					description:
						'The "prerelease identifier" to use as a prefix for the "prerelease" part of a semver. Like the rc in 1.2.0-rc.8',
					args: {
						name: "prerelease-id",
					},
				},
				{
					name: "--sign-git-tag",
					description:
						"If set to true, then the npm version command will tag the version using -s to add a signature",
				},
			],
		},
		{
			name: ["view", "v", "info", "show"],
			description: "View registry info",
			options: [...workSpaceOptions, jsonOption],
		},
		{
			name: "whoami",
			description: "Display npm username",
			options: [registryOption],
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/nvm.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/nvm.ts

```typescript
// args
const version: Fig.Arg = {
	name: "version",
	description: "Node version",
	suggestions: [
		{
			name: "node",
			description: "The latest version of node",
		},
		{
			name: "iojs",
			description: "The latest version of io.js",
		},
		{
			name: "system",
			description: "System-installed version of node",
		},
	],
};

const command: Fig.Arg = {
	name: "command",
	isVariadic: true,
};

const args: Fig.Arg = {
	name: "args",
	isVariadic: true,
};

const name: Fig.Arg = {
	name: "name",
};

const ltsName: Fig.Arg = {
	name: "LTS name",
};

const colorCodes: Fig.Arg = {
	name: "color codes",
	description: 'Using format "yMeBg"',
};

// options
const noColors: Fig.Option = {
	name: "--no-colors",
	description: "Suppress colored output",
};

const noAlias: Fig.Option = {
	name: "--no-alias",
	description: "Suppress `nvm alias` output",
};

const silent: Fig.Option = {
	name: "--silent",
	description: "Silences stdout/stderr output",
};

const lts: Fig.Option = {
	name: "--lts",
	description:
		"Uses automatic LTS (long-term support) alias `lts/*`, if available",
};

const ltsWithName: Fig.Option = {
	name: "--lts",
	description: "Uses automatic alias for provided LTS line, if available",
	args: ltsName,
};

const completionSpec: Fig.Spec = {
	name: "nvm",
	description: "Node Package Manager",
	subcommands: [
		{
			name: "install",
			description:
				"Download and install a <version>. Uses .nvmrc if available and version is omitted",
			args: { ...version, isOptional: true },
			options: [
				{
					name: "-s",
					description: "Skip binary download, install from source only",
				},
				{
					name: "--reinstall-packages-from",
					description:
						"When installing, reinstall packages installed in <version>",
					args: version,
				},
				{
					...lts,
					description:
						"When installing, only select from LTS (long-term support) versions",
				},
				{
					...ltsWithName,
					description:
						"When installing, only select from versions for a specific LTS line",
				},
				{
					name: "--skip-default-packages",
					description:
						"When installing, skip the default-packages file if it exists",
				},
				{
					name: "--latest-npm",
					description:
						"After installing, attempt to upgrade to the latest working npm on the given node version",
				},
				{
					name: "--no-progress",
					description: "Disable the progress bar on any downloads",
				},
				{
					name: "--alias",
					description:
						"After installing, set the alias specified to the version specified. (same as: nvm alias <name> <version>)",
					args: name,
				},
				{
					name: "--default",
					description:
						"After installing, set default alias to the version specified. (same as: nvm alias default <version>)",
				},
			],
		},
		{
			name: "uninstall",
			description: "Uninstall a version",
			args: version,
			options: [
				{
					...lts,
					description:
						"Uninstall using automatic LTS (long-term support) alias `lts/*`, if available",
				},
				{
					...ltsWithName,
					description:
						"Uninstall using automatic alias for provided LTS line, if available",
				},
			],
		},
		{
			name: "use",
			description:
				"Modify PATH to use <version>. Uses .nvmrc if available and version is omitted",
			args: { ...version, isOptional: true },
			options: [silent, lts, ltsWithName],
		},
		{
			name: "exec",
			description:
				"Run <command> on <version>. Uses .nvmrc if available and version is omitted",
			args: [{ ...version, isOptional: true }, command],
			options: [silent, lts, ltsWithName],
		},
		{
			name: "run",
			description:
				"Run `node` on <version> with <args> as arguments. Uses .nvmrc if available and version is omitted",
			args: [{ ...version, isOptional: true }, args],
			options: [silent, lts, ltsWithName],
		},
		{
			name: "current",
			description: "Display currently activated version of Node",
		},
		{
			name: "ls",
			description:
				"List installed versions, matching a given <version> if provided",
			args: version,
			options: [noColors, noAlias],
		},
		{
			name: "ls-remote",
			description:
				"List remote versions available for install, matching a given <version> if provided",
			args: version,
			options: [
				{
					...lts,
					description:
						"When listing, only show LTS (long-term support) versions",
				},
				{
					...ltsWithName,
					description:
						"When listing, only show versions for a specific LTS line",
				},
				noColors,
			],
		},
		{
			name: "version",
			description: "Resolve the given description to a single local version",
			args: version,
		},
		{
			name: "version-remote",
			description: "Resolve the given description to a single remote version",
			args: version,
			options: [
				{
					...lts,
					description:
						"When listing, only show LTS (long-term support) versions",
				},
				{
					...ltsWithName,
					description:
						"When listing, only show versions for a specific LTS line",
				},
			],
		},
		{
			name: "deactivate",
			description: "Undo effects of `nvm` on current shell",
			options: [silent],
		},
		{
			name: "alias",
			description:
				"Show all aliases beginning with <pattern> or Set an alias named <name> pointing to <version>",
			args: [
				{
					name: "pattern or name",
					description: "Pattern or name",
				},
				{
					name: "version",
					isOptional: true,
				},
			],
		},
		{
			name: "unalias",
			description: "Deletes the alias named <name>",
			args: name,
		},
		{
			name: "install-latest-npm",
			description:
				"Attempt to upgrade to the latest working `npm` on the current node version",
		},
		{
			name: "reinstall-packages",
			description:
				"Reinstall global `npm` packages contained in <version> to current version",
			args: version,
		},
		{
			name: "unload",
			description: "Unload `nvm` from shell",
		},
		{
			name: "which",
			description:
				"Display path to installed node version. Uses .nvmrc if available and version is omitted",
			args: { ...version, isOptional: true },
			subcommands: [
				{
					name: "current",
				},
			],
			options: [
				{
					...silent,
					description:
						"Silences stdout/stderr output when a version is omitted",
				},
			],
		},
		{
			name: "cache",
			args: {
				suggestions: [
					{
						name: "dir",
						description: "Display path to the cache directory for nvm",
						type: "subcommand",
					},
					{
						name: "clear",
						description: "Empty cache directory for nvm",
						type: "subcommand",
					},
				],
			},
		},
		{
			name: "set-colors",
			description:
				'Set five text colors using format "yMeBg". Available when supported',
			args: colorCodes,
		},
	],
	options: [
		{
			name: "--help",
			description: "Show help page",
		},
		{
			name: "--version",
			description: "Print out the installed version of nvm",
		},
		noColors,
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/od.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/od.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "od",
	description: "Octal, decimal, hex, ASCII dump",
	parserDirectives: {
		optionsMustPrecedeArguments: true,
	},
	options: [
		{
			name: "-A",
			description: `Specify the input address base.  The argument base may be
one of d, o, x or n, which specify decimal, octal,
hexadecimal addresses or no address, respectively`,
			args: {
				name: "base",
				suggestions: ["d", "o", "x", "n"],
				default: "d",
			},
		},
		{
			name: "-a",
			description: "Output named characters.  Equivalent to -t a",
		},
		{
			name: ["-B", "-o"],
			description: "Output octal shorts.  Equivalent to -t o2",
		},
		{
			name: "-b",
			description: "Output octal bytes.  Equivalent to -t o1",
		},
		{
			name: "-c",
			description: "Output C-style escaped characters.  Equivalent to -t c",
		},
		{
			name: "-D",
			description: "Output unsigned decimal ints.  Equivalent to -t u4",
		},
		{
			name: "-d",
			description: "Output unsigned decimal shorts.  Equivalent to -t u2",
		},
		{
			name: ["-e", "-F"],
			description:
				"Output double-precision floating point numbers.  Equivalent to -t fD",
		},
		{
			name: "-f",
			description:
				"Output single-precision floating point numbers.  Equivalent to -t fF",
		},
		{
			name: ["-H", "-X"],
			description: "Output hexadecimal ints.  Equivalent to -t x4",
		},
		{
			name: ["-h", "-x"],
			description: "Output hexadecimal shorts.  Equivalent to -t x2",
		},
		{
			name: ["-I", "-L", "-l"],
			description: "Output signed decimal longs.  Equivalent to -t dL",
		},
		{
			name: "-i",
			description: "Output signed decimal ints.  Equivalent to -t dI",
		},
		{
			name: "-j",
			description: `Skip skip bytes of the combined input before dumping.  The
number may be followed by one of b, k, m or g which
specify the units of the number as blocks (512 bytes),
kilobytes, megabytes and gigabytes, respectively`,
			args: {
				name: "skip",
			},
		},
		{
			name: "-N",
			description: "Dump at most length bytes of input",
			args: {
				name: "length",
			},
		},
		{
			name: "-O",
			description: "Output octal ints.  Equivalent to -t o4",
		},
		{
			name: "-s",
			description: "Output signed decimal shorts.  Equivalent to -t d2",
		},
		{
			name: "-t",
			description: `Specify the output format.  The type argument is a string
containing one or more of the following kinds of type specificers: a,
c, [d|o|u|x][C|S|I|L|n], or f[F|D|L|n]. See the man page for meanings`,
			args: {
				name: "type",
				suggestions: [
					"a",
					"c",
					"dC",
					"dS",
					"dI",
					"dL",
					"dn",
					"oC",
					"oS",
					"oI",
					"oL",
					"on",
					"uC",
					"uS",
					"uI",
					"uL",
					"un",
					"xC",
					"xS",
					"xI",
					"xL",
					"xn",
					"fF",
					"fD",
					"fL",
					"fn",
				],
			},
		},
		{
			name: "-v",
			description:
				"Write all input data, instead of replacing lines of duplicate values with a '*'",
		},
	],
	args: [
		{
			name: "[+]offset[.][Bb]",
			description: "Offset",
			suggestions: ["+0b"],
			default: "+0b",
			isOptional: true,
		},
		{
			name: "file",
			description: "File name",
			template: "filepaths",
			isOptional: true,
			isVariadic: true,
		},
	],
};
export default completionSpec;
```

--------------------------------------------------------------------------------

````
