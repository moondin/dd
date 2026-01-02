---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 69
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 69 of 552)

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

---[FILE: extensions/perl/syntaxes/perl.tmLanguage.json]---
Location: vscode-main/extensions/perl/syntaxes/perl.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/textmate/perl.tmbundle/blob/master/Syntaxes/Perl.plist",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/textmate/perl.tmbundle/commit/a85927a902d6e5d7805f56a653f324d34dfad53a",
	"name": "Perl",
	"scopeName": "source.perl",
	"comment": "\n\tTODO:\tInclude RegExp syntax\n",
	"patterns": [
		{
			"include": "#line_comment"
		},
		{
			"begin": "^(?==[a-zA-Z]+)",
			"end": "^(=cut\\b.*$)",
			"endCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#pod"
						}
					]
				}
			},
			"name": "comment.block.documentation.perl",
			"patterns": [
				{
					"include": "#pod"
				}
			]
		},
		{
			"include": "#variable"
		},
		{
			"applyEndPatternLast": 1,
			"begin": "\\b(?=qr\\s*[^\\s\\w])",
			"comment": "string.regexp.compile.perl",
			"end": "((([egimosxradlupcn]*)))(?=(\\s+\\S|\\s*[;\\,\\#\\{\\}\\)]|\\s*$))",
			"endCaptures": {
				"1": {
					"name": "string.regexp.compile.perl"
				},
				"2": {
					"name": "punctuation.definition.string.perl"
				},
				"3": {
					"name": "keyword.control.regexp-option.perl"
				}
			},
			"patterns": [
				{
					"begin": "(qr)\\s*\\{",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						},
						"1": {
							"name": "support.function.perl"
						}
					},
					"end": "\\}",
					"name": "string.regexp.compile.nested_braces.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						},
						{
							"include": "#variable"
						},
						{
							"include": "#nested_braces_interpolated"
						}
					]
				},
				{
					"begin": "(qr)\\s*\\[",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						},
						"1": {
							"name": "support.function.perl"
						}
					},
					"end": "\\]",
					"name": "string.regexp.compile.nested_brackets.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						},
						{
							"include": "#variable"
						},
						{
							"include": "#nested_brackets_interpolated"
						}
					]
				},
				{
					"begin": "(qr)\\s*<",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						},
						"1": {
							"name": "support.function.perl"
						}
					},
					"end": ">",
					"name": "string.regexp.compile.nested_ltgt.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						},
						{
							"include": "#variable"
						},
						{
							"include": "#nested_ltgt_interpolated"
						}
					]
				},
				{
					"begin": "(qr)\\s*\\(",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						},
						"1": {
							"name": "support.function.perl"
						}
					},
					"end": "\\)",
					"name": "string.regexp.compile.nested_parens.perl",
					"patterns": [
						{
							"comment": "This is to prevent thinks like qr/foo$/ to treat $/ as a variable",
							"match": "\\$(?=[^\\s\\w\\\\'\\{\\[\\(\\<])"
						},
						{
							"include": "#escaped_char"
						},
						{
							"include": "#variable"
						},
						{
							"include": "#nested_parens_interpolated"
						}
					]
				},
				{
					"begin": "(qr)\\s*'",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						},
						"1": {
							"name": "support.function.perl"
						}
					},
					"end": "'",
					"name": "string.regexp.compile.single-quote.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						}
					]
				},
				{
					"begin": "(qr)\\s*([^\\s\\w'\\{\\[\\(\\<])",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						},
						"1": {
							"name": "support.function.perl"
						}
					},
					"end": "\\2",
					"name": "string.regexp.compile.simple-delimiter.perl",
					"patterns": [
						{
							"comment": "This is to prevent thinks like qr/foo$/ to treat $/ as a variable",
							"match": "\\$(?=[^\\s\\w'\\{\\[\\(\\<])",
							"name": "keyword.control.anchor.perl"
						},
						{
							"include": "#escaped_char"
						},
						{
							"include": "#variable"
						},
						{
							"include": "#nested_parens_interpolated"
						}
					]
				}
			]
		},
		{
			"applyEndPatternLast": 1,
			"begin": "(?<!\\{|\\+|\\-)\\b(?=m\\s*[^\\sa-zA-Z0-9])",
			"comment": "string.regexp.find-m.perl",
			"end": "((([egimosxradlupcn]*)))(?=(\\s+\\S|\\s*[;\\,\\#\\{\\}\\)]|\\s*$))",
			"endCaptures": {
				"1": {
					"name": "string.regexp.find-m.perl"
				},
				"2": {
					"name": "punctuation.definition.string.perl"
				},
				"3": {
					"name": "keyword.control.regexp-option.perl"
				}
			},
			"patterns": [
				{
					"begin": "(m)\\s*\\{",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						},
						"1": {
							"name": "support.function.perl"
						}
					},
					"end": "\\}",
					"name": "string.regexp.find-m.nested_braces.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						},
						{
							"include": "#variable"
						},
						{
							"include": "#nested_braces_interpolated"
						}
					]
				},
				{
					"begin": "(m)\\s*\\[",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						},
						"1": {
							"name": "support.function.perl"
						}
					},
					"end": "\\]",
					"name": "string.regexp.find-m.nested_brackets.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						},
						{
							"include": "#variable"
						},
						{
							"include": "#nested_brackets_interpolated"
						}
					]
				},
				{
					"begin": "(m)\\s*<",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						},
						"1": {
							"name": "support.function.perl"
						}
					},
					"end": ">",
					"name": "string.regexp.find-m.nested_ltgt.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						},
						{
							"include": "#variable"
						},
						{
							"include": "#nested_ltgt_interpolated"
						}
					]
				},
				{
					"begin": "(m)\\s*\\(",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						},
						"1": {
							"name": "support.function.perl"
						}
					},
					"end": "\\)",
					"name": "string.regexp.find-m.nested_parens.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						},
						{
							"include": "#variable"
						},
						{
							"include": "#nested_parens_interpolated"
						}
					]
				},
				{
					"begin": "(m)\\s*'",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						},
						"1": {
							"name": "support.function.perl"
						}
					},
					"end": "'",
					"name": "string.regexp.find-m.single-quote.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						}
					]
				},
				{
					"begin": "\\G(?<!\\{|\\+|\\-)(m)(?!_)\\s*([^\\sa-zA-Z0-9'\\{\\[\\(\\<])",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						},
						"1": {
							"name": "support.function.perl"
						}
					},
					"end": "\\2",
					"name": "string.regexp.find-m.simple-delimiter.perl",
					"patterns": [
						{
							"comment": "This is to prevent thinks like qr/foo$/ to treat $/ as a variable",
							"match": "\\$(?=[^\\sa-zA-Z0-9'\\{\\[\\(\\<])",
							"name": "keyword.control.anchor.perl"
						},
						{
							"include": "#escaped_char"
						},
						{
							"include": "#variable"
						},
						{
							"begin": "\\[",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.character-class.begin.perl"
								}
							},
							"end": "\\]",
							"endCaptures": {
								"1": {
									"name": "punctuation.definition.character-class.end.perl"
								}
							},
							"name": "constant.other.character-class.set.perl",
							"patterns": [
								{
									"comment": "This is to prevent thinks like qr/foo$/ to treat $/ as a variable",
									"match": "\\$(?=[^\\s\\w'\\{\\[\\(\\<])",
									"name": "keyword.control.anchor.perl"
								},
								{
									"include": "#escaped_char"
								}
							]
						},
						{
							"include": "#nested_parens_interpolated"
						}
					]
				}
			]
		},
		{
			"applyEndPatternLast": 1,
			"begin": "\\b(?=(?<!\\&)(s)(\\s+\\S|\\s*[;\\,\\{\\}\\(\\)\\[<]|$))",
			"comment": "string.regexp.replace.perl",
			"end": "((([egimosxradlupcn]*)))(?=(\\s+\\S|\\s*[;\\,\\{\\}\\)\\]>]|\\s*$))",
			"endCaptures": {
				"1": {
					"name": "string.regexp.replace.perl"
				},
				"2": {
					"name": "punctuation.definition.string.perl"
				},
				"3": {
					"name": "keyword.control.regexp-option.perl"
				}
			},
			"patterns": [
				{
					"begin": "(s)\\s*\\{",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						},
						"1": {
							"name": "support.function.perl"
						}
					},
					"end": "\\}",
					"name": "string.regexp.nested_braces.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						},
						{
							"include": "#nested_braces"
						}
					]
				},
				{
					"begin": "(s)\\s*\\[",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						},
						"1": {
							"name": "support.function.perl"
						}
					},
					"end": "\\]",
					"name": "string.regexp.nested_brackets.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						},
						{
							"include": "#nested_brackets"
						}
					]
				},
				{
					"begin": "(s)\\s*<",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						},
						"1": {
							"name": "support.function.perl"
						}
					},
					"end": ">",
					"name": "string.regexp.nested_ltgt.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						},
						{
							"include": "#nested_ltgt"
						}
					]
				},
				{
					"begin": "(s)\\s*\\(",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						},
						"1": {
							"name": "support.function.perl"
						}
					},
					"end": "\\)",
					"name": "string.regexp.nested_parens.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						},
						{
							"include": "#nested_parens"
						}
					]
				},
				{
					"begin": "\\{",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						}
					},
					"end": "\\}",
					"name": "string.regexp.format.nested_braces.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						},
						{
							"include": "#variable"
						},
						{
							"include": "#nested_braces_interpolated"
						}
					]
				},
				{
					"begin": "\\[",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						}
					},
					"end": "\\]",
					"name": "string.regexp.format.nested_brackets.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						},
						{
							"include": "#variable"
						},
						{
							"include": "#nested_brackets_interpolated"
						}
					]
				},
				{
					"begin": "<",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						}
					},
					"end": ">",
					"name": "string.regexp.format.nested_ltgt.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						},
						{
							"include": "#variable"
						},
						{
							"include": "#nested_ltgt_interpolated"
						}
					]
				},
				{
					"begin": "\\(",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						}
					},
					"end": "\\)",
					"name": "string.regexp.format.nested_parens.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						},
						{
							"include": "#variable"
						},
						{
							"include": "#nested_parens_interpolated"
						}
					]
				},
				{
					"begin": "'",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						}
					},
					"end": "'",
					"name": "string.regexp.format.single_quote.perl",
					"patterns": [
						{
							"match": "\\\\['\\\\]",
							"name": "constant.character.escape.perl"
						}
					]
				},
				{
					"begin": "([^\\s\\w\\[({<;])",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						}
					},
					"end": "\\1",
					"name": "string.regexp.format.simple_delimiter.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						},
						{
							"include": "#variable"
						}
					]
				},
				{
					"match": "\\s+"
				}
			]
		},
		{
			"begin": "\\b(?=s([^\\sa-zA-Z0-9\\[({<]).*\\1([egimosxradlupcn]*)([\\}\\)\\;\\,]|\\s+))",
			"comment": "string.regexp.replaceXXX",
			"end": "((([egimosxradlupcn]*)))(?=([\\}\\)\\;\\,]|\\s+|\\s*$))",
			"endCaptures": {
				"1": {
					"name": "string.regexp.replace.perl"
				},
				"2": {
					"name": "punctuation.definition.string.perl"
				},
				"3": {
					"name": "keyword.control.regexp-option.perl"
				}
			},
			"patterns": [
				{
					"begin": "(s\\s*)([^\\sa-zA-Z0-9\\[({<])",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						},
						"1": {
							"name": "support.function.perl"
						}
					},
					"end": "(?=\\2)",
					"name": "string.regexp.replaceXXX.simple_delimiter.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						}
					]
				},
				{
					"begin": "'",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						}
					},
					"end": "'",
					"name": "string.regexp.replaceXXX.format.single_quote.perl",
					"patterns": [
						{
							"match": "\\\\['\\\\]",
							"name": "constant.character.escape.perl.perl"
						}
					]
				},
				{
					"begin": "([^\\sa-zA-Z0-9\\[({<])",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						}
					},
					"end": "\\1",
					"name": "string.regexp.replaceXXX.format.simple_delimiter.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						},
						{
							"include": "#variable"
						}
					]
				}
			]
		},
		{
			"begin": "\\b(?=(?<!\\\\)s\\s*([^\\s\\w\\[({<>]))",
			"comment": "string.regexp.replace.extended",
			"end": "((([egimosradlupc]*x[egimosradlupc]*)))\\b",
			"endCaptures": {
				"1": {
					"name": "string.regexp.replace.perl"
				},
				"2": {
					"name": "punctuation.definition.string.perl"
				},
				"3": {
					"name": "keyword.control.regexp-option.perl"
				}
			},
			"patterns": [
				{
					"begin": "(s)\\s*(.)",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						},
						"1": {
							"name": "support.function.perl"
						}
					},
					"end": "(?=\\2)",
					"name": "string.regexp.replace.extended.simple_delimiter.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						}
					]
				},
				{
					"begin": "'",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						}
					},
					"end": "'(?=[egimosradlupc]*x[egimosradlupc]*)\\b",
					"name": "string.regexp.replace.extended.simple_delimiter.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						}
					]
				},
				{
					"begin": "(.)",
					"captures": {
						"0": {
							"name": "punctuation.definition.string.perl"
						}
					},
					"end": "\\1(?=[egimosradlupc]*x[egimosradlupc]*)\\b",
					"name": "string.regexp.replace.extended.simple_delimiter.perl",
					"patterns": [
						{
							"include": "#escaped_char"
						},
						{
							"include": "#variable"
						}
					]
				}
			]
		},
		{
			"begin": "(?<=\\(|\\{|~|&|\\||if|unless|^)\\s*((\\/))",
			"beginCaptures": {
				"1": {
					"name": "string.regexp.find.perl"
				},
				"2": {
					"name": "punctuation.definition.string.perl"
				}
			},
			"contentName": "string.regexp.find.perl",
			"end": "((\\1([egimosxradlupcn]*)))(?=(\\s+\\S|\\s*[;\\,\\#\\{\\}\\)]|\\s*$))",
			"endCaptures": {
				"1": {
					"name": "string.regexp.find.perl"
				},
				"2": {
					"name": "punctuation.definition.string.perl"
				},
				"3": {
					"name": "keyword.control.regexp-option.perl"
				}
			},
			"patterns": [
				{
					"comment": "This is to prevent thinks like /foo$/ to treat $/ as a variable",
					"match": "\\$(?=\\/)",
					"name": "keyword.control.anchor.perl"
				},
				{
					"include": "#escaped_char"
				},
				{
					"include": "#variable"
				}
			]
		},
		{
			"captures": {
				"1": {
					"name": "constant.other.key.perl"
				}
			},
			"match": "\\b(\\w+)\\s*(?==>)"
		},
		{
			"match": "(?<={)\\s*\\w+\\s*(?=})",
			"name": "constant.other.bareword.perl"
		},
		{
			"captures": {
				"1": {
					"name": "keyword.control.perl"
				},
				"2": {
					"name": "entity.name.type.class.perl"
				}
			},
			"match": "^\\s*(package)\\s+([^\\s;]+)",
			"name": "meta.class.perl"
		},
		{
			"captures": {
				"1": {
					"name": "storage.type.sub.perl"
				},
				"2": {
					"name": "entity.name.function.perl"
				},
				"3": {
					"name": "storage.type.method.perl"
				}
			},
			"match": "\\b(sub)(?:\\s+([-a-zA-Z0-9_]+))?\\s*(?:\\([\\$\\@\\*;]*\\))?[^\\w\\{]",
			"name": "meta.function.perl"
		},
		{
			"captures": {
				"1": {
					"name": "entity.name.function.perl"
				},
				"2": {
					"name": "punctuation.definition.parameters.perl"
				},
				"3": {
					"name": "variable.parameter.function.perl"
				}
			},
			"match": "^\\s*(BEGIN|UNITCHECK|CHECK|INIT|END|DESTROY)\\b",
			"name": "meta.function.perl"
		},
		{
			"begin": "^(?=(\\t| {4}))",
			"end": "(?=[^\\t\\s])",
			"name": "meta.leading-tabs",
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "meta.odd-tab"
						},
						"2": {
							"name": "meta.even-tab"
						}
					},
					"match": "(\\t| {4})(\\t| {4})?"
				}
			]
		},
		{
			"captures": {
				"1": {
					"name": "support.function.perl"
				},
				"2": {
					"name": "punctuation.definition.string.perl"
				},
				"5": {
					"name": "punctuation.definition.string.perl"
				},
				"8": {
					"name": "punctuation.definition.string.perl"
				}
			},
			"match": "\\b(tr|y)\\s*([^A-Za-z0-9\\s])(.*?)(?<!\\\\)(\\\\{2})*(\\2)(.*?)(?<!\\\\)(\\\\{2})*(\\2)",
			"name": "string.regexp.replace.perl"
		},
		{
			"match": "\\b(__FILE__|__LINE__|__PACKAGE__|__SUB__)\\b",
			"name": "constant.language.perl"
		},
		{
			"begin": "\\b(__DATA__|__END__)\\n?",
			"beginCaptures": {
				"1": {
					"name": "constant.language.perl"
				}
			},
			"contentName": "comment.block.documentation.perl",
			"end": "\\z",
			"patterns": [
				{
					"include": "#pod"
				}
			]
		},
		{
			"match": "(?<!->)\\b(continue|default|die|do|else|elsif|exit|for|foreach|given|goto|if|last|next|redo|return|select|unless|until|wait|when|while|switch|case|require|use|eval)\\b",
			"name": "keyword.control.perl"
		},
		{
			"match": "\\b(my|our|local)\\b",
			"name": "storage.modifier.perl"
		},
		{
			"match": "(?<!\\w)\\-[rwxoRWXOezsfdlpSbctugkTBMAC]\\b",
			"name": "keyword.operator.filetest.perl"
		},
		{
			"match": "\\b(and|or|xor|as|not)\\b",
			"name": "keyword.operator.logical.perl"
		},
		{
			"match": "(<=>|=>|->)",
			"name": "keyword.operator.comparison.perl"
		},
		{
			"include": "#heredoc"
		},
		{
			"begin": "\\bqq\\s*([^\\(\\{\\[\\<\\w\\s])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "\\1",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.quoted.other.qq.perl",
			"patterns": [
				{
					"include": "#escaped_char"
				},
				{
					"include": "#variable"
				}
			]
		},
		{
			"begin": "\\bqx\\s*([^'\\(\\{\\[\\<\\w\\s])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "\\1",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.interpolated.qx.perl",
			"patterns": [
				{
					"include": "#escaped_char"
				},
				{
					"include": "#variable"
				}
			]
		},
		{
			"begin": "\\bqx\\s*'",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "'",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.interpolated.qx.single-quote.perl",
			"patterns": [
				{
					"include": "#escaped_char"
				}
			]
		},
		{
			"begin": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "\"",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.quoted.double.perl",
			"patterns": [
				{
					"include": "#escaped_char"
				},
				{
					"include": "#variable"
				}
			]
		},
		{
			"begin": "(?<!->)\\bqw?\\s*([^\\(\\{\\[\\<\\w\\s])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "\\1",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.quoted.other.q.perl"
		},
		{
			"begin": "'",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "'",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.quoted.single.perl",
			"patterns": [
				{
					"match": "\\\\['\\\\]",
					"name": "constant.character.escape.perl"
				}
			]
		},
		{
			"begin": "`",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "`",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.interpolated.perl",
			"patterns": [
				{
					"include": "#escaped_char"
				},
				{
					"include": "#variable"
				}
			]
		},
		{
			"begin": "(?<!->)\\bqq\\s*\\(",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.quoted.other.qq-paren.perl",
			"patterns": [
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nested_parens_interpolated"
				},
				{
					"include": "#variable"
				}
			]
		},
		{
			"begin": "\\bqq\\s*\\{",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "\\}",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.quoted.other.qq-brace.perl",
			"patterns": [
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nested_braces_interpolated"
				},
				{
					"include": "#variable"
				}
			]
		},
		{
			"begin": "\\bqq\\s*\\[",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "\\]",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.quoted.other.qq-bracket.perl",
			"patterns": [
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nested_brackets_interpolated"
				},
				{
					"include": "#variable"
				}
			]
		},
		{
			"begin": "\\bqq\\s*\\<",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "\\>",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.quoted.other.qq-ltgt.perl",
			"patterns": [
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nested_ltgt_interpolated"
				},
				{
					"include": "#variable"
				}
			]
		},
		{
			"begin": "(?<!->)\\bqx\\s*\\(",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.interpolated.qx-paren.perl",
			"patterns": [
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nested_parens_interpolated"
				},
				{
					"include": "#variable"
				}
			]
		},
		{
			"begin": "\\bqx\\s*\\{",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "\\}",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.interpolated.qx-brace.perl",
			"patterns": [
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nested_braces_interpolated"
				},
				{
					"include": "#variable"
				}
			]
		},
		{
			"begin": "\\bqx\\s*\\[",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "\\]",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.interpolated.qx-bracket.perl",
			"patterns": [
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nested_brackets_interpolated"
				},
				{
					"include": "#variable"
				}
			]
		},
		{
			"begin": "\\bqx\\s*\\<",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "\\>",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.interpolated.qx-ltgt.perl",
			"patterns": [
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nested_ltgt_interpolated"
				},
				{
					"include": "#variable"
				}
			]
		},
		{
			"begin": "(?<!->)\\bqw?\\s*\\(",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.quoted.other.q-paren.perl",
			"patterns": [
				{
					"include": "#nested_parens"
				}
			]
		},
		{
			"begin": "\\bqw?\\s*\\{",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "\\}",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.quoted.other.q-brace.perl",
			"patterns": [
				{
					"include": "#nested_braces"
				}
			]
		},
		{
			"begin": "\\bqw?\\s*\\[",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "\\]",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.quoted.other.q-bracket.perl",
			"patterns": [
				{
					"include": "#nested_brackets"
				}
			]
		},
		{
			"begin": "\\bqw?\\s*\\<",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "\\>",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.quoted.other.q-ltgt.perl",
			"patterns": [
				{
					"include": "#nested_ltgt"
				}
			]
		},
		{
			"begin": "^__\\w+__",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "$",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.unquoted.program-block.perl"
		},
		{
			"begin": "\\b(format)\\s+(\\w+)\\s*=",
			"beginCaptures": {
				"1": {
					"name": "support.function.perl"
				},
				"2": {
					"name": "entity.name.function.format.perl"
				}
			},
			"end": "^\\.\\s*$",
			"name": "meta.format.perl",
			"patterns": [
				{
					"include": "#line_comment"
				},
				{
					"include": "#variable"
				}
			]
		},
		{
			"captures": {
				"1": {
					"name": "support.function.perl"
				},
				"2": {
					"name": "entity.name.function.perl"
				}
			},
			"match": "\\b(x)\\s*(\\d+)\\b"
		},
		{
			"match": "\\b(ARGV|DATA|ENV|SIG|STDERR|STDIN|STDOUT|atan2|bind|binmode|bless|caller|chdir|chmod|chomp|chop|chown|chr|chroot|close|closedir|cmp|connect|cos|crypt|dbmclose|dbmopen|defined|delete|dump|each|endgrent|endhostent|endnetent|endprotoent|endpwent|endservent|eof|eq|eval|exec|exists|exp|fcntl|fileno|flock|fork|formline|ge|getc|getgrent|getgrgid|getgrnam|gethostbyaddr|gethostbyname|gethostent|getlogin|getnetbyaddr|getnetbyname|getnetent|getpeername|getpgrp|getppid|getpriority|getprotobyname|getprotobynumber|getprotoent|getpwent|getpwnam|getpwuid|getservbyname|getservbyport|getservent|getsockname|getsockopt|glob|gmtime|grep|gt|hex|import|index|int|ioctl|join|keys|kill|lc|lcfirst|le|length|link|listen|local|localtime|log|lstat|lt|m|map|mkdir|msgctl|msgget|msgrcv|msgsnd|ne|no|oct|open|opendir|ord|pack|pipe|pop|pos|print|printf|push|quotemeta|rand|read|readdir|readlink|recv|ref|rename|reset|reverse|rewinddir|rindex|rmdir|s|say|scalar|seek|seekdir|semctl|semget|semop|send|setgrent|sethostent|setnetent|setpgrp|setpriority|setprotoent|setpwent|setservent|setsockopt|shift|shmctl|shmget|shmread|shmwrite|shutdown|sin|sleep|socket|socketpair|sort|splice|split|sprintf|sqrt|srand|stat|study|substr|symlink|syscall|sysopen|sysread|system|syswrite|tell|telldir|tie|tied|time|times|tr|truncate|uc|ucfirst|umask|undef|unlink|unpack|unshift|untie|utime|values|vec|waitpid|wantarray|warn|write|y)\\b",
			"name": "support.function.perl"
		},
		{
			"captures": {
				"1": {
					"name": "punctuation.section.scope.begin.perl"
				},
				"2": {
					"name": "punctuation.section.scope.end.perl"
				}
			},
			"comment": "Match empty brackets for ↩ snippet",
			"match": "(\\{)(\\})"
		},
		{
			"captures": {
				"1": {
					"name": "punctuation.section.scope.begin.perl"
				},
				"2": {
					"name": "punctuation.section.scope.end.perl"
				}
			},
			"comment": "Match empty parenthesis for ↩ snippet",
			"match": "(\\()(\\))"
		}
	],
	"repository": {
		"escaped_char": {
			"patterns": [
				{
					"match": "\\\\\\d+",
					"name": "constant.character.escape.perl"
				},
				{
					"match": "\\\\c[^\\s\\\\]",
					"name": "constant.character.escape.perl"
				},
				{
					"match": "\\\\g(?:\\{(?:\\w*|-\\d+)\\}|\\d+)",
					"name": "constant.character.escape.perl"
				},
				{
					"match": "\\\\k(?:\\{\\w*\\}|<\\w*>|'\\w*')",
					"name": "constant.character.escape.perl"
				},
				{
					"match": "\\\\N\\{[^\\}]*\\}",
					"name": "constant.character.escape.perl"
				},
				{
					"match": "\\\\o\\{\\d*\\}",
					"name": "constant.character.escape.perl"
				},
				{
					"match": "\\\\(?:p|P)(?:\\{\\w*\\}|P)",
					"name": "constant.character.escape.perl"
				},
				{
					"match": "\\\\x(?:[0-9a-zA-Z]{2}|\\{\\w*\\})?",
					"name": "constant.character.escape.perl"
				},
				{
					"match": "\\\\.",
					"name": "constant.character.escape.perl"
				}
			]
		},
		"heredoc": {
			"patterns": [
				{
					"begin": "((((<<(~)?) *')(HTML)(')))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.raw.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.raw.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.raw.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					},
					"name": "meta.embedded.block.html",
					"patterns": [
						{
							"begin": "^",
							"end": "\\n",
							"name": "text.html.basic",
							"patterns": [
								{
									"include": "text.html.basic"
								}
							]
						}
					]
				},
				{
					"begin": "((((<<(~)?) *')(XML)(')))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.raw.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.raw.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.raw.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					},
					"name": "meta.embedded.block.xml",
					"patterns": [
						{
							"begin": "^",
							"end": "\\n",
							"name": "text.xml",
							"patterns": [
								{
									"include": "text.xml"
								}
							]
						}
					]
				},
				{
					"begin": "((((<<(~)?) *')(CSS)(')))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.raw.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.raw.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.raw.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					},
					"name": "meta.embedded.block.css",
					"patterns": [
						{
							"begin": "^",
							"end": "\\n",
							"name": "source.css",
							"patterns": [
								{
									"include": "source.css"
								}
							]
						}
					]
				},
				{
					"begin": "((((<<(~)?) *')(JAVASCRIPT)(')))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.raw.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.raw.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.raw.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					},
					"name": "meta.embedded.block.js",
					"patterns": [
						{
							"begin": "^",
							"end": "\\n",
							"name": "source.js",
							"patterns": [
								{
									"include": "source.js"
								}
							]
						}
					]
				},
				{
					"begin": "((((<<(~)?) *')(SQL)(')))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.raw.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.raw.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.raw.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					},
					"name": "meta.embedded.block.sql",
					"patterns": [
						{
							"begin": "^",
							"end": "\\n",
							"name": "source.sql",
							"patterns": [
								{
									"include": "source.sql"
								}
							]
						}
					]
				},
				{
					"begin": "((((<<(~)?) *')(POSTSCRIPT)(')))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.raw.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.raw.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.raw.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					},
					"name": "meta.embedded.block.postscript",
					"patterns": [
						{
							"begin": "^",
							"end": "\\n",
							"name": "source.postscript",
							"patterns": [
								{
									"include": "source.postscript"
								}
							]
						}
					]
				},
				{
					"begin": "((((<<(~)?) *')([^']*)(')))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.raw.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.raw.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.raw.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					}
				},
				{
					"begin": "((((<<(~)?) *\\\\)((?![=\\d\\$\\( ])[^;,'\"`\\s\\)]*)()))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.raw.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.raw.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.raw.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					}
				},
				{
					"begin": "((((<<(~)?) *\")(HTML)(\")))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.interpolated.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					},
					"name": "meta.embedded.block.html",
					"patterns": [
						{
							"begin": "^",
							"end": "\\n",
							"name": "text.html.basic",
							"patterns": [
								{
									"include": "#escaped_char"
								},
								{
									"include": "#variable"
								},
								{
									"include": "text.html.basic"
								}
							]
						}
					]
				},
				{
					"begin": "((((<<(~)?) *\")(XML)(\")))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.interpolated.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					},
					"name": "meta.embedded.block.xml",
					"patterns": [
						{
							"begin": "^",
							"end": "\\n",
							"name": "text.xml",
							"patterns": [
								{
									"include": "#escaped_char"
								},
								{
									"include": "#variable"
								},
								{
									"include": "text.xml"
								}
							]
						}
					]
				},
				{
					"begin": "((((<<(~)?) *\")(CSS)(\")))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.interpolated.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					},
					"name": "meta.embedded.block.css",
					"patterns": [
						{
							"begin": "^",
							"end": "\\n",
							"name": "source.css",
							"patterns": [
								{
									"include": "#escaped_char"
								},
								{
									"include": "#variable"
								},
								{
									"include": "source.css"
								}
							]
						}
					]
				},
				{
					"begin": "((((<<(~)?) *\")(JAVASCRIPT)(\")))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.interpolated.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					},
					"name": "meta.embedded.block.js",
					"patterns": [
						{
							"begin": "^",
							"end": "\\n",
							"name": "source.js",
							"patterns": [
								{
									"include": "#escaped_char"
								},
								{
									"include": "#variable"
								},
								{
									"include": "source.js"
								}
							]
						}
					]
				},
				{
					"begin": "((((<<(~)?) *\")(SQL)(\")))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.interpolated.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					},
					"name": "meta.embedded.block.sql",
					"patterns": [
						{
							"begin": "^",
							"end": "\\n",
							"name": "source.sql",
							"patterns": [
								{
									"include": "#escaped_char"
								},
								{
									"include": "#variable"
								},
								{
									"include": "source.sql"
								}
							]
						}
					]
				},
				{
					"begin": "((((<<(~)?) *\")(POSTSCRIPT)(\")))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.interpolated.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					},
					"name": "meta.embedded.block.postscript",
					"patterns": [
						{
							"begin": "^",
							"end": "\\n",
							"name": "source.postscript",
							"patterns": [
								{
									"include": "#escaped_char"
								},
								{
									"include": "#variable"
								},
								{
									"include": "source.postscript"
								}
							]
						}
					]
				},
				{
					"begin": "((((<<(~)?) *\")([^\"]*)(\")))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.interpolated.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					},
					"patterns": [
						{
							"include": "#escaped_char"
						},
						{
							"include": "#variable"
						}
					]
				},
				{
					"begin": "((((<<(~)?) *)(HTML)()))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.interpolated.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					},
					"name": "meta.embedded.block.html",
					"patterns": [
						{
							"begin": "^",
							"end": "\\n",
							"name": "text.html.basic",
							"patterns": [
								{
									"include": "#escaped_char"
								},
								{
									"include": "#variable"
								},
								{
									"include": "text.html.basic"
								}
							]
						}
					]
				},
				{
					"begin": "((((<<(~)?) *)(XML)()))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.interpolated.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					},
					"name": "meta.embedded.block.xml",
					"patterns": [
						{
							"begin": "^",
							"end": "\\n",
							"name": "text.xml",
							"patterns": [
								{
									"include": "#escaped_char"
								},
								{
									"include": "#variable"
								},
								{
									"include": "text.xml"
								}
							]
						}
					]
				},
				{
					"begin": "((((<<(~)?) *)(CSS)()))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.interpolated.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					},
					"name": "meta.embedded.block.css",
					"patterns": [
						{
							"begin": "^",
							"end": "\\n",
							"name": "source.css",
							"patterns": [
								{
									"include": "#escaped_char"
								},
								{
									"include": "#variable"
								},
								{
									"include": "source.css"
								}
							]
						}
					]
				},
				{
					"begin": "((((<<(~)?) *)(JAVASCRIPT)()))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.interpolated.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					},
					"name": "meta.embedded.block.js",
					"patterns": [
						{
							"begin": "^",
							"end": "\\n",
							"name": "source.js",
							"patterns": [
								{
									"include": "#escaped_char"
								},
								{
									"include": "#variable"
								},
								{
									"include": "source.js"
								}
							]
						}
					]
				},
				{
					"begin": "((((<<(~)?) *)(SQL)()))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.interpolated.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					},
					"name": "meta.embedded.block.sql",
					"patterns": [
						{
							"begin": "^",
							"end": "\\n",
							"name": "source.sql",
							"patterns": [
								{
									"include": "#escaped_char"
								},
								{
									"include": "#variable"
								},
								{
									"include": "source.sql"
								}
							]
						}
					]
				},
				{
					"begin": "((((<<(~)?) *)(POSTSCRIPT)()))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.interpolated.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					},
					"name": "meta.embedded.block.postscript",
					"patterns": [
						{
							"begin": "^",
							"end": "\\n",
							"name": "source.postscript",
							"patterns": [
								{
									"include": "#escaped_char"
								},
								{
									"include": "#variable"
								},
								{
									"include": "source.postscript"
								}
							]
						}
					]
				},
				{
					"begin": "((((<<(~)?) *)((?![=\\d\\$\\( ])[^;,'\"`\\s\\)]*)()))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.interpolated.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					},
					"patterns": [
						{
							"include": "#escaped_char"
						},
						{
							"include": "#variable"
						}
					]
				},
				{
					"begin": "((((<<(~)?) *`)([^`]*)(`)))(.*)\\n?",
					"beginCaptures": {
						"1": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"2": {
							"name": "punctuation.definition.string.begin.perl"
						},
						"3": {
							"name": "punctuation.definition.delimiter.begin.perl"
						},
						"7": {
							"name": "punctuation.definition.delimiter.end.perl"
						},
						"8": {
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					},
					"contentName": "string.unquoted.heredoc.shell.perl",
					"end": "^((?!\\5)\\s+)?((\\6))$",
					"endCaptures": {
						"2": {
							"name": "string.unquoted.heredoc.interpolated.perl"
						},
						"3": {
							"name": "punctuation.definition.string.end.perl"
						}
					},
					"patterns": [
						{
							"include": "#escaped_char"
						},
						{
							"include": "#variable"
						}
					]
				}
			]
		},
		"line_comment": {
			"patterns": [
				{
					"begin": "(^[ \\t]+)?(?=#)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.whitespace.comment.leading.perl"
						}
					},
					"end": "(?!\\G)",
					"patterns": [
						{
							"begin": "#",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.comment.perl"
								}
							},
							"end": "\\n",
							"name": "comment.line.number-sign.perl"
						}
					]
				}
			]
		},
		"nested_braces": {
			"begin": "\\{",
			"captures": {
				"1": {
					"name": "punctuation.section.scope.perl"
				}
			},
			"end": "\\}",
			"patterns": [
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nested_braces"
				}
			]
		},
		"nested_braces_interpolated": {
			"begin": "\\{",
			"captures": {
				"1": {
					"name": "punctuation.section.scope.perl"
				}
			},
			"end": "\\}",
			"patterns": [
				{
					"include": "#escaped_char"
				},
				{
					"include": "#variable"
				},
				{
					"include": "#nested_braces_interpolated"
				}
			]
		},
		"nested_brackets": {
			"begin": "\\[",
			"captures": {
				"1": {
					"name": "punctuation.section.scope.perl"
				}
			},
			"end": "\\]",
			"patterns": [
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nested_brackets"
				}
			]
		},
		"nested_brackets_interpolated": {
			"begin": "\\[",
			"captures": {
				"1": {
					"name": "punctuation.section.scope.perl"
				}
			},
			"end": "\\]",
			"patterns": [
				{
					"include": "#escaped_char"
				},
				{
					"include": "#variable"
				},
				{
					"include": "#nested_brackets_interpolated"
				}
			]
		},
		"nested_ltgt": {
			"begin": "<",
			"captures": {
				"1": {
					"name": "punctuation.section.scope.perl"
				}
			},
			"end": ">",
			"patterns": [
				{
					"include": "#nested_ltgt"
				}
			]
		},
		"nested_ltgt_interpolated": {
			"begin": "<",
			"captures": {
				"1": {
					"name": "punctuation.section.scope.perl"
				}
			},
			"end": ">",
			"patterns": [
				{
					"include": "#variable"
				},
				{
					"include": "#nested_ltgt_interpolated"
				}
			]
		},
		"nested_parens": {
			"begin": "\\(",
			"captures": {
				"1": {
					"name": "punctuation.section.scope.perl"
				}
			},
			"end": "\\)",
			"patterns": [
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nested_parens"
				}
			]
		},
		"nested_parens_interpolated": {
			"begin": "\\(",
			"captures": {
				"1": {
					"name": "punctuation.section.scope.perl"
				}
			},
			"end": "\\)",
			"patterns": [
				{
					"comment": "This is to prevent thinks like qr/foo$/ to treat $/ as a variable",
					"match": "\\$(?=[^\\s\\w'\\{\\[\\(\\<])",
					"name": "keyword.control.anchor.perl"
				},
				{
					"include": "#escaped_char"
				},
				{
					"include": "#variable"
				},
				{
					"include": "#nested_parens_interpolated"
				}
			]
		},
		"pod": {
			"patterns": [
				{
					"match": "^=(pod|back|cut)\\b",
					"name": "storage.type.class.pod.perl"
				},
				{
					"begin": "^(=begin)\\s+(html)\\s*$",
					"beginCaptures": {
						"1": {
							"name": "storage.type.class.pod.perl"
						},
						"2": {
							"name": "variable.other.pod.perl"
						}
					},
					"contentName": "text.embedded.html.basic",
					"end": "^(=end)\\s+(html)|^(?==cut)",
					"endCaptures": {
						"1": {
							"name": "storage.type.class.pod.perl"
						},
						"2": {
							"name": "variable.other.pod.perl"
						}
					},
					"name": "meta.embedded.pod.perl",
					"patterns": [
						{
							"include": "text.html.basic"
						}
					]
				},
				{
					"captures": {
						"1": {
							"name": "storage.type.class.pod.perl"
						},
						"2": {
							"name": "variable.other.pod.perl",
							"patterns": [
								{
									"include": "#pod-formatting"
								}
							]
						}
					},
					"match": "^(=(?:head[1-4]|item|over|encoding|begin|end|for))\\b\\s*(.*)"
				},
				{
					"include": "#pod-formatting"
				}
			]
		},
		"pod-formatting": {
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "markup.italic.pod.perl"
						},
						"2": {
							"name": "markup.italic.pod.perl"
						}
					},
					"match": "I(?:<([^<>]+)>|<+(\\s+(?:(?<!\\s)>|[^>])+\\s+)>+)",
					"name": "entity.name.type.instance.pod.perl"
				},
				{
					"captures": {
						"1": {
							"name": "markup.bold.pod.perl"
						},
						"2": {
							"name": "markup.bold.pod.perl"
						}
					},
					"match": "B(?:<([^<>]+)>|<+(\\s+(?:(?<!\\s)>|[^>])+\\s+)>+)",
					"name": "entity.name.type.instance.pod.perl"
				},
				{
					"captures": {
						"1": {
							"name": "markup.raw.pod.perl"
						},
						"2": {
							"name": "markup.raw.pod.perl"
						}
					},
					"match": "C(?:<([^<>]+)>|<+(\\\\s+(?:(?<!\\\\s)>|[^>])+\\\\s+)>+)",
					"name": "entity.name.type.instance.pod.perl"
				},
				{
					"captures": {
						"1": {
							"name": "markup.underline.link.hyperlink.pod.perl"
						}
					},
					"match": "L<([^>]+)>",
					"name": "entity.name.type.instance.pod.perl"
				},
				{
					"match": "[EFSXZ]<[^>]*>",
					"name": "entity.name.type.instance.pod.perl"
				}
			]
		},
		"variable": {
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.variable.perl"
						}
					},
					"match": "(\\$)&(?![A-Za-z0-9_])",
					"name": "variable.other.regexp.match.perl"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.variable.perl"
						}
					},
					"match": "(\\$)`(?![A-Za-z0-9_])",
					"name": "variable.other.regexp.pre-match.perl"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.variable.perl"
						}
					},
					"match": "(\\$)'(?![A-Za-z0-9_])",
					"name": "variable.other.regexp.post-match.perl"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.variable.perl"
						}
					},
					"match": "(\\$)\\+(?![A-Za-z0-9_])",
					"name": "variable.other.regexp.last-paren-match.perl"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.variable.perl"
						}
					},
					"match": "(\\$)\"(?![A-Za-z0-9_])",
					"name": "variable.other.readwrite.list-separator.perl"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.variable.perl"
						}
					},
					"match": "(\\$)0(?![A-Za-z0-9_])",
					"name": "variable.other.predefined.program-name.perl"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.variable.perl"
						}
					},
					"match": "(\\$)[_ab\\*\\.\\/\\|,\\\\;#%=\\-~^:?!\\$<>\\(\\)\\[\\]@](?![A-Za-z0-9_])",
					"name": "variable.other.predefined.perl"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.variable.perl"
						}
					},
					"match": "(\\$)[0-9]+(?![A-Za-z0-9_])",
					"name": "variable.other.subpattern.perl"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.variable.perl"
						}
					},
					"match": "([\\$\\@\\%](#)?)([a-zA-Zx7f-xff\\$]|::)([a-zA-Z0-9_x7f-xff\\$]|::)*\\b",
					"name": "variable.other.readwrite.global.perl"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.variable.perl"
						},
						"2": {
							"name": "punctuation.definition.variable.perl"
						}
					},
					"match": "(\\$\\{)(?:[a-zA-Zx7f-xff\\$]|::)(?:[a-zA-Z0-9_x7f-xff\\$]|::)*(\\})",
					"name": "variable.other.readwrite.global.perl"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.variable.perl"
						}
					},
					"match": "([\\$\\@\\%](#)?)[0-9_]\\b",
					"name": "variable.other.readwrite.global.special.perl"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/perl/syntaxes/perl6.tmLanguage.json]---
