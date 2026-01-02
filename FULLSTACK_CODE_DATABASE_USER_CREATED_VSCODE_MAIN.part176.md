---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 176
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 176 of 552)

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

---[FILE: src/vs/base/common/path.ts]---
Location: vscode-main/src/vs/base/common/path.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// NOTE: VSCode's copy of nodejs path library to be usable in common (non-node) namespace
// Copied from: https://github.com/nodejs/node/commits/v22.15.0/lib/path.js
// Excluding: the change that adds primordials
// (https://github.com/nodejs/node/commit/187a862d221dec42fa9a5c4214e7034d9092792f and others)
// Excluding: the change that adds glob matching
// (https://github.com/nodejs/node/commit/57b8b8e18e5e2007114c63b71bf0baedc01936a6)

/**
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import * as process from './process.js';

const CHAR_UPPERCASE_A = 65;/* A */
const CHAR_LOWERCASE_A = 97; /* a */
const CHAR_UPPERCASE_Z = 90; /* Z */
const CHAR_LOWERCASE_Z = 122; /* z */
const CHAR_DOT = 46; /* . */
const CHAR_FORWARD_SLASH = 47; /* / */
const CHAR_BACKWARD_SLASH = 92; /* \ */
const CHAR_COLON = 58; /* : */
const CHAR_QUESTION_MARK = 63; /* ? */

class ErrorInvalidArgType extends Error {
	code: 'ERR_INVALID_ARG_TYPE';
	constructor(name: string, expected: string, actual: unknown) {
		// determiner: 'must be' or 'must not be'
		let determiner;
		if (typeof expected === 'string' && expected.indexOf('not ') === 0) {
			determiner = 'must not be';
			expected = expected.replace(/^not /, '');
		} else {
			determiner = 'must be';
		}

		const type = name.indexOf('.') !== -1 ? 'property' : 'argument';
		let msg = `The "${name}" ${type} ${determiner} of type ${expected}`;

		msg += `. Received type ${typeof actual}`;
		super(msg);

		this.code = 'ERR_INVALID_ARG_TYPE';
	}
}

function validateObject(pathObject: object, name: string) {
	if (pathObject === null || typeof pathObject !== 'object') {
		throw new ErrorInvalidArgType(name, 'Object', pathObject);
	}
}

function validateString(value: string, name: string) {
	if (typeof value !== 'string') {
		throw new ErrorInvalidArgType(name, 'string', value);
	}
}

const platformIsWin32 = (process.platform === 'win32');

function isPathSeparator(code: number | undefined) {
	return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
}

function isPosixPathSeparator(code: number | undefined) {
	return code === CHAR_FORWARD_SLASH;
}

function isWindowsDeviceRoot(code: number) {
	return (code >= CHAR_UPPERCASE_A && code <= CHAR_UPPERCASE_Z) ||
		(code >= CHAR_LOWERCASE_A && code <= CHAR_LOWERCASE_Z);
}

// Resolves . and .. elements in a path with directory names
function normalizeString(path: string, allowAboveRoot: boolean, separator: string, isPathSeparator: (code?: number) => boolean) {
	let res = '';
	let lastSegmentLength = 0;
	let lastSlash = -1;
	let dots = 0;
	let code = 0;
	for (let i = 0; i <= path.length; ++i) {
		if (i < path.length) {
			code = path.charCodeAt(i);
		}
		else if (isPathSeparator(code)) {
			break;
		}
		else {
			code = CHAR_FORWARD_SLASH;
		}

		if (isPathSeparator(code)) {
			if (lastSlash === i - 1 || dots === 1) {
				// NOOP
			} else if (dots === 2) {
				if (res.length < 2 || lastSegmentLength !== 2 ||
					res.charCodeAt(res.length - 1) !== CHAR_DOT ||
					res.charCodeAt(res.length - 2) !== CHAR_DOT) {
					if (res.length > 2) {
						const lastSlashIndex = res.lastIndexOf(separator);
						if (lastSlashIndex === -1) {
							res = '';
							lastSegmentLength = 0;
						} else {
							res = res.slice(0, lastSlashIndex);
							lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
						}
						lastSlash = i;
						dots = 0;
						continue;
					} else if (res.length !== 0) {
						res = '';
						lastSegmentLength = 0;
						lastSlash = i;
						dots = 0;
						continue;
					}
				}
				if (allowAboveRoot) {
					res += res.length > 0 ? `${separator}..` : '..';
					lastSegmentLength = 2;
				}
			} else {
				if (res.length > 0) {
					res += `${separator}${path.slice(lastSlash + 1, i)}`;
				}
				else {
					res = path.slice(lastSlash + 1, i);
				}
				lastSegmentLength = i - lastSlash - 1;
			}
			lastSlash = i;
			dots = 0;
		} else if (code === CHAR_DOT && dots !== -1) {
			++dots;
		} else {
			dots = -1;
		}
	}
	return res;
}

function formatExt(ext: string): string {
	return ext ? `${ext[0] === '.' ? '' : '.'}${ext}` : '';
}

function _format(sep: string, pathObject: ParsedPath) {
	validateObject(pathObject, 'pathObject');
	const dir = pathObject.dir || pathObject.root;
	const base = pathObject.base ||
		`${pathObject.name || ''}${formatExt(pathObject.ext)}`;
	if (!dir) {
		return base;
	}
	return dir === pathObject.root ? `${dir}${base}` : `${dir}${sep}${base}`;
}

export interface ParsedPath {
	root: string;
	dir: string;
	base: string;
	ext: string;
	name: string;
}

export interface IPath {
	normalize(path: string): string;
	isAbsolute(path: string): boolean;
	join(...paths: string[]): string;
	resolve(...pathSegments: string[]): string;
	relative(from: string, to: string): string;
	dirname(path: string): string;
	basename(path: string, suffix?: string): string;
	extname(path: string): string;
	format(pathObject: ParsedPath): string;
	parse(path: string): ParsedPath;
	toNamespacedPath(path: string): string;
	sep: '\\' | '/';
	delimiter: string;
	win32: IPath | null;
	posix: IPath | null;
}

