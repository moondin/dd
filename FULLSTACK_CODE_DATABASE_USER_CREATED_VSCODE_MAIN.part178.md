---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 178
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 178 of 552)

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

---[FILE: src/vs/base/common/yaml.ts]---
Location: vscode-main/src/vs/base/common/yaml.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Parses a simplified YAML-like input from a single string.
 * Supports objects, arrays, primitive types (string, number, boolean, null).
 * Tracks positions for error reporting and node locations.
 *
 * Limitations:
 * - No multi-line strings or block literals
 * - No anchors or references
 * - No complex types (dates, binary)
 * - No special handling for escape sequences in strings
 * - Indentation must be consistent (spaces only, no tabs)
 *
 * Notes:
 * - New line separators can be either "\n" or "\r\n". The input string is split into lines internally.
 *
 * @param input A string containing the YAML-like input
 * @param errors Array to collect parsing errors
 * @param options Parsing options
 * @returns The parsed representation (ObjectNode, ArrayNode, or primitive node)
 */
export function parse(input: string, errors: YamlParseError[] = [], options: ParseOptions = {}): YamlNode | undefined {
	// Normalize both LF and CRLF by splitting on either; CR characters are not retained as part of line text.
	// This keeps the existing line/character based lexer logic intact.
	const lines = input.length === 0 ? [] : input.split(/\r\n|\n/);
	const parser = new YamlParser(lines, errors, options);
	return parser.parse();
}

export interface YamlParseError {
	readonly message: string;
	readonly start: Position;
	readonly end: Position;
	readonly code: string;
}

export interface ParseOptions {
	readonly allowDuplicateKeys?: boolean;
}

export interface Position {
	readonly line: number;
	readonly character: number;
}

export interface YamlStringNode {
	readonly type: 'string';
	readonly value: string;
	readonly start: Position;
	readonly end: Position;
}

export interface YamlNumberNode {
	readonly type: 'number';
	readonly value: number;
	readonly start: Position;
	readonly end: Position;
}

export interface YamlBooleanNode {
	readonly type: 'boolean';
	readonly value: boolean;
	readonly start: Position;
	readonly end: Position;
}

export interface YamlNullNode {
	readonly type: 'null';
	readonly value: null;
	readonly start: Position;
	readonly end: Position;
}

export interface YamlObjectNode {
	readonly type: 'object';
	readonly properties: { key: YamlStringNode; value: YamlNode }[];
	readonly start: Position;
	readonly end: Position;
}

export interface YamlArrayNode {
	readonly type: 'array';
	readonly items: YamlNode[];
	readonly start: Position;
	readonly end: Position;
}

export type YamlNode = YamlStringNode | YamlNumberNode | YamlBooleanNode | YamlNullNode | YamlObjectNode | YamlArrayNode;

// Helper functions for position and node creation
function createPosition(line: number, character: number): Position {
	return { line, character };
}

// Specialized node creation functions using a more concise approach
function createStringNode(value: string, start: Position, end: Position): YamlStringNode {
	return { type: 'string', value, start, end };
}

function createNumberNode(value: number, start: Position, end: Position): YamlNumberNode {
	return { type: 'number', value, start, end };
}

function createBooleanNode(value: boolean, start: Position, end: Position): YamlBooleanNode {
	return { type: 'boolean', value, start, end };
}

function createNullNode(start: Position, end: Position): YamlNullNode {
	return { type: 'null', value: null, start, end };
}

function createObjectNode(properties: { key: YamlStringNode; value: YamlNode }[], start: Position, end: Position): YamlObjectNode {
	return { type: 'object', start, end, properties };
}

function createArrayNode(items: YamlNode[], start: Position, end: Position): YamlArrayNode {
	return { type: 'array', start, end, items };
}

// Utility functions for parsing
function isWhitespace(char: string): boolean {
	return char === ' ' || char === '\t';
}

// Simplified number validation using regex
function isValidNumber(value: string): boolean {
	return /^-?\d*\.?\d+$/.test(value);
}

// Lexer/Tokenizer for YAML content
class YamlLexer {
	private lines: string[];
	private currentLine: number = 0;
	private currentChar: number = 0;

	constructor(lines: string[]) {
		this.lines = lines;
	}

	getCurrentPosition(): Position {
		return createPosition(this.currentLine, this.currentChar);
	}

	getCurrentLineNumber(): number {
		return this.currentLine;
	}

	getCurrentCharNumber(): number {
		return this.currentChar;
	}

	getCurrentLineText(): string {
		return this.currentLine < this.lines.length ? this.lines[this.currentLine] : '';
	}

	savePosition(): { line: number; char: number } {
		return { line: this.currentLine, char: this.currentChar };
	}

	restorePosition(pos: { line: number; char: number }): void {
		this.currentLine = pos.line;
		this.currentChar = pos.char;
	}

	isAtEnd(): boolean {
		return this.currentLine >= this.lines.length;
	}

	getCurrentChar(): string {
		if (this.isAtEnd() || this.currentChar >= this.lines[this.currentLine].length) {
			return '';
		}
		return this.lines[this.currentLine][this.currentChar];
	}

	peek(offset: number = 1): string {
		const newChar = this.currentChar + offset;
		if (this.currentLine >= this.lines.length || newChar >= this.lines[this.currentLine].length) {
			return '';
		}
		return this.lines[this.currentLine][newChar];
	}

	advance(): string {
		const char = this.getCurrentChar();
		if (this.currentChar >= this.lines[this.currentLine].length && this.currentLine < this.lines.length - 1) {
			this.currentLine++;
			this.currentChar = 0;
		} else {
			this.currentChar++;
		}
		return char;
	}

	advanceLine(): void {
		this.currentLine++;
		this.currentChar = 0;
	}

	skipWhitespace(): void {
		while (!this.isAtEnd() && this.currentChar < this.lines[this.currentLine].length && isWhitespace(this.getCurrentChar())) {
			this.advance();
		}
	}

	skipToEndOfLine(): void {
		this.currentChar = this.lines[this.currentLine].length;
	}

	getIndentation(): number {
		if (this.isAtEnd()) {
			return 0;
		}
		let indent = 0;
		for (let i = 0; i < this.lines[this.currentLine].length; i++) {
			if (this.lines[this.currentLine][i] === ' ') {
				indent++;
			} else if (this.lines[this.currentLine][i] === '\t') {
				indent += 4; // Treat tab as 4 spaces
			} else {
				break;
			}
		}
		return indent;
	}

	moveToNextNonEmptyLine(): void {
		while (this.currentLine < this.lines.length) {
			// First check current line from current position
			if (this.currentChar < this.lines[this.currentLine].length) {
				const remainingLine = this.lines[this.currentLine].substring(this.currentChar).trim();
				if (remainingLine.length > 0 && !remainingLine.startsWith('#')) {
					this.skipWhitespace();
					return;
				}
			}

			// Move to next line and check from beginning
			this.currentLine++;
			this.currentChar = 0;

			if (this.currentLine < this.lines.length) {
				const line = this.lines[this.currentLine].trim();
				if (line.length > 0 && !line.startsWith('#')) {
					this.skipWhitespace();
					return;
				}
			}
		}
	}
}

// Parser class for handling YAML parsing
class YamlParser {
	private lexer: YamlLexer;
	private errors: YamlParseError[];
	private options: ParseOptions;
	// Track nesting level of flow (inline) collections '[' ']' '{' '}'
	private flowLevel: number = 0;

	constructor(lines: string[], errors: YamlParseError[], options: ParseOptions) {
		this.lexer = new YamlLexer(lines);
		this.errors = errors;
		this.options = options;
	}

	addError(message: string, code: string, start: Position, end: Position): void {
		this.errors.push({ message, code, start, end });
	}

	parseValue(expectedIndent?: number): YamlNode {
		this.lexer.skipWhitespace();

		if (this.lexer.isAtEnd()) {
			const pos = this.lexer.getCurrentPosition();
			return createStringNode('', pos, pos);
		}

		const char = this.lexer.getCurrentChar();

		// Handle quoted strings
		if (char === '"' || char === `'`) {
			return this.parseQuotedString(char);
		}

		// Handle inline arrays
		if (char === '[') {
			return this.parseInlineArray();
		}

		// Handle inline objects
		if (char === '{') {
			return this.parseInlineObject();
		}

		// Handle unquoted values
		return this.parseUnquotedValue();
	}

	parseQuotedString(quote: string): YamlNode {
		const start = this.lexer.getCurrentPosition();
		this.lexer.advance(); // Skip opening quote

		let value = '';
		while (!this.lexer.isAtEnd() && this.lexer.getCurrentChar() !== '' && this.lexer.getCurrentChar() !== quote) {
			value += this.lexer.advance();
		}

		if (this.lexer.getCurrentChar() === quote) {
			this.lexer.advance(); // Skip closing quote
		}

		const end = this.lexer.getCurrentPosition();
		return createStringNode(value, start, end);
	}

	parseUnquotedValue(): YamlNode {
		const start = this.lexer.getCurrentPosition();
		let value = '';
		let endPos = start;

		// Helper function to check for value terminators
		const isTerminator = (char: string): boolean => {
			if (char === '#') { return true; }
			// Comma, ']' and '}' only terminate inside flow collections
			if (this.flowLevel > 0 && (char === ',' || char === ']' || char === '}')) { return true; }
			return false;
		};

		// Handle opening quote that might not be closed
		const firstChar = this.lexer.getCurrentChar();
		if (firstChar === '"' || firstChar === `'`) {
			value += this.lexer.advance();
			endPos = this.lexer.getCurrentPosition();
			while (!this.lexer.isAtEnd() && this.lexer.getCurrentChar() !== '') {
				const char = this.lexer.getCurrentChar();
				if (char === firstChar || isTerminator(char)) {
					break;
				}
				value += this.lexer.advance();
				endPos = this.lexer.getCurrentPosition();
			}
		} else {
			while (!this.lexer.isAtEnd() && this.lexer.getCurrentChar() !== '') {
				const char = this.lexer.getCurrentChar();
				if (isTerminator(char)) {
					break;
				}
				value += this.lexer.advance();
				endPos = this.lexer.getCurrentPosition();
			}
		}
		const trimmed = value.trimEnd();
		const diff = value.length - trimmed.length;
		if (diff) {
			endPos = createPosition(start.line, endPos.character - diff);
		}
		const finalValue = (firstChar === '"' || firstChar === `'`) ? trimmed.substring(1) : trimmed;
		return this.createValueNode(finalValue, start, endPos);
	}

	private createValueNode(value: string, start: Position, end: Position): YamlNode {
		if (value === '') {
			return createStringNode('', start, start);
		}

		// Boolean values
		if (value === 'true') {
			return createBooleanNode(true, start, end);
		}
		if (value === 'false') {
			return createBooleanNode(false, start, end);
		}

		// Null values
		if (value === 'null' || value === '~') {
			return createNullNode(start, end);
		}

		// Number values
		const numberValue = Number(value);
		if (!isNaN(numberValue) && isFinite(numberValue) && isValidNumber(value)) {
			return createNumberNode(numberValue, start, end);
		}

		// Default to string
		return createStringNode(value, start, end);
	}

	parseInlineArray(): YamlArrayNode {
		const start = this.lexer.getCurrentPosition();
		this.lexer.advance(); // Skip '['
		this.flowLevel++;

		const items: YamlNode[] = [];

		while (!this.lexer.isAtEnd()) {
			this.lexer.skipWhitespace();

			// Handle end of array
			if (this.lexer.getCurrentChar() === ']') {
				this.lexer.advance();
				break;
			}

			// Handle end of line - continue to next line for multi-line arrays
			if (this.lexer.getCurrentChar() === '') {
				this.lexer.advanceLine();
				continue;
			}

			// Handle comments - comments should terminate the array parsing
			if (this.lexer.getCurrentChar() === '#') {
				// Skip the rest of the line (comment)
				this.lexer.skipToEndOfLine();
				this.lexer.advanceLine();
				continue;
			}

			// Save position before parsing to detect if we're making progress
			const positionBefore = this.lexer.savePosition();

			// Parse array item
			const item = this.parseValue();
			// Skip implicit empty items that arise from a leading comma at the beginning of a new line
			// (e.g. a line starting with ",foo" after a comment). A legitimate empty string element
			// would have quotes and thus a non-zero span. We only filter zero-length spans.
			if (!(item.type === 'string' && item.value === '' && item.start.line === item.end.line && item.start.character === item.end.character)) {
				items.push(item);
			}

			// Check if we made progress - if not, we're likely stuck
			const positionAfter = this.lexer.savePosition();
			if (positionBefore.line === positionAfter.line && positionBefore.char === positionAfter.char) {
				// No progress made, advance at least one character to prevent infinite loop
				if (!this.lexer.isAtEnd() && this.lexer.getCurrentChar() !== '') {
					this.lexer.advance();
				} else {
					break;
				}
			}

			this.lexer.skipWhitespace();

			// Handle comma separator
			if (this.lexer.getCurrentChar() === ',') {
				this.lexer.advance();
			}
		}

		const end = this.lexer.getCurrentPosition();
		this.flowLevel--;
		return createArrayNode(items, start, end);
	}

