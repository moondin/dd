---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 266
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 266 of 552)

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

---[FILE: src/vs/platform/diagnostics/node/diagnosticsService.ts]---
Location: vscode-main/src/vs/platform/diagnostics/node/diagnosticsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import * as osLib from 'os';
import { Promises } from '../../../base/common/async.js';
import { getNodeType, parse, ParseError } from '../../../base/common/json.js';
import { Schemas } from '../../../base/common/network.js';
import { basename, join } from '../../../base/common/path.js';
import { isLinux, isWindows } from '../../../base/common/platform.js';
import { ProcessItem } from '../../../base/common/processes.js';
import { StopWatch } from '../../../base/common/stopwatch.js';
import { URI } from '../../../base/common/uri.js';
import { virtualMachineHint } from '../../../base/node/id.js';
import { IDirent, Promises as pfs } from '../../../base/node/pfs.js';
import { listProcesses } from '../../../base/node/ps.js';
import { IDiagnosticsService, IMachineInfo, IMainProcessDiagnostics, IRemoteDiagnosticError, IRemoteDiagnosticInfo, isRemoteDiagnosticError, IWorkspaceInformation, PerformanceInfo, SystemInfo, WorkspaceStatItem, WorkspaceStats } from '../common/diagnostics.js';
import { ByteSize } from '../../files/common/files.js';
import { IProductService } from '../../product/common/productService.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { IWorkspace } from '../../workspace/common/workspace.js';

interface ConfigFilePatterns {
	tag: string;
	filePattern: RegExp;
	relativePathPattern?: RegExp;
}

const workspaceStatsCache = new Map<string, Promise<WorkspaceStats>>();
export async function collectWorkspaceStats(folder: string, filter: string[]): Promise<WorkspaceStats> {
	const cacheKey = `${folder}::${filter.join(':')}`;
	const cached = workspaceStatsCache.get(cacheKey);
	if (cached) {
		return cached;
	}

	const configFilePatterns: ConfigFilePatterns[] = [
		{ tag: 'grunt.js', filePattern: /^gruntfile\.js$/i },
		{ tag: 'gulp.js', filePattern: /^gulpfile\.js$/i },
		{ tag: 'tsconfig.json', filePattern: /^tsconfig\.json$/i },
		{ tag: 'package.json', filePattern: /^package\.json$/i },
		{ tag: 'jsconfig.json', filePattern: /^jsconfig\.json$/i },
		{ tag: 'tslint.json', filePattern: /^tslint\.json$/i },
		{ tag: 'eslint.json', filePattern: /^eslint\.json$/i },
		{ tag: 'tasks.json', filePattern: /^tasks\.json$/i },
		{ tag: 'launch.json', filePattern: /^launch\.json$/i },
		{ tag: 'mcp.json', filePattern: /^mcp\.json$/i },
		{ tag: 'settings.json', filePattern: /^settings\.json$/i },
		{ tag: 'webpack.config.js', filePattern: /^webpack\.config\.js$/i },
		{ tag: 'project.json', filePattern: /^project\.json$/i },
		{ tag: 'makefile', filePattern: /^makefile$/i },
		{ tag: 'sln', filePattern: /^.+\.sln$/i },
		{ tag: 'csproj', filePattern: /^.+\.csproj$/i },
		{ tag: 'cmake', filePattern: /^.+\.cmake$/i },
		{ tag: 'github-actions', filePattern: /^.+\.ya?ml$/i, relativePathPattern: /^\.github(?:\/|\\)workflows$/i },
		{ tag: 'devcontainer.json', filePattern: /^devcontainer\.json$/i },
		{ tag: 'dockerfile', filePattern: /^(dockerfile|docker\-compose\.ya?ml)$/i },
		{ tag: 'cursorrules', filePattern: /^\.cursorrules$/i },
		{ tag: 'cursorrules-dir', filePattern: /\.mdc$/i, relativePathPattern: /^\.cursor[\/\\]rules$/i },
		{ tag: 'github-instructions-dir', filePattern: /\.instructions\.md$/i, relativePathPattern: /^\.github[\/\\]instructions$/i },
		{ tag: 'github-prompts-dir', filePattern: /\.prompt\.md$/i, relativePathPattern: /^\.github[\/\\]prompts$/i },
		{ tag: 'clinerules', filePattern: /^\.clinerules$/i },
		{ tag: 'clinerules-dir', filePattern: /\.md$/i, relativePathPattern: /^\.clinerules$/i },
		{ tag: 'agent.md', filePattern: /^agent\.md$/i },
		{ tag: 'agents.md', filePattern: /^agents\.md$/i },
		{ tag: 'claude.md', filePattern: /^claude\.md$/i },
		{ tag: 'gemini.md', filePattern: /^gemini\.md$/i },
		{ tag: 'copilot-instructions.md', filePattern: /^copilot\-instructions\.md$/i, relativePathPattern: /^\.github$/i },
	];

	const fileTypes = new Map<string, number>();
	const configFiles = new Map<string, number>();

	const MAX_FILES = 20000;

	function collect(root: string, dir: string, filter: string[], token: { count: number; maxReached: boolean; readdirCount: number }): Promise<void> {
		const relativePath = dir.substring(root.length + 1);

		return Promises.withAsyncBody(async resolve => {
			let files: IDirent[];

			token.readdirCount++;
			try {
				files = await pfs.readdir(dir, { withFileTypes: true });
			} catch (error) {
				// Ignore folders that can't be read
				resolve();
				return;
			}

			if (token.count >= MAX_FILES) {
				token.count += files.length;
				token.maxReached = true;
				resolve();
				return;
			}

			let pending = files.length;
			if (pending === 0) {
				resolve();
				return;
			}

			let filesToRead = files;
			if (token.count + files.length > MAX_FILES) {
				token.maxReached = true;
				pending = MAX_FILES - token.count;
				filesToRead = files.slice(0, pending);
			}

			token.count += files.length;

			for (const file of filesToRead) {
				if (file.isDirectory()) {
					if (!filter.includes(file.name)) {
						await collect(root, join(dir, file.name), filter, token);
					}

					if (--pending === 0) {
						resolve();
						return;
					}
				} else {
					const index = file.name.lastIndexOf('.');
					if (index >= 0) {
						const fileType = file.name.substring(index + 1);
						if (fileType) {
							fileTypes.set(fileType, (fileTypes.get(fileType) ?? 0) + 1);
						}
					}

					for (const configFile of configFilePatterns) {
						if (configFile.relativePathPattern?.test(relativePath) !== false && configFile.filePattern.test(file.name)) {
							configFiles.set(configFile.tag, (configFiles.get(configFile.tag) ?? 0) + 1);
						}
					}

					if (--pending === 0) {
						resolve();
						return;
					}
				}
			}
		});
	}

	const statsPromise = Promises.withAsyncBody<WorkspaceStats>(async (resolve) => {
		const token: { count: number; maxReached: boolean; readdirCount: number } = { count: 0, maxReached: false, readdirCount: 0 };
		const sw = new StopWatch(true);
		await collect(folder, folder, filter, token);
		const launchConfigs = await collectLaunchConfigs(folder);
		resolve({
			configFiles: asSortedItems(configFiles),
			fileTypes: asSortedItems(fileTypes),
			fileCount: token.count,
			maxFilesReached: token.maxReached,
			launchConfigFiles: launchConfigs,
			totalScanTime: sw.elapsed(),
			totalReaddirCount: token.readdirCount
		});
	});

	workspaceStatsCache.set(cacheKey, statsPromise);
	return statsPromise;
}

function asSortedItems(items: Map<string, number>): WorkspaceStatItem[] {
	return Array.from(items.entries(), ([name, count]) => ({ name: name, count: count }))
		.sort((a, b) => b.count - a.count);
}

export function getMachineInfo(): IMachineInfo {

	const machineInfo: IMachineInfo = {
		os: `${osLib.type()} ${osLib.arch()} ${osLib.release()}`,
		memory: `${(osLib.totalmem() / ByteSize.GB).toFixed(2)}GB (${(osLib.freemem() / ByteSize.GB).toFixed(2)}GB free)`,
		vmHint: `${Math.round((virtualMachineHint.value() * 100))}%`,
	};

	const cpus = osLib.cpus();
	if (cpus && cpus.length > 0) {
		machineInfo.cpus = `${cpus[0].model} (${cpus.length} x ${cpus[0].speed})`;
	}

	return machineInfo;
}

export async function collectLaunchConfigs(folder: string): Promise<WorkspaceStatItem[]> {
	try {
		const launchConfigs = new Map<string, number>();
		const launchConfig = join(folder, '.vscode', 'launch.json');

		const contents = await fs.promises.readFile(launchConfig);

		const errors: ParseError[] = [];
		const json = parse(contents.toString(), errors);
		if (errors.length) {
			console.log(`Unable to parse ${launchConfig}`);
			return [];
		}

		if (getNodeType(json) === 'object' && json['configurations']) {
			for (const each of json['configurations']) {
				const type = each['type'];
				if (type) {
					if (launchConfigs.has(type)) {
						launchConfigs.set(type, launchConfigs.get(type)! + 1);
					} else {
						launchConfigs.set(type, 1);
					}
				}
			}
		}

		return asSortedItems(launchConfigs);
	} catch (error) {
		return [];
	}
}

export class DiagnosticsService implements IDiagnosticsService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IProductService private readonly productService: IProductService
	) { }

	private formatMachineInfo(info: IMachineInfo): string {
		const output: string[] = [];
		output.push(`OS Version:       ${info.os}`);
		output.push(`CPUs:             ${info.cpus}`);
		output.push(`Memory (System):  ${info.memory}`);
		output.push(`VM:               ${info.vmHint}`);

		return output.join('\n');
	}

	private formatEnvironment(info: IMainProcessDiagnostics): string {
		const output: string[] = [];
		output.push(`Version:          ${this.productService.nameShort} ${this.productService.version} (${this.productService.commit || 'Commit unknown'}, ${this.productService.date || 'Date unknown'})`);
		output.push(`OS Version:       ${osLib.type()} ${osLib.arch()} ${osLib.release()}`);
		const cpus = osLib.cpus();
		if (cpus && cpus.length > 0) {
			output.push(`CPUs:             ${cpus[0].model} (${cpus.length} x ${cpus[0].speed})`);
		}
		output.push(`Memory (System):  ${(osLib.totalmem() / ByteSize.GB).toFixed(2)}GB (${(osLib.freemem() / ByteSize.GB).toFixed(2)}GB free)`);
		if (!isWindows) {
			output.push(`Load (avg):       ${osLib.loadavg().map(l => Math.round(l)).join(', ')}`); // only provided on Linux/macOS
		}
		output.push(`VM:               ${Math.round((virtualMachineHint.value() * 100))}%`);
		output.push(`Screen Reader:    ${info.screenReader ? 'yes' : 'no'}`);
		output.push(`Process Argv:     ${info.mainArguments.join(' ')}`);
		output.push(`GPU Status:       ${this.expandGPUFeatures(info.gpuFeatureStatus)}`);

		return output.join('\n');
	}

	public async getPerformanceInfo(info: IMainProcessDiagnostics, remoteData: (IRemoteDiagnosticInfo | IRemoteDiagnosticError)[]): Promise<PerformanceInfo> {
		return Promise.all([listProcesses(info.mainPID), this.formatWorkspaceMetadata(info)]).then(async result => {
			let [rootProcess, workspaceInfo] = result;
			let processInfo = this.formatProcessList(info, rootProcess);

			remoteData.forEach(diagnostics => {
				if (isRemoteDiagnosticError(diagnostics)) {
					processInfo += `\n${diagnostics.errorMessage}`;
					workspaceInfo += `\n${diagnostics.errorMessage}`;
				} else {
					processInfo += `\n\nRemote: ${diagnostics.hostName}`;
					if (diagnostics.processes) {
						processInfo += `\n${this.formatProcessList(info, diagnostics.processes)}`;
					}

					if (diagnostics.workspaceMetadata) {
						workspaceInfo += `\n|  Remote: ${diagnostics.hostName}`;
						for (const folder of Object.keys(diagnostics.workspaceMetadata)) {
							const metadata = diagnostics.workspaceMetadata[folder];

							let countMessage = `${metadata.fileCount} files`;
							if (metadata.maxFilesReached) {
								countMessage = `more than ${countMessage}`;
							}

							workspaceInfo += `|    Folder (${folder}): ${countMessage}`;
							workspaceInfo += this.formatWorkspaceStats(metadata);
						}
					}
				}
			});

			return {
				processInfo,
				workspaceInfo
			};
		});
	}

	public async getSystemInfo(info: IMainProcessDiagnostics, remoteData: (IRemoteDiagnosticInfo | IRemoteDiagnosticError)[]): Promise<SystemInfo> {
		const { memory, vmHint, os, cpus } = getMachineInfo();
		const systemInfo: SystemInfo = {
			os,
			memory,
			cpus,
			vmHint,
			processArgs: `${info.mainArguments.join(' ')}`,
			gpuStatus: info.gpuFeatureStatus,
			screenReader: `${info.screenReader ? 'yes' : 'no'}`,
			remoteData
		};

		if (!isWindows) {
			systemInfo.load = `${osLib.loadavg().map(l => Math.round(l)).join(', ')}`;
		}

		if (isLinux) {
			systemInfo.linuxEnv = {
				desktopSession: process.env['DESKTOP_SESSION'],
				xdgSessionDesktop: process.env['XDG_SESSION_DESKTOP'],
				xdgCurrentDesktop: process.env['XDG_CURRENT_DESKTOP'],
				xdgSessionType: process.env['XDG_SESSION_TYPE']
			};
		}

		return Promise.resolve(systemInfo);
	}

	public async getDiagnostics(info: IMainProcessDiagnostics, remoteDiagnostics: (IRemoteDiagnosticInfo | IRemoteDiagnosticError)[]): Promise<string> {
		const output: string[] = [];
		return listProcesses(info.mainPID).then(async rootProcess => {

			// Environment Info
			output.push('');
			output.push(this.formatEnvironment(info));

			// Process List
			output.push('');
			output.push(this.formatProcessList(info, rootProcess));

			// Workspace Stats
			if (info.windows.some(window => window.folderURIs && window.folderURIs.length > 0 && !window.remoteAuthority)) {
				output.push('');
				output.push('Workspace Stats: ');
				output.push(await this.formatWorkspaceMetadata(info));
			}

			remoteDiagnostics.forEach(diagnostics => {
				if (isRemoteDiagnosticError(diagnostics)) {
					output.push(`\n${diagnostics.errorMessage}`);
				} else {
					output.push('\n\n');
					output.push(`Remote:           ${diagnostics.hostName}`);
					output.push(this.formatMachineInfo(diagnostics.machineInfo));

					if (diagnostics.processes) {
						output.push(this.formatProcessList(info, diagnostics.processes));
					}

					if (diagnostics.workspaceMetadata) {
						for (const folder of Object.keys(diagnostics.workspaceMetadata)) {
							const metadata = diagnostics.workspaceMetadata[folder];

							let countMessage = `${metadata.fileCount} files`;
							if (metadata.maxFilesReached) {
								countMessage = `more than ${countMessage}`;
							}

							output.push(`Folder (${folder}): ${countMessage}`);
							output.push(this.formatWorkspaceStats(metadata));
						}
					}
				}
			});

			output.push('');
			output.push('');

			return output.join('\n');
		});
	}

	private formatWorkspaceStats(workspaceStats: WorkspaceStats): string {
		const output: string[] = [];
		const lineLength = 60;
		let col = 0;

		const appendAndWrap = (name: string, count: number) => {
			const item = ` ${name}(${count})`;

			if (col + item.length > lineLength) {
				output.push(line);
				line = '|                 ';
				col = line.length;
			}
			else {
				col += item.length;
			}
			line += item;
		};

		// File Types
		let line = '|      File types:';
		const maxShown = 10;
		const max = workspaceStats.fileTypes.length > maxShown ? maxShown : workspaceStats.fileTypes.length;
		for (let i = 0; i < max; i++) {
			const item = workspaceStats.fileTypes[i];
			appendAndWrap(item.name, item.count);
		}
		output.push(line);

		// Conf Files
		if (workspaceStats.configFiles.length >= 0) {
			line = '|      Conf files:';
			col = 0;
			workspaceStats.configFiles.forEach((item) => {
				appendAndWrap(item.name, item.count);
			});
			output.push(line);
		}

		if (workspaceStats.launchConfigFiles.length > 0) {
			let line = '|      Launch Configs:';
			workspaceStats.launchConfigFiles.forEach(each => {
				const item = each.count > 1 ? ` ${each.name}(${each.count})` : ` ${each.name}`;
				line += item;
			});
			output.push(line);
		}
		return output.join('\n');
	}

	private expandGPUFeatures(gpuFeatures: Record<string, string>): string {
		const longestFeatureName = Math.max(...Object.keys(gpuFeatures).map(feature => feature.length));
		// Make columns aligned by adding spaces after feature name
		return Object.keys(gpuFeatures).map(feature => `${feature}:  ${' '.repeat(longestFeatureName - feature.length)}  ${gpuFeatures[feature]}`).join('\n                  ');
	}

	private formatWorkspaceMetadata(info: IMainProcessDiagnostics): Promise<string> {
		const output: string[] = [];
		const workspaceStatPromises: Promise<void>[] = [];

		info.windows.forEach(window => {
			if (window.folderURIs.length === 0 || !!window.remoteAuthority) {
				return;
			}

			output.push(`|  Window (${window.title})`);

			window.folderURIs.forEach(uriComponents => {
				const folderUri = URI.revive(uriComponents);
				if (folderUri.scheme === Schemas.file) {
					const folder = folderUri.fsPath;
					workspaceStatPromises.push(collectWorkspaceStats(folder, ['node_modules', '.git']).then(stats => {
						let countMessage = `${stats.fileCount} files`;
						if (stats.maxFilesReached) {
							countMessage = `more than ${countMessage}`;
						}
						output.push(`|    Folder (${basename(folder)}): ${countMessage}`);
						output.push(this.formatWorkspaceStats(stats));

					}).catch(error => {
						output.push(`|      Error: Unable to collect workspace stats for folder ${folder} (${error.toString()})`);
					}));
				} else {
					output.push(`|    Folder (${folderUri.toString()}): Workspace stats not available.`);
				}
			});
		});

		return Promise.all(workspaceStatPromises)
			.then(_ => output.join('\n'))
			.catch(e => `Unable to collect workspace stats: ${e}`);
	}

	private formatProcessList(info: IMainProcessDiagnostics, rootProcess: ProcessItem): string {
		const mapProcessToName = new Map<number, string>();
		info.windows.forEach(window => mapProcessToName.set(window.pid, `window [${window.id}] (${window.title})`));
		info.pidToNames.forEach(({ pid, name }) => mapProcessToName.set(pid, name));

		const output: string[] = [];

		output.push('CPU %\tMem MB\t   PID\tProcess');

		if (rootProcess) {
			this.formatProcessItem(info.mainPID, mapProcessToName, output, rootProcess, 0);
		}

		return output.join('\n');
	}

	private formatProcessItem(mainPid: number, mapProcessToName: Map<number, string>, output: string[], item: ProcessItem, indent: number): void {
		const isRoot = (indent === 0);

		// Format name with indent
		let name: string;
		if (isRoot) {
			name = item.pid === mainPid ? this.productService.applicationName : 'remote-server';
		} else {
			if (mapProcessToName.has(item.pid)) {
				name = mapProcessToName.get(item.pid)!;
			} else {
				name = `${'  '.repeat(indent)} ${item.name}`;
			}
		}

		const memory = process.platform === 'win32' ? item.mem : (osLib.totalmem() * (item.mem / 100));
		output.push(`${item.load.toFixed(0).padStart(5, ' ')}\t${(memory / ByteSize.MB).toFixed(0).padStart(6, ' ')}\t${item.pid.toFixed(0).padStart(6, ' ')}\t${name}`);

		// Recurse into children if any
		if (Array.isArray(item.children)) {
			item.children.forEach(child => this.formatProcessItem(mainPid, mapProcessToName, output, child, indent + 1));
		}
	}

	public async getWorkspaceFileExtensions(workspace: IWorkspace): Promise<{ extensions: string[] }> {
		const items = new Set<string>();
		for (const { uri } of workspace.folders) {
			const folderUri = URI.revive(uri);
			if (folderUri.scheme !== Schemas.file) {
				continue;
			}
			const folder = folderUri.fsPath;
			try {
				const stats = await collectWorkspaceStats(folder, ['node_modules', '.git']);
				stats.fileTypes.forEach(item => items.add(item.name));
			} catch { }
		}
		return { extensions: [...items] };
	}

	public async reportWorkspaceStats(workspace: IWorkspaceInformation): Promise<void> {
		for (const { uri } of workspace.folders) {
			const folderUri = URI.revive(uri);
			if (folderUri.scheme !== Schemas.file) {
				continue;
			}

			const folder = folderUri.fsPath;
			try {
				const stats = await collectWorkspaceStats(folder, ['node_modules', '.git']);
				type WorkspaceStatsClassification = {
					owner: 'lramos15';
					comment: 'Metadata related to the workspace';
					'workspace.id': { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'A UUID given to a workspace to identify it.' };
					rendererSessionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The ID of the session' };
				};
				type WorkspaceStatsEvent = {
					'workspace.id': string | undefined;
					rendererSessionId: string;
				};
				this.telemetryService.publicLog2<WorkspaceStatsEvent, WorkspaceStatsClassification>('workspace.stats', {
					'workspace.id': workspace.telemetryId,
					rendererSessionId: workspace.rendererSessionId
				});
				type WorkspaceStatsFileClassification = {
					owner: 'lramos15';
					comment: 'Helps us gain insights into what type of files are being used in a workspace';
					rendererSessionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The ID of the session.' };
					type: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The type of file' };
					count: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'How many types of that file are present' };
				};
				type WorkspaceStatsFileEvent = {
					rendererSessionId: string;
					type: string;
					count: number;
				};
				stats.fileTypes.forEach(e => {
					this.telemetryService.publicLog2<WorkspaceStatsFileEvent, WorkspaceStatsFileClassification>('workspace.stats.file', {
						rendererSessionId: workspace.rendererSessionId,
						type: e.name,
						count: e.count
					});
				});
				stats.launchConfigFiles.forEach(e => {
					this.telemetryService.publicLog2<WorkspaceStatsFileEvent, WorkspaceStatsFileClassification>('workspace.stats.launchConfigFile', {
						rendererSessionId: workspace.rendererSessionId,
						type: e.name,
						count: e.count
					});
				});
				stats.configFiles.forEach(e => {
					this.telemetryService.publicLog2<WorkspaceStatsFileEvent, WorkspaceStatsFileClassification>('workspace.stats.configFiles', {
						rendererSessionId: workspace.rendererSessionId,
						type: e.name,
						count: e.count
					});
				});

				// Workspace stats metadata
				type WorkspaceStatsMetadataClassification = {
					owner: 'jrieken';
					comment: 'Metadata about workspace metadata collection';
					duration: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'How did it take to make workspace stats' };
					reachedLimit: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Did making workspace stats reach its limits' };
					fileCount: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'How many files did workspace stats discover' };
					readdirCount: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'How many readdir call were needed' };
				};
				type WorkspaceStatsMetadata = {
					duration: number;
					reachedLimit: boolean;
					fileCount: number;
					readdirCount: number;
				};
				this.telemetryService.publicLog2<WorkspaceStatsMetadata, WorkspaceStatsMetadataClassification>('workspace.stats.metadata', { duration: stats.totalScanTime, reachedLimit: stats.maxFilesReached, fileCount: stats.fileCount, readdirCount: stats.totalReaddirCount });
			} catch {
				// Report nothing if collecting metadata fails.
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/dialogs/browser/dialog.ts]---
Location: vscode-main/src/vs/platform/dialogs/browser/dialog.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EventHelper } from '../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../base/browser/keyboardEvent.js';
import { IDialogOptions } from '../../../base/browser/ui/dialog/dialog.js';
import { fromNow } from '../../../base/common/date.js';
import { localize } from '../../../nls.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';
import { ResultKind } from '../../keybinding/common/keybindingResolver.js';
import { ILayoutService } from '../../layout/browser/layoutService.js';
import { IProductService } from '../../product/common/productService.js';
import { defaultButtonStyles, defaultCheckboxStyles, defaultInputBoxStyles, defaultDialogStyles } from '../../theme/browser/defaultStyles.js';