export const win32: IPath = {
	// path.resolve([from ...], to)
	resolve(...pathSegments: string[]): string {
		let resolvedDevice = '';
		let resolvedTail = '';
		let resolvedAbsolute = false;

		for (let i = pathSegments.length - 1; i >= -1; i--) {
			let path;
			if (i >= 0) {
				path = pathSegments[i];
				validateString(path, `paths[${i}]`);

				// Skip empty entries
				if (path.length === 0) {
					continue;
				}
			} else if (resolvedDevice.length === 0) {
				path = process.cwd();
			} else {
				// Windows has the concept of drive-specific current working
				// directories. If we've resolved a drive letter but not yet an
				// absolute path, get cwd for that drive, or the process cwd if
				// the drive cwd is not available. We're sure the device is not
				// a UNC path at this points, because UNC paths are always absolute.
				path = process.env[`=${resolvedDevice}`] || process.cwd();

				// Verify that a cwd was found and that it actually points
				// to our drive. If not, default to the drive's root.
				if (path === undefined ||
					(path.slice(0, 2).toLowerCase() !== resolvedDevice.toLowerCase() &&
						path.charCodeAt(2) === CHAR_BACKWARD_SLASH)) {
					path = `${resolvedDevice}\\`;
				}
			}

			const len = path.length;
			let rootEnd = 0;
			let device = '';
			let isAbsolute = false;
			const code = path.charCodeAt(0);

			// Try to match a root
			if (len === 1) {
				if (isPathSeparator(code)) {
					// `path` contains just a path separator
					rootEnd = 1;
					isAbsolute = true;
				}
			} else if (isPathSeparator(code)) {
				// Possible UNC root

				// If we started with a separator, we know we at least have an
				// absolute path of some kind (UNC or otherwise)
				isAbsolute = true;

				if (isPathSeparator(path.charCodeAt(1))) {
					// Matched double path separator at beginning
					let j = 2;
					let last = j;
					// Match 1 or more non-path separators
					while (j < len && !isPathSeparator(path.charCodeAt(j))) {
						j++;
					}
					if (j < len && j !== last) {
						const firstPart = path.slice(last, j);
						// Matched!
						last = j;
						// Match 1 or more path separators
						while (j < len && isPathSeparator(path.charCodeAt(j))) {
							j++;
						}
						if (j < len && j !== last) {
							// Matched!
							last = j;
							// Match 1 or more non-path separators
							while (j < len && !isPathSeparator(path.charCodeAt(j))) {
								j++;
							}
							if (j === len || j !== last) {
								// We matched a UNC root
								device = `\\\\${firstPart}\\${path.slice(last, j)}`;
								rootEnd = j;
							}
						}
					}
				} else {
					rootEnd = 1;
				}
			} else if (isWindowsDeviceRoot(code) &&
				path.charCodeAt(1) === CHAR_COLON) {
				// Possible device root
				device = path.slice(0, 2);
				rootEnd = 2;
				if (len > 2 && isPathSeparator(path.charCodeAt(2))) {
					// Treat separator following drive name as an absolute path
					// indicator
					isAbsolute = true;
					rootEnd = 3;
				}
			}

			if (device.length > 0) {
				if (resolvedDevice.length > 0) {
					if (device.toLowerCase() !== resolvedDevice.toLowerCase()) {
						// This path points to another device so it is not applicable
						continue;
					}
				} else {
					resolvedDevice = device;
				}
			}

			if (resolvedAbsolute) {
				if (resolvedDevice.length > 0) {
					break;
				}
			} else {
				resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
				resolvedAbsolute = isAbsolute;
				if (isAbsolute && resolvedDevice.length > 0) {
					break;
				}
			}
		}

		// At this point the path should be resolved to a full absolute path,
		// but handle relative paths to be safe (might happen when process.cwd()
		// fails)

		// Normalize the tail path
		resolvedTail = normalizeString(resolvedTail, !resolvedAbsolute, '\\',
			isPathSeparator);

		return resolvedAbsolute ?
			`${resolvedDevice}\\${resolvedTail}` :
			`${resolvedDevice}${resolvedTail}` || '.';
	},

	normalize(path: string): string {
		validateString(path, 'path');
		const len = path.length;
		if (len === 0) {
			return '.';
		}
		let rootEnd = 0;
		let device;
		let isAbsolute = false;
		const code = path.charCodeAt(0);

		// Try to match a root
		if (len === 1) {
			// `path` contains just a single char, exit early to avoid
			// unnecessary work
			return isPosixPathSeparator(code) ? '\\' : path;
		}
		if (isPathSeparator(code)) {
			// Possible UNC root

			// If we started with a separator, we know we at least have an absolute
			// path of some kind (UNC or otherwise)
			isAbsolute = true;

			if (isPathSeparator(path.charCodeAt(1))) {
				// Matched double path separator at beginning
				let j = 2;
				let last = j;
				// Match 1 or more non-path separators
				while (j < len && !isPathSeparator(path.charCodeAt(j))) {
					j++;
				}
				if (j < len && j !== last) {
					const firstPart = path.slice(last, j);
					// Matched!
					last = j;
					// Match 1 or more path separators
					while (j < len && isPathSeparator(path.charCodeAt(j))) {
						j++;
					}
					if (j < len && j !== last) {
						// Matched!
						last = j;
						// Match 1 or more non-path separators
						while (j < len && !isPathSeparator(path.charCodeAt(j))) {
							j++;
						}
						if (j === len) {
							// We matched a UNC root only
							// Return the normalized version of the UNC root since there
							// is nothing left to process
							return `\\\\${firstPart}\\${path.slice(last)}\\`;
						}
						if (j !== last) {
							// We matched a UNC root with leftovers
							device = `\\\\${firstPart}\\${path.slice(last, j)}`;
							rootEnd = j;
						}
					}
				}
			} else {
				rootEnd = 1;
			}
		} else if (isWindowsDeviceRoot(code) && path.charCodeAt(1) === CHAR_COLON) {
			// Possible device root
			device = path.slice(0, 2);
			rootEnd = 2;
			if (len > 2 && isPathSeparator(path.charCodeAt(2))) {
				// Treat separator following drive name as an absolute path
				// indicator
				isAbsolute = true;
				rootEnd = 3;
			}
		}

		let tail = rootEnd < len ?
			normalizeString(path.slice(rootEnd), !isAbsolute, '\\', isPathSeparator) :
			'';
		if (tail.length === 0 && !isAbsolute) {
			tail = '.';
		}
		if (tail.length > 0 && isPathSeparator(path.charCodeAt(len - 1))) {
			tail += '\\';
		}
		if (!isAbsolute && device === undefined && path.includes(':')) {
			// If the original path was not absolute and if we have not been able to
			// resolve it relative to a particular device, we need to ensure that the
			// `tail` has not become something that Windows might interpret as an
			// absolute path. See CVE-2024-36139.
			if (tail.length >= 2 &&
				isWindowsDeviceRoot(tail.charCodeAt(0)) &&
				tail.charCodeAt(1) === CHAR_COLON) {
				return `.\\${tail}`;
			}
			let index = path.indexOf(':');
			do {
				if (index === len - 1 || isPathSeparator(path.charCodeAt(index + 1))) {
					return `.\\${tail}`;
				}
			} while ((index = path.indexOf(':', index + 1)) !== -1);
		}
		if (device === undefined) {
			return isAbsolute ? `\\${tail}` : tail;
		}
		return isAbsolute ? `${device}\\${tail}` : `${device}${tail}`;
	},

	isAbsolute(path: string): boolean {
		validateString(path, 'path');
		const len = path.length;
		if (len === 0) {
			return false;
		}

		const code = path.charCodeAt(0);
		return isPathSeparator(code) ||
			// Possible device root
			(len > 2 &&
				isWindowsDeviceRoot(code) &&
				path.charCodeAt(1) === CHAR_COLON &&
				isPathSeparator(path.charCodeAt(2)));
	},

	join(...paths: string[]): string {
		if (paths.length === 0) {
			return '.';
		}

		let joined;
		let firstPart: string | undefined;
		for (let i = 0; i < paths.length; ++i) {
			const arg = paths[i];
			validateString(arg, 'path');
			if (arg.length > 0) {
				if (joined === undefined) {
					joined = firstPart = arg;
				}
				else {
					joined += `\\${arg}`;
				}
			}
		}

		if (joined === undefined) {
			return '.';
		}

		// Make sure that the joined path doesn't start with two slashes, because
		// normalize() will mistake it for a UNC path then.
		//
		// This step is skipped when it is very clear that the user actually
		// intended to point at a UNC path. This is assumed when the first
		// non-empty string arguments starts with exactly two slashes followed by
		// at least one more non-slash character.
		//
		// Note that for normalize() to treat a path as a UNC path it needs to
		// have at least 2 components, so we don't filter for that here.
		// This means that the user can use join to construct UNC paths from
		// a server name and a share name; for example:
		//   path.join('//server', 'share') -> '\\\\server\\share\\')
		let needsReplace = true;
		let slashCount = 0;
		if (typeof firstPart === 'string' && isPathSeparator(firstPart.charCodeAt(0))) {
			++slashCount;
			const firstLen = firstPart.length;
			if (firstLen > 1 && isPathSeparator(firstPart.charCodeAt(1))) {
				++slashCount;
				if (firstLen > 2) {
					if (isPathSeparator(firstPart.charCodeAt(2))) {
						++slashCount;
					} else {
						// We matched a UNC path in the first part
						needsReplace = false;
					}
				}
			}
		}
		if (needsReplace) {
			// Find any more consecutive slashes we need to replace
			while (slashCount < joined.length &&
				isPathSeparator(joined.charCodeAt(slashCount))) {
				slashCount++;
			}

			// Replace the slashes if needed
			if (slashCount >= 2) {
				joined = `\\${joined.slice(slashCount)}`;
			}
		}

		return win32.normalize(joined);
	},


	// It will solve the relative path from `from` to `to`, for instance:
	//  from = 'C:\\orandea\\test\\aaa'
	//  to = 'C:\\orandea\\impl\\bbb'
	// The output of the function should be: '..\\..\\impl\\bbb'
	relative(from: string, to: string): string {
		validateString(from, 'from');
		validateString(to, 'to');

		if (from === to) {
			return '';
		}

		const fromOrig = win32.resolve(from);
		const toOrig = win32.resolve(to);

		if (fromOrig === toOrig) {
			return '';
		}

		from = fromOrig.toLowerCase();
		to = toOrig.toLowerCase();

		if (from === to) {
			return '';
		}

		if (fromOrig.length !== from.length || toOrig.length !== to.length) {
			const fromSplit = fromOrig.split('\\');
			const toSplit = toOrig.split('\\');
			if (fromSplit[fromSplit.length - 1] === '') {
				fromSplit.pop();
			}
			if (toSplit[toSplit.length - 1] === '') {
				toSplit.pop();
			}

			const fromLen = fromSplit.length;
			const toLen = toSplit.length;
			const length = fromLen < toLen ? fromLen : toLen;

			let i;
			for (i = 0; i < length; i++) {
				if (fromSplit[i].toLowerCase() !== toSplit[i].toLowerCase()) {
					break;
				}
			}

			if (i === 0) {
				return toOrig;
			} else if (i === length) {
				if (toLen > length) {
					return toSplit.slice(i).join('\\');
				}
				if (fromLen > length) {
					return '..\\'.repeat(fromLen - 1 - i) + '..';
				}
				return '';
			}

			return '..\\'.repeat(fromLen - i) + toSplit.slice(i).join('\\');
		}

		// Trim any leading backslashes
		let fromStart = 0;
		while (fromStart < from.length &&
			from.charCodeAt(fromStart) === CHAR_BACKWARD_SLASH) {
			fromStart++;
		}
		// Trim trailing backslashes (applicable to UNC paths only)
		let fromEnd = from.length;
		while (fromEnd - 1 > fromStart &&
			from.charCodeAt(fromEnd - 1) === CHAR_BACKWARD_SLASH) {
			fromEnd--;
		}
		const fromLen = fromEnd - fromStart;

		// Trim any leading backslashes
		let toStart = 0;
		while (toStart < to.length &&
			to.charCodeAt(toStart) === CHAR_BACKWARD_SLASH) {
			toStart++;
		}
		// Trim trailing backslashes (applicable to UNC paths only)
		let toEnd = to.length;
		while (toEnd - 1 > toStart &&
			to.charCodeAt(toEnd - 1) === CHAR_BACKWARD_SLASH) {
			toEnd--;
		}
		const toLen = toEnd - toStart;

		// Compare paths to find the longest common path from root
		const length = fromLen < toLen ? fromLen : toLen;
		let lastCommonSep = -1;
		let i = 0;
		for (; i < length; i++) {
			const fromCode = from.charCodeAt(fromStart + i);
			if (fromCode !== to.charCodeAt(toStart + i)) {
				break;
			} else if (fromCode === CHAR_BACKWARD_SLASH) {
				lastCommonSep = i;
			}
		}

		// We found a mismatch before the first common path separator was seen, so
		// return the original `to`.
		if (i !== length) {
			if (lastCommonSep === -1) {
				return toOrig;
			}
		} else {
			if (toLen > length) {
				if (to.charCodeAt(toStart + i) === CHAR_BACKWARD_SLASH) {
					// We get here if `from` is the exact base path for `to`.
					// For example: from='C:\\foo\\bar'; to='C:\\foo\\bar\\baz'
					return toOrig.slice(toStart + i + 1);
				}
				if (i === 2) {
					// We get here if `from` is the device root.
					// For example: from='C:\\'; to='C:\\foo'
					return toOrig.slice(toStart + i);
				}
			}
			if (fromLen > length) {
				if (from.charCodeAt(fromStart + i) === CHAR_BACKWARD_SLASH) {
					// We get here if `to` is the exact base path for `from`.
					// For example: from='C:\\foo\\bar'; to='C:\\foo'
					lastCommonSep = i;
				} else if (i === 2) {
					// We get here if `to` is the device root.
					// For example: from='C:\\foo\\bar'; to='C:\\'
					lastCommonSep = 3;
				}
			}
			if (lastCommonSep === -1) {
				lastCommonSep = 0;
			}
		}

		let out = '';
		// Generate the relative path based on the path difference between `to` and
		// `from`
		for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
			if (i === fromEnd || from.charCodeAt(i) === CHAR_BACKWARD_SLASH) {
				out += out.length === 0 ? '..' : '\\..';
			}
		}

		toStart += lastCommonSep;

		// Lastly, append the rest of the destination (`to`) path that comes after
		// the common path parts
		if (out.length > 0) {
			return `${out}${toOrig.slice(toStart, toEnd)}`;
		}

		if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH) {
			++toStart;
		}

		return toOrig.slice(toStart, toEnd);
	},

	toNamespacedPath(path: string): string {
		// Note: this will *probably* throw somewhere.
		if (typeof path !== 'string' || path.length === 0) {
			return path;
		}

		const resolvedPath = win32.resolve(path);

		if (resolvedPath.length <= 2) {
			return path;
		}

		if (resolvedPath.charCodeAt(0) === CHAR_BACKWARD_SLASH) {
			// Possible UNC root
			if (resolvedPath.charCodeAt(1) === CHAR_BACKWARD_SLASH) {
				const code = resolvedPath.charCodeAt(2);
				if (code !== CHAR_QUESTION_MARK && code !== CHAR_DOT) {
					// Matched non-long UNC root, convert the path to a long UNC path
					return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
				}
			}
		} else if (isWindowsDeviceRoot(resolvedPath.charCodeAt(0)) &&
			resolvedPath.charCodeAt(1) === CHAR_COLON &&
			resolvedPath.charCodeAt(2) === CHAR_BACKWARD_SLASH) {
			// Matched device root, convert the path to a long UNC path
			return `\\\\?\\${resolvedPath}`;
		}

		return resolvedPath;
	},

	dirname(path: string): string {
		validateString(path, 'path');
		const len = path.length;
		if (len === 0) {
			return '.';
		}
		let rootEnd = -1;
		let offset = 0;
		const code = path.charCodeAt(0);

		if (len === 1) {
			// `path` contains just a path separator, exit early to avoid
			// unnecessary work or a dot.
			return isPathSeparator(code) ? path : '.';
		}

		// Try to match a root
		if (isPathSeparator(code)) {
			// Possible UNC root

			rootEnd = offset = 1;

			if (isPathSeparator(path.charCodeAt(1))) {
				// Matched double path separator at beginning
				let j = 2;
				let last = j;
				// Match 1 or more non-path separators
				while (j < len && !isPathSeparator(path.charCodeAt(j))) {
					j++;
				}
				if (j < len && j !== last) {
					// Matched!
					last = j;
					// Match 1 or more path separators
					while (j < len && isPathSeparator(path.charCodeAt(j))) {
						j++;
					}
					if (j < len && j !== last) {
						// Matched!
						last = j;
						// Match 1 or more non-path separators
						while (j < len && !isPathSeparator(path.charCodeAt(j))) {
							j++;
						}
						if (j === len) {
							// We matched a UNC root only
							return path;
						}
						if (j !== last) {
							// We matched a UNC root with leftovers

							// Offset by 1 to include the separator after the UNC root to
							// treat it as a "normal root" on top of a (UNC) root
							rootEnd = offset = j + 1;
						}
					}
				}
			}
			// Possible device root
		} else if (isWindowsDeviceRoot(code) && path.charCodeAt(1) === CHAR_COLON) {
			rootEnd = len > 2 && isPathSeparator(path.charCodeAt(2)) ? 3 : 2;
			offset = rootEnd;
		}

		let end = -1;
		let matchedSlash = true;
		for (let i = len - 1; i >= offset; --i) {
			if (isPathSeparator(path.charCodeAt(i))) {
				if (!matchedSlash) {
					end = i;
					break;
				}
			} else {
				// We saw the first non-path separator
				matchedSlash = false;
			}
		}

		if (end === -1) {
			if (rootEnd === -1) {
				return '.';
			}

			end = rootEnd;
		}
		return path.slice(0, end);
	},

	basename(path: string, suffix?: string): string {
		if (suffix !== undefined) {
			validateString(suffix, 'suffix');
		}
		validateString(path, 'path');
		let start = 0;
		let end = -1;
		let matchedSlash = true;
		let i;

		// Check for a drive letter prefix so as not to mistake the following
		// path separator as an extra separator at the end of the path that can be
		// disregarded
		if (path.length >= 2 &&
			isWindowsDeviceRoot(path.charCodeAt(0)) &&
			path.charCodeAt(1) === CHAR_COLON) {
			start = 2;
		}

		if (suffix !== undefined && suffix.length > 0 && suffix.length <= path.length) {
			if (suffix === path) {
				return '';
			}
			let extIdx = suffix.length - 1;
			let firstNonSlashEnd = -1;
			for (i = path.length - 1; i >= start; --i) {
				const code = path.charCodeAt(i);
				if (isPathSeparator(code)) {
					// If we reached a path separator that was not part of a set of path
					// separators at the end of the string, stop now
					if (!matchedSlash) {
						start = i + 1;
						break;
					}
				} else {
					if (firstNonSlashEnd === -1) {
						// We saw the first non-path separator, remember this index in case
						// we need it if the extension ends up not matching
						matchedSlash = false;
						firstNonSlashEnd = i + 1;
					}
					if (extIdx >= 0) {
						// Try to match the explicit extension
						if (code === suffix.charCodeAt(extIdx)) {
							if (--extIdx === -1) {
								// We matched the extension, so mark this as the end of our path
								// component
								end = i;
							}
						} else {
							// Extension does not match, so our result is the entire path
							// component
							extIdx = -1;
							end = firstNonSlashEnd;
						}
					}
				}
			}

			if (start === end) {
				end = firstNonSlashEnd;
			} else if (end === -1) {
				end = path.length;
			}
			return path.slice(start, end);
		}
		for (i = path.length - 1; i >= start; --i) {
			if (isPathSeparator(path.charCodeAt(i))) {
				// If we reached a path separator that was not part of a set of path
				// separators at the end of the string, stop now
				if (!matchedSlash) {
					start = i + 1;
					break;
				}
			} else if (end === -1) {
				// We saw the first non-path separator, mark this as the end of our
				// path component
				matchedSlash = false;
				end = i + 1;
			}
		}

		if (end === -1) {
			return '';
		}
		return path.slice(start, end);
	},

	extname(path: string): string {
		validateString(path, 'path');
		let start = 0;
		let startDot = -1;
		let startPart = 0;
		let end = -1;
		let matchedSlash = true;
		// Track the state of characters (if any) we see before our first dot and
		// after any path separator we find
		let preDotState = 0;

		// Check for a drive letter prefix so as not to mistake the following
		// path separator as an extra separator at the end of the path that can be
		// disregarded

		if (path.length >= 2 &&
			path.charCodeAt(1) === CHAR_COLON &&
			isWindowsDeviceRoot(path.charCodeAt(0))) {
			start = startPart = 2;
		}

		for (let i = path.length - 1; i >= start; --i) {
			const code = path.charCodeAt(i);
			if (isPathSeparator(code)) {
				// If we reached a path separator that was not part of a set of path
				// separators at the end of the string, stop now
				if (!matchedSlash) {
					startPart = i + 1;
					break;
				}
				continue;
			}
			if (end === -1) {
				// We saw the first non-path separator, mark this as the end of our
				// extension
				matchedSlash = false;
				end = i + 1;
			}
			if (code === CHAR_DOT) {
				// If this is our first dot, mark it as the start of our extension
				if (startDot === -1) {
					startDot = i;
				}
				else if (preDotState !== 1) {
					preDotState = 1;
				}
			} else if (startDot !== -1) {
				// We saw a non-dot and non-path separator before our dot, so we should
				// have a good chance at having a non-empty extension
				preDotState = -1;
			}
		}

		if (startDot === -1 ||
			end === -1 ||
			// We saw a non-dot character immediately before the dot
			preDotState === 0 ||
			// The (right-most) trimmed path component is exactly '..'
			(preDotState === 1 &&
				startDot === end - 1 &&
				startDot === startPart + 1)) {
			return '';
		}
		return path.slice(startDot, end);
	},

	format: _format.bind(null, '\\'),

	parse(path) {
		validateString(path, 'path');

		const ret = { root: '', dir: '', base: '', ext: '', name: '' };
		if (path.length === 0) {
			return ret;
		}

		const len = path.length;
		let rootEnd = 0;
		let code = path.charCodeAt(0);

		if (len === 1) {
			if (isPathSeparator(code)) {
				// `path` contains just a path separator, exit early to avoid
				// unnecessary work
				ret.root = ret.dir = path;
				return ret;
			}
			ret.base = ret.name = path;
			return ret;
		}
		// Try to match a root
		if (isPathSeparator(code)) {
			// Possible UNC root

			rootEnd = 1;
			if (isPathSeparator(path.charCodeAt(1))) {
				// Matched double path separator at beginning
				let j = 2;
				let last = j;
				// Match 1 or more non-path separators
				while (j < len && !isPathSeparator(path.charCodeAt(j))) {
					j++;
				}
				if (j < len && j !== last) {
					// Matched!
					last = j;
					// Match 1 or more path separators
					while (j < len && isPathSeparator(path.charCodeAt(j))) {
						j++;
					}
					if (j < len && j !== last) {
						// Matched!
						last = j;
						// Match 1 or more non-path separators
						while (j < len && !isPathSeparator(path.charCodeAt(j))) {
							j++;
						}
						if (j === len) {
							// We matched a UNC root only
							rootEnd = j;
						} else if (j !== last) {
							// We matched a UNC root with leftovers
							rootEnd = j + 1;
						}
					}
				}
			}
		} else if (isWindowsDeviceRoot(code) && path.charCodeAt(1) === CHAR_COLON) {
			// Possible device root
			if (len <= 2) {
				// `path` contains just a drive root, exit early to avoid
				// unnecessary work
				ret.root = ret.dir = path;
				return ret;
			}
			rootEnd = 2;
			if (isPathSeparator(path.charCodeAt(2))) {
				if (len === 3) {
					// `path` contains just a drive root, exit early to avoid
					// unnecessary work
					ret.root = ret.dir = path;
					return ret;
				}
				rootEnd = 3;
			}
		}
		if (rootEnd > 0) {
			ret.root = path.slice(0, rootEnd);
		}

		let startDot = -1;
		let startPart = rootEnd;
		let end = -1;
		let matchedSlash = true;
		let i = path.length - 1;

		// Track the state of characters (if any) we see before our first dot and
		// after any path separator we find
		let preDotState = 0;

		// Get non-dir info
		for (; i >= rootEnd; --i) {
			code = path.charCodeAt(i);
			if (isPathSeparator(code)) {
				// If we reached a path separator that was not part of a set of path
				// separators at the end of the string, stop now
				if (!matchedSlash) {
					startPart = i + 1;
					break;
				}
				continue;
			}
			if (end === -1) {
				// We saw the first non-path separator, mark this as the end of our
				// extension
				matchedSlash = false;
				end = i + 1;
			}
			if (code === CHAR_DOT) {
				// If this is our first dot, mark it as the start of our extension
				if (startDot === -1) {
					startDot = i;
				} else if (preDotState !== 1) {
					preDotState = 1;
				}
			} else if (startDot !== -1) {
				// We saw a non-dot and non-path separator before our dot, so we should
				// have a good chance at having a non-empty extension
				preDotState = -1;
			}
		}

		if (end !== -1) {
			if (startDot === -1 ||
				// We saw a non-dot character immediately before the dot
				preDotState === 0 ||
				// The (right-most) trimmed path component is exactly '..'
				(preDotState === 1 &&
					startDot === end - 1 &&
					startDot === startPart + 1)) {
				ret.base = ret.name = path.slice(startPart, end);
			} else {
				ret.name = path.slice(startPart, startDot);
				ret.base = path.slice(startPart, end);
				ret.ext = path.slice(startDot, end);
			}
		}

		// If the directory is the root, use the entire root as the `dir` including
		// the trailing slash if any (`C:\abc` -> `C:\`). Otherwise, strip out the
		// trailing slash (`C:\abc\def` -> `C:\abc`).
		if (startPart > 0 && startPart !== rootEnd) {
			ret.dir = path.slice(0, startPart - 1);
		} else {
			ret.dir = ret.root;
		}

		return ret;
	},

	sep: '\\',
	delimiter: ';',
	win32: null,
	posix: null
};

const posixCwd = (() => {
	if (platformIsWin32) {
		// Converts Windows' backslash path separators to POSIX forward slashes
		// and truncates any drive indicator
		const regexp = /\\/g;
		return () => {
			const cwd = process.cwd().replace(regexp, '/');
			return cwd.slice(cwd.indexOf('/'));
		};
	}

	// We're already on POSIX, no need for any transformations
	return () => process.cwd();
})();

export const posix: IPath = {
	// path.resolve([from ...], to)
	resolve(...pathSegments: string[]): string {
		let resolvedPath = '';
		let resolvedAbsolute = false;

		for (let i = pathSegments.length - 1; i >= 0 && !resolvedAbsolute; i--) {
			const path = pathSegments[i];
			validateString(path, `paths[${i}]`);

			// Skip empty entries
			if (path.length === 0) {
				continue;
			}

			resolvedPath = `${path}/${resolvedPath}`;
			resolvedAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
		}

		if (!resolvedAbsolute) {
			const cwd = posixCwd();
			resolvedPath = `${cwd}/${resolvedPath}`;
			resolvedAbsolute =
				cwd.charCodeAt(0) === CHAR_FORWARD_SLASH;
		}

		// At this point the path should be resolved to a full absolute path, but
		// handle relative paths to be safe (might happen when process.cwd() fails)

		// Normalize the path
		resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute, '/',
			isPosixPathSeparator);

		if (resolvedAbsolute) {
			return `/${resolvedPath}`;
		}
		return resolvedPath.length > 0 ? resolvedPath : '.';
	},

	normalize(path: string): string {
		validateString(path, 'path');

		if (path.length === 0) {
			return '.';
		}

		const isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
		const trailingSeparator =
			path.charCodeAt(path.length - 1) === CHAR_FORWARD_SLASH;

		// Normalize the path
		path = normalizeString(path, !isAbsolute, '/', isPosixPathSeparator);

		if (path.length === 0) {
			if (isAbsolute) {
				return '/';
			}
			return trailingSeparator ? './' : '.';
		}
		if (trailingSeparator) {
			path += '/';
		}

		return isAbsolute ? `/${path}` : path;
	},

	isAbsolute(path: string): boolean {
		validateString(path, 'path');
		return path.length > 0 && path.charCodeAt(0) === CHAR_FORWARD_SLASH;
	},

	join(...paths: string[]): string {
		if (paths.length === 0) {
			return '.';
		}

		const path = [];
		for (let i = 0; i < paths.length; ++i) {
			const arg = paths[i];
			validateString(arg, 'path');
			if (arg.length > 0) {
				path.push(arg);
			}
		}

		if (path.length === 0) {
			return '.';
		}

		return posix.normalize(path.join('/'));
	},

	relative(from: string, to: string): string {
		validateString(from, 'from');
		validateString(to, 'to');

		if (from === to) {
			return '';
		}

		// Trim leading forward slashes.
		from = posix.resolve(from);
		to = posix.resolve(to);

		if (from === to) {
			return '';
		}

		const fromStart = 1;
		const fromEnd = from.length;
		const fromLen = fromEnd - fromStart;
		const toStart = 1;
		const toLen = to.length - toStart;

		// Compare paths to find the longest common path from root
		const length = (fromLen < toLen ? fromLen : toLen);
		let lastCommonSep = -1;
		let i = 0;
		for (; i < length; i++) {
			const fromCode = from.charCodeAt(fromStart + i);
			if (fromCode !== to.charCodeAt(toStart + i)) {
				break;
			} else if (fromCode === CHAR_FORWARD_SLASH) {
				lastCommonSep = i;
			}
		}
		if (i === length) {
			if (toLen > length) {
				if (to.charCodeAt(toStart + i) === CHAR_FORWARD_SLASH) {
					// We get here if `from` is the exact base path for `to`.
					// For example: from='/foo/bar'; to='/foo/bar/baz'
					return to.slice(toStart + i + 1);
				}
				if (i === 0) {
					// We get here if `from` is the root
					// For example: from='/'; to='/foo'
					return to.slice(toStart + i);
				}
			} else if (fromLen > length) {
				if (from.charCodeAt(fromStart + i) === CHAR_FORWARD_SLASH) {
					// We get here if `to` is the exact base path for `from`.
					// For example: from='/foo/bar/baz'; to='/foo/bar'
					lastCommonSep = i;
				} else if (i === 0) {
					// We get here if `to` is the root.
					// For example: from='/foo/bar'; to='/'
					lastCommonSep = 0;
				}
			}
		}

		let out = '';
		// Generate the relative path based on the path difference between `to`
		// and `from`.
		for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
			if (i === fromEnd || from.charCodeAt(i) === CHAR_FORWARD_SLASH) {
				out += out.length === 0 ? '..' : '/..';
			}
		}

		// Lastly, append the rest of the destination (`to`) path that comes after
		// the common path parts.
		return `${out}${to.slice(toStart + lastCommonSep)}`;
	},

	toNamespacedPath(path: string): string {
		// Non-op on posix systems
		return path;
	},

	dirname(path: string): string {
		validateString(path, 'path');
		if (path.length === 0) {
			return '.';
		}
		const hasRoot = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
		let end = -1;
		let matchedSlash = true;
		for (let i = path.length - 1; i >= 1; --i) {
			if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
				if (!matchedSlash) {
					end = i;
					break;
				}
			} else {
				// We saw the first non-path separator
				matchedSlash = false;
			}
		}

		if (end === -1) {
			return hasRoot ? '/' : '.';
		}
		if (hasRoot && end === 1) {
			return '//';
		}
		return path.slice(0, end);
	},

	basename(path: string, suffix?: string): string {
		if (suffix !== undefined) {
			validateString(suffix, 'suffix');
		}
		validateString(path, 'path');

		let start = 0;
		let end = -1;
		let matchedSlash = true;
		let i;

		if (suffix !== undefined && suffix.length > 0 && suffix.length <= path.length) {
			if (suffix === path) {
				return '';
			}
			let extIdx = suffix.length - 1;
			let firstNonSlashEnd = -1;
			for (i = path.length - 1; i >= 0; --i) {
				const code = path.charCodeAt(i);
				if (code === CHAR_FORWARD_SLASH) {
					// If we reached a path separator that was not part of a set of path
					// separators at the end of the string, stop now
					if (!matchedSlash) {
						start = i + 1;
						break;
					}
				} else {
					if (firstNonSlashEnd === -1) {
						// We saw the first non-path separator, remember this index in case
						// we need it if the extension ends up not matching
						matchedSlash = false;
						firstNonSlashEnd = i + 1;
					}
					if (extIdx >= 0) {
						// Try to match the explicit extension
						if (code === suffix.charCodeAt(extIdx)) {
							if (--extIdx === -1) {
								// We matched the extension, so mark this as the end of our path
								// component
								end = i;
							}
						} else {
							// Extension does not match, so our result is the entire path
							// component
							extIdx = -1;
							end = firstNonSlashEnd;
						}
					}
				}
			}

			if (start === end) {
				end = firstNonSlashEnd;
			} else if (end === -1) {
				end = path.length;
			}
			return path.slice(start, end);
		}
		for (i = path.length - 1; i >= 0; --i) {
			if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
				// If we reached a path separator that was not part of a set of path
				// separators at the end of the string, stop now
				if (!matchedSlash) {
					start = i + 1;
					break;
				}
			} else if (end === -1) {
				// We saw the first non-path separator, mark this as the end of our
				// path component
				matchedSlash = false;
				end = i + 1;
			}
		}

		if (end === -1) {
			return '';
		}
		return path.slice(start, end);
	},

	extname(path: string): string {
		validateString(path, 'path');
		let startDot = -1;
		let startPart = 0;
		let end = -1;
		let matchedSlash = true;
		// Track the state of characters (if any) we see before our first dot and
		// after any path separator we find
		let preDotState = 0;
		for (let i = path.length - 1; i >= 0; --i) {
			const char = path[i];
			if (char === '/') {
				// If we reached a path separator that was not part of a set of path
				// separators at the end of the string, stop now
				if (!matchedSlash) {
					startPart = i + 1;
					break;
				}
				continue;
			}
			if (end === -1) {
				// We saw the first non-path separator, mark this as the end of our
				// extension
				matchedSlash = false;
				end = i + 1;
			}
			if (char === '.') {
				// If this is our first dot, mark it as the start of our extension
				if (startDot === -1) {
					startDot = i;
				}
				else if (preDotState !== 1) {
					preDotState = 1;
				}
			} else if (startDot !== -1) {
				// We saw a non-dot and non-path separator before our dot, so we should
				// have a good chance at having a non-empty extension
				preDotState = -1;
			}
		}

		if (startDot === -1 ||
			end === -1 ||
			// We saw a non-dot character immediately before the dot
			preDotState === 0 ||
			// The (right-most) trimmed path component is exactly '..'
			(preDotState === 1 &&
				startDot === end - 1 &&
				startDot === startPart + 1)) {
			return '';
		}
		return path.slice(startDot, end);
	},

	format: _format.bind(null, '/'),

	parse(path: string): ParsedPath {
		validateString(path, 'path');

		const ret = { root: '', dir: '', base: '', ext: '', name: '' };
		if (path.length === 0) {
			return ret;
		}
		const isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
		let start;
		if (isAbsolute) {
			ret.root = '/';
			start = 1;
		} else {
			start = 0;
		}
		let startDot = -1;
		let startPart = 0;
		let end = -1;
		let matchedSlash = true;
		let i = path.length - 1;

		// Track the state of characters (if any) we see before our first dot and
		// after any path separator we find
		let preDotState = 0;

		// Get non-dir info
		for (; i >= start; --i) {
			const code = path.charCodeAt(i);
			if (code === CHAR_FORWARD_SLASH) {
				// If we reached a path separator that was not part of a set of path
				// separators at the end of the string, stop now
				if (!matchedSlash) {
					startPart = i + 1;
					break;
				}
				continue;
			}
			if (end === -1) {
				// We saw the first non-path separator, mark this as the end of our
				// extension
				matchedSlash = false;
				end = i + 1;
			}
			if (code === CHAR_DOT) {
				// If this is our first dot, mark it as the start of our extension
				if (startDot === -1) {
					startDot = i;
				} else if (preDotState !== 1) {
					preDotState = 1;
				}
			} else if (startDot !== -1) {
				// We saw a non-dot and non-path separator before our dot, so we should
				// have a good chance at having a non-empty extension
				preDotState = -1;
			}
		}

		if (end !== -1) {
			const start = startPart === 0 && isAbsolute ? 1 : startPart;
			if (startDot === -1 ||
				// We saw a non-dot character immediately before the dot
				preDotState === 0 ||
				// The (right-most) trimmed path component is exactly '..'
				(preDotState === 1 &&
					startDot === end - 1 &&
					startDot === startPart + 1)) {
				ret.base = ret.name = path.slice(start, end);
			} else {
				ret.name = path.slice(start, startDot);
				ret.base = path.slice(start, end);
				ret.ext = path.slice(startDot, end);
			}
		}

		if (startPart > 0) {
			ret.dir = path.slice(0, startPart - 1);
		} else if (isAbsolute) {
			ret.dir = '/';
		}

		return ret;
	},

	sep: '/',
	delimiter: ':',
	win32: null,
	posix: null
};

