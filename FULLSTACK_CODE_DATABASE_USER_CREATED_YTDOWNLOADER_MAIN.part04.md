---
source_txt: user_created_projects/ytDownloader-main
converted_utc: 2025-12-18T18:22:27Z
part: 4
parts_total: 5
---

# FULLSTACK CODE DATABASE USER CREATED ytDownloader-main

## Verbatim Content (Part 4 of 5)

````text
================================================================================
FULLSTACK USER CREATED CODE DATABASE (VERBATIM) - ytDownloader-main
================================================================================
Generated: December 18, 2025
Source: user_created_projects/ytDownloader-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: src/renderer.js]---
Location: ytDownloader-main/src/renderer.js

```javascript
const {shell, ipcRenderer, clipboard} = require("electron");
const {default: YTDlpWrap} = require("yt-dlp-wrap-plus");
const {constants} = require("fs/promises");
const {homedir, platform} = require("os");
const {join} = require("path");
const {mkdirSync, accessSync, promises, existsSync} = require("fs");
const {execSync, spawn} = require("child_process");

const CONSTANTS = {
	DOM_IDS: {
		// Main UI
		PASTE_URL_BTN: "pasteUrl",
		LOADING_WRAPPER: "loadingWrapper",
		INCORRECT_MSG: "incorrectMsg",
		ERROR_BTN: "errorBtn",
		ERROR_DETAILS: "errorDetails",
		PATH_DISPLAY: "path",
		SELECT_LOCATION_BTN: "selectLocation",
		DOWNLOAD_LIST: "list",
		CLEAR_BTN: "clearBtn",
		// Hidden Info Panel
		HIDDEN_PANEL: "hidden",
		CLOSE_HIDDEN_BTN: "closeHidden",
		TITLE_CONTAINER: "title",
		TITLE_INPUT: "titleName",
		URL_INPUTS: ".url",
		AUDIO_PRESENT_SECTION: "audioPresent",
		QUIT_APP_BTN: "quitAppBtn",
		// Format Selectors
		VIDEO_FORMAT_SELECT: "videoFormatSelect",
		AUDIO_FORMAT_SELECT: "audioFormatSelect",
		AUDIO_FOR_VIDEO_FORMAT_SELECT: "audioForVideoFormatSelect",
		// Download Buttons
		VIDEO_DOWNLOAD_BTN: "videoDownload",
		AUDIO_DOWNLOAD_BTN: "audioDownload",
		EXTRACT_BTN: "extractBtn",
		// Audio Extraction
		EXTRACT_SELECTION: "extractSelection",
		EXTRACT_QUALITY_SELECT: "extractQualitySelect",
		// Advanced Options
		CUSTOM_ARGS_INPUT: "customArgsInput", // Add this line
		START_TIME: "min-time",
		END_TIME: "max-time",
		MIN_SLIDER: "min-slider",
		MAX_SLIDER: "max-slider",
		SLIDER_RANGE_HIGHLIGHT: "range-highlight",
		SUB_CHECKED: "subChecked",
		QUIT_CHECKED: "quitChecked",
		// Popups
		POPUP_BOX: "popupBox",
		POPUP_BOX_MAC: "popupBoxMac",
		POPUP_TEXT: "popupText",
		POPUP_SVG: "popupSvg",
		YTDLP_DOWNLOAD_PROGRESS: "ytDlpDownloadProgress",
		UPDATE_POPUP: "updatePopup",
		UPDATE_POPUP_PROGRESS: "updateProgress",
		UPDATE_POPUP_BAR: "progressBarFill",
		// Menu
		MENU_ICON: "menuIcon",
		MENU: "menu",
		PREFERENCE_WIN: "preferenceWin",
		ABOUT_WIN: "aboutWin",
		PLAYLIST_WIN: "playlistWin",
		HISTORY_WIN: "historyWin",
		COMPRESSOR_WIN: "compressorWin",
	},
	LOCAL_STORAGE_KEYS: {
		DOWNLOAD_PATH: "downloadPath",
		YT_DLP_PATH: "ytdlp",
		MAX_DOWNLOADS: "maxActiveDownloads",
		PREFERRED_VIDEO_QUALITY: "preferredVideoQuality",
		PREFERRED_AUDIO_QUALITY: "preferredAudioQuality",
		PREFERRED_VIDEO_CODEC: "preferredVideoCodec",
		SHOW_MORE_FORMATS: "showMoreFormats",
		BROWSER_COOKIES: "browser",
		PROXY: "proxy",
		CONFIG_PATH: "configPath",
		AUTO_UPDATE: "autoUpdate",
		CLOSE_TO_TRAY: "closeToTray",
		YT_DLP_CUSTOM_ARGS: "customYtDlpArgs",
	},
};

/**
 * Shorthand for document.getElementById.
 * @param {string} id The ID of the DOM element.
 * @returns {HTMLElement | null}
 */
const $ = (id) => document.getElementById(id);

class YtDownloaderApp {
	constructor() {
		this.state = {
			ytDlp: null,
			ytDlpPath: "",
			ffmpegPath: "",
			jsRuntimePath: "",
			downloadDir: "",
			maxActiveDownloads: 5,
			currentDownloads: 0,
			// Video metadata
			videoInfo: {
				title: "",
				thumbnail: "",
				duration: 0,
				extractor_key: "",
				url: "",
			},
			// Download options
			downloadOptions: {
				rangeCmd: "",
				rangeOption: "",
				subs: "",
				subLangs: "",
			},
			// Preferences
			preferences: {
				videoQuality: 1080,
				audioQuality: "",
				videoCodec: "avc1",
				showMoreFormats: false,
				proxy: "",
				browserForCookies: "",
				customYtDlpArgs: "",
			},
			downloadControllers: new Map(),
			downloadedItems: new Set(),
			downloadQueue: [],
		};
	}

	/**
	 * Initializes the application, setting up directories, finding executables,
	 * and attaching event listeners.
	 */
	async initialize() {
		await this._initializeTranslations();

		this._setupDirectories();
		this._configureTray();
		this._configureAutoUpdate();

		try {
			this.state.ytDlpPath = await this._findOrDownloadYtDlp();
			this.state.ytDlp = new YTDlpWrap(`"${this.state.ytDlpPath}"`);
			this.state.ffmpegPath = await this._findFfmpeg();
			this.state.jsRuntimePath = await this._getJsRuntimePath();

			console.log("yt-dlp path:", this.state.ytDlpPath);
			console.log("ffmpeg path:", this.state.ffmpegPath);
			console.log("JS runtime path:", this.state.jsRuntimePath);

			this._loadSettings();
			this._addEventListeners();

			// Signal to the main process that the renderer is ready for links
			ipcRenderer.send("ready-for-links");
		} catch (error) {
			console.error("Initialization failed:", error);
			$(CONSTANTS.DOM_IDS.INCORRECT_MSG).textContent = error.message;
			$(CONSTANTS.DOM_IDS.PASTE_URL_BTN).style.display = "none";
		}
	}

	/**
	 * Sets up the application's hidden directory and the default download directory.
	 */
	_setupDirectories() {
		const userHomeDir = homedir();
		const hiddenDir = join(userHomeDir, ".ytDownloader");

		if (!existsSync(hiddenDir)) {
			try {
				mkdirSync(hiddenDir, {recursive: true});
			} catch (error) {
				console.log(error);
			}
		}

		let defaultDownloadDir = join(userHomeDir, "Downloads");
		if (platform() === "linux") {
			try {
				const xdgDownloadDir = execSync("xdg-user-dir DOWNLOAD")
					.toString()
					.trim();
				if (xdgDownloadDir) {
					defaultDownloadDir = xdgDownloadDir;
				}
			} catch (err) {
				console.warn("Could not execute xdg-user-dir:", err.message);
			}
		}

		const savedPath = localStorage.getItem(
			CONSTANTS.LOCAL_STORAGE_KEYS.DOWNLOAD_PATH
		);
		if (savedPath) {
			try {
				accessSync(savedPath, constants.W_OK);
				this.state.downloadDir = savedPath;
			} catch {
				console.warn(
					`Cannot write to saved path "${savedPath}". Falling back to default.`
				);
				this.state.downloadDir = defaultDownloadDir;
				localStorage.setItem(
					CONSTANTS.LOCAL_STORAGE_KEYS.DOWNLOAD_PATH,
					defaultDownloadDir
				);
			}
		} else {
			this.state.downloadDir = defaultDownloadDir;
		}

		$(CONSTANTS.DOM_IDS.PATH_DISPLAY).textContent = this.state.downloadDir;

		if (!existsSync(this.state.downloadDir)) {
			mkdirSync(this.state.downloadDir, {recursive: true});
		}
	}

	/**
	 * Checks localStorage to determine if the tray icon should be used.
	 */
	_configureTray() {
		if (
			localStorage.getItem(CONSTANTS.LOCAL_STORAGE_KEYS.CLOSE_TO_TRAY) ===
			"true"
		) {
			console.log("Tray is enabled.");
			ipcRenderer.send("useTray", true);
		}
	}

	/**
	 * Checks settings to determine if auto-updates should be enabled.
	 */
	_configureAutoUpdate() {
		let autoUpdate = true;
		if (
			localStorage.getItem(CONSTANTS.LOCAL_STORAGE_KEYS.AUTO_UPDATE) ===
			"false"
		) {
			autoUpdate = false;
		}
		if (
			process.windowsStore ||
			process.env.YTDOWNLOADER_AUTO_UPDATES === "0"
		) {
			autoUpdate = false;
		}
		ipcRenderer.send("autoUpdate", autoUpdate);
	}

	/**
	 * Waits for the i18n module to load and then translates the static page content.
	 */
	async _initializeTranslations() {
		return new Promise((resolve) => {
			document.addEventListener(
				"translations-loaded",
				() => {
					window.i18n.translatePage();
					resolve();
				},
				{once: true}
			);
		});
	}

	/**
	 * Locates the yt-dlp executable path from various sources or downloads it.
	 * @returns {Promise<string>} A promise that resolves with the path to yt-dlp.
	 */
	async _findOrDownloadYtDlp() {
		const hiddenDir = join(homedir(), ".ytDownloader");
		const defaultYtDlpName = platform() === "win32" ? "ytdlp.exe" : "ytdlp";
		const defaultYtDlpPath = join(hiddenDir, defaultYtDlpName);
		const isMacOS = platform() === "darwin";
		const isFreeBSD = platform() === "freebsd";

		let executablePath = null;

		// PRIORITY 1: Environment Variable
		if (process.env.YTDOWNLOADER_YTDLP_PATH) {
			if (existsSync(process.env.YTDOWNLOADER_YTDLP_PATH)) {
				executablePath = process.env.YTDOWNLOADER_YTDLP_PATH;
			} else {
				throw new Error(
					"YTDOWNLOADER_YTDLP_PATH is set, but no file exists there."
				);
			}
		}

		// PRIORITY 2: macOS homebrew
		else if (isMacOS) {
			const possiblePaths = [
				"/opt/homebrew/bin/yt-dlp", // Apple Silicon
				"/usr/local/bin/yt-dlp", // Intel
			];

			executablePath = possiblePaths.find((p) => existsSync(p));

			// If Homebrew check fails, show popup and abort
			if (!executablePath) {
				$(CONSTANTS.DOM_IDS.POPUP_BOX_MAC).style.display = "block";
				console.warn("Homebrew yt-dlp not found. Prompting user.");

				return "";
			}
		}

		// PRIORITY 3: FreeBSD
		else if (isFreeBSD) {
			try {
				executablePath = execSync("which yt-dlp").toString().trim();
			} catch {
				throw new Error(
					"No yt-dlp found in PATH on FreeBSD. Please install it."
				);
			}
		}

		// PRIORITY 4: LocalStorage or Download (Windows/Linux)
		else {
			const storedPath = localStorage.getItem(
				CONSTANTS.LOCAL_STORAGE_KEYS.YT_DLP_PATH
			);

			if (storedPath && existsSync(storedPath)) {
				executablePath = storedPath;
			}
			// Download if missing
			else {
				executablePath = await this.ensureYtDlpBinary(defaultYtDlpPath);
			}
		}

		localStorage.setItem(
			CONSTANTS.LOCAL_STORAGE_KEYS.YT_DLP_PATH,
			executablePath
		);

		// Auto update
		this._runBackgroundUpdate(executablePath, isMacOS);

		return executablePath;
	}

	/**
	 * yt-dlp background update
	 */
	_runBackgroundUpdate(executablePath, isMacOS) {
		try {
			if (isMacOS) {
				const brewPaths = [
					"/opt/homebrew/bin/brew",
					"/usr/local/bin/brew",
				];
				const brewExec = brewPaths.find((p) => existsSync(p)) || "brew";

				const brewUpdate = spawn(brewExec, ["upgrade", "yt-dlp"]);

				brewUpdate.on("error", (err) =>
					console.error("Failed to run 'brew upgrade yt-dlp':", err)
				);
				brewUpdate.stdout.on("data", (data) =>
					console.log("yt-dlp brew update:", data.toString())
				);
			} else {
				const updateProc = spawn(executablePath, ["-U"]);

				updateProc.on("error", (err) =>
					console.error(
						"Failed to run background yt-dlp update:",
						err
					)
				);

				updateProc.stdout.on("data", (data) => {
					const output = data.toString();
					console.log("yt-dlp update check:", output);

					if (output.toLowerCase().includes("updating to")) {
						this._showPopup(i18n.__("updatingYtdlp"));
					} else if (
						output.toLowerCase().includes("updated yt-dlp to")
					) {
						this._showPopup(i18n.__("updatedYtdlp"));
					}
				});
			}
		} catch (err) {
			console.warn("Error initiating background update:", err);
		}
	}

	/**
	 * Checks for the presence of the yt-dlp binary at the default path.
	 * If not found, it attempts to download it from GitHub.
	 *
	 * @param {string} defaultYtDlpPath The expected path to the yt-dlp binary.
	 * @returns {Promise<string>} A promise that resolves with the path to the yt-dlp binary.
	 * @throws {Error} Throws an error if the download fails.
	 */
	async ensureYtDlpBinary(defaultYtDlpPath) {
		try {
			await promises.access(defaultYtDlpPath);

			return defaultYtDlpPath;
		} catch {
			console.log("yt-dlp not found, downloading...");

			$(CONSTANTS.DOM_IDS.POPUP_BOX).style.display = "block";
			$(CONSTANTS.DOM_IDS.POPUP_SVG).style.display = "inline";
			document.querySelector("#popupBox p").textContent = i18n.__(
				"downloadingNecessaryFilesWait"
			);

			try {
				await YTDlpWrap.downloadFromGithub(
					defaultYtDlpPath,
					undefined,
					undefined,
					(progress, _d, _t) => {
						$(
							CONSTANTS.DOM_IDS.YTDLP_DOWNLOAD_PROGRESS
						).textContent =
							i18n.__("progress") +
							`: ${(progress * 100).toFixed(2)}%`;
					}
				);

				$(CONSTANTS.DOM_IDS.POPUP_BOX).style.display = "none";

				localStorage.setItem(
					CONSTANTS.LOCAL_STORAGE_KEYS.YT_DLP_PATH,
					defaultYtDlpPath
				);

				return defaultYtDlpPath;
			} catch (downloadError) {
				$(CONSTANTS.DOM_IDS.YTDLP_DOWNLOAD_PROGRESS).textContent = "";

				console.error("Failed to download yt-dlp:", downloadError);

				document.querySelector("#popupBox p").textContent = i18n.__(
					"errorFailedFileDownload"
				);
				$(CONSTANTS.DOM_IDS.POPUP_SVG).style.display = "none";

				const tryAgainBtn = document.createElement("button");
				tryAgainBtn.id = "tryBtn";
				tryAgainBtn.textContent = i18n.__("tryAgain");
				tryAgainBtn.addEventListener("click", () => {
					// TODO: Improve it
					ipcRenderer.send("reload");
				});
				document.getElementById("popup").appendChild(tryAgainBtn);

				throw new Error("Failed to download yt-dlp.");
			}
		}
	}

	/**
	 * Locates the ffmpeg executable path.
	 * @returns {Promise<string>} A promise that resolves with the path to ffmpeg.
	 */
	async _findFfmpeg() {
		// Priority 1: Environment Variable
		if (process.env.YTDOWNLOADER_FFMPEG_PATH) {
			if (existsSync(process.env.YTDOWNLOADER_FFMPEG_PATH)) {
				return process.env.YTDOWNLOADER_FFMPEG_PATH;
			}
			throw new Error(
				"YTDOWNLOADER_FFMPEG_PATH is set, but no file exists there."
			);
		}

		// Priority 2: System-installed (FreeBSD)
		if (platform() === "freebsd") {
			try {
				return execSync("which ffmpeg").toString().trim();
			} catch {
				throw new Error(
					"No ffmpeg found in PATH on FreeBSD. App may not work correctly."
				);
			}
		}

		// Priority 3: Bundled ffmpeg
		return join(__dirname, "..", "ffmpeg", "bin");
	}

	/**
	 * Determines the JavaScript runtime path for yt-dlp.
	 * @returns {Promise<string>} A promise that resolves with the JS runtime path.
	 */
	async _getJsRuntimePath() {
		const exeName = "node";

		if (process.env.YTDOWNLOADER_NODE_PATH) {
			if (existsSync(process.env.YTDOWNLOADER_NODE_PATH)) {
				return `$node:"${process.env.YTDOWNLOADER_NODE_PATH}"`;
			}

			return "";
		}

		if (process.env.YTDOWNLOADER_DENO_PATH) {
			if (existsSync(process.env.YTDOWNLOADER_DENO_PATH)) {
				return `$deno:"${process.env.YTDOWNLOADER_DENO_PATH}"`;
			}

			return "";
		}

		if (platform() === "darwin") {
			const possiblePaths = [
				"/opt/homebrew/bin/deno",
				"/usr/local/bin/deno",
			];

			for (const p of possiblePaths) {
				if (existsSync(p)) {
					return `deno:"${p}"`;
				}
			}

			console.log("No Deno installation found");

			return "";
		}

		let jsRuntimePath = join(__dirname, "..", exeName);

		if (platform() === "win32") {
			jsRuntimePath = join(__dirname, "..", `${exeName}.exe`);
		}

		if (existsSync(jsRuntimePath)) {
			return `${exeName}:"${jsRuntimePath}"`;
		} else {
			return "";
		}
	}

	/**
	 * Loads various settings from localStorage into the application state.
	 */
	_loadSettings() {
		const prefs = this.state.preferences;
		prefs.videoQuality =
			Number(
				localStorage.getItem(
					CONSTANTS.LOCAL_STORAGE_KEYS.PREFERRED_VIDEO_QUALITY
				)
			) || 1080;
		prefs.audioQuality =
			localStorage.getItem(
				CONSTANTS.LOCAL_STORAGE_KEYS.PREFERRED_AUDIO_QUALITY
			) || "";
		prefs.videoCodec =
			localStorage.getItem(
				CONSTANTS.LOCAL_STORAGE_KEYS.PREFERRED_VIDEO_CODEC
			) || "avc1";
		prefs.showMoreFormats =
			localStorage.getItem(
				CONSTANTS.LOCAL_STORAGE_KEYS.SHOW_MORE_FORMATS
			) === "true";
		prefs.proxy =
			localStorage.getItem(CONSTANTS.LOCAL_STORAGE_KEYS.PROXY) || "";
		prefs.browserForCookies =
			localStorage.getItem(
				CONSTANTS.LOCAL_STORAGE_KEYS.BROWSER_COOKIES
			) || "";
		prefs.customYtDlpArgs =
			localStorage.getItem(
				CONSTANTS.LOCAL_STORAGE_KEYS.YT_DLP_CUSTOM_ARGS
			) || "";
		prefs.configPath = localStorage.getItem(CONSTANTS.LOCAL_STORAGE_KEYS.CONFIG_PATH) || "";

		const maxDownloads = Number(
			localStorage.getItem(CONSTANTS.LOCAL_STORAGE_KEYS.MAX_DOWNLOADS)
		);
		this.state.maxActiveDownloads = maxDownloads >= 1 ? maxDownloads : 5;

		// Update UI with loaded settings
		$(CONSTANTS.DOM_IDS.CUSTOM_ARGS_INPUT).value = prefs.customYtDlpArgs;

		const downloadDir = localStorage.getItem(
			CONSTANTS.LOCAL_STORAGE_KEYS.DOWNLOAD_PATH
		);

		if (downloadDir) {
			this.state.downloadDir = downloadDir;
			$(CONSTANTS.DOM_IDS.PATH_DISPLAY).textContent = downloadDir;
		}
	}

	/**
	 * Attaches all necessary event listeners for the UI.
	 */
	_addEventListeners() {
		$(CONSTANTS.DOM_IDS.PASTE_URL_BTN).addEventListener("click", () =>
			this.pasteAndGetInfo()
		);
		document.addEventListener("keydown", (event) => {
			if (
				((event.ctrlKey && event.key === "v") ||
					(event.metaKey &&
						event.key === "v" &&
						platform() === "darwin")) &&
				document.activeElement.tagName !== "INPUT" &&
				document.activeElement.tagName !== "TEXTAREA"
			) {
				$(CONSTANTS.DOM_IDS.PASTE_URL_BTN).classList.add("active");

				setTimeout(() => {
					$(CONSTANTS.DOM_IDS.PASTE_URL_BTN).classList.remove(
						"active"
					);
				}, 150);

				this.pasteAndGetInfo();
			}
		});

		// Download buttons
		$(CONSTANTS.DOM_IDS.VIDEO_DOWNLOAD_BTN).addEventListener("click", () =>
			this.handleDownloadRequest("video")
		);
		$(CONSTANTS.DOM_IDS.AUDIO_DOWNLOAD_BTN).addEventListener("click", () =>
			this.handleDownloadRequest("audio")
		);
		$(CONSTANTS.DOM_IDS.EXTRACT_BTN).addEventListener("click", () =>
			this.handleDownloadRequest("extract")
		);

		// UI controls
		$(CONSTANTS.DOM_IDS.CLOSE_HIDDEN_BTN).addEventListener("click", () =>
			this._hideInfoPanel()
		);
		$(CONSTANTS.DOM_IDS.SELECT_LOCATION_BTN).addEventListener("click", () =>
			ipcRenderer.send("select-location-main", "")
		);
		$(CONSTANTS.DOM_IDS.CLEAR_BTN).addEventListener("click", () =>
			this._clearAllDownloaded()
		);

		// Error details
		$(CONSTANTS.DOM_IDS.ERROR_DETAILS).addEventListener("click", (e) => {
			// @ts-ignore
			clipboard.writeText(e.target.innerText);
			this._showPopup(i18n.__("copiedText"), false);
		});

		$(CONSTANTS.DOM_IDS.QUIT_APP_BTN).addEventListener("click", () => {
			ipcRenderer.send("quit", "quit");
		});

		// IPC listeners
		ipcRenderer.on("link", (event, text) => this.getInfo(text));
		ipcRenderer.on("downloadPath", (event, downloadPath) => {
			try {
				accessSync(downloadPath[0], constants.W_OK);

				const newPath = downloadPath[0];
				$(CONSTANTS.DOM_IDS.PATH_DISPLAY).textContent = newPath;
				this.state.downloadDir = newPath;
			} catch (error) {
				console.log(error);
				this._showPopup(i18n.__("unableToAccessDir"), true);
			}
		});

		ipcRenderer.on("download-progress", (_event, percent) => {
			if (percent) {
				const popup = $(CONSTANTS.DOM_IDS.UPDATE_POPUP);
				const textEl = $(CONSTANTS.DOM_IDS.UPDATE_POPUP_PROGRESS);
				const barEl = $(CONSTANTS.DOM_IDS.UPDATE_POPUP_BAR);

				popup.style.display = "flex";
				textEl.textContent = `${percent.toFixed(1)}%`;
				barEl.style.width = `${percent}%`;
			}
		});

		ipcRenderer.on("update-downloaded", (_event, _) => {
			$(CONSTANTS.DOM_IDS.UPDATE_POPUP).style.display = "none";
		});

		// Menu Listeners
		const menuMapping = {
			[CONSTANTS.DOM_IDS.PREFERENCE_WIN]: "/preferences.html",
			[CONSTANTS.DOM_IDS.ABOUT_WIN]: "/about.html",
			[CONSTANTS.DOM_IDS.HISTORY_WIN]: "/history.html",
		};
		const windowMapping = {
			[CONSTANTS.DOM_IDS.PLAYLIST_WIN]: "/playlist.html",
			[CONSTANTS.DOM_IDS.COMPRESSOR_WIN]: "/compressor.html",
		};

		Object.entries(menuMapping).forEach(([id, page]) => {
			$(id)?.addEventListener("click", () => {
				this._closeMenu();
				ipcRenderer.send("load-page", join(__dirname, page));
			});
		});

		Object.entries(windowMapping).forEach(([id, page]) => {
			$(id)?.addEventListener("click", () => {
				this._closeMenu();
				ipcRenderer.send("load-win", join(__dirname, page));
			});
		});

		const minSlider = $(CONSTANTS.DOM_IDS.MIN_SLIDER);
		const maxSlider = $(CONSTANTS.DOM_IDS.MAX_SLIDER);

		minSlider.addEventListener("input", () =>
			this._updateSliderUI(minSlider)
		);
		maxSlider.addEventListener("input", () =>
			this._updateSliderUI(maxSlider)
		);

		$(CONSTANTS.DOM_IDS.START_TIME).addEventListener(
			"change",
			this._handleTimeInputChange
		);
		$(CONSTANTS.DOM_IDS.END_TIME).addEventListener(
			"change",
			this._handleTimeInputChange
		);

		this._updateSliderUI(null);
	}

	// --- Public Methods ---

	/**
	 * Pastes URL from clipboard and initiates fetching video info.
	 */
	pasteAndGetInfo() {
		this.getInfo(clipboard.readText());
	}

	/**
	 * Fetches video metadata from a given URL.
	 * @param {string} url The video URL.
	 */
	async getInfo(url) {
		this._loadSettings();
		this._defaultVideoToggle();
		this._resetUIForNewLink();
		this.state.videoInfo.url = url;

		try {
			const metadata = await this._fetchVideoMetadata(url);
			console.log(metadata);

			const durationInt =
				metadata.duration == null ? null : Math.ceil(metadata.duration);

			this.state.videoInfo = {
				...this.state.videoInfo,
				id: metadata.id,
				title: metadata.title,
				thumbnail: metadata.thumbnail,
				duration: durationInt,
				extractor_key: metadata.extractor_key,
			};
			this.setVideoLength(durationInt);
			this._populateFormatSelectors(metadata.formats || []);
			this._displayInfoPanel();
		} catch (error) {
			if (
				error.message.includes("js-runtimes") &&
				error.message.includes("no such option")
			) {
				this._showError(i18n.__("ytDlpUpdateRequired"), url);
			} else {
				this._showError(error.message, url);
			}
		} finally {
			$(CONSTANTS.DOM_IDS.LOADING_WRAPPER).style.display = "none";
		}
	}

	/**
	 * Handles a download request, either starting it immediately or queuing it.
	 * @param {'video' | 'audio' | 'extract'} type The type of download.
	 */
	handleDownloadRequest(type) {
		this._updateDownloadOptionsFromUI();

		const downloadJob = {
			type,
			url: this.state.videoInfo.url,
			title: this.state.videoInfo.title,
			thumbnail: this.state.videoInfo.thumbnail,
			options: {...this.state.downloadOptions},
			// Capture UI values at the moment of click
			uiSnapshot: {
				videoFormat: $(CONSTANTS.DOM_IDS.VIDEO_FORMAT_SELECT).value,
				audioForVideoFormat: $(
					CONSTANTS.DOM_IDS.AUDIO_FOR_VIDEO_FORMAT_SELECT
				).value,
				audioFormat: $(CONSTANTS.DOM_IDS.AUDIO_FORMAT_SELECT).value,
				extractFormat: $(CONSTANTS.DOM_IDS.EXTRACT_SELECTION).value,
				extractQuality: $(CONSTANTS.DOM_IDS.EXTRACT_QUALITY_SELECT)
					.value,
			},
		};

		if (this.state.currentDownloads < this.state.maxActiveDownloads) {
			this._startDownload(downloadJob);
		} else {
			this._queueDownload(downloadJob);
		}
		this._hideInfoPanel();
	}

	/**
	 * Executes yt-dlp to get video metadata in JSON format.
	 * @param {string} url The video URL.
	 * @returns {Promise<object>} A promise that resolves with the parsed JSON metadata.
	 */
	_fetchVideoMetadata(url) {
		return new Promise((resolve, reject) => {
			const {proxy, browserForCookies, configPath} =
				this.state.preferences;
			const args = [
				"-j",
				"--no-playlist",
				"--no-warnings",
				proxy ? "--proxy" : "",
				proxy,
				browserForCookies ? "--cookies-from-browser" : "",
				browserForCookies,
				this.state.jsRuntimePath
					? `--no-js-runtimes --js-runtime ${this.state.jsRuntimePath}`
					: "",
				configPath ? "--config-location" : "",
				configPath ? `"${configPath}"` : "",
				`"${url}"`,
			].filter(Boolean);

			const process = this.state.ytDlp.exec(args, {shell: true});

			console.log(
			"Spawned yt-dlp with args:",
			process.ytDlpProcess.spawnargs.join(" ")
		);

			let stdout = "";
			let stderr = "";

			process.ytDlpProcess.stdout.on("data", (data) => {
				stdout += data;
			});
			process.ytDlpProcess.stderr.on("data", (data) => (stderr += data));

			process.on("close", () => {
				if (stdout) {
					try {
						resolve(JSON.parse(stdout));
					} catch (e) {
						reject(
							new Error(
								"Failed to parse yt-dlp JSON output: " +
									(stderr || e.message)
							)
						);
					}
				} else {
					reject(
						new Error(
							stderr || `yt-dlp exited with a non-zero code.`
						)
					);
				}
			});

			process.on("error", (err) => reject(err));
		});
	}

	/**
	 * Starts the download process for a given job.
	 * @param {object} job The download job object.
	 */
	_startDownload(job) {
		this.state.currentDownloads++;
		const randomId = "item_" + Math.random().toString(36).substring(2, 12);

		const {downloadArgs, finalFilename, finalExt} =
			this._prepareDownloadArgs(job);

		this._createDownloadUI(randomId, job);

		const controller = new AbortController();
		this.state.downloadControllers.set(randomId, controller);

		const downloadProcess = this.state.ytDlp.exec(downloadArgs, {
			shell: true,
			detached: false,
			signal: controller.signal,
		});

		console.log(
			"Spawned yt-dlp with args:",
			downloadProcess.ytDlpProcess.spawnargs.join(" ")
		);

		// Attach event listeners
		downloadProcess
			.on("progress", (progress) => {
				this._updateProgressUI(randomId, progress);
			})
			.once("ytDlpEvent", () => {
				const el = $(`${randomId}_prog`);
				if (el) el.textContent = i18n.__("downloading");
			})
			// .on("ytDlpEvent", (eventType, eventData) => {
			// 	console.log(eventData)
			// })
			.once("close", (code) => {
				this._handleDownloadCompletion(
					code,
					randomId,
					finalFilename,
					finalExt,
					job.thumbnail
				);
			})
			.once("error", (error) => {
				this.state.downloadedItems.add(randomId);
				this._updateClearAllButton();

				this._handleDownloadError(error, randomId);
			});
	}

	/**
	 * Queues a download job if the maximum number of active downloads is reached.
	 * @param {object} job The download job object.
	 */
	_queueDownload(job) {
		const randomId = "queue_" + Math.random().toString(36).substring(2, 12);
		this.state.downloadQueue.push({...job, queueId: randomId});
		const itemHTML = `
            <div class="item" id="${randomId}">
                <div class="itemIconBox">
                    <img src="${
						job.thumbnail || "../assets/images/thumb.png"
					}" alt="thumbnail" class="itemIcon" crossorigin="anonymous">
                    <span class="itemType">${i18n.__(
						job.type === "video" ? "video" : "audio"
					)}</span>
                </div>
                <div class="itemBody">
                    <div class="itemTitle">${job.title}</div>
                    <p>${i18n.__("preparing")}</p>
                </div>
            </div>`;
		$(CONSTANTS.DOM_IDS.DOWNLOAD_LIST).insertAdjacentHTML(
			"beforeend",
			itemHTML
		);
	}

	/**
	 * Checks the queue and starts the next download if a slot is available.
	 */
	_processQueue() {
		if (
			this.state.downloadQueue.length > 0 &&
			this.state.currentDownloads < this.state.maxActiveDownloads
		) {
			const nextJob = this.state.downloadQueue.shift();
			// Remove the pending UI element
			$(nextJob.queueId)?.remove();
			this._startDownload(nextJob);
		}
	}

	/**
	 * Prepares the command-line arguments for yt-dlp based on the download job.
	 * @param {object} job The download job object.
	 * @returns {{downloadArgs: string[], finalFilename: string, finalExt: string}}
	 */
	_prepareDownloadArgs(job) {
		const {type, url, title, options, uiSnapshot} = job;
		const {rangeOption, rangeCmd, subs, subLangs} = options;
		const {proxy, browserForCookies, configPath} = this.state.preferences;

		let format_id, ext, audioForVideoFormat_id, audioFormat;

		if (type === "video") {
			const [videoFid, videoExt, _, videoCodec] =
				uiSnapshot.videoFormat.split("|");
			const [audioFid, audioExt] =
				uiSnapshot.audioForVideoFormat.split("|");

			format_id = videoFid;
			audioForVideoFormat_id = audioFid;

			const finalAudioExt = audioExt === "webm" ? "opus" : audioExt;

			ext = videoExt;

			if (videoExt === "mp4" && finalAudioExt === "opus") {
				if (videoCodec.includes("avc")) ext = "mkv";
				else if (videoCodec.includes("av01")) ext = "webm";
			} else if (
				videoExt === "webm" &&
				["m4a", "mp4"].includes(finalAudioExt)
			) {
				ext = "mkv";
			}

			audioFormat =
				audioForVideoFormat_id === "none"
					? ""
					: `+${audioForVideoFormat_id}`;
		} else if (type === "audio") {
			[format_id, ext] = uiSnapshot.audioFormat.split("|");
			ext = ext === "webm" ? "opus" : ext;
		} else {
			// type === 'extract'
			ext =
				{alac: "m4a"}[uiSnapshot.extractFormat] ||
				uiSnapshot.extractFormat;
		}

		const invalidChars =
			platform() === "win32" ? /[<>:"/\\|?*[\]`#]/g : /["/`#]/g;
		let finalFilename = title
			.replace(invalidChars, "")
			.trim()
			.slice(0, 100);
		if (finalFilename.startsWith(".")) {
			finalFilename = finalFilename.substring(1);
		}
		if (rangeCmd) {
			let rangeTxt = rangeCmd.replace("*", "");
			if (platform() === "win32") rangeTxt = rangeTxt.replace(/:/g, "_");
			finalFilename += ` [${rangeTxt}]`;
		}

		const outputPath = `"${join(
			this.state.downloadDir,
			`${finalFilename}.${ext}`
		)}"`;

		const baseArgs = [
			"--no-playlist",
			"--no-mtime",
			browserForCookies ? "--cookies-from-browser" : "",
			browserForCookies,
			proxy ? "--proxy" : "",
			proxy,
			configPath ? "--config-location" : "",
			configPath ? `"${configPath}"` : "",
			"--ffmpeg-location",
			`"${this.state.ffmpegPath}"`,
			this.state.jsRuntimePath
				? `--no-js-runtimes --js-runtime ${this.state.jsRuntimePath}`
				: "",
		].filter(Boolean);

		if (type === "audio") {
			if (ext === "m4a" || ext === "mp3" || ext === "mp4") {
				baseArgs.unshift("--embed-thumbnail");
			}
		} else if (type === "extract") {
			if (ext === "mp3" || ext === "m4a") {
				baseArgs.unshift("--embed-thumbnail");
			}
		}

		let downloadArgs;
		if (type === "extract") {
			downloadArgs = [
				"-x",
				"--audio-format",
				uiSnapshot.extractFormat,
				"--audio-quality",
				uiSnapshot.extractQuality,
				"-o",
				outputPath,
				...baseArgs,
			];
		} else {
			const formatString =
				type === "video" ? `${format_id}${audioFormat}` : format_id;
			downloadArgs = ["-f", formatString, "-o", outputPath, ...baseArgs];
		}

		if (subs) downloadArgs.push(subs);
		if (subLangs) downloadArgs.push(subLangs);
		if (rangeOption) downloadArgs.push(rangeOption, rangeCmd);

		const customArgsString = $(
			CONSTANTS.DOM_IDS.CUSTOM_ARGS_INPUT
		).value.trim();
		if (customArgsString) {
			const customArgs = customArgsString.split(/\s+/);
			downloadArgs.push(...customArgs);
		}

		downloadArgs.push(`"${url}"`);

		return {downloadArgs, finalFilename, finalExt: ext};
	}

	/**
	 * Handles the completion of a download process.
	 */
	_handleDownloadCompletion(code, randomId, filename, ext, thumbnail) {
		this.state.currentDownloads--;
		this.state.downloadControllers.delete(randomId);

		if (code === 0) {
			this._showDownloadSuccessUI(randomId, filename, ext, thumbnail);
			this.state.downloadedItems.add(randomId);
			this._updateClearAllButton();
		} else if (code !== null) {
			// code is null if aborted, so only show error if it's a real exit code
			this._handleDownloadError(
				new Error(`Download process exited with code ${code}.`),
				randomId
			);
		}

		this._processQueue();

		if ($(CONSTANTS.DOM_IDS.QUIT_CHECKED).checked) {
			ipcRenderer.send("quit", "quit");
		}
	}

	/**
	 * Handles an error during the download process.
	 */
	_handleDownloadError(error, randomId) {
		if (
			error.name === "AbortError" ||
			error.message.includes("AbortError")
		) {
			console.log(`Download ${randomId} was aborted.`);
			this.state.currentDownloads = Math.max(
				0,
				this.state.currentDownloads - 1
			);
			this.state.downloadControllers.delete(randomId);
			this._processQueue();
			return; // Don't treat user cancellation as an error
		}
		this.state.currentDownloads--;
		this.state.downloadControllers.delete(randomId);
		console.error("Download Error:", error);
		const progressEl = $(`${randomId}_prog`);
		if (progressEl) {
			progressEl.textContent = i18n.__("errorHoverForDetails");
			progressEl.title = error.message;
		}
		this._processQueue();
	}

	/**
	 * Updates the download options state from the UI elements.
	 */
	_updateDownloadOptionsFromUI() {
		const startTime = $(CONSTANTS.DOM_IDS.START_TIME).value;
		const endTime = $(CONSTANTS.DOM_IDS.END_TIME).value;
		const duration = this.state.videoInfo.duration;

		const startSeconds = this.parseTime(startTime);
		const endSeconds = this.parseTime(endTime);

		if (
			startSeconds === 0 &&
			(endSeconds === duration || endSeconds === 0)
		) {
			this.state.downloadOptions.rangeCmd = "";
			this.state.downloadOptions.rangeOption = "";
		} else {
			const start = startTime || "0";
			const end = endTime || "inf";
			this.state.downloadOptions.rangeCmd = `*${start}-${end}`;
			this.state.downloadOptions.rangeOption = "--download-sections";
		}

		if ($(CONSTANTS.DOM_IDS.SUB_CHECKED).checked) {
			this.state.downloadOptions.subs = "--write-subs";
			this.state.downloadOptions.subLangs = "--sub-langs all";
		} else {
			this.state.downloadOptions.subs = "";
			this.state.downloadOptions.subLangs = "";
		}
	}

	/**
	 * Resets the UI state for a new link.
	 */
	_resetUIForNewLink() {
		this._hideInfoPanel();
		$(CONSTANTS.DOM_IDS.LOADING_WRAPPER).style.display = "flex";
		$(CONSTANTS.DOM_IDS.INCORRECT_MSG).textContent = "";
		$(CONSTANTS.DOM_IDS.ERROR_BTN).style.display = "none";
		$(CONSTANTS.DOM_IDS.ERROR_DETAILS).style.display = "none";
		$(CONSTANTS.DOM_IDS.VIDEO_FORMAT_SELECT).innerHTML = "";
		$(CONSTANTS.DOM_IDS.AUDIO_FORMAT_SELECT).innerHTML = "";
		const noAudioTxt = i18n.__("noAudio");
		$(
			CONSTANTS.DOM_IDS.AUDIO_FOR_VIDEO_FORMAT_SELECT
		).innerHTML = `<option value="none|none">${noAudioTxt}</option>`;
	}

	/**
	 * Populates the video and audio format <select> elements.
	 * @param {Array} formats The formats array from yt-dlp metadata.
	 */
	_populateFormatSelectors(formats) {
		const videoSelect = $(CONSTANTS.DOM_IDS.VIDEO_FORMAT_SELECT);
		const audioSelect = $(CONSTANTS.DOM_IDS.AUDIO_FORMAT_SELECT);
		const audioForVideoSelect = $(
			CONSTANTS.DOM_IDS.AUDIO_FOR_VIDEO_FORMAT_SELECT
		);

		const NBSP = " ";

		let maxVideoQualityLen = 0;
		let maxAudioQualityLen = 0;

		formats.forEach((format) => {
			if (format.video_ext !== "none" && format.vcodec !== "none") {
				const quality = `${format.height || "???"}p${
					format.fps === 60 ? "60" : ""
				}`;
				if (quality.length > maxVideoQualityLen) {
					maxVideoQualityLen = quality.length;
				}
			} else if (
				format.acodec !== "none" &&
				format.video_ext === "none"
			) {
				const formatNote =
					i18n.__(format.format_note) || i18n.__("unknownQuality");
				if (formatNote.length > maxAudioQualityLen) {
					maxAudioQualityLen = formatNote.length;
				}
			}
		});

		const videoQualityPadding = maxVideoQualityLen;
		const audioQualityPadding = maxAudioQualityLen;

		const extPadding = 5; // "mp4", "webm"
		const vcodecPadding = 5; // "avc1", "vp9"
		const filesizePadding = 10; // "12.48 MB"

		const {videoQuality, videoCodec, showMoreFormats} =
			this.state.preferences;
		let bestMatchHeight = 0;

		formats.forEach((f) => {
			if (
				f.height &&
				f.height <= videoQuality &&
				f.height > bestMatchHeight &&
				f.video_ext !== "none"
			) {
				bestMatchHeight = f.height;
			}
		});
		if (bestMatchHeight === 0 && formats.length > 0) {
			bestMatchHeight = Math.max(
				...formats.filter((f) => f.height).map((f) => f.height)
			);
		}
		const availableCodecs = new Set(
			formats
				.filter((f) => f.height === bestMatchHeight && f.vcodec)
				.map((f) => f.vcodec.split(".")[0])
		);
		const finalCodec = availableCodecs.has(videoCodec)
			? videoCodec
			: [...availableCodecs].pop();
		let isAVideoSelected = false;

		formats.forEach((format) => {
			let sizeInMB = null;
			let isApprox = false;

			if (format.filesize) {
				sizeInMB = format.filesize / 1000000;
			} else if (format.filesize_approx) {
				sizeInMB = format.filesize_approx / 1000000;
				isApprox = true;
			} else if (this.state.videoInfo.duration && format.tbr) {
				sizeInMB = (this.state.videoInfo.duration * format.tbr) / 8192;
				isApprox = true;
			}

			const displaySize = sizeInMB
				? `${isApprox ? "~" : ""}${sizeInMB.toFixed(2)} MB`
				: i18n.__("unknownSize");

			if (format.video_ext !== "none" && format.vcodec !== "none") {
				if (
					!showMoreFormats &&
					(format.ext === "webm" || format.vcodec?.startsWith("vp"))
				) {
					return;
				}
				let isSelected = false;
				if (
					!isAVideoSelected &&
					format.height === bestMatchHeight &&
					format.vcodec?.startsWith(finalCodec)
				) {
					isSelected = true;
					isAVideoSelected = true;
				}

				const quality = `${format.height || "???"}p${
					format.fps === 60 ? "60" : ""
				}`;
				const hasAudio = format.acodec !== "none" ? " 🔊" : "";

				const col1 = quality.padEnd(videoQualityPadding + 1, NBSP);
				const col2 = format.ext.padEnd(extPadding, NBSP);
				const col4 = displaySize.padEnd(filesizePadding, NBSP);

				let optionText;
				if (showMoreFormats) {
					const vcodec = format.vcodec?.split(".")[0] || "";
					const col3 = vcodec.padEnd(vcodecPadding, NBSP);
					optionText = `${col1} | ${col2} | ${col3} | ${col4}${hasAudio}`;
				} else {
					optionText = `${col1} | ${col2} | ${col4}${hasAudio}`;
				}

				const option = `<option value="${format.format_id}|${
					format.ext
				}|${format.height}|${format.vcodec}" ${
					isSelected ? "selected" : ""
				}>${optionText}</option>`;

				videoSelect.innerHTML += option;
			} else if (
				format.acodec !== "none" &&
				format.video_ext === "none"
			) {
				if (!showMoreFormats && format.ext === "webm") return;

				const audioExt = format.ext === "webm" ? "opus" : format.ext;
				const formatNote =
					i18n.__(format.format_note) || i18n.__("unknownQuality");

				const audioExtPadded = audioExt.padEnd(extPadding, NBSP);

				const audioQualityPadded = formatNote.padEnd(
					audioQualityPadding,
					NBSP
				);
				const audioSizePadded = displaySize.padEnd(
					filesizePadding,
					NBSP
				);

				const option_audio = `<option value="${format.format_id}|${audioExt}">${audioQualityPadded} | ${audioExtPadded} | ${audioSizePadded}</option>`;

				audioSelect.innerHTML += option_audio;
				audioForVideoSelect.innerHTML += option_audio;
			}
		});

		if (
			formats.every((f) => f.acodec === "none" || f.acodec === undefined)
		) {
			$(CONSTANTS.DOM_IDS.AUDIO_PRESENT_SECTION).style.display = "none";
		} else {
			$(CONSTANTS.DOM_IDS.AUDIO_PRESENT_SECTION).style.display = "block";
		}
	}

	/**
	 * Shows the hidden panel with video information.
	 */
	_displayInfoPanel() {
		const info = this.state.videoInfo;
		const titleContainer = $(CONSTANTS.DOM_IDS.TITLE_CONTAINER);

		titleContainer.innerHTML = ""; // Clear previous content
		titleContainer.append(
			Object.assign(document.createElement("b"), {
				textContent: i18n.__("title") + ": ",
			}),
			Object.assign(document.createElement("input"), {
				className: "title",
				id: CONSTANTS.DOM_IDS.TITLE_INPUT,
				type: "text",
				value: `${info.title} [${info.id}]`,
				onchange: (e) => (this.state.videoInfo.title = e.target.value),
			})
		);

		document
			.querySelectorAll(CONSTANTS.DOM_IDS.URL_INPUTS)
			.forEach((el) => {
				el.value = info.url;
			});

		const hiddenPanel = $(CONSTANTS.DOM_IDS.HIDDEN_PANEL);
		hiddenPanel.style.display = "inline-block";
		hiddenPanel.classList.add("scaleUp");
	}

	/**
	 * Creates the initial UI element for a new download.
	 */
	_createDownloadUI(randomId, job) {
		const itemHTML = `
            <div class="item" id="${randomId}">
                <div class="itemIconBox">
                    <img src="${
						job.thumbnail || "../assets/images/thumb.png"
					}" alt="thumbnail" class="itemIcon" crossorigin="anonymous">
                    <span class="itemType">${i18n.__(
						job.type === "video" ? "video" : "audio"
					)}</span>
                </div>
                <img src="../assets/images/close.png" class="itemClose" id="${randomId}_close">
                <div class="itemBody">
                    <div class="itemTitle">${job.title}</div>
                    <strong class="itemSpeed" id="${randomId}_speed"></strong>
                    <div id="${randomId}_prog" class="itemProgress">${i18n.__(
			"preparing"
		)}</div>
                </div>
            </div>`;
		$(CONSTANTS.DOM_IDS.DOWNLOAD_LIST).insertAdjacentHTML(
			"beforeend",
			itemHTML
		);

		$(`${randomId}_close`).addEventListener("click", () =>
			this._cancelDownload(randomId)
		);
	}

	/**
	 * Updates the progress bar and speed for a download item.
	 */
	_updateProgressUI(randomId, progress) {
		const speedEl = $(`${randomId}_speed`);
		const progEl = $(`${randomId}_prog`);
		if (!speedEl || !progEl) return;

		let fillEl = progEl.querySelector(".custom-progress-fill");

		if (!fillEl) {
			progEl.innerHTML = "";

			const bar = document.createElement("div");
			bar.className = "custom-progress";

			fillEl = document.createElement("div");
			fillEl.className = "custom-progress-fill";

			bar.appendChild(fillEl);
			progEl.appendChild(bar);
		}

		if (progress.percent === 100) {
			fillEl.style.width = progress.percent + "%";
			speedEl.textContent = "";
			progEl.textContent = i18n.__("processing");
			ipcRenderer.send("progress", 0);

			return;
		}

		speedEl.textContent = `${i18n.__("speed")}: ${
			progress.currentSpeed || "0 B/s"
		}`;
		fillEl.style.width = progress.percent + "%";

		ipcRenderer.send("progress", progress.percent / 100);
	}

	/**
	 * Updates a download item's UI to show it has completed successfully.
	 */
	_showDownloadSuccessUI(randomId, filename, ext, thumbnail) {
		const progressEl = $(`${randomId}_prog`);
		if (!progressEl) return;

		const fullFilename = `${filename}.${ext}`;
		const fullPath = join(this.state.downloadDir, fullFilename);

		progressEl.innerHTML = ""; // Clear progress bar
		const link = document.createElement("b");
		link.textContent = i18n.__("fileSavedClickToOpen");
		link.style.cursor = "pointer";
		link.onclick = () => {
			ipcRenderer.send("show-file", fullPath);
		};
		progressEl.appendChild(link);
		$(`${randomId}_speed`).textContent = "";

		// Send desktop notification
		new Notification("ytDownloader", {
			body: fullFilename,
			icon: thumbnail,
		}).onclick = () => {
			shell.showItemInFolder(fullPath);
		};

		// Add to download history
		promises
			.stat(fullPath)
			.then((stat) => {
				const fileSize = stat.size || 0;
				ipcRenderer
					.invoke("add-to-history", {
						title: this.state.videoInfo.title,
						url: this.state.videoInfo.url,
						filename: filename,
						filePath: fullPath,
						fileSize: fileSize,
						format: ext,
						thumbnail: thumbnail,
						duration: this.state.videoInfo.duration,
					})
					.catch((err) =>
						console.error("Error adding to history:", err)
					);
			})
			.catch((error) => console.error("Error saving to history:", error));
	}

	/**
	 * Shows an error message in the main UI.
	 */
	_showError(errorMessage, url) {
		$(CONSTANTS.DOM_IDS.INCORRECT_MSG).textContent =
			i18n.__("errorNetworkOrUrl");
		$(CONSTANTS.DOM_IDS.ERROR_BTN).style.display = "inline-block";
		const errorDetails = $(CONSTANTS.DOM_IDS.ERROR_DETAILS);
		errorDetails.innerHTML = `<strong>URL: ${url}</strong><br><br>${errorMessage}`;
		errorDetails.title = i18n.__("clickToCopy");
	}

	/**
	 * Hides the info panel with an animation.
	 */
	_hideInfoPanel() {
		const panel = $(CONSTANTS.DOM_IDS.HIDDEN_PANEL);
		if (panel.style.display !== "none") {
			panel.classList.remove("scaleUp");
			panel.classList.add("scale");
			setTimeout(() => {
				panel.style.display = "none";
				panel.classList.remove("scale");
			}, 400);
		}
	}

	/**
	 * Displays a temporary popup message.
	 */
	_showPopup(text, isError = false) {
		let popupContainer = document.getElementById("popupContainer");

		if (!popupContainer) {
			popupContainer = document.createElement("div");
			popupContainer.id = "popupContainer";
			popupContainer.className = "popup-container";
			document.body.appendChild(popupContainer);
		}

		const popup = document.createElement("span");
		popup.textContent = text;
		popup.classList.add("popup-item");

		popup.style.background = isError ? "#ff6b6b" : "#54abde";

		if (isError) {
			popup.classList.add("popup-error");
		}

		popupContainer.appendChild(popup);

		setTimeout(() => {
			popup.style.opacity = "0";
			setTimeout(() => {
				popup.remove();
				if (popupContainer.childElementCount === 0) {
					popupContainer.remove();
				}
			}, 1000);
		}, 2200);
	}

	/**
	 * Hides the main menu.
	 */
	_closeMenu() {
		$(CONSTANTS.DOM_IDS.MENU_ICON).style.transform = "rotate(0deg)";
		$(CONSTANTS.DOM_IDS.MENU).style.opacity = "0";
		setTimeout(
			() => ($(CONSTANTS.DOM_IDS.MENU).style.display = "none"),
			500
		);
	}

	/**
	 * Cancels a download in progress or removes it from the queue.
	 * @param {string} id The ID of the download item.
	 */
	_cancelDownload(id) {
		// If it's an active download
		if (this.state.downloadControllers.has(id)) {
			this.state.downloadControllers.get(id).abort();
		}
		// If it's in the queue
		this.state.downloadQueue = this.state.downloadQueue.filter(
			(job) => job.queueId !== id
		);

		// If it has been downloaded, remove from the set
		this.state.downloadedItems.delete(id);

		this._fadeAndRemoveItem(id);
		this._updateClearAllButton();
	}

	/**
	 * Fades and removes a DOM element.
	 */
	_fadeAndRemoveItem(id) {
		const item = $(id);
		if (item) {
			item.classList.add("scale");
			setTimeout(() => item.remove(), 500);
		}
	}

	/**
	 * Removes all completed download items from the UI.
	 */
	_clearAllDownloaded() {
		this.state.downloadedItems.forEach((id) => this._fadeAndRemoveItem(id));
		this.state.downloadedItems.clear();
		this._updateClearAllButton();
	}

	/**
	 * Shows or hides the "Clear All" button based on the number of completed items.
	 */
	_updateClearAllButton() {
		const btn = $(CONSTANTS.DOM_IDS.CLEAR_BTN);
		btn.style.display =
			this.state.downloadedItems.size > 1 ? "inline-block" : "none";
	}

	/**
	 * Toggles between audio and video tabs
	 */
	_defaultVideoToggle() {
		let defaultWindow = "video";
		if (localStorage.getItem("defaultWindow")) {
			defaultWindow = localStorage.getItem("defaultWindow");
		}
		if (defaultWindow == "video") {
			selectVideo();
		} else {
			selectAudio();
		}
	}

	/**
	 * @param {string} timeString
	 */
	parseTime(timeString) {
		const parts = timeString.split(":").map((p) => parseInt(p.trim(), 10));

		let totalSeconds = 0;

		if (parts.length === 3) {
			// H:MM:SS format
			const [hrs, mins, secs] = parts;
			if (
				isNaN(hrs) ||
				isNaN(mins) ||
				isNaN(secs) ||
				mins < 0 ||
				mins > 59 ||
				secs < 0 ||
				secs > 59
			)
				return NaN;
			totalSeconds = hrs * 3600 + mins * 60 + secs;
		} else if (parts.length === 2) {
			// MM:SS format
			const [mins, secs] = parts;
			if (isNaN(mins) || isNaN(secs) || secs < 0 || secs > 59) return NaN;
			totalSeconds = mins * 60 + secs;
		} else if (parts.length === 1) {
			const [secs] = parts;
			if (isNaN(secs)) return NaN;
			totalSeconds = secs;
		} else {
			return NaN;
		}

		return totalSeconds;
	}

	_formatTime(duration) {
		if (duration === null) {
			return "";
		}

		const hrs = Math.floor(duration / 3600);
		const mins = Math.floor((duration % 3600) / 60);
		const secs = Math.floor(duration % 60);

		const paddedMins = String(mins).padStart(2, "0");
		const paddedSecs = String(secs).padStart(2, "0");

		if (hrs > 0) {
			// H:MM:SS format
			return `${hrs}:${paddedMins}:${paddedSecs}`;
		} else {
			// MM:SS format
			return `${paddedMins}:${paddedSecs}`;
		}
	}

	/**
	 * @param {HTMLElement} movedSlider
	 */
	_updateSliderUI(movedSlider) {
		const minSlider = $(CONSTANTS.DOM_IDS.MIN_SLIDER);
		const maxSlider = $(CONSTANTS.DOM_IDS.MAX_SLIDER);
		const minTimeDisplay = $(CONSTANTS.DOM_IDS.START_TIME);
		const maxTimeDisplay = $(CONSTANTS.DOM_IDS.END_TIME);
		const rangeHighlight = $(CONSTANTS.DOM_IDS.SLIDER_RANGE_HIGHLIGHT);

		let minValue = parseInt(minSlider.value);
		let maxValue = parseInt(maxSlider.value);
		const minSliderVal = parseInt(minSlider.min);
		const maxSliderVal = parseInt(minSlider.max);
		const sliderRange = maxSliderVal - minSliderVal;

		// Prevent sliders from crossing each other
		if (minValue >= maxValue) {
			if (movedSlider && movedSlider.id === "min-slider") {
				// Min must be at least 1 second less than Max
				minValue = Math.max(minSliderVal, maxValue - 1);
				minSlider.value = minValue;
			} else {
				// Max must be at least 1 second more than Min
				maxValue = Math.min(maxSliderVal, minValue + 1);
				maxSlider.value = maxValue;
			}
		}

		minTimeDisplay.value = this._formatTime(minValue);
		maxTimeDisplay.value = this._formatTime(maxValue);

		const minPercent = ((minValue - minSliderVal) / sliderRange) * 100;
		const maxPercent = ((maxValue - minSliderVal) / sliderRange) * 100;

		rangeHighlight.style.left = `${minPercent}%`;
		rangeHighlight.style.width = `${maxPercent - minPercent}%`;
	}

	/**
	 * @param {Event} e
	 */
	_handleTimeInputChange = (e) => {
		const input = e.target;
		let newSeconds = this.parseTime(input.value);
		const minSlider = $("min-slider");
		const maxSlider = $("max-slider");

		if (isNaN(newSeconds)) {
			input.value = this._formatTime(
				input.id === "min-time" ? minSlider.value : maxSlider.value
			);
			return;
		}

		const minSliderVal = parseInt(minSlider.min);
		const maxSliderVal = parseInt(minSlider.max);
		newSeconds = Math.max(minSliderVal, Math.min(maxSliderVal, newSeconds));

		if (input.id === "min-time") {
			if (newSeconds >= parseInt(maxSlider.value)) {
				newSeconds = Math.max(
					minSliderVal,
					parseInt(maxSlider.value) - 1
				);
			}
			minSlider.value = newSeconds;
		} else {
			if (newSeconds <= parseInt(minSlider.value)) {
				newSeconds = Math.min(
					maxSliderVal,
					parseInt(minSlider.value) + 1
				);
			}
			maxSlider.value = newSeconds;
		}

		this._updateSliderUI(null);
	};

	/**
	 * Sets the maximum duration for the video and updates the slider's max range.
	 * @param {number} duration - The total length of the video in seconds (must be an integer >= 1).
	 */
	setVideoLength(duration) {
		const minSlider = $(CONSTANTS.DOM_IDS.MIN_SLIDER);
		const maxSlider = $(CONSTANTS.DOM_IDS.MAX_SLIDER);

		if (typeof duration !== "number" || duration < 1) {
			console.error(
				"Invalid duration provided to setVideoLength. Must be a number greater than 0."
			);

			minSlider.max = 0;
			maxSlider.max = 0;

			minSlider.value = 0;
			maxSlider.value = 0;

			return;
		}

		minSlider.max = duration;
		maxSlider.max = duration;

		const defaultMin = 0;
		const defaultMax = duration;

		minSlider.value = defaultMin;
		maxSlider.value = defaultMax;

		this._updateSliderUI(null);
	}
}

