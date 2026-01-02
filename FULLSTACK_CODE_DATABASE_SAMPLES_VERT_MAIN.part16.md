---
source_txt: fullstack_samples/VERT-main
converted_utc: 2025-12-18T11:26:37Z
part: 16
parts_total: 18
---

# FULLSTACK CODE DATABASE SAMPLES VERT-main

## Verbatim Content (Part 16 of 18)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - VERT-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/VERT-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: vertdSettings.svelte.ts]---
Location: VERT-main/src/lib/sections/settings/vertdSettings.svelte.ts

```typescript
import { ip, type IpInfo } from "$lib/util/ip";
import { Settings } from "./index.svelte";
import { PUB_VERTD_URL } from "$env/static/public";

const LOCATIONS = [
	{
		latitude: 49.0976,
		longitude: 12.4869,
		url: "https://eu.vertd.vert.sh",
	},
	{
		latitude: 47.6587,
		longitude: -117.426,
		url: "https://usa.vertd.vert.sh",
	},
];

const toRad = (value: number) => (value * Math.PI) / 180;
const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
	const R = 6371; // km
	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRad(lat1)) *
			Math.cos(toRad(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c;
	return d;
};

export type VertdInner =
	| { type: "auto" }
	| { type: "eu" }
	| { type: "us" }
	| { type: "custom" };

export class VertdInstance {
	public static instance = new VertdInstance();

	private cachedIp = $state<IpInfo | null>(null);

	private inner = $state<VertdInner>({
		type: "auto",
	});

	public save() {
		localStorage.setItem("vertdInstance", JSON.stringify(this.inner));
	}

	public load() {
		const ls = localStorage.getItem("vertdInstance");

		// if custom vertd url and no saved setting, default to the custom url
		if (!ls) {
			const isCustomUrl =
				PUB_VERTD_URL && PUB_VERTD_URL !== "https://vertd.vert.sh";
			if (isCustomUrl) {
				this.inner = { type: "custom" };
				return;
			}
		}

		if (!ls) return;
		const inner: VertdInner = JSON.parse(ls);
		this.inner = {
			...this.inner,
			...inner,
		};
	}

	public innerData() {
		return this.inner;
	}

	public set(inner: VertdInner) {
		this.inner = inner;
		this.save();
	}

	public async url() {
		const reachable = async (url: string) => {
			try {
				const res = await fetch(url + "/api/version", {
					method: "GET",
					cache: "no-store",
				});
				return res.ok;
			} catch {
				return false;
			}
		};

		switch (this.inner.type) {
			case "auto": {
				if (!this.cachedIp) this.cachedIp = await ip();
				const ipInfo = this.cachedIp;
				const primary = this.geographicallyOptimalInstance(ipInfo);

				// try primary (closest) first
				if (await reachable(primary)) return primary;

				// fall back to other locations
				for (const location of LOCATIONS) {
					if (location.url === primary) continue;
					if (await reachable(location.url)) return location.url;
				}

				// if none are reachable, fall back to custom
				return Settings.instance.settings.vertdURL;
			}

			case "eu": {
				return "https://eu.vertd.vert.sh";
			}

			case "us": {
				return "https://usa.vertd.vert.sh";
			}

			case "custom": {
				return Settings.instance.settings.vertdURL;
			}
		}
	}

	private geographicallyOptimalInstance(ip: IpInfo) {
		let bestLocation = LOCATIONS[0];
		let bestDistance = haversine(
			ip.latitude,
			ip.longitude,
			bestLocation.latitude,
			bestLocation.longitude,
		);

		for (let i = 1; i < LOCATIONS.length; i++) {
			const location = LOCATIONS[i];
			const distance = haversine(
				ip.latitude,
				ip.longitude,
				location.latitude,
				location.longitude,
			);
			if (distance < bestDistance) {
				bestDistance = distance;
				bestLocation = location;
			}
		}

		return bestLocation.url;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: DialogProvider.ts]---
Location: VERT-main/src/lib/store/DialogProvider.ts

```typescript
import type { Component } from "svelte";
import { writable } from "svelte/store";

type DialogType = "success" | "error" | "info" | "warning";

type BaseDialog = {
	id: number;
	title: string;
	buttons: {
		text: string;
		action: () => void;
	}[];
	type: DialogType;
};

export type StringDialog = BaseDialog & {
	message: string;
};

export type ComponentDialog<T = unknown> = BaseDialog & {
	message: Component<DialogProps<T>>;
	additional: T;
};

export type Dialog<T = unknown> = StringDialog | ComponentDialog<T>;

export type DialogProps<T = unknown> = {
	id: number;
	title: string;
	type: DialogType;
	buttons: {
		text: string;
		action: () => void;
	}[];
	additional: T;
};

const dialogs = writable<Dialog[]>([]);

let dialogId = 0;

