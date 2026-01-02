---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 73
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 73 of 552)

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

---[FILE: extensions/python/syntaxes/MagicPython.tmLanguage.json]---
Location: vscode-main/extensions/python/syntaxes/MagicPython.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/MagicStack/MagicPython/blob/master/grammars/MagicPython.tmLanguage",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/MagicStack/MagicPython/commit/7d0f2b22a5ad8fccbd7341bc7b7a715169283044",
	"name": "MagicPython",
	"scopeName": "source.python",
	"patterns": [
		{
			"include": "#statement"
		},
		{
			"include": "#expression"
		}
	],
	"repository": {
		"impossible": {
			"comment": "This is a special rule that should be used where no match is desired. It is not a good idea to match something like '1{0}' because in some cases that can result in infinite loops in token generation. So the rule instead matches and impossible expression to allow a match to fail and move to the next token.",
			"match": "$.^"
		},
		"statement": {
			"patterns": [
				{
					"include": "#import"
				},
				{
					"include": "#class-declaration"
				},
				{
					"include": "#function-declaration"
				},
				{
					"include": "#generator"
				},
				{
					"include": "#statement-keyword"
				},
				{
					"include": "#assignment-operator"
				},
				{
					"include": "#decorator"
				},
				{
					"include": "#docstring-statement"
				},
				{
					"include": "#semicolon"
				}
			]
		},
		"semicolon": {
			"patterns": [
				{
					"name": "invalid.deprecated.semicolon.python",
					"match": "\\;$"
				}
			]
		},
		"comments": {
			"patterns": [
				{
					"name": "comment.line.number-sign.python",
					"contentName": "meta.typehint.comment.python",
					"begin": "(?x)\n  (?:\n    \\# \\s* (type:)\n    \\s*+ (?# we want `\\s*+` which is possessive quantifier since\n             we do not actually want to backtrack when matching\n             whitespace here)\n    (?! $ | \\#)\n  )\n",
					"end": "(?:$|(?=\\#))",
					"beginCaptures": {
						"0": {
							"name": "meta.typehint.comment.python"
						},
						"1": {
							"name": "comment.typehint.directive.notation.python"
						}
					},
					"patterns": [
						{
							"name": "comment.typehint.ignore.notation.python",
							"match": "(?x)\n  \\G ignore\n  (?= \\s* (?: $ | \\#))\n"
						},
						{
							"name": "comment.typehint.type.notation.python",
							"match": "(?x)\n  (?<!\\.)\\b(\n    bool | bytes | float | int | object | str\n    | List | Dict | Iterable | Sequence | Set\n    | FrozenSet | Callable | Union | Tuple\n    | Any | None\n  )\\b\n"
						},
						{
							"name": "comment.typehint.punctuation.notation.python",
							"match": "([\\[\\]\\(\\),\\.\\=\\*]|(->))"
						},
						{
							"name": "comment.typehint.variable.notation.python",
							"match": "([[:alpha:]_]\\w*)"
						}
					]
				},
				{
					"include": "#comments-base"
				}
			]
		},
		"docstring-statement": {
			"begin": "^(?=\\s*[rR]?(\\'\\'\\'|\\\"\\\"\\\"|\\'|\\\"))",
			"comment": "the string either terminates correctly or by the beginning of a new line (this is for single line docstrings that aren't terminated) AND it's not followed by another docstring",
			"end": "((?<=\\1)|^)(?!\\s*[rR]?(\\'\\'\\'|\\\"\\\"\\\"|\\'|\\\"))",
			"patterns": [
				{
					"include": "#docstring"
				}
			]
		},
		"docstring": {
			"patterns": [
				{
					"name": "string.quoted.docstring.multi.python",
					"begin": "(\\'\\'\\'|\\\"\\\"\\\")",
					"end": "(\\1)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.string.begin.python"
						}
					},
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.string.end.python"
						}
					},
					"patterns": [
						{
							"include": "#docstring-prompt"
						},
						{
							"include": "#codetags"
						},
						{
							"include": "#docstring-guts-unicode"
						}
					]
				},
				{
					"name": "string.quoted.docstring.raw.multi.python",
					"begin": "([rR])(\\'\\'\\'|\\\"\\\"\\\")",
					"end": "(\\2)",
					"beginCaptures": {
						"1": {
							"name": "storage.type.string.python"
						},
						"2": {
							"name": "punctuation.definition.string.begin.python"
						}
					},
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.string.end.python"
						}
					},
					"patterns": [
						{
							"include": "#string-consume-escape"
						},
						{
							"include": "#docstring-prompt"
						},
						{
							"include": "#codetags"
						}
					]
				},
				{
					"name": "string.quoted.docstring.single.python",
					"begin": "(\\'|\\\")",
					"end": "(\\1)|(\\n)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.string.begin.python"
						}
					},
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.string.end.python"
						},
						"2": {
							"name": "invalid.illegal.newline.python"
						}
					},
					"patterns": [
						{
							"include": "#codetags"
						},
						{
							"include": "#docstring-guts-unicode"
						}
					]
				},
				{
					"name": "string.quoted.docstring.raw.single.python",
					"begin": "([rR])(\\'|\\\")",
					"end": "(\\2)|(\\n)",
					"beginCaptures": {
						"1": {
							"name": "storage.type.string.python"
						},
						"2": {
							"name": "punctuation.definition.string.begin.python"
						}
					},
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.string.end.python"
						},
						"2": {
							"name": "invalid.illegal.newline.python"
						}
					},
					"patterns": [
						{
							"include": "#string-consume-escape"
						},
						{
							"include": "#codetags"
						}
					]
				}
			]
		},
		"docstring-guts-unicode": {
			"patterns": [
				{
					"include": "#escape-sequence-unicode"
				},
				{
					"include": "#escape-sequence"
				},
				{
					"include": "#string-line-continuation"
				}
			]
		},
		"docstring-prompt": {
			"match": "(?x)\n  (?:\n    (?:^|\\G) \\s* (?# '\\G' is necessary for ST)\n    ((?:>>>|\\.\\.\\.) \\s) (?=\\s*\\S)\n  )\n",
			"captures": {
				"1": {
					"name": "keyword.control.flow.python"
				}
			}
		},
		"statement-keyword": {
			"patterns": [
				{
					"name": "storage.type.function.python",
					"match": "\\b((async\\s+)?\\s*def)\\b"
				},
				{
					"name": "keyword.control.flow.python",
					"comment": "if `as` is eventually followed by `:` or line continuation\nit's probably control flow like:\n    with foo as bar, \\\n         Foo as Bar:\n      try:\n        do_stuff()\n      except Exception as e:\n        pass\n",
					"match": "\\b(?<!\\.)as\\b(?=.*[:\\\\])"
				},
				{
					"name": "keyword.control.import.python",
					"comment": "other legal use of `as` is in an import",
					"match": "\\b(?<!\\.)as\\b"
				},
				{
					"name": "keyword.control.flow.python",
					"match": "(?x)\n  \\b(?<!\\.)(\n    async | continue | del | assert | break | finally | for\n    | from | elif | else | if | except | pass | raise\n    | return | try | while | with\n  )\\b\n"
				},
				{
					"name": "storage.modifier.declaration.python",
					"match": "(?x)\n  \\b(?<!\\.)(\n    global | nonlocal\n  )\\b\n"
				},
				{
					"name": "storage.type.class.python",
					"match": "\\b(?<!\\.)(class)\\b"
				},
				{
					"match": "(?x)\n  ^\\s*(\n    case | match\n  )(?=\\s*([-+\\w\\d(\\[{'\":#]|$))\\b\n",
					"captures": {
						"1": {
							"name": "keyword.control.flow.python"
						}
					}
				}
			]
		},
		"expression-bare": {
			"comment": "valid Python expressions w/o comments and line continuation",
			"patterns": [
				{
					"include": "#backticks"
				},
				{
					"include": "#illegal-anno"
				},
				{
					"include": "#literal"
				},
				{
					"include": "#regexp"
				},
				{
					"include": "#string"
				},
				{
					"include": "#lambda"
				},
				{
					"include": "#generator"
				},
				{
					"include": "#illegal-operator"
				},
				{
					"include": "#operator"
				},
				{
					"include": "#curly-braces"
				},
				{
					"include": "#item-access"
				},
				{
					"include": "#list"
				},
				{
					"include": "#odd-function-call"
				},
				{
					"include": "#round-braces"
				},
				{
					"include": "#function-call"
				},
				{
					"include": "#builtin-functions"
				},
				{
					"include": "#builtin-types"
				},
				{
					"include": "#builtin-exceptions"
				},
				{
					"include": "#magic-names"
				},
				{
					"include": "#special-names"
				},
				{
					"include": "#illegal-names"
				},
				{
					"include": "#special-variables"
				},
				{
					"include": "#ellipsis"
				},
				{
					"include": "#punctuation"
				},
				{
					"include": "#line-continuation"
				}
			]
		},
		"expression-base": {
			"comment": "valid Python expressions with comments and line continuation",
			"patterns": [
				{
					"include": "#comments"
				},
				{
					"include": "#expression-bare"
				},
				{
					"include": "#line-continuation"
				}
			]
		},
		"expression": {
			"comment": "All valid Python expressions",
			"patterns": [
				{
					"include": "#expression-base"
				},
				{
					"include": "#member-access"
				},
				{
					"comment": "Tokenize identifiers to help linters",
					"match": "(?x) \\b ([[:alpha:]_]\\w*) \\b"
				}
			]
		},
		"member-access": {
			"name": "meta.member.access.python",
			"begin": "(\\.)\\s*(?!\\.)",
			"end": "(?x)\n  # stop when you've just read non-whitespace followed by non-word\n  # i.e. when finished reading an identifier or function call\n  (?<=\\S)(?=\\W) |\n  # stop when seeing the start of something that's not a word,\n  # i.e. when seeing a non-identifier\n  (^|(?<=\\s))(?=[^\\\\\\w\\s]) |\n  $\n",
			"beginCaptures": {
				"1": {
					"name": "punctuation.separator.period.python"
				}
			},
			"patterns": [
				{
					"include": "#function-call"
				},
				{
					"include": "#member-access-base"
				},
				{
					"include": "#member-access-attribute"
				}
			]
		},
		"member-access-base": {
			"patterns": [
				{
					"include": "#magic-names"
				},
				{
					"include": "#illegal-names"
				},
				{
					"include": "#illegal-object-name"
				},
				{
					"include": "#special-names"
				},
				{
					"include": "#line-continuation"
				},
				{
					"include": "#item-access"
				}
			]
		},
		"member-access-attribute": {
			"comment": "Highlight attribute access in otherwise non-specialized cases.",
			"name": "meta.attribute.python",
			"match": "(?x)\n  \\b ([[:alpha:]_]\\w*) \\b\n"
		},
		"special-names": {
			"name": "constant.other.caps.python",
			"match": "(?x)\n  \\b\n    # we want to see \"enough\", meaning 2 or more upper-case\n    # letters in the beginning of the constant\n    #\n    # for more details refer to:\n    #   https://github.com/MagicStack/MagicPython/issues/42\n    (\n      _* [[:upper:]] [_\\d]* [[:upper:]]\n    )\n    [[:upper:]\\d]* (_\\w*)?\n  \\b\n"
		},
		"curly-braces": {
			"begin": "\\{",
			"end": "\\}",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.dict.begin.python"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.dict.end.python"
				}
			},
			"patterns": [
				{
					"name": "punctuation.separator.dict.python",
					"match": ":"
				},
				{
					"include": "#expression"
				}
			]
		},
		"list": {
			"begin": "\\[",
			"end": "\\]",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.list.begin.python"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.list.end.python"
				}
			},
			"patterns": [
				{
					"include": "#expression"
				}
			]
		},
		"odd-function-call": {
			"comment": "A bit obscured function call where there may have been an\narbitrary number of other operations to get the function.\nE.g. \"arr[idx](args)\"\n",
			"begin": "(?x)\n  (?<= \\] | \\) ) \\s*\n  (?=\\()\n",
			"end": "(\\))",
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.arguments.end.python"
				}
			},
			"patterns": [
				{
					"include": "#function-arguments"
				}
			]
		},
		"round-braces": {
			"begin": "\\(",
			"end": "\\)",
			"beginCaptures": {
				"0": {
					"name": "punctuation.parenthesis.begin.python"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.parenthesis.end.python"
				}
			},
			"patterns": [
				{
					"include": "#expression"
				}
			]
		},
		"line-continuation": {
			"patterns": [
				{
					"match": "(\\\\)\\s*(\\S.*$\\n?)",
					"captures": {
						"1": {
							"name": "punctuation.separator.continuation.line.python"
						},
						"2": {
							"name": "invalid.illegal.line.continuation.python"
						}
					}
				},
				{
					"begin": "(\\\\)\\s*$\\n?",
					"end": "(?x)\n  (?=^\\s*$)\n  |\n  (?! (\\s* [rR]? (\\'\\'\\'|\\\"\\\"\\\"|\\'|\\\"))\n      |\n      (\\G $)  (?# '\\G' is necessary for ST)\n  )\n",
					"beginCaptures": {
						"1": {
							"name": "punctuation.separator.continuation.line.python"
						}
					},
					"patterns": [
						{
							"include": "#regexp"
						},
						{
							"include": "#string"
						}
					]
				}
			]
		},
		"assignment-operator": {
			"name": "keyword.operator.assignment.python",
			"match": "(?x)\n     <<= | >>= | //= | \\*\\*=\n    | \\+= | -= | /= | @=\n    | \\*= | %= | ~= | \\^= | &= | \\|=\n    | =(?!=)\n"
		},
		"operator": {
			"match": "(?x)\n    \\b(?<!\\.)\n      (?:\n        (and | or | not | in | is)                         (?# 1)\n        |\n        (for | if | else | await | (?:yield(?:\\s+from)?))  (?# 2)\n      )\n    (?!\\s*:)\\b\n\n    | (<< | >> | & | \\| | \\^ | ~)                          (?# 3)\n\n    | (\\*\\* | \\* | \\+ | - | % | // | / | @)                (?# 4)\n\n    | (!= | == | >= | <= | < | >)                          (?# 5)\n\n    | (:=)                                                 (?# 6)\n",
			"captures": {
				"1": {
					"name": "keyword.operator.logical.python"
				},
				"2": {
					"name": "keyword.control.flow.python"
				},
				"3": {
					"name": "keyword.operator.bitwise.python"
				},
				"4": {
					"name": "keyword.operator.arithmetic.python"
				},
				"5": {
					"name": "keyword.operator.comparison.python"
				},
				"6": {
					"name": "keyword.operator.assignment.python"
				}
			}
		},
		"punctuation": {
			"patterns": [
				{
					"name": "punctuation.separator.colon.python",
					"match": ":"
				},
				{
					"name": "punctuation.separator.element.python",
					"match": ","
				}
			]
		},
		"literal": {
			"patterns": [
				{
					"name": "constant.language.python",
					"match": "\\b(True|False|None|NotImplemented|Ellipsis)\\b"
				},
				{
					"include": "#number"
				}
			]
		},
		"number": {
			"name": "constant.numeric.python",
			"patterns": [
				{
					"include": "#number-float"
				},
				{
					"include": "#number-dec"
				},
				{
					"include": "#number-hex"
				},
				{
					"include": "#number-oct"
				},
				{
					"include": "#number-bin"
				},
				{
					"include": "#number-long"
				},
				{
					"name": "invalid.illegal.name.python",
					"match": "\\b[0-9]+\\w+"
				}
			]
		},
		"number-float": {
			"name": "constant.numeric.float.python",
			"match": "(?x)\n  (?<! \\w)(?:\n    (?:\n      \\.[0-9](?: _?[0-9] )*\n      |\n      [0-9](?: _?[0-9] )* \\. [0-9](?: _?[0-9] )*\n      |\n      [0-9](?: _?[0-9] )* \\.\n    ) (?: [eE][+-]?[0-9](?: _?[0-9] )* )?\n    |\n    [0-9](?: _?[0-9] )* (?: [eE][+-]?[0-9](?: _?[0-9] )* )\n  )([jJ])?\\b\n",
			"captures": {
				"1": {
					"name": "storage.type.imaginary.number.python"
				}
			}
		},
		"number-dec": {
			"name": "constant.numeric.dec.python",
			"match": "(?x)\n  (?<![\\w\\.])(?:\n      [1-9](?: _?[0-9] )*\n      |\n      0+\n      |\n      [0-9](?: _?[0-9] )* ([jJ])\n      |\n      0 ([0-9]+)(?![eE\\.])\n  )\\b\n",
			"captures": {
				"1": {
					"name": "storage.type.imaginary.number.python"
				},
				"2": {
					"name": "invalid.illegal.dec.python"
				}
			}
		},
		"number-hex": {
			"name": "constant.numeric.hex.python",
			"match": "(?x)\n  (?<![\\w\\.])\n    (0[xX]) (_?[0-9a-fA-F])+\n  \\b\n",
			"captures": {
				"1": {
					"name": "storage.type.number.python"
				}
			}
		},
		"number-oct": {
			"name": "constant.numeric.oct.python",
			"match": "(?x)\n  (?<![\\w\\.])\n    (0[oO]) (_?[0-7])+\n  \\b\n",
			"captures": {
				"1": {
					"name": "storage.type.number.python"
				}
			}
		},
		"number-bin": {
			"name": "constant.numeric.bin.python",
			"match": "(?x)\n  (?<![\\w\\.])\n    (0[bB]) (_?[01])+\n  \\b\n",
			"captures": {
				"1": {
					"name": "storage.type.number.python"
				}
			}
		},
		"number-long": {
			"name": "constant.numeric.bin.python",
			"comment": "this is to support python2 syntax for long ints",
			"match": "(?x)\n  (?<![\\w\\.])\n    ([1-9][0-9]* | 0) ([lL])\n  \\b\n",
			"captures": {
				"2": {
					"name": "storage.type.number.python"
				}
			}
		},
		"regexp": {
			"patterns": [
				{
					"include": "#regexp-single-three-line"
				},
				{
					"include": "#regexp-double-three-line"
				},
				{
					"include": "#regexp-single-one-line"
				},
				{
					"include": "#regexp-double-one-line"
				}
			]
		},
		"string": {
			"patterns": [
				{
					"include": "#string-quoted-multi-line"
				},
				{
					"include": "#string-quoted-single-line"
				},
				{
					"include": "#string-bin-quoted-multi-line"
				},
				{
					"include": "#string-bin-quoted-single-line"
				},
				{
					"include": "#string-raw-quoted-multi-line"
				},
				{
					"include": "#string-raw-quoted-single-line"
				},
				{
					"include": "#string-raw-bin-quoted-multi-line"
				},
				{
					"include": "#string-raw-bin-quoted-single-line"
				},
				{
					"include": "#fstring-fnorm-quoted-multi-line"
				},
				{
					"include": "#fstring-fnorm-quoted-single-line"
				},
				{
					"include": "#fstring-normf-quoted-multi-line"
				},
				{
					"include": "#fstring-normf-quoted-single-line"
				},
				{
					"include": "#fstring-raw-quoted-multi-line"
				},
				{
					"include": "#fstring-raw-quoted-single-line"
				}
			]
		},
		"string-unicode-guts": {
			"patterns": [
				{
					"include": "#escape-sequence-unicode"
				},
				{
					"include": "#string-entity"
				},
				{
					"include": "#string-brace-formatting"
				}
			]
		},
		"string-consume-escape": {
			"match": "\\\\['\"\\n\\\\]"
		},
		"string-raw-guts": {
			"patterns": [
				{
					"include": "#string-consume-escape"
				},
				{
					"include": "#string-formatting"
				},
				{
					"include": "#string-brace-formatting"
				}
			]
		},
		"string-raw-bin-guts": {
			"patterns": [
				{
					"include": "#string-consume-escape"
				},
				{
					"include": "#string-formatting"
				}
			]
		},
		"string-entity": {
			"patterns": [
				{
					"include": "#escape-sequence"
				},
				{
					"include": "#string-line-continuation"
				},
				{
					"include": "#string-formatting"
				}
			]
		},
		"fstring-guts": {
			"patterns": [
				{
					"include": "#escape-sequence-unicode"
				},
				{
					"include": "#escape-sequence"
				},
				{
					"include": "#string-line-continuation"
				},
				{
					"include": "#fstring-formatting"
				}
			]
		},
		"fstring-raw-guts": {
			"patterns": [
				{
					"include": "#string-consume-escape"
				},
				{
					"include": "#fstring-formatting"
				}
			]
		},
		"fstring-illegal-single-brace": {
			"comment": "it is illegal to have a multiline brace inside a single-line string",
			"begin": "(\\{)(?=[^\\n}]*$\\n?)",
			"end": "(\\})|(?=\\n)",
			"beginCaptures": {
				"1": {
					"name": "constant.character.format.placeholder.other.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "constant.character.format.placeholder.other.python"
				}
			},
			"patterns": [
				{
					"include": "#fstring-terminator-single"
				},
				{
					"include": "#f-expression"
				}
			]
		},
		"fstring-illegal-multi-brace": {
			"patterns": [
				{
					"include": "#impossible"
				}
			]
		},
		"f-expression": {
			"comment": "All valid Python expressions, except comments and line continuation",
			"patterns": [
				{
					"include": "#expression-bare"
				},
				{
					"include": "#member-access"
				},
				{
					"comment": "Tokenize identifiers to help linters",
					"match": "(?x) \\b ([[:alpha:]_]\\w*) \\b"
				}
			]
		},
		"escape-sequence-unicode": {
			"patterns": [
				{
					"name": "constant.character.escape.python",
					"match": "(?x)\n  \\\\ (\n        u[0-9A-Fa-f]{4}\n        | U[0-9A-Fa-f]{8}\n        | N\\{[\\w\\s]+?\\}\n     )\n"
				}
			]
		},
		"escape-sequence": {
			"name": "constant.character.escape.python",
			"match": "(?x)\n  \\\\ (\n        x[0-9A-Fa-f]{2}\n        | [0-7]{1,3}\n        | [\\\\\"'abfnrtv]\n     )\n"
		},
		"string-line-continuation": {
			"name": "constant.language.python",
			"match": "\\\\$"
		},
		"string-formatting": {
			"name": "meta.format.percent.python",
			"match": "(?x)\n  (\n    % (\\([\\w\\s]*\\))?\n      [-+#0 ]*\n      (\\d+|\\*)? (\\.(\\d+|\\*))?\n      ([hlL])?\n      [diouxXeEfFgGcrsab%]\n  )\n",
			"captures": {
				"1": {
					"name": "constant.character.format.placeholder.other.python"
				}
			}
		},
		"string-brace-formatting": {
			"patterns": [
				{
					"name": "meta.format.brace.python",
					"match": "(?x)\n  (\n    {{ | }}\n    | (?:\n      {\n        \\w* (\\.[[:alpha:]_]\\w* | \\[[^\\]'\"]+\\])*\n        (![rsa])?\n        ( : \\w? [<>=^]? [-+ ]? \\#?\n          \\d* ,? (\\.\\d+)? [bcdeEfFgGnosxX%]? )?\n      })\n  )\n",
					"captures": {
						"1": {
							"name": "constant.character.format.placeholder.other.python"
						},
						"3": {
							"name": "storage.type.format.python"
						},
						"4": {
							"name": "storage.type.format.python"
						}
					}
				},
				{
					"name": "meta.format.brace.python",
					"match": "(?x)\n  (\n    {\n      \\w* (\\.[[:alpha:]_]\\w* | \\[[^\\]'\"]+\\])*\n      (![rsa])?\n      (:)\n        [^'\"{}\\n]* (?:\n          \\{ [^'\"}\\n]*? \\} [^'\"{}\\n]*\n        )*\n    }\n  )\n",
					"captures": {
						"1": {
							"name": "constant.character.format.placeholder.other.python"
						},
						"3": {
							"name": "storage.type.format.python"
						},
						"4": {
							"name": "storage.type.format.python"
						}
					}
				}
			]
		},
		"fstring-formatting": {
			"patterns": [
				{
					"include": "#fstring-formatting-braces"
				},
				{
					"include": "#fstring-formatting-singe-brace"
				}
			]
		},
		"fstring-formatting-singe-brace": {
			"name": "invalid.illegal.brace.python",
			"match": "(}(?!}))"
		},
		"import": {
			"comment": "Import statements used to correctly mark `from`, `import`, and `as`\n",
			"patterns": [
				{
					"begin": "\\b(?<!\\.)(from)\\b(?=.+import)",
					"end": "$|(?=import)",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.import.python"
						}
					},
					"patterns": [
						{
							"name": "punctuation.separator.period.python",
							"match": "\\.+"
						},
						{
							"include": "#expression"
						}
					]
				},
				{
					"begin": "\\b(?<!\\.)(import)\\b",
					"end": "$",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.import.python"
						}
					},
					"patterns": [
						{
							"name": "keyword.control.import.python",
							"match": "\\b(?<!\\.)as\\b"
						},
						{
							"include": "#expression"
						}
					]
				}
			]
		},
		"class-declaration": {
			"patterns": [
				{
					"name": "meta.class.python",
					"begin": "(?x)\n  \\s*(class)\\s+\n    (?=\n      [[:alpha:]_]\\w* \\s* (:|\\()\n    )\n",
					"end": "(:)",
					"beginCaptures": {
						"1": {
							"name": "storage.type.class.python"
						}
					},
					"endCaptures": {
						"1": {
							"name": "punctuation.section.class.begin.python"
						}
					},
					"patterns": [
						{
							"include": "#class-name"
						},
						{
							"include": "#class-inheritance"
						}
					]
				}
			]
		},
		"class-name": {
			"patterns": [
				{
					"include": "#illegal-object-name"
				},
				{
					"include": "#builtin-possible-callables"
				},
				{
					"name": "entity.name.type.class.python",
					"match": "(?x)\n  \\b ([[:alpha:]_]\\w*) \\b\n"
				}
			]
		},
		"class-inheritance": {
			"name": "meta.class.inheritance.python",
			"begin": "(\\()",
			"end": "(\\))",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.inheritance.begin.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.inheritance.end.python"
				}
			},
			"patterns": [
				{
					"name": "keyword.operator.unpacking.arguments.python",
					"match": "(\\*\\*|\\*)"
				},
				{
					"name": "punctuation.separator.inheritance.python",
					"match": ","
				},
				{
					"name": "keyword.operator.assignment.python",
					"match": "=(?!=)"
				},
				{
					"name": "support.type.metaclass.python",
					"match": "\\bmetaclass\\b"
				},
				{
					"include": "#illegal-names"
				},
				{
					"include": "#class-kwarg"
				},
				{
					"include": "#call-wrapper-inheritance"
				},
				{
					"include": "#expression-base"
				},
				{
					"include": "#member-access-class"
				},
				{
					"include": "#inheritance-identifier"
				}
			]
		},
		"class-kwarg": {
			"match": "(?x)\n  \\b ([[:alpha:]_]\\w*) \\s*(=)(?!=)\n",
			"captures": {
				"1": {
					"name": "entity.other.inherited-class.python variable.parameter.class.python"
				},
				"2": {
					"name": "keyword.operator.assignment.python"
				}
			}
		},
		"inheritance-identifier": {
			"match": "(?x)\n  \\b ([[:alpha:]_]\\w*) \\b\n",
			"captures": {
				"1": {
					"name": "entity.other.inherited-class.python"
				}
			}
		},
		"member-access-class": {
			"name": "meta.member.access.python",
			"begin": "(\\.)\\s*(?!\\.)",
			"end": "(?<=\\S)(?=\\W)|$",
			"beginCaptures": {
				"1": {
					"name": "punctuation.separator.period.python"
				}
			},
			"patterns": [
				{
					"include": "#call-wrapper-inheritance"
				},
				{
					"include": "#member-access-base"
				},
				{
					"include": "#inheritance-identifier"
				}
			]
		},
		"lambda": {
			"patterns": [
				{
					"match": "((?<=\\.)lambda|lambda(?=\\s*[\\.=]))",
					"captures": {
						"1": {
							"name": "keyword.control.flow.python"
						}
					}
				},
				{
					"match": "\\b(lambda)\\s*?(?=[,\\n]|$)",
					"captures": {
						"1": {
							"name": "storage.type.function.lambda.python"
						}
					}
				},
				{
					"name": "meta.lambda-function.python",
					"begin": "(?x)\n  \\b (lambda) \\b\n",
					"end": "(:)|(\\n)",
					"beginCaptures": {
						"1": {
							"name": "storage.type.function.lambda.python"
						}
					},
					"endCaptures": {
						"1": {
							"name": "punctuation.section.function.lambda.begin.python"
						}
					},
					"contentName": "meta.function.lambda.parameters.python",
					"patterns": [
						{
							"name": "keyword.operator.positional.parameter.python",
							"match": "/"
						},
						{
							"name": "keyword.operator.unpacking.parameter.python",
							"match": "(\\*\\*|\\*)"
						},
						{
							"include": "#lambda-nested-incomplete"
						},
						{
							"include": "#illegal-names"
						},
						{
							"match": "([[:alpha:]_]\\w*)\\s*(?:(,)|(?=:|$))",
							"captures": {
								"1": {
									"name": "variable.parameter.function.language.python"
								},
								"2": {
									"name": "punctuation.separator.parameters.python"
								}
							}
						},
						{
							"include": "#comments"
						},
						{
							"include": "#backticks"
						},
						{
							"include": "#illegal-anno"
						},
						{
							"include": "#lambda-parameter-with-default"
						},
						{
							"include": "#line-continuation"
						},
						{
							"include": "#illegal-operator"
						}
					]
				}
			]
		},
		"lambda-incomplete": {
			"name": "storage.type.function.lambda.python",
			"match": "\\blambda(?=\\s*[,)])"
		},
		"lambda-nested-incomplete": {
			"name": "storage.type.function.lambda.python",
			"match": "\\blambda(?=\\s*[:,)])"
		},
		"lambda-parameter-with-default": {
			"begin": "(?x)\n  \\b\n  ([[:alpha:]_]\\w*) \\s* (=)\n",
			"end": "(,)|(?=:|$)",
			"beginCaptures": {
				"1": {
					"name": "variable.parameter.function.language.python"
				},
				"2": {
					"name": "keyword.operator.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.separator.parameters.python"
				}
			},
			"patterns": [
				{
					"include": "#expression"
				}
			]
		},
		"generator": {
			"comment": "Match \"for ... in\" construct used in generators and for loops to\ncorrectly identify the \"in\" as a control flow keyword.\n",
			"begin": "\\bfor\\b",
			"beginCaptures": {
				"0": {
					"name": "keyword.control.flow.python"
				}
			},
			"end": "\\bin\\b",
			"endCaptures": {
				"0": {
					"name": "keyword.control.flow.python"
				}
			},
			"patterns": [
				{
					"include": "#expression"
				}
			]
		},
		"function-declaration": {
			"name": "meta.function.python",
			"begin": "(?x)\n  \\s*\n  (?:\\b(async) \\s+)? \\b(def)\\s+\n    (?=\n      [[:alpha:]_][[:word:]]* \\s* \\(\n    )\n",
			"end": "(:|(?=[#'\"\\n]))",
			"beginCaptures": {
				"1": {
					"name": "storage.type.function.async.python"
				},
				"2": {
					"name": "storage.type.function.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.section.function.begin.python"
				}
			},
			"patterns": [
				{
					"include": "#function-def-name"
				},
				{
					"include": "#parameters"
				},
				{
					"include": "#line-continuation"
				},
				{
					"include": "#return-annotation"
				}
			]
		},
		"function-def-name": {
			"patterns": [
				{
					"include": "#illegal-object-name"
				},
				{
					"include": "#builtin-possible-callables"
				},
				{
					"name": "entity.name.function.python",
					"match": "(?x)\n  \\b ([[:alpha:]_]\\w*) \\b\n"
				}
			]
		},
		"parameters": {
			"name": "meta.function.parameters.python",
			"begin": "(\\()",
			"end": "(\\))",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.parameters.begin.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.parameters.end.python"
				}
			},
			"patterns": [
				{
					"name": "keyword.operator.positional.parameter.python",
					"match": "/"
				},
				{
					"name": "keyword.operator.unpacking.parameter.python",
					"match": "(\\*\\*|\\*)"
				},
				{
					"include": "#lambda-incomplete"
				},
				{
					"include": "#illegal-names"
				},
				{
					"include": "#illegal-object-name"
				},
				{
					"include": "#parameter-special"
				},
				{
					"match": "(?x)\n  ([[:alpha:]_]\\w*)\n    \\s* (?: (,) | (?=[)#\\n=]))\n",
					"captures": {
						"1": {
							"name": "variable.parameter.function.language.python"
						},
						"2": {
							"name": "punctuation.separator.parameters.python"
						}
					}
				},
				{
					"include": "#comments"
				},
				{
					"include": "#loose-default"
				},
				{
					"include": "#annotated-parameter"
				}
			]
		},
		"parameter-special": {
			"match": "(?x)\n  \\b ((self)|(cls)) \\b \\s*(?:(,)|(?=\\)))\n",
			"captures": {
				"1": {
					"name": "variable.parameter.function.language.python"
				},
				"2": {
					"name": "variable.parameter.function.language.special.self.python"
				},
				"3": {
					"name": "variable.parameter.function.language.special.cls.python"
				},
				"4": {
					"name": "punctuation.separator.parameters.python"
				}
			}
		},
		"loose-default": {
			"begin": "(=)",
			"end": "(,)|(?=\\))",
			"beginCaptures": {
				"1": {
					"name": "keyword.operator.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.separator.parameters.python"
				}
			},
			"patterns": [
				{
					"include": "#expression"
				}
			]
		},
		"annotated-parameter": {
			"begin": "(?x)\n  \\b\n  ([[:alpha:]_]\\w*) \\s* (:)\n",
			"end": "(,)|(?=\\))",
			"beginCaptures": {
				"1": {
					"name": "variable.parameter.function.language.python"
				},
				"2": {
					"name": "punctuation.separator.annotation.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.separator.parameters.python"
				}
			},
			"patterns": [
				{
					"include": "#expression"
				},
				{
					"name": "keyword.operator.assignment.python",
					"match": "=(?!=)"
				}
			]
		},
		"return-annotation": {
			"begin": "(->)",
			"end": "(?=:)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.separator.annotation.result.python"
				}
			},
			"patterns": [
				{
					"include": "#expression"
				}
			]
		},
		"item-access": {
			"patterns": [
				{
					"name": "meta.item-access.python",
					"begin": "(?x)\n  \\b(?=\n    [[:alpha:]_]\\w* \\s* \\[\n  )\n",
					"end": "(\\])",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.arguments.end.python"
						}
					},
					"patterns": [
						{
							"include": "#item-name"
						},
						{
							"include": "#item-index"
						},
						{
							"include": "#expression"
						}
					]
				}
			]
		},
		"item-name": {
			"patterns": [
				{
					"include": "#special-variables"
				},
				{
					"include": "#builtin-functions"
				},
				{
					"include": "#special-names"
				},
				{
					"name": "meta.indexed-name.python",
					"match": "(?x)\n  \\b ([[:alpha:]_]\\w*) \\b\n"
				}
			]
		},
		"item-index": {
			"begin": "(\\[)",
			"end": "(?=\\])",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.arguments.begin.python"
				}
			},
			"contentName": "meta.item-access.arguments.python",
			"patterns": [
				{
					"name": "punctuation.separator.slice.python",
					"match": ":"
				},
				{
					"include": "#expression"
				}
			]
		},
		"decorator": {
			"name": "meta.function.decorator.python",
			"begin": "(?x)\n  ^\\s*\n  ((@)) \\s* (?=[[:alpha:]_]\\w*)\n",
			"end": "(?x)\n  ( \\) )\n    # trailing whitespace and comments are legal\n    (?: (.*?) (?=\\s*(?:\\#|$)) )\n  | (?=\\n|\\#)\n",
			"beginCaptures": {
				"1": {
					"name": "entity.name.function.decorator.python"
				},
				"2": {
					"name": "punctuation.definition.decorator.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.arguments.end.python"
				},
				"2": {
					"name": "invalid.illegal.decorator.python"
				}
			},
			"patterns": [
				{
					"include": "#decorator-name"
				},
				{
					"include": "#function-arguments"
				}
			]
		},
		"decorator-name": {
			"patterns": [
				{
					"include": "#builtin-callables"
				},
				{
					"include": "#illegal-object-name"
				},
				{
					"name": "entity.name.function.decorator.python",
					"match": "(?x)\n  ([[:alpha:]_]\\w*) | (\\.)\n",
					"captures": {
						"2": {
							"name": "punctuation.separator.period.python"
						}
					}
				},
				{
					"include": "#line-continuation"
				},
				{
					"name": "invalid.illegal.decorator.python",
					"match": "(?x)\n  \\s* ([^([:alpha:]\\s_\\.#\\\\] .*?) (?=\\#|$)\n",
					"captures": {
						"1": {
							"name": "invalid.illegal.decorator.python"
						}
					}
				}
			]
		},
		"call-wrapper-inheritance": {
			"comment": "same as a function call, but in inheritance context",
			"name": "meta.function-call.python",
			"begin": "(?x)\n  \\b(?=\n    ([[:alpha:]_]\\w*) \\s* (\\()\n  )\n",
			"end": "(\\))",
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.arguments.end.python"
				}
			},
			"patterns": [
				{
					"include": "#inheritance-name"
				},
				{
					"include": "#function-arguments"
				}
			]
		},
		"inheritance-name": {
			"patterns": [
				{
					"include": "#lambda-incomplete"
				},
				{
					"include": "#builtin-possible-callables"
				},
				{
					"include": "#inheritance-identifier"
				}
			]
		},
		"function-call": {
			"name": "meta.function-call.python",
			"comment": "Regular function call of the type \"name(args)\"",
			"begin": "(?x)\n  \\b(?=\n    ([[:alpha:]_]\\w*) \\s* (\\()\n  )\n",
			"end": "(\\))",
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.arguments.end.python"
				}
			},
			"patterns": [
				{
					"include": "#special-variables"
				},
				{
					"include": "#function-name"
				},
				{
					"include": "#function-arguments"
				}
			]
		},
		"function-name": {
			"patterns": [
				{
					"include": "#builtin-possible-callables"
				},
				{
					"comment": "Some color schemas support meta.function-call.generic scope",
					"name": "meta.function-call.generic.python",
					"match": "(?x)\n  \\b ([[:alpha:]_]\\w*) \\b\n"
				}
			]
		},
		"function-arguments": {
			"begin": "(\\()",
			"end": "(?=\\))(?!\\)\\s*\\()",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.arguments.begin.python"
				}
			},
			"contentName": "meta.function-call.arguments.python",
			"patterns": [
				{
					"name": "punctuation.separator.arguments.python",
					"match": "(,)"
				},
				{
					"match": "(?x)\n  (?:(?<=[,(])|^) \\s* (\\*{1,2})\n",
					"captures": {
						"1": {
							"name": "keyword.operator.unpacking.arguments.python"
						}
					}
				},
				{
					"include": "#lambda-incomplete"
				},
				{
					"include": "#illegal-names"
				},
				{
					"match": "\\b([[:alpha:]_]\\w*)\\s*(=)(?!=)",
					"captures": {
						"1": {
							"name": "variable.parameter.function-call.python"
						},
						"2": {
							"name": "keyword.operator.assignment.python"
						}
					}
				},
				{
					"name": "keyword.operator.assignment.python",
					"match": "=(?!=)"
				},
				{
					"include": "#expression"
				},
				{
					"match": "\\s*(\\))\\s*(\\()",
					"captures": {
						"1": {
							"name": "punctuation.definition.arguments.end.python"
						},
						"2": {
							"name": "punctuation.definition.arguments.begin.python"
						}
					}
				}
			]
		},
		"builtin-callables": {
			"patterns": [
				{
					"include": "#illegal-names"
				},
				{
					"include": "#illegal-object-name"
				},
				{
					"include": "#builtin-exceptions"
				},
				{
					"include": "#builtin-functions"
				},
				{
					"include": "#builtin-types"
				}
			]
		},
		"builtin-possible-callables": {
			"patterns": [
				{
					"include": "#builtin-callables"
				},
				{
					"include": "#magic-names"
				}
			]
		},
		"builtin-exceptions": {
			"name": "support.type.exception.python",
			"match": "(?x) (?<!\\.) \\b(\n  (\n    Arithmetic | Assertion | Attribute | Buffer | BlockingIO\n    | BrokenPipe | ChildProcess\n    | (Connection (Aborted | Refused | Reset)?)\n    | EOF | Environment | FileExists | FileNotFound\n    | FloatingPoint | IO | Import | Indentation | Index | Interrupted\n    | IsADirectory | NotADirectory | Permission | ProcessLookup\n    | Timeout\n    | Key | Lookup | Memory | Name | NotImplemented | OS | Overflow\n    | Reference | Runtime | Recursion | Syntax | System\n    | Tab | Type | UnboundLocal | Unicode(Encode|Decode|Translate)?\n    | Value | Windows | ZeroDivision | ModuleNotFound\n  ) Error\n|\n  ((Pending)?Deprecation | Runtime | Syntax | User | Future | Import\n    | Unicode | Bytes | Resource\n  )? Warning\n|\n  SystemExit | Stop(Async)?Iteration\n  | KeyboardInterrupt\n  | GeneratorExit | (Base)?Exception\n)\\b\n"
		},
		"builtin-functions": {
			"patterns": [
				{
					"name": "support.function.builtin.python",
					"match": "(?x)\n  (?<!\\.) \\b(\n    __import__ | abs | aiter | all | any | anext | ascii | bin\n    | breakpoint | callable | chr | compile | copyright | credits\n    | delattr | dir | divmod | enumerate | eval | exec | exit\n    | filter | format | getattr | globals | hasattr | hash | help\n    | hex | id | input | isinstance | issubclass | iter | len\n    | license | locals | map | max | memoryview | min | next\n    | oct | open | ord | pow | print | quit | range | reload | repr\n    | reversed | round | setattr | sorted | sum | vars | zip\n  )\\b\n"
				},
				{
					"name": "variable.legacy.builtin.python",
					"match": "(?x)\n  (?<!\\.) \\b(\n    file | reduce | intern | raw_input | unicode | cmp | basestring\n    | execfile | long | xrange\n  )\\b\n"
				}
			]
		},
		"builtin-types": {
			"name": "support.type.python",
			"match": "(?x)\n  (?<!\\.) \\b(\n    bool | bytearray | bytes | classmethod | complex | dict\n    | float | frozenset | int | list | object | property\n    | set | slice | staticmethod | str | tuple | type\n\n    (?# Although 'super' is not a type, it's related to types,\n        and is special enough to be highlighted differently from\n        other built-ins)\n    | super\n  )\\b\n"
		},
		"magic-function-names": {
			"comment": "these methods have magic interpretation by python and are generally called\nindirectly through syntactic constructs\n",
			"match": "(?x)\n  \\b(\n    __(?:\n      abs | add | aenter | aexit | aiter | and | anext\n      | await | bool | call | ceil | class_getitem\n      | cmp | coerce | complex | contains | copy\n      | deepcopy | del | delattr | delete | delitem\n      | delslice | dir | div | divmod | enter | eq\n      | exit | float | floor | floordiv | format | ge\n      | get | getattr | getattribute | getinitargs\n      | getitem | getnewargs | getslice | getstate | gt\n      | hash | hex | iadd | iand | idiv | ifloordiv |\n      | ilshift | imod | imul | index | init\n      | instancecheck | int | invert | ior | ipow\n      | irshift | isub | iter | itruediv | ixor | le\n      | len | long | lshift | lt | missing | mod | mul\n      | ne | neg | new | next | nonzero | oct | or | pos\n      | pow | radd | rand | rdiv | rdivmod | reduce\n      | reduce_ex | repr | reversed | rfloordiv |\n      | rlshift | rmod | rmul | ror | round | rpow\n      | rrshift | rshift | rsub | rtruediv | rxor | set\n      | setattr | setitem | set_name | setslice\n      | setstate | sizeof | str | sub | subclasscheck\n      | truediv | trunc | unicode | xor | matmul\n      | rmatmul | imatmul | init_subclass | set_name\n      | fspath | bytes | prepare | length_hint\n    )__\n  )\\b\n",
			"captures": {
				"1": {
					"name": "support.function.magic.python"
				}
			}
		},
		"magic-variable-names": {
			"comment": "magic variables which a class/module may have.",
			"match": "(?x)\n  \\b(\n    __(?:\n      all | annotations | bases | builtins | class\n      | closure | code | debug | defaults | dict | doc | file | func\n      | globals | kwdefaults | match_args | members | metaclass | methods\n      | module | mro | mro_entries | name | qualname | post_init | self\n      | signature | slots | subclasses | version | weakref | wrapped\n      | classcell | spec | path | package | future | traceback\n    )__\n  )\\b\n",
			"captures": {
				"1": {
					"name": "support.variable.magic.python"
				}
			}
		},
		"magic-names": {
			"patterns": [
				{
					"include": "#magic-function-names"
				},
				{
					"include": "#magic-variable-names"
				}
			]
		},
		"illegal-names": {
			"match": "(?x)\n  \\b(?:\n    (\n      and | assert | async | await | break | class | continue | def\n      | del | elif | else | except | finally | for | from | global\n      | if | in | is | (?<=\\.)lambda | lambda(?=\\s*[\\.=])\n      | nonlocal | not | or | pass | raise | return | try | while | with\n      | yield\n    ) | (\n      as | import\n    )\n  )\\b\n",
			"captures": {
				"1": {
					"name": "keyword.control.flow.python"
				},
				"2": {
					"name": "keyword.control.import.python"
				}
			}
		},
		"special-variables": {
			"match": "(?x)\n  \\b (?<!\\.) (?:\n    (self) | (cls)\n  )\\b\n",
			"captures": {
				"1": {
					"name": "variable.language.special.self.python"
				},
				"2": {
					"name": "variable.language.special.cls.python"
				}
			}
		},
		"ellipsis": {
			"name": "constant.other.ellipsis.python",
			"match": "\\.\\.\\."
		},
		"backticks": {
			"name": "invalid.deprecated.backtick.python",
			"begin": "\\`",
			"end": "(?:\\`|(?<!\\\\)(\\n))",
			"patterns": [
				{
					"include": "#expression"
				}
			]
		},
		"illegal-operator": {
			"patterns": [
				{
					"name": "invalid.illegal.operator.python",
					"match": "&&|\\|\\||--|\\+\\+"
				},
				{
					"name": "invalid.illegal.operator.python",
					"match": "[?$]"
				},
				{
					"name": "invalid.illegal.operator.python",
					"comment": "We don't want `!` to flash when we're typing `!=`",
					"match": "!\\b"
				}
			]
		},
		"illegal-object-name": {
			"comment": "It's illegal to name class or function \"True\"",
			"name": "keyword.illegal.name.python",
			"match": "\\b(True|False|None)\\b"
		},
		"illegal-anno": {
			"name": "invalid.illegal.annotation.python",
			"match": "->"
		},
		"regexp-base-expression": {
			"patterns": [
				{
					"include": "#regexp-quantifier"
				},
				{
					"include": "#regexp-base-common"
				}
			]
		},
		"fregexp-base-expression": {
			"patterns": [
				{
					"include": "#fregexp-quantifier"
				},
				{
					"include": "#fstring-formatting-braces"
				},
				{
					"match": "\\{.*?\\}"
				},
				{
					"include": "#regexp-base-common"
				}
			]
		},
		"fstring-formatting-braces": {
			"patterns": [
				{
					"comment": "empty braces are illegal",
					"match": "({)(\\s*?)(})",
					"captures": {
						"1": {
							"name": "constant.character.format.placeholder.other.python"
						},
						"2": {
							"name": "invalid.illegal.brace.python"
						},
						"3": {
							"name": "constant.character.format.placeholder.other.python"
						}
					}
				},
				{
					"name": "constant.character.escape.python",
					"match": "({{|}})"
				}
			]
		},
		"regexp-base-common": {
			"patterns": [
				{
					"name": "support.other.match.any.regexp",
					"match": "\\."
				},
				{
					"name": "support.other.match.begin.regexp",
					"match": "\\^"
				},
				{
					"name": "support.other.match.end.regexp",
					"match": "\\$"
				},
				{
					"name": "keyword.operator.quantifier.regexp",
					"match": "[+*?]\\??"
				},
				{
					"name": "keyword.operator.disjunction.regexp",
					"match": "\\|"
				},
				{
					"include": "#regexp-escape-sequence"
				}
			]
		},
		"regexp-quantifier": {
			"name": "keyword.operator.quantifier.regexp",
			"match": "(?x)\n  \\{(\n    \\d+ | \\d+,(\\d+)? | ,\\d+\n  )\\}\n"
		},
		"fregexp-quantifier": {
			"name": "keyword.operator.quantifier.regexp",
			"match": "(?x)\n  \\{\\{(\n    \\d+ | \\d+,(\\d+)? | ,\\d+\n  )\\}\\}\n"
		},
		"regexp-backreference-number": {
			"name": "meta.backreference.regexp",
			"match": "(\\\\[1-9]\\d?)",
			"captures": {
				"1": {
					"name": "entity.name.tag.backreference.regexp"
				}
			}
		},
		"regexp-backreference": {
			"name": "meta.backreference.named.regexp",
			"match": "(?x)\n  (\\()  (\\?P= \\w+(?:\\s+[[:alnum:]]+)?)  (\\))\n",
			"captures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.backreference.named.begin.regexp"
				},
				"2": {
					"name": "entity.name.tag.named.backreference.regexp"
				},
				"3": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.backreference.named.end.regexp"
				}
			}
		},
		"regexp-flags": {
			"name": "storage.modifier.flag.regexp",
			"match": "\\(\\?[aiLmsux]+\\)"
		},
		"regexp-escape-special": {
			"name": "support.other.escape.special.regexp",
			"match": "\\\\([AbBdDsSwWZ])"
		},
		"regexp-escape-character": {
			"name": "constant.character.escape.regexp",
			"match": "(?x)\n  \\\\ (\n        x[0-9A-Fa-f]{2}\n        | 0[0-7]{1,2}\n        | [0-7]{3}\n     )\n"
		},
		"regexp-escape-unicode": {
			"name": "constant.character.unicode.regexp",
			"match": "(?x)\n  \\\\ (\n        u[0-9A-Fa-f]{4}\n        | U[0-9A-Fa-f]{8}\n     )\n"
		},
		"regexp-escape-catchall": {
			"name": "constant.character.escape.regexp",
			"match": "\\\\(.|\\n)"
		},
		"regexp-escape-sequence": {
			"patterns": [
				{
					"include": "#regexp-escape-special"
				},
				{
					"include": "#regexp-escape-character"
				},
				{
					"include": "#regexp-escape-unicode"
				},
				{
					"include": "#regexp-backreference-number"
				},
				{
					"include": "#regexp-escape-catchall"
				}
			]
		},
		"regexp-charecter-set-escapes": {
			"patterns": [
				{
					"name": "constant.character.escape.regexp",
					"match": "\\\\[abfnrtv\\\\]"
				},
				{
					"include": "#regexp-escape-special"
				},
				{
					"name": "constant.character.escape.regexp",
					"match": "\\\\([0-7]{1,3})"
				},
				{
					"include": "#regexp-escape-character"
				},
				{
					"include": "#regexp-escape-unicode"
				},
				{
					"include": "#regexp-escape-catchall"
				}
			]
		},
		"codetags": {
			"match": "(?:\\b(NOTE|XXX|HACK|FIXME|BUG|TODO)\\b)",
			"captures": {
				"1": {
					"name": "keyword.codetag.notation.python"
				}
			}
		},
		"comments-base": {
			"name": "comment.line.number-sign.python",
			"begin": "(\\#)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.comment.python"
				}
			},
			"end": "($)",
			"patterns": [
				{
					"include": "#codetags"
				}
			]
		},
		"comments-string-single-three": {
			"name": "comment.line.number-sign.python",
			"begin": "(\\#)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.comment.python"
				}
			},
			"end": "($|(?='''))",
			"patterns": [
				{
					"include": "#codetags"
				}
			]
		},
		"comments-string-double-three": {
			"name": "comment.line.number-sign.python",
			"begin": "(\\#)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.comment.python"
				}
			},
			"end": "($|(?=\"\"\"))",
			"patterns": [
				{
					"include": "#codetags"
				}
			]
		},
		"single-one-regexp-expression": {
			"patterns": [
				{
					"include": "#regexp-base-expression"
				},
				{
					"include": "#single-one-regexp-character-set"
				},
				{
					"include": "#single-one-regexp-comments"
				},
				{
					"include": "#regexp-flags"
				},
				{
					"include": "#single-one-regexp-named-group"
				},
				{
					"include": "#regexp-backreference"
				},
				{
					"include": "#single-one-regexp-lookahead"
				},
				{
					"include": "#single-one-regexp-lookahead-negative"
				},
				{
					"include": "#single-one-regexp-lookbehind"
				},
				{
					"include": "#single-one-regexp-lookbehind-negative"
				},
				{
					"include": "#single-one-regexp-conditional"
				},
				{
					"include": "#single-one-regexp-parentheses-non-capturing"
				},
				{
					"include": "#single-one-regexp-parentheses"
				}
			]
		},
		"single-one-regexp-character-set": {
			"patterns": [
				{
					"match": "(?x)\n  \\[ \\^? \\] (?! .*?\\])\n"
				},
				{
					"name": "meta.character.set.regexp",
					"begin": "(\\[)(\\^)?(\\])?",
					"end": "(\\]|(?=\\'))|((?=(?<!\\\\)\\n))",
					"beginCaptures": {
						"1": {
							"name": "punctuation.character.set.begin.regexp constant.other.set.regexp"
						},
						"2": {
							"name": "keyword.operator.negation.regexp"
						},
						"3": {
							"name": "constant.character.set.regexp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "punctuation.character.set.end.regexp constant.other.set.regexp"
						},
						"2": {
							"name": "invalid.illegal.newline.python"
						}
					},
					"patterns": [
						{
							"include": "#regexp-charecter-set-escapes"
						},
						{
							"name": "constant.character.set.regexp",
							"match": "[^\\n]"
						}
					]
				}
			]
		},
		"single-one-regexp-named-group": {
			"name": "meta.named.regexp",
			"begin": "(?x)\n  (\\()  (\\?P <\\w+(?:\\s+[[:alnum:]]+)?>)\n",
			"end": "(\\)|(?=\\'))|((?=(?<!\\\\)\\n))",
			"beginCaptures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.named.begin.regexp"
				},
				"2": {
					"name": "entity.name.tag.named.group.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.named.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#single-one-regexp-expression"
				}
			]
		},
		"single-one-regexp-comments": {
			"name": "comment.regexp",
			"begin": "\\(\\?#",
			"end": "(\\)|(?=\\'))|((?=(?<!\\\\)\\n))",
			"beginCaptures": {
				"0": {
					"name": "punctuation.comment.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.comment.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#codetags"
				}
			]
		},
		"single-one-regexp-lookahead": {
			"begin": "(\\()\\?=",
			"end": "(\\)|(?=\\'))|((?=(?<!\\\\)\\n))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.lookahead.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.lookahead.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.lookahead.regexp punctuation.parenthesis.lookahead.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#single-one-regexp-expression"
				}
			]
		},
		"single-one-regexp-lookahead-negative": {
			"begin": "(\\()\\?!",
			"end": "(\\)|(?=\\'))|((?=(?<!\\\\)\\n))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.lookahead.negative.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.lookahead.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.lookahead.negative.regexp punctuation.parenthesis.lookahead.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#single-one-regexp-expression"
				}
			]
		},
		"single-one-regexp-lookbehind": {
			"begin": "(\\()\\?<=",
			"end": "(\\)|(?=\\'))|((?=(?<!\\\\)\\n))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.lookbehind.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.lookbehind.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.lookbehind.regexp punctuation.parenthesis.lookbehind.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#single-one-regexp-expression"
				}
			]
		},
		"single-one-regexp-lookbehind-negative": {
			"begin": "(\\()\\?<!",
			"end": "(\\)|(?=\\'))|((?=(?<!\\\\)\\n))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.lookbehind.negative.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.lookbehind.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.lookbehind.negative.regexp punctuation.parenthesis.lookbehind.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#single-one-regexp-expression"
				}
			]
		},
		"single-one-regexp-conditional": {
			"begin": "(\\()\\?\\((\\w+(?:\\s+[[:alnum:]]+)?|\\d+)\\)",
			"end": "(\\)|(?=\\'))|((?=(?<!\\\\)\\n))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.conditional.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.conditional.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.conditional.negative.regexp punctuation.parenthesis.conditional.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#single-one-regexp-expression"
				}
			]
		},
		"single-one-regexp-parentheses-non-capturing": {
			"begin": "\\(\\?:",
			"end": "(\\)|(?=\\'))|((?=(?<!\\\\)\\n))",
			"beginCaptures": {
				"0": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.non-capturing.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.non-capturing.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#single-one-regexp-expression"
				}
			]
		},
		"single-one-regexp-parentheses": {
			"begin": "\\(",
			"end": "(\\)|(?=\\'))|((?=(?<!\\\\)\\n))",
			"beginCaptures": {
				"0": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#single-one-regexp-expression"
				}
			]
		},
		"single-three-regexp-expression": {
			"patterns": [
				{
					"include": "#regexp-base-expression"
				},
				{
					"include": "#single-three-regexp-character-set"
				},
				{
					"include": "#single-three-regexp-comments"
				},
				{
					"include": "#regexp-flags"
				},
				{
					"include": "#single-three-regexp-named-group"
				},
				{
					"include": "#regexp-backreference"
				},
				{
					"include": "#single-three-regexp-lookahead"
				},
				{
					"include": "#single-three-regexp-lookahead-negative"
				},
				{
					"include": "#single-three-regexp-lookbehind"
				},
				{
					"include": "#single-three-regexp-lookbehind-negative"
				},
				{
					"include": "#single-three-regexp-conditional"
				},
				{
					"include": "#single-three-regexp-parentheses-non-capturing"
				},
				{
					"include": "#single-three-regexp-parentheses"
				},
				{
					"include": "#comments-string-single-three"
				}
			]
		},
		"single-three-regexp-character-set": {
			"patterns": [
				{
					"match": "(?x)\n  \\[ \\^? \\] (?! .*?\\])\n"
				},
				{
					"name": "meta.character.set.regexp",
					"begin": "(\\[)(\\^)?(\\])?",
					"end": "(\\]|(?=\\'\\'\\'))",
					"beginCaptures": {
						"1": {
							"name": "punctuation.character.set.begin.regexp constant.other.set.regexp"
						},
						"2": {
							"name": "keyword.operator.negation.regexp"
						},
						"3": {
							"name": "constant.character.set.regexp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "punctuation.character.set.end.regexp constant.other.set.regexp"
						},
						"2": {
							"name": "invalid.illegal.newline.python"
						}
					},
					"patterns": [
						{
							"include": "#regexp-charecter-set-escapes"
						},
						{
							"name": "constant.character.set.regexp",
							"match": "[^\\n]"
						}
					]
				}
			]
		},
		"single-three-regexp-named-group": {
			"name": "meta.named.regexp",
			"begin": "(?x)\n  (\\()  (\\?P <\\w+(?:\\s+[[:alnum:]]+)?>)\n",
			"end": "(\\)|(?=\\'\\'\\'))",
			"beginCaptures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.named.begin.regexp"
				},
				"2": {
					"name": "entity.name.tag.named.group.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.named.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#single-three-regexp-expression"
				},
				{
					"include": "#comments-string-single-three"
				}
			]
		},
		"single-three-regexp-comments": {
			"name": "comment.regexp",
			"begin": "\\(\\?#",
			"end": "(\\)|(?=\\'\\'\\'))",
			"beginCaptures": {
				"0": {
					"name": "punctuation.comment.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.comment.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#codetags"
				}
			]
		},
		"single-three-regexp-lookahead": {
			"begin": "(\\()\\?=",
			"end": "(\\)|(?=\\'\\'\\'))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.lookahead.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.lookahead.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.lookahead.regexp punctuation.parenthesis.lookahead.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#single-three-regexp-expression"
				},
				{
					"include": "#comments-string-single-three"
				}
			]
		},
		"single-three-regexp-lookahead-negative": {
			"begin": "(\\()\\?!",
			"end": "(\\)|(?=\\'\\'\\'))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.lookahead.negative.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.lookahead.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.lookahead.negative.regexp punctuation.parenthesis.lookahead.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#single-three-regexp-expression"
				},
				{
					"include": "#comments-string-single-three"
				}
			]
		},
		"single-three-regexp-lookbehind": {
			"begin": "(\\()\\?<=",
			"end": "(\\)|(?=\\'\\'\\'))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.lookbehind.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.lookbehind.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.lookbehind.regexp punctuation.parenthesis.lookbehind.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#single-three-regexp-expression"
				},
				{
					"include": "#comments-string-single-three"
				}
			]
		},
		"single-three-regexp-lookbehind-negative": {
			"begin": "(\\()\\?<!",
			"end": "(\\)|(?=\\'\\'\\'))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.lookbehind.negative.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.lookbehind.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.lookbehind.negative.regexp punctuation.parenthesis.lookbehind.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#single-three-regexp-expression"
				},
				{
					"include": "#comments-string-single-three"
				}
			]
		},
		"single-three-regexp-conditional": {
			"begin": "(\\()\\?\\((\\w+(?:\\s+[[:alnum:]]+)?|\\d+)\\)",
			"end": "(\\)|(?=\\'\\'\\'))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.conditional.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.conditional.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.conditional.negative.regexp punctuation.parenthesis.conditional.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#single-three-regexp-expression"
				},
				{
					"include": "#comments-string-single-three"
				}
			]
		},
		"single-three-regexp-parentheses-non-capturing": {
			"begin": "\\(\\?:",
			"end": "(\\)|(?=\\'\\'\\'))",
			"beginCaptures": {
				"0": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.non-capturing.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.non-capturing.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#single-three-regexp-expression"
				},
				{
					"include": "#comments-string-single-three"
				}
			]
		},
		"single-three-regexp-parentheses": {
			"begin": "\\(",
			"end": "(\\)|(?=\\'\\'\\'))",
			"beginCaptures": {
				"0": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#single-three-regexp-expression"
				},
				{
					"include": "#comments-string-single-three"
				}
			]
		},
		"double-one-regexp-expression": {
			"patterns": [
				{
					"include": "#regexp-base-expression"
				},
				{
					"include": "#double-one-regexp-character-set"
				},
				{
					"include": "#double-one-regexp-comments"
				},
				{
					"include": "#regexp-flags"
				},
				{
					"include": "#double-one-regexp-named-group"
				},
				{
					"include": "#regexp-backreference"
				},
				{
					"include": "#double-one-regexp-lookahead"
				},
				{
					"include": "#double-one-regexp-lookahead-negative"
				},
				{
					"include": "#double-one-regexp-lookbehind"
				},
				{
					"include": "#double-one-regexp-lookbehind-negative"
				},
				{
					"include": "#double-one-regexp-conditional"
				},
				{
					"include": "#double-one-regexp-parentheses-non-capturing"
				},
				{
					"include": "#double-one-regexp-parentheses"
				}
			]
		},
		"double-one-regexp-character-set": {
			"patterns": [
				{
					"match": "(?x)\n  \\[ \\^? \\] (?! .*?\\])\n"
				},
				{
					"name": "meta.character.set.regexp",
					"begin": "(\\[)(\\^)?(\\])?",
					"end": "(\\]|(?=\"))|((?=(?<!\\\\)\\n))",
					"beginCaptures": {
						"1": {
							"name": "punctuation.character.set.begin.regexp constant.other.set.regexp"
						},
						"2": {
							"name": "keyword.operator.negation.regexp"
						},
						"3": {
							"name": "constant.character.set.regexp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "punctuation.character.set.end.regexp constant.other.set.regexp"
						},
						"2": {
							"name": "invalid.illegal.newline.python"
						}
					},
					"patterns": [
						{
							"include": "#regexp-charecter-set-escapes"
						},
						{
							"name": "constant.character.set.regexp",
							"match": "[^\\n]"
						}
					]
				}
			]
		},
		"double-one-regexp-named-group": {
			"name": "meta.named.regexp",
			"begin": "(?x)\n  (\\()  (\\?P <\\w+(?:\\s+[[:alnum:]]+)?>)\n",
			"end": "(\\)|(?=\"))|((?=(?<!\\\\)\\n))",
			"beginCaptures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.named.begin.regexp"
				},
				"2": {
					"name": "entity.name.tag.named.group.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.named.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#double-one-regexp-expression"
				}
			]
		},
		"double-one-regexp-comments": {
			"name": "comment.regexp",
			"begin": "\\(\\?#",
			"end": "(\\)|(?=\"))|((?=(?<!\\\\)\\n))",
			"beginCaptures": {
				"0": {
					"name": "punctuation.comment.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.comment.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#codetags"
				}
			]
		},
		"double-one-regexp-lookahead": {
			"begin": "(\\()\\?=",
			"end": "(\\)|(?=\"))|((?=(?<!\\\\)\\n))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.lookahead.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.lookahead.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.lookahead.regexp punctuation.parenthesis.lookahead.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#double-one-regexp-expression"
				}
			]
		},
		"double-one-regexp-lookahead-negative": {
			"begin": "(\\()\\?!",
			"end": "(\\)|(?=\"))|((?=(?<!\\\\)\\n))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.lookahead.negative.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.lookahead.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.lookahead.negative.regexp punctuation.parenthesis.lookahead.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#double-one-regexp-expression"
				}
			]
		},
		"double-one-regexp-lookbehind": {
			"begin": "(\\()\\?<=",
			"end": "(\\)|(?=\"))|((?=(?<!\\\\)\\n))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.lookbehind.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.lookbehind.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.lookbehind.regexp punctuation.parenthesis.lookbehind.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#double-one-regexp-expression"
				}
			]
		},
		"double-one-regexp-lookbehind-negative": {
			"begin": "(\\()\\?<!",
			"end": "(\\)|(?=\"))|((?=(?<!\\\\)\\n))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.lookbehind.negative.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.lookbehind.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.lookbehind.negative.regexp punctuation.parenthesis.lookbehind.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#double-one-regexp-expression"
				}
			]
		},
		"double-one-regexp-conditional": {
			"begin": "(\\()\\?\\((\\w+(?:\\s+[[:alnum:]]+)?|\\d+)\\)",
			"end": "(\\)|(?=\"))|((?=(?<!\\\\)\\n))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.conditional.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.conditional.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.conditional.negative.regexp punctuation.parenthesis.conditional.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#double-one-regexp-expression"
				}
			]
		},
		"double-one-regexp-parentheses-non-capturing": {
			"begin": "\\(\\?:",
			"end": "(\\)|(?=\"))|((?=(?<!\\\\)\\n))",
			"beginCaptures": {
				"0": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.non-capturing.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.non-capturing.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#double-one-regexp-expression"
				}
			]
		},
		"double-one-regexp-parentheses": {
			"begin": "\\(",
			"end": "(\\)|(?=\"))|((?=(?<!\\\\)\\n))",
			"beginCaptures": {
				"0": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#double-one-regexp-expression"
				}
			]
		},
		"double-three-regexp-expression": {
			"patterns": [
				{
					"include": "#regexp-base-expression"
				},
				{
					"include": "#double-three-regexp-character-set"
				},
				{
					"include": "#double-three-regexp-comments"
				},
				{
					"include": "#regexp-flags"
				},
				{
					"include": "#double-three-regexp-named-group"
				},
				{
					"include": "#regexp-backreference"
				},
				{
					"include": "#double-three-regexp-lookahead"
				},
				{
					"include": "#double-three-regexp-lookahead-negative"
				},
				{
					"include": "#double-three-regexp-lookbehind"
				},
				{
					"include": "#double-three-regexp-lookbehind-negative"
				},
				{
					"include": "#double-three-regexp-conditional"
				},
				{
					"include": "#double-three-regexp-parentheses-non-capturing"
				},
				{
					"include": "#double-three-regexp-parentheses"
				},
				{
					"include": "#comments-string-double-three"
				}
			]
		},
		"double-three-regexp-character-set": {
			"patterns": [
				{
					"match": "(?x)\n  \\[ \\^? \\] (?! .*?\\])\n"
				},
				{
					"name": "meta.character.set.regexp",
					"begin": "(\\[)(\\^)?(\\])?",
					"end": "(\\]|(?=\"\"\"))",
					"beginCaptures": {
						"1": {
							"name": "punctuation.character.set.begin.regexp constant.other.set.regexp"
						},
						"2": {
							"name": "keyword.operator.negation.regexp"
						},
						"3": {
							"name": "constant.character.set.regexp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "punctuation.character.set.end.regexp constant.other.set.regexp"
						},
						"2": {
							"name": "invalid.illegal.newline.python"
						}
					},
					"patterns": [
						{
							"include": "#regexp-charecter-set-escapes"
						},
						{
							"name": "constant.character.set.regexp",
							"match": "[^\\n]"
						}
					]
				}
			]
		},
		"double-three-regexp-named-group": {
			"name": "meta.named.regexp",
			"begin": "(?x)\n  (\\()  (\\?P <\\w+(?:\\s+[[:alnum:]]+)?>)\n",
			"end": "(\\)|(?=\"\"\"))",
			"beginCaptures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.named.begin.regexp"
				},
				"2": {
					"name": "entity.name.tag.named.group.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.named.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#double-three-regexp-expression"
				},
				{
					"include": "#comments-string-double-three"
				}
			]
		},
		"double-three-regexp-comments": {
			"name": "comment.regexp",
			"begin": "\\(\\?#",
			"end": "(\\)|(?=\"\"\"))",
			"beginCaptures": {
				"0": {
					"name": "punctuation.comment.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.comment.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#codetags"
				}
			]
		},
		"double-three-regexp-lookahead": {
			"begin": "(\\()\\?=",
			"end": "(\\)|(?=\"\"\"))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.lookahead.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.lookahead.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.lookahead.regexp punctuation.parenthesis.lookahead.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#double-three-regexp-expression"
				},
				{
					"include": "#comments-string-double-three"
				}
			]
		},
		"double-three-regexp-lookahead-negative": {
			"begin": "(\\()\\?!",
			"end": "(\\)|(?=\"\"\"))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.lookahead.negative.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.lookahead.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.lookahead.negative.regexp punctuation.parenthesis.lookahead.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#double-three-regexp-expression"
				},
				{
					"include": "#comments-string-double-three"
				}
			]
		},
		"double-three-regexp-lookbehind": {
			"begin": "(\\()\\?<=",
			"end": "(\\)|(?=\"\"\"))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.lookbehind.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.lookbehind.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.lookbehind.regexp punctuation.parenthesis.lookbehind.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#double-three-regexp-expression"
				},
				{
					"include": "#comments-string-double-three"
				}
			]
		},
		"double-three-regexp-lookbehind-negative": {
			"begin": "(\\()\\?<!",
			"end": "(\\)|(?=\"\"\"))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.lookbehind.negative.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.lookbehind.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.lookbehind.negative.regexp punctuation.parenthesis.lookbehind.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#double-three-regexp-expression"
				},
				{
					"include": "#comments-string-double-three"
				}
			]
		},
		"double-three-regexp-conditional": {
			"begin": "(\\()\\?\\((\\w+(?:\\s+[[:alnum:]]+)?|\\d+)\\)",
			"end": "(\\)|(?=\"\"\"))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.conditional.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.conditional.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.conditional.negative.regexp punctuation.parenthesis.conditional.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#double-three-regexp-expression"
				},
				{
					"include": "#comments-string-double-three"
				}
			]
		},
		"double-three-regexp-parentheses-non-capturing": {
			"begin": "\\(\\?:",
			"end": "(\\)|(?=\"\"\"))",
			"beginCaptures": {
				"0": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.non-capturing.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.non-capturing.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#double-three-regexp-expression"
				},
				{
					"include": "#comments-string-double-three"
				}
			]
		},
		"double-three-regexp-parentheses": {
			"begin": "\\(",
			"end": "(\\)|(?=\"\"\"))",
			"beginCaptures": {
				"0": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#double-three-regexp-expression"
				},
				{
					"include": "#comments-string-double-three"
				}
			]
		},
		"regexp-single-one-line": {
			"name": "string.regexp.quoted.single.python",
			"begin": "\\b(([uU]r)|([bB]r)|(r[bB]?))(\\')",
			"end": "(\\')|(?<!\\\\)(\\n)",
			"beginCaptures": {
				"2": {
					"name": "invalid.deprecated.prefix.python"
				},
				"3": {
					"name": "storage.type.string.python"
				},
				"4": {
					"name": "storage.type.string.python"
				},
				"5": {
					"name": "punctuation.definition.string.begin.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.python"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#single-one-regexp-expression"
				}
			]
		},
		"regexp-single-three-line": {
			"name": "string.regexp.quoted.multi.python",
			"begin": "\\b(([uU]r)|([bB]r)|(r[bB]?))(\\'\\'\\')",
			"end": "(\\'\\'\\')",
			"beginCaptures": {
				"2": {
					"name": "invalid.deprecated.prefix.python"
				},
				"3": {
					"name": "storage.type.string.python"
				},
				"4": {
					"name": "storage.type.string.python"
				},
				"5": {
					"name": "punctuation.definition.string.begin.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.python"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#single-three-regexp-expression"
				}
			]
		},
		"regexp-double-one-line": {
			"name": "string.regexp.quoted.single.python",
			"begin": "\\b(([uU]r)|([bB]r)|(r[bB]?))(\")",
			"end": "(\")|(?<!\\\\)(\\n)",
			"beginCaptures": {
				"2": {
					"name": "invalid.deprecated.prefix.python"
				},
				"3": {
					"name": "storage.type.string.python"
				},
				"4": {
					"name": "storage.type.string.python"
				},
				"5": {
					"name": "punctuation.definition.string.begin.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.python"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#double-one-regexp-expression"
				}
			]
		},
		"regexp-double-three-line": {
			"name": "string.regexp.quoted.multi.python",
			"begin": "\\b(([uU]r)|([bB]r)|(r[bB]?))(\"\"\")",
			"end": "(\"\"\")",
			"beginCaptures": {
				"2": {
					"name": "invalid.deprecated.prefix.python"
				},
				"3": {
					"name": "storage.type.string.python"
				},
				"4": {
					"name": "storage.type.string.python"
				},
				"5": {
					"name": "punctuation.definition.string.begin.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.python"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#double-three-regexp-expression"
				}
			]
		},
		"string-raw-quoted-single-line": {
			"name": "string.quoted.raw.single.python",
			"begin": "\\b(([uU]R)|(R))((['\"]))",
			"end": "(\\4)|((?<!\\\\)\\n)",
			"beginCaptures": {
				"2": {
					"name": "invalid.deprecated.prefix.python"
				},
				"3": {
					"name": "storage.type.string.python"
				},
				"4": {
					"name": "punctuation.definition.string.begin.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.python"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#string-single-bad-brace1-formatting-raw"
				},
				{
					"include": "#string-single-bad-brace2-formatting-raw"
				},
				{
					"include": "#string-raw-guts"
				}
			]
		},
		"string-bin-quoted-single-line": {
			"name": "string.quoted.binary.single.python",
			"begin": "(\\b[bB])((['\"]))",
			"end": "(\\2)|((?<!\\\\)\\n)",
			"beginCaptures": {
				"1": {
					"name": "storage.type.string.python"
				},
				"2": {
					"name": "punctuation.definition.string.begin.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.python"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#string-entity"
				}
			]
		},
		"string-raw-bin-quoted-single-line": {
			"name": "string.quoted.raw.binary.single.python",
			"begin": "(\\b(?:R[bB]|[bB]R))((['\"]))",
			"end": "(\\2)|((?<!\\\\)\\n)",
			"beginCaptures": {
				"1": {
					"name": "storage.type.string.python"
				},
				"2": {
					"name": "punctuation.definition.string.begin.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.python"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#string-raw-bin-guts"
				}
			]
		},
		"string-quoted-single-line": {
			"name": "string.quoted.single.python",
			"begin": "(?:\\b([rR])(?=[uU]))?([uU])?((['\"]))",
			"end": "(\\3)|((?<!\\\\)\\n)",
			"beginCaptures": {
				"1": {
					"name": "invalid.illegal.prefix.python"
				},
				"2": {
					"name": "storage.type.string.python"
				},
				"3": {
					"name": "punctuation.definition.string.begin.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.python"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#string-single-bad-brace1-formatting-unicode"
				},
				{
					"include": "#string-single-bad-brace2-formatting-unicode"
				},
				{
					"include": "#string-unicode-guts"
				}
			]
		},
		"string-single-bad-brace1-formatting-unicode": {
			"comment": "template using {% ... %}",
			"begin": "(?x)\n    (?= \\{%\n          ( .*? (?!(['\"])|((?<!\\\\)\\n)) )\n        %\\}\n    )\n",
			"end": "(?=(['\"])|((?<!\\\\)\\n))",
			"patterns": [
				{
					"include": "#escape-sequence-unicode"
				},
				{
					"include": "#escape-sequence"
				},
				{
					"include": "#string-line-continuation"
				}
			]
		},
		"string-single-bad-brace1-formatting-raw": {
			"comment": "template using {% ... %}",
			"begin": "(?x)\n    (?= \\{%\n          ( .*? (?!(['\"])|((?<!\\\\)\\n)) )\n        %\\}\n    )\n",
			"end": "(?=(['\"])|((?<!\\\\)\\n))",
			"patterns": [
				{
					"include": "#string-consume-escape"
				}
			]
		},
		"string-single-bad-brace2-formatting-unicode": {
			"comment": "odd format or format-like syntax",
			"begin": "(?x)\n    (?!\\{\\{)\n    (?= \\{ (\n              \\w*? (?!(['\"])|((?<!\\\\)\\n)) [^!:\\.\\[}\\w]\n           )\n        .*?(?!(['\"])|((?<!\\\\)\\n))\n        \\}\n    )\n",
			"end": "(?=(['\"])|((?<!\\\\)\\n))",
			"patterns": [
				{
					"include": "#escape-sequence-unicode"
				},
				{
					"include": "#string-entity"
				}
			]
		},
		"string-single-bad-brace2-formatting-raw": {
			"comment": "odd format or format-like syntax",
			"begin": "(?x)\n    (?!\\{\\{)\n    (?= \\{ (\n              \\w*? (?!(['\"])|((?<!\\\\)\\n)) [^!:\\.\\[}\\w]\n           )\n        .*?(?!(['\"])|((?<!\\\\)\\n))\n        \\}\n    )\n",
			"end": "(?=(['\"])|((?<!\\\\)\\n))",
			"patterns": [
				{
					"include": "#string-consume-escape"
				},
				{
					"include": "#string-formatting"
				}
			]
		},
		"string-raw-quoted-multi-line": {
			"name": "string.quoted.raw.multi.python",
			"begin": "\\b(([uU]R)|(R))('''|\"\"\")",
			"end": "(\\4)",
			"beginCaptures": {
				"2": {
					"name": "invalid.deprecated.prefix.python"
				},
				"3": {
					"name": "storage.type.string.python"
				},
				"4": {
					"name": "punctuation.definition.string.begin.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.python"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#string-multi-bad-brace1-formatting-raw"
				},
				{
					"include": "#string-multi-bad-brace2-formatting-raw"
				},
				{
					"include": "#string-raw-guts"
				}
			]
		},
		"string-bin-quoted-multi-line": {
			"name": "string.quoted.binary.multi.python",
			"begin": "(\\b[bB])('''|\"\"\")",
			"end": "(\\2)",
			"beginCaptures": {
				"1": {
					"name": "storage.type.string.python"
				},
				"2": {
					"name": "punctuation.definition.string.begin.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.python"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#string-entity"
				}
			]
		},
		"string-raw-bin-quoted-multi-line": {
			"name": "string.quoted.raw.binary.multi.python",
			"begin": "(\\b(?:R[bB]|[bB]R))('''|\"\"\")",
			"end": "(\\2)",
			"beginCaptures": {
				"1": {
					"name": "storage.type.string.python"
				},
				"2": {
					"name": "punctuation.definition.string.begin.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.python"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#string-raw-bin-guts"
				}
			]
		},
		"string-quoted-multi-line": {
			"name": "string.quoted.multi.python",
			"begin": "(?:\\b([rR])(?=[uU]))?([uU])?('''|\"\"\")",
			"end": "(\\3)",
			"beginCaptures": {
				"1": {
					"name": "invalid.illegal.prefix.python"
				},
				"2": {
					"name": "storage.type.string.python"
				},
				"3": {
					"name": "punctuation.definition.string.begin.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.python"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#string-multi-bad-brace1-formatting-unicode"
				},
				{
					"include": "#string-multi-bad-brace2-formatting-unicode"
				},
				{
					"include": "#string-unicode-guts"
				}
			]
		},
		"string-multi-bad-brace1-formatting-unicode": {
			"comment": "template using {% ... %}",
			"begin": "(?x)\n    (?= \\{%\n          ( .*? (?!'''|\"\"\") )\n        %\\}\n    )\n",
			"end": "(?='''|\"\"\")",
			"patterns": [
				{
					"include": "#escape-sequence-unicode"
				},
				{
					"include": "#escape-sequence"
				},
				{
					"include": "#string-line-continuation"
				}
			]
		},
		"string-multi-bad-brace1-formatting-raw": {
			"comment": "template using {% ... %}",
			"begin": "(?x)\n    (?= \\{%\n          ( .*? (?!'''|\"\"\") )\n        %\\}\n    )\n",
			"end": "(?='''|\"\"\")",
			"patterns": [
				{
					"include": "#string-consume-escape"
				}
			]
		},
		"string-multi-bad-brace2-formatting-unicode": {
			"comment": "odd format or format-like syntax",
			"begin": "(?x)\n    (?!\\{\\{)\n    (?= \\{ (\n              \\w*? (?!'''|\"\"\") [^!:\\.\\[}\\w]\n           )\n        .*?(?!'''|\"\"\")\n        \\}\n    )\n",
			"end": "(?='''|\"\"\")",
			"patterns": [
				{
					"include": "#escape-sequence-unicode"
				},
				{
					"include": "#string-entity"
				}
			]
		},
		"string-multi-bad-brace2-formatting-raw": {
			"comment": "odd format or format-like syntax",
			"begin": "(?x)\n    (?!\\{\\{)\n    (?= \\{ (\n              \\w*? (?!'''|\"\"\") [^!:\\.\\[}\\w]\n           )\n        .*?(?!'''|\"\"\")\n        \\}\n    )\n",
			"end": "(?='''|\"\"\")",
			"patterns": [
				{
					"include": "#string-consume-escape"
				},
				{
					"include": "#string-formatting"
				}
			]
		},
		"fstring-fnorm-quoted-single-line": {
			"name": "meta.fstring.python",
			"begin": "(\\b[fF])([bBuU])?((['\"]))",
			"end": "(\\3)|((?<!\\\\)\\n)",
			"beginCaptures": {
				"1": {
					"name": "string.interpolated.python string.quoted.single.python storage.type.string.python"
				},
				"2": {
					"name": "invalid.illegal.prefix.python"
				},
				"3": {
					"name": "punctuation.definition.string.begin.python string.interpolated.python string.quoted.single.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.python string.interpolated.python string.quoted.single.python"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#fstring-guts"
				},
				{
					"include": "#fstring-illegal-single-brace"
				},
				{
					"include": "#fstring-single-brace"
				},
				{
					"include": "#fstring-single-core"
				}
			]
		},
		"fstring-normf-quoted-single-line": {
			"name": "meta.fstring.python",
			"begin": "(\\b[bBuU])([fF])((['\"]))",
			"end": "(\\3)|((?<!\\\\)\\n)",
			"beginCaptures": {
				"1": {
					"name": "invalid.illegal.prefix.python"
				},
				"2": {
					"name": "string.interpolated.python string.quoted.single.python storage.type.string.python"
				},
				"3": {
					"name": "punctuation.definition.string.begin.python string.quoted.single.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.python string.interpolated.python string.quoted.single.python"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#fstring-guts"
				},
				{
					"include": "#fstring-illegal-single-brace"
				},
				{
					"include": "#fstring-single-brace"
				},
				{
					"include": "#fstring-single-core"
				}
			]
		},
		"fstring-raw-quoted-single-line": {
			"name": "meta.fstring.python",
			"begin": "(\\b(?:[rR][fF]|[fF][rR]))((['\"]))",
			"end": "(\\2)|((?<!\\\\)\\n)",
			"beginCaptures": {
				"1": {
					"name": "string.interpolated.python string.quoted.raw.single.python storage.type.string.python"
				},
				"2": {
					"name": "punctuation.definition.string.begin.python string.quoted.raw.single.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.python string.interpolated.python string.quoted.raw.single.python"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#fstring-raw-guts"
				},
				{
					"include": "#fstring-illegal-single-brace"
				},
				{
					"include": "#fstring-single-brace"
				},
				{
					"include": "#fstring-raw-single-core"
				}
			]
		},
		"fstring-single-core": {
			"name": "string.interpolated.python string.quoted.single.python",
			"match": "(?x)\n  (.+?)\n    (\n      (?# .* and .*? in multi-line match need special handling of\n        newlines otherwise SublimeText and Atom will match slightly\n        differently.\n\n        The guard for newlines has to be separate from the\n        lookahead because of special $ matching rule.)\n      ($\\n?)\n      |\n      (?=[\\\\\\}\\{]|(['\"])|((?<!\\\\)\\n))\n    )\n  (?# due to how multiline regexps are matched we need a special case\n    for matching a newline character)\n  | \\n\n"
		},
		"fstring-raw-single-core": {
			"name": "string.interpolated.python string.quoted.raw.single.python",
			"match": "(?x)\n  (.+?)\n    (\n      (?# .* and .*? in multi-line match need special handling of\n        newlines otherwise SublimeText and Atom will match slightly\n        differently.\n\n        The guard for newlines has to be separate from the\n        lookahead because of special $ matching rule.)\n      ($\\n?)\n      |\n      (?=[\\\\\\}\\{]|(['\"])|((?<!\\\\)\\n))\n    )\n  (?# due to how multiline regexps are matched we need a special case\n    for matching a newline character)\n  | \\n\n"
		},
		"fstring-single-brace": {
			"comment": "value interpolation using { ... }",
			"begin": "(\\{)",
			"end": "(?x)\n  (\\})|(?=\\n)\n",
			"beginCaptures": {
				"1": {
					"name": "constant.character.format.placeholder.other.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "constant.character.format.placeholder.other.python"
				}
			},
			"patterns": [
				{
					"include": "#fstring-terminator-single"
				},
				{
					"include": "#f-expression"
				}
			]
		},
		"fstring-terminator-single": {
			"patterns": [
				{
					"name": "storage.type.format.python",
					"match": "(=(![rsa])?)(?=})"
				},
				{
					"name": "storage.type.format.python",
					"match": "(=?![rsa])(?=})"
				},
				{
					"match": "(?x)\n  ( (?: =?) (?: ![rsa])? )\n    ( : \\w? [<>=^]? [-+ ]? \\#?\n      \\d* ,? (\\.\\d+)? [bcdeEfFgGnosxX%]? )(?=})\n",
					"captures": {
						"1": {
							"name": "storage.type.format.python"
						},
						"2": {
							"name": "storage.type.format.python"
						}
					}
				},
				{
					"include": "#fstring-terminator-single-tail"
				}
			]
		},
		"fstring-terminator-single-tail": {
			"begin": "((?:=?)(?:![rsa])?)(:)(?=.*?{)",
			"end": "(?=})|(?=\\n)",
			"beginCaptures": {
				"1": {
					"name": "storage.type.format.python"
				},
				"2": {
					"name": "storage.type.format.python"
				}
			},
			"patterns": [
				{
					"include": "#fstring-illegal-single-brace"
				},
				{
					"include": "#fstring-single-brace"
				},
				{
					"name": "storage.type.format.python",
					"match": "([bcdeEfFgGnosxX%])(?=})"
				},
				{
					"name": "storage.type.format.python",
					"match": "(\\.\\d+)"
				},
				{
					"name": "storage.type.format.python",
					"match": "(,)"
				},
				{
					"name": "storage.type.format.python",
					"match": "(\\d+)"
				},
				{
					"name": "storage.type.format.python",
					"match": "(\\#)"
				},
				{
					"name": "storage.type.format.python",
					"match": "([-+ ])"
				},
				{
					"name": "storage.type.format.python",
					"match": "([<>=^])"
				},
				{
					"name": "storage.type.format.python",
					"match": "(\\w)"
				}
			]
		},
		"fstring-fnorm-quoted-multi-line": {
			"name": "meta.fstring.python",
			"begin": "(\\b[fF])([bBuU])?('''|\"\"\")",
			"end": "(\\3)",
			"beginCaptures": {
				"1": {
					"name": "string.interpolated.python string.quoted.multi.python storage.type.string.python"
				},
				"2": {
					"name": "invalid.illegal.prefix.python"
				},
				"3": {
					"name": "punctuation.definition.string.begin.python string.interpolated.python string.quoted.multi.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.python string.interpolated.python string.quoted.multi.python"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#fstring-guts"
				},
				{
					"include": "#fstring-illegal-multi-brace"
				},
				{
					"include": "#fstring-multi-brace"
				},
				{
					"include": "#fstring-multi-core"
				}
			]
		},
		"fstring-normf-quoted-multi-line": {
			"name": "meta.fstring.python",
			"begin": "(\\b[bBuU])([fF])('''|\"\"\")",
			"end": "(\\3)",
			"beginCaptures": {
				"1": {
					"name": "invalid.illegal.prefix.python"
				},
				"2": {
					"name": "string.interpolated.python string.quoted.multi.python storage.type.string.python"
				},
				"3": {
					"name": "punctuation.definition.string.begin.python string.quoted.multi.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.python string.interpolated.python string.quoted.multi.python"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#fstring-guts"
				},
				{
					"include": "#fstring-illegal-multi-brace"
				},
				{
					"include": "#fstring-multi-brace"
				},
				{
					"include": "#fstring-multi-core"
				}
			]
		},
		"fstring-raw-quoted-multi-line": {
			"name": "meta.fstring.python",
			"begin": "(\\b(?:[rR][fF]|[fF][rR]))('''|\"\"\")",
			"end": "(\\2)",
			"beginCaptures": {
				"1": {
					"name": "string.interpolated.python string.quoted.raw.multi.python storage.type.string.python"
				},
				"2": {
					"name": "punctuation.definition.string.begin.python string.quoted.raw.multi.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.python string.interpolated.python string.quoted.raw.multi.python"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#fstring-raw-guts"
				},
				{
					"include": "#fstring-illegal-multi-brace"
				},
				{
					"include": "#fstring-multi-brace"
				},
				{
					"include": "#fstring-raw-multi-core"
				}
			]
		},
		"fstring-multi-core": {
			"name": "string.interpolated.python string.quoted.multi.python",
			"match": "(?x)\n  (.+?)\n    (\n      (?# .* and .*? in multi-line match need special handling of\n        newlines otherwise SublimeText and Atom will match slightly\n        differently.\n\n        The guard for newlines has to be separate from the\n        lookahead because of special $ matching rule.)\n      ($\\n?)\n      |\n      (?=[\\\\\\}\\{]|'''|\"\"\")\n    )\n  (?# due to how multiline regexps are matched we need a special case\n    for matching a newline character)\n  | \\n\n"
		},
		"fstring-raw-multi-core": {
			"name": "string.interpolated.python string.quoted.raw.multi.python",
			"match": "(?x)\n  (.+?)\n    (\n      (?# .* and .*? in multi-line match need special handling of\n        newlines otherwise SublimeText and Atom will match slightly\n        differently.\n\n        The guard for newlines has to be separate from the\n        lookahead because of special $ matching rule.)\n      ($\\n?)\n      |\n      (?=[\\\\\\}\\{]|'''|\"\"\")\n    )\n  (?# due to how multiline regexps are matched we need a special case\n    for matching a newline character)\n  | \\n\n"
		},
		"fstring-multi-brace": {
			"comment": "value interpolation using { ... }",
			"begin": "(\\{)",
			"end": "(?x)\n  (\\})\n",
			"beginCaptures": {
				"1": {
					"name": "constant.character.format.placeholder.other.python"
				}
			},
			"endCaptures": {
				"1": {
					"name": "constant.character.format.placeholder.other.python"
				}
			},
			"patterns": [
				{
					"include": "#fstring-terminator-multi"
				},
				{
					"include": "#f-expression"
				}
			]
		},
		"fstring-terminator-multi": {
			"patterns": [
				{
					"name": "storage.type.format.python",
					"match": "(=(![rsa])?)(?=})"
				},
				{
					"name": "storage.type.format.python",
					"match": "(=?![rsa])(?=})"
				},
				{
					"match": "(?x)\n  ( (?: =?) (?: ![rsa])? )\n    ( : \\w? [<>=^]? [-+ ]? \\#?\n      \\d* ,? (\\.\\d+)? [bcdeEfFgGnosxX%]? )(?=})\n",
					"captures": {
						"1": {
							"name": "storage.type.format.python"
						},
						"2": {
							"name": "storage.type.format.python"
						}
					}
				},
				{
					"include": "#fstring-terminator-multi-tail"
				}
			]
		},
		"fstring-terminator-multi-tail": {
			"begin": "((?:=?)(?:![rsa])?)(:)(?=.*?{)",
			"end": "(?=})",
			"beginCaptures": {
				"1": {
					"name": "storage.type.format.python"
				},
				"2": {
					"name": "storage.type.format.python"
				}
			},
			"patterns": [
				{
					"include": "#fstring-illegal-multi-brace"
				},
				{
					"include": "#fstring-multi-brace"
				},
				{
					"name": "storage.type.format.python",
					"match": "([bcdeEfFgGnosxX%])(?=})"
				},
				{
					"name": "storage.type.format.python",
					"match": "(\\.\\d+)"
				},
				{
					"name": "storage.type.format.python",
					"match": "(,)"
				},
				{
					"name": "storage.type.format.python",
					"match": "(\\d+)"
				},
				{
					"name": "storage.type.format.python",
					"match": "(\\#)"
				},
				{
					"name": "storage.type.format.python",
					"match": "([-+ ])"
				},
				{
					"name": "storage.type.format.python",
					"match": "([<>=^])"
				},
				{
					"name": "storage.type.format.python",
					"match": "(\\w)"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/python/syntaxes/MagicRegExp.tmLanguage.json]---
Location: vscode-main/extensions/python/syntaxes/MagicRegExp.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/MagicStack/MagicPython/blob/master/grammars/MagicRegExp.tmLanguage",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/MagicStack/MagicPython/commit/c9b3409deb69acec31bbf7913830e93a046b30cc",
	"name": "MagicRegExp",
	"scopeName": "source.regexp.python",
	"patterns": [
		{
			"include": "#regexp-expression"
		}
	],
	"repository": {
		"regexp-base-expression": {
			"patterns": [
				{
					"include": "#regexp-quantifier"
				},
				{
					"include": "#regexp-base-common"
				}
			]
		},
		"fregexp-base-expression": {
			"patterns": [
				{
					"include": "#fregexp-quantifier"
				},
				{
					"include": "#fstring-formatting-braces"
				},
				{
					"match": "\\{.*?\\}"
				},
				{
					"include": "#regexp-base-common"
				}
			]
		},
		"fstring-formatting-braces": {
			"patterns": [
				{
					"comment": "empty braces are illegal",
					"match": "({)(\\s*?)(})",
					"captures": {
						"1": {
							"name": "constant.character.format.placeholder.other.python"
						},
						"2": {
							"name": "invalid.illegal.brace.python"
						},
						"3": {
							"name": "constant.character.format.placeholder.other.python"
						}
					}
				},
				{
					"name": "constant.character.escape.python",
					"match": "({{|}})"
				}
			]
		},
		"regexp-base-common": {
			"patterns": [
				{
					"name": "support.other.match.any.regexp",
					"match": "\\."
				},
				{
					"name": "support.other.match.begin.regexp",
					"match": "\\^"
				},
				{
					"name": "support.other.match.end.regexp",
					"match": "\\$"
				},
				{
					"name": "keyword.operator.quantifier.regexp",
					"match": "[+*?]\\??"
				},
				{
					"name": "keyword.operator.disjunction.regexp",
					"match": "\\|"
				},
				{
					"include": "#regexp-escape-sequence"
				}
			]
		},
		"regexp-quantifier": {
			"name": "keyword.operator.quantifier.regexp",
			"match": "(?x)\n  \\{(\n    \\d+ | \\d+,(\\d+)? | ,\\d+\n  )\\}\n"
		},
		"fregexp-quantifier": {
			"name": "keyword.operator.quantifier.regexp",
			"match": "(?x)\n  \\{\\{(\n    \\d+ | \\d+,(\\d+)? | ,\\d+\n  )\\}\\}\n"
		},
		"regexp-backreference-number": {
			"name": "meta.backreference.regexp",
			"match": "(\\\\[1-9]\\d?)",
			"captures": {
				"1": {
					"name": "entity.name.tag.backreference.regexp"
				}
			}
		},
		"regexp-backreference": {
			"name": "meta.backreference.named.regexp",
			"match": "(?x)\n  (\\()  (\\?P= \\w+(?:\\s+[[:alnum:]]+)?)  (\\))\n",
			"captures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.backreference.named.begin.regexp"
				},
				"2": {
					"name": "entity.name.tag.named.backreference.regexp"
				},
				"3": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.backreference.named.end.regexp"
				}
			}
		},
		"regexp-flags": {
			"name": "storage.modifier.flag.regexp",
			"match": "\\(\\?[aiLmsux]+\\)"
		},
		"regexp-escape-special": {
			"name": "support.other.escape.special.regexp",
			"match": "\\\\([AbBdDsSwWZ])"
		},
		"regexp-escape-character": {
			"name": "constant.character.escape.regexp",
			"match": "(?x)\n  \\\\ (\n        x[0-9A-Fa-f]{2}\n        | 0[0-7]{1,2}\n        | [0-7]{3}\n     )\n"
		},
		"regexp-escape-unicode": {
			"name": "constant.character.unicode.regexp",
			"match": "(?x)\n  \\\\ (\n        u[0-9A-Fa-f]{4}\n        | U[0-9A-Fa-f]{8}\n     )\n"
		},
		"regexp-escape-catchall": {
			"name": "constant.character.escape.regexp",
			"match": "\\\\(.|\\n)"
		},
		"regexp-escape-sequence": {
			"patterns": [
				{
					"include": "#regexp-escape-special"
				},
				{
					"include": "#regexp-escape-character"
				},
				{
					"include": "#regexp-escape-unicode"
				},
				{
					"include": "#regexp-backreference-number"
				},
				{
					"include": "#regexp-escape-catchall"
				}
			]
		},
		"regexp-charecter-set-escapes": {
			"patterns": [
				{
					"name": "constant.character.escape.regexp",
					"match": "\\\\[abfnrtv\\\\]"
				},
				{
					"include": "#regexp-escape-special"
				},
				{
					"name": "constant.character.escape.regexp",
					"match": "\\\\([0-7]{1,3})"
				},
				{
					"include": "#regexp-escape-character"
				},
				{
					"include": "#regexp-escape-unicode"
				},
				{
					"include": "#regexp-escape-catchall"
				}
			]
		},
		"codetags": {
			"match": "(?:\\b(NOTE|XXX|HACK|FIXME|BUG|TODO)\\b)",
			"captures": {
				"1": {
					"name": "keyword.codetag.notation.python"
				}
			}
		},
		"regexp-expression": {
			"patterns": [
				{
					"include": "#regexp-base-expression"
				},
				{
					"include": "#regexp-character-set"
				},
				{
					"include": "#regexp-comments"
				},
				{
					"include": "#regexp-flags"
				},
				{
					"include": "#regexp-named-group"
				},
				{
					"include": "#regexp-backreference"
				},
				{
					"include": "#regexp-lookahead"
				},
				{
					"include": "#regexp-lookahead-negative"
				},
				{
					"include": "#regexp-lookbehind"
				},
				{
					"include": "#regexp-lookbehind-negative"
				},
				{
					"include": "#regexp-conditional"
				},
				{
					"include": "#regexp-parentheses-non-capturing"
				},
				{
					"include": "#regexp-parentheses"
				}
			]
		},
		"regexp-character-set": {
			"patterns": [
				{
					"match": "(?x)\n  \\[ \\^? \\] (?! .*?\\])\n"
				},
				{
					"name": "meta.character.set.regexp",
					"begin": "(\\[)(\\^)?(\\])?",
					"end": "(\\])",
					"beginCaptures": {
						"1": {
							"name": "punctuation.character.set.begin.regexp constant.other.set.regexp"
						},
						"2": {
							"name": "keyword.operator.negation.regexp"
						},
						"3": {
							"name": "constant.character.set.regexp"
						}
					},
					"endCaptures": {
						"1": {
							"name": "punctuation.character.set.end.regexp constant.other.set.regexp"
						},
						"2": {
							"name": "invalid.illegal.newline.python"
						}
					},
					"patterns": [
						{
							"include": "#regexp-charecter-set-escapes"
						},
						{
							"name": "constant.character.set.regexp",
							"match": "[^\\n]"
						}
					]
				}
			]
		},
		"regexp-named-group": {
			"name": "meta.named.regexp",
			"begin": "(?x)\n  (\\()  (\\?P <\\w+(?:\\s+[[:alnum:]]+)?>)\n",
			"end": "(\\))",
			"beginCaptures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.named.begin.regexp"
				},
				"2": {
					"name": "entity.name.tag.named.group.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.named.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#regexp-expression"
				}
			]
		},
		"regexp-comments": {
			"name": "comment.regexp",
			"begin": "\\(\\?#",
			"end": "(\\))",
			"beginCaptures": {
				"0": {
					"name": "punctuation.comment.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.comment.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#codetags"
				}
			]
		},
		"regexp-lookahead": {
			"begin": "(\\()\\?=",
			"end": "(\\))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.lookahead.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.lookahead.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.lookahead.regexp punctuation.parenthesis.lookahead.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#regexp-expression"
				}
			]
		},
		"regexp-lookahead-negative": {
			"begin": "(\\()\\?!",
			"end": "(\\))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.lookahead.negative.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.lookahead.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.lookahead.negative.regexp punctuation.parenthesis.lookahead.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#regexp-expression"
				}
			]
		},
		"regexp-lookbehind": {
			"begin": "(\\()\\?<=",
			"end": "(\\))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.lookbehind.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.lookbehind.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.lookbehind.regexp punctuation.parenthesis.lookbehind.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#regexp-expression"
				}
			]
		},
		"regexp-lookbehind-negative": {
			"begin": "(\\()\\?<!",
			"end": "(\\))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.lookbehind.negative.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.lookbehind.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.lookbehind.negative.regexp punctuation.parenthesis.lookbehind.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#regexp-expression"
				}
			]
		},
		"regexp-conditional": {
			"begin": "(\\()\\?\\((\\w+(?:\\s+[[:alnum:]]+)?|\\d+)\\)",
			"end": "(\\))",
			"beginCaptures": {
				"0": {
					"name": "keyword.operator.conditional.regexp"
				},
				"1": {
					"name": "punctuation.parenthesis.conditional.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "keyword.operator.conditional.negative.regexp punctuation.parenthesis.conditional.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#regexp-expression"
				}
			]
		},
		"regexp-parentheses-non-capturing": {
			"begin": "\\(\\?:",
			"end": "(\\))",
			"beginCaptures": {
				"0": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.non-capturing.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.non-capturing.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#regexp-expression"
				}
			]
		},
		"regexp-parentheses": {
			"begin": "\\(",
			"end": "(\\))",
			"beginCaptures": {
				"0": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.begin.regexp"
				}
			},
			"endCaptures": {
				"1": {
					"name": "support.other.parenthesis.regexp punctuation.parenthesis.end.regexp"
				},
				"2": {
					"name": "invalid.illegal.newline.python"
				}
			},
			"patterns": [
				{
					"include": "#regexp-expression"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/r/.vscodeignore]---
Location: vscode-main/extensions/r/.vscodeignore

```text
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/r/cgmanifest.json]---
Location: vscode-main/extensions/r/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "REditorSupport/vscode-R",
					"repositoryUrl": "https://github.com/REditorSupport/vscode-R-syntax",
					"commitHash": "b199996070723eefbe7a61e0384b2ae4768eb7f0"
				}
			},
			"license": "MIT",
			"version": "0.1.1"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/r/language-configuration.json]---
Location: vscode-main/extensions/r/language-configuration.json

```json
{
	"comments": {
		"lineComment": "#"
	},
	"brackets": [
		["{", "}"],
		["[", "]"],
		["(", ")"]
	],
	"autoClosingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["`", "`"],
		{ "open": "\"", "close": "\"", "notIn": ["string"] },
		{ "open": "'", "close": "'", "notIn": ["string", "comment"] },
		{ "open": "%", "close": "%", "notIn": ["string", "comment"] }
	],
	"surroundingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["`", "`"],
		["\"", "\""],
		["'", "'"]
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/r/package.json]---
Location: vscode-main/extensions/r/package.json

