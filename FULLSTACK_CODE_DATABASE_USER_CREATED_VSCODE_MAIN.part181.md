---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 181
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 181 of 552)

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

---[FILE: src/vs/base/node/pfs.ts]---
Location: vscode-main/src/vs/base/node/pfs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import { tmpdir } from 'os';
import { promisify } from 'util';
import { ResourceQueue, timeout } from '../common/async.js';
import { isEqualOrParent, isRootOrDriveLetter, randomPath } from '../common/extpath.js';
import { normalizeNFC } from '../common/normalization.js';
import { basename, dirname, join, normalize, sep } from '../common/path.js';
import { isLinux, isMacintosh, isWindows } from '../common/platform.js';
import { extUriBiasedIgnorePathCase } from '../common/resources.js';
import { URI } from '../common/uri.js';
import { CancellationToken } from '../common/cancellation.js';
import { rtrim } from '../common/strings.js';

//#region rimraf

export enum RimRafMode {

	/**
	 * Slow version that unlinks each file and folder.
	 */
	UNLINK,

	/**
	 * Fast version that first moves the file/folder
	 * into a temp directory and then deletes that
	 * without waiting for it.
	 */
	MOVE
}

/**
 * Allows to delete the provided path (either file or folder) recursively
 * with the options:
 * - `UNLINK`: direct removal from disk
 * - `MOVE`: faster variant that first moves the target to temp dir and then
 *           deletes it in the background without waiting for that to finish.
 *           the optional `moveToPath` allows to override where to rename the
 *           path to before deleting it.
 */
async function rimraf(path: string, mode: RimRafMode.UNLINK): Promise<void>;
async function rimraf(path: string, mode: RimRafMode.MOVE, moveToPath?: string): Promise<void>;
async function rimraf(path: string, mode?: RimRafMode, moveToPath?: string): Promise<void>;
async function rimraf(path: string, mode = RimRafMode.UNLINK, moveToPath?: string): Promise<void> {
	if (isRootOrDriveLetter(path)) {
		throw new Error('rimraf - will refuse to recursively delete root');
	}

	// delete: via rm
	if (mode === RimRafMode.UNLINK) {
		return rimrafUnlink(path);
	}

	// delete: via move
	return rimrafMove(path, moveToPath);
}

async function rimrafMove(path: string, moveToPath = randomPath(tmpdir())): Promise<void> {
	try {
		try {
			await fs.promises.rename(path, moveToPath);
		} catch (error) {
			if (error.code === 'ENOENT') {
				return; // ignore - path to delete did not exist
			}

			return rimrafUnlink(path); // otherwise fallback to unlink
		}

		// Delete but do not return as promise
		rimrafUnlink(moveToPath).catch(() => {/* ignore */ });
	} catch (error) {
		if (error.code !== 'ENOENT') {
			throw error;
		}
	}
}

async function rimrafUnlink(path: string): Promise<void> {
	return fs.promises.rm(path, { recursive: true, force: true, maxRetries: 3 });
}

//#endregion

//#region readdir with NFC support (macos)

export interface IDirent {
	name: string;

	isFile(): boolean;
	isDirectory(): boolean;
	isSymbolicLink(): boolean;
}

/**
 * Drop-in replacement of `fs.readdir` with support
 * for converting from macOS NFD unicon form to NFC
 * (https://github.com/nodejs/node/issues/2165)
 */
async function readdir(path: string): Promise<string[]>;
async function readdir(path: string, options: { withFileTypes: true }): Promise<IDirent[]>;
async function readdir(path: string, options?: { withFileTypes: true }): Promise<(string | IDirent)[]> {
	try {
		return await doReaddir(path, options);
	} catch (error) {
		// Workaround for #252361 that should be removed once the upstream issue
		// in node.js is resolved. Adds a trailing dot to a root drive letter path
		// (G:\ => G:\.) as a workaround.
		if (error.code === 'ENOENT' && isWindows && isRootOrDriveLetter(path)) {
			try {
				return await doReaddir(`${path}.`, options);
			} catch {
				// ignore
			}
		}
		throw error;
	}
}

async function doReaddir(path: string, options?: { withFileTypes: true }): Promise<(string | IDirent)[]> {
	return handleDirectoryChildren(await (options ? safeReaddirWithFileTypes(path) : fs.promises.readdir(path)));
}

async function safeReaddirWithFileTypes(path: string): Promise<IDirent[]> {
	try {
		return await fs.promises.readdir(path, { withFileTypes: true });
	} catch (error) {
		console.warn('[node.js fs] readdir with filetypes failed with error: ', error);
	}

	// Fallback to manually reading and resolving each
	// children of the folder in case we hit an error
	// previously.
	// This can only really happen on exotic file systems
	// such as explained in #115645 where we get entries
	// from `readdir` that we can later not `lstat`.
	const result: IDirent[] = [];
	const children = await readdir(path);
	for (const child of children) {
		let isFile = false;
		let isDirectory = false;
		let isSymbolicLink = false;

		try {
			const lstat = await fs.promises.lstat(join(path, child));

			isFile = lstat.isFile();
			isDirectory = lstat.isDirectory();
			isSymbolicLink = lstat.isSymbolicLink();
		} catch (error) {
			console.warn('[node.js fs] unexpected error from lstat after readdir: ', error);
		}

		result.push({
			name: child,
			isFile: () => isFile,
			isDirectory: () => isDirectory,
			isSymbolicLink: () => isSymbolicLink
		});
	}

	return result;
}

function handleDirectoryChildren(children: string[]): string[];
function handleDirectoryChildren(children: IDirent[]): IDirent[];
function handleDirectoryChildren(children: (string | IDirent)[]): (string | IDirent)[];
function handleDirectoryChildren(children: (string | IDirent)[]): (string | IDirent)[] {
	return children.map(child => {

		// Mac: uses NFD unicode form on disk, but we want NFC
		// See also https://github.com/nodejs/node/issues/2165

		if (typeof child === 'string') {
			return isMacintosh ? normalizeNFC(child) : child;
		}

		child.name = isMacintosh ? normalizeNFC(child.name) : child.name;

		return child;
	});
}

/**
 * A convenience method to read all children of a path that
 * are directories.
 */
async function readDirsInDir(dirPath: string): Promise<string[]> {
	const children = await readdir(dirPath);
	const directories: string[] = [];

	for (const child of children) {
		if (await SymlinkSupport.existsDirectory(join(dirPath, child))) {
			directories.push(child);
		}
	}

	return directories;
}

//#endregion

//#region whenDeleted()

/**
 * A `Promise` that resolves when the provided `path`
 * is deleted from disk.
 */
export function whenDeleted(path: string, intervalMs = 1000): Promise<void> {
	return new Promise<void>(resolve => {
		let running = false;
		const interval = setInterval(() => {
			if (!running) {
				running = true;
				fs.access(path, err => {
					running = false;

					if (err) {
						clearInterval(interval);
						resolve(undefined);
					}
				});
			}
		}, intervalMs);
	});
}

//#endregion

//#region Methods with symbolic links support

export namespace SymlinkSupport {

	export interface IStats {

		// The stats of the file. If the file is a symbolic
		// link, the stats will be of that target file and
		// not the link itself.
		// If the file is a symbolic link pointing to a non
		// existing file, the stat will be of the link and
		// the `dangling` flag will indicate this.
		stat: fs.Stats;

		// Will be provided if the resource is a symbolic link
		// on disk. Use the `dangling` flag to find out if it
		// points to a resource that does not exist on disk.
		symbolicLink?: { dangling: boolean };
	}

	/**
	 * Resolves the `fs.Stats` of the provided path. If the path is a
	 * symbolic link, the `fs.Stats` will be from the target it points
	 * to. If the target does not exist, `dangling: true` will be returned
	 * as `symbolicLink` value.
	 */
	export async function stat(path: string): Promise<IStats> {

		// First stat the link
		let lstats: fs.Stats | undefined;
		try {
			lstats = await fs.promises.lstat(path);

			// Return early if the stat is not a symbolic link at all
			if (!lstats.isSymbolicLink()) {
				return { stat: lstats };
			}
		} catch {
			/* ignore - use stat() instead */
		}

		// If the stat is a symbolic link or failed to stat, use fs.stat()
		// which for symbolic links will stat the target they point to
		try {
			const stats = await fs.promises.stat(path);

			return { stat: stats, symbolicLink: lstats?.isSymbolicLink() ? { dangling: false } : undefined };
		} catch (error) {

			// If the link points to a nonexistent file we still want
			// to return it as result while setting dangling: true flag
			if (error.code === 'ENOENT' && lstats) {
				return { stat: lstats, symbolicLink: { dangling: true } };
			}

			// Windows: workaround a node.js bug where reparse points
			// are not supported (https://github.com/nodejs/node/issues/36790)
			if (isWindows && error.code === 'EACCES') {
				try {
					const stats = await fs.promises.stat(await fs.promises.readlink(path));

					return { stat: stats, symbolicLink: { dangling: false } };
				} catch (error) {

					// If the link points to a nonexistent file we still want
					// to return it as result while setting dangling: true flag
					if (error.code === 'ENOENT' && lstats) {
						return { stat: lstats, symbolicLink: { dangling: true } };
					}

					throw error;
				}
			}

			throw error;
		}
	}

	/**
	 * Figures out if the `path` exists and is a file with support
	 * for symlinks.
	 *
	 * Note: this will return `false` for a symlink that exists on
	 * disk but is dangling (pointing to a nonexistent path).
	 *
	 * Use `exists` if you only care about the path existing on disk
	 * or not without support for symbolic links.
	 */
	export async function existsFile(path: string): Promise<boolean> {
		try {
			const { stat, symbolicLink } = await SymlinkSupport.stat(path);

			return stat.isFile() && symbolicLink?.dangling !== true;
		} catch {
			// Ignore, path might not exist
		}

		return false;
	}

	/**
	 * Figures out if the `path` exists and is a directory with support for
	 * symlinks.
	 *
	 * Note: this will return `false` for a symlink that exists on
	 * disk but is dangling (pointing to a nonexistent path).
	 *
	 * Use `exists` if you only care about the path existing on disk
	 * or not without support for symbolic links.
	 */
	export async function existsDirectory(path: string): Promise<boolean> {
		try {
			const { stat, symbolicLink } = await SymlinkSupport.stat(path);

			return stat.isDirectory() && symbolicLink?.dangling !== true;
		} catch {
			// Ignore, path might not exist
		}

		return false;
	}
}

//#endregion

//#region Write File

// According to node.js docs (https://nodejs.org/docs/v14.16.0/api/fs.html#fs_fs_writefile_file_data_options_callback)
// it is not safe to call writeFile() on the same path multiple times without waiting for the callback to return.
// Therefor we use a Queue on the path that is given to us to sequentialize calls to the same path properly.
const writeQueues = new ResourceQueue();

/**
 * Same as `fs.writeFile` but with an additional call to
 * `fs.fdatasync` after writing to ensure changes are
 * flushed to disk.
 *
 * In addition, multiple writes to the same path are queued.
 */
function writeFile(path: string, data: string, options?: IWriteFileOptions): Promise<void>;
function writeFile(path: string, data: Buffer, options?: IWriteFileOptions): Promise<void>;
function writeFile(path: string, data: Uint8Array, options?: IWriteFileOptions): Promise<void>;
function writeFile(path: string, data: string | Buffer | Uint8Array, options?: IWriteFileOptions): Promise<void>;
function writeFile(path: string, data: string | Buffer | Uint8Array, options?: IWriteFileOptions): Promise<void> {
	return writeQueues.queueFor(URI.file(path), () => {
		const ensuredOptions = ensureWriteOptions(options);

		return new Promise((resolve, reject) => doWriteFileAndFlush(path, data, ensuredOptions, error => error ? reject(error) : resolve()));
	}, extUriBiasedIgnorePathCase);
}

interface IWriteFileOptions {
	mode?: number;
	flag?: string;
}

interface IEnsuredWriteFileOptions extends IWriteFileOptions {
	mode: number;
	flag: string;
}

let canFlush = true;
export function configureFlushOnWrite(enabled: boolean): void {
	canFlush = enabled;
}

// Calls fs.writeFile() followed by a fs.sync() call to flush the changes to disk
// We do this in cases where we want to make sure the data is really on disk and
// not in some cache.
//
// See https://github.com/nodejs/node/blob/v5.10.0/lib/fs.js#L1194
function doWriteFileAndFlush(path: string, data: string | Buffer | Uint8Array, options: IEnsuredWriteFileOptions, callback: (error: Error | null) => void): void {
	if (!canFlush) {
		return fs.writeFile(path, data, { mode: options.mode, flag: options.flag }, callback);
	}

	// Open the file with same flags and mode as fs.writeFile()
	fs.open(path, options.flag, options.mode, (openError, fd) => {
		if (openError) {
			return callback(openError);
		}

		// It is valid to pass a fd handle to fs.writeFile() and this will keep the handle open!
		fs.writeFile(fd, data, writeError => {
			if (writeError) {
				return fs.close(fd, () => callback(writeError)); // still need to close the handle on error!
			}

			// Flush contents (not metadata) of the file to disk
			// https://github.com/microsoft/vscode/issues/9589
			fs.fdatasync(fd, (syncError: Error | null) => {

				// In some exotic setups it is well possible that node fails to sync
				// In that case we disable flushing and warn to the console
				if (syncError) {
					console.warn('[node.js fs] fdatasync is now disabled for this session because it failed: ', syncError);
					configureFlushOnWrite(false);
				}

				return fs.close(fd, closeError => callback(closeError));
			});
		});
	});
}

/**
 * Same as `fs.writeFileSync` but with an additional call to
 * `fs.fdatasyncSync` after writing to ensure changes are
 * flushed to disk.
 *
 * @deprecated always prefer async variants over sync!
 */
export function writeFileSync(path: string, data: string | Buffer, options?: IWriteFileOptions): void {
	const ensuredOptions = ensureWriteOptions(options);

	if (!canFlush) {
		return fs.writeFileSync(path, data, { mode: ensuredOptions.mode, flag: ensuredOptions.flag });
	}

	// Open the file with same flags and mode as fs.writeFile()
	const fd = fs.openSync(path, ensuredOptions.flag, ensuredOptions.mode);

	try {

		// It is valid to pass a fd handle to fs.writeFile() and this will keep the handle open!
		fs.writeFileSync(fd, data);

		// Flush contents (not metadata) of the file to disk
		try {
			fs.fdatasyncSync(fd); // https://github.com/microsoft/vscode/issues/9589
		} catch (syncError) {
			console.warn('[node.js fs] fdatasyncSync is now disabled for this session because it failed: ', syncError);
			configureFlushOnWrite(false);
		}
	} finally {
		fs.closeSync(fd);
	}
}

function ensureWriteOptions(options?: IWriteFileOptions): IEnsuredWriteFileOptions {
	if (!options) {
		return { mode: 0o666 /* default node.js mode for files */, flag: 'w' };
	}

	return {
		mode: typeof options.mode === 'number' ? options.mode : 0o666 /* default node.js mode for files */,
		flag: typeof options.flag === 'string' ? options.flag : 'w'
	};
}

//#endregion

//#region Move / Copy

/**
 * A drop-in replacement for `fs.rename` that:
 * - allows to move across multiple disks
 * - attempts to retry the operation for certain error codes on Windows
 */
async function rename(source: string, target: string, windowsRetryTimeout: number | false = 60000): Promise<void> {
	if (source === target) {
		return;  // simulate node.js behaviour here and do a no-op if paths match
	}

	try {
		if (isWindows && typeof windowsRetryTimeout === 'number') {
			// On Windows, a rename can fail when either source or target
			// is locked by AV software.
			await renameWithRetry(source, target, Date.now(), windowsRetryTimeout);
		} else {
			await fs.promises.rename(source, target);
		}
	} catch (error) {
		// In two cases we fallback to classic copy and delete:
		//
		// 1.) The EXDEV error indicates that source and target are on different devices
		// In this case, fallback to using a copy() operation as there is no way to
		// rename() between different devices.
		//
		// 2.) The user tries to rename a file/folder that ends with a dot. This is not
		// really possible to move then, at least on UNC devices.
		if (source.toLowerCase() !== target.toLowerCase() && error.code === 'EXDEV' || source.endsWith('.')) {
			await copy(source, target, { preserveSymlinks: false /* copying to another device */ });
			await rimraf(source, RimRafMode.MOVE);
		} else {
			throw error;
		}
	}
}

async function renameWithRetry(source: string, target: string, startTime: number, retryTimeout: number, attempt = 0): Promise<void> {
	try {
		return await fs.promises.rename(source, target);
	} catch (error) {
		if (error.code !== 'EACCES' && error.code !== 'EPERM' && error.code !== 'EBUSY') {
			throw error; // only for errors we think are temporary
		}

		if (Date.now() - startTime >= retryTimeout) {
			console.error(`[node.js fs] rename failed after ${attempt} retries with error: ${error}`);

			throw error; // give up after configurable timeout
		}

		if (attempt === 0) {
			let abortRetry = false;
			try {
				const { stat } = await SymlinkSupport.stat(target);
				if (!stat.isFile()) {
					abortRetry = true; // if target is not a file, EPERM error may be raised and we should not attempt to retry
				}
			} catch {
				// Ignore
			}

			if (abortRetry) {
				throw error;
			}
		}

		// Delay with incremental backoff up to 100ms
		await timeout(Math.min(100, attempt * 10));

		// Attempt again
		return renameWithRetry(source, target, startTime, retryTimeout, attempt + 1);
	}
}

interface ICopyPayload {
	readonly root: { source: string; target: string };
	readonly options: { preserveSymlinks: boolean };
	readonly handledSourcePaths: Set<string>;
}

/**
 * Recursively copies all of `source` to `target`.
 *
 * The options `preserveSymlinks` configures how symbolic
 * links should be handled when encountered. Set to
 * `false` to not preserve them and `true` otherwise.
 */
async function copy(source: string, target: string, options: { preserveSymlinks: boolean }): Promise<void> {
	return doCopy(source, target, { root: { source, target }, options, handledSourcePaths: new Set<string>() });
}

// When copying a file or folder, we want to preserve the mode
// it had and as such provide it when creating. However, modes
// can go beyond what we expect (see link below), so we mask it.
// (https://github.com/nodejs/node-v0.x-archive/issues/3045#issuecomment-4862588)
const COPY_MODE_MASK = 0o777;

async function doCopy(source: string, target: string, payload: ICopyPayload): Promise<void> {

	// Keep track of paths already copied to prevent
	// cycles from symbolic links to cause issues
	if (payload.handledSourcePaths.has(source)) {
		return;
	} else {
		payload.handledSourcePaths.add(source);
	}

	const { stat, symbolicLink } = await SymlinkSupport.stat(source);

	// Symlink
	if (symbolicLink) {

		// Try to re-create the symlink unless `preserveSymlinks: false`
		if (payload.options.preserveSymlinks) {
			try {
				return await doCopySymlink(source, target, payload);
			} catch {
				// in any case of an error fallback to normal copy via dereferencing
			}
		}

		if (symbolicLink.dangling) {
			return; // skip dangling symbolic links from here on (https://github.com/microsoft/vscode/issues/111621)
		}
	}

	// Folder
	if (stat.isDirectory()) {
		return doCopyDirectory(source, target, stat.mode & COPY_MODE_MASK, payload);
	}

	// File or file-like
	else {
		return doCopyFile(source, target, stat.mode & COPY_MODE_MASK);
	}
}

async function doCopyDirectory(source: string, target: string, mode: number, payload: ICopyPayload): Promise<void> {

	// Create folder
	await fs.promises.mkdir(target, { recursive: true, mode });

	// Copy each file recursively
	const files = await readdir(source);
	for (const file of files) {
		await doCopy(join(source, file), join(target, file), payload);
	}
}

async function doCopyFile(source: string, target: string, mode: number): Promise<void> {

	// Copy file
	await fs.promises.copyFile(source, target);

	// restore mode (https://github.com/nodejs/node/issues/1104)
	await fs.promises.chmod(target, mode);
}

async function doCopySymlink(source: string, target: string, payload: ICopyPayload): Promise<void> {

	// Figure out link target
	let linkTarget = await fs.promises.readlink(source);

	// Special case: the symlink points to a target that is
	// actually within the path that is being copied. In that
	// case we want the symlink to point to the target and
	// not the source
	if (isEqualOrParent(linkTarget, payload.root.source, !isLinux)) {
		linkTarget = join(payload.root.target, linkTarget.substr(payload.root.source.length + 1));
	}

	// Create symlink
	await fs.promises.symlink(linkTarget, target);
}

//#endregion

//#region Path resolvers

/**
 * Given an absolute, normalized, and existing file path 'realcase' returns the
 * exact path that the file has on disk.
 * On a case insensitive file system, the returned path might differ from the original
 * path by character casing.
 * On a case sensitive file system, the returned path will always be identical to the
 * original path.
 * In case of errors, null is returned. But you cannot use this function to verify that
 * a path exists.
 *
 * realcase does not handle '..' or '.' path segments and it does not take the locale into account.
 */
export async function realcase(path: string, token?: CancellationToken): Promise<string | null> {
	if (isLinux) {
		// This method is unsupported on OS that have case sensitive
		// file system where the same path can exist in different forms
		// (see also https://github.com/microsoft/vscode/issues/139709)
		return path;
	}

	const dir = dirname(path);
	if (path === dir) {	// end recursion
		return path;
	}

	const name = (basename(path) /* can be '' for windows drive letters */ || path).toLowerCase();
	try {
		if (token?.isCancellationRequested) {
			return null;
		}

		const entries = await Promises.readdir(dir);
		const found = entries.filter(e => e.toLowerCase() === name);	// use a case insensitive search
		if (found.length === 1) {
			// on a case sensitive filesystem we cannot determine here, whether the file exists or not, hence we need the 'file exists' precondition
			const prefix = await realcase(dir, token);   // recurse
			if (prefix) {
				return join(prefix, found[0]);
			}
		} else if (found.length > 1) {
			// must be a case sensitive $filesystem
			const ix = found.indexOf(name);
			if (ix >= 0) {	// case sensitive
				const prefix = await realcase(dir, token);   // recurse
				if (prefix) {
					return join(prefix, found[ix]);
				}
			}
		}
	} catch {
		// silently ignore error
	}

	return null;
}

async function realpath(path: string): Promise<string> {
	try {
		// DO NOT USE `fs.promises.realpath` here as it internally
		// calls `fs.native.realpath` which will result in subst
		// drives to be resolved to their target on Windows
		// https://github.com/microsoft/vscode/issues/118562
		return await promisify(fs.realpath)(path);
	} catch {

		// We hit an error calling fs.realpath(). Since fs.realpath() is doing some path normalization
		// we now do a similar normalization and then try again if we can access the path with read
		// permissions at least. If that succeeds, we return that path.
		// fs.realpath() is resolving symlinks and that can fail in certain cases. The workaround is
		// to not resolve links but to simply see if the path is read accessible or not.
		const normalizedPath = normalizePath(path);

		await fs.promises.access(normalizedPath, fs.constants.R_OK);

		return normalizedPath;
	}
}

/**
 * @deprecated always prefer async variants over sync!
 */
export function realpathSync(path: string): string {
	try {
		return fs.realpathSync(path);
	} catch {

		// We hit an error calling fs.realpathSync(). Since fs.realpathSync() is doing some path normalization
		// we now do a similar normalization and then try again if we can access the path with read
		// permissions at least. If that succeeds, we return that path.
		// fs.realpath() is resolving symlinks and that can fail in certain cases. The workaround is
		// to not resolve links but to simply see if the path is read accessible or not.
		const normalizedPath = normalizePath(path);

		fs.accessSync(normalizedPath, fs.constants.R_OK); // throws in case of an error

		return normalizedPath;
	}
}