	parseInlineObject(): YamlObjectNode {
		const start = this.lexer.getCurrentPosition();
		this.lexer.advance(); // Skip '{'
		this.flowLevel++;

		const properties: { key: YamlStringNode; value: YamlNode }[] = [];

		while (!this.lexer.isAtEnd()) {
			this.lexer.skipWhitespace();

			// Handle end of object
			if (this.lexer.getCurrentChar() === '}') {
				this.lexer.advance();
				break;
			}

			// Handle comments - comments should terminate the object parsing
			if (this.lexer.getCurrentChar() === '#') {
				// Skip the rest of the line (comment)
				this.lexer.skipToEndOfLine();
				this.lexer.advanceLine();
				continue;
			}

			// Save position before parsing to detect if we're making progress
			const positionBefore = this.lexer.savePosition();

			// Parse key - read until colon
			const keyStart = this.lexer.getCurrentPosition();
			let keyValue = '';

			// Handle quoted keys
			if (this.lexer.getCurrentChar() === '"' || this.lexer.getCurrentChar() === `'`) {
				const quote = this.lexer.getCurrentChar();
				this.lexer.advance(); // Skip opening quote

				while (!this.lexer.isAtEnd() && this.lexer.getCurrentChar() !== '' && this.lexer.getCurrentChar() !== quote) {
					keyValue += this.lexer.advance();
				}

				if (this.lexer.getCurrentChar() === quote) {
					this.lexer.advance(); // Skip closing quote
				}
			} else {
				// Handle unquoted keys - read until colon
				while (!this.lexer.isAtEnd() && this.lexer.getCurrentChar() !== '' && this.lexer.getCurrentChar() !== ':') {
					keyValue += this.lexer.advance();
				}
			}

			keyValue = keyValue.trim();
			const keyEnd = this.lexer.getCurrentPosition();
			const key = createStringNode(keyValue, keyStart, keyEnd);

			this.lexer.skipWhitespace();

			// Expect colon
			if (this.lexer.getCurrentChar() === ':') {
				this.lexer.advance();
			}

			this.lexer.skipWhitespace();

			// Parse value
			const value = this.parseValue();

			properties.push({ key, value });

			// Check if we made progress - if not, we're likely stuck
			const positionAfter = this.lexer.savePosition();
			if (positionBefore.line === positionAfter.line && positionBefore.char === positionAfter.char) {
				// No progress made, advance at least one character to prevent infinite loop
				if (!this.lexer.isAtEnd() && this.lexer.getCurrentChar() !== '') {
					this.lexer.advance();
				} else {
					break;
				}
			}

			this.lexer.skipWhitespace();

			// Handle comma separator
			if (this.lexer.getCurrentChar() === ',') {
				this.lexer.advance();
			}
		}

		const end = this.lexer.getCurrentPosition();
		this.flowLevel--;
		return createObjectNode(properties, start, end);
	}

	parseBlockArray(baseIndent: number): YamlArrayNode {
		const start = this.lexer.getCurrentPosition();
		const items: YamlNode[] = [];

		while (!this.lexer.isAtEnd()) {
			this.lexer.moveToNextNonEmptyLine();

			if (this.lexer.isAtEnd()) {
				break;
			}

			const currentIndent = this.lexer.getIndentation();

			// If indentation is less than expected, we're done with this array
			if (currentIndent < baseIndent) {
				break;
			}

			this.lexer.skipWhitespace();

			// Check for array item marker
			if (this.lexer.getCurrentChar() === '-') {
				this.lexer.advance(); // Skip '-'
				this.lexer.skipWhitespace();

				const itemStart = this.lexer.getCurrentPosition();

				// Check if this is a nested structure
				if (this.lexer.getCurrentChar() === '' || this.lexer.getCurrentChar() === '#') {
					// Empty item - check if next lines form a nested structure
					this.lexer.advanceLine();

					if (!this.lexer.isAtEnd()) {
						const nextIndent = this.lexer.getIndentation();

						if (nextIndent > currentIndent) {
							// Check if the next line starts with a dash (nested array) or has properties (nested object)
							this.lexer.skipWhitespace();
							if (this.lexer.getCurrentChar() === '-') {
								// It's a nested array
								const nestedArray = this.parseBlockArray(nextIndent);
								items.push(nestedArray);
							} else {
								// Check if it looks like an object property (has a colon)
								const currentLine = this.lexer.getCurrentLineText();
								const currentPos = this.lexer.getCurrentCharNumber();
								const remainingLine = currentLine.substring(currentPos);

								if (remainingLine.includes(':') && !remainingLine.trim().startsWith('#')) {
									// It's a nested object
									const nestedObject = this.parseBlockObject(nextIndent, this.lexer.getCurrentCharNumber());
									items.push(nestedObject);
								} else {
									// Not a nested structure, create empty string
									items.push(createStringNode('', itemStart, itemStart));
								}
							}
						} else {
							// No nested content, empty item
							items.push(createStringNode('', itemStart, itemStart));
						}
					} else {
						// End of input, empty item
						items.push(createStringNode('', itemStart, itemStart));
					}
				} else {
					// Parse the item value
					// Check if this is a multi-line object by looking for a colon and checking next lines
					const currentLine = this.lexer.getCurrentLineText();
					const currentPos = this.lexer.getCurrentCharNumber();
					const remainingLine = currentLine.substring(currentPos);

					// Check if there's a colon on this line (indicating object properties)
					const hasColon = remainingLine.includes(':');

					if (hasColon) {
						// Any line with a colon should be treated as an object
						// Parse as an object with the current item's indentation as the base
						const item = this.parseBlockObject(itemStart.character, itemStart.character);
						items.push(item);
					} else {
						// No colon, parse as regular value
						const item = this.parseValue();
						items.push(item);

						// Skip to end of line
						while (!this.lexer.isAtEnd() && this.lexer.getCurrentChar() !== '' && this.lexer.getCurrentChar() !== '#') {
							this.lexer.advance();
						}
						this.lexer.advanceLine();
					}
				}
			} else {
				// No dash found at expected indent level, break
				break;
			}
		}

		// Calculate end position based on the last item
		let end = start;
		if (items.length > 0) {
			const lastItem = items[items.length - 1];
			end = lastItem.end;
		} else {
			// If no items, end is right after the start
			end = createPosition(start.line, start.character + 1);
		}

		return createArrayNode(items, start, end);
	}

	parseBlockObject(baseIndent: number, baseCharPosition?: number): YamlObjectNode {
		const start = this.lexer.getCurrentPosition();
		const properties: { key: YamlStringNode; value: YamlNode }[] = [];
		const localKeysSeen = new Set<string>();

		// For parsing from current position (inline object parsing)
		const fromCurrentPosition = baseCharPosition !== undefined;
		let firstIteration = true;

		while (!this.lexer.isAtEnd()) {
			if (!firstIteration || !fromCurrentPosition) {
				this.lexer.moveToNextNonEmptyLine();
			}
			firstIteration = false;

			if (this.lexer.isAtEnd()) {
				break;
			}

			const currentIndent = this.lexer.getIndentation();

			if (fromCurrentPosition) {
				// For current position parsing, check character position alignment
				this.lexer.skipWhitespace();
				const currentCharPosition = this.lexer.getCurrentCharNumber();

				if (currentCharPosition < baseCharPosition) {
					break;
				}
			} else {
				// For normal block parsing, check indentation level
				if (currentIndent < baseIndent) {
					break;
				}

				// Check for incorrect indentation
				if (currentIndent > baseIndent) {
					const lineStart = createPosition(this.lexer.getCurrentLineNumber(), 0);
					const lineEnd = createPosition(this.lexer.getCurrentLineNumber(), this.lexer.getCurrentLineText().length);
					this.addError('Unexpected indentation', 'indentation', lineStart, lineEnd);

					// Try to recover by treating it as a property anyway
					this.lexer.skipWhitespace();
				} else {
					this.lexer.skipWhitespace();
				}
			}

			// Parse key
			const keyStart = this.lexer.getCurrentPosition();
			let keyValue = '';

			while (!this.lexer.isAtEnd() && this.lexer.getCurrentChar() !== '' && this.lexer.getCurrentChar() !== ':') {
				keyValue += this.lexer.advance();
			}

			keyValue = keyValue.trim();
			const keyEnd = this.lexer.getCurrentPosition();
			const key = createStringNode(keyValue, keyStart, keyEnd);

			// Check for duplicate keys
			if (!this.options.allowDuplicateKeys && localKeysSeen.has(keyValue)) {
				this.addError(`Duplicate key '${keyValue}'`, 'duplicateKey', keyStart, keyEnd);
			}
			localKeysSeen.add(keyValue);

			// Expect colon
			if (this.lexer.getCurrentChar() === ':') {
				this.lexer.advance();
			}

			this.lexer.skipWhitespace();

			// Determine if value is on same line or next line(s)
			let value: YamlNode;
			const valueStart = this.lexer.getCurrentPosition();

			if (this.lexer.getCurrentChar() === '' || this.lexer.getCurrentChar() === '#') {
				// Value is on next line(s) or empty
				this.lexer.advanceLine();

				// Check next line for nested content
				if (!this.lexer.isAtEnd()) {
					const nextIndent = this.lexer.getIndentation();

					if (nextIndent > currentIndent) {
						// Nested content - determine if it's an object, array, or just a scalar value
						this.lexer.skipWhitespace();

						if (this.lexer.getCurrentChar() === '-') {
							value = this.parseBlockArray(nextIndent);
						} else {
							// Check if this looks like an object property (has a colon)
							const currentLine = this.lexer.getCurrentLineText();
							const currentPos = this.lexer.getCurrentCharNumber();
							const remainingLine = currentLine.substring(currentPos);

							if (remainingLine.includes(':') && !remainingLine.trim().startsWith('#')) {
								// It's a nested object
								value = this.parseBlockObject(nextIndent);
							} else {
								// It's just a scalar value on the next line
								value = this.parseValue();
							}
						}
					} else if (!fromCurrentPosition && nextIndent === currentIndent) {
						// Same indentation level - check if it's an array item
						this.lexer.skipWhitespace();

						if (this.lexer.getCurrentChar() === '-') {
							value = this.parseBlockArray(currentIndent);
						} else {
							value = createStringNode('', valueStart, valueStart);
						}
					} else {
						value = createStringNode('', valueStart, valueStart);
					}
				} else {
					value = createStringNode('', valueStart, valueStart);
				}
			} else {
				// Value is on the same line
				value = this.parseValue();

				// Skip any remaining content on this line (comments, etc.)
				while (!this.lexer.isAtEnd() && this.lexer.getCurrentChar() !== '' && this.lexer.getCurrentChar() !== '#') {
					if (isWhitespace(this.lexer.getCurrentChar())) {
						this.lexer.advance();
					} else {
						break;
					}
				}

				// Skip to end of line if we hit a comment
				if (this.lexer.getCurrentChar() === '#') {
					this.lexer.skipToEndOfLine();
				}

				// Move to next line for next iteration
				if (!this.lexer.isAtEnd() && this.lexer.getCurrentChar() === '') {
					this.lexer.advanceLine();
				}
			}

			properties.push({ key, value });
		}

		// Calculate the end position based on the last property
		let end = start;
		if (properties.length > 0) {
			const lastProperty = properties[properties.length - 1];
			end = lastProperty.value.end;
		}

		return createObjectNode(properties, start, end);
	}