posix.win32 = win32.win32 = win32;
posix.posix = win32.posix = posix;

export const normalize = (platformIsWin32 ? win32.normalize : posix.normalize);
export const isAbsolute = (platformIsWin32 ? win32.isAbsolute : posix.isAbsolute);
export const join = (platformIsWin32 ? win32.join : posix.join);
export const resolve = (platformIsWin32 ? win32.resolve : posix.resolve);
export const relative = (platformIsWin32 ? win32.relative : posix.relative);
export const dirname = (platformIsWin32 ? win32.dirname : posix.dirname);
export const basename = (platformIsWin32 ? win32.basename : posix.basename);
export const extname = (platformIsWin32 ? win32.extname : posix.extname);
export const format = (platformIsWin32 ? win32.format : posix.format);
export const parse = (platformIsWin32 ? win32.parse : posix.parse);
export const toNamespacedPath = (platformIsWin32 ? win32.toNamespacedPath : posix.toNamespacedPath);
export const sep = (platformIsWin32 ? win32.sep : posix.sep);
export const delimiter = (platformIsWin32 ? win32.delimiter : posix.delimiter);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/performance.ts]---
Location: vscode-main/src/vs/base/common/performance.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { INodeProcess } from './platform.js';

function _definePolyfillMarks(timeOrigin?: number) {
	const _data: [string?, number?] = [];
	if (typeof timeOrigin === 'number') {
		_data.push('code/timeOrigin', timeOrigin);
	}

	function mark(name: string, markOptions?: { startTime?: number }) {
		_data.push(name, markOptions?.startTime ?? Date.now());
	}
	function getMarks() {
		const result = [];
		for (let i = 0; i < _data.length; i += 2) {
			result.push({
				name: _data[i],
				startTime: _data[i + 1],
			});
		}
		return result;
	}
	return { mark, getMarks };
}

declare const process: INodeProcess;

interface IPerformanceEntry {
	readonly name: string;
	readonly startTime: number;
}

interface IPerformanceTiming {
	readonly navigationStart?: number;
	readonly redirectStart?: number;
	readonly fetchStart?: number;
}

interface IPerformance {
	mark(name: string, markOptions?: { startTime?: number }): void;
	getEntriesByType(type: string): IPerformanceEntry[];
	readonly timeOrigin: number;
	readonly timing: IPerformanceTiming;
	readonly nodeTiming?: any;
}

declare const performance: IPerformance;

function _define() {

	// Identify browser environment when following property is not present
	// https://nodejs.org/dist/latest-v16.x/docs/api/perf_hooks.html#performancenodetiming
	// @ts-ignore
	if (typeof performance === 'object' && typeof performance.mark === 'function' && !performance.nodeTiming) {
		// in a browser context, reuse performance-util

		if (typeof performance.timeOrigin !== 'number' && !performance.timing) {
			// safari & webworker: because there is no timeOrigin and no workaround
			// we use the `Date.now`-based polyfill.
			return _definePolyfillMarks();

		} else {
			// use "native" performance for mark and getMarks
			return {
				mark(name: string, markOptions?: { startTime?: number }) {
					performance.mark(name, markOptions);
				},
				getMarks() {
					let timeOrigin = performance.timeOrigin;
					if (typeof timeOrigin !== 'number') {
						// safari: there is no timerOrigin but in renderers there is the timing-property
						// see https://bugs.webkit.org/show_bug.cgi?id=174862
						timeOrigin = (performance.timing.navigationStart || performance.timing.redirectStart || performance.timing.fetchStart) ?? 0;
					}
					const result = [{ name: 'code/timeOrigin', startTime: Math.round(timeOrigin) }];
					for (const entry of performance.getEntriesByType('mark')) {
						result.push({
							name: entry.name,
							startTime: Math.round(timeOrigin + entry.startTime)
						});
					}
					return result;
				}
			};
		}

	} else if (typeof process === 'object') {
		// node.js: use the normal polyfill but add the timeOrigin
		// from the node perf_hooks API as very first mark
		const timeOrigin = performance?.timeOrigin;
		return _definePolyfillMarks(timeOrigin);

	} else {
		// unknown environment
		console.trace('perf-util loaded in UNKNOWN environment');
		return _definePolyfillMarks();
	}
}

function _factory(sharedObj: any) {
	if (!sharedObj.MonacoPerformanceMarks) {
		sharedObj.MonacoPerformanceMarks = _define();
	}
	return sharedObj.MonacoPerformanceMarks;
}

const perf = _factory(globalThis);

export const mark: (name: string, markOptions?: { startTime?: number }) => void = perf.mark;

export interface PerformanceMark {
	readonly name: string;
	readonly startTime: number;
}

/**
 * Returns all marks, sorted by `startTime`.
 */
export const getMarks: () => PerformanceMark[] = perf.getMarks;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/platform.ts]---
Location: vscode-main/src/vs/base/common/platform.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../nls.js';

export const LANGUAGE_DEFAULT = 'en';

let _isWindows = false;
let _isMacintosh = false;
let _isLinux = false;
let _isLinuxSnap = false;
let _isNative = false;
let _isWeb = false;
let _isElectron = false;
let _isIOS = false;
let _isCI = false;
let _isMobile = false;
let _locale: string | undefined = undefined;
let _language: string = LANGUAGE_DEFAULT;
let _platformLocale: string = LANGUAGE_DEFAULT;
let _translationsConfigFile: string | undefined = undefined;
let _userAgent: string | undefined = undefined;

export interface IProcessEnvironment {
	[key: string]: string | undefined;
}

/**
 * This interface is intentionally not identical to node.js
 * process because it also works in sandboxed environments
 * where the process object is implemented differently. We
 * define the properties here that we need for `platform`
 * to work and nothing else.
 */
export interface INodeProcess {
	platform: string;
	arch: string;
	env: IProcessEnvironment;
	versions?: {
		node?: string;
		electron?: string;
		chrome?: string;
	};
	type?: string;
	cwd: () => string;
}

declare const process: INodeProcess;

const $globalThis: any = globalThis;

let nodeProcess: INodeProcess | undefined = undefined;
if (typeof $globalThis.vscode !== 'undefined' && typeof $globalThis.vscode.process !== 'undefined') {
	// Native environment (sandboxed)
	nodeProcess = $globalThis.vscode.process;
} else if (typeof process !== 'undefined' && typeof process?.versions?.node === 'string') {
	// Native environment (non-sandboxed)
	nodeProcess = process;
}

const isElectronProcess = typeof nodeProcess?.versions?.electron === 'string';
const isElectronRenderer = isElectronProcess && nodeProcess?.type === 'renderer';

interface INavigator {
	userAgent: string;
	maxTouchPoints?: number;
	language: string;
}
declare const navigator: INavigator;

// Native environment
if (typeof nodeProcess === 'object') {
	_isWindows = (nodeProcess.platform === 'win32');
	_isMacintosh = (nodeProcess.platform === 'darwin');
	_isLinux = (nodeProcess.platform === 'linux');
	_isLinuxSnap = _isLinux && !!nodeProcess.env['SNAP'] && !!nodeProcess.env['SNAP_REVISION'];
	_isElectron = isElectronProcess;
	_isCI = !!nodeProcess.env['CI'] || !!nodeProcess.env['BUILD_ARTIFACTSTAGINGDIRECTORY'] || !!nodeProcess.env['GITHUB_WORKSPACE'];
	_locale = LANGUAGE_DEFAULT;
	_language = LANGUAGE_DEFAULT;
	const rawNlsConfig = nodeProcess.env['VSCODE_NLS_CONFIG'];
	if (rawNlsConfig) {
		try {
			const nlsConfig: nls.INLSConfiguration = JSON.parse(rawNlsConfig);
			_locale = nlsConfig.userLocale;
			_platformLocale = nlsConfig.osLocale;
			_language = nlsConfig.resolvedLanguage || LANGUAGE_DEFAULT;
			_translationsConfigFile = nlsConfig.languagePack?.translationsConfigFile;
		} catch (e) {
		}
	}
	_isNative = true;
}

// Web environment
else if (typeof navigator === 'object' && !isElectronRenderer) {
	_userAgent = navigator.userAgent;
	_isWindows = _userAgent.indexOf('Windows') >= 0;
	_isMacintosh = _userAgent.indexOf('Macintosh') >= 0;
	_isIOS = (_userAgent.indexOf('Macintosh') >= 0 || _userAgent.indexOf('iPad') >= 0 || _userAgent.indexOf('iPhone') >= 0) && !!navigator.maxTouchPoints && navigator.maxTouchPoints > 0;
	_isLinux = _userAgent.indexOf('Linux') >= 0;
	_isMobile = _userAgent?.indexOf('Mobi') >= 0;
	_isWeb = true;
	_language = nls.getNLSLanguage() || LANGUAGE_DEFAULT;
	_locale = navigator.language.toLowerCase();
	_platformLocale = _locale;
}

// Unknown environment
else {
	console.error('Unable to resolve platform.');
}

export const enum Platform {
	Web,
	Mac,
	Linux,
	Windows
}
export type PlatformName = 'Web' | 'Windows' | 'Mac' | 'Linux';

export function PlatformToString(platform: Platform): PlatformName {
	switch (platform) {
		case Platform.Web: return 'Web';
		case Platform.Mac: return 'Mac';
		case Platform.Linux: return 'Linux';
		case Platform.Windows: return 'Windows';
	}
}

let _platform: Platform = Platform.Web;
if (_isMacintosh) {
	_platform = Platform.Mac;
} else if (_isWindows) {
	_platform = Platform.Windows;
} else if (_isLinux) {
	_platform = Platform.Linux;
}

export const isWindows = _isWindows;
export const isMacintosh = _isMacintosh;
export const isLinux = _isLinux;
export const isLinuxSnap = _isLinuxSnap;
export const isNative = _isNative;
export const isElectron = _isElectron;
export const isWeb = _isWeb;
export const isWebWorker = (_isWeb && typeof $globalThis.importScripts === 'function');
export const webWorkerOrigin = isWebWorker ? $globalThis.origin : undefined;
export const isIOS = _isIOS;
export const isMobile = _isMobile;
/**
 * Whether we run inside a CI environment, such as
 * GH actions or Azure Pipelines.
 */
export const isCI = _isCI;
export const platform = _platform;
export const userAgent = _userAgent;

/**
 * The language used for the user interface. The format of
 * the string is all lower case (e.g. zh-tw for Traditional
 * Chinese or de for German)
 */
export const language = _language;

export namespace Language {

	export function value(): string {
		return language;
	}

	export function isDefaultVariant(): boolean {
		if (language.length === 2) {
			return language === 'en';
		} else if (language.length >= 3) {
			return language[0] === 'e' && language[1] === 'n' && language[2] === '-';
		} else {
			return false;
		}
	}

	export function isDefault(): boolean {
		return language === 'en';
	}
}

/**
 * Desktop: The OS locale or the locale specified by --locale or `argv.json`.
 * Web: matches `platformLocale`.
 *
 * The UI is not necessarily shown in the provided locale.
 */
export const locale = _locale;

/**
 * This will always be set to the OS/browser's locale regardless of
 * what was specified otherwise. The format of the string is all
 * lower case (e.g. zh-tw for Traditional Chinese). The UI is not
 * necessarily shown in the provided locale.
 */
export const platformLocale = _platformLocale;

/**
 * The translations that are available through language packs.
 */
export const translationsConfigFile = _translationsConfigFile;

export const setTimeout0IsFaster = (typeof $globalThis.postMessage === 'function' && !$globalThis.importScripts);

/**
 * See https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#:~:text=than%204%2C%20then-,set%20timeout%20to%204,-.
 *
 * Works similarly to `setTimeout(0)` but doesn't suffer from the 4ms artificial delay
 * that browsers set when the nesting level is > 5.
 */
export const setTimeout0 = (() => {
	if (setTimeout0IsFaster) {
		interface IQueueElement {
			id: number;
			callback: () => void;
		}
		const pending: IQueueElement[] = [];

		$globalThis.addEventListener('message', (e: any) => {
			if (e.data && e.data.vscodeScheduleAsyncWork) {
				for (let i = 0, len = pending.length; i < len; i++) {
					const candidate = pending[i];
					if (candidate.id === e.data.vscodeScheduleAsyncWork) {
						pending.splice(i, 1);
						candidate.callback();
						return;
					}
				}
			}
		});
		let lastId = 0;
		return (callback: () => void) => {
			const myId = ++lastId;
			pending.push({
				id: myId,
				callback: callback
			});
			$globalThis.postMessage({ vscodeScheduleAsyncWork: myId }, '*');
		};
	}
	return (callback: () => void) => setTimeout(callback);
})();

export const enum OperatingSystem {
	Windows = 1,
	Macintosh = 2,
	Linux = 3
}
export const OS = (_isMacintosh || _isIOS ? OperatingSystem.Macintosh : (_isWindows ? OperatingSystem.Windows : OperatingSystem.Linux));

let _isLittleEndian = true;
let _isLittleEndianComputed = false;
export function isLittleEndian(): boolean {
	if (!_isLittleEndianComputed) {
		_isLittleEndianComputed = true;
		const test = new Uint8Array(2);
		test[0] = 1;
		test[1] = 2;
		const view = new Uint16Array(test.buffer);
		_isLittleEndian = (view[0] === (2 << 8) + 1);
	}
	return _isLittleEndian;
}

export const isChrome = !!(userAgent && userAgent.indexOf('Chrome') >= 0);
export const isFirefox = !!(userAgent && userAgent.indexOf('Firefox') >= 0);
export const isSafari = !!(!isChrome && (userAgent && userAgent.indexOf('Safari') >= 0));
export const isEdge = !!(userAgent && userAgent.indexOf('Edg/') >= 0);
export const isAndroid = !!(userAgent && userAgent.indexOf('Android') >= 0);

export function isTahoeOrNewer(osVersion: string): boolean {
	return parseFloat(osVersion) >= 25;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/policy.ts]---
