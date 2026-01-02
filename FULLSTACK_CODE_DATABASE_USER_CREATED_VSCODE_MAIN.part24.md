---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:25Z
part: 24
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 24 of 552)

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

---[FILE: extensions/clojure/language-configuration.json]---
Location: vscode-main/extensions/clojure/language-configuration.json

```json
{
	"comments": {
		"lineComment": ";;"
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
		{ "open": "\"", "close": "\"", "notIn": ["string"] }
	],
	"surroundingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["\"", "\""]
	],
	"folding": {
		"offSide": true
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/clojure/package.json]---
Location: vscode-main/extensions/clojure/package.json

```json
{
  "name": "clojure",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin atom/language-clojure grammars/clojure.cson ./syntaxes/clojure.tmLanguage.json"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "clojure",
        "aliases": [
          "Clojure",
          "clojure"
        ],
        "extensions": [
          ".clj",
          ".cljs",
          ".cljc",
          ".cljx",
          ".clojure",
          ".edn"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "clojure",
        "scopeName": "source.clojure",
        "path": "./syntaxes/clojure.tmLanguage.json"
      }
    ],
    "configurationDefaults": {
      "[clojure]": {
        "diffEditor.ignoreTrimWhitespace": false
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

---[FILE: extensions/clojure/package.nls.json]---
Location: vscode-main/extensions/clojure/package.nls.json

```json
{
	"displayName": "Clojure Language Basics",
	"description": "Provides syntax highlighting and bracket matching in Clojure files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/clojure/syntaxes/clojure.tmLanguage.json]---
Location: vscode-main/extensions/clojure/syntaxes/clojure.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/atom/language-clojure/blob/master/grammars/clojure.cson",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/atom/language-clojure/commit/45bdb881501d0b8f8b707ca1d3fcc8b4b99fca03",
	"name": "Clojure",
	"scopeName": "source.clojure",
	"patterns": [
		{
			"include": "#comment"
		},
		{
			"include": "#shebang-comment"
		},
		{
			"include": "#quoted-sexp"
		},
		{
			"include": "#sexp"
		},
		{
			"include": "#keyfn"
		},
		{
			"include": "#string"
		},
		{
			"include": "#vector"
		},
		{
			"include": "#set"
		},
		{
			"include": "#map"
		},
		{
			"include": "#regexp"
		},
		{
			"include": "#var"
		},
		{
			"include": "#constants"
		},
		{
			"include": "#dynamic-variables"
		},
		{
			"include": "#metadata"
		},
		{
			"include": "#namespace-symbol"
		},
		{
			"include": "#symbol"
		}
	],
	"repository": {
		"comment": {
			"begin": "(?<!\\\\);",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.comment.clojure"
				}
			},
			"end": "$",
			"name": "comment.line.semicolon.clojure"
		},
		"constants": {
			"patterns": [
				{
					"match": "(nil)(?=(\\s|\\)|\\]|\\}))",
					"name": "constant.language.nil.clojure"
				},
				{
					"match": "(true|false)",
					"name": "constant.language.boolean.clojure"
				},
				{
					"match": "(##(?:Inf|-Inf|NaN))",
					"name": "constant.numeric.symbol.clojure"
				},
				{
					"match": "([-+]?\\d+/\\d+)",
					"name": "constant.numeric.ratio.clojure"
				},
				{
					"match": "([-+]?(?:(?:3[0-6])|(?:[12]\\d)|[2-9])[rR][0-9A-Za-z]+N?)",
					"name": "constant.numeric.arbitrary-radix.clojure"
				},
				{
					"match": "([-+]?0[xX][0-9a-fA-F]+N?)",
					"name": "constant.numeric.hexadecimal.clojure"
				},
				{
					"match": "([-+]?0[0-7]+N?)",
					"name": "constant.numeric.octal.clojure"
				},
				{
					"match": "([-+]?[0-9]+(?:(\\.|(?=[eEM]))[0-9]*([eE][-+]?[0-9]+)?)M?)",
					"name": "constant.numeric.double.clojure"
				},
				{
					"match": "([-+]?\\d+N?)",
					"name": "constant.numeric.long.clojure"
				},
				{
					"include": "#keyword"
				}
			]
		},
		"keyword": {
			"match": "(?<=(\\s|\\(|\\[|\\{)):[\\w\\#\\.\\-\\_\\:\\+\\=\\>\\<\\/\\!\\?\\*]+(?=(\\s|\\)|\\]|\\}|\\,))",
			"name": "constant.keyword.clojure"
		},
		"keyfn": {
			"patterns": [
				{
					"match": "(?<=(\\s|\\(|\\[|\\{))(if(-[-\\p{Ll}\\?]*)?|when(-[-\\p{Ll}]*)?|for(-[-\\p{Ll}]*)?|cond|do|let(-[-\\p{Ll}\\?]*)?|binding|loop|recur|fn|throw[\\p{Ll}\\-]*|try|catch|finally|([\\p{Ll}]*case))(?=(\\s|\\)|\\]|\\}))",
					"name": "storage.control.clojure"
				},
				{
					"match": "(?<=(\\s|\\(|\\[|\\{))(declare-?|(in-)?ns|import|use|require|load|compile|(def[\\p{Ll}\\-]*))(?=(\\s|\\)|\\]|\\}))",
					"name": "keyword.control.clojure"
				}
			]
		},
		"dynamic-variables": {
			"match": "\\*[\\w\\.\\-\\_\\:\\+\\=\\>\\<\\!\\?\\d]+\\*",
			"name": "meta.symbol.dynamic.clojure"
		},
		"map": {
			"begin": "(\\{)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.section.map.begin.clojure"
				}
			},
			"end": "(\\}(?=[\\}\\]\\)\\s]*(?:;|$)))|(\\})",
			"endCaptures": {
				"1": {
					"name": "punctuation.section.map.end.trailing.clojure"
				},
				"2": {
					"name": "punctuation.section.map.end.clojure"
				}
			},
			"name": "meta.map.clojure",
			"patterns": [
				{
					"include": "$self"
				}
			]
		},
		"metadata": {
			"patterns": [
				{
					"begin": "(\\^\\{)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.section.metadata.map.begin.clojure"
						}
					},
					"end": "(\\}(?=[\\}\\]\\)\\s]*(?:;|$)))|(\\})",
					"endCaptures": {
						"1": {
							"name": "punctuation.section.metadata.map.end.trailing.clojure"
						},
						"2": {
							"name": "punctuation.section.metadata.map.end.clojure"
						}
					},
					"name": "meta.metadata.map.clojure",
					"patterns": [
						{
							"include": "$self"
						}
					]
				},
				{
					"begin": "(\\^)",
					"end": "(\\s)",
					"name": "meta.metadata.simple.clojure",
					"patterns": [
						{
							"include": "#keyword"
						},
						{
							"include": "$self"
						}
					]
				}
			]
		},
		"quoted-sexp": {
			"begin": "(['``]\\()",
			"beginCaptures": {
				"1": {
					"name": "punctuation.section.expression.begin.clojure"
				}
			},
			"end": "(\\))$|(\\)(?=[\\}\\]\\)\\s]*(?:;|$)))|(\\))",
			"endCaptures": {
				"1": {
					"name": "punctuation.section.expression.end.trailing.clojure"
				},
				"2": {
					"name": "punctuation.section.expression.end.trailing.clojure"
				},
				"3": {
					"name": "punctuation.section.expression.end.clojure"
				}
			},
			"name": "meta.quoted-expression.clojure",
			"patterns": [
				{
					"include": "$self"
				}
			]
		},
		"regexp": {
			"begin": "#\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.regexp.begin.clojure"
				}
			},
			"end": "\"",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.regexp.end.clojure"
				}
			},
			"name": "string.regexp.clojure",
			"patterns": [
				{
					"include": "#regexp_escaped_char"
				}
			]
		},
		"regexp_escaped_char": {
			"match": "\\\\.",
			"name": "constant.character.escape.clojure"
		},
		"set": {
			"begin": "(\\#\\{)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.section.set.begin.clojure"
				}
			},
			"end": "(\\}(?=[\\}\\]\\)\\s]*(?:;|$)))|(\\})",
			"endCaptures": {
				"1": {
					"name": "punctuation.section.set.end.trailing.clojure"
				},
				"2": {
					"name": "punctuation.section.set.end.clojure"
				}
			},
			"name": "meta.set.clojure",
			"patterns": [
				{
					"include": "$self"
				}
			]
		},
		"sexp": {
			"begin": "(\\()",
			"beginCaptures": {
				"1": {
					"name": "punctuation.section.expression.begin.clojure"
				}
			},
			"end": "(\\))$|(\\)(?=[\\}\\]\\)\\s]*(?:;|$)))|(\\))",
			"endCaptures": {
				"1": {
					"name": "punctuation.section.expression.end.trailing.clojure"
				},
				"2": {
					"name": "punctuation.section.expression.end.trailing.clojure"
				},
				"3": {
					"name": "punctuation.section.expression.end.clojure"
				}
			},
			"name": "meta.expression.clojure",
			"patterns": [
				{
					"begin": "(?<=\\()(ns|declare|def[\\w\\d._:+=><!?*-]*|[\\w._:+=><!?*-][\\w\\d._:+=><!?*-]*/def[\\w\\d._:+=><!?*-]*)\\s+",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.clojure"
						}
					},
					"end": "(?=\\))",
					"name": "meta.definition.global.clojure",
					"patterns": [
						{
							"include": "#metadata"
						},
						{
							"include": "#dynamic-variables"
						},
						{
							"match": "([\\p{L}\\.\\-\\_\\+\\=\\>\\<\\!\\?\\*][\\w\\.\\-\\_\\:\\+\\=\\>\\<\\!\\?\\*\\d]*)",
							"name": "entity.global.clojure"
						},
						{
							"include": "$self"
						}
					]
				},
				{
					"include": "#keyfn"
				},
				{
					"include": "#constants"
				},
				{
					"include": "#vector"
				},
				{
					"include": "#map"
				},
				{
					"include": "#set"
				},
				{
					"include": "#sexp"
				},
				{
					"match": "(?<=\\()(.+?)(?=\\s|\\))",
					"captures": {
						"1": {
							"name": "entity.name.function.clojure"
						}
					},
					"patterns": [
						{
							"include": "$self"
						}
					]
				},
				{
					"include": "$self"
				}
			]
		},
		"shebang-comment": {
			"begin": "^(#!)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.comment.shebang.clojure"
				}
			},
			"end": "$",
			"name": "comment.line.shebang.clojure"
		},
		"string": {
			"begin": "(?<!\\\\)(\")",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.string.begin.clojure"
				}
			},
			"end": "(\")",
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.clojure"
				}
			},
			"name": "string.quoted.double.clojure",
			"patterns": [
				{
					"match": "\\\\.",
					"name": "constant.character.escape.clojure"
				}
			]
		},
		"namespace-symbol": {
			"patterns": [
				{
					"match": "([\\p{L}\\.\\-\\_\\+\\=\\>\\<\\!\\?\\*][\\w\\.\\-\\_\\:\\+\\=\\>\\<\\!\\?\\*\\d]*)/",
					"captures": {
						"1": {
							"name": "meta.symbol.namespace.clojure"
						}
					}
				}
			]
		},
		"symbol": {
			"patterns": [
				{
					"match": "([\\p{L}\\.\\-\\_\\+\\=\\>\\<\\!\\?\\*][\\w\\.\\-\\_\\:\\+\\=\\>\\<\\!\\?\\*\\d]*)",
					"name": "meta.symbol.clojure"
				}
			]
		},
		"var": {
			"match": "(?<=(\\s|\\(|\\[|\\{)\\#)'[\\w\\.\\-\\_\\:\\+\\=\\>\\<\\/\\!\\?\\*]+(?=(\\s|\\)|\\]|\\}))",
			"name": "meta.var.clojure"
		},
		"vector": {
			"begin": "(\\[)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.section.vector.begin.clojure"
				}
			},
			"end": "(\\](?=[\\}\\]\\)\\s]*(?:;|$)))|(\\])",
			"endCaptures": {
				"1": {
					"name": "punctuation.section.vector.end.trailing.clojure"
				},
				"2": {
					"name": "punctuation.section.vector.end.clojure"
				}
			},
			"name": "meta.vector.clojure",
			"patterns": [
				{
					"include": "$self"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/coffeescript/.vscodeignore]---
Location: vscode-main/extensions/coffeescript/.vscodeignore

```text
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/coffeescript/cgmanifest.json]---
Location: vscode-main/extensions/coffeescript/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "atom/language-coffee-script",
					"repositoryUrl": "https://github.com/atom/language-coffee-script",
					"commitHash": "0f6db9143663e18b1ad00667820f46747dba495e"
				}
			},
			"license": "MIT",
			"description": "The file syntaxes/coffeescript.tmLanguage.json was derived from the Atom package https://github.com/atom/language-coffee-script which was originally converted from the TextMate bundle https://github.com/jashkenas/coffee-script-tmbundle.",
			"version": "0.49.3"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/coffeescript/language-configuration.json]---
Location: vscode-main/extensions/coffeescript/language-configuration.json

