---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 265
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 265 of 552)

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

---[FILE: src/vs/platform/contextkey/common/contextkey.ts]---
Location: vscode-main/src/vs/platform/contextkey/common/contextkey.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../base/common/charCode.js';
import { Event } from '../../../base/common/event.js';
import { isChrome, isEdge, isFirefox, isLinux, isMacintosh, isSafari, isWeb, isWindows } from '../../../base/common/platform.js';
import { isFalsyOrWhitespace } from '../../../base/common/strings.js';
import { Scanner, LexingError, Token, TokenType } from './scanner.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { localize } from '../../../nls.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { illegalArgument } from '../../../base/common/errors.js';

const CONSTANT_VALUES = new Map<string, boolean>();
CONSTANT_VALUES.set('false', false);
CONSTANT_VALUES.set('true', true);
CONSTANT_VALUES.set('isMac', isMacintosh);
CONSTANT_VALUES.set('isLinux', isLinux);
CONSTANT_VALUES.set('isWindows', isWindows);
CONSTANT_VALUES.set('isWeb', isWeb);
CONSTANT_VALUES.set('isMacNative', isMacintosh && !isWeb);
CONSTANT_VALUES.set('isEdge', isEdge);
CONSTANT_VALUES.set('isFirefox', isFirefox);
CONSTANT_VALUES.set('isChrome', isChrome);
CONSTANT_VALUES.set('isSafari', isSafari);

/** allow register constant context keys that are known only after startup; requires running `substituteConstants` on the context key - https://github.com/microsoft/vscode/issues/174218#issuecomment-1437972127 */
export function setConstant(key: string, value: boolean) {
	if (CONSTANT_VALUES.get(key) !== undefined) { throw illegalArgument('contextkey.setConstant(k, v) invoked with already set constant `k`'); }

	CONSTANT_VALUES.set(key, value);
}

const hasOwnProperty = Object.prototype.hasOwnProperty;

export const enum ContextKeyExprType {
	False = 0,
	True = 1,
	Defined = 2,
	Not = 3,
	Equals = 4,
	NotEquals = 5,
	And = 6,
	Regex = 7,
	NotRegex = 8,
	Or = 9,
	In = 10,
	NotIn = 11,
	Greater = 12,
	GreaterEquals = 13,
	Smaller = 14,
	SmallerEquals = 15,
}

export interface IContextKeyExprMapper {
	mapDefined(key: string): ContextKeyExpression;
	mapNot(key: string): ContextKeyExpression;
	mapEquals(key: string, value: any): ContextKeyExpression;
	mapNotEquals(key: string, value: any): ContextKeyExpression;
	mapGreater(key: string, value: any): ContextKeyExpression;
	mapGreaterEquals(key: string, value: any): ContextKeyExpression;
	mapSmaller(key: string, value: any): ContextKeyExpression;
	mapSmallerEquals(key: string, value: any): ContextKeyExpression;
	mapRegex(key: string, regexp: RegExp | null): ContextKeyRegexExpr;
	mapIn(key: string, valueKey: string): ContextKeyInExpr;
	mapNotIn(key: string, valueKey: string): ContextKeyNotInExpr;
}

export interface IContextKeyExpression {
	cmp(other: ContextKeyExpression): number;
	equals(other: ContextKeyExpression): boolean;
	substituteConstants(): ContextKeyExpression | undefined;
	evaluate(context: IContext): boolean;
	serialize(): string;
	keys(): string[];
	map(mapFnc: IContextKeyExprMapper): ContextKeyExpression;
	negate(): ContextKeyExpression;

}

export type ContextKeyExpression = (
	ContextKeyFalseExpr | ContextKeyTrueExpr | ContextKeyDefinedExpr | ContextKeyNotExpr
	| ContextKeyEqualsExpr | ContextKeyNotEqualsExpr | ContextKeyRegexExpr
	| ContextKeyNotRegexExpr | ContextKeyAndExpr | ContextKeyOrExpr | ContextKeyInExpr
	| ContextKeyNotInExpr | ContextKeyGreaterExpr | ContextKeyGreaterEqualsExpr
	| ContextKeySmallerExpr | ContextKeySmallerEqualsExpr
);


/*

Syntax grammar:

```ebnf

expression ::= or

or ::= and { '||' and }*

and ::= term { '&&' term }*

term ::=
	| '!' (KEY | true | false | parenthesized)
	| primary

primary ::=
	| 'true'
	| 'false'
	| parenthesized
	| KEY '=~' REGEX
	| KEY [ ('==' | '!=' | '<' | '<=' | '>' | '>=' | 'not' 'in' | 'in') value ]

parenthesized ::=
	| '(' expression ')'

value ::=
	| 'true'
	| 'false'
	| 'in'      	// we support `in` as a value because there's an extension that uses it, ie "when": "languageId == in"
	| VALUE 		// matched by the same regex as KEY; consider putting the value in single quotes if it's a string (e.g., with spaces)
	| SINGLE_QUOTED_STR
	| EMPTY_STR  	// this allows "when": "foo == " which's used by existing extensions

```
*/

export type ParserConfig = {
	/**
	 * with this option enabled, the parser can recover from regex parsing errors, e.g., unescaped slashes: `/src//` is accepted as `/src\//` would be
	 */
	regexParsingWithErrorRecovery: boolean;
};

const defaultConfig: ParserConfig = {
	regexParsingWithErrorRecovery: true
};

export type ParsingError = {
	message: string;
	offset: number;
	lexeme: string;
	additionalInfo?: string;
};

const errorEmptyString = localize('contextkey.parser.error.emptyString', "Empty context key expression");
const hintEmptyString = localize('contextkey.parser.error.emptyString.hint', "Did you forget to write an expression? You can also put 'false' or 'true' to always evaluate to false or true, respectively.");
const errorNoInAfterNot = localize('contextkey.parser.error.noInAfterNot', "'in' after 'not'.");
const errorClosingParenthesis = localize('contextkey.parser.error.closingParenthesis', "closing parenthesis ')'");
const errorUnexpectedToken = localize('contextkey.parser.error.unexpectedToken', "Unexpected token");
const hintUnexpectedToken = localize('contextkey.parser.error.unexpectedToken.hint', "Did you forget to put && or || before the token?");
const errorUnexpectedEOF = localize('contextkey.parser.error.unexpectedEOF', "Unexpected end of expression");
const hintUnexpectedEOF = localize('contextkey.parser.error.unexpectedEOF.hint', "Did you forget to put a context key?");

/**
 * A parser for context key expressions.
 *
 * Example:
 * ```ts
 * const parser = new Parser();
 * const expr = parser.parse('foo == "bar" && baz == true');
 *
 * if (expr === undefined) {
 * 	// there were lexing or parsing errors
 * 	// process lexing errors with `parser.lexingErrors`
 *  // process parsing errors with `parser.parsingErrors`
 * } else {
 * 	// expr is a valid expression
 * }
 * ```
 */
export class Parser {
	// Note: this doesn't produce an exact syntax tree but a normalized one
	// ContextKeyExpression's that we use as AST nodes do not expose constructors that do not normalize

	private static _parseError = new Error();

	// lifetime note: `_scanner` lives as long as the parser does, i.e., is not reset between calls to `parse`
	private readonly _scanner = new Scanner();

	// lifetime note: `_tokens`, `_current`, and `_parsingErrors` must be reset between calls to `parse`
	private _tokens: Token[] = [];
	private _current = 0; 					// invariant: 0 <= this._current < this._tokens.length ; any incrementation of this value must first call `_isAtEnd`
	private _parsingErrors: ParsingError[] = [];

	get lexingErrors(): Readonly<LexingError[]> {
		return this._scanner.errors;
	}

	get parsingErrors(): Readonly<ParsingError[]> {
		return this._parsingErrors;
	}

	constructor(private readonly _config: ParserConfig = defaultConfig) {
	}

	/**
	 * Parse a context key expression.
	 *
	 * @param input the expression to parse
	 * @returns the parsed expression or `undefined` if there's an error - call `lexingErrors` and `parsingErrors` to see the errors
	 */
	parse(input: string): ContextKeyExpression | undefined {

		if (input === '') {
			this._parsingErrors.push({ message: errorEmptyString, offset: 0, lexeme: '', additionalInfo: hintEmptyString });
			return undefined;
		}

		this._tokens = this._scanner.reset(input).scan();
		// @ulugbekna: we do not stop parsing if there are lexing errors to be able to reconstruct regexes with unescaped slashes; TODO@ulugbekna: make this respect config option for recovery

		this._current = 0;
		this._parsingErrors = [];

		try {
			const expr = this._expr();
			if (!this._isAtEnd()) {
				const peek = this._peek();
				const additionalInfo = peek.type === TokenType.Str ? hintUnexpectedToken : undefined;
				this._parsingErrors.push({ message: errorUnexpectedToken, offset: peek.offset, lexeme: Scanner.getLexeme(peek), additionalInfo });
				throw Parser._parseError;
			}
			return expr;
		} catch (e) {
			if (!(e === Parser._parseError)) {
				throw e;
			}
			return undefined;
		}
	}

	private _expr(): ContextKeyExpression | undefined {
		return this._or();
	}

	private _or(): ContextKeyExpression | undefined {
		const expr = [this._and()];

		while (this._matchOne(TokenType.Or)) {
			const right = this._and();
			expr.push(right);
		}

		return expr.length === 1 ? expr[0] : ContextKeyExpr.or(...expr);
	}

	private _and(): ContextKeyExpression | undefined {
		const expr = [this._term()];

		while (this._matchOne(TokenType.And)) {
			const right = this._term();
			expr.push(right);
		}

		return expr.length === 1 ? expr[0] : ContextKeyExpr.and(...expr);
	}

	private _term(): ContextKeyExpression | undefined {
		if (this._matchOne(TokenType.Neg)) {
			const peek = this._peek();
			switch (peek.type) {
				case TokenType.True:
					this._advance();
					return ContextKeyFalseExpr.INSTANCE;
				case TokenType.False:
					this._advance();
					return ContextKeyTrueExpr.INSTANCE;
				case TokenType.LParen: {
					this._advance();
					const expr = this._expr();
					this._consume(TokenType.RParen, errorClosingParenthesis);
					return expr?.negate();
				}
				case TokenType.Str:
					this._advance();
					return ContextKeyNotExpr.create(peek.lexeme);
				default:
					throw this._errExpectedButGot(`KEY | true | false | '(' expression ')'`, peek);
			}
		}
		return this._primary();
	}

	private _primary(): ContextKeyExpression | undefined {

		const peek = this._peek();
		switch (peek.type) {
			case TokenType.True:
				this._advance();
				return ContextKeyExpr.true();

			case TokenType.False:
				this._advance();
				return ContextKeyExpr.false();

			case TokenType.LParen: {
				this._advance();
				const expr = this._expr();
				this._consume(TokenType.RParen, errorClosingParenthesis);
				return expr;
			}

			case TokenType.Str: {
				// KEY
				const key = peek.lexeme;
				this._advance();

				// =~ regex
				if (this._matchOne(TokenType.RegexOp)) {

					// @ulugbekna: we need to reconstruct the regex from the tokens because some extensions use unescaped slashes in regexes
					const expr = this._peek();

					if (!this._config.regexParsingWithErrorRecovery) {
						this._advance();
						if (expr.type !== TokenType.RegexStr) {
							throw this._errExpectedButGot(`REGEX`, expr);
						}
						const regexLexeme = expr.lexeme;
						const closingSlashIndex = regexLexeme.lastIndexOf('/');
						const flags = closingSlashIndex === regexLexeme.length - 1 ? undefined : this._removeFlagsGY(regexLexeme.substring(closingSlashIndex + 1));
						let regexp: RegExp | null;
						try {
							regexp = new RegExp(regexLexeme.substring(1, closingSlashIndex), flags);
						} catch (e) {
							throw this._errExpectedButGot(`REGEX`, expr);
						}
						return ContextKeyRegexExpr.create(key, regexp);
					}

					switch (expr.type) {
						case TokenType.RegexStr:
						case TokenType.Error: { // also handle an ErrorToken in case of smth such as /(/file)/
							const lexemeReconstruction = [expr.lexeme]; // /REGEX/ or /REGEX/FLAGS
							this._advance();

							let followingToken = this._peek();
							let parenBalance = 0;
							for (let i = 0; i < expr.lexeme.length; i++) {
								if (expr.lexeme.charCodeAt(i) === CharCode.OpenParen) {
									parenBalance++;
								} else if (expr.lexeme.charCodeAt(i) === CharCode.CloseParen) {
									parenBalance--;
								}
							}

							while (!this._isAtEnd() && followingToken.type !== TokenType.And && followingToken.type !== TokenType.Or) {
								switch (followingToken.type) {
									case TokenType.LParen:
										parenBalance++;
										break;
									case TokenType.RParen:
										parenBalance--;
										break;
									case TokenType.RegexStr:
									case TokenType.QuotedStr:
										for (let i = 0; i < followingToken.lexeme.length; i++) {
											if (followingToken.lexeme.charCodeAt(i) === CharCode.OpenParen) {
												parenBalance++;
											} else if (expr.lexeme.charCodeAt(i) === CharCode.CloseParen) {
												parenBalance--;
											}
										}
								}
								if (parenBalance < 0) {
									break;
								}
								lexemeReconstruction.push(Scanner.getLexeme(followingToken));
								this._advance();
								followingToken = this._peek();
							}

							const regexLexeme = lexemeReconstruction.join('');
							const closingSlashIndex = regexLexeme.lastIndexOf('/');
							const flags = closingSlashIndex === regexLexeme.length - 1 ? undefined : this._removeFlagsGY(regexLexeme.substring(closingSlashIndex + 1));
							let regexp: RegExp | null;
							try {
								regexp = new RegExp(regexLexeme.substring(1, closingSlashIndex), flags);
							} catch (e) {
								throw this._errExpectedButGot(`REGEX`, expr);
							}
							return ContextKeyExpr.regex(key, regexp);
						}

						case TokenType.QuotedStr: {
							const serializedValue = expr.lexeme;
							this._advance();
							// replicate old regex parsing behavior

							let regex: RegExp | null = null;

							if (!isFalsyOrWhitespace(serializedValue)) {
								const start = serializedValue.indexOf('/');
								const end = serializedValue.lastIndexOf('/');
								if (start !== end && start >= 0) {

									const value = serializedValue.slice(start + 1, end);
									const caseIgnoreFlag = serializedValue[end + 1] === 'i' ? 'i' : '';
									try {
										regex = new RegExp(value, caseIgnoreFlag);
									} catch (_e) {
										throw this._errExpectedButGot(`REGEX`, expr);
									}
								}
							}

							if (regex === null) {
								throw this._errExpectedButGot('REGEX', expr);
							}

							return ContextKeyRegexExpr.create(key, regex);
						}

						default:
							throw this._errExpectedButGot('REGEX', this._peek());
					}
				}

				// [ 'not' 'in' value ]
				if (this._matchOne(TokenType.Not)) {
					this._consume(TokenType.In, errorNoInAfterNot);
					const right = this._value();
					return ContextKeyExpr.notIn(key, right);
				}

				// [ ('==' | '!=' | '<' | '<=' | '>' | '>=' | 'in') value ]
				const maybeOp = this._peek().type;
				switch (maybeOp) {
					case TokenType.Eq: {
						this._advance();

						const right = this._value();
						if (this._previous().type === TokenType.QuotedStr) { // to preserve old parser behavior: "foo == 'true'" is preserved as "foo == 'true'", but "foo == true" is optimized as "foo"
							return ContextKeyExpr.equals(key, right);
						}
						switch (right) {
							case 'true':
								return ContextKeyExpr.has(key);
							case 'false':
								return ContextKeyExpr.not(key);
							default:
								return ContextKeyExpr.equals(key, right);
						}
					}

					case TokenType.NotEq: {
						this._advance();

						const right = this._value();
						if (this._previous().type === TokenType.QuotedStr) { // same as above with "foo != 'true'"
							return ContextKeyExpr.notEquals(key, right);
						}
						switch (right) {
							case 'true':
								return ContextKeyExpr.not(key);
							case 'false':
								return ContextKeyExpr.has(key);
							default:
								return ContextKeyExpr.notEquals(key, right);
						}
					}
					// TODO: ContextKeyExpr.smaller(key, right) accepts only `number` as `right` AND during eval of this node, we just eval to `false` if `right` is not a number
					// consequently, package.json linter should _warn_ the user if they're passing undesired things to ops
					case TokenType.Lt:
						this._advance();
						return ContextKeySmallerExpr.create(key, this._value());

					case TokenType.LtEq:
						this._advance();
						return ContextKeySmallerEqualsExpr.create(key, this._value());

					case TokenType.Gt:
						this._advance();
						return ContextKeyGreaterExpr.create(key, this._value());

					case TokenType.GtEq:
						this._advance();
						return ContextKeyGreaterEqualsExpr.create(key, this._value());

					case TokenType.In:
						this._advance();
						return ContextKeyExpr.in(key, this._value());

					default:
						return ContextKeyExpr.has(key);
				}
			}

			case TokenType.EOF:
				this._parsingErrors.push({ message: errorUnexpectedEOF, offset: peek.offset, lexeme: '', additionalInfo: hintUnexpectedEOF });
				throw Parser._parseError;

			default:
				throw this._errExpectedButGot(`true | false | KEY \n\t| KEY '=~' REGEX \n\t| KEY ('==' | '!=' | '<' | '<=' | '>' | '>=' | 'in' | 'not' 'in') value`, this._peek());

		}
	}

	private _value(): string {
		const token = this._peek();
		switch (token.type) {
			case TokenType.Str:
			case TokenType.QuotedStr:
				this._advance();
				return token.lexeme;
			case TokenType.True:
				this._advance();
				return 'true';
			case TokenType.False:
				this._advance();
				return 'false';
			case TokenType.In: // we support `in` as a value, e.g., "when": "languageId == in" - exists in existing extensions
				this._advance();
				return 'in';
			default:
				// this allows "when": "foo == " which's used by existing extensions
				// we do not call `_advance` on purpose - we don't want to eat unintended tokens
				return '';
		}
	}

	private _flagsGYRe = /g|y/g;
	private _removeFlagsGY(flags: string): string {
		return flags.replaceAll(this._flagsGYRe, '');
	}

	// careful: this can throw if current token is the initial one (ie index = 0)
	private _previous() {
		return this._tokens[this._current - 1];
	}

	private _matchOne(token: TokenType) {
		if (this._check(token)) {
			this._advance();
			return true;
		}

		return false;
	}

	private _advance() {
		if (!this._isAtEnd()) {
			this._current++;
		}
		return this._previous();
	}

	private _consume(type: TokenType, message: string) {
		if (this._check(type)) {
			return this._advance();
		}

		throw this._errExpectedButGot(message, this._peek());
	}

	private _errExpectedButGot(expected: string, got: Token, additionalInfo?: string) {
		const message = localize('contextkey.parser.error.expectedButGot', "Expected: {0}\nReceived: '{1}'.", expected, Scanner.getLexeme(got));
		const offset = got.offset;
		const lexeme = Scanner.getLexeme(got);
		this._parsingErrors.push({ message, offset, lexeme, additionalInfo });
		return Parser._parseError;
	}

	private _check(type: TokenType) {
		return this._peek().type === type;
	}

	private _peek() {
		return this._tokens[this._current];
	}

	private _isAtEnd() {
		return this._peek().type === TokenType.EOF;
	}
}

export abstract class ContextKeyExpr {

	public static false(): ContextKeyExpression {
		return ContextKeyFalseExpr.INSTANCE;
	}
	public static true(): ContextKeyExpression {
		return ContextKeyTrueExpr.INSTANCE;
	}
	public static has(key: string): ContextKeyExpression {
		return ContextKeyDefinedExpr.create(key);
	}
	public static equals(key: string, value: any): ContextKeyExpression {
		return ContextKeyEqualsExpr.create(key, value);
	}
	public static notEquals(key: string, value: any): ContextKeyExpression {
		return ContextKeyNotEqualsExpr.create(key, value);
	}
	public static regex(key: string, value: RegExp): ContextKeyExpression {
		return ContextKeyRegexExpr.create(key, value);
	}
	public static in(key: string, value: string): ContextKeyExpression {
		return ContextKeyInExpr.create(key, value);
	}
	public static notIn(key: string, value: string): ContextKeyExpression {
		return ContextKeyNotInExpr.create(key, value);
	}
	public static not(key: string): ContextKeyExpression {
		return ContextKeyNotExpr.create(key);
	}
	public static and(...expr: Array<ContextKeyExpression | undefined | null>): ContextKeyExpression | undefined {
		return ContextKeyAndExpr.create(expr, null, true);
	}
	public static or(...expr: Array<ContextKeyExpression | undefined | null>): ContextKeyExpression | undefined {
		return ContextKeyOrExpr.create(expr, null, true);
	}
	public static greater(key: string, value: number): ContextKeyExpression {
		return ContextKeyGreaterExpr.create(key, value);
	}
	public static greaterEquals(key: string, value: number): ContextKeyExpression {
		return ContextKeyGreaterEqualsExpr.create(key, value);
	}
	public static smaller(key: string, value: number): ContextKeyExpression {
		return ContextKeySmallerExpr.create(key, value);
	}
	public static smallerEquals(key: string, value: number): ContextKeyExpression {
		return ContextKeySmallerEqualsExpr.create(key, value);
	}

	private static _parser = new Parser({ regexParsingWithErrorRecovery: false });
	public static deserialize(serialized: string | null | undefined): ContextKeyExpression | undefined {
		if (serialized === undefined || serialized === null) { // an empty string needs to be handled by the parser to get a corresponding parsing error reported
			return undefined;
		}

		const expr = this._parser.parse(serialized);
		return expr;
	}

}


