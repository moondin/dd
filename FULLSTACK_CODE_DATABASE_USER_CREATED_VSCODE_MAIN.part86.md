---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 86
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 86 of 552)

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

---[FILE: extensions/terminal-suggest/src/completions/upstream/ssh.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/ssh.ts

```typescript
const knownHostRegex = /(?:[a-zA-Z0-9-]+\.)+[a-zA-Z0-9]+/; // will match numerical IPs as well as domains/subdomains

const resolveAbsolutePath = (
	path: string,
	basePath: string,
	home: string
): string => {
	if (path.startsWith("/") || path.startsWith("~/") || path === "~") {
		return path.replace("~", home);
	}
	if (
		basePath.startsWith("/") ||
		basePath.startsWith("~/") ||
		basePath === "~"
	) {
		return (
			basePath.replace("~", home) +
			(basePath.replace("~", home).endsWith("/") ? "" : "/") +
			path
		);
	}
	return basePath + (basePath.endsWith("/") ? "" : "/") + path;
};

const getConfigLines = async (
	file: string,
	executeShellCommand: Fig.ExecuteCommandFunction,
	home: string,
	basePath: string
) => {
	const absolutePath = resolveAbsolutePath(file, basePath, home);

	const { stdout } = await executeShellCommand({
		command: "cat",
		// eslint-disable-next-line @withfig/fig-linter/no-useless-arrays
		args: [absolutePath],
	});
	const configLines = stdout.split("\n").map((line) => line.trim());

	// Get list of includes in the config file
	const includes = configLines
		.filter((line) => line.toLowerCase().startsWith("include "))
		.map((line) => line.split(" ")[1]);

	// Get the lines of every include file
	const includeLines: string[][] = await Promise.all(
		includes.map((file) =>
			getConfigLines(file, executeShellCommand, home, basePath)
		)
	);

	// Combine config lines with includes config lines
	return [...configLines, ...includeLines.flat()];
};

export const knownHosts: Fig.Generator = {
	custom: async (tokens, executeCommand, context) => {
		const { stdout } = await executeCommand({
			command: "cat",
			// eslint-disable-next-line @withfig/fig-linter/no-useless-arrays
			args: [`${context.environmentVariables["HOME"]}/.ssh/known_hosts`],
		});

		return stdout
			.split("\n")
			.map((line) => {
				const match = knownHostRegex.exec(line);
				if (match) {
					return String(match);
				}
			})
			.filter((value, index, self) => value && self.indexOf(value) === index)
			.map((knownHost) => ({
				name: (tokens[1].endsWith("@") ? tokens[1] : "") + knownHost, // also suggest when user@ is provided
				description: "SSH host",
			}));
	},
	trigger: "@",
};

export const configHosts: Fig.Generator = {
	custom: async (tokens, executeShellCommand, context) => {
		const configLines = await getConfigLines(
			"config",
			executeShellCommand,
			context.environmentVariables["HOME"],
			"~/.ssh"
		);

		return configLines
			.filter(
				(line) =>
					line.trim().toLowerCase().startsWith("host ") && !line.includes("*")
			)
			.map((host) => ({
				name: host.split(" ")[1],
				description: "SSH host",
				priority: 90,
			}));
	},
};

const completionSpec: Fig.Spec = {
	name: "ssh",
	description: "Log into a remote machine",
	args: {
		name: "user@hostname",
		description: "Address of remote machine to log into",
		generators: [knownHosts, configHosts, { template: "history" }],
	},
	options: [
		{
			name: "-1",
			description: "Forces ssh to try protocol version 1 only",
		},
		{
			name: "-2",
			description: "Forces ssh to try protocol version 2 only",
		},
		{
			name: "-4",
			description: "Forces ssh to use IPv4 addresses only",
		},
		{
			name: "-6",
			description: "Forces ssh to use IPv6 addresses only",
		},
		{
			name: "-A",
			description: "Enables forwarding of the authentication agent connection",
		},
		{
			name: "-a",
			description: "Disables forwarding of the authentication agent connection",
		},
		{
			name: "-b",
			description:
				"Use bind_address on the local machine as the source address of the connection",
			args: {
				name: "bind address",
				description: "Source address of the connection",
			},
		},
		{
			name: "-C",
			description:
				"Requests compression of all data (including stdin, stdout, stderr, and data for forwarded X11 and TCP connections)",
		},
		{
			name: "-c",
			description:
				"Selects the cipher specification for encrypting the session",
			args: {
				name: "cipher spec",
				description: "The selected cipher specification",
			},
		},
		{
			name: "-D",
			description:
				"Specifies a local 'dynamic' application-level port forwarding",
			args: {
				name: "port",
				description: "Port of the bind address",
			},
		},
		{
			name: "-e",
			description:
				"Sets the escape character for sessions with a pty (default: '~')",
			args: {
				name: "escape char",
				description: "Specified escape character",
			},
		},
		{
			name: "-F",
			description: "Specifies an alternative per-user configuration file",
			args: {
				name: "configfile",
				description: "Path to alternative config file",
				template: "filepaths",
			},
		},
		{
			name: "-f",
			description:
				"Requests ssh to go to background just before command execution",
		},
		{
			name: "-g",
			description: "Allows remote hosts to connect to local forwarded ports",
		},
		{
			name: "-I",
			description:
				"Specify the PKCS#11 shared library ssh should use to communicate with a PKCS#11 token providing the user's private RSA key",
			args: {
				name: "pkcs11",
			},
		},
		{
			name: "-i",
			description:
				"Selects a file from which the identity (private key) for public key authentication is read",
			isRepeatable: true,
			args: {
				name: "identity file",
				description: "Path to identity (private key)",
				template: "filepaths",
			},
		},
		{
			name: "-K",
			description:
				"Enables GSSAPI-based authentication and forwarding (delegation) of GSSAPI credentials to the server",
		},
		{
			name: "-k",
			description:
				"Disables forwarding (delegation) of GSSAPI credentials to the server",
		},
		{
			name: "-L",
			description:
				"Specifies that the given port on the local (client) host is to be forwarded to the given host and port on the remote side",
			args: {
				name: "port:host:hostport",
				description: "Local port, followed by host and host port to forward to",
			},
		},
		{
			name: "-l",
			description: "Specifies the user to log in as on the remote machine",
			args: {
				name: "login name",
				description: "Name of user logging into remote machine",
			},
		},
		{
			name: "-M",
			description:
				"Places the ssh client into ``master'' mode for connection sharing",
			isRepeatable: true,
		},
		{
			name: "-m",
			description:
				"Additionally, for protocol version 2 a comma-separated list of MAC (message authentication code) algorithms can be specified in order of preference",
			args: {
				name: "mac spec",
			},
		},
		{
			name: "-N",
			description: "Do not execute a remote command",
		},
		{
			name: "-n",
			description:
				"Redirects stdin from /dev/null (actually, prevents reading from stdin)",
		},
		{
			name: "-O",
			description: "Control an active connection multiplexing master process",
			args: {
				name: "ctl cmd",
				description: "Command that's passed to the master process",
			},
		},
		{
			name: "-o",
			description:
				"Can be used to give options in the format used in the configuration file",
			isRepeatable: true,
			args: {
				name: "option",
				description:
					"Options that can be specified in the format of the config file",
				suggestions: [
					{ name: "AddressFamily" },
					{ name: "BatchMode" },
					{ name: "BindAddress" },
					{ name: "ChallengeResponseAuthentication" },
					{ name: "CheckHostIP" },
					{ name: "Cipher" },
					{ name: "Ciphers" },
					{ name: "ClearAllForwardings" },
					{ name: "Compression" },
					{ name: "CompressionLevel" },
					{ name: "ConnectionAttempts" },
					{ name: "ConnectTimeout" },
					{ name: "ControlMaster" },
					{ name: "ControlPath" },
					{ name: "ControlPersist" },
					{ name: "DynamicForward" },
					{ name: "EscapeChar" },
					{ name: "ExitOnForwardFailure" },
					{ name: "ForwardAgent" },
					{ name: "ForwardX11" },
					{ name: "ForwardX11Timeout" },
					{ name: "ForwardX11Trusted" },
					{ name: "GatewayPorts" },
					{ name: "GlobalKnownHostsFile" },
					{ name: "GSSAPIAuthentication" },
					{ name: "GSSAPIDelegateCredentials" },
					{ name: "HashKnownHosts" },
					{ name: "Host" },
					{ name: "HostbasedAuthentication" },
					{ name: "HostKeyAlgorithms" },
					{ name: "HostKeyAlias" },
					{ name: "HostName" },
					{ name: "IdentityFile" },
					{ name: "IdentitiesOnly" },
					{ name: "IPQoS" },
					{ name: "KbdInteractiveAuthentication" },
					{ name: "KbdInteractiveDevices" },
					{ name: "KexAlgorithms" },
					{ name: "LocalCommand" },
					{ name: "LocalForward" },
					{ name: "LogLevel" },
					{ name: "MACs" },
					{ name: "NoHostAuthenticationForLocalhost" },
					{ name: "NumberOfPasswordPrompts" },
					{ name: "PasswordAuthentication" },
					{ name: "PermitLocalCommand" },
					{ name: "PKCS11Provider" },
					{ name: "Port" },
					{ name: "PreferredAuthentications" },
					{ name: "Protocol" },
					{ name: "ProxyCommand" },
					{ name: "PubkeyAuthentication" },
					{ name: "RekeyLimit" },
					{ name: "RequestTTY" },
					{ name: "RhostsRSAAuthentication" },
					{ name: "RSAAuthentication" },
					{ name: "SendEnv" },
					{ name: "ServerAliveInterval" },
					{ name: "ServerAliveCountMax" },
					{ name: "StrictHostKeyChecking" },
					{ name: "TCPKeepAlive" },
					{ name: "Tunnel" },
					{ name: "TunnelDevice" },
					{ name: "UsePrivilegedPort" },
					{ name: "User" },
					{ name: "UserKnownHostsFile" },
					{ name: "VerifyHostKeyDNS" },
					{ name: "VisualHostKey" },
					{ name: "XAuthLocation" },
				],
			},
		},
		{
			name: "-p",
			description: "Port to connect to on the remote host",
			args: {
				name: "port",
				description: "Port to connect to",
			},
		},
		{
			name: "-q",
			description:
				"Quiet mode.  Causes most warning and diagnostic messages to be suppressed",
		},
		{
			name: "-R",
			description:
				"Specifies that the given port on the remote (server) host is to be forwarded to the given host and port on the local side",
			args: {
				name: "port:host:hostport",
				description: "Local port, followed by host and host port to forward to",
			},
		},
		{
			name: "-S",
			description:
				"Specifies the location of a control socket for connection sharing, or the string 'none' to disable connection sharing",
			args: {
				name: "ctl_path",
				description: "Location of the control socket",
				template: "filepaths",
			},
		},
		{
			name: "-s",
			description:
				"May be used to request invocation of a subsystem on the remote system",
		},
		{
			name: "-T",
			description: "Disable pseudo-tty allocation",
		},
		{
			name: "-t",
			description: "Force pseudo-tty allocation",
			isRepeatable: true,
		},
		{
			name: "-V",
			description: "Display the version number and exit",
		},
		{
			name: "-v",
			description:
				"Verbose mode.  Causes ssh to print debugging messages about its progress",
			isRepeatable: 3,
		},
		{
			name: "-W",
			description:
				"Requests that standard input and output on the client be forwarded to host on port over the secure channel",
			args: {
				name: "host:port",
				description: "Host and port to forward to",
			},
		},
		{
			name: "-w",
			description:
				"Requests tunnel device forwarding with the specified tun(4) devices between the client (local_tun) and the server (remote_tun)",
			args: {
				name: "local tun",
				description: "Local device to forward to",
			},
		},
		{
			name: "-X",
			description: "Enables X11 forwarding",
		},
		{
			name: "-x",
			description: "Disables X11 forwarding",
		},
		{
			name: "-Y",
			description: "Enables trusted X11 forwarding",
		},
		{
			name: "-y",
			description: "Send log information using the syslog(3) system module",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/stat.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/stat.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "stat",
	description: "Display file status",
	options: [
		{
			name: "-F",
			description:
				"As in ls(1), display a slash ('/') immediately after each pathname that is a directory, an asterisk ('*') after each that is executable, an at sign ('@') after each symbolic link, a percent sign ('%') after each whiteout, an equal sign ('=') after each socket, and a vertical bar ('|') after each that is a FIFO.  The use of -F implies -l",
		},
		{
			name: "-L",
			description:
				"Use stat(2) instead of lstat(2). The information reported by stat will refer to the target of file, if file is a symbolic link, and not to file itself.  If the link is broken or the target does not exist, fall back on lstat(2) and report information about the link",
		},
		{
			name: "-f",
			description:
				"Display information using the specified format; similar to printf(3) formats in that they start with %, are then followed by a sequence of formatting characters, and end in a character that selects the field of the struct stat which is to be formatted",
			args: {
				name: "format",
			},
			exclusiveOn: ["-l", "-r", "-s", "-x"],
		},
		{
			name: "-l",
			description: "Display output in 'ls -lT' format",
			exclusiveOn: ["-f", "-r", "-s", "-x"],
		},
		{
			name: "-n",
			description:
				"Do not force a newline to appear at the end of each piece of output",
		},
		{
			name: "-q",
			description:
				"Suppress failure messages if calls to stat(2) or lstat(2) fail. When run as 'readlink', error messages are automatically suppressed",
		},
		{
			name: "-r",
			description:
				"Display raw information. That is, for all the fields in the stat structure, display the raw, numerical value (for example, times in seconds since the epoch, etc.)",
			exclusiveOn: ["-f", "-l", "-s", "-x"],
		},
		{
			name: "-s",
			description:
				"Display information in 'shell output' format, suitable for initializing variables",
			exclusiveOn: ["-f", "-l", "-r", "-x"],
		},
		{
			name: "-t",
			description:
				"Display timestamps using the specified format. This format is passed directly to strftime(3)",
			args: {
				name: "timefmt",
			},
		},
		{
			name: "-x",
			description:
				"Display information in a more verbose way as known from some Linux distributions",
		},
	],
	args: {
		name: "file",
		description: "File(s) to stat",
		isVariadic: true,
		template: "filepaths",
	},
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/su.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/su.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "su",
	description: "",
	options: [
		{
			name: "-f",
			description:
				"If the invoked shell is csh(1), this option prevents it from reading the .cshrc file",
		},
		{
			name: "-l",
			description:
				"Simulate a full login.  The environment is discarded except for  HOME, SHELL, PATH, TERM, and USER. HOME and SHELL are modified as above.  USER is set to the target login.  PATH is set to   ``/bin:/usr/bin''.  TERM is imported from your current environment.  The invoked shell is the target login's, and su willchange directory to the target login's home directory",
		},
		{ name: "-", description: "(no letter) The same as -l" },
		{
			name: "-m",
			description:
				"Leave the environment unmodified.  The invoked shell is your login shell, and no directory changes are made.  As a security precaution, if the target user's shell is a non-standard shell (as defined by getusershell(3)) and the caller's real uid is non-zero, su will fail",
		},
	],
	args: [
		{ name: "login", isOptional: true },
		{ name: "ARGS", isOptional: true },
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/sudo.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/sudo.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "sudo",
	description: "Execute a command as the superuser or another user",
	options: [
		{
			name: ["-g", "--group"],
			description: "Run command as the specified group name or ID",
			args: {
				name: "group",
				description: "Group name or ID",
			},
		},
		{
			name: ["-h", "--help"],
			description: "Display help message and exit",
		},
		{
			name: ["-u", "--user"],
			description: "Run command as specified user name or ID",
			args: {
				name: "user",
				description: "User name or ID",
			},
		},
	],
	// Only uncomment if sudo takes an argument
	args: {
		name: "command",
		description: "Command to run with elevated permissions",
		isCommand: true,
	},
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/tac.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/tac.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "tac",
	description: "Concatenate and print files in reverse",
	parserDirectives: {
		optionsMustPrecedeArguments: true,
	},
	options: [
		{
			name: "--help",
			description: "Display this help and exit",
		},
		{
			name: ["--before", "-b"],
			description: "Attach the separator before instead of after",
		},
		{
			name: ["--regex", "-r"],
			description: "Interpret the separator as a regular expression",
		},
		{
			name: ["--separator", "-s"],
			description: "Use STRING as the separator instead of newline",
			args: {
				name: "STRING",
			},
		},
		{
			name: "--version",
			description: "Output version information and exit",
		},
	],
	args: {
		name: "FILE",
		template: "filepaths",
	},
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/tail.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/tail.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "tail",
	description: "Display the last part of a file",
	args: {
		isVariadic: true,
		template: "filepaths",
	},
	options: [
		{
			name: "-f",
			description: "Wait for additional data to be appended",
		},
		{
			name: "-r",
			description: "Display in reverse order",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/tar.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/tar.ts

```typescript
const sizeSuffixes: Fig.Suggestion[] = [
	{ name: "Blocks", insertValue: "{cursor}b" },
	{ name: "Bytes", insertValue: "{cursor}c" },
	{ name: "Gigabytes", insertValue: "{cursor}G" },
	{ name: "Kilobytes", insertValue: "{cursor}K" },
	{ name: "Megabytes", insertValue: "{cursor}M" },
	{ name: "Petabytes", insertValue: "{cursor}P" },
	{ name: "Terabytes", insertValue: "{cursor}T" },
	{ name: "Words", insertValue: "{cursor}w" },
];

const fileOptions: Fig.Option[] = [
	{
		name: ["f", "-f", "--file"],
		description: "Use archive file or device ARCHIVE",
		isRequired: true,
		args: { name: "ARCHIVE" },
	},
	{
		name: "--force-local",
		description: "Archive file is local even if it has a colon",
		dependsOn: ["f", "-f", "--file"],
	},
	{
		name: ["F", "-F", "--info-script", "--new-volume-script"],
		description: "Run  COMMAND  at the end of each tape",
		args: { name: "COMMAND" },
	},
	{
		name: ["L", "-L", "--tape-length"],
		description: "Change tape after writing Nx1024 bytes",
		args: { name: "N", suggestions: sizeSuffixes },
	},
	{
		name: ["M", "-M", "--multi-volume"],
		description: "Create/list/extract multi-volume archive",
	},
	{
		name: "--rmt-command",
		description: "Use  COMMAND instead of rmt when accessing remote archives",
		args: { name: "COMMAND" },
	},
	{
		name: "--rsh-command",
		description: "Use  COMMAND instead of rsh when accessing remote archives",
		args: { name: "COMMAND" },
	},
	{
		name: "--volno-file",
		description:
			"Tar will keep track of which volume of a multi-volume archive it is working in FILE",
		dependsOn: ["M", "-M", "--multi-volume"],
		args: { name: "FILE" },
	},
];

const compressionExclusive: string[] = [
	"a",
	"-a",
	"--auto-compress",
	"I",
	"-I",
	"--use-compress-program",
	"j",
	"-j",
	"--bzip2",
	"J",
	"-J",
	"--xz",
	"--lzip",
	"--lzma",
	"--lzop",
	"--no-auto-compress",
	"z",
	"-z",
	"--gzip",
	"--gunzip",
	"--ungzip",
	"Z",
	"-Z",
	"--compress",
	"--uncompress",
	"--zstd",
];

// --create && --append && --update && --list && --extract
const compressionOptions: Fig.Option[] = [
	{
		name: ["a", "-a", "--auto-compress"],
		description: "Use archive suffix to determine the compression program",
		exclusiveOn: compressionExclusive,
	},
	{
		name: ["I", "-I", "--use-compress-program"],
		description: "Filter data through COMMAND",
		exclusiveOn: compressionExclusive,
		args: { name: "COMMAND" },
	},
	{
		name: ["j", "-j", "--bzip2"],
		description: "Filter the archive through bzip2",
		exclusiveOn: compressionExclusive,
	},
	{
		name: ["J", "-J", "--xz"],
		description: "Filter the archive through xz",
		exclusiveOn: compressionExclusive,
	},
	{
		name: "--lzip",
		description: "Filter the archive through lzip",
		exclusiveOn: compressionExclusive,
	},
	{
		name: "--lzma",
		description: "Filter the archive through lzma",
		exclusiveOn: compressionExclusive,
	},
	{
		name: "--lzop",
		description: "Filter the archive through lzop",
		exclusiveOn: compressionExclusive,
	},
	{
		name: "--no-auto-compress",
		description:
			"Do not use archive suffix to determine the compression program",
		exclusiveOn: compressionExclusive,
	},
	{
		name: ["z", "-z", "--gzip", "--gunzip", "--ungzip"],
		description: "Filter the archive through gzip",
		exclusiveOn: compressionExclusive,
	},
	{
		name: ["Z", "-Z", "--compress", "--uncompress"],
		description: "Filter the archive through compress",
		exclusiveOn: compressionExclusive,
	},
	{
		name: "--zstd",
		description: "Filter the archive through zstd",
		exclusiveOn: compressionExclusive,
	},
	{
		name: ["--transform", "--xform"],
		description: "Use sed replace EXPRESSION to transform file names",
		args: { name: "EXPRESSION" },
	},
	{
		name: "--checkpoint",
		description: "Display progress messages every Nth record",
		args: { name: "N", isOptional: true, default: "10" },
	},
	{
		name: "--checkpoint-action",
		description: "Run ACTION on each checkpoint",
		args: { name: "ACTION" },
	},
	{
		name: "--full-time",
		description: "Print file time to its full resolution",
		dependsOn: ["v", "-v", "--verbose"],
	},
	{
		name: "--utc",
		description: "Print file modification times in UTC",
		dependsOn: ["v", "-v", "--verbose"],
	},
];

// --create && --append && --update
const dumpOptions: Fig.Option[] = [
	{
		name: "--ignore-failed-read",
		description: "Do not exit with nonzero on unreadable files",
	},
	{
		name: "--restrict",
		description: "Disable the use of some potentially harmful options",
		dependsOn: ["M", "-M", "--multi-volume"],
	},
	{
		name: "--remove-files",
		description: "Remove files from disk after adding them to the archive",
	},
	{
		name: ["W", "-W", "--verify"],
		description: "Verify the archive after writing it",
	},
	{
		name: "--atime-preserve",
		description: "Preserve access times on dumped files",
		args: {
			name: "METHOD",
			default: "replace",
			isOptional: true,
			suggestions: [
				{ name: "replace", description: "Restore the times after reading" },
				{
					name: "system",
					description: "Not setting the times in the first place",
				},
			],
		},
	},
	{
		name: "--group",
		description: "Force NAME as group for added files",
		args: {
			name: "NAME[:GID]",
			description:
				"If GID is not supplied, NAME can be either a user name or numeric GID",
		},
	},
	{
		name: "--group-map",
		description: "Read group translation map from FILE",
		args: {
			name: "FILE",
			description:
				"Each non-empty line in FILE defines translation for a single group",
			template: "filepaths",
		},
	},
	{
		name: "--mode",
		description: "Force symbolic mode CHANGES for added files",
		args: { name: "CHANGES" },
	},
	{
		name: "--mtime",
		description: "Set mtime for added files",
		args: {
			name: "DATE-OR-FILE",
			description:
				"Either a date/time in almost arbitrary format, or the name of an existing file",
			template: "filepaths",
		},
	},
	{
		name: "--owner",
		description: "Force NAME as owner for added files",
		args: {
			name: "NAME[:GID]",
			description:
				"If UID is not supplied, NAME can be either a user name or numeric UID",
		},
	},
	{
		name: "--owner-map",
		description: "Read owner translation map from FILE",
		args: {
			name: "FILE",
			description:
				"Each non-empty line in FILE defines translation for a single UID",
			template: "filepaths",
		},
	},
	{
		name: "--sort",
		description:
			"When creating an archive, sort directory entries according to ORDER",
		args: {
			name: "ORDER",
			default: "none",
			suggestions: ["none", "name", "inode"],
		},
	},
	{
		name: "--add-file",
		description: "Add FILE to the archive",
		args: {
			name: "FILE",
			template: "filepaths",
		},
	},
	{
		name: "--exclude",
		description: "Exclude files matching PATTERN",
		args: { name: "PATTERN", description: "A glob-style wildcard pattern" },
	},
	{ name: "--exclude-backups", description: "Exclude backup and lock files" },
	{
		name: "--exclude-caches",
		description:
			"Exclude contents of directories containing file CACHEDIR.TAG, except for the tag file itself",
		exclusiveOn: ["--exclude-caches-all", "--exclude-caches-under"],
	},
	{
		name: "--exclude-caches-all",
		description:
			"Exclude directories containing file CACHEDIR.TAG and the file itself",
		exclusiveOn: ["--exclude-caches", "--exclude-caches-under"],
	},
	{
		name: "--exclude-caches-under",
		description: "Exclude everything under directories containing CACHEDIR.TAG",
		exclusiveOn: ["--exclude-caches", "--exclude-caches-all"],
	},
	{
		name: "--exclude-ignore",
		description:
			"Read exclusion patterns from FILE in directory before dumping",
		exclusiveOn: ["--exclude-ignore-recursive"],
		args: { name: "FILE" },
	},
	{
		name: "--exclude-ignore-recursive",
		description:
			"Same  as --exclude-ignore, except that patterns from FILE affect both the directory and all its subdirectories",
		exclusiveOn: ["--exclude-ignore"],
		args: { name: "FILE" },
	},
	{
		name: "--exclude-tag",
		description:
			"Exclude contents of directories containing FILE, except for FILE itself",
		exclusiveOn: ["--exclude-tag-all", "--exclude-tag-under"],
		args: { name: "FILE" },
	},
	{
		name: "--exclude-tag-all",
		description: "Exclude directories containing FILE",
		exclusiveOn: ["--exclude-tag", "--exclude-tag-under"],
		args: { name: "FILE" },
	},
	{
		name: "--exclude-tag-under",
		description: "Exclude everything under directories containing FILE",
		exclusiveOn: ["--exclude-tag", "--exclude-tag-all"],
		args: { name: "FILE" },
	},
	{
		name: "--exclude-vcs",
		description: "Exclude version control system directories",
		exclusiveOn: ["--exclude-vcs-ignores"],
	},
	{
		name: "--exclude-vcs-ignores",
		description:
			"Exclude files that match patterns read from VCS-specific ignore files",
		exclusiveOn: ["--exclude-vcs"],
	},
	{
		name: ["h", "-h", "--dereference"],
		description: "Follow symlinks; archive and dump the files they point to",
	},
	{
		name: "--hard-dereference",
		description: "Follow hard links; archive and dump the files they refer to",
	},
	{
		name: ["N", "-N", "--newer", "--after-date"],
		description: "Only store files newer than DATE",
		args: {
			name: "DATE",
			description: "If DATE starts with / or . it is taken to be a file name",
			template: "filepaths",
		},
	},
	{
		name: "--one-file-system",
		description: "Stay in local file system when creating archive",
	},
	{
		name: ["P", "-P", "--absolute-names"],
		description: "Don't strip leading slashes from file names",
	},
	{
		name: "--anchored",
		description: "Patterns match file name start",
		dependsOn: ["--exclude"],
		exclusiveOn: ["--no-anchored"],
	},
	{
		name: "--ignore-case",
		description: "Ignore case",
		dependsOn: ["--exclude"],
		exclusiveOn: ["--no-ignore-case"],
	},
	{
		name: "--no-anchored",
		description: "Patterns match after any /",
		dependsOn: ["--exclude"],
		exclusiveOn: ["--anchored"],
	},
	{
		name: "--no-ignore-case",
		description: "Case sensitive matching",
		dependsOn: ["--exclude"],
		exclusiveOn: ["--ignore-case"],
	},
	{
		name: "--no-wildcards",
		description: "Verbatim string matching",
		dependsOn: ["--exclude"],
		exclusiveOn: ["--wildcards"],
	},
	{
		name: "--no-wildcards-match-slash",
		description: "Wildcards do not match /",
		dependsOn: ["--exclude", "--wildcards"],
		exclusiveOn: ["--no-wildcards", "--wildcards-match-slash"],
	},
	{
		name: "--wildcards",
		description: "Use wildcards",
		dependsOn: ["--exclude"],
		exclusiveOn: ["--no-wildcards"],
	},
	{
		name: "--wildcards-match-slash",
		description: "Wildcards match /",
		dependsOn: ["--exclude", "--wildcards"],
		exclusiveOn: ["--no-wildcards", "--no-wildcards-match-slash"],
	},
	{
		name: "--clamp-mtime",
		description:
			"Only set time when the file is more recent than what was given with --mtime",
		dependsOn: ["--mtime"],
	},
	{
		name: ["l", "-l", "--check-links"],
		description: "Print a message if not all links are dumped",
	},
	...compressionOptions,
];

// --delete && --diff && --extract && --list
const occurrenceOption: Fig.Option = {
	name: "--occurrence",
	description: "Process only the Nth occurrence of each file in the archive",
	args: {
		name: "N",
		default: "1",
		isOptional: true,
	},
};

// --list && --extract
const readOptions: Fig.Option[] = [
	{
		name: ["n", "-n", "--seek"],
		description: "Assume the archive is seekable",
		exclusiveOn: ["--no-seek"],
	},
	{
		name: "--no-seek",
		description: "Assume the archive is not seekable",
		exclusiveOn: ["n", "-n", "--seek"],
	},
	occurrenceOption,
	{
		name: ["B", "-B", "--read-full-records"],
		description:
			"When listing or extracting, accept incomplete input records after end-of-file marker",
	},
	{
		name: ["i", "-i", "--ignore-zeros"],
		description: "Ignore zeroed blocks in archive",
	},
	{
		name: ["V", "-V", "--label"],
		description: "Use TEXT as a globbing pattern for volume name",
		args: { name: "TEXT" },
	},
	...compressionOptions,
	{
		name: ["K", "-K", "--starting-file"],
		description: "Begin at the given member in the archive",
		args: { name: "MEMBER" },
	},
	{
		name: "--show-omitted-dirs",
		description: "List each directory that does not match search criteria",
	},
];

const warningSuggestions: Fig.Suggestion[] = [
	{ name: "all", description: "Enable all warning messages" },
	{ name: "none", description: "Disable all warning messages" },
	{
		name: "filename-with-nuls",
		description: '"%s: file name read contains nul character"',
	},
	{
		name: "no-filename-with-nuls",
		description: 'No "%s: file name read contains nul character"',
	},
	{ name: "alone-zero-block", description: '"A lone zero block at %s"' },
	{ name: "no-alone-zero-block", description: 'No "A lone zero block at %s"' },
];

const keepExclusives: string[] = [
	"k",
	"-k",
	"--keep-old-files",
	"--overwrite",
	"--overwrite-dir",
	"--recursive-unlink",
	"--skip-old-files",
	"U",
	"-U",
	"--unlink-first",
	"O",
	"-O",
	"--to-stdout",
];

const overwriteExclusives: string[] = [
	"k",
	"-k",
	"--keep-old-files",
	"--keep-newer-files",
	"--keep-directory-symlink",
	"--no-overwrite-dir",
	"--overwrite",
	"--skip-old-files",
	"U",
	"-U",
	"--unlink-first",
	"O",
	"-O",
	"--to-stdout",
];

const completionSpec: Fig.Spec = {
	name: "tar",
	description: "Manipulating archive files",
	options: [
		// Operation modifiers
		{
			name: ["g", "-g", "--listed-incremental"],
			description: "Handle new GNU-format incremental backups",
			isPersistent: true,
			exclusiveOn: ["G", "-G", "--incremental"],
			args: {
				name: "FILE",
				description: "The name of a snapshot file",
			},
		},
		{
			name: "--hole-detection",
			description: "Use METHOD to detect holes in sparse files",
			isPersistent: true,
			args: {
				name: "METHOD",
				default: "seek",
				isOptional: true,
				suggestions: ["seek", "raw"],
			},
		},
		{
			name: ["G", "-G", "--incremental"],
			description: "Handle old GNU-format incremental backups",
			isPersistent: true,
			exclusiveOn: ["g", "-g", "--listed-incremental"],
		},
		{
			name: "--sparse-version",
			description: "Set version of the sparse format to use",
			isPersistent: true,
			dependsOn: ["S", "-S", "--sparse"],
			args: {
				name: "MAJOR[.MINOR]",
				suggestions: ["0", "0.1", "1"],
			},
		},
		{
			name: ["S", "-S", "--sparse"],
			description: "Handle sparse files efficiently",
			isPersistent: true,
		},
		// Output stream selection
		{
			name: "--ignore-command-error",
			description: "Ignore subprocess exit codes",
			isPersistent: true,
			exclusiveOn: ["--no-ignore-command-error"],
		},
		{
			name: "--no-ignore-command-error",
			description: "Treat non-zero exit codes of children as error",
			isPersistent: true,
			exclusiveOn: ["--ignore-command-error"],
		},
		// Handling of file attributes
		{
			name: "--numeric-owner",
			description: "Always use numbers for user/group names",
			isPersistent: true,
		},
		// Extended file attributes
		{
			name: "--acls",
			description: "Enable POSIX ACLs support",
			exclusiveOn: ["--no-acls"],
			isPersistent: true,
		},
		{
			name: "--no-acls",
			description: "Disable POSIX ACLs support",
			exclusiveOn: ["--acls"],
			isPersistent: true,
		},
		{
			name: "--selinux",
			description: "Enable SELinux context support",
			exclusiveOn: ["--no-selinux"],
			isPersistent: true,
		},
		{
			name: "--no-selinux",
			description: "Disable SELinux context support",
			exclusiveOn: ["--selinux"],
			isPersistent: true,
		},
		{
			name: "--xattrs",
			description: "Enable extended attributes support",
			exclusiveOn: ["--no-xattrs"],
			isPersistent: true,
		},
		{
			name: "--no-xattrs",
			description: "Disable extended attributes support",
			exclusiveOn: ["--xattrs", "--xattrs-exclude", "--xattrs-include"],
			isPersistent: true,
		},
		{
			name: "--xattrs-exclude",
			description: "Specify the exclude pattern for xattr keys",
			exclusiveOn: ["--no-xattrs"],
			isPersistent: true,
			args: { name: "PATTERN", description: "A POSIX regular expression" },
		},
		{
			name: "--xattrs-include",
			description: "Specify the include pattern for xattr keys",
			isPersistent: true,
			args: { name: "PATTERN", description: "A POSIX regular expression" },
		},
		// Local file selection
		{
			name: "--backup",
			description: "Backup before removal",
			isPersistent: true,
			args: {
				name: "CONTROL",
				isOptional: true,
				default: "existing",
				suggestions: [
					{ name: ["none", "off"], description: "Never make backups" },
					{ name: ["t", "numbered"], description: "Make numbered backups" },
					{
						name: ["nil", "existing"],
						description: "Make numbered backups if numbered backups  exist",
					},
					{
						name: ["never", "simple"],
						description: "Always make simple backups",
					},
				],
			},
		},
		{
			name: ["C", "-C", "--directory"],
			description: "Change to DIR before performing any operations",
			isRepeatable: true,
			isPersistent: true,
			args: { name: "DIR", template: "folders" },
		},
		{
			name: "--newer-mtime",
			description: "Work on files whose data changed after the DATE",
			isPersistent: true,
			args: {
				name: "DATE",
				description: "If DATE starts with / or . it is taken to be a file name",
				template: "filepaths",
			},
		},
		{
			name: "--no-null",
			description: "Disable the effect of the previous --null option",
			dependsOn: ["T", "-T", "--files-from"],
			isPersistent: true,
		},
		{
			name: "--no-recursion",
			description: "Avoid descending automatically in directories",
			exclusiveOn: ["--recursion"],
			isPersistent: true,
		},
		{
			name: "--no-unquote",
			description: "Do not unquote input file or member names",
			exclusiveOn: ["--unquote"],
			isPersistent: true,
		},
		{
			name: "--no-verbatim-files-from",
			description:
				"Treat each line read from a file list as if it were supplied in the command line",
			dependsOn: ["T", "-T", "--files-from"],
			isRepeatable: true,
			isPersistent: true,
		},
		{
			name: "-null",
			description:
				"Instruct subsequent -T options to read null-terminated names verbatim",
			dependsOn: ["T", "-T", "--files-from"],
			isPersistent: true,
		},
		{
			name: "--recursion",
			description: "Recurse into directories",
			exclusiveOn: ["--no-recursion"],
			isPersistent: true,
		},
		{
			name: "--suffix",
			description: "Backup before removal, override usual suffix",
			dependsOn: ["--backup"],
			isPersistent: true,
			args: { name: "STRING", default: "~" },
		},
		{
			name: ["T", "-T", "--files-from"],
			description: "Get names to extract or create from FILE",
			isRepeatable: true,
			isPersistent: true,
			args: { name: "FILE", template: "filepaths" },
		},
		{
			name: "--unquote",
			description: "Unquote file or member names",
			exclusiveOn: ["--no-unquote"],
			isPersistent: true,
		},
		{
			name: "--verbatim-files-from",
			description:
				"Treat each line obtained from a file list as a file name, even if it starts with a dash",
			dependsOn: ["T", "-T", "--files-from"],
			isRepeatable: true,
			isPersistent: true,
		},
		{
			name: ["X", "-X", "--exclude-from"],
			description: "Exclude files matching patterns listed in FILE",
			isRepeatable: true,
			isPersistent: true,
			args: { name: "FILE", template: "filepaths" },
		},
		// Informative output
		{
			name: "--index-file",
			description: "Send verbose output to FILE",
			isPersistent: true,
			args: { name: "FILE" },
		},
		{
			name: "--no-quote-chars",
			description: "Disable quoting for characters from STRING",
			isPersistent: true,
			args: { name: "STRING" },
		},
		{
			name: "--quote-chars",
			description: "Additionally quote characters from STRING",
			isPersistent: true,
			args: { name: "STRING" },
		},
		{
			name: "--quoting-style",
			description: "Set quoting style for file and member names",
			isPersistent: true,
			args: {
				name: "STYLE",
				suggestions: [
					"literal",
					"shell",
					"shell-always",
					"c",
					"c-maybe",
					"escape",
					"locale",
					"clocale",
				],
			},
		},
		{
			name: ["R", "-R", "--block-number"],
			description: "Show block number within archive with each message",
			isPersistent: true,
		},
		{
			name: ["--show-transformed-names", "--show-stored-names"],
			description:
				"Show file or archive names after transformation by --strip and --transform options",
			isPersistent: true,
		},
		{
			name: "--totals",
			description: "Print total bytes after processing the archive",
			isPersistent: true,
			args: {
				name: "SIGNAL",
				description: "Print total bytes when this signal is delivered",
				isOptional: true,
				suggestions: [
					{ name: ["SIGHUP", "HUP"] },
					{ name: ["SIGQUIT", "QUIT"] },
					{ name: ["SIGINT", "INT"] },
					{ name: ["SIGUSR1", "USR1"] },
					{ name: ["SIGUSR2", "USR2"] },
				],
			},
		},
		{
			name: ["v", "-v", "--verbose"],
			description: "Verbosely list files processed",
			isRepeatable: true,
			isPersistent: true,
		},
		{
			name: ["w", "-w", "--interactive", "--confirmation"],
			description: "Ask for confirmation for every action",
		},
	],
	subcommands: [
		{
			name: ["A", "-A", "--catenate", "--concatenate"],
			description: "Append archive to the end of another archive",
			args: {
				name: "ARCHIVE",
				isVariadic: true,
				template: "filepaths",
			},
		},
		{
			name: ["c", "-c", "--create"],
			description: "Create a new archive",
			options: [
				{
					name: "--check-device",
					description:
						"Check device numbers when creating incremental archives",
					exclusiveOn: ["--no-check-device"],
					dependsOn: ["g", "-g", "--listed-incremental"],
				},
				{
					name: "--level",
					requiresSeparator: true,
					description: "Set dump level for created listed-incremental archive",
					args: { name: "NUMBER", default: "0" },
					dependsOn: ["g", "-g", "--listed-incremental"],
				},
				{
					name: "--no-check-device",
					description:
						"Do not check device numbers when creating incremental archives",
					exclusiveOn: ["--check-device"],
					dependsOn: ["g", "-g", "--listed-incremental"],
				},
				...dumpOptions,
				{
					name: ["b", "-b", "--blocking-factor"],
					description: "Set record size to BLOCKSx512 bytes",
					args: { name: "BLOCKS" },
				},
				{
					name: "--record-size",
					description: "Set record size",
					args: {
						name: "NUMBER",
						description: "The number of bytes per record",
						suggestions: sizeSuffixes,
					},
				},
				{
					name: ["H", "-H", "--format"],
					description: "Create archive of the given format",
					exclusiveOn: ["--old-archive", "--portability", "--posix", "o", "-o"],
					args: {
						name: "FORMAT",
						suggestions: [
							{ name: "gnu", description: "GNU tar 1.13.x format" },
							{ name: "oldgnu", description: "GNU format as per tar <= 1.12" },
							{
								name: ["pax", "posix"],
								description: "POSIX 1003.1-2001 (pax) format",
							},
							{
								name: "ustar",
								description: "POSIX 1003.1-1988 (ustar) format",
							},
							{ name: "v7", description: "Old V7 tar format" },
						],
					},
				},
				{
					name: ["--old-archive", "--portability"],
					description: "Same as --format=v7",
					exclusiveOn: [
						"H",
						"-H",
						"--format",
						"--pax-option",
						"--posix",
						"o",
						"-o",
					],
				},
				{
					name: "--pax-option",
					description: "Control pax keywords when creating PAX archives",
					dependsOn: ["H", "-H", "--format"],
					exclusiveOn: [
						"--old-archive",
						"--portability",
						"--old-archive",
						"--portability",
						"--posix",
						"o",
						"-o",
					],
					args: { name: "keyword[[:]=value][,keyword[[:]=value]]..." },
				},
				{
					name: "--posix",
					description: "Same as --format=posix",
					exclusiveOn: [
						"H",
						"-H",
						"--format",
						"--old-archive",
						"--portability",
						"--pax-option",
					],
				},
				{
					name: ["V", "-V", "--label"],
					description: "Create archive with volume name TEXT",
					args: { name: "TEXT" },
				},
				{
					name: "--warning",
					description:
						"Enable or disable warning messages identified by KEYWORD",
					isRepeatable: true,
					isPersistent: true,
					args: {
						name: "KEYWORD",
						default: "all",
						suggestions: [
							...warningSuggestions,
							{
								name: "cachedir",
								description: '"%s: contains a cache directory tag %s; %s"',
							},
							{
								name: "no-cachedir",
								description: 'No "%s: contains a cache directory tag %s; %s"',
							},
							{
								name: "file-shrank",
								description:
									'"%s: File shrank by %s bytes; padding with zeros"',
							},
							{
								name: "no-file-shrank",
								description:
									'No "%s: File shrank by %s bytes; padding with zeros"',
							},
							{
								name: "xdev",
								description:
									'"%s: file is on a different filesystem; not dumped"',
							},
							{
								name: "no-xdev",
								description:
									'No "%s: file is on a different filesystem; not dumped"',
							},
							{
								name: "file-ignored",
								description:
									'"%s: Unknown file type; file ignored", "%s: socket ignored", "%s: door ignored"',
							},
							{
								name: "no-file-ignored",
								description:
									'No "%s: Unknown file type; file ignored", "%s: socket ignored", "%s: door ignored"',
							},
							{
								name: "file-unchanged",
								description: '"%s: file is unchanged; not dumped"',
							},
							{
								name: "no-file-unchanged",
								description: 'No "%s: file is unchanged; not dumped"',
							},
							{
								name: "ignore-archive",
								description: '"%s: file is the archive; not dumped"',
							},
							{
								name: "no-ignore-archive",
								description: 'No "%s: file is the archive; not dumped"',
							},
							{
								name: "file-removed",
								description: '"%s: File removed before we read it"',
							},
							{
								name: "no-file-removed",
								description: 'No "%s: File removed before we read it"',
							},
							{
								name: "file-changed",
								description: '"%s: file changed as we read it"',
							},
							{
								name: "no-file-changed",
								description: 'No "%s: file changed as we read it"',
							},
							{
								name: "failed-read",
								description:
									"Enables warnings about unreadable files or directories",
							},
							{
								name: "no-failed-read",
								description:
									"Suppresses warnings about unreadable files or directories",
							},
						],
					},
				},
				{
					name: ["o", "-o"],
					description: "Same as --old-archive",
					exclusiveOn: [
						"H",
						"-H",
						"--format",
						"--old-archive",
						"--portability",
						"--posix",
						"o",
						"-o",
					],
				},
				...fileOptions,
			],
			args: {
				name: "FILE",
				isVariadic: true,
				template: "filepaths",
			},
		},
		{
			name: ["d", "-d", "--diff", "--compare"],
			description: "Find differences between archive and file system",
			options: [...fileOptions, occurrenceOption],
			args: {
				name: "FILE",
				isOptional: true,
				isVariadic: true,
				default: ".",
				template: "filepaths",
			},
		},
		{
			name: ["t", "-t", "--list"],
			description: "List the contents of an archive",
			options: [...fileOptions, ...readOptions],
			args: {
				name: "MEMBER",
				isOptional: true,
				isVariadic: true,
			},
		},
		{
			name: ["r", "-r", "--append"],
			description: "Append files to the end of an archive",
			options: [...fileOptions, ...dumpOptions],
			args: {
				name: "FILE",
				isVariadic: true,
				template: "filepaths",
			},
		},
		{
			name: ["u", "-u", "--update"],
			description:
				"Append files which are newer than the corresponding copy in  the archive",
			options: [...fileOptions, ...dumpOptions],
			args: {
				name: "FILE",
				isVariadic: true,
				template: "filepaths",
			},
		},
		{
			name: ["x", "-x", "--extract", "--get"],
			description: "Extract files from an archive",
			options: [
				...fileOptions,
				...readOptions,
				{
					name: ["k", "-k", "--keep-old-files"],
					description: "Don't replace existing files when extracting",
					exclusiveOn: [
						"--keep-newer-files",
						"--keep-directory-symlink",
						"--no-overwrite-dir",
						...keepExclusives,
					],
				},
				{
					name: "--keep-newer-files",
					description:
						"Don't replace existing files that are newer than their archive copies",
					exclusiveOn: keepExclusives,
				},
				{
					name: "--keep-directory-symlink",
					description:
						"Don't replace existing symlinks to directories when extracting",
					exclusiveOn: keepExclusives,
				},
				{
					name: "--no-overwrite-dir",
					description: "Preserve metadata of existing directories",
					exclusiveOn: keepExclusives,
				},
				{
					name: "--one-top-level",
					description: "Extract all files into DIR",
					args: { name: "DIR" },
				},
				{
					name: "--overwrite",
					description: "Overwrite existing files when extracting",
					exclusiveOn: [
						"--overwrite-dir",
						"--recursive-unlink",
						...overwriteExclusives,
					],
				},
				{
					name: "--overwrite-dir",
					description:
						"Overwrite metadata of existing directories when extracting",
					exclusiveOn: overwriteExclusives,
				},
				{
					name: "--recursive-unlink",
					description:
						"Recursively remove all files in the directory prior to extracting it",
					exclusiveOn: overwriteExclusives,
				},
				{
					name: "--skip-old-files",
					description:
						"Don't replace existing files when extracting, silently skip over them",
					exclusiveOn: [...keepExclusives, ...overwriteExclusives],
				},
				{
					name: ["U", "-U", "--unlink-first"],
					description: "Remove each file prior to extracting over it",
					exclusiveOn: [...keepExclusives, ...overwriteExclusives],
				},
				{
					name: ["O", "-O", "--to-stdout"],
					description: "Extract files to standard output",
					exclusiveOn: [...keepExclusives, ...overwriteExclusives],
				},
				{
					name: "--to-command",
					description: "Pipe extracted files to COMMAND",
					args: { name: "COMMAND", template: "filepaths" },
				},
				{
					name: "--delay-directory-restore",
					description:
						"Delay setting modification times and permissions of extracted directories until the end of extraction",
					exclusiveOn: ["--no-delay-directory-restore"],
				},
				{
					name: ["m", "-m", "--touch"],
					description: "Don't extract file modified time",
				},
				{
					name: "--no-delay-directory-restore",
					description:
						"Cancel the effect of the prior --delay-directory-restore option",
					exclusiveOn: ["--delay-directory-restore"],
				},
				{
					name: "--no-same-owner",
					description: "Extract files as yourself",
					exclusiveOn: ["--same-owner"],
				},
				{
					name: "--no-same-permissions",
					description:
						"Apply the user's umask when extracting permissions from the archive",
					exclusiveOn: [
						"p",
						"-p",
						"--preserve-permissions",
						"--same-permissions",
					],
				},
				{
					name: ["p", "-p", "--preserve-permissions", "--same-permissions"],
					description: "Extract information about file permissions",
					exclusiveOn: ["--no-same-permissions"],
				},
				{ name: "--preserve", description: "Same as both -p and -s" },
				{
					name: "--same-owner",
					description:
						"Try extracting files with the same ownership as exists in the archive",
					exclusiveOn: ["--no-same-owner"],
				},
				{
					name: ["s", "-s", "--preserve-order", "--same-order"],
					description: "Sort names to extract to match archive",
				},
				{
					name: "--strip-components",
					description:
						"Strip NUMBER leading components from file names on extraction",
					args: { name: "NUMBER" },
				},
				{
					name: "--warning",
					description:
						"Enable or disable warning messages identified by KEYWORD",
					isRepeatable: true,
					isPersistent: true,
					args: {
						name: "KEYWORD",
						default: "all",
						suggestions: [
							...warningSuggestions,
							{
								name: "existing-file",
								description: '"%s: skipping existing file"',
							},
							{
								name: "no-existing-file",
								description: 'No "%s: skipping existing file"',
							},
							{
								name: "timestamp",
								description:
									'"%s: implausibly old time stamp %s", "%s: time stamp %s is %s s in the future"',
							},
							{
								name: "no-timestamp",
								description:
									'No "%s: implausibly old time stamp %s", "%s: time stamp %s is %s s in the future"',
							},
							{
								name: "contiguous-cast",
								description: '"Extracting contiguous files as regular files"',
							},
							{
								name: "no-contiguous-cast",
								description:
									'No "Extracting contiguous files as regular files"',
							},
							{
								name: "symlink-cast",
								description:
									'"Attempting extraction of symbolic links as hard links"',
							},
							{
								name: "no-symlink-cast",
								description:
									'No "Attempting extraction of symbolic links as hard links"',
							},
							{
								name: "unknown-cast",
								description:
									"\"%s: Unknown file type '%c', extracted as normal file\"",
							},
							{
								name: "no-unknown-cast",
								description:
									"No \"%s: Unknown file type '%c', extracted as normal file\"",
							},
							{
								name: "ignore-newer",
								description: '"Current %s is newer or same age"',
							},
							{
								name: "no-ignore-newer",
								description: 'No "Current %s is newer or same age"',
							},
							{
								name: "unknown-keyword",
								description:
									"\"Ignoring unknown extended header keyword '%s'\"",
							},
							{
								name: "no-unknown-keyword",
								description:
									"No \"Ignoring unknown extended header keyword '%s'\"",
							},
							{
								name: "decompress-program",
								description:
									"Enables verbose description of failures occurring when trying to run alternative decompressor programs",
							},
							{
								name: "no-decompress-program",
								description:
									"Suppresses verbose description of failures occurring when trying to run alternative decompressor programs",
							},
							{
								name: "record-size",
								description: '"Record size = %lu blocks"',
							},
							{
								name: "no-record-size",
								description: 'No "Record size = %lu blocks"',
							},
							// Keywords controlling incremental extraction
							{
								name: "rename-directory",
								description:
									'"%s: Directory has been renamed from %s", "%s: Directory has been renamed"',
							},
							{
								name: "no-rename-directory",
								description:
									'No "%s: Directory has been renamed from %s", "%s: Directory has been renamed"',
							},
							{ name: "new-directory", description: '"%s: Directory is new"' },
							{
								name: "no-new-directory",
								description: 'No "%s: Directory is new"',
							},
							{
								name: "xdev",
								description:
									'"%s: directory is on a different device: not purging"',
							},
							{
								name: "no-xdev",
								description:
									'No "%s: directory is on a different device: not purging"',
							},
							{
								name: "bad-dumpdir",
								description: "\"Malformed dumpdir: 'X' never used\"",
							},
						],
					},
				},
				{
					name: ["o", "-o"],
					description: "Same as --no-same-owner",
					exclusiveOn: ["--no-same-owner", "--same-owner"],
				},
			],
			args: {
				name: "MEMBER",
				isOptional: true,
				isVariadic: true,
			},
		},
		{
			name: "--delete",
			description: "Delete from the archive",
			options: [...fileOptions, occurrenceOption],
			args: {
				name: "MEMBER",
				isVariadic: true,
			},
		},
		{
			name: "--test-label",
			description: "Test the archive volume label and exit",
			options: fileOptions,
			args: {
				name: "LABEL",
				isOptional: true,
				isVariadic: true,
			},
		},
		{
			name: "--show-defaults",
			description: "Show built-in defaults for various tar options and exit",
		},
		{
			name: ["?", "-?", "--help"],
			description: "Display a short option summary and exit",
		},
		{
			name: "--usage",
			description: "Display a list of available options and exit",
		},
		{
			name: "--version",
			description: "Print program version and copyright information and exit",
		},
	],
	parserDirectives: {
		flagsArePosixNoncompliant: true,
	},
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/tee.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/tee.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "tee",
	description: "Duplicate standard input",
	options: [
		{
			name: "-a",
			description:
				"Append the output to the files rather than overwriting them",
		},
		{
			name: "-i",
			description: "Ignore the SIGINT signal",
		},
	],
	args: {
		name: "file",
		description: "Pathname of an output file",
		isVariadic: true,
		template: "filepaths",
	},
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/time.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/time.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "time",
	description: "Time how long a command takes!",
	args: {
		isCommand: true,
	},
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/top.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/top.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "top",
	description: "Display Linux tasks",
	options: [
		{
			name: ["-h", "-v"],
			description: "Show library version and usage prompt",
		},
		{
			name: "-b",
			description: "Starts top in Batch mode",
			args: {
				name: "operation",
			},
		},
		{
			name: "-c",
			description: "Starts top with last remembered c state reversed",
			args: {
				name: "toggle",
			},
		},
		{
			name: "-i",
			description:
				"Starts top with the last remembered 'i' state reversed. When this toggle is Off, tasks that are idled or zombied will not be displayed",
			args: {
				name: "toggle",
			},
		},
		{
			name: "-s",
			description: "Starts top with secure mode forced",
			args: {
				name: "delay",
			},
		},
		{
			name: "-pid",
			description: "Monitor pids",
			args: {
				name: "process ids",
				isVariadic: true,
			},
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/touch.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/touch.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "touch",
	description: "Change file access and modification times",
	args: {
		name: "file",
		isVariadic: true,
		template: "folders",
		suggestCurrentToken: true,
	},
	options: [
		{
			name: "-A",
			description:
				"Adjust the access and modification time stamps for the file by the specified value",
			args: {
				name: "time",
				description: "[-][[hh]mm]SS",
			},
		},
		{ name: "-a", description: "Change the access time of the file" },
		{
			name: "-c",
			description: "Do not create the file if it does not exist",
		},
		{
			name: "-f",
			description:
				"Attempt to force the update, even if the file permissions do not currently permit it",
		},
		{
			name: "-h",
			description:
				"If the file is a symbolic link, change the times of the link itself rather than the file that the link points to",
		},
		{
			name: "-m",
			description: "Change the modification time of the file",
		},
		{
			name: "-r",
			description:
				"Use the access and modifications times from the specified file instead of the current time of day",
			args: {
				name: "file",
			},
		},
		{
			name: "-t",
			description:
				"Change the access and modification times to the specified time instead of the current time of day",
			args: {
				name: "timestamp",
				description: "[[CC]YY]MMDDhhmm[.SS]",
			},
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/tr.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/tr.ts

```typescript
const stringSuggestions: Fig.Suggestion[] = [
	{
		name: "a",
		description: "Any single character",
		priority: 40,
	},
	{
		name: "\\a",
		description: "Alert character",
		priority: 39,
	},
	{
		name: "\\b",
		description: "Backspace character",
		priority: 39,
	},
	{
		name: "\\f",
		description: "Form feed character",
		priority: 39,
	},
	{
		name: "\\n",
		description: "Newline character",
		priority: 39,
	},
	{
		name: "\\r",
		description: "Carriage return character",
		priority: 39,
	},
	{
		name: "\\t",
		description: "Tab character",
		priority: 39,
	},
	{
		name: "\\v",
		description: "Vertical tab character",
		priority: 39,
	},
	{
		name: "c-c",
		description:
			"For non-octal range endpoints represents the range of characters between the range endpoints, inclusive, in ascending order, as defined by the collation sequence",
		priority: 38,
	},
	{
		name: "[:alnum:]",
		description: "Alphanumeric characters",
		priority: 37,
	},
	{
		name: "[:alpha:]",
		description: "Alphabetic characters",
		priority: 37,
	},
	{
		name: "[:blank:]",
		description: "Blank characters",
		priority: 37,
	},
	{
		name: "[:cntrl:]",
		description: "Control characters",
		priority: 37,
	},
	{
		name: "[:digit:]",
		description: "Digit characters",
		priority: 37,
	},
	{
		name: "[:graph:]",
		description: "Graphic characters",
		priority: 37,
	},
	{
		name: "[:ideogram:]",
		description: "Ideographic characters",
		priority: 37,
	},
	{
		name: "[:lower:]",
		description: "Lower-case characters",
		priority: 37,
	},
	{
		name: "[:phonogram:]",
		description: "Phonographic characters",
		priority: 37,
	},
	{
		name: "[:print:]",
		description: "Printable characters",
		priority: 37,
	},
	{
		name: "[:punct:]",
		description: "Punctuation characters",
		priority: 37,
	},
	{
		name: "[:rune:]",
		description: "Valid characters",
		priority: 37,
	},
	{
		name: "[:space:]",
		description: "Space characters",
		priority: 37,
	},
	{
		name: "[:special:]",
		description: "Special characters",
		priority: 37,
	},
	{
		name: "[:upper:]",
		description: "Upper-case characters",
		priority: 37,
	},
	{
		name: "[:xdigit:]",
		description: "Hexadecimal characters",
		priority: 37,
	},
	{
		name: "[=equiv=]",
		description:
			"Represents all characters belonging to the same equivalence class as 'equiv', ordered by their encoded values",
		priority: 36,
	},
	{
		name: "[#*n]",
		description:
			"Represents 'n' repeated occurrences of the character represented by '#'",
		priority: 35,
	},
];

const completionSpec: Fig.Spec = {
	name: "tr",
	description: "Translate characters",
	parserDirectives: {
		optionsMustPrecedeArguments: true,
	},
	options: [
		{
			name: "-C",
			description:
				"Complement the set of characters in string1, that is '-C ab' includes every character except for 'a' and 'b'",
		},
		{
			name: "-c",
			description: "Same as '-C' but complement the set of values in string1",
		},
		{
			name: "-d",
			description: "Delete characters in string1 from the input",
		},
		{
			name: "-s",
			description:
				"Squeeze multiple occurrences of the characters listed in the last operand (either string1 or string2) in the input into a single instance of the character. This occurs after all deletion and translation is completed",
		},
		{
			name: "-u",
			description: "Guarantee that any output is unbuffered",
		},
	],
	args: [
		{
			name: "string1",
			description: "Candidate string",
			suggestions: stringSuggestions,
		},
		{
			name: "string2",
			description: "Replacment string",
			isOptional: true,
			suggestions: stringSuggestions,
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/traceroute.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/traceroute.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "traceroute",
	description: "Print the route packets take to network host",
	options: [
		{
			name: ["--help", "-h"],
			description: "Show help for traceroute",
		},
		{
			name: "-a",
			description: "Turn on AS# lookups for each hop encountered",
		},
		{
			name: "-A",
			args: { name: "as_server" },
			description:
				"Turn on AS# lookups and use the given server instead of the default",
		},
		{
			name: "-d",
			description: "Enable socket level debugging",
		},
		{
			name: "-D",
			description:
				"When an ICMP response to our probe datagram is received, print the differences between the transmitted packet and the packet quoted by the ICMP response. A key showing the location of fields within the transmitted packet is printed, followed by the original packet in hex, followed by the quoted packet in hex. Bytes that are unchanged in the quoted packet are shown as underscores. Note, the IP checksum and the TTL of the quoted packet are not expected to match. By default, only one probe per hop is sent with this option",
		},
		{
			name: "-e",
			description:
				"Firewall evasion mode. Use fixed destination ports for UDP and TCP probes. The destination port does NOT increment with each packet sent",
		},
		{
			name: "-f",
			args: { name: "first_ttl" },
			description:
				"Set the initial time-to-live used in the first outgoing probe packet",
		},
		{
			name: "-F",
			description: "Set the `don't fragment` bit",
		},
		{
			name: "-g",
			args: { name: "gateway" },
			description: "Specify a loose source route gateway (8 maximum)",
		},
		{
			name: "-i",
			args: { name: "iface" },
			description:
				"Specify a network interface to obtain the source IP address for outgoing probe packets. This is normally only useful on a multihomed host. (See the -s flag for another way to do this.)",
		},
		{
			name: "-I",
			description:
				"Use ICMP ECHO instead of UDP datagrams. (A synonym for `-P icmp`)",
		},
		{
			name: "-M",
			args: { name: "first_ttl" },
			description:
				"Set the initial time-to-live value used in outgoing probe packets. The default is 1, i.e., start with the first hop",
		},
		{
			name: "-m",
			args: { name: "max_ttl" },
			description:
				"Set the max time-to-live (max number of hops) used in outgoing probe packets. The default is net.inet.ip.ttl hops (the same default used for TCP connections)",
		},
		{
			name: "-n",
			description:
				"Print hop addresses numerically rather than symbolically and numerically (saves a nameserver address-to-name lookup for each gateway found on the path)",
		},
		{
			name: "-P",
			args: { name: "proto" },
			description:
				"Send packets of specified IP protocol. The currently supported protocols are: UDP, TCP, GRE and ICMP Other protocols may also be specified (either by name or by number), though traceroute does not implement any special knowledge of their packet formats. This option is useful for determining which router along a path may be blocking packets based on IP protocol number. But see BUGS below",
		},
		{
			name: "-p",
			args: { name: "port" },
			description:
				"Protocol specific. For UDP and TCP, sets the base port number used in probes (default is 33434). traceroute hopes that nothing is listening on UDP ports base to base+nhops-1 at the destination host (so an ICMP PORT_UNREACHABLE message will be returned to terminate the route tracing). If something is listening on a port in the default range, this option can be used to pick an unused port range",
		},
		{
			name: "-q",
			args: { name: "nqueries" },
			description:
				"Set the number of probes per ``ttl'' to nqueries (default is three probes)",
		},
		{
			name: "-r",
			description:
				"Bypass the normal routing tables and send directly to a host on an attached network. If the host is not on a directly-attached network, an error is returned. This option can be used to ping a local host through an interface that has no route through it (e.g., after the interface was dropped by routed(8))",
		},
		{
			name: "-s",
			args: { name: "src_addr" },
			description:
				"Use the following IP address (which must be given as an IP number, not a hostname) as the source address in outgoing probe packets. On hosts with more than one IP address, this option can be used to force the source address to be something other than the IP address of the interface the probe packet is sent on. If the IP address is not one of this machine's interface addresses, an error is returned and nothing is sent. (See the -i flag for another way to do this.)",
		},
		{
			name: "-S",
			description:
				"Print a summary of how many probes were not answered for each hop",
		},
		{
			name: "-t",
			args: { name: "tos" },
			description:
				"Set the type-of-service in probe packets to the following value (default zero). The value must be a decimal integer in the range 0 to 255. This option can be used to see if different types-of- service result in different paths. (If you are not running a 4.4BSD or later system, this may be academic since the normal network services like telnet and ftp don't let you control the TOS). Not all values of TOS are legal or meaningful - see the IP spec for definitions. Useful values are probably `-t 16' (low delay) and `-t 8' (high throughput)",
		},
		{
			name: "-v",
			description:
				"Verbose output. Received ICMP packets other than TIME_EXCEEDED and UNREACHABLEs are listed",
		},
		{
			name: "-w",
			description:
				"Set the time (in seconds) to wait for a response to a probe (default 5 sec.)",
		},
		{
			name: "-x",
			description:
				"Toggle IP checksums. Normally, this prevents traceroute from calculating IP checksums. In some cases, the operating system can overwrite parts of the outgoing packet but not recalculate the checksum (so in some cases the default is to not calculate checksums and using -x causes them to be calculated). Note that checksums are usually required for the last hop when using ICMP ECHO probes ( -I ). So they are always calculated when using ICMP",
		},
		{
			name: "-z",
			args: { name: "pausemsecs" },
			description:
				"Set the time (in milliseconds) to pause between probes (default 0). Some systems such as Solaris and routers such as Ciscos rate limit ICMP messages. A good value to use with this this is 500 (e.g. 1/2 second)",
		},
	],
	args: {
		name: "host",
	},
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/tree.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/tree.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "tree",
	description: "Display directories as trees (with optional color/HTML output)",
	args: {
		template: "folders",
	},
	options: [
		{
			name: "-a",
			description: "All files are listed",
		},
		{
			name: "-d",
			description: "List directories only",
		},
		{
			name: "-l",
			description: "Follow symbolic links like directories",
		},
		{
			name: "-f",
			description: "Print the full path prefix for each file",
		},
		{
			name: "-x",
			description: "Stay on current filesystem only",
		},
		{
			name: "-L",
			description: "Descend only level directories deep",
			args: {
				name: "level",
			},
		},
		{
			name: "-R",
			description: "Rerun tree when max dir level reached",
		},
		{
			name: "-P",
			description: "List only those files that match the pattern given",
			args: {
				name: "pattern",
			},
		},
		{
			name: "-I",
			description: "Do not list files that match the given pattern",
			args: {
				name: "pattern",
			},
		},
		{
			name: "--ignore-case",
			description: "Ignore case when pattern matching",
		},
		{
			name: "--matchdirs",
			description: "Include directory names in -P pattern matching",
		},
		{
			name: "--noreport",
			description: "Turn off file/directory count at end of tree listing",
		},
		{
			name: "--charset",
			description:
				"Use charset X for terminal/HTML and indentation line output",
			args: {
				name: "charset",
			},
		},
		{
			name: "--filelimit",
			description: "Do not descend dirs with more than # files in them",
			args: {
				name: "number",
				description: "Number of files",
			},
		},
		{
			name: "--timefmt",
			description: "Print and format time according to the format <f>",
			args: {
				name: "format",
				description: "Format in strftime syntax",
			},
		},
		{
			name: "-o",
			description: "Output to file instead of stdout",
			args: {
				name: "filename",
			},
		},
		{
			name: "-q",
			description: "Print non-printable characters as '?'",
		},
		{
			name: "-N",
			description: "Print non-printable characters as is",
		},
		{
			name: "-Q",
			description: "Quote filenames with double quotes",
		},
		{
			name: "-p",
			description: "Print the protections for each file",
		},
		{
			name: "-u",
			description: "Displays file owner or UID number",
		},
		{
			name: "-g",
			description: "Displays file group owner or GID number",
		},
		{
			name: "-s",
			description: "Print the size in bytes of each file",
		},
		{
			name: "-h",
			description: "Print the size in a more human readable way",
		},
		{
			name: "--si",
			description: "Like -h but use SI units (powers of 1000) instead",
		},
		{
			name: "--du",
			description:
				"For each directory report its size as the accumulation of sizes of all its files and sub-directories (and their files, and so on). The total amount of used space is also given in the final report (like the 'du -c' command.) This option requires tree to read the entire directory tree before emitting it, see BUGS AND NOTES below. Implies -s",
		},
		{
			name: "-D",
			description:
				"Print the date of the last modification time or if -c is used, the last status change time for the file listed",
		},
		{
			name: "-F",
			description: "Appends '/', '=', '*', '@', '|' or '>' as per ls -F",
		},
		{
			name: "--inodes",
			description: "Print inode number of each file",
		},
		{
			name: "--device",
			description: "Print device ID number to which each file belongs",
		},
		{
			name: "-v",
			description: "Sort files alphanumerically by version",
		},
		{
			name: "-t",
			description: "Sort files by last modification time",
		},
		{
			name: "-c",
			description: "Sort files by last status change time",
		},
		{
			name: "-U",
			description: "Leave files unsorted",
		},
		{
			name: "-r",
			description: "Reverse the order of the sort",
		},
		{
			name: "--dirsfirst",
			description: "List directories before files (-U disables)",
		},
		{
			name: "--sort",
			description: "Select sort",
			requiresSeparator: true,
			args: {
				name: "type",
				suggestions: ["name", "version", "size", "mtime", "ctime"],
			},
		},
		{
			name: "-i",
			description: "Don't print indentation lines",
		},
		{
			name: "-A",
			description: "Print ANSI lines graphic indentation lines",
		},
		{
			name: "-S",
			description: "Print with CP437 (console) graphics indentation lines",
		},
		{
			name: "-n",
			description: "Turn colorization off always (-C overrides)",
		},
		{
			name: "-C",
			description: "Turn colorization on always",
		},
		{
			name: "-X",
			description: "Prints out an XML representation of the tree",
		},
		{
			name: "-J",
			description: "Prints out an JSON representation of the tree",
		},
		{
			name: "-H",
			description: "Prints out HTML format with baseHREF as top directory",
			args: {
				name: "baseHREF",
			},
		},
		{
			name: "-T",
			description: "Replace the default HTML title and H1 header with string",
			args: {
				name: "title",
			},
		},
		{
			name: "--nolinks",
			description: "Turn off hyperlinks in HTML output",
		},
		{
			name: "--fromfile",
			description: "Reads paths from files",
		},
		{
			name: "--version",
			description: "Print version and exit",
		},
		{
			name: "--help",
			description: "Print usage and this help message and exit",
		},
		{
			name: "--",
			description: "Options processing terminator",
		},
	],
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/truncate.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/truncate.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "truncate",
	description: "Shrink or extend the size of a file to the specified size",
	options: [
		{
			name: ["--no-create", "-c"],
			description: "Do not create any files",
		},
		{
			name: ["--io-blocks", "-o"],
			description: "Treat SIZE as number of IO blocks instead of bytes",
		},
		{
			name: ["--reference", "-r"],
			description: "Base size on RFILE",
			args: {
				name: "RFILE",
			},
		},
		{
			name: ["--size", "-s"],
			description: "Set or adjust the file size by SIZE bytes",
			args: {
				name: "SIZE",
				description:
					"The SIZE argument is an integer and optional unit; units are K,M,G,T,P,E,Z,Y (powers of 1024) or KB,MB,... (powers of 1000). Binary prefixes can be used, too: KiB=K, MiB=M, and so on",
			},
		},
		{
			name: "--help",
			description: "Show help for truncate",
		},
		{
			name: "--version",
			description: "Output version information and exit",
		},
	],
	args: {
		name: "FILE",
		isVariadic: true,
		template: "filepaths",
	},
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/uname.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/uname.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "uname",
	description: "Print operating system name",
	options: [
		{
			name: "-a",
			description: "Print all available system information",
		},
		{
			name: "-m",
			description: "Print the machine hardware name",
		},
		{
			name: "-n",
			description: "Print the system hostname",
		},
		{
			name: "-p",
			description: "Print the machine processor architecture name",
		},
		{
			name: "-r",
			description: "Print the operating system release",
		},
		{
			name: "-s",
			description: "Print the operating system name",
		},
		{
			name: "-v",
			description: "Print the operating system version",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/uniq.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/uniq.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "uniq",
	description: "Report or omit repeated line",
	options: [
		{
			name: ["-c", "--count"],
			description: "Prefix lines by the number of occurrences",
		},
		{
			name: ["-d", "--repeated"],
			description: "Only print duplicate lines",
		},
		{
			name: ["-D", "--all-repeated"],
			description:
				"Print all duplicate lines. Delimiting is done with blank lines",
			args: {
				name: "delimit-method",
				default: "none",
				isOptional: true,
				suggestions: ["none", "prepend", "separate"],
			},
		},
		{
			name: ["-f", "--skip-fields"],
			description: "Avoid comparing the first N fields",
			args: {
				name: "number",
			},
		},
		{
			name: ["-i", "--ignore-case"],
			description: "Ignore differences in case when comparing",
		},
		{
			name: ["-s", "--skip-chars"],
			description: "Avoid comparing the first N characters",
			args: {
				name: "number",
			},
		},
		{
			name: ["-u", "--unique"],
			description: "Only print unique lines",
		},
		{
			name: ["-z", "--zero-terminated"],
			description: "End lines with 0 byte, not newline",
		},
		{
			name: ["-w", "--check-chars"],
			description: "Compare no more than N characters in lines",
			args: {
				name: "number",
			},
		},
		{
			name: "--help",
			description: "Display this help and exit",
		},
		{
			name: "--version",
			description: "Output version information and exit",
		},
	],
	args: [
		{
			name: "input",
			isOptional: true,
			template: ["filepaths", "folders"],
		},
		{
			name: "output",
			isOptional: true,
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/unzip.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/unzip.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "unzip",
	description: "Extract compressed files in a ZIP archive",
	args: {
		name: "file",
		template: "filepaths",
	},
	options: [
		{
			name: "-l",
			description: "List the contents of a zip file without extracting",
			args: {
				name: "file",
				template: "filepaths",
			},
		},
		{
			name: "-c",
			args: {
				name: "file",
				template: "filepaths",
			},
		},
		{
			name: "-0",
			description:
				"Extract a zip file created in windows, containing files with non-ascii (chinese) filenames",
			args: [
				{
					name: "gbk",
				},
				{
					name: "file",
					template: "filepaths",
				},
			],
		},
		{
			name: "-d",
			args: {
				name: "destination",
				template: "folders",
			},
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/vim.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/vim.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "vim",
	description: "Vi IMproved, a programmer's text editor",
	args: {
		template: "filepaths",
		// suggestCurrentToken: true,
	},
	options: [
		{
			name: "-v",
			description: "Vi mode (like 'vi')",
		},
		{
			name: "-e",
			description: "Ex mode (like 'ex')",
		},
		{
			name: "-E",
			description: "Improved Ex mode",
		},
		{
			name: "-s",
			description:
				"Enable silent mode (when in ex mode), or Read Normal mode commands from file",
			args: {
				name: "scriptin",
				template: "filepaths",
				isOptional: true,
			},
		},
		{
			name: "-d",
			description: "Diff mode (like 'vimdiff')",
		},
		{
			name: "-y",
			description: "Easy mode (like 'evim', modeless)",
		},
		{
			name: "-R",
			description: "Readonly mode (like 'view')",
		},
		{
			name: "-Z",
			description: "Restricted mode (like 'rvim')",
		},
		{
			name: "-m",
			description: "Modifications (writing files) not allowed",
		},
		{
			name: "-M",
			description: "Modifications in text not allowed",
		},
		{
			name: "-b",
			description: "Binary mode",
		},
		{
			name: "-l",
			description: "Lisp mode",
		},
		{
			name: "-C",
			description: "Compatible with Vi: 'compatible'",
		},
		{
			name: "-N",
			description: "Not fully Vi compatible: 'nocompatible'",
		},
		{
			name: "-V",
			description: "Be verbose [level N] [log messages to fname]",
			args: [
				{
					name: "N",
				},
				{
					name: "fname",
					template: "filepaths",
				},
			],
		},
		{
			name: "-D",
			description: "Debugging mode",
		},
		{
			name: "-n",
			description: "No swap file, use memory only",
		},
		{
			name: "-r",
			description:
				"Recover crashed session if filename is specified, otherwise list swap files and exit",
			args: {
				name: "filename",
				isOptional: true,
				template: "filepaths",
			},
		},
		{
			name: "-L",
			description: "Same as -r",
			args: {
				name: "filename",
				template: "filepaths",
			},
		},
		{
			name: "-T",
			description: "Set terminal type to <terminal>",
			args: {
				name: "terminal",
			},
		},
		{
			name: "--not-a-term",
			description: "Skip warning for input/output not being a terminal",
		},
		{
			name: "--ttyfail",
			description: "Exit if input or output is not a terminal",
		},
		{
			name: "-u",
			description: "Use <vimrc> instead of any .vimrc",
			args: {
				name: "vimrc",
				template: "filepaths",
			},
		},
		{
			name: "--noplugin",
			description: "Don't load plugin scripts",
		},
		{
			name: "-p",
			description: "Open N tab pages (default: one for each file)",
			args: {
				name: "N",
				isOptional: true,
			},
		},
		{
			name: "-o",
			description: "Open N windows (default: one for each file)",
			args: {
				name: "N",
				isOptional: true,
			},
		},
		{
			name: "-O",
			description: "Like -o but split vertically",
			args: {
				name: "N",
				isOptional: true,
			},
		},
		{
			name: "+",
			description:
				"Start at end of file, if line number is specified, start at that line",
			args: {
				name: "lnum",
				isOptional: true,
			},
		},
		{
			name: "--cmd",
			description: "Execute <command> before loading any vimrc file",
			args: {
				name: "command",
				isCommand: true,
			},
		},
		{
			name: "-c",
			description: "Execute <command> after loading the first file",
			args: {
				name: "command",
			},
		},
		{
			name: "-S",
			description: "Source file <session> after loading the first file",
			args: {
				name: "session",
				template: "filepaths",
			},
		},
		{
			name: "-w",
			description: "Append all typed commands to file <scriptout>",
			args: {
				name: "scriptout",
				template: "filepaths",
			},
		},
		{
			name: "-W",
			description: "Write all typed commands to file <scriptout>",
			args: {
				name: "scriptout",
				template: "filepaths",
			},
		},
		{
			name: "-x",
			description: "Edit encrypted files",
		},
		{
			name: "--startuptime",
			description: "Write startup timing messages to <file>",
			args: {
				name: "file",
				template: "filepaths",
			},
		},
		{
			name: "-i",
			description: "Use <viminfo> instead of .viminfo",
			args: {
				name: "viminfo",
				template: "filepaths",
			},
		},
		{
			name: "--clean",
			description: "'nocompatible', Vim defaults, no plugins, no viminfo",
		},
		{
			name: ["-h", "--help"],
			description: "Print Help message and exit",
		},
		{
			name: "--version",
			description: "Print version information and exit",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/wc.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/wc.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "wc",
	description: "World, line, character, and byte count",
	options: [
		{
			name: "-c",
			description: "Output the number of bytes to the standard input",
		},
		{
			name: "-l",
			description: "Output the number of lines to the standard input",
		},
		{
			name: "-m",
			description: "Output the number of characters to the standard input",
		},
		{
			name: "-w",
			description: "Output the number of words to the standard input",
		},
	],
	args: {
		name: "file",
		description: "File to count in",
		template: "filepaths",
		isOptional: true,
		isVariadic: true,
	},
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/wget.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/wget.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "wget",
	description: "A non-interactive network retriever",
	args: {
		isVariadic: true,
		name: "url",
		description: "The url(s) to retrieve",
	},
	options: [
		{
			name: ["-V", "--version"],
			description: "Display the version of Wget and exit",
		},
		{ name: ["-h", "--help"], description: "Print this help" },
		{
			name: ["-b", "--background"],
			description: "Go to background after startup",
		},
		{
			name: ["-e", "--execute=COMMAND"],
			description: "Execute a `.wgetrc'-style command",
		},
		{ name: ["-o", "--output-file=FILE"], description: "Log messages to FILE" },
		{
			name: ["-a", "--append-output=FILE"],
			description: "Append messages to FILE",
		},
		{ name: ["-q", "--quiet"], description: "Quiet (no output)" },
		{
			name: ["-v", "--verbose"],
			description: "Be verbose (this is the default)",
		},
		{
			name: ["-nv", "--no-verbose"],
			description: "Turn off verboseness, without being quiet",
		},
		{
			name: "--report-speed=TYPE",
			description: "Output bandwidth as TYPE.  TYPE can be bits",
		},
		{
			name: ["-i", "--input-file=FILE"],
			description: "Download URLs found in local or external FILE",
		},
		{ name: ["-F", "--force-html"], description: "Treat input file as HTML" },
		{
			name: ["-B", "--base=URL"],
			description: "Resolves HTML input-file links (-i -F) relative to URL",
		},
		{ name: "--config=FILE", description: "Specify config file to use" },
		{ name: "--no-config", description: "Do not read any config file" },
		{
			name: "--rejected-log=FILE",
			description: "Log reasons for URL rejection to FILE",
		},
		{
			name: ["-t", "--tries=NUMBER"],
			description: "Set number of retries to NUMBER (0 unlimits)",
		},
		{
			name: "--retry-connrefused",
			description: "Retry even if connection is refused",
		},
		{
			name: "--retry-on-http-error",
			description: "Comma-separated list of HTTP errors to retry",
		},
		{
			name: ["-O", "--output-document=FILE"],
			description: "Write documents to FILE",
		},
		{
			name: ["-nc", "--no-clobber"],
			description:
				"Skip downloads that would download to existing files (overwriting them)",
		},
		{
			name: "--no-netrc",
			description: "Don't try to obtain credentials from .netrc",
		},
		{
			name: ["-c", "--continue"],
			description: "Resume getting a partially-downloaded file",
		},
		{
			name: "--start-pos=OFFSET",
			description: "Start downloading from zero-based position OFFSET",
		},
		{ name: "--progress=TYPE", description: "Select progress gauge type" },
		{
			name: "--show-progress",
			description: "Display the progress bar in any verbosity mode",
		},
		{
			name: ["-N", "--timestamping"],
			description: "Don't re-retrieve files unless newer than local",
		},
		{ name: ["-S", "--server-response"], description: "Print server response" },
		{ name: "--spider", description: "Don't download anything" },
		{
			name: ["-T", "--timeout=SECONDS"],
			description: "Set all timeout values to SECONDS",
		},
		{
			name: "--dns-timeout=SECS",
			description: "Set the DNS lookup timeout to SECS",
		},
		{
			name: "--connect-timeout=SECS",
			description: "Set the connect timeout to SECS",
		},
		{
			name: "--read-timeout=SECS",
			description: "Set the read timeout to SECS",
		},
		{
			name: ["-w", "--wait=SECONDS"],
			description: "Wait SECONDS between retrievals",
		},
		{
			name: "--waitretry=SECONDS",
			description: "Wait 1..SECONDS between retries of a retrieval",
		},
		{
			name: "--random-wait",
			description: "Wait from 0.5*WAIT...1.5*WAIT secs between retrievals",
		},
		{ name: "--no-proxy", description: "Explicitly turn off proxy" },
		{
			name: ["-Q", "--quota=NUMBER"],
			description: "Set retrieval quota to NUMBER",
		},
		{
			name: "--bind-address=ADDRESS",
			description: "Bind to ADDRESS (hostname or IP) on local host",
		},
		{ name: "--limit-rate=RATE", description: "Limit download rate to RATE" },
		{ name: "--no-dns-cache", description: "Disable caching DNS lookups" },
		{
			name: "--restrict-file-names=OS",
			description: "Restrict chars in file names to ones OS allows",
		},
		{
			name: "--ignore-case",
			description: "Ignore case when matching files/directories",
		},
		{
			name: ["-4", "--inet4-only"],
			description: "Connect only to IPv4 addresses",
		},
		{
			name: ["-6", "--inet6-only"],
			description: "Connect only to IPv6 addresses",
		},
		{
			name: "--user=USER",
			description: "Set both ftp and http user to USER",
		},
		{
			name: "--password=PASS",
			description: "Set both ftp and http password to PASS",
		},
		{ name: "--ask-password", description: "Prompt for passwords" },
		{ name: "--no-iri", description: "Turn off IRI support" },
		{
			name: "--local-encoding=ENC",
			description: "Use ENC as the local encoding for IRIs",
		},
		{
			name: "--remote-encoding=ENC",
			description: "Use ENC as the default remote encoding",
		},
		{ name: "--unlink", description: "Remove file before clobber" },
		{
			name: "--xattr",
			description: "Turn on storage of metadata in extended file attributes",
		},
		{
			name: ["-nd", "--no-directories"],
			description: "Don't create directories",
		},
		{
			name: ["-x", "--force-directories"],
			description: "Force creation of directories",
		},
		{
			name: ["-nH", "--no-host-directories"],
			description: "Don't create host directories",
		},
		{
			name: "--protocol-directories",
			description: "Use protocol name in directories",
		},
		{
			name: ["-P", "--directory-prefix=PREFIX"],
			description: "Save files to PREFIX/",
		},
		{
			name: "--cut-dirs=NUMBER",
			description: "Ignore NUMBER remote directory components",
		},
		{ name: "--http-user=USER", description: "Set http user to USER" },
		{
			name: "--http-password=PASS",
			description: "Set http password to PASS",
		},
		{ name: "--no-cache", description: "Disallow server-cached data" },
		{
			name: ["-E", "--adjust-extension"],
			description: "Save HTML/CSS documents with proper extensions",
		},
		{
			name: "--ignore-length",
			description: "Ignore 'Content-Length' header field",
		},
		{
			name: "--header=STRING",
			description: "Insert STRING among the headers",
		},
		{
			name: "--compression=TYPE",
			description:
				"Choose compression, one of auto, gzip and none. (default: none)",
		},
		{
			name: "--max-redirect",
			description: "Maximum redirections allowed per page",
		},
		{ name: "--proxy-user=USER", description: "Set USER as proxy username" },
		{
			name: "--proxy-password=PASS",
			description: "Set PASS as proxy password",
		},
		{
			name: "--referer=URL",
			description: "Include 'Referer: URL' header in HTTP request",
		},
		{ name: "--save-headers", description: "Save the HTTP headers to file" },
		{
			name: ["-U", "--user-agent=AGENT"],
			description: "Identify as AGENT instead of Wget/VERSION",
		},
		{
			name: "--no-http-keep-alive",
			description: "Disable HTTP keep-alive (persistent connections)",
		},
		{ name: "--no-cookies", description: "Don't use cookies" },
		{
			name: "--load-cookies=FILE",
			description: "Load cookies from FILE before session",
		},
		{
			name: "--save-cookies=FILE",
			description: "Save cookies to FILE after session",
		},
		{
			name: "--keep-session-cookies",
			description: "Load and save session (non-permanent) cookies",
		},
		{
			name: "--post-data=STRING",
			description: "Use the POST method; send STRING as the data",
		},
		{
			name: "--post-file=FILE",
			description: "Use the POST method; send contents of FILE",
		},
		{
			name: "--method=HTTPMethod",
			description: 'Use method "HTTPMethod" in the request',
		},
		{
			name: "--body-data=STRING",
			description: "Send STRING as data. --method MUST be set",
		},
		{
			name: "--body-file=FILE",
			description: "Send contents of FILE. --method MUST be set",
		},
		{
			name: "--content-on-error",
			description: "Output the received content on server errors",
		},
		{
			name: "--secure-protocol=PR",
			description: "Choose secure protocol, one of auto, SSLv2,",
		},
		{ name: "--https-only", description: "Only follow secure HTTPS links" },
		{
			name: "--no-check-certificate",
			description: "Don't validate the server's certificate",
		},
		{ name: "--certificate=FILE", description: "Client certificate file" },
		{
			name: "--certificate-type=TYPE",
			description: "Client certificate type, PEM or DER",
		},
		{ name: "--private-key=FILE", description: "Private key file" },
		{
			name: "--private-key-type=TYPE",
			description: "Private key type, PEM or DER",
		},
		{
			name: "--ca-certificate=FILE",
			description: "File with the bundle of CAs",
		},
		{
			name: "--ca-directory=DIR",
			description: "Directory where hash list of CAs is stored",
		},
		{ name: "--crl-file=FILE", description: "File with bundle of CRLs" },
		{
			name: "--ciphers=STR",
			description:
				"Set the priority string (GnuTLS) or cipher list string (OpenSSL) directly",
		},
		{ name: ["-r", "--recursive"], description: "Specify recursive download" },
		{
			name: ["-l", "--level=NUMBER"],
			description: "Maximum recursion depth (inf or 0 for infinite)",
		},
		{
			name: "--delete-after",
			description: "Delete files locally after downloading them",
		},
		{
			name: ["-k", "--convert-links"],
			description: "Make links in downloaded HTML or CSS point to local files",
		},
		{
			name: ["-K", "--backup-converted"],
			description: "Before converting file X, back up as X.orig",
		},
		{
			name: ["-m", "--mirror"],
			description: "Shortcut for -N -r -l inf --no-remove-listing",
		},
		{
			name: ["-p", "--page-requisites"],
			description: "Get all images, etc. needed to display HTML page",
		},
		{
			name: ["-A", "--accept=LIST"],
			description: "Comma-separated list of accepted extensions",
		},
		{
			name: ["-R", "--reject=LIST"],
			description: "Comma-separated list of rejected extensions",
		},
		{
			name: "--accept-regex=REGEX",
			description: "Regex matching accepted URLs",
		},
		{
			name: "--reject-regex=REGEX",
			description: "Regex matching rejected URLs",
		},
		{ name: "--regex-type=TYPE", description: "Regex type (posix)" },
		{
			name: ["-D", "--domains=LIST"],
			description: "Comma-separated list of accepted domains",
		},
		{
			name: "--exclude-domains=LIST",
			description: "Comma-separated list of rejected domains",
		},
		{
			name: "--follow-ftp",
			description: "Follow FTP links from HTML documents",
		},
		{
			name: "--follow-tags=LIST",
			description: "Comma-separated list of followed HTML tags",
		},
		{
			name: "--ignore-tags=LIST",
			description: "Comma-separated list of ignored HTML tags",
		},
		{
			name: ["-H", "--span-hosts"],
			description: "Go to foreign hosts when recursive",
		},
		{ name: ["-L", "--relative"], description: "Follow relative links only" },
		{
			name: ["-I", "--include-directories=LIST"],
			description: "List of allowed directories",
		},
		{
			name: ["-X", "--exclude-directories=LIST"],
			description: "List of excluded directories",
		},
		{
			name: ["-np", "--no-parent"],
			description: "Don't ascend to the parent directory",
		},
	],
};

// GNU Wget 1.20.3, a non-interactive network retriever.
// Usage: wget [OPTION]... [URL]...

// Mandatory arguments to long options are mandatory for short options too.

// Startup:
//   -V,  --version                   display the version of Wget and exit
//   -h,  --help                      print this help
//   -b,  --background                go to background after startup
//   -e,  --execute=COMMAND           execute a `.wgetrc'-style command

// Logging and input file:
//   -o,  --output-file=FILE          log messages to FILE
//   -a,  --append-output=FILE        append messages to FILE
//   -q,  --quiet                     quiet (no output)
//   -v,  --verbose                   be verbose (this is the default)
//   -nv, --no-verbose                turn off verboseness, without being quiet
//        --report-speed=TYPE         output bandwidth as TYPE.  TYPE can be bits
//   -i,  --input-file=FILE           download URLs found in local or external FILE
//   -F,  --force-html                treat input file as HTML
//   -B,  --base=URL                  resolves HTML input-file links (-i -F)
//                                      relative to URL
//        --config=FILE               specify config file to use
//        --no-config                 do not read any config file
//        --rejected-log=FILE         log reasons for URL rejection to FILE

// Download:
//   -t,  --tries=NUMBER              set number of retries to NUMBER (0 unlimits)
//        --retry-connrefused         retry even if connection is refused
//        --retry-on-http-error=ERRORS    comma-separated list of HTTP errors to retry
//   -O,  --output-document=FILE      write documents to FILE
//   -nc, --no-clobber                skip downloads that would download to
//                                      existing files (overwriting them)
//        --no-netrc                  don't try to obtain credentials from .netrc
//   -c,  --continue                  resume getting a partially-downloaded file
//        --start-pos=OFFSET          start downloading from zero-based position OFFSET
//        --progress=TYPE             select progress gauge type
//        --show-progress             display the progress bar in any verbosity mode
//   -N,  --timestamping              don't re-retrieve files unless newer than
//                                      local
//        --no-if-modified-since      don't use conditional if-modified-since get
//                                      requests in timestamping mode
//        --no-use-server-timestamps  don't set the local file's timestamp by
//                                      the one on the server
//   -S,  --server-response           print server response
//        --spider                    don't download anything
//   -T,  --timeout=SECONDS           set all timeout values to SECONDS
//        --dns-timeout=SECS          set the DNS lookup timeout to SECS
//        --connect-timeout=SECS      set the connect timeout to SECS
//        --read-timeout=SECS         set the read timeout to SECS
//   -w,  --wait=SECONDS              wait SECONDS between retrievals
//        --waitretry=SECONDS         wait 1..SECONDS between retries of a retrieval
//        --random-wait               wait from 0.5*WAIT...1.5*WAIT secs between retrievals
//        --no-proxy                  explicitly turn off proxy
//   -Q,  --quota=NUMBER              set retrieval quota to NUMBER
//        --bind-address=ADDRESS      bind to ADDRESS (hostname or IP) on local host
//        --limit-rate=RATE           limit download rate to RATE
//        --no-dns-cache              disable caching DNS lookups
//        --restrict-file-names=OS    restrict chars in file names to ones OS allows
//        --ignore-case               ignore case when matching files/directories
//   -4,  --inet4-only                connect only to IPv4 addresses
//   -6,  --inet6-only                connect only to IPv6 addresses
//        --prefer-family=FAMILY      connect first to addresses of specified family,
//                                      one of IPv6, IPv4, or none
//        --user=USER                 set both ftp and http user to USER
//        --password=PASS             set both ftp and http password to PASS
//        --ask-password              prompt for passwords
//        --use-askpass=COMMAND       specify credential handler for requesting
//                                      username and password.  If no COMMAND is
//                                      specified the WGET_ASKPASS or the SSH_ASKPASS
//                                      environment variable is used.
//        --no-iri                    turn off IRI support
//        --local-encoding=ENC        use ENC as the local encoding for IRIs
//        --remote-encoding=ENC       use ENC as the default remote encoding
//        --unlink                    remove file before clobber
//        --xattr                     turn on storage of metadata in extended file attributes

// Directories:
//   -nd, --no-directories            don't create directories
//   -x,  --force-directories         force creation of directories
//   -nH, --no-host-directories       don't create host directories
//        --protocol-directories      use protocol name in directories
//   -P,  --directory-prefix=PREFIX   save files to PREFIX/..
//        --cut-dirs=NUMBER           ignore NUMBER remote directory components

// HTTP options:
//        --http-user=USER            set http user to USER
//        --http-password=PASS        set http password to PASS
//        --no-cache                  disallow server-cached data
//        --default-page=NAME         change the default page name (normally
//                                      this is 'index.html'.)
//   -E,  --adjust-extension          save HTML/CSS documents with proper extensions
//        --ignore-length             ignore 'Content-Length' header field
//        --header=STRING             insert STRING among the headers
//        --compression=TYPE          choose compression, one of auto, gzip and none. (default: none)
//        --max-redirect              maximum redirections allowed per page
//        --proxy-user=USER           set USER as proxy username
//        --proxy-password=PASS       set PASS as proxy password
//        --referer=URL               include 'Referer: URL' header in HTTP request
//        --save-headers              save the HTTP headers to file
//   -U,  --user-agent=AGENT          identify as AGENT instead of Wget/VERSION
//        --no-http-keep-alive        disable HTTP keep-alive (persistent connections)
//        --no-cookies                don't use cookies
//        --load-cookies=FILE         load cookies from FILE before session
//        --save-cookies=FILE         save cookies to FILE after session
//        --keep-session-cookies      load and save session (non-permanent) cookies
//        --post-data=STRING          use the POST method; send STRING as the data
//        --post-file=FILE            use the POST method; send contents of FILE
//        --method=HTTPMethod         use method "HTTPMethod" in the request
//        --body-data=STRING          send STRING as data. --method MUST be set
//        --body-file=FILE            send contents of FILE. --method MUST be set
//        --content-disposition       honor the Content-Disposition header when
//                                      choosing local file names (EXPERIMENTAL)
//        --content-on-error          output the received content on server errors
//        --auth-no-challenge         send Basic HTTP authentication information
//                                      without first waiting for the server's
//                                      challenge

// HTTPS (SSL/TLS) options:
//        --secure-protocol=PR        choose secure protocol, one of auto, SSLv2,
//                                      SSLv3, TLSv1, TLSv1_1, TLSv1_2 and PFS
//        --https-only                only follow secure HTTPS links
//        --no-check-certificate      don't validate the server's certificate
//        --certificate=FILE          client certificate file
//        --certificate-type=TYPE     client certificate type, PEM or DER
//        --private-key=FILE          private key file
//        --private-key-type=TYPE     private key type, PEM or DER
//        --ca-certificate=FILE       file with the bundle of CAs
//        --ca-directory=DIR          directory where hash list of CAs is stored
//        --crl-file=FILE             file with bundle of CRLs
//        --pinnedpubkey=FILE/HASHES  Public key (PEM/DER) file, or any number
//                                    of base64 encoded sha256 hashes preceded by
//                                    'sha256//' and separated by ';', to verify
//                                    peer against
//        --random-file=FILE          file with random data for seeding the SSL PRNG

//        --ciphers=STR           Set the priority string (GnuTLS) or cipher list string (OpenSSL) directly.
//                                    Use with care. This option overrides --secure-protocol.
//                                    The format and syntax of this string depend on the specific SSL/TLS engine.
// HSTS options:
//        --no-hsts                   disable HSTS
//        --hsts-file                 path of HSTS database (will override default)

// FTP options:
//        --ftp-user=USER             set ftp user to USER
//        --ftp-password=PASS         set ftp password to PASS
//        --no-remove-listing         don't remove '.listing' files
//        --no-glob                   turn off FTP file name globbing
//        --no-passive-ftp            disable the "passive" transfer mode
//        --preserve-permissions      preserve remote file permissions
//        --retr-symlinks             when recursing, get linked-to files (not dir)

// FTPS options:
//        --ftps-implicit                 use implicit FTPS (default port is 990)
//        --ftps-resume-ssl               resume the SSL/TLS session started in the control connection when
//                                          opening a data connection
//        --ftps-clear-data-connection    cipher the control channel only; all the data will be in plaintext
//        --ftps-fallback-to-ftp          fall back to FTP if FTPS is not supported in the target server
// WARC options:
//        --warc-file=FILENAME        save request/response data to a .warc.gz file
//        --warc-header=STRING        insert STRING into the warcinfo record
//        --warc-max-size=NUMBER      set maximum size of WARC files to NUMBER
//        --warc-cdx                  write CDX index files
//        --warc-dedup=FILENAME       do not store records listed in this CDX file
//        --no-warc-compression       do not compress WARC files with GZIP
//        --no-warc-digests           do not calculate SHA1 digests
//        --no-warc-keep-log          do not store the log file in a WARC record
//        --warc-tempdir=DIRECTORY    location for temporary files created by the
//                                      WARC writer

// Recursive download:
//   -r,  --recursive                 specify recursive download
//   -l,  --level=NUMBER              maximum recursion depth (inf or 0 for infinite)
//        --delete-after              delete files locally after downloading them
//   -k,  --convert-links             make links in downloaded HTML or CSS point to
//                                      local files
//        --convert-file-only         convert the file part of the URLs only (usually known as the basename)
//        --backups=N                 before writing file X, rotate up to N backup files
//   -K,  --backup-converted          before converting file X, back up as X.orig
//   -m,  --mirror                    shortcut for -N -r -l inf --no-remove-listing
//   -p,  --page-requisites           get all images, etc. needed to display HTML page
//        --strict-comments           turn on strict (SGML) handling of HTML comments

// Recursive accept/reject:
//   -A,  --accept=LIST               comma-separated list of accepted extensions
//   -R,  --reject=LIST               comma-separated list of rejected extensions
//        --accept-regex=REGEX        regex matching accepted URLs
//        --reject-regex=REGEX        regex matching rejected URLs
//        --regex-type=TYPE           regex type (posix)
//   -D,  --domains=LIST              comma-separated list of accepted domains
//        --exclude-domains=LIST      comma-separated list of rejected domains
//        --follow-ftp                follow FTP links from HTML documents
//        --follow-tags=LIST          comma-separated list of followed HTML tags
//        --ignore-tags=LIST          comma-separated list of ignored HTML tags
//   -H,  --span-hosts                go to foreign hosts when recursive
//   -L,  --relative                  follow relative links only
//   -I,  --include-directories=LIST  list of allowed directories
//        --trust-server-names        use the name specified by the redirection
//                                      URL's last component
//   -X,  --exclude-directories=LIST  list of excluded directories
//   -np, --no-parent                 don't ascend to the parent directory

// Email bug reports, questions, discussions to <bug-wget@gnu.org>
// and/or open issues at https://savannah.gnu.org/bugs/?func=additem&group=wget.

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/where.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/where.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "where",
	description: "For each name, indicate how it should be interpreted",
	args: {
		name: "names",
		isVariadic: true,
	},
	options: [
		{
			name: "-w",
			description:
				"For each name, print 'name: word', where 'word' is the kind of command",
		},
		{
			name: "-p",
			description:
				"Do a path search for the name, even if it's an alias/function/builtin",
		},
		{
			name: "-m",
			description:
				"The arguments are taken as patterns (pattern characters must be quoted)",
		},
		{
			name: "-s",
			description:
				"If the pathname contains symlinks, print the symlink-free name as well",
		},
		{
			name: "-S",
			description: "Print intermediate symlinks and the resolved name",
		},
		{
			name: "-x",
			description: "Expand tabs when outputting shell function",
			args: { name: "num" },
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/whereis.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/whereis.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "whereis",
	description: "Locate the binary, source, and manual page files for a command",
	options: [
		{
			name: "-b",
			description: "Search only for binaries",
		},
		{
			name: "-m",
			description: "Search only for manual sections",
		},
		{
			name: "-s",
			description: "Search only for sources",
		},
		{
			name: "-u",
			description: "Search for unusual entries",
		},
		{
			name: "-B",
			description: "Search for binaries only in the specified directory",
			args: {
				name: "directory",
				description: "The directory to search in",
				template: "folders",
			},
		},
		{
			name: "-M",
			description: "Search for manual pages only in the specified directory",
			args: {
				name: "directory",
				description: "The directory to search in",
				template: "folders",
			},
		},
		{
			name: "-S",
			description: "Search for sources only in the specified directory",
			args: {
				name: "directory",
				description: "The directory to search in",
				template: "folders",
			},
		},
		{
			name: "-f",
			description: "Terminate the -B, -M, and -S options",
		},
	],
	// Only uncomment if whereis takes an argument
	args: {
		name: "Filename",
		description: "The file to search for",
	},
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/which.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/which.ts

```typescript
const programGenerator: Fig.Generator = {
	script: [
		"bash",
		"-c",
		`for i in $(echo $PATH | tr ":" "\n"); do find $i -maxdepth 1 -perm -111 -type f; done`,
	],
	postProcess: (out) =>
		out
			.split("\n")
			.map((path) => path.split("/")[path.split("/").length - 1])
			.map((pr) => ({ name: pr, description: "Executable file", type: "arg" })),
};

const completionSpec: Fig.Spec = {
	name: "which",
	description: "Locate a program in the user's PATH",
	args: {
		name: "names",
		isVariadic: true,
		generators: programGenerator,
		filterStrategy: "fuzzy",
		suggestCurrentToken: true,
	},
	options: [
		{
			name: "-s",
			description:
				"No output, return 0 if all the executables are found, 1 if not",
		},
		{
			name: "-a",
			description:
				"List all instances of executables found, instead of just the first",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/who.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/who.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "who",
	description: "Display who is logged in",
	parserDirectives: {
		optionsMustPrecedeArguments: true,
	},
	subcommands: [
		{
			name: "am",
			description: "Returns the invoker's real user name",
			additionalSuggestions: [
				{
					name: "am I",
					insertValue: "I{cursor}",
					icon: "fig://icon?type=command",
				},
			],
			priority: 40,
		},
	],
	options: [
		{
			name: "-a",
			description: "Same as -bdlprTtu",
		},
		{
			name: "-b",
			description: "Time of last system boot",
		},
		{
			name: "-d",
			description: "Print dead processes",
		},
		{
			name: "-H",
			description: "Write column headings above the regular output",
		},
		{
			name: "-l",
			description: "Print system login processes (unsupported)",
		},
		{
			name: "-m",
			description: "Only print information about the current terminal",
		},
		{
			name: "-p",
			description: "Print active processes spawned by launchd(8) (unsupported)",
		},
		{
			name: "-q",
			description:
				"'Quick mode': List only names and number of users currently logged on",
			exclusiveOn: [
				"-a",
				"-b",
				"-d",
				"-H",
				"-l",
				"-m",
				"-p",
				"-r",
				"-s",
				"-T",
				"-t",
				"-u",
			],
		},
		{
			name: "-r",
			description: "Print the current runlevel",
		},
		{
			name: "-s",
			description:
				"List only the name, line and time fields (this is the default)",
		},
		{
			name: "-T",
			description:
				"Print a character after the user name indicating the state of the terminal line: '+' writable, '-' not writable, '?' bad",
		},
		{
			name: "-t",
			description: "Print last system clock change (unsupported)",
		},
		{
			name: "-u",
			description:
				"Print the idle time for each user and the associated process ID",
		},
	],
	args: {
		name: "file",
		description:
			"By default, who gathers information from the file /var/run/utmpx; an alternative file may be specified",
		isOptional: true,
		template: "filepaths",
	},
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/xargs.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/xargs.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "xargs",
	description:
		"Execute a command with whitespace-delimited strings (from stdin) as arguments",
	options: [
		{
			name: "-0",
			description: "Use NUL (0x00) as a separator, instead of whitespace",
		},
		{
			name: "-E",
			description: "Use this string as a logical EOF marker",
			args: {
				name: "eof-str",
				description: "The string to use that marks EOF",
			},
		},
		{
			name: "-I",
			description: "Replace occurrences of this string with the input",
			args: {
				name: "replacement-str",
				description: "The string to replace",
			},
		},
		{
			name: "-J",
			description:
				"Replace an argument exactly equal to this string with the input",
			args: {
				name: "replacement-str",
				description: "The string to replace",
			},
		},
		{
			name: "-L",
			description:
				"Run the program each time this many lines of input are read",
			args: {
				name: "number",
			},
			exclusiveOn: ["-n"],
		},
		{
			name: "-n",
			description:
				"The maximum number of arguments that can be taken from stdin on each run",
			args: {
				name: "number",
			},
			exclusiveOn: ["-L"],
		},
		{
			name: "-o",
			description:
				"Reopen stdin as /dev/tty (useful for running interactive applications)",
		},
		{
			name: "-P",
			description:
				"Run up to this many commands in parallel (as many as possible if 0)",
			args: {
				name: "max-procs",
			},
		},
		{
			name: "-p",
			description: "Prompt to run each command",
		},
		{
			name: "-r",
			description:
				"Run the command once if there's no input (compatible with GNU xargs)",
		},
		{
			name: "-R",
			description:
				"Specify the maximum number of occurrences that -I will replace",
			dependsOn: ["-I"],
			args: {
				name: "number",
			},
		},
		{
			name: "-S",
			description:
				"Specify the maximum size in bytes that -I can use for replacements (default: 255)",
			dependsOn: ["-I"],
			args: {
				name: "replacement-size",
			},
		},
		{
			name: "-s",
			description:
				"Maximum number of bytes that can be provided to the program (default: 4096)",
			args: {
				name: "max-args-size",
			},
		},
		{
			name: "-t",
			description: "Echo the command to stderr before it's executed",
		},
		{
			name: "-x",
			description:
				"Terminal if the arguments will not fit in the maximum line length",
			dependsOn: ["-n"],
		},
	],
	args: {
		name: "utility",
		description: "Run this program for each line of stdin (default: echo)",
		isCommand: true,
		isOptional: true,
	},
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/xxd.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/xxd.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "xxd",
	description: "Make a hexdump or do the reverse",
	parserDirectives: {
		flagsArePosixNoncompliant: true,
	},
	options: [
		{
			name: ["-help", "-h"],
			description: "Show help for xxd",
		},
		{
			name: ["-autoskip", "-a"],
			description:
				"Toggle autoskip: A single '*' replaces nul-lines.  Default off",
		},
		{
			name: ["-bits", "-b"],
			description: "Switch to bits (binary digits) dump, rather than hexdump",
			exclusiveOn: ["-postscript", "-plain", "-ps", "-p", "-r", "-i"],
		},
		{
			name: ["-cols", "-c"],
			description: "Format <cols> octets per line. Default 16",
			args: {
				name: "cols",
			},
		},
		{
			name: ["-capitalize", "-C"],
			description:
				"Capitalize variable names in C include file style, when using -i",
		},
		{
			name: ["-EBCDIC", "-E"],
			description:
				"Change the character encoding in the righthand column from ASCII to EBCDIC",
			exclusiveOn: ["-postscript", "-plain", "-ps", "-p", "-r", "-i"],
		},
		{
			name: "-e",
			description: "Switch to little-endian hexdump",
		},
		{
			name: ["-groupsize", "-g"],
			description: "Separate the output of every <bytes> bytes",
			args: {
				name: "bytes",
			},
		},
		{
			name: ["-include", "-i"],
			description: "Output in C include file style",
			exclusiveOn: ["-EBCDIC", "-E", "-bits", "-b"],
		},
		{
			name: ["-len", "-l"],
			description: "Stop after writing <len> octets",
			args: {
				name: "len",
			},
		},
		{
			name: ["-name", "-n"],
			description: "Override the variable name output when -i is used",
			args: {
				name: "name",
			},
		},
		{
			name: "-o",
			description: "Add <offset> to the displayed file position",
			args: {
				name: "offset",
			},
		},
		{
			name: ["-postscript", "-plain", "-ps", "-p"],
			description: "Output in postscript continuous hexdump style",
			exclusiveOn: ["-EBCDIC", "-E", "-bits", "-b"],
		},
		{
			name: ["-revert", "-r"],
			description: "Reverse operation: convert (or patch) hexdump into binary",
			exclusiveOn: ["-EBCDIC", "-E", "-bits", "-b"],
		},
		{
			name: "-seek",
			description:
				"When used after -r: revert with <offset> added to file positions found in hexdump",
			args: {
				name: "offset",
			},
		},
		{
			name: "-u",
			description: "Use upper case hex letters. Default is lower case",
		},
		{
			name: ["-version", "-v"],
			description: "Show version string",
		},
	],
	args: [
		{
			name: "infile",
			template: "filepaths",
		},
		{
			name: "outfile",
			template: "filepaths",
		},
	],
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/yarn.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/yarn.ts

```typescript
import { npmScriptsGenerator, npmSearchGenerator } from "./npm";

export const yarnScriptParserDirectives: Fig.Arg["parserDirectives"] = {
	alias: async (token, executeShellCommand) => {
		const npmPrefix = await executeShellCommand({
			command: "npm",
			// eslint-disable-next-line @withfig/fig-linter/no-useless-arrays
			args: ["prefix"],
		});
		if (npmPrefix.status !== 0) {
			throw new Error("npm prefix command failed");
		}
		const packageJson = await executeShellCommand({
			command: "cat",
			// eslint-disable-next-line @withfig/fig-linter/no-useless-arrays
			args: [`${npmPrefix.stdout.trim()}/package.json`],
		});
		const script: string = JSON.parse(packageJson.stdout).scripts?.[token];
		if (!script) {
			throw new Error(`Script not found: '${token}'`);
		}
		return script;
	},
};

export const nodeClis = new Set([
	"vue",
	"vite",
	"nuxt",
	"react-native",
	"degit",
	"expo",
	"jest",
	"next",
	"electron",
	"prisma",
	"eslint",
	"prettier",
	"tsc",
	"typeorm",
	"babel",
	"remotion",
	"autocomplete-tools",
	"redwood",
	"rw",
	"create-completion-spec",
	"publish-spec-to-team",
	"capacitor",
	"cap",
]);

// generate global package list from global package.json file
const getGlobalPackagesGenerator: Fig.Generator = {
	custom: async (tokens, executeCommand, generatorContext) => {
		const { stdout: yarnGlobalDir } = await executeCommand({
			command: "yarn",
			args: ["global", "dir"],
		});

		const { stdout } = await executeCommand({
			command: "cat",
			// eslint-disable-next-line @withfig/fig-linter/no-useless-arrays
			args: [`${yarnGlobalDir.trim()}/package.json`],
		});

		if (stdout.trim() == "") return [];

		try {
			const packageContent = JSON.parse(stdout);
			const dependencyScripts = packageContent["dependencies"] || {};
			const devDependencyScripts = packageContent["devDependencies"] || {};
			const dependencies = [
				...Object.keys(dependencyScripts),
				...Object.keys(devDependencyScripts),
			];

			const filteredDependencies = dependencies.filter(
				(dependency) => !tokens.includes(dependency)
			);

			return filteredDependencies.map((dependencyName) => ({
				name: dependencyName,
				icon: "📦",
			}));
		} catch (e) {}

		return [];
	},
};

// generate package list of direct and indirect dependencies
const allDependenciesGenerator: Fig.Generator = {
	script: ["yarn", "list", "--depth=0", "--json"],
	postProcess: (out) => {
		if (out.trim() == "") return [];

		try {
			const packageContent = JSON.parse(out);
			const dependencies = packageContent.data.trees;
			return dependencies.map((dependency: { name: string }) => ({
				name: dependency.name.split("@")[0],
				icon: "📦",
			}));
		} catch (e) {}
		return [];
	},
};

const configList: Fig.Generator = {
	script: ["yarn", "config", "list"],
	postProcess: function (out) {
		if (out.trim() == "") {
			return [];
		}

		try {
			const startIndex = out.indexOf("{");
			const endIndex = out.indexOf("}");
			let output = out.substring(startIndex, endIndex + 1);
			// TODO: fix hacky code
			// reason: JSON parse was not working without double quotes
			output = output
				.replace(/\'/gi, '"')
				.replace("lastUpdateCheck", '"lastUpdateCheck"')
				.replace("registry", '"lastUpdateCheck"');
			const configObject = JSON.parse(output);
			if (configObject) {
				return Object.keys(configObject).map((key) => ({ name: key }));
			}
		} catch (e) {}

		return [];
	},
};

export const dependenciesGenerator: Fig.Generator = {
	script: [
		"bash",
		"-c",
		"until [[ -f package.json ]] || [[ $PWD = '/' ]]; do cd ..; done; cat package.json",
	],
	postProcess: function (out, context = []) {
		if (out.trim() === "") {
			return [];
		}

		try {
			const packageContent = JSON.parse(out);
			const dependencies = packageContent["dependencies"] ?? {};
			const devDependencies = packageContent["devDependencies"];
			const optionalDependencies = packageContent["optionalDependencies"] ?? {};
			Object.assign(dependencies, devDependencies, optionalDependencies);

			return Object.keys(dependencies)
				.filter((pkgName) => {
					const isListed = context.some((current) => current === pkgName);
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
		} catch (e) {
			console.error(e);
			return [];
		}
	},
};

const commonOptions: Fig.Option[] = [
	{ name: ["-s", "--silent"], description: "Skip Yarn console logs" },
	{
		name: "--no-default-rc",
		description:
			"Prevent Yarn from automatically detecting yarnrc and npmrc files",
	},
	{
		name: "--use-yarnrc",
		description:
			"Specifies a yarnrc file that Yarn should use (.yarnrc only, not .npmrc) (default: )",
		args: { name: "path", template: "filepaths" },
	},
	{
		name: "--verbose",
		description: "Output verbose messages on internal operations",
	},
	{
		name: "--offline",
		description:
			"Trigger an error if any required dependencies are not available in local cache",
	},
	{
		name: "--prefer-offline",
		description:
			"Use network only if dependencies are not available in local cache",
	},
	{
		name: ["--enable-pnp", "--pnp"],
		description: "Enable the Plug'n'Play installation",
	},
	{
		name: "--json",
		description: "Format Yarn log messages as lines of JSON",
	},
	{
		name: "--ignore-scripts",
		description: "Don't run lifecycle scripts",
	},
	{ name: "--har", description: "Save HAR output of network traffic" },
	{ name: "--ignore-platform", description: "Ignore platform checks" },
	{ name: "--ignore-engines", description: "Ignore engines check" },
	{
		name: "--ignore-optional",
		description: "Ignore optional dependencies",
	},
	{
		name: "--force",
		description:
			"Install and build packages even if they were built before, overwrite lockfile",
	},
	{
		name: "--skip-integrity-check",
		description: "Run install without checking if node_modules is installed",
	},
	{
		name: "--check-files",
		description: "Install will verify file tree of packages for consistency",
	},
	{
		name: "--no-bin-links",
		description: "Don't generate bin links when setting up packages",
	},
	{ name: "--flat", description: "Only allow one version of a package" },
	{
		name: ["--prod", "--production"],
		description:
			"Instruct Yarn to ignore NODE_ENV and take its production-or-not status from this flag instead",
	},
	{
		name: "--no-lockfile",
		description: "Don't read or generate a lockfile",
	},
	{ name: "--pure-lockfile", description: "Don't generate a lockfile" },
	{
		name: "--frozen-lockfile",
		description: "Don't generate a lockfile and fail if an update is needed",
	},
	{
		name: "--update-checksums",
		description: "Update package checksums from current repository",
	},
	{
		name: "--link-duplicates",
		description: "Create hardlinks to the repeated modules in node_modules",
	},
	{
		name: "--link-folder",
		description: "Specify a custom folder to store global links",
		args: { name: "path", template: "folders" },
	},
	{
		name: "--global-folder",
		description: "Specify a custom folder to store global packages",
		args: { name: "path", template: "folders" },
	},
	{
		name: "--modules-folder",
		description:
			"Rather than installing modules into the node_modules folder relative to the cwd, output them here",
		args: { name: "path", template: "folders" },
	},
	{
		name: "--preferred-cache-folder",
		description: "Specify a custom folder to store the yarn cache if possible",
		args: { name: "path", template: "folders" },
	},
	{
		name: "--cache-folder",
		description:
			"Specify a custom folder that must be used to store the yarn cache",
		args: { name: "path", template: "folders" },
	},
	{
		name: "--mutex",
		description: "Use a mutex to ensure only one yarn instance is executing",
		args: { name: "type[:specifier]" },
	},
	{
		name: "--emoji",
		description: "Enables emoji in output",
		args: {
			default: "true",
			suggestions: ["true", "false"],
		},
	},
	{
		name: "--cwd",
		description: "Working directory to use",
		args: { name: "cwd", template: "folders" },
	},
	{
		name: ["--proxy", "--https-proxy"],
		description: "",
		args: { name: "host" },
	},
	{
		name: "--registry",
		description: "Override configuration registry",
		args: { name: "url" },
	},
	{ name: "--no-progress", description: "Disable progress bar" },
	{
		name: "--network-concurrency",
		description: "Maximum number of concurrent network requests",
		args: { name: "number" },
	},
	{
		name: "--network-timeout",
		description: "TCP timeout for network requests",
		args: { name: "milliseconds" },
	},
	{
		name: "--non-interactive",
		description: "Do not show interactive prompts",
	},
	{
		name: "--scripts-prepend-node-path",
		description: "Prepend the node executable dir to the PATH in scripts",
	},
	{
		name: "--no-node-version-check",
		description:
			"Do not warn when using a potentially unsupported Node version",
	},
	{
		name: "--focus",
		description:
			"Focus on a single workspace by installing remote copies of its sibling workspaces",
	},
	{
		name: "--otp",
		description: "One-time password for two factor authentication",
		args: { name: "otpcode" },
	},
];

export const createCLIsGenerator: Fig.Generator = {
	script: function (context) {
		if (context[context.length - 1] === "") return undefined;
		const searchTerm = "create-" + context[context.length - 1];
		return [
			"curl",
			"-s",
			"-H",
			"Accept: application/json",
			`https://api.npms.io/v2/search?q=${searchTerm}&size=20`,
		];
	},
	cache: {
		ttl: 100 * 24 * 60 * 60 * 3, // 3 days
	},
	postProcess: function (out) {
		try {
			return JSON.parse(out).results.map(
				(item: { package: { name: string; description: string } }) =>
					({
						name: item.package.name.substring(7),
						description: item.package.description,
					}) as Fig.Suggestion
			) as Fig.Suggestion[];
		} catch (e) {
			return [];
		}
	},
};

const completionSpec: Fig.Spec = {
	name: "yarn",
	description: "Manage packages and run scripts",
	generateSpec: async (tokens, executeShellCommand) => {
		const binaries = (
			await executeShellCommand({
				command: "bash",
				args: [
					"-c",
					`until [[ -d node_modules/ ]] || [[ $PWD = '/' ]]; do cd ..; done; ls -1 node_modules/.bin/`,
				],
			})
		).stdout.split("\n");

		const subcommands = binaries
			.filter((name) => nodeClis.has(name))
			.map((name) => ({
				name: name,
				loadSpec: name === "rw" ? "redwood" : name,
				icon: "fig://icon?type=package",
			}));

		return {
			name: "yarn",
			subcommands,
		} as Fig.Spec;
	},
	args: {
		generators: npmScriptsGenerator,
		filterStrategy: "fuzzy",
		parserDirectives: yarnScriptParserDirectives,
		isOptional: true,
		isCommand: true,
	},
	options: [
		{
			name: "--disable-pnp",
			description: "Disable the Plug'n'Play installation",
		},
		{
			name: "--emoji",
			description: "Enable emoji in output (default: true)",
			args: {
				name: "bool",
				suggestions: [{ name: "true" }, { name: "false" }],
			},
		},
		{
			name: ["--enable-pnp", "--pnp"],
			description: "Enable the Plug'n'Play installation",
		},
		{
			name: "--flat",
			description: "Only allow one version of a package",
		},
		{
			name: "--focus",
			description:
				"Focus on a single workspace by installing remote copies of its sibling workspaces",
		},
		{
			name: "--force",
			description:
				"Install and build packages even if they were built before, overwrite lockfile",
		},
		{
			name: "--frozen-lockfile",
			description: "Don't generate a lockfile and fail if an update is needed",
		},
		{
			name: "--global-folder",
			description: "Specify a custom folder to store global packages",
			args: {
				template: "folders",
			},
		},
		{
			name: "--har",
			description: "Save HAR output of network traffic",
		},
		{
			name: "--https-proxy",
			description: "",
			args: {
				name: "path",
				suggestions: [{ name: "https://" }],
			},
		},
		{
			name: "--ignore-engines",
			description: "Ignore engines check",
		},
		{
			name: "--ignore-optional",
			description: "Ignore optional dependencies",
		},
		{
			name: "--ignore-platform",
			description: "Ignore platform checks",
		},
		{
			name: "--ignore-scripts",
			description: "Don't run lifecycle scripts",
		},
		{
			name: "--json",
			description:
				"Format Yarn log messages as lines of JSON (see jsonlines.org)",
		},
		{
			name: "--link-duplicates",
			description: "Create hardlinks to the repeated modules in node_modules",
		},
		{
			name: "--link-folder",
			description: "Specify a custom folder to store global links",
			args: {
				template: "folders",
			},
		},
		{
			name: "--modules-folder",
			description:
				"Rather than installing modules into the node_modules folder relative to the cwd, output them here",
			args: {
				template: "folders",
			},
		},
		{
			name: "--mutex",
			description: "Use a mutex to ensure only one yarn instance is executing",
			args: [
				{
					name: "type",
					suggestions: [{ name: ":" }],
				},
				{
					name: "specifier",
					suggestions: [{ name: ":" }],
				},
			],
		},
		{
			name: "--network-concurrency",
			description: "Maximum number of concurrent network requests",
			args: {
				name: "number",
			},
		},
		{
			name: "--network-timeout",
			description: "TCP timeout for network requests",
			args: {
				name: "milliseconds",
			},
		},
		{
			name: "--no-bin-links",
			description: "Don't generate bin links when setting up packages",
		},
		{
			name: "--no-default-rc",
			description:
				"Prevent Yarn from automatically detecting yarnrc and npmrc files",
		},
		{
			name: "--no-lockfile",
			description: "Don't read or generate a lockfile",
		},
		{
			name: "--non-interactive",
			description: "Do not show interactive prompts",
		},
		{
			name: "--no-node-version-check",
			description:
				"Do not warn when using a potentially unsupported Node version",
		},
		{
			name: "--no-progress",
			description: "Disable progress bar",
		},
		{
			name: "--offline",
			description:
				"Trigger an error if any required dependencies are not available in local cache",
		},
		{
			name: "--otp",
			description: "One-time password for two factor authentication",
			args: {
				name: "otpcode",
			},
		},
		{
			name: "--prefer-offline",
			description:
				"Use network only if dependencies are not available in local cache",
		},
		{
			name: "--preferred-cache-folder",
			description:
				"Specify a custom folder to store the yarn cache if possible",
			args: {
				template: "folders",
			},
		},
		{
			name: ["--prod", "--production"],
			description: "",
			args: {},
		},
		{
			name: "--proxy",
			description: "",
			args: {
				name: "host",
			},
		},
		{
			name: "--pure-lockfile",
			description: "Don't generate a lockfile",
		},
		{
			name: "--registry",
			description: "Override configuration registry",
			args: {
				name: "url",
			},
		},
		{
			name: ["-s", "--silent"],
			description:
				"Skip Yarn console logs, other types of logs (script output) will be printed",
		},
		{
			name: "--scripts-prepend-node-path",
			description: "Prepend the node executable dir to the PATH in scripts",
			args: {
				suggestions: [{ name: "true" }, { name: "false" }],
			},
		},
		{
			name: "--skip-integrity-check",
			description: "Run install without checking if node_modules is installed",
		},
		{
			name: "--strict-semver",
			description: "",
		},
		...commonOptions,
		{
			name: ["-v", "--version"],
			description: "Output the version number",
		},
		{
			name: ["-h", "--help"],
			description: "Output usage information",
		},
	],
	subcommands: [
		{
			name: "add",
			description: "Installs a package and any packages that it depends on",
			args: {
				name: "package",
				generators: npmSearchGenerator,
				debounce: true,
				isVariadic: true,
			},
			options: [
				...commonOptions,
				{
					name: ["-W", "--ignore-workspace-root-check"],
					description: "Required to run yarn add inside a workspace root",
				},
				{
					name: ["-D", "--dev"],
					description: "Save package to your `devDependencies`",
				},
				{
					name: ["-P", "--peer"],
					description: "Save package to your `peerDependencies`",
				},
				{
					name: ["-O", "--optional"],
					description: "Save package to your `optionalDependencies`",
				},
				{
					name: ["-E", "--exact"],
					description: "Install exact version",
					dependsOn: ["--latest"],
				},
				{
					name: ["-T", "--tilde"],
					description:
						"Install most recent release with the same minor version",
				},
				{
					name: ["-A", "--audit"],
					description: "Run vulnerability audit on installed packages",
				},
				{
					name: ["-h", "--help"],
					description: "Output usage information",
				},
			],
		},
		{
			name: "audit",
			description:
				"Perform a vulnerability audit against the installed packages",
			options: [
				{
					name: "--summary",
					description: "Only print the summary",
				},
				{
					name: "--groups",
					description:
						"Only audit dependencies from listed groups. Default: devDependencies, dependencies, optionalDependencies",
					args: {
						name: "group_name",
						isVariadic: true,
					},
				},
				{
					name: "--level",
					description:
						"Only print advisories with severity greater than or equal to one of the following: info|low|moderate|high|critical. Default: info",
					args: {
						name: "severity",
						suggestions: [
							{ name: "info" },
							{ name: "low" },
							{ name: "moderate" },
							{ name: "high" },
							{ name: "critical" },
						],
					},
				},
				{
					name: ["-h", "--help"],
					description: "Output usage information",
				},
			],
		},
		{
			name: "autoclean",
			description:
				"Cleans and removes unnecessary files from package dependencies",
			options: [
				{
					name: ["-h", "--help"],
					description: "Output usage information",
				},
				{
					name: ["-i", "--init"],
					description:
						"Creates the .yarnclean file if it does not exist, and adds the default entries",
				},
				{
					name: ["-f", "--force"],
					description: "If a .yarnclean file exists, run the clean process",
				},
			],
		},
		{
			name: "bin",
			description: "Displays the location of the yarn bin folder",
			options: [
				{
					name: ["-h", "--help"],
					description: "Output usage information",
				},
			],
		},
		{
			name: "cache",
			description: "Yarn cache list will print out every cached package",
			options: [
				...commonOptions,
				{
					name: ["-h", "--help"],
					description: "Output usage information",
				},
			],
			subcommands: [
				{
					name: "clean",
					description: "Clear global cache",
				},
				{
					name: "dir",
					description: "Print yarn’s global cache path",
				},
				{
					name: "list",
					description: "Print out every cached package",
					options: [
						{
							name: "--pattern",
							description: "Filter cached packages by pattern",
							args: {
								name: "pattern",
							},
						},
					],
				},
			],
		},
		{
			name: "config",
			description: "Configure yarn",
			options: [
				{
					name: ["-h", "--help"],
					description: "Output usage information",
				},
			],
			subcommands: [
				{
					name: "set",
					description: "Sets the config key to a certain value",
					options: [
						{
							name: ["-g", "--global"],
							description: "Set global config",
						},
					],
				},
				{
					name: "get",
					description: "Print the value for a given key",
					args: {
						generators: configList,
					},
				},
				{
					name: "delete",
					description: "Deletes a given key from the config",
					args: {
						generators: configList,
					},
				},
				{
					name: "list",
					description: "Displays the current configuration",
				},
			],
		},
		{
			name: "create",
			description: "Creates new projects from any create-* starter kits",
			args: {
				name: "cli",
				generators: createCLIsGenerator,
				loadSpec: async (token) => ({
					name: "create-" + token,
					type: "global",
				}),
				isCommand: true,
			},
			options: [
				...commonOptions,
				{
					name: ["-h", "--help"],
					description: "Output usage information",
				},
			],
		},
		{
			name: "exec",
			description: "",
			options: [
				{
					name: ["-h", "--help"],
					description: "Output usage information",
				},
			],
		},
		{
			name: "generate-lock-entry",
			description: "Generates a lock file entry",
			options: [
				{
					name: "--use-manifest",
					description:
						"Specify which manifest file to use for generating lock entry",
					args: {
						template: "filepaths",
					},
				},
				{
					name: "--resolved",
					description: "Generate from <*.tgz>#<hash>",
					args: {
						template: "filepaths",
					},
				},
				{
					name: ["-h", "--help"],
					description: "Output usage information",
				},
			],
		},
		{
			name: "global",
			description: "Manage yarn globally",
			subcommands: [
				{
					name: "add",
					description: "Install globally packages on your operating system",
					args: {
						name: "package",
						generators: npmSearchGenerator,
						debounce: true,
						isVariadic: true,
					},
				},
				{
					name: "bin",
					description: "Displays the location of the yarn global bin folder",
				},
				{
					name: "dir",
					description:
						"Displays the location of the global installation folder",
				},
				{
					name: "ls",
					description: "List globally installed packages (deprecated)",
				},
				{
					name: "list",
					description: "List globally installed packages",
				},
				{
					name: "remove",
					description: "Remove globally installed packages",
					args: {
						name: "package",
						filterStrategy: "fuzzy",
						generators: getGlobalPackagesGenerator,
						isVariadic: true,
					},
					options: [
						...commonOptions,
						{
							name: ["-W", "--ignore-workspace-root-check"],
							description:
								"Required to run yarn remove inside a workspace root",
						},
						{
							name: ["-h", "--help"],
							description: "Output usage information",
						},
					],
				},
				{
					name: "upgrade",
					description: "Upgrade globally installed packages",
					options: [
						...commonOptions,
						{
							name: ["-S", "--scope"],
							description: "Upgrade packages under the specified scope",
							args: { name: "scope" },
						},
						{
							name: ["-L", "--latest"],
							description: "List the latest version of packages",
						},
						{
							name: ["-E", "--exact"],
							description:
								"Install exact version. Only used when --latest is specified",
							dependsOn: ["--latest"],
						},
						{
							name: ["-P", "--pattern"],
							description: "Upgrade packages that match pattern",
							args: { name: "pattern" },
						},
						{
							name: ["-T", "--tilde"],
							description:
								"Install most recent release with the same minor version. Only used when --latest is specified",
						},
						{
							name: ["-C", "--caret"],
							description:
								"Install most recent release with the same major version. Only used when --latest is specified",
							dependsOn: ["--latest"],
						},
						{
							name: ["-A", "--audit"],
							description: "Run vulnerability audit on installed packages",
						},
						{ name: ["-h", "--help"], description: "Output usage information" },
					],
				},
				{
					name: "upgrade-interactive",
					description:
						"Display the outdated packages before performing any upgrade",
					options: [
						{
							name: "--latest",
							description: "Use the version tagged latest in the registry",
						},
					],
				},
			],
			options: [
				...commonOptions,
				{
					name: "--prefix",
					description: "Bin prefix to use to install binaries",
					args: {
						name: "prefix",
					},
				},
				{
					name: "--latest",
					description: "Bin prefix to use to install binaries",
				},
				{
					name: ["-h", "--help"],
					description: "Output usage information",
				},
			],
		},
		{
			name: "help",
			description: "Output usage information",
		},
		{
			name: "import",
			description: "Generates yarn.lock from an npm package-lock.json file",
		},
		{
			name: "info",
			description: "Show information about a package",
		},
		{
			name: "init",
			description: "Interactively creates or updates a package.json file",
			options: [
				...commonOptions,
				{
					name: ["-y", "--yes"],
					description: "Use default options",
				},
				{
					name: ["-p", "--private"],
					description: "Use default options and private true",
				},
				{
					name: ["-i", "--install"],
					description: "Install a specific Yarn release",
					args: {
						name: "version",
					},
				},
				{
					name: "-2",
					description: "Generates the project using Yarn 2",
				},
				{
					name: ["-h", "--help"],
					description: "Output usage information",
				},
			],
		},
		{
			name: "install",
			description: "Install all the dependencies listed within package.json",
			options: [
				...commonOptions,
				{
					name: ["-A", "--audit"],
					description: "Run vulnerability audit on installed packages",
				},
				{
					name: ["-h", "--help"],
					description: "Output usage information",
				},
			],
		},
		{
			name: "licenses",
			description: "",
			subcommands: [
				{
					name: "list",
					description: "List licenses for installed packages",
				},
				{
					name: "generate-disclaimer",
					description: "List of licenses from all the packages",
				},
			],
		},
		{
			name: "link",
			description: "Symlink a package folder during development",
			args: {
				isOptional: true,
				name: "package",
			},
			options: [
				...commonOptions,
				{
					name: ["-h", "--help"],
					description: "Output usage information",
				},
			],
		},
		{
			name: "list",
			description: "Lists all dependencies for the current working directory",
			options: [
				{
					name: "--depth",
					description: "Restrict the depth of the dependencies",
				},
				{
					name: "--pattern",
					description: "Filter the list of dependencies by the pattern",
				},
			],
		},
		{
			name: "login",
			description: "Store registry username and email",
		},
		{
			name: "logout",
			description: "Clear registry username and email",
		},
		{
			name: "node",
			description: "",
		},
		{
			name: "outdated",
			description: "Checks for outdated package dependencies",
			options: [
				...commonOptions,
				{
					name: ["-h", "--help"],
					description: "Output usage information",
				},
			],
		},
		{
			name: "owner",
			description: "Manage package owners",
			subcommands: [
				{
					name: "list",
					description: "Lists all of the owners of a package",
					args: {
						name: "package",
					},
				},
				{
					name: "add",
					description: "Adds the user as an owner of the package",
					args: {
						name: "package",
					},
				},
				{
					name: "remove",
					description: "Removes the user as an owner of the package",
					args: [
						{
							name: "user",
						},
						{
							name: "package",
						},
					],
				},
			],
		},
		{
			name: "pack",
			description: "Creates a compressed gzip archive of package dependencies",
			options: [
				{
					name: "--filename",
					description:
						"Creates a compressed gzip archive of package dependencies and names the file filename",
				},
			],
		},
		{
			name: "policies",
			description: "Defines project-wide policies for your project",
			subcommands: [
				{
					name: "set-version",
					description: "Will download the latest stable release",
					options: [
						{
							name: "--rc",
							description: "Download the latest rc release",
						},
					],
				},
			],
		},
		{
			name: "publish",
			description: "Publishes a package to the npm registry",
			args: { name: "Tarball or Folder", template: "folders" },
			options: [
				...commonOptions,
				{ name: ["-h", "--help"], description: "Output usage information" },
				{
					name: "--major",
					description: "Auto-increment major version number",
				},
				{
					name: "--minor",
					description: "Auto-increment minor version number",
				},
				{
					name: "--patch",
					description: "Auto-increment patch version number",
				},
				{
					name: "--premajor",
					description: "Auto-increment premajor version number",
				},
				{
					name: "--preminor",
					description: "Auto-increment preminor version number",
				},
				{
					name: "--prepatch",
					description: "Auto-increment prepatch version number",
				},
				{
					name: "--prerelease",
					description: "Auto-increment prerelease version number",
				},
				{
					name: "--preid",
					description: "Add a custom identifier to the prerelease",
					args: { name: "preid" },
				},
				{
					name: "--message",
					description: "Message",
					args: { name: "message" },
				},
				{ name: "--no-git-tag-version", description: "No git tag version" },
				{
					name: "--no-commit-hooks",
					description: "Bypass git hooks when committing new version",
				},
				{ name: "--access", description: "Access", args: { name: "access" } },
				{ name: "--tag", description: "Tag", args: { name: "tag" } },
			],
		},
		{
			name: "remove",
			description: "Remove installed package",
			args: {
				filterStrategy: "fuzzy",
				generators: dependenciesGenerator,
				isVariadic: true,
			},
			options: [
				...commonOptions,
				{
					name: ["-W", "--ignore-workspace-root-check"],
					description: "Required to run yarn remove inside a workspace root",
				},
				{
					name: ["-h", "--help"],
					description: "Output usage information",
				},
			],
		},
		{
			name: "run",
			description: "Runs a defined package script",
			options: [
				...commonOptions,
				{ name: ["-h", "--help"], description: "Output usage information" },
			],
			args: [
				{
					name: "script",
					description: "Script to run from your package.json",
					generators: npmScriptsGenerator,
					filterStrategy: "fuzzy",
					parserDirectives: yarnScriptParserDirectives,
					isCommand: true,
				},
				{
					name: "env",
					suggestions: ["env"],
					description: "Lists environment variables available to scripts",
					isOptional: true,
				},
			],
		},
		{
			name: "tag",
			description: "Add, remove, or list tags on a package",
		},
		{
			name: "team",
			description: "Maintain team memberships",
			subcommands: [
				{
					name: "create",
					description: "Create a new team",
					args: {
						name: "<scope:team>",
					},
				},
				{
					name: "destroy",
					description: "Destroys an existing team",
					args: {
						name: "<scope:team>",
					},
				},
				{
					name: "add",
					description: "Add a user to an existing team",
					args: [
						{
							name: "<scope:team>",
						},
						{
							name: "<user>",
						},
					],
				},
				{
					name: "remove",
					description: "Remove a user from a team they belong to",
					args: {
						name: "<scope:team> <user>",
					},
				},
				{
					name: "list",
					description:
						"If performed on an organization name, will return a list of existing teams under that organization. If performed on a team, it will instead return a list of all users belonging to that particular team",
					args: {
						name: "<scope>|<scope:team>",
					},
				},
			],
		},
		{
			name: "unlink",
			description: "Unlink a previously created symlink for a package",
		},
		{
			name: "unplug",
			description: "",
		},
		{
			name: "upgrade",
			description:
				"Upgrades packages to their latest version based on the specified range",
			args: {
				name: "package",
				generators: dependenciesGenerator,
				filterStrategy: "fuzzy",
				isVariadic: true,
				isOptional: true,
			},
			options: [
				...commonOptions,
				{
					name: ["-S", "--scope"],
					description: "Upgrade packages under the specified scope",
					args: { name: "scope" },
				},
				{
					name: ["-L", "--latest"],
					description: "List the latest version of packages",
				},
				{
					name: ["-E", "--exact"],
					description:
						"Install exact version. Only used when --latest is specified",
					dependsOn: ["--latest"],
				},
				{
					name: ["-P", "--pattern"],
					description: "Upgrade packages that match pattern",
					args: { name: "pattern" },
				},
				{
					name: ["-T", "--tilde"],
					description:
						"Install most recent release with the same minor version. Only used when --latest is specified",
				},
				{
					name: ["-C", "--caret"],
					description:
						"Install most recent release with the same major version. Only used when --latest is specified",
					dependsOn: ["--latest"],
				},
				{
					name: ["-A", "--audit"],
					description: "Run vulnerability audit on installed packages",
				},
				{ name: ["-h", "--help"], description: "Output usage information" },
			],
		},
		{
			name: "upgrade-interactive",
			description: "Upgrades packages in interactive mode",
			options: [
				{
					name: "--latest",
					description: "Use the version tagged latest in the registry",
				},
			],
		},
		{
			name: "version",
			description: "Update version of your package",
			options: [
				...commonOptions,
				{ name: ["-h", "--help"], description: "Output usage information" },
				{
					name: "--new-version",
					description: "New version",
					args: { name: "version" },
				},
				{
					name: "--major",
					description: "Auto-increment major version number",
				},
				{
					name: "--minor",
					description: "Auto-increment minor version number",
				},
				{
					name: "--patch",
					description: "Auto-increment patch version number",
				},
				{
					name: "--premajor",
					description: "Auto-increment premajor version number",
				},
				{
					name: "--preminor",
					description: "Auto-increment preminor version number",
				},
				{
					name: "--prepatch",
					description: "Auto-increment prepatch version number",
				},
				{
					name: "--prerelease",
					description: "Auto-increment prerelease version number",
				},
				{
					name: "--preid",
					description: "Add a custom identifier to the prerelease",
					args: { name: "preid" },
				},
				{
					name: "--message",
					description: "Message",
					args: { name: "message" },
				},
				{ name: "--no-git-tag-version", description: "No git tag version" },
				{
					name: "--no-commit-hooks",
					description: "Bypass git hooks when committing new version",
				},
				{ name: "--access", description: "Access", args: { name: "access" } },
				{ name: "--tag", description: "Tag", args: { name: "tag" } },
			],
		},
		{
			name: "versions",
			description:
				"Displays version information of the currently installed Yarn, Node.js, and its dependencies",
		},
		{
			name: "why",
			description: "Show information about why a package is installed",
			args: {
				name: "package",
				filterStrategy: "fuzzy",
				generators: allDependenciesGenerator,
			},
			options: [
				...commonOptions,
				{
					name: ["-h", "--help"],
					description: "Output usage information",
				},
				{
					name: "--peers",
					description:
						"Print the peer dependencies that match the specified name",
				},
				{
					name: ["-R", "--recursive"],
					description:
						"List, for each workspace, what are all the paths that lead to the dependency",
				},
			],
		},
		{
			name: "workspace",
			description: "Manage workspace",
			filterStrategy: "fuzzy",
			generateSpec: async (_tokens, executeShellCommand) => {
				const version = (
					await executeShellCommand({
						command: "yarn",
						// eslint-disable-next-line @withfig/fig-linter/no-useless-arrays
						args: ["--version"],
					})
				).stdout;
				const isYarnV1 = version.startsWith("1.");

				const getWorkspacesDefinitionsV1 = async () => {
					const { stdout } = await executeShellCommand({
						command: "yarn",
						args: ["workspaces", "info"],
					});

					const startJson = stdout.indexOf("{");
					const endJson = stdout.lastIndexOf("}");

					return Object.entries(
						JSON.parse(stdout.slice(startJson, endJson + 1)) as Record<
							string,
							{ location: string }
						>
					).map(([name, { location }]) => ({
						name,
						location,
					}));
				};

				// For yarn >= 2.0.0
				const getWorkspacesDefinitionsVOther = async () => {
					// yarn workspaces list --json
					const out = (
						await executeShellCommand({
							command: "yarn",
							args: ["workspaces", "list", "--json"],
						})
					).stdout;
					return out.split("\n").map((line) => JSON.parse(line.trim()));
				};

				try {
					const workspacesDefinitions = isYarnV1
						? // transform Yarn V1 output to array of workspaces like Yarn V2
							await getWorkspacesDefinitionsV1()
						: // in yarn v>=2.0.0, workspaces definitions are a list of JSON lines
							await getWorkspacesDefinitionsVOther();

					const subcommands: Fig.Subcommand[] = workspacesDefinitions.map(
						({ name, location }: { name: string; location: string }) => ({
							name,
							description: "Workspaces",
							args: {
								name: "script",
								generators: {
									cache: {
										strategy: "stale-while-revalidate",
										ttl: 60_000, // 60s
									},
									script: ["cat", `${location}/package.json`],
									postProcess: function (out: string) {
										if (out.trim() == "") {
											return [];
										}
										try {
											const packageContent = JSON.parse(out);
											const scripts = packageContent["scripts"];
											if (scripts) {
												return Object.keys(scripts).map((script) => ({
													name: script,
												}));
											}
										} catch (e) {}
										return [];
									},
								},
							},
						})
					);

					return {
						name: "workspace",
						subcommands,
					};
				} catch (e) {
					console.error(e);
				}
				return { name: "workspaces" };
			},
		},
		{
			name: "workspaces",
			description: "Show information about your workspaces",
			options: [
				{
					name: "subcommand",
					description: "",
					args: {
						suggestions: [{ name: "info" }, { name: "run" }],
					},
				},
				{
					name: "flags",
					description: "",
				},
			],
		},
		{
			name: "set",
			description: "Set global Yarn options",
			subcommands: [
				{
					name: "resolution",
					description: "Enforce a package resolution",
					args: [
						{
							name: "descriptor",
							description:
								"A descriptor for the package, in the form of 'lodash@npm:^1.2.3'",
						},
						{
							name: "resolution",
							description: "The version of the package to resolve",
						},
					],
					options: [
						{
							name: ["-s", "--save"],
							description:
								"Persist the resolution inside the top-level manifest",
						},
					],
				},
				{
					name: "version",
					description: "Lock the Yarn version used by the project",
					args: {
						name: "version",
						description:
							"Use the specified version, which can also be a Yarn 2 build (e.g 2.0.0-rc.30) or a Yarn 1 build (e.g 1.22.1)",
						template: "filepaths",
						suggestions: [
							{
								name: "from-sources",
								insertValue: "from sources",
							},
							"latest",
							"canary",
							"classic",
							"self",
						],
					},
					options: [
						{
							name: "--only-if-needed",
							description:
								"Only lock the Yarn version if it isn't already locked",
						},
					],
				},
			],
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/yo.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/yo.ts

```typescript
function toTitleCase(str: string): string {
	return str
		.trim()
		.replace(
			/\w\S*/g,
			(txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
		);
}

const suggestions: Fig.Suggestion[] = [
	{
		name: "doctor",
		description: "Running sanity checks on your system",
		icon: "fig://icon?type=alert",
	},
	{
		name: "completion",
		description: "To enable shell completion for the yo command",
		icon: "fig://icon?type=asterisk",
	},
];

// GENERATORS
const yeomanGeneratorList: Fig.Generator = {
	script: ["yo", "--generators"],
	postProcess: function (out) {
		try {
			return out
				.split("\n")
				.filter((item) => item.trim() && item !== "Available Generators:")
				.map(
					(item) =>
						({
							name: item.trim(),
							icon: undefined,
							displayName: toTitleCase(item),
							description: `${toTitleCase(item)} Generator`,
							priority: 100,
							options: [
								{
									name: "--help",
									description: `Help of "${toTitleCase(item)}" generator`,
								},
							],
						}) as Fig.Suggestion
				) as Fig.Suggestion[];
		} catch (e) {
			console.error(e);
			return [];
		}
	},
};

const completionSpec: Fig.Spec = {
	name: "yo",
	description: "Yeoman generator",
	args: {
		name: "generator",
		generators: yeomanGeneratorList,
		suggestions: [...suggestions],
		isCommand: true,
		isOptional: true,
	},
	options: [
		{
			name: "--help",
			description: "Print info and generator's options and usage",
		},
		{
			name: ["-f", "--force"],
			description: "Overwrite files that already exist",
			isDangerous: true,
		},
		{
			name: "--version",
			description: "Print version",
		},
		{
			name: "--no-color",
			description: "Disable color",
		},
		{
			name: "--insight",
			description: "Enable anonymous tracking",
		},
		{
			name: "--no-insight",
			description: "Disable anonymous tracking",
		},
		{
			name: "--generators",
			description: "Print available generators",
		},
		{
			name: "--local-only",
			description: "Disable lookup of globally-installed generators",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/zip.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/zip.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "zip",
	description: "Package and compress (archive) files into zip file",
	args: [
		{
			name: "name",
			description: "Name of archive",
		},
		{
			name: "dir",
			template: "folders",
		},
	],
	options: [
		{
			name: "-r",
			description:
				"Package and compress a directory and its contents, recursively",
		},
		{
			name: "-e",
		},
		{
			name: "-s",
			args: {
				name: "split size",
			},
		},
		{
			name: "-d",
			args: {
				name: "file",
				template: "filepaths",
			},
		},
		{
			name: "-9",
			description:
				"Archive a directory and its contents with the highest level [9] of compression",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/env/pathExecutableCache.ts]---
Location: vscode-main/extensions/terminal-suggest/src/env/pathExecutableCache.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs/promises';
import * as vscode from 'vscode';
import { isExecutable, WindowsExecutableExtensionsCache } from '../helpers/executable';
import { osIsWindows } from '../helpers/os';
import type { ICompletionResource } from '../types';
import { getFriendlyResourcePath } from '../helpers/uri';
import { SettingsIds } from '../constants';
import { TerminalShellType } from '../terminalSuggestMain';

const isWindows = osIsWindows();

export interface IExecutablesInPath {
	completionResources: Set<ICompletionResource> | undefined;
	labels: Set<string> | undefined;
}

export class PathExecutableCache implements vscode.Disposable {
	private _disposables: vscode.Disposable[] = [];

	private readonly _windowsExecutableExtensionsCache: WindowsExecutableExtensionsCache | undefined;
	private _cachedExes: Map<string, Set<ICompletionResource> | undefined> = new Map();

	private _inProgressRequest: {
		env: ITerminalEnvironment;
		shellType: TerminalShellType | undefined;
		promise: Promise<IExecutablesInPath | undefined>;
	} | undefined;

	constructor() {
		if (isWindows) {
			this._windowsExecutableExtensionsCache = new WindowsExecutableExtensionsCache(this._getConfiguredWindowsExecutableExtensions());
			this._disposables.push(vscode.workspace.onDidChangeConfiguration(e => {
				if (e.affectsConfiguration(SettingsIds.CachedWindowsExecutableExtensions)) {
					this._windowsExecutableExtensionsCache?.update(this._getConfiguredWindowsExecutableExtensions());
					this._cachedExes.clear();
				}
			}));
		}
	}

	dispose() {
		for (const d of this._disposables) {
			d.dispose();
		}
	}

	refresh(directory?: string): void {
		if (directory) {
			this._cachedExes.delete(directory);
		} else {
			this._cachedExes.clear();
		}
	}

	async getExecutablesInPath(env: ITerminalEnvironment = process.env, shellType?: TerminalShellType): Promise<IExecutablesInPath | undefined> {
		if (this._inProgressRequest &&
			this._inProgressRequest.env === env &&
			this._inProgressRequest.shellType === shellType
		) {
			return this._inProgressRequest.promise;
		}

		const promise = this._doGetExecutablesInPath(env, shellType);

		this._inProgressRequest = {
			env,
			shellType,
			promise,
		};

		await promise;
		this._inProgressRequest = undefined;

		return promise;
	}

	private async _doGetExecutablesInPath(env: ITerminalEnvironment, shellType?: TerminalShellType): Promise<IExecutablesInPath | undefined> {
		// Create cache key
		let pathValue: string | undefined;
		if (shellType === TerminalShellType.GitBash) {
			// TODO: figure out why shellIntegration.env.PATH
			// regressed from using \ to / (correct)
			pathValue = process.env.PATH;
		} else if (isWindows) {
			const caseSensitivePathKey = Object.keys(env).find(key => key.toLowerCase() === 'path');
			if (caseSensitivePathKey) {
				pathValue = env[caseSensitivePathKey];
			}
		} else {
			pathValue = env.PATH;
		}
		if (pathValue === undefined) {
			return;
		}

		// Extract executables from PATH
		const paths = pathValue.split(isWindows ? ';' : ':');
		const pathSeparator = isWindows ? '\\' : '/';
		const promisePaths: string[] = [];
		const promises: Promise<Set<ICompletionResource> | undefined>[] = [];
		const labels: Set<string> = new Set<string>();

		for (const pathDir of paths) {
			// Check if this directory is already cached
			const cachedExecutables = this._cachedExes.get(pathDir);
			if (cachedExecutables) {
				for (const executable of cachedExecutables) {
					const labelText = typeof executable.label === 'string' ? executable.label : executable.label.label;
					labels.add(labelText);
				}
			} else {
				// Not cached, need to scan this directory
				promisePaths.push(pathDir);
				promises.push(this._getExecutablesInSinglePath(pathDir, pathSeparator, labels));
			}
		}

		// Process uncached directories
		if (promises.length > 0) {
			const resultSets = await Promise.all(promises);
			for (const [i, resultSet] of resultSets.entries()) {
				const pathDir = promisePaths[i];
				if (!this._cachedExes.has(pathDir)) {
					this._cachedExes.set(pathDir, resultSet || new Set());
				}
			}
		}

		// Merge all results from all directories
		const executables = new Set<ICompletionResource>();
		const processedPaths: Set<string> = new Set();
		for (const pathDir of paths) {
			if (processedPaths.has(pathDir)) {
				continue;
			}
			processedPaths.add(pathDir);
			const dirExecutables = this._cachedExes.get(pathDir);
			if (dirExecutables) {
				for (const executable of dirExecutables) {
					executables.add(executable);
				}
			}
		}

		return { completionResources: executables, labels };
	}

	private async _getExecutablesInSinglePath(path: string, pathSeparator: string, labels: Set<string>): Promise<Set<ICompletionResource> | undefined> {
		try {
			const dirExists = await fs.stat(path).then(stat => stat.isDirectory()).catch(() => false);
			if (!dirExists) {
				return undefined;
			}
			const result = new Set<ICompletionResource>();
			const fileResource = vscode.Uri.file(path);
			const files = await vscode.workspace.fs.readDirectory(fileResource);
			const windowsExecutableExtensions = this._windowsExecutableExtensionsCache?.getExtensions();
			await Promise.all(
				files.map(([file, fileType]) => (async () => {
					let kind: vscode.TerminalCompletionItemKind | undefined;
					let formattedPath: string | undefined;
					const resource = vscode.Uri.joinPath(fileResource, file);

					// Skip unknown or directory file types early
					if (fileType === vscode.FileType.Unknown || fileType === vscode.FileType.Directory) {
						return;
					}

					try {
						const lstat = await fs.lstat(resource.fsPath);
						if (lstat.isSymbolicLink()) {
							try {
								const symlinkRealPath = await fs.realpath(resource.fsPath);
								const isExec = await isExecutable(symlinkRealPath, windowsExecutableExtensions);
								if (!isExec) {
									return;
								}
								kind = vscode.TerminalCompletionItemKind.Method;
								formattedPath = `${resource.fsPath} -> ${symlinkRealPath}`;
							} catch {
								return;
							}
						}
					} catch {
						// Ignore errors for unreadable files
						return;
					}

					formattedPath = formattedPath ?? getFriendlyResourcePath(resource, pathSeparator);

					// Check if already added or not executable
					if (labels.has(file)) {
						return;
					}

					const isExec = kind === vscode.TerminalCompletionItemKind.Method || await isExecutable(resource.fsPath, windowsExecutableExtensions);
					if (!isExec) {
						return;
					}

					result.add({
						label: file,
						documentation: formattedPath,
						kind: kind ?? vscode.TerminalCompletionItemKind.Method
					});
					labels.add(file);
				})())
			);
			return result;
		} catch (e) {
			// Ignore errors for directories that can't be read
			return undefined;
		}
	}

	private _getConfiguredWindowsExecutableExtensions(): { [key: string]: boolean | undefined } | undefined {
		return vscode.workspace.getConfiguration(SettingsIds.SuggestPrefix).get(SettingsIds.CachedWindowsExecutableExtensionsSuffixOnly);
	}
}

export type ITerminalEnvironment = { [key: string]: string | undefined };
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/execute.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/execute.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { osIsWindows } from '../helpers/os';
import { spawnHelper2 } from '../shell/common';
import { withTimeout } from './shared/utils';

export const cleanOutput = (output: string) =>
	output
		.replace(/\r\n/g, '\n') // Replace carriage returns with just a normal return
		.replace(/\x1b\[\?25h/g, '') // removes cursor character if present
		.replace(/^\n+/, '') // strips new lines from start of output
		.replace(/\n+$/, ''); // strips new lines from end of output

export const executeCommandTimeout = async (
	fallbacks: {
		cwd: string;
		env: Record<string, string | undefined>;
	},
	input: Fig.ExecuteCommandInput,
	timeout = osIsWindows() ? 20000 : 5000,
): Promise<Fig.ExecuteCommandOutput> => {
	const command = [input.command, ...input.args].join(' ');
	try {
		console.debug(`About to run shell command '${command}'`);
		const result = await withTimeout(
			Math.max(timeout, input.timeout ?? 0),
			spawnHelper2(input.command, input.args, {
				env: input.env ?? fallbacks.env,
				cwd: input.cwd ?? fallbacks.cwd,
				timeout: input.timeout,
			})
		);

		const cleanStdout = cleanOutput(result.stdout);
		const cleanStderr = cleanOutput(result.stderr);

		if (result.exitCode !== 0) {
			console.warn(
				`Command ${command} exited with exit code ${result.exitCode}: ${cleanStderr}`,
			);
		}
		return {
			status: result.exitCode,
			stdout: cleanStdout,
			stderr: cleanStderr,
		};
	} catch (err) {
		console.error(`Error running shell command '${command}'`, { err });
		throw err;
	}
};


export const executeCommand: (
	fallbacks: {
		cwd: string;
		env: Record<string, string | undefined>;
	},
	args: Fig.ExecuteCommandInput
) => Promise<Fig.ExecuteCommandOutput> = (fallbacks, args) => executeCommandTimeout(fallbacks, args);

export interface IFigExecuteExternals {
	executeCommand: Fig.ExecuteCommandFunction;
	executeCommandTimeout: (
		input: Fig.ExecuteCommandInput,
		timeout: number,
	) => Promise<Fig.ExecuteCommandOutput>;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/figInterface.ts]---
Location: vscode-main/extensions/terminal-suggest/src/fig/figInterface.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { ArgumentParserResult, parseArguments } from './autocomplete-parser/parseArguments';
import type { FigState } from './autocomplete/fig/hooks';
import { createGeneratorState } from './autocomplete/state/generators';
import { Visibility, type AutocompleteState } from './autocomplete/state/types';
import { SuggestionFlag } from './shared/utils';
import { getCommand, type Command } from './shell-parser/command';
import { createCompletionItem } from '../helpers/completionItem';
import { TokenType } from '../tokens';
import type { ICompletionResource } from '../types';
import { osIsWindows } from '../helpers/os';
import { removeAnyFileExtension } from '../helpers/file';
import type { EnvironmentVariable } from './api-bindings/types';
import { asArray, availableSpecs } from '../terminalSuggestMain';
import { IFigExecuteExternals } from './execute';

export interface IFigSpecSuggestionsResult {
	showFiles: boolean;
	showFolders: boolean;
	fileExtensions?: string[];
	hasCurrentArg: boolean;
	items: vscode.TerminalCompletionItem[];
}

export async function getFigSuggestions(
	specs: Fig.Spec[],
	terminalContext: { commandLine: string; cursorIndex: number },
	availableCommands: ICompletionResource[],
	currentCommandAndArgString: string,
	tokenType: TokenType,
	shellIntegrationCwd: vscode.Uri | undefined,
	env: Record<string, string>,
	name: string,
	executeExternals: IFigExecuteExternals,
	token?: vscode.CancellationToken,
): Promise<IFigSpecSuggestionsResult> {
	const result: IFigSpecSuggestionsResult = {
		showFiles: false,
		showFolders: false,
		hasCurrentArg: false,
		items: [],
	};
	const currentCommand = currentCommandAndArgString.split(' ')[0];

	// Assemble a map to allow O(1) access to the available command from a spec
	// label. The label does not include an extension on Windows.
	const specLabelToAvailableCommandMap = new Map<string, ICompletionResource>();
	for (const command of availableCommands) {
		let label = typeof command.label === 'string' ? command.label : command.label.label;
		if (osIsWindows()) {
			label = removeAnyFileExtension(label);
		}
		specLabelToAvailableCommandMap.set(label, command);
	}

	for (const spec of specs) {
		const specLabels = getFigSuggestionLabel(spec);

		if (!specLabels) {
			continue;
		}
		for (const specLabel of specLabels) {
			const availableCommand = specLabelToAvailableCommandMap.get(specLabel);
			if (!availableCommand || (token && token.isCancellationRequested)) {
				continue;
			}

			// push it to the completion items
			if (tokenType === TokenType.Command) {
				if (availableCommand.kind !== vscode.TerminalCompletionItemKind.Alias) {
					const description = getFixSuggestionDescription(spec);
					result.items.push(createCompletionItem(
						terminalContext.cursorIndex,
						currentCommandAndArgString,
						{
							label: { label: specLabel, description },
							kind: vscode.TerminalCompletionItemKind.Method
						},
						description,
						availableCommand.detail
					));
				}
				continue;
			}

			const commandAndAliases = (osIsWindows()
				? availableCommands.filter(command => specLabel === removeAnyFileExtension(command.definitionCommand ?? (typeof command.label === 'string' ? command.label : command.label.label)))
				: availableCommands.filter(command => specLabel === (command.definitionCommand ?? (typeof command.label === 'string' ? command.label : command.label.label))));
			if (
				!(osIsWindows()
					? commandAndAliases.some(e => currentCommand === (removeAnyFileExtension((typeof e.label === 'string' ? e.label : e.label.label))))
					: commandAndAliases.some(e => currentCommand === (typeof e.label === 'string' ? e.label : e.label.label)))
			) {
				continue;
			}

			const actualSpec = availableCommand.definitionCommand ? availableSpecs.find(s => s.name === availableCommand.definitionCommand) : spec;
			if (!actualSpec) {
				continue;
			}
			const completionItemResult = await getFigSpecSuggestions(actualSpec, terminalContext, currentCommandAndArgString, shellIntegrationCwd, env, name, executeExternals, token);
			result.hasCurrentArg ||= !!completionItemResult?.hasCurrentArg;
			if (completionItemResult) {
				result.showFiles ||= completionItemResult.showFiles;
				result.showFolders ||= completionItemResult.showFolders;
				result.fileExtensions ||= completionItemResult.fileExtensions;
				if (completionItemResult.items) {
					result.items = result.items.concat(completionItemResult.items);
				}
			}
		}
	}
	return result;
}

async function getFigSpecSuggestions(
	spec: Fig.Spec,
	terminalContext: { commandLine: string; cursorIndex: number },
	prefix: string,
	shellIntegrationCwd: vscode.Uri | undefined,
	env: Record<string, string>,
	name: string,
	executeExternals: IFigExecuteExternals,
	token?: vscode.CancellationToken,
): Promise<IFigSpecSuggestionsResult | undefined> {
	let showFiles = false;
	let showFolders = false;
	let fileExtensions: string[] | undefined;

	const command = getCommand(terminalContext.commandLine, {}, terminalContext.cursorIndex);
	if (!command || !shellIntegrationCwd) {
		return;
	}
	const shellContext: Fig.ShellContext = {
		environmentVariables: env,
		currentWorkingDirectory: shellIntegrationCwd.fsPath,
		sshPrefix: '',
		currentProcess: name,
		// TODO: pass in aliases
	};
	const parsedArguments: ArgumentParserResult = await parseArguments(command, shellContext, spec, executeExternals);

	const items: vscode.TerminalCompletionItem[] = [];
	// TODO: Pass in and respect cancellation token
	const completionItemResult = await collectCompletionItemResult(command, parsedArguments, prefix, terminalContext, shellIntegrationCwd, env, items, executeExternals);
	if (token?.isCancellationRequested) {
		return undefined;
	}

	if (completionItemResult) {
		showFiles = completionItemResult.showFiles;
		showFolders = completionItemResult.showFolders;
		fileExtensions = completionItemResult.fileExtensions;
	}

	return {
		showFiles: showFiles,
		showFolders: showFolders,
		fileExtensions,
		hasCurrentArg: !!parsedArguments.currentArg,
		items,
	};
}

export type SpecArg = Fig.Arg | Fig.Suggestion | Fig.Option | string;

export async function collectCompletionItemResult(
	command: Command,
	parsedArguments: ArgumentParserResult,
	prefix: string,
	terminalContext: { commandLine: string; cursorIndex: number },
	shellIntegrationCwd: vscode.Uri | undefined,
	env: Record<string, string>,
	items: vscode.TerminalCompletionItem[],
	executeExternals: IFigExecuteExternals
): Promise<{ showFiles: boolean; showFolders: boolean; fileExtensions: string[] | undefined } | undefined> {
	let showFiles = false;
	let showFolders = false;
	let fileExtensions: string[] | undefined;

	const addSuggestions = async (specArgs: SpecArg[] | Record<string, SpecArg> | undefined, kind: vscode.TerminalCompletionItemKind, parsedArguments?: ArgumentParserResult) => {
		if (kind === vscode.TerminalCompletionItemKind.Argument && parsedArguments?.currentArg?.generators) {
			const generators = parsedArguments.currentArg.generators;
			const initialFigState: FigState = {
				buffer: terminalContext.commandLine,
				cursorLocation: terminalContext.cursorIndex,
				cwd: shellIntegrationCwd?.fsPath ?? null,
				processUserIsIn: null,
				sshContextString: null,
				aliases: {},
				environmentVariables: env,
				shellContext: {
					currentWorkingDirectory: shellIntegrationCwd?.fsPath,
					environmentVariables: convertEnvRecordToArray(env),
				},
			};
			const state: AutocompleteState = {
				figState: initialFigState,
				parserResult: parsedArguments,
				generatorStates: [],
				command,

				visibleState: Visibility.HIDDEN_UNTIL_KEYPRESS,
				lastInsertedSuggestion: null,
				justInserted: false,

				selectedIndex: 0,
				suggestions: [],
				hasChangedIndex: false,

				historyModeEnabled: false,
				fuzzySearchEnabled: false,
				userFuzzySearchEnabled: false,
			};
			const s = createGeneratorState(state, executeExternals);
			const generatorResults = s.triggerGenerators(parsedArguments, executeExternals);
			for (const generatorResult of generatorResults) {
				for (const item of (await generatorResult?.request) ?? []) {
					if (item.type === 'file') {
						showFiles = true;
						showFolders = true;
						fileExtensions = item._internal?.fileExtensions as string[] | undefined;
					}
					if (item.type === 'folder') {
						showFolders = true;
					}

					if (!item.name) {
						continue;
					}
					const suggestionLabels = getFigSuggestionLabel(item);
					if (!suggestionLabels) {
						continue;
					}
					for (const label of suggestionLabels) {
						items.push(createCompletionItem(
							terminalContext.cursorIndex,
							prefix,
							{ label },
							item.displayName,
							typeof item === 'string' ? item : item.description,
							convertIconToKind(item.icon) ?? kind
						));
					}
				}
			}
			for (const generator of generators) {
				// Only some templates are supported, these are applied generally before calling
				// into the general fig code for now
				if (generator.template) {
					const templates = Array.isArray(generator.template) ? generator.template : [generator.template];
					for (const template of templates) {
						if (template === 'filepaths') {
							showFiles = true;
						} else if (template === 'folders') {
							showFolders = true;
						}
					}
				}
			}
		}
		if (!specArgs) {
			return { showFiles, showFolders };
		}
		const flagsToExclude = kind === vscode.TerminalCompletionItemKind.Flag ? parsedArguments?.passedOptions.map(option => option.name).flat() : undefined;

		function addItem(label: string, item: SpecArg) {
			if (flagsToExclude?.includes(label)) {
				return;
			}

			let itemKind = kind;
			const lastArgType: string | undefined = parsedArguments?.annotations.at(-1)?.type;
			if (lastArgType === 'subcommand_arg') {
				if (typeof item === 'object' && 'args' in item && (asArray(item.args ?? [])).length > 0) {
					itemKind = vscode.TerminalCompletionItemKind.Option;
				}
			}
			else if (lastArgType === 'option_arg') {
				itemKind = vscode.TerminalCompletionItemKind.OptionValue;
			}

			// Add <argName> for every argument
			let detail: string | undefined;
			if (typeof item === 'object' && 'args' in item) {
				const args = asArray(item.args);
				if (args.every(e => !!e?.name)) {
					if (args.length > 0) {
						detail = ' ' + args.map(e => {
							let result = `<${e!.name}>`;
							if (e?.isOptional) {
								result = `[${result}]`;
							}
							return result;
						}).join(' ');
					}
				}
			}

			items.push(
				createCompletionItem(
					terminalContext.cursorIndex,
					prefix,
					{
						label: detail ? { label, detail } : label
					},
					undefined,
					typeof item === 'string' ? item : item.description,
					itemKind,
				)
			);
		}

		if (Array.isArray(specArgs)) {
			for (const item of specArgs) {
				const suggestionLabels = getFigSuggestionLabel(item);
				if (!suggestionLabels?.length) {
					continue;
				}
				for (const label of suggestionLabels) {
					addItem(label, item);
				}
			}
		} else {
			for (const [label, item] of Object.entries(specArgs)) {
				addItem(label, item);
			}
		}
	};

	if (parsedArguments.suggestionFlags & SuggestionFlag.Args) {
		await addSuggestions(parsedArguments.currentArg?.suggestions, vscode.TerminalCompletionItemKind.Argument, parsedArguments);
	}
	if (parsedArguments.suggestionFlags & SuggestionFlag.Subcommands) {
		await addSuggestions(parsedArguments.completionObj.subcommands, vscode.TerminalCompletionItemKind.Method);
	}
	if (parsedArguments.suggestionFlags & SuggestionFlag.Options) {
		await addSuggestions(parsedArguments.completionObj.options, vscode.TerminalCompletionItemKind.Flag, parsedArguments);
		await addSuggestions(parsedArguments.completionObj.persistentOptions, vscode.TerminalCompletionItemKind.Flag, parsedArguments);
	}

	return { showFiles, showFolders, fileExtensions };
}

function convertEnvRecordToArray(env: Record<string, string>): EnvironmentVariable[] {
	return Object.entries(env).map(([key, value]) => ({ key, value }));
}

export function getFixSuggestionDescription(spec: Fig.Spec): string {
	if ('description' in spec) {
		return spec.description ?? '';
	}
	return '';
}

export function getFigSuggestionLabel(spec: Fig.Spec | Fig.Arg | Fig.Suggestion | string): string[] | undefined {
	if (typeof spec === 'string') {
		return [spec];
	}
	if (typeof spec.name === 'string') {
		return [spec.name];
	}
	if (!Array.isArray(spec.name) || spec.name.length === 0) {
		return;
	}
	return spec.name;
}

function convertIconToKind(icon: string | undefined): vscode.TerminalCompletionItemKind | undefined {
	switch (icon) {
		case 'vscode://icon?type=10': return vscode.TerminalCompletionItemKind.ScmCommit;
		case 'vscode://icon?type=11': return vscode.TerminalCompletionItemKind.ScmBranch;
		case 'vscode://icon?type=12': return vscode.TerminalCompletionItemKind.ScmTag;
		case 'vscode://icon?type=13': return vscode.TerminalCompletionItemKind.ScmStash;
		case 'vscode://icon?type=14': return vscode.TerminalCompletionItemKind.ScmRemote;
		case 'vscode://icon?type=15': return vscode.TerminalCompletionItemKind.PullRequest;
		case 'vscode://icon?type=16': return vscode.TerminalCompletionItemKind.PullRequestDone;
		default: return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/fig/README.md]---
Location: vscode-main/extensions/terminal-suggest/src/fig/README.md

```markdown
This folder contains the `autocomplete-parser` project from https://github.com/aws/amazon-q-developer-cli/blob/main/packages/autocomplete-parser and its dependencies which were located in siblings folders and https://github.com/withfig/autocomplete-tools, both licenses under MIT. The fork was necessary for a few reasons:

- They ship as ESM modules which we're not ready to consume just yet.
- We want the more complete `autocomplete-parser` that contains the important `parseArguments` function that does the bulk of the smarts in parsing the fig commands.
- We needed to strip out all the implementation-specific parts from their `api-bindings` project that deals with settings, IPC, fuzzy sorting, etc.
```

--------------------------------------------------------------------------------

````
