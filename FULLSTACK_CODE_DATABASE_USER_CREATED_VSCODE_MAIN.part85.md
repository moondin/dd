---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 85
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 85 of 552)

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

---[FILE: extensions/terminal-suggest/src/completions/upstream/paste.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/paste.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "paste",
	description:
		"The paste utility concatenates the corresponding lines of the given input files, replacing all but the last file's newline characters with a single tab character, and writes the resulting lines to standard output.  If end-of-file is reached on an input file while other input files still contain data, the file is treated as if it were an endless source of empty lines",
	options: [
		{
			name: "-d",
			description:
				"Use one or more of the provided characters to replace the newline characters instead of the default tab. The characters in list are used circularly, i.e., when list is exhausted the first character from list is reused. This continues until a line from the last input file (in default operation) or the last line in each file (using the -s option) is displayed, at which time paste begins selecting characters from the beginning of list again",
			args: {
				name: "list",
				suggestions: ["\\t\\n", "\\t", "\\n", "\\\\", "\\0"],
				default: "\\n",
			},
		},
		{
			name: "-s",
			description:
				"Concatenate all of the lines of each separate input file in command line order. The newline character of every line except the last line in each input file is replaced with the tab character, unless otherwise specified by the -d option",
		},
	],
	args: {
		name: "file",
		template: "filepaths",
	},
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/ping.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/ping.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "ping",
	args: {
		name: "Hostname or IP",
	},
	description: "Send ICMP ECHO_REQUEST to network hosts",
	options: [
		{
			name: "-A",
			description:
				"Audible. Output a bell (ASCII 0x07) character when no packet is received before the next packet is transmitted. To cater for round-trip times that are longer than the interval between trans- missions, further missing packets cause a bell only if the maxi- mum number of unreceived packets has increased",
		},
		{
			name: "-a",
			description:
				"Audible. Include a bell (ASCII 0x07) character in the output when any packet is received. This option is ignored if other format options are present",
		},
		{
			name: "-b",
			description:
				"Bind the socket to interface boundif for sending. This option is an Apple addition",
			args: {
				name: "boundif",
			},
		},
		{
			name: "-C",
			description:
				"Prohibit the socket from using the cellular network interface. This option is an Apple addition",
		},
		{
			name: "-c",
			description:
				"Stop after sending (and receiving) count ECHO_RESPONSE packets. If this option is not specified, ping will operate until inter- rupted. If this option is specified in conjunction with ping sweeps, each sweep will consist of count packets",
			args: {
				name: "count",
			},
		},
		{ name: "-D", description: "Set the Don't Fragment bit" },
		{
			name: "-d",
			description: "Set the SO_DEBUG option on the socket being used",
		},
		{
			name: "-f",
			description:
				"Flood ping. Outputs packets as fast as they come back or one hundred times per second, whichever is more. For every ECHO_REQUEST sent a period ``.'' is printed, while for every ECHO_REPLY received a backspace is printed. This provides a rapid display of how many packets are being dropped. Only the super-user may use this option. This can be very hard on a net- work and should be used with caution",
		},
		{
			name: "-G",
			description:
				"Sweepmaxsize Specify the maximum size of ICMP payload when sending sweeping pings. This option is required for ping sweeps",
			args: {
				name: "count",
			},
		},
		{
			name: "-g",
			description:
				"Specify the size of ICMP payload to start with when sending sweeping pings",
			args: {
				name: "sweepminsize",
				default: "0",
			},
		},
		{
			name: "-h",
			description:
				"Specify the number of bytes to increment the size of ICMP payload after each sweep when sending sweeping pings",
			args: {
				name: "sweepincrsize",
				default: "1",
			},
		},
		{
			name: "-I",
			description:
				"Source multicast packets with the given interface address. This flag only applies if the ping destination is a multicast address",
			args: {
				name: "iface",
			},
		},
		{
			name: "-i",
			description:
				"Wait wait seconds between sending each packet. The default is to wait for one second between each packet. The wait time may be fractional, but only the super-user may specify values less than 0.1 second. This option is incompatible with the -f option",
			args: {
				name: "wait",
			},
		},
		{
			name: "-k",
			description:
				"Specifies the traffic class to use for sending ICMP packets. By default ping uses the control traffic class (CTL). This option is an Apple addition",
			args: {
				name: "trafficclass",
				suggestions: [
					"BK_SYS",
					"BK",
					"BE",
					"RD",
					"OAM",
					"AV",
					"RV",
					"VI",
					"VO",
					"CTL",
				],
				default: "CTL",
			},
		},
		{
			name: "-K",
			description:
				"Specifies the network service type to use for sending ICMP pack- ets. Note this overrides the default traffic class (-k can still be specified after -K to use both). This option is an Apple addition",
			args: {
				name: "netservicetype",
				suggestions: [
					"BK_SYS",
					"BK",
					"BE",
					"RV",
					"AV",
					"RD",
					"OAM",
					"VI",
					"SIG",
					"VO",
				],
			},
		},
		{
			name: "-L",
			description:
				"Suppress loopback of multicast packets. This flag only applies if the ping destination is a multicast address",
		},
		{
			name: "-l",
			description:
				"If preload is specified, ping sends that many packets as fast as possible before falling into its normal mode of behavior. Only the super-user may use this option",
			args: {
				name: "preload",
			},
		},
		{
			name: "-M",
			description:
				"Use ICMP_MASKREQ or ICMP_TSTAMP instead of ICMP_ECHO. For mask, print the netmask of the remote machine. Set the net.inet.icmp.maskrepl MIB variable to enable ICMP_MASKREPLY. For time, print the origination, reception and transmission time- stamps",
			args: {
				name: "mask | time",
			},
		},
		{
			name: "-m",
			description:
				"Set the IP Time To Live for outgoing packets. If not specified, the kernel uses the value of the net.inet.ip.ttl MIB variable",
			args: {
				name: "ttl",
			},
		},
		{
			name: "-n",
			description:
				"Numeric output only. No attempt will be made to lookup symbolic names for host addresses",
		},
		{
			name: "-o",
			description: "Exit successfully after receiving one reply packet",
		},
		{
			name: "-P",
			description:
				"Policy specifies IPsec policy for the ping session. For details please refer to ipsec(4) and ipsec_set_policy(3)",
			args: {
				name: "policy",
			},
		},
		{
			name: "-p",
			description:
				"You may specify up to 16 'pad' bytes to fill out the packet you send. This is useful for diagnosing data-dependent problems in a network. For example, '-p ff' will cause the sent packet to be filled with all ones",
			args: {
				name: "pattern",
			},
		},
		{
			name: "-Q",
			description:
				"Somewhat quiet output. Don't display ICMP error messages that are in response to our query messages. Originally, the -v flag was required to display such errors, but -v displays all ICMP error messages. On a busy machine, this output can be overbear- ing. Without the -Q flag, ping prints out any ICMP error mes- sages caused by its own ECHO_REQUEST messages",
		},
		{
			name: "-q",
			description:
				"Quiet output. Nothing is displayed except the summary lines at startup time and when finished",
		},
		{
			name: "-R",
			description:
				"Record route. Includes the RECORD_ROUTE option in the ECHO_REQUEST packet and displays the route buffer on returned packets. Note that the IP header is only large enough for nine such routes; the traceroute(8) command is usually better at determining the route packets take to a particular destination. If more routes come back than should, such as due to an illegal spoofed packet, ping will print the route list and then truncate it at the correct spot. Many hosts ignore or discard the RECORD_ROUTE option",
		},
		{
			name: "-r",
			description:
				"Bypass the normal routing tables and send directly to a host on an attached network. If the host is not on a directly-attached network, an error is returned. This option can be used to ping a local host through an interface that has no route through it (e.g., after the interface was dropped by routed(8))",
		},
		{
			name: "-S",
			description:
				"Use the following IP address as the source address in outgoing packets. On hosts with more than one IP address, this option can be used to force the source address to be something other than the IP address of the interface the probe packet is sent on. If the IP address is not one of this machine's interface addresses, an error is returned and nothing is sent",
			args: {
				name: "src_addr",
			},
		},
		{
			name: "-s",
			description:
				"Specify the number of data bytes to be sent. The default is 56, which translates into 64 ICMP data bytes when combined with the 8 bytes of ICMP header data. This option cannot be used with ping sweeps",
			args: {
				name: "packetsize",
			},
		},
		{
			name: "-T",
			description:
				"Set the IP Time To Live for multicasted packets. This flag only applies if the ping destination is a multicast address",
			args: {
				name: "ttl",
			},
		},
		{
			name: "-t",
			description:
				"Specify a timeout, in seconds, before ping exits regardless of how many packets have been received",
			args: {
				name: "timeout",
			},
		},
		{
			name: "-v",
			description:
				"Verbose output. ICMP packets other than ECHO_RESPONSE that are received are listed",
		},
		{
			name: "-W",
			description:
				"Time in milliseconds to wait for a reply for each packet sent. If a reply arrives later, the packet is not printed as replied, but considered as replied when calculating statistics",
			args: {
				name: "waittime",
			},
		},
		{
			name: "-z",
			description: "Use the specified type of service",
			args: {
				name: "tos",
			},
		},
		// TODO(platform): apple only option
		{
			name: "--apple-connect",
			description: "Connects the socket to the destination address",
		},
		// TODO(platform): apple only option
		{
			name: "--apple-time",
			description: "Prints the time a packet was received",
		},
	],
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/pkill.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/pkill.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "pkill",
	description:
		"Send  the  specified  signal  (by default SIGTERM) to each specified process",
	options: [
		{
			name: "--signal",
			description: "Signal to send (either number or name)",
			args: {
				name: "signal",
				description: "Signal to send",
				suggestions: [
					"SIGABRT",
					"SIGALRM",
					"SIGBUS",
					"SIGCHLD",
					"SIGCLD",
					"SIGCONT",
					"SIGEMT",
					"SIGFPE",
					"SIGHUP",
					"SIGILL",
					"SIGINFO",
					"SIGINT",
					"SIGIO",
					"SIGIOT",
					"SIGKILL",
					"SIGLOST",
					"SIGPIPE",
					"SIGPOLL",
					"SIGPROF",
					"SIGPWR",
					"SIGQUIT",
					"SIGSEGV",
					"SIGSTKFLT",
					"SIGSTOP",
					"SIGTSTP",
					"SIGSYS",
					"SIGTERM",
					"SIGTRAP",
					"SIGTTIN",
					"SIGTTOU",
					"SIGUNUSED",
					"SIGURG",
					"SIGUSR1",
					"SIGUSR2",
					"SIGVTALRM",
					"SIGXCPU",
					"SIGXFSZ",
					"SIGWINCH",
				],
			},
		},
		{
			name: ["-q", "--queue"],
			description: "Integer value to be sent with the signal",
			args: {
				name: "value",
			},
		},
		{
			name: ["-e", "--echo"],
			description: "Display what is killed",
		},
		{
			name: ["-f", "--full"],
			description: "Use full process name to match",
		},
		{
			name: ["-g", "--pgroup"],
			description: "Match listed process group IDs",
			args: {
				name: "PGID",
				isVariadic: true,
			},
		},
		{
			name: ["-G", "--group"],
			description: "Match real group IDs",
			args: {
				name: "GID",
				isVariadic: true,
			},
		},
		{
			name: ["-i", "--ignore-case"],
			description: "Match case insensitively",
		},
		{
			name: ["-n", "--newest"],
			description: "Select most recently started",
		},
		{
			name: ["-o", "--oldest"],
			description: "Select least recently started",
		},
		{
			name: ["-O", "--older"],
			description: "Select where older than seconds",
			args: {
				name: "seconds",
			},
		},
		{
			name: ["-P", "--parent"],
			description: "Match only child processes of the given parent",
			args: {
				name: "PPID",
				isVariadic: true,
			},
		},
		{
			name: ["-s", "--session"],
			description: "Match session IDs",
			args: {
				name: "SID",
				isVariadic: true,
			},
		},
		{
			name: ["-t", "--terminal"],
			description: "Match by controlling terminal",
			args: {
				name: "tty",
				isVariadic: true,
			},
		},
		{
			name: ["-u", "--euid"],
			description: "Match by effective IDs",
			args: {
				name: "ID",
				isVariadic: true,
			},
		},
		{
			name: ["-U", "--uid"],
			description: "Match by real IDs",
			args: {
				name: "ID",
				isVariadic: true,
			},
		},
		{
			name: ["-x", "--exact"],
			description: "Match exactly with the command name",
		},
		{
			name: ["-F", "--pidfile"],
			description: "Read PIDs from file",
			args: {
				name: "file",
				template: "filepaths",
			},
		},
		{
			name: ["-L", "logpidfile"],
			description: "Fail if PID file is not locked",
		},
		{
			name: ["-r", "--runstates"],
			description: "Match runstates",
			args: {
				name: "state",
			},
		},
		{
			name: "--ns",
			description: "Match the processes that belong to a specified PID",
			args: {
				name: "PID",
			},
		},
		{
			name: "--nslist",
			description:
				"List which namespaces will be considered for the --ns option",
			dependsOn: ["--ns"],
			args: {
				name: "ns",
				isVariadic: true,
				suggestions: ["ipc", "mnt", "net", "pid", "user", "uts"],
			},
		},
		{
			name: ["-h", "--help"],
			description: "Output help message and exit",
		},
		{
			name: ["-V", "--version"],
			description: "Output version information and exit",
		},
	],
	args: {
		name: "pattern",
		description:
			"Specifies an Extended Regular Expression for matching against the process names or command lines",
	},
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/pnpm.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/pnpm.ts

```typescript
// GENERATORS

import { npmScriptsGenerator, npmSearchGenerator } from "./npm";
import { dependenciesGenerator, nodeClis } from "./yarn";

const filterMessages = (out: string): string => {
	return out.startsWith("warning:") || out.startsWith("error:")
		? out.split("\n").slice(1).join("\n")
		: out;
};

const searchBranches: Fig.Generator = {
	script: ["git", "branch", "--no-color"],
	postProcess: function (out) {
		const output = filterMessages(out);

		if (output.startsWith("fatal:")) {
			return [];
		}

		return output.split("\n").map((elm) => {
			let name = elm.trim();
			const parts = elm.match(/\S+/g);
			if (parts && parts.length > 1) {
				if (parts[0] == "*") {
					// Current branch.
					return {
						name: elm.replace("*", "").trim(),
						description: "Current branch",
						icon: "⭐️",
					};
				} else if (parts[0] == "+") {
					// Branch checked out in another worktree.
					name = elm.replace("+", "").trim();
				}
			}

			return {
				name,
				description: "Branch",
				icon: "fig://icon?type=git",
			};
		});
	},
};

const generatorInstalledPackages: Fig.Generator = {
	script: ["pnpm", "ls"],
	postProcess: function (out) {
		/**
		 * out
		 * @example
		 * ```
		 * Legend: production dependency, optional only, dev only
		 *
		 * /xxxx/xxxx/<package-name> (PRIVATE)
		 *
		 * dependencies:
		 * lodash 4.17.21
		 * foo link:packages/foo
		 *
		 * devDependencies:
		 * typescript 4.7.4
		 * ```
		 */
		if (out.includes("ERR_PNPM")) {
			return [];
		}

		const output = out
			.split("\n")
			.slice(3)
			// remove empty lines, "*dependencies:" lines, local workspace packages (eg: "foo":"workspace:*")
			.filter(
				(item) =>
					!!item &&
					!item.toLowerCase().includes("dependencies") &&
					!item.includes("link:")
			)
			.map((item) => item.replace(/\s/, "@")); // typescript 4.7.4 -> typescript@4.7.4

		return output.map((pkg) => {
			return {
				name: pkg,
				icon: "fig://icon?type=package",
			};
		});
	},
};

const FILTER_OPTION: Fig.Option = {
	name: "--filter",
	args: {
		template: "filepaths",
		name: "Filepath / Package",
		description:
			"To only select packages under the specified directory, you may specify any absolute path, typically in POSIX format",
	},
	description: `Filtering allows you to restrict commands to specific subsets of packages.
pnpm supports a rich selector syntax for picking packages by name or by relation.
More details: https://pnpm.io/filtering`,
};

/** Options that being appended for `pnpm i` and `add` */
const INSTALL_BASE_OPTIONS: Fig.Option[] = [
	{
		name: "--offline",
		description:
			"If true, pnpm will use only packages already available in the store. If a package won't be found locally, the installation will fail",
	},
	{
		name: "--prefer-offline",
		description:
			"If true, staleness checks for cached data will be bypassed, but missing data will be requested from the server. To force full offline mode, use --offline",
	},
	{
		name: "--ignore-scripts",
		description:
			"Do not execute any scripts defined in the project package.json and its dependencies",
	},
	{
		name: "--reporter",
		description: `Allows you to choose the reporter that will log debug info to the terminal about the installation progress`,
		args: {
			name: "Reporter Type",
			suggestions: ["silent", "default", "append-only", "ndjson"],
		},
	},
];

/** Base options for pnpm i when run without any arguments */
const INSTALL_OPTIONS: Fig.Option[] = [
	{
		name: ["-P", "--save-prod"],
		description: `Pnpm will not install any package listed in devDependencies if the NODE_ENV environment variable is set to production.
Use this flag to instruct pnpm to ignore NODE_ENV and take its production status from this flag instead`,
	},
	{
		name: ["-D", "--save-dev"],
		description:
			"Only devDependencies are installed regardless of the NODE_ENV",
	},
	{
		name: "--no-optional",
		description: "OptionalDependencies are not installed",
	},
	{
		name: "--lockfile-only",
		description:
			"When used, only updates pnpm-lock.yaml and package.json instead of checking node_modules and downloading dependencies",
	},
	{
		name: "--frozen-lockfile",
		description:
			"If true, pnpm doesn't generate a lockfile and fails to install if the lockfile is out of sync with the manifest / an update is needed or no lockfile is present",
	},
	{
		name: "--use-store-server",
		description:
			"Starts a store server in the background. The store server will keep running after installation is done. To stop the store server, run pnpm server stop",
	},
	{
		name: "--shamefully-hoist",
		description:
			"Creates a flat node_modules structure, similar to that of npm or yarn. WARNING: This is highly discouraged",
	},
];

/** Base options for pnpm add */
const INSTALL_PACKAGE_OPTIONS: Fig.Option[] = [
	{
		name: ["-P", "--save-prod"],
		description: "Install the specified packages as regular dependencies",
	},
	{
		name: ["-D", "--save-dev"],
		description: "Install the specified packages as devDependencies",
	},
	{
		name: ["-O", "--save-optional"],
		description: "Install the specified packages as optionalDependencies",
	},
	{
		name: "--no-save",
		description: "Prevents saving to `dependencies`",
	},
	{
		name: ["-E", "--save-exact"],
		description:
			"Saved dependencies will be configured with an exact version rather than using pnpm's default semver range operator",
	},
	{
		name: "--save-peer",
		description:
			"Using --save-peer will add one or more packages to peerDependencies and install them as dev dependencies",
	},
	{
		name: ["--ignore-workspace-root-check", "-W#"],
		description: `Adding a new dependency to the root workspace package fails, unless the --ignore-workspace-root-check or -W flag is used.
For instance, pnpm add debug -W`,
	},
	{
		name: ["--global", "-g"],
		description: `Install a package globally`,
	},
	{
		name: "--workspace",
		description: `Only adds the new dependency if it is found in the workspace`,
	},
	FILTER_OPTION,
];