Location: vscode-main/src/vs/base/common/policy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../nls.js';
import { IDefaultAccount } from './defaultAccount.js';

/**
 * System-wide policy file path for Linux systems.
 */
export const LINUX_SYSTEM_POLICY_FILE_PATH = '/etc/vscode/policy.json';

export type PolicyName = string;
export type LocalizedValue = {
	key: string;
	value: string;
};

export enum PolicyCategory {
	Extensions = 'Extensions',
	IntegratedTerminal = 'IntegratedTerminal',
	InteractiveSession = 'InteractiveSession',
	Telemetry = 'Telemetry',
	Update = 'Update',
}

export const PolicyCategoryData: {
	[key in PolicyCategory]: { name: LocalizedValue }
} = {
	[PolicyCategory.Extensions]: {
		name: {
			key: 'extensionsConfigurationTitle', value: localize('extensionsConfigurationTitle', "Extensions"),
		}
	},
	[PolicyCategory.IntegratedTerminal]: {
		name: {
			key: 'terminalIntegratedConfigurationTitle', value: localize('terminalIntegratedConfigurationTitle', "Integrated Terminal"),
		}
	},
	[PolicyCategory.InteractiveSession]: {
		name: {
			key: 'interactiveSessionConfigurationTitle', value: localize('interactiveSessionConfigurationTitle', "Chat"),
		}
	},
	[PolicyCategory.Telemetry]: {
		name: {
			key: 'telemetryConfigurationTitle', value: localize('telemetryConfigurationTitle', "Telemetry"),
		}
	},
	[PolicyCategory.Update]: {
		name: {
			key: 'updateConfigurationTitle', value: localize('updateConfigurationTitle', "Update"),
		}
	}
};

export interface IPolicy {

	/**
	 * The policy name.
	 */
	readonly name: PolicyName;

	/**
	 * The policy category.
	 */
	readonly category: PolicyCategory;

	/**
	 * The Code version in which this policy was introduced.
	*/
	readonly minimumVersion: `${number}.${number}`;

	/**
	 * Localization info for the policy.
	 *
	 * IMPORTANT: the key values for these must be unique to avoid collisions, as during the export time the module information is not available.
	 */
	readonly localization: {
		/** The localization key or key value pair. If only a key is provided, the default value will fallback to the parent configuration's description property. */
		description: LocalizedValue;
		/** List of localization key or key value pair. If only a key is provided, the default value will fallback to the parent configuration's enumDescriptions property. */
		enumDescriptions?: LocalizedValue[];
	};

	/**
	 * The value that an ACCOUNT-based feature will use when its corresponding policy is active.
	 *
	 * Only applicable when policy is tagged with ACCOUNT. When an account-based feature's policy is enabled,
	 * this value determines what value the feature receives.
	 *
	 * For example:
	 * - If evaluated value is `true`,  the feature's setting is locked to `true` WHEN the policy is in effect.
	 * - If evaluated value is `foo`, the feature's setting is locked to 'foo'  WHEN the policy is in effect.
	 *
	 * If `undefined`, the feature's setting is not locked and can be overridden by other means.
	 */
	readonly value?: (account: IDefaultAccount) => string | number | boolean | undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/ports.ts]---
Location: vscode-main/src/vs/base/common/ports.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @returns Returns a random port between 1025 and 65535.
 */
export function randomPort(): number {
	const min = 1025;
	const max = 65535;
	return min + Math.floor((max - min) * Math.random());
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/prefixTree.ts]---
Location: vscode-main/src/vs/base/common/prefixTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Iterable } from './iterator.js';

const unset = Symbol('unset');

export interface IPrefixTreeNode<T> {
	/** Possible children of the node. */
	children?: ReadonlyMap<string, Node<T>>;

	/** The value if data exists for this node in the tree. Mutable. */
	value: T | undefined;
}

/**
 * A simple prefix tree implementation where a value is stored based on
 * well-defined prefix segments.
 */
export class WellDefinedPrefixTree<V> {
	public readonly root = new Node<V>();
	private _size = 0;

	/** Tree size, not including the root. */
	public get size() {
		return this._size;
	}

	/** Gets the top-level nodes of the tree */
	public get nodes(): Iterable<IPrefixTreeNode<V>> {
		return this.root.children?.values() || Iterable.empty();
	}

	/** Gets the top-level nodes of the tree */
	public get entries(): Iterable<[string, IPrefixTreeNode<V>]> {
		return this.root.children?.entries() || Iterable.empty();
	}

	/**
	 * Inserts a new value in the prefix tree.
	 * @param onNode - called for each node as we descend to the insertion point,
	 * including the insertion point itself.
	 */
	insert(key: Iterable<string>, value: V, onNode?: (n: IPrefixTreeNode<V>) => void): void {
		this.opNode(key, n => n._value = value, onNode);
	}

	/** Mutates a value in the prefix tree. */
	mutate(key: Iterable<string>, mutate: (value?: V) => V): void {
		this.opNode(key, n => n._value = mutate(n._value === unset ? undefined : n._value));
	}

	/** Mutates nodes along the path in the prefix tree. */
	mutatePath(key: Iterable<string>, mutate: (node: IPrefixTreeNode<V>) => void): void {
		this.opNode(key, () => { }, n => mutate(n));
	}

	/** Deletes a node from the prefix tree, returning the value it contained. */
	delete(key: Iterable<string>): V | undefined {
		const path = this.getPathToKey(key);
		if (!path) {
			return;
		}

		let i = path.length - 1;
		const value = path[i].node._value;
		if (value === unset) {
			return; // not actually a real node
		}

		this._size--;
		path[i].node._value = unset;

		for (; i > 0; i--) {
			const { node, part } = path[i];
			if (node.children?.size || node._value !== unset) {
				break;
			}

			path[i - 1].node.children!.delete(part);
		}

		return value;
	}

	/** Deletes a subtree from the prefix tree, returning the values they contained. */
	*deleteRecursive(key: Iterable<string>): Iterable<V> {
		const path = this.getPathToKey(key);
		if (!path) {
			return;
		}

		const subtree = path[path.length - 1].node;

		// important: run the deletion before we start to yield results, so that
		// it still runs even if the caller doesn't consumer the iterator
		for (let i = path.length - 1; i > 0; i--) {
			const parent = path[i - 1];
			parent.node.children!.delete(path[i].part);
			if (parent.node.children!.size > 0 || parent.node._value !== unset) {
				break;
			}
		}

		for (const node of bfsIterate(subtree)) {
			if (node._value !== unset) {
				this._size--;
				yield node._value;
			}
		}

		// special case for the root note
		if (subtree === this.root) {
			this.root._value = unset;
			this.root.children = undefined;
		}
	}

	/** Gets a value from the tree. */
	find(key: Iterable<string>): V | undefined {
		let node = this.root;
		for (const segment of key) {
			const next = node.children?.get(segment);
			if (!next) {
				return undefined;
			}

			node = next;
		}

		return node._value === unset ? undefined : node._value;
	}

	/** Gets whether the tree has the key, or a parent of the key, already inserted. */
	hasKeyOrParent(key: Iterable<string>): boolean {
		let node = this.root;
		for (const segment of key) {
			const next = node.children?.get(segment);
			if (!next) {
				return false;
			}
			if (next._value !== unset) {
				return true;
			}

			node = next;
		}

		return false;
	}

	/** Gets whether the tree has the given key or any children. */
	hasKeyOrChildren(key: Iterable<string>): boolean {
		let node = this.root;
		for (const segment of key) {
			const next = node.children?.get(segment);
			if (!next) {
				return false;
			}

			node = next;
		}

		return true;
	}

	/** Gets whether the tree has the given key. */
	hasKey(key: Iterable<string>): boolean {
		let node = this.root;
		for (const segment of key) {
			const next = node.children?.get(segment);
			if (!next) {
				return false;
			}

			node = next;
		}

		return node._value !== unset;
	}

	private getPathToKey(key: Iterable<string>) {
		const path = [{ part: '', node: this.root }];
		let i = 0;
		for (const part of key) {
			const node = path[i].node.children?.get(part);
			if (!node) {
				return; // node not in tree
			}

			path.push({ part, node });
			i++;
		}

		return path;
	}

	private opNode(key: Iterable<string>, fn: (node: Node<V>) => void, onDescend?: (node: Node<V>) => void): void {
		let node = this.root;
		for (const part of key) {
			if (!node.children) {
				const next = new Node<V>();
				node.children = new Map([[part, next]]);
				node = next;
			} else if (!node.children.has(part)) {
				const next = new Node<V>();
				node.children.set(part, next);
				node = next;
			} else {
				node = node.children.get(part)!;
			}
			onDescend?.(node);
		}

		const sizeBefore = node._value === unset ? 0 : 1;
		fn(node);
		const sizeAfter = node._value === unset ? 0 : 1;
		this._size += sizeAfter - sizeBefore;
	}

	/** Returns an iterable of the tree values in no defined order. */
	*values() {
		for (const { _value } of bfsIterate(this.root)) {
			if (_value !== unset) {
				yield _value;
			}
		}
	}
}

function* bfsIterate<T>(root: Node<T>): Iterable<Node<T>> {
	const stack = [root];
	while (stack.length > 0) {
		const node = stack.pop()!;
		yield node;

		if (node.children) {
			for (const child of node.children.values()) {
				stack.push(child);
			}
		}
	}
}

class Node<T> implements IPrefixTreeNode<T> {
	public children?: Map<string, Node<T>>;

	public get value() {
		return this._value === unset ? undefined : this._value;
	}

	public set value(value: T | undefined) {
		this._value = value === undefined ? unset : value;
	}

	public _value: T | typeof unset = unset;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/process.ts]---
Location: vscode-main/src/vs/base/common/process.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { INodeProcess, isMacintosh, isWindows } from './platform.js';

let safeProcess: Omit<INodeProcess, 'arch'> & { arch: string | undefined };
declare const process: INodeProcess;

// Native sandbox environment
const vscodeGlobal = (globalThis as { vscode?: { process?: INodeProcess } }).vscode;
if (typeof vscodeGlobal !== 'undefined' && typeof vscodeGlobal.process !== 'undefined') {
	const sandboxProcess: INodeProcess = vscodeGlobal.process;
	safeProcess = {
		get platform() { return sandboxProcess.platform; },
		get arch() { return sandboxProcess.arch; },
		get env() { return sandboxProcess.env; },
		cwd() { return sandboxProcess.cwd(); }
	};
}

// Native node.js environment
else if (typeof process !== 'undefined' && typeof process?.versions?.node === 'string') {
	safeProcess = {
		get platform() { return process.platform; },
		get arch() { return process.arch; },
		get env() { return process.env; },
		cwd() { return process.env['VSCODE_CWD'] || process.cwd(); }
	};
}

// Web environment
else {
	safeProcess = {

		// Supported
		get platform() { return isWindows ? 'win32' : isMacintosh ? 'darwin' : 'linux'; },
		get arch() { return undefined; /* arch is undefined in web */ },

		// Unsupported
		get env() { return {}; },
		cwd() { return '/'; }
	};
}

/**
 * Provides safe access to the `cwd` property in node.js, sandboxed or web
 * environments.
 *
 * Note: in web, this property is hardcoded to be `/`.
 *
 * @skipMangle
 */
export const cwd = safeProcess.cwd;

/**
 * Provides safe access to the `env` property in node.js, sandboxed or web
 * environments.
 *
 * Note: in web, this property is hardcoded to be `{}`.
 */
export const env = safeProcess.env;

/**
 * Provides safe access to the `platform` property in node.js, sandboxed or web
 * environments.
 */
export const platform = safeProcess.platform;

/**
 * Provides safe access to the `arch` method in node.js, sandboxed or web
 * environments.
 * Note: `arch` is `undefined` in web
 */
export const arch = safeProcess.arch;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/processes.ts]---
Location: vscode-main/src/vs/base/common/processes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IProcessEnvironment, isLinux } from './platform.js';

/**
 * Options to be passed to the external program or shell.
 */
export interface CommandOptions {
	/**
	 * The current working directory of the executed program or shell.
	 * If omitted VSCode's current workspace root is used.
	 */
	cwd?: string;

	/**
	 * The environment of the executed program or shell. If omitted
	 * the parent process' environment is used.
	 */
	env?: { [key: string]: string };
}

export interface Executable {
	/**
	 * The command to be executed. Can be an external program or a shell
	 * command.
	 */
	command: string;

	/**
	 * Specifies whether the command is a shell command and therefore must
	 * be executed in a shell interpreter (e.g. cmd.exe, bash, ...).
	 */
	isShellCommand: boolean;

	/**
	 * The arguments passed to the command.
	 */
	args: string[];

	/**
	 * The command options used when the command is executed. Can be omitted.
	 */
	options?: CommandOptions;
}

export interface ForkOptions extends CommandOptions {
	execArgv?: string[];
}

export const enum Source {
	stdout,
	stderr
}

/**
 * The data send via a success callback
 */
export interface SuccessData {
	error?: Error;
	cmdCode?: number;
	terminated?: boolean;
}

/**
 * The data send via a error callback
 */
export interface ErrorData {
	error?: Error;
	terminated?: boolean;
	stdout?: string;
	stderr?: string;
}

export interface TerminateResponse {
	success: boolean;
	code?: TerminateResponseCode;
	error?: any;
}

export const enum TerminateResponseCode {
	Success = 0,
	Unknown = 1,
	AccessDenied = 2,
	ProcessNotFound = 3,
}

export interface ProcessItem {
	name: string;
	cmd: string;
	pid: number;
	ppid: number;
	load: number;
	mem: number;

	children?: ProcessItem[];
}

/**
 * Sanitizes a VS Code process environment by removing all Electron/VS Code-related values.
 */
export function sanitizeProcessEnvironment(env: IProcessEnvironment, ...preserve: string[]): void {
	const set = preserve.reduce<Record<string, boolean>>((set, key) => {
		set[key] = true;
		return set;
	}, {});
	const keysToRemove = [
		/^ELECTRON_.+$/,
		/^VSCODE_(?!(PORTABLE|SHELL_LOGIN|ENV_REPLACE|ENV_APPEND|ENV_PREPEND)).+$/,
		/^SNAP(|_.*)$/,
		/^GDK_PIXBUF_.+$/,
	];
	const envKeys = Object.keys(env);
	envKeys
		.filter(key => !set[key])
		.forEach(envKey => {
			for (let i = 0; i < keysToRemove.length; i++) {
				if (envKey.search(keysToRemove[i]) !== -1) {
					delete env[envKey];
					break;
				}
			}
		});
}

/**
 * Remove dangerous environment variables that have caused crashes
 * in forked processes (i.e. in ELECTRON_RUN_AS_NODE processes)
 *
 * @param env The env object to change
 */
export function removeDangerousEnvVariables(env: IProcessEnvironment | undefined): void {
	if (!env) {
		return;
	}

	// Unset `DEBUG`, as an invalid value might lead to process crashes
	// See https://github.com/microsoft/vscode/issues/130072
	delete env['DEBUG'];

	if (isLinux) {
		// Unset `LD_PRELOAD`, as it might lead to process crashes
		// See https://github.com/microsoft/vscode/issues/134177
		delete env['LD_PRELOAD'];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/product.ts]---
Location: vscode-main/src/vs/base/common/product.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary } from './collections.js';
import { PlatformName } from './platform.js';
import { IPolicy } from './policy.js';

export interface IBuiltInExtension {
	readonly name: string;
	readonly version: string;
	readonly repo: string;
	readonly metadata: unknown;
}

export interface IProductWalkthrough {
	id: string;
	steps: IProductWalkthroughStep[];
}

export interface IProductWalkthroughStep {
	id: string;
	title: string;
	when: string;
	description: string;
	media:
	| { type: 'image'; path: string | { hc: string; hcLight?: string; light: string; dark: string }; altText: string }
	| { type: 'svg'; path: string; altText: string }
	| { type: 'markdown'; path: string };
}

export interface IFeaturedExtension {
	readonly id: string;
	readonly title: string;
	readonly description: string;
	readonly imagePath: string;
}

export interface IChatSessionRecommendation {
	readonly extensionId: string;
	readonly extensionName: string;
	readonly displayName: string;
	readonly name: string;
	readonly description: string;
	readonly postInstallCommand?: string;
}

export type ConfigurationSyncStore = {
	url: string;
	insidersUrl: string;
	stableUrl: string;
	canSwitch?: boolean;
	authenticationProviders: IStringDictionary<{ scopes: string[] }>;
};

export type ExtensionUntrustedWorkspaceSupport = {
	readonly default?: boolean | 'limited';
	readonly override?: boolean | 'limited';
};

export type ExtensionVirtualWorkspaceSupport = {
	readonly default?: boolean;
	readonly override?: boolean;
};

export interface IProductConfiguration {
	readonly version: string;
	readonly date?: string;
	readonly quality?: string;
	readonly commit?: string;

	readonly nameShort: string;
	readonly nameLong: string;

	readonly win32AppUserModelId?: string;
	readonly win32MutexName?: string;
	readonly win32RegValueName?: string;
	readonly applicationName: string;
	readonly embedderIdentifier?: string;

	readonly urlProtocol: string;
	readonly dataFolderName: string; // location for extensions (e.g. ~/.vscode-insiders)

	readonly builtInExtensions?: IBuiltInExtension[];
	readonly walkthroughMetadata?: IProductWalkthrough[];
	readonly featuredExtensions?: IFeaturedExtension[];

	readonly downloadUrl?: string;
	readonly updateUrl?: string;
	readonly webUrl?: string;
	readonly webEndpointUrlTemplate?: string;
	readonly webviewContentExternalBaseUrlTemplate?: string;
	readonly target?: string;
	readonly nlsCoreBaseUrl?: string;

	readonly settingsSearchBuildId?: number;
	readonly settingsSearchUrl?: string;

	readonly tasConfig?: {
		endpoint: string;
		telemetryEventName: string;
		assignmentContextTelemetryPropertyName: string;
	};

	readonly extensionsGallery?: {
		readonly serviceUrl: string;
		readonly controlUrl: string;
		readonly extensionUrlTemplate: string;
		readonly resourceUrlTemplate: string;
		readonly nlsBaseUrl: string;
		readonly accessSKUs?: string[];
	};

	readonly mcpGallery?: {
		readonly serviceUrl: string;
		readonly itemWebUrl: string;
		readonly publisherUrl: string;
		readonly supportUrl: string;
		readonly privacyPolicyUrl: string;
		readonly termsOfServiceUrl: string;
		readonly reportUrl: string;
	};

	readonly extensionPublisherOrgs?: readonly string[];
	readonly trustedExtensionPublishers?: readonly string[];