// --- Application Entry Point ---
document.addEventListener("DOMContentLoaded", () => {
	const app = new YtDownloaderApp();
	app.initialize();
});
```

--------------------------------------------------------------------------------

---[FILE: src/types.d.ts]---
Location: ytDownloader-main/src/types.d.ts

```typescript
type format = {
    vcodec?: string,
    acodec?: string,
    ext: string,
    filesize?: number,
    format_id: string,
    format_note: string,
    height: number,
    resolution: string,
    video_ext: string,
    audio_ext: string,
    filesize_approx?: number,
    tbr: number,
    fps: number,
}

type info = {
    title: string,
    id: string,
    thumbnail: string,
    duration: number,
    formats: format[],
    extractor_key: string,
}

export {
    format,
    info
}
```

--------------------------------------------------------------------------------

---[FILE: translations/ar-SA.json]---
Location: ytDownloader-main/translations/ar-SA.json

```json
{
	"preferences": "الإعدادات",
	"about": "عن التطبيق",
	"downloadLocation": "مسار التنزيل",
	"currentDownloadLocation": "مسار التنزيل الحالي ",
	"enableTransparentDarkMode": "تشغيل الوضع الداكن الشفاف (لينكس فقط، يحتاج إعادة تشغيل للبرنامج)",
	"downloadingNecessaryFilesWait": "بالرجاء الانتظار، يتم تنزيل الملفات الضرورية",
	"video": "فيديو",
	"audio": "صوت",
	"title": "العنوان ",
	"selectFormat": "اختر الصيغة ",
	"download": "تحميل",
	"selectDownloadLocation": "اختر مسار التنزيل",
	"moreOptions": "المزيد من الخيارات",
	"start": "ابدأ",
	"selectLanguageRelaunch": "اختر اللغة (يحتاج إعادة تشغيل للبرنامج)",
	"downloadTimeRange": "تنزيل نطاق زمني محدد",
	"end": "إنهاء",
	"timeRangeStartEmptyHint": "إذا تُركت فارغة، ستبدأ من البداية",
	"timeRangeEndEmptyHint": "إذا تُركت فارغة، سيتم التنزيل حتى النهاية",
	"homepage": "الصَّفحة الرئيسة",
	"aboutAppDescription": "إنه تطبيق مجاني ومفتوح المصدر مبني على Node.js و Electron. تم استخدام yt-dlp للتنزيل",
	"sourceCodeAvailable": "كود المصدر متاح ",
	"here": "هنا",
	"processing": "جارٍ المعالجة",
	"errorNetworkOrUrl": "حدثت بعض الأخطاء. تفحص الإنترنت الخاص بك واستخدم الرابط الصحيح",
	"errorFailedFileDownload": "فشل تنزيل الملفات الضرورية. بالرجاء تفحص الإنترنت الخاص بك والمحاولة مرة أُخرى",
	"tryAgain": "حاول مجددًا",
	"unknownSize": "حجم غير معلوم",
	"megabyte": "ميجابايت",
	"unknownQuality": "جودة غير معروفة",
	"downloading": "جاري التحميل...",
	"errorHoverForDetails": "حدثت بعض المشاكل. ضع المؤشر هُنا لترى التفاصيل",
	"fileSavedSuccessfully": "تم حفظ المِلَف بنجاح",
	"fileSavedClickToOpen": "تم حفظ المِلَف. انقر للفتح",
	"preparing": "قيد التحضير...",
	"progress": "مستوى التقدُّم",
	"speed": "السرعة",
	"quality": "الجودة",
	"restartApp": "أعد تشغيل التطبيق",
	"subtitles": "الترجمة",
	"downloadSubtitlesAvailable": "حمّل الترجَمة إذا وجدت",
	"downloadSubtitlesAuto": "حمّل التّرجَمة التي تم إنشاؤها تِلقائيا",
	"extractAudioFromVideo": "استخرج الصوت من الفيديو",
	"extract": "استخرج",
	"downloadingNecessaryFiles": "جاري تحميل الملفات الضرورية",
	"qualityLow": "منخفضة",
	"qualityMedium": "متوسطة",
	"appDescription": "يتيح لك YtDownloader تنزيل مقاطع الفيديو والصوت من مئات المواقع مثل يوتيوب، وفيسبوك، وإنستاغرام، وتيكتوك، وتويتر وما إلى ذلك",
	"pasteText": "انقر للصق رابط الفيديو من الحافظة",
	"pastePlaylistLinkTooltip": "انقر للصق رابط قائمة التشغيل من الحافظة",
	"link": "الرابط:",
	"downloadingPlaylist": "جاري تنزيل قائمة التشغيل:",
	"downloadPlaylistButton": "حمِل قائمة تشغيل",
	"playlistDownloaded": "تم تنزيل قائمة التشغيل",
	"cookiesWarning": "يتيح هذا الخِيار تنزيل المحتوى المقيد. ستجد أخطاء إذا لم توجد ملفات تعريف الارتباط",
	"selectBrowserForCookies": "اختر المتصفح لاستخدام ملفات تعريف الارتباط منه",
	"none": "لا شَيْء",
	"updateAvailableDownloadPrompt": "يتوفر إصدار جديد من البرنامج ، هل تريد تنزيله؟",
	"updateAvailablePrompt": "يتوفر إصدار جديد من البرنامج ، هل تريد تنزيله؟",
	"update": "حدّث",
	"no": "لا",
	"installAndRestartPrompt": "هل تريد التثبيت وإعادة التشغيل الآن؟",
	"restart": "إعادة تشغيل البرنامَج",
	"later": "في وقت لاحق",
	"extractAudio": "استخرج الصوت",
	"selectVideoFormat": "اختر صيغة الفيديو ",
	"selectAudioFormat": "اختر صيغة الصوت ",
	"maxActiveDownloads": "أقصى عدد للتنزيلات الجارية",
	"preferredVideoQuality": "جودة الفيديو المفضلة",
	"preferredAudioFormat": "صيغة الصوت المفضلة",
	"best": "الأفضل",
	"fileSaved": "تم حفظ الملف",
	"openDownloadFolder": "فتح مجلد التنزيل",
	"path": "المسار:",
	"selectConfigFile": "اختر مِلَف الإعداد",
	"useConfigFile": "استخدام مِلَف الإعداد",
	"playlistFilenameFormat": "صيغة تسميه الملفات لقوائم التشغيل",
	"playlistFolderNameFormat": "صيغة تسميه المجلدات لقوائم التشغيل",
	"resetToDefault": "إعادة الإعدادات الافتراضية",
	"playlistRange": "نطاق قائمة التشغيل",
	"thumbnail": "الصورة المصغرة",
	"linkAdded": "تم إضافة الرابط",
	"downloadThumbnails": "تنزيل الصور المصغرة",
	"saveVideoLinksToFile": "حفظ روابط الفيديو إلى مِلَف",
	"closeAppToTray": "إغلاق التطبيق إلى غطاء النظام",
	"useConfigFileCheckbox": "استخدم مِلَف الإعداد",
	"openApp": "فتح تطبيق",
	"pasteVideoLink": "لصق رابط الفيديو",
	"quit": "خروج",
	"errorDetails": "تفاصيل الخطأ",
	"clickToCopy": "انقر للنسخ",
	"copiedText": "نص منسوخ",
	"qualityNormal": "عادي",
	"qualityGood": "جيد",
	"qualityBad": "سىء",
	"qualityWorst": "أسوأ",
	"selectQuality": "حدد الجودة",
	"disableAutoUpdates": "تعطيل التحديثات التلقائية",
	"qualityUltraLow": "منخفضه جداً",
	"closeAppOnFinish": "إغلاق التطبيق عند انتهاء التنزيل",
	"auto": "تلقائي",
	"theme": "السمة",
	"themeLight": "فاتح",
	"themeDark": "داكن",
	"themeFrappe": "Frappé",
	"themeOneDark": "One Dark",
	"themeMatrix": "مصفوفة",
	"themeSolarizedDark": "داكن مُشمس",
	"preferredVideoCodec": "ترميز الفيديو المفضل",
	"showMoreFormatOptions": "إظهار المزيد من خيارات التنسيق",
	"flatsealPermissionWarning": "تحتاج إلى إعطاء الإذن للتطبيق للوصول إلى المجلد الرئيس لاستخدام هذا. يمكنك ذلك باستخدام Flatseal عن طريق تمكين الإذن ذو النص 'filesystem=home'",
	"noAudio": "دون صوت",
	"proxy": "الوكيل",
	"clearDownloads": "مسح سجل التنزيلات",
	"compressor": "ضاغط",
	"dragAndDropFiles": "اسحب وأفلت الملف(الملفات)",
	"chooseFiles": "اختر ملف(ملفات)",
	"noFilesSelected": "لم يتم اختيار أي ملفات",
	"videoFormat": "صيغة الفيديو",
	"videoEncoder": "مُرمز الفيديو",
	"compressionSpeed": "سرعة الضغط",
	"videoQuality": "جودة الفيديو",
	"audioFormat": "صيغة الصوت",
	"outputSuffix": "لاحقة المخرجات",
	"outputInSameFolder": "إخراج في نفس المجلد",
	"selectCustomFolder": "اختر مجلدًا مخصصًا",
	"startCompression": "بدء الضغط",
	"cancel": "إلغاء",
	"errorClickForDetails": "خطأ! انقر للتفاصيل",
	"homebrewYtDlpWarning": "يجب عليك تنزيل yt-dlp من homebrew أولاً",
	"openHomebrew": "افتح Homebrew",
	"downloadHistory": "سجل التنزيلات",
	"close": "إغلاق",
	"searchByTitleOrUrl": "ابحث بالعنوان أو الرابط...",
	"allFormats": "جميع الصيغ",
	"exportAsJson": "تصدير كـ JSON",
	"exportAsCsv": "تصدير كـ CSV",
	"clearAllHistory": "مسح كل السجل",
	"noDownloadsYet": "لا توجد تنزيلات بعد",
	"downloadHistoryPlaceholder": "سيظهر سجل التنزيلات الخاص بك هنا",
	"format": "الصيغة",
	"size": "الحجم",
	"date": "التاريخ",
	"duration": "المدة",
	"copyUrl": "نسخ الرابط",
	"open": "فتح",
	"delete": "حذف",
	"totalDownloads": "إجمالي التنزيلات",
	"totalSize": "إجمالي الحجم",
	"mostCommonFormat": "الصيغة الأكثر شيوعًا",
	"urlCopiedToClipboard": "تم نسخ الرابط إلى الحافظة!",
	"confirmDeleteHistoryItem": "هل أنت متأكد من أنك تريد حذف هذا العنصر من السجل؟",
	"confirmClearAllHistory": "هل أنت متأكد من أنك تريد مسح كل سجل التنزيلات؟ لا يمكن التراجع عن هذا!",
	"fileDoesNotExist": "File does not exist anymore",
	"updatingYtdlp": "Updating yt-dlp",
	"updatedYtdlp": "Updated yt-dlp",
	"ytDlpUpdateRequired": "If yt-dlp is updating, wait for the update to finish. If you have installed yt-dlp by yourself, please update it.",
	"failedToDeleteHistoryItem": "Failed to delete history item",
	"customArgsTxt": "Set custom yt-dlp options.",
	"learnMore": "Learn more",
	"updateError": "An error occurred during the update process",
	"unableToAccessDir": "The program cannot access that folder",
	"downloadingUpdate": "Downloading update"
}
```

--------------------------------------------------------------------------------

---[FILE: translations/bn-BD.json]---
Location: ytDownloader-main/translations/bn-BD.json

```json
{
	"preferences": "পছন্দসমূহ",
	"about": "তথ্য",
	"downloadLocation": "ডাউনলোডগুলির স্থান",
	"currentDownloadLocation": "এই মুহূর্তে ডাউনলোড রত ফাইল এর অবস্থান ",
	"enableTransparentDarkMode": "স্বচ্ছল ডার্ক মোড চালু করুন (শুধুমাত্র লিনাক্স এ কার্যকর, অ্যাপ বন্ধ করে চালু করতে হবে)",
	"downloadingNecessaryFilesWait": "অপেক্ষা করুন, দরকারি ফাইল সমূহ ডাউনলোড হচ্ছে",
	"video": "ভিডিও",
	"audio": "অডিও",
	"title": "নাম ",
	"selectFormat": "ফরমেট বেছে নিন ",
	"download": "ডাউনলোড",
	"selectDownloadLocation": "ফাইল ডাউনলোড এর স্থান বেছে নিন",
	"moreOptions": "আরও অপশন দেখান",
	"start": "শুরু",
	"selectLanguageRelaunch": "ভাষা বেছে নিন (বন্ধ করে চালু করতে হবে)",
	"downloadTimeRange": "নির্ধারিত সময় সীমা এর মাঝের টুকু ডাউনলোড করো",
	"end": "শেষ",
	"timeRangeStartEmptyHint": "খালি রাখলে প্রথম থেকে শুরু হবে",
	"timeRangeEndEmptyHint": "খালি রাখলে শেষ সীমা শেষ এ হবে|",
	"homepage": "হোমপেজ",
	"aboutAppDescription": "এটি একটি মুক্ত/উন্মুক্ত উৎস সফটওয়্যার যা Node.js এবং Electron বেবহার করে | yt-dlp ডাউনলোড এর জন্য ব্যবহৃত হয় |",
	"sourceCodeAvailable": "উৎস কোড টি প্রদান করা হয়েছে ",
	"here": "এখানে",
	"processing": "প্রক্রিয়াকরণ চলমান",
	"errorNetworkOrUrl": "কোনো ত্রুটি দেখা দিয়েছে| আপনার নেটওয়ার্ক চেক করুন এবং সঠিক ইউআরএল ব্যবহার করুন",
	"errorFailedFileDownload": "দরকারি ফাইল সমূহ ডাউনলোড করা যায়নি| নেটওয়ার্ক চেক করে পুনরায় চেষ্টা করুন",
	"tryAgain": "আবার চেষ্টা করুন",
	"unknownSize": "ফাইল সাইজ জানা নেই",
	"megabyte": "এমবি",
	"unknownQuality": "ভিডিও কোয়ালিটি অজানা",
	"downloading": "ডাউনলোড হচ্ছে...",
	"errorHoverForDetails": "কোনো ত্রুটি দেখা দিয়েছে| এর উপরে মাউস রেখে আরও তথ্য দেখুন",
	"fileSavedSuccessfully": "ডাউনলোড প্রক্রিয়া সফল হয়েছে",
	"fileSavedClickToOpen": "ফাইল সেভ হয়েছে| খুলতে ক্লিক করুন",
	"preparing": "প্রস্তুত হচ্ছে...",
	"progress": "অবস্থান",
	"speed": "স্পিড",
	"quality": "কোয়ালিটি",
	"restartApp": "অ্যাপ পুনরায় চালু করুন",
	"subtitles": "সাবটাইটেল",
	"downloadSubtitlesAvailable": "সাবটাইটেল থাকলে ডাউনলোড করুন",
	"downloadSubtitlesAuto": "অটো জেনারেটেড সাবটাইটেল ডাউনলোড করুন",
	"extractAudioFromVideo": "ভিডিও থেকে অডিও আলাদা করুন",
	"extract": "আলাদা করুন",
	"downloadingNecessaryFiles": "দরকারি ফাইল সমূহ ডাউনলোড করুন",
	"qualityLow": "নিম্ন",
	"qualityMedium": "মদ্ধ",
	"appDescription": "ytDownloader এর মাধ্যমে আপনি নানান ওয়েবসাইট থেকে ভিডিও এবং অডিও ডাউনলোড করতে পারবেন| যেমন ইউটুবে, ফেইসবুক, ইনস্টাগ্রাম, টুইটার ইত্যাদি",
	"pasteText": "ক্লিপবোর্ড থেকে ভিডিও লিংক পেস্ট করতে ক্লিক করুন",
	"pastePlaylistLinkTooltip": "ক্লিপবোর্ড থেকে প্লেলিস্ট লিংক পেস্ট করতে ক্লিক করুন",
	"link": "লিংক:",
	"downloadingPlaylist": "প্লেলিস্ট ডাউনলোড হচ্ছে:",
	"downloadPlaylistButton": "প্লেলিস্ট ডাউনলোড করো",
	"playlistDownloaded": "প্লেলিস্ট ডাউনলোড শেষ",
	"cookiesWarning": "এর মাধ্যমে আপনি রেস্ট্রিক্টেড কনটেন্ট ডাউনলোড করতে পারবেন| \"কুকিজ\" না থাকলে সমস্যা দেখা দিবে",
	"selectBrowserForCookies": "কুকিজ সিলেক্ট করতে ব্রাউসার বেছে নিন",
	"none": "কোনটাই না",
	"updateAvailableDownloadPrompt": "নতুন ভার্সন পাওয়া গেছে, আপনি কি সেটা ডাউনলোড করতে চান?",
	"updateAvailablePrompt": "নতুন ভার্সন পাওয়া গেছে, আপনি কি আপডেট করতে চান?",
	"update": "আপডেট",
	"no": "না",
	"installAndRestartPrompt": "ইনস্টল করে রিস্টার্ট করবো এখনই?",
	"restart": "রিস্টার্ট",
	"later": "পরে",
	"extractAudio": "অডিও আলাদা করুন",
	"selectVideoFormat": "ভিডিও ফরমেট বেছে নিন ",
	"selectAudioFormat": "অডিও ফরমেট বেছে নিন ",
	"maxActiveDownloads": "সর্বোচ্চ কত গুলো ডাউনলোড একই মুহূর্তে চলতে পারবে",
	"preferredVideoQuality": "পছন্দের ভিডিও কোয়ালিটি",
	"preferredAudioFormat": "পছন্দের অডিও ফরমেট",
	"best": "সেরা",
	"fileSaved": "ফাইল সেভ হয়েছে",
	"openDownloadFolder": "ডাউনলোড ফোল্ডার খুলুন",
	"path": "পথ:",
	"selectConfigFile": "কনফিগ ফাইল বেছে নিন",
	"useConfigFile": "কনফিগ ফাইল ব্যবহার করুন",
	"playlistFilenameFormat": "ফাইল এর নাম এর ফরমেট",
	"playlistFolderNameFormat": "প্লেলিস্ট এর ফোল্ডার গুলির নাম এর ফরমেট",
	"resetToDefault": "পুনরায় ডিফল্টে চলে যান",
	"playlistRange": "প্লেলিস্ট এর রেঞ্জ",
	"thumbnail": "থাম্বনেইল",
	"linkAdded": "লিংক যুক্ত হয়েছে",
	"downloadThumbnails": "থাম্বনেইল ডাউনলোড করুন",
	"saveVideoLinksToFile": "ভিডিও লিংক গুলো একটি ফাইল এ সেভ করুন",
	"closeAppToTray": "অ্যাপ মিনি মাইজ করুন",
	"useConfigFileCheckbox": "কনফিগ ফাইল ব্যবহার করুন",
	"openApp": "অ্যাপ খুলুন",
	"pasteVideoLink": "ভিডিও লিংক পেস্ট করুন",
	"quit": "বন্ধ",
	"errorDetails": "সমস্যার বিবরণ",
	"clickToCopy": "কপি করতে ক্লিক করুন",
	"copiedText": "লেখা কপি হয়েছে",
	"qualityNormal": "সাধারণ",
	"qualityGood": "ভালো",
	"qualityBad": "খারাপ",
	"qualityWorst": "সবচেয়ে খারাপ",
	"selectQuality": "কোয়ালিটি বেছে নিন",
	"disableAutoUpdates": "নিজ থেকে আপডেট হওয়া বন্ধ করুন",
	"qualityUltraLow": "সর্বনিম্ন",
	"closeAppOnFinish": "ডাউনলোড শেষ হলে অ্যাপ নিজেথেকে বন্ধ হয়ে যাক",
	"auto": "অটো",
	"theme": "থিম",
	"themeLight": "লাইট",
	"themeDark": "ডার্ক",
	"themeFrappe": "ফ্রাপে",
	"themeOneDark": "ওয়ান ডার্ক",
	"themeMatrix": "মেট্রিক্স",
	"themeSolarizedDark": "সোলাররাইসড ডার্ক",
	"preferredVideoCodec": "পছন্দের ভিডিও কোডেক",
	"showMoreFormatOptions": "আরও ফরমেট অপসন দেখান",
	"flatsealPermissionWarning": "আপনাকে এই অ্যাপ তা কে যথাযথ অনুমতি দিতে হবে. এইটা করতে পারেন \"ফ্ল্যাটসিল\" নামক অ্যাপ এর মাদ্ধমে 'filesystem=home' হিসেবে চিহ্নিত পারমিশন তা কে চালু করে দিয়ে|",
	"noAudio": "অডিও বিহীন",
	"proxy": "প্রক্সী",
	"clearDownloads": "ডাউনলোড লিস্ট মুছে দিন",
	"compressor": "কম্প্রেসার",
	"dragAndDropFiles": "ফাইল(গুলি) টেনে এনে রাখুন",
	"chooseFiles": "ফাইল(গুলি) বেছে নিন",
	"noFilesSelected": "কোনো ফাইল বেছে নেওয়া হয়নি",
	"videoFormat": "ভিডিও ফরম্যাট",
	"videoEncoder": "ভিডিও এনকোডার",
	"compressionSpeed": "কম্প্রেশন স্পিড",
	"videoQuality": "ভিডিও কোয়ালিটি",
	"audioFormat": "অডিও ফরম্যাট",
	"outputSuffix": "আউটপুট সাফিক্স",
	"outputInSameFolder": "একই ফোল্ডারে আউটপুট",
	"selectCustomFolder": "কাস্টম ফোল্ডার বেছে নিন",
	"startCompression": "কম্প্রেশন শুরু করুন",
	"cancel": "বাতিল",
	"errorClickForDetails": "ত্রুটি! বিস্তারিত জানতে ক্লিক করুন",
	"homebrewYtDlpWarning": "আপনাকে প্রথমে হোমব্রু থেকে yt-dlp ডাউনলোড করতে হবে",
	"openHomebrew": "হোমব্রু খুলুন",
	"downloadHistory": "ডাউনলোড ইতিহাস",
	"close": "বন্ধ করুন",
	"searchByTitleOrUrl": "শিরোনাম বা ইউআরএল দিয়ে খুঁজুন...",
	"allFormats": "সব ফরম্যাট",
	"exportAsJson": "JSON হিসাবে রপ্তানি করুন",
	"exportAsCsv": "CSV হিসাবে রপ্তানি করুন",
	"clearAllHistory": "সমস্ত ইতিহাস মুছে ফেলুন",
	"noDownloadsYet": "এখনো কোনো ডাউনলোড নেই",
	"downloadHistoryPlaceholder": "আপনার ডাউনলোড ইতিহাস এখানে দেখা যাবে",
	"format": "ফরম্যাট",
	"size": "সাইজ",
	"date": "তারিখ",
	"duration": "সময়কাল",
	"copyUrl": "ইউআরএল কপি করুন",
	"open": "খুলুন",
	"delete": "মুছে ফেলুন",
	"totalDownloads": "মোট ডাউনলোড",
	"totalSize": "মোট সাইজ",
	"mostCommonFormat": "সবচেয়ে সাধারণ ফরম্যাট",
	"urlCopiedToClipboard": "ইউআরএল ক্লিপবোর্ডে কপি করা হয়েছে!",
	"confirmDeleteHistoryItem": "আপনি কি নিশ্চিত যে আপনি ইতিহাস থেকে এই আইটেমটি মুছে ফেলতে চান?",
	"confirmClearAllHistory": "আপনি কি নিশ্চিত যে আপনি সমস্ত ডাউনলোড ইতিহাস মুছে ফেলতে চান? এটি পূর্বাবস্থায় ফেরানো যাবে না!",
	"fileDoesNotExist": "File does not exist anymore",
	"updatingYtdlp": "Updating yt-dlp",
	"updatedYtdlp": "Updated yt-dlp",
	"ytDlpUpdateRequired": "If yt-dlp is updating, wait for the update to finish. If you have installed yt-dlp by yourself, please update it.",
	"failedToDeleteHistoryItem": "Failed to delete history item",
	"customArgsTxt": "Set custom yt-dlp options.",
	"learnMore": "Learn more",
	"updateError": "An error occurred during the update process",
	"unableToAccessDir": "The program cannot access that folder",
	"downloadingUpdate": "Downloading update"
}
```

--------------------------------------------------------------------------------

---[FILE: translations/de-DE.json]---
Location: ytDownloader-main/translations/de-DE.json

```json
{
	"preferences": "Einstellungen",
	"about": "Über",
	"downloadLocation": "Download-Verzeichnis",
	"currentDownloadLocation": "Aktuelles Download-Verzeichnis - ",
	"enableTransparentDarkMode": "Aktiviere transparenten Dunkelmodus (nur Linux, Neustart erforderlich)",
	"downloadingNecessaryFilesWait": "Bitte warten, notwendige Dateien werden heruntergeladen",
	"video": "Video",
	"audio": "Audio",
	"title": "Titel ",
	"selectFormat": "Wähle Format ",
	"download": "Download",
	"selectDownloadLocation": "Wähle Download-Verzeichnis",
	"moreOptions": "Weitere Optionen",
	"start": "Start",
	"selectLanguageRelaunch": "Sprache wählen (Neustart erforderlich)",
	"downloadTimeRange": "Bestimmten Zeitraum herunterladen",
	"end": "Ende",
	"timeRangeStartEmptyHint": "Wenn leer gelassen, wird es am Anfang beginnen",
	"timeRangeEndEmptyHint": "Wenn leer gelassen, wird bis zum Ende heruntergeladen",
	"homepage": "Homepage",
	"aboutAppDescription": "Eine kostenlose Open-Source-App, die auf Node.js und Electron aufgebaut ist. yt-dlp wurde zum Herunterladen verwendet",
	"sourceCodeAvailable": "Quellcode verfügbar ",
	"here": "hier",
	"processing": "Verarbeiten",
	"errorNetworkOrUrl": "Ein Fehler ist aufgetreten. Überprüfen Sie Ihr Netzwerk und verwenden Sie eine korrekte URL",
	"errorFailedFileDownload": "Fehler beim Herunterladen der benötigten Dateien. Bitte überprüfen Sie Ihr Netzwerk und versuchen Sie es erneut",
	"tryAgain": "Erneut versuchen",
	"unknownSize": "Unbekannte Größe",
	"megabyte": "MB",
	"unknownQuality": "Unbekannte Qualität",
	"downloading": "Herunterladen...",
	"errorHoverForDetails": "Ein Fehler ist aufgetreten. Hovern um Details zu sehen",
	"fileSavedSuccessfully": "Datei erfolgreich gespeichert",
	"fileSavedClickToOpen": "Datei gespeichert. Klicken zum Öffnen",
	"preparing": "Vorbereiten...",
	"progress": "Fortschritt",
	"speed": "Geschwindigkeit",
	"quality": "Qualität",
	"restartApp": "App neu starten",
	"subtitles": "Untertitel",
	"downloadSubtitlesAvailable": "Untertitel herunterladen, falls verfügbar",
	"downloadSubtitlesAuto": "Automatisch generierte Untertitel herunterladen",
	"extractAudioFromVideo": "Audio aus Video extrahieren",
	"extract": "Extrahieren",
	"downloadingNecessaryFiles": "Benötigte Dateien herunterladen",
	"qualityLow": "niedrig",
	"qualityMedium": "mittel",
	"appDescription": "ytDownloader ermöglicht es, Videos und Audios von hunderten Websites wie Youtube, Facebook, Instagram, Tiktok, Twitter und vielen mehr herunterzuladen",
	"pasteText": "Klicken, um Video-Link aus der Zwischenablage einzufügen",
	"pastePlaylistLinkTooltip": "Klicken, um Playlist-Link aus der Zwischenablage einzufügen",
	"link": "Link:",
	"downloadingPlaylist": "Wiedergabeliste wird heruntergeladen:",
	"downloadPlaylistButton": "Playlist herunterladen",
	"playlistDownloaded": "Wiedergabeliste heruntergeladen",
	"cookiesWarning": "Mit dieser Option können Sie eingeschränkte Inhalte herunterladen. Sie werden Fehler erhalten, wenn Cookies nicht vorhanden sind",
	"selectBrowserForCookies": "Browser zum Verwenden von Cookies auswählen",
	"none": "Keine",
	"updateAvailableDownloadPrompt": "Eine neue Version ist verfügbar, möchten Sie sie herunterladen?",
	"updateAvailablePrompt": "Eine neue Version ist verfügbar, möchten Sie aktualisieren?",
	"update": "Aktualisierung",
	"no": "Nein",
	"installAndRestartPrompt": "Jetzt installieren und neu starten?",
	"restart": "Neustart",
	"later": "Später",
	"extractAudio": "Audio extrahieren",
	"selectVideoFormat": "Videoformat auswählen ",
	"selectAudioFormat": "Audioformat auswählen ",
	"maxActiveDownloads": "Maximale Anzahl aktiver Downloads",
	"preferredVideoQuality": "Bevorzugte Videoqualität",
	"preferredAudioFormat": "Bevorzugtes Audioformat",
	"best": "Beste",
	"fileSaved": "Datei gespeichert",
	"openDownloadFolder": "Downloadordner öffnen",
	"path": "Pfad:",
	"selectConfigFile": "Konfiguration auswählen",
	"useConfigFile": "Konfigurationsdatei verwenden",
	"playlistFilenameFormat": "Dateinamenformat für Wiedergabelisten",
	"playlistFolderNameFormat": "Ordnername für Wiedergabelisten",
	"resetToDefault": "Auf Standard zurücksetzen",
	"playlistRange": "Playlist-Bereich",
	"thumbnail": "Miniaturansicht",
	"linkAdded": "Verlinkung hinzugefügt",
	"downloadThumbnails": "Thumbnails herunterladen",
	"saveVideoLinksToFile": "Videolinks in einer Datei speichern",
	"closeAppToTray": "Schließen Sie die App in der Taskleiste",
	"useConfigFileCheckbox": "Konfigurationsdatei verwenden",
	"openApp": "App öffnen",
	"pasteVideoLink": "Video-Link einfügen",
	"quit": "Beenden",
	"errorDetails": "Fehler-Details",
	"clickToCopy": "Zum Kopieren klicken",
	"copiedText": "Text kopiert",
	"qualityNormal": "Normal",
	"qualityGood": "Gut",
	"qualityBad": "Schlecht",
	"qualityWorst": "Schlechteste",
	"selectQuality": "Qualität auswählen",
	"disableAutoUpdates": "Automatische Updates deaktivieren",
	"qualityUltraLow": "Sehr niedrig",
	"closeAppOnFinish": "App schließen, wenn der Download beendet ist",
	"auto": "Auto",
	"theme": "Thema",
	"themeLight": "Licht",
	"themeDark": "Dunkel",
	"themeFrappe": "Frappé",
	"themeOneDark": "Ein Dunkler",
	"themeMatrix": "Matrizen",
	"themeSolarizedDark": "Solarized dunkel",
	"preferredVideoCodec": "Bevorzugter Video-Codec",
	"showMoreFormatOptions": "Weitere Formatoptionen anzeigen",
	"flatsealPermissionWarning": "Sie müssen der App die Berechtigung zum Zugriff auf das Home-Verzeichnis erteilen, um dies zu verwenden. Sie können dies mit Flatseal tun, indem Sie die Berechtigung mit dem Text 'filesystem = home' aktivieren",
	"noAudio": "Kein Audio",
	"proxy": "Proxy",
	"clearDownloads": "Downloads löschen",
	"compressor": "Kompressor",
	"dragAndDropFiles": "Datei(en) per Drag & Drop verschieben",
	"chooseFiles": "Datei(en) auswählen",
	"noFilesSelected": "Keine Dateien ausgewählt",
	"videoFormat": "Videoformat",
	"videoEncoder": "Video Encoder",
	"compressionSpeed": "Komprimierungsgeschwindigkeit",
	"videoQuality": "Videoqualität",
	"audioFormat": "Audioformat",
	"outputSuffix": "Ausgabe-Suffix",
	"outputInSameFolder": "Ausgabe im gleichen Ordner",
	"selectCustomFolder": "Benutzerdefinierten Ordner auswählen",
	"startCompression": "Komprimierung starten",
	"cancel": "Abbrechen",
	"errorClickForDetails": "Fehler! Für Details klicken",
	"homebrewYtDlpWarning": "Du musst zuerst yt-dlp von Homebrew herunterladen",
	"openHomebrew": "Homebrew öffnen",
	"downloadHistory": "Verlauf herunterladen",
	"close": "Schließen",
	"searchByTitleOrUrl": "Suche nach Titel oder URL...",
	"allFormats": "Alle Formate",
	"exportAsJson": "Als JSON exportieren",
	"exportAsCsv": "Als CSV exportieren",
	"clearAllHistory": "Lösche die ganze History",
	"noDownloadsYet": "Noch nicht heruntergeladen",
	"downloadHistoryPlaceholder": "Ihr Downloadverlauf wird hier erscheinen",
	"format": "Format",
	"size": "Größe",
	"date": "Datum",
	"duration": "Dauer",
	"copyUrl": "URL kopieren",
	"open": "Öffnen",
	"delete": "Löschen",
	"totalDownloads": "Downloads gesamt",
	"totalSize": "Gesamtgröße",
	"mostCommonFormat": "Häufigstes Format",
	"urlCopiedToClipboard": "URL in Zwischenablage kopiert",
	"confirmDeleteHistoryItem": "Sind Sie sicher, dass Sie dieses Element aus dem Verlauf löschen möchten?",
	"confirmClearAllHistory": "Sind Sie sicher, dass Sie den gesamten Downloadverlauf löschen möchten? Dies kann nicht rückgängig gemacht werden!",
	"fileDoesNotExist": "Datei existiert nicht mehr",
	"updatingYtdlp": "Aktualisiere yt-dlp",
	"updatedYtdlp": "Aktualisierte yt-dlp",
	"ytDlpUpdateRequired": "Wenn yt-dlp aktualisiert wird, warten Sie, bis die Aktualisierung abgeschlossen ist. Wenn Sie yt-dlp selbst installiert haben, aktualisieren Sie es bitte.",
	"failedToDeleteHistoryItem": "Fehler beim Löschen des Verlaufs",
	"customArgsTxt": "Setze eigene yt-dlp Optionen.",
	"learnMore": "Erfahre mehr",
	"updateError": "Beim Update-Prozess ist ein Fehler aufgetreten",
	"unableToAccessDir": "Das Programm kann nicht auf diesen Ordner zugreifen",
	"downloadingUpdate": "Update wird heruntergeladen"
}
```

--------------------------------------------------------------------------------

---[FILE: translations/el-GR.json]---
Location: ytDownloader-main/translations/el-GR.json

```json
{
	"preferences": "Προτιμήσεις",
	"about": "Σχετικά με",
	"downloadLocation": "Τοποθεσία λήψεων",
	"currentDownloadLocation": "Τρέχουσα τοποθεσία λήψεων - ",
	"enableTransparentDarkMode": "Ενεργοποίηση σκοτεινής λειτουργίας(μόνο για Linux, χρειάζεται επανεκκίνηση)",
	"downloadingNecessaryFilesWait": "Παρακαλώ περιμένετε, τα απαραίτητα αρχεία κατεβαίνουν",
	"video": "Βίντεο",
	"audio": "Ήχος",
	"title": "Τίτλος ",
	"selectFormat": "Επιλέξτε μορφή ",
	"download": "Λήψη",
	"selectDownloadLocation": "Επιλέξτε τοποθεσία λήψεων",
	"moreOptions": "Περισσότερες επιλογές",
	"start": "Έναρξη",
	"selectLanguageRelaunch": "Επιλέξτε Γλώσσα (Απαιτεί επανεκκίνηση)",
	"downloadTimeRange": "Κατεβάστε συγκεκριμένα χρονικά διαστήματα του βίντεο",
	"end": "Τέλος",
	"timeRangeStartEmptyHint": "Αν παραμείνει κενό, θα ξεκινήσει από την αρχή",
	"timeRangeEndEmptyHint": "Αν παραμείνει κενό, θα γίνει λήψη στο τέλος",
	"homepage": "Αρχική σελίδα",
	"aboutAppDescription": "Είναι μια εφαρμογή Δωρεάν και Ανοιχτού Κώδικα που βασίζεται στην κορυφή των Node.js και Electron. Το yt-dlp έχει χρησιμοποιηθεί για τη λήψη",
	"sourceCodeAvailable": "Ο κώδικας του προγράμματος είναι διαθέσιμος ",
	"here": "εδώ",
	"processing": "Σε επεξεργασία",
	"errorNetworkOrUrl": "Παρουσιάστηκε σφάλμα. Ελέγξτε το δίκτυό σας και χρησιμοποιήστε σωστό URL",
	"errorFailedFileDownload": "Αποτυχία λήψης των απαραίτητων αρχείων. Παρακαλώ ελέγξτε το δίκτυό σας και προσπαθήστε ξανά",
	"tryAgain": "Προσπαθήστε ξανά",
	"unknownSize": "Άγνωστο μέγεθος",
	"megabyte": "MB",
	"unknownQuality": "Άγνωστη ποιότητα",
	"downloading": "Γίνεται Λήψη...",
	"errorHoverForDetails": "Παρουσιάστηκε κάποιο σφάλμα. Πατήστε για να δείτε τις λεπτομέρειες",
	"fileSavedSuccessfully": "Το αρχείο αποθηκεύτηκε επιτυχώς",
	"fileSavedClickToOpen": "Το αρχείο αποθηκεύτηκε. Κάντε κλικ για άνοιγμα",
	"preparing": "Προετοιμασία...",
	"progress": "Πρόοδος",
	"speed": "Ταχύτητα",
	"quality": "Ποιότητα",
	"restartApp": "Επανεκκίνηση της εφαρμογής",
	"subtitles": "Υπότιτλοι",
	"downloadSubtitlesAvailable": "Λήψη υποτίτλων εάν είναι διαθέσιμοι",
	"downloadSubtitlesAuto": "Λήψη αυτόματης δημιουργίας υπότιτλων",
	"extractAudioFromVideo": "Εξαγωγή ήχου από το βίντεο",
	"extract": "Εξαγωγή",
	"downloadingNecessaryFiles": "Λήψη απαραίτητων αρχείων",
	"qualityLow": "χαμηλή",
	"qualityMedium": "μέτρια",
	"appDescription": "Το ytDownloader σας επιτρέπει να κατεβάσετε βίντεο και ήχους από εκατοντάδες ιστοσελίδες όπως το Youtube, Facebook, Instagram, Tiktok, Twitter και πολλά άλλα",
	"pasteText": "Κάντε κλικ για επικόλληση συνδέσμου βίντεο από το πρόχειρο",
	"pastePlaylistLinkTooltip": "Κάντε κλικ για επικόλληση συνδέσμου λίστας αναπαραγωγής από το πρόχειρο",
	"link": "Σύνδεσμος:",
	"downloadingPlaylist": "Γίνεται λήψη λίστας αναπαραγωγής:",
	"downloadPlaylistButton": "Λήψη λίστας αναπαραγωγής",
	"playlistDownloaded": "Η λίστα αναπαραγωγής λήφθηκε",
	"cookiesWarning": "Αυτή η επιλογή σας επιτρέπει να κατεβάσετε περιορισμένο περιεχόμενο. Θα λάβετε σφάλματα εάν τα cookies δεν υπάρχουν",
	"selectBrowserForCookies": "Επιλέξτε πρόγραμμα περιήγησης για χρήση των cookies",
	"none": "Τίποτα",
	"updateAvailableDownloadPrompt": "Νέα έκδοση είναι διαθέσιμη, θέλετε να την κατεβάσετε;",
	"updateAvailablePrompt": "Νέα έκδοση είναι διαθέσιμη, θέλετε να την ενημερώσετε;",
	"update": "Ενημέρωση",
	"no": "Όχι",
	"installAndRestartPrompt": "Εγκατάσταση και επανεκκίνηση τώρα;",
	"restart": "Επανεκκίνηση",
	"later": "Αργότερα",
	"extractAudio": "Εξαγωγή ήχου",
	"selectVideoFormat": "Επιλογή Μορφής Βιντέου ",
	"selectAudioFormat": "Επιλέξτε Μορφή Ήχου ",
	"maxActiveDownloads": "Μέγιστος αριθμός ενεργών λήψεων",
	"preferredVideoQuality": "Προτεινόμενη ποιότητα βιντέου",
	"preferredAudioFormat": "Προτιμώμενη μορφή ήχου",
	"best": "Καλύτερο",
	"fileSaved": "Το αρχείο αποθηκεύτηκε.",
	"openDownloadFolder": "Ανοίξτε τον φάκελο λήψεων",
	"path": "Μονοπάτι:",
	"selectConfigFile": "Επιλέξτε αρχείο ρυθμίσεων",
	"useConfigFile": "Χρησιμοποιήστε το αρχείο ρυθμίσεων",
	"playlistFilenameFormat": "Μορφή ονόματος αρχείου για λίστες αναπαραγωγής",
	"playlistFolderNameFormat": "Μορφή ονόματος φακέλου για λίστες αναπαραγωγής",
	"resetToDefault": "Επαναφορά στις αρχικές ρυθμίσεις",
	"playlistRange": "Εύρος λίστας αναπαραγωγής",
	"thumbnail": "Εικονίδιο",
	"linkAdded": "Ο σύνδεσμος προστέθηκε",
	"downloadThumbnails": "Λήψη εικονιδίου",
	"saveVideoLinksToFile": "Αποθήκευση συνδέσμων βιντέου σε αρχείο",
	"closeAppToTray": "Κλείσιμο εφαρμογής στην περιοχή ειδοποιήσεων",
	"useConfigFileCheckbox": "Χρήση αρχείου ρυθμίσεων",
	"openApp": "Άνοιγμα εφαρμογής",
	"pasteVideoLink": "Επικόλληση σύνδεσμο βιντέου",
	"quit": "Έξοδος",
	"errorDetails": "Λεπτομέρειες σφάλματος",
	"clickToCopy": "Κάνε κλικ για αντιγραφή",
	"copiedText": "Αντιγραμμένο κείμενο",
	"qualityNormal": "Φυσιολογικό",
	"qualityGood": "Καλός",
	"qualityBad": "Κακή",
	"qualityWorst": "Χειρότερο",
	"selectQuality": "Επιλογή Ποιότητας",
	"disableAutoUpdates": "Απενεργοποίηση αυτόματων ενημερώσεων",
	"qualityUltraLow": "υπερβολικά χαμηλό",
	"closeAppOnFinish": "Κλείσιμο εφαρμογής όταν ολοκληρωθεί η λήψη",
	"auto": "Αυτόματο",
	"theme": "Θέμα",
	"themeLight": "Φως",
	"themeDark": "Σκοτεινό",
	"themeFrappe": "Frappé",
	"themeOneDark": "Ένα Σκοτεινό",
	"themeMatrix": "Matrix",
	"themeSolarizedDark": "Solarized Dark",
	"preferredVideoCodec": "Προτιμώμενος κωδικοποιητής βίντεο",
	"showMoreFormatOptions": "Εμφάνιση περισσότερων επιλογών μορφής",
	"flatsealPermissionWarning": "Πρέπει να δώσετε στην εφαρμογή άδεια πρόσβασης στον αρχικό κατάλογο για να το χρησιμοποιήσετε. Μπορείτε να το κάνετε με το Flatseal ενεργοποιώντας την άδεια με το κείμενο 'filesystem=home'",
	"noAudio": "Χωρίς Ήχο",
	"proxy": "Διακομιστής Μεσολαβητής (Proxy)",
	"clearDownloads": "Εκκαθάριση Λήψεων",
	"compressor": "Συμπιεστής",
	"dragAndDropFiles": "Σύρετε και αφήστε αρχείο(α)",
	"chooseFiles": "Επιλέξτε Αρχείο(α)",
	"noFilesSelected": "Δεν έχουν επιλεγεί αρχεία",
	"videoFormat": "Μορφή Βίντεο",
	"videoEncoder": "Κωδικοποιητής Βίντεο",
	"compressionSpeed": "Ταχύτητα Συμπίεσης",
	"videoQuality": "Ποιότητα Βίντεο",
	"audioFormat": "Μορφή Ήχου",
	"outputSuffix": "Κατάληξη Εξόδου",
	"outputInSameFolder": "Έξοδος στον ίδιο φάκελο",
	"selectCustomFolder": "Επιλέξτε προσαρμοσμένο φάκελο",
	"startCompression": "Έναρξη Συμπίεσης",
	"cancel": "Ακύρωση",
	"errorClickForDetails": "Σφάλμα! Κάντε κλικ για λεπτομέρειες",
	"homebrewYtDlpWarning": "Πρέπει πρώτα να κατεβάσετε το yt-dlp από το homebrew",
	"openHomebrew": "Άνοιγμα Homebrew",
	"downloadHistory": "Ιστορικό Λήψεων",
	"close": "Κλείσιμο",
	"searchByTitleOrUrl": "Αναζήτηση με τίτλο ή URL...",
	"allFormats": "Όλες οι Μορφές",
	"exportAsJson": "Εξαγωγή ως JSON",
	"exportAsCsv": "Εξαγωγή ως CSV",
	"clearAllHistory": "Εκκαθάριση Όλου του Ιστορικού",
	"noDownloadsYet": "Δεν υπάρχουν Λήψεις ακόμα",
	"downloadHistoryPlaceholder": "Το ιστορικό λήψεών σας θα εμφανιστεί εδώ",
	"format": "Μορφή",
	"size": "Μέγεθος",
	"date": "Ημερομηνία",
	"duration": "Διάρκεια",
	"copyUrl": "Αντιγραφή URL",
	"open": "Άνοιγμα",
	"delete": "Διαγραφή",
	"totalDownloads": "Σύνολο Λήψεων",
	"totalSize": "Συνολικό Μέγεθος",
	"mostCommonFormat": "Πιο Συχνή Μορφή",
	"urlCopiedToClipboard": "Το URL αντιγράφηκε στο πρόχειρο!",
	"confirmDeleteHistoryItem": "Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το στοιχείο από το ιστορικό;",
	"confirmClearAllHistory": "Είστε σίγουροι ότι θέλετε να διαγράψετε όλο το ιστορικό λήψεων; Αυτό δεν αναιρείται!",
	"fileDoesNotExist": "Το αρχείο δεν υπάρχει πια",
	"updatingYtdlp": "Ενημέρωση yt-dlp",
	"updatedYtdlp": "Ενημερώθηκε το yt-dlp",
	"ytDlpUpdateRequired": "Αν το yt-dlp ενημερώνεται, περιμένετε να ολοκληρωθεί η ενημέρωση. Αν έχετε εγκαταστήσει το yt-dlp από τον εαυτό σας, ενημερώστε το.",
	"failedToDeleteHistoryItem": "Αποτυχία διαγραφής στοιχείου ιστορικού",
	"customArgsTxt": "Ορίστε προσαρμοσμένες επιλογές yt-dlp.",
	"learnMore": "Μάθε περισσότερα",
	"updateError": "Παρουσιάστηκε σφάλμα κατά τη διαδικασία ενημέρωσης",
	"unableToAccessDir": "Το πρόγραμμα δεν μπορεί να έχει πρόσβαση σε αυτόν τον φάκελο",
	"downloadingUpdate": "Λήψη ενημέρωσης"
}
```

--------------------------------------------------------------------------------

---[FILE: translations/en.json]---
Location: ytDownloader-main/translations/en.json

```json
{
	"preferences": "Preferences",
	"about": "About",
	"downloadLocation": "Download location",
	"currentDownloadLocation": "Current download location - ",
	"enableTransparentDarkMode": "Enable transparent dark mode(only Linux, needs relaunch)",
	"downloadingNecessaryFilesWait": "Please wait, necessary files are being downloaded",
	"video": "Video",
	"audio": "Audio",
	"title": "Title ",
	"selectFormat": "Select Format ",
	"download": "Download",
	"selectDownloadLocation": "Select Download Location",
	"moreOptions": "More options",
	"start": "Start",
	"selectLanguageRelaunch": "Select Language (Requires relaunch)",
	"downloadTimeRange": "Download particular time-range",
	"end": "End",
	"timeRangeStartEmptyHint": "If kept empty, it will start from the beginning",
	"timeRangeEndEmptyHint": "If kept empty, it will be downloaded to the end",
	"homepage": "Homepage",
	"aboutAppDescription": "It's a Free and Open Source app built on top of Node.js and Electron. yt-dlp has been used for downloading",
	"sourceCodeAvailable": "Source Code is available ",
	"here": "here",
	"processing": "Processing",
	"errorNetworkOrUrl": "Some error has occurred. Check your network and use correct URL",
	"errorFailedFileDownload": "Failed to download necessary files. Please check your network and try again",
	"tryAgain": "Try again",
	"unknownSize": "Unknown size",
	"megabyte": "MB",
	"unknownQuality": "Unknown quality",
	"downloading": "Downloading...",
	"errorHoverForDetails": "Some error has occurred. Hover to see details",
	"fileSavedSuccessfully": "File saved successfully",
	"fileSavedClickToOpen": "File saved. Click to Open",
	"preparing": "Preparing...",
	"progress": "Progress",
	"speed": "Speed",
	"quality": "Quality",
	"restartApp": "Restart app",
	"subtitles": "Subtitles",
	"downloadSubtitlesAvailable": "Download subtitles if available",
	"downloadSubtitlesAuto": "Download auto generated subtitles",
	"extractAudioFromVideo": "Extract Audio from Video",
	"extract": "Extract",
	"downloadingNecessaryFiles": "Downloading necessary files",
	"qualityLow": "low",
	"qualityMedium": "medium",
	"appDescription": "ytDownloader lets you download videos and audios from hundreds of sites like Youtube, Facebook, Instagram, Tiktok, Twitter and so on",
	"pasteText": "Click to paste video link from clipboard",
	"pastePlaylistLinkTooltip": "Click to paste playlist link from clipboard",
	"link": "Link:",
	"downloadingPlaylist": "Downloading playlist:",
	"downloadPlaylistButton": "Download playlist",
	"playlistDownloaded": "Playlist downloaded",
	"cookiesWarning": "This option lets you download restricted content. You will get errors if cookies are not there",
	"selectBrowserForCookies": "Select browser to use cookies from",
	"none": "None",
	"updateAvailableDownloadPrompt": "A new version is available, do you want to download it?",
	"updateAvailablePrompt": "A new version is available, do you want to update?",
	"update": "Update",
	"no": "No",
	"installAndRestartPrompt": "Install and restart now?",
	"restart": "Restart",
	"later": "Later",
	"extractAudio": "Extract Audio",
	"selectVideoFormat": "Select Video Format ",
	"selectAudioFormat": "Select Audio Format ",
	"maxActiveDownloads": "Maximum number of active downloads",
	"preferredVideoQuality": "Preferred video quality",
	"preferredAudioFormat": "Preferred audio format",
	"best": "Best",
	"fileSaved": "File saved.",
	"openDownloadFolder": "Open download folder",
	"path": "Path:",
	"selectConfigFile": "Select config file",
	"useConfigFile": "Use configuration file",
	"playlistFilenameFormat": "Filename format for playlists",
	"playlistFolderNameFormat": "Folder name format for playlists",
	"resetToDefault": "Reset to default",
	"playlistRange": "Playlist range",
	"thumbnail": "Thumbnail",
	"linkAdded": "Link added",
	"downloadThumbnails": "Download thumbnails",
	"saveVideoLinksToFile": "Save video links to a file",
	"closeAppToTray": "Close app to system tray",
	"useConfigFileCheckbox": "Use config file",
	"openApp": "Open app",
	"pasteVideoLink": "Paste video link",
	"quit": "Quit",
	"errorDetails": "Error Details",
	"clickToCopy": "Click to copy",
	"copiedText": "Copied text",
	"qualityNormal": "Normal",
	"qualityGood": "Good",
	"qualityBad": "Bad",
	"qualityWorst": "Worst",
	"selectQuality": "Select Quality",
	"disableAutoUpdates": "Disable auto updates",
	"qualityUltraLow": "ultralow",
	"closeAppOnFinish": "Close app when download finishes",
	"auto": "Auto",
	"theme": "Theme",
	"themeLight": "Light",
	"themeDark": "Dark",
	"themeFrappe": "Frappé",
	"themeOneDark": "One Dark",
	"themeMatrix": "Matrix",
	"themeSolarizedDark": "Solarized Dark",
	"preferredVideoCodec": "Preferred video codec",
	"showMoreFormatOptions": "Show more format options",
	"flatsealPermissionWarning": "You need to give the app permission to access home directory to use this. You can do it with Flatseal by enabling the permission with text 'filesystem=home'",
	"noAudio": "No Audio",
	"proxy": "Proxy",
	"clearDownloads": "Clear Downloads",
	"compressor": "Compressor",
	"dragAndDropFiles": "Drag and drop file(s)",
	"chooseFiles": "Choose File(s)",
	"noFilesSelected": "No files selected",
	"videoFormat": "Video format",
	"videoEncoder": "Video Encoder",
	"compressionSpeed": "Compression Speed",
	"videoQuality": "Video Quality",
	"audioFormat": "Audio Format",
	"outputSuffix": "Output suffix",
	"outputInSameFolder": "Output in same folder",
	"selectCustomFolder": "Select custom folder",
	"startCompression": "Start Compression",
	"cancel": "Cancel",
	"errorClickForDetails": "Error! Click for details",
	"homebrewYtDlpWarning": "You need to download yt-dlp from homebrew first",
	"openHomebrew": "Open Homebrew",
	"downloadHistory": "Download History",
	"close": "Close",
	"searchByTitleOrUrl": "Search by title or URL...",
	"allFormats": "All Formats",
	"exportAsJson": "Export as JSON",
	"exportAsCsv": "Export as CSV",
	"clearAllHistory": "Clear All History",
	"noDownloadsYet": "No Downloads Yet",
	"downloadHistoryPlaceholder": "Your download history will appear here",
	"format": "Format",
	"size": "Size",
	"date": "Date",
	"duration": "Duration",
	"copyUrl": "Copy URL",
	"open": "Open",
	"delete": "Delete",
	"totalDownloads": "Total Downloads",
	"totalSize": "Total Size",
	"mostCommonFormat": "Most Common Format",
	"urlCopiedToClipboard": "URL copied to clipboard!",
	"confirmDeleteHistoryItem": "Are you sure you want to delete this item from history?",
	"confirmClearAllHistory": "Are you sure you want to clear all download history? This cannot be undone!",
	"fileDoesNotExist": "File does not exist anymore",
	"updatingYtdlp": "Updating yt-dlp",
	"updatedYtdlp": "Updated yt-dlp",
	"ytDlpUpdateRequired": "If yt-dlp is updating, wait for the update to finish. If you have installed yt-dlp by yourself, please update it.",
	"failedToDeleteHistoryItem": "Failed to delete history item",
	"customArgsTxt": "Set custom yt-dlp options.",
	"learnMore": "Learn more",
	"updateError": "An error occurred during the update process",
	"unableToAccessDir": "The program cannot access that folder",
	"downloadingUpdate": "Downloading update"

}
```

--------------------------------------------------------------------------------

---[FILE: translations/es-ES.json]---
Location: ytDownloader-main/translations/es-ES.json

```json
{
	"preferences": "Preferencias",
	"about": "Acerca de",
	"downloadLocation": "Ubicación de la descarga",
	"currentDownloadLocation": "Ubicación de la descarga actual - ",
	"enableTransparentDarkMode": "Habilitar el modo oscuro transparente (solo en Linux, necesita relanzar)",
	"downloadingNecessaryFilesWait": "Espere, se están descargando los archivos necesarios",
	"video": "Video",
	"audio": "Audio",
	"title": "Título ",
	"selectFormat": "Seleccionar formato ",
	"download": "Descargar",
	"selectDownloadLocation": "Seleccione la ubicación de la descarga",
	"moreOptions": "Mas opciones",
	"start": "Inicio",
	"selectLanguageRelaunch": "Seleccionar idioma (Requiere relanzar)",
	"downloadTimeRange": "Descargar un rango de tiempo particular",
	"end": "Término",
	"timeRangeStartEmptyHint": "Si se mantiene vacío, comenzará desde el principio",
	"timeRangeEndEmptyHint": "Si se mantiene vacío, se descargará hasta el final",
	"homepage": "Página web",
	"aboutAppDescription": "Es una aplicación gratuita y de código abierto construida sobre Node.js y Electron. yt-dlp se ha utilizado para descargar",
	"sourceCodeAvailable": "El código fuente está disponible ",
	"here": "aquí",
	"processing": "Procesando",
	"errorNetworkOrUrl": "Ha ocurrido algún error. Verifique su red y use la URL correcta",
	"errorFailedFileDownload": "No se han podido descargar los archivos necesarios. Por favor, compruebe su red e inténtelo de nuevo",
	"tryAgain": "Inténtelo de nuevo",
	"unknownSize": "Tamaño desconocido",
	"megabyte": "MB",
	"unknownQuality": "Calidad desconocida",
	"downloading": "Descargando...",
	"errorHoverForDetails": "Ha ocurrido algún error. Pase el cursor para ver los detalles",
	"fileSavedSuccessfully": "Archivo guardado con éxito",
	"fileSavedClickToOpen": "Archivo guardado. Haga clic para abrir",
	"preparing": "Preparando...",
	"progress": "Progreso",
	"speed": "Velocidad",
	"quality": "Calidad",
	"restartApp": "Reiniciar la aplicación",
	"subtitles": "Subtítulos",
	"downloadSubtitlesAvailable": "Descargar los subtítulos si están disponibles",
	"downloadSubtitlesAuto": "Descargar subtítulos generados automáticamente",
	"extractAudioFromVideo": "Extraer el audio del vídeo",
	"extract": "Extraer",
	"downloadingNecessaryFiles": "Descarga de los archivos necesarios",
	"qualityLow": "baja",
	"qualityMedium": "media",
	"appDescription": "ytDownloader te permite descargar vídeos y audios de cientos de sitios como Youtube, Facebook, Instagram, Tiktok, Twitter, etc.",
	"pasteText": "Haga clic para pegar enlace de vídeo del portapapeles",
	"pastePlaylistLinkTooltip": "Haga clic para pegar el enlace de la lista de reproducción del portapapeles",
	"link": "Enlace:",
	"downloadingPlaylist": "Descargando lista de reproducción:",
	"downloadPlaylistButton": "Descargar lista de reproducción",
	"playlistDownloaded": "Lista de reproducción descargada",
	"cookiesWarning": "Esta opción le permite descargar contenido restringido. Obtendrá errores si no hay cookies",
	"selectBrowserForCookies": "Seleccionar navegador para usar cookies de",
	"none": "Ninguna",
	"updateAvailableDownloadPrompt": "Hay una nueva versión disponible, ¿quieres descargarla?",
	"updateAvailablePrompt": "Hay una nueva versión disponible, ¿quieres actualizar?",
	"update": "Actualización",
	"no": "No",
	"installAndRestartPrompt": "¿Instalar y reiniciar ahora?",
	"restart": "Reiniciar",
	"later": "Luego",
	"extractAudio": "Extraer Audio",
	"selectVideoFormat": "Seleccionar formato de vídeo ",
	"selectAudioFormat": "Seleccionar formato de audio ",
	"maxActiveDownloads": "Número máximo de descargas activas",
	"preferredVideoQuality": "Calidad de vídeo preferida",
	"preferredAudioFormat": "Formato de audio preferido",
	"best": "Mejor",
	"fileSaved": "Archivo guardado",
	"openDownloadFolder": "Abrir carpeta de descargas",
	"path": "Ruta:",
	"selectConfigFile": "Seleccionar archivo de configuración",
	"useConfigFile": "Usar archivo de configuración",
	"playlistFilenameFormat": "Formato de archivo para listas",
	"playlistFolderNameFormat": "Formato de nombre de carpeta para listas",
	"resetToDefault": "Restablecer por defecto",
	"playlistRange": "Rango de lista",
	"thumbnail": "Miniatura",
	"linkAdded": "Enlace añadido",
	"downloadThumbnails": "Descargar miniaturas",
	"saveVideoLinksToFile": "Guardar enlaces de vídeo en un archivo",
	"closeAppToTray": "Cerrar aplicación a la bandeja del sistema",
	"useConfigFileCheckbox": "Usar archivo de configuración",
	"openApp": "Abrir app",
	"pasteVideoLink": "Pegar enlace de vídeo",
	"quit": "Salir",
	"errorDetails": "Detalles del error",
	"clickToCopy": "Clic para copiar",
	"copiedText": "Texto copiado",
	"qualityNormal": "Estándar",
	"qualityGood": "Bueno",
	"qualityBad": "Mal",
	"qualityWorst": "Peor",
	"selectQuality": "Seleccionar calidad",
	"disableAutoUpdates": "Desactivar actualizaciones automáticas",
	"qualityUltraLow": "ultra bajo",
	"closeAppOnFinish": "Cerrar aplicación cuando finalice la descarga",
	"auto": "Auto",
	"theme": "Tema",
	"themeLight": "Ligero",
	"themeDark": "Oscuro",
	"themeFrappe": "Frappé",
	"themeOneDark": "One Dark",
	"themeMatrix": "Matriz",
	"themeSolarizedDark": "Oscuro Solar",
	"preferredVideoCodec": "Código de vídeo preferido",
	"showMoreFormatOptions": "Mostrar más opciones de formato",
	"flatsealPermissionWarning": "Debe otorgar permiso a la aplicación para acceder al directorio de inicio para usar esto. Puede hacerlo con Flatseal habilitando el permiso con el texto 'filesystem=home'",
	"noAudio": "Sin audio",
	"proxy": "Proxy",
	"clearDownloads": "Borrar Descargas",
	"compressor": "Compresor",
	"dragAndDropFiles": "Arrastrar y soltar archivo(s)",
	"chooseFiles": "Elegir archivo(s)",
	"noFilesSelected": "No hay archivos seleccionados",
	"videoFormat": "Formato de vídeo",
	"videoEncoder": "Codificador de Vídeo",
	"compressionSpeed": "Velocidad de compresión",
	"videoQuality": "Calidad del vídeo",
	"audioFormat": "Formato de audio",
	"outputSuffix": "Sufijo de salida",
	"outputInSameFolder": "Salida en la misma carpeta",
	"selectCustomFolder": "Seleccionar carpeta personalizada",
	"startCompression": "Iniciar compresión",
	"cancel": "Cancelar",
	"errorClickForDetails": "Detalles",
	"homebrewYtDlpWarning": "Necesitas descargar yt-dlp desde homebrew primero",
	"openHomebrew": "Abrir Homebrew",
	"downloadHistory": "Historial de Descargas",
	"close": "Cerrar",
	"searchByTitleOrUrl": "Buscar por título o URL...",
	"allFormats": "Todos los formatos",
	"exportAsJson": "Exportar como JSON",
	"exportAsCsv": "Exportar a CSV",
	"clearAllHistory": "Borrar todo el historial",
	"noDownloadsYet": "Aún no hay descargas",
	"downloadHistoryPlaceholder": "Tu historial de descargas aparecerá aquí",
	"format": "Formato",
	"size": "Tamaño",
	"date": "Fecha",
	"duration": "Duración",
	"copyUrl": "Copiar URL",
	"open": "Abrir",
	"delete": "Eliminar",
	"totalDownloads": "Descargas Totales",
	"totalSize": "Tamaño Total",
	"mostCommonFormat": "Formato Más Común",
	"urlCopiedToClipboard": "¡URL copiada al portapapeles!",
	"confirmDeleteHistoryItem": "¿Estás seguro de que quieres eliminar este elemento del historial?",
	"confirmClearAllHistory": "¿Estás seguro de que quieres borrar todo el historial de descargas? ¡Esta acción no se puede deshacer!",
	"fileDoesNotExist": "El archivo ya no existe",
	"updatingYtdlp": "Actualizando yt-dlp",
	"updatedYtdlp": "Actualizado yt-dlp",
	"ytDlpUpdateRequired": "Si yt-dlp está actualizando, espere a que la actualización termine. Si usted mismo ha instalado yt-dlp, por favor actualícela.",
	"failedToDeleteHistoryItem": "Error al eliminar el elemento del historial",
	"customArgsTxt": "Establecer opciones personalizadas yt-dlp.",
	"learnMore": "Saber más",
	"updateError": "Se produjo un error durante el proceso de actualización",
	"unableToAccessDir": "El programa no puede acceder a esa carpeta",
	"downloadingUpdate": "Descargando actualización"
}
```

--------------------------------------------------------------------------------

---[FILE: translations/fa-IR.json]---
Location: ytDownloader-main/translations/fa-IR.json

```json
{
	"preferences": "تنظیمات",
	"about": "درباره",
	"downloadLocation": "مکان بارگیری",
	"currentDownloadLocation": "مکان بارگیری فعلی ",
	"enableTransparentDarkMode": "فعال‌سازی حالت تاریک شفاف(فقط در لینوکس، نیازمند راه‌اندازی‌مجدد)",
	"downloadingNecessaryFilesWait": "لطفا صبر کنید، پرونده‌های ضروری در حال بارگیری هستند",
	"video": "ویدیو",
	"audio": "صدا",
	"title": "عنوان ",
	"selectFormat": "انتخاب فرمت ",
	"download": "بارگیری",
	"selectDownloadLocation": "انتخاب مکان بارگیری",
	"moreOptions": "گزینه‌های بیشتر",
	"start": "ابتدا",
	"selectLanguageRelaunch": "انتخاب زبان (نیازمند راه‌اندازی‌مجدد)",
	"downloadTimeRange": "بارگیری بازه‌ی زمانی خاص",
	"end": "انتها",
	"timeRangeStartEmptyHint": "اگر خالی گذاشته‌شود، از ابتدا شروع خواهد کرد",
	"timeRangeEndEmptyHint": "اگر خالی گذاشته‌شود، تا انتها بارگیری خواهد کرد",
	"homepage": "صفحه‌ی نخست",
	"aboutAppDescription": "نرم‌افزاری رایگان و منبع-باز است که برپایه‌ی Node.js و Electron ساخته شده‌است. yt-dlp برای بارگیری به کار رفته‌است",
	"sourceCodeAvailable": "کد منبع دردسترس است ",
	"here": "این‌جا",
	"processing": "درحال پردازش",
	"errorNetworkOrUrl": "خطایی رخ داده‌است. اتصال شبکه‌ی خود را بررسی کرده و از نشانی اینترنتی صحیح استفاده کنید",
	"errorFailedFileDownload": "بارگیری پرونده‌های ضروری ناموفق بود. لطفا اتصال شبکه‌ی خود را بررسی کرده و دوباره تلاش کنید",
	"tryAgain": "دوباره تلاش‌ کن",
	"unknownSize": "اندازه‌ی نامشخص",
	"megabyte": "مگابایت",
	"unknownQuality": "کیفیت نامشخص",
	"downloading": "درحال بارگیری...",
	"errorHoverForDetails": "خطایی رخ داده‌است. برای دیدن جزئیات نشانگر موس را نگه‌دارید",
	"fileSavedSuccessfully": "پرونده با موفقیت ذخیره شد",
	"fileSavedClickToOpen": "پرونده ذخیره‌شد. برای بازکردن کلیک کنید",
	"preparing": "درحال آماده‌سازی...",
	"progress": "پیشرفت",
	"speed": "سرعت",
	"quality": "کیفیت",
	"restartApp": "راه‌اندازی مجدد برنامه",
	"subtitles": "زیرنویس‌ها",
	"downloadSubtitlesAvailable": "در صورت وجود زیرنویس‌ها بارگیری شود",
	"downloadSubtitlesAuto": "زیرنویس‌های به‌طور‌خودکار تولیدشده بارگیری شود",
	"extractAudioFromVideo": "صدا از ویدیو استخراج شود",
	"extract": "استخراج",
	"downloadingNecessaryFiles": "درحال بارگیری پرونده‌های ضروری",
	"qualityLow": "پایین",
	"qualityMedium": "متوسط",
	"appDescription": "ytDownloader به شما امکان بارگیری ویدیو و صدا را از صدها سایت مانند یوتیوب، فیس‌بوک، اینستاگرام، تیک‌تاک، توییتر و غیره می‌دهد",
	"pasteText": "برای چسباندن پیوند ویدیو از کلیپ‌بورد کلیک کنید",
	"pastePlaylistLinkTooltip": "برای چسباندن پیوند لیست پخش از کلیپ‌بورد کلیک کنید",
	"link": "پیوند:",
	"downloadingPlaylist": "درحال بارگیری لیست پخش:",
	"downloadPlaylistButton": "بارگیری لیست پخش",
	"playlistDownloaded": "لیست پخش بارگیری شد",
	"cookiesWarning": "این گزینه به شما اجازه می‌دهد محتوای محدودشده را بارگیری کنید. اگر کوکی‌ها موجود نباشند اخطار دریافت خواهید‌کرد",
	"selectBrowserForCookies": "انتخاب مرورگر برای استفاده‌ی کوکی‌ها از آن",
	"none": "هیچ‌کدام",
	"updateAvailableDownloadPrompt": "نسخه‌ی جدیدی دردسترس است، می‌خواهید آن را بارگیری کنید؟",
	"updateAvailablePrompt": "نسخه‌ی جدیدی دردسترس است، می‌خواهید آن را بروزرسانی کنید؟",
	"update": "بروزرسانی",
	"no": "نه",
	"installAndRestartPrompt": "اکنون نصب و راه‌اندازی مجدد انجام شود؟",
	"restart": "راه‌اندازی مجدد",
	"later": "بعداً",
	"extractAudio": "استخراج صدا",
	"selectVideoFormat": "انتخاب فرمت ویدیو ",
	"selectAudioFormat": "انتخاب فرمت صدا ",
	"maxActiveDownloads": "حداکثر تعداد دانلودهای فعال",
	"preferredVideoQuality": "کیفیت ویدیوی ترجیحی",
	"preferredAudioFormat": "فرمت صوتی ترجیحی",
	"best": "بهترین",
	"fileSaved": "پرونده ذخیره شد.",
	"openDownloadFolder": "بازکردن پوشهٔ بارگیری ها",
	"path": "مسیر:",
	"selectConfigFile": "فایل پیکربندی را انتخاب کنید",
	"useConfigFile": "از فایل تنظیمات استفاده کنید",
	"playlistFilenameFormat": "فرمت نام فایل برای لیست های پخش",
	"playlistFolderNameFormat": "فرمت نام پوشه برای لیست های پخش",
	"resetToDefault": "بازگردانی به حالت پیش فرض",
	"playlistRange": "محدوده لیست پخش",
	"thumbnail": "تصویر بند انگشتی",
	"linkAdded": "لینک اضافه شد",
	"downloadThumbnails": "تصاویر کوچک را دانلود کنید",
	"saveVideoLinksToFile": "لینک های ویدیو را در یک فایل ذخیره کنید",
	"closeAppToTray": "برنامه را به سینی سیستم ببندید",
	"useConfigFileCheckbox": "از فایل کانفیگ استفاده کنید",
	"openApp": "اپلیکیشن را باز کن",
	"pasteVideoLink": "پیوند ویدیو را بچسبانید",
	"quit": "ترک کنید",
	"errorDetails": "جزئیات خطا",
	"clickToCopy": "برای کپی کلیک کنید",
	"copiedText": "پیوند کپی شده",
	"qualityNormal": "عادی",
	"qualityGood": "درست",
	"qualityBad": "بد",
	"qualityWorst": "بدترین",
	"selectQuality": "کیفیت را انتخاب کنید",
	"disableAutoUpdates": "به روز رسانی خودکار را غیرفعال کنید",
	"qualityUltraLow": "بسیار کم",
	"closeAppOnFinish": "پس از پایان دانلود برنامه را ببندید",
	"auto": "خودکار",
	"theme": "تِم",
	"themeLight": "روشن",
	"themeDark": "تیره",
	"themeFrappe": "Frappé",
	"themeOneDark": "One Dark",
	"themeMatrix": "ماتریکس",
	"themeSolarizedDark": "تاریک خورشیدی",
	"preferredVideoCodec": "کدک ویدیویی ترجیح داده شده",
	"showMoreFormatOptions": "نمایش گزینه های فرمت بیشتر",
	"flatsealPermissionWarning": "برای استفاده از این باید به برنامه اجازه دسترسی به دایرکتوری اصلی را بدهید. شما می توانید آن را با Flatseal با فعال کردن مجوز با متن 'filesystem=home' انجام دهید",
	"noAudio": "بدون صدا",
	"proxy": "پروکسی",
	"clearDownloads": "پاک کردن دانلودها",
	"compressor": "فشرده‌ساز",
	"dragAndDropFiles": "فایل(ها) را بکشید و رها کنید",
	"chooseFiles": "انتخاب فایل(ها)",
	"noFilesSelected": "هیچ فایلی انتخاب نشده است",
	"videoFormat": "فرمت ویدیو",
	"videoEncoder": "کدگذار ویدیو",
	"compressionSpeed": "سرعت فشرده سازی",
	"videoQuality": "کیفیت ویدیو",
	"audioFormat": "فرمت صوتی",
	"outputSuffix": "پسوند خروجی",
	"outputInSameFolder": "خروجی در همان پوشه",
	"selectCustomFolder": "انتخاب پوشه سفارشی",
	"startCompression": "شروع فشرده‌سازی",
	"cancel": "لغو",
	"errorClickForDetails": "خطا! برای جزئیات کلیک کنید",
	"homebrewYtDlpWarning": "ابتدا باید yt-dlp را از Homebrew دانلود کنید",
	"openHomebrew": "باز کردن Homebrew",
	"downloadHistory": "تاریخچه دانلود",
	"close": "بستن",
	"searchByTitleOrUrl": "جستجو بر اساس عنوان یا نشانی...",
	"allFormats": "همه فرمت‌ها",
	"exportAsJson": "خروجی به صورت JSON",
	"exportAsCsv": "خروجی به صورت CSV",
	"clearAllHistory": "پاک کردن تمام تاریخچه",
	"noDownloadsYet": "هنوز دانلودی انجام نشده است",
	"downloadHistoryPlaceholder": "تاریخچه دانلود شما در اینجا ظاهر خواهد شد",
	"format": "فرمت",
	"size": "اندازه",
	"date": "تاریخ",
	"duration": "مدت زمان",
	"copyUrl": "کپی نشانی",
	"open": "باز کردن",
	"delete": "حذف",
	"totalDownloads": "کل دانلودها",
	"totalSize": "اندازه کل",
	"mostCommonFormat": "پرکاربردترین فرمت",
	"urlCopiedToClipboard": "نشانی در کلیپ‌بورد کپی شد!",
	"confirmDeleteHistoryItem": "آیا مطمئن هستید که می‌خواهید این مورد را از تاریخچه حذف کنید؟",
	"confirmClearAllHistory": "آیا مطمئن هستید که می‌خواهید کل تاریخچه دانلود را پاک کنید؟ این عمل قابل برگشت نیست!",
	"fileDoesNotExist": "File does not exist anymore",
	"updatingYtdlp": "Updating yt-dlp",
	"updatedYtdlp": "Updated yt-dlp",
	"ytDlpUpdateRequired": "If yt-dlp is updating, wait for the update to finish. If you have installed yt-dlp by yourself, please update it.",
	"failedToDeleteHistoryItem": "Failed to delete history item",
	"customArgsTxt": "Set custom yt-dlp options.",
	"learnMore": "Learn more",
	"updateError": "An error occurred during the update process",
	"unableToAccessDir": "The program cannot access that folder",
	"downloadingUpdate": "Downloading update"
}
```

--------------------------------------------------------------------------------

---[FILE: translations/fi-FI.json]---
Location: ytDownloader-main/translations/fi-FI.json

```json
{
	"preferences": "Asetukset",
	"about": "Tietoja",
	"downloadLocation": "Latausten kohdekansio",
	"currentDownloadLocation": "Nykyinen kohde latauksille - ",
	"enableTransparentDarkMode": "Kytke päälle tumma läpinäkyvä tila (vain Linux, ohjelman uudelleenkäynnistys tarvitaan)",
	"downloadingNecessaryFilesWait": "Ole hyvä ja odota, tarvittavia tiedostoja ladataan juuri",
	"video": "Video",
	"audio": "Ääni",
	"title": "Nimike ",
	"selectFormat": "Valitse muoto ",
	"download": "Lataa",
	"selectDownloadLocation": "Valitse kohdekansio lataukselle",
	"moreOptions": "Lisävaihtoehdot",
	"start": "Aloita",
	"selectLanguageRelaunch": "Valitse kieli (uudelleenkäynnistys tarvitaan)",
	"downloadTimeRange": "Lataa tietty aikaväli",
	"end": "Loppu",
	"timeRangeStartEmptyHint": "Mikäli tyhjänä, tämä alkaa alusta",
	"timeRangeEndEmptyHint": "Mikäli tyhjänä, se ladataan loppuun",
	"homepage": "Kotisivusto",
	"aboutAppDescription": "Vapaa ja ohjelmakoodiltaan avoin sovellus rakennettuna Node.js:n ja Electron:in päälle. yt-dlp:tä on käytetty toteuttamaan lataukset",
	"sourceCodeAvailable": "Lähdekoodi on saatavilla ",
	"here": "täällä",
	"processing": "Käsitellään",
	"errorNetworkOrUrl": "Ilmeni jokin virhe. Tarkista verkkoyhteytesi ja käytä kelvollista URL-osoitetta",
	"errorFailedFileDownload": "Tarvittavia tiedostoja ei saatu ladattua. Tarkista verkkoyhteytesi ja koeta uudelleen",
	"tryAgain": "Yritä uudelleen",
	"unknownSize": "Tuntematon koko",
	"megabyte": "Mt",
	"unknownQuality": "Tuntematon laatu",
	"downloading": "Ladataan...",
	"errorHoverForDetails": "Ilmeni jokin virhe. Ohjaa hiiri ylle nähdäksesi virheen yksityiskohdat",
	"fileSavedSuccessfully": "Tiedosto tallennettu onnistuneesti",
	"fileSavedClickToOpen": "Tiedosto tallennettu. Napsauta tästä avataksesi kohdekansion",
	"preparing": "Valmistellaan...",
	"progress": "Edistyminen",
	"speed": "Nopeus",
	"quality": "Laatu",
	"restartApp": "Uudelleenkäynnistä sovellus",
	"subtitles": "Tekstitykset",
	"downloadSubtitlesAvailable": "Lataa tekstitykset mikäli tarjolla",
	"downloadSubtitlesAuto": "Lataa automaattisesti luodut tekstitykset",
	"extractAudioFromVideo": "Eriytä ääniraita videosta",
	"extract": "Vedä ääniraita",
	"downloadingNecessaryFiles": "Ladataan tarvittavia tiedostoja",
	"qualityLow": "matala",
	"qualityMedium": "keskitaso",
	"appDescription": "ytDownloader mahdollistaa videoiden ja äänen lataamisen talteen sadoilta sivustoilta kuten YouTube, Facebook, Instagram, Tiktok, Twitter ja niin edelleen",
	"pasteText": "Napsauta liittääksesi videolinkin leikepöydältä",
	"pastePlaylistLinkTooltip": "Napsauta liittääksesi soittolistan linkin leikepöydältä",
	"link": "Linkki:",
	"downloadingPlaylist": "Ladataan soittolista:",
	"downloadPlaylistButton": "Lataa soittolista",
	"playlistDownloaded": "Soittolista ladattu",
	"cookiesWarning": "Tämän vaihtoehdon avulla voit ladata rajoitetun sisällön. Saat virheitä, jos evästeitä ei ole",
	"selectBrowserForCookies": "Valitse selain käyttääksesi evästeitä",
	"none": "Ei ole",
	"updateAvailableDownloadPrompt": "Uusi julkaisu on saatavilla, haluatko ladata sen?",
	"updateAvailablePrompt": "Uusi julkaisu on saatavilla, haluatko päivittää?",
	"update": "Päivitä",
	"no": "Ei",
	"installAndRestartPrompt": "Asenna ja uudelleenkäynnistä nyt?",
	"restart": "Uudelleenkäynnistys",
	"later": "Myöhemmin",
	"extractAudio": "Pura Ääni",
	"selectVideoFormat": "Valitse Videon Muoto ",
	"selectAudioFormat": "Valitse Äänen Muoto ",
	"maxActiveDownloads": "Aktiivisten latausten enimmäismäärä",
	"preferredVideoQuality": "Ensisijainen videon laatu",
	"preferredAudioFormat": "Haluttu ääniformaatti",
	"best": "Paras",
	"fileSaved": "Tiedosto tallennettu",
	"openDownloadFolder": "Avaa latauskansio",
	"path": "Polku:",
	"selectConfigFile": "Valitse konfiguraatiotiedosto",
	"useConfigFile": "Käytä asetustiedostoa",
	"playlistFilenameFormat": "Soittolistojen tiedostonimen muoto",
	"playlistFolderNameFormat": "Soittolistojen kansion nimen muoto",
	"resetToDefault": "Palauta oletusasetukset",
	"playlistRange": "Soittolistan alue",
	"thumbnail": "Pikkukuva",
	"linkAdded": "Linkki lisätty",
	"downloadThumbnails": "Lataa pikkukuvat",
	"saveVideoLinksToFile": "Tallenna videolinkit tiedostoon",
	"closeAppToTray": "Sulje sovellus ilmoitusalueelle",
	"useConfigFileCheckbox": "Käytä asetustiedostoa",
	"openApp": "Avaa sovellus",
	"pasteVideoLink": "Liitä video linkki",
	"quit": "Lopeta",
	"errorDetails": "Virheen tiedot",
	"clickToCopy": "Klikkaa kopioidaksesi",
	"copiedText": "Teksti kopioitu",
	"qualityNormal": "Normaali",
	"qualityGood": "Hyvä",
	"qualityBad": "Huono",
	"qualityWorst": "Huonoin",
	"selectQuality": "Valitse Laatu",
	"disableAutoUpdates": "Poista automaattiset päivitykset käytöstä",
	"qualityUltraLow": "erittäin matala",
	"closeAppOnFinish": "Sulje sovellus latauksen valmistuttua",
	"auto": "Automaattinen",
	"theme": "Teema",
	"themeLight": "Valoisa",
	"themeDark": "Tumma",
	"themeFrappe": "Frappé",
	"themeOneDark": "One Dark",
	"themeMatrix": "Matriisi",
	"themeSolarizedDark": "Solarized, tumma",
	"preferredVideoCodec": "Ensisijainen videon koodekki",
	"showMoreFormatOptions": "Näytä lisää muotoiluvaihtoehtoja",
	"flatsealPermissionWarning": "Sinun on annettava sovellukselle lupa käyttää kotihakemistoa tämän käyttämiseksi. Voit tehdä sen Flatsealilla ottamalla käyttöön oikeudet tekstillä 'filesystem=home'",
	"noAudio": "Ei Ääntä",
	"proxy": "Välityspalvelin",
	"clearDownloads": "Tyhjennä Lataukset",
	"compressor": "Pakkaaja",
	"dragAndDropFiles": "Vedä ja pudota tiedosto(t)",
	"chooseFiles": "Valitse tiedosto(t)",
	"noFilesSelected": "Ei tiedostoja valittuna",
	"videoFormat": "Videon muoto",
	"videoEncoder": "Videon kooderi",
	"compressionSpeed": "Pakkausnopeus",
	"videoQuality": "Videon laatu",
	"audioFormat": "Äänen muoto",
	"outputSuffix": "Ulostulon pääte",
	"outputInSameFolder": "Ulostulo samaan kansioon",
	"selectCustomFolder": "Valitse mukautettu kansio",
	"startCompression": "Aloita pakkaus",
	"cancel": "Peruuta",
	"errorClickForDetails": "Virhe! Napsauta nähdäksesi yksityiskohdat",
	"homebrewYtDlpWarning": "Sinun on ladattava yt-dlp Homebrew'n kautta ensin",
	"openHomebrew": "Avaa Homebrew",
	"downloadHistory": "Lataushistoria",
	"close": "Sulje",
	"searchByTitleOrUrl": "Hae nimikkeen tai URL:n perusteella...",
	"allFormats": "Kaikki muodot",
	"exportAsJson": "Vie JSON-muodossa",
	"exportAsCsv": "Vie CSV-muodossa",
	"clearAllHistory": "Tyhjennä koko historia",
	"noDownloadsYet": "Ei latauksia vielä",
	"downloadHistoryPlaceholder": "Lataushistoriasi näkyy tässä",
	"format": "Muoto",
	"size": "Koko",
	"date": "Päivämäärä",
	"duration": "Kesto",
	"copyUrl": "Kopioi URL",
	"open": "Avaa",
	"delete": "Poista",
	"totalDownloads": "Latauksia yhteensä",
	"totalSize": "Koko yhteensä",
	"mostCommonFormat": "Yleisin muoto",
	"urlCopiedToClipboard": "URL kopioitu leikepöydälle!",
	"confirmDeleteHistoryItem": "Oletko varma, että haluat poistaa tämän kohteen historiasta?",
	"confirmClearAllHistory": "Oletko varma, että haluat tyhjentää koko lataushistorian? Tätä ei voi perua!",
	"fileDoesNotExist": "Tiedostoa ei ole enää olemassa",
	"updatingYtdlp": "Päivitetään yt-dlp:tä",
	"updatedYtdlp": "yt-dlp on päivitetty",
	"ytDlpUpdateRequired": "Jos yt-dlp on päivittymässä, odota päivityksen valmistumista. Jos olet asentanut yt-dlp:n itse, ole hyvä ja päivitä se.",
	"failedToDeleteHistoryItem": "Historiaelementin poistaminen epäonnistui",
	"customArgsTxt": "Aseta mukautetut yt-dlp-asetukset.",
	"learnMore": "Lue lisää",
	"updateError": "Päivitysprosessin aikana tapahtui virhe",
	"unableToAccessDir": "Ohjelma ei pääse käsiksi kyseiseen kansioon",
	"downloadingUpdate": "Ladataan päivitystä"
}
```

--------------------------------------------------------------------------------

---[FILE: translations/fr-FR.json]---
Location: ytDownloader-main/translations/fr-FR.json

```json
{
	"preferences": "Préférences",
	"about": "À propos",
	"downloadLocation": "Emplacement des téléchargements",
	"currentDownloadLocation": "Emplacement de téléchargement actuel - ",
	"enableTransparentDarkMode": "Activer le mode sombre transparent (seulement sur Linux, nécessite un redémarrage)",
	"downloadingNecessaryFilesWait": "Veuillez patienter, les fichiers nécessaires sont en cours de téléchargement",
	"video": "Vidéo",
	"audio": "Audio",
	"title": "Titre ",
	"selectFormat": "Format ",
	"download": "Téléchargement",
	"selectDownloadLocation": "Choisir l'emplacement de téléchargement",
	"moreOptions": "Plus d'options",
	"start": "Début",
	"selectLanguageRelaunch": "Choix de la langue (nécessite un redémarrage)",
	"downloadTimeRange": "Télécharger un extrait",
	"end": "Fin",
	"timeRangeStartEmptyHint": "Si laissé vide, commencera depuis le début",
	"timeRangeEndEmptyHint": "Si laissé vide, terminera à la fin",
	"homepage": "Page d'accueil",
	"aboutAppDescription": "Ce logiciel est libre et open-source, construit avec Node.js et Electron. yt-dlp est utilisé pour le téléchargement",
	"sourceCodeAvailable": "Le code source est disponible ",
	"here": "ici",
	"processing": "En cours",
	"errorNetworkOrUrl": "Une erreur est survenue. Vérifiez votre connexion internet ainsi que l'adresse URL",
	"errorFailedFileDownload": "Impossible de télécharger les fichiers. Vérifiez votre connexion internet et réessayez",
	"tryAgain": "Réessayez",
	"unknownSize": "Taille inconnue",
	"megabyte": "Mo",
	"unknownQuality": "Qualité inconnue",
	"downloading": "Téléchargement...",
	"errorHoverForDetails": "Une erreur est survenue. Voir détails",
	"fileSavedSuccessfully": "Fichier enregistré avec succès",
	"fileSavedClickToOpen": "Fichier enregistré. Cliquez pour ouvrir",
	"preparing": "Préparation...",
	"progress": "Avancement",
	"speed": "Vitesse",
	"quality": "Qualité",
	"restartApp": "Redémarrer l'application",
	"subtitles": "Sous-titres",
	"downloadSubtitlesAvailable": "Télécharger les sous-titres si disponibles",
	"downloadSubtitlesAuto": "Télécharger les sous-titres automatiquement générés",
	"extractAudioFromVideo": "Extraire l'audio depuis la vidéo",
	"extract": "Extraire",
	"downloadingNecessaryFiles": "Téléchargement des fichiers",
	"qualityLow": "faible",
	"qualityMedium": "moyenne",
	"appDescription": "ytDownloader vous permet de télécharger des vidéos et audios depuis des centaines de sites comme Youtube, Facebook, Instagram, TikTok, Twitter et plus encore",
	"pasteText": "Cliquez pour coller le lien vidéo depuis le presse-papiers",
	"pastePlaylistLinkTooltip": "Cliquez pour coller le lien de la playlist depuis le presse-papiers",
	"link": "Lien:",
	"downloadingPlaylist": "Téléchargement de la playlist:",
	"downloadPlaylistButton": "Télécharger une playlist",
	"playlistDownloaded": "Playlist téléchargée",
	"cookiesWarning": "Cette option vous permet de télécharger du contenu restreint. Vous rencontrerez des erreurs s'il n'y a pas de cookies",
	"selectBrowserForCookies": "Choisir le navigateur dont utiliser les cookies",
	"none": "Aucun",
	"updateAvailableDownloadPrompt": "Une nouvelle version est disponible, souhaitez-vous la télécharger ?",
	"updateAvailablePrompt": "Une nouvelle version est disponible, souhaitez-vous mettre à jour ?",
	"update": "Mise à jour",
	"no": "Non",
	"installAndRestartPrompt": "Installer et redémarrer maintenant ?",
	"restart": "Redémarrer",
	"later": "Plus tard",
	"extractAudio": "Extraire l'audio",
	"selectVideoFormat": "Choisir le format vidéo ",
	"selectAudioFormat": "Choisir le format audio ",
	"maxActiveDownloads": "Nombre maximal de téléchargements simultanés",
	"preferredVideoQuality": "Qualité vidéo par défaut",
	"preferredAudioFormat": "Qualité audio par défaut",
	"best": "Meilleur",
	"fileSaved": "Fichier enregistré.",
	"openDownloadFolder": "Ouvrir dossier de téléchargements",
	"path": "Chemin :",
	"selectConfigFile": "Choisir un fichier de configuration",
	"useConfigFile": "Utiliser un fichier de configuration",
	"playlistFilenameFormat": "Format des noms de fichier pour les playlists",
	"playlistFolderNameFormat": "Format des noms de dossier pour les playlists",
	"resetToDefault": "Remettre la valeur par défaut",
	"playlistRange": "Partie de la playlist",
	"thumbnail": "Miniature",
	"linkAdded": "Lien ajouté",
	"downloadThumbnails": "Télécharger les miniatures",
	"saveVideoLinksToFile": "Sauvegarder les liens des vidéos dans un fichier",
	"closeAppToTray": "Fermer dans la barre d'état",
	"useConfigFileCheckbox": "Utiliser un fichier de configuration",
	"openApp": "Ouvrir l'application",
	"pasteVideoLink": "Coller le lien de la vidéo",
	"quit": "Quitter",
	"errorDetails": "Détails de l'erreur",
	"clickToCopy": "Cliquez pour copier",
	"copiedText": "Texte copié",
	"qualityNormal": "Normale",
	"qualityGood": "Bon",
	"qualityBad": "Mauvais",
	"qualityWorst": "Pire",
	"selectQuality": "Sélectionner la qualité",
	"disableAutoUpdates": "Désactiver les mises à jour automatiques",
	"qualityUltraLow": "extrêmement bas",
	"closeAppOnFinish": "Fermer l'application à la fin du téléchargement",
	"auto": "Automatique",
	"theme": "Thème",
	"themeLight": "Clair",
	"themeDark": "Sombre",
	"themeFrappe": "Frappé",
	"themeOneDark": "One Dark",
	"themeMatrix": "Matrice",
	"themeSolarizedDark": "Solarisé sombre",
	"preferredVideoCodec": "Codec vidéo préféré",
	"showMoreFormatOptions": "Afficher plus d'options de format",
	"flatsealPermissionWarning": "Vous devez donner à l'application la permission d'accéder au répertoire personnel pour utiliser ceci. Vous pouvez le faire avec Flatseal en activant la permission avec le texte 'filesystem=home'",
	"noAudio": "Pas d'Audio",
	"proxy": "Proxy",
	"clearDownloads": "Effacer les téléchargements",
	"compressor": "Compresseur",
	"dragAndDropFiles": "Glisser-déposer le(s) fichier(s)",
	"chooseFiles": "Choisir le(s) fichier(s)",
	"noFilesSelected": "Aucun fichier sélectionné",
	"videoFormat": "Format vidéo",
	"videoEncoder": "Encodeur vidéo",
	"compressionSpeed": "Vitesse de compression",
	"videoQuality": "Qualité vidéo",
	"audioFormat": "Format audio",
	"outputSuffix": "Suffixe de sortie",
	"outputInSameFolder": "Sortie dans le même dossier",
	"selectCustomFolder": "Sélectionner un dossier personnalisé",
	"startCompression": "Démarrer la compression",
	"cancel": "Annuler",
	"errorClickForDetails": "Erreur ! Cliquez pour les détails",
	"homebrewYtDlpWarning": "Vous devez d'abord télécharger yt-dlp via Homebrew",
	"openHomebrew": "Ouvrir Homebrew",
	"downloadHistory": "Historique des téléchargements",
	"close": "Fermer",
	"searchByTitleOrUrl": "Rechercher par titre ou URL...",
	"allFormats": "Tous les formats",
	"exportAsJson": "Exporter en JSON",
	"exportAsCsv": "Exporter en CSV",
	"clearAllHistory": "Effacer tout l'historique",
	"noDownloadsYet": "Aucun téléchargement pour l'instant",
	"downloadHistoryPlaceholder": "Votre historique de téléchargement apparaîtra ici",
	"format": "Format",
	"size": "Taille",
	"date": "Date",
	"duration": "Durée",
	"copyUrl": "Copier l'URL",
	"open": "Ouvrir",
	"delete": "Supprimer",
	"totalDownloads": "Total des téléchargements",
	"totalSize": "Taille totale",
	"mostCommonFormat": "Format le plus courant",
	"urlCopiedToClipboard": "URL copiée dans le presse-papiers !",
	"confirmDeleteHistoryItem": "Êtes-vous sûr de vouloir supprimer cet élément de l'historique ?",
	"confirmClearAllHistory": "Êtes-vous sûr de vouloir effacer tout l'historique de téléchargement ? Cette action est irréversible !",
	"fileDoesNotExist": "Le fichier n'existe plus",
	"updatingYtdlp": "Mise à jour de yt-dlp",
	"updatedYtdlp": "yt-dlp mis à jour",
	"ytDlpUpdateRequired": "Si yt-dlp est en cours de mise à jour, attendez que la mise à jour se termine. Si vous avez installé yt-dlp vous-même, veuillez le mettre à jour.",
	"failedToDeleteHistoryItem": "Échec de la suppression de l'élément de l'historique",
	"customArgsTxt": "Définir des options yt-dlp personnalisées.",
	"learnMore": "En savoir plus",
	"updateError": "Une erreur s'est produite lors du processus de mise à jour",
	"unableToAccessDir": "Le programme ne peut pas accéder à ce dossier",
	"downloadingUpdate": "Chargement des données"
}
```

--------------------------------------------------------------------------------

---[FILE: translations/hi-IN.json]---
Location: ytDownloader-main/translations/hi-IN.json

```json
{
	"preferences": "प्राथमिकताएं",
	"about": "के बारे में",
	"downloadLocation": "डाउनलोड स्थान",
	"currentDownloadLocation": "वर्तमान डाउनलोड स्थान - ",
	"enableTransparentDarkMode": "पारदर्शी डार्क मोड सक्षम करें (केवल Linux, पुनः आरंभ करना होगा)",
	"downloadingNecessaryFilesWait": "कृपया प्रतीक्षा करें, आवश्यक फ़ाइलें डाउनलोड हो रही हैं",
	"video": "वीडियो",
	"audio": "ऑडियो",
	"title": "शीर्षक ",
	"selectFormat": "स्वरूप चुनें ",
	"download": "डाउनलोड करें",
	"selectDownloadLocation": "डाउनलोड स्थान चुनें",
	"moreOptions": "अधिक विकल्प",
	"start": "शुरू",
	"selectLanguageRelaunch": "भाषा चुनें (पुनः आरंभ करना होगा)",
	"downloadTimeRange": "एक विशेष समय-सीमा डाउनलोड करें",
	"end": "समाप्त",
	"timeRangeStartEmptyHint": "यदि खाली रखा जाता है, तो यह शुरुआत से शुरू होगा",
	"timeRangeEndEmptyHint": "यदि खाली रखा जाता है, तो यह अंत तक डाउनलोड होगा",
	"homepage": "मुखपृष्ठ",
	"aboutAppDescription": "यह एक मुफ़्त और ओपन सोर्स ऐप है जो Node.js और Electron पर बनाया गया है। डाउनलोड के लिए yt-dlp का उपयोग किया गया है",
	"sourceCodeAvailable": "स्रोत कोड उपलब्ध है ",
	"here": "यहाँ",
	"processing": "प्रसंस्करण हो रहा है",
	"errorNetworkOrUrl": "कुछ त्रुटि हुई है। अपना नेटवर्क जांचें और सही URL का उपयोग करें",
	"errorFailedFileDownload": "आवश्यक फ़ाइलें डाउनलोड करने में विफल। कृपया अपना नेटवर्क जांचें और पुनः प्रयास करें",
	"tryAgain": "पुनः प्रयास करें",
	"unknownSize": "अज्ञात आकार",
	"megabyte": "MB",
	"unknownQuality": "अज्ञात गुणवत्ता",
	"downloading": "डाउनलोड हो रहा है...",
	"errorHoverForDetails": "कुछ त्रुटि हुई है। विवरण देखने के लिए होवर करें",
	"fileSavedSuccessfully": "फ़ाइल सफलतापूर्वक सहेजी गई",
	"fileSavedClickToOpen": "फ़ाइल सहेजी गई। खोलने के लिए क्लिक करें",
	"preparing": "तैयारी हो रही है...",
	"progress": "प्रगति",
	"speed": "गति",
	"quality": "गुणवत्ता",
	"restartApp": "ऐप पुनः आरंभ करें",
	"subtitles": "उपशीर्षक",
	"downloadSubtitlesAvailable": "उपलब्ध होने पर उपशीर्षक डाउनलोड करें",
	"downloadSubtitlesAuto": "स्वचालित रूप से उत्पन्न उपशीर्षक डाउनलोड करें",
	"extractAudioFromVideo": "वीडियो से ऑडियो निकालें",
	"extract": "निकालें",
	"downloadingNecessaryFiles": "आवश्यक फ़ाइलें डाउनलोड हो रही हैं",
	"qualityLow": "कम",
	"qualityMedium": "मध्यम",
	"appDescription": "ytDownloader आपको YouTube, Facebook, Instagram, Tiktok, Twitter और कई अन्य सैकड़ों साइटों से वीडियो और ऑडियो डाउनलोड करने देता है",
	"pasteText": "क्लिपबोर्ड से वीडियो लिंक पेस्ट करने के लिए क्लिक करें",
	"pastePlaylistLinkTooltip": "क्लिपबोर्ड से प्लेलिस्ट लिंक पेस्ट करने के लिए क्लिक करें",
	"link": "लिंक:",
	"downloadingPlaylist": "प्लेलिस्ट डाउनलोड हो रही है:",
	"downloadPlaylistButton": "प्लेलिस्ट डाउनलोड करें",
	"playlistDownloaded": "प्लेलिस्ट डाउनलोड हो गई",
	"cookiesWarning": "यह विकल्प आपको प्रतिबंधित सामग्री डाउनलोड करने देता है। यदि कुकीज़ मौजूद नहीं हैं तो आपको त्रुटियां मिलेंगी",
	"selectBrowserForCookies": "कुकीज़ का उपयोग करने के लिए ब्राउज़र चुनें",
	"none": "कोई नहीं",
	"updateAvailableDownloadPrompt": "एक नया संस्करण उपलब्ध है, क्या आप इसे डाउनलोड करना चाहते हैं?",
	"updateAvailablePrompt": "एक नया संस्करण उपलब्ध है, क्या आप अपडेट करना चाहते हैं?",
	"update": "अपडेट करें",
	"no": "नहीं",
	"installAndRestartPrompt": "अभी इंस्टॉल करें और पुनः आरंभ करें?",
	"restart": "पुनः आरंभ करें",
	"later": "बाद में",
	"extractAudio": "ऑडियो निकालें",
	"selectVideoFormat": "वीडियो स्वरूप चुनें ",
	"selectAudioFormat": "ऑडियो स्वरूप चुनें ",
	"maxActiveDownloads": "सक्रिय डाउनलोड की अधिकतम संख्या",
	"preferredVideoQuality": "पसंदीदा वीडियो गुणवत्ता",
	"preferredAudioFormat": "पसंदीदा ऑडियो स्वरूप",
	"best": "सर्वोत्तम",
	"fileSaved": "फ़ाइल सहेजी गई।",
	"openDownloadFolder": "डाउनलोड फ़ोल्डर खोलें",
	"path": "पथ:",
	"selectConfigFile": "कॉन्फ़िगरेशन फ़ाइल चुनें",
	"useConfigFile": "कॉन्फ़िगरेशन फ़ाइल का उपयोग करें",
	"playlistFilenameFormat": "प्लेलिस्ट के लिए फ़ाइल नाम स्वरूप",
	"playlistFolderNameFormat": "प्लेलिस्ट के लिए फ़ोल्डर नाम स्वरूप",
	"resetToDefault": "डिफ़ॉल्ट पर रीसेट करें",
	"playlistRange": "प्लेलिस्ट रेंज",
	"thumbnail": "थंबनेल",
	"linkAdded": "लिंक जोड़ा गया",
	"downloadThumbnails": "थंबनेल डाउनलोड करें",
	"saveVideoLinksToFile": "वीडियो लिंक को एक फ़ाइल में सहेजें",
	"closeAppToTray": "सिस्टम ट्रे में ऐप बंद करें",
	"useConfigFileCheckbox": "कॉन्फ़िगरेशन फ़ाइल का उपयोग करें",
	"openApp": "ऐप खोलें",
	"pasteVideoLink": "वीडियो लिंक पेस्ट करें",
	"quit": "छोड़ें",
	"errorDetails": "त्रुटि विवरण",
	"clickToCopy": "कॉपी करने के लिए क्लिक करें",
	"copiedText": "पाठ कॉपी किया गया",
	"qualityNormal": "सामान्य",
	"qualityGood": "अच्छा",
	"qualityBad": "बुरा",
	"qualityWorst": "सबसे खराब",
	"selectQuality": "गुणवत्ता चुनें",
	"disableAutoUpdates": "ऑटो अपडेट अक्षम करें",
	"qualityUltraLow": "अति निम्न",
	"closeAppOnFinish": "डाउनलोड समाप्त होने पर ऐप बंद करें",
	"auto": "ऑटो",
	"theme": "थीम",
	"themeLight": "हल्का",
	"themeDark": "गहरा",
	"themeFrappe": "फ्रैप्पे",
	"themeOneDark": "वन डार्क",
	"themeMatrix": "मैट्रिक्स",
	"themeSolarizedDark": "सोलराइज़्ड डार्क",
	"preferredVideoCodec": "पसंदीदा वीडियो कोडेक",
	"showMoreFormatOptions": "अधिक स्वरूप विकल्प दिखाएँ",
	"flatsealPermissionWarning": "इसका उपयोग करने के लिए आपको ऐप को होम डायरेक्टरी तक पहुंचने की अनुमति देनी होगी। आप इसे Flatseal के साथ 'filesystem=home' टेक्स्ट के साथ अनुमति सक्षम करके कर सकते हैं",
	"noAudio": "कोई ऑडियो नहीं",
	"proxy": "प्रॉक्सी",
	"clearDownloads": "डाउनलोड साफ़ करें",
	"compressor": "कंप्रेसर",
	"dragAndDropFiles": "फ़ाइल (फ़ाइलें) खींचें और छोड़ें",
	"chooseFiles": "फ़ाइल (फ़ाइलें) चुनें",
	"noFilesSelected": "कोई फ़ाइल नहीं चुनी गई",
	"videoFormat": "वीडियो स्वरूप",
	"videoEncoder": "वीडियो एन्कोडर",
	"compressionSpeed": "संपीड़न गति",
	"videoQuality": "वीडियो गुणवत्ता",
	"audioFormat": "ऑडियो स्वरूप",
	"outputSuffix": "आउटपुट प्रत्यय",
	"outputInSameFolder": "एक ही फ़ोल्डर में आउटपुट",
	"selectCustomFolder": "कस्टम फ़ोल्डर चुनें",
	"startCompression": "संपीड़न शुरू करें",
	"cancel": "रद्द करें",
	"errorClickForDetails": "त्रुटि! विवरण के लिए क्लिक करें",
	"homebrewYtDlpWarning": "आपको पहले Homebrew से yt-dlp डाउनलोड करना होगा",
	"openHomebrew": "होमब्रू खोलें",
	"downloadHistory": "डाउनलोड इतिहास",
	"close": "बंद करें",
	"searchByTitleOrUrl": "शीर्षक या URL द्वारा खोजें...",
	"allFormats": "सभी स्वरूप",
	"exportAsJson": "JSON के रूप में निर्यात करें",
	"exportAsCsv": "CSV के रूप में निर्यात करें",
	"clearAllHistory": "सभी इतिहास साफ़ करें",
	"noDownloadsYet": "अभी तक कोई डाउनलोड नहीं",
	"downloadHistoryPlaceholder": "आपका डाउनलोड इतिहास यहाँ दिखाई देगा",
	"format": "स्वरूप",
	"size": "आकार",
	"date": "तारीख",
	"duration": "अवधि",
	"copyUrl": "URL कॉपी करें",
	"open": "खोलें",
	"delete": "हटाएँ",
	"totalDownloads": "कुल डाउनलोड",
	"totalSize": "कुल आकार",
	"mostCommonFormat": "सबसे सामान्य स्वरूप",
	"urlCopiedToClipboard": "URL क्लिपबोर्ड पर कॉपी हो गया!",
	"confirmDeleteHistoryItem": "क्या आप वाकई इस आइटम को इतिहास से हटाना चाहते हैं?",
	"confirmClearAllHistory": "क्या आप वाकई सभी डाउनलोड इतिहास साफ़ करना चाहते हैं? यह पूर्ववत नहीं किया जा सकता!",
	"fileDoesNotExist": "File does not exist anymore",
	"updatingYtdlp": "Updating yt-dlp",
	"updatedYtdlp": "Updated yt-dlp",
	"ytDlpUpdateRequired": "If yt-dlp is updating, wait for the update to finish. If you have installed yt-dlp by yourself, please update it.",
	"failedToDeleteHistoryItem": "Failed to delete history item",
	"customArgsTxt": "Set custom yt-dlp options.",
	"learnMore": "और जानें",
	"updateError": "An error occurred during the update process",
	"unableToAccessDir": "The program cannot access that folder",
	"downloadingUpdate": "Downloading update"
}
```

--------------------------------------------------------------------------------

---[FILE: translations/hu-HU.json]---
Location: ytDownloader-main/translations/hu-HU.json

```json
{
	"preferences": "Beállítások",
	"about": "Névjegy",
	"downloadLocation": "Letöltés helye",
	"currentDownloadLocation": "Jelenlegi letöltés helye - ",
	"enableTransparentDarkMode": "Áttetszó sötét mód bekapcsolása (csak Linuxon, újraindítás szükséges)",
	"downloadingNecessaryFilesWait": "Kérem várjon, a szükséges fájlok letöltés alatt",
	"video": "Videó",
	"audio": "Hang",
	"title": "Cím ",
	"selectFormat": "Válasszon formátumot ",
	"download": "Letöltés",
	"selectDownloadLocation": "Letöltési hely kiválasztása",
	"moreOptions": "További beállítások",
	"start": "Indít",
	"selectLanguageRelaunch": "Nyelv kiválasztása (újraindítás szükséges)",
	"downloadTimeRange": "Idősáv letöltése",
	"end": "Vége",
	"timeRangeStartEmptyHint": "Elejéről kezdi, ha üresen hagyja",
	"timeRangeEndEmptyHint": "Végéig letölti, ha üresen hagyja",
	"homepage": "Kezdőlap",
	"aboutAppDescription": "Ez egy ingyenes és nyílt forráskódú alkalmazás, amely a Node.js-re és az Electronra épül. yt-dlp-t letöltéshez használható",
	"sourceCodeAvailable": "Forráskód elérhető ",
	"here": "itt",
	"processing": "Feldolgozás alatt",
	"errorNetworkOrUrl": "Valami hiba történt. Ellenőrizze a hálózatot, és használja a megfelelő URL-t",
	"errorFailedFileDownload": "Szükséges fájlok letöltése nem sikerült. Kérjük, ellenőrizze a hálózatot, és próbálja újra",
	"tryAgain": "Próbálja meg újra",
	"unknownSize": "Ismeretlen méret",
	"megabyte": "MB",
	"unknownQuality": "Ismeretlen minőség",
	"downloading": "Letöltés...",
	"errorHoverForDetails": "Hiba történt. Vigye az egérmutatót a hiba fölé a részletekért",
	"fileSavedSuccessfully": "Fájl sikeresen elmentve",
	"fileSavedClickToOpen": "Fájl elmentve. Kattintson a megnyitáshoz",
	"preparing": "Előkészítés...",
	"progress": "Készültség",
	"speed": "Sebesség",
	"quality": "Minőség",
	"restartApp": "Alkalmazás újraindítása",
	"subtitles": "Feliratok",
	"downloadSubtitlesAvailable": "Felirat letöltése, ha elérhető",
	"downloadSubtitlesAuto": "Automatikusan generált feliratok letöltése",
	"extractAudioFromVideo": "Hang kinyerése videóból",
	"extract": "Kinyerés",
	"downloadingNecessaryFiles": "Szükséges fájlok letöltése",
	"qualityLow": "alacsony",
	"qualityMedium": "közepes",
	"appDescription": "a ytDownloader segítségével videókat és hanganyagokat tölthet le több száz webhelyről, például Youtube, Facebook, Instagram, Tiktok, Twitter és így tovább",
	"pasteText": "Kattintson ide a videólink vágólapról történő beillesztéséhez",
	"pastePlaylistLinkTooltip": "Kattintson ide a lejátszási lista linkjének vágólapról történő beillesztéséhez",
	"link": "Link:",
	"downloadingPlaylist": "Lejátszási lista letöltése:",
	"downloadPlaylistButton": "Lejátszási lista letöltése",
	"playlistDownloaded": "Lejátszási lista letöltve",
	"cookiesWarning": "Ezzel az opcióval korlátozott tartalom is letölthető. Hibákat fog kapni sütik hiányában",
	"selectBrowserForCookies": "Válaszzon böngészőt, ahonnan a sütiket használjuk",
	"none": "Egyik sem",
	"updateAvailableDownloadPrompt": "Új verzió érhető el, szeretné letölteni?",
	"updateAvailablePrompt": "Új verzió érhető el, szeretné frissíteni?",
	"update": "Frissítés",
	"no": "Nem",
	"installAndRestartPrompt": "Telepíti és újraindítja most?",
	"restart": "Újraindítás",
	"later": "Később",
	"extractAudio": "Hang kinyerése",
	"selectVideoFormat": "Válasszon videó formátumot ",
	"selectAudioFormat": "Válasszon hang formátumot ",
	"maxActiveDownloads": "Aktív letöltések maximum száma",
	"preferredVideoQuality": "Előnyben részesített videó formátum",
	"preferredAudioFormat": "Előnyben részesített hang formátum",
	"best": "Legjobb",
	"fileSaved": "Fájl elmentve",
	"openDownloadFolder": "Letöltési mappa megnyitása",
	"path": "Elérési út:",
	"selectConfigFile": "Konfigurációs fájl kiválasztása",
	"useConfigFile": "Konfigurációs fájl alkalmazása",
	"playlistFilenameFormat": "Fájlnév formátum lejátszási listákhoz",
	"playlistFolderNameFormat": "Mappanév formátum lejátszási listákhoz",
	"resetToDefault": "Visszaállítás alapértelmezettre",
	"playlistRange": "Lejátszási lista hossza",
	"thumbnail": "Előnézet",
	"linkAdded": "Link hozzáadva",
	"downloadThumbnails": "Előnézet letöltése",
	"saveVideoLinksToFile": "Videó linkek mentése fájlba",
	"closeAppToTray": "Bezárás az értesítési területre",
	"useConfigFileCheckbox": "Konfigurációs fájl használata",
	"openApp": "Alkalmazás megnyitása",
	"pasteVideoLink": "Videó link beillesztése",
	"quit": "Kilépés",
	"errorDetails": "Hiba részletei",
	"clickToCopy": "Kattintson a másoláshoz",
	"copiedText": "Kimásolt szöveg",
	"qualityNormal": "Átlagos",
	"qualityGood": "Jó",
	"qualityBad": "Rossz",
	"qualityWorst": "Legrosszabb",
	"selectQuality": "Minőség kiválasztása",
	"disableAutoUpdates": "Automatikus frissítések kikapcsolása",
	"qualityUltraLow": "legeslegrosszabb",
	"closeAppOnFinish": "Alkalmazás bezárása amint a letöltés befejeződött",
	"auto": "Automatikus",
	"theme": "Téma",
	"themeLight": "Világos",
	"themeDark": "Sötét",
	"themeFrappe": "Frappé",
	"themeOneDark": "Sötét",
	"themeMatrix": "Mátrix",
	"themeSolarizedDark": "Szolarizált sötét",
	"preferredVideoCodec": "Előnyben részesített videokodek",
	"showMoreFormatOptions": "További formátumbeállítások megjelenítése",
	"flatsealPermissionWarning": "Ennek használatához engedélyt kell adnia az alkalmazásnak a home könyvtár eléréséhez. Meg tudod csinálni a Flatseal segítségével, Ha engedélyezed az engedélyt a 'filesystem=home'szöveggel",
	"noAudio": "Nincs hang",
	"proxy": "Proxy",
	"clearDownloads": "Letöltések törlése",
	"compressor": "Tömörítő",
	"dragAndDropFiles": "Húzzon át fájl(oka)t",
	"chooseFiles": "Fájl(ok) kiválasztása",
	"noFilesSelected": "Nincs kiválasztott fájl",
	"videoFormat": "Videó formátum",
	"videoEncoder": "Videó kódoló",
	"compressionSpeed": "Tömörítési sebesség",
	"videoQuality": "Videó minőség",
	"audioFormat": "Hang formátum",
	"outputSuffix": "Kimeneti utótag",
	"outputInSameFolder": "Kimenet ugyanabba a mappába",
	"selectCustomFolder": "Egyedi mappa kiválasztása",
	"startCompression": "Tömörítés indítása",
	"cancel": "Mégse",
	"errorClickForDetails": "Hiba! Kattintson a részletekért",
	"homebrewYtDlpWarning": "Először le kell töltenie a yt-dlp-t a Homebrew-ból",
	"openHomebrew": "Homebrew megnyitása",
	"downloadHistory": "Letöltési előzmények",
	"close": "Bezárás",
	"searchByTitleOrUrl": "Keresés cím vagy URL alapján...",
	"allFormats": "Minden formátum",
	"exportAsJson": "Exportálás JSON-ként",
	"exportAsCsv": "Exportálás CSV-ként",
	"clearAllHistory": "Összes előzmény törlése",
	"noDownloadsYet": "Még nincsenek letöltések",
	"downloadHistoryPlaceholder": "A letöltési előzmények itt fognak megjelenni",
	"format": "Formátum",
	"size": "Méret",
	"date": "Dátum",
	"duration": "Időtartam",
	"copyUrl": "URL másolása",
	"open": "Megnyitás",
	"delete": "Törlés",
	"totalDownloads": "Összes letöltés",
	"totalSize": "Teljes méret",
	"mostCommonFormat": "Leggyakoribb formátum",
	"urlCopiedToClipboard": "URL vágólapra másolva!",
	"confirmDeleteHistoryItem": "Biztosan törölni szeretné ezt az elemet az előzményekből?",
	"confirmClearAllHistory": "Biztosan törölni szeretné az összes letöltési előzményt? Ezt nem lehet visszavonni!",
	"fileDoesNotExist": "File does not exist anymore",
	"updatingYtdlp": "Updating yt-dlp",
	"updatedYtdlp": "Updated yt-dlp",
	"ytDlpUpdateRequired": "If yt-dlp is updating, wait for the update to finish. If you have installed yt-dlp by yourself, please update it.",
	"failedToDeleteHistoryItem": "Failed to delete history item",
	"customArgsTxt": "Set custom yt-dlp options.",
	"learnMore": "További információ",
	"updateError": "Hiba történt a frissítési folyamat során",
	"unableToAccessDir": "The program cannot access that folder",
	"downloadingUpdate": "Frissítés letöltése"
}
```

--------------------------------------------------------------------------------

---[FILE: translations/i18n-init.js]---
Location: ytDownloader-main/translations/i18n-init.js

```javascript
const I18n = require("../translations/i18n");
const i18n = new I18n();