```json
{
  "name": "r",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin REditorSupport/vscode-R-syntax syntaxes/r.json ./syntaxes/r.tmLanguage.json"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "r",
        "extensions": [
          ".r",
          ".rhistory",
          ".rprofile",
          ".rt"
        ],
        "aliases": [
          "R",
          "r"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "r",
        "scopeName": "source.r",
        "path": "./syntaxes/r.tmLanguage.json"
      }
    ]
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/r/package.nls.json]---
Location: vscode-main/extensions/r/package.nls.json

```json
{
	"displayName": "R Language Basics",
	"description": "Provides syntax highlighting and bracket matching in R files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/r/syntaxes/r.tmLanguage.json]---
Location: vscode-main/extensions/r/syntaxes/r.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/REditorSupport/vscode-R-syntax/blob/master/syntaxes/r.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/REditorSupport/vscode-R-syntax/commit/b199996070723eefbe7a61e0384b2ae4768eb7f0",
	"name": "R",
	"scopeName": "source.r",
	"patterns": [
		{
			"include": "#roxygen"
		},
		{
			"include": "#comments"
		},
		{
			"include": "#constants"
		},
		{
			"include": "#accessor"
		},
		{
			"include": "#operators"
		},
		{
			"include": "#keywords"
		},
		{
			"include": "#storage-type"
		},
		{
			"include": "#strings"
		},
		{
			"include": "#brackets"
		},
		{
			"include": "#function-declarations"
		},
		{
			"include": "#lambda-functions"
		},
		{
			"include": "#builtin-functions"
		},
		{
			"include": "#function-calls"
		},
		{
			"match": "(?:[a-zA-Z._][\\w.]*|`[^`]+`)"
		}
	],
	"repository": {
		"accessor": {
			"patterns": [
				{
					"begin": "(\\$)(?=(?:[a-zA-Z._][\\w.]*|`[^`]+`))",
					"beginCaptures": {
						"1": {
							"name": "keyword.accessor.dollar.r"
						}
					},
					"end": "(?!\\G)",
					"patterns": [
						{
							"include": "#function-calls"
						}
					]
				},
				{
					"begin": "(:::?)(?=(?:[a-zA-Z._][\\w.]*|`[^`]+`))",
					"beginCaptures": {
						"1": {
							"name": "punctuation.accessor.colons.r"
						}
					},
					"end": "(?!\\G)",
					"patterns": [
						{
							"include": "#function-calls"
						}
					]
				}
			]
		},
		"brackets": {
			"patterns": [
				{
					"begin": "\\(",
					"beginCaptures": {
						"0": {
							"name": "punctuation.section.parameters.begin.bracket.round.r"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.parameters.end.bracket.round.r"
						}
					},
					"patterns": [
						{
							"include": "source.r"
						}
					]
				},
				{
					"begin": "\\[(?!\\[)",
					"beginCaptures": {
						"0": {
							"name": "punctuation.section.brackets.single.begin.r"
						}
					},
					"end": "\\]",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.brackets.single.end.r"
						}
					},
					"patterns": [
						{
							"include": "source.r"
						}
					]
				},
				{
					"contentName": "meta.item-access.arguments.r",
					"begin": "\\[\\[",
					"beginCaptures": {
						"0": {
							"name": "punctuation.section.brackets.double.begin.r"
						}
					},
					"end": "\\]\\]",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.brackets.double.end.r"
						}
					},
					"patterns": [
						{
							"include": "source.r"
						}
					]
				},
				{
					"begin": "\\{",
					"beginCaptures": {
						"0": {
							"name": "punctuation.section.block.begin.bracket.curly.r"
						}
					},
					"end": "\\}",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.block.end.bracket.curly.r"
						}
					},
					"patterns": [
						{
							"include": "source.r"
						}
					]
				}
			]
		},
		"builtin-functions": {
			"patterns": [
				{
					"name": "meta.function-call.r",
					"contentName": "meta.function-call.arguments.r",
					"begin": "\\b(?:(base)(::))?(abbreviate|abs|acos|acosh|activeBindingFunction|addNA|addTaskCallback|agrep|agrepl|alist|all|all\\.equal|all\\.equal\\.character|all\\.equal\\.default|all\\.equal\\.environment|all\\.equal\\.envRefClass|all\\.equal\\.factor|all\\.equal\\.formula|all\\.equal\\.function|all\\.equal\\.language|all\\.equal\\.list|all\\.equal\\.numeric|all\\.equal\\.POSIXt|all\\.equal\\.raw|all\\.names|all\\.vars|allowInterrupts|any|anyDuplicated|anyDuplicated\\.array|anyDuplicated\\.data\\.frame|anyDuplicated\\.default|anyDuplicated\\.matrix|anyNA|anyNA\\.data\\.frame|anyNA\\.numeric_version|anyNA\\.POSIXlt|aperm|aperm\\.default|aperm\\.table|append|apply|Arg|args|array|array2DF|arrayInd|as\\.array|as\\.array\\.default|as\\.call|as\\.character|as\\.character\\.condition|as\\.character\\.Date|as\\.character\\.default|as\\.character\\.error|as\\.character\\.factor|as\\.character\\.hexmode|as\\.character\\.numeric_version|as\\.character\\.octmode|as\\.character\\.POSIXt|as\\.character\\.srcref|as\\.complex|as\\.data\\.frame|as\\.data\\.frame\\.array|as\\.data\\.frame\\.AsIs|as\\.data\\.frame\\.character|as\\.data\\.frame\\.complex|as\\.data\\.frame\\.data\\.frame|as\\.data\\.frame\\.Date|as\\.data\\.frame\\.default|as\\.data\\.frame\\.difftime|as\\.data\\.frame\\.factor|as\\.data\\.frame\\.integer|as\\.data\\.frame\\.list|as\\.data\\.frame\\.logical|as\\.data\\.frame\\.matrix|as\\.data\\.frame\\.model\\.matrix|as\\.data\\.frame\\.noquote|as\\.data\\.frame\\.numeric|as\\.data\\.frame\\.numeric_version|as\\.data\\.frame\\.ordered|as\\.data\\.frame\\.POSIXct|as\\.data\\.frame\\.POSIXlt|as\\.data\\.frame\\.raw|as\\.data\\.frame\\.table|as\\.data\\.frame\\.ts|as\\.data\\.frame\\.vector|as\\.Date|as\\.Date\\.character|as\\.Date\\.default|as\\.Date\\.factor|as\\.Date\\.numeric|as\\.Date\\.POSIXct|as\\.Date\\.POSIXlt|as\\.difftime|as\\.double|as\\.double\\.difftime|as\\.double\\.POSIXlt|as\\.environment|as\\.expression|as\\.expression\\.default|as\\.factor|as\\.function|as\\.function\\.default|as\\.hexmode|as\\.integer|as\\.list|as\\.list\\.data\\.frame|as\\.list\\.Date|as\\.list\\.default|as\\.list\\.difftime|as\\.list\\.environment|as\\.list\\.factor|as\\.list\\.function|as\\.list\\.numeric_version|as\\.list\\.POSIXct|as\\.list\\.POSIXlt|as\\.logical|as\\.logical\\.factor|as\\.matrix|as\\.matrix\\.data\\.frame|as\\.matrix\\.default|as\\.matrix\\.noquote|as\\.matrix\\.POSIXlt|as\\.name|as\\.null|as\\.null\\.default|as\\.numeric|as\\.numeric_version|as\\.octmode|as\\.ordered|as\\.package_version|as\\.pairlist|as\\.POSIXct|as\\.POSIXct\\.Date|as\\.POSIXct\\.default|as\\.POSIXct\\.numeric|as\\.POSIXct\\.POSIXlt|as\\.POSIXlt|as\\.POSIXlt\\.character|as\\.POSIXlt\\.Date|as\\.POSIXlt\\.default|as\\.POSIXlt\\.factor|as\\.POSIXlt\\.numeric|as\\.POSIXlt\\.POSIXct|as\\.qr|as\\.raw|as\\.single|as\\.single\\.default|as\\.symbol|as\\.table|as\\.table\\.default|as\\.vector|as\\.vector\\.data\\.frame|as\\.vector\\.factor|as\\.vector\\.POSIXlt|asin|asinh|asNamespace|asplit|asS3|asS4|assign|atan|atan2|atanh|attach|attachNamespace|attr|attr\\.all\\.equal|attributes|autoload|autoloader|backsolve|balancePOSIXlt|baseenv|basename|besselI|besselJ|besselK|besselY|beta|bindingIsActive|bindingIsLocked|bindtextdomain|bitwAnd|bitwNot|bitwOr|bitwShiftL|bitwShiftR|bitwXor|body|bquote|break|browser|browserCondition|browserSetDebug|browserText|builtins|by|by\\.data\\.frame|by\\.default|bzfile|c|c\\.Date|c\\.difftime|c\\.factor|c\\.noquote|c\\.numeric_version|c\\.POSIXct|c\\.POSIXlt|c\\.warnings|call|callCC|capabilities|casefold|cat|cbind|cbind\\.data\\.frame|ceiling|char\\.expand|character|charmatch|charToRaw|chartr|chkDots|chol|chol\\.default|chol2inv|choose|chooseOpsMethod|chooseOpsMethod\\.default|class|clearPushBack|close|close\\.connection|close\\.srcfile|close\\.srcfilealias|closeAllConnections|col|colMeans|colnames|colSums|commandArgs|comment|complex|computeRestarts|conditionCall|conditionCall\\.condition|conditionMessage|conditionMessage\\.condition|conflictRules|conflicts|Conj|contributors|cos|cosh|cospi|crossprod|Cstack_info|cummax|cummin|cumprod|cumsum|curlGetHeaders|cut|cut\\.Date|cut\\.default|cut\\.POSIXt|data\\.class|data\\.frame|data\\.matrix|date|debug|debuggingState|debugonce|declare|default\\.stringsAsFactors|delayedAssign|deparse|deparse1|det|detach|determinant|determinant\\.matrix|dget|diag|diff|diff\\.Date|diff\\.default|diff\\.difftime|diff\\.POSIXt|difftime|digamma|dim|dim\\.data\\.frame|dimnames|dimnames\\.data\\.frame|dir|dir\\.create|dir\\.exists|dirname|do\\.call|dontCheck|double|dput|dQuote|drop|droplevels|droplevels\\.data\\.frame|droplevels\\.factor|dump|duplicated|duplicated\\.array|duplicated\\.data\\.frame|duplicated\\.default|duplicated\\.matrix|duplicated\\.numeric_version|duplicated\\.POSIXlt|duplicated\\.warnings|dyn\\.load|dyn\\.unload|dynGet|eapply|eigen|emptyenv|enc2native|enc2utf8|encodeString|Encoding|endsWith|enquote|env\\.profile|environment|environmentIsLocked|environmentName|errorCondition|eval|eval\\.parent|evalq|Exec|exists|exp|expand\\.grid|expm1|expression|extSoftVersion|factor|factorial|fifo|file|file\\.access|file\\.append|file\\.choose|file\\.copy|file\\.create|file\\.exists|file\\.info|file\\.link|file\\.mode|file\\.mtime|file\\.path|file\\.remove|file\\.rename|file\\.show|file\\.size|file\\.symlink|Filter|Find|find\\.package|findInterval|findPackageEnv|findRestart|floor|flush|flush\\.connection|for|force|forceAndCall|formals|format|format\\.AsIs|format\\.data\\.frame|format\\.Date|format\\.default|format\\.difftime|format\\.factor|format\\.hexmode|format\\.info|format\\.libraryIQR|format\\.numeric_version|format\\.octmode|format\\.packageInfo|format\\.POSIXct|format\\.POSIXlt|format\\.pval|format\\.summaryDefault|formatC|formatDL|forwardsolve|function|gamma|gc|gc\\.time|gcinfo|gctorture|gctorture2|get|get0|getAllConnections|getCallingDLL|getCallingDLLe|getConnection|getDLLRegisteredRoutines|getDLLRegisteredRoutines\\.character|getDLLRegisteredRoutines\\.DLLInfo|getElement|geterrmessage|getExportedValue|getHook|getLoadedDLLs|getNamespace|getNamespaceExports|getNamespaceImports|getNamespaceInfo|getNamespaceName|getNamespaceUsers|getNamespaceVersion|getNativeSymbolInfo|getOption|getRversion|getSrcLines|getTaskCallbackNames|gettext|gettextf|getwd|gl|globalCallingHandlers|globalenv|gregexec|gregexpr|grep|grepl|grepRaw|grepv|grouping|gsub|gzcon|gzfile|I|iconv|iconvlist|icuGetCollate|icuSetCollate|identical|identity|if|ifelse|Im|importIntoEnv|infoRDS|inherits|integer|interaction|interactive|intersect|intToBits|intToUtf8|inverse\\.rle|invisible|invokeRestart|invokeRestartInteractively|is\\.array|is\\.atomic|is\\.call|is\\.character|is\\.complex|is\\.data\\.frame|is\\.double|is\\.element|is\\.environment|is\\.expression|is\\.factor|is\\.finite|is\\.finite\\.POSIXlt|is\\.function|is\\.infinite|is\\.infinite\\.POSIXlt|is\\.integer|is\\.language|is\\.list|is\\.loaded|is\\.logical|is\\.matrix|is\\.na|is\\.na\\.data\\.frame|is\\.na\\.numeric_version|is\\.na\\.POSIXlt|is\\.name|is\\.nan|is\\.nan\\.POSIXlt|is\\.null|is\\.numeric|is\\.numeric_version|is\\.numeric\\.Date|is\\.numeric\\.difftime|is\\.numeric\\.POSIXt|is\\.object|is\\.ordered|is\\.package_version|is\\.pairlist|is\\.primitive|is\\.qr|is\\.R|is\\.raw|is\\.recursive|is\\.single|is\\.symbol|is\\.table|is\\.unsorted|is\\.vector|isa|isatty|isBaseNamespace|isdebugged|isFALSE|isIncomplete|isNamespace|isNamespaceLoaded|ISOdate|ISOdatetime|isOpen|isRestart|isS4|isSeekable|isSymmetric|isSymmetric\\.matrix|isTRUE|jitter|julian|julian\\.Date|julian\\.POSIXt|kappa|kappa\\.default|kappa\\.lm|kappa\\.qr|kronecker|l10n_info|La_library|La_version|La\\.svd|labels|labels\\.default|lapply|lazyLoad|lazyLoadDBexec|lazyLoadDBfetch|lbeta|lchoose|length|length\\.POSIXlt|lengths|levels|levels\\.default|lfactorial|lgamma|libcurlVersion|library|library\\.dynam|library\\.dynam\\.unload|licence|license|list|list\\.dirs|list\\.files|list2DF|list2env|load|loadedNamespaces|loadingNamespaceInfo|loadNamespace|local|lockBinding|lockEnvironment|log|log10|log1p|log2|logb|logical|lower\\.tri|ls|make\\.names|make\\.unique|makeActiveBinding|Map|mapply|margin\\.table|marginSums|mat\\.or\\.vec|match|match\\.arg|match\\.call|match\\.fun|Math\\.data\\.frame|Math\\.Date|Math\\.difftime|Math\\.factor|Math\\.POSIXt|matrix|max|max\\.col|mean|mean\\.Date|mean\\.default|mean\\.difftime|mean\\.POSIXct|mean\\.POSIXlt|mem\\.maxNSize|mem\\.maxVSize|memCompress|memDecompress|memory\\.profile|merge|merge\\.data\\.frame|merge\\.default|message|mget|min|missing|Mod|mode|months|months\\.Date|months\\.POSIXt|mtfrm|mtfrm\\.default|mtfrm\\.POSIXct|mtfrm\\.POSIXlt|nameOfClass|nameOfClass\\.default|names|names\\.POSIXlt|namespaceExport|namespaceImport|namespaceImportClasses|namespaceImportFrom|namespaceImportMethods|nargs|nchar|ncol|NCOL|Negate|new\\.env|next|NextMethod|ngettext|nlevels|noquote|norm|normalizePath|nrow|NROW|nullfile|numeric|numeric_version|numToBits|numToInts|nzchar|objects|oldClass|OlsonNames|on\\.exit|open|open\\.connection|open\\.srcfile|open\\.srcfilealias|open\\.srcfilecopy|Ops\\.data\\.frame|Ops\\.Date|Ops\\.difftime|Ops\\.factor|Ops\\.numeric_version|Ops\\.ordered|Ops\\.POSIXt|options|order|ordered|outer|package_version|packageEvent|packageHasNamespace|packageNotFoundError|packageStartupMessage|packBits|pairlist|parent\\.env|parent\\.frame|parse|parseNamespaceFile|paste|paste0|path\\.expand|path\\.package|pcre_config|pipe|plot|pmatch|pmax|pmax\\.int|pmin|pmin\\.int|polyroot|pos\\.to\\.env|Position|pretty|pretty\\.default|prettyNum|print|print\\.AsIs|print\\.by|print\\.condition|print\\.connection|print\\.data\\.frame|print\\.Date|print\\.default|print\\.difftime|print\\.Dlist|print\\.DLLInfo|print\\.DLLInfoList|print\\.DLLRegisteredRoutines|print\\.eigen|print\\.factor|print\\.function|print\\.hexmode|print\\.libraryIQR|print\\.listof|print\\.NativeRoutineList|print\\.noquote|print\\.numeric_version|print\\.octmode|print\\.packageInfo|print\\.POSIXct|print\\.POSIXlt|print\\.proc_time|print\\.restart|print\\.rle|print\\.simple\\.list|print\\.srcfile|print\\.srcref|print\\.summary\\.table|print\\.summary\\.warnings|print\\.summaryDefault|print\\.table|print\\.warnings|prmatrix|proc\\.time|prod|prop\\.table|proportions|provideDimnames|psigamma|pushBack|pushBackLength|q|qr|qr\\.coef|qr\\.default|qr\\.fitted|qr\\.Q|qr\\.qty|qr\\.qy|qr\\.R|qr\\.resid|qr\\.solve|qr\\.X|quarters|quarters\\.Date|quarters\\.POSIXt|quit|quote|R_compiled_by|R_system_version|R\\.home|R\\.Version|range|range\\.Date|range\\.default|range\\.POSIXct|rank|rapply|raw|rawConnection|rawConnectionValue|rawShift|rawToBits|rawToChar|rbind|rbind\\.data\\.frame|rcond|Re|read\\.dcf|readBin|readChar|readline|readLines|readRDS|readRenviron|Recall|Reduce|reg\\.finalizer|regexec|regexpr|registerS3method|registerS3methods|regmatches|remove|removeTaskCallback|rep|rep_len|rep\\.Date|rep\\.difftime|rep\\.factor|rep\\.int|rep\\.numeric_version|rep\\.POSIXct|rep\\.POSIXlt|repeat|replace|replicate|require|requireNamespace|restartDescription|restartFormals|retracemem|return|returnValue|rev|rev\\.default|rle|rm|RNGkind|RNGversion|round|round\\.Date|round\\.POSIXt|row|row\\.names|row\\.names\\.data\\.frame|row\\.names\\.default|rowMeans|rownames|rowsum|rowsum\\.data\\.frame|rowsum\\.default|rowSums|sample|sample\\.int|sapply|save|save\\.image|saveRDS|scale|scale\\.default|scan|search|searchpaths|seek|seek\\.connection|seq|seq_along|seq_len|seq\\.Date|seq\\.default|seq\\.int|seq\\.POSIXt|sequence|sequence\\.default|serialize|serverSocket|set\\.seed|setdiff|setequal|setHook|setNamespaceInfo|setSessionTimeLimit|setTimeLimit|setwd|showConnections|shQuote|sign|signalCondition|signif|simpleCondition|simpleError|simpleMessage|simpleWarning|simplify2array|sin|single|sinh|sink|sink\\.number|sinpi|slice\\.index|socketAccept|socketConnection|socketSelect|socketTimeout|solve|solve\\.default|solve\\.qr|sort|sort_by|sort_by\\.data\\.frame|sort_by\\.default|sort\\.default|sort\\.int|sort\\.list|sort\\.POSIXlt|source|split|split\\.data\\.frame|split\\.Date|split\\.default|split\\.POSIXct|sprintf|sqrt|sQuote|srcfile|srcfilealias|srcfilecopy|srcref|standardGeneric|startsWith|stderr|stdin|stdout|stop|stopifnot|storage\\.mode|str2expression|str2lang|strftime|strptime|strrep|strsplit|strtoi|strtrim|structure|strwrap|sub|subset|subset\\.data\\.frame|subset\\.default|subset\\.matrix|substitute|substr|substring|sum|summary|summary\\.connection|summary\\.data\\.frame|Summary\\.data\\.frame|summary\\.Date|Summary\\.Date|summary\\.default|summary\\.difftime|Summary\\.difftime|summary\\.factor|Summary\\.factor|summary\\.matrix|Summary\\.numeric_version|Summary\\.ordered|summary\\.POSIXct|Summary\\.POSIXct|summary\\.POSIXlt|Summary\\.POSIXlt|summary\\.proc_time|summary\\.srcfile|summary\\.srcref|summary\\.table|summary\\.warnings|suppressMessages|suppressPackageStartupMessages|suppressWarnings|suspendInterrupts|svd|sweep|switch|sys\\.call|sys\\.calls|Sys\\.chmod|Sys\\.Date|sys\\.frame|sys\\.frames|sys\\.function|Sys\\.getenv|Sys\\.getlocale|Sys\\.getpid|Sys\\.glob|Sys\\.info|sys\\.load\\.image|Sys\\.localeconv|sys\\.nframe|sys\\.on\\.exit|sys\\.parent|sys\\.parents|Sys\\.readlink|sys\\.save\\.image|Sys\\.setenv|Sys\\.setFileTime|Sys\\.setLanguage|Sys\\.setlocale|Sys\\.sleep|sys\\.source|sys\\.status|Sys\\.time|Sys\\.timezone|Sys\\.umask|Sys\\.unsetenv|Sys\\.which|system|system\\.file|system\\.time|system2|t|t\\.data\\.frame|t\\.default|table|tabulate|Tailcall|tan|tanh|tanpi|tapply|taskCallbackManager|tcrossprod|tempdir|tempfile|textConnection|textConnectionValue|tolower|topenv|toString|toString\\.default|toupper|trace|traceback|tracemem|tracingState|transform|transform\\.data\\.frame|transform\\.default|trigamma|trimws|trunc|trunc\\.Date|trunc\\.POSIXt|truncate|truncate\\.connection|try|tryCatch|tryInvokeRestart|typeof|unCfillPOSIXlt|unclass|undebug|union|unique|unique\\.array|unique\\.data\\.frame|unique\\.default|unique\\.matrix|unique\\.numeric_version|unique\\.POSIXlt|unique\\.warnings|units|units\\.difftime|unix\\.time|unlink|unlist|unloadNamespace|unlockBinding|unname|unserialize|unsplit|untrace|untracemem|unz|upper\\.tri|url|use|UseMethod|utf8ToInt|validEnc|validUTF8|vapply|vector|Vectorize|warning|warningCondition|warnings|weekdays|weekdays\\.Date|weekdays\\.POSIXt|which|which\\.max|which\\.min|while|with|with\\.default|withAutoprint|withCallingHandlers|within|within\\.data\\.frame|within\\.list|withRestarts|withVisible|write|write\\.dcf|writeBin|writeChar|writeLines|xor|xpdrows\\.data\\.frame|xtfrm|xtfrm\\.AsIs|xtfrm\\.data\\.frame|xtfrm\\.Date|xtfrm\\.default|xtfrm\\.difftime|xtfrm\\.factor|xtfrm\\.numeric_version|xtfrm\\.POSIXct|xtfrm\\.POSIXlt|xzfile|zapsmall|zstdfile)\\s*(\\()",
					"beginCaptures": {
						"1": {
							"name": "support.namespace.r"
						},
						"2": {
							"name": "punctuation.accessor.colons.r"
						},
						"3": {
							"name": "support.function.r"
						},
						"4": {
							"name": "punctuation.definition.arguments.begin.r"
						}
					},
					"end": "(\\))",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.arguments.end.r"
						}
					},
					"patterns": [
						{
							"include": "#function-call-arguments"
						}
					]
				},
				{
					"name": "meta.function-call.r",
					"contentName": "meta.function-call.arguments.r",
					"begin": "\\b(?:(graphics)(::))?(abline|arrows|assocplot|axis|Axis|axis\\.Date|Axis\\.Date|Axis\\.default|axis\\.POSIXct|Axis\\.POSIXt|Axis\\.table|axTicks|barplot|barplot\\.default|barplot\\.formula|box|boxplot|boxplot\\.default|boxplot\\.formula|boxplot\\.matrix|bxp|cdplot|cdplot\\.default|cdplot\\.formula|clip|close\\.screen|co\\.intervals|contour|contour\\.default|coplot|curve|dotchart|erase\\.screen|extendDateTimeFormat|filled\\.contour|fourfoldplot|frame|grconvertX|grconvertY|grid|hist|hist\\.Date|hist\\.default|hist\\.POSIXt|identify|identify\\.default|image|image\\.default|layout|layout\\.show|lcm|legend|lines|lines\\.default|lines\\.formula|lines\\.histogram|lines\\.table|locator|matlines|matplot|matpoints|mosaicplot|mosaicplot\\.default|mosaicplot\\.formula|mtext|pairs|pairs\\.default|pairs\\.formula|panel\\.smooth|par|persp|persp\\.default|pie|piechart|plot\\.data\\.frame|plot\\.default|plot\\.design|plot\\.factor|plot\\.formula|plot\\.function|plot\\.histogram|plot\\.new|plot\\.raster|plot\\.table|plot\\.window|plot\\.xy|plotHclust|points|points\\.default|points\\.formula|points\\.table|polygon|polypath|rasterImage|rect|rug|screen|segments|smoothScatter|spineplot|spineplot\\.default|spineplot\\.formula|split\\.screen|stars|stem|strheight|stripchart|stripchart\\.default|stripchart\\.formula|strwidth|sunflowerplot|sunflowerplot\\.default|sunflowerplot\\.formula|symbols|text|text\\.default|text\\.formula|title|xinch|xspline|xyinch|yinch)\\s*(\\()",
					"beginCaptures": {
						"1": {
							"name": "support.namespace.r"
						},
						"2": {
							"name": "punctuation.accessor.colons.r"
						},
						"3": {
							"name": "support.function.r"
						},
						"4": {
							"name": "punctuation.definition.arguments.begin.r"
						}
					},
					"end": "(\\))",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.arguments.end.r"
						}
					},
					"patterns": [
						{
							"include": "#function-call-arguments"
						}
					]
				},
				{
					"name": "meta.function-call.r",
					"contentName": "meta.function-call.arguments.r",
					"begin": "\\b(?:(grDevices)(::))?(adjustcolor|anyNA\\.raster|as\\.graphicsAnnot|as\\.matrix\\.raster|as\\.raster|as\\.raster\\.array|as\\.raster\\.character|as\\.raster\\.logical|as\\.raster\\.matrix|as\\.raster\\.numeric|as\\.raster\\.raster|as\\.raster\\.raw|axisTicks|bitmap|bmp|boxplot\\.stats|c2to3|cairo_pdf|cairo_ps|cairoFT|cairoSymbolFont|cairoVersion|check_gs_type|check\\.options|checkFont|checkFont\\.CIDFont|checkFont\\.default|checkFont\\.Type1Font|checkFontInUse|checkIntFormat|checkQuartzFont|checkSymbolFont|checkX11Font|chromaticAdaptation|chull|CIDFont|cm|cm\\.colors|col2rgb|colorConverter|colorRamp|colorRampPalette|colors|colours|comparePangoVersion|contourLines|convertColor|densCols|dev\\.capabilities|dev\\.capture|dev\\.control|dev\\.copy|dev\\.copy2eps|dev\\.copy2pdf|dev\\.cur|dev\\.displaylist|dev\\.flush|dev\\.hold|dev\\.interactive|dev\\.list|dev\\.new|dev\\.next|dev\\.off|dev\\.prev|dev\\.print|dev\\.set|dev\\.size|dev2bitmap|devAskNewPage|deviceIsInteractive|embedFonts|embedGlyphs|extendrange|getGraphicsEvent|getGraphicsEventEnv|glyphAnchor|glyphFont|glyphFontList|glyphHeight|glyphHeightBottom|glyphInfo|glyphJust|glyphJust\\.character|glyphJust\\.GlyphJust|glyphJust\\.numeric|glyphWidth|glyphWidthLeft|graphics\\.off|gray|gray\\.colors|grey|grey\\.colors|grSoftVersion|guessEncoding|hcl|hcl\\.colors|hcl\\.pals|heat\\.colors|hsv|initPSandPDFfonts|invertStyle|is\\.na\\.raster|is\\.raster|isPDF|jpeg|make\\.rgb|mapCharWeight|mapStyle|mapWeight|matchEncoding|matchEncoding\\.CIDFont|matchEncoding\\.Type1Font|matchFont|n2mfrow|nclass\\.FD|nclass\\.scott|nclass\\.Sturges|Ops\\.raster|optionSymbolFont|palette|palette\\.colors|palette\\.match|palette\\.pals|pangoVersion|pattern|pdf|pdf\\.options|pdfFonts|pictex|png|postscript|postscriptFonts|pow3|prettyDate|print\\.colorConverter|print\\.raster|print\\.recordedplot|print\\.RGBcolorConverter|print\\.RGlyphFont|printFont|printFont\\.CIDFont|printFont\\.Type1Font|printFonts|ps\\.options|quartz|quartz\\.options|quartz\\.save|quartzFont|quartzFonts|rainbow|recordGraphics|recordPalette|recordPlot|replayPlot|restoreRecordedPlot|rgb|rgb2hsv|RGBcolorConverter|savePlot|seqDtime|setEPS|setFonts|setGraphicsEventEnv|setGraphicsEventHandlers|setPS|setQuartzFonts|setX11Fonts|svg|symbolfamilyDefault|symbolType1support|terrain\\.colors|tiff|topo\\.colors|trans3d|trunc_POSIXt|Type1Font|vectorizeConverter|warnLogCoords|x11|X11|X11\\.options|X11Font|X11FontError|X11Fonts|xfig|xy\\.coords|xyTable|xyz\\.coords)\\s*(\\()",
					"beginCaptures": {
						"1": {
							"name": "support.namespace.r"
						},
						"2": {
							"name": "punctuation.accessor.colons.r"
						},
						"3": {
							"name": "support.function.r"
						},
						"4": {
							"name": "punctuation.definition.arguments.begin.r"
						}
					},
					"end": "(\\))",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.arguments.end.r"
						}
					},
					"patterns": [
						{
							"include": "#function-call-arguments"
						}
					]
				},
				{
					"name": "meta.function-call.r",
					"contentName": "meta.function-call.arguments.r",
					"begin": "\\b(?:(methods)(::))?(addNextMethod|allNames|Arith|as|asMethodDefinition|assignClassDef|assignMethodsMetaData|balanceMethodsList|bind_activation|cacheGenericsMetaData|cacheMetaData|cacheMethod|cacheOnAssign|callGeneric|callNextMethod|canCoerce|cbind|cbind2|checkAtAssignment|checkSlotAssignment|classesToAM|classGeneratorFunction|classLabel|classMetaName|className|coerce|Compare|completeClassDefinition|completeExtends|completeSubclasses|Complex|conformMethod|defaultDumpName|defaultPrototype|dispatchIsInternal|doPrimitiveMethod|dumpMethod|dumpMethods|el|elNamed|empty\\.dump|emptyMethodsList|envRefInferField|envRefSetField|evalOnLoad|evalqOnLoad|evalSource|existsFunction|existsMethod|extends|externalRefMethod|finalDefaultMethod|findClass|findFunction|findMethod|findMethods|findMethodSignatures|findUnique|fixPre1\\.8|formalArgs|fromNextMethod|functionBody|generic\\.skeleton|genericForBasic|getAllSuperClasses|getClass|getClassDef|getClasses|getDataPart|getFunction|getGeneric|getGenericFromCall|getGenerics|getGroup|getGroupMembers|getLoadActions|getMethod|getMethods|getMethodsAndAccessors|getMethodsForDispatch|getMethodsMetaData|getPackageName|getRefClass|getRefSuperClasses|getSlots|getValidity|hasArg|hasLoadAction|hasMethod|hasMethods|implicitGeneric|inBasicFuns|inferProperties|inheritedSlotNames|inheritedSubMethodLists|initFieldArgs|initialize|initMethodDispatch|initRefFields|insertClassMethods|insertMethod|insertMethodInEmptyList|insertSource|installClassMethod|is|isBaseFun|isClass|isClassDef|isClassUnion|isGeneric|isGrammarSymbol|isGroup|isMixin|isRematched|isS3Generic|isSealedClass|isSealedMethod|isVirtualClass|isXS3Class|kronecker|languageEl|listFromMethods|loadMethod|Logic|makeClassMethod|makeClassRepresentation|makeEnvRefMethods|makeExtends|makeGeneric|makeMethodsList|makePrototypeFromClassDef|makeStandardGeneric|matchDefaults|matchSignature|Math|Math2|matrixOps|mergeMethods|metaNameUndo|method\\.skeleton|MethodAddCoerce|methodSignatureMatrix|MethodsList|MethodsListSelect|methodsPackageMetaName|missingArg|multipleClasses|new|newBasic|newClassRepresentation|newEmptyObject|Ops|outerLabels|packageSlot|possibleExtends|printClassRepresentation|printPropertiesList|prohibitGeneric|promptClass|promptMethods|prototype|Quote|rbind|rbind2|reconcilePropertiesAndPrototype|refClassFields|refClassInformation|refClassMethods|refClassPrompt|refObjectClass|registerImplicitGenerics|rematchDefinition|removeClass|removeGeneric|removeMethod|removeMethods|representation|requireMethods|resetClass|resetGeneric|S3Class|S3forS4Methods|S3Part|sealClass|selectMethod|selectSuperClasses|setAs|setCacheOnAssign|setClass|setClassUnion|setDataPart|setGeneric|setGenericImplicit|setGroupGeneric|setIs|setLoadAction|setLoadActions|setMethod|setNames|setOldClass|setPackageName|setPackageSlot|setPrimitiveMethods|setRefClass|setReplaceMethod|setValidity|show|showClass|showClassMethod|showDefault|showExtends|showExtraSlots|showMethods|showRefClassDef|signature|SignatureMethod|sigToEnv|slot|slotNames|slotsFromS3|substituteDirect|substituteFunctionArgs|Summary|superClassDepth|superClassMethodName|tableNames|testInheritedMethods|testVirtual|tryNew|unRematchDefinition|useMTable|validObject|validSlotNames)\\s*(\\()",
					"beginCaptures": {
						"1": {
							"name": "support.namespace.r"
						},
						"2": {
							"name": "punctuation.accessor.colons.r"
						},
						"3": {
							"name": "support.function.r"
						},
						"4": {
							"name": "punctuation.definition.arguments.begin.r"
						}
					},
					"end": "(\\))",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.arguments.end.r"
						}
					},
					"patterns": [
						{
							"include": "#function-call-arguments"
						}
					]
				},
				{
					"name": "meta.function-call.r",
					"contentName": "meta.function-call.arguments.r",
					"begin": "\\b(?:(stats)(::))?(acf|acf2AR|add\\.scope|add1|add1\\.default|add1\\.glm|add1\\.lm|add1\\.mlm|addmargins|aggregate|aggregate\\.data\\.frame|aggregate\\.default|aggregate\\.formula|aggregate\\.ts|AIC|AIC\\.default|AIC\\.logLik|alias|alias\\.formula|alias\\.lm|anova|anova\\.glm|anova\\.glmlist|anova\\.lm|anova\\.lmlist|anova\\.loess|anova\\.mlm|anova\\.mlmlist|anova\\.nls|anovalist\\.nls|ansari\\.test|ansari\\.test\\.default|ansari\\.test\\.formula|aov|approx|approxfun|ar|ar\\.burg|ar\\.burg\\.default|ar\\.burg\\.mts|ar\\.mle|ar\\.ols|ar\\.yw|ar\\.yw\\.default|ar\\.yw\\.mts|arima|arima\\.sim|arima0|arima0\\.diag|ARMAacf|ARMAtoMA|as\\.data\\.frame\\.aovproj|as\\.data\\.frame\\.ftable|as\\.data\\.frame\\.logLik|as\\.dendrogram|as\\.dendrogram\\.dendrogram|as\\.dendrogram\\.hclust|as\\.dist|as\\.dist\\.default|as\\.formula|as\\.hclust|as\\.hclust\\.default|as\\.hclust\\.dendrogram|as\\.hclust\\.twins|as\\.matrix\\.dist|as\\.matrix\\.ftable|as\\.stepfun|as\\.stepfun\\.default|as\\.stepfun\\.isoreg|as\\.table\\.ftable|as\\.ts|as\\.ts\\.default|asOneSidedFormula|assert_NULL_or_prob|ave|bandwidth\\.kernel|bartlett\\.test|bartlett\\.test\\.default|bartlett\\.test\\.formula|BIC|BIC\\.default|BIC\\.logLik|binom\\.test|binomial|binomInitialize|biplot|biplot\\.default|biplot\\.prcomp|biplot\\.princomp|Box\\.test|bw_pair_cnts|bw\\.bcv|bw\\.nrd|bw\\.nrd0|bw\\.SJ|bw\\.ucv|C|cancor|case\\.names|case\\.names\\.default|case\\.names\\.lm|cbind\\.ts|ccf|check_exact|chisq\\.test|cmdscale|coef|coef\\.aov|coef\\.Arima|coef\\.default|coef\\.listof|coef\\.maov|coef\\.nls|coefficients|complete\\.cases|confint|confint\\.default|confint\\.glm|confint\\.lm|confint\\.nls|confint\\.profile\\.glm|confint\\.profile\\.nls|constrOptim|contr\\.helmert|contr\\.poly|contr\\.SAS|contr\\.sum|contr\\.treatment|contrasts|convolve|cooks\\.distance|cooks\\.distance\\.glm|cooks\\.distance\\.lm|cophenetic|cophenetic\\.default|cophenetic\\.dendrogram|cor|cor\\.test|cor\\.test\\.default|cor\\.test\\.formula|cov|cov\\.wt|cov2cor|covratio|cpgram|cut\\.dendrogram|cutree|cycle|cycle\\.default|cycle\\.ts|D|dbeta|dbinom|dcauchy|dchisq|decompose|delete\\.response|deltat|deltat\\.default|dendrapply|density|density\\.default|deparse2|deriv|deriv\\.default|deriv\\.formula|deriv3|deriv3\\.default|deriv3\\.formula|deviance|deviance\\.default|deviance\\.glm|deviance\\.lm|deviance\\.mlm|deviance\\.nls|dexp|df|df\\.kernel|df\\.residual|df\\.residual\\.default|df\\.residual\\.nls|DF2formula|dfbeta|dfbeta\\.lm|dfbetas|dfbetas\\.lm|dffits|dgamma|dgeom|dhyper|diff\\.ts|diffinv|diffinv\\.default|diffinv\\.ts|diffinv\\.vector|dist|dlnorm|dlogis|dmultinom|dnbinom|dnorm|dpois|drop\\.scope|drop\\.terms|drop1|drop1\\.default|drop1\\.glm|drop1\\.lm|drop1\\.mlm|dsignrank|dt|dummy\\.coef|dummy\\.coef\\.aovlist|dummy\\.coef\\.lm|dunif|dweibull|dwilcox|ecdf|eff\\.aovlist|effects|effects\\.glm|effects\\.lm|embed|end|end\\.default|estVar|estVar\\.mlm|estVar\\.SSD|expand\\.model\\.frame|extractAIC|extractAIC\\.aov|extractAIC\\.coxph|extractAIC\\.glm|extractAIC\\.lm|extractAIC\\.negbin|extractAIC\\.survreg|factanal|factanal\\.fit\\.mle|factor\\.scope|family|family\\.glm|family\\.lm|fft|filter|fisher\\.test|fitted|fitted\\.default|fitted\\.isoreg|fitted\\.kmeans|fitted\\.nls|fitted\\.smooth\\.spline|fitted\\.values|fivenum|fligner\\.test|fligner\\.test\\.default|fligner\\.test\\.formula|format_perc|format\\.dist|format\\.ftable|formula|formula\\.character|formula\\.data\\.frame|formula\\.default|formula\\.formula|formula\\.glm|formula\\.lm|formula\\.nls|formula\\.terms|frequency|frequency\\.default|friedman\\.test|friedman\\.test\\.default|friedman\\.test\\.formula|ftable|ftable\\.default|ftable\\.formula|Gamma|gaussian|get_all_vars|getCall|getCall\\.default|getInitial|getInitial\\.default|getInitial\\.formula|getInitial\\.selfStart|glm|glm\\.control|glm\\.fit|hasTsp|hat|hatvalues|hatvalues\\.lm|hatvalues\\.smooth\\.spline|hclust|head\\.ts|heatmap|HL|HoltWinters|hyman_filter|identify\\.hclust|influence|influence\\.glm|influence\\.lm|influence\\.measures|integrate|interaction\\.plot|inverse\\.gaussian|IQR|is\\.empty\\.model|is\\.leaf|is\\.mts|is\\.stepfun|is\\.ts|is\\.tskernel|isoreg|KalmanForecast|KalmanLike|KalmanRun|KalmanSmooth|kernapply|kernapply\\.default|kernapply\\.ts|kernapply\\.tskernel|kernapply\\.vector|kernel|kmeans|knots|knots\\.stepfun|kruskal\\.test|kruskal\\.test\\.default|kruskal\\.test\\.formula|ks\\.test|ks\\.test\\.default|ks\\.test\\.formula|ksmooth|labels\\.dendrogram|labels\\.dist|labels\\.lm|labels\\.terms|lag|lag\\.default|lag\\.plot|line|lines\\.isoreg|lines\\.stepfun|lines\\.ts|lm|lm\\.fit|lm\\.influence|lm\\.wfit|loadings|loess|loess\\.control|loess\\.smooth|logLik|logLik\\.Arima|logLik\\.glm|logLik\\.lm|logLik\\.logLik|logLik\\.nls|loglin|lowess|ls\\.diag|ls\\.print|lsfit|mad|mahalanobis|make\\.link|make\\.tables\\.aovproj|make\\.tables\\.aovprojlist|makeARIMA|makepredictcall|makepredictcall\\.default|makepredictcall\\.poly|manova|mantelhaen\\.test|mauchly\\.test|mauchly\\.test\\.mlm|mauchly\\.test\\.SSD|mcnemar\\.test|median|median\\.default|medpolish|merge\\.dendrogram|midcache\\.dendrogram|model\\.extract|model\\.frame|model\\.frame\\.aovlist|model\\.frame\\.default|model\\.frame\\.glm|model\\.frame\\.lm|model\\.matrix|model\\.matrix\\.default|model\\.matrix\\.lm|model\\.offset|model\\.response|model\\.tables|model\\.tables\\.aov|model\\.tables\\.aovlist|model\\.weights|monthplot|monthplot\\.default|monthplot\\.stl|monthplot\\.StructTS|monthplot\\.ts|mood\\.test|mood\\.test\\.default|mood\\.test\\.formula|mvfft|na\\.action|na\\.action\\.default|na\\.contiguous|na\\.contiguous\\.default|na\\.exclude|na\\.exclude\\.data\\.frame|na\\.exclude\\.default|na\\.fail|na\\.fail\\.default|na\\.omit|na\\.omit\\.data\\.frame|na\\.omit\\.default|na\\.omit\\.ts|na\\.pass|napredict|napredict\\.default|napredict\\.exclude|naprint|naprint\\.default|naprint\\.exclude|naprint\\.omit|naresid|naresid\\.default|naresid\\.exclude|nextn|nleaves|nlm|nlminb|nls|nls_port_fit|nls\\.control|nlsModel|nlsModel\\.plinear|NLSstAsymptotic|NLSstAsymptotic\\.sortedXyData|NLSstClosestX|NLSstClosestX\\.sortedXyData|NLSstLfAsymptote|NLSstLfAsymptote\\.sortedXyData|NLSstRtAsymptote|NLSstRtAsymptote\\.sortedXyData|nobs|nobs\\.default|nobs\\.dendrogram|nobs\\.glm|nobs\\.lm|nobs\\.logLik|nobs\\.nls|numericDeriv|offset|oneway\\.test|Ops\\.ts|optim|optimHess|optimise|optimize|order\\.dendrogram|p\\.adjust|pacf|pacf\\.default|Pair|pairs\\.profile|pairwise\\.prop\\.test|pairwise\\.t\\.test|pairwise\\.table|pairwise\\.wilcox\\.test|pbeta|pbinom|pbirthday|pcauchy|pchisq|pexp|pf|pgamma|pgeom|phyper|Pillai|pkolmogorov|pkolmogorov_one_asymp|pkolmogorov_one_exact|pkolmogorov_two_asymp|pkolmogorov_two_exact|plclust|plnorm|plogis|plot\\.acf|plot\\.decomposed\\.ts|plot\\.dendrogram|plot\\.density|plot\\.ecdf|plot\\.hclust|plot\\.HoltWinters|plot\\.isoreg|plot\\.lm|plot\\.medpolish|plot\\.mlm|plot\\.ppr|plot\\.prcomp|plot\\.princomp|plot\\.profile|plot\\.profile\\.nls|plot\\.spec|plot\\.spec\\.coherency|plot\\.spec\\.phase|plot\\.stepfun|plot\\.stl|plot\\.ts|plot\\.tskernel|plot\\.TukeyHSD|plotNode|plotNodeLimit|pnbinom|pnorm|pointwise|poisson|poisson\\.test|poly|polym|port_get_named_v|port_msg|power|power\\.anova\\.test|power\\.prop\\.test|power\\.t\\.test|PP\\.test|ppoints|ppois|ppr|ppr\\.default|ppr\\.formula|prcomp|prcomp\\.default|prcomp\\.formula|predict|predict\\.ar|predict\\.Arima|predict\\.arima0|predict\\.glm|predict\\.HoltWinters|predict\\.lm|predict\\.loess|predict\\.mlm|predict\\.nls|predict\\.poly|predict\\.ppr|predict\\.prcomp|predict\\.princomp|predict\\.smooth\\.spline|predict\\.smooth\\.spline\\.fit|predict\\.StructTS|predLoess|preplot|princomp|princomp\\.default|princomp\\.formula|print\\.acf|print\\.anova|print\\.aov|print\\.aovlist|print\\.ar|print\\.Arima|print\\.arima0|print\\.dendrogram|print\\.density|print\\.dist|print\\.dummy_coef|print\\.dummy_coef_list|print\\.ecdf|print\\.factanal|print\\.family|print\\.formula|print\\.ftable|print\\.glm|print\\.hclust|print\\.HoltWinters|print\\.htest|print\\.infl|print\\.integrate|print\\.isoreg|print\\.kmeans|print\\.lm|print\\.loadings|print\\.loess|print\\.logLik|print\\.medpolish|print\\.mtable|print\\.nls|print\\.pairwise\\.htest|print\\.power\\.htest|print\\.ppr|print\\.prcomp|print\\.princomp|print\\.smooth\\.spline|print\\.stepfun|print\\.stl|print\\.StructTS|print\\.summary\\.aov|print\\.summary\\.aovlist|print\\.summary\\.ecdf|print\\.summary\\.glm|print\\.summary\\.lm|print\\.summary\\.loess|print\\.summary\\.manova|print\\.summary\\.nls|print\\.summary\\.ppr|print\\.summary\\.prcomp|print\\.summary\\.princomp|print\\.tables_aov|print\\.terms|print\\.ts|print\\.tskernel|print\\.TukeyHSD|print\\.tukeyline|print\\.tukeysmooth|print\\.xtabs|printCoefmat|profile|profile\\.glm|profile\\.nls|profiler|profiler\\.nls|proj|Proj|proj\\.aov|proj\\.aovlist|proj\\.default|proj\\.lm|promax|prop\\.test|prop\\.trend\\.test|psignrank|psmirnov|psmirnov_asymp|psmirnov_exact|psmirnov_simul|pt|ptukey|punif|pweibull|pwilcox|qbeta|qbinom|qbirthday|qcauchy|qchisq|qexp|qf|qgamma|qgeom|qhyper|qlnorm|qlogis|qnbinom|qnorm|qpois|qqline|qqnorm|qqnorm\\.default|qqplot|qr\\.influence|qr\\.lm|qsignrank|qsmirnov|qt|qtukey|quade\\.test|quade\\.test\\.default|quade\\.test\\.formula|quantile|quantile\\.default|quantile\\.ecdf|quantile\\.POSIXt|quasi|quasibinomial|quasipoisson|qunif|qweibull|qwilcox|r2dtable|Rank|rbeta|rbinom|rcauchy|rchisq|read\\.ftable|rect\\.hclust|reformulate|regularize\\.values|relevel|relevel\\.default|relevel\\.factor|relevel\\.ordered|reorder|reorder\\.default|reorder\\.dendrogram|replications|reshape|resid|residuals|residuals\\.default|residuals\\.glm|residuals\\.HoltWinters|residuals\\.isoreg|residuals\\.lm|residuals\\.nls|residuals\\.smooth\\.spline|residuals\\.tukeyline|rev\\.dendrogram|rexp|rf|rgamma|rgeom|rhyper|rlnorm|rlogis|rmultinom|rnbinom|rnorm|Roy|rpois|rsignrank|rsmirnov|rstandard|rstandard\\.glm|rstandard\\.lm|rstudent|rstudent\\.glm|rstudent\\.lm|rt|runif|runmed|rweibull|rwilcox|rWishart|safe_pchisq|safe_pf|scatter\\.smooth|screeplot|screeplot\\.default|sd|se\\.aov|se\\.aovlist|se\\.contrast|se\\.contrast\\.aov|se\\.contrast\\.aovlist|selfStart|selfStart\\.default|selfStart\\.formula|setNames|shapiro\\.test|sigma|sigma\\.default|sigma\\.glm|sigma\\.mlm|simpleLoess|simulate|simulate\\.lm|smooth|smooth\\.spline|smoothEnds|sortedXyData|sortedXyData\\.default|spec\\.ar|spec\\.pgram|spec\\.taper|spectrum|sphericity|spl_coef_conv|spline|splinefun|splinefunH|splinefunH0|SSasymp|SSasympOff|SSasympOrig|SSbiexp|SSD|SSD\\.mlm|SSfol|SSfpl|SSgompertz|SSlogis|SSmicmen|SSweibull|start|start\\.default|stat\\.anova|step|stepfun|stl|str\\.dendrogram|str\\.logLik|StructTS|summary\\.aov|summary\\.aovlist|summary\\.ecdf|summary\\.glm|summary\\.infl|summary\\.lm|summary\\.loess|summary\\.manova|summary\\.mlm|summary\\.nls|summary\\.ppr|summary\\.prcomp|summary\\.princomp|summary\\.stepfun|summary\\.stl|summary\\.tukeysmooth|supsmu|symnum|t\\.test|t\\.test\\.default|t\\.test\\.formula|t\\.ts|tail\\.ts|termplot|terms|terms\\.aovlist|terms\\.default|terms\\.formula|terms\\.terms|Thin\\.col|Thin\\.row|time|time\\.default|time\\.ts|toeplitz|toeplitz2|Tr|ts|ts\\.intersect|ts\\.plot|ts\\.union|tsdiag|tsdiag\\.Arima|tsdiag\\.arima0|tsdiag\\.StructTS|tsp|tsSmooth|tsSmooth\\.StructTS|TukeyHSD|TukeyHSD\\.aov|uniroot|update|update\\.default|update\\.formula|update\\.packageStatus|var|var\\.test|var\\.test\\.default|var\\.test\\.formula|variable\\.names|variable\\.names\\.default|variable\\.names\\.lm|varimax|vcov|vcov\\.aov|vcov\\.Arima|vcov\\.glm|vcov\\.lm|vcov\\.mlm|vcov\\.nls|vcov\\.summary\\.glm|vcov\\.summary\\.lm|weighted\\.mean|weighted\\.mean\\.Date|weighted\\.mean\\.default|weighted\\.mean\\.difftime|weighted\\.mean\\.POSIXct|weighted\\.mean\\.POSIXlt|weighted\\.residuals|weights|weights\\.default|weights\\.glm|weights\\.nls|wilcox\\.test|wilcox\\.test\\.default|wilcox\\.test\\.formula|Wilks|window|window\\.default|window\\.ts|write\\.ftable|xtabs)\\s*(\\()",
					"beginCaptures": {
						"1": {
							"name": "support.namespace.r"
						},
						"2": {
							"name": "punctuation.accessor.colons.r"
						},
						"3": {
							"name": "support.function.r"
						},
						"4": {
							"name": "punctuation.definition.arguments.begin.r"
						}
					},
					"end": "(\\))",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.arguments.end.r"
						}
					},
					"patterns": [
						{
							"include": "#function-call-arguments"
						}
					]
				},
				{
					"name": "meta.function-call.r",
					"contentName": "meta.function-call.arguments.r",
					"begin": "\\b(?:(utils)(::))?(adist|alarm|apropos|aregexec|argNames|argsAnywhere|as\\.bibentry|as\\.bibentry\\.bibentry|as\\.bibentry\\.citation|as\\.character\\.person|as\\.character\\.roman|as\\.data\\.frame\\.bibentry|as\\.data\\.frame\\.citation|as\\.data\\.frame\\.person|as\\.environment\\.hashtab|as\\.person|as\\.person\\.default|as\\.personList|as\\.personList\\.default|as\\.personList\\.person|as\\.relistable|as\\.roman|asDateBuilt|askYesNo|aspell|aspell_filter_LaTeX_commands_from_Aspell_tex_filter_info|aspell_filter_LaTeX_worker|aspell_find_dictionaries|aspell_find_program|aspell_inspect_context|aspell_package|aspell_package_C_files|aspell_package_description|aspell_package_pot_files|aspell_package_R_files|aspell_package_Rd_files|aspell_package_vignettes|aspell_query_wiktionary_categories|aspell_R_C_files|aspell_R_manuals|aspell_R_R_files|aspell_R_Rd_files|aspell_R_vignettes|aspell_update_dictionary|aspell_write_personal_dictionary_file|assignInMyNamespace|assignInNamespace|attachedPackageCompletions|available\\.packages|bibentry|blank_out_character_ranges|blank_out_ignores_in_lines|blank_out_regexp_matches|browseEnv|browseURL|browseVignettes|bug\\.report|bug\\.report\\.info|c\\.bibentry|c\\.person|capture\\.output|changedFiles|charClass|check_for_XQuartz|check_screen_device|checkCRAN|checkHT|chooseBioCmirror|chooseCRANmirror|citation|cite|citeNatbib|citEntry|citFooter|citHeader|close\\.socket|close\\.txtProgressBar|clrhash|combn|compareVersion|conformToProto|contrib\\.url|correctFilenameToken|count\\.fields|create\\.post|data|data\\.entry|dataentry|de|de\\.ncols|de\\.restore|de\\.setup|debugcall|debugger|defaultUserAgent|demo|download\\.file|download\\.packages|dump\\.frames|edit|edit\\.data\\.frame|edit\\.default|edit\\.matrix|edit\\.vignette|emacs|example|expr2token|file_test|file\\.edit|fileCompletionPreferred|fileCompletions|fileSnapshot|filter_packages_by_depends_predicates|find|find_files_in_directories|findCRANmirror|findExactMatches|findFuzzyMatches|findGeneric|findLineNum|findMatches|fix|fixInNamespace|flush\\.console|fnLineNum|format\\.aspell|format\\.aspell_inspect_context|format\\.bibentry|format\\.citation|format\\.hashtab|format\\.MethodsFunction|format\\.news_db|format\\.object_size|format\\.person|format\\.roman|formatOL|formatUL|functionArgs|fuzzyApropos|get_parse_data_for_message_strings|getAnywhere|getCRANmirrors|getDependencies|getFromNamespace|gethash|getIsFirstArg|getKnownS3generics|getParseData|getParseText|getRcode|getRcode\\.vignette|getS3method|getSrcByte|getSrcDirectory|getSrcfile|getSrcFilename|getSrcLocation|getSrcref|getTxtProgressBar|glob2rx|globalVariables|hashtab|hasName|head|head\\.array|head\\.default|head\\.ftable|head\\.function|head\\.matrix|help|help\\.request|help\\.search|help\\.start|helpCompletions|history|hsearch_db|hsearch_db_concepts|hsearch_db_keywords|index\\.search|inFunction|install\\.packages|installed\\.packages|is\\.hashtab|is\\.relistable|isBasePkg|isInsideQuotes|isS3method|isS3stdGeneric|keywordCompletions|length\\.hashtab|limitedLabels|loadedPackageCompletions|loadhistory|localeToCharset|ls\\.str|lsf\\.str|macDynLoads|maintainer|make_sysdata_rda|make\\.packages\\.html|make\\.socket|makeRegexpSafe|makeRweaveLatexCodeRunner|makeUserAgent|maphash|matchAvailableTopics|memory\\.limit|memory\\.size|menu|merge_demo_index|merge_vignette_index|methods|mirror2html|modifyList|new\\.packages|news|normalCompletions|nsl|numhash|object\\.size|offline_help_helper|old\\.packages|Ops\\.roman|package\\.skeleton|packageDate|packageDescription|packageName|packageStatus|packageVersion|page|person|personList|pico|print\\.aspell|print\\.aspell_inspect_context|print\\.bibentry|print\\.Bibtex|print\\.browseVignettes|print\\.changedFiles|print\\.citation|print\\.fileSnapshot|print\\.findLineNumResult|print\\.getAnywhere|print\\.hashtab|print\\.help_files_with_topic|print\\.hsearch|print\\.hsearch_db|print\\.Latex|print\\.ls_str|print\\.MethodsFunction|print\\.news_db|print\\.object_size|print\\.packageDescription|print\\.packageIQR|print\\.packageStatus|print\\.person|print\\.roman|print\\.sessionInfo|print\\.socket|print\\.summary\\.packageStatus|print\\.vignette|printhsearchInternal|process\\.events|prompt|prompt\\.data\\.frame|prompt\\.default|promptData|promptImport|promptPackage|rc\\.getOption|rc\\.options|rc\\.settings|rc\\.status|read\\.csv|read\\.csv2|read\\.delim|read\\.delim2|read\\.DIF|read\\.fortran|read\\.fwf|read\\.socket|read\\.table|readCitationFile|recover|registerNames|regquote|relist|relist\\.default|relist\\.factor|relist\\.list|relist\\.matrix|remhash|remove\\.packages|removeSource|rep\\.bibentry|rep\\.person|rep\\.roman|resolvePkgType|Rprof|Rprof_memory_summary|Rprofmem|RShowDoc|RSiteSearch|rtags|rtags\\.file|Rtangle|RtangleFinish|RtangleRuncode|RtangleSetup|RtangleWritedoc|RweaveChunkPrefix|RweaveEvalWithOpt|RweaveLatex|RweaveLatexFinish|RweaveLatexOptions|RweaveLatexRuncode|RweaveLatexSetup|RweaveLatexWritedoc|RweaveTryStop|savehistory|select\\.list|sessionInfo|setBreakpoint|sethash|setIsFirstArg|setRepositories|setTxtProgressBar|shorten\\.to\\.string|simplifyRepos|sort\\.bibentry|specialCompletions|specialFunctionArgs|specialOpCompletionsHelper|specialOpLocs|stack|stack\\.data\\.frame|stack\\.default|Stangle|str|str\\.data\\.frame|str\\.Date|str\\.default|str\\.hashtab|str\\.POSIXt|str2logical|strcapture|strextract|strOptions|strslice|subset\\.news_db|substr_with_tabs|summary\\.aspell|summary\\.packageStatus|Summary\\.roman|summaryRprof|suppressForeignCheck|Sweave|SweaveGetSyntax|SweaveHooks|SweaveParseOptions|SweaveReadFile|SweaveSyntConv|tail|tail\\.array|tail\\.default|tail\\.ftable|tail\\.function|tail\\.matrix|tar|timestamp|toBibtex|toBibtex\\.bibentry|toBibtex\\.person|toLatex|toLatex\\.sessionInfo|toLatexPDlist|topicName|transform\\.bibentry|txtProgressBar|type\\.convert|type\\.convert\\.data\\.frame|type\\.convert\\.default|type\\.convert\\.list|typhash|undebugcall|unique\\.bibentry|unique\\.person|unlist\\.relistable|unstack|unstack\\.data\\.frame|unstack\\.default|untar|untar2|unzip|update\\.packages|update\\.packageStatus|upgrade|upgrade\\.packageStatus|url\\.show|URLdecode|URLencode|vi|View|vignette|warnErrList|write\\.csv|write\\.csv2|write\\.ctags|write\\.etags|write\\.socket|write\\.table|wsbrowser|xedit|xemacs|zip)\\s*(\\()",
					"beginCaptures": {
						"1": {
							"name": "support.namespace.r"
						},
						"2": {
							"name": "punctuation.accessor.colons.r"
						},
						"3": {
							"name": "support.function.r"
						},
						"4": {
							"name": "punctuation.definition.arguments.begin.r"
						}
					},
					"end": "(\\))",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.arguments.end.r"
						}
					},
					"patterns": [
						{
							"include": "#function-call-arguments"
						}
					]
				}
			]
		},
		"comments": {
			"patterns": [
				{
					"name": "comment.line.pragma-mark.r",
					"match": "^(#pragma[ \\t]+mark)[ \\t](.*)",
					"captures": {
						"1": {
							"name": "comment.line.pragma.r"
						},
						"2": {
							"name": "entity.name.pragma.name.r"
						}
					}
				},
				{
					"begin": "(^[ \\t]+)?(?=#)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.whitespace.comment.leading.r"
						}
					},
					"end": "(?!\\G)",
					"patterns": [
						{
							"name": "comment.line.number-sign.r",
							"begin": "#",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.comment.r"
								}
							},
							"end": "\\n"
						}
					]
				}
			]
		},
		"constants": {
			"patterns": [
				{
					"name": "support.constant.misc.r",
					"match": "\\b(pi|letters|LETTERS|month\\.abb|month\\.name)\\b"
				},
				{
					"name": "constant.language.r",
					"match": "\\b(TRUE|FALSE|NULL|NA|NA_integer_|NA_real_|NA_complex_|NA_character_|Inf|NaN)\\b"
				},
				{
					"name": "constant.numeric.imaginary.hexadecimal.r",
					"match": "\\b0(x|X)[0-9a-fA-F]+i\\b"
				},
				{
					"name": "constant.numeric.imaginary.decimal.r",
					"match": "\\b[0-9]+\\.?[0-9]*(?:(e|E)(\\+|-)?[0-9]+)?i\\b"
				},
				{
					"name": "constant.numeric.imaginary.decimal.r",
					"match": "\\.[0-9]+(?:(e|E)(\\+|-)?[0-9]+)?i\\b"
				},
				{
					"name": "constant.numeric.integer.hexadecimal.r",
					"match": "\\b0(x|X)[0-9a-fA-F]+L\\b"
				},
				{
					"name": "constant.numeric.integer.decimal.r",
					"match": "\\b(?:[0-9]+\\.?[0-9]*)(?:(e|E)(\\+|-)?[0-9]+)?L\\b"
				},
				{
					"name": "constant.numeric.float.hexadecimal.r",
					"match": "\\b0(x|X)[0-9a-fA-F]+\\b"
				},
				{
					"name": "constant.numeric.float.decimal.r",
					"match": "\\b[0-9]+\\.?[0-9]*(?:(e|E)(\\+|-)?[0-9]+)?\\b"
				},
				{
					"name": "constant.numeric.float.decimal.r",
					"match": "\\.[0-9]+(?:(e|E)(\\+|-)?[0-9]+)?\\b"
				}
			]
		},
		"function-call-arguments": {
			"patterns": [
				{
					"name": "variable.parameter.function-call.r",
					"match": "(?:[a-zA-Z._][\\w.]*|`[^`]+`)(?=\\s*=[^=])"
				},
				{
					"begin": "(?==)",
					"end": "(?=[,)])",
					"patterns": [
						{
							"include": "source.r"
						}
					]
				},
				{
					"name": "punctuation.separator.parameters.r",
					"match": ","
				},
				{
					"include": "source.r"
				}
			]
		},
		"function-calls": {
			"name": "meta.function-call.r",
			"contentName": "meta.function-call.arguments.r",
			"begin": "(?:[a-zA-Z._][\\w.]*|`[^`]+`)\\s*(\\()",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.arguments.begin.r"
				}
			},
			"end": "(\\))",
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.arguments.end.r"
				}
			},
			"patterns": [
				{
					"include": "#function-call-arguments"
				}
			]
		},
		"function-declarations": {
			"patterns": [
				{
					"name": "meta.function.r",
					"contentName": "meta.function.parameters.r",
					"begin": "((?:[a-zA-Z._][\\w.]*|`[^`]+`))\\s*(<?<-|=(?!=))\\s*\\b(function)\\s*(\\()",
					"beginCaptures": {
						"1": {
							"name": "entity.name.function.r"
						},
						"2": {
							"name": "keyword.operator.assignment.r"
						},
						"3": {
							"name": "keyword.control.r"
						},
						"4": {
							"name": "punctuation.definition.parameters.begin.r"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.parameters.end.r"
						}
					},
					"patterns": [
						{
							"include": "#comments"
						},
						{
							"name": "variable.parameter.function.language.r",
							"match": "(?:[a-zA-Z._][\\w.]*|`[^`]+`)"
						},
						{
							"begin": "(?==)",
							"end": "(?=[,)])",
							"patterns": [
								{
									"include": "source.r"
								}
							]
						},
						{
							"name": "punctuation.separator.parameters.r",
							"match": ","
						}
					]
				}
			]
		},
		"keywords": {
			"patterns": [
				{
					"name": "keyword.control.conditional.if.r",
					"match": "\\bif\\b(?=\\s*\\()"
				},
				{
					"name": "keyword.control.conditional.else.r",
					"match": "\\belse\\b"
				},
				{
					"name": "keyword.control.flow.break.r",
					"match": "\\bbreak\\b"
				},
				{
					"name": "keyword.control.flow.continue.r",
					"match": "\\bnext\\b"
				},
				{
					"name": "keyword.control.flow.return.r",
					"match": "\\breturn(?=\\s*\\()"
				},
				{
					"name": "keyword.control.loop.repeat.r",
					"match": "\\brepeat\\b"
				},
				{
					"name": "keyword.control.loop.for.r",
					"match": "\\bfor\\b(?=\\s*\\()"
				},
				{
					"name": "keyword.control.loop.while.r",
					"match": "\\bwhile\\b(?=\\s*\\()"
				},
				{
					"name": "keyword.operator.word.r",
					"match": "\\bin\\b"
				}
			]
		},
		"lambda-functions": {
			"patterns": [
				{
					"name": "meta.function.r",
					"contentName": "meta.function.parameters.r",
					"begin": "\\b(function)\\s*(\\()",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.r"
						},
						"2": {
							"name": "punctuation.definition.parameters.begin.r"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.parameters.end.r"
						}
					},
					"patterns": [
						{
							"include": "#comments"
						},
						{
							"match": "(?:[a-zA-Z._][\\w.]*|`[^`]+`)",
							"name": "variable.parameter.function.language.r"
						},
						{
							"begin": "(?==)",
							"end": "(?=[,)])",
							"patterns": [
								{
									"include": "source.r"
								}
							]
						},
						{
							"match": ",",
							"name": "punctuation.separator.parameters.r"
						}
					]
				}
			]
		},
		"operators": {
			"patterns": [
				{
					"name": "keyword.operator.arithmetic.r",
					"match": "%[*/ox]%"
				},
				{
					"name": "keyword.operator.assignment.r",
					"match": "(<<-|->>)"
				},
				{
					"name": "keyword.operator.other.r",
					"match": "%(between|chin|do|dopar|in|like|\\+replace|\\+|:|T>|<>|>|\\$)%"
				},
				{
					"name": "keyword.other.r",
					"match": "\\.\\.\\."
				},
				{
					"name": "punctuation.accessor.colons.r",
					"match": ":::?"
				},
				{
					"name": "keyword.operator.arithmetic.r",
					"match": "(%%|\\*\\*)"
				},
				{
					"name": "keyword.operator.assignment.r",
					"match": "(<-|->)"
				},
				{
					"name": "keyword.operator.pipe.r",
					"match": "\\|>"
				},
				{
					"name": "keyword.operator.comparison.r",
					"match": "(==|!=|<>|<=?|>=?)"
				},
				{
					"name": "keyword.operator.logical.r",
					"match": "(&&?|\\|\\|?)"
				},
				{
					"name": "keyword.operator.other.r",
					"match": ":="
				},
				{
					"name": "keyword.operator.arithmetic.r",
					"match": "[-+*/^]"
				},
				{
					"name": "keyword.operator.assignment.r",
					"match": "="
				},
				{
					"name": "keyword.operator.logical.r",
					"match": "!"
				},
				{
					"name": "keyword.other.r",
					"match": "[:~@]"
				},
				{
					"name": "punctuation.terminator.semicolon.r",
					"match": ";"
				}
			]
		},
		"roxygen": {
			"patterns": [
				{
					"name": "comment.line.roxygen.r",
					"begin": "^\\s*(#')\\s*",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.comment.r"
						}
					},
					"end": "$\\n?",
					"patterns": [
						{
							"match": "(@param)\\s*((?:[a-zA-Z._][\\w.]*|`[^`]+`))",
							"captures": {
								"1": {
									"name": "keyword.other.r"
								},
								"2": {
									"name": "variable.parameter.r"
								}
							}
						},
						{
							"name": "keyword.other.r",
							"match": "@[a-zA-Z0-9]+"
						}
					]
				}
			]
		},
		"storage-type": {
			"patterns": [
				{
					"name": "meta.function-call.r",
					"contentName": "meta.function-call.arguments.r",
					"begin": "\\b(character|complex|double|expression|integer|list|logical|numeric|single|raw|pairlist)\\b\\s*(\\()",
					"beginCaptures": {
						"1": {
							"name": "storage.type.r"
						},
						"2": {
							"name": "punctuation.definition.arguments.begin.r"
						}
					},
					"end": "(\\))",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.arguments.end.r"
						}
					},
					"patterns": [
						{
							"include": "#function-call-arguments"
						}
					]
				}
			]
		},
		"strings": {
			"patterns": [
				{
					"name": "string.quoted.double.raw.r",
					"begin": "[rR]\"(-*)\\[",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.raw.begin.r"
						}
					},
					"end": "\\]\\1\"",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.raw.end.r"
						}
					}
				},
				{
					"name": "string.quoted.single.raw.r",
					"begin": "[rR]'(-*)\\[",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.raw.begin.r"
						}
					},
					"end": "\\]\\1'",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.raw.end.r"
						}
					}
				},
				{
					"name": "string.quoted.double.raw.r",
					"begin": "[rR]\"(-*)\\{",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.raw.begin.r"
						}
					},
					"end": "\\}\\1\"",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.raw.end.r"
						}
					}
				},
				{
					"name": "string.quoted.single.raw.r",
					"begin": "[rR]'(-*)\\{",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.raw.begin.r"
						}
					},
					"end": "\\}\\1'",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.raw.end.r"
						}
					}
				},
				{
					"name": "string.quoted.double.raw.r",
					"begin": "[rR]\"(-*)\\(",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.raw.begin.r"
						}
					},
					"end": "\\)\\1\"",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.raw.end.r"
						}
					}
				},
				{
					"name": "string.quoted.single.raw.r",
					"begin": "[rR]'(-*)\\(",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.raw.begin.r"
						}
					},
					"end": "\\)\\1'",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.raw.end.r"
						}
					}
				},
				{
					"name": "string.quoted.double.r",
					"begin": "\"",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.r"
						}
					},
					"end": "\"",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.r"
						}
					},
					"patterns": [
						{
							"name": "constant.character.escape.r",
							"match": "\\\\."
						}
					]
				},
				{
					"name": "string.quoted.single.r",
					"begin": "'",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.r"
						}
					},
					"end": "'",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.r"
						}
					},
					"patterns": [
						{
							"match": "\\\\.",
							"name": "constant.character.escape.r"
						}
					]
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/razor/.vscodeignore]---
Location: vscode-main/extensions/razor/.vscodeignore

