---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 80
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 80 of 552)

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

---[FILE: extensions/terminal-suggest/src/completions/code.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/code.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { filepaths } from '../helpers/filepaths';

export const commonOptions: Fig.Option[] = [
	{
		name: '-',
		description: `Read from stdin (e.g. 'ps aux | grep code | code -')`,
	},
	{
		name: ['-d', '--diff'],
		description: 'Compare two files with each other',
		args: [
			{
				name: 'file',
				template: 'filepaths',
			},
			{
				name: 'file',
				template: 'filepaths',
			},
		],
	},
	{
		name: ['-m', '--merge'],
		description:
			'Perform a three-way merge by providing paths for two modified versions of a file, the common origin of both modified versions and the output file to save merge results',
		args: [
			{
				name: 'file',
				template: 'filepaths',
			},
			{
				name: 'file',
				template: 'filepaths',
			},
			{
				name: 'base',
				template: 'filepaths',
			},
			{
				name: 'result',
				template: 'filepaths',
			},
		],
	},
	{
		name: ['-a', '--add'],
		description: 'Add folder(s) to the last active window',
		args: {
			name: 'folder',
			template: 'folders',
			isVariadic: true,
		},
	},
	{
		name: '--remove',
		description: 'Remove folder(s) from the last active window',
		args: {
			name: 'folder',
			template: 'folders',
			isVariadic: true,
		},
	},
	{
		name: ['-g', '--goto'],
		description:
			'Open a file at the path on the specified line and character position',
		args: {
			name: 'file:line[:character]',
			template: 'filepaths',
		},
	},
	{
		name: ['-n', '--new-window'],
		description: 'Force to open a new window',
	},
	{
		name: ['-r', '--reuse-window'],
		description: 'Force to open a file or folder in an already opened window',
	},
	{
		name: ['-w', '--wait'],
		description: 'Wait for the files to be closed before returning',
	},
	{
		name: '--locale',
		description: 'The locale to use (e.g. en-US or zh-TW)',
		args: {
			name: 'locale',
			suggestions: [
				// Supported locales: https://code.visualstudio.com/docs/getstarted/locales#_available-locales
				// allow-any-unicode-next-line
				{ name: 'en', icon: '🇺🇸', description: 'English (US)' },
				// allow-any-unicode-next-line
				{ name: 'zh-CN', icon: '🇨🇳', description: 'Simplified Chinese' },
				// allow-any-unicode-next-line
				{ name: 'zh-TW', icon: '🇹🇼', description: 'Traditional Chinese' },
				// allow-any-unicode-next-line
				{ name: 'fr', icon: '🇫🇷', description: 'French' },
				// allow-any-unicode-next-line
				{ name: 'de', icon: '🇩🇪', description: 'German' },
				// allow-any-unicode-next-line
				{ name: 'it', icon: '🇮🇹', description: 'Italian' },
				// allow-any-unicode-next-line
				{ name: 'es', icon: '🇪🇸', description: 'Spanish' },
				// allow-any-unicode-next-line
				{ name: 'ja', icon: '🇯🇵', description: 'Japanese' },
				// allow-any-unicode-next-line
				{ name: 'ko', icon: '🇰🇷', description: 'Korean' },
				// allow-any-unicode-next-line
				{ name: 'ru', icon: '🇷🇺', description: 'Russian' },
				// allow-any-unicode-next-line
				{ name: 'bg', icon: '🇧🇬', description: 'Bulgarian' },
				// allow-any-unicode-next-line
				{ name: 'hu', icon: '🇭🇺', description: 'Hungarian' },
				// allow-any-unicode-next-line
				{ name: 'pt-br', icon: '🇧🇷', description: 'Portuguese (Brazil)' },
				// allow-any-unicode-next-line
				{ name: 'tr', icon: '🇹🇷', description: 'Turkish' },
			],
		},
	},
	{
		name: '--user-data-dir',
		description:
			'Specifies the directory that user data is kept in. Can be used to open multiple distinct instances of Code',
		args: {
			name: 'dir',
			template: 'folders',
		},
	},
	{
		name: '--profile',
		description:
			'Opens the provided folder or workspace with the given profile and associates the profile with the workspace. If the profile does not exist, a new empty one is created. A folder or workspace must be provided for the profile to take effect',
		args: {
			name: 'profileName',
		},
	},
	{
		name: ['-h', '--help'],
		description: 'Print usage',
	},
	{
		name: '--add-mcp',
		description: 'Adds a Model Context Protocol server definition to the user profile. Accepts JSON input in the form {"name":"server-name","command":...}',
		args: {
			name: 'json',
			description: 'JSON string for MCP server',
		},
	},
	{
		name: '--locate-shell-integration-path',
		description:
			'Print the path to the shell integration script for the provided shell',
		args: {
			isOptional: false,
			name: 'shell',
			description: 'The shell to locate the integration script for',
			suggestions: [
				'bash',
				'fish',
				'pwsh',
				'zsh',
			]
		}
	}
];

export const extensionManagementOptions = (cliName: string): Fig.Option[] => [
	{
		name: '--extensions-dir',
		description: 'Set the root path for extensions',
		args: {
			name: 'dir',
			template: 'folders',
		},
	},
	{
		name: '--list-extensions',
		description: 'List the installed extensions',
	},
	{
		name: '--show-versions',
		description:
			'Show versions of installed extensions, when using --list-extensions',
	},
	{
		name: '--category',
		description:
			'Filters installed extensions by provided category, when using --list-extensions',
		args: {
			name: 'category',
			suggestions: [
				'azure',
				'data science',
				'debuggers',
				'extension packs',
				'education',
				'formatters',
				'keymaps',
				'language packs',
				'linters',
				'machine learning',
				'notebooks',
				'programming languages',
				'scm providers',
				'snippets',
				'testing',
				'themes',
				'visualization',
				'other',
			],
		},
	},
	{
		name: '--install-extension',
		description:
			`Installs or updates an extension. The argument is either an extension id or a path to a VSIX. The identifier of an extension is '\${ publisher }.\${ name }'. Use '--force' argument to update to latest version. To install a specific version provide '@\${version}'. For example: 'vscode.csharp@1.2.3'`,
		args: {
			name: 'extension-id[@version] | path-to-vsix',
			generators: [
				createCodeGenerators(cliName),
				filepaths({
					extensions: ['vsix'],
				}),
			],
		},
	},
	{
		name: '--pre-release',
		description:
			'Installs the pre-release version of the extension, when using --install-extension',
	},
	{
		name: '--uninstall-extension',
		description: 'Uninstalls an extension',
		args: {
			name: 'extension-id',
			generators: createCodeGenerators(cliName)
		},
	},
	{
		name: '--update-extensions',
		description: 'Update the installed extensions',
	},
	{
		name: '--enable-proposed-api',
		description:
			'Enables proposed API features for extensions. Can receive one or more extension IDs to enable individually',
		args: {
			name: 'extension-id',
			generators: createCodeGenerators(cliName),
			isVariadic: true,
		}
	},
];

export const troubleshootingOptions = (cliName: string): Fig.Option[] => [
	{
		name: ['-v', '--version'],
		description: 'Print version',
	},
	{
		name: '--verbose',
		description: 'Print verbose output (implies --wait)',
	},
	{
		name: '--log',
		description: `Log level to use. Default is 'info'. Allowed values are 'critical', 'error', 'warn', 'info', 'debug', 'trace', 'off'. You can also configure the log level of an extension by passing extension id and log level in the following format: '{publisher}.{name}:{logLevel}'. For example: 'vscode.csharp:trace'. Can receive one or more such entries.`,
		isRepeatable: true,
		args: {
			name: 'level',
			description: 'Log level or \'publisher.name:logLevel\'',
			default: 'info',
			suggestions: [
				'critical',
				'error',
				'warn',
				'info',
				'debug',
				'trace',
				'off',
			],
		},
	},
	{
		name: ['-s', '--status'],
		description: 'Print process usage and diagnostics information',
	},
	{
		name: '--prof-startup',
		description: 'Run CPU profiler during startup',
	},
	{
		name: '--disable-extensions',
		description: 'Disable all installed extensions',
	},
	{
		name: '--disable-extension',
		description: 'Disable an extension',
		args: {
			name: 'extension-id',
			generators: createCodeGenerators(cliName)
		},
	},
	{
		name: '--sync',
		description: 'Turn sync on or off',
		args: {
			name: 'sync',
			description: 'Whether to enable sync',
			suggestions: ['on', 'off'],
		},
	},
	{
		name: '--inspect-extensions',
		description:
			'Allow debugging and profiling of extensions. Check the developer tools for the connection URI',
		args: {
			name: 'port',
		},
	},
	{
		name: '--inspect-brk-extensions',
		description:
			'Allow debugging and profiling of extensions with the extension host being paused after start. Check the developer tools for the connection URI',
		args: {
			name: 'port',
		},
	},
	{
		name: '--disable-gpu',
		description: 'Disable GPU hardware acceleration',
	},
	{
		name: '--disable-lcd-text',
		description: 'Disable LCD font rendering',
	},
	{
		name: '--disable-chromium-sandbox',
		description: 'Use this option only when there is requirement to launch the application as sudo user on Linux or when running as an elevated user in an applocker environment on Windows.',
	},
	{
		name: '--max-memory',
		description: 'Max memory size for a window (in Mbytes)',
		args: {
			name: 'memory',
			description: 'Memory in megabytes',
		},
	},
	{
		name: '--telemetry',
		description: 'Shows all telemetry events which VS code collects',
	},
	{
		name: '--transient',
		description: 'Run with temporary data and extension directories, as if launched for the first time.',
	},
];

export function createCodeGenerators(cliName: string): Fig.Generator {
	return {
		script: [cliName, '--list-extensions', '--show-versions', '--enable-proposed-api'],
		postProcess: parseInstalledExtensions
	};
}

export function parseInstalledExtensions(out: string): Fig.Suggestion[] | undefined {
	const extensions = out.split('\n').filter(Boolean).map((line) => {
		const [id, version] = line.split('@');
		return {
			name: id,
			type: 'option' as Fig.SuggestionType,
			description: `Version: ${version}`
		};
	});
	return extensions;
}

export const commonAuthOptions: Fig.Option[] = [
	{
		name: '--access-token',
		description: 'An access token to store for authentication',
		isRepeatable: true,
		args: {
			name: 'access_token',
			isOptional: true,
		},
	},
	{
		name: '--refresh-token',
		description: 'An access token to store for authentication',
		isRepeatable: true,
		args: {
			name: 'refresh_token',
			isOptional: true,
		},
	},
	{
		name: '--provider',
		description: 'The auth provider to use. If not provided, a prompt will be shown',
		isRepeatable: true,
		args: {
			name: 'provider',
			isOptional: true,
			suggestions: [
				'microsoft',
				'github',
			],
		},
	}
];

export const tunnelHelpOptions: Fig.Option[] = [
	{
		name: ['-h', '--help'],
		description: 'Print help',
	},
];

export const globalTunnelOptions: Fig.Option[] = [
	{
		name: '--cli-data-dir',
		description: 'Directory where CLI metadata should be stored',
		args: {
			name: 'cli_data_dir',
		},
	},
	{
		name: '--verbose',
		description: 'Print verbose output (implies --wait)',
	},
	{
		name: '--log',
		description: 'Log level to use',
		isRepeatable: true,
		args: {
			name: 'log',
			isOptional: true,
			suggestions: [
				'trace',
				'debug',
				'info',
				'warn',
				'error',
				'critical',
				'off',
			],
		},
	},
];


export const codeTunnelOptions = [
	{
		name: '--extensions-dir',
		description: 'Set the root path for extensions',
		isRepeatable: true,
		args: {
			name: 'extensions_dir',
			isOptional: true,
		},
	},
	{
		name: '--user-data-dir',
		description: 'Specifies the directory that user data is kept in. Can be used to open multiple distinct instances of the editor',
		isRepeatable: true,
		args: {
			name: 'user_data_dir',
			isOptional: true,
		},
	},
	{
		name: '--use-version',
		description: 'Sets the editor version to use for this command. The preferred version can be persisted with `code version use <version>`. Can be \'stable\', \'insiders\', a version number, or an absolute path to an existing install',
		isRepeatable: true,
		args: {
			name: 'use_version',
			isOptional: true,
		},
	},
];

export const extTunnelSubcommand = {
	name: 'ext',
	description: 'Manage editor extensions',
	subcommands: [
		{
			name: 'list',
			description: 'List installed extensions',
			options: [...globalTunnelOptions, ...tunnelHelpOptions,
			{
				name: '--category',
				description: 'Filters installed extensions by provided category, when using --list-extensions',
				isRepeatable: true,
				args: {
					name: 'category',
					isOptional: true,
				},
			},
			{
				name: '--show-versions',
				description: 'Show versions of installed extensions, when using --list-extensions',
			},
			]
		},
		{
			name: 'install',
			description: 'Install an extension',
			options: [...globalTunnelOptions, ...tunnelHelpOptions,
			{
				name: '--pre-release',
				description: 'Installs the pre-release version of the extension',
			},
			{
				name: '--donot-include-pack-and-dependencies',
				description: `Don't include installing pack and dependencies of the extension`,
			},
			{
				name: '--force',
				description: `Update to the latest version of the extension if it's already installed`,
			},
			],
			args: {
				name: 'ext-id | id',
				isVariadic: true,
				isOptional: true,
			},
		},
		{
			name: 'uninstall',
			description: 'Uninstall an extension',
			options: [...globalTunnelOptions, ...tunnelHelpOptions],
			args: {
				name: 'ext-id | id',
				isVariadic: true,
				isOptional: true,
			},
		},
		{
			name: 'update',
			description: 'Update the installed extensions',
			options: [...globalTunnelOptions, ...tunnelHelpOptions]
		},
	],
	...globalTunnelOptions,
	...codeTunnelOptions
};


export const codeTunnelSubcommands: Fig.Subcommand[] = [
	{
		name: 'tunnel',
		description: 'Create a tunnel that\'s accessible on vscode.dev from anywhere. Run`code tunnel --help` for more usage info',
		subcommands: [
			{
				name: 'prune',
				description: 'Delete all servers which are currently not running',
				options: [...globalTunnelOptions, ...tunnelHelpOptions],
			},
			{
				name: 'kill',
				description: 'Stops any running tunnel on the system',
				options: [...globalTunnelOptions, ...tunnelHelpOptions],
			},
			{
				name: 'restart',
				description: 'Restarts any running tunnel on the system',
				options: [...globalTunnelOptions, ...tunnelHelpOptions],
			},
			{
				name: 'status',
				description: 'Gets whether there is a tunnel running on the current machine',
				options: [...globalTunnelOptions, ...tunnelHelpOptions],
			},
			{
				name: 'rename',
				description: 'Rename the name of this machine associated with port forwarding service',
				options: [...globalTunnelOptions, ...tunnelHelpOptions],
				args: {
					name: 'name',
				},
			},
			{
				name: 'unregister',
				description: 'Remove this machine\'s association with the port forwarding service',
				options: [...globalTunnelOptions, ...tunnelHelpOptions],
			},
			{
				name: 'user',
				subcommands: [
					{
						name: 'login',
						description: 'Log in to port forwarding service',
						options: [...globalTunnelOptions, ...tunnelHelpOptions, ...commonAuthOptions],
					},
					{
						name: 'logout',
						description: 'Log out of port forwarding service',
						options: [...globalTunnelOptions, ...tunnelHelpOptions],
					},
					{
						name: 'show',
						description: 'Show the account that\'s logged into port forwarding service',
						options: [...globalTunnelOptions, ...tunnelHelpOptions],
					},
					{
						name: 'help',
						description: 'Print this message or the help of the given subcommand(s)',
						subcommands: [
							{ name: 'login', description: 'Log in to port forwarding service' },
							{ name: 'logout', description: 'Log out of port forwarding service' },
							{ name: 'show', description: 'Show the account that\'s logged into port forwarding service' },
							{ name: 'help', description: 'Print this message or the help of the given subcommand(s)' },
						],
					},
				],
			},
			{
				name: 'service',
				description: '(Preview) Manages the tunnel when installed as a system service,',
				subcommands: [
					{
						name: 'install',
						description: 'Installs or re-installs the tunnel service on the machine',
						options: [
							{
								name: '--name',
								description: 'Sets the machine name for port forwarding service',

								args: {
									name: 'name',

								},
							},
							{
								name: '--accept-server-license-terms',
								description: 'If set, the user accepts the server license terms and the server will be started without a user prompt',
							},
							...globalTunnelOptions, ...tunnelHelpOptions
						],
					},
					{
						name: 'uninstall',
						description: 'Uninstalls and stops the tunnel service',
						options: [...globalTunnelOptions, ...tunnelHelpOptions],
					},
					{
						name: 'log',
						description: 'Shows logs for the running service',
						options: [...globalTunnelOptions, ...tunnelHelpOptions],
					},
					{
						name: 'help',
						description: 'Print this message or the help of the given subcommand(s)',
						subcommands: [
							{ name: 'install', description: 'Installs or re-installs the tunnel service on the machine' },
							{ name: 'uninstall', description: 'Uninstalls and stops the tunnel service' },
							{ name: 'log', description: 'Shows logs for the running service' },
							{ name: 'help', description: 'Print this message or the help of the given subcommand(s)' },
						],
					},
				],
				options: [...globalTunnelOptions, ...tunnelHelpOptions],
			},
			{
				name: 'help',
				description: 'Print this message or the help of the given subcommand(s)',
				subcommands: [
					{ name: 'prune', description: 'Delete all servers which are currently not running' },
					{ name: 'kill', description: 'Stops any running tunnel on the system' },
					{ name: 'restart', description: 'Restarts any running tunnel on the system' },
					{ name: 'status', description: 'Gets whether there is a tunnel running on the current machine' },
					{ name: 'rename', description: 'Rename the name of this machine associated with port forwarding service' },
					{ name: 'unregister', description: 'Remove this machine\'s association with the port forwarding service' },
					{
						name: 'user',
						subcommands: [
							{ name: 'login', description: 'Log in to port forwarding service' },
							{ name: 'logout', description: 'Log out of port forwarding service' },
							{ name: 'show', description: 'Show the account that\'s logged into port forwarding service' },
						],
					},
					{
						name: 'service',
						description: '(Preview) Manages the tunnel when installed as a system service,',
						subcommands: [
							{ name: 'install', description: 'Installs or re-installs the tunnel service on the machine' },
							{ name: 'uninstall', description: 'Uninstalls and stops the tunnel service' },
							{ name: 'log', description: 'Shows logs for the running service' },
						],
					},
					{ name: 'help', description: 'Print this message or the help of the given subcommand(s)' },
				],
			},
		],
		options: [
			{
				name: '--install-extension',
				description: 'Requests that extensions be preloaded and installed on connecting servers',
				isRepeatable: true,
				args: {
					name: 'install_extension',
					isOptional: true,
				},
			},
			{
				name: '--server-data-dir',
				description: 'Specifies the directory that server data is kept in',
				isRepeatable: true,
				args: {
					name: 'server_data_dir',
					isOptional: true,
				},
			},
			{
				name: '--extensions-dir',
				description: 'Set the root path for extensions',
				isRepeatable: true,
				args: {
					name: 'extensions_dir',
					isOptional: true,
				},
			},
			{
				name: '--user-data-dir',
				description: 'Specifies the directory that user data is kept in. Can be used to open multiple distinct instances of the editor',
				isRepeatable: true,
				args: {
					name: 'user_data_dir',
					isOptional: true,
				},
			},
			{
				name: '--use-version',
				description: 'Sets the editor version to use for this command. The preferred version can be persisted with `code version use <version>`. Can be \'stable\', \'insiders\', a version number, or an absolute path to an existing install',
				isRepeatable: true,
				args: {
					name: 'use_version',
					isOptional: true,
				},
			},
			{
				name: '--random-name',
				description: 'Randomly name machine for port forwarding service',
			},
			{
				name: '--no-sleep',
				description: 'Prevents the machine going to sleep while this command runs',
			},
			{
				name: '--accept-server-license-terms',
				description: 'If set, the user accepts the server license terms and the server will be started without a user prompt',
			},
			{
				name: '--name',
				description: 'Sets the machine name for port forwarding service',
				isRepeatable: true,
				args: {
					name: 'name',
					isOptional: true,
				},
			},
			{
				name: ['-h', '--help'],
				description: 'Print help',
			},
			{
				name: '--log',
				description: 'Log level to use',
				isRepeatable: true,
				args: {
					name: 'log',
					isOptional: true,
					suggestions: [
						'trace',
						'debug',
						'info',
						'warn',
						'error',
						'critical',
						'off',
					],
				},
			},
			{
				name: '--verbose',
				description: 'Print verbose output (implies --wait)',
			},
			{
				name: '--cli-data-dir',
				description: 'Directory where CLI metadata should be stored',
				args: {
					name: 'cli_data_dir',
				},
			},
		],
	},
	{
		name: 'chat',
		description: 'Pass in a prompt to run in a chat session in the current working directory.',
		args: {
			name: 'prompt',
			description: 'The prompt to use as chat',
			isVariadic: true,
			isOptional: true,
		},
		options: [
			{
				name: ['-m', '--mode'],
				description: 'The mode to use for the chat session. Available options: \'ask\', \'edit\', \'agent\', or the identifier of a custom mode. Defaults to \'agent\'',
				args: {
					name: 'mode',
					suggestions: ['agent', 'ask', 'edit'],
				},
			},
			{
				name: ['-a', '--add-file'],
				description: 'Add files as context to the chat session',
				isRepeatable: true,
				args: {
					name: 'file',
					template: 'filepaths',
				},
			},
			{
				name: ['--maximize'],
				description: 'Maximize the chat session view.',
			},
			{
				name: ['-r', '--reuse-window'],
				description: 'Force to use the last active window for the chat session',
			},
			{
				name: ['-n', '--new-window'],
				description: 'Force to open an empty window for the chat session',
			},
			{
				name: ['-h', '--help'],
				description: 'Print usage',
			},
		],
	},
	{
		name: 'status',
		description: 'Print process usage and diagnostics information',
		options: [...globalTunnelOptions, ...tunnelHelpOptions],
	},
	{
		name: 'version',
		description: `Changes the version of the editor you're using`,
		options: [...globalTunnelOptions, ...tunnelHelpOptions],
	},
	{
		name: 'serve-web',
		description: 'Runs a local web version of Code - OSS',
		options: [
			{
				name: '--host',
				description: 'Host to listen on, defaults to \'localhost\'',
				isRepeatable: true,
				args: {
					name: 'host',
					isOptional: true,
				},
			},
			{
				name: '--socket-path',
				isRepeatable: true,
				args: {
					name: 'socket_path',
					isOptional: true,
				},
			},
			{
				name: '--port',
				description: 'Port to listen on. If 0 is passed a random free port is picked',
				isRepeatable: true,
				args: {
					name: 'port',
					isOptional: true,
				},
			},
			{
				name: '--connection-token',
				description: 'A secret that must be included with all requests',
				isRepeatable: true,
				args: {
					name: 'connection_token',
					isOptional: true,
				},
			},
			{
				name: '--connection-token-file',
				description: 'A file containing a secret that must be included with all requests',
				isRepeatable: true,
				args: {
					name: 'connection_token_file',
					isOptional: true,
				},
			},
			{
				name: '--server-base-path',
				description: 'Specifies the path under which the web UI and the code server is provided',
				isRepeatable: true,
				args: {
					name: 'server_base_path',
					isOptional: true,
				},
			},
			{
				name: '--server-data-dir',
				description: 'Specifies the directory that server data is kept in',
				isRepeatable: true,
				args: {
					name: 'server_data_dir',
					isOptional: true,
				},
			},
			{
				name: '--without-connection-token',
				description: 'Run without a connection token. Only use this if the connection is secured by other means',
			},
			{
				name: '--accept-server-license-terms',
				description: 'If set, the user accepts the server license terms and the server will be started without a user prompt',
			},
			...globalTunnelOptions, ...tunnelHelpOptions,
		]
	},
	{
		name: 'help',
		description: 'Print this message or the help of the given subcommand(s)',
		subcommands: [
			{
				name: 'tunnel',
				description: 'Create a tunnel that\'s accessible on vscode.dev from anywhere. Run`code tunnel --help` for more usage info',
				subcommands: [
					{
						name: 'prune',
						description: 'Delete all servers which are currently not running',
					},
					{
						name: 'kill',
						description: 'Stops any running tunnel on the system',
					},
					{
						name: 'restart',
						description: 'Restarts any running tunnel on the system',
					},
					{
						name: 'status',
						description: 'Gets whether there is a tunnel running on the current machine',
					},
					{
						name: 'rename',
						description: 'Rename the name of this machine associated with port forwarding service',
					},
					{
						name: 'unregister',
						description: `Remove this machine's association with the port forwarding service`,
					},
					{
						name: 'user',
						subcommands: [
							{
								name: 'login',
								description: 'Log in to port forwarding service',
							},
							{
								name: 'logout',
								description: 'Log out of port forwarding service',
							},
							{
								name: 'show',
								description: 'Show the account that\'s logged into port forwarding service',
							},
						],
					},
					{
						name: 'service',
						description: '(Preview) Manages the tunnel when installed as a system service,',
						subcommands: [
							{
								name: 'install',
								description: 'Installs or re-installs the tunnel service on the machine',
							},
							{
								name: 'uninstall',
								description: 'Uninstalls and stops the tunnel service',
							},
							{
								name: 'log',
								description: 'Shows logs for the running service',
							},
						],
					}
				],
			},
			{
				name: 'chat',
				description: 'Pass in a prompt to run in a chat session in the current working directory.',
			},
			extTunnelSubcommand,
			{
				name: 'status',
				description: 'Print process usage and diagnostics information',
			},
			{
				name: 'version',
				description: `Changes the version of the editor you're using`,
				subcommands: [
					{
						name: 'use',
						description: 'Switches the version of the editor in use',
					},
					{
						name: 'show',
						description: 'Shows the currently configured editor version',
					},
				],
			},
			{
				name: 'serve-web',
				description: 'Runs a local web version of Code - OSS',
			},
			{
				name: 'command-shell',
				description: 'Runs the control server on process stdin/stdout',
				hidden: true,
			},
			{
				name: 'update',
				description: 'Updates the CLI',
			},
			{
				name: 'help',
				description: 'Print this message or the help of the given subcommand(s)',
			},
		],
	},
];

const codeCompletionSpec: Fig.Spec = {
	name: 'code',
	description: 'Visual Studio Code',
	args: {
		template: ['filepaths', 'folders'],
		isVariadic: true,
	},
	subcommands: codeTunnelSubcommands,
	options: [
		...commonOptions,
		...extensionManagementOptions('code'),
		...troubleshootingOptions('code'),
	],
};

export default codeCompletionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/copilot.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/copilot.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const copilotSpec: Fig.Spec = {
	name: 'copilot',
	description: 'GitHub Copilot CLI - An AI-powered coding assistant',
	options: [
		{
			name: '--add-dir',
			description: 'Add a directory to the allowed list for file access (can be used multiple times)',
			args: {
				name: 'directory',
				template: 'folders'
			},
			isRepeatable: true
		},
		{
			name: '--additional-mcp-config',
			description: 'Additional MCP servers configuration as JSON string or file path (prefix with @)',
			args: {
				name: 'json',
				description: 'JSON string or file path (prefix with @)'
			},
			isRepeatable: true
		},
		{
			name: '--allow-all-paths',
			description: 'Disable file path verification and allow access to any path'
		},
		{
			name: '--allow-all-tools',
			description: 'Allow all tools to run automatically without confirmation; required for non-interactive mode'
		},
		{
			name: '--allow-tool',
			description: 'Allow specific tools',
			args: {
				name: 'tools',
				isVariadic: true,
				isOptional: true
			}
		},
		{
			name: '--banner',
			description: 'Show the startup banner'
		},
		{
			name: '--continue',
			description: 'Resume the most recent session'
		},
		{
			name: '--deny-tool',
			description: 'Deny specific tools, takes precedence over --allow-tool or --allow-all-tools',
			args: {
				name: 'tools',
				isVariadic: true,
				isOptional: true
			}
		},
		{
			name: '--disable-builtin-mcps',
			description: 'Disable all built-in MCP servers (currently: github-mcp-server)'
		},
		{
			name: '--disable-mcp-server',
			description: 'Disable a specific MCP server (can be used multiple times)',
			args: {
				name: 'server-name'
			},
			isRepeatable: true
		},
		{
			name: '--disable-parallel-tools-execution',
			description: 'Disable parallel execution of tools (LLM can still make parallel tool calls, but they will be executed sequentially)'
		},
		{
			name: '--disallow-temp-dir',
			description: 'Prevent automatic access to the system temporary directory'
		},
		{
			name: ['-h', '--help'],
			description: 'Display help for command'
		},
		{
			name: '--log-dir',
			description: 'Set log file directory (default: ~/.copilot/logs/)',
			args: {
				name: 'directory',
				template: 'folders'
			}
		},
		{
			name: '--log-level',
			description: 'Set the log level',
			args: {
				name: 'level',
				suggestions: ['none', 'error', 'warning', 'info', 'debug', 'all', 'default']
			}
		},
		{
			name: '--model',
			description: 'Set the AI model to use',
			args: {
				name: 'model',
				suggestions: ['claude-sonnet-4.5', 'claude-sonnet-4', 'claude-haiku-4.5', 'gpt-5']
			}
		},
		{
			name: '--no-color',
			description: 'Disable all color output'
		},
		{
			name: '--no-custom-instructions',
			description: 'Disable loading of custom instructions from AGENTS.md and related files'
		},
		{
			name: ['-p', '--prompt'],
			description: 'Execute a prompt directly without interactive mode',
			args: {
				name: 'text',
				description: 'The prompt text to execute'
			}
		},
		{
			name: '--resume',
			description: 'Resume from a previous session (optionally specify session ID)',
			args: {
				name: 'sessionId',
				isOptional: true
			}
		},
		{
			name: '--screen-reader',
			description: 'Enable screen reader optimizations'
		},
		{
			name: '--stream',
			description: 'Enable or disable streaming mode',
			args: {
				name: 'mode',
				suggestions: ['on', 'off']
			}
		},
		{
			name: ['-v', '--version'],
			description: 'Show version information'
		}
	],
	subcommands: [
		{
			name: 'help',
			description: 'Display help information',
			args: {
				name: 'topic',
				isOptional: true,
				suggestions: ['config', 'commands', 'environment', 'logging', 'permissions']
			}
		}
	]
};

export default copilotSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/gh.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/gh.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable local/code-no-unexternalized-strings */

import * as vscode from 'vscode';
import { filepaths } from '../helpers/filepaths';
import { keyValue } from '../helpers/keyvalue';

const filterMessages = (out: string): string => {
	return out.startsWith("warning:") || out.startsWith("error:")
		? out.split("\n").slice(1).join("\n")
		: out;
};

const postProcessRemoteBranches: Fig.Generator["postProcess"] = (out) => {
	const output = filterMessages(out);

	if (output.startsWith("fatal:")) {
		return [];
	}

	return output.split("\n").map((elm) => {
		// Trim and remove the remote part of the branch name (origin/, fork/...)
		let name = elm.trim().replace(/\w+\//, "");

		const parts = elm.match(/\S+/g)!;
		if (parts.length > 1) {
			if (parts[0] === "*") {
				// We are in a detached HEAD state
				if (elm.includes("HEAD detached")) {
					return {};
				}
				// Current branch
				return {
					name: elm.replace("*", "").trim(),
					description: "Current branch",
					priority: 100,
					// allow-any-unicode-next-line
					icon: "⭐️",
				};
			} else if (parts[0] === "+") {
				// Branch checked out in another worktree.
				name = elm.replace("+", "").trim();
			}
		}

		return {
			name,
			description: "Branch",
			icon: `vscode://icon?type=${vscode.TerminalCompletionItemKind.ScmBranch}`,
			priority: 75,
		};
	});
};

interface RepoDataType {
	isPrivate: boolean;
	nameWithOwner: string;
	description: string | null;
}

const listRepoMapFunction = (repo: RepoDataType) => ({
	name: repo.nameWithOwner,
	description: repo.description ?? undefined,
	//be able to see if the repo is private at a glance
	// allow-any-unicode-next-line
	icon: repo.isPrivate ? "🔒" : "👀",
});

const ghGenerators: Record<string, Fig.Generator> = {
	listCustomRepositories: {
		trigger: "/",
		//execute is script then postProcess
		custom: async (tokens, execute) => {
			//get the last command token
			const last = tokens.pop();

			//gatekeeper
			if (!last) {
				return [];
			}

			/**
			 * this turns this input:
			 * `withfig/autocomplete`
			 *
			 * into:
			 * ["withfig", "autocomplete"]
			 */
			const userRepoSplit = last.split("/");

			// make sure it has some length.
			if (userRepoSplit.length === 0) {
				return [];
			}

			//get first element of arr
			const userOrOrg = userRepoSplit.shift();

			// make sure it has some existence.
			if (!userOrOrg) {
				return [];
			}

			//run `gh repo list` cmd
			const { stdout, status } = await execute({
				command: "gh",
				args: [
					"repo",
					"list",
					userOrOrg,
					"--limit",
					"9999",
					"--json",
					"nameWithOwner,description,isPrivate",
				],
			});

			// make sure it has some existence.
			if (status !== 0) {
				return [];
			}

			//parse the JSON string output of the command
			const repoArr: RepoDataType[] = JSON.parse(stdout);

			return repoArr.map(listRepoMapFunction);
		},
	},
	listRepositories: {
		/*
		 * based on the gh api (use this instead as it also returns repos in the orgs that the user is part of)
		 * https://cli.github.com/manual/gh_api
		 *
		 * --jq https://cli.github.com/manual/gh_help_formatting https://www.baeldung.com/linux/jq-command-json
		 */
		script: [
			"gh",
			"api",
			"graphql",
			"--paginate",
			"-f",
			"query='query($endCursor: String) { viewer { repositories(first: 100, after: $endCursor) { nodes { isPrivate, nameWithOwner, description } pageInfo { hasNextPage endCursor }}}}'",
			"--jq",
			".data.viewer.repositories.nodes[]",
		],
		postProcess: (out) => {
			if (out) {
				/**
				 * the string thats returned bt the command will contain lines like this:
				 *
				 * {...data}
				 * {...data}
				 * etc
				 *
				 * so the string needs to be transformed into a json array by adding commas on all newline chars then wrapping in square braces
				 *
				 * compared to none paginating request this is a touch slower 300ms or so, but it fixes the over 100 repos issue!
				 *
				 */
				const jsonifiedOutString = `[${out.replace(/(?:\r\n|\r|\n)/g, ",")}]`;
				try {
					const data: RepoDataType[] = JSON.parse(jsonifiedOutString);

					return data.map(listRepoMapFunction);
				} catch {
					return [];
				}
			}
			return [];
		},
	},
	listPR: {
		cache: { strategy: "stale-while-revalidate" },
		script: ["gh", "pr", "list", "--json=number,title,headRefName,state"],
		postProcess: (out) => {
			interface PR {
				headRefName: string;
				number: number;
				state: string;
				title: string;
			}
			const items = JSON.parse(out) as PR[];
			return items.map((line) => {
				const { number, title, headRefName, state } = line;
				return {
					name: number.toString(),
					displayName: title,
					description: `#${number} | ${headRefName}`,
					icon: `vscode://icon?type=${state === "OPEN" ? vscode.TerminalCompletionItemKind.PullRequest : vscode.TerminalCompletionItemKind.PullRequestDone}`,
				};
			});
		},
	},
	listAlias: {
		script: ["gh", "alias", "list"],
		postProcess: (out) => {
			const aliases = out.split("\n").map((line) => {
				const [name, content] = line.split(":");

				return { name: name.trim(), content: content.trim() };
			});

			return aliases.map(({ name, content }) => ({
				name,
				description: `Alias for '${content}'`,
				icon: "fig://icon?type=commandkey",
			}));
		},
	},
	remoteBranches: {
		script: [
			"git",
			"--no-optional-locks",
			"branch",
			"-r",
			"--no-color",
			"--sort=-committerdate",
		],
		postProcess: postProcessRemoteBranches,
	},
};

const codespaceOption: Fig.Option = {
	name: ["-c", "--codespace"],
	description: "Name of the codespace",
	args: {
		name: "string",
	},
};

const ghOptions: Record<string, Fig.Option> = {
	clone: { name: "--clone", description: "Clone the fork {true|false}" },
	cloneGitFlags: {
		name: "--",
		description: "Flags to pass to git when cloning",
		priority: 25,
		args: {
			name: "flags",
			description: "Flags to pass to git when cloning",
			isVariadic: true,
		},
	},
	confirm: {
		name: ["-y", "--confirm"],
		description: "Skip the confirmation prompt",
	},
	all: {
		name: ["--repo", "-R"],
		description: "Select another repository",
		args: {
			name: "[HOST/]OWNER/REPO",
		},
	},
	env: {
		name: ["-e", "--env"],
		description: "List secrets for an environment",
		args: {
			name: "string",
		},
	},
	org: {
		name: ["-o", "--org"],
		description: "List secrets for an environment",
		args: {
			name: "string",
		},
	},
};

const completionSpec: Fig.Spec = {
	name: "gh",
	description: "GitHub's CLI tool",
	args: {
		name: "alias",
		description: "Custom user defined gh alias",
		isOptional: true,
		generators: ghGenerators.listAlias,
		parserDirectives: {
			alias: async (token, executeShellCommand) => {
				const { stdout } = await executeShellCommand({
					command: "gh",
					args: ["alias", "list"],
				});
				const alias = stdout
					.split("\n")
					.find((line) => line.startsWith(`${token}:\t`));

				if (!alias) {
					throw new Error("Failed to parse alias");
				}

				return alias.slice(token.length + 1).trim();
			},
		},
	},
	subcommands: [
		{
			name: "alias",
			description: "Create command shortcuts",

			subcommands: [
				{
					name: "delete",
					description: "Delete an alias",
					args: {
						name: "alias",
						generators: ghGenerators.listAlias,
					},
				},
				{
					name: "list",
					description: "List available aliases",
				},
				{
					name: "set",
					description: "Set an alias for a gh command",
					args: [
						{
							name: "alias",
							description: "A word that will expand to the gh command",
						},
						{
							name: "expansion",
							description:
								"The gh command to be invoked, more info with --help",
						},
					],
					options: [
						{
							name: ["-s", "--shell"],
							description:
								"Declare an alias to be passed through a shell interpreter",
						},
					],
				},
			],
		}, {
			name: "api",
			description: "Make an authenticated GitHub API request",
			args: {
				name: "<endpoint> [flags]a",
			},
			options: [
				{
					name: "--cache",
					description: 'Cache the response, e.g. "3600s", "60m", "1h"',
					args: { name: "duration" },
				},
				{
					name: ["-F", "--field"],
					description: "Add a typed parameter in key=value format",
					args: { name: "key:value" },
				},
				{
					name: "--hostname",
					description:
						'The GitHub hostname for the request (default "github.com")',
					args: {
						name: "string",
					},
				},
				{
					name: ["-i", "--include"],
					description:
						"Include HTTP response status line and headers in the output",
				},
				{
					name: "--input",
					description:
						'The file to use as body for the HTTP request (use "-" to read from standard input)',
					args: { name: "file" },
				},
				{
					name: ["-q", "--jq"],
					description:
						"Query to select values from the response using jq syntax",
					args: { name: "string" },
				},
				{
					name: ["-X", "--method"],
					description: "The HTTP method for the request",
					args: { name: "string", description: '(default "GET")' },
				},
				{
					name: "--paginate",
					description:
						"Make additional HTTP requests to fetch all pages of results",
				},
				{
					name: ["-p", "--preview"],
					description:
						'GitHub API preview names to request (without the "-preview" suffix)',
					args: { name: "names" },
				},
				{
					name: ["-f", "--raw-field"],
					description: "Add a string parameter in key=value format",
					args: { name: "key=value" },
				},
				{
					name: "--silent",
					description: "Do not print the response body",
				},
				{
					name: "--slurp",
					description:
						'Use with "--paginate" to return an array of all pages of either JSON arrays or objects',
				},
				{
					name: ["-t", "--template"],
					description:
						'Format JSON output using a Go template; see "gh help formatting"',
					args: { name: "string" },
				},
				{
					name: "--verbose",
					description: "Include full HTTP request and response in the output",
				},
			],
		},
		{
			name: "auth",
			description: "Authenticate gh and git with GitHub",

			subcommands: [
				{
					name: "login",
					description: "Gh auth login [flags]",
					options: [
						{
							name: ["-p", "--git-protocol"],
							description:
								"The protocol to use for git operations on this host: {ssh|https}",
							args: { name: "string" },
						},
						{
							name: ["-h", "--hostname"],
							description:
								"The hostname of the GitHub instance to authenticate with",
							args: { name: "string" },
						},
						{
							name: "--insecure-storage",
							description:
								"Save authentication credentials in plain text instead of credential store",
						},
						{
							name: ["-s", "--scopes"],
							description: "Additional authentication scopes to request",
							args: { name: "strings" },
						},
						{
							name: "--skip-ssh-key",
							description: "Skip generate/upload SSH key prompt",
						},
						{
							name: ["-w", "--web"],
							description: "Open a browser to authenticate",
						},
						{
							name: "--with-token",
							description: "Read token from standard input",
						},
					],
				},
				{
					name: "logout",
					description: "Gh auth logout [flags]",
					options: [
						{
							name: ["-h", "--hostname"],
							description: "The hostname of the GitHub instance to log out of",
							args: { name: "string" },
						},
						{
							name: ["-u", "--user"],
							description: "The account to log out of",
							args: { name: "string" },
						},
					],
				},
				{
					name: "refresh",
					description: "Gh auth refresh [flags]",
					options: [
						{
							name: ["-h", "--hostname"],
							description: "The GitHub host to use for authentication",
							args: { name: "string" },
						},
						{
							name: "--insecure-storage",
							description:
								"Save authentication credentials in plain text instead of credential store",
						},
						{
							name: ["-r", "--remove-scopes"],
							description: "Authentication scopes to remove from gh",
							args: { name: "strings" },
						},
						{
							name: "--reset-scopes",
							description:
								"Reset authentication scopes to the default minimum set of scopes",
						},
						{
							name: ["-s", "--scopes"],
							description: "Additional authentication scopes for gh to have",
							args: { name: "strings" },
						},
					],
				},
				{
					name: "setup-git",
					description: "Gh auth setup-git [flags]",
					options: [
						{
							name: ["-f", "--force"],
							description:
								"Force setup even if the host is not known. Must be used in conjunction with --hostname",
							args: { name: "--hostname" },
						},
						{
							name: ["-h", "--hostname"],
							description: "The hostname to configure git for",
							args: { name: "string" },
						},
					],
				},
				{
					name: "status",
					description: "View authentication status",
					options: [
						{
							name: ["-a", "--active"],
							description: "Display the active account only",
						},
						{
							name: ["-h", "--hostname"],
							description: "Check only a specific hostname's auth status",
							args: { name: "string" },
						},
						{
							name: ["-t", "--show-token"],
							description: "Display the auth token",
						},
					],
				},
				{
					name: "switch",
					description: "Switch the active account for a GitHub host",
					options: [
						{
							name: ["-h", "--hostname"],
							description:
								"The hostname of the GitHub instance to switch account for",
							args: { name: "string" },
						},
						{
							name: ["-u", "--user"],
							description: "The account to switch to",
							args: { name: "string" },
						},
					],
				},
				{
					name: "token",
					description: "Gh auth token [flags]",
					options: [
						{
							name: ["-h", "--hostname"],
							description:
								"The hostname of the GitHub instance authenticated with",
							args: { name: "string" },
						},
						{
							name: ["-u", "--user"],
							description: "The account to output the token for",
							args: { name: "string" },
						},
					],
				},
			],
		},
		{
			name: "gpg-key",
			description: "Manage GPG keys registered with your GitHub account",

			subcommands: [
				{
					name: "add",
					description: "Add a GPG key to your GitHub account",
				},
				{
					name: "list",
					description: "Lists GPG keys in your GitHub account",
				},
			],
		},
		{
			name: "browse",
			description: "Open the repository in the browser",
			args: {
				name: "[pr | issue | path[:line]",
				generators: ghGenerators.listPR,
				suggestCurrentToken: true,
			},
			options: [
				{
					name: ["-b", "--branch"],
					description: "Select another branch by passing in the branch name",
					args: {
						name: "branch",
						generators: ghGenerators.remoteBranches,
					},
				},
				{
					name: ["-c", "--commit"],
					description: "Open the last commit",
				},
				{
					name: ["-n", "--no-browser"],
					description: "Print destination URL instead of opening the browser",
				},
				{
					name: ["-p", "--projects"],
					description: "Open repository projects",
				},
				{
					name: ["-R", "--repo"],
					description:
						"Select another repository using the [HOST/]OWNER/REPO format",
					args: {
						name: "[HOST/]OWNER/REPO",
					},
				},
				{
					name: ["-s", "--settings"],
					description: "Open repository settings",
				},
				{
					name: ["-w", "--wiki"],
					description: "Open repository wiki",
				},
			],
		},
		{
			name: "completion",
			description: "Generate shell completion scripts",
			options: [
				{
					name: ["-s", "--shell"],
					args: {
						name: "shell",
						suggestions: ["bash", "zsh", "fish", "powershell"],
					},
				},
			],
		},
		{
			name: "config",
			description: "Manage configuration for gh",

			subcommands: [
				{
					name: "get",
					description: "Print the value of a given configuration key",
					args: {
						name: "key",
						suggestions: [
							"git_protocol",
							"editor",
							"prompt",
							"pager",
							"http_unix_socket",
						],
					},
					options: [
						{
							name: ["-h", "--host"],
							args: { name: "host" },
							description: "Get per-host setting",
						},
					],
				},
				{
					name: "set",
					description: "Update configuration with a value for the given key",
					subcommands: [
						{
							name: "git_protocol",
							description:
								"The protocol to use for git clone and push operations",
							args: {
								name: "option",
								suggestions: ["https", "ssh"],
							},
						},
						{
							name: "editor",
							description: "The text editor program to use for authoring text",
							args: { name: "editor", suggestions: ["vim", "nano"] },
						},
						{
							name: "prompt",
							description: "Toggle interactive prompting in the terminal",
							args: {
								name: "value",
								suggestions: ["enable", "disable"],
							},
						},
						{
							name: "pager",
							insertValue: "pager {cursor}",
							description:
								"The terminal pager program to send standard output to",
							args: { name: "value" },
						},
						{
							name: "http_unix_socket",
							description:
								"The path to a unix socket through which to make HTTP connection",
							args: { name: "path" },
						},
					],
					options: [
						{
							name: ["-h", "--host"],
							args: { name: "host" },
							description: "Get per-host setting",
						},
					],
				},
			],
		},
		{
			name: "extensions",
			description: "Manage gh extensions",

			subcommands: [
				{
					name: "create",
					description: "Create a new extension",

					args: {
						name: "name",
					},
				},
				{
					name: "install",
					description: "Install a gh extension from a repository",

					args: {
						name: "repo",
					},
				},
				{
					name: "list",
					description: "List installed extension commands",
				},
				{
					name: "remove",
					description: "Remove an installed extension",

					args: {
						name: "name",
					},
				},
				{
					name: "upgrade",
					description: "Upgrade installed extensions",
					options: [
						{ name: "--all", description: "Upgrade all extensions" },
						{ name: "--force", description: "Force upgrade extensions" },
					],
					args: {
						name: "name",
					},
				},
			],
		},
		{
			name: "gist",
			description: "Manage gists",

			subcommands: [
				{
					name: "clone",
					description: "Clone a gist locally",

					args: [
						{ name: "gist", description: "Gist ID or URL" },
						{ name: "directory", isOptional: true, template: "folders" },
					],
				},
				{
					name: "create",
					description: "Create a new gist",
					args: {
						name: "filename",
						template: "filepaths",
					},
					options: [
						{
							name: ["-d", "--desc"],
							description: "A description for this gist",
							insertValue: "-d '{cursor}'",
							args: { name: "description" },
						},
						{
							name: ["-f", "--filename"],
							description:
								"Provide a filename to be used when reading from STDIN",
							args: { name: "filename", template: "filepaths" },
						},
						{
							name: ["-p", "--public"],
							description: "List the gist publicly (default: secret)",
						},
						{
							name: ["-w", "--web"],
							description: "Open the web browser with created gist",
						},
					],
				},
				{
					name: "delete",
					description: "Delete a gist",

					args: { name: "gist", description: "Gist ID or URL" },
				},
				{
					name: "edit",
					description: "Edit one of your gists",
					args: { name: "gist", description: "Gist ID or URL" },
					options: [
						{
							name: ["-a", "--add"],
							description: "Add a new file to the gist",
							args: { name: "filename", template: "filepaths" },
						},
						{
							name: ["-f", "--filename"],
							description: "Select a file to edit",
						},
					],
				},
				{
					name: "list",
					description: "List your gists",
					options: [
						{
							name: ["-L", "--limit"],
							displayName: "-L, --limit",
							description: "Maximum number of gists to fetch (default 10)",
							args: { name: "int" },
						},
						{
							name: "--public",
							description: "Show only public gists",
						},
						{
							name: "--secret",
							description: "Show only secret gists",
						},
					],
				},
				{
					name: "view",
					description: "View a gist",
					args: { name: "gist", description: "Gist ID or URL" },
					options: [
						{
							name: ["-f", "--filename"],
							description: "Display a single file from the gist",
						},
						{
							name: "--files",
							description: "List file names from the gist",
						},
						{
							name: ["-r", "--raw"],
							description: "Print raw instead of rendered gist contents",
						},
						{
							name: ["-w", "--web"],
							description: "Open gist in the browser",
						},
					],
				},
			],
		},
		{
			name: "issue",
			description: "Manage issues",

			subcommands: [
				{
					name: "close",
					description: "Close issue",
					args: { name: "issue", description: "Number or URL" },
					options: [
						{
							name: ["-R", "--repo"],
							insertValue: "-R '{cursor}'",
							description:
								"Select another repository using the [HOST/]OWNER/REPO format",
							args: { name: "repo" },
						},
					],
				},
				{
					name: "comment",
					description: "Create a new issue comment",
					args: { name: "issue", description: "Number or URL" },
					options: [
						{
							name: ["-R", "--repo"],
							insertValue: "-R '{cursor}'",
							description:
								"Select another repository using the [HOST/]OWNER/REPO format",
							args: { name: "repo" },
						},
						{
							name: ["-b", "--body"],
							insertValue: "-b '{cursor}'",
							description: "Supply a body. Will prompt for one otherwise",
							args: { name: "string" },
						},
						{
							name: ["-F", "--body-file"],
							description: "Read body text from file",
							args: { name: "file", template: "filepaths" },
						},
						{
							name: ["-e", "--editor"],
							description: "Add body using editor",
							args: { name: "editor" },
						},
						{
							name: ["-w", "--web"],
							description: "Add body in browser",
						},
					],
				},
				{
					name: "create",
					description: "Create a new issue",
					options: [
						{
							name: ["-R", "--repo"],
							insertValue: "-R '{cursor}'",
							description:
								"Select another repository using the [HOST/]OWNER/REPO format",
							args: { name: "repo" },
						},
						{
							name: ["-a", "--assignee"],
							description:
								'Assign people by their login. Use "@me" to self-assign',
							args: { name: "login" },
						},
						{
							name: ["-b", "--body"],
							insertValue: "-b '{cursor}'",
							description: "Supply a body. Will prompt for one otherwise",
							args: { name: "string" },
						},
						{
							name: ["-F", "--body-file"],
							description: "Read body text from file",
							args: { name: "file", template: "filepaths" },
						},
						{
							name: ["-l", "--label"],
							insertValue: "-l '{cursor}'",
							description: "Add labels by name",
							args: { name: "name" },
						},
						{
							name: ["-m", "--milestone"],
							description: "Add the issue to a milestone by name",
							args: { name: "name" },
						},
						{
							name: ["-p", "--project"],
							insertValue: "-p '{cursor}'",
							description: "Add the issue to projects by name",
							args: { name: "name" },
						},
						{
							name: "--recover",
							insertValue: "--recover '{cursor}'",
							description: "Recover input from a failed run of create",
							args: { name: "string" },
						},
						{
							name: ["-t", "--title"],
							description: "Supply a title. Will prompt for one otherwise",
							insertValue: "-t '{cursor}'",
							args: { name: "string" },
						},
						{
							name: ["-w", "--web"],
							description: "Open the browser to create an issue",
						},
					],
				},
				{
					name: "delete",
					description: "Delete issue",
					options: [
						{
							name: ["-R", "--repo"],
							insertValue: "-R '{cursor}'",
							description:
								"Select another repository using the [HOST/]OWNER/REPO format",
							args: { name: "repo" },
						},
					],
				},
				{
					name: "edit",
					description: "Edit an issue",
					args: { name: "issue", description: "Number or URL" },
					options: [
						{
							name: ["-R", "--repo"],
							insertValue: "-R '{cursor}'",
							description:
								"Select another repository using the [HOST/]OWNER/REPO format",
							args: { name: "repo" },
						},
						{
							name: "--add-assignee",
							description:
								'Add assigned users by their login. Use "@me" to assign yourself',
							args: { name: "login" },
						},
						{
							name: "--add-label",
							description: "Add labels by name",
							args: { name: "name" },
						},
						{
							name: ["-b", "--body"],
							insertValue: "-b '{cursor}'",
							description: "Set the new body",
							args: { name: "string" },
						},
						{
							name: ["-F", "--body-file"],
							description: "Read body text from file",
							args: { name: "file", template: "filepaths" },
						},
						{
							name: ["-m", "--milestone"],
							description: "Edit the milestone the issue belongs to by name",
							args: { name: "name" },
						},
						{
							name: "--remove-assignee",
							description:
								'Remove assigned users by their login. Use "@me" to unassign yourself',
							args: { name: "login" },
						},
						{
							name: "--remove-label",
							description: "Remove labels by name",
							args: { name: "name" },
						},
						{
							name: "--remove-project",
							description: "Remove the issue from projects by name",
							args: { name: "name" },
						},
						{
							name: ["-t", "--title"],
							description: "Set the new title",
							insertValue: "-t '{cursor}'",
							args: { name: "string" },
						},
					],
				},
				{
					name: "list",
					description: "List and filter issues in this repository",
					options: [
						{
							name: ["-R", "--repo"],
							insertValue: "-R '{cursor}'",
							description:
								"Select another repository using the [HOST/]OWNER/REPO format",
							args: { name: "repo" },
						},
						{
							name: ["-a", "--assignee"],
							description: "Filter by assignee",
							args: { name: "string" },
						},
						{
							name: ["-A", "--author"],
							description: "Filter by author",
							args: { name: "string" },
						},
						{
							name: ["-q", "--jq"],
							description: "Filter JSON output using a jq expression",
							args: { name: "expression" },
						},
						{
							name: "--json",
							description: "Output JSON with the specified fields",
							args: { name: "fields" },
						},
						{
							name: ["-l", "--label"],
							insertValue: "-l '{cursor}'",
							description: "Filter by labels",
							args: { name: "string" },
						},
						{
							name: ["-L", "--limit"],
							description: "Maximum number of issues to fetch (default 30)",
							args: { name: "int" },
						},
						{
							name: "--mention",
							description: "Filter by mention",
							args: { name: "string" },
						},
						{
							name: ["-m", "--milestone"],
							insertValue: "-m '{cursor}'",
							description: "Filter by milestone number or `title`",
							args: { name: "number", description: "Number or Title" },
						},
						{
							name: ["-S", "--search"],
							insertValue: "--search '{cursor}'",
							description: "Search issues with query",
							args: { name: "query" },
						},
						{
							name: ["-s", "--state"],
							description: 'Filter by state (default "open")',
							args: {
								name: "state",
								suggestions: ["open", "closed", "all"],
								default: "open",
								description: '(default "open")',
							},
						},
						{
							name: ["-t", "--template"],
							description: "Format JSON output using a Go template",
							args: { name: "string" },
						},
						{
							name: ["-w", "--web"],
							description: "Open the browser to list the issue(s)",
						},
					],
				},
				{
					name: "reopen",
					description: "Reopen issue",
					options: [
						{
							name: ["-R", "--repo"],
							insertValue: "-R '{cursor}'",
							description:
								"Select another repository using the [HOST/]OWNER/REPO format",
							args: { name: "repo" },
						},
					],
				},
				{
					name: "status",
					description: "Show status of relevant issues",
					options: [
						{
							name: ["-R", "--repo"],
							insertValue: "-R '{cursor}'",
							description:
								"Select another repository using the [HOST/]OWNER/REPO format",
							args: { name: "repo" },
						},
						{
							name: ["-q", "--jq"],
							description: "Filter JSON output using a jq expression",
							args: { name: "expression" },
						},
						{
							name: "--json",
							description: "Output JSON with the specified fields",
							args: { name: "fields" },
						},
						{
							name: ["-t", "--template"],
							description: "Format JSON output using a Go template",
							args: { name: "string" },
						},
					],
				},
				{
					name: "transfer",
					description: "Transfer issue to another repository",
					args: [
						{ name: "issue", description: "Number or URL" },
						{ name: "destination-repo" },
					],
					options: [
						{
							name: ["-R", "--repo"],
							insertValue: "-R '{cursor}'",
							description:
								"Select another repository using the [HOST/]OWNER/REPO format",
							args: { name: "repo" },
						},
					],
				},
				{
					name: "view",
					description: "View an issue",
					args: { name: "issue", description: "Number or URL" },
					options: [
						{
							name: ["-R", "--repo"],
							insertValue: "-R '{cursor}'",
							description:
								"Select another repository using the [HOST/]OWNER/REPO format",
							args: { name: "repo" },
						},
						{
							name: ["-c", "--comments"],
							description: "View issue comments",
						},
						{
							name: ["-q", "--jq"],
							description: "Filter JSON output using a jq expression",
							args: { name: "expression" },
						},
						{
							name: "--json",
							description: "Output JSON with the specified fields",
							args: { name: "fields" },
						},
						{
							name: ["-t", "--template"],
							description: "Format JSON output using a Go template",
							args: { name: "string" },
						},
						{
							name: ["-w", "--web"],
							description: "Open an issue in the browser",
						},
					],
				},
			],
		},
		{
			name: "pr",
			description: "Manage pull requests",
			subcommands: [
				{
					name: "checkout",
					description: "Check out a pull request in git",
					args: {
						name: "number | url | branch",
						generators: ghGenerators.listPR,
					},
					options: [
						{
							name: "--recurse-submodules",
							description: "Update all active submodules (recursively)",
						},
					],
				},
				{
					name: "checks",
					description: "Show CI status for a single pull request",
					args: {
						name: "number | url | branch",
						generators: ghGenerators.listPR,
					},
					options: [
						{
							name: ["-w", "--web"],
							description: "Open the web browser to show details about checks",
						},
					],
				},
				{
					name: "close",
					description: "Close a pull request",
					args: {
						name: "number | url | branch",
						generators: ghGenerators.listPR,
					},
					options: [
						{
							name: ["-d", "--delete-branch"],
							description: "Delete the local and remote branch after close",
						},
					],
				},
				{
					name: "edit",
					description:
						"Edit a pull request. Without an argument, the pull request that belongs to the current branch is selected",
					args: {
						name: "number | url | branch",
						generators: ghGenerators.listPR,
					},
					options: [
						{
							name: "--add-assignee",
							description:
								'Add assigned users by their login. Use "@me" to assign yourself',
							args: {
								name: "login",
							},
						},
						{
							name: "--add-label",
							description: "Add labels by name",
							args: {
								name: "name",
							},
						},
						{
							name: "--add-project",
							description: "Add the pull request to projects by name",
							args: {
								name: "name",
							},
						},
						{
							name: "--add-reviewer",
							description: "Add reviewers by their login",
							args: {
								name: "login",
							},
						},
						{
							name: ["-B", "--base"],
							description: "Change the base branch for this pull request",
							args: {
								name: "branch",
							},
						},
						{
							name: ["-b", "--body"],
							description: "Set the new body",
							args: {
								name: "string",
							},
						},
						{
							name: ["-F", "--body-file"],
							description:
								'Read body text from file (use "-" to read from standard input)',
							args: {
								name: "file",
							},
						},
						{
							name: ["-m", "--milestone"],
							description:
								"Edit the milestone the pull request belongs to by name",
							args: {
								name: "name",
							},
						},
						{
							name: "--remove-assignee",
							description:
								'Remove assigned users by their login. Use "@me" to unassign yourself',
							args: {
								name: "login",
							},
						},
						{
							name: "--remove-label",
							description: "Remove labels by name",
							args: {
								name: "name",
							},
						},
						{
							name: "--remove-project",
							description: "Remove the pull request from projects by name",
							args: {
								name: "name",
							},
						},
						{
							name: "--remove-reviewer",
							description: "Remove reviewers by their login",
							args: {
								name: "login",
							},
						},
						{
							name: ["-t", "--title"],
							description: "Set the new title",
							args: {
								name: "string",
							},
						},

						ghOptions.all,
					],
				},
				{
					name: "comment",
					description: "Create a new pr comment",
					args: {
						name: "number | url | branch",
						generators: ghGenerators.listPR,
					},
					options: [
						{
							name: ["-b", "--body"],
							insertValue: "-b '{cursor}'",
							description: "Supply a body. Will prompt for one otherwise",
							args: {
								name: "message",
							},
						},
						{ name: ["-e", "--editor"], description: "Add body using editor" },
						{ name: ["-w", "--web"], description: "Add body in browser" },
					],
				},
				{
					name: "create",
					description: "Create a pull request",
					options: [
						{
							name: ["-a", "--assignee"],
							description: "Assign people by their login",
							args: {
								name: "login",
							},
						},
						{
							name: ["-B", "--base"],
							description: "The branch into which you want your code merged",
							args: {
								name: "branch",
								generators: ghGenerators.remoteBranches,
							},
						},
						{
							name: ["-b", "--body"],
							insertValue: "-b '{cursor}'",
							description: "Body for the pull request",
							args: {
								name: "body",
							},
						},
						{
							name: ["-d", "--draft"],
							description: "Mark pull request as a draft",
						},
						{
							name: ["-f", "--fill"],
							description:
								"Do not prompt for title/body and just use commit info",
						},
						{
							name: ["-H", "--head"],
							description:
								"The branch that contains commits for your pull request (default: current branch)",
							args: {
								name: "branch",
							},
						},
						{
							name: ["-l", "--label"],
							description:
								"The branch that contains commits for your pull request (default: current branch)",
							args: {
								name: "branch",
							},
						},
						{
							name: ["-m", "--milestone"],
							description: "Add the pull request to a milestone by name",
							args: {
								name: "name",
							},
						},
						{
							name: "--no-maintainer-edit",
							description:
								"Disable maintainer's ability to modify pull request",
						},
						{
							name: ["-p", "--project"],
							description: "Add the pull request to projects by name",
							args: {
								name: "name",
							},
						},
						{
							name: "-recover",
							description: "Recover input from a failed run of create",
							args: {
								name: "string",
							},
						},
						{
							name: ["-r", "--reviewer"],
							description:
								"Request reviews from people or teams by their handle",
							args: {
								name: "handle",
							},
						},
						{
							name: ["-t", "--title"],
							description: "Title for the pull request",
							args: {
								name: "string",
							},
						},
						{
							name: ["-w", "--web"],
							description: "Open the web browser to create a pull request",
						},
					],
				},
				{
					name: "diff",
					description: "View changes in a pull request",
					args: {
						name: "number | url | branch",
						generators: ghGenerators.listPR,
					},
					options: [
						{
							name: "--color",
							description: "Use color in diff output: {always|never|auto}",
							args: {
								name: "choice",
							},
						},
					],
				},
				{
					name: "list",
					description: "List and filter pull requests in this repository",
					options: [
						{
							name: ["-a", "--assignee"],
							description: "Filter by assignee",
							args: {
								name: "string",
							},
						},
						{
							name: ["-B", "--base"],
							description: "Filter by base branch",
							args: {
								name: "string",
							},
						},
						{
							name: ["-l", "--label"],
							description: "Filter by labels",
							args: {
								name: "string",
							},
						},
						{
							name: ["-L", "--limit"],
							description: "Maximum number of items to fetch",
							args: {
								name: "int",
							},
						},
						{
							name: ["-s", "--state"],
							description: "Filter by state: {open|closed|merged|all}",
							args: {
								name: "string",
							},
						},
						{
							name: ["-w", "--web"],
							description: "Open the browser to list the pull requests",
							args: {
								name: "string",
							},
						},
					],
				},
				{
					name: "merge",
					description: "Merge a pull request",
					args: {
						name: "number | url | branch",
						generators: ghGenerators.listPR,
					},
					options: [
						{
							name: ["-d", "--delete-branch"],
							description: "Delete the local and remote branch after merge",
						},
						{
							name: ["-m", "--merge"],
							description: "Merge the commits with the base branch",
						},
						{
							name: ["-r", "--rebase"],
							description: "Rebase the commits onto the base branch",
						},
						{
							name: ["-s", "--squash"],
							description:
								"Squash the commits into one commit and merge it into the base branch",
						},
					],
				},
				{
					name: "ready",
					description: "Mark a pull request as ready for review",
					args: {
						name: "number | url | branch",
						generators: ghGenerators.listPR,
					},
				},
				{
					name: "reopen",
					description: "Reopen a pull request",
					args: {
						name: "number | url | branch",
						generators: ghGenerators.listPR,
					},
				},
				{
					name: "review",
					description: "Add a review to a pull request",
					args: {
						name: "number | url | branch",
						generators: ghGenerators.listPR,
					},
					options: [
						{ name: ["-a", "--approve"], description: "Approve pull request" },
						{
							name: ["-b", "--body"],
							description: "Specify the body of a review",
							args: {
								name: "string",
							},
						},
						{
							name: ["-c", "--comment"],
							description: "Comment on a pull request",
						},
						{
							name: ["-r", "--request-changes"],
							description: "Request changes on a pull request",
						},
					],
				},
				{
					name: "status",
					description: "Show status of relevant pull requests",
				},
				{
					name: "view",
					description: "View a pull request",
					args: {
						name: "number | url | branch",
						generators: ghGenerators.listPR,
					},
					options: [
						{
							name: ["-c", "--comments"],
							description: "View pull request comments",
						},
						{
							name: ["-w", "--web"],
							description: "Open a pull request in the browser",
						},
					],
				},
			],
		},
		{ name: "release", description: "Manage GitHub releases" },
		{
			name: "repo",
			description: "Work with GitHub repositories",
			subcommands: [
				{
					name: "archive",
					description:
						"Archive a GitHub repository. With no argument, archives the current repository",
					isDangerous: true,
					args: {
						name: "repository",
						generators: ghGenerators.listRepositories,
						isOptional: true,
					},
					options: [ghOptions.confirm],
				},
				{
					name: "clone",
					description: `Clone a GitHub repository locally.
If the "OWNER/" portion of the "OWNER/REPO" repository argument is omitted, it
defaults to the name of the authenticating user.
Pass additional 'git clone' flags by listing them after '--'`,
					args: [
						{
							name: "repository",
							generators: [
								ghGenerators.listRepositories,
								ghGenerators.listCustomRepositories,
							],
						},
						{
							name: "directory",
							isOptional: true,
						},
					],
					options: [
						ghOptions.cloneGitFlags,
						{
							name: ["-u", "--upstream-remote-name"],
							description:
								'Upstream remote name when cloning a fork (default "upstream")',
							args: {
								name: "string",
							},
						},
					],
				},
				{
					name: "create",
					description: `Create a new GitHub repository.
To create a repository interactively, use 'gh repo create' with no arguments.
To create a remote repository non-interactively, supply the repository name and one of '--public', '--private', or '--internal'.
Pass '--clone' to clone the new repository locally.
To create a remote repository from an existing local repository, specify the source directory with '--source'.
By default, the remote repository name will be the name of the source directory.
Pass '--push' to push any local commits to the new repository`,
					args: {
						name: "name",
					},
					options: [
						ghOptions.confirm,
						{
							name: ["-d", "--description"],
							description: "Description of the repository",
							args: {
								name: "string",
							},
						},
						{
							name: ["-h", "--homepage"],
							description: "Repository home page URL",
							args: {
								name: "string",
							},
						},
						{ name: "--public", description: "Make the repository public" },
						{ name: "--private", description: "Make the repository private" },
						{
							name: "--internal",
							description: "Make the repository internal",
						},
						{
							name: ["-p", "--template"],
							description:
								"Make the new repository based on a template repository",
							args: {
								name: "string",
							},
						},
						{
							name: ["-c", "--clone"],
							description: "Clone the new repository to the current directory",
						},
						{
							name: "--disable-issues",
							description: "Disable issues in the new repository",
						},
						{
							name: "--disable-wiki",
							description: "Disable wiki in the new repository",
						},
						{
							name: ["-g", "--gitignore"],
							description: "Specify a gitignore template for the repository",
							args: {
								name: "string",
							},
						},
						{
							name: ["-l", "--license"],
							description: "Specify an Open Source License for the repository",
							args: {
								name: "string",
							},
						},
						{
							name: ["-r", "--remote"],
							description: "Specify remote name for the new repository",
							args: {
								name: "string",
							},
						},
						{
							name: ["-s", "--source"],
							description: "Specify path to local repository to use as source",
							args: {
								name: "string",
							},
						},
						{
							name: ["-t", "--team"],
							description:
								"The name of the organization team to be granted access",
							args: {
								name: "string",
							},
						},
						{
							name: "--include-all-branches",
							description: "Include all branches from template repository",
						},
						{
							name: "--push",
							description: "Push local commits to the new repository",
						},
						{
							name: "--add-readme",
							description: "Add a README file to the new repository",
						},
					],
				},
				{
					name: "deploy-key",
					description: "Manage deploy keys in a repository",
					subcommands: [
						{
							name: "add",
							description: "Add a deploy key to a GitHub repository",
							args: {
								name: "key-file",
								description: "Path to the public key file",
								template: "filepaths",
							},
							options: [
								{
									name: ["-w", "--allow-write"],
									description: "Allow write access for the key",
								},
								{
									name: ["-t", "--title"],
									description: "Title of the new key",
									args: {
										name: "string",
									},
								},
							],
						},
						{
							name: "delete",
							description: "Delete a deploy key from a GitHub repository",
							args: {
								name: "key-id",
								description: "ID of the key to delete",
							},
						},
						{
							name: "list",
							description: "List deploy keys in a GitHub repository",
						},
					],
					options: [
						{
							name: ["-R", "--repo"],
							description:
								"Select another repository using the `[HOST/]OWNER/REPO` format",
							args: {
								name: "[HOST/]OWNER/REPO",
							},
						},
					],
				},
				{
					name: "delete",
					description: `Delete a GitHub repository.
With no argument, deletes the current repository. Otherwise, deletes the specified repository.
Deletion requires authorization with the "delete_repo" scope.
To authorize, run "gh auth refresh -s delete_repo"`,
					isDangerous: true,
					args: {
						name: "repository",
						generators: ghGenerators.listRepositories,
						isOptional: true,
					},
					options: [ghOptions.confirm],
				},
				{
					name: "edit",
					description: "Edit repository settings",
					args: {
						name: "repository",
						generators: ghGenerators.listRepositories,
						isOptional: true,
					},
					options: [
						ghOptions.clone,
						{
							name: "--add-topic",
							description: "Add repository topic",
							args: {
								name: "topic names",
							},
						},
						{
							name: "--allow-forking",
							description: "Allow forking of an organization repository",
						},
						{
							name: "--default-branch",
							description: "Set the default branch name for the repository",
							args: {
								name: "branch name",
							},
						},
						{
							name: "--delete-branch-on-merge",
							description: "Delete head branch when pull requests are merged",
						},
						{
							name: ["-d", "--description"],
							description: "Description of the repository",
							args: {
								name: "description",
							},
						},
						{
							name: "--enable-auto-merge",
							description: "Enable auto-merge functionality",
						},
						{
							name: "--enable-issues",
							description: "Enable issues in the repository",
						},
						{
							name: "--enable-merge-commit",
							description: "Enable merging pull requests via merge commit",
						},
						{
							name: "--enable-projects",
							description: "Enable projects in the repository",
						},
						{
							name: "--enable-rebase-merge",
							description: "Enable merging pull requests via rebase",
						},
						{
							name: "--enable-squash-merge",
							description: "Enable merging pull requests via squashed commit",
						},
						{
							name: "--enable-wiki",
							description: "Enable wiki in the repository",
						},
						{
							name: ["-h", "--homepage"],
							description: "Repository home page URL",
							args: {
								name: "URL",
							},
						},
						{
							name: "--remove-topic",
							description: "Remove repository topic",
							args: {
								name: "topic names",
							},
						},
						{
							name: "--template",
							description:
								"Make the repository available as a template repository",
						},
						{
							name: "--visibility",
							description:
								"Change the visibility of the repository to {public,private,internal}",
							args: {
								name: "string",
								suggestions: ["public", "private", "internal"],
							},
						},
					],
				},
				{
					name: "fork",
					description: `Create a fork of a repository.
With no argument, creates a fork of the current repository. Otherwise, forks
the specified repository.
By default, the new fork is set to be your 'origin' remote and any existing
origin remote is renamed to 'upstream'. To alter this behavior, you can set
a name for the new fork's remote with --remote-name.
Additional 'git clone' flags can be passed in by listing them after '--'`,
					args: {
						name: "repository",
						generators: [
							ghGenerators.listRepositories,
							ghGenerators.listCustomRepositories,
						],
					},
					options: [
						ghOptions.cloneGitFlags,
						{
							name: "--clone",
							description: "Clone the fork",
						},
						{
							name: "--remote",
							description: "Add remote for fork {true|false}",
						},
						{
							name: "--remote-name",
							description:
								'Specify a name for a fork\'s new remote. (default "origin")',
							args: {
								name: "string",
							},
						},
						{
							name: "--org",
							description: "Create the fork in an organization",
							args: {
								name: "string",
							},
						},
						{
							name: "--fork-name",
							description: "Rename the forked repository",
							args: {
								name: "string",
							},
						},
					],
				},
				{
					name: "list",
					description: `List repositories owned by user or organization.
For more information about output formatting flags, see 'gh help formatting'`,
					args: {
						name: "owner",
						isOptional: true,
					},
					options: [
						{
							name: "--visibility",
							description: "Filter repositories by visibility",
							args: {
								name: "visibility",
								suggestions: ["public", "private", "internal"],
							},
						},
						{
							name: "--archived",
							description: "Show only archived repositories",
						},
						{ name: "--fork", description: "Show only forked repositories" },
						{
							name: ["-l", "--language"],
							description: "Filter by primary coding language",
						},
						{
							name: ["-L", "--limit"],
							description:
								"Maximum number of repositories to list (default 30)",
							args: {
								name: "string",
							},
						},
						{
							name: "--no-archived",
							description: "Omit archived repositories",
						},
						{ name: "--source", description: "Show only non-forks" },
						{
							name: ["-q", "--jq"],
							description: "Filter JSON output using a jq expression",
						},
						{
							name: "--json",
							description: "Output JSON with the specified fields",
						},
						{
							name: ["-t", "--template"],
							description: "Format JSON output using a Go template",
						},
						{
							name: "--topic",
							description: "Filter by topic",
							args: {
								name: "topic",
							},
						},
						{
							name: "--private",
							description: "Show only private repositories",
							deprecated: true,
						},
						{
							name: "--public",
							description: "Show only public repositories",
							deprecated: true,
						},
					],
				},
				{
					name: "rename",
					description: `Rename a GitHub repository.
By default, this renames the current repository; otherwise renames the specified repository`,
					args: {
						name: "new-name",
						isOptional: true,
					},
					options: [
						ghOptions.confirm,
						ghOptions.all,
						{
							name: ["-R", "--repo"],
							description:
								"Select another repository using the `[HOST/]OWNER/REPO` format",
							args: {
								name: "[HOST/]OWNER/REPO",
							},
						},
					],
				},
				{
					name: "set-default",
					description:
						"Sets the default remote repository to use when querying the GitHub API for the locally cloned repository",
					args: {
						name: "repository",
						isOptional: true,
						generators: [
							ghGenerators.listRepositories,
							ghGenerators.listCustomRepositories,
						],
					},
					options: [
						{
							name: ["-u", "--unset"],
							description: "Unset the current default repository",
						},
						{
							name: ["-v", "--view"],
							description: "View the current default repository",
						},
					],
				},
				{
					name: "sync",
					description: `Sync destination repository from source repository. Syncing uses the main branch
of the source repository to update the matching branch on the destination
repository so they are equal. A fast forward update will be used execept when the
'--force' flag is specified, then the two branches will
by synced using a hard reset.
Without an argument, the local repository is selected as the destination repository.
The source repository is the parent of the destination repository by default.
This can be overridden with the '--source' flag`,
					args: {
						name: "destination-repository",
						isOptional: true,
					},
					options: [
						{
							name: ["-b", "--branch"],
							description: "Branch to sync",
							args: {
								name: "branch name",
								default: "main",
							},
						},
						{
							name: "--force",
							description:
								"Hard reset the branch of the destination repository to match the source repository",
						},
						{
							name: ["-s", "--source"],
							description: "Source repository",
							args: {
								name: "source repository",
							},
						},
					],
				},
				{
					name: "view",
					description: `Display the description and the README of a GitHub repository.
With no argument, the repository for the current directory is displayed.
With '--web', open the repository in a web browser instead.
With '--branch', view a specific branch of the repository.
For more information about output formatting flags, see 'gh help formatting'`,
					args: {
						name: "repository",
						isOptional: true,
						generators: [
							ghGenerators.listRepositories,
							ghGenerators.listCustomRepositories,
						],
					},
					options: [
						{
							name: ["-b", "--branch"],
							description: "View a specific branch of the repository",
							args: {
								name: "string",
							},
						},
						{
							name: ["-w", "--web"],
							description: "Open a repository in the browser",
						},
						{
							name: ["-q", "--jq"],
							description: "Filter JSON output using a jq expression",
							args: {
								name: "expression",
							},
						},
						{
							name: "--json",
							description: "Output JSON with the specified fields",
							args: {
								name: "fields",
							},
						},
						{
							name: ["-t", "--template"],
							description: "Format JSON output using a Go template",
							args: {
								name: "string",
							},
						},
					],
				},
			],
		},
		{
			name: "run",
			description: "View details about workflow runs",
			options: [ghOptions.all],
			subcommands: [
				{
					name: "download",
					description: "Download artifacts generated by a workflow run",
					args: {
						name: "run-id",
					},
				},
				{
					name: "list",
					description: "List recent workflow runs",
					options: [
						ghOptions.all,
						{
							name: ["-L", "--limit"],
							description: "Maximum number of runs to fetch (default 20)",
							args: {
								name: "int",
							},
						},
						{
							name: ["-w", "--workflow"],
							description: "Filter runs by workflow",
							args: {
								name: "string",
							},
						},
					],
				},
				{
					name: "rerun",
					description: "Rerun a failed run",
					options: [ghOptions.all],
					args: {
						name: "run-id",
					},
				},
				{
					name: "view",
					description: "View a summary of a workflow run",
					options: [
						ghOptions.all,
						{
							name: "--exit-status",
							description: "Exit with non-zero status if run failed",
						},
						{
							name: ["-j", "--job"],
							description: "View a specific job ID from a run",
							args: {
								name: "string",
							},
						},
						{
							name: "--log",
							description: "View full log for either a run or specific job",
						},
						{
							name: "--log-failed",
							description:
								"View the log for any failed steps in a run or specific job",
						},
						{
							name: ["-v", "--verbose"],
							description: "Show job steps",
						},
						{
							name: ["-w", "--web"],
							description: "Open run in the browser",
						},
					],
					args: {
						name: "run-id",
					},
				},
				{
					name: "watch",
					description: "Watch a run until it completes, showing its progress",
					options: [
						ghOptions.all,
						{
							name: "--exit-status",
							description: "Exit with non-zero status if run fails",
						},
						{
							name: ["-i", "--interval"],
							description: "Refresh interval in seconds (default 3)",
							args: {
								name: "int",
							},
						},
					],
				},
			],
		},
		{
			name: "secret",
			description: "Manage GitHub secrets",
			options: [ghOptions.all],
			subcommands: [
				{
					name: "list",
					description:
						"List secrets for a repository, environment, or organization",
					options: [
						ghOptions.all,
						{
							name: ["-e", "--env"],
							description: "List secrets for an environment",
							args: {
								name: "string",
							},
						},
						{
							name: ["-o", "--org"],
							description: "List secrets for an environment",
							args: {
								name: "string",
							},
						},
					],
				},
				{
					name: "remove",
					description: "Remove secrets",
					options: [ghOptions.all, ghOptions.env, ghOptions.org],
				},
				{
					name: "set",
					description: "Create or update secrets",
					options: [
						ghOptions.all,
						ghOptions.env,
						ghOptions.org,
						{
							name: ["-b", "--body"],
							description:
								"A value for the secret. Reads from STDIN if not specified",
							args: {
								name: "string",
							},
						},
						{
							name: ["-v", "--visibility"],
							description:
								"Set visibility for an organization secret: all, `private`, or `selected` (default 'private')",
							args: {
								name: "string",
								suggestions: [
									{ name: "private" },
									{
										name: "selected",
									},
									{
										name: "all",
									},
								],
							},
						},
					],
				},
			],
		},
		{
			name: "ssh-key",
			description: "Manage SSH keys",

			subcommands: [
				{
					name: "add",
					description: "Add an SSH key to your GitHub account",
					options: [
						ghOptions.all,
						{
							name: ["-t", "--title"],
							description: "Title for the new key",
						},
					],
					args: {
						name: "<key-file>",
						template: "filepaths",
					},
				},
				{
					name: "list",
					description: "Lists SSH keys in your GitHub account",
					options: [ghOptions.all],
				},
			],
		},
		{
			name: "workflow",
			description: "View details about GitHub Actions workflows",
			options: [ghOptions.all],
			subcommands: [
				{
					name: "disable",
					description: "Disable a workflow",
					options: [ghOptions.all],
					args: {
						name: "[<workflow-id> | <workflow-name>]",
					},
				},
				{
					name: "enable",
					description: "Enable a workflow",
					options: [ghOptions.all],
					args: {
						name: "[<workflow-id> | <workflow-name>]",
					},
				},
				{
					name: "list",
					description: "List workflows",
					options: [
						ghOptions.all,
						{
							name: ["-a", "--all"],
							description: "Show all workflows, including disabled workflows",
						},
						{
							name: ["-L", "--limit"],
							description: "Show all workflows, including disabled workflows",
							args: {
								name: "int",
								description:
									"Maximum number of workflows to fetch (default 50)",
							},
						},
					],
					args: {
						name: "[<workflow-id> | <workflow-name>]",
					},
				},
				{
					name: "run",
					description: "Run a workflow by creating a workflow_dispatch event",
					options: [
						ghOptions.all,
						{
							name: ["-F", "--field"],
							description:
								"Add a string parameter in key=value format, respecting @ syntax",
							args: {
								name: "key=value",
							},
						},
						{
							name: "--json",
							description: "Read workflow inputs as JSON via STDIN",
						},
						{
							name: ["-f", "--raw-field"],
							description: "Add a string parameter in key=value format",
							args: {
								name: "key=value",
							},
						},
						{
							name: ["-r", "--ref"],
							description:
								"The branch or tag name which contains the version of the workflow file you'd like to run",
							args: {
								name: "string",
							},
						},
					],
					args: {
						name: "[<workflow-id> | <workflow-name>]",
					},
				},
				{
					name: "view",
					description: "View the summary of a workflow",
					options: [
						ghOptions.all,
						{
							name: ["-r", "--ref"],
							description:
								"The branch or tag name which contains the version of the workflow file you'd like to view",
							args: {
								name: "string",
							},
						},
						{
							name: ["-w", "--web"],
							description: "Open workflow in the browser",
						},
						{
							name: ["-y", "--yaml"],
							description: "View the workflow yaml file",
						},
					],
					args: [
						{
							name: "workflow-id",
						},
						{
							name: "workflow-name",
						},
						{
							name: "filename",
							template: "filepaths",
						},
					],
				},
			],
		},
		{
			name: ["codespace", "cs"],
			description: "Connect to and manage codespaces",
			subcommands: [
				{
					name: "code",
					description: "Open a codespace in Visual Studio Code",
					options: [
						codespaceOption,
						{
							name: "--insiders",
							description: "Use the insiders version of Visual Studio Code",
						},
						{
							name: ["-w", "--web"],
							description: "Use the web version of Visual Studio Code",
						},
					],
				},
				{
					name: "cp",
					description:
						"The cp command copies files between the local and remote file systems",
					options: [
						codespaceOption,
						{
							name: ["-e", "--expand"],
							description: "Expand remote file names on remote shell",
						},
						{
							name: ["-p", "--profile"],
							description: "Name of the SSH profile to use",
							args: {
								name: "string",
							},
						},
						{
							name: ["-r", "--recursive"],
							description: "Recursively copy directories",
						},
					],
					args: [
						{
							name: "sources",
							isVariadic: true,
						},
						{
							name: "dest",
						},
					],
				},
				{
					name: "create",
					description: "Create a codespace",
					options: [
						{
							name: ["-b", "--branch"],
							description: "Repository branch",
						},
						{
							name: "--default-permissions",
							description:
								"Do not prompt to accept additional permissions requested by the codespace",
						},
						{
							name: "--devcontainer-path",
							description:
								"Path to the devcontainer.json file to use when creating codespace",
							args: {
								generators: filepaths({ extensions: ["json"] }),
							},
						},
						{
							name: ["-d", "--display-name"],
							description: "Display name for the codespace",
							args: {
								name: "string",
							},
						},
						{
							name: "--idle-timeout",
							description: "Allowed inactivity before codespace is stopped",
							args: {
								name: "duration",
								description: "Example: '10m', '1h'",
							},
						},
						{
							name: ["-l", "--location"],
							description: "Determined automatically if not provided",
							args: {
								name: "location",
								suggestions: [
									"EastUs",
									"SouthEastAsia",
									"WestEurope",
									"WestUs2",
								],
							},
						},
						{
							name: ["-m", "--machine"],
							description: "Hardware specifications for the VM",
							args: {
								name: "string",
							},
						},
						{
							name: ["-R", "--repo"],
							description: "Repository name with owner: user/repo",
							args: {
								name: "string",
							},
						},
						{
							name: "--retention-period",
							description:
								"Allowed time after shutting down before the codespace is automatically deleted (maximum 30 days)",
							args: {
								name: "duration",
								description: "Example: '10m', '1h'",
							},
						},
						{
							name: ["-s", "--status"],
							description: "Show status of post-create command and dotfiles",
						},
					],
				},
				{
					name: "delete",
					description:
						"Delete codespaces based on selection criteria. All codespaces for the authenticated user can be deleted, as well as codespaces for a specific repository. Alternatively, only codespaces older than N days can be deleted. Organization administrators may delete any codespace billed to the organization",
					options: [
						codespaceOption,
						{
							name: "--all",
							description: "Delete all codespaces",
						},
						{
							name: "--days",
							description: "Delete codespaces older than N days",
							args: {
								name: "N days",
							},
						},
						{
							name: ["-f", "--force"],
							description:
								"Skip confirmation for codespaces that contain unsaved changes",
							isDangerous: true,
						},
						{
							name: ["-o", "--org"],
							description: "The login handle of the organization (admin-only)",
							args: {
								name: "login",
							},
						},
						{
							name: ["-r", "--repo"],
							description: "Delete codespaces for a repository",
							args: {
								name: "repository",
							},
						},
						{
							name: ["-u", "--user"],
							description: "The username to delete codespaces for",
							args: {
								name: "username",
							},
						},
					],
				},
				{
					name: "edit",
					description: "Edit a codespace",
					options: [
						codespaceOption,
						{
							name: ["-d", "--display-name"],
							description: "Set the display name",
							args: {
								name: "string",
							},
						},
						{
							name: ["-m", "--machine"],
							description: "Set hardware specifications for the VM",
							args: {
								name: "string",
							},
						},
					],
				},
				{
					name: "jupyter",
					description: "Open a codespace in JupyterLab",
					options: [codespaceOption],
				},
				{
					name: "list",
					description:
						"List codespaces of the authenticated user. Alternatively, organization administrators may list all codespaces billed to the organization",
					options: [
						{
							name: ["-q", "--jq"],
							description: "Filter JSON output using a jq expression",
							args: {
								name: "expression",
							},
						},
						{
							name: "--json",
							description: "Output JSON with the specified fields",
							args: {
								name: "fields",
							},
						},
						{
							name: ["-L", "--limit"],
							description: "Maximum number of codespaces to list",
							args: {
								name: "int",
								default: "30",
							},
						},
						{
							name: ["-o", "--org"],
							description:
								"The login handle of the organization to list codespaces for (admin-only)",
							args: {
								name: "login",
							},
						},
						{
							name: ["-R", "--repo"],
							description: "Repository name with owner: user/repo",
							args: {
								name: "string",
							},
						},
						{
							name: ["-t", "--template"],
							description:
								"Format JSON output using a Go template; see 'gh help formatting'",
							args: {
								name: "string",
							},
						},
						{
							name: ["-u", "--user"],
							description: "The username to list codespaces for",
							args: {
								name: "string",
							},
						},
					],
				},
				{
					name: "logs",
					description: "Access codespace logs",
					options: [
						codespaceOption,
						{
							name: ["-f", "--follow"],
							description: "Tail and follow the logs",
						},
					],
				},
				{
					name: "ports",
					description: "List ports in a codespace",
					subcommands: [
						{
							name: "forward",
							description: "Forward ports",
							options: [codespaceOption],
							args: {
								generators: keyValue({ separator: ":", cache: true }),
								isVariadic: true,
							},
						},
						{
							name: "visibility",
							description: "Change the visibility of the forwarded port",
							options: [codespaceOption],
							args: {
								generators: keyValue({
									separator: ":",
									values: ["public", "private", "org"],
									cache: true,
								}),
								isVariadic: true,
							},
						},
					],
					options: [
						codespaceOption,
						{
							name: ["-q", "--jq"],
							description: "Filter JSON output using a jq expression",
							args: {
								name: "expression",
							},
						},
						{
							name: "--json",
							description: "Output JSON with the specified fields",
							args: {
								name: "fields",
							},
						},
						{
							name: ["-t", "--template"],
							description:
								"Format JSON output using a Go template; see 'gh help formatting'",
							args: {
								name: "string",
							},
						},
					],
				},
				{
					name: "rebuild",
					description: "Rebuild a codespace",
					options: [codespaceOption],
				},
				{
					name: "ssh",
					description: "SSH into a codespace",
					options: [
						codespaceOption,
						{
							name: "--config",
							description: "Write OpenSSH configuration to stdout",
						},
						{
							name: ["-d", "--debug"],
							description: "Log debug data to a file",
						},
						{
							name: "--debug-file",
							description: "Path of the file log to",
							args: {
								name: "file",
								template: "filepaths",
								suggestCurrentToken: true,
							},
						},
						{
							name: "--profile",
							description: "Name of the SSH profile to use",
							args: {
								name: "string",
							},
						},
						{
							name: "--server-port",
							description: "SSH server port number (0 => pick unused)",
							args: {
								name: "int",
							},
						},
					],
					args: {
						name: "command",
						isCommand: true,
						isOptional: true,
					},
				},
				{
					name: "stop",
					description: "Stop running a codespace",
					options: [
						codespaceOption,
						{
							name: ["-o", "--org"],
							description: "The login handle of the organization (admin-only)",
							args: {
								name: "login",
							},
						},
						{
							name: ["-u", "--user"],
							description: "The username to delete codespaces for",
							args: {
								name: "username",
							},
						},
					],
				},
			],
		},
		{
			name: "project",
			description: "Manage projects",
			subcommands: [
				{
					name: "create",
					description: "Create a project",
					options: [
						{
							name: "--title",
							description: "Title for the project",
							args: { name: "title" },
						},
						{
							name: "--owner",
							description: 'Login of the owner. Use "@me" for the current user',
							args: { name: "owner" },
						},
						{
							name: "--format",
							description: "Output format: {json}",
							args: { name: "body" },
						},
					],
				},
				{
					name: "edit",
					description: "Edit a project",
					options: [
						{
							name: "--title",
							description: "New title of the project",
							args: { name: "title" },
						},
						{
							name: ["-d", "--description"],
							description: "New description of the project",
							args: { name: "description" },
						},
						{
							name: "--owner",
							description: 'Login of the owner. Use "@me" for the current user',
							args: { name: "owner" },
						},
						{
							name: "--readme",
							description: "New readme for the project",
							args: { name: "readme" },
						},
						{
							name: "--visibility",
							description: "Change project visibility",
							args: { name: "visibility", suggestions: ["PUBLIC", "PRIVATE"] },
						},
					],
				},
				{
					name: "list",
					description: "List projects",
					options: [
						{
							name: "--closed",
							description: "Include closed projects",
							args: { name: "closed" },
						},
						{
							name: "--owner",
							description: "Login of the owner",
							args: { name: "owner" },
						},
						{
							name: ["-L", "--limit"],
							description: "Maximum number of projects to fetch",
							args: { name: "int", default: "30" },
						},
						{
							name: "--format",
							description: "Output format: {json}",
							args: { name: "format" },
						},
						{
							name: "--web",
							description: "Open projects list in the browser",
						},
					],
				},
				{
					name: "delete",
					description: "Delete a project",
					options: [
						{
							name: "--owner",
							description: "Login of the owner. Use @me for the current user",
							args: { name: "owner" },
						},
						{
							name: "--format",
							description: "Output format: {json}",
							args: { name: "format" },
						},
					],
				},
				{
					name: "close",
					description: "Close a project",
					options: [
						{
							name: "--owner",
							description: "Login of the owner. Use @me for the current user",
							args: { name: "owner" },
						},
						{
							name: "--format",
							description: "Output format: {json}",
							args: { name: "format" },
						},
						{
							name: "--undo",
							description: "Reopen a closed project",
						},
					],
				},
				{
					name: "view",
					description: "View a project",
					options: [
						{
							name: "--owner",
							description: "Login of the owner. Use @me for the current user",
							args: { name: "owner" },
						},
						{
							name: "--format",
							description: "Output format: {json}",
							args: { name: "format" },
						},
						{
							name: ["-w", "--web"],
							description: "Open project in the browser",
						},
					],
				},
				{
					name: "copy",
					description: "Copy a project",
					options: [
						{
							name: "--title",
							description: "Title for the new project",
							args: { name: "title" },
						},
						{
							name: "--target-owner",
							description:
								"Login of the target owner. Use @me for the current user",
							args: { name: "target-owner" },
						},
						{
							name: "--source-owner",
							description:
								"Login of the source owner. Use @me for the current user",
							args: { name: "source-owner" },
						},
						{
							name: "--format",
							description: "Output format: {json}",
							args: { name: "format" },
						},
						{
							name: "--drafts",
							description: "Include draft issues when copying",
						},
					],
				},
				{
					name: "field-create",
					description: "Create a project field",
					options: [
						{
							name: "--name",
							description: "Name of the field",
							args: { name: "name" },
						},
						{
							name: "--data-type",
							description: "DataType of the new field",
							args: {
								name: "data-type",
								suggestions: ["TEXT", "SINGLE_SELECT", "DATE", "NUMBER"],
							},
						},
						{
							name: "--owner",
							description: "Login of the owner. Use @me for the current user",
							args: { name: "owner" },
						},
						{
							name: "--format",
							description: "Output format: {json}",
							args: { name: "format" },
						},
						{
							name: "--single-select-options",
							description: "Options for SINGLE_SELECT data type",
							args: { name: "single-select-options" },
						},
					],
				},
				{
					name: "field-delete",
					description: "Delete a project field",
					options: [
						{
							name: "--id",
							description: "ID of the field to delete",
							args: { name: "id" },
						},
						{
							name: "--format",
							description: "Output format: {json}",
						},
					],
				},
				{
					name: "field-list",
					description: "List project fields",
					options: [
						{
							name: "--owner",
							description: "Login of the owner. Use @me for the current user",
							args: { name: "owner" },
						},
						{
							name: "--format",
							description: "Output format: {json}",
						},
						{
							name: ["-L", "--limit"],
							description: "Maximum number of fields to fetch",
							args: { name: "int", default: "30" },
						},
					],
				},
				{
					name: "item-create",
					description: "Create a draft issue item in a project",
					options: [
						{
							name: "--title",
							description: "Title for the draft issue",
							args: { name: "title" },
						},
						{
							name: "--body",
							description: "Body for the draft issue",
							args: { name: "body" },
						},
						{
							name: "--format",
							description: "Output format: {json}",
							args: { name: "format" },
						},
						{
							name: "--owner",
							description: "Login of the owner. Use @me for the current user",
							args: { name: "owner" },
						},
					],
				},
				{
					name: "item-edit",
					description: "Edit a project item",
					options: [
						{
							name: "--id",
							description: "ID of the item to edit",
							args: { name: "id" },
						},
						{
							name: "--project-id",
							description: "ID of the project to which the field belongs to",
							args: { name: "project-id" },
						},
						{
							name: "--title",
							description: "Title of the draft issue item",
							args: { name: "title" },
						},
						{
							name: "--body",
							description: "Body of the draft issue item",
							args: { name: "body" },
						},
						{
							name: "--format",
							description: "Output format: {json}",
							args: { name: "format" },
						},
						{
							name: "--field-id",
							description: "ID of the field to update",
							args: { name: "field-id" },
						},
						{
							name: "--iteration-id",
							description: "ID of the iteration value to set on the field",
							args: { name: "iteration-id" },
						},
						{
							name: "--text",
							description: "Text value for the field",
							args: { name: "text" },
						},
						{
							name: "--number",
							description: "Number value for the field",
							args: { name: "number" },
						},
						{
							name: "--single-select-option-id",
							description:
								"ID of the single select option value to set on the field",
							args: { name: "single-select-option-id" },
						},
						{
							name: "--date",
							description: "Date value for the field (YYYY-MM-DD)",
							args: { name: "date" },
						},
					],
				},
				{
					name: "item-delete",
					description: "Delete a project item",
					options: [
						{
							name: "--id",
							description: "ID of the item to delete",
							args: { name: "id" },
						},
						{
							name: "--format",
							description: "Output format: {json}",
							args: { name: "format" },
						},
						{
							name: "--owner",
							description: "Login of the owner. Use @me for the current user",
							args: { name: "owner" },
						},
					],
				},
				{
					name: "item-list",
					description: "List project items",
					options: [
						{
							name: "--format",
							description: "Output format: {json}",
							args: { name: "format" },
						},
						{
							name: ["-L", "--limit"],
							description: "Maximum number of items to fetch",
							args: { name: "int", default: "30" },
						},
						{
							name: "--owner",
							description: "Login of the owner. Use @me for the current user",
							args: { name: "owner" },
						},
					],
				},
				{
					name: "item-add",
					description: "Add a pull request or an issue to a project",
					options: [
						{
							name: "--url",
							description:
								"URL of the issue or pull request to add to the project",
							args: { name: "url" },
						},
						{
							name: "--owner",
							description: "Login of the owner. Use @me for the current user",
							args: { name: "owner" },
						},
						{
							name: "--format",
							description: "Output format: {json}",
							args: { name: "format" },
						},
					],
				},
				{
					name: "item-archive",
					description: "Archive a project item",
					options: [
						{
							name: "--id",
							description: "ID of the item to archive",
							args: { name: "id" },
						},
						{
							name: "--format",
							description: "Output format: {json}",
							args: { name: "format" },
						},
						{
							name: "--owner",
							description: "Login of the owner. Use @me for the current user",
							args: { name: "owner" },
						},
						{
							name: "--undo",
							description: "Unarchive a project item",
						},
					],
				},
			],
		},
	],
	options: [
		{
			name: "--help",
			description: "Show help for command",
			isPersistent: true,
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

````