(async () => {
	await i18n.init();
	document.dispatchEvent(new Event("translations-loaded"));
})();

window.i18n = i18n;
```

--------------------------------------------------------------------------------

---[FILE: translations/i18n.js]---
Location: ytDownloader-main/translations/i18n.js

```javascript
const {ipcRenderer} = require("electron");

function normalizeLocale(locale) {
	if (!locale) return "en";
	const parts = locale.split("-");
	const lang = parts[0].toLowerCase();
	const region = parts[1] ? parts[1].toUpperCase() : null;

	const defaultRegions = {
		zh: "CN",
		en: "US",
		ru: "RU",
		pt: "BR",
		fi: "FI",
		fr: "FR",
		es: "ES",
		de: "DE",
		it: "IT",
		ja: "JP",
		ar: "SA",
	};

	if (!region && defaultRegions[lang]) {
		return `${lang}-${defaultRegions[lang]}`;
	}

	return region ? `${lang}-${region}` : lang;
}

async function getLocale() {
	try {
		const saved = localStorage.getItem("locale");
		if (saved) return saved;
	} catch (e) {}

	let locale = null;
	try {
		locale = await ipcRenderer.invoke("get-system-locale");
	} catch (e) {
		console.log(e)
	}

	if (!locale && typeof navigator !== "undefined") {
		locale =
			navigator.language ||
			(navigator.languages && navigator.languages[0]);
	}

	const normalized = normalizeLocale(locale || "en");

	try {
		localStorage.setItem("locale", normalized);
	} catch (e) {}

	return normalized;
}