function addDialog(
	title: string,
	message: string | Component<DialogProps>,
	buttons: BaseDialog["buttons"],
	type: DialogType,
	additional?: unknown,
): number {
	const id = dialogId++;

	if (typeof message === "string") {
		const newDialog: StringDialog = {
			id,
			title,
			message,
			buttons,
			type,
		};
		dialogs.update((currentDialogs) => [...currentDialogs, newDialog]);
	} else {
		const newDialog: ComponentDialog = {
			id,
			title,
			message,
			buttons,
			type,
			additional,
		};
		dialogs.update((currentDialogs) => [...currentDialogs, newDialog]);
	}

	return id;
}

function removeDialog(id: number) {
	dialogs.update((currentDialogs) =>
		currentDialogs.filter((dialog) => dialog.id !== id),
	);
}

export { dialogs, addDialog, removeDialog };
```

--------------------------------------------------------------------------------

---[FILE: index.svelte.ts]---
Location: VERT-main/src/lib/store/index.svelte.ts

```typescript
import { browser } from "$app/environment";
import { byNative, converters } from "$lib/converters";
import { error, log } from "$lib/util/logger";
import { VertFile } from "$lib/types";
import { parseBlob, selectCover } from "music-metadata";
import { writable } from "svelte/store";
import { addDialog } from "./DialogProvider";
import PQueue from "p-queue";
import { getLocale, setLocale } from "$lib/paraglide/runtime";
import { m } from "$lib/paraglide/messages";
import sanitizeHtml from "sanitize-html";
import { ToastManager } from "$lib/util/toast.svelte";
import { GB } from "$lib/util/consts";

class Files {
	public files = $state<VertFile[]>([]);

	public requiredConverters = $derived(
		Array.from(new Set(files.files.map((f) => f.converters).flat())),
	);

	public ready = $derived(
		this.files.length === 0
			? false
			: this.requiredConverters.every((f) => f?.status === "ready") &&
					this.files.every((f) => !f.processing),
	);
	public results = $derived(
		this.files.length === 0 ? false : this.files.every((f) => f.result),
	);

	private thumbnailQueue = new PQueue({
		concurrency: browser ? navigator.hardwareConcurrency || 4 : 4,
	});

	private _addThumbnail = async (file: VertFile) => {
		this.thumbnailQueue.add(async () => {
			const isAudio = converters
				.find((c) => c.name === "ffmpeg")
				?.supportedFormats.filter((f) => f.isNative)
				.map((f) => f.name)
				?.includes(file.from.toLowerCase());
			const isVideo = converters
				.find((c) => c.name === "vertd")
				?.supportedFormats.filter((f) => f.isNative)
				.map((f) => f.name)
				?.includes(file.from.toLowerCase());

			try {
				if (isAudio) {
					// try to get the thumbnail from the audio via music-metadata
					const { common } = await parseBlob(file.file, {
						skipPostHeaders: true,
					});
					const cover = selectCover(common.picture);
					if (cover) {
						const arrayBuffer =
							cover.data.buffer instanceof ArrayBuffer
								? cover.data.buffer
								: new Uint8Array(cover.data).buffer;
						const blob = new Blob([new Uint8Array(arrayBuffer)], {
							type: cover.format,
						});
						file.blobUrl = URL.createObjectURL(blob);
					}
				} else if (isVideo) {
					// video
					file.blobUrl = await this._generateThumbnailFromMedia(
						file.file,
						true,
					);
				} else {
					// image
					file.blobUrl = await this._generateThumbnailFromMedia(
						file.file,
						false,
					);
				}
			} catch (e) {
				error(["files"], e);
			}
		});
	};

	private async _generateThumbnailFromMedia(
		file: File,
		isVideo: boolean,
	): Promise<string | undefined> {
		const maxSize = 180;
		const mediaElement = isVideo
			? document.createElement("video")
			: new Image();
		mediaElement.src = URL.createObjectURL(file);

		await new Promise((resolve, reject) => {
			if (isVideo) {
				const video = mediaElement as HTMLVideoElement;
				// seek to 10% of video time or 2 seconds in
				video.onloadeddata = () => {
					const seekTime = Math.min(video.duration * 0.1, 2);
					video.currentTime = seekTime;
				};
				video.onseeked = resolve;
				video.onerror = reject;
			} else {
				(mediaElement as HTMLImageElement).onload = resolve;
				(mediaElement as HTMLImageElement).onerror = reject;
			}
		});

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		if (!ctx) return undefined;

		const width = isVideo
			? (mediaElement as HTMLVideoElement).videoWidth
			: (mediaElement as HTMLImageElement).width;
		const height = isVideo
			? (mediaElement as HTMLVideoElement).videoHeight
			: (mediaElement as HTMLImageElement).height;

		const scale = Math.max(maxSize / width, maxSize / height);
		canvas.width = width * scale;
		canvas.height = height * scale;
		ctx.drawImage(mediaElement, 0, 0, canvas.width, canvas.height);

		// check if completely transparent
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const isTransparent = Array.from(imageData.data).every((value, index) => {
			return (index + 1) % 4 !== 0 || value === 0;
		});
		if (isTransparent) {
			canvas.remove();
			return undefined;
		}

		const url = canvas.toDataURL();
		canvas.remove();
		return url;
	}

