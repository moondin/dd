---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 59
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 59 of 552)

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

---[FILE: extensions/lua/syntaxes/lua.tmLanguage.json]---
Location: vscode-main/extensions/lua/syntaxes/lua.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/sumneko/lua.tmbundle/blob/master/Syntaxes/Lua.plist",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/sumneko/lua.tmbundle/commit/1483add845ebfb3e1e631fe372603e5fed2cdd42",
	"name": "Lua",
	"scopeName": "source.lua",
	"patterns": [
		{
			"begin": "\\b(?:(local)\\s+)?(function)\\b(?![,:])",
			"beginCaptures": {
				"1": {
					"name": "keyword.local.lua"
				},
				"2": {
					"name": "keyword.control.lua"
				}
			},
			"end": "(?<=[\\)\\-{}\\[\\]\"'])",
			"name": "meta.function.lua",
			"patterns": [
				{
					"include": "#comment"
				},
				{
					"begin": "(\\()",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.parameters.begin.lua"
						}
					},
					"end": "(\\))|(?=[\\-\\.{}\\[\\]\"'])",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.parameters.finish.lua"
						}
					},
					"name": "meta.parameter.lua",
					"patterns": [
						{
							"include": "#comment"
						},
						{
							"match": "[a-zA-Z_][a-zA-Z0-9_]*",
							"name": "variable.parameter.function.lua"
						},
						{
							"match": ",",
							"name": "punctuation.separator.arguments.lua"
						},
						{
							"begin": ":",
							"beginCaptures": {
								"0": {
									"name": "punctuation.separator.arguments.lua"
								}
							},
							"end": "(?=[\\),])",
							"patterns": [
								{
									"include": "#emmydoc.type"
								}
							]
						}
					]
				},
				{
					"match": "\\b([a-zA-Z_][a-zA-Z0-9_]*)\\b\\s*(?=:)",
					"name": "entity.name.class.lua"
				},
				{
					"match": "\\b([a-zA-Z_][a-zA-Z0-9_]*)\\b",
					"name": "entity.name.function.lua"
				}
			]
		},
		{
			"match": "(?<![\\w\\d.])0[xX][0-9A-Fa-f]+(\\.[0-9A-Fa-f]*)?([eE]-?\\d*)?([pP][-+]\\d+)?",
			"name": "constant.numeric.float.hexadecimal.lua"
		},
		{
			"match": "(?<![\\w\\d.])0[xX]\\.[0-9A-Fa-f]+([eE]-?\\d*)?([pP][-+]\\d+)?",
			"name": "constant.numeric.float.hexadecimal.lua"
		},
		{
			"match": "(?<![\\w\\d.])0[xX][0-9A-Fa-f]+(?![pPeE.0-9])",
			"name": "constant.numeric.integer.hexadecimal.lua"
		},
		{
			"match": "(?<![\\w\\d.])\\d+(\\.\\d*)?([eE]-?\\d*)?",
			"name": "constant.numeric.float.lua"
		},
		{
			"match": "(?<![\\w\\d.])\\.\\d+([eE]-?\\d*)?",
			"name": "constant.numeric.float.lua"
		},
		{
			"match": "(?<![\\w\\d.])\\d+(?![pPeE.0-9])",
			"name": "constant.numeric.integer.lua"
		},
		{
			"include": "#string"
		},
		{
			"captures": {
				"1": {
					"name": "punctuation.definition.comment.lua"
				}
			},
			"match": "\\A(#!).*$\\n?",
			"name": "comment.line.shebang.lua"
		},
		{
			"include": "#comment"
		},
		{
			"captures": {
				"1": {
					"name": "keyword.control.goto.lua"
				},
				"2": {
					"name": "string.tag.lua"
				}
			},
			"match": "\\b(goto)\\s+([a-zA-Z_][a-zA-Z0-9_]*)"
		},
		{
			"captures": {
				"1": {
					"name": "punctuation.section.embedded.begin.lua"
				},
				"2": {
					"name": "punctuation.section.embedded.end.lua"
				}
			},
			"match": "(::)\\s*[a-zA-Z_][a-zA-Z0-9_]*\\s*(::)",
			"name": "string.tag.lua"
		},
		{
			"match": "<\\s*(const|close)\\s*>",
			"captures": {
				"0": {
					"name": "storage.type.attribute.lua"
				}
			}
		},
		{
			"match": "\\<[a-zA-Z_\\*][a-zA-Z0-9_\\.\\*\\-]*\\>",
			"name": "storage.type.generic.lua"
		},
		{
			"match": "\\b(break|do|else|for|if|elseif|goto|return|then|repeat|while|until|end|in)\\b",
			"name": "keyword.control.lua"
		},
		{
			"match": "\\b(local)\\b",
			"name": "keyword.local.lua"
		},
		{
			"match": "\\b(function)\\b(?![,:])",
			"name": "keyword.control.lua"
		},
		{
			"match": "(?<![^.]\\.|:)\\b(false|nil(?!:)|true|_ENV|_G|_VERSION|math\\.(pi|huge|maxinteger|mininteger)|utf8\\.charpattern|io\\.(stdin|stdout|stderr)|package\\.(config|cpath|loaded|loaders|path|preload|searchers))\\b|(?<![.])\\.{3}(?!\\.)",
			"name": "constant.language.lua"
		},
		{
			"match": "(?<![^.]\\.|:)\\b(self)\\b",
			"name": "variable.language.self.lua"
		},
		{
			"match": "(?<![^.]\\.|:)\\b(assert|collectgarbage|dofile|error|getfenv|getmetatable|ipairs|load|loadfile|loadstring|module|next|pairs|pcall|print|rawequal|rawget|rawlen|rawset|require|select|setfenv|setmetatable|tonumber|tostring|type|unpack|xpcall)\\b(?!\\s*=(?!=))",
			"name": "support.function.lua"
		},
		{
			"match": "(?<![^.]\\.|:)\\b(async)\\b(?!\\s*=(?!=))",
			"name": "entity.name.tag.lua"
		},
		{
			"match": "(?<![^.]\\.|:)\\b(coroutine\\.(create|isyieldable|close|resume|running|status|wrap|yield)|string\\.(byte|char|dump|find|format|gmatch|gsub|len|lower|match|pack|packsize|rep|reverse|sub|unpack|upper)|table\\.(concat|insert|maxn|move|pack|remove|sort|unpack)|math\\.(abs|acos|asin|atan2?|ceil|cosh?|deg|exp|floor|fmod|frexp|ldexp|log|log10|max|min|modf|pow|rad|random|randomseed|sinh?|sqrt|tanh?|tointeger|type)|io\\.(close|flush|input|lines|open|output|popen|read|tmpfile|type|write)|os\\.(clock|date|difftime|execute|exit|getenv|remove|rename|setlocale|time|tmpname)|package\\.(loadlib|seeall|searchpath)|debug\\.(debug|[gs]etfenv|[gs]ethook|getinfo|[gs]etlocal|[gs]etmetatable|getregistry|[gs]etupvalue|[gs]etuservalue|set[Cc]stacklimit|traceback|upvalueid|upvaluejoin)|bit32\\.(arshift|band|bnot|bor|btest|bxor|extract|replace|lrotate|lshift|rrotate|rshift)|utf8\\.(char|codes|codepoint|len|offset))\\b(?!\\s*=(?!=))",
			"name": "support.function.library.lua"
		},
		{
			"match": "\\b(and|or|not|\\|\\||\\&\\&|\\!)\\b",
			"name": "keyword.operator.lua"
		},
		{
			"match": "\\b([a-zA-Z_][a-zA-Z0-9_]*)\\b(?=\\s*(?:[({\"']|\\[\\[))",
			"name": "support.function.any-method.lua"
		},
		{
			"match": "\\b([a-zA-Z_][a-zA-Z0-9_]*)\\b(?=\\s*\\??:)",
			"name": "entity.name.class.lua"
		},
		{
			"match": "(?<=[^.]\\.|:)\\b([a-zA-Z_][a-zA-Z0-9_]*)\\b(?!\\s*=\\s*\\b(function)\\b)",
			"name": "entity.other.attribute.lua"
		},
		{
			"match": "\\b([a-zA-Z_][a-zA-Z0-9_]*)\\b(?!\\s*=\\s*\\b(function)\\b)",
			"name": "variable.other.lua"
		},
		{
			"match": "\\b([a-zA-Z_][a-zA-Z0-9_]*)\\b(?=\\s*=\\s*\\b(function)\\b)",
			"name": "entity.name.function.lua"
		},
		{
			"match": "\\+|-|%|#|\\*|\\/|\\^|==?|~=|!=|<=?|>=?|(?<!\\.)\\.{2}(?!\\.)",
			"name": "keyword.operator.lua"
		}
	],
	"repository": {
		"escaped_char": {
			"patterns": [
				{
					"match": "\\\\[abfnrtv\\\\\"'\\n]",
					"name": "constant.character.escape.lua"
				},
				{
					"match": "\\\\z[\\n\\t ]*",
					"name": "constant.character.escape.lua"
				},
				{
					"match": "\\\\\\d{1,3}",
					"name": "constant.character.escape.byte.lua"
				},
				{
					"match": "\\\\x[0-9A-Fa-f][0-9A-Fa-f]",
					"name": "constant.character.escape.byte.lua"
				},
				{
					"match": "\\\\u\\{[0-9A-Fa-f]+\\}",
					"name": "constant.character.escape.unicode.lua"
				},
				{
					"match": "\\\\.",
					"name": "invalid.illegal.character.escape.lua"
				}
			]
		},
		"string": {
			"patterns": [
				{
					"begin": "'",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.lua"
						}
					},
					"end": "'[ \\t]*|(?=\\n)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.lua"
						}
					},
					"name": "string.quoted.single.lua",
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
							"name": "punctuation.definition.string.begin.lua"
						}
					},
					"end": "\"[ \\t]*|(?=\\n)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.lua"
						}
					},
					"name": "string.quoted.double.lua",
					"patterns": [
						{
							"include": "#escaped_char"
						}
					]
				},
				{
					"begin": "`",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.lua"
						}
					},
					"end": "`[ \\t]*|(?=\\n)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.lua"
						}
					},
					"name": "string.quoted.double.lua"
				},
				{
					"begin": "(?<=\\.cdef)\\s*(\\[(=*)\\[)",
					"beginCaptures": {
						"0": {
							"name": "string.quoted.other.multiline.lua"
						},
						"1": {
							"name": "punctuation.definition.string.begin.lua"
						}
					},
					"contentName": "meta.embedded.lua",
					"end": "(\\]\\2\\])[ \\t]*",
					"endCaptures": {
						"0": {
							"name": "string.quoted.other.multiline.lua"
						},
						"1": {
							"name": "punctuation.definition.string.end.lua"
						}
					},
					"patterns": [
						{
							"include": "source.c"
						}
					]
				},
				{
					"begin": "(?<!--)\\[(=*)\\[",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.lua"
						}
					},
					"end": "\\]\\1\\][ \\t]*",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.lua"
						}
					},
					"name": "string.quoted.other.multiline.lua"
				}
			]
		},
		"comment": {
			"patterns": [
				{
					"begin": "(^[ \\t]+)?(?=--)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.whitespace.comment.leading.lua"
						}
					},
					"end": "(?!\\G)((?!^)[ \\t]+\\n)?",
					"endCaptures": {
						"1": {
							"name": "punctuation.whitespace.comment.trailing.lua"
						}
					},
					"patterns": [
						{
							"begin": "--\\[(=*)\\[@@@",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.comment.begin.lua"
								}
							},
							"end": "(--)?\\]\\1\\]",
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.comment.end.lua"
								}
							},
							"name": "",
							"patterns": [
								{
									"include": "source.lua"
								}
							]
						},
						{
							"begin": "--\\[(=*)\\[",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.comment.begin.lua"
								}
							},
							"end": "(--)?\\]\\1\\]",
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.comment.end.lua"
								}
							},
							"name": "comment.block.lua",
							"patterns": [
								{
									"include": "#emmydoc"
								},
								{
									"include": "#ldoc_tag"
								}
							]
						},
						{
							"begin": "----",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.comment.lua"
								}
							},
							"end": "\\n",
							"name": "comment.line.double-dash.lua"
						},
						{
							"begin": "---",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.comment.lua"
								}
							},
							"end": "\\n",
							"name": "comment.line.double-dash.documentation.lua",
							"patterns": [
								{
									"include": "#emmydoc"
								},
								{
									"include": "#ldoc_tag"
								}
							]
						},
						{
							"begin": "--",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.comment.lua"
								}
							},
							"end": "\\n",
							"name": "comment.line.double-dash.lua",
							"patterns": [
								{
									"include": "#ldoc_tag"
								}
							]
						}
					]
				},
				{
					"begin": "\\/\\*",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.comment.begin.lua"
						}
					},
					"end": "\\*\\/",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.comment.end.lua"
						}
					},
					"name": "comment.block.lua",
					"patterns": [
						{
							"include": "#emmydoc"
						},
						{
							"include": "#ldoc_tag"
						}
					]
				}
			]
		},
		"emmydoc": {
			"patterns": [
				{
					"begin": "(?<=---)[ \\t]*@class",
					"beginCaptures": {
						"0": {
							"name": "storage.type.annotation.lua"
						}
					},
					"end": "(?=[\\n@#])",
					"patterns": [
						{
							"match": "\\b([a-zA-Z_\\*][a-zA-Z0-9_\\.\\*\\-]*)",
							"name": "support.class.lua"
						},
						{
							"match": ":|,",
							"name": "keyword.operator.lua"
						}
					]
				},
				{
					"begin": "(?<=---)[ \\t]*@enum",
					"beginCaptures": {
						"0": {
							"name": "storage.type.annotation.lua"
						}
					},
					"end": "(?=[\\n@#])",
					"patterns": [
						{
							"begin": "\\b([a-zA-Z_\\*][a-zA-Z0-9_\\.\\*\\-]*)",
							"beginCaptures": {
								"0": {
									"name": "variable.lua"
								}
							},
							"end": "(?=\\n)"
						}
					]
				},
				{
					"begin": "(?<=---)[ \\t]*@type",
					"beginCaptures": {
						"0": {
							"name": "storage.type.annotation.lua"
						}
					},
					"end": "(?=[\\n@#])",
					"patterns": [
						{
							"include": "#emmydoc.type"
						}
					]
				},
				{
					"begin": "(?<=---)[ \\t]*@alias",
					"beginCaptures": {
						"0": {
							"name": "storage.type.annotation.lua"
						}
					},
					"end": "(?=[\\n@#])",
					"patterns": [
						{
							"begin": "\\b([a-zA-Z_\\*][a-zA-Z0-9_\\.\\*\\-]*)",
							"beginCaptures": {
								"0": {
									"name": "variable.lua"
								}
							},
							"end": "(?=[\\n#])",
							"patterns": [
								{
									"include": "#emmydoc.type"
								}
							]
						}
					]
				},
				{
					"begin": "(?<=---)[ \\t]*(@operator)\\s*(\\b[a-z]+)?",
					"beginCaptures": {
						"1": {
							"name": "storage.type.annotation.lua"
						},
						"2": {
							"name": "support.function.library.lua"
						}
					},
					"end": "(?=[\\n@#])",
					"patterns": [
						{
							"include": "#emmydoc.type"
						}
					]
				},
				{
					"begin": "(?<=---)[ \\t]*@cast",
					"beginCaptures": {
						"0": {
							"name": "storage.type.annotation.lua"
						}
					},
					"end": "(?=[\\n@#])",
					"patterns": [
						{
							"begin": "\\b([a-zA-Z_\\*][a-zA-Z0-9_\\.\\*\\-]*)",
							"beginCaptures": {
								"0": {
									"name": "variable.other.lua"
								}
							},
							"end": "(?=\\n)",
							"patterns": [
								{
									"include": "#emmydoc.type"
								},
								{
									"match": "([+-|])",
									"name": "keyword.operator.lua"
								}
							]
						}
					]
				},
				{
					"begin": "(?<=---)[ \\t]*@param",
					"beginCaptures": {
						"0": {
							"name": "storage.type.annotation.lua"
						}
					},
					"end": "(?=[\\n@#])",
					"patterns": [
						{
							"begin": "\\b([a-zA-Z_][a-zA-Z0-9_]*)\\b(\\??)",
							"beginCaptures": {
								"1": {
									"name": "entity.name.variable.lua"
								},
								"2": {
									"name": "keyword.operator.lua"
								}
							},
							"end": "(?=[\\n#])",
							"patterns": [
								{
									"include": "#emmydoc.type"
								}
							]
						}
					]
				},
				{
					"begin": "(?<=---)[ \\t]*@return",
					"beginCaptures": {
						"0": {
							"name": "storage.type.annotation.lua"
						}
					},
					"end": "(?=[\\n@#])",
					"patterns": [
						{
							"match": "\\?",
							"name": "keyword.operator.lua"
						},
						{
							"include": "#emmydoc.type"
						}
					]
				},
				{
					"begin": "(?<=---)[ \\t]*@field",
					"beginCaptures": {
						"0": {
							"name": "storage.type.annotation.lua"
						}
					},
					"end": "(?=[\\n@#])",
					"patterns": [
						{
							"begin": "(\\b([a-zA-Z_][a-zA-Z0-9_]*)\\b|(\\[))(\\??)",
							"beginCaptures": {
								"2": {
									"name": "entity.name.variable.lua"
								},
								"3": {
									"name": "keyword.operator.lua"
								}
							},
							"end": "(?=[\\n#])",
							"patterns": [
								{
									"include": "#string"
								},
								{
									"include": "#emmydoc.type"
								},
								{
									"match": "\\]",
									"name": "keyword.operator.lua"
								}
							]
						}
					]
				},
				{
					"begin": "(?<=---)[ \\t]*@generic",
					"beginCaptures": {
						"0": {
							"name": "storage.type.annotation.lua"
						}
					},
					"end": "(?=[\\n@#])",
					"patterns": [
						{
							"begin": "\\b([a-zA-Z_][a-zA-Z0-9_]*)\\b",
							"beginCaptures": {
								"0": {
									"name": "storage.type.generic.lua"
								}
							},
							"end": "(?=\\n)|(,)",
							"endCaptures": {
								"0": {
									"name": "keyword.operator.lua"
								}
							},
							"patterns": [
								{
									"match": ":",
									"name": "keyword.operator.lua"
								},
								{
									"include": "#emmydoc.type"
								}
							]
						}
					]
				},
				{
					"begin": "(?<=---)[ \\t]*@vararg",
					"beginCaptures": {
						"0": {
							"name": "storage.type.annotation.lua"
						}
					},
					"end": "(?=[\\n@#])",
					"patterns": [
						{
							"include": "#emmydoc.type"
						}
					]
				},
				{
					"begin": "(?<=---)[ \\t]*@overload",
					"beginCaptures": {
						"0": {
							"name": "storage.type.annotation.lua"
						}
					},
					"end": "(?=[\\n@#])",
					"patterns": [
						{
							"include": "#emmydoc.type"
						}
					]
				},
				{
					"begin": "(?<=---)[ \\t]*@deprecated",
					"beginCaptures": {
						"0": {
							"name": "storage.type.annotation.lua"
						}
					},
					"end": "(?=[\\n@#])"
				},
				{
					"begin": "(?<=---)[ \\t]*@meta",
					"beginCaptures": {
						"0": {
							"name": "storage.type.annotation.lua"
						}
					},
					"end": "(?=[\\n@#])"
				},
				{
					"begin": "(?<=---)[ \\t]*@private",
					"beginCaptures": {
						"0": {
							"name": "storage.type.annotation.lua"
						}
					},
					"end": "(?=[\\n@#])"
				},
				{
					"begin": "(?<=---)[ \\t]*@protected",
					"beginCaptures": {
						"0": {
							"name": "storage.type.annotation.lua"
						}
					},
					"end": "(?=[\\n@#])"
				},
				{
					"begin": "(?<=---)[ \\t]*@package",
					"beginCaptures": {
						"0": {
							"name": "storage.type.annotation.lua"
						}
					},
					"end": "(?=[\\n@#])"
				},
				{
					"begin": "(?<=---)[ \\t]*@version",
					"beginCaptures": {
						"0": {
							"name": "storage.type.annotation.lua"
						}
					},
					"end": "(?=[\\n@#])",
					"patterns": [
						{
							"match": "\\b(5\\.1|5\\.2|5\\.3|5\\.4|JIT)\\b",
							"name": "support.class.lua"
						},
						{
							"match": ",|\\>|\\<",
							"name": "keyword.operator.lua"
						}
					]
				},
				{
					"begin": "(?<=---)[ \\t]*@see",
					"beginCaptures": {
						"0": {
							"name": "storage.type.annotation.lua"
						}
					},
					"end": "(?=[\\n@#])",
					"patterns": [
						{
							"match": "\\b([a-zA-Z_\\*][a-zA-Z0-9_\\.\\*\\-]*)",
							"name": "support.class.lua"
						},
						{
							"match": "#",
							"name": "keyword.operator.lua"
						}
					]
				},
				{
					"begin": "(?<=---)[ \\t]*@diagnostic",
					"beginCaptures": {
						"0": {
							"name": "storage.type.annotation.lua"
						}
					},
					"end": "(?=[\\n@#])",
					"patterns": [
						{
							"begin": "([a-zA-Z_\\-0-9]+)[ \\t]*(:)?",
							"beginCaptures": {
								"1": {
									"name": "keyword.other.unit"
								},
								"2": {
									"name": "keyword.operator.unit"
								}
							},
							"end": "(?=\\n)",
							"patterns": [
								{
									"match": "\\b([a-zA-Z_\\*][a-zA-Z0-9_\\-]*)",
									"name": "support.class.lua"
								},
								{
									"match": ",",
									"name": "keyword.operator.lua"
								}
							]
						}
					]
				},
				{
					"begin": "(?<=---)[ \\t]*@module",
					"beginCaptures": {
						"0": {
							"name": "storage.type.annotation.lua"
						}
					},
					"end": "(?=[\\n@#])",
					"patterns": [
						{
							"include": "#string"
						}
					]
				},
				{
					"match": "(?<=---)[ \\t]*@(async|nodiscard)",
					"name": "storage.type.annotation.lua"
				},
				{
					"begin": "(?<=---)\\|\\s*[\\>\\+]?",
					"beginCaptures": {
						"0": {
							"name": "storage.type.annotation.lua"
						}
					},
					"end": "(?=[\\n@#])",
					"patterns": [
						{
							"include": "#string"
						}
					]
				}
			]
		},
		"emmydoc.type": {
			"patterns": [
				{
					"begin": "\\bfun\\b",
					"beginCaptures": {
						"0": {
							"name": "keyword.control.lua"
						}
					},
					"end": "(?=[\\s#])",
					"patterns": [
						{
							"match": "[\\(\\),:\\?][ \\t]*",
							"name": "keyword.operator.lua"
						},
						{
							"match": "([a-zA-Z_][a-zA-Z0-9_\\.\\*\\[\\]\\<\\>\\,\\-]*)(?<!,)[ \\t]*(?=\\??:)",
							"name": "entity.name.variable.lua"
						},
						{
							"include": "#emmydoc.type"
						},
						{
							"include": "#string"
						}
					]
				},
				{
					"match": "\\<[a-zA-Z_\\*][a-zA-Z0-9_\\.\\*\\-]*\\>",
					"name": "storage.type.generic.lua"
				},
				{
					"match": "\\basync\\b",
					"name": "entity.name.tag.lua"
				},
				{
					"match": "[\\{\\}\\:\\,\\?\\|\\`][ \\t]*",
					"name": "keyword.operator.lua"
				},
				{
					"begin": "(?=[a-zA-Z_\\.\\*\"'\\[])",
					"end": "(?=[\\s\\)\\,\\?\\:\\}\\|#])",
					"patterns": [
						{
							"match": "([a-zA-Z0-9_\\.\\*\\[\\]\\<\\>\\,\\-]+)(?<!,)[ \\t]*",
							"name": "support.type.lua"
						},
						{
							"match": "(\\.\\.\\.)[ \\t]*",
							"name": "constant.language.lua"
						},
						{
							"include": "#string"
						}
					]
				}
			]
		},
		"ldoc_tag": {
			"match": "\\G[ \\t]*(@)(alias|annotation|author|charset|class|classmod|comment|constructor|copyright|description|example|export|factory|field|file|fixme|function|include|lfunction|license|local|module|name|param|pragma|private|raise|release|return|script|section|see|set|static|submodule|summary|tfield|thread|tparam|treturn|todo|topic|type|usage|warning|within)\\b",
			"captures": {
				"1": {
					"name": "punctuation.definition.block.tag.ldoc"
				},
				"2": {
					"name": "storage.type.class.ldoc"
				}
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/make/.vscodeignore]---
Location: vscode-main/extensions/make/.vscodeignore

```text
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/make/cgmanifest.json]---
Location: vscode-main/extensions/make/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "fadeevab/make.tmbundle",
					"repositoryUrl": "https://github.com/fadeevab/make.tmbundle",
					"commitHash": "1d4c0b541959995db098df751ffc129da39a294b"
				}
			},
			"licenseDetail": [
				"Copyright (c) textmate-make.tmbundle project authors",
				"",
				"If not otherwise specified (see below), files in this repository fall under the following license:",
				"",
				"Permission to copy, use, modify, sell and distribute this",
				"software is granted. This software is provided \"as is\" without",
				"express or implied warranty, and with no claim as to its",
				"suitability for any purpose.",
				"",
				"An exception is made for files in readable text which contain their own license information,",
				"or files where an accompanying file exists (in the same directory) with a \"-license\" suffix added",
				"to the base-name name of the original file, and an extension of txt, html, or similar. For example",
				"\"tidy\" is accompanied by \"tidy-license.txt\"."
			],
			"license": "TextMate Bundle License",
			"version": "0.0.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/make/language-configuration.json]---
Location: vscode-main/extensions/make/language-configuration.json

```json
{
	"comments": {
		"lineComment": {
			"comment": "#",
			"noIndent": true
		}
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
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/make/package.json]---
Location: vscode-main/extensions/make/package.json

```json
{
  "name": "make",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin fadeevab/make.tmbundle Syntaxes/Makefile.plist ./syntaxes/make.tmLanguage.json"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "makefile",
        "aliases": [
          "Makefile",
          "makefile"
        ],
        "extensions": [
          ".mak",
          ".mk"
        ],
        "filenames": [
          "Makefile",
          "makefile",
          "GNUmakefile",
          "OCamlMakefile"
        ],
        "firstLine": "^#!\\s*/usr/bin/make",
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "makefile",
        "scopeName": "source.makefile",
        "path": "./syntaxes/make.tmLanguage.json",
        "tokenTypes": {
          "string.interpolated": "other"
        }
      }
    ],
    "configurationDefaults": {
      "[makefile]": {
        "editor.insertSpaces": false
      }
    }
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/make/package.nls.json]---
Location: vscode-main/extensions/make/package.nls.json

```json
{
	"displayName": "Make Language Basics",
	"description": "Provides syntax highlighting and bracket matching in Make files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/make/syntaxes/make.tmLanguage.json]---
Location: vscode-main/extensions/make/syntaxes/make.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/fadeevab/make.tmbundle/blob/master/Syntaxes/Makefile.plist",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/fadeevab/make.tmbundle/commit/1d4c0b541959995db098df751ffc129da39a294b",
	"name": "Makefile",
	"scopeName": "source.makefile",
	"patterns": [
		{
			"include": "#comment"
		},
		{
			"include": "#variables"
		},
		{
			"include": "#variable-assignment"
		},
		{
			"include": "#directives"
		},
		{
			"include": "#recipe"
		},
		{
			"include": "#target"
		}
	],
	"repository": {
		"comma": {
			"match": ",",
			"name": "punctuation.separator.delimeter.comma.makefile"
		},
		"comment": {
			"begin": "(^[ ]+)?((?<!\\\\)(\\\\\\\\)*)(?=#)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.whitespace.comment.leading.makefile"
				}
			},
			"end": "(?!\\G)",
			"patterns": [
				{
					"begin": "#",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.comment.makefile"
						}
					},
					"end": "(?=[^\\\\])$",
					"name": "comment.line.number-sign.makefile",
					"patterns": [
						{
							"match": "\\\\\\n",
							"name": "constant.character.escape.continuation.makefile"
						}
					]
				}
			]
		},
		"directives": {
			"patterns": [
				{
					"begin": "^[ ]*([s\\-]?include)\\b",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.include.makefile"
						}
					},
					"end": "^",
					"patterns": [
						{
							"include": "#comment"
						},
						{
							"include": "#variables"
						},
						{
							"match": "%",
							"name": "constant.other.placeholder.makefile"
						}
					]
				},
				{
					"begin": "^[ ]*(vpath)\\b",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.vpath.makefile"
						}
					},
					"end": "^",
					"patterns": [
						{
							"include": "#comment"
						},
						{
							"include": "#variables"
						},
						{
							"match": "%",
							"name": "constant.other.placeholder.makefile"
						}
					]
				},
				{
					"begin": "^\\s*(?:(override)\\s*)?(define)\\s*([^\\s]+)\\s*(=|\\?=|:=|\\+=)?(?=\\s)",
					"captures": {
						"1": {
							"name": "keyword.control.override.makefile"
						},
						"2": {
							"name": "keyword.control.define.makefile"
						},
						"3": {
							"name": "variable.other.makefile"
						},
						"4": {
							"name": "punctuation.separator.key-value.makefile"
						}
					},
					"end": "^\\s*(endef)\\b",
					"name": "meta.scope.conditional.makefile",
					"patterns": [
						{
							"begin": "\\G(?!\\n)",
							"end": "^",
							"patterns": [
								{
									"include": "#comment"
								}
							]
						},
						{
							"include": "#variables"
						},
						{
							"include": "#directives"
						}
					]
				},
				{
					"begin": "^[ ]*(export)\\b",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.$1.makefile"
						}
					},
					"end": "^",
					"patterns": [
						{
							"include": "#comment"
						},
						{
							"include": "#variable-assignment"
						},
						{
							"match": "[^\\s]+",
							"name": "variable.other.makefile"
						}
					]
				},
				{
					"begin": "^[ ]*(override|private)\\b",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.$1.makefile"
						}
					},
					"end": "^",
					"patterns": [
						{
							"include": "#comment"
						},
						{
							"include": "#variable-assignment"
						}
					]
				},
				{
					"begin": "^[ ]*(unexport|undefine)\\b",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.$1.makefile"
						}
					},
					"end": "^",
					"patterns": [
						{
							"include": "#comment"
						},
						{
							"match": "[^\\s]+",
							"name": "variable.other.makefile"
						}
					]
				},
				{
					"begin": "^\\s*(ifeq|ifneq|ifdef|ifndef)(?=\\s)",
					"captures": {
						"1": {
							"name": "keyword.control.$1.makefile"
						}
					},
					"end": "^\\s*(endif)\\b",
					"name": "meta.scope.conditional.makefile",
					"patterns": [
						{
							"begin": "\\G",
							"end": "^",
							"name": "meta.scope.condition.makefile",
							"patterns": [
								{
									"include": "#comma"
								},
								{
									"include": "#variables"
								},
								{
									"include": "#comment"
								}
							]
						},
						{
							"begin": "^\\s*else(?=\\s)\\s*(ifeq|ifneq|ifdef|ifndef)*(?=\\s)",
							"beginCaptures": {
								"0": {
									"name": "keyword.control.else.makefile"
								}
							},
							"end": "^",
							"patterns": [
								{
									"include": "#comma"
								},
								{
									"include": "#variables"
								},
								{
									"include": "#comment"
								}
							]
						},
						{
							"include": "$self"
						}
					]
				}
			]
		},
		"target": {
			"begin": "^(?!\\t)([^:]*)(:)(?!\\=)",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"captures": {
								"1": {
									"name": "support.function.target.$1.makefile"
								}
							},
							"match": "^\\s*(\\.(PHONY|SUFFIXES|DEFAULT|PRECIOUS|INTERMEDIATE|SECONDARY|SECONDEXPANSION|DELETE_ON_ERROR|IGNORE|LOW_RESOLUTION_TIME|SILENT|EXPORT_ALL_VARIABLES|NOTPARALLEL|ONESHELL|POSIX))\\s*$"
						},
						{
							"begin": "(?=\\S)",
							"end": "(?=\\s|$)",
							"name": "entity.name.function.target.makefile",
							"patterns": [
								{
									"include": "#variables"
								},
								{
									"match": "%",
									"name": "constant.other.placeholder.makefile"
								}
							]
						}
					]
				},
				"2": {
					"name": "punctuation.separator.key-value.makefile"
				}
			},
			"end": "[^\\\\]$",
			"name": "meta.scope.target.makefile",
			"patterns": [
				{
					"begin": "\\G",
					"end": "(?=[^\\\\])$",
					"name": "meta.scope.prerequisites.makefile",
					"patterns": [
						{
							"match": "\\\\\\n",
							"name": "constant.character.escape.continuation.makefile"
						},
						{
							"match": "%|\\*",
							"name": "constant.other.placeholder.makefile"
						},
						{
							"include": "#comment"
						},
						{
							"include": "#variables"
						}
					]
				}
			]
		},
		"recipe": {
			"begin": "^\\t([+\\-@]*)",
			"beginCaptures": {
				"1": {
					"name": "keyword.control.$1.makefile"
				}
			},
			"end": "[^\\\\]$",
			"name": "meta.scope.recipe.makefile",
			"patterns": [
				{
					"match": "\\\\\\n",
					"name": "constant.character.escape.continuation.makefile"
				},
				{
					"include": "#variables"
				}
			]
		},
		"variable-assignment": {
			"begin": "(^[ ]*|\\G\\s*)([^\\s:#=]+)\\s*((?<![?:+!])=|\\?=|:=|\\+=|!=)",
			"beginCaptures": {
				"2": {
					"name": "variable.other.makefile",
					"patterns": [
						{
							"include": "#variables"
						}
					]
				},
				"3": {
					"name": "punctuation.separator.key-value.makefile"
				}
			},
			"end": "\\n",
			"patterns": [
				{
					"match": "\\\\\\n",
					"name": "constant.character.escape.continuation.makefile"
				},
				{
					"include": "#comment"
				},
				{
					"include": "#variables"
				}
			]
		},
		"interpolation": {
			"patterns": [
				{
					"include": "#parentheses-interpolation"
				},
				{
					"include": "#braces-interpolation"
				}
			]
		},
		"parentheses-interpolation": {
			"begin": "\\(",
			"end": "\\)",
			"patterns": [
				{
					"include": "#variables"
				},
				{
					"include": "#interpolation"
				}
			]
		},
		"braces-interpolation": {
			"begin": "{",
			"end": "}",
			"patterns": [
				{
					"include": "#variables"
				},
				{
					"include": "#interpolation"
				}
			]
		},
		"variables": {
			"patterns": [
				{
					"include": "#simple-variable"
				},
				{
					"include": "#variable-parentheses"
				},
				{
					"include": "#variable-braces"
				}
			]
		},
		"simple-variable": {
			"patterns": [
				{
					"match": "\\$[^(){}]",
					"name": "variable.language.makefile"
				}
			]
		},
		"variable-parentheses": {
			"patterns": [
				{
					"begin": "\\$\\(",
					"captures": {
						"0": {
							"name": "punctuation.definition.variable.makefile"
						}
					},
					"end": "\\)|((?<!\\\\)\\n)",
					"name": "string.interpolated.makefile",
					"patterns": [
						{
							"include": "#variables"
						},
						{
							"include": "#builtin-variable-parentheses"
						},
						{
							"include": "#function-variable-parentheses"
						},
						{
							"include": "#flavor-variable-parentheses"
						},
						{
							"include": "#another-variable-parentheses"
						}
					]
				}
			]
		},
		"variable-braces": {
			"patterns": [
				{
					"begin": "\\${",
					"captures": {
						"0": {
							"name": "punctuation.definition.variable.makefile"
						}
					},
					"end": "}|((?<!\\\\)\\n)",
					"name": "string.interpolated.makefile",
					"patterns": [
						{
							"include": "#variables"
						},
						{
							"include": "#builtin-variable-braces"
						},
						{
							"include": "#function-variable-braces"
						},
						{
							"include": "#flavor-variable-braces"
						},
						{
							"include": "#another-variable-braces"
						}
					]
				}
			]
		},
		"builtin-variable-parentheses": {
			"patterns": [
				{
					"match": "(?<=\\()(MAKEFILES|VPATH|SHELL|MAKESHELL|MAKE|MAKELEVEL|MAKEFLAGS|MAKECMDGOALS|CURDIR|SUFFIXES|\\.LIBPATTERNS)(?=\\s*\\))",
					"name": "variable.language.makefile"
				}
			]
		},
		"builtin-variable-braces": {
			"patterns": [
				{
					"match": "(?<={)(MAKEFILES|VPATH|SHELL|MAKESHELL|MAKE|MAKELEVEL|MAKEFLAGS|MAKECMDGOALS|CURDIR|SUFFIXES|\\.LIBPATTERNS)(?=\\s*})",
					"name": "variable.language.makefile"
				}
			]
		},
		"function-variable-parentheses": {
			"patterns": [
				{
					"begin": "(?<=\\()(subst|patsubst|strip|findstring|filter(-out)?|sort|word(list)?|firstword|lastword|dir|notdir|suffix|basename|addsuffix|addprefix|join|wildcard|realpath|abspath|info|error|warning|shell|foreach|if|or|and|call|eval|value|file|guile)\\s",
					"beginCaptures": {
						"1": {
							"name": "support.function.$1.makefile"
						}
					},
					"end": "(?=\\)|((?<!\\\\)\\n))",
					"name": "meta.scope.function-call.makefile",
					"patterns": [
						{
							"include": "#comma"
						},
						{
							"include": "#variables"
						},
						{
							"include": "#interpolation"
						},
						{
							"match": "%|\\*",
							"name": "constant.other.placeholder.makefile"
						},
						{
							"match": "\\\\\\n",
							"name": "constant.character.escape.continuation.makefile"
						}
					]
				}
			]
		},
		"function-variable-braces": {
			"patterns": [
				{
					"begin": "(?<={)(subst|patsubst|strip|findstring|filter(-out)?|sort|word(list)?|firstword|lastword|dir|notdir|suffix|basename|addsuffix|addprefix|join|wildcard|realpath|abspath|info|error|warning|shell|foreach|if|or|and|call|eval|value|file|guile)\\s",
					"beginCaptures": {
						"1": {
							"name": "support.function.$1.makefile"
						}
					},
					"end": "(?=}|((?<!\\\\)\\n))",
					"name": "meta.scope.function-call.makefile",
					"patterns": [
						{
							"include": "#comma"
						},
						{
							"include": "#variables"
						},
						{
							"include": "#interpolation"
						},
						{
							"match": "%|\\*",
							"name": "constant.other.placeholder.makefile"
						},
						{
							"match": "\\\\\\n",
							"name": "constant.character.escape.continuation.makefile"
						}
					]
				}
			]
		},
		"flavor-variable-parentheses": {
			"patterns": [
				{
					"begin": "(?<=\\()(origin|flavor)\\s(?=[^\\s)]+\\s*\\))",
					"contentName": "variable.other.makefile",
					"beginCaptures": {
						"1": {
							"name": "support.function.$1.makefile"
						}
					},
					"end": "(?=\\))",
					"name": "meta.scope.function-call.makefile",
					"patterns": [
						{
							"include": "#variables"
						}
					]
				}
			]
		},
		"flavor-variable-braces": {
			"patterns": [
				{
					"begin": "(?<={)(origin|flavor)\\s(?=[^\\s}]+\\s*})",
					"contentName": "variable.other.makefile",
					"beginCaptures": {
						"1": {
							"name": "support.function.$1.makefile"
						}
					},
					"end": "(?=})",
					"name": "meta.scope.function-call.makefile",
					"patterns": [
						{
							"include": "#variables"
						}
					]
				}
			]
		},
		"another-variable-parentheses": {
			"patterns": [
				{
					"begin": "(?<=\\()(?!\\))",
					"end": "(?=\\)|((?<!\\\\)\\n))",
					"name": "variable.other.makefile",
					"patterns": [
						{
							"include": "#variables"
						},
						{
							"match": "\\\\\\n",
							"name": "constant.character.escape.continuation.makefile"
						}
					]
				}
			]
		},
		"another-variable-braces": {
			"patterns": [
				{
					"begin": "(?<={)(?!})",
					"end": "(?=}|((?<!\\\\)\\n))",
					"name": "variable.other.makefile",
					"patterns": [
						{
							"include": "#variables"
						},
						{
							"match": "\\\\\\n",
							"name": "constant.character.escape.continuation.makefile"
						}
					]
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-basics/.vscodeignore]---
Location: vscode-main/extensions/markdown-basics/.vscodeignore

```text
test/**
src/**
tsconfig.json
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-basics/cgmanifest.json]---
Location: vscode-main/extensions/markdown-basics/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "textmate/markdown.tmbundle",
					"repositoryUrl": "https://github.com/textmate/markdown.tmbundle",
					"commitHash": "11cf764606cb2cde54badb5d0e5a0758a8871c4b"
				}
			},
			"licenseDetail": [
				"Copyright (c) markdown.tmbundle authors",
				"",
				"If not otherwise specified (see below), files in this repository fall under the following license:",
				"",
				"Permission to copy, use, modify, sell and distribute this",
				"software is granted. This software is provided \"as is\" without",
				"express or implied warranty, and with no claim as to its",
				"suitability for any purpose.",
				"",
				"An exception is made for files in readable text which contain their own license information,",
				"or files where an accompanying file exists (in the same directory) with a \"-license\" suffix added",
				"to the base-name name of the original file, and an extension of txt, html, or similar. For example",
				"\"tidy\" is accompanied by \"tidy-license.txt\"."
			],
			"license": "TextMate Bundle License",
			"version": "0.0.0"
		},
		{
			"component": {
				"type": "git",
				"git": {
					"name": "microsoft/vscode-markdown-tm-grammar",
					"repositoryUrl": "https://github.com/microsoft/vscode-markdown-tm-grammar",
					"commitHash": "0812fc4b190efc17bfed0d5b4ff918eff8e4e377"
				}
			},
			"license": "MIT",
			"version": "1.0.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-basics/language-configuration.json]---
Location: vscode-main/extensions/markdown-basics/language-configuration.json

```json
{
	"comments": {
		// symbols used for start and end a block comment. Remove this entry if your language does not support block comments
		"blockComment": [
			"<!--",
			"-->"
		]
	},
	// symbols used as brackets
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
	"colorizedBracketPairs": [],
	"autoClosingPairs": [
		{
			"open": "{",
			"close": "}"
		},
		{
			"open": "[",
			"close": "]"
		},
		{
			"open": "(",
			"close": ")"
		},
		{
			"open": "<",
			"close": ">",
			"notIn": [
				"string"
			]
		},
	],
	"surroundingPairs": [
		[
			"(",
			")"
		],
		[
			"[",
			"]"
		],
		[
			"`",
			"`"
		],
		[
			"_",
			"_"
		],
		[
			"*",
			"*"
		],
		[
			"{",
			"}"
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
			"<",
			">"
		],
		[
			"~",
			"~"
		],
		[
			"$",
			"$"
		]
	],
	"folding": {
		"offSide": true,
		"markers": {
			"start": "^\\s*<!--\\s*#?region\\b.*-->",
			"end": "^\\s*<!--\\s*#?endregion\\b.*-->"
		}
	},
	"wordPattern": {
		"pattern": "(\\p{Alphabetic}|\\p{Number}|\\p{Nonspacing_Mark})(((\\p{Alphabetic}|\\p{Number}|\\p{Nonspacing_Mark})|[_])?(\\p{Alphabetic}|\\p{Number}|\\p{Nonspacing_Mark}))*",
		"flags": "ug"
	},
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-basics/package.json]---
Location: vscode-main/extensions/markdown-basics/package.json

```json
{
  "name": "markdown",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "^1.20.0"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "markdown",
        "aliases": [
          "Markdown",
          "markdown"
        ],
        "extensions": [
          ".md",
          ".mkd",
          ".mdwn",
          ".mdown",
          ".markdown",
          ".markdn",
          ".mdtxt",
          ".mdtext",
          ".workbook"
        ],
        "filenamePatterns": [
          "**/.cursor/**/*.mdc"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "markdown",
        "scopeName": "text.html.markdown",
        "path": "./syntaxes/markdown.tmLanguage.json",
        "embeddedLanguages": {
          "meta.embedded.block.html": "html",
          "source.js": "javascript",
          "source.css": "css",
          "meta.embedded.block.frontmatter": "yaml",
          "meta.embedded.block.css": "css",
          "meta.embedded.block.ini": "ini",
          "meta.embedded.block.java": "java",
          "meta.embedded.block.lua": "lua",
          "meta.embedded.block.makefile": "makefile",
          "meta.embedded.block.perl": "perl",
          "meta.embedded.block.r": "r",
          "meta.embedded.block.ruby": "ruby",
          "meta.embedded.block.php": "php",
          "meta.embedded.block.sql": "sql",
          "meta.embedded.block.vs_net": "vs_net",
          "meta.embedded.block.xml": "xml",
          "meta.embedded.block.xsl": "xsl",
          "meta.embedded.block.yaml": "yaml",
          "meta.embedded.block.dosbatch": "dosbatch",
          "meta.embedded.block.clojure": "clojure",
          "meta.embedded.block.coffee": "coffee",
          "meta.embedded.block.c": "c",
          "meta.embedded.block.cpp": "cpp",
          "meta.embedded.block.diff": "diff",
          "meta.embedded.block.dockerfile": "dockerfile",
          "meta.embedded.block.go": "go",
          "meta.embedded.block.groovy": "groovy",
          "meta.embedded.block.pug": "jade",
          "meta.embedded.block.ignore": "ignore",
          "meta.embedded.block.javascript": "javascript",
          "meta.embedded.block.json": "json",
          "meta.embedded.block.jsonc": "jsonc",
          "meta.embedded.block.jsonl": "jsonl",
          "meta.embedded.block.latex": "latex",
          "meta.embedded.block.less": "less",
          "meta.embedded.block.objc": "objc",
          "meta.embedded.block.scss": "scss",
          "meta.embedded.block.perl6": "perl6",
          "meta.embedded.block.powershell": "powershell",
          "meta.embedded.block.python": "python",
          "meta.embedded.block.restructuredtext": "restructuredtext",
          "meta.embedded.block.rust": "rust",
          "meta.embedded.block.scala": "scala",
          "meta.embedded.block.shellscript": "shellscript",
          "meta.embedded.block.typescript": "typescript",
          "meta.embedded.block.typescriptreact": "typescriptreact",
          "meta.embedded.block.csharp": "csharp",
          "meta.embedded.block.fsharp": "fsharp"
        },
        "unbalancedBracketScopes": [
          "markup.underline.link.markdown",
          "punctuation.definition.list.begin.markdown"
        ]
      }
    ],
    "snippets": [
      {
        "language": "markdown",
        "path": "./snippets/markdown.code-snippets"
      }
    ],
    "configurationDefaults": {
      "[markdown]": {
        "editor.unicodeHighlight.ambiguousCharacters": false,
        "editor.unicodeHighlight.invisibleCharacters": false,
        "diffEditor.ignoreTrimWhitespace": false
      }
    }
  },
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin microsoft/vscode-markdown-tm-grammar syntaxes/markdown.tmLanguage ./syntaxes/markdown.tmLanguage.json"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-basics/package.nls.json]---
Location: vscode-main/extensions/markdown-basics/package.nls.json

```json
{
	"displayName": "Markdown Language Basics",
	"description": "Provides snippets and syntax highlighting for Markdown."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-basics/snippets/markdown.code-snippets]---
Location: vscode-main/extensions/markdown-basics/snippets/markdown.code-snippets

```text
{
	"Insert bold text": {
		"prefix": "bold",
		"body": "**${1:${TM_SELECTED_TEXT}}**$0",
		"description": "Insert bold text"
	},
	"Insert italic text": {
		"prefix": "italic",
		"body": "*${1:${TM_SELECTED_TEXT}}*$0",
		"description": "Insert italic text"
	},
	"Insert quoted text": {
		"prefix": "quote",
		"body": "${1:${TM_SELECTED_TEXT/^/> /gm}}",
		"description": "Insert quoted text"
	},
	"Insert inline code": {
		"prefix": "code",
		"body": "`${1:${TM_SELECTED_TEXT}}`$0",
		"description": "Insert inline code"
	},
	"Insert fenced code block": {
		"prefix": "fenced codeblock",
		"body": ["```${1|python,c,c++,c#,ruby,go,java,php,htm,css,javascript,json,markdown,console|}", "${TM_SELECTED_TEXT}$0", "```"],
		"description": "Insert fenced code block"
	},
	"Insert heading level 1": {
		"prefix": "heading1",
		"body": "# ${1:${TM_SELECTED_TEXT}}",
		"description": "Insert heading level 1"
	},
	"Insert heading level 2": {
		"prefix": "heading2",
		"body": "## ${1:${TM_SELECTED_TEXT}}",
		"description": "Insert heading level 2"
	},
	"Insert heading level 3": {
		"prefix": "heading3",
		"body": "### ${1:${TM_SELECTED_TEXT}}",
		"description": "Insert heading level 3"
	},
	"Insert heading level 4": {
		"prefix": "heading4",
		"body": "#### ${1:${TM_SELECTED_TEXT}}",
		"description": "Insert heading level 4"
	},
	"Insert heading level 5": {
		"prefix": "heading5",
		"body": "##### ${1:${TM_SELECTED_TEXT}}",
		"description": "Insert heading level 5"
	},
	"Insert heading level 6": {
		"prefix": "heading6",
		"body": "###### ${1:${TM_SELECTED_TEXT}}",
		"description": "Insert heading level 6"
	},
	"Insert unordered list": {
		"prefix": "unordered list",
		"body": ["- ${1:first}", "- ${2:second}", "- ${3:third}", "$0"],
		"description": "Insert unordered list"
	},
	"Insert ordered list": {
		"prefix": "ordered list",
		"body": ["1. ${1:first}", "2. ${2:second}", "3. ${3:third}", "$0"],
		"description": "Insert ordered list"
	},
	"Insert horizontal rule": {
		"prefix": "horizontal rule",
		"body": "----------\n",
		"description": "Insert horizontal rule"
	},
	"Insert link": {
		"prefix": "link",
		"body": "[${TM_SELECTED_TEXT:${1:text}}](${2:https://})$0",
		"description": "Insert link"
	},
	"Insert image": {
		"prefix": "image",
		"body": "![${TM_SELECTED_TEXT:${1:alt}}](${2:https://})$0",
		"description": "Insert image"
	},
	"Insert strikethrough": {
		"prefix": "strikethrough",
		"body": "~~${1:${TM_SELECTED_TEXT}}~~",
		"description": "Insert strikethrough"
	},
	"Insert inline math": {
		"prefix": [
			"inline math"
		],
		"body": "$${1:${TM_SELECTED_TEXT}}$",
		"description": "Insert inline math"
	},
	"Insert fenced math": {
		"prefix": [
			"fenced math"
		],
		"body": [
			"$$",
			"${1:${TM_SELECTED_TEXT}}",
			"$$"
		],
		"description": "Insert fenced math"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-basics/syntaxes/markdown.tmLanguage.json]---
Location: vscode-main/extensions/markdown-basics/syntaxes/markdown.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/microsoft/vscode-markdown-tm-grammar/blob/master/syntaxes/markdown.tmLanguage",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/microsoft/vscode-markdown-tm-grammar/commit/0812fc4b190efc17bfed0d5b4ff918eff8e4e377",
	"name": "Markdown",
	"scopeName": "text.html.markdown",
	"patterns": [
		{
			"include": "#frontMatter"
		},
		{
			"include": "#block"
		}
	],
	"repository": {
		"block": {
			"patterns": [
				{
					"include": "#separator"
				},
				{
					"include": "#heading"
				},
				{
					"include": "#blockquote"
				},
				{
					"include": "#lists"
				},
				{
					"include": "#fenced_code_block"
				},
				{
					"include": "#raw_block"
				},
				{
					"include": "#link-def"
				},
				{
					"include": "#html"
				},
				{
					"include": "#table"
				},
				{
					"include": "#paragraph"
				}
			]
		},
		"blockquote": {
			"begin": "(^|\\G)[ ]{0,3}(>) ?",
			"captures": {
				"2": {
					"name": "punctuation.definition.quote.begin.markdown"
				}
			},
			"name": "markup.quote.markdown",
			"patterns": [
				{
					"include": "#block"
				}
			],
			"while": "(^|\\G)\\s*(>) ?"
		},
		"fenced_code_block_css": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(css|css.erb)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.css",
					"patterns": [
						{
							"include": "source.css"
						}
					]
				}
			]
		},
		"fenced_code_block_basic": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(html|htm|shtml|xhtml|inc|tmpl|tpl)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.html",
					"patterns": [
						{
							"include": "text.html.basic"
						}
					]
				}
			]
		},
		"fenced_code_block_ini": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(ini|conf)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.ini",
					"patterns": [
						{
							"include": "source.ini"
						}
					]
				}
			]
		},
		"fenced_code_block_java": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(java|bsh)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.java",
					"patterns": [
						{
							"include": "source.java"
						}
					]
				}
			]
		},
		"fenced_code_block_lua": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(lua)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.lua",
					"patterns": [
						{
							"include": "source.lua"
						}
					]
				}
			]
		},
		"fenced_code_block_makefile": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(Makefile|makefile|GNUmakefile|OCamlMakefile)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.makefile",
					"patterns": [
						{
							"include": "source.makefile"
						}
					]
				}
			]
		},
		"fenced_code_block_perl": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(perl|pl|pm|pod|t|PL|psgi|vcl)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.perl",
					"patterns": [
						{
							"include": "source.perl"
						}
					]
				}
			]
		},
		"fenced_code_block_r": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(R|r|s|S|Rprofile|\\{\\.r.+?\\})((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.r",
					"patterns": [
						{
							"include": "source.r"
						}
					]
				}
			]
		},
		"fenced_code_block_ruby": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(ruby|rb|rbx|rjs|Rakefile|rake|cgi|fcgi|gemspec|irbrc|Capfile|ru|prawn|Cheffile|Gemfile|Guardfile|Hobofile|Vagrantfile|Appraisals|Rantfile|Berksfile|Berksfile.lock|Thorfile|Puppetfile)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.ruby",
					"patterns": [
						{
							"include": "source.ruby"
						}
					]
				}
			]
		},
		"fenced_code_block_php": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(php|php3|php4|php5|phpt|phtml|aw|ctp)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.php",
					"patterns": [
						{
							"include": "text.html.basic"
						},
						{
							"include": "source.php"
						}
					]
				}
			]
		},
		"fenced_code_block_sql": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(sql|ddl|dml)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.sql",
					"patterns": [
						{
							"include": "source.sql"
						}
					]
				}
			]
		},
		"fenced_code_block_vs_net": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(vb)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.vs_net",
					"patterns": [
						{
							"include": "source.asp.vb.net"
						}
					]
				}
			]
		},
		"fenced_code_block_xml": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(xml|xsd|tld|jsp|pt|cpt|dtml|rss|opml)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.xml",
					"patterns": [
						{
							"include": "text.xml"
						}
					]
				}
			]
		},
		"fenced_code_block_xsl": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(xsl|xslt)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.xsl",
					"patterns": [
						{
							"include": "text.xml.xsl"
						}
					]
				}
			]
		},
		"fenced_code_block_yaml": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(yaml|yml)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.yaml",
					"patterns": [
						{
							"include": "source.yaml"
						}
					]
				}
			]
		},
		"fenced_code_block_dosbatch": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(bat|batch)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.dosbatch",
					"patterns": [
						{
							"include": "source.batchfile"
						}
					]
				}
			]
		},
		"fenced_code_block_clojure": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(clj|cljs|clojure)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.clojure",
					"patterns": [
						{
							"include": "source.clojure"
						}
					]
				}
			]
		},
		"fenced_code_block_coffee": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(coffee|Cakefile|coffee.erb)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.coffee",
					"patterns": [
						{
							"include": "source.coffee"
						}
					]
				}
			]
		},
		"fenced_code_block_c": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(c|h)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.c",
					"patterns": [
						{
							"include": "source.c"
						}
					]
				}
			]
		},
		"fenced_code_block_cpp": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(cpp|c\\+\\+|cxx)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.cpp source.cpp",
					"patterns": [
						{
							"include": "source.cpp"
						}
					]
				}
			]
		},
		"fenced_code_block_diff": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(patch|diff|rej)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.diff",
					"patterns": [
						{
							"include": "source.diff"
						}
					]
				}
			]
		},
		"fenced_code_block_dockerfile": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(dockerfile|Dockerfile)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.dockerfile",
					"patterns": [
						{
							"include": "source.dockerfile"
						}
					]
				}
			]
		},
		"fenced_code_block_git_commit": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(COMMIT_EDITMSG|MERGE_MSG)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.git_commit",
					"patterns": [
						{
							"include": "text.git-commit"
						}
					]
				}
			]
		},
		"fenced_code_block_git_rebase": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(git-rebase-todo)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.git_rebase",
					"patterns": [
						{
							"include": "text.git-rebase"
						}
					]
				}
			]
		},
		"fenced_code_block_go": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(go|golang)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.go",
					"patterns": [
						{
							"include": "source.go"
						}
					]
				}
			]
		},
		"fenced_code_block_groovy": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(groovy|gvy)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.groovy",
					"patterns": [
						{
							"include": "source.groovy"
						}
					]
				}
			]
		},
		"fenced_code_block_pug": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(jade|pug)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.pug",
					"patterns": [
						{
							"include": "text.pug"
						}
					]
				}
			]
		},
		"fenced_code_block_ignore": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(gitignore|ignore)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.ignore",
					"patterns": [
						{
							"include": "source.ignore"
						}
					]
				}
			]
		},
		"fenced_code_block_js": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(js|jsx|javascript|es6|mjs|cjs|dataviewjs|\\{\\.js.+?\\})((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.javascript",
					"patterns": [
						{
							"include": "source.js"
						}
					]
				}
			]
		},
		"fenced_code_block_js_regexp": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(regexp)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.js_regexp",
					"patterns": [
						{
							"include": "source.js.regexp"
						}
					]
				}
			]
		},
		"fenced_code_block_json": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(json|json5|sublime-settings|sublime-menu|sublime-keymap|sublime-mousemap|sublime-theme|sublime-build|sublime-project|sublime-completions)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.json",
					"patterns": [
						{
							"include": "source.json"
						}
					]
				}
			]
		},
		"fenced_code_block_jsonc": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(jsonc)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.jsonc",
					"patterns": [
						{
							"include": "source.json.comments"
						}
					]
				}
			]
		},
		"fenced_code_block_jsonl": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(jsonl|jsonlines)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.jsonl",
					"patterns": [
						{
							"include": "source.json.lines"
						}
					]
				}
			]
		},
		"fenced_code_block_less": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(less)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.less",
					"patterns": [
						{
							"include": "source.css.less"
						}
					]
				}
			]
		},
		"fenced_code_block_objc": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(objectivec|objective-c|mm|objc|obj-c|m|h)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.objc",
					"patterns": [
						{
							"include": "source.objc"
						}
					]
				}
			]
		},
		"fenced_code_block_swift": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(swift)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.swift",
					"patterns": [
						{
							"include": "source.swift"
						}
					]
				}
			]
		},
		"fenced_code_block_scss": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(scss)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.scss",
					"patterns": [
						{
							"include": "source.css.scss"
						}
					]
				}
			]
		},
		"fenced_code_block_perl6": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(perl6|p6|pl6|pm6|nqp)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.perl6",
					"patterns": [
						{
							"include": "source.perl.6"
						}
					]
				}
			]
		},
		"fenced_code_block_powershell": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(powershell|ps1|psm1|psd1|pwsh)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.powershell",
					"patterns": [
						{
							"include": "source.powershell"
						}
					]
				}
			]
		},
		"fenced_code_block_python": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(python|py|py3|rpy|pyw|cpy|SConstruct|Sconstruct|sconstruct|SConscript|gyp|gypi|\\{\\.python.+?\\})((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.python",
					"patterns": [
						{
							"include": "source.python"
						}
					]
				}
			]
		},
		"fenced_code_block_julia": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(julia|\\{\\.julia.+?\\})((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.julia",
					"patterns": [
						{
							"include": "source.julia"
						}
					]
				}
			]
		},
		"fenced_code_block_regexp_python": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(re)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.regexp_python",
					"patterns": [
						{
							"include": "source.regexp.python"
						}
					]
				}
			]
		},
		"fenced_code_block_rust": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(rust|rs|\\{\\.rust.+?\\})((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.rust",
					"patterns": [
						{
							"include": "source.rust"
						}
					]
				}
			]
		},
		"fenced_code_block_scala": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(scala|sbt)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.scala",
					"patterns": [
						{
							"include": "source.scala"
						}
					]
				}
			]
		},
		"fenced_code_block_shell": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(shell|sh|bash|zsh|bashrc|bash_profile|bash_login|profile|bash_logout|.textmate_init|\\{\\.bash.+?\\})((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.shellscript",
					"patterns": [
						{
							"include": "source.shell"
						}
					]
				}
			]
		},
		"fenced_code_block_ts": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(typescript|ts)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.typescript",
					"patterns": [
						{
							"include": "source.ts"
						}
					]
				}
			]
		},
		"fenced_code_block_tsx": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(tsx)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.typescriptreact",
					"patterns": [
						{
							"include": "source.tsx"
						}
					]
				}
			]
		},
		"fenced_code_block_csharp": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(cs|csharp|c#)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.csharp",
					"patterns": [
						{
							"include": "source.cs"
						}
					]
				}
			]
		},
		"fenced_code_block_fsharp": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(fs|fsharp|f#)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.fsharp",
					"patterns": [
						{
							"include": "source.fsharp"
						}
					]
				}
			]
		},
		"fenced_code_block_dart": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(dart)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.dart",
					"patterns": [
						{
							"include": "source.dart"
						}
					]
				}
			]
		},
		"fenced_code_block_handlebars": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(handlebars|hbs)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.handlebars",
					"patterns": [
						{
							"include": "text.html.handlebars"
						}
					]
				}
			]
		},
		"fenced_code_block_markdown": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(markdown|md)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.markdown",
					"patterns": [
						{
							"include": "text.html.markdown"
						}
					]
				}
			]
		},
		"fenced_code_block_log": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(log)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.log",
					"patterns": [
						{
							"include": "text.log"
						}
					]
				}
			]
		},
		"fenced_code_block_erlang": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(erlang)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.erlang",
					"patterns": [
						{
							"include": "source.erlang"
						}
					]
				}
			]
		},
		"fenced_code_block_elixir": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(elixir)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.elixir",
					"patterns": [
						{
							"include": "source.elixir"
						}
					]
				}
			]
		},
		"fenced_code_block_latex": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(latex|tex)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.latex",
					"patterns": [
						{
							"include": "text.tex.latex"
						}
					]
				}
			]
		},
		"fenced_code_block_bibtex": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(bibtex)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.bibtex",
					"patterns": [
						{
							"include": "text.bibtex"
						}
					]
				}
			]
		},
		"fenced_code_block_twig": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(twig)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.twig",
					"patterns": [
						{
							"include": "source.twig"
						}
					]
				}
			]
		},
		"fenced_code_block_yang": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(yang)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.yang",
					"patterns": [
						{
							"include": "source.yang"
						}
					]
				}
			]
		},
		"fenced_code_block_abap": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(abap)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.abap",
					"patterns": [
						{
							"include": "source.abap"
						}
					]
				}
			]
		},
		"fenced_code_block_restructuredtext": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?i:(restructuredtext|rst)((\\s+|:|,|\\{|\\?)[^`]*)?$)",
			"name": "markup.fenced_code.block.markdown",
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language.markdown"
				},
				"5": {
					"name": "fenced_code.block.language.attributes.markdown"
				}
			},
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"patterns": [
				{
					"begin": "(^|\\G)(\\s*)(.*)",
					"while": "(^|\\G)(?!\\s*([`~]{3,})\\s*$)",
					"contentName": "meta.embedded.block.restructuredtext",
					"patterns": [
						{
							"include": "source.rst"
						}
					]
				}
			]
		},
		"fenced_code_block": {
			"patterns": [
				{
					"include": "#fenced_code_block_css"
				},
				{
					"include": "#fenced_code_block_basic"
				},
				{
					"include": "#fenced_code_block_ini"
				},
				{
					"include": "#fenced_code_block_java"
				},
				{
					"include": "#fenced_code_block_lua"
				},
				{
					"include": "#fenced_code_block_makefile"
				},
				{
					"include": "#fenced_code_block_perl"
				},
				{
					"include": "#fenced_code_block_r"
				},
				{
					"include": "#fenced_code_block_ruby"
				},
				{
					"include": "#fenced_code_block_php"
				},
				{
					"include": "#fenced_code_block_sql"
				},
				{
					"include": "#fenced_code_block_vs_net"
				},
				{
					"include": "#fenced_code_block_xml"
				},
				{
					"include": "#fenced_code_block_xsl"
				},
				{
					"include": "#fenced_code_block_yaml"
				},
				{
					"include": "#fenced_code_block_dosbatch"
				},
				{
					"include": "#fenced_code_block_clojure"
				},
				{
					"include": "#fenced_code_block_coffee"
				},
				{
					"include": "#fenced_code_block_c"
				},
				{
					"include": "#fenced_code_block_cpp"
				},
				{
					"include": "#fenced_code_block_diff"
				},
				{
					"include": "#fenced_code_block_dockerfile"
				},
				{
					"include": "#fenced_code_block_git_commit"
				},
				{
					"include": "#fenced_code_block_git_rebase"
				},
				{
					"include": "#fenced_code_block_go"
				},
				{
					"include": "#fenced_code_block_groovy"
				},
				{
					"include": "#fenced_code_block_pug"
				},
				{
					"include": "#fenced_code_block_ignore"
				},
				{
					"include": "#fenced_code_block_js"
				},
				{
					"include": "#fenced_code_block_js_regexp"
				},
				{
					"include": "#fenced_code_block_json"
				},
				{
					"include": "#fenced_code_block_jsonc"
				},
				{
					"include": "#fenced_code_block_jsonl"
				},
				{
					"include": "#fenced_code_block_less"
				},
				{
					"include": "#fenced_code_block_objc"
				},
				{
					"include": "#fenced_code_block_swift"
				},
				{
					"include": "#fenced_code_block_scss"
				},
				{
					"include": "#fenced_code_block_perl6"
				},
				{
					"include": "#fenced_code_block_powershell"
				},
				{
					"include": "#fenced_code_block_python"
				},
				{
					"include": "#fenced_code_block_julia"
				},
				{
					"include": "#fenced_code_block_regexp_python"
				},
				{
					"include": "#fenced_code_block_rust"
				},
				{
					"include": "#fenced_code_block_scala"
				},
				{
					"include": "#fenced_code_block_shell"
				},
				{
					"include": "#fenced_code_block_ts"
				},
				{
					"include": "#fenced_code_block_tsx"
				},
				{
					"include": "#fenced_code_block_csharp"
				},
				{
					"include": "#fenced_code_block_fsharp"
				},
				{
					"include": "#fenced_code_block_dart"
				},
				{
					"include": "#fenced_code_block_handlebars"
				},
				{
					"include": "#fenced_code_block_markdown"
				},
				{
					"include": "#fenced_code_block_log"
				},
				{
					"include": "#fenced_code_block_erlang"
				},
				{
					"include": "#fenced_code_block_elixir"
				},
				{
					"include": "#fenced_code_block_latex"
				},
				{
					"include": "#fenced_code_block_bibtex"
				},
				{
					"include": "#fenced_code_block_twig"
				},
				{
					"include": "#fenced_code_block_yang"
				},
				{
					"include": "#fenced_code_block_abap"
				},
				{
					"include": "#fenced_code_block_restructuredtext"
				},
				{
					"include": "#fenced_code_block_unknown"
				}
			]
		},
		"fenced_code_block_unknown": {
			"begin": "(^|\\G)(\\s*)(`{3,}|~{3,})\\s*(?=([^`]*)?$)",
			"beginCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				},
				"4": {
					"name": "fenced_code.block.language"
				}
			},
			"end": "(^|\\G)(\\2|\\s{0,3})(\\3)\\s*$",
			"endCaptures": {
				"3": {
					"name": "punctuation.definition.markdown"
				}
			},
			"name": "markup.fenced_code.block.markdown"
		},
		"heading": {
			"match": "(?:^|\\G)[ ]{0,3}(#{1,6}\\s+(.*?)(\\s+#{1,6})?\\s*)$",
			"captures": {
				"1": {
					"patterns": [
						{
							"match": "(#{6})\\s+(.*?)(?:\\s+(#+))?\\s*$",
							"name": "heading.6.markdown",
							"captures": {
								"1": {
									"name": "punctuation.definition.heading.markdown"
								},
								"2": {
									"name": "entity.name.section.markdown",
									"patterns": [
										{
											"include": "#inline"
										},
										{
											"include": "text.html.derivative"
										}
									]
								},
								"3": {
									"name": "punctuation.definition.heading.markdown"
								}
							}
						},
						{
							"match": "(#{5})\\s+(.*?)(?:\\s+(#+))?\\s*$",
							"name": "heading.5.markdown",
							"captures": {
								"1": {
									"name": "punctuation.definition.heading.markdown"
								},
								"2": {
									"name": "entity.name.section.markdown",
									"patterns": [
										{
											"include": "#inline"
										},
										{
											"include": "text.html.derivative"
										}
									]
								},
								"3": {
									"name": "punctuation.definition.heading.markdown"
								}
							}
						},
						{
							"match": "(#{4})\\s+(.*?)(?:\\s+(#+))?\\s*$",
							"name": "heading.4.markdown",
							"captures": {
								"1": {
									"name": "punctuation.definition.heading.markdown"
								},
								"2": {
									"name": "entity.name.section.markdown",
									"patterns": [
										{
											"include": "#inline"
										},
										{
											"include": "text.html.derivative"
										}
									]
								},
								"3": {
									"name": "punctuation.definition.heading.markdown"
								}
							}
						},
						{
							"match": "(#{3})\\s+(.*?)(?:\\s+(#+))?\\s*$",
							"name": "heading.3.markdown",
							"captures": {
								"1": {
									"name": "punctuation.definition.heading.markdown"
								},
								"2": {
									"name": "entity.name.section.markdown",
									"patterns": [
										{
											"include": "#inline"
										},
										{
											"include": "text.html.derivative"
										}
									]
								},
								"3": {
									"name": "punctuation.definition.heading.markdown"
								}
							}
						},
						{
							"match": "(#{2})\\s+(.*?)(?:\\s+(#+))?\\s*$",
							"name": "heading.2.markdown",
							"captures": {
								"1": {
									"name": "punctuation.definition.heading.markdown"
								},
								"2": {
									"name": "entity.name.section.markdown",
									"patterns": [
										{
											"include": "#inline"
										},
										{
											"include": "text.html.derivative"
										}
									]
								},
								"3": {
									"name": "punctuation.definition.heading.markdown"
								}
							}
						},
						{
							"match": "(#{1})\\s+(.*?)(?:\\s+(#+))?\\s*$",
							"name": "heading.1.markdown",
							"captures": {
								"1": {
									"name": "punctuation.definition.heading.markdown"
								},
								"2": {
									"name": "entity.name.section.markdown",
									"patterns": [
										{
											"include": "#inline"
										},
										{
											"include": "text.html.derivative"
										}
									]
								},
								"3": {
									"name": "punctuation.definition.heading.markdown"
								}
							}
						}
					]
				}
			},
			"name": "markup.heading.markdown"
		},
		"heading-setext": {
			"patterns": [
				{
					"match": "^(={3,})(?=[ \\t]*$\\n?)",
					"name": "markup.heading.setext.1.markdown"
				},
				{
					"match": "^(-{3,})(?=[ \\t]*$\\n?)",
					"name": "markup.heading.setext.2.markdown"
				}
			]
		},
		"html": {
			"patterns": [
				{
					"begin": "(^|\\G)\\s*(<!--)",
					"captures": {
						"1": {
							"name": "punctuation.definition.comment.html"
						},
						"2": {
							"name": "punctuation.definition.comment.html"
						}
					},
					"end": "(-->)",
					"name": "comment.block.html"
				},
				{
					"begin": "(?i)(^|\\G)\\s*(?=<(script|style|pre)(\\s|$|>)(?!.*?</(script|style|pre)>))",
					"end": "(?i)(.*)((</)(script|style|pre)(>))",
					"endCaptures": {
						"1": {
							"patterns": [
								{
									"include": "text.html.derivative"
								}
							]
						},
						"2": {
							"name": "meta.tag.structure.$4.end.html"
						},
						"3": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"4": {
							"name": "entity.name.tag.html"
						},
						"5": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"patterns": [
						{
							"begin": "(\\s*|$)",
							"patterns": [
								{
									"include": "text.html.derivative"
								}
							],
							"while": "(?i)^(?!.*</(script|style|pre)>)"
						}
					]
				},
				{
					"begin": "(?i)(^|\\G)\\s*(?=</?[a-zA-Z]+[^\\s/&gt;]*(\\s|$|/?>))",
					"patterns": [
						{
							"include": "text.html.derivative"
						}
					],
					"while": "^(?!\\s*$)"
				},
				{
					"begin": "(^|\\G)\\s*(?=(<[a-zA-Z0-9\\-](/?>|\\s.*?>)|</[a-zA-Z0-9\\-]>)\\s*$)",
					"patterns": [
						{
							"include": "text.html.derivative"
						}
					],
					"while": "^(?!\\s*$)"
				}
			]
		},
		"link-def": {
			"captures": {
				"1": {
					"name": "punctuation.definition.constant.markdown"
				},
				"2": {
					"name": "constant.other.reference.link.markdown"
				},
				"3": {
					"name": "punctuation.definition.constant.markdown"
				},
				"4": {
					"name": "punctuation.separator.key-value.markdown"
				},
				"5": {
					"name": "punctuation.definition.link.markdown"
				},
				"6": {
					"name": "markup.underline.link.markdown"
				},
				"7": {
					"name": "punctuation.definition.link.markdown"
				},
				"8": {
					"name": "markup.underline.link.markdown"
				},
				"9": {
					"name": "string.other.link.description.title.markdown"
				},
				"10": {
					"name": "punctuation.definition.string.begin.markdown"
				},
				"11": {
					"name": "punctuation.definition.string.end.markdown"
				},
				"12": {
					"name": "string.other.link.description.title.markdown"
				},
				"13": {
					"name": "punctuation.definition.string.begin.markdown"
				},
				"14": {
					"name": "punctuation.definition.string.end.markdown"
				},
				"15": {
					"name": "string.other.link.description.title.markdown"
				},
				"16": {
					"name": "punctuation.definition.string.begin.markdown"
				},
				"17": {
					"name": "punctuation.definition.string.end.markdown"
				}
			},
			"match": "(?x)\n  \\s*            # Leading whitespace\n  (\\[)([^]]+?)(\\])(:)    # Reference name\n  [ \\t]*          # Optional whitespace\n  (?:(<)((?:\\\\[<>]|[^<>\\n])*)(>)|(\\S+?))      # The url\n  [ \\t]*          # Optional whitespace\n  (?:\n      ((\\().+?(\\)))    # Match title in parens…\n    | ((\").+?(\"))    # or in double quotes…\n    | ((').+?('))    # or in single quotes.\n  )?            # Title is optional\n  \\s*            # Optional whitespace\n  $\n",
			"name": "meta.link.reference.def.markdown"
		},
		"list_paragraph": {
			"begin": "(^|\\G)(?=\\S)(?![*+->]\\s|[0-9]+\\.\\s)",
			"name": "meta.paragraph.markdown",
			"patterns": [
				{
					"include": "#inline"
				},
				{
					"include": "text.html.derivative"
				},
				{
					"include": "#heading-setext"
				}
			],
			"while": "(^|\\G)(?!\\s*$|#|[ ]{0,3}([-*_>][ ]{2,}){3,}[ \\t]*$\\n?|[ ]{0,3}[*+->]|[ ]{0,3}[0-9]+\\.)"
		},
		"lists": {
			"patterns": [
				{
					"begin": "(^|\\G)([ ]{0,3})([*+-])([ \\t])",
					"beginCaptures": {
						"3": {
							"name": "punctuation.definition.list.begin.markdown"
						}
					},
					"comment": "Currently does not support un-indented second lines.",
					"name": "markup.list.unnumbered.markdown",
					"patterns": [
						{
							"include": "#block"
						},
						{
							"include": "#list_paragraph"
						}
					],
					"while": "((^|\\G)([ ]{2,4}|\\t))|(^[ \\t]*$)"
				},
				{
					"begin": "(^|\\G)([ ]{0,3})([0-9]+[\\.\\)])([ \\t])",
					"beginCaptures": {
						"3": {
							"name": "punctuation.definition.list.begin.markdown"
						}
					},
					"name": "markup.list.numbered.markdown",
					"patterns": [
						{
							"include": "#block"
						},
						{
							"include": "#list_paragraph"
						}
					],
					"while": "((^|\\G)([ ]{2,4}|\\t))|(^[ \\t]*$)"
				}
			]
		},
		"paragraph": {
			"begin": "(^|\\G)[ ]{0,3}(?=[^ \\t\\n])",
			"name": "meta.paragraph.markdown",
			"patterns": [
				{
					"include": "#inline"
				},
				{
					"include": "text.html.derivative"
				},
				{
					"include": "#heading-setext"
				}
			],
			"while": "(^|\\G)((?=\\s*[-=]{3,}\\s*$)|[ ]{4,}(?=[^ \\t\\n]))"
		},
		"raw_block": {
			"begin": "(^|\\G)([ ]{4}|\\t)",
			"name": "markup.raw.block.markdown",
			"while": "(^|\\G)([ ]{4}|\\t)"
		},
		"separator": {
			"match": "(^|\\G)[ ]{0,3}([\\*\\-\\_])([ ]{0,2}\\2){2,}[ \\t]*$\\n?",
			"name": "meta.separator.markdown"
		},
		"frontMatter": {
			"begin": "\\A(?=(-{3,}))",
			"end": "^ {,3}\\1-*[ \\t]*$|^[ \\t]*\\.{3}$",
			"applyEndPatternLast": 1,
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.end.frontmatter"
				}
			},
			"patterns": [
				{
					"begin": "\\A(-{3,})(.*)$",
					"while": "^(?! {,3}\\1-*[ \\t]*$|[ \\t]*\\.{3}$)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.begin.frontmatter"
						},
						"2": {
							"name": "comment.frontmatter"
						}
					},
					"contentName": "meta.embedded.block.frontmatter",
					"patterns": [
						{
							"include": "source.yaml"
						}
					]
				}
			]
		},
		"table": {
			"name": "markup.table.markdown",
			"begin": "(^|\\G)(\\|)(?=[^|].+\\|\\s*$)",
			"beginCaptures": {
				"2": {
					"name": "punctuation.definition.table.markdown"
				}
			},
			"while": "(^|\\G)(?=\\|)",
			"patterns": [
				{
					"match": "\\|",
					"name": "punctuation.definition.table.markdown"
				},
				{
					"match": "(?<=\\|)\\s*(:?-+:?)\\s*(?=\\|)",
					"captures": {
						"1": {
							"name": "punctuation.separator.table.markdown"
						}
					}
				},
				{
					"match": "(?<=\\|)\\s*(?=\\S)((\\\\\\||[^|])+)(?<=\\S)\\s*(?=\\|)",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#inline"
								}
							]
						}
					}
				}
			]
		},
		"inline": {
			"patterns": [
				{
					"include": "#ampersand"
				},
				{
					"include": "#bracket"
				},
				{
					"include": "#bold"
				},
				{
					"include": "#italic"
				},
				{
					"include": "#raw"
				},
				{
					"include": "#strikethrough"
				},
				{
					"include": "#escape"
				},
				{
					"include": "#image-inline"
				},
				{
					"include": "#image-ref"
				},
				{
					"include": "#link-email"
				},
				{
					"include": "#link-inet"
				},
				{
					"include": "#link-inline"
				},
				{
					"include": "#link-ref"
				},
				{
					"include": "#link-ref-literal"
				},
				{
					"include": "#link-ref-shortcut"
				}
			]
		},
		"ampersand": {
			"comment": "Markdown will convert this for us. We match it so that the HTML grammar will not mark it up as invalid.",
			"match": "&(?!([a-zA-Z0-9]+|#[0-9]+|#x[0-9a-fA-F]+);)",
			"name": "meta.other.valid-ampersand.markdown"
		},
		"bold": {
			"begin": "(?x) (?<open>(\\*\\*(?=\\w)|(?<!\\w)\\*\\*|(?<!\\w)\\b__))(?=\\S) (?=\n  (\n    <[^>]*+>              # HTML tags\n    | (?<raw>`+)([^`]|(?!(?<!`)\\k<raw>(?!`))`)*+\\k<raw>\n                      # Raw\n    | \\\\[\\\\`*_{}\\[\\]()#.!+\\->]?+      # Escapes\n    | \\[\n    (\n        (?<square>          # Named group\n          [^\\[\\]\\\\]        # Match most chars\n          | \\\\.            # Escaped chars\n          | \\[ \\g<square>*+ \\]    # Nested brackets\n        )*+\n      \\]\n      (\n        (              # Reference Link\n          [ ]?          # Optional space\n          \\[[^\\]]*+\\]        # Ref name\n        )\n        | (              # Inline Link\n          \\(            # Opening paren\n            [ \\t]*+        # Optional whitespace\n            <?(.*?)>?      # URL\n            [ \\t]*+        # Optional whitespace\n            (          # Optional Title\n              (?<title>['\"])\n              (.*?)\n              \\k<title>\n            )?\n          \\)\n        )\n      )\n    )\n    | (?!(?<=\\S)\\k<open>).            # Everything besides\n                      # style closer\n  )++\n  (?<=\\S)(?=__\\b|\\*\\*)\\k<open>                # Close\n)\n",
			"captures": {
				"1": {
					"name": "punctuation.definition.bold.markdown"
				}
			},
			"end": "(?<=\\S)(\\1)",
			"name": "markup.bold.markdown",
			"patterns": [
				{
					"applyEndPatternLast": 1,
					"begin": "(?=<[^>]*?>)",
					"end": "(?<=>)",
					"patterns": [
						{
							"include": "text.html.derivative"
						}
					]
				},
				{
					"include": "#escape"
				},
				{
					"include": "#ampersand"
				},
				{
					"include": "#bracket"
				},
				{
					"include": "#raw"
				},
				{
					"include": "#bold"
				},
				{
					"include": "#italic"
				},
				{
					"include": "#image-inline"
				},
				{
					"include": "#link-inline"
				},
				{
					"include": "#link-inet"
				},
				{
					"include": "#link-email"
				},
				{
					"include": "#image-ref"
				},
				{
					"include": "#link-ref-literal"
				},
				{
					"include": "#link-ref"
				},
				{
					"include": "#link-ref-shortcut"
				},
				{
					"include": "#strikethrough"
				}
			]
		},
		"bracket": {
			"comment": "Markdown will convert this for us. We match it so that the HTML grammar will not mark it up as invalid.",
			"match": "<(?![a-zA-Z/?\\$!])",
			"name": "meta.other.valid-bracket.markdown"
		},
		"escape": {
			"match": "\\\\[-`*_#+.!(){}\\[\\]\\\\>]",
			"name": "constant.character.escape.markdown"
		},
		"image-inline": {
			"captures": {
				"1": {
					"name": "punctuation.definition.link.description.begin.markdown"
				},
				"2": {
					"name": "string.other.link.description.markdown"
				},
				"4": {
					"name": "punctuation.definition.link.description.end.markdown"
				},
				"5": {
					"name": "punctuation.definition.metadata.markdown"
				},
				"7": {
					"name": "punctuation.definition.link.markdown"
				},
				"8": {
					"name": "markup.underline.link.image.markdown"
				},
				"9": {
					"name": "punctuation.definition.link.markdown"
				},
				"10": {
					"name": "markup.underline.link.image.markdown"
				},
				"12": {
					"name": "string.other.link.description.title.markdown"
				},
				"13": {
					"name": "punctuation.definition.string.begin.markdown"
				},
				"14": {
					"name": "punctuation.definition.string.end.markdown"
				},
				"15": {
					"name": "string.other.link.description.title.markdown"
				},
				"16": {
					"name": "punctuation.definition.string.begin.markdown"
				},
				"17": {
					"name": "punctuation.definition.string.end.markdown"
				},
				"18": {
					"name": "string.other.link.description.title.markdown"
				},
				"19": {
					"name": "punctuation.definition.string.begin.markdown"
				},
				"20": {
					"name": "punctuation.definition.string.end.markdown"
				},
				"21": {
					"name": "punctuation.definition.metadata.markdown"
				}
			},
			"match": "(?x)\n  (\\!\\[)((?<square>[^\\[\\]\\\\]|\\\\.|\\[\\g<square>*+\\])*+)(\\])\n                # Match the link text.\n  (\\()            # Opening paren for url\n    # The url\n      [ \\t]*\n      (\n         (<)((?:\\\\[<>]|[^<>\\n])*)(>)\n         | ((?<url>(?>[^\\s()]+)|\\(\\g<url>*\\))*)\n      )\n      [ \\t]*\n    (?:\n        ((\\().+?(\\)))    # Match title in parens…\n      | ((\").+?(\"))    # or in double quotes…\n      | ((').+?('))    # or in single quotes.\n    )?            # Title is optional\n    \\s*            # Optional whitespace\n  (\\))\n",
			"name": "meta.image.inline.markdown"
		},
		"image-ref": {
			"captures": {
				"1": {
					"name": "punctuation.definition.link.description.begin.markdown"
				},
				"2": {
					"name": "string.other.link.description.markdown"
				},
				"4": {
					"name": "punctuation.definition.link.description.end.markdown"
				},
				"5": {
					"name": "punctuation.definition.constant.markdown"
				},
				"6": {
					"name": "constant.other.reference.link.markdown"
				},
				"7": {
					"name": "punctuation.definition.constant.markdown"
				}
			},
			"match": "(\\!\\[)((?<square>[^\\[\\]\\\\]|\\\\.|\\[\\g<square>*+\\])*+)(\\])[ ]?(\\[)(.*?)(\\])",
			"name": "meta.image.reference.markdown"
		},
		"italic": {
			"begin": "(?x) (?<open>(\\*(?=\\w)|(?<!\\w)\\*|(?<!\\w)\\b_))(?=\\S)                # Open\n  (?=\n    (\n      <[^>]*+>              # HTML tags\n      | (?<raw>`+)([^`]|(?!(?<!`)\\k<raw>(?!`))`)*+\\k<raw>\n                        # Raw\n      | \\\\[\\\\`*_{}\\[\\]()#.!+\\->]?+      # Escapes\n      | \\[\n      (\n          (?<square>          # Named group\n            [^\\[\\]\\\\]        # Match most chars\n            | \\\\.            # Escaped chars\n            | \\[ \\g<square>*+ \\]    # Nested brackets\n          )*+\n        \\]\n        (\n          (              # Reference Link\n            [ ]?          # Optional space\n            \\[[^\\]]*+\\]        # Ref name\n          )\n          | (              # Inline Link\n            \\(            # Opening paren\n              [ \\t]*+        # Optional whtiespace\n              <?(.*?)>?      # URL\n              [ \\t]*+        # Optional whtiespace\n              (          # Optional Title\n                (?<title>['\"])\n                (.*?)\n                \\k<title>\n              )?\n            \\)\n          )\n        )\n      )\n      | \\k<open>\\k<open>                   # Must be bold closer\n      | (?!(?<=\\S)\\k<open>).            # Everything besides\n                        # style closer\n    )++\n    (?<=\\S)(?=_\\b|\\*)\\k<open>                # Close\n  )\n",
			"captures": {
				"1": {
					"name": "punctuation.definition.italic.markdown"
				}
			},
			"end": "(?<=\\S)(\\1)((?!\\1)|(?=\\1\\1))",
			"name": "markup.italic.markdown",
			"patterns": [
				{
					"applyEndPatternLast": 1,
					"begin": "(?=<[^>]*?>)",
					"end": "(?<=>)",
					"patterns": [
						{
							"include": "text.html.derivative"
						}
					]
				},
				{
					"include": "#escape"
				},
				{
					"include": "#ampersand"
				},
				{
					"include": "#bracket"
				},
				{
					"include": "#raw"
				},
				{
					"include": "#bold"
				},
				{
					"include": "#image-inline"
				},
				{
					"include": "#link-inline"
				},
				{
					"include": "#link-inet"
				},
				{
					"include": "#link-email"
				},
				{
					"include": "#image-ref"
				},
				{
					"include": "#link-ref-literal"
				},
				{
					"include": "#link-ref"
				},
				{
					"include": "#link-ref-shortcut"
				},
				{
					"include": "#strikethrough"
				}
			]
		},
		"link-email": {
			"captures": {
				"1": {
					"name": "punctuation.definition.link.markdown"
				},
				"2": {
					"name": "markup.underline.link.markdown"
				},
				"4": {
					"name": "punctuation.definition.link.markdown"
				}
			},
			"match": "(<)((?:mailto:)?[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*)(>)",
			"name": "meta.link.email.lt-gt.markdown"
		},
		"link-inet": {
			"captures": {
				"1": {
					"name": "punctuation.definition.link.markdown"
				},
				"2": {
					"name": "markup.underline.link.markdown"
				},
				"3": {
					"name": "punctuation.definition.link.markdown"
				}
			},
			"match": "(<)((?:https?|ftp)://.*?)(>)",
			"name": "meta.link.inet.markdown"
		},
		"link-inline": {
			"captures": {
				"1": {
					"name": "punctuation.definition.link.title.begin.markdown"
				},
				"2": {
					"name": "string.other.link.title.markdown",
					"patterns": [
						{
							"include": "#raw"
						},
						{
							"include": "#bold"
						},
						{
							"include": "#italic"
						},
						{
							"include": "#strikethrough"
						},
						{
							"include": "#image-inline"
						}
					]
				},
				"4": {
					"name": "punctuation.definition.link.title.end.markdown"
				},
				"5": {
					"name": "punctuation.definition.metadata.markdown"
				},
				"7": {
					"name": "punctuation.definition.link.markdown"
				},
				"8": {
					"name": "markup.underline.link.markdown"
				},
				"9": {
					"name": "punctuation.definition.link.markdown"
				},
				"10": {
					"name": "markup.underline.link.markdown"
				},
				"12": {
					"name": "string.other.link.description.title.markdown"
				},
				"13": {
					"name": "punctuation.definition.string.begin.markdown"
				},
				"14": {
					"name": "punctuation.definition.string.end.markdown"
				},
				"15": {
					"name": "string.other.link.description.title.markdown"
				},
				"16": {
					"name": "punctuation.definition.string.begin.markdown"
				},
				"17": {
					"name": "punctuation.definition.string.end.markdown"
				},
				"18": {
					"name": "string.other.link.description.title.markdown"
				},
				"19": {
					"name": "punctuation.definition.string.begin.markdown"
				},
				"20": {
					"name": "punctuation.definition.string.end.markdown"
				},
				"21": {
					"name": "punctuation.definition.metadata.markdown"
				}
			},
			"match": "(?x)\n  (\\[)((?<square>[^\\[\\]\\\\]|\\\\.|\\[\\g<square>*+\\])*+)(\\])\n                # Match the link text.\n  (\\()            # Opening paren for url\n    # The url\n      [ \\t]*\n      (\n         (<)((?:\\\\[<>]|[^<>\\n])*)(>)\n         | ((?<url>(?>[^\\s()]+)|\\(\\g<url>*\\))*)\n      )\n      [ \\t]*\n    # The title  \n    (?:\n        ((\\()[^()]*(\\)))    # Match title in parens…\n      | ((\")[^\"]*(\"))    # or in double quotes…\n      | ((')[^']*('))    # or in single quotes.\n    )?            # Title is optional\n    \\s*            # Optional whitespace\n  (\\))\n",
			"name": "meta.link.inline.markdown"
		},
		"link-ref": {
			"captures": {
				"1": {
					"name": "punctuation.definition.link.title.begin.markdown"
				},
				"2": {
					"name": "string.other.link.title.markdown",
					"patterns": [
						{
							"include": "#raw"
						},
						{
							"include": "#bold"
						},
						{
							"include": "#italic"
						},
						{
							"include": "#strikethrough"
						},
						{
							"include": "#image-inline"
						}
					]
				},
				"4": {
					"name": "punctuation.definition.link.title.end.markdown"
				},
				"5": {
					"name": "punctuation.definition.constant.begin.markdown"
				},
				"6": {
					"name": "constant.other.reference.link.markdown"
				},
				"7": {
					"name": "punctuation.definition.constant.end.markdown"
				}
			},
			"match": "(?<![\\]\\\\])(\\[)((?<square>[^\\[\\]\\\\]|\\\\.|\\[\\g<square>*+\\])*+)(\\])(\\[)([^\\]]*+)(\\])",
			"name": "meta.link.reference.markdown"
		},
		"link-ref-literal": {
			"captures": {
				"1": {
					"name": "punctuation.definition.link.title.begin.markdown"
				},
				"2": {
					"name": "string.other.link.title.markdown"
				},
				"4": {
					"name": "punctuation.definition.link.title.end.markdown"
				},
				"5": {
					"name": "punctuation.definition.constant.begin.markdown"
				},
				"6": {
					"name": "punctuation.definition.constant.end.markdown"
				}
			},
			"match": "(?<![\\]\\\\])(\\[)((?<square>[^\\[\\]\\\\]|\\\\.|\\[\\g<square>*+\\])*+)(\\])[ ]?(\\[)(\\])",
			"name": "meta.link.reference.literal.markdown"
		},
		"link-ref-shortcut": {
			"captures": {
				"1": {
					"name": "punctuation.definition.link.title.begin.markdown"
				},
				"2": {
					"name": "string.other.link.title.markdown"
				},
				"3": {
					"name": "punctuation.definition.link.title.end.markdown"
				}
			},
			"match": "(?<![\\]\\\\])(\\[)((?:[^\\s\\[\\]\\\\]|\\\\[\\[\\]])+?)((?<!\\\\)\\])",
			"name": "meta.link.reference.markdown"
		},
		"raw": {
			"captures": {
				"1": {
					"name": "punctuation.definition.raw.markdown"
				},
				"3": {
					"name": "punctuation.definition.raw.markdown"
				}
			},
			"match": "(`+)((?:[^`]|(?!(?<!`)\\1(?!`))`)*+)(\\1)",
			"name": "markup.inline.raw.string.markdown"
		},
		"strikethrough": {
			"captures": {
				"1": {
					"name": "punctuation.definition.strikethrough.markdown"
				},
				"2": {
					"patterns": [
						{
							"applyEndPatternLast": 1,
							"begin": "(?=<[^>]*?>)",
							"end": "(?<=>)",
							"patterns": [
								{
									"include": "text.html.derivative"
								}
							]
						},
						{
							"include": "#escape"
						},
						{
							"include": "#ampersand"
						},
						{
							"include": "#bracket"
						},
						{
							"include": "#raw"
						},
						{
							"include": "#bold"
						},
						{
							"include": "#italic"
						},
						{
							"include": "#image-inline"
						},
						{
							"include": "#link-inline"
						},
						{
							"include": "#link-inet"
						},
						{
							"include": "#link-email"
						},
						{
							"include": "#image-ref"
						},
						{
							"include": "#link-ref-literal"
						},
						{
							"include": "#link-ref"
						},
						{
							"include": "#link-ref-shortcut"
						}
					]
				},
				"3": {
					"name": "punctuation.definition.strikethrough.markdown"
				}
			},
			"match": "(?<!\\\\)(~{2,})(?!(?<=\\w~~)_)((?:[^~]|(?!(?<![~\\\\])\\1(?!~))~)*+)(\\1)(?!(?<=_\\1)\\w)",
			"name": "markup.strikethrough.markdown"
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/.gitignore]---
Location: vscode-main/extensions/markdown-language-features/.gitignore