Location: vscode-main/extensions/perl/syntaxes/perl6.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/textmate/perl.tmbundle/blob/master/Syntaxes/Perl%206.tmLanguage",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/textmate/perl.tmbundle/commit/d9841a0878239fa43f88c640f8d458590f97e8f5",
	"name": "Perl 6",
	"scopeName": "source.perl.6",
	"patterns": [
		{
			"begin": "^=begin",
			"end": "^=end",
			"name": "comment.block.perl"
		},
		{
			"begin": "(^[ \\t]+)?(?=#)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.whitespace.comment.leading.perl"
				}
			},
			"end": "(?!\\G)",
			"patterns": [
				{
					"begin": "#",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.comment.perl"
						}
					},
					"end": "\\n",
					"name": "comment.line.number-sign.perl"
				}
			]
		},
		{
			"captures": {
				"1": {
					"name": "storage.type.class.perl.6"
				},
				"3": {
					"name": "entity.name.type.class.perl.6"
				}
			},
			"match": "(class|enum|grammar|knowhow|module|package|role|slang|subset)(\\s+)(((?:::|')?(?:([a-zA-Z_\\x{C0}-\\x{FF}\\$])([a-zA-Z0-9_\\x{C0}-\\x{FF}\\\\$]|[\\-'][a-zA-Z0-9_\\x{C0}-\\x{FF}\\$])*))+)",
			"name": "meta.class.perl.6"
		},
		{
			"begin": "(?<=\\s)'",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "'",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.quoted.single.perl",
			"patterns": [
				{
					"match": "\\\\['\\\\]",
					"name": "constant.character.escape.perl"
				}
			]
		},
		{
			"begin": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.perl"
				}
			},
			"end": "\"",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.perl"
				}
			},
			"name": "string.quoted.double.perl",
			"patterns": [
				{
					"match": "\\\\[abtnfre\"\\\\]",
					"name": "constant.character.escape.perl"
				}
			]
		},
		{
			"begin": "q(q|to|heredoc)*\\s*:?(q|to|heredoc)*\\s*/(.+)/",
			"end": "\\3",
			"name": "string.quoted.single.heredoc.perl"
		},
		{
			"begin": "(q|Q)(x|exec|w|words|ww|quotewords|v|val|q|single|qq|double|s|scalar|a|array|h|hash|f|function|c|closure|b|blackslash|regexp|substr|trans|codes|p|path)*\\s*:?(x|exec|w|words|ww|quotewords|v|val|q|single|qq|double|s|scalar|a|array|h|hash|f|function|c|closure|b|blackslash|regexp|substr|trans|codes|p|path)*\\s*{{",
			"end": "}}",
			"name": "string.quoted.double.heredoc.brace.perl",
			"patterns": [
				{
					"include": "#qq_brace_string_content"
				}
			]
		},
		{
			"begin": "(q|Q)(x|exec|w|words|ww|quotewords|v|val|q|single|qq|double|s|scalar|a|array|h|hash|f|function|c|closure|b|blackslash|regexp|substr|trans|codes|p|path)*\\s*:?(x|exec|w|words|ww|quotewords|v|val|q|single|qq|double|s|scalar|a|array|h|hash|f|function|c|closure|b|blackslash|regexp|substr|trans|codes|p|path)*\\s*\\(\\(",
			"end": "\\)\\)",
			"name": "string.quoted.double.heredoc.paren.perl",
			"patterns": [
				{
					"include": "#qq_paren_string_content"
				}
			]
		},
		{
			"begin": "(q|Q)(x|exec|w|words|ww|quotewords|v|val|q|single|qq|double|s|scalar|a|array|h|hash|f|function|c|closure|b|blackslash|regexp|substr|trans|codes|p|path)*\\s*:?(x|exec|w|words|ww|quotewords|v|val|q|single|qq|double|s|scalar|a|array|h|hash|f|function|c|closure|b|blackslash|regexp|substr|trans|codes|p|path)*\\s*\\[\\[",
			"end": "\\]\\]",
			"name": "string.quoted.double.heredoc.bracket.perl",
			"patterns": [
				{
					"include": "#qq_bracket_string_content"
				}
			]
		},
		{
			"begin": "(q|Q)(x|exec|w|words|ww|quotewords|v|val|q|single|qq|double|s|scalar|a|array|h|hash|f|function|c|closure|b|blackslash|regexp|substr|trans|codes|p|path)*\\s*:?(x|exec|w|words|ww|quotewords|v|val|q|single|qq|double|s|scalar|a|array|h|hash|f|function|c|closure|b|blackslash|regexp|substr|trans|codes|p|path)*\\s*{",
			"end": "}",
			"name": "string.quoted.single.heredoc.brace.perl",
			"patterns": [
				{
					"include": "#qq_brace_string_content"
				}
			]
		},
		{
			"begin": "(q|Q)(x|exec|w|words|ww|quotewords|v|val|q|single|qq|double|s|scalar|a|array|h|hash|f|function|c|closure|b|blackslash|regexp|substr|trans|codes|p|path)*\\s*:?(x|exec|w|words|ww|quotewords|v|val|q|single|qq|double|s|scalar|a|array|h|hash|f|function|c|closure|b|blackslash|regexp|substr|trans|codes|p|path)*\\s*/",
			"end": "/",
			"name": "string.quoted.single.heredoc.slash.perl",
			"patterns": [
				{
					"include": "#qq_slash_string_content"
				}
			]
		},
		{
			"begin": "(q|Q)(x|exec|w|words|ww|quotewords|v|val|q|single|qq|double|s|scalar|a|array|h|hash|f|function|c|closure|b|blackslash|regexp|substr|trans|codes|p|path)*\\s*:?(x|exec|w|words|ww|quotewords|v|val|q|single|qq|double|s|scalar|a|array|h|hash|f|function|c|closure|b|blackslash|regexp|substr|trans|codes|p|path)*\\s*\\(",
			"end": "\\)",
			"name": "string.quoted.single.heredoc.paren.perl",
			"patterns": [
				{
					"include": "#qq_paren_string_content"
				}
			]
		},
		{
			"begin": "(q|Q)(x|exec|w|words|ww|quotewords|v|val|q|single|qq|double|s|scalar|a|array|h|hash|f|function|c|closure|b|blackslash|regexp|substr|trans|codes|p|path)*\\s*:?(x|exec|w|words|ww|quotewords|v|val|q|single|qq|double|s|scalar|a|array|h|hash|f|function|c|closure|b|blackslash|regexp|substr|trans|codes|p|path)*\\s*\\[",
			"end": "\\]",
			"name": "string.quoted.single.heredoc.bracket.perl",
			"patterns": [
				{
					"include": "#qq_bracket_string_content"
				}
			]
		},
		{
			"begin": "(q|Q)(x|exec|w|words|ww|quotewords|v|val|q|single|qq|double|s|scalar|a|array|h|hash|f|function|c|closure|b|blackslash|regexp|substr|trans|codes|p|path)*\\s*:?(x|exec|w|words|ww|quotewords|v|val|q|single|qq|double|s|scalar|a|array|h|hash|f|function|c|closure|b|blackslash|regexp|substr|trans|codes|p|path)*\\s*'",
			"end": "'",
			"name": "string.quoted.single.heredoc.single.perl",
			"patterns": [
				{
					"include": "#qq_single_string_content"
				}
			]
		},
		{
			"begin": "(q|Q)(x|exec|w|words|ww|quotewords|v|val|q|single|qq|double|s|scalar|a|array|h|hash|f|function|c|closure|b|blackslash|regexp|substr|trans|codes|p|path)*\\s*:?(x|exec|w|words|ww|quotewords|v|val|q|single|qq|double|s|scalar|a|array|h|hash|f|function|c|closure|b|blackslash|regexp|substr|trans|codes|p|path)*\\s*\"",
			"end": "\"",
			"name": "string.quoted.single.heredoc.double.perl",
			"patterns": [
				{
					"include": "#qq_double_string_content"
				}
			]
		},
		{
			"match": "\\b\\$\\w+\\b",
			"name": "variable.other.perl"
		},
		{
			"match": "\\b(macro|sub|submethod|method|multi|proto|only|rule|token|regex|category)\\b",
			"name": "storage.type.declare.routine.perl"
		},
		{
			"match": "\\b(self)\\b",
			"name": "variable.language.perl"
		},
		{
			"match": "\\b(use|require)\\b",
			"name": "keyword.other.include.perl"
		},
		{
			"match": "\\b(if|else|elsif|unless)\\b",
			"name": "keyword.control.conditional.perl"
		},
		{
			"match": "\\b(let|my|our|state|temp|has|constant)\\b",
			"name": "storage.type.variable.perl"
		},
		{
			"match": "\\b(for|loop|repeat|while|until|gather|given)\\b",
			"name": "keyword.control.repeat.perl"
		},
		{
			"match": "\\b(take|do|when|next|last|redo|return|contend|maybe|defer|default|exit|make|continue|break|goto|leave|async|lift)\\b",
			"name": "keyword.control.flowcontrol.perl"
		},
		{
			"match": "\\b(is|as|but|trusts|of|returns|handles|where|augment|supersede)\\b",
			"name": "storage.modifier.type.constraints.perl"
		},
		{
			"match": "\\b(BEGIN|CHECK|INIT|START|FIRST|ENTER|LEAVE|KEEP|UNDO|NEXT|LAST|PRE|POST|END|CATCH|CONTROL|TEMP)\\b",
			"name": "meta.function.perl"
		},
		{
			"match": "\\b(die|fail|try|warn)\\b",
			"name": "keyword.control.control-handlers.perl"
		},
		{
			"match": "\\b(prec|irs|ofs|ors|export|deep|binary|unary|reparsed|rw|parsed|cached|readonly|defequiv|will|ref|copy|inline|tighter|looser|equiv|assoc|required)\\b",
			"name": "storage.modifier.perl"
		},
		{
			"match": "\\b(NaN|Inf)\\b",
			"name": "constant.numeric.perl"
		},
		{
			"match": "\\b(oo|fatal)\\b",
			"name": "keyword.other.pragma.perl"
		},
		{
			"match": "\\b(Object|Any|Junction|Whatever|Capture|MatchSignature|Proxy|Matcher|Package|Module|ClassGrammar|Scalar|Array|Hash|KeyHash|KeySet|KeyBagPair|List|Seq|Range|Set|Bag|Mapping|Void|UndefFailure|Exception|Code|Block|Routine|Sub|MacroMethod|Submethod|Regex|Str|str|Blob|Char|ByteCodepoint|Grapheme|StrPos|StrLen|Version|NumComplex|num|complex|Bit|bit|bool|True|FalseIncreasing|Decreasing|Ordered|Callable|AnyCharPositional|Associative|Ordering|KeyExtractorComparator|OrderingPair|IO|KitchenSink|RoleInt|int|int1|int2|int4|int8|int16|int32|int64Rat|rat|rat1|rat2|rat4|rat8|rat16|rat32|rat64Buf|buf|buf1|buf2|buf4|buf8|buf16|buf32|buf64UInt|uint|uint1|uint2|uint4|uint8|uint16|uint32uint64|Abstraction|utf8|utf16|utf32)\\b",
			"name": "support.type.perl6"
		},
		{
			"match": "\\b(div|xx|x|mod|also|leg|cmp|before|after|eq|ne|le|lt|not|gt|ge|eqv|ff|fff|and|andthen|or|xor|orelse|extra|lcm|gcd)\\b",
			"name": "keyword.operator.perl"
		},
		{
			"match": "(\\$|@|%|&)(\\*|:|!|\\^|~|=|\\?|(<(?=.+>)))?([a-zA-Z_\\x{C0}-\\x{FF}\\$])([a-zA-Z0-9_\\x{C0}-\\x{FF}\\$]|[\\-'][a-zA-Z0-9_\\x{C0}-\\x{FF}\\$])*",
			"name": "variable.other.identifier.perl.6"
		},
		{
			"match": "\\b(eager|hyper|substr|index|rindex|grep|map|sort|join|lines|hints|chmod|split|reduce|min|max|reverse|truncate|zip|cat|roundrobin|classify|first|sum|keys|values|pairs|defined|delete|exists|elems|end|kv|any|all|one|wrap|shape|key|value|name|pop|push|shift|splice|unshift|floor|ceiling|abs|exp|log|log10|rand|sign|sqrt|sin|cos|tan|round|strand|roots|cis|unpolar|polar|atan2|pick|chop|p5chop|chomp|p5chomp|lc|lcfirst|uc|ucfirst|capitalize|normalize|pack|unpack|quotemeta|comb|samecase|sameaccent|chars|nfd|nfc|nfkd|nfkc|printf|sprintf|caller|evalfile|run|runinstead|nothing|want|bless|chr|ord|gmtime|time|eof|localtime|gethost|getpw|chroot|getlogin|getpeername|kill|fork|wait|perl|graphs|codes|bytes|clone|print|open|read|write|readline|say|seek|close|opendir|readdir|slurp|spurt|shell|run|pos|fmt|vec|link|unlink|symlink|uniq|pair|asin|atan|sec|cosec|cotan|asec|acosec|acotan|sinh|cosh|tanh|asinh|done|acos|acosh|atanh|sech|cosech|cotanh|sech|acosech|acotanh|asech|ok|nok|plan_ok|dies_ok|lives_ok|skip|todo|pass|flunk|force_todo|use_ok|isa_ok|diag|is_deeply|isnt|like|skip_rest|unlike|cmp_ok|eval_dies_ok|nok_error|eval_lives_ok|approx|is_approx|throws_ok|version_lt|plan|EVAL|succ|pred|times|nonce|once|signature|new|connect|operator|undef|undefine|sleep|from|to|infix|postfix|prefix|circumfix|postcircumfix|minmax|lazy|count|unwrap|getc|pi|e|context|void|quasi|body|each|contains|rewinddir|subst|can|isa|flush|arity|assuming|rewind|callwith|callsame|nextwith|nextsame|attr|eval_elsewhere|none|srand|trim|trim_start|trim_end|lastcall|WHAT|WHERE|HOW|WHICH|VAR|WHO|WHENCE|ACCEPTS|REJECTS|not|true|iterator|by|re|im|invert|flip|gist|flat|tree|is-prime|throws_like|trans)\\b",
			"name": "support.function.perl"
		}
	],
	"repository": {
		"qq_brace_string_content": {
			"begin": "{",
			"end": "}",
			"patterns": [
				{
					"include": "#qq_brace_string_content"
				}
			]
		},
		"qq_bracket_string_content": {
			"begin": "\\[",
			"end": "\\]",
			"patterns": [
				{
					"include": "#qq_bracket_string_content"
				}
			]
		},
		"qq_double_string_content": {
			"begin": "\"",
			"end": "\"",
			"patterns": [
				{
					"include": "#qq_double_string_content"
				}
			]
		},
		"qq_paren_string_content": {
			"begin": "\\(",
			"end": "\\)",
			"patterns": [
				{
					"include": "#qq_paren_string_content"
				}
			]
		},
		"qq_single_string_content": {
			"begin": "'",
			"end": "'",
			"patterns": [
				{
					"include": "#qq_single_string_content"
				}
			]
		},
		"qq_slash_string_content": {
			"begin": "\\\\/",
			"end": "\\\\/",
			"patterns": [
				{
					"include": "#qq_slash_string_content"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/php/.vscodeignore]---
Location: vscode-main/extensions/php/.vscodeignore

```text
test/**
build/**
out/test/**
src/**
tsconfig.json
cgmanifest.json
.vscode
```

--------------------------------------------------------------------------------

---[FILE: extensions/php/cgmanifest.json]---
Location: vscode-main/extensions/php/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "language-php",
					"repositoryUrl": "https://github.com/KapitanOczywisty/language-php",
					"commitHash": "b17fdadac1756fc13a0853c26fca2f0b4495c0bd"
				}
			},
			"license": "MIT",
			"version": "0.49.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/php/language-configuration.json]---
Location: vscode-main/extensions/php/language-configuration.json

```json
{
	"comments": {
		"lineComment": "//", // "#"
		"blockComment": [
			"/*",
			"*/"
		]
	},
	"brackets": [
		[
			"{",
			"}"
		],
		[
			"[",
			"]"
		],
		[
			"(",
			")"
		]
	],
	"autoClosingPairs": [
		{
			"open": "{",
			"close": "}",
			"notIn": [
				"string"
			]
		},
		{
			"open": "[",
			"close": "]",
			"notIn": [
				"string"
			]
		},
		{
			"open": "(",
			"close": ")",
			"notIn": [
				"string"
			]
		},
		{
			"open": "'",
			"close": "'",
			"notIn": [
				"string",
				"comment"
			]
		},
		{
			"open": "\"",
			"close": "\"",
			"notIn": [
				"string",
				"comment"
			]
		},
		{
			"open": "/**",
			"close": " */",
			"notIn": [
				"string"
			]
		}
	],
	"surroundingPairs": [
		[
			"{",
			"}"
		],
		[
			"[",
			"]"
		],
		[
			"(",
			")"
		],
		[
			"'",
			"'"
		],
		[
			"\"",
			"\""
		],
		[
			"`",
			"`"
		]
	],
	"indentationRules": {
		"increaseIndentPattern": "({(?!.*}).*|\\(|\\[|((else(\\s)?)?if|else|for(each)?|while|switch|case).*:)\\s*((/[/*].*|)?$|\\?>)",
		"decreaseIndentPattern": "^(.*\\*\\/)?\\s*((\\})|(\\)+[;,])|(\\]\\)*[;,])|\\b(else:)|\\b((end(if|for(each)?|while|switch));))",
		// e.g.  * ...| or */| or *-----*/|
		"unIndentedLinePattern": {
			"pattern": "^(\\t|[ ])*[ ]\\*[^/]*\\*/\\s*$|^(\\t|[ ])*[ ]\\*/\\s*$|^(\\t|[ ])*\\*([ ]([^\\*]|\\*(?!/))*)?$"
		},
		"indentNextLinePattern": {
			"pattern": "^\\s*(((if|else ?if|while|for|foreach)\\s*\\(.*\\)\\s*)|else\\s*)$"
		}
	},
	"folding": {
		"markers": {
			"start": "^\\s*(#|\/\/|\/\/ #)region\\b",
			"end": "^\\s*(#|\/\/|\/\/ #)endregion\\b"
		}
	},
	"wordPattern": "(-?\\d*\\.\\d\\w*)|([^\\-\\`\\~\\!\\@\\#\\%\\^\\&\\*\\(\\)\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\'\\\"\\,\\.\\<\\>\\/\\?\\s]+)",
	"onEnterRules": [
		{
			// e.g. /** | */
			"beforeText": "^\\s*\\/\\*\\*(?!\\/)([^\\*]|\\*(?!\\/))*$",
			"afterText": "^\\s*\\*\\/$",
			"action": {
				"indent": "indentOutdent",
				"appendText": " * "
			}
		},
		{
			// e.g. /** ...|
			"beforeText": "^\\s*\\/\\*\\*(?!\\/)([^\\*]|\\*(?!\\/))*$",
			"action": {
				"indent": "none",
				"appendText": " * "
			}
		},
		{
			// e.g.  * ...|
			"beforeText": "^(\\t|(\\ \\ ))*\\ \\*(\\ ([^\\*]|\\*(?!\\/))*)?$",
			"action": {
				"indent": "none",
				"appendText": "* ",
			},
		},
		{
			// e.g.  */|
			"beforeText": "^(\\t|(\\ \\ ))*\\ \\*\\/\\s*$",
			"action": {
				"indent": "none",
				"removeText": 1
			},
		},
		{
			// e.g.  *-----*/|
			"beforeText": "^(\\t|(\\ \\ ))*\\ \\*[^/]*\\*\\/\\s*$",
			"action": {
				"indent": "none",
				"removeText": 1
			}
		},
		{
			// Decrease indentation after single line if/else if/else, for, foreach, or while
			"previousLineText": "^\\s*(((else ?)?if|for(each)?|while)\\s*\\(.*\\)\\s*|else\\s*)$",
			// But make sure line doesn't have braces or is not another if statement
			"beforeText": "^\\s+([^{i\\s]|i(?!f\\b))",
			"action": {
				"indent": "outdent"
			}
		},
		// Add // when pressing enter from inside line comment
		{
			"beforeText": {
				"pattern": "\/\/.*"
			},
			"afterText": {
				"pattern": "^(?!\\s*$).+"
			},
			"action": {
				"indent": "none",
				"appendText": "// "
			}
		},
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/php/package.json]---
Location: vscode-main/extensions/php/package.json