```text
test/**
cgmanifest.json
build/**
```

--------------------------------------------------------------------------------

---[FILE: extensions/razor/cgmanifest.json]---
Location: vscode-main/extensions/razor/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "dotnet/razor",
					"repositoryUrl": "https://github.com/dotnet/razor",
					"commitHash": "9b1e979b6c3fe7cfbe30f595b9b0994d20bd482c"
				}
			},
			"license": "MIT",
			"version": "1.0.0",
			"licenseDetail": [
				"MIT License",
				"",
				"Copyright (c) .NET Foundation and Contributors",
				"All Rights Reserved",
				"",
				"Permission is hereby granted, free of charge, to any person obtaining a copy",
				"of this software and associated documentation files (the \"Software\"), to deal",
				"in the Software without restriction, including without limitation the rights",
				"to use, copy, modify, merge, publish, distribute, sublicense, and/or sell",
				"copies of the Software, and to permit persons to whom the Software is",
				"furnished to do so, subject to the following conditions:",
				"",
				"The above copyright notice and this permission notice shall be included in all",
				"copies or substantial portions of the Software.",
				"",
				"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
				"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,",
				"FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE",
				"AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER",
				"LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,",
				"OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE",
				"SOFTWARE."
			]
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/razor/language-configuration.json]---
Location: vscode-main/extensions/razor/language-configuration.json