	parse(): YamlNode | undefined {
		if (this.lexer.isAtEnd()) {
			return undefined;
		}

		this.lexer.moveToNextNonEmptyLine();

		if (this.lexer.isAtEnd()) {
			return undefined;
		}

		// Determine the root structure type
		this.lexer.skipWhitespace();

		if (this.lexer.getCurrentChar() === '-') {
			// Check if this is an array item or a negative number
			// Look at the character after the dash
			const nextChar = this.lexer.peek();
			if (nextChar === ' ' || nextChar === '\t' || nextChar === '' || nextChar === '#') {
				// It's an array item (dash followed by whitespace/end/comment)
				return this.parseBlockArray(0);
			} else {
				// It's likely a negative number or other value, treat as single value
				return this.parseValue();
			}
		} else if (this.lexer.getCurrentChar() === '[') {
			// Root is an inline array
			return this.parseInlineArray();
		} else if (this.lexer.getCurrentChar() === '{') {
			// Root is an inline object
			return this.parseInlineObject();
		} else {
			// Check if this looks like a key-value pair by looking for a colon
			// For single values, there shouldn't be a colon
			const currentLine = this.lexer.getCurrentLineText();
			const currentPos = this.lexer.getCurrentCharNumber();
			const remainingLine = currentLine.substring(currentPos);

			// Check if there's a colon that's not inside quotes
			let hasColon = false;
			let inQuotes = false;
			let quoteChar = '';

			for (let i = 0; i < remainingLine.length; i++) {
				const char = remainingLine[i];

				if (!inQuotes && (char === '"' || char === `'`)) {
					inQuotes = true;
					quoteChar = char;
				} else if (inQuotes && char === quoteChar) {
					inQuotes = false;
					quoteChar = '';
				} else if (!inQuotes && char === ':') {
					hasColon = true;
					break;
				} else if (!inQuotes && char === '#') {
					// Comment starts, stop looking
					break;
				}
			}

			if (hasColon) {
				// Root is an object
				return this.parseBlockObject(0);
			} else {
				// Root is a single value
				return this.parseValue();
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/decorators/cancelPreviousCalls.ts]---
Location: vscode-main/src/vs/base/common/decorators/cancelPreviousCalls.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { assertDefined } from '../types.js';
import { Disposable, DisposableMap } from '../lifecycle.js';
import { CancellationTokenSource, CancellationToken } from '../cancellation.js';

/**
 * Helper type that represents a function that has an optional {@linkcode CancellationToken}
 * argument argument at the end of the arguments list.
 *
 * @typeparam `TFunction` - Type of the function arguments list of which will be extended
 * 							with an optional {@linkcode CancellationToken} argument.
 */
type TWithOptionalCancellationToken<TFunction extends Function> = TFunction extends (...args: infer TArgs) => infer TReturn
	? (...args: [...TArgs, cancellatioNToken?: CancellationToken]) => TReturn
	: never;

/**
 * Decorator that provides a mechanism to cancel previous calls of the decorated method
 * by providing a `cancellation token` as the last argument of the method, which gets
 * cancelled immediately on subsequent call of the decorated method.
 *
 * Therefore to use this decorator, the two conditions must be met:
 *
 * - the decorated method must have an *optional* {@linkcode CancellationToken} argument at
 * 	 the end of the arguments list
 * - the object that the decorated method belongs to must implement the {@linkcode Disposable};
 *   this requirement comes from the internal implementation of the decorator that
 *   creates new resources that need to be eventually disposed by someone
 *
 * @typeparam `TObject` - Object type that the decorated method belongs to.
 * @typeparam `TArgs` - Argument list of the decorated method.
 * @typeparam `TReturn` - Return value type of the decorated method.
 *
 * ### Examples
 *
 * ```typescript
 * // let's say we have a class that implements the `Disposable` interface that we want
 * // to use the decorator on
 * class Example extends Disposable {
 * 		async doSomethingAsync(arg1: number, arg2: string): Promise<void> {
 * 			// do something async..
 * 			await new Promise(resolve => setTimeout(resolve, 1000));
 * 		}
 * }
 * ```
 *
 * ```typescript
 * // to do that we need to add the `CancellationToken` argument to the end of args list
 * class Example extends Disposable {
 * 		@cancelPreviousCalls
 * 		async doSomethingAsync(arg1: number, arg2: string, cancellationToken?: CancellationToken): Promise<void> {
 * 			console.log(`call with args ${arg1} and ${arg2} initiated`);
 *
 * 			// the decorator will create the cancellation token automatically
 * 			assertDefined(
 * 				cancellationToken,
 * 				`The method must now have the `CancellationToken` passed to it.`,
 * 			);
 *
 * 			cancellationToken.onCancellationRequested(() => {
 * 				console.log(`call with args ${arg1} and ${arg2} was cancelled`);
 * 			});
 *
 * 			// do something async..
 * 			await new Promise(resolve => setTimeout(resolve, 1000));
 *
 * 			// check cancellation token state after the async operations
 * 			console.log(
 * 				`call with args ${arg1} and ${arg2} completed, canceled?: ${cancellationToken.isCancellationRequested}`,
 * 			);
 * 		}
 * }
 *
 * const example = new Example();
 * // call the decorate method first time
 * example.doSomethingAsync(1, 'foo');
 * // wait for 500ms which is less than 1000ms of the async operation in the first call
 * await new Promise(resolve => setTimeout(resolve, 500));
 * // calling the decorate method second time cancels the token passed to the first call
 * example.doSomethingAsync(2, 'bar');
 * ```
 */
export function cancelPreviousCalls<
	TObject extends Disposable,
	TArgs extends unknown[],
	TReturn,
>(
	_proto: TObject,
	methodName: string,
	descriptor: TypedPropertyDescriptor<TWithOptionalCancellationToken<(...args: TArgs) => TReturn>>,
) {
	const originalMethod = descriptor.value;

	assertDefined(
		originalMethod,
		`Method '${methodName}' is not defined.`,
	);

	// we create the global map that contains `TObjectRecord` for each object instance that
	// uses this decorator, which itself contains a `{method name} -> TMethodRecord` mapping
	// for each decorated method on the object; the `TMethodRecord` record stores current
	// `cancellationTokenSource`, token of which was passed to the previous call of the method
	const objectRecords = new WeakMap<TObject, DisposableMap<string, CancellationTokenSource>>();

	// decorate the original method with the following logic that upon a new invocation
	// of the method cancels the cancellation token that was passed to a previous call
	descriptor.value = function (
		this: TObject,
		...args: Parameters<typeof originalMethod>
	): TReturn {
		// get or create a record for the current object instance
		// the creation is done once per each object instance
		let record = objectRecords.get(this);
		if (!record) {
			record = new DisposableMap();
			objectRecords.set(this, record);

			this._register({
				dispose: () => {
					objectRecords.get(this)?.dispose();
					objectRecords.delete(this);
				},
			});
		}

		// when the decorated method is called again and there is a cancellation token
		// source exists from a previous call, cancel and dispose it, then remove it
		record.get(methodName)?.dispose(true);

		// now we need to provide a cancellation token to the original method
		// as the last argument, there are two cases to consider:
		// 	- (common case) the arguments list does not have a cancellation token
		// 	   as the last argument, - in this case we need to add a new one
		//  - (possible case) - the arguments list already has a cancellation token
		//    as the last argument, - in this case we need to reuse the token when
		//    we create ours, and replace the old token with the new one
		// therefore,

		// get the last argument of the arguments list and if it is present,
		// reuse it as the token for the new cancellation token source
		const lastArgument = (args.length > 0)
			? args[args.length - 1]
			: undefined;
		const token = CancellationToken.isCancellationToken(lastArgument)
			? lastArgument
			: undefined;

		const cancellationSource = new CancellationTokenSource(token);
		record.set(methodName, cancellationSource);

		// then update or add cancellation token at the end of the arguments list
		if (CancellationToken.isCancellationToken(lastArgument)) {
			args[args.length - 1] = cancellationSource.token;
		} else {
			args.push(cancellationSource.token);
		}

		// finally invoke the original method passing original arguments and
		// the new cancellation token at the end of the arguments list
		return originalMethod.call(this, ...args);
	};

	return descriptor;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/diff/diff.ts]---
Location: vscode-main/src/vs/base/common/diff/diff.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DiffChange } from './diffChange.js';
import { stringHash } from '../hash.js';
import { Constants } from '../uint.js';

export class StringDiffSequence implements ISequence {

	constructor(private source: string) { }

	getElements(): Int32Array | number[] | string[] {
		const source = this.source;
		const characters = new Int32Array(source.length);
		for (let i = 0, len = source.length; i < len; i++) {
			characters[i] = source.charCodeAt(i);
		}
		return characters;
	}
}

export function stringDiff(original: string, modified: string, pretty: boolean): IDiffChange[] {
	return new LcsDiff(new StringDiffSequence(original), new StringDiffSequence(modified)).ComputeDiff(pretty).changes;
}

export interface ISequence {
	getElements(): Int32Array | number[] | string[];
	getStrictElement?(index: number): string;
}

export interface IDiffChange {
	/**
	 * The position of the first element in the original sequence which
	 * this change affects.
	 */
	originalStart: number;

	/**
	 * The number of elements from the original sequence which were
	 * affected.
	 */
	originalLength: number;

	/**
	 * The position of the first element in the modified sequence which
	 * this change affects.
	 */
	modifiedStart: number;

	/**
	 * The number of elements from the modified sequence which were
	 * affected (added).
	 */
	modifiedLength: number;
}

export interface IContinueProcessingPredicate {
	(furthestOriginalIndex: number, matchLengthOfLongest: number): boolean;
}

export interface IDiffResult {
	quitEarly: boolean;
	changes: IDiffChange[];
}

//
// The code below has been ported from a C# implementation in VS
//

class Debug {

	public static Assert(condition: boolean, message: string): void {
		if (!condition) {
			throw new Error(message);
		}
	}
}

class MyArray {
	/**
	 * Copies a range of elements from an Array starting at the specified source index and pastes
	 * them to another Array starting at the specified destination index. The length and the indexes
	 * are specified as 64-bit integers.
	 * sourceArray:
	 *		The Array that contains the data to copy.
	 * sourceIndex:
	 *		A 64-bit integer that represents the index in the sourceArray at which copying begins.
	 * destinationArray:
	 *		The Array that receives the data.
	 * destinationIndex:
	 *		A 64-bit integer that represents the index in the destinationArray at which storing begins.
	 * length:
	 *		A 64-bit integer that represents the number of elements to copy.
	 */
	public static Copy(sourceArray: unknown[], sourceIndex: number, destinationArray: unknown[], destinationIndex: number, length: number) {
		for (let i = 0; i < length; i++) {
			destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
		}
	}
	public static Copy2(sourceArray: Int32Array, sourceIndex: number, destinationArray: Int32Array, destinationIndex: number, length: number) {
		for (let i = 0; i < length; i++) {
			destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
		}
	}
}

//*****************************************************************************
// LcsDiff.cs
//
// An implementation of the difference algorithm described in
// "An O(ND) Difference Algorithm and its variations" by Eugene W. Myers
//
// Copyright (C) 2008 Microsoft Corporation @minifier_do_not_preserve
//*****************************************************************************

// Our total memory usage for storing history is (worst-case):
// 2 * [(MaxDifferencesHistory + 1) * (MaxDifferencesHistory + 1) - 1] * sizeof(int)
// 2 * [1448*1448 - 1] * 4 = 16773624 = 16MB
const enum LocalConstants {
	MaxDifferencesHistory = 1447
}

/**
 * A utility class which helps to create the set of DiffChanges from
 * a difference operation. This class accepts original DiffElements and
 * modified DiffElements that are involved in a particular change. The
 * MarkNextChange() method can be called to mark the separation between
 * distinct changes. At the end, the Changes property can be called to retrieve
 * the constructed changes.
 */
class DiffChangeHelper {

	private m_changes: DiffChange[];
	private m_originalStart: number;
	private m_modifiedStart: number;
	private m_originalCount: number;
	private m_modifiedCount: number;

	/**
	 * Constructs a new DiffChangeHelper for the given DiffSequences.
	 */
	constructor() {
		this.m_changes = [];
		this.m_originalStart = Constants.MAX_SAFE_SMALL_INTEGER;
		this.m_modifiedStart = Constants.MAX_SAFE_SMALL_INTEGER;
		this.m_originalCount = 0;
		this.m_modifiedCount = 0;
	}

	/**
	 * Marks the beginning of the next change in the set of differences.
	 */
	public MarkNextChange(): void {
		// Only add to the list if there is something to add
		if (this.m_originalCount > 0 || this.m_modifiedCount > 0) {
			// Add the new change to our list
			this.m_changes.push(new DiffChange(this.m_originalStart, this.m_originalCount,
				this.m_modifiedStart, this.m_modifiedCount));
		}

		// Reset for the next change
		this.m_originalCount = 0;
		this.m_modifiedCount = 0;
		this.m_originalStart = Constants.MAX_SAFE_SMALL_INTEGER;
		this.m_modifiedStart = Constants.MAX_SAFE_SMALL_INTEGER;
	}

	/**
	 * Adds the original element at the given position to the elements
	 * affected by the current change. The modified index gives context
	 * to the change position with respect to the original sequence.
	 * @param originalIndex The index of the original element to add.
	 * @param modifiedIndex The index of the modified element that provides corresponding position in the modified sequence.
	 */
	public AddOriginalElement(originalIndex: number, modifiedIndex: number) {
		// The 'true' start index is the smallest of the ones we've seen
		this.m_originalStart = Math.min(this.m_originalStart, originalIndex);
		this.m_modifiedStart = Math.min(this.m_modifiedStart, modifiedIndex);

		this.m_originalCount++;
	}

	/**
	 * Adds the modified element at the given position to the elements
	 * affected by the current change. The original index gives context
	 * to the change position with respect to the modified sequence.
	 * @param originalIndex The index of the original element that provides corresponding position in the original sequence.
	 * @param modifiedIndex The index of the modified element to add.
	 */
	public AddModifiedElement(originalIndex: number, modifiedIndex: number): void {
		// The 'true' start index is the smallest of the ones we've seen
		this.m_originalStart = Math.min(this.m_originalStart, originalIndex);
		this.m_modifiedStart = Math.min(this.m_modifiedStart, modifiedIndex);

		this.m_modifiedCount++;
	}

	/**
	 * Retrieves all of the changes marked by the class.
	 */
	public getChanges(): DiffChange[] {
		if (this.m_originalCount > 0 || this.m_modifiedCount > 0) {
			// Finish up on whatever is left
			this.MarkNextChange();
		}

		return this.m_changes;
	}

	/**
	 * Retrieves all of the changes marked by the class in the reverse order
	 */
	public getReverseChanges(): DiffChange[] {
		if (this.m_originalCount > 0 || this.m_modifiedCount > 0) {
			// Finish up on whatever is left
			this.MarkNextChange();
		}

		this.m_changes.reverse();
		return this.m_changes;
	}

}

/**
 * An implementation of the difference algorithm described in
 * "An O(ND) Difference Algorithm and its variations" by Eugene W. Myers
 */
export class LcsDiff {

	private readonly ContinueProcessingPredicate: IContinueProcessingPredicate | null;

	private readonly _originalSequence: ISequence;
	private readonly _modifiedSequence: ISequence;
	private readonly _hasStrings: boolean;
	private readonly _originalStringElements: string[];
	private readonly _originalElementsOrHash: Int32Array;
	private readonly _modifiedStringElements: string[];
	private readonly _modifiedElementsOrHash: Int32Array;

	private m_forwardHistory: Int32Array[];
	private m_reverseHistory: Int32Array[];

	/**
	 * Constructs the DiffFinder
	 */
	constructor(originalSequence: ISequence, modifiedSequence: ISequence, continueProcessingPredicate: IContinueProcessingPredicate | null = null) {
		this.ContinueProcessingPredicate = continueProcessingPredicate;

		this._originalSequence = originalSequence;
		this._modifiedSequence = modifiedSequence;

		const [originalStringElements, originalElementsOrHash, originalHasStrings] = LcsDiff._getElements(originalSequence);
		const [modifiedStringElements, modifiedElementsOrHash, modifiedHasStrings] = LcsDiff._getElements(modifiedSequence);

		this._hasStrings = (originalHasStrings && modifiedHasStrings);
		this._originalStringElements = originalStringElements;
		this._originalElementsOrHash = originalElementsOrHash;
		this._modifiedStringElements = modifiedStringElements;
		this._modifiedElementsOrHash = modifiedElementsOrHash;

		this.m_forwardHistory = [];
		this.m_reverseHistory = [];
	}

	private static _isStringArray(arr: Int32Array | number[] | string[]): arr is string[] {
		return (arr.length > 0 && typeof arr[0] === 'string');
	}

	private static _getElements(sequence: ISequence): [string[], Int32Array, boolean] {
		const elements = sequence.getElements();

		if (LcsDiff._isStringArray(elements)) {
			const hashes = new Int32Array(elements.length);
			for (let i = 0, len = elements.length; i < len; i++) {
				hashes[i] = stringHash(elements[i], 0);
			}
			return [elements, hashes, true];
		}

		if (elements instanceof Int32Array) {
			return [[], elements, false];
		}

		return [[], new Int32Array(elements), false];
	}

	private ElementsAreEqual(originalIndex: number, newIndex: number): boolean {
		if (this._originalElementsOrHash[originalIndex] !== this._modifiedElementsOrHash[newIndex]) {
			return false;
		}
		return (this._hasStrings ? this._originalStringElements[originalIndex] === this._modifiedStringElements[newIndex] : true);
	}

	private ElementsAreStrictEqual(originalIndex: number, newIndex: number): boolean {
		if (!this.ElementsAreEqual(originalIndex, newIndex)) {
			return false;
		}
		const originalElement = LcsDiff._getStrictElement(this._originalSequence, originalIndex);
		const modifiedElement = LcsDiff._getStrictElement(this._modifiedSequence, newIndex);
		return (originalElement === modifiedElement);
	}

	private static _getStrictElement(sequence: ISequence, index: number): string | null {
		if (typeof sequence.getStrictElement === 'function') {
			return sequence.getStrictElement(index);
		}
		return null;
	}

	private OriginalElementsAreEqual(index1: number, index2: number): boolean {
		if (this._originalElementsOrHash[index1] !== this._originalElementsOrHash[index2]) {
			return false;
		}
		return (this._hasStrings ? this._originalStringElements[index1] === this._originalStringElements[index2] : true);
	}

	private ModifiedElementsAreEqual(index1: number, index2: number): boolean {
		if (this._modifiedElementsOrHash[index1] !== this._modifiedElementsOrHash[index2]) {
			return false;
		}
		return (this._hasStrings ? this._modifiedStringElements[index1] === this._modifiedStringElements[index2] : true);
	}

	public ComputeDiff(pretty: boolean): IDiffResult {
		return this._ComputeDiff(0, this._originalElementsOrHash.length - 1, 0, this._modifiedElementsOrHash.length - 1, pretty);
	}

	/**
	 * Computes the differences between the original and modified input
	 * sequences on the bounded range.
	 * @returns An array of the differences between the two input sequences.
	 */
	private _ComputeDiff(originalStart: number, originalEnd: number, modifiedStart: number, modifiedEnd: number, pretty: boolean): IDiffResult {
		const quitEarlyArr = [false];
		let changes = this.ComputeDiffRecursive(originalStart, originalEnd, modifiedStart, modifiedEnd, quitEarlyArr);

		if (pretty) {
			// We have to clean up the computed diff to be more intuitive
			// but it turns out this cannot be done correctly until the entire set
			// of diffs have been computed
			changes = this.PrettifyChanges(changes);
		}

		return {
			quitEarly: quitEarlyArr[0],
			changes: changes
		};
	}

	/**
	 * Private helper method which computes the differences on the bounded range
	 * recursively.
	 * @returns An array of the differences between the two input sequences.
	 */
	private ComputeDiffRecursive(originalStart: number, originalEnd: number, modifiedStart: number, modifiedEnd: number, quitEarlyArr: boolean[]): DiffChange[] {
		quitEarlyArr[0] = false;

		// Find the start of the differences
		while (originalStart <= originalEnd && modifiedStart <= modifiedEnd && this.ElementsAreEqual(originalStart, modifiedStart)) {
			originalStart++;
			modifiedStart++;
		}

		// Find the end of the differences
		while (originalEnd >= originalStart && modifiedEnd >= modifiedStart && this.ElementsAreEqual(originalEnd, modifiedEnd)) {
			originalEnd--;
			modifiedEnd--;
		}

		// In the special case where we either have all insertions or all deletions or the sequences are identical
		if (originalStart > originalEnd || modifiedStart > modifiedEnd) {
			let changes: DiffChange[];

			if (modifiedStart <= modifiedEnd) {
				Debug.Assert(originalStart === originalEnd + 1, 'originalStart should only be one more than originalEnd');

				// All insertions
				changes = [
					new DiffChange(originalStart, 0, modifiedStart, modifiedEnd - modifiedStart + 1)
				];
			} else if (originalStart <= originalEnd) {
				Debug.Assert(modifiedStart === modifiedEnd + 1, 'modifiedStart should only be one more than modifiedEnd');

				// All deletions
				changes = [
					new DiffChange(originalStart, originalEnd - originalStart + 1, modifiedStart, 0)
				];
			} else {
				Debug.Assert(originalStart === originalEnd + 1, 'originalStart should only be one more than originalEnd');
				Debug.Assert(modifiedStart === modifiedEnd + 1, 'modifiedStart should only be one more than modifiedEnd');

				// Identical sequences - No differences
				changes = [];
			}

			return changes;
		}

		// This problem can be solved using the Divide-And-Conquer technique.
		const midOriginalArr = [0];
		const midModifiedArr = [0];
		const result = this.ComputeRecursionPoint(originalStart, originalEnd, modifiedStart, modifiedEnd, midOriginalArr, midModifiedArr, quitEarlyArr);

		const midOriginal = midOriginalArr[0];
		const midModified = midModifiedArr[0];

		if (result !== null) {
			// Result is not-null when there was enough memory to compute the changes while
			// searching for the recursion point
			return result;
		} else if (!quitEarlyArr[0]) {
			// We can break the problem down recursively by finding the changes in the
			// First Half:   (originalStart, modifiedStart) to (midOriginal, midModified)
			// Second Half:  (midOriginal + 1, minModified + 1) to (originalEnd, modifiedEnd)
			// NOTE: ComputeDiff() is inclusive, therefore the second range starts on the next point

			const leftChanges = this.ComputeDiffRecursive(originalStart, midOriginal, modifiedStart, midModified, quitEarlyArr);
			let rightChanges: DiffChange[] = [];

			if (!quitEarlyArr[0]) {
				rightChanges = this.ComputeDiffRecursive(midOriginal + 1, originalEnd, midModified + 1, modifiedEnd, quitEarlyArr);
			} else {
				// We didn't have time to finish the first half, so we don't have time to compute this half.
				// Consider the entire rest of the sequence different.
				rightChanges = [
					new DiffChange(midOriginal + 1, originalEnd - (midOriginal + 1) + 1, midModified + 1, modifiedEnd - (midModified + 1) + 1)
				];
			}

			return this.ConcatenateChanges(leftChanges, rightChanges);
		}

		// If we hit here, we quit early, and so can't return anything meaningful
		return [
			new DiffChange(originalStart, originalEnd - originalStart + 1, modifiedStart, modifiedEnd - modifiedStart + 1)
		];
	}

	private WALKTRACE(diagonalForwardBase: number, diagonalForwardStart: number, diagonalForwardEnd: number, diagonalForwardOffset: number,
		diagonalReverseBase: number, diagonalReverseStart: number, diagonalReverseEnd: number, diagonalReverseOffset: number,
		forwardPoints: Int32Array, reversePoints: Int32Array,
		originalIndex: number, originalEnd: number, midOriginalArr: number[],
		modifiedIndex: number, modifiedEnd: number, midModifiedArr: number[],
		deltaIsEven: boolean, quitEarlyArr: boolean[]
	): DiffChange[] {
		let forwardChanges: DiffChange[] | null = null;
		let reverseChanges: DiffChange[] | null = null;

		// First, walk backward through the forward diagonals history
		let changeHelper = new DiffChangeHelper();
		let diagonalMin = diagonalForwardStart;
		let diagonalMax = diagonalForwardEnd;
		let diagonalRelative = (midOriginalArr[0] - midModifiedArr[0]) - diagonalForwardOffset;
		let lastOriginalIndex = Constants.MIN_SAFE_SMALL_INTEGER;
		let historyIndex = this.m_forwardHistory.length - 1;

		do {
			// Get the diagonal index from the relative diagonal number
			const diagonal = diagonalRelative + diagonalForwardBase;

			// Figure out where we came from
			if (diagonal === diagonalMin || (diagonal < diagonalMax && forwardPoints[diagonal - 1] < forwardPoints[diagonal + 1])) {
				// Vertical line (the element is an insert)
				originalIndex = forwardPoints[diagonal + 1];
				modifiedIndex = originalIndex - diagonalRelative - diagonalForwardOffset;
				if (originalIndex < lastOriginalIndex) {
					changeHelper.MarkNextChange();
				}
				lastOriginalIndex = originalIndex;
				changeHelper.AddModifiedElement(originalIndex + 1, modifiedIndex);
				diagonalRelative = (diagonal + 1) - diagonalForwardBase; //Setup for the next iteration
			} else {
				// Horizontal line (the element is a deletion)
				originalIndex = forwardPoints[diagonal - 1] + 1;
				modifiedIndex = originalIndex - diagonalRelative - diagonalForwardOffset;
				if (originalIndex < lastOriginalIndex) {
					changeHelper.MarkNextChange();
				}
				lastOriginalIndex = originalIndex - 1;
				changeHelper.AddOriginalElement(originalIndex, modifiedIndex + 1);
				diagonalRelative = (diagonal - 1) - diagonalForwardBase; //Setup for the next iteration
			}

			if (historyIndex >= 0) {
				forwardPoints = this.m_forwardHistory[historyIndex];
				diagonalForwardBase = forwardPoints[0]; //We stored this in the first spot
				diagonalMin = 1;
				diagonalMax = forwardPoints.length - 1;
			}
		} while (--historyIndex >= -1);

		// Ironically, we get the forward changes as the reverse of the
		// order we added them since we technically added them backwards
		forwardChanges = changeHelper.getReverseChanges();

		if (quitEarlyArr[0]) {
			// TODO: Calculate a partial from the reverse diagonals.
			//       For now, just assume everything after the midOriginal/midModified point is a diff

			let originalStartPoint = midOriginalArr[0] + 1;
			let modifiedStartPoint = midModifiedArr[0] + 1;

			if (forwardChanges !== null && forwardChanges.length > 0) {
				const lastForwardChange = forwardChanges[forwardChanges.length - 1];
				originalStartPoint = Math.max(originalStartPoint, lastForwardChange.getOriginalEnd());
				modifiedStartPoint = Math.max(modifiedStartPoint, lastForwardChange.getModifiedEnd());
			}

			reverseChanges = [
				new DiffChange(originalStartPoint, originalEnd - originalStartPoint + 1,
					modifiedStartPoint, modifiedEnd - modifiedStartPoint + 1)
			];
		} else {
			// Now walk backward through the reverse diagonals history
			changeHelper = new DiffChangeHelper();
			diagonalMin = diagonalReverseStart;
			diagonalMax = diagonalReverseEnd;
			diagonalRelative = (midOriginalArr[0] - midModifiedArr[0]) - diagonalReverseOffset;
			lastOriginalIndex = Constants.MAX_SAFE_SMALL_INTEGER;
			historyIndex = (deltaIsEven) ? this.m_reverseHistory.length - 1 : this.m_reverseHistory.length - 2;

			do {
				// Get the diagonal index from the relative diagonal number
				const diagonal = diagonalRelative + diagonalReverseBase;

				// Figure out where we came from
				if (diagonal === diagonalMin || (diagonal < diagonalMax && reversePoints[diagonal - 1] >= reversePoints[diagonal + 1])) {
					// Horizontal line (the element is a deletion))
					originalIndex = reversePoints[diagonal + 1] - 1;
					modifiedIndex = originalIndex - diagonalRelative - diagonalReverseOffset;
					if (originalIndex > lastOriginalIndex) {
						changeHelper.MarkNextChange();
					}
					lastOriginalIndex = originalIndex + 1;
					changeHelper.AddOriginalElement(originalIndex + 1, modifiedIndex + 1);
					diagonalRelative = (diagonal + 1) - diagonalReverseBase; //Setup for the next iteration
				} else {
					// Vertical line (the element is an insertion)
					originalIndex = reversePoints[diagonal - 1];
					modifiedIndex = originalIndex - diagonalRelative - diagonalReverseOffset;
					if (originalIndex > lastOriginalIndex) {
						changeHelper.MarkNextChange();
					}
					lastOriginalIndex = originalIndex;
					changeHelper.AddModifiedElement(originalIndex + 1, modifiedIndex + 1);
					diagonalRelative = (diagonal - 1) - diagonalReverseBase; //Setup for the next iteration
				}

				if (historyIndex >= 0) {
					reversePoints = this.m_reverseHistory[historyIndex];
					diagonalReverseBase = reversePoints[0]; //We stored this in the first spot
					diagonalMin = 1;
					diagonalMax = reversePoints.length - 1;
				}
			} while (--historyIndex >= -1);

			// There are cases where the reverse history will find diffs that
			// are correct, but not intuitive, so we need shift them.
			reverseChanges = changeHelper.getChanges();
		}

		return this.ConcatenateChanges(forwardChanges, reverseChanges);
	}

	/**
	 * Given the range to compute the diff on, this method finds the point:
	 * (midOriginal, midModified)
	 * that exists in the middle of the LCS of the two sequences and
	 * is the point at which the LCS problem may be broken down recursively.
	 * This method will try to keep the LCS trace in memory. If the LCS recursion
	 * point is calculated and the full trace is available in memory, then this method
	 * will return the change list.
	 * @param originalStart The start bound of the original sequence range
	 * @param originalEnd The end bound of the original sequence range
	 * @param modifiedStart The start bound of the modified sequence range
	 * @param modifiedEnd The end bound of the modified sequence range
	 * @param midOriginal The middle point of the original sequence range
	 * @param midModified The middle point of the modified sequence range
	 * @returns The diff changes, if available, otherwise null
	 */
	private ComputeRecursionPoint(originalStart: number, originalEnd: number, modifiedStart: number, modifiedEnd: number, midOriginalArr: number[], midModifiedArr: number[], quitEarlyArr: boolean[]) {
		let originalIndex = 0, modifiedIndex = 0;
		let diagonalForwardStart = 0, diagonalForwardEnd = 0;
		let diagonalReverseStart = 0, diagonalReverseEnd = 0;

		// To traverse the edit graph and produce the proper LCS, our actual
		// start position is just outside the given boundary
		originalStart--;
		modifiedStart--;

		// We set these up to make the compiler happy, but they will
		// be replaced before we return with the actual recursion point
		midOriginalArr[0] = 0;
		midModifiedArr[0] = 0;

		// Clear out the history
		this.m_forwardHistory = [];
		this.m_reverseHistory = [];

		// Each cell in the two arrays corresponds to a diagonal in the edit graph.
		// The integer value in the cell represents the originalIndex of the furthest
		// reaching point found so far that ends in that diagonal.
		// The modifiedIndex can be computed mathematically from the originalIndex and the diagonal number.
		const maxDifferences = (originalEnd - originalStart) + (modifiedEnd - modifiedStart);
		const numDiagonals = maxDifferences + 1;
		const forwardPoints = new Int32Array(numDiagonals);
		const reversePoints = new Int32Array(numDiagonals);
		// diagonalForwardBase: Index into forwardPoints of the diagonal which passes through (originalStart, modifiedStart)
		// diagonalReverseBase: Index into reversePoints of the diagonal which passes through (originalEnd, modifiedEnd)
		const diagonalForwardBase = (modifiedEnd - modifiedStart);
		const diagonalReverseBase = (originalEnd - originalStart);
		// diagonalForwardOffset: Geometric offset which allows modifiedIndex to be computed from originalIndex and the
		//    diagonal number (relative to diagonalForwardBase)
		// diagonalReverseOffset: Geometric offset which allows modifiedIndex to be computed from originalIndex and the
		//    diagonal number (relative to diagonalReverseBase)
		const diagonalForwardOffset = (originalStart - modifiedStart);
		const diagonalReverseOffset = (originalEnd - modifiedEnd);

		// delta: The difference between the end diagonal and the start diagonal. This is used to relate diagonal numbers
		//   relative to the start diagonal with diagonal numbers relative to the end diagonal.
		// The Even/Oddn-ness of this delta is important for determining when we should check for overlap
		const delta = diagonalReverseBase - diagonalForwardBase;
		const deltaIsEven = (delta % 2 === 0);

		// Here we set up the start and end points as the furthest points found so far
		// in both the forward and reverse directions, respectively
		forwardPoints[diagonalForwardBase] = originalStart;
		reversePoints[diagonalReverseBase] = originalEnd;

		// Remember if we quit early, and thus need to do a best-effort result instead of a real result.
		quitEarlyArr[0] = false;



		// A couple of points:
		// --With this method, we iterate on the number of differences between the two sequences.
		//   The more differences there actually are, the longer this will take.
		// --Also, as the number of differences increases, we have to search on diagonals further
		//   away from the reference diagonal (which is diagonalForwardBase for forward, diagonalReverseBase for reverse).
		// --We extend on even diagonals (relative to the reference diagonal) only when numDifferences
		//   is even and odd diagonals only when numDifferences is odd.
		for (let numDifferences = 1; numDifferences <= (maxDifferences / 2) + 1; numDifferences++) {
			let furthestOriginalIndex = 0;
			let furthestModifiedIndex = 0;

			// Run the algorithm in the forward direction
			diagonalForwardStart = this.ClipDiagonalBound(diagonalForwardBase - numDifferences, numDifferences, diagonalForwardBase, numDiagonals);
			diagonalForwardEnd = this.ClipDiagonalBound(diagonalForwardBase + numDifferences, numDifferences, diagonalForwardBase, numDiagonals);
			for (let diagonal = diagonalForwardStart; diagonal <= diagonalForwardEnd; diagonal += 2) {
				// STEP 1: We extend the furthest reaching point in the present diagonal
				// by looking at the diagonals above and below and picking the one whose point
				// is further away from the start point (originalStart, modifiedStart)
				if (diagonal === diagonalForwardStart || (diagonal < diagonalForwardEnd && forwardPoints[diagonal - 1] < forwardPoints[diagonal + 1])) {
					originalIndex = forwardPoints[diagonal + 1];
				} else {
					originalIndex = forwardPoints[diagonal - 1] + 1;
				}
				modifiedIndex = originalIndex - (diagonal - diagonalForwardBase) - diagonalForwardOffset;

				// Save the current originalIndex so we can test for false overlap in step 3
				const tempOriginalIndex = originalIndex;

				// STEP 2: We can continue to extend the furthest reaching point in the present diagonal
				// so long as the elements are equal.
				while (originalIndex < originalEnd && modifiedIndex < modifiedEnd && this.ElementsAreEqual(originalIndex + 1, modifiedIndex + 1)) {
					originalIndex++;
					modifiedIndex++;
				}
				forwardPoints[diagonal] = originalIndex;

				if (originalIndex + modifiedIndex > furthestOriginalIndex + furthestModifiedIndex) {
					furthestOriginalIndex = originalIndex;
					furthestModifiedIndex = modifiedIndex;
				}

				// STEP 3: If delta is odd (overlap first happens on forward when delta is odd)
				// and diagonal is in the range of reverse diagonals computed for numDifferences-1
				// (the previous iteration; we haven't computed reverse diagonals for numDifferences yet)
				// then check for overlap.
				if (!deltaIsEven && Math.abs(diagonal - diagonalReverseBase) <= (numDifferences - 1)) {
					if (originalIndex >= reversePoints[diagonal]) {
						midOriginalArr[0] = originalIndex;
						midModifiedArr[0] = modifiedIndex;

						if (tempOriginalIndex <= reversePoints[diagonal] && LocalConstants.MaxDifferencesHistory > 0 && numDifferences <= (LocalConstants.MaxDifferencesHistory + 1)) {
							// BINGO! We overlapped, and we have the full trace in memory!
							return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset,
								diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset,
								forwardPoints, reversePoints,
								originalIndex, originalEnd, midOriginalArr,
								modifiedIndex, modifiedEnd, midModifiedArr,
								deltaIsEven, quitEarlyArr
							);
						} else {
							// Either false overlap, or we didn't have enough memory for the full trace
							// Just return the recursion point
							return null;
						}
					}
				}
			}

			// Check to see if we should be quitting early, before moving on to the next iteration.
			const matchLengthOfLongest = ((furthestOriginalIndex - originalStart) + (furthestModifiedIndex - modifiedStart) - numDifferences) / 2;

			if (this.ContinueProcessingPredicate !== null && !this.ContinueProcessingPredicate(furthestOriginalIndex, matchLengthOfLongest)) {
				// We can't finish, so skip ahead to generating a result from what we have.
				quitEarlyArr[0] = true;

				// Use the furthest distance we got in the forward direction.
				midOriginalArr[0] = furthestOriginalIndex;
				midModifiedArr[0] = furthestModifiedIndex;

				if (matchLengthOfLongest > 0 && LocalConstants.MaxDifferencesHistory > 0 && numDifferences <= (LocalConstants.MaxDifferencesHistory + 1)) {
					// Enough of the history is in memory to walk it backwards
					return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset,
						diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset,
						forwardPoints, reversePoints,
						originalIndex, originalEnd, midOriginalArr,
						modifiedIndex, modifiedEnd, midModifiedArr,
						deltaIsEven, quitEarlyArr
					);
				} else {
					// We didn't actually remember enough of the history.

					//Since we are quitting the diff early, we need to shift back the originalStart and modified start
					//back into the boundary limits since we decremented their value above beyond the boundary limit.
					originalStart++;
					modifiedStart++;

					return [
						new DiffChange(originalStart, originalEnd - originalStart + 1,
							modifiedStart, modifiedEnd - modifiedStart + 1)
					];
				}
			}

			// Run the algorithm in the reverse direction
			diagonalReverseStart = this.ClipDiagonalBound(diagonalReverseBase - numDifferences, numDifferences, diagonalReverseBase, numDiagonals);
			diagonalReverseEnd = this.ClipDiagonalBound(diagonalReverseBase + numDifferences, numDifferences, diagonalReverseBase, numDiagonals);
			for (let diagonal = diagonalReverseStart; diagonal <= diagonalReverseEnd; diagonal += 2) {
				// STEP 1: We extend the furthest reaching point in the present diagonal
				// by looking at the diagonals above and below and picking the one whose point
				// is further away from the start point (originalEnd, modifiedEnd)
				if (diagonal === diagonalReverseStart || (diagonal < diagonalReverseEnd && reversePoints[diagonal - 1] >= reversePoints[diagonal + 1])) {
					originalIndex = reversePoints[diagonal + 1] - 1;
				} else {
					originalIndex = reversePoints[diagonal - 1];
				}
				modifiedIndex = originalIndex - (diagonal - diagonalReverseBase) - diagonalReverseOffset;

				// Save the current originalIndex so we can test for false overlap
				const tempOriginalIndex = originalIndex;

				// STEP 2: We can continue to extend the furthest reaching point in the present diagonal
				// as long as the elements are equal.
				while (originalIndex > originalStart && modifiedIndex > modifiedStart && this.ElementsAreEqual(originalIndex, modifiedIndex)) {
					originalIndex--;
					modifiedIndex--;
				}
				reversePoints[diagonal] = originalIndex;

				// STEP 4: If delta is even (overlap first happens on reverse when delta is even)
				// and diagonal is in the range of forward diagonals computed for numDifferences
				// then check for overlap.
				if (deltaIsEven && Math.abs(diagonal - diagonalForwardBase) <= numDifferences) {
					if (originalIndex <= forwardPoints[diagonal]) {
						midOriginalArr[0] = originalIndex;
						midModifiedArr[0] = modifiedIndex;

						if (tempOriginalIndex >= forwardPoints[diagonal] && LocalConstants.MaxDifferencesHistory > 0 && numDifferences <= (LocalConstants.MaxDifferencesHistory + 1)) {
							// BINGO! We overlapped, and we have the full trace in memory!
							return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset,
								diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset,
								forwardPoints, reversePoints,
								originalIndex, originalEnd, midOriginalArr,
								modifiedIndex, modifiedEnd, midModifiedArr,
								deltaIsEven, quitEarlyArr
							);
						} else {
							// Either false overlap, or we didn't have enough memory for the full trace
							// Just return the recursion point
							return null;
						}
					}
				}
			}

			// Save current vectors to history before the next iteration
			if (numDifferences <= LocalConstants.MaxDifferencesHistory) {
				// We are allocating space for one extra int, which we fill with
				// the index of the diagonal base index
				let temp = new Int32Array(diagonalForwardEnd - diagonalForwardStart + 2);
				temp[0] = diagonalForwardBase - diagonalForwardStart + 1;
				MyArray.Copy2(forwardPoints, diagonalForwardStart, temp, 1, diagonalForwardEnd - diagonalForwardStart + 1);
				this.m_forwardHistory.push(temp);

				temp = new Int32Array(diagonalReverseEnd - diagonalReverseStart + 2);
				temp[0] = diagonalReverseBase - diagonalReverseStart + 1;
				MyArray.Copy2(reversePoints, diagonalReverseStart, temp, 1, diagonalReverseEnd - diagonalReverseStart + 1);
				this.m_reverseHistory.push(temp);
			}

		}