export function validateWhenClauses(whenClauses: string[]): any {

	const parser = new Parser({ regexParsingWithErrorRecovery: false }); // we run with no recovery to guide users to use correct regexes

	return whenClauses.map(whenClause => {
		parser.parse(whenClause);

		if (parser.lexingErrors.length > 0) {
			return parser.lexingErrors.map((se: LexingError) => ({
				errorMessage: se.additionalInfo ?
					localize('contextkey.scanner.errorForLinterWithHint', "Unexpected token. Hint: {0}", se.additionalInfo) :
					localize('contextkey.scanner.errorForLinter', "Unexpected token."),
				offset: se.offset,
				length: se.lexeme.length,
			}));
		} else if (parser.parsingErrors.length > 0) {
			return parser.parsingErrors.map((pe: ParsingError) => ({
				errorMessage: pe.additionalInfo ? `${pe.message}. ${pe.additionalInfo}` : pe.message,
				offset: pe.offset,
				length: pe.lexeme.length,
			}));
		} else {
			return [];
		}
	});
}

export function expressionsAreEqualWithConstantSubstitution(a: ContextKeyExpression | null | undefined, b: ContextKeyExpression | null | undefined): boolean {
	const aExpr = a ? a.substituteConstants() : undefined;
	const bExpr = b ? b.substituteConstants() : undefined;
	if (!aExpr && !bExpr) {
		return true;
	}
	if (!aExpr || !bExpr) {
		return false;
	}
	return aExpr.equals(bExpr);
}

function cmp(a: ContextKeyExpression, b: ContextKeyExpression): number {
	return a.cmp(b);
}

export class ContextKeyFalseExpr implements IContextKeyExpression {
	public static INSTANCE = new ContextKeyFalseExpr();

	public readonly type = ContextKeyExprType.False;

	protected constructor() {
	}

	public cmp(other: ContextKeyExpression): number {
		return this.type - other.type;
	}

	public equals(other: ContextKeyExpression): boolean {
		return (other.type === this.type);
	}

	public substituteConstants(): ContextKeyExpression | undefined {
		return this;
	}

	public evaluate(context: IContext): boolean {
		return false;
	}

	public serialize(): string {
		return 'false';
	}

	public keys(): string[] {
		return [];
	}

	public map(mapFnc: IContextKeyExprMapper): ContextKeyExpression {
		return this;
	}

	public negate(): ContextKeyExpression {
		return ContextKeyTrueExpr.INSTANCE;
	}
}

export class ContextKeyTrueExpr implements IContextKeyExpression {
	public static INSTANCE = new ContextKeyTrueExpr();

	public readonly type = ContextKeyExprType.True;

	protected constructor() {
	}

	public cmp(other: ContextKeyExpression): number {
		return this.type - other.type;
	}

	public equals(other: ContextKeyExpression): boolean {
		return (other.type === this.type);
	}

	public substituteConstants(): ContextKeyExpression | undefined {
		return this;
	}

	public evaluate(context: IContext): boolean {
		return true;
	}

	public serialize(): string {
		return 'true';
	}

	public keys(): string[] {
		return [];
	}

	public map(mapFnc: IContextKeyExprMapper): ContextKeyExpression {
		return this;
	}

	public negate(): ContextKeyExpression {
		return ContextKeyFalseExpr.INSTANCE;
	}
}

export class ContextKeyDefinedExpr implements IContextKeyExpression {
	public static create(key: string, negated: ContextKeyExpression | null = null): ContextKeyExpression {
		const constantValue = CONSTANT_VALUES.get(key);
		if (typeof constantValue === 'boolean') {
			return constantValue ? ContextKeyTrueExpr.INSTANCE : ContextKeyFalseExpr.INSTANCE;
		}
		return new ContextKeyDefinedExpr(key, negated);
	}

	public readonly type = ContextKeyExprType.Defined;

	protected constructor(
		readonly key: string,
		private negated: ContextKeyExpression | null
	) {
	}

	public cmp(other: ContextKeyExpression): number {
		if (other.type !== this.type) {
			return this.type - other.type;
		}
		return cmp1(this.key, other.key);
	}

	public equals(other: ContextKeyExpression): boolean {
		if (other.type === this.type) {
			return (this.key === other.key);
		}
		return false;
	}

	public substituteConstants(): ContextKeyExpression | undefined {
		const constantValue = CONSTANT_VALUES.get(this.key);
		if (typeof constantValue === 'boolean') {
			return constantValue ? ContextKeyTrueExpr.INSTANCE : ContextKeyFalseExpr.INSTANCE;
		}
		return this;
	}

	public evaluate(context: IContext): boolean {
		return (!!context.getValue(this.key));
	}

	public serialize(): string {
		return this.key;
	}

	public keys(): string[] {
		return [this.key];
	}

	public map(mapFnc: IContextKeyExprMapper): ContextKeyExpression {
		return mapFnc.mapDefined(this.key);
	}

	public negate(): ContextKeyExpression {
		if (!this.negated) {
			this.negated = ContextKeyNotExpr.create(this.key, this);
		}
		return this.negated;
	}
}

export class ContextKeyEqualsExpr implements IContextKeyExpression {

	public static create(key: string, value: any, negated: ContextKeyExpression | null = null): ContextKeyExpression {
		if (typeof value === 'boolean') {
			return (value ? ContextKeyDefinedExpr.create(key, negated) : ContextKeyNotExpr.create(key, negated));
		}
		const constantValue = CONSTANT_VALUES.get(key);
		if (typeof constantValue === 'boolean') {
			const trueValue = constantValue ? 'true' : 'false';
			return (value === trueValue ? ContextKeyTrueExpr.INSTANCE : ContextKeyFalseExpr.INSTANCE);
		}
		return new ContextKeyEqualsExpr(key, value, negated);
	}

	public readonly type = ContextKeyExprType.Equals;

	private constructor(
		private readonly key: string,
		private readonly value: any,
		private negated: ContextKeyExpression | null
	) {
	}

	public cmp(other: ContextKeyExpression): number {
		if (other.type !== this.type) {
			return this.type - other.type;
		}
		return cmp2(this.key, this.value, other.key, other.value);
	}

	public equals(other: ContextKeyExpression): boolean {
		if (other.type === this.type) {
			return (this.key === other.key && this.value === other.value);
		}
		return false;
	}

	public substituteConstants(): ContextKeyExpression | undefined {
		const constantValue = CONSTANT_VALUES.get(this.key);
		if (typeof constantValue === 'boolean') {
			const trueValue = constantValue ? 'true' : 'false';
			return (this.value === trueValue ? ContextKeyTrueExpr.INSTANCE : ContextKeyFalseExpr.INSTANCE);
		}
		return this;
	}

	public evaluate(context: IContext): boolean {
		// Intentional ==
		// eslint-disable-next-line eqeqeq
		return (context.getValue(this.key) == this.value);
	}

	public serialize(): string {
		return `${this.key} == '${this.value}'`;
	}

	public keys(): string[] {
		return [this.key];
	}

	public map(mapFnc: IContextKeyExprMapper): ContextKeyExpression {
		return mapFnc.mapEquals(this.key, this.value);
	}

	public negate(): ContextKeyExpression {
		if (!this.negated) {
			this.negated = ContextKeyNotEqualsExpr.create(this.key, this.value, this);
		}
		return this.negated;
	}
}

export class ContextKeyInExpr implements IContextKeyExpression {

	public static create(key: string, valueKey: string): ContextKeyInExpr {
		return new ContextKeyInExpr(key, valueKey);
	}

	public readonly type = ContextKeyExprType.In;
	private negated: ContextKeyExpression | null = null;

	private constructor(
		private readonly key: string,
		private readonly valueKey: string,
	) {
	}

	public cmp(other: ContextKeyExpression): number {
		if (other.type !== this.type) {
			return this.type - other.type;
		}
		return cmp2(this.key, this.valueKey, other.key, other.valueKey);
	}

	public equals(other: ContextKeyExpression): boolean {
		if (other.type === this.type) {
			return (this.key === other.key && this.valueKey === other.valueKey);
		}
		return false;
	}

	public substituteConstants(): ContextKeyExpression | undefined {
		return this;
	}

	public evaluate(context: IContext): boolean {
		const source = context.getValue(this.valueKey);

		const item = context.getValue(this.key);

		if (Array.isArray(source)) {
			// eslint-disable-next-line local/code-no-any-casts
			return source.includes(item as any);
		}

		if (typeof item === 'string' && typeof source === 'object' && source !== null) {
			return hasOwnProperty.call(source, item);
		}
		return false;
	}

	public serialize(): string {
		return `${this.key} in '${this.valueKey}'`;
	}

	public keys(): string[] {
		return [this.key, this.valueKey];
	}

	public map(mapFnc: IContextKeyExprMapper): ContextKeyInExpr {
		return mapFnc.mapIn(this.key, this.valueKey);
	}

	public negate(): ContextKeyExpression {
		if (!this.negated) {
			this.negated = ContextKeyNotInExpr.create(this.key, this.valueKey);
		}
		return this.negated;
	}
}

export class ContextKeyNotInExpr implements IContextKeyExpression {

	public static create(key: string, valueKey: string): ContextKeyNotInExpr {
		return new ContextKeyNotInExpr(key, valueKey);
	}

	public readonly type = ContextKeyExprType.NotIn;

	private readonly _negated: ContextKeyInExpr;

	private constructor(
		private readonly key: string,
		private readonly valueKey: string,
	) {
		this._negated = ContextKeyInExpr.create(key, valueKey);
	}

	public cmp(other: ContextKeyExpression): number {
		if (other.type !== this.type) {
			return this.type - other.type;
		}
		return this._negated.cmp(other._negated);
	}

	public equals(other: ContextKeyExpression): boolean {
		if (other.type === this.type) {
			return this._negated.equals(other._negated);
		}
		return false;
	}

	public substituteConstants(): ContextKeyExpression | undefined {
		return this;
	}

	public evaluate(context: IContext): boolean {
		return !this._negated.evaluate(context);
	}

	public serialize(): string {
		return `${this.key} not in '${this.valueKey}'`;
	}

	public keys(): string[] {
		return this._negated.keys();
	}

	public map(mapFnc: IContextKeyExprMapper): ContextKeyExpression {
		return mapFnc.mapNotIn(this.key, this.valueKey);
	}

	public negate(): ContextKeyExpression {
		return this._negated;
	}
}

export class ContextKeyNotEqualsExpr implements IContextKeyExpression {

	public static create(key: string, value: any, negated: ContextKeyExpression | null = null): ContextKeyExpression {
		if (typeof value === 'boolean') {
			if (value) {
				return ContextKeyNotExpr.create(key, negated);
			}
			return ContextKeyDefinedExpr.create(key, negated);
		}
		const constantValue = CONSTANT_VALUES.get(key);
		if (typeof constantValue === 'boolean') {
			const falseValue = constantValue ? 'true' : 'false';
			return (value === falseValue ? ContextKeyFalseExpr.INSTANCE : ContextKeyTrueExpr.INSTANCE);
		}
		return new ContextKeyNotEqualsExpr(key, value, negated);
	}

	public readonly type = ContextKeyExprType.NotEquals;

	private constructor(
		private readonly key: string,
		private readonly value: any,
		private negated: ContextKeyExpression | null
	) {
	}

	public cmp(other: ContextKeyExpression): number {
		if (other.type !== this.type) {
			return this.type - other.type;
		}
		return cmp2(this.key, this.value, other.key, other.value);
	}

	public equals(other: ContextKeyExpression): boolean {
		if (other.type === this.type) {
			return (this.key === other.key && this.value === other.value);
		}
		return false;
	}

	public substituteConstants(): ContextKeyExpression | undefined {
		const constantValue = CONSTANT_VALUES.get(this.key);
		if (typeof constantValue === 'boolean') {
			const falseValue = constantValue ? 'true' : 'false';
			return (this.value === falseValue ? ContextKeyFalseExpr.INSTANCE : ContextKeyTrueExpr.INSTANCE);
		}
		return this;
	}

	public evaluate(context: IContext): boolean {
		// Intentional !=
		// eslint-disable-next-line eqeqeq
		return (context.getValue(this.key) != this.value);
	}

	public serialize(): string {
		return `${this.key} != '${this.value}'`;
	}

	public keys(): string[] {
		return [this.key];
	}

	public map(mapFnc: IContextKeyExprMapper): ContextKeyExpression {
		return mapFnc.mapNotEquals(this.key, this.value);
	}

	public negate(): ContextKeyExpression {
		if (!this.negated) {
			this.negated = ContextKeyEqualsExpr.create(this.key, this.value, this);
		}
		return this.negated;
	}
}

export class ContextKeyNotExpr implements IContextKeyExpression {

	public static create(key: string, negated: ContextKeyExpression | null = null): ContextKeyExpression {
		const constantValue = CONSTANT_VALUES.get(key);
		if (typeof constantValue === 'boolean') {
			return (constantValue ? ContextKeyFalseExpr.INSTANCE : ContextKeyTrueExpr.INSTANCE);
		}
		return new ContextKeyNotExpr(key, negated);
	}

	public readonly type = ContextKeyExprType.Not;

	private constructor(
		private readonly key: string,
		private negated: ContextKeyExpression | null
	) {
	}

	public cmp(other: ContextKeyExpression): number {
		if (other.type !== this.type) {
			return this.type - other.type;
		}
		return cmp1(this.key, other.key);
	}

	public equals(other: ContextKeyExpression): boolean {
		if (other.type === this.type) {
			return (this.key === other.key);
		}
		return false;
	}

	public substituteConstants(): ContextKeyExpression | undefined {
		const constantValue = CONSTANT_VALUES.get(this.key);
		if (typeof constantValue === 'boolean') {
			return (constantValue ? ContextKeyFalseExpr.INSTANCE : ContextKeyTrueExpr.INSTANCE);
		}
		return this;
	}

	public evaluate(context: IContext): boolean {
		return (!context.getValue(this.key));
	}

	public serialize(): string {
		return `!${this.key}`;
	}

	public keys(): string[] {
		return [this.key];
	}

	public map(mapFnc: IContextKeyExprMapper): ContextKeyExpression {
		return mapFnc.mapNot(this.key);
	}

	public negate(): ContextKeyExpression {
		if (!this.negated) {
			this.negated = ContextKeyDefinedExpr.create(this.key, this);
		}
		return this.negated;
	}
}

function withFloatOrStr<T extends ContextKeyExpression>(value: any, callback: (value: number | string) => T): T | ContextKeyFalseExpr {
	if (typeof value === 'string') {
		const n = parseFloat(value);
		if (!isNaN(n)) {
			value = n;
		}
	}
	if (typeof value === 'string' || typeof value === 'number') {
		return callback(value);
	}
	return ContextKeyFalseExpr.INSTANCE;
}

export class ContextKeyGreaterExpr implements IContextKeyExpression {

	public static create(key: string, _value: any, negated: ContextKeyExpression | null = null): ContextKeyExpression {
		return withFloatOrStr(_value, (value) => new ContextKeyGreaterExpr(key, value, negated));
	}

	public readonly type = ContextKeyExprType.Greater;

	private constructor(
		private readonly key: string,
		private readonly value: number | string,
		private negated: ContextKeyExpression | null
	) { }

	public cmp(other: ContextKeyExpression): number {
		if (other.type !== this.type) {
			return this.type - other.type;
		}
		return cmp2(this.key, this.value, other.key, other.value);
	}

	public equals(other: ContextKeyExpression): boolean {
		if (other.type === this.type) {
			return (this.key === other.key && this.value === other.value);
		}
		return false;
	}

	public substituteConstants(): ContextKeyExpression | undefined {
		return this;
	}

	public evaluate(context: IContext): boolean {
		if (typeof this.value === 'string') {
			return false;
		}
		return (parseFloat(context.getValue<any>(this.key)) > this.value);
	}

	public serialize(): string {
		return `${this.key} > ${this.value}`;
	}

	public keys(): string[] {
		return [this.key];
	}

	public map(mapFnc: IContextKeyExprMapper): ContextKeyExpression {
		return mapFnc.mapGreater(this.key, this.value);
	}

	public negate(): ContextKeyExpression {
		if (!this.negated) {
			this.negated = ContextKeySmallerEqualsExpr.create(this.key, this.value, this);
		}
		return this.negated;
	}
}

export class ContextKeyGreaterEqualsExpr implements IContextKeyExpression {

	public static create(key: string, _value: any, negated: ContextKeyExpression | null = null): ContextKeyExpression {
		return withFloatOrStr(_value, (value) => new ContextKeyGreaterEqualsExpr(key, value, negated));
	}

	public readonly type = ContextKeyExprType.GreaterEquals;

	private constructor(
		private readonly key: string,
		private readonly value: number | string,
		private negated: ContextKeyExpression | null
	) { }

	public cmp(other: ContextKeyExpression): number {
		if (other.type !== this.type) {
			return this.type - other.type;
		}
		return cmp2(this.key, this.value, other.key, other.value);
	}

	public equals(other: ContextKeyExpression): boolean {
		if (other.type === this.type) {
			return (this.key === other.key && this.value === other.value);
		}
		return false;
	}

	public substituteConstants(): ContextKeyExpression | undefined {
		return this;
	}

	public evaluate(context: IContext): boolean {
		if (typeof this.value === 'string') {
			return false;
		}
		return (parseFloat(context.getValue<any>(this.key)) >= this.value);
	}

	public serialize(): string {
		return `${this.key} >= ${this.value}`;
	}

	public keys(): string[] {
		return [this.key];
	}

	public map(mapFnc: IContextKeyExprMapper): ContextKeyExpression {
		return mapFnc.mapGreaterEquals(this.key, this.value);
	}

	public negate(): ContextKeyExpression {
		if (!this.negated) {
			this.negated = ContextKeySmallerExpr.create(this.key, this.value, this);
		}
		return this.negated;
	}
}

export class ContextKeySmallerExpr implements IContextKeyExpression {

	public static create(key: string, _value: any, negated: ContextKeyExpression | null = null): ContextKeyExpression {
		return withFloatOrStr(_value, (value) => new ContextKeySmallerExpr(key, value, negated));
	}

	public readonly type = ContextKeyExprType.Smaller;

	private constructor(
		private readonly key: string,
		private readonly value: number | string,
		private negated: ContextKeyExpression | null
	) {
	}

	public cmp(other: ContextKeyExpression): number {
		if (other.type !== this.type) {
			return this.type - other.type;
		}
		return cmp2(this.key, this.value, other.key, other.value);
	}

	public equals(other: ContextKeyExpression): boolean {
		if (other.type === this.type) {
			return (this.key === other.key && this.value === other.value);
		}
		return false;
	}

	public substituteConstants(): ContextKeyExpression | undefined {
		return this;
	}

	public evaluate(context: IContext): boolean {
		if (typeof this.value === 'string') {
			return false;
		}
		return (parseFloat(context.getValue<any>(this.key)) < this.value);
	}

	public serialize(): string {
		return `${this.key} < ${this.value}`;
	}

	public keys(): string[] {
		return [this.key];
	}

	public map(mapFnc: IContextKeyExprMapper): ContextKeyExpression {
		return mapFnc.mapSmaller(this.key, this.value);
	}

	public negate(): ContextKeyExpression {
		if (!this.negated) {
			this.negated = ContextKeyGreaterEqualsExpr.create(this.key, this.value, this);
		}
		return this.negated;
	}
}

export class ContextKeySmallerEqualsExpr implements IContextKeyExpression {

	public static create(key: string, _value: any, negated: ContextKeyExpression | null = null): ContextKeyExpression {
		return withFloatOrStr(_value, (value) => new ContextKeySmallerEqualsExpr(key, value, negated));
	}

	public readonly type = ContextKeyExprType.SmallerEquals;

	private constructor(
		private readonly key: string,
		private readonly value: number | string,
		private negated: ContextKeyExpression | null
	) {
	}

	public cmp(other: ContextKeyExpression): number {
		if (other.type !== this.type) {
			return this.type - other.type;
		}
		return cmp2(this.key, this.value, other.key, other.value);
	}

	public equals(other: ContextKeyExpression): boolean {
		if (other.type === this.type) {
			return (this.key === other.key && this.value === other.value);
		}
		return false;
	}

	public substituteConstants(): ContextKeyExpression | undefined {
		return this;
	}

	public evaluate(context: IContext): boolean {
		if (typeof this.value === 'string') {
			return false;
		}
		return (parseFloat(context.getValue<any>(this.key)) <= this.value);
	}

	public serialize(): string {
		return `${this.key} <= ${this.value}`;
	}

	public keys(): string[] {
		return [this.key];
	}

	public map(mapFnc: IContextKeyExprMapper): ContextKeyExpression {
		return mapFnc.mapSmallerEquals(this.key, this.value);
	}

	public negate(): ContextKeyExpression {
		if (!this.negated) {
			this.negated = ContextKeyGreaterExpr.create(this.key, this.value, this);
		}
		return this.negated;
	}
}

export class ContextKeyRegexExpr implements IContextKeyExpression {

	public static create(key: string, regexp: RegExp | null): ContextKeyRegexExpr {
		return new ContextKeyRegexExpr(key, regexp);
	}

	public readonly type = ContextKeyExprType.Regex;
	private negated: ContextKeyExpression | null = null;

	private constructor(
		private readonly key: string,
		private readonly regexp: RegExp | null
	) {
		//
	}

	public cmp(other: ContextKeyExpression): number {
		if (other.type !== this.type) {
			return this.type - other.type;
		}
		if (this.key < other.key) {
			return -1;
		}
		if (this.key > other.key) {
			return 1;
		}
		const thisSource = this.regexp ? this.regexp.source : '';
		const otherSource = other.regexp ? other.regexp.source : '';
		if (thisSource < otherSource) {
			return -1;
		}
		if (thisSource > otherSource) {
			return 1;
		}
		return 0;
	}

	public equals(other: ContextKeyExpression): boolean {
		if (other.type === this.type) {
			const thisSource = this.regexp ? this.regexp.source : '';
			const otherSource = other.regexp ? other.regexp.source : '';
			return (this.key === other.key && thisSource === otherSource);
		}
		return false;
	}

	public substituteConstants(): ContextKeyExpression | undefined {
		return this;
	}

	public evaluate(context: IContext): boolean {
		const value = context.getValue<any>(this.key);
		return this.regexp ? this.regexp.test(value) : false;
	}

	public serialize(): string {
		const value = this.regexp
			? `/${this.regexp.source}/${this.regexp.flags}`
			: '/invalid/';
		return `${this.key} =~ ${value}`;
	}

	public keys(): string[] {
		return [this.key];
	}