function normalizePath(path: string): string {
	return rtrim(normalize(path), sep);
}

//#endregion

//#region Promise based fs methods

/**
 * Some low level `fs` methods provided as `Promises` similar to
 * `fs.promises` but with notable differences, either implemented
 * by us or by restoring the original callback based behavior.
 *
 * At least `realpath` is implemented differently in the promise
 * based implementation compared to the callback based one. The
 * promise based implementation actually calls `fs.realpath.native`.
 * (https://github.com/microsoft/vscode/issues/118562)
 */
export const Promises = new class {

	//#region Implemented by node.js

	get read() {

		// Not using `promisify` here for a reason: the return
		// type is not an object as indicated by TypeScript but
		// just the bytes read, so we create our own wrapper.

		return (fd: number, buffer: Uint8Array, offset: number, length: number, position: number | null) => {
			return new Promise<{ bytesRead: number; buffer: Uint8Array }>((resolve, reject) => {
				fs.read(fd, buffer, offset, length, position, (err, bytesRead, buffer) => {
					if (err) {
						return reject(err);
					}

					return resolve({ bytesRead, buffer });
				});
			});
		};
	}

	get write() {

		// Not using `promisify` here for a reason: the return
		// type is not an object as indicated by TypeScript but
		// just the bytes written, so we create our own wrapper.

		return (fd: number, buffer: Uint8Array, offset: number | undefined | null, length: number | undefined | null, position: number | undefined | null) => {
			return new Promise<{ bytesWritten: number; buffer: Uint8Array }>((resolve, reject) => {
				fs.write(fd, buffer, offset, length, position, (err, bytesWritten, buffer) => {
					if (err) {
						return reject(err);
					}

					return resolve({ bytesWritten, buffer });
				});
			});
		};
	}

	get fdatasync() { return promisify(fs.fdatasync); } // not exposed as API in 22.x yet

	get open() { return promisify(fs.open); } 			// changed to return `FileHandle` in promise API
	get close() { return promisify(fs.close); } 		// not exposed as API due to the `FileHandle` return type of `open`

	get ftruncate() { return promisify(fs.ftruncate); } // not exposed as API in 22.x yet

	//#endregion

	//#region Implemented by us

	async exists(path: string): Promise<boolean> {
		try {
			await fs.promises.access(path);

			return true;
		} catch {
			return false;
		}
	}

	get readdir() { return readdir; }
	get readDirsInDir() { return readDirsInDir; }

	get writeFile() { return writeFile; }

	get rm() { return rimraf; }

	get rename() { return rename; }
	get copy() { return copy; }

	get realpath() { return realpath; }	// `fs.promises.realpath` will use `fs.realpath.native` which we do not want

	//#endregion
};

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/node/ports.ts]---
Location: vscode-main/src/vs/base/node/ports.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as net from 'net';

/**
 * Given a start point and a max number of retries, will find a port that
 * is openable. Will return 0 in case no free port can be found.
 */
export function findFreePort(startPort: number, giveUpAfter: number, timeout: number, stride = 1): Promise<number> {
	let done = false;

	return new Promise(resolve => {
		const timeoutHandle = setTimeout(() => {
			if (!done) {
				done = true;
				return resolve(0);
			}
		}, timeout);

		doFindFreePort(startPort, giveUpAfter, stride, (port) => {
			if (!done) {
				done = true;
				clearTimeout(timeoutHandle);
				return resolve(port);
			}
		});
	});
}

function doFindFreePort(startPort: number, giveUpAfter: number, stride: number, clb: (port: number) => void): void {
	if (giveUpAfter === 0) {
		return clb(0);
	}

	const client = new net.Socket();

	// If we can connect to the port it means the port is already taken so we continue searching
	client.once('connect', () => {
		dispose(client);

		return doFindFreePort(startPort + stride, giveUpAfter - 1, stride, clb);
	});

	client.once('data', () => {
		// this listener is required since node.js 8.x
	});

	client.once('error', (err: Error & { code?: string }) => {
		dispose(client);

		// If we receive any non ECONNREFUSED error, it means the port is used but we cannot connect
		if (err.code !== 'ECONNREFUSED') {
			return doFindFreePort(startPort + stride, giveUpAfter - 1, stride, clb);
		}

		// Otherwise it means the port is free to use!
		return clb(startPort);
	});

	client.connect(startPort, '127.0.0.1');
}

// Reference: https://chromium.googlesource.com/chromium/src.git/+/refs/heads/main/net/base/port_util.cc#56
export const BROWSER_RESTRICTED_PORTS: Record<number, boolean> = {
	1: true,      // tcpmux
	7: true,      // echo
	9: true,      // discard
	11: true,     // systat
	13: true,     // daytime
	15: true,     // netstat
	17: true,     // qotd
	19: true,     // chargen
	20: true,     // ftp data
	21: true,     // ftp access
	22: true,     // ssh
	23: true,     // telnet
	25: true,     // smtp
	37: true,     // time
	42: true,     // name
	43: true,     // nicname
	53: true,     // domain
	69: true,     // tftp
	77: true,     // priv-rjs
	79: true,     // finger
	87: true,     // ttylink
	95: true,     // supdup
	101: true,    // hostriame
	102: true,    // iso-tsap
	103: true,    // gppitnp
	104: true,    // acr-nema
	109: true,    // pop2
	110: true,    // pop3
	111: true,    // sunrpc
	113: true,    // auth
	115: true,    // sftp
	117: true,    // uucp-path
	119: true,    // nntp
	123: true,    // NTP
	135: true,    // loc-srv /epmap
	137: true,    // netbios
	139: true,    // netbios
	143: true,    // imap2
	161: true,    // snmp
	179: true,    // BGP
	389: true,    // ldap
	427: true,    // SLP (Also used by Apple Filing Protocol)
	465: true,    // smtp+ssl
	512: true,    // print / exec
	513: true,    // login
	514: true,    // shell
	515: true,    // printer
	526: true,    // tempo
	530: true,    // courier
	531: true,    // chat
	532: true,    // netnews
	540: true,    // uucp
	548: true,    // AFP (Apple Filing Protocol)
	554: true,    // rtsp
	556: true,    // remotefs
	563: true,    // nntp+ssl
	587: true,    // smtp (rfc6409)
	601: true,    // syslog-conn (rfc3195)
	636: true,    // ldap+ssl
	989: true,    // ftps-data
	990: true,    // ftps
	993: true,    // ldap+ssl
	995: true,    // pop3+ssl
	1719: true,   // h323gatestat
	1720: true,   // h323hostcall
	1723: true,   // pptp
	2049: true,   // nfs
	3659: true,   // apple-sasl / PasswordServer
	4045: true,   // lockd
	5060: true,   // sip
	5061: true,   // sips
	6000: true,   // X11
	6566: true,   // sane-port
	6665: true,   // Alternate IRC [Apple addition]
	6666: true,   // Alternate IRC [Apple addition]
	6667: true,   // Standard IRC [Apple addition]
	6668: true,   // Alternate IRC [Apple addition]
	6669: true,   // Alternate IRC [Apple addition]
	6697: true,   // IRC + TLS
	10080: true   // Amanda
};

export function isPortFree(port: number, timeout: number): Promise<boolean> {
	return findFreePortFaster(port, 0, timeout).then(port => port !== 0);
}

interface ServerError {
	code?: string;
}

/**
 * Uses listen instead of connect. Is faster, but if there is another listener on 0.0.0.0 then this will take 127.0.0.1 from that listener.
 */
export function findFreePortFaster(startPort: number, giveUpAfter: number, timeout: number, hostname: string = '127.0.0.1'): Promise<number> {
	let resolved: boolean = false;
	let timeoutHandle: Timeout | undefined = undefined;
	let countTried: number = 1;
	const server = net.createServer({ pauseOnConnect: true });
	function doResolve(port: number, resolve: (port: number) => void) {
		if (!resolved) {
			resolved = true;
			server.removeAllListeners();
			server.close();
			if (timeoutHandle) {
				clearTimeout(timeoutHandle);
			}
			resolve(port);
		}
	}
	return new Promise<number>(resolve => {
		timeoutHandle = setTimeout(() => {
			doResolve(0, resolve);
		}, timeout);

		server.on('listening', () => {
			doResolve(startPort, resolve);
		});
		server.on('error', (err: ServerError) => {
			if (err && (err.code === 'EADDRINUSE' || err.code === 'EACCES') && (countTried < giveUpAfter)) {
				startPort++;
				countTried++;
				server.listen(startPort, hostname);
			} else {
				doResolve(0, resolve);
			}
		});
		server.on('close', () => {
			doResolve(0, resolve);
		});
		server.listen(startPort, hostname);
	});
}