		// If we got here, then we have the full trace in history. We just have to convert it to a change list
		// NOTE: This part is a bit messy
		return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset,
			diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset,
			forwardPoints, reversePoints,
			originalIndex, originalEnd, midOriginalArr,
			modifiedIndex, modifiedEnd, midModifiedArr,
			deltaIsEven, quitEarlyArr
		);
	}

	/**
	 * Shifts the given changes to provide a more intuitive diff.
	 * While the first element in a diff matches the first element after the diff,
	 * we shift the diff down.
	 *
	 * @param changes The list of changes to shift
	 * @returns The shifted changes
	 */
	private PrettifyChanges(changes: DiffChange[]): DiffChange[] {

		// Shift all the changes down first
		for (let i = 0; i < changes.length; i++) {
			const change = changes[i];
			const originalStop = (i < changes.length - 1) ? changes[i + 1].originalStart : this._originalElementsOrHash.length;
			const modifiedStop = (i < changes.length - 1) ? changes[i + 1].modifiedStart : this._modifiedElementsOrHash.length;
			const checkOriginal = change.originalLength > 0;
			const checkModified = change.modifiedLength > 0;

			while (
				change.originalStart + change.originalLength < originalStop
				&& change.modifiedStart + change.modifiedLength < modifiedStop
				&& (!checkOriginal || this.OriginalElementsAreEqual(change.originalStart, change.originalStart + change.originalLength))
				&& (!checkModified || this.ModifiedElementsAreEqual(change.modifiedStart, change.modifiedStart + change.modifiedLength))
			) {
				const startStrictEqual = this.ElementsAreStrictEqual(change.originalStart, change.modifiedStart);
				const endStrictEqual = this.ElementsAreStrictEqual(change.originalStart + change.originalLength, change.modifiedStart + change.modifiedLength);
				if (endStrictEqual && !startStrictEqual) {
					// moving the change down would create an equal change, but the elements are not strict equal
					break;
				}
				change.originalStart++;
				change.modifiedStart++;
			}

			const mergedChangeArr: Array<DiffChange | null> = [null];
			if (i < changes.length - 1 && this.ChangesOverlap(changes[i], changes[i + 1], mergedChangeArr)) {
				changes[i] = mergedChangeArr[0]!;
				changes.splice(i + 1, 1);
				i--;
				continue;
			}
		}

		// Shift changes back up until we hit empty or whitespace-only lines
		for (let i = changes.length - 1; i >= 0; i--) {
			const change = changes[i];

			let originalStop = 0;
			let modifiedStop = 0;
			if (i > 0) {
				const prevChange = changes[i - 1];
				originalStop = prevChange.originalStart + prevChange.originalLength;
				modifiedStop = prevChange.modifiedStart + prevChange.modifiedLength;
			}

			const checkOriginal = change.originalLength > 0;
			const checkModified = change.modifiedLength > 0;

			let bestDelta = 0;
			let bestScore = this._boundaryScore(change.originalStart, change.originalLength, change.modifiedStart, change.modifiedLength);

			for (let delta = 1; ; delta++) {
				const originalStart = change.originalStart - delta;
				const modifiedStart = change.modifiedStart - delta;

				if (originalStart < originalStop || modifiedStart < modifiedStop) {
					break;
				}

				if (checkOriginal && !this.OriginalElementsAreEqual(originalStart, originalStart + change.originalLength)) {
					break;
				}

				if (checkModified && !this.ModifiedElementsAreEqual(modifiedStart, modifiedStart + change.modifiedLength)) {
					break;
				}

				const touchingPreviousChange = (originalStart === originalStop && modifiedStart === modifiedStop);
				const score = (
					(touchingPreviousChange ? 5 : 0)
					+ this._boundaryScore(originalStart, change.originalLength, modifiedStart, change.modifiedLength)
				);

				if (score > bestScore) {
					bestScore = score;
					bestDelta = delta;
				}
			}

			change.originalStart -= bestDelta;
			change.modifiedStart -= bestDelta;

			const mergedChangeArr: Array<DiffChange | null> = [null];
			if (i > 0 && this.ChangesOverlap(changes[i - 1], changes[i], mergedChangeArr)) {
				changes[i - 1] = mergedChangeArr[0]!;
				changes.splice(i, 1);
				i++;
				continue;
			}
		}

		// There could be multiple longest common substrings.
		// Give preference to the ones containing longer lines
		if (this._hasStrings) {
			for (let i = 1, len = changes.length; i < len; i++) {
				const aChange = changes[i - 1];
				const bChange = changes[i];
				const matchedLength = bChange.originalStart - aChange.originalStart - aChange.originalLength;
				const aOriginalStart = aChange.originalStart;
				const bOriginalEnd = bChange.originalStart + bChange.originalLength;
				const abOriginalLength = bOriginalEnd - aOriginalStart;
				const aModifiedStart = aChange.modifiedStart;
				const bModifiedEnd = bChange.modifiedStart + bChange.modifiedLength;
				const abModifiedLength = bModifiedEnd - aModifiedStart;
				// Avoid wasting a lot of time with these searches
				if (matchedLength < 5 && abOriginalLength < 20 && abModifiedLength < 20) {
					const t = this._findBetterContiguousSequence(
						aOriginalStart, abOriginalLength,
						aModifiedStart, abModifiedLength,
						matchedLength
					);
					if (t) {
						const [originalMatchStart, modifiedMatchStart] = t;
						if (originalMatchStart !== aChange.originalStart + aChange.originalLength || modifiedMatchStart !== aChange.modifiedStart + aChange.modifiedLength) {
							// switch to another sequence that has a better score
							aChange.originalLength = originalMatchStart - aChange.originalStart;
							aChange.modifiedLength = modifiedMatchStart - aChange.modifiedStart;
							bChange.originalStart = originalMatchStart + matchedLength;
							bChange.modifiedStart = modifiedMatchStart + matchedLength;
							bChange.originalLength = bOriginalEnd - bChange.originalStart;
							bChange.modifiedLength = bModifiedEnd - bChange.modifiedStart;
						}
					}
				}
			}
		}

		return changes;
	}

	private _findBetterContiguousSequence(originalStart: number, originalLength: number, modifiedStart: number, modifiedLength: number, desiredLength: number): [number, number] | null {
		if (originalLength < desiredLength || modifiedLength < desiredLength) {
			return null;
		}
		const originalMax = originalStart + originalLength - desiredLength + 1;
		const modifiedMax = modifiedStart + modifiedLength - desiredLength + 1;
		let bestScore = 0;
		let bestOriginalStart = 0;
		let bestModifiedStart = 0;
		for (let i = originalStart; i < originalMax; i++) {
			for (let j = modifiedStart; j < modifiedMax; j++) {
				const score = this._contiguousSequenceScore(i, j, desiredLength);
				if (score > 0 && score > bestScore) {
					bestScore = score;
					bestOriginalStart = i;
					bestModifiedStart = j;
				}
			}
		}
		if (bestScore > 0) {
			return [bestOriginalStart, bestModifiedStart];
		}
		return null;
	}

	private _contiguousSequenceScore(originalStart: number, modifiedStart: number, length: number): number {
		let score = 0;
		for (let l = 0; l < length; l++) {
			if (!this.ElementsAreEqual(originalStart + l, modifiedStart + l)) {
				return 0;
			}
			score += this._originalStringElements[originalStart + l].length;
		}
		return score;
	}

	private _OriginalIsBoundary(index: number): boolean {
		if (index <= 0 || index >= this._originalElementsOrHash.length - 1) {
			return true;
		}
		return (this._hasStrings && /^\s*$/.test(this._originalStringElements[index]));
	}

	private _OriginalRegionIsBoundary(originalStart: number, originalLength: number): boolean {
		if (this._OriginalIsBoundary(originalStart) || this._OriginalIsBoundary(originalStart - 1)) {
			return true;
		}
		if (originalLength > 0) {
			const originalEnd = originalStart + originalLength;
			if (this._OriginalIsBoundary(originalEnd - 1) || this._OriginalIsBoundary(originalEnd)) {
				return true;
			}
		}
		return false;
	}

	private _ModifiedIsBoundary(index: number): boolean {
		if (index <= 0 || index >= this._modifiedElementsOrHash.length - 1) {
			return true;
		}
		return (this._hasStrings && /^\s*$/.test(this._modifiedStringElements[index]));
	}

	private _ModifiedRegionIsBoundary(modifiedStart: number, modifiedLength: number): boolean {
		if (this._ModifiedIsBoundary(modifiedStart) || this._ModifiedIsBoundary(modifiedStart - 1)) {
			return true;
		}
		if (modifiedLength > 0) {
			const modifiedEnd = modifiedStart + modifiedLength;
			if (this._ModifiedIsBoundary(modifiedEnd - 1) || this._ModifiedIsBoundary(modifiedEnd)) {
				return true;
			}
		}
		return false;
	}

	private _boundaryScore(originalStart: number, originalLength: number, modifiedStart: number, modifiedLength: number): number {
		const originalScore = (this._OriginalRegionIsBoundary(originalStart, originalLength) ? 1 : 0);
		const modifiedScore = (this._ModifiedRegionIsBoundary(modifiedStart, modifiedLength) ? 1 : 0);
		return (originalScore + modifiedScore);
	}

	/**
	 * Concatenates the two input DiffChange lists and returns the resulting
	 * list.
	 * @param The left changes
	 * @param The right changes
	 * @returns The concatenated list
	 */
	private ConcatenateChanges(left: DiffChange[], right: DiffChange[]): DiffChange[] {
		const mergedChangeArr: DiffChange[] = [];

		if (left.length === 0 || right.length === 0) {
			return (right.length > 0) ? right : left;
		} else if (this.ChangesOverlap(left[left.length - 1], right[0], mergedChangeArr)) {
			// Since we break the problem down recursively, it is possible that we
			// might recurse in the middle of a change thereby splitting it into
			// two changes. Here in the combining stage, we detect and fuse those
			// changes back together
			const result = new Array<DiffChange>(left.length + right.length - 1);
			MyArray.Copy(left, 0, result, 0, left.length - 1);
			result[left.length - 1] = mergedChangeArr[0];
			MyArray.Copy(right, 1, result, left.length, right.length - 1);

			return result;
		} else {
			const result = new Array<DiffChange>(left.length + right.length);
			MyArray.Copy(left, 0, result, 0, left.length);
			MyArray.Copy(right, 0, result, left.length, right.length);

			return result;
		}
	}

	/**
	 * Returns true if the two changes overlap and can be merged into a single
	 * change
	 * @param left The left change
	 * @param right The right change
	 * @param mergedChange The merged change if the two overlap, null otherwise
	 * @returns True if the two changes overlap
	 */
	private ChangesOverlap(left: DiffChange, right: DiffChange, mergedChangeArr: Array<DiffChange | null>): boolean {
		Debug.Assert(left.originalStart <= right.originalStart, 'Left change is not less than or equal to right change');
		Debug.Assert(left.modifiedStart <= right.modifiedStart, 'Left change is not less than or equal to right change');

		if (left.originalStart + left.originalLength >= right.originalStart || left.modifiedStart + left.modifiedLength >= right.modifiedStart) {
			const originalStart = left.originalStart;
			let originalLength = left.originalLength;
			const modifiedStart = left.modifiedStart;
			let modifiedLength = left.modifiedLength;

			if (left.originalStart + left.originalLength >= right.originalStart) {
				originalLength = right.originalStart + right.originalLength - left.originalStart;
			}
			if (left.modifiedStart + left.modifiedLength >= right.modifiedStart) {
				modifiedLength = right.modifiedStart + right.modifiedLength - left.modifiedStart;
			}

			mergedChangeArr[0] = new DiffChange(originalStart, originalLength, modifiedStart, modifiedLength);
			return true;
		} else {
			mergedChangeArr[0] = null;
			return false;
		}
	}

	/**
	 * Helper method used to clip a diagonal index to the range of valid
	 * diagonals. This also decides whether or not the diagonal index,
	 * if it exceeds the boundary, should be clipped to the boundary or clipped
	 * one inside the boundary depending on the Even/Odd status of the boundary
	 * and numDifferences.
	 * @param diagonal The index of the diagonal to clip.
	 * @param numDifferences The current number of differences being iterated upon.
	 * @param diagonalBaseIndex The base reference diagonal.
	 * @param numDiagonals The total number of diagonals.
	 * @returns The clipped diagonal index.
	 */
	private ClipDiagonalBound(diagonal: number, numDifferences: number, diagonalBaseIndex: number, numDiagonals: number): number {
		if (diagonal >= 0 && diagonal < numDiagonals) {
			// Nothing to clip, its in range
			return diagonal;
		}

		// diagonalsBelow: The number of diagonals below the reference diagonal
		// diagonalsAbove: The number of diagonals above the reference diagonal
		const diagonalsBelow = diagonalBaseIndex;
		const diagonalsAbove = numDiagonals - diagonalBaseIndex - 1;
		const diffEven = (numDifferences % 2 === 0);

		if (diagonal < 0) {
			const lowerBoundEven = (diagonalsBelow % 2 === 0);
			return (diffEven === lowerBoundEven) ? 0 : 1;
		} else {
			const upperBoundEven = (diagonalsAbove % 2 === 0);
			return (diffEven === upperBoundEven) ? numDiagonals - 1 : numDiagonals - 2;
		}
	}
}