	public map(mapFnc: IContextKeyExprMapper): ContextKeyRegexExpr {
		return mapFnc.mapRegex(this.key, this.regexp);
	}

	public negate(): ContextKeyExpression {
		if (!this.negated) {
			this.negated = ContextKeyNotRegexExpr.create(this);
		}
		return this.negated;
	}
}

export class ContextKeyNotRegexExpr implements IContextKeyExpression {

	public static create(actual: ContextKeyRegexExpr): ContextKeyExpression {
		return new ContextKeyNotRegexExpr(actual);
	}

	public readonly type = ContextKeyExprType.NotRegex;

	private constructor(private readonly _actual: ContextKeyRegexExpr) {
		//
	}

	public cmp(other: ContextKeyExpression): number {
		if (other.type !== this.type) {
			return this.type - other.type;
		}
		return this._actual.cmp(other._actual);
	}

	public equals(other: ContextKeyExpression): boolean {
		if (other.type === this.type) {
			return this._actual.equals(other._actual);
		}
		return false;
	}

	public substituteConstants(): ContextKeyExpression | undefined {
		return this;
	}

	public evaluate(context: IContext): boolean {
		return !this._actual.evaluate(context);
	}

	public serialize(): string {
		return `!(${this._actual.serialize()})`;
	}

	public keys(): string[] {
		return this._actual.keys();
	}

	public map(mapFnc: IContextKeyExprMapper): ContextKeyExpression {
		return new ContextKeyNotRegexExpr(this._actual.map(mapFnc));
	}

	public negate(): ContextKeyExpression {
		return this._actual;
	}
}

/**
 * @returns the same instance if nothing changed.
 */
function eliminateConstantsInArray(arr: ContextKeyExpression[]): (ContextKeyExpression | undefined)[] {
	// Allocate array only if there is a difference
	let newArr: (ContextKeyExpression | undefined)[] | null = null;
	for (let i = 0, len = arr.length; i < len; i++) {
		const newExpr = arr[i].substituteConstants();

		if (arr[i] !== newExpr) {
			// something has changed!

			// allocate array on first difference
			if (newArr === null) {
				newArr = [];
				for (let j = 0; j < i; j++) {
					newArr[j] = arr[j];
				}
			}
		}

		if (newArr !== null) {
			newArr[i] = newExpr;
		}
	}

	if (newArr === null) {
		return arr;
	}
	return newArr;
}

export class ContextKeyAndExpr implements IContextKeyExpression {

	public static create(_expr: ReadonlyArray<ContextKeyExpression | null | undefined>, negated: ContextKeyExpression | null, extraRedundantCheck: boolean): ContextKeyExpression | undefined {
		return ContextKeyAndExpr._normalizeArr(_expr, negated, extraRedundantCheck);
	}

	public readonly type = ContextKeyExprType.And;

	private constructor(
		public readonly expr: ContextKeyExpression[],
		private negated: ContextKeyExpression | null
	) {
	}

	public cmp(other: ContextKeyExpression): number {
		if (other.type !== this.type) {
			return this.type - other.type;
		}
		if (this.expr.length < other.expr.length) {
			return -1;
		}
		if (this.expr.length > other.expr.length) {
			return 1;
		}
		for (let i = 0, len = this.expr.length; i < len; i++) {
			const r = cmp(this.expr[i], other.expr[i]);
			if (r !== 0) {
				return r;
			}
		}
		return 0;
	}

	public equals(other: ContextKeyExpression): boolean {
		if (other.type === this.type) {
			if (this.expr.length !== other.expr.length) {
				return false;
			}
			for (let i = 0, len = this.expr.length; i < len; i++) {
				if (!this.expr[i].equals(other.expr[i])) {
					return false;
				}
			}
			return true;
		}
		return false;
	}

	public substituteConstants(): ContextKeyExpression | undefined {
		const exprArr = eliminateConstantsInArray(this.expr);
		if (exprArr === this.expr) {
			// no change
			return this;
		}
		return ContextKeyAndExpr.create(exprArr, this.negated, false);
	}

	public evaluate(context: IContext): boolean {
		for (let i = 0, len = this.expr.length; i < len; i++) {
			if (!this.expr[i].evaluate(context)) {
				return false;
			}
		}
		return true;
	}

	private static _normalizeArr(arr: ReadonlyArray<ContextKeyExpression | null | undefined>, negated: ContextKeyExpression | null, extraRedundantCheck: boolean): ContextKeyExpression | undefined {
		const expr: ContextKeyExpression[] = [];
		let hasTrue = false;

		for (const e of arr) {
			if (!e) {
				continue;
			}

			if (e.type === ContextKeyExprType.True) {
				// anything && true ==> anything
				hasTrue = true;
				continue;
			}

			if (e.type === ContextKeyExprType.False) {
				// anything && false ==> false
				return ContextKeyFalseExpr.INSTANCE;
			}

			if (e.type === ContextKeyExprType.And) {
				expr.push(...e.expr);
				continue;
			}

			expr.push(e);
		}

		if (expr.length === 0 && hasTrue) {
			return ContextKeyTrueExpr.INSTANCE;
		}

		if (expr.length === 0) {
			return undefined;
		}

		if (expr.length === 1) {
			return expr[0];
		}

		expr.sort(cmp);

		// eliminate duplicate terms
		for (let i = 1; i < expr.length; i++) {
			if (expr[i - 1].equals(expr[i])) {
				expr.splice(i, 1);
				i--;
			}
		}

		if (expr.length === 1) {
			return expr[0];
		}

		// We must distribute any OR expression because we don't support parens
		// OR extensions will be at the end (due to sorting rules)
		while (expr.length > 1) {
			const lastElement = expr[expr.length - 1];
			if (lastElement.type !== ContextKeyExprType.Or) {
				break;
			}
			// pop the last element
			expr.pop();

			// pop the second to last element
			const secondToLastElement = expr.pop()!;

			const isFinished = (expr.length === 0);

			// distribute `lastElement` over `secondToLastElement`
			const resultElement = ContextKeyOrExpr.create(
				lastElement.expr.map(el => ContextKeyAndExpr.create([el, secondToLastElement], null, extraRedundantCheck)),
				null,
				isFinished
			);

			if (resultElement) {
				expr.push(resultElement);
				expr.sort(cmp);
			}
		}

		if (expr.length === 1) {
			return expr[0];
		}

		// resolve false AND expressions
		if (extraRedundantCheck) {
			for (let i = 0; i < expr.length; i++) {
				for (let j = i + 1; j < expr.length; j++) {
					if (expr[i].negate().equals(expr[j])) {
						// A && !A case
						return ContextKeyFalseExpr.INSTANCE;
					}
				}
			}

			if (expr.length === 1) {
				return expr[0];
			}
		}

		return new ContextKeyAndExpr(expr, negated);
	}

	public serialize(): string {
		return this.expr.map(e => e.serialize()).join(' && ');
	}

	public keys(): string[] {
		const result: string[] = [];
		for (const expr of this.expr) {
			result.push(...expr.keys());
		}
		return result;
	}

	public map(mapFnc: IContextKeyExprMapper): ContextKeyExpression {
		return new ContextKeyAndExpr(this.expr.map(expr => expr.map(mapFnc)), null);
	}

	public negate(): ContextKeyExpression {
		if (!this.negated) {
			const result: ContextKeyExpression[] = [];
			for (const expr of this.expr) {
				result.push(expr.negate());
			}
			this.negated = ContextKeyOrExpr.create(result, this, true)!;
		}
		return this.negated;
	}
}

export class ContextKeyOrExpr implements IContextKeyExpression {

	public static create(_expr: ReadonlyArray<ContextKeyExpression | null | undefined>, negated: ContextKeyExpression | null, extraRedundantCheck: boolean): ContextKeyExpression | undefined {
		return ContextKeyOrExpr._normalizeArr(_expr, negated, extraRedundantCheck);
	}

	public readonly type = ContextKeyExprType.Or;

	private constructor(
		public readonly expr: ContextKeyExpression[],
		private negated: ContextKeyExpression | null
	) {
	}

	public cmp(other: ContextKeyExpression): number {
		if (other.type !== this.type) {
			return this.type - other.type;
		}
		if (this.expr.length < other.expr.length) {
			return -1;
		}
		if (this.expr.length > other.expr.length) {
			return 1;
		}
		for (let i = 0, len = this.expr.length; i < len; i++) {
			const r = cmp(this.expr[i], other.expr[i]);
			if (r !== 0) {
				return r;
			}
		}
		return 0;
	}

	public equals(other: ContextKeyExpression): boolean {
		if (other.type === this.type) {
			if (this.expr.length !== other.expr.length) {
				return false;
			}
			for (let i = 0, len = this.expr.length; i < len; i++) {
				if (!this.expr[i].equals(other.expr[i])) {
					return false;
				}
			}
			return true;
		}
		return false;
	}

	public substituteConstants(): ContextKeyExpression | undefined {
		const exprArr = eliminateConstantsInArray(this.expr);
		if (exprArr === this.expr) {
			// no change
			return this;
		}
		return ContextKeyOrExpr.create(exprArr, this.negated, false);
	}

	public evaluate(context: IContext): boolean {
		for (let i = 0, len = this.expr.length; i < len; i++) {
			if (this.expr[i].evaluate(context)) {
				return true;
			}
		}
		return false;
	}

	private static _normalizeArr(arr: ReadonlyArray<ContextKeyExpression | null | undefined>, negated: ContextKeyExpression | null, extraRedundantCheck: boolean): ContextKeyExpression | undefined {
		let expr: ContextKeyExpression[] = [];
		let hasFalse = false;

		if (arr) {
			for (let i = 0, len = arr.length; i < len; i++) {
				const e = arr[i];
				if (!e) {
					continue;
				}

				if (e.type === ContextKeyExprType.False) {
					// anything || false ==> anything
					hasFalse = true;
					continue;
				}

				if (e.type === ContextKeyExprType.True) {
					// anything || true ==> true
					return ContextKeyTrueExpr.INSTANCE;
				}

				if (e.type === ContextKeyExprType.Or) {
					expr = expr.concat(e.expr);
					continue;
				}

				expr.push(e);
			}

			if (expr.length === 0 && hasFalse) {
				return ContextKeyFalseExpr.INSTANCE;
			}

			expr.sort(cmp);
		}

		if (expr.length === 0) {
			return undefined;
		}

		if (expr.length === 1) {
			return expr[0];
		}

		// eliminate duplicate terms
		for (let i = 1; i < expr.length; i++) {
			if (expr[i - 1].equals(expr[i])) {
				expr.splice(i, 1);
				i--;
			}
		}

		if (expr.length === 1) {
			return expr[0];
		}

		// resolve true OR expressions
		if (extraRedundantCheck) {
			for (let i = 0; i < expr.length; i++) {
				for (let j = i + 1; j < expr.length; j++) {
					if (expr[i].negate().equals(expr[j])) {
						// A || !A case
						return ContextKeyTrueExpr.INSTANCE;
					}
				}
			}

			if (expr.length === 1) {
				return expr[0];
			}
		}

		return new ContextKeyOrExpr(expr, negated);
	}

	public serialize(): string {
		return this.expr.map(e => e.serialize()).join(' || ');
	}

	public keys(): string[] {
		const result: string[] = [];
		for (const expr of this.expr) {
			result.push(...expr.keys());
		}
		return result;
	}

	public map(mapFnc: IContextKeyExprMapper): ContextKeyExpression {
		return new ContextKeyOrExpr(this.expr.map(expr => expr.map(mapFnc)), null);
	}

	public negate(): ContextKeyExpression {
		if (!this.negated) {
			const result: ContextKeyExpression[] = [];
			for (const expr of this.expr) {
				result.push(expr.negate());
			}

			// We don't support parens, so here we distribute the AND over the OR terminals
			// We always take the first 2 AND pairs and distribute them
			while (result.length > 1) {
				const LEFT = result.shift()!;
				const RIGHT = result.shift()!;

				const all: ContextKeyExpression[] = [];
				for (const left of getTerminals(LEFT)) {
					for (const right of getTerminals(RIGHT)) {
						all.push(ContextKeyAndExpr.create([left, right], null, false)!);
					}
				}

				result.unshift(ContextKeyOrExpr.create(all, null, false)!);
			}

			this.negated = ContextKeyOrExpr.create(result, this, true)!;
		}
		return this.negated;
	}
}

export interface ContextKeyInfo {
	readonly key: string;
	readonly type?: string;
	readonly description?: string;
}

export class RawContextKey<T extends ContextKeyValue> extends ContextKeyDefinedExpr {

	private static _info: ContextKeyInfo[] = [];

	static all(): IterableIterator<ContextKeyInfo> {
		return RawContextKey._info.values();
	}

	private readonly _defaultValue: T | undefined;

	constructor(key: string, defaultValue: T | undefined, metaOrHide?: string | true | { type: string; description: string }) {
		super(key, null);
		this._defaultValue = defaultValue;

		// collect all context keys into a central place
		if (typeof metaOrHide === 'object') {
			RawContextKey._info.push({ ...metaOrHide, key });
		} else if (metaOrHide !== true) {
			RawContextKey._info.push({ key, description: metaOrHide, type: defaultValue !== null && defaultValue !== undefined ? typeof defaultValue : undefined });
		}
	}

	public bindTo(target: IContextKeyService): IContextKey<T> {
		return target.createKey(this.key, this._defaultValue);
	}

	public getValue(target: IContextKeyService): T | undefined {
		return target.getContextKeyValue<T>(this.key);
	}

	public toNegated(): ContextKeyExpression {
		return this.negate();
	}

	public isEqualTo(value: any): ContextKeyExpression {
		return ContextKeyEqualsExpr.create(this.key, value);
	}

	public notEqualsTo(value: any): ContextKeyExpression {
		return ContextKeyNotEqualsExpr.create(this.key, value);
	}

	public greater(value: any): ContextKeyExpression {
		return ContextKeyGreaterExpr.create(this.key, value);
	}
}

export type ContextKeyValue = null | undefined | boolean | number | string
	| Array<null | undefined | boolean | number | string>
	| Record<string, null | undefined | boolean | number | string>;

export interface IContext {
	getValue<T extends ContextKeyValue = ContextKeyValue>(key: string): T | undefined;
}

export interface IContextKey<T extends ContextKeyValue = ContextKeyValue> {
	set(value: T): void;
	reset(): void;
	get(): T | undefined;
}

export interface IContextKeyServiceTarget {
	parentElement: IContextKeyServiceTarget | null;
	setAttribute(attr: string, value: string): void;
	removeAttribute(attr: string): void;
	hasAttribute(attr: string): boolean;
	getAttribute(attr: string): string | null;
}

export const IContextKeyService = createDecorator<IContextKeyService>('contextKeyService');

export interface IReadableSet<T> {
	has(value: T): boolean;
}

export interface IContextKeyChangeEvent {
	affectsSome(keys: IReadableSet<string>): boolean;
	allKeysContainedIn(keys: IReadableSet<string>): boolean;
}

export type IScopedContextKeyService = IContextKeyService & IDisposable;

export interface IContextKeyService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeContext: Event<IContextKeyChangeEvent>;
	bufferChangeEvents(callback: Function): void;

	createKey<T extends ContextKeyValue>(key: string, defaultValue: T | undefined): IContextKey<T>;
	contextMatchesRules(rules: ContextKeyExpression | undefined): boolean;
	getContextKeyValue<T>(key: string): T | undefined;

	createScoped(target: IContextKeyServiceTarget): IScopedContextKeyService;
	createOverlay(overlay: Iterable<[string, any]>): IContextKeyService;
	getContext(target: IContextKeyServiceTarget | null): IContext;

	updateParent(parentContextKeyService: IContextKeyService): void;
}

function cmp1(key1: string, key2: string): number {
	if (key1 < key2) {
		return -1;
	}
	if (key1 > key2) {
		return 1;
	}
	return 0;
}

function cmp2(key1: string, value1: any, key2: string, value2: any): number {
	if (key1 < key2) {
		return -1;
	}
	if (key1 > key2) {
		return 1;
	}
	if (value1 < value2) {
		return -1;
	}
	if (value1 > value2) {
		return 1;
	}
	return 0;
}

/**
 * Returns true if it is provable `p` implies `q`.
 */
export function implies(p: ContextKeyExpression, q: ContextKeyExpression): boolean {

	if (p.type === ContextKeyExprType.False || q.type === ContextKeyExprType.True) {
		// false implies anything
		// anything implies true
		return true;
	}

	if (p.type === ContextKeyExprType.Or) {
		if (q.type === ContextKeyExprType.Or) {
			// `a || b || c` can only imply something like `a || b || c || d`
			return allElementsIncluded(p.expr, q.expr);
		}
		return false;
	}

	if (q.type === ContextKeyExprType.Or) {
		for (const element of q.expr) {
			if (implies(p, element)) {
				return true;
			}
		}
		return false;
	}

	if (p.type === ContextKeyExprType.And) {
		if (q.type === ContextKeyExprType.And) {
			// `a && b && c` implies `a && c`
			return allElementsIncluded(q.expr, p.expr);
		}
		for (const element of p.expr) {
			if (implies(element, q)) {
				return true;
			}
		}
		return false;
	}

	return p.equals(q);
}

/**
 * Returns true if all elements in `p` are also present in `q`.
 * The two arrays are assumed to be sorted
 */
function allElementsIncluded(p: ContextKeyExpression[], q: ContextKeyExpression[]): boolean {
	let pIndex = 0;
	let qIndex = 0;
	while (pIndex < p.length && qIndex < q.length) {
		const cmp = p[pIndex].cmp(q[qIndex]);

		if (cmp < 0) {
			// an element from `p` is missing from `q`
			return false;
		} else if (cmp === 0) {
			pIndex++;
			qIndex++;
		} else {
			qIndex++;
		}
	}
	return (pIndex === p.length);
}

function getTerminals(node: ContextKeyExpression) {
	if (node.type === ContextKeyExprType.Or) {
		return node.expr;
	}
	return [node];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/contextkey/common/contextkeys.ts]---
Location: vscode-main/src/vs/platform/contextkey/common/contextkeys.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isIOS, isLinux, isMacintosh, isMobile, isWeb, isWindows } from '../../../base/common/platform.js';
import { localize } from '../../../nls.js';
import { RawContextKey } from './contextkey.js';

export const IsMacContext = new RawContextKey<boolean>('isMac', isMacintosh, localize('isMac', "Whether the operating system is macOS"));
export const IsLinuxContext = new RawContextKey<boolean>('isLinux', isLinux, localize('isLinux', "Whether the operating system is Linux"));
export const IsWindowsContext = new RawContextKey<boolean>('isWindows', isWindows, localize('isWindows', "Whether the operating system is Windows"));

export const IsWebContext = new RawContextKey<boolean>('isWeb', isWeb, localize('isWeb', "Whether the platform is a web browser"));
export const IsMacNativeContext = new RawContextKey<boolean>('isMacNative', isMacintosh && !isWeb, localize('isMacNative', "Whether the operating system is macOS on a non-browser platform"));
export const IsIOSContext = new RawContextKey<boolean>('isIOS', isIOS, localize('isIOS', "Whether the operating system is iOS"));
export const IsMobileContext = new RawContextKey<boolean>('isMobile', isMobile, localize('isMobile', "Whether the platform is a mobile web browser"));

export const IsDevelopmentContext = new RawContextKey<boolean>('isDevelopment', false, true);
export const ProductQualityContext = new RawContextKey<string>('productQualityType', '', localize('productQualityType', "Quality type of VS Code"));

export const InputFocusedContextKey = 'inputFocus';
export const InputFocusedContext = new RawContextKey<boolean>(InputFocusedContextKey, false, localize('inputFocus', "Whether keyboard focus is inside an input box"));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/contextkey/common/scanner.ts]---
Location: vscode-main/src/vs/platform/contextkey/common/scanner.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../base/common/charCode.js';
import { illegalState } from '../../../base/common/errors.js';
import { localize } from '../../../nls.js';

export const enum TokenType {
	LParen,
	RParen,
	Neg,
	Eq,
	NotEq,
	Lt,
	LtEq,
	Gt,
	GtEq,
	RegexOp,
	RegexStr,
	True,
	False,
	In,
	Not,
	And,
	Or,
	Str,
	QuotedStr,
	Error,
	EOF,
}

export type Token =
	| { type: TokenType.LParen; offset: number }
	| { type: TokenType.RParen; offset: number }
	| { type: TokenType.Neg; offset: number }
	| { type: TokenType.Eq; offset: number; isTripleEq: boolean }
	| { type: TokenType.NotEq; offset: number; isTripleEq: boolean }
	| { type: TokenType.Lt; offset: number }
	| { type: TokenType.LtEq; offset: number }
	| { type: TokenType.Gt; offset: number }
	| { type: TokenType.GtEq; offset: number }
	| { type: TokenType.RegexOp; offset: number }
	| { type: TokenType.RegexStr; offset: number; lexeme: string }
	| { type: TokenType.True; offset: number }
	| { type: TokenType.False; offset: number }
	| { type: TokenType.In; offset: number }
	| { type: TokenType.Not; offset: number }
	| { type: TokenType.And; offset: number }
	| { type: TokenType.Or; offset: number }
	| { type: TokenType.Str; offset: number; lexeme: string }
	| { type: TokenType.QuotedStr; offset: number; lexeme: string }
	| { type: TokenType.Error; offset: number; lexeme: string }
	| { type: TokenType.EOF; offset: number };

type KeywordTokenType = TokenType.Not | TokenType.In | TokenType.False | TokenType.True;
type TokenTypeWithoutLexeme =
	TokenType.LParen |
	TokenType.RParen |
	TokenType.Neg |
	TokenType.Lt |
	TokenType.LtEq |
	TokenType.Gt |
	TokenType.GtEq |
	TokenType.RegexOp |
	TokenType.True |
	TokenType.False |
	TokenType.In |
	TokenType.Not |
	TokenType.And |
	TokenType.Or |
	TokenType.EOF;

/**
 * Example:
 * `foo == bar'` - note how single quote doesn't have a corresponding closing quote,
 * so it's reported as unexpected
 */