```json
{
	"comments": {
		"blockComment": [ "<!--", "-->" ]
	},
	"brackets": [
		["<!--", "-->"],
		["{", "}"],
		["(", ")"]
	],
	"autoClosingPairs": [
		{ "open": "{", "close": "}"},
		{ "open": "[", "close": "]"},
		{ "open": "(", "close": ")" },
		{ "open": "'", "close": "'" },
		{ "open": "\"", "close": "\"" }
	],
	"surroundingPairs": [
		{ "open": "'", "close": "'" },
		{ "open": "\"", "close": "\"" },
		{ "open": "<", "close": ">" }
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/razor/package.json]---
Location: vscode-main/extensions/razor/package.json

```json
{
  "name": "razor",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "0.10.x"
  },
  "scripts": {
    "update-grammar": "node ./build/update-grammar.mjs"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "razor",
        "extensions": [
          ".cshtml",
          ".razor"
        ],
        "aliases": [
          "Razor",
          "razor"
        ],
        "mimetypes": [
          "text/x-cshtml"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "razor",
        "scopeName": "text.html.cshtml",
        "path": "./syntaxes/cshtml.tmLanguage.json",
        "embeddedLanguages": {
          "section.embedded.source.cshtml": "csharp",
          "source.css": "css",
          "source.js": "javascript"
        }
      }
    ]
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/razor/package.nls.json]---
Location: vscode-main/extensions/razor/package.nls.json