/**
 * Precomputed equality array for character codes.
 */
const precomputedEqualityArray = new Uint32Array(0x10000);

/**
 * Computes the Levenshtein distance for strings of length <= 32.
 * @param firstString - The first string.
 * @param secondString - The second string.
 * @returns The Levenshtein distance.
 */
const computeLevenshteinDistanceForShortStrings = (firstString: string, secondString: string): number => {
	const firstStringLength = firstString.length;
	const secondStringLength = secondString.length;
	const lastBitMask = 1 << (firstStringLength - 1);
	let positiveVector = -1;
	let negativeVector = 0;
	let distance = firstStringLength;
	let index = firstStringLength;

	// Initialize precomputedEqualityArray for firstString
	while (index--) {
		precomputedEqualityArray[firstString.charCodeAt(index)] |= 1 << index;
	}

	// Process each character of secondString
	for (index = 0; index < secondStringLength; index++) {
		let equalityMask = precomputedEqualityArray[secondString.charCodeAt(index)];
		const combinedVector = equalityMask | negativeVector;
		equalityMask |= ((equalityMask & positiveVector) + positiveVector) ^ positiveVector;
		negativeVector |= ~(equalityMask | positiveVector);
		positiveVector &= equalityMask;
		if (negativeVector & lastBitMask) {
			distance++;
		}
		if (positiveVector & lastBitMask) {
			distance--;
		}
		negativeVector = (negativeVector << 1) | 1;
		positiveVector = (positiveVector << 1) | ~(combinedVector | negativeVector);
		negativeVector &= combinedVector;
	}

	// Reset precomputedEqualityArray
	index = firstStringLength;
	while (index--) {
		precomputedEqualityArray[firstString.charCodeAt(index)] = 0;
	}

	return distance;
};