export type LexingError = {
	offset: number; /** note that this doesn't take into account escape characters from the original encoding of the string, e.g., within an extension manifest file's JSON encoding  */
	lexeme: string;
	additionalInfo?: string;
};

function hintDidYouMean(...meant: string[]) {
	switch (meant.length) {
		case 1:
			return localize('contextkey.scanner.hint.didYouMean1', "Did you mean {0}?", meant[0]);
		case 2:
			return localize('contextkey.scanner.hint.didYouMean2', "Did you mean {0} or {1}?", meant[0], meant[1]);
		case 3:
			return localize('contextkey.scanner.hint.didYouMean3', "Did you mean {0}, {1} or {2}?", meant[0], meant[1], meant[2]);
		default: // we just don't expect that many
			return undefined;
	}
}

const hintDidYouForgetToOpenOrCloseQuote = localize('contextkey.scanner.hint.didYouForgetToOpenOrCloseQuote', "Did you forget to open or close the quote?");
const hintDidYouForgetToEscapeSlash = localize('contextkey.scanner.hint.didYouForgetToEscapeSlash', "Did you forget to escape the '/' (slash) character? Put two backslashes before it to escape, e.g., '\\\\/\'.");

/**
 * A simple scanner for context keys.
 *
 * Example:
 *
 * ```ts
 * const scanner = new Scanner().reset('resourceFileName =~ /docker/ && !config.docker.enabled');
 * const tokens = [...scanner];
 * if (scanner.errorTokens.length > 0) {
 *     scanner.errorTokens.forEach(err => console.error(`Unexpected token at ${err.offset}: ${err.lexeme}\nHint: ${err.additional}`));
 * } else {
 *     // process tokens
 * }
 * ```
 */
export class Scanner {

	static getLexeme(token: Token): string {
		switch (token.type) {
			case TokenType.LParen:
				return '(';
			case TokenType.RParen:
				return ')';
			case TokenType.Neg:
				return '!';
			case TokenType.Eq:
				return token.isTripleEq ? '===' : '==';
			case TokenType.NotEq:
				return token.isTripleEq ? '!==' : '!=';
			case TokenType.Lt:
				return '<';
			case TokenType.LtEq:
				return '<=';
			case TokenType.Gt:
				return '>=';
			case TokenType.GtEq:
				return '>=';
			case TokenType.RegexOp:
				return '=~';
			case TokenType.RegexStr:
				return token.lexeme;
			case TokenType.True:
				return 'true';
			case TokenType.False:
				return 'false';
			case TokenType.In:
				return 'in';
			case TokenType.Not:
				return 'not';
			case TokenType.And:
				return '&&';
			case TokenType.Or:
				return '||';
			case TokenType.Str:
				return token.lexeme;
			case TokenType.QuotedStr:
				return token.lexeme;
			case TokenType.Error:
				return token.lexeme;
			case TokenType.EOF:
				return 'EOF';
			default:
				throw illegalState(`unhandled token type: ${JSON.stringify(token)}; have you forgotten to add a case?`);
		}
	}

	private static _regexFlags = new Set(['i', 'g', 's', 'm', 'y', 'u'].map(ch => ch.charCodeAt(0)));

	private static _keywords = new Map<string, KeywordTokenType>([
		['not', TokenType.Not],
		['in', TokenType.In],
		['false', TokenType.False],
		['true', TokenType.True],
	]);

	private _input: string = '';
	private _start: number = 0;
	private _current: number = 0;
	private _tokens: Token[] = [];
	private _errors: LexingError[] = [];

	get errors(): Readonly<LexingError[]> {
		return this._errors;
	}

	reset(value: string) {
		this._input = value;

		this._start = 0;
		this._current = 0;
		this._tokens = [];
		this._errors = [];

		return this;
	}

	scan() {
		while (!this._isAtEnd()) {

			this._start = this._current;

			const ch = this._advance();
			switch (ch) {
				case CharCode.OpenParen: this._addToken(TokenType.LParen); break;
				case CharCode.CloseParen: this._addToken(TokenType.RParen); break;

				case CharCode.ExclamationMark:
					if (this._match(CharCode.Equals)) {
						const isTripleEq = this._match(CharCode.Equals); // eat last `=` if `!==`
						this._tokens.push({ type: TokenType.NotEq, offset: this._start, isTripleEq });
					} else {
						this._addToken(TokenType.Neg);
					}
					break;

				case CharCode.SingleQuote: this._quotedString(); break;
				case CharCode.Slash: this._regex(); break;

				case CharCode.Equals:
					if (this._match(CharCode.Equals)) { // support `==`
						const isTripleEq = this._match(CharCode.Equals); // eat last `=` if `===`
						this._tokens.push({ type: TokenType.Eq, offset: this._start, isTripleEq });
					} else if (this._match(CharCode.Tilde)) {
						this._addToken(TokenType.RegexOp);
					} else {
						this._error(hintDidYouMean('==', '=~'));
					}
					break;

				case CharCode.LessThan: this._addToken(this._match(CharCode.Equals) ? TokenType.LtEq : TokenType.Lt); break;

				case CharCode.GreaterThan: this._addToken(this._match(CharCode.Equals) ? TokenType.GtEq : TokenType.Gt); break;

				case CharCode.Ampersand:
					if (this._match(CharCode.Ampersand)) {
						this._addToken(TokenType.And);
					} else {
						this._error(hintDidYouMean('&&'));
					}
					break;

				case CharCode.Pipe:
					if (this._match(CharCode.Pipe)) {
						this._addToken(TokenType.Or);
					} else {
						this._error(hintDidYouMean('||'));
					}
					break;

				// TODO@ulugbekna: 1) rewrite using a regex 2) reconsider what characters are considered whitespace, including unicode, nbsp, etc.
				case CharCode.Space:
				case CharCode.CarriageReturn:
				case CharCode.Tab:
				case CharCode.LineFeed:
				case CharCode.NoBreakSpace: // &nbsp
					break;

				default:
					this._string();
			}
		}

		this._start = this._current;
		this._addToken(TokenType.EOF);

		return Array.from(this._tokens);
	}

	private _match(expected: number): boolean {
		if (this._isAtEnd()) {
			return false;
		}
		if (this._input.charCodeAt(this._current) !== expected) {
			return false;
		}
		this._current++;
		return true;
	}

	private _advance(): number {
		return this._input.charCodeAt(this._current++);
	}

	private _peek(): number {
		return this._isAtEnd() ? CharCode.Null : this._input.charCodeAt(this._current);
	}

	private _addToken(type: TokenTypeWithoutLexeme) {
		this._tokens.push({ type, offset: this._start });
	}

	private _error(additional?: string) {
		const offset = this._start;
		const lexeme = this._input.substring(this._start, this._current);
		const errToken: Token = { type: TokenType.Error, offset: this._start, lexeme };
		this._errors.push({ offset, lexeme, additionalInfo: additional });
		this._tokens.push(errToken);
	}

