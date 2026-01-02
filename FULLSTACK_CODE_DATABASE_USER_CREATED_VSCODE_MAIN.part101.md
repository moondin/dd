---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 101
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 101 of 552)

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

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/terminal.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/terminal.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual, doesNotThrow, equal, ok, strictEqual, throws } from 'assert';
import { commands, ConfigurationTarget, Disposable, env, EnvironmentVariableMutator, EnvironmentVariableMutatorOptions, EnvironmentVariableMutatorType, EventEmitter, ExtensionContext, extensions, ExtensionTerminalOptions, Pseudoterminal, Terminal, TerminalDimensions, TerminalExitReason, TerminalOptions, TerminalState, UIKind, Uri, window, workspace } from 'vscode';
import { assertNoRpc, poll } from '../utils';

// Disable terminal tests:
// - Web https://github.com/microsoft/vscode/issues/92826
(env.uiKind === UIKind.Web ? suite.skip : suite)('vscode API - terminal', () => {
	let extensionContext: ExtensionContext;

	suiteSetup(async () => {
		// Trigger extension activation and grab the context as some tests depend on it
		await extensions.getExtension('vscode.vscode-api-tests')?.activate();
		extensionContext = global.testExtensionContext;

		const config = workspace.getConfiguration('terminal.integrated');
		// Disable conpty in integration tests because of https://github.com/microsoft/vscode/issues/76548
		await config.update('windowsEnableConpty', false, ConfigurationTarget.Global);
		// Disable exit alerts as tests may trigger then and we're not testing the notifications
		await config.update('showExitAlert', false, ConfigurationTarget.Global);
		// Canvas may cause problems when running in a container
		await config.update('gpuAcceleration', 'off', ConfigurationTarget.Global);
		// Disable env var relaunch for tests to prevent terminals relaunching themselves
		await config.update('environmentChangesRelaunch', false, ConfigurationTarget.Global);
		// Disable local echo in case it causes any problems in remote tests
		await config.update('localEchoEnabled', 'off', ConfigurationTarget.Global);
		await config.update('shellIntegration.enabled', false);
	});

	suite('Terminal', () => {
		const disposables: Disposable[] = [];

		teardown(async () => {
			assertNoRpc();
			disposables.forEach(d => d.dispose());
			disposables.length = 0;
			const config = workspace.getConfiguration('terminal.integrated');
			await config.update('shellIntegration.enabled', undefined);
		});

		test('sendText immediately after createTerminal should not throw', async () => {
			const terminal = window.createTerminal();
			const result = await new Promise<Terminal>(r => {
				disposables.push(window.onDidOpenTerminal(t => {
					if (t === terminal) {
						r(t);
					}
				}));
			});
			equal(result, terminal);
			doesNotThrow(terminal.sendText.bind(terminal, 'echo "foo"'));
			await new Promise<void>(r => {
				disposables.push(window.onDidCloseTerminal(t => {
					if (t === terminal) {
						r();
					}
				}));
				terminal.dispose();
			});
		});

		test('echo works in the default shell', async () => {
			const terminal = await new Promise<Terminal>(r => {
				disposables.push(window.onDidOpenTerminal(t => {
					if (t === terminal) {
						r(terminal);
					}
				}));
				// Use a single character to avoid winpty/conpty issues with injected sequences
				const terminal = window.createTerminal({
					env: { TEST: '`' }
				});
				terminal.show();
			});

			let data = '';
			await new Promise<void>(r => {
				disposables.push(window.onDidWriteTerminalData(e => {
					if (e.terminal === terminal) {
						data += e.data;
						if (data.indexOf('`') !== 0) {
							r();
						}
					}
				}));
				// Print an environment variable value so the echo statement doesn't get matched
				if (process.platform === 'win32') {
					terminal.sendText(`$env:TEST`);
				} else {
					terminal.sendText(`echo $TEST`);
				}
			});

			await new Promise<void>(r => {
				terminal.dispose();
				disposables.push(window.onDidCloseTerminal(t => {
					strictEqual(terminal, t);
					r();
				}));
			});
		});

		test('onDidCloseTerminal event fires when terminal is disposed', async () => {
			const terminal = window.createTerminal();
			const result = await new Promise<Terminal>(r => {
				disposables.push(window.onDidOpenTerminal(t => {
					if (t === terminal) {
						r(t);
					}
				}));
			});
			equal(result, terminal);
			await new Promise<void>(r => {
				disposables.push(window.onDidCloseTerminal(t => {
					if (t === terminal) {
						r();
					}
				}));
				terminal.dispose();
			});
		});

		test('processId immediately after createTerminal should fetch the pid', async () => {
			const terminal = window.createTerminal();
			const result = await new Promise<Terminal>(r => {
				disposables.push(window.onDidOpenTerminal(t => {
					if (t === terminal) {
						r(t);
					}
				}));
			});
			equal(result, terminal);
			const pid = await result.processId;
			equal(true, pid && pid > 0);
			await new Promise<void>(r => {
				disposables.push(window.onDidCloseTerminal(t => {
					if (t === terminal) {
						r();
					}
				}));
				terminal.dispose();
			});
		});

		test('name in constructor should set terminal.name', async () => {
			const terminal = window.createTerminal('a');
			const result = await new Promise<Terminal>(r => {
				disposables.push(window.onDidOpenTerminal(t => {
					if (t === terminal) {
						r(t);
					}
				}));
			});
			equal(result, terminal);
			await new Promise<void>(r => {
				disposables.push(window.onDidCloseTerminal(t => {
					if (t === terminal) {
						r();
					}
				}));
				terminal.dispose();
			});
		});

		test('creationOptions should be set and readonly for TerminalOptions terminals', async () => {
			const options = {
				name: 'foo',
				hideFromUser: true
			};
			const terminal = window.createTerminal(options);
			const terminalOptions = terminal.creationOptions as TerminalOptions;
			const result = await new Promise<Terminal>(r => {
				disposables.push(window.onDidOpenTerminal(t => {
					if (t === terminal) {
						r(t);
					}
				}));
			});
			equal(result, terminal);
			await new Promise<void>(r => {
				disposables.push(window.onDidCloseTerminal(t => {
					if (t === terminal) {
						r();
					}
				}));
				terminal.dispose();
			});
			throws(() => terminalOptions.name = 'bad', 'creationOptions should be readonly at runtime');
		});

		test('onDidOpenTerminal should fire when a terminal is created', async () => {
			const terminal = window.createTerminal('b');
			const result = await new Promise<Terminal>(r => {
				disposables.push(window.onDidOpenTerminal(t => {
					if (t === terminal) {
						r(t);
					}
				}));
			});
			equal(result, terminal);
			await new Promise<void>(r => {
				disposables.push(window.onDidCloseTerminal(t => {
					if (t === terminal) {
						r();
					}
				}));
				terminal.dispose();
			});
		});

		test('exitStatus.code should be set to undefined after a terminal is disposed', async () => {
			const terminal = window.createTerminal();
			const result = await new Promise<Terminal>(r => {
				disposables.push(window.onDidOpenTerminal(t => {
					if (t === terminal) {
						r(t);
					}
				}));
			});
			equal(result, terminal);
			await new Promise<void>(r => {
				disposables.push(window.onDidCloseTerminal(t => {
					if (t === terminal) {
						deepStrictEqual(t.exitStatus, { code: undefined, reason: TerminalExitReason.Extension });
						r();
					}
				}));
				terminal.dispose();
			});
		});

		test('onDidChangeTerminalState should fire with isInteractedWith after writing to a terminal', async () => {
			const terminal = window.createTerminal();
			strictEqual(terminal.state.isInteractedWith, false);
			const eventState = await new Promise<TerminalState>(r => {
				disposables.push(window.onDidChangeTerminalState(e => {
					if (e === terminal && e.state.isInteractedWith) {
						r(e.state);
					}
				}));
				terminal.sendText('test');
			});
			strictEqual(eventState.isInteractedWith, true);
			await new Promise<void>(r => {
				disposables.push(window.onDidCloseTerminal(t => {
					if (t === terminal) {
						r();
					}
				}));
				terminal.dispose();
			});
		});

		test('onDidChangeTerminalState should fire with shellType when created', async () => {
			const terminal = window.createTerminal();
			if (terminal.state.shell) {
				return;
			}
			await new Promise<void>(r => {
				disposables.push(window.onDidChangeTerminalState(e => {
					if (e === terminal && e.state.shell) {
						r();
					}
				}));
			});
			await new Promise<void>(r => {
				disposables.push(window.onDidCloseTerminal(t => {
					if (t === terminal) {
						r();
					}
				}));
				terminal.dispose();
			});
		});

		// test('onDidChangeActiveTerminal should fire when new terminals are created', (done) => {
		// 	const reg1 = window.onDidChangeActiveTerminal((active: Terminal | undefined) => {
		// 		equal(active, terminal);
		// 		equal(active, window.activeTerminal);
		// 		reg1.dispose();
		// 		const reg2 = window.onDidChangeActiveTerminal((active: Terminal | undefined) => {
		// 			equal(active, undefined);
		// 			equal(active, window.activeTerminal);
		// 			reg2.dispose();
		// 			done();
		// 		});
		// 		terminal.dispose();
		// 	});
		// 	const terminal = window.createTerminal();
		// 	terminal.show();
		// });

		// test('onDidChangeTerminalDimensions should fire when new terminals are created', (done) => {
		// 	const reg1 = window.onDidChangeTerminalDimensions(async (event: TerminalDimensionsChangeEvent) => {
		// 		equal(event.terminal, terminal1);
		// 		equal(typeof event.dimensions.columns, 'number');
		// 		equal(typeof event.dimensions.rows, 'number');
		// 		ok(event.dimensions.columns > 0);
		// 		ok(event.dimensions.rows > 0);
		// 		reg1.dispose();
		// 		let terminal2: Terminal;
		// 		const reg2 = window.onDidOpenTerminal((newTerminal) => {
		// 			// This is guarantees to fire before dimensions change event
		// 			if (newTerminal !== terminal1) {
		// 				terminal2 = newTerminal;
		// 				reg2.dispose();
		// 			}
		// 		});
		// 		let firstCalled = false;
		// 		let secondCalled = false;
		// 		const reg3 = window.onDidChangeTerminalDimensions((event: TerminalDimensionsChangeEvent) => {
		// 			if (event.terminal === terminal1) {
		// 				// The original terminal should fire dimension change after a split
		// 				firstCalled = true;
		// 			} else if (event.terminal !== terminal1) {
		// 				// The new split terminal should fire dimension change
		// 				secondCalled = true;
		// 			}
		// 			if (firstCalled && secondCalled) {
		// 				let firstDisposed = false;
		// 				let secondDisposed = false;
		// 				const reg4 = window.onDidCloseTerminal(term => {
		// 					if (term === terminal1) {
		// 						firstDisposed = true;
		// 					}
		// 					if (term === terminal2) {
		// 						secondDisposed = true;
		// 					}
		// 					if (firstDisposed && secondDisposed) {
		// 						reg4.dispose();
		// 						done();
		// 					}
		// 				});
		// 				terminal1.dispose();
		// 				terminal2.dispose();
		// 				reg3.dispose();
		// 			}
		// 		});
		// 		await timeout(500);
		// 		commands.executeCommand('workbench.action.terminal.split');
		// 	});
		// 	const terminal1 = window.createTerminal({ name: 'test' });
		// 	terminal1.show();
		// });

		suite('hideFromUser', () => {
			test('should be available to terminals API', async () => {
				const terminal = window.createTerminal({ name: 'bg', hideFromUser: true });
				const result = await new Promise<Terminal>(r => {
					disposables.push(window.onDidOpenTerminal(t => {
						if (t === terminal) {
							r(t);
						}
					}));
				});
				equal(result, terminal);
				equal(true, window.terminals.indexOf(terminal) !== -1);
				await new Promise<void>(r => {
					disposables.push(window.onDidCloseTerminal(t => {
						if (t === terminal) {
							r();
						}
					}));
					terminal.dispose();
				});
			});
		});

		suite('selection', () => {
			test('should be undefined immediately after creation', async () => {
				const terminal = window.createTerminal({ name: 'selection test' });
				terminal.show();
				equal(terminal.selection, undefined);
				terminal.dispose();
			});
			test('should be defined after selecting all content', async () => {
				const terminal = window.createTerminal({ name: 'selection test' });
				terminal.show();
				// Wait for some terminal data
				await new Promise<void>(r => {
					const disposable = window.onDidWriteTerminalData(() => {
						disposable.dispose();
						r();
					});
				});
				await commands.executeCommand('workbench.action.terminal.selectAll');
				await poll<void>(() => Promise.resolve(), () => terminal.selection !== undefined, 'selection should be defined');
				terminal.dispose();
			});
			test('should be undefined after clearing a selection', async () => {
				const terminal = window.createTerminal({ name: 'selection test' });
				terminal.show();
				// Wait for some terminal data
				await new Promise<void>(r => {
					const disposable = window.onDidWriteTerminalData(() => {
						disposable.dispose();
						r();
					});
				});
				await commands.executeCommand('workbench.action.terminal.selectAll');
				await poll<void>(() => Promise.resolve(), () => terminal.selection !== undefined, 'selection should be defined');
				await commands.executeCommand('workbench.action.terminal.clearSelection');
				await poll<void>(() => Promise.resolve(), () => terminal.selection === undefined, 'selection should not be defined');
				terminal.dispose();
			});
		});

		suite('window.onDidWriteTerminalData', () => {
			// still flaky with retries, skipping https://github.com/microsoft/vscode/issues/193505
			test.skip('should listen to all future terminal data events', function (done) {
				// This test has been flaky in the past but it's not clear why, possibly because
				// events from previous tests polluting the event recording in this test. Retries
				// was added so we continue to have coverage of the onDidWriteTerminalData API.
				this.retries(3);

				const openEvents: string[] = [];
				const dataEvents: { name: string; data: string }[] = [];
				const closeEvents: string[] = [];
				disposables.push(window.onDidOpenTerminal(e => openEvents.push(e.name)));

				let resolveOnceDataWritten: (() => void) | undefined;
				let resolveOnceClosed: (() => void) | undefined;

				disposables.push(window.onDidWriteTerminalData(e => {
					dataEvents.push({ name: e.terminal.name, data: e.data });

					resolveOnceDataWritten!();
				}));

				disposables.push(window.onDidCloseTerminal(e => {
					closeEvents.push(e.name);
					try {
						if (closeEvents.length === 1) {
							deepStrictEqual(openEvents, ['test1']);
							ok(dataEvents.some(e => e.name === 'test1' && e.data === 'write1'));
							deepStrictEqual(closeEvents, ['test1']);
						} else if (closeEvents.length === 2) {
							deepStrictEqual(openEvents, ['test1', 'test2']);
							ok(dataEvents.some(e => e.name === 'test1' && e.data === 'write1'));
							ok(dataEvents.some(e => e.name === 'test2' && e.data === 'write2'));
							deepStrictEqual(closeEvents, ['test1', 'test2']);
						}
						resolveOnceClosed!();
					} catch (e) {
						done(e);
					}
				}));

				const term1Write = new EventEmitter<string>();
				const term1Close = new EventEmitter<void>();
				window.createTerminal({
					name: 'test1', pty: {
						onDidWrite: term1Write.event,
						onDidClose: term1Close.event,
						open: async () => {
							term1Write.fire('write1');

							// Wait until the data is written
							await new Promise<void>(resolve => { resolveOnceDataWritten = resolve; });

							term1Close.fire();

							// Wait until the terminal is closed
							await new Promise<void>(resolve => { resolveOnceClosed = resolve; });

							const term2Write = new EventEmitter<string>();
							const term2Close = new EventEmitter<void>();
							window.createTerminal({
								name: 'test2', pty: {
									onDidWrite: term2Write.event,
									onDidClose: term2Close.event,
									open: async () => {
										term2Write.fire('write2');

										// Wait until the data is written
										await new Promise<void>(resolve => { resolveOnceDataWritten = resolve; });

										term2Close.fire();

										// Wait until the terminal is closed
										await new Promise<void>(resolve => { resolveOnceClosed = resolve; });

										done();
									},
									close: () => { }
								}
							});
						},
						close: () => { }
					}
				});
			});
		});

		suite('Extension pty terminals', () => {
			test('should fire onDidOpenTerminal and onDidCloseTerminal', async () => {
				const pty: Pseudoterminal = {
					onDidWrite: new EventEmitter<string>().event,
					open: () => { },
					close: () => { }
				};
				const terminal = await new Promise<Terminal>(r => {
					disposables.push(window.onDidOpenTerminal(t => {
						if (t.name === 'c') {
							r(t);
						}
					}));
					window.createTerminal({ name: 'c', pty });
				});
				await new Promise<void>(r => {
					disposables.push(window.onDidCloseTerminal(() => r()));
					terminal.dispose();
				});
			});

			// The below tests depend on global UI state and each other
			// test('should not provide dimensions on start as the terminal has not been shown yet', (done) => {
			// 	const reg1 = window.onDidOpenTerminal(term => {
			// 		equal(terminal, term);
			// 		reg1.dispose();
			// 	});
			// 	const pty: Pseudoterminal = {
			// 		onDidWrite: new EventEmitter<string>().event,
			// 		open: (dimensions) => {
			// 			equal(dimensions, undefined);
			// 			const reg3 = window.onDidCloseTerminal(() => {
			// 				reg3.dispose();
			// 				done();
			// 			});
			// 			// Show a terminal and wait a brief period before dispose, this will cause
			// 			// the panel to init it's dimenisons and be provided to following terminals.
			// 			// The following test depends on this.
			// 			terminal.show();
			// 			setTimeout(() => terminal.dispose(), 200);
			// 		},
			// 		close: () => {}
			// 	};
			// 	const terminal = window.createTerminal({ name: 'foo', pty });
			// });
			// test('should provide dimensions on start as the terminal has been shown', (done) => {
			// 	const reg1 = window.onDidOpenTerminal(term => {
			// 		equal(terminal, term);
			// 		reg1.dispose();
			// 	});
			// 	const pty: Pseudoterminal = {
			// 		onDidWrite: new EventEmitter<string>().event,
			// 		open: (dimensions) => {
			// 			// This test depends on Terminal.show being called some time before such
			// 			// that the panel dimensions are initialized and cached.
			// 			ok(dimensions!.columns > 0);
			// 			ok(dimensions!.rows > 0);
			// 			const reg3 = window.onDidCloseTerminal(() => {
			// 				reg3.dispose();
			// 				done();
			// 			});
			// 			terminal.dispose();
			// 		},
			// 		close: () => {}
			// 	};
			// 	const terminal = window.createTerminal({ name: 'foo', pty });
			// });

			// TODO: Fix test, flaky in CI (local and remote) https://github.com/microsoft/vscode/issues/137155
			test.skip('should respect dimension overrides', async () => {
				const writeEmitter = new EventEmitter<string>();
				const overrideDimensionsEmitter = new EventEmitter<TerminalDimensions>();
				const pty: Pseudoterminal = {
					onDidWrite: writeEmitter.event,
					onDidOverrideDimensions: overrideDimensionsEmitter.event,
					open: () => overrideDimensionsEmitter.fire({ columns: 10, rows: 5 }),
					close: () => { }
				};
				const terminal = await new Promise<Terminal>(r => {
					disposables.push(window.onDidOpenTerminal(t => {
						if (t === created) {
							r(t);
						}
					}));
					const created = window.createTerminal({ name: 'foo', pty });
				});
				// Exit the test early if dimensions already match which may happen if the exthost
				// has high latency
				if (terminal.dimensions?.columns === 10 && terminal.dimensions?.rows === 5) {
					return;
				}
				// TODO: Remove logs when the test is verified as non-flaky
				await new Promise<void>(r => {
					// Does this never fire because it's already set to 10x5?
					disposables.push(window.onDidChangeTerminalDimensions(e => {
						console.log(`window.onDidChangeTerminalDimensions event, dimensions = ${e.dimensions?.columns}x${e.dimensions?.rows}`);
						// The default pty dimensions have a chance to appear here since override
						// dimensions happens after the terminal is created. If so just ignore and
						// wait for the right dimensions
						if (e.terminal === terminal && e.dimensions.columns === 10 && e.dimensions.rows === 5) {
							disposables.push(window.onDidCloseTerminal(() => r()));
							terminal.dispose();
						}
					}));
					console.log(`listening for window.onDidChangeTerminalDimensions, current dimensions = ${terminal.dimensions?.columns}x${terminal.dimensions?.rows}`);
					terminal.show();
				});
			});

			test('should change terminal name', async () => {
				const changeNameEmitter = new EventEmitter<string>();
				const closeEmitter = new EventEmitter<number | undefined>();
				const pty: Pseudoterminal = {
					onDidWrite: new EventEmitter<string>().event,
					onDidChangeName: changeNameEmitter.event,
					onDidClose: closeEmitter.event,
					open: () => {
						changeNameEmitter.fire('bar');
						closeEmitter.fire(undefined);
					},
					close: () => { }
				};
				await new Promise<void>(r => {
					disposables.push(window.onDidOpenTerminal(t1 => {
						if (t1 === created) {
							disposables.push(window.onDidCloseTerminal(t2 => {
								if (t2 === created) {
									strictEqual(t1.name, 'bar');
									r();
								}
							}));
						}
					}));
					const created = window.createTerminal({ name: 'foo', pty });
				});
			});

			test('exitStatus.code should be set to the exit code (undefined)', async () => {
				const writeEmitter = new EventEmitter<string>();
				const closeEmitter = new EventEmitter<number | undefined>();
				const pty: Pseudoterminal = {
					onDidWrite: writeEmitter.event,
					onDidClose: closeEmitter.event,
					open: () => closeEmitter.fire(undefined),
					close: () => { }
				};
				await new Promise<void>(r => {
					disposables.push(window.onDidOpenTerminal(t1 => {
						if (t1 === created) {
							strictEqual(created.exitStatus, undefined);
							disposables.push(window.onDidCloseTerminal(t2 => {
								if (t2 === created) {
									deepStrictEqual(created.exitStatus, { code: undefined, reason: TerminalExitReason.Process });
									r();
								}
							}));
						}
					}));
					const created = window.createTerminal({ name: 'foo', pty });
				});
			});

			test('exitStatus.code should be set to the exit code (zero)', async () => {
				const writeEmitter = new EventEmitter<string>();
				const closeEmitter = new EventEmitter<number | undefined>();
				const pty: Pseudoterminal = {
					onDidWrite: writeEmitter.event,
					onDidClose: closeEmitter.event,
					open: () => closeEmitter.fire(0),
					close: () => { }
				};
				await new Promise<void>(r => {
					disposables.push(window.onDidOpenTerminal(t1 => {
						if (t1 === created) {
							strictEqual(created.exitStatus, undefined);
							disposables.push(window.onDidCloseTerminal(t2 => {
								if (t2 === created) {
									deepStrictEqual(created.exitStatus, { code: 0, reason: TerminalExitReason.Process });
									r();
								}
							}));
						}
					}));
					const created = window.createTerminal({ name: 'foo', pty });
				});
			});

			test('exitStatus.code should be set to the exit code (non-zero)', async () => {
				const writeEmitter = new EventEmitter<string>();
				const closeEmitter = new EventEmitter<number | undefined>();
				const pty: Pseudoterminal = {
					onDidWrite: writeEmitter.event,
					onDidClose: closeEmitter.event,
					open: () => {
						// Wait 500ms as any exits that occur within 500ms of terminal launch are
						// are counted as "exiting during launch" which triggers a notification even
						// when showExitAlerts is true
						setTimeout(() => closeEmitter.fire(22), 500);
					},
					close: () => { }
				};
				await new Promise<void>(r => {
					disposables.push(window.onDidOpenTerminal(t1 => {
						if (t1 === created) {
							strictEqual(created.exitStatus, undefined);
							disposables.push(window.onDidCloseTerminal(t2 => {
								if (t2 === created) {
									deepStrictEqual(created.exitStatus, { code: 22, reason: TerminalExitReason.Process });
									r();
								}
							}));
						}
					}));
					const created = window.createTerminal({ name: 'foo', pty });
				});
			});

			test('creationOptions should be set and readonly for ExtensionTerminalOptions terminals', async () => {
				const writeEmitter = new EventEmitter<string>();
				const pty: Pseudoterminal = {
					onDidWrite: writeEmitter.event,
					open: () => { },
					close: () => { }
				};
				const options = { name: 'foo', pty };
				await new Promise<void>(r => {
					disposables.push(window.onDidOpenTerminal(term => {
						if (term === terminal) {
							terminal.dispose();
							disposables.push(window.onDidCloseTerminal(() => r()));
						}
					}));
					const terminal = window.createTerminal(options);
					strictEqual(terminal.name, 'foo');
					const terminalOptions = terminal.creationOptions as ExtensionTerminalOptions;
					strictEqual(terminalOptions.name, 'foo');
					strictEqual(terminalOptions.pty, pty);
					throws(() => terminalOptions.name = 'bad', 'creationOptions should be readonly at runtime');
				});
			});
		});

		(process.platform === 'win32' ? suite.skip : suite)('environmentVariableCollection', () => {
			test('should have collection variables apply to terminals immediately after setting', async () => {
				// Setup collection and create terminal
				const collection = extensionContext.environmentVariableCollection;
				disposables.push({ dispose: () => collection.clear() });
				collection.replace('A', '~a2~');
				collection.append('B', '~b2~');
				collection.prepend('C', '~c2~');
				const terminal = window.createTerminal({
					env: {
						A: 'a1',
						B: 'b1',
						C: 'c1'
					}
				});

				// Listen for all data events
				let data = '';
				disposables.push(window.onDidWriteTerminalData(e => {
					if (terminal !== e.terminal) {
						return;
					}
					data += sanitizeData(e.data);
				}));

				// Run sh commands, if this is ever enabled on Windows we would also want to run
				// the pwsh equivalent
				terminal.sendText('echo "$A $B $C"');

				// Poll for the echo results to show up
				try {
					await poll<void>(() => Promise.resolve(), () => data.includes('~a2~'), '~a2~ should be printed');
					await poll<void>(() => Promise.resolve(), () => data.includes('b1~b2~'), 'b1~b2~ should be printed');
					await poll<void>(() => Promise.resolve(), () => data.includes('~c2~c1'), '~c2~c1 should be printed');
				} catch (err) {
					console.error('DATA UP UNTIL NOW:', data);
					throw err;
				}

				// Wait for terminal to be disposed
				await new Promise<void>(r => {
					disposables.push(window.onDidCloseTerminal(() => r()));
					terminal.dispose();
				});
			});

			test('should have collection variables apply to environment variables that don\'t exist', async () => {
				// Setup collection and create terminal
				const collection = extensionContext.environmentVariableCollection;
				disposables.push({ dispose: () => collection.clear() });
				collection.replace('A', '~a2~');
				collection.append('B', '~b2~');
				collection.prepend('C', '~c2~');
				const terminal = window.createTerminal({
					env: {
						A: null,
						B: null,
						C: null
					}
				});

				// Listen for all data events
				let data = '';
				disposables.push(window.onDidWriteTerminalData(e => {
					if (terminal !== e.terminal) {
						return;
					}
					data += sanitizeData(e.data);
				}));

				// Run sh commands, if this is ever enabled on Windows we would also want to run
				// the pwsh equivalent
				terminal.sendText('echo "$A $B $C"');

				// Poll for the echo results to show up
				try {
					await poll<void>(() => Promise.resolve(), () => data.includes('~a2~'), '~a2~ should be printed');
					await poll<void>(() => Promise.resolve(), () => data.includes('~b2~'), '~b2~ should be printed');
					await poll<void>(() => Promise.resolve(), () => data.includes('~c2~'), '~c2~ should be printed');
				} catch (err) {
					console.error('DATA UP UNTIL NOW:', data);
					throw err;
				}

				// Wait for terminal to be disposed
				await new Promise<void>(r => {
					disposables.push(window.onDidCloseTerminal(() => r()));
					terminal.dispose();
				});
			});

			test('should respect clearing entries', async () => {
				// Setup collection and create terminal
				const collection = extensionContext.environmentVariableCollection;
				disposables.push({ dispose: () => collection.clear() });
				collection.replace('A', '~a2~');
				collection.replace('B', '~a2~');
				collection.clear();
				const terminal = window.createTerminal({
					env: {
						A: '~a1~',
						B: '~b1~'
					}
				});

				// Listen for all data events
				let data = '';
				disposables.push(window.onDidWriteTerminalData(e => {
					if (terminal !== e.terminal) {
						return;
					}
					data += sanitizeData(e.data);
				}));

				// Run sh commands, if this is ever enabled on Windows we would also want to run
				// the pwsh equivalent
				terminal.sendText('echo "$A $B"');

				// Poll for the echo results to show up
				try {
					await poll<void>(() => Promise.resolve(), () => data.includes('~a1~'), '~a1~ should be printed');
					await poll<void>(() => Promise.resolve(), () => data.includes('~b1~'), '~b1~ should be printed');
				} catch (err) {
					console.error('DATA UP UNTIL NOW:', data);
					throw err;
				}

				// Wait for terminal to be disposed
				await new Promise<void>(r => {
					disposables.push(window.onDidCloseTerminal(() => r()));
					terminal.dispose();
				});
			});

			test('should respect deleting entries', async () => {
				// Setup collection and create terminal
				const collection = extensionContext.environmentVariableCollection;
				disposables.push({ dispose: () => collection.clear() });
				collection.replace('A', '~a2~');
				collection.replace('B', '~b2~');
				collection.delete('A');
				const terminal = window.createTerminal({
					env: {
						A: '~a1~',
						B: '~b2~'
					}
				});

				// Listen for all data events
				let data = '';
				disposables.push(window.onDidWriteTerminalData(e => {
					if (terminal !== e.terminal) {
						return;
					}
					data += sanitizeData(e.data);
				}));

				// Run sh commands, if this is ever enabled on Windows we would also want to run
				// the pwsh equivalent
				terminal.sendText('echo "$A $B"');

				// Poll for the echo results to show up
				try {
					await poll<void>(() => Promise.resolve(), () => data.includes('~a1~'), '~a1~ should be printed');
					await poll<void>(() => Promise.resolve(), () => data.includes('~b2~'), '~b2~ should be printed');
				} catch (err) {
					console.error('DATA UP UNTIL NOW:', data);
					throw err;
				}

				// Wait for terminal to be disposed
				await new Promise<void>(r => {
					disposables.push(window.onDidCloseTerminal(() => r()));
					terminal.dispose();
				});
			});

			test('get and forEach should work', () => {
				const collection = extensionContext.environmentVariableCollection;
				disposables.push({ dispose: () => collection.clear() });
				collection.replace('A', '~a2~');
				collection.append('B', '~b2~');
				collection.prepend('C', '~c2~');
				// Verify get
				const defaultOptions: Required<EnvironmentVariableMutatorOptions> = {
					applyAtProcessCreation: true,
					applyAtShellIntegration: false
				};
				deepStrictEqual(collection.get('A'), { value: '~a2~', type: EnvironmentVariableMutatorType.Replace, options: defaultOptions, variable: 'A' });
				deepStrictEqual(collection.get('B'), { value: '~b2~', type: EnvironmentVariableMutatorType.Append, options: defaultOptions, variable: 'B' });
				deepStrictEqual(collection.get('C'), { value: '~c2~', type: EnvironmentVariableMutatorType.Prepend, options: defaultOptions, variable: 'C' });
				// Verify forEach
				const entries: [string, EnvironmentVariableMutator][] = [];
				collection.forEach((v, m) => entries.push([v, m]));
				deepStrictEqual(entries, [
					['A', { value: '~a2~', type: EnvironmentVariableMutatorType.Replace, options: defaultOptions, variable: 'A' }],
					['B', { value: '~b2~', type: EnvironmentVariableMutatorType.Append, options: defaultOptions, variable: 'B' }],
					['C', { value: '~c2~', type: EnvironmentVariableMutatorType.Prepend, options: defaultOptions, variable: 'C' }]
				]);
			});

			test('get and forEach should work (scope)', () => {
				const collection = extensionContext.environmentVariableCollection;
				disposables.push({ dispose: () => collection.clear() });
				const scope = { workspaceFolder: { uri: Uri.file('workspace1'), name: 'workspace1', index: 0 } };
				const scopedCollection = collection.getScoped(scope);
				scopedCollection.replace('A', 'scoped~a2~');
				scopedCollection.append('B', 'scoped~b2~');
				scopedCollection.prepend('C', 'scoped~c2~');
				collection.replace('A', '~a2~');
				collection.append('B', '~b2~');
				collection.prepend('C', '~c2~');
				// Verify get for scope
				const defaultOptions: Required<EnvironmentVariableMutatorOptions> = {
					applyAtProcessCreation: true,
					applyAtShellIntegration: false
				};
				const expectedScopedCollection = collection.getScoped(scope);
				deepStrictEqual(expectedScopedCollection.get('A'), { value: 'scoped~a2~', type: EnvironmentVariableMutatorType.Replace, options: defaultOptions, variable: 'A' });
				deepStrictEqual(expectedScopedCollection.get('B'), { value: 'scoped~b2~', type: EnvironmentVariableMutatorType.Append, options: defaultOptions, variable: 'B' });
				deepStrictEqual(expectedScopedCollection.get('C'), { value: 'scoped~c2~', type: EnvironmentVariableMutatorType.Prepend, options: defaultOptions, variable: 'C' });

				// Verify forEach
				const entries: [string, EnvironmentVariableMutator][] = [];
				expectedScopedCollection.forEach((v, m) => entries.push([v, m]));
				deepStrictEqual(entries.map(v => v[1]), [
					{ value: 'scoped~a2~', type: EnvironmentVariableMutatorType.Replace, options: defaultOptions, variable: 'A' },
					{ value: 'scoped~b2~', type: EnvironmentVariableMutatorType.Append, options: defaultOptions, variable: 'B' },
					{ value: 'scoped~c2~', type: EnvironmentVariableMutatorType.Prepend, options: defaultOptions, variable: 'C' }
				]);
				deepStrictEqual(entries.map(v => v[0]), ['A', 'B', 'C']);
			});
		});
	});
});