/**
 * Computes the Levenshtein distance for strings of length > 32.
 * @param firstString - The first string.
 * @param secondString - The second string.
 * @returns The Levenshtein distance.
 */
function computeLevenshteinDistanceForLongStrings(firstString: string, secondString: string): number {
	const firstStringLength = firstString.length;
	const secondStringLength = secondString.length;
	const horizontalBitArray = [];
	const verticalBitArray = [];
	const horizontalSize = Math.ceil(firstStringLength / 32);
	const verticalSize = Math.ceil(secondStringLength / 32);

	// Initialize horizontal and vertical bit arrays
	for (let i = 0; i < horizontalSize; i++) {
		horizontalBitArray[i] = -1;
		verticalBitArray[i] = 0;
	}

	let verticalIndex = 0;
	for (; verticalIndex < verticalSize - 1; verticalIndex++) {
		let negativeVector = 0;
		let positiveVector = -1;
		const start = verticalIndex * 32;
		const verticalLength = Math.min(32, secondStringLength) + start;

		// Initialize precomputedEqualityArray for secondString
		for (let k = start; k < verticalLength; k++) {
			precomputedEqualityArray[secondString.charCodeAt(k)] |= 1 << k;
		}

		// Process each character of firstString
		for (let i = 0; i < firstStringLength; i++) {
			const equalityMask = precomputedEqualityArray[firstString.charCodeAt(i)];
			const previousBit = (horizontalBitArray[(i / 32) | 0] >>> i) & 1;
			const matchBit = (verticalBitArray[(i / 32) | 0] >>> i) & 1;
			const combinedVector = equalityMask | negativeVector;
			const combinedHorizontalVector = ((((equalityMask | matchBit) & positiveVector) + positiveVector) ^ positiveVector) | equalityMask | matchBit;
			let positiveHorizontalVector = negativeVector | ~(combinedHorizontalVector | positiveVector);
			let negativeHorizontalVector = positiveVector & combinedHorizontalVector;
			if ((positiveHorizontalVector >>> 31) ^ previousBit) {
				horizontalBitArray[(i / 32) | 0] ^= 1 << i;
			}
			if ((negativeHorizontalVector >>> 31) ^ matchBit) {
				verticalBitArray[(i / 32) | 0] ^= 1 << i;
			}
			positiveHorizontalVector = (positiveHorizontalVector << 1) | previousBit;
			negativeHorizontalVector = (negativeHorizontalVector << 1) | matchBit;
			positiveVector = negativeHorizontalVector | ~(combinedVector | positiveHorizontalVector);
			negativeVector = positiveHorizontalVector & combinedVector;
		}

		// Reset precomputedEqualityArray
		for (let k = start; k < verticalLength; k++) {
			precomputedEqualityArray[secondString.charCodeAt(k)] = 0;
		}
	}

	let negativeVector = 0;
	let positiveVector = -1;
	const start = verticalIndex * 32;
	const verticalLength = Math.min(32, secondStringLength - start) + start;

	// Initialize precomputedEqualityArray for secondString
	for (let k = start; k < verticalLength; k++) {
		precomputedEqualityArray[secondString.charCodeAt(k)] |= 1 << k;
	}

	let distance = secondStringLength;

	// Process each character of firstString
	for (let i = 0; i < firstStringLength; i++) {
		const equalityMask = precomputedEqualityArray[firstString.charCodeAt(i)];
		const previousBit = (horizontalBitArray[(i / 32) | 0] >>> i) & 1;
		const matchBit = (verticalBitArray[(i / 32) | 0] >>> i) & 1;
		const combinedVector = equalityMask | negativeVector;
		const combinedHorizontalVector = ((((equalityMask | matchBit) & positiveVector) + positiveVector) ^ positiveVector) | equalityMask | matchBit;
		let positiveHorizontalVector = negativeVector | ~(combinedHorizontalVector | positiveVector);
		let negativeHorizontalVector = positiveVector & combinedHorizontalVector;
		distance += (positiveHorizontalVector >>> (secondStringLength - 1)) & 1;
		distance -= (negativeHorizontalVector >>> (secondStringLength - 1)) & 1;
		if ((positiveHorizontalVector >>> 31) ^ previousBit) {
			horizontalBitArray[(i / 32) | 0] ^= 1 << i;
		}
		if ((negativeHorizontalVector >>> 31) ^ matchBit) {
			verticalBitArray[(i / 32) | 0] ^= 1 << i;
		}
		positiveHorizontalVector = (positiveHorizontalVector << 1) | previousBit;
		negativeHorizontalVector = (negativeHorizontalVector << 1) | matchBit;
		positiveVector = negativeHorizontalVector | ~(combinedVector | positiveHorizontalVector);
		negativeVector = positiveHorizontalVector & combinedVector;
	}

	// Reset precomputedEqualityArray
	for (let k = start; k < verticalLength; k++) {
		precomputedEqualityArray[secondString.charCodeAt(k)] = 0;
	}

	return distance;
}