	// u - unicode, y - sticky // TODO@ulugbekna: we accept double quotes as part of the string rather than as a delimiter (to preserve old parser's behavior)
	private stringRe = /[a-zA-Z0-9_<>\-\./\\:\*\?\+\[\]\^,#@;"%\$\p{L}-]+/uy;
	private _string() {
		this.stringRe.lastIndex = this._start;
		const match = this.stringRe.exec(this._input);
		if (match) {
			this._current = this._start + match[0].length;
			const lexeme = this._input.substring(this._start, this._current);
			const keyword = Scanner._keywords.get(lexeme);
			if (keyword) {
				this._addToken(keyword);
			} else {
				this._tokens.push({ type: TokenType.Str, lexeme, offset: this._start });
			}
		}
	}

	// captures the lexeme without the leading and trailing '
	private _quotedString() {
		while (this._peek() !== CharCode.SingleQuote && !this._isAtEnd()) { // TODO@ulugbekna: add support for escaping ' ?
			this._advance();
		}

		if (this._isAtEnd()) {
			this._error(hintDidYouForgetToOpenOrCloseQuote);
			return;
		}

		// consume the closing '
		this._advance();

		this._tokens.push({ type: TokenType.QuotedStr, lexeme: this._input.substring(this._start + 1, this._current - 1), offset: this._start + 1 });
	}

	/*
	 * Lexing a regex expression: /.../[igsmyu]*
	 * Based on https://github.com/microsoft/TypeScript/blob/9247ef115e617805983740ba795d7a8164babf89/src/compiler/scanner.ts#L2129-L2181
	 *
	 * Note that we want slashes within a regex to be escaped, e.g., /file:\\/\\/\\// should match `file:///`
	 */
	private _regex() {
		let p = this._current;

		let inEscape = false;
		let inCharacterClass = false;
		while (true) {
			if (p >= this._input.length) {
				this._current = p;
				this._error(hintDidYouForgetToEscapeSlash);
				return;
			}

			const ch = this._input.charCodeAt(p);

			if (inEscape) { // parsing an escape character
				inEscape = false;
			} else if (ch === CharCode.Slash && !inCharacterClass) { // end of regex
				p++;
				break;
			} else if (ch === CharCode.OpenSquareBracket) {
				inCharacterClass = true;
			} else if (ch === CharCode.Backslash) {
				inEscape = true;
			} else if (ch === CharCode.CloseSquareBracket) {
				inCharacterClass = false;
			}
			p++;
		}

		// Consume flags // TODO@ulugbekna: use regex instead
		while (p < this._input.length && Scanner._regexFlags.has(this._input.charCodeAt(p))) {
			p++;
		}

		this._current = p;

		const lexeme = this._input.substring(this._start, this._current);
		this._tokens.push({ type: TokenType.RegexStr, lexeme, offset: this._start });
	}

	private _isAtEnd() {
		return this._current >= this._input.length;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/contextkey/test/browser/contextkey.test.ts]---
Location: vscode-main/src/vs/platform/contextkey/test/browser/contextkey.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DeferredPromise } from '../../../../base/common/async.js';
import { URI } from '../../../../base/common/uri.js';
import { mock } from '../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IConfigurationService } from '../../../configuration/common/configuration.js';
import { TestConfigurationService } from '../../../configuration/test/common/testConfigurationService.js';
import { ContextKeyService, setContext } from '../../browser/contextKeyService.js';
import { ContextKeyExpr, IContextKeyService } from '../../common/contextkey.js';
import { ServiceCollection } from '../../../instantiation/common/serviceCollection.js';
import { TestInstantiationService } from '../../../instantiation/test/common/instantiationServiceMock.js';
import { ITelemetryService } from '../../../telemetry/common/telemetry.js';

suite('ContextKeyService', () => {
	const testDisposables = ensureNoDisposablesAreLeakedInTestSuite();

	test('updateParent', () => {
		const root = testDisposables.add(new ContextKeyService(new TestConfigurationService()));
		const parent1 = testDisposables.add(root.createScoped(document.createElement('div')));
		const parent2 = testDisposables.add(root.createScoped(document.createElement('div')));

		const child = testDisposables.add(parent1.createScoped(document.createElement('div')));
		parent1.createKey('testA', 1);
		parent1.createKey('testB', 2);
		parent1.createKey('testD', 0);

		parent2.createKey('testA', 3);
		parent2.createKey('testC', 4);
		parent2.createKey('testD', 0);

		let complete: () => void;
		let reject: (err: Error) => void;
		const p = new Promise<void>((_complete, _reject) => {
			complete = _complete;
			reject = _reject;
		});
		testDisposables.add(child.onDidChangeContext(e => {
			try {
				assert.ok(e.affectsSome(new Set(['testA'])), 'testA changed');
				assert.ok(e.affectsSome(new Set(['testB'])), 'testB changed');
				assert.ok(e.affectsSome(new Set(['testC'])), 'testC changed');
				assert.ok(!e.affectsSome(new Set(['testD'])), 'testD did not change');

				assert.strictEqual(child.getContextKeyValue('testA'), 3);
				assert.strictEqual(child.getContextKeyValue('testB'), undefined);
				assert.strictEqual(child.getContextKeyValue('testC'), 4);
				assert.strictEqual(child.getContextKeyValue('testD'), 0);
			} catch (err) {
				reject(err);
				return;
			}

			complete();
		}));

		child.updateParent(parent2);

		return p;
	});

	test('updateParent to same service', () => {
		const root = testDisposables.add(new ContextKeyService(new TestConfigurationService()));
		const parent1 = testDisposables.add(root.createScoped(document.createElement('div')));

		const child = testDisposables.add(parent1.createScoped(document.createElement('div')));
		parent1.createKey('testA', 1);
		parent1.createKey('testB', 2);
		parent1.createKey('testD', 0);

		let eventFired = false;
		testDisposables.add(child.onDidChangeContext(e => {
			eventFired = true;
		}));

		child.updateParent(parent1);

		assert.strictEqual(eventFired, false);
	});

	test('issue #147732: URIs as context values', () => {
		const configurationService: IConfigurationService = new TestConfigurationService();
		const contextKeyService: IContextKeyService = testDisposables.add(new ContextKeyService(configurationService));
		const instantiationService = testDisposables.add(new TestInstantiationService(new ServiceCollection(
			[IConfigurationService, configurationService],
			[IContextKeyService, contextKeyService],
			[ITelemetryService, new class extends mock<ITelemetryService>() {
				override async publicLog2() {
					//
				}
			}]
		)));

		const uri = URI.parse('test://abc');
		contextKeyService.createKey<string>('notebookCellResource', undefined).set(uri.toString());
		instantiationService.invokeFunction(setContext, 'jupyter.runByLineCells', JSON.parse(JSON.stringify([uri])));

		const expr = ContextKeyExpr.in('notebookCellResource', 'jupyter.runByLineCells');
		assert.deepStrictEqual(contextKeyService.contextMatchesRules(expr), true);
	});

	test('suppress update event from parent when one key is overridden by child', () => {
		const root = testDisposables.add(new ContextKeyService(new TestConfigurationService()));
		const child = testDisposables.add(root.createScoped(document.createElement('div')));

		root.createKey('testA', 1);
		child.createKey('testA', 4);

		let fired = false;
		const event = testDisposables.add(child.onDidChangeContext(e => fired = true));
		root.setContext('testA', 10);
		assert.strictEqual(fired, false, 'Should not fire event when overridden key is updated in parent');
		event.dispose();
	});

	test('suppress update event from parent when all keys are overridden by child', () => {
		const root = testDisposables.add(new ContextKeyService(new TestConfigurationService()));
		const child = testDisposables.add(root.createScoped(document.createElement('div')));

		root.createKey('testA', 1);
		root.createKey('testB', 2);
		root.createKey('testC', 3);

		child.createKey('testA', 4);
		child.createKey('testB', 5);
		child.createKey('testD', 6);

		let fired = false;
		const event = testDisposables.add(child.onDidChangeContext(e => fired = true));
		root.bufferChangeEvents(() => {
			root.setContext('testA', 10);
			root.setContext('testB', 20);
			root.setContext('testD', 30);
		});

		assert.strictEqual(fired, false, 'Should not fire event when overridden key is updated in parent');
		event.dispose();
	});

	test('pass through update event from parent when one key is not overridden by child', () => {
		const root = testDisposables.add(new ContextKeyService(new TestConfigurationService()));
		const child = testDisposables.add(root.createScoped(document.createElement('div')));

		root.createKey('testA', 1);
		root.createKey('testB', 2);
		root.createKey('testC', 3);

		child.createKey('testA', 4);
		child.createKey('testB', 5);
		child.createKey('testD', 6);

		const def = new DeferredPromise();
		testDisposables.add(child.onDidChangeContext(e => {
			try {
				assert.ok(e.affectsSome(new Set(['testA'])), 'testA changed');
				assert.ok(e.affectsSome(new Set(['testB'])), 'testB changed');
				assert.ok(e.affectsSome(new Set(['testC'])), 'testC changed');
			} catch (err) {
				def.error(err);
				return;
			}

			def.complete(undefined);
		}));

		root.bufferChangeEvents(() => {
			root.setContext('testA', 10);
			root.setContext('testB', 20);
			root.setContext('testC', 30);
		});

		return def.p;
	});

	test('setting identical array values should not fire change event', () => {
		const root = testDisposables.add(new ContextKeyService(new TestConfigurationService()));
		const key = root.createKey<string[]>('testArray', ['a', 'b', 'c']);

		let eventFired = false;
		testDisposables.add(root.onDidChangeContext(e => {
			eventFired = true;
		}));

		// Set the same array content (different reference)
		key.set(['a', 'b', 'c']);

		assert.strictEqual(eventFired, false, 'Should not fire event when setting identical array');
	});

	test('setting different array values should fire change event', () => {
		const root = testDisposables.add(new ContextKeyService(new TestConfigurationService()));
		const key = root.createKey<string[]>('testArray', ['a', 'b', 'c']);

		let eventFired = false;
		testDisposables.add(root.onDidChangeContext(e => {
			eventFired = true;
		}));

		// Set a different array
		key.set(['a', 'b', 'd']);

		assert.strictEqual(eventFired, true, 'Should fire event when setting different array');
	});

	test('setting identical complex object should not fire change event', () => {
		const root = testDisposables.add(new ContextKeyService(new TestConfigurationService()));
		const initialValue = { foo: 'bar', count: 42 };
		const key = root.createKey<Record<string, string | number>>('testObject', initialValue);

		let eventFired = false;
		testDisposables.add(root.onDidChangeContext(e => {
			eventFired = true;
		}));

		// Set the same object content (different reference)
		key.set({ foo: 'bar', count: 42 });

		assert.strictEqual(eventFired, false, 'Should not fire event when setting identical object');
	});

	test('setting different complex object should fire change event', () => {
		const root = testDisposables.add(new ContextKeyService(new TestConfigurationService()));
		const initialValue = { foo: 'bar', count: 42 };
		const key = root.createKey<Record<string, string | number>>('testObject', initialValue);

		let eventFired = false;
		testDisposables.add(root.onDidChangeContext(e => {
			eventFired = true;
		}));

		// Set a different object
		key.set({ foo: 'bar', count: 43 });

		assert.strictEqual(eventFired, true, 'Should fire event when setting different object');
	});

	test('setting empty arrays should not fire change event when identical', () => {
		const root = testDisposables.add(new ContextKeyService(new TestConfigurationService()));
		const key = root.createKey<string[]>('testArray', []);

		let eventFired = false;
		testDisposables.add(root.onDidChangeContext(e => {
			eventFired = true;
		}));

		// Set another empty array
		key.set([]);

		assert.strictEqual(eventFired, false, 'Should not fire event when setting identical empty array');
	});

	test('setting nested arrays should handle deep equality', () => {
		const root = testDisposables.add(new ContextKeyService(new TestConfigurationService()));
		const initialValue = ['a:b', 'c:d'];
		const key = root.createKey<string[]>('testComplexArray', initialValue);

		let eventFired = false;
		testDisposables.add(root.onDidChangeContext(e => {
			eventFired = true;
		}));

		// Set the same array content with colon-separated values
		key.set(['a:b', 'c:d']);

		assert.strictEqual(eventFired, false, 'Should not fire event when setting identical array with complex values');
	});

	test('setting same primitive values should not fire change event', () => {
		const root = testDisposables.add(new ContextKeyService(new TestConfigurationService()));
		const key = root.createKey('testString', 'hello');

		let eventFired = false;
		testDisposables.add(root.onDidChangeContext(e => {
			eventFired = true;
		}));

		// Set the same string value
		key.set('hello');

		assert.strictEqual(eventFired, false, 'Should not fire event when setting identical string');
	});

	test('setting different primitive values should fire change event', () => {
		const root = testDisposables.add(new ContextKeyService(new TestConfigurationService()));
		const key = root.createKey<number>('testNumber', 42);

		let eventFired = false;
		testDisposables.add(root.onDidChangeContext(e => {
			eventFired = true;
		}));

		// Set a different number value
		key.set(43);

		assert.strictEqual(eventFired, true, 'Should fire event when setting different number');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/contextkey/test/common/contextkey.test.ts]---
Location: vscode-main/src/vs/platform/contextkey/test/common/contextkey.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { isLinux, isMacintosh, isWindows } from '../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ContextKeyExpr, ContextKeyExpression, implies } from '../../common/contextkey.js';

function createContext(ctx: any) {
	return {
		getValue: (key: string) => {
			return ctx[key];
		}
	};
}

suite('ContextKeyExpr', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('ContextKeyExpr.equals', () => {
		const a = ContextKeyExpr.and(
			ContextKeyExpr.has('a1'),
			ContextKeyExpr.and(ContextKeyExpr.has('and.a')),
			ContextKeyExpr.has('a2'),
			ContextKeyExpr.regex('d3', /d.*/),
			ContextKeyExpr.regex('d4', /\*\*3*/),
			ContextKeyExpr.equals('b1', 'bb1'),
			ContextKeyExpr.equals('b2', 'bb2'),
			ContextKeyExpr.notEquals('c1', 'cc1'),
			ContextKeyExpr.notEquals('c2', 'cc2'),
			ContextKeyExpr.not('d1'),
			ContextKeyExpr.not('d2')
		)!;
		const b = ContextKeyExpr.and(
			ContextKeyExpr.equals('b2', 'bb2'),
			ContextKeyExpr.notEquals('c1', 'cc1'),
			ContextKeyExpr.not('d1'),
			ContextKeyExpr.regex('d4', /\*\*3*/),
			ContextKeyExpr.notEquals('c2', 'cc2'),
			ContextKeyExpr.has('a2'),
			ContextKeyExpr.equals('b1', 'bb1'),
			ContextKeyExpr.regex('d3', /d.*/),
			ContextKeyExpr.has('a1'),
			ContextKeyExpr.and(ContextKeyExpr.equals('and.a', true)),
			ContextKeyExpr.not('d2')
		)!;
		assert(a.equals(b), 'expressions should be equal');
	});

	test('issue #134942: Equals in comparator expressions', () => {
		function testEquals(expr: ContextKeyExpression | undefined, str: string): void {
			const deserialized = ContextKeyExpr.deserialize(str);
			assert.ok(expr);
			assert.ok(deserialized);
			assert.strictEqual(expr.equals(deserialized), true, str);
		}
		testEquals(ContextKeyExpr.greater('value', 0), 'value > 0');
		testEquals(ContextKeyExpr.greaterEquals('value', 0), 'value >= 0');
		testEquals(ContextKeyExpr.smaller('value', 0), 'value < 0');
		testEquals(ContextKeyExpr.smallerEquals('value', 0), 'value <= 0');
	});

	test('normalize', () => {
		const key1IsTrue = ContextKeyExpr.equals('key1', true);
		const key1IsNotFalse = ContextKeyExpr.notEquals('key1', false);
		const key1IsFalse = ContextKeyExpr.equals('key1', false);
		const key1IsNotTrue = ContextKeyExpr.notEquals('key1', true);

		assert.ok(key1IsTrue.equals(ContextKeyExpr.has('key1')));
		assert.ok(key1IsNotFalse.equals(ContextKeyExpr.has('key1')));
		assert.ok(key1IsFalse.equals(ContextKeyExpr.not('key1')));
		assert.ok(key1IsNotTrue.equals(ContextKeyExpr.not('key1')));
	});

	test('evaluate', () => {
		const context = createContext({
			'a': true,
			'b': false,
			'c': '5',
			'd': 'd'
		});
		function testExpression(expr: string, expected: boolean): void {
			// console.log(expr + ' ' + expected);
			const rules = ContextKeyExpr.deserialize(expr);
			assert.strictEqual(rules!.evaluate(context), expected, expr);
		}
		function testBatch(expr: string, value: any): void {
			/* eslint-disable eqeqeq */
			testExpression(expr, !!value);
			testExpression(expr + ' == true', !!value);
			testExpression(expr + ' != true', !value);
			testExpression(expr + ' == false', !value);
			testExpression(expr + ' != false', !!value);
			// eslint-disable-next-line local/code-no-any-casts
			testExpression(expr + ' == 5', value == <any>'5');
			// eslint-disable-next-line local/code-no-any-casts
			testExpression(expr + ' != 5', value != <any>'5');
			testExpression('!' + expr, !value);
			testExpression(expr + ' =~ /d.*/', /d.*/.test(value));
			testExpression(expr + ' =~ /D/i', /D/i.test(value));
			/* eslint-enable eqeqeq */
		}

		testBatch('a', true);
		testBatch('b', false);
		testBatch('c', '5');
		testBatch('d', 'd');
		testBatch('z', undefined);

		testExpression('true', true);
		testExpression('false', false);
		testExpression('a && !b', true && !false);
		testExpression('a && b', true && false);
		testExpression('a && !b && c == 5', true && !false && '5' === '5');
		testExpression('d =~ /e.*/', false);

		// precedence test: false && true || true === true because && is evaluated first
		testExpression('b && a || a', true);

		testExpression('a || b', true);
		testExpression('b || b', false);
		testExpression('b && a || a && b', false);
	});

	test('negate', () => {
		function testNegate(expr: string, expected: string): void {
			const actual = ContextKeyExpr.deserialize(expr)!.negate().serialize();
			assert.strictEqual(actual, expected);
		}
		testNegate('true', 'false');
		testNegate('false', 'true');
		testNegate('a', '!a');
		testNegate('a && b || c', '!a && !c || !b && !c');
		testNegate('a && b || c || d', '!a && !c && !d || !b && !c && !d');
		testNegate('!a && !b || !c && !d', 'a && c || a && d || b && c || b && d');
		testNegate('!a && !b || !c && !d || !e && !f', 'a && c && e || a && c && f || a && d && e || a && d && f || b && c && e || b && c && f || b && d && e || b && d && f');
	});

	test('false, true', () => {
		function testNormalize(expr: string, expected: string): void {
			const actual = ContextKeyExpr.deserialize(expr)!.serialize();
			assert.strictEqual(actual, expected);
		}
		testNormalize('true', 'true');
		testNormalize('!true', 'false');
		testNormalize('false', 'false');
		testNormalize('!false', 'true');
		testNormalize('a && true', 'a');
		testNormalize('a && false', 'false');
		testNormalize('a || true', 'true');
		testNormalize('a || false', 'a');
		testNormalize('isMac', isMacintosh ? 'true' : 'false');
		testNormalize('isLinux', isLinux ? 'true' : 'false');
		testNormalize('isWindows', isWindows ? 'true' : 'false');
	});

	test('issue #101015: distribute OR', () => {
		function t(expr1: string, expr2: string, expected: string | undefined): void {
			const e1 = ContextKeyExpr.deserialize(expr1);
			const e2 = ContextKeyExpr.deserialize(expr2);
			const actual = ContextKeyExpr.and(e1, e2)?.serialize();
			assert.strictEqual(actual, expected);
		}
		t('a', 'b', 'a && b');
		t('a || b', 'c', 'a && c || b && c');
		t('a || b', 'c || d', 'a && c || a && d || b && c || b && d');
		t('a || b', 'c && d', 'a && c && d || b && c && d');
		t('a || b', 'c && d || e', 'a && e || b && e || a && c && d || b && c && d');
	});

	test('ContextKeyInExpr', () => {
		const ainb = ContextKeyExpr.deserialize('a in b')!;
		assert.strictEqual(ainb.evaluate(createContext({ 'a': 3, 'b': [3, 2, 1] })), true);
		assert.strictEqual(ainb.evaluate(createContext({ 'a': 3, 'b': [1, 2, 3] })), true);
		assert.strictEqual(ainb.evaluate(createContext({ 'a': 3, 'b': [1, 2] })), false);
		assert.strictEqual(ainb.evaluate(createContext({ 'a': 3 })), false);
		assert.strictEqual(ainb.evaluate(createContext({ 'a': 3, 'b': null })), false);
		assert.strictEqual(ainb.evaluate(createContext({ 'a': 'x', 'b': ['x'] })), true);
		assert.strictEqual(ainb.evaluate(createContext({ 'a': 'x', 'b': ['y'] })), false);
		assert.strictEqual(ainb.evaluate(createContext({ 'a': 'x', 'b': {} })), false);
		assert.strictEqual(ainb.evaluate(createContext({ 'a': 'x', 'b': { 'x': false } })), true);
		assert.strictEqual(ainb.evaluate(createContext({ 'a': 'x', 'b': { 'x': true } })), true);
		assert.strictEqual(ainb.evaluate(createContext({ 'a': 'prototype', 'b': {} })), false);
	});

	test('ContextKeyNotInExpr', () => {
		const aNotInB = ContextKeyExpr.deserialize('a not in b')!;
		assert.strictEqual(aNotInB.evaluate(createContext({ 'a': 3, 'b': [3, 2, 1] })), false);
		assert.strictEqual(aNotInB.evaluate(createContext({ 'a': 3, 'b': [1, 2, 3] })), false);
		assert.strictEqual(aNotInB.evaluate(createContext({ 'a': 3, 'b': [1, 2] })), true);
		assert.strictEqual(aNotInB.evaluate(createContext({ 'a': 3 })), true);
		assert.strictEqual(aNotInB.evaluate(createContext({ 'a': 3, 'b': null })), true);
		assert.strictEqual(aNotInB.evaluate(createContext({ 'a': 'x', 'b': ['x'] })), false);
		assert.strictEqual(aNotInB.evaluate(createContext({ 'a': 'x', 'b': ['y'] })), true);
		assert.strictEqual(aNotInB.evaluate(createContext({ 'a': 'x', 'b': {} })), true);
		assert.strictEqual(aNotInB.evaluate(createContext({ 'a': 'x', 'b': { 'x': false } })), false);
		assert.strictEqual(aNotInB.evaluate(createContext({ 'a': 'x', 'b': { 'x': true } })), false);
		assert.strictEqual(aNotInB.evaluate(createContext({ 'a': 'prototype', 'b': {} })), true);
	});

	test('issue #106524: distributing AND should normalize', () => {
		const actual = ContextKeyExpr.and(
			ContextKeyExpr.or(
				ContextKeyExpr.has('a'),
				ContextKeyExpr.has('b')
			),
			ContextKeyExpr.has('c')
		);
		const expected = ContextKeyExpr.or(
			ContextKeyExpr.and(
				ContextKeyExpr.has('a'),
				ContextKeyExpr.has('c')
			),
			ContextKeyExpr.and(
				ContextKeyExpr.has('b'),
				ContextKeyExpr.has('c')
			)
		);
		assert.strictEqual(actual!.equals(expected!), true);
	});

	test('issue #129625: Removes duplicated terms in OR expressions', () => {
		const expr = ContextKeyExpr.or(
			ContextKeyExpr.has('A'),
			ContextKeyExpr.has('B'),
			ContextKeyExpr.has('A')
		)!;
		assert.strictEqual(expr.serialize(), 'A || B');
	});

	test('Resolves true constant OR expressions', () => {
		const expr = ContextKeyExpr.or(
			ContextKeyExpr.has('A'),
			ContextKeyExpr.not('A')
		)!;
		assert.strictEqual(expr.serialize(), 'true');
	});

	test('Resolves false constant AND expressions', () => {
		const expr = ContextKeyExpr.and(
			ContextKeyExpr.has('A'),
			ContextKeyExpr.not('A')
		)!;
		assert.strictEqual(expr.serialize(), 'false');
	});

	test('issue #129625: Removes duplicated terms in AND expressions', () => {
		const expr = ContextKeyExpr.and(
			ContextKeyExpr.has('A'),
			ContextKeyExpr.has('B'),
			ContextKeyExpr.has('A')
		)!;
		assert.strictEqual(expr.serialize(), 'A && B');
	});

	test('issue #129625: Remove duplicated terms when negating', () => {
		const expr = ContextKeyExpr.and(
			ContextKeyExpr.has('A'),
			ContextKeyExpr.or(
				ContextKeyExpr.has('B1'),
				ContextKeyExpr.has('B2'),
			)
		)!;
		assert.strictEqual(expr.serialize(), 'A && B1 || A && B2');
		assert.strictEqual(expr.negate()!.serialize(), '!A || !A && !B1 || !A && !B2 || !B1 && !B2');
		assert.strictEqual(expr.negate()!.negate()!.serialize(), 'A && B1 || A && B2');
		assert.strictEqual(expr.negate()!.negate()!.negate()!.serialize(), '!A || !A && !B1 || !A && !B2 || !B1 && !B2');
	});

	test('issue #129625: remove redundant terms in OR expressions', () => {
		function strImplies(p0: string, q0: string): boolean {
			const p = ContextKeyExpr.deserialize(p0)!;
			const q = ContextKeyExpr.deserialize(q0)!;
			return implies(p, q);
		}
		assert.strictEqual(strImplies('a && b', 'a'), true);
		assert.strictEqual(strImplies('a', 'a && b'), false);
	});

	test('implies', () => {
		function strImplies(p0: string, q0: string): boolean {
			const p = ContextKeyExpr.deserialize(p0)!;
			const q = ContextKeyExpr.deserialize(q0)!;
			return implies(p, q);
		}
		assert.strictEqual(strImplies('a', 'a'), true);
		assert.strictEqual(strImplies('a', 'a || b'), true);
		assert.strictEqual(strImplies('a', 'a && b'), false);
		assert.strictEqual(strImplies('a', 'a && b || a && c'), false);
		assert.strictEqual(strImplies('a && b', 'a'), true);
		assert.strictEqual(strImplies('a && b', 'b'), true);
		assert.strictEqual(strImplies('a && b', 'a && b || c'), true);
		assert.strictEqual(strImplies('a || b', 'a || c'), false);
		assert.strictEqual(strImplies('a || b', 'a || b'), true);
		assert.strictEqual(strImplies('a && b', 'a && b'), true);
		assert.strictEqual(strImplies('a || b', 'a || b || c'), true);
		assert.strictEqual(strImplies('c && a && b', 'c && a'), true);
	});

	test('Greater, GreaterEquals, Smaller, SmallerEquals evaluate', () => {
		function checkEvaluate(expr: string, ctx: any, expected: any): void {
			const _expr = ContextKeyExpr.deserialize(expr)!;
			assert.strictEqual(_expr.evaluate(createContext(ctx)), expected);
		}

		checkEvaluate('a > 1', {}, false);
		checkEvaluate('a > 1', { a: 0 }, false);
		checkEvaluate('a > 1', { a: 1 }, false);
		checkEvaluate('a > 1', { a: 2 }, true);
		checkEvaluate('a > 1', { a: '0' }, false);
		checkEvaluate('a > 1', { a: '1' }, false);
		checkEvaluate('a > 1', { a: '2' }, true);
		checkEvaluate('a > 1', { a: 'a' }, false);

		checkEvaluate('a > 10', { a: 2 }, false);
		checkEvaluate('a > 10', { a: 11 }, true);
		checkEvaluate('a > 10', { a: '11' }, true);
		checkEvaluate('a > 10', { a: '2' }, false);
		checkEvaluate('a > 10', { a: '11' }, true);

		checkEvaluate('a > 1.1', { a: 1 }, false);
		checkEvaluate('a > 1.1', { a: 2 }, true);
		checkEvaluate('a > 1.1', { a: 11 }, true);
		checkEvaluate('a > 1.1', { a: '1.1' }, false);
		checkEvaluate('a > 1.1', { a: '2' }, true);
		checkEvaluate('a > 1.1', { a: '11' }, true);

		checkEvaluate('a > b', { a: 'b' }, false);
		checkEvaluate('a > b', { a: 'c' }, false);
		checkEvaluate('a > b', { a: 1000 }, false);

		checkEvaluate('a >= 2', { a: '1' }, false);
		checkEvaluate('a >= 2', { a: '2' }, true);
		checkEvaluate('a >= 2', { a: '3' }, true);

		checkEvaluate('a < 2', { a: '1' }, true);
		checkEvaluate('a < 2', { a: '2' }, false);
		checkEvaluate('a < 2', { a: '3' }, false);

		checkEvaluate('a <= 2', { a: '1' }, true);
		checkEvaluate('a <= 2', { a: '2' }, true);
		checkEvaluate('a <= 2', { a: '3' }, false);
	});

	test('Greater, GreaterEquals, Smaller, SmallerEquals negate', () => {
		function checkNegate(expr: string, expected: string): void {
			const a = ContextKeyExpr.deserialize(expr)!;
			const b = a.negate();
			assert.strictEqual(b.serialize(), expected);
		}

		checkNegate('a > 1', 'a <= 1');
		checkNegate('a > 1.1', 'a <= 1.1');
		checkNegate('a > b', 'a <= b');

		checkNegate('a >= 1', 'a < 1');
		checkNegate('a >= 1.1', 'a < 1.1');
		checkNegate('a >= b', 'a < b');

		checkNegate('a < 1', 'a >= 1');
		checkNegate('a < 1.1', 'a >= 1.1');
		checkNegate('a < b', 'a >= b');

		checkNegate('a <= 1', 'a > 1');
		checkNegate('a <= 1.1', 'a > 1.1');
		checkNegate('a <= b', 'a > b');
	});

	test('issue #111899: context keys can use `<` or `>` ', () => {
		const actual = ContextKeyExpr.deserialize('editorTextFocus && vim.active && vim.use<C-r>')!;
		assert.ok(actual.equals(
			ContextKeyExpr.and(
				ContextKeyExpr.has('editorTextFocus'),
				ContextKeyExpr.has('vim.active'),
				ContextKeyExpr.has('vim.use<C-r>'),
			)!
		));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/contextkey/test/common/parser.test.ts]---
Location: vscode-main/src/vs/platform/contextkey/test/common/parser.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { Parser } from '../../common/contextkey.js';

function parseToStr(input: string): string {
	const parser = new Parser();

	const prints: string[] = [];

	const print = (...ss: string[]) => { ss.forEach(s => prints.push(s)); };

	const expr = parser.parse(input);
	if (expr === undefined) {
		if (parser.lexingErrors.length > 0) {
			print('Lexing errors:', '\n\n');
			parser.lexingErrors.forEach(lexingError => print(`Unexpected token '${lexingError.lexeme}' at offset ${lexingError.offset}. ${lexingError.additionalInfo}`, '\n'));
		}

		if (parser.parsingErrors.length > 0) {
			if (parser.lexingErrors.length > 0) { print('\n --- \n'); }
			print('Parsing errors:', '\n\n');
			parser.parsingErrors.forEach(parsingError => print(`Unexpected '${parsingError.lexeme}' at offset ${parsingError.offset}.`, '\n'));
		}

	} else {
		print(expr.serialize());
	}

	return prints.join('');
}

suite('Context Key Parser', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test(' foo', () => {
		const input = ' foo';
		assert.deepStrictEqual(parseToStr(input), 'foo');
	});

	test('!foo', () => {
		const input = '!foo';
		assert.deepStrictEqual(parseToStr(input), '!foo');
	});

	test('foo =~ /bar/', () => {
		const input = 'foo =~ /bar/';
		assert.deepStrictEqual(parseToStr(input), 'foo =~ /bar/');
	});

	test(`foo || (foo =~ /bar/ && baz)`, () => {
		const input = `foo || (foo =~ /bar/ && baz)`;
		assert.deepStrictEqual(parseToStr(input), 'foo || baz && foo =~ /bar/');
	});

	test('foo || (foo =~ /bar/ || baz)', () => {
		const input = 'foo || (foo =~ /bar/ || baz)';
		assert.deepStrictEqual(parseToStr(input), 'baz || foo || foo =~ /bar/');
	});

	test(`(foo || bar) && (jee || jar)`, () => {
		const input = `(foo || bar) && (jee || jar)`;
		assert.deepStrictEqual(parseToStr(input), 'bar && jar || bar && jee || foo && jar || foo && jee');
	});

	test('foo && foo =~ /zee/i', () => {
		const input = 'foo && foo =~ /zee/i';
		assert.deepStrictEqual(parseToStr(input), 'foo && foo =~ /zee/i');
	});

	test('foo.bar==enabled', () => {
		const input = 'foo.bar==enabled';
		assert.deepStrictEqual(parseToStr(input), `foo.bar == 'enabled'`);
	});

	test(`foo.bar == 'enabled'`, () => {
		const input = `foo.bar == 'enabled'`;
		assert.deepStrictEqual(parseToStr(input), `foo.bar == 'enabled'`);
	});

	test('foo.bar:zed==completed - equality with no space', () => {
		const input = 'foo.bar:zed==completed';
		assert.deepStrictEqual(parseToStr(input), `foo.bar:zed == 'completed'`);
	});

	test('a && b || c', () => {
		const input = 'a && b || c';
		assert.deepStrictEqual(parseToStr(input), 'c || a && b');
	});

	test('fooBar && baz.jar && fee.bee<K-loo+1>', () => {
		const input = 'fooBar && baz.jar && fee.bee<K-loo+1>';
		assert.deepStrictEqual(parseToStr(input), 'baz.jar && fee.bee<K-loo+1> && fooBar');
	});

	test('foo.barBaz<C-r> < 2', () => {
		const input = 'foo.barBaz<C-r> < 2';
		assert.deepStrictEqual(parseToStr(input), `foo.barBaz<C-r> < 2`);
	});

	test('foo.bar >= -1', () => {
		const input = 'foo.bar >= -1';
		assert.deepStrictEqual(parseToStr(input), 'foo.bar >= -1');
	});

	test(`key contains &nbsp: view == vsc-packages-activitybar-folders && vsc-packages-folders-loaded`, () => {
		const input = `view == vsc-packages-activitybar-folders && vsc-packages-folders-loaded`;
		assert.deepStrictEqual(parseToStr(input), `vsc-packages-folders-loaded && view == 'vsc-packages-activitybar-folders'`);
	});

	test('foo.bar <= -1', () => {
		const input = 'foo.bar <= -1';
		assert.deepStrictEqual(parseToStr(input), `foo.bar <= -1`);
	});

	test('!cmake:hideBuildCommand \u0026\u0026 cmake:enableFullFeatureSet', () => {
		const input = '!cmake:hideBuildCommand \u0026\u0026 cmake:enableFullFeatureSet';
		assert.deepStrictEqual(parseToStr(input), 'cmake:enableFullFeatureSet && !cmake:hideBuildCommand');
	});

	test('!(foo && bar)', () => {
		const input = '!(foo && bar)';
		assert.deepStrictEqual(parseToStr(input), '!bar || !foo');
	});

	test('!(foo && bar || boar) || deer', () => {
		const input = '!(foo && bar || boar) || deer';
		assert.deepStrictEqual(parseToStr(input), 'deer || !bar && !boar || !boar && !foo');
	});

	test(`!(!foo)`, () => {
		const input = `!(!foo)`;
		assert.deepStrictEqual(parseToStr(input), 'foo');
	});

	suite('controversial', () => {
		/*
			new parser KEEPS old one's behavior:

			old parser output: { key: 'debugState', op: '==', value: '"stopped"' }
			new parser output: { key: 'debugState', op: '==', value: '"stopped"' }

			TODO@ulugbekna: we should consider breaking old parser's behavior, and not take double quotes as part of the `value` because that's not what user expects.
		*/
		test(`debugState == "stopped"`, () => {
			const input = `debugState == "stopped"`;
			assert.deepStrictEqual(parseToStr(input), `debugState == '"stopped"'`);
		});

		/*
			new parser BREAKS old one's behavior:

			old parser output: { key: 'viewItem', op: '==', value: 'VSCode WorkSpace' }
			new parser output: { key: 'viewItem', op: '==', value: 'VSCode' }

			TODO@ulugbekna: since this's breaking, we can have hacky code that tries detecting such cases and replicate old parser's behavior.
		*/
		test(` viewItem == VSCode WorkSpace`, () => {
			const input = ` viewItem == VSCode WorkSpace`;
			assert.deepStrictEqual(parseToStr(input), `Parsing errors:\n\nUnexpected 'WorkSpace' at offset 20.\n`);
		});


	});

	suite('regex', () => {

		test(`resource =~ //foo/(barr|door/(Foo-Bar%20Templates|Soo%20Looo)|Web%20Site%Jjj%20Llll)(/.*)*$/`, () => {
			const input = `resource =~ //foo/(barr|door/(Foo-Bar%20Templates|Soo%20Looo)|Web%20Site%Jjj%20Llll)(/.*)*$/`;
			assert.deepStrictEqual(parseToStr(input), 'resource =~ /\\/foo\\/(barr|door\\/(Foo-Bar%20Templates|Soo%20Looo)|Web%20Site%Jjj%20Llll)(\\/.*)*$/');
		});

		test(`resource =~ /((/scratch/(?!update)(.*)/)|((/src/).*/)).*$/`, () => {
			const input = `resource =~ /((/scratch/(?!update)(.*)/)|((/src/).*/)).*$/`;
			assert.deepStrictEqual(parseToStr(input), 'resource =~ /((\\/scratch\\/(?!update)(.*)\\/)|((\\/src\\/).*\\/)).*$/');
		});

		test(`resourcePath =~ /\.md(\.yml|\.txt)*$/giym`, () => {
			const input = `resourcePath =~ /\.md(\.yml|\.txt)*$/giym`;
			assert.deepStrictEqual(parseToStr(input), 'resourcePath =~ /.md(.yml|.txt)*$/im');
		});

	});

	suite('error handling', () => {

		test(`/foo`, () => {
			const input = `/foo`;
			assert.deepStrictEqual(parseToStr(input), `Lexing errors:\n\nUnexpected token '/foo' at offset 0. Did you forget to escape the '/' (slash) character? Put two backslashes before it to escape, e.g., '\\\\/'.\n\n --- \nParsing errors:\n\nUnexpected '/foo' at offset 0.\n`);
		});

		test(`!b == 'true'`, () => {
			const input = `!b == 'true'`;
			assert.deepStrictEqual(parseToStr(input), `Parsing errors:\n\nUnexpected '==' at offset 3.\n`);
		});

		test('!foo &&  in bar', () => {
			const input = '!foo &&  in bar';
			assert.deepStrictEqual(parseToStr(input), `Parsing errors:\n\nUnexpected 'in' at offset 9.\n`);
		});

		test('vim<c-r> == 1 && vim<2<=3', () => {
			const input = 'vim<c-r> == 1 && vim<2<=3';
			assert.deepStrictEqual(parseToStr(input), `Lexing errors:\n\nUnexpected token '=' at offset 23. Did you mean == or =~?\n\n --- \nParsing errors:\n\nUnexpected '=' at offset 23.\n`); // FIXME
		});

		test(`foo && 'bar`, () => {
			const input = `foo && 'bar`;
			assert.deepStrictEqual(parseToStr(input), `Lexing errors:\n\nUnexpected token ''bar' at offset 7. Did you forget to open or close the quote?\n\n --- \nParsing errors:\n\nUnexpected ''bar' at offset 7.\n`);
		});

		test(`config.foo &&  &&bar =~ /^foo$|^bar-foo$|^joo$|^jar$/ && !foo`, () => {
			const input = `config.foo &&  &&bar =~ /^foo$|^bar-foo$|^joo$|^jar$/ && !foo`;
			assert.deepStrictEqual(parseToStr(input), `Parsing errors:\n\nUnexpected '&&' at offset 15.\n`);
		});

		test(`!foo == 'test'`, () => {
			const input = `!foo == 'test'`;
			assert.deepStrictEqual(parseToStr(input), `Parsing errors:\n\nUnexpected '==' at offset 5.\n`);
		});

		test(`!!foo`, function () {
			const input = `!!foo`;
			assert.deepStrictEqual(parseToStr(input), `Parsing errors:\n\nUnexpected '!' at offset 1.\n`);
		});

	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/contextkey/test/common/scanner.test.ts]---
Location: vscode-main/src/vs/platform/contextkey/test/common/scanner.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { Scanner, Token, TokenType } from '../../common/scanner.js';

suite('Context Key Scanner', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	function tokenTypeToStr(token: Token) {
		switch (token.type) {
			case TokenType.LParen:
				return '(';
			case TokenType.RParen:
				return ')';
			case TokenType.Neg:
				return '!';
			case TokenType.Eq:
				return token.isTripleEq ? '===' : '==';
			case TokenType.NotEq:
				return token.isTripleEq ? '!==' : '!=';
			case TokenType.Lt:
				return '<';
			case TokenType.LtEq:
				return '<=';
			case TokenType.Gt:
				return '>';
			case TokenType.GtEq:
				return '>=';
			case TokenType.RegexOp:
				return '=~';
			case TokenType.RegexStr:
				return 'RegexStr';
			case TokenType.True:
				return 'true';
			case TokenType.False:
				return 'false';
			case TokenType.In:
				return 'in';
			case TokenType.Not:
				return 'not';
			case TokenType.And:
				return '&&';
			case TokenType.Or:
				return '||';
			case TokenType.Str:
				return 'Str';
			case TokenType.QuotedStr:
				return 'QuotedStr';
			case TokenType.Error:
				return 'ErrorToken';
			case TokenType.EOF:
				return 'EOF';
		}

	}

	function scan(input: string) {
		return (new Scanner()).reset(input).scan().map((token: Token) => {
			return 'lexeme' in token
				? {
					type: tokenTypeToStr(token),
					offset: token.offset,
					lexeme: token.lexeme
				} : {
					type: tokenTypeToStr(token),
					offset: token.offset
				};
		});
	}

	suite('scanning various cases of context keys', () => {

		test('foo.bar<C-shift+2>', () => {
			const input = 'foo.bar<C-shift+2>';
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', lexeme: 'foo.bar<C-shift+2>', offset: 0 }, { type: 'EOF', offset: 18 }]));
		});

		test('!foo', () => {
			const input = '!foo';
			assert.deepStrictEqual(scan(input), ([{ type: '!', offset: 0 }, { type: 'Str', lexeme: 'foo', offset: 1 }, { type: 'EOF', offset: 4 }]));
		});

		test('foo === bar', () => {
			const input = 'foo === bar';
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', offset: 0, lexeme: 'foo' }, { type: '===', offset: 4 }, { type: 'Str', offset: 8, lexeme: 'bar' }, { type: 'EOF', offset: 11 }]));
		});

		test('foo  !== bar', () => {
			const input = 'foo  !== bar';
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', offset: 0, lexeme: 'foo' }, { type: '!==', offset: 5 }, { type: 'Str', offset: 9, lexeme: 'bar' }, { type: 'EOF', offset: 12 }]));
		});

		test('!(foo && bar)', () => {
			const input = '!(foo && bar)';
			assert.deepStrictEqual(scan(input), ([{ type: '!', offset: 0 }, { type: '(', offset: 1 }, { type: 'Str', lexeme: 'foo', offset: 2 }, { type: '&&', offset: 6 }, { type: 'Str', lexeme: 'bar', offset: 9 }, { type: ')', offset: 12 }, { type: 'EOF', offset: 13 }]));
		});

		test('=~ ', () => {
			const input = '=~ ';
			assert.deepStrictEqual(scan(input), ([{ type: '=~', offset: 0 }, { type: 'EOF', offset: 3 }]));
		});

		test('foo =~ /bar/', () => {
			const input = 'foo =~ /bar/';
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', lexeme: 'foo', offset: 0 }, { type: '=~', offset: 4 }, { type: 'RegexStr', lexeme: '/bar/', offset: 7 }, { type: 'EOF', offset: 12 }]));
		});

		test('foo =~ /zee/i', () => {
			const input = 'foo =~ /zee/i';
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', lexeme: 'foo', offset: 0 }, { type: '=~', offset: 4 }, { type: 'RegexStr', lexeme: '/zee/i', offset: 7 }, { type: 'EOF', offset: 13 }]));
		});


		test('foo =~ /zee/gm', () => {
			const input = 'foo =~ /zee/gm';
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', lexeme: 'foo', offset: 0 }, { type: '=~', offset: 4 }, { type: 'RegexStr', lexeme: '/zee/gm', offset: 7 }, { type: 'EOF', offset: 14 }]));
		});

		test('foo in barrr  ', () => {
			const input = 'foo in barrr  ';
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', lexeme: 'foo', offset: 0 }, { type: 'in', offset: 4 }, { type: 'Str', lexeme: 'barrr', offset: 7 }, { type: 'EOF', offset: 14 }]));
		});

		test(`resource =~ //FileCabinet/(SuiteScripts|Templates/(E-mail%20Templates|Marketing%20Templates)|Web%20Site%20Hosting%20Files)(/.*)*$/`, () => {
			const input = `resource =~ //FileCabinet/(SuiteScripts|Templates/(E-mail%20Templates|Marketing%20Templates)|Web%20Site%20Hosting%20Files)(/.*)*$/`;
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', offset: 0, lexeme: 'resource' }, { type: '=~', offset: 9 }, { type: 'RegexStr', offset: 12, lexeme: '//' }, { type: 'Str', offset: 14, lexeme: 'FileCabinet/' }, { type: '(', offset: 26 }, { type: 'Str', offset: 27, lexeme: 'SuiteScripts' }, { type: 'ErrorToken', offset: 39, lexeme: '|' }, { type: 'Str', offset: 40, lexeme: 'Templates/' }, { type: '(', offset: 50 }, { type: 'Str', offset: 51, lexeme: 'E-mail%20Templates' }, { type: 'ErrorToken', offset: 69, lexeme: '|' }, { type: 'Str', offset: 70, lexeme: 'Marketing%20Templates' }, { type: ')', offset: 91 }, { type: 'ErrorToken', offset: 92, lexeme: '|' }, { type: 'Str', offset: 93, lexeme: 'Web%20Site%20Hosting%20Files' }, { type: ')', offset: 121 }, { type: '(', offset: 122 }, { type: 'RegexStr', offset: 123, lexeme: '/.*)*$/' }, { type: 'EOF', offset: 130 }]));
		});

		test('editorLangId in testely.supportedLangIds && resourceFilename =~ /^.+(.test.(\w+))$/gm', () => {
			const input = 'editorLangId in testely.supportedLangIds && resourceFilename =~ /^.+(.test.(\w+))$/gm';
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', lexeme: 'editorLangId', offset: 0 }, { type: 'in', offset: 13 }, { type: 'Str', lexeme: 'testely.supportedLangIds', offset: 16 }, { type: '&&', offset: 41 }, { type: 'Str', lexeme: 'resourceFilename', offset: 44 }, { type: '=~', offset: 61 }, { type: 'RegexStr', lexeme: '/^.+(.test.(w+))$/gm', offset: 64 }, { type: 'EOF', offset: 84 }]));
		});

		test('!(foo && bar) && baz', () => {
			const input = '!(foo && bar) && baz';
			assert.deepStrictEqual(scan(input), ([{ type: '!', offset: 0 }, { type: '(', offset: 1 }, { type: 'Str', lexeme: 'foo', offset: 2 }, { type: '&&', offset: 6 }, { type: 'Str', lexeme: 'bar', offset: 9 }, { type: ')', offset: 12 }, { type: '&&', offset: 14 }, { type: 'Str', lexeme: 'baz', offset: 17 }, { type: 'EOF', offset: 20 }]));
		});

		test('foo.bar:zed==completed - equality with no space', () => {
			const input = 'foo.bar:zed==completed';
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', lexeme: 'foo.bar:zed', offset: 0 }, { type: '==', offset: 11 }, { type: 'Str', lexeme: 'completed', offset: 13 }, { type: 'EOF', offset: 22 }]));
		});

		test('a && b || c', () => {
			const input = 'a && b || c';
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', lexeme: 'a', offset: 0 }, { type: '&&', offset: 2 }, { type: 'Str', lexeme: 'b', offset: 5 }, { type: '||', offset: 7 }, { type: 'Str', lexeme: 'c', offset: 10 }, { type: 'EOF', offset: 11 }]));
		});

		test('fooBar && baz.jar && fee.bee<K-loo+1>', () => {
			const input = 'fooBar && baz.jar && fee.bee<K-loo+1>';
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', lexeme: 'fooBar', offset: 0 }, { type: '&&', offset: 7 }, { type: 'Str', lexeme: 'baz.jar', offset: 10 }, { type: '&&', offset: 18 }, { type: 'Str', lexeme: 'fee.bee<K-loo+1>', offset: 21 }, { type: 'EOF', offset: 37 }]));
		});

		test('foo.barBaz<C-r> < 2', () => {
			const input = 'foo.barBaz<C-r> < 2';
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', lexeme: 'foo.barBaz<C-r>', offset: 0 }, { type: '<', offset: 16 }, { type: 'Str', lexeme: '2', offset: 18 }, { type: 'EOF', offset: 19 }]));
		});

		test('foo.bar >= -1', () => {
			const input = 'foo.bar >= -1';
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', lexeme: 'foo.bar', offset: 0 }, { type: '>=', offset: 8 }, { type: 'Str', lexeme: '-1', offset: 11 }, { type: 'EOF', offset: 13 }]));
		});

		test('foo.bar <= -1', () => {
			const input = 'foo.bar <= -1';
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', lexeme: 'foo.bar', offset: 0 }, { type: '<=', offset: 8 }, { type: 'Str', lexeme: '-1', offset: 11 }, { type: 'EOF', offset: 13 }]));
		});

		test(`resource =~ /\\/Objects\\/.+\\.xml$/`, () => {
			const input = `resource =~ /\\/Objects\\/.+\\.xml$/`;
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', lexeme: 'resource', offset: 0 }, { type: '=~', offset: 9 }, { type: 'RegexStr', lexeme: '/\\/Objects\\/.+\\.xml$/', offset: 12 }, { type: 'EOF', offset: 33 }]));
		});

		test('view == vsc-packages-activitybar-folders && vsc-packages-folders-loaded', () => {
			const input = `view == vsc-packages-activitybar-folders && vsc-packages-folders-loaded`;
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', lexeme: 'view', offset: 0 }, { type: '==', offset: 5 }, { type: 'Str', lexeme: 'vsc-packages-activitybar-folders', offset: 8 }, { type: '&&', offset: 41 }, { type: 'Str', lexeme: 'vsc-packages-folders-loaded', offset: 44 }, { type: 'EOF', offset: 71 }]));
		});

		test(`sfdx:project_opened && resource =~ /.*\\/functions\\/.*\\/[^\\/]+(\\/[^\\/]+\.(ts|js|java|json|toml))?$/ && resourceFilename != package.json && resourceFilename != package-lock.json && resourceFilename != tsconfig.json`, () => {
			const input = `sfdx:project_opened && resource =~ /.*\\/functions\\/.*\\/[^\\/]+(\\/[^\\/]+\.(ts|js|java|json|toml))?$/ && resourceFilename != package.json && resourceFilename != package-lock.json && resourceFilename != tsconfig.json`;
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', lexeme: 'sfdx:project_opened', offset: 0 }, { type: '&&', offset: 20 }, { type: 'Str', lexeme: 'resource', offset: 23 }, { type: '=~', offset: 32 }, { type: 'RegexStr', lexeme: '/.*\\/functions\\/.*\\/[^\\/]+(\\/[^\\/]+.(ts|js|java|json|toml))?$/', offset: 35 }, { type: '&&', offset: 98 }, { type: 'Str', lexeme: 'resourceFilename', offset: 101 }, { type: '!=', offset: 118 }, { type: 'Str', lexeme: 'package.json', offset: 121 }, { type: '&&', offset: 134 }, { type: 'Str', lexeme: 'resourceFilename', offset: 137 }, { type: '!=', offset: 154 }, { type: 'Str', lexeme: 'package-lock.json', offset: 157 }, { type: '&&', offset: 175 }, { type: 'Str', lexeme: 'resourceFilename', offset: 178 }, { type: '!=', offset: 195 }, { type: 'Str', lexeme: 'tsconfig.json', offset: 198 }, { type: 'EOF', offset: 211 }]));
		});

		test(`view =~ '/(servers)/' && viewItem =~ '/^(Starting|Started|Debugging|Stopping|Stopped)/'`, () => {
			const input = `view =~ '/(servers)/' && viewItem =~ '/^(Starting|Started|Debugging|Stopping|Stopped)/'`;
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', lexeme: 'view', offset: 0 }, { type: '=~', offset: 5 }, { type: 'QuotedStr', lexeme: '/(servers)/', offset: 9 }, { type: '&&', offset: 22 }, { type: 'Str', lexeme: 'viewItem', offset: 25 }, { type: '=~', offset: 34 }, { type: 'QuotedStr', lexeme: '/^(Starting|Started|Debugging|Stopping|Stopped)/', offset: 38 }, { type: 'EOF', offset: 87 }]));
		});

		test(`resourcePath =~ /\.md(\.yml|\.txt)*$/gim`, () => {
			const input = `resourcePath =~ /\.md(\.yml|\.txt)*$/gim`;
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', offset: 0, lexeme: 'resourcePath' }, { type: '=~', offset: 13 }, { type: 'RegexStr', offset: 16, lexeme: '/.md(.yml|.txt)*$/gim' }, { type: 'EOF', offset: 37 }]));
		});
	});

	test(`foo === bar'`, () => {
		const input = `foo === bar'`;
		assert.deepStrictEqual(scan(input), ([{ type: 'Str', offset: 0, lexeme: 'foo' }, { type: '===', offset: 4 }, { type: 'Str', offset: 8, lexeme: 'bar' }, { type: 'ErrorToken', offset: 11, lexeme: `'` }, { type: 'EOF', offset: 12 }]));
	});

	suite('handling lexical errors', () => {

		test(`foo === '`, () => {
			const input = `foo === '`;
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', offset: 0, lexeme: 'foo' }, { type: '===', offset: 4 }, { type: 'ErrorToken', offset: 8, lexeme: `'` }, { type: 'EOF', offset: 9 }]));
		});

		test(`foo && 'bar - unterminated single quote`, () => {
			const input = `foo && 'bar`;
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', lexeme: 'foo', offset: 0 }, { type: '&&', offset: 4 }, { type: 'ErrorToken', offset: 7, lexeme: `'bar` }, { type: 'EOF', offset: 11 }]));
		});

		test('vim<c-r> == 1 && vim<2 <= 3', () => {
			const input = 'vim<c-r> == 1 && vim<2 <= 3';
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', lexeme: 'vim<c-r>', offset: 0 }, { type: '==', offset: 9 }, { type: 'Str', lexeme: '1', offset: 12 }, { type: '&&', offset: 14 }, { type: 'Str', lexeme: 'vim<2', offset: 17 }, { type: '<=', offset: 23 }, { type: 'Str', lexeme: '3', offset: 26 }, { type: 'EOF', offset: 27 }]));
		});

		test('vim<c-r>==1 && vim<2<=3', () => {
			const input = 'vim<c-r>==1 && vim<2<=3';
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', offset: 0, lexeme: 'vim<c-r>' }, { type: '==', offset: 8 }, { type: 'Str', offset: 10, lexeme: '1' }, { type: '&&', offset: 12 }, { type: 'Str', offset: 15, lexeme: 'vim<2<' }, { type: 'ErrorToken', offset: 21, lexeme: '=' }, { type: 'Str', offset: 22, lexeme: '3' }, { type: 'EOF', offset: 23 }]));
		});

		test(`foo|bar`, () => {
			const input = `foo|bar`;
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', offset: 0, lexeme: 'foo' }, { type: 'ErrorToken', offset: 3, lexeme: '|' }, { type: 'Str', offset: 4, lexeme: 'bar' }, { type: 'EOF', offset: 7 }]));
		});

		test(`resource =~ //foo/(barr|door/(Foo-Bar%20Templates|Soo%20Looo)|Web%20Site%Jjj%20Llll)(/.*)*$/`, () => {
			const input = `resource =~ //foo/(barr|door/(Foo-Bar%20Templates|Soo%20Looo)|Web%20Site%Jjj%20Llll)(/.*)*$/`;
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', offset: 0, lexeme: 'resource' }, { type: '=~', offset: 9 }, { type: 'RegexStr', offset: 12, lexeme: '//' }, { type: 'Str', offset: 14, lexeme: 'foo/' }, { type: '(', offset: 18 }, { type: 'Str', offset: 19, lexeme: 'barr' }, { type: 'ErrorToken', offset: 23, lexeme: '|' }, { type: 'Str', offset: 24, lexeme: 'door/' }, { type: '(', offset: 29 }, { type: 'Str', offset: 30, lexeme: 'Foo-Bar%20Templates' }, { type: 'ErrorToken', offset: 49, lexeme: '|' }, { type: 'Str', offset: 50, lexeme: 'Soo%20Looo' }, { type: ')', offset: 60 }, { type: 'ErrorToken', offset: 61, lexeme: '|' }, { type: 'Str', offset: 62, lexeme: 'Web%20Site%Jjj%20Llll' }, { type: ')', offset: 83 }, { type: '(', offset: 84 }, { type: 'RegexStr', offset: 85, lexeme: '/.*)*$/' }, { type: 'EOF', offset: 92 }]));
		});

		test(`/((/foo/(?!bar)(.*)/)|((/src/).*/)).*$/`, () => {
			const input = `/((/foo/(?!bar)(.*)/)|((/src/).*/)).*$/`;
			assert.deepStrictEqual(scan(input), ([{ type: 'RegexStr', offset: 0, lexeme: '/((/' }, { type: 'Str', offset: 4, lexeme: 'foo/' }, { type: '(', offset: 8 }, { type: 'Str', offset: 9, lexeme: '?' }, { type: '!', offset: 10 }, { type: 'Str', offset: 11, lexeme: 'bar' }, { type: ')', offset: 14 }, { type: '(', offset: 15 }, { type: 'Str', offset: 16, lexeme: '.*' }, { type: ')', offset: 18 }, { type: 'RegexStr', offset: 19, lexeme: '/)|((/s' }, { type: 'Str', offset: 26, lexeme: 'rc/' }, { type: ')', offset: 29 }, { type: 'Str', offset: 30, lexeme: '.*/' }, { type: ')', offset: 33 }, { type: ')', offset: 34 }, { type: 'Str', offset: 35, lexeme: '.*$/' }, { type: 'EOF', offset: 39 }]));
		});

		test(`resourcePath =~ //foo/barr// || resourcePath =~ //view/(jarrr|doooor|bees)/(web|templates)// && resourceExtname in foo.Bar`, () => {
			const input = `resourcePath =~ //foo/barr// || resourcePath =~ //view/(jarrr|doooor|bees)/(web|templates)// && resourceExtname in foo.Bar`;
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', offset: 0, lexeme: 'resourcePath' }, { type: '=~', offset: 13 }, { type: 'RegexStr', offset: 16, lexeme: '//' }, { type: 'Str', offset: 18, lexeme: 'foo/barr//' }, { type: '||', offset: 29 }, { type: 'Str', offset: 32, lexeme: 'resourcePath' }, { type: '=~', offset: 45 }, { type: 'RegexStr', offset: 48, lexeme: '//' }, { type: 'Str', offset: 50, lexeme: 'view/' }, { type: '(', offset: 55 }, { type: 'Str', offset: 56, lexeme: 'jarrr' }, { type: 'ErrorToken', offset: 61, lexeme: '|' }, { type: 'Str', offset: 62, lexeme: 'doooor' }, { type: 'ErrorToken', offset: 68, lexeme: '|' }, { type: 'Str', offset: 69, lexeme: 'bees' }, { type: ')', offset: 73 }, { type: 'RegexStr', offset: 74, lexeme: '/(web|templates)/' }, { type: 'ErrorToken', offset: 91, lexeme: '/ && resourceExtname in foo.Bar' }, { type: 'EOF', offset: 122 }]));
		});

		test(`foo =~ /file:\// || bar`, () => {
			const input = JSON.parse('"foo =~ /file:\// || bar"');
			assert.deepStrictEqual(scan(input), ([{ type: 'Str', offset: 0, lexeme: 'foo' }, { type: '=~', offset: 4 }, { type: 'RegexStr', offset: 7, lexeme: '/file:/' }, { type: 'ErrorToken', offset: 14, lexeme: '/ || bar' }, { type: 'EOF', offset: 22 }]));
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/contextview/browser/contextMenuHandler.ts]---
Location: vscode-main/src/vs/platform/contextview/browser/contextMenuHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IContextMenuDelegate } from '../../../base/browser/contextmenu.js';
import { $, addDisposableListener, EventType, getActiveElement, getWindow, isAncestor, isHTMLElement } from '../../../base/browser/dom.js';
import { StandardMouseEvent } from '../../../base/browser/mouseEvent.js';
import { Menu } from '../../../base/browser/ui/menu/menu.js';
import { ActionRunner, IRunEvent, WorkbenchActionExecutedClassification, WorkbenchActionExecutedEvent } from '../../../base/common/actions.js';
import { isCancellationError } from '../../../base/common/errors.js';
import { combinedDisposable, DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { IContextViewService } from './contextView.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';
import { INotificationService } from '../../notification/common/notification.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { defaultMenuStyles } from '../../theme/browser/defaultStyles.js';


export interface IContextMenuHandlerOptions {
	blockMouse: boolean;
}

export class ContextMenuHandler {
	private focusToReturn: HTMLElement | null = null;
	private lastContainer: HTMLElement | null = null;
	private block: HTMLElement | null = null;
	private blockDisposable: IDisposable | null = null;
	private options: IContextMenuHandlerOptions = { blockMouse: true };

	constructor(
		private contextViewService: IContextViewService,
		private telemetryService: ITelemetryService,
		private notificationService: INotificationService,
		private keybindingService: IKeybindingService,
	) { }

	configure(options: IContextMenuHandlerOptions): void {
		this.options = options;
	}

	showContextMenu(delegate: IContextMenuDelegate): void {
		const actions = delegate.getActions();
		if (!actions.length) {
			return; // Don't render an empty context menu
		}

		this.focusToReturn = getActiveElement() as HTMLElement;

		let menu: Menu | undefined;

		const shadowRootElement = isHTMLElement(delegate.domForShadowRoot) ? delegate.domForShadowRoot : undefined;
		this.contextViewService.showContextView({
			getAnchor: () => delegate.getAnchor(),
			canRelayout: false,
			anchorAlignment: delegate.anchorAlignment,
			anchorAxisAlignment: delegate.anchorAxisAlignment,
			layer: delegate.layer,
			render: (container) => {
				this.lastContainer = container;
				const className = delegate.getMenuClassName ? delegate.getMenuClassName() : '';

				if (className) {
					container.className += ' ' + className;
				}

				// Render invisible div to block mouse interaction in the rest of the UI
				if (this.options.blockMouse) {
					this.block = container.appendChild($('.context-view-block'));
					this.block.style.position = 'fixed';
					this.block.style.cursor = 'initial';
					this.block.style.left = '0';
					this.block.style.top = '0';
					this.block.style.width = '100%';
					this.block.style.height = '100%';
					this.block.style.zIndex = '-1';

					this.blockDisposable?.dispose();
					this.blockDisposable = addDisposableListener(this.block, EventType.MOUSE_DOWN, e => e.stopPropagation());
				}

				const menuDisposables = new DisposableStore();

				const actionRunner = delegate.actionRunner || menuDisposables.add(new ActionRunner());
				actionRunner.onWillRun(evt => this.onActionRun(evt, !delegate.skipTelemetry), this, menuDisposables);
				actionRunner.onDidRun(this.onDidActionRun, this, menuDisposables);
				menu = new Menu(container, actions, {
					actionViewItemProvider: delegate.getActionViewItem,
					context: delegate.getActionsContext ? delegate.getActionsContext() : null,
					actionRunner,
					getKeyBinding: delegate.getKeyBinding ? delegate.getKeyBinding : action => this.keybindingService.lookupKeybinding(action.id)
				},
					defaultMenuStyles
				);

				menu.onDidCancel(() => this.contextViewService.hideContextView(true), null, menuDisposables);
				menu.onDidBlur(() => this.contextViewService.hideContextView(true), null, menuDisposables);
				const targetWindow = getWindow(container);
				menuDisposables.add(addDisposableListener(targetWindow, EventType.BLUR, () => this.contextViewService.hideContextView(true)));
				menuDisposables.add(addDisposableListener(targetWindow, EventType.MOUSE_DOWN, (e: MouseEvent) => {
					if (e.defaultPrevented) {
						return;
					}

					const event = new StandardMouseEvent(targetWindow, e);
					let element: HTMLElement | null = event.target;

					// Don't do anything as we are likely creating a context menu
					if (event.rightButton) {
						return;
					}

					while (element) {
						if (element === container) {
							return;
						}

						element = element.parentElement;
					}

					this.contextViewService.hideContextView(true);
				}));

				return combinedDisposable(menuDisposables, menu);
			},

			focus: () => {
				menu?.focus(!!delegate.autoSelectFirstItem);
			},

			onHide: (didCancel?: boolean) => {
				delegate.onHide?.(!!didCancel);

				if (this.block) {
					this.block.remove();
					this.block = null;
				}

				this.blockDisposable?.dispose();
				this.blockDisposable = null;

				if (!!this.lastContainer && (getActiveElement() === this.lastContainer || isAncestor(getActiveElement(), this.lastContainer))) {
					this.focusToReturn?.focus();
				}

				this.lastContainer = null;
			}
		}, shadowRootElement, !!shadowRootElement);
	}

	private onActionRun(e: IRunEvent, logTelemetry: boolean): void {
		if (logTelemetry) {
			this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: e.action.id, from: 'contextMenu' });
		}

		this.contextViewService.hideContextView(false);
	}

	private onDidActionRun(e: IRunEvent): void {
		if (e.error && !isCancellationError(e.error)) {
			this.notificationService.error(e.error);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/contextview/browser/contextMenuService.ts]---
Location: vscode-main/src/vs/platform/contextview/browser/contextMenuService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IContextMenuDelegate } from '../../../base/browser/contextmenu.js';
import { ModifierKeyEmitter } from '../../../base/browser/dom.js';
import { IAction, Separator } from '../../../base/common/actions.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { getFlatContextMenuActions } from '../../actions/browser/menuEntryActionViewItem.js';
import { IMenuService, MenuId } from '../../actions/common/actions.js';
import { IContextKeyService } from '../../contextkey/common/contextkey.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';
import { INotificationService } from '../../notification/common/notification.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { ContextMenuHandler, IContextMenuHandlerOptions } from './contextMenuHandler.js';
import { IContextMenuMenuDelegate, IContextMenuService, IContextViewService } from './contextView.js';

export class ContextMenuService extends Disposable implements IContextMenuService {

	declare readonly _serviceBrand: undefined;

	private _contextMenuHandler: ContextMenuHandler | undefined = undefined;
	private get contextMenuHandler(): ContextMenuHandler {
		if (!this._contextMenuHandler) {
			this._contextMenuHandler = new ContextMenuHandler(this.contextViewService, this.telemetryService, this.notificationService, this.keybindingService);
		}

		return this._contextMenuHandler;
	}

	private readonly _onDidShowContextMenu = this._store.add(new Emitter<void>());
	readonly onDidShowContextMenu = this._onDidShowContextMenu.event;

	private readonly _onDidHideContextMenu = this._store.add(new Emitter<void>());
	readonly onDidHideContextMenu = this._onDidHideContextMenu.event;

	constructor(
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@INotificationService private readonly notificationService: INotificationService,
		@IContextViewService private readonly contextViewService: IContextViewService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IMenuService private readonly menuService: IMenuService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
	) {
		super();
	}

	configure(options: IContextMenuHandlerOptions): void {
		this.contextMenuHandler.configure(options);
	}

	// ContextMenu

	showContextMenu(delegate: IContextMenuDelegate | IContextMenuMenuDelegate): void {

		delegate = ContextMenuMenuDelegate.transform(delegate, this.menuService, this.contextKeyService);

		this.contextMenuHandler.showContextMenu({
			...delegate,
			onHide: (didCancel) => {
				delegate.onHide?.(didCancel);

				this._onDidHideContextMenu.fire();
			}
		});
		ModifierKeyEmitter.getInstance().resetKeyStatus();
		this._onDidShowContextMenu.fire();
	}
}

export namespace ContextMenuMenuDelegate {

	function is(thing: IContextMenuDelegate | IContextMenuMenuDelegate): thing is IContextMenuMenuDelegate {
		return thing && (<IContextMenuMenuDelegate>thing).menuId instanceof MenuId;
	}

	export function transform(delegate: IContextMenuDelegate | IContextMenuMenuDelegate, menuService: IMenuService, globalContextKeyService: IContextKeyService): IContextMenuDelegate {
		if (!is(delegate)) {
			return delegate;
		}
		const { menuId, menuActionOptions, contextKeyService } = delegate;
		return {
			...delegate,
			getActions: () => {
				let target: IAction[] = [];
				if (menuId) {
					const menu = menuService.getMenuActions(menuId, contextKeyService ?? globalContextKeyService, menuActionOptions);
					target = getFlatContextMenuActions(menu);
				}
				if (!delegate.getActions) {
					return target;
				} else {
					return Separator.join(delegate.getActions(), target);
				}
			}
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/contextview/browser/contextView.ts]---
Location: vscode-main/src/vs/platform/contextview/browser/contextView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IContextMenuDelegate } from '../../../base/browser/contextmenu.js';
import { StandardMouseEvent } from '../../../base/browser/mouseEvent.js';
import { AnchorAlignment, AnchorAxisAlignment, IAnchor, IContextViewProvider } from '../../../base/browser/ui/contextview/contextview.js';
import { IAction } from '../../../base/common/actions.js';
import { Event } from '../../../base/common/event.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { IMenuActionOptions, MenuId } from '../../actions/common/actions.js';
import { IContextKeyService } from '../../contextkey/common/contextkey.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IContextViewService = createDecorator<IContextViewService>('contextViewService');

export interface IContextViewService extends IContextViewProvider {

	readonly _serviceBrand: undefined;

	showContextView(delegate: IContextViewDelegate, container?: HTMLElement, shadowRoot?: boolean): IOpenContextView;
	hideContextView(data?: any): void;
	getContextViewElement(): HTMLElement;
	layout(): void;
	anchorAlignment?: AnchorAlignment;
}

export interface IContextViewDelegate {

	canRelayout?: boolean; // Default: true

	/**
	 * The anchor where to position the context view.
	 * Use a `HTMLElement` to position the view at the element,
	 * a `StandardMouseEvent` to position it at the mouse position
	 * or an `IAnchor` to position it at a specific location.
	 */
	getAnchor(): HTMLElement | StandardMouseEvent | IAnchor;
	render(container: HTMLElement): IDisposable;
	onDOMEvent?(e: any, activeElement: HTMLElement): void;
	onHide?(data?: any): void;
	focus?(): void;
	anchorAlignment?: AnchorAlignment;
	anchorAxisAlignment?: AnchorAxisAlignment;

	// context views with higher layers are rendered over contet views with lower layers
	layer?: number; // Default: 0
}

export interface IOpenContextView {
	close: () => void;
}

export const IContextMenuService = createDecorator<IContextMenuService>('contextMenuService');

export interface IContextMenuService {

	readonly _serviceBrand: undefined;

	readonly onDidShowContextMenu: Event<void>;
	readonly onDidHideContextMenu: Event<void>;

	showContextMenu(delegate: IContextMenuDelegate | IContextMenuMenuDelegate): void;
}

export type IContextMenuMenuDelegate = {
	/**
	 * The MenuId that should be used to populate the context menu.
	 */
	menuId?: MenuId;
	/**
	 * Optional options how menu actions are invoked
	 */
	menuActionOptions?: IMenuActionOptions;
	/**
	 * Optional context key service which drives the given menu
	 */
	contextKeyService?: IContextKeyService;

	/**
	 * Optional getter for extra actions. They will be prepended to the menu actions.
	 */
	getActions?(): IAction[];
} & Omit<IContextMenuDelegate, 'getActions'>;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/contextview/browser/contextViewService.ts]---
Location: vscode-main/src/vs/platform/contextview/browser/contextViewService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ContextView, ContextViewDOMPosition, IContextViewProvider } from '../../../base/browser/ui/contextview/contextview.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { ILayoutService } from '../../layout/browser/layoutService.js';
import { IContextViewDelegate, IContextViewService, IOpenContextView } from './contextView.js';
import { getWindow } from '../../../base/browser/dom.js';

export class ContextViewHandler extends Disposable implements IContextViewProvider {

	private openContextView: IOpenContextView | undefined;
	protected readonly contextView: ContextView;

	constructor(
		@ILayoutService private readonly layoutService: ILayoutService
	) {
		super();

		this.contextView = this._register(new ContextView(this.layoutService.mainContainer, ContextViewDOMPosition.ABSOLUTE));

		this.layout();
		this._register(layoutService.onDidLayoutContainer(() => this.layout()));
	}

	// ContextView

	showContextView(delegate: IContextViewDelegate, container?: HTMLElement, shadowRoot?: boolean): IOpenContextView {
		let domPosition: ContextViewDOMPosition;
		if (container) {
			if (container === this.layoutService.getContainer(getWindow(container))) {
				domPosition = ContextViewDOMPosition.ABSOLUTE;
			} else if (shadowRoot) {
				domPosition = ContextViewDOMPosition.FIXED_SHADOW;
			} else {
				domPosition = ContextViewDOMPosition.FIXED;
			}
		} else {
			domPosition = ContextViewDOMPosition.ABSOLUTE;
		}

		this.contextView.setContainer(container ?? this.layoutService.activeContainer, domPosition);

		this.contextView.show(delegate);

		const openContextView: IOpenContextView = {
			close: () => {
				if (this.openContextView === openContextView) {
					this.hideContextView();
				}
			}
		};

		this.openContextView = openContextView;
		return openContextView;
	}

	layout(): void {
		this.contextView.layout();
	}

	hideContextView(data?: unknown): void {
		this.contextView.hide(data);
		this.openContextView = undefined;
	}
}

export class ContextViewService extends ContextViewHandler implements IContextViewService {

	declare readonly _serviceBrand: undefined;

	getContextViewElement(): HTMLElement {
		return this.contextView.getViewElement();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/cssDev/node/cssDevService.ts]---
Location: vscode-main/src/vs/platform/cssDev/node/cssDevService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { spawn } from 'child_process';
import { relative } from '../../../base/common/path.js';
import { FileAccess } from '../../../base/common/network.js';
import { StopWatch } from '../../../base/common/stopwatch.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';

export const ICSSDevelopmentService = createDecorator<ICSSDevelopmentService>('ICSSDevelopmentService');

export interface ICSSDevelopmentService {
	_serviceBrand: undefined;
	isEnabled: boolean;
	getCssModules(): Promise<string[]>;
}

export class CSSDevelopmentService implements ICSSDevelopmentService {

	declare _serviceBrand: undefined;

	private _cssModules?: Promise<string[]>;

	constructor(
		@IEnvironmentService private readonly envService: IEnvironmentService,
		@ILogService private readonly logService: ILogService
	) { }

	get isEnabled(): boolean {
		return !this.envService.isBuilt;
	}

	getCssModules(): Promise<string[]> {
		this._cssModules ??= this.computeCssModules();
		return this._cssModules;
	}

	private async computeCssModules(): Promise<string[]> {
		if (!this.isEnabled) {
			return [];
		}

		const rg = await import('@vscode/ripgrep');
		return await new Promise<string[]>((resolve) => {

			const sw = StopWatch.create();

			const chunks: Buffer[] = [];
			const basePath = FileAccess.asFileUri('').fsPath;
			const process = spawn(rg.rgPath, ['-g', '**/*.css', '--files', '--no-ignore', basePath], {});

			process.stdout.on('data', data => {
				chunks.push(data);
			});
			process.on('error', err => {
				this.logService.error('[CSS_DEV] FAILED to compute CSS data', err);
				resolve([]);
			});
			process.on('close', () => {
				const data = Buffer.concat(chunks).toString('utf8');
				const result = data.split('\n').filter(Boolean).map(path => relative(basePath, path).replace(/\\/g, '/')).filter(Boolean).sort();
				if (result.some(path => path.indexOf('vs/') !== 0)) {
					this.logService.error(`[CSS_DEV] Detected invalid paths in css modules, raw output: ${data}`);
				}
				resolve(result);
				this.logService.info(`[CSS_DEV] DONE, ${result.length} css modules (${Math.round(sw.elapsed())}ms)`);
			});
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/dataChannel/browser/forwardingTelemetryService.ts]---
Location: vscode-main/src/vs/platform/dataChannel/browser/forwardingTelemetryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ClassifiedEvent, OmitMetadata, IGDPRProperty, StrictPropertyCheck } from '../../telemetry/common/gdprTypings.js';
import { ITelemetryData, ITelemetryService, TelemetryLevel } from '../../telemetry/common/telemetry.js';
import { IDataChannelService } from '../common/dataChannel.js';

export class InterceptingTelemetryService implements ITelemetryService {
	_serviceBrand: undefined;

	constructor(
		private readonly _baseService: ITelemetryService,
		private readonly _intercept: (eventName: string, data?: ITelemetryData) => void,
	) { }

	get telemetryLevel(): TelemetryLevel {
		return this._baseService.telemetryLevel;
	}

	get sessionId(): string {
		return this._baseService.sessionId;
	}

	get machineId(): string {
		return this._baseService.machineId;
	}

	get sqmId(): string {
		return this._baseService.sqmId;
	}

	get devDeviceId(): string {
		return this._baseService.devDeviceId;
	}

	get firstSessionDate(): string {
		return this._baseService.firstSessionDate;
	}

	get msftInternal(): boolean | undefined {
		return this._baseService.msftInternal;
	}

	get sendErrorTelemetry(): boolean {
		return this._baseService.sendErrorTelemetry;
	}

	publicLog(eventName: string, data?: ITelemetryData): void {
		this._intercept(eventName, data);
		this._baseService.publicLog(eventName, data);
	}

	publicLog2<E extends ClassifiedEvent<OmitMetadata<T>> = never, T extends IGDPRProperty = never>(eventName: string, data?: StrictPropertyCheck<T, E>): void {
		this._intercept(eventName, data);
		this._baseService.publicLog2(eventName, data);
	}

	publicLogError(errorEventName: string, data?: ITelemetryData): void {
		this._intercept(errorEventName, data);
		this._baseService.publicLogError(errorEventName, data);
	}

	publicLogError2<E extends ClassifiedEvent<OmitMetadata<T>> = never, T extends IGDPRProperty = never>(eventName: string, data?: StrictPropertyCheck<T, E>): void {
		this._intercept(eventName, data);
		this._baseService.publicLogError2(eventName, data);
	}

	setExperimentProperty(name: string, value: string): void {
		this._baseService.setExperimentProperty(name, value);
	}
}

export interface IEditTelemetryData {
	eventName: string;
	data: Record<string, unknown>;
}

export class DataChannelForwardingTelemetryService extends InterceptingTelemetryService {
	constructor(
		@ITelemetryService telemetryService: ITelemetryService,
		@IDataChannelService dataChannelService: IDataChannelService,
	) {
		super(telemetryService, (eventName, data) => {
			// filter for extension
			let forward = true;
			if (data && shouldForwardToChannel in data) {
				forward = Boolean(data[shouldForwardToChannel]);
			}

			if (forward) {
				dataChannelService.getDataChannel<IEditTelemetryData>('editTelemetry').sendData({ eventName, data: data ?? {} });
			}
		});
	}
}

const shouldForwardToChannel = Symbol('shouldForwardToChannel');
export function forwardToChannelIf(value: boolean): Record<string, unknown> {
	return {
		// This will not be sent via telemetry, it is just a marker
		[shouldForwardToChannel]: value
	};
}

export function isCopilotLikeExtension(extensionId: string | undefined): boolean {
	if (!extensionId) {
		return false;
	}
	const extIdLowerCase = extensionId.toLowerCase();
	return extIdLowerCase === 'github.copilot' || extIdLowerCase === 'github.copilot-chat';
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/dataChannel/common/dataChannel.ts]---
Location: vscode-main/src/vs/platform/dataChannel/common/dataChannel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IDataChannelService = createDecorator<IDataChannelService>('dataChannelService');

export interface IDataChannelService {
	readonly _serviceBrand: undefined;

	readonly onDidSendData: Event<IDataChannelEvent>;

	getDataChannel<T>(channelId: string): CoreDataChannel<T>;
}

export interface CoreDataChannel<T = unknown> {
	sendData(data: T): void;
}

export interface IDataChannelEvent<T = unknown> {
	channelId: string;
	data: T;
}

export class NullDataChannelService implements IDataChannelService {
	_serviceBrand: undefined;
	get onDidSendData(): Event<IDataChannelEvent<unknown>> {
		return Event.None;
	}
	getDataChannel<T>(_channelId: string): CoreDataChannel<T> {
		return {
			sendData: () => { },
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/debug/common/extensionHostDebug.ts]---
Location: vscode-main/src/vs/platform/debug/common/extensionHostDebug.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IExtensionHostDebugService = createDecorator<IExtensionHostDebugService>('extensionHostDebugService');

export interface IAttachSessionEvent {
	sessionId: string;
	subId?: string;
	port: number;
}

export interface ITerminateSessionEvent {
	sessionId: string;
	subId?: string;
}

export interface IReloadSessionEvent {
	sessionId: string;
}

export interface ICloseSessionEvent {
	sessionId: string;
}

export interface IOpenExtensionWindowResult {
	rendererDebugAddr?: string;
	success: boolean;
}

export interface IExtensionHostDebugService {
	readonly _serviceBrand: undefined;

	reload(sessionId: string): void;
	readonly onReload: Event<IReloadSessionEvent>;

	close(sessionId: string): void;
	readonly onClose: Event<ICloseSessionEvent>;

	attachSession(sessionId: string, port: number, subId?: string): void;
	readonly onAttachSession: Event<IAttachSessionEvent>;

	terminateSession(sessionId: string, subId?: string): void;
	readonly onTerminateSession: Event<ITerminateSessionEvent>;

	openExtensionDevelopmentHostWindow(args: string[], debugRenderer: boolean): Promise<IOpenExtensionWindowResult>;

	attachToCurrentWindowRenderer(windowId: number): Promise<IOpenExtensionWindowResult>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/debug/common/extensionHostDebugIpc.ts]---
Location: vscode-main/src/vs/platform/debug/common/extensionHostDebugIpc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { IChannel, IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { IAttachSessionEvent, ICloseSessionEvent, IExtensionHostDebugService, IOpenExtensionWindowResult, IReloadSessionEvent, ITerminateSessionEvent } from './extensionHostDebug.js';

export class ExtensionHostDebugBroadcastChannel<TContext> implements IServerChannel<TContext> {

	static readonly ChannelName = 'extensionhostdebugservice';

	private readonly _onCloseEmitter = new Emitter<ICloseSessionEvent>();
	private readonly _onReloadEmitter = new Emitter<IReloadSessionEvent>();
	private readonly _onTerminateEmitter = new Emitter<ITerminateSessionEvent>();
	private readonly _onAttachEmitter = new Emitter<IAttachSessionEvent>();

	call(ctx: TContext, command: string, arg?: any): Promise<any> {
		switch (command) {
			case 'close':
				return Promise.resolve(this._onCloseEmitter.fire({ sessionId: arg[0] }));
			case 'reload':
				return Promise.resolve(this._onReloadEmitter.fire({ sessionId: arg[0] }));
			case 'terminate':
				return Promise.resolve(this._onTerminateEmitter.fire({ sessionId: arg[0] }));
			case 'attach':
				return Promise.resolve(this._onAttachEmitter.fire({ sessionId: arg[0], port: arg[1], subId: arg[2] }));
		}
		throw new Error('Method not implemented.');
	}

	listen(ctx: TContext, event: string, arg?: any): Event<any> {
		switch (event) {
			case 'close':
				return this._onCloseEmitter.event;
			case 'reload':
				return this._onReloadEmitter.event;
			case 'terminate':
				return this._onTerminateEmitter.event;
			case 'attach':
				return this._onAttachEmitter.event;
		}
		throw new Error('Method not implemented.');
	}
}

export class ExtensionHostDebugChannelClient extends Disposable implements IExtensionHostDebugService {

	declare readonly _serviceBrand: undefined;

	constructor(private channel: IChannel) {
		super();
	}

	reload(sessionId: string): void {
		this.channel.call('reload', [sessionId]);
	}

	get onReload(): Event<IReloadSessionEvent> {
		return this.channel.listen('reload');
	}

	close(sessionId: string): void {
		this.channel.call('close', [sessionId]);
	}

	get onClose(): Event<ICloseSessionEvent> {
		return this.channel.listen('close');
	}

	attachSession(sessionId: string, port: number, subId?: string): void {
		this.channel.call('attach', [sessionId, port, subId]);
	}

	get onAttachSession(): Event<IAttachSessionEvent> {
		return this.channel.listen('attach');
	}

	terminateSession(sessionId: string, subId?: string): void {
		this.channel.call('terminate', [sessionId, subId]);
	}

	get onTerminateSession(): Event<ITerminateSessionEvent> {
		return this.channel.listen('terminate');
	}

	openExtensionDevelopmentHostWindow(args: string[], debugRenderer: boolean): Promise<IOpenExtensionWindowResult> {
		return this.channel.call('openExtensionDevelopmentHostWindow', [args, debugRenderer]);
	}

	attachToCurrentWindowRenderer(windowId: number): Promise<IOpenExtensionWindowResult> {
		return this.channel.call('attachToCurrentWindowRenderer', [windowId]);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/debug/electron-main/extensionHostDebugIpc.ts]---
Location: vscode-main/src/vs/platform/debug/electron-main/extensionHostDebugIpc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrowserWindow } from 'electron';
import { Socket } from 'net';
import { VSBuffer } from '../../../base/common/buffer.js';
import { DisposableStore, toDisposable } from '../../../base/common/lifecycle.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { ISocket } from '../../../base/parts/ipc/common/ipc.net.js';
import { upgradeToISocket } from '../../../base/parts/ipc/node/ipc.net.js';
import { OPTIONS, parseArgs } from '../../environment/node/argv.js';
import { IWindowsMainService, OpenContext } from '../../windows/electron-main/windows.js';
import { IOpenExtensionWindowResult } from '../common/extensionHostDebug.js';
import { ExtensionHostDebugBroadcastChannel } from '../common/extensionHostDebugIpc.js';

export class ElectronExtensionHostDebugBroadcastChannel<TContext> extends ExtensionHostDebugBroadcastChannel<TContext> {

	constructor(
		private windowsMainService: IWindowsMainService
	) {
		super();
	}

	override call(ctx: TContext, command: string, arg?: any): Promise<any> {
		if (command === 'openExtensionDevelopmentHostWindow') {
			return this.openExtensionDevelopmentHostWindow(arg[0], arg[1]);
		} else if (command === 'attachToCurrentWindowRenderer') {
			return this.attachToCurrentWindowRenderer(arg[0]);
		} else {
			return super.call(ctx, command, arg);
		}
	}

	private async attachToCurrentWindowRenderer(windowId: number): Promise<IOpenExtensionWindowResult> {
		const codeWindow = this.windowsMainService.getWindowById(windowId);
		if (!codeWindow?.win) {
			return { success: false };
		}

		return this.openCdp(codeWindow.win);
	}

	private async openExtensionDevelopmentHostWindow(args: string[], debugRenderer: boolean): Promise<IOpenExtensionWindowResult> {
		const pargs = parseArgs(args, OPTIONS);
		pargs.debugRenderer = debugRenderer;

		const extDevPaths = pargs.extensionDevelopmentPath;
		if (!extDevPaths) {
			return { success: false };
		}

		const [codeWindow] = await this.windowsMainService.openExtensionDevelopmentHostWindow(extDevPaths, {
			context: OpenContext.API,
			cli: pargs,
			forceProfile: pargs.profile,
			forceTempProfile: pargs['profile-temp']
		});

		if (!debugRenderer) {
			return { success: true };
		}

		const win = codeWindow.win;
		if (!win) {
			return { success: true };
		}

		return this.openCdp(win);
	}

	private async openCdpServer(ident: string, onSocket: (socket: ISocket) => void) {
		const { createServer } = await import('http'); // Lazy due to https://github.com/nodejs/node/issues/59686
		const server = createServer((req, res) => {
			res.statusCode = 404;
			res.end();
		});

		server.on('upgrade', (req, socket) => {
			if (!req.url?.includes(ident)) {
				socket.end();
				return;
			}
			const upgraded = upgradeToISocket(req, socket as Socket, {
				debugLabel: 'extension-host-cdp-' + generateUuid(),
				enableMessageSplitting: false,
			});

			if (upgraded) {
				onSocket(upgraded);
			}
		});

		return server;
	}

	private async openCdp(win: BrowserWindow): Promise<IOpenExtensionWindowResult> {
		const debug = win.webContents.debugger;

		let listeners = debug.isAttached() ? Infinity : 0;
		const ident = generateUuid();
		const server = await this.openCdpServer(ident, listener => {
			if (listeners++ === 0) {
				debug.attach();
			}

			const store = new DisposableStore();
			store.add(listener);

			const writeMessage = (message: object) => {
				if (!store.isDisposed) { // in case sendCommand promises settle after closed
					listener.write(VSBuffer.fromString(JSON.stringify(message))); // null-delimited, CDP-compatible
				}
			};

			const onMessage = (_event: Electron.Event, method: string, params: unknown, sessionId?: string) =>
				writeMessage({ method, params, sessionId });

			const onWindowClose = () => {
				listener.end();
				store.dispose();
			};

			win.addListener('close', onWindowClose);
			store.add(toDisposable(() => win.removeListener('close', onWindowClose)));

			debug.addListener('message', onMessage);
			store.add(toDisposable(() => debug.removeListener('message', onMessage)));

			store.add(listener.onData(rawData => {
				let data: { id: number; sessionId: string; method: string; params: {} };
				try {
					data = JSON.parse(rawData.toString());
				} catch (e) {
					console.error('error reading cdp line', e);
					return;
				}

				debug.sendCommand(data.method, data.params, data.sessionId)
					.then((result: object) => writeMessage({ id: data.id, sessionId: data.sessionId, result }))
					.catch((error: Error) => writeMessage({ id: data.id, sessionId: data.sessionId, error: { code: 0, message: error.message } }));
			}));

			store.add(listener.onClose(() => {
				if (--listeners === 0) {
					debug.detach();
				}
			}));
		});

		await new Promise<void>(r => server.listen(0, '127.0.0.1', r));
		win.on('close', () => server.close());

		const serverAddr = server.address();
		const serverAddrBase = typeof serverAddr === 'string' ? serverAddr : `ws://127.0.0.1:${serverAddr?.port}`;
		return { rendererDebugAddr: `${serverAddrBase}/${ident}`, success: true };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/defaultAccount/common/defaultAccount.ts]---
Location: vscode-main/src/vs/platform/defaultAccount/common/defaultAccount.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../instantiation/common/instantiation.js';
import { Event } from '../../../base/common/event.js';
import { IDefaultAccount } from '../../../base/common/defaultAccount.js';

export const IDefaultAccountService = createDecorator<IDefaultAccountService>('defaultAccountService');

export interface IDefaultAccountService {

	readonly _serviceBrand: undefined;

	readonly onDidChangeDefaultAccount: Event<IDefaultAccount | null>;

	getDefaultAccount(): Promise<IDefaultAccount | null>;
	setDefaultAccount(account: IDefaultAccount | null): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/diagnostics/common/diagnostics.ts]---
Location: vscode-main/src/vs/platform/diagnostics/common/diagnostics.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary } from '../../../base/common/collections.js';
import { ProcessItem } from '../../../base/common/processes.js';
import { UriComponents } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IWorkspace } from '../../workspace/common/workspace.js';

export const ID = 'diagnosticsService';
export const IDiagnosticsService = createDecorator<IDiagnosticsService>(ID);

export interface IDiagnosticsService {
	readonly _serviceBrand: undefined;

	getPerformanceInfo(mainProcessInfo: IMainProcessDiagnostics, remoteInfo: (IRemoteDiagnosticInfo | IRemoteDiagnosticError)[]): Promise<PerformanceInfo>;
	getSystemInfo(mainProcessInfo: IMainProcessDiagnostics, remoteInfo: (IRemoteDiagnosticInfo | IRemoteDiagnosticError)[]): Promise<SystemInfo>;
	getDiagnostics(mainProcessInfo: IMainProcessDiagnostics, remoteInfo: (IRemoteDiagnosticInfo | IRemoteDiagnosticError)[]): Promise<string>;
	getWorkspaceFileExtensions(workspace: IWorkspace): Promise<{ extensions: string[] }>;
	reportWorkspaceStats(workspace: IWorkspaceInformation): Promise<void>;
}

export interface IMachineInfo {
	os: string;
	cpus?: string;
	memory: string;
	vmHint: string;
	linuxEnv?: ILinuxEnv;
}

export interface ILinuxEnv {
	desktopSession?: string;
	xdgSessionDesktop?: string;
	xdgCurrentDesktop?: string;
	xdgSessionType?: string;
}

export interface IDiagnosticInfo {
	machineInfo: IMachineInfo;
	workspaceMetadata?: IStringDictionary<WorkspaceStats>;
	processes?: ProcessItem;
}
export interface SystemInfo extends IMachineInfo {
	processArgs: string;
	gpuStatus: any;
	screenReader: string;
	remoteData: (IRemoteDiagnosticInfo | IRemoteDiagnosticError)[];
	load?: string;
}

export interface IRemoteDiagnosticInfo extends IDiagnosticInfo {
	hostName: string;
	latency?: {
		current: number;
		average: number;
	};
}

export interface IRemoteDiagnosticError {
	hostName: string;
	errorMessage: string;
}

export interface IDiagnosticInfoOptions {
	includeProcesses?: boolean;
	folders?: UriComponents[];
}

export interface WorkspaceStatItem {
	name: string;
	count: number;
}

export interface WorkspaceStats {
	fileTypes: WorkspaceStatItem[];
	configFiles: WorkspaceStatItem[];
	fileCount: number;
	maxFilesReached: boolean;
	launchConfigFiles: WorkspaceStatItem[];
	totalScanTime: number;
	totalReaddirCount: number;
}

export interface PerformanceInfo {
	processInfo?: string;
	workspaceInfo?: string;
}

export interface IWorkspaceInformation extends IWorkspace {
	telemetryId: string | undefined;
	rendererSessionId: string;
}

export function isRemoteDiagnosticError(x: unknown): x is IRemoteDiagnosticError {
	const candidate = x as IRemoteDiagnosticError | undefined;
	return !!candidate?.hostName && !!candidate?.errorMessage;
}

export class NullDiagnosticsService implements IDiagnosticsService {
	_serviceBrand: undefined;

	async getPerformanceInfo(mainProcessInfo: IMainProcessDiagnostics, remoteInfo: (IRemoteDiagnosticInfo | IRemoteDiagnosticError)[]): Promise<PerformanceInfo> {
		return {};
	}

	async getSystemInfo(mainProcessInfo: IMainProcessDiagnostics, remoteInfo: (IRemoteDiagnosticInfo | IRemoteDiagnosticError)[]): Promise<SystemInfo> {
		return {
			processArgs: 'nullProcessArgs',
			gpuStatus: 'nullGpuStatus',
			screenReader: 'nullScreenReader',
			remoteData: [],
			os: 'nullOs',
			memory: 'nullMemory',
			vmHint: 'nullVmHint',
		};
	}

	async getDiagnostics(mainProcessInfo: IMainProcessDiagnostics, remoteInfo: (IRemoteDiagnosticInfo | IRemoteDiagnosticError)[]): Promise<string> {
		return '';
	}

	async getWorkspaceFileExtensions(workspace: IWorkspace): Promise<{ extensions: string[] }> {
		return { extensions: [] };
	}

	async reportWorkspaceStats(workspace: IWorkspaceInformation): Promise<void> { }

}

export interface IWindowDiagnostics {
	readonly id: number;
	readonly pid: number;
	readonly title: string;
	readonly folderURIs: UriComponents[];
	readonly remoteAuthority?: string;
}

export interface IProcessDiagnostics {
	readonly pid: number;
	readonly name: string;
}

export interface IMainProcessDiagnostics {
	readonly mainPID: number;
	readonly mainArguments: string[]; // All arguments after argv[0], the exec path
	readonly windows: IWindowDiagnostics[];
	readonly pidToNames: IProcessDiagnostics[];
	readonly screenReader: boolean;
	readonly gpuFeatureStatus: any;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/diagnostics/electron-browser/diagnosticsService.ts]---
Location: vscode-main/src/vs/platform/diagnostics/electron-browser/diagnosticsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDiagnosticsService } from '../common/diagnostics.js';
import { registerSharedProcessRemoteService } from '../../ipc/electron-browser/services.js';

registerSharedProcessRemoteService(IDiagnosticsService, 'diagnostics');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/diagnostics/electron-main/diagnosticsMainService.ts]---
Location: vscode-main/src/vs/platform/diagnostics/electron-main/diagnosticsMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { app, BrowserWindow, Event as IpcEvent } from 'electron';
import { validatedIpcMain } from '../../../base/parts/ipc/electron-main/ipcMain.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { URI } from '../../../base/common/uri.js';
import { IDiagnosticInfo, IDiagnosticInfoOptions, IMainProcessDiagnostics, IProcessDiagnostics, IRemoteDiagnosticError, IRemoteDiagnosticInfo, IWindowDiagnostics } from '../common/diagnostics.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ICodeWindow } from '../../window/electron-main/window.js';
import { getAllWindowsExcludingOffscreen, IWindowsMainService } from '../../windows/electron-main/windows.js';
import { isSingleFolderWorkspaceIdentifier, isWorkspaceIdentifier } from '../../workspace/common/workspace.js';
import { IWorkspacesManagementMainService } from '../../workspaces/electron-main/workspacesManagementMainService.js';
import { assertReturnsDefined } from '../../../base/common/types.js';
import { ILogService } from '../../log/common/log.js';
import { UtilityProcess } from '../../utilityProcess/electron-main/utilityProcess.js';

export const ID = 'diagnosticsMainService';
export const IDiagnosticsMainService = createDecorator<IDiagnosticsMainService>(ID);

export interface IRemoteDiagnosticOptions {
	includeProcesses?: boolean;
	includeWorkspaceMetadata?: boolean;
}

export interface IDiagnosticsMainService {
	readonly _serviceBrand: undefined;
	getRemoteDiagnostics(options: IRemoteDiagnosticOptions): Promise<(IRemoteDiagnosticInfo | IRemoteDiagnosticError)[]>;
	getMainDiagnostics(): Promise<IMainProcessDiagnostics>;
}

export class DiagnosticsMainService implements IDiagnosticsMainService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@IWindowsMainService private readonly windowsMainService: IWindowsMainService,
		@IWorkspacesManagementMainService private readonly workspacesManagementMainService: IWorkspacesManagementMainService,
		@ILogService private readonly logService: ILogService
	) { }

	async getRemoteDiagnostics(options: IRemoteDiagnosticOptions): Promise<(IRemoteDiagnosticInfo | IRemoteDiagnosticError)[]> {
		const windows = this.windowsMainService.getWindows();
		const diagnostics: Array<IDiagnosticInfo | IRemoteDiagnosticError | undefined> = await Promise.all(windows.map(async window => {
			const remoteAuthority = window.remoteAuthority;
			if (!remoteAuthority) {
				return undefined;
			}

			const replyChannel = `vscode:getDiagnosticInfoResponse${window.id}`;
			const args: IDiagnosticInfoOptions = {
				includeProcesses: options.includeProcesses,
				folders: options.includeWorkspaceMetadata ? await this.getFolderURIs(window) : undefined
			};

			return new Promise<IDiagnosticInfo | IRemoteDiagnosticError>(resolve => {
				window.sendWhenReady('vscode:getDiagnosticInfo', CancellationToken.None, { replyChannel, args });

				validatedIpcMain.once(replyChannel, (_: IpcEvent, data: IRemoteDiagnosticInfo) => {
					// No data is returned if getting the connection fails.
					if (!data) {
						resolve({ hostName: remoteAuthority, errorMessage: `Unable to resolve connection to '${remoteAuthority}'.` });
					}

					resolve(data);
				});

				setTimeout(() => {
					resolve({ hostName: remoteAuthority, errorMessage: `Connection to '${remoteAuthority}' could not be established` });
				}, 5000);
			});
		}));

		return diagnostics.filter((x): x is IRemoteDiagnosticInfo | IRemoteDiagnosticError => !!x);
	}

	async getMainDiagnostics(): Promise<IMainProcessDiagnostics> {
		this.logService.trace('Received request for main process info from other instance.');

		const windows: IWindowDiagnostics[] = [];
		for (const window of getAllWindowsExcludingOffscreen()) {
			const codeWindow = this.windowsMainService.getWindowById(window.id);
			if (codeWindow) {
				windows.push(await this.codeWindowToInfo(codeWindow));
			} else {
				windows.push(this.browserWindowToInfo(window));
			}
		}

		const pidToNames: IProcessDiagnostics[] = [];
		for (const { pid, name } of UtilityProcess.getAll()) {
			pidToNames.push({ pid, name });
		}

		return {
			mainPID: process.pid,
			mainArguments: process.argv.slice(1),
			windows,
			pidToNames,
			screenReader: !!app.accessibilitySupportEnabled,
			gpuFeatureStatus: app.getGPUFeatureStatus()
		};
	}

	private async codeWindowToInfo(window: ICodeWindow): Promise<IWindowDiagnostics> {
		const folderURIs = await this.getFolderURIs(window);
		const win = assertReturnsDefined(window.win);

		return this.browserWindowToInfo(win, folderURIs, window.remoteAuthority);
	}

	private browserWindowToInfo(window: BrowserWindow, folderURIs: URI[] = [], remoteAuthority?: string): IWindowDiagnostics {
		return {
			id: window.id,
			pid: window.webContents.getOSProcessId(),
			title: window.getTitle(),
			folderURIs,
			remoteAuthority
		};
	}

	private async getFolderURIs(window: ICodeWindow): Promise<URI[]> {
		const folderURIs: URI[] = [];

		const workspace = window.openedWorkspace;
		if (isSingleFolderWorkspaceIdentifier(workspace)) {
			folderURIs.push(workspace.uri);
		} else if (isWorkspaceIdentifier(workspace)) {
			const resolvedWorkspace = await this.workspacesManagementMainService.resolveLocalWorkspace(workspace.configPath); // workspace folders can only be shown for local (resolved) workspaces
			if (resolvedWorkspace) {
				const rootFolders = resolvedWorkspace.folders;
				rootFolders.forEach(root => {
					folderURIs.push(root.uri);
				});
			}
		}

		return folderURIs;
	}
}
```

--------------------------------------------------------------------------------

````