// SUBCOMMANDS
const SUBCOMMANDS_MANAGE_DEPENDENCIES: Fig.Subcommand[] = [
	{
		name: "add",
		description: `Installs a package and any packages that it depends on. By default, any new package is installed as a production dependency`,
		args: {
			name: "package",
			generators: npmSearchGenerator,
			debounce: true,
			isVariadic: true,
		},
		options: [...INSTALL_BASE_OPTIONS, ...INSTALL_PACKAGE_OPTIONS],
	},
	{
		name: ["install", "i"],
		description: `Pnpm install is used to install all dependencies for a project.
In a CI environment, installation fails if a lockfile is present but needs an update.
Inside a workspace, pnpm install installs all dependencies in all the projects.
If you want to disable this behavior, set the recursive-install setting to false`,
		async generateSpec(tokens) {
			// `pnpm i` with args is an `pnpm add` alias
			const hasArgs =
				tokens.filter((token) => token.trim() !== "" && !token.startsWith("-"))
					.length > 2;

			return {
				name: "install",
				options: [
					...INSTALL_BASE_OPTIONS,
					...(hasArgs ? INSTALL_PACKAGE_OPTIONS : INSTALL_OPTIONS),
				],
			};
		},
		args: {
			name: "package",
			isOptional: true,
			generators: npmSearchGenerator,
			debounce: true,
			isVariadic: true,
		},
	},
	{
		name: ["install-test", "it"],
		description:
			"Runs pnpm install followed immediately by pnpm test. It takes exactly the same arguments as pnpm install",
		options: [...INSTALL_BASE_OPTIONS, ...INSTALL_OPTIONS],
	},
	{
		name: ["update", "upgrade", "up"],
		description: `Pnpm update updates packages to their latest version based on the specified range.
When used without arguments, updates all dependencies. You can use patterns to update specific dependencies`,
		args: {
			name: "Package",
			isOptional: true,
			filterStrategy: "fuzzy",
			generators: dependenciesGenerator,
			isVariadic: true,
		},
		options: [
			{
				name: ["--recursive", "-r"],
				description:
					"Concurrently runs update in all subdirectories with a package.json (excluding node_modules)",
			},
			{
				name: ["--latest", "-L"],
				description:
					"Ignores the version range specified in package.json. Instead, the version specified by the latest tag will be used (potentially upgrading the packages across major versions)",
			},
			{
				name: "--global",
				description: "Update global packages",
			},
			{
				name: ["-P", "--save-prod"],
				description: `Only update packages in dependencies and optionalDependencies`,
			},
			{
				name: ["-D", "--save-dev"],
				description: "Only update packages in devDependencies",
			},
			{
				name: "--no-optional",
				description: "Don't update packages in optionalDependencies",
			},
			{
				name: ["--interactive", "-i"],
				description:
					"Show outdated dependencies and select which ones to update",
			},
			{
				name: "--workspace",
				description: `Tries to link all packages from the workspace. Versions are updated to match the versions of packages inside the workspace.
If specific packages are updated, the command will fail if any of the updated dependencies are not found inside the workspace. For instance, the following command fails if express is not a workspace package: pnpm up -r --workspace express`,
			},
			FILTER_OPTION,
		],
	},
	{
		name: ["remove", "rm", "uninstall", "un"],
		description: `Removes packages from node_modules and from the project's package.json`,
		args: {
			name: "Package",
			filterStrategy: "fuzzy",
			generators: dependenciesGenerator,
			isVariadic: true,
		},
		options: [
			{
				name: ["--recursive", "-r"],
				description: `When used inside a workspace, removes a dependency (or dependencies) from every workspace package.
When used not inside a workspace, removes a dependency (or dependencies) from every package found in subdirectories`,
			},
			{
				name: "--global",
				description: "Remove a global package",
			},
			{
				name: ["-P", "--save-prod"],
				description: `Only remove the dependency from dependencies`,
			},
			{
				name: ["-D", "--save-dev"],
				description: "Only remove the dependency from devDependencies",
			},
			{
				name: ["--save-optional", "-O"],
				description: "Only remove the dependency from optionalDependencies",
			},
			FILTER_OPTION,
		],
	},
	{
		name: ["link", "ln"],
		description: `Makes the current local package accessible system-wide, or in another location`,
		args: [
			{
				name: "Package",
				filterStrategy: "fuzzy",
				generators: dependenciesGenerator,
				isVariadic: true,
			},
			{ template: "filepaths" },
		],
		options: [
			{
				name: ["--dir", "-C"],
				description: `Changes the link location to <dir>`,
			},
			{
				name: "--global",
				description:
					"Links the specified package (<pkg>) from global node_modules to the node_nodules of package from where this command was executed or specified via --dir option",
			},
		],
	},
	{
		name: "unlink",
		description: `Unlinks a system-wide package (inverse of pnpm link).
If called without arguments, all linked dependencies will be unlinked.
This is similar to yarn unlink, except pnpm re-installs the dependency after removing the external link`,
		args: [
			{
				name: "Package",
				filterStrategy: "fuzzy",
				generators: dependenciesGenerator,
				isVariadic: true,
			},
			{ template: "filepaths" },
		],
		options: [
			{
				name: ["--recursive", "-r"],
				description: `Unlink in every package found in subdirectories or in every workspace package, when executed inside a workspace`,
			},
			FILTER_OPTION,
		],
	},
	{
		name: "import",
		description:
			"Pnpm import generates a pnpm-lock.yaml from an npm package-lock.json (or npm-shrinkwrap.json) file",
	},
	{
		name: ["rebuild", "rb"],
		description: `Rebuild a package`,
		args: [
			{
				name: "Package",
				filterStrategy: "fuzzy",
				generators: dependenciesGenerator,
				isVariadic: true,
			},
			{ template: "filepaths" },
		],
		options: [
			{
				name: ["--recursive", "-r"],
				description: `This command runs the pnpm rebuild command in every package of the monorepo`,
			},
			FILTER_OPTION,
		],
	},
	{
		name: "prune",
		description: `Removes unnecessary packages`,
		options: [
			{
				name: "--prod",
				description: `Remove the packages specified in devDependencies`,
			},
			{
				name: "--no-optional",
				description: `Remove the packages specified in optionalDependencies`,
			},
		],
	},
	{
		name: "fetch",
		description: `EXPERIMENTAL FEATURE: Fetch packages from a lockfile into virtual store, package manifest is ignored: https://pnpm.io/cli/fetch`,
		options: [
			{
				name: "--prod",
				description: `Development packages will not be fetched`,
			},
			{
				name: "--dev",
				description: `Only development packages will be fetched`,
			},
		],
	},
	{
		name: "patch",
		description: `This command will cause a package to be extracted in a temporary directory intended to be editable at will`,
		args: {
			name: "package",
			generators: generatorInstalledPackages,
		},
		options: [
			{
				name: "--edit-dir",
				description: `The package that needs to be patched will be extracted to this directory`,
			},
		],
	},
	{
		name: "patch-commit",
		args: {
			name: "dir",
		},
		description: `Generate a patch out of a directory`,
	},
	{
		name: "patch-remove",
		args: {
			name: "package",
			isVariadic: true,
			// TODO: would be nice to have a generator of all patched packages
		},
	},
];

const SUBCOMMANDS_RUN_SCRIPTS: Fig.Subcommand[] = [
	{
		name: ["run", "run-script"],
		description: "Runs a script defined in the package's manifest file",
		args: {
			name: "Scripts",
			filterStrategy: "fuzzy",
			generators: npmScriptsGenerator,
			isVariadic: true,
		},
		options: [
			{
				name: ["-r", "--recursive"],
				description: `This runs an arbitrary command from each package's "scripts" object. If a package doesn't have the command, it is skipped. If none of the packages have the command, the command fails`,
			},
			{
				name: "--if-present",
				description:
					"You can use the --if-present flag to avoid exiting with a non-zero exit code when the script is undefined. This lets you run potentially undefined scripts without breaking the execution chain",
			},
			{
				name: "--parallel",
				description:
					"Completely disregard concurrency and topological sorting, running a given script immediately in all matching packages with prefixed streaming output. This is the preferred flag for long-running processes over many packages, for instance, a lengthy build process",
			},
			{
				name: "--stream",
				description:
					"Stream output from child processes immediately, prefixed with the originating package directory. This allows output from different packages to be interleaved",
			},
			FILTER_OPTION,
		],
	},
	{
		name: "exec",
		description: `Execute a shell command in scope of a project.
node_modules/.bin is added to the PATH, so pnpm exec allows executing commands of dependencies`,
		args: {
			name: "Scripts",
			filterStrategy: "fuzzy",
			generators: dependenciesGenerator,
			isVariadic: true,
		},
		options: [
			{
				name: ["-r", "--recursive"],
				description: `Execute the shell command in every project of the workspace.
The name of the current package is available through the environment variable PNPM_PACKAGE_NAME (supported from pnpm v2.22.0 onwards)`,
			},
			{
				name: "--parallel",
				description:
					"Completely disregard concurrency and topological sorting, running a given script immediately in all matching packages with prefixed streaming output. This is the preferred flag for long-running processes over many packages, for instance, a lengthy build process",
			},
			FILTER_OPTION,
		],
	},
	{
		name: ["test", "t", "tst"],
		description: `Runs an arbitrary command specified in the package's test property of its scripts object.
The intended usage of the property is to specify a command that runs unit or integration testing for your program`,
	},
	{
		name: "start",
		description: `Runs an arbitrary command specified in the package's start property of its scripts object. If no start property is specified on the scripts object, it will attempt to run node server.js as a default, failing if neither are present.
The intended usage of the property is to specify a command that starts your program`,
	},
];

const SUBCOMMANDS_REVIEW_DEPS: Fig.Subcommand[] = [
	{
		name: "audit",
		description: `Checks for known security issues with the installed packages.
If security issues are found, try to update your dependencies via pnpm update.
If a simple update does not fix all the issues, use overrides to force versions that are not vulnerable.
For instance, if lodash@<2.1.0 is vulnerable, use overrides to force lodash@^2.1.0.
Details at: https://pnpm.io/cli/audit`,
		options: [
			{
				name: "--audit-level",
				description: `Only print advisories with severity greater than or equal to <severity>`,
				args: {
					name: "Audit Level",
					default: "low",
					suggestions: ["low", "moderate", "high", "critical"],
				},
			},
			{
				name: "--fix",
				description:
					"Add overrides to the package.json file in order to force non-vulnerable versions of the dependencies",
			},
			{
				name: "--json",
				description: `Output audit report in JSON format`,
			},
			{
				name: ["--dev", "-D"],
				description: `Only audit dev dependencies`,
			},
			{
				name: ["--prod", "-P"],
				description: `Only audit production dependencies`,
			},
			{
				name: "--no-optional",
				description: `Don't audit optionalDependencies`,
			},
			{
				name: "--ignore-registry-errors",
				description: `If the registry responds with a non-200 status code, the process should exit with 0. So the process will fail only if the registry actually successfully responds with found vulnerabilities`,
			},
		],
	},
	{
		name: ["list", "ls"],
		description: `This command will output all the versions of packages that are installed, as well as their dependencies, in a tree-structure.
Positional arguments are name-pattern@version-range identifiers, which will limit the results to only the packages named. For example, pnpm list "babel-*" "eslint-*" semver@5`,
		options: [
			{
				name: ["--recursive", "-r"],
				description: `Perform command on every package in subdirectories or on every workspace package, when executed inside a workspace`,
			},
			{
				name: "--json",
				description: `Log output in JSON format`,
			},
			{
				name: "--long",
				description: `Show extended information`,
			},
			{
				name: "--parseable",
				description: `Outputs package directories in a parseable format instead of their tree view`,
			},
			{
				name: "--global",
				description: `List packages in the global install directory instead of in the current project`,
			},
			{
				name: "--depth",
				description: `Max display depth of the dependency tree.
pnpm ls --depth 0 will list direct dependencies only. pnpm ls --depth -1 will list projects only. Useful inside a workspace when used with the -r option`,
				args: { name: "number" },
			},
			{
				name: ["--dev", "-D"],
				description: `Only list dev dependencies`,
			},
			{
				name: ["--prod", "-P"],
				description: `Only list production dependencies`,
			},
			{
				name: "--no-optional",
				description: `Don't list optionalDependencies`,
			},
			FILTER_OPTION,
		],
	},
	{
		name: "outdated",
		description: `Checks for outdated packages. The check can be limited to a subset of the installed packages by providing arguments (patterns are supported)`,
		options: [
			{
				name: ["--recursive", "-r"],
				description: `Check for outdated dependencies in every package found in subdirectories, or in every workspace package when executed inside a workspace`,
			},
			{
				name: "--long",
				description: `Print details`,
			},
			{
				name: "--global",
				description: `List outdated global packages`,
			},
			{
				name: "--no-table",
				description: `Prints the outdated dependencies in a list format instead of the default table. Good for small consoles`,
			},
			{
				name: "--compatible",
				description: `Prints only versions that satisfy specifications in package.json`,
			},
			{
				name: ["--dev", "-D"],
				description: `Only list dev dependencies`,
			},
			{
				name: ["--prod", "-P"],
				description: `Only list production dependencies`,
			},
			{
				name: "--no-optional",
				description: `Doesn't check optionalDependencies`,
			},
		],
	},
	{
		name: "why",
		description: `Shows all packages that depend on the specified package`,
		args: {
			name: "Scripts",
			filterStrategy: "fuzzy",
			generators: dependenciesGenerator,
			isVariadic: true,
		},
		options: [
			{
				name: ["--recursive", "-r"],
				description: `Show the dependency tree for the specified package on every package in subdirectories or on every workspace package when executed inside a workspace`,
			},
			{
				name: "--json",
				description: `Log output in JSON format`,
			},
			{
				name: "--long",
				description: `Show verbose output`,
			},
			{
				name: "--parseable",
				description: `Show parseable output instead of tree view`,
			},
			{
				name: "--global",
				description: `List packages in the global install directory instead of in the current project`,
			},
			{
				name: ["--dev", "-D"],
				description: `Only display the dependency tree for packages in devDependencies`,
			},
			{
				name: ["--prod", "-P"],
				description: `Only display the dependency tree for packages in dependencies`,
			},
			FILTER_OPTION,
		],
	},
];

const SUBCOMMANDS_MISC: Fig.Subcommand[] = [
	{
		name: "publish",
		description: `Publishes a package to the registry.
When publishing a package inside a workspace, the LICENSE file from the root of the workspace is packed with the package (unless the package has a license of its own).
You may override some fields before publish, using the publishConfig field in package.json. You also can use the publishConfig.directory to customize the published subdirectory (usually using third party build tools).
When running this command recursively (pnpm -r publish), pnpm will publish all the packages that have versions not yet published to the registry`,
		args: {
			name: "Branch",
			generators: searchBranches,
		},
		options: [
			{
				name: "--tag",
				description: `Publishes the package with the given tag. By default, pnpm publish updates the latest tag`,
				args: {
					name: "<tag>",
				},
			},
			{
				name: "--dry-run",
				description: `Does everything a publish would do except actually publishing to the registry`,
			},
			{
				name: "--ignore-scripts",
				description: `Ignores any publish related lifecycle scripts (prepublishOnly, postpublish, and the like)`,
			},
			{
				name: "--no-git-checks",
				description: `Don't check if current branch is your publish branch, clean, and up-to-date`,
			},
			{
				name: "--access",
				description: `Tells the registry whether the published package should be public or restricted`,
				args: {
					name: "Type",
					suggestions: ["public", "private"],
				},
			},
			{
				name: "--force",
				description: `Try to publish packages even if their current version is already found in the registry`,
			},
			{
				name: "--report-summary",
				description: `Save the list of published packages to pnpm-publish-summary.json. Useful when some other tooling is used to report the list of published packages`,
			},
			FILTER_OPTION,
		],
	},
	{
		name: ["recursive", "m", "multi", "-r"],
		description: `Runs a pnpm command recursively on all subdirectories in the package or every available workspace`,
		options: [
			{
				name: "--link-workspace-packages",
				description: `Link locally available packages in workspaces of a monorepo into node_modules instead of re-downloading them from the registry. This emulates functionality similar to yarn workspaces.
When this is set to deep, local packages can also be linked to subdependencies.
Be advised that it is encouraged instead to use npmrc for this setting, to enforce the same behaviour in all environments. This option exists solely so you may override that if necessary`,
				args: {
					name: "bool or `deep`",
					suggestions: ["dee["],
				},
			},
			{
				name: "--workspace-concurrency",
				description: `Set the maximum number of tasks to run simultaneously. For unlimited concurrency use Infinity`,
				args: { name: "<number>" },
			},
			{
				name: "--bail",
				description: `Stops when a task throws an error`,
			},
			{
				name: "--no-bail",
				description: `Don't stop when a task throws an error`,
			},
			{
				name: "--sort",
				description: `Packages are sorted topologically (dependencies before dependents)`,
			},
			{
				name: "--no-sort",
				description: `Disable packages sorting`,
			},
			{
				name: "--reverse",
				description: `The order of packages is reversed`,
			},
			FILTER_OPTION,
		],
	},
	{
		name: "server",
		description: `Manage a store server`,
		subcommands: [
			{
				name: "start",
				description:
					"Starts a server that performs all interactions with the store. Other commands will delegate any store-related tasks to this server",
				options: [
					{
						name: "--background",
						description: `Runs the server in the background, similar to daemonizing on UNIX systems`,
					},
					{
						name: "--network-concurrency",
						description: `The maximum number of network requests to process simultaneously`,
						args: { name: "number" },
					},
					{
						name: "--protocol",
						description: `The communication protocol used by the server. When this is set to auto, IPC is used on all systems except for Windows, which uses TCP`,
						args: {
							name: "Type",
							suggestions: ["auto", "tcp", "ipc"],
						},
					},
					{
						name: "--port",
						description: `The port number to use when TCP is used for communication. If a port is specified and the protocol is set to auto, regardless of system type, the protocol is automatically set to use TCP`,
						args: { name: "port number" },
					},
					{
						name: "--store-dir",
						description: `The directory to use for the content addressable store`,
						args: { name: "Path", template: "filepaths" },
					},
					{
						name: "--lock",
						description: `Set to make the package store immutable to external processes while the server is running or not`,
					},
					{
						name: "--no-lock",
						description: `Set to make the package store mutable to external processes while the server is running or not`,
					},
					{
						name: "--ignore-stop-requests",
						description: `Prevents you from stopping the server using pnpm server stop`,
					},
					{
						name: "--ignore-upload-requests",
						description: `Prevents creating a new side effect cache during install`,
					},
				],
			},
			{
				name: "stop",
				description: "Stops the store server",
			},
			{
				name: "status",
				description: "Prints information about the running server",
			},
		],
	},
	{
		name: "store",
		description: "Managing the package store",
		subcommands: [
			{
				name: "status",
				description: `Checks for modified packages in the store.
Returns exit code 0 if the content of the package is the same as it was at the time of unpacking`,
			},
			{
				name: "add",
				description: `Functionally equivalent to pnpm add,
except this adds new packages to the store directly without modifying any projects or files outside of the store`,
			},
			{
				name: "prune",
				description: `Removes orphan packages from the store.
Pruning the store will save disk space, however may slow down future installations involving pruned packages.
Ultimately, it is a safe operation, however not recommended if you have orphaned packages from a package you intend to reinstall.
Please read the FAQ for more information on unreferenced packages and best practices.
Please note that this is prohibited when a store server is running`,
			},
			{
				name: "path",
				description: `Returns the path to the active store directory`,
			},
		],
	},
	{
		name: "init",
		description:
			"Creates a basic package.json file in the current directory, if it doesn't exist already",
	},
	{
		name: "doctor",
		description: "Checks for known common issues with pnpm configuration",
	},
];

const subcommands = [
	...SUBCOMMANDS_MANAGE_DEPENDENCIES,
	...SUBCOMMANDS_REVIEW_DEPS,
	...SUBCOMMANDS_RUN_SCRIPTS,
	...SUBCOMMANDS_MISC,
];

const recursiveSubcommandsNames = [
	"add",
	"exec",
	"install",
	"list",
	"outdated",
	"publish",
	"rebuild",
	"remove",
	"run",
	"test",
	"unlink",
	"update",
	"why",
];

const recursiveSubcommands = subcommands.filter((subcommand) => {
	if (Array.isArray(subcommand.name)) {
		return subcommand.name.some((name) =>
			recursiveSubcommandsNames.includes(name)
		);
	}
	return recursiveSubcommandsNames.includes(subcommand.name);
});

// RECURSIVE SUBCOMMAND INDEX
SUBCOMMANDS_MISC[1].subcommands = recursiveSubcommands;

// common options
const COMMON_OPTIONS: Fig.Option[] = [
	{
		name: ["-C", "--dir"],
		args: {
			name: "path",
			template: "folders",
		},
		isPersistent: true,
		description:
			"Run as if pnpm was started in <path> instead of the current working directory",
	},
	{
		name: ["-w", "--workspace-root"],
		args: {
			name: "workspace",
		},
		isPersistent: true,
		description:
			"Run as if pnpm was started in the root of the <workspace> instead of the current working directory",
	},
	{
		name: ["-h", "--help"],
		isPersistent: true,
		description: "Output usage information",
	},
	{
		name: ["-v", "--version"],
		description: "Show pnpm's version",
	},
];