/**
 * Computes the Levenshtein distance between two strings.
 * @param firstString - The first string.
 * @param secondString - The second string.
 * @returns The Levenshtein distance.
 */
export function computeLevenshteinDistance(firstString: string, secondString: string): number {
	if (firstString.length < secondString.length) {
		const temp = secondString;
		secondString = firstString;
		firstString = temp;
	}
	if (secondString.length === 0) {
		return firstString.length;
	}
	if (firstString.length <= 32) {
		return computeLevenshteinDistanceForShortStrings(firstString, secondString);
	}
	return computeLevenshteinDistanceForLongStrings(firstString, secondString);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/diff/diffChange.ts]---
Location: vscode-main/src/vs/base/common/diff/diffChange.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Represents information about a specific difference between two sequences.
 */
export class DiffChange {

	/**
	 * The position of the first element in the original sequence which
	 * this change affects.
	 */
	public originalStart: number;

	/**
	 * The number of elements from the original sequence which were
	 * affected.
	 */
	public originalLength: number;

	/**
	 * The position of the first element in the modified sequence which
	 * this change affects.
	 */
	public modifiedStart: number;

	/**
	 * The number of elements from the modified sequence which were
	 * affected (added).
	 */
	public modifiedLength: number;

	/**
	 * Constructs a new DiffChange with the given sequence information
	 * and content.
	 */
	constructor(originalStart: number, originalLength: number, modifiedStart: number, modifiedLength: number) {
		//Debug.Assert(originalLength > 0 || modifiedLength > 0, "originalLength and modifiedLength cannot both be <= 0");
		this.originalStart = originalStart;
		this.originalLength = originalLength;
		this.modifiedStart = modifiedStart;
		this.modifiedLength = modifiedLength;
	}

	/**
	 * The end point (exclusive) of the change in the original sequence.
	 */
	public getOriginalEnd() {
		return this.originalStart + this.originalLength;
	}

	/**
	 * The end point (exclusive) of the change in the modified sequence.
	 */
	public getModifiedEnd() {
		return this.modifiedStart + this.modifiedLength;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/marked/cgmanifest.json]---
Location: vscode-main/src/vs/base/common/marked/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "marked",
					"repositoryUrl": "https://github.com/markedjs/marked",
					"commitHash": "7972d7f9b578a31b32f469c14fc97c39ceb2b6c6"
				}
			},
			"license": "MIT",
			"version": "14.0.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/common/marked/marked.d.ts]---
Location: vscode-main/src/vs/base/common/marked/marked.d.ts