	readonly extensionRecommendations?: IStringDictionary<IExtensionRecommendations>;
	readonly configBasedExtensionTips?: IStringDictionary<IConfigBasedExtensionTip>;
	readonly exeBasedExtensionTips?: IStringDictionary<IExeBasedExtensionTip>;
	readonly remoteExtensionTips?: IStringDictionary<IRemoteExtensionTip>;
	readonly virtualWorkspaceExtensionTips?: IStringDictionary<IVirtualWorkspaceExtensionTip>;
	readonly extensionKeywords?: IStringDictionary<string[]>;
	readonly keymapExtensionTips?: readonly string[];
	readonly webExtensionTips?: readonly string[];
	readonly languageExtensionTips?: readonly string[];
	readonly trustedExtensionUrlPublicKeys?: IStringDictionary<string[]>;
	readonly trustedExtensionAuthAccess?: string[] | IStringDictionary<string[]>;
	readonly trustedMcpAuthAccess?: string[] | IStringDictionary<string[]>;
	readonly inheritAuthAccountPreference?: IStringDictionary<string[]>;
	readonly trustedExtensionProtocolHandlers?: readonly string[];

	readonly commandPaletteSuggestedCommandIds?: string[];

	readonly crashReporter?: {
		readonly companyName: string;
		readonly productName: string;
	};

	readonly removeTelemetryMachineId?: boolean;
	readonly enabledTelemetryLevels?: { error: boolean; usage: boolean };
	readonly enableTelemetry?: boolean;
	readonly openToWelcomeMainPage?: boolean;
	readonly aiConfig?: {
		readonly ariaKey: string;
	};

	readonly documentationUrl?: string;
	readonly serverDocumentationUrl?: string;
	readonly releaseNotesUrl?: string;
	readonly keyboardShortcutsUrlMac?: string;
	readonly keyboardShortcutsUrlLinux?: string;
	readonly keyboardShortcutsUrlWin?: string;
	readonly introductoryVideosUrl?: string;
	readonly tipsAndTricksUrl?: string;
	readonly newsletterSignupUrl?: string;
	readonly youTubeUrl?: string;
	readonly requestFeatureUrl?: string;
	readonly reportIssueUrl?: string;
	readonly reportMarketplaceIssueUrl?: string;
	readonly licenseUrl?: string;
	readonly serverLicenseUrl?: string;
	readonly privacyStatementUrl?: string;
	readonly showTelemetryOptOut?: boolean;

	readonly serverGreeting?: string[];
	readonly serverLicense?: string[];
	readonly serverLicensePrompt?: string;
	readonly serverApplicationName: string;
	readonly serverDataFolderName?: string;

	readonly tunnelApplicationName?: string;
	readonly tunnelApplicationConfig?: ITunnelApplicationConfig;

	readonly npsSurveyUrl?: string;
	readonly surveys?: readonly ISurveyData[];

	readonly checksums?: { [path: string]: string };
	readonly checksumFailMoreInfoUrl?: string;

	readonly appCenter?: IAppCenterConfiguration;

	readonly portable?: string;

	readonly extensionKind?: { readonly [extensionId: string]: ('ui' | 'workspace' | 'web')[] };
	readonly extensionPointExtensionKind?: { readonly [extensionPointId: string]: ('ui' | 'workspace' | 'web')[] };
	readonly extensionSyncedKeys?: { readonly [extensionId: string]: string[] };

	readonly extensionsEnabledWithApiProposalVersion?: string[];
	readonly extensionEnabledApiProposals?: { readonly [extensionId: string]: string[] };
	readonly extensionUntrustedWorkspaceSupport?: { readonly [extensionId: string]: ExtensionUntrustedWorkspaceSupport };
	readonly extensionVirtualWorkspacesSupport?: { readonly [extensionId: string]: ExtensionVirtualWorkspaceSupport };
	readonly extensionProperties: IStringDictionary<{
		readonly hasPrereleaseVersion?: boolean;
		readonly excludeVersionRange?: string;
	}>;

	readonly msftInternalDomains?: string[];
	readonly linkProtectionTrustedDomains?: readonly string[];

	readonly defaultAccount?: {
		readonly authenticationProvider: {
			readonly id: string;
			readonly enterpriseProviderId: string;
			readonly enterpriseProviderConfig: string;
			readonly enterpriseProviderUriSetting: string;
			readonly scopes: string[][];
		};
		readonly tokenEntitlementUrl: string;
		readonly chatEntitlementUrl: string;
		readonly mcpRegistryDataUrl: string;
	};
	readonly authClientIdMetadataUrl?: string;

	readonly 'configurationSync.store'?: ConfigurationSyncStore;

	readonly 'editSessions.store'?: Omit<ConfigurationSyncStore, 'insidersUrl' | 'stableUrl'>;
	readonly darwinUniversalAssetId?: string;
	readonly darwinBundleIdentifier?: string;
	readonly profileTemplatesUrl?: string;

	readonly commonlyUsedSettings?: string[];
	readonly aiGeneratedWorkspaceTrust?: IAiGeneratedWorkspaceTrust;

	readonly defaultChatAgent: IDefaultChatAgent;
	readonly chatParticipantRegistry?: string;
	readonly chatSessionRecommendations?: IChatSessionRecommendation[];
	readonly emergencyAlertUrl?: string;

	readonly remoteDefaultExtensionsIfInstalledLocally?: string[];

	readonly extensionConfigurationPolicy?: IStringDictionary<IPolicy>;
}

export interface ITunnelApplicationConfig {
	authenticationProviders: IStringDictionary<{ scopes: string[] }>;
	editorWebUrl: string;
	extension: IRemoteExtensionTip;
}

export interface IExtensionRecommendations {
	readonly onFileOpen: IFileOpenCondition[];
	readonly onSettingsEditorOpen?: ISettingsEditorOpenCondition;
}

export interface ISettingsEditorOpenCondition {
	readonly prerelease?: boolean | string;
	readonly descriptionOverride?: string;
}

export interface IExtensionRecommendationCondition {
	readonly important?: boolean;
	readonly whenInstalled?: string[];
	readonly whenNotInstalled?: string[];
}

export type IFileOpenCondition = IFileLanguageCondition | IFilePathCondition | IFileContentCondition;

export interface IFileLanguageCondition extends IExtensionRecommendationCondition {
	readonly languages: string[];
}

export interface IFilePathCondition extends IExtensionRecommendationCondition {
	readonly pathGlob: string;
}

export type IFileContentCondition = (IFileLanguageCondition | IFilePathCondition) & { readonly contentPattern: string };

export interface IAppCenterConfiguration {
	readonly 'win32-x64': string;
	readonly 'win32-arm64': string;
	readonly 'linux-x64': string;
	readonly 'darwin': string;
	readonly 'darwin-universal': string;
	readonly 'darwin-arm64': string;
}

export interface IConfigBasedExtensionTip {
	configPath: string;
	configName: string;
	configScheme?: string;
	recommendations: IStringDictionary<{
		name: string;
		contentPattern?: string;
		important?: boolean;
		isExtensionPack?: boolean;
		whenNotInstalled?: string[];
	}>;
}

export interface IExeBasedExtensionTip {
	friendlyName: string;
	windowsPath?: string;
	important?: boolean;
	recommendations: IStringDictionary<{ name: string; important?: boolean; isExtensionPack?: boolean; whenNotInstalled?: string[] }>;
}

export interface IRemoteExtensionTip {
	friendlyName: string;
	extensionId: string;
	supportedPlatforms?: PlatformName[];
	startEntry?: {
		helpLink: string;
		startConnectLabel: string;
		startCommand: string;
		priority: number;
	};
}

export interface IVirtualWorkspaceExtensionTip {
	friendlyName: string;
	extensionId: string;
	supportedPlatforms?: PlatformName[];
	startEntry: {
		helpLink: string;
		startConnectLabel: string;
		startCommand: string;
		priority: number;
	};
}

export interface ISurveyData {
	surveyId: string;
	surveyUrl: string;
	languageId: string;
	editCount: number;
	userProbability: number;
}

export interface IAiGeneratedWorkspaceTrust {
	readonly title: string;
	readonly checkboxText: string;
	readonly trustOption: string;
	readonly dontTrustOption: string;
	readonly startupTrustRequestLearnMore: string;
}

export interface IDefaultChatAgent {
	readonly extensionId: string;
	readonly chatExtensionId: string;

	readonly documentationUrl: string;
	readonly skusDocumentationUrl: string;
	readonly publicCodeMatchesUrl: string;
	readonly manageSettingsUrl: string;
	readonly managePlanUrl: string;
	readonly manageOverageUrl: string;
	readonly upgradePlanUrl: string;
	readonly signUpUrl: string;
	readonly termsStatementUrl: string;
	readonly privacyStatementUrl: string;

	readonly provider: {
		default: { id: string; name: string };
		enterprise: { id: string; name: string };
		google: { id: string; name: string };
		apple: { id: string; name: string };
	};

	readonly providerUriSetting: string;
	readonly providerScopes: string[][];

	readonly entitlementUrl: string;
	readonly entitlementSignupLimitedUrl: string;

	readonly chatQuotaExceededContext: string;
	readonly completionsQuotaExceededContext: string;

	readonly walkthroughCommand: string;
	readonly completionsMenuCommand: string;
	readonly completionsRefreshTokenCommand: string;
	readonly chatRefreshTokenCommand: string;
	readonly generateCommitMessageCommand: string;
	readonly resolveMergeConflictsCommand: string;

	readonly completionsAdvancedSetting: string;
	readonly completionsEnablementSetting: string;
	readonly nextEditSuggestionsSetting: string;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/range.ts]---
Location: vscode-main/src/vs/base/common/range.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IRange {
	start: number;
	end: number;
}

export interface IRangedGroup {
	range: IRange;
	size: number;
}

export namespace Range {

	/**
	 * Returns the intersection between two ranges as a range itself.
	 * Returns `{ start: 0, end: 0 }` if the intersection is empty.
	 */
	export function intersect(one: IRange, other: IRange): IRange {
		if (one.start >= other.end || other.start >= one.end) {
			return { start: 0, end: 0 };
		}

		const start = Math.max(one.start, other.start);
		const end = Math.min(one.end, other.end);

		if (end - start <= 0) {
			return { start: 0, end: 0 };
		}

		return { start, end };
	}

	export function isEmpty(range: IRange): boolean {
		return range.end - range.start <= 0;
	}

	export function intersects(one: IRange, other: IRange): boolean {
		return !isEmpty(intersect(one, other));
	}

	export function relativeComplement(one: IRange, other: IRange): IRange[] {
		const result: IRange[] = [];
		const first = { start: one.start, end: Math.min(other.start, one.end) };
		const second = { start: Math.max(other.end, one.start), end: one.end };

		if (!isEmpty(first)) {
			result.push(first);
		}

		if (!isEmpty(second)) {
			result.push(second);
		}

		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/resources.ts]---
Location: vscode-main/src/vs/base/common/resources.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from './charCode.js';
import * as extpath from './extpath.js';
import { Schemas } from './network.js';
import * as paths from './path.js';
import { isLinux, isWindows } from './platform.js';
import { compare as strCompare, equalsIgnoreCase } from './strings.js';
import { URI, uriToFsPath } from './uri.js';

export function originalFSPath(uri: URI): string {
	return uriToFsPath(uri, true);
}

//#region IExtUri

export interface IExtUri {

	// --- identity

	/**
	 * Compares two uris.
	 *
	 * @param uri1 Uri
	 * @param uri2 Uri
	 * @param ignoreFragment Ignore the fragment (defaults to `false`)
	 */
	compare(uri1: URI, uri2: URI, ignoreFragment?: boolean): number;

	/**
	 * Tests whether two uris are equal
	 *
	 * @param uri1 Uri
	 * @param uri2 Uri
	 * @param ignoreFragment Ignore the fragment (defaults to `false`)
	 */
	isEqual(uri1: URI | undefined, uri2: URI | undefined, ignoreFragment?: boolean): boolean;

	/**
	 * Tests whether a `candidate` URI is a parent or equal of a given `base` URI.
	 *
	 * @param base A uri which is "longer" or at least same length as `parentCandidate`
	 * @param parentCandidate A uri which is "shorter" or up to same length as `base`
	 * @param ignoreFragment Ignore the fragment (defaults to `false`)
	 */
	isEqualOrParent(base: URI, parentCandidate: URI, ignoreFragment?: boolean): boolean;

	/**
	 * Creates a key from a resource URI to be used to resource comparison and for resource maps.
	 * @see {@link ResourceMap}
	 * @param uri Uri
	 * @param ignoreFragment Ignore the fragment (defaults to `false`)
	 */
	getComparisonKey(uri: URI, ignoreFragment?: boolean): string;

	/**
	 * Whether the casing of the path-component of the uri should be ignored.
	 */
	ignorePathCasing(uri: URI): boolean;

	// --- path math

	basenameOrAuthority(resource: URI): string;

	/**
	 * Returns the basename of the path component of an uri.
	 * @param resource
	 */
	basename(resource: URI): string;

	/**
	 * Returns the extension of the path component of an uri.
	 * @param resource
	 */
	extname(resource: URI): string;
	/**
	 * Return a URI representing the directory of a URI path.
	 *
	 * @param resource The input URI.
	 * @returns The URI representing the directory of the input URI.
	 */
	dirname(resource: URI): URI;
	/**
	 * Join a URI path with path fragments and normalizes the resulting path.
	 *
	 * @param resource The input URI.
	 * @param pathFragment The path fragment to add to the URI path.
	 * @returns The resulting URI.
	 */
	joinPath(resource: URI, ...pathFragment: string[]): URI;
	/**
	 * Normalizes the path part of a URI: Resolves `.` and `..` elements with directory names.
	 *
	 * @param resource The URI to normalize the path.
	 * @returns The URI with the normalized path.
	 */
	normalizePath(resource: URI): URI;
	/**
	 *
	 * @param from
	 * @param to
	 */
	relativePath(from: URI, to: URI): string | undefined;
	/**
	 * Resolves an absolute or relative path against a base URI.
	 * The path can be relative or absolute posix or a Windows path
	 */
	resolvePath(base: URI, path: string): URI;

	// --- misc

	/**
	 * Returns true if the URI path is absolute.
	 */
	isAbsolutePath(resource: URI): boolean;
	/**
	 * Tests whether the two authorities are the same
	 */
	isEqualAuthority(a1: string, a2: string): boolean;
	/**
	 * Returns true if the URI path has a trailing path separator
	 */
	hasTrailingPathSeparator(resource: URI, sep?: string): boolean;
	/**
	 * Removes a trailing path separator, if there's one.
	 * Important: Doesn't remove the first slash, it would make the URI invalid
	 */
	removeTrailingPathSeparator(resource: URI, sep?: string): URI;
	/**
	 * Adds a trailing path separator to the URI if there isn't one already.
	 * For example, c:\ would be unchanged, but c:\users would become c:\users\
	 */
	addTrailingPathSeparator(resource: URI, sep?: string): URI;
}

export class ExtUri implements IExtUri {

	constructor(private _ignorePathCasing: (uri: URI) => boolean) { }

	compare(uri1: URI, uri2: URI, ignoreFragment: boolean = false): number {
		if (uri1 === uri2) {
			return 0;
		}
		return strCompare(this.getComparisonKey(uri1, ignoreFragment), this.getComparisonKey(uri2, ignoreFragment));
	}

	isEqual(uri1: URI | undefined, uri2: URI | undefined, ignoreFragment: boolean = false): boolean {
		if (uri1 === uri2) {
			return true;
		}
		if (!uri1 || !uri2) {
			return false;
		}
		return this.getComparisonKey(uri1, ignoreFragment) === this.getComparisonKey(uri2, ignoreFragment);
	}

	getComparisonKey(uri: URI, ignoreFragment: boolean = false): string {
		return uri.with({
			path: this._ignorePathCasing(uri) ? uri.path.toLowerCase() : undefined,
			fragment: ignoreFragment ? null : undefined
		}).toString();
	}

	ignorePathCasing(uri: URI): boolean {
		return this._ignorePathCasing(uri);
	}

	isEqualOrParent(base: URI, parentCandidate: URI, ignoreFragment: boolean = false): boolean {
		if (base.scheme === parentCandidate.scheme) {
			if (base.scheme === Schemas.file) {
				return extpath.isEqualOrParent(originalFSPath(base), originalFSPath(parentCandidate), this._ignorePathCasing(base)) && base.query === parentCandidate.query && (ignoreFragment || base.fragment === parentCandidate.fragment);
			}
			if (isEqualAuthority(base.authority, parentCandidate.authority)) {
				return extpath.isEqualOrParent(base.path, parentCandidate.path, this._ignorePathCasing(base), '/') && base.query === parentCandidate.query && (ignoreFragment || base.fragment === parentCandidate.fragment);
			}
		}
		return false;
	}

	// --- path math

	joinPath(resource: URI, ...pathFragment: string[]): URI {
		return URI.joinPath(resource, ...pathFragment);
	}

	basenameOrAuthority(resource: URI): string {
		return basename(resource) || resource.authority;
	}

	basename(resource: URI): string {
		return paths.posix.basename(resource.path);
	}

	extname(resource: URI): string {
		return paths.posix.extname(resource.path);
	}

	dirname(resource: URI): URI {
		if (resource.path.length === 0) {
			return resource;
		}
		let dirname;
		if (resource.scheme === Schemas.file) {
			dirname = URI.file(paths.dirname(originalFSPath(resource))).path;
		} else {
			dirname = paths.posix.dirname(resource.path);
			if (resource.authority && dirname.length && dirname.charCodeAt(0) !== CharCode.Slash) {
				console.error(`dirname("${resource.toString})) resulted in a relative path`);
				dirname = '/'; // If a URI contains an authority component, then the path component must either be empty or begin with a CharCode.Slash ("/") character
			}
		}
		return resource.with({
			path: dirname
		});
	}

	normalizePath(resource: URI): URI {
		if (!resource.path.length) {
			return resource;
		}
		let normalizedPath: string;
		if (resource.scheme === Schemas.file) {
			normalizedPath = URI.file(paths.normalize(originalFSPath(resource))).path;
		} else {
			normalizedPath = paths.posix.normalize(resource.path);
		}
		return resource.with({
			path: normalizedPath
		});
	}

	relativePath(from: URI, to: URI): string | undefined {
		if (from.scheme !== to.scheme || !isEqualAuthority(from.authority, to.authority)) {
			return undefined;
		}
		if (from.scheme === Schemas.file) {
			const relativePath = paths.relative(originalFSPath(from), originalFSPath(to));
			return isWindows ? extpath.toSlashes(relativePath) : relativePath;
		}
		let fromPath = from.path || '/';
		const toPath = to.path || '/';
		if (this._ignorePathCasing(from)) {
			// make casing of fromPath match toPath
			let i = 0;
			for (const len = Math.min(fromPath.length, toPath.length); i < len; i++) {
				if (fromPath.charCodeAt(i) !== toPath.charCodeAt(i)) {
					if (fromPath.charAt(i).toLowerCase() !== toPath.charAt(i).toLowerCase()) {
						break;
					}
				}
			}
			fromPath = toPath.substr(0, i) + fromPath.substr(i);
		}
		return paths.posix.relative(fromPath, toPath);
	}

	resolvePath(base: URI, path: string): URI {
		if (base.scheme === Schemas.file) {
			const newURI = URI.file(paths.resolve(originalFSPath(base), path));
			return base.with({
				authority: newURI.authority,
				path: newURI.path
			});
		}
		path = extpath.toPosixPath(path); // we allow path to be a windows path
		return base.with({
			path: paths.posix.resolve(base.path, path)
		});
	}

	// --- misc