function dispose(socket: net.Socket): void {
	try {
		socket.removeAllListeners('connect');
		socket.removeAllListeners('error');
		socket.end();
		socket.destroy();
		socket.unref();
	} catch (error) {
		console.error(error); // otherwise this error would get lost in the callback chain
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/node/powershell.ts]---
Location: vscode-main/src/vs/base/node/powershell.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as os from 'os';
import * as path from '../common/path.js';
import * as pfs from './pfs.js';

// This is required, since parseInt("7-preview") will return 7.
const IntRegex: RegExp = /^\d+$/;

const PwshMsixRegex: RegExp = /^Microsoft.PowerShell_.*/;
const PwshPreviewMsixRegex: RegExp = /^Microsoft.PowerShellPreview_.*/;

const enum Arch {
	x64,
	x86,
	ARM
}

let processArch: Arch;
switch (process.arch) {
	case 'ia32':
		processArch = Arch.x86;
		break;
	case 'arm':
	case 'arm64':
		processArch = Arch.ARM;
		break;
	default:
		processArch = Arch.x64;
		break;
}

/*
Currently, here are the values for these environment variables on their respective archs:

On x86 process on x86:
PROCESSOR_ARCHITECTURE is X86
PROCESSOR_ARCHITEW6432 is undefined

On x86 process on x64:
PROCESSOR_ARCHITECTURE is X86
PROCESSOR_ARCHITEW6432 is AMD64

On x64 process on x64:
PROCESSOR_ARCHITECTURE is AMD64
PROCESSOR_ARCHITEW6432 is undefined

On ARM process on ARM:
PROCESSOR_ARCHITECTURE is ARM64
PROCESSOR_ARCHITEW6432 is undefined

On x86 process on ARM:
PROCESSOR_ARCHITECTURE is X86
PROCESSOR_ARCHITEW6432 is ARM64

On x64 process on ARM:
PROCESSOR_ARCHITECTURE is ARM64
PROCESSOR_ARCHITEW6432 is undefined
*/
let osArch: Arch;
if (process.env['PROCESSOR_ARCHITEW6432']) {
	osArch = process.env['PROCESSOR_ARCHITEW6432'] === 'ARM64'
		? Arch.ARM
		: Arch.x64;
} else if (process.env['PROCESSOR_ARCHITECTURE'] === 'ARM64') {
	osArch = Arch.ARM;
} else if (process.env['PROCESSOR_ARCHITECTURE'] === 'X86') {
	osArch = Arch.x86;
} else {
	osArch = Arch.x64;
}

export interface IPowerShellExeDetails {
	readonly displayName: string;
	readonly exePath: string;
}

interface IPossiblePowerShellExe extends IPowerShellExeDetails {
	exists(): Promise<boolean>;
}

class PossiblePowerShellExe implements IPossiblePowerShellExe {
	constructor(
		public readonly exePath: string,
		public readonly displayName: string,
		private knownToExist?: boolean) { }

	public async exists(): Promise<boolean> {
		if (this.knownToExist === undefined) {
			this.knownToExist = await pfs.SymlinkSupport.existsFile(this.exePath);
		}
		return this.knownToExist;
	}
}

function getProgramFilesPath(
	{ useAlternateBitness = false }: { useAlternateBitness?: boolean } = {}): string | null {

	if (!useAlternateBitness) {
		// Just use the native system bitness
		return process.env.ProgramFiles || null;
	}

	// We might be a 64-bit process looking for 32-bit program files
	if (processArch === Arch.x64) {
		return process.env['ProgramFiles(x86)'] || null;
	}

	// We might be a 32-bit process looking for 64-bit program files
	if (osArch === Arch.x64) {
		return process.env.ProgramW6432 || null;
	}

	// We're a 32-bit process on 32-bit Windows, there is no other Program Files dir
	return null;
}

async function findPSCoreWindowsInstallation(
	{ useAlternateBitness = false, findPreview = false }:
		{ useAlternateBitness?: boolean; findPreview?: boolean } = {}): Promise<IPossiblePowerShellExe | null> {

	const programFilesPath = getProgramFilesPath({ useAlternateBitness });
	if (!programFilesPath) {
		return null;
	}

	const powerShellInstallBaseDir = path.join(programFilesPath, 'PowerShell');

	// Ensure the base directory exists
	if (!await pfs.SymlinkSupport.existsDirectory(powerShellInstallBaseDir)) {
		return null;
	}

	let highestSeenVersion: number = -1;
	let pwshExePath: string | null = null;
	for (const item of await pfs.Promises.readdir(powerShellInstallBaseDir)) {

		let currentVersion: number = -1;
		if (findPreview) {
			// We are looking for something like "7-preview"

			// Preview dirs all have dashes in them
			const dashIndex = item.indexOf('-');
			if (dashIndex < 0) {
				continue;
			}

			// Verify that the part before the dash is an integer
			// and that the part after the dash is "preview"
			const intPart: string = item.substring(0, dashIndex);
			if (!IntRegex.test(intPart) || item.substring(dashIndex + 1) !== 'preview') {
				continue;
			}

			currentVersion = parseInt(intPart, 10);
		} else {
			// Search for a directory like "6" or "7"
			if (!IntRegex.test(item)) {
				continue;
			}

			currentVersion = parseInt(item, 10);
		}

		// Ensure we haven't already seen a higher version
		if (currentVersion <= highestSeenVersion) {
			continue;
		}

		// Now look for the file
		const exePath = path.join(powerShellInstallBaseDir, item, 'pwsh.exe');
		if (!await pfs.SymlinkSupport.existsFile(exePath)) {
			continue;
		}

		pwshExePath = exePath;
		highestSeenVersion = currentVersion;
	}

	if (!pwshExePath) {
		return null;
	}

	const bitness: string = programFilesPath.includes('x86') ? ' (x86)' : '';
	const preview: string = findPreview ? ' Preview' : '';

	return new PossiblePowerShellExe(pwshExePath, `PowerShell${preview}${bitness}`, true);
}

async function findPSCoreMsix({ findPreview }: { findPreview?: boolean } = {}): Promise<IPossiblePowerShellExe | null> {
	// We can't proceed if there's no LOCALAPPDATA path
	if (!process.env.LOCALAPPDATA) {
		return null;
	}

	// Find the base directory for MSIX application exe shortcuts
	const msixAppDir = path.join(process.env.LOCALAPPDATA, 'Microsoft', 'WindowsApps');

	if (!await pfs.SymlinkSupport.existsDirectory(msixAppDir)) {
		return null;
	}

	// Define whether we're looking for the preview or the stable
	const { pwshMsixDirRegex, pwshMsixName } = findPreview
		? { pwshMsixDirRegex: PwshPreviewMsixRegex, pwshMsixName: 'PowerShell Preview (Store)' }
		: { pwshMsixDirRegex: PwshMsixRegex, pwshMsixName: 'PowerShell (Store)' };

	// We should find only one such application, so return on the first one
	for (const subdir of await pfs.Promises.readdir(msixAppDir)) {
		if (pwshMsixDirRegex.test(subdir)) {
			const pwshMsixPath = path.join(msixAppDir, subdir, 'pwsh.exe');
			return new PossiblePowerShellExe(pwshMsixPath, pwshMsixName);
		}
	}

	// If we find nothing, return null
	return null;
}

function findPSCoreDotnetGlobalTool(): IPossiblePowerShellExe {
	const dotnetGlobalToolExePath: string = path.join(os.homedir(), '.dotnet', 'tools', 'pwsh.exe');

	return new PossiblePowerShellExe(dotnetGlobalToolExePath, '.NET Core PowerShell Global Tool');
}

function findPSCoreScoopInstallation(): IPossiblePowerShellExe {
	const scoopAppsDir = path.join(os.homedir(), 'scoop', 'apps');
	const scoopPwsh = path.join(scoopAppsDir, 'pwsh', 'current', 'pwsh.exe');

	return new PossiblePowerShellExe(scoopPwsh, 'PowerShell (Scoop)');
}

function findWinPS(): IPossiblePowerShellExe | null {
	const winPSPath = path.join(
		process.env.windir!,
		processArch === Arch.x86 && osArch !== Arch.x86 ? 'SysNative' : 'System32',
		'WindowsPowerShell', 'v1.0', 'powershell.exe');

	return new PossiblePowerShellExe(winPSPath, 'Windows PowerShell', true);
}

/**
 * Iterates through all the possible well-known PowerShell installations on a machine.
 * Returned values may not exist, but come with an .exists property
 * which will check whether the executable exists.
 */
async function* enumerateDefaultPowerShellInstallations(): AsyncIterable<IPossiblePowerShellExe> {
	// Find PSCore stable first
	let pwshExe = await findPSCoreWindowsInstallation();
	if (pwshExe) {
		yield pwshExe;
	}

	// Windows may have a 32-bit pwsh.exe
	pwshExe = await findPSCoreWindowsInstallation({ useAlternateBitness: true });
	if (pwshExe) {
		yield pwshExe;
	}

	// Also look for the MSIX/UWP installation
	pwshExe = await findPSCoreMsix();
	if (pwshExe) {
		yield pwshExe;
	}

	// Look for the .NET global tool
	// Some older versions of PowerShell have a bug in this where startup will fail,
	// but this is fixed in newer versions
	pwshExe = findPSCoreDotnetGlobalTool();
	if (pwshExe) {
		yield pwshExe;
	}

	// Look for PSCore preview
	pwshExe = await findPSCoreWindowsInstallation({ findPreview: true });
	if (pwshExe) {
		yield pwshExe;
	}

	// Find a preview MSIX
	pwshExe = await findPSCoreMsix({ findPreview: true });
	if (pwshExe) {
		yield pwshExe;
	}

	// Look for pwsh-preview with the opposite bitness
	pwshExe = await findPSCoreWindowsInstallation({ useAlternateBitness: true, findPreview: true });
	if (pwshExe) {
		yield pwshExe;
	}

	pwshExe = await findPSCoreScoopInstallation();
	if (pwshExe) {
		yield pwshExe;
	}

	// Finally, get Windows PowerShell
	pwshExe = findWinPS();
	if (pwshExe) {
		yield pwshExe;
	}
}

/**
 * Iterates through PowerShell installations on the machine according
 * to configuration passed in through the constructor.
 * PowerShell items returned by this object are verified
 * to exist on the filesystem.
 */
export async function* enumeratePowerShellInstallations(): AsyncIterable<IPowerShellExeDetails> {
	// Get the default PowerShell installations first
	for await (const defaultPwsh of enumerateDefaultPowerShellInstallations()) {
		if (await defaultPwsh.exists()) {
			yield defaultPwsh;
		}
	}
}

/**
* Returns the first available PowerShell executable found in the search order.
*/
export async function getFirstAvailablePowerShellInstallation(): Promise<IPowerShellExeDetails | null> {
	for await (const pwsh of enumeratePowerShellInstallations()) {
		return pwsh;
	}
	return null;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/node/processes.ts]---
Location: vscode-main/src/vs/base/node/processes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as cp from 'child_process';
import { Stats, promises } from 'fs';
import { getCaseInsensitive } from '../common/objects.js';
import * as path from '../common/path.js';
import * as Platform from '../common/platform.js';
import * as processCommon from '../common/process.js';
import { CommandOptions, ForkOptions, Source, SuccessData, TerminateResponse, TerminateResponseCode } from '../common/processes.js';
import * as Types from '../common/types.js';
import * as pfs from './pfs.js';
import { FileAccess } from '../common/network.js';
import Stream from 'stream';
export { Source, TerminateResponseCode, type CommandOptions, type ForkOptions, type SuccessData, type TerminateResponse };

export type ValueCallback<T> = (value: T | Promise<T>) => void;
export type ErrorCallback = (error?: any) => void;
export type ProgressCallback<T> = (progress: T) => void;


export function getWindowsShell(env = processCommon.env): string {
	return env['comspec'] || 'cmd.exe';
}

export interface IQueuedSender {
	send: (msg: any) => void;
}

// Wrapper around process.send() that will queue any messages if the internal node.js
// queue is filled with messages and only continue sending messages when the internal
// queue is free again to consume messages.
// On Windows we always wait for the send() method to return before sending the next message
// to workaround https://github.com/nodejs/node/issues/7657 (IPC can freeze process)
export function createQueuedSender(childProcess: cp.ChildProcess): IQueuedSender {
	let msgQueue: string[] = [];
	let useQueue = false;

	const send = function (msg: any): void {
		if (useQueue) {
			msgQueue.push(msg); // add to the queue if the process cannot handle more messages
			return;
		}

		const result = childProcess.send(msg, (error: Error | null) => {
			if (error) {
				console.error(error); // unlikely to happen, best we can do is log this error
			}

			useQueue = false; // we are good again to send directly without queue

			// now send all the messages that we have in our queue and did not send yet
			if (msgQueue.length > 0) {
				const msgQueueCopy = msgQueue.slice(0);
				msgQueue = [];
				msgQueueCopy.forEach(entry => send(entry));
			}
		});

		if (!result || Platform.isWindows /* workaround https://github.com/nodejs/node/issues/7657 */) {
			useQueue = true;
		}
	};

	return { send };
}

async function fileExistsDefault(path: string): Promise<boolean> {
	if (await pfs.Promises.exists(path)) {
		let statValue: Stats | undefined;
		try {
			statValue = await promises.stat(path);
		} catch (e) {
			if (e.message.startsWith('EACCES')) {
				// it might be symlink
				statValue = await promises.lstat(path);
			}
		}
		return statValue ? !statValue.isDirectory() : false;
	}
	return false;
}

export async function findExecutable(command: string, cwd?: string, paths?: string[], env: Platform.IProcessEnvironment = processCommon.env, fileExists: (path: string) => Promise<boolean> = fileExistsDefault): Promise<string | undefined> {
	// If we have an absolute path then we take it.
	if (path.isAbsolute(command)) {
		return await fileExists(command) ? command : undefined;
	}
	if (cwd === undefined) {
		cwd = processCommon.cwd();
	}
	const dir = path.dirname(command);
	if (dir !== '.') {
		// We have a directory and the directory is relative (see above). Make the path absolute
		// to the current working directory.
		const fullPath = path.join(cwd, command);
		return await fileExists(fullPath) ? fullPath : undefined;
	}
	const envPath = getCaseInsensitive(env, 'PATH');
	if (paths === undefined && Types.isString(envPath)) {
		paths = envPath.split(path.delimiter);
	}
	// No PATH environment. Make path absolute to the cwd.
	if (paths === undefined || paths.length === 0) {
		const fullPath = path.join(cwd, command);
		return await fileExists(fullPath) ? fullPath : undefined;
	}

	// We have a simple file name. We get the path variable from the env
	// and try to find the executable on the path.
	for (const pathEntry of paths) {
		// The path entry is absolute.
		let fullPath: string;
		if (path.isAbsolute(pathEntry)) {
			fullPath = path.join(pathEntry, command);
		} else {
			fullPath = path.join(cwd, pathEntry, command);
		}
		if (Platform.isWindows) {
			const pathExt = getCaseInsensitive(env, 'PATHEXT') as string || '.COM;.EXE;.BAT;.CMD';
			const pathExtsFound = pathExt.split(';').map(async ext => {
				const withExtension = fullPath + ext;
				return await fileExists(withExtension) ? withExtension : undefined;
			});
			for (const foundPromise of pathExtsFound) {
				const found = await foundPromise;
				if (found) {
					return found;
				}
			}
		}

		if (await fileExists(fullPath)) {
			return fullPath;
		}
	}
	const fullPath = path.join(cwd, command);
	return await fileExists(fullPath) ? fullPath : undefined;
}

/**
 * Kills a process and all its children.
 * @param pid the process id to kill
 * @param forceful whether to forcefully kill the process (default: false). Note
 * that on Windows, terminal processes can _only_ be killed forcefully and this
 * will throw when not forceful.
 */
export async function killTree(pid: number, forceful = false) {
	let child: cp.ChildProcessByStdio<null, Stream.Readable, Stream.Readable>;
	if (Platform.isWindows) {
		const windir = process.env['WINDIR'] || 'C:\\Windows';
		const taskKill = path.join(windir, 'System32', 'taskkill.exe');

		const args = ['/T'];
		if (forceful) {
			args.push('/F');
		}
		args.push('/PID', String(pid));
		child = cp.spawn(taskKill, args, { stdio: ['ignore', 'pipe', 'pipe'] });
	} else {
		const killScript = FileAccess.asFileUri('vs/base/node/terminateProcess.sh').fsPath;
		child = cp.spawn('/bin/sh', [killScript, String(pid), forceful ? '9' : '15'], { stdio: ['ignore', 'pipe', 'pipe'] });
	}

	return new Promise<void>((resolve, reject) => {
		const stdout: Buffer[] = [];
		child.stdout.on('data', (data) => stdout.push(data));
		child.stderr.on('data', (data) => stdout.push(data));
		child.on('error', reject);
		child.on('exit', (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`taskkill exited with code ${code}: ${Buffer.concat(stdout).toString()}`));
			}
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/node/ps.sh]---
Location: vscode-main/src/vs/base/node/ps.sh

```bash
#!/bin/sh
PAGESIZE=`getconf PAGESIZE`;
TOTAL_MEMORY=`cat /proc/meminfo | head -n 1 | awk '{print $2}'`;

# Mimic the output of ps -ax -o pid=,ppid=,pcpu=,pmem=,command=
# Read all numeric subdirectories in /proc
for pid in `cd /proc && ls -d [0-9]*`
	do {
		if [ -e /proc/$pid/stat ]
		then
			echo $pid;

			# ppid is the word at index 4 in the stat file for the process
			awk '{print $4}' /proc/$pid/stat;

			# pcpu - calculation will be done later, this is a placeholder value
			echo "0.0"

			# pmem - ratio of the process's working set size to total memory.
			# use the page size to convert to bytes, total memory is in KB
			# multiplied by 100 to get percentage, extra 10 to be able to move
			# the decimal over by one place
			RESIDENT_SET_SIZE=`awk '{print $24}' /proc/$pid/stat`;
			PERCENT_MEMORY=$(((1000 * $PAGESIZE * $RESIDENT_SET_SIZE) / ($TOTAL_MEMORY * 1024)));
			if [ $PERCENT_MEMORY -lt 10 ]
			then
				# replace the last character with 0. the last character
				echo $PERCENT_MEMORY | sed 's/.$/0.&/'; #pmem
			else
				# insert . before the last character
				echo $PERCENT_MEMORY | sed 's/.$/.&/';
			fi

			# cmdline
			xargs -0 < /proc/$pid/cmdline;
		fi
	} | tr "\n" "\t"; # Replace newlines with tab so that all info for a process is shown on one line
	echo; # But add new lines between processes
done
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/node/ps.ts]---
Location: vscode-main/src/vs/base/node/ps.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { exec } from 'child_process';
import { totalmem } from 'os';
import { FileAccess } from '../common/network.js';
import { ProcessItem } from '../common/processes.js';
import { isWindows } from '../common/platform.js';

export const JS_FILENAME_PATTERN = /[a-zA-Z-]+\.js\b/g;

export function listProcesses(rootPid: number): Promise<ProcessItem> {
	return new Promise((resolve, reject) => {
		let rootItem: ProcessItem | undefined;
		const map = new Map<number, ProcessItem>();
		const totalMemory = totalmem();

		function addToTree(pid: number, ppid: number, cmd: string, load: number, mem: number) {
			const parent = map.get(ppid);
			if (pid === rootPid || parent) {
				const item: ProcessItem = {
					name: findName(cmd),
					cmd,
					pid,
					ppid,
					load,
					mem: isWindows ? mem : (totalMemory * (mem / 100))
				};
				map.set(pid, item);

				if (pid === rootPid) {
					rootItem = item;
				}

				if (parent) {
					if (!parent.children) {
						parent.children = [];
					}
					parent.children.push(item);
					if (parent.children.length > 1) {
						parent.children = parent.children.sort((a, b) => a.pid - b.pid);
					}
				}
			}
		}

		function findName(cmd: string): string {
			const UTILITY_NETWORK_HINT = /--utility-sub-type=network/i;
			const WINDOWS_CRASH_REPORTER = /--crashes-directory/i;
			const WINPTY = /\\pipe\\winpty-control/i;
			const CONPTY = /conhost\.exe.+--headless/i;
			const TYPE = /--type=([a-zA-Z-]+)/;

			// find windows crash reporter
			if (WINDOWS_CRASH_REPORTER.exec(cmd)) {
				return 'electron-crash-reporter';
			}

			// find winpty process
			if (WINPTY.exec(cmd)) {
				return 'winpty-agent';
			}

			// find conpty process
			if (CONPTY.exec(cmd)) {
				return 'conpty-agent';
			}

			// find "--type=xxxx"
			let matches = TYPE.exec(cmd);
			if (matches && matches.length === 2) {
				if (matches[1] === 'renderer') {
					return `window`;
				} else if (matches[1] === 'utility') {
					if (UTILITY_NETWORK_HINT.exec(cmd)) {
						return 'utility-network-service';
					}

					return 'utility-process';
				} else if (matches[1] === 'extensionHost') {
					return 'extension-host'; // normalize remote extension host type
				}
				return matches[1];
			}

			if (cmd.indexOf('node ') < 0 && cmd.indexOf('node.exe') < 0) {
				let result = ''; // find all xyz.js
				do {
					matches = JS_FILENAME_PATTERN.exec(cmd);
					if (matches) {
						result += matches + ' ';
					}
				} while (matches);

				if (result) {
					return `electron-nodejs (${result.trim()})`;
				}
			}

			return cmd;
		}

		if (process.platform === 'win32') {
			const cleanUNCPrefix = (value: string): string => {
				if (value.indexOf('\\\\?\\') === 0) {
					return value.substring(4);
				} else if (value.indexOf('\\??\\') === 0) {
					return value.substring(4);
				} else if (value.indexOf('"\\\\?\\') === 0) {
					return '"' + value.substring(5);
				} else if (value.indexOf('"\\??\\') === 0) {
					return '"' + value.substring(5);
				} else {
					return value;
				}
			};

			(import('@vscode/windows-process-tree')).then(windowsProcessTree => {
				windowsProcessTree.getProcessList(rootPid, (processList) => {
					if (!processList) {
						reject(new Error(`Root process ${rootPid} not found`));
						return;
					}
					windowsProcessTree.getProcessCpuUsage(processList, (completeProcessList) => {
						const processItems: Map<number, ProcessItem> = new Map();
						completeProcessList.forEach(process => {
							const commandLine = cleanUNCPrefix(process.commandLine || '');
							processItems.set(process.pid, {
								name: findName(commandLine),
								cmd: commandLine,
								pid: process.pid,
								ppid: process.ppid,
								load: process.cpu || 0,
								mem: process.memory || 0
							});
						});

						rootItem = processItems.get(rootPid);
						if (rootItem) {
							processItems.forEach(item => {
								const parent = processItems.get(item.ppid);
								if (parent) {
									if (!parent.children) {
										parent.children = [];
									}
									parent.children.push(item);
								}
							});

							processItems.forEach(item => {
								if (item.children) {
									item.children = item.children.sort((a, b) => a.pid - b.pid);
								}
							});
							resolve(rootItem);
						} else {
							reject(new Error(`Root process ${rootPid} not found`));
						}
					});
				}, windowsProcessTree.ProcessDataFlag.CommandLine | windowsProcessTree.ProcessDataFlag.Memory);
			});
		}

		// OS X & Linux
		else {
			function calculateLinuxCpuUsage() {

				// Flatten rootItem to get a list of all VSCode processes
				let processes = [rootItem];
				const pids: number[] = [];
				while (processes.length) {
					const process = processes.shift();
					if (process) {
						pids.push(process.pid);
						if (process.children) {
							processes = processes.concat(process.children);
						}
					}
				}

				// The cpu usage value reported on Linux is the average over the process lifetime,
				// recalculate the usage over a one second interval
				// JSON.stringify is needed to escape spaces, https://github.com/nodejs/node/issues/6803
				let cmd = JSON.stringify(FileAccess.asFileUri('vs/base/node/cpuUsage.sh').fsPath);
				cmd += ' ' + pids.join(' ');

				exec(cmd, {}, (err, stdout, stderr) => {
					if (err || stderr) {
						reject(err || new Error(stderr.toString()));
					} else {
						const cpuUsage = stdout.toString().split('\n');
						for (let i = 0; i < pids.length; i++) {
							const processInfo = map.get(pids[i])!;
							processInfo.load = parseFloat(cpuUsage[i]);
						}

						if (!rootItem) {
							reject(new Error(`Root process ${rootPid} not found`));
							return;
						}

						resolve(rootItem);
					}
				});
			}

			exec('which ps', {}, (err, stdout, stderr) => {
				if (err || stderr) {
					if (process.platform !== 'linux') {
						reject(err || new Error(stderr.toString()));
					} else {
						const cmd = JSON.stringify(FileAccess.asFileUri('vs/base/node/ps.sh').fsPath);
						exec(cmd, {}, (err, stdout, stderr) => {
							if (err || stderr) {
								reject(err || new Error(stderr.toString()));
							} else {
								parsePsOutput(stdout, addToTree);
								calculateLinuxCpuUsage();
							}
						});
					}
				} else {
					const ps = stdout.toString().trim();
					const args = '-ax -o pid=,ppid=,pcpu=,pmem=,command=';

					// Set numeric locale to ensure '.' is used as the decimal separator
					exec(`${ps} ${args}`, { maxBuffer: 1000 * 1024, env: { LC_NUMERIC: 'en_US.UTF-8' } }, (err, stdout, stderr) => {
						// Silently ignoring the screen size is bogus error. See https://github.com/microsoft/vscode/issues/98590
						if (err || (stderr && !stderr.includes('screen size is bogus'))) {
							reject(err || new Error(stderr.toString()));
						} else {
							parsePsOutput(stdout, addToTree);

							if (process.platform === 'linux') {
								calculateLinuxCpuUsage();
							} else {
								if (!rootItem) {
									reject(new Error(`Root process ${rootPid} not found`));
								} else {
									resolve(rootItem);
								}
							}
						}
					});
				}
			});
		}
	});
}

function parsePsOutput(stdout: string, addToTree: (pid: number, ppid: number, cmd: string, load: number, mem: number) => void): void {
	const PID_CMD = /^\s*([0-9]+)\s+([0-9]+)\s+([0-9]+\.[0-9]+)\s+([0-9]+\.[0-9]+)\s+(.+)$/;
	const lines = stdout.toString().split('\n');
	for (const line of lines) {
		const matches = PID_CMD.exec(line.trim());
		if (matches && matches.length === 6) {
			addToTree(parseInt(matches[1]), parseInt(matches[2]), matches[5], parseFloat(matches[3]), parseFloat(matches[4]));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/node/shell.ts]---
Location: vscode-main/src/vs/base/node/shell.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { userInfo } from 'os';
import * as platform from '../common/platform.js';
import { getFirstAvailablePowerShellInstallation } from './powershell.js';
import * as processes from './processes.js';

/**
 * Gets the detected default shell for the _system_, not to be confused with VS Code's _default_
 * shell that the terminal uses by default.
 * @param os The platform to detect the shell of.
 */
export async function getSystemShell(os: platform.OperatingSystem, env: platform.IProcessEnvironment): Promise<string> {
	if (os === platform.OperatingSystem.Windows) {
		if (platform.isWindows) {
			return getSystemShellWindows();
		}
		// Don't detect Windows shell when not on Windows
		return processes.getWindowsShell(env);
	}

	return getSystemShellUnixLike(os, env);
}

let _TERMINAL_DEFAULT_SHELL_UNIX_LIKE: string | null = null;
function getSystemShellUnixLike(os: platform.OperatingSystem, env: platform.IProcessEnvironment): string {
	// Only use $SHELL for the current OS
	if (platform.isLinux && os === platform.OperatingSystem.Macintosh || platform.isMacintosh && os === platform.OperatingSystem.Linux) {
		return '/bin/bash';
	}

	if (!_TERMINAL_DEFAULT_SHELL_UNIX_LIKE) {
		let unixLikeTerminal: string | undefined | null;
		if (platform.isWindows) {
			unixLikeTerminal = '/bin/bash'; // for WSL
		} else {
			unixLikeTerminal = env['SHELL'];

			if (!unixLikeTerminal) {
				try {
					// It's possible for $SHELL to be unset, this API reads /etc/passwd. See https://github.com/github/codespaces/issues/1639
					// Node docs: "Throws a SystemError if a user has no username or homedir."
					unixLikeTerminal = userInfo().shell;
				} catch (err) { }
			}

			if (!unixLikeTerminal) {
				unixLikeTerminal = 'sh';
			}

			// Some systems have $SHELL set to /bin/false which breaks the terminal
			if (unixLikeTerminal === '/bin/false') {
				unixLikeTerminal = '/bin/bash';
			}
		}
		_TERMINAL_DEFAULT_SHELL_UNIX_LIKE = unixLikeTerminal;
	}
	return _TERMINAL_DEFAULT_SHELL_UNIX_LIKE;
}

let _TERMINAL_DEFAULT_SHELL_WINDOWS: string | null = null;
async function getSystemShellWindows(): Promise<string> {
	if (!_TERMINAL_DEFAULT_SHELL_WINDOWS) {
		_TERMINAL_DEFAULT_SHELL_WINDOWS = (await getFirstAvailablePowerShellInstallation())!.exePath;
	}
	return _TERMINAL_DEFAULT_SHELL_WINDOWS;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/node/terminalEncoding.ts]---
Location: vscode-main/src/vs/base/node/terminalEncoding.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * This code is also used by standalone cli's. Avoid adding dependencies to keep the size of the cli small.
 */
import { exec } from 'child_process';
import { isWindows } from '../common/platform.js';

const windowsTerminalEncodings = {
	'437': 'cp437', // United States
	'850': 'cp850', // Multilingual(Latin I)
	'852': 'cp852', // Slavic(Latin II)
	'855': 'cp855', // Cyrillic(Russian)
	'857': 'cp857', // Turkish
	'860': 'cp860', // Portuguese
	'861': 'cp861', // Icelandic
	'863': 'cp863', // Canadian - French
	'865': 'cp865', // Nordic
	'866': 'cp866', // Russian
	'869': 'cp869', // Modern Greek
	'936': 'cp936', // Simplified Chinese
	'1252': 'cp1252' // West European Latin
};

function toIconvLiteEncoding(encodingName: string): string {
	const normalizedEncodingName = encodingName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
	const mapped = JSCHARDET_TO_ICONV_ENCODINGS[normalizedEncodingName];

	return mapped || normalizedEncodingName;
}

const JSCHARDET_TO_ICONV_ENCODINGS: { [name: string]: string } = {
	'ibm866': 'cp866',
	'big5': 'cp950'
};

const UTF8 = 'utf8';

export async function resolveTerminalEncoding(verbose?: boolean): Promise<string> {
	let rawEncodingPromise: Promise<string | undefined>;

	// Support a global environment variable to win over other mechanics
	const cliEncodingEnv = process.env['VSCODE_CLI_ENCODING'];
	if (cliEncodingEnv) {
		if (verbose) {
			console.log(`Found VSCODE_CLI_ENCODING variable: ${cliEncodingEnv}`);
		}

		rawEncodingPromise = Promise.resolve(cliEncodingEnv);
	}

	// Windows: educated guess
	else if (isWindows) {
		rawEncodingPromise = new Promise<string | undefined>(resolve => {
			if (verbose) {
				console.log('Running "chcp" to detect terminal encoding...');
			}

			exec('chcp', (err, stdout, stderr) => {
				if (stdout) {
					if (verbose) {
						console.log(`Output from "chcp" command is: ${stdout}`);
					}

					const windowsTerminalEncodingKeys = Object.keys(windowsTerminalEncodings) as Array<keyof typeof windowsTerminalEncodings>;
					for (const key of windowsTerminalEncodingKeys) {
						if (stdout.indexOf(key) >= 0) {
							return resolve(windowsTerminalEncodings[key]);
						}
					}
				}

				return resolve(undefined);
			});
		});
	}
	// Linux/Mac: use "locale charmap" command
	else {
		rawEncodingPromise = new Promise<string>(resolve => {
			if (verbose) {
				console.log('Running "locale charmap" to detect terminal encoding...');
			}

			exec('locale charmap', (err, stdout, stderr) => resolve(stdout));
		});
	}

	const rawEncoding = await rawEncodingPromise;
	if (verbose) {
		console.log(`Detected raw terminal encoding: ${rawEncoding}`);
	}

	if (!rawEncoding || rawEncoding.toLowerCase() === 'utf-8' || rawEncoding.toLowerCase() === UTF8) {
		return UTF8;
	}

	return toIconvLiteEncoding(rawEncoding);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/node/terminateProcess.sh]---
Location: vscode-main/src/vs/base/node/terminateProcess.sh

```bash
#!/bin/sh

ROOT_PID=$1
SIGNAL=$2

terminateTree() {
	for cpid in $(pgrep -P $1); do
		terminateTree $cpid
	done
	kill -$SIGNAL $1 > /dev/null 2>&1
}

terminateTree $ROOT_PID
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/node/unc.ts]---
Location: vscode-main/src/vs/base/node/unc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function getUNCHostAllowlist(): string[] {
	const allowlist = processUNCHostAllowlist();
	if (allowlist) {
		return Array.from(allowlist);
	}

	return [];
}

function processUNCHostAllowlist(): Set<string> | undefined {

	// The property `process.uncHostAllowlist` is not available in official node.js
	// releases, only in our own builds, so we have to probe for availability

	return (process as unknown as { uncHostAllowlist?: Set<string> }).uncHostAllowlist;
}

export function addUNCHostToAllowlist(allowedHost: string | string[]): void {
	if (process.platform !== 'win32') {
		return;
	}

	const allowlist = processUNCHostAllowlist();
	if (allowlist) {
		if (typeof allowedHost === 'string') {
			allowlist.add(allowedHost.toLowerCase()); // UNC hosts are case-insensitive
		} else {
			for (const host of toSafeStringArray(allowedHost)) {
				addUNCHostToAllowlist(host);
			}
		}
	}
}

function toSafeStringArray(arg0: unknown): string[] {
	const allowedUNCHosts = new Set<string>();

	if (Array.isArray(arg0)) {
		for (const host of arg0) {
			if (typeof host === 'string') {
				allowedUNCHosts.add(host);
			}
		}
	}

	return Array.from(allowedUNCHosts);
}

export function getUNCHost(maybeUNCPath: string | undefined | null): string | undefined {
	if (typeof maybeUNCPath !== 'string') {
		return undefined; // require a valid string
	}

	const uncRoots = [
		'\\\\.\\UNC\\',	// DOS Device paths (https://learn.microsoft.com/en-us/dotnet/standard/io/file-path-formats)
		'\\\\?\\UNC\\',
		'\\\\'			// standard UNC path
	];

	let host = undefined;

	for (const uncRoot of uncRoots) {
		const indexOfUNCRoot = maybeUNCPath.indexOf(uncRoot);
		if (indexOfUNCRoot !== 0) {
			continue; // not matching any of our expected UNC roots
		}

		const indexOfUNCPath = maybeUNCPath.indexOf('\\', uncRoot.length);
		if (indexOfUNCPath === -1) {
			continue; // no path component found
		}

		const hostCandidate = maybeUNCPath.substring(uncRoot.length, indexOfUNCPath);
		if (hostCandidate) {
			host = hostCandidate;
			break;
		}
	}

	return host;
}

export function disableUNCAccessRestrictions(): void {
	if (process.platform !== 'win32') {
		return;
	}

	(process as unknown as { restrictUNCAccess?: boolean }).restrictUNCAccess = false;
}

export function isUNCAccessRestrictionsDisabled(): boolean {
	if (process.platform !== 'win32') {
		return true;
	}

	return (process as unknown as { restrictUNCAccess?: boolean }).restrictUNCAccess === false;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/node/zip.ts]---
Location: vscode-main/src/vs/base/node/zip.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createWriteStream, WriteStream, promises } from 'fs';
import { Readable } from 'stream';
import { createCancelablePromise, Sequencer } from '../common/async.js';
import { CancellationToken } from '../common/cancellation.js';
import * as path from '../common/path.js';
import { assertReturnsDefined } from '../common/types.js';
import { Promises } from './pfs.js';
import * as nls from '../../nls.js';
import type { Entry, ZipFile } from 'yauzl';

export const CorruptZipMessage: string = 'end of central directory record signature not found';
const CORRUPT_ZIP_PATTERN = new RegExp(CorruptZipMessage);

export interface IExtractOptions {
	overwrite?: boolean;

	/**
	 * Source path within the ZIP archive. Only the files contained in this
	 * path will be extracted.
	 */
	sourcePath?: string;
}

interface IOptions {
	sourcePathRegex: RegExp;
}

export type ExtractErrorType = 'CorruptZip' | 'Incomplete';

export class ExtractError extends Error {

	readonly type?: ExtractErrorType;

	constructor(type: ExtractErrorType | undefined, cause: Error) {
		let message = cause.message;

		switch (type) {
			case 'CorruptZip': message = `Corrupt ZIP: ${message}`; break;
		}

		super(message);
		this.type = type;
		this.cause = cause;
	}
}

function modeFromEntry(entry: Entry) {
	const attr = entry.externalFileAttributes >> 16 || 33188;

	return [448 /* S_IRWXU */, 56 /* S_IRWXG */, 7 /* S_IRWXO */]
		.map(mask => attr & mask)
		.reduce((a, b) => a + b, attr & 61440 /* S_IFMT */);
}

function toExtractError(err: Error): ExtractError {
	if (err instanceof ExtractError) {
		return err;
	}

	let type: ExtractErrorType | undefined = undefined;

	if (CORRUPT_ZIP_PATTERN.test(err.message)) {
		type = 'CorruptZip';
	}

	return new ExtractError(type, err);
}