```json
{
	"comments": {
		"lineComment": "#",
		"blockComment": [ "###", "###" ]
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
		{ "open": "\"", "close": "\"", "notIn": ["string"] },
		{ "open": "'", "close": "'", "notIn": ["string"] }
	],
	"surroundingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["\"", "\""],
		["'", "'"],
		[" ", " "]
	],
	"folding": {
		"offSide": true,
		"markers": {
			"start": "^\\s*#region\\b",
			"end": "^\\s*#endregion\\b"
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/coffeescript/package.json]---
Location: vscode-main/extensions/coffeescript/package.json

```json
{
  "name": "coffeescript",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin atom/language-coffee-script grammars/coffeescript.cson ./syntaxes/coffeescript.tmLanguage.json"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "coffeescript",
        "extensions": [
          ".coffee",
          ".cson",
          ".iced"
        ],
        "aliases": [
          "CoffeeScript",
          "coffeescript",
          "coffee"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "coffeescript",
        "scopeName": "source.coffee",
        "path": "./syntaxes/coffeescript.tmLanguage.json"
      }
    ],
    "breakpoints": [
      {
        "language": "coffeescript"
      }
    ],
    "snippets": [
      {
        "language": "coffeescript",
        "path": "./snippets/coffeescript.code-snippets"
      }
    ],
    "configurationDefaults": {
      "[coffeescript]": {
        "diffEditor.ignoreTrimWhitespace": false,
        "editor.defaultColorDecorators": "never"
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

---[FILE: extensions/coffeescript/package.nls.json]---
Location: vscode-main/extensions/coffeescript/package.nls.json

```json
{
	"displayName": "CoffeeScript Language Basics",
	"description": "Provides snippets, syntax highlighting, bracket matching and folding in CoffeeScript files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/coffeescript/snippets/coffeescript.code-snippets]---
Location: vscode-main/extensions/coffeescript/snippets/coffeescript.code-snippets

```text
{
	"Region Start": {
		"prefix": "#region",
		"body": [
			"#region"
		],
		"description": "Folding Region Start"
	},
	"Region End": {
		"prefix": "#endregion",
		"body": [
			"#endregion"
		],
		"description": "Folding Region End"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/coffeescript/syntaxes/coffeescript.tmLanguage.json]---
Location: vscode-main/extensions/coffeescript/syntaxes/coffeescript.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/atom/language-coffee-script/blob/master/grammars/coffeescript.cson",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/atom/language-coffee-script/commit/0f6db9143663e18b1ad00667820f46747dba495e",
	"name": "CoffeeScript",
	"scopeName": "source.coffee",
	"patterns": [
		{
			"include": "#jsx"
		},
		{
			"match": "(new)\\s+(?:(?:(class)\\s+(\\w+(?:\\.\\w*)*)?)|(\\w+(?:\\.\\w*)*))",
			"name": "meta.class.instance.constructor.coffee",
			"captures": {
				"1": {
					"name": "keyword.operator.new.coffee"
				},
				"2": {
					"name": "storage.type.class.coffee"
				},
				"3": {
					"name": "entity.name.type.instance.coffee"
				},
				"4": {
					"name": "entity.name.type.instance.coffee"
				}
			}
		},
		{
			"begin": "'''",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.coffee"
				}
			},
			"end": "'''",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.coffee"
				}
			},
			"name": "string.quoted.single.heredoc.coffee",
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.escape.backslash.coffee"
						}
					},
					"match": "(\\\\).",
					"name": "constant.character.escape.backslash.coffee"
				}
			]
		},
		{
			"begin": "\"\"\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.coffee"
				}
			},
			"end": "\"\"\"",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.coffee"
				}
			},
			"name": "string.quoted.double.heredoc.coffee",
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.escape.backslash.coffee"
						}
					},
					"match": "(\\\\).",
					"name": "constant.character.escape.backslash.coffee"
				},
				{
					"include": "#interpolated_coffee"
				}
			]
		},
		{
			"match": "(`)(.*)(`)",
			"name": "string.quoted.script.coffee",
			"captures": {
				"1": {
					"name": "punctuation.definition.string.begin.coffee"
				},
				"2": {
					"name": "source.js.embedded.coffee",
					"patterns": [
						{
							"include": "source.js"
						}
					]
				},
				"3": {
					"name": "punctuation.definition.string.end.coffee"
				}
			}
		},
		{
			"begin": "(?<!#)###(?!#)",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.comment.coffee"
				}
			},
			"end": "###",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.comment.coffee"
				}
			},
			"name": "comment.block.coffee",
			"patterns": [
				{
					"match": "(?<=^|\\s)@\\w*(?=\\s)",
					"name": "storage.type.annotation.coffee"
				}
			]
		},
		{
			"begin": "#",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.comment.coffee"
				}
			},
			"end": "$",
			"name": "comment.line.number-sign.coffee"
		},
		{
			"begin": "///",
			"end": "(///)[gimuy]*",
			"name": "string.regexp.multiline.coffee",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.coffee"
				}
			},
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.coffee"
				}
			},
			"patterns": [
				{
					"include": "#heregexp"
				}
			]
		},
		{
			"begin": "(?<![\\w$])(/)(?=(?![/*+?])(.+)(/)[gimuy]*(?!\\s*[\\w$/(]))",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.string.begin.coffee"
				}
			},
			"end": "(/)[gimuy]*(?!\\s*[\\w$/(])",
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.coffee"
				}
			},
			"name": "string.regexp.coffee",
			"patterns": [
				{
					"include": "source.js.regexp"
				}
			]
		},
		{
			"match": "\\b(?<![\\.\\$])(break|by|catch|continue|else|finally|for|in|of|if|return|switch|then|throw|try|unless|when|while|until|loop|do|export|import|default|from|as|yield|async|await|(?<=for)\\s+own)(?!\\s*:)\\b",
			"name": "keyword.control.coffee"
		},
		{
			"match": "\\b(?<![\\.\\$])(delete|instanceof|new|typeof)(?!\\s*:)\\b",
			"name": "keyword.operator.$1.coffee"
		},
		{
			"match": "\\b(?<![\\.\\$])(case|function|var|void|with|const|let|enum|native|__hasProp|__extends|__slice|__bind|__indexOf|implements|interface|package|private|protected|public|static)(?!\\s*:)\\b",
			"name": "keyword.reserved.coffee"
		},
		{
			"begin": "(?x)\n(?<=\\s|^)((@)?[a-zA-Z_$][\\w$]*)\n\\s*([:=])\\s*\n(?=(\\([^\\(\\)]*\\)\\s*)?[=-]>)",
			"beginCaptures": {
				"1": {
					"name": "entity.name.function.coffee"
				},
				"2": {
					"name": "variable.other.readwrite.instance.coffee"
				},
				"3": {
					"name": "keyword.operator.assignment.coffee"
				}
			},
			"end": "[=-]>",
			"endCaptures": {
				"0": {
					"name": "storage.type.function.coffee"
				}
			},
			"name": "meta.function.coffee",
			"patterns": [
				{
					"include": "#function_params"
				}
			]
		},
		{
			"begin": "(?x)\n(?<=\\s|^)(?:((')([^']*?)('))|((\")([^\"]*?)(\")))\n\\s*([:=])\\s*\n(?=(\\([^\\(\\)]*\\)\\s*)?[=-]>)",
			"beginCaptures": {
				"1": {
					"name": "string.quoted.single.coffee"
				},
				"2": {
					"name": "punctuation.definition.string.begin.coffee"
				},
				"3": {
					"name": "entity.name.function.coffee"
				},
				"4": {
					"name": "punctuation.definition.string.end.coffee"
				},
				"5": {
					"name": "string.quoted.double.coffee"
				},
				"6": {
					"name": "punctuation.definition.string.begin.coffee"
				},
				"7": {
					"name": "entity.name.function.coffee"
				},
				"8": {
					"name": "punctuation.definition.string.end.coffee"
				},
				"9": {
					"name": "keyword.operator.assignment.coffee"
				}
			},
			"end": "[=-]>",
			"endCaptures": {
				"0": {
					"name": "storage.type.function.coffee"
				}
			},
			"name": "meta.function.coffee",
			"patterns": [
				{
					"include": "#function_params"
				}
			]
		},
		{
			"begin": "(?=(\\([^\\(\\)]*\\)\\s*)?[=-]>)",
			"end": "[=-]>",
			"endCaptures": {
				"0": {
					"name": "storage.type.function.coffee"
				}
			},
			"name": "meta.function.inline.coffee",
			"patterns": [
				{
					"include": "#function_params"
				}
			]
		},
		{
			"begin": "(?<=\\s|^)({)(?=[^'\"#]+?}[\\s\\]}]*=)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.destructuring.begin.bracket.curly.coffee"
				}
			},
			"end": "}",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.destructuring.end.bracket.curly.coffee"
				}
			},
			"name": "meta.variable.assignment.destructured.object.coffee",
			"patterns": [
				{
					"include": "$self"
				},
				{
					"match": "[a-zA-Z$_]\\w*",
					"name": "variable.assignment.coffee"
				}
			]
		},
		{
			"begin": "(?<=\\s|^)(\\[)(?=[^'\"#]+?\\][\\s\\]}]*=)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.destructuring.begin.bracket.square.coffee"
				}
			},
			"end": "\\]",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.destructuring.end.bracket.square.coffee"
				}
			},
			"name": "meta.variable.assignment.destructured.array.coffee",
			"patterns": [
				{
					"include": "$self"
				},
				{
					"match": "[a-zA-Z$_]\\w*",
					"name": "variable.assignment.coffee"
				}
			]
		},
		{
			"match": "\\b(?<!\\.|::)(true|on|yes)(?!\\s*[:=][^=])\\b",
			"name": "constant.language.boolean.true.coffee"
		},
		{
			"match": "\\b(?<!\\.|::)(false|off|no)(?!\\s*[:=][^=])\\b",
			"name": "constant.language.boolean.false.coffee"
		},
		{
			"match": "\\b(?<!\\.|::)null(?!\\s*[:=][^=])\\b",
			"name": "constant.language.null.coffee"
		},
		{
			"match": "\\b(?<!\\.|::)extends(?!\\s*[:=])\\b",
			"name": "variable.language.coffee"
		},
		{
			"match": "(?<!\\.)\\b(?<!\\$)(super|this|arguments)(?!\\s*[:=][^=]|\\$)\\b",
			"name": "variable.language.$1.coffee"
		},
		{
			"captures": {
				"1": {
					"name": "storage.type.class.coffee"
				},
				"2": {
					"name": "keyword.control.inheritance.coffee"
				},
				"3": {
					"name": "entity.other.inherited-class.coffee"
				}
			},
			"match": "(?<=\\s|^|\\[|\\()(class)\\s+(extends)\\s+(@?[a-zA-Z\\$\\._][\\w\\.]*)",
			"name": "meta.class.coffee"
		},
		{
			"captures": {
				"1": {
					"name": "storage.type.class.coffee"
				},
				"2": {
					"name": "entity.name.type.class.coffee"
				},
				"3": {
					"name": "keyword.control.inheritance.coffee"
				},
				"4": {
					"name": "entity.other.inherited-class.coffee"
				}
			},
			"match": "(?<=\\s|^|\\[|\\()(class\\b)\\s+(@?[a-zA-Z\\$_][\\w\\.]*)?(?:\\s+(extends)\\s+(@?[a-zA-Z\\$\\._][\\w\\.]*))?",
			"name": "meta.class.coffee"
		},
		{
			"match": "\\b(debugger|\\\\)\\b",
			"name": "keyword.other.coffee"
		},
		{
			"match": "\\b(Array|ArrayBuffer|Blob|Boolean|Date|document|Function|Int(8|16|32|64)Array|Math|Map|Number|Object|Proxy|RegExp|Set|String|WeakMap|window|Uint(8|16|32|64)Array|XMLHttpRequest)\\b",
			"name": "support.class.coffee"
		},
		{
			"match": "\\b(console)\\b",
			"name": "entity.name.type.object.coffee"
		},
		{
			"match": "((?<=console\\.)(debug|warn|info|log|error|time|timeEnd|assert))\\b",
			"name": "support.function.console.coffee"
		},
		{
			"match": "((?<=\\.)(apply|call|concat|every|filter|forEach|from|hasOwnProperty|indexOf|isPrototypeOf|join|lastIndexOf|map|of|pop|propertyIsEnumerable|push|reduce(Right)?|reverse|shift|slice|some|sort|splice|to(Locale)?String|unshift|valueOf))\\b",
			"name": "support.function.method.array.coffee"
		},
		{
			"match": "((?<=Array\\.)(isArray))\\b",
			"name": "support.function.static.array.coffee"
		},
		{
			"match": "((?<=Object\\.)(create|definePropert(ies|y)|freeze|getOwnProperty(Descriptors?|Names)|getProperty(Descriptor|Names)|getPrototypeOf|is(Extensible|Frozen|Sealed)?|isnt|keys|preventExtensions|seal))\\b",
			"name": "support.function.static.object.coffee"
		},
		{
			"match": "((?<=Math\\.)(abs|acos|acosh|asin|asinh|atan|atan2|atanh|ceil|cos|cosh|exp|expm1|floor|hypot|log|log10|log1p|log2|max|min|pow|random|round|sign|sin|sinh|sqrt|tan|tanh|trunc))\\b",
			"name": "support.function.static.math.coffee"
		},
		{
			"match": "((?<=Number\\.)(is(Finite|Integer|NaN)|toInteger))\\b",
			"name": "support.function.static.number.coffee"
		},
		{
			"match": "(?<!\\.)\\b(module|exports|__filename|__dirname|global|process)(?!\\s*:)\\b",
			"name": "support.variable.coffee"
		},
		{
			"match": "\\b(Infinity|NaN|undefined)\\b",
			"name": "constant.language.coffee"
		},
		{
			"include": "#operators"
		},
		{
			"include": "#method_calls"
		},
		{
			"include": "#function_calls"
		},
		{
			"include": "#numbers"
		},
		{
			"include": "#objects"
		},
		{
			"include": "#properties"
		},
		{
			"match": "::",
			"name": "keyword.operator.prototype.coffee"
		},
		{
			"match": "(?<!\\$)\\b[0-9]+[\\w$]*",
			"name": "invalid.illegal.identifier.coffee"
		},
		{
			"match": ";",
			"name": "punctuation.terminator.statement.coffee"
		},
		{
			"match": ",",
			"name": "punctuation.separator.delimiter.coffee"
		},
		{
			"begin": "{",
			"beginCaptures": {
				"0": {
					"name": "meta.brace.curly.coffee"
				}
			},
			"end": "}",
			"endCaptures": {
				"0": {
					"name": "meta.brace.curly.coffee"
				}
			},
			"patterns": [
				{
					"include": "$self"
				}
			]
		},
		{
			"begin": "\\[",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.array.begin.bracket.square.coffee"
				}
			},
			"end": "\\]",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.array.end.bracket.square.coffee"
				}
			},
			"patterns": [
				{
					"match": "(?<!\\.)\\.{3}",
					"name": "keyword.operator.slice.exclusive.coffee"
				},
				{
					"match": "(?<!\\.)\\.{2}",
					"name": "keyword.operator.slice.inclusive.coffee"
				},
				{
					"include": "$self"
				}
			]
		},
		{
			"begin": "\\(",
			"beginCaptures": {
				"0": {
					"name": "meta.brace.round.coffee"
				}
			},
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "meta.brace.round.coffee"
				}
			},
			"patterns": [
				{
					"include": "$self"
				}
			]
		},
		{
			"include": "#instance_variable"
		},
		{
			"include": "#single_quoted_string"
		},
		{
			"include": "#double_quoted_string"
		}
	],
	"repository": {
		"arguments": {
			"patterns": [
				{
					"begin": "\\(",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.arguments.begin.bracket.round.coffee"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.arguments.end.bracket.round.coffee"
						}
					},
					"name": "meta.arguments.coffee",
					"patterns": [
						{
							"include": "$self"
						}
					]
				},
				{
					"begin": "(?=(@|@?[\\w$]+|[=-]>|\\-\\d|\\[|{|\"|'))",
					"end": "(?=\\s*(?<![\\w$])(of|in|then|is|isnt|and|or|for|else|when|if|unless|by|instanceof)(?![\\w$]))|(?=\\s*(}|\\]|\\)|#|$))",
					"name": "meta.arguments.coffee",
					"patterns": [
						{
							"include": "$self"
						}
					]
				}
			]
		},
		"double_quoted_string": {
			"patterns": [
				{
					"begin": "\"",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.coffee"
						}
					},
					"end": "\"",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.coffee"
						}
					},
					"name": "string.quoted.double.coffee",
					"patterns": [
						{
							"captures": {
								"1": {
									"name": "punctuation.definition.escape.backslash.coffee"
								}
							},
							"match": "(\\\\)(x[0-9A-Fa-f]{2}|[0-2][0-7]{0,2}|3[0-6][0-7]|37[0-7]?|[4-7][0-7]?|.)",
							"name": "constant.character.escape.backslash.coffee"
						},
						{
							"include": "#interpolated_coffee"
						}
					]
				}
			]
		},
		"function_calls": {
			"patterns": [
				{
					"begin": "(@)?([\\w$]+)(?=\\()",
					"beginCaptures": {
						"1": {
							"name": "variable.other.readwrite.instance.coffee"
						},
						"2": {
							"patterns": [
								{
									"include": "#function_names"
								}
							]
						}
					},
					"end": "(?<=\\))",
					"name": "meta.function-call.coffee",
					"patterns": [
						{
							"include": "#arguments"
						}
					]
				},
				{
					"begin": "(?x)\n(@)?([\\w$]+)\n\\s*\n(?=\\s+(?!(?<![\\w$])(of|in|then|is|isnt|and|or|for|else|when|if|unless|by|instanceof)(?![\\w$]))(?=(@?[\\w$]+|[=-]>|\\-\\d|\\[|{|\"|')))",
					"beginCaptures": {
						"1": {
							"name": "variable.other.readwrite.instance.coffee"
						},
						"2": {
							"patterns": [
								{
									"include": "#function_names"
								}
							]
						}
					},
					"end": "(?=\\s*(?<![\\w$])(of|in|then|is|isnt|and|or|for|else|when|if|unless|by|instanceof)(?![\\w$]))|(?=\\s*(}|\\]|\\)|#|$))",
					"name": "meta.function-call.coffee",
					"patterns": [
						{
							"include": "#arguments"
						}
					]
				}
			]
		},
		"function_names": {
			"patterns": [
				{
					"match": "(?x)\n\\b(isNaN|isFinite|eval|uneval|parseInt|parseFloat|decodeURI|\ndecodeURIComponent|encodeURI|encodeURIComponent|escape|unescape|\nrequire|set(Interval|Timeout)|clear(Interval|Timeout))\\b",
					"name": "support.function.coffee"
				},
				{
					"match": "[a-zA-Z_$][\\w$]*",
					"name": "entity.name.function.coffee"
				},
				{
					"match": "\\d[\\w$]*",
					"name": "invalid.illegal.identifier.coffee"
				}
			]
		},
		"function_params": {
			"patterns": [
				{
					"begin": "\\(",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.parameters.begin.bracket.round.coffee"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.parameters.end.bracket.round.coffee"
						}
					},
					"name": "meta.parameters.coffee",
					"patterns": [
						{
							"match": "([a-zA-Z_$][\\w$]*)(\\.\\.\\.)?",
							"captures": {
								"1": {
									"name": "variable.parameter.function.coffee"
								},
								"2": {
									"name": "keyword.operator.splat.coffee"
								}
							}
						},
						{
							"match": "(@(?:[a-zA-Z_$][\\w$]*)?)(\\.\\.\\.)?",
							"captures": {
								"1": {
									"name": "variable.parameter.function.readwrite.instance.coffee"
								},
								"2": {
									"name": "keyword.operator.splat.coffee"
								}
							}
						},
						{
							"include": "$self"
						}
					]
				}
			]
		},
		"embedded_comment": {
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.comment.coffee"
						}
					},
					"match": "(?<!\\\\)(#).*$\\n?",
					"name": "comment.line.number-sign.coffee"
				}
			]
		},
		"instance_variable": {
			"patterns": [
				{
					"match": "(@)([a-zA-Z_\\$]\\w*)?",
					"name": "variable.other.readwrite.instance.coffee"
				}
			]
		},
		"interpolated_coffee": {
			"patterns": [
				{
					"begin": "\\#\\{",
					"captures": {
						"0": {
							"name": "punctuation.section.embedded.coffee"
						}
					},
					"end": "\\}",
					"name": "source.coffee.embedded.source",
					"patterns": [
						{
							"include": "$self"
						}
					]
				}
			]
		},
		"method_calls": {
			"patterns": [
				{
					"begin": "(?:(\\.)|(::))\\s*([\\w$]+)\\s*(?=\\()",
					"beginCaptures": {
						"1": {
							"name": "punctuation.separator.method.period.coffee"
						},
						"2": {
							"name": "keyword.operator.prototype.coffee"
						},
						"3": {
							"patterns": [
								{
									"include": "#method_names"
								}
							]
						}
					},
					"end": "(?<=\\))",
					"name": "meta.method-call.coffee",
					"patterns": [
						{
							"include": "#arguments"
						}
					]
				},
				{
					"begin": "(?:(\\.)|(::))\\s*([\\w$]+)\\s*(?=\\s+(?!(?<![\\w$])(of|in|then|is|isnt|and|or|for|else|when|if|unless|by|instanceof)(?![\\w$]))(?=(@|@?[\\w$]+|[=-]>|\\-\\d|\\[|{|\"|')))",
					"beginCaptures": {
						"1": {
							"name": "punctuation.separator.method.period.coffee"
						},
						"2": {
							"name": "keyword.operator.prototype.coffee"
						},
						"3": {
							"patterns": [
								{
									"include": "#method_names"
								}
							]
						}
					},
					"end": "(?=\\s*(?<![\\w$])(of|in|then|is|isnt|and|or|for|else|when|if|unless|by|instanceof)(?![\\w$]))|(?=\\s*(}|\\]|\\)|#|$))",
					"name": "meta.method-call.coffee",
					"patterns": [
						{
							"include": "#arguments"
						}
					]
				}
			]
		},
		"method_names": {
			"patterns": [
				{
					"match": "(?x)\n\\bon(Rowsinserted|Rowsdelete|Rowenter|Rowexit|Resize|Resizestart|Resizeend|Reset|\nReadystatechange|Mouseout|Mouseover|Mousedown|Mouseup|Mousemove|\nBefore(cut|deactivate|unload|update|paste|print|editfocus|activate)|\nBlur|Scrolltop|Submit|Select|Selectstart|Selectionchange|Hover|Help|\nChange|Contextmenu|Controlselect|Cut|Cellchange|Clock|Close|Deactivate|\nDatasetchanged|Datasetcomplete|Dataavailable|Drop|Drag|Dragstart|Dragover|\nDragdrop|Dragenter|Dragend|Dragleave|Dblclick|Unload|Paste|Propertychange|Error|\nErrorupdate|Keydown|Keyup|Keypress|Focus|Load|Activate|Afterupdate|Afterprint|Abort)\\b",
					"name": "support.function.event-handler.coffee"
				},
				{
					"match": "(?x)\n\\b(shift|showModelessDialog|showModalDialog|showHelp|scroll|scrollX|scrollByPages|\nscrollByLines|scrollY|scrollTo|stop|strike|sizeToContent|sidebar|signText|sort|\nsup|sub|substr|substring|splice|split|send|set(Milliseconds|Seconds|Minutes|Hours|\nMonth|Year|FullYear|Date|UTC(Milliseconds|Seconds|Minutes|Hours|Month|FullYear|Date)|\nTime|Hotkeys|Cursor|ZOptions|Active|Resizable|RequestHeader)|search|slice|\nsavePreferences|small|home|handleEvent|navigate|char|charCodeAt|charAt|concat|\ncontextual|confirm|compile|clear|captureEvents|call|createStyleSheet|createPopup|\ncreateEventObject|to(GMTString|UTCString|String|Source|UpperCase|LowerCase|LocaleString)|\ntest|taint|taintEnabled|indexOf|italics|disableExternalCapture|dump|detachEvent|unshift|\nuntaint|unwatch|updateCommands|join|javaEnabled|pop|push|plugins.refresh|paddings|parse|\nprint|prompt|preference|enableExternalCapture|exec|execScript|valueOf|UTC|find|file|\nfileModifiedDate|fileSize|fileCreatedDate|fileUpdatedDate|fixed|fontsize|fontcolor|\nforward|fromCharCode|watch|link|load|lastIndexOf|anchor|attachEvent|atob|apply|alert|\nabort|routeEvents|resize|resizeBy|resizeTo|recalc|returnValue|replace|reverse|reload|\nreleaseCapture|releaseEvents|go|get(Milliseconds|Seconds|Minutes|Hours|Month|Day|Year|FullYear|\nTime|Date|TimezoneOffset|UTC(Milliseconds|Seconds|Minutes|Hours|Day|Month|FullYear|Date)|\nAttention|Selection|ResponseHeader|AllResponseHeaders)|moveBy|moveBelow|moveTo|\nmoveToAbsolute|moveAbove|mergeAttributes|match|margins|btoa|big|bold|borderWidths|blink|back)\\b",
					"name": "support.function.coffee"
				},
				{
					"match": "(?x)\n\\b(acceptNode|add|addEventListener|addTextTrack|adoptNode|after|animate|append|\nappendChild|appendData|before|blur|canPlayType|captureStream|\ncaretPositionFromPoint|caretRangeFromPoint|checkValidity|clear|click|\ncloneContents|cloneNode|cloneRange|close|closest|collapse|\ncompareBoundaryPoints|compareDocumentPosition|comparePoint|contains|\nconvertPointFromNode|convertQuadFromNode|convertRectFromNode|createAttribute|\ncreateAttributeNS|createCaption|createCDATASection|createComment|\ncreateContextualFragment|createDocument|createDocumentFragment|\ncreateDocumentType|createElement|createElementNS|createEntityReference|\ncreateEvent|createExpression|createHTMLDocument|createNodeIterator|\ncreateNSResolver|createProcessingInstruction|createRange|createShadowRoot|\ncreateTBody|createTextNode|createTFoot|createTHead|createTreeWalker|delete|\ndeleteCaption|deleteCell|deleteContents|deleteData|deleteRow|deleteTFoot|\ndeleteTHead|detach|disconnect|dispatchEvent|elementFromPoint|elementsFromPoint|\nenableStyleSheetsForSet|entries|evaluate|execCommand|exitFullscreen|\nexitPointerLock|expand|extractContents|fastSeek|firstChild|focus|forEach|get|\ngetAll|getAnimations|getAttribute|getAttributeNames|getAttributeNode|\ngetAttributeNodeNS|getAttributeNS|getBoundingClientRect|getBoxQuads|\ngetClientRects|getContext|getDestinationInsertionPoints|getElementById|\ngetElementsByClassName|getElementsByName|getElementsByTagName|\ngetElementsByTagNameNS|getItem|getNamedItem|getSelection|getStartDate|\ngetVideoPlaybackQuality|has|hasAttribute|hasAttributeNS|hasAttributes|\nhasChildNodes|hasFeature|hasFocus|importNode|initEvent|insertAdjacentElement|\ninsertAdjacentHTML|insertAdjacentText|insertBefore|insertCell|insertData|\ninsertNode|insertRow|intersectsNode|isDefaultNamespace|isEqualNode|\nisPointInRange|isSameNode|item|key|keys|lastChild|load|lookupNamespaceURI|\nlookupPrefix|matches|move|moveAttribute|moveAttributeNode|moveChild|\nmoveNamedItem|namedItem|nextNode|nextSibling|normalize|observe|open|\nparentNode|pause|play|postMessage|prepend|preventDefault|previousNode|\npreviousSibling|probablySupportsContext|queryCommandEnabled|\nqueryCommandIndeterm|queryCommandState|queryCommandSupported|queryCommandValue|\nquerySelector|querySelectorAll|registerContentHandler|registerElement|\nregisterProtocolHandler|releaseCapture|releaseEvents|remove|removeAttribute|\nremoveAttributeNode|removeAttributeNS|removeChild|removeEventListener|\nremoveItem|replace|replaceChild|replaceData|replaceWith|reportValidity|\nrequestFullscreen|requestPointerLock|reset|scroll|scrollBy|scrollIntoView|\nscrollTo|seekToNextFrame|select|selectNode|selectNodeContents|set|setAttribute|\nsetAttributeNode|setAttributeNodeNS|setAttributeNS|setCapture|\nsetCustomValidity|setEnd|setEndAfter|setEndBefore|setItem|setNamedItem|\nsetRangeText|setSelectionRange|setSinkId|setStart|setStartAfter|setStartBefore|\nslice|splitText|stepDown|stepUp|stopImmediatePropagation|stopPropagation|\nsubmit|substringData|supports|surroundContents|takeRecords|terminate|toBlob|\ntoDataURL|toggle|toString|values|write|writeln)\\b",
					"name": "support.function.dom.coffee"
				},
				{
					"match": "[a-zA-Z_$][\\w$]*",
					"name": "entity.name.function.coffee"
				},
				{
					"match": "\\d[\\w$]*",
					"name": "invalid.illegal.identifier.coffee"
				}
			]
		},
		"numbers": {
			"patterns": [
				{
					"match": "\\b(?<!\\$)0(x|X)[0-9a-fA-F]+\\b(?!\\$)",
					"name": "constant.numeric.hex.coffee"
				},
				{
					"match": "\\b(?<!\\$)0(b|B)[01]+\\b(?!\\$)",
					"name": "constant.numeric.binary.coffee"
				},
				{
					"match": "\\b(?<!\\$)0(o|O)?[0-7]+\\b(?!\\$)",
					"name": "constant.numeric.octal.coffee"
				},
				{
					"match": "(?x)\n(?<!\\$)(?:\n  (?:\\b[0-9]+(\\.)[0-9]+[eE][+-]?[0-9]+\\b)| # 1.1E+3\n  (?:\\b[0-9]+(\\.)[eE][+-]?[0-9]+\\b)|       # 1.E+3\n  (?:\\B(\\.)[0-9]+[eE][+-]?[0-9]+\\b)|       # .1E+3\n  (?:\\b[0-9]+[eE][+-]?[0-9]+\\b)|            # 1E+3\n  (?:\\b[0-9]+(\\.)[0-9]+\\b)|                # 1.1\n  (?:\\b[0-9]+(?=\\.{2,3}))|                  # 1 followed by a slice\n  (?:\\b[0-9]+(\\.)\\B)|                      # 1.\n  (?:\\B(\\.)[0-9]+\\b)|                      # .1\n  (?:\\b[0-9]+\\b(?!\\.))                     # 1\n)(?!\\$)",
					"captures": {
						"0": {
							"name": "constant.numeric.decimal.coffee"
						},
						"1": {
							"name": "punctuation.separator.decimal.period.coffee"
						},
						"2": {
							"name": "punctuation.separator.decimal.period.coffee"
						},
						"3": {
							"name": "punctuation.separator.decimal.period.coffee"
						},
						"4": {
							"name": "punctuation.separator.decimal.period.coffee"
						},
						"5": {
							"name": "punctuation.separator.decimal.period.coffee"
						},
						"6": {
							"name": "punctuation.separator.decimal.period.coffee"
						}
					}
				}
			]
		},
		"objects": {
			"patterns": [
				{
					"match": "[A-Z][A-Z0-9_$]*(?=\\s*\\??(\\.\\s*[a-zA-Z_$]\\w*|::))",
					"name": "constant.other.object.coffee"
				},
				{
					"match": "[a-zA-Z_$][\\w$]*(?=\\s*\\??(\\.\\s*[a-zA-Z_$]\\w*|::))",
					"name": "variable.other.object.coffee"
				}
			]
		},
		"operators": {
			"patterns": [
				{
					"match": "(?:([a-zA-Z$_][\\w$]*)?\\s+|(?<![\\w$]))(and=|or=)",
					"captures": {
						"1": {
							"name": "variable.assignment.coffee"
						},
						"2": {
							"name": "keyword.operator.assignment.compound.coffee"
						}
					}
				},
				{
					"match": "([a-zA-Z$_][\\w$]*)?\\s*(%=|\\+=|-=|\\*=|&&=|\\|\\|=|\\?=|(?<!\\()/=)",
					"captures": {
						"1": {
							"name": "variable.assignment.coffee"
						},
						"2": {
							"name": "keyword.operator.assignment.compound.coffee"
						}
					}
				},
				{
					"match": "([a-zA-Z$_][\\w$]*)?\\s*(&=|\\^=|<<=|>>=|>>>=|\\|=)",
					"captures": {
						"1": {
							"name": "variable.assignment.coffee"
						},
						"2": {
							"name": "keyword.operator.assignment.compound.bitwise.coffee"
						}
					}
				},
				{
					"match": "<<|>>>|>>",
					"name": "keyword.operator.bitwise.shift.coffee"
				},
				{
					"match": "!=|<=|>=|==|<|>",
					"name": "keyword.operator.comparison.coffee"
				},
				{
					"match": "&&|!|\\|\\|",
					"name": "keyword.operator.logical.coffee"
				},
				{
					"match": "&|\\||\\^|~",
					"name": "keyword.operator.bitwise.coffee"
				},
				{
					"match": "([a-zA-Z$_][\\w$]*)?\\s*(=|:(?!:))(?![>=])",
					"captures": {
						"1": {
							"name": "variable.assignment.coffee"
						},
						"2": {
							"name": "keyword.operator.assignment.coffee"
						}
					}
				},
				{
					"match": "--",
					"name": "keyword.operator.decrement.coffee"
				},
				{
					"match": "\\+\\+",
					"name": "keyword.operator.increment.coffee"
				},
				{
					"match": "\\.\\.\\.",
					"name": "keyword.operator.splat.coffee"
				},
				{
					"match": "\\?",
					"name": "keyword.operator.existential.coffee"
				},
				{
					"match": "%|\\*|/|-|\\+",
					"name": "keyword.operator.coffee"
				},
				{
					"match": "(?x)\n\\b(?<![\\.\\$])\n(?:\n  (and|or|not) # logical\n  |\n  (is|isnt) # comparison\n)\n(?!\\s*:)\\b",
					"captures": {
						"1": {
							"name": "keyword.operator.logical.coffee"
						},
						"2": {
							"name": "keyword.operator.comparison.coffee"
						}
					}
				}
			]
		},
		"properties": {
			"patterns": [
				{
					"match": "(?:(\\.)|(::))\\s*([A-Z][A-Z0-9_$]*\\b\\$*)(?=\\s*\\??(\\.\\s*[a-zA-Z_$]\\w*|::))",
					"captures": {
						"1": {
							"name": "punctuation.separator.property.period.coffee"
						},
						"2": {
							"name": "keyword.operator.prototype.coffee"
						},
						"3": {
							"name": "constant.other.object.property.coffee"
						}
					}
				},
				{
					"match": "(?:(\\.)|(::))\\s*(\\$*[a-zA-Z_$][\\w$]*)(?=\\s*\\??(\\.\\s*[a-zA-Z_$]\\w*|::))",
					"captures": {
						"1": {
							"name": "punctuation.separator.property.period.coffee"
						},
						"2": {
							"name": "keyword.operator.prototype.coffee"
						},
						"3": {
							"name": "variable.other.object.property.coffee"
						}
					}
				},
				{
					"match": "(?:(\\.)|(::))\\s*([A-Z][A-Z0-9_$]*\\b\\$*)",
					"captures": {
						"1": {
							"name": "punctuation.separator.property.period.coffee"
						},
						"2": {
							"name": "keyword.operator.prototype.coffee"
						},
						"3": {
							"name": "constant.other.property.coffee"
						}
					}
				},
				{
					"match": "(?:(\\.)|(::))\\s*(\\$*[a-zA-Z_$][\\w$]*)",
					"captures": {
						"1": {
							"name": "punctuation.separator.property.period.coffee"
						},
						"2": {
							"name": "keyword.operator.prototype.coffee"
						},
						"3": {
							"name": "variable.other.property.coffee"
						}
					}
				},
				{
					"match": "(?:(\\.)|(::))\\s*([0-9][\\w$]*)",
					"captures": {
						"1": {
							"name": "punctuation.separator.property.period.coffee"
						},
						"2": {
							"name": "keyword.operator.prototype.coffee"
						},
						"3": {
							"name": "invalid.illegal.identifier.coffee"
						}
					}
				}
			]
		},
		"single_quoted_string": {
			"patterns": [
				{
					"begin": "'",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.coffee"
						}
					},
					"end": "'",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.coffee"
						}
					},
					"name": "string.quoted.single.coffee",
					"patterns": [
						{
							"captures": {
								"1": {
									"name": "punctuation.definition.escape.backslash.coffee"
								}
							},
							"match": "(\\\\)(x[0-9A-Fa-f]{2}|[0-2][0-7]{0,2}|3[0-6][0-7]?|37[0-7]?|[4-7][0-7]?|.)",
							"name": "constant.character.escape.backslash.coffee"
						}
					]
				}
			]
		},
		"regex-character-class": {
			"patterns": [
				{
					"match": "\\\\[wWsSdD]|\\.",
					"name": "constant.character.character-class.regexp"
				},
				{
					"match": "\\\\([0-7]{3}|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4})",
					"name": "constant.character.numeric.regexp"
				},
				{
					"match": "\\\\c[A-Z]",
					"name": "constant.character.control.regexp"
				},
				{
					"match": "\\\\.",
					"name": "constant.character.escape.backslash.regexp"
				}
			]
		},
		"heregexp": {
			"patterns": [
				{
					"match": "\\\\[bB]|\\^|\\$",
					"name": "keyword.control.anchor.regexp"
				},
				{
					"match": "\\\\[1-9]\\d*",
					"name": "keyword.other.back-reference.regexp"
				},
				{
					"match": "[?+*]|\\{(\\d+,\\d+|\\d+,|,\\d+|\\d+)\\}\\??",
					"name": "keyword.operator.quantifier.regexp"
				},
				{
					"match": "\\|",
					"name": "keyword.operator.or.regexp"
				},
				{
					"begin": "(\\()((\\?=)|(\\?!))",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.group.regexp"
						},
						"3": {
							"name": "meta.assertion.look-ahead.regexp"
						},
						"4": {
							"name": "meta.assertion.negative-look-ahead.regexp"
						}
					},
					"end": "(\\))",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.group.regexp"
						}
					},
					"name": "meta.group.assertion.regexp",
					"patterns": [
						{
							"include": "#heregexp"
						}
					]
				},
				{
					"begin": "\\((\\?:)?",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.group.regexp"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.group.regexp"
						}
					},
					"name": "meta.group.regexp",
					"patterns": [
						{
							"include": "#heregexp"
						}
					]
				},
				{
					"begin": "(\\[)(\\^)?",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.character-class.regexp"
						},
						"2": {
							"name": "keyword.operator.negation.regexp"
						}
					},
					"end": "(\\])",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.character-class.regexp"
						}
					},
					"name": "constant.other.character-class.set.regexp",
					"patterns": [
						{
							"captures": {
								"1": {
									"name": "constant.character.numeric.regexp"
								},
								"2": {
									"name": "constant.character.control.regexp"
								},
								"3": {
									"name": "constant.character.escape.backslash.regexp"
								},
								"4": {
									"name": "constant.character.numeric.regexp"
								},
								"5": {
									"name": "constant.character.control.regexp"
								},
								"6": {
									"name": "constant.character.escape.backslash.regexp"
								}
							},
							"match": "(?:.|(\\\\(?:[0-7]{3}|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}))|(\\\\c[A-Z])|(\\\\.))\\-(?:[^\\]\\\\]|(\\\\(?:[0-7]{3}|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}))|(\\\\c[A-Z])|(\\\\.))",
							"name": "constant.other.character-class.range.regexp"
						},
						{
							"include": "#regex-character-class"
						}
					]
				},
				{
					"include": "#regex-character-class"
				},
				{
					"include": "#interpolated_coffee"
				},
				{
					"include": "#embedded_comment"
				}
			]
		},
		"jsx": {
			"patterns": [
				{
					"include": "#jsx-tag"
				},
				{
					"include": "#jsx-end-tag"
				}
			]
		},
		"jsx-expression": {
			"begin": "{",
			"beginCaptures": {
				"0": {
					"name": "meta.brace.curly.coffee"
				}
			},
			"end": "}",
			"endCaptures": {
				"0": {
					"name": "meta.brace.curly.coffee"
				}
			},
			"patterns": [
				{
					"include": "#double_quoted_string"
				},
				{
					"include": "$self"
				}
			]
		},
		"jsx-attribute": {
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "entity.other.attribute-name.coffee"
						},
						"2": {
							"name": "keyword.operator.assignment.coffee"
						}
					},
					"match": "(?:^|\\s+)([-\\w.]+)\\s*(=)"
				},
				{
					"include": "#double_quoted_string"
				},
				{
					"include": "#single_quoted_string"
				},
				{
					"include": "#jsx-expression"
				}
			]
		},
		"jsx-tag": {
			"patterns": [
				{
					"begin": "(<)([-\\w\\.]+)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.coffee"
						},
						"2": {
							"name": "entity.name.tag.coffee"
						}
					},
					"end": "(/?>)",
					"name": "meta.tag.coffee",
					"patterns": [
						{
							"include": "#jsx-attribute"
						}
					]
				}
			]
		},
		"jsx-end-tag": {
			"patterns": [
				{
					"begin": "(</)([-\\w\\.]+)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.coffee"
						},
						"2": {
							"name": "entity.name.tag.coffee"
						}
					},
					"end": "(/?>)",
					"name": "meta.tag.coffee"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/configuration-editing/.npmrc]---