	isAbsolutePath(resource: URI): boolean {
		return !!resource.path && resource.path[0] === '/';
	}

	isEqualAuthority(a1: string | undefined, a2: string | undefined) {
		return a1 === a2 || (a1 !== undefined && a2 !== undefined && equalsIgnoreCase(a1, a2));
	}

	hasTrailingPathSeparator(resource: URI, sep: string = paths.sep): boolean {
		if (resource.scheme === Schemas.file) {
			const fsp = originalFSPath(resource);
			return fsp.length > extpath.getRoot(fsp).length && fsp[fsp.length - 1] === sep;
		} else {
			const p = resource.path;
			return (p.length > 1 && p.charCodeAt(p.length - 1) === CharCode.Slash) && !(/^[a-zA-Z]:(\/$|\\$)/.test(resource.fsPath)); // ignore the slash at offset 0
		}
	}

	removeTrailingPathSeparator(resource: URI, sep: string = paths.sep): URI {
		// Make sure that the path isn't a drive letter. A trailing separator there is not removable.
		if (hasTrailingPathSeparator(resource, sep)) {
			return resource.with({ path: resource.path.substr(0, resource.path.length - 1) });
		}
		return resource;
	}

	addTrailingPathSeparator(resource: URI, sep: string = paths.sep): URI {
		let isRootSep: boolean = false;
		if (resource.scheme === Schemas.file) {
			const fsp = originalFSPath(resource);
			isRootSep = ((fsp !== undefined) && (fsp.length === extpath.getRoot(fsp).length) && (fsp[fsp.length - 1] === sep));
		} else {
			sep = '/';
			const p = resource.path;
			isRootSep = p.length === 1 && p.charCodeAt(p.length - 1) === CharCode.Slash;
		}
		if (!isRootSep && !hasTrailingPathSeparator(resource, sep)) {
			return resource.with({ path: resource.path + '/' });
		}
		return resource;
	}
}


/**
 * Unbiased utility that takes uris "as they are". This means it can be interchanged with
 * uri#toString() usages. The following is true
 * ```
 * assertEqual(aUri.toString() === bUri.toString(), exturi.isEqual(aUri, bUri))
 * ```
 */
export const extUri = new ExtUri(() => false);

/**
 * BIASED utility that _mostly_ ignored the case of urs paths. ONLY use this util if you
 * understand what you are doing.
 *
 * This utility is INCOMPATIBLE with `uri.toString()`-usages and both CANNOT be used interchanged.
 *
 * When dealing with uris from files or documents, `extUri` (the unbiased friend)is sufficient
 * because those uris come from a "trustworthy source". When creating unknown uris it's always
 * better to use `IUriIdentityService` which exposes an `IExtUri`-instance which knows when path
 * casing matters.
 */
export const extUriBiasedIgnorePathCase = new ExtUri(uri => {
	// A file scheme resource is in the same platform as code, so ignore case for non linux platforms
	// Resource can be from another platform. Lowering the case as an hack. Should come from File system provider
	return uri.scheme === Schemas.file ? !isLinux : true;
});


/**
 * BIASED utility that always ignores the casing of uris paths. ONLY use this util if you
 * understand what you are doing.
 *
 * This utility is INCOMPATIBLE with `uri.toString()`-usages and both CANNOT be used interchanged.
 *
 * When dealing with uris from files or documents, `extUri` (the unbiased friend)is sufficient
 * because those uris come from a "trustworthy source". When creating unknown uris it's always
 * better to use `IUriIdentityService` which exposes an `IExtUri`-instance which knows when path
 * casing matters.
 */
export const extUriIgnorePathCase = new ExtUri(_ => true);

export const isEqual = extUri.isEqual.bind(extUri);
export const isEqualOrParent = extUri.isEqualOrParent.bind(extUri);
export const getComparisonKey = extUri.getComparisonKey.bind(extUri);
export const basenameOrAuthority = extUri.basenameOrAuthority.bind(extUri);
export const basename = extUri.basename.bind(extUri);
export const extname = extUri.extname.bind(extUri);
export const dirname = extUri.dirname.bind(extUri);
export const joinPath = extUri.joinPath.bind(extUri);
export const normalizePath = extUri.normalizePath.bind(extUri);
export const relativePath = extUri.relativePath.bind(extUri);
export const resolvePath = extUri.resolvePath.bind(extUri);
export const isAbsolutePath = extUri.isAbsolutePath.bind(extUri);
export const isEqualAuthority = extUri.isEqualAuthority.bind(extUri);
export const hasTrailingPathSeparator = extUri.hasTrailingPathSeparator.bind(extUri);
export const removeTrailingPathSeparator = extUri.removeTrailingPathSeparator.bind(extUri);
export const addTrailingPathSeparator = extUri.addTrailingPathSeparator.bind(extUri);

//#endregion

export function distinctParents<T>(items: T[], resourceAccessor: (item: T) => URI): T[] {
	const distinctParents: T[] = [];
	for (let i = 0; i < items.length; i++) {
		const candidateResource = resourceAccessor(items[i]);
		if (items.some((otherItem, index) => {
			if (index === i) {
				return false;
			}

			return isEqualOrParent(candidateResource, resourceAccessor(otherItem));
		})) {
			continue;
		}

		distinctParents.push(items[i]);
	}

	return distinctParents;
}

/**
 * Data URI related helpers.
 */
export namespace DataUri {

	export const META_DATA_LABEL = 'label';
	export const META_DATA_DESCRIPTION = 'description';
	export const META_DATA_SIZE = 'size';
	export const META_DATA_MIME = 'mime';

	export function parseMetaData(dataUri: URI): Map<string, string> {
		const metadata = new Map<string, string>();

		// Given a URI of:  data:image/png;size:2313;label:SomeLabel;description:SomeDescription;base64,77+9UE5...
		// the metadata is: size:2313;label:SomeLabel;description:SomeDescription
		const meta = dataUri.path.substring(dataUri.path.indexOf(';') + 1, dataUri.path.lastIndexOf(';'));
		meta.split(';').forEach(property => {
			const [key, value] = property.split(':');
			if (key && value) {
				metadata.set(key, value);
			}
		});

		// Given a URI of:  data:image/png;size:2313;label:SomeLabel;description:SomeDescription;base64,77+9UE5...
		// the mime is: image/png
		const mime = dataUri.path.substring(0, dataUri.path.indexOf(';'));
		if (mime) {
			metadata.set(META_DATA_MIME, mime);
		}

		return metadata;
	}
}

export function toLocalResource(resource: URI, authority: string | undefined, localScheme: string): URI {
	if (authority) {
		let path = resource.path;
		if (path && path[0] !== paths.posix.sep) {
			path = paths.posix.sep + path;
		}

		return resource.with({ scheme: localScheme, authority, path });
	}

	return resource.with({ scheme: localScheme });
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/resourceTree.ts]---
Location: vscode-main/src/vs/base/common/resourceTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { memoize } from './decorators.js';
import { PathIterator } from './ternarySearchTree.js';
import * as paths from './path.js';
import { extUri as defaultExtUri, IExtUri } from './resources.js';
import { URI } from './uri.js';

export interface IResourceNode<T, C = void> {
	readonly uri: URI;
	readonly relativePath: string;
	readonly name: string;
	readonly element: T | undefined;
	readonly children: Iterable<IResourceNode<T, C>>;
	readonly childrenCount: number;
	readonly parent: IResourceNode<T, C> | undefined;
	readonly context: C;
	get(childName: string): IResourceNode<T, C> | undefined;
}

class Node<T, C> implements IResourceNode<T, C> {

	private _children = new Map<string, Node<T, C>>();

	get childrenCount(): number {
		return this._children.size;
	}

	get children(): Iterable<Node<T, C>> {
		return this._children.values();
	}

	@memoize
	get name(): string {
		return paths.posix.basename(this.relativePath);
	}

	constructor(
		readonly uri: URI,
		readonly relativePath: string,
		readonly context: C,
		public element: T | undefined = undefined,
		readonly parent: IResourceNode<T, C> | undefined = undefined
	) { }

	get(path: string): Node<T, C> | undefined {
		return this._children.get(path);
	}

	set(path: string, child: Node<T, C>): void {
		this._children.set(path, child);
	}

	delete(path: string): void {
		this._children.delete(path);
	}

	clear(): void {
		this._children.clear();
	}
}

function collect<T, C>(node: IResourceNode<T, C>, result: T[]): T[] {
	if (typeof node.element !== 'undefined') {
		result.push(node.element);
	}

	for (const child of node.children) {
		collect(child, result);
	}

	return result;
}

export class ResourceTree<T extends NonNullable<unknown>, C> {

	readonly root: Node<T, C>;

	static getRoot<T, C>(node: IResourceNode<T, C>): IResourceNode<T, C> {
		while (node.parent) {
			node = node.parent;
		}

		return node;
	}

	static collect<T, C>(node: IResourceNode<T, C>): T[] {
		return collect(node, []);
	}

	static isResourceNode<T, C>(obj: unknown): obj is IResourceNode<T, C> {
		return obj instanceof Node;
	}

	constructor(context: C, rootURI: URI = URI.file('/'), private extUri: IExtUri = defaultExtUri) {
		this.root = new Node(rootURI, '', context);
	}

	add(uri: URI, element: T): void {
		const key = this.extUri.relativePath(this.root.uri, uri) || uri.path;
		const iterator = new PathIterator(false).reset(key);
		let node = this.root;
		let path = '';

		while (true) {
			const name = iterator.value();
			path = path + '/' + name;

			let child = node.get(name);

			if (!child) {
				child = new Node(
					this.extUri.joinPath(this.root.uri, path),
					path,
					this.root.context,
					iterator.hasNext() ? undefined : element,
					node
				);

				node.set(name, child);
			} else if (!iterator.hasNext()) {
				child.element = element;
			}

			node = child;

			if (!iterator.hasNext()) {
				return;
			}

			iterator.next();
		}
	}

	delete(uri: URI): T | undefined {
		const key = this.extUri.relativePath(this.root.uri, uri) || uri.path;
		const iterator = new PathIterator(false).reset(key);
		return this._delete(this.root, iterator);
	}

	private _delete(node: Node<T, C>, iterator: PathIterator): T | undefined {
		const name = iterator.value();
		const child = node.get(name);

		if (!child) {
			return undefined;
		}

		if (iterator.hasNext()) {
			const result = this._delete(child, iterator.next());

			if (typeof result !== 'undefined' && child.childrenCount === 0) {
				node.delete(name);
			}

			return result;
		}

		node.delete(name);
		return child.element;
	}

	clear(): void {
		this.root.clear();
	}