function extractEntry(stream: Readable, fileName: string, mode: number, targetPath: string, options: IOptions, token: CancellationToken): Promise<void> {
	const dirName = path.dirname(fileName);
	const targetDirName = path.join(targetPath, dirName);
	if (!targetDirName.startsWith(targetPath)) {
		return Promise.reject(new Error(nls.localize('invalid file', "Error extracting {0}. Invalid file.", fileName)));
	}
	const targetFileName = path.join(targetPath, fileName);

	let istream: WriteStream;

	token.onCancellationRequested(() => {
		istream?.destroy();
	});

	return Promise.resolve(promises.mkdir(targetDirName, { recursive: true })).then(() => new Promise<void>((c, e) => {
		if (token.isCancellationRequested) {
			return;
		}

		try {
			istream = createWriteStream(targetFileName, { mode });
			istream.once('close', () => c());
			istream.once('error', e);
			stream.once('error', e);
			stream.pipe(istream);
		} catch (error) {
			e(error);
		}
	}));
}

function extractZip(zipfile: ZipFile, targetPath: string, options: IOptions, token: CancellationToken): Promise<void> {
	let last = createCancelablePromise<void>(() => Promise.resolve());
	let extractedEntriesCount = 0;

	const listener = token.onCancellationRequested(() => {
		last.cancel();
		zipfile.close();
	});

	return new Promise<void>((c, e) => {
		const throttler = new Sequencer();

		const readNextEntry = (token: CancellationToken) => {
			if (token.isCancellationRequested) {
				return;
			}

			extractedEntriesCount++;
			zipfile.readEntry();
		};

		zipfile.once('error', e);
		zipfile.once('close', () => last.then(() => {
			if (token.isCancellationRequested || zipfile.entryCount === extractedEntriesCount) {
				c();
			} else {
				e(new ExtractError('Incomplete', new Error(nls.localize('incompleteExtract', "Incomplete. Found {0} of {1} entries", extractedEntriesCount, zipfile.entryCount))));
			}
		}, e));
		zipfile.readEntry();
		zipfile.on('entry', (entry: Entry) => {

			if (token.isCancellationRequested) {
				return;
			}

			if (!options.sourcePathRegex.test(entry.fileName)) {
				readNextEntry(token);
				return;
			}

			const fileName = entry.fileName.replace(options.sourcePathRegex, '');

			// directory file names end with '/'
			if (/\/$/.test(fileName)) {
				const targetFileName = path.join(targetPath, fileName);
				last = createCancelablePromise(token => promises.mkdir(targetFileName, { recursive: true }).then(() => readNextEntry(token)).then(undefined, e));
				return;
			}

			const stream = openZipStream(zipfile, entry);
			const mode = modeFromEntry(entry);

			last = createCancelablePromise(token => throttler.queue(() => stream.then(stream => extractEntry(stream, fileName, mode, targetPath, options, token).then(() => readNextEntry(token)))).then(null, e));
		});
	}).finally(() => listener.dispose());
}

async function openZip(zipFile: string, lazy: boolean = false): Promise<ZipFile> {
	const { open } = await import('yauzl');

	return new Promise<ZipFile>((resolve, reject) => {
		open(zipFile, lazy ? { lazyEntries: true } : undefined!, (error: Error | null, zipfile?: ZipFile) => {
			if (error) {
				reject(toExtractError(error));
			} else {
				resolve(assertReturnsDefined(zipfile));
			}
		});
	});
}

function openZipStream(zipFile: ZipFile, entry: Entry): Promise<Readable> {
	return new Promise<Readable>((resolve, reject) => {
		zipFile.openReadStream(entry, (error: Error | null, stream?: Readable) => {
			if (error) {
				reject(toExtractError(error));
			} else {
				resolve(assertReturnsDefined(stream));
			}
		});
	});
}

export interface IFile {
	path: string;
	contents?: Buffer | string;
	localPath?: string;
}

export async function zip(zipPath: string, files: IFile[]): Promise<string> {
	const { ZipFile } = await import('yazl');

	return new Promise<string>((c, e) => {
		const zip = new ZipFile();
		files.forEach(f => {
			if (f.contents) {
				zip.addBuffer(typeof f.contents === 'string' ? Buffer.from(f.contents, 'utf8') : f.contents, f.path);
			} else if (f.localPath) {
				zip.addFile(f.localPath, f.path);
			}
		});
		zip.end();

		const zipStream = createWriteStream(zipPath);
		zip.outputStream.pipe(zipStream);

		zip.outputStream.once('error', e);
		zipStream.once('error', e);
		zipStream.once('finish', () => c(zipPath));
	});
}

export function extract(zipPath: string, targetPath: string, options: IExtractOptions = {}, token: CancellationToken): Promise<void> {
	const sourcePathRegex = new RegExp(options.sourcePath ? `^${options.sourcePath}` : '');

	let promise = openZip(zipPath, true);

	if (options.overwrite) {
		promise = promise.then(zipfile => Promises.rm(targetPath).then(() => zipfile));
	}

	return promise.then(zipfile => extractZip(zipfile, targetPath, { sourcePathRegex }, token));
}

function read(zipPath: string, filePath: string): Promise<Readable> {
	return openZip(zipPath).then(zipfile => {
		return new Promise<Readable>((c, e) => {
			zipfile.on('entry', (entry: Entry) => {
				if (entry.fileName === filePath) {
					openZipStream(zipfile, entry).then(stream => c(stream), err => e(err));
				}
			});

			zipfile.once('close', () => e(new Error(nls.localize('notFound', "{0} not found inside zip.", filePath))));
		});
	});
}