	private async _handleZipFile(file: File): Promise<void> {
		try {
			log(["files"], `extracting zip file: ${file.name}`);
			ToastManager.add({
				type: "info",
				message: m["convert.archive_file.extracting"]({
					filename: file.name,
				}),
			});

			const { extractZip } = await import("$lib/util/zip");
			const entries = await extractZip(file);

			const totalEntries = entries.length;
			log(["files"], `extracted ${totalEntries} files from zip`);

			// check if all files in zip use the same converter and are compatible
			const convertersUsed = new Set<string>();
			let incompatibleFiles = false;

			for (const { filename } of entries) {
				const format = "." + filename.split(".").pop()?.toLowerCase();
				if (!format || format === ".zip") {
					incompatibleFiles = true;
					continue;
				}

				const converter = converters
					.sort(byNative(format))
					.find((c) => c.formatStrings().includes(format));

				if (converter) convertersUsed.add(converter.name);
				else incompatibleFiles = true;
			}

			const converterCount = convertersUsed.size;
			const canConvertAsOne = converterCount === 1 && !incompatibleFiles;

			log(
				["files"],
				`extracted ${entries.length} files from zip (converters: ${converterCount}, compatible: ${canConvertAsOne})`,
			);

			if (canConvertAsOne) {
				// all files use same converter - add zip as a single VertFile file
				const vf = new VertFile(file, ".zip");
				vf.converters = converters.filter(
					(c) => c.name === Array.from(convertersUsed)[0],
				);

				const converterName = vf.converters[0].name;
				const type =
					converterName === "imagemagick"
						? "image"
						: converterName === "ffmpeg"
							? "audio"
							: converterName === "pandoc"
								? "doc"
								: "video";

				this.files.push(vf);
				this._addThumbnail(vf);

				ToastManager.add({
					type: "success",
					message: m["convert.archive_file.detected"]({
						type: m[`convert.archive_file.${type}`](),
						filename: file.name,
					}),
				});
			} else {
				// mixed converters/incompatible files - extract all individually
				for (const { filename, data } of entries) {
					this._add(
						new File([new Uint8Array(data)], filename, {
							type: "application/octet-stream",
						}),
					);
				}

				ToastManager.add({
					type: "success",
					message: m["convert.archive_file.extracted"]({
						filename: file.name,
						extract_count: entries.length,
						ignore_count: 0,
					}),
				});
			}
		} catch (e) {
			error(["files"], `error processing zip file: ${e}`);
			throw e;
		}
	}

	private _warningShown = false;
	private async _add(file: VertFile | File) {
		if (file instanceof VertFile) {
			this.files.push(file);
			this._addThumbnail(file);
		} else {
			// if zip, extract and add contents
			const isZip =
				file.name.toLowerCase().endsWith(".zip") ||
				file.type === "application/zip" ||
				file.type === "application/x-zip-compressed";

			if (isZip) {
				try {
					await this._handleZipFile(file);
					return;
				} catch (err) {
					error(["files"], `error extracting zip file: ${err}`);
					ToastManager.add({
						type: "error",
						message: m["convert.archive_file.extract_error"]({
							filename: file.name,
							error: String(err),
						}),
					});
					return;
				}
			}

			// regular files
			const format = "." + file.name.split(".").pop()?.toLowerCase();
			if (!format) {
				log(["files"], `no extension found for ${file.name}`);
				return;
			}
			const converter = converters
				.sort(byNative(format))
				.find((converter) => converter.formatStrings().includes(format));
			if (!converter) {
				log(["files"], `no converter found for ${file.name}`);
				this.files.push(new VertFile(file, format));
				return;
			}
			const to = converter.formatStrings().find((f) => f !== format);
			if (!to) {
				log(["files"], `no output format found for ${file.name}`);
				return;
			}
			const vf = new VertFile(file, to);
			this.files.push(vf);
			this._addThumbnail(vf);

			const convName = converter.name;
			if (file.size > MAX_ARRAY_BUFFER_SIZE && convName === "vertd") {
				ToastManager.add({
					type: "warning",
					message: m["convert.large_file_warning"]({
						limit: (MAX_ARRAY_BUFFER_SIZE / GB).toFixed(2),
					}),
					durations: {
						stay: 10000,
					},
				});
			}

			const isVideo = convName === "vertd";
			const acceptedExternalWarning =
				localStorage.getItem("acceptedExternalWarning") === "true";
			if (isVideo && !acceptedExternalWarning && !this._warningShown) {
				this._warningShown = true;
				const title = m["convert.external_warning.title"]();
				const message = m["convert.external_warning.text"]();
				const buttons = [
					{
						text: m["convert.external_warning.no"](),
						action: () => {
							this.files = [
								...this.files.filter(
									(f) => !f.converters.map((c) => c.name).includes("vertd"),
								),
							];
							this._warningShown = false;
						},
					},
					{
						text: m["convert.external_warning.yes"](),
						action: () => {
							localStorage.setItem("acceptedExternalWarning", "true");
							this._warningShown = false;
						},
					},
				];
				addDialog(title, message, buttons, "warning");
			}
		}
	}