```json
{
  "name": "php",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "0.10.x"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "php",
        "extensions": [
          ".php",
          ".php4",
          ".php5",
          ".phtml",
          ".ctp"
        ],
        "aliases": [
          "PHP",
          "php"
        ],
        "firstLine": "^#!\\s*/.*\\bphp\\b",
        "mimetypes": [
          "application/x-php"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "php",
        "scopeName": "source.php",
        "path": "./syntaxes/php.tmLanguage.json"
      },
      {
        "language": "php",
        "scopeName": "text.html.php",
        "path": "./syntaxes/html.tmLanguage.json",
        "embeddedLanguages": {
          "text.html": "html",
          "source.php": "php",
          "source.sql": "sql",
          "text.xml": "xml",
          "source.js": "javascript",
          "source.json": "json",
          "source.css": "css"
        }
      }
    ],
    "snippets": [
      {
        "language": "php",
        "path": "./snippets/php.code-snippets"
      }
    ]
  },
  "scripts": {
    "update-grammar": "node ./build/update-grammar.mjs"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/php/package.nls.json]---
Location: vscode-main/extensions/php/package.nls.json

```json
{
	"displayName": "PHP Language Basics",
	"description": "Provides syntax highlighting and bracket matching for PHP files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/php/.vscode/launch.json]---
Location: vscode-main/extensions/php/.vscode/launch.json

```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"name": "Launch Extension",
			"type": "extensionHost",
			"request": "launch",
			"runtimeExecutable": "${execPath}",
			"args": [
				"--extensionDevelopmentPath=${workspaceFolder}"
			],
			"stopOnEntry": false,
			"sourceMaps": true,
			"preLaunchTask": "npm"
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/php/.vscode/tasks.json]---
Location: vscode-main/extensions/php/.vscode/tasks.json

```json
{
	"version": "2.0.0",
	"command": "npm",
	"type": "shell",
	"presentation": {
		"reveal": "silent"
	},
	"args": ["run", "compile"],
	"isBackground": true,
	"problemMatcher": "$tsc-watch"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/php/build/update-grammar.mjs]---
Location: vscode-main/extensions/php/build/update-grammar.mjs

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
//@ts-check

import * as vscodeGrammarUpdater from 'vscode-grammar-updater';

function adaptInjectionScope(grammar) {
	// we're using the HTML grammar from https://github.com/textmate/html.tmbundle which has moved away from source.js.embedded.html
	// also we need to add source.css scope for PHP code in <style> tags, which are handled differently in atom
	const oldInjectionKey = "text.html.php - (meta.embedded | meta.tag), L:((text.html.php meta.tag) - (meta.embedded.block.php | meta.embedded.line.php)), L:(source.js.embedded.html - (meta.embedded.block.php | meta.embedded.line.php))";
	const newInjectionKey = "text.html.php - (meta.embedded | meta.tag), L:((text.html.php meta.tag) - (meta.embedded.block.php | meta.embedded.line.php)), L:(source.js - (meta.embedded.block.php | meta.embedded.line.php)), L:(source.css - (meta.embedded.block.php | meta.embedded.line.php))";

	const injections = grammar.injections;
	const injection = injections[oldInjectionKey];
	if (!injection) {
		throw new Error("Can not find PHP injection to patch");
	}
	delete injections[oldInjectionKey];
	injections[newInjectionKey] = injection;
}

function includeDerivativeHtml(grammar) {
	grammar.patterns.forEach(pattern => {
		if (pattern.include === 'text.html.basic') {
			pattern.include = 'text.html.derivative';
		}
	});
}

// Workaround for https://github.com/microsoft/vscode/issues/40279
// and https://github.com/microsoft/vscode-textmate/issues/59
function fixBadRegex(grammar) {
	function fail(msg) {
		throw new Error(`fixBadRegex callback couldn't patch ${msg}. It may be obsolete`);
	}

	const scopeResolution = grammar.repository['scope-resolution'];
	if (scopeResolution) {
		const match = scopeResolution.patterns[0].match;
		if (match === '(?i)([a-z_\\x{7f}-\\x{10ffff}\\\\][a-z0-9_\\x{7f}-\\x{10ffff}\\\\]*)(?=\\s*::)') {
			scopeResolution.patterns[0].match = '([A-Za-z_\\x{7f}-\\x{10ffff}\\\\][A-Za-z0-9_\\x{7f}-\\x{10ffff}\\\\]*)(?=\\s*::)';
		} else {
			fail('scope-resolution.match');
		}
	} else {
		fail('scope-resolution');
	}

	const functionCall = grammar.repository['function-call'];
	if (functionCall) {
		const begin0 = functionCall.patterns[0].begin;
		if (begin0 === '(?xi)\n(\n  \\\\?(?<![a-z0-9_\\x{7f}-\\x{10ffff}])                            # Optional root namespace\n  [a-z_\\x{7f}-\\x{10ffff}][a-z0-9_\\x{7f}-\\x{10ffff}]*          # First namespace\n  (?:\\\\[a-z_\\x{7f}-\\x{10ffff}][a-z0-9_\\x{7f}-\\x{10ffff}]*)+ # Additional namespaces\n)\\s*(\\()') {
			functionCall.patterns[0].begin = '(?x)\n(\n  \\\\?(?<![a-zA-Z0-9_\\x{7f}-\\x{10ffff}])                            # Optional root namespace\n  [a-zA-Z_\\x{7f}-\\x{10ffff}][a-zA-Z0-9_\\x{7f}-\\x{10ffff}]*          # First namespace\n  (?:\\\\[a-zA-Z_\\x{7f}-\\x{10ffff}][a-zA-Z0-9_\\x{7f}-\\x{10ffff}]*)+ # Additional namespaces\n)\\s*(\\()';
		} else {
			fail('function-call.begin0');
		}

		const begin1 = functionCall.patterns[1].begin;
		if (begin1 === '(?i)(\\\\)?(?<![a-z0-9_\\x{7f}-\\x{10ffff}])([a-z_\\x{7f}-\\x{10ffff}][a-z0-9_\\x{7f}-\\x{10ffff}]*)\\s*(\\()') {
			functionCall.patterns[1].begin = '(\\\\)?(?<![a-zA-Z0-9_\\x{7f}-\\x{10ffff}])([a-zA-Z_\\x{7f}-\\x{10ffff}][a-zA-Z0-9_\\x{7f}-\\x{10ffff}]*)\\s*(\\()';
		} else {
			fail('function-call.begin1');
		}
	} else {
		fail('function-call');
	}
}

vscodeGrammarUpdater.update('KapitanOczywisty/language-php', 'grammars/php.cson', './syntaxes/php.tmLanguage.json', fixBadRegex);
vscodeGrammarUpdater.update('KapitanOczywisty/language-php', 'grammars/html.cson', './syntaxes/html.tmLanguage.json', grammar => {
	adaptInjectionScope(grammar);
	includeDerivativeHtml(grammar);
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/php/snippets/php.code-snippets]---
Location: vscode-main/extensions/php/snippets/php.code-snippets

```text
{
	"$… = ( … ) ? … : …": {
		"prefix": "if?",
		"body": "$${1:retVal} = (${2:condition}) ? ${3:a} : ${4:b} ;",
		"description": "Ternary conditional assignment"
	},
	"$… = array (…)": {
		"prefix": "array",
		"body": "$${1:arrayName} = array($0);",
		"description": "Array initializer"
	},
	"$… = […]": {
		"prefix": "shorray",
		"body": "$${1:arrayName} = [$0];",
		"description": "Array initializer"
	},
	"… => …": {
		"prefix": "keyval,kvp",
		"body": "'$1' => $2$0",
		"description": "Key-Value pair"
	},
	"$a <=> $b": {
		"prefix": "spaceship",
		"body": "(${1:\\$a} <=> ${2:\\$b} === ${3|0,1,-1|})",
		"description": "Spaceship equality check"
	},
	"attribute": {
		"prefix": "attr",
		"body": [
			"#[\\\\Attribute]",
			"class ${1:My}Attribute${2: extends ${3:MyOther}Attribute} {",
			"\t$0",
			"}"
		],
		"description": "Attribute"
	},
	"attribute target": {
		"prefix": "attr_target",
		"body": "\\Attribute::${1|TARGET_ALL,TARGET_CLASS,TARGET_FUNCTION,TARGET_METHOD,TARGET_PROPERTY,TARGET_CLASS_CONSTANT,TARGET_PARAMETER,IS_REPEATABLE|}$0"
	},
	"attribute with target": {
		"prefix": "attr_with_target",
		"body": [
			"#[\\\\Attribute(\\Attribute::${1|TARGET_ALL,TARGET_CLASS,TARGET_FUNCTION,TARGET_METHOD,TARGET_PROPERTY,TARGET_CLASS_CONSTANT,TARGET_PARAMETER,IS_REPEATABLE|}$2)]",
			"class ${3:My}Attribute${4: extends ${5:MyOther}Attribute} {",
			"\t$0",
			"}"
		],
		"description": "Attribute - Chain targets with attr_target snippet"
	},
	"case …": {
		"prefix": "case",
		"body": [
			"case '${1:value}':",
			"\t${0:# code...}",
			"\tbreak;"
		],
		"description": "Case Block"
	},
	"class …": {
		"prefix": "class",
		"body": [
			"${1:${2|final ,readonly |}}class ${3:${TM_FILENAME_BASE}}${4: extends ${5:AnotherClass}} ${6:implements ${7:Interface}}",
			"{",
			"\t$0",
			"}",
			""
		],
		"description": "Class definition"
	},
	"class __construct": {
		"prefix": "construct",
		"body": [
			"${1|public,private,protected|} function __construct(${2:${3:Type} $${4:var}${5: = ${6:null}}}$7) {",
			"\t\\$this->${4:var} = $${4:var};$0",
			"}"
		]
	},
	"class function …": {
		"prefix": "class_fun",
		"body": [
			"${1|public ,private ,protected |}${2: static }function ${3:FunctionName}(${4:${5:${6:Type} }$${7:var}${8: = ${9:null}}}$10) : ${11:Returntype}",
			"{",
			"\t${0:# code...}",
			"}"
		],
		"description": "Function for classes, traits and enums"
	},
	"const": {
		"prefix": "const",
		"body": "${1|public ,private ,protected |}const ${2:NAME} = $3;",
		"description": "Constant for classes, traits, enums"
	},
	"enum": {
		"prefix": "enum",
		"body": [
			"enum $1 {",
			"\tcase $2;$0",
			"}"
		]
	},
	"define(…, …)": {
		"prefix": "def",
		"body": [
			"define('$1', ${2:'$3'});",
			"$0"
		],
		"description": "Definition"
	},
	"do … while …": {
		"prefix": "do",
		"body": [
			"do {",
			"\t${0:# code...}",
			"} while (${1:$${2:a} <= ${3:10}});"
		],
		"description": "Do-While loop"
	},
	"else …": {
		"prefix": "else",
		"body": [
			"else {",
			"\t${0:# code...}",
			"}"
		],
		"description": "Else block"
	},
	"elseif …": {
		"prefix": "elseif",
		"body": [
			"elseif (${1:condition}) {",
			"\t${0:# code...}",
			"}"
		],
		"description": "Elseif block"
	},
	"for …": {
		"prefix": "for",
		"body": [
			"for ($${1:i}=${2:0}; $${1:i} < $3; $${1:i}++) { ",
			"\t${0:# code...}",
			"}"
		],
		"description": "For-loop"
	},
	"foreach …": {
		"prefix": "foreach",
		"body": [
			"foreach ($${1:variable} as $${2:key}${3: => $${4:value}}) {",
			"\t${0:# code...}",
			"}"
		],
		"description": "Foreach loop"
	},
	"function": {
		"prefix": "fun",
		"body": [
			"function ${1:FunctionName}($2)${3: : ${4:Returntype}} {",
			"\t$0",
			"}"
		],
		"description": "Function - use param snippet for parameters"
	},
	"anonymous function": {
		"prefix": "fun_anonymous",
		"body": [
			"function ($1)${2: use ($${3:var})} {",
			"\t$0",
			"}"
		],
		"description": "Anonymous Function"
	},
	"if …": {
		"prefix": "if",
		"body": [
			"if (${1:condition}) {",
			"\t${0:# code...}",
			"}"
		],
		"description": "If block"
	},
	"if … else …": {
		"prefix": "ifelse",
		"body": [
			"if (${1:condition}) {",
			"\t${2:# code...}",
			"} else {",
			"\t${3:# code...}",
			"}",
			"$0"
		],
		"description": "If Else block"
	},
	"match": {
		"prefix": "match",
		"body": [
			"match (${1:expression}) {",
			"\t$2 => $3,",
			"\t$4 => $5,$0",
			"}"
		],
		"description": "Match expression; like switch with identity checks. Use keyval snippet to chain expressions"
	},
	"param": {
		"prefix": "param",
		"body": "${1:Type} $${2:var}${3: = ${4:null}}$5",
		"description": "Parameter definition"
	},
	"property": {
		"prefix": "property",
		"body": "${1|public ,private ,protected |}${2|static ,readonly |}${3:Type} $${4:var}${5: = ${6:null}};$0",
		"description": "Property"
	},
	"PHPDoc class …": {
		"prefix": "doc_class",
		"body": [
			"/**",
			" * ${8:undocumented class}",
			" */",
			"${1:${2|final ,readonly |}}class ${3:${TM_FILENAME_BASE}}${4: extends ${5:AnotherClass}} ${6:implements ${7:Interface}}",
			"{",
			"\t$0",
			"}",
			""
		],
		"description": "Documented Class Declaration"
	},
	"PHPDoc function …": {
		"prefix": "doc_fun",
		"body": [
			"/**",
			" * ${1:undocumented function summary}",
			" *",
			" * ${2:Undocumented function long description}",
			" *",
			"${3: * @param ${4:Type} $${5:var} ${6:Description}}",
			"${7: * @return ${8:type}}",
			"${9: * @throws ${10:conditon}}",
			" **/",
			"${11:public }function ${12:FunctionName}(${13:${14:${4:Type} }$${5:var}${15: = ${16:null}}}17)",
			"{",
			"\t${0:# code...}",
			"}"
		],
		"description": "Documented function"
	},
	"PHPDoc param …": {
		"prefix": "doc_param",
		"body": [
			"* @param ${1:Type} ${2:var} ${3:Description}$0"
		],
		"description": "Paramater documentation"
	},
	"PHPDoc trait": {
		"prefix": "doc_trait",
		"body": [
			"/**",
			" * $1",
			" */",
			"trait ${2:TraitName}",
			"{",
			"\t$0",
			"}",
			""
		],
		"description": "Trait"
	},
	"PHPDoc var": {
		"prefix": "doc_var",
		"body": [
			"/** @var ${1:Type} $${2:var} ${3:description} */",
			"${4:protected} $${2:var}${5: = ${6:null}};$0"
		],
		"description": "Documented Class Variable"
	},
	"Region End": {
		"prefix": "#endregion",
		"body": [
			"#endregion"
		],
		"description": "Folding Region End"
	},
	"Region Start": {
		"prefix": "#region",
		"body": [
			"#region"
		],
		"description": "Folding Region Start"
	},
	"switch …": {
		"prefix": "switch",
		"body": [
			"switch (\\$${1:variable}) {",
			"\tcase '${2:value}':",
			"\t\t${3:# code...}",
			"\t\tbreak;",
			"\t$0",
			"\tdefault:",
			"\t\t${4:# code...}",
			"\t\tbreak;",
			"}"
		],
		"description": "Switch block"
	},
	"$this->…": {
		"prefix": "this",
		"body": "\\$this->$0;",
		"description": "$this->..."
	},
	"Throw Exception": {
		"prefix": "throw",
		"body": [
			"throw new $1Exception(${2:\"${3:Error Processing Request}\"}${4:, ${5:1}});",
			"$0"
		],
		"description": "Throw exception"
	},
	"trait …": {
		"prefix": "trait",
		"body": [
			"trait ${1:TraitName}",
			"{",
			"\t$0",
			"}",
			""
		],
		"description": "Trait"
	},
	"Try Catch Block": {
		"prefix": "try",
		"body": [
			"try {",
			"\t${1://code...}",
			"} catch (${2:\\Throwable} ${3:\\$th}) {",
			"\t${4://throw \\$th;}",
			"}"
		],
		"description": "Try catch block"
	},
	"use function": {
		"prefix": "use_fun",
		"body": "use function $1;"
	},
	"use const": {
		"prefix": "use_const",
		"body": "use const $1;"
	},
	"use grouping": {
		"prefix": "use_group",
		"body": [
			"use${1| const , function |}$2\\{",
			"\t$0,",
			"}"
		],
		"description": "Use grouping imports"
	},
	"use as ": {
		"prefix": "use_as",
		"body": "use${1| const , function |}$2 as $3;",
		"description": "Use as alias"
	},
	"while …": {
		"prefix": "while",
		"body": [
			"while (${1:$${2:a} <= ${3:10}}) {",
			"\t${0:# code...}",
			"}"
		],
		"description": "While-loop"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/php/syntaxes/html.tmLanguage.json]---
Location: vscode-main/extensions/php/syntaxes/html.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/KapitanOczywisty/language-php/blob/master/grammars/html.cson",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/KapitanOczywisty/language-php/commit/ff64523c94c014d68f5dec189b05557649c5872a",
	"name": "PHP",
	"scopeName": "text.html.php",
	"injections": {
		"L:meta.embedded.php.blade": {
			"patterns": [
				{
					"include": "text.html.basic"
				},
				{
					"include": "text.html.php.blade#blade"
				}
			]
		},
		"text.html.php - (meta.embedded | meta.tag), L:((text.html.php meta.tag) - (meta.embedded.block.php | meta.embedded.line.php)), L:(source.js - (meta.embedded.block.php | meta.embedded.line.php)), L:(source.css - (meta.embedded.block.php | meta.embedded.line.php))": {
			"patterns": [
				{
					"include": "#php-tag"
				}
			]
		}
	},
	"patterns": [
		{
			"begin": "\\A#!",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.comment.php"
				}
			},
			"end": "$",
			"name": "comment.line.shebang.php"
		},
		{
			"include": "text.html.derivative"
		}
	],
	"repository": {
		"php-tag": {
			"patterns": [
				{
					"begin": "<\\?(?i:php|=)?(?![^?]*\\?>)",
					"beginCaptures": {
						"0": {
							"name": "punctuation.section.embedded.begin.php"
						}
					},
					"end": "(\\?)>",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.embedded.end.php"
						},
						"1": {
							"name": "source.php"
						}
					},
					"name": "meta.embedded.block.php",
					"contentName": "source.php",
					"patterns": [
						{
							"include": "source.php"
						}
					]
				},
				{
					"begin": "<\\?(?i:php|=)?",
					"beginCaptures": {
						"0": {
							"name": "punctuation.section.embedded.begin.php"
						}
					},
					"end": "(\\?)>",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.embedded.end.php"
						},
						"1": {
							"name": "source.php"
						}
					},
					"name": "meta.embedded.line.php",
					"contentName": "source.php",
					"patterns": [
						{
							"include": "source.php"
						}
					]
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

````
