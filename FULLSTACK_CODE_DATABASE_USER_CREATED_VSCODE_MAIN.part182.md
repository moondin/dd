---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 182
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 182 of 552)

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

---[FILE: src/vs/base/parts/ipc/node/ipc.net.ts]---
Location: vscode-main/src/vs/base/parts/ipc/node/ipc.net.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createHash } from 'crypto';
import type * as http from 'http';
import { Server as NetServer, Socket, createConnection, createServer } from 'net';
import { tmpdir } from 'os';
import { DeflateRaw, InflateRaw, ZlibOptions, createDeflateRaw, createInflateRaw } from 'zlib';
import { VSBuffer } from '../../../common/buffer.js';
import { onUnexpectedError } from '../../../common/errors.js';
import { Emitter, Event } from '../../../common/event.js';
import { Disposable, IDisposable } from '../../../common/lifecycle.js';
import { join } from '../../../common/path.js';
import { Platform, platform } from '../../../common/platform.js';
import { generateUuid } from '../../../common/uuid.js';
import { ClientConnectionEvent, IPCServer } from '../common/ipc.js';
import { ChunkStream, Client, ISocket, Protocol, SocketCloseEvent, SocketCloseEventType, SocketDiagnostics, SocketDiagnosticsEventType } from '../common/ipc.net.js';