// SPEC
const completionSpec: Fig.Spec = {
	name: "pnpm",
	description: "Fast, disk space efficient package manager",
	args: {
		name: "Scripts",
		filterStrategy: "fuzzy",
		generators: npmScriptsGenerator,
		isVariadic: true,
	},
	filterStrategy: "fuzzy",
	generateSpec: async (tokens, executeShellCommand) => {
		const { script, postProcess } = dependenciesGenerator as Fig.Generator & {
			script: string[];
		};

		if (postProcess === undefined) {
			return undefined;
		}

		const packages = postProcess(
			(
				await executeShellCommand({
					command: script[0],
					args: script.slice(1),
				})
			).stdout,
			tokens
		)
			?.filter((e) => e !== null)
			.map(({ name }) => name as string);

		const subcommands = packages
			?.filter((name) => nodeClis.has(name))
			.map((name) => ({
				name,
				loadSpec: name,
				icon: "fig://icon?type=package",
			}));

		return {
			name: "pnpm",
			subcommands,
		} as Fig.Spec;
	},
	subcommands,
	options: COMMON_OPTIONS,
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/ps.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/ps.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "ps",
	description: "Report a snapshot of the current processes",
	options: [
		{ name: ["-A", "-e"], description: "Select all processes" },
		{
			name: "-a",
			description: "Select all processes except both session leaders",
			args: { name: "getsid" },
		},
		{
			name: "-d",
			description: "Select all processes except session leaders",
		},
		{
			name: "--deselect",
			description:
				"Select all processes except those that fulfill the specified conditions",
		},
		{
			name: "-N",
			description:
				"Select all processes except those that fulfill the specified conditions (negates the selection)",
		},
		{
			name: "--pid",
			description: "Select by process ID",
			args: { name: "pidlist" },
		},
		{
			name: "--ppid",
			description:
				"Select by parent process ID. This selects the processes with a parent process ID in pidlist",
			args: { name: "pidlist" },
		},
		{
			name: "--sid",
			description: "Select by session ID",
			args: { name: "sesslist" },
		},
		{
			name: "--tty",
			description: "Select by terminal",
			args: { name: "ttylist" },
		},
		{
			name: "U",
			description: "Select by effective user ID (EUID) or name",
			args: { name: "userlist" },
		},
		{
			name: "-U",
			description: "Select by real user ID (RUID) or name",
			args: { name: "userlist" },
		},
		{
			name: "-u",
			description: "Select by effective user ID (EUID) or name",
			args: { name: "userlist" },
		},
		{
			name: "--User",
			description: "Select by real user ID (RUID) or name",
			args: { name: "userlist" },
		},
		{
			name: "--user",
			description: "Select by effective user ID (EUID) or name",
			args: { name: "userlist" },
		},
		{
			name: "-c",
			description: "Show different scheduler information for the -l option",
		},
		{
			name: "--context",
			description: "Display security context format (for SE Linux)",
		},
		{ name: "-f", description: "Do full-format listing" },
		{ name: "-F", description: "Extra full format" },
		{
			name: ["--format", "-o", "o"],
			description: "",
			args: { name: "format" },
			isRepeatable: true,
		},
		{ name: ["-M", "Z"], description: "(for SE Linux)" },
		{ name: ["-y", "-l"], description: "" },
		{
			name: "--cols",
			description: "Set screen width",
			args: { name: "n" },
		},
		{
			name: "--columns",
			description: "Set screen width",
			args: { name: "n" },
		},
		{
			name: "--cumulative",
			description:
				"Include some dead child process data (as a sum with the parent)",
		},
		{ name: "--forest", description: "ASCII art process tree" },
		{ name: "-H", description: "Show process hierarchy (forest)" },
		{
			name: "--headers",
			description: "Repeat header lines, one per page of output",
		},
		{
			name: "-n",
			description: "Set namelist file",
			args: { name: "namelist" },
		},
		{
			name: "--lines",
			description: "Set screen height",
			args: { name: "n" },
		},
		{
			name: ["--no-headers", "--no-heading"],
			description: "Print no header line at all",
		},
		{
			name: "--rows",
			description: "Set screen height",
			args: { name: "n" },
		},
		{
			name: "--sort",
			description: "Specify sorting order",
			args: { name: "spec" },
		},
		{
			name: "--width",
			description: "Set screen width",
			args: { name: "n" },
		},
		{
			name: "-L",
			description: "Show threads, possibly with LWP and NLWP columns",
		},
		{
			name: "-T",
			description: "Show threads, possibly with SPID column",
		},
		{ name: "--help", description: "Print a help message" },
		{ name: "--info", description: "Print debugging info" },
		{ name: "--version", description: "Print the procps version" },
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/pwd.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/pwd.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "pwd",
	description: "Return working directory name",
	options: [
		{
			name: "-L",
			description: "Display the logical current working directory",
		},
		{
			name: "-P",
			description: "Display the physical current working directory",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/python.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/python.ts

```typescript
import { filepaths } from '../../helpers/filepaths';

const completionSpec: Fig.Spec = {
	name: "python",
	description: "Run the python interpreter",
	generateSpec: async (tokens, executeShellCommand) => {
		const isDjangoManagePyFilePresentCommand = "cat manage.py | grep -q django";
		if (
			(
				await executeShellCommand({
					command: "bash",
					args: ["-c", isDjangoManagePyFilePresentCommand],
				})
			).status === 0
		) {
			return {
				name: "python",
				subcommands: [{ name: "manage.py", loadSpec: "django-admin" }],
			};
		}
	},
	args: {
		name: "python script",
		isScript: true,
		generators: filepaths({
			extensions: ["py"],
			editFileSuggestions: { priority: 76 },
		}),
	},
	options: [
		{
			name: "-c",
			insertValue: "-c '{cursor}'",
			description:
				"Execute the Python code in command. command can be one or more statements separated by newlines, with significant leading whitespace as in normal module code",
			args: {
				name: "command",
				isCommand: true,
			},
		},
		{
			name: "-m",
			description: "Module",
			args: {
				name: "python module",
				isModule: "python/",
				suggestions: ["http.server"],
			},
		},
		{
			name: ["-?", "-h", "--help"],
			description: "Print a short description of all command line options",
		},
		{
			name: ["-V", "--version"],
			description: "Print the Python version number and exit",
		},
		{
			name: "-b",
			description:
				"Issue a warning when comparing bytes or bytearray with str or bytes with int. Issue an error when the option is given twice (-bb)",
		},
		{
			name: "-B",
			description:
				"If given, Python won’t try to write .pyc files on the import of source modules",
		},
		{
			name: "--check-hash-based-pycs",
			description:
				"Control the validation behavior of hash-based .pyc files. See Cached bytecode invalidation",
			args: {
				suggestions: [
					{ name: "default" },
					{ name: "always" },
					{ name: "never" },
				],
			},
		},
		{
			name: "-d",
			description:
				"Turn on parser debugging output (for expert only, depending on compilation options)",
		},
		{
			name: "-E",
			description:
				"Ignore all PYTHON* environment variables, e.g. PYTHONPATH and PYTHONHOME, that might be set",
		},
		{
			name: "-i",
			description:
				"When a script is passed as first argument or the -c option is used, enter interactive mode after executing the script or the command, even when sys.stdin does not appear to be a terminal",
		},
		{
			name: "-I",
			description:
				"Run Python in isolated mode. This also implies -E and -s. In isolated mode sys.path contains neither the script’s directory nor the user’s site-packages directory",
		},
		{
			name: "-O",
			description:
				"Remove assert statements and any code conditional on the value of __debug__",
		},
		{
			name: "-OO",
			description: "Do -O and also discard docstrings",
		},
		{
			name: "-g",
			description:
				"Don’t display the copyright and version messages even in interactive mode",
		},
		{
			name: "-R",
			description:
				"Turn on hash randomization. This option only has an effect if the PYTHONHASHSEED environment variable is set to 0, since hash randomization is enabled by default",
		},
		{
			name: "-s",
			description: "Don’t add the user site-packages directory to sys.path",
		},
		{
			name: "-S",
			description:
				"Disable the import of the module site and the site-dependent manipulations of sys.path that it entails",
		},
		{
			name: "-u",
			description:
				"Force the stdout and stderr streams to be unbuffered. This option has no effect on the stdin stream",
		},
		{
			name: "-v",
			description:
				"Print a message each time a module is initialized, showing the place (filename or built-in module) from which it is loaded",
		},
		{
			name: "-W",
			description:
				"Warning control. Python’s warning machinery by default prints warning messages to sys.stderr",
			args: {},
		},
		{
			name: "-x",
			description:
				"Skip the first line of the source, allowing use of non-Unix forms of #!cmd. This is intended for a DOS specific hack only",
		},
		{
			name: "-X",
			description: "Reserved for various implementation-specific options",
			args: {
				suggestions: [
					{ name: "faulthandler" },
					{ name: "showrefcount" },
					{ name: "tracemalloc" },
					{ name: "showalloccount" },
					{ name: "importtime" },
					{ name: "dev" },
					{ name: "utf8" },
					{ name: "pycache_prefix=PATH" },
				],
			},
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/python3.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/python3.ts

```typescript
import { filepaths } from '../../helpers/filepaths';

const completionSpec: Fig.Spec = {
	name: "python3",
	description: "Run the python interpreter",
	generateSpec: async (tokens, executeShellCommand) => {
		const isDjangoManagePyFilePresentCommand = "cat manage.py | grep -q django";

		if (
			(
				await executeShellCommand({
					command: "bash",
					args: ["-c", isDjangoManagePyFilePresentCommand],
				})
			).status === 0
		) {
			return {
				name: "python3",
				subcommands: [{ name: "manage.py", loadSpec: "django-admin" }],
			};
		}
	},
	args: {
		name: "python script",
		isScript: true,
		generators: filepaths({
			extensions: ["py"],
			editFileSuggestions: { priority: 76 },
		}),
	},
	options: [
		{
			name: "-c",
			insertValue: "-c '{cursor}'",
			description:
				"Execute the Python code in command. command can be one or more statements separated by newlines, with significant leading whitespace as in normal module code",
			args: {
				name: "command",
				isCommand: true,
			},
		},
		{
			name: "-m",
			insertValue: "-m '{cursor}'",
			description:
				"Search sys.path for the named module and execute its contents as the __main__ module",
			args: {
				name: "command",
				isCommand: true,
			},
		},
		{
			name: ["-?", "-h", "--help"],
			description: "Print a short description of all command line options",
		},
		{
			name: ["-V", "--version"],
			description: "Print the Python version number and exit",
		},
		{
			name: "-b",
			description:
				"Issue a warning when comparing bytes or bytearray with str or bytes with int. Issue an error when the option is given twice (-bb)",
		},
		{
			name: "-B",
			description:
				"If given, Python won’t try to write .pyc files on the import of source modules",
		},
		{
			name: "--check-hash-based-pycs",
			description:
				"Control the validation behavior of hash-based .pyc files. See Cached bytecode invalidation",
			args: {
				suggestions: [
					{ name: "default" },
					{ name: "always" },
					{ name: "never" },
				],
			},
		},
		{
			name: "-d",
			description:
				"Turn on parser debugging output (for expert only, depending on compilation options)",
		},
		{
			name: "-E",
			description:
				"Ignore all PYTHON* environment variables, e.g. PYTHONPATH and PYTHONHOME, that might be set",
		},
		{
			name: "-i",
			description:
				"When a script is passed as first argument or the -c option is used, enter interactive mode after executing the script or the command, even when sys.stdin does not appear to be a terminal",
		},
		{
			name: "-I",
			description:
				"Run Python in isolated mode. This also implies -E and -s. In isolated mode sys.path contains neither the script’s directory nor the user’s site-packages directory",
		},
		{
			name: "-O",
			description:
				"Remove assert statements and any code conditional on the value of __debug__",
		},
		{
			name: "-OO",
			description: "Do -O and also discard docstrings",
		},
		{
			name: "-g",
			description:
				"Don’t display the copyright and version messages even in interactive mode",
		},
		{
			name: "-R",
			description:
				"Turn on hash randomization. This option only has an effect if the PYTHONHASHSEED environment variable is set to 0, since hash randomization is enabled by default",
		},
		{
			name: "-s",
			description: "Don’t add the user site-packages directory to sys.path",
		},
		{
			name: "-S",
			description:
				"Disable the import of the module site and the site-dependent manipulations of sys.path that it entails",
		},
		{
			name: "-u",
			description:
				"Force the stdout and stderr streams to be unbuffered. This option has no effect on the stdin stream",
		},
		{
			name: "-v",
			description:
				"Print a message each time a module is initialized, showing the place (filename or built-in module) from which it is loaded",
		},
		{
			name: "-W",
			description:
				"Warning control. Python’s warning machinery by default prints warning messages to sys.stderr",
			args: {},
		},
		{
			name: "-x",
			description:
				"Skip the first line of the source, allowing use of non-Unix forms of #!cmd. This is intended for a DOS specific hack only",
		},
		{
			name: "-X",
			description: "Reserved for various implementation-specific options",
			args: {
				suggestions: [
					{ name: "faulthandler" },
					{ name: "showrefcount" },
					{ name: "tracemalloc" },
					{ name: "showalloccount" },
					{ name: "importtime" },
					{ name: "dev" },
					{ name: "utf8" },
					{ name: "pycache_prefix=PATH" },
				],
			},
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/readlink.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/readlink.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "readlink",
	description: "Display file status",
	options: [
		{
			name: "-f",
			description:
				"Display information using the specified format; similar to printf(3) formats in that they start with %, are then followed by a sequence of formatting characters, and end in a character that selects the field of the struct stat which is to be formatted",
			args: {
				name: "format",
			},
		},
		{
			name: "-n",
			description:
				"Do not force a newline to appear at the end of each piece of output",
		},
	],
	args: {
		name: "file",
		description: "File(s) to readlink",
		isVariadic: true,
		template: "filepaths",
	},
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/rm.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/rm.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "rm",
	description: "Remove directory entries",
	args: {
		isVariadic: true,
		template: ["folders", "filepaths"],
	},

	options: [
		{
			name: ["-r", "-R"],
			description:
				"Recursive. Attempt to remove the file hierarchy rooted in each file argument",
			isDangerous: true,
		},
		{
			name: "-P",
			description: "Overwrite regular files before deleting them",
			isDangerous: true,
		},
		{
			name: "-d",
			description:
				"Attempt to remove directories as well as other types of files",
		},
		{
			name: "-f",
			description:
				"⚠️ Attempt to remove the files without prompting for confirmation",
			isDangerous: true,
		},
		{
			name: "-i",
			description: "Request confirmation before attempting to remove each file",
		},
		{
			name: "-v",
			description: "Be verbose when deleting files",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/rmdir.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/rmdir.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "rmdir",
	description: "Remove directories",
	args: {
		isVariadic: true,
		template: "folders",
	},

	options: [
		{
			name: "-p",
			description: "Remove each directory of path",
			isDangerous: true,
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/rsync.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/rsync.ts

```typescript
import { knownHosts, configHosts } from "./ssh";

const infoArgs: Fig.SingleOrArray<Fig.Arg> = [
	{ name: "BACKUP", description: "Mention files backed up" },
	{
		name: "COPY",
		description: "Mention files copied locally on the receiving side",
	},
	{ name: "DEL", description: "Mention deletions on the receiving side" },
	{
		name: "FLIST",
		description: "Mention file-list receiving/sending (levels 1-2)",
	},
	{
		name: "MISC",
		description: "Mention miscellaneous information (levels 1-2)",
	},
	{
		name: "MOUNT",
		description: "Mention mounts that were found or skipped",
	},
	{
		name: "NAME",
		description: "Mention 1) updated file/dir names, 2) unchanged names",
	},
	{
		name: "PROGRESS",
		description: "Mention 1) per-file progress or 2) total transfer progress",
	},
	{
		name: "REMOVE",
		description: "Mention files removed on the sending side",
	},
	{
		name: "SKIP",
		description: "Mention files that are skipped due to options used",
	},
	{
		name: "STATS",
		description: "Mention statistics at end of run (levels 1-3)",
	},
	{ name: "SYMSAFE", description: "Mention symlinks that are unsafe" },
	{ name: "ALL", description: "Set all --info options (e.g. all4)" },
	{
		name: "NONE",
		description: "Silence all --info options (same as all0)",
	},
	{ name: "HELP", description: "Output this help message" },
];

const debugArgs: Fig.SingleOrArray<Fig.Arg> = [
	{ name: "BACKUP", description: "Mention files backed up" },
	{
		name: "COPY",
		description: "Mention files copied locally on the receiving side",
	},
	{ name: "DEL", description: "Mention deletions on the receiving side" },
	{
		name: "FLIST",
		description: "Mention file-list receiving/sending (levels 1-2)",
	},
	{
		name: "MISC",
		description: "Mention miscellaneous information (levels 1-2)",
	},
	{
		name: "MOUNT",
		description: "Mention mounts that were found or skipped",
	},
	{
		name: "NAME",
		description: "Mention 1) updated file/dir names, 2) unchanged names",
	},
	{
		name: "PROGRESS",
		description: "Mention 1) per-file progress or 2) total transfer progress",
	},
	{
		name: "REMOVE",
		description: "Mention files removed on the sending side",
	},
	{
		name: "SKIP",
		description: "Mention files that are skipped due to options used",
	},
	{
		name: "STATS",
		description: "Mention statistics at end of run (levels 1-3)",
	},
	{ name: "SYMSAFE", description: "Mention symlinks that are unsafe" },
	{ name: "ALL", description: "Set all --info options (e.g. all4)" },
	{
		name: "NONE",
		description: "Silence all --info options (same as all0)",
	},
	{ name: "HELP", description: "Output this help message" },
];

const completionSpec: Fig.Spec = {
	name: "rsync",
	description:
		"Rsync is a file transfer program capable of efficient remote update via a fast differencing algorithm",
	args: [
		{
			name: "SRC",
			isVariadic: true,
			generators: [
				knownHosts,
				configHosts,
				{ template: ["history", "filepaths", "folders"] },
			],
		},
		{
			name: "DEST",
			generators: [
				knownHosts,
				configHosts,
				{ template: ["history", "filepaths", "folders"] },
			],
		},
	],
	options: [
		{
			name: ["-v", "--verbose"],
			description: "Increase verbosity",
		},
		{
			name: "--info",
			description: "Fine-grained informational verbosity",
			requiresSeparator: true,
			args: infoArgs,
		},
		{
			name: "--debug",
			description: "Fine-grained debug verbosity",
			requiresSeparator: true,
			args: debugArgs,
		},
		{
			name: "--msgs2stderr",
			description: "Special output handling for debugging",
		},
		{
			name: ["--quiet", "-q"],
			description: "Suppress non-error messages",
		},
		{
			name: "--no-motd",
			description: "Suppress daemon-mode MOTD (see manpage caveat)",
		},
		{
			name: ["--checksum", "-c"],
			description: "Skip based on checksum, not mod-time & size",
		},
		{
			name: ["-a", "--archive"],
			description: "Archive mode; equals -rlptgoD (no -H,-A,-X)",
			exclusiveOn: ["-H", "-A", "-X"],
		},
		{
			name: "--no-OPTION",
			description: "Turn off an implied OPTION (e.g. --no-D)",
		},
		{ name: ["-r", "--recursive"], description: "Recurse into directories" },
		{ name: ["-R", "--relative"], description: "Use relative path names" },
		{
			name: "--no-implied-dirs",
			description: "Don't send implied dirs with --relative",
			dependsOn: ["--relative"],
		},
		{
			name: ["-b", "--backup"],
			description: "Make backups (see --suffix & --backup-dir)",
		},
		{
			name: "--backup-dir",
			description: "Make backups into hierarchy based in DIR",
			requiresSeparator: true,
			args: {
				name: "DIR",
				template: "folders",
			},
		},
		{
			name: "--suffix",
			description: "Set backup suffix (default ~ w/o --backup-dir)",
			requiresSeparator: true,
			args: {
				name: "SUFFIX",
			},
		},
		{
			name: ["-u", "--update"],
			description: "Skip files that are newer on the receiver",
		},
		{
			name: "--inplace",
			description: "Update destination files in-place (SEE MAN PAGE)",
		},
		{ name: "--append", description: "Append data onto shorter files" },
		{
			name: "--append-verify",
			description: "Like --append, but with old data in file checksum",
		},
		{
			name: ["-d", "--dirs"],
			description: "Transfer directories without recursing",
			args: {
				name: "DIR",
				template: "folders",
			},
		},
		{ name: ["-l", "--links"], description: "Copy symlinks as symlinks" },
		{
			name: ["-L", "--copy-links"],
			description: "Transform symlink into referent file/dir",
		},
		{
			name: "--copy-unsafe-links",
			description: 'Only "unsafe" symlinks are transformed',
		},
		{
			name: "--safe-links",
			description: "Ignore symlinks that point outside the source tree",
		},
		{
			name: "--munge-links",
			description: "Munge symlinks to make them safer (but unusable)",
		},
		{
			name: ["-k", "--copy-dirlinks"],
			description: "Transform symlink to a dir into referent dir",
		},
		{
			name: ["-K", "--keep-dirlinks"],
			description: "Treat symlinked dir on receiver as dir",
		},
		{ name: ["-H", "--hard-links"], description: "Preserve hard links" },
		{ name: ["-p", "--perms"], description: "Preserve permissions" },
		{
			name: ["-E", "--executability"],
			description: "Preserve the file's executability",
		},
		{
			name: "--chmod",
			description: "Affect file and/or directory permissions",
			requiresSeparator: true,
			args: {
				name: "CHMOD",
			},
		},
		{
			name: ["-A", "--acls"],
			description: "Preserve ACLs (implies --perms)",
			dependsOn: ["--perms"],
		},
		{ name: ["-X", "--xattrs"], description: "Preserve extended attributes" },
		{
			name: ["-o", "--owner"],
			description: "Preserve owner (super-user only)",
		},
		{ name: ["-g", "--group"], description: "Preserve group" },
		{
			name: "--devices",
			description: "Preserve device files (super-user only)",
		},
		{
			name: "--copy-devices",
			description: "Copy device contents as regular file",
		},
		{ name: "--specials", description: "Preserve special files" },
		{ name: "-D", description: "Same as --devices --specials" },
		{ name: ["-t", "--times"], description: "Preserve modification times" },
		{
			name: ["-O", "--omit-dir-times"],
			description: "Omit directories from --times",
			dependsOn: ["--times"],
			args: {
				name: "DIR",
				template: "folders",
				isVariadic: true,
			},
		},
		{
			name: ["-J", "--omit-link-times"],
			description: "Omit symlinks from --times",
			dependsOn: ["--times"],
		},
		{ name: "--super", description: "Receiver attempts super-user activities" },
		{
			name: "--fake-super",
			description: "Store/recover privileged attrs using xattrs",
		},
		{
			name: ["-S", "--sparse"],
			description: "Turn sequences of nulls into sparse blocks",
		},
		{
			name: "--preallocate",
			description: "Allocate dest files before writing them",
		},
		{
			name: ["-n", "--dry-run"],
			description: "Perform a trial run with no changes made",
		},
		{
			name: ["-W", "--whole-file"],
			description: "Copy files whole (without delta-xfer algorithm)",
		},
		{
			name: "--checksum-choice",
			description: "Choose the checksum algorithms",
			requiresSeparator: true,
			args: {
				name: "ALGORITHM",
				suggestions: ["auto", "md4", "md5", "none"],
			},
		},
		{
			name: ["-x", "--one-file-system"],
			description: "Don't cross filesystem boundaries",
		},
		{
			name: ["-B", "--block-size"],
			description: "Force a fixed checksum block-size",
			requiresSeparator: true,
			args: {
				name: "SIZE",
			},
		},
		{
			name: ["-e", "--rsh"],
			description: "Specify the remote shell to use",
			requiresSeparator: true,
			args: {
				name: "COMMAND",
			},
		},
		{
			name: "--rsync-path",
			description: "Specify the rsync to run on the remote machine",
			requiresSeparator: true,
			args: {
				name: "PATH",
			},
		},
		{ name: "--existing", description: "Skip creating new files on receiver" },
		{
			name: "--ignore-existing",
			description: "Skip updating files that already exist on receiver",
		},
		{
			name: "--remove-source-files",
			description: "Sender removes synchronized files (non-dirs)",
		},
		{
			name: "--delete",
			description: "Delete extraneous files from destination dirs",
		},
		{
			name: "--delete-before",
			description: "Receiver deletes before transfer, not during",
		},
		{
			name: ["--delete-during", "--del"],
			description: "Receiver deletes during the transfer",
		},
		{
			name: "--delete-delay",
			description: "Find deletions during, delete after",
		},
		{
			name: "--delete-after",
			description: "Receiver deletes after transfer, not during",
		},
		{
			name: "--delete-excluded",
			description: "Also delete excluded files from destination dirs",
		},
		{
			name: "--ignore-missing-args",
			description: "Ignore missing source args without error",
		},
		{
			name: "--delete-missing-args",
			description: "Delete missing source args from destination",
		},
		{
			name: "--ignore-errors",
			description: "Delete even if there are I/O errors",
		},
		{
			name: "--force",
			description: "Force deletion of directories even if not empty",
		},
		{
			name: "--max-delete",
			description: "Don't delete more than NUM files",
			requiresSeparator: true,
			args: {
				name: "NUM",
			},
		},
		{
			name: "--max-size",
			description: "Don't transfer any file larger than SIZE",
			requiresSeparator: true,
			args: {
				name: "SIZE",
			},
		},
		{
			name: "--min-size",
			description: "Don't transfer any file smaller than SIZE",
			requiresSeparator: true,
			args: {
				name: "SIZE",
			},
		},
		{ name: "--partial", description: "Keep partially transferred files" },
		{
			name: "--partial-dir=DIR",
			description: "Put a partially transferred file into DIR",
			requiresSeparator: true,
			args: {
				name: "DIR",
				template: "folders",
			},
		},
		{
			name: "--delay-updates",
			description: "Put all updated files into place at transfer's end",
		},
		{
			name: ["-m", "--prune-empty-dirs"],
			description: "Prune empty directory chains from the file-list",
		},
		{
			name: "--numeric-ids",
			description: "Don't map uid/gid values by user/group name",
		},
		{
			name: "--usermap",
			description: "Custom username mapping",
			requiresSeparator: true,
			args: {
				name: "STRING",
			},
		},
		{
			name: "--groupmap",
			description: "Custom groupname mapping",
			requiresSeparator: true,
			args: {
				name: "STRING",
			},
		},
		{
			name: "--chown=USER:GROUP",
			description: "Simple username/groupname mapping",
			requiresSeparator: true,
			args: {
				name: "USER:GROUP",
			},
		},
		{
			name: "--timeout",
			description: "Set I/O timeout in seconds",
			requiresSeparator: true,
			args: {
				name: "SECONDS",
			},
		},
		{
			name: "--contimeout",
			description: "Set daemon connection timeout in seconds",
			requiresSeparator: true,
			args: {
				name: "SECONDS",
			},
		},
		{
			name: ["-I", "--ignore-times"],
			description: "Don't skip files that match in size and mod-time",
		},
		{
			name: "-M",
			description: "Send OPTION to the remote side only",
			args: {
				name: "OPTION",
			},
		},
		{
			name: "--remote-option",
			description: "Send OPTION to the remote side only",
			requiresSeparator: true,
			args: {
				name: "OPTION",
			},
		},
		{ name: "--size-only", description: "Skip files that match in size" },
		{
			name: "-@",
			description: "Set the accuracy for mod-time comparisons",
			args: {
				name: "NUM",
			},
		},
		{
			name: "--modify-window",
			description: "Set the accuracy for mod-time comparisons",
			requiresSeparator: true,
			args: {
				name: "NUM",
			},
		},
		{
			name: "-T",
			description: "Create temporary files in directory DIR",
			args: {
				name: "DIR",
				template: "folders",
			},
		},
		{
			name: "--temp-dir",
			description: "Create temporary files in directory DIR",
			requiresSeparator: true,
			args: {
				name: "DIR",
				template: "folders",
			},
		},
		{
			name: ["-y", "--fuzzy"],
			description: "Find similar file for basis if no dest file",
		},
		{
			name: "--compare-dest",
			description: "Also compare destination files relative to DIR",
			requiresSeparator: true,
			args: {
				name: "DIR",
				template: "folders",
			},
		},
		{
			name: "--copy-dest",
			description:
				"Also compare destination files relative to DIR and include copies of unchanged files",
			args: {
				name: "DIR",
				template: "folders",
			},
		},
		{
			name: "--link-dest",
			description: "Hardlink to files in DIR when unchanged",
			requiresSeparator: true,
			args: {
				name: "DIR",
				template: "folders",
			},
		},
		{
			name: ["-z", "--compress"],
			description: "Compress file data during the transfer",
		},
		{
			name: "--compress-level",
			description: "Explicitly set compression level",
			requiresSeparator: true,
			args: {
				name: "NUM",
				suggestions: Array.from(Array(10).keys()).map((v) => v.toString()),
			},
		},
		{
			name: "--skip-compress",
			description: "Skip compressing files with a suffix in LIST",
			requiresSeparator: true,
			args: {
				name: "LIST",
			},
		},
		{
			name: ["-C", "--cvs-exclude"],
			description: "Auto-ignore files the same way CVS does",
		},
		{
			name: "-f",
			description: "Add a file-filtering RULE",
			args: {
				name: "RULE",
			},
		},
		{
			name: "--filter",
			description: "Add a file-filtering RULE",
			requiresSeparator: true,
			args: {
				name: "RULE",
			},
		},
		{
			name: "-F",
			description: "Same as --filter='dir-merge /.rsync-filter'",
			args: {
				name: "DIR",
				template: "folders",
				isVariadic: true,
			},
		},
		{
			name: "--exclude",
			description: "Exclude files matching PATTERN",
			requiresSeparator: true,
			args: {
				name: "PATTERN",
			},
		},
		{
			name: "--exclude-from",
			description: "Read exclude patterns from FILE",
			requiresSeparator: true,
			args: {
				name: "FILE",
				template: "filepaths",
			},
		},
		{
			name: "--include",
			description: "Don't exclude files matching PATTERN",
			requiresSeparator: true,
			args: {
				name: "PATTERN",
			},
		},
		{
			name: "--include-from",
			description: "Read include patterns from FILE",
			requiresSeparator: true,
			args: {
				name: "FILE",
				template: "filepaths",
			},
		},
		{
			name: "--files-from",
			description: "Read list of source-file names from FILE",
			requiresSeparator: true,
			args: {
				name: "FILE",
				template: "filepaths",
			},
		},
		{
			name: ["-0", "--from0"],
			description: "All *-from/filter files are delimited by 0s",
		},
		{
			name: ["-s", "--protect-args"],
			description: "No space-splitting; only wildcard special-chars",
		},
		{
			name: "--address",
			description: "Bind address for outgoing socket to daemon",
			requiresSeparator: true,
			args: {
				name: "ADDRESS",
			},
		},
		{
			name: "--port",
			description: "Specify double-colon alternate port number",
			requiresSeparator: true,
			args: {
				name: "PORT",
			},
		},
		{
			name: "--sockopts",
			description: "Specify custom TCP options",
			requiresSeparator: true,
			args: {
				name: "OPTIONS",
			},
		},
		{
			name: "--blocking-io",
			description: "Use blocking I/O for the remote shell",
		},
		{ name: "--stats", description: "Give some file-transfer stats" },
		{
			name: ["-8", "--8-bit-output"],
			description: "Leave high-bit chars unescaped in output",
		},
		{
			name: ["-h", "--human-readable"],
			description: "Output numbers in a human-readable format",
		},
		{ name: "--progress", description: "Show progress during transfer" },
		{ name: "-P", description: "Same as --partial --progress" },
		{
			name: ["-i", "--itemize-changes"],
			description: "Output a change-summary for all updates",
		},
		{
			name: "--out-format",
			description: "Output updates using the specified FORMAT",
			requiresSeparator: true,
			args: {
				name: "FORMAT",
			},
		},
		{
			name: "--log-file",
			description: "Log what we're doing to the specified FILE",
			requiresSeparator: true,
			args: {
				name: "FILE",
				template: "filepaths",
			},
		},
		{
			name: "--log-file-format",
			description: "Log updates using the specified FMT",
			requiresSeparator: true,
			args: {
				name: "FMT",
			},
		},
		{
			name: "--password-file",
			description: "Read daemon-access password from FILE",
			requiresSeparator: true,
			args: {
				name: "FILE",
				template: "filepaths",
			},
		},
		{
			name: "--list-only",
			description: "List the files instead of copying them",
		},
		{
			name: "--bwlimit",
			description: "Limit socket I/O bandwidth",
			requiresSeparator: true,
			args: {
				name: "RATE",
			},
		},
		{
			name: "--stop-at",
			description: "Stop rsync at year-month-dayThour:minute",
			requiresSeparator: true,
			args: {
				name: "y-m-dTh:m",
			},
		},
		{
			name: "--time-limit",
			description: "Stop rsync after MINS minutes have elapsed",
			requiresSeparator: true,
			args: {
				name: "MINS",
			},
		},
		{
			name: "--outbuf",
			description: "Set output buffering to None, Line, or Block",
			requiresSeparator: true,
			args: {
				name: "BUFFER",
				suggestions: ["N", "L", "B"],
			},
		},
		{
			name: "--write-batch",
			description: "Write a batched update to FILE",
			requiresSeparator: true,
			args: {
				name: "FILE",
				template: "filepaths",
			},
		},
		{
			name: "--only-write-batch",
			description: "Like --write-batch but w/o updating destination",
			requiresSeparator: true,
			args: {
				name: "FILE",
				template: "filepaths",
			},
		},
		{
			name: "--read-batch",
			description: "Read a batched update from FILE",
			requiresSeparator: true,
			args: {
				name: "FILE",
				template: "filepaths",
			},
		},
		{
			name: "--protocol",
			description: "Force an older protocol version to be used",
			requiresSeparator: true,
			args: {
				name: "NUM",
			},
		},
		{
			name: "--iconv",
			description: "Request charset conversion of filenames",
			requiresSeparator: true,
			args: {
				name: "CONVERT_SPEC",
			},
		},
		{
			name: "--checksum-seed",
			description: "Set block/file checksum seed (advanced)",
			requiresSeparator: true,
			args: {
				name: "NUM",
			},
		},
		{
			name: "--noatime",
			description: "Do not alter atime when opening source files",
		},
		{ name: ["-4", "--ipv4"], description: "Prefer IPv4" },
		{ name: ["-6", "--ipv6"], description: "Prefer IPv6" },
		{ name: "--version", description: "Print version number" },
		{
			/*
			 * This is according with rsync spec.
			 */
			// eslint-disable-next-line @withfig/fig-linter/no-duplicate-options-subcommands
			name: ["-h", "--help"],
			description: "Show help for rsync (-h is --help only if used alone)",
		},
	],
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/ruby.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/ruby.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "ruby",
	description: "Interpreted object-oriented scripting language",
	options: [
		{
			name: "--copyright",
			description: "Prints the copyright notice",
		},
		{
			name: "--version",
			description: "Prints the version of Ruby interpreter",
		},
		{
			name: "-0",
			description:
				"Specifies the input record separator ($/) as an octal number",
			args: { name: "octal" },
		},
		{
			name: "-C",
			description: "Causes Ruby to switch to the directory",
			args: { name: "directory", template: "folders" },
		},
		{
			name: "-F",
			description: "Specifies input field separator ($;)",
			args: { name: "pattern" },
		},
		{
			name: "-I",
			description:
				"Used to tell Ruby where to load the library scripts. Directory path will be added to the load-path variable ($:)",
			args: { name: "directory", template: "folders" },
		},
		{
			name: "-K",
			description: "Specifies KANJI (Japanese) encoding",
			args: { name: "kcode" },
		},
		{
			name: "-S",
			description:
				"Makes Ruby use the PATH environment variable to search for script, unless its name begins with a slash. This is used to emulate #! on machines that don't support it, in the following manner: #! /usr/local/bin/ruby # This line makes the next one a comment in Ruby \\ exec /usr/local/bin/ruby -S $0 $*",
		},
		{
			name: "-T",
			description: "Turns on taint checks at the specified level (default 1)",
			args: { name: "level" },
		},
		{
			name: "-a",
			description: "Turns on auto-split mode when used with -n or -p",
		},
		{
			name: "-c",
			description:
				"Causes Ruby to check the syntax of the script and exit without executing. If there are no syntax errors, Ruby will print “Syntax OK” to the standard output",
		},
		{
			name: ["-d", "--debug"],
			description: "Turns on debug mode. $DEBUG will be set to true",
		},
		{
			name: "-e",
			description:
				"Specifies script from command-line while telling Ruby not to search the rest of arguments for a script file name",
			args: { name: "command" },
		},
		{
			name: ["-h", "--help"],
			description: "Prints a summary of the options",
		},
		{
			name: "-i",
			description:
				"Specifies in-place-edit mode. The extension, if specified, is added to old file name to make a backup copy",
			args: { name: "extension", isOptional: true },
		},
		{
			name: "-l",
			description:
				"Enables automatic line-ending processing, which means to firstly set $\\ to the value of $/, and secondly chops every line read using chop!",
		},
		{
			name: "-n",
			description:
				"Causes Ruby to assume the following loop around your script",
		},
		{
			name: "-p",
			description: `Acts mostly same as -n switch, but print the value of variable $_ at the each end of the loop`,
		},
		{
			name: "-r",
			description: "Causes Ruby to load the library using require",
			args: { name: "library" },
		},
		{
			name: "-s",
			description:
				"Enables some switch parsing for switches after script name but before any file name arguments (or before a --)",
		},
		{
			name: ["-v", "--verbose"],
			description: "Enables verbose mode",
		},
		{
			name: "-w",
			description:
				"Enables verbose mode without printing version message at the beginning. It sets the $VERBOSE variable to true",
		},
		{
			name: "-x",
			description:
				"Tells Ruby that the script is embedded in a message. Leading garbage will be discarded until the first that starts with “#!” and contains the string, “ruby”. Any meaningful switches on that line will applied. The end of script must be specified with either EOF, ^D (control-D), ^Z (control-Z), or reserved word __END__. If the directory name is specified, Ruby will switch to that directory before executing script",
			args: { name: "directory", template: "folders" },
		},
		{
			name: ["-y", "--yydebug"],
			description:
				"Turns on compiler debug mode. Ruby will print a bunch of internal state messages during compiling scripts. You don't have to specify this switch, unless you are going to debug the Ruby interpreter",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/ruff.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/ruff.ts

```typescript
const GlobalOptions: Fig.Option[] = [
	{
		name: ["-v", "--verbose"],
		description: "Enable verbose logging",
	},
	{
		name: ["-q", "--quiet"],
		description: "Print diagnostics, but nothing else",
	},
	{
		name: ["-s", "--silent"],
		description:
			'Disable all logging (but still exit with status code "1" upon detecting diagnostics)',
	},
	{
		name: "--config",
		description:
			"Path to the `pyproject.toml` or `ruff.toml` file to use for configuration",
		args: {
			name: "config",
			isOptional: true,
			template: "filepaths",
		},
	},
	{
		name: "--isolated",
		description: "Ignore all configuration files",
	},
	{
		name: "--help",
		description: "Print help",
	},
];

const checkOptions: Fig.Option[] = [
	{
		name: "--fix",
		description: "Apply fixes to resolve lint violations",
	},
	{
		name: "--unsafe-fixes",
		description:
			"Include fixes that may not retain the original intent of the code",
	},
	{
		name: "--show-fixes",
		description: "Show an enumeration of all fixed lint violations",
	},
	{
		name: "--diff",
		description:
			"Avoid writing any fixed files back; instead, output a diff for each changed file to stdout, and exit 0 if there are no diffs. Implies `--fix-only`",
	},
	{
		name: ["-w", "--watch"],
		description: "Run in watch mode by re-running whenever files change",
	},
	{
		name: "--fix-only",
		description:
			"Apply fixes to resolve lint violations, but don't report on, or exit non-zero for, leftover violations. Implies `--fix`",
	},
	{
		name: "--ignore-noqa",
		description: "Ignore any `# noqa` comments",
	},
	{
		name: "--output-format",
		description:
			"Output serialization format for violations. The default serialization format is 'full'",
		args: {
			name: "output_format",
			isOptional: true,
			suggestions: [
				"concise",
				"full",
				"json",
				"json-lines",
				"junit",
				"grouped",
				"github",
				"gitlab",
				"pylint",
				"rdjson",
				"azure",
				"sarif",
			],
		},
	},
	{
		name: ["-o", "--output-file"],
		description: "Specify file to write the linter output to (default: stdout)",
		args: {
			name: "output_file",
			isOptional: true,
			template: "filepaths",
		},
	},
	{
		name: "--target-version",
		description: "The minimum Python version that should be supported",
		args: {
			name: "target_version",
			isOptional: true,
			suggestions: ["py37", "py38", "py39", "py310", "py311", "py312", "py313"],
		},
	},
	{
		name: "--preview",
		description:
			"Enable preview mode; checks will include unstable rules and fixes",
	},
	{
		name: "--extension",
		description:
			"List of mappings from file extension to language (one of `python`, `ipynb`, `pyi`). For example, to treat `.ipy` files as IPython notebooks, use `--extension ipy:ipynb`",
		args: {
			name: "extension",
			isOptional: true,
		},
	},
	{
		name: "--statistics",
		description: "Show counts for every rule with at least one violation",
	},
	{
		name: "--add-noqa",
		description:
			"Enable automatic additions of `noqa` directives to failing lines",
	},
	{
		name: "--show-files",
		description:
			"See the files Ruff will be run against with the current settings",
	},
	{
		name: "--show-settings",
		description: "See the settings Ruff will use to lint a given Python file",
	},
	{
		name: ["-h", "--help"],
		description: "Print help",
	},
	{
		name: "--select",
		description:
			"Comma-separated list of rule codes to enable (or ALL, to enable all rules)",
		args: {
			name: "select",
			isOptional: true,
		},
	},
	{
		name: "--ignore",
		description: "Comma-separated list of rule codes to disable",
		args: {
			name: "ignore",
			isOptional: true,
		},
	},
	{
		name: "--extend-select",
		description:
			"Like --select, but adds additional rule codes on top of the selected ones",
		args: {
			name: "extend_select",
			isOptional: true,
		},
	},
	{
		name: "--per-file-ignores",
		description: "List of mappings from file pattern to code to exclude",
		args: {
			name: "per_file_ignores",
			isOptional: true,
		},
	},
	{
		name: "--extend-per-file-ignores",
		description:
			"Like `--per-file-ignores`, but adds additional ignores on top of those already specified",
		args: {
			name: "extend_per_file_ignores",
			isOptional: true,
		},
	},
	{
		name: "--fixable",
		description:
			"List of rule codes to treat as eligible for fix. Only applicable when fix itself is enabled (e.g., via `--fix`)",
		args: {
			name: "fixable",
			isOptional: true,
		},
	},
	{
		name: "--unfixable",
		description:
			"List of rule codes to treat as ineligible for fix. Only applicable when fix itself is enabled (e.g., via `--fix`)",
		args: {
			name: "unfixable",
			isOptional: true,
		},
	},
	{
		name: "--extend-fixable",
		description:
			"Like --fixable, but adds additional rule codes on top of those already specified",
		args: {
			name: "extend_fixable",
			isOptional: true,
		},
	},
	{
		name: "--exclude",
		description:
			"List of paths, used to omit files and/or directories from analysis",
		args: {
			name: "exclude",
			isOptional: true,
		},
	},
	{
		name: "--extend-exclude",
		description:
			"Like --exclude, but adds additional files and directories on top of those already excluded",
		args: {
			name: "extend_exclude",
			isOptional: true,
		},
	},
	{
		name: "--respect-gitignore",
		description:
			"Respect file exclusions via `.gitignore` and other standard ignore files",
	},
	{
		name: "--force-exclude",
		description:
			"Enforce exclusions, even for paths passed to Ruff directly on the command-line",
	},
	{
		name: ["-n", "--no-cache"],
		description: "Disable cache reads",
	},
	{
		name: "--cache-dir",
		description: "Path to the cache directory",
		args: {
			name: "cache_dir",
			isOptional: true,
			template: "filepaths",
		},
	},
	{
		name: "--stdin-filename",
		description: "The name of the file when passing it through stdin",
		args: {
			name: "stdin_filename",
			isOptional: true,
			template: "filepaths",
		},
	},
	{
		name: ["-e", "--exit-zero"],
		description:
			'Exit with status code "0", even upon detecting lint violations',
	},
	{
		name: "--exit-non-zero-on-fix",
		description:
			"Exit with a non-zero status code if any files were modified via fix, even if no lint violations remain",
	},
];

const formatOptions: Fig.Option[] = [
	{
		name: "--check",
		description:
			"Avoid writing any formatted files back; instead, exit with a non-zero status code if any files would have been modified, and zero otherwise",
	},
	{
		name: "--diff",
		description:
			"Avoid writing any formatted files back; instead, exit with a non-zero status code and the difference between the current file and how the formatted file would look like",
	},
	{
		name: "--extension",
		description:
			"List of mappings from file extension to language (one of `python`, `ipynb`, `pyi`). For example, to treat `.ipy` files as IPython notebooks, use `--extension ipy:ipynb`",
		args: {
			name: "extension",
			isOptional: true,
		},
	},
	{
		name: "--target-version",
		description: "The minimum Python version that should be supported",
		args: {
			name: "target_version",
			isOptional: true,
			suggestions: ["py37", "py38", "py39", "py310", "py311", "py312", "py313"],
		},
	},
	{
		name: "--preview",
		description:
			"Enable preview mode; enables unstable formatting. Use `--no-preview` to disable",
	},
	{
		name: ["-n", "--no-cache"],
		description: "Disable cache reads (env: RUFF_NO_CACHE=)",
	},
	{
		name: "--cache-dir",
		description: "Path to the cache directory (env: RUFF_CACHE_DIR=)",
		args: {
			name: "cache_dir",
			template: "filepaths",
		},
	},
	{
		name: "--stdin-filename",
		description: "The name of the file when passing it through stdin",
		args: {
			name: "stdin_filename",
			template: "filepaths",
		},
	},
	{
		name: "--respect-gitignore",
		description:
			"Respect file exclusions via `.gitignore` and other standard ignore files",
	},
	{
		name: "--exclude",
		description:
			"List of paths, used to omit files and/or directories from analysis",
		args: {
			name: "exclude",
			isOptional: true,
		},
	},
	{
		name: "--force-exclude",
		description:
			"Enforce exclusions, even for paths passed to Ruff directly on the command-line",
	},
	{
		name: "--line-length",
		description: "Set the line-length",
		args: {
			name: "line_length",
			isOptional: true,
		},
	},
	{
		name: "--range",
		description:
			"When specified, Ruff will try to only format the code in the given range",
		args: {
			name: "range",
			isOptional: true,
		},
	},
];

const rules: Fig.Suggestion[] = [
	{ name: "F401", description: "Unused-import" },
	{ name: "F402", description: "Import-shadowed-by-loop-var" },
	{ name: "F403", description: "Undefined-local-with-import-star" },
	{ name: "F404", description: "Late-future-import" },
	{ name: "F405", description: "Undefined-local-with-import-star-usage" },
	{
		name: "F406",
		description: "Undefined-local-with-nested-import-star-usage",
	},
	{ name: "F407", description: "Future-feature-not-defined" },
	{ name: "F501", description: "Percent-format-invalid-format" },
	{ name: "F502", description: "Percent-format-expected-mapping" },
	{ name: "F503", description: "Percent-format-expected-sequence" },
	{ name: "F504", description: "Percent-format-extra-named-arguments" },
	{ name: "F505", description: "Percent-format-missing-argument" },
	{
		name: "F506",
		description: "Percent-format-mixed-positional-and-named",
	},
	{ name: "F507", description: "Percent-format-positional-count-mismatch" },
	{ name: "F508", description: "Percent-format-star-requires-sequence" },
	{
		name: "F509",
		description: "Percent-format-unsupported-format-character",
	},
	{ name: "F521", description: "String-dot-format-invalid-format" },
	{ name: "F522", description: "String-dot-format-extra-named-arguments" },
	{
		name: "F523",
		description: "String-dot-format-extra-positional-arguments",
	},
	{ name: "F524", description: "String-dot-format-missing-arguments" },
	{ name: "F525", description: "String-dot-format-mixing-automatic" },
	{ name: "F541", description: "F-string-missing-placeholders" },
	{ name: "F601", description: "Multi-value-repeated-key-literal" },
	{ name: "F602", description: "Multi-value-repeated-key-variable" },
	{ name: "F621", description: "Expressions-in-star-assignment" },
	{ name: "F622", description: "Multiple-starred-expressions" },
	{ name: "F631", description: "Assert-tuple" },
	{ name: "F632", description: "Is-literal" },
	{ name: "F633", description: "Invalid-print-syntax" },
	{ name: "F634", description: "If-tuple" },
	{ name: "F701", description: "Break-outside-loop" },
	{ name: "F702", description: "Continue-outside-loop" },
	{ name: "F704", description: "Yield-outside-function" },
	{ name: "F706", description: "Return-outside-function" },
	{ name: "F707", description: "Default-except-not-last" },
	{ name: "F722", description: "Forward-annotation-syntax-error" },
	{ name: "F811", description: "Redefined-while-unused" },
	{ name: "F821", description: "Undefined-name" },
	{ name: "F822", description: "Undefined-export" },
	{ name: "F823", description: "Undefined-local" },
	{ name: "F841", description: "Unused-variable" },
	{ name: "F842", description: "Unused-annotation" },
	{ name: "F901", description: "Raise-not-implemented" },
	{ name: "E101", description: "Mixed-spaces-and-tabs" },
	{ name: "E111", description: "Indentation-with-invalid-multiple" },
	{ name: "E112", description: "No-indented-block" },
	{ name: "E113", description: "Unexpected-indentation" },
	{
		name: "E114",
		description: "Indentation-with-invalid-multiple-comment",
	},
	{ name: "E115", description: "No-indented-block-comment" },
	{ name: "E116", description: "Unexpected-indentation-comment" },
	{ name: "E117", description: "Over-indented" },
	{ name: "E201", description: "Whitespace-after-open-bracket" },
	{ name: "E202", description: "Whitespace-before-close-bracket" },
	{ name: "E203", description: "Whitespace-before-punctuation" },
	{ name: "E204", description: "Whitespace-after-decorator" },
	{ name: "E211", description: "Whitespace-before-parameters" },
	{ name: "E221", description: "Multiple-spaces-before-operator" },
	{ name: "E222", description: "Multiple-spaces-after-operator" },
	{ name: "E223", description: "Tab-before-operator" },
	{ name: "E224", description: "Tab-after-operator" },
	{ name: "E225", description: "Missing-whitespace-around-operator" },
	{
		name: "E226",
		description: "Missing-whitespace-around-arithmetic-operator",
	},
	{
		name: "E227",
		description: "Missing-whitespace-around-bitwise-or-shift-operator",
	},
	{
		name: "E228",
		description: "Missing-whitespace-around-modulo-operator",
	},
	{ name: "E231", description: "Missing-whitespace" },
	{ name: "E241", description: "Multiple-spaces-after-comma" },
	{ name: "E242", description: "Tab-after-comma" },
	{
		name: "E251",
		description: "Unexpected-spaces-around-keyword-parameter-equals",
	},
	{
		name: "E252",
		description: "Missing-whitespace-around-parameter-equals",
	},
	{ name: "E261", description: "Too-few-spaces-before-inline-comment" },
	{ name: "E262", description: "No-space-after-inline-comment" },
	{ name: "E265", description: "No-space-after-block-comment" },
	{
		name: "E266",
		description: "Multiple-leading-hashes-for-block-comment",
	},
	{ name: "E271", description: "Multiple-spaces-after-keyword" },
	{ name: "E272", description: "Multiple-spaces-before-keyword" },
	{ name: "E273", description: "Tab-after-keyword" },
	{ name: "E274", description: "Tab-before-keyword" },
	{ name: "E275", description: "Missing-whitespace-after-keyword" },
	{ name: "E301", description: "Blank-line-between-methods" },
	{ name: "E302", description: "Blank-lines-top-level" },
	{ name: "E303", description: "Too-many-blank-lines" },
	{ name: "E304", description: "Blank-line-after-decorator" },
	{ name: "E305", description: "Blank-lines-after-function-or-class" },
	{ name: "E306", description: "Blank-lines-before-nested-definition" },
	{ name: "E401", description: "Multiple-imports-on-one-line" },
	{ name: "E402", description: "Module-import-not-at-top-of-file" },
	{ name: "E501", description: "Line-too-long" },
	{ name: "E502", description: "Redundant-backslash" },
	{ name: "E701", description: "Multiple-statements-on-one-line-colon" },
	{
		name: "E702",
		description: "Multiple-statements-on-one-line-semicolon",
	},
	{ name: "E703", description: "Useless-semicolon" },
	{ name: "E711", description: "None-comparison" },
	{ name: "E712", description: "True-false-comparison" },
	{ name: "E713", description: "Not-in-test" },
	{ name: "E714", description: "Not-is-test" },
	{ name: "E721", description: "Type-comparison" },
	{ name: "E722", description: "Bare-except" },
	{ name: "E731", description: "Lambda-assignment" },
	{ name: "E741", description: "Ambiguous-variable-name" },
	{ name: "E742", description: "Ambiguous-class-name" },
	{ name: "E743", description: "Ambiguous-function-name" },
	{ name: "E902", description: "Io-error" },
	{ name: "W191", description: "Tab-indentation" },
	{ name: "W291", description: "Trailing-whitespace" },
	{ name: "W292", description: "Missing-newline-at-end-of-file" },
	{ name: "W293", description: "Blank-line-with-whitespace" },
	{ name: "W391", description: "Too-many-newlines-at-end-of-file" },
	{ name: "W505", description: "Doc-line-too-long" },
	{ name: "W605", description: "Invalid-escape-sequence" },
	{ name: "C901", description: "Complex-structure" },
	{ name: "N801", description: "Invalid-class-name" },
	{ name: "N802", description: "Invalid-function-name" },
	{ name: "N803", description: "Invalid-argument-name" },
	{
		name: "N804",
		description: "Invalid-first-argument-name-for-class-method",
	},
	{ name: "N805", description: "Invalid-first-argument-name-for-method" },
	{ name: "N806", description: "Non-lowercase-variable-in-function" },
	{ name: "N807", description: "Dunder-function-name" },
	{ name: "N811", description: "Constant-imported-as-non-constant" },
	{ name: "N812", description: "Lowercase-imported-as-non-lowercase" },
	{ name: "N813", description: "Camelcase-imported-as-lowercase" },
	{ name: "N814", description: "Camelcase-imported-as-constant" },
	{ name: "N815", description: "Mixed-case-variable-in-class-scope" },
	{ name: "N816", description: "Mixed-case-variable-in-global-scope" },
	{ name: "N817", description: "Camelcase-imported-as-acronym" },
	{ name: "N818", description: "Error-suffix-on-exception-name" },
	{ name: "N999", description: "Invalid-module-name" },
	{ name: "D100", description: "Undocumented-public-module" },
	{ name: "D101", description: "Undocumented-public-class" },
	{ name: "D102", description: "Undocumented-public-method" },
	{ name: "D103", description: "Undocumented-public-function" },
	{ name: "D104", description: "Undocumented-public-package" },
	{ name: "D105", description: "Undocumented-magic-method" },
	{ name: "D106", description: "Undocumented-public-nested-class" },
	{ name: "D107", description: "Undocumented-public-init" },
	{ name: "D200", description: "Fits-on-one-line" },
	{ name: "D201", description: "No-blank-line-before-function" },
	{ name: "D202", description: "No-blank-line-after-function" },
	{ name: "D203", description: "One-blank-line-before-class" },
	{ name: "D204", description: "One-blank-line-after-class" },
	{ name: "D205", description: "Blank-line-after-summary" },
	{ name: "D206", description: "Indent-with-spaces" },
	{ name: "D207", description: "Under-indentation" },
	{ name: "D208", description: "Over-indentation" },
	{ name: "D209", description: "New-line-after-last-paragraph" },
	{ name: "D210", description: "Surrounding-whitespace" },
	{ name: "D211", description: "Blank-line-before-class" },
	{ name: "D212", description: "Multi-line-summary-first-line" },
	{ name: "D213", description: "Multi-line-summary-second-line" },
	{ name: "D214", description: "Section-not-over-indented" },
	{ name: "D215", description: "Section-underline-not-over-indented" },
	{ name: "D300", description: "Triple-single-quotes" },
	{ name: "D301", description: "Escape-sequence-in-docstring" },
	{ name: "D400", description: "Ends-in-period" },
	{ name: "D401", description: "Non-imperative-mood" },
	{ name: "D402", description: "No-signature" },
	{ name: "D403", description: "First-line-capitalized" },
	{ name: "D404", description: "Docstring-starts-with-this" },
	{ name: "D405", description: "Capitalize-section-name" },
	{ name: "D406", description: "New-line-after-section-name" },
	{ name: "D407", description: "Dashed-underline-after-section" },
	{ name: "D408", description: "Section-underline-after-name" },
	{ name: "D409", description: "Section-underline-matches-section-length" },
	{ name: "D410", description: "No-blank-line-after-section" },
	{ name: "D411", description: "No-blank-line-before-section" },
	{ name: "D412", description: "Blank-lines-between-header-and-content" },
	{ name: "D413", description: "Blank-line-after-last-section" },
	{ name: "D414", description: "Empty-docstring-section" },
	{ name: "D415", description: "Ends-in-punctuation" },
	{ name: "D416", description: "Section-name-ends-in-colon" },
	{ name: "D417", description: "Undocumented-param" },
	{ name: "D418", description: "Overload-with-docstring" },
	{ name: "D419", description: "Empty-docstring" },
	{ name: "I001", description: "Unsorted-imports" },
	{ name: "I002", description: "Missing-required-import" },
	{ name: "UP001", description: "Useless-metaclass-type" },
	{ name: "UP003", description: "Type-of-primitive" },
	{ name: "UP004", description: "Useless-object-inheritance" },
	{ name: "UP005", description: "Deprecated-unittest-alias" },
	{ name: "UP006", description: "Non-pep585-annotation" },
	{ name: "UP007", description: "Non-pep604-annotation" },
	{ name: "UP008", description: "Super-call-with-parameters" },
	{ name: "UP009", description: "Utf8-encoding-declaration" },
	{ name: "UP010", description: "Unnecessary-future-import" },
	{ name: "UP011", description: "Lru-cache-without-parameters" },
	{ name: "UP012", description: "Unnecessary-encode-utf8" },
	{ name: "UP013", description: "Convert-typed-dict-functional-to-class" },
	{ name: "UP014", description: "Convert-named-tuple-functional-to-class" },
	{ name: "UP015", description: "Redundant-open-modes" },
	{ name: "UP017", description: "Datetime-timezone-utc" },
	{ name: "UP018", description: "Native-literals" },
	{ name: "UP019", description: "Typing-text-str-alias" },
	{ name: "UP020", description: "Open-alias" },
	{ name: "UP021", description: "Replace-universal-newlines" },
	{ name: "UP022", description: "Replace-stdout-stderr" },
	{ name: "UP023", description: "Deprecated-c-element-tree" },
	{ name: "UP024", description: "Os-error-alias" },
	{ name: "UP025", description: "Unicode-kind-prefix" },
	{ name: "UP026", description: "Deprecated-mock-import" },
	{ name: "UP027", description: "Unpacked-list-comprehension" },
	{ name: "UP028", description: "Yield-in-for-loop" },
	{ name: "UP029", description: "Unnecessary-builtin-import" },
	{ name: "UP030", description: "Format-literals" },
	{ name: "UP031", description: "Printf-string-formatting" },
	{ name: "UP032", description: "F-string" },
	{ name: "UP033", description: "Lru-cache-with-maxsize-none" },
	{ name: "UP034", description: "Extraneous-parentheses" },
	{ name: "UP035", description: "Deprecated-import" },
	{ name: "UP036", description: "Outdated-version-block" },
	{ name: "UP037", description: "Quoted-annotation" },
	{ name: "UP038", description: "Non-pep604-isinstance" },
	{ name: "UP039", description: "Unnecessary-class-parentheses" },
	{ name: "UP040", description: "Non-pep695-type-alias" },
	{ name: "UP041", description: "Timeout-error-alias" },
	{ name: "UP042", description: "Replace-str-enum" },
	{ name: "UP043", description: "Unnecessary-default-type-args" },
	{ name: "UP044", description: "Non-pep646-unpack" },
	{ name: "YTT101", description: "Sys-version-slice3" },
	{ name: "YTT102", description: "Sys-version2" },
	{ name: "YTT103", description: "Sys-version-cmp-str3" },
	{ name: "YTT201", description: "Sys-version-info0-eq3" },
	{ name: "YTT202", description: "Six-py3" },
	{ name: "YTT203", description: "Sys-version-info1-cmp-int" },
	{ name: "YTT204", description: "Sys-version-info-minor-cmp-int" },
	{ name: "YTT301", description: "Sys-version0" },
	{ name: "YTT302", description: "Sys-version-cmp-str10" },
	{ name: "YTT303", description: "Sys-version-slice1" },
	{ name: "ANN001", description: "Missing-type-function-argument" },
	{ name: "ANN002", description: "Missing-type-args" },
	{ name: "ANN003", description: "Missing-type-kwargs" },
	{
		name: "ANN201",
		description: "Missing-return-type-undocumented-public-function",
	},
	{ name: "ANN202", description: "Missing-return-type-private-function" },
	{ name: "ANN204", description: "Missing-return-type-special-method" },
	{ name: "ANN205", description: "Missing-return-type-static-method" },
	{ name: "ANN206", description: "Missing-return-type-class-method" },
	{ name: "ANN401", description: "Any-type" },
	{ name: "ASYNC100", description: "Cancel-scope-no-checkpoint" },
	{ name: "ASYNC105", description: "Trio-sync-call" },
	{ name: "ASYNC109", description: "Async-function-with-timeout" },
	{ name: "ASYNC110", description: "Async-busy-wait" },
	{ name: "ASYNC115", description: "Async-zero-sleep" },
	{ name: "ASYNC116", description: "Long-sleep-not-forever" },
	{ name: "ASYNC210", description: "Blocking-http-call-in-async-function" },
	{ name: "ASYNC220", description: "Create-subprocess-in-async-function" },
	{ name: "ASYNC221", description: "Run-process-in-async-function" },
	{ name: "ASYNC222", description: "Wait-for-process-in-async-function" },
	{ name: "ASYNC230", description: "Blocking-open-call-in-async-function" },
	{ name: "ASYNC251", description: "Blocking-sleep-in-async-function" },
	{ name: "S101", description: "Assert" },
	{ name: "S102", description: "Exec-builtin" },
	{ name: "S103", description: "Bad-file-permissions" },
	{ name: "S104", description: "Hardcoded-bind-all-interfaces" },
	{ name: "S105", description: "Hardcoded-password-string" },
	{ name: "S106", description: "Hardcoded-password-func-arg" },
	{ name: "S107", description: "Hardcoded-password-default" },
	{ name: "S108", description: "Hardcoded-temp-file" },
	{ name: "S110", description: "Try-except-pass" },
	{ name: "S112", description: "Try-except-continue" },
	{ name: "S113", description: "Request-without-timeout" },
	{ name: "S201", description: "Flask-debug-true" },
	{ name: "S202", description: "Tarfile-unsafe-members" },
	{ name: "S301", description: "Suspicious-pickle-usage" },
	{ name: "S302", description: "Suspicious-marshal-usage" },
	{ name: "S303", description: "Suspicious-insecure-hash-usage" },
	{ name: "S304", description: "Suspicious-insecure-cipher-usage" },
	{ name: "S305", description: "Suspicious-insecure-cipher-mode-usage" },
	{ name: "S306", description: "Suspicious-mktemp-usage" },
	{ name: "S307", description: "Suspicious-eval-usage" },
	{ name: "S308", description: "Suspicious-mark-safe-usage" },
	{ name: "S310", description: "Suspicious-url-open-usage" },
	{
		name: "S311",
		description: "Suspicious-non-cryptographic-random-usage",
	},
	{ name: "S312", description: "Suspicious-telnet-usage" },
	{ name: "S313", description: "Suspicious-xmlc-element-tree-usage" },
	{ name: "S314", description: "Suspicious-xml-element-tree-usage" },
	{ name: "S315", description: "Suspicious-xml-expat-reader-usage" },
	{ name: "S316", description: "Suspicious-xml-expat-builder-usage" },
	{ name: "S317", description: "Suspicious-xml-sax-usage" },
	{ name: "S318", description: "Suspicious-xml-mini-dom-usage" },
	{ name: "S319", description: "Suspicious-xml-pull-dom-usage" },
	{ name: "S320", description: "Suspicious-xmle-tree-usage" },
	{ name: "S321", description: "Suspicious-ftp-lib-usage" },
	{ name: "S323", description: "Suspicious-unverified-context-usage" },
	{ name: "S324", description: "Hashlib-insecure-hash-function" },
	{ name: "S401", description: "Suspicious-telnetlib-import" },
	{ name: "S402", description: "Suspicious-ftplib-import" },
	{ name: "S403", description: "Suspicious-pickle-import" },
	{ name: "S404", description: "Suspicious-subprocess-import" },
	{ name: "S405", description: "Suspicious-xml-etree-import" },
	{ name: "S406", description: "Suspicious-xml-sax-import" },
	{ name: "S407", description: "Suspicious-xml-expat-import" },
	{ name: "S408", description: "Suspicious-xml-minidom-import" },
	{ name: "S409", description: "Suspicious-xml-pulldom-import" },
	{ name: "S410", description: "Suspicious-lxml-import" },
	{ name: "S411", description: "Suspicious-xmlrpc-import" },
	{ name: "S412", description: "Suspicious-httpoxy-import" },
	{ name: "S413", description: "Suspicious-pycrypto-import" },
	{ name: "S415", description: "Suspicious-pyghmi-import" },
	{ name: "S501", description: "Request-with-no-cert-validation" },
	{ name: "S502", description: "Ssl-insecure-version" },
	{ name: "S503", description: "Ssl-with-bad-defaults" },
	{ name: "S504", description: "Ssl-with-no-version" },
	{ name: "S505", description: "Weak-cryptographic-key" },
	{ name: "S506", description: "Unsafe-yaml-load" },
	{ name: "S507", description: "Ssh-no-host-key-verification" },
	{ name: "S508", description: "Snmp-insecure-version" },
	{ name: "S509", description: "Snmp-weak-cryptography" },
	{ name: "S601", description: "Paramiko-call" },
	{ name: "S602", description: "Subprocess-popen-with-shell-equals-true" },
	{ name: "S603", description: "Subprocess-without-shell-equals-true" },
	{ name: "S604", description: "Call-with-shell-equals-true" },
	{ name: "S605", description: "Start-process-with-a-shell" },
	{ name: "S606", description: "Start-process-with-no-shell" },
	{ name: "S607", description: "Start-process-with-partial-path" },
	{ name: "S608", description: "Hardcoded-sql-expression" },
	{ name: "S609", description: "Unix-command-wildcard-injection" },
	{ name: "S610", description: "Django-extra" },
	{ name: "S611", description: "Django-raw-sql" },
	{ name: "S612", description: "Logging-config-insecure-listen" },
	{ name: "S701", description: "Jinja2-autoescape-false" },
	{ name: "S702", description: "Mako-templates" },
	{ name: "BLE001", description: "Do not catch blind exception" },
	{ name: "B002", description: "Unary-prefix-increment-decrement" },
	{ name: "B003", description: "Assignment-to-os-environ" },
	{ name: "B004", description: "Unreliable-callable-check" },
	{ name: "B005", description: "Strip-with-multi-characters" },
	{ name: "B006", description: "Mutable-argument-default" },
	{ name: "B007", description: "Unused-loop-control-variable" },
	{ name: "B008", description: "Function-call-in-default-argument" },
	{ name: "B009", description: "Get-attr-with-constant" },
	{ name: "B010", description: "Set-attr-with-constant" },
	{ name: "B011", description: "Assert-false" },
	{ name: "B012", description: "Jump-statement-in-finally" },
	{ name: "B013", description: "Redundant-tuple-in-exception-handler" },
	{ name: "B014", description: "Duplicate-handler-exception" },
	{ name: "B015", description: "Useless-comparison" },
	{ name: "B016", description: "Raise-literal" },
	{ name: "B017", description: "Assert-raises-exception" },
	{ name: "B018", description: "Useless-expression" },
	{ name: "B019", description: "Cached-instance-method" },
	{ name: "B020", description: "Loop-variable-overrides-iterator" },
	{ name: "B021", description: "F-string-docstring" },
	{ name: "B022", description: "Useless-contextlib-suppress" },
	{ name: "B023", description: "Function-uses-loop-variable" },
	{
		name: "B024",
		description: "Abstract-base-class-without-abstract-method",
	},
	{ name: "B025", description: "Duplicate-try-block-exception" },
	{ name: "B026", description: "Star-arg-unpacking-after-keyword-arg" },
	{ name: "B027", description: "Empty-method-without-abstract-decorator" },
	{ name: "B028", description: "No-explicit-stacklevel" },
	{ name: "B029", description: "Except-with-empty-tuple" },
	{ name: "B030", description: "Except-with-non-exception-classes" },
	{ name: "B031", description: "Reuse-of-groupby-generator" },
	{ name: "B032", description: "Unintentional-type-annotation" },
	{ name: "B033", description: "Duplicate-value" },
	{ name: "B034", description: "Re-sub-positional-args" },
	{ name: "B035", description: "Static-key-dict-comprehension" },
	{ name: "B039", description: "Mutable-contextvar-default" },
	{ name: "B901", description: "Return-in-generator" },
	{ name: "B904", description: "Raise-without-from-inside-except" },
	{ name: "B905", description: "Zip-without-explicit-strict" },
	{ name: "B909", description: "Loop-iterator-mutation" },
	{
		name: "FBT001",
		description: "Boolean-typed positional argument in function definition",
	},
	{
		name: "FBT002",
		description: "Boolean default positional argument in function definition",
	},
	{
		name: "FBT003",
		description: "Boolean positional value in function call",
	},
	{
		name: "A001",
		description: "Builtin-variable-shadowing",
	},
	{
		name: "A002",
		description: "Builtin-argument-shadowing",
	},
	{
		name: "A003",
		description: "Builtin-attribute-shadowing",
	},
	{
		name: "A004",
		description: "Builtin-import-shadowing",
	},
	{
		name: "A005",
		description: "Builtin-module-shadowing",
	},
	{
		name: "A006",
		description: "Builtin-lambda-argument-shadowing",
	},
	{
		name: "COM812",
		description: "Missing-trailing-comma",
	},
	{
		name: "COM818",
		description: "Trailing-comma-on-bare-tuple",
	},
	{
		name: "COM819",
		description: "Prohibited-trailing-comma",
	},
	{
		name: "CPY001",
		description: "Missing-copyright-notice",
	},
	{
		name: "C400",
		description: "Unnecessary-generator-list",
	},
	{
		name: "C401",
		description: "Unnecessary-generator-set",
	},
	{
		name: "C402",
		description: "Unnecessary-generator-dict",
	},
	{
		name: "C403",
		description: "Unnecessary-list-comprehension-set",
	},
	{
		name: "C404",
		description: "Unnecessary-list-comprehension-dict",
	},
	{
		name: "C405",
		description: "Unnecessary-literal-set",
	},
	{
		name: "C406",
		description: "Unnecessary-literal-dict",
	},
	{
		name: "C408",
		description: "Unnecessary-collection-call",
	},
	{
		name: "C409",
		description: "Unnecessary-literal-within-tuple-call",
	},
	{
		name: "C410",
		description: "Unnecessary-literal-within-list-call",
	},
	{
		name: "C411",
		description: "Unnecessary-list-call",
	},
	{
		name: "C413",
		description: "Unnecessary-call-around-sorted",
	},
	{
		name: "C414",
		description: "Unnecessary-double-cast-or-process",
	},
	{
		name: "C415",
		description: "Unnecessary-subscript-reversal",
	},
	{
		name: "C416",
		description: "Unnecessary-comprehension",
	},
	{
		name: "C417",
		description: "Unnecessary-map",
	},
	{
		name: "C418",
		description: "Unnecessary-literal-within-dict-call",
	},
	{
		name: "C419",
		description: "Unnecessary-comprehension-in-call",
	},
	{
		name: "C420",
		description: "Unnecessary-dict-comprehension-for-iterable",
	},
	{
		name: "DTZ001",
		description: "Call-datetime-without-tzinfo",
	},
	{
		name: "DTZ002",
		description: "Call-datetime-today",
	},
	{
		name: "DTZ003",
		description: "Call-datetime-utcnow",
	},
	{
		name: "DTZ004",
		description: "Call-datetime-utcfromtimestamp",
	},
	{
		name: "DTZ005",
		description: "Call-datetime-now-without-tzinfo",
	},
	{
		name: "DTZ006",
		description: "Call-datetime-fromtimestamp",
	},
	{
		name: "DTZ007",
		description: "Call-datetime-strptime-without-zone",
	},
	{
		name: "DTZ011",
		description: "Call-date-today",
	},
	{
		name: "DTZ012",
		description: "Call-date-fromtimestamp",
	},
	{
		name: "DTZ901",
		description: "Datetime-min-max",
	},
	{
		name: "DJ001",
		description: "Django-nullable-model-string-field",
	},
	{
		name: "DJ003",
		description: "Django-locals-in-render-function",
	},
	{
		name: "DJ006",
		description: "Django-exclude-with-model-form",
	},
	{
		name: "DJ007",
		description: "Django-all-with-model-form",
	},
	{
		name: "DJ008",
		description: "Django-model-without-dunder-str",
	},
	{
		name: "DJ012",
		description: "Django-unordered-body-content-in-model",
	},
	{
		name: "DJ013",
		description: "Django-non-leading-receiver-decorator",
	},
	{
		name: "EM101",
		description: "Raw-string-in-exception",
	},
	{
		name: "EM102",
		description: "F-string-in-exception",
	},
	{
		name: "EM103",
		description: "Dot-format-in-exception",
	},
	{
		name: "EXE001",
		description: "Shebang-not-executable",
	},
	{
		name: "EXE002",
		description: "Shebang-missing-executable-file",
	},
	{
		name: "EXE003",
		description: "Shebang-missing-python",
	},
	{
		name: "EXE004",
		description: "Shebang-leading-whitespace",
	},
	{
		name: "EXE005",
		description: "Shebang-not-first-line",
	},
	{
		name: "FA100",
		description: "Future-rewritable-type-annotation",
	},
	{
		name: "FA102",
		description: "Future-required-type-annotation",
	},
	{
		name: "ISC001",
		description: "Single-line-implicit-string-concatenation",
	},
	{
		name: "ISC002",
		description: "Multi-line-implicit-string-concatenation",
	},
	{
		name: "ISC003",
		description: "Explicit-string-concatenation",
	},
	{
		name: "ICN001",
		description: "Unconventional-import-alias",
	},
	{
		name: "ICN002",
		description: "Banned-import-alias",
	},
	{
		name: "ICN003",
		description: "Banned-import-from",
	},
	{
		name: "LOG001",
		description: "Direct-logger-instantiation",
	},
	{
		name: "LOG002",
		description: "Invalid-get-logger-argument",
	},
	{
		name: "LOG007",
		description: "Exception-without-exc-info",
	},
	{
		name: "LOG009",
		description: "Undocumented-warn",
	},
	{
		name: "LOG015",
		description: "Root-logger-call",
	},
	{
		name: "G001",
		description: "Logging-string-format",
	},
	{
		name: "G002",
		description: "Logging-percent-format",
	},
	{
		name: "G003",
		description: "Logging-string-concat",
	},
	{
		name: "G004",
		description: "Logging-f-string",
	},
	{
		name: "G010",
		description: "Logging-warn",
	},
	{
		name: "G101",
		description: "Logging-extra-attr-clash",
	},
	{
		name: "G201",
		description: "Logging-exc-info",
	},
	{
		name: "G202",
		description: "Logging-redundant-exc-info",
	},
	{
		name: "INP001",
		description: "Implicit-namespace-package",
	},
	{
		name: "PIE790",
		description: "Unnecessary-placeholder",
	},
	{
		name: "PIE794",
		description: "Duplicate-class-field-definition",
	},
	{
		name: "PIE796",
		description: "Non-unique-enums",
	},
	{
		name: "PIE800",
		description: "Unnecessary-spread",
	},
	{
		name: "PIE804",
		description: "Unnecessary-dict-kwargs",
	},
	{
		name: "PIE807",
		description: "Reimplemented-container-builtin",
	},
	{
		name: "PIE808",
		description: "Unnecessary-range-start",
	},
	{
		name: "PIE810",
		description: "Multiple-starts-ends-with",
	},
	{
		name: "T201",
		description: "Print",
	},
	{
		name: "T203",
		description: "P-print",
	},
	{
		name: "PYI001",
		description: "Unprefixed-type-param",
	},
	{
		name: "PYI002",
		description: "Complex-if-statement-in-stub",
	},
	{
		name: "PYI003",
		description: "Unrecognized-version-info-check",
	},
	{
		name: "PYI004",
		description: "Patch-version-comparison",
	},
	{
		name: "PYI005",
		description: "Wrong-tuple-length-version-comparison",
	},
	{
		name: "PYI006",
		description: "Bad-version-info-comparison",
	},
	{
		name: "PYI007",
		description: "Unrecognized-platform-check",
	},
	{
		name: "PYI008",
		description: "Unrecognized-platform-name",
	},
	{
		name: "PYI009",
		description: "Pass-statement-stub-body",
	},
	{
		name: "PYI010",
		description: "Non-empty-stub-body",
	},
	{
		name: "PYI011",
		description: "Typed-argument-default-in-stub",
	},
	{
		name: "PYI012",
		description: "Pass-in-class-body",
	},
	{
		name: "PYI013",
		description: "Ellipsis-in-non-empty-class-body",
	},
	{
		name: "PYI014",
		description: "Argument-default-in-stub",
	},
	{
		name: "PYI015",
		description: "Assignment-default-in-stub",
	},
	{
		name: "PYI016",
		description: "Duplicate-union-member",
	},
	{
		name: "PYI017",
		description: "Complex-assignment-in-stub",
	},
	{
		name: "PYI018",
		description: "Unused-private-type-var",
	},
	{
		name: "PYI019",
		description: "Custom-type-var-return-type",
	},
	{
		name: "PYI020",
		description: "Quoted-annotation-in-stub",
	},
	{
		name: "PYI021",
		description: "Docstring-in-stub",
	},
	{
		name: "PYI024",
		description: "Collections-named-tuple",
	},
	{
		name: "PYI025",
		description: "Unaliased-collections-abc-set-import",
	},
	{
		name: "PYI026",
		description: "Type-alias-without-annotation",
	},
	{
		name: "PYI029",
		description: "Str-or-repr-defined-in-stub",
	},
	{
		name: "PYI030",
		description: "Unnecessary-literal-union",
	},
	{
		name: "PYI032",
		description: "Any-eq-ne-annotation",
	},
	{
		name: "PYI033",
		description: "Type-comment-in-stub",
	},
	{
		name: "PYI034",
		description: "Non-self-return-type",
	},
	{
		name: "PYI035",
		description: "Unassigned-special-variable-in-stub",
	},
	{
		name: "PYI036",
		description: "Bad-exit-annotation",
	},
	{
		name: "PYI041",
		description: "Redundant-numeric-union",
	},
	{
		name: "PYI042",
		description: "Snake-case-type-alias",
	},
	{
		name: "PYI043",
		description: "T-suffixed-type-alias",
	},
	{
		name: "PYI044",
		description: "Future-annotations-in-stub",
	},
	{
		name: "PYI045",
		description: "Iter-method-return-iterable",
	},
	{
		name: "PYI046",
		description: "Unused-private-protocol",
	},
	{
		name: "PYI047",
		description: "Unused-private-type-alias",
	},
	{
		name: "PYI048",
		description: "Stub-body-multiple-statements",
	},
	{
		name: "PYI049",
		description: "Unused-private-typed-dict",
	},
	{
		name: "PYI050",
		description: "No-return-argument-annotation-in-stub",
	},
	{
		name: "PYI051",
		description: "Redundant-literal-union",
	},
	{
		name: "PYI052",
		description: "Unannotated-assignment-in-stub",
	},
	{
		name: "PYI053",
		description: "String-or-bytes-too-long",
	},
	{
		name: "PYI054",
		description: "Numeric-literal-too-long",
	},
	{
		name: "PYI055",
		description: "Unnecessary-type-union",
	},
	{
		name: "PYI056",
		description: "Unsupported-method-call-on-all",
	},
	{
		name: "PYI057",
		description: "Byte-string-usage",
	},
	{
		name: "PYI058",
		description: "Generator-return-from-iter-method",
	},
	{
		name: "PYI059",
		description: "Generic-not-last-base-class",
	},
	{
		name: "PYI061",
		description: "Redundant-none-literal",
	},
	{
		name: "PYI062",
		description: "Duplicate-literal-member",
	},
	{
		name: "PYI063",
		description: "Pep484-style-positional-only-parameter",
	},
	{
		name: "PYI064",
		description: "Redundant-final-literal",
	},
	{
		name: "PYI066",
		description: "Bad-version-info-order",
	},
	{
		name: "PT001",
		description: "Pytest-fixture-incorrect-parentheses-style",
	},
	{
		name: "PT002",
		description: "Pytest-fixture-positional-args",
	},
	{
		name: "PT003",
		description: "Pytest-extraneous-scope-function",
	},
	{
		name: "PT004",
		description: "Pytest-missing-fixture-name-underscore",
	},
	{
		name: "PT005",
		description: "Pytest-incorrect-fixture-name-underscore",
	},
	{
		name: "PT006",
		description: "Pytest-parametrize-names-wrong-type",
	},
	{
		name: "PT007",
		description: "Pytest-parametrize-values-wrong-type",
	},
	{
		name: "PT008",
		description: "Pytest-patch-with-lambda",
	},
	{
		name: "PT009",
		description: "Pytest-unittest-assertion",
	},
	{
		name: "PT010",
		description: "Pytest-raises-without-exception",
	},
	{
		name: "PT011",
		description: "Pytest-raises-too-broad",
	},
	{
		name: "PT012",
		description: "Pytest-raises-with-multiple-statements",
	},
	{
		name: "PT013",
		description: "Pytest-incorrect-pytest-import",
	},
	{
		name: "PT014",
		description: "Pytest-duplicate-parametrize-test-cases",
	},
	{
		name: "PT015",
		description: "Pytest-assert-always-false",
	},
	{
		name: "PT016",
		description: "Pytest-fail-without-message",
	},
	{
		name: "PT017",
		description: "Pytest-assert-in-except",
	},
	{
		name: "PT018",
		description: "Pytest-composite-assertion",
	},
	{
		name: "PT019",
		description: "Pytest-fixture-param-without-value",
	},
	{
		name: "PT020",
		description: "Pytest-deprecated-yield-fixture",
	},
	{
		name: "PT021",
		description: "Pytest-fixture-finalizer-callback",
	},
	{
		name: "PT022",
		description: "Pytest-useless-yield-fixture",
	},
	{
		name: "PT023",
		description: "Pytest-incorrect-mark-parentheses-style",
	},
	{
		name: "PT024",
		description: "Pytest-unnecessary-asyncio-mark-on-fixture",
	},
	{
		name: "PT025",
		description: "Pytest-erroneous-use-fixtures-on-fixture",
	},
	{
		name: "PT026",
		description: "Pytest-use-fixtures-without-parameters",
	},
	{
		name: "PT027",
		description: "Pytest-unittest-raises-assertion",
	},
	{
		name: "Q000",
		description: "Bad-quotes-inline-string",
	},
	{
		name: "Q001",
		description: "Bad-quotes-multiline-string",
	},
	{
		name: "Q002",
		description: "Bad-quotes-docstring",
	},
	{
		name: "Q003",
		description: "Avoidable-escaped-quote",
	},
	{
		name: "Q004",
		description: "Unnecessary-escaped-quote",
	},
	{
		name: "RSE102",
		description: "Unnecessary-paren-on-raise-exception",
	},
	{
		name: "RET501",
		description: "Unnecessary-return-none",
	},
	{
		name: "RET502",
		description: "Implicit-return-value",
	},
	{
		name: "RET503",
		description: "Implicit-return",
	},
	{
		name: "RET504",
		description: "Unnecessary-assign",
	},
	{
		name: "RET505",
		description: "Superfluous-else-return",
	},
	{
		name: "RET506",
		description: "Superfluous-else-raise",
	},
	{
		name: "RET507",
		description: "Superfluous-else-continue",
	},
	{
		name: "RET508",
		description: "Superfluous-else-break",
	},
	{
		name: "SLF001",
		description: "Private-member-access",
	},
	{
		name: "SLOT000",
		description: "No-slots-in-str-subclass",
	},
	{
		name: "SLOT001",
		description: "No-slots-in-tuple-subclass",
	},
	{
		name: "SLOT002",
		description: "No-slots-in-namedtuple-subclass",
	},
	{
		name: "SIM101",
		description: "Duplicate-isinstance-call",
	},
	{
		name: "SIM102",
		description: "Collapsible-if",
	},
	{
		name: "SIM103",
		description: "Needless-bool",
	},
	{
		name: "SIM105",
		description: "Suppressible-exception",
	},
	{
		name: "SIM107",
		description: "Return-in-try-except-finally",
	},
	{
		name: "SIM108",
		description: "If-else-block-instead-of-if-exp",
	},
	{
		name: "SIM109",
		description: "Compare-with-tuple",
	},
	{
		name: "SIM110",
		description: "Reimplemented-builtin",
	},
	{
		name: "SIM112",
		description: "Uncapitalized-environment-variables",
	},
	{
		name: "SIM113",
		description: "Enumerate-for-loop",
	},
	{
		name: "SIM114",
		description: "If-with-same-arms",
	},
	{
		name: "SIM115",
		description: "Open-file-with-context-handler",
	},
	{
		name: "SIM116",
		description: "If-else-block-instead-of-dict-lookup",
	},
	{
		name: "SIM117",
		description: "Multiple-with-statements",
	},
	{
		name: "SIM118",
		description: "In-dict-keys",
	},
	{
		name: "SIM201",
		description: "Negate-equal-op",
	},
	{
		name: "SIM202",
		description: "Negate-not-equal-op",
	},
	{
		name: "SIM208",
		description: "Double-negation",
	},
	{
		name: "SIM210",
		description: "If-expr-with-true-false",
	},
	{
		name: "SIM211",
		description: "If-expr-with-false-true",
	},
	{
		name: "SIM212",
		description: "If-expr-with-twisted-arms",
	},
	{
		name: "SIM220",
		description: "Expr-and-not-expr",
	},
	{
		name: "SIM221",
		description: "Expr-or-not-expr",
	},
	{
		name: "SIM222",
		description: "Expr-or-true",
	},
	{
		name: "SIM223",
		description: "Expr-and-false",
	},
	{
		name: "SIM300",
		description: "Yoda-conditions",
	},
	{
		name: "SIM401",
		description: "If-else-block-instead-of-dict-get",
	},
	{
		name: "SIM905",
		description: "Split-static-string",
	},
	{
		name: "SIM910",
		description: "Dict-get-with-none-default",
	},
	{
		name: "SIM911",
		description: "Zip-dict-keys-and-values",
	},
	{
		name: "TID251",
		description: "Banned-api",
	},
	{
		name: "TID252",
		description: "Relative-imports",
	},
	{
		name: "TID253",
		description: "Banned-module-level-imports",
	},
	{
		name: "TC001",
		description: "Typing-only-first-party-import",
	},
	{
		name: "TC002",
		description: "Typing-only-third-party-import",
	},
	{
		name: "TC003",
		description: "Typing-only-standard-library-import",
	},
	{
		name: "TC004",
		description: "Runtime-import-in-type-checking-block",
	},
	{
		name: "TC005",
		description: "Empty-type-checking-block",
	},
	{
		name: "TC006",
		description: "Runtime-cast-value",
	},
	{
		name: "TC007",
		description: "Unquoted-type-alias",
	},
	{
		name: "TC008",
		description: "Quoted-type-alias",
	},
	{
		name: "TC010",
		description: "Runtime-string-union",
	},
	{
		name: "INT001",
		description: "F-string-in-get-text-func-call",
	},
	{
		name: "INT002",
		description: "Format-in-get-text-func-call",
	},
	{
		name: "INT003",
		description: "Printf-in-get-text-func-call",
	},
	{
		name: "ARG001",
		description: "Unused-function-argument",
	},
	{
		name: "ARG002",
		description: "Unused-method-argument",
	},
	{
		name: "ARG003",
		description: "Unused-class-method-argument",
	},
	{
		name: "ARG004",
		description: "Unused-static-method-argument",
	},
	{
		name: "ARG005",
		description: "Unused-lambda-argument",
	},
	{
		name: "PTH100",
		description: "Os-path-abspath",
	},
	{
		name: "PTH101",
		description: "Os-chmod",
	},
	{
		name: "PTH102",
		description: "Os-mkdir",
	},
	{
		name: "PTH103",
		description: "Os-makedirs",
	},
	{
		name: "PTH104",
		description: "Os-rename",
	},
	{
		name: "PTH105",
		description: "Os-replace",
	},
	{
		name: "PTH106",
		description: "Os-rmdir",
	},
	{
		name: "PTH107",
		description: "Os-remove",
	},
	{
		name: "PTH108",
		description: "Os-unlink",
	},
	{
		name: "PTH109",
		description: "Os-getcwd",
	},
	{
		name: "PTH110",
		description: "Os-path-exists",
	},
	{
		name: "PTH111",
		description: "Os-path-expanduser",
	},
	{
		name: "PTH112",
		description: "Os-path-isdir",
	},
	{
		name: "PTH113",
		description: "Os-path-isfile",
	},
	{
		name: "PTH114",
		description: "Os-path-islink",
	},
	{
		name: "PTH115",
		description: "Os-readlink",
	},
	{
		name: "PTH116",
		description: "Os-stat",
	},
	{
		name: "PTH117",
		description: "Os-path-isabs",
	},
	{
		name: "PTH118",
		description: "Os-path-join",
	},
	{
		name: "PTH119",
		description: "Os-path-basename",
	},
	{
		name: "PTH120",
		description: "Os-path-dirname",
	},
	{
		name: "PTH121",
		description: "Os-path-samefile",
	},
	{
		name: "PTH122",
		description: "Os-path-splitext",
	},
	{
		name: "PTH123",
		description: "Builtin-open",
	},
	{
		name: "PTH124",
		description: "Py-path",
	},
	{
		name: "PTH201",
		description: "Path-constructor-current-directory",
	},
	{
		name: "PTH202",
		description: "Os-path-getsize",
	},
	{
		name: "PTH203",
		description: "Os-path-getatime",
	},
	{
		name: "PTH204",
		description: "Os-path-getmtime",
	},
	{
		name: "PTH205",
		description: "Os-path-getctime",
	},
	{
		name: "PTH206",
		description: "Os-sep-split",
	},
	{
		name: "PTH207",
		description: "Glob",
	},
	{
		name: "PTH208",
		description: "Os-listdir",
	},
	{
		name: "TD001",
		description: "Invalid-todo-tag",
	},
	{
		name: "TD002",
		description: "Missing-todo-author",
	},
	{
		name: "TD003",
		description: "Missing-todo-link",
	},
	{
		name: "TD004",
		description: "Missing-todo-colon",
	},
	{
		name: "TD005",
		description: "Missing-todo-description",
	},
	{
		name: "TD006",
		description: "Invalid-todo-capitalization",
	},
	{
		name: "TD007",
		description: "Missing-space-after-todo-colon",
	},
	{
		name: "FIX001",
		description: "Line-contains-fixme",
	},
	{
		name: "FIX002",
		description: "Line-contains-todo",
	},
	{
		name: "FIX003",
		description: "Line-contains-xxx",
	},
	{
		name: "FIX004",
		description: "Line-contains-hack",
	},
	{
		name: "ERA001",
		description: "Commented-out-code",
	},
	{
		name: "PD002",
		description: "Pandas-use-of-inplace-argument",
	},
	{
		name: "PD003",
		description: "Pandas-use-of-dot-is-null",
	},
	{
		name: "PD004",
		description: "Pandas-use-of-dot-not-null",
	},
	{
		name: "PD007",
		description: "Pandas-use-of-dot-ix",
	},
	{
		name: "PD008",
		description: "Pandas-use-of-dot-at",
	},
	{
		name: "PD009",
		description: "Pandas-use-of-dot-iat",
	},
	{
		name: "PD010",
		description: "Pandas-use-of-dot-pivot-or-unstack",
	},
	{
		name: "PD011",
		description: "Pandas-use-of-dot-values",
	},
	{
		name: "PD012",
		description: "Pandas-use-of-dot-read-table",
	},
	{
		name: "PD013",
		description: "Pandas-use-of-dot-stack",
	},
	{
		name: "PD015",
		description: "Pandas-use-of-pd-merge",
	},
	{
		name: "PD101",
		description: "Pandas-nunique-constant-series-check",
	},
	{
		name: "PD901",
		description: "Pandas-df-variable-name",
	},
	{
		name: "PGH001",
		description: "Eval",
	},
	{
		name: "PGH002",
		description: "Deprecated-log-warn",
	},
	{
		name: "PGH003",
		description: "Blanket-type-ignore",
	},
	{
		name: "PGH004",
		description: "Blanket-noqa",
	},
	{
		name: "PGH005",
		description: "Invalid-mock-access",
	},
	{
		name: "PLC0105",
		description: "Type-name-incorrect-variance",
	},
	{
		name: "PLC0131",
		description: "Type-bivariance",
	},
	{
		name: "PLC0132",
		description: "Type-param-name-mismatch",
	},
	{
		name: "PLC0205",
		description: "Single-string-slots",
	},
	{
		name: "PLC0206",
		description: "Dict-index-missing-items",
	},
	{
		name: "PLC0208",
		description: "Iteration-over-set",
	},
	{
		name: "PLC0414",
		description: "Useless-import-alias",
	},
	{
		name: "PLC0415",
		description: "Import-outside-top-level",
	},
	{
		name: "PLC1802",
		description: "Len-test",
	},
	{
		name: "PLC1901",
		description: "Compare-to-empty-string",
	},
	{
		name: "PLC2401",
		description: "Non-ascii-name",
	},
	{
		name: "PLC2403",
		description: "Non-ascii-import-name",
	},
	{
		name: "PLC2701",
		description: "Import-private-name",
	},
	{
		name: "PLC2801",
		description: "Unnecessary-dunder-call",
	},
	{
		name: "PLC3002",
		description: "Unnecessary-direct-lambda-call",
	},
	{
		name: "PLE0100",
		description: "Yield-in-init",
	},
	{
		name: "PLE0101",
		description: "Return-in-init",
	},
	{
		name: "PLE0115",
		description: "Nonlocal-and-global",
	},
	{
		name: "PLE0116",
		description: "Continue-in-finally",
	},
	{
		name: "PLE0117",
		description: "Nonlocal-without-binding",
	},
	{
		name: "PLE0118",
		description: "Load-before-global-declaration",
	},
	{
		name: "PLE0237",
		description: "Non-slot-assignment",
	},
	{
		name: "PLE0241",
		description: "Duplicate-bases",
	},
	{
		name: "PLE0302",
		description: "Unexpected-special-method-signature",
	},
	{
		name: "PLE0303",
		description: "Invalid-length-return-type",
	},
	{
		name: "PLE0304",
		description: "Invalid-bool-return-type",
	},
	{
		name: "PLE0305",
		description: "Invalid-index-return-type",
	},
	{
		name: "PLE0307",
		description: "Invalid-str-return-type",
	},
	{
		name: "PLE0308",
		description: "Invalid-bytes-return-type",
	},
	{
		name: "PLE0309",
		description: "Invalid-hash-return-type",
	},
	{
		name: "PLE0604",
		description: "Invalid-all-object",
	},
	{
		name: "PLE0605",
		description: "Invalid-all-format",
	},
	{
		name: "PLE0643",
		description: "Potential-index-error",
	},
	{
		name: "PLE0704",
		description: "Misplaced-bare-raise",
	},
	{
		name: "PLE1132",
		description: "Repeated-keyword-argument",
	},
	{
		name: "PLE1141",
		description: "Dict-iter-missing-items",
	},
	{
		name: "PLE1142",
		description: "Await-outside-async",
	},
	{
		name: "PLE1205",
		description: "Logging-too-many-args",
	},
	{
		name: "PLE1206",
		description: "Logging-too-few-args",
	},
	{
		name: "PLE1300",
		description: "Bad-string-format-character",
	},
	{
		name: "PLE1307",
		description: "Bad-string-format-type",
	},
	{
		name: "PLE1310",
		description: "Bad-str-strip-call",
	},
	{
		name: "PLE1507",
		description: "Invalid-envvar-value",
	},
	{
		name: "PLE1519",
		description: "Singledispatch-method",
	},
	{
		name: "PLE1520",
		description: "Singledispatchmethod-function",
	},
	{
		name: "PLE1700",
		description: "Yield-from-in-async-function",
	},
	{
		name: "PLE2502",
		description: "Bidirectional-unicode",
	},
	{
		name: "PLE2510",
		description: "Invalid-character-backspace",
	},
	{
		name: "PLE2512",
		description: "Invalid-character-sub",
	},
	{
		name: "PLE2513",
		description: "Invalid-character-esc",
	},
	{
		name: "PLE2514",
		description: "Invalid-character-nul",
	},
	{
		name: "PLE2515",
		description: "Invalid-character-zero-width-space",
	},
	{
		name: "PLE4703",
		description: "Modified-iterating-set",
	},
	{
		name: "PLR0124",
		description: "Comparison-with-itself",
	},
	{
		name: "PLR0133",
		description: "Comparison-of-constant",
	},
	{
		name: "PLR0202",
		description: "No-classmethod-decorator",
	},
	{
		name: "PLR0203",
		description: "No-staticmethod-decorator",
	},
	{
		name: "PLR0206",
		description: "Property-with-parameters",
	},
	{
		name: "PLR0402",
		description: "Manual-from-import",
	},
	{
		name: "PLR0904",
		description: "Too-many-public-methods",
	},
	{
		name: "PLR0911",
		description: "Too-many-return-statements",
	},
	{
		name: "PLR0912",
		description: "Too-many-branches",
	},
	{
		name: "PLR0913",
		description: "Too-many-arguments",
	},
	{
		name: "PLR0914",
		description: "Too-many-locals",
	},
	{
		name: "PLR0915",
		description: "Too-many-statements",
	},
	{
		name: "PLR0916",
		description: "Too-many-boolean-expressions",
	},
	{
		name: "PLR0917",
		description: "Too-many-positional-arguments",
	},
	{
		name: "PLR1701",
		description: "Repeated-isinstance-calls",
	},
	{
		name: "PLR1702",
		description: "Too-many-nested-blocks",
	},
	{
		name: "PLR1704",
		description: "Redefined-argument-from-local",
	},
	{
		name: "PLR1706",
		description: "And-or-ternary",
	},
	{
		name: "PLR1711",
		description: "Useless-return",
	},
	{
		name: "PLR1714",
		description: "Repeated-equality-comparison",
	},
	{
		name: "PLR1716",
		description: "Boolean-chained-comparison",
	},
	{
		name: "PLR1722",
		description: "Sys-exit-alias",
	},
	{
		name: "PLR1730",
		description: "If-stmt-min-max",
	},
	{
		name: "PLR1733",
		description: "Unnecessary-dict-index-lookup",
	},
	{
		name: "PLR1736",
		description: "Unnecessary-list-index-lookup",
	},
	{
		name: "PLR2004",
		description: "Magic-value-comparison",
	},
	{
		name: "PLR2044",
		description: "Empty-comment",
	},
	{
		name: "PLR5501",
		description: "Collapsible-else-if",
	},
	{
		name: "PLR6104",
		description: "Non-augmented-assignment",
	},
	{
		name: "PLR6201",
		description: "Literal-membership",
	},
	{
		name: "PLR6301",
		description: "No-self-use",
	},
	{
		name: "PLW0108",
		description: "Unnecessary-lambda",
	},
	{
		name: "PLW0120",
		description: "Useless-else-on-loop",
	},
	{
		name: "PLW0127",
		description: "Self-assigning-variable",
	},
	{
		name: "PLW0128",
		description: "Redeclared-assigned-name",
	},
	{
		name: "PLW0129",
		description: "Assert-on-string-literal",
	},
	{
		name: "PLW0131",
		description: "Named-expr-without-context",
	},
	{
		name: "PLW0133",
		description: "Useless-exception-statement",
	},
	{
		name: "PLW0177",
		description: "Nan-comparison",
	},
	{
		name: "PLW0211",
		description: "Bad-staticmethod-argument",
	},
	{
		name: "PLW0245",
		description: "Super-without-brackets",
	},
	{
		name: "PLW0406",
		description: "Import-self",
	},
	{
		name: "PLW0602",
		description: "Global-variable-not-assigned",
	},
	{
		name: "PLW0603",
		description: "Global-statement",
	},
	{
		name: "PLW0604",
		description: "Global-at-module-level",
	},
	{
		name: "PLW0642",
		description: "Self-or-cls-assignment",
	},
	{
		name: "PLW0711",
		description: "Binary-op-exception",
	},
	{
		name: "PLW1501",
		description: "Bad-open-mode",
	},
	{
		name: "PLW1507",
		description: "Shallow-copy-environ",
	},
	{
		name: "PLW1508",
		description: "Invalid-envvar-default",
	},
	{
		name: "PLW1509",
		description: "Subprocess-popen-preexec-fn",
	},
	{
		name: "PLW1510",
		description: "Subprocess-run-without-check",
	},
	{
		name: "PLW1514",
		description: "Unspecified-encoding",
	},
	{
		name: "PLW1641",
		description: "Eq-without-hash",
	},
	{
		name: "PLW2101",
		description: "Useless-with-lock",
	},
	{
		name: "PLW2901",
		description: "Redefined-loop-name",
	},
	{
		name: "PLW3201",
		description: "Bad-dunder-method-name",
	},
	{
		name: "PLW3301",
		description: "Nested-min-max",
	},
	{
		name: "TRY002",
		description: "Raise-vanilla-class",
	},
	{
		name: "TRY003",
		description: "Raise-vanilla-args",
	},
	{
		name: "TRY004",
		description: "Type-check-without-type-error",
	},
	{
		name: "TRY200",
		description: "Reraise-no-cause",
	},
	{
		name: "TRY201",
		description: "Verbose-raise",
	},
	{
		name: "TRY203",
		description: "Useless-try-except",
	},
	{
		name: "TRY300",
		description: "Try-consider-else",
	},
	{
		name: "TRY301",
		description: "Raise-within-try",
	},
	{
		name: "TRY400",
		description: "Error-instead-of-exception",
	},
	{
		name: "TRY401",
		description: "Verbose-log-message",
	},
	{
		name: "FLY002",
		description: "Static-join-to-f-string",
	},
	{
		name: "NPY001",
		description: "Numpy-deprecated-type-alias",
	},
	{
		name: "NPY002",
		description: "Numpy-legacy-random",
	},
	{
		name: "NPY003",
		description: "Numpy-deprecated-function",
	},
	{
		name: "NPY201",
		description: "Numpy2-deprecation",
	},
	{
		name: "FAST001",
		description: "Fast-api-redundant-response-model",
	},
	{
		name: "FAST002",
		description: "Fast-api-non-annotated-dependency",
	},
	{
		name: "FAST003",
		description: "Fast-api-unused-path-parameter",
	},
	{
		name: "AIR001",
		description: "Airflow-variable-name-task-id-mismatch",
	},
	{
		name: "AIR301",
		description: "Airflow-dag-no-schedule-argument",
	},
	{
		name: "AIR302",
		description: "Airflow3-removal",
	},
	{
		name: "PERF101",
		description: "Unnecessary-list-cast",
	},
	{
		name: "PERF102",
		description: "Incorrect-dict-iterator",
	},
	{
		name: "PERF203",
		description: "Try-except-in-loop",
	},
	{
		name: "PERF401",
		description: "Manual-list-comprehension",
	},
	{
		name: "PERF402",
		description: "Manual-list-copy",
	},
	{
		name: "PERF403",
		description: "Manual-dict-comprehension",
	},
	{
		name: "FURB101",
		description: "Read-whole-file",
	},
	{
		name: "FURB103",
		description: "Write-whole-file",
	},
	{
		name: "FURB105",
		description: "Print-empty-string",
	},
	{
		name: "FURB110",
		description: "If-exp-instead-of-or-operator",
	},
	{
		name: "FURB113",
		description: "Repeated-append",
	},
	{
		name: "FURB116",
		description: "F-string-number-format",
	},
	{
		name: "FURB118",
		description: "Reimplemented-operator",
	},
	{
		name: "FURB129",
		description: "Readlines-in-for",
	},
	{
		name: "FURB131",
		description: "Delete-full-slice",
	},
	{
		name: "FURB132",
		description: "Check-and-remove-from-set",
	},
	{
		name: "FURB136",
		description: "If-expr-min-max",
	},
	{
		name: "FURB140",
		description: "Reimplemented-starmap",
	},
	{
		name: "FURB142",
		description: "For-loop-set-mutations",
	},
	{
		name: "FURB145",
		description: "Slice-copy",
	},
	{
		name: "FURB148",
		description: "Unnecessary-enumerate",
	},
	{
		name: "FURB152",
		description: "Math-constant",
	},
	{
		name: "FURB154",
		description: "Repeated-global",
	},
	{
		name: "FURB156",
		description: "Hardcoded-string-charset",
	},
	{
		name: "FURB157",
		description: "Verbose-decimal-constructor",
	},
	{
		name: "FURB161",
		description: "Bit-count",
	},
	{
		name: "FURB163",
		description: "Redundant-log-base",
	},
	{
		name: "FURB164",
		description: "Unnecessary-from-float",
	},
	{
		name: "FURB166",
		description: "Int-on-sliced-str",
	},
	{
		name: "FURB167",
		description: "Regex-flag-alias",
	},
	{
		name: "FURB168",
		description: "Isinstance-type-none",
	},
	{
		name: "FURB169",
		description: "Type-none-comparison",
	},
	{
		name: "FURB171",
		description: "Single-item-membership-test",
	},
	{
		name: "FURB177",
		description: "Implicit-cwd",
	},
	{
		name: "FURB180",
		description: "Meta-class-abc-meta",
	},
	{
		name: "FURB181",
		description: "Hashlib-digest-hex",
	},
	{
		name: "FURB187",
		description: "List-reverse-copy",
	},
	{
		name: "FURB188",
		description: "Slice-to-remove-prefix-or-suffix",
	},
	{
		name: "FURB189",
		description: "Subclass-builtin",
	},
	{
		name: "FURB192",
		description: "Sorted-min-max",
	},
	{
		name: "DOC201",
		description: "Docstring-missing-returns",
	},
	{
		name: "DOC202",
		description: "Docstring-extraneous-returns",
	},
	{
		name: "DOC402",
		description: "Docstring-missing-yields",
	},
	{
		name: "DOC403",
		description: "Docstring-extraneous-yields",
	},
	{
		name: "DOC501",
		description: "Docstring-missing-exception",
	},
	{
		name: "DOC502",
		description: "Docstring-extraneous-exception",
	},
	{
		name: "RUF001",
		description: "Ambiguous-unicode-character-string",
	},
	{
		name: "RUF002",
		description: "Ambiguous-unicode-character-docstring",
	},
	{
		name: "RUF003",
		description: "Ambiguous-unicode-character-comment",
	},
	{
		name: "RUF005",
		description: "Collection-literal-concatenation",
	},
	{
		name: "RUF006",
		description: "Asyncio-dangling-task",
	},
	{
		name: "RUF007",
		description: "Zip-instead-of-pairwise",
	},
	{
		name: "RUF008",
		description: "Mutable-dataclass-default",
	},
	{
		name: "RUF009",
		description: "Function-call-in-dataclass-default-argument",
	},
	{
		name: "RUF010",
		description: "Explicit-f-string-type-conversion",
	},
	{
		name: "RUF011",
		description: "Ruff-static-key-dict-comprehension",
	},
	{
		name: "RUF012",
		description: "Mutable-class-default",
	},
	{
		name: "RUF013",
		description: "Implicit-optional",
	},
	{
		name: "RUF015",
		description: "Unnecessary-iterable-allocation-for-first-element",
	},
	{
		name: "RUF016",
		description: "Invalid-index-type",
	},
	{
		name: "RUF017",
		description: "Quadratic-list-summation",
	},
	{
		name: "RUF018",
		description: "Assignment-in-assert",
	},
	{
		name: "RUF019",
		description: "Unnecessary-key-check",
	},
	{
		name: "RUF020",
		description: "Never-union",
	},
	{
		name: "RUF021",
		description: "Parenthesize-chained-operators",
	},
	{
		name: "RUF022",
		description: "Unsorted-dunder-all",
	},
	{
		name: "RUF023",
		description: "Unsorted-dunder-slots",
	},
	{
		name: "RUF024",
		description: "Mutable-fromkeys-value",
	},
	{
		name: "RUF026",
		description: "Default-factory-kwarg",
	},
	{
		name: "RUF027",
		description: "Missing-f-string-syntax",
	},
	{
		name: "RUF028",
		description: "Invalid-formatter-suppression-comment",
	},
	{
		name: "RUF029",
		description: "Unused-async",
	},
	{
		name: "RUF030",
		description: "Assert-with-print-message",
	},
	{
		name: "RUF031",
		description: "Incorrectly-parenthesized-tuple-in-subscript",
	},
	{
		name: "RUF032",
		description: "Decimal-from-float-literal",
	},
	{
		name: "RUF033",
		description: "Post-init-default",
	},
	{
		name: "RUF034",
		description: "Useless-if-else",
	},
	{
		name: "RUF035",
		description: "Unsafe-markup-use",
	},
	{
		name: "RUF036",
		description: "None-not-at-end-of-union",
	},
	{
		name: "RUF038",
		description: "Redundant-bool-literal",
	},
	{
		name: "RUF039",
		description: "Unraw-re-pattern",
	},
	{
		name: "RUF040",
		description: "Invalid-assert-message-literal-argument",
	},
	{
		name: "RUF041",
		description: "Unnecessary-nested-literal",
	},
	{
		name: "RUF046",
		description: "Unnecessary-cast-to-int",
	},
	{
		name: "RUF048",
		description: "Map-int-version-parsing",
	},
	{
		name: "RUF052",
		description: "Used-dummy-variable",
	},
	{
		name: "RUF055",
		description: "Unnecessary-regular-expression",
	},
	{
		name: "RUF100",
		description: "Unused-noqa",
	},
	{
		name: "RUF101",
		description: "Redirected-noqa",
	},
	{
		name: "RUF200",
		description: "Invalid-pyproject-toml",
	},
];

const subCommands: Fig.Subcommand[] = [
	{
		name: "check",
		description: "Run Ruff on the given files or directories",
		options: checkOptions,
		args: {
			name: "Path",
			template: "filepaths",
			description: "The path to use for the project/script",
			default: ".",
			isVariadic: true,
		},
	},
	{
		name: "rule",
		description: "Explain a rule (or all rules)",
		args: {
			name: "rule",
			description: "Rule(s) to explain",
			suggestions: [
				...rules,
				{ name: "--all", description: "Explain all rules", displayName: "all" },
			],
		},
		options: [
			{
				name: "--all",
				description: "Explain all rules",
			},
			{
				name: "--output-format",
				description: "Output format [default: text]",
				args: {
					name: "output-format",
					suggestions: ["text", "json"],
				},
			},
		],
	},
	{
		name: "config",
		description: "List or describe the available configuration options",
		options: [
			{
				name: "--output-format",
				description: "Output format [default: text]",
				args: {
					name: "output-format",
					suggestions: ["text", "json"],
				},
			},
		],
	},
	{
		name: "linter",
		description: "List all supported upstream linters",
		options: [
			{
				name: "--output-format",
				description: "Output format",
				args: { name: "output-format", suggestions: ["text", "json"] },
			},
		],
	},
	{
		name: "clean",
		description:
			"Clear any caches in the current directory and any subdirectories",
	},
	{
		name: "format",
		description: "Run the Ruff formatter on the given files or directories",
		options: formatOptions,
		args: {
			name: "Path",
			template: "filepaths",
			description: "List of files or directories to format [default: .]",
			default: ".",
			isVariadic: true,
		},
	},
	{
		name: "server",
		description: "Run the language server",
		options: [
			{
				name: "--preview",
				description: "Enable preview mode. Use `--no-preview` to disable",
			},
			{
				name: "--no-preview",
				description: "Disable preview mode",
			},
		],
	},
	{
		name: "analyze",
		description: "Run analysis over Python source code",
		subcommands: [
			{
				name: "graph",
				description: "Generate a map of Python file dependencies or dependents",
				options: [
					{
						name: "--direction",
						description:
							"The direction of the import map. By default, generates a dependency map, i.e., a map from file to files that it depends on. Use `--direction dependents` to generate a map from file to files that depend on it",
						args: {
							name: "DIRECTION",
							suggestions: ["dependencies", "dependents"],
						},
					},
					{
						name: "--detect-string-imports",
						description: "Attempt to detect imports from string literals",
					},
					{
						name: "--preview",
						description: "Enable preview mode. Use `--no-preview` to disable",
					},
					{
						name: "--no-preview",
						description: "Disable preview mode",
					},
					{
						name: "--target-version",
						description: "The minimum Python version that should be supported",
						args: {
							name: "TARGET_VERSION",
							suggestions: [
								"py37",
								"py38",
								"py39",
								"py310",
								"py311",
								"py312",
								"py313",
							],
						},
					},
				],
				args: {
					name: "Path",
					template: "filepaths",
					description: "The path to use for the project/script",
					default: ".",
					isVariadic: true,
				},
			},
		],
	},
	{
		name: "version",
		description: "Display Ruff's version",
		options: [
			{
				name: "--output-format",
				description: "Output format",
				args: { name: "output-format", suggestions: ["text", "json"] },
			},
		],
	},
	{
		name: "help",
		description: "Print this message or the help of the given subcommand(s)",
	},
];

const completion: Fig.Spec = {
	name: "ruff",
	description: "Ruff: An extremely fast Python linter",
	subcommands: subCommands,
	options: GlobalOptions.map((option) => ({ ...option, isPersistent: true })),
};

export default completion;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/scp.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/scp.ts

```typescript
import { knownHosts, configHosts } from "./ssh";

const completionSpec: Fig.Spec = {
	name: "scp",
	description: "Copies files or directories between hosts on a network",
	args: [
		{
			name: "sources",
			description: "File or directory, local or remote ([user@]host:[path])",
			isVariadic: true,
			generators: [
				knownHosts,
				configHosts,
				{ template: ["history", "filepaths", "folders"] },
			],
		},
		{
			name: "target",
			description: "File or directory, local or remote ([user@]host:[path])",
			generators: [
				knownHosts,
				configHosts,
				{ template: ["history", "filepaths", "folders"] },
			],
		},
	],
	options: [
		{
			name: "-3",
			description: `Copies between two remote hosts are transferred through the local
host.  Without this option the data is copied directly between the
two remote hosts.  Note that this option disables the progress
meter and selects batch mode for the second host, since scp cannot
ask for passwords or passphrases for both hosts`,
		},
		{
			name: "-4",
			description: "Forces scp to use IPv4 addresses only",
		},
		{
			name: "-6",
			description: "Forces scp to use IPv6 addresses only",
		},
		{
			name: "-A",
			description:
				"Allows forwarding of ssh-agent(1) to the remote system. The default is not to forward an authentication agent",
		},
		{
			name: "-B",
			description:
				"Selects batch mode (prevents asking for passwords or passphrases)",
		},
		{
			name: "-C",
			description:
				"Compression enable. Passes the -C flag to ssh(1) to enable compression",
		},
		{
			name: "-c",
			description:
				"Selects the cipher to use for encrypting the data transfer. This option is directly passed to ssh(1)",
			args: {
				name: "cipher",
				description: "The selected cipher specification",
			},
		},
		{
			name: "-F",
			description:
				"Specifies an alternative per-user configuration file for ssh. This option is directly passed to ssh(1)",
			args: {
				name: "ssh_config",
				description: "The selected ssh config",
			},
		},
		{
			name: "-i",
			description:
				"Selects the file from which the identity (private key) for public key authentication is read. This option is directly passed to ssh(1)",
			args: {
				name: "identity_file",
				description: "Specified identity file",
			},
		},
		{
			name: "-J",
			description: `Connect to the target host by first making an scp connection to the
jump host described by destination and then establishing a TCP
forwarding to the ultimate destination from there.  Multiple jump
hops may be specified separated by comma characters.  This is a
shortcut to specify a ProxyJump configuration directive.  This
option is directly passed to ssh(1)`,
			args: {
				name: "destination",
				description: "Scp destination",
			},
		},
		{
			name: "-l",
			description: "Limits the used bandwidth, specified in Kbit/s",
			args: {
				name: "limit",
				description: "Limit bandwidth in Kbit/s",
			},
		},
		{
			name: "-o",
			description: `Can be used to pass options to ssh in the format used in
ssh_config(5).  This is useful for specifying options for which
there is no separate scp command-line flag.  For full details of
the options listed below, and their possible values, see
ssh_config(5)`,
			args: {
				name: "option",
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
			name: "-P",
			description: `Specifies the port to connect to on the remote host.  Note that
this option is written with a capital ‘P’, because -p is already
reserved for preserving the times and modes of the file`,
			args: {
				name: "port",
			},
		},
		{
			name: "-p",
			description:
				"Preserves modification times, access times, and modes from the original file",
		},
		{
			name: "-q",
			description:
				"Quiet mode: disables the progress meter as well as warning and diagnostic messages from ssh(1)",
		},
		{
			name: "-r",
			description:
				"Recursively copy entire directories.  Note that scp follows symbolic links encountered in the tree traversal",
		},
		{
			name: "-S",
			description:
				"Name of program to use for the encrypted connection.  The program must understand ssh(1) options",
			args: {
				name: "program",
			},
		},
		{
			name: "-T",
			description: `Disable strict filename checking.  By default when copying files
from a remote host to a local directory scp checks that the
received filenames match those requested on the command-line to
prevent the remote end from sending unexpected or unwanted files.
Because of differences in how various operating systems and shells
interpret filename wildcards, these checks may cause wanted files
to be rejected.  This option disables these checks at the expense
of fully trusting that the server will not send unexpected
filenames`,
		},
		{
			name: "-v",
			description:
				"Verbose mode.  Causes scp and ssh(1) to print debugging messages about their progress. This is helpful in debugging connection, authentication, and configuration problems",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/sed.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/sed.ts

```typescript
const labelArg: Fig.Arg = {
	name: "label",
	isOptional: true,
};

const textArg: Fig.Arg = {
	name: "text",
};

const filenameArg: Fig.Arg = {
	name: "filename",
	template: "filepaths",
};

const completionSpec: Fig.Spec = {
	name: "sed",
	description: "Stream editor",
	subcommands: [
		{
			name: "a",
			description: "Appends `text` after a line",
			args: textArg,
		},
		{
			name: "b",
			description: "Branch unconditionally to `label`",
			args: labelArg,
		},
		{
			name: "c",
			description: "Replace (change) lines with `text`",
			args: textArg,
		},
		{
			name: "d",
			description: "Delete the pattern space; immediately start next cycle",
		},
		{
			name: "D",
			description:
				"If pattern space contains newlines, delete text in the pattern space up to the first newline, and restart cycle with the resultant pattern space, without reading a new line of input. If pattern space contains no newline, start a normal new cycle as if the d command was issued",
		},
		{
			name: "e",
			description:
				"Executes the command that is found in pattern space and replaces the pattern space with the output; a trailing newline is suppressed",
			args: {
				name: "command",
				isCommand: true,
				isOptional: true,
			},
		},
		{
			name: "F",
			description: "Prints the file name of the current input file",
		},
		{
			name: "g",
			description:
				"Replaces the contents of the pattern space with the contents of the hold space",
		},
		{
			name: "G",
			description:
				"Appends a newline to the contents of the pattern space, and then appends the contents of the hold space to that of the pattern space",
		},
		{
			name: "h",
			description:
				"Replaces the contents of the hold space with the contents of the pattern space",
		},
		{
			name: "H",
			description:
				"Appends a newline to the contents of the hold space, and then appends the contents of the pattern space to that of the hold space",
		},
		{
			name: "i",
			description: "Insert text before a line",
			args: textArg,
		},
		{
			name: "l",
			description: "Prints the pattern space in an unambiguous form",
		},
		{
			name: "n",
			description:
				"Prints the pattern space, then, regardless, replaces the pattern space with the next line of input. If there is no more input then sed exits without processing any more commands",
		},
		{
			name: "N",
			description:
				"Adds a newline to the pattern space, then appends the next line of input to the pattern space. If there is no more input then sed exits without processing any more commands",
		},
		{
			name: "p",
			description: "Prints the pattern space",
		},
		{
			name: "P",
			description: "Prints the pattern space up to the first newline",
		},
		{
			name: "q",
			description: "Exit sed without processing any more commands or input",
			args: {
				name: "Exit Code",
				isOptional: true,
			},
		},
		{
			name: "Q",
			description:
				"This command is the same as q, but will not print the contents of pattern space",
			args: {
				name: "Exit Code",
				isOptional: true,
			},
		},
		{
			name: "r",
			description: "Reads file",
			args: filenameArg,
		},
		{
			name: "R",
			description:
				"Queue a line of filename to be read and inserted into the output stream at the end of the current cycle, or when the next input line is read",
			args: filenameArg,
		},
		{
			name: ["s", "regexp", "replacement"],
			description:
				"Match the regular-expression against the content of the pattern space. If found, replace matched string with replacement",
		},
		{
			name: "t",
			description:
				"(test) Branch to label only if there has been a successful substitution since the last input line was read or conditional branch was taken. The label may be omitted, in which case the next cycle is started",
			args: labelArg,
		},
		{
			name: "T",
			description:
				"(test) Branch to label only if there have been no successful substitutions since the last input line was read or conditional branch was taken. The label may be omitted, in which case the next cycle is started",
			args: labelArg,
		},
		{
			name: "v",
			description:
				"Makes sed fail if GNU sed extensions are not supported, or if the requested version is not available",
			args: {
				name: "version",
				isOptional: true,
			},
		},
		{
			name: "w",
			description: "Writes the pattern space to the file",
			args: filenameArg,
		},
		{
			name: "W",
			description:
				"Writes to the given filename the portion of the pattern space up to the first newline",
			args: filenameArg,
		},
		{
			name: "x",
			description: "Exchanges the contents of the hold and pattern spaces",
		},
		{
			name: ["y", "src", "dst"],
			description:
				"Transliterate any characters in the pattern space which match any of the source-chars with the corresponding character in dest-chars",
		},
		{
			name: "z",
			description: "(zap) Empties the content of pattern space",
		},
		{
			name: "#",
			description: "Comment until the next newline",
		},
	],
	options: [
		{
			name: "-E",
			description:
				"Interprets regular expressions as extended (modern) regular expressions rather than basic regular expressions",
		},
		{
			name: "-a",
			description:
				"Causes sed to delay opening each file until a command containing the related ``w'' function is applied to a line of input",
		},
		{
			name: "-e",
			description:
				"Appends the editing commands specified by the command argument to the list of commands",
			args: {
				name: "command",
			},
		},
		{
			name: "-f",
			description:
				"Appends the editing commands found in the file command_file to the list of commands. The editing commands should each be listed on a separate line",
			args: {
				name: "command_file",
				template: "filepaths",
			},
		},
		{
			name: "-I",
			description:
				"Edits files in-place, saving backups with the specified extension.  If a zero-length extension is given, no backup will be saved",
			args: {
				name: "extension",
			},
		},
		{
			name: "-i",
			description:
				"Edits files in-place similarly to `-I`, but treats each file independently from other files.  In particular, line numbers in each file start at 1, the ``$'' address matches the last line of the current file, and address ranges are limited to the current file",
			args: {
				name: "extension",
			},
		},
		{
			name: "-l",
			description: "Makes output line buffered",
		},
		{
			name: "-n",
			description:
				"By default, each line of input is echoed to the standard output after all of the commands have been applied to it.  The `-n` option suppresses this behavior",
		},
		{
			name: "-r",
			description: "Same as `-E` for compatibility with GNU sed",
		},
		{
			name: "-u",
			description: "Makes output unbuffered",
		},
	],
	args: [
		{
			name: "command",
		},
		{
			name: "file",
			template: "filepaths",
			isVariadic: true,
			isOptional: true,
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/seq.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/seq.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "seq",
	description: "Print sequences of numbers. (Defaults to increments of 1)",
	args: [
		{
			name: "first",
			description: "Starting number in sequence",
		},
		{
			name: "step",
			description: "Increment interval",
			isOptional: true,
		},
		{
			name: "last",
			description: "Last number in sequence",
			isOptional: true,
		},
	],
	options: [
		{
			name: ["-w", "--fixed-width"],
			description:
				"Equalize the widths of all numbers by padding with zeros as necessary",
		},
		{
			name: ["-s", "--separator"],
			description: "String separator between numbers. Default is newline",
			insertValue: `-s "{cursor}"`,
			args: {
				name: "string",
				description: "Separator",
			},
		},
		{
			name: ["-f", "--format"],
			description: "Use a printf(3) style format to print each number",
			insertValue: `-f %{cursor}`,
			args: {
				name: "format",
				description: "Print all numbers using format",
			},
		},
		{
			// TODO(platform): macos only option
			name: ["-t", "--terminator"],
			description: "Use string to terminate sequence of numbers",
			insertValue: `-t "{cursor}"`,
			args: {
				name: "string",
				description: "Terminator",
			},
		},
	],
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/shred.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/shred.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "shred",
	description:
		"Overwrite a file to hide its contents, and optionally delete it",
	options: [
		{
			name: ["--force", "-f"],
			description: "Change permissions to allow writing if necessary",
		},
		{
			name: ["--iterations", "-n"],
			description: "Overwrite N times instead of the default (3)",
			args: {
				name: "N",
				suggestions: ["3", "5", "7"],
				default: "3",
			},
		},
		{
			name: "--random-source",
			description: "Get random bytes from FILE",
			args: {
				name: "FILE",
				suggestions: ["/dev/urandom", "/dev/random"],
				default: "/dev/urandom",
				template: "filepaths",
			},
		},
		{
			name: ["--size", "-s"],
			description: "Shred this many bytes (suffixes like K, M, G accepted)",
			args: {
				name: "N",
				suggestions: ["1K", "1M", "1G"],
			},
		},
		{
			name: "--remove",
			description: "Like -u but give control on HOW to delete",
			args: {
				name: "HOW",
				description:
					"'unlink' => use a standard unlink call, 'wipe' => also first obfuscate bytes in the name, 'wipesync' => also sync each obfuscated byte to the device",
				suggestions: ["unlink", "wipe", "wipesync"],
				default: "wipesync",
			},
		},
		{
			name: ["--verbose", "-v"],
			description: "Show progress",
		},
		{
			name: ["--exact", "-x"],
			description:
				"Do not round file sizes up to the next full block; this is the default for non-regular files",
		},
		{
			name: ["--zero", "-z"],
			description: "Add a final overwrite with zeros to hide shredding",
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
	args: {
		name: "FILE",
		description: "File(s) to shred",
		isVariadic: true,
		template: "filepaths",
	},
};
export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/sort.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/sort.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "sort",
	description: "Sort or merge records (lines) of text and binary files",
	args: {
		name: "file",
		isVariadic: true,
		template: "filepaths",
	},
	options: [
		{
			name: "--help",
			description: "Shows help message",
		},
		{
			name: "--version",
			description: "Displays the current version of sort",
		},
		{
			name: ["-c", "--check", "-C"],
			args: {
				name: "output",
				isOptional: true,
				suggestions: ["silent", "quiet"],
				description: "Suppress errors on false check",
			},
			description: "Check that the single input file is sorted",
		},
		{
			name: ["-m", "--merge"],
			description:
				"Merge only.  The input files are assumed to be pre-sorted.  If they are not sorted the output order is undefined",
		},
		{
			name: ["-o", "--output"],
			description:
				"Print the output to the output file instead of the standard output",
			args: {
				name: "output",
			},
		},
		{
			name: ["-S", "--buffer-size"],
			description: "Use size for the maximum size of the memory buffer",
			args: {
				name: "size",
			},
		},
		{
			name: ["-T", "--temporary-directory"],
			description: "Store temporary files in the directory dir",
			args: {
				name: "dir",
				template: "folders",
			},
		},
		{
			name: ["-u", "--unique"],
			description:
				"Unique keys. Suppress all lines that have a key that is equal to an already processed one",
		},
		{
			name: "-s",
			description:
				"Stable sort. This option maintains the original record order of records that have an equal key",
		},
		{
			name: ["-b", "--ignore-leading-blanks"],
			description: "Ignore leading blank characters when comparing lines",
		},
		{
			name: ["-d", "--dictionary-order"],
			description:
				"Consider only blank spaces and alphanumeric characters in comparisons",
		},
		{
			name: ["-f", "--ignore-case"],
			description:
				"Convert all lowercase characters to their upper case equivalent before comparison",
		},
		{
			name: ["-g", "--general-numeric-sort"],
			description: "Sort by general numerical value",
		},
		{
			name: ["-h", "--human-numeric-sort"],
			description:
				"Sort by numerical value, but take into account the SI suffix, if present",
		},
		{
			name: ["-i", "--ignore-nonprinting"],
			description: "Ignore all non-printable characters",
		},
		{
			name: ["-M", "--month-sort"],
			description:
				"Sort by month abbreviations.  Unknown strings are considered smaller than the month names",
		},
		{
			name: ["-n", "--numeric-sort"],
			description: "Sort fields numerically by arithmetic value",
		},
		{
			name: ["-R", "--random-sort"],
			description: "Sort by a random order",
		},
		{
			name: ["-r", "--reverse"],
			description: "Sort in reverse order",
		},
		{
			name: ["-V", "--version-sort"],
			description: "Sort version numbers",
		},
		{
			name: ["-k", "--key"],
			args: [
				{
					name: "field1",
				},
				{
					name: "field2",
					isOptional: true,
				},
			],
			description:
				"Define a restricted sort key that has the starting position field1, and optional ending position field2",
		},
		{
			name: ["-t", "--field-separator"],
			args: {
				name: "char",
			},
			description: "Use char as a field separator character",
		},
		{
			name: ["-z", "--zero-terminated"],
			description: "Use NUL as record separator",
		},
		{
			name: "--batch-size",
			args: {
				name: "num",
			},
			description:
				"Specify maximum number of files that can be opened by sort at once",
		},
		{
			name: "--compress-program",
			args: {
				name: "PROGRAM",
				template: "filepaths",
			},
			description: "Use PROGRAM to compress temporary files (eg. bzip2)",
		},
		{
			name: "--random-source",
			args: {
				name: "filename",
				template: "filepaths",
			},
			description:
				"In random sort, the file content is used as the source of the 'seed' data for the hash function choice",
		},
		{
			name: "--debug",
			description:
				"Print some extra information about the sorting process to the standard output",
		},
		{
			name: "--parallel",
			description:
				"Set the maximum number of execution threads.  Default number equals to the number of CPUs",
		},
		{
			name: "--files0-from",
			args: {
				name: "filename",
				template: "filepaths",
			},
			description: "Take the input file list from the file filename",
		},
		{
			name: "--radixsort",
			description: "Try to use radix sort, if the sort specifications allow",
		},
		{
			name: "--mergesort",
			description:
				"Use mergesort.  This is a universal algorithm that can always be used, but it is not always the fastest",
		},
		{
			name: "--qsort",
			description:
				"Try to use quick sort, if the sort specifications allow.  This sort algorithm cannot be used with -u and -s",
		},
		{
			name: "--heapsort",
			description:
				"Try to use heap sort, if the sort specifications allow.  This sort algorithm cannot be used with -u and -s",
		},
		{
			name: "--mmap",
			description:
				"Try to use file memory mapping system call.  It may increase speed in some cases",
		},
		{
			name: "--sort",
			args: {
				name: "type",
				suggestions: [
					"general-numeric",
					"human-numeric",
					"month",
					"numeric",
					"random",
				],
			},
			description: "Select how to sort values",
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/source.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/source.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "source",
	description: "Source files in shell",
	args: {
		isVariadic: true,
		name: "File to source",
		template: "filepaths",
	},
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/upstream/split.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/upstream/split.ts

```typescript
const completionSpec: Fig.Spec = {
	name: "split",
	description:
		"The split utility reads the given file and breaks it up into files of 1000 lines each (if no options are specified), leaving the file unchanged. If file is a single dash ('-') or absent, split reads from the standard input",
	options: [
		{
			name: "-a",
			description:
				"Use suffix_length letters to form the suffix of the file name",
			args: {
				name: "suffix_length",
			},
		},
		{
			name: "-b",
			description:
				"Create split files byte_count bytes in length. If k or K is appended to the number, the file is split into byte_count kilobyte pieces. If m or M is appended to the number, the file is split into byte_count megabyte pieces.  If g or G is appended to the number, the file is split into byte_count gigabyte pieces",
			args: {
				name: "byte_count",
				description: "N[K|k|M|m|G|g]",
			},
			exclusiveOn: ["-p"],
		},
		{
			name: "-d",
			description: "Use a numeric suffix instead of a alphabetic suffix",
		},
		{
			name: "-l",
			description: "Create split files line_count lines in length",
			args: {
				name: "line_count",
			},
			exclusiveOn: ["-p"],
		},
		{
			name: "-p",
			description:
				"The file is split whenever an input line matches pattern, which is interpreted as an extended regular expression. The matching line will be the first line of the next output file. This option is incompatible with the -b and -l options",
			args: {
				name: "pattern",
			},
			exclusiveOn: ["-b", "-l"],
		},
	],
	args: [
		{
			name: "file",
			description: "The file to split",
			template: "filepaths",
			isOptional: true,
		},
		{
			name: "prefix",
			description:
				"Prefix for the names of the files into which the file is split",
			suggestions: ["x"],
			default: "x",
			isOptional: true,
		},
	],
};
export default completionSpec;
```

--------------------------------------------------------------------------------

````