```text
notebook-out
media/*.js
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/.npmrc]---
Location: vscode-main/extensions/markdown-language-features/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/.vscodeignore]---
Location: vscode-main/extensions/markdown-language-features/.vscodeignore

```text
test/**
test-workspace/**
src/**
notebook/**
tsconfig.json
tsconfig.*.json
out/test/**
out/**
extension.webpack.config.js
extension-browser.webpack.config.js
cgmanifest.json
package-lock.json
preview-src/**
webpack.config.js
esbuild-*
.gitignore
**/*.d.ts
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/esbuild-notebook.mjs]---
Location: vscode-main/extensions/markdown-language-features/esbuild-notebook.mjs

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import path from 'path';
import { run } from '../esbuild-webview-common.mjs';

const srcDir = path.join(import.meta.dirname, 'notebook');
const outDir = path.join(import.meta.dirname, 'notebook-out');

run({
	entryPoints: [
		path.join(srcDir, 'index.ts'),
	],
	srcDir,
	outdir: outDir,
}, process.argv);
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/esbuild-preview.mjs]---
Location: vscode-main/extensions/markdown-language-features/esbuild-preview.mjs

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import path from 'path';
import { run } from '../esbuild-webview-common.mjs';

const srcDir = path.join(import.meta.dirname, 'preview-src');
const outDir = path.join(import.meta.dirname, 'media');