const defaultDialogAllowableCommands = [
	'workbench.action.quit',
	'workbench.action.reloadWindow',
	'copy',
	'cut',
	'editor.action.selectAll',
	'editor.action.clipboardCopyAction',
	'editor.action.clipboardCutAction',
	'editor.action.clipboardPasteAction'
];

export function createWorkbenchDialogOptions(options: Partial<IDialogOptions>, keybindingService: IKeybindingService, layoutService: ILayoutService, allowableCommands = defaultDialogAllowableCommands): IDialogOptions {
	return {
		keyEventProcessor: (event: StandardKeyboardEvent) => {
			const resolved = keybindingService.softDispatch(event, layoutService.activeContainer);
			if (resolved.kind === ResultKind.KbFound && resolved.commandId) {
				if (!allowableCommands.includes(resolved.commandId)) {
					EventHelper.stop(event, true);
				}
			}
		},
		buttonStyles: defaultButtonStyles,
		checkboxStyles: defaultCheckboxStyles,
		inputBoxStyles: defaultInputBoxStyles,
		dialogStyles: defaultDialogStyles,
		...options
	};
}

export function createBrowserAboutDialogDetails(productService: IProductService): { title: string; details: string; detailsToCopy: string } {
	const detailString = (useAgo: boolean): string => {
		return localize('aboutDetail',
			"Version: {0}\nCommit: {1}\nDate: {2}\nBrowser: {3}",
			productService.version || 'Unknown',
			productService.commit || 'Unknown',
			productService.date ? `${productService.date}${useAgo ? ' (' + fromNow(new Date(productService.date), true) + ')' : ''}` : 'Unknown',
			navigator.userAgent
		);
	};

	const details = detailString(true);
	const detailsToCopy = detailString(false);

	return {
		title: productService.nameLong,
		details: details,
		detailsToCopy: detailsToCopy
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/dialogs/common/dialogs.ts]---
Location: vscode-main/src/vs/platform/dialogs/common/dialogs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';
import { basename } from '../../../base/common/resources.js';
import Severity from '../../../base/common/severity.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ITelemetryData } from '../../telemetry/common/telemetry.js';
import { MessageBoxOptions } from '../../../base/parts/sandbox/common/electronTypes.js';
import { mnemonicButtonLabel } from '../../../base/common/labels.js';
import { isLinux, isMacintosh, isWindows } from '../../../base/common/platform.js';
import { IProductService } from '../../product/common/productService.js';
import { deepClone } from '../../../base/common/objects.js';

export interface IDialogArgs {
	readonly confirmArgs?: IConfirmDialogArgs;
	readonly inputArgs?: IInputDialogArgs;
	readonly promptArgs?: IPromptDialogArgs;
}

export interface IBaseDialogOptions {
	readonly type?: Severity | DialogType;

	readonly title?: string;
	readonly message: string;
	readonly detail?: string;

	readonly checkbox?: ICheckbox;

	/**
	 * Allows to enforce use of custom dialog even in native environments.
	 */
	readonly custom?: boolean | ICustomDialogOptions;
}

export interface IConfirmDialogArgs {
	readonly confirmation: IConfirmation;
}

export interface IConfirmation extends IBaseDialogOptions {

	/**
	 * If not provided, defaults to `Yes`.
	 */
	readonly primaryButton?: string;

	/**
	 * If not provided, defaults to `Cancel`.
	 */
	readonly cancelButton?: string;
}

export interface IConfirmationResult extends ICheckboxResult {

	/**
	 * Will be true if the dialog was confirmed with the primary button pressed.
	 */
	readonly confirmed: boolean;
}

export interface IInputDialogArgs {
	readonly input: IInput;
}

export interface IInput extends IConfirmation {
	readonly inputs: IInputElement[];

	/**
	 * If not provided, defaults to `Ok`.
	 */
	readonly primaryButton?: string;
}

export interface IInputElement {
	readonly type?: 'text' | 'password';
	readonly value?: string;
	readonly placeholder?: string;
}

export interface IInputResult extends IConfirmationResult {

	/**
	 * Values for the input fields as provided by the user or `undefined` if none.
	 */
	readonly values?: string[];
}

export interface IPromptDialogArgs {
	readonly prompt: IPrompt<unknown>;
}

export interface IPromptBaseButton<T> {

	/**
	 * @returns the result of the prompt button will be returned
	 * as result from the `prompt()` call.
	 */
	run(checkbox: ICheckboxResult): T | Promise<T>;
}

export interface IPromptButton<T> extends IPromptBaseButton<T> {
	readonly label: string;
}

export interface IPromptCancelButton<T> extends IPromptBaseButton<T> {

	/**
	 * The cancel button to show in the prompt. Defaults to
	 * `Cancel` if not provided.
	 */
	readonly label?: string;
}

export interface IPrompt<T> extends IBaseDialogOptions {

	/**
	 * The buttons to show in the prompt. Defaults to `OK`
	 * if no buttons or cancel button is provided.
	 */
	readonly buttons?: IPromptButton<T>[];

	/**
	 * The cancel button to show in the prompt. Defaults to
	 * `Cancel` if set to `true`.
	 */
	readonly cancelButton?: IPromptCancelButton<T> | true | string;
}

export interface IPromptWithCustomCancel<T> extends IPrompt<T> {
	readonly cancelButton: IPromptCancelButton<T>;
}

export interface IPromptWithDefaultCancel<T> extends IPrompt<T> {
	readonly cancelButton: true | string;
}

export interface IPromptResult<T> extends ICheckboxResult {

	/**
	 * The result of the `IPromptButton` that was pressed or `undefined` if none.
	 */
	readonly result?: T;
}

export interface IPromptResultWithCancel<T> extends IPromptResult<T> {
	readonly result: T;
}

export interface IAsyncPromptResult<T> extends ICheckboxResult {

	/**
	 * The result of the `IPromptButton` that was pressed or `undefined` if none.
	 */
	readonly result?: Promise<T>;
}

export interface IAsyncPromptResultWithCancel<T> extends IAsyncPromptResult<T> {
	readonly result: Promise<T>;
}

export type IDialogResult = IConfirmationResult | IInputResult | IAsyncPromptResult<unknown>;

export type DialogType = 'none' | 'info' | 'error' | 'question' | 'warning';

export interface ICheckbox {
	readonly label: string;
	readonly checked?: boolean;
}

export interface ICheckboxResult {

	/**
	 * This will only be defined if the confirmation was created
	 * with the checkbox option defined.
	 */
	readonly checkboxChecked?: boolean;
}

export interface IPickAndOpenOptions {
	readonly forceNewWindow?: boolean;
	defaultUri?: URI;
	readonly telemetryExtraData?: ITelemetryData;
	availableFileSystems?: string[];
	remoteAuthority?: string | null;
}

export interface FileFilter {
	readonly extensions: string[];
	readonly name: string;
}

export interface ISaveDialogOptions {

	/**
	 * A human-readable string for the dialog title
	 */
	title?: string;

	/**
	 * The resource the dialog shows when opened.
	 */
	defaultUri?: URI;

	/**
	 * A set of file filters that are used by the dialog. Each entry is a human readable label,
	 * like "TypeScript", and an array of extensions.
	 */
	filters?: FileFilter[];

	/**
	 * A human-readable string for the ok button
	 */
	readonly saveLabel?: { readonly withMnemonic: string; readonly withoutMnemonic: string } | string;

	/**
	 * Specifies a list of schemas for the file systems the user can save to. If not specified, uses the schema of the defaultURI or, if also not specified,
	 * the schema of the current window.
	 */
	availableFileSystems?: readonly string[];
}

export interface IOpenDialogOptions {

	/**
	 * A human-readable string for the dialog title
	 */
	readonly title?: string;

	/**
	 * The resource the dialog shows when opened.
	 */
	defaultUri?: URI;

	/**
	 * A human-readable string for the open button.
	 */
	readonly openLabel?: { readonly withMnemonic: string; readonly withoutMnemonic: string } | string;

	/**
	 * Allow to select files, defaults to `true`.
	 */
	canSelectFiles?: boolean;

	/**
	 * Allow to select folders, defaults to `false`.
	 */
	canSelectFolders?: boolean;

	/**
	 * Allow to select many files or folders.
	 */
	readonly canSelectMany?: boolean;

	/**
	 * A set of file filters that are used by the dialog. Each entry is a human readable label,
	 * like "TypeScript", and an array of extensions.
	 */
	filters?: FileFilter[];

	/**
	 * Specifies a list of schemas for the file systems the user can load from. If not specified, uses the schema of the defaultURI or, if also not available,
	 * the schema of the current window.
	 */
	availableFileSystems?: readonly string[];
}

export const IDialogService = createDecorator<IDialogService>('dialogService');

export interface ICustomDialogOptions {
	readonly buttonDetails?: string[];
	readonly markdownDetails?: ICustomDialogMarkdown[];
	readonly classes?: string[];
	readonly icon?: ThemeIcon;
	readonly disableCloseAction?: boolean;
}

export interface ICustomDialogMarkdown {
	readonly markdown: IMarkdownString;
	readonly classes?: string[];
	/** Custom link handler for markdown content, see {@link IContentActionHandler}. Defaults to {@link openLinkFromMarkdown}. */
	actionHandler?(link: string): Promise<boolean>;
}

/**
 * A handler to bring up modal dialogs.
 */
export interface IDialogHandler {

	/**
	 * Ask the user for confirmation with a modal dialog.
	 */
	confirm(confirmation: IConfirmation): Promise<IConfirmationResult>;

	/**
	 * Prompt the user with a modal dialog.
	 */
	prompt<T>(prompt: IPrompt<T>): Promise<IAsyncPromptResult<T>>;

	/**
	 * Present a modal dialog to the user asking for input.
	 */
	input(input: IInput): Promise<IInputResult>;

	/**
	 * Present the about dialog to the user.
	 */
	about(title: string, details: string, detailsToCopy: string): Promise<void>;
}

enum DialogKind {
	Confirmation = 1,
	Prompt,
	Input
}

export abstract class AbstractDialogHandler implements IDialogHandler {

	protected getConfirmationButtons(dialog: IConfirmation): string[] {
		return this.getButtons(dialog, DialogKind.Confirmation);
	}

	protected getPromptButtons(dialog: IPrompt<unknown>): string[] {
		return this.getButtons(dialog, DialogKind.Prompt);
	}

	protected getInputButtons(dialog: IInput): string[] {
		return this.getButtons(dialog, DialogKind.Input);
	}

	private getButtons(dialog: IConfirmation, kind: DialogKind.Confirmation): string[];
	private getButtons(dialog: IPrompt<unknown>, kind: DialogKind.Prompt): string[];
	private getButtons(dialog: IInput, kind: DialogKind.Input): string[];
	private getButtons(dialog: IConfirmation | IInput | IPrompt<unknown>, kind: DialogKind): string[] {

		// We put buttons in the order of "default" button first and "cancel"
		// button last. There maybe later processing when presenting the buttons
		// based on OS standards.

		const buttons: string[] = [];

		switch (kind) {
			case DialogKind.Confirmation: {
				const confirmationDialog = dialog as IConfirmation;

				if (confirmationDialog.primaryButton) {
					buttons.push(confirmationDialog.primaryButton);
				} else {
					buttons.push(localize({ key: 'yesButton', comment: ['&& denotes a mnemonic'] }, "&&Yes"));
				}

				if (confirmationDialog.cancelButton) {
					buttons.push(confirmationDialog.cancelButton);
				} else {
					buttons.push(localize('cancelButton', "Cancel"));
				}

				break;
			}
			case DialogKind.Prompt: {
				const promptDialog = dialog as IPrompt<unknown>;

				if (Array.isArray(promptDialog.buttons) && promptDialog.buttons.length > 0) {
					buttons.push(...promptDialog.buttons.map(button => button.label));
				}

				if (promptDialog.cancelButton) {
					if (promptDialog.cancelButton === true) {
						buttons.push(localize('cancelButton', "Cancel"));
					} else if (typeof promptDialog.cancelButton === 'string') {
						buttons.push(promptDialog.cancelButton);
					} else {
						if (promptDialog.cancelButton.label) {
							buttons.push(promptDialog.cancelButton.label);
						} else {
							buttons.push(localize('cancelButton', "Cancel"));
						}
					}
				}

				if (buttons.length === 0) {
					buttons.push(localize({ key: 'okButton', comment: ['&& denotes a mnemonic'] }, "&&OK"));
				}

				break;
			}
			case DialogKind.Input: {
				const inputDialog = dialog as IInput;

				if (inputDialog.primaryButton) {
					buttons.push(inputDialog.primaryButton);
				} else {
					buttons.push(localize({ key: 'okButton', comment: ['&& denotes a mnemonic'] }, "&&OK"));
				}

				if (inputDialog.cancelButton) {
					buttons.push(inputDialog.cancelButton);
				} else {
					buttons.push(localize('cancelButton', "Cancel"));
				}

				break;
			}
		}

		return buttons;
	}

	protected getDialogType(type: Severity | DialogType | undefined): DialogType | undefined {
		if (typeof type === 'string') {
			return type;
		}

		if (typeof type === 'number') {
			return (type === Severity.Info) ? 'info' : (type === Severity.Error) ? 'error' : (type === Severity.Warning) ? 'warning' : 'none';
		}

		return undefined;
	}

	protected getPromptResult<T>(prompt: IPrompt<T>, buttonIndex: number, checkboxChecked: boolean | undefined): IAsyncPromptResult<T> {
		const promptButtons: IPromptBaseButton<T>[] = [...(prompt.buttons ?? [])];
		if (prompt.cancelButton && typeof prompt.cancelButton !== 'string' && typeof prompt.cancelButton !== 'boolean') {
			promptButtons.push(prompt.cancelButton);
		}

		let result = promptButtons[buttonIndex]?.run({ checkboxChecked });
		if (!(result instanceof Promise)) {
			result = Promise.resolve(result);
		}

		return { result, checkboxChecked };
	}

	abstract confirm(confirmation: IConfirmation): Promise<IConfirmationResult>;
	abstract input(input: IInput): Promise<IInputResult>;
	abstract prompt<T>(prompt: IPrompt<T>): Promise<IAsyncPromptResult<T>>;
	abstract about(title: string, details: string, detailsToCopy: string): Promise<void>;
}

/**
 * A service to bring up modal dialogs.
 *
 * Note: use the `INotificationService.prompt()` method for a non-modal way to ask
 * the user for input.
 */
export interface IDialogService {

	readonly _serviceBrand: undefined;

	/**
	 * An event that fires when a dialog is about to show.
	 */
	readonly onWillShowDialog: Event<void>;

	/**
	 * An event that fires when a dialog did show (closed).
	 */
	readonly onDidShowDialog: Event<void>;

	/**
	 * Ask the user for confirmation with a modal dialog.
	 */
	confirm(confirmation: IConfirmation): Promise<IConfirmationResult>;

	/**
	 * Prompt the user with a modal dialog. Provides a bit
	 * more control over the dialog compared to the simpler
	 * `confirm` method. Specifically, allows to show more
	 * than 2 buttons and makes it easier to just show a
	 * message to the user.
	 *
	 * @returns a promise that resolves to the `T` result
	 * from the provided `IPromptButton<T>` or `undefined`.
	 */
	prompt<T>(prompt: IPromptWithCustomCancel<T>): Promise<IPromptResultWithCancel<T>>;
	prompt<T>(prompt: IPromptWithDefaultCancel<T>): Promise<IPromptResult<T>>;
	prompt<T>(prompt: IPrompt<T>): Promise<IPromptResult<T>>;

	/**
	 * Present a modal dialog to the user asking for input.
	 */
	input(input: IInput): Promise<IInputResult>;

	/**
	 * Show a modal info dialog.
	 */
	info(message: string, detail?: string): Promise<void>;

	/**
	 * Show a modal warning dialog.
	 */
	warn(message: string, detail?: string): Promise<void>;

	/**
	 * Show a modal error dialog.
	 */
	error(message: string, detail?: string): Promise<void>;

	/**
	 * Present the about dialog to the user.
	 */
	about(): Promise<void>;
}

export const IFileDialogService = createDecorator<IFileDialogService>('fileDialogService');

/**
 * A service to bring up file dialogs.
 */
export interface IFileDialogService {

	readonly _serviceBrand: undefined;

	/**
	 * The default path for a new file based on previously used files.
	 * @param schemeFilter The scheme of the file path. If no filter given, the scheme of the current window is used.
	 * Falls back to user home in the absence of enough information to find a better URI.
	 */
	defaultFilePath(schemeFilter?: string): Promise<URI>;

	/**
	 * The default path for a new folder based on previously used folders.
	 * @param schemeFilter The scheme of the folder path. If no filter given, the scheme of the current window is used.
	 * Falls back to user home in the absence of enough information to find a better URI.
	 */
	defaultFolderPath(schemeFilter?: string): Promise<URI>;

	/**
	 * The default path for a new workspace based on previously used workspaces.
	 * @param schemeFilter The scheme of the workspace path. If no filter given, the scheme of the current window is used.
	 * Falls back to user home in the absence of enough information to find a better URI.
	 */
	defaultWorkspacePath(schemeFilter?: string): Promise<URI>;

	/**
	 * Shows a file-folder selection dialog and opens the selected entry.
	 */
	pickFileFolderAndOpen(options: IPickAndOpenOptions): Promise<void>;

	/**
	 * Shows a file selection dialog and opens the selected entry.
	 */
	pickFileAndOpen(options: IPickAndOpenOptions): Promise<void>;

	/**
	 * Shows a folder selection dialog and opens the selected entry.
	 */
	pickFolderAndOpen(options: IPickAndOpenOptions): Promise<void>;

	/**
	 * Shows a workspace selection dialog and opens the selected entry.
	 */
	pickWorkspaceAndOpen(options: IPickAndOpenOptions): Promise<void>;

	/**
	 * Shows a save file dialog and save the file at the chosen file URI.
	 */
	pickFileToSave(defaultUri: URI, availableFileSystems?: string[]): Promise<URI | undefined>;

	/**
	 * The preferred folder path to open the dialog at.
	 * @param schemeFilter The scheme of the file path. If no filter given, the scheme of the current window is used.
	 * Falls back to user home in the absence of a setting.
	 */
	preferredHome(schemeFilter?: string): Promise<URI>;

	/**
	 * Shows a save file dialog and returns the chosen file URI.
	 */
	showSaveDialog(options: ISaveDialogOptions): Promise<URI | undefined>;

	/**
	 * Shows a confirm dialog for saving 1-N files.
	 */
	showSaveConfirm(fileNamesOrResources: (string | URI)[]): Promise<ConfirmResult>;

	/**
	 * Shows a open file dialog and returns the chosen file URI.
	 */
	showOpenDialog(options: IOpenDialogOptions): Promise<URI[] | undefined>;
}

export const enum ConfirmResult {
	SAVE,
	DONT_SAVE,
	CANCEL
}

const MAX_CONFIRM_FILES = 10;
export function getFileNamesMessage(fileNamesOrResources: readonly (string | URI)[]): string {
	const message: string[] = [];
	message.push(...fileNamesOrResources.slice(0, MAX_CONFIRM_FILES).map(fileNameOrResource => typeof fileNameOrResource === 'string' ? fileNameOrResource : basename(fileNameOrResource)));

	if (fileNamesOrResources.length > MAX_CONFIRM_FILES) {
		if (fileNamesOrResources.length - MAX_CONFIRM_FILES === 1) {
			message.push(localize('moreFile', "...1 additional file not shown"));
		} else {
			message.push(localize('moreFiles', "...{0} additional files not shown", fileNamesOrResources.length - MAX_CONFIRM_FILES));
		}
	}

	message.push('');
	return message.join('\n');
}

export interface INativeOpenDialogOptions {
	readonly forceNewWindow?: boolean;

	readonly defaultPath?: string;

	readonly telemetryEventName?: string;
	readonly telemetryExtraData?: ITelemetryData;
}

export interface IMassagedMessageBoxOptions {

	/**
	 * OS massaged message box options.
	 */
	readonly options: MessageBoxOptions;

	/**
	 * Since the massaged result of the message box options potentially
	 * changes the order of buttons, we have to keep a map of these
	 * changes so that we can still return the correct index to the caller.
	 */
	readonly buttonIndeces: number[];
}

/**
 * A utility method to ensure the options for the message box dialog
 * are using properties that are consistent across all platforms and
 * specific to the platform where necessary.
 */
export function massageMessageBoxOptions(options: MessageBoxOptions, productService: IProductService): IMassagedMessageBoxOptions {
	const massagedOptions = deepClone(options);

	let buttons = (massagedOptions.buttons ?? []).map(button => mnemonicButtonLabel(button).withMnemonic);
	let buttonIndeces = (options.buttons || []).map((button, index) => index);

	let defaultId = 0; // by default the first button is default button
	let cancelId = massagedOptions.cancelId ?? buttons.length - 1; // by default the last button is cancel button

	// Apply HIG per OS when more than one button is used
	if (buttons.length > 1) {
		const cancelButton = typeof cancelId === 'number' ? buttons[cancelId] : undefined;

		if (isLinux || isMacintosh) {

			// Linux: the GNOME HIG (https://developer.gnome.org/hig/patterns/feedback/dialogs.html?highlight=dialog)
			// recommend the following:
			// "Always ensure that the cancel button appears first, before the affirmative button. In left-to-right
			//  locales, this is on the left. This button order ensures that users become aware of, and are reminded
			//  of, the ability to cancel prior to encountering the affirmative button."
			//
			// Electron APIs do not reorder buttons for us, so we ensure a reverse order of buttons and a position
			// of the cancel button (if provided) that matches the HIG

			// macOS: the HIG (https://developer.apple.com/design/human-interface-guidelines/components/presentation/alerts)
			// recommend the following:
			// "Place buttons where people expect. In general, place the button people are most likely to choose on the trailing side in a
			//  row of buttons or at the top in a stack of buttons. Always place the default button on the trailing side of a row or at the
			//  top of a stack. Cancel buttons are typically on the leading side of a row or at the bottom of a stack."
			//
			// However: it seems that older macOS versions where 3 buttons were presented in a row differ from this
			// recommendation. In fact, cancel buttons were placed to the left of the default button and secondary
			// buttons on the far left. To support these older macOS versions we have to manually shuffle the cancel
			// button in the same way as we do on Linux. This will not have any impact on newer macOS versions where
			// shuffling is done for us.

			if (typeof cancelButton === 'string' && buttons.length > 1 && cancelId !== 1) {
				buttons.splice(cancelId, 1);
				buttons.splice(1, 0, cancelButton);

				const cancelButtonIndex = buttonIndeces[cancelId];
				buttonIndeces.splice(cancelId, 1);
				buttonIndeces.splice(1, 0, cancelButtonIndex);

				cancelId = 1;
			}

			if (isLinux && buttons.length > 1) {
				buttons = buttons.reverse();
				buttonIndeces = buttonIndeces.reverse();

				defaultId = buttons.length - 1;
				if (typeof cancelButton === 'string') {
					cancelId = defaultId - 1;
				}
			}
		} else if (isWindows) {

			// Windows: the HIG (https://learn.microsoft.com/en-us/windows/win32/uxguide/win-dialog-box)
			// recommend the following:
			// "One of the following sets of concise commands: Yes/No, Yes/No/Cancel, [Do it]/Cancel,
			//  [Do it]/[Don't do it], [Do it]/[Don't do it]/Cancel."
			//
			// Electron APIs do not reorder buttons for us, so we ensure the position of the cancel button
			// (if provided) that matches the HIG

			if (typeof cancelButton === 'string' && buttons.length > 1 && cancelId !== buttons.length - 1 /* last action */) {
				buttons.splice(cancelId, 1);
				buttons.push(cancelButton);

				const buttonIndex = buttonIndeces[cancelId];
				buttonIndeces.splice(cancelId, 1);
				buttonIndeces.push(buttonIndex);

				cancelId = buttons.length - 1;
			}
		}
	}

	massagedOptions.buttons = buttons;
	massagedOptions.defaultId = defaultId;
	massagedOptions.cancelId = cancelId;
	massagedOptions.noLink = true;
	massagedOptions.title = massagedOptions.title || productService.nameLong;

	return {
		options: massagedOptions,
		buttonIndeces
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/dialogs/electron-browser/dialog.ts]---
Location: vscode-main/src/vs/platform/dialogs/electron-browser/dialog.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { fromNow } from '../../../base/common/date.js';
import { isLinuxSnap } from '../../../base/common/platform.js';
import { localize } from '../../../nls.js';
import { IOSProperties } from '../../native/common/native.js';
import { IProductService } from '../../product/common/productService.js';
import { process } from '../../../base/parts/sandbox/electron-browser/globals.js';

export function createNativeAboutDialogDetails(productService: IProductService, osProps: IOSProperties): { title: string; details: string; detailsToCopy: string } {
	let version = productService.version;
	if (productService.target) {
		version = `${version} (${productService.target} setup)`;
	} else if (productService.darwinUniversalAssetId) {
		version = `${version} (Universal)`;
	}

	const getDetails = (useAgo: boolean): string => {
		return localize({ key: 'aboutDetail', comment: ['Electron, Chromium, Node.js and V8 are product names that need no translation'] },
			"Version: {0}\nCommit: {1}\nDate: {2}\nElectron: {3}\nElectronBuildId: {4}\nChromium: {5}\nNode.js: {6}\nV8: {7}\nOS: {8}",
			version,
			productService.commit || 'Unknown',
			productService.date ? `${productService.date}${useAgo ? ' (' + fromNow(new Date(productService.date), true) + ')' : ''}` : 'Unknown',
			process.versions['electron'],
			process.versions['microsoft-build'],
			process.versions['chrome'],
			process.versions['node'],
			process.versions['v8'],
			`${osProps.type} ${osProps.arch} ${osProps.release}${isLinuxSnap ? ' snap' : ''}`
		);
	};

	const details = getDetails(true);
	const detailsToCopy = getDetails(false);

	return {
		title: productService.nameLong,
		details: details,
		detailsToCopy: detailsToCopy
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/dialogs/electron-main/dialogMainService.ts]---
Location: vscode-main/src/vs/platform/dialogs/electron-main/dialogMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import electron from 'electron';
import { Queue } from '../../../base/common/async.js';
import { hash } from '../../../base/common/hash.js';
import { mnemonicButtonLabel } from '../../../base/common/labels.js';
import { Disposable, dispose, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { normalizeNFC } from '../../../base/common/normalization.js';
import { isMacintosh, isWindows } from '../../../base/common/platform.js';
import { Promises } from '../../../base/node/pfs.js';
import { localize } from '../../../nls.js';
import { INativeOpenDialogOptions, massageMessageBoxOptions } from '../common/dialogs.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { IProductService } from '../../product/common/productService.js';
import { WORKSPACE_FILTER } from '../../workspace/common/workspace.js';

export const IDialogMainService = createDecorator<IDialogMainService>('dialogMainService');

export interface IDialogMainService {

	readonly _serviceBrand: undefined;

	pickFileFolder(options: INativeOpenDialogOptions, window?: electron.BrowserWindow): Promise<string[] | undefined>;
	pickFolder(options: INativeOpenDialogOptions, window?: electron.BrowserWindow): Promise<string[] | undefined>;
	pickFile(options: INativeOpenDialogOptions, window?: electron.BrowserWindow): Promise<string[] | undefined>;
	pickWorkspace(options: INativeOpenDialogOptions, window?: electron.BrowserWindow): Promise<string[] | undefined>;

	showMessageBox(options: electron.MessageBoxOptions, window?: electron.BrowserWindow): Promise<electron.MessageBoxReturnValue>;
	showSaveDialog(options: electron.SaveDialogOptions, window?: electron.BrowserWindow): Promise<electron.SaveDialogReturnValue>;
	showOpenDialog(options: electron.OpenDialogOptions, window?: electron.BrowserWindow): Promise<electron.OpenDialogReturnValue>;
}

interface IInternalNativeOpenDialogOptions extends INativeOpenDialogOptions {
	readonly pickFolders?: boolean;
	readonly pickFiles?: boolean;

	readonly title: string;
	readonly buttonLabel?: string;
	readonly filters?: electron.FileFilter[];
}

export class DialogMainService implements IDialogMainService {

	declare readonly _serviceBrand: undefined;

	private readonly windowFileDialogLocks = new Map<number, Set<number>>();
	private readonly windowDialogQueues = new Map<number, Queue<electron.MessageBoxReturnValue | electron.SaveDialogReturnValue | electron.OpenDialogReturnValue>>();
	private readonly noWindowDialogueQueue = new Queue<electron.MessageBoxReturnValue | electron.SaveDialogReturnValue | electron.OpenDialogReturnValue>();

	constructor(
		@ILogService private readonly logService: ILogService,
		@IProductService private readonly productService: IProductService
	) {
	}

	pickFileFolder(options: INativeOpenDialogOptions, window?: electron.BrowserWindow): Promise<string[] | undefined> {
		return this.doPick({ ...options, pickFolders: true, pickFiles: true, title: localize('open', "Open") }, window);
	}

	pickFolder(options: INativeOpenDialogOptions, window?: electron.BrowserWindow): Promise<string[] | undefined> {
		let optionsInternal: IInternalNativeOpenDialogOptions = {
			...options,
			pickFolders: true,
			title: localize('openFolder', "Open Folder")
		};

		if (isWindows) {
			// Due to Windows/Electron issue the labels on Open Folder dialog have no hot keys.
			// We can fix this here for the button label, but some other labels remain inaccessible.
			// See https://github.com/electron/electron/issues/48631 for more info.
			optionsInternal = {
				...optionsInternal,
				buttonLabel: mnemonicButtonLabel(localize({ key: 'selectFolder', comment: ['&& denotes a mnemonic'] }, "&&Select folder")).withMnemonic
			};
		}

		return this.doPick(optionsInternal, window);
	}

	pickFile(options: INativeOpenDialogOptions, window?: electron.BrowserWindow): Promise<string[] | undefined> {
		return this.doPick({ ...options, pickFiles: true, title: localize('openFile', "Open File") }, window);
	}

	pickWorkspace(options: INativeOpenDialogOptions, window?: electron.BrowserWindow): Promise<string[] | undefined> {
		const title = localize('openWorkspaceTitle', "Open Workspace from File");
		const buttonLabel = mnemonicButtonLabel(localize({ key: 'openWorkspace', comment: ['&& denotes a mnemonic'] }, "&&Open")).withMnemonic;
		const filters = WORKSPACE_FILTER;

		return this.doPick({ ...options, pickFiles: true, title, filters, buttonLabel }, window);
	}

	private async doPick(options: IInternalNativeOpenDialogOptions, window?: electron.BrowserWindow): Promise<string[] | undefined> {

		// Ensure dialog options
		const dialogOptions: electron.OpenDialogOptions = {
			title: options.title,
			buttonLabel: options.buttonLabel,
			filters: options.filters,
			defaultPath: options.defaultPath
		};

		// Ensure properties
		if (typeof options.pickFiles === 'boolean' || typeof options.pickFolders === 'boolean') {
			dialogOptions.properties = undefined; // let it override based on the booleans

			if (options.pickFiles && options.pickFolders) {
				dialogOptions.properties = ['multiSelections', 'openDirectory', 'openFile', 'createDirectory'];
			}
		}

		if (!dialogOptions.properties) {
			dialogOptions.properties = ['multiSelections', options.pickFolders ? 'openDirectory' : 'openFile', 'createDirectory'];
		}

		if (isMacintosh) {
			dialogOptions.properties.push('treatPackageAsDirectory'); // always drill into .app files
		}

		// Show Dialog
		const result = await this.showOpenDialog(dialogOptions, (window || electron.BrowserWindow.getFocusedWindow()) ?? undefined);
		if (result?.filePaths && result.filePaths.length > 0) {
			return result.filePaths;
		}

		return undefined;
	}

	private getWindowDialogQueue<T extends electron.MessageBoxReturnValue | electron.SaveDialogReturnValue | electron.OpenDialogReturnValue>(window?: electron.BrowserWindow): Queue<T> {

		// Queue message box requests per window so that one can show
		// after the other.
		if (window) {
			let windowDialogQueue = this.windowDialogQueues.get(window.id);
			if (!windowDialogQueue) {
				windowDialogQueue = new Queue<electron.MessageBoxReturnValue | electron.SaveDialogReturnValue | electron.OpenDialogReturnValue>();
				this.windowDialogQueues.set(window.id, windowDialogQueue);
			}

			return windowDialogQueue as unknown as Queue<T>;
		} else {
			return this.noWindowDialogueQueue as unknown as Queue<T>;
		}
	}

	showMessageBox(rawOptions: electron.MessageBoxOptions, window?: electron.BrowserWindow): Promise<electron.MessageBoxReturnValue> {
		return this.getWindowDialogQueue<electron.MessageBoxReturnValue>(window).queue(async () => {
			const { options, buttonIndeces } = massageMessageBoxOptions(rawOptions, this.productService);

			let result: electron.MessageBoxReturnValue | undefined = undefined;
			if (window) {
				result = await electron.dialog.showMessageBox(window, options);
			} else {
				result = await electron.dialog.showMessageBox(options);
			}

			return {
				response: buttonIndeces[result.response],
				checkboxChecked: result.checkboxChecked
			};
		});
	}

	async showSaveDialog(options: electron.SaveDialogOptions, window?: electron.BrowserWindow): Promise<electron.SaveDialogReturnValue> {

		// Prevent duplicates of the same dialog queueing at the same time
		const fileDialogLock = this.acquireFileDialogLock(options, window);
		if (!fileDialogLock) {
			this.logService.error('[DialogMainService]: file save dialog is already or will be showing for the window with the same configuration');

			return { canceled: true, filePath: '' };
		}

		try {
			return await this.getWindowDialogQueue<electron.SaveDialogReturnValue>(window).queue(async () => {
				let result: electron.SaveDialogReturnValue;
				if (window) {
					result = await electron.dialog.showSaveDialog(window, options);
				} else {
					result = await electron.dialog.showSaveDialog(options);
				}

				result.filePath = this.normalizePath(result.filePath);

				return result;
			});
		} finally {
			dispose(fileDialogLock);
		}
	}

	private normalizePath(path: string): string;
	private normalizePath(path: string | undefined): string | undefined;
	private normalizePath(path: string | undefined): string | undefined {
		if (path && isMacintosh) {
			path = normalizeNFC(path); // macOS only: normalize paths to NFC form
		}

		return path;
	}

	private normalizePaths(paths: string[]): string[] {
		return paths.map(path => this.normalizePath(path));
	}

	async showOpenDialog(options: electron.OpenDialogOptions, window?: electron.BrowserWindow): Promise<electron.OpenDialogReturnValue> {

		// Ensure the path exists (if provided)
		if (options.defaultPath) {
			const pathExists = await Promises.exists(options.defaultPath);
			if (!pathExists) {
				options.defaultPath = undefined;
			}
		}

		// Prevent duplicates of the same dialog queueing at the same time
		const fileDialogLock = this.acquireFileDialogLock(options, window);
		if (!fileDialogLock) {
			this.logService.error('[DialogMainService]: file open dialog is already or will be showing for the window with the same configuration');

			return { canceled: true, filePaths: [] };
		}

		try {
			return await this.getWindowDialogQueue<electron.OpenDialogReturnValue>(window).queue(async () => {
				let result: electron.OpenDialogReturnValue;
				if (window) {
					result = await electron.dialog.showOpenDialog(window, options);
				} else {
					result = await electron.dialog.showOpenDialog(options);
				}

				result.filePaths = this.normalizePaths(result.filePaths);

				return result;
			});
		} finally {
			dispose(fileDialogLock);
		}
	}

	private acquireFileDialogLock(options: electron.SaveDialogOptions | electron.OpenDialogOptions, window?: electron.BrowserWindow): IDisposable | undefined {

		// If no window is provided, allow as many dialogs as
		// needed since we consider them not modal per window
		if (!window) {
			return Disposable.None;
		}

		// If a window is provided, only allow a single dialog
		// at the same time because dialogs are modal and we
		// do not want to open one dialog after the other
		// (https://github.com/microsoft/vscode/issues/114432)
		// we figure this out by `hashing` the configuration
		// options for the dialog to prevent duplicates

		this.logService.trace('[DialogMainService]: request to acquire file dialog lock', options);

		let windowFileDialogLocks = this.windowFileDialogLocks.get(window.id);
		if (!windowFileDialogLocks) {
			windowFileDialogLocks = new Set();
			this.windowFileDialogLocks.set(window.id, windowFileDialogLocks);
		}

		const optionsHash = hash(options);
		if (windowFileDialogLocks.has(optionsHash)) {
			return undefined; // prevent duplicates, return
		}

		this.logService.trace('[DialogMainService]: new file dialog lock created', options);

		windowFileDialogLocks.add(optionsHash);

		return toDisposable(() => {
			this.logService.trace('[DialogMainService]: file dialog lock disposed', options);

			windowFileDialogLocks?.delete(optionsHash);

			// If the window has no more dialog locks, delete it from the set of locks
			if (windowFileDialogLocks?.size === 0) {
				this.windowFileDialogLocks.delete(window.id);
			}
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/dialogs/test/common/dialog.test.ts]---
Location: vscode-main/src/vs/platform/dialogs/test/common/dialog.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepEqual } from 'assert';
import { isLinux, isMacintosh, isWindows } from '../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IMassagedMessageBoxOptions, massageMessageBoxOptions } from '../../common/dialogs.js';
import product from '../../../product/common/product.js';
import { IProductService } from '../../../product/common/productService.js';

suite('Dialog', () => {

	function assertOptions({ options, buttonIndeces }: IMassagedMessageBoxOptions, buttons: string[], defaultId: number, cancelId: number, indeces: number[]): void {
		deepEqual(options.buttons, buttons);
		deepEqual(options.defaultId, defaultId);
		deepEqual(options.cancelId, cancelId);
		deepEqual(buttonIndeces, indeces);
	}

	test('massageMessageBoxOptions', () => {
		const testProductService: IProductService = {
			_serviceBrand: undefined,
			...product,
			nameLong: 'Test'
		};

		// All platforms
		const allPlatformsMassagedOptions = massageMessageBoxOptions({ buttons: ['1'], message: 'message' }, testProductService);
		deepEqual(allPlatformsMassagedOptions.options.title, 'Test');
		deepEqual(allPlatformsMassagedOptions.options.message, 'message');
		deepEqual(allPlatformsMassagedOptions.options.noLink, true);

		// Specific cases

		const oneButtonNoCancel = massageMessageBoxOptions({ buttons: ['1'], cancelId: undefined, message: 'message' }, testProductService);
		const oneButtonCancel_0 = massageMessageBoxOptions({ buttons: ['1'], cancelId: 0, message: 'message' }, testProductService);
		const oneButtonCancel_1 = massageMessageBoxOptions({ buttons: ['1'], cancelId: 1, message: 'message' }, testProductService);
		const oneButtonNegativeCancel = massageMessageBoxOptions({ buttons: ['1'], cancelId: -1, message: 'message' }, testProductService);

		const twoButtonNoCancel = massageMessageBoxOptions({ buttons: ['1', '2'], cancelId: undefined, message: 'message' }, testProductService);
		const twoButtonCancel_0 = massageMessageBoxOptions({ buttons: ['1', '2'], cancelId: 0, message: 'message' }, testProductService);
		const twoButtonCancel_1 = massageMessageBoxOptions({ buttons: ['1', '2'], cancelId: 1, message: 'message' }, testProductService);
		const twoButtonCancel_2 = massageMessageBoxOptions({ buttons: ['1', '2'], cancelId: 2, message: 'message' }, testProductService);
		const twoButtonNegativeCancel = massageMessageBoxOptions({ buttons: ['1', '2'], cancelId: -1, message: 'message' }, testProductService);

		const threeButtonNoCancel = massageMessageBoxOptions({ buttons: ['1', '2', '3'], cancelId: undefined, message: 'message' }, testProductService);
		const threeButtonCancel_0 = massageMessageBoxOptions({ buttons: ['1', '2', '3'], cancelId: 0, message: 'message' }, testProductService);
		const threeButtonCancel_1 = massageMessageBoxOptions({ buttons: ['1', '2', '3'], cancelId: 1, message: 'message' }, testProductService);
		const threeButtonCancel_2 = massageMessageBoxOptions({ buttons: ['1', '2', '3'], cancelId: 2, message: 'message' }, testProductService);
		const threeButtonCancel_3 = massageMessageBoxOptions({ buttons: ['1', '2', '3'], cancelId: 3, message: 'message' }, testProductService);
		const threeButtonNegativeCancel = massageMessageBoxOptions({ buttons: ['1', '2', '3'], cancelId: -1, message: 'message' }, testProductService);

		const fourButtonNoCancel = massageMessageBoxOptions({ buttons: ['1', '2', '3', '4'], cancelId: undefined, message: 'message' }, testProductService);
		const fourButtonCancel_0 = massageMessageBoxOptions({ buttons: ['1', '2', '3', '4'], cancelId: 0, message: 'message' }, testProductService);
		const fourButtonCancel_1 = massageMessageBoxOptions({ buttons: ['1', '2', '3', '4'], cancelId: 1, message: 'message' }, testProductService);
		const fourButtonCancel_2 = massageMessageBoxOptions({ buttons: ['1', '2', '3', '4'], cancelId: 2, message: 'message' }, testProductService);
		const fourButtonCancel_3 = massageMessageBoxOptions({ buttons: ['1', '2', '3', '4'], cancelId: 3, message: 'message' }, testProductService);
		const fourButtonCancel_4 = massageMessageBoxOptions({ buttons: ['1', '2', '3', '4'], cancelId: 4, message: 'message' }, testProductService);
		const fourButtonNegativeCancel = massageMessageBoxOptions({ buttons: ['1', '2', '3', '4'], cancelId: -1, message: 'message' }, testProductService);

		if (isWindows) {
			assertOptions(oneButtonNoCancel, ['1'], 0, 0, [0]);
			assertOptions(oneButtonCancel_0, ['1'], 0, 0, [0]);
			assertOptions(oneButtonCancel_1, ['1'], 0, 1, [0]);
			assertOptions(oneButtonNegativeCancel, ['1'], 0, -1, [0]);

			assertOptions(twoButtonNoCancel, ['1', '2'], 0, 1, [0, 1]);
			assertOptions(twoButtonCancel_0, ['2', '1'], 0, 1, [1, 0]);
			assertOptions(twoButtonCancel_1, ['1', '2'], 0, 1, [0, 1]);
			assertOptions(twoButtonCancel_2, ['1', '2'], 0, 2, [0, 1]);
			assertOptions(twoButtonNegativeCancel, ['1', '2'], 0, -1, [0, 1]);

			assertOptions(threeButtonNoCancel, ['1', '2', '3'], 0, 2, [0, 1, 2]);
			assertOptions(threeButtonCancel_0, ['2', '3', '1'], 0, 2, [1, 2, 0]);
			assertOptions(threeButtonCancel_1, ['1', '3', '2'], 0, 2, [0, 2, 1]);
			assertOptions(threeButtonCancel_2, ['1', '2', '3'], 0, 2, [0, 1, 2]);
			assertOptions(threeButtonCancel_3, ['1', '2', '3'], 0, 3, [0, 1, 2]);
			assertOptions(threeButtonNegativeCancel, ['1', '2', '3'], 0, -1, [0, 1, 2]);

			assertOptions(fourButtonNoCancel, ['1', '2', '3', '4'], 0, 3, [0, 1, 2, 3]);
			assertOptions(fourButtonCancel_0, ['2', '3', '4', '1'], 0, 3, [1, 2, 3, 0]);
			assertOptions(fourButtonCancel_1, ['1', '3', '4', '2'], 0, 3, [0, 2, 3, 1]);
			assertOptions(fourButtonCancel_2, ['1', '2', '4', '3'], 0, 3, [0, 1, 3, 2]);
			assertOptions(fourButtonCancel_3, ['1', '2', '3', '4'], 0, 3, [0, 1, 2, 3]);
			assertOptions(fourButtonCancel_4, ['1', '2', '3', '4'], 0, 4, [0, 1, 2, 3]);
			assertOptions(fourButtonNegativeCancel, ['1', '2', '3', '4'], 0, -1, [0, 1, 2, 3]);
		} else if (isMacintosh) {
			assertOptions(oneButtonNoCancel, ['1'], 0, 0, [0]);
			assertOptions(oneButtonCancel_0, ['1'], 0, 0, [0]);
			assertOptions(oneButtonCancel_1, ['1'], 0, 1, [0]);
			assertOptions(oneButtonNegativeCancel, ['1'], 0, -1, [0]);

			assertOptions(twoButtonNoCancel, ['1', '2'], 0, 1, [0, 1]);
			assertOptions(twoButtonCancel_0, ['2', '1'], 0, 1, [1, 0]);
			assertOptions(twoButtonCancel_1, ['1', '2'], 0, 1, [0, 1]);
			assertOptions(twoButtonCancel_2, ['1', '2'], 0, 2, [0, 1]);
			assertOptions(twoButtonNegativeCancel, ['1', '2'], 0, -1, [0, 1]);

			assertOptions(threeButtonNoCancel, ['1', '3', '2'], 0, 1, [0, 2, 1]);
			assertOptions(threeButtonCancel_0, ['2', '1', '3'], 0, 1, [1, 0, 2]);
			assertOptions(threeButtonCancel_1, ['1', '2', '3'], 0, 1, [0, 1, 2]);
			assertOptions(threeButtonCancel_2, ['1', '3', '2'], 0, 1, [0, 2, 1]);
			assertOptions(threeButtonCancel_3, ['1', '2', '3'], 0, 3, [0, 1, 2]);
			assertOptions(threeButtonNegativeCancel, ['1', '2', '3'], 0, -1, [0, 1, 2]);

			assertOptions(fourButtonNoCancel, ['1', '4', '2', '3'], 0, 1, [0, 3, 1, 2]);
			assertOptions(fourButtonCancel_0, ['2', '1', '3', '4'], 0, 1, [1, 0, 2, 3]);
			assertOptions(fourButtonCancel_1, ['1', '2', '3', '4'], 0, 1, [0, 1, 2, 3]);
			assertOptions(fourButtonCancel_2, ['1', '3', '2', '4'], 0, 1, [0, 2, 1, 3]);
			assertOptions(fourButtonCancel_3, ['1', '4', '2', '3'], 0, 1, [0, 3, 1, 2]);
			assertOptions(fourButtonCancel_4, ['1', '2', '3', '4'], 0, 4, [0, 1, 2, 3]);
			assertOptions(fourButtonNegativeCancel, ['1', '2', '3', '4'], 0, -1, [0, 1, 2, 3]);
		} else if (isLinux) {
			assertOptions(oneButtonNoCancel, ['1'], 0, 0, [0]);
			assertOptions(oneButtonCancel_0, ['1'], 0, 0, [0]);
			assertOptions(oneButtonCancel_1, ['1'], 0, 1, [0]);
			assertOptions(oneButtonNegativeCancel, ['1'], 0, -1, [0]);

			assertOptions(twoButtonNoCancel, ['2', '1'], 1, 0, [1, 0]);
			assertOptions(twoButtonCancel_0, ['1', '2'], 1, 0, [0, 1]);
			assertOptions(twoButtonCancel_1, ['2', '1'], 1, 0, [1, 0]);
			assertOptions(twoButtonCancel_2, ['2', '1'], 1, 2, [1, 0]);
			assertOptions(twoButtonNegativeCancel, ['2', '1'], 1, -1, [1, 0]);

			assertOptions(threeButtonNoCancel, ['2', '3', '1'], 2, 1, [1, 2, 0]);
			assertOptions(threeButtonCancel_0, ['3', '1', '2'], 2, 1, [2, 0, 1]);
			assertOptions(threeButtonCancel_1, ['3', '2', '1'], 2, 1, [2, 1, 0]);
			assertOptions(threeButtonCancel_2, ['2', '3', '1'], 2, 1, [1, 2, 0]);
			assertOptions(threeButtonCancel_3, ['3', '2', '1'], 2, 3, [2, 1, 0]);
			assertOptions(threeButtonNegativeCancel, ['3', '2', '1'], 2, -1, [2, 1, 0]);

			assertOptions(fourButtonNoCancel, ['3', '2', '4', '1'], 3, 2, [2, 1, 3, 0]);
			assertOptions(fourButtonCancel_0, ['4', '3', '1', '2'], 3, 2, [3, 2, 0, 1]);
			assertOptions(fourButtonCancel_1, ['4', '3', '2', '1'], 3, 2, [3, 2, 1, 0]);
			assertOptions(fourButtonCancel_2, ['4', '2', '3', '1'], 3, 2, [3, 1, 2, 0]);
			assertOptions(fourButtonCancel_3, ['3', '2', '4', '1'], 3, 2, [2, 1, 3, 0]);
			assertOptions(fourButtonCancel_4, ['4', '3', '2', '1'], 3, 4, [3, 2, 1, 0]);
			assertOptions(fourButtonNegativeCancel, ['4', '3', '2', '1'], 3, -1, [3, 2, 1, 0]);
		}
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/dialogs/test/common/testDialogService.ts]---
Location: vscode-main/src/vs/platform/dialogs/test/common/testDialogService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import Severity from '../../../../base/common/severity.js';
import { IConfirmation, IConfirmationResult, IDialogService, IInputResult, IPrompt, IPromptBaseButton, IPromptResult, IPromptResultWithCancel, IPromptWithCustomCancel, IPromptWithDefaultCancel } from '../../common/dialogs.js';

export class TestDialogService implements IDialogService {

	declare readonly _serviceBrand: undefined;

	readonly onWillShowDialog = Event.None;
	readonly onDidShowDialog = Event.None;

	constructor(
		private defaultConfirmResult: IConfirmationResult | undefined = undefined,
		private defaultPromptResult: IPromptResult<unknown> | undefined = undefined
	) { }

	private confirmResult: IConfirmationResult | undefined = undefined;
	setConfirmResult(result: IConfirmationResult) {
		this.confirmResult = result;
	}

	async confirm(confirmation: IConfirmation): Promise<IConfirmationResult> {
		if (this.confirmResult) {
			const confirmResult = this.confirmResult;
			this.confirmResult = undefined;

			return confirmResult;
		}

		return this.defaultConfirmResult ?? { confirmed: false };
	}

	prompt<T>(prompt: IPromptWithCustomCancel<T>): Promise<IPromptResultWithCancel<T>>;
	prompt<T>(prompt: IPromptWithDefaultCancel<T>): Promise<IPromptResult<T>>;
	prompt<T>(prompt: IPrompt<T>): Promise<IPromptResult<T>>;
	async prompt<T>(prompt: IPrompt<T> | IPromptWithCustomCancel<T>): Promise<IPromptResult<T> | IPromptResultWithCancel<T>> {
		if (this.defaultPromptResult) {
			return this.defaultPromptResult as IPromptResult<T>;
		}
		const promptButtons: IPromptBaseButton<T>[] = [...(prompt.buttons ?? [])];
		if (prompt.cancelButton && typeof prompt.cancelButton !== 'string' && typeof prompt.cancelButton !== 'boolean') {
			promptButtons.push(prompt.cancelButton);
		}

		return { result: await promptButtons[0]?.run({ checkboxChecked: false }) };
	}
	async info(message: string, detail?: string): Promise<void> {
		await this.prompt({ type: Severity.Info, message, detail });
	}

	async warn(message: string, detail?: string): Promise<void> {
		await this.prompt({ type: Severity.Warning, message, detail });
	}

	async error(message: string, detail?: string): Promise<void> {
		await this.prompt({ type: Severity.Error, message, detail });
	}
	async input(): Promise<IInputResult> { { return { confirmed: true, values: [] }; } }
	async about(): Promise<void> { }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/dnd/browser/dnd.ts]---
Location: vscode-main/src/vs/platform/dnd/browser/dnd.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DataTransfers } from '../../../base/browser/dnd.js';
import { mainWindow } from '../../../base/browser/window.js';
import { DragMouseEvent } from '../../../base/browser/mouseEvent.js';
import { coalesce } from '../../../base/common/arrays.js';
import { DeferredPromise } from '../../../base/common/async.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { ResourceMap } from '../../../base/common/map.js';
import { parse } from '../../../base/common/marshalling.js';
import { Schemas } from '../../../base/common/network.js';
import { isNative, isWeb } from '../../../base/common/platform.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { IDialogService } from '../../dialogs/common/dialogs.js';
import { IBaseTextResourceEditorInput, ITextEditorSelection } from '../../editor/common/editor.js';
import { HTMLFileSystemProvider } from '../../files/browser/htmlFileSystemProvider.js';
import { WebFileSystemAccess } from '../../files/browser/webFileSystemAccess.js';
import { ByteSize, IFileService } from '../../files/common/files.js';
import { IInstantiationService, ServicesAccessor } from '../../instantiation/common/instantiation.js';
import { extractSelection } from '../../opener/common/opener.js';
import { Registry } from '../../registry/common/platform.js';
import { IMarker } from '../../markers/common/markers.js';


//#region Editor / Resources DND

export const CodeDataTransfers = {
	EDITORS: 'CodeEditors',
	FILES: 'CodeFiles',
	SYMBOLS: 'application/vnd.code.symbols',
	MARKERS: 'application/vnd.code.diagnostics',
	NOTEBOOK_CELL_OUTPUT: 'notebook-cell-output',
	SCM_HISTORY_ITEM: 'scm-history-item',
};

export interface IDraggedResourceEditorInput extends IBaseTextResourceEditorInput {
	resource: URI | undefined;

	/**
	 * A hint that the source of the dragged editor input
	 * might not be the application but some external tool.
	 */
	isExternal?: boolean;

	/**
	 * Whether we probe for the dropped editor to be a workspace
	 * (i.e. code-workspace file or even a folder), allowing to
	 * open it as workspace instead of opening as editor.
	 */
	allowWorkspaceOpen?: boolean;
}

export function extractEditorsDropData(e: DragEvent): Array<IDraggedResourceEditorInput> {
	const editors: IDraggedResourceEditorInput[] = [];
	if (e.dataTransfer && e.dataTransfer.types.length > 0) {

		// Data Transfer: Code Editors
		const rawEditorsData = e.dataTransfer.getData(CodeDataTransfers.EDITORS);
		if (rawEditorsData) {
			try {
				editors.push(...parse(rawEditorsData));
			} catch (error) {
				// Invalid transfer
			}
		}

		// Data Transfer: Resources
		else {
			try {
				const rawResourcesData = e.dataTransfer.getData(DataTransfers.RESOURCES);
				editors.push(...createDraggedEditorInputFromRawResourcesData(rawResourcesData));
			} catch (error) {
				// Invalid transfer
			}
		}

		// Check for native file transfer
		if (e.dataTransfer?.files) {
			for (let i = 0; i < e.dataTransfer.files.length; i++) {
				const file = e.dataTransfer.files[i];
				if (file && getPathForFile(file)) {
					try {
						editors.push({ resource: URI.file(getPathForFile(file)!), isExternal: true, allowWorkspaceOpen: true });
					} catch (error) {
						// Invalid URI
					}
				}
			}
		}

		// Check for CodeFiles transfer
		const rawCodeFiles = e.dataTransfer.getData(CodeDataTransfers.FILES);
		if (rawCodeFiles) {
			try {
				const codeFiles: string[] = JSON.parse(rawCodeFiles);
				for (const codeFile of codeFiles) {
					editors.push({ resource: URI.file(codeFile), isExternal: true, allowWorkspaceOpen: true });
				}
			} catch (error) {
				// Invalid transfer
			}
		}

		// Workbench contributions
		const contributions = Registry.as<IDragAndDropContributionRegistry>(Extensions.DragAndDropContribution).getAll();
		for (const contribution of contributions) {
			const data = e.dataTransfer.getData(contribution.dataFormatKey);
			if (data) {
				try {
					editors.push(...contribution.getEditorInputs(data));
				} catch (error) {
					// Invalid transfer
				}
			}
		}
	}

	// Prevent duplicates: it is possible that we end up with the same
	// dragged editor multiple times because multiple data transfers
	// are being used (https://github.com/microsoft/vscode/issues/128925)

	const coalescedEditors: IDraggedResourceEditorInput[] = [];
	const seen = new ResourceMap<boolean>();
	for (const editor of editors) {
		if (!editor.resource) {
			coalescedEditors.push(editor);
		} else if (!seen.has(editor.resource)) {
			coalescedEditors.push(editor);
			seen.set(editor.resource, true);
		}
	}

	return coalescedEditors;
}

export async function extractEditorsAndFilesDropData(accessor: ServicesAccessor, e: DragEvent): Promise<Array<IDraggedResourceEditorInput>> {
	const editors = extractEditorsDropData(e);

	// Web: Check for file transfer
	if (e.dataTransfer && isWeb && containsDragType(e, DataTransfers.FILES)) {
		const files = e.dataTransfer.items;
		if (files) {
			const instantiationService = accessor.get(IInstantiationService);
			const filesData = await instantiationService.invokeFunction(accessor => extractFilesDropData(accessor, e));
			for (const fileData of filesData) {
				editors.push({ resource: fileData.resource, contents: fileData.contents?.toString(), isExternal: true, allowWorkspaceOpen: fileData.isDirectory });
			}
		}
	}

	return editors;
}

export function createDraggedEditorInputFromRawResourcesData(rawResourcesData: string | undefined): IDraggedResourceEditorInput[] {
	const editors: IDraggedResourceEditorInput[] = [];

	if (rawResourcesData) {
		const resourcesRaw: string[] = JSON.parse(rawResourcesData);
		for (const resourceRaw of resourcesRaw) {
			if (resourceRaw.indexOf(':') > 0) { // mitigate https://github.com/microsoft/vscode/issues/124946
				const { selection, uri } = extractSelection(URI.parse(resourceRaw));
				editors.push({ resource: uri, options: { selection } });
			}
		}
	}

	return editors;
}


interface IFileTransferData {
	resource: URI;
	isDirectory?: boolean;
	contents?: VSBuffer;
}

async function extractFilesDropData(accessor: ServicesAccessor, event: DragEvent): Promise<IFileTransferData[]> {

	// Try to extract via `FileSystemHandle`
	if (WebFileSystemAccess.supported(mainWindow)) {
		const items = event.dataTransfer?.items;
		if (items) {
			return extractFileTransferData(accessor, items);
		}
	}

	// Try to extract via `FileList`
	const files = event.dataTransfer?.files;
	if (!files) {
		return [];
	}

	return extractFileListData(accessor, files);
}

async function extractFileTransferData(accessor: ServicesAccessor, items: DataTransferItemList): Promise<IFileTransferData[]> {
	const fileSystemProvider = accessor.get(IFileService).getProvider(Schemas.file);
	// eslint-disable-next-line no-restricted-syntax
	if (!(fileSystemProvider instanceof HTMLFileSystemProvider)) {
		return []; // only supported when running in web
	}

	const results: DeferredPromise<IFileTransferData | undefined>[] = [];

	for (let i = 0; i < items.length; i++) {
		const file = items[i];
		if (file) {
			const result = new DeferredPromise<IFileTransferData | undefined>();
			results.push(result);

			(async () => {
				try {
					const handle = await file.getAsFileSystemHandle();
					if (!handle) {
						result.complete(undefined);
						return;
					}

					if (WebFileSystemAccess.isFileSystemFileHandle(handle)) {
						result.complete({
							resource: await fileSystemProvider.registerFileHandle(handle),
							isDirectory: false
						});
					} else if (WebFileSystemAccess.isFileSystemDirectoryHandle(handle)) {
						result.complete({
							resource: await fileSystemProvider.registerDirectoryHandle(handle),
							isDirectory: true
						});
					} else {
						result.complete(undefined);
					}
				} catch (error) {
					result.complete(undefined);
				}
			})();
		}
	}

	return coalesce(await Promise.all(results.map(result => result.p)));
}

export async function extractFileListData(accessor: ServicesAccessor, files: FileList): Promise<IFileTransferData[]> {
	const dialogService = accessor.get(IDialogService);

	const results: DeferredPromise<IFileTransferData | undefined>[] = [];

	for (let i = 0; i < files.length; i++) {
		const file = files.item(i);
		if (file) {

			// Skip for very large files because this operation is unbuffered
			if (file.size > 100 * ByteSize.MB) {
				dialogService.warn(localize('fileTooLarge', "File is too large to open as untitled editor. Please upload it first into the file explorer and then try again."));
				continue;
			}

			const result = new DeferredPromise<IFileTransferData | undefined>();
			results.push(result);

			const reader = new FileReader();

			reader.onerror = () => result.complete(undefined);
			reader.onabort = () => result.complete(undefined);

			reader.onload = async event => {
				const name = file.name;
				const loadResult = event.target?.result ?? undefined;
				if (typeof name !== 'string' || typeof loadResult === 'undefined') {
					result.complete(undefined);
					return;
				}

				result.complete({
					resource: URI.from({ scheme: Schemas.untitled, path: name }),
					contents: typeof loadResult === 'string' ? VSBuffer.fromString(loadResult) : VSBuffer.wrap(new Uint8Array(loadResult))
				});
			};

			// Start reading
			reader.readAsArrayBuffer(file);
		}
	}

	return coalesce(await Promise.all(results.map(result => result.p)));
}

//#endregion

export function containsDragType(event: DragEvent, ...dragTypesToFind: string[]): boolean {
	if (!event.dataTransfer) {
		return false;
	}

	const dragTypes = event.dataTransfer.types;
	const lowercaseDragTypes: string[] = [];
	for (let i = 0; i < dragTypes.length; i++) {
		lowercaseDragTypes.push(dragTypes[i].toLowerCase()); // somehow the types are lowercase
	}

	for (const dragType of dragTypesToFind) {
		if (lowercaseDragTypes.indexOf(dragType.toLowerCase()) >= 0) {
			return true;
		}
	}

	return false;
}

//#region DND contributions

export interface IResourceStat {
	readonly resource: URI;
	readonly isDirectory?: boolean;
	readonly selection?: ITextEditorSelection;
}

export interface IDragAndDropContributionRegistry {
	/**
	 * Registers a drag and drop contribution.
	 */
	register(contribution: IDragAndDropContribution): void;

	/**
	 * Returns all registered drag and drop contributions.
	 */
	getAll(): IterableIterator<IDragAndDropContribution>;
}

interface IDragAndDropContribution {
	readonly dataFormatKey: string;
	getEditorInputs(data: string): IDraggedResourceEditorInput[];
	setData(resources: IResourceStat[], event: DragMouseEvent | DragEvent): void;
}

class DragAndDropContributionRegistry implements IDragAndDropContributionRegistry {
	private readonly _contributions = new Map<string, IDragAndDropContribution>();

	register(contribution: IDragAndDropContribution): void {
		if (this._contributions.has(contribution.dataFormatKey)) {
			throw new Error(`A drag and drop contributiont with key '${contribution.dataFormatKey}' was already registered.`);
		}
		this._contributions.set(contribution.dataFormatKey, contribution);
	}

	getAll(): IterableIterator<IDragAndDropContribution> {
		return this._contributions.values();
	}
}

export const Extensions = {
	DragAndDropContribution: 'workbench.contributions.dragAndDrop'
};

Registry.add(Extensions.DragAndDropContribution, new DragAndDropContributionRegistry());

//#endregion

//#region DND Utilities

/**
 * A singleton to store transfer data during drag & drop operations that are only valid within the application.
 */
export class LocalSelectionTransfer<T> {

	private static readonly INSTANCE = new LocalSelectionTransfer();

	private data?: T[];
	private proto?: T;

	private constructor() {
		// protect against external instantiation
	}

	static getInstance<T>(): LocalSelectionTransfer<T> {
		return LocalSelectionTransfer.INSTANCE as LocalSelectionTransfer<T>;
	}

	hasData(proto: T): boolean {
		return proto && proto === this.proto;
	}

	clearData(proto: T): void {
		if (this.hasData(proto)) {
			this.proto = undefined;
			this.data = undefined;
		}
	}

	getData(proto: T): T[] | undefined {
		if (this.hasData(proto)) {
			return this.data;
		}

		return undefined;
	}

	setData(data: T[], proto: T): void {
		if (proto) {
			this.data = data;
			this.proto = proto;
		}
	}
}

export interface DocumentSymbolTransferData {
	name: string;
	fsPath: string;
	range: {
		startLineNumber: number;
		startColumn: number;
		endLineNumber: number;
		endColumn: number;
	};
	kind: number;
}

export interface NotebookCellOutputTransferData {
	outputId: string;
}

function setDataAsJSON(e: DragEvent, kind: string, data: unknown) {
	e.dataTransfer?.setData(kind, JSON.stringify(data));
}

function getDataAsJSON<T>(e: DragEvent, kind: string, defaultValue: T): T {
	const rawSymbolsData = e.dataTransfer?.getData(kind);
	if (rawSymbolsData) {
		try {
			return JSON.parse(rawSymbolsData);
		} catch (error) {
			// Invalid transfer
		}
	}

	return defaultValue;
}

export function extractSymbolDropData(e: DragEvent): DocumentSymbolTransferData[] {
	return getDataAsJSON(e, CodeDataTransfers.SYMBOLS, []);
}

export function fillInSymbolsDragData(symbolsData: readonly DocumentSymbolTransferData[], e: DragEvent): void {
	setDataAsJSON(e, CodeDataTransfers.SYMBOLS, symbolsData);
}

export type MarkerTransferData = IMarker | { uri: UriComponents };

export function extractMarkerDropData(e: DragEvent): MarkerTransferData[] | undefined {
	return getDataAsJSON(e, CodeDataTransfers.MARKERS, undefined);
}

export function fillInMarkersDragData(markerData: MarkerTransferData[], e: DragEvent): void {
	setDataAsJSON(e, CodeDataTransfers.MARKERS, markerData);
}

export function extractNotebookCellOutputDropData(e: DragEvent): NotebookCellOutputTransferData | undefined {
	return getDataAsJSON(e, CodeDataTransfers.NOTEBOOK_CELL_OUTPUT, undefined);
}

interface IElectronWebUtils {
	vscode?: {
		webUtils?: {
			getPathForFile(file: File): string;
		};
	};
}

/**
 * A helper to get access to Electrons `webUtils.getPathForFile` function
 * in a safe way without crashing the application when running in the web.
 */
export function getPathForFile(file: File): string | undefined {
	if (isNative && typeof (globalThis as IElectronWebUtils).vscode?.webUtils?.getPathForFile === 'function') {
		return (globalThis as IElectronWebUtils).vscode?.webUtils?.getPathForFile(file);
	}

	return undefined;
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/domWidget/browser/domWidget.ts]---
Location: vscode-main/src/vs/platform/domWidget/browser/domWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isHotReloadEnabled } from '../../../base/common/hotReload.js';
import { Disposable, DisposableStore, toDisposable } from '../../../base/common/lifecycle.js';
import { ISettableObservable, IObservable, autorun, constObservable, derived, observableValue } from '../../../base/common/observable.js';
import { IInstantiationService, GetLeadingNonServiceArgs } from '../../instantiation/common/instantiation.js';

/**
 * The DomWidget class provides a standard to define reusable UI components.
 * It is disposable and defines a single root element of type HTMLElement.
 * It also provides static helper methods to create and append widgets to the DOM,
 * with support for hot module replacement during development.
*/
export abstract class DomWidget extends Disposable {
	/**
	 * Appends the widget to the provided DOM element.
	*/
	public static createAppend<TArgs extends unknown[], T extends DomWidget>(this: DomWidgetCtor<TArgs, T>, dom: HTMLElement, store: DisposableStore, ...params: TArgs): void {
		if (!isHotReloadEnabled()) {
			const widget = new this(...params);
			dom.appendChild(widget.element);
			store.add(widget);
			return;
		}

		const observable = this.createObservable(store, ...params);
		store.add(autorun((reader) => {
			const widget = observable.read(reader);
			dom.appendChild(widget.element);
			reader.store.add(toDisposable(() => widget.element.remove()));
			reader.store.add(widget);
		}));
	}

	/**
	 * Creates the widget in a new div element with "display: contents".
	*/
	public static createInContents<TArgs extends unknown[], T extends DomWidget>(this: DomWidgetCtor<TArgs, T>, store: DisposableStore, ...params: TArgs): HTMLDivElement {
		const div = document.createElement('div');
		div.style.display = 'contents';
		this.createAppend(div, store, ...params);
		return div;
	}

	/**
	 * Creates an observable instance of the widget.
	 * The observable will change when hot module replacement occurs.
	*/
	public static createObservable<TArgs extends unknown[], T extends DomWidget>(this: DomWidgetCtor<TArgs, T>, store: DisposableStore, ...params: TArgs): IObservable<T> {
		if (!isHotReloadEnabled()) {
			return constObservable(new this(...params));
		}

		const id = (this as unknown as HotReloadable)[_hotReloadId];
		const observable = id ? hotReloadedWidgets.get(id) : undefined;

		if (!observable) {
			return constObservable(new this(...params));
		}

		return derived(reader => {
			const Ctor = observable.read(reader);
			return new Ctor(...params) as T;
		});
	}

	/**
	 * Appends the widget to the provided DOM element.
	*/
	public static instantiateAppend<TArgs extends unknown[], T extends DomWidget>(this: DomWidgetCtor<TArgs, T>, instantiationService: IInstantiationService, dom: HTMLElement, store: DisposableStore, ...params: GetLeadingNonServiceArgs<TArgs>): void {
		if (!isHotReloadEnabled()) {
			const widget = instantiationService.createInstance(this as unknown as new (...args: unknown[]) => T, ...params);
			dom.appendChild(widget.element);
			store.add(widget);
			return;
		}

		const observable = this.instantiateObservable(instantiationService, store, ...params);
		let lastWidget: DomWidget | undefined = undefined;
		store.add(autorun((reader) => {
			const widget = observable.read(reader);
			if (lastWidget) {
				lastWidget.element.replaceWith(widget.element);
			} else {
				dom.appendChild(widget.element);
			}
			lastWidget = widget;

			reader.delayedStore.add(widget);
		}));
	}

	/**
	 * Creates the widget in a new div element with "display: contents".
	 * If possible, prefer `instantiateAppend`, as it avoids an extra div in the DOM.
	*/
	public static instantiateInContents<TArgs extends unknown[], T extends DomWidget>(this: DomWidgetCtor<TArgs, T>, instantiationService: IInstantiationService, store: DisposableStore, ...params: GetLeadingNonServiceArgs<TArgs>): HTMLDivElement {
		const div = document.createElement('div');
		div.style.display = 'contents';
		this.instantiateAppend(instantiationService, div, store, ...params);
		return div;
	}

	/**
	 * Creates an observable instance of the widget.
	 * The observable will change when hot module replacement occurs.
	*/
	public static instantiateObservable<TArgs extends unknown[], T extends DomWidget>(this: DomWidgetCtor<TArgs, T>, instantiationService: IInstantiationService, store: DisposableStore, ...params: GetLeadingNonServiceArgs<TArgs>): IObservable<T> {
		if (!isHotReloadEnabled()) {
			return constObservable(instantiationService.createInstance(this as unknown as new (...args: unknown[]) => T, ...params));
		}

		const id = (this as unknown as HotReloadable)[_hotReloadId];
		const observable = id ? hotReloadedWidgets.get(id) : undefined;

		if (!observable) {
			return constObservable(instantiationService.createInstance(this as unknown as new (...args: unknown[]) => T, ...params));
		}

		return derived(reader => {
			const Ctor = observable.read(reader);
			return instantiationService.createInstance(Ctor, ...params) as T;
		});
	}

	/**
	 * @deprecated Do not call manually! Only for use by the hot reload system (a vite plugin will inject calls to this method in dev mode).
	*/
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public static registerWidgetHotReplacement(this: new (...args: any[]) => DomWidget, id: string): void {
		if (!isHotReloadEnabled()) {
			return;
		}
		let observable = hotReloadedWidgets.get(id);
		if (!observable) {
			observable = observableValue(id, this);
			hotReloadedWidgets.set(id, observable);
		} else {
			observable.set(this, undefined);
		}
		(this as unknown as HotReloadable)[_hotReloadId] = id;
	}

	/** Always returns the same element. */
	abstract get element(): HTMLElement;
}

const _hotReloadId = Symbol('DomWidgetHotReloadId');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hotReloadedWidgets = new Map<string, ISettableObservable<new (...args: any[]) => DomWidget>>();

interface HotReloadable {
	[_hotReloadId]?: string;
}

type DomWidgetCtor<TArgs extends unknown[], T extends DomWidget> = {
	new(...args: TArgs): T;

	createObservable(store: DisposableStore, ...params: TArgs): IObservable<T>;
	instantiateObservable(instantiationService: IInstantiationService, store: DisposableStore, ...params: GetLeadingNonServiceArgs<TArgs>): IObservable<T>;
	createAppend(dom: HTMLElement, store: DisposableStore, ...params: TArgs): void;
	instantiateAppend(instantiationService: IInstantiationService, dom: HTMLElement, store: DisposableStore, ...params: GetLeadingNonServiceArgs<TArgs>): void;
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/download/common/download.ts]---
Location: vscode-main/src/vs/platform/download/common/download.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IDownloadService = createDecorator<IDownloadService>('downloadService');

export interface IDownloadService {

	readonly _serviceBrand: undefined;

	download(uri: URI, to: URI, cancellationToken?: CancellationToken): Promise<void>;

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/download/common/downloadIpc.ts]---
Location: vscode-main/src/vs/platform/download/common/downloadIpc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { URI } from '../../../base/common/uri.js';
import { IURITransformer } from '../../../base/common/uriIpc.js';
import { IChannel, IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { IDownloadService } from './download.js';

export class DownloadServiceChannel implements IServerChannel {

	constructor(private readonly service: IDownloadService) { }

	listen(_: unknown, event: string, arg?: any): Event<any> {
		throw new Error('Invalid listen');
	}

	call(context: any, command: string, args?: any): Promise<any> {
		switch (command) {
			case 'download': return this.service.download(URI.revive(args[0]), URI.revive(args[1]));
		}
		throw new Error('Invalid call');
	}
}

export class DownloadServiceChannelClient implements IDownloadService {

	declare readonly _serviceBrand: undefined;

	constructor(private channel: IChannel, private getUriTransformer: () => IURITransformer | null) { }

	async download(from: URI, to: URI): Promise<void> {
		const uriTransformer = this.getUriTransformer();
		if (uriTransformer) {
			from = uriTransformer.transformOutgoingURI(from);
			to = uriTransformer.transformOutgoingURI(to);
		}
		await this.channel.call('download', [from, to]);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/download/common/downloadService.ts]---
Location: vscode-main/src/vs/platform/download/common/downloadService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Schemas } from '../../../base/common/network.js';
import { URI } from '../../../base/common/uri.js';
import { IDownloadService } from './download.js';
import { IFileService } from '../../files/common/files.js';
import { asTextOrError, IRequestService } from '../../request/common/request.js';

export class DownloadService implements IDownloadService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@IRequestService private readonly requestService: IRequestService,
		@IFileService private readonly fileService: IFileService
	) { }

	async download(resource: URI, target: URI, cancellationToken: CancellationToken = CancellationToken.None): Promise<void> {
		if (resource.scheme === Schemas.file || resource.scheme === Schemas.vscodeRemote) {
			// Intentionally only support this for file|remote<->file|remote scenarios
			await this.fileService.copy(resource, target);
			return;
		}
		const options = { type: 'GET', url: resource.toString(true) };
		const context = await this.requestService.request(options, cancellationToken);
		if (context.res.statusCode === 200) {
			await this.fileService.writeFile(target, context.stream);
		} else {
			const message = await asTextOrError(context);
			throw new Error(`Expected 200, got back ${context.res.statusCode} instead.\n\n${message}`);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/editor/browser/editor.ts]---
Location: vscode-main/src/vs/platform/editor/browser/editor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { addDisposableListener, EventHelper, EventType, getWindow } from '../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../base/browser/keyboardEvent.js';
import { StandardMouseEvent } from '../../../base/browser/mouseEvent.js';
import { KeyCode, KeyMod } from '../../../base/common/keyCodes.js';
import { DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { isMacintosh } from '../../../base/common/platform.js';
import { IEditorOptions } from '../common/editor.js';

//#region Editor Open Event Listeners

export interface IOpenEditorOptions {
	readonly editorOptions: IEditorOptions;
	readonly openToSide: boolean;
}

export function registerOpenEditorListeners(element: HTMLElement, onOpenEditor: (options: IOpenEditorOptions) => void): IDisposable {
	const disposables = new DisposableStore();

	disposables.add(addDisposableListener(element, EventType.CLICK, e => {
		if (e.detail === 2) {
			return; // ignore double click as it is handled below
		}

		EventHelper.stop(e, true);
		onOpenEditor(toOpenEditorOptions(new StandardMouseEvent(getWindow(element), e)));
	}));

	disposables.add(addDisposableListener(element, EventType.DBLCLICK, e => {
		EventHelper.stop(e, true);

		onOpenEditor(toOpenEditorOptions(new StandardMouseEvent(getWindow(element), e), true));
	}));

	disposables.add(addDisposableListener(element, EventType.KEY_DOWN, e => {
		const options = toOpenEditorOptions(new StandardKeyboardEvent(e));
		if (!options) {
			return;
		}

		EventHelper.stop(e, true);
		onOpenEditor(options);
	}));

	return disposables;
}

export function toOpenEditorOptions(event: StandardMouseEvent, isDoubleClick?: boolean): IOpenEditorOptions;
export function toOpenEditorOptions(event: StandardKeyboardEvent): IOpenEditorOptions | undefined;
export function toOpenEditorOptions(event: StandardMouseEvent | StandardKeyboardEvent): IOpenEditorOptions | undefined;
export function toOpenEditorOptions(event: StandardMouseEvent | StandardKeyboardEvent, isDoubleClick?: boolean): IOpenEditorOptions | undefined {
	if (event instanceof StandardKeyboardEvent) {
		let preserveFocus: boolean | undefined = undefined;
		if (event.equals(KeyCode.Enter) || (isMacintosh && event.equals(KeyMod.CtrlCmd | KeyCode.DownArrow))) {
			preserveFocus = false;
		} else if (event.equals(KeyCode.Space)) {
			preserveFocus = true;
		}

		if (typeof preserveFocus === 'undefined') {
			return;
		}

		return { editorOptions: { preserveFocus, pinned: !preserveFocus }, openToSide: false };
	} else {
		return { editorOptions: { preserveFocus: !isDoubleClick, pinned: isDoubleClick || event.middleButton }, openToSide: event.ctrlKey || event.metaKey || event.altKey };
	}
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/editor/common/editor.ts]---
Location: vscode-main/src/vs/platform/editor/common/editor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { equals } from '../../../base/common/arrays.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { IRectangle } from '../../window/common/window.js';

export interface IResolvableEditorModel extends IDisposable {

	/**
	 * Resolves the model.
	 */
	resolve(): Promise<void>;

	/**
	 * Find out if the editor model was resolved or not.
	 */
	isResolved(): boolean;
}

export function isResolvedEditorModel(model: IDisposable | undefined | null): model is IResolvableEditorModel {
	const candidate = model as IResolvableEditorModel | undefined | null;

	return typeof candidate?.resolve === 'function'
		&& typeof candidate?.isResolved === 'function';
}

export interface IBaseUntypedEditorInput {

	/**
	 * Optional options to use when opening the input.
	 */
	options?: IEditorOptions;

	/**
	 * Label to show for the input.
	 */
	readonly label?: string;

	/**
	 * Description to show for the input.
	 */
	readonly description?: string;
}

export interface IBaseResourceEditorInput extends IBaseUntypedEditorInput {

	/**
	 * Hint to indicate that this input should be treated as a
	 * untitled file.
	 *
	 * Without this hint, the editor service will make a guess by
	 * looking at the scheme of the resource(s).
	 *
	 * Use `forceUntitled: true` when you pass in a `resource` that
	 * does not use the `untitled` scheme. The `resource` will then
	 * be used as associated path when saving the untitled file.
	 */
	readonly forceUntitled?: boolean;
}

export interface IBaseTextResourceEditorInput extends IBaseResourceEditorInput {

	/**
	 * Optional options to use when opening the text input.
	 */
	options?: ITextEditorOptions;

	/**
	 * The contents of the text input if known. If provided,
	 * the input will not attempt to load the contents from
	 * disk and may appear dirty.
	 */
	contents?: string;

	/**
	 * The encoding of the text input if known.
	 */
	encoding?: string;

	/**
	 * The identifier of the language id of the text input
	 * if known to use when displaying the contents.
	 */
	languageId?: string;
}

export interface IResourceEditorInput extends IBaseResourceEditorInput {

	/**
	 * The resource URI of the resource to open.
	 */
	readonly resource: URI;
}

export interface ITextResourceEditorInput extends IResourceEditorInput, IBaseTextResourceEditorInput {

	/**
	 * Optional options to use when opening the text input.
	 */
	options?: ITextEditorOptions;
}

/**
 * This identifier allows to uniquely identify an editor with a
 * resource, type and editor identifier.
 */
export interface IResourceEditorInputIdentifier {

	/**
	 * The type of the editor.
	 */
	readonly typeId: string;

	/**
	 * The identifier of the editor if provided.
	 */
	readonly editorId: string | undefined;

	/**
	 * The resource URI of the editor.
	 */
	readonly resource: URI;
}

export enum EditorActivation {

	/**
	 * Activate the editor after it opened. This will automatically restore
	 * the editor if it is minimized.
	 */
	ACTIVATE = 1,

	/**
	 * Only restore the editor if it is minimized but do not activate it.
	 *
	 * Note: will only work in combination with the `preserveFocus: true` option.
	 * Otherwise, if focus moves into the editor, it will activate and restore
	 * automatically.
	 */
	RESTORE,

	/**
	 * Preserve the current active editor.
	 *
	 * Note: will only work in combination with the `preserveFocus: true` option.
	 * Otherwise, if focus moves into the editor, it will activate and restore
	 * automatically.
	 */
	PRESERVE
}

export enum EditorResolution {

	/**
	 * Displays a picker and allows the user to decide which editor to use.
	 */
	PICK,

	/**
	 * Only exclusive editors are considered.
	 */
	EXCLUSIVE_ONLY
}

export enum EditorOpenSource {

	/**
	 * Default: the editor is opening via a programmatic call
	 * to the editor service API.
	 */
	API,

	/**
	 * Indicates that a user action triggered the opening, e.g.
	 * via mouse or keyboard use.
	 */
	USER
}

export interface IEditorOptions {

	/**
	 * Tells the editor to not receive keyboard focus when the editor is being opened.
	 *
	 * Will also not activate the group the editor opens in unless the group is already
	 * the active one. This behaviour can be overridden via the `activation` option.
	 */
	preserveFocus?: boolean;

	/**
	 * This option is only relevant if an editor is opened into a group that is not active
	 * already and allows to control if the inactive group should become active, restored
	 * or preserved.
	 *
	 * By default, the editor group will become active unless `preserveFocus` or `inactive`
	 * is specified.
	 */
	activation?: EditorActivation;

	/**
	 * Tells the editor to reload the editor input in the editor even if it is identical to the one
	 * already showing. By default, the editor will not reload the input if it is identical to the
	 * one showing.
	 */
	forceReload?: boolean;

	/**
	 * Will reveal the editor if it is already opened and visible in any of the opened editor groups.
	 *
	 * Note that this option is just a hint that might be ignored if the user wants to open an editor explicitly
	 * to the side of another one or into a specific editor group.
	 */
	revealIfVisible?: boolean;

	/**
	 * Will reveal the editor if it is already opened (even when not visible) in any of the opened editor groups.
	 *
	 * Note that this option is just a hint that might be ignored if the user wants to open an editor explicitly
	 * to the side of another one or into a specific editor group.
	 */
	revealIfOpened?: boolean;

	/**
	 * An editor that is pinned remains in the editor stack even when another editor is being opened.
	 * An editor that is not pinned will always get replaced by another editor that is not pinned.
	 */
	pinned?: boolean;

	/**
	 * An editor that is sticky moves to the beginning of the editors list within the group and will remain
	 * there unless explicitly closed. Operations such as "Close All" will not close sticky editors.
	 */
	sticky?: boolean;

	/**
	 * The index in the document stack where to insert the editor into when opening.
	 */
	index?: number;

	/**
	 * An active editor that is opened will show its contents directly. Set to true to open an editor
	 * in the background without loading its contents.
	 *
	 * Will also not activate the group the editor opens in unless the group is already
	 * the active one. This behaviour can be overridden via the `activation` option.
	 */
	inactive?: boolean;

	/**
	 * In case of an error opening the editor, will not present this error to the user (e.g. by showing
	 * a generic placeholder in the editor area). So it is up to the caller to provide error information
	 * in that case.
	 *
	 * By default, an error when opening an editor will result in a placeholder editor that shows the error.
	 * In certain cases a modal dialog may be presented to ask the user for further action.
	 */
	ignoreError?: boolean;

	/**
	 * Allows to override the editor that should be used to display the input:
	 * - `undefined`: let the editor decide for itself
	 * - `string`: specific override by id
	 * - `EditorResolution`: specific override handling
	 */
	override?: string | EditorResolution;

	/**
	 * A optional hint to signal in which context the editor opens.
	 *
	 * If configured to be `EditorOpenSource.USER`, this hint can be
	 * used in various places to control the experience. For example,
	 * if the editor to open fails with an error, a notification could
	 * inform about this in a modal dialog. If the editor opened through
	 * some background task, the notification would show in the background,
	 * not as a modal dialog.
	 */
	source?: EditorOpenSource;

	/**
	 * An optional property to signal that certain view state should be
	 * applied when opening the editor.
	 */
	viewState?: object;

	/**
	 * A transient editor will attempt to appear as preview and certain components
	 * (such as history tracking) may decide to ignore the editor when it becomes
	 * active.
	 * This option is meant to be used only when the editor is used for a short
	 * period of time, for example when opening a preview of the editor from a
	 * picker control in the background while navigating through results of the picker.
	 *
	 * Note: an editor that is already opened in a group that is not transient, will
	 * not turn transient.
	 */
	transient?: boolean;

	/**
	 * Options that only apply when `AUX_WINDOW_GROUP` is used for opening.
	 */
	auxiliary?: {

		/**
		 * Define the bounds of the editor window.
		 */
		bounds?: Partial<IRectangle>;

		/**
		 * Show editor compact, hiding unnecessary elements.
		 */
		compact?: boolean;

		/**
		 * Show the editor always on top of other windows.
		 */
		alwaysOnTop?: boolean;
	};
}

export interface ITextEditorSelection {
	readonly startLineNumber: number;
	readonly startColumn: number;
	readonly endLineNumber?: number;
	readonly endColumn?: number;
}

export const enum TextEditorSelectionRevealType {
	/**
	 * Option to scroll vertically or horizontally as necessary and reveal a range centered vertically.
	 */
	Center = 0,

	/**
	 * Option to scroll vertically or horizontally as necessary and reveal a range centered vertically only if it lies outside the viewport.
	 */
	CenterIfOutsideViewport = 1,

	/**
	 * Option to scroll vertically or horizontally as necessary and reveal a range close to the top of the viewport, but not quite at the top.
	 */
	NearTop = 2,

	/**
	 * Option to scroll vertically or horizontally as necessary and reveal a range close to the top of the viewport, but not quite at the top.
	 * Only if it lies outside the viewport
	 */
	NearTopIfOutsideViewport = 3,
}

export const enum TextEditorSelectionSource {

	/**
	 * Programmatic source indicates a selection change that
	 * was not triggered by the user via keyboard or mouse
	 * but through text editor APIs.
	 */
	PROGRAMMATIC = 'api',

	/**
	 * Navigation source indicates a selection change that
	 * was caused via some command or UI component such as
	 * an outline tree.
	 */
	NAVIGATION = 'code.navigation',

	/**
	 * Jump source indicates a selection change that
	 * was caused from within the text editor to another
	 * location in the same or different text editor such
	 * as "Go to definition".
	 */
	JUMP = 'code.jump'
}

export interface ITextEditorOptions extends IEditorOptions {

	/**
	 * Text editor selection.
	 */
	selection?: ITextEditorSelection;

	/**
	 * Option to control the text editor selection reveal type.
	 * Defaults to TextEditorSelectionRevealType.Center
	 */
	selectionRevealType?: TextEditorSelectionRevealType;

	/**
	 * Source of the call that caused the selection.
	 */
	selectionSource?: TextEditorSelectionSource | string;
}

export type ITextEditorChange = [
	originalStartLineNumber: number,
	originalEndLineNumberExclusive: number,
	modifiedStartLineNumber: number,
	modifiedEndLineNumberExclusive: number
];

export interface ITextEditorDiffInformation {
	readonly documentVersion: number;
	readonly original: URI | undefined;
	readonly modified: URI;
	readonly changes: readonly ITextEditorChange[];
}

export function isTextEditorDiffInformationEqual(
	uriIdentityService: IUriIdentityService,
	diff1: ITextEditorDiffInformation | undefined,
	diff2: ITextEditorDiffInformation | undefined): boolean {
	return diff1?.documentVersion === diff2?.documentVersion &&
		uriIdentityService.extUri.isEqual(diff1?.original, diff2?.original) &&
		uriIdentityService.extUri.isEqual(diff1?.modified, diff2?.modified) &&
		equals<ITextEditorChange>(diff1?.changes, diff2?.changes, (a, b) => {
			return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
		});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/encryption/common/encryptionService.ts]---
Location: vscode-main/src/vs/platform/encryption/common/encryptionService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IEncryptionService = createDecorator<IEncryptionService>('encryptionService');
export interface IEncryptionService extends ICommonEncryptionService {
	setUsePlainTextEncryption(): Promise<void>;
	getKeyStorageProvider(): Promise<KnownStorageProvider>;
}

export const IEncryptionMainService = createDecorator<IEncryptionMainService>('encryptionMainService');
export interface IEncryptionMainService extends IEncryptionService { }

export interface ICommonEncryptionService {

	readonly _serviceBrand: undefined;

	encrypt(value: string): Promise<string>;

	decrypt(value: string): Promise<string>;

	isEncryptionAvailable(): Promise<boolean>;
}

// The values provided to the `password-store` command line switch.
// Notice that they are not the same as the values returned by
// `getSelectedStorageBackend` in the `safeStorage` API.
export const enum PasswordStoreCLIOption {
	kwallet = 'kwallet',
	kwallet5 = 'kwallet5',
	gnomeLibsecret = 'gnome-libsecret',
	basic = 'basic'
}

// The values returned by `getSelectedStorageBackend` in the `safeStorage` API.
export const enum KnownStorageProvider {
	unknown = 'unknown',
	basicText = 'basic_text',

	// Linux
	gnomeAny = 'gnome_any',
	gnomeLibsecret = 'gnome_libsecret',
	gnomeKeyring = 'gnome_keyring',
	kwallet = 'kwallet',
	kwallet5 = 'kwallet5',
	kwallet6 = 'kwallet6',

	// The rest of these are not returned by `getSelectedStorageBackend`
	// but these were added for platform completeness.

	// Windows
	dplib = 'dpapi',

	// macOS
	keychainAccess = 'keychain_access',
}

export function isKwallet(backend: string): boolean {
	return backend === KnownStorageProvider.kwallet
		|| backend === KnownStorageProvider.kwallet5
		|| backend === KnownStorageProvider.kwallet6;
}

export function isGnome(backend: string): boolean {
	return backend === KnownStorageProvider.gnomeAny
		|| backend === KnownStorageProvider.gnomeLibsecret
		|| backend === KnownStorageProvider.gnomeKeyring;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/encryption/electron-main/encryptionMainService.ts]---
Location: vscode-main/src/vs/platform/encryption/electron-main/encryptionMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { safeStorage as safeStorageElectron, app } from 'electron';
import { isMacintosh, isWindows } from '../../../base/common/platform.js';
import { KnownStorageProvider, IEncryptionMainService, PasswordStoreCLIOption } from '../common/encryptionService.js';
import { ILogService } from '../../log/common/log.js';

// These APIs are currently only supported in our custom build of electron so
// we need to guard against them not being available.
interface ISafeStorageAdditionalAPIs {
	setUsePlainTextEncryption(usePlainText: boolean): void;
	getSelectedStorageBackend(): string;
}

const safeStorage: typeof import('electron').safeStorage & Partial<ISafeStorageAdditionalAPIs> = safeStorageElectron;

export class EncryptionMainService implements IEncryptionMainService {
	_serviceBrand: undefined;

	constructor(
		@ILogService private readonly logService: ILogService
	) {
		// if this commandLine switch is set, the user has opted in to using basic text encryption
		if (app.commandLine.getSwitchValue('password-store') === PasswordStoreCLIOption.basic) {
			this.logService.trace('[EncryptionMainService] setting usePlainTextEncryption to true...');
			safeStorage.setUsePlainTextEncryption?.(true);
			this.logService.trace('[EncryptionMainService] set usePlainTextEncryption to true');
		}
	}

	async encrypt(value: string): Promise<string> {
		this.logService.trace('[EncryptionMainService] Encrypting value...');
		try {
			const result = JSON.stringify(safeStorage.encryptString(value));
			this.logService.trace('[EncryptionMainService] Encrypted value.');
			return result;
		} catch (e) {
			this.logService.error(e);
			throw e;
		}
	}

	async decrypt(value: string): Promise<string> {
		let parsedValue: { data: string };
		try {
			parsedValue = JSON.parse(value);
			if (!parsedValue.data) {
				throw new Error(`[EncryptionMainService] Invalid encrypted value: ${value}`);
			}
			const bufferToDecrypt = Buffer.from(parsedValue.data);

			this.logService.trace('[EncryptionMainService] Decrypting value...');
			const result = safeStorage.decryptString(bufferToDecrypt);
			this.logService.trace('[EncryptionMainService] Decrypted value.');
			return result;
		} catch (e) {
			this.logService.error(e);
			throw e;
		}
	}

	isEncryptionAvailable(): Promise<boolean> {
		this.logService.trace('[EncryptionMainService] Checking if encryption is available...');
		const result = safeStorage.isEncryptionAvailable();
		this.logService.trace('[EncryptionMainService] Encryption is available: ', result);
		return Promise.resolve(result);
	}

	getKeyStorageProvider(): Promise<KnownStorageProvider> {
		if (isWindows) {
			return Promise.resolve(KnownStorageProvider.dplib);
		}
		if (isMacintosh) {
			return Promise.resolve(KnownStorageProvider.keychainAccess);
		}
		if (safeStorage.getSelectedStorageBackend) {
			try {
				this.logService.trace('[EncryptionMainService] Getting selected storage backend...');
				const result = safeStorage.getSelectedStorageBackend() as KnownStorageProvider;
				this.logService.trace('[EncryptionMainService] Selected storage backend: ', result);
				return Promise.resolve(result);
			} catch (e) {
				this.logService.error(e);
			}
		}
		return Promise.resolve(KnownStorageProvider.unknown);
	}

	async setUsePlainTextEncryption(): Promise<void> {
		if (isWindows) {
			throw new Error('Setting plain text encryption is not supported on Windows.');
		}

		if (isMacintosh) {
			throw new Error('Setting plain text encryption is not supported on macOS.');
		}

		if (!safeStorage.setUsePlainTextEncryption) {
			throw new Error('Setting plain text encryption is not supported.');
		}

		this.logService.trace('[EncryptionMainService] Setting usePlainTextEncryption to true...');
		safeStorage.setUsePlainTextEncryption(true);
		this.logService.trace('[EncryptionMainService] Set usePlainTextEncryption to true');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/environment/common/argv.ts]---
Location: vscode-main/src/vs/platform/environment/common/argv.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface INativeCliOptions {
	'cli-data-dir'?: string;
	'disable-telemetry'?: boolean;
	'telemetry-level'?: string;
}

/**
 * A list of command line arguments we support natively.
 */
export interface NativeParsedArgs {

	// subcommands
	tunnel?: INativeCliOptions & {
		user: {
			login: {
				'access-token'?: string;
				'provider'?: string;
			};
		};
	};
	'serve-web'?: INativeCliOptions;
	chat?: {
		_: string[];
		'add-file'?: string[];
		mode?: string;
		maximize?: boolean;
		'reuse-window'?: boolean;
		'new-window'?: boolean;
		profile?: string;
		help?: boolean;
	};

	// arguments
	_: string[];
	'folder-uri'?: string[]; // undefined or array of 1 or more
	'file-uri'?: string[]; // undefined or array of 1 or more
	_urls?: string[];
	help?: boolean;
	version?: boolean;
	telemetry?: boolean;
	status?: boolean;
	wait?: boolean;
	waitMarkerFilePath?: string;
	diff?: boolean;
	merge?: boolean;
	add?: boolean;
	remove?: boolean;
	goto?: boolean;
	'new-window'?: boolean;
	'reuse-window'?: boolean;
	locale?: string;
	'user-data-dir'?: string;
	'prof-startup'?: boolean;
	'prof-startup-prefix'?: string;
	'prof-append-timers'?: string;
	'prof-duration-markers'?: string[];
	'prof-duration-markers-file'?: string;
	'prof-v8-extensions'?: boolean;
	'no-cached-data'?: boolean;
	verbose?: boolean;
	trace?: boolean;
	'trace-memory-infra'?: boolean;
	'trace-category-filter'?: string;
	'trace-options'?: string;
	'open-devtools'?: boolean;
	log?: string[];
	logExtensionHostCommunication?: boolean;
	'extensions-dir'?: string;
	'extensions-download-dir'?: string;
	'builtin-extensions-dir'?: string;
	extensionDevelopmentPath?: string[]; // undefined or array of 1 or more local paths or URIs
	extensionTestsPath?: string; // either a local path or a URI
	extensionDevelopmentKind?: string[];
	extensionEnvironment?: string; // JSON-stringified Record<string, string> object
	'inspect-extensions'?: string;
	'inspect-brk-extensions'?: string;
	debugId?: string;
	debugRenderer?: boolean; // whether we expect a debugger (js-debug) to attach to the renderer, incl webviews+webworker
	'inspect-search'?: string;
	'inspect-brk-search'?: string;
	'inspect-ptyhost'?: string;
	'inspect-brk-ptyhost'?: string;
	'inspect-sharedprocess'?: string;
	'inspect-brk-sharedprocess'?: string;
	'disable-extensions'?: boolean;
	'disable-extension'?: string[]; // undefined or array of 1 or more
	'list-extensions'?: boolean;
	'show-versions'?: boolean;
	'category'?: string;
	'install-extension'?: string[]; // undefined or array of 1 or more
	'pre-release'?: boolean;
	'install-builtin-extension'?: string[]; // undefined or array of 1 or more
	'uninstall-extension'?: string[]; // undefined or array of 1 or more
	'update-extensions'?: boolean;
	'do-not-include-pack-dependencies'?: boolean;
	'locate-extension'?: string[]; // undefined or array of 1 or more
	'enable-proposed-api'?: string[]; // undefined or array of 1 or more
	'open-url'?: boolean;
	'skip-release-notes'?: boolean;
	'skip-welcome'?: boolean;
	'disable-telemetry'?: boolean;
	'export-default-configuration'?: string;
	'export-policy-data'?: string;
	'install-source'?: string;
	'add-mcp'?: string[];
	'disable-updates'?: boolean;
	'transient'?: boolean;
	'use-inmemory-secretstorage'?: boolean;
	'password-store'?: string;
	'disable-workspace-trust'?: boolean;
	'disable-crash-reporter'?: boolean;
	'crash-reporter-directory'?: string;
	'crash-reporter-id'?: string;
	'skip-add-to-recently-opened'?: boolean;
	'file-write'?: boolean;
	'file-chmod'?: boolean;
	'enable-smoke-test-driver'?: boolean;
	'remote'?: string;
	'force'?: boolean;
	'do-not-sync'?: boolean;
	'preserve-env'?: boolean;
	'force-user-env'?: boolean;
	'force-disable-user-env'?: boolean;
	'sync'?: 'on' | 'off';
	'logsPath'?: string;
	'__enable-file-policy'?: boolean;
	editSessionId?: string;
	continueOn?: string;
	'locate-shell-integration-path'?: string;
	'profile'?: string;
	'profile-temp'?: boolean;
	'disable-chromium-sandbox'?: boolean;
	sandbox?: boolean;
	'enable-coi'?: boolean;
	'unresponsive-sample-interval'?: string;
	'unresponsive-sample-period'?: string;
	'enable-rdp-display-tracking'?: boolean;
	'disable-layout-restore'?: boolean;
	'disable-experiments'?: boolean;

	// chromium command line args: https://electronjs.org/docs/all#supported-chrome-command-line-switches
	'no-proxy-server'?: boolean;
	'no-sandbox'?: boolean;
	'proxy-server'?: string;
	'proxy-bypass-list'?: string;
	'proxy-pac-url'?: string;
	'inspect'?: string;
	'inspect-brk'?: string;
	'js-flags'?: string;
	'disable-lcd-text'?: boolean;
	'disable-gpu'?: boolean;
	'disable-gpu-sandbox'?: boolean;
	'nolazy'?: boolean;
	'force-device-scale-factor'?: string;
	'force-renderer-accessibility'?: boolean;
	'ignore-certificate-errors'?: boolean;
	'allow-insecure-localhost'?: boolean;
	'log-net-log'?: string;
	'vmodule'?: string;
	'disable-dev-shm-usage'?: boolean;
	'ozone-platform'?: string;
	'enable-tracing'?: string;
	'trace-startup-format'?: string;
	'trace-startup-file'?: string;
	'trace-startup-duration'?: string;
	'xdg-portal-required-version'?: string;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/environment/common/environment.ts]---
Location: vscode-main/src/vs/platform/environment/common/environment.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { NativeParsedArgs } from './argv.js';
import { createDecorator, refineServiceDecorator } from '../../instantiation/common/instantiation.js';

export const IEnvironmentService = createDecorator<IEnvironmentService>('environmentService');
export const INativeEnvironmentService = refineServiceDecorator<IEnvironmentService, INativeEnvironmentService>(IEnvironmentService);

export interface IDebugParams {
	port: number | null;
	break: boolean;
}

export interface IExtensionHostDebugParams extends IDebugParams {
	debugId?: string;
	env?: Record<string, string>;
}

/**
 * Type of extension.
 *
 * **NOTE**: This is defined in `platform/environment` because it can appear as a CLI argument.
 */
export type ExtensionKind = 'ui' | 'workspace' | 'web';

/**
 * A basic environment service that can be used in various processes,
 * such as main, renderer and shared process. Use subclasses of this
 * service for specific environment.
 */
export interface IEnvironmentService {

	readonly _serviceBrand: undefined;

	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//
	// NOTE: KEEP THIS INTERFACE AS SMALL AS POSSIBLE.
	//
	// AS SUCH:
	//   - PUT NON-WEB PROPERTIES INTO NATIVE ENVIRONMENT SERVICE
	//   - PUT WORKBENCH ONLY PROPERTIES INTO WORKBENCH ENVIRONMENT SERVICE
	//   - PUT ELECTRON-MAIN ONLY PROPERTIES INTO MAIN ENVIRONMENT SERVICE
	//
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	// --- user roaming data
	stateResource: URI;
	userRoamingDataHome: URI;
	keyboardLayoutResource: URI;
	argvResource: URI;

	// --- data paths
	untitledWorkspacesHome: URI;
	workspaceStorageHome: URI;
	localHistoryHome: URI;
	cacheHome: URI;

	// --- settings sync
	userDataSyncHome: URI;
	sync: 'on' | 'off' | undefined;

	// --- continue edit session
	continueOn?: string;
	editSessionId?: string;

	// --- extension development
	debugExtensionHost: IExtensionHostDebugParams;
	isExtensionDevelopment: boolean;
	disableExtensions: boolean | string[];
	enableExtensions?: readonly string[];
	extensionDevelopmentLocationURI?: URI[];
	extensionDevelopmentKind?: ExtensionKind[];
	extensionTestsLocationURI?: URI;

	// --- logging
	logsHome: URI;
	logLevel?: string;
	extensionLogLevel?: [string, string][];
	verbose: boolean;
	isBuilt: boolean;

	// --- telemetry/exp
	disableTelemetry: boolean;
	disableExperiments: boolean;
	serviceMachineIdResource: URI;

	// --- Policy
	policyFile?: URI;

	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//
	// NOTE: KEEP THIS INTERFACE AS SMALL AS POSSIBLE.
	//
	// AS SUCH:
	//   - PUT NON-WEB PROPERTIES INTO NATIVE ENVIRONMENT SERVICE
	//   - PUT WORKBENCH ONLY PROPERTIES INTO WORKBENCH ENVIRONMENT SERVICE
	//   - PUT ELECTRON-MAIN ONLY PROPERTIES INTO MAIN ENVIRONMENT SERVICE
	//
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
}

/**
 * A subclass of the `IEnvironmentService` to be used only in native
 * environments (Windows, Linux, macOS) but not e.g. web.
 */
export interface INativeEnvironmentService extends IEnvironmentService {

	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//
	// NOTE: KEEP THIS INTERFACE AS SMALL AS POSSIBLE.
	//
	// AS SUCH:
	//   - PUT WORKBENCH ONLY PROPERTIES INTO WORKBENCH ENVIRONMENT SERVICE
	//   - PUT ELECTRON-MAIN ONLY PROPERTIES INTO MAIN ENVIRONMENT SERVICE
	//
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	// --- CLI Arguments
	args: NativeParsedArgs;

	// --- data paths
	/**
	 * Root path of the JavaScript sources.
	 *
	 * Note: This is NOT the installation root
	 * directory itself but contained in it at
	 * a level that is platform dependent.
	 */
	appRoot: string;
	userHome: URI;
	appSettingsHome: URI;
	tmpDir: URI;
	userDataPath: string;

	// --- extensions
	extensionsPath: string;
	extensionsDownloadLocation: URI;
	builtinExtensionsPath: string;

	// --- use in-memory Secret Storage
	useInMemorySecretStorage?: boolean;

	crossOriginIsolated?: boolean;
	exportPolicyData?: string;

	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//
	// NOTE: KEEP THIS INTERFACE AS SMALL AS POSSIBLE.
	//
	// AS SUCH:
	//   - PUT NON-WEB PROPERTIES INTO NATIVE ENVIRONMENT SERVICE
	//   - PUT WORKBENCH ONLY PROPERTIES INTO WORKBENCH ENVIRONMENT SERVICE
	//   - PUT ELECTRON-MAIN ONLY PROPERTIES INTO MAIN ENVIRONMENT SERVICE
	//
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/environment/common/environmentService.ts]---
Location: vscode-main/src/vs/platform/environment/common/environmentService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { toLocalISOString } from '../../../base/common/date.js';
import { memoize } from '../../../base/common/decorators.js';
import { FileAccess, Schemas } from '../../../base/common/network.js';
import { dirname, join, normalize, resolve } from '../../../base/common/path.js';
import { env } from '../../../base/common/process.js';
import { joinPath } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import { NativeParsedArgs } from './argv.js';
import { ExtensionKind, IExtensionHostDebugParams, INativeEnvironmentService } from './environment.js';
import { IProductService } from '../../product/common/productService.js';

export const EXTENSION_IDENTIFIER_WITH_LOG_REGEX = /^([^.]+\..+)[:=](.+)$/;

export interface INativeEnvironmentPaths {

	/**
	 * The user data directory to use for anything that should be
	 * persisted except for the content that is meant for the `homeDir`.
	 *
	 * Only one instance of VSCode can use the same `userDataDir`.
	 */
	userDataDir: string;

	/**
	 * The user home directory mainly used for persisting extensions
	 * and global configuration that should be shared across all
	 * versions.
	 */
	homeDir: string;

	/**
	 * OS tmp dir.
	 */
	tmpDir: string;
}

export abstract class AbstractNativeEnvironmentService implements INativeEnvironmentService {

	declare readonly _serviceBrand: undefined;

	@memoize
	get appRoot(): string { return dirname(FileAccess.asFileUri('').fsPath); }

	@memoize
	get userHome(): URI { return URI.file(this.paths.homeDir); }

	@memoize
	get userDataPath(): string { return this.paths.userDataDir; }

	@memoize
	get appSettingsHome(): URI { return URI.file(join(this.userDataPath, 'User')); }

	@memoize
	get tmpDir(): URI { return URI.file(this.paths.tmpDir); }

	@memoize
	get cacheHome(): URI { return URI.file(this.userDataPath); }

	@memoize
	get stateResource(): URI { return joinPath(this.appSettingsHome, 'globalStorage', 'storage.json'); }

	@memoize
	get userRoamingDataHome(): URI { return this.appSettingsHome.with({ scheme: Schemas.vscodeUserData }); }

	@memoize
	get userDataSyncHome(): URI { return joinPath(this.appSettingsHome, 'sync'); }

	get logsHome(): URI {
		if (!this.args.logsPath) {
			const key = toLocalISOString(new Date()).replace(/-|:|\.\d+Z$/g, '');
			this.args.logsPath = join(this.userDataPath, 'logs', key);
		}

		return URI.file(this.args.logsPath);
	}

	@memoize
	get sync(): 'on' | 'off' | undefined { return this.args.sync; }

	@memoize
	get workspaceStorageHome(): URI { return joinPath(this.appSettingsHome, 'workspaceStorage'); }

	@memoize
	get localHistoryHome(): URI { return joinPath(this.appSettingsHome, 'History'); }

	@memoize
	get keyboardLayoutResource(): URI { return joinPath(this.userRoamingDataHome, 'keyboardLayout.json'); }

	@memoize
	get argvResource(): URI {
		const vscodePortable = env['VSCODE_PORTABLE'];
		if (vscodePortable) {
			return URI.file(join(vscodePortable, 'argv.json'));
		}

		return joinPath(this.userHome, this.productService.dataFolderName, 'argv.json');
	}

	@memoize
	get isExtensionDevelopment(): boolean { return !!this.args.extensionDevelopmentPath; }

	@memoize
	get untitledWorkspacesHome(): URI { return URI.file(join(this.userDataPath, 'Workspaces')); }

	@memoize
	get builtinExtensionsPath(): string {
		const cliBuiltinExtensionsDir = this.args['builtin-extensions-dir'];
		if (cliBuiltinExtensionsDir) {
			return resolve(cliBuiltinExtensionsDir);
		}

		return normalize(join(FileAccess.asFileUri('').fsPath, '..', 'extensions'));
	}

	get extensionsDownloadLocation(): URI {
		const cliExtensionsDownloadDir = this.args['extensions-download-dir'];
		if (cliExtensionsDownloadDir) {
			return URI.file(resolve(cliExtensionsDownloadDir));
		}

		return URI.file(join(this.userDataPath, 'CachedExtensionVSIXs'));
	}

	@memoize
	get extensionsPath(): string {
		const cliExtensionsDir = this.args['extensions-dir'];
		if (cliExtensionsDir) {
			return resolve(cliExtensionsDir);
		}

		const vscodeExtensions = env['VSCODE_EXTENSIONS'];
		if (vscodeExtensions) {
			return vscodeExtensions;
		}

		const vscodePortable = env['VSCODE_PORTABLE'];
		if (vscodePortable) {
			return join(vscodePortable, 'extensions');
		}

		return joinPath(this.userHome, this.productService.dataFolderName, 'extensions').fsPath;
	}

	@memoize
	get extensionDevelopmentLocationURI(): URI[] | undefined {
		const extensionDevelopmentPaths = this.args.extensionDevelopmentPath;
		if (Array.isArray(extensionDevelopmentPaths)) {
			return extensionDevelopmentPaths.map(extensionDevelopmentPath => {
				if (/^[^:/?#]+?:\/\//.test(extensionDevelopmentPath)) {
					return URI.parse(extensionDevelopmentPath);
				}

				return URI.file(normalize(extensionDevelopmentPath));
			});
		}

		return undefined;
	}

	@memoize
	get extensionDevelopmentKind(): ExtensionKind[] | undefined {
		return this.args.extensionDevelopmentKind?.map(kind => kind === 'ui' || kind === 'workspace' || kind === 'web' ? kind : 'workspace');
	}

	@memoize
	get extensionTestsLocationURI(): URI | undefined {
		const extensionTestsPath = this.args.extensionTestsPath;
		if (extensionTestsPath) {
			if (/^[^:/?#]+?:\/\//.test(extensionTestsPath)) {
				return URI.parse(extensionTestsPath);
			}

			return URI.file(normalize(extensionTestsPath));
		}

		return undefined;
	}

	get disableExtensions(): boolean | string[] {
		if (this.args['disable-extensions']) {
			return true;
		}

		const disableExtensions = this.args['disable-extension'];
		if (disableExtensions) {
			if (typeof disableExtensions === 'string') {
				return [disableExtensions];
			}

			if (Array.isArray(disableExtensions) && disableExtensions.length > 0) {
				return disableExtensions;
			}
		}

		return false;
	}

	@memoize
	get debugExtensionHost(): IExtensionHostDebugParams { return parseExtensionHostDebugPort(this.args, this.isBuilt); }
	get debugRenderer(): boolean { return !!this.args.debugRenderer; }

	get isBuilt(): boolean { return !env['VSCODE_DEV']; }
	get verbose(): boolean { return !!this.args.verbose; }

	@memoize
	get logLevel(): string | undefined { return this.args.log?.find(entry => !EXTENSION_IDENTIFIER_WITH_LOG_REGEX.test(entry)); }
	@memoize
	get extensionLogLevel(): [string, string][] | undefined {
		const result: [string, string][] = [];
		for (const entry of this.args.log || []) {
			const matches = EXTENSION_IDENTIFIER_WITH_LOG_REGEX.exec(entry);
			if (matches?.[1] && matches[2]) {
				result.push([matches[1], matches[2]]);
			}
		}
		return result.length ? result : undefined;
	}

	@memoize
	get serviceMachineIdResource(): URI { return joinPath(URI.file(this.userDataPath), 'machineid'); }

	get crashReporterId(): string | undefined { return this.args['crash-reporter-id']; }
	get crashReporterDirectory(): string | undefined { return this.args['crash-reporter-directory']; }

	@memoize
	get disableTelemetry(): boolean { return !!this.args['disable-telemetry']; }

	@memoize
	get disableExperiments(): boolean { return !!this.args['disable-experiments']; }

	@memoize
	get disableWorkspaceTrust(): boolean { return !!this.args['disable-workspace-trust']; }

	@memoize
	get useInMemorySecretStorage(): boolean { return !!this.args['use-inmemory-secretstorage']; }

	@memoize
	get policyFile(): URI | undefined {
		if (this.args['__enable-file-policy']) {
			const vscodePortable = env['VSCODE_PORTABLE'];
			if (vscodePortable) {
				return URI.file(join(vscodePortable, 'policy.json'));
			}

			return joinPath(this.userHome, this.productService.dataFolderName, 'policy.json');
		}
		return undefined;
	}

	get editSessionId(): string | undefined { return this.args['editSessionId']; }

	get exportPolicyData(): string | undefined {
		return this.args['export-policy-data'];
	}

	get continueOn(): string | undefined {
		return this.args['continueOn'];
	}

	set continueOn(value: string | undefined) {
		this.args['continueOn'] = value;
	}

	get args(): NativeParsedArgs { return this._args; }

	constructor(
		private readonly _args: NativeParsedArgs,
		private readonly paths: INativeEnvironmentPaths,
		protected readonly productService: IProductService
	) { }
}

export function parseExtensionHostDebugPort(args: NativeParsedArgs, isBuilt: boolean): IExtensionHostDebugParams {
	return parseDebugParams(args['inspect-extensions'], args['inspect-brk-extensions'], 5870, isBuilt, args.debugId, args.extensionEnvironment);
}

export function parseDebugParams(debugArg: string | undefined, debugBrkArg: string | undefined, defaultBuildPort: number, isBuilt: boolean, debugId?: string, environmentString?: string): IExtensionHostDebugParams {
	const portStr = debugBrkArg || debugArg;
	const port = Number(portStr) || (!isBuilt ? defaultBuildPort : null);
	const brk = port ? Boolean(!!debugBrkArg) : false;
	let env: Record<string, string> | undefined;
	if (environmentString) {
		try {
			env = JSON.parse(environmentString);
		} catch {
			// ignore
		}
	}

	return { port, break: brk, debugId, env };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/environment/electron-main/environmentMainService.ts]---
Location: vscode-main/src/vs/platform/environment/electron-main/environmentMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { memoize } from '../../../base/common/decorators.js';
import { join } from '../../../base/common/path.js';
import { isLinux } from '../../../base/common/platform.js';
import { createStaticIPCHandle } from '../../../base/parts/ipc/node/ipc.net.js';
import { IEnvironmentService, INativeEnvironmentService } from '../common/environment.js';
import { NativeEnvironmentService } from '../node/environmentService.js';
import { refineServiceDecorator } from '../../instantiation/common/instantiation.js';

export const IEnvironmentMainService = refineServiceDecorator<IEnvironmentService, IEnvironmentMainService>(IEnvironmentService);

/**
 * A subclass of the `INativeEnvironmentService` to be used only in electron-main
 * environments.
 */
export interface IEnvironmentMainService extends INativeEnvironmentService {

	// --- backup paths
	readonly backupHome: string;

	// --- V8 code caching
	readonly codeCachePath: string | undefined;
	readonly useCodeCache: boolean;

	// --- IPC
	readonly mainIPCHandle: string;
	readonly mainLockfile: string;

	// --- config
	readonly disableUpdates: boolean;

	// TODO@deepak1556 temporary until a real fix lands upstream
	readonly enableRDPDisplayTracking: boolean;

	unsetSnapExportedVariables(): void;
	restoreSnapExportedVariables(): void;
}

export class EnvironmentMainService extends NativeEnvironmentService implements IEnvironmentMainService {

	private _snapEnv: Record<string, string> = {};

	@memoize
	get backupHome(): string { return join(this.userDataPath, 'Backups'); }

	@memoize
	get mainIPCHandle(): string { return createStaticIPCHandle(this.userDataPath, 'main', this.productService.version); }

	@memoize
	get mainLockfile(): string { return join(this.userDataPath, 'code.lock'); }

	@memoize
	get disableUpdates(): boolean { return !!this.args['disable-updates']; }

	@memoize
	get crossOriginIsolated(): boolean { return !!this.args['enable-coi']; }

	@memoize
	get enableRDPDisplayTracking(): boolean { return !!this.args['enable-rdp-display-tracking']; }

	@memoize
	get codeCachePath(): string | undefined { return process.env['VSCODE_CODE_CACHE_PATH'] || undefined; }

	@memoize
	get useCodeCache(): boolean { return !!this.codeCachePath; }

	unsetSnapExportedVariables() {
		if (!isLinux) {
			return;
		}
		for (const key in process.env) {
			if (key.endsWith('_VSCODE_SNAP_ORIG')) {
				const originalKey = key.slice(0, -17); // Remove the _VSCODE_SNAP_ORIG suffix
				if (this._snapEnv[originalKey]) {
					continue;
				}
				// Preserve the original value in case the snap env is re-entered
				if (process.env[originalKey]) {
					this._snapEnv[originalKey] = process.env[originalKey]!;
				}
				// Copy the original value from before entering the snap env if available,
				// if not delete the env variable.
				if (process.env[key]) {
					process.env[originalKey] = process.env[key];
				} else {
					delete process.env[originalKey];
				}
			}
		}
	}

	restoreSnapExportedVariables() {
		if (!isLinux) {
			return;
		}
		for (const key in this._snapEnv) {
			process.env[key] = this._snapEnv[key];
			delete this._snapEnv[key];
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/environment/node/argv.ts]---
Location: vscode-main/src/vs/platform/environment/node/argv.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import minimist from 'minimist';
import { isWindows } from '../../../base/common/platform.js';
import { localize } from '../../../nls.js';
import { NativeParsedArgs } from '../common/argv.js';

/**
 * This code is also used by standalone cli's. Avoid adding any other dependencies.
 */
const helpCategories = {
	o: localize('optionsUpperCase', "Options"),
	e: localize('extensionsManagement', "Extensions Management"),
	t: localize('troubleshooting', "Troubleshooting"),
	m: localize('mcp', "Model Context Protocol")
};

export interface Option<OptionType> {
	type: OptionType;
	alias?: string;
	deprecates?: string[]; // old deprecated ids
	args?: string | string[];
	description?: string;
	deprecationMessage?: string;
	allowEmptyValue?: boolean;
	cat?: keyof typeof helpCategories;
	global?: boolean;
}

export interface Subcommand<T> {
	type: 'subcommand';
	description?: string;
	deprecationMessage?: string;
	options: OptionDescriptions<Required<T>>;
}

export type OptionDescriptions<T> = {
	[P in keyof T]:
	T[P] extends boolean | undefined ? Option<'boolean'> :
	T[P] extends string | undefined ? Option<'string'> :
	T[P] extends string[] | undefined ? Option<'string[]'> :
	Subcommand<T[P]>
};

export const NATIVE_CLI_COMMANDS = ['tunnel', 'serve-web'] as const;

export const OPTIONS: OptionDescriptions<Required<NativeParsedArgs>> = {
	'chat': {
		type: 'subcommand',
		description: 'Pass in a prompt to run in a chat session in the current working directory.',
		options: {
			'_': { type: 'string[]', description: localize('prompt', "The prompt to use as chat.") },
			'mode': { type: 'string', cat: 'o', alias: 'm', args: 'mode', description: localize('chatMode', "The mode to use for the chat session. Available options: 'ask', 'edit', 'agent', or the identifier of a custom mode. Defaults to 'agent'.") },
			'add-file': { type: 'string[]', cat: 'o', alias: 'a', args: 'path', description: localize('addFile', "Add files as context to the chat session.") },
			'maximize': { type: 'boolean', cat: 'o', description: localize('chatMaximize', "Maximize the chat session view.") },
			'reuse-window': { type: 'boolean', cat: 'o', alias: 'r', description: localize('reuseWindowForChat', "Force to use the last active window for the chat session.") },
			'new-window': { type: 'boolean', cat: 'o', alias: 'n', description: localize('newWindowForChat', "Force to open an empty window for the chat session.") },
			'profile': { type: 'string', 'cat': 'o', args: 'profileName', description: localize('profileName', "Opens the provided folder or workspace with the given profile and associates the profile with the workspace. If the profile does not exist, a new empty one is created.") },
			'help': { type: 'boolean', alias: 'h', description: localize('help', "Print usage.") }
		}
	},
	'serve-web': {
		type: 'subcommand',
		description: 'Run a server that displays the editor UI in browsers.',
		options: {
			'cli-data-dir': { type: 'string', args: 'dir', description: localize('cliDataDir', "Directory where CLI metadata should be stored.") },
			'disable-telemetry': { type: 'boolean' },
			'telemetry-level': { type: 'string' },
		}
	},
	'tunnel': {
		type: 'subcommand',
		description: 'Make the current machine accessible from vscode.dev or other machines through a secure tunnel.',
		options: {
			'cli-data-dir': { type: 'string', args: 'dir', description: localize('cliDataDir', "Directory where CLI metadata should be stored.") },
			'disable-telemetry': { type: 'boolean' },
			'telemetry-level': { type: 'string' },
			user: {
				type: 'subcommand',
				options: {
					login: {
						type: 'subcommand',
						options: {
							provider: { type: 'string' },
							'access-token': { type: 'string' }
						}
					}
				}
			}
		}
	},
	'diff': { type: 'boolean', cat: 'o', alias: 'd', args: ['file', 'file'], description: localize('diff', "Compare two files with each other.") },
	'merge': { type: 'boolean', cat: 'o', alias: 'm', args: ['path1', 'path2', 'base', 'result'], description: localize('merge', "Perform a three-way merge by providing paths for two modified versions of a file, the common origin of both modified versions and the output file to save merge results.") },
	'add': { type: 'boolean', cat: 'o', alias: 'a', args: 'folder', description: localize('add', "Add folder(s) to the last active window.") },
	'remove': { type: 'boolean', cat: 'o', args: 'folder', description: localize('remove', "Remove folder(s) from the last active window.") },
	'goto': { type: 'boolean', cat: 'o', alias: 'g', args: 'file:line[:character]', description: localize('goto', "Open a file at the path on the specified line and character position.") },
	'new-window': { type: 'boolean', cat: 'o', alias: 'n', description: localize('newWindow', "Force to open a new window.") },
	'reuse-window': { type: 'boolean', cat: 'o', alias: 'r', description: localize('reuseWindow', "Force to open a file or folder in an already opened window.") },
	'wait': { type: 'boolean', cat: 'o', alias: 'w', description: localize('wait', "Wait for the files to be closed before returning.") },
	'waitMarkerFilePath': { type: 'string' },
	'locale': { type: 'string', cat: 'o', args: 'locale', description: localize('locale', "The locale to use (e.g. en-US or zh-TW).") },
	'user-data-dir': { type: 'string', cat: 'o', args: 'dir', description: localize('userDataDir', "Specifies the directory that user data is kept in. Can be used to open multiple distinct instances of Code.") },
	'profile': { type: 'string', 'cat': 'o', args: 'profileName', description: localize('profileName', "Opens the provided folder or workspace with the given profile and associates the profile with the workspace. If the profile does not exist, a new empty one is created.") },
	'help': { type: 'boolean', cat: 'o', alias: 'h', description: localize('help', "Print usage.") },

	'extensions-dir': { type: 'string', deprecates: ['extensionHomePath'], cat: 'e', args: 'dir', description: localize('extensionHomePath', "Set the root path for extensions.") },
	'extensions-download-dir': { type: 'string' },
	'builtin-extensions-dir': { type: 'string' },
	'list-extensions': { type: 'boolean', cat: 'e', description: localize('listExtensions', "List the installed extensions.") },
	'show-versions': { type: 'boolean', cat: 'e', description: localize('showVersions', "Show versions of installed extensions, when using --list-extensions.") },
	'category': { type: 'string', allowEmptyValue: true, cat: 'e', description: localize('category', "Filters installed extensions by provided category, when using --list-extensions."), args: 'category' },
	'install-extension': { type: 'string[]', cat: 'e', args: 'ext-id | path', description: localize('installExtension', "Installs or updates an extension. The argument is either an extension id or a path to a VSIX. The identifier of an extension is '${publisher}.${name}'. Use '--force' argument to update to latest version. To install a specific version provide '@${version}'. For example: 'vscode.csharp@1.2.3'.") },
	'pre-release': { type: 'boolean', cat: 'e', description: localize('install prerelease', "Installs the pre-release version of the extension, when using --install-extension") },
	'uninstall-extension': { type: 'string[]', cat: 'e', args: 'ext-id', description: localize('uninstallExtension', "Uninstalls an extension.") },
	'update-extensions': { type: 'boolean', cat: 'e', description: localize('updateExtensions', "Update the installed extensions.") },
	'enable-proposed-api': { type: 'string[]', allowEmptyValue: true, cat: 'e', args: 'ext-id', description: localize('experimentalApis', "Enables proposed API features for extensions. Can receive one or more extension IDs to enable individually.") },

	'add-mcp': { type: 'string[]', cat: 'm', args: 'json', description: localize('addMcp', "Adds a Model Context Protocol server definition to the user profile. Accepts JSON input in the form '{\"name\":\"server-name\",\"command\":...}'") },

	'version': { type: 'boolean', cat: 't', alias: 'v', description: localize('version', "Print version.") },
	'verbose': { type: 'boolean', cat: 't', global: true, description: localize('verbose', "Print verbose output (implies --wait).") },
	'log': { type: 'string[]', cat: 't', args: 'level', global: true, description: localize('log', "Log level to use. Default is 'info'. Allowed values are 'critical', 'error', 'warn', 'info', 'debug', 'trace', 'off'. You can also configure the log level of an extension by passing extension id and log level in the following format: '${publisher}.${name}:${logLevel}'. For example: 'vscode.csharp:trace'. Can receive one or more such entries.") },
	'status': { type: 'boolean', alias: 's', cat: 't', description: localize('status', "Print process usage and diagnostics information.") },
	'prof-startup': { type: 'boolean', cat: 't', description: localize('prof-startup', "Run CPU profiler during startup.") },
	'prof-append-timers': { type: 'string' },
	'prof-duration-markers': { type: 'string[]' },
	'prof-duration-markers-file': { type: 'string' },
	'no-cached-data': { type: 'boolean' },
	'prof-startup-prefix': { type: 'string' },
	'prof-v8-extensions': { type: 'boolean' },
	'disable-extensions': { type: 'boolean', deprecates: ['disableExtensions'], cat: 't', description: localize('disableExtensions', "Disable all installed extensions. This option is not persisted and is effective only when the command opens a new window.") },
	'disable-extension': { type: 'string[]', cat: 't', args: 'ext-id', description: localize('disableExtension', "Disable the provided extension. This option is not persisted and is effective only when the command opens a new window.") },
	'sync': { type: 'string', cat: 't', description: localize('turn sync', "Turn sync on or off."), args: ['on | off'] },

	'inspect-extensions': { type: 'string', allowEmptyValue: true, deprecates: ['debugPluginHost'], args: 'port', cat: 't', description: localize('inspect-extensions', "Allow debugging and profiling of extensions. Check the developer tools for the connection URI.") },
	'inspect-brk-extensions': { type: 'string', allowEmptyValue: true, deprecates: ['debugBrkPluginHost'], args: 'port', cat: 't', description: localize('inspect-brk-extensions', "Allow debugging and profiling of extensions with the extension host being paused after start. Check the developer tools for the connection URI.") },
	'disable-lcd-text': { type: 'boolean', cat: 't', description: localize('disableLCDText', "Disable LCD font rendering.") },
	'disable-gpu': { type: 'boolean', cat: 't', description: localize('disableGPU', "Disable GPU hardware acceleration.") },
	'disable-chromium-sandbox': { type: 'boolean', cat: 't', description: localize('disableChromiumSandbox', "Use this option only when there is requirement to launch the application as sudo user on Linux or when running as an elevated user in an applocker environment on Windows.") },
	'sandbox': { type: 'boolean' },
	'locate-shell-integration-path': { type: 'string', cat: 't', args: ['shell'], description: localize('locateShellIntegrationPath', "Print the path to a terminal shell integration script. Allowed values are 'bash', 'pwsh', 'zsh' or 'fish'.") },
	'telemetry': { type: 'boolean', cat: 't', description: localize('telemetry', "Shows all telemetry events which VS code collects.") },

	'remote': { type: 'string', allowEmptyValue: true },
	'folder-uri': { type: 'string[]', cat: 'o', args: 'uri' },
	'file-uri': { type: 'string[]', cat: 'o', args: 'uri' },

	'locate-extension': { type: 'string[]' },
	'extensionDevelopmentPath': { type: 'string[]' },
	'extensionDevelopmentKind': { type: 'string[]' },
	'extensionTestsPath': { type: 'string' },
	'extensionEnvironment': { type: 'string' },
	'debugId': { type: 'string' },
	'debugRenderer': { type: 'boolean' },
	'inspect-ptyhost': { type: 'string', allowEmptyValue: true },
	'inspect-brk-ptyhost': { type: 'string', allowEmptyValue: true },
	'inspect-search': { type: 'string', deprecates: ['debugSearch'], allowEmptyValue: true },
	'inspect-brk-search': { type: 'string', deprecates: ['debugBrkSearch'], allowEmptyValue: true },
	'inspect-sharedprocess': { type: 'string', allowEmptyValue: true },
	'inspect-brk-sharedprocess': { type: 'string', allowEmptyValue: true },
	'export-default-configuration': { type: 'string' },
	'export-policy-data': { type: 'string', allowEmptyValue: true },
	'install-source': { type: 'string' },
	'enable-smoke-test-driver': { type: 'boolean' },
	'logExtensionHostCommunication': { type: 'boolean' },
	'skip-release-notes': { type: 'boolean' },
	'skip-welcome': { type: 'boolean' },
	'disable-telemetry': { type: 'boolean' },
	'disable-updates': { type: 'boolean' },
	'transient': { type: 'boolean', cat: 't', description: localize('transient', "Run with temporary data and extension directories, as if launched for the first time.") },
	'use-inmemory-secretstorage': { type: 'boolean', deprecates: ['disable-keytar'] },
	'password-store': { type: 'string' },
	'disable-workspace-trust': { type: 'boolean' },
	'disable-crash-reporter': { type: 'boolean' },
	'crash-reporter-directory': { type: 'string' },
	'crash-reporter-id': { type: 'string' },
	'skip-add-to-recently-opened': { type: 'boolean' },
	'open-url': { type: 'boolean' },
	'file-write': { type: 'boolean' },
	'file-chmod': { type: 'boolean' },
	'install-builtin-extension': { type: 'string[]' },
	'force': { type: 'boolean' },
	'do-not-sync': { type: 'boolean' },
	'do-not-include-pack-dependencies': { type: 'boolean' },
	'trace': { type: 'boolean' },
	'trace-memory-infra': { type: 'boolean' },
	'trace-category-filter': { type: 'string' },
	'trace-options': { type: 'string' },
	'preserve-env': { type: 'boolean' },
	'force-user-env': { type: 'boolean' },
	'force-disable-user-env': { type: 'boolean' },
	'open-devtools': { type: 'boolean' },
	'disable-gpu-sandbox': { type: 'boolean' },
	'logsPath': { type: 'string' },
	'__enable-file-policy': { type: 'boolean' },
	'editSessionId': { type: 'string' },
	'continueOn': { type: 'string' },
	'enable-coi': { type: 'boolean' },
	'unresponsive-sample-interval': { type: 'string' },
	'unresponsive-sample-period': { type: 'string' },
	'enable-rdp-display-tracking': { type: 'boolean' },
	'disable-layout-restore': { type: 'boolean' },
	'disable-experiments': { type: 'boolean' },

	// chromium flags
	'no-proxy-server': { type: 'boolean' },
	// Minimist incorrectly parses keys that start with `--no`
	// https://github.com/substack/minimist/blob/aeb3e27dae0412de5c0494e9563a5f10c82cc7a9/index.js#L118-L121
	// If --no-sandbox is passed via cli wrapper it will be treated as --sandbox which is incorrect, we use
	// the alias here to make sure --no-sandbox is always respected.
	// For https://github.com/microsoft/vscode/issues/128279
	'no-sandbox': { type: 'boolean', alias: 'sandbox' },
	'proxy-server': { type: 'string' },
	'proxy-bypass-list': { type: 'string' },
	'proxy-pac-url': { type: 'string' },
	'js-flags': { type: 'string' }, // chrome js flags
	'inspect': { type: 'string', allowEmptyValue: true },
	'inspect-brk': { type: 'string', allowEmptyValue: true },
	'nolazy': { type: 'boolean' }, // node inspect
	'force-device-scale-factor': { type: 'string' },
	'force-renderer-accessibility': { type: 'boolean' },
	'ignore-certificate-errors': { type: 'boolean' },
	'allow-insecure-localhost': { type: 'boolean' },
	'log-net-log': { type: 'string' },
	'vmodule': { type: 'string' },
	'_urls': { type: 'string[]' },
	'disable-dev-shm-usage': { type: 'boolean' },
	'profile-temp': { type: 'boolean' },
	'ozone-platform': { type: 'string' },
	'enable-tracing': { type: 'string' },
	'trace-startup-format': { type: 'string' },
	'trace-startup-file': { type: 'string' },
	'trace-startup-duration': { type: 'string' },
	'xdg-portal-required-version': { type: 'string' },

	_: { type: 'string[]' } // main arguments
};

export interface ErrorReporter {
	onUnknownOption(id: string): void;
	onMultipleValues(id: string, usedValue: string): void;
	onEmptyValue(id: string): void;
	onDeprecatedOption(deprecatedId: string, message: string): void;

	getSubcommandReporter?(command: string): ErrorReporter;
}

const ignoringReporter = {
	onUnknownOption: () => { },
	onMultipleValues: () => { },
	onEmptyValue: () => { },
	onDeprecatedOption: () => { }
};

export function parseArgs<T>(args: string[], options: OptionDescriptions<T>, errorReporter: ErrorReporter = ignoringReporter): T {
	// Find the first non-option arg, which also isn't the value for a previous `--flag`
	const firstPossibleCommand = args.find((a, i) => a.length > 0 && a[0] !== '-' && options.hasOwnProperty(a) && options[a as T].type === 'subcommand');

	const alias: { [key: string]: string } = {};
	const stringOptions: string[] = ['_'];
	const booleanOptions: string[] = [];
	const globalOptions: Record<string, Option<'boolean'> | Option<'string'> | Option<'string[]'>> = {};
	let command: Subcommand<Record<string, unknown>> | undefined = undefined;
	for (const optionId in options) {
		const o = options[optionId];
		if (o.type === 'subcommand') {
			if (optionId === firstPossibleCommand) {
				command = o;
			}
		} else {
			if (o.alias) {
				alias[optionId] = o.alias;
			}

			if (o.type === 'string' || o.type === 'string[]') {
				stringOptions.push(optionId);
				if (o.deprecates) {
					stringOptions.push(...o.deprecates);
				}
			} else if (o.type === 'boolean') {
				booleanOptions.push(optionId);
				if (o.deprecates) {
					booleanOptions.push(...o.deprecates);
				}
			}
			if (o.global) {
				globalOptions[optionId] = o;
			}
		}
	}
	if (command && firstPossibleCommand) {
		const options: Record<string, Option<'boolean'> | Option<'string'> | Option<'string[]'> | Subcommand<Record<string, unknown>>> = globalOptions;
		for (const optionId in command.options) {
			options[optionId] = command.options[optionId];
		}
		const newArgs = args.filter(a => a !== firstPossibleCommand);
		const reporter = errorReporter.getSubcommandReporter ? errorReporter.getSubcommandReporter(firstPossibleCommand) : undefined;
		const subcommandOptions = parseArgs(newArgs, options as OptionDescriptions<Record<string, unknown>>, reporter);
		// eslint-disable-next-line local/code-no-dangerous-type-assertions
		return <T>{
			[firstPossibleCommand]: subcommandOptions,
			_: []
		};
	}


	// remove aliases to avoid confusion
	const parsedArgs = minimist(args, { string: stringOptions, boolean: booleanOptions, alias });

	const cleanedArgs: Record<string, unknown> = {};
	const remainingArgs: Record<string, unknown> = parsedArgs;

	// https://github.com/microsoft/vscode/issues/58177, https://github.com/microsoft/vscode/issues/106617
	cleanedArgs._ = parsedArgs._.map(arg => String(arg)).filter(arg => arg.length > 0);

	delete remainingArgs._;

	for (const optionId in options) {
		const o = options[optionId];
		if (o.type === 'subcommand') {
			continue;
		}
		if (o.alias) {
			delete remainingArgs[o.alias];
		}

		let val = remainingArgs[optionId];
		if (o.deprecates) {
			for (const deprecatedId of o.deprecates) {
				if (remainingArgs.hasOwnProperty(deprecatedId)) {
					if (!val) {
						val = remainingArgs[deprecatedId];
						if (val) {
							errorReporter.onDeprecatedOption(deprecatedId, o.deprecationMessage || localize('deprecated.useInstead', 'Use {0} instead.', optionId));
						}
					}
					delete remainingArgs[deprecatedId];
				}
			}
		}

		if (typeof val !== 'undefined') {
			if (o.type === 'string[]') {
				if (!Array.isArray(val)) {
					val = [val];
				}
				if (!o.allowEmptyValue) {
					const sanitized = (val as string[]).filter((v: string) => v.length > 0);
					if (sanitized.length !== (val as string[]).length) {
						errorReporter.onEmptyValue(optionId);
						val = sanitized.length > 0 ? sanitized : undefined;
					}
				}
			} else if (o.type === 'string') {
				if (Array.isArray(val)) {
					val = val.pop(); // take the last
					errorReporter.onMultipleValues(optionId, val as string);
				} else if (!val && !o.allowEmptyValue) {
					errorReporter.onEmptyValue(optionId);
					val = undefined;
				}
			}
			cleanedArgs[optionId] = val;

			if (o.deprecationMessage) {
				errorReporter.onDeprecatedOption(optionId, o.deprecationMessage);
			}
		}
		delete remainingArgs[optionId];
	}

	for (const key in remainingArgs) {
		errorReporter.onUnknownOption(key);
	}

	return cleanedArgs as T;
}

function formatUsage(optionId: string, option: Option<'boolean'> | Option<'string'> | Option<'string[]'>) {
	let args = '';
	if (option.args) {
		if (Array.isArray(option.args)) {
			args = ` <${option.args.join('> <')}>`;
		} else {
			args = ` <${option.args}>`;
		}
	}
	if (option.alias) {
		return `-${option.alias} --${optionId}${args}`;
	}
	return `--${optionId}${args}`;
}

// exported only for testing
export function formatOptions(options: OptionDescriptions<unknown> | Record<string, Option<'boolean'> | Option<'string'> | Option<'string[]'>>, columns: number): string[] {
	const usageTexts: [string, string][] = [];
	for (const optionId in options) {
		const o = options[optionId as keyof typeof options] as Option<'boolean'> | Option<'string'> | Option<'string[]'>;
		const usageText = formatUsage(optionId, o);
		usageTexts.push([usageText, o.description!]);
	}
	return formatUsageTexts(usageTexts, columns);
}

function formatUsageTexts(usageTexts: [string, string][], columns: number) {
	const maxLength = usageTexts.reduce((previous, e) => Math.max(previous, e[0].length), 12);
	const argLength = maxLength + 2/*left padding*/ + 1/*right padding*/;
	if (columns - argLength < 25) {
		// Use a condensed version on narrow terminals
		return usageTexts.reduce<string[]>((r, ut) => r.concat([`  ${ut[0]}`, `      ${ut[1]}`]), []);
	}
	const descriptionColumns = columns - argLength - 1;
	const result: string[] = [];
	for (const ut of usageTexts) {
		const usage = ut[0];
		const wrappedDescription = wrapText(ut[1], descriptionColumns);
		const keyPadding = indent(argLength - usage.length - 2/*left padding*/);
		result.push('  ' + usage + keyPadding + wrappedDescription[0]);
		for (let i = 1; i < wrappedDescription.length; i++) {
			result.push(indent(argLength) + wrappedDescription[i]);
		}
	}
	return result;
}

function indent(count: number): string {
	return ' '.repeat(count);
}

function wrapText(text: string, columns: number): string[] {
	const lines: string[] = [];
	while (text.length) {
		let index = text.length < columns ? text.length : text.lastIndexOf(' ', columns);
		if (index === 0) {
			index = columns;
		}
		const line = text.slice(0, index).trim();
		text = text.slice(index).trimStart();
		lines.push(line);
	}
	return lines;
}

export function buildHelpMessage(productName: string, executableName: string, version: string, options: OptionDescriptions<unknown> | Record<string, Option<'boolean'> | Option<'string'> | Option<'string[]'> | Subcommand<Record<string, unknown>>>, capabilities?: { noPipe?: boolean; noInputFiles?: boolean; isChat?: boolean }): string {
	const columns = (process.stdout).isTTY && (process.stdout).columns || 80;
	const inputFiles = capabilities?.noInputFiles ? '' : capabilities?.isChat ? ` [${localize('cliPrompt', 'prompt')}]` : ` [${localize('paths', 'paths')}...]`;
	const subcommand = capabilities?.isChat ? ' chat' : '';

	const help = [`${productName} ${version}`];
	help.push('');
	help.push(`${localize('usage', "Usage")}: ${executableName}${subcommand} [${localize('options', "options")}]${inputFiles}`);
	help.push('');
	if (capabilities?.noPipe !== true) {
		help.push(buildStdinMessage(executableName, capabilities?.isChat));
		help.push('');
	}
	const optionsByCategory: { [P in keyof typeof helpCategories]?: Record<string, Option<'boolean'> | Option<'string'> | Option<'string[]'>> } = {};
	const subcommands: { command: string; description: string }[] = [];
	for (const optionId in options) {
		const o = options[optionId as keyof typeof options] as Option<'boolean'> | Option<'string'> | Option<'string[]'> | Subcommand<Record<string, unknown>>;
		if (o.type === 'subcommand') {
			if (o.description) {
				subcommands.push({ command: optionId, description: o.description });
			}
		} else if (o.description && o.cat) {
			const cat = o.cat;
			let optionsByCat = optionsByCategory[cat];
			if (!optionsByCat) {
				optionsByCategory[cat] = optionsByCat = {};
			}
			optionsByCat[optionId] = o;
		}
	}

	for (const helpCategoryKey in optionsByCategory) {
		const key = <keyof typeof helpCategories>helpCategoryKey;

		const categoryOptions = optionsByCategory[key];
		if (categoryOptions) {
			help.push(helpCategories[key]);
			help.push(...formatOptions(categoryOptions, columns));
			help.push('');
		}
	}

	if (subcommands.length) {
		help.push(localize('subcommands', "Subcommands"));
		help.push(...formatUsageTexts(subcommands.map(s => [s.command, s.description]), columns));
		help.push('');
	}

	return help.join('\n');
}

export function buildStdinMessage(executableName: string, isChat?: boolean): string {
	let example: string;
	if (isWindows) {
		if (isChat) {
			example = `echo Hello World | ${executableName} chat <prompt> -`;
		} else {
			example = `echo Hello World | ${executableName} -`;
		}
	} else {
		if (isChat) {
			example = `ps aux | grep code | ${executableName} chat <prompt> -`;
		} else {
			example = `ps aux | grep code | ${executableName} -`;
		}
	}

	return localize('stdinUsage', "To read from stdin, append '-' (e.g. '{0}')", example);
}

export function buildVersionMessage(version: string | undefined, commit: string | undefined): string {
	return `${version || localize('unknownVersion', "Unknown version")}\n${commit || localize('unknownCommit', "Unknown commit")}\n${process.arch}`;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/environment/node/argvHelper.ts]---
Location: vscode-main/src/vs/platform/environment/node/argvHelper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IProcessEnvironment } from '../../../base/common/platform.js';
import { localize } from '../../../nls.js';
import { NativeParsedArgs } from '../common/argv.js';
import { ErrorReporter, NATIVE_CLI_COMMANDS, OPTIONS, parseArgs } from './argv.js';

function parseAndValidate(cmdLineArgs: string[], reportWarnings: boolean): NativeParsedArgs {
	const onMultipleValues = (id: string, val: string) => {
		console.warn(localize('multipleValues', "Option '{0}' is defined more than once. Using value '{1}'.", id, val));
	};
	const onEmptyValue = (id: string) => {
		console.warn(localize('emptyValue', "Option '{0}' requires a non empty value. Ignoring the option.", id));
	};
	const onDeprecatedOption = (deprecatedOption: string, message: string) => {
		console.warn(localize('deprecatedArgument', "Option '{0}' is deprecated: {1}", deprecatedOption, message));
	};
	const getSubcommandReporter = (command: string) => ({
		onUnknownOption: (id: string) => {
			if (!(NATIVE_CLI_COMMANDS as readonly string[]).includes(command)) {
				console.warn(localize('unknownSubCommandOption', "Warning: '{0}' is not in the list of known options for subcommand '{1}'", id, command));
			}
		},
		onMultipleValues,
		onEmptyValue,
		onDeprecatedOption,
		getSubcommandReporter: (NATIVE_CLI_COMMANDS as readonly string[]).includes(command) ? getSubcommandReporter : undefined
	});
	const errorReporter: ErrorReporter = {
		onUnknownOption: (id) => {
			console.warn(localize('unknownOption', "Warning: '{0}' is not in the list of known options, but still passed to Electron/Chromium.", id));
		},
		onMultipleValues,
		onEmptyValue,
		onDeprecatedOption,
		getSubcommandReporter
	};

	const args = parseArgs(cmdLineArgs, OPTIONS, reportWarnings ? errorReporter : undefined);
	if (args.goto) {
		args._.forEach(arg => assert(/^(\w:)?[^:]+(:\d*){0,2}:?$/.test(arg), localize('gotoValidation', "Arguments in `--goto` mode should be in the format of `FILE(:LINE(:CHARACTER))`.")));
	}

	return args;
}

function stripAppPath(argv: string[]): string[] | undefined {
	const index = argv.findIndex(a => !/^-/.test(a));

	if (index > -1) {
		return [...argv.slice(0, index), ...argv.slice(index + 1)];
	}
	return undefined;
}

/**
 * Use this to parse raw code process.argv such as: `Electron . --verbose --wait`
 */
export function parseMainProcessArgv(processArgv: string[]): NativeParsedArgs {
	let [, ...args] = processArgv;

	// If dev, remove the first non-option argument: it's the app location
	if (process.env['VSCODE_DEV']) {
		args = stripAppPath(args) || [];
	}

	// If called from CLI, don't report warnings as they are already reported.
	const reportWarnings = !isLaunchedFromCli(process.env);
	return parseAndValidate(args, reportWarnings);
}

/**
 * Use this to parse raw code CLI process.argv such as: `Electron cli.js . --verbose --wait`
 */
export function parseCLIProcessArgv(processArgv: string[]): NativeParsedArgs {
	let [, , ...args] = processArgv; // remove the first non-option argument: it's always the app location

	// If dev, remove the first non-option argument: it's the app location
	if (process.env['VSCODE_DEV']) {
		args = stripAppPath(args) || [];
	}

	return parseAndValidate(args, true);
}

export function addArg(argv: string[], ...args: string[]): string[] {
	const endOfArgsMarkerIndex = argv.indexOf('--');
	if (endOfArgsMarkerIndex === -1) {
		argv.push(...args);
	} else {
		// if the we have an argument "--" (end of argument marker)
		// we cannot add arguments at the end. rather, we add
		// arguments before the "--" marker.
		argv.splice(endOfArgsMarkerIndex, 0, ...args);
	}

	return argv;
}

export function isLaunchedFromCli(env: IProcessEnvironment): boolean {
	return env['VSCODE_CLI'] === '1';
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/environment/node/environmentService.ts]---
Location: vscode-main/src/vs/platform/environment/node/environmentService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { homedir, tmpdir } from 'os';
import { NativeParsedArgs } from '../common/argv.js';
import { IDebugParams } from '../common/environment.js';
import { AbstractNativeEnvironmentService, parseDebugParams } from '../common/environmentService.js';
import { getUserDataPath } from './userDataPath.js';
import { IProductService } from '../../product/common/productService.js';

export class NativeEnvironmentService extends AbstractNativeEnvironmentService {

	constructor(args: NativeParsedArgs, productService: IProductService) {
		super(args, {
			homeDir: homedir(),
			tmpDir: tmpdir(),
			userDataDir: getUserDataPath(args, productService.nameShort)
		}, productService);
	}
}

export function parsePtyHostDebugPort(args: NativeParsedArgs, isBuilt: boolean): IDebugParams {
	return parseDebugParams(args['inspect-ptyhost'], args['inspect-brk-ptyhost'], 5877, isBuilt, args.extensionEnvironment);
}

export function parseSharedProcessDebugPort(args: NativeParsedArgs, isBuilt: boolean): IDebugParams {
	return parseDebugParams(args['inspect-sharedprocess'], args['inspect-brk-sharedprocess'], 5879, isBuilt, args.extensionEnvironment);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/environment/node/stdin.ts]---
Location: vscode-main/src/vs/platform/environment/node/stdin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import { tmpdir } from 'os';
import { Queue } from '../../../base/common/async.js';
import { randomPath } from '../../../base/common/extpath.js';
import { resolveTerminalEncoding } from '../../../base/node/terminalEncoding.js';

export function hasStdinWithoutTty() {
	try {
		return !process.stdin.isTTY; // Via https://twitter.com/MylesBorins/status/782009479382626304
	} catch {
		// Windows workaround for https://github.com/nodejs/node/issues/11656
	}
	return false;
}

export function stdinDataListener(durationinMs: number): Promise<boolean> {
	return new Promise(resolve => {
		const dataListener = () => resolve(true);

		// wait for 1s maximum...
		setTimeout(() => {
			process.stdin.removeListener('data', dataListener);

			resolve(false);
		}, durationinMs);

		// ...but finish early if we detect data
		process.stdin.once('data', dataListener);
	});
}

export function getStdinFilePath(): string {
	return randomPath(tmpdir(), 'code-stdin', 3);
}

async function createStdInFile(targetPath: string) {
	await fs.promises.appendFile(targetPath, '');
	await fs.promises.chmod(targetPath, 0o600); // Ensure the file is only read/writable by the user: https://github.com/microsoft/vscode-remote-release/issues/9048
}

export async function readFromStdin(targetPath: string, verbose: boolean, onEnd?: Function): Promise<void> {

	let [encoding, iconv] = await Promise.all([
		resolveTerminalEncoding(verbose),		// respect terminal encoding when piping into file
		import('@vscode/iconv-lite-umd'),		// lazy load encoding module for usage
		createStdInFile(targetPath) 			// make sure file exists right away (https://github.com/microsoft/vscode/issues/155341)
	]);

	if (!iconv.default.encodingExists(encoding)) {
		console.log(`Unsupported terminal encoding: ${encoding}, falling back to UTF-8.`);
		encoding = 'utf8';
	}

	// Use a `Queue` to be able to use `appendFile`
	// which helps file watchers to be aware of the
	// changes because each append closes the underlying
	// file descriptor.
	// (https://github.com/microsoft/vscode/issues/148952)

	const appendFileQueue = new Queue();

	const decoder = iconv.default.getDecoder(encoding);

	process.stdin.on('data', chunk => {
		const chunkStr = decoder.write(chunk);
		appendFileQueue.queue(() => fs.promises.appendFile(targetPath, chunkStr));
	});

	process.stdin.on('end', () => {
		const end = decoder.end();

		appendFileQueue.queue(async () => {
			try {
				if (typeof end === 'string') {
					await fs.promises.appendFile(targetPath, end);
				}
			} finally {
				onEnd?.();
			}
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/environment/node/userDataPath.ts]---
Location: vscode-main/src/vs/platform/environment/node/userDataPath.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { homedir } from 'os';
import { NativeParsedArgs } from '../common/argv.js';

// This file used to be a pure JS file and was always
// importing `path` from node.js even though we ship
// our own version of the library and prefer to use
// that.
// However, resolution of user-data-path is critical
// and while our version of `path` is a copy of node.js
// one, you never know. As such, preserve the use of
// the built-in `path` lib for the time being.
// eslint-disable-next-line local/code-import-patterns
import { resolve, isAbsolute, join } from 'path';

const cwd = process.env['VSCODE_CWD'] || process.cwd();

/**
 * Returns the user data path to use with some rules:
 * - respect portable mode
 * - respect VSCODE_APPDATA environment variable
 * - respect --user-data-dir CLI argument
 */
export function getUserDataPath(cliArgs: NativeParsedArgs, productName: string): string {
	const userDataPath = doGetUserDataPath(cliArgs, productName);
	const pathsToResolve = [userDataPath];

	// If the user-data-path is not absolute, make
	// sure to resolve it against the passed in
	// current working directory. We cannot use the
	// node.js `path.resolve()` logic because it will
	// not pick up our `VSCODE_CWD` environment variable
	// (https://github.com/microsoft/vscode/issues/120269)
	if (!isAbsolute(userDataPath)) {
		pathsToResolve.unshift(cwd);
	}

	return resolve(...pathsToResolve);
}

function doGetUserDataPath(cliArgs: NativeParsedArgs, productName: string): string {

	// 0. Running out of sources has a fixed productName
	if (process.env['VSCODE_DEV']) {
		productName = 'code-oss-dev';
	}

	// 1. Support portable mode
	const portablePath = process.env['VSCODE_PORTABLE'];
	if (portablePath) {
		return join(portablePath, 'user-data');
	}

	// 2. Support global VSCODE_APPDATA environment variable
	let appDataPath = process.env['VSCODE_APPDATA'];
	if (appDataPath) {
		return join(appDataPath, productName);
	}

	// With Electron>=13 --user-data-dir switch will be propagated to
	// all processes https://github.com/electron/electron/blob/1897b14af36a02e9aa7e4d814159303441548251/shell/browser/electron_browser_client.cc#L546-L553
	// Check VSCODE_PORTABLE and VSCODE_APPDATA before this case to get correct values.
	// 3. Support explicit --user-data-dir
	const cliPath = cliArgs['user-data-dir'];
	if (cliPath) {
		return cliPath;
	}

	// 4. Otherwise check per platform
	switch (process.platform) {
		case 'win32':
			appDataPath = process.env['APPDATA'];
			if (!appDataPath) {
				const userProfile = process.env['USERPROFILE'];
				if (typeof userProfile !== 'string') {
					throw new Error('Windows: Unexpected undefined %USERPROFILE% environment variable');
				}

				appDataPath = join(userProfile, 'AppData', 'Roaming');
			}
			break;
		case 'darwin':
			appDataPath = join(homedir(), 'Library', 'Application Support');
			break;
		case 'linux':
			appDataPath = process.env['XDG_CONFIG_HOME'] || join(homedir(), '.config');
			break;
		default:
			throw new Error('Platform not supported');
	}

	return join(appDataPath, productName);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/environment/node/wait.ts]---
Location: vscode-main/src/vs/platform/environment/node/wait.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { randomPath } from '../../../base/common/extpath.js';

export function createWaitMarkerFileSync(verbose?: boolean): string | undefined {
	const randomWaitMarkerPath = randomPath(tmpdir());

	try {
		writeFileSync(randomWaitMarkerPath, ''); // use built-in fs to avoid dragging in more dependencies
		if (verbose) {
			console.log(`Marker file for --wait created: ${randomWaitMarkerPath}`);
		}
		return randomWaitMarkerPath;
	} catch (err) {
		if (verbose) {
			console.error(`Failed to create marker file for --wait: ${err}`);
		}
		return undefined;
	}
}
```

--------------------------------------------------------------------------------

````