export function buffer(zipPath: string, filePath: string): Promise<Buffer> {
	return read(zipPath, filePath).then(stream => {
		return new Promise<Buffer>((c, e) => {
			const buffers: Buffer[] = [];
			stream.once('error', e);
			stream.on('data', (b: Buffer) => buffers.push(b));
			stream.on('end', () => c(Buffer.concat(buffers)));
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/contextmenu/common/contextmenu.ts]---
Location: vscode-main/src/vs/base/parts/contextmenu/common/contextmenu.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface ICommonContextMenuItem {
	label?: string;

	type?: 'normal' | 'separator' | 'submenu' | 'checkbox' | 'radio';

	accelerator?: string;

	enabled?: boolean;
	visible?: boolean;
	checked?: boolean;
}

export interface ISerializableContextMenuItem extends ICommonContextMenuItem {
	id: number;
	submenu?: ISerializableContextMenuItem[];
}

export interface IContextMenuItem extends ICommonContextMenuItem {
	click?: (event: IContextMenuEvent) => void;
	submenu?: IContextMenuItem[];
}

export interface IContextMenuEvent {
	shiftKey?: boolean;
	ctrlKey?: boolean;
	altKey?: boolean;
	metaKey?: boolean;
}

export interface IPopupOptions {
	x?: number;
	y?: number;
	positioningItem?: number;
}

export const CONTEXT_MENU_CHANNEL = 'vscode:contextmenu';
export const CONTEXT_MENU_CLOSE_CHANNEL = 'vscode:onCloseContextMenu';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/contextmenu/electron-browser/contextmenu.ts]---
Location: vscode-main/src/vs/base/parts/contextmenu/electron-browser/contextmenu.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CONTEXT_MENU_CHANNEL, CONTEXT_MENU_CLOSE_CHANNEL, IContextMenuEvent, IContextMenuItem, IPopupOptions, ISerializableContextMenuItem } from '../common/contextmenu.js';
import { ipcRenderer } from '../../sandbox/electron-browser/globals.js';

let contextMenuIdPool = 0;

export function popup(items: IContextMenuItem[], options?: IPopupOptions, onHide?: () => void): void {
	const processedItems: IContextMenuItem[] = [];

	const contextMenuId = contextMenuIdPool++;
	const onClickChannel = `vscode:onContextMenu${contextMenuId}`;
	const onClickChannelHandler = (_event: unknown, ...args: unknown[]) => {
		const itemId = args[0] as number;
		const context = args[1] as IContextMenuEvent;
		const item = processedItems[itemId];
		item.click?.(context);
	};

	ipcRenderer.once(onClickChannel, onClickChannelHandler);
	ipcRenderer.once(CONTEXT_MENU_CLOSE_CHANNEL, (_event: unknown, ...args: unknown[]) => {
		const closedContextMenuId = args[0] as number;
		if (closedContextMenuId !== contextMenuId) {
			return;
		}

		ipcRenderer.removeListener(onClickChannel, onClickChannelHandler);

		onHide?.();
	});

	ipcRenderer.send(CONTEXT_MENU_CHANNEL, contextMenuId, items.map(item => createItem(item, processedItems)), onClickChannel, options);
}

function createItem(item: IContextMenuItem, processedItems: IContextMenuItem[]): ISerializableContextMenuItem {
	const serializableItem: ISerializableContextMenuItem = {
		id: processedItems.length,
		label: item.label,
		type: item.type,
		accelerator: item.accelerator,
		checked: item.checked,
		enabled: typeof item.enabled === 'boolean' ? item.enabled : true,
		visible: typeof item.visible === 'boolean' ? item.visible : true
	};

	processedItems.push(item);

	// Submenu
	if (Array.isArray(item.submenu)) {
		serializableItem.submenu = item.submenu.map(submenuItem => createItem(submenuItem, processedItems));
	}

	return serializableItem;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/contextmenu/electron-main/contextmenu.ts]---
Location: vscode-main/src/vs/base/parts/contextmenu/electron-main/contextmenu.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IpcMainEvent, Menu, MenuItem } from 'electron';
import { validatedIpcMain } from '../../ipc/electron-main/ipcMain.js';
import { CONTEXT_MENU_CHANNEL, CONTEXT_MENU_CLOSE_CHANNEL, IPopupOptions, ISerializableContextMenuItem } from '../common/contextmenu.js';

export function registerContextMenuListener(): void {
	validatedIpcMain.on(CONTEXT_MENU_CHANNEL, (event: IpcMainEvent, contextMenuId: number, items: ISerializableContextMenuItem[], onClickChannel: string, options?: IPopupOptions) => {
		const menu = createMenu(event, onClickChannel, items);

		menu.popup({
			x: options ? options.x : undefined,
			y: options ? options.y : undefined,
			positioningItem: options ? options.positioningItem : undefined,
			callback: () => {
				// Workaround for https://github.com/microsoft/vscode/issues/72447
				// It turns out that the menu gets GC'ed if not referenced anymore
				// As such we drag it into this scope so that it is not being GC'ed
				if (menu) {
					event.sender.send(CONTEXT_MENU_CLOSE_CHANNEL, contextMenuId);
				}
			}
		});
	});
}

function createMenu(event: IpcMainEvent, onClickChannel: string, items: ISerializableContextMenuItem[]): Menu {
	const menu = new Menu();

	items.forEach(item => {
		let menuitem: MenuItem;

		// Separator
		if (item.type === 'separator') {
			menuitem = new MenuItem({
				type: item.type,
			});
		}

		// Sub Menu
		else if (Array.isArray(item.submenu)) {
			menuitem = new MenuItem({
				submenu: createMenu(event, onClickChannel, item.submenu),
				label: item.label
			});
		}

		// Normal Menu Item
		else {
			menuitem = new MenuItem({
				label: item.label,
				type: item.type,
				accelerator: item.accelerator,
				checked: item.checked,
				enabled: item.enabled,
				visible: item.visible,
				click: (menuItem, win, contextmenuEvent) => event.sender.send(onClickChannel, item.id, contextmenuEvent)
			});
		}

		menu.append(menuitem);
	});

	return menu;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/ipc/browser/ipc.mp.ts]---
Location: vscode-main/src/vs/base/parts/ipc/browser/ipc.mp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../common/lifecycle.js';
import { Client as MessagePortClient } from '../common/ipc.mp.js';

/**
 * An implementation of a `IPCClient` on top of DOM `MessagePort`.
 */
export class Client extends MessagePortClient implements IDisposable {

	/**
	 * @param clientId a way to uniquely identify this client among
	 * other clients. this is important for routing because every
	 * client can also be a server
	 */
	constructor(port: MessagePort, clientId: string) {
		super(port, clientId);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/ipc/common/ipc.electron.ts]---
Location: vscode-main/src/vs/base/parts/ipc/common/ipc.electron.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../common/buffer.js';
import { Event } from '../../../common/event.js';
import { IMessagePassingProtocol } from './ipc.js';

export interface Sender {
	send(channel: string, msg: unknown): void;
}

/**
 * The Electron `Protocol` leverages Electron style IPC communication (`ipcRenderer`, `ipcMain`)
 * for the implementation of the `IMessagePassingProtocol`. That style of API requires a channel
 * name for sending data.
 */
export class Protocol implements IMessagePassingProtocol {

	constructor(private sender: Sender, readonly onMessage: Event<VSBuffer>) { }

	send(message: VSBuffer): void {
		try {
			this.sender.send('vscode:message', message.buffer);
		} catch (e) {
			// systems are going down
		}
	}

	disconnect(): void {
		this.sender.send('vscode:disconnect', null);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/ipc/common/ipc.mp.ts]---
Location: vscode-main/src/vs/base/parts/ipc/common/ipc.mp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../common/buffer.js';
import { Event } from '../../../common/event.js';
import { IDisposable } from '../../../common/lifecycle.js';
import { IMessagePassingProtocol, IPCClient } from './ipc.js';

/**
 * Declare minimal `MessageEvent` and `MessagePort` interfaces here
 * so that this utility can be used both from `browser` and
 * `electron-main` namespace where message ports are available.
 */

export interface MessageEvent {

	/**
	 * For our use we only consider `Uint8Array` a valid data transfer
	 * via message ports because our protocol implementation is buffer based.
	 */
	data: Uint8Array;
}

export interface MessagePort {

	addEventListener(type: 'message', listener: (this: MessagePort, e: MessageEvent) => unknown): void;
	removeEventListener(type: 'message', listener: (this: MessagePort, e: MessageEvent) => unknown): void;

	postMessage(message: Uint8Array): void;

	start(): void;
	close(): void;
}

/**
 * The MessagePort `Protocol` leverages MessagePort style IPC communication
 * for the implementation of the `IMessagePassingProtocol`. That style of API
 * is a simple `onmessage` / `postMessage` pattern.
 */
export class Protocol implements IMessagePassingProtocol {

	readonly onMessage;

	constructor(private port: MessagePort) {
		this.onMessage = Event.fromDOMEventEmitter<VSBuffer>(this.port, 'message', (e: MessageEvent) => {
			if (e.data) {
				return VSBuffer.wrap(e.data);
			}
			return VSBuffer.alloc(0);
		});
		// we must call start() to ensure messages are flowing
		port.start();
	}

	send(message: VSBuffer): void {
		this.port.postMessage(message.buffer);
	}

	disconnect(): void {
		this.port.close();
	}
}

/**
 * An implementation of a `IPCClient` on top of MessagePort style IPC communication.
 */
export class Client extends IPCClient implements IDisposable {

	private protocol: Protocol;

	constructor(port: MessagePort, clientId: string) {
		const protocol = new Protocol(port);
		super(protocol, clientId);

		this.protocol = protocol;
	}

	override dispose(): void {
		this.protocol.disconnect();

		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/ipc/common/ipc.net.ts]---
Location: vscode-main/src/vs/base/parts/ipc/common/ipc.net.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../common/buffer.js';
import { Emitter, Event } from '../../../common/event.js';
import { Disposable, DisposableStore, IDisposable } from '../../../common/lifecycle.js';
import { IIPCLogger, IMessagePassingProtocol, IPCClient } from './ipc.js';

export const enum SocketDiagnosticsEventType {
	Created = 'created',
	Read = 'read',
	Write = 'write',
	Open = 'open',
	Error = 'error',
	Close = 'close',

	BrowserWebSocketBlobReceived = 'browserWebSocketBlobReceived',

	NodeEndReceived = 'nodeEndReceived',
	NodeEndSent = 'nodeEndSent',
	NodeDrainBegin = 'nodeDrainBegin',
	NodeDrainEnd = 'nodeDrainEnd',

	zlibInflateError = 'zlibInflateError',
	zlibInflateData = 'zlibInflateData',
	zlibInflateInitialWrite = 'zlibInflateInitialWrite',
	zlibInflateInitialFlushFired = 'zlibInflateInitialFlushFired',
	zlibInflateWrite = 'zlibInflateWrite',
	zlibInflateFlushFired = 'zlibInflateFlushFired',
	zlibDeflateError = 'zlibDeflateError',
	zlibDeflateData = 'zlibDeflateData',
	zlibDeflateWrite = 'zlibDeflateWrite',
	zlibDeflateFlushFired = 'zlibDeflateFlushFired',

	WebSocketNodeSocketWrite = 'webSocketNodeSocketWrite',
	WebSocketNodeSocketPeekedHeader = 'webSocketNodeSocketPeekedHeader',
	WebSocketNodeSocketReadHeader = 'webSocketNodeSocketReadHeader',
	WebSocketNodeSocketReadData = 'webSocketNodeSocketReadData',
	WebSocketNodeSocketUnmaskedData = 'webSocketNodeSocketUnmaskedData',
	WebSocketNodeSocketDrainBegin = 'webSocketNodeSocketDrainBegin',
	WebSocketNodeSocketDrainEnd = 'webSocketNodeSocketDrainEnd',

	ProtocolHeaderRead = 'protocolHeaderRead',
	ProtocolMessageRead = 'protocolMessageRead',
	ProtocolHeaderWrite = 'protocolHeaderWrite',
	ProtocolMessageWrite = 'protocolMessageWrite',
	ProtocolWrite = 'protocolWrite',
}

export namespace SocketDiagnostics {

	export const enableDiagnostics = false;

	export interface IRecord {
		timestamp: number;
		id: string;
		label: string;
		type: SocketDiagnosticsEventType;
		buff?: VSBuffer;
		data?: any;
	}

	export const records: IRecord[] = [];
	const socketIds = new WeakMap<any, string>();
	let lastUsedSocketId = 0;

	function getSocketId(nativeObject: unknown, label: string): string {
		if (!socketIds.has(nativeObject)) {
			const id = String(++lastUsedSocketId);
			socketIds.set(nativeObject, id);
		}
		return socketIds.get(nativeObject)!;
	}

	export function traceSocketEvent(nativeObject: unknown, socketDebugLabel: string, type: SocketDiagnosticsEventType, data?: VSBuffer | Uint8Array | ArrayBuffer | ArrayBufferView | any): void {
		if (!enableDiagnostics) {
			return;
		}
		const id = getSocketId(nativeObject, socketDebugLabel);

		if (data instanceof VSBuffer || data instanceof Uint8Array || data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
			const copiedData = VSBuffer.alloc(data.byteLength);
			copiedData.set(data);
			records.push({ timestamp: Date.now(), id, label: socketDebugLabel, type, buff: copiedData });
		} else {
			// data is a custom object
			records.push({ timestamp: Date.now(), id, label: socketDebugLabel, type, data: data });
		}
	}
}

export const enum SocketCloseEventType {
	NodeSocketCloseEvent = 0,
	WebSocketCloseEvent = 1
}

export interface NodeSocketCloseEvent {
	/**
	 * The type of the event
	 */
	readonly type: SocketCloseEventType.NodeSocketCloseEvent;
	/**
	 * `true` if the socket had a transmission error.
	 */
	readonly hadError: boolean;
	/**
	 * Underlying error.
	 */
	readonly error: Error | undefined;
}

export interface WebSocketCloseEvent {
	/**
	 * The type of the event
	 */
	readonly type: SocketCloseEventType.WebSocketCloseEvent;
	/**
	 * Returns the WebSocket connection close code provided by the server.
	 */
	readonly code: number;
	/**
	 * Returns the WebSocket connection close reason provided by the server.
	 */
	readonly reason: string;
	/**
	 * Returns true if the connection closed cleanly; false otherwise.
	 */
	readonly wasClean: boolean;
	/**
	 * Underlying event.
	 */
	readonly event: any | undefined;
}

export type SocketCloseEvent = NodeSocketCloseEvent | WebSocketCloseEvent | undefined;

export interface SocketTimeoutEvent {
	readonly unacknowledgedMsgCount: number;
	readonly timeSinceOldestUnacknowledgedMsg: number;
	readonly timeSinceLastReceivedSomeData: number;
}

export interface ISocket extends IDisposable {
	onData(listener: (e: VSBuffer) => void): IDisposable;
	onClose(listener: (e: SocketCloseEvent) => void): IDisposable;
	onEnd(listener: () => void): IDisposable;
	write(buffer: VSBuffer): void;
	end(): void;
	drain(): Promise<void>;

	traceSocketEvent(type: SocketDiagnosticsEventType, data?: VSBuffer | Uint8Array | ArrayBuffer | ArrayBufferView | any): void;
}

let emptyBuffer: VSBuffer | null = null;
function getEmptyBuffer(): VSBuffer {
	if (!emptyBuffer) {
		emptyBuffer = VSBuffer.alloc(0);
	}
	return emptyBuffer;
}

export class ChunkStream {

	private _chunks: VSBuffer[];
	private _totalLength: number;

	public get byteLength() {
		return this._totalLength;
	}

	constructor() {
		this._chunks = [];
		this._totalLength = 0;
	}

	public acceptChunk(buff: VSBuffer) {
		this._chunks.push(buff);
		this._totalLength += buff.byteLength;
	}

	public read(byteCount: number): VSBuffer {
		return this._read(byteCount, true);
	}

	public peek(byteCount: number): VSBuffer {
		return this._read(byteCount, false);
	}

	private _read(byteCount: number, advance: boolean): VSBuffer {

		if (byteCount === 0) {
			return getEmptyBuffer();
		}

		if (byteCount > this._totalLength) {
			throw new Error(`Cannot read so many bytes!`);
		}

		if (this._chunks[0].byteLength === byteCount) {
			// super fast path, precisely first chunk must be returned
			const result = this._chunks[0];
			if (advance) {
				this._chunks.shift();
				this._totalLength -= byteCount;
			}
			return result;
		}

		if (this._chunks[0].byteLength > byteCount) {
			// fast path, the reading is entirely within the first chunk
			const result = this._chunks[0].slice(0, byteCount);
			if (advance) {
				this._chunks[0] = this._chunks[0].slice(byteCount);
				this._totalLength -= byteCount;
			}
			return result;
		}

		const result = VSBuffer.alloc(byteCount);
		let resultOffset = 0;
		let chunkIndex = 0;
		while (byteCount > 0) {
			const chunk = this._chunks[chunkIndex];
			if (chunk.byteLength > byteCount) {
				// this chunk will survive
				const chunkPart = chunk.slice(0, byteCount);
				result.set(chunkPart, resultOffset);
				resultOffset += byteCount;

				if (advance) {
					this._chunks[chunkIndex] = chunk.slice(byteCount);
					this._totalLength -= byteCount;
				}

				byteCount -= byteCount;
			} else {
				// this chunk will be entirely read
				result.set(chunk, resultOffset);
				resultOffset += chunk.byteLength;

				if (advance) {
					this._chunks.shift();
					this._totalLength -= chunk.byteLength;
				} else {
					chunkIndex++;
				}

				byteCount -= chunk.byteLength;
			}
		}
		return result;
	}
}

const enum ProtocolMessageType {
	None = 0,
	Regular = 1,
	Control = 2,
	Ack = 3,
	Disconnect = 5,
	ReplayRequest = 6,
	Pause = 7,
	Resume = 8,
	KeepAlive = 9
}

function protocolMessageTypeToString(messageType: ProtocolMessageType) {
	switch (messageType) {
		case ProtocolMessageType.None: return 'None';
		case ProtocolMessageType.Regular: return 'Regular';
		case ProtocolMessageType.Control: return 'Control';
		case ProtocolMessageType.Ack: return 'Ack';
		case ProtocolMessageType.Disconnect: return 'Disconnect';
		case ProtocolMessageType.ReplayRequest: return 'ReplayRequest';
		case ProtocolMessageType.Pause: return 'PauseWriting';
		case ProtocolMessageType.Resume: return 'ResumeWriting';
		case ProtocolMessageType.KeepAlive: return 'KeepAlive';
	}
}

export const enum ProtocolConstants {
	HeaderLength = 13,
	/**
	 * Send an Acknowledge message at most 2 seconds later...
	 */
	AcknowledgeTime = 2000, // 2 seconds
	/**
	 * If there is a sent message that has been unacknowledged for 20 seconds,
	 * and we didn't see any incoming server data in the past 20 seconds,
	 * then consider the connection has timed out.
	 */
	TimeoutTime = 20000, // 20 seconds
	/**
	 * If there is no reconnection within this time-frame, consider the connection permanently closed...
	 */
	ReconnectionGraceTime = 3 * 60 * 60 * 1000, // 3hrs
	/**
	 * Maximal grace time between the first and the last reconnection...
	 */
	ReconnectionShortGraceTime = 5 * 60 * 1000, // 5min
	/**
	 * Send a message every 5 seconds to avoid that the connection is closed by the OS.
	 */
	KeepAliveSendTime = 5000, // 5 seconds
}

class ProtocolMessage {

	public writtenTime: number;

	constructor(
		public readonly type: ProtocolMessageType,
		public readonly id: number,
		public readonly ack: number,
		public readonly data: VSBuffer
	) {
		this.writtenTime = 0;
	}

	public get size(): number {
		return this.data.byteLength;
	}
}

class ProtocolReader extends Disposable {

	private readonly _socket: ISocket;
	private _isDisposed: boolean;
	private readonly _incomingData: ChunkStream;
	public lastReadTime: number;

	private readonly _onMessage = this._register(new Emitter<ProtocolMessage>());
	public readonly onMessage: Event<ProtocolMessage> = this._onMessage.event;

	private readonly _state = {
		readHead: true,
		readLen: ProtocolConstants.HeaderLength,
		messageType: ProtocolMessageType.None,
		id: 0,
		ack: 0
	};

	constructor(socket: ISocket) {
		super();
		this._socket = socket;
		this._isDisposed = false;
		this._incomingData = new ChunkStream();
		this._register(this._socket.onData(data => this.acceptChunk(data)));
		this.lastReadTime = Date.now();
	}

	public acceptChunk(data: VSBuffer | null): void {
		if (!data || data.byteLength === 0) {
			return;
		}

		this.lastReadTime = Date.now();

		this._incomingData.acceptChunk(data);

		while (this._incomingData.byteLength >= this._state.readLen) {

			const buff = this._incomingData.read(this._state.readLen);

			if (this._state.readHead) {
				// buff is the header

				// save new state => next time will read the body
				this._state.readHead = false;
				this._state.readLen = buff.readUInt32BE(9);
				this._state.messageType = buff.readUInt8(0);
				this._state.id = buff.readUInt32BE(1);
				this._state.ack = buff.readUInt32BE(5);

				this._socket.traceSocketEvent(SocketDiagnosticsEventType.ProtocolHeaderRead, { messageType: protocolMessageTypeToString(this._state.messageType), id: this._state.id, ack: this._state.ack, messageSize: this._state.readLen });

			} else {
				// buff is the body
				const messageType = this._state.messageType;
				const id = this._state.id;
				const ack = this._state.ack;

				// save new state => next time will read the header
				this._state.readHead = true;
				this._state.readLen = ProtocolConstants.HeaderLength;
				this._state.messageType = ProtocolMessageType.None;
				this._state.id = 0;
				this._state.ack = 0;

				this._socket.traceSocketEvent(SocketDiagnosticsEventType.ProtocolMessageRead, buff);

				this._onMessage.fire(new ProtocolMessage(messageType, id, ack, buff));

				if (this._isDisposed) {
					// check if an event listener lead to our disposal
					break;
				}
			}
		}
	}

	public readEntireBuffer(): VSBuffer {
		return this._incomingData.read(this._incomingData.byteLength);
	}

	public override dispose(): void {
		this._isDisposed = true;
		super.dispose();
	}
}

class ProtocolWriter {

	private _isDisposed: boolean;
	private _isPaused: boolean;
	private readonly _socket: ISocket;
	private _data: VSBuffer[];
	private _totalLength: number;
	public lastWriteTime: number;

	constructor(socket: ISocket) {
		this._isDisposed = false;
		this._isPaused = false;
		this._socket = socket;
		this._data = [];
		this._totalLength = 0;
		this.lastWriteTime = 0;
	}

	public dispose(): void {
		try {
			this.flush();
		} catch (err) {
			// ignore error, since the socket could be already closed
		}
		this._isDisposed = true;
	}

	public drain(): Promise<void> {
		this.flush();
		return this._socket.drain();
	}

	public flush(): void {
		// flush
		this._writeNow();
	}

	public pause(): void {
		this._isPaused = true;
	}

	public resume(): void {
		this._isPaused = false;
		this._scheduleWriting();
	}

	public write(msg: ProtocolMessage) {
		if (this._isDisposed) {
			// ignore: there could be left-over promises which complete and then
			// decide to write a response, etc...
			return;
		}
		msg.writtenTime = Date.now();
		this.lastWriteTime = Date.now();
		const header = VSBuffer.alloc(ProtocolConstants.HeaderLength);
		header.writeUInt8(msg.type, 0);
		header.writeUInt32BE(msg.id, 1);
		header.writeUInt32BE(msg.ack, 5);
		header.writeUInt32BE(msg.data.byteLength, 9);

		this._socket.traceSocketEvent(SocketDiagnosticsEventType.ProtocolHeaderWrite, { messageType: protocolMessageTypeToString(msg.type), id: msg.id, ack: msg.ack, messageSize: msg.data.byteLength });
		this._socket.traceSocketEvent(SocketDiagnosticsEventType.ProtocolMessageWrite, msg.data);

		this._writeSoon(header, msg.data);
	}

	private _bufferAdd(head: VSBuffer, body: VSBuffer): boolean {
		const wasEmpty = this._totalLength === 0;
		this._data.push(head, body);
		this._totalLength += head.byteLength + body.byteLength;
		return wasEmpty;
	}

	private _bufferTake(): VSBuffer {
		const ret = VSBuffer.concat(this._data, this._totalLength);
		this._data.length = 0;
		this._totalLength = 0;
		return ret;
	}

	private _writeSoon(header: VSBuffer, data: VSBuffer): void {
		if (this._bufferAdd(header, data)) {
			this._scheduleWriting();
		}
	}

	private _writeNowTimeout: Timeout | null = null;
	private _scheduleWriting(): void {
		if (this._writeNowTimeout) {
			return;
		}
		this._writeNowTimeout = setTimeout(() => {
			this._writeNowTimeout = null;
			this._writeNow();
		});
	}

	private _writeNow(): void {
		if (this._totalLength === 0) {
			return;
		}
		if (this._isPaused) {
			return;
		}
		const data = this._bufferTake();
		this._socket.traceSocketEvent(SocketDiagnosticsEventType.ProtocolWrite, { byteLength: data.byteLength });
		this._socket.write(data);
	}
}

/**
 * A message has the following format:
 * ```
 *     /-------------------------------|------\
 *     |             HEADER            |      |
 *     |-------------------------------| DATA |
 *     | TYPE | ID | ACK | DATA_LENGTH |      |
 *     \-------------------------------|------/
 * ```
 * The header is 9 bytes and consists of:
 *  - TYPE is 1 byte (ProtocolMessageType) - the message type
 *  - ID is 4 bytes (u32be) - the message id (can be 0 to indicate to be ignored)
 *  - ACK is 4 bytes (u32be) - the acknowledged message id (can be 0 to indicate to be ignored)
 *  - DATA_LENGTH is 4 bytes (u32be) - the length in bytes of DATA
 *
 * Only Regular messages are counted, other messages are not counted, nor acknowledged.
 */
export class Protocol extends Disposable implements IMessagePassingProtocol {

	private _socket: ISocket;
	private _socketWriter: ProtocolWriter;
	private _socketReader: ProtocolReader;

	private readonly _onMessage = new Emitter<VSBuffer>();
	readonly onMessage: Event<VSBuffer> = this._onMessage.event;

	private readonly _onDidDispose = new Emitter<void>();
	readonly onDidDispose: Event<void> = this._onDidDispose.event;

	constructor(socket: ISocket) {
		super();
		this._socket = socket;
		this._socketWriter = this._register(new ProtocolWriter(this._socket));
		this._socketReader = this._register(new ProtocolReader(this._socket));

		this._register(this._socketReader.onMessage((msg) => {
			if (msg.type === ProtocolMessageType.Regular) {
				this._onMessage.fire(msg.data);
			}
		}));

		this._register(this._socket.onClose(() => this._onDidDispose.fire()));
	}

	drain(): Promise<void> {
		return this._socketWriter.drain();
	}

	getSocket(): ISocket {
		return this._socket;
	}

	sendDisconnect(): void {
		// Nothing to do...
	}

	send(buffer: VSBuffer): void {
		this._socketWriter.write(new ProtocolMessage(ProtocolMessageType.Regular, 0, 0, buffer));
	}
}

export class Client<TContext = string> extends IPCClient<TContext> {

	static fromSocket<TContext = string>(socket: ISocket, id: TContext): Client<TContext> {
		return new Client(new Protocol(socket), id);
	}

	get onDidDispose(): Event<void> { return this.protocol.onDidDispose; }

	constructor(private protocol: Protocol | PersistentProtocol, id: TContext, ipcLogger: IIPCLogger | null = null) {
		super(protocol, id, ipcLogger);
	}

	override dispose(): void {
		super.dispose();
		const socket = this.protocol.getSocket();
		// should be sent gracefully with a .flush(), but try to send it out as a
		// last resort here if nothing else:
		this.protocol.sendDisconnect();
		this.protocol.dispose();
		socket.end();
	}
}

/**
 * Will ensure no messages are lost if there are no event listeners.
 */
export class BufferedEmitter<T> {
	private _emitter: Emitter<T>;
	public readonly event: Event<T>;

	private _hasListeners = false;
	private _isDeliveringMessages = false;
	private _bufferedMessages: T[] = [];

	constructor() {
		this._emitter = new Emitter<T>({
			onWillAddFirstListener: () => {
				this._hasListeners = true;
				// it is important to deliver these messages after this call, but before
				// other messages have a chance to be received (to guarantee in order delivery)
				// that's why we're using here queueMicrotask and not other types of timeouts
				queueMicrotask(() => this._deliverMessages());
			},
			onDidRemoveLastListener: () => {
				this._hasListeners = false;
			}
		});

		this.event = this._emitter.event;
	}

	private _deliverMessages(): void {
		if (this._isDeliveringMessages) {
			return;
		}
		this._isDeliveringMessages = true;
		while (this._hasListeners && this._bufferedMessages.length > 0) {
			this._emitter.fire(this._bufferedMessages.shift()!);
		}
		this._isDeliveringMessages = false;
	}

	public fire(event: T): void {
		if (this._hasListeners) {
			if (this._bufferedMessages.length > 0) {
				this._bufferedMessages.push(event);
			} else {
				this._emitter.fire(event);
			}
		} else {
			this._bufferedMessages.push(event);
		}
	}

	public flushBuffer(): void {
		this._bufferedMessages = [];
	}
}

class QueueElement<T> {
	public readonly data: T;
	public next: QueueElement<T> | null;

	constructor(data: T) {
		this.data = data;
		this.next = null;
	}
}

class Queue<T> {

	private _first: QueueElement<T> | null;
	private _last: QueueElement<T> | null;

	constructor() {
		this._first = null;
		this._last = null;
	}

	public length(): number {
		let result = 0;
		let current = this._first;
		while (current) {
			current = current.next;
			result++;
		}
		return result;
	}

	public peek(): T | null {
		if (!this._first) {
			return null;
		}
		return this._first.data;
	}

	public toArray(): T[] {
		const result: T[] = [];
		let resultLen = 0;
		let it = this._first;
		while (it) {
			result[resultLen++] = it.data;
			it = it.next;
		}
		return result;
	}

	public pop(): void {
		if (!this._first) {
			return;
		}
		if (this._first === this._last) {
			this._first = null;
			this._last = null;
			return;
		}
		this._first = this._first.next;
	}

	public push(item: T): void {
		const element = new QueueElement(item);
		if (!this._first) {
			this._first = element;
			this._last = element;
			return;
		}
		this._last!.next = element;
		this._last = element;
	}
}

class LoadEstimator {

	private static _HISTORY_LENGTH = 10;
	private static _INSTANCE: LoadEstimator | null = null;
	public static getInstance(): LoadEstimator {
		if (!LoadEstimator._INSTANCE) {
			LoadEstimator._INSTANCE = new LoadEstimator();
		}
		return LoadEstimator._INSTANCE;
	}

	private lastRuns: number[];

	constructor() {
		this.lastRuns = [];
		const now = Date.now();
		for (let i = 0; i < LoadEstimator._HISTORY_LENGTH; i++) {
			this.lastRuns[i] = now - 1000 * i;
		}
		setInterval(() => {
			for (let i = LoadEstimator._HISTORY_LENGTH; i >= 1; i--) {
				this.lastRuns[i] = this.lastRuns[i - 1];
			}
			this.lastRuns[0] = Date.now();
		}, 1000);
	}

	/**
	 * returns an estimative number, from 0 (low load) to 1 (high load)
	 */
	private load(): number {
		const now = Date.now();
		const historyLimit = (1 + LoadEstimator._HISTORY_LENGTH) * 1000;
		let score = 0;
		for (let i = 0; i < LoadEstimator._HISTORY_LENGTH; i++) {
			if (now - this.lastRuns[i] <= historyLimit) {
				score++;
			}
		}
		return 1 - score / LoadEstimator._HISTORY_LENGTH;
	}

	public hasHighLoad(): boolean {
		return this.load() >= 0.5;
	}
}

export interface ILoadEstimator {
	hasHighLoad(): boolean;
}

export interface PersistentProtocolOptions {
	/**
	 * The socket to use.
	 */
	socket: ISocket;
	/**
	 * The initial chunk of data that has already been received from the socket.
	 */
	initialChunk?: VSBuffer | null;
	/**
	 * The CPU load estimator to use.
	 */
	loadEstimator?: ILoadEstimator;
	/**
	 * Whether to send keep alive messages. Defaults to true.
	 */
	sendKeepAlive?: boolean;
}

/**
 * Same as Protocol, but will actually track messages and acks.
 * Moreover, it will ensure no messages are lost if there are no event listeners.
 */
export class PersistentProtocol implements IMessagePassingProtocol {

	private _isReconnecting: boolean;
	private _didSendDisconnect?: boolean;

	private _outgoingUnackMsg: Queue<ProtocolMessage>;
	private _outgoingMsgId: number;
	private _outgoingAckId: number;
	private _outgoingAckTimeout: Timeout | null;

	private _incomingMsgId: number;
	private _incomingAckId: number;
	private _incomingMsgLastTime: number;
	private _incomingAckTimeout: Timeout | null;

	private _keepAliveInterval: Timeout | null;

	private _lastReplayRequestTime: number;
	private _lastSocketTimeoutTime: number;

	private _socket: ISocket;
	private _socketWriter: ProtocolWriter;
	private _socketReader: ProtocolReader;
	// eslint-disable-next-line local/code-no-potentially-unsafe-disposables
	private _socketDisposables: DisposableStore;

	private readonly _loadEstimator: ILoadEstimator;
	private readonly _shouldSendKeepAlive: boolean;

	private readonly _onControlMessage = new BufferedEmitter<VSBuffer>();
	readonly onControlMessage: Event<VSBuffer> = this._onControlMessage.event;

	private readonly _onMessage = new BufferedEmitter<VSBuffer>();
	readonly onMessage: Event<VSBuffer> = this._onMessage.event;

	private readonly _onDidDispose = new BufferedEmitter<void>();
	readonly onDidDispose: Event<void> = this._onDidDispose.event;

	private readonly _onSocketClose = new BufferedEmitter<SocketCloseEvent>();
	readonly onSocketClose: Event<SocketCloseEvent> = this._onSocketClose.event;

	private readonly _onSocketTimeout = new BufferedEmitter<SocketTimeoutEvent>();
	readonly onSocketTimeout: Event<SocketTimeoutEvent> = this._onSocketTimeout.event;

	public get unacknowledgedCount(): number {
		return this._outgoingMsgId - this._outgoingAckId;
	}

	constructor(opts: PersistentProtocolOptions) {
		this._loadEstimator = opts.loadEstimator ?? LoadEstimator.getInstance();
		this._shouldSendKeepAlive = opts.sendKeepAlive ?? true;
		this._isReconnecting = false;
		this._outgoingUnackMsg = new Queue<ProtocolMessage>();
		this._outgoingMsgId = 0;
		this._outgoingAckId = 0;
		this._outgoingAckTimeout = null;

		this._incomingMsgId = 0;
		this._incomingAckId = 0;
		this._incomingMsgLastTime = 0;
		this._incomingAckTimeout = null;

		this._lastReplayRequestTime = 0;
		this._lastSocketTimeoutTime = Date.now();

		this._socketDisposables = new DisposableStore();
		this._socket = opts.socket;
		this._socketWriter = this._socketDisposables.add(new ProtocolWriter(this._socket));
		this._socketReader = this._socketDisposables.add(new ProtocolReader(this._socket));
		this._socketDisposables.add(this._socketReader.onMessage(msg => this._receiveMessage(msg)));
		this._socketDisposables.add(this._socket.onClose(e => this._onSocketClose.fire(e)));

		if (opts.initialChunk) {
			this._socketReader.acceptChunk(opts.initialChunk);
		}

		if (this._shouldSendKeepAlive) {
			this._keepAliveInterval = setInterval(() => {
				this._sendKeepAlive();
			}, ProtocolConstants.KeepAliveSendTime);
		} else {
			this._keepAliveInterval = null;
		}
	}

	dispose(): void {
		if (this._outgoingAckTimeout) {
			clearTimeout(this._outgoingAckTimeout);
			this._outgoingAckTimeout = null;
		}
		if (this._incomingAckTimeout) {
			clearTimeout(this._incomingAckTimeout);
			this._incomingAckTimeout = null;
		}
		if (this._keepAliveInterval) {
			clearInterval(this._keepAliveInterval);
			this._keepAliveInterval = null;
		}
		this._socketDisposables.dispose();
	}

	drain(): Promise<void> {
		return this._socketWriter.drain();
	}

	sendDisconnect(): void {
		if (!this._didSendDisconnect) {
			this._didSendDisconnect = true;
			const msg = new ProtocolMessage(ProtocolMessageType.Disconnect, 0, 0, getEmptyBuffer());
			this._socketWriter.write(msg);
			this._socketWriter.flush();
		}
	}

	sendPause(): void {
		const msg = new ProtocolMessage(ProtocolMessageType.Pause, 0, 0, getEmptyBuffer());
		this._socketWriter.write(msg);
	}

	sendResume(): void {
		const msg = new ProtocolMessage(ProtocolMessageType.Resume, 0, 0, getEmptyBuffer());
		this._socketWriter.write(msg);
	}

	pauseSocketWriting() {
		this._socketWriter.pause();
	}

	public getSocket(): ISocket {
		return this._socket;
	}

	public getMillisSinceLastIncomingData(): number {
		return Date.now() - this._socketReader.lastReadTime;
	}

	public beginAcceptReconnection(socket: ISocket, initialDataChunk: VSBuffer | null): void {
		this._isReconnecting = true;

		this._socketDisposables.dispose();
		this._socketDisposables = new DisposableStore();
		this._onControlMessage.flushBuffer();
		this._onSocketClose.flushBuffer();
		this._onSocketTimeout.flushBuffer();
		this._socket.dispose();

		this._lastReplayRequestTime = 0;
		this._lastSocketTimeoutTime = Date.now();

		this._socket = socket;
		this._socketWriter = this._socketDisposables.add(new ProtocolWriter(this._socket));
		this._socketReader = this._socketDisposables.add(new ProtocolReader(this._socket));
		this._socketDisposables.add(this._socketReader.onMessage(msg => this._receiveMessage(msg)));
		this._socketDisposables.add(this._socket.onClose(e => this._onSocketClose.fire(e)));

		this._socketReader.acceptChunk(initialDataChunk);
	}

	public endAcceptReconnection(): void {
		this._isReconnecting = false;

		// After a reconnection, let the other party know (again) which messages have been received.
		// (perhaps the other party didn't receive a previous ACK)
		this._incomingAckId = this._incomingMsgId;
		const msg = new ProtocolMessage(ProtocolMessageType.Ack, 0, this._incomingAckId, getEmptyBuffer());
		this._socketWriter.write(msg);

		// Send again all unacknowledged messages
		const toSend = this._outgoingUnackMsg.toArray();
		for (let i = 0, len = toSend.length; i < len; i++) {
			this._socketWriter.write(toSend[i]);
		}
		this._recvAckCheck();
	}

	public acceptDisconnect(): void {
		this._onDidDispose.fire();
	}

	private _receiveMessage(msg: ProtocolMessage): void {
		if (msg.ack > this._outgoingAckId) {
			this._outgoingAckId = msg.ack;
			do {
				const first = this._outgoingUnackMsg.peek();
				if (first && first.id <= msg.ack) {
					// this message has been confirmed, remove it
					this._outgoingUnackMsg.pop();
				} else {
					break;
				}
			} while (true);
		}

		switch (msg.type) {
			case ProtocolMessageType.None: {
				// N/A
				break;
			}
			case ProtocolMessageType.Regular: {
				if (msg.id > this._incomingMsgId) {
					if (msg.id !== this._incomingMsgId + 1) {
						// in case we missed some messages we ask the other party to resend them
						const now = Date.now();
						if (now - this._lastReplayRequestTime > 10000) {
							// send a replay request at most once every 10s
							this._lastReplayRequestTime = now;
							this._socketWriter.write(new ProtocolMessage(ProtocolMessageType.ReplayRequest, 0, 0, getEmptyBuffer()));
						}
					} else {
						this._incomingMsgId = msg.id;
						this._incomingMsgLastTime = Date.now();
						this._sendAckCheck();
						this._onMessage.fire(msg.data);
					}
				}
				break;
			}
			case ProtocolMessageType.Control: {
				this._onControlMessage.fire(msg.data);
				break;
			}
			case ProtocolMessageType.Ack: {
				// nothing to do, .ack is handled above already
				break;
			}
			case ProtocolMessageType.Disconnect: {
				this._onDidDispose.fire();
				break;
			}
			case ProtocolMessageType.ReplayRequest: {
				// Send again all unacknowledged messages
				const toSend = this._outgoingUnackMsg.toArray();
				for (let i = 0, len = toSend.length; i < len; i++) {
					this._socketWriter.write(toSend[i]);
				}
				this._recvAckCheck();
				break;
			}
			case ProtocolMessageType.Pause: {
				this._socketWriter.pause();
				break;
			}
			case ProtocolMessageType.Resume: {
				this._socketWriter.resume();
				break;
			}
			case ProtocolMessageType.KeepAlive: {
				// nothing to do
				break;
			}
		}
	}

	readEntireBuffer(): VSBuffer {
		return this._socketReader.readEntireBuffer();
	}

	flush(): void {
		this._socketWriter.flush();
	}

	send(buffer: VSBuffer): void {
		const myId = ++this._outgoingMsgId;
		this._incomingAckId = this._incomingMsgId;
		const msg = new ProtocolMessage(ProtocolMessageType.Regular, myId, this._incomingAckId, buffer);
		this._outgoingUnackMsg.push(msg);
		if (!this._isReconnecting) {
			this._socketWriter.write(msg);
			this._recvAckCheck();
		}
	}

	/**
	 * Send a message which will not be part of the regular acknowledge flow.
	 * Use this for early control messages which are repeated in case of reconnection.
	 */
	sendControl(buffer: VSBuffer): void {
		const msg = new ProtocolMessage(ProtocolMessageType.Control, 0, 0, buffer);
		this._socketWriter.write(msg);
	}

	private _sendAckCheck(): void {
		if (this._incomingMsgId <= this._incomingAckId) {
			// nothink to acknowledge
			return;
		}

		if (this._incomingAckTimeout) {
			// there will be a check in the near future
			return;
		}

		const timeSinceLastIncomingMsg = Date.now() - this._incomingMsgLastTime;
		if (timeSinceLastIncomingMsg >= ProtocolConstants.AcknowledgeTime) {
			// sufficient time has passed since this message has been received,
			// and no message from our side needed to be sent in the meantime,
			// so we will send a message containing only an ack.
			this._sendAck();
			return;
		}

		this._incomingAckTimeout = setTimeout(() => {
			this._incomingAckTimeout = null;
			this._sendAckCheck();
		}, ProtocolConstants.AcknowledgeTime - timeSinceLastIncomingMsg + 5);
	}

	private _recvAckCheck(): void {
		if (this._outgoingMsgId <= this._outgoingAckId) {
			// everything has been acknowledged
			return;
		}

		if (this._outgoingAckTimeout) {
			// there will be a check in the near future
			return;
		}

		if (this._isReconnecting) {
			// do not cause a timeout during reconnection,
			// because messages will not be actually written until `endAcceptReconnection`
			return;
		}

		const oldestUnacknowledgedMsg = this._outgoingUnackMsg.peek()!;
		const timeSinceOldestUnacknowledgedMsg = Date.now() - oldestUnacknowledgedMsg.writtenTime;
		const timeSinceLastReceivedSomeData = Date.now() - this._socketReader.lastReadTime;
		const timeSinceLastTimeout = Date.now() - this._lastSocketTimeoutTime;

		if (
			timeSinceOldestUnacknowledgedMsg >= ProtocolConstants.TimeoutTime
			&& timeSinceLastReceivedSomeData >= ProtocolConstants.TimeoutTime
			&& timeSinceLastTimeout >= ProtocolConstants.TimeoutTime
		) {
			// It's been a long time since our sent message was acknowledged
			// and a long time since we received some data

			// But this might be caused by the event loop being busy and failing to read messages
			if (!this._loadEstimator.hasHighLoad()) {
				// Trash the socket
				this._lastSocketTimeoutTime = Date.now();
				this._onSocketTimeout.fire({
					unacknowledgedMsgCount: this._outgoingUnackMsg.length(),
					timeSinceOldestUnacknowledgedMsg,
					timeSinceLastReceivedSomeData
				});
				return;
			}
		}

		const minimumTimeUntilTimeout = Math.max(
			ProtocolConstants.TimeoutTime - timeSinceOldestUnacknowledgedMsg,
			ProtocolConstants.TimeoutTime - timeSinceLastReceivedSomeData,
			ProtocolConstants.TimeoutTime - timeSinceLastTimeout,
			500
		);

		this._outgoingAckTimeout = setTimeout(() => {
			this._outgoingAckTimeout = null;
			this._recvAckCheck();
		}, minimumTimeUntilTimeout);
	}

	private _sendAck(): void {
		if (this._incomingMsgId <= this._incomingAckId) {
			// nothink to acknowledge
			return;
		}

		this._incomingAckId = this._incomingMsgId;
		const msg = new ProtocolMessage(ProtocolMessageType.Ack, 0, this._incomingAckId, getEmptyBuffer());
		this._socketWriter.write(msg);
	}

	private _sendKeepAlive(): void {
		this._incomingAckId = this._incomingMsgId;
		const msg = new ProtocolMessage(ProtocolMessageType.KeepAlive, 0, this._incomingAckId, getEmptyBuffer());
		this._socketWriter.write(msg);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/ipc/common/ipc.ts]---
Location: vscode-main/src/vs/base/parts/ipc/common/ipc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getRandomElement } from '../../../common/arrays.js';
import { CancelablePromise, createCancelablePromise, timeout } from '../../../common/async.js';
import { VSBuffer } from '../../../common/buffer.js';
import { CancellationToken, CancellationTokenSource } from '../../../common/cancellation.js';
import { memoize } from '../../../common/decorators.js';
import { CancellationError, ErrorNoTelemetry } from '../../../common/errors.js';
import { Emitter, Event, EventMultiplexer, Relay } from '../../../common/event.js';
import { createSingleCallFunction } from '../../../common/functional.js';
import { DisposableStore, dispose, IDisposable, toDisposable } from '../../../common/lifecycle.js';
import { revive } from '../../../common/marshalling.js';
import * as strings from '../../../common/strings.js';
import { isFunction, isUndefinedOrNull } from '../../../common/types.js';

/**
 * An `IChannel` is an abstraction over a collection of commands.
 * You can `call` several commands on a channel, each taking at
 * most one single argument. A `call` always returns a promise
 * with at most one single return value.
 */
export interface IChannel {
	call<T>(command: string, arg?: any, cancellationToken?: CancellationToken): Promise<T>;
	listen<T>(event: string, arg?: any): Event<T>;
}

/**
 * An `IServerChannel` is the counter part to `IChannel`,
 * on the server-side. You should implement this interface
 * if you'd like to handle remote promises or events.
 */
export interface IServerChannel<TContext = string> {
	call<T>(ctx: TContext, command: string, arg?: any, cancellationToken?: CancellationToken): Promise<T>;
	listen<T>(ctx: TContext, event: string, arg?: any): Event<T>;
}

const enum RequestType {
	Promise = 100,
	PromiseCancel = 101,
	EventListen = 102,
	EventDispose = 103
}

function requestTypeToStr(type: RequestType): string {
	switch (type) {
		case RequestType.Promise:
			return 'req';
		case RequestType.PromiseCancel:
			return 'cancel';
		case RequestType.EventListen:
			return 'subscribe';
		case RequestType.EventDispose:
			return 'unsubscribe';
	}
}

type IRawPromiseRequest = { type: RequestType.Promise; id: number; channelName: string; name: string; arg: any };
type IRawPromiseCancelRequest = { type: RequestType.PromiseCancel; id: number };
type IRawEventListenRequest = { type: RequestType.EventListen; id: number; channelName: string; name: string; arg: any };
type IRawEventDisposeRequest = { type: RequestType.EventDispose; id: number };
type IRawRequest = IRawPromiseRequest | IRawPromiseCancelRequest | IRawEventListenRequest | IRawEventDisposeRequest;

const enum ResponseType {
	Initialize = 200,
	PromiseSuccess = 201,
	PromiseError = 202,
	PromiseErrorObj = 203,
	EventFire = 204
}

function responseTypeToStr(type: ResponseType): string {
	switch (type) {
		case ResponseType.Initialize:
			return `init`;
		case ResponseType.PromiseSuccess:
			return `reply:`;
		case ResponseType.PromiseError:
		case ResponseType.PromiseErrorObj:
			return `replyErr:`;
		case ResponseType.EventFire:
			return `event:`;
	}
}

type IRawInitializeResponse = { type: ResponseType.Initialize };
type IRawPromiseSuccessResponse = { type: ResponseType.PromiseSuccess; id: number; data: any };
type IRawPromiseErrorResponse = { type: ResponseType.PromiseError; id: number; data: { message: string; name: string; stack: string[] | undefined } };
type IRawPromiseErrorObjResponse = { type: ResponseType.PromiseErrorObj; id: number; data: any };
type IRawEventFireResponse = { type: ResponseType.EventFire; id: number; data: any };
type IRawResponse = IRawInitializeResponse | IRawPromiseSuccessResponse | IRawPromiseErrorResponse | IRawPromiseErrorObjResponse | IRawEventFireResponse;

interface IHandler {
	(response: IRawResponse): void;
}

export interface IMessagePassingProtocol {
	send(buffer: VSBuffer): void;
	readonly onMessage: Event<VSBuffer>;
	/**
	 * Wait for the write buffer (if applicable) to become empty.
	 */
	drain?(): Promise<void>;
}

enum State {
	Uninitialized,
	Idle
}

/**
 * An `IChannelServer` hosts a collection of channels. You are
 * able to register channels onto it, provided a channel name.
 */
export interface IChannelServer<TContext = string> {
	registerChannel(channelName: string, channel: IServerChannel<TContext>): void;
}

/**
 * An `IChannelClient` has access to a collection of channels. You
 * are able to get those channels, given their channel name.
 */
export interface IChannelClient {
	getChannel<T extends IChannel>(channelName: string): T;
}

export interface Client<TContext> {
	readonly ctx: TContext;
}

export interface IConnectionHub<TContext> {
	readonly connections: Connection<TContext>[];
	readonly onDidAddConnection: Event<Connection<TContext>>;
	readonly onDidRemoveConnection: Event<Connection<TContext>>;
}

/**
 * An `IClientRouter` is responsible for routing calls to specific
 * channels, in scenarios in which there are multiple possible
 * channels (each from a separate client) to pick from.
 */
export interface IClientRouter<TContext = string> {
	routeCall(hub: IConnectionHub<TContext>, command: string, arg?: any, cancellationToken?: CancellationToken): Promise<Client<TContext>>;
	routeEvent(hub: IConnectionHub<TContext>, event: string, arg?: any): Promise<Client<TContext>>;
}

/**
 * Similar to the `IChannelClient`, you can get channels from this
 * collection of channels. The difference being that in the
 * `IRoutingChannelClient`, there are multiple clients providing
 * the same channel. You'll need to pass in an `IClientRouter` in
 * order to pick the right one.
 */
export interface IRoutingChannelClient<TContext = string> {
	getChannel<T extends IChannel>(channelName: string, router?: IClientRouter<TContext>): T;
}

interface IReader {
	read(bytes: number): VSBuffer;
}

interface IWriter {
	write(buffer: VSBuffer): void;
}


/**
 * @see https://en.wikipedia.org/wiki/Variable-length_quantity
 */
function readIntVQL(reader: IReader) {
	let value = 0;
	for (let n = 0; ; n += 7) {
		const next = reader.read(1);
		value |= (next.buffer[0] & 0b01111111) << n;
		if (!(next.buffer[0] & 0b10000000)) {
			return value;
		}
	}
}

const vqlZero = createOneByteBuffer(0);

/**
 * @see https://en.wikipedia.org/wiki/Variable-length_quantity
 */
function writeInt32VQL(writer: IWriter, value: number) {
	if (value === 0) {
		writer.write(vqlZero);
		return;
	}

	let len = 0;
	for (let v2 = value; v2 !== 0; v2 = v2 >>> 7) {
		len++;
	}

	const scratch = VSBuffer.alloc(len);
	for (let i = 0; value !== 0; i++) {
		scratch.buffer[i] = value & 0b01111111;
		value = value >>> 7;
		if (value > 0) {
			scratch.buffer[i] |= 0b10000000;
		}
	}

	writer.write(scratch);
}

export class BufferReader implements IReader {

	private pos = 0;

	constructor(private buffer: VSBuffer) { }

	read(bytes: number): VSBuffer {
		const result = this.buffer.slice(this.pos, this.pos + bytes);
		this.pos += result.byteLength;
		return result;
	}
}

export class BufferWriter implements IWriter {

	private buffers: VSBuffer[] = [];

	get buffer(): VSBuffer {
		return VSBuffer.concat(this.buffers);
	}

	write(buffer: VSBuffer): void {
		this.buffers.push(buffer);
	}
}

enum DataType {
	Undefined = 0,
	String = 1,
	Buffer = 2,
	VSBuffer = 3,
	Array = 4,
	Object = 5,
	Int = 6
}

function createOneByteBuffer(value: number): VSBuffer {
	const result = VSBuffer.alloc(1);
	result.writeUInt8(value, 0);
	return result;
}

const BufferPresets = {
	Undefined: createOneByteBuffer(DataType.Undefined),
	String: createOneByteBuffer(DataType.String),
	Buffer: createOneByteBuffer(DataType.Buffer),
	VSBuffer: createOneByteBuffer(DataType.VSBuffer),
	Array: createOneByteBuffer(DataType.Array),
	Object: createOneByteBuffer(DataType.Object),
	Uint: createOneByteBuffer(DataType.Int),
};

export function serialize(writer: IWriter, data: any): void {
	if (typeof data === 'undefined') {
		writer.write(BufferPresets.Undefined);
	} else if (typeof data === 'string') {
		const buffer = VSBuffer.fromString(data);
		writer.write(BufferPresets.String);
		writeInt32VQL(writer, buffer.byteLength);
		writer.write(buffer);
	} else if (VSBuffer.isNativeBuffer(data)) {
		const buffer = VSBuffer.wrap(data);
		writer.write(BufferPresets.Buffer);
		writeInt32VQL(writer, buffer.byteLength);
		writer.write(buffer);
	} else if (data instanceof VSBuffer) {
		writer.write(BufferPresets.VSBuffer);
		writeInt32VQL(writer, data.byteLength);
		writer.write(data);
	} else if (Array.isArray(data)) {
		writer.write(BufferPresets.Array);
		writeInt32VQL(writer, data.length);

		for (const el of data) {
			serialize(writer, el);
		}
	} else if (typeof data === 'number' && (data | 0) === data) {
		// write a vql if it's a number that we can do bitwise operations on
		writer.write(BufferPresets.Uint);
		writeInt32VQL(writer, data);
	} else {
		const buffer = VSBuffer.fromString(JSON.stringify(data));
		writer.write(BufferPresets.Object);
		writeInt32VQL(writer, buffer.byteLength);
		writer.write(buffer);
	}
}

export function deserialize(reader: IReader): any {
	const type = reader.read(1).readUInt8(0);

	switch (type) {
		case DataType.Undefined: return undefined;
		case DataType.String: return reader.read(readIntVQL(reader)).toString();
		case DataType.Buffer: return reader.read(readIntVQL(reader)).buffer;
		case DataType.VSBuffer: return reader.read(readIntVQL(reader));
		case DataType.Array: {
			const length = readIntVQL(reader);
			const result: any[] = [];

			for (let i = 0; i < length; i++) {
				result.push(deserialize(reader));
			}

			return result;
		}
		case DataType.Object: return JSON.parse(reader.read(readIntVQL(reader)).toString());
		case DataType.Int: return readIntVQL(reader);
	}
}

interface PendingRequest {
	request: IRawPromiseRequest | IRawEventListenRequest;
	timeoutTimer: Timeout;
}

export class ChannelServer<TContext = string> implements IChannelServer<TContext>, IDisposable {

	private channels = new Map<string, IServerChannel<TContext>>();
	private activeRequests = new Map<number, IDisposable>();
	private protocolListener: IDisposable | null;

	// Requests might come in for channels which are not yet registered.
	// They will timeout after `timeoutDelay`.
	private pendingRequests = new Map<string, PendingRequest[]>();

	constructor(private protocol: IMessagePassingProtocol, private ctx: TContext, private logger: IIPCLogger | null = null, private timeoutDelay = 1000) {
		this.protocolListener = this.protocol.onMessage(msg => this.onRawMessage(msg));
		this.sendResponse({ type: ResponseType.Initialize });
	}

	registerChannel(channelName: string, channel: IServerChannel<TContext>): void {
		this.channels.set(channelName, channel);

		// https://github.com/microsoft/vscode/issues/72531
		setTimeout(() => this.flushPendingRequests(channelName), 0);
	}

	private sendResponse(response: IRawResponse): void {
		switch (response.type) {
			case ResponseType.Initialize: {
				const msgLength = this.send([response.type]);
				this.logger?.logOutgoing(msgLength, 0, RequestInitiator.OtherSide, responseTypeToStr(response.type));
				return;
			}

			case ResponseType.PromiseSuccess:
			case ResponseType.PromiseError:
			case ResponseType.EventFire:
			case ResponseType.PromiseErrorObj: {
				const msgLength = this.send([response.type, response.id], response.data);
				this.logger?.logOutgoing(msgLength, response.id, RequestInitiator.OtherSide, responseTypeToStr(response.type), response.data);
				return;
			}
		}
	}

	private send(header: unknown, body: any = undefined): number {
		const writer = new BufferWriter();
		serialize(writer, header);
		serialize(writer, body);
		return this.sendBuffer(writer.buffer);
	}

	private sendBuffer(message: VSBuffer): number {
		try {
			this.protocol.send(message);
			return message.byteLength;
		} catch (err) {
			// noop
			return 0;
		}
	}

	private onRawMessage(message: VSBuffer): void {
		const reader = new BufferReader(message);
		const header = deserialize(reader);
		const body = deserialize(reader);
		const type = header[0] as RequestType;

		switch (type) {
			case RequestType.Promise:
				this.logger?.logIncoming(message.byteLength, header[1], RequestInitiator.OtherSide, `${requestTypeToStr(type)}: ${header[2]}.${header[3]}`, body);
				return this.onPromise({ type, id: header[1], channelName: header[2], name: header[3], arg: body });
			case RequestType.EventListen:
				this.logger?.logIncoming(message.byteLength, header[1], RequestInitiator.OtherSide, `${requestTypeToStr(type)}: ${header[2]}.${header[3]}`, body);
				return this.onEventListen({ type, id: header[1], channelName: header[2], name: header[3], arg: body });
			case RequestType.PromiseCancel:
				this.logger?.logIncoming(message.byteLength, header[1], RequestInitiator.OtherSide, `${requestTypeToStr(type)}`);
				return this.disposeActiveRequest({ type, id: header[1] });
			case RequestType.EventDispose:
				this.logger?.logIncoming(message.byteLength, header[1], RequestInitiator.OtherSide, `${requestTypeToStr(type)}`);
				return this.disposeActiveRequest({ type, id: header[1] });
		}
	}

	private onPromise(request: IRawPromiseRequest): void {
		const channel = this.channels.get(request.channelName);

		if (!channel) {
			this.collectPendingRequest(request);
			return;
		}

		const cancellationTokenSource = new CancellationTokenSource();
		let promise: Promise<any>;

		try {
			promise = channel.call(this.ctx, request.name, request.arg, cancellationTokenSource.token);
		} catch (err) {
			promise = Promise.reject(err);
		}

		const id = request.id;

		promise.then(data => {
			this.sendResponse({ id, data, type: ResponseType.PromiseSuccess });
		}, err => {
			if (err instanceof Error) {
				this.sendResponse({
					id, data: {
						message: err.message,
						name: err.name,
						stack: err.stack ? err.stack.split('\n') : undefined
					}, type: ResponseType.PromiseError
				});
			} else {
				this.sendResponse({ id, data: err, type: ResponseType.PromiseErrorObj });
			}
		}).finally(() => {
			disposable.dispose();
			this.activeRequests.delete(request.id);
		});

		const disposable = toDisposable(() => cancellationTokenSource.cancel());
		this.activeRequests.set(request.id, disposable);
	}

	private onEventListen(request: IRawEventListenRequest): void {
		const channel = this.channels.get(request.channelName);

		if (!channel) {
			this.collectPendingRequest(request);
			return;
		}

		const id = request.id;
		const event = channel.listen(this.ctx, request.name, request.arg);
		const disposable = event(data => this.sendResponse({ id, data, type: ResponseType.EventFire }));

		this.activeRequests.set(request.id, disposable);
	}

	private disposeActiveRequest(request: IRawRequest): void {
		const disposable = this.activeRequests.get(request.id);

		if (disposable) {
			disposable.dispose();
			this.activeRequests.delete(request.id);
		}
	}

	private collectPendingRequest(request: IRawPromiseRequest | IRawEventListenRequest): void {
		let pendingRequests = this.pendingRequests.get(request.channelName);

		if (!pendingRequests) {
			pendingRequests = [];
			this.pendingRequests.set(request.channelName, pendingRequests);
		}

		const timer = setTimeout(() => {
			console.error(`Unknown channel: ${request.channelName}`);

			if (request.type === RequestType.Promise) {
				this.sendResponse({
					id: request.id,
					data: { name: 'Unknown channel', message: `Channel name '${request.channelName}' timed out after ${this.timeoutDelay}ms`, stack: undefined },
					type: ResponseType.PromiseError
				});
			}
		}, this.timeoutDelay);

		pendingRequests.push({ request, timeoutTimer: timer });
	}

	private flushPendingRequests(channelName: string): void {
		const requests = this.pendingRequests.get(channelName);

		if (requests) {
			for (const request of requests) {
				clearTimeout(request.timeoutTimer);

				switch (request.request.type) {
					case RequestType.Promise: this.onPromise(request.request); break;
					case RequestType.EventListen: this.onEventListen(request.request); break;
				}
			}

			this.pendingRequests.delete(channelName);
		}
	}

	public dispose(): void {
		if (this.protocolListener) {
			this.protocolListener.dispose();
			this.protocolListener = null;
		}
		dispose(this.activeRequests.values());
		this.activeRequests.clear();
	}
}

export const enum RequestInitiator {
	LocalSide = 0,
	OtherSide = 1
}

export interface IIPCLogger {
	logIncoming(msgLength: number, requestId: number, initiator: RequestInitiator, str: string, data?: any): void;
	logOutgoing(msgLength: number, requestId: number, initiator: RequestInitiator, str: string, data?: any): void;
}

export class ChannelClient implements IChannelClient, IDisposable {

	private isDisposed = false;
	private state: State = State.Uninitialized;
	private activeRequests = new Set<IDisposable>();
	private handlers = new Map<number, IHandler>();
	private lastRequestId = 0;
	private protocolListener: IDisposable | null;
	private logger: IIPCLogger | null;

	private readonly _onDidInitialize = new Emitter<void>();
	readonly onDidInitialize = this._onDidInitialize.event;

	constructor(private protocol: IMessagePassingProtocol, logger: IIPCLogger | null = null) {
		this.protocolListener = this.protocol.onMessage(msg => this.onBuffer(msg));
		this.logger = logger;
	}

	getChannel<T extends IChannel>(channelName: string): T {
		const that = this;

		// eslint-disable-next-line local/code-no-dangerous-type-assertions
		return {
			call(command: string, arg?: any, cancellationToken?: CancellationToken) {
				if (that.isDisposed) {
					return Promise.reject(new CancellationError());
				}
				return that.requestPromise(channelName, command, arg, cancellationToken);
			},
			listen(event: string, arg: any) {
				if (that.isDisposed) {
					return Event.None;
				}
				return that.requestEvent(channelName, event, arg);
			}
		} as T;
	}

	private requestPromise(channelName: string, name: string, arg?: any, cancellationToken = CancellationToken.None): Promise<unknown> {
		const id = this.lastRequestId++;
		const type = RequestType.Promise;
		const request: IRawRequest = { id, type, channelName, name, arg };

		if (cancellationToken.isCancellationRequested) {
			return Promise.reject(new CancellationError());
		}

		let disposable: IDisposable;
		let disposableWithRequestCancel: IDisposable;

		const result = new Promise((c, e) => {
			if (cancellationToken.isCancellationRequested) {
				return e(new CancellationError());
			}

			const doRequest = () => {
				const handler: IHandler = response => {
					switch (response.type) {
						case ResponseType.PromiseSuccess:
							this.handlers.delete(id);
							c(response.data);
							break;

						case ResponseType.PromiseError: {
							this.handlers.delete(id);
							const error = new Error(response.data.message);
							error.stack = Array.isArray(response.data.stack) ? response.data.stack.join('\n') : response.data.stack;
							error.name = response.data.name;
							e(error);
							break;
						}
						case ResponseType.PromiseErrorObj:
							this.handlers.delete(id);
							e(response.data);
							break;
					}
				};

				this.handlers.set(id, handler);
				this.sendRequest(request);
			};

			let uninitializedPromise: CancelablePromise<void> | null = null;
			if (this.state === State.Idle) {
				doRequest();
			} else {
				uninitializedPromise = createCancelablePromise(_ => this.whenInitialized());
				uninitializedPromise.then(() => {
					uninitializedPromise = null;
					doRequest();
				});
			}

			const cancel = () => {
				if (uninitializedPromise) {
					uninitializedPromise.cancel();
					uninitializedPromise = null;
				} else {
					this.sendRequest({ id, type: RequestType.PromiseCancel });
				}

				e(new CancellationError());
			};

			disposable = cancellationToken.onCancellationRequested(cancel);
			disposableWithRequestCancel = {
				dispose: createSingleCallFunction(() => {
					cancel();
					disposable.dispose();
				})
			};

			this.activeRequests.add(disposableWithRequestCancel);
		});

		return result.finally(() => {
			disposable?.dispose(); // Seen as undefined in tests.
			this.activeRequests.delete(disposableWithRequestCancel);
		});
	}

	private requestEvent(channelName: string, name: string, arg?: any): Event<any> {
		const id = this.lastRequestId++;
		const type = RequestType.EventListen;
		const request: IRawRequest = { id, type, channelName, name, arg };

		let uninitializedPromise: CancelablePromise<void> | null = null;

		const emitter = new Emitter<any>({
			onWillAddFirstListener: () => {
				const doRequest = () => {
					this.activeRequests.add(emitter);
					this.sendRequest(request);
				};
				if (this.state === State.Idle) {
					doRequest();
				} else {
					uninitializedPromise = createCancelablePromise(_ => this.whenInitialized());
					uninitializedPromise.then(() => {
						uninitializedPromise = null;
						doRequest();
					});
				}
			},
			onDidRemoveLastListener: () => {
				if (uninitializedPromise) {
					uninitializedPromise.cancel();
					uninitializedPromise = null;
				} else {
					this.activeRequests.delete(emitter);
					this.sendRequest({ id, type: RequestType.EventDispose });
				}
				this.handlers.delete(id);
			}
		});

		const handler: IHandler = (res: IRawResponse) => emitter.fire((res as IRawEventFireResponse).data);
		this.handlers.set(id, handler);

		return emitter.event;
	}

	private sendRequest(request: IRawRequest): void {
		switch (request.type) {
			case RequestType.Promise:
			case RequestType.EventListen: {
				const msgLength = this.send([request.type, request.id, request.channelName, request.name], request.arg);
				this.logger?.logOutgoing(msgLength, request.id, RequestInitiator.LocalSide, `${requestTypeToStr(request.type)}: ${request.channelName}.${request.name}`, request.arg);
				return;
			}

			case RequestType.PromiseCancel:
			case RequestType.EventDispose: {
				const msgLength = this.send([request.type, request.id]);
				this.logger?.logOutgoing(msgLength, request.id, RequestInitiator.LocalSide, requestTypeToStr(request.type));
				return;
			}
		}
	}

	private send(header: unknown, body: any = undefined): number {
		const writer = new BufferWriter();
		serialize(writer, header);
		serialize(writer, body);
		return this.sendBuffer(writer.buffer);
	}

	private sendBuffer(message: VSBuffer): number {
		try {
			this.protocol.send(message);
			return message.byteLength;
		} catch (err) {
			// noop
			return 0;
		}
	}

	private onBuffer(message: VSBuffer): void {
		const reader = new BufferReader(message);
		const header = deserialize(reader);
		const body = deserialize(reader);
		const type: ResponseType = header[0];

		switch (type) {
			case ResponseType.Initialize:
				this.logger?.logIncoming(message.byteLength, 0, RequestInitiator.LocalSide, responseTypeToStr(type));
				return this.onResponse({ type: header[0] });

			case ResponseType.PromiseSuccess:
			case ResponseType.PromiseError:
			case ResponseType.EventFire:
			case ResponseType.PromiseErrorObj:
				this.logger?.logIncoming(message.byteLength, header[1], RequestInitiator.LocalSide, responseTypeToStr(type), body);
				return this.onResponse({ type: header[0], id: header[1], data: body });
		}
	}

	private onResponse(response: IRawResponse): void {
		if (response.type === ResponseType.Initialize) {
			this.state = State.Idle;
			this._onDidInitialize.fire();
			return;
		}

		const handler = this.handlers.get(response.id);

		handler?.(response);
	}

	@memoize
	get onDidInitializePromise(): Promise<void> {
		return Event.toPromise(this.onDidInitialize);
	}

	private whenInitialized(): Promise<void> {
		if (this.state === State.Idle) {
			return Promise.resolve();
		} else {
			return this.onDidInitializePromise;
		}
	}

	dispose(): void {
		this.isDisposed = true;
		if (this.protocolListener) {
			this.protocolListener.dispose();
			this.protocolListener = null;
		}
		dispose(this.activeRequests.values());
		this.activeRequests.clear();
	}
}

export interface ClientConnectionEvent {
	protocol: IMessagePassingProtocol;
	readonly onDidClientDisconnect: Event<void>;
}

interface Connection<TContext> extends Client<TContext> {
	readonly channelServer: ChannelServer<TContext>;
	readonly channelClient: ChannelClient;
}

/**
 * An `IPCServer` is both a channel server and a routing channel
 * client.
 *
 * As the owner of a protocol, you should extend both this
 * and the `IPCClient` classes to get IPC implementations
 * for your protocol.
 */
export class IPCServer<TContext = string> implements IChannelServer<TContext>, IRoutingChannelClient<TContext>, IConnectionHub<TContext>, IDisposable {

	private channels = new Map<string, IServerChannel<TContext>>();
	private _connections = new Set<Connection<TContext>>();

	private readonly _onDidAddConnection = new Emitter<Connection<TContext>>();
	readonly onDidAddConnection: Event<Connection<TContext>> = this._onDidAddConnection.event;

	private readonly _onDidRemoveConnection = new Emitter<Connection<TContext>>();
	readonly onDidRemoveConnection: Event<Connection<TContext>> = this._onDidRemoveConnection.event;

	private readonly disposables = new DisposableStore();

	get connections(): Connection<TContext>[] {
		const result: Connection<TContext>[] = [];
		this._connections.forEach(ctx => result.push(ctx));
		return result;
	}

	constructor(onDidClientConnect: Event<ClientConnectionEvent>, ipcLogger?: IIPCLogger | null, timeoutDelay?: number) {
		this.disposables.add(onDidClientConnect(({ protocol, onDidClientDisconnect }) => {
			const onFirstMessage = Event.once(protocol.onMessage);

			this.disposables.add(onFirstMessage(msg => {
				const reader = new BufferReader(msg);
				const ctx = deserialize(reader) as TContext;

				const channelServer = new ChannelServer(protocol, ctx, ipcLogger, timeoutDelay);
				const channelClient = new ChannelClient(protocol, ipcLogger);

				this.channels.forEach((channel, name) => channelServer.registerChannel(name, channel));

				const connection: Connection<TContext> = { channelServer, channelClient, ctx };
				this._connections.add(connection);
				this._onDidAddConnection.fire(connection);

				this.disposables.add(onDidClientDisconnect(() => {
					channelServer.dispose();
					channelClient.dispose();
					this._connections.delete(connection);
					this._onDidRemoveConnection.fire(connection);
				}));
			}));
		}));
	}

	/**
	 * Get a channel from a remote client. When passed a router,
	 * one can specify which client it wants to call and listen to/from.
	 * Otherwise, when calling without a router, a random client will
	 * be selected and when listening without a router, every client
	 * will be listened to.
	 */
	getChannel<T extends IChannel>(channelName: string, router: IClientRouter<TContext>): T;
	getChannel<T extends IChannel>(channelName: string, clientFilter: (client: Client<TContext>) => boolean): T;
	getChannel<T extends IChannel>(channelName: string, routerOrClientFilter: IClientRouter<TContext> | ((client: Client<TContext>) => boolean)): T {
		const that = this;

		// eslint-disable-next-line local/code-no-dangerous-type-assertions
		return {
			call(command: string, arg?: any, cancellationToken?: CancellationToken): Promise<T> {
				let connectionPromise: Promise<Client<TContext>>;

				if (isFunction(routerOrClientFilter)) {
					// when no router is provided, we go random client picking
					const connection = getRandomElement(that.connections.filter(routerOrClientFilter));

					connectionPromise = connection
						// if we found a client, let's call on it
						? Promise.resolve(connection)
						// else, let's wait for a client to come along
						: Event.toPromise(Event.filter(that.onDidAddConnection, routerOrClientFilter));
				} else {
					connectionPromise = routerOrClientFilter.routeCall(that, command, arg);
				}

				const channelPromise = connectionPromise
					.then(connection => (connection as Connection<TContext>).channelClient.getChannel(channelName));

				return getDelayedChannel(channelPromise)
					.call(command, arg, cancellationToken);
			},
			listen(event: string, arg: any): Event<T> {
				if (isFunction(routerOrClientFilter)) {
					return that.getMulticastEvent(channelName, routerOrClientFilter, event, arg);
				}

				const channelPromise = routerOrClientFilter.routeEvent(that, event, arg)
					.then(connection => (connection as Connection<TContext>).channelClient.getChannel(channelName));

				return getDelayedChannel(channelPromise)
					.listen(event, arg);
			}
		} as T;
	}

	private getMulticastEvent<T extends IChannel>(channelName: string, clientFilter: (client: Client<TContext>) => boolean, eventName: string, arg: any): Event<T> {
		const that = this;
		let disposables: DisposableStore | undefined;

		// Create an emitter which hooks up to all clients
		// as soon as first listener is added. It also
		// disconnects from all clients as soon as the last listener
		// is removed.
		const emitter = new Emitter<T>({
			onWillAddFirstListener: () => {
				disposables = new DisposableStore();

				// The event multiplexer is useful since the active
				// client list is dynamic. We need to hook up and disconnection
				// to/from clients as they come and go.
				const eventMultiplexer = new EventMultiplexer<T>();
				const map = new Map<Connection<TContext>, IDisposable>();

				const onDidAddConnection = (connection: Connection<TContext>) => {
					const channel = connection.channelClient.getChannel(channelName);
					const event = channel.listen<T>(eventName, arg);
					const disposable = eventMultiplexer.add(event);

					map.set(connection, disposable);
				};

				const onDidRemoveConnection = (connection: Connection<TContext>) => {
					const disposable = map.get(connection);

					if (!disposable) {
						return;
					}

					disposable.dispose();
					map.delete(connection);
				};

				that.connections.filter(clientFilter).forEach(onDidAddConnection);
				Event.filter(that.onDidAddConnection, clientFilter)(onDidAddConnection, undefined, disposables);
				that.onDidRemoveConnection(onDidRemoveConnection, undefined, disposables);
				eventMultiplexer.event(emitter.fire, emitter, disposables);

				disposables.add(eventMultiplexer);
			},
			onDidRemoveLastListener: () => {
				disposables?.dispose();
				disposables = undefined;
			}
		});
		that.disposables.add(emitter);

		return emitter.event;
	}

	registerChannel(channelName: string, channel: IServerChannel<TContext>): void {
		this.channels.set(channelName, channel);

		for (const connection of this._connections) {
			connection.channelServer.registerChannel(channelName, channel);
		}
	}

	dispose(): void {
		this.disposables.dispose();

		for (const connection of this._connections) {
			connection.channelClient.dispose();
			connection.channelServer.dispose();
		}

		this._connections.clear();
		this.channels.clear();
		this._onDidAddConnection.dispose();
		this._onDidRemoveConnection.dispose();
	}
}

/**
 * An `IPCClient` is both a channel client and a channel server.
 *
 * As the owner of a protocol, you should extend both this
 * and the `IPCServer` classes to get IPC implementations
 * for your protocol.
 */
export class IPCClient<TContext = string> implements IChannelClient, IChannelServer<TContext>, IDisposable {

	private channelClient: ChannelClient;
	private channelServer: ChannelServer<TContext>;

	constructor(protocol: IMessagePassingProtocol, ctx: TContext, ipcLogger: IIPCLogger | null = null) {
		const writer = new BufferWriter();
		serialize(writer, ctx);
		protocol.send(writer.buffer);

		this.channelClient = new ChannelClient(protocol, ipcLogger);
		this.channelServer = new ChannelServer(protocol, ctx, ipcLogger);
	}

	getChannel<T extends IChannel>(channelName: string): T {
		return this.channelClient.getChannel(channelName);
	}

	registerChannel(channelName: string, channel: IServerChannel<TContext>): void {
		this.channelServer.registerChannel(channelName, channel);
	}

	dispose(): void {
		this.channelClient.dispose();
		this.channelServer.dispose();
	}
}

export function getDelayedChannel<T extends IChannel>(promise: Promise<T>): T {
	// eslint-disable-next-line local/code-no-dangerous-type-assertions
	return {
		call(command: string, arg?: any, cancellationToken?: CancellationToken): Promise<T> {
			return promise.then(c => c.call<T>(command, arg, cancellationToken));
		},

		listen<T>(event: string, arg?: any): Event<T> {
			const relay = new Relay<any>();
			promise.then(c => relay.input = c.listen(event, arg));
			return relay.event;
		}
	} as T;
}

export function getNextTickChannel<T extends IChannel>(channel: T): T {
	let didTick = false;

	// eslint-disable-next-line local/code-no-dangerous-type-assertions
	return {
		call<T>(command: string, arg?: any, cancellationToken?: CancellationToken): Promise<T> {
			if (didTick) {
				return channel.call(command, arg, cancellationToken);
			}

			return timeout(0)
				.then(() => didTick = true)
				.then(() => channel.call<T>(command, arg, cancellationToken));
		},
		listen<T>(event: string, arg?: any): Event<T> {
			if (didTick) {
				return channel.listen<T>(event, arg);
			}

			const relay = new Relay<T>();

			timeout(0)
				.then(() => didTick = true)
				.then(() => relay.input = channel.listen<T>(event, arg));

			return relay.event;
		}
	} as T;
}

export class StaticRouter<TContext = string> implements IClientRouter<TContext> {

	constructor(private fn: (ctx: TContext) => boolean | Promise<boolean>) { }

	routeCall(hub: IConnectionHub<TContext>): Promise<Client<TContext>> {
		return this.route(hub);
	}

	routeEvent(hub: IConnectionHub<TContext>): Promise<Client<TContext>> {
		return this.route(hub);
	}

	private async route(hub: IConnectionHub<TContext>): Promise<Client<TContext>> {
		for (const connection of hub.connections) {
			if (await Promise.resolve(this.fn(connection.ctx))) {
				return Promise.resolve(connection);
			}
		}

		await Event.toPromise(hub.onDidAddConnection);
		return await this.route(hub);
	}
}

/**
 * Use ProxyChannels to automatically wrapping and unwrapping
 * services to/from IPC channels, instead of manually wrapping
 * each service method and event.
 *
 * Restrictions:
 * - If marshalling is enabled, only `URI` and `RegExp` is converted
 *   automatically for you
 * - Events must follow the naming convention `onUpperCase`
 * - `CancellationToken` is currently not supported
 * - If a context is provided, you can use `AddFirstParameterToFunctions`
 *   utility to signal this in the receiving side type
 */
export namespace ProxyChannel {

	export interface IProxyOptions {

		/**
		 * Disables automatic marshalling of `URI`.
		 * If marshalling is disabled, `UriComponents`
		 * must be used instead.
		 */
		disableMarshalling?: boolean;
	}

	export interface ICreateServiceChannelOptions extends IProxyOptions { }

	export function fromService<TContext>(service: unknown, disposables: DisposableStore, options?: ICreateServiceChannelOptions): IServerChannel<TContext> {
		const handler = service as { [key: string]: unknown };
		const disableMarshalling = options?.disableMarshalling;

		// Buffer any event that should be supported by
		// iterating over all property keys and finding them
		// However, this will not work for services that
		// are lazy and use a Proxy within. For that we
		// still need to check later (see below).
		const mapEventNameToEvent = new Map<string, Event<unknown>>();
		for (const key in handler) {
			if (propertyIsEvent(key)) {
				mapEventNameToEvent.set(key, Event.buffer(handler[key] as Event<unknown>, true, undefined, disposables));
			}
		}

		return new class implements IServerChannel {

			listen<T>(_: unknown, event: string, arg: any): Event<T> {
				const eventImpl = mapEventNameToEvent.get(event);
				if (eventImpl) {
					return eventImpl as Event<T>;
				}

				const target = handler[event];
				if (typeof target === 'function') {
					if (propertyIsDynamicEvent(event)) {
						return target.call(handler, arg);
					}

					if (propertyIsEvent(event)) {
						mapEventNameToEvent.set(event, Event.buffer(handler[event] as Event<unknown>, true, undefined, disposables));

						return mapEventNameToEvent.get(event) as Event<T>;
					}
				}

				throw new ErrorNoTelemetry(`Event not found: ${event}`);
			}

			call(_: unknown, command: string, args?: any[]): Promise<any> {
				const target = handler[command];
				if (typeof target === 'function') {

					// Revive unless marshalling disabled
					if (!disableMarshalling && Array.isArray(args)) {
						for (let i = 0; i < args.length; i++) {
							args[i] = revive(args[i]);
						}
					}

					let res = target.apply(handler, args);
					if (!(res instanceof Promise)) {
						res = Promise.resolve(res);
					}
					return res;
				}

				throw new ErrorNoTelemetry(`Method not found: ${command}`);
			}
		};
	}

	export interface ICreateProxyServiceOptions extends IProxyOptions {

		/**
		 * If provided, will add the value of `context`
		 * to each method call to the target.
		 */
		context?: unknown;

		/**
		 * If provided, will not proxy any of the properties
		 * that are part of the Map but rather return that value.
		 */
		properties?: Map<string, unknown>;
	}

	export function toService<T extends object>(channel: IChannel, options?: ICreateProxyServiceOptions): T {
		const disableMarshalling = options?.disableMarshalling;

		return new Proxy({}, {
			get(_target: T, propKey: PropertyKey) {
				if (typeof propKey === 'string') {

					// Check for predefined values
					if (options?.properties?.has(propKey)) {
						return options.properties.get(propKey);
					}

					// Dynamic Event
					if (propertyIsDynamicEvent(propKey)) {
						return function (arg: unknown) {
							return channel.listen(propKey, arg);
						};
					}

					// Event
					if (propertyIsEvent(propKey)) {
						return channel.listen(propKey);
					}

					// Function
					return async function (...args: any[]) {

						// Add context if any
						let methodArgs: any[];
						if (options && !isUndefinedOrNull(options.context)) {
							methodArgs = [options.context, ...args];
						} else {
							methodArgs = args;
						}

						const result = await channel.call(propKey, methodArgs);

						// Revive unless marshalling disabled
						if (!disableMarshalling) {
							return revive(result);
						}

						return result;
					};
				}

				throw new ErrorNoTelemetry(`Property not found: ${String(propKey)}`);
			}
		}) as T;
	}

	function propertyIsEvent(name: string): boolean {
		// Assume a property is an event if it has a form of "onSomething"
		return name[0] === 'o' && name[1] === 'n' && strings.isUpperAsciiLetter(name.charCodeAt(2));
	}

	function propertyIsDynamicEvent(name: string): boolean {
		// Assume a property is a dynamic event (a method that returns an event) if it has a form of "onDynamicSomething"
		return /^onDynamic/.test(name) && strings.isUpperAsciiLetter(name.charCodeAt(9));
	}
}

const colorTables = [
	['#2977B1', '#FC802D', '#34A13A', '#D3282F', '#9366BA'],
	['#8B564C', '#E177C0', '#7F7F7F', '#BBBE3D', '#2EBECD']
];

function prettyWithoutArrays(data: unknown): any {
	if (Array.isArray(data)) {
		return data;
	}
	if (data && typeof data === 'object' && typeof data.toString === 'function') {
		const result = data.toString();
		if (result !== '[object Object]') {
			return result;
		}
	}
	return data;
}

function pretty(data: unknown): any {
	if (Array.isArray(data)) {
		return data.map(prettyWithoutArrays);
	}
	return prettyWithoutArrays(data);
}

function logWithColors(direction: string, totalLength: number, msgLength: number, req: number, initiator: RequestInitiator, str: string, data: any): void {
	data = pretty(data);

	const colorTable = colorTables[initiator];
	const color = colorTable[req % colorTable.length];
	let args = [`%c[${direction}]%c[${String(totalLength).padStart(7, ' ')}]%c[len: ${String(msgLength).padStart(5, ' ')}]%c${String(req).padStart(5, ' ')} - ${str}`, 'color: darkgreen', 'color: grey', 'color: grey', `color: ${color}`];
	if (/\($/.test(str)) {
		args = args.concat(data);
		args.push(')');
	} else {
		args.push(data);
	}
	console.log.apply(console, args as [string, ...string[]]);
}

export class IPCLogger implements IIPCLogger {
	private _totalIncoming = 0;
	private _totalOutgoing = 0;

	constructor(
		private readonly _outgoingPrefix: string,
		private readonly _incomingPrefix: string,
	) { }

	public logOutgoing(msgLength: number, requestId: number, initiator: RequestInitiator, str: string, data?: any): void {
		this._totalOutgoing += msgLength;
		logWithColors(this._outgoingPrefix, this._totalOutgoing, msgLength, requestId, initiator, str, data);
	}

	public logIncoming(msgLength: number, requestId: number, initiator: RequestInitiator, str: string, data?: any): void {
		this._totalIncoming += msgLength;
		logWithColors(this._incomingPrefix, this._totalIncoming, msgLength, requestId, initiator, str, data);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/ipc/electron-browser/ipc.electron.ts]---
Location: vscode-main/src/vs/base/parts/ipc/electron-browser/ipc.electron.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../common/buffer.js';
import { Event } from '../../../common/event.js';
import { IDisposable } from '../../../common/lifecycle.js';
import { IPCClient } from '../common/ipc.js';
import { Protocol as ElectronProtocol } from '../common/ipc.electron.js';
import { ipcRenderer } from '../../sandbox/electron-browser/globals.js';

/**
 * An implementation of `IPCClient` on top of Electron `ipcRenderer` IPC communication
 * provided from sandbox globals (via preload script).
 */
export class Client extends IPCClient implements IDisposable {

	private protocol: ElectronProtocol;

	private static createProtocol(): ElectronProtocol {
		const onMessage = Event.fromNodeEventEmitter<VSBuffer>(ipcRenderer, 'vscode:message', (_, message) => VSBuffer.wrap(message));
		ipcRenderer.send('vscode:hello');

		return new ElectronProtocol(ipcRenderer, onMessage);
	}

	constructor(id: string) {
		const protocol = Client.createProtocol();
		super(protocol, id);

		this.protocol = protocol;
	}

	override dispose(): void {
		this.protocol.disconnect();
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/ipc/electron-browser/ipc.mp.ts]---
Location: vscode-main/src/vs/base/parts/ipc/electron-browser/ipc.mp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { mainWindow } from '../../../browser/window.js';
import { Event } from '../../../common/event.js';
import { generateUuid } from '../../../common/uuid.js';
import { ipcMessagePort, ipcRenderer } from '../../sandbox/electron-browser/globals.js';

interface IMessageChannelResult {
	nonce: string;
	port: MessagePort;
	source: unknown;
}

export async function acquirePort(requestChannel: string | undefined, responseChannel: string, nonce = generateUuid()): Promise<MessagePort> {

	// Get ready to acquire the message port from the
	// provided `responseChannel` via preload helper.
	ipcMessagePort.acquire(responseChannel, nonce);

	// If a `requestChannel` is provided, we are in charge
	// to trigger acquisition of the message port from main
	if (typeof requestChannel === 'string') {
		ipcRenderer.send(requestChannel, nonce);
	}

	// Wait until the main side has returned the `MessagePort`
	// We need to filter by the `nonce` to ensure we listen
	// to the right response.
	const onMessageChannelResult = Event.fromDOMEventEmitter<IMessageChannelResult>(mainWindow, 'message', (e: MessageEvent) => ({ nonce: e.data, port: e.ports[0], source: e.source }));
	const { port } = await Event.toPromise(Event.once(Event.filter(onMessageChannelResult, e => e.nonce === nonce && e.source === mainWindow)));

	return port;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/ipc/electron-main/ipc.electron.ts]---
Location: vscode-main/src/vs/base/parts/ipc/electron-main/ipc.electron.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WebContents } from 'electron';
import { validatedIpcMain } from './ipcMain.js';
import { VSBuffer } from '../../../common/buffer.js';
import { Emitter, Event } from '../../../common/event.js';
import { IDisposable, toDisposable } from '../../../common/lifecycle.js';
import { ClientConnectionEvent, IPCServer } from '../common/ipc.js';
import { Protocol as ElectronProtocol } from '../common/ipc.electron.js';

interface IIPCEvent {
	event: { sender: WebContents };
	message: Buffer | null;
}

function createScopedOnMessageEvent(senderId: number, eventName: string): Event<VSBuffer | null> {
	const onMessage = Event.fromNodeEventEmitter<IIPCEvent>(validatedIpcMain, eventName, (event, message) => ({ event, message }));
	const onMessageFromSender = Event.filter(onMessage, ({ event }) => event.sender.id === senderId);

	return Event.map(onMessageFromSender, ({ message }) => message ? VSBuffer.wrap(message) : message);
}

/**
 * An implementation of `IPCServer` on top of Electron `ipcMain` API.
 */
export class Server extends IPCServer {

	private static readonly Clients = new Map<number, IDisposable>();

	private static getOnDidClientConnect(): Event<ClientConnectionEvent> {
		const onHello = Event.fromNodeEventEmitter<WebContents>(validatedIpcMain, 'vscode:hello', ({ sender }) => sender);

		return Event.map(onHello, webContents => {
			const id = webContents.id;
			const client = Server.Clients.get(id);

			client?.dispose();

			const onDidClientReconnect = new Emitter<void>();
			Server.Clients.set(id, toDisposable(() => onDidClientReconnect.fire()));

			const onMessage = createScopedOnMessageEvent(id, 'vscode:message') as Event<VSBuffer>;
			const onDidClientDisconnect = Event.any(Event.signal(createScopedOnMessageEvent(id, 'vscode:disconnect')), onDidClientReconnect.event);
			const protocol = new ElectronProtocol(webContents, onMessage);

			return { protocol, onDidClientDisconnect };
		});
	}

	constructor() {
		super(Server.getOnDidClientConnect());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/ipc/electron-main/ipc.mp.ts]---
Location: vscode-main/src/vs/base/parts/ipc/electron-main/ipc.mp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrowserWindow, IpcMainEvent, MessagePortMain } from 'electron';
import { validatedIpcMain } from './ipcMain.js';
import { Event } from '../../../common/event.js';
import { IDisposable } from '../../../common/lifecycle.js';
import { generateUuid } from '../../../common/uuid.js';
import { Client as MessagePortClient } from '../common/ipc.mp.js';

/**
 * An implementation of a `IPCClient` on top of Electron `MessagePortMain`.
 */
export class Client extends MessagePortClient implements IDisposable {

	/**
	 * @param clientId a way to uniquely identify this client among
	 * other clients. this is important for routing because every
	 * client can also be a server
	 */
	constructor(port: MessagePortMain, clientId: string) {
		super({
			addEventListener: (type, listener) => port.addListener(type, listener),
			removeEventListener: (type, listener) => port.removeListener(type, listener),
			postMessage: message => port.postMessage(message),
			start: () => port.start(),
			close: () => port.close()
		}, clientId);
	}
}

/**
 * This method opens a message channel connection
 * in the target window. The target window needs
 * to use the `Server` from `electron-browser/ipc.mp`.
 */
export async function connect(window: BrowserWindow): Promise<MessagePortMain> {

	// Assert healthy window to talk to
	if (window.isDestroyed() || window.webContents.isDestroyed()) {
		throw new Error('ipc.mp#connect: Cannot talk to window because it is closed or destroyed');
	}

	// Ask to create message channel inside the window
	// and send over a UUID to correlate the response
	const nonce = generateUuid();
	window.webContents.send('vscode:createMessageChannel', nonce);

	// Wait until the window has returned the `MessagePort`
	// We need to filter by the `nonce` to ensure we listen
	// to the right response.
	const onMessageChannelResult = Event.fromNodeEventEmitter<{ nonce: string; port: MessagePortMain }>(validatedIpcMain, 'vscode:createMessageChannelResult', (e: IpcMainEvent, nonce: string) => ({ nonce, port: e.ports[0] }));
	const { port } = await Event.toPromise(Event.once(Event.filter(onMessageChannelResult, e => e.nonce === nonce)));

	return port;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/ipc/electron-main/ipcMain.ts]---
Location: vscode-main/src/vs/base/parts/ipc/electron-main/ipcMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import electron from 'electron';
import { onUnexpectedError } from '../../../common/errors.js';
import { Event } from '../../../common/event.js';
import { VSCODE_AUTHORITY } from '../../../common/network.js';

type ipcMainListener = (event: electron.IpcMainEvent, ...args: any[]) => void;

class ValidatedIpcMain implements Event.NodeEventEmitter {

	// We need to keep a map of original listener to the wrapped variant in order
	// to properly implement `removeListener`. We use a `WeakMap` because we do
	// not want to prevent the `key` of the map to get garbage collected.
	private readonly mapListenerToWrapper = new WeakMap<ipcMainListener, ipcMainListener>();

	/**
	 * Listens to `channel`, when a new message arrives `listener` would be called with
	 * `listener(event, args...)`.
	 */
	on(channel: string, listener: ipcMainListener): this {

		// Remember the wrapped listener so that later we can
		// properly implement `removeListener`.
		const wrappedListener = (event: electron.IpcMainEvent, ...args: any[]) => {
			if (this.validateEvent(channel, event)) {
				listener(event, ...args);
			}
		};

		this.mapListenerToWrapper.set(listener, wrappedListener);

		electron.ipcMain.on(channel, wrappedListener);

		return this;
	}

	/**
	 * Adds a one time `listener` function for the event. This `listener` is invoked
	 * only the next time a message is sent to `channel`, after which it is removed.
	 */
	once(channel: string, listener: ipcMainListener): this {
		electron.ipcMain.once(channel, (event: electron.IpcMainEvent, ...args: any[]) => {
			if (this.validateEvent(channel, event)) {
				listener(event, ...args);
			}
		});

		return this;
	}

	/**
	 * Adds a handler for an `invoke`able IPC. This handler will be called whenever a
	 * renderer calls `ipcRenderer.invoke(channel, ...args)`.
	 *
	 * If `listener` returns a Promise, the eventual result of the promise will be
	 * returned as a reply to the remote caller. Otherwise, the return value of the
	 * listener will be used as the value of the reply.
	 *
	 * The `event` that is passed as the first argument to the handler is the same as
	 * that passed to a regular event listener. It includes information about which
	 * WebContents is the source of the invoke request.
	 *
	 * Errors thrown through `handle` in the main process are not transparent as they
	 * are serialized and only the `message` property from the original error is
	 * provided to the renderer process. Please refer to #24427 for details.
	 */
	handle(channel: string, listener: (event: electron.IpcMainInvokeEvent, ...args: any[]) => Promise<unknown>): this {
		electron.ipcMain.handle(channel, (event: electron.IpcMainInvokeEvent, ...args: any[]) => {
			if (this.validateEvent(channel, event)) {
				return listener(event, ...args);
			}

			return Promise.reject(`Invalid channel '${channel}' or sender for ipcMain.handle() usage.`);
		});

		return this;
	}

	/**
	 * Removes any handler for `channel`, if present.
	 */
	removeHandler(channel: string): this {
		electron.ipcMain.removeHandler(channel);

		return this;
	}

	/**
	 * Removes the specified `listener` from the listener array for the specified
	 * `channel`.
	 */
	removeListener(channel: string, listener: ipcMainListener): this {
		const wrappedListener = this.mapListenerToWrapper.get(listener);
		if (wrappedListener) {
			electron.ipcMain.removeListener(channel, wrappedListener);
			this.mapListenerToWrapper.delete(listener);
		}

		return this;
	}

	private validateEvent(channel: string, event: electron.IpcMainEvent | electron.IpcMainInvokeEvent): boolean {
		if (!channel?.startsWith('vscode:')) {
			onUnexpectedError(`Refused to handle ipcMain event for channel '${channel}' because the channel is unknown.`);
			return false; // unexpected channel
		}

		const sender = event.senderFrame;

		const url = sender?.url;
		// `url` can be `undefined` when running tests from playwright https://github.com/microsoft/vscode/issues/147301
		// and `url` can be `about:blank` when reloading the window
		// from performance tab of devtools https://github.com/electron/electron/issues/39427.
		// It is fine to skip the checks in these cases.
		if (!url || url === 'about:blank') {
			return true;
		}

		let host = 'unknown';
		try {
			host = new URL(url).host;
		} catch (error) {
			onUnexpectedError(`Refused to handle ipcMain event for channel '${channel}' because of a malformed URL '${url}'.`);
			return false; // unexpected URL
		}

		if (process.env.VSCODE_DEV) {
			if (url === process.env.DEV_WINDOW_SRC && (host === 'localhost' || host.startsWith('localhost:'))) {
				return true; // development support where the window is served from localhost
			}
		}

		if (host !== VSCODE_AUTHORITY) {
			onUnexpectedError(`Refused to handle ipcMain event for channel '${channel}' because of a bad origin of '${host}'.`);
			return false; // unexpected sender
		}

		if (sender?.parent !== null) {
			onUnexpectedError(`Refused to handle ipcMain event for channel '${channel}' because sender of origin '${host}' is not a main frame.`);
			return false; // unexpected frame
		}

		return true;
	}
}

/**
 * A drop-in replacement of `ipcMain` that validates the sender of a message
 * according to https://github.com/electron/electron/blob/main/docs/tutorial/security.md
 *
 * @deprecated direct use of Electron IPC is not encouraged. We have utilities in place
 * to create services on top of IPC, see `ProxyChannel` for more information.
 */
export const validatedIpcMain = new ValidatedIpcMain();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/ipc/node/ipc.cp.ts]---
Location: vscode-main/src/vs/base/parts/ipc/node/ipc.cp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ChildProcess, fork, ForkOptions } from 'child_process';
import { createCancelablePromise, Delayer } from '../../../common/async.js';
import { VSBuffer } from '../../../common/buffer.js';
import { CancellationToken } from '../../../common/cancellation.js';
import { isRemoteConsoleLog, log } from '../../../common/console.js';
import * as errors from '../../../common/errors.js';
import { Emitter, Event } from '../../../common/event.js';
import { dispose, IDisposable, toDisposable } from '../../../common/lifecycle.js';
import { deepClone } from '../../../common/objects.js';
import { createQueuedSender } from '../../../node/processes.js';
import { removeDangerousEnvVariables } from '../../../common/processes.js';
import { ChannelClient as IPCClient, ChannelServer as IPCServer, IChannel, IChannelClient } from '../common/ipc.js';

/**
 * This implementation doesn't perform well since it uses base64 encoding for buffers.
 * We should move all implementations to use named ipc.net, so we stop depending on cp.fork.
 */

export class Server<TContext extends string> extends IPCServer<TContext> {
	constructor(ctx: TContext) {
		super({
			send: r => {
				try {
					process.send?.((<Buffer>r.buffer).toString('base64'));
				} catch (e) { /* not much to do */ }
			},
			onMessage: Event.fromNodeEventEmitter(process, 'message', msg => VSBuffer.wrap(Buffer.from(msg, 'base64')))
		}, ctx);

		process.once('disconnect', () => this.dispose());
	}
}

export interface IIPCOptions {

	/**
	 * A descriptive name for the server this connection is to. Used in logging.
	 */
	serverName: string;

	/**
	 * Time in millies before killing the ipc process. The next request after killing will start it again.
	 */
	timeout?: number;

	/**
	 * Arguments to the module to execute.
	 */
	args?: string[];

	/**
	 * Environment key-value pairs to be passed to the process that gets spawned for the ipc.
	 */
	env?: any;

	/**
	 * Allows to assign a debug port for debugging the application executed.
	 */
	debug?: number;

	/**
	 * Allows to assign a debug port for debugging the application and breaking it on the first line.
	 */
	debugBrk?: number;

	/**
	 * If set, starts the fork with empty execArgv. If not set, execArgv from the parent process are inherited,
	 * except --inspect= and --inspect-brk= which are filtered as they would result in a port conflict.
	 */
	freshExecArgv?: boolean;

	/**
	 * Enables our createQueuedSender helper for this Client. Uses a queue when the internal Node.js queue is
	 * full of messages - see notes on that method.
	 */
	useQueue?: boolean;
}

export class Client implements IChannelClient, IDisposable {

	private disposeDelayer: Delayer<void> | undefined;
	private activeRequests = new Set<IDisposable>();
	private child: ChildProcess | null;
	private _client: IPCClient | null;
	private channels = new Map<string, IChannel>();

	private readonly _onDidProcessExit = new Emitter<{ code: number; signal: string }>();
	readonly onDidProcessExit = this._onDidProcessExit.event;

	constructor(private modulePath: string, private options: IIPCOptions) {
		const timeout = options.timeout || 60000;
		this.disposeDelayer = new Delayer<void>(timeout);
		this.child = null;
		this._client = null;
	}

	getChannel<T extends IChannel>(channelName: string): T {
		const that = this;

		// eslint-disable-next-line local/code-no-dangerous-type-assertions
		return {
			call<T>(command: string, arg?: any, cancellationToken?: CancellationToken): Promise<T> {
				return that.requestPromise<T>(channelName, command, arg, cancellationToken);
			},
			listen(event: string, arg?: any) {
				return that.requestEvent(channelName, event, arg);
			}
		} as T;
	}

	protected requestPromise<T>(channelName: string, name: string, arg?: any, cancellationToken = CancellationToken.None): Promise<T> {
		if (!this.disposeDelayer) {
			return Promise.reject(new Error('disposed'));
		}

		if (cancellationToken.isCancellationRequested) {
			return Promise.reject(errors.canceled());
		}

		this.disposeDelayer.cancel();

		const channel = this.getCachedChannel(channelName);
		const result = createCancelablePromise(token => channel.call<T>(name, arg, token));
		const cancellationTokenListener = cancellationToken.onCancellationRequested(() => result.cancel());

		const disposable = toDisposable(() => result.cancel());
		this.activeRequests.add(disposable);

		result.finally(() => {
			cancellationTokenListener.dispose();
			this.activeRequests.delete(disposable);

			if (this.activeRequests.size === 0 && this.disposeDelayer) {
				this.disposeDelayer.trigger(() => this.disposeClient());
			}
		});

		return result;
	}

	protected requestEvent<T>(channelName: string, name: string, arg?: any): Event<T> {
		if (!this.disposeDelayer) {
			return Event.None;
		}

		this.disposeDelayer.cancel();

		let listener: IDisposable;
		const emitter = new Emitter<any>({
			onWillAddFirstListener: () => {
				const channel = this.getCachedChannel(channelName);
				const event: Event<T> = channel.listen(name, arg);

				listener = event(emitter.fire, emitter);
				this.activeRequests.add(listener);
			},
			onDidRemoveLastListener: () => {
				this.activeRequests.delete(listener);
				listener.dispose();

				if (this.activeRequests.size === 0 && this.disposeDelayer) {
					this.disposeDelayer.trigger(() => this.disposeClient());
				}
			}
		});

		return emitter.event;
	}

	private get client(): IPCClient {
		if (!this._client) {
			const args = this.options.args || [];
			const forkOpts: ForkOptions = Object.create(null);

			forkOpts.env = { ...deepClone(process.env), 'VSCODE_PARENT_PID': String(process.pid) };

			if (this.options.env) {
				forkOpts.env = { ...forkOpts.env, ...this.options.env };
			}

			if (this.options.freshExecArgv) {
				forkOpts.execArgv = [];
			}

			if (typeof this.options.debug === 'number') {
				forkOpts.execArgv = ['--nolazy', '--inspect=' + this.options.debug];
			}

			if (typeof this.options.debugBrk === 'number') {
				forkOpts.execArgv = ['--nolazy', '--inspect-brk=' + this.options.debugBrk];
			}

			if (forkOpts.execArgv === undefined) {
				forkOpts.execArgv = process.execArgv			// if not set, the forked process inherits the execArgv of the parent process
					.filter(a => !/^--inspect(-brk)?=/.test(a)) // --inspect and --inspect-brk can not be inherited as the port would conflict
					.filter(a => !a.startsWith('--vscode-')); 	// --vscode-* arguments are unsupported by node.js and thus need to remove
			}

			removeDangerousEnvVariables(forkOpts.env);

			this.child = fork(this.modulePath, args, forkOpts);

			const onMessageEmitter = new Emitter<VSBuffer>();
			const onRawMessage = Event.fromNodeEventEmitter(this.child, 'message', msg => msg);

			const rawMessageDisposable = onRawMessage(msg => {

				// Handle remote console logs specially
				if (isRemoteConsoleLog(msg)) {
					log(msg, `IPC Library: ${this.options.serverName}`);
					return;
				}

				// Anything else goes to the outside
				onMessageEmitter.fire(VSBuffer.wrap(Buffer.from(msg, 'base64')));
			});

			const sender = this.options.useQueue ? createQueuedSender(this.child) : this.child;
			const send = (r: VSBuffer) => this.child?.connected && sender.send((<Buffer>r.buffer).toString('base64'));
			const onMessage = onMessageEmitter.event;
			const protocol = { send, onMessage };

			this._client = new IPCClient(protocol);

			const onExit = () => this.disposeClient();
			process.once('exit', onExit);

			this.child.on('error', err => console.warn('IPC "' + this.options.serverName + '" errored with ' + err));

			this.child.on('exit', (code: any, signal: any) => {
				process.removeListener('exit' as 'loaded', onExit); // https://github.com/electron/electron/issues/21475
				rawMessageDisposable.dispose();

				this.activeRequests.forEach(r => dispose(r));
				this.activeRequests.clear();

				if (code !== 0 && signal !== 'SIGTERM') {
					console.warn('IPC "' + this.options.serverName + '" crashed with exit code ' + code + ' and signal ' + signal);
				}

				this.disposeDelayer?.cancel();
				this.disposeClient();
				this._onDidProcessExit.fire({ code, signal });
			});
		}

		return this._client;
	}

	private getCachedChannel(name: string): IChannel {
		let channel = this.channels.get(name);

		if (!channel) {
			channel = this.client.getChannel(name);
			this.channels.set(name, channel);
		}

		return channel;
	}

	private disposeClient() {
		if (this._client) {
			if (this.child) {
				this.child.kill();
				this.child = null;
			}
			this._client = null;
			this.channels.clear();
		}
	}

	dispose() {
		this._onDidProcessExit.dispose();
		this.disposeDelayer?.cancel();
		this.disposeDelayer = undefined;
		this.disposeClient();
		this.activeRequests.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/ipc/node/ipc.mp.ts]---
Location: vscode-main/src/vs/base/parts/ipc/node/ipc.mp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MessagePortMain, isUtilityProcess, MessageEvent } from '../../sandbox/node/electronTypes.js';
import { VSBuffer } from '../../../common/buffer.js';
import { ClientConnectionEvent, IMessagePassingProtocol, IPCServer } from '../common/ipc.js';
import { Emitter, Event } from '../../../common/event.js';
import { assertType } from '../../../common/types.js';

/**
 * The MessagePort `Protocol` leverages MessagePortMain style IPC communication
 * for the implementation of the `IMessagePassingProtocol`.
 */
class Protocol implements IMessagePassingProtocol {

	readonly onMessage;

	constructor(private port: MessagePortMain) {
		this.onMessage = Event.fromNodeEventEmitter<VSBuffer>(this.port, 'message', (e: MessageEvent) => {
			if (e.data) {
				return VSBuffer.wrap(e.data as Uint8Array);
			}
			return VSBuffer.alloc(0);
		});
		// we must call start() to ensure messages are flowing
		port.start();
	}

	send(message: VSBuffer): void {
		this.port.postMessage(message.buffer);
	}

	disconnect(): void {
		this.port.close();
	}
}

export interface IClientConnectionFilter {

	/**
	 * Allows to filter incoming messages to the
	 * server to handle them differently.
	 *
	 * @param e the message event to handle
	 * @returns `true` if the event was handled
	 * and should not be processed by the server.
	 */
	handledClientConnection(e: MessageEvent): boolean;
}

/**
 * An implementation of a `IPCServer` on top of MessagePort style IPC communication.
 * The clients register themselves via Electron Utility Process IPC transfer.
 */
export class Server extends IPCServer {

	private static getOnDidClientConnect(filter?: IClientConnectionFilter): Event<ClientConnectionEvent> {
		assertType(isUtilityProcess(process), 'Electron Utility Process');

		const onCreateMessageChannel = new Emitter<MessagePortMain>();

		process.parentPort.on('message', (e: MessageEvent) => {
			if (filter?.handledClientConnection(e)) {
				return;
			}

			const port = e.ports.at(0);
			if (port) {
				onCreateMessageChannel.fire(port);
			}
		});

		return Event.map(onCreateMessageChannel.event, port => {
			const protocol = new Protocol(port);

			const result: ClientConnectionEvent = {
				protocol,
				// Not part of the standard spec, but in Electron we get a `close` event
				// when the other side closes. We can use this to detect disconnects
				// (https://github.com/electron/electron/blob/11-x-y/docs/api/message-port-main.md#event-close)
				onDidClientDisconnect: Event.fromNodeEventEmitter(port, 'close')
			};

			return result;
		});
	}

	constructor(filter?: IClientConnectionFilter) {
		super(Server.getOnDidClientConnect(filter));
	}
}

interface INodeMessagePortFragment {
	on(event: 'message', listener: (messageEvent: MessageEvent) => void): this;
	removeListener(event: 'message', listener: (messageEvent: MessageEvent) => void): this;
}

export function once(port: INodeMessagePortFragment, message: unknown, callback: () => void): void {
	const listener = (e: MessageEvent) => {
		if (e.data === message) {
			port.removeListener('message', listener);
			callback();
		}
	};

	port.on('message', listener);
}
```

--------------------------------------------------------------------------------

````