```typescript
// Generated by dts-bundle-generator v9.5.1

export type MarkedToken = (Tokens.Space | Tokens.Code | Tokens.Heading | Tokens.Table | Tokens.Hr | Tokens.Blockquote | Tokens.List | Tokens.ListItem | Tokens.Paragraph | Tokens.HTML | Tokens.Text | Tokens.Def | Tokens.Escape | Tokens.Tag | Tokens.Image | Tokens.Link | Tokens.Strong | Tokens.Em | Tokens.Codespan | Tokens.Br | Tokens.Del);
export type Token = (MarkedToken | Tokens.Generic);
export declare namespace Tokens {
	interface Space {
		type: "space";
		raw: string;
	}
	interface Code {
		type: "code";
		raw: string;
		codeBlockStyle?: "indented" | undefined;
		lang?: string | undefined;
		text: string;
		escaped?: boolean;
	}
	interface Heading {
		type: "heading";
		raw: string;
		depth: number;
		text: string;
		tokens: Token[];
	}
	interface Table {
		type: "table";
		raw: string;
		align: Array<"center" | "left" | "right" | null>;
		header: TableCell[];
		rows: TableCell[][];
	}
	interface TableRow {
		text: string;
	}
	interface TableCell {
		text: string;
		tokens: Token[];
		header: boolean;
		align: "center" | "left" | "right" | null;
	}
	interface Hr {
		type: "hr";
		raw: string;
	}
	interface Blockquote {
		type: "blockquote";
		raw: string;
		text: string;
		tokens: Token[];
	}
	interface List {
		type: "list";
		raw: string;
		ordered: boolean;
		start: number | "";
		loose: boolean;
		items: ListItem[];
	}
	interface ListItem {
		type: "list_item";
		raw: string;
		task: boolean;
		checked?: boolean | undefined;
		loose: boolean;
		text: string;
		tokens: Token[];
	}
	interface Checkbox {
		checked: boolean;
	}
	interface Paragraph {
		type: "paragraph";
		raw: string;
		pre?: boolean | undefined;
		text: string;
		tokens: Token[];
	}
	interface HTML {
		type: "html";
		raw: string;
		pre: boolean;
		text: string;
		block: boolean;
	}
	interface Text {
		type: "text";
		raw: string;
		text: string;
		tokens?: Token[];
	}
	interface Def {
		type: "def";
		raw: string;
		tag: string;
		href: string;
		title: string;
	}
	interface Escape {
		type: "escape";
		raw: string;
		text: string;
	}
	interface Tag {
		type: "text" | "html";
		raw: string;
		inLink: boolean;
		inRawBlock: boolean;
		text: string;
		block: boolean;
	}
	interface Link {
		type: "link";
		raw: string;
		href: string;
		title?: string | null;
		text: string;
		tokens: Token[];
	}
	interface Image {
		type: "image";
		raw: string;
		href: string;
		title: string | null;
		text: string;
	}
	interface Strong {
		type: "strong";
		raw: string;
		text: string;
		tokens: Token[];
	}
	interface Em {
		type: "em";
		raw: string;
		text: string;
		tokens: Token[];
	}
	interface Codespan {
		type: "codespan";
		raw: string;
		text: string;
	}
	interface Br {
		type: "br";
		raw: string;
	}
	interface Del {
		type: "del";
		raw: string;
		text: string;
		tokens: Token[];
	}
	interface Generic {
		[index: string]: any;
		type: string;
		raw: string;
		tokens?: Token[] | undefined;
	}
}
export type Links = Record<string, Pick<Tokens.Link | Tokens.Image, "href" | "title">>;
export type TokensList = Token[] & {
	links: Links;
};
/**
 * Renderer
 */
declare class _Renderer {
	options: MarkedOptions;
	parser: _Parser;
	constructor(options?: MarkedOptions);
	space(token: Tokens.Space): string;
	code({ text, lang, escaped }: Tokens.Code): string;
	blockquote({ tokens }: Tokens.Blockquote): string;
	html({ text }: Tokens.HTML | Tokens.Tag): string;
	heading({ tokens, depth }: Tokens.Heading): string;
	hr(token: Tokens.Hr): string;
	list(token: Tokens.List): string;
	listitem(item: Tokens.ListItem): string;
	checkbox({ checked }: Tokens.Checkbox): string;
	paragraph({ tokens }: Tokens.Paragraph): string;
	table(token: Tokens.Table): string;
	tablerow({ text }: Tokens.TableRow): string;
	tablecell(token: Tokens.TableCell): string;
	/**
	 * span level renderer
	 */
	strong({ tokens }: Tokens.Strong): string;
	em({ tokens }: Tokens.Em): string;
	codespan({ text }: Tokens.Codespan): string;
	br(token: Tokens.Br): string;
	del({ tokens }: Tokens.Del): string;
	link({ href, title, tokens }: Tokens.Link): string;
	image({ href, title, text }: Tokens.Image): string;
	text(token: Tokens.Text | Tokens.Escape | Tokens.Tag): string;
}
/**
 * TextRenderer
 * returns only the textual part of the token
 */
declare class _TextRenderer {
	strong({ text }: Tokens.Strong): string;
	em({ text }: Tokens.Em): string;
	codespan({ text }: Tokens.Codespan): string;
	del({ text }: Tokens.Del): string;
	html({ text }: Tokens.HTML | Tokens.Tag): string;
	text({ text }: Tokens.Text | Tokens.Escape | Tokens.Tag): string;
	link({ text }: Tokens.Link): string;
	image({ text }: Tokens.Image): string;
	br(): string;
}
/**
 * Parsing & Compiling
 */
declare class _Parser {
	options: MarkedOptions;
	renderer: _Renderer;
	textRenderer: _TextRenderer;
	constructor(options?: MarkedOptions);
	/**
	 * Static Parse Method
	 */
	static parse(tokens: Token[], options?: MarkedOptions): string;
	/**
	 * Static Parse Inline Method
	 */
	static parseInline(tokens: Token[], options?: MarkedOptions): string;
	/**
	 * Parse Loop
	 */
	parse(tokens: Token[], top?: boolean): string;
	/**
	 * Parse Inline Tokens
	 */
	parseInline(tokens: Token[], renderer?: _Renderer | _TextRenderer): string;
}
declare const blockNormal: {
	blockquote: RegExp;
	code: RegExp;
	def: RegExp;
	fences: RegExp;
	heading: RegExp;
	hr: RegExp;
	html: RegExp;
	lheading: RegExp;
	list: RegExp;
	newline: RegExp;
	paragraph: RegExp;
	table: RegExp;
	text: RegExp;
};
export type BlockKeys = keyof typeof blockNormal;
declare const inlineNormal: {
	_backpedal: RegExp;
	anyPunctuation: RegExp;
	autolink: RegExp;
	blockSkip: RegExp;
	br: RegExp;
	code: RegExp;
	del: RegExp;
	emStrongLDelim: RegExp;
	emStrongRDelimAst: RegExp;
	emStrongRDelimUnd: RegExp;
	escape: RegExp;
	link: RegExp;
	nolink: RegExp;
	punctuation: RegExp;
	reflink: RegExp;
	reflinkSearch: RegExp;
	tag: RegExp;
	text: RegExp;
	url: RegExp;
};
export type InlineKeys = keyof typeof inlineNormal;
/**
 * exports
 */
export declare const block: {
	normal: {
		blockquote: RegExp;
		code: RegExp;
		def: RegExp;
		fences: RegExp;
		heading: RegExp;
		hr: RegExp;
		html: RegExp;
		lheading: RegExp;
		list: RegExp;
		newline: RegExp;
		paragraph: RegExp;
		table: RegExp;
		text: RegExp;
	};
	gfm: Record<"code" | "blockquote" | "hr" | "html" | "table" | "text" | "heading" | "list" | "paragraph" | "def" | "fences" | "lheading" | "newline", RegExp>;
	pedantic: Record<"code" | "blockquote" | "hr" | "html" | "table" | "text" | "heading" | "list" | "paragraph" | "def" | "fences" | "lheading" | "newline", RegExp>;
};
export declare const inline: {
	normal: {
		_backpedal: RegExp;
		anyPunctuation: RegExp;
		autolink: RegExp;
		blockSkip: RegExp;
		br: RegExp;
		code: RegExp;
		del: RegExp;
		emStrongLDelim: RegExp;
		emStrongRDelimAst: RegExp;
		emStrongRDelimUnd: RegExp;
		escape: RegExp;
		link: RegExp;
		nolink: RegExp;
		punctuation: RegExp;
		reflink: RegExp;
		reflinkSearch: RegExp;
		tag: RegExp;
		text: RegExp;
		url: RegExp;
	};
	gfm: Record<"link" | "code" | "url" | "br" | "del" | "text" | "escape" | "tag" | "reflink" | "autolink" | "nolink" | "_backpedal" | "anyPunctuation" | "blockSkip" | "emStrongLDelim" | "emStrongRDelimAst" | "emStrongRDelimUnd" | "punctuation" | "reflinkSearch", RegExp>;
	breaks: Record<"link" | "code" | "url" | "br" | "del" | "text" | "escape" | "tag" | "reflink" | "autolink" | "nolink" | "_backpedal" | "anyPunctuation" | "blockSkip" | "emStrongLDelim" | "emStrongRDelimAst" | "emStrongRDelimUnd" | "punctuation" | "reflinkSearch", RegExp>;
	pedantic: Record<"link" | "code" | "url" | "br" | "del" | "text" | "escape" | "tag" | "reflink" | "autolink" | "nolink" | "_backpedal" | "anyPunctuation" | "blockSkip" | "emStrongLDelim" | "emStrongRDelimAst" | "emStrongRDelimUnd" | "punctuation" | "reflinkSearch", RegExp>;
};
export interface Rules {
	block: Record<BlockKeys, RegExp>;
	inline: Record<InlineKeys, RegExp>;
}
/**
 * Tokenizer
 */
declare class _Tokenizer {
	options: MarkedOptions;
	rules: Rules;
	lexer: _Lexer;
	constructor(options?: MarkedOptions);
	space(src: string): Tokens.Space | undefined;
	code(src: string): Tokens.Code | undefined;
	fences(src: string): Tokens.Code | undefined;
	heading(src: string): Tokens.Heading | undefined;
	hr(src: string): Tokens.Hr | undefined;
	blockquote(src: string): Tokens.Blockquote | undefined;
	list(src: string): Tokens.List | undefined;
	html(src: string): Tokens.HTML | undefined;
	def(src: string): Tokens.Def | undefined;
	table(src: string): Tokens.Table | undefined;
	lheading(src: string): Tokens.Heading | undefined;
	paragraph(src: string): Tokens.Paragraph | undefined;
	text(src: string): Tokens.Text | undefined;
	escape(src: string): Tokens.Escape | undefined;
	tag(src: string): Tokens.Tag | undefined;
	link(src: string): Tokens.Link | Tokens.Image | undefined;
	reflink(src: string, links: Links): Tokens.Link | Tokens.Image | Tokens.Text | undefined;
	emStrong(src: string, maskedSrc: string, prevChar?: string): Tokens.Em | Tokens.Strong | undefined;
	codespan(src: string): Tokens.Codespan | undefined;
	br(src: string): Tokens.Br | undefined;
	del(src: string): Tokens.Del | undefined;
	autolink(src: string): Tokens.Link | undefined;
	url(src: string): Tokens.Link | undefined;
	inlineText(src: string): Tokens.Text | undefined;
}
declare class _Hooks {
	options: MarkedOptions;
	constructor(options?: MarkedOptions);
	static passThroughHooks: Set<string>;
	/**
	 * Process markdown before marked
	 */
	preprocess(markdown: string): string;
	/**
	 * Process HTML after marked is finished
	 */
	postprocess(html: string): string;
	/**
	 * Process all tokens before walk tokens
	 */
	processAllTokens(tokens: Token[] | TokensList): Token[] | TokensList;
}
export interface TokenizerThis {
	lexer: _Lexer;
}
export type TokenizerExtensionFunction = (this: TokenizerThis, src: string, tokens: Token[] | TokensList) => Tokens.Generic | undefined;
export type TokenizerStartFunction = (this: TokenizerThis, src: string) => number | void;
export interface TokenizerExtension {
	name: string;
	level: "block" | "inline";
	start?: TokenizerStartFunction | undefined;
	tokenizer: TokenizerExtensionFunction;
	childTokens?: string[] | undefined;
}
export interface RendererThis {
	parser: _Parser;
}
export type RendererExtensionFunction = (this: RendererThis, token: Tokens.Generic) => string | false | undefined;
export interface RendererExtension {
	name: string;
	renderer: RendererExtensionFunction;
}
export type TokenizerAndRendererExtension = TokenizerExtension | RendererExtension | (TokenizerExtension & RendererExtension);
export type HooksApi = Omit<_Hooks, "constructor" | "options">;
export type HooksObject = {
	[K in keyof HooksApi]?: (this: _Hooks, ...args: Parameters<HooksApi[K]>) => ReturnType<HooksApi[K]> | Promise<ReturnType<HooksApi[K]>>;
};
export type RendererApi = Omit<_Renderer, "constructor" | "options" | "parser">;
export type RendererObject = {
	[K in keyof RendererApi]?: (this: _Renderer, ...args: Parameters<RendererApi[K]>) => ReturnType<RendererApi[K]> | false;
};
export type TokenizerApi = Omit<_Tokenizer, "constructor" | "options" | "rules" | "lexer">;
export type TokenizerObject = {
	[K in keyof TokenizerApi]?: (this: _Tokenizer, ...args: Parameters<TokenizerApi[K]>) => ReturnType<TokenizerApi[K]> | false;
};
export interface MarkedExtension {
	/**
	 * True will tell marked to await any walkTokens functions before parsing the tokens and returning an HTML string.
	 */
	async?: boolean;
	/**
	 * Enable GFM line breaks. This option requires the gfm option to be true.
	 */
	breaks?: boolean | undefined;
	/**
	 * Add tokenizers and renderers to marked
	 */
	extensions?: TokenizerAndRendererExtension[] | undefined | null;
	/**
	 * Enable GitHub flavored markdown.
	 */
	gfm?: boolean | undefined;
	/**
	 * Hooks are methods that hook into some part of marked.
	 * preprocess is called to process markdown before sending it to marked.
	 * processAllTokens is called with the TokensList before walkTokens.
	 * postprocess is called to process html after marked has finished parsing.
	 */
	hooks?: HooksObject | undefined | null;
	/**
	 * Conform to obscure parts of markdown.pl as much as possible. Don't fix any of the original markdown bugs or poor behavior.
	 */
	pedantic?: boolean | undefined;
	/**
	 * Type: object Default: new Renderer()
	 *
	 * An object containing functions to render tokens to HTML.
	 */
	renderer?: RendererObject | undefined | null;
	/**
	 * Shows an HTML error message when rendering fails.
	 */
	silent?: boolean | undefined;
	/**
	 * The tokenizer defines how to turn markdown text into tokens.
	 */
	tokenizer?: TokenizerObject | undefined | null;
	/**
	 * The walkTokens function gets called with every token.
	 * Child tokens are called before moving on to sibling tokens.
	 * Each token is passed by reference so updates are persisted when passed to the parser.
	 * The return value of the function is ignored.
	 */
	walkTokens?: ((token: Token) => void | Promise<void>) | undefined | null;
}
export interface MarkedOptions extends Omit<MarkedExtension, "hooks" | "renderer" | "tokenizer" | "extensions" | "walkTokens"> {
	/**
	 * Hooks are methods that hook into some part of marked.
	 */
	hooks?: _Hooks | undefined | null;
	/**
	 * Type: object Default: new Renderer()
	 *
	 * An object containing functions to render tokens to HTML.
	 */
	renderer?: _Renderer | undefined | null;
	/**
	 * The tokenizer defines how to turn markdown text into tokens.
	 */
	tokenizer?: _Tokenizer | undefined | null;
	/**
	 * Custom extensions
	 */
	extensions?: null | {
		renderers: {
			[name: string]: RendererExtensionFunction;
		};
		childTokens: {
			[name: string]: string[];
		};
		inline?: TokenizerExtensionFunction[];
		block?: TokenizerExtensionFunction[];
		startInline?: TokenizerStartFunction[];
		startBlock?: TokenizerStartFunction[];
	};
	/**
	 * walkTokens function returns array of values for Promise.all
	 */
	walkTokens?: null | ((token: Token) => void | Promise<void> | (void | Promise<void>)[]);
}
/**
 * Block Lexer
 */
declare class _Lexer {
	tokens: TokensList;
	options: MarkedOptions;
	state: {
		inLink: boolean;
		inRawBlock: boolean;
		top: boolean;
	};
	private tokenizer;
	private inlineQueue;
	constructor(options?: MarkedOptions);
	/**
	 * Expose Rules
	 */
	static get rules(): {
		block: {
			normal: {
				blockquote: RegExp;
				code: RegExp;
				def: RegExp;
				fences: RegExp;
				heading: RegExp;
				hr: RegExp;
				html: RegExp;
				lheading: RegExp;
				list: RegExp;
				newline: RegExp;
				paragraph: RegExp;
				table: RegExp;
				text: RegExp;
			};
			gfm: Record<"code" | "blockquote" | "hr" | "html" | "table" | "text" | "heading" | "list" | "paragraph" | "def" | "fences" | "lheading" | "newline", RegExp>;
			pedantic: Record<"code" | "blockquote" | "hr" | "html" | "table" | "text" | "heading" | "list" | "paragraph" | "def" | "fences" | "lheading" | "newline", RegExp>;
		};
		inline: {
			normal: {
				_backpedal: RegExp;
				anyPunctuation: RegExp;
				autolink: RegExp;
				blockSkip: RegExp;
				br: RegExp;
				code: RegExp;
				del: RegExp;
				emStrongLDelim: RegExp;
				emStrongRDelimAst: RegExp;
				emStrongRDelimUnd: RegExp;
				escape: RegExp;
				link: RegExp;
				nolink: RegExp;
				punctuation: RegExp;
				reflink: RegExp;
				reflinkSearch: RegExp;
				tag: RegExp;
				text: RegExp;
				url: RegExp;
			};
			gfm: Record<"link" | "code" | "url" | "br" | "del" | "text" | "escape" | "tag" | "reflink" | "autolink" | "nolink" | "_backpedal" | "anyPunctuation" | "blockSkip" | "emStrongLDelim" | "emStrongRDelimAst" | "emStrongRDelimUnd" | "punctuation" | "reflinkSearch", RegExp>;
			breaks: Record<"link" | "code" | "url" | "br" | "del" | "text" | "escape" | "tag" | "reflink" | "autolink" | "nolink" | "_backpedal" | "anyPunctuation" | "blockSkip" | "emStrongLDelim" | "emStrongRDelimAst" | "emStrongRDelimUnd" | "punctuation" | "reflinkSearch", RegExp>;
			pedantic: Record<"link" | "code" | "url" | "br" | "del" | "text" | "escape" | "tag" | "reflink" | "autolink" | "nolink" | "_backpedal" | "anyPunctuation" | "blockSkip" | "emStrongLDelim" | "emStrongRDelimAst" | "emStrongRDelimUnd" | "punctuation" | "reflinkSearch", RegExp>;
		};
	};
	/**
	 * Static Lex Method
	 */
	static lex(src: string, options?: MarkedOptions): TokensList;
	/**
	 * Static Lex Inline Method
	 */
	static lexInline(src: string, options?: MarkedOptions): Token[];
	/**
	 * Preprocessing
	 */
	lex(src: string): TokensList;
	/**
	 * Lexing
	 */
	blockTokens(src: string, tokens?: Token[], lastParagraphClipped?: boolean): Token[];
	blockTokens(src: string, tokens?: TokensList, lastParagraphClipped?: boolean): TokensList;
	inline(src: string, tokens?: Token[]): Token[];
	/**
	 * Lexing/Compiling
	 */
	inlineTokens(src: string, tokens?: Token[]): Token[];
}
/**
 * Gets the original marked default options.
 */
declare function _getDefaults(): MarkedOptions;
declare let _defaults: MarkedOptions;
export type MaybePromise = void | Promise<void>;
export declare class Marked {
	defaults: MarkedOptions;
	options: (opt: MarkedOptions) => this;
	parse: {
		(src: string, options: MarkedOptions & {
			async: true;
		}): Promise<string>;
		(src: string, options: MarkedOptions & {
			async: false;
		}): string;
		(src: string, options?: MarkedOptions | undefined | null): string | Promise<string>;
	};
	parseInline: {
		(src: string, options: MarkedOptions & {
			async: true;
		}): Promise<string>;
		(src: string, options: MarkedOptions & {
			async: false;
		}): string;
		(src: string, options?: MarkedOptions | undefined | null): string | Promise<string>;
	};
	Parser: typeof _Parser;
	Renderer: typeof _Renderer;
	TextRenderer: typeof _TextRenderer;
	Lexer: typeof _Lexer;
	Tokenizer: typeof _Tokenizer;
	Hooks: typeof _Hooks;
	constructor(...args: MarkedExtension[]);
	/**
	 * Run callback for every token
	 */
	walkTokens(tokens: Token[] | TokensList, callback: (token: Token) => MaybePromise | MaybePromise[]): MaybePromise[];
	use(...args: MarkedExtension[]): this;
	setOptions(opt: MarkedOptions): this;
	lexer(src: string, options?: MarkedOptions): TokensList;
	parser(tokens: Token[], options?: MarkedOptions): string;
	private parseMarkdown;
	private onError;
}
/**
 * Compiles markdown to HTML asynchronously.
 *
 * @param src String of markdown source to be compiled
 * @param options Hash of options, having async: true
 * @return Promise of string of compiled HTML
 */
export declare function marked(src: string, options: MarkedOptions & {
	async: true;
}): Promise<string>;
/**
 * Compiles markdown to HTML.
 *
 * @param src String of markdown source to be compiled
 * @param options Optional hash of options
 * @return String of compiled HTML. Will be a Promise of string if async is set to true by any extensions.
 */
export declare function marked(src: string, options: MarkedOptions & {
	async: false;
}): string;
export declare function marked(src: string, options: MarkedOptions & {
	async: true;
}): Promise<string>;
export declare function marked(src: string, options?: MarkedOptions | undefined | null): string | Promise<string>;
export declare namespace marked {
	var options: (options: MarkedOptions) => typeof marked;
	var setOptions: (options: MarkedOptions) => typeof marked;
	var getDefaults: typeof _getDefaults;
	var defaults: MarkedOptions;
	var use: (...args: MarkedExtension[]) => typeof marked;
	var walkTokens: (tokens: Token[] | TokensList, callback: (token: Token) => MaybePromise | MaybePromise[]) => MaybePromise[];
	var parseInline: {
		(src: string, options: MarkedOptions & {
			async: true;
		}): Promise<string>;
		(src: string, options: MarkedOptions & {
			async: false;
		}): string;
		(src: string, options?: MarkedOptions | undefined | null): string | Promise<string>;
	};
	var Parser: typeof _Parser;
	var parser: typeof _Parser.parse;
	var Renderer: typeof _Renderer;
	var TextRenderer: typeof _TextRenderer;
	var Lexer: typeof _Lexer;
	var lexer: typeof _Lexer.lex;
	var Tokenizer: typeof _Tokenizer;
	var Hooks: typeof _Hooks;
	var parse: typeof marked;
}
export declare const options: (options: MarkedOptions) => typeof marked;
export declare const setOptions: (options: MarkedOptions) => typeof marked;
export declare const use: (...args: MarkedExtension[]) => typeof marked;
export declare const walkTokens: (tokens: Token[] | TokensList, callback: (token: Token) => MaybePromise | MaybePromise[]) => MaybePromise[];
export declare const parseInline: {
	(src: string, options: MarkedOptions & {
		async: true;
	}): Promise<string>;
	(src: string, options: MarkedOptions & {
		async: false;
	}): string;
	(src: string, options?: MarkedOptions | undefined | null): string | Promise<string>;
};
export declare const parse: typeof marked;
export declare const parser: typeof _Parser.parse;
export declare const lexer: typeof _Lexer.lex;

export {
	_Hooks as Hooks,
	_Lexer as Lexer,
	_Parser as Parser,
	_Renderer as Renderer,
	_TextRenderer as TextRenderer,
	_Tokenizer as Tokenizer,
	_defaults as defaults,
	_getDefaults as getDefaults,
};

export { };
```

--------------------------------------------------------------------------------

````