	public add(file: VertFile | null | undefined): void;
	public add(file: File | null | undefined): void;
	public add(file: File[] | null | undefined): void;
	public add(file: VertFile[] | null | undefined): void;
	public add(file: FileList | null | undefined): void;
	public add(
		file: VertFile | File | VertFile[] | File[] | FileList | null | undefined,
	) {
		if (!file) return;
		if (Array.isArray(file) || file instanceof FileList) {
			for (const f of file) {
				this._add(f);
			}
		} else {
			this._add(file);
		}
	}

	public async convertAll() {
		const promiseFns = this.files.map((f) => () => f.convert());
		const coreCount = navigator.hardwareConcurrency || 4;
		const queue = new PQueue({ concurrency: coreCount });
		await Promise.all(promiseFns.map((fn) => queue.add(fn)));
	}

	public async downloadAll() {
		if (files.files.length === 0) return;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const dlFiles: any[] = [];
		for (let i = 0; i < files.files.length; i++) {
			const file = files.files[i];
			const result = file.result;

			if (!result) {
				error(["files"], "No result found");
				continue;
			}

			let to = result.to;
			if (!to.startsWith(".")) to = `.${to}`;

			dlFiles.push({
				name: file.file.name.replace(/\.[^/.]+$/, "") + to,
				lastModified: Date.now(),
				input: await result.file.arrayBuffer(),
			});
		}
		const { downloadZip } = await import("client-zip");
		const blob = await downloadZip(dlFiles, "converted.zip").blob();
		const url = URL.createObjectURL(blob);

		const settings = JSON.parse(localStorage.getItem("settings") ?? "{}");
		const filenameFormat = settings.filenameFormat || "VERT_%name%";

		const format = (name: string) => {
			const date = new Date().toISOString();
			return name
				.replace(/%date%/g, date)
				.replace(/%name%/g, "Multi")
				.replace(/%extension%/g, "");
		};

		const a = document.createElement("a");
		a.href = url;
		a.download = `${format(filenameFormat)}.zip`;
		a.click();
		URL.revokeObjectURL(url);
		a.remove();
	}
}

export function setTheme(themeTo: "light" | "dark") {
	document.documentElement.classList.remove("light", "dark");
	document.documentElement.classList.add(themeTo);
	localStorage.setItem("theme", themeTo);
	log(["theme"], `set to ${themeTo}`);
	theme.set(themeTo);

	// Lock dark reader if it's set to dark mode
	if (themeTo === "dark") {
		const lock = document.createElement("meta");
		lock.name = "darkreader-lock";
		document.head.appendChild(lock);
	} else {
		const lock = document.querySelector('meta[name="darkreader-lock"]');
		if (lock) lock.remove();
	}
}

export function setEffects(effectsEnabled: boolean) {
	localStorage.setItem("effects", effectsEnabled.toString());
	log(["effects"], `set to ${effectsEnabled}`);
	effects.set(effectsEnabled);
}

export const files = new Files();
export const showGradient = writable(true);
export const gradientColor = writable("");
export const goingLeft = writable(false);
export const dropping = writable(false);
export const vertdLoaded = writable(false);
export const dropdownStates = writable<Record<string, string>>({});

export const isMobile = writable(false);
export const effects = writable(true);
export const theme = writable<"light" | "dark">("light");
export const locale = writable(getLocale());
export const availableLocales = {
	en: "English",
	es: "Español",
	fr: "Français",
	de: "Deutsch",
	it: "Italiano",
	ba: "Bosanski",
	hr: "Hrvatski",
	id: "Bahasa Indonesia",
	tr: "Türkçe",
	ja: "日本語",
	ko: "한국어",
	el: "Ελληνικά",
	"zh-Hans": "简体中文",
	"zh-Hant": "繁體中文",
	"pt-BR": "Português (Brasil)",
};

export function updateLocale(newLocale: string) {
	if (!Object.keys(availableLocales).includes(newLocale)) newLocale = "en";

	log(["locale"], `set to ${newLocale}`);
	localStorage.setItem("locale", newLocale);
	// @ts-expect-error shush
	setLocale(newLocale, { reload: false });
	// @ts-expect-error shush
	locale.set(newLocale);
}

export function link(
	tag: string | string[],
	text: string,
	links: string | string[],
	newTab?: boolean | boolean[],
	className?: string | string[],
) {
	if (!text) return "";

	const tags = Array.isArray(tag) ? tag : [tag];
	const linksArr = Array.isArray(links) ? links : [links];
	const newTabArr = Array.isArray(newTab) ? newTab : [newTab];
	const classArr = Array.isArray(className) ? className : [className];

	let result = text;

	tags.forEach((t, i) => {
		const link = linksArr[i] ?? "#";
		const target = newTabArr[i]
			? 'target="_blank" rel="noopener noreferrer"'
			: "";
		const cls = classArr[i] ? `class="${classArr[i]}"` : "";

		const regex = new RegExp(`\\[${t}\\](.*?)\\[\\/${t}\\]`, "g");
		result = result.replace(
			regex,
			(_, inner) => `<a href="${link}" ${target} ${cls} >${inner}</a>`,
		);
	});

	return result;
}