function sanitizeData(data: string): string {
	// Strip NL/CR so terminal dimensions don't impact tests
	data = data.replace(/[\r\n]/g, '');

	// Strip escape sequences so winpty/conpty doesn't cause flakiness, do for all platforms for
	// consistency
	const CSI_SEQUENCE = /(:?(:?\x1b\[|\x9B)[=?>!]?[\d;:]*["$#'* ]?[a-zA-Z@^`{}|~])|(:?\x1b\].*?\x07)/g;
	data = data.replace(CSI_SEQUENCE, '');

	return data;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/tree.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/tree.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import * as vscode from 'vscode';
import { asPromise, assertNoRpc, disposeAll, delay, DeferredPromise } from '../utils';

suite('vscode API - tree', () => {

	const disposables: vscode.Disposable[] = [];

	teardown(() => {
		disposeAll(disposables);
		disposables.length = 0;
		assertNoRpc();
	});

	test('TreeView - element already registered', async function () {
		this.timeout(60_000);

		type TreeElement = { readonly kind: 'leaf' };

		class QuickRefreshTreeDataProvider implements vscode.TreeDataProvider<TreeElement> {
			private readonly changeEmitter = new vscode.EventEmitter<TreeElement | undefined>();
			private readonly requestEmitter = new vscode.EventEmitter<number>();
			private readonly pendingRequests: DeferredPromise<TreeElement[]>[] = [];
			private readonly element: TreeElement = { kind: 'leaf' };

			readonly onDidChangeTreeData = this.changeEmitter.event;

			getChildren(element?: TreeElement): Thenable<TreeElement[]> {
				if (!element) {
					const deferred = new DeferredPromise<TreeElement[]>();
					this.pendingRequests.push(deferred);
					this.requestEmitter.fire(this.pendingRequests.length);
					return deferred.p;
				}
				return Promise.resolve([]);
			}

			getTreeItem(): vscode.TreeItem {
				const item = new vscode.TreeItem('duplicate', vscode.TreeItemCollapsibleState.None);
				item.id = 'dup';
				return item;
			}

			getParent(): TreeElement | undefined {
				return undefined;
			}

			async waitForRequestCount(count: number): Promise<void> {
				while (this.pendingRequests.length < count) {
					await asPromise(this.requestEmitter.event);
				}
			}

			async resolveNextRequest(): Promise<void> {
				const next = this.pendingRequests.shift();
				if (!next) {
					return;
				}
				await next.complete([this.element]);
			}

			dispose(): void {
				this.changeEmitter.dispose();
				this.requestEmitter.dispose();
				while (this.pendingRequests.length) {
					this.pendingRequests.shift()!.complete([]);
				}
			}

			getElement(): TreeElement {
				return this.element;
			}
		}

		const provider = new QuickRefreshTreeDataProvider();
		disposables.push(provider);

		const treeView = vscode.window.createTreeView('test.treeId', { treeDataProvider: provider });
		disposables.push(treeView);

		const revealFirst = (treeView.reveal(provider.getElement(), { expand: true })
			.then(() => ({ error: undefined as Error | undefined })) as Promise<{ error: Error | undefined }>)
			.catch(error => ({ error }));
		const revealSecond = (treeView.reveal(provider.getElement(), { expand: true })
			.then(() => ({ error: undefined as Error | undefined })) as Promise<{ error: Error | undefined }>)
			.catch(error => ({ error }));

		await provider.waitForRequestCount(2);

		await provider.resolveNextRequest();
		await delay(0);
		await provider.resolveNextRequest();

		const [firstResult, secondResult] = await Promise.all([revealFirst, revealSecond]);
		const error = firstResult.error ?? secondResult.error;
		if (error && /Element with id .+ is already registered/.test(error.message)) {
			assert.fail(error.message);
		}
	});

	test('TreeView - element already registered after refresh', async function () {
		this.timeout(60_000);

		type ParentElement = { readonly kind: 'parent' };
		type ChildElement = { readonly kind: 'leaf'; readonly version: number };
		type TreeElement = ParentElement | ChildElement;

		class ParentRefreshTreeDataProvider implements vscode.TreeDataProvider<TreeElement> {
			private readonly changeEmitter = new vscode.EventEmitter<TreeElement | undefined>();
			private readonly rootRequestEmitter = new vscode.EventEmitter<number>();
			private readonly childRequestEmitter = new vscode.EventEmitter<number>();
			private readonly rootRequests: DeferredPromise<TreeElement[]>[] = [];
			private readonly childRequests: DeferredPromise<TreeElement[]>[] = [];
			private readonly parentElement: ParentElement = { kind: 'parent' };
			private childVersion = 0;
			private currentChild: ChildElement = { kind: 'leaf', version: 0 };

			readonly onDidChangeTreeData = this.changeEmitter.event;

			getChildren(element?: TreeElement): Thenable<TreeElement[]> {
				if (!element) {
					const deferred = new DeferredPromise<TreeElement[]>();
					this.rootRequests.push(deferred);
					this.rootRequestEmitter.fire(this.rootRequests.length);
					return deferred.p;
				}
				if (element.kind === 'parent') {
					const deferred = new DeferredPromise<TreeElement[]>();
					this.childRequests.push(deferred);
					this.childRequestEmitter.fire(this.childRequests.length);
					return deferred.p;
				}
				return Promise.resolve([]);
			}

			getTreeItem(element: TreeElement): vscode.TreeItem {
				if (element.kind === 'parent') {
					const item = new vscode.TreeItem('parent', vscode.TreeItemCollapsibleState.Collapsed);
					item.id = 'parent';
					return item;
				}
				const item = new vscode.TreeItem('duplicate', vscode.TreeItemCollapsibleState.None);
				item.id = 'dup';
				return item;
			}

			getParent(element: TreeElement): TreeElement | undefined {
				if (element.kind === 'leaf') {
					return this.parentElement;
				}
				return undefined;
			}

			getCurrentChild(): ChildElement {
				return this.currentChild;
			}

			replaceChild(): ChildElement {
				this.childVersion++;
				this.currentChild = { kind: 'leaf', version: this.childVersion };
				return this.currentChild;
			}

			async waitForRootRequestCount(count: number): Promise<void> {
				while (this.rootRequests.length < count) {
					await asPromise(this.rootRequestEmitter.event);
				}
			}

			async waitForChildRequestCount(count: number): Promise<void> {
				while (this.childRequests.length < count) {
					await asPromise(this.childRequestEmitter.event);
				}
			}

			async resolveNextRootRequest(elements?: TreeElement[]): Promise<void> {
				const next = this.rootRequests.shift();
				if (!next) {
					return;
				}
				await next.complete(elements ?? [this.parentElement]);
			}

			async resolveChildRequestAt(index: number, elements?: TreeElement[]): Promise<void> {
				const request = this.childRequests[index];
				if (!request) {
					return;
				}
				this.childRequests.splice(index, 1);
				await request.complete(elements ?? [this.currentChild]);
			}

			dispose(): void {
				this.changeEmitter.dispose();
				this.rootRequestEmitter.dispose();
				this.childRequestEmitter.dispose();
				while (this.rootRequests.length) {
					this.rootRequests.shift()!.complete([]);
				}
				while (this.childRequests.length) {
					this.childRequests.shift()!.complete([]);
				}
			}
		}

		const provider = new ParentRefreshTreeDataProvider();
		disposables.push(provider);

		const treeView = vscode.window.createTreeView('test.treeRefresh', { treeDataProvider: provider });
		disposables.push(treeView);

		const initialChild = provider.getCurrentChild();
		const firstReveal = (treeView.reveal(initialChild, { expand: true })
			.then(() => ({ error: undefined as Error | undefined })) as Promise<{ error: Error | undefined }>)
			.catch(error => ({ error }));

		await provider.waitForRootRequestCount(1);
		await provider.resolveNextRootRequest();

		await provider.waitForChildRequestCount(1);
		const staleChild = provider.getCurrentChild();
		const refreshedChild = provider.replaceChild();
		const secondReveal = (treeView.reveal(refreshedChild, { expand: true })
			.then(() => ({ error: undefined as Error | undefined })) as Promise<{ error: Error | undefined }>)
			.catch(error => ({ error }));

		await provider.waitForChildRequestCount(2);

		await provider.resolveChildRequestAt(1, [refreshedChild]);
		await delay(0);
		await provider.resolveChildRequestAt(0, [staleChild]);

		const [firstResult, secondResult] = await Promise.all([firstReveal, secondReveal]);
		const error = firstResult.error ?? secondResult.error;
		if (error && /Element with id .+ is already registered/.test(error.message)) {
			assert.fail(error.message);
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/types.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/types.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import * as vscode from 'vscode';
import { assertNoRpc } from '../utils';

suite('vscode API - types', () => {

	teardown(assertNoRpc);

	test('static properties, es5 compat class', function () {
		assert.ok(vscode.ThemeIcon.File instanceof vscode.ThemeIcon);
		assert.ok(vscode.ThemeIcon.Folder instanceof vscode.ThemeIcon);
		assert.ok(vscode.CodeActionKind.Empty instanceof vscode.CodeActionKind);
		assert.ok(vscode.CodeActionKind.QuickFix instanceof vscode.CodeActionKind);
		assert.ok(vscode.CodeActionKind.Refactor instanceof vscode.CodeActionKind);
		assert.ok(vscode.CodeActionKind.RefactorExtract instanceof vscode.CodeActionKind);
		assert.ok(vscode.CodeActionKind.RefactorInline instanceof vscode.CodeActionKind);
		assert.ok(vscode.CodeActionKind.RefactorMove instanceof vscode.CodeActionKind);
		assert.ok(vscode.CodeActionKind.RefactorRewrite instanceof vscode.CodeActionKind);
		assert.ok(vscode.CodeActionKind.Source instanceof vscode.CodeActionKind);
		assert.ok(vscode.CodeActionKind.SourceOrganizeImports instanceof vscode.CodeActionKind);
		assert.ok(vscode.CodeActionKind.SourceFixAll instanceof vscode.CodeActionKind);
		// assert.ok(vscode.QuickInputButtons.Back instanceof vscode.QuickInputButtons); never was an instance

	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/window.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/window.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { join } from 'path';
import { CancellationTokenSource, commands, MarkdownString, TabInputNotebook, Position, QuickPickItem, Selection, StatusBarAlignment, TextEditor, TextEditorSelectionChangeKind, TextEditorViewColumnChangeEvent, TabInputText, Uri, ViewColumn, window, workspace, TabInputTextDiff, UIKind, env } from 'vscode';
import { assertNoRpc, closeAllEditors, createRandomFile, pathEquals } from '../utils';


suite('vscode API - window', () => {

	teardown(async function () {
		assertNoRpc();
		await closeAllEditors();
	});

	test('editor, active text editor', async () => {
		const doc = await workspace.openTextDocument(join(workspace.rootPath || '', './far.js'));
		await window.showTextDocument(doc);
		const active = window.activeTextEditor;
		assert.ok(active);
		assert.ok(pathEquals(active!.document.uri.fsPath, doc.uri.fsPath));
	});

	test('editor, opened via resource', () => {
		const uri = Uri.file(join(workspace.rootPath || '', './far.js'));
		return window.showTextDocument(uri).then((_editor) => {
			const active = window.activeTextEditor;
			assert.ok(active);
			assert.ok(pathEquals(active!.document.uri.fsPath, uri.fsPath));
		});
	});

	// test('editor, UN-active text editor', () => {
	// 	assert.strictEqual(window.visibleTextEditors.length, 0);
	// 	assert.ok(window.activeTextEditor === undefined);
	// });

	test('editor, assign and check view columns', async () => {
		const doc = await workspace.openTextDocument(join(workspace.rootPath || '', './far.js'));
		const p1 = window.showTextDocument(doc, ViewColumn.One).then(editor => {
			assert.strictEqual(editor.viewColumn, ViewColumn.One);
		});
		const p2 = window.showTextDocument(doc, ViewColumn.Two).then(editor_1 => {
			assert.strictEqual(editor_1.viewColumn, ViewColumn.Two);
		});
		const p3 = window.showTextDocument(doc, ViewColumn.Three).then(editor_2 => {
			assert.strictEqual(editor_2.viewColumn, ViewColumn.Three);
		});
		return Promise.all([p1, p2, p3]);
	});

	test('editor, onDidChangeVisibleTextEditors', async () => {
		let eventCounter = 0;
		const reg = window.onDidChangeVisibleTextEditors(_editor => {
			eventCounter += 1;
		});

		const doc = await workspace.openTextDocument(join(workspace.rootPath || '', './far.js'));
		await window.showTextDocument(doc, ViewColumn.One);
		assert.strictEqual(eventCounter, 1);

		await window.showTextDocument(doc, ViewColumn.Two);
		assert.strictEqual(eventCounter, 2);

		await window.showTextDocument(doc, ViewColumn.Three);
		assert.strictEqual(eventCounter, 3);

		reg.dispose();
	});

	test('editor, onDidChangeTextEditorViewColumn (close editor)', async () => {

		const registration1 = workspace.registerTextDocumentContentProvider('bikes', {
			provideTextDocumentContent() {
				return 'mountainbiking,roadcycling';
			}
		});

		const doc1 = await workspace.openTextDocument(Uri.parse('bikes://testing/one'));
		await window.showTextDocument(doc1, ViewColumn.One);

		const doc2 = await workspace.openTextDocument(Uri.parse('bikes://testing/two'));
		const two = await window.showTextDocument(doc2, ViewColumn.Two);

		assert.strictEqual(window.activeTextEditor?.viewColumn, ViewColumn.Two);

		const actualEvent = await new Promise<TextEditorViewColumnChangeEvent>(resolve => {
			const registration2 = window.onDidChangeTextEditorViewColumn(event => {
				registration2.dispose();
				resolve(event);
			});
			// close editor 1, wait a little for the event to bubble
			commands.executeCommand('workbench.action.closeEditorsInOtherGroups');
		});
		assert.ok(actualEvent);
		assert.ok(actualEvent.textEditor === two);
		assert.ok(actualEvent.viewColumn === two.viewColumn);

		registration1.dispose();
	});

	test('editor, onDidChangeTextEditorViewColumn (move editor group)', async () => {

		const registration1 = workspace.registerTextDocumentContentProvider('bikes', {
			provideTextDocumentContent() {
				return 'mountainbiking,roadcycling';
			}
		});

		const doc1 = await workspace.openTextDocument(Uri.parse('bikes://testing/one'));
		await window.showTextDocument(doc1, ViewColumn.One);

		const doc2 = await workspace.openTextDocument(Uri.parse('bikes://testing/two'));
		await window.showTextDocument(doc2, ViewColumn.Two);

		assert.strictEqual(window.activeTextEditor?.viewColumn, ViewColumn.Two);

		const actualEvents = await new Promise<TextEditorViewColumnChangeEvent[]>(resolve => {

			const actualEvents: TextEditorViewColumnChangeEvent[] = [];

			const registration2 = window.onDidChangeTextEditorViewColumn(event => {
				actualEvents.push(event);

				if (actualEvents.length === 2) {
					registration2.dispose();
					resolve(actualEvents);
				}
			});

			// move active editor group left
			return commands.executeCommand('workbench.action.moveActiveEditorGroupLeft');

		});
		assert.strictEqual(actualEvents.length, 2);

		for (const event of actualEvents) {
			assert.strictEqual(event.viewColumn, event.textEditor.viewColumn);
		}

		registration1.dispose();
	});

	test('active editor not always correct... #49125', async function () {

		if (!window.state.focused) {
			// no focus!
			this.skip();
			return;
		}

		if (process.env['BUILD_SOURCEVERSION'] || process.env['CI']) {
			this.skip();
			return;
		}
		function assertActiveEditor(editor: TextEditor) {
			if (window.activeTextEditor === editor) {
				assert.ok(true);
				return;
			}
			function printEditor(editor: TextEditor): string {
				return `doc: ${editor.document.uri.toString()}, column: ${editor.viewColumn}, active: ${editor === window.activeTextEditor}`;
			}
			const visible = window.visibleTextEditors.map(editor => printEditor(editor));
			assert.ok(false, `ACTIVE editor should be ${printEditor(editor)}, BUT HAVING ${visible.join(', ')}`);

		}

		const randomFile1 = await createRandomFile();
		const randomFile2 = await createRandomFile();

		const [docA, docB] = await Promise.all([
			workspace.openTextDocument(randomFile1),
			workspace.openTextDocument(randomFile2)
		]);
		for (let c = 0; c < 4; c++) {
			const editorA = await window.showTextDocument(docA, ViewColumn.One);
			assertActiveEditor(editorA);

			const editorB = await window.showTextDocument(docB, ViewColumn.Two);
			assertActiveEditor(editorB);
		}
	});

	test('editor, opening multiple at the same time #134786', async () => {
		const fileA = await createRandomFile();
		const fileB = await createRandomFile();
		const fileC = await createRandomFile();

		const testFiles = [fileA, fileB, fileC];
		const result = await Promise.all(testFiles.map(async testFile => {
			try {
				const doc = await workspace.openTextDocument(testFile);
				const editor = await window.showTextDocument(doc);

				return editor.document.uri;
			} catch (error) {
				return undefined;
			}
		}));

		// verify the result array matches our expectations: depending
		// on execution time there are 2 possible results for the first
		// two entries. For the last entry there is only the `fileC` URI
		// as expected result because it is the last editor opened.
		// - either `undefined` indicating that the opening of the editor
		//   was cancelled by the next editor opening
		// - or the expected `URI` that was opened in case it suceeds

		assert.strictEqual(result.length, 3);
		if (result[0]) {
			assert.strictEqual(result[0].toString(), fileA.toString());
		} else {
			assert.strictEqual(result[0], undefined);
		}
		if (result[1]) {
			assert.strictEqual(result[1].toString(), fileB.toString());
		} else {
			assert.strictEqual(result[1], undefined);
		}
		assert.strictEqual(result[2]?.toString(), fileC.toString());
	});

	test('default column when opening a file', async () => {
		const [docA, docB, docC] = await Promise.all([
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile())
		]);

		await window.showTextDocument(docA, ViewColumn.One);
		await window.showTextDocument(docB, ViewColumn.Two);

		assert.ok(window.activeTextEditor);
		assert.ok(window.activeTextEditor!.document === docB);
		assert.strictEqual(window.activeTextEditor!.viewColumn, ViewColumn.Two);

		const editor = await window.showTextDocument(docC);
		assert.ok(
			window.activeTextEditor === editor,
			`wanted fileName:${editor.document.fileName}/viewColumn:${editor.viewColumn} but got fileName:${window.activeTextEditor!.document.fileName}/viewColumn:${window.activeTextEditor!.viewColumn}. a:${docA.fileName}, b:${docB.fileName}, c:${docC.fileName}`
		);
		assert.ok(window.activeTextEditor!.document === docC);
		assert.strictEqual(window.activeTextEditor!.viewColumn, ViewColumn.Two);
	});

	test('showTextDocument ViewColumn.BESIDE', async () => {
		const [docA, docB, docC] = await Promise.all([
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile())
		]);

		await window.showTextDocument(docA, ViewColumn.One);
		await window.showTextDocument(docB, ViewColumn.Beside);

		assert.ok(window.activeTextEditor);
		assert.ok(window.activeTextEditor!.document === docB);
		assert.strictEqual(window.activeTextEditor!.viewColumn, ViewColumn.Two);

		await window.showTextDocument(docC, ViewColumn.Beside);

		assert.ok(window.activeTextEditor!.document === docC);
		assert.strictEqual(window.activeTextEditor!.viewColumn, ViewColumn.Three);
	});

	test('showTextDocument ViewColumn is always defined (even when opening > ViewColumn.Nine)', async () => {
		const [doc1, doc2, doc3, doc4, doc5, doc6, doc7, doc8, doc9, doc10] = await Promise.all([
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile())
		]);

		await window.showTextDocument(doc1, ViewColumn.One);
		await window.showTextDocument(doc2, ViewColumn.Two);
		await window.showTextDocument(doc3, ViewColumn.Three);
		await window.showTextDocument(doc4, ViewColumn.Four);
		await window.showTextDocument(doc5, ViewColumn.Five);
		await window.showTextDocument(doc6, ViewColumn.Six);
		await window.showTextDocument(doc7, ViewColumn.Seven);
		await window.showTextDocument(doc8, ViewColumn.Eight);
		await window.showTextDocument(doc9, ViewColumn.Nine);
		await window.showTextDocument(doc10, ViewColumn.Beside);

		assert.ok(window.activeTextEditor);
		assert.ok(window.activeTextEditor!.document === doc10);
		assert.strictEqual(window.activeTextEditor!.viewColumn, 10);
	});

	test('issue #27408 - showTextDocument & vscode.diff always default to ViewColumn.One', async () => {
		const [docA, docB, docC] = await Promise.all([
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile())
		]);

		await window.showTextDocument(docA, ViewColumn.One);
		await window.showTextDocument(docB, ViewColumn.Two);

		assert.ok(window.activeTextEditor);
		assert.ok(window.activeTextEditor!.document === docB);
		assert.strictEqual(window.activeTextEditor!.viewColumn, ViewColumn.Two);

		await window.showTextDocument(docC, ViewColumn.Active);

		assert.ok(window.activeTextEditor!.document === docC);
		assert.strictEqual(window.activeTextEditor!.viewColumn, ViewColumn.Two);
	});

	test('issue #5362 - Incorrect TextEditor passed by onDidChangeTextEditorSelection', (done) => {
		const file10Path = join(workspace.rootPath || '', './10linefile.ts');
		const file30Path = join(workspace.rootPath || '', './30linefile.ts');

		let finished = false;
		const failOncePlease = (err: Error) => {
			if (finished) {
				return;
			}
			finished = true;
			done(err);
		};

		const passOncePlease = () => {
			if (finished) {
				return;
			}
			finished = true;
			done(null);
		};

		const subscription = window.onDidChangeTextEditorSelection((e) => {
			const lineCount = e.textEditor.document.lineCount;
			const pos1 = e.textEditor.selections[0].active.line;
			const pos2 = e.selections[0].active.line;

			if (pos1 !== pos2) {
				failOncePlease(new Error('received invalid selection changed event!'));
				return;
			}

			if (pos1 >= lineCount) {
				failOncePlease(new Error(`Cursor position (${pos1}) is not valid in the document ${e.textEditor.document.fileName} that has ${lineCount} lines.`));
				return;
			}
		});

		// Open 10 line file, show it in slot 1, set cursor to line 10
		// Open 30 line file, show it in slot 1, set cursor to line 30
		// Open 10 line file, show it in slot 1
		// Open 30 line file, show it in slot 1
		workspace.openTextDocument(file10Path).then((doc) => {
			return window.showTextDocument(doc, ViewColumn.One);
		}).then((editor10line) => {
			editor10line.selection = new Selection(new Position(9, 0), new Position(9, 0));
		}).then(() => {
			return workspace.openTextDocument(file30Path);
		}).then((doc) => {
			return window.showTextDocument(doc, ViewColumn.One);
		}).then((editor30line) => {
			editor30line.selection = new Selection(new Position(29, 0), new Position(29, 0));
		}).then(() => {
			return workspace.openTextDocument(file10Path);
		}).then((doc) => {
			return window.showTextDocument(doc, ViewColumn.One);
		}).then(() => {
			return workspace.openTextDocument(file30Path);
		}).then((doc) => {
			return window.showTextDocument(doc, ViewColumn.One);
		}).then(() => {
			subscription.dispose();
		}).then(passOncePlease, failOncePlease);
	});

	//#region Tabs API tests
	// test('Tabs - move tab', async function () {
	// 	const [docA, docB, docC] = await Promise.all([
	// 		workspace.openTextDocument(await createRandomFile()),
	// 		workspace.openTextDocument(await createRandomFile()),
	// 		workspace.openTextDocument(await createRandomFile())
	// 	]);

	// 	await window.showTextDocument(docA, { viewColumn: ViewColumn.One, preview: false });
	// 	await window.showTextDocument(docB, { viewColumn: ViewColumn.One, preview: false });
	// 	await window.showTextDocument(docC, { viewColumn: ViewColumn.Two, preview: false });

	// 	const tabGroups = window.tabGroups;
	// 	assert.strictEqual(tabGroups.all.length, 2);

	// 	const group1Tabs = tabGroups.all[0].tabs;
	// 	assert.strictEqual(group1Tabs.length, 2);

	// 	const group2Tabs = tabGroups.all[1].tabs;
	// 	assert.strictEqual(group2Tabs.length, 1);

	// 	await tabGroups.move(group1Tabs[0], ViewColumn.One, 1);
	// });

	// TODO @lramos15 re-enable these once shape is more stable
	test('Tabs - vscode.open & vscode.diff', async function () {
		// Simple function to get the active tab
		const getActiveTab = () => {
			return window.tabGroups.all.find(g => g.isActive)?.activeTab;
		};

		const [docA, docB, docC] = await Promise.all([
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile())
		]);

		await window.showTextDocument(docA, { viewColumn: ViewColumn.One, preview: false });
		await window.showTextDocument(docB, { viewColumn: ViewColumn.One, preview: false });
		await window.showTextDocument(docC, { viewColumn: ViewColumn.Two, preview: false });

		const commandFile = await createRandomFile();
		await commands.executeCommand('vscode.open', commandFile, ViewColumn.Three);
		// Ensure active tab is correct after calling vscode.open
		assert.strictEqual(getActiveTab()?.group.viewColumn, ViewColumn.Three);

		const leftDiff = await createRandomFile();
		const rightDiff = await createRandomFile();
		await commands.executeCommand('vscode.diff', leftDiff, rightDiff, 'Diff', { viewColumn: ViewColumn.Four, preview: false });
		assert.strictEqual(getActiveTab()?.group.viewColumn, ViewColumn.Four);

		const tabs = window.tabGroups.all.map(g => g.tabs).flat(1);
		assert.strictEqual(tabs.length, 5);
		assert.ok(tabs[0].input instanceof TabInputText);
		assert.strictEqual(tabs[0].input.uri.toString(), docA.uri.toString());
		assert.ok(tabs[1].input instanceof TabInputText);
		assert.strictEqual(tabs[1].input.uri.toString(), docB.uri.toString());
		assert.ok(tabs[2].input instanceof TabInputText);
		assert.strictEqual(tabs[2].input.uri.toString(), docC.uri.toString());
		assert.ok(tabs[3].input instanceof TabInputText);
		assert.strictEqual(tabs[3].input.uri.toString(), commandFile.toString());
	});

	(env.uiKind === UIKind.Web ? test.skip : test)('Tabs - Ensure tabs getter is correct', async function () {
		// Reduce test timeout as this test should be quick, so even with 3 retries it will be under 60s.
		this.timeout(10000);
		// This test can be flaky because of opening a notebook
		// Sometimes the webview doesn't resolve especially on windows so we will retry 3 times
		this.retries(3);
		const [docA, docB, docC, notebookDoc] = await Promise.all([
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile()),
			workspace.openNotebookDocument('jupyter-notebook', undefined)
		]);

		await window.showTextDocument(docA, { viewColumn: ViewColumn.One, preview: false });
		await window.showTextDocument(docB, { viewColumn: ViewColumn.Two, preview: false });
		await window.showTextDocument(docC, { viewColumn: ViewColumn.Three, preview: false });
		await window.showNotebookDocument(notebookDoc, { viewColumn: ViewColumn.One, preview: false });

		const leftDiff = await createRandomFile();
		const rightDiff = await createRandomFile();
		await commands.executeCommand('vscode.diff', leftDiff, rightDiff, 'Diff', { viewColumn: ViewColumn.Three, preview: false });

		const tabs = window.tabGroups.all.map(g => g.tabs).flat(1);
		assert.strictEqual(tabs.length, 5);

		// All resources should match the text documents as they're the only tabs currently open
		assert.ok(tabs[0].input instanceof TabInputText);
		assert.strictEqual(tabs[0].input.uri.toString(), docA.uri.toString());
		assert.ok(tabs[1].input instanceof TabInputNotebook);
		assert.strictEqual(tabs[1].input.uri.toString(), notebookDoc.uri.toString());
		assert.ok(tabs[2].input instanceof TabInputText);
		assert.strictEqual(tabs[2].input.uri.toString(), docB.uri.toString());
		assert.ok(tabs[3].input instanceof TabInputText);
		assert.strictEqual(tabs[3].input.uri.toString(), docC.uri.toString());
		// Diff editor and side by side editor report the right side as the resource
		assert.ok(tabs[4].input instanceof TabInputTextDiff);
		assert.strictEqual(tabs[4].input.modified.toString(), rightDiff.toString());

		assert.strictEqual(tabs[0].group.viewColumn, ViewColumn.One);
		assert.strictEqual(tabs[1].group.viewColumn, ViewColumn.One);
		assert.strictEqual(tabs[2].group.viewColumn, ViewColumn.Two);
		assert.strictEqual(tabs[3].group.viewColumn, ViewColumn.Three);
		assert.strictEqual(tabs[4].group.viewColumn, ViewColumn.Three);
	});

	test('Tabs - ensure active tab is correct', async () => {

		const [docA, docB, docC] = await Promise.all([
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile()),
		]);

		// Function to acquire the active tab within the active group
		const getActiveTabInActiveGroup = () => {
			const activeGroup = window.tabGroups.all.filter(group => group.isActive)[0];
			return activeGroup?.activeTab;
		};

		await window.showTextDocument(docA, { viewColumn: ViewColumn.One, preview: false });
		let activeTab = getActiveTabInActiveGroup();
		assert.ok(activeTab);
		assert.ok(activeTab.input instanceof TabInputText);
		assert.strictEqual(activeTab.input.uri.toString(), docA.uri.toString());

		await window.showTextDocument(docB, { viewColumn: ViewColumn.Two, preview: false });
		activeTab = getActiveTabInActiveGroup();
		assert.ok(activeTab);
		assert.ok(activeTab.input instanceof TabInputText);
		assert.strictEqual(activeTab.input.uri.toString(), docB.uri.toString());

		await window.showTextDocument(docC, { viewColumn: ViewColumn.Three, preview: false });
		activeTab = getActiveTabInActiveGroup();
		assert.ok(activeTab);
		assert.ok(activeTab.input instanceof TabInputText);
		assert.strictEqual(activeTab.input.uri.toString(), docC.uri.toString());

		await commands.executeCommand('workbench.action.closeActiveEditor');
		await commands.executeCommand('workbench.action.closeActiveEditor');
		await commands.executeCommand('workbench.action.closeActiveEditor');

		assert.ok(!getActiveTabInActiveGroup());
	});

	// TODO@lramos15 https://github.com/microsoft/vscode/issues/145846
	// Should ensure to either use existing tab API for modifications
	// or commands that operate on a dedicated editor that is passed
	// in as an argument

	// test('Tabs - verify pinned state', async () => {

	// 	const [docA] = await Promise.all([
	// 		workspace.openTextDocument(await createRandomFile())
	// 	]);

	// 	await window.showTextDocument(docA, { viewColumn: ViewColumn.One, preview: false });

	// 	const tab = window.tabGroups.activeTabGroup?.activeTab;
	// 	assert.ok(tab);

	// 	assert.strictEqual(tab.isPinned, false);

	// 	let onDidChangeTab = asPromise(window.tabGroups.onDidChangeTab);

	// 	await commands.executeCommand('workbench.action.pinEditor');
	// 	await onDidChangeTab;

	// 	assert.strictEqual(tab.isPinned, true);

	// 	onDidChangeTab = asPromise(window.tabGroups.onDidChangeTab);

	// 	await commands.executeCommand('workbench.action.unpinEditor');
	// 	await onDidChangeTab;

	// 	assert.strictEqual(tab.isPinned, false);
	// });

	// test('Tabs - verify preview state', async () => {

	// 	const [docA] = await Promise.all([
	// 		workspace.openTextDocument(await createRandomFile())
	// 	]);

	// 	await window.showTextDocument(docA, { viewColumn: ViewColumn.One, preview: true });

	// 	const tab = window.tabGroups.activeTabGroup?.activeTab;
	// 	assert.ok(tab);

	// 	assert.strictEqual(tab.isPreview, true);

	// 	let onDidChangeTab = asPromise(window.tabGroups.onDidChangeTab);

	// 	await commands.executeCommand('workbench.action.keepEditor');
	// 	await onDidChangeTab;

	// 	assert.strictEqual(tab.isPreview, false);
	// });

	// test('Tabs - verify dirty state', async () => {

	// 	const [docA] = await Promise.all([
	// 		workspace.openTextDocument(await createRandomFile())
	// 	]);

	// 	await window.showTextDocument(docA, { viewColumn: ViewColumn.One, preview: true });

	// 	const tab = window.tabGroups.activeTabGroup?.activeTab;
	// 	assert.ok(tab);

	// 	assert.strictEqual(tab.isDirty, false);
	// 	assert.strictEqual(docA.isDirty, false);

	// 	let onDidChangeTab = asPromise(window.tabGroups.onDidChangeTab);

	// 	const edit = new WorkspaceEdit();
	// 	edit.insert(docA.uri, new Position(0, 0), 'var abc = 0;');
	// 	await workspace.applyEdit(edit);

	// 	await onDidChangeTab;

	// 	assert.strictEqual(tab.isDirty, true);

	// 	onDidChangeTab = asPromise(window.tabGroups.onDidChangeTab);

	// 	await commands.executeCommand('workbench.action.files.save');

	// 	await onDidChangeTab;

	// 	assert.strictEqual(tab.isDirty, false);
	// });

	// test('Tabs - verify active state', async () => {

	// 	const [docA, docB] = await Promise.all([
	// 		workspace.openTextDocument(await createRandomFile()),
	// 		workspace.openTextDocument(await createRandomFile()),
	// 	]);

	// 	await window.showTextDocument(docA, { viewColumn: ViewColumn.One, preview: false });
	// 	await window.showTextDocument(docB, { viewColumn: ViewColumn.One, preview: false });

	// 	const tab = window.tabGroups.activeTabGroup?.tabs;
	// 	assert.strictEqual(tab?.length, 2);

	// 	assert.strictEqual(tab[0].isActive, false);
	// 	assert.strictEqual(tab[1].isActive, true);

	// 	let onDidChangeTab = asPromise(window.tabGroups.onDidChangeTab);

	// 	await window.showTextDocument(docA, { viewColumn: ViewColumn.One, preview: false });

	// 	await onDidChangeTab;

	// 	assert.strictEqual(tab[0].isActive, true);
	// 	assert.strictEqual(tab[1].isActive, false);
	// });

	/*

	test('Tabs - Move Tab', async () => {
		const [docA, docB, docC] = await Promise.all([
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile()),
		]);
		await window.showTextDocument(docA, { viewColumn: ViewColumn.One, preview: false });
		await window.showTextDocument(docB, { viewColumn: ViewColumn.One, preview: false });
		await window.showTextDocument(docC, { viewColumn: ViewColumn.Two, preview: false });

		const getAllTabs = () => {

		};
		let tabs = window.tabs;
		assert.strictEqual(tabs.length, 3);

		// Move the first tab of Group 1 to be the first tab of Group 2
		await tabs[0].move(0, ViewColumn.Two);
		assert.strictEqual(tabs.length, 3);
		tabs = window.tabs;
		// Tabs should now be B -> A -> C
		assert.strictEqual(tabs[0].resource?.toString(), docB.uri.toString());

		await tabs[2].move(0, ViewColumn.Two);
		assert.strictEqual(tabs.length, 3);
		tabs = window.tabs;
		// Tabs should now be B -> C -> A
		assert.strictEqual(tabs[1].resource?.toString(), docC.uri.toString());
		await tabs[2].move(1000, ViewColumn.Two);
		assert.strictEqual(tabs.length, 3);
		tabs = window.tabs;
		// Tabs should still be B -> C -> A
		assert.strictEqual(tabs[2].resource?.toString(), docA.uri.toString());

		await tabs[1].move(0, ViewColumn.Three);
		assert.strictEqual(tabs.length, 3);
		tabs = window.tabs;
		// Tabs should now be B -> A -> C With C in a new group
		assert.strictEqual(tabs[2].resource?.toString(), docC.uri.toString());
		assert.strictEqual(tabs[2].viewColumn, ViewColumn.Three);

		await commands.executeCommand('workbench.action.closeActiveEditor');
		await commands.executeCommand('workbench.action.closeActiveEditor');
		await commands.executeCommand('workbench.action.closeActiveEditor');

		assert.ok(!window.activeTab);
	});

	test('Tabs - Close Tabs', async () => {
		const [docA, docB, docC] = await Promise.all([
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile()),
			workspace.openTextDocument(await createRandomFile()),
		]);
		await window.showTextDocument(docA, { viewColumn: ViewColumn.One, preview: false });
		await window.showTextDocument(docB, { viewColumn: ViewColumn.One, preview: false });
		await window.showTextDocument(docC, { viewColumn: ViewColumn.Two, preview: false });

		let tabs = window.tabs;
		assert.strictEqual(tabs.length, 3);

		await tabs[0].close();
		tabs = window.tabs;
		assert.strictEqual(tabs.length, 2);
		assert.strictEqual(tabs[0].resource?.toString(), docB.uri.toString());

		await tabs[0].close();
		tabs = window.tabs;
		assert.strictEqual(tabs.length, 1);
		assert.strictEqual(tabs[0].resource?.toString(), docC.uri.toString());

		await tabs[0].close();
		tabs = window.tabs;
		assert.strictEqual(tabs.length, 0);
		assert.strictEqual(tabs.length, 0);
		assert.ok(!window.activeTab);
	});
	*/
	//#endregion

	test('#7013 - input without options', function () {
		const source = new CancellationTokenSource();
		const p = window.showInputBox(undefined, source.token);
		assert.ok(typeof p === 'object');
		source.dispose();
	});

	test('showInputBox - undefined on cancel', async function () {
		const source = new CancellationTokenSource();
		const p = window.showInputBox(undefined, source.token);
		source.cancel();
		const value = await p;
		assert.strictEqual(value, undefined);
	});

	test('showInputBox - cancel early', async function () {
		const source = new CancellationTokenSource();
		source.cancel();
		const p = window.showInputBox(undefined, source.token);
		const value = await p;
		assert.strictEqual(value, undefined);
	});

	test('showInputBox - \'\' on Enter', function () {
		const p = window.showInputBox();
		return Promise.all<any>([
			commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem'),
			p.then(value => assert.strictEqual(value, ''))
		]);
	});

	test('showInputBox - default value on Enter', function () {
		const p = window.showInputBox({ value: 'farboo' });
		return Promise.all<any>([
			p.then(value => assert.strictEqual(value, 'farboo')),
			commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem'),
		]);
	});

	test('showInputBox - `undefined` on Esc', function () {
		const p = window.showInputBox();
		return Promise.all<any>([
			commands.executeCommand('workbench.action.closeQuickOpen'),
			p.then(value => assert.strictEqual(value, undefined))
		]);
	});

	test('showInputBox - `undefined` on Esc (despite default)', function () {
		const p = window.showInputBox({ value: 'farboo' });
		return Promise.all<any>([
			commands.executeCommand('workbench.action.closeQuickOpen'),
			p.then(value => assert.strictEqual(value, undefined))
		]);
	});

	test('showInputBox - value not empty on second try', async function () {
		const one = window.showInputBox({ value: 'notempty' });
		await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
		assert.strictEqual(await one, 'notempty');
		const two = window.showInputBox({ value: 'notempty' });
		await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
		assert.strictEqual(await two, 'notempty');
	});

	test('showQuickPick, accept first', async function () {
		const tracker = createQuickPickTracker<string>();
		const first = tracker.nextItem();
		const pick = window.showQuickPick(['eins', 'zwei', 'drei'], {
			onDidSelectItem: tracker.onDidSelectItem
		});
		assert.strictEqual(await first, 'eins');
		await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
		assert.strictEqual(await pick, 'eins');
		return tracker.done();
	});

	test('showQuickPick, accept second', async function () {
		const tracker = createQuickPickTracker<string>();
		const first = tracker.nextItem();
		const pick = window.showQuickPick(['eins', 'zwei', 'drei'], {
			onDidSelectItem: tracker.onDidSelectItem
		});
		assert.strictEqual(await first, 'eins');
		const second = tracker.nextItem();
		await commands.executeCommand('workbench.action.quickOpenSelectNext');
		assert.strictEqual(await second, 'zwei');
		await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
		assert.strictEqual(await pick, 'zwei');
		return tracker.done();
	});

	test('showQuickPick, select first two', async function () {
		// const label = 'showQuickPick, select first two';
		// let i = 0;
		const resolves: ((value: string) => void)[] = [];
		let done: () => void;
		const unexpected = new Promise<void>((resolve, reject) => {
			done = () => resolve();
			resolves.push(reject);
		});
		const picks = window.showQuickPick(['eins', 'zwei', 'drei'], {
			onDidSelectItem: item => resolves.pop()!(item as string),
			canPickMany: true
		});
		const first = new Promise(resolve => resolves.push(resolve));
		// console.log(`${label}: ${++i}`);
		await new Promise(resolve => setTimeout(resolve, 100)); // Allow UI to update.
		// console.log(`${label}: ${++i}`);
		await commands.executeCommand('workbench.action.quickOpenSelectNext');
		// console.log(`${label}: ${++i}`);
		assert.strictEqual(await first, 'eins');
		// console.log(`${label}: ${++i}`);
		await commands.executeCommand('workbench.action.quickPickManyToggle');
		// console.log(`${label}: ${++i}`);
		const second = new Promise(resolve => resolves.push(resolve));
		await commands.executeCommand('workbench.action.quickOpenSelectNext');
		// console.log(`${label}: ${++i}`);
		assert.strictEqual(await second, 'zwei');
		// console.log(`${label}: ${++i}`);
		await commands.executeCommand('workbench.action.quickPickManyToggle');
		// console.log(`${label}: ${++i}`);
		await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
		// console.log(`${label}: ${++i}`);
		assert.deepStrictEqual(await picks, ['eins', 'zwei']);
		// console.log(`${label}: ${++i}`);
		done!();
		return unexpected;
	});

	test('showQuickPick, keep selection (microsoft/vscode-azure-account#67)', async function () {
		const picks = window.showQuickPick([
			{ label: 'eins' },
			{ label: 'zwei', picked: true },
			{ label: 'drei', picked: true }
		], {
			canPickMany: true
		});
		await new Promise<void>(resolve => setTimeout(() => resolve(), 100));
		await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
		if (await Promise.race([picks, new Promise<boolean>(resolve => setTimeout(() => resolve(false), 100))]) === false) {
			await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
			if (await Promise.race([picks, new Promise<boolean>(resolve => setTimeout(() => resolve(false), 1000))]) === false) {
				await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
				if (await Promise.race([picks, new Promise<boolean>(resolve => setTimeout(() => resolve(false), 1000))]) === false) {
					assert.ok(false, 'Picks not resolved!');
				}
			}
		}
		assert.deepStrictEqual((await picks)!.map(pick => pick.label), ['zwei', 'drei']);
	});

	test('showQuickPick, undefined on cancel', function () {
		const source = new CancellationTokenSource();
		const p = window.showQuickPick(['eins', 'zwei', 'drei'], undefined, source.token);
		source.cancel();
		return p.then(value => {
			assert.strictEqual(value, undefined);
		});
	});

	test('showQuickPick, cancel early', function () {
		const source = new CancellationTokenSource();
		source.cancel();
		const p = window.showQuickPick(['eins', 'zwei', 'drei'], undefined, source.token);
		return p.then(value => {
			assert.strictEqual(value, undefined);
		});
	});

	test('showQuickPick, canceled by another picker', function () {

		const source = new CancellationTokenSource();

		const result = window.showQuickPick(['eins', 'zwei', 'drei'], { ignoreFocusOut: true }).then(result => {
			source.cancel();
			assert.strictEqual(result, undefined);
		});

		window.showQuickPick(['eins', 'zwei', 'drei'], undefined, source.token);

		return result;
	});

	test('showQuickPick, canceled by input', function () {

		const result = window.showQuickPick(['eins', 'zwei', 'drei'], { ignoreFocusOut: true }).then(result => {
			assert.strictEqual(result, undefined);
		});

		const source = new CancellationTokenSource();
		window.showInputBox(undefined, source.token);
		source.cancel();

		return result;
	});

	test('showQuickPick, native promise - #11754', async function () {

		const data = new Promise<string[]>(resolve => {
			resolve(['a', 'b', 'c']);
		});

		const source = new CancellationTokenSource();
		const result = window.showQuickPick(data, undefined, source.token);
		source.cancel();
		const value_1 = await result;
		assert.strictEqual(value_1, undefined);
	});

	test('showQuickPick, never resolve promise and cancel - #22453', function () {

		const result = window.showQuickPick(new Promise<string[]>(_resolve => { }));

		const a = result.then(value => {
			assert.strictEqual(value, undefined);
		});
		const b = commands.executeCommand('workbench.action.closeQuickOpen');
		return Promise.all([a, b]);
	});

	test('showWorkspaceFolderPick', async function () {
		const p = window.showWorkspaceFolderPick(undefined);

		await new Promise(resolve => setTimeout(resolve, 10));
		await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
		const r1 = await Promise.race([p, new Promise<boolean>(resolve => setTimeout(() => resolve(false), 100))]);
		if (r1 !== false) {
			return;
		}
		await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
		const r2 = await Promise.race([p, new Promise<boolean>(resolve => setTimeout(() => resolve(false), 1000))]);
		if (r2 !== false) {
			return;
		}
		await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
		const r3 = await Promise.race([p, new Promise<boolean>(resolve => setTimeout(() => resolve(false), 1000))]);
		assert.ok(r3 !== false);
	});

	test('Default value for showInput Box not accepted when it fails validateInput, reversing #33691', async function () {
		const result = window.showInputBox({
			validateInput: (value: string) => {
				if (!value || value.trim().length === 0) {
					return 'Cannot set empty description';
				}
				return null;
			}
		});

		await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
		await commands.executeCommand('workbench.action.closeQuickOpen');
		assert.strictEqual(await result, undefined);
	});

	function createQuickPickTracker<T extends string | QuickPickItem>() {
		const resolves: ((value: T) => void)[] = [];
		let done: () => void;
		const unexpected = new Promise<void>((resolve, reject) => {
			done = () => resolve();
			resolves.push(reject);
		});
		return {
			onDidSelectItem: (item: T) => resolves.pop()!(item),
			nextItem: () => new Promise<T>(resolve => resolves.push(resolve)),
			done: () => {
				done!();
				return unexpected;
			},
		};
	}


	test('editor, selection change kind', () => {
		return workspace.openTextDocument(join(workspace.rootPath || '', './far.js')).then(doc => window.showTextDocument(doc)).then(editor => {


			return new Promise<void>((resolve, _reject) => {

				const subscription = window.onDidChangeTextEditorSelection(e => {
					assert.ok(e.textEditor === editor);
					assert.strictEqual(e.kind, TextEditorSelectionChangeKind.Command);

					subscription.dispose();
					resolve();
				});

				editor.selection = new Selection(editor.selection.anchor, editor.selection.active.translate(2));
			});

		});
	});

	test('createStatusBar', async function () {
		const statusBarEntryWithoutId = window.createStatusBarItem(StatusBarAlignment.Left, 100);
		assert.strictEqual(statusBarEntryWithoutId.id, 'vscode.vscode-api-tests');
		assert.strictEqual(statusBarEntryWithoutId.alignment, StatusBarAlignment.Left);
		assert.strictEqual(statusBarEntryWithoutId.priority, 100);
		assert.strictEqual(statusBarEntryWithoutId.name, undefined);
		statusBarEntryWithoutId.name = 'Test Name';
		assert.strictEqual(statusBarEntryWithoutId.name, 'Test Name');
		statusBarEntryWithoutId.tooltip = 'Tooltip';
		assert.strictEqual(statusBarEntryWithoutId.tooltip, 'Tooltip');
		statusBarEntryWithoutId.tooltip = new MarkdownString('**bold**');
		assert.strictEqual(statusBarEntryWithoutId.tooltip.value, '**bold**');

		const statusBarEntryWithId = window.createStatusBarItem('testId', StatusBarAlignment.Right, 200);
		assert.strictEqual(statusBarEntryWithId.alignment, StatusBarAlignment.Right);
		assert.strictEqual(statusBarEntryWithId.priority, 200);
		assert.strictEqual(statusBarEntryWithId.id, 'testId');
		assert.strictEqual(statusBarEntryWithId.name, undefined);
		statusBarEntryWithId.name = 'Test Name';
		assert.strictEqual(statusBarEntryWithId.name, 'Test Name');
	});

	test('createStatusBar - static', async function () {

		const item = window.createStatusBarItem('myStaticItem');

		assert.strictEqual(item.alignment, StatusBarAlignment.Right);
		assert.strictEqual(item.priority, 17);
		assert.strictEqual(item.name, 'My Static Item');
		assert.strictEqual(item.text, 'Hello $(globe)');
		assert.strictEqual(item.tooltip, 'Hover World');
		assert.deepStrictEqual(item.accessibilityInformation, { label: 'Hello World', role: 'button' });

		item.dispose();
	});

	test('createStatusBar - static, CANNOT change some props', async function () {

		const item = window.createStatusBarItem('myStaticItem', StatusBarAlignment.Left, 12);

		assert.strictEqual(item.alignment, StatusBarAlignment.Right);
		assert.strictEqual(item.priority, 17);

		item.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/workspace.event.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/workspace.event.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as vscode from 'vscode';
import { assertNoRpc, createRandomFile, disposeAll, withLogDisabled } from '../utils';

suite('vscode API - workspace events', () => {

	const disposables: vscode.Disposable[] = [];

	teardown(() => {
		assertNoRpc();
		disposeAll(disposables);
		disposables.length = 0;
	});

	test('onWillCreate/onDidCreate', withLogDisabled(async function () {

		const base = await createRandomFile();
		const newUri = base.with({ path: base.path + '-foo' });

		let onWillCreate: vscode.FileWillCreateEvent | undefined;
		let onDidCreate: vscode.FileCreateEvent | undefined;

		disposables.push(vscode.workspace.onWillCreateFiles(e => onWillCreate = e));
		disposables.push(vscode.workspace.onDidCreateFiles(e => onDidCreate = e));

		const edit = new vscode.WorkspaceEdit();
		edit.createFile(newUri);

		const success = await vscode.workspace.applyEdit(edit);
		assert.ok(success);

		assert.ok(onWillCreate);
		assert.strictEqual(onWillCreate?.files.length, 1);
		assert.strictEqual(onWillCreate?.files[0].toString(), newUri.toString());

		assert.ok(onDidCreate);
		assert.strictEqual(onDidCreate?.files.length, 1);
		assert.strictEqual(onDidCreate?.files[0].toString(), newUri.toString());
	}));

	test('onWillCreate/onDidCreate, make changes, edit another file', withLogDisabled(async function () {

		const base = await createRandomFile();
		const baseDoc = await vscode.workspace.openTextDocument(base);

		const newUri = base.with({ path: base.path + '-foo' });

		disposables.push(vscode.workspace.onWillCreateFiles(e => {
			const ws = new vscode.WorkspaceEdit();
			ws.insert(base, new vscode.Position(0, 0), 'HALLO_NEW');
			e.waitUntil(Promise.resolve(ws));
		}));

		const edit = new vscode.WorkspaceEdit();
		edit.createFile(newUri);

		const success = await vscode.workspace.applyEdit(edit);
		assert.ok(success);

		assert.strictEqual(baseDoc.getText(), 'HALLO_NEW');
	}));

	test('onWillCreate/onDidCreate, make changes, edit new file fails', withLogDisabled(async function () {

		const base = await createRandomFile();

		const newUri = base.with({ path: base.path + '-foo' });

		disposables.push(vscode.workspace.onWillCreateFiles(e => {
			const ws = new vscode.WorkspaceEdit();
			ws.insert(e.files[0], new vscode.Position(0, 0), 'nope');
			e.waitUntil(Promise.resolve(ws));
		}));

		const edit = new vscode.WorkspaceEdit();
		edit.createFile(newUri);

		const success = await vscode.workspace.applyEdit(edit);
		assert.ok(success);

		assert.strictEqual((await vscode.workspace.fs.readFile(newUri)).toString(), '');
		assert.strictEqual((await vscode.workspace.openTextDocument(newUri)).getText(), '');
	}));

	test('onWillDelete/onDidDelete', withLogDisabled(async function () {

		const base = await createRandomFile();

		let onWilldelete: vscode.FileWillDeleteEvent | undefined;
		let onDiddelete: vscode.FileDeleteEvent | undefined;

		disposables.push(vscode.workspace.onWillDeleteFiles(e => onWilldelete = e));
		disposables.push(vscode.workspace.onDidDeleteFiles(e => onDiddelete = e));

		const edit = new vscode.WorkspaceEdit();
		edit.deleteFile(base);

		const success = await vscode.workspace.applyEdit(edit);
		assert.ok(success);

		assert.ok(onWilldelete);
		assert.strictEqual(onWilldelete?.files.length, 1);
		assert.strictEqual(onWilldelete?.files[0].toString(), base.toString());

		assert.ok(onDiddelete);
		assert.strictEqual(onDiddelete?.files.length, 1);
		assert.strictEqual(onDiddelete?.files[0].toString(), base.toString());
	}));

	test('onWillDelete/onDidDelete, make changes', withLogDisabled(async function () {

		const base = await createRandomFile();
		const newUri = base.with({ path: base.path + '-NEW' });

		disposables.push(vscode.workspace.onWillDeleteFiles(e => {

			const edit = new vscode.WorkspaceEdit();
			edit.createFile(newUri);
			edit.insert(newUri, new vscode.Position(0, 0), 'hahah');
			e.waitUntil(Promise.resolve(edit));
		}));

		const edit = new vscode.WorkspaceEdit();
		edit.deleteFile(base);

		const success = await vscode.workspace.applyEdit(edit);
		assert.ok(success);
	}));

	test('onWillDelete/onDidDelete, make changes, del another file', withLogDisabled(async function () {

		const base = await createRandomFile();
		const base2 = await createRandomFile();
		disposables.push(vscode.workspace.onWillDeleteFiles(e => {
			if (e.files[0].toString() === base.toString()) {
				const edit = new vscode.WorkspaceEdit();
				edit.deleteFile(base2);
				e.waitUntil(Promise.resolve(edit));
			}
		}));

		const edit = new vscode.WorkspaceEdit();
		edit.deleteFile(base);

		const success = await vscode.workspace.applyEdit(edit);
		assert.ok(success);


	}));

	test('onWillDelete/onDidDelete, make changes, double delete', withLogDisabled(async function () {

		const base = await createRandomFile();
		let cnt = 0;
		disposables.push(vscode.workspace.onWillDeleteFiles(e => {
			if (++cnt === 0) {
				const edit = new vscode.WorkspaceEdit();
				edit.deleteFile(e.files[0]);
				e.waitUntil(Promise.resolve(edit));
			}
		}));

		const edit = new vscode.WorkspaceEdit();
		edit.deleteFile(base);

		const success = await vscode.workspace.applyEdit(edit);
		assert.ok(success);
	}));

	test('onWillRename/onDidRename', withLogDisabled(async function () {

		const oldUri = await createRandomFile();
		const newUri = oldUri.with({ path: oldUri.path + '-NEW' });

		let onWillRename: vscode.FileWillRenameEvent | undefined;
		let onDidRename: vscode.FileRenameEvent | undefined;

		disposables.push(vscode.workspace.onWillRenameFiles(e => onWillRename = e));
		disposables.push(vscode.workspace.onDidRenameFiles(e => onDidRename = e));

		const edit = new vscode.WorkspaceEdit();
		edit.renameFile(oldUri, newUri);

		const success = await vscode.workspace.applyEdit(edit);
		assert.ok(success);

		assert.ok(onWillRename);
		assert.strictEqual(onWillRename?.files.length, 1);
		assert.strictEqual(onWillRename?.files[0].oldUri.toString(), oldUri.toString());
		assert.strictEqual(onWillRename?.files[0].newUri.toString(), newUri.toString());

		assert.ok(onDidRename);
		assert.strictEqual(onDidRename?.files.length, 1);
		assert.strictEqual(onDidRename?.files[0].oldUri.toString(), oldUri.toString());
		assert.strictEqual(onDidRename?.files[0].newUri.toString(), newUri.toString());
	}));

	test('onWillRename - make changes (saved file)', withLogDisabled(function () {
		return testOnWillRename(false);
	}));

	test('onWillRename - make changes (dirty file)', withLogDisabled(function () {
		return testOnWillRename(true);
	}));

	async function testOnWillRename(withDirtyFile: boolean): Promise<void> {

		const oldUri = await createRandomFile('BAR');

		if (withDirtyFile) {
			const edit = new vscode.WorkspaceEdit();
			edit.insert(oldUri, new vscode.Position(0, 0), 'BAR');

			const success = await vscode.workspace.applyEdit(edit);
			assert.ok(success);

			const oldDocument = await vscode.workspace.openTextDocument(oldUri);
			assert.ok(oldDocument.isDirty);
		}

		const newUri = oldUri.with({ path: oldUri.path + '-NEW' });

		const anotherFile = await createRandomFile('BAR');

		let onWillRename: vscode.FileWillRenameEvent | undefined;

		disposables.push(vscode.workspace.onWillRenameFiles(e => {
			onWillRename = e;
			const edit = new vscode.WorkspaceEdit();
			edit.insert(e.files[0].oldUri, new vscode.Position(0, 0), 'FOO');
			edit.replace(anotherFile, new vscode.Range(0, 0, 0, 3), 'FARBOO');
			e.waitUntil(Promise.resolve(edit));
		}));

		const edit = new vscode.WorkspaceEdit();
		edit.renameFile(oldUri, newUri);

		const success = await vscode.workspace.applyEdit(edit);
		assert.ok(success);

		assert.ok(onWillRename);
		assert.strictEqual(onWillRename?.files.length, 1);
		assert.strictEqual(onWillRename?.files[0].oldUri.toString(), oldUri.toString());
		assert.strictEqual(onWillRename?.files[0].newUri.toString(), newUri.toString());

		const newDocument = await vscode.workspace.openTextDocument(newUri);
		const anotherDocument = await vscode.workspace.openTextDocument(anotherFile);

		assert.strictEqual(newDocument.getText(), withDirtyFile ? 'FOOBARBAR' : 'FOOBAR');
		assert.strictEqual(anotherDocument.getText(), 'FARBOO');

		assert.ok(newDocument.isDirty);
		assert.ok(anotherDocument.isDirty);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/workspace.fs.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/workspace.fs.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { posix } from 'path';
import * as vscode from 'vscode';
import { assertNoRpc, createRandomFile } from '../utils';

suite('vscode API - workspace-fs', () => {

	let root: vscode.Uri;

	suiteSetup(function () {
		root = vscode.workspace.workspaceFolders![0]!.uri;
	});

	teardown(assertNoRpc);

	test('fs.stat', async function () {
		const stat = await vscode.workspace.fs.stat(root);
		assert.strictEqual(stat.type, vscode.FileType.Directory);

		assert.strictEqual(typeof stat.size, 'number');
		assert.strictEqual(typeof stat.mtime, 'number');
		assert.strictEqual(typeof stat.ctime, 'number');

		assert.ok(stat.mtime > 0);
		assert.ok(stat.ctime > 0);

		const entries = await vscode.workspace.fs.readDirectory(root);
		assert.ok(entries.length > 0);

		// find far.js
		const tuple = entries.find(tuple => tuple[0] === 'far.js')!;
		assert.ok(tuple);
		assert.strictEqual(tuple[0], 'far.js');
		assert.strictEqual(tuple[1], vscode.FileType.File);
	});

	test('fs.stat - bad scheme', async function () {
		try {
			await vscode.workspace.fs.stat(vscode.Uri.parse('foo:/bar/baz/test.txt'));
			assert.ok(false);
		} catch {
			assert.ok(true);
		}
	});

	test('fs.stat - missing file', async function () {
		try {
			await vscode.workspace.fs.stat(root.with({ path: root.path + '.bad' }));
			assert.ok(false);
		} catch (e) {
			assert.ok(true);
		}
	});

	test('fs.write/stat/read/delete', async function () {

		const uri = root.with({ path: posix.join(root.path, 'new.file') });
		await vscode.workspace.fs.writeFile(uri, Buffer.from('HELLO'));

		const stat = await vscode.workspace.fs.stat(uri);
		assert.strictEqual(stat.type, vscode.FileType.File);

		const contents = await vscode.workspace.fs.readFile(uri);
		assert.strictEqual(Buffer.from(contents).toString(), 'HELLO');

		await vscode.workspace.fs.delete(uri);

		try {
			await vscode.workspace.fs.stat(uri);
			assert.ok(false);
		} catch {
			assert.ok(true);
		}
	});

	test('fs.delete folder', async function () {

		const folder = root.with({ path: posix.join(root.path, 'folder') });
		const file = root.with({ path: posix.join(root.path, 'folder/file') });

		await vscode.workspace.fs.createDirectory(folder);
		await vscode.workspace.fs.writeFile(file, Buffer.from('FOO'));

		await vscode.workspace.fs.stat(folder);
		await vscode.workspace.fs.stat(file);

		// ensure non empty folder cannot be deleted
		try {
			await vscode.workspace.fs.delete(folder, { recursive: false, useTrash: false });
			assert.ok(false);
		} catch {
			await vscode.workspace.fs.stat(folder);
			await vscode.workspace.fs.stat(file);
		}

		// ensure non empty folder cannot be deleted is DEFAULT
		try {
			await vscode.workspace.fs.delete(folder); // recursive: false as default
			assert.ok(false);
		} catch {
			await vscode.workspace.fs.stat(folder);
			await vscode.workspace.fs.stat(file);
		}

		// delete non empty folder with recursive-flag
		await vscode.workspace.fs.delete(folder, { recursive: true, useTrash: false });

		// esnure folder/file are gone
		try {
			await vscode.workspace.fs.stat(folder);
			assert.ok(false);
		} catch {
			assert.ok(true);
		}
		try {
			await vscode.workspace.fs.stat(file);
			assert.ok(false);
		} catch {
			assert.ok(true);
		}
	});

	test('throws FileSystemError (1)', async function () {

		try {
			await vscode.workspace.fs.stat(vscode.Uri.file(`/c468bf16-acfd-4591-825e-2bcebba508a3/71b1f274-91cb-4c19-af00-8495eaab4b73/4b60cb48-a6f2-40ea-9085-0936f4a8f59a.tx6`));
			assert.ok(false);
		} catch (e) {
			assert.ok(e instanceof vscode.FileSystemError);
			assert.strictEqual(e.name, vscode.FileSystemError.FileNotFound().name);
		}
	});

	test('throws FileSystemError (2)', async function () {

		try {
			await vscode.workspace.fs.stat(vscode.Uri.parse('foo:/bar'));
			assert.ok(false);
		} catch (e) {
			assert.ok(e instanceof vscode.FileSystemError);
			assert.strictEqual(e.name, vscode.FileSystemError.Unavailable().name);
		}
	});

	test('vscode.workspace.fs.remove() (and copy()) succeed unexpectedly. #84177 (1)', async function () {
		const entries = await vscode.workspace.fs.readDirectory(root);
		assert.ok(entries.length > 0);

		const someFolder = root.with({ path: posix.join(root.path, '6b1f9d664a92') });

		try {
			await vscode.workspace.fs.delete(someFolder, { recursive: true });
			assert.ok(false);
		} catch (err) {
			assert.ok(true);
		}
	});

	test('vscode.workspace.fs.remove() (and copy()) succeed unexpectedly. #84177 (2)', async function () {
		const entries = await vscode.workspace.fs.readDirectory(root);
		assert.ok(entries.length > 0);

		const folder = root.with({ path: posix.join(root.path, 'folder') });
		const file = root.with({ path: posix.join(root.path, 'folder/file') });

		await vscode.workspace.fs.createDirectory(folder);
		await vscode.workspace.fs.writeFile(file, Buffer.from('FOO'));

		const someFolder = root.with({ path: posix.join(root.path, '6b1f9d664a92/a564c52da70a') });

		try {
			await vscode.workspace.fs.copy(folder, someFolder, { overwrite: true });
			assert.ok(true);
		} catch (err) {
			assert.ok(false, err);

		} finally {
			await vscode.workspace.fs.delete(folder, { recursive: true, useTrash: false });
			await vscode.workspace.fs.delete(someFolder, { recursive: true, useTrash: false });
		}
	});

	test('vscode.workspace.fs error reporting is weird #132981', async function () {

		const uri = await createRandomFile();

		const source = vscode.Uri.joinPath(uri, `./${Math.random().toString(16).slice(2, 8)}`);
		const target = vscode.Uri.joinPath(uri, `../${Math.random().toString(16).slice(2, 8)}`);

		// make sure that target and source don't accidentially exists
		try {
			await vscode.workspace.fs.stat(target);
			this.skip();
		} catch (err) {
			assert.strictEqual(err.code, vscode.FileSystemError.FileNotFound().code);
		}

		try {
			await vscode.workspace.fs.stat(source);
			this.skip();
		} catch (err) {
			assert.strictEqual(err.code, vscode.FileSystemError.FileNotFound().code);
		}

		try {
			await vscode.workspace.fs.rename(source, target);
			assert.fail('error expected');
		} catch (err) {
			assert.ok(err instanceof vscode.FileSystemError);
			assert.strictEqual(err.code, vscode.FileSystemError.FileNotFound().code);
			assert.strictEqual(err.code, 'FileNotFound');
		}
	});

	test('fs.createFolder creates recursively', async function () {

		const folder = root.with({ path: posix.join(root.path, 'deeply', 'nested', 'folder') });
		await vscode.workspace.fs.createDirectory(folder);

		let stat = await vscode.workspace.fs.stat(folder);
		assert.strictEqual(stat.type, vscode.FileType.Directory);

		await vscode.workspace.fs.delete(folder, { recursive: true, useTrash: false });

		await vscode.workspace.fs.createDirectory(folder); // calling on existing folder is also ok!

		const file = root.with({ path: posix.join(folder.path, 'file.txt') });
		await vscode.workspace.fs.writeFile(file, Buffer.from('Hello World'));
		const folder2 = root.with({ path: posix.join(file.path, 'invalid') });
		let e;
		try {
			await vscode.workspace.fs.createDirectory(folder2); // cannot create folder on file path
		} catch (error) {
			e = error;
		}
		assert.ok(e);

		const folder3 = root.with({ path: posix.join(root.path, 'DEEPLY', 'NESTED', 'FOLDER') });
		await vscode.workspace.fs.createDirectory(folder3); // calling on different cased folder is ok!
		stat = await vscode.workspace.fs.stat(folder3);
		assert.strictEqual(stat.type, vscode.FileType.Directory);

		await vscode.workspace.fs.delete(folder, { recursive: true, useTrash: false });
	});

	test('fs.writeFile creates parents recursively', async function () {

		const folder = root.with({ path: posix.join(root.path, 'other-deeply', 'nested', 'folder') });
		const file = root.with({ path: posix.join(folder.path, 'file.txt') });

		await vscode.workspace.fs.writeFile(file, Buffer.from('Hello World'));

		const stat = await vscode.workspace.fs.stat(file);
		assert.strictEqual(stat.type, vscode.FileType.File);

		await vscode.workspace.fs.delete(folder, { recursive: true, useTrash: false });
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/workspace.tasks.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/workspace.tasks.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { commands, ConfigurationTarget, CustomExecution, Disposable, env, Event, EventEmitter, Pseudoterminal, ShellExecution, Task, TaskDefinition, TaskProcessStartEvent, tasks, TaskScope, Terminal, UIKind, window, workspace } from 'vscode';
import { assertNoRpc } from '../utils';

// Disable tasks tests:
// - Web https://github.com/microsoft/vscode/issues/90528
((env.uiKind === UIKind.Web) ? suite.skip : suite)('vscode API - tasks', () => {

	suiteSetup(async () => {
		const config = workspace.getConfiguration('terminal.integrated');
		// Disable conpty in integration tests because of https://github.com/microsoft/vscode/issues/76548
		await config.update('windowsEnableConpty', false, ConfigurationTarget.Global);
		// Disable exit alerts as tests may trigger then and we're not testing the notifications
		await config.update('showExitAlert', false, ConfigurationTarget.Global);
		// Canvas may cause problems when running in a container
		await config.update('gpuAcceleration', 'off', ConfigurationTarget.Global);
		// Disable env var relaunch for tests to prevent terminals relaunching themselves
		await config.update('environmentChangesRelaunch', false, ConfigurationTarget.Global);
	});

	suite('Tasks', () => {
		const disposables: Disposable[] = [];

		teardown(() => {
			assertNoRpc();
			disposables.forEach(d => d.dispose());
			disposables.length = 0;
		});

		suite('ShellExecution', () => {
			test('Execution from onDidEndTaskProcess and onDidStartTaskProcess are equal to original', async () => {
				window.terminals.forEach(terminal => terminal.dispose());
				const executeDoneEvent: EventEmitter<void> = new EventEmitter();
				const taskExecutionShouldBeSet: Promise<void> = new Promise(resolve => {
					const disposable = executeDoneEvent.event(() => {
						resolve();
						disposable.dispose();
					});
				});

				const progressMade: EventEmitter<void> = new EventEmitter();
				let count = 2;
				let startSucceeded = false;
				let endSucceeded = false;
				const testDonePromise = new Promise<void>(resolve => {
					disposables.push(progressMade.event(() => {
						count--;
						if ((count === 0) && startSucceeded && endSucceeded) {
							resolve();
						}
					}));
				});

				const task = new Task({ type: 'testTask' }, TaskScope.Workspace, 'echo', 'testTask', new ShellExecution('echo', ['hello test']));

				disposables.push(tasks.onDidStartTaskProcess(async (e) => {
					await taskExecutionShouldBeSet;
					if (e.execution === taskExecution) {
						startSucceeded = true;
						progressMade.fire();
					}
				}));

				disposables.push(tasks.onDidEndTaskProcess(async (e) => {
					await taskExecutionShouldBeSet;
					if (e.execution === taskExecution) {
						endSucceeded = true;
						progressMade.fire();
					}
				}));
				const taskExecution = await tasks.executeTask(task);
				executeDoneEvent.fire();
				await testDonePromise;
			});

			test.skip('dependsOn task should start with a different processId (#118256)', async () => {
				// Set up dependsOn task by creating tasks.json since this is not possible via the API
				// Tasks API
				const tasksConfig = workspace.getConfiguration('tasks');
				await tasksConfig.update('version', '2.0.0', ConfigurationTarget.Workspace);
				await tasksConfig.update('tasks', [
					{
						label: 'taskToDependOn',
						type: 'shell',
						command: 'sleep 1',
						problemMatcher: []
					},
					{
						label: 'Run this task',
						type: 'shell',
						command: 'sleep 1',
						problemMatcher: [],
						dependsOn: 'taskToDependOn'
					}
				], ConfigurationTarget.Workspace);

				const waitForTaskToFinish = new Promise<void>(resolve => {
					tasks.onDidEndTask(e => {
						if (e.execution.task.name === 'Run this task') {
							resolve();
						}
					});
				});

				const waitForStartEvent1 = new Promise<TaskProcessStartEvent>(r => {
					// Listen for first task and verify valid process ID
					const listener = tasks.onDidStartTaskProcess(async (e) => {
						if (e.execution.task.name === 'taskToDependOn') {
							listener.dispose();
							r(e);
						}
					});
				});

				const waitForStartEvent2 = new Promise<TaskProcessStartEvent>(r => {
					// Listen for second task, verify valid process ID and that it's not the process ID of
					// the first task
					const listener = tasks.onDidStartTaskProcess(async (e) => {
						if (e.execution.task.name === 'Run this task') {
							listener.dispose();
							r(e);
						}
					});
				});

				// Run the task
				commands.executeCommand('workbench.action.tasks.runTask', 'Run this task');

				const startEvent1 = await waitForStartEvent1;
				assert.ok(startEvent1.processId);

				const startEvent2 = await waitForStartEvent2;
				assert.ok(startEvent2.processId);
				assert.notStrictEqual(startEvent1.processId, startEvent2.processId);
				await waitForTaskToFinish;
				// Clear out tasks config
				await tasksConfig.update('tasks', []);
			});
		});

		suite('CustomExecution', () => {
			test('task should start and shutdown successfully', async () => {
				window.terminals.forEach(terminal => terminal.dispose());
				interface ICustomTestingTaskDefinition extends TaskDefinition {
					/**
					 * One of the task properties. This can be used to customize the task in the tasks.json
					 */
					customProp1: string;
				}
				const taskType: string = 'customTesting';
				const taskName = 'First custom task';
				let isPseudoterminalClosed = false;
				// There's a strict order that should be observed here:
				// 1. The terminal opens
				// 2. The terminal is written to.
				// 3. The terminal is closed.
				enum TestOrder {
					Start,
					TerminalOpened,
					TerminalWritten,
					TerminalClosed
				}

				let testOrder = TestOrder.Start;

				// Launch the task
				const terminal = await new Promise<Terminal>(r => {
					disposables.push(window.onDidOpenTerminal(e => {
						assert.strictEqual(testOrder, TestOrder.Start);
						testOrder = TestOrder.TerminalOpened;
						r(e);
					}));
					disposables.push(tasks.registerTaskProvider(taskType, {
						provideTasks: () => {
							const result: Task[] = [];
							const kind: ICustomTestingTaskDefinition = {
								type: taskType,
								customProp1: 'testing task one'
							};
							const writeEmitter = new EventEmitter<string>();
							const execution = new CustomExecution((): Thenable<Pseudoterminal> => {
								const pty: Pseudoterminal = {
									onDidWrite: writeEmitter.event,
									open: () => writeEmitter.fire('testing\r\n'),
									close: () => isPseudoterminalClosed = true
								};
								return Promise.resolve(pty);
							});
							const task = new Task(kind, TaskScope.Workspace, taskName, taskType, execution);
							result.push(task);
							return result;
						},
						resolveTask(_task: Task): Task | undefined {
							assert.fail('resolveTask should not trigger during the test');
						}
					}));
					commands.executeCommand('workbench.action.tasks.runTask', `${taskType}: ${taskName}`);
				});

				// Verify the output
				await new Promise<void>(r => {
					disposables.push(window.onDidWriteTerminalData(e => {
						if (e.terminal !== terminal) {
							return;
						}
						assert.strictEqual(testOrder, TestOrder.TerminalOpened);
						testOrder = TestOrder.TerminalWritten;
						assert.notStrictEqual(terminal, undefined);
						assert.strictEqual(e.data, 'testing\r\n');
						r();
					}));
				});

				// Dispose the terminal
				await new Promise<void>(r => {
					disposables.push(window.onDidCloseTerminal((e) => {
						if (e !== terminal) {
							return;
						}
						assert.strictEqual(testOrder, TestOrder.TerminalWritten);
						testOrder = TestOrder.TerminalClosed;
						// Pseudoterminal.close should have fired by now, additionally we want
						// to make sure all events are flushed before continuing with more tests
						assert.ok(isPseudoterminalClosed);
						r();
					}));
					terminal.dispose();
				});
			});

			test('sync task should flush all data on close', async () => {
				interface ICustomTestingTaskDefinition extends TaskDefinition {
					/**
					 * One of the task properties. This can be used to customize the task in the tasks.json
					 */
					customProp1: string;
				}
				const taskType: string = 'customTesting';
				const taskName = 'First custom task';

				// Launch the task
				const terminal = await new Promise<Terminal>(r => {
					disposables.push(window.onDidOpenTerminal(e => r(e)));
					disposables.push(tasks.registerTaskProvider(taskType, {
						provideTasks: () => {
							const result: Task[] = [];
							const kind: ICustomTestingTaskDefinition = {
								type: taskType,
								customProp1: 'testing task one'
							};
							const writeEmitter = new EventEmitter<string>();
							const closeEmitter = new EventEmitter<void>();
							const execution = new CustomExecution((): Thenable<Pseudoterminal> => {
								const pty: Pseudoterminal = {
									onDidWrite: writeEmitter.event,
									onDidClose: closeEmitter.event,
									open: () => {
										writeEmitter.fire('exiting');
										closeEmitter.fire();
									},
									close: () => { }
								};
								return Promise.resolve(pty);
							});
							const task = new Task(kind, TaskScope.Workspace, taskName, taskType, execution);
							result.push(task);
							return result;
						},
						resolveTask(_task: Task): Task | undefined {
							assert.fail('resolveTask should not trigger during the test');
						}
					}));
					commands.executeCommand('workbench.action.tasks.runTask', `${taskType}: ${taskName}`);
				});

				// Verify the output
				await new Promise<void>(r => {
					disposables.push(window.onDidWriteTerminalData(e => {
						if (e.terminal !== terminal) {
							return;
						}
						assert.strictEqual(e.data, 'exiting');
						r();
					}));
				});

				// Dispose the terminal
				await new Promise<void>(r => {
					disposables.push(window.onDidCloseTerminal(() => r()));
					terminal.dispose();
				});
			});

			test('A task can be fetched and executed (#100577)', async () => {
				class CustomTerminal implements Pseudoterminal {
					private readonly writeEmitter = new EventEmitter<string>();
					public readonly onDidWrite: Event<string> = this.writeEmitter.event;
					public async close(): Promise<void> { }
					private closeEmitter = new EventEmitter<void>();
					onDidClose: Event<void> = this.closeEmitter.event;
					private readonly _onDidOpen = new EventEmitter<void>();
					public readonly onDidOpen = this._onDidOpen.event;
					public open(): void {
						this._onDidOpen.fire();
						this.closeEmitter.fire();
					}
				}

				const customTerminal = new CustomTerminal();
				const terminalOpenedPromise = new Promise<void>(resolve => {
					const disposable = customTerminal.onDidOpen(() => {
						disposable.dispose();
						resolve();
					});
				});

				function buildTask(): Task {
					const task = new Task(
						{
							type: 'customTesting',
						},
						TaskScope.Workspace,
						'Test Task',
						'customTesting',
						new CustomExecution(
							async (): Promise<Pseudoterminal> => {
								return customTerminal;
							}
						)
					);
					return task;
				}

				disposables.push(tasks.registerTaskProvider('customTesting', {
					provideTasks: () => {
						return [buildTask()];
					},
					resolveTask(_task: Task): undefined {
						return undefined;
					}
				}));


				const task = await tasks.fetchTasks({ type: 'customTesting' });

				if (task && task.length > 0) {
					await tasks.executeTask(task[0]);
				} else {
					assert.fail('fetched task can\'t be undefined');
				}
				await terminalOpenedPromise;
			});

			test('A task can be fetched with default task group information', async () => {
				// Add default to tasks.json since this is not possible using an API yet.
				const tasksConfig = workspace.getConfiguration('tasks');
				await tasksConfig.update('version', '2.0.0', ConfigurationTarget.Workspace);
				await tasksConfig.update('tasks', [
					{
						label: 'Run this task',
						type: 'shell',
						command: 'sleep 1',
						problemMatcher: [],
						group: {
							kind: 'build',
							isDefault: true
						}
					}
				], ConfigurationTarget.Workspace);

				const task = <Task[]>(await tasks.fetchTasks());

				if (task && task.length > 0) {
					const grp = task[0].group;
					assert.strictEqual(grp?.isDefault, true);
				} else {
					assert.fail('fetched task can\'t be undefined');
				}
				// Reset tasks.json
				await tasksConfig.update('tasks', []);
			});

			test('Tasks can be run back to back', async () => {
				class Pty implements Pseudoterminal {
					writer = new EventEmitter<string>();
					onDidWrite = this.writer.event;
					closer = new EventEmitter<number | undefined>();
					onDidClose = this.closer.event;

					constructor(readonly num: number, readonly quick: boolean) { }

					cleanup() {
						this.writer.dispose();
						this.closer.dispose();
					}

					open() {
						this.writer.fire('starting\r\n');
						setTimeout(() => {
							this.closer.fire(this.num);
							this.cleanup();
						}, this.quick ? 1 : 200);
					}

					close() {
						this.closer.fire(undefined);
						this.cleanup();
					}
				}

				async function runTask(num: number, quick: boolean) {
					const pty = new Pty(num, quick);
					const task = new Task(
						{ type: 'task_bug', exampleProp: `hello world ${num}` },
						TaskScope.Workspace, `task bug ${num}`, 'task bug',
						new CustomExecution(
							async () => {
								return pty;
							},
						));
					tasks.executeTask(task);
					return new Promise<number | undefined>(resolve => {
						pty.onDidClose(exitCode => {
							resolve(exitCode);
						});
					});
				}


				const [r1, r2, r3, r4] = await Promise.all([
					runTask(1, false), runTask(2, false), runTask(3, false), runTask(4, false)
				]);
				assert.strictEqual(r1, 1);
				assert.strictEqual(r2, 2);
				assert.strictEqual(r3, 3);
				assert.strictEqual(r4, 4);

				const [j1, j2, j3, j4] = await Promise.all([
					runTask(5, true), runTask(6, true), runTask(7, true), runTask(8, true)
				]);
				assert.strictEqual(j1, 5);
				assert.strictEqual(j2, 6);
				assert.strictEqual(j3, 7);
				assert.strictEqual(j4, 8);
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/workspace.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/workspace.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as fs from 'fs';
import { basename, join, posix } from 'path';
import * as vscode from 'vscode';
import { TestFS } from '../memfs';
import { assertNoRpc, closeAllEditors, createRandomFile, delay, deleteFile, disposeAll, Mutable, pathEquals, revertAllDirty, rndName, testFs, withLogDisabled } from '../utils';

suite('vscode API - workspace', () => {

	let root: vscode.Uri;

	suiteSetup(function () {
		root = vscode.workspace.workspaceFolders![0]!.uri;
	});

	teardown(async function () {
		assertNoRpc();
		await closeAllEditors();
	});

	test('MarkdownString', function () {
		let md = new vscode.MarkdownString();
		assert.strictEqual(md.value, '');
		assert.strictEqual(md.isTrusted, undefined);

		md = new vscode.MarkdownString('**bold**');
		assert.strictEqual(md.value, '**bold**');

		md.appendText('**bold?**');
		assert.strictEqual(md.value, '**bold**\\*\\*bold?\\*\\*');

		md.appendMarkdown('**bold**');
		assert.strictEqual(md.value, '**bold**\\*\\*bold?\\*\\***bold**');
	});


	test('textDocuments', () => {
		assert.ok(Array.isArray(vscode.workspace.textDocuments));
		assert.throws(() => (vscode.workspace as Mutable<typeof vscode.workspace>).textDocuments = null as unknown as vscode.TextDocument[]);
	});

	test('rootPath', () => {
		assert.ok(pathEquals(vscode.workspace.rootPath!, join(__dirname, '../../testWorkspace')));

		assert.throws(() => (vscode.workspace as Mutable<typeof vscode.workspace>).rootPath = 'farboo');
	});

	test('workspaceFile', () => {
		assert.ok(!vscode.workspace.workspaceFile);
	});

	test('workspaceFolders', () => {
		if (vscode.workspace.workspaceFolders) {
			assert.strictEqual(vscode.workspace.workspaceFolders.length, 1);
			assert.ok(pathEquals(vscode.workspace.workspaceFolders[0].uri.fsPath, join(__dirname, '../../testWorkspace')));
		}
	});

	test('getWorkspaceFolder', () => {
		const folder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(join(__dirname, '../../testWorkspace/far.js')));
		assert.ok(!!folder);

		if (folder) {
			assert.ok(pathEquals(folder.uri.fsPath, join(__dirname, '../../testWorkspace')));
		}
	});

	test('openTextDocument', async () => {
		const uri = await createRandomFile();

		// not yet there
		const existing1 = vscode.workspace.textDocuments.find(doc => doc.uri.toString() === uri.toString());
		assert.strictEqual(existing1, undefined);

		// open and assert its there
		const doc = await vscode.workspace.openTextDocument(uri);
		assert.ok(doc);
		assert.strictEqual(doc.uri.toString(), uri.toString());
		const existing2 = vscode.workspace.textDocuments.find(doc => doc.uri.toString() === uri.toString());
		assert.strictEqual(existing2 === doc, true);
	});

	test('openTextDocument, illegal path', () => {
		return vscode.workspace.openTextDocument('funkydonky.txt').then(_doc => {
			throw new Error('missing error');
		}, _err => {
			// good!
		});
	});

	test('openTextDocument, untitled is dirty', async function () {
		return vscode.workspace.openTextDocument(vscode.workspace.workspaceFolders![0].uri.with({ scheme: 'untitled', path: posix.join(vscode.workspace.workspaceFolders![0].uri.path, 'newfile.txt') })).then(doc => {
			assert.strictEqual(doc.uri.scheme, 'untitled');
			assert.ok(doc.isDirty);
		});
	});

	test('openTextDocument, untitled with host', function () {
		const uri = vscode.Uri.parse('untitled://localhost/c%24/Users/jrieken/code/samples/foobar.txt');
		return vscode.workspace.openTextDocument(uri).then(doc => {
			assert.strictEqual(doc.uri.scheme, 'untitled');
		});
	});

	test('openTextDocument, untitled without path', function () {
		return vscode.workspace.openTextDocument().then(doc => {
			assert.strictEqual(doc.uri.scheme, 'untitled');
			assert.ok(doc.isDirty);
		});
	});

	test('openTextDocument, untitled without path but language ID', function () {
		return vscode.workspace.openTextDocument({ language: 'xml' }).then(doc => {
			assert.strictEqual(doc.uri.scheme, 'untitled');
			assert.strictEqual(doc.languageId, 'xml');
			assert.ok(doc.isDirty);
		});
	});

	test('openTextDocument, untitled without path but language ID and content', function () {
		return vscode.workspace.openTextDocument({ language: 'html', content: '<h1>Hello world!</h1>' }).then(doc => {
			assert.strictEqual(doc.uri.scheme, 'untitled');
			assert.strictEqual(doc.languageId, 'html');
			assert.ok(doc.isDirty);
			assert.strictEqual(doc.getText(), '<h1>Hello world!</h1>');
		});
	});

	test('openTextDocument, untitled closes on save', function () {
		const path = join(vscode.workspace.rootPath || '', './newfile.txt');

		return vscode.workspace.openTextDocument(vscode.Uri.parse('untitled:' + path)).then(doc => {
			assert.strictEqual(doc.uri.scheme, 'untitled');
			assert.ok(doc.isDirty);

			const closedDocuments: vscode.TextDocument[] = [];
			const d0 = vscode.workspace.onDidCloseTextDocument(e => closedDocuments.push(e));

			return vscode.window.showTextDocument(doc).then(() => {
				return doc.save().then((didSave: boolean) => {

					assert.strictEqual(didSave, true, `FAILED to save${doc.uri.toString()}`);

					const closed = closedDocuments.filter(close => close.uri.toString() === doc.uri.toString())[0];
					assert.ok(closed);
					assert.ok(closed === doc);
					assert.ok(!doc.isDirty);
					assert.ok(fs.existsSync(path));

					d0.dispose();
					fs.unlinkSync(join(vscode.workspace.rootPath || '', './newfile.txt'));
				});
			});

		});
	});

	test('openTextDocument, uri scheme/auth/path', function () {

		const registration = vscode.workspace.registerTextDocumentContentProvider('sc', {
			provideTextDocumentContent() {
				return 'SC';
			}
		});

		return Promise.all([
			vscode.workspace.openTextDocument(vscode.Uri.parse('sc://auth')).then(doc => {
				assert.strictEqual(doc.uri.authority, 'auth');
				assert.strictEqual(doc.uri.path, '');
			}),
			vscode.workspace.openTextDocument(vscode.Uri.parse('sc:///path')).then(doc => {
				assert.strictEqual(doc.uri.authority, '');
				assert.strictEqual(doc.uri.path, '/path');
			}),
			vscode.workspace.openTextDocument(vscode.Uri.parse('sc://auth/path')).then(doc => {
				assert.strictEqual(doc.uri.authority, 'auth');
				assert.strictEqual(doc.uri.path, '/path');
			})
		]).then(() => {
			registration.dispose();
		});
	});

	test('openTextDocument, actual casing first', async function () {

		const fs = new TestFS('this-fs', false);
		const reg = vscode.workspace.registerFileSystemProvider(fs.scheme, fs, { isCaseSensitive: fs.isCaseSensitive });

		const uriOne = vscode.Uri.parse('this-fs:/one');
		const uriTwo = vscode.Uri.parse('this-fs:/two');
		const uriONE = vscode.Uri.parse('this-fs:/ONE'); // same resource, different uri
		const uriTWO = vscode.Uri.parse('this-fs:/TWO');

		fs.writeFile(uriOne, Buffer.from('one'), { create: true, overwrite: true });
		fs.writeFile(uriTwo, Buffer.from('two'), { create: true, overwrite: true });

		// lower case (actual case) comes first
		const docOne = await vscode.workspace.openTextDocument(uriOne);
		assert.strictEqual(docOne.uri.toString(), uriOne.toString());

		const docONE = await vscode.workspace.openTextDocument(uriONE);
		assert.strictEqual(docONE === docOne, true);
		assert.strictEqual(docONE.uri.toString(), uriOne.toString());
		assert.strictEqual(docONE.uri.toString() !== uriONE.toString(), true); // yep

		// upper case (NOT the actual case) comes first
		const docTWO = await vscode.workspace.openTextDocument(uriTWO);
		assert.strictEqual(docTWO.uri.toString(), uriTWO.toString());

		const docTwo = await vscode.workspace.openTextDocument(uriTwo);
		assert.strictEqual(docTWO === docTwo, true);
		assert.strictEqual(docTwo.uri.toString(), uriTWO.toString());
		assert.strictEqual(docTwo.uri.toString() !== uriTwo.toString(), true); // yep

		reg.dispose();
	});

	test('eol, read', () => {
		const a = createRandomFile('foo\nbar\nbar').then(file => {
			return vscode.workspace.openTextDocument(file).then(doc => {
				assert.strictEqual(doc.eol, vscode.EndOfLine.LF);
			});
		});
		const b = createRandomFile('foo\nbar\nbar\r\nbaz').then(file => {
			return vscode.workspace.openTextDocument(file).then(doc => {
				assert.strictEqual(doc.eol, vscode.EndOfLine.LF);
			});
		});
		const c = createRandomFile('foo\r\nbar\r\nbar').then(file => {
			return vscode.workspace.openTextDocument(file).then(doc => {
				assert.strictEqual(doc.eol, vscode.EndOfLine.CRLF);
			});
		});
		return Promise.all([a, b, c]);
	});

	test('eol, change via editor', () => {
		return createRandomFile('foo\nbar\nbar').then(file => {
			return vscode.workspace.openTextDocument(file).then(doc => {
				assert.strictEqual(doc.eol, vscode.EndOfLine.LF);
				return vscode.window.showTextDocument(doc).then(editor => {
					return editor.edit(builder => builder.setEndOfLine(vscode.EndOfLine.CRLF));

				}).then(value => {
					assert.ok(value);
					assert.ok(doc.isDirty);
					assert.strictEqual(doc.eol, vscode.EndOfLine.CRLF);
				});
			});
		});
	});

	test('eol, change via applyEdit', () => {
		return createRandomFile('foo\nbar\nbar').then(file => {
			return vscode.workspace.openTextDocument(file).then(doc => {
				assert.strictEqual(doc.eol, vscode.EndOfLine.LF);

				const edit = new vscode.WorkspaceEdit();
				edit.set(file, [vscode.TextEdit.setEndOfLine(vscode.EndOfLine.CRLF)]);
				return vscode.workspace.applyEdit(edit).then(value => {
					assert.ok(value);
					assert.ok(doc.isDirty);
					assert.strictEqual(doc.eol, vscode.EndOfLine.CRLF);
				});
			});
		});
	});

	test('eol, change via onWillSave', async function () {
		let called = false;
		const sub = vscode.workspace.onWillSaveTextDocument(e => {
			called = true;
			e.waitUntil(Promise.resolve([vscode.TextEdit.setEndOfLine(vscode.EndOfLine.LF)]));
		});

		const file = await createRandomFile('foo\r\nbar\r\nbar');
		const doc = await vscode.workspace.openTextDocument(file);
		assert.strictEqual(doc.eol, vscode.EndOfLine.CRLF);

		const edit = new vscode.WorkspaceEdit();
		edit.set(file, [vscode.TextEdit.insert(new vscode.Position(0, 0), '-changes-')]);
		const successEdit = await vscode.workspace.applyEdit(edit);
		assert.ok(successEdit);

		const successSave = await doc.save();
		assert.ok(successSave);
		assert.ok(called);
		assert.ok(!doc.isDirty);
		assert.strictEqual(doc.eol, vscode.EndOfLine.LF);
		sub.dispose();
	});


	test('events: onDidOpenTextDocument, onDidChangeTextDocument, onDidSaveTextDocument', async () => {
		const file = await createRandomFile();
		const disposables: vscode.Disposable[] = [];

		await revertAllDirty(); // needed for a clean state for `onDidSaveTextDocument` (#102365)

		const onDidOpenTextDocument = new Set<vscode.TextDocument>();
		const onDidChangeTextDocument = new Set<vscode.TextDocument>();
		const onDidSaveTextDocument = new Set<vscode.TextDocument>();

		disposables.push(vscode.workspace.onDidOpenTextDocument(e => {
			onDidOpenTextDocument.add(e);
		}));

		disposables.push(vscode.workspace.onDidChangeTextDocument(e => {
			onDidChangeTextDocument.add(e.document);
		}));

		disposables.push(vscode.workspace.onDidSaveTextDocument(e => {
			onDidSaveTextDocument.add(e);
		}));

		const doc = await vscode.workspace.openTextDocument(file);
		const editor = await vscode.window.showTextDocument(doc);

		await editor.edit((builder) => {
			builder.insert(new vscode.Position(0, 0), 'Hello World');
		});
		await doc.save();

		assert.ok(Array.from(onDidOpenTextDocument).find(e => e.uri.toString() === file.toString()), 'did Open: ' + file.toString());
		assert.ok(Array.from(onDidChangeTextDocument).find(e => e.uri.toString() === file.toString()), 'did Change: ' + file.toString());
		assert.ok(Array.from(onDidSaveTextDocument).find(e => e.uri.toString() === file.toString()), 'did Save: ' + file.toString());

		disposeAll(disposables);
		return deleteFile(file);
	});

	test('events: onDidSaveTextDocument fires even for non dirty file when saved', async () => {
		const file = await createRandomFile();
		const disposables: vscode.Disposable[] = [];

		await revertAllDirty(); // needed for a clean state for `onDidSaveTextDocument` (#102365)

		const onDidSaveTextDocument = new Set<vscode.TextDocument>();

		disposables.push(vscode.workspace.onDidSaveTextDocument(e => {
			onDidSaveTextDocument.add(e);
		}));

		const doc = await vscode.workspace.openTextDocument(file);
		await vscode.window.showTextDocument(doc);
		await vscode.commands.executeCommand('workbench.action.files.save');

		assert.ok(onDidSaveTextDocument);
		assert.ok(Array.from(onDidSaveTextDocument).find(e => e.uri.toString() === file.toString()), 'did Save: ' + file.toString());
		disposeAll(disposables);
		return deleteFile(file);
	});

	test('openTextDocument, with selection', function () {
		return createRandomFile('foo\nbar\nbar').then(file => {
			return vscode.workspace.openTextDocument(file).then(doc => {
				return vscode.window.showTextDocument(doc, { selection: new vscode.Range(new vscode.Position(1, 1), new vscode.Position(1, 2)) }).then(editor => {
					assert.strictEqual(editor.selection.start.line, 1);
					assert.strictEqual(editor.selection.start.character, 1);
					assert.strictEqual(editor.selection.end.line, 1);
					assert.strictEqual(editor.selection.end.character, 2);
				});
			});
		});
	});

	test('registerTextDocumentContentProvider, simple', function () {

		const registration = vscode.workspace.registerTextDocumentContentProvider('foo', {
			provideTextDocumentContent(uri) {
				return uri.toString();
			}
		});

		const uri = vscode.Uri.parse('foo://testing/virtual.js');
		return vscode.workspace.openTextDocument(uri).then(doc => {
			assert.strictEqual(doc.getText(), uri.toString());
			assert.strictEqual(doc.isDirty, false);
			assert.strictEqual(doc.uri.toString(), uri.toString());
			registration.dispose();
		});
	});

	test('registerTextDocumentContentProvider, constrains', function () {

		// built-in
		assert.throws(function () {
			vscode.workspace.registerTextDocumentContentProvider('untitled', { provideTextDocumentContent() { return null; } });
		});
		// built-in
		assert.throws(function () {
			vscode.workspace.registerTextDocumentContentProvider('file', { provideTextDocumentContent() { return null; } });
		});

		// missing scheme
		return vscode.workspace.openTextDocument(vscode.Uri.parse('notThere://foo/far/boo/bar')).then(() => {
			assert.ok(false, 'expected failure');
		}, _err => {
			// expected
		});
	});

	test('registerTextDocumentContentProvider, multiple', function () {

		// duplicate registration
		const registration1 = vscode.workspace.registerTextDocumentContentProvider('foo', {
			provideTextDocumentContent(uri) {
				if (uri.authority === 'foo') {
					return '1';
				}
				return undefined;
			}
		});
		const registration2 = vscode.workspace.registerTextDocumentContentProvider('foo', {
			provideTextDocumentContent(uri) {
				if (uri.authority === 'bar') {
					return '2';
				}
				return undefined;
			}
		});

		return Promise.all([
			vscode.workspace.openTextDocument(vscode.Uri.parse('foo://foo/bla')).then(doc => { assert.strictEqual(doc.getText(), '1'); }),
			vscode.workspace.openTextDocument(vscode.Uri.parse('foo://bar/bla')).then(doc => { assert.strictEqual(doc.getText(), '2'); })
		]).then(() => {
			registration1.dispose();
			registration2.dispose();
		});
	});

	test('registerTextDocumentContentProvider, evil provider', function () {

		// duplicate registration
		const registration1 = vscode.workspace.registerTextDocumentContentProvider('foo', {
			provideTextDocumentContent(_uri) {
				return '1';
			}
		});
		const registration2 = vscode.workspace.registerTextDocumentContentProvider('foo', {
			provideTextDocumentContent(_uri): string {
				throw new Error('fail');
			}
		});

		return vscode.workspace.openTextDocument(vscode.Uri.parse('foo://foo/bla')).then(doc => {
			assert.strictEqual(doc.getText(), '1');
			registration1.dispose();
			registration2.dispose();
		});
	});

	test('registerTextDocumentContentProvider, invalid text', function () {

		const registration = vscode.workspace.registerTextDocumentContentProvider('foo', {
			provideTextDocumentContent(_uri) {
				return 123 as unknown as string;
			}
		});
		return vscode.workspace.openTextDocument(vscode.Uri.parse('foo://auth/path')).then(() => {
			assert.ok(false, 'expected failure');
		}, _err => {
			// expected
			registration.dispose();
		});
	});

	test('registerTextDocumentContentProvider, show virtual document', function () {

		const registration = vscode.workspace.registerTextDocumentContentProvider('foo', {
			provideTextDocumentContent(_uri) {
				return 'I am virtual';
			}
		});

		return vscode.workspace.openTextDocument(vscode.Uri.parse('foo://something/path')).then(doc => {
			return vscode.window.showTextDocument(doc).then(editor => {

				assert.ok(editor.document === doc);
				assert.strictEqual(editor.document.getText(), 'I am virtual');
				registration.dispose();
			});
		});
	});

	test('registerTextDocumentContentProvider, open/open document', function () {

		let callCount = 0;
		const registration = vscode.workspace.registerTextDocumentContentProvider('foo', {
			provideTextDocumentContent(_uri) {
				callCount += 1;
				return 'I am virtual';
			}
		});

		const uri = vscode.Uri.parse('foo://testing/path');

		return Promise.all([vscode.workspace.openTextDocument(uri), vscode.workspace.openTextDocument(uri)]).then(docs => {
			const [first, second] = docs;
			assert.ok(first === second);
			assert.ok(vscode.workspace.textDocuments.some(doc => doc.uri.toString() === uri.toString()));
			assert.strictEqual(callCount, 1);
			registration.dispose();
		});
	});

	test('registerTextDocumentContentProvider, empty doc', function () {

		const registration = vscode.workspace.registerTextDocumentContentProvider('foo', {
			provideTextDocumentContent(_uri) {
				return '';
			}
		});

		const uri = vscode.Uri.parse('foo:doc/empty');

		return vscode.workspace.openTextDocument(uri).then(doc => {
			assert.strictEqual(doc.getText(), '');
			assert.strictEqual(doc.uri.toString(), uri.toString());
			registration.dispose();
		});
	});

	test('registerTextDocumentContentProvider, change event', async function () {

		let callCount = 0;
		const emitter = new vscode.EventEmitter<vscode.Uri>();

		const registration = vscode.workspace.registerTextDocumentContentProvider('foo', {
			onDidChange: emitter.event,
			provideTextDocumentContent(_uri) {
				return 'call' + (callCount++);
			}
		});

		const uri = vscode.Uri.parse('foo://testing/path3');
		const doc = await vscode.workspace.openTextDocument(uri);

		assert.strictEqual(callCount, 1);
		assert.strictEqual(doc.getText(), 'call0');

		return new Promise<void>(resolve => {

			const subscription = vscode.workspace.onDidChangeTextDocument(event => {
				assert.ok(event.document === doc);
				assert.strictEqual(event.document.getText(), 'call1');
				subscription.dispose();
				registration.dispose();
				resolve();
			});

			emitter.fire(doc.uri);
		});
	});

	test('findFiles', () => {
		return vscode.workspace.findFiles('**/image.png').then((res) => {
			assert.strictEqual(res.length, 2);
			assert.strictEqual(basename(vscode.workspace.asRelativePath(res[0])), 'image.png');
		});
	});

	test('findFiles - null exclude', async () => {
		await vscode.workspace.findFiles('**/file.txt').then((res) => {
			// search.exclude folder is still searched, files.exclude folder is not
			assert.strictEqual(res.length, 1);
			assert.strictEqual(basename(vscode.workspace.asRelativePath(res[0])), 'file.txt');
		});

		await vscode.workspace.findFiles('**/file.txt', null).then((res) => {
			// search.exclude and files.exclude folders are both searched
			assert.strictEqual(res.length, 2);
			assert.strictEqual(basename(vscode.workspace.asRelativePath(res[0])), 'file.txt');
		});
	});

	test('findFiles - exclude', () => {
		return vscode.workspace.findFiles('**/image.png').then((res) => {
			assert.strictEqual(res.length, 2);
			assert.strictEqual(basename(vscode.workspace.asRelativePath(res[0])), 'image.png');
		});
	});

	test('findFiles, exclude', () => {
		return vscode.workspace.findFiles('**/image.png', '**/sub/**').then((res) => {
			assert.strictEqual(res.length, 1);
			assert.strictEqual(basename(vscode.workspace.asRelativePath(res[0])), 'image.png');
		});
	});

	test('findFiles, cancellation', () => {

		const source = new vscode.CancellationTokenSource();
		const token = source.token; // just to get an instance first
		source.cancel();

		return vscode.workspace.findFiles('*.js', null, 100, token).then((res) => {
			assert.deepStrictEqual(res, []);
		});
	});

	test('`findFiles2`', () => {
		return vscode.workspace.findFiles2(['**/image.png']).then((res) => {
			assert.strictEqual(res.length, 2);
		});
	});

	test('findFiles2 - null exclude', async () => {
		await vscode.workspace.findFiles2(['**/file.txt'], { useExcludeSettings: vscode.ExcludeSettingOptions.FilesExclude }).then((res) => {
			// file.exclude folder is still searched, search.exclude folder is not
			assert.strictEqual(res.length, 1);
			assert.strictEqual(basename(vscode.workspace.asRelativePath(res[0])), 'file.txt');
		});

		await vscode.workspace.findFiles2(['**/file.txt'], { useExcludeSettings: vscode.ExcludeSettingOptions.None }).then((res) => {
			// search.exclude and files.exclude folders are both searched
			assert.strictEqual(res.length, 2);
			assert.strictEqual(basename(vscode.workspace.asRelativePath(res[0])), 'file.txt');
		});
	});

	test('findFiles2, exclude', () => {
		return vscode.workspace.findFiles2(['**/image.png'], { exclude: ['**/sub/**'] }).then((res) => {
			assert.strictEqual(res.length, 1);
		});
	});

	test('findFiles2, cancellation', () => {

		const source = new vscode.CancellationTokenSource();
		const token = source.token; // just to get an instance first
		source.cancel();

		return vscode.workspace.findFiles2(['*.js'], {}, token).then((res) => {
			assert.deepStrictEqual(res, []);
		});
	});

	test('findTextInFiles', async () => {
		const options: vscode.FindTextInFilesOptions = {
			include: '*.ts',
			previewOptions: {
				matchLines: 1,
				charsPerLine: 100
			}
		};

		const results: vscode.TextSearchResult[] = [];
		await vscode.workspace.findTextInFiles({ pattern: 'foo' }, options, result => {
			results.push(result);
		});

		assert.strictEqual(results.length, 1);
		const match = <vscode.TextSearchMatch>results[0];
		assert(match.preview.text.indexOf('foo') >= 0);
		assert.strictEqual(basename(vscode.workspace.asRelativePath(match.uri)), '10linefile.ts');
	});

	test('findTextInFiles, cancellation', async () => {
		const results: vscode.TextSearchResult[] = [];
		const cancellation = new vscode.CancellationTokenSource();
		cancellation.cancel();

		await vscode.workspace.findTextInFiles({ pattern: 'foo' }, result => {
			results.push(result);
		}, cancellation.token);
	});

	test('applyEdit', async () => {
		const doc = await vscode.workspace.openTextDocument(vscode.Uri.parse('untitled:' + join(vscode.workspace.rootPath || '', './new2.txt')));

		const edit = new vscode.WorkspaceEdit();
		edit.insert(doc.uri, new vscode.Position(0, 0), new Array(1000).join('Hello World'));

		const success = await vscode.workspace.applyEdit(edit);
		assert.strictEqual(success, true);
		assert.strictEqual(doc.isDirty, true);
	});

	test('applyEdit should fail when editing deleted resource', withLogDisabled(async () => {
		const resource = await createRandomFile();

		const edit = new vscode.WorkspaceEdit();
		edit.deleteFile(resource);
		edit.insert(resource, new vscode.Position(0, 0), '');

		const success = await vscode.workspace.applyEdit(edit);
		assert.strictEqual(success, false);
	}));

	test('applyEdit should fail when renaming deleted resource', withLogDisabled(async () => {
		const resource = await createRandomFile();

		const edit = new vscode.WorkspaceEdit();
		edit.deleteFile(resource);
		edit.renameFile(resource, resource);

		const success = await vscode.workspace.applyEdit(edit);
		assert.strictEqual(success, false);
	}));

	test('applyEdit should fail when editing renamed from resource', withLogDisabled(async () => {
		const resource = await createRandomFile();
		const newResource = vscode.Uri.file(resource.fsPath + '.1');
		const edit = new vscode.WorkspaceEdit();
		edit.renameFile(resource, newResource);
		edit.insert(resource, new vscode.Position(0, 0), '');

		const success = await vscode.workspace.applyEdit(edit);
		assert.strictEqual(success, false);
	}));

	test('applyEdit "edit A -> rename A to B -> edit B"', async () => {
		await testEditRenameEdit(oldUri => oldUri.with({ path: oldUri.path + 'NEW' }));
	});

	test('applyEdit "edit A -> rename A to B (different case)" -> edit B', async () => {
		await testEditRenameEdit(oldUri => oldUri.with({ path: oldUri.path.toUpperCase() }));
	});

	test('applyEdit "edit A -> rename A to B (same case)" -> edit B', async () => {
		await testEditRenameEdit(oldUri => oldUri);
	});

	async function testEditRenameEdit(newUriCreator: (oldUri: vscode.Uri) => vscode.Uri): Promise<void> {
		const oldUri = await createRandomFile();
		const newUri = newUriCreator(oldUri);
		const edit = new vscode.WorkspaceEdit();
		edit.insert(oldUri, new vscode.Position(0, 0), 'BEFORE');
		edit.renameFile(oldUri, newUri);
		edit.insert(newUri, new vscode.Position(0, 0), 'AFTER');

		assert.ok(await vscode.workspace.applyEdit(edit));

		const doc = await vscode.workspace.openTextDocument(newUri);
		assert.strictEqual(doc.getText(), 'AFTERBEFORE');
		assert.strictEqual(doc.isDirty, true);
	}

	function nameWithUnderscore(uri: vscode.Uri) {
		return uri.with({ path: posix.join(posix.dirname(uri.path), `_${posix.basename(uri.path)}`) });
	}

	test('WorkspaceEdit: applying edits before and after rename duplicates resource #42633', withLogDisabled(async function () {
		const docUri = await createRandomFile();
		const newUri = nameWithUnderscore(docUri);

		const we = new vscode.WorkspaceEdit();
		we.insert(docUri, new vscode.Position(0, 0), 'Hello');
		we.insert(docUri, new vscode.Position(0, 0), 'Foo');
		we.renameFile(docUri, newUri);
		we.insert(newUri, new vscode.Position(0, 0), 'Bar');

		assert.ok(await vscode.workspace.applyEdit(we));
		const doc = await vscode.workspace.openTextDocument(newUri);
		assert.strictEqual(doc.getText(), 'BarHelloFoo');
	}));

	test('WorkspaceEdit: Problem recreating a renamed resource #42634', withLogDisabled(async function () {
		const docUri = await createRandomFile();
		const newUri = nameWithUnderscore(docUri);

		const we = new vscode.WorkspaceEdit();
		we.insert(docUri, new vscode.Position(0, 0), 'Hello');
		we.insert(docUri, new vscode.Position(0, 0), 'Foo');
		we.renameFile(docUri, newUri);

		we.createFile(docUri);
		we.insert(docUri, new vscode.Position(0, 0), 'Bar');

		assert.ok(await vscode.workspace.applyEdit(we));

		const newDoc = await vscode.workspace.openTextDocument(newUri);
		assert.strictEqual(newDoc.getText(), 'HelloFoo');
		const doc = await vscode.workspace.openTextDocument(docUri);
		assert.strictEqual(doc.getText(), 'Bar');
	}));

	test('WorkspaceEdit api - after saving a deleted file, it still shows up as deleted. #42667', withLogDisabled(async function () {
		const docUri = await createRandomFile();
		const we = new vscode.WorkspaceEdit();
		we.deleteFile(docUri);
		we.insert(docUri, new vscode.Position(0, 0), 'InsertText');

		assert.ok(!(await vscode.workspace.applyEdit(we)));
		try {
			await vscode.workspace.openTextDocument(docUri);
			assert.ok(false);
		} catch (e) {
			assert.ok(true);
		}
	}));

	test('WorkspaceEdit: edit and rename parent folder duplicates resource #42641', async function () {

		const dir = vscode.Uri.parse(`${testFs.scheme}:/before-${rndName()}`);
		await testFs.createDirectory(dir);

		const docUri = await createRandomFile('', dir);
		const docParent = docUri.with({ path: posix.dirname(docUri.path) });
		const newParent = nameWithUnderscore(docParent);

		const we = new vscode.WorkspaceEdit();
		we.insert(docUri, new vscode.Position(0, 0), 'Hello');
		we.renameFile(docParent, newParent);

		assert.ok(await vscode.workspace.applyEdit(we));

		try {
			await vscode.workspace.openTextDocument(docUri);
			assert.ok(false);
		} catch (e) {
			assert.ok(true);
		}

		const newUri = newParent.with({ path: posix.join(newParent.path, posix.basename(docUri.path)) });
		const doc = await vscode.workspace.openTextDocument(newUri);
		assert.ok(doc);

		assert.strictEqual(doc.getText(), 'Hello');
	});

	test('WorkspaceEdit: rename resource followed by edit does not work #42638', withLogDisabled(async function () {
		const docUri = await createRandomFile();
		const newUri = nameWithUnderscore(docUri);

		const we = new vscode.WorkspaceEdit();
		we.renameFile(docUri, newUri);
		we.insert(newUri, new vscode.Position(0, 0), 'Hello');

		assert.ok(await vscode.workspace.applyEdit(we));

		const doc = await vscode.workspace.openTextDocument(newUri);
		assert.strictEqual(doc.getText(), 'Hello');
	}));

	test('WorkspaceEdit: create & override', withLogDisabled(async function () {

		const docUri = await createRandomFile('before');

		let we = new vscode.WorkspaceEdit();
		we.createFile(docUri);
		assert.ok(!await vscode.workspace.applyEdit(we));
		assert.strictEqual((await vscode.workspace.openTextDocument(docUri)).getText(), 'before');

		we = new vscode.WorkspaceEdit();
		we.createFile(docUri, { overwrite: true });
		assert.ok(await vscode.workspace.applyEdit(we));
		assert.strictEqual((await vscode.workspace.openTextDocument(docUri)).getText(), '');
	}));

	test('WorkspaceEdit: create & ignoreIfExists', withLogDisabled(async function () {
		const docUri = await createRandomFile('before');

		let we = new vscode.WorkspaceEdit();
		we.createFile(docUri, { ignoreIfExists: true });
		assert.ok(await vscode.workspace.applyEdit(we));
		assert.strictEqual((await vscode.workspace.openTextDocument(docUri)).getText(), 'before');

		we = new vscode.WorkspaceEdit();
		we.createFile(docUri, { overwrite: true, ignoreIfExists: true });
		assert.ok(await vscode.workspace.applyEdit(we));
		assert.strictEqual((await vscode.workspace.openTextDocument(docUri)).getText(), '');
	}));

	test('WorkspaceEdit: rename & ignoreIfExists', withLogDisabled(async function () {
		const aUri = await createRandomFile('aaa');
		const bUri = await createRandomFile('bbb');

		let we = new vscode.WorkspaceEdit();
		we.renameFile(aUri, bUri);
		assert.ok(!await vscode.workspace.applyEdit(we));

		we = new vscode.WorkspaceEdit();
		we.renameFile(aUri, bUri, { ignoreIfExists: true });
		assert.ok(await vscode.workspace.applyEdit(we));

		we = new vscode.WorkspaceEdit();
		we.renameFile(aUri, bUri, { overwrite: false, ignoreIfExists: true });
		assert.ok(!await vscode.workspace.applyEdit(we));

		we = new vscode.WorkspaceEdit();
		we.renameFile(aUri, bUri, { overwrite: true, ignoreIfExists: true });
		assert.ok(await vscode.workspace.applyEdit(we));
	}));

	test('WorkspaceEdit: delete & ignoreIfNotExists', withLogDisabled(async function () {

		const docUri = await createRandomFile();
		let we = new vscode.WorkspaceEdit();
		we.deleteFile(docUri, { ignoreIfNotExists: false });
		assert.ok(await vscode.workspace.applyEdit(we));

		we = new vscode.WorkspaceEdit();
		we.deleteFile(docUri, { ignoreIfNotExists: false });
		assert.ok(!await vscode.workspace.applyEdit(we));

		we = new vscode.WorkspaceEdit();
		we.deleteFile(docUri, { ignoreIfNotExists: true });
		assert.ok(await vscode.workspace.applyEdit(we));
	}));

	test('WorkspaceEdit: insert & rename multiple', async function () {

		const [f1, f2, f3] = await Promise.all([createRandomFile(), createRandomFile(), createRandomFile()]);

		const we = new vscode.WorkspaceEdit();
		we.insert(f1, new vscode.Position(0, 0), 'f1');
		we.insert(f2, new vscode.Position(0, 0), 'f2');
		we.insert(f3, new vscode.Position(0, 0), 'f3');

		const f1_ = nameWithUnderscore(f1);
		we.renameFile(f1, f1_);

		assert.ok(await vscode.workspace.applyEdit(we));

		assert.strictEqual((await vscode.workspace.openTextDocument(f3)).getText(), 'f3');
		assert.strictEqual((await vscode.workspace.openTextDocument(f2)).getText(), 'f2');
		assert.strictEqual((await vscode.workspace.openTextDocument(f1_)).getText(), 'f1');
		try {
			await vscode.workspace.fs.stat(f1);
			assert.ok(false);
		} catch {
			assert.ok(true);
		}
	});

	// TODO: below test is flaky and commented out, see https://github.com/microsoft/vscode/issues/238837
	test.skip('workspace.applyEdit drops the TextEdit if there is a RenameFile later #77735 (with opened editor)', async function () {
		await test77735(true);
	});

	test('workspace.applyEdit drops the TextEdit if there is a RenameFile later #77735 (without opened editor)', async function () {
		await test77735(false);
	});

	async function test77735(withOpenedEditor: boolean): Promise<void> {
		const docUriOriginal = await createRandomFile();
		const docUriMoved = docUriOriginal.with({ path: `${docUriOriginal.path}.moved` });
		await deleteFile(docUriMoved);

		if (withOpenedEditor) {
			const document = await vscode.workspace.openTextDocument(docUriOriginal);
			await vscode.window.showTextDocument(document);
		} else {
			await vscode.commands.executeCommand('workbench.action.closeAllEditors');
		}

		for (let i = 0; i < 4; i++) {
			const we = new vscode.WorkspaceEdit();
			let oldUri: vscode.Uri;
			let newUri: vscode.Uri;
			let expected: string;

			if (i % 2 === 0) {
				oldUri = docUriOriginal;
				newUri = docUriMoved;
				we.insert(oldUri, new vscode.Position(0, 0), 'Hello');
				expected = 'Hello';
			} else {
				oldUri = docUriMoved;
				newUri = docUriOriginal;
				we.delete(oldUri, new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 5)));
				expected = '';
			}

			we.renameFile(oldUri, newUri);
			assert.ok(await vscode.workspace.applyEdit(we));

			const document = await vscode.workspace.openTextDocument(newUri);
			assert.strictEqual(document.isDirty, true);

			const result = await document.save();
			assert.strictEqual(result, true, `save failed in iteration: ${i} (docUriOriginal: ${docUriOriginal.fsPath})`);
			assert.strictEqual(document.isDirty, false, `document still dirty in iteration: ${i} (docUriOriginal: ${docUriOriginal.fsPath})`);

			assert.strictEqual(document.getText(), expected);

			await delay(10);
		}
	}

	test('The api workspace.applyEdit failed for some case of mixing resourceChange and textEdit #80688, 1/2', async function () {
		const file1 = await createRandomFile();
		const file2 = await createRandomFile();
		const we = new vscode.WorkspaceEdit();
		we.insert(file1, new vscode.Position(0, 0), 'import1;');

		const file2Name = basename(file2.fsPath);
		const file2NewUri = vscode.Uri.joinPath(file2, `../new/${file2Name}`);
		we.renameFile(file2, file2NewUri);

		we.insert(file1, new vscode.Position(0, 0), 'import2;');
		await vscode.workspace.applyEdit(we);

		const document = await vscode.workspace.openTextDocument(file1);
		// const expected = 'import1;import2;';
		const expected2 = 'import2;import1;';
		assert.strictEqual(document.getText(), expected2);
	});

	test('The api workspace.applyEdit failed for some case of mixing resourceChange and textEdit #80688, 2/2', async function () {
		const file1 = await createRandomFile();
		const file2 = await createRandomFile();
		const we = new vscode.WorkspaceEdit();
		we.insert(file1, new vscode.Position(0, 0), 'import1;');
		we.insert(file1, new vscode.Position(0, 0), 'import2;');

		const file2Name = basename(file2.fsPath);
		const file2NewUri = vscode.Uri.joinPath(file2, `../new/${file2Name}`);
		we.renameFile(file2, file2NewUri);

		await vscode.workspace.applyEdit(we);

		const document = await vscode.workspace.openTextDocument(file1);
		const expected = 'import1;import2;';
		// const expected2 = 'import2;import1;';
		assert.strictEqual(document.getText(), expected);
	});


	test('[Bug] Failed to create new test file when in an untitled file #1261', async function () {
		const uri = vscode.Uri.parse('untitled:Untitled-5.test');
		const contents = `Hello Test File ${uri.toString()}`;
		const we = new vscode.WorkspaceEdit();
		we.createFile(uri, { ignoreIfExists: true });
		we.replace(uri, new vscode.Range(0, 0, 0, 0), contents);

		const success = await vscode.workspace.applyEdit(we);

		assert.ok(success);

		const doc = await vscode.workspace.openTextDocument(uri);
		assert.strictEqual(doc.getText(), contents);
	});

	test('Should send a single FileWillRenameEvent instead of separate events when moving multiple files at once#111867, 1/3', async function () {

		const file1 = await createRandomFile();
		const file2 = await createRandomFile();

		const file1New = await createRandomFile();
		const file2New = await createRandomFile();

		const event = new Promise<vscode.FileWillRenameEvent>(resolve => {
			const sub = vscode.workspace.onWillRenameFiles(e => {
				sub.dispose();
				resolve(e);
			});
		});

		const we = new vscode.WorkspaceEdit();
		we.renameFile(file1, file1New, { overwrite: true });
		we.renameFile(file2, file2New, { overwrite: true });
		await vscode.workspace.applyEdit(we);

		const e = await event;

		assert.strictEqual(e.files.length, 2);
		assert.strictEqual(e.files[0].oldUri.toString(), file1.toString());
		assert.strictEqual(e.files[1].oldUri.toString(), file2.toString());
	});

	test('WorkspaceEdit fails when creating then writing to file if file is open in the editor and is not empty #146964', async function () {
		const file1 = await createRandomFile();

		{
			// prepare: open file in editor, make sure it has contents
			const editor = await vscode.window.showTextDocument(file1);
			const prepEdit = new vscode.WorkspaceEdit();
			prepEdit.insert(file1, new vscode.Position(0, 0), 'Hello Here And There');
			const status = await vscode.workspace.applyEdit(prepEdit);

			assert.ok(status);
			assert.strictEqual(editor.document.getText(), 'Hello Here And There');
			assert.ok(vscode.window.activeTextEditor === editor);
		}

		const we = new vscode.WorkspaceEdit();
		we.createFile(file1, { overwrite: true, ignoreIfExists: false });
		we.set(file1, [new vscode.TextEdit(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)), 'SOME TEXT')]);
		const status = await vscode.workspace.applyEdit(we);
		assert.ok(status);
		assert.strictEqual(vscode.window.activeTextEditor!.document.getText(), 'SOME TEXT');

	});

	test('Should send a single FileWillRenameEvent instead of separate events when moving multiple files at once#111867, 2/3', async function () {

		const event = new Promise<vscode.FileWillCreateEvent>(resolve => {
			const sub = vscode.workspace.onWillCreateFiles(e => {
				sub.dispose();
				resolve(e);
			});
		});

		const file1 = vscode.Uri.parse(`fake-fs:/${rndName()}`);
		const file2 = vscode.Uri.parse(`fake-fs:/${rndName()}`);

		const we = new vscode.WorkspaceEdit();
		we.createFile(file1, { overwrite: true });
		we.createFile(file2, { overwrite: true });
		await vscode.workspace.applyEdit(we);

		const e = await event;

		assert.strictEqual(e.files.length, 2);
		assert.strictEqual(e.files[0].toString(), file1.toString());
		assert.strictEqual(e.files[1].toString(), file2.toString());
	});

	test('Should send a single FileWillRenameEvent instead of separate events when moving multiple files at once#111867, 3/3', async function () {

		const file1 = await createRandomFile();
		const file2 = await createRandomFile();

		const event = new Promise<vscode.FileWillDeleteEvent>(resolve => {
			const sub = vscode.workspace.onWillDeleteFiles(e => {
				sub.dispose();
				resolve(e);
			});
		});

		const we = new vscode.WorkspaceEdit();
		we.deleteFile(file1);
		we.deleteFile(file2);
		await vscode.workspace.applyEdit(we);

		const e = await event;

		assert.strictEqual(e.files.length, 2);
		assert.strictEqual(e.files[0].toString(), file1.toString());
		assert.strictEqual(e.files[1].toString(), file2.toString());
	});

	test.skip('issue #107739 - Redo of rename Java Class name has no effect', async () => { // https://github.com/microsoft/vscode/issues/254042
		const file = await createRandomFile('hello');
		const fileName = basename(file.fsPath);

		const newFile = vscode.Uri.joinPath(file, `../${fileName}2`);

		// apply edit
		{
			const we = new vscode.WorkspaceEdit();
			we.insert(file, new vscode.Position(0, 5), '2');
			we.renameFile(file, newFile);
			assert.ok(await vscode.workspace.applyEdit(we));
		}

		// show the new document
		{
			const document = await vscode.workspace.openTextDocument(newFile); // FAILS here
			await vscode.window.showTextDocument(document);
			assert.strictEqual(document.getText(), 'hello2');
			assert.strictEqual(document.isDirty, true);
		}

		// undo and show the old document
		{
			await vscode.commands.executeCommand('undo');
			const document = await vscode.workspace.openTextDocument(file);
			await vscode.window.showTextDocument(document);
			assert.strictEqual(document.getText(), 'hello');
		}

		// redo and show the new document
		{
			await vscode.commands.executeCommand('redo');
			const document = await vscode.workspace.openTextDocument(newFile);
			await vscode.window.showTextDocument(document);
			assert.strictEqual(document.getText(), 'hello2');
			assert.strictEqual(document.isDirty, true);
		}

	});

	test('SnippetString in WorkspaceEdit', async function (): Promise<any> {
		const file = await createRandomFile('hello\nworld');

		const document = await vscode.workspace.openTextDocument(file);
		const edt = await vscode.window.showTextDocument(document);

		assert.ok(edt === vscode.window.activeTextEditor);

		const we = new vscode.WorkspaceEdit();
		we.set(document.uri, [new vscode.SnippetTextEdit(new vscode.Range(0, 0, 0, 0), new vscode.SnippetString('${1:foo}${2:bar}'))]);
		const success = await vscode.workspace.applyEdit(we);
		if (edt !== vscode.window.activeTextEditor) {
			return this.skip();
		}

		assert.ok(success);
		assert.strictEqual(document.getText(), 'foobarhello\nworld');
		assert.deepStrictEqual(edt.selections, [new vscode.Selection(0, 0, 0, 3)]);
	});

	test('SnippetString in WorkspaceEdit with keepWhitespace', async function (): Promise<any> {
		const file = await createRandomFile('This is line 1\n  ');

		const document = await vscode.workspace.openTextDocument(file);
		const edt = await vscode.window.showTextDocument(document);

		assert.ok(edt === vscode.window.activeTextEditor);

		const snippetText = new vscode.SnippetTextEdit(new vscode.Range(1, 3, 1, 3), new vscode.SnippetString('This is line 2\n  This is line 3'));
		snippetText.keepWhitespace = true;
		const we = new vscode.WorkspaceEdit();
		we.set(document.uri, [snippetText]);
		const success = await vscode.workspace.applyEdit(we);
		if (edt !== vscode.window.activeTextEditor) {
			return this.skip();
		}

		assert.ok(success);
		assert.strictEqual(document.getText(), 'This is line 1\n  This is line 2\n  This is line 3');
	});

	test('Support creating binary files in a WorkspaceEdit', async function (): Promise<any> {

		const fileUri = vscode.Uri.parse(`${testFs.scheme}:/${rndName()}`);
		const data = Buffer.from('Hello Binary Files');

		const ws = new vscode.WorkspaceEdit();
		ws.createFile(fileUri, { contents: data, ignoreIfExists: false, overwrite: false });

		const success = await vscode.workspace.applyEdit(ws);
		assert.ok(success);

		const actual = await vscode.workspace.fs.readFile(fileUri);

		assert.deepStrictEqual(actual, data);
	});

	test('saveAll', async () => {
		await testSave(true);
	});

	test('save', async () => {
		await testSave(false);
	});

	async function testSave(saveAll: boolean) {
		const file = await createRandomFile();
		const disposables: vscode.Disposable[] = [];

		await revertAllDirty(); // needed for a clean state for `onDidSaveTextDocument` (#102365)

		const onDidSaveTextDocument = new Set<vscode.TextDocument>();

		disposables.push(vscode.workspace.onDidSaveTextDocument(e => {
			onDidSaveTextDocument.add(e);
		}));

		const doc = await vscode.workspace.openTextDocument(file);
		await vscode.window.showTextDocument(doc);

		if (saveAll) {
			const edit = new vscode.WorkspaceEdit();
			edit.insert(doc.uri, new vscode.Position(0, 0), 'Hello World');

			await vscode.workspace.applyEdit(edit);
			assert.ok(doc.isDirty);

			await vscode.workspace.saveAll(false); // requires dirty documents
		} else {
			const res = await vscode.workspace.save(doc.uri); // enforces to save even when not dirty
			assert.ok(res?.toString() === doc.uri.toString());
		}

		assert.ok(onDidSaveTextDocument);
		assert.ok(Array.from(onDidSaveTextDocument).find(e => e.uri.toString() === file.toString()), 'did Save: ' + file.toString());
		disposeAll(disposables);
		return deleteFile(file);
	}

	test('encoding: text document encodings', async () => {
		const uri1 = await createRandomFile();
		const uri2 = await createRandomFile(new Uint8Array([0xEF, 0xBB, 0xBF]) /* UTF-8 with BOM */);
		const uri3 = await createRandomFile(new Uint8Array([0xFF, 0xFE]) /* UTF-16 LE BOM */);
		const uri4 = await createRandomFile(new Uint8Array([0xFE, 0xFF]) /* UTF-16 BE BOM */);

		const doc1 = await vscode.workspace.openTextDocument(uri1);
		assert.strictEqual(doc1.encoding, 'utf8');

		const doc2 = await vscode.workspace.openTextDocument(uri2);
		assert.strictEqual(doc2.encoding, 'utf8bom');

		const doc3 = await vscode.workspace.openTextDocument(uri3);
		assert.strictEqual(doc3.encoding, 'utf16le');

		const doc4 = await vscode.workspace.openTextDocument(uri4);
		assert.strictEqual(doc4.encoding, 'utf16be');

		const doc5 = await vscode.workspace.openTextDocument({ content: 'Hello World' });
		assert.strictEqual(doc5.encoding, 'utf8');
	});

	test('encoding: openTextDocument', async () => {
		const uri1 = await createRandomFile();

		let doc1 = await vscode.workspace.openTextDocument(uri1, { encoding: 'cp1252' });
		assert.strictEqual(doc1.encoding, 'cp1252');

		let listener: vscode.Disposable | undefined;
		const documentChangePromise = new Promise<void>(resolve => {
			listener = vscode.workspace.onDidChangeTextDocument(e => {
				if (e.document.uri.toString() === uri1.toString()) {
					resolve();
				}
			});
		});

		doc1 = await vscode.workspace.openTextDocument(uri1, { encoding: 'utf16le' });
		assert.strictEqual(doc1.encoding, 'utf16le');
		await documentChangePromise;

		const doc2 = await vscode.workspace.openTextDocument({ encoding: 'utf16be' });
		assert.strictEqual(doc2.encoding, 'utf16be');

		const doc3 = await vscode.workspace.openTextDocument({ content: 'Hello World', encoding: 'utf16le' });
		assert.strictEqual(doc3.encoding, 'utf16le');

		listener?.dispose();
	});

	test('encoding: openTextDocument - throws for dirty documents', async () => {
		const uri1 = await createRandomFile();

		const doc1 = await vscode.workspace.openTextDocument(uri1, { encoding: 'cp1252' });

		const edit = new vscode.WorkspaceEdit();
		edit.insert(doc1.uri, new vscode.Position(0, 0), 'Hello World');
		await vscode.workspace.applyEdit(edit);
		assert.strictEqual(doc1.isDirty, true);

		let err;
		try {
			await vscode.workspace.decode(new Uint8Array([0, 0, 0, 0]), { uri: doc1.uri });
		} catch (e) {
			err = e;
		}
		assert.ok(err);
	});

	test('encoding: openTextDocument - invalid encoding falls back to default', async () => {
		const uri1 = await createRandomFile();

		const doc1 = await vscode.workspace.openTextDocument(uri1, { encoding: 'foobar123' });
		assert.strictEqual(doc1.encoding, 'utf8');
	});

	test('encoding: openTextDocument - multiple requests with different encoding work', async () => {
		const uri1 = await createRandomFile();

		const doc1P = vscode.workspace.openTextDocument(uri1);
		const doc2P = vscode.workspace.openTextDocument(uri1, { encoding: 'cp1252' });

		const [doc1, doc2] = await Promise.all([doc1P, doc2P]);

		assert.strictEqual(doc1.encoding, 'cp1252');
		assert.strictEqual(doc2.encoding, 'cp1252');
	});

	test('encoding: openTextDocument - can change the encoding of an existing untitled document', async () => {
		const doc = await vscode.workspace.openTextDocument({ content: 'Hello World' });
		assert.strictEqual(doc.encoding, 'utf8');

		await vscode.workspace.openTextDocument(doc.uri, { encoding: 'windows1252' });
		assert.strictEqual(doc.encoding, 'windows1252');
	});

	test('encoding: decode', async function () {
		const uri = root.with({ path: posix.join(root.path, 'file.txt') });

		// without setting
		assert.strictEqual(await vscode.workspace.decode(Buffer.from('Hello World'), { uri }), 'Hello World');
		assert.strictEqual(await vscode.workspace.decode(Buffer.from('Hellö Wörld'), { uri }), 'Hellö Wörld');
		assert.strictEqual(await vscode.workspace.decode(new Uint8Array([0xEF, 0xBB, 0xBF, 72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]), { uri }), 'Hello World'); // UTF-8 with BOM
		assert.strictEqual(await vscode.workspace.decode(new Uint8Array([0xFE, 0xFF, 0, 72, 0, 101, 0, 108, 0, 108, 0, 111, 0, 32, 0, 87, 0, 111, 0, 114, 0, 108, 0, 100]), { uri }), 'Hello World'); // UTF-16 BE with BOM
		assert.strictEqual(await vscode.workspace.decode(new Uint8Array([0xFF, 0xFE, 72, 0, 101, 0, 108, 0, 108, 0, 111, 0, 32, 0, 87, 0, 111, 0, 114, 0, 108, 0, 100, 0]), { uri }), 'Hello World'); // UTF-16 LE with BOM
		assert.strictEqual(await vscode.workspace.decode(new Uint8Array([0, 72, 0, 101, 0, 108, 0, 108, 0, 111, 0, 32, 0, 87, 0, 111, 0, 114, 0, 108, 0, 100]), { uri }), 'Hello World');
		assert.strictEqual(await vscode.workspace.decode(new Uint8Array([72, 0, 101, 0, 108, 0, 108, 0, 111, 0, 32, 0, 87, 0, 111, 0, 114, 0, 108, 0, 100, 0]), { uri }), 'Hello World');

		// with auto-guess encoding
		try {
			await vscode.workspace.getConfiguration('files', uri).update('autoGuessEncoding', true, vscode.ConfigurationTarget.Global);
			assert.strictEqual(await vscode.workspace.decode(new Uint8Array([72, 101, 108, 108, 0xF6, 32, 87, 0xF6, 114, 108, 100]), { uri }), 'Hellö Wörld');
		} finally {
			await vscode.workspace.getConfiguration('files', uri).update('autoGuessEncoding', false, vscode.ConfigurationTarget.Global);
		}

		// with encoding setting
		try {
			await vscode.workspace.getConfiguration('files', uri).update('encoding', 'windows1252', vscode.ConfigurationTarget.Global);
			assert.strictEqual(await vscode.workspace.decode(new Uint8Array([72, 101, 108, 108, 0xF6, 32, 87, 0xF6, 114, 108, 100]), { uri }), 'Hellö Wörld');
		} finally {
			await vscode.workspace.getConfiguration('files', uri).update('encoding', 'utf8', vscode.ConfigurationTarget.Global);
		}

		// with encoding provided
		assert.strictEqual(await vscode.workspace.decode(new Uint8Array([72, 101, 108, 108, 0xF6, 32, 87, 0xF6, 114, 108, 100]), { encoding: 'windows1252' }), 'Hellö Wörld');
		assert.strictEqual(await vscode.workspace.decode(Buffer.from('Hello World'), { encoding: 'foobar123' }), 'Hello World');

		// binary
		let err;
		try {
			await vscode.workspace.decode(new Uint8Array([0, 0, 0, 0]), { uri });
		} catch (e) {
			err = e;
		}
		assert.ok(err);
	});

	test('encoding: encode', async function () {
		const uri = root.with({ path: posix.join(root.path, 'file.txt') });

		// without setting
		assert.strictEqual((await vscode.workspace.encode('Hello World', { uri })).toString(), 'Hello World');

		// with encoding setting
		try {
			await vscode.workspace.getConfiguration('files', uri).update('encoding', 'utf8bom', vscode.ConfigurationTarget.Global);
			assert.ok(equalsUint8Array(await vscode.workspace.encode('Hello World', { uri }), new Uint8Array([0xEF, 0xBB, 0xBF, 72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100])));

			await vscode.workspace.getConfiguration('files', uri).update('encoding', 'utf16le', vscode.ConfigurationTarget.Global);
			assert.ok(equalsUint8Array(await vscode.workspace.encode('Hello World', { uri }), new Uint8Array([0xFF, 0xFE, 72, 0, 101, 0, 108, 0, 108, 0, 111, 0, 32, 0, 87, 0, 111, 0, 114, 0, 108, 0, 100, 0])));

			await vscode.workspace.getConfiguration('files', uri).update('encoding', 'utf16be', vscode.ConfigurationTarget.Global);
			assert.ok(equalsUint8Array(await vscode.workspace.encode('Hello World', { uri }), new Uint8Array([0xFE, 0xFF, 0, 72, 0, 101, 0, 108, 0, 108, 0, 111, 0, 32, 0, 87, 0, 111, 0, 114, 0, 108, 0, 100])));

			await vscode.workspace.getConfiguration('files', uri).update('encoding', 'cp1252', vscode.ConfigurationTarget.Global);
			assert.ok(equalsUint8Array(await vscode.workspace.encode('Hellö Wörld', { uri }), new Uint8Array([72, 101, 108, 108, 0xF6, 32, 87, 0xF6, 114, 108, 100])));
		} finally {
			await vscode.workspace.getConfiguration('files', uri).update('encoding', 'utf8', vscode.ConfigurationTarget.Global);
		}

		// with encoding provided
		assert.ok(equalsUint8Array(await vscode.workspace.encode('Hello World', { encoding: 'utf8' }), new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100])));
		assert.ok(equalsUint8Array(await vscode.workspace.encode('Hello World', { encoding: 'utf8bom' }), new Uint8Array([0xEF, 0xBB, 0xBF, 72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100])));
		assert.ok(equalsUint8Array(await vscode.workspace.encode('Hello World', { encoding: 'utf16le' }), new Uint8Array([0xFF, 0xFE, 72, 0, 101, 0, 108, 0, 108, 0, 111, 0, 32, 0, 87, 0, 111, 0, 114, 0, 108, 0, 100, 0])));
		assert.ok(equalsUint8Array(await vscode.workspace.encode('Hello World', { encoding: 'utf16be' }), new Uint8Array([0xFE, 0xFF, 0, 72, 0, 101, 0, 108, 0, 108, 0, 111, 0, 32, 0, 87, 0, 111, 0, 114, 0, 108, 0, 100])));
		assert.ok(equalsUint8Array(await vscode.workspace.encode('Hellö Wörld', { encoding: 'cp1252' }), new Uint8Array([72, 101, 108, 108, 0xF6, 32, 87, 0xF6, 114, 108, 100])));
		assert.ok(equalsUint8Array(await vscode.workspace.encode('Hello World', { encoding: 'foobar123' }), new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100])));
	});

	function equalsUint8Array(a: Uint8Array, b: Uint8Array): boolean {
		if (a === b) {
			return true;
		}
		if (a.byteLength !== b.byteLength) {
			return false;
		}
		for (let i = 0; i < a.byteLength; i++) {
			if (a[i] !== b[i]) {
				return false;
			}
		}
		return true;
	}

	test('encoding: save text document with a different encoding', async () => {
		const originalText = 'Hellö\nWörld';
		const uri = await createRandomFile(originalText);

		let doc = await vscode.workspace.openTextDocument(uri);
		assert.strictEqual(doc.encoding, 'utf8');

		const text = doc.getText();
		assert.strictEqual(text, originalText);
		const buf = await vscode.workspace.encode(text, { encoding: 'windows1252' });
		await vscode.workspace.fs.writeFile(uri, buf);

		doc = await vscode.workspace.openTextDocument(uri, { encoding: 'windows1252' });
		assert.strictEqual(doc.encoding, 'windows1252');
		const updatedText = doc.getText();
		assert.strictEqual(updatedText, text);
	});

	test('encoding: utf8bom does not explode (https://github.com/microsoft/vscode/issues/242132)', async function () {
		const buffer = [0xEF, 0xBB, 0xBF, 72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100];
		const uri = await createRandomFile(new Uint8Array(buffer) /* UTF-8 with BOM */);

		let doc = await vscode.workspace.openTextDocument(uri);
		assert.strictEqual(doc.encoding, 'utf8bom');

		doc = await vscode.workspace.openTextDocument(uri, { encoding: 'utf8bom' });
		assert.strictEqual(doc.encoding, 'utf8bom');

		const decoded = await vscode.workspace.decode(new Uint8Array(buffer), { encoding: 'utf8bom' });
		assert.strictEqual(decoded, 'Hello World');

		const encoded = await vscode.workspace.encode('Hello World', { encoding: 'utf8bom' });
		assert.ok(equalsUint8Array(encoded, new Uint8Array(buffer)));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/workspace.watcher.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/workspace.watcher.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as vscode from 'vscode';
import { TestFS } from '../memfs';
import { assertNoRpc } from '../utils';

suite('vscode API - workspace-watcher', () => {

	interface IWatchRequest {
		uri: vscode.Uri;
		options: { recursive: boolean; excludes: string[] };
	}

	class WatcherTestFs extends TestFS {

		private _onDidWatch = new vscode.EventEmitter<IWatchRequest>();
		readonly onDidWatch = this._onDidWatch.event;

		override watch(uri: vscode.Uri, options: { recursive: boolean; excludes: string[] }): vscode.Disposable {
			this._onDidWatch.fire({ uri, options });

			return super.watch(uri, options);
		}
	}

	let fs: WatcherTestFs;
	let disposable: vscode.Disposable;

	function onDidWatchPromise() {
		const onDidWatchPromise = new Promise<IWatchRequest>(resolve => {
			fs.onDidWatch(request => resolve(request));
		});

		return onDidWatchPromise;
	}

	setup(() => {
		fs = new WatcherTestFs('watcherTest', false);
		disposable = vscode.workspace.registerFileSystemProvider('watcherTest', fs);
	});

	teardown(() => {
		disposable.dispose();
		assertNoRpc();
	});

	test('createFileSystemWatcher', async function () {

		// Non-recursive
		let watchUri = vscode.Uri.from({ scheme: 'watcherTest', path: '/somePath/folder' });
		const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(watchUri, '*.txt'));
		let request = await onDidWatchPromise();

		assert.strictEqual(request.uri.toString(), watchUri.toString());
		assert.strictEqual(request.options.recursive, false);

		watcher.dispose();

		// Recursive
		watchUri = vscode.Uri.from({ scheme: 'watcherTest', path: '/somePath/folder' });
		vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(watchUri, '**/*.txt'));
		request = await onDidWatchPromise();

		assert.strictEqual(request.uri.toString(), watchUri.toString());
		assert.strictEqual(request.options.recursive, true);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/workspace-tests/index.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/workspace-tests/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as testRunner from '../../../../test/integration/electron/testrunner';

const options: any = {
	ui: 'tdd',
	color: true,
	timeout: 60000
};

// These integration tests is being run in multiple environments (electron, web, remote)
// so we need to set the suite name based on the environment as the suite name is used
// for the test results file name
let suite = '';
if (process.env.VSCODE_BROWSER) {
	suite = `${process.env.VSCODE_BROWSER} Browser Integration Workspace Tests`;
} else if (process.env.REMOTE_VSCODE) {
	suite = 'Remote Integration Workspace Tests';
} else {
	suite = 'Integration Workspace Tests';
}

if (process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || process.env.GITHUB_WORKSPACE) {
	options.reporter = 'mocha-multi-reporters';
	options.reporterOptions = {
		reporterEnabled: 'spec, mocha-junit-reporter',
		mochaJunitReporterReporterOptions: {
			testsuitesTitle: `${suite} ${process.platform}`,
			mochaFile: path.join(
				process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || process.env.GITHUB_WORKSPACE || __dirname,
				`test-results/${process.platform}-${process.arch}-${suite.toLowerCase().replace(/[^\w]/g, '-')}-results.xml`)
		}
	};
}

testRunner.configure(options);

export = testRunner;
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/workspace-tests/workspace.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/workspace-tests/workspace.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { join } from 'path';
import * as vscode from 'vscode';
import { closeAllEditors, pathEquals } from '../utils';

suite('vscode API - workspace', () => {

	teardown(closeAllEditors);

	test('rootPath', () => {
		assert.ok(pathEquals(vscode.workspace.rootPath!, join(__dirname, '../../testWorkspace')));
	});

	test('workspaceFile', () => {
		assert.ok(pathEquals(vscode.workspace.workspaceFile!.fsPath, join(__dirname, '../../testworkspace.code-workspace')));
	});

	test('workspaceFolders', () => {
		assert.strictEqual(vscode.workspace.workspaceFolders!.length, 2);
		assert.ok(pathEquals(vscode.workspace.workspaceFolders![0].uri.fsPath, join(__dirname, '../../testWorkspace')));
		assert.ok(pathEquals(vscode.workspace.workspaceFolders![1].uri.fsPath, join(__dirname, '../../testWorkspace2')));
		assert.ok(pathEquals(vscode.workspace.workspaceFolders![1].name, 'Test Workspace 2'));
	});

	test('getWorkspaceFolder', () => {
		const folder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(join(__dirname, '../../testWorkspace2/far.js')));
		assert.ok(!!folder);

		if (folder) {
			assert.ok(pathEquals(folder.uri.fsPath, join(__dirname, '../../testWorkspace2')));
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/testWorkspace/10linefile.ts]---
Location: vscode-main/extensions/vscode-api-tests/testWorkspace/10linefile.ts

```typescript
function foo(): void {
    var a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/testWorkspace/30linefile.ts]---
Location: vscode-main/extensions/vscode-api-tests/testWorkspace/30linefile.ts

```typescript
function bar(): void {
    var a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
    a = 1;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/testWorkspace/bower.json]---
Location: vscode-main/extensions/vscode-api-tests/testWorkspace/bower.json

```json
{

	
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/testWorkspace/debug.js]---
Location: vscode-main/extensions/vscode-api-tests/testWorkspace/debug.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

let y = 0;
let z = 1;
hello();

function hello() {
	console.log('hello');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/testWorkspace/far.js]---
Location: vscode-main/extensions/vscode-api-tests/testWorkspace/far.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

function farboo() {
	return 42;
}
```

--------------------------------------------------------------------------------

````