	getNode(uri: URI): IResourceNode<T, C> | undefined {
		const key = this.extUri.relativePath(this.root.uri, uri) || uri.path;
		const iterator = new PathIterator(false).reset(key);
		let node = this.root;

		while (true) {
			const name = iterator.value();
			const child = node.get(name);

			if (!child || !iterator.hasNext()) {
				return child;
			}

			node = child;
			iterator.next();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/scrollable.ts]---
Location: vscode-main/src/vs/base/common/scrollable.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from './event.js';
import { Disposable, IDisposable } from './lifecycle.js';

export const enum ScrollbarVisibility {
	Auto = 1,
	Hidden = 2,
	Visible = 3
}

export interface ScrollEvent {
	inSmoothScrolling: boolean;

	oldWidth: number;
	oldScrollWidth: number;
	oldScrollLeft: number;

	width: number;
	scrollWidth: number;
	scrollLeft: number;

	oldHeight: number;
	oldScrollHeight: number;
	oldScrollTop: number;

	height: number;
	scrollHeight: number;
	scrollTop: number;

	widthChanged: boolean;
	scrollWidthChanged: boolean;
	scrollLeftChanged: boolean;

	heightChanged: boolean;
	scrollHeightChanged: boolean;
	scrollTopChanged: boolean;
}

export class ScrollState implements IScrollDimensions, IScrollPosition {
	_scrollStateBrand: void = undefined;

	public readonly rawScrollLeft: number;
	public readonly rawScrollTop: number;

	public readonly width: number;
	public readonly scrollWidth: number;
	public readonly scrollLeft: number;
	public readonly height: number;
	public readonly scrollHeight: number;
	public readonly scrollTop: number;

	constructor(
		private readonly _forceIntegerValues: boolean,
		width: number,
		scrollWidth: number,
		scrollLeft: number,
		height: number,
		scrollHeight: number,
		scrollTop: number
	) {
		if (this._forceIntegerValues) {
			width = width | 0;
			scrollWidth = scrollWidth | 0;
			scrollLeft = scrollLeft | 0;
			height = height | 0;
			scrollHeight = scrollHeight | 0;
			scrollTop = scrollTop | 0;
		}

		this.rawScrollLeft = scrollLeft; // before validation
		this.rawScrollTop = scrollTop; // before validation

		if (width < 0) {
			width = 0;
		}
		if (scrollLeft + width > scrollWidth) {
			scrollLeft = scrollWidth - width;
		}
		if (scrollLeft < 0) {
			scrollLeft = 0;
		}

		if (height < 0) {
			height = 0;
		}
		if (scrollTop + height > scrollHeight) {
			scrollTop = scrollHeight - height;
		}
		if (scrollTop < 0) {
			scrollTop = 0;
		}

		this.width = width;
		this.scrollWidth = scrollWidth;
		this.scrollLeft = scrollLeft;
		this.height = height;
		this.scrollHeight = scrollHeight;
		this.scrollTop = scrollTop;
	}

	public equals(other: ScrollState): boolean {
		return (
			this.rawScrollLeft === other.rawScrollLeft
			&& this.rawScrollTop === other.rawScrollTop
			&& this.width === other.width
			&& this.scrollWidth === other.scrollWidth
			&& this.scrollLeft === other.scrollLeft
			&& this.height === other.height
			&& this.scrollHeight === other.scrollHeight
			&& this.scrollTop === other.scrollTop
		);
	}

	public withScrollDimensions(update: INewScrollDimensions, useRawScrollPositions: boolean): ScrollState {
		return new ScrollState(
			this._forceIntegerValues,
			(typeof update.width !== 'undefined' ? update.width : this.width),
			(typeof update.scrollWidth !== 'undefined' ? update.scrollWidth : this.scrollWidth),
			useRawScrollPositions ? this.rawScrollLeft : this.scrollLeft,
			(typeof update.height !== 'undefined' ? update.height : this.height),
			(typeof update.scrollHeight !== 'undefined' ? update.scrollHeight : this.scrollHeight),
			useRawScrollPositions ? this.rawScrollTop : this.scrollTop
		);
	}

	public withScrollPosition(update: INewScrollPosition): ScrollState {
		return new ScrollState(
			this._forceIntegerValues,
			this.width,
			this.scrollWidth,
			(typeof update.scrollLeft !== 'undefined' ? update.scrollLeft : this.rawScrollLeft),
			this.height,
			this.scrollHeight,
			(typeof update.scrollTop !== 'undefined' ? update.scrollTop : this.rawScrollTop)
		);
	}

	public createScrollEvent(previous: ScrollState, inSmoothScrolling: boolean): ScrollEvent {
		const widthChanged = (this.width !== previous.width);
		const scrollWidthChanged = (this.scrollWidth !== previous.scrollWidth);
		const scrollLeftChanged = (this.scrollLeft !== previous.scrollLeft);

		const heightChanged = (this.height !== previous.height);
		const scrollHeightChanged = (this.scrollHeight !== previous.scrollHeight);
		const scrollTopChanged = (this.scrollTop !== previous.scrollTop);

		return {
			inSmoothScrolling: inSmoothScrolling,
			oldWidth: previous.width,
			oldScrollWidth: previous.scrollWidth,
			oldScrollLeft: previous.scrollLeft,

			width: this.width,
			scrollWidth: this.scrollWidth,
			scrollLeft: this.scrollLeft,

			oldHeight: previous.height,
			oldScrollHeight: previous.scrollHeight,
			oldScrollTop: previous.scrollTop,

			height: this.height,
			scrollHeight: this.scrollHeight,
			scrollTop: this.scrollTop,

			widthChanged: widthChanged,
			scrollWidthChanged: scrollWidthChanged,
			scrollLeftChanged: scrollLeftChanged,

			heightChanged: heightChanged,
			scrollHeightChanged: scrollHeightChanged,
			scrollTopChanged: scrollTopChanged,
		};
	}

}

export interface IScrollDimensions {
	readonly width: number;
	readonly scrollWidth: number;
	readonly height: number;
	readonly scrollHeight: number;
}
export interface INewScrollDimensions {
	width?: number;
	scrollWidth?: number;
	height?: number;
	scrollHeight?: number;
}

export interface IScrollPosition {
	readonly scrollLeft: number;
	readonly scrollTop: number;
}
export interface ISmoothScrollPosition {
	readonly scrollLeft: number;
	readonly scrollTop: number;

	readonly width: number;
	readonly height: number;
}
export interface INewScrollPosition {
	scrollLeft?: number;
	scrollTop?: number;
}

export interface IScrollableOptions {
	/**
	 * Define if the scroll values should always be integers.
	 */
	forceIntegerValues: boolean;
	/**
	 * Set the duration (ms) used for smooth scroll animations.
	 */
	smoothScrollDuration: number;
	/**
	 * A function to schedule an update at the next frame (used for smooth scroll animations).
	 */
	scheduleAtNextAnimationFrame: (callback: () => void) => IDisposable;
}

export class Scrollable extends Disposable {

	_scrollableBrand: void = undefined;

	private _smoothScrollDuration: number;
	private readonly _scheduleAtNextAnimationFrame: (callback: () => void) => IDisposable;
	private _state: ScrollState;
	private _smoothScrolling: SmoothScrollingOperation | null;

	private _onScroll = this._register(new Emitter<ScrollEvent>());
	public readonly onScroll: Event<ScrollEvent> = this._onScroll.event;

	constructor(options: IScrollableOptions) {
		super();

		this._smoothScrollDuration = options.smoothScrollDuration;
		this._scheduleAtNextAnimationFrame = options.scheduleAtNextAnimationFrame;
		this._state = new ScrollState(options.forceIntegerValues, 0, 0, 0, 0, 0, 0);
		this._smoothScrolling = null;
	}

	public override dispose(): void {
		if (this._smoothScrolling) {
			this._smoothScrolling.dispose();
			this._smoothScrolling = null;
		}
		super.dispose();
	}

	public setSmoothScrollDuration(smoothScrollDuration: number): void {
		this._smoothScrollDuration = smoothScrollDuration;
	}

	public validateScrollPosition(scrollPosition: INewScrollPosition): IScrollPosition {
		return this._state.withScrollPosition(scrollPosition);
	}

	public getScrollDimensions(): IScrollDimensions {
		return this._state;
	}

	public setScrollDimensions(dimensions: INewScrollDimensions, useRawScrollPositions: boolean): void {
		const newState = this._state.withScrollDimensions(dimensions, useRawScrollPositions);
		this._setState(newState, Boolean(this._smoothScrolling));

		// Validate outstanding animated scroll position target
		this._smoothScrolling?.acceptScrollDimensions(this._state);
	}

	/**
	 * Returns the final scroll position that the instance will have once the smooth scroll animation concludes.
	 * If no scroll animation is occurring, it will return the current scroll position instead.
	 */
	public getFutureScrollPosition(): IScrollPosition {
		if (this._smoothScrolling) {
			return this._smoothScrolling.to;
		}
		return this._state;
	}

	/**
	 * Returns the current scroll position.
	 * Note: This result might be an intermediate scroll position, as there might be an ongoing smooth scroll animation.
	 */
	public getCurrentScrollPosition(): IScrollPosition {
		return this._state;
	}

	public setScrollPositionNow(update: INewScrollPosition): void {
		// no smooth scrolling requested
		const newState = this._state.withScrollPosition(update);

		// Terminate any outstanding smooth scrolling
		if (this._smoothScrolling) {
			this._smoothScrolling.dispose();
			this._smoothScrolling = null;
		}

		this._setState(newState, false);
	}

	public setScrollPositionSmooth(update: INewScrollPosition, reuseAnimation?: boolean): void {
		if (this._smoothScrollDuration === 0) {
			// Smooth scrolling not supported.
			return this.setScrollPositionNow(update);
		}

		if (this._smoothScrolling) {
			// Combine our pending scrollLeft/scrollTop with incoming scrollLeft/scrollTop
			update = {
				scrollLeft: (typeof update.scrollLeft === 'undefined' ? this._smoothScrolling.to.scrollLeft : update.scrollLeft),
				scrollTop: (typeof update.scrollTop === 'undefined' ? this._smoothScrolling.to.scrollTop : update.scrollTop)
			};

			// Validate `update`
			const validTarget = this._state.withScrollPosition(update);

			if (this._smoothScrolling.to.scrollLeft === validTarget.scrollLeft && this._smoothScrolling.to.scrollTop === validTarget.scrollTop) {
				// No need to interrupt or extend the current animation since we're going to the same place
				return;
			}
			let newSmoothScrolling: SmoothScrollingOperation;
			if (reuseAnimation) {
				newSmoothScrolling = new SmoothScrollingOperation(this._smoothScrolling.from, validTarget, this._smoothScrolling.startTime, this._smoothScrolling.duration);
			} else {
				newSmoothScrolling = this._smoothScrolling.combine(this._state, validTarget, this._smoothScrollDuration);
			}
			this._smoothScrolling.dispose();
			this._smoothScrolling = newSmoothScrolling;
		} else {
			// Validate `update`
			const validTarget = this._state.withScrollPosition(update);

			this._smoothScrolling = SmoothScrollingOperation.start(this._state, validTarget, this._smoothScrollDuration);
		}

		// Begin smooth scrolling animation
		this._smoothScrolling.animationFrameDisposable = this._scheduleAtNextAnimationFrame(() => {
			if (!this._smoothScrolling) {
				return;
			}
			this._smoothScrolling.animationFrameDisposable = null;
			this._performSmoothScrolling();
		});
	}

	public hasPendingScrollAnimation(): boolean {
		return Boolean(this._smoothScrolling);
	}

	private _performSmoothScrolling(): void {
		if (!this._smoothScrolling) {
			return;
		}
		const update = this._smoothScrolling.tick();
		const newState = this._state.withScrollPosition(update);

		this._setState(newState, true);

		if (!this._smoothScrolling) {
			// Looks like someone canceled the smooth scrolling
			// from the scroll event handler
			return;
		}

		if (update.isDone) {
			this._smoothScrolling.dispose();
			this._smoothScrolling = null;
			return;
		}

		// Continue smooth scrolling animation
		this._smoothScrolling.animationFrameDisposable = this._scheduleAtNextAnimationFrame(() => {
			if (!this._smoothScrolling) {
				return;
			}
			this._smoothScrolling.animationFrameDisposable = null;
			this._performSmoothScrolling();
		});
	}

	private _setState(newState: ScrollState, inSmoothScrolling: boolean): void {
		const oldState = this._state;
		if (oldState.equals(newState)) {
			// no change
			return;
		}
		this._state = newState;
		this._onScroll.fire(this._state.createScrollEvent(oldState, inSmoothScrolling));
	}
}

export class SmoothScrollingUpdate {

	public readonly scrollLeft: number;
	public readonly scrollTop: number;
	public readonly isDone: boolean;

	constructor(scrollLeft: number, scrollTop: number, isDone: boolean) {
		this.scrollLeft = scrollLeft;
		this.scrollTop = scrollTop;
		this.isDone = isDone;
	}

}

interface IAnimation {
	(completion: number): number;
}

function createEaseOutCubic(from: number, to: number): IAnimation {
	const delta = to - from;
	return function (completion: number): number {
		return from + delta * easeOutCubic(completion);
	};
}

function createComposed(a: IAnimation, b: IAnimation, cut: number): IAnimation {
	return function (completion: number): number {
		if (completion < cut) {
			return a(completion / cut);
		}
		return b((completion - cut) / (1 - cut));
	};
}

export class SmoothScrollingOperation {

	public readonly from: ISmoothScrollPosition;
	public to: ISmoothScrollPosition;
	public readonly duration: number;
	public readonly startTime: number;
	public animationFrameDisposable: IDisposable | null;

	private scrollLeft!: IAnimation;
	private scrollTop!: IAnimation;

	constructor(from: ISmoothScrollPosition, to: ISmoothScrollPosition, startTime: number, duration: number) {
		this.from = from;
		this.to = to;
		this.duration = duration;
		this.startTime = startTime;

		this.animationFrameDisposable = null;

		this._initAnimations();
	}

	private _initAnimations(): void {
		this.scrollLeft = this._initAnimation(this.from.scrollLeft, this.to.scrollLeft, this.to.width);
		this.scrollTop = this._initAnimation(this.from.scrollTop, this.to.scrollTop, this.to.height);
	}

	private _initAnimation(from: number, to: number, viewportSize: number): IAnimation {
		const delta = Math.abs(from - to);
		if (delta > 2.5 * viewportSize) {
			let stop1: number, stop2: number;
			if (from < to) {
				// scroll to 75% of the viewportSize
				stop1 = from + 0.75 * viewportSize;
				stop2 = to - 0.75 * viewportSize;
			} else {
				stop1 = from - 0.75 * viewportSize;
				stop2 = to + 0.75 * viewportSize;
			}
			return createComposed(createEaseOutCubic(from, stop1), createEaseOutCubic(stop2, to), 0.33);
		}
		return createEaseOutCubic(from, to);
	}

	public dispose(): void {
		if (this.animationFrameDisposable !== null) {
			this.animationFrameDisposable.dispose();
			this.animationFrameDisposable = null;
		}
	}

	public acceptScrollDimensions(state: ScrollState): void {
		this.to = state.withScrollPosition(this.to);
		this._initAnimations();
	}

	public tick(): SmoothScrollingUpdate {
		return this._tick(Date.now());
	}

	protected _tick(now: number): SmoothScrollingUpdate {
		const completion = (now - this.startTime) / this.duration;

		if (completion < 1) {
			const newScrollLeft = this.scrollLeft(completion);
			const newScrollTop = this.scrollTop(completion);
			return new SmoothScrollingUpdate(newScrollLeft, newScrollTop, false);
		}

		return new SmoothScrollingUpdate(this.to.scrollLeft, this.to.scrollTop, true);
	}

	public combine(from: ISmoothScrollPosition, to: ISmoothScrollPosition, duration: number): SmoothScrollingOperation {
		return SmoothScrollingOperation.start(from, to, duration);
	}

	public static start(from: ISmoothScrollPosition, to: ISmoothScrollPosition, duration: number): SmoothScrollingOperation {
		// +10 / -10 : pretend the animation already started for a quicker response to a scroll request
		duration = duration + 10;
		const startTime = Date.now() - 10;

		return new SmoothScrollingOperation(from, to, startTime, duration);
	}
}

function easeInCubic(t: number) {
	return Math.pow(t, 3);
}

function easeOutCubic(t: number) {
	return 1 - easeInCubic(1 - t);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/search.ts]---
Location: vscode-main/src/vs/base/common/search.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as strings from './strings.js';

export function buildReplaceStringWithCasePreserved(matches: string[] | null, pattern: string): string {
	if (matches && (matches[0] !== '')) {
		const containsHyphens = validateSpecificSpecialCharacter(matches, pattern, '-');
		const containsUnderscores = validateSpecificSpecialCharacter(matches, pattern, '_');
		if (containsHyphens && !containsUnderscores) {
			return buildReplaceStringForSpecificSpecialCharacter(matches, pattern, '-');
		} else if (!containsHyphens && containsUnderscores) {
			return buildReplaceStringForSpecificSpecialCharacter(matches, pattern, '_');
		}
		if (matches[0].toUpperCase() === matches[0]) {
			return pattern.toUpperCase();
		} else if (matches[0].toLowerCase() === matches[0]) {
			return pattern.toLowerCase();
		} else if (strings.containsUppercaseCharacter(matches[0][0]) && pattern.length > 0) {
			return pattern[0].toUpperCase() + pattern.substr(1);
		} else if (matches[0][0].toUpperCase() !== matches[0][0] && pattern.length > 0) {
			return pattern[0].toLowerCase() + pattern.substr(1);
		} else {
			// we don't understand its pattern yet.
			return pattern;
		}
	} else {
		return pattern;
	}
}

function validateSpecificSpecialCharacter(matches: string[], pattern: string, specialCharacter: string): boolean {
	const doesContainSpecialCharacter = matches[0].indexOf(specialCharacter) !== -1 && pattern.indexOf(specialCharacter) !== -1;
	return doesContainSpecialCharacter && matches[0].split(specialCharacter).length === pattern.split(specialCharacter).length;
}

function buildReplaceStringForSpecificSpecialCharacter(matches: string[], pattern: string, specialCharacter: string): string {
	const splitPatternAtSpecialCharacter = pattern.split(specialCharacter);
	const splitMatchAtSpecialCharacter = matches[0].split(specialCharacter);
	let replaceString: string = '';
	splitPatternAtSpecialCharacter.forEach((splitValue, index) => {
		replaceString += buildReplaceStringWithCasePreserved([splitMatchAtSpecialCharacter[index]], splitValue) + specialCharacter;
	});

	return replaceString.slice(0, -1);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/sequence.ts]---
Location: vscode-main/src/vs/base/common/sequence.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from './event.js';

export interface ISplice<T> {
	readonly start: number;
	readonly deleteCount: number;
	readonly toInsert: readonly T[];
}

export interface ISpliceable<T> {
	splice(start: number, deleteCount: number, toInsert: readonly T[]): void;
}

export interface ISequence<T> {
	readonly elements: T[];
	readonly onDidSplice: Event<ISplice<T>>;
}

export class Sequence<T> implements ISequence<T>, ISpliceable<T> {

	readonly elements: T[] = [];

	private readonly _onDidSplice = new Emitter<ISplice<T>>();
	readonly onDidSplice: Event<ISplice<T>> = this._onDidSplice.event;

	splice(start: number, deleteCount: number, toInsert: readonly T[] = []): void {
		this.elements.splice(start, deleteCount, ...toInsert);
		this._onDidSplice.fire({ start, deleteCount, toInsert });
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/severity.ts]---
Location: vscode-main/src/vs/base/common/severity.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as strings from './strings.js';

enum Severity {
	Ignore = 0,
	Info = 1,
	Warning = 2,
	Error = 3
}

namespace Severity {

	const _error = 'error';
	const _warning = 'warning';
	const _warn = 'warn';
	const _info = 'info';
	const _ignore = 'ignore';

	/**
	 * Parses 'error', 'warning', 'warn', 'info' in call casings
	 * and falls back to ignore.
	 */
	export function fromValue(value: string): Severity {
		if (!value) {
			return Severity.Ignore;
		}

		if (strings.equalsIgnoreCase(_error, value)) {
			return Severity.Error;
		}

		if (strings.equalsIgnoreCase(_warning, value) || strings.equalsIgnoreCase(_warn, value)) {
			return Severity.Warning;
		}

		if (strings.equalsIgnoreCase(_info, value)) {
			return Severity.Info;
		}
		return Severity.Ignore;
	}

	export function toString(severity: Severity): string {
		switch (severity) {
			case Severity.Error: return _error;
			case Severity.Warning: return _warning;
			case Severity.Info: return _info;
			default: return _ignore;
		}
	}
}

export default Severity;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/sseParser.ts]---
Location: vscode-main/src/vs/base/common/sseParser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Parser for Server-Sent Events (SSE) streams according to the HTML specification.
 * @see https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation
 */

/**
 * Represents an event dispatched from an SSE stream.
 */
export interface ISSEEvent {
	/**
	 * The event type. If not specified, the type is "message".
	 */
	type: string;

	/**
	 * The event data.
	 */
	data: string;

	/**
	 * The last event ID, used for reconnection.
	 */
	id?: string;

	/**
	 * Reconnection time in milliseconds.
	 */
	retry?: number;
}

/**
 * Callback function type for event dispatch.
 */
export type SSEEventHandler = (event: ISSEEvent) => void;

const enum Chr {
	CR = 13, // '\r'
	LF = 10, // '\n'
	COLON = 58, // ':'
	SPACE = 32, // ' '
}

/**
 * Parser for Server-Sent Events (SSE) streams.
 */
export class SSEParser {
	private dataBuffer = '';
	private eventTypeBuffer = '';
	private currentEventId?: string;
	private lastEventIdBuffer?: string;
	private reconnectionTime?: number;
	private buffer: Uint8Array[] = [];
	private endedOnCR = false;
	private readonly onEventHandler: SSEEventHandler;
	private readonly decoder: TextDecoder;
	/**
	 * Creates a new SSE parser.
	 * @param onEvent The callback to invoke when an event is dispatched.
	 */
	constructor(onEvent: SSEEventHandler) {
		this.onEventHandler = onEvent;
		this.decoder = new TextDecoder('utf-8');
	}

	/**
	 * Gets the last event ID received by this parser.
	 */
	public getLastEventId(): string | undefined {
		return this.lastEventIdBuffer;
	}
	/**
	 * Gets the reconnection time in milliseconds, if one was specified by the server.
	 */
	public getReconnectionTime(): number | undefined {
		return this.reconnectionTime;
	}

	/**
	 * Feeds a chunk of the SSE stream to the parser.
	 * @param chunk The chunk to parse as a Uint8Array of UTF-8 encoded data.
	 */
	public feed(chunk: Uint8Array): void {
		if (chunk.length === 0) {
			return;
		}

		let offset = 0;

		// If the data stream was bifurcated between a CR and LF, avoid processing the CR as an extra newline
		if (this.endedOnCR && chunk[0] === Chr.LF) {
			offset++;
		}
		this.endedOnCR = false;

		// Process complete lines from the buffer
		while (offset < chunk.length) {
			const indexCR = chunk.indexOf(Chr.CR, offset);
			const indexLF = chunk.indexOf(Chr.LF, offset);
			const index = indexCR === -1 ? indexLF : (indexLF === -1 ? indexCR : Math.min(indexCR, indexLF));
			if (index === -1) {
				break;
			}

			let str = '';
			for (const buf of this.buffer) {
				str += this.decoder.decode(buf, { stream: true });
			}
			str += this.decoder.decode(chunk.subarray(offset, index));
			this.processLine(str);

			this.buffer.length = 0;
			offset = index + (chunk[index] === Chr.CR && chunk[index + 1] === Chr.LF ? 2 : 1);
		}


		if (offset < chunk.length) {
			this.buffer.push(chunk.subarray(offset));
		} else {
			this.endedOnCR = chunk[chunk.length - 1] === Chr.CR;
		}
	}
	/**
	 * Processes a single line from the SSE stream.
	 */
	private processLine(line: string): void {
		if (!line.length) {
			this.dispatchEvent();
			return;
		}

		if (line.startsWith(':')) {
			return;
		}

		// Parse the field name and value
		let field: string;
		let value: string;

		const colonIndex = line.indexOf(':');
		if (colonIndex === -1) {
			// Line with no colon - the entire line is the field name, value is empty
			field = line;
			value = '';
		} else {
			// Line with a colon - split into field name and value
			field = line.substring(0, colonIndex);
			value = line.substring(colonIndex + 1);

			// If value starts with a space, remove it
			if (value.startsWith(' ')) {
				value = value.substring(1);
			}
		}

		this.processField(field, value);
	}
	/**
	 * Processes a field with the given name and value.
	 */
	private processField(field: string, value: string): void {
		switch (field) {
			case 'event':
				this.eventTypeBuffer = value;
				break;

			case 'data':
				// Append the value to the data buffer, followed by a newline
				this.dataBuffer += value;
				this.dataBuffer += '\n';
				break;

			case 'id':
				// If the field value doesn't contain NULL, set the last event ID buffer
				if (!value.includes('\0')) {
					this.currentEventId = this.lastEventIdBuffer = value;
				} else {
					this.currentEventId = undefined;
				}
				break;

			case 'retry':
				// If the field value consists only of ASCII digits, set the reconnection time
				if (/^\d+$/.test(value)) {
					this.reconnectionTime = parseInt(value, 10);
				}
				break;

			// Ignore any other fields
		}
	}
	/**
	 * Dispatches the event based on the current buffer states.
	 */
	private dispatchEvent(): void {
		// If the data buffer is empty, reset the buffers and return
		if (this.dataBuffer === '') {
			this.dataBuffer = '';
			this.eventTypeBuffer = '';
			return;
		}

		// If the data buffer's last character is a newline, remove it
		if (this.dataBuffer.endsWith('\n')) {
			this.dataBuffer = this.dataBuffer.substring(0, this.dataBuffer.length - 1);
		}

		// Create and dispatch the event
		const event: ISSEEvent = {
			type: this.eventTypeBuffer || 'message',
			data: this.dataBuffer,
		};

		// Add optional fields if they exist
		if (this.currentEventId !== undefined) {
			event.id = this.currentEventId;
		}

		if (this.reconnectionTime !== undefined) {
			event.retry = this.reconnectionTime;
		}

		// Dispatch the event
		this.onEventHandler(event);

		// Reset the data and event type buffers
		this.reset();
	}

	/**
	 * Resets the parser state.
	 */
	public reset(): void {
		this.dataBuffer = '';
		this.eventTypeBuffer = '';
		this.currentEventId = undefined;
		// Note: lastEventIdBuffer is not reset as it's used for reconnection
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/stopwatch.ts]---
Location: vscode-main/src/vs/base/common/stopwatch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare const globalThis: { performance: { now(): number } };
const performanceNow = globalThis.performance.now.bind(globalThis.performance);

export class StopWatch {

	private _startTime: number;
	private _stopTime: number;

	private readonly _now: () => number;

	public static create(highResolution?: boolean): StopWatch {
		return new StopWatch(highResolution);
	}

	constructor(highResolution?: boolean) {
		this._now = highResolution === false ? Date.now : performanceNow;
		this._startTime = this._now();
		this._stopTime = -1;
	}

	public stop(): void {
		this._stopTime = this._now();
	}

	public reset(): void {
		this._startTime = this._now();
		this._stopTime = -1;
	}

	public elapsed(): number {
		if (this._stopTime !== -1) {
			return this._stopTime - this._startTime;
		}
		return this._now() - this._startTime;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/stream.ts]---
Location: vscode-main/src/vs/base/common/stream.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from './cancellation.js';
import { onUnexpectedError } from './errors.js';
import { DisposableStore, toDisposable } from './lifecycle.js';

/**
 * The payload that flows in readable stream events.
 */
export type ReadableStreamEventPayload<T> = T | Error | 'end';

export interface ReadableStreamEvents<T> {

	/**
	 * The 'data' event is emitted whenever the stream is
	 * relinquishing ownership of a chunk of data to a consumer.
	 *
	 * NOTE: PLEASE UNDERSTAND THAT ADDING A DATA LISTENER CAN
	 * TURN THE STREAM INTO FLOWING MODE. IT IS THEREFOR THE
	 * LAST LISTENER THAT SHOULD BE ADDED AND NOT THE FIRST
	 *
	 * Use `listenStream` as a helper method to listen to
	 * stream events in the right order.
	 */
	on(event: 'data', callback: (data: T) => void): void;

	/**
	 * Emitted when any error occurs.
	 */
	on(event: 'error', callback: (err: Error) => void): void;

	/**
	 * The 'end' event is emitted when there is no more data
	 * to be consumed from the stream. The 'end' event will
	 * not be emitted unless the data is completely consumed.
	 */
	on(event: 'end', callback: () => void): void;
}

/**
 * A interface that emulates the API shape of a node.js readable
 * stream for use in native and web environments.
 */
export interface ReadableStream<T> extends ReadableStreamEvents<T> {

	/**
	 * Stops emitting any events until resume() is called.
	 */
	pause(): void;

	/**
	 * Starts emitting events again after pause() was called.
	 */
	resume(): void;

	/**
	 * Destroys the stream and stops emitting any event.
	 */
	destroy(): void;

	/**
	 * Allows to remove a listener that was previously added.
	 */
	removeListener(event: string, callback: Function): void;
}

/**
 * A interface that emulates the API shape of a node.js readable
 * for use in native and web environments.
 */
export interface Readable<T> {

	/**
	 * Read data from the underlying source. Will return
	 * null to indicate that no more data can be read.
	 */
	read(): T | null;
}

export function isReadable<T>(obj: unknown): obj is Readable<T> {
	const candidate = obj as Readable<T> | undefined;
	if (!candidate) {
		return false;
	}

	return typeof candidate.read === 'function';
}

/**
 * A interface that emulates the API shape of a node.js writeable
 * stream for use in native and web environments.
 */
export interface WriteableStream<T> extends ReadableStream<T> {

	/**
	 * Writing data to the stream will trigger the on('data')
	 * event listener if the stream is flowing and buffer the
	 * data otherwise until the stream is flowing.
	 *
	 * If a `highWaterMark` is configured and writing to the
	 * stream reaches this mark, a promise will be returned
	 * that should be awaited on before writing more data.
	 * Otherwise there is a risk of buffering a large number
	 * of data chunks without consumer.
	 */
	write(data: T): void | Promise<void>;

	/**
	 * Signals an error to the consumer of the stream via the
	 * on('error') handler if the stream is flowing.
	 *
	 * NOTE: call `end` to signal that the stream has ended,
	 * this DOES NOT happen automatically from `error`.
	 */
	error(error: Error): void;

	/**
	 * Signals the end of the stream to the consumer. If the
	 * result is provided, will trigger the on('data') event
	 * listener if the stream is flowing and buffer the data
	 * otherwise until the stream is flowing.
	 */
	end(result?: T): void;
}

/**
 * A stream that has a buffer already read. Returns the original stream
 * that was read as well as the chunks that got read.
 *
 * The `ended` flag indicates if the stream has been fully consumed.
 */
export interface ReadableBufferedStream<T> {

	/**
	 * The original stream that is being read.
	 */
	stream: ReadableStream<T>;

	/**
	 * An array of chunks already read from this stream.
	 */
	buffer: T[];

	/**
	 * Signals if the stream has ended or not. If not, consumers
	 * should continue to read from the stream until consumed.
	 */
	ended: boolean;
}

export function isReadableStream<T>(obj: unknown): obj is ReadableStream<T> {
	const candidate = obj as ReadableStream<T> | undefined;
	if (!candidate) {
		return false;
	}

	return [candidate.on, candidate.pause, candidate.resume, candidate.destroy].every(fn => typeof fn === 'function');
}

export function isReadableBufferedStream<T>(obj: unknown): obj is ReadableBufferedStream<T> {
	const candidate = obj as ReadableBufferedStream<T> | undefined;
	if (!candidate) {
		return false;
	}

	return isReadableStream(candidate.stream) && Array.isArray(candidate.buffer) && typeof candidate.ended === 'boolean';
}

export interface IReducer<T, R = T> {
	(data: T[]): R;
}

export interface IDataTransformer<Original, Transformed> {
	(data: Original): Transformed;
}

export interface IErrorTransformer {
	(error: Error): Error;
}

export interface ITransformer<Original, Transformed> {
	data: IDataTransformer<Original, Transformed>;
	error?: IErrorTransformer;
}

export function newWriteableStream<T>(reducer: IReducer<T> | null, options?: WriteableStreamOptions): WriteableStream<T> {
	return new WriteableStreamImpl<T>(reducer, options);
}

export interface WriteableStreamOptions {

	/**
	 * The number of objects to buffer before WriteableStream#write()
	 * signals back that the buffer is full. Can be used to reduce
	 * the memory pressure when the stream is not flowing.
	 */
	highWaterMark?: number;
}

class WriteableStreamImpl<T> implements WriteableStream<T> {

	private readonly state = {
		flowing: false,
		ended: false,
		destroyed: false
	};

	private readonly buffer = {
		data: [] as T[],
		error: [] as Error[]
	};

	private readonly listeners = {
		data: [] as { (data: T): void }[],
		error: [] as { (error: Error): void }[],
		end: [] as { (): void }[]
	};

	private readonly pendingWritePromises: Function[] = [];

	/**
	 * @param reducer a function that reduces the buffered data into a single object;
	 * 				  because some objects can be complex and non-reducible, we also
	 * 				  allow passing the explicit `null` value to skip the reduce step
	 * @param options stream options
	 */
	constructor(private reducer: IReducer<T> | null, private options?: WriteableStreamOptions) { }

	pause(): void {
		if (this.state.destroyed) {
			return;
		}

		this.state.flowing = false;
	}

	resume(): void {
		if (this.state.destroyed) {
			return;
		}

		if (!this.state.flowing) {
			this.state.flowing = true;

			// emit buffered events
			this.flowData();
			this.flowErrors();
			this.flowEnd();
		}
	}

	write(data: T): void | Promise<void> {
		if (this.state.destroyed) {
			return;
		}

		// flowing: directly send the data to listeners
		if (this.state.flowing) {
			this.emitData(data);
		}

		// not yet flowing: buffer data until flowing
		else {
			this.buffer.data.push(data);

			// highWaterMark: if configured, signal back when buffer reached limits
			if (typeof this.options?.highWaterMark === 'number' && this.buffer.data.length > this.options.highWaterMark) {
				return new Promise(resolve => this.pendingWritePromises.push(resolve));
			}
		}
	}

	error(error: Error): void {
		if (this.state.destroyed) {
			return;
		}

		// flowing: directly send the error to listeners
		if (this.state.flowing) {
			this.emitError(error);
		}

		// not yet flowing: buffer errors until flowing
		else {
			this.buffer.error.push(error);
		}
	}

	end(result?: T): void {
		if (this.state.destroyed) {
			return;
		}

		// end with data if provided
		if (typeof result !== 'undefined') {
			this.write(result);
		}

		// flowing: send end event to listeners
		if (this.state.flowing) {
			this.emitEnd();

			this.destroy();
		}

		// not yet flowing: remember state
		else {
			this.state.ended = true;
		}
	}

	private emitData(data: T): void {
		this.listeners.data.slice(0).forEach(listener => listener(data)); // slice to avoid listener mutation from delivering event
	}

	private emitError(error: Error): void {
		if (this.listeners.error.length === 0) {
			onUnexpectedError(error); // nobody listened to this error so we log it as unexpected
		} else {
			this.listeners.error.slice(0).forEach(listener => listener(error)); // slice to avoid listener mutation from delivering event
		}
	}

	private emitEnd(): void {
		this.listeners.end.slice(0).forEach(listener => listener()); // slice to avoid listener mutation from delivering event
	}

	on(event: 'data', callback: (data: T) => void): void;
	on(event: 'error', callback: (err: Error) => void): void;
	on(event: 'end', callback: () => void): void;
	on(event: 'data' | 'error' | 'end', callback: ((data: T) => void) | ((err: Error) => void) | (() => void)): void {
		if (this.state.destroyed) {
			return;
		}

		switch (event) {
			case 'data':
				this.listeners.data.push(callback as (data: T) => void);

				// switch into flowing mode as soon as the first 'data'
				// listener is added and we are not yet in flowing mode
				this.resume();

				break;

			case 'end':
				this.listeners.end.push(callback as () => void);

				// emit 'end' event directly if we are flowing
				// and the end has already been reached
				//
				// finish() when it went through
				if (this.state.flowing && this.flowEnd()) {
					this.destroy();
				}

				break;

			case 'error':
				this.listeners.error.push(callback as (err: Error) => void);

				// emit buffered 'error' events unless done already
				// now that we know that we have at least one listener
				if (this.state.flowing) {
					this.flowErrors();
				}

				break;
		}
	}

	removeListener(event: string, callback: Function): void {
		if (this.state.destroyed) {
			return;
		}

		let listeners: unknown[] | undefined = undefined;

		switch (event) {
			case 'data':
				listeners = this.listeners.data;
				break;

			case 'end':
				listeners = this.listeners.end;
				break;

			case 'error':
				listeners = this.listeners.error;
				break;
		}

		if (listeners) {
			const index = listeners.indexOf(callback);
			if (index >= 0) {
				listeners.splice(index, 1);
			}
		}
	}

	private flowData(): void {
		// if buffer is empty, nothing to do
		if (this.buffer.data.length === 0) {
			return;
		}

		// if buffer data can be reduced into a single object,
		// emit the reduced data
		if (typeof this.reducer === 'function') {
			const fullDataBuffer = this.reducer(this.buffer.data);

			this.emitData(fullDataBuffer);
		} else {
			// otherwise emit each buffered data instance individually
			for (const data of this.buffer.data) {
				this.emitData(data);
			}
		}

		this.buffer.data.length = 0;

		// when the buffer is empty, resolve all pending writers
		const pendingWritePromises = [...this.pendingWritePromises];
		this.pendingWritePromises.length = 0;
		pendingWritePromises.forEach(pendingWritePromise => pendingWritePromise());
	}

	private flowErrors(): void {
		if (this.listeners.error.length > 0) {
			for (const error of this.buffer.error) {
				this.emitError(error);
			}

			this.buffer.error.length = 0;
		}
	}

	private flowEnd(): boolean {
		if (this.state.ended) {
			this.emitEnd();

			return this.listeners.end.length > 0;
		}

		return false;
	}

	destroy(): void {
		if (!this.state.destroyed) {
			this.state.destroyed = true;
			this.state.ended = true;

			this.buffer.data.length = 0;
			this.buffer.error.length = 0;

			this.listeners.data.length = 0;
			this.listeners.error.length = 0;
			this.listeners.end.length = 0;

			this.pendingWritePromises.length = 0;
		}
	}
}

/**
 * Helper to fully read a T readable into a T.
 */
export function consumeReadable<T>(readable: Readable<T>, reducer: IReducer<T>): T {
	const chunks: T[] = [];

	let chunk: T | null;
	while ((chunk = readable.read()) !== null) {
		chunks.push(chunk);
	}

	return reducer(chunks);
}

/**
 * Helper to read a T readable up to a maximum of chunks. If the limit is
 * reached, will return a readable instead to ensure all data can still
 * be read.
 */
export function peekReadable<T>(readable: Readable<T>, reducer: IReducer<T>, maxChunks: number): T | Readable<T> {
	const chunks: T[] = [];

	let chunk: T | null | undefined = undefined;
	while ((chunk = readable.read()) !== null && chunks.length < maxChunks) {
		chunks.push(chunk);
	}

	// If the last chunk is null, it means we reached the end of
	// the readable and return all the data at once
	if (chunk === null && chunks.length > 0) {
		return reducer(chunks);
	}

	// Otherwise, we still have a chunk, it means we reached the maxChunks
	// value and as such we return a new Readable that first returns
	// the existing read chunks and then continues with reading from
	// the underlying readable.
	return {
		read: () => {

			// First consume chunks from our array
			if (chunks.length > 0) {
				return chunks.shift()!;
			}

			// Then ensure to return our last read chunk
			if (typeof chunk !== 'undefined') {
				const lastReadChunk = chunk;

				// explicitly use undefined here to indicate that we consumed
				// the chunk, which could have either been null or valued.
				chunk = undefined;

				return lastReadChunk;
			}

			// Finally delegate back to the Readable
			return readable.read();
		}
	};
}

/**
 * Helper to fully read a T stream into a T or consuming
 * a stream fully, awaiting all the events without caring
 * about the data.
 */
export function consumeStream<T, R = T>(stream: ReadableStreamEvents<T>, reducer: IReducer<T, R>): Promise<R>;
export function consumeStream(stream: ReadableStreamEvents<unknown>): Promise<undefined>;
export function consumeStream<T, R = T>(stream: ReadableStreamEvents<T>, reducer?: IReducer<T, R>): Promise<R | undefined> {
	return new Promise((resolve, reject) => {
		const chunks: T[] = [];

		listenStream(stream, {
			onData: chunk => {
				if (reducer) {
					chunks.push(chunk);
				}
			},
			onError: error => {
				if (reducer) {
					reject(error);
				} else {
					resolve(undefined);
				}
			},
			onEnd: () => {
				if (reducer) {
					resolve(reducer(chunks));
				} else {
					resolve(undefined);
				}
			}
		});
	});
}

export interface IStreamListener<T> {

	/**
	 * The 'data' event is emitted whenever the stream is
	 * relinquishing ownership of a chunk of data to a consumer.
	 */
	onData(data: T): void;

	/**
	 * Emitted when any error occurs.
	 */
	onError(err: Error): void;

	/**
	 * The 'end' event is emitted when there is no more data
	 * to be consumed from the stream. The 'end' event will
	 * not be emitted unless the data is completely consumed.
	 */
	onEnd(): void;
}

/**
 * Helper to listen to all events of a T stream in proper order.
 */
export function listenStream<T>(stream: ReadableStreamEvents<T>, listener: IStreamListener<T>, token?: CancellationToken): void {

	stream.on('error', error => {
		if (!token?.isCancellationRequested) {
			listener.onError(error);
		}
	});

	stream.on('end', () => {
		if (!token?.isCancellationRequested) {
			listener.onEnd();
		}
	});

	// Adding the `data` listener will turn the stream
	// into flowing mode. As such it is important to
	// add this listener last (DO NOT CHANGE!)
	stream.on('data', data => {
		if (!token?.isCancellationRequested) {
			listener.onData(data);
		}
	});
}

/**
 * Helper to peek up to `maxChunks` into a stream. The return type signals if
 * the stream has ended or not. If not, caller needs to add a `data` listener
 * to continue reading.
 */
export function peekStream<T>(stream: ReadableStream<T>, maxChunks: number): Promise<ReadableBufferedStream<T>> {
	return new Promise((resolve, reject) => {
		const streamListeners = new DisposableStore();
		const buffer: T[] = [];

		// Data Listener
		const dataListener = (chunk: T) => {

			// Add to buffer
			buffer.push(chunk);

			// We reached maxChunks and thus need to return
			if (buffer.length > maxChunks) {

				// Dispose any listeners and ensure to pause the
				// stream so that it can be consumed again by caller
				streamListeners.dispose();
				stream.pause();

				return resolve({ stream, buffer, ended: false });
			}
		};

		// Error Listener
		const errorListener = (error: Error) => {
			streamListeners.dispose();

			return reject(error);
		};

		// End Listener
		const endListener = () => {
			streamListeners.dispose();

			return resolve({ stream, buffer, ended: true });
		};

		streamListeners.add(toDisposable(() => stream.removeListener('error', errorListener)));
		stream.on('error', errorListener);

		streamListeners.add(toDisposable(() => stream.removeListener('end', endListener)));
		stream.on('end', endListener);

		// Important: leave the `data` listener last because
		// this can turn the stream into flowing mode and we
		// want `error` events to be received as well.
		streamListeners.add(toDisposable(() => stream.removeListener('data', dataListener)));
		stream.on('data', dataListener);
	});
}

/**
 * Helper to create a readable stream from an existing T.
 */
export function toStream<T>(t: T, reducer: IReducer<T>): ReadableStream<T> {
	const stream = newWriteableStream<T>(reducer);

	stream.end(t);

	return stream;
}

/**
 * Helper to create an empty stream
 */
export function emptyStream(): ReadableStream<never> {
	const stream = newWriteableStream<never>(() => { throw new Error('not supported'); });
	stream.end();

	return stream;
}

/**
 * Helper to convert a T into a Readable<T>.
 */
export function toReadable<T>(t: T): Readable<T> {
	let consumed = false;

	return {
		read: () => {
			if (consumed) {
				return null;
			}

			consumed = true;

			return t;
		}
	};
}

/**
 * Helper to transform a readable stream into another stream.
 */
export function transform<Original, Transformed>(stream: ReadableStreamEvents<Original>, transformer: ITransformer<Original, Transformed>, reducer: IReducer<Transformed>): ReadableStream<Transformed> {
	const target = newWriteableStream<Transformed>(reducer);

	listenStream(stream, {
		onData: data => target.write(transformer.data(data)),
		onError: error => target.error(transformer.error ? transformer.error(error) : error),
		onEnd: () => target.end()
	});

	return target;
}

/**
 * Helper to take an existing readable that will
 * have a prefix injected to the beginning.
 */
export function prefixedReadable<T>(prefix: T, readable: Readable<T>, reducer: IReducer<T>): Readable<T> {
	let prefixHandled = false;

	return {
		read: () => {
			const chunk = readable.read();

			// Handle prefix only once
			if (!prefixHandled) {
				prefixHandled = true;

				// If we have also a read-result, make
				// sure to reduce it to a single result
				if (chunk !== null) {
					return reducer([prefix, chunk]);
				}

				// Otherwise, just return prefix directly
				return prefix;
			}

			return chunk;
		}
	};
}

/**
 * Helper to take an existing stream that will
 * have a prefix injected to the beginning.
 */
export function prefixedStream<T>(prefix: T, stream: ReadableStream<T>, reducer: IReducer<T>): ReadableStream<T> {
	let prefixHandled = false;

	const target = newWriteableStream<T>(reducer);

	listenStream(stream, {
		onData: data => {

			// Handle prefix only once
			if (!prefixHandled) {
				prefixHandled = true;

				return target.write(reducer([prefix, data]));
			}

			return target.write(data);
		},
		onError: error => target.error(error),
		onEnd: () => {

			// Handle prefix only once
			if (!prefixHandled) {
				prefixHandled = true;

				target.write(prefix);
			}

			target.end();
		}
	});

	return target;
}
```

--------------------------------------------------------------------------------

````