function I18n() {
	this.loadedLanguage = {};
	this.locale = "en";

	this.init = async () => {
		try {
			this.locale = await getLocale();
			this.loadedLanguage = await ipcRenderer.invoke(
				"get-translation",
				this.locale
			);
		} catch (error) {
			console.error("Error loading translations:", error);
			this.loadedLanguage = {};
		}
	};

	this.__ = function (phrase) {
		return this.loadedLanguage[phrase] !== undefined
			? this.loadedLanguage[phrase]
			: phrase;
	};

	this.translatePage = () => {
		document.querySelectorAll("[data-translate]").forEach((element) => {
			const key = element.getAttribute("data-translate");
			element.textContent = this.__(key);
		});

		document
			.querySelectorAll("[data-translate-placeholder]")
			.forEach((element) => {
				const key = element.getAttribute("data-translate-placeholder");
				element.placeholder = this.__(key);
			});

		document
			.querySelectorAll("[data-translate-title]")
			.forEach((element) => {
				const key = element.getAttribute("data-translate-title");
				element.title = this.__(key);
			});
	};

	this.setLocale = async function (newLocale) {
		const normalized = normalizeLocale(newLocale);
		localStorage.setItem("locale", normalized);
		this.loadedLanguage = await ipcRenderer.invoke(
			"get-translation",
			normalized
		);
		this.locale = normalized;

		this.translatePage();
	};
}