export function sanitize(
	html: string,
	allowedTags: string[] = ["a", "b", "code", "br"],
): string {
	return sanitizeHtml(html, {
		allowedTags: allowedTags,
		allowedAttributes: {
			a: ["href", "target", "rel", "class"],
			"*": ["class"],
		},
		allowedSchemes: ["http", "https", "mailto", "blob"],
	});
}

/**
 * Binary search for a max value without knowing the exact value, only that it
 * can be under or over It dose not test every number but instead looks for
 * 1,2,4,8,16,32,64,128,96,95 to figure out that you thought about #96 from
 * 0-infinity
 *
 * @example findFirstPositive(x => matchMedia(`(max-resolution: ${x}dpi)`).matches)
 * @author Jimmy Wärting
 * @see {@link https://stackoverflow.com/a/72124984/1008999}
 * @param {function} f The function to run the test on (should return truthy or falsy values)
 * @param {bigint} [b=1] Where to start looking from
 * @param {function} d privately used to calculate the next value to test
 * @returns {bigint} Integer
 */
function findFirstPositive(
	f: (x: bigint) => number,
	b = 1n,
	d = (e: bigint, g: bigint, c?: bigint): bigint =>
		g < e
			? -1n
			: 0 < f((c = (e + g) >> 1n))
				? c == e || 0 >= f(c - 1n)
					? c
					: d(e, c - 1n)
				: d(c + 1n, g),
): bigint {
	for (; 0 >= f(b); b <<= 1n);
	return d(b >> 1n, b) - 1n;
}

export const getMaxArrayBufferSize = (): number => {
	if (typeof window === "undefined") return 2 * GB; // default for SSR

	// check cache first
	const cached = localStorage.getItem("maxArrayBufferSize");
	if (cached) {
		const parsed = Number(cached);
		log(["converters"], `using cached max ArrayBuffer size: ${parsed} bytes`);
		if (!isNaN(parsed) && parsed > 0) return parsed;
	}

	// detect max size using binary search
	const maxSize = findFirstPositive((x) => {
		try {
			new ArrayBuffer(Number(x));
			return 0; // false = can allocate
		} catch {
			return 1; // true = cannot allocate
		}
	});

	const result = Number(maxSize);
	localStorage.setItem("maxArrayBufferSize", result.toString());
	log(["converters"], `detected max ArrayBuffer size: ${result} bytes`);

	return result;
};

export const MAX_ARRAY_BUFFER_SIZE = getMaxArrayBufferSize();
```

--------------------------------------------------------------------------------

---[FILE: conversion-worker.ts]---
Location: VERT-main/src/lib/types/conversion-worker.ts

```typescript
import { VertFile } from "./file.svelte";

interface ConvertMessage {
	type: "convert";
	input: {
		file: File;
		name: string;
		from: string;
		to: string;
	} | VertFile;
	to: string;
	compression: number | null;
	keepMetadata?: boolean;
}

interface FinishedMessage {
	type: "finished";
	output: ArrayBufferLike | Uint8Array;
	zip?: boolean;
}

interface LoadMessage {
	type: "load";
	wasm: ArrayBuffer;
}

interface LoadedMessage {
	type: "loaded";
}

interface ReadyMessage {
	type: "ready";
}

interface ErrorMessage {
	type: "error";
	error: string;
}

export type WorkerMessage = (
	| ConvertMessage
	| FinishedMessage
	| LoadMessage
	| LoadedMessage
	| ReadyMessage
	| ErrorMessage
) & {
	id: string; // unused? rn just using file id, probably meant to be incrementing w/ every message posted?
};
```

--------------------------------------------------------------------------------

---[FILE: file.svelte.ts]---
Location: VERT-main/src/lib/types/file.svelte.ts

```typescript
import { byNative, converters } from "$lib/converters";
import type { Converter } from "$lib/converters/converter.svelte";
import { m } from "$lib/paraglide/messages";
import { ToastManager } from "$lib/util/toast.svelte";
import type { Component } from "svelte";
import { MAX_ARRAY_BUFFER_SIZE } from "$lib/store/index.svelte";

export class VertFile {
	public id: string = Math.random().toString(36).slice(2, 8);
	public readonly file: File;

	public get from() {
		return ("." + this.file.name.split(".").pop() || "").toLowerCase();
	}

	public get name() {
		return this.file.name;
	}

	public progress = $state(0);
	public result = $state<VertFile | null>(null);

	public to = $state("");

	public blobUrl = $state<string>();

	public processing = $state(false);

	public cancelled = $state(false);