Location: vscode-main/extensions/configuration-editing/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/configuration-editing/.vscodeignore]---
Location: vscode-main/extensions/configuration-editing/.vscodeignore

```text
test/**
src/**
tsconfig.json
out/**
extension.webpack.config.js
extension-browser.webpack.config.js
package-lock.json
build/**
schemas/devContainer.codespaces.schema.json
schemas/devContainer.vscode.schema.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/configuration-editing/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/configuration-editing/extension-browser.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import path from 'path';
import { browser as withBrowserDefaults } from '../shared.webpack.config.mjs';

export default withBrowserDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/configurationEditingMain.ts'
	},
	output: {
		filename: 'configurationEditingMain.js'
	},
	resolve: {
		alias: {
			'./node/net': path.resolve(import.meta.dirname, 'src', 'browser', 'net'),
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/configuration-editing/extension.webpack.config.js]---
Location: vscode-main/extensions/configuration-editing/extension.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import withDefaults from '../shared.webpack.config.mjs';

export default withDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/configurationEditingMain.ts',
	},
	output: {
		filename: 'configurationEditingMain.js'
	},
	resolve: {
		mainFields: ['module', 'main']
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/configuration-editing/package-lock.json]---
Location: vscode-main/extensions/configuration-editing/package-lock.json

```json
{
  "name": "configuration-editing",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "configuration-editing",
      "version": "1.0.0",
      "license": "MIT",
      "dependencies": {
        "@octokit/rest": "^21.1.1",
        "jsonc-parser": "^3.2.0",
        "tunnel": "^0.0.6"
      },
      "devDependencies": {
        "@types/node": "22.x"
      },
      "engines": {
        "vscode": "^1.0.0"
      }
    },
    "node_modules/@octokit/auth-token": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/@octokit/auth-token/-/auth-token-5.1.2.tgz",
      "integrity": "sha512-JcQDsBdg49Yky2w2ld20IHAlwr8d/d8N6NiOXbtuoPCqzbsiJgF633mVUw3x4mo0H5ypataQIX7SFu3yy44Mpw==",
      "license": "MIT",
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/@octokit/core": {
      "version": "6.1.4",
      "resolved": "https://registry.npmjs.org/@octokit/core/-/core-6.1.4.tgz",
      "integrity": "sha512-lAS9k7d6I0MPN+gb9bKDt7X8SdxknYqAMh44S5L+lNqIN2NuV8nvv3g8rPp7MuRxcOpxpUIATWprO0C34a8Qmg==",
      "license": "MIT",
      "dependencies": {
        "@octokit/auth-token": "^5.0.0",
        "@octokit/graphql": "^8.1.2",
        "@octokit/request": "^9.2.1",
        "@octokit/request-error": "^6.1.7",
        "@octokit/types": "^13.6.2",
        "before-after-hook": "^3.0.2",
        "universal-user-agent": "^7.0.0"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/@octokit/endpoint": {
      "version": "10.1.3",
      "resolved": "https://registry.npmjs.org/@octokit/endpoint/-/endpoint-10.1.3.tgz",
      "integrity": "sha512-nBRBMpKPhQUxCsQQeW+rCJ/OPSMcj3g0nfHn01zGYZXuNDvvXudF/TYY6APj5THlurerpFN4a/dQAIAaM6BYhA==",
      "license": "MIT",
      "dependencies": {
        "@octokit/types": "^13.6.2",
        "universal-user-agent": "^7.0.2"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/@octokit/graphql": {
      "version": "8.2.1",
      "resolved": "https://registry.npmjs.org/@octokit/graphql/-/graphql-8.2.1.tgz",
      "integrity": "sha512-n57hXtOoHrhwTWdvhVkdJHdhTv0JstjDbDRhJfwIRNfFqmSo1DaK/mD2syoNUoLCyqSjBpGAKOG0BuwF392slw==",
      "license": "MIT",
      "dependencies": {
        "@octokit/request": "^9.2.2",
        "@octokit/types": "^13.8.0",
        "universal-user-agent": "^7.0.0"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/@octokit/openapi-types": {
      "version": "23.0.1",
      "resolved": "https://registry.npmjs.org/@octokit/openapi-types/-/openapi-types-23.0.1.tgz",
      "integrity": "sha512-izFjMJ1sir0jn0ldEKhZ7xegCTj/ObmEDlEfpFrx4k/JyZSMRHbO3/rBwgE7f3m2DHt+RrNGIVw4wSmwnm3t/g==",
      "license": "MIT"
    },
    "node_modules/@octokit/plugin-paginate-rest": {
      "version": "11.4.2",
      "resolved": "https://registry.npmjs.org/@octokit/plugin-paginate-rest/-/plugin-paginate-rest-11.4.2.tgz",
      "integrity": "sha512-BXJ7XPCTDXFF+wxcg/zscfgw2O/iDPtNSkwwR1W1W5c4Mb3zav/M2XvxQ23nVmKj7jpweB4g8viMeCQdm7LMVA==",
      "license": "MIT",
      "dependencies": {
        "@octokit/types": "^13.7.0"
      },
      "engines": {
        "node": ">= 18"
      },
      "peerDependencies": {
        "@octokit/core": ">=6"
      }
    },
    "node_modules/@octokit/plugin-request-log": {
      "version": "5.3.1",
      "resolved": "https://registry.npmjs.org/@octokit/plugin-request-log/-/plugin-request-log-5.3.1.tgz",
      "integrity": "sha512-n/lNeCtq+9ofhC15xzmJCNKP2BWTv8Ih2TTy+jatNCCq/gQP/V7rK3fjIfuz0pDWDALO/o/4QY4hyOF6TQQFUw==",
      "license": "MIT",
      "engines": {
        "node": ">= 18"
      },
      "peerDependencies": {
        "@octokit/core": ">=6"
      }
    },
    "node_modules/@octokit/plugin-rest-endpoint-methods": {
      "version": "13.3.1",
      "resolved": "https://registry.npmjs.org/@octokit/plugin-rest-endpoint-methods/-/plugin-rest-endpoint-methods-13.3.1.tgz",
      "integrity": "sha512-o8uOBdsyR+WR8MK9Cco8dCgvG13H1RlM1nWnK/W7TEACQBFux/vPREgKucxUfuDQ5yi1T3hGf4C5ZmZXAERgwQ==",
      "license": "MIT",
      "dependencies": {
        "@octokit/types": "^13.8.0"
      },
      "engines": {
        "node": ">= 18"
      },
      "peerDependencies": {
        "@octokit/core": ">=6"
      }
    },
    "node_modules/@octokit/request": {
      "version": "9.2.2",
      "resolved": "https://registry.npmjs.org/@octokit/request/-/request-9.2.2.tgz",
      "integrity": "sha512-dZl0ZHx6gOQGcffgm1/Sf6JfEpmh34v3Af2Uci02vzUYz6qEN6zepoRtmybWXIGXFIK8K9ylE3b+duCWqhArtg==",
      "license": "MIT",
      "dependencies": {
        "@octokit/endpoint": "^10.1.3",
        "@octokit/request-error": "^6.1.7",
        "@octokit/types": "^13.6.2",
        "fast-content-type-parse": "^2.0.0",
        "universal-user-agent": "^7.0.2"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/@octokit/request-error": {
      "version": "6.1.7",
      "resolved": "https://registry.npmjs.org/@octokit/request-error/-/request-error-6.1.7.tgz",
      "integrity": "sha512-69NIppAwaauwZv6aOzb+VVLwt+0havz9GT5YplkeJv7fG7a40qpLt/yZKyiDxAhgz0EtgNdNcb96Z0u+Zyuy2g==",
      "license": "MIT",
      "dependencies": {
        "@octokit/types": "^13.6.2"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/@octokit/rest": {
      "version": "21.1.1",
      "resolved": "https://registry.npmjs.org/@octokit/rest/-/rest-21.1.1.tgz",
      "integrity": "sha512-sTQV7va0IUVZcntzy1q3QqPm/r8rWtDCqpRAmb8eXXnKkjoQEtFe3Nt5GTVsHft+R6jJoHeSiVLcgcvhtue/rg==",
      "license": "MIT",
      "dependencies": {
        "@octokit/core": "^6.1.4",
        "@octokit/plugin-paginate-rest": "^11.4.2",
        "@octokit/plugin-request-log": "^5.3.1",
        "@octokit/plugin-rest-endpoint-methods": "^13.3.0"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/@octokit/types": {
      "version": "13.8.0",
      "resolved": "https://registry.npmjs.org/@octokit/types/-/types-13.8.0.tgz",
      "integrity": "sha512-x7DjTIbEpEWXK99DMd01QfWy0hd5h4EN+Q7shkdKds3otGQP+oWE/y0A76i1OvH9fygo4ddvNf7ZvF0t78P98A==",
      "license": "MIT",
      "dependencies": {
        "@octokit/openapi-types": "^23.0.1"
      }
    },
    "node_modules/@types/node": {
      "version": "22.13.10",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.13.10.tgz",
      "integrity": "sha512-I6LPUvlRH+O6VRUqYOcMudhaIdUVWfsjnZavnsraHvpBwaEyMN29ry+0UVJhImYL16xsscu0aske3yA+uPOWfw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.20.0"
      }
    },
    "node_modules/before-after-hook": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/before-after-hook/-/before-after-hook-3.0.2.tgz",
      "integrity": "sha512-Nik3Sc0ncrMK4UUdXQmAnRtzmNQTAAXmXIopizwZ1W1t8QmfJj+zL4OA2I7XPTPW5z5TDqv4hRo/JzouDJnX3A==",
      "license": "Apache-2.0"
    },
    "node_modules/fast-content-type-parse": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/fast-content-type-parse/-/fast-content-type-parse-2.0.1.tgz",
      "integrity": "sha512-nGqtvLrj5w0naR6tDPfB4cUmYCqouzyQiz6C5y/LtcDllJdrcc6WaWW6iXyIIOErTa/XRybj28aasdn4LkVk6Q==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/fastify"
        },
        {
          "type": "opencollective",
          "url": "https://opencollective.com/fastify"
        }
      ],
      "license": "MIT"
    },
    "node_modules/jsonc-parser": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/jsonc-parser/-/jsonc-parser-3.2.0.tgz",
      "integrity": "sha512-gfFQZrcTc8CnKXp6Y4/CBT3fTc0OVuDofpre4aEeEpSBPV5X5v4+Vmx+8snU7RLPrNHPKSgLxGo9YuQzz20o+w=="
    },
    "node_modules/tunnel": {
      "version": "0.0.6",
      "resolved": "https://registry.npmjs.org/tunnel/-/tunnel-0.0.6.tgz",
      "integrity": "sha512-1h/Lnq9yajKY2PEbBadPXj3VxsDDu844OnaAo52UVmIzIvwwtBPIuNvkjuzBlTWpfJyUbG3ez0KSBibQkj4ojg==",
      "engines": {
        "node": ">=0.6.11 <=0.7.0 || >=0.7.3"
      }
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/universal-user-agent": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/universal-user-agent/-/universal-user-agent-7.0.2.tgz",
      "integrity": "sha512-0JCqzSKnStlRRQfCdowvqy3cy0Dvtlb8xecj/H8JFZuCze4rwjPZQOgvFvn0Ws/usCHQFGpyr+pB9adaGwXn4Q==",
      "license": "ISC"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/configuration-editing/package.json]---