```json
{
	"displayName": "Razor Language Basics",
	"description": "Provides syntax highlighting, bracket matching and folding in Razor files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/razor/build/update-grammar.mjs]---
Location: vscode-main/extensions/razor/build/update-grammar.mjs

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check

import * as vscodeGrammarUpdater from 'vscode-grammar-updater';

function patchGrammar(grammar) {
	grammar.scopeName = 'text.html.cshtml';

	let patchCount = 0;

	let visit = function (rule, parent) {
		if (rule.include?.startsWith('text.html.basic')) {
			patchCount++;
			rule.include = 'text.html.derivative';
		}
		for (let property in rule) {
			let value = rule[property	];
			if (typeof value === 'object') {
				visit(value, { node: rule, property: property, parent: parent });
			}
		}
	};

	let roots = [grammar.repository, grammar.patterns];
	for (let root of roots) {
		for (let key in root) {
			visit(root[key], { node: root, property: key, parent: undefined });
		}
	}
	if (patchCount !== 4) {
		console.warn(`Expected to patch 4 occurrences of text.html.basic: Was ${patchCount}`);
	}

	return grammar;
}

const razorGrammarRepo = 'dotnet/razor';
const grammarPath = 'src/Razor/src/Microsoft.VisualStudio.RazorExtension/EmbeddedGrammars/aspnetcorerazor.tmLanguage.json';
vscodeGrammarUpdater.update(razorGrammarRepo, grammarPath, './syntaxes/cshtml.tmLanguage.json', grammar => patchGrammar(grammar), 'main');
```

--------------------------------------------------------------------------------

````
