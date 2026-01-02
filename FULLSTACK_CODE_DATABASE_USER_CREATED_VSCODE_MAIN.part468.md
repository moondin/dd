---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 468
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 468 of 552)

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

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/test/browser/commandLineAutoApprover.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/test/browser/commandLineAutoApprover.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { OperatingSystem } from '../../../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import type { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { workbenchInstantiationService } from '../../../../../test/browser/workbenchTestServices.js';
import { TerminalChatAgentToolsSettingId } from '../../common/terminalChatAgentToolsConfiguration.js';
import { CommandLineAutoApprover } from '../../browser/commandLineAutoApprover.js';
import { ConfigurationTarget } from '../../../../../../platform/configuration/common/configuration.js';
import { ok, strictEqual } from 'assert';

suite('CommandLineAutoApprover', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: IInstantiationService;
	let configurationService: TestConfigurationService;

	let commandLineAutoApprover: CommandLineAutoApprover;
	let shell: string;
	let os: OperatingSystem;

	setup(() => {
		configurationService = new TestConfigurationService();
		instantiationService = workbenchInstantiationService({
			configurationService: () => configurationService
		}, store);

		shell = 'bash';
		os = OperatingSystem.Linux;
		commandLineAutoApprover = store.add(instantiationService.createInstance(CommandLineAutoApprover));
	});

	function setAutoApprove(value: { [key: string]: boolean }) {
		setConfig(TerminalChatAgentToolsSettingId.AutoApprove, value);
	}

	function setAutoApproveWithCommandLine(value: { [key: string]: { approve: boolean; matchCommandLine?: boolean } | boolean }) {
		setConfig(TerminalChatAgentToolsSettingId.AutoApprove, value);
	}

	function setConfig(key: string, value: unknown) {
		configurationService.setUserConfiguration(key, value);
		configurationService.onDidChangeConfigurationEmitter.fire({
			affectsConfiguration: () => true,
			affectedKeys: new Set([key]),
			source: ConfigurationTarget.USER,
			change: null!,
		});
	}

	function isAutoApproved(commandLine: string): boolean {
		return commandLineAutoApprover.isCommandAutoApproved(commandLine, shell, os).result === 'approved';
	}

	function isCommandLineAutoApproved(commandLine: string): boolean {
		return commandLineAutoApprover.isCommandLineAutoApproved(commandLine).result === 'approved';
	}

	suite('autoApprove with allow patterns only', () => {
		test('should auto-approve exact command match', () => {
			setAutoApprove({
				'echo': true
			});
			ok(isAutoApproved('echo'));
		});

		test('should auto-approve command with arguments', () => {
			setAutoApprove({
				'echo': true
			});
			ok(isAutoApproved('echo hello world'));
		});

		test('should not auto-approve when there is no match', () => {
			setAutoApprove({
				'echo': true
			});
			ok(!isAutoApproved('ls'));
		});

		test('should not auto-approve partial command matches', () => {
			setAutoApprove({
				'echo': true
			});
			ok(!isAutoApproved('echotest'));
		});

		test('should handle multiple commands in autoApprove', () => {
			setAutoApprove({
				'echo': true,
				'ls': true,
				'pwd': true
			});
			ok(isAutoApproved('echo'));
			ok(isAutoApproved('ls -la'));
			ok(isAutoApproved('pwd'));
			ok(!isAutoApproved('rm'));
		});
	});

	suite('autoApprove with deny patterns only', () => {
		test('should deny commands in autoApprove', () => {
			setAutoApprove({
				'rm': false,
				'del': false
			});
			ok(!isAutoApproved('rm file.txt'));
			ok(!isAutoApproved('del file.txt'));
		});

		test('should not auto-approve safe commands when no allow patterns are present', () => {
			setAutoApprove({
				'rm': false
			});
			ok(!isAutoApproved('echo hello'));
			ok(!isAutoApproved('ls'));
		});
	});

	suite('autoApprove with mixed allow and deny patterns', () => {
		test('should deny commands set to false even if other commands are set to true', () => {
			setAutoApprove({
				'echo': true,
				'rm': false
			});
			ok(isAutoApproved('echo hello'));
			ok(!isAutoApproved('rm file.txt'));
		});

		test('should auto-approve allow patterns not set to false', () => {
			setAutoApprove({
				'echo': true,
				'ls': true,
				'pwd': true,
				'rm': false,
				'del': false
			});
			ok(isAutoApproved('echo'));
			ok(isAutoApproved('ls'));
			ok(isAutoApproved('pwd'));
			ok(!isAutoApproved('rm'));
			ok(!isAutoApproved('del'));
		});
	});

	suite('regex patterns', () => {
		test('should handle /.*/', () => {
			setAutoApprove({
				'/.*/': true,
			});

			ok(isAutoApproved('echo hello'));
		});

		test('should handle regex patterns in autoApprove', () => {
			setAutoApprove({
				'/^echo/': true,
				'/^ls/': true,
				'pwd': true
			});

			ok(isAutoApproved('echo hello'));
			ok(isAutoApproved('ls -la'));
			ok(isAutoApproved('pwd'));
			ok(!isAutoApproved('rm file'));
		});

		test('should handle regex patterns for deny', () => {
			setAutoApprove({
				'echo': true,
				'rm': true,
				'/^rm\\s+/': false,
				'/^del\\s+/': false
			});

			ok(isAutoApproved('echo hello'));
			ok(isAutoApproved('rm'));
			ok(!isAutoApproved('rm file.txt'));
			ok(!isAutoApproved('del file.txt'));
		});

		test('should handle complex regex patterns', () => {
			setAutoApprove({
				'/^(echo|ls|pwd)\\b/': true,
				'/^git (status|show\\b.*)$/': true,
				'/rm|del|kill/': false
			});

			ok(isAutoApproved('echo test'));
			ok(isAutoApproved('ls -la'));
			ok(isAutoApproved('pwd'));
			ok(isAutoApproved('git status'));
			ok(isAutoApproved('git show'));
			ok(isAutoApproved('git show HEAD'));
			ok(!isAutoApproved('rm file'));
			ok(!isAutoApproved('del file'));
			ok(!isAutoApproved('kill process'));
		});

		suite('flags', () => {
			test('should handle case-insensitive regex patterns with i flag', () => {
				setAutoApprove({
					'/^echo/i': true,
					'/^ls/i': true,
					'/rm|del/i': false
				});

				ok(isAutoApproved('echo hello'));
				ok(isAutoApproved('ECHO hello'));
				ok(isAutoApproved('Echo hello'));
				ok(isAutoApproved('ls -la'));
				ok(isAutoApproved('LS -la'));
				ok(isAutoApproved('Ls -la'));
				ok(!isAutoApproved('rm file'));
				ok(!isAutoApproved('RM file'));
				ok(!isAutoApproved('del file'));
				ok(!isAutoApproved('DEL file'));
			});

			test('should handle multiple regex flags', () => {
				setAutoApprove({
					'/^git\\s+/gim': true,
					'/dangerous/gim': false
				});

				ok(isAutoApproved('git status'));
				ok(isAutoApproved('GIT status'));
				ok(isAutoApproved('Git status'));
				ok(!isAutoApproved('dangerous command'));
				ok(!isAutoApproved('DANGEROUS command'));
			});

			test('should handle various regex flags', () => {
				setAutoApprove({
					'/^echo.*/s': true,  // dotall flag
					'/^git\\s+/i': true, // case-insensitive flag
					'/rm|del/g': false   // global flag
				});

				ok(isAutoApproved('echo hello\nworld'));
				ok(isAutoApproved('git status'));
				ok(isAutoApproved('GIT status'));
				ok(!isAutoApproved('rm file'));
				ok(!isAutoApproved('del file'));
			});

			test('should handle regex patterns without flags', () => {
				setAutoApprove({
					'/^echo/': true,
					'/rm|del/': false
				});

				ok(isAutoApproved('echo hello'));
				ok(!isAutoApproved('ECHO hello'), 'Should be case-sensitive without i flag');
				ok(!isAutoApproved('rm file'));
				ok(!isAutoApproved('RM file'), 'Should be case-sensitive without i flag');
			});
		});
	});

	suite('edge cases', () => {
		test('should handle empty autoApprove', () => {
			setAutoApprove({});

			ok(!isAutoApproved('echo hello'));
			ok(!isAutoApproved('ls'));
			ok(!isAutoApproved('rm file'));
		});

		test('should handle empty command strings', () => {
			setAutoApprove({
				'echo': true
			});

			ok(!isAutoApproved(''));
			ok(!isAutoApproved('   '));
		});

		test('should handle whitespace in commands', () => {
			setAutoApprove({
				'echo': true
			});

			ok(isAutoApproved('echo   hello   world'));
		});

		test('should be case-sensitive by default', () => {
			setAutoApprove({
				'echo': true
			});

			ok(isAutoApproved('echo hello'));
			ok(!isAutoApproved('ECHO hello'));
			ok(!isAutoApproved('Echo hello'));
		});

		// https://github.com/microsoft/vscode/issues/252411
		test('should handle string-based values with special regex characters', () => {
			setAutoApprove({
				'pwsh.exe -File D:\\foo.bar\\a-script.ps1': true
			});

			ok(isAutoApproved('pwsh.exe -File D:\\foo.bar\\a-script.ps1'));
			ok(isAutoApproved('pwsh.exe -File D:\\foo.bar\\a-script.ps1 -AnotherArg'));
		});

		test('should ignore the empty string key', () => {
			setAutoApprove({
				'': true
			});

			ok(!isAutoApproved('echo hello'));
		});

		test('should handle empty regex patterns that could cause endless loops', () => {
			setAutoApprove({
				'//': true,
				'/(?:)/': true,
				'/*/': true,            // Invalid regex pattern
				'/.**/': true           // Invalid regex pattern
			});

			// These patterns should not cause endless loops and should not match any commands
			// Invalid patterns should be handled gracefully and not match anything
			ok(!isAutoApproved('echo hello'));
			ok(!isAutoApproved('ls'));
			ok(!isAutoApproved(''));
		});

		test('should handle regex patterns that would cause endless loops', () => {
			setAutoApprove({
				'/a*/': true,
				'/b?/': true,
				'/(x|)*/': true,
				'/(?:)*/': true
			});

			// Commands should still work normally, endless loop patterns should be safely handled
			ok(!isAutoApproved('echo hello'));
			ok(!isAutoApproved('ls'));
			ok(!isAutoApproved('a'));
			ok(!isAutoApproved('b'));
		});

		test('should handle mixed valid and problematic regex patterns', () => {
			setAutoApprove({
				'/^echo/': true,        // Valid pattern
				'//': true,             // Empty pattern
				'/^ls/': true,          // Valid pattern
				'/a*/': true,           // Potential endless loop
				'pwd': true             // Valid string pattern
			});

			ok(isAutoApproved('echo hello'));
			ok(isAutoApproved('ls -la'));
			ok(isAutoApproved('pwd'));
			ok(!isAutoApproved('rm file'));
		});

		test('should handle invalid regex patterns gracefully', () => {
			setAutoApprove({
				'/*/': true,                    // Invalid regex - nothing to repeat
				'/(?:+/': true,                 // Invalid regex - incomplete quantifier
				'/[/': true,                    // Invalid regex - unclosed character class
				'/^echo/': true,                // Valid pattern
				'ls': true                      // Valid string pattern
			});

			// Valid patterns should still work
			ok(isAutoApproved('echo hello'));
			ok(isAutoApproved('ls -la'));
			// Invalid patterns should not match anything and not cause crashes
			ok(!isAutoApproved('random command'));
		});
	});

	suite('path-aware auto approval', () => {
		test('should handle path variations with forward slashes', () => {
			setAutoApprove({
				'bin/foo': true
			});

			// Should approve the exact match
			ok(isAutoApproved('bin/foo'));
			ok(isAutoApproved('bin/foo --arg'));

			// Should approve with Windows backslashes
			ok(isAutoApproved('bin\\foo'));
			ok(isAutoApproved('bin\\foo --arg'));

			// Should approve with current directory prefixes
			ok(isAutoApproved('./bin/foo'));
			ok(isAutoApproved('.\\bin/foo'));
			ok(isAutoApproved('./bin\\foo'));
			ok(isAutoApproved('.\\bin\\foo'));

			// Should not approve partial matches
			ok(!isAutoApproved('bin/foobar'));
			ok(!isAutoApproved('notbin/foo'));
		});

		test('should handle path variations with backslashes', () => {
			setAutoApprove({
				'bin\\script.bat': true
			});

			// Should approve the exact match
			ok(isAutoApproved('bin\\script.bat'));
			ok(isAutoApproved('bin\\script.bat --help'));

			// Should approve with forward slashes
			ok(isAutoApproved('bin/script.bat'));
			ok(isAutoApproved('bin/script.bat --help'));

			// Should approve with current directory prefixes
			ok(isAutoApproved('./bin\\script.bat'));
			ok(isAutoApproved('.\\bin\\script.bat'));
			ok(isAutoApproved('./bin/script.bat'));
			ok(isAutoApproved('.\\bin/script.bat'));
		});

		test('should handle deep paths', () => {
			setAutoApprove({
				'src/utils/helper.js': true
			});

			ok(isAutoApproved('src/utils/helper.js'));
			ok(isAutoApproved('src\\utils\\helper.js'));
			ok(isAutoApproved('src/utils\\helper.js'));
			ok(isAutoApproved('src\\utils/helper.js'));
			ok(isAutoApproved('./src/utils/helper.js'));
			ok(isAutoApproved('.\\src\\utils\\helper.js'));
		});

		test('should not treat non-paths as paths', () => {
			setAutoApprove({
				'echo': true,  // Not a path
				'ls': true,    // Not a path
				'git': true    // Not a path
			});

			// These should work as normal command matching, not path matching
			ok(isAutoApproved('echo'));
			ok(isAutoApproved('ls'));
			ok(isAutoApproved('git'));

			// Should not be treated as paths, so these prefixes shouldn't work
			ok(!isAutoApproved('./echo'));
			ok(!isAutoApproved('.\\ls'));
		});

		test('should handle paths with mixed separators in config', () => {
			setAutoApprove({
				'bin/foo\\bar': true  // Mixed separators in config
			});

			ok(isAutoApproved('bin/foo\\bar'));
			ok(isAutoApproved('bin\\foo/bar'));
			ok(isAutoApproved('bin/foo/bar'));
			ok(isAutoApproved('bin\\foo\\bar'));
			ok(isAutoApproved('./bin/foo\\bar'));
			ok(isAutoApproved('.\\bin\\foo\\bar'));
		});

		test('should work with command line auto approval for paths', () => {
			setAutoApproveWithCommandLine({
				'bin/deploy': { approve: true, matchCommandLine: true }
			});

			ok(isCommandLineAutoApproved('bin/deploy --prod'));
			ok(isCommandLineAutoApproved('bin\\deploy --prod'));
			ok(isCommandLineAutoApproved('./bin/deploy --prod'));
			ok(isCommandLineAutoApproved('.\\bin\\deploy --prod'));
		});

		test('should handle special characters in paths', () => {
			setAutoApprove({
				'bin/my-script.sh': true,
				'scripts/build_all.py': true,
				'tools/run (debug).exe': true
			});

			ok(isAutoApproved('bin/my-script.sh'));
			ok(isAutoApproved('bin\\my-script.sh'));
			ok(isAutoApproved('./bin/my-script.sh'));

			ok(isAutoApproved('scripts/build_all.py'));
			ok(isAutoApproved('scripts\\build_all.py'));

			ok(isAutoApproved('tools/run (debug).exe'));
			ok(isAutoApproved('tools\\run (debug).exe'));
		});
	});

	suite('PowerShell-specific commands', () => {
		setup(() => {
			shell = 'pwsh';
		});

		test('should handle Windows PowerShell commands', () => {
			setAutoApprove({
				'Get-ChildItem': true,
				'Get-Content': true,
				'Get-Location': true,
				'Remove-Item': false,
				'del': false
			});

			ok(isAutoApproved('Get-ChildItem'));
			ok(isAutoApproved('Get-Content file.txt'));
			ok(isAutoApproved('Get-Location'));
			ok(!isAutoApproved('Remove-Item file.txt'));
		});

		test('should handle ( prefixes', () => {
			setAutoApprove({
				'Get-Content': true
			});

			ok(isAutoApproved('Get-Content file.txt'));
			ok(isAutoApproved('(Get-Content file.txt'));
			ok(!isAutoApproved('[Get-Content'));
			ok(!isAutoApproved('foo'));
		});

		test('should be case-insensitive for PowerShell commands', () => {
			setAutoApprove({
				'Get-ChildItem': true,
				'Get-Content': true,
				'Remove-Item': false
			});

			ok(isAutoApproved('Get-ChildItem'));
			ok(isAutoApproved('get-childitem'));
			ok(isAutoApproved('GET-CHILDITEM'));
			ok(isAutoApproved('Get-childitem'));
			ok(isAutoApproved('get-ChildItem'));

			ok(isAutoApproved('Get-Content file.txt'));
			ok(isAutoApproved('get-content file.txt'));
			ok(isAutoApproved('GET-CONTENT file.txt'));
			ok(isAutoApproved('Get-content file.txt'));

			ok(!isAutoApproved('Remove-Item file.txt'));
			ok(!isAutoApproved('remove-item file.txt'));
			ok(!isAutoApproved('REMOVE-ITEM file.txt'));
			ok(!isAutoApproved('Remove-item file.txt'));
		});

		test('should be case-insensitive for PowerShell aliases', () => {
			setAutoApprove({
				'ls': true,
				'dir': true,
				'rm': false,
				'del': false
			});

			// Test case-insensitive matching for aliases
			ok(isAutoApproved('ls'));
			ok(isAutoApproved('LS'));
			ok(isAutoApproved('Ls'));

			ok(isAutoApproved('dir'));
			ok(isAutoApproved('DIR'));
			ok(isAutoApproved('Dir'));

			ok(!isAutoApproved('rm file.txt'));
			ok(!isAutoApproved('RM file.txt'));
			ok(!isAutoApproved('Rm file.txt'));

			ok(!isAutoApproved('del file.txt'));
			ok(!isAutoApproved('DEL file.txt'));
			ok(!isAutoApproved('Del file.txt'));
		});

		test('should be case-insensitive with regex patterns', () => {
			setAutoApprove({
				'/^Get-/': true,
				'/Remove-Item|rm/': false
			});

			ok(isAutoApproved('Get-ChildItem'));
			ok(isAutoApproved('get-childitem'));
			ok(isAutoApproved('GET-PROCESS'));
			ok(isAutoApproved('Get-Location'));

			ok(!isAutoApproved('Remove-Item file.txt'));
			ok(!isAutoApproved('remove-item file.txt'));
			ok(!isAutoApproved('rm file.txt'));
			ok(!isAutoApproved('RM file.txt'));
		});

		test('should handle case-insensitive PowerShell commands on different OS', () => {
			setAutoApprove({
				'Get-Process': true,
				'Stop-Process': false
			});

			for (const currnetOS of [OperatingSystem.Windows, OperatingSystem.Linux, OperatingSystem.Macintosh]) {
				os = currnetOS;
				ok(isAutoApproved('Get-Process'), `os=${os}`);
				ok(isAutoApproved('get-process'), `os=${os}`);
				ok(isAutoApproved('GET-PROCESS'), `os=${os}`);
				ok(!isAutoApproved('Stop-Process'), `os=${os}`);
				ok(!isAutoApproved('stop-process'), `os=${os}`);
			}
		});
	});

	suite('isCommandLineAutoApproved - matchCommandLine functionality', () => {
		test('should auto-approve command line patterns with matchCommandLine: true', () => {
			setAutoApproveWithCommandLine({
				'echo': { approve: true, matchCommandLine: true }
			});

			ok(isCommandLineAutoApproved('echo hello'));
			ok(isCommandLineAutoApproved('echo test && ls'));
		});

		test('should not auto-approve regular patterns with isCommandLineAutoApproved', () => {
			setAutoApprove({
				'echo': true
			});

			// Regular patterns should not be matched by isCommandLineAutoApproved
			ok(!isCommandLineAutoApproved('echo hello'));
		});

		test('should handle regex patterns with matchCommandLine: true', () => {
			setAutoApproveWithCommandLine({
				'/echo.*world/': { approve: true, matchCommandLine: true }
			});

			ok(isCommandLineAutoApproved('echo hello world'));
			ok(!isCommandLineAutoApproved('echo hello'));
		});

		test('should handle case-insensitive regex with matchCommandLine: true', () => {
			setAutoApproveWithCommandLine({
				'/echo/i': { approve: true, matchCommandLine: true }
			});

			ok(isCommandLineAutoApproved('echo hello'));
			ok(isCommandLineAutoApproved('ECHO hello'));
			ok(isCommandLineAutoApproved('Echo hello'));
		});

		test('should handle complex command line patterns', () => {
			setAutoApproveWithCommandLine({
				'/^npm run build/': { approve: true, matchCommandLine: true },
				'/\.ps1/i': { approve: true, matchCommandLine: true }
			});

			ok(isCommandLineAutoApproved('npm run build --production'));
			ok(isCommandLineAutoApproved('powershell -File script.ps1'));
			ok(isCommandLineAutoApproved('pwsh -File SCRIPT.PS1'));
			ok(!isCommandLineAutoApproved('npm install'));
		});

		test('should return false for empty command line', () => {
			setAutoApproveWithCommandLine({
				'echo': { approve: true, matchCommandLine: true }
			});

			ok(!isCommandLineAutoApproved(''));
			ok(!isCommandLineAutoApproved('   '));
		});

		test('should handle mixed configuration with matchCommandLine entries', () => {
			setAutoApproveWithCommandLine({
				'echo': true,  // Regular pattern
				'ls': { approve: true, matchCommandLine: true },  // Command line pattern
				'rm': { approve: true, matchCommandLine: false }  // Explicit regular pattern
			});

			// Only the matchCommandLine: true entry should work with isCommandLineAutoApproved
			ok(isCommandLineAutoApproved('ls -la'));
			ok(!isCommandLineAutoApproved('echo hello'));
			ok(!isCommandLineAutoApproved('rm file.txt'));
		});

		test('should handle deny patterns with matchCommandLine: true', () => {
			setAutoApproveWithCommandLine({
				'echo': { approve: true, matchCommandLine: true },
				'/dangerous/': { approve: false, matchCommandLine: true }
			});

			ok(isCommandLineAutoApproved('echo hello'));
			ok(!isCommandLineAutoApproved('echo dangerous command'));
			ok(!isCommandLineAutoApproved('dangerous operation'));
		});

		test('should prioritize deny list over allow list for command line patterns', () => {
			setAutoApproveWithCommandLine({
				'/echo/': { approve: true, matchCommandLine: true },
				'/echo.*dangerous/': { approve: false, matchCommandLine: true }
			});

			ok(isCommandLineAutoApproved('echo hello'));
			ok(!isCommandLineAutoApproved('echo dangerous command'));
		});

		test('should handle complex deny patterns with matchCommandLine', () => {
			setAutoApproveWithCommandLine({
				'npm': { approve: true, matchCommandLine: true },
				'/npm.*--force/': { approve: false, matchCommandLine: true },
				'/\.ps1.*-ExecutionPolicy/i': { approve: false, matchCommandLine: true }
			});

			ok(isCommandLineAutoApproved('npm install'));
			ok(isCommandLineAutoApproved('npm run build'));
			ok(!isCommandLineAutoApproved('npm install --force'));
			ok(!isCommandLineAutoApproved('powershell -File script.ps1 -ExecutionPolicy Bypass'));
		});

		test('should handle empty regex patterns with matchCommandLine that could cause endless loops', () => {
			setAutoApproveWithCommandLine({
				'//': { approve: true, matchCommandLine: true },
				'/(?:)/': { approve: true, matchCommandLine: true },
				'/*/': { approve: true, matchCommandLine: true },            // Invalid regex pattern
				'/.**/': { approve: true, matchCommandLine: true }           // Invalid regex pattern
			});

			// These patterns should not cause endless loops and should not match any commands
			// Invalid patterns should be handled gracefully and not match anything
			ok(!isCommandLineAutoApproved('echo hello'));
			ok(!isCommandLineAutoApproved('ls'));
			ok(!isCommandLineAutoApproved(''));
		});

		test('should handle regex patterns with matchCommandLine that would cause endless loops', () => {
			setAutoApproveWithCommandLine({
				'/a*/': { approve: true, matchCommandLine: true },
				'/b?/': { approve: true, matchCommandLine: true },
				'/(x|)*/': { approve: true, matchCommandLine: true },
				'/(?:)*/': { approve: true, matchCommandLine: true }
			});

			// Commands should still work normally, endless loop patterns should be safely handled
			ok(!isCommandLineAutoApproved('echo hello'));
			ok(!isCommandLineAutoApproved('ls'));
			ok(!isCommandLineAutoApproved('a'));
			ok(!isCommandLineAutoApproved('b'));
		});

		test('should handle mixed valid and problematic regex patterns with matchCommandLine', () => {
			setAutoApproveWithCommandLine({
				'/^echo/': { approve: true, matchCommandLine: true },        // Valid pattern
				'//': { approve: true, matchCommandLine: true },             // Empty pattern
				'/^ls/': { approve: true, matchCommandLine: true },          // Valid pattern
				'/a*/': { approve: true, matchCommandLine: true },           // Potential endless loop
				'pwd': { approve: true, matchCommandLine: true }             // Valid string pattern
			});

			ok(isCommandLineAutoApproved('echo hello'));
			ok(isCommandLineAutoApproved('ls -la'));
			ok(isCommandLineAutoApproved('pwd'));
			ok(!isCommandLineAutoApproved('rm file'));
		});

		test('should handle invalid regex patterns with matchCommandLine gracefully', () => {
			setAutoApproveWithCommandLine({
				'/*/': { approve: true, matchCommandLine: true },                    // Invalid regex - nothing to repeat
				'/(?:+/': { approve: true, matchCommandLine: true },                 // Invalid regex - incomplete quantifier
				'/[/': { approve: true, matchCommandLine: true },                    // Invalid regex - unclosed character class
				'/^echo/': { approve: true, matchCommandLine: true },                // Valid pattern
				'ls': { approve: true, matchCommandLine: true }                      // Valid string pattern
			});

			// Valid patterns should still work
			ok(isCommandLineAutoApproved('echo hello'));
			ok(isCommandLineAutoApproved('ls -la'));
			// Invalid patterns should not match anything and not cause crashes
			ok(!isCommandLineAutoApproved('random command'));
		});
	});

	suite('reasons', () => {
		function getCommandReason(command: string): string {
			return commandLineAutoApprover.isCommandAutoApproved(command, shell, os).reason;
		}

		function getCommandLineReason(commandLine: string): string {
			return commandLineAutoApprover.isCommandLineAutoApproved(commandLine).reason;
		}

		suite('command', () => {
			test('approved', () => {
				setAutoApprove({ echo: true });
				strictEqual(getCommandReason('echo hello'), `Command 'echo hello' is approved by allow list rule: echo`);
			});
			test('not approved', () => {
				setAutoApprove({ echo: false });
				strictEqual(getCommandReason('echo hello'), `Command 'echo hello' is denied by deny list rule: echo`);
			});
			test('no match', () => {
				setAutoApprove({});
				strictEqual(getCommandReason('echo hello'), `Command 'echo hello' has no matching auto approve entries`);
			});
		});

		suite('command line', () => {
			test('approved', () => {
				setAutoApproveWithCommandLine({ echo: { approve: true, matchCommandLine: true } });
				strictEqual(getCommandLineReason('echo hello'), `Command line 'echo hello' is approved by allow list rule: echo`);
			});
			test('not approved', () => {
				setAutoApproveWithCommandLine({ echo: { approve: false, matchCommandLine: true } });
				strictEqual(getCommandLineReason('echo hello'), `Command line 'echo hello' is denied by deny list rule: echo`);
			});
			test('no match', () => {
				setAutoApproveWithCommandLine({});
				strictEqual(getCommandLineReason('echo hello'), `Command line 'echo hello' has no matching auto approve entries`);
			});
		});
	});

	suite('isDefaultRule logic', () => {
		function getIsDefaultRule(command: string): boolean | undefined {
			return commandLineAutoApprover.isCommandAutoApproved(command, shell, os).rule?.isDefaultRule;
		}

		function getCommandLineIsDefaultRule(commandLine: string): boolean | undefined {
			return commandLineAutoApprover.isCommandLineAutoApproved(commandLine).rule?.isDefaultRule;
		}

		function setAutoApproveWithDefaults(userConfig: { [key: string]: boolean }, defaultConfig: { [key: string]: boolean }) {
			// Set up mock configuration with default values
			configurationService.setUserConfiguration(TerminalChatAgentToolsSettingId.AutoApprove, userConfig);

			// Mock the inspect method to return default values
			const originalInspect = configurationService.inspect;
			const originalGetValue = configurationService.getValue;

			configurationService.inspect = (key: string): any => {
				if (key === TerminalChatAgentToolsSettingId.AutoApprove) {
					return {
						default: { value: defaultConfig },
						user: { value: userConfig },
						workspace: undefined,
						workspaceFolder: undefined,
						application: undefined,
						policy: undefined,
						memory: undefined,
						value: { ...defaultConfig, ...userConfig }
					};
				}
				return originalInspect.call(configurationService, key);
			};

			configurationService.getValue = (key: string): any => {
				if (key === TerminalChatAgentToolsSettingId.AutoApprove) {
					return { ...defaultConfig, ...userConfig };
				}
				return originalGetValue.call(configurationService, key);
			};

			// Trigger configuration update
			configurationService.onDidChangeConfigurationEmitter.fire({
				affectsConfiguration: () => true,
				affectedKeys: new Set([TerminalChatAgentToolsSettingId.AutoApprove]),
				source: ConfigurationTarget.USER,
				change: null!,
			});
		}

		function setAutoApproveWithDefaultsCommandLine(
			userConfig: { [key: string]: { approve: boolean; matchCommandLine?: boolean } | boolean },
			defaultConfig: { [key: string]: { approve: boolean; matchCommandLine?: boolean } | boolean }
		) {
			// Set up mock configuration with default values for command line rules
			configurationService.setUserConfiguration(TerminalChatAgentToolsSettingId.AutoApprove, userConfig);

			// Mock the inspect method to return default values
			const originalInspect = configurationService.inspect;
			const originalGetValue = configurationService.getValue;

			configurationService.inspect = <T>(key: string): any => {
				if (key === TerminalChatAgentToolsSettingId.AutoApprove) {
					return {
						default: { value: defaultConfig },
						user: { value: userConfig },
						workspace: undefined,
						workspaceFolder: undefined,
						application: undefined,
						policy: undefined,
						memory: undefined,
						value: { ...defaultConfig, ...userConfig }
					};
				}
				return originalInspect.call(configurationService, key);
			};

			configurationService.getValue = (key: string): any => {
				if (key === TerminalChatAgentToolsSettingId.AutoApprove) {
					return { ...defaultConfig, ...userConfig };
				}
				return originalGetValue.call(configurationService, key);
			};

			// Trigger configuration update
			configurationService.onDidChangeConfigurationEmitter.fire({
				affectsConfiguration: () => true,
				affectedKeys: new Set([TerminalChatAgentToolsSettingId.AutoApprove]),
				source: ConfigurationTarget.USER,
				change: null!,
			});
		}

		test('should correctly identify default rules vs user-defined rules', () => {
			setAutoApproveWithDefaults(
				{ 'echo': true, 'ls': true, 'pwd': false },
				{ 'echo': true, 'cat': true }
			);

			strictEqual(getIsDefaultRule('echo hello'), true, 'echo is in both default and user config with same value - should be marked as default');
			strictEqual(getIsDefaultRule('ls -la'), false, 'ls is only in user config - should be marked as user-defined');
			strictEqual(getIsDefaultRule('pwd'), false, 'pwd is only in user config - should be marked as user-defined');
			strictEqual(getIsDefaultRule('cat file.txt'), true, 'cat is in both default and user config with same value - should be marked as default');
		});

		test('should mark as default when command is only in default config but not in user config', () => {
			setAutoApproveWithDefaults(
				{ 'echo': true, 'ls': true },  // User config (cat is NOT here)
				{ 'echo': true, 'cat': true }  // Default config (cat IS here)
			);

			// Test that merged config includes all commands
			strictEqual(commandLineAutoApprover.isCommandAutoApproved('echo', shell, os).result, 'approved', 'echo should be approved');
			strictEqual(commandLineAutoApprover.isCommandAutoApproved('ls', shell, os).result, 'approved', 'ls should be approved');

			// cat should be approved because it's in the merged config
			const catResult = commandLineAutoApprover.isCommandAutoApproved('cat', shell, os);
			strictEqual(catResult.result, 'approved', 'cat should be approved from default config');

			// cat should be marked as default rule since it comes from default config only
			strictEqual(catResult.rule?.isDefaultRule, true, 'cat is only in default config, not in user config - should be marked as default');
		});

		test('should handle default rules with different values', () => {
			setAutoApproveWithDefaults(
				{ 'echo': true, 'rm': true },
				{ 'echo': false, 'rm': true }
			);

			strictEqual(getIsDefaultRule('echo hello'), false, 'echo has different values in default vs user - should be marked as user-defined');
			strictEqual(getIsDefaultRule('rm file.txt'), true, 'rm has same value in both - should be marked as default');
		});

		test('should handle regex patterns as default rules', () => {
			setAutoApproveWithDefaults(
				{ '/^git/': true, '/^npm/': false },
				{ '/^git/': true, '/^docker/': true }
			);

			strictEqual(getIsDefaultRule('git status'), true, 'git pattern matches default - should be marked as default');
			strictEqual(getIsDefaultRule('npm install'), false, 'npm pattern is user-only - should be marked as user-defined');
		});

		test('should handle mixed string and regex patterns', () => {
			setAutoApproveWithDefaults(
				{ 'echo': true, '/^ls/': false },
				{ 'echo': true, 'cat': true }
			);

			strictEqual(getIsDefaultRule('echo hello'), true, 'String pattern matching default');
			strictEqual(getIsDefaultRule('ls -la'), false, 'Regex pattern user-defined');
		});

		test('should handle command line rules with isDefaultRule', () => {
			setAutoApproveWithDefaultsCommandLine(
				{
					'echo': { approve: true, matchCommandLine: true },
					'ls': { approve: false, matchCommandLine: true }
				},
				{
					'echo': { approve: true, matchCommandLine: true },
					'cat': { approve: true, matchCommandLine: true }
				}
			);

			strictEqual(getCommandLineIsDefaultRule('echo hello world'), true, 'echo matches default config exactly using structural equality - should be marked as default');
			strictEqual(getCommandLineIsDefaultRule('ls -la'), false, 'ls is user-defined only - should be marked as user-defined');
		});

		test('should handle command line rules with different matchCommandLine values', () => {
			setAutoApproveWithDefaultsCommandLine(
				{
					'echo': { approve: true, matchCommandLine: true },
					'ls': { approve: true, matchCommandLine: false }
				},
				{
					'echo': { approve: true, matchCommandLine: false },
					'ls': { approve: true, matchCommandLine: false }
				}
			);

			strictEqual(getCommandLineIsDefaultRule('echo hello'), false, 'echo has different matchCommandLine value - should be user-defined');
			strictEqual(getCommandLineIsDefaultRule('ls -la'), undefined, 'ls matches exactly - should be default (but won\'t match command line check since matchCommandLine is false)');
		});

		test('should handle boolean vs object format consistency', () => {
			setAutoApproveWithDefaultsCommandLine(
				{
					'echo': true,
					'ls': { approve: true, matchCommandLine: true }
				},
				{
					'echo': true,
					'ls': { approve: true, matchCommandLine: true }
				}
			);

			strictEqual(getIsDefaultRule('echo hello'), true, 'Boolean format matching - should be default');
			strictEqual(getCommandLineIsDefaultRule('ls -la'), true, 'Object format matching using structural equality - should be default');
		});

		test('should return undefined for noMatch cases', () => {
			setAutoApproveWithDefaults(
				{ 'echo': true },
				{ 'cat': true }
			);

			strictEqual(getIsDefaultRule('unknown-command'), undefined, 'Command that matches neither user nor default config');
			strictEqual(getCommandLineIsDefaultRule('unknown-command'), undefined, 'Command that matches neither user nor default config');
		});

		test('should handle empty configurations', () => {
			setAutoApproveWithDefaults(
				{},
				{}
			);

			strictEqual(getIsDefaultRule('echo hello'), undefined);
			strictEqual(getCommandLineIsDefaultRule('echo hello'), undefined);
		});

		test('should handle only default config with no user overrides', () => {
			setAutoApproveWithDefaults(
				{},
				{ 'echo': true, 'ls': false }
			);

			strictEqual(getIsDefaultRule('echo hello'), true, 'Commands in default config should be marked as default rules even with empty user config');
			strictEqual(getIsDefaultRule('ls -la'), true, 'Commands in default config should be marked as default rules even with empty user config');
		});

		test('should handle complex nested object rules', () => {
			setAutoApproveWithDefaultsCommandLine(
				{
					'npm': { approve: true, matchCommandLine: true },
					'git': { approve: false, matchCommandLine: false }
				},
				{
					'npm': { approve: true, matchCommandLine: true },
					'docker': { approve: true, matchCommandLine: true }
				}
			);

			strictEqual(getCommandLineIsDefaultRule('npm install'), true, 'npm matches default exactly using structural equality - should be default');
			strictEqual(getCommandLineIsDefaultRule('git status'), undefined, 'git is user-defined - should be user-defined (but won\'t match command line since matchCommandLine is false)');
		});

		test('should handle PowerShell case-insensitive matching with defaults', () => {
			shell = 'pwsh';
			os = OperatingSystem.Windows;

			setAutoApproveWithDefaults(
				{ 'Get-Process': true },
				{ 'Get-Process': true }
			);

			strictEqual(getIsDefaultRule('Get-Process'), true, 'Case-insensitive PowerShell command matching default');
			strictEqual(getIsDefaultRule('get-process'), true, 'Case-insensitive PowerShell command matching default');
			strictEqual(getIsDefaultRule('GET-PROCESS'), true, 'Case-insensitive PowerShell command matching default');
		});

		test('should use structural equality for object comparison', () => {
			// Test that objects with same content but different instances are treated as equal
			const userConfig = { 'test': { approve: true, matchCommandLine: true } };
			const defaultConfig = { 'test': { approve: true, matchCommandLine: true } };

			setAutoApproveWithDefaultsCommandLine(userConfig, defaultConfig);

			strictEqual(getCommandLineIsDefaultRule('test command'), true, 'Even though userConfig and defaultConfig are different object instances, they have the same structure and values, so should be considered default');
		});

		test('should detect structural differences in objects', () => {
			const userConfig = { 'test': { approve: true, matchCommandLine: true } };
			const defaultConfig = { 'test': { approve: true, matchCommandLine: false } };

			setAutoApproveWithDefaultsCommandLine(userConfig, defaultConfig);

			strictEqual(getCommandLineIsDefaultRule('test command'), false, 'Objects have different matchCommandLine values, so should be user-defined');
		});

		test('should handle mixed types correctly', () => {
			const userConfig = {
				'cmd1': true,
				'cmd2': { approve: false, matchCommandLine: true }
			};
			const defaultConfig = {
				'cmd1': true,
				'cmd2': { approve: false, matchCommandLine: true }
			};

			setAutoApproveWithDefaultsCommandLine(userConfig, defaultConfig);

			strictEqual(getIsDefaultRule('cmd1 arg'), true, 'Boolean type should match default');
			strictEqual(getCommandLineIsDefaultRule('cmd2 arg'), true, 'Object type should match default using structural equality (even though it\'s a deny rule)');
		});
	});

	suite('ignoreDefaultAutoApproveRules', () => {
		function setAutoApproveWithDefaults(userConfig: { [key: string]: boolean }, defaultConfig: { [key: string]: boolean }) {
			// Set up mock configuration with default values
			configurationService.setUserConfiguration(TerminalChatAgentToolsSettingId.AutoApprove, userConfig);

			// Mock the inspect method to return default values
			const originalInspect = configurationService.inspect;
			const originalGetValue = configurationService.getValue;

			configurationService.inspect = (key: string): any => {
				if (key === TerminalChatAgentToolsSettingId.AutoApprove) {
					return {
						default: { value: defaultConfig },
						user: { value: userConfig },
						workspace: undefined,
						workspaceFolder: undefined,
						application: undefined,
						policy: undefined,
						memory: undefined,
						value: { ...defaultConfig, ...userConfig }
					};
				}
				return originalInspect.call(configurationService, key);
			};

			configurationService.getValue = (key: string): any => {
				if (key === TerminalChatAgentToolsSettingId.AutoApprove) {
					return { ...defaultConfig, ...userConfig };
				}
				return originalGetValue.call(configurationService, key);
			};

			// Trigger configuration update
			configurationService.onDidChangeConfigurationEmitter.fire({
				affectsConfiguration: () => true,
				affectedKeys: new Set([TerminalChatAgentToolsSettingId.AutoApprove]),
				source: ConfigurationTarget.USER,
				change: null!,
			});
		}

		function setIgnoreDefaultAutoApproveRules(value: boolean) {
			setConfig(TerminalChatAgentToolsSettingId.IgnoreDefaultAutoApproveRules, value);
		}

		test('should include default rules when ignoreDefaultAutoApproveRules is false (default behavior)', () => {
			setAutoApproveWithDefaults(
				{ 'ls': true },
				{ 'echo': true, 'cat': true }
			);
			setIgnoreDefaultAutoApproveRules(false);

			ok(isAutoApproved('ls -la'), 'User-defined rule should work');
			ok(isAutoApproved('echo hello'), 'Default rule should work when not ignored');
			ok(isAutoApproved('cat file.txt'), 'Default rule should work when not ignored');
		});

		test('should exclude default rules when ignoreDefaultAutoApproveRules is true', () => {
			setAutoApproveWithDefaults(
				{ 'ls': true },
				{ 'echo': true, 'cat': true }
			);
			setIgnoreDefaultAutoApproveRules(true);

			ok(isAutoApproved('ls -la'), 'User-defined rule should still work');
			ok(!isAutoApproved('echo hello'), 'Default rule should be ignored');
			ok(!isAutoApproved('cat file.txt'), 'Default rule should be ignored');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/test/browser/executeStrategy.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/test/browser/executeStrategy.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { strictEqual } from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { detectsCommonPromptPattern } from '../../browser/executeStrategy/executeStrategy.js';

suite('Execute Strategy - Prompt Detection', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('detectsCommonPromptPattern should detect PowerShell prompts', () => {
		strictEqual(detectsCommonPromptPattern('PS C:\\>').detected, true);
		strictEqual(detectsCommonPromptPattern('PS C:\\Windows\\System32>').detected, true);
		strictEqual(detectsCommonPromptPattern('PS C:\\Users\\test> ').detected, true);
	});

	test('detectsCommonPromptPattern should detect Command Prompt', () => {
		strictEqual(detectsCommonPromptPattern('C:\\>').detected, true);
		strictEqual(detectsCommonPromptPattern('C:\\Windows\\System32>').detected, true);
		strictEqual(detectsCommonPromptPattern('D:\\test> ').detected, true);
	});

	test('detectsCommonPromptPattern should detect Bash prompts', () => {
		strictEqual(detectsCommonPromptPattern('user@host:~$ ').detected, true);
		strictEqual(detectsCommonPromptPattern('$ ').detected, true);
		strictEqual(detectsCommonPromptPattern('[user@host ~]$ ').detected, true);
	});

	test('detectsCommonPromptPattern should detect root prompts', () => {
		strictEqual(detectsCommonPromptPattern('root@host:~# ').detected, true);
		strictEqual(detectsCommonPromptPattern('# ').detected, true);
		strictEqual(detectsCommonPromptPattern('[root@host ~]# ').detected, true);
	});

	test('detectsCommonPromptPattern should detect Python REPL', () => {
		strictEqual(detectsCommonPromptPattern('>>> ').detected, true);
		strictEqual(detectsCommonPromptPattern('>>>').detected, true);
	});

	test('detectsCommonPromptPattern should detect starship prompts', () => {
		strictEqual(detectsCommonPromptPattern('~ \u276f ').detected, true);
		strictEqual(detectsCommonPromptPattern('/path/to/project \u276f').detected, true);
	});

	test('detectsCommonPromptPattern should detect generic prompts', () => {
		strictEqual(detectsCommonPromptPattern('test> ').detected, true);
		strictEqual(detectsCommonPromptPattern('someprompt% ').detected, true);
	});

	test('detectsCommonPromptPattern should handle multiline content', () => {
		const multilineContent = `command output line 1
command output line 2
user@host:~$ `;
		strictEqual(detectsCommonPromptPattern(multilineContent).detected, true);
	});

	test('detectsCommonPromptPattern should reject non-prompt content', () => {
		strictEqual(detectsCommonPromptPattern('just some output').detected, false);
		strictEqual(detectsCommonPromptPattern('error: command not found').detected, false);
		strictEqual(detectsCommonPromptPattern('').detected, false);
		strictEqual(detectsCommonPromptPattern('   ').detected, false);
	});

	test('detectsCommonPromptPattern should handle edge cases', () => {
		strictEqual(detectsCommonPromptPattern('output\n\n\n').detected, false);
		strictEqual(detectsCommonPromptPattern('\n\n$ \n\n').detected, true); // prompt with surrounding whitespace
		strictEqual(detectsCommonPromptPattern('output\nPS C:\\> ').detected, true); // prompt at end after output
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/test/browser/outputMonitor.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/test/browser/outputMonitor.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { detectsInputRequiredPattern, detectsNonInteractiveHelpPattern, OutputMonitor } from '../../browser/tools/monitoring/outputMonitor.js';
import { CancellationTokenSource } from '../../../../../../base/common/cancellation.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { ITerminalInstance } from '../../../../terminal/browser/terminal.js';
import { IPollingResult, OutputMonitorState } from '../../browser/tools/monitoring/types.js';
import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILanguageModelsService } from '../../../../chat/common/languageModels.js';
import { IChatService } from '../../../../chat/common/chatService.js';
import { Emitter, Event } from '../../../../../../base/common/event.js';
import { ChatModel } from '../../../../chat/common/chatModel.js';
import { ILogService, NullLogService } from '../../../../../../platform/log/common/log.js';
import { runWithFakedTimers } from '../../../../../../base/test/common/timeTravelScheduler.js';
import { IToolInvocationContext } from '../../../../chat/common/languageModelToolsService.js';
import { LocalChatSessionUri } from '../../../../chat/common/chatUri.js';
import { isNumber } from '../../../../../../base/common/types.js';

suite('OutputMonitor', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();
	let monitor: OutputMonitor;
	let execution: { getOutput: () => string; isActive?: () => Promise<boolean>; instance: Pick<ITerminalInstance, 'instanceId' | 'sendText' | 'onData' | 'onDidInputData' | 'focus' | 'registerMarker' | 'onDisposed'>; sessionId: string };
	let cts: CancellationTokenSource;
	let instantiationService: TestInstantiationService;
	let sendTextCalled: boolean;
	let dataEmitter: Emitter<string>;

	setup(() => {
		sendTextCalled = false;
		dataEmitter = new Emitter<string>();
		execution = {
			getOutput: () => 'test output',
			isActive: async () => false,
			instance: {
				instanceId: 1,
				sendText: async () => { sendTextCalled = true; },
				onDidInputData: dataEmitter.event,
				onDisposed: Event.None,
				onData: dataEmitter.event,
				focus: () => { },
				// eslint-disable-next-line local/code-no-any-casts
				registerMarker: () => ({ id: 1 } as any)
			},
			sessionId: '1'
		};
		instantiationService = new TestInstantiationService();

		instantiationService.stub(
			ILanguageModelsService,
			{
				selectLanguageModels: async () => []
			}
		);
		instantiationService.stub(
			IChatService,
			{
				// eslint-disable-next-line local/code-no-any-casts
				getSession: () => ({
					sessionId: '1',
					onDidDispose: { event: () => { }, dispose: () => { } },
					onDidChange: { event: () => { }, dispose: () => { } },
					initialLocation: undefined,
					requests: [],
					responses: [],
					addRequest: () => { },
					addResponse: () => { },
					dispose: () => { }
				} as any)
			}
		);
		instantiationService.stub(ILogService, new NullLogService());
		cts = new CancellationTokenSource();
	});

	teardown(() => {
		cts.dispose();
	});

	test('startMonitoring returns immediately when polling succeeds', async () => {
		return runWithFakedTimers({}, async () => {
			// Simulate output change after first poll
			let callCount = 0;
			execution.getOutput = () => {
				callCount++;
				return callCount > 1 ? 'changed output' : 'test output';
			};
			monitor = store.add(instantiationService.createInstance(OutputMonitor, execution, undefined, createTestContext('1'), cts.token, 'test command'));
			await Event.toPromise(monitor.onDidFinishCommand);
			const pollingResult = monitor.pollingResult;
			assert.strictEqual(pollingResult?.state, OutputMonitorState.Idle);
			assert.strictEqual(pollingResult.output, 'changed output');
			assert.strictEqual(sendTextCalled, false, 'sendText should not be called');
		});
	});

	test('startMonitoring returns cancelled when token is cancelled', async () => {
		return runWithFakedTimers({}, async () => {
			monitor = store.add(instantiationService.createInstance(OutputMonitor, execution, undefined, createTestContext('1'), cts.token, 'test command'));
			cts.cancel();
			await Event.toPromise(monitor.onDidFinishCommand);
			const pollingResult = monitor.pollingResult;
			assert.strictEqual(pollingResult?.state, OutputMonitorState.Cancelled);
		});
	});
	test('startMonitoring returns idle when isActive is false', async () => {
		return runWithFakedTimers({}, async () => {
			execution.isActive = async () => false;
			monitor = store.add(instantiationService.createInstance(OutputMonitor, execution, undefined, createTestContext('1'), cts.token, 'test command'));
			await Event.toPromise(monitor.onDidFinishCommand);
			const pollingResult = monitor.pollingResult;
			assert.strictEqual(pollingResult?.state, OutputMonitorState.Idle);
		});
	});

	test('startMonitoring works when isActive is undefined', async () => {
		return runWithFakedTimers({}, async () => {
			// Simulate output change after first poll
			let callCount = 0;
			execution.getOutput = () => {
				callCount++;
				return callCount > 1 ? 'changed output' : 'test output';
			};
			delete execution.isActive;
			monitor = store.add(instantiationService.createInstance(OutputMonitor, execution, undefined, createTestContext('1'), cts.token, 'test command'));
			await Event.toPromise(monitor.onDidFinishCommand);
			const pollingResult = monitor.pollingResult;
			assert.strictEqual(pollingResult?.state, OutputMonitorState.Idle);
		});
	});

	test('non-interactive help completes without prompting', async () => {
		return runWithFakedTimers({}, async () => {
			execution.getOutput = () => 'press h + enter to show help';
			instantiationService.stub(
				ILanguageModelsService,
				{
					selectLanguageModels: async () => { throw new Error('language model should not be consulted'); }
				}
			);
			monitor = store.add(instantiationService.createInstance(OutputMonitor, execution, undefined, createTestContext('1'), cts.token, 'test command'));
			await Event.toPromise(monitor.onDidFinishCommand);
			const pollingResult = monitor.pollingResult;
			assert.strictEqual(pollingResult?.state, OutputMonitorState.Idle);
			assert.strictEqual(pollingResult?.output, 'press h + enter to show help');
		});
	});

	test('monitor can be disposed twice without error', async () => {
		return runWithFakedTimers({}, async () => {
			// Simulate output change after first poll
			let callCount = 0;
			execution.getOutput = () => {
				callCount++;
				return callCount > 1 ? 'changed output' : 'test output';
			};
			monitor = store.add(instantiationService.createInstance(OutputMonitor, execution, undefined, createTestContext('1'), cts.token, 'test command'));
			await Event.toPromise(monitor.onDidFinishCommand);
			const pollingResult = monitor.pollingResult;
			assert.strictEqual(pollingResult?.state, OutputMonitorState.Idle);
			monitor.dispose();
			monitor.dispose();
		});
	});
	test('timeout prompt unanswered → continues polling and completes when idle', async () => {
		return runWithFakedTimers({}, async () => {
			// Fake a ChatModel enough to pass instanceof and the two methods used
			const fakeChatModel: any = {
				getRequests: () => [{}],
				acceptResponseProgress: () => { }
			};
			Object.setPrototypeOf(fakeChatModel, ChatModel.prototype);
			instantiationService.stub(IChatService, { getSession: () => fakeChatModel });

			// Poller: first pass times out (to show the prompt), second pass goes idle
			let pass = 0;
			const timeoutThenIdle = async (): Promise<IPollingResult> => {
				pass++;
				return pass === 1
					? { state: OutputMonitorState.Timeout, output: execution.getOutput(), modelOutputEvalResponse: 'Timed out' }
					: { state: OutputMonitorState.Idle, output: execution.getOutput(), modelOutputEvalResponse: 'Done' };
			};

			monitor = store.add(
				instantiationService.createInstance(
					OutputMonitor,
					execution,
					timeoutThenIdle,
					createTestContext('1'),
					cts.token,
					'test command'
				)
			);

			await Event.toPromise(monitor.onDidFinishCommand);

			const res = monitor.pollingResult!;
			assert.strictEqual(res.state, OutputMonitorState.Idle);
			assert.strictEqual(res.output, 'test output');
			assert.ok(isNumber(res.pollDurationMs));
		});
	});

	suite('detectsInputRequiredPattern', () => {
		test('detects yes/no confirmation prompts (pairs and variants)', () => {
			assert.strictEqual(detectsInputRequiredPattern('Continue? (y/N) '), true);
			assert.strictEqual(detectsInputRequiredPattern('Continue? (y/n) '), true);
			assert.strictEqual(detectsInputRequiredPattern('Overwrite file? [Y/n] '), true);
			assert.strictEqual(detectsInputRequiredPattern('Are you sure? (Y/N) '), true);
			assert.strictEqual(detectsInputRequiredPattern('Delete files? [y/N] '), true);
			assert.strictEqual(detectsInputRequiredPattern('Proceed? (yes/no) '), true);
			assert.strictEqual(detectsInputRequiredPattern('Proceed? [no/yes] '), true);
			assert.strictEqual(detectsInputRequiredPattern('Continue? y/n '), true);
			assert.strictEqual(detectsInputRequiredPattern('Overwrite: yes/no '), true);

			// No match if there's a response already
			assert.strictEqual(detectsInputRequiredPattern('Continue? (y/N) y'), false);
			assert.strictEqual(detectsInputRequiredPattern('Continue? (y/n) n'), false);
			assert.strictEqual(detectsInputRequiredPattern('Overwrite file? [Y/n] N'), false);
			assert.strictEqual(detectsInputRequiredPattern('Are you sure? (Y/N) Y'), false);
			assert.strictEqual(detectsInputRequiredPattern('Delete files? [y/N] y'), false);
			assert.strictEqual(detectsInputRequiredPattern('Continue? y/n y\/n'), false);
			assert.strictEqual(detectsInputRequiredPattern('Overwrite: yes/no yes\/n'), false);
		});

		test('detects PowerShell multi-option confirmation line', () => {
			assert.strictEqual(
				detectsInputRequiredPattern('[Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "Y"): '),
				true
			);
			// also matches without default suffix
			assert.strictEqual(
				detectsInputRequiredPattern('[Y] Yes  [N] No '),
				true
			);

			// No match if there's a response already
			assert.strictEqual(
				detectsInputRequiredPattern('[Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "Y"): Y'),
				false
			);
			assert.strictEqual(
				detectsInputRequiredPattern('[Y] Yes  [N] No N'),
				false
			);
		});
		test('Line ends with colon', () => {
			assert.strictEqual(detectsInputRequiredPattern('Enter your name: '), true);
			assert.strictEqual(detectsInputRequiredPattern('Password: '), true);
			assert.strictEqual(detectsInputRequiredPattern('File to overwrite: '), true);
		});

		test('detects trailing questions', () => {
			assert.strictEqual(detectsInputRequiredPattern('Continue?'), true);
			assert.strictEqual(detectsInputRequiredPattern('Proceed?   '), true);
			assert.strictEqual(detectsInputRequiredPattern('Are you sure?'), true);
		});

		test('detects press any key prompts', () => {
			assert.strictEqual(detectsInputRequiredPattern('Press any key to continue...'), true);
			assert.strictEqual(detectsInputRequiredPattern('Press a key'), true);
		});

		test('detects non-interactive help prompts without treating them as input', () => {
			assert.strictEqual(detectsInputRequiredPattern('press h + enter to show help'), false);
			assert.strictEqual(detectsInputRequiredPattern('press h to show help'), false);
			assert.strictEqual(detectsNonInteractiveHelpPattern('press h + enter to show help'), true);
			assert.strictEqual(detectsNonInteractiveHelpPattern('press h to show help'), true);
			assert.strictEqual(detectsNonInteractiveHelpPattern('press h to show commands'), true);
			assert.strictEqual(detectsNonInteractiveHelpPattern('press ? to see commands'), true);
			assert.strictEqual(detectsNonInteractiveHelpPattern('press ? + enter for options'), true);
			assert.strictEqual(detectsNonInteractiveHelpPattern('type h + enter to show help'), true);
			assert.strictEqual(detectsNonInteractiveHelpPattern('hit ? for help'), true);
			assert.strictEqual(detectsNonInteractiveHelpPattern('type h to see options'), true);
			assert.strictEqual(detectsInputRequiredPattern('press o to open the app'), false);
			assert.strictEqual(detectsNonInteractiveHelpPattern('press o to open the app'), true);
			assert.strictEqual(detectsInputRequiredPattern('press r to restart the server'), false);
			assert.strictEqual(detectsNonInteractiveHelpPattern('press r to restart the server'), true);
			assert.strictEqual(detectsInputRequiredPattern('press q to quit'), false);
			assert.strictEqual(detectsNonInteractiveHelpPattern('press q to quit'), true);
			assert.strictEqual(detectsInputRequiredPattern('press u to show server url'), false);
			assert.strictEqual(detectsNonInteractiveHelpPattern('press u to show server url'), true);
		});
	});

});
function createTestContext(id: string): IToolInvocationContext {
	return { sessionId: id, sessionResource: LocalChatSessionUri.forSession(id) };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/test/browser/runInTerminalHelpers.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/test/browser/runInTerminalHelpers.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ok, strictEqual } from 'assert';
import { TRUNCATION_MESSAGE, dedupeRules, isPowerShell, sanitizeTerminalOutput, truncateOutputKeepingTail } from '../../browser/runInTerminalHelpers.js';
import { OperatingSystem } from '../../../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { ConfigurationTarget } from '../../../../../../platform/configuration/common/configuration.js';
import type { IAutoApproveRule, ICommandApprovalResultWithReason } from '../../browser/commandLineAutoApprover.js';

suite('isPowerShell', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('PowerShell executables', () => {
		test('should detect powershell.exe', () => {
			ok(isPowerShell('powershell.exe', OperatingSystem.Windows));
			ok(isPowerShell('powershell', OperatingSystem.Linux));
		});

		test('should detect pwsh.exe', () => {
			ok(isPowerShell('pwsh.exe', OperatingSystem.Windows));
			ok(isPowerShell('pwsh', OperatingSystem.Linux));
		});

		test('should detect powershell-preview', () => {
			ok(isPowerShell('powershell-preview.exe', OperatingSystem.Windows));
			ok(isPowerShell('powershell-preview', OperatingSystem.Linux));
		});

		test('should detect pwsh-preview', () => {
			ok(isPowerShell('pwsh-preview.exe', OperatingSystem.Windows));
			ok(isPowerShell('pwsh-preview', OperatingSystem.Linux));
		});
	});

	suite('PowerShell with full paths', () => {
		test('should detect Windows PowerShell with full path', () => {
			ok(isPowerShell('C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe', OperatingSystem.Windows));
		});

		test('should detect PowerShell Core with full path', () => {
			ok(isPowerShell('C:\\Program Files\\PowerShell\\7\\pwsh.exe', OperatingSystem.Windows));
		});

		test('should detect PowerShell on Linux/macOS with full path', () => {
			ok(isPowerShell('/usr/bin/pwsh', OperatingSystem.Linux));
		});

		test('should detect PowerShell preview with full path', () => {
			ok(isPowerShell('/opt/microsoft/powershell/7-preview/pwsh-preview', OperatingSystem.Linux));
		});

		test('should detect nested path with powershell', () => {
			ok(isPowerShell('/some/deep/path/to/powershell.exe', OperatingSystem.Windows));
		});
	});

	suite('Case sensitivity', () => {
		test('should detect PowerShell regardless of case', () => {
			ok(isPowerShell('PowerShell.exe', OperatingSystem.Windows));
			ok(isPowerShell('POWERSHELL.EXE', OperatingSystem.Windows));
			ok(isPowerShell('Pwsh.exe', OperatingSystem.Windows));
		});
	});

	suite('Non-PowerShell shells', () => {
		test('should not detect bash', () => {
			ok(!isPowerShell('bash', OperatingSystem.Linux));
		});

		test('should not detect zsh', () => {
			ok(!isPowerShell('zsh', OperatingSystem.Linux));
		});

		test('should not detect sh', () => {
			ok(!isPowerShell('sh', OperatingSystem.Linux));
		});

		test('should not detect fish', () => {
			ok(!isPowerShell('fish', OperatingSystem.Linux));
		});

		test('should not detect cmd.exe', () => {
			ok(!isPowerShell('cmd.exe', OperatingSystem.Windows));
		});

		test('should not detect command.com', () => {
			ok(!isPowerShell('command.com', OperatingSystem.Windows));
		});

		test('should not detect dash', () => {
			ok(!isPowerShell('dash', OperatingSystem.Linux));
		});

		test('should not detect tcsh', () => {
			ok(!isPowerShell('tcsh', OperatingSystem.Linux));
		});

		test('should not detect csh', () => {
			ok(!isPowerShell('csh', OperatingSystem.Linux));
		});
	});

	suite('Non-PowerShell shells with full paths', () => {
		test('should not detect bash with full path', () => {
			ok(!isPowerShell('/bin/bash', OperatingSystem.Linux));
		});

		test('should not detect zsh with full path', () => {
			ok(!isPowerShell('/usr/bin/zsh', OperatingSystem.Linux));
		});

		test('should not detect cmd.exe with full path', () => {
			ok(!isPowerShell('C:\\Windows\\System32\\cmd.exe', OperatingSystem.Windows));
		});

		test('should not detect git bash', () => {
			ok(!isPowerShell('C:\\Program Files\\Git\\bin\\bash.exe', OperatingSystem.Windows));
		});
	});

	suite('Edge cases', () => {
		test('should handle empty string', () => {
			ok(!isPowerShell('', OperatingSystem.Windows));
		});

		test('should handle paths with spaces', () => {
			ok(isPowerShell('C:\\Program Files\\PowerShell\\7\\pwsh.exe', OperatingSystem.Windows));
			ok(!isPowerShell('C:\\Program Files\\Git\\bin\\bash.exe', OperatingSystem.Windows));
		});

		test('should not match partial strings', () => {
			ok(!isPowerShell('notpowershell', OperatingSystem.Linux));
			ok(!isPowerShell('powershellish', OperatingSystem.Linux));
			ok(!isPowerShell('mypwsh', OperatingSystem.Linux));
			ok(!isPowerShell('pwshell', OperatingSystem.Linux));
		});

		test('should handle strings containing powershell but not as basename', () => {
			ok(!isPowerShell('/powershell/bin/bash', OperatingSystem.Linux));
			ok(!isPowerShell('/usr/pwsh/bin/zsh', OperatingSystem.Linux));
			ok(!isPowerShell('C:\\powershell\\cmd.exe', OperatingSystem.Windows));
		});

		test('should handle special characters in path', () => {
			ok(isPowerShell('/path/with-dashes/pwsh.exe', OperatingSystem.Windows));
			ok(isPowerShell('/path/with_underscores/powershell', OperatingSystem.Linux));
			ok(isPowerShell('C:\\path\\with spaces\\pwsh.exe', OperatingSystem.Windows));
		});

		test('should handle relative paths', () => {
			ok(isPowerShell('./powershell.exe', OperatingSystem.Windows));
			ok(isPowerShell('../bin/pwsh', OperatingSystem.Linux));
			ok(isPowerShell('bin/powershell', OperatingSystem.Linux));
		});

		test('should not match similar named tools', () => {
			ok(!isPowerShell('powertool', OperatingSystem.Linux));
			ok(!isPowerShell('shell', OperatingSystem.Linux));
			ok(!isPowerShell('power', OperatingSystem.Linux));
			ok(!isPowerShell('pwshconfig', OperatingSystem.Linux));
		});
	});
});

suite('dedupeRules', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	function createMockRule(sourceText: string): IAutoApproveRule {
		return {
			regex: new RegExp(sourceText),
			regexCaseInsensitive: new RegExp(sourceText, 'i'),
			sourceText,
			sourceTarget: ConfigurationTarget.USER,
			isDefaultRule: false
		};
	}

	function createMockResult(result: 'approved' | 'denied' | 'noMatch', reason: string, rule?: IAutoApproveRule): ICommandApprovalResultWithReason {
		return {
			result,
			reason,
			rule
		};
	}

	test('should return empty array for empty input', () => {
		const result = dedupeRules([]);
		strictEqual(result.length, 0);
	});

	test('should return same array when no duplicates exist', () => {
		const result = dedupeRules([
			createMockResult('approved', 'approved by echo rule', createMockRule('echo')),
			createMockResult('approved', 'approved by ls rule', createMockRule('ls'))
		]);
		strictEqual(result.length, 2);
		strictEqual(result[0].rule?.sourceText, 'echo');
		strictEqual(result[1].rule?.sourceText, 'ls');
	});

	test('should deduplicate rules with same sourceText', () => {
		const result = dedupeRules([
			createMockResult('approved', 'approved by echo rule', createMockRule('echo')),
			createMockResult('approved', 'approved by echo rule again', createMockRule('echo')),
			createMockResult('approved', 'approved by ls rule', createMockRule('ls'))
		]);
		strictEqual(result.length, 2);
		strictEqual(result[0].rule?.sourceText, 'echo');
		strictEqual(result[1].rule?.sourceText, 'ls');
	});

	test('should preserve first occurrence when deduplicating', () => {
		const result = dedupeRules([
			createMockResult('approved', 'first echo rule', createMockRule('echo')),
			createMockResult('approved', 'second echo rule', createMockRule('echo'))
		]);
		strictEqual(result.length, 1);
		strictEqual(result[0].reason, 'first echo rule');
	});

	test('should filter out results without rules', () => {
		const result = dedupeRules([
			createMockResult('noMatch', 'no rule applied'),
			createMockResult('approved', 'approved by echo rule', createMockRule('echo')),
			createMockResult('denied', 'denied without rule')
		]);
		strictEqual(result.length, 1);
		strictEqual(result[0].rule?.sourceText, 'echo');
	});

	test('should handle mix of rules and no-rule results with duplicates', () => {
		const result = dedupeRules([
			createMockResult('approved', 'approved by echo rule', createMockRule('echo')),
			createMockResult('noMatch', 'no rule applied'),
			createMockResult('approved', 'approved by echo rule again', createMockRule('echo')),
			createMockResult('approved', 'approved by ls rule', createMockRule('ls')),
			createMockResult('denied', 'denied without rule')
		]);
		strictEqual(result.length, 2);
		strictEqual(result[0].rule?.sourceText, 'echo');
		strictEqual(result[1].rule?.sourceText, 'ls');
	});

	test('should handle multiple duplicates of same rule', () => {
		const result = dedupeRules([
			createMockResult('approved', 'npm rule 1', createMockRule('npm')),
			createMockResult('approved', 'npm rule 2', createMockRule('npm')),
			createMockResult('approved', 'npm rule 3', createMockRule('npm')),
			createMockResult('approved', 'git rule', createMockRule('git'))
		]);
		strictEqual(result.length, 2);
		strictEqual(result[0].rule?.sourceText, 'npm');
		strictEqual(result[0].reason, 'npm rule 1');
		strictEqual(result[1].rule?.sourceText, 'git');
	});
});

suite('truncateOutputKeepingTail', () => {
	ensureNoDisposablesAreLeakedInTestSuite();
	test('returns original when below limit', () => {
		const output = 'short output';
		strictEqual(truncateOutputKeepingTail(output, 100), output);
	});

	test('keeps tail and adds message when above limit', () => {
		const output = 'a'.repeat(200);
		const result = truncateOutputKeepingTail(output, 120);
		ok(result.startsWith(TRUNCATION_MESSAGE));
		strictEqual(result.length, 120);
	});

	test('gracefully handles tiny limits', () => {
		const result = truncateOutputKeepingTail('example', 5);
		strictEqual(result.length, 5);
	});
});

suite('sanitizeTerminalOutput', () => {
	ensureNoDisposablesAreLeakedInTestSuite();
	test('adds truncation notice when exceeding max length', () => {
		const longOutput = 'line\n'.repeat(20000);
		const result = sanitizeTerminalOutput(longOutput);
		ok(result.startsWith(TRUNCATION_MESSAGE));
		ok(result.endsWith('line'));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/test/electron-browser/commandLineCdPrefixRewriter.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/test/electron-browser/commandLineCdPrefixRewriter.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { strictEqual } from 'assert';
import { isWindows, OperatingSystem } from '../../../../../../base/common/platform.js';
import { URI } from '../../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import type { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { workbenchInstantiationService } from '../../../../../test/browser/workbenchTestServices.js';
import { CommandLineCdPrefixRewriter } from '../../browser/tools/commandLineRewriter/commandLineCdPrefixRewriter.js';
import type { ICommandLineRewriterOptions } from '../../browser/tools/commandLineRewriter/commandLineRewriter.js';

suite('CommandLineCdPrefixRewriter', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let rewriter: CommandLineCdPrefixRewriter;

	function createRewriteOptions(command: string, cwd: URI | undefined, shell: string, os: OperatingSystem): ICommandLineRewriterOptions {
		return {
			commandLine: command,
			cwd,
			shell,
			os
		};
	}

	setup(() => {
		instantiationService = workbenchInstantiationService({}, store);
		rewriter = store.add(instantiationService.createInstance(CommandLineCdPrefixRewriter));
	});

	suite('cd <cwd> && <suffix> -> <suffix>', () => {
		(!isWindows ? suite : suite.skip)('Posix', () => {
			const cwd = URI.file('/test/workspace');

			function t(commandLine: string, shell: string, expectedResult: string | undefined) {
				const options = createRewriteOptions(commandLine, cwd, shell, OperatingSystem.Linux);
				const result = rewriter.rewrite(options);
				strictEqual(result?.rewritten, expectedResult);
				if (expectedResult !== undefined) {
					strictEqual(result?.reasoning, 'Removed redundant cd command');
				}
			}

			test('should return undefined when no cd prefix pattern matches', () => t('echo hello world', 'bash', undefined));
			test('should return undefined when cd pattern does not have suffix', () => t('cd /some/path', 'bash', undefined));
			test('should rewrite command with ; separator when directory matches cwd', () => t('cd /test/workspace; npm test', 'pwsh', 'npm test'));
			test('should rewrite command with && separator when directory matches cwd', () => t('cd /test/workspace && npm install', 'bash', 'npm install'));
			test('should rewrite command when the path is wrapped in double quotes', () => t('cd "/test/workspace" && npm install', 'bash', 'npm install'));
			test('should not rewrite command when directory does not match cwd', () => t('cd /different/path && npm install', 'bash', undefined));
			test('should handle commands with complex suffixes', () => t('cd /test/workspace && npm install && npm test && echo "done"', 'bash', 'npm install && npm test && echo "done"'));
			test('should ignore any trailing forward slash', () => t('cd /test/workspace/ && npm install', 'bash', 'npm install'));
		});

		(isWindows ? suite : suite.skip)('Windows', () => {
			const cwd = URI.file('C:\\test\\workspace');

			function t(commandLine: string, shell: string, expectedResult: string | undefined) {
				const options = createRewriteOptions(commandLine, cwd, shell, OperatingSystem.Windows);
				const result = rewriter.rewrite(options);
				strictEqual(result?.rewritten, expectedResult);
				if (expectedResult !== undefined) {
					strictEqual(result?.reasoning, 'Removed redundant cd command');
				}
			}

			test('should ignore any trailing back slash', () => t('cd c:\\test\\workspace\\ && npm install', 'cmd', 'npm install'));
			test('should rewrite command with && separator when directory matches cwd', () => t('cd C:\\test\\workspace && npm test', 'cmd', 'npm test'));
			test('should rewrite command with ; separator when directory matches cwd - PowerShell style', () => t('cd C:\\test\\workspace; npm test', 'pwsh', 'npm test'));
			test('should not rewrite when cwd differs from cd path', () => t('cd C:\\different\\path && npm test', 'cmd', undefined));
			test('should handle case-insensitive comparison on Windows', () => t('cd c:\\test\\workspace && npm test', 'cmd', 'npm test'));
			test('should handle quoted paths', () => t('cd "C:\\test\\workspace" && npm test', 'cmd', 'npm test'));
			test('should handle cd /d flag when directory matches cwd', () => t('cd /d C:\\test\\workspace && echo hello', 'pwsh', 'echo hello'));
			test('should handle cd /d flag with quoted paths when directory matches cwd', () => t('cd /d "C:\\test\\workspace" && echo hello', 'pwsh', 'echo hello'));
			test('should not rewrite cd /d when directory does not match cwd', () => t('cd /d C:\\different\\path ; echo hello', 'pwsh', undefined));
			test('should handle cd /d flag with semicolon separator', () => t('cd /d C:\\test\\workspace; echo hello', 'pwsh', 'echo hello'));
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/test/electron-browser/commandLinePwshChainOperatorRewriter.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/test/electron-browser/commandLinePwshChainOperatorRewriter.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { strictEqual } from 'assert';
import { Schemas } from '../../../../../../base/common/network.js';
import { OperatingSystem } from '../../../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { ITreeSitterLibraryService } from '../../../../../../editor/common/services/treeSitter/treeSitterLibraryService.js';
import { FileService } from '../../../../../../platform/files/common/fileService.js';
import type { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { NullLogService } from '../../../../../../platform/log/common/log.js';
import { TreeSitterLibraryService } from '../../../../../services/treeSitter/browser/treeSitterLibraryService.js';
import { workbenchInstantiationService } from '../../../../../test/browser/workbenchTestServices.js';
import { TestIPCFileSystemProvider } from '../../../../../test/electron-browser/workbenchTestServices.js';
import { CommandLinePwshChainOperatorRewriter } from '../../browser/tools/commandLineRewriter/commandLinePwshChainOperatorRewriter.js';
import type { ICommandLineRewriterOptions } from '../../browser/tools/commandLineRewriter/commandLineRewriter.js';
import { TreeSitterCommandParser } from '../../browser/treeSitterCommandParser.js';

suite('CommandLinePwshChainOperatorRewriter', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let parser: TreeSitterCommandParser;
	let rewriter: CommandLinePwshChainOperatorRewriter;

	function createRewriteOptions(command: string, shell: string, os: OperatingSystem): ICommandLineRewriterOptions {
		return {
			commandLine: command,
			cwd: undefined,
			shell,
			os
		};
	}

	setup(() => {
		const fileService = store.add(new FileService(new NullLogService()));
		const fileSystemProvider = new TestIPCFileSystemProvider();
		store.add(fileService.registerProvider(Schemas.file, fileSystemProvider));

		instantiationService = workbenchInstantiationService({
			fileService: () => fileService,
		}, store);

		const treeSitterLibraryService = store.add(instantiationService.createInstance(TreeSitterLibraryService));
		treeSitterLibraryService.isTest = true;
		instantiationService.stub(ITreeSitterLibraryService, treeSitterLibraryService);

		parser = store.add(instantiationService.createInstance(TreeSitterCommandParser));
		rewriter = store.add(instantiationService.createInstance(CommandLinePwshChainOperatorRewriter, parser));
	});

	suite('PowerShell: && -> ;', () => {
		async function t(originalCommandLine: string, expectedResult: string | undefined) {
			const options = createRewriteOptions(originalCommandLine, 'pwsh', OperatingSystem.Windows);
			const result = await rewriter.rewrite(options);
			strictEqual(result?.rewritten, expectedResult);
			if (expectedResult !== undefined) {
				strictEqual(result?.reasoning, '&& re-written to ;');
			}
		}

		test('should rewrite && to ; in PowerShell commands', () => t('echo hello && echo world', 'echo hello ; echo world'));
		test('should rewrite multiple && to ; in PowerShell commands', () => t('echo first && echo second && echo third', 'echo first ; echo second ; echo third'));
		test('should handle complex commands with && operators', () => t('npm install && npm test && echo "build complete"', 'npm install ; npm test ; echo "build complete"'));
		test('should work with Windows PowerShell shell identifier', () => t('Get-Process && Stop-Process', 'Get-Process ; Stop-Process'));
		test('should preserve existing semicolons', () => t('echo hello; echo world && echo final', 'echo hello; echo world ; echo final'));
		test('should not rewrite strings', () => t('echo "&&" && Write-Host "&& &&" && "&&"', 'echo "&&" ; Write-Host "&& &&" ; "&&"'));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/test/electron-browser/runInTerminalTool.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/test/electron-browser/runInTerminalTool.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ok, strictEqual } from 'assert';
import { Separator } from '../../../../../../base/common/actions.js';
import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { Emitter } from '../../../../../../base/common/event.js';
import { Schemas } from '../../../../../../base/common/network.js';
import { isLinux, isWindows, OperatingSystem } from '../../../../../../base/common/platform.js';
import { count } from '../../../../../../base/common/strings.js';
import type { SingleOrMany } from '../../../../../../base/common/types.js';
import { URI } from '../../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { ITreeSitterLibraryService } from '../../../../../../editor/common/services/treeSitter/treeSitterLibraryService.js';
import { ConfigurationTarget } from '../../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IFileService } from '../../../../../../platform/files/common/files.js';
import { FileService } from '../../../../../../platform/files/common/fileService.js';
import type { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { NullLogService } from '../../../../../../platform/log/common/log.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../../platform/storage/common/storage.js';
import { ITerminalProfile } from '../../../../../../platform/terminal/common/terminal.js';
import { IWorkspaceContextService, toWorkspaceFolder } from '../../../../../../platform/workspace/common/workspace.js';
import { Workspace } from '../../../../../../platform/workspace/test/common/testWorkspace.js';
import { IHistoryService } from '../../../../../services/history/common/history.js';
import { TreeSitterLibraryService } from '../../../../../services/treeSitter/browser/treeSitterLibraryService.js';
import { workbenchInstantiationService } from '../../../../../test/browser/workbenchTestServices.js';
import { TestContextService } from '../../../../../test/common/workbenchTestServices.js';
import { TestIPCFileSystemProvider } from '../../../../../test/electron-browser/workbenchTestServices.js';
import { TerminalToolConfirmationStorageKeys } from '../../../../chat/browser/chatContentParts/toolInvocationParts/chatTerminalToolConfirmationSubPart.js';
import { IChatService, type IChatTerminalToolInvocationData } from '../../../../chat/common/chatService.js';
import { LocalChatSessionUri } from '../../../../chat/common/chatUri.js';
import { ILanguageModelToolsService, IPreparedToolInvocation, IToolInvocationPreparationContext, type ToolConfirmationAction } from '../../../../chat/common/languageModelToolsService.js';
import { ITerminalChatService, ITerminalService, type ITerminalInstance } from '../../../../terminal/browser/terminal.js';
import { ITerminalProfileResolverService } from '../../../../terminal/common/terminal.js';
import { RunInTerminalTool, type IRunInTerminalInputParams } from '../../browser/tools/runInTerminalTool.js';
import { ShellIntegrationQuality } from '../../browser/toolTerminalCreator.js';
import { terminalChatAgentToolsConfiguration, TerminalChatAgentToolsSettingId } from '../../common/terminalChatAgentToolsConfiguration.js';
import { TerminalChatService } from '../../../chat/browser/terminalChatService.js';

class TestRunInTerminalTool extends RunInTerminalTool {
	protected override _osBackend: Promise<OperatingSystem> = Promise.resolve(OperatingSystem.Windows);

	get sessionTerminalAssociations() { return this._sessionTerminalAssociations; }
	get profileFetcher() { return this._profileFetcher; }

	setBackendOs(os: OperatingSystem) {
		this._osBackend = Promise.resolve(os);
	}
}

suite('RunInTerminalTool', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let configurationService: TestConfigurationService;
	let fileService: IFileService;
	let storageService: IStorageService;
	let workspaceContextService: TestContextService;
	let terminalServiceDisposeEmitter: Emitter<ITerminalInstance>;
	let chatServiceDisposeEmitter: Emitter<{ sessionResource: URI[]; reason: 'cleared' }>;

	let runInTerminalTool: TestRunInTerminalTool;

	setup(() => {
		configurationService = new TestConfigurationService();
		workspaceContextService = new TestContextService();

		const logService = new NullLogService();
		fileService = store.add(new FileService(logService));
		const fileSystemProvider = new TestIPCFileSystemProvider();
		store.add(fileService.registerProvider(Schemas.file, fileSystemProvider));

		setConfig(TerminalChatAgentToolsSettingId.EnableAutoApprove, true);
		terminalServiceDisposeEmitter = new Emitter<ITerminalInstance>();
		chatServiceDisposeEmitter = new Emitter<{ sessionResource: URI[]; reason: 'cleared' }>();

		instantiationService = workbenchInstantiationService({
			configurationService: () => configurationService,
			fileService: () => fileService,
		}, store);

		instantiationService.stub(ITerminalChatService, store.add(instantiationService.createInstance(TerminalChatService)));
		instantiationService.stub(IWorkspaceContextService, workspaceContextService);
		instantiationService.stub(IHistoryService, {
			getLastActiveWorkspaceRoot: () => undefined
		});

		const treeSitterLibraryService = store.add(instantiationService.createInstance(TreeSitterLibraryService));
		treeSitterLibraryService.isTest = true;
		instantiationService.stub(ITreeSitterLibraryService, treeSitterLibraryService);

		instantiationService.stub(ILanguageModelToolsService, {
			getTools() {
				return [];
			},
		});
		instantiationService.stub(ITerminalService, {
			onDidDisposeInstance: terminalServiceDisposeEmitter.event,
			setNextCommandId: async () => { }
		});
		instantiationService.stub(IChatService, {
			onDidDisposeSession: chatServiceDisposeEmitter.event
		});
		instantiationService.stub(ITerminalProfileResolverService, {
			getDefaultProfile: async () => ({ path: 'bash' } as ITerminalProfile)
		});

		storageService = instantiationService.get(IStorageService);
		storageService.store(TerminalToolConfirmationStorageKeys.TerminalAutoApproveWarningAccepted, true, StorageScope.APPLICATION, StorageTarget.USER);

		runInTerminalTool = store.add(instantiationService.createInstance(TestRunInTerminalTool));
	});

	function setAutoApprove(value: { [key: string]: { approve: boolean; matchCommandLine?: boolean } | boolean }) {
		setConfig(TerminalChatAgentToolsSettingId.AutoApprove, value);
	}

	function setConfig(key: string, value: unknown) {
		configurationService.setUserConfiguration(key, value);
		configurationService.onDidChangeConfigurationEmitter.fire({
			affectsConfiguration: () => true,
			affectedKeys: new Set([key]),
			source: ConfigurationTarget.USER,
			change: null!,
		});
	}

	function clearAutoApproveWarningAcceptedState() {
		storageService.remove(TerminalToolConfirmationStorageKeys.TerminalAutoApproveWarningAccepted, StorageScope.APPLICATION);
	}

	/**
	 * Executes a test scenario for the RunInTerminalTool
	 */
	async function executeToolTest(
		params: Partial<IRunInTerminalInputParams>
	): Promise<IPreparedToolInvocation | undefined> {
		const context: IToolInvocationPreparationContext = {
			parameters: {
				command: 'echo hello',
				explanation: 'Print hello to the console',
				isBackground: false,
				...params
			} as IRunInTerminalInputParams
		} as IToolInvocationPreparationContext;

		const result = await runInTerminalTool.prepareToolInvocation(context, CancellationToken.None);
		return result;
	}

	function isSeparator(action: ToolConfirmationAction): action is Separator {
		return action instanceof Separator;
	}

	/**
	 * Helper to assert that a command should be auto-approved (no confirmation required)
	 */
	function assertAutoApproved(preparedInvocation: IPreparedToolInvocation | undefined) {
		ok(preparedInvocation, 'Expected prepared invocation to be defined');
		ok(!preparedInvocation.confirmationMessages, 'Expected no confirmation messages for auto-approved command');
	}

	/**
	 * Helper to assert that a command requires confirmation
	 */
	function assertConfirmationRequired(preparedInvocation: IPreparedToolInvocation | undefined, expectedTitle?: string) {
		ok(preparedInvocation, 'Expected prepared invocation to be defined');
		ok(preparedInvocation.confirmationMessages, 'Expected confirmation messages for non-approved command');
		if (expectedTitle) {
			strictEqual(preparedInvocation.confirmationMessages!.title, expectedTitle);
		}
	}

	suite('default auto-approve rules', () => {
		const defaults = terminalChatAgentToolsConfiguration[TerminalChatAgentToolsSettingId.AutoApprove].default as Record<string, boolean | { approve: boolean; matchCommandLine?: boolean }>;

		suiteSetup(() => {
			// Sanity check on entries to make sure that the defaults are actually pulled in
			ok(Object.keys(defaults).length > 50);
		});
		setup(() => {
			setAutoApprove(defaults);
		});

		const autoApprovedTestCases = [
			// Safe commands
			'echo abc',
			'echo "abc"',
			'echo \'abc\'',
			'ls -la',
			'pwd',
			'cat file.txt',
			'head -n 10 file.txt',
			'tail -f log.txt',
			'findstr pattern file.txt',
			'wc -l file.txt',
			'tr a-z A-Z',
			'cut -d: -f1',
			'cmp file1 file2',
			'which node',
			'basename /path/to/file',
			'dirname /path/to/file',
			'realpath .',
			'readlink symlink',
			'stat file.txt',
			'file document.pdf',
			'du -sh folder',
			'df -h',
			'sleep 5',
			'cd /home/user',
			'nl -ba path/to/file.txt',

			// Safe git sub-commands
			'git status',
			'git log --oneline',
			'git show HEAD',
			'git diff main',
			'git grep "TODO"',

			// PowerShell commands
			'Get-ChildItem',
			'Get-Date',
			'Get-Random',
			'Get-Location',
			'Write-Host "Hello"',
			'Write-Output "Test"',
			'Split-Path C:\\Users\\test',
			'Join-Path C:\\Users test',
			'Start-Sleep 2',

			// PowerShell safe verbs (regex patterns)
			'Select-Object Name',
			'Measure-Object Length',
			'Compare-Object $a $b',
			'Format-Table',
			'Sort-Object Name',

			// Commands with acceptable arguments
			'column data.txt',
			'date +%Y-%m-%d',
			'find . -name "*.txt"',
			'grep pattern file.txt',
			'sort file.txt',
			'tree directory'
		];
		const confirmationRequiredTestCases = [
			// Dangerous file operations
			'rm README.md',
			'rmdir folder',
			'del file.txt',
			'Remove-Item file.txt',
			'ri file.txt',
			'rd folder',
			'erase file.txt',
			'dd if=/dev/zero of=file',

			// Process management
			'kill 1234',
			'ps aux',
			'top',
			'Stop-Process -Id 1234',
			'spps notepad',
			'taskkill /f /im notepad.exe',
			'taskkill.exe /f /im cmd.exe',

			// Web requests
			'curl https://example.com',
			'wget https://example.com/file',
			'Invoke-RestMethod https://api.example.com',
			'Invoke-WebRequest https://example.com',
			'irm https://example.com',
			'iwr https://example.com',

			// File permissions
			'chmod 755 file.sh',
			'chown user:group file.txt',
			'Set-ItemProperty file.txt IsReadOnly $true',
			'sp file.txt IsReadOnly $true',
			'Set-Acl file.txt $acl',

			// Command execution
			'jq \'.name\' file.json',
			'xargs rm',
			'eval "echo hello"',
			'Invoke-Expression "Get-Date"',
			'iex "Write-Host test"',

			// Commands with dangerous arguments
			'column -c 10000 file.txt',
			'date --set="2023-01-01"',
			'find . -delete',
			'find . -exec rm {} \\;',
			'find . -execdir rm {} \\;',
			'find . -fprint output.txt',
			'sort -o /etc/passwd file.txt',
			'sort -S 100G file.txt',
			'tree -o output.txt',

			// Transient environment variables
			'ls="test" curl https://api.example.com',
			'API_KEY=secret curl https://api.example.com',
			'HTTP_PROXY=proxy:8080 wget https://example.com',
			'VAR1=value1 VAR2=value2 echo test',
			'A=1 B=2 C=3 ./script.sh',
		];

		suite.skip('auto approved', () => {
			for (const command of autoApprovedTestCases) {
				test(command.replaceAll('\n', '\\n'), async () => {
					assertAutoApproved(await executeToolTest({ command }));
				});
			}
		});
		suite('confirmation required', () => {
			for (const command of confirmationRequiredTestCases) {
				test(command.replaceAll('\n', '\\n'), async () => {
					assertConfirmationRequired(await executeToolTest({ command }));
				});
			}
		});
	});

	suite('prepareToolInvocation - auto approval behavior', () => {

		test('should auto-approve commands in allow list', async () => {
			setAutoApprove({
				echo: true
			});

			const result = await executeToolTest({ command: 'echo hello world' });
			assertAutoApproved(result);
		});

		test('should require confirmation for commands not in allow list', async () => {
			setAutoApprove({
				ls: true
			});

			const result = await executeToolTest({
				command: 'rm file.txt',
				explanation: 'Remove a file'
			});
			assertConfirmationRequired(result, 'Run `bash` command?');
		});

		test('should require confirmation for commands in deny list even if in allow list', async () => {
			setAutoApprove({
				rm: false,
				echo: true
			});

			const result = await executeToolTest({
				command: 'rm dangerous-file.txt',
				explanation: 'Remove a dangerous file'
			});
			assertConfirmationRequired(result, 'Run `bash` command?');
		});

		test('should handle background commands with confirmation', async () => {
			setAutoApprove({
				ls: true
			});

			const result = await executeToolTest({
				command: 'npm run watch',
				explanation: 'Start watching for file changes',
				isBackground: true
			});
			assertConfirmationRequired(result, 'Run `bash` command? (background terminal)');
		});

		test('should auto-approve background commands in allow list', async () => {
			setAutoApprove({
				npm: true
			});

			const result = await executeToolTest({
				command: 'npm run watch',
				explanation: 'Start watching for file changes',
				isBackground: true
			});
			assertAutoApproved(result);
		});

		test('should include auto-approve info for background commands', async () => {
			setAutoApprove({
				npm: true
			});

			const result = await executeToolTest({
				command: 'npm run watch',
				explanation: 'Start watching for file changes',
				isBackground: true
			});
			assertAutoApproved(result);

			// Verify that auto-approve information is included
			ok(result?.toolSpecificData, 'Expected toolSpecificData to be defined');
			// eslint-disable-next-line local/code-no-any-casts
			const terminalData = result!.toolSpecificData as any;
			ok(terminalData.autoApproveInfo, 'Expected autoApproveInfo to be defined for auto-approved background command');
			ok(terminalData.autoApproveInfo.value, 'Expected autoApproveInfo to have a value');
			ok(terminalData.autoApproveInfo.value.includes('npm'), 'Expected autoApproveInfo to mention the approved rule');
		});

		test('should handle regex patterns in allow list', async () => {
			setAutoApprove({
				'/^git (status|log)/': true
			});

			const result = await executeToolTest({ command: 'git status --porcelain' });
			assertAutoApproved(result);
		});

		test('should handle complex command chains with sub-commands', async () => {
			setAutoApprove({
				echo: true,
				ls: true
			});

			const result = await executeToolTest({ command: 'echo "hello" && ls -la' });
			assertAutoApproved(result);
		});

		test('should require confirmation when one sub-command is not approved', async () => {
			setAutoApprove({
				echo: true
			});

			const result = await executeToolTest({ command: 'echo "hello" && rm file.txt' });
			assertConfirmationRequired(result);
		});

		test('should handle empty command strings', async () => {
			setAutoApprove({
				echo: true
			});

			const result = await executeToolTest({
				command: '',
				explanation: 'Empty command'
			});
			assertAutoApproved(result);
		});

		test('should handle matchCommandLine: true patterns', async () => {
			setAutoApprove({
				'/dangerous/': { approve: false, matchCommandLine: true },
				'echo': { approve: true, matchCommandLine: true }
			});

			const result1 = await executeToolTest({ command: 'echo hello world' });
			assertAutoApproved(result1);

			const result2 = await executeToolTest({ command: 'echo this is a dangerous command' });
			assertConfirmationRequired(result2);
		});

		test('should only approve when neither sub-commands or command lines are denied', async () => {
			setAutoApprove({
				'foo': true,
				'/^foo$/': { approve: false, matchCommandLine: true },
			});

			const result1 = await executeToolTest({ command: 'foo' });
			assertConfirmationRequired(result1);

			const result2 = await executeToolTest({ command: 'foo bar' });
			assertAutoApproved(result2);
		});
	});

	suite('prepareToolInvocation - custom actions for dropdown', () => {

		function assertDropdownActions(result: IPreparedToolInvocation | undefined, items: ({ subCommand: SingleOrMany<string> } | 'commandLine' | '---' | 'configure' | 'sessionApproval')[]) {
			const actions = result?.confirmationMessages?.terminalCustomActions!;
			ok(actions, 'Expected custom actions to be defined');

			strictEqual(actions.length, items.length);

			for (const [i, item] of items.entries()) {
				const action = actions[i];
				if (item === '---') {
					ok(isSeparator(action));
				} else {
					ok(!isSeparator(action));
					if (item === 'configure') {
						strictEqual(action.label, 'Configure Auto Approve...');
						strictEqual(action.data.type, 'configure');
					} else if (item === 'sessionApproval') {
						strictEqual(action.label, 'Allow All Commands in this Session');
						strictEqual(action.data.type, 'sessionApproval');
					} else if (item === 'commandLine') {
						strictEqual(action.label, 'Always Allow Exact Command Line');
						strictEqual(action.data.type, 'newRule');
						ok(!Array.isArray(action.data.rule), 'Expected rule to be an object');
					} else {
						if (Array.isArray(item.subCommand)) {
							strictEqual(action.label, `Always Allow Commands: ${item.subCommand.join(', ')}`);
						} else {
							strictEqual(action.label, `Always Allow Command: ${item.subCommand}`);
						}
						strictEqual(action.data.type, 'newRule');
						ok(Array.isArray(action.data.rule), 'Expected rule to be an array');
					}
				}
			}
		}

		test('should generate custom actions for non-auto-approved commands', async () => {
			setAutoApprove({
				ls: true,
			});
			const result = await executeToolTest({
				command: 'npm run build',
				explanation: 'Build the project'
			});

			assertConfirmationRequired(result, 'Run `bash` command?');
			assertDropdownActions(result, [
				{ subCommand: 'npm run build' },
				'commandLine',
				'---',
				'sessionApproval',
				'---',
				'configure',
			]);
		});

		test('should generate custom actions for single word commands', async () => {
			const result = await executeToolTest({
				command: 'foo',
				explanation: 'Run foo command'
			});

			assertConfirmationRequired(result);
			assertDropdownActions(result, [
				{ subCommand: 'foo' },
				'---',
				'sessionApproval',
				'---',
				'configure',
			]);
		});

		test('should not generate custom actions for auto-approved commands', async () => {
			setAutoApprove({
				npm: true
			});
			const result = await executeToolTest({
				command: 'npm run build',
				explanation: 'Build the project'
			});

			assertAutoApproved(result);
		});

		test('should only generate configure action for explicitly denied commands', async () => {
			setAutoApprove({
				npm: { approve: false }
			});
			const result = await executeToolTest({
				command: 'npm run build',
				explanation: 'Build the project'
			});

			assertConfirmationRequired(result, 'Run `bash` command?');
			assertDropdownActions(result, [
				'sessionApproval',
				'---',
				'configure',
			]);
		});

		test('should handle && in command line labels with proper mnemonic escaping', async () => {
			const result = await executeToolTest({
				command: 'npm install && npm run build',
				explanation: 'Install dependencies and build'
			});

			assertConfirmationRequired(result, 'Run `bash` command?');
			assertDropdownActions(result, [
				{ subCommand: ['npm install', 'npm run build'] },
				'commandLine',
				'---',
				'sessionApproval',
				'---',
				'configure',
			]);
		});

		test('should not show approved commands in custom actions dropdown', async () => {
			setAutoApprove({
				head: true  // head is approved by default in real scenario
			});
			const result = await executeToolTest({
				command: 'foo | head -20',
				explanation: 'Run foo command and show first 20 lines'
			});

			assertConfirmationRequired(result, 'Run `bash` command?');
			assertDropdownActions(result, [
				{ subCommand: 'foo' },
				'commandLine',
				'---',
				'sessionApproval',
				'---',
				'configure',
			]);
		});

		test('should not show any command-specific actions when all sub-commands are approved', async () => {
			setAutoApprove({
				foo: true,
				head: true
			});
			const result = await executeToolTest({
				command: 'foo | head -20',
				explanation: 'Run foo command and show first 20 lines'
			});

			assertAutoApproved(result);
		});

		test('should handle mixed approved and unapproved commands correctly', async () => {
			setAutoApprove({
				head: true,
				tail: true
			});
			const result = await executeToolTest({
				command: 'foo | head -20 && bar | tail -10',
				explanation: 'Run multiple piped commands'
			});

			assertConfirmationRequired(result, 'Run `bash` command?');
			assertDropdownActions(result, [
				{ subCommand: ['foo', 'bar'] },
				'commandLine',
				'---',
				'sessionApproval',
				'---',
				'configure',
			]);
		});

		test('should suggest subcommand for git commands', async () => {
			const result = await executeToolTest({
				command: 'git status',
				explanation: 'Check git status'
			});

			assertConfirmationRequired(result);
			assertDropdownActions(result, [
				{ subCommand: 'git status' },
				'commandLine',
				'---',
				'sessionApproval',
				'---',
				'configure',
			]);
		});

		test('should suggest subcommand for npm commands', async () => {
			const result = await executeToolTest({
				command: 'npm test',
				explanation: 'Run npm tests'
			});

			assertConfirmationRequired(result);
			assertDropdownActions(result, [
				{ subCommand: 'npm test' },
				'commandLine',
				'---',
				'sessionApproval',
				'---',
				'configure',
			]);
		});

		test('should suggest 3-part subcommand for npm run commands', async () => {
			const result = await executeToolTest({
				command: 'npm run build',
				explanation: 'Run build script'
			});

			assertConfirmationRequired(result);
			assertDropdownActions(result, [
				{ subCommand: 'npm run build' },
				'commandLine',
				'---',
				'sessionApproval',
				'---',
				'configure',
			]);
		});

		test('should suggest 3-part subcommand for yarn run commands', async () => {
			const result = await executeToolTest({
				command: 'yarn run test',
				explanation: 'Run test script'
			});

			assertConfirmationRequired(result);
			assertDropdownActions(result, [
				{ subCommand: 'yarn run test' },
				'commandLine',
				'---',
				'sessionApproval',
				'---',
				'configure',
			]);
		});

		test('should not suggest subcommand for commands with flags', async () => {
			const result = await executeToolTest({
				command: 'foo --foo --bar',
				explanation: 'Run foo with flags'
			});

			assertConfirmationRequired(result);
			assertDropdownActions(result, [
				{ subCommand: 'foo' },
				'commandLine',
				'---',
				'sessionApproval',
				'---',
				'configure',
			]);
		});

		test('should not suggest subcommand for npm run with flags', async () => {
			const result = await executeToolTest({
				command: 'npm run abc --some-flag',
				explanation: 'Run npm run abc with flags'
			});

			assertConfirmationRequired(result);
			assertDropdownActions(result, [
				{ subCommand: 'npm run abc' },
				'commandLine',
				'---',
				'sessionApproval',
				'---',
				'configure',
			]);
		});

		test('should handle mixed npm run and other commands', async () => {
			const result = await executeToolTest({
				command: 'npm run build && git status',
				explanation: 'Build and check status'
			});

			assertConfirmationRequired(result);
			assertDropdownActions(result, [
				{ subCommand: ['npm run build', 'git status'] },
				'commandLine',
				'---',
				'sessionApproval',
				'---',
				'configure',
			]);
		});

		test('should suggest mixed subcommands and base commands', async () => {
			const result = await executeToolTest({
				command: 'git push && echo "done"',
				explanation: 'Push and print done'
			});

			assertConfirmationRequired(result);
			assertDropdownActions(result, [
				{ subCommand: ['git push', 'echo'] },
				'commandLine',
				'---',
				'sessionApproval',
				'---',
				'configure',
			]);
		});

		test('should suggest subcommands for multiple git commands', async () => {
			const result = await executeToolTest({
				command: 'git status && git log --oneline',
				explanation: 'Check status and log'
			});

			assertConfirmationRequired(result);
			assertDropdownActions(result, [
				{ subCommand: ['git status', 'git log'] },
				'commandLine',
				'---',
				'sessionApproval',
				'---',
				'configure',
			]);
		});

		test('should suggest base command for non-subcommand tools', async () => {
			const result = await executeToolTest({
				command: 'foo bar',
				explanation: 'Download from example.com'
			});

			assertConfirmationRequired(result);
			assertDropdownActions(result, [
				{ subCommand: 'foo' },
				'commandLine',
				'---',
				'sessionApproval',
				'---',
				'configure',
			]);
		});

		test('should handle single word commands from subcommand-aware tools', async () => {
			const result = await executeToolTest({
				command: 'git',
				explanation: 'Run git command'
			});

			assertConfirmationRequired(result);
			assertDropdownActions(result, [
				'sessionApproval',
				'---',
				'configure',
			]);
		});

		test('should deduplicate identical subcommand suggestions', async () => {
			const result = await executeToolTest({
				command: 'npm test && npm test --verbose',
				explanation: 'Run tests twice'
			});

			assertConfirmationRequired(result);
			assertDropdownActions(result, [
				{ subCommand: 'npm test' },
				'commandLine',
				'---',
				'sessionApproval',
				'---',
				'configure',
			]);
		});

		test('should handle flags differently than subcommands for suggestion logic', async () => {
			const result = await executeToolTest({
				command: 'foo --version',
				explanation: 'Check foo version'
			});

			assertConfirmationRequired(result);
			assertDropdownActions(result, [
				{ subCommand: 'foo' },
				'commandLine',
				'---',
				'sessionApproval',
				'---',
				'configure',
			]);
		});

		test('should not suggest overly permissive subcommand rules', async () => {
			const result = await executeToolTest({
				command: 'bash -c "echo hello"',
				explanation: 'Run bash command'
			});

			assertConfirmationRequired(result);
			assertDropdownActions(result, [
				'commandLine',
				'---',
				'sessionApproval',
				'---',
				'configure',
			]);
		});

		test('should not show command line option when it\'s rejected', async () => {
			setAutoApprove({
				echo: true,
				'/\\(.+\\)/s': { approve: false, matchCommandLine: true }
			});

			const result = await executeToolTest({
				command: 'echo (abc)'
			});

			assertConfirmationRequired(result);
			assertDropdownActions(result, [
				'sessionApproval',
				'---',
				'configure',
			]);
		});

		test('should prevent auto approval when writing to a file outside the workspace', async () => {
			setConfig(TerminalChatAgentToolsSettingId.BlockDetectedFileWrites, 'outsideWorkspace');
			setAutoApprove({});

			const workspaceFolder = URI.file(isWindows ? 'C:/workspace/project' : '/workspace/project');
			const workspace = new Workspace('test', [toWorkspaceFolder(workspaceFolder)]);
			workspaceContextService.setWorkspace(workspace);
			instantiationService.stub(IHistoryService, {
				getLastActiveWorkspaceRoot: () => workspaceFolder
			});

			const result = await executeToolTest({
				command: 'echo "abc" > ../file.txt'
			});

			assertConfirmationRequired(result);
			strictEqual(result?.confirmationMessages?.terminalCustomActions, undefined, 'Expected no custom actions when file write is blocked');
		});
	});

	suite('chat session disposal cleanup', () => {
		test('should dispose associated terminals when chat session is disposed', () => {
			const sessionId = 'test-session-123';
			// eslint-disable-next-line local/code-no-any-casts
			const mockTerminal: ITerminalInstance = {
				dispose: () => { /* Mock dispose */ },
				processId: 12345
			} as any;
			let terminalDisposed = false;
			mockTerminal.dispose = () => { terminalDisposed = true; };

			runInTerminalTool.sessionTerminalAssociations.set(sessionId, {
				instance: mockTerminal,
				shellIntegrationQuality: ShellIntegrationQuality.None
			});

			ok(runInTerminalTool.sessionTerminalAssociations.has(sessionId), 'Terminal association should exist before disposal');

			chatServiceDisposeEmitter.fire({ sessionResource: [LocalChatSessionUri.forSession(sessionId)], reason: 'cleared' });

			strictEqual(terminalDisposed, true, 'Terminal should have been disposed');
			ok(!runInTerminalTool.sessionTerminalAssociations.has(sessionId), 'Terminal association should be removed after disposal');
		});

		test('should not affect other sessions when one session is disposed', () => {
			const sessionId1 = 'test-session-1';
			const sessionId2 = 'test-session-2';
			// eslint-disable-next-line local/code-no-any-casts
			const mockTerminal1: ITerminalInstance = {
				dispose: () => { /* Mock dispose */ },
				processId: 12345
			} as any;
			// eslint-disable-next-line local/code-no-any-casts
			const mockTerminal2: ITerminalInstance = {
				dispose: () => { /* Mock dispose */ },
				processId: 67890
			} as any;

			let terminal1Disposed = false;
			let terminal2Disposed = false;
			mockTerminal1.dispose = () => { terminal1Disposed = true; };
			mockTerminal2.dispose = () => { terminal2Disposed = true; };

			runInTerminalTool.sessionTerminalAssociations.set(sessionId1, {
				instance: mockTerminal1,
				shellIntegrationQuality: ShellIntegrationQuality.None
			});
			runInTerminalTool.sessionTerminalAssociations.set(sessionId2, {
				instance: mockTerminal2,
				shellIntegrationQuality: ShellIntegrationQuality.None
			});

			ok(runInTerminalTool.sessionTerminalAssociations.has(sessionId1), 'Session 1 terminal association should exist');
			ok(runInTerminalTool.sessionTerminalAssociations.has(sessionId2), 'Session 2 terminal association should exist');

			chatServiceDisposeEmitter.fire({ sessionResource: [LocalChatSessionUri.forSession(sessionId1)], reason: 'cleared' });

			strictEqual(terminal1Disposed, true, 'Terminal 1 should have been disposed');
			strictEqual(terminal2Disposed, false, 'Terminal 2 should NOT have been disposed');
			ok(!runInTerminalTool.sessionTerminalAssociations.has(sessionId1), 'Session 1 terminal association should be removed');
			ok(runInTerminalTool.sessionTerminalAssociations.has(sessionId2), 'Session 2 terminal association should remain');
		});

		test('should handle disposal of non-existent session gracefully', () => {
			strictEqual(runInTerminalTool.sessionTerminalAssociations.size, 0, 'No associations should exist initially');
			chatServiceDisposeEmitter.fire({ sessionResource: [LocalChatSessionUri.forSession('non-existent-session')], reason: 'cleared' });
			strictEqual(runInTerminalTool.sessionTerminalAssociations.size, 0, 'No associations should exist after handling non-existent session');
		});
	});

	suite('auto approve warning acceptance mechanism', () => {
		test('should require confirmation for auto-approvable commands when warning not accepted', async () => {
			setConfig(TerminalChatAgentToolsSettingId.EnableAutoApprove, true);
			setAutoApprove({
				echo: true
			});

			clearAutoApproveWarningAcceptedState();

			assertConfirmationRequired(await executeToolTest({ command: 'echo hello world' }), 'Run `bash` command?');
		});

		test('should auto-approve commands when both auto-approve enabled and warning accepted', async () => {
			setConfig(TerminalChatAgentToolsSettingId.EnableAutoApprove, true);
			setAutoApprove({
				echo: true
			});

			assertAutoApproved(await executeToolTest({ command: 'echo hello world' }));
		});

		test('should require confirmation when auto-approve disabled regardless of warning acceptance', async () => {
			setConfig(TerminalChatAgentToolsSettingId.EnableAutoApprove, false);
			setAutoApprove({
				echo: true
			});

			const result = await executeToolTest({ command: 'echo hello world' });
			assertConfirmationRequired(result, 'Run `bash` command?');
		});
	});

	suite('unique rules deduplication', () => {
		test('should properly deduplicate rules with same sourceText in auto-approve info', async () => {
			setAutoApprove({
				echo: true
			});

			const result = await executeToolTest({ command: 'echo hello && echo world' });
			assertAutoApproved(result);

			const autoApproveInfo = (result!.toolSpecificData as IChatTerminalToolInvocationData).autoApproveInfo!;
			ok(autoApproveInfo);
			ok(autoApproveInfo.value.includes('Auto approved by rule '), 'should contain singular "rule", not plural');
			strictEqual(count(autoApproveInfo.value, 'echo'), 1);
		});
	});

	suite('session auto approval', () => {
		test('should auto approve all commands when session has auto approval enabled', async () => {
			const sessionId = 'test-session-123';
			const terminalChatService = instantiationService.get(ITerminalChatService);

			const context: IToolInvocationPreparationContext = {
				parameters: {
					command: 'rm dangerous-file.txt',
					explanation: 'Remove a file',
					isBackground: false
				} as IRunInTerminalInputParams,
				chatSessionId: sessionId
			} as IToolInvocationPreparationContext;

			let result = await runInTerminalTool.prepareToolInvocation(context, CancellationToken.None);
			assertConfirmationRequired(result);

			terminalChatService.setChatSessionAutoApproval(sessionId, true);

			result = await runInTerminalTool.prepareToolInvocation(context, CancellationToken.None);
			assertAutoApproved(result);

			const terminalData = result!.toolSpecificData as IChatTerminalToolInvocationData;
			ok(terminalData.autoApproveInfo, 'Expected autoApproveInfo to be defined');
			ok(terminalData.autoApproveInfo.value.includes('Auto approved for this session'), 'Expected session approval message');
		});
	});

	suite('TerminalProfileFetcher', () => {
		suite('getCopilotProfile', () => {
			(isWindows ? test : test.skip)('should return custom profile when configured', async () => {
				runInTerminalTool.setBackendOs(OperatingSystem.Windows);
				const customProfile = Object.freeze({ path: 'C:\\Windows\\System32\\powershell.exe', args: ['-NoProfile'] });
				setConfig(TerminalChatAgentToolsSettingId.TerminalProfileWindows, customProfile);

				const result = await runInTerminalTool.profileFetcher.getCopilotProfile();
				strictEqual(result, customProfile);
			});

			(isLinux ? test : test.skip)('should fall back to default shell when no custom profile is configured', async () => {
				runInTerminalTool.setBackendOs(OperatingSystem.Linux);
				setConfig(TerminalChatAgentToolsSettingId.TerminalProfileLinux, null);

				const result = await runInTerminalTool.profileFetcher.getCopilotProfile();
				strictEqual(typeof result, 'object');
				strictEqual((result as ITerminalProfile).path, 'bash');
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/test/electron-browser/treeSitterCommandParser.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/test/electron-browser/treeSitterCommandParser.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual } from 'assert';
import { Schemas } from '../../../../../../base/common/network.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { ITreeSitterLibraryService } from '../../../../../../editor/common/services/treeSitter/treeSitterLibraryService.js';
import { FileService } from '../../../../../../platform/files/common/fileService.js';
import type { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { NullLogService } from '../../../../../../platform/log/common/log.js';
import { TreeSitterLibraryService } from '../../../../../services/treeSitter/browser/treeSitterLibraryService.js';
import { workbenchInstantiationService } from '../../../../../test/browser/workbenchTestServices.js';
import { TestIPCFileSystemProvider } from '../../../../../test/electron-browser/workbenchTestServices.js';
import { TreeSitterCommandParser, TreeSitterCommandParserLanguage } from '../../browser/treeSitterCommandParser.js';

suite('TreeSitterCommandParser', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let parser: TreeSitterCommandParser;

	setup(() => {
		const fileService = store.add(new FileService(new NullLogService()));
		const fileSystemProvider = new TestIPCFileSystemProvider();
		store.add(fileService.registerProvider(Schemas.file, fileSystemProvider));

		instantiationService = workbenchInstantiationService({
			fileService: () => fileService,
		}, store);

		const treeSitterLibraryService = store.add(instantiationService.createInstance(TreeSitterLibraryService));
		treeSitterLibraryService.isTest = true;
		instantiationService.stub(ITreeSitterLibraryService, treeSitterLibraryService);

		parser = store.add(instantiationService.createInstance(TreeSitterCommandParser));
	});

	suite('extractSubCommands', () => {
		suite('bash', () => {
			async function t(commandLine: string, expectedCommands: string[]) {
				const result = await parser.extractSubCommands(TreeSitterCommandParserLanguage.Bash, commandLine);
				deepStrictEqual(result, expectedCommands);
			}

			test('simple commands', () => t('ls -la', ['ls -la']));
			test('commands with &&', () => t('echo hello && ls -la', ['echo hello', 'ls -la']));
			test('commands with ||', () => t('test -f file.txt || touch file.txt', ['test -f file.txt', 'touch file.txt']));
			test('commands with semicolons', () => t('cd /tmp; ls; pwd', ['cd /tmp', 'ls', 'pwd']));
			test('pipe chains', () => t('cat file.txt | grep pattern | sort | uniq', ['cat file.txt', 'grep pattern', 'sort', 'uniq']));
			test('commands with subshells', () => t('echo $(date +%Y) && ls', ['echo $(date +%Y)', 'date +%Y', 'ls']));
			test('complex quoting', () => t('echo "hello && world" && echo \'test\'', ['echo "hello && world"', 'echo \'test\'']));
			test('escaped characters', () => t('echo hello\\ world && ls', ['echo hello\\ world', 'ls']));
			test('background commands', () => t('sleep 10 & echo done', ['sleep 10', 'echo done']));
			test('variable assignments', () => t('VAR=value command1 && echo $VAR', ['VAR=value command1', 'echo $VAR']));
			test('redirections', () => t('echo hello > file.txt && cat < file.txt', ['echo hello', 'cat']));
			test('arithmetic expansion', () => t('echo $((1 + 2)) && ls', ['echo $((1 + 2))', 'ls']));
			test('nested command substitution', () => t('echo $(cat $(echo file.txt)) && ls', ['echo $(cat $(echo file.txt))', 'cat $(echo file.txt)', 'echo file.txt', 'ls']));
			test('mixed operators', () => t('cmd1 && cmd2 || cmd3; cmd4 | cmd5 & cmd6', ['cmd1', 'cmd2', 'cmd3', 'cmd4', 'cmd5', 'cmd6']));
			test('parameter expansion', () => t('echo ${VAR:-default} && echo ${#VAR}', ['echo ${VAR:-default}', 'echo ${#VAR}']));
			test('process substitution', () => t('diff <(sort file1) <(sort file2) && echo done', ['diff <(sort file1) <(sort file2)', 'sort file1', 'sort file2', 'echo done']));
			test('brace expansion', () => t('echo {a,b,c}.txt && ls', ['echo {a,b,c}.txt', 'ls']));
			test('tilde expansion', () => t('cd ~/Documents && ls ~/.bashrc', ['cd ~/Documents', 'ls ~/.bashrc']));

			suite('control flow and structures', () => {
				test('if-then-else', () => t('if [ -f file.txt ]; then cat file.txt; else echo "not found"; fi', ['cat file.txt', 'echo "not found"']));
				test('simple iteration', () => t('for file in *.txt; do cat "$file"; done', ['cat "$file"']));
				test('function declaration and call', () => t('function test_func() { echo "inside function"; } && test_func', ['echo "inside function"', 'test_func']));
				test('heredoc with commands', () => t('cat << EOF\nhello\nworld\nEOF\necho done', ['cat', 'echo done']));
				test('while loop', () => t('while read line; do echo "$line"; done < file.txt', ['read line', 'echo "$line"']));
				test('case statement', () => t('case $var in pattern1) echo "match1" ;; pattern2) echo "match2" ;; esac', ['echo "match1"', 'echo "match2"']));
				test('until loop', () => t('until [ -f ready.txt ]; do sleep 1; done && echo ready', ['sleep 1', 'echo ready']));
				test('nested conditionals', () => t('if [ -f file ]; then if [ -r file ]; then cat file; fi; fi', ['cat file']));
				test('test command alternatives', () => t('[[ -f file ]] && cat file || echo missing', ['cat file', 'echo missing']));
			});

			suite('edge cases', () => {
				test('malformed syntax', () => t('echo "unclosed quote && ls', ['echo']));
				test('unmatched parentheses', () => t('echo $(missing closing && ls', ['echo $(missing closing && ls', 'missing closing', 'ls']));
				test('very long command lines', () => t('echo ' + 'a'.repeat(10000) + ' && ls', ['echo ' + 'a'.repeat(10000), 'ls']));
				test('special characters', () => t('echo "πλαςε 测试 🚀" && ls', ['echo "πλαςε 测试 🚀"', 'ls']));
				test('multiline with continuations', () => t('echo hello \\\n&& echo world \\\n&& ls', ['echo hello', 'echo world', 'ls']));
				test('commands with comments', () => t('echo hello # this is a comment\nls # another comment', ['echo hello', 'ls']));
				test('empty command in chain', () => t('echo hello && && echo world', ['echo hello', 'echo world']));
				test('trailing operators', () => t('echo hello &&', ['echo hello', '']));
				test('only operators', () => t('&& || ;', []));
				test('nested quotes', () => t('echo "outer \"inner\" outer" && ls', ['echo "outer \"inner\" outer"', 'ls']));
				test('incomplete escape sequences', () => t('echo hello\\ && ls', ['echo hello\\ ', 'ls']));
				test('mixed quote types', () => t('echo "hello \`world\`" && echo \'test\'', ['echo "hello \`world\`"', 'world', 'echo \'test\'']));
				test('deeply nested structures', () => t('echo $(echo $(echo $(echo nested))) && ls', ['echo $(echo $(echo $(echo nested)))', 'echo $(echo $(echo nested))', 'echo $(echo nested)', 'echo nested', 'ls']));
				test('unicode command names', () => t('测试命令 && echo done', ['测试命令', 'echo done']));
				test('multi-line', () => t('echo a\necho b', ['echo a', 'echo b']));
			});

			// TODO: These should be common but the pwsh grammar doesn't handle && yet https://github.com/microsoft/vscode/issues/272704
			suite('real-world scenarios', () => {
				test('complex Docker commands', () => t('docker run -it --rm -v $(pwd):/app ubuntu:latest bash -c "cd /app && npm install && npm test"', ['docker run -it --rm -v $(pwd):/app ubuntu:latest bash -c "cd /app && npm install && npm test"', 'pwd']));
				test('Git workflow commands', () => t('git add . && git commit -m "Update feature" && git push origin main', [
					'git add .',
					'git commit -m "Update feature"',
					'git push origin main'
				]));
				test('npm/yarn workflow commands', () => t('npm ci && npm run build && npm test && npm run lint', [
					'npm ci',
					'npm run build',
					'npm test',
					'npm run lint'
				]));
				test('build system commands', () => t('make clean && make -j$(nproc) && make install PREFIX=/usr/local', [
					'make clean',
					'make -j$(nproc)',
					'nproc',
					'make install PREFIX=/usr/local'
				]));
				test('deployment script', () => t('rsync -avz --delete src/ user@server:/path/ && ssh user@server "systemctl restart service" && echo "Deployed successfully"', [
					'rsync -avz --delete src/ user@server:/path/',
					'ssh user@server "systemctl restart service"',
					'echo "Deployed successfully"'
				]));
				test('database backup script', () => t('mysqldump -u user -p database > backup_$(date +%Y%m%d).sql && gzip backup_$(date +%Y%m%d).sql && echo "Backup complete"', [
					'mysqldump -u user -p database',
					'date +%Y%m%d',
					'gzip backup_$(date +%Y%m%d).sql',
					'date +%Y%m%d',
					'echo "Backup complete"'
				]));
				test('log analysis pipeline', () => t('tail -f /var/log/app.log | grep ERROR | while read line; do echo "$(date): $line" >> error.log; done', [
					'tail -f /var/log/app.log',
					'grep ERROR',
					'read line',
					'echo "$(date): $line"',
					'date'
				]));
				test('conditional installation', () => t('which docker || (curl -fsSL https://get.docker.com | sh && systemctl enable docker) && docker --version', [
					'which docker',
					'curl -fsSL https://get.docker.com',
					'sh',
					'systemctl enable docker',
					'docker --version'
				]));
			});
		});

		suite('pwsh', () => {
			async function t(commandLine: string, expectedCommands: string[]) {
				const result = await parser.extractSubCommands(TreeSitterCommandParserLanguage.PowerShell, commandLine);
				deepStrictEqual(result, expectedCommands);
			}

			test('simple commands', () => t('Get-ChildItem -Path C:\\', ['Get-ChildItem -Path C:\\']));
			test('commands with semicolons', () => t('Get-Date; Get-Location; Write-Host "done"', ['Get-Date', 'Get-Location', 'Write-Host "done"']));
			test('pipeline commands', () => t('Get-Process | Where-Object {$_.CPU -gt 100} | Sort-Object CPU', ['Get-Process ', 'Where-Object {$_.CPU -gt 100} ', 'Sort-Object CPU']));
			test('command substitution', () => t('Write-Host $(Get-Date) ; Get-Location', ['Write-Host $(Get-Date)', 'Get-Date', 'Get-Location']));
			test('complex parameters', () => t('Get-ChildItem -Path "C:\\Program Files" -Recurse -Include "*.exe"', ['Get-ChildItem -Path "C:\\Program Files" -Recurse -Include "*.exe"']));
			test('splatting', () => t('$params = @{Path="C:\\"; Recurse=$true}; Get-ChildItem @params', ['Get-ChildItem @params']));
			test('here-strings', () => t('Write-Host @"\nhello\nworld\n"@ ; Get-Date', ['Write-Host @"\nhello\nworld\n"@', 'Get-Date']));
			test('method calls', () => t('"hello".ToUpper() ; Get-Date', ['Get-Date']));
			test('complex quoting', () => t('Write-Host "She said `"Hello`"" ; Write-Host \'Single quotes\'', ['Write-Host "She said `"Hello`""', 'Write-Host \'Single quotes\'']));
			test('array operations', () => t('$arr = @(1,2,3); $arr | ForEach-Object { $_ * 2 }', ['ForEach-Object { $_ * 2 }']));
			test('hashtable operations', () => t('$hash = @{key="value"}; Write-Host $hash.key', ['Write-Host $hash.key']));
			test('type casting', () => t('[int]"123" + [int]"456" ; Write-Host "done"', ['Write-Host "done"']));
			test('regex operations', () => t('"hello world" -match "w.*d" ; Get-Date', ['Get-Date']));
			test('comparison operators', () => t('5 -gt 3 -and "hello" -like "h*" ; Write-Host "true"', ['Write-Host "true"']));
			test('null-conditional operators', () => t('$obj?.Property?.SubProperty ; Get-Date', ['Get-Date']));
			test('string interpolation', () => t('$name="World"; "Hello $name" ; Get-Date', ['Get-Date']));
			test('expandable strings', () => t('$var="test"; "Value: $($var.ToUpper())" ; Get-Date', ['Get-Date']));

			suite('Control flow and structures', () => {
				test('logical and', () => t('Test-Path "file.txt" -and Get-Content "file.txt"', ['Test-Path "file.txt" -and Get-Content "file.txt"']));
				test('foreach with script block', () => t('ForEach-Object { Write-Host $_.Name } ; Get-Date', ['ForEach-Object { Write-Host $_.Name }', 'Write-Host $_.Name', 'Get-Date']));
				test('if-else', () => t('if (Test-Path "file.txt") { Get-Content "file.txt" } else { Write-Host "not found" }', ['Test-Path "file.txt"', 'Get-Content "file.txt"', 'Write-Host "not found"']));
				test('error handling', () => t('try { Get-Content "file.txt" } catch { Write-Error "failed" }', ['Get-Content "file.txt"', 'Write-Error "failed"']));
				test('switch statement', () => t('switch ($var) { 1 { "one" } 2 { "two" } default { "other" } } ; Get-Date', ['Get-Date']));
				test('do-while loop', () => t('do { Write-Host $i; $i++ } while ($i -lt 5) ; Get-Date', ['Write-Host $i', 'Get-Date']));
				test('for loop', () => t('for ($i=0; $i -lt 5; $i++) { Write-Host $i } ; Get-Date', ['Write-Host $i', 'Get-Date']));
				test('foreach loop with range', () => t('foreach ($i in 1..5) { Write-Host $i } ; Get-Date', ['1..5', 'Write-Host $i', 'Get-Date']));
				test('break and continue', () => t('while ($true) { if ($condition) { break } ; Write-Host "running" } ; Get-Date', ['Write-Host "running"', 'Get-Date']));
				test('nested try-catch-finally', () => t('try { try { Get-Content "file" } catch { throw } } catch { Write-Error "outer" } finally { Write-Host "cleanup" }', ['Get-Content "file"', 'Write-Error "outer"', 'Write-Host "cleanup"']));
				test('parallel processing', () => t('1..10 | ForEach-Object -Parallel { Start-Sleep 1; Write-Host $_ } ; Get-Date', ['1..10 ', 'ForEach-Object -Parallel { Start-Sleep 1; Write-Host $_ }', 'Start-Sleep 1', 'Write-Host $_', 'Get-Date']));
			});
		});

		suite('all shells', () => {
			async function t(commandLine: string, expectedCommands: string[]) {
				for (const shell of [TreeSitterCommandParserLanguage.Bash, TreeSitterCommandParserLanguage.PowerShell]) {
					const result = await parser.extractSubCommands(shell, commandLine);
					deepStrictEqual(result, expectedCommands);
				}
			}

			suite('edge cases', () => {
				test('empty strings', () => t('', []));
				test('whitespace-only strings', () => t('   \n\t  ', []));
			});
		});
	});

	suite('extractPwshDoubleAmpersandChainOperators', () => {
		async function t(commandLine: string, expectedMatches: string[]) {
			const result = await parser.extractPwshDoubleAmpersandChainOperators(commandLine);
			const actualMatches = result.map(capture => capture.node.text);
			deepStrictEqual(actualMatches, expectedMatches);
		}

		test('simple command with &&', () => t('Get-Date && Get-Location', ['&&']));
		test('multiple && operators', () => t('echo first && echo second && echo third', ['&&', '&&']));
		test('mixed operators - && and ;', () => t('echo hello && echo world ; echo done', ['&&']));
		test('no && operators', () => t('Get-Date ; Get-Location', []));
		test('&& in string literal should not match', () => t('Write-Host "test && test"', []));
		test('&& in single quotes should not match', () => t('Write-Host \'test && test\'', []));
		test('&& with complex commands', () => t('Get-ChildItem -Path C:\\ && Set-Location C:\\Users', ['&&']));
		test('&& with parameters', () => t('Get-Process -Name notepad && Stop-Process -Name notepad', ['&&']));
		test('&& with pipeline inside', () => t('Get-Process | Where-Object {$_.Name -eq "notepad"} && Write-Host "Found"', ['&&']));
		test('nested && in script blocks', () => t('if ($true) { echo hello && echo world }', ['&&']));
		test('&& with method calls', () => t('"hello".ToUpper() && "world".ToLower()', ['&&']));
		test('&& with array operations', () => t('@(1,2,3) | ForEach-Object { $_ } && Write-Host "done"', ['&&']));
		test('&& with hashtable', () => t('@{key="value"} && Write-Host "created"', ['&&']));
		test('&& with type casting', () => t('[int]"123" && [string]456', ['&&']));
		test('&& with comparison operators', () => t('5 -gt 3 && "hello" -like "h*"', ['&&']));
		test('&& with variable assignment', () => t('$var = "test" && Write-Host $var', ['&&']));
		test('&& with expandable strings', () => t('$name="World" && "Hello $name"', ['&&']));
		test('&& with subexpressions', () => t('Write-Host $(Get-Date) && Get-Location', ['&&']));
		test('&& with here-strings', () => t('Write-Host @"\nhello\nworld\n"@ && Get-Date', ['&&']));
		test('&& with splatting', () => t('$params = @{Path="C:\\"}; Get-ChildItem @params && Write-Host "done"', ['&&']));

		suite('complex scenarios', () => {
			test('multiple && with different command types', () => t('Get-Service && Start-Service spooler && Get-Process', ['&&', '&&']));
			test('&& with error handling', () => t('try { Get-Content "file.txt" && Write-Host "success" } catch { Write-Error "failed" }', ['&&']));
			test('&& inside foreach', () => t('ForEach-Object { Write-Host $_.Name && Write-Host $_.Length }', ['&&']));
			test('&& with conditional logic', () => t('if (Test-Path "file.txt") { Get-Content "file.txt" && Write-Host "read" }', ['&&']));
			test('&& with switch statement', () => t('switch ($var) { 1 { "one" && "first" } 2 { "two" && "second" } }', ['&&', '&&']));
			test('&& in do-while', () => t('do { Write-Host $i && $i++ } while ($i -lt 5)', ['&&']));
			test('&& in for loop', () => t('for ($i=0; $i -lt 5; $i++) { Write-Host $i && Start-Sleep 1 }', ['&&']));
			test('&& with parallel processing', () => t('1..10 | ForEach-Object -Parallel { Write-Host $_ && Start-Sleep 1 }', ['&&']));
		});

		suite('edge cases', () => {
			test('empty string', () => t('', []));
			test('whitespace only', () => t('   \n\t  ', []));
			test('triple &&&', () => t('echo hello &&& echo world', ['&&']));
			test('spaced && operators', () => t('echo hello & & echo world', []));
			test('&& with unicode', () => t('Write-Host "测试" && Write-Host "🚀"', ['&&']));
			test('very long command with &&', () => t('Write-Host "' + 'a'.repeat(1000) + '" && Get-Date', ['&&']));
			test('deeply nested with &&', () => t('if ($true) { if ($true) { if ($true) { echo nested && echo deep } } }', ['&&']));
			test('&& with escaped characters', () => t('Write-Host "hello`"world" && Get-Date', ['&&']));
			test('&& with backticks', () => t('Write-Host `hello && Get-Date', ['&&']));
		});

		suite('real-world scenarios', () => {
			test('git workflow', () => t('git add . && git commit -m "message" && git push', ['&&', '&&']));
			test('build and test', () => t('dotnet build && dotnet test && dotnet publish', ['&&', '&&']));
			test('file operations', () => t('New-Item -Type File "test.txt" && Add-Content "test.txt" "hello" && Get-Content "test.txt"', ['&&', '&&']));
			test('service management', () => t('Stop-Service spooler && Set-Service spooler -StartupType Manual && Start-Service spooler', ['&&', '&&']));
			test('registry operations', () => t('New-Item -Path "HKCU:\\Software\\Test" && Set-ItemProperty -Path "HKCU:\\Software\\Test" -Name "Value" -Value "Data"', ['&&']));
			test('module import and usage', () => t('Import-Module ActiveDirectory && Get-ADUser -Filter *', ['&&']));
			test('remote operations', () => t('Enter-PSSession -ComputerName server && Get-Process && Exit-PSSession', ['&&', '&&']));
			test('scheduled task', () => t('Register-ScheduledTask -TaskName "MyTask" -Action (New-ScheduledTaskAction -Execute "powershell.exe") && Start-ScheduledTask "MyTask"', ['&&']));
		});
	});

	suite('getFileWrites', () => {
		suite('bash', () => {
			async function t(commandLine: string, expectedFiles: string[]) {
				const actualFiles = await parser.getFileWrites(TreeSitterCommandParserLanguage.Bash, commandLine);
				deepStrictEqual(actualFiles, expectedFiles);
			}

			test('simple output redirection', () => t('echo hello > file.txt', ['file.txt']));
			test('append redirection', () => t('echo hello >> file.txt', ['file.txt']));
			test('multiple redirections', () => t('echo hello > file1.txt && echo world > file2.txt', ['file1.txt', 'file2.txt']));
			test('error redirection', () => t('command 2> error.log', ['error.log']));
			test('combined stdout and stderr', () => t('command > output.txt 2>&1', ['output.txt']));
			test('here document', () => t('cat > file.txt << EOF\nhello\nworld\nEOF', ['file.txt']));
			test('quoted filenames', () => t('echo hello > "file with spaces.txt"', ['"file with spaces.txt"']));
			test('single quoted filenames', () => t('echo hello > \'file.txt\'', ['\'file.txt\'']));
			test('variable in filename', () => t('echo hello > $HOME/file.txt', ['$HOME/file.txt']));
			test('command substitution in filename', () => t('echo hello > $(date +%Y%m%d).log', ['$(date +%Y%m%d).log']));
			test('tilde expansion in filename', () => t('echo hello > ~/file.txt', ['~/file.txt']));
			test('absolute path', () => t('echo hello > /tmp/file.txt', ['/tmp/file.txt']));
			test('relative path', () => t('echo hello > ./output/file.txt', ['./output/file.txt']));
			test('file descriptor redirection', () => t('command 3> file.txt', ['file.txt']));
			test('redirection with numeric file descriptor', () => t('command 1> stdout.txt 2> stderr.txt', ['stdout.txt', 'stderr.txt']));
			test('append with error redirection', () => t('command >> output.log 2>> error.log', ['output.log', 'error.log']));

			suite('complex scenarios', () => {
				test('multiple commands with redirections', () => t('echo first > file1.txt; echo second > file2.txt; echo third > file3.txt', ['file1.txt', 'file2.txt', 'file3.txt']));
				test('pipeline with redirection', () => t('cat input.txt | grep pattern > output.txt', ['output.txt']));
				test('redirection in subshell', () => t('(echo hello; echo world) > combined.txt', ['combined.txt']));
				test('redirection with background job', () => t('long_command > output.txt &', ['output.txt']));
				test('conditional redirection', () => t('test -f input.txt && cat input.txt > output.txt || echo "not found" > error.txt', ['output.txt', 'error.txt']));
				test('loop with redirection', () => t('for file in *.txt; do cat "$file" >> combined.txt; done', ['combined.txt']));
				test('function with redirection', () => t('function backup() { cp "$1" > backup_"$1"; }', ['backup_"$1"']));
			});

			suite('edge cases', () => {
				test('no redirections', () => t('echo hello', []));
				test('input redirection only', () => t('sort < input.txt', ['input.txt']));
				test('pipe without redirection', () => t('echo hello | grep hello', []));
				test('redirection to /dev/null', () => t('command > /dev/null', ['/dev/null']));
				test('redirection to device', () => t('echo hello > /dev/tty', ['/dev/tty']));
				test('special characters in filename', () => t('echo hello > file-with_special.chars123.txt', ['file-with_special.chars123.txt']));
				test('unicode filename', () => t('echo hello > 测试文件.txt', ['测试文件.txt']));
				test('very long filename', () => t('echo hello > ' + 'a'.repeat(100) + '.txt', [Array(100).fill('a').join('') + '.txt']));
			});
		});

		suite('pwsh', () => {
			async function t(commandLine: string, expectedFiles: string[]) {
				const actualFiles = await parser.getFileWrites(TreeSitterCommandParserLanguage.PowerShell, commandLine);
				deepStrictEqual(actualFiles, expectedFiles);
			}

			test('simple output redirection', () => t('Write-Host "hello" > file.txt', ['file.txt']));
			test('append redirection', () => t('Write-Host "hello" >> file.txt', ['file.txt']));
			test('multiple redirections', () => t('Write-Host "hello" > file1.txt ; Write-Host "world" > file2.txt', ['file1.txt', 'file2.txt']));
			test('error redirection', () => t('Get-Content missing.txt 2> error.log', ['error.log']));
			test('warning redirection', () => t('Write-Warning "test" 3> warning.log', ['warning.log']));
			test('verbose redirection', () => t('Write-Verbose "test" 4> verbose.log', ['verbose.log']));
			test('debug redirection', () => t('Write-Debug "test" 5> debug.log', ['debug.log']));
			test('information redirection', () => t('Write-Information "test" 6> info.log', ['info.log']));
			test('all streams redirection', () => t('Get-Process *> all.log', ['all.log']));
			test('quoted filenames', () => t('Write-Host "hello" > "file with spaces.txt"', ['"file with spaces.txt"']));
			test('single quoted filenames', () => t('Write-Host "hello" > \'file.txt\'', ['\'file.txt\'']));
			test('variable in filename', () => t('Write-Host "hello" > $env:TEMP\\file.txt', ['$env:TEMP\\file.txt']));
			test('subexpression in filename', () => t('Write-Host "hello" > $(Get-Date -Format "yyyyMMdd").log', ['$(Get-Date -Format "yyyyMMdd").log']));
			test('Windows path', () => t('Write-Host "hello" > C:\\temp\\file.txt', ['C:\\temp\\file.txt']));
			test('UNC path', () => t('Write-Host "hello" > \\\\server\\share\\file.txt', ['\\\\server\\share\\file.txt']));
			test('relative path', () => t('Write-Host "hello" > .\\output\\file.txt', ['.\\output\\file.txt']));

			suite('complex scenarios', () => {
				test('pipeline with redirection', () => t('Get-Process | Where-Object {$_.CPU -gt 100} > processes.txt', ['processes.txt']));
				test('multiple streams to different files', () => t('Get-Content missing.txt > output.txt 2> error.txt 3> warning.txt', ['output.txt', 'error.txt', 'warning.txt']));
				test('redirection in script block', () => t('ForEach-Object { Write-Host $_.Name > names.txt }', ['names.txt']));
				test('conditional redirection', () => t('if (Test-Path "file.txt") { Get-Content "file.txt" > output.txt } else { Write-Host "not found" > error.txt }', ['output.txt', 'error.txt']));
				test('try-catch with redirection', () => t('try { Get-Content "file.txt" > output.txt } catch { $_.Exception.Message > error.txt }', ['output.txt', 'error.txt']));
				test('foreach loop with redirection', () => t('foreach ($file in Get-ChildItem) { $file.Name >> filelist.txt }', ['filelist.txt']));
				test('switch with redirection', () => t('switch ($var) { 1 { "one" > output1.txt } 2 { "two" > output2.txt } }', ['output1.txt', 'output2.txt']));
			});

			suite('edge cases', () => {
				test('no redirections', () => t('Write-Host "hello"', []));
				test('redirection to null', () => t('Write-Host "hello" > $null', ['$null']));
				test('redirection to console', () => t('Write-Host "hello" > CON', ['CON']));
				test('special characters in filename', () => t('Write-Host "hello" > file-with_special.chars123.txt', ['file-with_special.chars123.txt']));
				test('unicode filename', () => t('Write-Host "hello" > 测试文件.txt', ['测试文件.txt']));
				test('very long filename', () => t('Write-Host "hello" > ' + 'a'.repeat(100) + '.txt', [Array(100).fill('a').join('') + '.txt']));
				test('redirection operator in string', () => t('Write-Host "test > redirect" > file.txt', ['file.txt']));
				test('multiple redirection operators', () => t('Write-Host "hello" >> file.txt > otherfile.txt', ['file.txt', 'otherfile.txt']));
			});

			suite('real-world scenarios', () => {
				test('logging script output', () => t('Get-EventLog -LogName System -Newest 100 > system_events.log', ['system_events.log']));
				test('error logging', () => t('Start-Process -FilePath "nonexistent.exe" 2> process_errors.log', ['process_errors.log']));
				test('backup script with logging', () => t('Copy-Item -Path "source/*" -Destination "backup/" -Recurse > backup.log 2> backup_errors.log', ['backup.log', 'backup_errors.log']));
				test('system information export', () => t('Get-ComputerInfo | Out-String > system_info.txt', ['system_info.txt']));
				test('service status report', () => t('Get-Service | Where-Object {$_.Status -eq "Running"} | Select-Object Name, Status > running_services.csv', ['running_services.csv']));
				test('registry export', () => t('Get-ItemProperty -Path "HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion" > registry_info.txt', ['registry_info.txt']));
				test('process monitoring', () => t('while ($true) { Get-Process | Measure-Object WorkingSet -Sum >> memory_usage.log; Start-Sleep 60 }', ['memory_usage.log']));
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chatAgentTools/test/electron-browser/commandLineAnalyzer/commandLineFileWriteAnalyzer.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chatAgentTools/test/electron-browser/commandLineAnalyzer/commandLineFileWriteAnalyzer.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { strictEqual } from 'assert';
import { Schemas } from '../../../../../../../base/common/network.js';
import { isWindows, OperatingSystem } from '../../../../../../../base/common/platform.js';
import { URI } from '../../../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../../base/test/common/utils.js';
import { ITreeSitterLibraryService } from '../../../../../../../editor/common/services/treeSitter/treeSitterLibraryService.js';
import { TestConfigurationService } from '../../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { FileService } from '../../../../../../../platform/files/common/fileService.js';
import type { TestInstantiationService } from '../../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { NullLogService } from '../../../../../../../platform/log/common/log.js';
import { IWorkspaceContextService, toWorkspaceFolder } from '../../../../../../../platform/workspace/common/workspace.js';
import { Workspace } from '../../../../../../../platform/workspace/test/common/testWorkspace.js';
import { TreeSitterLibraryService } from '../../../../../../services/treeSitter/browser/treeSitterLibraryService.js';
import { workbenchInstantiationService } from '../../../../../../test/browser/workbenchTestServices.js';
import { TestContextService } from '../../../../../../test/common/workbenchTestServices.js';
import { TestIPCFileSystemProvider } from '../../../../../../test/electron-browser/workbenchTestServices.js';
import type { ICommandLineAnalyzerOptions } from '../../../browser/tools/commandLineAnalyzer/commandLineAnalyzer.js';
import { CommandLineFileWriteAnalyzer } from '../../../browser/tools/commandLineAnalyzer/commandLineFileWriteAnalyzer.js';
import { TreeSitterCommandParser, TreeSitterCommandParserLanguage } from '../../../browser/treeSitterCommandParser.js';
import { TerminalChatAgentToolsSettingId } from '../../../common/terminalChatAgentToolsConfiguration.js';

suite('CommandLineFileWriteAnalyzer', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let parser: TreeSitterCommandParser;
	let analyzer: CommandLineFileWriteAnalyzer;
	let configurationService: TestConfigurationService;
	let workspaceContextService: TestContextService;

	const mockLog = (..._args: unknown[]) => { };

	setup(() => {
		const fileService = store.add(new FileService(new NullLogService()));
		const fileSystemProvider = new TestIPCFileSystemProvider();
		store.add(fileService.registerProvider(Schemas.file, fileSystemProvider));

		configurationService = new TestConfigurationService();
		workspaceContextService = new TestContextService();

		instantiationService = workbenchInstantiationService({
			fileService: () => fileService,
			configurationService: () => configurationService
		}, store);

		instantiationService.stub(IWorkspaceContextService, workspaceContextService);

		const treeSitterLibraryService = store.add(instantiationService.createInstance(TreeSitterLibraryService));
		treeSitterLibraryService.isTest = true;
		instantiationService.stub(ITreeSitterLibraryService, treeSitterLibraryService);

		parser = store.add(instantiationService.createInstance(TreeSitterCommandParser));

		analyzer = store.add(instantiationService.createInstance(
			CommandLineFileWriteAnalyzer,
			parser,
			mockLog
		));
	});

	(isWindows ? suite.skip : suite)('bash', () => {
		const cwd = URI.file('/workspace/project');

		async function t(commandLine: string, blockDetectedFileWrites: 'never' | 'outsideWorkspace' | 'all', expectedAutoApprove: boolean, expectedDisclaimers: number = 0, workspaceFolders: URI[] = [cwd]) {
			configurationService.setUserConfiguration(TerminalChatAgentToolsSettingId.BlockDetectedFileWrites, blockDetectedFileWrites);

			// Setup workspace folders
			const workspace = new Workspace('test', workspaceFolders.map(uri => toWorkspaceFolder(uri)));
			workspaceContextService.setWorkspace(workspace);

			const options: ICommandLineAnalyzerOptions = {
				commandLine,
				cwd,
				shell: 'bash',
				os: OperatingSystem.Linux,
				treeSitterLanguage: TreeSitterCommandParserLanguage.Bash,
				terminalToolSessionId: 'test',
				chatSessionId: 'test',
			};

			const result = await analyzer.analyze(options);
			strictEqual(result.isAutoApproveAllowed, expectedAutoApprove, `Expected auto approve to be ${expectedAutoApprove} for: ${commandLine}`);
			strictEqual((result.disclaimers || []).length, expectedDisclaimers, `Expected ${expectedDisclaimers} disclaimers for: ${commandLine}`);
		}

		suite('blockDetectedFileWrites: never', () => {
			test('relative path - simple output redirection', () => t('echo hello > file.txt', 'never', true, 1));
			test('relative path - append redirection', () => t('echo hello >> file.txt', 'never', true, 1));
			test('relative paths - multiple redirections', () => t('echo hello > file1.txt && echo world > file2.txt', 'never', true, 1));
			test('relative path - error redirection', () => t('cat missing.txt 2> error.log', 'never', true, 1));
			test('no redirections', () => t('echo hello', 'never', true, 0));
			test('absolute path - /dev/null allowed with never', () => t('echo hello > /dev/null', 'never', true, 1));
		});

		suite('blockDetectedFileWrites: outsideWorkspace', () => {
			// Relative paths (joined with cwd)
			test('relative path - file in workspace root - allow', () => t('echo hello > file.txt', 'outsideWorkspace', true, 1));
			test('relative path - file in subdirectory - allow', () => t('echo hello > subdir/file.txt', 'outsideWorkspace', true, 1));
			test('relative path - parent directory - block', () => t('echo hello > ../file.txt', 'outsideWorkspace', false, 1));
			test('relative path - grandparent directory - block', () => t('echo hello > ../../file.txt', 'outsideWorkspace', false, 1));

			// Absolute paths (parsed as-is)
			test('absolute path - /tmp - block', () => t('echo hello > /tmp/file.txt', 'outsideWorkspace', false, 1));
			test('absolute path - /etc - block', () => t('echo hello > /etc/config.txt', 'outsideWorkspace', false, 1));
			test('absolute path - /home - block', () => t('echo hello > /home/user/file.txt', 'outsideWorkspace', false, 1));
			test('absolute path - root - block', () => t('echo hello > /file.txt', 'outsideWorkspace', false, 1));
			test('absolute path - /dev/null - allow (null device)', () => t('echo hello > /dev/null', 'outsideWorkspace', true, 1));

			// Special cases
			test('no workspace folders - block', () => t('echo hello > file.txt', 'outsideWorkspace', false, 1, []));
			test('no workspace folders - /dev/null allowed', () => t('echo hello > /dev/null', 'outsideWorkspace', true, 1, []));
			test('no redirections - allow', () => t('echo hello', 'outsideWorkspace', true, 0));
			test('variable in filename - block', () => t('echo hello > $HOME/file.txt', 'outsideWorkspace', false, 1));
			test('command substitution - block', () => t('echo hello > $(pwd)/file.txt', 'outsideWorkspace', false, 1));
			test('brace expansion - block', () => t('echo hello > {a,b}.txt', 'outsideWorkspace', false, 1));
		});

		suite('blockDetectedFileWrites: all', () => {
			test('inside workspace - block', () => t('echo hello > file.txt', 'all', false, 1));
			test('outside workspace - block', () => t('echo hello > /tmp/file.txt', 'all', false, 1));
			test('no redirections - allow', () => t('echo hello', 'all', true, 0));
			test('multiple inside workspace - block', () => t('echo hello > file1.txt && echo world > file2.txt', 'all', false, 1));
		});

		suite('complex scenarios', () => {
			test('pipeline with redirection inside workspace', () => t('cat file.txt | grep "test" > output.txt', 'outsideWorkspace', true, 1));
			test('multiple redirections mixed inside/outside', () => t('echo hello > file.txt && echo world > /tmp/file.txt', 'outsideWorkspace', false, 1));
			test('here-document', () => t('cat > file.txt << EOF\nhello\nEOF', 'outsideWorkspace', true, 1));
			test('error output to /dev/null - allow', () => t('cat missing.txt 2> /dev/null', 'outsideWorkspace', true, 1));
		});

		suite('no cwd provided', () => {
			async function tNoCwd(commandLine: string, blockDetectedFileWrites: 'never' | 'outsideWorkspace' | 'all', expectedAutoApprove: boolean, expectedDisclaimers: number = 0) {
				configurationService.setUserConfiguration(TerminalChatAgentToolsSettingId.BlockDetectedFileWrites, blockDetectedFileWrites);

				const workspace = new Workspace('test', [toWorkspaceFolder(cwd)]);
				workspaceContextService.setWorkspace(workspace);

				const options: ICommandLineAnalyzerOptions = {
					commandLine,
					cwd: undefined,
					shell: 'bash',
					os: OperatingSystem.Linux,
					treeSitterLanguage: TreeSitterCommandParserLanguage.Bash,
					terminalToolSessionId: 'test',
					chatSessionId: 'test',
				};

				const result = await analyzer.analyze(options);
				strictEqual(result.isAutoApproveAllowed, expectedAutoApprove, `Expected auto approve to be ${expectedAutoApprove} for: ${commandLine}`);
				strictEqual((result.disclaimers || []).length, expectedDisclaimers, `Expected ${expectedDisclaimers} disclaimers for: ${commandLine}`);
			}

			// When cwd is undefined, relative paths remain as strings and are blocked
			test('relative path - never setting - allow', () => tNoCwd('echo hello > file.txt', 'never', true, 1));
			test('relative path - outsideWorkspace setting - block (unknown cwd)', () => tNoCwd('echo hello > file.txt', 'outsideWorkspace', false, 1));
			test('relative path - all setting - block', () => tNoCwd('echo hello > file.txt', 'all', false, 1));

			// Absolute paths are converted to URIs and checked normally
			test('absolute path inside workspace - outsideWorkspace setting - allow', () => tNoCwd('echo hello > /workspace/project/file.txt', 'outsideWorkspace', true, 1));
			test('absolute path outside workspace - outsideWorkspace setting - block', () => tNoCwd('echo hello > /tmp/file.txt', 'outsideWorkspace', false, 1));
			test('absolute path - all setting - block', () => tNoCwd('echo hello > /tmp/file.txt', 'all', false, 1));
		});
	});

	(isWindows ? suite : suite.skip)('pwsh', () => {
		const cwd = URI.file('C:/workspace/project');

		async function t(commandLine: string, blockDetectedFileWrites: 'never' | 'outsideWorkspace' | 'all', expectedAutoApprove: boolean, expectedDisclaimers: number = 0, workspaceFolders: URI[] = [cwd]) {
			configurationService.setUserConfiguration(TerminalChatAgentToolsSettingId.BlockDetectedFileWrites, blockDetectedFileWrites);

			// Setup workspace folders
			const workspace = new Workspace('test', workspaceFolders.map(uri => toWorkspaceFolder(uri)));
			workspaceContextService.setWorkspace(workspace);

			const options: ICommandLineAnalyzerOptions = {
				commandLine,
				cwd,
				shell: 'pwsh',
				os: OperatingSystem.Windows,
				treeSitterLanguage: TreeSitterCommandParserLanguage.PowerShell,
				terminalToolSessionId: 'test',
				chatSessionId: 'test',
			};

			const result = await analyzer.analyze(options);
			strictEqual(result.isAutoApproveAllowed, expectedAutoApprove, `Expected auto approve to be ${expectedAutoApprove} for: ${commandLine}`);
			strictEqual((result.disclaimers || []).length, expectedDisclaimers, `Expected ${expectedDisclaimers} disclaimers for: ${commandLine}`);
		}

		suite('blockDetectedFileWrites: never', () => {
			test('simple output redirection', () => t('Write-Host "hello" > file.txt', 'never', true, 1));
			test('append redirection', () => t('Write-Host "hello" >> file.txt', 'never', true, 1));
			test('multiple redirections', () => t('Write-Host "hello" > file1.txt ; Write-Host "world" > file2.txt', 'never', true, 1));
			test('error redirection', () => t('Get-Content missing.txt 2> error.log', 'never', true, 1));
			test('no redirections', () => t('Write-Host "hello"', 'never', true, 0));
		});

		suite('blockDetectedFileWrites: outsideWorkspace', () => {
			// Relative paths (joined with cwd)
			test('relative path - file in workspace root - allow', () => t('Write-Host "hello" > file.txt', 'outsideWorkspace', true, 1));
			test('relative path - file in subdirectory - allow', () => t('Write-Host "hello" > subdir\\file.txt', 'outsideWorkspace', true, 1));
			test('relative path - parent directory - block', () => t('Write-Host "hello" > ..\\file.txt', 'outsideWorkspace', false, 1));
			test('relative path - grandparent directory - block', () => t('Write-Host "hello" > ..\\..\\file.txt', 'outsideWorkspace', false, 1));

			// Absolute paths - Windows drive letters (parsed as-is)
			test('absolute path - C: drive - block', () => t('Write-Host "hello" > C:\\temp\\file.txt', 'outsideWorkspace', false, 1));
			test('absolute path - D: drive - block', () => t('Write-Host "hello" > D:\\data\\config.txt', 'outsideWorkspace', false, 1));
			test('absolute path - different drive than workspace - block', () => t('Write-Host "hello" > E:\\external\\file.txt', 'outsideWorkspace', false, 1));

			// Absolute paths - UNC paths
			test('absolute path - UNC path - block', () => t('Write-Host "hello" > \\\\server\\share\\file.txt', 'outsideWorkspace', false, 1));

			// Special cases
			test('no workspace folders - block', () => t('Write-Host "hello" > file.txt', 'outsideWorkspace', false, 1, []));
			test('no redirections - allow', () => t('Write-Host "hello"', 'outsideWorkspace', true, 0));
			test('variable in filename - block', () => t('Write-Host "hello" > $env:TEMP\\file.txt', 'outsideWorkspace', false, 1));
			test('subexpression - block', () => t('Write-Host "hello" > $(Get-Date).log', 'outsideWorkspace', false, 1));
		});

		suite('blockDetectedFileWrites: all', () => {
			test('inside workspace - block', () => t('Write-Host "hello" > file.txt', 'all', false, 1));
			test('outside workspace - block', () => t('Write-Host "hello" > C:\\temp\\file.txt', 'all', false, 1));
			test('no redirections - allow', () => t('Write-Host "hello"', 'all', true, 0));
			test('multiple inside workspace - block', () => t('Write-Host "hello" > file1.txt ; Write-Host "world" > file2.txt', 'all', false, 1));
		});

		suite('complex scenarios', () => {
			test('pipeline with redirection inside workspace', () => t('Get-Process | Where-Object {$_.CPU -gt 100} > processes.txt', 'outsideWorkspace', true, 1));
			test('multiple redirections mixed inside/outside', () => t('Write-Host "hello" > file.txt ; Write-Host "world" > C:\\temp\\file.txt', 'outsideWorkspace', false, 1));
			test('all streams redirection', () => t('Get-Process *> all.log', 'outsideWorkspace', true, 1));
			test('multiple stream redirections', () => t('Get-Content missing.txt > output.txt 2> error.txt 3> warning.txt', 'outsideWorkspace', true, 1));
		});

		suite('edge cases', () => {
			test('redirection to $null (PowerShell null device) - allow', () => t('Write-Host "hello" > $null', 'outsideWorkspace', true, 1));
			test('relative path with backslashes - allow', () => t('Write-Host "hello" > server\\share\\file.txt', 'outsideWorkspace', true, 1));
			test('quoted filename inside workspace - allow', () => t('Write-Host "hello" > "file with spaces.txt"', 'outsideWorkspace', true, 1));
			test('forward slashes on Windows (relative) - allow', () => t('Write-Host "hello" > subdir/file.txt', 'outsideWorkspace', true, 1));
		});
	});

	suite('disclaimer messages', () => {
		const cwd = URI.file('/workspace/project');

		async function checkDisclaimer(commandLine: string, blockDetectedFileWrites: 'never' | 'outsideWorkspace' | 'all', expectedContains: string) {
			configurationService.setUserConfiguration(TerminalChatAgentToolsSettingId.BlockDetectedFileWrites, blockDetectedFileWrites);

			const workspace = new Workspace('test', [toWorkspaceFolder(cwd)]);
			workspaceContextService.setWorkspace(workspace);

			const options: ICommandLineAnalyzerOptions = {
				commandLine,
				cwd,
				shell: 'bash',
				os: OperatingSystem.Linux,
				treeSitterLanguage: TreeSitterCommandParserLanguage.Bash,
				terminalToolSessionId: 'test',
				chatSessionId: 'test',
			};

			const result = await analyzer.analyze(options);
			const disclaimers = result.disclaimers || [];
			strictEqual(disclaimers.length > 0, true, 'Expected at least one disclaimer');
			const combinedDisclaimers = disclaimers.join(' ');
			strictEqual(combinedDisclaimers.includes(expectedContains), true, `Expected disclaimer to contain "${expectedContains}" but got: ${combinedDisclaimers}`);
		}

		test('blocked disclaimer - absolute path outside workspace', () => checkDisclaimer('echo hello > /tmp/file.txt', 'outsideWorkspace', 'cannot be auto approved'));
		test('allowed disclaimer - relative path inside workspace', () => checkDisclaimer('echo hello > file.txt', 'outsideWorkspace', 'File write operations detected'));
		test('blocked disclaimer - all setting blocks everything', () => checkDisclaimer('echo hello > file.txt', 'all', 'cannot be auto approved'));
	});

	suite('multiple workspace folders', () => {
		const workspace1 = URI.file('/workspace/project1');
		const workspace2 = URI.file('/workspace/project2');

		async function t(cwd: URI, commandLine: string, expectedAutoApprove: boolean, expectedDisclaimers: number = 0) {
			configurationService.setUserConfiguration(TerminalChatAgentToolsSettingId.BlockDetectedFileWrites, 'outsideWorkspace');

			const workspace = new Workspace('test', [workspace1, workspace2].map(uri => toWorkspaceFolder(uri)));
			workspaceContextService.setWorkspace(workspace);

			const options: ICommandLineAnalyzerOptions = {
				commandLine,
				cwd,
				shell: 'bash',
				os: OperatingSystem.Linux,
				treeSitterLanguage: TreeSitterCommandParserLanguage.Bash,
				terminalToolSessionId: 'test',
				chatSessionId: 'test',
			};

			const result = await analyzer.analyze(options);
			strictEqual(result.isAutoApproveAllowed, expectedAutoApprove, `Expected auto approve to be ${expectedAutoApprove} for: ${commandLine}`);
			strictEqual((result.disclaimers || []).length, expectedDisclaimers, `Expected ${expectedDisclaimers} disclaimers for: ${commandLine}`);
		}

		test('relative path in same workspace - allow', () => t(workspace1, 'echo hello > file.txt', true, 1));
		test('absolute path to other workspace - allow', () => t(workspace1, 'echo hello > /workspace/project2/file.txt', true, 1));
		test('absolute path outside all workspaces - block', () => t(workspace1, 'echo hello > /tmp/file.txt', false, 1));
		test('relative path to parent of workspace - block', () => t(workspace1, 'echo hello > ../file.txt', false, 1));
	});

	suite('uri schemes', () => {
		async function t(cwdScheme: string, filePath: string, expectedAutoApprove: boolean) {
			configurationService.setUserConfiguration(TerminalChatAgentToolsSettingId.BlockDetectedFileWrites, 'outsideWorkspace');

			const cwd = URI.from({ scheme: cwdScheme, path: '/workspace/project' });
			const workspace = new Workspace('test', [toWorkspaceFolder(cwd)]);
			workspaceContextService.setWorkspace(workspace);

			const options: ICommandLineAnalyzerOptions = {
				commandLine: `echo hello > ${filePath}`,
				cwd,
				shell: 'bash',
				os: OperatingSystem.Linux,
				treeSitterLanguage: TreeSitterCommandParserLanguage.Bash,
				terminalToolSessionId: 'test',
				chatSessionId: 'test',
			};

			const result = await analyzer.analyze(options);
			strictEqual(result.isAutoApproveAllowed, expectedAutoApprove);
		}

		test('file scheme - relative path inside workspace', () => t('file', 'file.txt', true));
		test('vscode-remote scheme - relative path inside workspace', () => t('vscode-remote', 'file.txt', true));
		test('vscode-remote scheme - absolute path outside workspace', () => t('vscode-remote', '/tmp/file.txt', false));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/clipboard/browser/terminal.clipboard.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/clipboard/browser/terminal.clipboard.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Terminal as RawXtermTerminal } from '@xterm/xterm';
import { Disposable, toDisposable, type IDisposable } from '../../../../../base/common/lifecycle.js';
import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IDetachedTerminalInstance, ITerminalConfigurationService, ITerminalContribution, ITerminalInstance, type IXtermTerminal } from '../../../terminal/browser/terminal.js';
import { registerTerminalContribution, type IDetachedCompatibleTerminalContributionContext, type ITerminalContributionContext } from '../../../terminal/browser/terminalExtensions.js';
import { shouldPasteTerminalText } from './terminalClipboard.js';
import { Emitter } from '../../../../../base/common/event.js';
import { BrowserFeatures } from '../../../../../base/browser/canIUse.js';
import { TerminalCapability, type ITerminalCommand } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TerminalSettingId } from '../../../../../platform/terminal/common/terminal.js';
import { isLinux, isMacintosh } from '../../../../../base/common/platform.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { registerActiveInstanceAction, registerActiveXtermAction } from '../../../terminal/browser/terminalActions.js';
import { TerminalCommandId } from '../../../terminal/common/terminal.js';
import { localize2 } from '../../../../../nls.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { TerminalContextKeys } from '../../../terminal/common/terminalContextKey.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { terminalStrings } from '../../../terminal/common/terminalStrings.js';
import { isString } from '../../../../../base/common/types.js';

// #region Terminal Contributions

export class TerminalClipboardContribution extends Disposable implements ITerminalContribution {
	static readonly ID = 'terminal.clipboard';

	static get(instance: ITerminalInstance | IDetachedTerminalInstance): TerminalClipboardContribution | null {
		return instance.getContribution<TerminalClipboardContribution>(TerminalClipboardContribution.ID);
	}

	private _xterm: IXtermTerminal & { raw: RawXtermTerminal } | undefined;

	private _overrideCopySelection: boolean | undefined = undefined;

	private readonly _onWillPaste = this._register(new Emitter<string>());
	readonly onWillPaste = this._onWillPaste.event;
	private readonly _onDidPaste = this._register(new Emitter<string>());
	readonly onDidPaste = this._onDidPaste.event;

	constructor(
		private readonly _ctx: ITerminalContributionContext | IDetachedCompatibleTerminalContributionContext,
		@IClipboardService private readonly _clipboardService: IClipboardService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@INotificationService private readonly _notificationService: INotificationService,
		@ITerminalConfigurationService private readonly _terminalConfigurationService: ITerminalConfigurationService,
	) {
		super();
	}

	xtermReady(xterm: IXtermTerminal & { raw: RawXtermTerminal }): void {
		this._xterm = xterm;
		// TODO: This should be a different event on xterm, copying html should not share the requesting run command event
		this._register(xterm.onDidRequestCopyAsHtml(e => this.copySelection(true, e.command)));
		this._register(xterm.raw.onSelectionChange(async () => {
			if (this._configurationService.getValue(TerminalSettingId.CopyOnSelection)) {
				if (this._overrideCopySelection === false) {
					return;
				}
				if (this._ctx.instance.hasSelection()) {
					await this.copySelection();
				}
			}
		}));
	}

	async copySelection(asHtml?: boolean, command?: ITerminalCommand): Promise<void> {
		// TODO: Confirm this is fine that it's no longer awaiting xterm promise
		this._xterm?.copySelection(asHtml, command);
	}

	/**
	 * Focuses and pastes the contents of the clipboard into the terminal instance.
	 */
	async paste(): Promise<void> {
		await this._paste(await this._clipboardService.readText());
	}

	/**
	 * Focuses and pastes the contents of the selection clipboard into the terminal instance.
	 */
	async pasteSelection(): Promise<void> {
		await this._paste(await this._clipboardService.readText('selection'));
	}

	private async _paste(value: string): Promise<void> {
		if (!this._xterm) {
			return;
		}

		let currentText = value;
		const shouldPasteText = await this._instantiationService.invokeFunction(shouldPasteTerminalText, currentText, this._xterm?.raw.modes.bracketedPasteMode);
		if (!shouldPasteText) {
			return;
		}

		if (typeof shouldPasteText === 'object') {
			currentText = shouldPasteText.modifiedText;
		}

		this._ctx.instance.focus();

		this._onWillPaste.fire(currentText);
		this._xterm.raw.paste(currentText);
		this._onDidPaste.fire(currentText);
	}

	async handleMouseEvent(event: MouseEvent): Promise<{ handled: boolean } | void> {
		switch (event.button) {
			case 1: { // Middle click
				if (this._terminalConfigurationService.config.middleClickBehavior === 'paste') {
					this.paste();
					return { handled: true };
				}
				break;
			}
			case 2: { // Right click
				// Ignore shift click as it forces the context menu
				if (event.shiftKey) {
					return;
				}
				const rightClickBehavior = this._terminalConfigurationService.config.rightClickBehavior;
				if (rightClickBehavior !== 'copyPaste' && rightClickBehavior !== 'paste') {
					return;
				}
				if (rightClickBehavior === 'copyPaste' && this._ctx.instance.hasSelection()) {
					await this.copySelection();
					this._ctx.instance.clearSelection();
				} else {
					if (BrowserFeatures.clipboard.readText) {
						this.paste();
					} else {
						this._notificationService.info(`This browser doesn't support the clipboard.readText API needed to trigger a paste, try ${isMacintosh ? '⌘' : 'Ctrl'}+V instead.`);
					}
				}
				// Clear selection after all click event bubbling is finished on Mac to prevent
				// right-click selecting a word which is seemed cannot be disabled. There is a
				// flicker when pasting but this appears to give the best experience if the
				// setting is enabled.
				if (isMacintosh) {
					setTimeout(() => this._ctx.instance.clearSelection(), 0);
				}
				return { handled: true };
			}
		}
	}

	/**
	 * Override the copy on selection feature with a custom value.
	 * @param value Whether to enable copySelection.
	 */
	overrideCopyOnSelection(value: boolean): IDisposable {
		if (this._overrideCopySelection !== undefined) {
			throw new Error('Cannot set a copy on selection override multiple times');
		}
		this._overrideCopySelection = value;
		return toDisposable(() => this._overrideCopySelection = undefined);
	}
}

registerTerminalContribution(TerminalClipboardContribution.ID, TerminalClipboardContribution, false);

// #endregion

// #region Actions

const terminalAvailableWhenClause = ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated);

// TODO: Move these commands into this terminalContrib/
registerActiveInstanceAction({
	id: TerminalCommandId.CopyLastCommand,
	title: localize2('workbench.action.terminal.copyLastCommand', "Copy Last Command"),
	precondition: terminalAvailableWhenClause,
	run: async (instance, c, accessor) => {
		const clipboardService = accessor.get(IClipboardService);
		const commands = instance.capabilities.get(TerminalCapability.CommandDetection)?.commands;
		if (!commands || commands.length === 0) {
			return;
		}
		const command = commands[commands.length - 1];
		if (!command.command) {
			return;
		}
		await clipboardService.writeText(command.command);
	}
});

registerActiveInstanceAction({
	id: TerminalCommandId.CopyLastCommandOutput,
	title: localize2('workbench.action.terminal.copyLastCommandOutput', "Copy Last Command Output"),
	precondition: terminalAvailableWhenClause,
	run: async (instance, c, accessor) => {
		const clipboardService = accessor.get(IClipboardService);
		const commands = instance.capabilities.get(TerminalCapability.CommandDetection)?.commands;
		if (!commands || commands.length === 0) {
			return;
		}
		const command = commands[commands.length - 1];
		if (!command?.hasOutput()) {
			return;
		}
		const output = command.getOutput();
		if (isString(output)) {
			await clipboardService.writeText(output);
		}
	}
});

registerActiveInstanceAction({
	id: TerminalCommandId.CopyLastCommandAndLastCommandOutput,
	title: localize2('workbench.action.terminal.copyLastCommandAndOutput', "Copy Last Command and Output"),
	precondition: terminalAvailableWhenClause,
	run: async (instance, c, accessor) => {
		const clipboardService = accessor.get(IClipboardService);
		const commands = instance.capabilities.get(TerminalCapability.CommandDetection)?.commands;
		if (!commands || commands.length === 0) {
			return;
		}
		const command = commands[commands.length - 1];
		if (!command?.hasOutput()) {
			return;
		}
		const output = command.getOutput();
		if (isString(output)) {
			await clipboardService.writeText(`${command.command !== '' ? command.command + '\n' : ''}${output}`);
		}
	}
});

// Some commands depend on platform features
if (BrowserFeatures.clipboard.writeText) {
	registerActiveXtermAction({
		id: TerminalCommandId.CopySelection,
		title: localize2('workbench.action.terminal.copySelection', 'Copy Selection'),
		// TODO: Why is copy still showing up when text isn't selected?
		precondition: ContextKeyExpr.or(TerminalContextKeys.textSelectedInFocused, ContextKeyExpr.and(terminalAvailableWhenClause, TerminalContextKeys.textSelected)),
		keybinding: [{
			primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyC,
			mac: { primary: KeyMod.CtrlCmd | KeyCode.KeyC },
			weight: KeybindingWeight.WorkbenchContrib,
			when: ContextKeyExpr.or(
				ContextKeyExpr.and(TerminalContextKeys.textSelected, TerminalContextKeys.focus),
				TerminalContextKeys.textSelectedInFocused,
			)
		}],
		run: (activeInstance) => activeInstance.copySelection()
	});

	registerActiveXtermAction({
		id: TerminalCommandId.CopyAndClearSelection,
		title: localize2('workbench.action.terminal.copyAndClearSelection', 'Copy and Clear Selection'),
		precondition: ContextKeyExpr.or(TerminalContextKeys.textSelectedInFocused, ContextKeyExpr.and(terminalAvailableWhenClause, TerminalContextKeys.textSelected)),
		keybinding: [{
			win: { primary: KeyMod.CtrlCmd | KeyCode.KeyC },
			weight: KeybindingWeight.WorkbenchContrib,
			when: ContextKeyExpr.or(
				ContextKeyExpr.and(TerminalContextKeys.textSelected, TerminalContextKeys.focus),
				TerminalContextKeys.textSelectedInFocused,
			)
		}],
		run: async (xterm) => {
			await xterm.copySelection();
			xterm.clearSelection();
		}
	});

	registerActiveXtermAction({
		id: TerminalCommandId.CopySelectionAsHtml,
		title: localize2('workbench.action.terminal.copySelectionAsHtml', 'Copy Selection as HTML'),
		f1: true,
		category: terminalStrings.actionCategory,
		precondition: ContextKeyExpr.or(TerminalContextKeys.textSelectedInFocused, ContextKeyExpr.and(terminalAvailableWhenClause, TerminalContextKeys.textSelected)),
		run: (xterm) => xterm.copySelection(true)
	});
}

if (BrowserFeatures.clipboard.readText) {
	registerActiveInstanceAction({
		id: TerminalCommandId.Paste,
		title: localize2('workbench.action.terminal.paste', 'Paste into Active Terminal'),
		precondition: terminalAvailableWhenClause,
		keybinding: [{
			primary: KeyMod.CtrlCmd | KeyCode.KeyV,
			win: { primary: KeyMod.CtrlCmd | KeyCode.KeyV, secondary: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyV] },
			linux: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyV },
			weight: KeybindingWeight.WorkbenchContrib,
			when: TerminalContextKeys.focus
		}],
		run: (activeInstance) => TerminalClipboardContribution.get(activeInstance)?.paste()
	});
}

if (BrowserFeatures.clipboard.readText && isLinux) {
	registerActiveInstanceAction({
		id: TerminalCommandId.PasteSelection,
		title: localize2('workbench.action.terminal.pasteSelection', 'Paste Selection into Active Terminal'),
		precondition: terminalAvailableWhenClause,
		keybinding: [{
			linux: { primary: KeyMod.Shift | KeyCode.Insert },
			weight: KeybindingWeight.WorkbenchContrib,
			when: TerminalContextKeys.focus
		}],
		run: (activeInstance) => TerminalClipboardContribution.get(activeInstance)?.pasteSelection()
	});
}

// #endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/clipboard/browser/terminalClipboard.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/clipboard/browser/terminalClipboard.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isString } from '../../../../../base/common/types.js';
import { localize } from '../../../../../nls.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { TerminalSettingId } from '../../../../../platform/terminal/common/terminal.js';

export async function shouldPasteTerminalText(accessor: ServicesAccessor, text: string, bracketedPasteMode: boolean | undefined): Promise<boolean | { modifiedText: string }> {
	const configurationService = accessor.get(IConfigurationService);
	const dialogService = accessor.get(IDialogService);

	// If the clipboard has only one line, a warning should never show
	const textForLines = text.split(/\r?\n/);
	if (textForLines.length === 1) {
		return true;
	}

	// Get config value
	function parseConfigValue(value: unknown): 'auto' | 'always' | 'never' {
		// Valid value
		if (isString(value)) {
			if (value === 'auto' || value === 'always' || value === 'never') {
				return value;
			}
		}
		// Legacy backwards compatibility
		if (typeof value === 'boolean') {
			return value ? 'auto' : 'never';
		}
		// Invalid value fallback
		return 'auto';
	}
	const configValue = parseConfigValue(configurationService.getValue(TerminalSettingId.EnableMultiLinePasteWarning));

	// Never show it
	if (configValue === 'never') {
		return true;
	}

	// Special edge cases to not show for auto
	if (configValue === 'auto') {
		// Ignore check if the shell is in bracketed paste mode (ie. the shell can handle multi-line
		// text).
		if (bracketedPasteMode) {
			return true;
		}

		const textForLines = text.split(/\r?\n/);
		// Ignore check when a command is copied with a trailing new line
		if (textForLines.length === 2 && textForLines[1].trim().length === 0) {
			return true;
		}
	}

	const displayItemsCount = 3;
	const maxPreviewLineLength = 30;

	let detail = localize('preview', "Preview:");
	for (let i = 0; i < Math.min(textForLines.length, displayItemsCount); i++) {
		const line = textForLines[i];
		const cleanedLine = line.length > maxPreviewLineLength ? `${line.slice(0, maxPreviewLineLength)}…` : line;
		detail += `\n${cleanedLine}`;
	}

	if (textForLines.length > displayItemsCount) {
		detail += `\n…`;
	}

	const { result, checkboxChecked } = await dialogService.prompt<{ confirmed: boolean; singleLine: boolean }>({
		message: localize('confirmMoveTrashMessageFilesAndDirectories', "Are you sure you want to paste {0} lines of text into the terminal?", textForLines.length),
		detail,
		type: 'warning',
		buttons: [
			{
				label: localize({ key: 'multiLinePasteButton', comment: ['&& denotes a mnemonic'] }, "&&Paste"),
				run: () => ({ confirmed: true, singleLine: false })
			},
			{
				label: localize({ key: 'multiLinePasteButton.oneLine', comment: ['&& denotes a mnemonic'] }, "Paste as &&one line"),
				run: () => ({ confirmed: true, singleLine: true })
			}
		],
		cancelButton: true,
		checkbox: {
			label: localize('doNotAskAgain', "Do not ask me again")
		}
	});

	if (!result) {
		return false;
	}

	if (result.confirmed && checkboxChecked) {
		await configurationService.updateValue(TerminalSettingId.EnableMultiLinePasteWarning, 'never');
	}

	if (result.singleLine) {
		return { modifiedText: text.replace(/\r?\n/g, '') };
	}

	return result.confirmed;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/clipboard/test/browser/terminalClipboard.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/clipboard/test/browser/terminalClipboard.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { strictEqual } from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IDialogService } from '../../../../../../platform/dialogs/common/dialogs.js';
import { TestDialogService } from '../../../../../../platform/dialogs/test/common/testDialogService.js';
import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { TerminalSettingId } from '../../../../../../platform/terminal/common/terminal.js';
import { shouldPasteTerminalText } from '../../browser/terminalClipboard.js';

suite('TerminalClipboard', function () {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	suite('shouldPasteTerminalText', () => {
		let instantiationService: TestInstantiationService;
		let configurationService: TestConfigurationService;

		setup(async () => {
			instantiationService = store.add(new TestInstantiationService());
			configurationService = new TestConfigurationService({
				[TerminalSettingId.EnableMultiLinePasteWarning]: 'auto'
			});
			instantiationService.stub(IConfigurationService, configurationService);
			instantiationService.stub(IDialogService, new TestDialogService(undefined, { result: { confirmed: false } }));
		});

		function setConfigValue(value: unknown) {
			configurationService = new TestConfigurationService({
				[TerminalSettingId.EnableMultiLinePasteWarning]: value
			});
			instantiationService.stub(IConfigurationService, configurationService);
		}

		test('Single line string', async () => {
			strictEqual(await instantiationService.invokeFunction(shouldPasteTerminalText, 'foo', undefined), true);

			setConfigValue('always');
			strictEqual(await instantiationService.invokeFunction(shouldPasteTerminalText, 'foo', undefined), true);

			setConfigValue('never');
			strictEqual(await instantiationService.invokeFunction(shouldPasteTerminalText, 'foo', undefined), true);
		});
		test('Single line string with trailing new line', async () => {
			strictEqual(await instantiationService.invokeFunction(shouldPasteTerminalText, 'foo\n', undefined), true);

			setConfigValue('always');
			strictEqual(await instantiationService.invokeFunction(shouldPasteTerminalText, 'foo\n', undefined), false);

			setConfigValue('never');
			strictEqual(await instantiationService.invokeFunction(shouldPasteTerminalText, 'foo\n', undefined), true);
		});
		test('Multi-line string', async () => {
			strictEqual(await instantiationService.invokeFunction(shouldPasteTerminalText, 'foo\nbar', undefined), false);

			setConfigValue('always');
			strictEqual(await instantiationService.invokeFunction(shouldPasteTerminalText, 'foo\nbar', undefined), false);

			setConfigValue('never');
			strictEqual(await instantiationService.invokeFunction(shouldPasteTerminalText, 'foo\nbar', undefined), true);
		});
		test('Bracketed paste mode', async () => {
			strictEqual(await instantiationService.invokeFunction(shouldPasteTerminalText, 'foo\nbar', true), true);

			setConfigValue('always');
			strictEqual(await instantiationService.invokeFunction(shouldPasteTerminalText, 'foo\nbar', true), false);

			setConfigValue('never');
			strictEqual(await instantiationService.invokeFunction(shouldPasteTerminalText, 'foo\nbar', true), true);
		});
		test('Legacy config', async () => {
			setConfigValue(true); // 'auto'
			strictEqual(await instantiationService.invokeFunction(shouldPasteTerminalText, 'foo\nbar', undefined), false);
			strictEqual(await instantiationService.invokeFunction(shouldPasteTerminalText, 'foo\nbar', true), true);

			setConfigValue(false); // 'never'
			strictEqual(await instantiationService.invokeFunction(shouldPasteTerminalText, 'foo\nbar', true), true);
		});
		test('Invalid config', async () => {
			setConfigValue(123);
			strictEqual(await instantiationService.invokeFunction(shouldPasteTerminalText, 'foo\nbar', undefined), false);
			strictEqual(await instantiationService.invokeFunction(shouldPasteTerminalText, 'foo\nbar', true), true);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/commandGuide/browser/terminal.commandGuide.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/commandGuide/browser/terminal.commandGuide.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Terminal as RawXtermTerminal } from '@xterm/xterm';
import { addDisposableListener } from '../../../../../base/browser/dom.js';
import { combinedDisposable, Disposable, MutableDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../nls.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { listInactiveSelectionBackground } from '../../../../../platform/theme/common/colorRegistry.js';
import { registerColor, transparent } from '../../../../../platform/theme/common/colorUtils.js';
import { PANEL_BORDER } from '../../../../common/theme.js';
import { IDetachedTerminalInstance, ITerminalContribution, ITerminalInstance, IXtermTerminal } from '../../../terminal/browser/terminal.js';
import { registerTerminalContribution, type IDetachedCompatibleTerminalContributionContext, type ITerminalContributionContext } from '../../../terminal/browser/terminalExtensions.js';
import { terminalCommandGuideConfigSection, TerminalCommandGuideSettingId, type ITerminalCommandGuideConfiguration } from '../common/terminalCommandGuideConfiguration.js';
import { isFullTerminalCommand } from '../../../../../platform/terminal/common/capabilities/commandDetection/terminalCommand.js';

// #region Terminal Contributions

class TerminalCommandGuideContribution extends Disposable implements ITerminalContribution {
	static readonly ID = 'terminal.commandGuide';

	static get(instance: ITerminalInstance | IDetachedTerminalInstance): TerminalCommandGuideContribution | null {
		return instance.getContribution<TerminalCommandGuideContribution>(TerminalCommandGuideContribution.ID);
	}

	private _xterm: IXtermTerminal & { raw: RawXtermTerminal } | undefined;
	private readonly _activeCommandGuide = this._register(new MutableDisposable());

	constructor(
		private readonly _ctx: ITerminalContributionContext | IDetachedCompatibleTerminalContributionContext,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
	) {
		super();
	}

	xtermOpen(xterm: IXtermTerminal & { raw: RawXtermTerminal }): void {
		this._xterm = xterm;
		this._refreshActivatedState();
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TerminalCommandGuideSettingId.ShowCommandGuide)) {
				this._refreshActivatedState();
			}
		}));
	}

	private _refreshActivatedState() {
		const xterm = this._xterm;
		if (!xterm) {
			return;
		}

		const showCommandGuide = this._configurationService.getValue<ITerminalCommandGuideConfiguration>(terminalCommandGuideConfigSection).showCommandGuide;
		if (!!this._activeCommandGuide.value === showCommandGuide) {
			return;
		}

		if (!showCommandGuide) {
			this._activeCommandGuide.clear();
		} else {
			// eslint-disable-next-line no-restricted-syntax
			const screenElement = xterm.raw.element!.querySelector('.xterm-screen')!;
			// eslint-disable-next-line no-restricted-syntax
			const viewportElement = xterm.raw.element!.querySelector('.xterm-viewport')!;
			this._activeCommandGuide.value = combinedDisposable(
				addDisposableListener(screenElement, 'mousemove', (e: MouseEvent) => this._tryShowHighlight(screenElement, xterm, e)),
				addDisposableListener(viewportElement, 'mousemove', (e: MouseEvent) => this._tryShowHighlight(screenElement, xterm, e)),
				addDisposableListener(xterm.raw.element!, 'mouseleave', () => xterm.markTracker.showCommandGuide(undefined)),
				xterm.raw.onData(() => xterm.markTracker.showCommandGuide(undefined)),
				toDisposable(() => xterm.markTracker.showCommandGuide(undefined)),
			);
		}
	}

	private _tryShowHighlight(element: Element, xterm: IXtermTerminal & { raw: RawXtermTerminal }, e: MouseEvent) {
		const rect = element.getBoundingClientRect();
		if (!rect) {
			return;
		}
		const mouseCursorY = Math.floor((e.clientY - rect.top) / (rect.height / xterm.raw.rows));
		const command = this._ctx.instance.capabilities.get(TerminalCapability.CommandDetection)?.getCommandForLine(xterm.raw.buffer.active.viewportY + mouseCursorY);
		if (command && isFullTerminalCommand(command)) {
			xterm.markTracker.showCommandGuide(command);
		} else {
			xterm.markTracker.showCommandGuide(undefined);
		}
	}
}

registerTerminalContribution(TerminalCommandGuideContribution.ID, TerminalCommandGuideContribution, false);

export const TERMINAL_COMMAND_GUIDE_COLOR = registerColor('terminalCommandGuide.foreground', {
	dark: transparent(listInactiveSelectionBackground, 1),
	light: transparent(listInactiveSelectionBackground, 1),
	hcDark: PANEL_BORDER,
	hcLight: PANEL_BORDER
}, localize('terminalCommandGuide.foreground', 'The foreground color of the terminal command guide that appears to the left of a command and its output on hover.'));

// #endregion
```

--------------------------------------------------------------------------------

````