module.exports = I18n;
```

--------------------------------------------------------------------------------

---[FILE: translations/it-IT.json]---
Location: ytDownloader-main/translations/it-IT.json

```json
{
	"preferences": "Preferenze",
	"about": "Informazioni",
	"downloadLocation": "Posizione di download",
	"currentDownloadLocation": "Posizione di download corrente - ",
	"enableTransparentDarkMode": "Abilita la modalità scura trasparente (solo Linux, necessita di riavvio)",
	"downloadingNecessaryFilesWait": "Attendere, è in corso lo scaricamento dei file necessari",
	"video": "Video",
	"audio": "Audio",
	"title": "Titolo ",
	"selectFormat": "Selezione formato ",
	"download": "Scarica",
	"selectDownloadLocation": "Seleziona posizione di download",
	"moreOptions": "Più opzioni",
	"start": "Inizia",
	"selectLanguageRelaunch": "Seleziona la lingua (richiede il riavvio)",
	"downloadTimeRange": "Scarica particolare intervallo di tempo",
	"end": "Fine",
	"timeRangeStartEmptyHint": "Se lasciato vuoto, ricomincerà dall'inizio",
	"timeRangeEndEmptyHint": "Se lasciato vuoto, verrà scaricato fino alla fine",
	"homepage": "Homepage",
	"aboutAppDescription": "È un'app gratuita e open source basata su Node.js ed Electron. yt-dlp è stato utilizzato per il download",
	"sourceCodeAvailable": "Il codice sorgente è disponibile ",
	"here": "qui",
	"processing": "In elaborazione",
	"errorNetworkOrUrl": "Si è verificato un errore. Controlla la tua rete e usa l'URL corretto",
	"errorFailedFileDownload": "Impossibile scaricare i file necessari. Controlla la tua rete e riprova",
	"tryAgain": "Riprova",
	"unknownSize": "Dimensione sconosciuta",
	"megabyte": "MB",
	"unknownQuality": "Qualità sconosciuta",
	"downloading": "Scaricamento in corso...",
	"errorHoverForDetails": "Si è verificato un errore. Passa il mouse per vedere i dettagli",
	"fileSavedSuccessfully": "File salvato con successo",
	"fileSavedClickToOpen": "File salvato. Fare clic per aprire",
	"preparing": "Preparazione in corso...",
	"progress": "Avanzamento in corso",
	"speed": "Velocità",
	"quality": "Qualità",
	"restartApp": "Riavvia l'app",
	"subtitles": "Sottotitoli",
	"downloadSubtitlesAvailable": "Scarica i sottotitoli se disponibili",
	"downloadSubtitlesAuto": "Scarica i sottotitoli generati automaticamente",
	"extractAudioFromVideo": "Estrai l'audio dal video",
	"extract": "Estrai",
	"downloadingNecessaryFiles": "Scaricamento dei file necessari",
	"qualityLow": "bassa",
	"qualityMedium": "media",
	"appDescription": "ytDownloader ti consente di scaricare video e audio da centinaia di siti come Youtube, Facebook, Instagram, Tiktok, Twitter e così via",
	"pasteText": "Clicca per incollare il link del video dagli appunti",
	"pastePlaylistLinkTooltip": "Clicca per incollare il link della playlist dagli appunti",
	"link": "Collegamento:",
	"downloadingPlaylist": "Scaricamento playlist:",
	"downloadPlaylistButton": "Scarica playlist",
	"playlistDownloaded": "Playlist scaricata",
	"cookiesWarning": "Questa opzione consente di scaricare contenuti limitati. Si otterranno errori se i cookie non ci sono",
	"selectBrowserForCookies": "Seleziona il browser da cui utilizzare i cookie",
	"none": "Nessuna",
	"updateAvailableDownloadPrompt": "È disponibile una nuova versione, vuoi scaricarla?",
	"updateAvailablePrompt": "È disponibile una nuova versione, vuoi aggiornare?",
	"update": "Aggiorna",
	"no": "No",
	"installAndRestartPrompt": "Installare e riavviare ora?",
	"restart": "Riavvia",
	"later": "Dopo",
	"extractAudio": "Estrai Audio",
	"selectVideoFormat": "Seleziona Formato Video ",
	"selectAudioFormat": "Seleziona Formato Audio ",
	"maxActiveDownloads": "Numero massimo di download attivi",
	"preferredVideoQuality": "Qualità video preferita",
	"preferredAudioFormat": "Formato audio preferito",
	"best": "Migliore",
	"fileSaved": "File salvato.",
	"openDownloadFolder": "Apri cartella di download",
	"path": "Percorso:",
	"selectConfigFile": "File di configurazione",
	"useConfigFile": "Usa il file di configurazione",
	"playlistFilenameFormat": "Formato nome file per scalette",
	"playlistFolderNameFormat": "Formato nome cartella per le scalette",
	"resetToDefault": "Ripristina predefinito",
	"playlistRange": "Intervallo di playlist",
	"thumbnail": "Miniatura",
	"linkAdded": "Link aggiunto",
	"downloadThumbnails": "Scarica miniature",
	"saveVideoLinksToFile": "Salva link video su un file",
	"closeAppToTray": "Chiudi app nel vassoio di sistema",
	"useConfigFileCheckbox": "Usa file di configurazione",
	"openApp": "Apri app",
	"pasteVideoLink": "Incolla link video",
	"quit": "Esci",
	"errorDetails": "Dettagli errore",
	"clickToCopy": "Clicca per copiare",
	"copiedText": "Testo copiato",
	"qualityNormal": "Normale",
	"qualityGood": "Buona",
	"qualityBad": "Cattiva",
	"qualityWorst": "Bassa",
	"selectQuality": "Seleziona qualità",
	"disableAutoUpdates": "Disabilita aggiornamenti automatici",
	"qualityUltraLow": "ultra bassa",
	"closeAppOnFinish": "Chiudi app al termine del download",
	"auto": "Automatico",
	"theme": "Tema",
	"themeLight": "Chiaro",
	"themeDark": "Scuro",
	"themeFrappe": "Frappé",
	"themeOneDark": "Uno Oscuro",
	"themeMatrix": "Matrice",
	"themeSolarizedDark": "Solarizzato scuro",
	"preferredVideoCodec": "Codifica video preferita",
	"showMoreFormatOptions": "Mostra più opzioni di formato",
	"flatsealPermissionWarning": "Devi dare all'app il permesso di accedere alla home directory per usarlo. Puoi farlo con Flatseal abilitando l'autorizzazione con il testo 'filesystem=home'",
	"noAudio": "Nessun Audio",
	"proxy": "Proxy",
	"clearDownloads": "Cancella Download",
	"compressor": "Compressore",
	"dragAndDropFiles": "Trascina e rilascia file",
	"chooseFiles": "Scegli File",
	"noFilesSelected": "Nessun file selezionato",
	"videoFormat": "Formato Video",
	"videoEncoder": "Codificatore Video",
	"compressionSpeed": "Velocità di Compressione",
	"videoQuality": "Qualità Video",
	"audioFormat": "Formato Audio",
	"outputSuffix": "Suffisso di Output",
	"outputInSameFolder": "Output nella stessa cartella",
	"selectCustomFolder": "Seleziona cartella personalizzata",
	"startCompression": "Avvia Compressione",
	"cancel": "Annulla",
	"errorClickForDetails": "Errore! Clicca per i dettagli",
	"homebrewYtDlpWarning": "Devi prima scaricare yt-dlp da Homebrew",
	"openHomebrew": "Apri Homebrew",
	"downloadHistory": "Cronologia Download",
	"close": "Chiudi",
	"searchByTitleOrUrl": "Cerca per titolo o URL...",
	"allFormats": "Tutti i Formati",
	"exportAsJson": "Esporta come JSON",
	"exportAsCsv": "Esporta come CSV",
	"clearAllHistory": "Cancella Tutta la Cronologia",
	"noDownloadsYet": "Ancora Nessun Download",
	"downloadHistoryPlaceholder": "La tua cronologia download apparirà qui",
	"format": "Formato",
	"size": "Dimensione",
	"date": "Data",
	"duration": "Durata",
	"copyUrl": "Copia URL",
	"open": "Apri",
	"delete": "Elimina",
	"totalDownloads": "Download Totali",
	"totalSize": "Dimensione Totale",
	"mostCommonFormat": "Formato più Comune",
	"urlCopiedToClipboard": "URL copiato negli appunti!",
	"confirmDeleteHistoryItem": "Sei sicuro di voler eliminare questo elemento dalla cronologia?",
	"confirmClearAllHistory": "Sei sicuro di voler cancellare tutta la cronologia dei download? Questa azione è irreversibile!",
	"fileDoesNotExist": "File does not exist anymore",
	"updatingYtdlp": "Updating yt-dlp",
	"updatedYtdlp": "Updated yt-dlp",
	"ytDlpUpdateRequired": "If yt-dlp is updating, wait for the update to finish. If you have installed yt-dlp by yourself, please update it.",
	"failedToDeleteHistoryItem": "Failed to delete history item",
	"customArgsTxt": "Set custom yt-dlp options.",
	"learnMore": "Learn more",
	"updateError": "An error occurred during the update process",
	"unableToAccessDir": "The program cannot access that folder",
	"downloadingUpdate": "Downloading update"
}
```

--------------------------------------------------------------------------------

---[FILE: translations/ja-JP.json]---
Location: ytDownloader-main/translations/ja-JP.json

```json
{
	"preferences": "環境設定",
	"about": "概要",
	"downloadLocation": "ダウンロード場所",
	"currentDownloadLocation": "現在のダウンロード場所 - ",
	"enableTransparentDarkMode": "透明なダークモードを有効にする(Linuxのみ、再起動が必要)",
	"downloadingNecessaryFilesWait": "お待ちください、必要なファイルがダウンロードされています",
	"video": "ビデオ",
	"audio": "オーディオ",
	"title": "タイトル ",
	"selectFormat": "フォーマットを選択 ",
	"download": "ダウンロード",
	"selectDownloadLocation": "ダウンロード場所を選択",
	"moreOptions": "その他のオプション",
	"start": "開始",
	"selectLanguageRelaunch": "言語を選択(再起動が必要)",
	"downloadTimeRange": "特定の時間範囲をダウンロード",
	"end": "終了",
	"timeRangeStartEmptyHint": "空白の場合は、最初から始めます",
	"timeRangeEndEmptyHint": "空白の場合、最後までダウンロードされます",
	"homepage": "ホーム",
	"aboutAppDescription": "これは、Node.jsとElectronの上に構築されたフリーでオープンソースアプリです。yt-dlpはダウンロードに使用されています。",
	"sourceCodeAvailable": "ソースコードはここで公開されています ",
	"here": "こちら",
	"processing": "処理中",
	"errorNetworkOrUrl": "いくつかのエラーが発生しました。ネットワークを確認し、正しいURLを使用してください。",
	"errorFailedFileDownload": "必要なファイルのダウンロードに失敗しました。ネットワークを確認し、もう一度試してください。",
	"tryAgain": "もう一度試してください",
	"unknownSize": "不明なサイズ",
	"megabyte": "MB",
	"unknownQuality": "不明な品質",
	"downloading": "ダウンロード中…",
	"errorHoverForDetails": "いくつかのエラーが発生しました。詳細を確認してください",
	"fileSavedSuccessfully": "ファイルは正常に保存されました",
	"fileSavedClickToOpen": "ファイルを保存しました。クリックして開く",
	"preparing": "準備中...",
	"progress": "進行状況",
	"speed": "速度",
	"quality": "品質",
	"restartApp": "アプリを再起動",
	"subtitles": "字幕",
	"downloadSubtitlesAvailable": "利用可能な場合は字幕をダウンロード",
	"downloadSubtitlesAuto": "自動生成された字幕をダウンロード",
	"extractAudioFromVideo": "ビデオからオーディオを抽出",
	"extract": "抽出",
	"downloadingNecessaryFiles": "必要なファイルをダウンロード中",
	"qualityLow": "低",
	"qualityMedium": "中",
	"appDescription": "ytDownloaderを使えば、Youtube・Facebook・Instagram・Tiktok・Twitterなど何百ものサイトからビデオやオーディオをダウンロードすることができます",
	"pasteText": "クリップボードからビデオリンクを貼り付けるにはクリックしてください",
	"pastePlaylistLinkTooltip": "クリップボードからプレイリストのリンクを貼り付けるにはクリックしてください",
	"link": "リンク:",
	"downloadingPlaylist": "プレイリストをダウンロード中:",
	"downloadPlaylistButton": "プレイリストをダウンロード",
	"playlistDownloaded": "プレイリストをダウンロードしました",
	"cookiesWarning": "このオプションを使用すると、制限されたコンテンツをダウンロードできます。クッキーがない場合はエラーが発生します。",
	"selectBrowserForCookies": "Cookieを使用するブラウザを選択",
	"none": "無し",
	"updateAvailableDownloadPrompt": "新しいバージョンが利用可能です。ダウンロードしますか？",
	"updateAvailablePrompt": "新しいバージョンが利用可能です。アップデートしますか？",
	"update": "アップデート",
	"no": "いいえ",
	"installAndRestartPrompt": "インストールして再起動しますか？",
	"restart": "再起動",
	"later": "後で",
	"extractAudio": "オーディオを抽出",
	"selectVideoFormat": "ビデオフォーマットを選択 ",
	"selectAudioFormat": "オーディオフォーマットを選択 ",
	"maxActiveDownloads": "アクティブなダウンロードの最大数",
	"preferredVideoQuality": "優先するビデオ品質",
	"preferredAudioFormat": "優先する音声フォーマット",
	"best": "最高",
	"fileSaved": "ファイルを保存しました。",
	"openDownloadFolder": "ダウンロードフォルダを開く",
	"path": "パス:",
	"selectConfigFile": "設定ファイルを選択",
	"useConfigFile": "設定ファイルを使用",
	"playlistFilenameFormat": "プレイリストのファイル名フォーマット",
	"playlistFolderNameFormat": "プレイリストのフォルダ名フォーマット",
	"resetToDefault": "初期設定に戻す",
	"playlistRange": "プレイリストの範囲",
	"thumbnail": "サムネイル",
	"linkAdded": "リンクを追加しました",
	"downloadThumbnails": "サムネイルをダウンロード",
	"saveVideoLinksToFile": "ビデオリンクをファイルに保存",
	"closeAppToTray": "システムトレイにアプリを閉じる",
	"useConfigFileCheckbox": "設定ファイルを使用",
	"openApp": "アプリを開く",
	"pasteVideoLink": "ビデオリンクを貼り付け",
	"quit": "終了",
	"errorDetails": "エラーの詳細",
	"clickToCopy": "クリックしてコピー",
	"copiedText": "コピーしたテキスト",
	"qualityNormal": "標準",
	"qualityGood": "良",
	"qualityBad": "悪",
	"qualityWorst": "最悪",
	"selectQuality": "品質を選択",
	"disableAutoUpdates": "自動アップデートを無効",
	"qualityUltraLow": "超低",
	"closeAppOnFinish": "ダウンロード終了時にアプリを閉じる",
	"auto": "自動",
	"theme": "外観",
	"themeLight": "ライト",
	"themeDark": "ダーク",
	"themeFrappe": "フラッペ",
	"themeOneDark": "One Dark",
	"themeMatrix": "マトリックス",
	"themeSolarizedDark": "ソーラライズド・ダーク",
	"preferredVideoCodec": "優先するビデオコーデック",
	"showMoreFormatOptions": "他のフォーマットオプションを表示",
	"flatsealPermissionWarning": "これを使用するには、ホームディレクトリにアクセスする権限をアプリに与える必要があります。 テキスト'filesystem=home'で権限を有効にすることで、Flatsealでそれを行うことができます",
	"noAudio": "オーディオなし",
	"proxy": "プロキシ",
	"clearDownloads": "ダウンロードをクリア",
	"compressor": "コンプレッサー",
	"dragAndDropFiles": "ファイル(群)をドラッグ＆ドロップ",
	"chooseFiles": "ファイルを選択",
	"noFilesSelected": "ファイルは選択されていません",
	"videoFormat": "ビデオフォーマット",
	"videoEncoder": "ビデオエンコーダー",
	"compressionSpeed": "圧縮速度",
	"videoQuality": "ビデオ品質",
	"audioFormat": "オーディオフォーマット",
	"outputSuffix": "出力サフィックス",
	"outputInSameFolder": "同じフォルダに出力",
	"selectCustomFolder": "カスタムフォルダを選択",
	"startCompression": "圧縮を開始",
	"cancel": "キャンセル",
	"errorClickForDetails": "エラー！クリックで詳細を確認",
	"homebrewYtDlpWarning": "まずHomebrewからyt-dlpをダウンロードする必要があります",
	"openHomebrew": "Homebrewを開く",
	"downloadHistory": "ダウンロード履歴",
	"close": "閉じる",
	"searchByTitleOrUrl": "タイトルまたはURLで検索...",
	"allFormats": "全てのフォーマット",
	"exportAsJson": "JSONとしてエクスポート",
	"exportAsCsv": "CSVとしてエクスポート",
	"clearAllHistory": "全ての履歴をクリア",
	"noDownloadsYet": "まだダウンロードはありません",
	"downloadHistoryPlaceholder": "ここにダウンロード履歴が表示されます",
	"format": "フォーマット",
	"size": "サイズ",
	"date": "日付",
	"duration": "期間",
	"copyUrl": "URLをコピー",
	"open": "開く",
	"delete": "削除",
	"totalDownloads": "合計ダウンロード数",
	"totalSize": "合計サイズ",
	"mostCommonFormat": "最も一般的なフォーマット",
	"urlCopiedToClipboard": "URLがクリップボードにコピーされました！",
	"confirmDeleteHistoryItem": "本当にこのアイテムを履歴から削除してもよろしいですか？",
	"confirmClearAllHistory": "本当に全てのダウンロード履歴をクリアしてもよろしいですか？この操作は元に戻せません！",
	"fileDoesNotExist": "ファイルはもう存在しません",
	"updatingYtdlp": "yt-dlpの更新",
	"updatedYtdlp": "更新日 yt-dlp",
	"ytDlpUpdateRequired": "Yt-dlpが更新されている場合は、更新が完了するのを待ちます。yt-dlpを自分でインストールした場合は更新してください。",
	"failedToDeleteHistoryItem": "履歴アイテムの削除に失敗しました",
	"customArgsTxt": "カスタム yt-dlp オプションを設定します。",
	"learnMore": "詳細",
	"updateError": "更新処理中にエラー発生.",
	"unableToAccessDir": "プログラムはそのフォルダにアクセスできません",
	"downloadingUpdate": "更新プログラムをダウンロード中"
}
```

--------------------------------------------------------------------------------

---[FILE: translations/ne-NP.json]---
Location: ytDownloader-main/translations/ne-NP.json

```json
{
	"preferences": "सेटिङहरू",
	"about": "बारेमा",
	"downloadLocation": "डाउनलोड स्थान",
	"currentDownloadLocation": "हालको डाउनलोड स्थान - ",
	"enableTransparentDarkMode": "पारदर्शी डार्क मोड सक्षम गर्नुहोस् (लिनक्स मात्र, पुनः सुरु गर्नु पर्छ)",
	"downloadingNecessaryFilesWait": "कृपया पर्खनुहोस्, आवश्यक फाइलहरू डाउनलोड हुँदैछन्",
	"video": "भिडियो",
	"audio": "अडियो",
	"title": "शीर्षक ",
	"selectFormat": "ढाँचा चयन गर्नुहोस् ",
	"download": "डाउनलोड गर्नुहोस्",
	"selectDownloadLocation": "डाउनलोड स्थान चयन गर्नुहोस्",
	"moreOptions": "थप विकल्पहरू",
	"start": "सुरु",
	"selectLanguageRelaunch": "भाषा चयन गर्नुहोस् (पुनः सुरु गर्नु पर्छ)",
	"downloadTimeRange": "समय दायरा डाउनलोड",
	"end": "समाप्ति",
	"timeRangeStartEmptyHint": "यदि खाली राखियो भने, यो सुरु देखि हुनेछ",
	"timeRangeEndEmptyHint": "यदि खाली राखियो भने, यो सुरु अन्त्यदेखि हुनेछ",
	"homepage": "गृहपृष्ठ",
	"aboutAppDescription": "यो Node.js र Electron मा निर्मित एक नि: शुल्क र खुला स्रोत एप हो। yt-dlp डाउनलोड गर्न प्रयोग गरिएको छ",
	"sourceCodeAvailable": "स्रोत कोड उपलब्ध छ ",
	"here": "यहाँ",
	"processing": "प्रशोधन भइरहेको",
	"errorNetworkOrUrl": "केही त्रुटि भएको छ। आफ्नो नेटवर्क जाँच गर्नुहोस् र सही URL प्रयोग गर्नुहोस्",
	"errorFailedFileDownload": "आवश्यक फाइलहरू डाउनलोड गर्न असफल भयो। कृपया आफ्नो नेटवर्क जाँच गर्नुहोस् र फेरि प्रयास गर्नुहोस्",
	"tryAgain": "फेरि प्रयास गर्नुहोस्",
	"unknownSize": "अज्ञात आकार",
	"megabyte": "MB",
	"unknownQuality": "अज्ञात गुणस्तर",
	"downloading": "डाउनलोड हुँदैछ...",
	"errorHoverForDetails": "केही त्रुटि भएको छ। विवरण हेर्न होभर गर्नुहोस्",
	"fileSavedSuccessfully": "फाइल सफलतापूर्वक सुरक्षित भयो",
	"fileSavedClickToOpen": "फाइल सुरक्षित भयो। खोल्न क्लिक गर्नुहोस्",
	"preparing": "तयारी हुँदैछ...",
	"progress": "प्रगति",
	"speed": "गति",
	"quality": "गुणस्तर",
	"restartApp": "एप पुनः सुरु गर्नुहोस्",
	"subtitles": "उपशीर्षकहरू",
	"downloadSubtitlesAvailable": "उपलब्ध भएमा उपशीर्षकहरू डाउनलोड गर्नुहोस्",
	"downloadSubtitlesAuto": "स्वचालित रूपमा उत्पन्न उपशीर्षकहरू डाउनलोड गर्नुहोस्",
	"extractAudioFromVideo": "भिडियोबाट अडियो निकाल्नुहोस्",
	"extract": "निकाल्नुहोस्",
	"downloadingNecessaryFiles": "आवश्यक फाइलहरू डाउनलोड हुँदैछन्",
	"qualityLow": "कम",
	"qualityMedium": "मध्यम",
	"appDescription": "ytDownloader ले तपाईंलाई Youtube, Facebook, Instagram, Tiktok, Twitter, लगायत सयौं साइटहरूबाट भिडियो र अडियो डाउनलोड गर्न दिन्छ",
	"pasteText": "क्लिपबोर्डबाट भिडियो लिङ्क टाँस्न क्लिक गर्नुहोस्",
	"pastePlaylistLinkTooltip": "क्लिपबोर्डबाट प्लेलिस्ट लिङ्क टाँस्न क्लिक गर्नुहोस्",
	"link": "लिङ्क:",
	"downloadingPlaylist": "प्लेलिस्ट डाउनलोड हुँदैछ:",
	"downloadPlaylistButton": "प्लेलिस्ट डाउनलोड गर्नुहोस्",
	"playlistDownloaded": "प्लेलिस्ट डाउनलोड भयो",
	"cookiesWarning": "यो विकल्पले तपाईंलाई प्रतिबन्धित सामग्री डाउनलोड गर्न दिन्छ। तपाईले असफल पाउनुहुनेछ यदि cookies छैन भने",
	"selectBrowserForCookies": "Cookies प्रयोग गर्न ब्राउजर चयन गर्नुहोस्",
	"none": "कुनै पनि छैन",
	"updateAvailableDownloadPrompt": "नयाँ संस्करण उपलब्ध छ, के तपाईं यसलाई डाउनलोड गर्न चाहनुहुन्छ?",
	"updateAvailablePrompt": "नयाँ संस्करण उपलब्ध छ, के तपाईं अद्यावधिक गर्न चाहनुहुन्छ?",
	"update": "अद्यावधिक गर्नुहोस्",
	"no": "छैन",
	"installAndRestartPrompt": "अहिले स्थापना गरेर पुनः सुरु गर्ने?",
	"restart": "पुनः सुरु गर्नुहोस्",
	"later": "पछि",
	"extractAudio": "अडियो निकाल्नुहोस्",
	"selectVideoFormat": "भिडियो ढाँचा चयन गर्नुहोस् ",
	"selectAudioFormat": "अडियो ढाँचा चयन गर्नुहोस् ",
	"maxActiveDownloads": "सक्रिय डाउनलोडहरूको अधिकतम संख्या",
	"preferredVideoQuality": "मनपर्ने भिडियो गुणस्तर",
	"preferredAudioFormat": "मनपर्ने अडियो ढाँचा",
	"best": "उत्कृष्ट",
	"fileSaved": "फाइल सुरक्षित भयो।",
	"openDownloadFolder": "डाउनलोड फोल्डर खोल्नुहोस्",
	"path": "मार्ग:",
	"selectConfigFile": "सेटिङ फाइल चयन गर्नुहोस्",
	"useConfigFile": "सेटिङ फाइल प्रयोग गर्नुहोस्",
	"playlistFilenameFormat": "प्लेलिस्टको लागि फाइलनाम ढाँचा",
	"playlistFolderNameFormat": "प्लेलिस्टको लागि फोल्डर नाम ढाँचा",
	"resetToDefault": "पूर्वनिर्धारितमा रिसेट गर्नुहोस्",
	"playlistRange": "प्लेलिस्ट दायरा",
	"thumbnail": "थम्बनेल",
	"linkAdded": "लिङ्क थपियो",
	"downloadThumbnails": "थम्बनेलहरू डाउनलोड गर्नुहोस्",
	"saveVideoLinksToFile": "भिडियो लिङ्कहरू फाइलमा सुरक्षित गर्नुहोस्",
	"closeAppToTray": "सिस्टम ट्रेमा एप बन्द गर्नुहोस्",
	"useConfigFileCheckbox": "सेटिङ फाइल प्रयोग गर्नुहोस्",
	"openApp": "एप खोल्नुहोस्",
	"pasteVideoLink": "भिडियो लिङ्क टाँस्नुहोस्",
	"quit": "छोड्नुहोस्",
	"errorDetails": "त्रुटि विवरणहरू",
	"clickToCopy": "प्रतिलिपि गर्न क्लिक गर्नुहोस्",
	"copiedText": "प्रतिलिपि गरिएको पाठ",
	"qualityNormal": "सामान्य",
	"qualityGood": "राम्रो",
	"qualityBad": "खराब",
	"qualityWorst": "सबैभन्दा खराब",
	"selectQuality": "गुणस्तर चयन गर्नुहोस्",
	"disableAutoUpdates": "स्वतः अद्यावधिकहरू असक्षम गर्नुहोस्",
	"qualityUltraLow": "अति कम",
	"closeAppOnFinish": "डाउनलोड समाप्त भएपछि एप बन्द गर्नुहोस्",
	"auto": "स्वत:",
	"theme": "थीम",
	"themeLight": "हल्का",
	"themeDark": "गाढा",
	"themeFrappe": "फ्रेप्पे",
	"themeOneDark": "एक गाढा",
	"themeMatrix": "म्याट्रिक्स",
	"themeSolarizedDark": "सोलराइज्ड गाढा",
	"preferredVideoCodec": "मनपर्ने भिडियो कोडेक",
	"showMoreFormatOptions": "थप ढाँचा विकल्पहरू देखाउनुहोस्",
	"flatsealPermissionWarning": "यो प्रयोग गर्नको लागि तपाईंले एपलाई होम डाइरेक्टरी पहुँच गर्न अनुमति दिनुपर्छ। तपाईंले Flatseal मा 'filesystem=home' पाठ सहितको अनुमति सक्षम गरेर यो गर्न सक्नुहुन्छ",
	"noAudio": "अडियो छैन",
	"proxy": "प्रोक्सी",
	"clearDownloads": "डाउनलोडहरू खाली गर्नुहोस्",
	"compressor": "कम्प्रेसर",
	"dragAndDropFiles": "फाइल(हरू) तान्नुहोस् र छोड्नुहोस्",
	"chooseFiles": "फाइल(हरू) छान्नुहोस्",
	"noFilesSelected": "कुनै फाइल चयन गरिएको छैन",
	"videoFormat": "भिडियो ढाँचा",
	"videoEncoder": "भिडियो इन्कोडर",
	"compressionSpeed": "कम्प्रेसन गति",
	"videoQuality": "भिडियो गुणस्तर",
	"audioFormat": "अडियो ढाँचा",
	"outputSuffix": "आउटपुट प्रत्यय",
	"outputInSameFolder": "एउटै फोल्डरमा आउटपुट",
	"selectCustomFolder": "अनुकूल फोल्डर चयन गर्नुहोस्",
	"startCompression": "कम्प्रेसन सुरु गर्नुहोस्",
	"cancel": "रद्द गर्नुहोस्",
	"errorClickForDetails": "त्रुटि! विवरणहरूको लागि क्लिक गर्नुहोस्",
	"homebrewYtDlpWarning": "तपाईंले पहिले Homebrew बाट yt-dlp डाउनलोड गर्नुपर्छ",
	"openHomebrew": "Homebrew खोल्नुहोस्",
	"downloadHistory": "डाउनलोड ईतिहास",
	"close": "बन्द गर्नुहोस्",
	"searchByTitleOrUrl": "शीर्षक वा URL द्वारा खोज्नुहोस्...",
	"allFormats": "सबै ढाँचाहरू",
	"exportAsJson": "JSON को रूपमा निर्यात गर्नुहोस्",
	"exportAsCsv": "CSV को रूपमा निर्यात गर्नुहोस्",
	"clearAllHistory": "सबै ईतिहास खाली गर्नुहोस्",
	"noDownloadsYet": "अहिलेसम्म कुनै डाउनलोड छैन",
	"downloadHistoryPlaceholder": "तपाईंको डाउनलोड ईतिहास यहाँ देखा पर्नेछ",
	"format": "ढाँचा",
	"size": "आकार",
	"date": "मिति",
	"duration": "अवधि",
	"copyUrl": "URL प्रतिलिपि गर्नुहोस्",
	"open": "खोल्नुहोस्",
	"delete": "मेटाउनुहोस्",
	"totalDownloads": "कुल डाउनलोडहरू",
	"totalSize": "कुल आकार",
	"mostCommonFormat": "सबैभन्दा सामान्य ढाँचा",
	"urlCopiedToClipboard": "URL क्लिपबोर्डमा प्रतिलिपि भयो!",
	"confirmDeleteHistoryItem": "के तपाईं निश्चित हुनुहुन्छ कि तपाईं यो वस्तु ईतिहासबाट मेटाउन चाहनुहुन्छ?",
	"confirmClearAllHistory": "के तपाईं निश्चित हुनुहुन्छ कि तपाईं सबै डाउनलोड ईतिहास खाली गर्न चाहनुहुन्छ? यो पूर्ववत गर्न सकिँदैन!",
	"fileDoesNotExist": "File does not exist anymore",
	"updatingYtdlp": "Updating yt-dlp",
	"updatedYtdlp": "Updated yt-dlp",
	"ytDlpUpdateRequired": "If yt-dlp is updating, wait for the update to finish. If you have installed yt-dlp by yourself, please update it.",
	"failedToDeleteHistoryItem": "Failed to delete history item",
	"customArgsTxt": "Set custom yt-dlp options.",
	"learnMore": "Learn more",
	"updateError": "An error occurred during the update process",
	"unableToAccessDir": "The program cannot access that folder",
	"downloadingUpdate": "Downloading update"
}
```

--------------------------------------------------------------------------------

---[FILE: translations/pl-PL.json]---
Location: ytDownloader-main/translations/pl-PL.json

```json
{
	"preferences": "Ustawienia",
	"about": "O programie",
	"downloadLocation": "Lokalizacja pobierania",
	"currentDownloadLocation": "Obecna lokalizacja pobierania - ",
	"enableTransparentDarkMode": "Włącz przezroczysty tryb okna (tylko Linux, wymaga ponownego uruchomienia)",
	"downloadingNecessaryFilesWait": "Proszę czekać, pobierane są wymagane pliki",
	"video": "Wideo",
	"audio": "Audio",
	"title": "Tytuł ",
	"selectFormat": "Wybierz format ",
	"download": "Pobierz",
	"selectDownloadLocation": "Wybierz lokalizację pobierania",
	"moreOptions": "Więcej opcji",
	"start": "Początek",
	"selectLanguageRelaunch": "Wybierz język (Wymaga ponownego uruchomienia)",
	"downloadTimeRange": "Pobierz określony czasowo wycinek",
	"end": "Koniec",
	"timeRangeStartEmptyHint": "Jeśli pole jest puste, zacznie od samego początku",
	"timeRangeEndEmptyHint": "Jeśli pole jest puste, pobierze do samego końca",
	"homepage": "Strona główna",
	"aboutAppDescription": "Jest to darmowa aplikacja z otwartym kodem źródłowym, zbudowana przy użyciu Node.js i Electron. yt-dlp jest używany do pobierania",
	"sourceCodeAvailable": "Kod źródłowy jest dostępny ",
	"here": "tutaj",
	"processing": "Przetwarzanie",
	"errorNetworkOrUrl": "Wystąpił błąd. Sprawdź swoje połączenie internetowe i skopiowany adres URL",
	"errorFailedFileDownload": "Pobieranie wymaganych plików nie powiodło się. Sprawdź swoje połączenie internetowe i spróbuj ponownie",
	"tryAgain": "Spróbuj ponownie",
	"unknownSize": "Nieznany rozmiar",
	"megabyte": "MB",
	"unknownQuality": "Nieznana jakość",
	"downloading": "Pobieranie...",
	"errorHoverForDetails": "Wystąpił błąd. Najedź kursorem by zobaczyć więcej informacji",
	"fileSavedSuccessfully": "Plik zapisany pomyślnie",
	"fileSavedClickToOpen": "Plik zapisany. Naciśnij żeby otworzyć",
	"preparing": "Przygotowywanie...",
	"progress": "Postęp",
	"speed": "Prędkość",
	"quality": "Jakość",
	"restartApp": "Zrestartuj aplikację",
	"subtitles": "Napisy",
	"downloadSubtitlesAvailable": "Pobierz napisy jeśli są dostępne",
	"downloadSubtitlesAuto": "Pobierz automatycznie wygenerowane napisy",
	"extractAudioFromVideo": "Wydobądź Audio z Wideo",
	"extract": "Wydobądź",
	"downloadingNecessaryFiles": "Pobieranie wymaganych plików",
	"qualityLow": "niska",
	"qualityMedium": "średnia",
	"appDescription": "ytDownloader pomaga pobierać wideo i audio z setek różnych stron takich jak YouTube, Instagram, TikTok, Twitter i tym podobnych",
	"pasteText": "Kliknij, aby wkleić link wideo ze schowka",
	"pastePlaylistLinkTooltip": "Kliknij, aby wkleić link playlisty ze schowka",
	"link": "Link:",
	"downloadingPlaylist": "Pobieranie playlisty:",
	"downloadPlaylistButton": "Pobierz playlistę",
	"playlistDownloaded": "Playlista pobrana",
	"cookiesWarning": "Ta opcja pozwala pobierać treści z ograniczonym dostępem. Otrzymasz błędy jeśli nie będzie tu plików cookies",
	"selectBrowserForCookies": "Wybierz przeglądarkę do używania cookies",
	"none": "Żadna",
	"updateAvailableDownloadPrompt": "Nowa wersja jest dostępna. Czy chcesz ją pobrać?",
	"updateAvailablePrompt": "Nowa wersja jest dostępna. Czy chcesz zaktualizować program?",
	"update": "Aktualizuj",
	"no": "Nie",
	"installAndRestartPrompt": "Zainstalować i zrestartować teraz?",
	"restart": "Zrestartuj",
	"later": "Później",
	"extractAudio": "Wydobądź Audio",
	"selectVideoFormat": "Wybierz format Wideo ",
	"selectAudioFormat": "Wybierz format Audio ",
	"maxActiveDownloads": "Maksymalna liczba aktywnych pobrań",
	"preferredVideoQuality": "Preferowana jakość wideo",
	"preferredAudioFormat": "Preferowany format audio",
	"best": "Najlepsza",
	"fileSaved": "Plik zapisany.",
	"openDownloadFolder": "Otwórz folder pobierania",
	"path": "Ścieżka:",
	"selectConfigFile": "Wybierz plik konfiguracyjny",
	"useConfigFile": "Użyj pliku konfiguracji",
	"playlistFilenameFormat": "Format nazwy pliku dla playlist",
	"playlistFolderNameFormat": "Format nazwy folderu dla list odtwarzania",
	"resetToDefault": "Przywróć domyślne",
	"playlistRange": "Zakres listy odtwarzania",
	"thumbnail": "Miniaturka",
	"linkAdded": "Link dodany",
	"downloadThumbnails": "Pobierz miniaturki",
	"saveVideoLinksToFile": "Zapisz odnośniki wideo do pliku",
	"closeAppToTray": "Zamknij aplikację do zasobnika systemowego",
	"useConfigFileCheckbox": "Użyj pliku konfiguracyjnego",
	"openApp": "Otwórz aplikację",
	"pasteVideoLink": "Wklej link wideo",
	"quit": "Wyjdź",
	"errorDetails": "Szczegóły błędu",
	"clickToCopy": "Kliknij aby skopiować",
	"copiedText": "Skopiowany tekst",
	"qualityNormal": "Normalny",
	"qualityGood": "Dobra",
	"qualityBad": "Zła",
	"qualityWorst": "Najgorsza",
	"selectQuality": "Wybierz jakość",
	"disableAutoUpdates": "Wyłącz automatyczne aktualizacje",
	"qualityUltraLow": "bardzo niska",
	"closeAppOnFinish": "Zamknij aplikację po zakończeniu pobierania",
	"auto": "Automatycznie",
	"theme": "Motyw",
	"themeLight": "Jasny",
	"themeDark": "Ciemny",
	"themeFrappe": "Frappé",
	"themeOneDark": "One Dark",
	"themeMatrix": "Matryca",
	"themeSolarizedDark": "Solarized ciemny",
	"preferredVideoCodec": "Preferowany kodek wideo",
	"showMoreFormatOptions": "Pokaż więcej opcji formatu",
	"flatsealPermissionWarning": "Aby z tego skorzystać, Musisz zezwolić aplikacji na dostęp do katalogu domowego. Możesz to zrobić za pomocą Flatseal, włączając uprawnienie z tekstem \"filesystem=home\"",
	"noAudio": "Bez dźwięku",
	"proxy": "Proxy",
	"clearDownloads": "Wyczyść pobrania",
	"compressor": "Kompresor",
	"dragAndDropFiles": "Przeciągnij i upuść plik(i)",
	"chooseFiles": "Wybierz plik(i)",
	"noFilesSelected": "Nie wybrano plików",
	"videoFormat": "Format wideo",
	"videoEncoder": "Koder wideo",
	"compressionSpeed": "Prędkość kompresji",
	"videoQuality": "Jakość wideo",
	"audioFormat": "Format audio",
	"outputSuffix": "Sufiks wyjściowy",
	"outputInSameFolder": "Wyjście w tym samym folderze",
	"selectCustomFolder": "Wybierz niestandardowy folder",
	"startCompression": "Rozpocznij kompresję",
	"cancel": "Anuluj",
	"errorClickForDetails": "Błąd! Kliknij, aby zobaczyć szczegóły",
	"homebrewYtDlpWarning": "Najpierw musisz pobrać yt-dlp z Homebrew",
	"openHomebrew": "Otwórz Homebrew",
	"downloadHistory": "Historia pobierania",
	"close": "Zamknij",
	"searchByTitleOrUrl": "Szukaj według tytułu lub URL...",
	"allFormats": "Wszystkie formaty",
	"exportAsJson": "Eksportuj jako JSON",
	"exportAsCsv": "Eksportuj jako CSV",
	"clearAllHistory": "Wyczyść całą historię",
	"noDownloadsYet": "Brak pobrań",
	"downloadHistoryPlaceholder": "Twoja historia pobierania pojawi się tutaj",
	"format": "Format",
	"size": "Rozmiar",
	"date": "Data",
	"duration": "Czas trwania",
	"copyUrl": "Kopiuj URL",
	"open": "Otwórz",
	"delete": "Usuń",
	"totalDownloads": "Wszystkie pobrania",
	"totalSize": "Całkowity rozmiar",
	"mostCommonFormat": "Najczęstszy format",
	"urlCopiedToClipboard": "URL skopiowany do schowka!",
	"confirmDeleteHistoryItem": "Czy na pewno chcesz usunąć ten element z historii?",
	"confirmClearAllHistory": "Czy na pewno chcesz wyczyścić całą historię pobierania? Tej operacji nie można cofnąć!",
	"fileDoesNotExist": "Plik już nie istnieje",
	"updatingYtdlp": "Aktualizacja yt-dlp",
	"updatedYtdlp": "Zaktualizowano yt-dlp",
	"ytDlpUpdateRequired": "Jeśli yt-dlp aktualizuje, poczekaj na zakończenie aktualizacji. Jeśli zainstalowałeś yt-dlp samodzielnie, zaktualizuj go.",
	"failedToDeleteHistoryItem": "Nie udało się usunąć elementu historii",
	"customArgsTxt": "Ustaw niestandardowe opcje yt-dlp.",
	"learnMore": "Dowiedz się więcej",
	"updateError": "Wystąpił błąd podczas procesu aktualizacji",
	"unableToAccessDir": "Program nie może uzyskać dostępu do tego folderu",
	"downloadingUpdate": "Pobieranie aktualizacji"
}
```

--------------------------------------------------------------------------------

---[FILE: translations/pt-BR.json]---
Location: ytDownloader-main/translations/pt-BR.json

```json
{
	"preferences": "Preferências",
	"about": "Sobre",
	"downloadLocation": "Local para salvar",
	"currentDownloadLocation": "Local para salvar atual - ",
	"enableTransparentDarkMode": "Habilitar modo escuro transparente (somente Linux, requer reinicialização)",
	"downloadingNecessaryFilesWait": "Por favor, aguarde, transferindo arquivos necessários",
	"video": "Vídeo",
	"audio": "Áudio",
	"title": "Título ",
	"selectFormat": "Selecionar um formato ",
	"download": "Baixar",
	"selectDownloadLocation": "Selecionar local para salvar",
	"moreOptions": "Mais opções",
	"start": "Início",
	"selectLanguageRelaunch": "Selecionar Idioma (Requer reinicialização)",
	"downloadTimeRange": "Baixar intervalo de tempo específico",
	"end": "Fim",
	"timeRangeStartEmptyHint": "Se não informado, começará do início",
	"timeRangeEndEmptyHint": "Se não informado, será baixado até o fim",
	"homepage": "Página inicial",
	"aboutAppDescription": "É um aplicativo gratuito e de código aberto construído usando Node.js e Electron. yt-dlp é usado para baixar os vídeos",
	"sourceCodeAvailable": "Código-fonte disponível ",
	"here": "aqui",
	"processing": "Processando",
	"errorNetworkOrUrl": "Ocorreu um erro. Verifique sua conexão e use a URL correta",
	"errorFailedFileDownload": "Erro ao baixar os arquivos necessários. Verifique sua conexão e tente novamente",
	"tryAgain": "Tentar novamente",
	"unknownSize": "Tamanho desconhecido",
	"megabyte": "MB",
	"unknownQuality": "Qualidade desconhecida",
	"downloading": "Baixando...",
	"errorHoverForDetails": "Ocorreu um erro. Passe o mouse para ver detalhes",
	"fileSavedSuccessfully": "Arquivo salvo com sucesso",
	"fileSavedClickToOpen": "Arquivo salvo. Clique para abrir",
	"preparing": "Preparando...",
	"progress": "Progresso",
	"speed": "Velocidade",
	"quality": "Qualidade",
	"restartApp": "Reiniciar aplicativo",
	"subtitles": "Legendas",
	"downloadSubtitlesAvailable": "Baixar legendas se disponíveis",
	"downloadSubtitlesAuto": "Baixar legendas geradas automaticamente",
	"extractAudioFromVideo": "Extrair áudio do vídeo",
	"extract": "Extrair",
	"downloadingNecessaryFiles": "Baixando arquivos necessários",
	"qualityLow": "baixa",
	"qualityMedium": "média",
	"appDescription": "ytDownloader permite baixar vídeos e áudios de centenas de sites como Youtube, Facebook, Instagram, Tiktok, Twitter e mais",
	"pasteText": "Clique para colar o link do vídeo da área de transferência",
	"pastePlaylistLinkTooltip": "Clique para colar o link da playlist da área de transferência",
	"link": "Link:",
	"downloadingPlaylist": "Baixando playlist:",
	"downloadPlaylistButton": "Baixar playlist",
	"playlistDownloaded": "Playlist baixada",
	"cookiesWarning": "Esta opção permite baixar conteúdo restrito. Ocorrerão erros se os cookies não estiverem disponíveis",
	"selectBrowserForCookies": "Selecionar navegador de onde usar os cookies",
	"none": "Nenhum",
	"updateAvailableDownloadPrompt": "Há uma nova versão disponível. Gostaria de baixá-la?",
	"updateAvailablePrompt": "Há uma nova versão disponível. Gostaria de atualizar?",
	"update": "Atualizar",
	"no": "Não",
	"installAndRestartPrompt": "Instalar e reiniciar agora?",
	"restart": "Reiniciar",
	"later": "Depois",
	"extractAudio": "Extrair Áudio",
	"selectVideoFormat": "Selecionar Formato de Vídeo ",
	"selectAudioFormat": "Selecionar formato de áudio ",
	"maxActiveDownloads": "Número máximo de downloads ativos",
	"preferredVideoQuality": "Qualidade preferencial de vídeo",
	"preferredAudioFormat": "Formato de áudio predileto",
	"best": "Melhor",
	"fileSaved": "Arquivo salvo",
	"openDownloadFolder": "Abrir pasta de download",
	"path": "Local:",
	"selectConfigFile": "Selecione arquivo de configuração",
	"useConfigFile": "Usar arquivo de configuração",
	"playlistFilenameFormat": "Formato do arquivo para playlists",
	"playlistFolderNameFormat": "Formato de pasta para playlists",
	"resetToDefault": "Restaurar para Padrão",
	"playlistRange": "Intervalo da playlist",
	"thumbnail": "Miniatura",
	"linkAdded": "Link adicionado",
	"downloadThumbnails": "Baixar miniaturas",
	"saveVideoLinksToFile": "Salvar links para um arquivo",
	"closeAppToTray": "Fechar aplicativo na bandeja do sistema",
	"useConfigFileCheckbox": "Utilizar arquivo de configuração",
	"openApp": "Abrir app",
	"pasteVideoLink": "Colar link do vídeo",
	"quit": "Sair",
	"errorDetails": "Detalhes do erro",
	"clickToCopy": "Clique para copiar",
	"copiedText": "Texto copiado",
	"qualityNormal": "Standard",
	"qualityGood": "Boa",
	"qualityBad": "Ruim",
	"qualityWorst": "Pior",
	"selectQuality": "Escolha a qualidade",
	"disableAutoUpdates": "Desativar atualizações automáticas",
	"qualityUltraLow": "ultra Baixo",
	"closeAppOnFinish": "Fechar aplicativo quando o download terminar",
	"auto": "Automático",
	"theme": "Tema",
	"themeLight": "Luz",
	"themeDark": "Escuro",
	"themeFrappe": "Frappé",
	"themeOneDark": "Um Escuro",
	"themeMatrix": "Matriz",
	"themeSolarizedDark": "Escuro Solarizado",
	"preferredVideoCodec": "Codec de vídeo preferido",
	"showMoreFormatOptions": "Mostrar mais opções de formato",
	"flatsealPermissionWarning": "Você precisa dar permissão ao aplicativo para acessar o diretório inicial para usar isso. Você pode fazer isso com Flatseal ativando a permissão com o texto 'filesystem=home'",
	"noAudio": "Sem áudio",
	"proxy": "Proxy",
	"clearDownloads": "Limpar transferências",
	"compressor": "Compressor",
	"dragAndDropFiles": "Arraste e solte o(s) arquivo(s)",
	"chooseFiles": "Escolher arquivo(s)",
	"noFilesSelected": "Nenhum arquivo selecionado",
	"videoFormat": "Formato de vídeo",
	"videoEncoder": "Codificador de vídeo",
	"compressionSpeed": "Velocidade de compressão",
	"videoQuality": "Qualidade de vídeo",
	"audioFormat": "Formato de áudio",
	"outputSuffix": "Sufixo de saída",
	"outputInSameFolder": "Salvar na mesma pasta",
	"selectCustomFolder": "Selecionar pasta personalizada",
	"startCompression": "Iniciar compressão",
	"cancel": "Cancelar",
	"errorClickForDetails": "Erro! Clique para detalhes",
	"homebrewYtDlpWarning": "Você precisa baixar o yt-dlp pelo Homebrew primeiro",
	"openHomebrew": "Abrir Homebrew",
	"downloadHistory": "Histórico de Downloads",
	"close": "Fechar",
	"searchByTitleOrUrl": "Buscar por título ou URL...",
	"allFormats": "Todos os formatos",
	"exportAsJson": "Exportar como JSON",
	"exportAsCsv": "Exportar como CSV",
	"clearAllHistory": "Limpar todo o histórico",
	"noDownloadsYet": "Nenhum download ainda",
	"downloadHistoryPlaceholder": "Seu histórico de downloads aparecerá aqui",
	"format": "Formato",
	"size": "Tamanho",
	"date": "Data",
	"duration": "Duração",
	"copyUrl": "Copiar URL",
	"open": "Abrir",
	"delete": "Excluir",
	"totalDownloads": "Total de Downloads",
	"totalSize": "Tamanho Total",
	"mostCommonFormat": "Formato Mais Comum",
	"urlCopiedToClipboard": "URL copiada para a área de transferência!",
	"confirmDeleteHistoryItem": "Tem certeza de que deseja excluir este item do histórico?",
	"confirmClearAllHistory": "Tem certeza de que deseja limpar todo o histórico de downloads? Esta ação não pode ser desfeita!",
	"fileDoesNotExist": "Arquivo não existe mais",
	"updatingYtdlp": "Atualizando yt-dlp",
	"updatedYtdlp": "yt-dlp atualizado",
	"ytDlpUpdateRequired": "Se o yt-dlp estiver atualizando, espere que a atualização termine. Se você tiver instalado o yt-dlp, por favor, atualize-o.",
	"failedToDeleteHistoryItem": "Falha ao excluir item do histórico",
	"customArgsTxt": "Defina opções yt-dlp personalizadas.",
	"learnMore": "Saiba mais",
	"updateError": "Ocorreu um erro durante o processo de atualização",
	"unableToAccessDir": "O programa não pode acessar essa pasta",
	"downloadingUpdate": "Baixando atualização"
}
```

--------------------------------------------------------------------------------

---[FILE: translations/ru-RU.json]---
Location: ytDownloader-main/translations/ru-RU.json

```json
{
	"preferences": "Настройки",
	"about": "О программе",
	"downloadLocation": "Папка загрузки",
	"currentDownloadLocation": "Текущая папка загрузки: ",
	"enableTransparentDarkMode": "Включить прозрачный тёмный режим (только Linux, требуется перезапуск)",
	"downloadingNecessaryFilesWait": "Пожалуйста, подождите, загружаются необходимые файлы",
	"video": "Видео",
	"audio": "Аудио",
	"title": "Название",
	"selectFormat": "Выберите формат",
	"download": "Скачать",
	"selectDownloadLocation": "Выберите папку для загрузки",
	"moreOptions": "Дополнительные опции",
	"start": "Начало",
	"selectLanguageRelaunch": "Выберите язык (требуется перезапуск)",
	"downloadTimeRange": "Скачать определённый фрагмент",
	"end": "Конец",
	"timeRangeStartEmptyHint": "Если оставить пустым, начнётся с начала",
	"timeRangeEndEmptyHint": "Если оставить пустым, скачается до конца",
	"homepage": "Главная страница",
	"aboutAppDescription": "Это бесплатное приложение с открытым исходным кодом, созданное на основе Node.js и Electron. Для загрузки используется yt-dlp",
	"sourceCodeAvailable": "Исходный код доступен",
	"here": "здесь",
	"processing": "Обработка",
	"errorNetworkOrUrl": "Произошла ошибка. Проверьте подключение к сети и убедитесь, что URL указан верно",
	"errorFailedFileDownload": "Не удалось загрузить необходимые файлы. Проверьте подключение к сети и повторите попытку",
	"tryAgain": "Повторить попытку",
	"unknownSize": "Размер неизвестен",
	"megabyte": "МБ",
	"unknownQuality": "Неизвестное качество",
	"downloading": "Скачивание...",
	"errorHoverForDetails": "Произошла ошибка. Для просмотра подробностей наведите курсор",
	"fileSavedSuccessfully": "Файл успешно сохранён",
	"fileSavedClickToOpen": "Файл сохранён. Нажмите, чтобы открыть",
	"preparing": "Подготовка...",
	"progress": "Прогресс",
	"speed": "Скорость",
	"quality": "Качество",
	"restartApp": "Перезапустить приложение",
	"subtitles": "Субтитры",
	"downloadSubtitlesAvailable": "Скачать субтитры, если доступны",
	"downloadSubtitlesAuto": "Скачать автоматически созданные субтитры",
	"extractAudioFromVideo": "Извлечь аудио из видео",
	"extract": "Извлечь",
	"downloadingNecessaryFiles": "Загрузка необходимых файлов",
	"qualityLow": "Низкое",
	"qualityMedium": "Среднее",
	"appDescription": "ytDownloader позволяет скачивать видео и аудио с сотен сайтов, таких как YouTube, Facebook, Instagram, TikTok, Twitter и других",
	"pasteText": "Нажмите, чтобы вставить ссылку на видео из буфера обмена",
	"pastePlaylistLinkTooltip": "Нажмите, чтобы вставить ссылку на плейлист из буфера обмена",
	"link": "Ссылка:",
	"downloadingPlaylist": "Скачивание плейлиста:",
	"downloadPlaylistButton": "Скачать плейлист",
	"playlistDownloaded": "Плейлист загружен",
	"cookiesWarning": "Эта опция позволяет загружать ограниченный контент. Если файлы cookie отсутствуют, могут возникать ошибки",
	"selectBrowserForCookies": "Выберите браузер для использования файлов cookie",
	"none": "Нет",
	"updateAvailableDownloadPrompt": "Доступна новая версия. Скачать сейчас?",
	"updateAvailablePrompt": "Доступна новая версия. Хотите обновиться?",
	"update": "Обновить",
	"no": "Нет",
	"installAndRestartPrompt": "Установить и перезапустить сейчас?",
	"restart": "Перезапустить",
	"later": "Позже",
	"extractAudio": "Извлечь аудио",
	"selectVideoFormat": "Выберите формат видео",
	"selectAudioFormat": "Выберите формат аудио",
	"maxActiveDownloads": "Максимальное количество одновременных загрузок",
	"preferredVideoQuality": "Предпочитаемое качество видео",
	"preferredAudioFormat": "Предпочитаемый аудиоформат",
	"best": "Лучшее",
	"fileSaved": "Файл сохранён",
	"openDownloadFolder": "Открыть папку загрузок",
	"path": "Путь:",
	"selectConfigFile": "Выбрать файл конфигурации",
	"useConfigFile": "Использовать файл конфигурации",
	"playlistFilenameFormat": "Формат имён файлов для плейлистов",
	"playlistFolderNameFormat": "Формат имён папок для плейлистов",
	"resetToDefault": "Сбросить настройки по умолчанию",
	"playlistRange": "Диапазон плейлиста",
	"thumbnail": "Миниатюра",
	"linkAdded": "Ссылка добавлена",
	"downloadThumbnails": "Скачать миниатюры",
	"saveVideoLinksToFile": "Сохранить ссылки на видео в файл",
	"closeAppToTray": "Свернуть приложение в системный трей",
	"useConfigFileCheckbox": "Использовать файл конфигурации",
	"openApp": "Открыть приложение",
	"pasteVideoLink": "Вставить ссылку на видео",
	"quit": "Закрыть",
	"errorDetails": "Подробности ошибки",
	"clickToCopy": "Нажмите, чтобы скопировать",
	"copiedText": "Текст скопирован",
	"qualityNormal": "Обычное",
	"qualityGood": "Хорошее",
	"qualityBad": "Плохое",
	"qualityWorst": "Худшее",
	"selectQuality": "Выберите качество",
	"disableAutoUpdates": "Отключить автоматические обновления",
	"qualityUltraLow": "Сверхнизкое",
	"closeAppOnFinish": "Закрыть приложение после завершения загрузки",
	"auto": "Авто",
	"theme": "Тема",
	"themeLight": "Светлая",
	"themeDark": "Тёмная",
	"themeFrappe": "Фраппе",
	"themeOneDark": "One Dark",
	"themeMatrix": "Матрица",
	"themeSolarizedDark": "Solarized Dark",
	"preferredVideoCodec": "Предпочтительный видеокодек",
	"showMoreFormatOptions": "Показать больше опций формата",
	"flatsealPermissionWarning": "Чтобы использовать эту функцию, нужно предоставить приложению доступ к домашнему каталогу. Это можно сделать в Flatseal, включив разрешение с параметром 'filesystem=home'",
	"noAudio": "Без аудио",
	"proxy": "Прокси",
	"clearDownloads": "Очистить загрузки",
	"compressor": "Компрессор",
	"dragAndDropFiles": "Перетащите файл(ы)",
	"chooseFiles": "Выбрать файл(ы)",
	"noFilesSelected": "Файлы не выбраны",
	"videoFormat": "Формат видео",
	"videoEncoder": "Видеокодек",
	"compressionSpeed": "Скорость сжатия",
	"videoQuality": "Качество видео",
	"audioFormat": "Формат аудиофайла",
	"outputSuffix": "Суффикс выходного файла",
	"outputInSameFolder": "Сохранять в ту же папку",
	"selectCustomFolder": "Выбрать папку",
	"startCompression": "Начать сжатие",
	"cancel": "Отмена",
	"errorClickForDetails": "Ошибка! Нажмите для подробностей",
	"homebrewYtDlpWarning": "Сначала необходимо установить yt-dlp через Homebrew",
	"openHomebrew": "Открыть Homebrew",
	"downloadHistory": "История загрузок",
	"close": "Закрыть",
	"searchByTitleOrUrl": "Поиск по названию или URL...",
	"allFormats": "Все форматы",
	"exportAsJson": "Экспортировать в JSON",
	"exportAsCsv": "Экспортировать в CSV",
	"clearAllHistory": "Очистить всю историю",
	"noDownloadsYet": "Загрузок пока нет",
	"downloadHistoryPlaceholder": "Здесь появится история загрузок",
	"format": "Формат",
	"size": "Размер",
	"date": "Дата",
	"duration": "Длительность",
	"copyUrl": "Копировать ссылку",
	"open": "Открыть",
	"delete": "Удалить",
	"totalDownloads": "Всего загрузок",
	"totalSize": "Общий размер",
	"mostCommonFormat": "Наиболее частый формат",
	"urlCopiedToClipboard": "URL скопирован в буфер обмена!",
	"confirmDeleteHistoryItem": "Вы уверены, что хотите удалить этот элемент из истории?",
	"confirmClearAllHistory": "Вы уверены, что хотите удалить всю историю загрузок? Это действие необратимо!",
	"fileDoesNotExist": "Файл больше не существует",
	"updatingYtdlp": "Обновление yt-dlp",
	"updatedYtdlp": "yt-dlp обновлён",
	"ytDlpUpdateRequired": "Если yt-dlp обновляется, дождитесь завершения. Если вы установили yt-dlp самостоятельно, обновите его.",
	"failedToDeleteHistoryItem": "Не удалось удалить элемент истории",
	"customArgsTxt": "Задать параметры yt-dlp.",
	"learnMore": "Подробнее",
	"updateError": "Во время обновления произошла ошибка",
	"unableToAccessDir": "Нет доступа к папке",
	"downloadingUpdate": "Загрузка обновления"
}
```

--------------------------------------------------------------------------------

---[FILE: translations/tr-TR.json]---
Location: ytDownloader-main/translations/tr-TR.json

```json
{
	"preferences": "Ayarlar",
	"about": "Hakkında",
	"downloadLocation": "İndirme dizini",
	"currentDownloadLocation": "Mevcut indirme dizini - ",
	"enableTransparentDarkMode": "Koyu tema için saydamlığı aktif edin (sadece Linux için, yeniden başlatma gerekir)",
	"downloadingNecessaryFilesWait": "Lütfen bekleyin, dosyalar indiriliyor",
	"video": "Video",
	"audio": "Ses",
	"title": "Başlık ",
	"selectFormat": "Format seçin ",
	"download": "İndir",
	"selectDownloadLocation": "İndirme dizinini seç",
	"moreOptions": "Daha fazla ayar",
	"start": "Başlangıç",
	"selectLanguageRelaunch": "Dil seçin (Yeniden başlatma gerekir)",
	"downloadTimeRange": "Belirli bir zaman aralığını indir",
	"end": "Bitiş",
	"timeRangeStartEmptyHint": "Eğer boş bırakılırsa, başlangıçtan başlayacaktır",
	"timeRangeEndEmptyHint": "Eğer boş bırakılırsa, sonuna kadar inecektir",
	"homepage": "Ana sayfa",
	"aboutAppDescription": "Node.js ve Electron ile yapılmış ücretsiz ve açık kaynak bir uygulamadır. yt-dlp indirme işlemi için kullanılır",
	"sourceCodeAvailable": "Kaynak kodu mevcuttur ",
	"here": "burada",
	"processing": "İşleniyor",
	"errorNetworkOrUrl": "Hata oluştu. İnternetinizi kontrol edin ve doğru bir bağlantı kullanın",
	"errorFailedFileDownload": "Dosyalar indirilemedi. Lütfen internetinizi kontrol edin ve tekrar deneyin",
	"tryAgain": "Tekrar deneyin",
	"unknownSize": "Bilinmeyen boyut",
	"megabyte": "MB",
	"unknownQuality": "Bilinmeyen kalite",
	"downloading": "İndiriliyor...",
	"errorHoverForDetails": "Hata oluştu. Detayları görmek için üzerine gelin",
	"fileSavedSuccessfully": "Dosya başarıyla kaydedildi",
	"fileSavedClickToOpen": "Dosya kaydedildi. Açmak için tıklayın",
	"preparing": "Hazırlanıyor...",
	"progress": "Süreç",
	"speed": "Hız",
	"quality": "Kalite",
	"restartApp": "Uygulamayı yeniden başlat",
	"subtitles": "Altyazılar",
	"downloadSubtitlesAvailable": "Altyazılar mevcut ise indir",
	"downloadSubtitlesAuto": "Otomatik oluşturulan altyazıyı indir",
	"extractAudioFromVideo": "Videodan sesi çıkart",
	"extract": "Çıkart",
	"downloadingNecessaryFiles": "Dosyalar indiriliyor",
	"qualityLow": "düşük",
	"qualityMedium": "orta",
	"appDescription": "ytDownloader ile Youtube, Facebook, Instagram, Tiktok ve Twitter gibi yüzlerce siteden videolar ve sesler indirebilirsiniz",
	"pasteText": "Klip tahtasından video bağlantısını yapıştırmak için tıklayın",
	"pastePlaylistLinkTooltip": "Klip tahtasından oynatma listesi bağlantısını yapıştırmak için tıklayın",
	"link": "Link:",
	"downloadingPlaylist": "İndirilen oynatma listesi:",
	"downloadPlaylistButton": "Oynatma listesini indir",
	"playlistDownloaded": "Oynatma listesi indirildi",
	"cookiesWarning": "Bu seçenek kısıtlı içeriği indirmenize olanak sağlar. Çerezler bulunmuyorsa hata alırsınız",
	"selectBrowserForCookies": "Çerezlerin kullanılacağı tarayıcıyı seçin",
	"none": "Hiçbiri",
	"updateAvailableDownloadPrompt": "Yeni bir versiyon mevcut, indirmek ister misiniz?",
	"updateAvailablePrompt": "Yeni bir versiyon mevcut, güncellemek ister misiniz?",
	"update": "Güncelleme",
	"no": "Hayır",
	"installAndRestartPrompt": "Yüklendikten sonra yeniden başlatılsın mı?",
	"restart": "Yeniden başlat",
	"later": "Daha sonra",
	"extractAudio": "Sesi çıkart",
	"selectVideoFormat": "Video Formatını Seçin ",
	"selectAudioFormat": "Ses Formatını Seçin ",
	"maxActiveDownloads": "Maksimum aktif indirme sayısı",
	"preferredVideoQuality": "Tercih edilen video kalitesi",
	"preferredAudioFormat": "Tercih edilen ses formatı",
	"best": "En iyi",
	"fileSaved": "Dosya kaydedildi",
	"openDownloadFolder": "İndirme klasörünü açın",
	"path": "Dizin:",
	"selectConfigFile": "Konfigürasyon dosyasını seç",
	"useConfigFile": "Konfigürasyon dosyasını kullan",
	"playlistFilenameFormat": "Oynatma listesi için dosya adı",
	"playlistFolderNameFormat": "Oynatma listesi için klasör ismi",
	"resetToDefault": "Varsayılana sıfırla",
	"playlistRange": "Oynatma listesi aralığı",
	"thumbnail": "Küçük resim",
	"linkAdded": "Bağlantı eklendi",
	"downloadThumbnails": "Küçük Resimleri İndir",
	"saveVideoLinksToFile": "Video bağlantılarını bir dosyaya kaydet",
	"closeAppToTray": "Sistem tepsisine kapat",
	"useConfigFileCheckbox": "Konfigürasyon dosyası kullan",
	"openApp": "Uygulamayı aç",
	"pasteVideoLink": "Video bağlantısını yapıştırın",
	"quit": "Çıkış",
	"errorDetails": "Hata Ayrıntıları",
	"clickToCopy": "Kopyalamak için tıkla",
	"copiedText": "Kopyalanan metin",
	"qualityNormal": "Normal",
	"qualityGood": "İyi",
	"qualityBad": "Kötü",
	"qualityWorst": "En kötü",
	"selectQuality": "Kalite Seç",
	"disableAutoUpdates": "Otomatik güncellemeleri devre dışı bırak",
	"qualityUltraLow": "Çok düşük",
	"closeAppOnFinish": "İndirme bittiğinde uygulamayı kapat",
	"auto": "Otomatik",
	"theme": "Tema",
	"themeLight": "Açık",
	"themeDark": "Karanlık",
	"themeFrappe": "Frappé",
	"themeOneDark": "One Dark",
	"themeMatrix": "Matris",
	"themeSolarizedDark": "Solarized koyu",
	"preferredVideoCodec": "Tercih edilen video kodeği",
	"showMoreFormatOptions": "Daha fazla format ayarı göster",
	"flatsealPermissionWarning": "Bunu kullanmak için uygulamaya ev dizininize erişme izni vermeniz gerekiyor. Flatseal kullanarak bunu yapabilirsiniz: 'filesystem=home' parametresini kullanın",
	"noAudio": "Ses Yok",
	"proxy": "Proxy",
	"clearDownloads": "İndirilenleri temizle",
	"compressor": "Sıkıştırıcı",
	"dragAndDropFiles": "Dosya(ları) sürükleyip bırak",
	"chooseFiles": "Dosya(ları) Seç",
	"noFilesSelected": "Hiçbir dosya seçilmedi",
	"videoFormat": "Video formatı",
	"videoEncoder": "Video Kodlayıcı",
	"compressionSpeed": "Sıkıştırma Hızı",
	"videoQuality": "Video Kalitesi",
	"audioFormat": "Ses Formatı",
	"outputSuffix": "Çıktı soneki",
	"outputInSameFolder": "Aynı klasörde çıktı",
	"selectCustomFolder": "Özel klasör seç",
	"startCompression": "Sıkıştırmayı Başlat",
	"cancel": "İptal",
	"errorClickForDetails": "Hata! Ayrıntılar için tıklayın",
	"homebrewYtDlpWarning": "Öncelikle Homebrew üzerinden yt-dlp uygulamasını indirmeniz gerekiyor",
	"openHomebrew": "Homebrew'u Aç",
	"downloadHistory": "İndirme Geçmişi",
	"close": "Kapat",
	"searchByTitleOrUrl": "Başlığa veya URL'ye göre ara...",
	"allFormats": "Tüm Formatlar",
	"exportAsJson": "JSON olarak dışa aktar",
	"exportAsCsv": "CSV olarak dışa aktar",
	"clearAllHistory": "Tüm Geçmişi Temizle",
	"noDownloadsYet": "Henüz İndirme Yok",
	"downloadHistoryPlaceholder": "İndirme geçmişiniz burada görünecek",
	"format": "Format",
	"size": "Boyut",
	"date": "Tarih",
	"duration": "Süre",
	"copyUrl": "URL'yi Kopyala",
	"open": "Aç",
	"delete": "Sil",
	"totalDownloads": "Toplam İndirme",
	"totalSize": "Toplam Boyut",
	"mostCommonFormat": "En Yaygın Format",
	"urlCopiedToClipboard": "URL panoya kopyalandı!",
	"confirmDeleteHistoryItem": "Bu öğeyi geçmişten silmek istediğinizden emin misiniz?",
	"confirmClearAllHistory": "Tüm indirme geçmişini temizlemek istediğinizden emin misiniz? Bu işlem geri alınamaz!",
	"fileDoesNotExist": "File does not exist anymore",
	"updatingYtdlp": "Updating yt-dlp",
	"updatedYtdlp": "Updated yt-dlp",
	"ytDlpUpdateRequired": "If yt-dlp is updating, wait for the update to finish. If you have installed yt-dlp by yourself, please update it.",
	"failedToDeleteHistoryItem": "Failed to delete history item",
	"customArgsTxt": "Set custom yt-dlp options.",
	"learnMore": "Learn more",
	"updateError": "An error occurred during the update process",
	"unableToAccessDir": "The program cannot access that folder",
	"downloadingUpdate": "Downloading update"
}
```

--------------------------------------------------------------------------------

````