	public converters: Converter[] = [];

	public isZip = $state(() => this.from === ".zip");

	public findConverters(supportedFormats: string[] = [this.from]) {
		const converter = this.converters
			.filter((converter) =>
				converter
					.formatStrings()
					.map((f) => supportedFormats.includes(f)),
			)
			.sort(byNative(this.from));
		return converter;
	}

	public findConverter() {
		// zip will always only be added if there's one converter that supports all files - handled in store's _handleZipFile()
		if (this.isZip()) return this.converters[0];

		const converter = this.converters.find((converter) => {
			if (
				!converter.formatStrings().includes(this.from) ||
				!converter.formatStrings().includes(this.to)
			) {
				return false;
			}

			const theirFrom = converter.supportedFormats.find(
				(f) => f.name === this.from,
			);
			const theirTo = converter.supportedFormats.find(
				(f) => f.name === this.to,
			);
			if (!theirFrom || !theirTo) return false;
			if (!theirFrom.isNative && !theirTo.isNative) return false;
			return true;
		});
		return converter;
	}

	public isLarge(): boolean {
		return this.file.size > MAX_ARRAY_BUFFER_SIZE;
	}

	public supportsStreaming(): boolean {
		// only vertd (video/gif -> video/gif) supports streaming
		// rest of converters need entire file in memory, limited by ArrayBuffer limits
		const converter = this.findConverter();
		return converter?.name === "vertd";
	}