Location: vscode-main/extensions/configuration-editing/package.json

```json
{
  "name": "configuration-editing",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "^1.0.0"
  },
  "icon": "images/icon.png",
  "activationEvents": [
    "onProfile",
    "onProfile:github",
    "onLanguage:json",
    "onLanguage:jsonc"
  ],
  "enabledApiProposals": [
    "profileContentHandlers"
  ],
  "main": "./out/configurationEditingMain",
  "browser": "./dist/browser/configurationEditingMain",
  "scripts": {
    "compile": "gulp compile-extension:configuration-editing",
    "watch": "gulp watch-extension:configuration-editing"
  },
  "dependencies": {
    "@octokit/rest": "^21.1.1",
    "jsonc-parser": "^3.2.0",
    "tunnel": "^0.0.6"
  },
  "capabilities": {
    "virtualWorkspaces": true,
    "untrustedWorkspaces": {
      "supported": true
    }
  },
  "contributes": {
    "languages": [
      {
        "id": "jsonc",
        "extensions": [
          ".code-workspace",
          "language-configuration.json",
          "icon-theme.json",
          "color-theme.json"
        ],
        "filenames": [
          "settings.json",
          "launch.json",
          "tasks.json",
          "mcp.json",
          "keybindings.json",
          "extensions.json",
          "argv.json",
          "profiles.json",
          "devcontainer.json",
          ".devcontainer.json"
        ]
      },
      {
        "id": "json",
        "extensions": [
          ".code-profile"
        ]
      }
    ],
    "jsonValidation": [
      {
        "fileMatch": "vscode://defaultsettings/keybindings.json",
        "url": "vscode://schemas/keybindings"
      },
      {
        "fileMatch": "%APP_SETTINGS_HOME%/keybindings.json",
        "url": "vscode://schemas/keybindings"
      },
      {
        "fileMatch": "%APP_SETTINGS_HOME%/profiles/*/keybindings.json",
        "url": "vscode://schemas/keybindings"
      },
      {
        "fileMatch": "vscode://defaultsettings/*.json",
        "url": "vscode://schemas/settings/default"
      },
      {
        "fileMatch": "%APP_SETTINGS_HOME%/settings.json",
        "url": "vscode://schemas/settings/user"
      },
      {
        "fileMatch": "%APP_SETTINGS_HOME%/profiles/*/settings.json",
        "url": "vscode://schemas/settings/profile"
      },
      {
        "fileMatch": "%MACHINE_SETTINGS_HOME%/settings.json",
        "url": "vscode://schemas/settings/machine"
      },
      {
        "fileMatch": "%APP_WORKSPACES_HOME%/*/workspace.json",
        "url": "vscode://schemas/workspaceConfig"
      },
      {
        "fileMatch": "**/*.code-workspace",
        "url": "vscode://schemas/workspaceConfig"
      },
      {
        "fileMatch": "**/argv.json",
        "url": "vscode://schemas/argv"
      },
      {
        "fileMatch": "/.vscode/settings.json",
        "url": "vscode://schemas/settings/folder"
      },
      {
        "fileMatch": "/.vscode/launch.json",
        "url": "vscode://schemas/launch"
      },
      {
        "fileMatch": "/.vscode/tasks.json",
        "url": "vscode://schemas/tasks"
      },
      {
        "fileMatch": "/.vscode/mcp.json",
        "url": "vscode://schemas/mcp"
      },
      {
        "fileMatch": "%APP_SETTINGS_HOME%/tasks.json",
        "url": "vscode://schemas/tasks"
      },
      {
        "fileMatch": "%APP_SETTINGS_HOME%/snippets/*.json",
        "url": "vscode://schemas/snippets"
      },
      {
        "fileMatch": "%APP_SETTINGS_HOME%/prompts/*.toolsets.jsonc",
        "url": "vscode://schemas/toolsets"
      },
      {
        "fileMatch": "%APP_SETTINGS_HOME%/profiles/*/snippets/.json",
        "url": "vscode://schemas/snippets"
      },
      {
        "fileMatch": "%APP_SETTINGS_HOME%/sync/snippets/preview/*.json",
        "url": "vscode://schemas/snippets"
      },
      {
        "fileMatch": "**/*.code-snippets",
        "url": "vscode://schemas/global-snippets"
      },
      {
        "fileMatch": "/.vscode/extensions.json",
        "url": "vscode://schemas/extensions"
      },
      {
        "fileMatch": "devcontainer.json",
        "url": "https://raw.githubusercontent.com/devcontainers/spec/main/schemas/devContainer.schema.json"
      },
      {
        "fileMatch": ".devcontainer.json",
        "url": "https://raw.githubusercontent.com/devcontainers/spec/main/schemas/devContainer.schema.json"
      },
      {
        "fileMatch": "%APP_SETTINGS_HOME%/globalStorage/ms-vscode-remote.remote-containers/nameConfigs/*.json",
        "url": "./schemas/attachContainer.schema.json"
      },
      {
        "fileMatch": "%APP_SETTINGS_HOME%/globalStorage/ms-vscode-remote.remote-containers/imageConfigs/*.json",
        "url": "./schemas/attachContainer.schema.json"
      },
      {
        "fileMatch": "**/quality/*/product.json",
        "url": "vscode://schemas/vscode-product"
      }
    ]
  },
  "devDependencies": {
    "@types/node": "22.x"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/configuration-editing/package.nls.json]---
Location: vscode-main/extensions/configuration-editing/package.nls.json

```json
{
	"displayName": "Configuration Editing",
	"description": "Provides capabilities (advanced IntelliSense, auto-fixing) in configuration files like settings, launch, and extension recommendation files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/configuration-editing/tsconfig.json]---
Location: vscode-main/extensions/configuration-editing/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"types": [
			"node"
		],
		"typeRoots": [
			"./node_modules/@types"
		]
	},
	"include": [
		"src/**/*",
		"../../src/vscode-dts/vscode.d.ts",
		"../../src/vscode-dts/vscode.proposed.profileContentHandlers.d.ts",
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/configuration-editing/schemas/attachContainer.schema.json]---
Location: vscode-main/extensions/configuration-editing/schemas/attachContainer.schema.json