export function upgradeToISocket(req: http.IncomingMessage, socket: Socket, {
	debugLabel,
	skipWebSocketFrames = false,
	disableWebSocketCompression = false,
	enableMessageSplitting = true,
}: {
	debugLabel: string;
	skipWebSocketFrames?: boolean;
	disableWebSocketCompression?: boolean;
	enableMessageSplitting?: boolean;
}): NodeSocket | WebSocketNodeSocket | undefined {
	if (req.headers.upgrade === undefined || req.headers.upgrade.toLowerCase() !== 'websocket') {
		socket.end('HTTP/1.1 400 Bad Request');
		return;
	}

	// https://tools.ietf.org/html/rfc6455#section-4
	const requestNonce = req.headers['sec-websocket-key'];
	const hash = createHash('sha1');// CodeQL [SM04514] SHA1 must be used here to respect the WebSocket protocol specification
	hash.update(requestNonce + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
	const responseNonce = hash.digest('base64');

	const responseHeaders = [
		`HTTP/1.1 101 Switching Protocols`,
		`Upgrade: websocket`,
		`Connection: Upgrade`,
		`Sec-WebSocket-Accept: ${responseNonce}`
	];

	// See https://tools.ietf.org/html/rfc7692#page-12
	let permessageDeflate = false;
	if (!skipWebSocketFrames && !disableWebSocketCompression && req.headers['sec-websocket-extensions']) {
		const websocketExtensionOptions = Array.isArray(req.headers['sec-websocket-extensions']) ? req.headers['sec-websocket-extensions'] : [req.headers['sec-websocket-extensions']];
		for (const websocketExtensionOption of websocketExtensionOptions) {
			if (/\b((server_max_window_bits)|(server_no_context_takeover)|(client_no_context_takeover))\b/.test(websocketExtensionOption)) {
				// sorry, the server does not support zlib parameter tweaks
				continue;
			}
			if (/\b(permessage-deflate)\b/.test(websocketExtensionOption)) {
				permessageDeflate = true;
				responseHeaders.push(`Sec-WebSocket-Extensions: permessage-deflate`);
				break;
			}
			if (/\b(x-webkit-deflate-frame)\b/.test(websocketExtensionOption)) {
				permessageDeflate = true;
				responseHeaders.push(`Sec-WebSocket-Extensions: x-webkit-deflate-frame`);
				break;
			}
		}
	}

	socket.write(responseHeaders.join('\r\n') + '\r\n\r\n');

	// Never timeout this socket due to inactivity!
	socket.setTimeout(0);
	// Disable Nagle's algorithm
	socket.setNoDelay(true);
	// Finally!

	if (skipWebSocketFrames) {
		return new NodeSocket(socket, debugLabel);
	} else {
		return new WebSocketNodeSocket(new NodeSocket(socket, debugLabel), permessageDeflate, null, true, enableMessageSplitting);
	}
}

/**
 * Maximum time to wait for a 'close' event to fire after the socket stream
 * ends. For unix domain sockets, the close event may not fire consistently
 * due to what appears to be a Node.js bug.
 *
 * @see https://github.com/microsoft/vscode/issues/211462#issuecomment-2155471996
 */
const socketEndTimeoutMs = 30_000;

export class NodeSocket implements ISocket {

	public readonly debugLabel: string;
	public readonly socket: Socket;
	private readonly _errorListener: (err: NodeJS.ErrnoException) => void;
	private readonly _closeListener: (hadError: boolean) => void;
	private readonly _endListener: () => void;
	private _canWrite = true;

	public traceSocketEvent(type: SocketDiagnosticsEventType, data?: VSBuffer | Uint8Array | ArrayBuffer | ArrayBufferView | unknown): void {
		SocketDiagnostics.traceSocketEvent(this.socket, this.debugLabel, type, data);
	}

	constructor(socket: Socket, debugLabel = '') {
		this.debugLabel = debugLabel;
		this.socket = socket;
		this.traceSocketEvent(SocketDiagnosticsEventType.Created, { type: 'NodeSocket' });
		this._errorListener = (err: NodeJS.ErrnoException) => {
			this.traceSocketEvent(SocketDiagnosticsEventType.Error, { code: err?.code, message: err?.message });
			if (err) {
				if (err.code === 'EPIPE') {
					// An EPIPE exception at the wrong time can lead to a renderer process crash
					// so ignore the error since the socket will fire the close event soon anyways:
					// > https://nodejs.org/api/errors.html#errors_common_system_errors
					// > EPIPE (Broken pipe): A write on a pipe, socket, or FIFO for which there is no
					// > process to read the data. Commonly encountered at the net and http layers,
					// > indicative that the remote side of the stream being written to has been closed.
					return;
				}
				onUnexpectedError(err);
			}
		};
		this.socket.on('error', this._errorListener);

		let endTimeoutHandle: Timeout | undefined;
		this._closeListener = (hadError: boolean) => {
			this.traceSocketEvent(SocketDiagnosticsEventType.Close, { hadError });
			this._canWrite = false;
			if (endTimeoutHandle) {
				clearTimeout(endTimeoutHandle);
			}
		};
		this.socket.on('close', this._closeListener);

		this._endListener = () => {
			this.traceSocketEvent(SocketDiagnosticsEventType.NodeEndReceived);
			this._canWrite = false;
			endTimeoutHandle = setTimeout(() => socket.destroy(), socketEndTimeoutMs);
		};
		this.socket.on('end', this._endListener);
	}

	public dispose(): void {
		this.socket.off('error', this._errorListener);
		this.socket.off('close', this._closeListener);
		this.socket.off('end', this._endListener);
		this.socket.destroy();
	}

	public onData(_listener: (e: VSBuffer) => void): IDisposable {
		const listener = (buff: Buffer) => {
			this.traceSocketEvent(SocketDiagnosticsEventType.Read, buff);
			_listener(VSBuffer.wrap(buff));
		};
		this.socket.on('data', listener);
		return {
			dispose: () => this.socket.off('data', listener)
		};
	}

	public onClose(listener: (e: SocketCloseEvent) => void): IDisposable {
		const adapter = (hadError: boolean) => {
			listener({
				type: SocketCloseEventType.NodeSocketCloseEvent,
				hadError: hadError,
				error: undefined
			});
		};
		this.socket.on('close', adapter);
		return {
			dispose: () => this.socket.off('close', adapter)
		};
	}

	public onEnd(listener: () => void): IDisposable {
		const adapter = () => {
			listener();
		};
		this.socket.on('end', adapter);
		return {
			dispose: () => this.socket.off('end', adapter)
		};
	}

	public write(buffer: VSBuffer): void {
		// return early if socket has been destroyed in the meantime
		if (this.socket.destroyed || !this._canWrite) {
			return;
		}

		// we ignore the returned value from `write` because we would have to cached the data
		// anyways and nodejs is already doing that for us:
		// > https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback
		// > However, the false return value is only advisory and the writable stream will unconditionally
		// > accept and buffer chunk even if it has not been allowed to drain.
		try {
			this.traceSocketEvent(SocketDiagnosticsEventType.Write, buffer);
			this.socket.write(buffer.buffer, (err: NodeJS.ErrnoException | null | undefined) => {
				if (err) {
					if (err.code === 'EPIPE') {
						// An EPIPE exception at the wrong time can lead to a renderer process crash
						// so ignore the error since the socket will fire the close event soon anyways:
						// > https://nodejs.org/api/errors.html#errors_common_system_errors
						// > EPIPE (Broken pipe): A write on a pipe, socket, or FIFO for which there is no
						// > process to read the data. Commonly encountered at the net and http layers,
						// > indicative that the remote side of the stream being written to has been closed.
						return;
					}
					onUnexpectedError(err);
				}
			});
		} catch (err) {
			if (err.code === 'EPIPE') {
				// An EPIPE exception at the wrong time can lead to a renderer process crash
				// so ignore the error since the socket will fire the close event soon anyways:
				// > https://nodejs.org/api/errors.html#errors_common_system_errors
				// > EPIPE (Broken pipe): A write on a pipe, socket, or FIFO for which there is no
				// > process to read the data. Commonly encountered at the net and http layers,
				// > indicative that the remote side of the stream being written to has been closed.
				return;
			}
			onUnexpectedError(err);
		}
	}

	public end(): void {
		this.traceSocketEvent(SocketDiagnosticsEventType.NodeEndSent);
		this.socket.end();
	}

	public drain(): Promise<void> {
		this.traceSocketEvent(SocketDiagnosticsEventType.NodeDrainBegin);
		return new Promise<void>((resolve, reject) => {
			if (this.socket.bufferSize === 0) {
				this.traceSocketEvent(SocketDiagnosticsEventType.NodeDrainEnd);
				resolve();
				return;
			}
			const finished = () => {
				this.socket.off('close', finished);
				this.socket.off('end', finished);
				this.socket.off('error', finished);
				this.socket.off('timeout', finished);
				this.socket.off('drain', finished);
				this.traceSocketEvent(SocketDiagnosticsEventType.NodeDrainEnd);
				resolve();
			};
			this.socket.on('close', finished);
			this.socket.on('end', finished);
			this.socket.on('error', finished);
			this.socket.on('timeout', finished);
			this.socket.on('drain', finished);
		});
	}
}

const enum Constants {
	MinHeaderByteSize = 2,
	/**
	 * If we need to write a large buffer, we will split it into 256KB chunks and
	 * send each chunk as a websocket message. This is to prevent that the sending
	 * side is stuck waiting for the entire buffer to be compressed before writing
	 * to the underlying socket or that the receiving side is stuck waiting for the
	 * entire message to be received before processing the bytes.
	 */
	MaxWebSocketMessageLength = 256 * 1024 // 256 KB
}

const enum ReadState {
	PeekHeader = 1,
	ReadHeader = 2,
	ReadBody = 3,
	Fin = 4
}

interface ISocketTracer {
	traceSocketEvent(type: SocketDiagnosticsEventType, data?: VSBuffer | Uint8Array | ArrayBuffer | ArrayBufferView | unknown): void;
}

interface FrameOptions {
	compressed: boolean;
	opcode: number;
}

/**
 * See https://tools.ietf.org/html/rfc6455#section-5.2
 */
export class WebSocketNodeSocket extends Disposable implements ISocket, ISocketTracer {

	public readonly socket: NodeSocket;
	private readonly _flowManager: WebSocketFlowManager;
	private readonly _incomingData: ChunkStream;
	private readonly _onData = this._register(new Emitter<VSBuffer>());
	private readonly _onClose = this._register(new Emitter<SocketCloseEvent>());
	private readonly _maxSocketMessageLength: number;
	private _isEnded = false;

	private readonly _state = {
		state: ReadState.PeekHeader,
		readLen: Constants.MinHeaderByteSize,
		fin: 0,
		compressed: false,
		firstFrameOfMessage: true,
		mask: 0,
		opcode: 0
	};

	public get permessageDeflate(): boolean {
		return this._flowManager.permessageDeflate;
	}

	public get recordedInflateBytes(): VSBuffer {
		return this._flowManager.recordedInflateBytes;
	}

	public traceSocketEvent(type: SocketDiagnosticsEventType, data?: VSBuffer | Uint8Array | ArrayBuffer | ArrayBufferView | unknown): void {
		this.socket.traceSocketEvent(type, data);
	}

	/**
	 * Create a socket which can communicate using WebSocket frames.
	 *
	 * **NOTE**: When using the permessage-deflate WebSocket extension, if parts of inflating was done
	 *  in a different zlib instance, we need to pass all those bytes into zlib, otherwise the inflate
	 *  might hit an inflated portion referencing a distance too far back.
	 *
	 * @param socket The underlying socket
	 * @param permessageDeflate Use the permessage-deflate WebSocket extension
	 * @param inflateBytes "Seed" zlib inflate with these bytes.
	 * @param recordInflateBytes Record all bytes sent to inflate
	 */
	constructor(socket: NodeSocket, permessageDeflate: boolean, inflateBytes: VSBuffer | null, recordInflateBytes: boolean, enableMessageSplitting = true) {
		super();
		this.socket = socket;
		this._maxSocketMessageLength = enableMessageSplitting ? Constants.MaxWebSocketMessageLength : Infinity;
		this.traceSocketEvent(SocketDiagnosticsEventType.Created, { type: 'WebSocketNodeSocket', permessageDeflate, inflateBytesLength: inflateBytes?.byteLength || 0, recordInflateBytes });
		this._flowManager = this._register(new WebSocketFlowManager(
			this,
			permessageDeflate,
			inflateBytes,
			recordInflateBytes,
			this._onData,
			(data, options) => this._write(data, options)
		));
		this._register(this._flowManager.onError((err) => {
			// zlib errors are fatal, since we have no idea how to recover
			console.error(err);
			onUnexpectedError(err);
			this._onClose.fire({
				type: SocketCloseEventType.NodeSocketCloseEvent,
				hadError: true,
				error: err
			});
		}));
		this._incomingData = new ChunkStream();
		this._register(this.socket.onData(data => this._acceptChunk(data)));
		this._register(this.socket.onClose(async (e) => {
			// Delay surfacing the close event until the async inflating is done
			// and all data has been emitted
			if (this._flowManager.isProcessingReadQueue()) {
				await Event.toPromise(this._flowManager.onDidFinishProcessingReadQueue);
			}
			this._onClose.fire(e);
		}));
	}

	public override dispose(): void {
		if (this._flowManager.isProcessingWriteQueue()) {
			// Wait for any outstanding writes to finish before disposing
			this._register(this._flowManager.onDidFinishProcessingWriteQueue(() => {
				this.dispose();
			}));
		} else {
			this.socket.dispose();
			super.dispose();
		}
	}

	public onData(listener: (e: VSBuffer) => void): IDisposable {
		return this._onData.event(listener);
	}

	public onClose(listener: (e: SocketCloseEvent) => void): IDisposable {
		return this._onClose.event(listener);
	}

	public onEnd(listener: () => void): IDisposable {
		return this.socket.onEnd(listener);
	}

	public write(buffer: VSBuffer): void {
		// If we write many logical messages (let's say 1000 messages of 100KB) during a single process tick, we do
		// this thing where we install a process.nextTick timer and group all of them together and we then issue a
		// single WebSocketNodeSocket.write with a 100MB buffer.
		//
		// The first problem is that the actual writing to the underlying node socket will only happen after all of
		// the 100MB have been deflated (due to waiting on zlib flush). The second problem is on the reading side,
		// where we will get a single WebSocketNodeSocket.onData event fired when all the 100MB have arrived,
		// delaying processing the 1000 received messages until all have arrived, instead of processing them as each
		// one arrives.
		//
		// We therefore split the buffer into chunks, and issue a write for each chunk.

		let start = 0;
		while (start < buffer.byteLength) {
			this._flowManager.writeMessage(buffer.slice(start, Math.min(start + this._maxSocketMessageLength, buffer.byteLength)), { compressed: true, opcode: 0x02 /* Binary frame */ });
			start += this._maxSocketMessageLength;
		}
	}

	private _write(buffer: VSBuffer, { compressed, opcode }: FrameOptions): void {
		if (this._isEnded) {
			// Avoid ERR_STREAM_WRITE_AFTER_END
			return;
		}

		this.traceSocketEvent(SocketDiagnosticsEventType.WebSocketNodeSocketWrite, buffer);
		let headerLen = Constants.MinHeaderByteSize;
		if (buffer.byteLength < 126) {
			headerLen += 0;
		} else if (buffer.byteLength < 2 ** 16) {
			headerLen += 2;
		} else {
			headerLen += 8;
		}
		const header = VSBuffer.alloc(headerLen);

		// The RSV1 bit indicates a compressed frame
		const compressedFlag = compressed ? 0b01000000 : 0;
		const opcodeFlag = opcode & 0b00001111;
		header.writeUInt8(0b10000000 | compressedFlag | opcodeFlag, 0);
		if (buffer.byteLength < 126) {
			header.writeUInt8(buffer.byteLength, 1);
		} else if (buffer.byteLength < 2 ** 16) {
			header.writeUInt8(126, 1);
			let offset = 1;
			header.writeUInt8((buffer.byteLength >>> 8) & 0b11111111, ++offset);
			header.writeUInt8((buffer.byteLength >>> 0) & 0b11111111, ++offset);
		} else {
			header.writeUInt8(127, 1);
			let offset = 1;
			header.writeUInt8(0, ++offset);
			header.writeUInt8(0, ++offset);
			header.writeUInt8(0, ++offset);
			header.writeUInt8(0, ++offset);
			header.writeUInt8((buffer.byteLength >>> 24) & 0b11111111, ++offset);
			header.writeUInt8((buffer.byteLength >>> 16) & 0b11111111, ++offset);
			header.writeUInt8((buffer.byteLength >>> 8) & 0b11111111, ++offset);
			header.writeUInt8((buffer.byteLength >>> 0) & 0b11111111, ++offset);
		}

		this.socket.write(VSBuffer.concat([header, buffer]));
	}

	public end(): void {
		this._isEnded = true;
		this.socket.end();
	}

	private _acceptChunk(data: VSBuffer): void {
		if (data.byteLength === 0) {
			return;
		}

		this._incomingData.acceptChunk(data);

		while (this._incomingData.byteLength >= this._state.readLen) {

			if (this._state.state === ReadState.PeekHeader) {
				// peek to see if we can read the entire header
				const peekHeader = this._incomingData.peek(this._state.readLen);
				const firstByte = peekHeader.readUInt8(0);
				const finBit = (firstByte & 0b10000000) >>> 7;
				const rsv1Bit = (firstByte & 0b01000000) >>> 6;
				const opcode = (firstByte & 0b00001111);

				const secondByte = peekHeader.readUInt8(1);
				const hasMask = (secondByte & 0b10000000) >>> 7;
				const len = (secondByte & 0b01111111);

				this._state.state = ReadState.ReadHeader;
				this._state.readLen = Constants.MinHeaderByteSize + (hasMask ? 4 : 0) + (len === 126 ? 2 : 0) + (len === 127 ? 8 : 0);
				this._state.fin = finBit;
				if (this._state.firstFrameOfMessage) {
					// if the frame is compressed, the RSV1 bit is set only for the first frame of the message
					this._state.compressed = Boolean(rsv1Bit);
				}
				this._state.firstFrameOfMessage = Boolean(finBit);
				this._state.mask = 0;
				this._state.opcode = opcode;

				this.traceSocketEvent(SocketDiagnosticsEventType.WebSocketNodeSocketPeekedHeader, { headerSize: this._state.readLen, compressed: this._state.compressed, fin: this._state.fin, opcode: this._state.opcode });

			} else if (this._state.state === ReadState.ReadHeader) {
				// read entire header
				const header = this._incomingData.read(this._state.readLen);
				const secondByte = header.readUInt8(1);
				const hasMask = (secondByte & 0b10000000) >>> 7;
				let len = (secondByte & 0b01111111);

				let offset = 1;
				if (len === 126) {
					len = (
						header.readUInt8(++offset) * 2 ** 8
						+ header.readUInt8(++offset)
					);
				} else if (len === 127) {
					len = (
						header.readUInt8(++offset) * 0
						+ header.readUInt8(++offset) * 0
						+ header.readUInt8(++offset) * 0
						+ header.readUInt8(++offset) * 0
						+ header.readUInt8(++offset) * 2 ** 24
						+ header.readUInt8(++offset) * 2 ** 16
						+ header.readUInt8(++offset) * 2 ** 8
						+ header.readUInt8(++offset)
					);
				}

				let mask = 0;
				if (hasMask) {
					mask = (
						header.readUInt8(++offset) * 2 ** 24
						+ header.readUInt8(++offset) * 2 ** 16
						+ header.readUInt8(++offset) * 2 ** 8
						+ header.readUInt8(++offset)
					);
				}

				this._state.state = ReadState.ReadBody;
				this._state.readLen = len;
				this._state.mask = mask;

				this.traceSocketEvent(SocketDiagnosticsEventType.WebSocketNodeSocketPeekedHeader, { bodySize: this._state.readLen, compressed: this._state.compressed, fin: this._state.fin, mask: this._state.mask, opcode: this._state.opcode });

			} else if (this._state.state === ReadState.ReadBody) {
				// read body

				const body = this._incomingData.read(this._state.readLen);
				this.traceSocketEvent(SocketDiagnosticsEventType.WebSocketNodeSocketReadData, body);

				unmask(body, this._state.mask);
				this.traceSocketEvent(SocketDiagnosticsEventType.WebSocketNodeSocketUnmaskedData, body);

				this._state.state = ReadState.PeekHeader;
				this._state.readLen = Constants.MinHeaderByteSize;
				this._state.mask = 0;

				if (this._state.opcode <= 0x02 /* Continuation frame or Text frame or binary frame */) {
					this._flowManager.acceptFrame(body, this._state.compressed, !!this._state.fin);
				} else if (this._state.opcode === 0x09 /* Ping frame */) {
					// Ping frames could be send by some browsers e.g. Firefox
					this._flowManager.writeMessage(body, { compressed: false, opcode: 0x0A /* Pong frame */ });
				}
			}
		}
	}

	public async drain(): Promise<void> {
		this.traceSocketEvent(SocketDiagnosticsEventType.WebSocketNodeSocketDrainBegin);
		if (this._flowManager.isProcessingWriteQueue()) {
			await Event.toPromise(this._flowManager.onDidFinishProcessingWriteQueue);
		}
		await this.socket.drain();
		this.traceSocketEvent(SocketDiagnosticsEventType.WebSocketNodeSocketDrainEnd);
	}
}

class WebSocketFlowManager extends Disposable {

	private readonly _onError = this._register(new Emitter<Error>());
	public readonly onError = this._onError.event;

	private readonly _zlibInflateStream: ZlibInflateStream | null;
	private readonly _zlibDeflateStream: ZlibDeflateStream | null;
	private readonly _writeQueue: { data: VSBuffer; options: FrameOptions }[] = [];
	private readonly _readQueue: { data: VSBuffer; isCompressed: boolean; isLastFrameOfMessage: boolean }[] = [];

	private readonly _onDidFinishProcessingReadQueue = this._register(new Emitter<void>());
	public readonly onDidFinishProcessingReadQueue = this._onDidFinishProcessingReadQueue.event;

	private readonly _onDidFinishProcessingWriteQueue = this._register(new Emitter<void>());
	public readonly onDidFinishProcessingWriteQueue = this._onDidFinishProcessingWriteQueue.event;

	public get permessageDeflate(): boolean {
		return Boolean(this._zlibInflateStream && this._zlibDeflateStream);
	}

	public get recordedInflateBytes(): VSBuffer {
		if (this._zlibInflateStream) {
			return this._zlibInflateStream.recordedInflateBytes;
		}
		return VSBuffer.alloc(0);
	}

	constructor(
		private readonly _tracer: ISocketTracer,
		permessageDeflate: boolean,
		inflateBytes: VSBuffer | null,
		recordInflateBytes: boolean,
		private readonly _onData: Emitter<VSBuffer>,
		private readonly _writeFn: (data: VSBuffer, options: FrameOptions) => void
	) {
		super();
		if (permessageDeflate) {
			// See https://tools.ietf.org/html/rfc7692#page-16
			// To simplify our logic, we don't negotiate the window size
			// and simply dedicate (2^15) / 32kb per web socket
			this._zlibInflateStream = this._register(new ZlibInflateStream(this._tracer, recordInflateBytes, inflateBytes, { windowBits: 15 }));
			this._zlibDeflateStream = this._register(new ZlibDeflateStream(this._tracer, { windowBits: 15 }));
			this._register(this._zlibInflateStream.onError((err) => this._onError.fire(err)));
			this._register(this._zlibDeflateStream.onError((err) => this._onError.fire(err)));
		} else {
			this._zlibInflateStream = null;
			this._zlibDeflateStream = null;
		}
	}

	public writeMessage(data: VSBuffer, options: FrameOptions): void {
		this._writeQueue.push({ data, options });
		this._processWriteQueue();
	}

	private _isProcessingWriteQueue = false;
	private async _processWriteQueue(): Promise<void> {
		if (this._isProcessingWriteQueue) {
			return;
		}
		this._isProcessingWriteQueue = true;
		while (this._writeQueue.length > 0) {
			const { data, options } = this._writeQueue.shift()!;
			if (this._zlibDeflateStream && options.compressed) {
				const compressedData = await this._deflateMessage(this._zlibDeflateStream, data);
				this._writeFn(compressedData, options);
			} else {
				this._writeFn(data, { ...options, compressed: false });
			}
		}
		this._isProcessingWriteQueue = false;
		this._onDidFinishProcessingWriteQueue.fire();
	}

	public isProcessingWriteQueue(): boolean {
		return (this._isProcessingWriteQueue);
	}

	/**
	 * Subsequent calls should wait for the previous `_deflateBuffer` call to complete.
	 */
	private _deflateMessage(zlibDeflateStream: ZlibDeflateStream, buffer: VSBuffer): Promise<VSBuffer> {
		return new Promise<VSBuffer>((resolve, reject) => {
			zlibDeflateStream.write(buffer);
			zlibDeflateStream.flush(data => resolve(data));
		});
	}

	public acceptFrame(data: VSBuffer, isCompressed: boolean, isLastFrameOfMessage: boolean): void {
		this._readQueue.push({ data, isCompressed, isLastFrameOfMessage });
		this._processReadQueue();
	}

	private _isProcessingReadQueue = false;
	private async _processReadQueue(): Promise<void> {
		if (this._isProcessingReadQueue) {
			return;
		}
		this._isProcessingReadQueue = true;
		while (this._readQueue.length > 0) {
			const frameInfo = this._readQueue.shift()!;
			if (this._zlibInflateStream && frameInfo.isCompressed) {
				// See https://datatracker.ietf.org/doc/html/rfc7692#section-9.2
				// Even if permessageDeflate is negotiated, it is possible
				// that the other side might decide to send uncompressed messages
				// So only decompress messages that have the RSV 1 bit set
				const data = await this._inflateFrame(this._zlibInflateStream, frameInfo.data, frameInfo.isLastFrameOfMessage);
				this._onData.fire(data);
			} else {
				this._onData.fire(frameInfo.data);
			}
		}
		this._isProcessingReadQueue = false;
		this._onDidFinishProcessingReadQueue.fire();
	}

	public isProcessingReadQueue(): boolean {
		return (this._isProcessingReadQueue);
	}

	/**
	 * Subsequent calls should wait for the previous `transformRead` call to complete.
	 */
	private _inflateFrame(zlibInflateStream: ZlibInflateStream, buffer: VSBuffer, isLastFrameOfMessage: boolean): Promise<VSBuffer> {
		return new Promise<VSBuffer>((resolve, reject) => {
			// See https://tools.ietf.org/html/rfc7692#section-7.2.2
			zlibInflateStream.write(buffer);
			if (isLastFrameOfMessage) {
				zlibInflateStream.write(VSBuffer.fromByteArray([0x00, 0x00, 0xff, 0xff]));
			}
			zlibInflateStream.flush(data => resolve(data));
		});
	}
}

class ZlibInflateStream extends Disposable {

	private readonly _onError = this._register(new Emitter<Error>());
	public readonly onError = this._onError.event;

	private readonly _zlibInflate: InflateRaw;
	private readonly _recordedInflateBytes: VSBuffer[] = [];
	private readonly _pendingInflateData: VSBuffer[] = [];

	public get recordedInflateBytes(): VSBuffer {
		if (this._recordInflateBytes) {
			return VSBuffer.concat(this._recordedInflateBytes);
		}
		return VSBuffer.alloc(0);
	}

	constructor(
		private readonly _tracer: ISocketTracer,
		private readonly _recordInflateBytes: boolean,
		inflateBytes: VSBuffer | null,
		options: ZlibOptions
	) {
		super();
		this._zlibInflate = createInflateRaw(options);
		this._zlibInflate.on('error', (err: Error) => {
			this._tracer.traceSocketEvent(SocketDiagnosticsEventType.zlibInflateError, { message: err?.message, code: (err as NodeJS.ErrnoException)?.code });
			this._onError.fire(err);
		});
		this._zlibInflate.on('data', (data: Buffer) => {
			this._tracer.traceSocketEvent(SocketDiagnosticsEventType.zlibInflateData, data);
			this._pendingInflateData.push(VSBuffer.wrap(data));
		});
		if (inflateBytes) {
			this._tracer.traceSocketEvent(SocketDiagnosticsEventType.zlibInflateInitialWrite, inflateBytes.buffer);
			this._zlibInflate.write(inflateBytes.buffer);
			this._zlibInflate.flush(() => {
				this._tracer.traceSocketEvent(SocketDiagnosticsEventType.zlibInflateInitialFlushFired);
				this._pendingInflateData.length = 0;
			});
		}
	}

	public write(buffer: VSBuffer): void {
		if (this._recordInflateBytes) {
			this._recordedInflateBytes.push(buffer.clone());
		}
		this._tracer.traceSocketEvent(SocketDiagnosticsEventType.zlibInflateWrite, buffer);
		this._zlibInflate.write(buffer.buffer);
	}

	public flush(callback: (data: VSBuffer) => void): void {
		this._zlibInflate.flush(() => {
			this._tracer.traceSocketEvent(SocketDiagnosticsEventType.zlibInflateFlushFired);
			const data = VSBuffer.concat(this._pendingInflateData);
			this._pendingInflateData.length = 0;
			callback(data);
		});
	}
}

class ZlibDeflateStream extends Disposable {

	private readonly _onError = this._register(new Emitter<Error>());
	public readonly onError = this._onError.event;

	private readonly _zlibDeflate: DeflateRaw;
	private readonly _pendingDeflateData: VSBuffer[] = [];

	constructor(
		private readonly _tracer: ISocketTracer,
		options: ZlibOptions
	) {
		super();

		this._zlibDeflate = createDeflateRaw({
			windowBits: 15
		});
		this._zlibDeflate.on('error', (err: Error) => {
			this._tracer.traceSocketEvent(SocketDiagnosticsEventType.zlibDeflateError, { message: err?.message, code: (err as NodeJS.ErrnoException)?.code });
			this._onError.fire(err);
		});
		this._zlibDeflate.on('data', (data: Buffer) => {
			this._tracer.traceSocketEvent(SocketDiagnosticsEventType.zlibDeflateData, data);
			this._pendingDeflateData.push(VSBuffer.wrap(data));
		});
	}

	public write(buffer: VSBuffer): void {
		this._tracer.traceSocketEvent(SocketDiagnosticsEventType.zlibDeflateWrite, buffer.buffer);
		this._zlibDeflate.write(<Buffer>buffer.buffer);
	}

	public flush(callback: (data: VSBuffer) => void): void {
		// See https://zlib.net/manual.html#Constants
		this._zlibDeflate.flush(/*Z_SYNC_FLUSH*/2, () => {
			this._tracer.traceSocketEvent(SocketDiagnosticsEventType.zlibDeflateFlushFired);

			let data = VSBuffer.concat(this._pendingDeflateData);
			this._pendingDeflateData.length = 0;

			// See https://tools.ietf.org/html/rfc7692#section-7.2.1
			data = data.slice(0, data.byteLength - 4);

			callback(data);
		});
	}
}

function unmask(buffer: VSBuffer, mask: number): void {
	if (mask === 0) {
		return;
	}
	const cnt = buffer.byteLength >>> 2;
	for (let i = 0; i < cnt; i++) {
		const v = buffer.readUInt32BE(i * 4);
		buffer.writeUInt32BE(v ^ mask, i * 4);
	}
	const offset = cnt * 4;
	const bytesLeft = buffer.byteLength - offset;
	const m3 = (mask >>> 24) & 0b11111111;
	const m2 = (mask >>> 16) & 0b11111111;
	const m1 = (mask >>> 8) & 0b11111111;
	if (bytesLeft >= 1) {
		buffer.writeUInt8(buffer.readUInt8(offset) ^ m3, offset);
	}
	if (bytesLeft >= 2) {
		buffer.writeUInt8(buffer.readUInt8(offset + 1) ^ m2, offset + 1);
	}
	if (bytesLeft >= 3) {
		buffer.writeUInt8(buffer.readUInt8(offset + 2) ^ m1, offset + 2);
	}
}

// Read this before there's any chance it is overwritten
// Related to https://github.com/microsoft/vscode/issues/30624
export const XDG_RUNTIME_DIR = process.env['XDG_RUNTIME_DIR'];

const safeIpcPathLengths: { [platform: number]: number } = {
	[Platform.Linux]: 107,
	[Platform.Mac]: 103
};

export function createRandomIPCHandle(): string {
	const randomSuffix = generateUuid();

	// Windows: use named pipe
	if (process.platform === 'win32') {
		return `\\\\.\\pipe\\vscode-ipc-${randomSuffix}-sock`;
	}

	// Mac & Unix: Use socket file
	// Unix: Prefer XDG_RUNTIME_DIR over user data path
	const basePath = process.platform !== 'darwin' && XDG_RUNTIME_DIR ? XDG_RUNTIME_DIR : tmpdir();
	const result = join(basePath, `vscode-ipc-${randomSuffix}.sock`);

	// Validate length
	validateIPCHandleLength(result);

	return result;
}

export function createStaticIPCHandle(directoryPath: string, type: string, version: string): string {
	const scope = createHash('sha256').update(directoryPath).digest('hex');
	const scopeForSocket = scope.substr(0, 8);

	// Windows: use named pipe
	if (process.platform === 'win32') {
		return `\\\\.\\pipe\\${scopeForSocket}-${version}-${type}-sock`;
	}

	// Mac & Unix: Use socket file
	// Unix: Prefer XDG_RUNTIME_DIR over user data path, unless portable
	// Trim the version and type values for the socket to prevent too large
	// file names causing issues: https://unix.stackexchange.com/q/367008

	const versionForSocket = version.substr(0, 4);
	const typeForSocket = type.substr(0, 6);

	let result: string;
	if (process.platform !== 'darwin' && XDG_RUNTIME_DIR && !process.env['VSCODE_PORTABLE']) {
		result = join(XDG_RUNTIME_DIR, `vscode-${scopeForSocket}-${versionForSocket}-${typeForSocket}.sock`);
	} else {
		result = join(directoryPath, `${versionForSocket}-${typeForSocket}.sock`);
	}

	// Validate length
	validateIPCHandleLength(result);

	return result;
}

function validateIPCHandleLength(handle: string): void {
	const limit = safeIpcPathLengths[platform];
	if (typeof limit === 'number' && handle.length >= limit) {
		// https://nodejs.org/api/net.html#net_identifying_paths_for_ipc_connections
		console.warn(`WARNING: IPC handle "${handle}" is longer than ${limit} chars, try a shorter --user-data-dir`);
	}
}

export class Server extends IPCServer {

	private static toClientConnectionEvent(server: NetServer): Event<ClientConnectionEvent> {
		const onConnection = Event.fromNodeEventEmitter<Socket>(server, 'connection');

		return Event.map(onConnection, socket => ({
			protocol: new Protocol(new NodeSocket(socket, 'ipc-server-connection')),
			onDidClientDisconnect: Event.once(Event.fromNodeEventEmitter<void>(socket, 'close'))
		}));
	}

	private server: NetServer | null;

	constructor(server: NetServer) {
		super(Server.toClientConnectionEvent(server));
		this.server = server;
	}

	override dispose(): void {
		super.dispose();
		if (this.server) {
			this.server.close();
			this.server = null;
		}
	}
}

export function serve(port: number): Promise<Server>;
export function serve(namedPipe: string): Promise<Server>;
export function serve(hook: number | string): Promise<Server> {
	return new Promise<Server>((resolve, reject) => {
		const server = createServer();

		server.on('error', reject);
		server.listen(hook, () => {
			server.removeListener('error', reject);
			resolve(new Server(server));
		});
	});
}

export function connect(options: { host: string; port: number }, clientId: string): Promise<Client>;
export function connect(namedPipe: string, clientId: string): Promise<Client>;
export function connect(hook: { host: string; port: number } | string, clientId: string): Promise<Client> {
	return new Promise<Client>((resolve, reject) => {
		let socket: Socket;

		const callbackHandler = () => {
			socket.removeListener('error', reject);
			resolve(Client.fromSocket(new NodeSocket(socket, `ipc-client${clientId}`), clientId));
		};

		if (typeof hook === 'string') {
			socket = createConnection(hook, callbackHandler);
		} else {
			socket = createConnection(hook, callbackHandler);
		}

		socket.once('error', reject);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/ipc/test/browser/ipc.mp.test.ts]---
Location: vscode-main/src/vs/base/parts/ipc/test/browser/ipc.mp.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken } from '../../../../common/cancellation.js';
import { Event } from '../../../../common/event.js';
import { Client as MessagePortClient } from '../../browser/ipc.mp.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../test/common/utils.js';

suite('IPC, MessagePorts', () => {

	test('message passing', async () => {
		const { port1, port2 } = new MessageChannel();

		const client1 = new MessagePortClient(port1, 'client1');
		const client2 = new MessagePortClient(port2, 'client2');

		client1.registerChannel('client1', {
			call(_: unknown, command: string, arg: any, cancellationToken: CancellationToken): Promise<any> {
				switch (command) {
					case 'testMethodClient1': return Promise.resolve('success1');
					default: return Promise.reject(new Error('not implemented'));
				}
			},

			listen(_: unknown, event: string, arg?: any): Event<any> {
				switch (event) {
					default: throw new Error('not implemented');
				}
			}
		});

		client2.registerChannel('client2', {
			call(_: unknown, command: string, arg: any, cancellationToken: CancellationToken): Promise<any> {
				switch (command) {
					case 'testMethodClient2': return Promise.resolve('success2');
					default: return Promise.reject(new Error('not implemented'));
				}
			},

			listen(_: unknown, event: string, arg?: any): Event<any> {
				switch (event) {
					default: throw new Error('not implemented');
				}
			}
		});

		const channelClient1 = client2.getChannel('client1');
		assert.strictEqual(await channelClient1.call('testMethodClient1'), 'success1');

		const channelClient2 = client1.getChannel('client2');
		assert.strictEqual(await channelClient2.call('testMethodClient2'), 'success2');

		client1.dispose();
		client2.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/ipc/test/common/ipc.test.ts]---
Location: vscode-main/src/vs/base/parts/ipc/test/common/ipc.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { timeout } from '../../../../common/async.js';
import { VSBuffer } from '../../../../common/buffer.js';
import { CancellationToken, CancellationTokenSource } from '../../../../common/cancellation.js';
import { canceled } from '../../../../common/errors.js';
import { Emitter, Event } from '../../../../common/event.js';
import { DisposableStore } from '../../../../common/lifecycle.js';
import { isEqual } from '../../../../common/resources.js';
import { URI } from '../../../../common/uri.js';
import { BufferReader, BufferWriter, ClientConnectionEvent, deserialize, IChannel, IMessagePassingProtocol, IPCClient, IPCServer, IServerChannel, ProxyChannel, serialize } from '../../common/ipc.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../test/common/utils.js';

class QueueProtocol implements IMessagePassingProtocol {

	private buffering = true;
	private buffers: VSBuffer[] = [];

	private readonly _onMessage = new Emitter<VSBuffer>({
		onDidAddFirstListener: () => {
			for (const buffer of this.buffers) {
				this._onMessage.fire(buffer);
			}

			this.buffers = [];
			this.buffering = false;
		},
		onDidRemoveLastListener: () => {
			this.buffering = true;
		}
	});

	readonly onMessage = this._onMessage.event;
	other!: QueueProtocol;

	send(buffer: VSBuffer): void {
		this.other.receive(buffer);
	}

	protected receive(buffer: VSBuffer): void {
		if (this.buffering) {
			this.buffers.push(buffer);
		} else {
			this._onMessage.fire(buffer);
		}
	}
}

function createProtocolPair(): [IMessagePassingProtocol, IMessagePassingProtocol] {
	const one = new QueueProtocol();
	const other = new QueueProtocol();
	one.other = other;
	other.other = one;

	return [one, other];
}

class TestIPCClient extends IPCClient<string> {

	private readonly _onDidDisconnect = new Emitter<void>();
	readonly onDidDisconnect = this._onDidDisconnect.event;

	constructor(protocol: IMessagePassingProtocol, id: string) {
		super(protocol, id);
	}

	override dispose(): void {
		this._onDidDisconnect.fire();
		super.dispose();
	}
}

class TestIPCServer extends IPCServer<string> {

	private readonly onDidClientConnect: Emitter<ClientConnectionEvent>;

	constructor() {
		const onDidClientConnect = new Emitter<ClientConnectionEvent>();
		super(onDidClientConnect.event);
		this.onDidClientConnect = onDidClientConnect;
	}

	createConnection(id: string): IPCClient<string> {
		const [pc, ps] = createProtocolPair();
		const client = new TestIPCClient(pc, id);

		this.onDidClientConnect.fire({
			protocol: ps,
			onDidClientDisconnect: client.onDidDisconnect
		});

		return client;
	}
}

const TestChannelId = 'testchannel';

interface ITestService {
	marco(): Promise<string>;
	error(message: string): Promise<void>;
	neverComplete(): Promise<void>;
	neverCompleteCT(cancellationToken: CancellationToken): Promise<void>;
	buffersLength(buffers: VSBuffer[]): Promise<number>;
	marshall(uri: URI): Promise<URI>;
	context(): Promise<unknown>;

	readonly onPong: Event<string>;
}

class TestService implements ITestService {

	private readonly disposables = new DisposableStore();

	private readonly _onPong = new Emitter<string>();
	readonly onPong = this._onPong.event;

	marco(): Promise<string> {
		return Promise.resolve('polo');
	}

	error(message: string): Promise<void> {
		return Promise.reject(new Error(message));
	}

	neverComplete(): Promise<void> {
		return new Promise(_ => { });
	}

	neverCompleteCT(cancellationToken: CancellationToken): Promise<void> {
		if (cancellationToken.isCancellationRequested) {
			return Promise.reject(canceled());
		}

		return new Promise((_, e) => this.disposables.add(cancellationToken.onCancellationRequested(() => e(canceled()))));
	}

	buffersLength(buffers: VSBuffer[]): Promise<number> {
		return Promise.resolve(buffers.reduce((r, b) => r + b.buffer.length, 0));
	}

	ping(msg: string): void {
		this._onPong.fire(msg);
	}

	marshall(uri: URI): Promise<URI> {
		return Promise.resolve(uri);
	}

	context(context?: unknown): Promise<unknown> {
		return Promise.resolve(context);
	}

	dispose() {
		this.disposables.dispose();
	}
}

class TestChannel implements IServerChannel {

	constructor(private service: ITestService) { }

	call(_: unknown, command: string, arg: any, cancellationToken: CancellationToken): Promise<any> {
		switch (command) {
			case 'marco': return this.service.marco();
			case 'error': return this.service.error(arg);
			case 'neverComplete': return this.service.neverComplete();
			case 'neverCompleteCT': return this.service.neverCompleteCT(cancellationToken);
			case 'buffersLength': return this.service.buffersLength(arg);
			default: return Promise.reject(new Error('not implemented'));
		}
	}

	listen(_: unknown, event: string, arg?: any): Event<any> {
		switch (event) {
			case 'onPong': return this.service.onPong;
			default: throw new Error('not implemented');
		}
	}
}

class TestChannelClient implements ITestService {

	get onPong(): Event<string> {
		return this.channel.listen('onPong');
	}

	constructor(private channel: IChannel) { }

	marco(): Promise<string> {
		return this.channel.call('marco');
	}

	error(message: string): Promise<void> {
		return this.channel.call('error', message);
	}

	neverComplete(): Promise<void> {
		return this.channel.call('neverComplete');
	}

	neverCompleteCT(cancellationToken: CancellationToken): Promise<void> {
		return this.channel.call('neverCompleteCT', undefined, cancellationToken);
	}

	buffersLength(buffers: VSBuffer[]): Promise<number> {
		return this.channel.call('buffersLength', buffers);
	}

	marshall(uri: URI): Promise<URI> {
		return this.channel.call('marshall', uri);
	}

	context(): Promise<unknown> {
		return this.channel.call('context');
	}
}

suite('Base IPC', function () {

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	test('createProtocolPair', async function () {
		const [clientProtocol, serverProtocol] = createProtocolPair();

		const b1 = VSBuffer.alloc(0);
		clientProtocol.send(b1);

		const b3 = VSBuffer.alloc(0);
		serverProtocol.send(b3);

		const b2 = await Event.toPromise(serverProtocol.onMessage);
		const b4 = await Event.toPromise(clientProtocol.onMessage);

		assert.strictEqual(b1, b2);
		assert.strictEqual(b3, b4);
	});

	suite('one to one', function () {
		let server: IPCServer;
		let client: IPCClient;
		let service: TestService;
		let ipcService: ITestService;

		setup(function () {
			service = store.add(new TestService());
			const testServer = store.add(new TestIPCServer());
			server = testServer;

			server.registerChannel(TestChannelId, new TestChannel(service));

			client = store.add(testServer.createConnection('client1'));
			ipcService = new TestChannelClient(client.getChannel(TestChannelId));
		});

		test('call success', async function () {
			const r = await ipcService.marco();
			return assert.strictEqual(r, 'polo');
		});

		test('call error', async function () {
			try {
				await ipcService.error('nice error');
				return assert.fail('should not reach here');
			} catch (err) {
				return assert.strictEqual(err.message, 'nice error');
			}
		});

		test('cancel call with cancelled cancellation token', async function () {
			try {
				await ipcService.neverCompleteCT(CancellationToken.Cancelled);
				return assert.fail('should not reach here');
			} catch (err) {
				return assert(err.message === 'Canceled');
			}
		});

		test('cancel call with cancellation token (sync)', function () {
			const cts = new CancellationTokenSource();
			const promise = ipcService.neverCompleteCT(cts.token).then(
				_ => assert.fail('should not reach here'),
				err => assert(err.message === 'Canceled')
			);

			cts.cancel();

			return promise;
		});

		test('cancel call with cancellation token (async)', function () {
			const cts = new CancellationTokenSource();
			const promise = ipcService.neverCompleteCT(cts.token).then(
				_ => assert.fail('should not reach here'),
				err => assert(err.message === 'Canceled')
			);

			setTimeout(() => cts.cancel());

			return promise;
		});

		test('listen to events', async function () {
			const messages: string[] = [];

			store.add(ipcService.onPong(msg => messages.push(msg)));
			await timeout(0);

			assert.deepStrictEqual(messages, []);
			service.ping('hello');
			await timeout(0);

			assert.deepStrictEqual(messages, ['hello']);
			service.ping('world');
			await timeout(0);

			assert.deepStrictEqual(messages, ['hello', 'world']);
		});

		test('buffers in arrays', async function () {
			const r = await ipcService.buffersLength([VSBuffer.alloc(2), VSBuffer.alloc(3)]);
			return assert.strictEqual(r, 5);
		});

		test('round trips numbers', () => {
			const input = [
				0,
				1,
				-1,
				12345,
				-12345,
				42.6,
				123412341234
			];

			const writer = new BufferWriter();
			serialize(writer, input);
			assert.deepStrictEqual(deserialize(new BufferReader(writer.buffer)), input);
		});
	});

	suite('one to one (proxy)', function () {
		let server: IPCServer;
		let client: IPCClient;
		let service: TestService;
		let ipcService: ITestService;

		const disposables = new DisposableStore();

		setup(function () {
			service = store.add(new TestService());
			const testServer = disposables.add(new TestIPCServer());
			server = testServer;

			server.registerChannel(TestChannelId, ProxyChannel.fromService(service, disposables));

			client = disposables.add(testServer.createConnection('client1'));
			ipcService = ProxyChannel.toService(client.getChannel(TestChannelId));
		});

		teardown(function () {
			disposables.clear();
		});

		test('call success', async function () {
			const r = await ipcService.marco();
			return assert.strictEqual(r, 'polo');
		});

		test('call error', async function () {
			try {
				await ipcService.error('nice error');
				return assert.fail('should not reach here');
			} catch (err) {
				return assert.strictEqual(err.message, 'nice error');
			}
		});

		test('listen to events', async function () {
			const messages: string[] = [];

			disposables.add(ipcService.onPong(msg => messages.push(msg)));
			await timeout(0);

			assert.deepStrictEqual(messages, []);
			service.ping('hello');
			await timeout(0);

			assert.deepStrictEqual(messages, ['hello']);
			service.ping('world');
			await timeout(0);

			assert.deepStrictEqual(messages, ['hello', 'world']);
		});

		test('marshalling uri', async function () {
			const uri = URI.file('foobar');
			const r = await ipcService.marshall(uri);
			assert.ok(r instanceof URI);
			return assert.ok(isEqual(r, uri));
		});

		test('buffers in arrays', async function () {
			const r = await ipcService.buffersLength([VSBuffer.alloc(2), VSBuffer.alloc(3)]);
			return assert.strictEqual(r, 5);
		});
	});

	suite('one to one (proxy, extra context)', function () {
		let server: IPCServer;
		let client: IPCClient;
		let service: TestService;
		let ipcService: ITestService;

		const disposables = new DisposableStore();

		setup(function () {
			service = store.add(new TestService());
			const testServer = disposables.add(new TestIPCServer());
			server = testServer;

			server.registerChannel(TestChannelId, ProxyChannel.fromService(service, disposables));

			client = disposables.add(testServer.createConnection('client1'));
			ipcService = ProxyChannel.toService(client.getChannel(TestChannelId), { context: 'Super Context' });
		});

		teardown(function () {
			disposables.clear();
		});

		test('call extra context', async function () {
			const r = await ipcService.context();
			return assert.strictEqual(r, 'Super Context');
		});
	});

	suite('one to many', function () {
		test('all clients get pinged', async function () {
			const service = store.add(new TestService());
			const channel = new TestChannel(service);
			const server = store.add(new TestIPCServer());
			server.registerChannel('channel', channel);

			let client1GotPinged = false;
			const client1 = store.add(server.createConnection('client1'));
			const ipcService1 = new TestChannelClient(client1.getChannel('channel'));
			store.add(ipcService1.onPong(() => client1GotPinged = true));

			let client2GotPinged = false;
			const client2 = store.add(server.createConnection('client2'));
			const ipcService2 = new TestChannelClient(client2.getChannel('channel'));
			store.add(ipcService2.onPong(() => client2GotPinged = true));

			await timeout(1);
			service.ping('hello');

			await timeout(1);
			assert(client1GotPinged, 'client 1 got pinged');
			assert(client2GotPinged, 'client 2 got pinged');
		});

		test('server gets pings from all clients (broadcast channel)', async function () {
			const server = store.add(new TestIPCServer());

			const client1 = server.createConnection('client1');
			const clientService1 = store.add(new TestService());
			const clientChannel1 = new TestChannel(clientService1);
			client1.registerChannel('channel', clientChannel1);

			const pings: string[] = [];
			const channel = server.getChannel('channel', () => true);
			const service = new TestChannelClient(channel);
			store.add(service.onPong(msg => pings.push(msg)));

			await timeout(1);
			clientService1.ping('hello 1');

			await timeout(1);
			assert.deepStrictEqual(pings, ['hello 1']);

			const client2 = server.createConnection('client2');
			const clientService2 = store.add(new TestService());
			const clientChannel2 = new TestChannel(clientService2);
			client2.registerChannel('channel', clientChannel2);

			await timeout(1);
			clientService2.ping('hello 2');

			await timeout(1);
			assert.deepStrictEqual(pings, ['hello 1', 'hello 2']);

			client1.dispose();
			clientService1.ping('hello 1');

			await timeout(1);
			assert.deepStrictEqual(pings, ['hello 1', 'hello 2']);

			await timeout(1);
			clientService2.ping('hello again 2');

			await timeout(1);
			assert.deepStrictEqual(pings, ['hello 1', 'hello 2', 'hello again 2']);

			client2.dispose();
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/ipc/test/electron-browser/ipc.mp.test.ts]---
Location: vscode-main/src/vs/base/parts/ipc/test/electron-browser/ipc.mp.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Client as MessagePortClient } from '../../browser/ipc.mp.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../test/common/utils.js';

suite('IPC, MessagePorts', () => {

	test('message port close event', async () => {
		const { port1, port2 } = new MessageChannel();

		const client1 = new MessagePortClient(port1, 'client1');
		const client2 = new MessagePortClient(port2, 'client2');

		// This test ensures that Electron's API for the close event
		// does not break because we rely on it to dispose client
		// connections from the server.
		//
		// This event is not provided by browser MessagePort API though.
		const whenClosed = new Promise<boolean>(resolve => port1.addEventListener('close', () => resolve(true)));

		client2.dispose();

		assert.ok(await whenClosed);

		client1.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/ipc/test/node/ipc.cp.integrationTest.ts]---
Location: vscode-main/src/vs/base/parts/ipc/test/node/ipc.cp.integrationTest.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Event } from '../../../../common/event.js';
import { IChannel } from '../../common/ipc.js';
import { Client } from '../../node/ipc.cp.js';
import { ITestService, TestServiceClient } from './testService.js';
import { FileAccess } from '../../../../common/network.js';

function createClient(): Client {
	return new Client(FileAccess.asFileUri('bootstrap-fork').fsPath, {
		serverName: 'TestServer',
		env: { VSCODE_ESM_ENTRYPOINT: 'vs/base/parts/ipc/test/node/testApp', verbose: true }
	});
}

suite('IPC, Child Process', function () {
	this.slow(2000);
	this.timeout(10000);

	let client: Client;
	let channel: IChannel;
	let service: ITestService;

	setup(() => {
		client = createClient();
		channel = client.getChannel('test');
		service = new TestServiceClient(channel);
	});

	teardown(() => {
		client.dispose();
	});

	test('createChannel', async () => {
		const result = await service.pong('ping');
		assert.strictEqual(result.incoming, 'ping');
		assert.strictEqual(result.outgoing, 'pong');
	});

	test('events', async () => {
		const event = Event.toPromise(Event.once(service.onMarco));
		const promise = service.marco();

		const [promiseResult, eventResult] = await Promise.all([promise, event]);

		assert.strictEqual(promiseResult, 'polo');
		assert.strictEqual(eventResult.answer, 'polo');
	});

	test('event dispose', async () => {
		let count = 0;
		const disposable = service.onMarco(() => count++);

		const answer = await service.marco();
		assert.strictEqual(answer, 'polo');
		assert.strictEqual(count, 1);

		const answer_1 = await service.marco();
		assert.strictEqual(answer_1, 'polo');
		assert.strictEqual(count, 2);
		disposable.dispose();

		const answer_2 = await service.marco();
		assert.strictEqual(answer_2, 'polo');
		assert.strictEqual(count, 2);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/ipc/test/node/ipc.net.test.ts]---
Location: vscode-main/src/vs/base/parts/ipc/test/node/ipc.net.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import sinon from 'sinon';
import { EventEmitter } from 'events';
import { AddressInfo, connect, createServer, Server, Socket } from 'net';
import { tmpdir } from 'os';
import { Barrier, timeout } from '../../../../common/async.js';
import { VSBuffer } from '../../../../common/buffer.js';
import { Emitter, Event } from '../../../../common/event.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../common/lifecycle.js';
import { ILoadEstimator, PersistentProtocol, Protocol, ProtocolConstants, SocketCloseEvent, SocketDiagnosticsEventType } from '../../common/ipc.net.js';
import { createRandomIPCHandle, createStaticIPCHandle, NodeSocket, WebSocketNodeSocket } from '../../node/ipc.net.js';
import { flakySuite } from '../../../../test/common/testUtils.js';
import { runWithFakedTimers } from '../../../../test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../test/common/utils.js';

class MessageStream extends Disposable {

	private _currentComplete: ((data: VSBuffer) => void) | null;
	private _messages: VSBuffer[];

	constructor(x: Protocol | PersistentProtocol) {
		super();
		this._currentComplete = null;
		this._messages = [];
		this._register(x.onMessage(data => {
			this._messages.push(data);
			this._trigger();
		}));
	}

	private _trigger(): void {
		if (!this._currentComplete) {
			return;
		}
		if (this._messages.length === 0) {
			return;
		}
		const complete = this._currentComplete;
		const msg = this._messages.shift()!;

		this._currentComplete = null;
		complete(msg);
	}

	public waitForOne(): Promise<VSBuffer> {
		return new Promise<VSBuffer>((complete) => {
			this._currentComplete = complete;
			this._trigger();
		});
	}
}

class EtherStream extends EventEmitter {
	constructor(
		private readonly _ether: Ether,
		private readonly _name: 'a' | 'b'
	) {
		super();
	}

	write(data: Buffer, cb?: Function): boolean {
		if (!Buffer.isBuffer(data)) {
			throw new Error(`Invalid data`);
		}
		this._ether.write(this._name, data);
		return true;
	}

	destroy(): void {
	}
}

class Ether {

	private readonly _a: EtherStream;
	private readonly _b: EtherStream;

	private _ab: Buffer[];
	private _ba: Buffer[];

	public get a(): Socket {
		// eslint-disable-next-line local/code-no-any-casts
		return <any>this._a;
	}

	public get b(): Socket {
		// eslint-disable-next-line local/code-no-any-casts
		return <any>this._b;
	}

	constructor(
		private readonly _wireLatency = 0
	) {
		this._a = new EtherStream(this, 'a');
		this._b = new EtherStream(this, 'b');
		this._ab = [];
		this._ba = [];
	}

	public write(from: 'a' | 'b', data: Buffer): void {
		setTimeout(() => {
			if (from === 'a') {
				this._ab.push(data);
			} else {
				this._ba.push(data);
			}

			setTimeout(() => this._deliver(), 0);
		}, this._wireLatency);
	}

	private _deliver(): void {

		if (this._ab.length > 0) {
			const data = Buffer.concat(this._ab);
			this._ab.length = 0;
			this._b.emit('data', data);
			setTimeout(() => this._deliver(), 0);
			return;
		}

		if (this._ba.length > 0) {
			const data = Buffer.concat(this._ba);
			this._ba.length = 0;
			this._a.emit('data', data);
			setTimeout(() => this._deliver(), 0);
			return;
		}

	}
}

suite('IPC, Socket Protocol', () => {

	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	let ether: Ether;

	setup(() => {
		ether = new Ether();
	});

	test('read/write', async () => {

		const a = new Protocol(new NodeSocket(ether.a));
		const b = new Protocol(new NodeSocket(ether.b));
		const bMessages = new MessageStream(b);

		a.send(VSBuffer.fromString('foobarfarboo'));
		const msg1 = await bMessages.waitForOne();
		assert.strictEqual(msg1.toString(), 'foobarfarboo');

		const buffer = VSBuffer.alloc(1);
		buffer.writeUInt8(123, 0);
		a.send(buffer);
		const msg2 = await bMessages.waitForOne();
		assert.strictEqual(msg2.readUInt8(0), 123);

		bMessages.dispose();
		a.dispose();
		b.dispose();
	});


	test('read/write, object data', async () => {

		const a = new Protocol(new NodeSocket(ether.a));
		const b = new Protocol(new NodeSocket(ether.b));
		const bMessages = new MessageStream(b);

		const data = {
			pi: Math.PI,
			foo: 'bar',
			more: true,
			data: 'Hello World'.split('')
		};

		a.send(VSBuffer.fromString(JSON.stringify(data)));
		const msg = await bMessages.waitForOne();
		assert.deepStrictEqual(JSON.parse(msg.toString()), data);

		bMessages.dispose();
		a.dispose();
		b.dispose();
	});



	test('issue #211462: destroy socket after end timeout', async () => {
		const socket = new EventEmitter();
		Object.assign(socket, { destroy: () => socket.emit('close') });
		const protocol = ds.add(new Protocol(new NodeSocket(socket as Socket)));

		const disposed = sinon.stub();
		const timers = sinon.useFakeTimers();

		ds.add(toDisposable(() => timers.restore()));
		ds.add(protocol.onDidDispose(disposed));

		socket.emit('end');
		assert.ok(!disposed.called);
		timers.tick(29_999);
		assert.ok(!disposed.called);
		timers.tick(1);
		assert.ok(disposed.called);
	});
});

suite('PersistentProtocol reconnection', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('acks get piggybacked with messages', async () => {
		const ether = new Ether();
		const a = new PersistentProtocol({ socket: new NodeSocket(ether.a) });
		const aMessages = new MessageStream(a);
		const b = new PersistentProtocol({ socket: new NodeSocket(ether.b) });
		const bMessages = new MessageStream(b);

		a.send(VSBuffer.fromString('a1'));
		assert.strictEqual(a.unacknowledgedCount, 1);
		assert.strictEqual(b.unacknowledgedCount, 0);

		a.send(VSBuffer.fromString('a2'));
		assert.strictEqual(a.unacknowledgedCount, 2);
		assert.strictEqual(b.unacknowledgedCount, 0);

		a.send(VSBuffer.fromString('a3'));
		assert.strictEqual(a.unacknowledgedCount, 3);
		assert.strictEqual(b.unacknowledgedCount, 0);

		const a1 = await bMessages.waitForOne();
		assert.strictEqual(a1.toString(), 'a1');
		assert.strictEqual(a.unacknowledgedCount, 3);
		assert.strictEqual(b.unacknowledgedCount, 0);

		const a2 = await bMessages.waitForOne();
		assert.strictEqual(a2.toString(), 'a2');
		assert.strictEqual(a.unacknowledgedCount, 3);
		assert.strictEqual(b.unacknowledgedCount, 0);

		const a3 = await bMessages.waitForOne();
		assert.strictEqual(a3.toString(), 'a3');
		assert.strictEqual(a.unacknowledgedCount, 3);
		assert.strictEqual(b.unacknowledgedCount, 0);

		b.send(VSBuffer.fromString('b1'));
		assert.strictEqual(a.unacknowledgedCount, 3);
		assert.strictEqual(b.unacknowledgedCount, 1);

		const b1 = await aMessages.waitForOne();
		assert.strictEqual(b1.toString(), 'b1');
		assert.strictEqual(a.unacknowledgedCount, 0);
		assert.strictEqual(b.unacknowledgedCount, 1);

		a.send(VSBuffer.fromString('a4'));
		assert.strictEqual(a.unacknowledgedCount, 1);
		assert.strictEqual(b.unacknowledgedCount, 1);

		const b2 = await bMessages.waitForOne();
		assert.strictEqual(b2.toString(), 'a4');
		assert.strictEqual(a.unacknowledgedCount, 1);
		assert.strictEqual(b.unacknowledgedCount, 0);

		aMessages.dispose();
		bMessages.dispose();
		a.dispose();
		b.dispose();
	});

	test('ack gets sent after a while', async () => {
		await runWithFakedTimers({ useFakeTimers: true, maxTaskCount: 100 }, async () => {
			const loadEstimator: ILoadEstimator = {
				hasHighLoad: () => false
			};
			const ether = new Ether();
			const aSocket = new NodeSocket(ether.a);
			const a = new PersistentProtocol({ socket: aSocket, loadEstimator });
			const aMessages = new MessageStream(a);
			const bSocket = new NodeSocket(ether.b);
			const b = new PersistentProtocol({ socket: bSocket, loadEstimator });
			const bMessages = new MessageStream(b);

			// send one message A -> B
			a.send(VSBuffer.fromString('a1'));
			assert.strictEqual(a.unacknowledgedCount, 1);
			assert.strictEqual(b.unacknowledgedCount, 0);
			const a1 = await bMessages.waitForOne();
			assert.strictEqual(a1.toString(), 'a1');
			assert.strictEqual(a.unacknowledgedCount, 1);
			assert.strictEqual(b.unacknowledgedCount, 0);

			// wait for ack to arrive B -> A
			await timeout(2 * ProtocolConstants.AcknowledgeTime);
			assert.strictEqual(a.unacknowledgedCount, 0);
			assert.strictEqual(b.unacknowledgedCount, 0);

			aMessages.dispose();
			bMessages.dispose();
			a.dispose();
			b.dispose();
		});
	});

	test('messages that are never written to a socket should not cause an ack timeout', async () => {
		await runWithFakedTimers(
			{
				useFakeTimers: true,
				useSetImmediate: true,
				maxTaskCount: 1000
			},
			async () => {
				// Date.now() in fake timers starts at 0, which is very inconvenient
				// since we want to test exactly that a certain field is not initialized with Date.now()
				// As a workaround we wait such that Date.now() starts producing more realistic values
				await timeout(60 * 60 * 1000);

				const loadEstimator: ILoadEstimator = {
					hasHighLoad: () => false
				};
				const ether = new Ether();
				const aSocket = new NodeSocket(ether.a);
				const a = new PersistentProtocol({ socket: aSocket, loadEstimator, sendKeepAlive: false });
				const aMessages = new MessageStream(a);
				const bSocket = new NodeSocket(ether.b);
				const b = new PersistentProtocol({ socket: bSocket, loadEstimator, sendKeepAlive: false });
				const bMessages = new MessageStream(b);

				// send message a1 before reconnection to get _recvAckCheck() scheduled
				a.send(VSBuffer.fromString('a1'));
				assert.strictEqual(a.unacknowledgedCount, 1);
				assert.strictEqual(b.unacknowledgedCount, 0);

				// read message a1 at B
				const a1 = await bMessages.waitForOne();
				assert.strictEqual(a1.toString(), 'a1');
				assert.strictEqual(a.unacknowledgedCount, 1);
				assert.strictEqual(b.unacknowledgedCount, 0);

				// send message b1 to send the ack for a1
				b.send(VSBuffer.fromString('b1'));
				assert.strictEqual(a.unacknowledgedCount, 1);
				assert.strictEqual(b.unacknowledgedCount, 1);

				// read message b1 at A to receive the ack for a1
				const b1 = await aMessages.waitForOne();
				assert.strictEqual(b1.toString(), 'b1');
				assert.strictEqual(a.unacknowledgedCount, 0);
				assert.strictEqual(b.unacknowledgedCount, 1);

				// begin reconnection
				aSocket.dispose();
				const aSocket2 = new NodeSocket(ether.a);
				a.beginAcceptReconnection(aSocket2, null);

				let timeoutListenerCalled = false;
				const socketTimeoutListener = a.onSocketTimeout(() => {
					timeoutListenerCalled = true;
				});

				// send message 2 during reconnection
				a.send(VSBuffer.fromString('a2'));
				assert.strictEqual(a.unacknowledgedCount, 1);
				assert.strictEqual(b.unacknowledgedCount, 1);

				// wait for scheduled _recvAckCheck() to execute
				await timeout(2 * ProtocolConstants.TimeoutTime);

				assert.strictEqual(a.unacknowledgedCount, 1);
				assert.strictEqual(b.unacknowledgedCount, 1);
				assert.strictEqual(timeoutListenerCalled, false);

				a.endAcceptReconnection();
				assert.strictEqual(timeoutListenerCalled, false);

				await timeout(2 * ProtocolConstants.TimeoutTime);
				assert.strictEqual(a.unacknowledgedCount, 0);
				assert.strictEqual(b.unacknowledgedCount, 0);
				assert.strictEqual(timeoutListenerCalled, false);

				socketTimeoutListener.dispose();
				aMessages.dispose();
				bMessages.dispose();
				a.dispose();
				b.dispose();
			}
		);
	});

	test('acks are always sent after a reconnection', async () => {
		await runWithFakedTimers(
			{
				useFakeTimers: true,
				useSetImmediate: true,
				maxTaskCount: 1000
			},
			async () => {

				const loadEstimator: ILoadEstimator = {
					hasHighLoad: () => false
				};
				const wireLatency = 1000;
				const ether = new Ether(wireLatency);
				const aSocket = new NodeSocket(ether.a);
				const a = new PersistentProtocol({ socket: aSocket, loadEstimator });
				const aMessages = new MessageStream(a);
				const bSocket = new NodeSocket(ether.b);
				const b = new PersistentProtocol({ socket: bSocket, loadEstimator });
				const bMessages = new MessageStream(b);

				// send message a1 to have something unacknowledged
				a.send(VSBuffer.fromString('a1'));
				assert.strictEqual(a.unacknowledgedCount, 1);
				assert.strictEqual(b.unacknowledgedCount, 0);

				// read message a1 at B
				const a1 = await bMessages.waitForOne();
				assert.strictEqual(a1.toString(), 'a1');
				assert.strictEqual(a.unacknowledgedCount, 1);
				assert.strictEqual(b.unacknowledgedCount, 0);

				// wait for B to send an ACK message,
				// but resume before A receives it
				await timeout(ProtocolConstants.AcknowledgeTime + wireLatency / 2);
				assert.strictEqual(a.unacknowledgedCount, 1);
				assert.strictEqual(b.unacknowledgedCount, 0);

				// simulate complete reconnection
				aSocket.dispose();
				bSocket.dispose();
				const ether2 = new Ether(wireLatency);
				const aSocket2 = new NodeSocket(ether2.a);
				const bSocket2 = new NodeSocket(ether2.b);
				b.beginAcceptReconnection(bSocket2, null);
				b.endAcceptReconnection();
				a.beginAcceptReconnection(aSocket2, null);
				a.endAcceptReconnection();

				// wait for quite some time
				await timeout(2 * ProtocolConstants.AcknowledgeTime + wireLatency);
				assert.strictEqual(a.unacknowledgedCount, 0);
				assert.strictEqual(b.unacknowledgedCount, 0);

				aMessages.dispose();
				bMessages.dispose();
				a.dispose();
				b.dispose();
			}
		);
	});

	test('onSocketTimeout is emitted at most once every 20s', async () => {
		await runWithFakedTimers(
			{
				useFakeTimers: true,
				useSetImmediate: true,
				maxTaskCount: 1000
			},
			async () => {

				const loadEstimator: ILoadEstimator = {
					hasHighLoad: () => false
				};
				const ether = new Ether();
				const aSocket = new NodeSocket(ether.a);
				const a = new PersistentProtocol({ socket: aSocket, loadEstimator });
				const aMessages = new MessageStream(a);
				const bSocket = new NodeSocket(ether.b);
				const b = new PersistentProtocol({ socket: bSocket, loadEstimator });
				const bMessages = new MessageStream(b);

				// never receive acks
				b.pauseSocketWriting();

				// send message a1 to have something unacknowledged
				a.send(VSBuffer.fromString('a1'));

				// wait for the first timeout to fire
				await Event.toPromise(a.onSocketTimeout);

				let timeoutFiredAgain = false;
				const timeoutListener = a.onSocketTimeout(() => {
					timeoutFiredAgain = true;
				});

				// send more messages
				a.send(VSBuffer.fromString('a2'));
				a.send(VSBuffer.fromString('a3'));

				// wait for 10s
				await timeout(ProtocolConstants.TimeoutTime / 2);

				assert.strictEqual(timeoutFiredAgain, false);

				timeoutListener.dispose();
				aMessages.dispose();
				bMessages.dispose();
				a.dispose();
				b.dispose();
			}
		);
	});

	test('writing can be paused', async () => {
		await runWithFakedTimers({ useFakeTimers: true, maxTaskCount: 100 }, async () => {
			const loadEstimator: ILoadEstimator = {
				hasHighLoad: () => false
			};
			const ether = new Ether();
			const aSocket = new NodeSocket(ether.a);
			const a = new PersistentProtocol({ socket: aSocket, loadEstimator });
			const aMessages = new MessageStream(a);
			const bSocket = new NodeSocket(ether.b);
			const b = new PersistentProtocol({ socket: bSocket, loadEstimator });
			const bMessages = new MessageStream(b);

			// send one message A -> B
			a.send(VSBuffer.fromString('a1'));
			const a1 = await bMessages.waitForOne();
			assert.strictEqual(a1.toString(), 'a1');

			// ask A to pause writing
			b.sendPause();

			// send a message B -> A
			b.send(VSBuffer.fromString('b1'));
			const b1 = await aMessages.waitForOne();
			assert.strictEqual(b1.toString(), 'b1');

			// send a message A -> B (this should be blocked at A)
			a.send(VSBuffer.fromString('a2'));

			// wait a long time and check that not even acks are written
			await timeout(2 * ProtocolConstants.AcknowledgeTime);
			assert.strictEqual(a.unacknowledgedCount, 1);
			assert.strictEqual(b.unacknowledgedCount, 1);

			// ask A to resume writing
			b.sendResume();

			// check that B receives message
			const a2 = await bMessages.waitForOne();
			assert.strictEqual(a2.toString(), 'a2');

			// wait a long time and check that acks are written
			await timeout(2 * ProtocolConstants.AcknowledgeTime);
			assert.strictEqual(a.unacknowledgedCount, 0);
			assert.strictEqual(b.unacknowledgedCount, 0);

			aMessages.dispose();
			bMessages.dispose();
			a.dispose();
			b.dispose();
		});
	});
});

flakySuite('IPC, create handle', () => {

	test('createRandomIPCHandle', async () => {
		return testIPCHandle(createRandomIPCHandle());
	});

	test('createStaticIPCHandle', async () => {
		return testIPCHandle(createStaticIPCHandle(tmpdir(), 'test', '1.64.0'));
	});

	function testIPCHandle(handle: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const pipeName = createRandomIPCHandle();

			const server = createServer();

			server.on('error', () => {
				return new Promise(() => server.close(() => reject()));
			});

			server.listen(pipeName, () => {
				server.removeListener('error', reject);

				return new Promise(() => {
					server.close(() => resolve());
				});
			});
		});
	}

});

suite('WebSocketNodeSocket', () => {

	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	function toUint8Array(data: number[]): Uint8Array {
		const result = new Uint8Array(data.length);
		for (let i = 0; i < data.length; i++) {
			result[i] = data[i];
		}
		return result;
	}

	function fromUint8Array(data: Uint8Array): number[] {
		const result = [];
		for (let i = 0; i < data.length; i++) {
			result[i] = data[i];
		}
		return result;
	}

	function fromCharCodeArray(data: number[]): string {
		let result = '';
		for (let i = 0; i < data.length; i++) {
			result += String.fromCharCode(data[i]);
		}
		return result;
	}

	class FakeNodeSocket extends Disposable {

		private readonly _onData = new Emitter<VSBuffer>();
		public readonly onData = this._onData.event;

		private readonly _onClose = new Emitter<SocketCloseEvent>();
		public readonly onClose = this._onClose.event;

		public writtenData: VSBuffer[] = [];

		public traceSocketEvent(type: SocketDiagnosticsEventType, data?: VSBuffer | Uint8Array | ArrayBuffer | ArrayBufferView | any): void {
		}

		constructor() {
			super();
		}

		public write(data: VSBuffer): void {
			this.writtenData.push(data);
		}

		public fireData(data: number[]): void {
			this._onData.fire(VSBuffer.wrap(toUint8Array(data)));
		}
	}

	async function testReading(frames: number[][], permessageDeflate: boolean): Promise<string> {
		const disposables = new DisposableStore();
		const socket = new FakeNodeSocket();
		// eslint-disable-next-line local/code-no-any-casts
		const webSocket = disposables.add(new WebSocketNodeSocket(<any>socket, permessageDeflate, null, false));

		const barrier = new Barrier();
		let remainingFrameCount = frames.length;

		let receivedData: string = '';
		disposables.add(webSocket.onData((buff) => {
			receivedData += fromCharCodeArray(fromUint8Array(buff.buffer));
			remainingFrameCount--;
			if (remainingFrameCount === 0) {
				barrier.open();
			}
		}));

		for (let i = 0; i < frames.length; i++) {
			socket.fireData(frames[i]);
		}

		await barrier.wait();

		disposables.dispose();

		return receivedData;
	}

	test('A single-frame unmasked text message', async () => {
		const frames = [
			[0x81, 0x05, 0x48, 0x65, 0x6c, 0x6c, 0x6f] // contains "Hello"
		];
		const actual = await testReading(frames, false);
		assert.deepStrictEqual(actual, 'Hello');
	});

	test('A single-frame masked text message', async () => {
		const frames = [
			[0x81, 0x85, 0x37, 0xfa, 0x21, 0x3d, 0x7f, 0x9f, 0x4d, 0x51, 0x58] // contains "Hello"
		];
		const actual = await testReading(frames, false);
		assert.deepStrictEqual(actual, 'Hello');
	});

	test('A fragmented unmasked text message', async () => {
		// contains "Hello"
		const frames = [
			[0x01, 0x03, 0x48, 0x65, 0x6c], // contains "Hel"
			[0x80, 0x02, 0x6c, 0x6f], // contains "lo"
		];
		const actual = await testReading(frames, false);
		assert.deepStrictEqual(actual, 'Hello');
	});

	suite('compression', () => {
		test('A single-frame compressed text message', async () => {
			// contains "Hello"
			const frames = [
				[0xc1, 0x07, 0xf2, 0x48, 0xcd, 0xc9, 0xc9, 0x07, 0x00], // contains "Hello"
			];
			const actual = await testReading(frames, true);
			assert.deepStrictEqual(actual, 'Hello');
		});

		test('A fragmented compressed text message', async () => {
			// contains "Hello"
			const frames = [  // contains "Hello"
				[0x41, 0x03, 0xf2, 0x48, 0xcd],
				[0x80, 0x04, 0xc9, 0xc9, 0x07, 0x00]
			];
			const actual = await testReading(frames, true);
			assert.deepStrictEqual(actual, 'Hello');
		});

		test('A single-frame non-compressed text message', async () => {
			const frames = [
				[0x81, 0x05, 0x48, 0x65, 0x6c, 0x6c, 0x6f] // contains "Hello"
			];
			const actual = await testReading(frames, true);
			assert.deepStrictEqual(actual, 'Hello');
		});

		test('A single-frame compressed text message followed by a single-frame non-compressed text message', async () => {
			const frames = [
				[0xc1, 0x07, 0xf2, 0x48, 0xcd, 0xc9, 0xc9, 0x07, 0x00], // contains "Hello"
				[0x81, 0x05, 0x77, 0x6f, 0x72, 0x6c, 0x64] // contains "world"
			];
			const actual = await testReading(frames, true);
			assert.deepStrictEqual(actual, 'Helloworld');
		});
	});

	test('Large buffers are split and sent in chunks', async () => {

		let receivingSideOnDataCallCount = 0;
		let receivingSideTotalBytes = 0;
		const receivingSideSocketClosedBarrier = new Barrier();

		const server = await listenOnRandomPort((socket) => {
			// stop the server when the first connection is received
			server.close();

			const webSocketNodeSocket = new WebSocketNodeSocket(new NodeSocket(socket), true, null, false);
			ds.add(webSocketNodeSocket.onData((data) => {
				receivingSideOnDataCallCount++;
				receivingSideTotalBytes += data.byteLength;
			}));

			ds.add(webSocketNodeSocket.onClose(() => {
				webSocketNodeSocket.dispose();
				receivingSideSocketClosedBarrier.open();
			}));
		});

		const socket = connect({
			host: '127.0.0.1',
			port: (<AddressInfo>server.address()).port
		});

		const buff = generateRandomBuffer(1 * 1024 * 1024);

		const webSocketNodeSocket = new WebSocketNodeSocket(new NodeSocket(socket), true, null, false);
		webSocketNodeSocket.write(buff);
		await webSocketNodeSocket.drain();
		webSocketNodeSocket.dispose();
		await receivingSideSocketClosedBarrier.wait();

		assert.strictEqual(receivingSideTotalBytes, buff.byteLength);
		assert.strictEqual(receivingSideOnDataCallCount, 4);
	});

	test('issue #194284: ping/pong opcodes are supported', async () => {

		const disposables = new DisposableStore();
		const socket = new FakeNodeSocket();
		// eslint-disable-next-line local/code-no-any-casts
		const webSocket = disposables.add(new WebSocketNodeSocket(<any>socket, false, null, false));

		let receivedData: string = '';
		disposables.add(webSocket.onData((buff) => {
			receivedData += fromCharCodeArray(fromUint8Array(buff.buffer));
		}));

		// A single-frame non-compressed text message that contains "Hello"
		socket.fireData([0x81, 0x05, 0x48, 0x65, 0x6c, 0x6c, 0x6f]);

		// A ping message that contains "data"
		socket.fireData([0x89, 0x04, 0x64, 0x61, 0x74, 0x61]);

		// Another single-frame non-compressed text message that contains "Hello"
		socket.fireData([0x81, 0x05, 0x48, 0x65, 0x6c, 0x6c, 0x6f]);

		assert.strictEqual(receivedData, 'HelloHello');
		assert.deepStrictEqual(
			socket.writtenData.map(x => fromUint8Array(x.buffer)),
			[
				// A pong message that contains "data"
				[0x8A, 0x04, 0x64, 0x61, 0x74, 0x61]
			]
		);

		disposables.dispose();

		return receivedData;
	});

	function generateRandomBuffer(size: number): VSBuffer {
		const buff = VSBuffer.alloc(size);
		for (let i = 0; i < size; i++) {
			buff.writeUInt8(Math.floor(256 * Math.random()), i);
		}
		return buff;
	}

	function listenOnRandomPort(handler: (socket: Socket) => void): Promise<Server> {
		return new Promise((resolve, reject) => {
			const server = createServer(handler).listen(0);
			server.on('listening', () => {
				resolve(server);
			});
			server.on('error', (err) => {
				reject(err);
			});
		});
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/ipc/test/node/testApp.ts]---
Location: vscode-main/src/vs/base/parts/ipc/test/node/testApp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Server } from '../../node/ipc.cp.js';
import { TestChannel, TestService } from './testService.js';

const server = new Server('test');
const service = new TestService();
server.registerChannel('test', new TestChannel(service));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/ipc/test/node/testService.ts]---
Location: vscode-main/src/vs/base/parts/ipc/test/node/testService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../../common/async.js';
import { Emitter, Event } from '../../../../common/event.js';
import { IChannel, IServerChannel } from '../../common/ipc.js';

export interface IMarcoPoloEvent {
	answer: string;
}

export interface ITestService {
	readonly onMarco: Event<IMarcoPoloEvent>;
	marco(): Promise<string>;
	pong(ping: string): Promise<{ incoming: string; outgoing: string }>;
	cancelMe(): Promise<boolean>;
}

export class TestService implements ITestService {

	private readonly _onMarco = new Emitter<IMarcoPoloEvent>();
	readonly onMarco: Event<IMarcoPoloEvent> = this._onMarco.event;

	marco(): Promise<string> {
		this._onMarco.fire({ answer: 'polo' });
		return Promise.resolve('polo');
	}

	pong(ping: string): Promise<{ incoming: string; outgoing: string }> {
		return Promise.resolve({ incoming: ping, outgoing: 'pong' });
	}

	cancelMe(): Promise<boolean> {
		return Promise.resolve(timeout(100)).then(() => true);
	}
}

export class TestChannel implements IServerChannel {

	constructor(private testService: ITestService) { }

	listen(_: unknown, event: string): Event<any> {
		switch (event) {
			case 'marco': return this.testService.onMarco;
		}

		throw new Error('Event not found');
	}

	call(_: unknown, command: string, ...args: any[]): Promise<any> {
		switch (command) {
			case 'pong': return this.testService.pong(args[0]);
			case 'cancelMe': return this.testService.cancelMe();
			case 'marco': return this.testService.marco();
			default: return Promise.reject(new Error(`command not found: ${command}`));
		}
	}
}

export class TestServiceClient implements ITestService {

	get onMarco(): Event<IMarcoPoloEvent> { return this.channel.listen('marco'); }

	constructor(private channel: IChannel) { }

	marco(): Promise<string> {
		return this.channel.call('marco');
	}

	pong(ping: string): Promise<{ incoming: string; outgoing: string }> {
		return this.channel.call('pong', ping);
	}

	cancelMe(): Promise<boolean> {
		return this.channel.call('cancelMe');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/request/common/request.ts]---
Location: vscode-main/src/vs/base/parts/request/common/request.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBufferReadableStream } from '../../../common/buffer.js';

const offlineName = 'Offline';

/**
 * Checks if the given error is offline error
 */
export function isOfflineError(error: unknown): boolean {
	if (error instanceof OfflineError) {
		return true;
	}
	return error instanceof Error && error.name === offlineName && error.message === offlineName;
}

export class OfflineError extends Error {
	constructor() {
		super(offlineName);
		this.name = this.message;
	}
}

export interface IHeaders {
	'Proxy-Authorization'?: string;
	'x-operation-id'?: string;
	'retry-after'?: string;
	etag?: string;
	'Content-Length'?: string;
	'activityid'?: string;
	'X-Market-User-Id'?: string;
	[header: string]: string | string[] | undefined;
}

export interface IRequestOptions {
	type?: string;
	url?: string;
	user?: string;
	password?: string;
	headers?: IHeaders;
	timeout?: number;
	data?: string;
	followRedirects?: number;
	proxyAuthorization?: string;
	/**
	 * A signal to not cache the response. This may not
	 * be supported in all implementations.
	 */
	disableCache?: boolean;
}

export interface IRequestContext {
	res: {
		headers: IHeaders;
		statusCode?: number;
	};
	stream: VSBufferReadableStream;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/request/common/requestImpl.ts]---
Location: vscode-main/src/vs/base/parts/request/common/requestImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { bufferToStream, VSBuffer } from '../../../common/buffer.js';
import { CancellationToken } from '../../../common/cancellation.js';
import { canceled } from '../../../common/errors.js';
import { IHeaders, IRequestContext, IRequestOptions, OfflineError } from './request.js';

export async function request(options: IRequestOptions, token: CancellationToken, isOnline?: () => boolean): Promise<IRequestContext> {
	if (token.isCancellationRequested) {
		throw canceled();
	}

	const cancellation = new AbortController();
	const disposable = token.onCancellationRequested(() => cancellation.abort());
	const signal = options.timeout ? AbortSignal.any([
		cancellation.signal,
		AbortSignal.timeout(options.timeout),
	]) : cancellation.signal;

	try {
		const fetchInit: RequestInit = {
			method: options.type || 'GET',
			headers: getRequestHeaders(options),
			body: options.data,
			signal
		};
		if (options.disableCache) {
			fetchInit.cache = 'no-store';
		}
		const res = await fetch(options.url || '', fetchInit);
		return {
			res: {
				statusCode: res.status,
				headers: getResponseHeaders(res),
			},
			stream: bufferToStream(VSBuffer.wrap(new Uint8Array(await res.arrayBuffer()))),
		};
	} catch (err) {
		if (isOnline && !isOnline()) {
			throw new OfflineError();
		}
		if (err?.name === 'AbortError') {
			throw canceled();
		}
		if (err?.name === 'TimeoutError') {
			throw new Error(`Fetch timeout: ${options.timeout}ms`);
		}
		throw err;
	} finally {
		disposable.dispose();
	}
}

function getRequestHeaders(options: IRequestOptions) {
	if (options.headers || options.user || options.password || options.proxyAuthorization) {
		const headers = new Headers();
		outer: for (const k in options.headers) {
			switch (k.toLowerCase()) {
				case 'user-agent':
				case 'accept-encoding':
				case 'content-length':
					// unsafe headers
					continue outer;
			}
			const header = options.headers[k];
			if (typeof header === 'string') {
				headers.set(k, header);
			} else if (Array.isArray(header)) {
				for (const h of header) {
					headers.append(k, h);
				}
			}
		}
		if (options.user || options.password) {
			headers.set('Authorization', 'Basic ' + btoa(`${options.user || ''}:${options.password || ''}`));
		}
		if (options.proxyAuthorization) {
			headers.set('Proxy-Authorization', options.proxyAuthorization);
		}
		return headers;
	}
	return undefined;
}

function getResponseHeaders(res: Response): IHeaders {
	const headers: IHeaders = Object.create(null);
	res.headers.forEach((value, key) => {
		if (headers[key]) {
			if (Array.isArray(headers[key])) {
				headers[key].push(value);
			} else {
				headers[key] = [headers[key], value];
			}
		} else {
			headers[key] = value;
		}
	});
	return headers;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/request/test/electron-main/request.test.ts]---
Location: vscode-main/src/vs/base/parts/request/test/electron-main/request.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as http from 'http';
import { AddressInfo } from 'net';
import assert from 'assert';
import { CancellationToken, CancellationTokenSource } from '../../../../common/cancellation.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../test/common/utils.js';
import { request } from '../../common/requestImpl.js';
import { streamToBuffer } from '../../../../common/buffer.js';
import { runWithFakedTimers } from '../../../../test/common/timeTravelScheduler.js';


suite('Request', () => {

	let port: number;
	let server: http.Server;

	setup(async () => {
		port = await new Promise<number>((resolvePort, rejectPort) => {
			server = http.createServer((req, res) => {
				if (req.url === '/noreply') {
					return; // never respond
				}
				res.setHeader('Content-Type', 'application/json');
				if (req.headers['echo-header']) {
					res.setHeader('echo-header', req.headers['echo-header']);
				}
				const data: Buffer[] = [];
				req.on('data', chunk => data.push(chunk));
				req.on('end', () => {
					res.end(JSON.stringify({
						method: req.method,
						url: req.url,
						data: Buffer.concat(data).toString()
					}));
				});
			}).listen(0, '127.0.0.1', () => {
				const address = server.address();
				resolvePort((address as AddressInfo).port);
			}).on('error', err => {
				rejectPort(err);
			});
		});
	});

	teardown(async () => {
		await new Promise<void>((resolve, reject) => {
			server.close(err => err ? reject(err) : resolve());
		});
	});

	test('GET', async () => {
		const context = await request({
			url: `http://127.0.0.1:${port}`,
			headers: {
				'echo-header': 'echo-value'
			}
		}, CancellationToken.None);
		assert.strictEqual(context.res.statusCode, 200);
		assert.strictEqual(context.res.headers['content-type'], 'application/json');
		assert.strictEqual(context.res.headers['echo-header'], 'echo-value');
		const buffer = await streamToBuffer(context.stream);
		const body = JSON.parse(buffer.toString());
		assert.strictEqual(body.method, 'GET');
		assert.strictEqual(body.url, '/');
	});

	test('POST', async () => {
		const context = await request({
			type: 'POST',
			url: `http://127.0.0.1:${port}/postpath`,
			data: 'Some data',
		}, CancellationToken.None);
		assert.strictEqual(context.res.statusCode, 200);
		assert.strictEqual(context.res.headers['content-type'], 'application/json');
		const buffer = await streamToBuffer(context.stream);
		const body = JSON.parse(buffer.toString());
		assert.strictEqual(body.method, 'POST');
		assert.strictEqual(body.url, '/postpath');
		assert.strictEqual(body.data, 'Some data');
	});

	test('timeout', async () => {
		return runWithFakedTimers({}, async () => {
			try {
				await request({
					type: 'GET',
					url: `http://127.0.0.1:${port}/noreply`,
					timeout: 123,
				}, CancellationToken.None);
				assert.fail('Should fail with timeout');
			} catch (err) {
				assert.strictEqual(err.message, 'Fetch timeout: 123ms');
			}
		});
	});

	test('cancel', async () => {
		return runWithFakedTimers({}, async () => {
			try {
				const source = new CancellationTokenSource();
				const res = request({
					type: 'GET',
					url: `http://127.0.0.1:${port}/noreply`,
				}, source.token);
				await new Promise(resolve => setTimeout(resolve, 100));
				source.cancel();
				await res;
				assert.fail('Should fail with cancellation');
			} catch (err) {
				assert.strictEqual(err.message, 'Canceled');
			}
		});
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/sandbox/common/electronTypes.ts]---
Location: vscode-main/src/vs/base/parts/sandbox/common/electronTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


// #######################################################################
// ###                                                                 ###
// ###      electron.d.ts types we need in a common layer for reuse    ###
// ###                    (copied from Electron 29.x)                  ###
// ###                                                                 ###
// #######################################################################

export interface MessageBoxOptions {
	/**
	 * Content of the message box.
	 */
	message: string;
	/**
	 * Can be `none`, `info`, `error`, `question` or `warning`. On Windows, `question`
	 * displays the same icon as `info`, unless you set an icon using the `icon`
	 * option. On macOS, both `warning` and `error` display the same warning icon.
	 */
	type?: ('none' | 'info' | 'error' | 'question' | 'warning');
	/**
	 * Array of texts for buttons. On Windows, an empty array will result in one button
	 * labeled "OK".
	 */
	buttons?: string[];
	/**
	 * Index of the button in the buttons array which will be selected by default when
	 * the message box opens.
	 */
	defaultId?: number;
	/**
	 * Pass an instance of AbortSignal to optionally close the message box, the message
	 * box will behave as if it was cancelled by the user. On macOS, `signal` does not
	 * work with message boxes that do not have a parent window, since those message
	 * boxes run synchronously due to platform limitations.
	 */
	signal?: AbortSignal;
	/**
	 * Title of the message box, some platforms will not show it.
	 */
	title?: string;
	/**
	 * Extra information of the message.
	 */
	detail?: string;
	/**
	 * If provided, the message box will include a checkbox with the given label.
	 */
	checkboxLabel?: string;
	/**
	 * Initial checked state of the checkbox. `false` by default.
	 */
	checkboxChecked?: boolean;
	/**
	 * Custom width of the text in the message box.
	 *
	 * @platform darwin
	 */
	textWidth?: number;
	/**
	 * The index of the button to be used to cancel the dialog, via the `Esc` key. By
	 * default this is assigned to the first button with "cancel" or "no" as the label.
	 * If no such labeled buttons exist and this option is not set, `0` will be used as
	 * the return value.
	 */
	cancelId?: number;
	/**
	 * On Windows Electron will try to figure out which one of the `buttons` are common
	 * buttons (like "Cancel" or "Yes"), and show the others as command links in the
	 * dialog. This can make the dialog appear in the style of modern Windows apps. If
	 * you don't like this behavior, you can set `noLink` to `true`.
	 */
	noLink?: boolean;
	/**
	 * Normalize the keyboard access keys across platforms. Default is `false`.
	 * Enabling this assumes `&` is used in the button labels for the placement of the
	 * keyboard shortcut access key and labels will be converted so they work correctly
	 * on each platform, `&` characters are removed on macOS, converted to `_` on
	 * Linux, and left untouched on Windows. For example, a button label of `Vie&w`
	 * will be converted to `Vie_w` on Linux and `View` on macOS and can be selected
	 * via `Alt-W` on Windows and Linux.
	 */
	normalizeAccessKeys?: boolean;
}

export interface MessageBoxReturnValue {
	/**
	 * The index of the clicked button.
	 */
	response: number;
	/**
	 * The checked state of the checkbox if `checkboxLabel` was set. Otherwise `false`.
	 */
	checkboxChecked: boolean;
}

export interface SaveDialogOptions {
	/**
	 * The dialog title. Cannot be displayed on some _Linux_ desktop environments.
	 */
	title?: string;
	/**
	 * Absolute directory path, absolute file path, or file name to use by default.
	 */
	defaultPath?: string;
	/**
	 * Custom label for the confirmation button, when left empty the default label will
	 * be used.
	 */
	buttonLabel?: string;
	filters?: FileFilter[];
	/**
	 * Message to display above text fields.
	 *
	 * @platform darwin
	 */
	message?: string;
	/**
	 * Custom label for the text displayed in front of the filename text field.
	 *
	 * @platform darwin
	 */
	nameFieldLabel?: string;
	/**
	 * Show the tags input box, defaults to `true`.
	 *
	 * @platform darwin
	 */
	showsTagField?: boolean;
	properties?: Array<'showHiddenFiles' | 'createDirectory' | 'treatPackageAsDirectory' | 'showOverwriteConfirmation' | 'dontAddToRecent'>;
	/**
	 * Create a security scoped bookmark when packaged for the Mac App Store. If this
	 * option is enabled and the file doesn't already exist a blank file will be
	 * created at the chosen path.
	 *
	 * @platform darwin,mas
	 */
	securityScopedBookmarks?: boolean;
}

export interface SaveDialogReturnValue {
	/**
	 * whether or not the dialog was canceled.
	 */
	canceled: boolean;
	/**
	 * If the dialog is canceled, this will be an empty string.
	 */
	filePath: string;
	/**
	 * Base64 encoded string which contains the security scoped bookmark data for the
	 * saved file. `securityScopedBookmarks` must be enabled for this to be present.
	 * (For return values, see table here.)
	 *
	 * @platform darwin,mas
	 */
	bookmark?: string;
}

export interface OpenDialogOptions {
	title?: string;
	defaultPath?: string;
	/**
	 * Custom label for the confirmation button, when left empty the default label will
	 * be used.
	 */
	buttonLabel?: string;
	filters?: FileFilter[];
	/**
	 * Contains which features the dialog should use. The following values are
	 * supported:
	 */
	properties?: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent'>;
	/**
	 * Message to display above input boxes.
	 *
	 * @platform darwin
	 */
	message?: string;
	/**
	 * Create security scoped bookmarks when packaged for the Mac App Store.
	 *
	 * @platform darwin,mas
	 */
	securityScopedBookmarks?: boolean;
}

export interface OpenDialogReturnValue {
	/**
	 * whether or not the dialog was canceled.
	 */
	canceled: boolean;
	/**
	 * An array of file paths chosen by the user. If the dialog is cancelled this will
	 * be an empty array.
	 */
	filePaths: string[];
	/**
	 * An array matching the `filePaths` array of base64 encoded strings which contains
	 * security scoped bookmark data. `securityScopedBookmarks` must be enabled for
	 * this to be populated. (For return values, see table here.)
	 *
	 * @platform darwin,mas
	 */
	bookmarks?: string[];
}

export interface FileFilter {

	// Docs: https://electronjs.org/docs/api/structures/file-filter

	extensions: string[];
	name: string;
}

export interface OpenDevToolsOptions {
	/**
	 * Opens the devtools with specified dock state, can be `left`, `right`, `bottom`,
	 * `undocked`, `detach`. Defaults to last used dock state. In `undocked` mode it's
	 * possible to dock back. In `detach` mode it's not.
	 */
	mode: ('left' | 'right' | 'bottom' | 'undocked' | 'detach');
	/**
	 * Whether to bring the opened devtools window to the foreground. The default is
	 * `true`.
	 */
	activate?: boolean;
	/**
	 * A title for the DevTools window (only in `undocked` or `detach` mode).
	 */
	title?: string;
}

interface InputEvent {

	// Docs: https://electronjs.org/docs/api/structures/input-event

	/**
	 * An array of modifiers of the event, can be `shift`, `control`, `ctrl`, `alt`,
	 * `meta`, `command`, `cmd`, `isKeypad`, `isAutoRepeat`, `leftButtonDown`,
	 * `middleButtonDown`, `rightButtonDown`, `capsLock`, `numLock`, `left`, `right`.
	 */
	modifiers?: Array<'shift' | 'control' | 'ctrl' | 'alt' | 'meta' | 'command' | 'cmd' | 'isKeypad' | 'isAutoRepeat' | 'leftButtonDown' | 'middleButtonDown' | 'rightButtonDown' | 'capsLock' | 'numLock' | 'left' | 'right'>;
	/**
	 * Can be `undefined`, `mouseDown`, `mouseUp`, `mouseMove`, `mouseEnter`,
	 * `mouseLeave`, `contextMenu`, `mouseWheel`, `rawKeyDown`, `keyDown`, `keyUp`,
	 * `char`, `gestureScrollBegin`, `gestureScrollEnd`, `gestureScrollUpdate`,
	 * `gestureFlingStart`, `gestureFlingCancel`, `gesturePinchBegin`,
	 * `gesturePinchEnd`, `gesturePinchUpdate`, `gestureTapDown`, `gestureShowPress`,
	 * `gestureTap`, `gestureTapCancel`, `gestureShortPress`, `gestureLongPress`,
	 * `gestureLongTap`, `gestureTwoFingerTap`, `gestureTapUnconfirmed`,
	 * `gestureDoubleTap`, `touchStart`, `touchMove`, `touchEnd`, `touchCancel`,
	 * `touchScrollStarted`, `pointerDown`, `pointerUp`, `pointerMove`,
	 * `pointerRawUpdate`, `pointerCancel` or `pointerCausedUaAction`.
	 */
	type: ('undefined' | 'mouseDown' | 'mouseUp' | 'mouseMove' | 'mouseEnter' | 'mouseLeave' | 'contextMenu' | 'mouseWheel' | 'rawKeyDown' | 'keyDown' | 'keyUp' | 'char' | 'gestureScrollBegin' | 'gestureScrollEnd' | 'gestureScrollUpdate' | 'gestureFlingStart' | 'gestureFlingCancel' | 'gesturePinchBegin' | 'gesturePinchEnd' | 'gesturePinchUpdate' | 'gestureTapDown' | 'gestureShowPress' | 'gestureTap' | 'gestureTapCancel' | 'gestureShortPress' | 'gestureLongPress' | 'gestureLongTap' | 'gestureTwoFingerTap' | 'gestureTapUnconfirmed' | 'gestureDoubleTap' | 'touchStart' | 'touchMove' | 'touchEnd' | 'touchCancel' | 'touchScrollStarted' | 'pointerDown' | 'pointerUp' | 'pointerMove' | 'pointerRawUpdate' | 'pointerCancel' | 'pointerCausedUaAction');
}

export interface MouseInputEvent extends InputEvent {

	// Docs: https://electronjs.org/docs/api/structures/mouse-input-event

	/**
	 * The button pressed, can be `left`, `middle`, `right`.
	 */
	button?: ('left' | 'middle' | 'right');
	clickCount?: number;
	globalX?: number;
	globalY?: number;
	movementX?: number;
	movementY?: number;
	/**
	 * The type of the event, can be `mouseDown`, `mouseUp`, `mouseEnter`,
	 * `mouseLeave`, `contextMenu`, `mouseWheel` or `mouseMove`.
	 */
	type: ('mouseDown' | 'mouseUp' | 'mouseEnter' | 'mouseLeave' | 'contextMenu' | 'mouseWheel' | 'mouseMove');
	x: number;
	y: number;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/sandbox/common/sandboxTypes.ts]---
Location: vscode-main/src/vs/base/parts/sandbox/common/sandboxTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IProcessEnvironment } from '../../../common/platform.js';
import { IProductConfiguration } from '../../../common/product.js';


// #######################################################################
// ###                                                                 ###
// ###             Types we need in a common layer for reuse    	   ###
// ###                                                                 ###
// #######################################################################


/**
 * The common properties required for any sandboxed
 * renderer to function.
 */
export interface ISandboxConfiguration {

	/**
	 * Identifier of the sandboxed renderer.
	 */
	windowId: number;

	/**
	 * Root path of the JavaScript sources.
	 *
	 * Note: This is NOT the installation root
	 * directory itself but contained in it at
	 * a level that is platform dependent.
	 */
	appRoot: string;

	/**
	 * Per window process environment.
	 */
	userEnv: IProcessEnvironment;

	/**
	 * Product configuration.
	 */
	product: IProductConfiguration;

	/**
	 * Configured zoom level.
	 */
	zoomLevel?: number;

	/**
	 * Location of V8 code cache.
	 */
	codeCachePath?: string;

	/**
	 * NLS support
	 */
	nls: {

		/**
		 * All NLS messages produced by `localize` and `localize2` calls
		 * under `src/vs`.
		 */
		messages: string[];

		/**
		 * The actual language of the NLS messages (e.g. 'en', de' or 'pt-br').
		 */
		language: string | undefined;
	};

	/**
	 * DEV time only: All CSS-modules that we have.
	 */
	cssModules?: string[];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/sandbox/electron-browser/electronTypes.ts]---
Location: vscode-main/src/vs/base/parts/sandbox/electron-browser/electronTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


// #######################################################################
// ###                                                                 ###
// ###      electron.d.ts types we expose from electron-browser        ###
// ###                    (copied from Electron 29.x)                  ###
// ###                                                                 ###
// #######################################################################

type Event<Params extends object = {}> = {
	preventDefault: () => void;
	readonly defaultPrevented: boolean;
} & Params;

export interface IpcRendererEvent extends Event {

	// Docs: https://electronjs.org/docs/api/structures/ipc-renderer-event

	// Note: API with `Transferable` intentionally commented out because you
	// cannot transfer these when `contextIsolation: true`.
	// /**
	//  * A list of MessagePorts that were transferred with this message
	//  */
	// ports: MessagePort[];
	/**
	 * The `IpcRenderer` instance that emitted the event originally
	 */
	sender: IpcRenderer;
}

export interface IpcRenderer {

	// Docs: https://electronjs.org/docs/api/ipc-renderer

	/**
	 * Resolves with the response from the main process.
	 *
	 * Send a message to the main process via `channel` and expect a result
	 * asynchronously. Arguments will be serialized with the Structured Clone
	 * Algorithm, just like `window.postMessage`, so prototype chains will not be
	 * included. Sending Functions, Promises, Symbols, WeakMaps, or WeakSets will throw
	 * an exception.
	 *
	 * The main process should listen for `channel` with `ipcMain.handle()`.
	 *
	 * For example:
	 *
	 * If you need to transfer a `MessagePort` to the main process, use
	 * `ipcRenderer.postMessage`.
	 *
	 * If you do not need a response to the message, consider using `ipcRenderer.send`.
	 *
	 * > **Note** Sending non-standard JavaScript types such as DOM objects or special
	 * Electron objects will throw an exception.
	 *
	 * Since the main process does not have support for DOM objects such as
	 * `ImageBitmap`, `File`, `DOMMatrix` and so on, such objects cannot be sent over
	 * Electron's IPC to the main process, as the main process would have no way to
	 * decode them. Attempting to send such objects over IPC will result in an error.
	 *
	 * > **Note** If the handler in the main process throws an error, the promise
	 * returned by `invoke` will reject. However, the `Error` object in the renderer
	 * process will not be the same as the one thrown in the main process.
	 */
	invoke(channel: string, ...args: unknown[]): Promise<unknown>;
	/**
	 * Listens to `channel`, when a new message arrives `listener` would be called with
	 * `listener(event, args...)`.
	 */
	on(channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void): this;
	/**
	 * Adds a one time `listener` function for the event. This `listener` is invoked
	 * only the next time a message is sent to `channel`, after which it is removed.
	 */
	once(channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void): this;
	// Note: API with `Transferable` intentionally commented out because you
	// cannot transfer these when `contextIsolation: true`.
	// /**
	//  * Send a message to the main process, optionally transferring ownership of zero or
	//  * more `MessagePort` objects.
	//  *
	//  * The transferred `MessagePort` objects will be available in the main process as
	//  * `MessagePortMain` objects by accessing the `ports` property of the emitted
	//  * event.
	//  *
	//  * For example:
	//  *
	//  * For more information on using `MessagePort` and `MessageChannel`, see the MDN
	//  * documentation.
	//  */
	// postMessage(channel: string, message: unknown, transfer?: MessagePort[]): void;
	/**
	 * Removes the specified `listener` from the listener array for the specified
	 * `channel`.
	 */
	removeListener(channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void): this;
	/**
	 * Send an asynchronous message to the main process via `channel`, along with
	 * arguments. Arguments will be serialized with the Structured Clone Algorithm,
	 * just like `window.postMessage`, so prototype chains will not be included.
	 * Sending Functions, Promises, Symbols, WeakMaps, or WeakSets will throw an
	 * exception.
	 *
	 * > **NOTE:** Sending non-standard JavaScript types such as DOM objects or special
	 * Electron objects will throw an exception.
	 *
	 * Since the main process does not have support for DOM objects such as
	 * `ImageBitmap`, `File`, `DOMMatrix` and so on, such objects cannot be sent over
	 * Electron's IPC to the main process, as the main process would have no way to
	 * decode them. Attempting to send such objects over IPC will result in an error.
	 *
	 * The main process handles it by listening for `channel` with the `ipcMain`
	 * module.
	 *
	 * If you need to transfer a `MessagePort` to the main process, use
	 * `ipcRenderer.postMessage`.
	 *
	 * If you want to receive a single response from the main process, like the result
	 * of a method call, consider using `ipcRenderer.invoke`.
	 */
	send(channel: string, ...args: unknown[]): void;
}

export interface WebFrame {
	/**
	 * Changes the zoom level to the specified level. The original size is 0 and each
	 * increment above or below represents zooming 20% larger or smaller to default
	 * limits of 300% and 50% of original size, respectively. The formula for this is
	 * `scale := 1.2 ^ level`.
	 *
	 * > **NOTE**: The zoom policy at the Chromium level is same-origin, meaning that
	 * the zoom level for a specific domain propagates across all instances of windows
	 * with the same domain. Differentiating the window URLs will make zoom work
	 * per-window.
	 */
	setZoomLevel(level: number): void;
}

export interface ProcessMemoryInfo {

	// Docs: https://electronjs.org/docs/api/structures/process-memory-info

	/**
	 * The amount of memory not shared by other processes, such as JS heap or HTML
	 * content in Kilobytes.
	 */
	private: number;
	/**
	 * The amount of memory currently pinned to actual physical RAM in Kilobytes.
	 *
	 * @platform linux,win32
	 */
	residentSet: number;
	/**
	 * The amount of memory shared between processes, typically memory consumed by the
	 * Electron code itself in Kilobytes.
	 */
	shared: number;
}

/**
 * Additional information around a `app.on('login')` event.
 */
export interface AuthInfo {
	isProxy: boolean;
	scheme: string;
	host: string;
	port: number;
	realm: string;
}

export interface WebUtils {

	// Docs: https://electronjs.org/docs/api/web-utils

	/**
	 * The file system path that this `File` object points to. In the case where the
	 * object passed in is not a `File` object an exception is thrown. In the case
	 * where the File object passed in was constructed in JS and is not backed by a
	 * file on disk an empty string is returned.
	 *
	 * This method superceded the previous augmentation to the `File` object with the
	 * `path` property.  An example is included below.
	 */
	getPathForFile(file: File): string;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/sandbox/electron-browser/globals.ts]---
Location: vscode-main/src/vs/base/parts/sandbox/electron-browser/globals.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { INodeProcess, IProcessEnvironment } from '../../../common/platform.js';
import { ISandboxConfiguration } from '../common/sandboxTypes.js';
import { IpcRenderer, ProcessMemoryInfo, WebFrame, WebUtils } from './electronTypes.js';

/**
 * In Electron renderers we cannot expose all of the `process` global of node.js
 */
export interface ISandboxNodeProcess extends INodeProcess {

	/**
	 * The process.platform property returns a string identifying the operating system platform
	 * on which the Node.js process is running.
	 */
	readonly platform: string;

	/**
	 * The process.arch property returns a string identifying the CPU architecture
	 * on which the Node.js process is running.
	 */
	readonly arch: string;

	/**
	 * The type will always be `renderer`.
	 */
	readonly type: string;

	/**
	 * A list of versions for the current node.js/electron configuration.
	 */
	readonly versions: { [key: string]: string | undefined };

	/**
	 * The process.env property returns an object containing the user environment.
	 */
	readonly env: IProcessEnvironment;

	/**
	 * The `execPath` will be the location of the executable of this application.
	 */
	readonly execPath: string;

	/**
	 * A listener on the process. Only a small subset of listener types are allowed.
	 */
	on: (type: string, callback: Function) => void;

	/**
	 * The current working directory of the process.
	 */
	cwd: () => string;

	/**
	 * Resolves with a ProcessMemoryInfo
	 *
	 * Returns an object giving memory usage statistics about the current process. Note
	 * that all statistics are reported in Kilobytes. This api should be called after
	 * app ready.
	 *
	 * Chromium does not provide `residentSet` value for macOS. This is because macOS
	 * performs in-memory compression of pages that haven't been recently used. As a
	 * result the resident set size value is not what one would expect. `private`
	 * memory is more representative of the actual pre-compression memory usage of the
	 * process on macOS.
	 */
	getProcessMemoryInfo: () => Promise<ProcessMemoryInfo>;

	/**
	 * Returns a process environment that includes all shell environment variables even if
	 * the application was not started from a shell / terminal / console.
	 *
	 * There are different layers of environment that will apply:
	 * - `process.env`: this is the actual environment of the process before this method
	 * - `shellEnv`   : if the program was not started from a terminal, we resolve all shell
	 *                  variables to get the same experience as if the program was started from
	 *                  a terminal (Linux, macOS)
	 * - `userEnv`    : this is instance specific environment, e.g. if the user started the program
	 *                  from a terminal and changed certain variables
	 *
	 * The order of overwrites is `process.env` < `shellEnv` < `userEnv`.
	 */
	shellEnv(): Promise<IProcessEnvironment>;
}

export interface IpcMessagePort {

	/**
	 * Acquire a `MessagePort`. The main process will transfer the port over to
	 * the `responseChannel` with a payload of `requestNonce` so that the source can
	 * correlate the response.
	 *
	 * The source should install a `window.on('message')` listener, ensuring `e.data`
	 * matches `nonce`, `e.source` matches `window` and then receiving the `MessagePort`
	 * via `e.ports[0]`.
	 */
	acquire(responseChannel: string, nonce: string): void;
}

export interface ISandboxContext {

	/**
	 * A configuration object made accessible from the main side
	 * to configure the sandbox browser window. Will be `undefined`
	 * for as long as `resolveConfiguration` is not awaited.
	 */
	configuration(): ISandboxConfiguration | undefined;

	/**
	 * Allows to await the resolution of the configuration object.
	 */
	resolveConfiguration(): Promise<ISandboxConfiguration>;
}

interface ISandboxGlobal {
	vscode: {
		readonly ipcRenderer: IpcRenderer;
		readonly ipcMessagePort: IpcMessagePort;
		readonly webFrame: WebFrame;
		readonly process: ISandboxNodeProcess;
		readonly context: ISandboxContext;
		readonly webUtils: WebUtils;
	};
}

const vscodeGlobal = (globalThis as unknown as ISandboxGlobal).vscode;
export const ipcRenderer: IpcRenderer = vscodeGlobal.ipcRenderer;
export const ipcMessagePort: IpcMessagePort = vscodeGlobal.ipcMessagePort;
export const webFrame: WebFrame = vscodeGlobal.webFrame;
export const process: ISandboxNodeProcess = vscodeGlobal.process;
export const context: ISandboxContext = vscodeGlobal.context;
export const webUtils: WebUtils = vscodeGlobal.webUtils;

/**
 * A set of globals only available to main windows that depend
 * on `preload.js`.
 */
export interface IMainWindowSandboxGlobals {
	readonly ipcRenderer: IpcRenderer;
	readonly ipcMessagePort: IpcMessagePort;
	readonly webFrame: WebFrame;
	readonly process: ISandboxNodeProcess;
	readonly context: ISandboxContext;
	readonly webUtils: WebUtils;
}

/**
 * A set of globals that are available in all windows that either
 * depend on `preload.js` or `preload-aux.js`.
 */
export interface ISandboxGlobals {
	readonly ipcRenderer: Pick<import('./electronTypes.js').IpcRenderer, 'send' | 'invoke'>;
	readonly webFrame: import('./electronTypes.js').WebFrame;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/sandbox/electron-browser/preload-aux.ts]---
Location: vscode-main/src/vs/base/parts/sandbox/electron-browser/preload-aux.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

(function () {

	const { ipcRenderer, webFrame, contextBridge } = require('electron');

	function validateIPC(channel: string): true | never {
		if (!channel?.startsWith('vscode:')) {
			throw new Error(`Unsupported event IPC channel '${channel}'`);
		}

		return true;
	}

	const globals = {

		/**
		 * A minimal set of methods exposed from Electron's `ipcRenderer`
		 * to support communication to main process.
		 */
		ipcRenderer: {

			send(channel: string, ...args: unknown[]): void {
				if (validateIPC(channel)) {
					ipcRenderer.send(channel, ...args);
				}
			},

			invoke(channel: string, ...args: unknown[]): Promise<unknown> {
				validateIPC(channel);

				return ipcRenderer.invoke(channel, ...args);
			}
		},

		/**
		 * Support for subset of methods of Electron's `webFrame` type.
		 */
		webFrame: {

			setZoomLevel(level: number): void {
				if (typeof level === 'number') {
					webFrame.setZoomLevel(level);
				}
			}
		}
	};

	try {
		contextBridge.exposeInMainWorld('vscode', globals);
	} catch (error) {
		console.error(error);
	}
}());
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/sandbox/electron-browser/preload.ts]---
Location: vscode-main/src/vs/base/parts/sandbox/electron-browser/preload.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable no-restricted-globals */

(function () {

	const { ipcRenderer, webFrame, contextBridge, webUtils } = require('electron');

	type ISandboxConfiguration = import('../common/sandboxTypes.js').ISandboxConfiguration;

	//#region Utilities

	function validateIPC(channel: string): true | never {
		if (!channel?.startsWith('vscode:')) {
			throw new Error(`Unsupported event IPC channel '${channel}'`);
		}

		return true;
	}

	function parseArgv(key: string): string | undefined {
		for (const arg of process.argv) {
			if (arg.indexOf(`--${key}=`) === 0) {
				return arg.split('=')[1];
			}
		}

		return undefined;
	}

	//#endregion

	//#region Resolve Configuration

	let configuration: ISandboxConfiguration | undefined = undefined;

	const resolveConfiguration: Promise<ISandboxConfiguration> = (async () => {
		const windowConfigIpcChannel = parseArgv('vscode-window-config');
		if (!windowConfigIpcChannel) {
			throw new Error('Preload: did not find expected vscode-window-config in renderer process arguments list.');
		}

		try {
			validateIPC(windowConfigIpcChannel);

			// Resolve configuration from electron-main
			const resolvedConfiguration: ISandboxConfiguration = configuration = await ipcRenderer.invoke(windowConfigIpcChannel);

			// Apply `userEnv` directly
			Object.assign(process.env, resolvedConfiguration.userEnv);

			// Apply zoom level early before even building the
			// window DOM elements to avoid UI flicker. We always
			// have to set the zoom level from within the window
			// because Chrome has it's own way of remembering zoom
			// settings per origin (if vscode-file:// is used) and
			// we want to ensure that the user configuration wins.
			webFrame.setZoomLevel(resolvedConfiguration.zoomLevel ?? 0);

			return resolvedConfiguration;
		} catch (error) {
			throw new Error(`Preload: unable to fetch vscode-window-config: ${error}`);
		}
	})();

	//#endregion

	//#region Resolve Shell Environment

	/**
	 * If VSCode is not run from a terminal, we should resolve additional
	 * shell specific environment from the OS shell to ensure we are seeing
	 * all development related environment variables. We do this from the
	 * main process because it may involve spawning a shell.
	 */
	const resolveShellEnv: Promise<typeof process.env> = (async () => {

		// Resolve `userEnv` from configuration and
		// `shellEnv` from the main side
		const [userEnv, shellEnv] = await Promise.all([
			(async () => (await resolveConfiguration).userEnv)(),
			ipcRenderer.invoke('vscode:fetchShellEnv')
		]);

		return { ...process.env, ...shellEnv, ...userEnv };
	})();

	//#endregion

	//#region Globals Definition

	// #######################################################################
	// ###                                                                 ###
	// ###       !!! DO NOT USE GET/SET PROPERTIES ANYWHERE HERE !!!       ###
	// ###       !!!  UNLESS THE ACCESS IS WITHOUT SIDE EFFECTS  !!!       ###
	// ###       (https://github.com/electron/electron/issues/25516)       ###
	// ###                                                                 ###
	// #######################################################################

	const globals = {

		/**
		 * A minimal set of methods exposed from Electron's `ipcRenderer`
		 * to support communication to main process.
		 */

		ipcRenderer: {

			send(channel: string, ...args: unknown[]): void {
				if (validateIPC(channel)) {
					ipcRenderer.send(channel, ...args);
				}
			},

			invoke(channel: string, ...args: unknown[]): Promise<unknown> {
				validateIPC(channel);

				return ipcRenderer.invoke(channel, ...args);
			},

			on(channel: string, listener: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void) {
				validateIPC(channel);

				ipcRenderer.on(channel, listener);

				return this;
			},

			once(channel: string, listener: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void) {
				validateIPC(channel);

				ipcRenderer.once(channel, listener);

				return this;
			},

			removeListener(channel: string, listener: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void) {
				validateIPC(channel);

				ipcRenderer.removeListener(channel, listener);

				return this;
			}
		},

		ipcMessagePort: {

			acquire(responseChannel: string, nonce: string) {
				if (validateIPC(responseChannel)) {
					const responseListener = (e: Electron.IpcRendererEvent, responseNonce: string) => {
						// validate that the nonce from the response is the same
						// as when requested. and if so, use `postMessage` to
						// send the `MessagePort` safely over, even when context
						// isolation is enabled
						if (nonce === responseNonce) {
							ipcRenderer.off(responseChannel, responseListener);
							window.postMessage(nonce, '*', e.ports);
						}
					};

					// handle reply from main
					ipcRenderer.on(responseChannel, responseListener);
				}
			}
		},

		/**
		 * Support for subset of methods of Electron's `webFrame` type.
		 */
		webFrame: {

			setZoomLevel(level: number): void {
				if (typeof level === 'number') {
					webFrame.setZoomLevel(level);
				}
			}
		},

		/**
		 * Support for subset of Electron's `webUtils` type.
		 */
		webUtils: {

			getPathForFile(file: File): string {
				return webUtils.getPathForFile(file);
			}
		},

		/**
		 * Support for a subset of access to node.js global `process`.
		 *
		 * Note: when `sandbox` is enabled, the only properties available
		 * are https://github.com/electron/electron/blob/master/docs/api/process.md#sandbox
		 */
		process: {
			get platform() { return process.platform; },
			get arch() { return process.arch; },
			get env() { return { ...process.env }; },
			get versions() { return process.versions; },
			get type() { return 'renderer'; },
			get execPath() { return process.execPath; },

			cwd(): string {
				return process.env['VSCODE_CWD'] || process.execPath.substr(0, process.execPath.lastIndexOf(process.platform === 'win32' ? '\\' : '/'));
			},

			shellEnv(): Promise<typeof process.env> {
				return resolveShellEnv;
			},

			getProcessMemoryInfo(): Promise<Electron.ProcessMemoryInfo> {
				return process.getProcessMemoryInfo();
			},

			on(type: string, callback: (...args: unknown[]) => void): void {
				process.on(type, callback);
			}
		},

		/**
		 * Some information about the context we are running in.
		 */
		context: {

			/**
			 * A configuration object made accessible from the main side
			 * to configure the sandbox browser window.
			 *
			 * Note: intentionally not using a getter here because the
			 * actual value will be set after `resolveConfiguration`
			 * has finished.
			 */
			configuration(): ISandboxConfiguration | undefined {
				return configuration;
			},

			/**
			 * Allows to await the resolution of the configuration object.
			 */
			async resolveConfiguration(): Promise<ISandboxConfiguration> {
				return resolveConfiguration;
			}
		}
	};

	try {
		// Use `contextBridge` APIs to expose globals to VSCode
		contextBridge.exposeInMainWorld('vscode', globals);
	} catch (error) {
		console.error(error);
	}
}());
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/sandbox/node/electronTypes.ts]---
Location: vscode-main/src/vs/base/parts/sandbox/node/electronTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface MessagePortMain extends NodeJS.EventEmitter {

	// Docs: https://electronjs.org/docs/api/message-port-main

	/**
	 * Emitted when the remote end of a MessagePortMain object becomes disconnected.
	 */
	on(event: 'close', listener: Function): this;
	off(event: 'close', listener: Function): this;
	once(event: 'close', listener: Function): this;
	addListener(event: 'close', listener: Function): this;
	removeListener(event: 'close', listener: Function): this;
	/**
	 * Emitted when a MessagePortMain object receives a message.
	 */
	on(event: 'message', listener: (messageEvent: MessageEvent) => void): this;
	off(event: 'message', listener: (messageEvent: MessageEvent) => void): this;
	once(event: 'message', listener: (messageEvent: MessageEvent) => void): this;
	addListener(event: 'message', listener: (messageEvent: MessageEvent) => void): this;
	removeListener(event: 'message', listener: (messageEvent: MessageEvent) => void): this;
	/**
	 * Disconnects the port, so it is no longer active.
	 */
	close(): void;
	/**
	 * Sends a message from the port, and optionally, transfers ownership of objects to
	 * other browsing contexts.
	 */
	postMessage(message: unknown, transfer?: MessagePortMain[]): void;
	/**
	 * Starts the sending of messages queued on the port. Messages will be queued until
	 * this method is called.
	 */
	start(): void;
}

export interface MessageEvent {
	data: unknown;
	ports: MessagePortMain[];
}

export interface ParentPort extends NodeJS.EventEmitter {

	// Docs: https://electronjs.org/docs/api/parent-port

	/**
	 * Emitted when the process receives a message. Messages received on this port will
	 * be queued up until a handler is registered for this event.
	 */
	on(event: 'message', listener: (messageEvent: MessageEvent) => void): this;
	off(event: 'message', listener: (messageEvent: MessageEvent) => void): this;
	once(event: 'message', listener: (messageEvent: MessageEvent) => void): this;
	addListener(event: 'message', listener: (messageEvent: MessageEvent) => void): this;
	removeListener(event: 'message', listener: (messageEvent: MessageEvent) => void): this;
	/**
	 * Sends a message from the process to its parent.
	 */
	postMessage(message: unknown): void;
}

export interface UtilityNodeJSProcess extends NodeJS.Process {

	/**
	 * A `Electron.ParentPort` property if this is a `UtilityProcess` (or `null`
	 * otherwise) allowing communication with the parent process.
	 */
	parentPort: ParentPort;
}

export function isUtilityProcess(process: NodeJS.Process): process is UtilityNodeJSProcess {
	return !!(process as UtilityNodeJSProcess).parentPort;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/sandbox/test/electron-browser/globals.test.ts]---
Location: vscode-main/src/vs/base/parts/sandbox/test/electron-browser/globals.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ipcRenderer, process, webFrame, webUtils } from '../../electron-browser/globals.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../test/common/utils.js';

suite('Sandbox', () => {

	test('globals', async () => {
		assert.ok(typeof ipcRenderer.send === 'function');
		assert.ok(typeof webFrame.setZoomLevel === 'function');
		assert.ok(typeof process.platform === 'string');
		assert.ok(typeof webUtils.getPathForFile === 'function');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/storage/common/storage.ts]---
Location: vscode-main/src/vs/base/parts/storage/common/storage.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ThrottledDelayer } from '../../../common/async.js';
import { Event, PauseableEmitter } from '../../../common/event.js';
import { Disposable, IDisposable } from '../../../common/lifecycle.js';
import { parse, stringify } from '../../../common/marshalling.js';
import { isObject, isUndefinedOrNull } from '../../../common/types.js';

export enum StorageHint {

	// A hint to the storage that the storage
	// does not exist on disk yet. This allows
	// the storage library to improve startup
	// time by not checking the storage for data.
	STORAGE_DOES_NOT_EXIST,

	// A hint to the storage that the storage
	// is backed by an in-memory storage.
	STORAGE_IN_MEMORY
}

export interface IStorageOptions {
	readonly hint?: StorageHint;
}

export interface IUpdateRequest {
	readonly insert?: Map<string, string>;
	readonly delete?: Set<string>;
}

export interface IStorageItemsChangeEvent {
	readonly changed?: Map<string, string>;
	readonly deleted?: Set<string>;
}

export function isStorageItemsChangeEvent(thing: unknown): thing is IStorageItemsChangeEvent {
	const candidate = thing as IStorageItemsChangeEvent | undefined;

	return candidate?.changed instanceof Map || candidate?.deleted instanceof Set;
}

export interface IStorageDatabase {

	readonly onDidChangeItemsExternal: Event<IStorageItemsChangeEvent>;

	getItems(): Promise<Map<string, string>>;
	updateItems(request: IUpdateRequest): Promise<void>;

	optimize(): Promise<void>;

	close(recovery?: () => Map<string, string>): Promise<void>;
}

export interface IStorageChangeEvent {

	/**
	 * The `key` of the storage entry that was changed
	 * or was removed.
	 */
	readonly key: string;

	/**
	 * A hint how the storage change event was triggered. If
	 * `true`, the storage change was triggered by an external
	 * source, such as:
	 * - another process (for example another window)
	 * - operations such as settings sync or profiles change
	 */
	readonly external?: boolean;
}

export type StorageValue = string | boolean | number | undefined | null | object;

export interface IStorage extends IDisposable {

	readonly onDidChangeStorage: Event<IStorageChangeEvent>;

	readonly items: Map<string, string>;
	readonly size: number;

	init(): Promise<void>;

	get(key: string, fallbackValue: string): string;
	get(key: string, fallbackValue?: string): string | undefined;

	getBoolean(key: string, fallbackValue: boolean): boolean;
	getBoolean(key: string, fallbackValue?: boolean): boolean | undefined;

	getNumber(key: string, fallbackValue: number): number;
	getNumber(key: string, fallbackValue?: number): number | undefined;

	getObject<T extends object>(key: string, fallbackValue: T): T;
	getObject<T extends object>(key: string, fallbackValue?: T): T | undefined;

	set(key: string, value: StorageValue, external?: boolean): Promise<void>;
	delete(key: string, external?: boolean): Promise<void>;

	flush(delay?: number): Promise<void>;
	whenFlushed(): Promise<void>;

	optimize(): Promise<void>;

	close(): Promise<void>;
}

export enum StorageState {
	None,
	Initialized,
	Closed
}

export class Storage extends Disposable implements IStorage {

	private static readonly DEFAULT_FLUSH_DELAY = 100;

	private readonly _onDidChangeStorage = this._register(new PauseableEmitter<IStorageChangeEvent>());
	readonly onDidChangeStorage = this._onDidChangeStorage.event;

	private state = StorageState.None;

	private cache = new Map<string, string>();

	private readonly flushDelayer = this._register(new ThrottledDelayer<void>(Storage.DEFAULT_FLUSH_DELAY));

	private pendingDeletes = new Set<string>();
	private pendingInserts = new Map<string, string>();

	private pendingClose: Promise<void> | undefined = undefined;

	private readonly whenFlushedCallbacks: Function[] = [];

	constructor(
		protected readonly database: IStorageDatabase,
		private readonly options: IStorageOptions = Object.create(null)
	) {
		super();

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.database.onDidChangeItemsExternal(e => this.onDidChangeItemsExternal(e)));
	}

	private onDidChangeItemsExternal(e: IStorageItemsChangeEvent): void {
		this._onDidChangeStorage.pause();

		try {
			// items that change external require us to update our
			// caches with the values. we just accept the value and
			// emit an event if there is a change.

			e.changed?.forEach((value, key) => this.acceptExternal(key, value));
			e.deleted?.forEach(key => this.acceptExternal(key, undefined));

		} finally {
			this._onDidChangeStorage.resume();
		}
	}

	private acceptExternal(key: string, value: string | undefined): void {
		if (this.state === StorageState.Closed) {
			return; // Return early if we are already closed
		}

		let changed = false;

		// Item got removed, check for deletion
		if (isUndefinedOrNull(value)) {
			changed = this.cache.delete(key);
		}

		// Item got updated, check for change
		else {
			const currentValue = this.cache.get(key);
			if (currentValue !== value) {
				this.cache.set(key, value);
				changed = true;
			}
		}

		// Signal to outside listeners
		if (changed) {
			this._onDidChangeStorage.fire({ key, external: true });
		}
	}

	get items(): Map<string, string> {
		return this.cache;
	}

	get size(): number {
		return this.cache.size;
	}

	async init(): Promise<void> {
		if (this.state !== StorageState.None) {
			return; // either closed or already initialized
		}

		this.state = StorageState.Initialized;

		if (this.options.hint === StorageHint.STORAGE_DOES_NOT_EXIST) {
			// return early if we know the storage file does not exist. this is a performance
			// optimization to not load all items of the underlying storage if we know that
			// there can be no items because the storage does not exist.
			return;
		}

		this.cache = await this.database.getItems();
	}

	get(key: string, fallbackValue: string): string;
	get(key: string, fallbackValue?: string): string | undefined;
	get(key: string, fallbackValue?: string): string | undefined {
		const value = this.cache.get(key);

		if (isUndefinedOrNull(value)) {
			return fallbackValue;
		}

		return value;
	}

	getBoolean(key: string, fallbackValue: boolean): boolean;
	getBoolean(key: string, fallbackValue?: boolean): boolean | undefined;
	getBoolean(key: string, fallbackValue?: boolean): boolean | undefined {
		const value = this.get(key);

		if (isUndefinedOrNull(value)) {
			return fallbackValue;
		}

		return value === 'true';
	}

	getNumber(key: string, fallbackValue: number): number;
	getNumber(key: string, fallbackValue?: number): number | undefined;
	getNumber(key: string, fallbackValue?: number): number | undefined {
		const value = this.get(key);

		if (isUndefinedOrNull(value)) {
			return fallbackValue;
		}

		return parseInt(value, 10);
	}

	getObject(key: string, fallbackValue: object): object;
	getObject(key: string, fallbackValue?: object | undefined): object | undefined;
	getObject(key: string, fallbackValue?: object): object | undefined {
		const value = this.get(key);

		if (isUndefinedOrNull(value)) {
			return fallbackValue;
		}

		return parse(value);
	}

	async set(key: string, value: string | boolean | number | null | undefined | object, external = false): Promise<void> {
		if (this.state === StorageState.Closed) {
			return; // Return early if we are already closed
		}

		// We remove the key for undefined/null values
		if (isUndefinedOrNull(value)) {
			return this.delete(key, external);
		}

		// Otherwise, convert to String and store
		const valueStr = isObject(value) || Array.isArray(value) ? stringify(value) : String(value);

		// Return early if value already set
		const currentValue = this.cache.get(key);
		if (currentValue === valueStr) {
			return;
		}

		// Update in cache and pending
		this.cache.set(key, valueStr);
		this.pendingInserts.set(key, valueStr);
		this.pendingDeletes.delete(key);

		// Event
		this._onDidChangeStorage.fire({ key, external });

		// Accumulate work by scheduling after timeout
		return this.doFlush();
	}

	async delete(key: string, external = false): Promise<void> {
		if (this.state === StorageState.Closed) {
			return; // Return early if we are already closed
		}

		// Remove from cache and add to pending
		const wasDeleted = this.cache.delete(key);
		if (!wasDeleted) {
			return; // Return early if value already deleted
		}

		if (!this.pendingDeletes.has(key)) {
			this.pendingDeletes.add(key);
		}

		this.pendingInserts.delete(key);

		// Event
		this._onDidChangeStorage.fire({ key, external });

		// Accumulate work by scheduling after timeout
		return this.doFlush();
	}

	async optimize(): Promise<void> {
		if (this.state === StorageState.Closed) {
			return; // Return early if we are already closed
		}

		// Await pending data to be flushed to the DB
		// before attempting to optimize the DB
		await this.flush(0);

		return this.database.optimize();
	}

	async close(): Promise<void> {
		if (!this.pendingClose) {
			this.pendingClose = this.doClose();
		}

		return this.pendingClose;
	}

	private async doClose(): Promise<void> {

		// Update state
		this.state = StorageState.Closed;

		// Trigger new flush to ensure data is persisted and then close
		// even if there is an error flushing. We must always ensure
		// the DB is closed to avoid corruption.
		//
		// Recovery: we pass our cache over as recovery option in case
		// the DB is not healthy.
		try {
			await this.doFlush(0 /* as soon as possible */);
		} catch {
			// Ignore
		}

		await this.database.close(() => this.cache);
	}

	private get hasPending() {
		return this.pendingInserts.size > 0 || this.pendingDeletes.size > 0;
	}

	private async flushPending(): Promise<void> {
		if (!this.hasPending) {
			return; // return early if nothing to do
		}

		// Get pending data
		const updateRequest: IUpdateRequest = { insert: this.pendingInserts, delete: this.pendingDeletes };

		// Reset pending data for next run
		this.pendingDeletes = new Set<string>();
		this.pendingInserts = new Map<string, string>();

		// Update in storage and release any
		// waiters we have once done
		return this.database.updateItems(updateRequest).finally(() => {
			if (!this.hasPending) {
				while (this.whenFlushedCallbacks.length) {
					this.whenFlushedCallbacks.pop()?.();
				}
			}
		});
	}

	async flush(delay?: number): Promise<void> {
		if (
			this.state === StorageState.Closed || 	// Return early if we are already closed
			this.pendingClose 						// return early if nothing to do
		) {
			return;
		}

		return this.doFlush(delay);
	}

	private async doFlush(delay?: number): Promise<void> {
		if (this.options.hint === StorageHint.STORAGE_IN_MEMORY) {
			return this.flushPending(); // return early if in-memory
		}

		return this.flushDelayer.trigger(() => this.flushPending(), delay);
	}

	async whenFlushed(): Promise<void> {
		if (!this.hasPending) {
			return; // return early if nothing to do
		}

		return new Promise(resolve => this.whenFlushedCallbacks.push(resolve));
	}

	isInMemory(): boolean {
		return this.options.hint === StorageHint.STORAGE_IN_MEMORY;
	}
}

export class InMemoryStorageDatabase implements IStorageDatabase {

	readonly onDidChangeItemsExternal = Event.None;

	private readonly items = new Map<string, string>();

	async getItems(): Promise<Map<string, string>> {
		return this.items;
	}

	async updateItems(request: IUpdateRequest): Promise<void> {
		request.insert?.forEach((value, key) => this.items.set(key, value));

		request.delete?.forEach(key => this.items.delete(key));
	}

	async optimize(): Promise<void> { }
	async close(): Promise<void> { }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/parts/storage/node/storage.ts]---
Location: vscode-main/src/vs/base/parts/storage/node/storage.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import { timeout } from '../../../common/async.js';
import { Event } from '../../../common/event.js';
import { mapToString, setToString } from '../../../common/map.js';
import { basename } from '../../../common/path.js';
import { Promises } from '../../../node/pfs.js';
import { IStorageDatabase, IStorageItemsChangeEvent, IUpdateRequest } from '../common/storage.js';
import type { Database, Statement } from '@vscode/sqlite3';

interface IDatabaseConnection {
	readonly db: Database;
	readonly isInMemory: boolean;

	isErroneous?: boolean;
	lastError?: string;
}

export interface ISQLiteStorageDatabaseOptions {
	readonly logging?: ISQLiteStorageDatabaseLoggingOptions;
}

export interface ISQLiteStorageDatabaseLoggingOptions {
	logError?: (error: string | Error) => void;
	logTrace?: (msg: string) => void;
}

export class SQLiteStorageDatabase implements IStorageDatabase {

	static readonly IN_MEMORY_PATH = ':memory:';

	get onDidChangeItemsExternal(): Event<IStorageItemsChangeEvent> { return Event.None; } // since we are the only client, there can be no external changes

	private static readonly BUSY_OPEN_TIMEOUT = 2000; // timeout in ms to retry when opening DB fails with SQLITE_BUSY
	private static readonly MAX_HOST_PARAMETERS = 256; // maximum number of parameters within a statement

	private readonly name: string;

	private readonly logger: SQLiteStorageDatabaseLogger;

	private readonly whenConnected: Promise<IDatabaseConnection>;

	constructor(
		private readonly path: string,
		options: ISQLiteStorageDatabaseOptions = Object.create(null)
	) {
		this.name = basename(this.path);
		this.logger = new SQLiteStorageDatabaseLogger(options.logging);
		this.whenConnected = this.connect(this.path);
	}

	async getItems(): Promise<Map<string, string>> {
		const connection = await this.whenConnected;

		const items = new Map<string, string>();

		const rows = await this.all(connection, 'SELECT * FROM ItemTable');
		rows.forEach(row => items.set(row.key, row.value));

		if (this.logger.isTracing) {
			this.logger.trace(`[storage ${this.name}] getItems(): ${items.size} rows`);
		}

		return items;
	}

	async updateItems(request: IUpdateRequest): Promise<void> {
		const connection = await this.whenConnected;

		return this.doUpdateItems(connection, request);
	}

	private doUpdateItems(connection: IDatabaseConnection, request: IUpdateRequest): Promise<void> {
		if (this.logger.isTracing) {
			this.logger.trace(`[storage ${this.name}] updateItems(): insert(${request.insert ? mapToString(request.insert) : '0'}), delete(${request.delete ? setToString(request.delete) : '0'})`);
		}

		return this.transaction(connection, () => {
			const toInsert = request.insert;
			const toDelete = request.delete;

			// INSERT
			if (toInsert && toInsert.size > 0) {
				const keysValuesChunks: (string[])[] = [];
				keysValuesChunks.push([]); // seed with initial empty chunk

				// Split key/values into chunks of SQLiteStorageDatabase.MAX_HOST_PARAMETERS
				// so that we can efficiently run the INSERT with as many HOST parameters as possible
				let currentChunkIndex = 0;
				toInsert.forEach((value, key) => {
					let keyValueChunk = keysValuesChunks[currentChunkIndex];

					if (keyValueChunk.length > SQLiteStorageDatabase.MAX_HOST_PARAMETERS) {
						currentChunkIndex++;
						keyValueChunk = [];
						keysValuesChunks.push(keyValueChunk);
					}

					keyValueChunk.push(key, value);
				});

				keysValuesChunks.forEach(keysValuesChunk => {
					this.prepare(connection, `INSERT INTO ItemTable VALUES ${new Array(keysValuesChunk.length / 2).fill('(?,?)').join(',')} ON CONFLICT (key) DO UPDATE SET value = excluded.value WHERE value != excluded.value`, stmt => stmt.run(keysValuesChunk), () => {
						const keys: string[] = [];
						let length = 0;
						toInsert.forEach((value, key) => {
							keys.push(key);
							length += value.length;
						});

						return `Keys: ${keys.join(', ')} Length: ${length}`;
					});
				});
			}

			// DELETE
			if (toDelete?.size) {
				const keysChunks: (string[])[] = [];
				keysChunks.push([]); // seed with initial empty chunk

				// Split keys into chunks of SQLiteStorageDatabase.MAX_HOST_PARAMETERS
				// so that we can efficiently run the DELETE with as many HOST parameters
				// as possible
				let currentChunkIndex = 0;
				toDelete.forEach(key => {
					let keyChunk = keysChunks[currentChunkIndex];

					if (keyChunk.length > SQLiteStorageDatabase.MAX_HOST_PARAMETERS) {
						currentChunkIndex++;
						keyChunk = [];
						keysChunks.push(keyChunk);
					}

					keyChunk.push(key);
				});

				keysChunks.forEach(keysChunk => {
					this.prepare(connection, `DELETE FROM ItemTable WHERE key IN (${new Array(keysChunk.length).fill('?').join(',')})`, stmt => stmt.run(keysChunk), () => {
						const keys: string[] = [];
						toDelete.forEach(key => {
							keys.push(key);
						});

						return `Keys: ${keys.join(', ')}`;
					});
				});
			}
		});
	}

	async optimize(): Promise<void> {
		this.logger.trace(`[storage ${this.name}] vacuum()`);

		const connection = await this.whenConnected;

		return this.exec(connection, 'VACUUM');
	}

	async close(recovery?: () => Map<string, string>): Promise<void> {
		this.logger.trace(`[storage ${this.name}] close()`);

		const connection = await this.whenConnected;

		return this.doClose(connection, recovery);
	}

	private doClose(connection: IDatabaseConnection, recovery?: () => Map<string, string>): Promise<void> {
		return new Promise((resolve, reject) => {
			connection.db.close(closeError => {
				if (closeError) {
					this.handleSQLiteError(connection, `[storage ${this.name}] close(): ${closeError}`);
				}

				// Return early if this storage was created only in-memory
				// e.g. when running tests we do not need to backup.
				if (this.path === SQLiteStorageDatabase.IN_MEMORY_PATH) {
					return resolve();
				}

				// If the DB closed successfully and we are not running in-memory
				// and the DB did not get errors during runtime, make a backup
				// of the DB so that we can use it as fallback in case the actual
				// DB becomes corrupt in the future.
				if (!connection.isErroneous && !connection.isInMemory) {
					return this.backup().then(resolve, error => {
						this.logger.error(`[storage ${this.name}] backup(): ${error}`);

						return resolve(); // ignore failing backup
					});
				}

				// Recovery: if we detected errors while using the DB or we are using
				// an inmemory DB (as a fallback to not being able to open the DB initially)
				// and we have a recovery function provided, we recreate the DB with this
				// data to recover all known data without loss if possible.
				if (typeof recovery === 'function') {

					// Delete the existing DB. If the path does not exist or fails to
					// be deleted, we do not try to recover anymore because we assume
					// that the path is no longer writeable for us.
					return fs.promises.unlink(this.path).then(() => {

						// Re-open the DB fresh
						return this.doConnect(this.path).then(recoveryConnection => {
							const closeRecoveryConnection = () => {
								return this.doClose(recoveryConnection, undefined /* do not attempt to recover again */);
							};

							// Store items
							return this.doUpdateItems(recoveryConnection, { insert: recovery() }).then(() => closeRecoveryConnection(), error => {

								// In case of an error updating items, still ensure to close the connection
								// to prevent SQLITE_BUSY errors when the connection is reestablished
								closeRecoveryConnection();

								return Promise.reject(error);
							});
						});
					}).then(resolve, reject);
				}

				// Finally without recovery we just reject
				return reject(closeError || new Error('Database has errors or is in-memory without recovery option'));
			});
		});
	}

	private backup(): Promise<void> {
		const backupPath = this.toBackupPath(this.path);

		return Promises.copy(this.path, backupPath, { preserveSymlinks: false });
	}

	private toBackupPath(path: string): string {
		return `${path}.backup`;
	}

	async checkIntegrity(full: boolean): Promise<string> {
		this.logger.trace(`[storage ${this.name}] checkIntegrity(full: ${full})`);

		const connection = await this.whenConnected;
		const row = await this.get(connection, full ? 'PRAGMA integrity_check' : 'PRAGMA quick_check');

		const integrity = full ? (row as { integrity_check: string }).integrity_check : (row as { quick_check: string }).quick_check;

		if (connection.isErroneous) {
			return `${integrity} (last error: ${connection.lastError})`;
		}

		if (connection.isInMemory) {
			return `${integrity} (in-memory!)`;
		}

		return integrity;
	}

	private async connect(path: string, retryOnBusy = true): Promise<IDatabaseConnection> {
		this.logger.trace(`[storage ${this.name}] open(${path}, retryOnBusy: ${retryOnBusy})`);

		try {
			return await this.doConnect(path);
		} catch (error) {
			this.logger.error(`[storage ${this.name}] open(): Unable to open DB due to ${error}`);

			// SQLITE_BUSY should only arise if another process is locking the same DB we want
			// to open at that time. This typically never happens because a DB connection is
			// limited per window. However, in the event of a window reload, it may be possible
			// that the previous connection was not properly closed while the new connection is
			// already established.
			//
			// In this case we simply wait for some time and retry once to establish the connection.
			//
			if (error.code === 'SQLITE_BUSY' && retryOnBusy) {
				await timeout(SQLiteStorageDatabase.BUSY_OPEN_TIMEOUT);

				return this.connect(path, false /* not another retry */);
			}

			// Otherwise, best we can do is to recover from a backup if that exists, as such we
			// move the DB to a different filename and try to load from backup. If that fails,
			// a new empty DB is being created automatically.
			//
			// The final fallback is to use an in-memory DB which should only happen if the target
			// folder is really not writeable for us.
			//
			try {
				await fs.promises.unlink(path);
				try {
					await Promises.rename(this.toBackupPath(path), path, false /* no retry */);
				} catch {
					// ignore
				}

				return await this.doConnect(path);
			} catch (error) {
				this.logger.error(`[storage ${this.name}] open(): Unable to use backup due to ${error}`);

				// In case of any error to open the DB, use an in-memory
				// DB so that we always have a valid DB to talk to.
				return this.doConnect(SQLiteStorageDatabase.IN_MEMORY_PATH);
			}
		}
	}

	private handleSQLiteError(connection: IDatabaseConnection, msg: string): void {
		connection.isErroneous = true;
		connection.lastError = msg;

		this.logger.error(msg);
	}

	private doConnect(path: string): Promise<IDatabaseConnection> {
		return new Promise((resolve, reject) => {
			import('@vscode/sqlite3').then(sqlite3 => {
				const ctor = (this.logger.isTracing ? sqlite3.default.verbose().Database : sqlite3.default.Database);
				const connection: IDatabaseConnection = {
					db: new ctor(path, (error: (Error & { code?: string }) | null) => {
						if (error) {
							return (connection.db && error.code !== 'SQLITE_CANTOPEN' /* https://github.com/TryGhost/node-sqlite3/issues/1617 */) ? connection.db.close(() => reject(error)) : reject(error);
						}

						// The following exec() statement serves two purposes:
						// - create the DB if it does not exist yet
						// - validate that the DB is not corrupt (the open() call does not throw otherwise)
						return this.exec(connection, [
							'PRAGMA user_version = 1;',
							'CREATE TABLE IF NOT EXISTS ItemTable (key TEXT UNIQUE ON CONFLICT REPLACE, value BLOB)'
						].join('')).then(() => {
							return resolve(connection);
						}, error => {
							return connection.db.close(() => reject(error));
						});
					}),
					isInMemory: path === SQLiteStorageDatabase.IN_MEMORY_PATH
				};

				// Errors
				connection.db.on('error', error => this.handleSQLiteError(connection, `[storage ${this.name}] Error (event): ${error}`));

				// Tracing
				if (this.logger.isTracing) {
					connection.db.on('trace', sql => this.logger.trace(`[storage ${this.name}] Trace (event): ${sql}`));
				}
			}, reject);
		});
	}

	private exec(connection: IDatabaseConnection, sql: string): Promise<void> {
		return new Promise((resolve, reject) => {
			connection.db.exec(sql, error => {
				if (error) {
					this.handleSQLiteError(connection, `[storage ${this.name}] exec(): ${error}`);

					return reject(error);
				}

				return resolve();
			});
		});
	}

	private get(connection: IDatabaseConnection, sql: string): Promise<object> {
		return new Promise((resolve, reject) => {
			connection.db.get(sql, (error, row) => {
				if (error) {
					this.handleSQLiteError(connection, `[storage ${this.name}] get(): ${error}`);

					return reject(error);
				}

				return resolve(row);
			});
		});
	}

	private all(connection: IDatabaseConnection, sql: string): Promise<{ key: string; value: string }[]> {
		return new Promise((resolve, reject) => {
			connection.db.all(sql, (error, rows) => {
				if (error) {
					this.handleSQLiteError(connection, `[storage ${this.name}] all(): ${error}`);

					return reject(error);
				}

				return resolve(rows);
			});
		});
	}

	private transaction(connection: IDatabaseConnection, transactions: () => void): Promise<void> {
		return new Promise((resolve, reject) => {
			connection.db.serialize(() => {
				connection.db.run('BEGIN TRANSACTION');

				transactions();

				connection.db.run('END TRANSACTION', error => {
					if (error) {
						this.handleSQLiteError(connection, `[storage ${this.name}] transaction(): ${error}`);

						return reject(error);
					}

					return resolve();
				});
			});
		});
	}

	private prepare(connection: IDatabaseConnection, sql: string, runCallback: (stmt: Statement) => void, errorDetails: () => string): void {
		const stmt = connection.db.prepare(sql);

		const statementErrorListener = (error: Error) => {
			this.handleSQLiteError(connection, `[storage ${this.name}] prepare(): ${error} (${sql}). Details: ${errorDetails()}`);
		};

		stmt.on('error', statementErrorListener);

		runCallback(stmt);

		stmt.finalize(error => {
			if (error) {
				statementErrorListener(error);
			}

			stmt.removeListener('error', statementErrorListener);
		});
	}
}

class SQLiteStorageDatabaseLogger {

	// to reduce lots of output, require an environment variable to enable tracing
	// this helps when running with --verbose normally where the storage tracing
	// might hide useful output to look at
	private static readonly VSCODE_TRACE_STORAGE = 'VSCODE_TRACE_STORAGE';

	private readonly logTrace: ((msg: string) => void) | undefined;
	private readonly logError: ((error: string | Error) => void) | undefined;

	constructor(options?: ISQLiteStorageDatabaseLoggingOptions) {
		if (options && typeof options.logTrace === 'function' && process.env[SQLiteStorageDatabaseLogger.VSCODE_TRACE_STORAGE]) {
			this.logTrace = options.logTrace;
		}

		if (options && typeof options.logError === 'function') {
			this.logError = options.logError;
		}
	}

	get isTracing(): boolean {
		return !!this.logTrace;
	}

	trace(msg: string): void {
		this.logTrace?.(msg);
	}

	error(error: string | Error): void {
		this.logError?.(error);
	}
}
```

--------------------------------------------------------------------------------

````