	constructor(file: File, to: string, blobUrl?: string) {
		const ext = file.name.split(".").pop();
		const newFile = new File(
			[file.slice(0, file.size, file.type)],
			`${file.name.split(".").slice(0, -1).join(".")}.${ext?.toLowerCase()}`,
		);
		this.file = newFile;
		this.to = to.startsWith(".") ? to : `.${to}`;
		this.converters = converters.filter((c) =>
			c.formatStrings().includes(this.from),
		);
		this.convert = this.convert.bind(this);
		this.download = this.download.bind(this);
		this.blobUrl = blobUrl;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public async convert(...args: any[]) {
		if (!this.converters.length) throw new Error("No converters found");
		const converter = this.findConverter();
		if (!converter) throw new Error("No converter found");
		this.result = null;
		this.progress = 0;
		this.processing = true;
		this.cancelled = false;
		let res;
		try {
			// for zips: extract > convert each > re-zip
			// else convert normally
			res = this.isZip()
				? await this.convertZip(converter)
				: await converter.convert(this, this.to, ...args);
			this.result = res;
		} catch (err) {
			if (!this.cancelled) this.toastErr(err);
			this.result = null;
		}
		this.processing = false;
		return res;
	}

	private async convertZip(converter: Converter): Promise<VertFile> {
		const { extractZip, createZip } = await import("$lib/util/zip");
		const { default: PQueue } = await import("p-queue");

		const entries = await extractZip(this.file);
		const totalFiles = entries.length;
		const fileProgress: number[] = new Array(totalFiles).fill(0);
		const convertedFiles: File[] = [];

		const queue = new PQueue({
			concurrency: navigator.hardwareConcurrency || 4,
		});

		const updateProgress = () => {
			const totalProgress = fileProgress.reduce((sum, p) => sum + p, 0);
			this.progress = Math.round(totalProgress / totalFiles);
		};

		// convert all files in the zip
		await queue.addAll(
			entries.map(({ filename, data }, index) => async () => {
				if (this.cancelled) {
					throw new Error("Conversion cancelled");
				}

				const file = new File([new Uint8Array(data)], filename, {
					type: "application/octet-stream",
				});
				const tempVFile = new VertFile(file, this.to);
				tempVFile.converters = [converter];

				if (converter.reportsProgress) {
					// track progress of individual files
					const progressInterval = setInterval(() => {
						fileProgress[index] = tempVFile.progress;
						updateProgress();
					}, 100);

					try {
						const converted = await converter.convert(
							tempVFile,
							this.to,
						);

						let outputExt = this.to;
						if (!outputExt.startsWith("."))
							outputExt = `.${outputExt}`;

						convertedFiles[index] = new File(
							[await converted.file.arrayBuffer()],
							converted.name,
						);

						fileProgress[index] = 100;
						updateProgress();
					} finally {
						clearInterval(progressInterval);
					}
				} else {
					// else track progress via completions only
					const converted = await converter.convert(
						tempVFile,
						this.to,
					);

					let outputExt = this.to;
					if (!outputExt.startsWith(".")) outputExt = `.${outputExt}`;

					convertedFiles[index] = new File(
						[await converted.file.arrayBuffer()],
						converted.name,
					);

					fileProgress[index] = 100;
					updateProgress();
				}
			}),
		);

		// return zip of converted files
		const resultArray = await createZip(convertedFiles);
		const outputFilename = this.file.name.replace(/\.[^/.]+$/, ".zip");
		const resultFile = new File(
			[new Uint8Array(resultArray)],
			outputFilename,
		);
		return new VertFile(resultFile, ".zip");
	}

	public async cancel() {
		if (!this.processing) return;
		const converter = this.findConverter();
		if (!converter) throw new Error("No converter found");
		this.cancelled = true;
		try {
			await converter.cancel(this);
			this.processing = false;
			this.result = null;
		} catch (err) {
			this.toastErr(err);
		}
	}

	private toastErr(err: unknown) {
		type ToastMsg = {
			component: Component;
			additional: unknown;
		};

		const castedErr = err as Error | string | ToastMsg;
		let toastMsg: string | ToastMsg = "";
		if (typeof castedErr === "string") {
			toastMsg = castedErr;
		} else if (castedErr instanceof Error) {
			toastMsg = castedErr.message;
		} else {
			toastMsg = castedErr;
		}

		// ToastManager.add({
		// 	type: "error",
		// 	message:
		// 		typeof toastMsg === "string"
		// 			? m["workers.errors.general"]({
		// 					file: this.file.name,
		// 					message: toastMsg,
		// 				})
		// 			: toastMsg,
		// });

		if (typeof toastMsg === "string") {
			ToastManager.add({
				type: "error",
				message: m["workers.errors.general"]({
					file: this.file.name,
					message: toastMsg,
				}),
			});
		} else {
			ToastManager.add({
				type: "error",
				message: toastMsg.component,
				additional: toastMsg.additional,
			});
		}
	}

	public async download() {
		if (!this.result) throw new Error("No result found");

		// give the freedom to the converter to set the extension (ie. pandoc uses this to output zips)
		let to = this.result.to;
		if (!to.startsWith(".")) to = `.${to}`;

		const settings = JSON.parse(localStorage.getItem("settings") ?? "{}");
		const filenameFormat = settings.filenameFormat || "VERT_%name%";

		const format = (name: string) => {
			const date = new Date().toISOString();
			const baseName = this.file.name.replace(/\.[^/.]+$/, "");
			const originalExtension = this.file.name.split(".").pop()!;
			return name
				.replace(/%date%/g, date)
				.replace(/%name%/g, baseName)
				.replace(/%extension%/g, originalExtension);
		};

		const blob = URL.createObjectURL(
			new Blob([await this.result.file.arrayBuffer()], {
				// type: to.slice(1),
				type: "application/octet-stream", // use generic type to prevent browsers changing extension
			}),
		);
		const a = document.createElement("a");
		a.href = blob;
		a.download = `${format(filenameFormat)}${to}`;
		// force it to not open in a new tab
		a.target = "_blank";
		a.style.display = "none";
		a.click();
		URL.revokeObjectURL(blob);
		a.remove();
	}

	public hash(): Promise<string> {
		const stream = this.file.stream();
		const hashes = new Set<string>();
		const reader = stream.getReader();
		return new Promise<string>((resolve, reject) => {
			function processChunk() {
				reader.read().then(({ done, value }) => {
					if (done) {
						const combinedHash = Array.from(hashes).sort().join("");
						resolve(combinedHash);
						return;
					}

					crypto.subtle
						.digest("SHA-256", value)
						.then((hashBuffer) => {
							const hashArray = Array.from(
								new Uint8Array(hashBuffer),
							);
							const hashHex = hashArray
								.map((b) => b.toString(16).padStart(2, "0"))
								.join("");
							hashes.add(hashHex);
							processChunk();
						})
						.catch((err) => {
							reject(err);
						});
				});
			}
			processChunk();
		});
	}
}

export interface Categories {
	[key: string]: {
		formats: string[];
		canConvertTo?: string[];
	};
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: VERT-main/src/lib/types/index.ts

```typescript
export * from "./file.svelte";
export * from "./util";
export * from "./conversion-worker";
```

--------------------------------------------------------------------------------

---[FILE: util.ts]---
Location: VERT-main/src/lib/types/util.ts

```typescript
export type OmitBetterStrict<T, K extends keyof T> = T extends unknown
	? Pick<T, Exclude<keyof T, K>>
	: never;
```

--------------------------------------------------------------------------------

---[FILE: animation.ts]---
Location: VERT-main/src/lib/util/animation.ts

```typescript
import { isMobile, effects } from "$lib/store/index.svelte";
import type { AnimationConfig, FlipParams } from "svelte/animate";
import { cubicOut } from "svelte/easing";
import {
	fade as svelteFade,
	fly as svelteFly,
	type FadeParams,
	type FlyParams,
} from "svelte/transition";

// Subscribe to stores
let effectsEnabled = true;
let isMobileDevice = false;

export function initStores() {
	effects.subscribe((value) => {
		effectsEnabled = value;
	});
	isMobile.subscribe((value) => {
		isMobileDevice = value;
	});
}

export const transition =
	"linear(0,0.006,0.025 2.8%,0.101 6.1%,0.539 18.9%,0.721 25.3%,0.849 31.5%,0.937 38.1%,0.968 41.8%,0.991 45.7%,1.006 50.1%,1.015 55%,1.017 63.9%,1.001)";

export const duration = 500;

export function fade(node: HTMLElement, options: FadeParams) {
	if (!effectsEnabled) return {};
	const animation = svelteFade(node, options);
	return animation;
}

export function fly(node: HTMLElement, options: FlyParams) {
	if (!effectsEnabled || isMobileDevice) return {};
	const animation = svelteFly(node, options);
	return animation;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function is_function(thing: unknown): thing is Function {
	return typeof thing === "function";
}

type Params = FlipParams & {};

/**
 * The flip function calculates the start and end position of an element and animates between them, translating the x and y values.
 * `flip` stands for [First, Last, Invert, Play](https://aerotwist.com/blog/flip-your-animations/).
 *
 * https://svelte.dev/docs/svelte-animate#flip
 */
export function flip(
	node: HTMLElement,
	{ from, to }: { from: DOMRect; to: DOMRect },
	params: Params = {},
): AnimationConfig {
	const style = getComputedStyle(node);
	const transform = style.transform === "none" ? "" : style.transform;
	const [ox, oy] = style.transformOrigin.split(" ").map(parseFloat);
	const dx = from.left + (from.width * ox) / to.width - (to.left + ox);
	const dy = from.top + (from.height * oy) / to.height - (to.top + oy);
	const {
		delay = 0,
		duration = (d) => Math.sqrt(d) * 120,
		easing = cubicOut,
	} = params;
	return {
		delay,
		duration: is_function(duration)
			? duration(Math.sqrt(dx * dx + dy * dy))
			: duration,
		easing,
		css: (_t, u) => {
			const x = u * dx;
			const y = u * dy;
			// const sx = scale ? t + (u * from.width) / to.width : 1;
			// const sy = scale ? t + (u * from.height) / to.height : 1;
			return `transform: ${transform} translate(${x}px, ${y}px);`;
		},
	};
}
```

--------------------------------------------------------------------------------

---[FILE: consts.ts]---
Location: VERT-main/src/lib/util/consts.ts

```typescript
import { PUB_DISABLE_ALL_EXTERNAL_REQUESTS, PUB_ENV } from "$env/static/public";

export const GITHUB_URL_VERT = "https://github.com/VERT-sh/VERT";
export const GITHUB_URL_VERTD = "https://github.com/VERT-sh/vertd";
export const GITHUB_API_URL = "https://api.github.com/repos/VERT-sh/VERT";
export const DISCORD_URL = "https://discord.gg/kqevGxYPak";
export const VERT_NAME =
	PUB_ENV === "development"
		? "VERT Local"
		: PUB_ENV === "nightly"
			? "VERT Nightly"
			: "VERT.sh";
export const CONTACT_EMAIL = "hello@vert.sh";

// i'm not entirely sure this should be in consts.ts, but it is technically a constant as .env is static for VERT
export const DISABLE_ALL_EXTERNAL_REQUESTS =
	PUB_DISABLE_ALL_EXTERNAL_REQUESTS === "true";

export const GB = 1024 * 1024 * 1024;
```

--------------------------------------------------------------------------------

---[FILE: ip.ts]---
Location: VERT-main/src/lib/util/ip.ts

```typescript
import { browser } from "$app/environment";

export interface IpInfo {
	ip: string;
	network: string;
	version: string;
	city: string;
	region: string;
	region_code: string;
	country: string;
	country_name: string;
	country_code: string;
	country_code_iso3: string;
	country_capital: string;
	country_tld: string;
	continent_code: string;
	in_eu: boolean;
	postal: string;
	latitude: number;
	longitude: number;
	timezone: string;
	utc_offset: string;
	country_calling_code: string;
	currency: string;
	currency_name: string;
	languages: string;
	country_area: number;
	country_population: number;
	asn: string;
	org: string;
}

export const ip = async (): Promise<IpInfo> => {
	try {
		if (browser) {
			const item = localStorage.getItem("ipinfo");
			if (item) {
				return JSON.parse(item);
			}
		}

		const res = await fetch("https://ipapi.co/json/").then((r) => r.json());
		if (browser) {
			localStorage.setItem("ipinfo", JSON.stringify(res));
		}

		return res;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (_) {
		return {
			ip: "127.0.0.1",
			asn: "AS0",
			city: "Localhost",
			continent_code: "NA",
			country: "US",
			country_calling_code: "+1",
			country_capital: "Washington",
			country_code: "US",
			country_code_iso3: "USA",
			country_name: "United States",
			country_population: 0,
			currency: "USD",
			currency_name: "Dollar",
			languages: "en-US,es-US,haw,fr",
			latitude: 0,
			longitude: 0,
			network: "Unknown",
			postal: "00000",
			region: "Local",
			region_code: "LOC",
			country_area: 0,
			timezone: "America/New_York",
			utc_offset: "-0500",
			version: "IPv4",
			in_eu: false,
			org: "Localhost",
			country_tld: ".us",
		};
	}
};
```

--------------------------------------------------------------------------------

````