run({
	entryPoints: [
		path.join(srcDir, 'index.ts'),
		path.join(srcDir, 'pre'),
	],
	srcDir,
	outdir: outDir,
}, process.argv);
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/markdown-language-features/extension-browser.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import CopyPlugin from 'copy-webpack-plugin';
import { browser, browserPlugins } from '../shared.webpack.config.mjs';

export default browser({
	context: import.meta.dirname,
	entry: {
		extension: './src/extension.browser.ts'
	},
	plugins: [
		...browserPlugins(import.meta.dirname), // add plugins, don't replace inherited
		new CopyPlugin({
			patterns: [
				{
					from: './node_modules/vscode-markdown-languageserver/dist/browser/workerMain.js',
					to: 'serverWorkerMain.js',
				}
			],
		}),
	],
}, {
	configFile: 'tsconfig.browser.json'
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/extension.webpack.config.js]---
Location: vscode-main/extensions/markdown-language-features/extension.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import CopyPlugin from 'copy-webpack-plugin';
import withDefaults, { nodePlugins } from '../shared.webpack.config.mjs';

export default withDefaults({
	context: import.meta.dirname,
	resolve: {
		mainFields: ['module', 'main']
	},
	entry: {
		extension: './src/extension.ts',
	},
	plugins: [
		...nodePlugins(import.meta.dirname), // add plugins, don't replace inherited
		new CopyPlugin({
			patterns: [
				{
					from: './node_modules/vscode-markdown-languageserver/dist/node/workerMain.js',
					to: 'serverWorkerMain.js',
				}
			],
		}),
	],
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/package-lock.json]---
Location: vscode-main/extensions/markdown-language-features/package-lock.json

```json
{
  "name": "markdown-language-features",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "markdown-language-features",
      "version": "1.0.0",
      "license": "MIT",
      "dependencies": {
        "@vscode/extension-telemetry": "^0.9.8",
        "dompurify": "^3.2.7",
        "highlight.js": "^11.8.0",
        "markdown-it": "^12.3.2",
        "markdown-it-front-matter": "^0.2.4",
        "morphdom": "^2.7.4",
        "picomatch": "^2.3.1",
        "punycode": "^2.3.1",
        "vscode-languageclient": "^8.0.2",
        "vscode-languageserver-textdocument": "^1.0.11",
        "vscode-markdown-languageserver": "^0.5.0-alpha.12",
        "vscode-uri": "^3.0.3"
      },
      "devDependencies": {
        "@types/dompurify": "^3.0.5",
        "@types/lodash.throttle": "^4.1.9",
        "@types/markdown-it": "12.2.3",
        "@types/node": "22.x",
        "@types/picomatch": "^2.3.0",
        "@types/vscode-notebook-renderer": "^1.60.0",
        "@types/vscode-webview": "^1.57.0",
        "@vscode/markdown-it-katex": "^1.1.1",
        "lodash.throttle": "^4.1.1",
        "vscode-languageserver-types": "^3.17.2",
        "vscode-markdown-languageservice": "^0.3.0-alpha.3"
      },
      "engines": {
        "vscode": "^1.70.0"
      }
    },
    "node_modules/@microsoft/1ds-core-js": {
      "version": "4.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/1ds-core-js/-/1ds-core-js-4.3.4.tgz",
      "integrity": "sha512-3gbDUQgAO8EoyQTNcAEkxpuPnioC0May13P1l1l0NKZ128L9Ts/sj8QsfwCRTjHz0HThlA+4FptcAJXNYUy3rg==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-core-js": "3.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      }
    },
    "node_modules/@microsoft/1ds-post-js": {
      "version": "4.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/1ds-post-js/-/1ds-post-js-4.3.4.tgz",
      "integrity": "sha512-nlKjWricDj0Tn68Dt0P8lX9a+X7LYrqJ6/iSfQwMfDhRIGLqW+wxx8gxS+iGWC/oc8zMQAeiZaemUpCwQcwpRQ==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/1ds-core-js": "4.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      }
    },
    "node_modules/@microsoft/applicationinsights-channel-js": {
      "version": "3.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-channel-js/-/applicationinsights-channel-js-3.3.4.tgz",
      "integrity": "sha512-Z4nrxYwGKP9iyrYtm7iPQXVOFy4FsEsX0nDKkAi96Qpgw+vEh6NH4ORxMMuES0EollBQ3faJyvYCwckuCVIj0g==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-common": "3.3.4",
        "@microsoft/applicationinsights-core-js": "3.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      },
      "peerDependencies": {
        "tslib": ">= 1.0.0"
      }
    },
    "node_modules/@microsoft/applicationinsights-common": {
      "version": "3.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-common/-/applicationinsights-common-3.3.4.tgz",
      "integrity": "sha512-4ms16MlIvcP4WiUPqopifNxcWCcrXQJ2ADAK/75uok2mNQe6ZNRsqb/P+pvhUxc8A5HRlvoXPP1ptDSN5Girgw==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-core-js": "3.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      },
      "peerDependencies": {
        "tslib": ">= 1.0.0"
      }
    },
    "node_modules/@microsoft/applicationinsights-core-js": {
      "version": "3.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-core-js/-/applicationinsights-core-js-3.3.4.tgz",
      "integrity": "sha512-MummANF0mgKIkdvVvfmHQTBliK114IZLRhTL0X0Ep+zjDwWMHqYZgew0nlFKAl6ggu42abPZFK5afpE7qjtYJA==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      },
      "peerDependencies": {
        "tslib": ">= 1.0.0"
      }
    },
    "node_modules/@microsoft/applicationinsights-shims": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-shims/-/applicationinsights-shims-3.0.1.tgz",
      "integrity": "sha512-DKwboF47H1nb33rSUfjqI6ryX29v+2QWcTrRvcQDA32AZr5Ilkr7whOOSsD1aBzwqX0RJEIP1Z81jfE3NBm/Lg==",
      "license": "MIT",
      "dependencies": {
        "@nevware21/ts-utils": ">= 0.9.4 < 2.x"
      }
    },
    "node_modules/@microsoft/applicationinsights-web-basic": {
      "version": "3.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-web-basic/-/applicationinsights-web-basic-3.3.4.tgz",
      "integrity": "sha512-OpEPXr8vU/t/M8T9jvWJzJx/pCyygIiR1nGM/2PTde0wn7anl71Gxl5fWol7K/WwFEORNjkL3CEyWOyDc+28AA==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-channel-js": "3.3.4",
        "@microsoft/applicationinsights-common": "3.3.4",
        "@microsoft/applicationinsights-core-js": "3.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      },
      "peerDependencies": {
        "tslib": ">= 1.0.0"
      }
    },
    "node_modules/@microsoft/dynamicproto-js": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/@microsoft/dynamicproto-js/-/dynamicproto-js-2.0.3.tgz",
      "integrity": "sha512-JTWTU80rMy3mdxOjjpaiDQsTLZ6YSGGqsjURsY6AUQtIj0udlF/jYmhdLZu8693ZIC0T1IwYnFa0+QeiMnziBA==",
      "license": "MIT",
      "dependencies": {
        "@nevware21/ts-utils": ">= 0.10.4 < 2.x"
      }
    },
    "node_modules/@nevware21/ts-async": {
      "version": "0.5.4",
      "resolved": "https://registry.npmjs.org/@nevware21/ts-async/-/ts-async-0.5.4.tgz",
      "integrity": "sha512-IBTyj29GwGlxfzXw2NPnzty+w0Adx61Eze1/lknH/XIVdxtF9UnOpk76tnrHXWa6j84a1RR9hsOcHQPFv9qJjA==",
      "license": "MIT",
      "dependencies": {
        "@nevware21/ts-utils": ">= 0.11.6 < 2.x"
      }
    },
    "node_modules/@nevware21/ts-utils": {
      "version": "0.11.6",
      "resolved": "https://registry.npmjs.org/@nevware21/ts-utils/-/ts-utils-0.11.6.tgz",
      "integrity": "sha512-OUUJTh3fnaUSzg9DEHgv3d7jC+DnPL65mIO7RaR+jWve7+MmcgIvF79gY97DPQ4frH+IpNR78YAYd/dW4gK3kg==",
      "license": "MIT"
    },
    "node_modules/@types/dompurify": {
      "version": "3.0.5",
      "resolved": "https://registry.npmjs.org/@types/dompurify/-/dompurify-3.0.5.tgz",
      "integrity": "sha512-1Wg0g3BtQF7sSb27fJQAKck1HECM6zV1EB66j8JH9i3LCjYabJa0FSdiSgsD5K/RbrsR0SiraKacLB+T8ZVYAg==",
      "dev": true,
      "dependencies": {
        "@types/trusted-types": "*"
      }
    },
    "node_modules/@types/linkify-it": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/@types/linkify-it/-/linkify-it-5.0.0.tgz",
      "integrity": "sha512-sVDA58zAw4eWAffKOaQH5/5j3XeayukzDk+ewSsnv3p4yJEZHCCzMDiZM8e0OUrRvmpGZ85jf4yDHkHsgBNr9Q==",
      "dev": true
    },
    "node_modules/@types/lodash": {
      "version": "4.14.104",
      "resolved": "https://registry.npmjs.org/@types/lodash/-/lodash-4.14.104.tgz",
      "integrity": "sha512-ufQcVg4daO8xQ5kopxRHanqFdL4AI7ondQkV+2f+7mz3gvp0LkBx2zBRC6hfs3T87mzQFmf5Fck7Fi145Ul6NQ==",
      "dev": true
    },
    "node_modules/@types/lodash.throttle": {
      "version": "4.1.9",
      "resolved": "https://registry.npmjs.org/@types/lodash.throttle/-/lodash.throttle-4.1.9.tgz",
      "integrity": "sha512-PCPVfpfueguWZQB7pJQK890F2scYKoDUL3iM522AptHWn7d5NQmeS/LTEHIcLr5PaTzl3dK2Z0xSUHHTHwaL5g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/lodash": "*"
      }
    },
    "node_modules/@types/markdown-it": {
      "version": "12.2.3",
      "resolved": "https://registry.npmjs.org/@types/markdown-it/-/markdown-it-12.2.3.tgz",
      "integrity": "sha512-GKMHFfv3458yYy+v/N8gjufHO6MSZKCOXpZc5GXIWWy8uldwfmPn98vp81gZ5f9SVw8YYBctgfJ22a2d7AOMeQ==",
      "dev": true,
      "dependencies": {
        "@types/linkify-it": "*",
        "@types/mdurl": "*"
      }
    },
    "node_modules/@types/mdurl": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/@types/mdurl/-/mdurl-2.0.0.tgz",
      "integrity": "sha512-RGdgjQUZba5p6QEFAVx2OGb8rQDL/cPRG7GiedRzMcJ1tYnUANBncjbSB1NRGwbvjcPeikRABz2nshyPk1bhWg==",
      "dev": true
    },
    "node_modules/@types/node": {
      "version": "22.18.10",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.18.10.tgz",
      "integrity": "sha512-anNG/V/Efn/YZY4pRzbACnKxNKoBng2VTFydVu8RRs5hQjikP8CQfaeAV59VFSCzKNp90mXiVXW2QzV56rwMrg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.21.0"
      }
    },
    "node_modules/@types/picomatch": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/@types/picomatch/-/picomatch-2.3.0.tgz",
      "integrity": "sha512-O397rnSS9iQI4OirieAtsDqvCj4+3eY1J+EPdNTKuHuRWIfUoGyzX294o8C4KJYaLqgSrd2o60c5EqCU8Zv02g==",
      "dev": true
    },
    "node_modules/@types/trusted-types": {
      "version": "2.0.7",
      "resolved": "https://registry.npmjs.org/@types/trusted-types/-/trusted-types-2.0.7.tgz",
      "integrity": "sha512-ScaPdn1dQczgbl0QFTeTOmVHFULt394XJgOQNoyVhZ6r2vLnMLJfBPd53SB52T/3G36VI1/g2MZaX0cwDuXsfw==",
      "devOptional": true,
      "license": "MIT"
    },
    "node_modules/@types/vscode-notebook-renderer": {
      "version": "1.60.0",
      "resolved": "https://registry.npmjs.org/@types/vscode-notebook-renderer/-/vscode-notebook-renderer-1.60.0.tgz",
      "integrity": "sha512-u7TD2uuEZTVuitx0iijOJdKI0JLiQP6PsSBSRy2XmHXUOXcp5p1S56NrjOEDoF+PIHd3NL3eO6KTRSf5nukDqQ==",
      "dev": true
    },
    "node_modules/@types/vscode-webview": {
      "version": "1.57.0",
      "resolved": "https://registry.npmjs.org/@types/vscode-webview/-/vscode-webview-1.57.0.tgz",
      "integrity": "sha512-x3Cb/SMa1IwRHfSvKaZDZOTh4cNoG505c3NjTqGlMC082m++x/ETUmtYniDsw6SSmYzZXO8KBNhYxR0+VqymqA==",
      "dev": true
    },
    "node_modules/@vscode/extension-telemetry": {
      "version": "0.9.8",
      "resolved": "https://registry.npmjs.org/@vscode/extension-telemetry/-/extension-telemetry-0.9.8.tgz",
      "integrity": "sha512-7YcKoUvmHlIB8QYCE4FNzt3ErHi9gQPhdCM3ZWtpw1bxPT0I+lMdx52KHlzTNoJzQ2NvMX7HyzyDwBEiMgTrWQ==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/1ds-core-js": "^4.3.4",
        "@microsoft/1ds-post-js": "^4.3.4",
        "@microsoft/applicationinsights-web-basic": "^3.3.4"
      },
      "engines": {
        "vscode": "^1.75.0"
      }
    },
    "node_modules/@vscode/l10n": {
      "version": "0.0.11",
      "resolved": "https://registry.npmjs.org/@vscode/l10n/-/l10n-0.0.11.tgz",
      "integrity": "sha512-ukOMWnCg1tCvT7WnDfsUKQOFDQGsyR5tNgRpwmqi+5/vzU3ghdDXzvIM4IOPdSb3OeSsBNvmSL8nxIVOqi2WXA=="
    },
    "node_modules/@vscode/markdown-it-katex": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/@vscode/markdown-it-katex/-/markdown-it-katex-1.1.1.tgz",
      "integrity": "sha512-3KTlbsRBPJQLE2YmLL7K6nunTlU+W9T5+FjfNdWuIUKgxSS6HWLQHaO3L4MkJi7z7MpIPpY+g4N+cWNBPE/MSA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "katex": "^0.16.4"
      }
    },
    "node_modules/argparse": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/argparse/-/argparse-2.0.1.tgz",
      "integrity": "sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q=="
    },
    "node_modules/balanced-match": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.2.tgz",
      "integrity": "sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw=="
    },
    "node_modules/boolbase": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/boolbase/-/boolbase-1.0.0.tgz",
      "integrity": "sha512-JZOSA7Mo9sNGB8+UjSgzdLtokWAky1zbztM3WRLCbZ70/3cTANmQmOdR7y2g+J0e2WXywy1yS468tY+IruqEww==",
      "license": "ISC"
    },
    "node_modules/brace-expansion": {
      "version": "1.1.12",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.12.tgz",
      "integrity": "sha512-9T9UjW3r0UW5c1Q7GTwllptXwhvYmEzFhzMfZ9H7FQWt+uZePjZPjBP/W1ZEyZ1twGWom5/56TF4lPcqjnDHcg==",
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^1.0.0",
        "concat-map": "0.0.1"
      }
    },
    "node_modules/commander": {
      "version": "8.3.0",
      "resolved": "https://registry.npmjs.org/commander/-/commander-8.3.0.tgz",
      "integrity": "sha512-OkTL9umf+He2DZkUq8f8J9of7yL6RJKI24dVITBmNfZBmri9zYZQrKkuXiKhyfPSu8tUhnVBB1iKXevvnlR4Ww==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 12"
      }
    },
    "node_modules/concat-map": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz",
      "integrity": "sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg=="
    },
    "node_modules/css-select": {
      "version": "5.2.2",
      "resolved": "https://registry.npmjs.org/css-select/-/css-select-5.2.2.tgz",
      "integrity": "sha512-TizTzUddG/xYLA3NXodFM0fSbNizXjOKhqiQQwvhlspadZokn1KDy0NZFS0wuEubIYAV5/c1/lAr0TaaFXEXzw==",
      "license": "BSD-2-Clause",
      "dependencies": {
        "boolbase": "^1.0.0",
        "css-what": "^6.1.0",
        "domhandler": "^5.0.2",
        "domutils": "^3.0.1",
        "nth-check": "^2.0.1"
      },
      "funding": {
        "url": "https://github.com/sponsors/fb55"
      }
    },
    "node_modules/css-what": {
      "version": "6.2.2",
      "resolved": "https://registry.npmjs.org/css-what/-/css-what-6.2.2.tgz",
      "integrity": "sha512-u/O3vwbptzhMs3L1fQE82ZSLHQQfto5gyZzwteVIEyeaY5Fc7R4dapF/BvRoSYFeqfBk4m0V1Vafq5Pjv25wvA==",
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">= 6"
      },
      "funding": {
        "url": "https://github.com/sponsors/fb55"
      }
    },
    "node_modules/dom-serializer": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/dom-serializer/-/dom-serializer-2.0.0.tgz",
      "integrity": "sha512-wIkAryiqt/nV5EQKqQpo3SToSOV9J0DnbJqwK7Wv/Trc92zIAYZ4FlMu+JPFW1DfGFt81ZTCGgDEabffXeLyJg==",
      "license": "MIT",
      "dependencies": {
        "domelementtype": "^2.3.0",
        "domhandler": "^5.0.2",
        "entities": "^4.2.0"
      },
      "funding": {
        "url": "https://github.com/cheeriojs/dom-serializer?sponsor=1"
      }
    },
    "node_modules/domelementtype": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/domelementtype/-/domelementtype-2.3.0.tgz",
      "integrity": "sha512-OLETBj6w0OsagBwdXnPdN0cnMfF9opN69co+7ZrbfPGrdpPVNBUj02spi6B1N7wChLQiPn4CSH/zJvXw56gmHw==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/fb55"
        }
      ],
      "license": "BSD-2-Clause"
    },
    "node_modules/domhandler": {
      "version": "5.0.3",
      "resolved": "https://registry.npmjs.org/domhandler/-/domhandler-5.0.3.tgz",
      "integrity": "sha512-cgwlv/1iFQiFnU96XXgROh8xTeetsnJiDsTc7TYCLFd9+/WNkIqPTxiM/8pSd8VIrhXGTf1Ny1q1hquVqDJB5w==",
      "license": "BSD-2-Clause",
      "dependencies": {
        "domelementtype": "^2.3.0"
      },
      "engines": {
        "node": ">= 4"
      },
      "funding": {
        "url": "https://github.com/fb55/domhandler?sponsor=1"
      }
    },
    "node_modules/dompurify": {
      "version": "3.2.7",
      "resolved": "https://registry.npmjs.org/dompurify/-/dompurify-3.2.7.tgz",
      "integrity": "sha512-WhL/YuveyGXJaerVlMYGWhvQswa7myDG17P7Vu65EWC05o8vfeNbvNf4d/BOvH99+ZW+LlQsc1GDKMa1vNK6dw==",
      "license": "(MPL-2.0 OR Apache-2.0)",
      "optionalDependencies": {
        "@types/trusted-types": "^2.0.7"
      }
    },
    "node_modules/domutils": {
      "version": "3.2.2",
      "resolved": "https://registry.npmjs.org/domutils/-/domutils-3.2.2.tgz",
      "integrity": "sha512-6kZKyUajlDuqlHKVX1w7gyslj9MPIXzIFiz/rGu35uC1wMi+kMhQwGhl4lt9unC9Vb9INnY9Z3/ZA3+FhASLaw==",
      "license": "BSD-2-Clause",
      "dependencies": {
        "dom-serializer": "^2.0.0",
        "domelementtype": "^2.3.0",
        "domhandler": "^5.0.3"
      },
      "funding": {
        "url": "https://github.com/fb55/domutils?sponsor=1"
      }
    },
    "node_modules/entities": {
      "version": "4.5.0",
      "resolved": "https://registry.npmjs.org/entities/-/entities-4.5.0.tgz",
      "integrity": "sha512-V0hjH4dGPh9Ao5p0MoRY6BVqtwCjhz6vI5LT8AJ55H+4g9/4vbHx1I54fS0XuclLhDHArPQCiMjDxjaL8fPxhw==",
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=0.12"
      },
      "funding": {
        "url": "https://github.com/fb55/entities?sponsor=1"
      }
    },
    "node_modules/he": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/he/-/he-1.2.0.tgz",
      "integrity": "sha512-F/1DnUGPopORZi0ni+CvrCgHQ5FyEAHRLSApuYWMmrbSwoN2Mn/7k+Gl38gJnR7yyDZk6WLXwiGod1JOWNDKGw==",
      "license": "MIT",
      "bin": {
        "he": "bin/he"
      }
    },
    "node_modules/highlight.js": {
      "version": "11.8.0",
      "resolved": "https://registry.npmjs.org/highlight.js/-/highlight.js-11.8.0.tgz",
      "integrity": "sha512-MedQhoqVdr0U6SSnWPzfiadUcDHfN/Wzq25AkXiQv9oiOO/sG0S7XkvpFIqWBl9Yq1UYyYOOVORs5UW2XlPyzg==",
      "engines": {
        "node": ">=12.0.0"
      }
    },
    "node_modules/katex": {
      "version": "0.16.21",
      "resolved": "https://registry.npmjs.org/katex/-/katex-0.16.21.tgz",
      "integrity": "sha512-XvqR7FgOHtWupfMiigNzmh+MgUVmDGU2kXZm899ZkPfcuoPuFxyHmXsgATDpFZDAXCI8tvinaVcDo8PIIJSo4A==",
      "dev": true,
      "funding": [
        "https://opencollective.com/katex",
        "https://github.com/sponsors/katex"
      ],
      "license": "MIT",
      "dependencies": {
        "commander": "^8.3.0"
      },
      "bin": {
        "katex": "cli.js"
      }
    },
    "node_modules/linkify-it": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/linkify-it/-/linkify-it-3.0.3.tgz",
      "integrity": "sha512-ynTsyrFSdE5oZ/O9GEf00kPngmOfVwazR5GKDq6EYfhlpFug3J2zybX56a2PRRpc9P+FuSoGNAwjlbDs9jJBPQ==",
      "dependencies": {
        "uc.micro": "^1.0.1"
      }
    },
    "node_modules/lodash.throttle": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/lodash.throttle/-/lodash.throttle-4.1.1.tgz",
      "integrity": "sha1-wj6RtxAkKscMN/HhzaknTMOb8vQ= sha512-wIkUCfVKpVsWo3JSZlc+8MB5it+2AN5W8J7YVMST30UrvcQNZ1Okbj+rbVniijTWE6FGYy4XJq/rHkas8qJMLQ==",
      "dev": true
    },
    "node_modules/lru-cache": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-6.0.0.tgz",
      "integrity": "sha512-Jo6dJ04CmSjuznwJSS3pUeWmd/H0ffTlkXXgwZi+eq1UCmqQwCh+eLsYOYCwY991i2Fah4h1BEMCx4qThGbsiA==",
      "dependencies": {
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/markdown-it": {
      "version": "12.3.2",
      "resolved": "https://registry.npmjs.org/markdown-it/-/markdown-it-12.3.2.tgz",
      "integrity": "sha512-TchMembfxfNVpHkbtriWltGWc+m3xszaRD0CZup7GFFhzIgQqxIfn3eGj1yZpfuflzPvfkt611B2Q/Bsk1YnGg==",
      "dependencies": {
        "argparse": "^2.0.1",
        "entities": "~2.1.0",
        "linkify-it": "^3.0.1",
        "mdurl": "^1.0.1",
        "uc.micro": "^1.0.5"
      },
      "bin": {
        "markdown-it": "bin/markdown-it.js"
      }
    },
    "node_modules/markdown-it-front-matter": {
      "version": "0.2.4",
      "resolved": "https://registry.npmjs.org/markdown-it-front-matter/-/markdown-it-front-matter-0.2.4.tgz",
      "integrity": "sha512-25GUs0yjS2hLl8zAemVndeEzThB1p42yxuDEKbd4JlL3jiz+jsm6e56Ya8B0VREOkNxLYB4TTwaoPJ3ElMmW+w=="
    },
    "node_modules/markdown-it/node_modules/entities": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/entities/-/entities-2.1.0.tgz",
      "integrity": "sha512-hCx1oky9PFrJ611mf0ifBLBRW8lUUVRlFolb5gWRfIELabBlbp9xZvrqZLZAs+NxFnbfQoeGd8wDkygjg7U85w==",
      "funding": {
        "url": "https://github.com/fb55/entities?sponsor=1"
      }
    },
    "node_modules/mdurl": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/mdurl/-/mdurl-1.0.1.tgz",
      "integrity": "sha512-/sKlQJCBYVY9Ers9hqzKou4H6V5UWc/M59TH2dvkt+84itfnq7uFOMLpOiOS4ujvHP4etln18fmIxA5R5fll0g=="
    },
    "node_modules/minimatch": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.1.2.tgz",
      "integrity": "sha512-J7p63hRiAjw1NDEww1W7i37+ByIrOWO5XQQAzZ3VOcL0PNybwpfmV/N05zFAzwQ9USyEcX6t3UO+K5aqBQOIHw==",
      "dependencies": {
        "brace-expansion": "^1.1.7"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/morphdom": {
      "version": "2.7.4",
      "resolved": "https://registry.npmjs.org/morphdom/-/morphdom-2.7.4.tgz",
      "integrity": "sha512-ATTbWMgGa+FaMU3FhnFYB6WgulCqwf6opOll4CBzmVDTLvPMmUPrEv8CudmLPK0MESa64+6B89fWOxP3+YIlxQ==",
      "license": "MIT"
    },
    "node_modules/node-html-parser": {
      "version": "6.1.13",
      "resolved": "https://registry.npmjs.org/node-html-parser/-/node-html-parser-6.1.13.tgz",
      "integrity": "sha512-qIsTMOY4C/dAa5Q5vsobRpOOvPfC4pB61UVW2uSwZNUp0QU/jCekTal1vMmbO0DgdHeLUJpv/ARmDqErVxA3Sg==",
      "license": "MIT",
      "dependencies": {
        "css-select": "^5.1.0",
        "he": "1.2.0"
      }
    },
    "node_modules/nth-check": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/nth-check/-/nth-check-2.1.1.tgz",
      "integrity": "sha512-lqjrjmaOoAnWfMmBPL+XNnynZh2+swxiX3WUE0s4yEHI6m+AwrK2UZOimIRl3X/4QctVqS8AiZjFqyOGrMXb/w==",
      "license": "BSD-2-Clause",
      "dependencies": {
        "boolbase": "^1.0.0"
      },
      "funding": {
        "url": "https://github.com/fb55/nth-check?sponsor=1"
      }
    },
    "node_modules/picomatch": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.1.tgz",
      "integrity": "sha512-JU3teHTNjmE2VCGFzuY8EXzCDVwEqB2a8fsIvwaStHhAWJEeVd1o1QD80CU6+ZdEXXSLbSsuLwJjkCBWqRQUVA==",
      "engines": {
        "node": ">=8.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/punycode": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/punycode/-/punycode-2.3.1.tgz",
      "integrity": "sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/semver": {
      "version": "7.5.4",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.5.4.tgz",
      "integrity": "sha512-1bCSESV6Pv+i21Hvpxp3Dx+pSD8lIPt8uVjRrxAUt/nbswYc+tK6Y2btiULjd4+fnq15PX+nqQDC7Oft7WkwcA==",
      "dependencies": {
        "lru-cache": "^6.0.0"
      },
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/uc.micro": {
      "version": "1.0.6",
      "resolved": "https://registry.npmjs.org/uc.micro/-/uc.micro-1.0.6.tgz",
      "integrity": "sha512-8Y75pvTYkLJW2hWQHXxoqRgV7qb9B+9vFEtidML+7koHUFapnVJAZ6cKs+Qjz5Aw3aZWHMC6u0wJE3At+nSGwA=="
    },
    "node_modules/undici-types": {
      "version": "6.21.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",
      "integrity": "sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/vscode-jsonrpc": {
      "version": "8.0.2",
      "resolved": "https://registry.npmjs.org/vscode-jsonrpc/-/vscode-jsonrpc-8.0.2.tgz",
      "integrity": "sha512-RY7HwI/ydoC1Wwg4gJ3y6LpU9FJRZAUnTYMXthqhFXXu77ErDd/xkREpGuk4MyYkk4a+XDWAMqe0S3KkelYQEQ==",
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/vscode-languageclient": {
      "version": "8.0.2",
      "resolved": "https://registry.npmjs.org/vscode-languageclient/-/vscode-languageclient-8.0.2.tgz",
      "integrity": "sha512-lHlthJtphG9gibGb/y72CKqQUxwPsMXijJVpHEC2bvbFqxmkj9LwQ3aGU9dwjBLqsX1S4KjShYppLvg1UJDF/Q==",
      "dependencies": {
        "minimatch": "^3.0.4",
        "semver": "^7.3.5",
        "vscode-languageserver-protocol": "3.17.2"
      },
      "engines": {
        "vscode": "^1.67.0"
      }
    },
    "node_modules/vscode-languageserver": {
      "version": "8.1.0",
      "resolved": "https://registry.npmjs.org/vscode-languageserver/-/vscode-languageserver-8.1.0.tgz",
      "integrity": "sha512-eUt8f1z2N2IEUDBsKaNapkz7jl5QpskN2Y0G01T/ItMxBxw1fJwvtySGB9QMecatne8jFIWJGWI61dWjyTLQsw==",
      "dependencies": {
        "vscode-languageserver-protocol": "3.17.3"
      },
      "bin": {
        "installServerIntoExtension": "bin/installServerIntoExtension"
      }
    },
    "node_modules/vscode-languageserver-protocol": {
      "version": "3.17.2",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-protocol/-/vscode-languageserver-protocol-3.17.2.tgz",
      "integrity": "sha512-8kYisQ3z/SQ2kyjlNeQxbkkTNmVFoQCqkmGrzLH6A9ecPlgTbp3wDTnUNqaUxYr4vlAcloxx8zwy7G5WdguYNg==",
      "dependencies": {
        "vscode-jsonrpc": "8.0.2",
        "vscode-languageserver-types": "3.17.2"
      }
    },
    "node_modules/vscode-languageserver-textdocument": {
      "version": "1.0.11",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-textdocument/-/vscode-languageserver-textdocument-1.0.11.tgz",
      "integrity": "sha512-X+8T3GoiwTVlJbicx/sIAF+yuJAqz8VvwJyoMVhwEMoEKE/fkDmrqUgDMyBECcM2A2frVZIUj5HI/ErRXCfOeA=="
    },
    "node_modules/vscode-languageserver-types": {
      "version": "3.17.2",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-types/-/vscode-languageserver-types-3.17.2.tgz",
      "integrity": "sha512-zHhCWatviizPIq9B7Vh9uvrH6x3sK8itC84HkamnBWoDFJtzBf7SWlpLCZUit72b3os45h6RWQNC9xHRDF8dRA=="
    },
    "node_modules/vscode-languageserver/node_modules/vscode-jsonrpc": {
      "version": "8.1.0",
      "resolved": "https://registry.npmjs.org/vscode-jsonrpc/-/vscode-jsonrpc-8.1.0.tgz",
      "integrity": "sha512-6TDy/abTQk+zDGYazgbIPc+4JoXdwC8NHU9Pbn4UJP1fehUyZmM4RHp5IthX7A6L5KS30PRui+j+tbbMMMafdw==",
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/vscode-languageserver/node_modules/vscode-languageserver-protocol": {
      "version": "3.17.3",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-protocol/-/vscode-languageserver-protocol-3.17.3.tgz",
      "integrity": "sha512-924/h0AqsMtA5yK22GgMtCYiMdCOtWTSGgUOkgEDX+wk2b0x4sAfLiO4NxBxqbiVtz7K7/1/RgVrVI0NClZwqA==",
      "dependencies": {
        "vscode-jsonrpc": "8.1.0",
        "vscode-languageserver-types": "3.17.3"
      }
    },
    "node_modules/vscode-languageserver/node_modules/vscode-languageserver-types": {
      "version": "3.17.3",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-types/-/vscode-languageserver-types-3.17.3.tgz",
      "integrity": "sha512-SYU4z1dL0PyIMd4Vj8YOqFvHu7Hz/enbWtpfnVbJHU4Nd1YNYx8u0ennumc6h48GQNeOLxmwySmnADouT/AuZA=="
    },
    "node_modules/vscode-markdown-languageserver": {
      "version": "0.5.0-alpha.12",
      "resolved": "https://registry.npmjs.org/vscode-markdown-languageserver/-/vscode-markdown-languageserver-0.5.0-alpha.12.tgz",
      "integrity": "sha512-cDRJKwWPZBHrrwufTHrhuZqGgBEGJcYo29Iwhvgh2BgTnIB+fp6Vs62LlqNUu25qsDjmZLLkIEQxntcX4kbfUQ==",
      "license": "MIT",
      "dependencies": {
        "@vscode/l10n": "^0.0.11",
        "vscode-languageserver": "^8.1.0",
        "vscode-languageserver-textdocument": "^1.0.8",
        "vscode-languageserver-types": "^3.17.3",
        "vscode-markdown-languageservice": "^0.5.0-alpha.11",
        "vscode-uri": "^3.0.7"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/vscode-markdown-languageserver/node_modules/vscode-languageserver-types": {
      "version": "3.17.5",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-types/-/vscode-languageserver-types-3.17.5.tgz",
      "integrity": "sha512-Ld1VelNuX9pdF39h2Hgaeb5hEZM2Z3jUrrMgWQAu82jMtZp7p3vJT3BzToKtZI7NgQssZje5o0zryOrhQvzQAg=="
    },
    "node_modules/vscode-markdown-languageserver/node_modules/vscode-markdown-languageservice": {
      "version": "0.5.0-alpha.11",
      "resolved": "https://registry.npmjs.org/vscode-markdown-languageservice/-/vscode-markdown-languageservice-0.5.0-alpha.11.tgz",
      "integrity": "sha512-P1uBMAD5iylgpcweWCU1kQwk8SZngktnljXsZk1vFPorXv1mrEI7BkBpOUU0fhVssKgvFlCNLkI7KmwZLC7pdA==",
      "license": "MIT",
      "dependencies": {
        "@vscode/l10n": "^0.0.10",
        "node-html-parser": "^6.1.5",
        "picomatch": "^2.3.1",
        "vscode-languageserver-protocol": "^3.17.1",
        "vscode-languageserver-textdocument": "^1.0.11",
        "vscode-uri": "^3.0.7"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/vscode-markdown-languageserver/node_modules/vscode-markdown-languageservice/node_modules/@vscode/l10n": {
      "version": "0.0.10",
      "resolved": "https://registry.npmjs.org/@vscode/l10n/-/l10n-0.0.10.tgz",
      "integrity": "sha512-E1OCmDcDWa0Ya7vtSjp/XfHFGqYJfh+YPC1RkATU71fTac+j1JjCcB3qwSzmlKAighx2WxhLlfhS0RwAN++PFQ==",
      "license": "MIT"
    },
    "node_modules/vscode-markdown-languageservice": {
      "version": "0.3.0-alpha.3",
      "resolved": "https://registry.npmjs.org/vscode-markdown-languageservice/-/vscode-markdown-languageservice-0.3.0-alpha.3.tgz",
      "integrity": "sha512-KPjIuCkSqabkzci7TnlLKep5FYIC45tS7UC5H8zoOii7aoKJru5mZBDXJt86bM3XTgnfpW7rUYqhNnvXbbCBbw==",
      "dev": true,
      "dependencies": {
        "@vscode/l10n": "^0.0.10",
        "picomatch": "^2.3.1",
        "vscode-languageserver-textdocument": "^1.0.5",
        "vscode-languageserver-types": "^3.17.1",
        "vscode-uri": "^3.0.3"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/vscode-markdown-languageservice/node_modules/@vscode/l10n": {
      "version": "0.0.10",
      "resolved": "https://registry.npmjs.org/@vscode/l10n/-/l10n-0.0.10.tgz",
      "integrity": "sha512-E1OCmDcDWa0Ya7vtSjp/XfHFGqYJfh+YPC1RkATU71fTac+j1JjCcB3qwSzmlKAighx2WxhLlfhS0RwAN++PFQ==",
      "dev": true
    },
    "node_modules/vscode-uri": {
      "version": "3.0.8",
      "resolved": "https://registry.npmjs.org/vscode-uri/-/vscode-uri-3.0.8.tgz",
      "integrity": "sha512-AyFQ0EVmsOZOlAnxoFOGOq1SQDWAB7C6aqMGS23svWAllfOaxbuFvcT8D1i8z3Gyn8fraVeZNNmN6e9bxxXkKw=="
    },
    "node_modules/yallist": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-4.0.0.tgz",
      "integrity": "sha512-3wdGidZyq5PB084XLES5TpOSRA3wjXAlIWMhum2kRcv/41Sn2emQ0dycQW4uZXLejwKvg6EsvbdlVL+FYEct7A=="
    }
  }
}
```

--------------------------------------------------------------------------------

````
