---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 462
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 462 of 552)

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

---[FILE: src/vs/workbench/contrib/terminal/browser/xterm/xtermTerminal.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/browser/xterm/xtermTerminal.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IBuffer, ITerminalOptions, ITheme, Terminal as RawXtermTerminal, LogLevel as XtermLogLevel, IMarker as IXtermMarker } from '@xterm/xterm';
import type { ISearchOptions, SearchAddon as SearchAddonType } from '@xterm/addon-search';
import type { Unicode11Addon as Unicode11AddonType } from '@xterm/addon-unicode11';
import type { ILigatureOptions, LigaturesAddon as LigaturesAddonType } from '@xterm/addon-ligatures';
import type { WebglAddon as WebglAddonType } from '@xterm/addon-webgl';
import type { SerializeAddon as SerializeAddonType } from '@xterm/addon-serialize';
import type { ImageAddon as ImageAddonType } from '@xterm/addon-image';
import type { ClipboardAddon as ClipboardAddonType, ClipboardSelectionType } from '@xterm/addon-clipboard';
import * as dom from '../../../../../base/browser/dom.js';
import { IXtermCore } from '../xterm-private.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { Disposable, DisposableStore, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { IEditorOptions } from '../../../../../editor/common/config/editorOptions.js';
import { IShellIntegration, ITerminalLogService, TerminalSettingId, type IDecorationAddon } from '../../../../../platform/terminal/common/terminal.js';
import { ITerminalFont, ITerminalConfiguration } from '../../common/terminal.js';
import { IMarkTracker, IInternalXtermTerminal, IXtermTerminal, IXtermColorProvider, XtermTerminalConstants, IXtermAttachToElementOptions, IDetachedXtermTerminal, ITerminalConfigurationService } from '../terminal.js';
import { LogLevel } from '../../../../../platform/log/common/log.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { MarkNavigationAddon, ScrollPosition } from './markNavigationAddon.js';
import { localize } from '../../../../../nls.js';
import { IColorTheme, IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { PANEL_BACKGROUND } from '../../../../common/theme.js';
import { TERMINAL_FOREGROUND_COLOR, TERMINAL_BACKGROUND_COLOR, TERMINAL_CURSOR_FOREGROUND_COLOR, TERMINAL_CURSOR_BACKGROUND_COLOR, ansiColorIdentifiers, TERMINAL_SELECTION_BACKGROUND_COLOR, TERMINAL_FIND_MATCH_BACKGROUND_COLOR, TERMINAL_FIND_MATCH_HIGHLIGHT_BACKGROUND_COLOR, TERMINAL_FIND_MATCH_BORDER_COLOR, TERMINAL_OVERVIEW_RULER_FIND_MATCH_FOREGROUND_COLOR, TERMINAL_FIND_MATCH_HIGHLIGHT_BORDER_COLOR, TERMINAL_OVERVIEW_RULER_CURSOR_FOREGROUND_COLOR, TERMINAL_SELECTION_FOREGROUND_COLOR, TERMINAL_INACTIVE_SELECTION_BACKGROUND_COLOR, TERMINAL_OVERVIEW_RULER_BORDER_COLOR } from '../../common/terminalColorRegistry.js';
import { ShellIntegrationAddon } from '../../../../../platform/terminal/common/xterm/shellIntegrationAddon.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { DecorationAddon } from './decorationAddon.js';
import { ITerminalCapabilityStore, ITerminalCommand, TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IContextKey, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { TerminalContextKeys } from '../../common/terminalContextKey.js';
import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService.js';
import { debounce } from '../../../../../base/common/decorators.js';
import { MouseWheelClassifier } from '../../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { IMouseWheelEvent, StandardWheelEvent } from '../../../../../base/browser/mouseEvent.js';
import { ILayoutService } from '../../../../../platform/layout/browser/layoutService.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { scrollbarSliderActiveBackground, scrollbarSliderBackground, scrollbarSliderHoverBackground } from '../../../../../platform/theme/common/colorRegistry.js';
import { XtermAddonImporter } from './xtermAddonImporter.js';
import { equals } from '../../../../../base/common/objects.js';
import type { IProgressState } from '@xterm/addon-progress';
import type { CommandDetectionCapability } from '../../../../../platform/terminal/common/capabilities/commandDetectionCapability.js';
import { URI } from '../../../../../base/common/uri.js';
import { assert } from '../../../../../base/common/assert.js';

const enum RenderConstants {
	SmoothScrollDuration = 125
}


function getFullBufferLineAsString(lineIndex: number, buffer: IBuffer): { lineData: string | undefined; lineIndex: number } {
	let line = buffer.getLine(lineIndex);
	if (!line) {
		return { lineData: undefined, lineIndex };
	}
	let lineData = line.translateToString(true);
	while (lineIndex > 0 && line.isWrapped) {
		line = buffer.getLine(--lineIndex);
		if (!line) {
			break;
		}
		lineData = line.translateToString(false) + lineData;
	}
	return { lineData, lineIndex };
}

export interface IXtermTerminalOptions {
	/** The columns to initialize the terminal with. */
	cols: number;
	/** The rows to initialize the terminal with. */
	rows: number;
	/** The color provider for the terminal. */
	xtermColorProvider: IXtermColorProvider;
	/** The capabilities of the terminal. */
	capabilities: ITerminalCapabilityStore;
	/** The shell integration nonce to verify data coming from SI is trustworthy. */
	shellIntegrationNonce?: string;
	/** Whether to disable shell integration telemetry reporting. */
	disableShellIntegrationReporting?: boolean;
	/** The object that imports xterm addons, set this to inject an importer in tests. */
	xtermAddonImporter?: XtermAddonImporter;
	/** Whether to disable the overview ruler. */
	disableOverviewRuler?: boolean;
}

/**
 * Wraps the xterm object with additional functionality. Interaction with the backing process is out
 * of the scope of this class.
 */
export class XtermTerminal extends Disposable implements IXtermTerminal, IDetachedXtermTerminal, IInternalXtermTerminal {
	/** The raw xterm.js instance */
	readonly raw: RawXtermTerminal;
	private _core: IXtermCore;
	private readonly _xtermAddonLoader: XtermAddonImporter;
	private readonly _xtermColorProvider: IXtermColorProvider;
	private readonly _capabilities: ITerminalCapabilityStore;

	private static _suggestedRendererType: 'dom' | undefined = undefined;
	private _attached?: { container: HTMLElement; options: IXtermAttachToElementOptions };
	private _isPhysicalMouseWheel = MouseWheelClassifier.INSTANCE.isPhysicalMouseWheel();
	private _lastInputEvent: string | undefined;
	get lastInputEvent(): string | undefined { return this._lastInputEvent; }
	private _progressState: IProgressState = { state: 0, value: 0 };
	get progressState(): IProgressState { return this._progressState; }

	// Always on addons
	private _markNavigationAddon: MarkNavigationAddon;
	private _shellIntegrationAddon: ShellIntegrationAddon;
	private _decorationAddon: DecorationAddon;

	// Always on dynamicly imported addons
	private _clipboardAddon?: ClipboardAddonType;

	// Optional addons
	private _searchAddon?: SearchAddonType;
	private _unicode11Addon?: Unicode11AddonType;
	private _webglAddon?: WebglAddonType;
	private _serializeAddon?: SerializeAddonType;
	private _imageAddon?: ImageAddonType;
	private readonly _ligaturesAddon: MutableDisposable<LigaturesAddonType> = this._register(new MutableDisposable());
	private readonly _ligaturesAddonConfig?: ILigatureOptions;

	private readonly _attachedDisposables = this._register(new DisposableStore());
	private readonly _anyTerminalFocusContextKey: IContextKey<boolean>;
	private readonly _anyFocusedTerminalHasSelection: IContextKey<boolean>;

	private _lastFindResult: { resultIndex: number; resultCount: number } | undefined;
	get findResult(): { resultIndex: number; resultCount: number } | undefined { return this._lastFindResult; }

	get isStdinDisabled(): boolean { return !!this.raw.options.disableStdin; }
	get isGpuAccelerated(): boolean { return !!this._webglAddon; }

	private readonly _onDidRequestRunCommand = this._register(new Emitter<{ command: ITerminalCommand; noNewLine?: boolean }>());
	readonly onDidRequestRunCommand = this._onDidRequestRunCommand.event;
	private readonly _onDidRequestCopyAsHtml = this._register(new Emitter<{ command: ITerminalCommand }>());
	readonly onDidRequestCopyAsHtml = this._onDidRequestCopyAsHtml.event;
	private readonly _onDidRequestRefreshDimensions = this._register(new Emitter<void>());
	readonly onDidRequestRefreshDimensions = this._onDidRequestRefreshDimensions.event;
	private readonly _onDidChangeFindResults = this._register(new Emitter<{ resultIndex: number; resultCount: number }>());
	readonly onDidChangeFindResults = this._onDidChangeFindResults.event;
	private readonly _onDidChangeSelection = this._register(new Emitter<void>());
	readonly onDidChangeSelection = this._onDidChangeSelection.event;
	private readonly _onDidChangeFocus = this._register(new Emitter<boolean>());
	readonly onDidChangeFocus = this._onDidChangeFocus.event;
	private readonly _onDidDispose = this._register(new Emitter<void>());
	readonly onDidDispose = this._onDidDispose.event;
	private readonly _onDidChangeProgress = this._register(new Emitter<IProgressState>());
	readonly onDidChangeProgress = this._onDidChangeProgress.event;

	get markTracker(): IMarkTracker { return this._markNavigationAddon; }
	get shellIntegration(): IShellIntegration { return this._shellIntegrationAddon; }
	get decorationAddon(): IDecorationAddon { return this._decorationAddon; }

	get textureAtlas(): Promise<ImageBitmap> | undefined {
		const canvas = this._webglAddon?.textureAtlas;
		if (!canvas) {
			return undefined;
		}
		return createImageBitmap(canvas);
	}

	public get isFocused() {
		if (!this.raw.element) {
			return false;
		}
		return dom.isAncestorOfActiveElement(this.raw.element);
	}

	/**
	 * @param xtermCtor The xterm.js constructor, this is passed in so it can be fetched lazily
	 * outside of this class such that {@link raw} is not nullable.
	 */
	constructor(
		resource: URI | undefined,
		xtermCtor: typeof RawXtermTerminal,
		options: IXtermTerminalOptions,
		private readonly _onDidExecuteText: Event<void> | undefined,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ITerminalLogService private readonly _logService: ITerminalLogService,
		@INotificationService private readonly _notificationService: INotificationService,
		@IThemeService private readonly _themeService: IThemeService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@ITerminalConfigurationService private readonly _terminalConfigurationService: ITerminalConfigurationService,
		@IClipboardService private readonly _clipboardService: IClipboardService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IAccessibilitySignalService private readonly _accessibilitySignalService: IAccessibilitySignalService,
		@ILayoutService layoutService: ILayoutService
	) {
		super();

		this._xtermAddonLoader = options.xtermAddonImporter ?? new XtermAddonImporter();
		this._xtermColorProvider = options.xtermColorProvider;
		this._capabilities = options.capabilities;

		const font = this._terminalConfigurationService.getFont(dom.getActiveWindow(), undefined, true);
		const config = this._terminalConfigurationService.config;
		const editorOptions = this._configurationService.getValue<IEditorOptions>('editor');

		this.raw = this._register(new xtermCtor({
			allowProposedApi: true,
			cols: options.cols,
			rows: options.rows,
			documentOverride: layoutService.mainContainer.ownerDocument,
			altClickMovesCursor: config.altClickMovesCursor && editorOptions.multiCursorModifier === 'alt',
			scrollback: config.scrollback,
			theme: this.getXtermTheme(),
			drawBoldTextInBrightColors: config.drawBoldTextInBrightColors,
			fontFamily: font.fontFamily,
			fontWeight: config.fontWeight,
			fontWeightBold: config.fontWeightBold,
			fontSize: font.fontSize,
			letterSpacing: font.letterSpacing,
			lineHeight: font.lineHeight,
			logLevel: vscodeToXtermLogLevel(this._logService.getLevel()),
			logger: this._logService,
			minimumContrastRatio: config.minimumContrastRatio,
			tabStopWidth: config.tabStopWidth,
			cursorBlink: config.cursorBlinking,
			cursorStyle: vscodeToXtermCursorStyle<'cursorStyle'>(config.cursorStyle),
			cursorInactiveStyle: vscodeToXtermCursorStyle(config.cursorStyleInactive),
			cursorWidth: config.cursorWidth,
			macOptionIsMeta: config.macOptionIsMeta,
			macOptionClickForcesSelection: config.macOptionClickForcesSelection,
			rightClickSelectsWord: config.rightClickBehavior === 'selectWord',
			fastScrollModifier: 'alt',
			fastScrollSensitivity: config.fastScrollSensitivity,
			scrollSensitivity: config.mouseWheelScrollSensitivity,
			scrollOnEraseInDisplay: true,
			wordSeparator: config.wordSeparators,
			overviewRuler: options.disableOverviewRuler ? { width: 0 } : {
				width: 14,
				showTopBorder: true,
			},
			ignoreBracketedPasteMode: config.ignoreBracketedPasteMode,
			rescaleOverlappingGlyphs: config.rescaleOverlappingGlyphs,
			windowOptions: {
				getWinSizePixels: true,
				getCellSizePixels: true,
				getWinSizeChars: true,
			},
		}));
		this._updateSmoothScrolling();
		interface ITerminalWithCore extends RawXtermTerminal {
			_core: IXtermCore;
		}
		this._core = (this.raw as ITerminalWithCore)._core as IXtermCore;

		this._register(this._configurationService.onDidChangeConfiguration(async e => {
			if (e.affectsConfiguration(TerminalSettingId.GpuAcceleration)) {
				XtermTerminal._suggestedRendererType = undefined;
			}
			if (e.affectsConfiguration('terminal.integrated') || e.affectsConfiguration('editor.fastScrollSensitivity') || e.affectsConfiguration('editor.mouseWheelScrollSensitivity') || e.affectsConfiguration('editor.multiCursorModifier')) {
				this.updateConfig();
			}
			if (e.affectsConfiguration(TerminalSettingId.UnicodeVersion)) {
				this._updateUnicodeVersion();
			}
			if (e.affectsConfiguration(TerminalSettingId.ShellIntegrationDecorationsEnabled)) {
				this._updateTheme();
			}
		}));

		this._register(this._themeService.onDidColorThemeChange(theme => this._updateTheme(theme)));
		this._register(this._logService.onDidChangeLogLevel(e => this.raw.options.logLevel = vscodeToXtermLogLevel(e)));

		// Refire events
		this._register(this.raw.onSelectionChange(() => {
			this._onDidChangeSelection.fire();
			if (this.isFocused) {
				this._anyFocusedTerminalHasSelection.set(this.raw.hasSelection());
			}
		}));
		this._register(this.raw.onData(e => this._lastInputEvent = e));

		// Load addons
		this._updateUnicodeVersion();
		this._markNavigationAddon = this._instantiationService.createInstance(MarkNavigationAddon, options.capabilities);
		this.raw.loadAddon(this._markNavigationAddon);
		this._decorationAddon = this._instantiationService.createInstance(DecorationAddon, resource, this._capabilities);
		this._register(this._decorationAddon.onDidRequestRunCommand(e => this._onDidRequestRunCommand.fire(e)));
		this._register(this._decorationAddon.onDidRequestCopyAsHtml(e => this._onDidRequestCopyAsHtml.fire(e)));
		this.raw.loadAddon(this._decorationAddon);
		this._shellIntegrationAddon = new ShellIntegrationAddon(options.shellIntegrationNonce ?? '', options.disableShellIntegrationReporting, this._onDidExecuteText, this._telemetryService, this._logService);
		this.raw.loadAddon(this._shellIntegrationAddon);
		this._xtermAddonLoader.importAddon('clipboard').then(ClipboardAddon => {
			if (this._store.isDisposed) {
				return;
			}
			this._clipboardAddon = this._instantiationService.createInstance(ClipboardAddon, undefined, {
				async readText(type: ClipboardSelectionType): Promise<string> {
					return _clipboardService.readText(type === 'p' ? 'selection' : 'clipboard');
				},
				async writeText(type: ClipboardSelectionType, text: string): Promise<void> {
					return _clipboardService.writeText(text, type === 'p' ? 'selection' : 'clipboard');
				}
			});
			this.raw.loadAddon(this._clipboardAddon);
		});
		this._xtermAddonLoader.importAddon('progress').then(ProgressAddon => {
			if (this._store.isDisposed) {
				return;
			}
			const progressAddon = this._instantiationService.createInstance(ProgressAddon);
			this.raw.loadAddon(progressAddon);
			const updateProgress = () => {
				if (!equals(this._progressState, progressAddon.progress)) {
					this._progressState = progressAddon.progress;
					this._onDidChangeProgress.fire(this._progressState);
				}
			};
			this._register(progressAddon.onChange(() => updateProgress()));
			updateProgress();
			const commandDetection = this._capabilities.get(TerminalCapability.CommandDetection);
			if (commandDetection) {
				this._register(commandDetection.onCommandFinished(() => progressAddon.progress = { state: 0, value: 0 }));
			} else {
				const disposable = this._capabilities.onDidAddCapability(e => {
					if (e.id === TerminalCapability.CommandDetection) {
						this._register((e.capability as CommandDetectionCapability).onCommandFinished(() => progressAddon.progress = { state: 0, value: 0 }));
						this._store.delete(disposable);
					}
				});
				this._store.add(disposable);
			}
		});

		this._anyTerminalFocusContextKey = TerminalContextKeys.focusInAny.bindTo(contextKeyService);
		this._anyFocusedTerminalHasSelection = TerminalContextKeys.textSelectedInFocused.bindTo(contextKeyService);
	}

	*getBufferReverseIterator(): IterableIterator<string> {
		for (let i = this.raw.buffer.active.length - 1; i >= 0; i--) {
			const { lineData, lineIndex } = getFullBufferLineAsString(i, this.raw.buffer.active);
			if (lineData) {
				i = lineIndex;
				yield lineData;
			}
		}
	}

	getContentsAsText(startMarker?: IXtermMarker, endMarker?: IXtermMarker): string {
		const lines: string[] = [];
		const buffer = this.raw.buffer.active;
		if (startMarker?.line === -1) {
			throw new Error('Cannot get contents of a disposed startMarker');
		}
		if (endMarker?.line === -1) {
			throw new Error('Cannot get contents of a disposed endMarker');
		}
		const startLine = startMarker?.line ?? 0;
		const endLine = endMarker?.line ?? buffer.length - 1;
		for (let y = startLine; y <= endLine; y++) {
			lines.push(buffer.getLine(y)?.translateToString(true) ?? '');
		}
		return lines.join('\n');
	}

	async getContentsAsHtml(): Promise<string> {
		if (!this._serializeAddon) {
			const Addon = await this._xtermAddonLoader.importAddon('serialize');
			this._serializeAddon = new Addon();
			this.raw.loadAddon(this._serializeAddon);
		}

		return this._serializeAddon.serializeAsHTML();
	}

	async getCommandOutputAsHtml(command: ITerminalCommand, maxLines: number): Promise<{ text: string; truncated?: boolean }> {
		if (!this._serializeAddon) {
			const Addon = await this._xtermAddonLoader.importAddon('serialize');
			this._serializeAddon = new Addon();
			this.raw.loadAddon(this._serializeAddon);
		}
		let startLine: number;
		let startCol: number;
		if (command.executedMarker && command.executedMarker.line >= 0) {
			startLine = command.executedMarker.line;
			startCol = Math.max(command.executedX ?? 0, 0);
		} else {
			startLine = command.marker?.line !== undefined ? command.marker.line + 1 : 1;
			startCol = Math.max(command.startX ?? 0, 0);
		}

		let endLine = command.endMarker?.line !== undefined ? command.endMarker.line - 1 : this.raw.buffer.active.length - 1;
		if (endLine < startLine) {
			return { text: '', truncated: false };
		}
		// Trim empty lines from the end
		let emptyLinesFromEnd = 0;
		for (let i = endLine; i >= startLine; i--) {
			const line = this.raw.buffer.active.getLine(i);
			if (line && line.translateToString(true).trim() === '') {
				emptyLinesFromEnd++;
			} else {
				break;
			}
		}
		endLine = endLine - emptyLinesFromEnd;

		// Trim empty lines from the start
		let emptyLinesFromStart = 0;
		for (let i = startLine; i <= endLine; i++) {
			const line = this.raw.buffer.active.getLine(i);
			if (line && line.translateToString(true, i === startLine ? startCol : undefined).trim() === '') {
				if (i === startLine) {
					startCol = 0;
				}
				emptyLinesFromStart++;
			} else {
				break;
			}
		}
		startLine = startLine + emptyLinesFromStart;

		if (maxLines && endLine - startLine > maxLines) {
			startLine = endLine - maxLines;
			startCol = 0;
		}

		const bufferLine = this.raw.buffer.active.getLine(startLine);
		if (bufferLine) {
			startCol = Math.min(startCol, bufferLine.length);
		}

		const range = { startLine, endLine, startCol };
		const result = this._serializeAddon.serializeAsHTML({ range });
		return { text: result, truncated: (endLine - startLine) >= maxLines };
	}

	async getSelectionAsHtml(command?: ITerminalCommand): Promise<string> {
		if (!this._serializeAddon) {
			const Addon = await this._xtermAddonLoader.importAddon('serialize');
			this._serializeAddon = new Addon();
			this.raw.loadAddon(this._serializeAddon);
		}
		if (command) {
			const length = command.getOutput()?.length;
			const row = command.marker?.line;
			if (!length || !row) {
				throw new Error(`No row ${row} or output length ${length} for command ${command}`);
			}
			this.raw.select(0, row + 1, length - Math.floor(length / this.raw.cols));
		}
		const result = this._serializeAddon.serializeAsHTML({ onlySelection: true });
		if (command) {
			this.raw.clearSelection();
		}
		return result;
	}

	attachToElement(container: HTMLElement, partialOptions?: Partial<IXtermAttachToElementOptions>): HTMLElement {
		const options: IXtermAttachToElementOptions = { enableGpu: true, ...partialOptions };
		if (!this._attached) {
			this.raw.open(container);
		}

		// TODO: Move before open so the DOM renderer doesn't initialize
		if (options.enableGpu) {
			if (this._shouldLoadWebgl()) {
				this._enableWebglRenderer();
			}
		}

		if (!this.raw.element || !this.raw.textarea) {
			throw new Error('xterm elements not set after open');
		}

		const ad = this._attachedDisposables;
		ad.clear();
		ad.add(dom.addDisposableListener(this.raw.textarea, 'focus', () => this._setFocused(true)));
		ad.add(dom.addDisposableListener(this.raw.textarea, 'blur', () => this._setFocused(false)));
		ad.add(dom.addDisposableListener(this.raw.textarea, 'focusout', () => this._setFocused(false)));

		// Track wheel events in mouse wheel classifier and update smoothScrolling when it changes
		// as it must be disabled when a trackpad is used
		ad.add(dom.addDisposableListener(this.raw.element, dom.EventType.MOUSE_WHEEL, (e: IMouseWheelEvent) => {
			const classifier = MouseWheelClassifier.INSTANCE;
			classifier.acceptStandardWheelEvent(new StandardWheelEvent(e));
			const value = classifier.isPhysicalMouseWheel();
			if (value !== this._isPhysicalMouseWheel) {
				this._isPhysicalMouseWheel = value;
				this._updateSmoothScrolling();
			}
		}, { passive: true }));

		this._refreshLigaturesAddon();

		this._attached = { container, options };
		// Screen must be created at this point as xterm.open is called
		// eslint-disable-next-line no-restricted-syntax
		return this._attached?.container.querySelector('.xterm-screen')!;
	}

	private _setFocused(isFocused: boolean) {
		this._onDidChangeFocus.fire(isFocused);
		this._anyTerminalFocusContextKey.set(isFocused);
		this._anyFocusedTerminalHasSelection.set(isFocused && this.raw.hasSelection());
	}

	write(data: string | Uint8Array, callback?: () => void): void {
		this.raw.write(data, callback);
	}

	resize(columns: number, rows: number): void {
		this._logService.debug('resizing', columns, rows);
		this.raw.resize(columns, rows);
	}

	updateConfig(): void {
		const config = this._terminalConfigurationService.config;
		this.raw.options.altClickMovesCursor = config.altClickMovesCursor;
		this._setCursorBlink(config.cursorBlinking);
		this._setCursorStyle(config.cursorStyle);
		this._setCursorStyleInactive(config.cursorStyleInactive);
		this._setCursorWidth(config.cursorWidth);
		this.raw.options.scrollback = config.scrollback;
		this.raw.options.drawBoldTextInBrightColors = config.drawBoldTextInBrightColors;
		this.raw.options.minimumContrastRatio = config.minimumContrastRatio;
		this.raw.options.tabStopWidth = config.tabStopWidth;
		this.raw.options.fastScrollSensitivity = config.fastScrollSensitivity;
		this.raw.options.scrollSensitivity = config.mouseWheelScrollSensitivity;
		this.raw.options.macOptionIsMeta = config.macOptionIsMeta;
		const editorOptions = this._configurationService.getValue<IEditorOptions>('editor');
		this.raw.options.altClickMovesCursor = config.altClickMovesCursor && editorOptions.multiCursorModifier === 'alt';
		this.raw.options.macOptionClickForcesSelection = config.macOptionClickForcesSelection;
		this.raw.options.rightClickSelectsWord = config.rightClickBehavior === 'selectWord';
		this.raw.options.wordSeparator = config.wordSeparators;
		this.raw.options.customGlyphs = config.customGlyphs;
		this.raw.options.ignoreBracketedPasteMode = config.ignoreBracketedPasteMode;
		this.raw.options.rescaleOverlappingGlyphs = config.rescaleOverlappingGlyphs;

		this._updateSmoothScrolling();
		if (this._attached) {
			if (this._attached.options.enableGpu) {
				if (this._shouldLoadWebgl()) {
					this._enableWebglRenderer();
				} else {
					this._disposeOfWebglRenderer();
				}
			}
			this._refreshLigaturesAddon();
		}
	}

	private _updateSmoothScrolling() {
		this.raw.options.smoothScrollDuration = this._terminalConfigurationService.config.smoothScrolling && this._isPhysicalMouseWheel ? RenderConstants.SmoothScrollDuration : 0;
	}

	private _shouldLoadWebgl(): boolean {
		return (this._terminalConfigurationService.config.gpuAcceleration === 'auto' && XtermTerminal._suggestedRendererType === undefined) || this._terminalConfigurationService.config.gpuAcceleration === 'on';
	}

	forceRedraw() {
		this.raw.clearTextureAtlas();
	}

	clearDecorations(): void {
		this._decorationAddon?.clearDecorations();
	}

	forceRefresh() {
		this._core.viewport?._innerRefresh();
	}

	async findNext(term: string, searchOptions: ISearchOptions): Promise<boolean> {
		this._updateFindColors(searchOptions);
		return (await this._getSearchAddon()).findNext(term, searchOptions);
	}

	async findPrevious(term: string, searchOptions: ISearchOptions): Promise<boolean> {
		this._updateFindColors(searchOptions);
		return (await this._getSearchAddon()).findPrevious(term, searchOptions);
	}

	private _updateFindColors(searchOptions: ISearchOptions): void {
		const theme = this._themeService.getColorTheme();
		// Theme color names align with monaco/vscode whereas xterm.js has some different naming.
		// The mapping is as follows:
		// - findMatch -> activeMatch
		// - findMatchHighlight -> match
		const terminalBackground = theme.getColor(TERMINAL_BACKGROUND_COLOR) || theme.getColor(PANEL_BACKGROUND);
		const findMatchBackground = theme.getColor(TERMINAL_FIND_MATCH_BACKGROUND_COLOR);
		const findMatchBorder = theme.getColor(TERMINAL_FIND_MATCH_BORDER_COLOR);
		const findMatchOverviewRuler = theme.getColor(TERMINAL_OVERVIEW_RULER_CURSOR_FOREGROUND_COLOR);
		const findMatchHighlightBackground = theme.getColor(TERMINAL_FIND_MATCH_HIGHLIGHT_BACKGROUND_COLOR);
		const findMatchHighlightBorder = theme.getColor(TERMINAL_FIND_MATCH_HIGHLIGHT_BORDER_COLOR);
		const findMatchHighlightOverviewRuler = theme.getColor(TERMINAL_OVERVIEW_RULER_FIND_MATCH_FOREGROUND_COLOR);
		searchOptions.decorations = {
			activeMatchBackground: findMatchBackground?.toString(),
			activeMatchBorder: findMatchBorder?.toString() || 'transparent',
			activeMatchColorOverviewRuler: findMatchOverviewRuler?.toString() || 'transparent',
			// decoration bgs don't support the alpha channel so blend it with the regular bg
			matchBackground: terminalBackground ? findMatchHighlightBackground?.blend(terminalBackground).toString() : undefined,
			matchBorder: findMatchHighlightBorder?.toString() || 'transparent',
			matchOverviewRuler: findMatchHighlightOverviewRuler?.toString() || 'transparent'
		};
	}

	private _searchAddonPromise: Promise<SearchAddonType> | undefined;
	private _getSearchAddon(): Promise<SearchAddonType> {
		if (!this._searchAddonPromise) {
			this._searchAddonPromise = this._xtermAddonLoader.importAddon('search').then((AddonCtor) => {
				if (this._store.isDisposed) {
					return Promise.reject('Could not create search addon, terminal is disposed');
				}
				this._searchAddon = new AddonCtor({ highlightLimit: XtermTerminalConstants.SearchHighlightLimit });
				this.raw.loadAddon(this._searchAddon);
				this._searchAddon.onDidChangeResults((results: { resultIndex: number; resultCount: number }) => {
					this._lastFindResult = results;
					this._onDidChangeFindResults.fire(results);
				});
				return this._searchAddon;
			});
		}
		return this._searchAddonPromise;
	}

	clearSearchDecorations(): void {
		this._searchAddon?.clearDecorations();
	}

	clearActiveSearchDecoration(): void {
		this._searchAddon?.clearActiveDecoration();
	}

	getFont(): ITerminalFont {
		return this._terminalConfigurationService.getFont(dom.getWindow(this.raw.element), this._core);
	}

	getLongestViewportWrappedLineLength(): number {
		let maxLineLength = 0;
		for (let i = this.raw.buffer.active.length - 1; i >= this.raw.buffer.active.viewportY; i--) {
			const lineInfo = this._getWrappedLineCount(i, this.raw.buffer.active);
			maxLineLength = Math.max(maxLineLength, ((lineInfo.lineCount * this.raw.cols) - lineInfo.endSpaces) || 0);
			i = lineInfo.currentIndex;
		}
		return maxLineLength;
	}

	private _getWrappedLineCount(index: number, buffer: IBuffer): { lineCount: number; currentIndex: number; endSpaces: number } {
		let line = buffer.getLine(index);
		if (!line) {
			throw new Error('Could not get line');
		}
		let currentIndex = index;
		let endSpaces = 0;
		// line.length may exceed cols as it doesn't necessarily trim the backing array on resize
		for (let i = Math.min(line.length, this.raw.cols) - 1; i >= 0; i--) {
			if (!line?.getCell(i)?.getChars()) {
				endSpaces++;
			} else {
				break;
			}
		}
		while (line?.isWrapped && currentIndex > 0) {
			currentIndex--;
			line = buffer.getLine(currentIndex);
		}
		return { lineCount: index - currentIndex + 1, currentIndex, endSpaces };
	}

	scrollDownLine(): void {
		this.raw.scrollLines(1);
	}

	scrollDownPage(): void {
		this.raw.scrollPages(1);
	}

	scrollToBottom(): void {
		this.raw.scrollToBottom();
	}

	scrollUpLine(): void {
		this.raw.scrollLines(-1);
	}

	scrollUpPage(): void {
		this.raw.scrollPages(-1);
	}

	scrollToTop(): void {
		this.raw.scrollToTop();
	}

	scrollToLine(line: number, position: ScrollPosition = ScrollPosition.Top): void {
		this.markTracker.scrollToLine(line, position);
	}

	clearBuffer(): void {
		this.raw.clear();
		// xterm.js does not clear the first prompt, so trigger these to simulate
		// the prompt being written
		this._capabilities.get(TerminalCapability.CommandDetection)?.handlePromptStart();
		this._capabilities.get(TerminalCapability.CommandDetection)?.handleCommandStart();
		this._accessibilitySignalService.playSignal(AccessibilitySignal.clear);
	}

	hasSelection(): boolean {
		return this.raw.hasSelection();
	}

	clearSelection(): void {
		this.raw.clearSelection();
	}

	selectMarkedRange(fromMarkerId: string, toMarkerId: string, scrollIntoView = false) {
		const detectionCapability = this.shellIntegration.capabilities.get(TerminalCapability.BufferMarkDetection);
		if (!detectionCapability) {
			return;
		}

		const start = detectionCapability.getMark(fromMarkerId);
		const end = detectionCapability.getMark(toMarkerId);
		if (start === undefined || end === undefined) {
			return;
		}

		this.raw.selectLines(start.line, end.line);
		if (scrollIntoView) {
			this.raw.scrollToLine(start.line);
		}
	}

	selectAll(): void {
		this.raw.focus();
		this.raw.selectAll();
	}

	focus(): void {
		this.raw.focus();
	}

	async copySelection(asHtml?: boolean, command?: ITerminalCommand): Promise<void> {
		if (this.hasSelection() || (asHtml && command)) {
			if (asHtml) {
				const textAsHtml = await this.getSelectionAsHtml(command);
				function listener(e: ClipboardEvent) {
					if (e.clipboardData) {
						if (!e.clipboardData.types.includes('text/plain')) {
							e.clipboardData.setData('text/plain', command?.getOutput() ?? '');
						}
						e.clipboardData.setData('text/html', textAsHtml);
					}
					e.preventDefault();
				}
				const doc = dom.getDocument(this.raw.element);
				doc.addEventListener('copy', listener);
				doc.execCommand('copy');
				doc.removeEventListener('copy', listener);
			} else {
				await this._clipboardService.writeText(this.raw.getSelection());
			}
		} else {
			this._notificationService.warn(localize('terminal.integrated.copySelection.noSelection', 'The terminal has no selection to copy'));
		}
	}

	private _setCursorBlink(blink: boolean): void {
		if (this.raw.options.cursorBlink !== blink) {
			this.raw.options.cursorBlink = blink;
			this.raw.refresh(0, this.raw.rows - 1);
		}
	}

	private _setCursorStyle(style: ITerminalConfiguration['cursorStyle']): void {
		const mapped = vscodeToXtermCursorStyle<'cursorStyle'>(style);
		if (this.raw.options.cursorStyle !== mapped) {
			this.raw.options.cursorStyle = mapped;
		}
	}

	private _setCursorStyleInactive(style: ITerminalConfiguration['cursorStyleInactive']): void {
		const mapped = vscodeToXtermCursorStyle(style);
		if (this.raw.options.cursorInactiveStyle !== mapped) {
			this.raw.options.cursorInactiveStyle = mapped;
		}
	}

	private _setCursorWidth(width: number): void {
		if (this.raw.options.cursorWidth !== width) {
			this.raw.options.cursorWidth = width;
		}
	}

	private async _enableWebglRenderer(): Promise<void> {
		if (!this.raw.element || this._webglAddon) {
			return;
		}

		const Addon = await this._xtermAddonLoader.importAddon('webgl');
		this._webglAddon = new Addon();
		try {
			this.raw.loadAddon(this._webglAddon);
			this._logService.trace('Webgl was loaded');
			this._webglAddon.onContextLoss(() => {
				this._logService.info(`Webgl lost context, disposing of webgl renderer`);
				this._disposeOfWebglRenderer();
			});
			this._refreshImageAddon();
			// WebGL renderer cell dimensions differ from the DOM renderer, make sure the terminal
			// gets resized after the webgl addon is loaded
			this._onDidRequestRefreshDimensions.fire();
			// Uncomment to add the texture atlas to the DOM
			// setTimeout(() => {
			// 	if (this._webglAddon?.textureAtlas) {
			// 		document.body.appendChild(this._webglAddon?.textureAtlas);
			// 	}
			// }, 5000);
		} catch (e) {
			this._logService.warn(`Webgl could not be loaded. Falling back to the DOM renderer`, e);
			XtermTerminal._suggestedRendererType = 'dom';
			this._disposeOfWebglRenderer();
		}
	}

	@debounce(100)
	private async _refreshLigaturesAddon(): Promise<void> {
		if (!this.raw.element) {
			return;
		}
		const ligaturesConfig = this._terminalConfigurationService.config.fontLigatures;
		let shouldRecreateWebglRenderer = false;
		if (ligaturesConfig?.enabled) {
			if (this._ligaturesAddon.value && !equals(ligaturesConfig, this._ligaturesAddonConfig)) {
				this._ligaturesAddon.clear();
			}
			if (!this._ligaturesAddon.value) {
				const LigaturesAddon = await this._xtermAddonLoader.importAddon('ligatures');
				if (this._store.isDisposed) {
					return;
				}
				this._ligaturesAddon.value = this._instantiationService.createInstance(LigaturesAddon, {
					fontFeatureSettings: ligaturesConfig.featureSettings,
					fallbackLigatures: ligaturesConfig.fallbackLigatures,
				});
				this.raw.loadAddon(this._ligaturesAddon.value);
				shouldRecreateWebglRenderer = true;
			}
		} else {
			if (!this._ligaturesAddon.value) {
				return;
			}
			this._ligaturesAddon.clear();
			shouldRecreateWebglRenderer = true;
		}

		if (shouldRecreateWebglRenderer && this._webglAddon) {
			// Re-create the webgl addon when ligatures state changes to so the texture atlas picks up
			// styles from the DOM.
			this._disposeOfWebglRenderer();
			await this._enableWebglRenderer();
		}
	}

	@debounce(100)
	private async _refreshImageAddon(): Promise<void> {
		// Only allow the image addon when webgl is being used to avoid possible GPU issues
		if (this._terminalConfigurationService.config.enableImages && this._webglAddon) {
			if (!this._imageAddon) {
				const AddonCtor = await this._xtermAddonLoader.importAddon('image');
				this._imageAddon = new AddonCtor();
				this.raw.loadAddon(this._imageAddon);
			}
		} else {
			try {
				this._imageAddon?.dispose();
			} catch {
				// ignore
			}
			this._imageAddon = undefined;
		}
	}

	private _disposeOfWebglRenderer(): void {
		try {
			this._webglAddon?.dispose();
		} catch {
			// ignore
		}
		this._webglAddon = undefined;
		this._refreshImageAddon();
		// WebGL renderer cell dimensions differ from the DOM renderer, make sure the terminal
		// gets resized after the webgl addon is disposed
		this._onDidRequestRefreshDimensions.fire();
	}

	async getRangeAsVT(startMarker: IXtermMarker, endMarker?: IXtermMarker, skipLastLine?: boolean): Promise<string> {
		if (!this._serializeAddon) {
			const Addon = await this._xtermAddonLoader.importAddon('serialize');
			this._serializeAddon = new Addon();
			this.raw.loadAddon(this._serializeAddon);
		}

		assert(startMarker.line !== -1);
		let end = endMarker?.line ?? this.raw.buffer.active.length - 1;
		if (skipLastLine) {
			end = end - 1;
		}
		return this._serializeAddon.serialize({
			range: {
				start: startMarker.line,
				end: end
			}
		});
	}


	getXtermTheme(theme?: IColorTheme): ITheme {
		if (!theme) {
			theme = this._themeService.getColorTheme();
		}

		const config = this._terminalConfigurationService.config;
		const hideOverviewRuler = ['never', 'gutter'].includes(config.shellIntegration?.decorationsEnabled ?? '');

		const foregroundColor = theme.getColor(TERMINAL_FOREGROUND_COLOR);
		const backgroundColor = this._xtermColorProvider.getBackgroundColor(theme);
		const cursorColor = theme.getColor(TERMINAL_CURSOR_FOREGROUND_COLOR) || foregroundColor;
		const cursorAccentColor = theme.getColor(TERMINAL_CURSOR_BACKGROUND_COLOR) || backgroundColor;
		const selectionBackgroundColor = theme.getColor(TERMINAL_SELECTION_BACKGROUND_COLOR);
		const selectionInactiveBackgroundColor = theme.getColor(TERMINAL_INACTIVE_SELECTION_BACKGROUND_COLOR);
		const selectionForegroundColor = theme.getColor(TERMINAL_SELECTION_FOREGROUND_COLOR) || undefined;

		return {
			background: backgroundColor?.toString(),
			foreground: foregroundColor?.toString(),
			cursor: cursorColor?.toString(),
			cursorAccent: cursorAccentColor?.toString(),
			selectionBackground: selectionBackgroundColor?.toString(),
			selectionInactiveBackground: selectionInactiveBackgroundColor?.toString(),
			selectionForeground: selectionForegroundColor?.toString(),
			overviewRulerBorder: hideOverviewRuler ? '#0000' : theme.getColor(TERMINAL_OVERVIEW_RULER_BORDER_COLOR)?.toString(),
			scrollbarSliderActiveBackground: theme.getColor(scrollbarSliderActiveBackground)?.toString(),
			scrollbarSliderBackground: theme.getColor(scrollbarSliderBackground)?.toString(),
			scrollbarSliderHoverBackground: theme.getColor(scrollbarSliderHoverBackground)?.toString(),
			black: theme.getColor(ansiColorIdentifiers[0])?.toString(),
			red: theme.getColor(ansiColorIdentifiers[1])?.toString(),
			green: theme.getColor(ansiColorIdentifiers[2])?.toString(),
			yellow: theme.getColor(ansiColorIdentifiers[3])?.toString(),
			blue: theme.getColor(ansiColorIdentifiers[4])?.toString(),
			magenta: theme.getColor(ansiColorIdentifiers[5])?.toString(),
			cyan: theme.getColor(ansiColorIdentifiers[6])?.toString(),
			white: theme.getColor(ansiColorIdentifiers[7])?.toString(),
			brightBlack: theme.getColor(ansiColorIdentifiers[8])?.toString(),
			brightRed: theme.getColor(ansiColorIdentifiers[9])?.toString(),
			brightGreen: theme.getColor(ansiColorIdentifiers[10])?.toString(),
			brightYellow: theme.getColor(ansiColorIdentifiers[11])?.toString(),
			brightBlue: theme.getColor(ansiColorIdentifiers[12])?.toString(),
			brightMagenta: theme.getColor(ansiColorIdentifiers[13])?.toString(),
			brightCyan: theme.getColor(ansiColorIdentifiers[14])?.toString(),
			brightWhite: theme.getColor(ansiColorIdentifiers[15])?.toString()
		};
	}

	private _updateTheme(theme?: IColorTheme): void {
		this.raw.options.theme = this.getXtermTheme(theme);
	}

	refresh() {
		this._updateTheme();
		this._decorationAddon.refreshLayouts();
	}

	private async _updateUnicodeVersion(): Promise<void> {
		if (!this._unicode11Addon && this._terminalConfigurationService.config.unicodeVersion === '11') {
			const Addon = await this._xtermAddonLoader.importAddon('unicode11');
			this._unicode11Addon = new Addon();
			this.raw.loadAddon(this._unicode11Addon);
		}
		if (this.raw.unicode.activeVersion !== this._terminalConfigurationService.config.unicodeVersion) {
			this.raw.unicode.activeVersion = this._terminalConfigurationService.config.unicodeVersion;
		}
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	_writeText(data: string): void {
		this.raw.write(data);
	}

	override dispose(): void {
		this._anyTerminalFocusContextKey.reset();
		this._anyFocusedTerminalHasSelection.reset();
		this._onDidDispose.fire();
		super.dispose();
	}
}

export function getXtermScaledDimensions(w: Window, font: ITerminalFont, width: number, height: number): { rows: number; cols: number } | null {
	if (!font.charWidth || !font.charHeight) {
		return null;
	}

	// Because xterm.js converts from CSS pixels to actual pixels through
	// the use of canvas, window.devicePixelRatio needs to be used here in
	// order to be precise. font.charWidth/charHeight alone as insufficient
	// when window.devicePixelRatio changes.
	const scaledWidthAvailable = width * w.devicePixelRatio;

	const scaledCharWidth = font.charWidth * w.devicePixelRatio + font.letterSpacing;
	const cols = Math.max(Math.floor(scaledWidthAvailable / scaledCharWidth), 1);

	const scaledHeightAvailable = height * w.devicePixelRatio;
	const scaledCharHeight = Math.ceil(font.charHeight * w.devicePixelRatio);
	const scaledLineHeight = Math.floor(scaledCharHeight * font.lineHeight);
	const rows = Math.max(Math.floor(scaledHeightAvailable / scaledLineHeight), 1);

	return { rows, cols };
}

function vscodeToXtermLogLevel(logLevel: LogLevel): XtermLogLevel {
	switch (logLevel) {
		case LogLevel.Trace: return 'trace';
		case LogLevel.Debug: return 'debug';
		case LogLevel.Info: return 'info';
		case LogLevel.Warning: return 'warn';
		case LogLevel.Error: return 'error';
		default: return 'off';
	}
}

interface ICursorStyleVscodeToXtermMap {
	'cursorStyle': NonNullable<ITerminalOptions['cursorStyle']>;
	'cursorStyleInactive': NonNullable<ITerminalOptions['cursorInactiveStyle']>;
}
function vscodeToXtermCursorStyle<T extends 'cursorStyle' | 'cursorStyleInactive'>(style: ITerminalConfiguration[T]): ICursorStyleVscodeToXtermMap[T] {
	// 'line' is used instead of bar in VS Code to be consistent with editor.cursorStyle
	if (style === 'line') {
		return 'bar';
	}
	return style as ICursorStyleVscodeToXtermMap[T];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/basePty.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/basePty.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { mark } from '../../../../base/common/performance.js';
import { isString } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import type { IPtyHostProcessReplayEvent, ISerializedCommandDetectionCapability } from '../../../../platform/terminal/common/capabilities/capabilities.js';
import { ProcessPropertyType, type IProcessDataEvent, type IProcessProperty, type IProcessPropertyMap, type IProcessReadyEvent, type ITerminalChildProcess } from '../../../../platform/terminal/common/terminal.js';

/**
 * Responsible for establishing and maintaining a connection with an existing terminal process
 * created on the local pty host.
 */
export abstract class BasePty extends Disposable implements Partial<ITerminalChildProcess> {
	protected readonly _properties: IProcessPropertyMap = {
		cwd: '',
		initialCwd: '',
		fixedDimensions: { cols: undefined, rows: undefined },
		title: '',
		shellType: undefined,
		hasChildProcesses: true,
		resolvedShellLaunchConfig: {},
		overrideDimensions: undefined,
		failedShellIntegrationActivation: false,
		usedShellIntegrationInjection: undefined,
		shellIntegrationInjectionFailureReason: undefined,
	};
	protected readonly _lastDimensions: { cols: number; rows: number } = { cols: -1, rows: -1 };
	protected _inReplay = false;

	protected readonly _onProcessData = this._register(new Emitter<IProcessDataEvent | string>());
	readonly onProcessData = this._onProcessData.event;
	protected readonly _onProcessReplayComplete = this._register(new Emitter<void>());
	readonly onProcessReplayComplete = this._onProcessReplayComplete.event;
	protected readonly _onProcessReady = this._register(new Emitter<IProcessReadyEvent>());
	readonly onProcessReady = this._onProcessReady.event;
	protected readonly _onDidChangeProperty = this._register(new Emitter<IProcessProperty>());
	readonly onDidChangeProperty = this._onDidChangeProperty.event;
	protected readonly _onProcessExit = this._register(new Emitter<number | undefined>());
	readonly onProcessExit = this._onProcessExit.event;
	protected readonly _onRestoreCommands = this._register(new Emitter<ISerializedCommandDetectionCapability>());
	readonly onRestoreCommands = this._onRestoreCommands.event;

	constructor(
		readonly id: number,
		readonly shouldPersist: boolean
	) {
		super();
	}

	async getInitialCwd(): Promise<string> {
		return this._properties.initialCwd;
	}

	async getCwd(): Promise<string> {
		return this._properties.cwd || this._properties.initialCwd;
	}

	handleData(e: string | IProcessDataEvent) {
		this._onProcessData.fire(e);
	}
	handleExit(e: number | undefined) {
		this._onProcessExit.fire(e);
	}
	handleReady(e: IProcessReadyEvent) {
		this._onProcessReady.fire(e);
	}
	handleDidChangeProperty({ type, value }: IProcessProperty) {
		switch (type) {
			case ProcessPropertyType.Cwd:
				this._properties.cwd = value as IProcessPropertyMap[ProcessPropertyType.Cwd];
				break;
			case ProcessPropertyType.InitialCwd:
				this._properties.initialCwd = value as IProcessPropertyMap[ProcessPropertyType.InitialCwd];
				break;
			case ProcessPropertyType.ResolvedShellLaunchConfig: {
				const cast = value as IProcessPropertyMap[ProcessPropertyType.ResolvedShellLaunchConfig];
				if (cast.cwd && !isString(cast.cwd)) {
					cast.cwd = URI.revive(cast.cwd);
				}
				break;
			}
		}
		this._onDidChangeProperty.fire({ type, value });
	}
	async handleReplay(e: IPtyHostProcessReplayEvent) {
		mark(`code/terminal/willHandleReplay/${this.id}`);
		try {
			this._inReplay = true;
			for (const innerEvent of e.events) {
				if (innerEvent.cols !== 0 || innerEvent.rows !== 0) {
					// never override with 0x0 as that is a marker for an unknown initial size
					this._onDidChangeProperty.fire({ type: ProcessPropertyType.OverrideDimensions, value: { cols: innerEvent.cols, rows: innerEvent.rows, forceExactSize: true } });
				}
				const e: IProcessDataEvent = { data: innerEvent.data, trackCommit: true };
				this._onProcessData.fire(e);
				await e.writePromise;
			}
		} finally {
			this._inReplay = false;
		}

		if (e.commands) {
			this._onRestoreCommands.fire(e.commands);
		}

		// remove size override
		this._onDidChangeProperty.fire({ type: ProcessPropertyType.OverrideDimensions, value: undefined });

		mark(`code/terminal/didHandleReplay/${this.id}`);
		this._onProcessReplayComplete.fire();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/environmentVariable.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/environmentVariable.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EnvironmentVariableService } from './environmentVariableService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IEnvironmentVariableService } from './environmentVariable.js';

registerSingleton(IEnvironmentVariableService, EnvironmentVariableService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/environmentVariable.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/environmentVariable.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { Event } from '../../../../base/common/event.js';
import { EnvironmentVariableScope, IEnvironmentVariableCollection, IMergedEnvironmentVariableCollection } from '../../../../platform/terminal/common/environmentVariable.js';
import { ITerminalStatus } from './terminal.js';

export const IEnvironmentVariableService = createDecorator<IEnvironmentVariableService>('environmentVariableService');

/**
 * Tracks and persists environment variable collections as defined by extensions.
 */
export interface IEnvironmentVariableService {
	readonly _serviceBrand: undefined;

	/**
	 * Gets a single collection constructed by merging all environment variable collections into
	 * one.
	 */
	readonly collections: ReadonlyMap<string, IEnvironmentVariableCollection>;

	/**
	 * Gets a single collection constructed by merging all environment variable collections into
	 * one.
	 */
	readonly mergedCollection: IMergedEnvironmentVariableCollection;

	/**
	 * An event that is fired when an extension's environment variable collection changes, the event
	 * provides the new merged collection.
	 */
	readonly onDidChangeCollections: Event<IMergedEnvironmentVariableCollection>;

	/**
	 * Sets an extension's environment variable collection.
	 */
	set(extensionIdentifier: string, collection: IEnvironmentVariableCollection): void;

	/**
	 * Deletes an extension's environment variable collection.
	 */
	delete(extensionIdentifier: string): void;
}

export interface IEnvironmentVariableCollectionWithPersistence extends IEnvironmentVariableCollection {
	readonly persistent: boolean;
}

export interface IEnvironmentVariableInfo {
	readonly requiresAction: boolean;
	getStatus(scope: EnvironmentVariableScope | undefined): ITerminalStatus;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/environmentVariableService.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/environmentVariableService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event, Emitter } from '../../../../base/common/event.js';
import { debounce, throttle } from '../../../../base/common/decorators.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { MergedEnvironmentVariableCollection } from '../../../../platform/terminal/common/environmentVariableCollection.js';
import { deserializeEnvironmentDescriptionMap, deserializeEnvironmentVariableCollection, serializeEnvironmentDescriptionMap, serializeEnvironmentVariableCollection } from '../../../../platform/terminal/common/environmentVariableShared.js';
import { IEnvironmentVariableCollectionWithPersistence, IEnvironmentVariableService } from './environmentVariable.js';
import { TerminalStorageKeys } from './terminalStorageKeys.js';
import { IMergedEnvironmentVariableCollection, ISerializableEnvironmentDescriptionMap, ISerializableEnvironmentVariableCollection } from '../../../../platform/terminal/common/environmentVariable.js';
import { Disposable } from '../../../../base/common/lifecycle.js';

interface ISerializableExtensionEnvironmentVariableCollection {
	extensionIdentifier: string;
	collection: ISerializableEnvironmentVariableCollection;
	description?: ISerializableEnvironmentDescriptionMap;
}

/**
 * Tracks and persists environment variable collections as defined by extensions.
 */
export class EnvironmentVariableService extends Disposable implements IEnvironmentVariableService {
	declare readonly _serviceBrand: undefined;

	collections: Map<string, IEnvironmentVariableCollectionWithPersistence> = new Map();
	mergedCollection: IMergedEnvironmentVariableCollection;

	private readonly _onDidChangeCollections = this._register(new Emitter<IMergedEnvironmentVariableCollection>());
	get onDidChangeCollections(): Event<IMergedEnvironmentVariableCollection> { return this._onDidChangeCollections.event; }

	constructor(
		@IExtensionService private readonly _extensionService: IExtensionService,
		@IStorageService private readonly _storageService: IStorageService
	) {
		super();

		this._storageService.remove(TerminalStorageKeys.DeprecatedEnvironmentVariableCollections, StorageScope.WORKSPACE);
		const serializedPersistedCollections = this._storageService.get(TerminalStorageKeys.EnvironmentVariableCollections, StorageScope.WORKSPACE);
		if (serializedPersistedCollections) {
			const collectionsJson: ISerializableExtensionEnvironmentVariableCollection[] = JSON.parse(serializedPersistedCollections);
			collectionsJson.forEach(c => this.collections.set(c.extensionIdentifier, {
				persistent: true,
				map: deserializeEnvironmentVariableCollection(c.collection),
				descriptionMap: deserializeEnvironmentDescriptionMap(c.description)
			}));

			// Asynchronously invalidate collections where extensions have been uninstalled, this is
			// async to avoid making all functions on the service synchronous and because extensions
			// being uninstalled is rare.
			this._invalidateExtensionCollections();
		}
		this.mergedCollection = this._resolveMergedCollection();

		// Listen for uninstalled/disabled extensions
		this._register(this._extensionService.onDidChangeExtensions(() => this._invalidateExtensionCollections()));
	}

	set(extensionIdentifier: string, collection: IEnvironmentVariableCollectionWithPersistence): void {
		this.collections.set(extensionIdentifier, collection);
		this._updateCollections();
	}

	delete(extensionIdentifier: string): void {
		this.collections.delete(extensionIdentifier);
		this._updateCollections();
	}

	private _updateCollections(): void {
		this._persistCollectionsEventually();
		this.mergedCollection = this._resolveMergedCollection();
		this._notifyCollectionUpdatesEventually();
	}

	@throttle(1000)
	private _persistCollectionsEventually(): void {
		this._persistCollections();
	}

	protected _persistCollections(): void {
		const collectionsJson: ISerializableExtensionEnvironmentVariableCollection[] = [];
		this.collections.forEach((collection, extensionIdentifier) => {
			if (collection.persistent) {
				collectionsJson.push({
					extensionIdentifier,
					collection: serializeEnvironmentVariableCollection(this.collections.get(extensionIdentifier)!.map),
					description: serializeEnvironmentDescriptionMap(collection.descriptionMap)
				});
			}
		});
		const stringifiedJson = JSON.stringify(collectionsJson);
		this._storageService.store(TerminalStorageKeys.EnvironmentVariableCollections, stringifiedJson, StorageScope.WORKSPACE, StorageTarget.MACHINE);
	}

	@debounce(1000)
	private _notifyCollectionUpdatesEventually(): void {
		this._notifyCollectionUpdates();
	}

	protected _notifyCollectionUpdates(): void {
		this._onDidChangeCollections.fire(this.mergedCollection);
	}

	private _resolveMergedCollection(): IMergedEnvironmentVariableCollection {
		return new MergedEnvironmentVariableCollection(this.collections);
	}

	private async _invalidateExtensionCollections(): Promise<void> {
		await this._extensionService.whenInstalledExtensionsRegistered();
		const registeredExtensions = this._extensionService.extensions;
		let changes = false;
		this.collections.forEach((_, extensionIdentifier) => {
			const isExtensionRegistered = registeredExtensions.some(r => r.identifier.value === extensionIdentifier);
			if (!isExtensionRegistered) {
				this.collections.delete(extensionIdentifier);
				changes = true;
			}
		});
		if (changes) {
			this._updateCollections();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/terminal.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/terminal.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { MarshalledId } from '../../../../base/common/marshallingIds.js';
import { IProcessEnvironment, isLinux, OperatingSystem } from '../../../../base/common/platform.js';
import Severity from '../../../../base/common/severity.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import * as nls from '../../../../nls.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ISerializedCommandDetectionCapability, ITerminalCapabilityStore } from '../../../../platform/terminal/common/capabilities/capabilities.js';
import { IMergedEnvironmentVariableCollection } from '../../../../platform/terminal/common/environmentVariable.js';
import { ICreateContributedTerminalProfileOptions, IExtensionTerminalProfile, IFixedTerminalDimensions, ITerminalLaunchResult, IProcessDataEvent, IProcessProperty, IProcessPropertyMap, IProcessReadyEvent, IProcessReadyWindowsPty, IShellLaunchConfig, ITerminalBackend, ITerminalContributions, ITerminalEnvironment, ITerminalLaunchError, ITerminalProfile, ITerminalProfileObject, ITerminalTabAction, ProcessPropertyType, TerminalIcon, TerminalLocationConfigValue, TitleEventSource } from '../../../../platform/terminal/common/terminal.js';
import { AccessibilityCommandId } from '../../accessibility/common/accessibilityCommands.js';
import { IEnvironmentVariableInfo } from './environmentVariable.js';
import { IExtensionPointDescriptor } from '../../../services/extensions/common/extensionsRegistry.js';
import { defaultTerminalContribCommandsToSkipShell } from '../terminalContribExports.js';
import type { SingleOrMany } from '../../../../base/common/types.js';

export const TERMINAL_VIEW_ID = 'terminal';

export const TERMINAL_CREATION_COMMANDS = ['workbench.action.terminal.toggleTerminal', 'workbench.action.terminal.new', 'workbench.action.togglePanel', 'workbench.action.terminal.focus'];

export const TERMINAL_CONFIG_SECTION = 'terminal.integrated';

export const DEFAULT_LETTER_SPACING = 0;
export const MINIMUM_LETTER_SPACING = -5;
// HACK: On Linux it's common for fonts to include an underline that is rendered lower than the
// bottom of the cell which causes it to be cut off due to `overflow:hidden` in the DOM renderer.
// See:
// - https://github.com/microsoft/vscode/issues/211933
// - https://github.com/xtermjs/xterm.js/issues/4067
export const DEFAULT_LINE_HEIGHT = isLinux ? 1.1 : 1;

export const MINIMUM_FONT_WEIGHT = 1;
export const MAXIMUM_FONT_WEIGHT = 1000;
export const DEFAULT_FONT_WEIGHT = 'normal';
export const DEFAULT_BOLD_FONT_WEIGHT = 'bold';
export const SUGGESTIONS_FONT_WEIGHT = ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

export const ITerminalProfileResolverService = createDecorator<ITerminalProfileResolverService>('terminalProfileResolverService');
export interface ITerminalProfileResolverService {
	readonly _serviceBrand: undefined;

	readonly defaultProfileName: string | undefined;

	/**
	 * Resolves the icon of a shell launch config if this will use the default profile
	 */
	resolveIcon(shellLaunchConfig: IShellLaunchConfig, os: OperatingSystem): void;
	resolveShellLaunchConfig(shellLaunchConfig: IShellLaunchConfig, options: IShellLaunchConfigResolveOptions): Promise<void>;
	getDefaultProfile(options: IShellLaunchConfigResolveOptions): Promise<ITerminalProfile>;
	getDefaultShell(options: IShellLaunchConfigResolveOptions): Promise<string>;
	getDefaultShellArgs(options: IShellLaunchConfigResolveOptions): Promise<SingleOrMany<string>>;
	getDefaultIcon(): TerminalIcon & ThemeIcon;
	getEnvironment(remoteAuthority: string | undefined): Promise<IProcessEnvironment>;
}

/*
 * When there were shell integration args injected
 * and createProcess returns an error, this exit code will be used.
 */
export const ShellIntegrationExitCode = 633;

export interface IRegisterContributedProfileArgs {
	extensionIdentifier: string; id: string; title: string; options: ICreateContributedTerminalProfileOptions;
}

export const ITerminalProfileService = createDecorator<ITerminalProfileService>('terminalProfileService');
export interface ITerminalProfileService {
	readonly _serviceBrand: undefined;
	readonly availableProfiles: ITerminalProfile[];
	readonly contributedProfiles: IExtensionTerminalProfile[];
	readonly profilesReady: Promise<void>;
	getPlatformKey(): Promise<string>;
	refreshAvailableProfiles(): void;
	getDefaultProfileName(): string | undefined;
	getDefaultProfile(os?: OperatingSystem): ITerminalProfile | undefined;
	readonly onDidChangeAvailableProfiles: Event<ITerminalProfile[]>;
	getContributedDefaultProfile(shellLaunchConfig: IShellLaunchConfig): Promise<IExtensionTerminalProfile | undefined>;
	registerContributedProfile(args: IRegisterContributedProfileArgs): Promise<void>;
	getContributedProfileProvider(extensionIdentifier: string, id: string): ITerminalProfileProvider | undefined;
	registerTerminalProfileProvider(extensionIdentifier: string, id: string, profileProvider: ITerminalProfileProvider): IDisposable;
}

export interface ITerminalProfileProvider {
	createContributedTerminalProfile(options: ICreateContributedTerminalProfileOptions): Promise<void>;
}

export interface IShellLaunchConfigResolveOptions {
	remoteAuthority: string | undefined;
	os: OperatingSystem;
	allowAutomationShell?: boolean;
}

export type FontWeight = 'normal' | 'bold' | number;

export interface ITerminalProfiles {
	linux: { [key: string]: ITerminalProfileObject };
	osx: { [key: string]: ITerminalProfileObject };
	windows: { [key: string]: ITerminalProfileObject };
}

export type ConfirmOnKill = 'never' | 'always' | 'editor' | 'panel';
export type ConfirmOnExit = 'never' | 'always' | 'hasChildProcesses';

export interface ICompleteTerminalConfiguration {
	'terminal.integrated.env.windows': ITerminalEnvironment;
	'terminal.integrated.env.osx': ITerminalEnvironment;
	'terminal.integrated.env.linux': ITerminalEnvironment;
	'terminal.integrated.cwd': string;
	'terminal.integrated.detectLocale': 'auto' | 'off' | 'on';
}

export interface ITerminalConfiguration {
	shell: {
		linux: string | null;
		osx: string | null;
		windows: string | null;
	};
	automationShell: {
		linux: string | null;
		osx: string | null;
		windows: string | null;
	};
	shellArgs: {
		linux: string[];
		osx: string[];
		windows: string[];
	};
	profiles: ITerminalProfiles;
	defaultProfile: {
		linux: string | null;
		osx: string | null;
		windows: string | null;
	};
	useWslProfiles: boolean;
	altClickMovesCursor: boolean;
	macOptionIsMeta: boolean;
	macOptionClickForcesSelection: boolean;
	gpuAcceleration: 'auto' | 'on' | 'off';
	rightClickBehavior: 'default' | 'copyPaste' | 'paste' | 'selectWord' | 'nothing';
	middleClickBehavior: 'default' | 'paste';
	cursorBlinking: boolean;
	cursorStyle: 'block' | 'underline' | 'line';
	cursorStyleInactive: 'outline' | 'block' | 'underline' | 'line' | 'none';
	cursorWidth: number;
	drawBoldTextInBrightColors: boolean;
	fastScrollSensitivity: number;
	fontFamily: string;
	fontWeight: FontWeight;
	fontWeightBold: FontWeight;
	minimumContrastRatio: number;
	mouseWheelScrollSensitivity: number;
	tabStopWidth: number;
	sendKeybindingsToShell: boolean;
	fontSize: number;
	letterSpacing: number;
	lineHeight: number;
	detectLocale: 'auto' | 'off' | 'on';
	scrollback: number;
	commandsToSkipShell: string[];
	allowChords: boolean;
	allowMnemonics: boolean;
	cwd: string;
	confirmOnExit: ConfirmOnExit;
	confirmOnKill: ConfirmOnKill;
	enableBell: boolean;
	env: {
		linux: { [key: string]: string };
		osx: { [key: string]: string };
		windows: { [key: string]: string };
	};
	environmentChangesRelaunch: boolean;
	showExitAlert: boolean;
	splitCwd: 'workspaceRoot' | 'initial' | 'inherited';
	windowsEnableConpty: boolean;
	windowsUseConptyDll?: boolean;
	wordSeparators: string;
	enableFileLinks: 'off' | 'on' | 'notRemote';
	allowedLinkSchemes: string[];
	unicodeVersion: '6' | '11';
	enablePersistentSessions: boolean;
	tabs: {
		enabled: boolean;
		hideCondition: 'never' | 'singleTerminal' | 'singleGroup';
		showActiveTerminal: 'always' | 'singleTerminal' | 'singleTerminalOrNarrow' | 'singleGroup' | 'never';
		location: 'left' | 'right';
		focusMode: 'singleClick' | 'doubleClick';
		title: string;
		description: string;
		separator: string;
	};
	bellDuration: number;
	defaultLocation: TerminalLocationConfigValue;
	customGlyphs: boolean;
	persistentSessionReviveProcess: 'onExit' | 'onExitAndWindowClose' | 'never';
	ignoreProcessNames: string[];
	shellIntegration?: {
		enabled: boolean;
		decorationsEnabled: 'both' | 'gutter' | 'overviewRuler' | 'never';
	};
	enableImages: boolean;
	smoothScrolling: boolean;
	ignoreBracketedPasteMode: boolean;
	rescaleOverlappingGlyphs: boolean;
	fontLigatures?: {
		enabled: boolean;
		featureSettings: string;
		fallbackLigatures: string[];
	};
	hideOnLastClosed: boolean;
}

export interface ITerminalFont {
	fontFamily: string;
	fontSize: number;
	letterSpacing: number;
	lineHeight: number;
	charWidth?: number;
	charHeight?: number;
}

export interface IRemoteTerminalAttachTarget {
	id: number;
	pid: number;
	title: string;
	titleSource: TitleEventSource;
	cwd: string;
	workspaceId: string;
	workspaceName: string;
	isOrphan: boolean;
	icon: URI | { light: URI; dark: URI } | { id: string; color?: { id: string } } | undefined;
	color: string | undefined;
	fixedDimensions: IFixedTerminalDimensions | undefined;
	shellIntegrationNonce: string;
	tabActions?: ITerminalTabAction[];
}

export interface IBeforeProcessDataEvent {
	/**
	 * The data of the event, this can be modified by the event listener to change what gets sent
	 * to the terminal.
	 */
	data: string;
}

export interface IDefaultShellAndArgsRequest {
	useAutomationShell: boolean;
	callback: (shell: string, args: string[] | string | undefined) => void;
}

/** Read-only process information that can apply to detached terminals. */
export interface ITerminalProcessInfo {
	readonly processState: ProcessState;
	readonly ptyProcessReady: Promise<void>;
	readonly shellProcessId: number | undefined;
	readonly remoteAuthority: string | undefined;
	readonly os: OperatingSystem | undefined;
	readonly userHome: string | undefined;
	readonly initialCwd: string;
	readonly environmentVariableInfo: IEnvironmentVariableInfo | undefined;
	readonly persistentProcessId: number | undefined;
	readonly shouldPersist: boolean;
	readonly hasWrittenData: boolean;
	readonly hasChildProcesses: boolean;
	readonly backend: ITerminalBackend | undefined;
	readonly capabilities: ITerminalCapabilityStore;
	readonly shellIntegrationNonce: string;
	readonly extEnvironmentVariableCollection: IMergedEnvironmentVariableCollection | undefined;
}

export const isTerminalProcessManager = (t: ITerminalProcessInfo | ITerminalProcessManager): t is ITerminalProcessManager => typeof (t as ITerminalProcessManager).write === 'function';

export interface ITerminalProcessManager extends IDisposable, ITerminalProcessInfo {
	readonly processTraits: IProcessReadyEvent | undefined;
	readonly processReadyTimestamp: number;

	readonly onPtyDisconnect: Event<void>;
	readonly onPtyReconnect: Event<void>;

	readonly onProcessReady: Event<IProcessReadyEvent>;
	readonly onBeforeProcessData: Event<IBeforeProcessDataEvent>;
	readonly onProcessData: Event<IProcessDataEvent>;
	readonly onProcessReplayComplete: Event<void>;
	readonly onEnvironmentVariableInfoChanged: Event<IEnvironmentVariableInfo>;
	readonly onDidChangeProperty: Event<IProcessProperty>;
	readonly onProcessExit: Event<number | undefined>;
	readonly onRestoreCommands: Event<ISerializedCommandDetectionCapability>;

	dispose(immediate?: boolean): void;
	detachFromProcess(forcePersist?: boolean): Promise<void>;
	createProcess(shellLaunchConfig: IShellLaunchConfig, cols: number, rows: number): Promise<ITerminalLaunchError | ITerminalLaunchResult | undefined>;
	relaunch(shellLaunchConfig: IShellLaunchConfig, cols: number, rows: number, reset: boolean): Promise<ITerminalLaunchError | ITerminalLaunchResult | undefined>;
	write(data: string): Promise<void>;
	sendSignal(signal: string): Promise<void>;
	setDimensions(cols: number, rows: number): Promise<void>;
	setDimensions(cols: number, rows: number, sync: false): Promise<void>;
	setDimensions(cols: number, rows: number, sync: true): void;
	clearBuffer(): Promise<void>;
	setUnicodeVersion(version: '6' | '11'): Promise<void>;
	setNextCommandId(commandLine: string, commandId: string): Promise<void>;
	acknowledgeDataEvent(charCount: number): void;
	processBinary(data: string): void;

	refreshProperty<T extends ProcessPropertyType>(type: T): Promise<IProcessPropertyMap[T]>;
	updateProperty<T extends ProcessPropertyType>(property: T, value: IProcessPropertyMap[T]): Promise<void>;
	getBackendOS(): Promise<OperatingSystem>;
	freePortKillProcess(port: string): Promise<void>;
}

export const enum ProcessState {
	// The process has not been initialized yet.
	Uninitialized = 1,
	// The process is currently launching, the process is marked as launching
	// for a short duration after being created and is helpful to indicate
	// whether the process died as a result of bad shell and args.
	Launching = 2,
	// The process is running normally.
	Running = 3,
	// The process was killed during launch, likely as a result of bad shell and
	// args.
	KilledDuringLaunch = 4,
	// The process was killed by the user (the event originated from VS Code).
	KilledByUser = 5,
	// The process was killed by itself, for example the shell crashed or `exit`
	// was run.
	KilledByProcess = 6
}

export interface ITerminalProcessExtHostProxy extends IDisposable {
	readonly instanceId: number;

	emitData(data: string): void;
	emitProcessProperty(property: IProcessProperty): void;
	emitReady(pid: number, cwd: string, windowsPty: IProcessReadyWindowsPty | undefined): void;
	emitExit(exitCode: number | undefined): void;

	readonly onInput: Event<string>;
	readonly onBinary: Event<string>;
	readonly onResize: Event<{ cols: number; rows: number }>;
	readonly onAcknowledgeDataEvent: Event<number>;
	readonly onShutdown: Event<boolean>;
	readonly onRequestInitialCwd: Event<void>;
	readonly onRequestCwd: Event<void>;
}

export interface IStartExtensionTerminalRequest {
	proxy: ITerminalProcessExtHostProxy;
	cols: number;
	rows: number;
	callback: (error: ITerminalLaunchError | undefined) => void;
}

export interface ITerminalStatus {
	/** An internal string ID used to identify the status. */
	id: string;
	/**
	 * The severity of the status, this defines both the color and how likely the status is to be
	 * the "primary status".
	 */
	severity: Severity;
	/**
	 * An icon representing the status, if this is not specified it will not show up on the terminal
	 * tab and will use the generic `info` icon when hovering.
	 */
	icon?: ThemeIcon;
	/**
	 * What to show for this status in the terminal's hover.
	 */
	tooltip?: string | undefined;
	/**
	 * What to show for this status in the terminal's hover when details are toggled.
	 */
	detailedTooltip?: string | undefined;
	/**
	 * Actions to expose on hover.
	 */
	hoverActions?: ITerminalStatusHoverAction[];
}

export interface ITerminalStatusHoverAction {
	label: string;
	commandId: string;
	run: () => void;
}

/**
 * Context for actions taken on terminal instances.
 */
export interface ISerializedTerminalInstanceContext {
	$mid: MarshalledId.TerminalContext;
	instanceId: number;
}

export const QUICK_LAUNCH_PROFILE_CHOICE = 'workbench.action.terminal.profile.choice';

export const enum TerminalCommandId {
	Toggle = 'workbench.action.terminal.toggleTerminal',
	Kill = 'workbench.action.terminal.kill',
	KillViewOrEditor = 'workbench.action.terminal.killViewOrEditor',
	KillEditor = 'workbench.action.terminal.killEditor',
	KillActiveTab = 'workbench.action.terminal.killActiveTab',
	KillAll = 'workbench.action.terminal.killAll',
	QuickKill = 'workbench.action.terminal.quickKill',
	ConfigureTerminalSettings = 'workbench.action.terminal.openSettings',
	ShellIntegrationLearnMore = 'workbench.action.terminal.learnMore',
	CopyLastCommand = 'workbench.action.terminal.copyLastCommand',
	CopyLastCommandOutput = 'workbench.action.terminal.copyLastCommandOutput',
	CopyLastCommandAndLastCommandOutput = 'workbench.action.terminal.copyLastCommandAndLastCommandOutput',
	CopyAndClearSelection = 'workbench.action.terminal.copyAndClearSelection',
	CopySelection = 'workbench.action.terminal.copySelection',
	CopySelectionAsHtml = 'workbench.action.terminal.copySelectionAsHtml',
	SelectAll = 'workbench.action.terminal.selectAll',
	DeleteWordLeft = 'workbench.action.terminal.deleteWordLeft',
	DeleteWordRight = 'workbench.action.terminal.deleteWordRight',
	DeleteToLineStart = 'workbench.action.terminal.deleteToLineStart',
	MoveToLineStart = 'workbench.action.terminal.moveToLineStart',
	MoveToLineEnd = 'workbench.action.terminal.moveToLineEnd',
	New = 'workbench.action.terminal.new',
	NewWithCwd = 'workbench.action.terminal.newWithCwd',
	NewLocal = 'workbench.action.terminal.newLocal',
	NewInActiveWorkspace = 'workbench.action.terminal.newInActiveWorkspace',
	NewWithProfile = 'workbench.action.terminal.newWithProfile',
	Split = 'workbench.action.terminal.split',
	SplitActiveTab = 'workbench.action.terminal.splitActiveTab',
	SplitInActiveWorkspace = 'workbench.action.terminal.splitInActiveWorkspace',
	Unsplit = 'workbench.action.terminal.unsplit',
	JoinActiveTab = 'workbench.action.terminal.joinActiveTab',
	Join = 'workbench.action.terminal.join',
	Relaunch = 'workbench.action.terminal.relaunch',
	FocusPreviousPane = 'workbench.action.terminal.focusPreviousPane',
	CreateTerminalEditor = 'workbench.action.createTerminalEditor',
	CreateTerminalEditorSameGroup = 'workbench.action.createTerminalEditorSameGroup',
	CreateTerminalEditorSide = 'workbench.action.createTerminalEditorSide',
	FocusTabs = 'workbench.action.terminal.focusTabs',
	FocusNextPane = 'workbench.action.terminal.focusNextPane',
	ResizePaneLeft = 'workbench.action.terminal.resizePaneLeft',
	ResizePaneRight = 'workbench.action.terminal.resizePaneRight',
	ResizePaneUp = 'workbench.action.terminal.resizePaneUp',
	SizeToContentWidth = 'workbench.action.terminal.sizeToContentWidth',
	SizeToContentWidthActiveTab = 'workbench.action.terminal.sizeToContentWidthActiveTab',
	ResizePaneDown = 'workbench.action.terminal.resizePaneDown',
	Focus = 'workbench.action.terminal.focus',
	FocusInstance = 'workbench.action.terminal.focusInstance',
	FocusNext = 'workbench.action.terminal.focusNext',
	FocusPrevious = 'workbench.action.terminal.focusPrevious',
	Paste = 'workbench.action.terminal.paste',
	PasteSelection = 'workbench.action.terminal.pasteSelection',
	SelectDefaultProfile = 'workbench.action.terminal.selectDefaultShell',
	RunSelectedText = 'workbench.action.terminal.runSelectedText',
	RunActiveFile = 'workbench.action.terminal.runActiveFile',
	SwitchTerminal = 'workbench.action.terminal.switchTerminal',
	ScrollDownLine = 'workbench.action.terminal.scrollDown',
	ScrollDownPage = 'workbench.action.terminal.scrollDownPage',
	ScrollToBottom = 'workbench.action.terminal.scrollToBottom',
	ScrollUpLine = 'workbench.action.terminal.scrollUp',
	ScrollUpPage = 'workbench.action.terminal.scrollUpPage',
	ScrollToTop = 'workbench.action.terminal.scrollToTop',
	Clear = 'workbench.action.terminal.clear',
	ClearSelection = 'workbench.action.terminal.clearSelection',
	ChangeIcon = 'workbench.action.terminal.changeIcon',
	ChangeIconActiveTab = 'workbench.action.terminal.changeIconActiveTab',
	ChangeColor = 'workbench.action.terminal.changeColor',
	ChangeColorActiveTab = 'workbench.action.terminal.changeColorActiveTab',
	Rename = 'workbench.action.terminal.rename',
	RenameActiveTab = 'workbench.action.terminal.renameActiveTab',
	RenameWithArgs = 'workbench.action.terminal.renameWithArg',
	ScrollToPreviousCommand = 'workbench.action.terminal.scrollToPreviousCommand',
	ScrollToNextCommand = 'workbench.action.terminal.scrollToNextCommand',
	SelectToPreviousCommand = 'workbench.action.terminal.selectToPreviousCommand',
	SelectToNextCommand = 'workbench.action.terminal.selectToNextCommand',
	SelectToPreviousLine = 'workbench.action.terminal.selectToPreviousLine',
	SelectToNextLine = 'workbench.action.terminal.selectToNextLine',
	SendSequence = 'workbench.action.terminal.sendSequence',
	SendSignal = 'workbench.action.terminal.sendSignal',
	AttachToSession = 'workbench.action.terminal.attachToSession',
	DetachSession = 'workbench.action.terminal.detachSession',
	MoveToEditor = 'workbench.action.terminal.moveToEditor',
	MoveToTerminalPanel = 'workbench.action.terminal.moveToTerminalPanel',
	MoveIntoNewWindow = 'workbench.action.terminal.moveIntoNewWindow',
	NewInNewWindow = 'workbench.action.terminal.newInNewWindow',
	SetDimensions = 'workbench.action.terminal.setDimensions',
	FocusHover = 'workbench.action.terminal.focusHover',
	ShowEnvironmentContributions = 'workbench.action.terminal.showEnvironmentContributions',
	StartVoice = 'workbench.action.terminal.startVoice',
	StopVoice = 'workbench.action.terminal.stopVoice',
	RevealCommand = 'workbench.action.terminal.revealCommand',
}

export const DEFAULT_COMMANDS_TO_SKIP_SHELL: string[] = [
	TerminalCommandId.ClearSelection,
	TerminalCommandId.Clear,
	TerminalCommandId.CopyAndClearSelection,
	TerminalCommandId.CopySelection,
	TerminalCommandId.CopySelectionAsHtml,
	TerminalCommandId.CopyLastCommand,
	TerminalCommandId.CopyLastCommandOutput,
	TerminalCommandId.CopyLastCommandAndLastCommandOutput,
	TerminalCommandId.DeleteToLineStart,
	TerminalCommandId.DeleteWordLeft,
	TerminalCommandId.DeleteWordRight,
	TerminalCommandId.FocusNextPane,
	TerminalCommandId.FocusNext,
	TerminalCommandId.FocusPreviousPane,
	TerminalCommandId.FocusPrevious,
	TerminalCommandId.Focus,
	TerminalCommandId.SizeToContentWidth,
	TerminalCommandId.Kill,
	TerminalCommandId.KillEditor,
	TerminalCommandId.MoveToEditor,
	TerminalCommandId.MoveToLineEnd,
	TerminalCommandId.MoveToLineStart,
	TerminalCommandId.MoveToTerminalPanel,
	TerminalCommandId.NewInActiveWorkspace,
	TerminalCommandId.New,
	TerminalCommandId.NewInNewWindow,
	TerminalCommandId.Paste,
	TerminalCommandId.PasteSelection,
	TerminalCommandId.ResizePaneDown,
	TerminalCommandId.ResizePaneLeft,
	TerminalCommandId.ResizePaneRight,
	TerminalCommandId.ResizePaneUp,
	TerminalCommandId.RunActiveFile,
	TerminalCommandId.RunSelectedText,
	TerminalCommandId.ScrollDownLine,
	TerminalCommandId.ScrollDownPage,
	TerminalCommandId.ScrollToBottom,
	TerminalCommandId.ScrollToNextCommand,
	TerminalCommandId.ScrollToPreviousCommand,
	TerminalCommandId.ScrollToTop,
	TerminalCommandId.ScrollUpLine,
	TerminalCommandId.ScrollUpPage,
	TerminalCommandId.SendSequence,
	TerminalCommandId.SelectAll,
	TerminalCommandId.SelectToNextCommand,
	TerminalCommandId.SelectToNextLine,
	TerminalCommandId.SelectToPreviousCommand,
	TerminalCommandId.SelectToPreviousLine,
	TerminalCommandId.SplitInActiveWorkspace,
	TerminalCommandId.Split,
	TerminalCommandId.Toggle,
	TerminalCommandId.FocusHover,
	AccessibilityCommandId.OpenAccessibilityHelp,
	TerminalCommandId.StopVoice,
	'workbench.action.tasks.rerunForActiveTerminal',
	'editor.action.toggleTabFocusMode',
	'notifications.hideList',
	'notifications.hideToasts',
	'workbench.action.closeQuickOpen',
	'workbench.action.quickOpen',
	'workbench.action.quickOpenPreviousEditor',
	'workbench.action.showCommands',
	'workbench.action.tasks.build',
	'workbench.action.tasks.restartTask',
	'workbench.action.tasks.runTask',
	'workbench.action.tasks.reRunTask',
	'workbench.action.tasks.showLog',
	'workbench.action.tasks.showTasks',
	'workbench.action.tasks.terminate',
	'workbench.action.tasks.test',
	'workbench.action.toggleFullScreen',
	'workbench.action.terminal.focusAtIndex1',
	'workbench.action.terminal.focusAtIndex2',
	'workbench.action.terminal.focusAtIndex3',
	'workbench.action.terminal.focusAtIndex4',
	'workbench.action.terminal.focusAtIndex5',
	'workbench.action.terminal.focusAtIndex6',
	'workbench.action.terminal.focusAtIndex7',
	'workbench.action.terminal.focusAtIndex8',
	'workbench.action.terminal.focusAtIndex9',
	'workbench.action.focusSecondEditorGroup',
	'workbench.action.focusThirdEditorGroup',
	'workbench.action.focusFourthEditorGroup',
	'workbench.action.focusFifthEditorGroup',
	'workbench.action.focusSixthEditorGroup',
	'workbench.action.focusSeventhEditorGroup',
	'workbench.action.focusEighthEditorGroup',
	'workbench.action.focusNextPart',
	'workbench.action.focusPreviousPart',
	'workbench.action.nextPanelView',
	'workbench.action.previousPanelView',
	'workbench.action.nextSideBarView',
	'workbench.action.previousSideBarView',
	'workbench.action.debug.disconnect',
	'workbench.action.debug.start',
	'workbench.action.debug.stop',
	'workbench.action.debug.run',
	'workbench.action.debug.restart',
	'workbench.action.debug.continue',
	'workbench.action.debug.pause',
	'workbench.action.debug.stepInto',
	'workbench.action.debug.stepOut',
	'workbench.action.debug.stepOver',
	'workbench.action.nextEditor',
	'workbench.action.previousEditor',
	'workbench.action.nextEditorInGroup',
	'workbench.action.previousEditorInGroup',
	'workbench.action.openNextRecentlyUsedEditor',
	'workbench.action.openPreviousRecentlyUsedEditor',
	'workbench.action.openNextRecentlyUsedEditorInGroup',
	'workbench.action.openPreviousRecentlyUsedEditorInGroup',
	'workbench.action.quickOpenPreviousRecentlyUsedEditor',
	'workbench.action.quickOpenLeastRecentlyUsedEditor',
	'workbench.action.quickOpenPreviousRecentlyUsedEditorInGroup',
	'workbench.action.quickOpenLeastRecentlyUsedEditorInGroup',
	'workbench.action.focusActiveEditorGroup',
	'workbench.action.focusFirstEditorGroup',
	'workbench.action.focusLastEditorGroup',
	'workbench.action.firstEditorInGroup',
	'workbench.action.lastEditorInGroup',
	'workbench.action.navigateUp',
	'workbench.action.navigateDown',
	'workbench.action.navigateRight',
	'workbench.action.navigateLeft',
	'workbench.action.togglePanel',
	'workbench.action.quickOpenView',
	'workbench.action.toggleMaximizedPanel',
	'notification.acceptPrimaryAction',
	'runCommands',
	'workbench.action.terminal.chat.start',
	'workbench.action.terminal.chat.close',
	'workbench.action.terminal.chat.discard',
	'workbench.action.terminal.chat.makeRequest',
	'workbench.action.terminal.chat.cancel',
	'workbench.action.terminal.chat.feedbackHelpful',
	'workbench.action.terminal.chat.feedbackUnhelpful',
	'workbench.action.terminal.chat.feedbackReportIssue',
	'workbench.action.terminal.chat.runCommand',
	'workbench.action.terminal.chat.insertCommand',
	'workbench.action.terminal.chat.viewInChat',
	...defaultTerminalContribCommandsToSkipShell,
];

export const terminalContributionsDescriptor: IExtensionPointDescriptor<ITerminalContributions> = {
	extensionPoint: 'terminal',
	defaultExtensionKind: ['workspace'],
	activationEventsGenerator: function* (contribs: readonly ITerminalContributions[]) {
		for (const contrib of contribs) {
			for (const profileContrib of (contrib.profiles ?? [])) {
				yield `onTerminalProfile:${profileContrib.id}`;
			}
		}
	},
	jsonSchema: {
		description: nls.localize('vscode.extension.contributes.terminal', 'Contributes terminal functionality.'),
		type: 'object',
		properties: {
			profiles: {
				type: 'array',
				description: nls.localize('vscode.extension.contributes.terminal.profiles', "Defines additional terminal profiles that the user can create."),
				items: {
					type: 'object',
					required: ['id', 'title'],
					defaultSnippets: [{
						body: {
							id: '$1',
							title: '$2'
						}
					}],
					properties: {
						id: {
							description: nls.localize('vscode.extension.contributes.terminal.profiles.id', "The ID of the terminal profile provider."),
							type: 'string',
						},
						title: {
							description: nls.localize('vscode.extension.contributes.terminal.profiles.title', "Title for this terminal profile."),
							type: 'string',
						},
						icon: {
							description: nls.localize('vscode.extension.contributes.terminal.types.icon', "A codicon, URI, or light and dark URIs to associate with this terminal type."),
							anyOf: [{
								type: 'string',
							},
							{
								type: 'object',
								properties: {
									light: {
										description: nls.localize('vscode.extension.contributes.terminal.types.icon.light', 'Icon path when a light theme is used'),
										type: 'string'
									},
									dark: {
										description: nls.localize('vscode.extension.contributes.terminal.types.icon.dark', 'Icon path when a dark theme is used'),
										type: 'string'
									}
								}
							}]
						},
					},
				},
			},
			completionProviders: {
				type: 'array',
				description: nls.localize('vscode.extension.contributes.terminal.completionProviders', "Defines terminal completion providers that will be registered when the extension activates."),
				items: {
					type: 'object',
					required: ['id'],
					defaultSnippets: [{
						body: {
							id: '$1',
							description: '$2'
						}
					}],
					properties: {
						description: {
							description: nls.localize('vscode.extension.contributes.terminal.completionProviders.description', "A description of what the completion provider does. This will be shown in the settings UI."),
							type: 'string',
						},
					},
				},
			},
		},
	},
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/terminalColorRegistry.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/terminalColorRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { editorOverviewRulerBorder } from '../../../../editor/common/core/editorColorRegistry.js';
import * as nls from '../../../../nls.js';

import { registerColor, ColorIdentifier, ColorDefaults, editorFindMatch, editorFindMatchHighlight, overviewRulerFindMatchForeground, editorSelectionBackground, transparent, editorHoverHighlight } from '../../../../platform/theme/common/colorRegistry.js';
import { EDITOR_DRAG_AND_DROP_BACKGROUND, PANEL_BORDER, TAB_ACTIVE_BORDER } from '../../../common/theme.js';

/**
 * The color identifiers for the terminal's ansi colors. The index in the array corresponds to the index
 * of the color in the terminal color table.
 */
export const ansiColorIdentifiers: ColorIdentifier[] = [];

export const TERMINAL_BACKGROUND_COLOR = registerColor('terminal.background', null, nls.localize('terminal.background', 'The background color of the terminal, this allows coloring the terminal differently to the panel.'));
export const TERMINAL_FOREGROUND_COLOR = registerColor('terminal.foreground', {
	light: '#333333',
	dark: '#CCCCCC',
	hcDark: '#FFFFFF',
	hcLight: '#292929'
}, nls.localize('terminal.foreground', 'The foreground color of the terminal.'));
export const TERMINAL_CURSOR_FOREGROUND_COLOR = registerColor('terminalCursor.foreground', null, nls.localize('terminalCursor.foreground', 'The foreground color of the terminal cursor.'));
export const TERMINAL_CURSOR_BACKGROUND_COLOR = registerColor('terminalCursor.background', null, nls.localize('terminalCursor.background', 'The background color of the terminal cursor. Allows customizing the color of a character overlapped by a block cursor.'));
export const TERMINAL_SELECTION_BACKGROUND_COLOR = registerColor('terminal.selectionBackground', editorSelectionBackground, nls.localize('terminal.selectionBackground', 'The selection background color of the terminal.'));
export const TERMINAL_INACTIVE_SELECTION_BACKGROUND_COLOR = registerColor('terminal.inactiveSelectionBackground', {
	light: transparent(TERMINAL_SELECTION_BACKGROUND_COLOR, 0.5),
	dark: transparent(TERMINAL_SELECTION_BACKGROUND_COLOR, 0.5),
	hcDark: transparent(TERMINAL_SELECTION_BACKGROUND_COLOR, 0.7),
	hcLight: transparent(TERMINAL_SELECTION_BACKGROUND_COLOR, 0.5)
}, nls.localize('terminal.inactiveSelectionBackground', 'The selection background color of the terminal when it does not have focus.'));
export const TERMINAL_SELECTION_FOREGROUND_COLOR = registerColor('terminal.selectionForeground', {
	light: null,
	dark: null,
	hcDark: '#000000',
	hcLight: '#ffffff'
}, nls.localize('terminal.selectionForeground', 'The selection foreground color of the terminal. When this is null the selection foreground will be retained and have the minimum contrast ratio feature applied.'));
export const TERMINAL_COMMAND_DECORATION_DEFAULT_BACKGROUND_COLOR = registerColor('terminalCommandDecoration.defaultBackground', {
	light: '#00000040',
	dark: '#ffffff40',
	hcDark: '#ffffff80',
	hcLight: '#00000040',
}, nls.localize('terminalCommandDecoration.defaultBackground', 'The default terminal command decoration background color.'));
export const TERMINAL_COMMAND_DECORATION_SUCCESS_BACKGROUND_COLOR = registerColor('terminalCommandDecoration.successBackground', {
	dark: '#1B81A8',
	light: '#2090D3',
	hcDark: '#1B81A8',
	hcLight: '#007100'
}, nls.localize('terminalCommandDecoration.successBackground', 'The terminal command decoration background color for successful commands.'));
export const TERMINAL_COMMAND_DECORATION_ERROR_BACKGROUND_COLOR = registerColor('terminalCommandDecoration.errorBackground', {
	dark: '#F14C4C',
	light: '#E51400',
	hcDark: '#F14C4C',
	hcLight: '#B5200D'
}, nls.localize('terminalCommandDecoration.errorBackground', 'The terminal command decoration background color for error commands.'));
export const TERMINAL_OVERVIEW_RULER_CURSOR_FOREGROUND_COLOR = registerColor('terminalOverviewRuler.cursorForeground', '#A0A0A0CC', nls.localize('terminalOverviewRuler.cursorForeground', 'The overview ruler cursor color.'));
export const TERMINAL_BORDER_COLOR = registerColor('terminal.border', PANEL_BORDER, nls.localize('terminal.border', 'The color of the border that separates split panes within the terminal. This defaults to panel.border.'));
export const TERMINAL_OVERVIEW_RULER_BORDER_COLOR = registerColor('terminalOverviewRuler.border', editorOverviewRulerBorder, nls.localize('terminalOverviewRuler.border', 'The overview ruler left-side border color.'));
export const TERMINAL_FIND_MATCH_BACKGROUND_COLOR = registerColor('terminal.findMatchBackground', {
	dark: editorFindMatch,
	light: editorFindMatch,
	// Use regular selection background in high contrast with a thick border
	hcDark: null,
	hcLight: '#0F4A85'
}, nls.localize('terminal.findMatchBackground', 'Color of the current search match in the terminal. The color must not be opaque so as not to hide underlying terminal content.'), true);
export const TERMINAL_HOVER_HIGHLIGHT_BACKGROUND_COLOR = registerColor('terminal.hoverHighlightBackground', transparent(editorHoverHighlight, 0.5), nls.localize('terminal.hoverHighlightBackground', 'Highlight below the word for which a hover is shown. The color must not be opaque so as not to hide underlying decorations.'));
export const TERMINAL_FIND_MATCH_BORDER_COLOR = registerColor('terminal.findMatchBorder', {
	dark: null,
	light: null,
	hcDark: '#f38518',
	hcLight: '#0F4A85'
}, nls.localize('terminal.findMatchBorder', 'Border color of the current search match in the terminal.'));
export const TERMINAL_FIND_MATCH_HIGHLIGHT_BACKGROUND_COLOR = registerColor('terminal.findMatchHighlightBackground', {
	dark: editorFindMatchHighlight,
	light: editorFindMatchHighlight,
	hcDark: null,
	hcLight: null
}, nls.localize('terminal.findMatchHighlightBackground', 'Color of the other search matches in the terminal. The color must not be opaque so as not to hide underlying terminal content.'), true);
export const TERMINAL_FIND_MATCH_HIGHLIGHT_BORDER_COLOR = registerColor('terminal.findMatchHighlightBorder', {
	dark: null,
	light: null,
	hcDark: '#f38518',
	hcLight: '#0F4A85'
}, nls.localize('terminal.findMatchHighlightBorder', 'Border color of the other search matches in the terminal.'));
export const TERMINAL_OVERVIEW_RULER_FIND_MATCH_FOREGROUND_COLOR = registerColor('terminalOverviewRuler.findMatchForeground', {
	dark: overviewRulerFindMatchForeground,
	light: overviewRulerFindMatchForeground,
	hcDark: '#f38518',
	hcLight: '#0F4A85'
}, nls.localize('terminalOverviewRuler.findMatchHighlightForeground', 'Overview ruler marker color for find matches in the terminal.'));
export const TERMINAL_DRAG_AND_DROP_BACKGROUND = registerColor('terminal.dropBackground', EDITOR_DRAG_AND_DROP_BACKGROUND, nls.localize('terminal.dragAndDropBackground', "Background color when dragging on top of terminals. The color should have transparency so that the terminal contents can still shine through."), true);
export const TERMINAL_TAB_ACTIVE_BORDER = registerColor('terminal.tab.activeBorder', TAB_ACTIVE_BORDER, nls.localize('terminal.tab.activeBorder', 'Border on the side of the terminal tab in the panel. This defaults to tab.activeBorder.'));
export const TERMINAL_INITIAL_HINT_FOREGROUND = registerColor('terminal.initialHintForeground', {
	dark: '#ffffff56',
	light: '#0007',
	hcDark: null,
	hcLight: null
}, nls.localize('terminalInitialHintForeground', 'Foreground color of the terminal initial hint.'));

export const ansiColorMap: { [key: string]: { index: number; defaults: ColorDefaults } } = {
	'terminal.ansiBlack': {
		index: 0,
		defaults: {
			light: '#000000',
			dark: '#000000',
			hcDark: '#000000',
			hcLight: '#292929'
		}
	},
	'terminal.ansiRed': {
		index: 1,
		defaults: {
			light: '#cd3131',
			dark: '#cd3131',
			hcDark: '#cd0000',
			hcLight: '#cd3131'
		}
	},
	'terminal.ansiGreen': {
		index: 2,
		defaults: {
			light: '#107C10',
			dark: '#0DBC79',
			hcDark: '#00cd00',
			hcLight: '#136C13'
		}
	},
	'terminal.ansiYellow': {
		index: 3,
		defaults: {
			light: '#949800',
			dark: '#e5e510',
			hcDark: '#cdcd00',
			hcLight: '#949800'
		}
	},
	'terminal.ansiBlue': {
		index: 4,
		defaults: {
			light: '#0451a5',
			dark: '#2472c8',
			hcDark: '#0000ee',
			hcLight: '#0451a5'
		}
	},
	'terminal.ansiMagenta': {
		index: 5,
		defaults: {
			light: '#bc05bc',
			dark: '#bc3fbc',
			hcDark: '#cd00cd',
			hcLight: '#bc05bc'
		}
	},
	'terminal.ansiCyan': {
		index: 6,
		defaults: {
			light: '#0598bc',
			dark: '#11a8cd',
			hcDark: '#00cdcd',
			hcLight: '#0598bc'
		}
	},
	'terminal.ansiWhite': {
		index: 7,
		defaults: {
			light: '#555555',
			dark: '#e5e5e5',
			hcDark: '#e5e5e5',
			hcLight: '#555555'
		}
	},
	'terminal.ansiBrightBlack': {
		index: 8,
		defaults: {
			light: '#666666',
			dark: '#666666',
			hcDark: '#7f7f7f',
			hcLight: '#666666'
		}
	},
	'terminal.ansiBrightRed': {
		index: 9,
		defaults: {
			light: '#cd3131',
			dark: '#f14c4c',
			hcDark: '#ff0000',
			hcLight: '#cd3131'
		}
	},
	'terminal.ansiBrightGreen': {
		index: 10,
		defaults: {
			light: '#14CE14',
			dark: '#23d18b',
			hcDark: '#00ff00',
			hcLight: '#00bc00'
		}
	},
	'terminal.ansiBrightYellow': {
		index: 11,
		defaults: {
			light: '#b5ba00',
			dark: '#f5f543',
			hcDark: '#ffff00',
			hcLight: '#b5ba00'
		}
	},
	'terminal.ansiBrightBlue': {
		index: 12,
		defaults: {
			light: '#0451a5',
			dark: '#3b8eea',
			hcDark: '#5c5cff',
			hcLight: '#0451a5'
		}
	},
	'terminal.ansiBrightMagenta': {
		index: 13,
		defaults: {
			light: '#bc05bc',
			dark: '#d670d6',
			hcDark: '#ff00ff',
			hcLight: '#bc05bc'
		}
	},
	'terminal.ansiBrightCyan': {
		index: 14,
		defaults: {
			light: '#0598bc',
			dark: '#29b8db',
			hcDark: '#00ffff',
			hcLight: '#0598bc'
		}
	},
	'terminal.ansiBrightWhite': {
		index: 15,
		defaults: {
			light: '#a5a5a5',
			dark: '#e5e5e5',
			hcDark: '#ffffff',
			hcLight: '#a5a5a5'
		}
	}
};

export function registerColors(): void {
	for (const id in ansiColorMap) {
		const entry = ansiColorMap[id];
		const colorName = id.substring(13);
		ansiColorIdentifiers[entry.index] = registerColor(id, entry.defaults, nls.localize('terminal.ansiColor', '\'{0}\' ANSI color in the terminal.', colorName));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/terminalConfiguration.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/terminalConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import type { IStringDictionary } from '../../../../base/common/collections.js';
import { IJSONSchemaSnippet } from '../../../../base/common/jsonSchema.js';
import { isMacintosh, isWindows } from '../../../../base/common/platform.js';
import { isString } from '../../../../base/common/types.js';
import { localize } from '../../../../nls.js';
import { ConfigurationScope, Extensions, IConfigurationRegistry, type IConfigurationPropertySchema } from '../../../../platform/configuration/common/configurationRegistry.js';
import product from '../../../../platform/product/common/product.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { TerminalLocationConfigValue, TerminalSettingId } from '../../../../platform/terminal/common/terminal.js';
import { terminalColorSchema, terminalIconSchema } from '../../../../platform/terminal/common/terminalPlatformConfiguration.js';
import { ConfigurationKeyValuePairs, IConfigurationMigrationRegistry, Extensions as WorkbenchExtensions } from '../../../common/configuration.js';
import { terminalContribConfiguration, TerminalContribSettingId } from '../terminalContribExports.js';
import { DEFAULT_COMMANDS_TO_SKIP_SHELL, DEFAULT_LETTER_SPACING, DEFAULT_LINE_HEIGHT, MAXIMUM_FONT_WEIGHT, MINIMUM_FONT_WEIGHT, SUGGESTIONS_FONT_WEIGHT } from './terminal.js';

const terminalDescriptors = '\n- ' + [
	'`\${cwd}`: ' + localize("cwd", "the terminal's current working directory."),
	'`\${cwdFolder}`: ' + localize('cwdFolder', "the terminal's current working directory, displayed for multi-root workspaces or in a single root workspace when the value differs from the initial working directory. On Windows, this will only be displayed when shell integration is enabled."),
	'`\${workspaceFolder}`: ' + localize('workspaceFolder', "the workspace in which the terminal was launched."),
	'`\${workspaceFolderName}`: ' + localize('workspaceFolderName', "the `name` of the workspace in which the terminal was launched."),
	'`\${local}`: ' + localize('local', "indicates a local terminal in a remote workspace."),
	'`\${process}`: ' + localize('process', "the name of the terminal process."),
	'`\${progress}`: ' + localize('progress', "the progress state as reported by the `OSC 9;4` sequence."),
	'`\${separator}`: ' + localize('separator', "a conditional separator {0} that only shows when it's surrounded by variables with values or static text.", '(` - `)'),
	'`\${sequence}`: ' + localize('sequence', "the name provided to the terminal by the process."),
	'`\${task}`: ' + localize('task', "indicates this terminal is associated with a task."),
	'`\${shellType}`: ' + localize('shellType', "the detected shell type."),
	'`\${shellCommand}`: ' + localize('shellCommand', "the command being executed according to shell integration. This also requires high confidence in the detected command line, which may not work in some prompt frameworks."),
	'`\${shellPromptInput}`: ' + localize('shellPromptInput', "the shell's full prompt input according to shell integration."),
].join('\n- '); // intentionally concatenated to not produce a string that is too long for translations

let terminalTitle = localize('terminalTitle', "Controls the terminal title. Variables are substituted based on the context:");
terminalTitle += terminalDescriptors;

let terminalDescription = localize('terminalDescription', "Controls the terminal description, which appears to the right of the title. Variables are substituted based on the context:");
terminalDescription += terminalDescriptors;

export const defaultTerminalFontSize = isMacintosh ? 12 : 14;

const terminalConfiguration: IStringDictionary<IConfigurationPropertySchema> = {
	[TerminalSettingId.SendKeybindingsToShell]: {
		markdownDescription: localize('terminal.integrated.sendKeybindingsToShell', "Dispatches most keybindings to the terminal instead of the workbench, overriding {0}, which can be used alternatively for fine tuning.", '`#terminal.integrated.commandsToSkipShell#`'),
		type: 'boolean',
		default: false
	},
	[TerminalSettingId.TabsDefaultColor]: {
		description: localize('terminal.integrated.tabs.defaultColor', "A theme color ID to associate with terminal icons by default."),
		...terminalColorSchema,
		scope: ConfigurationScope.RESOURCE
	},
	[TerminalSettingId.TabsDefaultIcon]: {
		description: localize('terminal.integrated.tabs.defaultIcon', "A codicon ID to associate with terminal icons by default."),
		...terminalIconSchema,
		default: Codicon.terminal.id,
		scope: ConfigurationScope.RESOURCE
	},
	[TerminalSettingId.TabsEnabled]: {
		description: localize('terminal.integrated.tabs.enabled', 'Controls whether terminal tabs display as a list to the side of the terminal. When this is disabled a dropdown will display instead.'),
		type: 'boolean',
		default: true,
	},
	[TerminalSettingId.TabsEnableAnimation]: {
		description: localize('terminal.integrated.tabs.enableAnimation', 'Controls whether terminal tab statuses support animation (eg. in progress tasks).'),
		type: 'boolean',
		default: true,
	},
	[TerminalSettingId.TabsHideCondition]: {
		description: localize('terminal.integrated.tabs.hideCondition', 'Controls whether the terminal tabs view will hide under certain conditions.'),
		type: 'string',
		enum: ['never', 'singleTerminal', 'singleGroup'],
		enumDescriptions: [
			localize('terminal.integrated.tabs.hideCondition.never', "Never hide the terminal tabs view"),
			localize('terminal.integrated.tabs.hideCondition.singleTerminal', "Hide the terminal tabs view when there is only a single terminal opened"),
			localize('terminal.integrated.tabs.hideCondition.singleGroup', "Hide the terminal tabs view when there is only a single terminal group opened"),
		],
		default: 'singleTerminal',
	},
	[TerminalSettingId.TabsShowActiveTerminal]: {
		description: localize('terminal.integrated.tabs.showActiveTerminal', 'Shows the active terminal information in the view. This is particularly useful when the title within the tabs aren\'t visible.'),
		type: 'string',
		enum: ['always', 'singleTerminal', 'singleTerminalOrNarrow', 'never'],
		enumDescriptions: [
			localize('terminal.integrated.tabs.showActiveTerminal.always', "Always show the active terminal"),
			localize('terminal.integrated.tabs.showActiveTerminal.singleTerminal', "Show the active terminal when it is the only terminal opened"),
			localize('terminal.integrated.tabs.showActiveTerminal.singleTerminalOrNarrow', "Show the active terminal when it is the only terminal opened or when the tabs view is in its narrow textless state"),
			localize('terminal.integrated.tabs.showActiveTerminal.never', "Never show the active terminal"),
		],
		default: 'singleTerminalOrNarrow',
	},
	[TerminalSettingId.TabsShowActions]: {
		description: localize('terminal.integrated.tabs.showActions', 'Controls whether terminal split and kill buttons are displays next to the new terminal button.'),
		type: 'string',
		enum: ['always', 'singleTerminal', 'singleTerminalOrNarrow', 'never'],
		enumDescriptions: [
			localize('terminal.integrated.tabs.showActions.always', "Always show the actions"),
			localize('terminal.integrated.tabs.showActions.singleTerminal', "Show the actions when it is the only terminal opened"),
			localize('terminal.integrated.tabs.showActions.singleTerminalOrNarrow', "Show the actions when it is the only terminal opened or when the tabs view is in its narrow textless state"),
			localize('terminal.integrated.tabs.showActions.never', "Never show the actions"),
		],
		default: 'singleTerminalOrNarrow',
	},
	[TerminalSettingId.TabsLocation]: {
		type: 'string',
		enum: ['left', 'right'],
		enumDescriptions: [
			localize('terminal.integrated.tabs.location.left', "Show the terminal tabs view to the left of the terminal"),
			localize('terminal.integrated.tabs.location.right', "Show the terminal tabs view to the right of the terminal")
		],
		default: 'right',
		description: localize('terminal.integrated.tabs.location', "Controls the location of the terminal tabs, either to the left or right of the actual terminal(s).")
	},
	[TerminalSettingId.DefaultLocation]: {
		type: 'string',
		enum: [TerminalLocationConfigValue.Editor, TerminalLocationConfigValue.TerminalView],
		enumDescriptions: [
			localize('terminal.integrated.defaultLocation.editor', "Create terminals in the editor"),
			localize('terminal.integrated.defaultLocation.view', "Create terminals in the terminal view")
		],
		default: 'view',
		description: localize('terminal.integrated.defaultLocation', "Controls where newly created terminals will appear.")
	},
	[TerminalSettingId.TabsFocusMode]: {
		type: 'string',
		enum: ['singleClick', 'doubleClick'],
		enumDescriptions: [
			localize('terminal.integrated.tabs.focusMode.singleClick', "Focus the terminal when clicking a terminal tab"),
			localize('terminal.integrated.tabs.focusMode.doubleClick', "Focus the terminal when double-clicking a terminal tab")
		],
		default: 'doubleClick',
		description: localize('terminal.integrated.tabs.focusMode', "Controls whether focusing the terminal of a tab happens on double or single click.")
	},
	[TerminalSettingId.MacOptionIsMeta]: {
		description: localize('terminal.integrated.macOptionIsMeta', "Controls whether to treat the option key as the meta key in the terminal on macOS."),
		type: 'boolean',
		default: false
	},
	[TerminalSettingId.MacOptionClickForcesSelection]: {
		description: localize('terminal.integrated.macOptionClickForcesSelection', "Controls whether to force selection when using Option+click on macOS. This will force a regular (line) selection and disallow the use of column selection mode. This enables copying and pasting using the regular terminal selection, for example, when mouse mode is enabled in tmux."),
		type: 'boolean',
		default: false
	},
	[TerminalSettingId.AltClickMovesCursor]: {
		markdownDescription: localize('terminal.integrated.altClickMovesCursor', "If enabled, alt/option + click will reposition the prompt cursor to underneath the mouse when {0} is set to {1} (the default value). This may not work reliably depending on your shell.", '`#editor.multiCursorModifier#`', '`\'alt\'`'),
		type: 'boolean',
		default: true
	},
	[TerminalSettingId.CopyOnSelection]: {
		description: localize('terminal.integrated.copyOnSelection', "Controls whether text selected in the terminal will be copied to the clipboard."),
		type: 'boolean',
		default: false
	},
	[TerminalSettingId.EnableMultiLinePasteWarning]: {
		markdownDescription: localize('terminal.integrated.enableMultiLinePasteWarning', "Controls whether to show a warning dialog when pasting multiple lines into the terminal."),
		type: 'string',
		enum: ['auto', 'always', 'never'],
		markdownEnumDescriptions: [
			localize('terminal.integrated.enableMultiLinePasteWarning.auto', "Enable the warning but do not show it when:\n\n- Bracketed paste mode is enabled (the shell supports multi-line paste natively)\n- The paste is handled by the shell's readline (in the case of pwsh)"),
			localize('terminal.integrated.enableMultiLinePasteWarning.always', "Always show the warning if the text contains a new line."),
			localize('terminal.integrated.enableMultiLinePasteWarning.never', "Never show the warning.")
		],
		default: 'auto'
	},
	[TerminalSettingId.DrawBoldTextInBrightColors]: {
		description: localize('terminal.integrated.drawBoldTextInBrightColors', "Controls whether bold text in the terminal will always use the \"bright\" ANSI color variant."),
		type: 'boolean',
		default: true
	},
	[TerminalSettingId.FontFamily]: {
		markdownDescription: localize('terminal.integrated.fontFamily', "Controls the font family of the terminal. Defaults to {0}'s value.", '`#editor.fontFamily#`'),
		type: 'string',
	},
	[TerminalSettingId.FontLigaturesEnabled]: {
		markdownDescription: localize('terminal.integrated.fontLigatures.enabled', "Controls whether font ligatures are enabled in the terminal. Ligatures will only work if the configured {0} supports them.", `\`#${TerminalSettingId.FontFamily}#\``),
		type: 'boolean',
		default: false
	},
	[TerminalSettingId.FontLigaturesFeatureSettings]: {
		markdownDescription: localize('terminal.integrated.fontLigatures.featureSettings', "Controls what font feature settings are used when ligatures are enabled, in the format of the `font-feature-settings` CSS property. Some examples which may be valid depending on the font:") + '\n\n- ' + [
			`\`"calt" off, "ss03"\``,
			`\`"liga" on\``,
			`\`"calt" off, "dlig" on\``
		].join('\n- '),
		type: 'string',
		default: '"calt" on'
	},
	[TerminalSettingId.FontLigaturesFallbackLigatures]: {
		markdownDescription: localize('terminal.integrated.fontLigatures.fallbackLigatures', "When {0} is enabled and the particular {1} cannot be parsed, this is the set of character sequences that will always be drawn together. This allows the use of a fixed set of ligatures even when the font isn't supported.", `\`#${TerminalSettingId.GpuAcceleration}#\``, `\`#${TerminalSettingId.FontFamily}#\``),
		type: 'array',
		items: [{ type: 'string' }],
		default: [
			'<--', '<---', '<<-', '<-', '->', '->>', '-->', '--->',
			'<==', '<===', '<<=', '<=', '=>', '=>>', '==>', '===>', '>=', '>>=',
			'<->', '<-->', '<--->', '<---->', '<=>', '<==>', '<===>', '<====>', '::', ':::',
			'<~~', '</', '</>', '/>', '~~>', '==', '!=', '/=', '~=', '<>', '===', '!==', '!===',
			'<:', ':=', '*=', '*+', '<*', '<*>', '*>', '<|', '<|>', '|>', '+*', '=*', '=:', ':>',
			'/*', '*/', '+++', '<!--', '<!---'
		]
	},
	[TerminalSettingId.FontSize]: {
		description: localize('terminal.integrated.fontSize', "Controls the font size in pixels of the terminal."),
		type: 'number',
		default: defaultTerminalFontSize,
		minimum: 6,
		maximum: 100
	},
	[TerminalSettingId.LetterSpacing]: {
		description: localize('terminal.integrated.letterSpacing', "Controls the letter spacing of the terminal. This is an integer value which represents the number of additional pixels to add between characters."),
		type: 'number',
		default: DEFAULT_LETTER_SPACING
	},
	[TerminalSettingId.LineHeight]: {
		description: localize('terminal.integrated.lineHeight', "Controls the line height of the terminal. This number is multiplied by the terminal font size to get the actual line-height in pixels."),
		type: 'number',
		default: DEFAULT_LINE_HEIGHT
	},
	[TerminalSettingId.MinimumContrastRatio]: {
		markdownDescription: localize('terminal.integrated.minimumContrastRatio', "When set, the foreground color of each cell will change to try meet the contrast ratio specified. Note that this will not apply to `powerline` characters per #146406. Example values:\n\n- 1: Do nothing and use the standard theme colors.\n- 4.5: [WCAG AA compliance (minimum)](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html) (default).\n- 7: [WCAG AAA compliance (enhanced)](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast7.html).\n- 21: White on black or black on white."),
		type: 'number',
		default: 4.5,
		tags: ['accessibility']
	},
	[TerminalSettingId.TabStopWidth]: {
		markdownDescription: localize('terminal.integrated.tabStopWidth', "The number of cells in a tab stop."),
		type: 'number',
		minimum: 1,
		default: 8
	},
	[TerminalSettingId.FastScrollSensitivity]: {
		markdownDescription: localize('terminal.integrated.fastScrollSensitivity', "Scrolling speed multiplier when pressing `Alt`."),
		type: 'number',
		default: 5
	},
	[TerminalSettingId.MouseWheelScrollSensitivity]: {
		markdownDescription: localize('terminal.integrated.mouseWheelScrollSensitivity', "A multiplier to be used on the `deltaY` of mouse wheel scroll events."),
		type: 'number',
		default: 1
	},
	[TerminalSettingId.BellDuration]: {
		markdownDescription: localize('terminal.integrated.bellDuration', "The number of milliseconds to show the bell within a terminal tab when triggered."),
		type: 'number',
		default: 1000
	},
	[TerminalSettingId.FontWeight]: {
		'anyOf': [
			{
				type: 'number',
				minimum: MINIMUM_FONT_WEIGHT,
				maximum: MAXIMUM_FONT_WEIGHT,
				errorMessage: localize('terminal.integrated.fontWeightError', "Only \"normal\" and \"bold\" keywords or numbers between 1 and 1000 are allowed.")
			},
			{
				type: 'string',
				pattern: '^(normal|bold|1000|[1-9][0-9]{0,2})$'
			},
			{
				enum: SUGGESTIONS_FONT_WEIGHT,
			}
		],
		description: localize('terminal.integrated.fontWeight', "The font weight to use within the terminal for non-bold text. Accepts \"normal\" and \"bold\" keywords or numbers between 1 and 1000."),
		default: 'normal'
	},
	[TerminalSettingId.FontWeightBold]: {
		'anyOf': [
			{
				type: 'number',
				minimum: MINIMUM_FONT_WEIGHT,
				maximum: MAXIMUM_FONT_WEIGHT,
				errorMessage: localize('terminal.integrated.fontWeightError', "Only \"normal\" and \"bold\" keywords or numbers between 1 and 1000 are allowed.")
			},
			{
				type: 'string',
				pattern: '^(normal|bold|1000|[1-9][0-9]{0,2})$'
			},
			{
				enum: SUGGESTIONS_FONT_WEIGHT,
			}
		],
		description: localize('terminal.integrated.fontWeightBold', "The font weight to use within the terminal for bold text. Accepts \"normal\" and \"bold\" keywords or numbers between 1 and 1000."),
		default: 'bold'
	},
	[TerminalSettingId.CursorBlinking]: {
		description: localize('terminal.integrated.cursorBlinking', "Controls whether the terminal cursor blinks."),
		type: 'boolean',
		default: false
	},
	[TerminalSettingId.CursorStyle]: {
		description: localize('terminal.integrated.cursorStyle', "Controls the style of terminal cursor when the terminal is focused."),
		enum: ['block', 'line', 'underline'],
		default: 'block'
	},
	[TerminalSettingId.CursorStyleInactive]: {
		description: localize('terminal.integrated.cursorStyleInactive', "Controls the style of terminal cursor when the terminal is not focused."),
		enum: ['outline', 'block', 'line', 'underline', 'none'],
		default: 'outline'
	},
	[TerminalSettingId.CursorWidth]: {
		markdownDescription: localize('terminal.integrated.cursorWidth', "Controls the width of the cursor when {0} is set to {1}.", '`#terminal.integrated.cursorStyle#`', '`line`'),
		type: 'number',
		default: 1
	},
	[TerminalSettingId.Scrollback]: {
		description: localize('terminal.integrated.scrollback', "Controls the maximum number of lines the terminal keeps in its buffer. We pre-allocate memory based on this value in order to ensure a smooth experience. As such, as the value increases, so will the amount of memory."),
		type: 'number',
		default: 1000
	},
	[TerminalSettingId.DetectLocale]: {
		markdownDescription: localize('terminal.integrated.detectLocale', "Controls whether to detect and set the `$LANG` environment variable to a UTF-8 compliant option since VS Code's terminal only supports UTF-8 encoded data coming from the shell."),
		type: 'string',
		enum: ['auto', 'off', 'on'],
		markdownEnumDescriptions: [
			localize('terminal.integrated.detectLocale.auto', "Set the `$LANG` environment variable if the existing variable does not exist or it does not end in `'.UTF-8'`."),
			localize('terminal.integrated.detectLocale.off', "Do not set the `$LANG` environment variable."),
			localize('terminal.integrated.detectLocale.on', "Always set the `$LANG` environment variable.")
		],
		default: 'auto'
	},
	[TerminalSettingId.GpuAcceleration]: {
		type: 'string',
		enum: ['auto', 'on', 'off'],
		markdownEnumDescriptions: [
			localize('terminal.integrated.gpuAcceleration.auto', "Let VS Code detect which renderer will give the best experience."),
			localize('terminal.integrated.gpuAcceleration.on', "Enable GPU acceleration within the terminal."),
			localize('terminal.integrated.gpuAcceleration.off', "Disable GPU acceleration within the terminal. The terminal will render much slower when GPU acceleration is off but it should reliably work on all systems."),
		],
		default: 'auto',
		description: localize('terminal.integrated.gpuAcceleration', "Controls whether the terminal will leverage the GPU to do its rendering.")
	},
	[TerminalSettingId.TerminalTitleSeparator]: {
		'type': 'string',
		'default': ' - ',
		'markdownDescription': localize("terminal.integrated.tabs.separator", "Separator used by {0} and {1}.", `\`#${TerminalSettingId.TerminalTitle}#\``, `\`#${TerminalSettingId.TerminalDescription}#\``)
	},
	[TerminalSettingId.TerminalTitle]: {
		'type': 'string',
		'default': '${process}',
		'markdownDescription': terminalTitle
	},
	[TerminalSettingId.TerminalDescription]: {
		'type': 'string',
		'default': '${task}${separator}${local}${separator}${cwdFolder}',
		'markdownDescription': terminalDescription
	},
	[TerminalSettingId.RightClickBehavior]: {
		type: 'string',
		enum: ['default', 'copyPaste', 'paste', 'selectWord', 'nothing'],
		enumDescriptions: [
			localize('terminal.integrated.rightClickBehavior.default', "Show the context menu."),
			localize('terminal.integrated.rightClickBehavior.copyPaste', "Copy when there is a selection, otherwise paste."),
			localize('terminal.integrated.rightClickBehavior.paste', "Paste on right click."),
			localize('terminal.integrated.rightClickBehavior.selectWord', "Select the word under the cursor and show the context menu."),
			localize('terminal.integrated.rightClickBehavior.nothing', "Do nothing and pass event to terminal.")
		],
		default: isMacintosh ? 'selectWord' : isWindows ? 'copyPaste' : 'default',
		description: localize('terminal.integrated.rightClickBehavior', "Controls how terminal reacts to right click.")
	},
	[TerminalSettingId.MiddleClickBehavior]: {
		type: 'string',
		enum: ['default', 'paste'],
		enumDescriptions: [
			localize('terminal.integrated.middleClickBehavior.default', "The platform default to focus the terminal. On Linux this will also paste the selection."),
			localize('terminal.integrated.middleClickBehavior.paste', "Paste on middle click."),
		],
		default: 'default',
		description: localize('terminal.integrated.middleClickBehavior', "Controls how terminal reacts to middle click.")
	},
	[TerminalSettingId.Cwd]: {
		restricted: true,
		description: localize('terminal.integrated.cwd', "An explicit start path where the terminal will be launched, this is used as the current working directory (cwd) for the shell process. This may be particularly useful in workspace settings if the root directory is not a convenient cwd."),
		type: 'string',
		default: undefined,
		scope: ConfigurationScope.RESOURCE
	},
	[TerminalSettingId.ConfirmOnExit]: {
		description: localize('terminal.integrated.confirmOnExit', "Controls whether to confirm when the window closes if there are active terminal sessions. Background terminals like those launched by some extensions will not trigger the confirmation."),
		type: 'string',
		enum: ['never', 'always', 'hasChildProcesses'],
		enumDescriptions: [
			localize('terminal.integrated.confirmOnExit.never', "Never confirm."),
			localize('terminal.integrated.confirmOnExit.always', "Always confirm if there are terminals."),
			localize('terminal.integrated.confirmOnExit.hasChildProcesses', "Confirm if there are any terminals that have child processes."),
		],
		default: 'never'
	},
	[TerminalSettingId.ConfirmOnKill]: {
		description: localize('terminal.integrated.confirmOnKill', "Controls whether to confirm killing terminals when they have child processes. When set to editor, terminals in the editor area will be marked as changed when they have child processes. Note that child process detection may not work well for shells like Git Bash which don't run their processes as child processes of the shell. Background terminals like those launched by some extensions will not trigger the confirmation."),
		type: 'string',
		enum: ['never', 'editor', 'panel', 'always'],
		enumDescriptions: [
			localize('terminal.integrated.confirmOnKill.never', "Never confirm."),
			localize('terminal.integrated.confirmOnKill.editor', "Confirm if the terminal is in the editor."),
			localize('terminal.integrated.confirmOnKill.panel', "Confirm if the terminal is in the panel."),
			localize('terminal.integrated.confirmOnKill.always', "Confirm if the terminal is either in the editor or panel."),
		],
		default: 'editor'
	},
	[TerminalSettingId.EnableBell]: {
		markdownDeprecationMessage: localize('terminal.integrated.enableBell', "This is now deprecated. Instead use the `terminal.integrated.enableVisualBell` and `accessibility.signals.terminalBell` settings."),
		type: 'boolean',
		default: false
	},
	[TerminalSettingId.EnableVisualBell]: {
		description: localize('terminal.integrated.enableVisualBell', "Controls whether the visual terminal bell is enabled. This shows up next to the terminal's name."),
		type: 'boolean',
		default: false
	},
	[TerminalSettingId.CommandsToSkipShell]: {
		markdownDescription: localize(
			'terminal.integrated.commandsToSkipShell',
			"A set of command IDs whose keybindings will not be sent to the shell but instead always be handled by VS Code. This allows keybindings that would normally be consumed by the shell to act instead the same as when the terminal is not focused, for example `Ctrl+P` to launch Quick Open.\n\n&nbsp;\n\nMany commands are skipped by default. To override a default and pass that command's keybinding to the shell instead, add the command prefixed with the `-` character. For example add `-workbench.action.quickOpen` to allow `Ctrl+P` to reach the shell.\n\n&nbsp;\n\nThe following list of default skipped commands is truncated when viewed in Settings Editor. To see the full list, {1} and search for the first command from the list below.\n\n&nbsp;\n\nDefault Skipped Commands:\n\n{0}",
			DEFAULT_COMMANDS_TO_SKIP_SHELL.sort().map(command => `- ${command}`).join('\n'),
			`[${localize('openDefaultSettingsJson', "open the default settings JSON")}](command:workbench.action.openRawDefaultSettings '${localize('openDefaultSettingsJson.capitalized', "Open Default Settings (JSON)")}')`,

		),
		type: 'array',
		items: {
			type: 'string'
		},
		default: []
	},
	[TerminalSettingId.AllowChords]: {
		markdownDescription: localize('terminal.integrated.allowChords', "Whether or not to allow chord keybindings in the terminal. Note that when this is true and the keystroke results in a chord it will bypass {0}, setting this to false is particularly useful when you want ctrl+k to go to your shell (not VS Code).", '`#terminal.integrated.commandsToSkipShell#`'),
		type: 'boolean',
		default: true
	},
	[TerminalSettingId.AllowMnemonics]: {
		markdownDescription: localize('terminal.integrated.allowMnemonics', "Whether to allow menubar mnemonics (for example Alt+F) to trigger the open of the menubar. Note that this will cause all alt keystrokes to skip the shell when true. This does nothing on macOS."),
		type: 'boolean',
		default: false
	},
	[TerminalSettingId.EnvMacOs]: {
		restricted: true,
		markdownDescription: localize('terminal.integrated.env.osx', "Object with environment variables that will be added to the VS Code process to be used by the terminal on macOS. Set to `null` to delete the environment variable."),
		type: 'object',
		additionalProperties: {
			type: ['string', 'null']
		},
		default: {}
	},
	[TerminalSettingId.EnvLinux]: {
		restricted: true,
		markdownDescription: localize('terminal.integrated.env.linux', "Object with environment variables that will be added to the VS Code process to be used by the terminal on Linux. Set to `null` to delete the environment variable."),
		type: 'object',
		additionalProperties: {
			type: ['string', 'null']
		},
		default: {}
	},
	[TerminalSettingId.EnvWindows]: {
		restricted: true,
		markdownDescription: localize('terminal.integrated.env.windows', "Object with environment variables that will be added to the VS Code process to be used by the terminal on Windows. Set to `null` to delete the environment variable."),
		type: 'object',
		additionalProperties: {
			type: ['string', 'null']
		},
		default: {}
	},
	[TerminalSettingId.EnvironmentChangesRelaunch]: {
		markdownDescription: localize('terminal.integrated.environmentChangesRelaunch', "Whether to relaunch terminals automatically if extensions want to contribute to their environment and have not been interacted with yet."),
		type: 'boolean',
		default: true
	},
	[TerminalSettingId.ShowExitAlert]: {
		description: localize('terminal.integrated.showExitAlert', "Controls whether to show the alert \"The terminal process terminated with exit code\" when exit code is non-zero."),
		type: 'boolean',
		default: true
	},
	[TerminalSettingId.WindowsUseConptyDll]: {
		markdownDescription: localize('terminal.integrated.windowsUseConptyDll', "Whether to use the experimental conpty.dll (v1.23.251008001) shipped with VS Code, instead of the one bundled with Windows."),
		type: 'boolean',
		tags: ['preview'],
		default: false,
		experiment: {
			mode: 'auto'
		},
	},
	[TerminalSettingId.SplitCwd]: {
		description: localize('terminal.integrated.splitCwd', "Controls the working directory a split terminal starts with."),
		type: 'string',
		enum: ['workspaceRoot', 'initial', 'inherited'],
		enumDescriptions: [
			localize('terminal.integrated.splitCwd.workspaceRoot', "A new split terminal will use the workspace root as the working directory. In a multi-root workspace a choice for which root folder to use is offered."),
			localize('terminal.integrated.splitCwd.initial', "A new split terminal will use the working directory that the parent terminal started with."),
			localize('terminal.integrated.splitCwd.inherited', "On macOS and Linux, a new split terminal will use the working directory of the parent terminal. On Windows, this behaves the same as initial."),
		],
		default: 'inherited'
	},
	[TerminalSettingId.WindowsEnableConpty]: {
		description: localize('terminal.integrated.windowsEnableConpty', "Whether to use ConPTY for Windows terminal process communication (requires Windows 10 build number 18309+). Winpty will be used if this is false."),
		type: 'boolean',
		default: true
	},
	[TerminalSettingId.WordSeparators]: {
		markdownDescription: localize('terminal.integrated.wordSeparators', "A string containing all characters to be considered word separators when double-clicking to select word and in the fallback 'word' link detection. Since this is used for link detection, including characters such as `:` that are used when detecting links will cause the line and column part of links like `file:10:5` to be ignored."),
		type: 'string',
		// allow-any-unicode-next-line
		default: ' ()[]{}\',"`─‘’“”|'
	},
	[TerminalSettingId.EnableFileLinks]: {
		description: localize('terminal.integrated.enableFileLinks', "Whether to enable file links in terminals. Links can be slow when working on a network drive in particular because each file link is verified against the file system. Changing this will take effect only in new terminals."),
		type: 'string',
		enum: ['off', 'on', 'notRemote'],
		enumDescriptions: [
			localize('enableFileLinks.off', "Always off."),
			localize('enableFileLinks.on', "Always on."),
			localize('enableFileLinks.notRemote', "Enable only when not in a remote workspace.")
		],
		default: 'on'
	},
	[TerminalSettingId.AllowedLinkSchemes]: {
		description: localize('terminal.integrated.allowedLinkSchemes', "An array of strings containing the URI schemes that the terminal is allowed to open links for. By default, only a small subset of possible schemes are allowed for security reasons."),
		type: 'array',
		items: {
			type: 'string'
		},
		default: [
			'file',
			'http',
			'https',
			'mailto',
			'vscode',
			'vscode-insiders',
		]
	},
	[TerminalSettingId.UnicodeVersion]: {
		type: 'string',
		enum: ['6', '11'],
		enumDescriptions: [
			localize('terminal.integrated.unicodeVersion.six', "Version 6 of Unicode. This is an older version which should work better on older systems."),
			localize('terminal.integrated.unicodeVersion.eleven', "Version 11 of Unicode. This version provides better support on modern systems that use modern versions of Unicode.")
		],
		default: '11',
		description: localize('terminal.integrated.unicodeVersion', "Controls what version of Unicode to use when evaluating the width of characters in the terminal. If you experience emoji or other wide characters not taking up the right amount of space or backspace either deleting too much or too little then you may want to try tweaking this setting.")
	},
	[TerminalSettingId.EnablePersistentSessions]: {
		description: localize('terminal.integrated.enablePersistentSessions', "Persist terminal sessions/history for the workspace across window reloads."),
		type: 'boolean',
		default: true
	},
	[TerminalSettingId.PersistentSessionReviveProcess]: {
		markdownDescription: localize('terminal.integrated.persistentSessionReviveProcess', "When the terminal process must be shut down (for example on window or application close), this determines when the previous terminal session contents/history should be restored and processes be recreated when the workspace is next opened.\n\nCaveats:\n\n- Restoring of the process current working directory depends on whether it is supported by the shell.\n- Time to persist the session during shutdown is limited, so it may be aborted when using high-latency remote connections."),
		type: 'string',
		enum: ['onExit', 'onExitAndWindowClose', 'never'],
		markdownEnumDescriptions: [
			localize('terminal.integrated.persistentSessionReviveProcess.onExit', "Revive the processes after the last window is closed on Windows/Linux or when the `workbench.action.quit` command is triggered (command palette, keybinding, menu)."),
			localize('terminal.integrated.persistentSessionReviveProcess.onExitAndWindowClose', "Revive the processes after the last window is closed on Windows/Linux or when the `workbench.action.quit` command is triggered (command palette, keybinding, menu), or when the window is closed."),
			localize('terminal.integrated.persistentSessionReviveProcess.never', "Never restore the terminal buffers or recreate the process.")
		],
		default: 'onExit'
	},
	[TerminalSettingId.HideOnStartup]: {
		description: localize('terminal.integrated.hideOnStartup', "Whether to hide the terminal view on startup, avoiding creating a terminal when there are no persistent sessions."),
		type: 'string',
		enum: ['never', 'whenEmpty', 'always'],
		markdownEnumDescriptions: [
			localize('hideOnStartup.never', "Never hide the terminal view on startup."),
			localize('hideOnStartup.whenEmpty', "Only hide the terminal when there are no persistent sessions restored."),
			localize('hideOnStartup.always', "Always hide the terminal, even when there are persistent sessions restored.")
		],
		default: 'never'
	},
	[TerminalSettingId.HideOnLastClosed]: {
		description: localize('terminal.integrated.hideOnLastClosed', "Whether to hide the terminal view when the last terminal is closed. This will only happen when the terminal is the only visible view in the view container."),
		type: 'boolean',
		default: true
	},
	[TerminalSettingId.CustomGlyphs]: {
		markdownDescription: localize('terminal.integrated.customGlyphs', "Whether to draw custom glyphs for block element and box drawing characters instead of using the font, which typically yields better rendering with continuous lines. Note that this doesn't work when {0} is disabled.", `\`#${TerminalSettingId.GpuAcceleration}#\``),
		type: 'boolean',
		default: true
	},
	[TerminalSettingId.RescaleOverlappingGlyphs]: {
		markdownDescription: localize('terminal.integrated.rescaleOverlappingGlyphs', "Whether to rescale glyphs horizontally that are a single cell wide but have glyphs that would overlap following cell(s). This typically happens for ambiguous width characters (eg. the roman numeral characters U+2160+) which aren't featured in monospace fonts. Emoji glyphs are never rescaled."),
		type: 'boolean',
		default: true
	},
	[TerminalSettingId.ShellIntegrationEnabled]: {
		restricted: true,
		markdownDescription: localize('terminal.integrated.shellIntegration.enabled', "Determines whether or not shell integration is auto-injected to support features like enhanced command tracking and current working directory detection. \n\nShell integration works by injecting the shell with a startup script. The script gives VS Code insight into what is happening within the terminal.\n\nSupported shells:\n\n- Linux/macOS: bash, fish, pwsh, zsh\n - Windows: pwsh, git bash\n\nThis setting applies only when terminals are created, so you will need to restart your terminals for it to take effect.\n\n Note that the script injection may not work if you have custom arguments defined in the terminal profile, have enabled {1}, have a [complex bash `PROMPT_COMMAND`](https://code.visualstudio.com/docs/editor/integrated-terminal#_complex-bash-promptcommand), or other unsupported setup. To disable decorations, see {0}", '`#terminal.integrated.shellIntegration.decorationsEnabled#`', '`#editor.accessibilitySupport#`'),
		type: 'boolean',
		default: true
	},
	[TerminalSettingId.ShellIntegrationDecorationsEnabled]: {
		restricted: true,
		markdownDescription: localize('terminal.integrated.shellIntegration.decorationsEnabled', "When shell integration is enabled, adds a decoration for each command."),
		type: 'string',
		enum: ['both', 'gutter', 'overviewRuler', 'never'],
		enumDescriptions: [
			localize('terminal.integrated.shellIntegration.decorationsEnabled.both', "Show decorations in the gutter (left) and overview ruler (right)"),
			localize('terminal.integrated.shellIntegration.decorationsEnabled.gutter', "Show gutter decorations to the left of the terminal"),
			localize('terminal.integrated.shellIntegration.decorationsEnabled.overviewRuler', "Show overview ruler decorations to the right of the terminal"),
			localize('terminal.integrated.shellIntegration.decorationsEnabled.never', "Do not show decorations"),
		],
		default: 'both'
	},
	[TerminalSettingId.ShellIntegrationTimeout]: {
		restricted: true,
		markdownDescription: localize('terminal.integrated.shellIntegration.timeout', "Configures the duration in milliseconds to wait for shell integration after launch before declaring it's not there. Set to {0} to wait the minimum time (500ms), the default value {1} means the wait time is variable based on whether shell integration injection is enabled and whether it's a remote window. Consider setting this to a small value if you intentionally disabled shell integration, or a large value if your shell starts very slowly.", '`0`', '`-1`'),
		type: 'integer',
		minimum: -1,
		maximum: 60000,
		default: -1
	},
	[TerminalSettingId.ShellIntegrationQuickFixEnabled]: {
		restricted: true,
		markdownDescription: localize('terminal.integrated.shellIntegration.quickFixEnabled', "When shell integration is enabled, enables quick fixes for terminal commands that appear as a lightbulb or sparkle icon to the left of the prompt."),
		type: 'boolean',
		default: true
	},
	[TerminalSettingId.ShellIntegrationEnvironmentReporting]: {
		markdownDescription: localize('terminal.integrated.shellIntegration.environmentReporting', "Controls whether to report the shell environment, enabling its use in features such as {0}. This may cause a slowdown when printing your shell's prompt.", `\`#${TerminalContribSettingId.SuggestEnabled}#\``),
		type: 'boolean',
		default: product.quality !== 'stable'
	},
	[TerminalSettingId.SmoothScrolling]: {
		markdownDescription: localize('terminal.integrated.smoothScrolling', "Controls whether the terminal will scroll using an animation."),
		type: 'boolean',
		default: false
	},
	[TerminalSettingId.IgnoreBracketedPasteMode]: {
		markdownDescription: localize('terminal.integrated.ignoreBracketedPasteMode', "Controls whether the terminal will ignore bracketed paste mode even if the terminal was put into the mode, omitting the {0} and {1} sequences when pasting. This is useful when the shell is not respecting the mode which can happen in sub-shells for example.", '`\\x1b[200~`', '`\\x1b[201~`'),
		type: 'boolean',
		default: false
	},
	[TerminalSettingId.EnableImages]: {
		restricted: true,
		markdownDescription: localize('terminal.integrated.enableImages', "Enables image support in the terminal, this will only work when {0} is enabled. Both sixel and iTerm's inline image protocol are supported on Linux and macOS. This will only work on Windows for versions of ConPTY >= v2 which is shipped with Windows itself, see also {1}. Images will currently not be restored between window reloads/reconnects.", `\`#${TerminalSettingId.GpuAcceleration}#\``, `\`#${TerminalSettingId.WindowsUseConptyDll}#\``),
		type: 'boolean',
		default: false
	},
	[TerminalSettingId.FocusAfterRun]: {
		markdownDescription: localize('terminal.integrated.focusAfterRun', "Controls whether the terminal, accessible buffer, or neither will be focused after `Terminal: Run Selected Text In Active Terminal` has been run."),
		enum: ['terminal', 'accessible-buffer', 'none'],
		default: 'none',
		tags: ['accessibility'],
		markdownEnumDescriptions: [
			localize('terminal.integrated.focusAfterRun.terminal', "Always focus the terminal."),
			localize('terminal.integrated.focusAfterRun.accessible-buffer', "Always focus the accessible buffer."),
			localize('terminal.integrated.focusAfterRun.none', "Do nothing."),
		]
	},
	[TerminalSettingId.DeveloperPtyHostLatency]: {
		description: localize('terminal.integrated.developer.ptyHost.latency', "Simulated latency in milliseconds applied to all calls made to the pty host. This is useful for testing terminal behavior under high latency conditions."),
		type: 'number',
		minimum: 0,
		default: 0,
		tags: ['advanced']
	},
	[TerminalSettingId.DeveloperPtyHostStartupDelay]: {
		description: localize('terminal.integrated.developer.ptyHost.startupDelay', "Simulated startup delay in milliseconds for the pty host process. This is useful for testing terminal initialization under slow startup conditions."),
		type: 'number',
		minimum: 0,
		default: 0,
		tags: ['advanced']
	},
	[TerminalSettingId.DevMode]: {
		description: localize('terminal.integrated.developer.devMode', "Enable developer mode for the terminal. This shows additional debug information and visualizations for shell integration sequences."),
		type: 'boolean',
		default: false,
		tags: ['advanced']
	},
	...terminalContribConfiguration,
};

export async function registerTerminalConfiguration(getFontSnippets: () => Promise<IJSONSchemaSnippet[]>) {
	const configurationRegistry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
	configurationRegistry.registerConfiguration({
		id: 'terminal',
		order: 100,
		title: localize('terminalIntegratedConfigurationTitle', "Integrated Terminal"),
		type: 'object',
		properties: terminalConfiguration,
	});
	terminalConfiguration[TerminalSettingId.FontFamily].defaultSnippets = await getFontSnippets();
}

Registry.as<IConfigurationMigrationRegistry>(WorkbenchExtensions.ConfigurationMigration)
	.registerConfigurationMigrations([{
		key: TerminalSettingId.EnableBell,
		migrateFn: (enableBell, accessor) => {
			const configurationKeyValuePairs: ConfigurationKeyValuePairs = [];
			let announcement = accessor('accessibility.signals.terminalBell')?.announcement ?? accessor('accessibility.alert.terminalBell');
			if (announcement !== undefined && !isString(announcement)) {
				announcement = announcement ? 'auto' : 'off';
			}
			configurationKeyValuePairs.push(['accessibility.signals.terminalBell', { value: { sound: enableBell ? 'on' : 'off', announcement } }]);
			configurationKeyValuePairs.push([TerminalSettingId.EnableBell, { value: undefined }]);
			configurationKeyValuePairs.push([TerminalSettingId.EnableVisualBell, { value: enableBell }]);
			return configurationKeyValuePairs;
		}
	}]);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/terminalContextKey.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/terminalContextKey.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { ContextKeyExpr, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { TerminalSettingId } from '../../../../platform/terminal/common/terminal.js';
import { TERMINAL_VIEW_ID } from './terminal.js';
import { TerminalContribContextKeyStrings } from '../terminalContribExports.js';

export const enum TerminalContextKeyStrings {
	IsOpen = 'terminalIsOpen',
	Count = 'terminalCount',
	GroupCount = 'terminalGroupCount',
	TabsNarrow = 'isTerminalTabsNarrow',
	HasFixedWidth = 'terminalHasFixedWidth',
	ProcessSupported = 'terminalProcessSupported',
	Focus = 'terminalFocus',
	FocusInAny = 'terminalFocusInAny',
	AccessibleBufferFocus = 'terminalAccessibleBufferFocus',
	AccessibleBufferOnLastLine = 'terminalAccessibleBufferOnLastLine',
	EditorFocus = 'terminalEditorFocus',
	TabsFocus = 'terminalTabsFocus',
	WebExtensionContributedProfile = 'terminalWebExtensionContributedProfile',
	TerminalHasBeenCreated = 'terminalHasBeenCreated',
	TerminalEditorActive = 'terminalEditorActive',
	TabsMouse = 'terminalTabsMouse',
	AltBufferActive = 'terminalAltBufferActive',
	SuggestWidgetVisible = 'terminalSuggestWidgetVisible',
	A11yTreeFocus = 'terminalA11yTreeFocus',
	ViewShowing = 'terminalViewShowing',
	TextSelected = 'terminalTextSelected',
	TextSelectedInFocused = 'terminalTextSelectedInFocused',
	FindVisible = 'terminalFindVisible',
	FindInputFocused = 'terminalFindInputFocused',
	FindFocused = 'terminalFindFocused',
	TabsSingularSelection = 'terminalTabsSingularSelection',
	SplitTerminal = 'terminalSplitTerminal',
	SplitPaneActive = 'terminalSplitPaneActive',
	ShellType = 'terminalShellType',
	InTerminalRunCommandPicker = 'inTerminalRunCommandPicker',
	TerminalShellIntegrationEnabled = 'terminalShellIntegrationEnabled',
	DictationInProgress = 'terminalDictationInProgress'
}

export namespace TerminalContextKeys {
	/** Whether there is at least one opened terminal. */
	export const isOpen = new RawContextKey<boolean>(TerminalContextKeyStrings.IsOpen, false, true);

	/** Whether the terminal is focused. */
	export const focus = new RawContextKey<boolean>(TerminalContextKeyStrings.Focus, false, localize('terminalFocusContextKey', "Whether the terminal is focused."));

	/** Whether any terminal is focused, including detached terminals used in other UI. */
	export const focusInAny = new RawContextKey<boolean>(TerminalContextKeyStrings.FocusInAny, false, localize('terminalFocusInAnyContextKey', "Whether any terminal is focused, including detached terminals used in other UI."));

	/** Whether a terminal in the editor area is focused. */
	export const editorFocus = new RawContextKey<boolean>(TerminalContextKeyStrings.EditorFocus, false, localize('terminalEditorFocusContextKey', "Whether a terminal in the editor area is focused."));

	/** The current number of terminals. */
	export const count = new RawContextKey<number>(TerminalContextKeyStrings.Count, 0, localize('terminalCountContextKey', "The current number of terminals."));

	/** The current number of terminal groups. */
	export const groupCount = new RawContextKey<number>(TerminalContextKeyStrings.GroupCount, 0, true);

	/** Whether the terminal tabs view is narrow. */
	export const tabsNarrow = new RawContextKey<boolean>(TerminalContextKeyStrings.TabsNarrow, false, true);

	/** Whether the terminal tabs view is narrow. */
	export const terminalHasFixedWidth = new RawContextKey<boolean>(TerminalContextKeyStrings.HasFixedWidth, false, true);

	/** Whether the terminal tabs widget is focused. */
	export const tabsFocus = new RawContextKey<boolean>(TerminalContextKeyStrings.TabsFocus, false, localize('terminalTabsFocusContextKey', "Whether the terminal tabs widget is focused."));

	/** Whether a web extension has contributed a profile */
	export const webExtensionContributedProfile = new RawContextKey<boolean>(TerminalContextKeyStrings.WebExtensionContributedProfile, false, true);

	/** Whether at least one terminal has been created */
	export const terminalHasBeenCreated = new RawContextKey<boolean>(TerminalContextKeyStrings.TerminalHasBeenCreated, false, true);

	/** Whether at least one terminal has been created */
	export const terminalEditorActive = new RawContextKey<boolean>(TerminalContextKeyStrings.TerminalEditorActive, false, true);

	/** Whether the mouse is within the terminal tabs list. */
	export const tabsMouse = new RawContextKey<boolean>(TerminalContextKeyStrings.TabsMouse, false, true);

	/** The shell type of the active terminal, this is set if the type can be detected. */
	export const shellType = new RawContextKey<string>(TerminalContextKeyStrings.ShellType, undefined, { type: 'string', description: localize('terminalShellTypeContextKey', "The shell type of the active terminal, this is set if the type can be detected.") });

	/** Whether the terminal's alt buffer is active. */
	export const altBufferActive = new RawContextKey<boolean>(TerminalContextKeyStrings.AltBufferActive, false, localize('terminalAltBufferActive', "Whether the terminal's alt buffer is active."));

	/** Whether the terminal's suggest widget is visible. */
	export const suggestWidgetVisible = new RawContextKey<boolean>(TerminalContextKeyStrings.SuggestWidgetVisible, false, localize('terminalSuggestWidgetVisible', "Whether the terminal's suggest widget is visible."));

	/** Whether the terminal is NOT focused. */
	export const notFocus = focus.toNegated();

	/** Whether the terminal view is showing. */
	export const viewShowing = new RawContextKey<boolean>(TerminalContextKeyStrings.ViewShowing, false, localize('terminalViewShowing', "Whether the terminal view is showing"));

	/** Whether text is selected in the active terminal. */
	export const textSelected = new RawContextKey<boolean>(TerminalContextKeyStrings.TextSelected, false, localize('terminalTextSelectedContextKey', "Whether text is selected in the active terminal."));

	/** Whether text is selected in a focused terminal. `textSelected` counts text selected in an active in a terminal view or an editor, where `textSelectedInFocused` simply counts text in an element with DOM focus. */
	export const textSelectedInFocused = new RawContextKey<boolean>(TerminalContextKeyStrings.TextSelectedInFocused, false, localize('terminalTextSelectedInFocusedContextKey', "Whether text is selected in a focused terminal."));

	/** Whether text is NOT selected in the active terminal. */
	export const notTextSelected = textSelected.toNegated();

	/** Whether the active terminal's find widget is visible. */
	export const findVisible = new RawContextKey<boolean>(TerminalContextKeyStrings.FindVisible, false, true);

	/** Whether the active terminal's find widget is NOT visible. */
	export const notFindVisible = findVisible.toNegated();

	/** Whether the active terminal's find widget text input is focused. */
	export const findInputFocus = new RawContextKey<boolean>(TerminalContextKeyStrings.FindInputFocused, false, true);

	/** Whether an element within the active terminal's find widget is focused. */
	export const findFocus = new RawContextKey<boolean>(TerminalContextKeyStrings.FindFocused, false, true);

	/** Whether NO elements within the active terminal's find widget is focused. */
	export const notFindFocus = findInputFocus.toNegated();

	/** Whether terminal processes can be launched in the current workspace. */
	export const processSupported = new RawContextKey<boolean>(TerminalContextKeyStrings.ProcessSupported, false, localize('terminalProcessSupportedContextKey', "Whether terminal processes can be launched in the current workspace."));

	/** Whether one terminal is selected in the terminal tabs list. */
	export const tabsSingularSelection = new RawContextKey<boolean>(TerminalContextKeyStrings.TabsSingularSelection, false, localize('terminalTabsSingularSelectedContextKey', "Whether one terminal is selected in the terminal tabs list."));

	/** Whether the focused tab's terminal is a split terminal. */
	export const splitTerminalTabFocused = new RawContextKey<boolean>(TerminalContextKeyStrings.SplitTerminal, false, localize('isSplitTerminalContextKey', "Whether the focused tab's terminal is a split terminal."));

	/** Whether the active terminal is a split pane */
	export const splitTerminalActive = new RawContextKey<boolean>(TerminalContextKeyStrings.SplitPaneActive, false, localize('splitPaneActive', "Whether the active terminal is a split pane."));

	/** Whether the terminal run command picker is currently open. */
	export const inTerminalRunCommandPicker = new RawContextKey<boolean>(TerminalContextKeyStrings.InTerminalRunCommandPicker, false, localize('inTerminalRunCommandPickerContextKey', "Whether the terminal run command picker is currently open."));

	/** Whether shell integration is enabled in the active terminal. This only considers full VS Code shell integration. */
	export const terminalShellIntegrationEnabled = new RawContextKey<boolean>(TerminalContextKeyStrings.TerminalShellIntegrationEnabled, false, localize('terminalShellIntegrationEnabled', "Whether shell integration is enabled in the active terminal"));

	/** Whether a speech to text (dictation) session is in progress. */
	export const terminalDictationInProgress = new RawContextKey<boolean>(TerminalContextKeyStrings.DictationInProgress, false);

	export const shouldShowViewInlineActions = ContextKeyExpr.and(
		ContextKeyExpr.equals('view', TERMINAL_VIEW_ID),
		ContextKeyExpr.notEquals(`config.${TerminalSettingId.TabsHideCondition}`, 'never'),
		ContextKeyExpr.not(TerminalContribContextKeyStrings.ChatHasHiddenTerminals),
		ContextKeyExpr.or(
			ContextKeyExpr.not(`config.${TerminalSettingId.TabsEnabled}`),
			ContextKeyExpr.and(
				ContextKeyExpr.equals(`config.${TerminalSettingId.TabsShowActions}`, 'singleTerminal'),
				ContextKeyExpr.equals(TerminalContextKeyStrings.GroupCount, 1)
			),
			ContextKeyExpr.and(
				ContextKeyExpr.equals(`config.${TerminalSettingId.TabsShowActions}`, 'singleTerminalOrNarrow'),
				ContextKeyExpr.or(
					ContextKeyExpr.equals(TerminalContextKeyStrings.GroupCount, 1),
					ContextKeyExpr.has(TerminalContextKeyStrings.TabsNarrow)
				)
			),
			ContextKeyExpr.and(
				ContextKeyExpr.equals(`config.${TerminalSettingId.TabsShowActions}`, 'singleGroup'),
				ContextKeyExpr.equals(TerminalContextKeyStrings.GroupCount, 1)
			),
			ContextKeyExpr.equals(`config.${TerminalSettingId.TabsShowActions}`, 'always')
		)
	);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/terminalEnvironment.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/terminalEnvironment.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * This module contains utility functions related to the environment, cwd and paths.
 */

import * as path from '../../../../base/common/path.js';
import { URI, uriToFsPath } from '../../../../base/common/uri.js';
import { IWorkspaceContextService, IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { IConfigurationResolverService } from '../../../services/configurationResolver/common/configurationResolver.js';
import { sanitizeProcessEnvironment } from '../../../../base/common/processes.js';
import { IShellLaunchConfig, ITerminalBackend, ITerminalEnvironment, TerminalSettingId, TerminalShellType, WindowsShellType } from '../../../../platform/terminal/common/terminal.js';
import { IProcessEnvironment, isWindows, isMacintosh, language, OperatingSystem } from '../../../../base/common/platform.js';
import { escapeNonWindowsPath, sanitizeCwd } from '../../../../platform/terminal/common/terminalEnvironment.js';
import { isNumber, isString } from '../../../../base/common/types.js';
import { IHistoryService } from '../../../services/history/common/history.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import type { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';

export function mergeEnvironments(parent: IProcessEnvironment, other: ITerminalEnvironment | undefined): void {
	if (!other) {
		return;
	}

	// On Windows apply the new values ignoring case, while still retaining
	// the case of the original key.
	if (isWindows) {
		for (const configKey in other) {
			let actualKey = configKey;
			for (const envKey in parent) {
				if (configKey.toLowerCase() === envKey.toLowerCase()) {
					actualKey = envKey;
					break;
				}
			}
			const value = other[configKey];
			if (value !== undefined) {
				_mergeEnvironmentValue(parent, actualKey, value);
			}
		}
	} else {
		Object.keys(other).forEach((key) => {
			const value = other[key];
			if (value !== undefined) {
				_mergeEnvironmentValue(parent, key, value);
			}
		});
	}
}

function _mergeEnvironmentValue(env: ITerminalEnvironment, key: string, value: string | null): void {
	if (isString(value)) {
		env[key] = value;
	} else {
		delete env[key];
	}
}

export function addTerminalEnvironmentKeys(env: IProcessEnvironment, version: string | undefined, locale: string | undefined, detectLocale: 'auto' | 'off' | 'on'): void {
	env['TERM_PROGRAM'] = 'vscode';
	if (version) {
		env['TERM_PROGRAM_VERSION'] = version;
	}
	if (shouldSetLangEnvVariable(env, detectLocale)) {
		env['LANG'] = getLangEnvVariable(locale);
	}
	env['COLORTERM'] = 'truecolor';
}

function mergeNonNullKeys(env: IProcessEnvironment, other: ITerminalEnvironment | undefined) {
	if (!other) {
		return;
	}
	for (const key of Object.keys(other)) {
		const value = other[key];
		if (value !== undefined && value !== null) {
			env[key] = value;
		}
	}
}

async function resolveConfigurationVariables(variableResolver: VariableResolver, env: ITerminalEnvironment): Promise<ITerminalEnvironment> {
	await Promise.all(Object.entries(env).map(async ([key, value]) => {
		if (isString(value)) {
			try {
				env[key] = await variableResolver(value);
			} catch (e) {
				env[key] = value;
			}
		}
	}));

	return env;
}

export function shouldSetLangEnvVariable(env: IProcessEnvironment, detectLocale: 'auto' | 'off' | 'on'): boolean {
	if (detectLocale === 'on') {
		return true;
	}
	if (detectLocale === 'auto') {
		const lang = env['LANG'];
		return !lang || (lang.search(/\.UTF\-8$/) === -1 && lang.search(/\.utf8$/) === -1 && lang.search(/\.euc.+/) === -1);
	}
	return false; // 'off'
}

export function getLangEnvVariable(locale?: string): string {
	const parts = locale ? locale.split('-') : [];
	const n = parts.length;
	if (n === 0) {
		// Fallback to en_US if the locale is unknown
		return 'en_US.UTF-8';
	}
	if (n === 1) {
		// The local may only contain the language, not the variant, if this is the case guess the
		// variant such that it can be used as a valid $LANG variable. The language variant chosen
		// is the original and/or most prominent with help from
		// https://stackoverflow.com/a/2502675/1156119
		// The list of locales was generated by running `locale -a` on macOS
		const languageVariants: { [key: string]: string } = {
			af: 'ZA',
			am: 'ET',
			be: 'BY',
			bg: 'BG',
			ca: 'ES',
			cs: 'CZ',
			da: 'DK',
			// de: 'AT',
			// de: 'CH',
			de: 'DE',
			el: 'GR',
			// en: 'AU',
			// en: 'CA',
			// en: 'GB',
			// en: 'IE',
			// en: 'NZ',
			en: 'US',
			es: 'ES',
			et: 'EE',
			eu: 'ES',
			fi: 'FI',
			// fr: 'BE',
			// fr: 'CA',
			// fr: 'CH',
			fr: 'FR',
			he: 'IL',
			hr: 'HR',
			hu: 'HU',
			hy: 'AM',
			is: 'IS',
			// it: 'CH',
			it: 'IT',
			ja: 'JP',
			kk: 'KZ',
			ko: 'KR',
			lt: 'LT',
			// nl: 'BE',
			nl: 'NL',
			no: 'NO',
			pl: 'PL',
			pt: 'BR',
			// pt: 'PT',
			ro: 'RO',
			ru: 'RU',
			sk: 'SK',
			sl: 'SI',
			sr: 'YU',
			sv: 'SE',
			tr: 'TR',
			uk: 'UA',
			zh: 'CN',
		};
		if (Object.prototype.hasOwnProperty.call(languageVariants, parts[0])) {
			parts.push(languageVariants[parts[0]]);
		}
	} else {
		// Ensure the variant is uppercase to be a valid $LANG
		parts[1] = parts[1].toUpperCase();
	}
	return parts.join('_') + '.UTF-8';
}

export async function getCwd(
	shell: IShellLaunchConfig,
	userHome: string | undefined,
	variableResolver: VariableResolver | undefined,
	root: URI | undefined,
	customCwd: string | undefined,
	logService?: ILogService
): Promise<string> {
	if (shell.cwd) {
		const unresolved = (typeof shell.cwd === 'object') ? shell.cwd.fsPath : shell.cwd;
		const resolved = await _resolveCwd(unresolved, variableResolver);
		return sanitizeCwd(resolved || unresolved);
	}

	let cwd: string | undefined;

	if (!shell.ignoreConfigurationCwd && customCwd) {
		if (variableResolver) {
			customCwd = await _resolveCwd(customCwd, variableResolver, logService);
		}
		if (customCwd) {
			if (path.isAbsolute(customCwd)) {
				cwd = customCwd;
			} else if (root) {
				cwd = path.join(root.fsPath, customCwd);
			}
		}
	}

	// If there was no custom cwd or it was relative with no workspace
	if (!cwd) {
		cwd = root ? root.fsPath : userHome || '';
	}

	return sanitizeCwd(cwd);
}

async function _resolveCwd(cwd: string, variableResolver: VariableResolver | undefined, logService?: ILogService): Promise<string | undefined> {
	if (variableResolver) {
		try {
			return await variableResolver(cwd);
		} catch (e) {
			logService?.error('Could not resolve terminal cwd', e);
			return undefined;
		}
	}
	return cwd;
}

export type VariableResolver = (str: string) => Promise<string>;

export function createVariableResolver(lastActiveWorkspace: IWorkspaceFolder | undefined, env: IProcessEnvironment, configurationResolverService: IConfigurationResolverService | undefined): VariableResolver | undefined {
	if (!configurationResolverService) {
		return undefined;
	}
	return (str) => configurationResolverService.resolveWithEnvironment(env, lastActiveWorkspace, str);
}

export async function createTerminalEnvironment(
	shellLaunchConfig: IShellLaunchConfig,
	envFromConfig: ITerminalEnvironment | undefined,
	variableResolver: VariableResolver | undefined,
	version: string | undefined,
	detectLocale: 'auto' | 'off' | 'on',
	baseEnv: IProcessEnvironment
): Promise<IProcessEnvironment> {
	// Create a terminal environment based on settings, launch config and permissions
	const env: IProcessEnvironment = {};
	if (shellLaunchConfig.strictEnv) {
		// strictEnv is true, only use the requested env (ignoring null entries)
		mergeNonNullKeys(env, shellLaunchConfig.env);
	} else {
		// Merge process env with the env from config and from shellLaunchConfig
		mergeNonNullKeys(env, baseEnv);

		const allowedEnvFromConfig = { ...envFromConfig };

		// Resolve env vars from config and shell
		if (variableResolver) {
			if (allowedEnvFromConfig) {
				await resolveConfigurationVariables(variableResolver, allowedEnvFromConfig);
			}
			if (shellLaunchConfig.env) {
				await resolveConfigurationVariables(variableResolver, shellLaunchConfig.env);
			}
		}

		// Workaround for https://github.com/microsoft/vscode/issues/204005
		// We should restore the following environment variables when a user
		// launches the application using the CLI so that integrated terminal
		// can still inherit these variables.
		// We are not bypassing the restrictions implied in https://github.com/electron/electron/pull/40770
		// since this only affects integrated terminal and not the application itself.
		if (isMacintosh) {
			// Restore NODE_OPTIONS if it was set
			if (env['VSCODE_NODE_OPTIONS']) {
				env['NODE_OPTIONS'] = env['VSCODE_NODE_OPTIONS'];
				delete env['VSCODE_NODE_OPTIONS'];
			}

			// Restore NODE_REPL_EXTERNAL_MODULE if it was set
			if (env['VSCODE_NODE_REPL_EXTERNAL_MODULE']) {
				env['NODE_REPL_EXTERNAL_MODULE'] = env['VSCODE_NODE_REPL_EXTERNAL_MODULE'];
				delete env['VSCODE_NODE_REPL_EXTERNAL_MODULE'];
			}
		}

		// Sanitize the environment, removing any undesirable VS Code and Electron environment
		// variables
		sanitizeProcessEnvironment(env, 'VSCODE_IPC_HOOK_CLI');

		// Merge config (settings) and ShellLaunchConfig environments
		mergeEnvironments(env, allowedEnvFromConfig);
		mergeEnvironments(env, shellLaunchConfig.env);

		// Adding other env keys necessary to create the process
		addTerminalEnvironmentKeys(env, version, language, detectLocale);
	}
	return env;
}

/**
 * Takes a path and returns the properly escaped path to send to a given shell. On Windows, this
 * included trying to prepare the path for WSL if needed.
 *
 * @param originalPath The path to be escaped and formatted.
 * @param executable The executable off the shellLaunchConfig.
 * @param title The terminal's title.
 * @param shellType The type of shell the path is being sent to.
 * @param backend The backend for the terminal.
 * @param isWindowsFrontend Whether the frontend is Windows, this is only exposed for injection via
 * tests.
 * @returns An escaped version of the path to be executed in the terminal.
 */
export async function preparePathForShell(resource: string | URI, executable: string | undefined, title: string, shellType: TerminalShellType | undefined, backend: Pick<ITerminalBackend, 'getWslPath'> | undefined, os: OperatingSystem | undefined, isWindowsFrontend: boolean = isWindows): Promise<string> {
	let originalPath: string;
	if (isString(resource)) {
		originalPath = resource;
	} else {
		originalPath = resource.fsPath;
		// Apply backend OS-specific formatting to the path since URI.fsPath uses the frontend's OS
		if (isWindowsFrontend && os !== OperatingSystem.Windows) {
			originalPath = originalPath.replace(/\\/g, '\/');
		} else if (!isWindowsFrontend && os === OperatingSystem.Windows) {
			originalPath = originalPath.replace(/\//g, '\\');
		}
	}

	if (!executable) {
		return originalPath;
	}

	const hasSpace = originalPath.includes(' ');
	const hasParens = originalPath.includes('(') || originalPath.includes(')');

	const pathBasename = path.basename(executable, '.exe');
	const isPowerShell = pathBasename === 'pwsh' ||
		title === 'pwsh' ||
		pathBasename === 'powershell' ||
		title === 'powershell';

	if (isPowerShell && (hasSpace || originalPath.includes('\''))) {
		return `& '${originalPath.replace(/'/g, '\'\'')}'`;
	}

	if (hasParens && isPowerShell) {
		return `& '${originalPath}'`;
	}

	if (os === OperatingSystem.Windows) {
		// 17063 is the build number where wsl path was introduced.
		// Update Windows uriPath to be executed in WSL.
		if (shellType !== undefined) {
			if (shellType === WindowsShellType.GitBash) {
				return escapeNonWindowsPath(originalPath.replace(/\\/g, '/'), shellType);
			}
			else if (shellType === WindowsShellType.Wsl) {
				return backend?.getWslPath(originalPath, 'win-to-unix') || originalPath;
			}
			else if (hasSpace) {
				return `"${originalPath}"`;
			}
			return originalPath;
		}
		const lowerExecutable = executable.toLowerCase();
		if (lowerExecutable.includes('wsl') || (lowerExecutable.includes('bash.exe') && !lowerExecutable.toLowerCase().includes('git'))) {
			return backend?.getWslPath(originalPath, 'win-to-unix') || originalPath;
		} else if (hasSpace) {
			return `"${originalPath}"`;
		}
		return originalPath;
	}

	return escapeNonWindowsPath(originalPath, shellType);
}

export function getWorkspaceForTerminal(cwd: URI | string | undefined, workspaceContextService: IWorkspaceContextService, historyService: IHistoryService): IWorkspaceFolder | undefined {
	const cwdUri = isString(cwd) ? URI.parse(cwd) : cwd;
	let workspaceFolder = cwdUri ? workspaceContextService.getWorkspaceFolder(cwdUri) ?? undefined : undefined;
	if (!workspaceFolder) {
		// fallback to last active workspace if cwd is not available or it is not in workspace
		// TOOD: last active workspace is known to be unreliable, we should remove this fallback eventually
		const activeWorkspaceRootUri = historyService.getLastActiveWorkspaceRoot();
		workspaceFolder = activeWorkspaceRootUri ? workspaceContextService.getWorkspaceFolder(activeWorkspaceRootUri) ?? undefined : undefined;
	}
	return workspaceFolder;
}

export async function getUriLabelForShell(uri: URI | string, backend: Pick<ITerminalBackend, 'getWslPath'>, shellType?: TerminalShellType, os?: OperatingSystem, isWindowsFrontend: boolean = isWindows): Promise<string> {
	let path = isString(uri) ? uri : uri.fsPath;
	if (os === OperatingSystem.Windows) {
		if (shellType === WindowsShellType.Wsl) {
			return backend.getWslPath(path.replaceAll('/', '\\'), 'win-to-unix');
		} else if (shellType === WindowsShellType.GitBash) {
			// Convert \ to / and replace 'c:\' with '/c/'.
			return path.replaceAll('\\', '/').replace(/^([a-zA-Z]):\//, '/$1/');
		} else {
			// If the frontend is not Windows but the terminal is, convert / to \.
			path = isString(uri) ? path : uriToFsPath(uri, true);
			return !isWindowsFrontend ? path.replaceAll('/', '\\') : path;
		}
	} else {
		// If the frontend is Windows but the terminal is not, convert \ to /.
		return isWindowsFrontend ? path.replaceAll('\\', '/') : path;
	}
}

/**
 * Gets the unified duration to wait for shell integration after the terminal launches before
 * declaring the terminal lacks shell integration.
 */
export function getShellIntegrationTimeout(
	configurationService: IConfigurationService,
	siInjectionEnabled: boolean,
	isRemote: boolean,
	processReadyTimestamp?: number
): number {
	const timeoutValue = configurationService.getValue<unknown>(TerminalSettingId.ShellIntegrationTimeout);
	let timeoutMs: number;

	if (!isNumber(timeoutValue) || timeoutValue < 0) {
		timeoutMs = siInjectionEnabled ? 5000 : (isRemote ? 3000 : 2000);
	} else {
		timeoutMs = Math.max(timeoutValue, 500);
	}

	// Adjust timeout based on how long the process has already been running
	if (processReadyTimestamp !== undefined) {
		const elapsed = Date.now() - processReadyTimestamp;
		timeoutMs = Math.max(0, timeoutMs - elapsed);
	}

	return timeoutMs;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/terminalExtensionPoints.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/terminalExtensionPoints.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ITerminalContributionService, TerminalContributionService } from './terminalExtensionPoints.js';

registerSingleton(ITerminalContributionService, TerminalContributionService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/terminalExtensionPoints.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/terminalExtensionPoints.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as extensionsRegistry from '../../../services/extensions/common/extensionsRegistry.js';
import { terminalContributionsDescriptor } from './terminal.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IExtensionTerminalProfile, ITerminalCompletionProviderContribution, ITerminalContributions, ITerminalProfileContribution } from '../../../../platform/terminal/common/terminal.js';
import { URI } from '../../../../base/common/uri.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { isProposedApiEnabled } from '../../../services/extensions/common/extensions.js';
import { isObject, isString } from '../../../../base/common/types.js';

// terminal extension point
const terminalsExtPoint = extensionsRegistry.ExtensionsRegistry.registerExtensionPoint<ITerminalContributions>(terminalContributionsDescriptor);

export interface IExtensionTerminalCompletionProvider extends ITerminalCompletionProviderContribution {
	extensionIdentifier: string;
}

export interface ITerminalContributionService {
	readonly _serviceBrand: undefined;

	readonly terminalProfiles: ReadonlyArray<IExtensionTerminalProfile>;
	readonly terminalCompletionProviders: ReadonlyArray<IExtensionTerminalCompletionProvider>;
	readonly onDidChangeTerminalCompletionProviders: Event<void>;
}

export const ITerminalContributionService = createDecorator<ITerminalContributionService>('terminalContributionsService');

export class TerminalContributionService implements ITerminalContributionService {
	declare _serviceBrand: undefined;

	private _terminalProfiles: ReadonlyArray<IExtensionTerminalProfile> = [];
	get terminalProfiles() { return this._terminalProfiles; }

	private _terminalCompletionProviders: ReadonlyArray<IExtensionTerminalCompletionProvider> = [];
	get terminalCompletionProviders() { return this._terminalCompletionProviders; }

	private readonly _onDidChangeTerminalCompletionProviders = new Emitter<void>();
	readonly onDidChangeTerminalCompletionProviders = this._onDidChangeTerminalCompletionProviders.event;

	constructor() {
		terminalsExtPoint.setHandler(contributions => {
			this._terminalProfiles = contributions.map(c => {
				return c.value?.profiles?.filter(p => hasValidTerminalIcon(p)).map(e => {
					return { ...e, extensionIdentifier: c.description.identifier.value };
				}) || [];
			}).flat();

			this._terminalCompletionProviders = contributions.map(c => {
				if (!isProposedApiEnabled(c.description, 'terminalCompletionProvider')) {
					return [];
				}
				return c.value?.completionProviders?.map(p => {
					return { ...p, extensionIdentifier: c.description.identifier.value };
				}) || [];
			}).flat();

			this._onDidChangeTerminalCompletionProviders.fire();
		});
	}
}

function hasValidTerminalIcon(profile: ITerminalProfileContribution): boolean {
	function isValidDarkLightIcon(obj: unknown): obj is { light: URI; dark: URI } {
		return (
			isObject(obj) &&
			'light' in obj && URI.isUri(obj.light) &&
			'dark' in obj && URI.isUri(obj.dark)
		);
	}
	return !profile.icon || (
		isString(profile.icon) ||
		URI.isUri(profile.icon) ||
		isValidDarkLightIcon(profile.icon)
	);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/terminalStorageKeys.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/terminalStorageKeys.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum TerminalStorageKeys {
	SuggestedRendererType = 'terminal.integrated.suggestedRendererType',
	TabsListWidthHorizontal = 'tabs-list-width-horizontal',
	TabsListWidthVertical = 'tabs-list-width-vertical',
	TabsShowDetailed = 'terminal.integrated.tabs.showDetailed',
	DeprecatedEnvironmentVariableCollections = 'terminal.integrated.environmentVariableCollections',
	EnvironmentVariableCollections = 'terminal.integrated.environmentVariableCollectionsV2',
	TerminalBufferState = 'terminal.integrated.bufferState',
	TerminalLayoutInfo = 'terminal.integrated.layoutInfo',
	PinnedRecentCommandsPrefix = 'terminal.pinnedRecentCommands',
	TerminalSuggestSize = 'terminal.integrated.suggestSize',
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/common/terminalStrings.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/common/terminalStrings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';

/**
 * An object holding strings shared by multiple parts of the terminal
 */
export const terminalStrings = {
	terminal: localize('terminal', "Terminal"),
	new: localize('terminal.new', "New Terminal"),
	doNotShowAgain: localize('doNotShowAgain', 'Do Not Show Again'),
	currentSessionCategory: localize('currentSessionCategory', 'current session'),
	previousSessionCategory: localize('previousSessionCategory', 'previous session'),
	typeTask: localize('task', "Task"),
	typeLocal: localize('local', "Local"),
	actionCategory: localize2('terminalCategory', "Terminal"),
	focus: localize2('workbench.action.terminal.focus', "Focus Terminal"),
	focusInstance: localize2('workbench.action.terminal.focusInstance', "Focus Terminal"),
	focusAndHideAccessibleBuffer: localize2('workbench.action.terminal.focusAndHideAccessibleBuffer', "Focus Terminal and Hide Accessible Buffer"),
	kill: {
		...localize2('killTerminal', "Kill Terminal"),
		short: localize('killTerminal.short', "Kill"),
	},
	moveToEditor: localize2('moveToEditor', "Move Terminal into Editor Area"),
	moveIntoNewWindow: localize2('moveIntoNewWindow', "Move Terminal into New Window"),
	newInNewWindow: localize2('newInNewWindow', "New Terminal Window"),
	moveToTerminalPanel: localize2('workbench.action.terminal.moveToTerminalPanel', "Move Terminal into Panel"),
	changeIcon: localize2('workbench.action.terminal.changeIcon', "Change Icon..."),
	changeColor: localize2('workbench.action.terminal.changeColor', "Change Color..."),
	split: {
		...localize2('splitTerminal', "Split Terminal"),
		short: localize('splitTerminal.short', "Split"),
	},
	unsplit: localize2('unsplitTerminal', "Unsplit Terminal"),
	rename: localize2('workbench.action.terminal.rename', "Rename..."),
	toggleSizeToContentWidth: localize2('workbench.action.terminal.sizeToContentWidthInstance', "Toggle Size to Content Width"),
	focusHover: localize2('workbench.action.terminal.focusHover', "Focus Hover"),
	newWithCwd: localize2('workbench.action.terminal.newWithCwd', "Create New Terminal Starting in a Custom Working Directory"),
	renameWithArgs: localize2('workbench.action.terminal.renameWithArg', "Rename the Currently Active Terminal"),
	scrollToPreviousCommand: localize2('workbench.action.terminal.scrollToPreviousCommand', "Scroll to Previous Command"),
	scrollToNextCommand: localize2('workbench.action.terminal.scrollToNextCommand', "Scroll to Next Command"),
	revealCommand: localize2('workbench.action.terminal.revealCommand', "Reveal Command in Terminal"),
};
```

--------------------------------------------------------------------------------

````