```json
{
	"$schema": "http://json-schema.org/draft-07/schema#",
	"description": "Configures an attached to container",
	"allowComments": true,
	"allowTrailingCommas": true,
	"type": "object",
	"definitions": {
		"attachContainer": {
			"type": "object",
			"properties": {
				"workspaceFolder": {
					"type": "string",
					"description": "The path of the workspace folder inside the container."
				},
				"forwardPorts": {
					"type": "array",
					"description": "Ports that are forwarded from the container to the local machine. Can be an integer port number, or a string of the format \"host:port_number\".",
					"items": {
						"oneOf": [
							{
								"type": "integer",
								"maximum": 65535,
								"minimum": 0
							},
							{
								"type": "string",
								"pattern": "^([a-z0-9_-]+):(\\d{1,5})$"
							}
						]
					}
				},
				"portsAttributes": {
					"type": "object",
					"patternProperties": {
						"(^\\d+(-\\d+)?$)|(.+)": {
							"type": "object",
							"description": "A port, range of ports (ex. \"40000-55000\"), or regular expression (ex. \".+\\\\/server.js\").  For a port number or range, the attributes will apply to that port number or range of port numbers. Attributes which use a regular expression will apply to ports whose associated process command line matches the expression.",
							"properties": {
								"onAutoForward": {
									"type": "string",
									"enum": [
										"notify",
										"openBrowser",
										"openBrowserOnce",
										"openPreview",
										"silent",
										"ignore"
									],
									"enumDescriptions": [
										"Shows a notification when a port is automatically forwarded.",
										"Opens the browser when the port is automatically forwarded. Depending on your settings, this could open an embedded browser.",
										"Opens the browser when the port is automatically forwarded, but only the first time the port is forward during a session. Depending on your settings, this could open an embedded browser.",
										"Opens a preview in the same window when the port is automatically forwarded.",
										"Shows no notification and takes no action when this port is automatically forwarded.",
										"This port will not be automatically forwarded."
									],
									"description": "Defines the action that occurs when the port is discovered for automatic forwarding",
									"default": "notify"
								},
								"elevateIfNeeded": {
									"type": "boolean",
									"description": "Automatically prompt for elevation (if needed) when this port is forwarded. Elevate is required if the local port is a privileged port.",
									"default": false
								},
								"label": {
									"type": "string",
									"description": "Label that will be shown in the UI for this port.",
									"default": "Application"
								},
								"requireLocalPort": {
									"type": "boolean",
									"markdownDescription": "When true, a modal dialog will show if the chosen local port isn't used for forwarding.",
									"default": false
								},
								"protocol": {
									"type": "string",
									"enum": [
										"http",
										"https"
									],
									"description": "The protocol to use when forwarding this port."
								}
							},
							"default": {
								"label": "Application",
								"onAutoForward": "notify"
							}
						}
					},
					"markdownDescription": "Set default properties that are applied when a specific port number is forwarded. For example:\n\n```\n\"3000\": {\n  \"label\": \"Application\"\n},\n\"40000-55000\": {\n  \"onAutoForward\": \"ignore\"\n},\n\".+\\\\/server.js\": {\n \"onAutoForward\": \"openPreview\"\n}\n```",
					"defaultSnippets": [
						{
							"body": {
								"${1:3000}": {
									"label": "${2:Application}",
									"onAutoForward": "notify"
								}
							}
						}
					],
					"additionalProperties": false
				},
				"otherPortsAttributes": {
					"type": "object",
					"properties": {
						"onAutoForward": {
							"type": "string",
							"enum": [
								"notify",
								"openBrowser",
								"openPreview",
								"silent",
								"ignore"
							],
							"enumDescriptions": [
								"Shows a notification when a port is automatically forwarded.",
								"Opens the browser when the port is automatically forwarded. Depending on your settings, this could open an embedded browser.",
								"Opens a preview in the same window when the port is automatically forwarded.",
								"Shows no notification and takes no action when this port is automatically forwarded.",
								"This port will not be automatically forwarded."
							],
							"description": "Defines the action that occurs when the port is discovered for automatic forwarding",
							"default": "notify"
						},
						"elevateIfNeeded": {
							"type": "boolean",
							"description": "Automatically prompt for elevation (if needed) when this port is forwarded. Elevate is required if the local port is a privileged port.",
							"default": false
						},
						"label": {
							"type": "string",
							"description": "Label that will be shown in the UI for this port.",
							"default": "Application"
						},
						"requireLocalPort": {
							"type": "boolean",
							"markdownDescription": "When true, a modal dialog will show if the chosen local port isn't used for forwarding.",
							"default": false
						},
						"protocol": {
							"type": "string",
							"enum": [
								"http",
								"https"
							],
							"description": "The protocol to use when forwarding this port."
						}
					},
					"defaultSnippets": [
						{
							"body": {
								"onAutoForward": "ignore"
							}
						}
					],
					"markdownDescription": "Set default properties that are applied to all ports that don't get properties from the setting `remote.portsAttributes`. For example:\n\n```\n{\n  \"onAutoForward\": \"ignore\"\n}\n```",
					"additionalProperties": false
				},
				"settings": {
					"$ref": "vscode://schemas/settings/machine",
					"description": "Machine specific settings that should be copied into the container. These are only copied when connecting to the container for the first time."
				},
				"remoteEnv": {
					"type": "object",
					"additionalProperties": {
						"type": [
							"string",
							"null"
						]
					},
					"description": "Remote environment variables. If these are used in the Integrated Terminal, make sure the 'Terminal > Integrated: Inherit Env' setting is enabled."
				},
				"remoteUser": {
					"type": "string",
					"description": "The user VS Code Server will be started with. The default is the same user as the container."
				},
				"extensions": {
					"type": "array",
					"description": "An array of extensions that should be installed into the container.",
					"items": {
						"type": "string",
						"pattern": "^([a-z0-9A-Z][a-z0-9A-Z-]*)\\.([a-z0-9A-Z][a-z0-9A-Z-]*)(@(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?)?$",
						"errorMessage": "Expected format: '${publisher}.${name}' or '${publisher}.${name}@${version}'. Example: 'ms-dotnettools.csharp'."
					}
				},
				"userEnvProbe": {
					"type": "string",
					"enum": [
						"none",
						"loginShell",
						"loginInteractiveShell",
						"interactiveShell"
					],
					"description": "User environment probe to run. The default is none."
				},
				"postAttachCommand": {
					"type": [
						"string",
						"array"
					],
					"description": "A command to run after attaching to the container. If this is a single string, it will be run in a shell. If this is an array of strings, it will be run as a single command without shell.",
					"items": {
						"type": "string"
					}
				}
			}
		}
	},
	"allOf": [
		{
			"$ref": "#/definitions/attachContainer"
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/configuration-editing/schemas/devContainer.codespaces.schema.json]---
Location: vscode-main/extensions/configuration-editing/schemas/devContainer.codespaces.schema.json

```json
{
	"$schema": "http://json-schema.org/draft-07/schema#",
	"type": "object",
	"properties": {
		"customizations": {
			"type": "object",
			"properties": {
				"codespaces": {
					"type": "object",
					"description": "Customizations specific to GitHub Codespaces",
					"properties": {
						"repositories": {
							"type": "object",
							"description": "Configuration relative to the given repositories, following the format 'owner/repo'.\n  A wildcard (*) is permitted for the repo name (eg: 'microsoft/*')",
							"patternProperties": {
								"^[a-zA-Z0-9-_.]+[.]*\/[a-zA-Z0-9-_*]+[.]*$": {
									"type": "object",
									"additionalProperties": true,
									"oneOf": [
										{
											"properties": {
												"permissions": {
													"type": "object",
													"description": "Additional repository permissions.\n See https://aka.ms/ghcs/multi-repo-auth for more info.",
													"additionalProperties": true,
													"anyOf": [
														{
															"properties": {
																"actions": {
																	"type": "string",
																	"enum": [
																		"read",
																		"write"
																	]
																}
															}
														},
														{
															"properties": {
																"checks": {
																	"type": "string",
																	"enum": [
																		"read",
																		"write"
																	]
																}
															}
														},
														{
															"properties": {
																"contents": {
																	"type": "string",
																	"enum": [
																		"read",
																		"write"
																	]
																}
															}
														},
														{
															"properties": {
																"deployments": {
																	"type": "string",
																	"enum": [
																		"read",
																		"write"
																	]
																}
															}
														},
														{
															"properties": {
																"discussions": {
																	"type": "string",
																	"enum": [
																		"read",
																		"write"
																	]
																}
															}
														},
														{
															"properties": {
																"issues": {
																	"type": "string",
																	"enum": [
																		"read",
																		"write"
																	]
																}
															}
														},
														{
															"properties": {
																"packages": {
																	"type": "string",
																	"enum": [
																		"read"
																	]
																}
															}
														},
														{
															"properties": {
																"pages": {
																	"type": "string",
																	"enum": [
																		"read",
																		"write"
																	]
																}
															}
														},
														{
															"properties": {
																"pull_requests": {
																	"type": "string",
																	"enum": [
																		"read",
																		"write"
																	]
																}
															}
														},
														{
															"properties": {
																"repository_projects": {
																	"type": "string",
																	"enum": [
																		"read",
																		"write"
																	]
																}
															}
														},
														{
															"properties": {
																"statuses": {
																	"type": "string",
																	"enum": [
																		"read",
																		"write"
																	]
																}
															}
														},
														{
															"properties": {
																"workflows": {
																	"type": "string",
																	"enum": [
																		"write"
																	]
																}
															}
														}
													]
												}
											}
										},
										{
											"properties": {
												"permissions": {
													"type": "string",
													"description": "Additional repository permissions.\n See https://aka.ms/ghcs/multi-repo-auth for more info.",
													"enum": [
														"read-all",
														"write-all"
													]
												}
											}
										}
									]
								}
							}
						},
						"openFiles": {
							"type": "array",
							"description": "The paths to the files to open when the codespace is created. Paths are relative to the workspace.",
							"items": {
								"type": "string"
							}
						},
						"disableAutomaticConfiguration": {
							"type": "boolean",
							"description": "Disables the setup that is automatically run in a codespace if no `postCreateCommand` is specified.",
							"default": false
						}
					}
				}
			}
		},
		"codespaces": {
			"type": "object",
			"additionalProperties": true,
			"description": "Codespaces-specific configuration.",
			"deprecated": true,
			"deprecationMessage": "Use 'customizations/codespaces' instead"
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/configuration-editing/schemas/devContainer.vscode.schema.json]---
Location: vscode-main/extensions/configuration-editing/schemas/devContainer.vscode.schema.json

```json
{
	"$schema": "http://json-schema.org/draft-07/schema#",
	"type": "object",
	"properties": {
		"customizations": {
			"type": "object",
			"properties": {
				"vscode": {
					"type": "object",
					"properties": {
						"extensions": {
							"type": "array",
							"description": "An array of extensions that should be installed into the container. A minus '-' in front of the extension id removes it from the list of extensions to be installed.",
							"items": {
								"type": "string",
								"pattern": "^-?([a-z0-9A-Z][a-z0-9A-Z-]*)\\.([a-z0-9A-Z][a-z0-9A-Z-]*)((@(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?)|@prerelease)?$",
								"errorMessage": "Expected format: '${publisher}.${name}', '-${publisher}.${name}' or '${publisher}.${name}@${version}'. Example: 'ms-dotnettools.csharp'."
							}
						},
						"settings": {
							"$ref": "vscode://schemas/settings/machine",
							"description": "Machine specific settings that should be copied into the container. These are only copied when connecting to the container for the first time, rebuilding the container then triggers it again."
						},
						"mcp": {
							"$ref": "vscode://schemas/mcp",
							"description": "Model Context Protocol server configurations"
						},
						"devPort": {
							"type": "integer",
							"description": "The port VS Code can use to connect to its backend."
						}
					}
				}
			}
		},
		"extensions": {
			"type": "array",
			"description": "An array of extensions that should be installed into the container. A minus '-' in front of the extension id removes it from the list of extensions to be installed.",
			"items": {
				"type": "string",
				"pattern": "^-?([a-z0-9A-Z][a-z0-9A-Z-]*)\\.([a-z0-9A-Z][a-z0-9A-Z-]*)((@(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?)|@prerelease)?$",
				"errorMessage": "Expected format: '${publisher}.${name}', '-${publisher}.${name}' or '${publisher}.${name}@${version}'. Example: 'ms-dotnettools.csharp'."
			},
			"deprecated": true,
			"deprecationMessage": "Use 'customizations/vscode/extensions' instead"
		},
		"settings": {
			"$ref": "vscode://schemas/settings/machine",
			"description": "Machine specific settings that should be copied into the container. These are only copied when connecting to the container for the first time, rebuilding the container then triggers it again.",
			"deprecated": true,
			"deprecationMessage": "Use 'customizations/vscode/settings' instead"
		},
		"devPort": {
			"type": "integer",
			"description": "The port VS Code can use to connect to its backend.",
			"deprecated": true,
			"deprecationMessage": "Use 'customizations/vscode/devPort' instead"
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/configuration-editing/src/configurationEditingMain.ts]---
Location: vscode-main/extensions/configuration-editing/src/configurationEditingMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getLocation, JSONPath, parse, visit, Location } from 'jsonc-parser';
import * as vscode from 'vscode';
import { SettingsDocument } from './settingsDocumentHelper';
import { provideInstalledExtensionProposals } from './extensionsProposals';
import './importExportProfiles';

export function activate(context: vscode.ExtensionContext): void {
	//settings.json suggestions
	context.subscriptions.push(registerSettingsCompletions());

	//extensions suggestions
	context.subscriptions.push(...registerExtensionsCompletions());

	// launch.json variable suggestions
	context.subscriptions.push(registerVariableCompletions('**/launch.json'));

	// task.json variable suggestions
	context.subscriptions.push(registerVariableCompletions('**/tasks.json'));

	// Workspace file launch/tasks variable completions
	context.subscriptions.push(registerVariableCompletions('**/*.code-workspace'));

	// keybindings.json/package.json context key suggestions
	context.subscriptions.push(registerContextKeyCompletions());
}

function registerSettingsCompletions(): vscode.Disposable {
	return vscode.languages.registerCompletionItemProvider({ language: 'jsonc', pattern: '**/settings.json' }, {
		provideCompletionItems(document, position, token) {
			return new SettingsDocument(document).provideCompletionItems(position, token);
		}
	});
}

function registerVariableCompletions(pattern: string): vscode.Disposable {
	return vscode.languages.registerCompletionItemProvider({ language: 'jsonc', pattern }, {
		provideCompletionItems(document, position, _token) {
			const location = getLocation(document.getText(), document.offsetAt(position));
			if (isCompletingInsidePropertyStringValue(document, location, position)) {
				if (document.fileName.endsWith('.code-workspace') && !isLocationInsideTopLevelProperty(location, ['launch', 'tasks'])) {
					return [];
				}

				let range = document.getWordRangeAtPosition(position, /\$\{[^"\}]*\}?/);
				if (!range || range.start.isEqual(position) || range.end.isEqual(position) && document.getText(range).endsWith('}')) {
					range = new vscode.Range(position, position);
				}

				return [
					{ label: 'workspaceFolder', detail: vscode.l10n.t("The path of the folder opened in VS Code") },
					{ label: 'workspaceFolderBasename', detail: vscode.l10n.t("The name of the folder opened in VS Code without any slashes (/)") },
					{ label: 'fileWorkspaceFolderBasename', detail: vscode.l10n.t("The current opened file workspace folder name without any slashes (/)") },
					{ label: 'relativeFile', detail: vscode.l10n.t("The current opened file relative to ${workspaceFolder}") },
					{ label: 'relativeFileDirname', detail: vscode.l10n.t("The current opened file's dirname relative to ${workspaceFolder}") },
					{ label: 'file', detail: vscode.l10n.t("The current opened file") },
					{ label: 'cwd', detail: vscode.l10n.t("The task runner's current working directory on startup") },
					{ label: 'lineNumber', detail: vscode.l10n.t("The current selected line number in the active file") },
					{ label: 'selectedText', detail: vscode.l10n.t("The current selected text in the active file") },
					{ label: 'fileDirname', detail: vscode.l10n.t("The current opened file's dirname") },
					{ label: 'fileDirnameBasename', detail: vscode.l10n.t("The current opened file's folder name") },
					{ label: 'fileExtname', detail: vscode.l10n.t("The current opened file's extension") },
					{ label: 'fileBasename', detail: vscode.l10n.t("The current opened file's basename") },
					{ label: 'fileBasenameNoExtension', detail: vscode.l10n.t("The current opened file's basename with no file extension") },
					{ label: 'defaultBuildTask', detail: vscode.l10n.t("The name of the default build task. If there is not a single default build task then a quick pick is shown to choose the build task.") },
					{ label: 'pathSeparator', detail: vscode.l10n.t("The character used by the operating system to separate components in file paths. Is also aliased to '/'.") },
					{ label: 'extensionInstallFolder', detail: vscode.l10n.t("The path where an extension is installed."), param: 'publisher.extension' },
				].map(variable => ({
					label: `\${${variable.label}}`,
					range,
					insertText: variable.param ? new vscode.SnippetString(`\${${variable.label}:`).appendPlaceholder(variable.param).appendText('}') : (`\${${variable.label}}`),
					detail: variable.detail
				}));
			}

			return [];
		}
	});
}

function isCompletingInsidePropertyStringValue(document: vscode.TextDocument, location: Location, pos: vscode.Position) {
	if (location.isAtPropertyKey) {
		return false;
	}
	const previousNode = location.previousNode;
	if (previousNode && previousNode.type === 'string') {
		const offset = document.offsetAt(pos);
		return offset > previousNode.offset && offset < previousNode.offset + previousNode.length;
	}
	return false;
}

function isLocationInsideTopLevelProperty(location: Location, values: string[]) {
	return values.includes(location.path[0] as string);
}

interface IExtensionsContent {
	recommendations: string[];
}

function registerExtensionsCompletions(): vscode.Disposable[] {
	return [registerExtensionsCompletionsInExtensionsDocument(), registerExtensionsCompletionsInWorkspaceConfigurationDocument()];
}

function registerExtensionsCompletionsInExtensionsDocument(): vscode.Disposable {
	return vscode.languages.registerCompletionItemProvider({ pattern: '**/extensions.json' }, {
		provideCompletionItems(document, position, _token) {
			const location = getLocation(document.getText(), document.offsetAt(position));
			if (location.path[0] === 'recommendations') {
				const range = getReplaceRange(document, location, position);
				const extensionsContent = <IExtensionsContent>parse(document.getText());
				return provideInstalledExtensionProposals(extensionsContent && extensionsContent.recommendations || [], '', range, false);
			}
			return [];
		}
	});
}

function registerExtensionsCompletionsInWorkspaceConfigurationDocument(): vscode.Disposable {
	return vscode.languages.registerCompletionItemProvider({ pattern: '**/*.code-workspace' }, {
		provideCompletionItems(document, position, _token) {
			const location = getLocation(document.getText(), document.offsetAt(position));
			if (location.path[0] === 'extensions' && location.path[1] === 'recommendations') {
				const range = getReplaceRange(document, location, position);
				const extensionsContent = <IExtensionsContent>parse(document.getText())['extensions'];
				return provideInstalledExtensionProposals(extensionsContent && extensionsContent.recommendations || [], '', range, false);
			}
			return [];
		}
	});
}

function getReplaceRange(document: vscode.TextDocument, location: Location, position: vscode.Position) {
	const node = location.previousNode;
	if (node) {
		const nodeStart = document.positionAt(node.offset), nodeEnd = document.positionAt(node.offset + node.length);
		if (nodeStart.isBeforeOrEqual(position) && nodeEnd.isAfterOrEqual(position)) {
			return new vscode.Range(nodeStart, nodeEnd);
		}
	}
	return new vscode.Range(position, position);
}

vscode.languages.registerDocumentSymbolProvider({ pattern: '**/launch.json', language: 'jsonc' }, {
	provideDocumentSymbols(document: vscode.TextDocument, _token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[]> {
		const result: vscode.SymbolInformation[] = [];
		let name: string = '';
		let lastProperty = '';
		let startOffset = 0;
		let depthInObjects = 0;

		visit(document.getText(), {
			onObjectProperty: (property, _offset, _length) => {
				lastProperty = property;
			},
			onLiteralValue: (value: any, _offset: number, _length: number) => {
				if (lastProperty === 'name') {
					name = value;
				}
			},
			onObjectBegin: (offset: number, _length: number) => {
				depthInObjects++;
				if (depthInObjects === 2) {
					startOffset = offset;
				}
			},
			onObjectEnd: (offset: number, _length: number) => {
				if (name && depthInObjects === 2) {
					result.push(new vscode.SymbolInformation(name, vscode.SymbolKind.Object, new vscode.Range(document.positionAt(startOffset), document.positionAt(offset))));
				}
				depthInObjects--;
			},
		});

		return result;
	}
}, { label: 'Launch Targets' });

function registerContextKeyCompletions(): vscode.Disposable {
	type ContextKeyInfo = { key: string; type?: string; description?: string };

	const paths = new Map<vscode.DocumentFilter, JSONPath[]>([
		[{ language: 'jsonc', pattern: '**/keybindings.json' }, [
			['*', 'when']
		]],
		[{ language: 'json', pattern: '**/package.json' }, [
			['contributes', 'menus', '*', '*', 'when'],
			['contributes', 'views', '*', '*', 'when'],
			['contributes', 'viewsWelcome', '*', 'when'],
			['contributes', 'keybindings', '*', 'when'],
			['contributes', 'keybindings', 'when'],
		]]
	]);

	return vscode.languages.registerCompletionItemProvider(
		[...paths.keys()],
		{
			async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {

				const location = getLocation(document.getText(), document.offsetAt(position));

				if (location.isAtPropertyKey) {
					return;
				}

				let isValidLocation = false;
				for (const [key, value] of paths) {
					if (vscode.languages.match(key, document)) {
						if (value.some(location.matches.bind(location))) {
							isValidLocation = true;
							break;
						}
					}
				}

				if (!isValidLocation || !isCompletingInsidePropertyStringValue(document, location, position)) {
					return;
				}

				const replacing = document.getWordRangeAtPosition(position, /[a-zA-Z.]+/) || new vscode.Range(position, position);
				const inserting = replacing.with(undefined, position);

				const data = await vscode.commands.executeCommand<ContextKeyInfo[]>('getContextKeyInfo');
				if (token.isCancellationRequested || !data) {
					return;
				}

				const result = new vscode.CompletionList();
				for (const item of data) {
					const completion = new vscode.CompletionItem(item.key, vscode.CompletionItemKind.Constant);
					completion.detail = item.type;
					completion.range = { replacing, inserting };
					completion.documentation = item.description;
					result.items.push(completion);
				}
				return result;
			}
		}
	);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/configuration-editing/src/extensionsProposals.ts]---
Location: vscode-main/extensions/configuration-editing/src/extensionsProposals.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';


export async function provideInstalledExtensionProposals(existing: string[], additionalText: string, range: vscode.Range, includeBuiltinExtensions: boolean): Promise<vscode.CompletionItem[] | vscode.CompletionList> {
	if (Array.isArray(existing)) {
		const extensions = includeBuiltinExtensions ? vscode.extensions.all : vscode.extensions.all.filter(e => !(e.id.startsWith('vscode.') || e.id === 'Microsoft.vscode-markdown'));
		const knownExtensionProposals = extensions.filter(e => existing.indexOf(e.id) === -1);
		if (knownExtensionProposals.length) {
			return knownExtensionProposals.map(e => {
				const item = new vscode.CompletionItem(e.id);
				const insertText = `"${e.id}"${additionalText}`;
				item.kind = vscode.CompletionItemKind.Value;
				item.insertText = insertText;
				item.range = range;
				item.filterText = insertText;
				return item;
			});
		} else {
			const example = new vscode.CompletionItem(vscode.l10n.t("Example"));
			example.insertText = '"vscode.csharp"';
			example.kind = vscode.CompletionItemKind.Value;
			example.range = range;
			return [example];
		}
	}
	return [];
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/configuration-editing/src/importExportProfiles.ts]---
Location: vscode-main/extensions/configuration-editing/src/importExportProfiles.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Octokit } from '@octokit/rest';
import * as vscode from 'vscode';
import { basename } from 'path';
import { agent } from './node/net';

class GitHubGistProfileContentHandler implements vscode.ProfileContentHandler {

	readonly name = vscode.l10n.t('GitHub');
	readonly description = vscode.l10n.t('gist');

	private _octokit: Promise<Octokit> | undefined;
	private getOctokit(): Promise<Octokit> {
		if (!this._octokit) {
			this._octokit = (async () => {
				const session = await vscode.authentication.getSession('github', ['gist', 'user:email'], { createIfNone: true });
				const token = session.accessToken;

				const { Octokit } = await import('@octokit/rest');

				return new Octokit({
					request: { agent },
					userAgent: 'GitHub VSCode',
					auth: `token ${token}`
				});
			})();
		}
		return this._octokit;
	}

	async saveProfile(name: string, content: string): Promise<{ readonly id: string; readonly link: vscode.Uri } | null> {
		const octokit = await this.getOctokit();
		const result = await octokit.gists.create({
			public: false,
			files: {
				[name]: {
					content
				}
			}
		});
		if (result.data.id && result.data.html_url) {
			const link = vscode.Uri.parse(result.data.html_url);
			return { id: result.data.id, link };
		}
		return null;
	}

	private _public_octokit: Promise<Octokit> | undefined;
	private getPublicOctokit(): Promise<Octokit> {
		if (!this._public_octokit) {
			this._public_octokit = (async () => {
				const { Octokit } = await import('@octokit/rest');
				return new Octokit({ request: { agent }, userAgent: 'GitHub VSCode' });
			})();
		}
		return this._public_octokit;
	}

	async readProfile(id: string): Promise<string | null>;
	async readProfile(uri: vscode.Uri): Promise<string | null>;
	async readProfile(arg: string | vscode.Uri): Promise<string | null> {
		const gist_id = typeof arg === 'string' ? arg : basename(arg.path);
		const octokit = await this.getPublicOctokit();
		try {
			const gist = await octokit.gists.get({ gist_id });
			if (gist.data.files) {
				return gist.data.files[Object.keys(gist.data.files)[0]]?.content ?? null;
			}
		} catch (error) {
			// ignore
		}
		return null;
	}

}

vscode.window.registerProfileContentHandler('github', new GitHubGistProfileContentHandler());
```

--------------------------------------------------------------------------------

---[FILE: extensions/configuration-editing/src/settingsDocumentHelper.ts]---
Location: vscode-main/extensions/configuration-editing/src/settingsDocumentHelper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { getLocation, Location, parse } from 'jsonc-parser';
import { provideInstalledExtensionProposals } from './extensionsProposals';

const OVERRIDE_IDENTIFIER_REGEX = /\[([^\[\]]*)\]/g;

export class SettingsDocument {

	constructor(private document: vscode.TextDocument) { }

	public async provideCompletionItems(position: vscode.Position, _token: vscode.CancellationToken): Promise<vscode.CompletionItem[] | vscode.CompletionList> {
		const location = getLocation(this.document.getText(), this.document.offsetAt(position));

		// window.title
		if (location.path[0] === 'window.title') {
			return this.provideWindowTitleCompletionItems(location, position);
		}

		// files.association
		if (location.path[0] === 'files.associations') {
			return this.provideFilesAssociationsCompletionItems(location, position);
		}

		// files.exclude, search.exclude, explorer.autoRevealExclude
		if (location.path[0] === 'files.exclude' || location.path[0] === 'search.exclude' || location.path[0] === 'explorer.autoRevealExclude') {
			return this.provideExcludeCompletionItems(location, position);
		}

		// files.defaultLanguage
		if (location.path[0] === 'files.defaultLanguage') {
			return this.provideLanguageCompletionItems(location, position);
		}

		// workbench.editor.label
		if (location.path[0] === 'workbench.editor.label.patterns') {
			return this.provideEditorLabelCompletionItems(location, position);
		}

		// settingsSync.ignoredExtensions
		if (location.path[0] === 'settingsSync.ignoredExtensions') {
			let ignoredExtensions = [];
			try {
				ignoredExtensions = parse(this.document.getText())['settingsSync.ignoredExtensions'];
			} catch (e) {/* ignore error */ }
			const range = this.getReplaceRange(location, position);
			return provideInstalledExtensionProposals(ignoredExtensions, '', range, true);
		}

		// remote.extensionKind
		if (location.path[0] === 'remote.extensionKind' && location.path.length === 2 && location.isAtPropertyKey) {
			let alreadyConfigured: string[] = [];
			try {
				alreadyConfigured = Object.keys(parse(this.document.getText())['remote.extensionKind']);
			} catch (e) {/* ignore error */ }
			const range = this.getReplaceRange(location, position);
			return provideInstalledExtensionProposals(alreadyConfigured, location.previousNode ? '' : `: [\n\t"ui"\n]`, range, true);
		}

		// remote.portsAttributes
		if (location.path[0] === 'remote.portsAttributes' && location.path.length === 2 && location.isAtPropertyKey) {
			return this.providePortsAttributesCompletionItem(this.getReplaceRange(location, position));
		}

		return this.provideLanguageOverridesCompletionItems(location, position);
	}

	private getReplaceRange(location: Location, position: vscode.Position) {
		const node = location.previousNode;
		if (node) {
			const nodeStart = this.document.positionAt(node.offset), nodeEnd = this.document.positionAt(node.offset + node.length);
			if (nodeStart.isBeforeOrEqual(position) && nodeEnd.isAfterOrEqual(position)) {
				return new vscode.Range(nodeStart, nodeEnd);
			}
		}
		return new vscode.Range(position, position);
	}

	private isCompletingPropertyValue(location: Location, pos: vscode.Position) {
		if (location.isAtPropertyKey) {
			return false;
		}
		const previousNode = location.previousNode;
		if (previousNode) {
			const offset = this.document.offsetAt(pos);
			return offset >= previousNode.offset && offset <= previousNode.offset + previousNode.length;
		}
		return true;
	}

	private async provideWindowTitleCompletionItems(location: Location, pos: vscode.Position): Promise<vscode.CompletionItem[]> {
		const completions: vscode.CompletionItem[] = [];

		if (!this.isCompletingPropertyValue(location, pos)) {
			return completions;
		}

		let range = this.document.getWordRangeAtPosition(pos, /\$\{[^"\}]*\}?/);
		if (!range || range.start.isEqual(pos) || range.end.isEqual(pos) && this.document.getText(range).endsWith('}')) {
			range = new vscode.Range(pos, pos);
		}

		const getText = (variable: string) => {
			const text = '${' + variable + '}';
			return location.previousNode ? text : JSON.stringify(text);
		};


		completions.push(this.newSimpleCompletionItem(getText('activeEditorShort'), range, vscode.l10n.t("the file name (e.g. myFile.txt)")));
		completions.push(this.newSimpleCompletionItem(getText('activeEditorMedium'), range, vscode.l10n.t("the path of the file relative to the workspace folder (e.g. myFolder/myFileFolder/myFile.txt)")));
		completions.push(this.newSimpleCompletionItem(getText('activeEditorLong'), range, vscode.l10n.t("the full path of the file (e.g. /Users/Development/myFolder/myFileFolder/myFile.txt)")));
		completions.push(this.newSimpleCompletionItem(getText('activeFolderShort'), range, vscode.l10n.t("the name of the folder the file is contained in (e.g. myFileFolder)")));
		completions.push(this.newSimpleCompletionItem(getText('activeFolderMedium'), range, vscode.l10n.t("the path of the folder the file is contained in, relative to the workspace folder (e.g. myFolder/myFileFolder)")));
		completions.push(this.newSimpleCompletionItem(getText('activeFolderLong'), range, vscode.l10n.t("the full path of the folder the file is contained in (e.g. /Users/Development/myFolder/myFileFolder)")));
		completions.push(this.newSimpleCompletionItem(getText('rootName'), range, vscode.l10n.t("name of the workspace with optional remote name and workspace indicator if applicable (e.g. myFolder, myRemoteFolder [SSH] or myWorkspace (Workspace))")));
		completions.push(this.newSimpleCompletionItem(getText('rootNameShort'), range, vscode.l10n.t("shortened name of the workspace without suffixes (e.g. myFolder or myWorkspace)")));
		completions.push(this.newSimpleCompletionItem(getText('rootPath'), range, vscode.l10n.t("file path of the workspace (e.g. /Users/Development/myWorkspace)")));
		completions.push(this.newSimpleCompletionItem(getText('folderName'), range, vscode.l10n.t("name of the workspace folder the file is contained in (e.g. myFolder)")));
		completions.push(this.newSimpleCompletionItem(getText('folderPath'), range, vscode.l10n.t("file path of the workspace folder the file is contained in (e.g. /Users/Development/myFolder)")));
		completions.push(this.newSimpleCompletionItem(getText('appName'), range, vscode.l10n.t("e.g. VS Code")));
		completions.push(this.newSimpleCompletionItem(getText('remoteName'), range, vscode.l10n.t("e.g. SSH")));
		completions.push(this.newSimpleCompletionItem(getText('dirty'), range, vscode.l10n.t("an indicator for when the active editor has unsaved changes")));
		completions.push(this.newSimpleCompletionItem(getText('separator'), range, vscode.l10n.t("a conditional separator (' - ') that only shows when surrounded by variables with values")));
		completions.push(this.newSimpleCompletionItem(getText('activeRepositoryName'), range, vscode.l10n.t("the name of the active repository (e.g. vscode)")));
		completions.push(this.newSimpleCompletionItem(getText('activeRepositoryBranchName'), range, vscode.l10n.t("the name of the active branch in the active repository (e.g. main)")));
		completions.push(this.newSimpleCompletionItem(getText('activeEditorState'), range, vscode.l10n.t("the state of the active editor (e.g. modified).")));
		return completions;
	}

	private async provideEditorLabelCompletionItems(location: Location, pos: vscode.Position): Promise<vscode.CompletionItem[]> {
		const completions: vscode.CompletionItem[] = [];

		if (!this.isCompletingPropertyValue(location, pos)) {
			return completions;
		}

		let range = this.document.getWordRangeAtPosition(pos, /\$\{[^"\}]*\}?/);
		if (!range || range.start.isEqual(pos) || range.end.isEqual(pos) && this.document.getText(range).endsWith('}')) {
			range = new vscode.Range(pos, pos);
		}

		const getText = (variable: string) => {
			const text = '${' + variable + '}';
			return location.previousNode ? text : JSON.stringify(text);
		};


		completions.push(this.newSimpleCompletionItem(getText('dirname'), range, vscode.l10n.t("The parent folder name of the editor (e.g. myFileFolder)")));
		completions.push(this.newSimpleCompletionItem(getText('dirname(1)'), range, vscode.l10n.t("The nth parent folder name of the editor")));
		completions.push(this.newSimpleCompletionItem(getText('filename'), range, vscode.l10n.t("The file name of the editor without its directory or extension (e.g. myFile)")));
		completions.push(this.newSimpleCompletionItem(getText('extname'), range, vscode.l10n.t("The file extension of the editor (e.g. txt)")));
		return completions;
	}

	private async provideFilesAssociationsCompletionItems(location: Location, position: vscode.Position): Promise<vscode.CompletionItem[]> {
		const completions: vscode.CompletionItem[] = [];

		if (location.path.length === 2) {
			// Key
			if (location.path[1] === '') {
				const range = this.getReplaceRange(location, position);

				completions.push(this.newSnippetCompletionItem({
					label: vscode.l10n.t("Files with Extension"),
					documentation: vscode.l10n.t("Map all files matching the glob pattern in their filename to the language with the given identifier."),
					snippet: location.isAtPropertyKey ? '"*.${1:extension}": "${2:language}"' : '{ "*.${1:extension}": "${2:language}" }',
					range
				}));

				completions.push(this.newSnippetCompletionItem({
					label: vscode.l10n.t("Files with Path"),
					documentation: vscode.l10n.t("Map all files matching the absolute path glob pattern in their path to the language with the given identifier."),
					snippet: location.isAtPropertyKey ? '"/${1:path to file}/*.${2:extension}": "${3:language}"' : '{ "/${1:path to file}/*.${2:extension}": "${3:language}" }',
					range
				}));
			} else if (this.isCompletingPropertyValue(location, position)) {
				// Value
				return this.provideLanguageCompletionItemsForLanguageOverrides(this.getReplaceRange(location, position));
			}
		}

		return completions;
	}

	private async provideExcludeCompletionItems(location: Location, position: vscode.Position): Promise<vscode.CompletionItem[]> {
		const completions: vscode.CompletionItem[] = [];

		// Key
		if (location.path.length === 1 || (location.path.length === 2 && location.path[1] === '')) {
			const range = this.getReplaceRange(location, position);

			completions.push(this.newSnippetCompletionItem({
				label: vscode.l10n.t("Files by Extension"),
				documentation: vscode.l10n.t("Match all files of a specific file extension."),
				snippet: location.path.length === 2 ? '"**/*.${1:extension}": true' : '{ "**/*.${1:extension}": true }',
				range
			}));

			completions.push(this.newSnippetCompletionItem({
				label: vscode.l10n.t("Files with Multiple Extensions"),
				documentation: vscode.l10n.t("Match all files with any of the file extensions."),
				snippet: location.path.length === 2 ? '"**/*.{ext1,ext2,ext3}": true' : '{ "**/*.{ext1,ext2,ext3}": true }',
				range
			}));

			completions.push(this.newSnippetCompletionItem({
				label: vscode.l10n.t("Files with Siblings by Name"),
				documentation: vscode.l10n.t("Match files that have siblings with the same name but a different extension."),
				snippet: location.path.length === 2 ? '"**/*.${1:source-extension}": { "when": "$(basename).${2:target-extension}" }' : '{ "**/*.${1:source-extension}": { "when": "$(basename).${2:target-extension}" } }',
				range
			}));

			completions.push(this.newSnippetCompletionItem({
				label: vscode.l10n.t("Folder by Name (Top Level)"),
				documentation: vscode.l10n.t("Match a top level folder with a specific name."),
				snippet: location.path.length === 2 ? '"${1:name}": true' : '{ "${1:name}": true }',
				range
			}));

			completions.push(this.newSnippetCompletionItem({
				label: vscode.l10n.t("Folders with Multiple Names (Top Level)"),
				documentation: vscode.l10n.t("Match multiple top level folders."),
				snippet: location.path.length === 2 ? '"{folder1,folder2,folder3}": true' : '{ "{folder1,folder2,folder3}": true }',
				range
			}));

			completions.push(this.newSnippetCompletionItem({
				label: vscode.l10n.t("Folder by Name (Any Location)"),
				documentation: vscode.l10n.t("Match a folder with a specific name in any location."),
				snippet: location.path.length === 2 ? '"**/${1:name}": true' : '{ "**/${1:name}": true }',
				range
			}));
		}

		// Value
		else if (location.path.length === 2 && this.isCompletingPropertyValue(location, position)) {
			const range = this.getReplaceRange(location, position);
			completions.push(this.newSnippetCompletionItem({
				label: vscode.l10n.t("Files with Siblings by Name"),
				documentation: vscode.l10n.t("Match files that have siblings with the same name but a different extension."),
				snippet: '{ "when": "$(basename).${1:extension}" }',
				range
			}));
		}

		return completions;
	}

	private async provideLanguageCompletionItems(location: Location, position: vscode.Position): Promise<vscode.CompletionItem[]> {
		if (location.path.length === 1 && this.isCompletingPropertyValue(location, position)) {
			const range = this.getReplaceRange(location, position);
			const languages = await vscode.languages.getLanguages();
			return [
				this.newSimpleCompletionItem(JSON.stringify('${activeEditorLanguage}'), range, vscode.l10n.t("Use the language of the currently active text editor if any")),
				...languages.map(l => this.newSimpleCompletionItem(JSON.stringify(l), range))
			];
		}
		return [];
	}

	private async provideLanguageCompletionItemsForLanguageOverrides(range: vscode.Range): Promise<vscode.CompletionItem[]> {
		const languages = await vscode.languages.getLanguages();
		const completionItems = [];
		for (const language of languages) {
			const item = new vscode.CompletionItem(JSON.stringify(language));
			item.kind = vscode.CompletionItemKind.Property;
			item.range = range;
			completionItems.push(item);
		}
		return completionItems;
	}

	private async provideLanguageOverridesCompletionItems(location: Location, position: vscode.Position): Promise<vscode.CompletionItem[]> {
		if (location.path.length === 1 && location.isAtPropertyKey && location.previousNode && typeof location.previousNode.value === 'string' && location.previousNode.value.startsWith('[')) {
			const startPosition = this.document.positionAt(location.previousNode.offset + 1);
			const endPosition = startPosition.translate(undefined, location.previousNode.value.length);
			const donotSuggestLanguages: string[] = [];
			const languageOverridesRanges: vscode.Range[] = [];
			let matches = OVERRIDE_IDENTIFIER_REGEX.exec(location.previousNode.value);
			let lastLanguageOverrideRange: vscode.Range | undefined;
			while (matches?.length) {
				lastLanguageOverrideRange = new vscode.Range(this.document.positionAt(location.previousNode.offset + 1 + matches.index), this.document.positionAt(location.previousNode.offset + 1 + matches.index + matches[0].length));
				languageOverridesRanges.push(lastLanguageOverrideRange);
				/* Suggest the configured language if the position is in the match range */
				if (!lastLanguageOverrideRange.contains(position)) {
					donotSuggestLanguages.push(matches[1].trim());
				}
				matches = OVERRIDE_IDENTIFIER_REGEX.exec(location.previousNode.value);
			}
			const lastLanguageOverrideEndPosition = lastLanguageOverrideRange ? lastLanguageOverrideRange.end : startPosition;
			if (lastLanguageOverrideEndPosition.isBefore(endPosition)) {
				languageOverridesRanges.push(new vscode.Range(lastLanguageOverrideEndPosition, endPosition));
			}
			const languageOverrideRange = languageOverridesRanges.find(range => range.contains(position));

			/**
			 *  Skip if suggestions are for first language override range
			 *  Since VSCode registers language overrides to the schema, JSON language server does suggestions for first language override.
			 */
			if (languageOverrideRange && !languageOverrideRange.isEqual(languageOverridesRanges[0])) {
				const languages = await vscode.languages.getLanguages();
				const completionItems = [];
				for (const language of languages) {
					if (!donotSuggestLanguages.includes(language)) {
						const item = new vscode.CompletionItem(`[${language}]`);
						item.kind = vscode.CompletionItemKind.Property;
						item.range = languageOverrideRange;
						completionItems.push(item);
					}
				}
				return completionItems;
			}
		}
		return [];
	}

	private providePortsAttributesCompletionItem(range: vscode.Range): vscode.CompletionItem[] {
		return [this.newSnippetCompletionItem(
			{
				label: '\"3000\"',
				documentation: 'Single Port Attribute',
				range,
				snippet: '\n  \"${1:3000}\": {\n    \"label\": \"${2:Application}\",\n    \"onAutoForward\": \"${3:openPreview}\"\n  }\n'
			}),
		this.newSnippetCompletionItem(
			{
				label: '\"5000-6000\"',
				documentation: 'Ranged Port Attribute',
				range,
				snippet: '\n  \"${1:40000-55000}\": {\n    \"onAutoForward\": \"${2:ignore}\"\n  }\n'
			}),
		this.newSnippetCompletionItem(
			{
				label: '\".+\\\\/server.js\"',
				documentation: 'Command Match Port Attribute',
				range,
				snippet: '\n  \"${1:.+\\\\/server.js\}\": {\n    \"label\": \"${2:Application}\",\n    \"onAutoForward\": \"${3:openPreview}\"\n  }\n'
			})
		];
	}

	private newSimpleCompletionItem(text: string, range: vscode.Range, description?: string, insertText?: string): vscode.CompletionItem {
		const item = new vscode.CompletionItem(text);
		item.kind = vscode.CompletionItemKind.Value;
		item.detail = description;
		item.insertText = insertText ? insertText : text;
		item.range = range;
		return item;
	}

	private newSnippetCompletionItem(o: { label: string; documentation?: string; snippet: string; range: vscode.Range }): vscode.CompletionItem {
		const item = new vscode.CompletionItem(o.label);
		item.kind = vscode.CompletionItemKind.Value;
		item.documentation = o.documentation;
		item.insertText = new vscode.SnippetString(o.snippet);
		item.range = o.range;
		return item;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/configuration-editing/src/browser/net.ts]---
Location: vscode-main/extensions/configuration-editing/src/browser/net.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const agent = undefined;
```

--------------------------------------------------------------------------------

---[FILE: extensions/configuration-editing/src/node/net.ts]---
Location: vscode-main/extensions/configuration-editing/src/node/net.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Agent, globalAgent } from 'https';
import { URL } from 'url';
import { httpsOverHttp } from 'tunnel';
import { window } from 'vscode';

export const agent = getAgent();

/**
 * Return an https agent for the given proxy URL, or return the
 * global https agent if the URL was empty or invalid.
 */
function getAgent(url: string | undefined = process.env.HTTPS_PROXY): Agent {
	if (!url) {
		return globalAgent;
	}
	try {
		const { hostname, port, username, password } = new URL(url);
		const auth = username && password && `${username}:${password}`;
		return httpsOverHttp({ proxy: { host: hostname, port, proxyAuth: auth } });
	} catch (e) {
		window.showErrorMessage(`HTTPS_PROXY environment variable ignored: ${e.message}`);
		return globalAgent;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/configuration-editing/src/test/completion.test.ts]---
Location: vscode-main/extensions/configuration-editing/src/test/completion.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as assert from 'assert';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as os from 'os';
import 'mocha';


const testFolder = fs.mkdtemp(path.join(os.tmpdir(), 'conf-editing-'));

suite('Completions in settings.json', () => {
	const testFile = 'settings.json';

	test('window.title', async () => {
		{ // inserting after text
			const content = [
				'{',
				'  "window.title": "custom|"',
				'}',
			].join('\n');
			const resultText = [
				'{',
				'  "window.title": "custom${activeEditorShort}"',
				'}',
			].join('\n');
			const expected = { label: '${activeEditorShort}', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
		{	// inserting before a variable
			const content = [
				'{',
				'  "window.title": "|${activeEditorShort}"',
				'}',
			].join('\n');
			const resultText = [
				'{',
				'  "window.title": "${folderPath}${activeEditorShort}"',
				'}',
			].join('\n');
			const expected = { label: '${folderPath}', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
		{	// inserting after a variable
			const content = [
				'{',
				'  "window.title": "${activeEditorShort}|"',
				'}',
			].join('\n');
			const resultText = [
				'{',
				'  "window.title": "${activeEditorShort}${folderPath}"',
				'}',
			].join('\n');
			const expected = { label: '${folderPath}', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
		{ // replacing an variable
			const content = [
				'{',
				'  "window.title": "${a|ctiveEditorShort}"',
				'}',
			].join('\n');
			const resultText = [
				'{',
				'  "window.title": "${activeEditorMedium}"',
				'}',
			].join('\n');
			const expected = { label: '${activeEditorMedium}', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
		{ // replacing a partial variable
			const content = [
				'{',
				'  "window.title": "${a|"',
				'}',
			].join('\n');
			const resultText = [
				'{',
				'  "window.title": "${dirty}"',
				'}',
			].join('\n');
			const expected = { label: '${dirty}', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
		{ // inserting a literal
			const content = [
				'{',
				'  "window.title": |',
				'}',
			].join('\n');
			const resultText = [
				'{',
				'  "window.title": "${activeEditorMedium}"',
				'}',
			].join('\n');
			const expected = { label: '"${activeEditorMedium}"', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
		{ // no proposals after literal
			const content = [
				'{',
				'  "window.title": "${activeEditorShort}"   |',
				'}',
			].join('\n');
			const expected = { label: '${activeEditorMedium}', notAvailable: true };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
	});

	test('files.associations', async () => {
		{
			const content = [
				'{',
				'  "files.associations": {',
				'    |',
				'  }',
				'}',
			].join('\n');
			const resultText = [
				'{',
				'  "files.associations": {',
				'    "*.${1:extension}": "${2:language}"',
				'  }',
				'}',
			].join('\n');
			const expected = { label: 'Files with Extension', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
		{
			const content = [
				'{',
				'  "files.associations": {',
				'    |',
				'  }',
				'}',
			].join('\n');
			const resultText = [
				'{',
				'  "files.associations": {',
				'    "/${1:path to file}/*.${2:extension}": "${3:language}"',
				'  }',
				'}',
			].join('\n');
			const expected = { label: 'Files with Path', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
		{
			const content = [
				'{',
				'  "files.associations": {',
				'    "*.extension": "|bat"',
				'  }',
				'}',
			].join('\n');
			const resultText = [
				'{',
				'  "files.associations": {',
				'    "*.extension": "json"',
				'  }',
				'}',
			].join('\n');
			const expected = { label: '"json"', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
		{
			const content = [
				'{',
				'  "files.associations": {',
				'    "*.extension": "bat"|',
				'  }',
				'}',
			].join('\n');
			const resultText = [
				'{',
				'  "files.associations": {',
				'    "*.extension": "json"',
				'  }',
				'}',
			].join('\n');
			const expected = { label: '"json"', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
		{
			const content = [
				'{',
				'  "files.associations": {',
				'    "*.extension": "bat"  |',
				'  }',
				'}',
			].join('\n');
			const expected = { label: '"json"', notAvailable: true };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
	});
	test('files.exclude', async () => {
		{
			const content = [
				'{',
				'  "files.exclude": {',
				'    |',
				'  }',
				'}',
			].join('\n');
			const resultText = [
				'{',
				'  "files.exclude": {',
				'    "**/*.${1:extension}": true',
				'  }',
				'}',
			].join('\n');
			const expected = { label: 'Files by Extension', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
		{
			const content = [
				'{',
				'  "files.exclude": {',
				'    "**/*.extension": |true',
				'  }',
				'}',
			].join('\n');
			const resultText = [
				'{',
				'  "files.exclude": {',
				'    "**/*.extension": { "when": "$(basename).${1:extension}" }',
				'  }',
				'}',
			].join('\n');
			const expected = { label: 'Files with Siblings by Name', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
	});
	test('files.defaultLanguage', async () => {
		{
			const content = [
				'{',
				'  "files.defaultLanguage": "json|"',
				'}',
			].join('\n');
			const resultText = [
				'{',
				'  "files.defaultLanguage": "jsonc"',
				'}',
			].join('\n');
			const expected = { label: '"jsonc"', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
		{
			const content = [
				'{',
				'  "files.defaultLanguage": |',
				'}',
			].join('\n');
			const resultText = [
				'{',
				'  "files.defaultLanguage": "jsonc"',
				'}',
			].join('\n');
			const expected = { label: '"jsonc"', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
	});
	test('remote.extensionKind', async () => {
		{
			const content = [
				'{',
				'\t"remote.extensionKind": {',
				'\t\t|',
				'\t}',
				'}',
			].join('\n');
			const expected = { label: 'vscode.npm' };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
	});
	test('remote.portsAttributes', async () => {
		{
			const content = [
				'{',
				'  "remote.portsAttributes": {',
				'    |',
				'  }',
				'}',
			].join('\n');
			const expected = { label: '"3000"' };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
	});
});

suite('Completions in extensions.json', () => {
	const testFile = 'extensions.json';
	test('change recommendation', async () => {
		{
			const content = [
				'{',
				'  "recommendations": [',
				'    "|a.b"',
				'  ]',
				'}',
			].join('\n');
			const resultText = [
				'{',
				'  "recommendations": [',
				'    "ms-vscode.js-debug"',
				'  ]',
				'}',
			].join('\n');
			const expected = { label: 'ms-vscode.js-debug', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
	});
	test('add recommendation', async () => {
		{
			const content = [
				'{',
				'  "recommendations": [',
				'    |',
				'  ]',
				'}',
			].join('\n');
			const resultText = [
				'{',
				'  "recommendations": [',
				'    "ms-vscode.js-debug"',
				'  ]',
				'}',
			].join('\n');
			const expected = { label: 'ms-vscode.js-debug', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
	});
});

suite('Completions in launch.json', () => {
	const testFile = 'launch.json';
	test('variable completions', async () => {
		{
			const content = [
				'{',
				'  "version": "0.2.0",',
				'  "configurations": [',
				'    {',
				'      "name": "Run Extension",',
				'      "type": "extensionHost",',
				'      "preLaunchTask": "${|defaultBuildTask}"',
				'    }',
				'  ]',
				'}',
			].join('\n');
			const resultText = [
				'{',
				'  "version": "0.2.0",',
				'  "configurations": [',
				'    {',
				'      "name": "Run Extension",',
				'      "type": "extensionHost",',
				'      "preLaunchTask": "${cwd}"',
				'    }',
				'  ]',
				'}',
			].join('\n');
			const expected = { label: '${cwd}', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
		{
			const content = [
				'{',
				'  "version": "0.2.0",',
				'  "configurations": [',
				'    {',
				'      "name": "Run Extension",',
				'      "type": "extensionHost",',
				'      "preLaunchTask": "|${defaultBuildTask}"',
				'    }',
				'  ]',
				'}',
			].join('\n');
			const resultText = [
				'{',
				'  "version": "0.2.0",',
				'  "configurations": [',
				'    {',
				'      "name": "Run Extension",',
				'      "type": "extensionHost",',
				'      "preLaunchTask": "${cwd}${defaultBuildTask}"',
				'    }',
				'  ]',
				'}',
			].join('\n');
			const expected = { label: '${cwd}', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
		{
			const content = [
				'{',
				'  "version": "0.2.0",',
				'  "configurations": [',
				'    {',
				'      "name": "Do It",',
				'      "program": "${workspace|"',
				'    }',
				'  ]',
				'}',
			].join('\n');
			const resultText = [
				'{',
				'  "version": "0.2.0",',
				'  "configurations": [',
				'    {',
				'      "name": "Do It",',
				'      "program": "${cwd}"',
				'    }',
				'  ]',
				'}',
			].join('\n');
			const expected = { label: '${cwd}', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
	});
});

suite('Completions in tasks.json', () => {
	const testFile = 'tasks.json';
	test('variable completions', async () => {
		{
			const content = [
				'{',
				'  "version": "0.2.0",',
				'  "tasks": [',
				'    {',
				'      "type": "shell",',
				'      "command": "${|defaultBuildTask}"',
				'    }',
				'  ]',
				'}',
			].join('\n');
			const resultText = [
				'{',
				'  "version": "0.2.0",',
				'  "tasks": [',
				'    {',
				'      "type": "shell",',
				'      "command": "${cwd}"',
				'    }',
				'  ]',
				'}',
			].join('\n');
			const expected = { label: '${cwd}', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
		{
			const content = [
				'{',
				'  "version": "0.2.0",',
				'  "tasks": [',
				'    {',
				'      "type": "shell",',
				'      "command": "${defaultBuildTask}|"',
				'    }',
				'  ]',
				'}',
			].join('\n');
			const resultText = [
				'{',
				'  "version": "0.2.0",',
				'  "tasks": [',
				'    {',
				'      "type": "shell",',
				'      "command": "${defaultBuildTask}${cwd}"',
				'    }',
				'  ]',
				'}',
			].join('\n');
			const expected = { label: '${cwd}', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
	});
});

suite('Completions in keybindings.json', () => {
	const testFile = 'keybindings.json';
	test('context key insertion', async () => {
		{
			const content = [
				'[',
				'  {',
				'    "key": "ctrl+k ctrl+,",',
				'    "command": "editor.jumpToNextFold",',
				'    "when": "|"',
				'  }',
				']',
			].join('\n');
			const resultText = [
				'[',
				'  {',
				'    "key": "ctrl+k ctrl+,",',
				'    "command": "editor.jumpToNextFold",',
				'    "when": "resourcePath"',
				'  }',
				']',
			].join('\n');
			const expected = { label: 'resourcePath', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
	});

	test('context key replace', async () => {
		{
			const content = [
				'[',
				'  {',
				'    "key": "ctrl+k ctrl+,",',
				'    "command": "editor.jumpToNextFold",',
				'    "when": "resou|rcePath"',
				'  }',
				']',
			].join('\n');
			const resultText = [
				'[',
				'  {',
				'    "key": "ctrl+k ctrl+,",',
				'    "command": "editor.jumpToNextFold",',
				'    "when": "resource"',
				'  }',
				']',
			].join('\n');
			const expected = { label: 'resource', resultText };
			await testCompletion(testFile, 'jsonc', content, expected);
		}
	});
});

interface ItemDescription {
	label: string;
	resultText?: string;
	notAvailable?: boolean;
}

async function testCompletion(testFileName: string, languageId: string, content: string, expected: ItemDescription) {

	const offset = content.indexOf('|');
	content = content.substring(0, offset) + content.substring(offset + 1);

	const docUri = vscode.Uri.file(path.join(await testFolder, testFileName));
	await fs.writeFile(docUri.fsPath, content);

	const editor = await setTestContent(docUri, languageId, content);
	const position = editor.document.positionAt(offset);

	// Executing the command `vscode.executeCompletionItemProvider` to simulate triggering completion
	const actualCompletions = (await vscode.commands.executeCommand('vscode.executeCompletionItemProvider', docUri, position)) as vscode.CompletionList;

	const matches = actualCompletions.items.filter(completion => {
		return completion.label === expected.label;
	});
	if (expected.notAvailable) {
		assert.strictEqual(matches.length, 0, `${expected.label} should not existing is results`);
	} else {
		assert.strictEqual(matches.length, 1, `${expected.label} should only existing once: Actual: ${actualCompletions.items.map(c => c.label).join(', ')}`);

		if (expected.resultText) {
			const match = matches[0];
			if (match.range && match.insertText) {
				const range = match.range instanceof vscode.Range ? match.range : match.range.replacing;
				const text = typeof match.insertText === 'string' ? match.insertText : match.insertText.value;

				await editor.edit(eb => eb.replace(range, text));
				assert.strictEqual(editor.document.getText(), expected.resultText);
			} else {
				assert.fail(`Range or insertText missing`);
			}
		}
	}
}

async function setTestContent(docUri: vscode.Uri, languageId: string, content: string): Promise<vscode.TextEditor> {
	const ext = vscode.extensions.getExtension('vscode.configuration-editing')!;
	await ext.activate();

	const doc = await vscode.workspace.openTextDocument(docUri);
	await vscode.languages.setTextDocumentLanguage(doc, languageId);
	const editor = await vscode.window.showTextDocument(doc);

	const fullRange = new vscode.Range(new vscode.Position(0, 0), doc.positionAt(doc.getText().length));
	await editor.edit(eb => eb.replace(fullRange, content));
	return editor;

}
```

--------------------------------------------------------------------------------

---[FILE: extensions/configuration-editing/src/test/index.ts]---
Location: vscode-main/extensions/configuration-editing/src/test/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as testRunner from '../../../../test/integration/electron/testrunner';

const options: import('mocha').MochaOptions = {
	ui: 'tdd',
	color: true,
	timeout: 60000
};

// These integration tests is being run in multiple environments (electron, web, remote)
// so we need to set the suite name based on the environment as the suite name is used
// for the test results file name
let suite = '';
if (process.env.VSCODE_BROWSER) {
	suite = `${process.env.VSCODE_BROWSER} Browser Integration Configuration-Editing Tests`;
} else if (process.env.REMOTE_VSCODE) {
	suite = 'Remote Integration Configuration-Editing Tests';
} else {
	suite = 'Integration Configuration-Editing Tests';
}

if (process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || process.env.GITHUB_WORKSPACE) {
	options.reporter = 'mocha-multi-reporters';
	options.reporterOptions = {
		reporterEnabled: 'spec, mocha-junit-reporter',
		mochaJunitReporterReporterOptions: {
			testsuitesTitle: `${suite} ${process.platform}`,
			mochaFile: path.join(
				process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || process.env.GITHUB_WORKSPACE || __dirname,
				`test-results/${process.platform}-${process.arch}-${suite.toLowerCase().replace(/[^\w]/g, '-')}-results.xml`)
		}
	};
}

testRunner.configure(options);

export = testRunner;
```

--------------------------------------------------------------------------------

---[FILE: extensions/configuration-editing/src/typings/ref.d.ts]---
Location: vscode-main/extensions/configuration-editing/src/typings/ref.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'tunnel';
```

--------------------------------------------------------------------------------

---[FILE: extensions/cpp/.vscodeignore]---
Location: vscode-main/extensions/cpp/.vscodeignore

```text
build/**
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/cpp/cgmanifest.json]---
Location: vscode-main/extensions/cpp/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "jeff-hykin/better-cpp-syntax",
					"repositoryUrl": "https://github.com/jeff-hykin/better-cpp-syntax",
					"commitHash": "f1d127a8af2b184db570345f0bb179503c47fdf6"
				}
			},
			"license": "MIT",
			"licenseDetail": [
				[
					"MIT License",
					"",
					"Copyright (c) 2019 Jeff Hykin",
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
			],
			"version": "1.17.4",
			"description": "The original JSON grammars were derived from https://github.com/atom/language-c which was originally converted from the C TextMate bundle https://github.com/textmate/c.tmbundle."
		},
		{
			"component": {
				"type": "git",
				"git": {
					"name": "jeff-hykin/better-c-syntax",
					"repositoryUrl": "https://github.com/jeff-hykin/better-c-syntax",
					"commitHash": "34712a6106a4ffb0a04d2fa836fd28ff6c5849a4"
				}
			},
			"license": "MIT",
			"version": "1.13.2",
			"description": "The original JSON grammars were derived from https://github.com/atom/language-c which was originally converted from the C TextMate bundle https://github.com/textmate/c.tmbundle."
		},
		{
			"component": {
				"type": "git",
				"git": {
					"name": "textmate/c.tmbundle",
					"repositoryUrl": "https://github.com/textmate/c.tmbundle",
					"commitHash": "60daf83b9d45329524f7847a75e9298b3aae5805"
				}
			},
			"licenseDetail": [
				"Copyright (c) textmate-c.tmbundle authors",
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
					"name": "NVIDIA/cuda-cpp-grammar",
					"repositoryUrl": "https://github.com/NVIDIA/cuda-cpp-grammar",
					"commitHash": "81e88eaec5170aa8585736c63627c73e3589998c"
				}
			},
			"license": "MIT",
			"version": "0.0.0",
			"description": "The file syntaxes/cuda-cpp.tmLanguage.json was derived from https://github.com/jeff-hykin/cpp-textmate-grammar, which was derived from https://github.com/atom/language-c, which was originally converted from the C TextMate bundle https://github.com/textmate/c.tmbundle."
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/cpp/language-configuration.json]---
Location: vscode-main/extensions/cpp/language-configuration.json

```json
{
	"comments": {
		"lineComment": "//",
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
			"open": "[",
			"close": "]"
		},
		{
			"open": "{",
			"close": "}"
		},
		{
			"open": "(",
			"close": ")"
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
				"string"
			]
		},
		{
			"open": "/*",
			"close": "*/",
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
			"\"",
			"\""
		],
		[
			"'",
			"'"
		],
		[
			"<",
			">"
		]
	],
	"wordPattern": "(-?\\d*\\.\\d\\w*)|([^\\`\\~\\!\\@\\#\\%\\^\\&\\*\\(\\)\\-\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\'\\\"\\,\\.\\<\\>\\/\\?\\s]+)",
	"folding": {
		"markers": {
			"start": "^\\s*#pragma\\s+region\\b",
			"end": "^\\s*#pragma\\s+endregion\\b"
		}
	},
	"indentationRules": {
		"decreaseIndentPattern": {
			"pattern": "^\\s*[\\}\\]\\)].*$"
		},
		"increaseIndentPattern": {
			"pattern": "^.*(\\{[^}]*|\\([^)]*|\\[[^\\]]*)$"
		},
	},
	"onEnterRules": [
		{
			// Decrease indentation after single line if/else if/else, for, or while
			"previousLineText": "^\\s*(((else ?)?if|for|while)\\s*\\(.*\\)\\s*|else\\s*)$",
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

---[FILE: extensions/cpp/package.json]---
Location: vscode-main/extensions/cpp/package.json

```json
{
  "name": "cpp",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "scripts": {
    "update-grammar": "node ./build/update-grammars.js"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "c",
        "extensions": [
          ".c",
          ".i"
        ],
        "aliases": [
          "C",
          "c"
        ],
        "configuration": "./language-configuration.json"
      },
      {
        "id": "cpp",
        "extensions": [
          ".cpp",
          ".cppm",
          ".cc",
          ".ccm",
          ".cxx",
          ".cxxm",
          ".c++",
          ".c++m",
          ".hpp",
          ".hh",
          ".hxx",
          ".h++",
          ".h",
          ".ii",
          ".ino",
          ".inl",
          ".ipp",
          ".ixx",
          ".tpp",
          ".txx",
          ".hpp.in",
          ".h.in"
        ],
        "aliases": [
          "C++",
          "Cpp",
          "cpp"
        ],
        "configuration": "./language-configuration.json"
      },
      {
        "id": "cuda-cpp",
        "extensions": [
          ".cu",
          ".cuh"
        ],
        "aliases": [
          "CUDA C++"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "c",
        "scopeName": "source.c",
        "path": "./syntaxes/c.tmLanguage.json"
      },
      {
        "language": "cpp",
        "scopeName": "source.cpp.embedded.macro",
        "path": "./syntaxes/cpp.embedded.macro.tmLanguage.json"
      },
      {
        "language": "cpp",
        "scopeName": "source.cpp",
        "path": "./syntaxes/cpp.tmLanguage.json"
      },
      {
        "scopeName": "source.c.platform",
        "path": "./syntaxes/platform.tmLanguage.json"
      },
      {
        "language": "cuda-cpp",
        "scopeName": "source.cuda-cpp",
        "path": "./syntaxes/cuda-cpp.tmLanguage.json"
      }
    ],
    "problemPatterns": [
      {
        "name": "nvcc-location",
        "regexp": "^(.*)\\((\\d+)\\):\\s+(warning|error):\\s+(.*)",
        "kind": "location",
        "file": 1,
        "location": 2,
        "severity": 3,
        "message": 4
      }
    ],
    "problemMatchers": [
        {
            "name": "nvcc",
            "owner": "cuda-cpp",
            "fileLocation": [
                "relative",
                "${workspaceFolder}"
            ],
            "pattern": "$nvcc-location"
        }
    ],
    "snippets": [
      {
        "language": "c",
        "path": "./snippets/c.code-snippets"
      },
      {
        "language": "cpp",
        "path": "./snippets/cpp.code-snippets"
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

---[FILE: extensions/cpp/package.nls.json]---
Location: vscode-main/extensions/cpp/package.nls.json

```json
{
	"displayName": "C/C++ Language Basics",
	"description": "Provides snippets, syntax highlighting, bracket matching and folding in C/C++ files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/cpp/build/update-grammars.js]---
Location: vscode-main/extensions/cpp/build/update-grammars.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

var updateGrammar = require('vscode-grammar-updater');

async function updateGrammars() {
	await updateGrammar.update('jeff-hykin/better-c-syntax', 'autogenerated/c.tmLanguage.json', './syntaxes/c.tmLanguage.json', undefined, 'master');
	
	// The license has changed for these two grammar. We have to freeze them as the new license is not compatible with our license.
	// await updateGrammar.update('jeff-hykin/better-cpp-syntax', 'autogenerated/cpp.tmLanguage.json', './syntaxes/cpp.tmLanguage.json', undefined, 'master');
	// await updateGrammar.update('jeff-hykin/better-cpp-syntax', 'autogenerated/cpp.embedded.macro.tmLanguage.json', './syntaxes/cpp.embedded.macro.tmLanguage.json', undefined, 'master');

	await updateGrammar.update('NVIDIA/cuda-cpp-grammar', 'syntaxes/cuda-cpp.tmLanguage.json', './syntaxes/cuda-cpp.tmLanguage.json', undefined, 'master');

	// `source.c.platform` which is still included by other grammars
	await updateGrammar.update('textmate/c.tmbundle', 'Syntaxes/Platform.tmLanguage', './syntaxes/platform.tmLanguage.json');
}

updateGrammars();
```

--------------------------------------------------------------------------------

---[FILE: extensions/cpp/snippets/c.code-snippets]---
Location: vscode-main/extensions/cpp/snippets/c.code-snippets

```text
{
	"Region Start": {
		"prefix": "#region",
		"body": [
			"#pragma region $0"
		],
		"description": "Folding Region Start"
	},
	"Region End": {
		"prefix": "#endregion",
		"body": [
			"#pragma endregion"
		],
		"description": "Folding Region End"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/cpp/snippets/cpp.code-snippets]---
Location: vscode-main/extensions/cpp/snippets/cpp.code-snippets

```text
{
	"Region Start": {
		"prefix": "#region",
		"body": [
			"#pragma region $0"
		],
		"description": "Folding Region Start"
	},
	"Region End": {
		"prefix": "#endregion",
		"body": [
			"#pragma endregion"
		],
		"description": "Folding Region End"
	}
}
```

--------------------------------------------------------------------------------

````
