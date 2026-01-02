---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 44
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 44 of 552)

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

---[FILE: extensions/handlebars/language-configuration.json]---
Location: vscode-main/extensions/handlebars/language-configuration.json

```json
{
	"comments": {
		"blockComment": [ "{{!--", "--}}" ]
	},
	"brackets": [
		["<!--", "-->"],
		["<", ">"],
		["{{", "}}"],
		["{{{", "}}}"],
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
		{ "open": "<", "close": ">" },
		{ "open": "{", "close": "}" }
	],
	"wordPattern": "(-?\\d*\\.\\d\\w*)|([^\\`\\~\\!\\@\\$\\^\\&\\*\\(\\)\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\'\\\"\\,\\.\\<\\>\\/\\s]+)",
	"onEnterRules": [
		{
			"beforeText": { "pattern": "<(?!(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!\\/)>)[^<]*$", "flags": "i" },
			"afterText": { "pattern": "^<\\/([_:\\w][_:\\w-.\\d]*)\\s*>", "flags": "i" },
			"action": {
				"indent": "indentOutdent"
			}
		},
		{
			"beforeText": { "pattern": "<(?!(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr))(\\w[\\w\\d]*)([^/>]*(?!\\/)>)[^<]*$", "flags": "i" },
			"action": {
				"indent": "indent"
			}
		}
	],
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/handlebars/package.json]---
Location: vscode-main/extensions/handlebars/package.json

```json
{
  "name": "handlebars",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "0.10.x"
  },
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin daaain/Handlebars grammars/Handlebars.json ./syntaxes/Handlebars.tmLanguage.json"
  },
  "categories": ["Programming Languages"],
  "extensionKind": [
    "ui",
    "workspace"
  ],
  "contributes": {
    "languages": [
      {
        "id": "handlebars",
        "extensions": [
          ".handlebars",
          ".hbs",
          ".hjs"
        ],
        "aliases": [
          "Handlebars",
          "handlebars"
        ],
        "mimetypes": [
          "text/x-handlebars-template"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "handlebars",
        "scopeName": "text.html.handlebars",
        "path": "./syntaxes/Handlebars.tmLanguage.json"
      }
    ],
    "htmlLanguageParticipants": [
      {
        "languageId": "handlebars",
        "autoInsert": true
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

---[FILE: extensions/handlebars/package.nls.json]---
Location: vscode-main/extensions/handlebars/package.nls.json

```json
{
	"displayName": "Handlebars Language Basics",
	"description": "Provides syntax highlighting and bracket matching in Handlebars files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/handlebars/syntaxes/Handlebars.tmLanguage.json]---
Location: vscode-main/extensions/handlebars/syntaxes/Handlebars.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/daaain/Handlebars/blob/master/grammars/Handlebars.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/daaain/Handlebars/commit/85a153a6f759df4e8da7533e1b3651f007867c51",
	"name": "Handlebars",
	"scopeName": "text.html.handlebars",
	"patterns": [
		{
			"include": "#yfm"
		},
		{
			"include": "#extends"
		},
		{
			"include": "#block_comments"
		},
		{
			"include": "#comments"
		},
		{
			"include": "#block_helper"
		},
		{
			"include": "#end_block"
		},
		{
			"include": "#else_token"
		},
		{
			"include": "#partial_and_var"
		},
		{
			"include": "#inline_script"
		},
		{
			"include": "#html_tags"
		},
		{
			"include": "text.html.basic"
		}
	],
	"repository": {
		"html_tags": {
			"patterns": [
				{
					"begin": "(<)([a-zA-Z0-9:-]+)(?=[^>]*></\\2>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						}
					},
					"end": "(>(<)/)(\\2)(>)",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.tag.html"
						},
						"2": {
							"name": "meta.scope.between-tag-pair.html"
						},
						"3": {
							"name": "entity.name.tag.html"
						},
						"4": {
							"name": "punctuation.definition.tag.html"
						}
					},
					"name": "meta.tag.any.html",
					"patterns": [
						{
							"include": "#tag-stuff"
						}
					]
				},
				{
					"begin": "(<\\?)(xml)",
					"captures": {
						"1": {
							"name": "punctuation.definition.tag.html"
						},
						"2": {
							"name": "entity.name.tag.xml.html"
						}
					},
					"end": "(\\?>)",
					"name": "meta.tag.preprocessor.xml.html",
					"patterns": [
						{
							"include": "#tag_generic_attribute"
						},
						{
							"include": "#string"
						}
					]
				},
				{
					"begin": "<!--",
					"captures": {
						"0": {
							"name": "punctuation.definition.comment.html"
						}
					},
					"end": "--\\s*>",
					"name": "comment.block.html",
					"patterns": [
						{
							"match": "--",
							"name": "invalid.illegal.bad-comments-or-CDATA.html"
						}
					]
				},
				{
					"begin": "<!",
					"captures": {
						"0": {
							"name": "punctuation.definition.tag.html"
						}
					},
					"end": ">",
					"name": "meta.tag.sgml.html",
					"patterns": [
						{
							"begin": "(DOCTYPE|doctype)",
							"captures": {
								"1": {
									"name": "entity.name.tag.doctype.html"
								}
							},
							"end": "(?=>)",
							"name": "meta.tag.sgml.doctype.html",
							"patterns": [
								{
									"match": "\"[^\">]*\"",
									"name": "string.quoted.double.doctype.identifiers-and-DTDs.html"
								}
							]
						},
						{
							"begin": "\\[CDATA\\[",
							"end": "]](?=>)",
							"name": "constant.other.inline-data.html"
						},
						{
							"match": "(\\s*)(?!--|>)\\S(\\s*)",
							"name": "invalid.illegal.bad-comments-or-CDATA.html"
						}
					]
				},
				{
					"begin": "(?:^\\s+)?(<)((?i:style))\\b(?![^>]*/>)",
					"captures": {
						"1": {
							"name": "punctuation.definition.tag.html"
						},
						"2": {
							"name": "entity.name.tag.style.html"
						},
						"3": {
							"name": "punctuation.definition.tag.html"
						}
					},
					"end": "(</)((?i:style))(>)(?:\\s*\\n)?",
					"name": "source.css.embedded.html",
					"patterns": [
						{
							"include": "#tag-stuff"
						},
						{
							"begin": "(>)",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.tag.html"
								}
							},
							"end": "(?=</(?i:style))",
							"patterns": [
								{
									"include": "source.css"
								}
							]
						}
					]
				},
				{
					"begin": "(?:^\\s+)?(<)((?i:script))\\b(?![^>]*/>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.html"
						},
						"2": {
							"name": "entity.name.tag.script.html"
						}
					},
					"end": "(?<=</(script|SCRIPT))(>)(?:\\s*\\n)?",
					"endCaptures": {
						"2": {
							"name": "punctuation.definition.tag.html"
						}
					},
					"name": "source.js.embedded.html",
					"patterns": [
						{
							"include": "#tag-stuff"
						},
						{
							"begin": "(?<!</(?:script|SCRIPT))(>)",
							"captures": {
								"1": {
									"name": "punctuation.definition.tag.html"
								},
								"2": {
									"name": "entity.name.tag.script.html"
								}
							},
							"end": "(</)((?i:script))",
							"patterns": [
								{
									"captures": {
										"1": {
											"name": "punctuation.definition.comment.js"
										}
									},
									"match": "(//).*?((?=</script)|$\\n?)",
									"name": "comment.line.double-slash.js"
								},
								{
									"begin": "/\\*",
									"captures": {
										"0": {
											"name": "punctuation.definition.comment.js"
										}
									},
									"end": "\\*/|(?=</script)",
									"name": "comment.block.js"
								},
								{
									"include": "source.js"
								}
							]
						}
					]
				},
				{
					"begin": "(</?)((?i:body|head|html)\\b)",
					"captures": {
						"1": {
							"name": "punctuation.definition.tag.html"
						},
						"2": {
							"name": "entity.name.tag.structure.any.html"
						}
					},
					"end": "(>)",
					"name": "meta.tag.structure.any.html",
					"patterns": [
						{
							"include": "#tag-stuff"
						}
					]
				},
				{
					"begin": "(</?)((?i:address|blockquote|dd|div|header|section|footer|aside|nav|dl|dt|fieldset|form|frame|frameset|h1|h2|h3|h4|h5|h6|iframe|noframes|object|ol|p|ul|applet|center|dir|hr|menu|pre)\\b)",
					"captures": {
						"1": {
							"name": "punctuation.definition.tag.html"
						},
						"2": {
							"name": "entity.name.tag.block.any.html"
						}
					},
					"end": "(>)",
					"name": "meta.tag.block.any.html",
					"patterns": [
						{
							"include": "#tag-stuff"
						}
					]
				},
				{
					"begin": "(</?)((?i:a|abbr|acronym|area|b|base|basefont|bdo|big|br|button|caption|cite|code|col|colgroup|del|dfn|em|font|head|html|i|img|input|ins|isindex|kbd|label|legend|li|link|map|meta|noscript|optgroup|option|param|q|s|samp|script|select|small|span|strike|strong|style|sub|sup|table|tbody|td|textarea|tfoot|th|thead|title|tr|tt|u|var)\\b)",
					"captures": {
						"1": {
							"name": "punctuation.definition.tag.html"
						},
						"2": {
							"name": "entity.name.tag.inline.any.html"
						}
					},
					"end": "((?: ?/)?>)",
					"name": "meta.tag.inline.any.html",
					"patterns": [
						{
							"include": "#tag-stuff"
						}
					]
				},
				{
					"begin": "(</?)([a-zA-Z0-9:-]+)",
					"captures": {
						"1": {
							"name": "punctuation.definition.tag.html"
						},
						"2": {
							"name": "entity.name.tag.other.html"
						}
					},
					"end": "(>)",
					"name": "meta.tag.other.html",
					"patterns": [
						{
							"include": "#tag-stuff"
						}
					]
				},
				{
					"begin": "(</?)([a-zA-Z0-9{}:-]+)",
					"captures": {
						"1": {
							"name": "punctuation.definition.tag.html"
						},
						"2": {
							"name": "entity.name.tag.tokenised.html"
						}
					},
					"end": "(>)",
					"name": "meta.tag.tokenised.html",
					"patterns": [
						{
							"include": "#tag-stuff"
						}
					]
				},
				{
					"include": "#entities"
				},
				{
					"match": "<>",
					"name": "invalid.illegal.incomplete.html"
				},
				{
					"match": "<",
					"name": "invalid.illegal.bad-angle-bracket.html"
				}
			]
		},
		"entities": {
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.entity.html"
						},
						"3": {
							"name": "punctuation.definition.entity.html"
						}
					},
					"name": "constant.character.entity.html",
					"match": "(&)([a-zA-Z0-9]+|#[0-9]+|#x[0-9a-fA-F]+)(;)"
				},
				{
					"name": "invalid.illegal.bad-ampersand.html",
					"match": "&"
				}
			]
		},
		"end_block": {
			"begin": "(\\{\\{)(~?/)([a-zA-Z0-9/_\\.-]+)\\s*",
			"end": "(~?\\}\\})",
			"name": "meta.function.block.end.handlebars",
			"endCaptures": {
				"1": {
					"name": "support.constant.handlebars"
				}
			},
			"beginCaptures": {
				"1": {
					"name": "support.constant.handlebars"
				},
				"2": {
					"name": "support.constant.handlebars keyword.control"
				},
				"3": {
					"name": "support.constant.handlebars keyword.control"
				}
			},
			"patterns": []
		},
		"yfm": {
			"patterns": [
				{
					"patterns": [
						{
							"include": "source.yaml"
						}
					],
					"begin": "(?<!\\s)---\\n$",
					"end": "^---\\s",
					"name": "markup.raw.yaml.front-matter"
				}
			]
		},
		"comments": {
			"patterns": [
				{
					"patterns": [
						{
							"name": "keyword.annotation.handlebars",
							"match": "@\\w*"
						},
						{
							"include": "#comments"
						}
					],
					"begin": "\\{\\{!",
					"end": "\\}\\}",
					"name": "comment.block.handlebars"
				},
				{
					"captures": {
						"0": {
							"name": "punctuation.definition.comment.html"
						}
					},
					"begin": "<!--",
					"end": "-{2,3}\\s*>",
					"name": "comment.block.html",
					"patterns": [
						{
							"name": "invalid.illegal.bad-comments-or-CDATA.html",
							"match": "--"
						}
					]
				}
			]
		},
		"block_comments": {
			"patterns": [
				{
					"patterns": [
						{
							"name": "keyword.annotation.handlebars",
							"match": "@\\w*"
						},
						{
							"include": "#comments"
						}
					],
					"begin": "\\{\\{!--",
					"end": "--\\}\\}",
					"name": "comment.block.handlebars"
				},
				{
					"captures": {
						"0": {
							"name": "punctuation.definition.comment.html"
						}
					},
					"begin": "<!--",
					"end": "-{2,3}\\s*>",
					"name": "comment.block.html",
					"patterns": [
						{
							"name": "invalid.illegal.bad-comments-or-CDATA.html",
							"match": "--"
						}
					]
				}
			]
		},
		"block_helper": {
			"begin": "(\\{\\{)(~?\\#)([-a-zA-Z0-9_\\./>]+)\\s?(@?[-a-zA-Z0-9_\\./]+)*\\s?(@?[-a-zA-Z0-9_\\./]+)*\\s?(@?[-a-zA-Z0-9_\\./]+)*",
			"end": "(~?\\}\\})",
			"name": "meta.function.block.start.handlebars",
			"endCaptures": {
				"1": {
					"name": "support.constant.handlebars"
				}
			},
			"beginCaptures": {
				"1": {
					"name": "support.constant.handlebars"
				},
				"2": {
					"name": "support.constant.handlebars keyword.control"
				},
				"3": {
					"name": "support.constant.handlebars keyword.control"
				},
				"4": {
					"name": "variable.parameter.handlebars"
				},
				"5": {
					"name": "support.constant.handlebars"
				},
				"6": {
					"name": "variable.parameter.handlebars"
				},
				"7": {
					"name": "support.constant.handlebars"
				}
			},
			"patterns": [
				{
					"include": "#string"
				},
				{
					"include": "#handlebars_attribute"
				}
			]
		},
		"string-single-quoted": {
			"begin": "'",
			"end": "'",
			"name": "string.quoted.single.handlebars",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.html"
				}
			},
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.html"
				}
			},
			"patterns": [
				{
					"include": "#escaped-single-quote"
				},
				{
					"include": "#block_comments"
				},
				{
					"include": "#comments"
				},
				{
					"include": "#block_helper"
				},
				{
					"include": "#else_token"
				},
				{
					"include": "#end_block"
				},
				{
					"include": "#partial_and_var"
				}
			]
		},
		"string": {
			"patterns": [
				{
					"include": "#string-single-quoted"
				},
				{
					"include": "#string-double-quoted"
				}
			]
		},
		"escaped-single-quote": {
			"name": "constant.character.escape.js",
			"match": "\\\\'"
		},
		"escaped-double-quote": {
			"name": "constant.character.escape.js",
			"match": "\\\\\""
		},
		"partial_and_var": {
			"begin": "(\\{\\{~?\\{*(>|!<)*)\\s*(@?[-a-zA-Z0-9$_\\./]+)*",
			"end": "(~?\\}\\}\\}*)",
			"name": "meta.function.inline.other.handlebars",
			"beginCaptures": {
				"1": {
					"name": "support.constant.handlebars"
				},
				"3": {
					"name": "variable.parameter.handlebars"
				}
			},
			"endCaptures": {
				"1": {
					"name": "support.constant.handlebars"
				}
			},
			"patterns": [
				{
					"include": "#string"
				},
				{
					"include": "#handlebars_attribute"
				}
			]
		},
		"handlebars_attribute_name": {
			"begin": "\\b([-a-zA-Z0-9_\\.]+)\\b=",
			"captures": {
				"1": {
					"name": "variable.parameter.handlebars"
				}
			},
			"end": "(?='|\"|)",
			"name": "entity.other.attribute-name.handlebars"
		},
		"handlebars_attribute_value": {
			"begin": "([-a-zA-Z0-9_\\./]+)\\b",
			"captures": {
				"1": {
					"name": "variable.parameter.handlebars"
				}
			},
			"end": "('|\"|)",
			"name": "entity.other.attribute-value.handlebars",
			"patterns": [
				{
					"include": "#string"
				}
			]
		},
		"handlebars_attribute": {
			"patterns": [
				{
					"include": "#handlebars_attribute_name"
				},
				{
					"include": "#handlebars_attribute_value"
				}
			]
		},
		"extends": {
			"patterns": [
				{
					"end": "(\\}\\})",
					"begin": "(\\{\\{!<)\\s([-a-zA-Z0-9_\\./]+)",
					"beginCaptures": {
						"1": {
							"name": "support.function.handlebars"
						},
						"2": {
							"name": "support.class.handlebars"
						}
					},
					"endCaptures": {
						"1": {
							"name": "support.function.handlebars"
						}
					},
					"name": "meta.preprocessor.handlebars"
				}
			]
		},
		"else_token": {
			"begin": "(\\{\\{)(~?else)(@?\\s(if)\\s([-a-zA-Z0-9_\\.\\(\\s\\)/]+))?",
			"end": "(~?\\}\\}\\}*)",
			"name": "meta.function.inline.else.handlebars",
			"beginCaptures": {
				"1": {
					"name": "support.constant.handlebars"
				},
				"2": {
					"name": "support.constant.handlebars keyword.control"
				},
				"3": {
					"name": "support.constant.handlebars"
				},
				"4": {
					"name": "variable.parameter.handlebars"
				}
			},
			"endCaptures": {
				"1": {
					"name": "support.constant.handlebars"
				}
			}
		},
		"string-double-quoted": {
			"begin": "\"",
			"end": "\"",
			"name": "string.quoted.double.handlebars",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.html"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.html"
				}
			},
			"patterns": [
				{
					"include": "#escaped-double-quote"
				},
				{
					"include": "#block_comments"
				},
				{
					"include": "#comments"
				},
				{
					"include": "#block_helper"
				},
				{
					"include": "#else_token"
				},
				{
					"include": "#end_block"
				},
				{
					"include": "#partial_and_var"
				}
			]
		},
		"inline_script": {
			"begin": "(?:^\\s+)?(<)((?i:script))\\b(?:.*(type)=([\"'](?:text/x-handlebars-template|text/x-handlebars|text/template|x-tmpl-handlebars)[\"']))(?![^>]*/>)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.tag.html"
				},
				"2": {
					"name": "entity.name.tag.script.html"
				},
				"3": {
					"name": "entity.other.attribute-name.html"
				},
				"4": {
					"name": "string.quoted.double.html"
				}
			},
			"end": "(?<=</(script|SCRIPT))(>)(?:\\s*\\n)?",
			"endCaptures": {
				"2": {
					"name": "punctuation.definition.tag.html"
				}
			},
			"name": "source.handlebars.embedded.html",
			"patterns": [
				{
					"include": "#tag-stuff"
				},
				{
					"begin": "(?<!</(?:script|SCRIPT))(>)",
					"captures": {
						"1": {
							"name": "punctuation.definition.tag.html"
						},
						"2": {
							"name": "entity.name.tag.script.html"
						}
					},
					"end": "(</)((?i:script))",
					"patterns": [
						{
							"include": "#block_comments"
						},
						{
							"include": "#comments"
						},
						{
							"include": "#block_helper"
						},
						{
							"include": "#end_block"
						},
						{
							"include": "#else_token"
						},
						{
							"include": "#partial_and_var"
						},
						{
							"include": "#html_tags"
						},
						{
							"include": "text.html.basic"
						}
					]
				}
			]
		},
		"tag_generic_attribute": {
			"begin": "\\b([a-zA-Z0-9_-]+)\\b\\s*(=)",
			"captures": {
				"1": {
					"name": "entity.other.attribute-name.generic.html"
				},
				"2": {
					"name": "punctuation.separator.key-value.html"
				}
			},
			"patterns": [
				{
					"include": "#string"
				}
			],
			"name": "entity.other.attribute-name.html",
			"end": "(?<='|\"|)"
		},
		"tag_id_attribute": {
			"begin": "\\b(id)\\b\\s*(=)",
			"captures": {
				"1": {
					"name": "entity.other.attribute-name.id.html"
				},
				"2": {
					"name": "punctuation.separator.key-value.html"
				}
			},
			"end": "(?<='|\"|)",
			"name": "meta.attribute-with-value.id.html",
			"patterns": [
				{
					"include": "#string"
				}
			]
		},
		"tag-stuff": {
			"patterns": [
				{
					"include": "#tag_id_attribute"
				},
				{
					"include": "#tag_generic_attribute"
				},
				{
					"include": "#string"
				},
				{
					"include": "#block_comments"
				},
				{
					"include": "#comments"
				},
				{
					"include": "#block_helper"
				},
				{
					"include": "#end_block"
				},
				{
					"include": "#else_token"
				},
				{
					"include": "#partial_and_var"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/hlsl/.vscodeignore]---
Location: vscode-main/extensions/hlsl/.vscodeignore

```text
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/hlsl/cgmanifest.json]---
Location: vscode-main/extensions/hlsl/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "shaders-tmLanguage",
					"repositoryUrl": "https://github.com/tgjones/shaders-tmLanguage",
					"commitHash": "87c0dca3a39170dbd7ee7e277db4f915fb2de14a"
				}
			},
			"license": "MIT",
			"version": "0.1.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/hlsl/language-configuration.json]---
Location: vscode-main/extensions/hlsl/language-configuration.json

```json
{
	"comments": {
		"lineComment": "//",
		"blockComment": [ "/*", "*/" ]
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
		["\"", "\""]
	],
	"surroundingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["\"", "\""]
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/hlsl/package.json]---
Location: vscode-main/extensions/hlsl/package.json

```json
{
  "name": "hlsl",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin tgjones/shaders-tmLanguage grammars/hlsl.json ./syntaxes/hlsl.tmLanguage.json"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "hlsl",
        "extensions": [
          ".hlsl",
          ".hlsli",
          ".fx",
          ".fxh",
          ".vsh",
          ".psh",
          ".cginc",
          ".compute"
        ],
        "aliases": [
          "HLSL",
          "hlsl"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "hlsl",
        "path": "./syntaxes/hlsl.tmLanguage.json",
        "scopeName": "source.hlsl"
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

---[FILE: extensions/hlsl/package.nls.json]---
Location: vscode-main/extensions/hlsl/package.nls.json

```json
{
	"displayName": "HLSL Language Basics",
	"description": "Provides syntax highlighting and bracket matching in HLSL files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/hlsl/syntaxes/hlsl.tmLanguage.json]---
Location: vscode-main/extensions/hlsl/syntaxes/hlsl.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/tgjones/shaders-tmLanguage/blob/master/grammars/hlsl.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/tgjones/shaders-tmLanguage/commit/87c0dca3a39170dbd7ee7e277db4f915fb2de14a",
	"name": "HLSL",
	"scopeName": "source.hlsl",
	"patterns": [
		{
			"name": "comment.line.block.hlsl",
			"begin": "/\\*",
			"end": "\\*/"
		},
		{
			"name": "comment.line.double-slash.hlsl",
			"begin": "//",
			"end": "$"
		},
		{
			"name": "constant.numeric.decimal.hlsl",
			"match": "\\b[0-9]+\\.[0-9]*(F|f)?\\b"
		},
		{
			"name": "constant.numeric.decimal.hlsl",
			"match": "(\\.([0-9]+)(F|f)?)\\b"
		},
		{
			"name": "constant.numeric.decimal.hlsl",
			"match": "\\b([0-9]+(F|f)?)\\b"
		},
		{
			"name": "constant.numeric.hex.hlsl",
			"match": "\\b(0(x|X)[0-9a-fA-F]+)\\b"
		},
		{
			"name": "constant.language.hlsl",
			"match": "\\b(false|true)\\b"
		},
		{
			"name": "keyword.preprocessor.hlsl",
			"match": "^\\s*#\\s*(define|elif|else|endif|ifdef|ifndef|if|undef|include|line|error|pragma)"
		},
		{
			"name": "keyword.control.hlsl",
			"match": "\\b(break|case|continue|default|discard|do|else|for|if|return|switch|while)\\b"
		},
		{
			"name": "keyword.control.fx.hlsl",
			"match": "\\b(compile)\\b"
		},
		{
			"name": "keyword.typealias.hlsl",
			"match": "\\b(typedef)\\b"
		},
		{
			"name": "storage.type.basic.hlsl",
			"match": "\\b(bool([1-4](x[1-4])?)?|double([1-4](x[1-4])?)?|dword|float([1-4](x[1-4])?)?|half([1-4](x[1-4])?)?|int([1-4](x[1-4])?)?|matrix|min10float([1-4](x[1-4])?)?|min12int([1-4](x[1-4])?)?|min16float([1-4](x[1-4])?)?|min16int([1-4](x[1-4])?)?|min16uint([1-4](x[1-4])?)?|unsigned|uint([1-4](x[1-4])?)?|vector|void)\\b"
		},
		{
			"name": "support.function.hlsl",
			"match": "\\b([a-zA-Z_][a-zA-Z0-9_]*)(?=[\\s]*\\()"
		},
		{
			"name": "support.variable.semantic.hlsl",
			"match": "(?<=\\:\\s|\\:)(?i:BINORMAL[0-9]*|BLENDINDICES[0-9]*|BLENDWEIGHT[0-9]*|COLOR[0-9]*|NORMAL[0-9]*|POSITIONT|POSITION|PSIZE[0-9]*|TANGENT[0-9]*|TEXCOORD[0-9]*|FOG|TESSFACTOR[0-9]*|VFACE|VPOS|DEPTH[0-9]*)\\b"
		},
		{
			"name": "support.variable.semantic.sm4.hlsl",
			"match": "(?<=\\:\\s|\\:)(?i:SV_ClipDistance[0-9]*|SV_CullDistance[0-9]*|SV_Coverage|SV_Depth|SV_DepthGreaterEqual[0-9]*|SV_DepthLessEqual[0-9]*|SV_InstanceID|SV_IsFrontFace|SV_Position|SV_RenderTargetArrayIndex|SV_SampleIndex|SV_StencilRef|SV_Target[0-7]?|SV_VertexID|SV_ViewportArrayIndex)\\b"
		},
		{
			"name": "support.variable.semantic.sm5.hlsl",
			"match": "(?<=\\:\\s|\\:)(?i:SV_DispatchThreadID|SV_DomainLocation|SV_GroupID|SV_GroupIndex|SV_GroupThreadID|SV_GSInstanceID|SV_InsideTessFactor|SV_OutputControlPointID|SV_TessFactor)\\b"
		},
		{
			"name": "support.variable.semantic.sm5_1.hlsl",
			"match": "(?<=\\:\\s|\\:)(?i:SV_InnerCoverage|SV_StencilRef)\\b"
		},
		{
			"name": "storage.modifier.hlsl",
			"match": "\\b(column_major|const|export|extern|globallycoherent|groupshared|inline|inout|in|out|precise|row_major|shared|static|uniform|volatile)\\b"
		},
		{
			"name": "storage.modifier.float.hlsl",
			"match": "\\b(snorm|unorm)\\b"
		},
		{
			"name": "storage.modifier.postfix.hlsl",
			"match": "\\b(packoffset|register)\\b"
		},
		{
			"name": "storage.modifier.interpolation.hlsl",
			"match": "\\b(centroid|linear|nointerpolation|noperspective|sample)\\b"
		},
		{
			"name": "storage.modifier.geometryshader.hlsl",
			"match": "\\b(lineadj|line|point|triangle|triangleadj)\\b"
		},
		{
			"name": "support.type.other.hlsl",
			"match": "\\b(string)\\b"
		},
		{
			"name": "support.type.object.hlsl",
			"match": "\\b(AppendStructuredBuffer|Buffer|ByteAddressBuffer|ConstantBuffer|ConsumeStructuredBuffer|InputPatch|OutputPatch)\\b"
		},
		{
			"name": "support.type.object.rasterizerordered.hlsl",
			"match": "\\b(RasterizerOrderedBuffer|RasterizerOrderedByteAddressBuffer|RasterizerOrderedStructuredBuffer|RasterizerOrderedTexture1D|RasterizerOrderedTexture1DArray|RasterizerOrderedTexture2D|RasterizerOrderedTexture2DArray|RasterizerOrderedTexture3D)\\b"
		},
		{
			"name": "support.type.object.rw.hlsl",
			"match": "\\b(RWBuffer|RWByteAddressBuffer|RWStructuredBuffer|RWTexture1D|RWTexture1DArray|RWTexture2D|RWTexture2DArray|RWTexture3D)\\b"
		},
		{
			"name": "support.type.object.geometryshader.hlsl",
			"match": "\\b(LineStream|PointStream|TriangleStream)\\b"
		},
		{
			"name": "support.type.sampler.legacy.hlsl",
			"match": "\\b(sampler|sampler1D|sampler2D|sampler3D|samplerCUBE|sampler_state)\\b"
		},
		{
			"name": "support.type.sampler.hlsl",
			"match": "\\b(SamplerState|SamplerComparisonState)\\b"
		},
		{
			"name": "support.type.texture.legacy.hlsl",
			"match": "\\b(texture2D|textureCUBE)\\b"
		},
		{
			"name": "support.type.texture.hlsl",
			"match": "\\b(Texture1D|Texture1DArray|Texture2D|Texture2DArray|Texture2DMS|Texture2DMSArray|Texture3D|TextureCube|TextureCubeArray)\\b"
		},
		{
			"name": "storage.type.structured.hlsl",
			"match": "\\b(cbuffer|class|interface|namespace|struct|tbuffer)\\b"
		},
		{
			"name": "support.constant.property-value.fx.hlsl",
			"match": "\\b(FALSE|TRUE|NULL)\\b"
		},
		{
			"name": "support.type.fx.hlsl",
			"match": "\\b(BlendState|DepthStencilState|RasterizerState)\\b"
		},
		{
			"name": "storage.type.fx.technique.hlsl",
			"match": "\\b(technique|Technique|technique10|technique11|pass)\\b"
		},
		{
			"name": "meta.object-literal.key.fx.blendstate.hlsl",
			"match": "\\b(AlphaToCoverageEnable|BlendEnable|SrcBlend|DestBlend|BlendOp|SrcBlendAlpha|DestBlendAlpha|BlendOpAlpha|RenderTargetWriteMask)\\b"
		},
		{
			"name": "meta.object-literal.key.fx.depthstencilstate.hlsl",
			"match": "\\b(DepthEnable|DepthWriteMask|DepthFunc|StencilEnable|StencilReadMask|StencilWriteMask|FrontFaceStencilFail|FrontFaceStencilZFail|FrontFaceStencilPass|FrontFaceStencilFunc|BackFaceStencilFail|BackFaceStencilZFail|BackFaceStencilPass|BackFaceStencilFunc)\\b"
		},
		{
			"name": "meta.object-literal.key.fx.rasterizerstate.hlsl",
			"match": "\\b(FillMode|CullMode|FrontCounterClockwise|DepthBias|DepthBiasClamp|SlopeScaleDepthBias|ZClipEnable|ScissorEnable|MultiSampleEnable|AntiAliasedLineEnable)\\b"
		},
		{
			"name": "meta.object-literal.key.fx.samplerstate.hlsl",
			"match": "\\b(Filter|AddressU|AddressV|AddressW|MipLODBias|MaxAnisotropy|ComparisonFunc|BorderColor|MinLOD|MaxLOD)\\b"
		},
		{
			"name": "support.constant.property-value.fx.blend.hlsl",
			"match": "\\b(?i:ZERO|ONE|SRC_COLOR|INV_SRC_COLOR|SRC_ALPHA|INV_SRC_ALPHA|DEST_ALPHA|INV_DEST_ALPHA|DEST_COLOR|INV_DEST_COLOR|SRC_ALPHA_SAT|BLEND_FACTOR|INV_BLEND_FACTOR|SRC1_COLOR|INV_SRC1_COLOR|SRC1_ALPHA|INV_SRC1_ALPHA)\\b"
		},
		{
			"name": "support.constant.property-value.fx.blendop.hlsl",
			"match": "\\b(?i:ADD|SUBTRACT|REV_SUBTRACT|MIN|MAX)\\b"
		},
		{
			"name": "support.constant.property-value.fx.depthwritemask.hlsl",
			"match": "\\b(?i:ALL)\\b"
		},
		{
			"name": "support.constant.property-value.fx.comparisonfunc.hlsl",
			"match": "\\b(?i:NEVER|LESS|EQUAL|LESS_EQUAL|GREATER|NOT_EQUAL|GREATER_EQUAL|ALWAYS)\\b"
		},
		{
			"name": "support.constant.property-value.fx.stencilop.hlsl",
			"match": "\\b(?i:KEEP|REPLACE|INCR_SAT|DECR_SAT|INVERT|INCR|DECR)\\b"
		},
		{
			"name": "support.constant.property-value.fx.fillmode.hlsl",
			"match": "\\b(?i:WIREFRAME|SOLID)\\b"
		},
		{
			"name": "support.constant.property-value.fx.cullmode.hlsl",
			"match": "\\b(?i:NONE|FRONT|BACK)\\b"
		},
		{
			"name": "support.constant.property-value.fx.filter.hlsl",
			"match": "\\b(?i:MIN_MAG_MIP_POINT|MIN_MAG_POINT_MIP_LINEAR|MIN_POINT_MAG_LINEAR_MIP_POINT|MIN_POINT_MAG_MIP_LINEAR|MIN_LINEAR_MAG_MIP_POINT|MIN_LINEAR_MAG_POINT_MIP_LINEAR|MIN_MAG_LINEAR_MIP_POINT|MIN_MAG_MIP_LINEAR|ANISOTROPIC|COMPARISON_MIN_MAG_MIP_POINT|COMPARISON_MIN_MAG_POINT_MIP_LINEAR|COMPARISON_MIN_POINT_MAG_LINEAR_MIP_POINT|COMPARISON_MIN_POINT_MAG_MIP_LINEAR|COMPARISON_MIN_LINEAR_MAG_MIP_POINT|COMPARISON_MIN_LINEAR_MAG_POINT_MIP_LINEAR|COMPARISON_MIN_MAG_LINEAR_MIP_POINT|COMPARISON_MIN_MAG_MIP_LINEAR|COMPARISON_ANISOTROPIC|TEXT_1BIT)\\b"
		},
		{
			"name": "support.constant.property-value.fx.textureaddressmode.hlsl",
			"match": "\\b(?i:WRAP|MIRROR|CLAMP|BORDER|MIRROR_ONCE)\\b"
		},
		{
			"name": "string.quoted.double.hlsl",
			"begin": "\"",
			"end": "\"",
			"patterns": [
				{
					"name": "constant.character.escape.hlsl",
					"match": "\\\\."
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html/.vscodeignore]---
Location: vscode-main/extensions/html/.vscodeignore

```text
build/**
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/html/cgmanifest.json]---
Location: vscode-main/extensions/html/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "textmate/html.tmbundle",
					"repositoryUrl": "https://github.com/textmate/html.tmbundle",
					"commitHash": "0c3d5ee54de3a993f747f54186b73a4d2d3c44a2"
				}
			},
			"licenseDetail": [
				"Copyright (c) textmate-html.tmbundle project authors",
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

---[FILE: extensions/html/language-configuration.json]---
Location: vscode-main/extensions/html/language-configuration.json

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
		{ "open": "\"", "close": "\"" },
		{ "open": "<!--", "close": "-->", "notIn": [ "comment", "string" ]}
	],
	"surroundingPairs": [
		{ "open": "'", "close": "'" },
		{ "open": "\"", "close": "\"" },
		{ "open": "{", "close": "}"},
		{ "open": "[", "close": "]"},
		{ "open": "(", "close": ")" },
		{ "open": "<", "close": ">" }
	],
	"colorizedBracketPairs": [
	],
	"folding": {
		"markers": {
			"start": "^\\s*<!--\\s*#region\\b.*-->",
			"end": "^\\s*<!--\\s*#endregion\\b.*-->"
		}
	},
	"wordPattern": "(-?\\d*\\.\\d\\w*)|([^\\`\\~\\!\\@\\$\\^\\&\\*\\(\\)\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\'\\\"\\,\\.\\<\\>\\/\\s]+)",
	"onEnterRules": [
		{
			"beforeText": { "pattern": "<(?!(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr))([_:\\w][_:\\w-.\\d]*)(?:(?:[^'\"/>]|\"[^\"]*\"|'[^']*')*?(?!\\/)>)[^<]*$", "flags": "i" },
			"afterText": { "pattern": "^<\\/([_:\\w][_:\\w-.\\d]*)\\s*>", "flags": "i" },
			"action": {
				"indent": "indentOutdent"
			}
		},
		{
			"beforeText": { "pattern": "<(?!(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr))([_:\\w][_:\\w-.\\d]*)(?:(?:[^'\"/>]|\"[^\"]*\"|'[^']*')*?(?!\\/)>)[^<]*$", "flags": "i" },
			"action": {
				"indent": "indent"
			}
		}
	],
	"indentationRules": {
		"increaseIndentPattern": "<(?!\\?|(?:area|base|br|col|frame|hr|html|img|input|keygen|link|menuitem|meta|param|source|track|wbr)\\b|[^>]*\\/>)([-_\\.A-Za-z0-9]+)(?=\\s|>)\\b[^>]*>(?!.*<\\/\\1>)|<!--(?!.*-->)|\\{[^}\"']*$",
		"decreaseIndentPattern": "^\\s*(<\\/(?!html)[-_\\.A-Za-z0-9]+\\b[^>]*>|-->|\\})"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html/package.json]---
Location: vscode-main/extensions/html/package.json

```json
{
  "name": "html",
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
        "id": "html",
        "extensions": [
          ".html",
          ".htm",
          ".shtml",
          ".xhtml",
          ".xht",
          ".mdoc",
          ".jsp",
          ".asp",
          ".aspx",
          ".jshtm",
          ".volt",
          ".ejs",
          ".rhtml"
        ],
        "aliases": [
          "HTML",
          "htm",
          "html",
          "xhtml"
        ],
        "mimetypes": [
          "text/html",
          "text/x-jshtm",
          "text/template",
          "text/ng-template",
          "application/xhtml+xml"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "scopeName": "text.html.basic",
        "path": "./syntaxes/html.tmLanguage.json",
        "embeddedLanguages": {
          "text.html": "html",
          "source.css": "css",
          "source.js": "javascript",
          "source.python": "python",
          "source.smarty": "smarty"
        },
        "tokenTypes": {
          "meta.tag string.quoted": "other"
        }
      },
      {
        "language": "html",
        "scopeName": "text.html.derivative",
        "path": "./syntaxes/html-derivative.tmLanguage.json",
        "embeddedLanguages": {
          "text.html": "html",
          "source.css": "css",
          "source.js": "javascript",
          "source.python": "python",
          "source.smarty": "smarty"
        },
        "tokenTypes": {
          "meta.tag string.quoted": "other"
        }
      }
    ],
    "snippets": [
      {
        "language": "html",
        "path": "./snippets/html.code-snippets"
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

---[FILE: extensions/html/package.nls.json]---
Location: vscode-main/extensions/html/package.nls.json

```json
{
	"displayName": "HTML Language Basics",
	"description": "Provides syntax highlighting, bracket matching & snippets in HTML files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html/build/update-grammar.mjs]---
Location: vscode-main/extensions/html/build/update-grammar.mjs

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check

import * as vscodeGrammarUpdater from 'vscode-grammar-updater';

function patchGrammar(grammar) {
	let patchCount = 0;

	let visit = function (rule, parent) {
		if (rule.name === 'source.js' || rule.name === 'source.css') {
			if (parent.node[0].name !== 'punctuation.definition.string.end.html' && parent.parent && parent.parent.property === 'endCaptures') {
				rule.name = rule.name + '-ignored-vscode';
				patchCount++;
			}
		}
		for (let property in rule) {
			let value = rule[property];
			if (typeof value === 'object') {
				visit(value, { node: rule, property: property, parent: parent });
			}
		}
	};

	let repository = grammar.repository;
	for (let key in repository) {
		visit(repository[key], { node: repository, property: key, parent: undefined });
	}
	if (patchCount !== 2) {
		console.warn(`Expected to patch 2 occurrences of source.js & source.css: Was ${patchCount}`);
	}

	return grammar;
}

function patchGrammarDerivative(grammar) {
	let patchCount = 0;

	let patterns = grammar.patterns;
	for (let key in patterns) {
		if (patterns[key]?.name === 'meta.tag.other.unrecognized.html.derivative' && patterns[key]?.begin === '(</?)(\\w[^\\s>]*)(?<!/)') {
			patterns[key].begin = '(</?)(\\w[^\\s<>]*)(?<!/)';
			patchCount++;
		}
	}
	if (patchCount !== 1) {
		console.warn(`Expected to do 1 patch: Was ${patchCount}`);
	}

	return grammar;
}

const tsGrammarRepo = 'textmate/html.tmbundle';
const grammarPath = 'Syntaxes/HTML.plist';
vscodeGrammarUpdater.update(tsGrammarRepo, grammarPath, './syntaxes/html.tmLanguage.json', grammar => patchGrammar(grammar));

const grammarDerivativePath = 'Syntaxes/HTML%20%28Derivative%29.tmLanguage';
vscodeGrammarUpdater.update(tsGrammarRepo, grammarDerivativePath, './syntaxes/html-derivative.tmLanguage.json', grammar => patchGrammarDerivative(grammar));
```

--------------------------------------------------------------------------------

---[FILE: extensions/html/snippets/html.code-snippets]---
Location: vscode-main/extensions/html/snippets/html.code-snippets

```text
{
	"html doc": {
		"isFileTemplate": true,
		"body": [
			"<!DOCTYPE html>",
			"<html>",
			"<head>",
			"\t<meta charset=\"UTF-8\" />",
			"\t<title>${1:title}</title>",
			"</head>",
			"<body>",
			"\t$0",
			"</body>",
			"</html>"
		],
		"description": "HTML Document"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html/syntaxes/html-derivative.tmLanguage.json]---
Location: vscode-main/extensions/html/syntaxes/html-derivative.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/textmate/html.tmbundle/blob/master/Syntaxes/HTML%20%28Derivative%29.tmLanguage",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/textmate/html.tmbundle/commit/390c8870273a2ae80244dae6db6ba064a802f407",
	"name": "HTML (Derivative)",
	"scopeName": "text.html.derivative",
	"injections": {
		"R:text.html - (comment.block, text.html meta.embedded, meta.tag.*.*.html, meta.tag.*.*.*.html, meta.tag.*.*.*.*.html)": {
			"comment": "Uses R: to ensure this matches after any other injections.",
			"patterns": [
				{
					"match": "<",
					"name": "invalid.illegal.bad-angle-bracket.html"
				}
			]
		}
	},
	"patterns": [
		{
			"include": "text.html.basic#core-minus-invalid"
		},
		{
			"begin": "(</?)(\\w[^\\s<>]*)(?<!/)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.tag.begin.html"
				},
				"2": {
					"name": "entity.name.tag.html"
				}
			},
			"end": "((?: ?/)?>)",
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.tag.end.html"
				}
			},
			"name": "meta.tag.other.unrecognized.html.derivative",
			"patterns": [
				{
					"include": "text.html.basic#attribute"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html/syntaxes/html.tmLanguage.json]---
Location: vscode-main/extensions/html/syntaxes/html.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/textmate/html.tmbundle/blob/master/Syntaxes/HTML.plist",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/textmate/html.tmbundle/commit/0c3d5ee54de3a993f747f54186b73a4d2d3c44a2",
	"name": "HTML",
	"scopeName": "text.html.basic",
	"injections": {
		"R:text.html - (comment.block, text.html meta.embedded, meta.tag.*.*.html, meta.tag.*.*.*.html, meta.tag.*.*.*.*.html)": {
			"comment": "Uses R: to ensure this matches after any other injections.",
			"patterns": [
				{
					"match": "<",
					"name": "invalid.illegal.bad-angle-bracket.html"
				}
			]
		}
	},
	"patterns": [
		{
			"include": "#xml-processing"
		},
		{
			"include": "#comment"
		},
		{
			"include": "#doctype"
		},
		{
			"include": "#cdata"
		},
		{
			"include": "#tags-valid"
		},
		{
			"include": "#tags-invalid"
		},
		{
			"include": "#entities"
		}
	],
	"repository": {
		"attribute": {
			"patterns": [
				{
					"begin": "(s(hape|cope|t(ep|art)|ize(s)?|p(ellcheck|an)|elected|lot|andbox|rc(set|doc|lang)?)|h(ttp-equiv|i(dden|gh)|e(ight|aders)|ref(lang)?)|n(o(nce|validate|module)|ame)|c(h(ecked|arset)|ite|o(nt(ent(editable)?|rols)|ords|l(s(pan)?|or))|lass|rossorigin)|t(ype(mustmatch)?|itle|a(rget|bindex)|ranslate)|i(s(map)?|n(tegrity|putmode)|tem(scope|type|id|prop|ref)|d)|op(timum|en)|d(i(sabled|r(name)?)|ownload|e(coding|f(er|ault))|at(etime|a)|raggable)|usemap|p(ing|oster|la(ysinline|ceholder)|attern|reload)|enctype|value|kind|for(m(novalidate|target|enctype|action|method)?)?|w(idth|rap)|l(ist|o(op|w)|a(ng|bel))|a(s(ync)?|c(ce(sskey|pt(-charset)?)|tion)|uto(c(omplete|apitalize)|play|focus)|l(t|low(usermedia|paymentrequest|fullscreen))|bbr)|r(ows(pan)?|e(versed|quired|ferrerpolicy|l|adonly))|m(in(length)?|u(ted|ltiple)|e(thod|dia)|a(nifest|x(length)?)))(?![\\w:-])",
					"beginCaptures": {
						"0": {
							"name": "entity.other.attribute-name.html"
						}
					},
					"comment": "HTML5 attributes, not event handlers",
					"end": "(?=\\s*+[^=\\s])",
					"name": "meta.attribute.$1.html",
					"patterns": [
						{
							"include": "#attribute-interior"
						}
					]
				},
				{
					"begin": "style(?![\\w:-])",
					"beginCaptures": {
						"0": {
							"name": "entity.other.attribute-name.html"
						}
					},
					"comment": "HTML5 style attribute",
					"end": "(?=\\s*+[^=\\s])",
					"name": "meta.attribute.style.html",
					"patterns": [
						{
							"begin": "=",
							"beginCaptures": {
								"0": {
									"name": "punctuation.separator.key-value.html"
								}
							},
							"end": "(?<=[^\\s=])(?!\\s*=)|(?=/?>)",
							"patterns": [
								{
									"begin": "(?=[^\\s=<>`/]|/(?!>))",
									"end": "(?!\\G)",
									"name": "meta.embedded.line.css",
									"patterns": [
										{
											"captures": {
												"0": {
													"name": "source.css"
												}
											},
											"match": "([^\\s\"'=<>`/]|/(?!>))+",
											"name": "string.unquoted.html"
										},
										{
											"begin": "\"",
											"beginCaptures": {
												"0": {
													"name": "punctuation.definition.string.begin.html"
												}
											},
											"contentName": "source.css",
											"end": "(\")",
											"endCaptures": {
												"0": {
													"name": "punctuation.definition.string.end.html"
												},
												"1": {
													"name": "source.css"
												}
											},
											"name": "string.quoted.double.html",
											"patterns": [
												{
													"include": "#entities"
												}
											]
										},
										{
											"begin": "'",
											"beginCaptures": {
												"0": {
													"name": "punctuation.definition.string.begin.html"
												}
											},
											"contentName": "source.css",
											"end": "(')",
											"endCaptures": {
												"0": {
													"name": "punctuation.definition.string.end.html"
												},
												"1": {
													"name": "source.css"
												}
											},
											"name": "string.quoted.single.html",
											"patterns": [
												{
													"include": "#entities"
												}
											]
										}
									]
								},
								{
									"match": "=",
									"name": "invalid.illegal.unexpected-equals-sign.html"
								}
							]
						}
					]
				},
				{
					"begin": "on(s(croll|t(orage|alled)|u(spend|bmit)|e(curitypolicyviolation|ek(ing|ed)|lect))|hashchange|c(hange|o(ntextmenu|py)|u(t|echange)|l(ick|ose)|an(cel|play(through)?))|t(imeupdate|oggle)|in(put|valid)|o(nline|ffline)|d(urationchange|r(op|ag(start|over|e(n(ter|d)|xit)|leave)?)|blclick)|un(handledrejection|load)|p(opstate|lay(ing)?|a(ste|use|ge(show|hide))|rogress)|e(nded|rror|mptied)|volumechange|key(down|up|press)|focus|w(heel|aiting)|l(oad(start|e(nd|d(data|metadata)))?|anguagechange)|a(uxclick|fterprint|bort)|r(e(s(ize|et)|jectionhandled)|atechange)|m(ouse(o(ut|ver)|down|up|enter|leave|move)|essage(error)?)|b(efore(unload|print)|lur))(?![\\w:-])",
					"beginCaptures": {
						"0": {
							"name": "entity.other.attribute-name.html"
						}
					},
					"comment": "HTML5 attributes, event handlers",
					"end": "(?=\\s*+[^=\\s])",
					"name": "meta.attribute.event-handler.$1.html",
					"patterns": [
						{
							"begin": "=",
							"beginCaptures": {
								"0": {
									"name": "punctuation.separator.key-value.html"
								}
							},
							"end": "(?<=[^\\s=])(?!\\s*=)|(?=/?>)",
							"patterns": [
								{
									"begin": "(?=[^\\s=<>`/]|/(?!>))",
									"end": "(?!\\G)",
									"name": "meta.embedded.line.js",
									"patterns": [
										{
											"captures": {
												"0": {
													"name": "source.js"
												},
												"1": {
													"patterns": [
														{
															"include": "source.js"
														}
													]
												}
											},
											"match": "(([^\\s\"'=<>`/]|/(?!>))+)",
											"name": "string.unquoted.html"
										},
										{
											"begin": "\"",
											"beginCaptures": {
												"0": {
													"name": "punctuation.definition.string.begin.html"
												}
											},
											"contentName": "source.js",
											"end": "(\")",
											"endCaptures": {
												"0": {
													"name": "punctuation.definition.string.end.html"
												},
												"1": {
													"name": "source.js"
												}
											},
											"name": "string.quoted.double.html",
											"patterns": [
												{
													"captures": {
														"0": {
															"patterns": [
																{
																	"include": "source.js"
																}
															]
														}
													},
													"match": "([^\\n\"/]|/(?![/*]))+"
												},
												{
													"begin": "//",
													"beginCaptures": {
														"0": {
															"name": "punctuation.definition.comment.js"
														}
													},
													"end": "(?=\")|\\n",
													"name": "comment.line.double-slash.js"
												},
												{
													"begin": "/\\*",
													"beginCaptures": {
														"0": {
															"name": "punctuation.definition.comment.begin.js"
														}
													},
													"end": "(?=\")|\\*/",
													"endCaptures": {
														"0": {
															"name": "punctuation.definition.comment.end.js"
														}
													},
													"name": "comment.block.js"
												}
											]
										},
										{
											"begin": "'",
											"beginCaptures": {
												"0": {
													"name": "punctuation.definition.string.begin.html"
												}
											},
											"contentName": "source.js",
											"end": "(')",
											"endCaptures": {
												"0": {
													"name": "punctuation.definition.string.end.html"
												},
												"1": {
													"name": "source.js"
												}
											},
											"name": "string.quoted.single.html",
											"patterns": [
												{
													"captures": {
														"0": {
															"patterns": [
																{
																	"include": "source.js"
																}
															]
														}
													},
													"match": "([^\\n'/]|/(?![/*]))+"
												},
												{
													"begin": "//",
													"beginCaptures": {
														"0": {
															"name": "punctuation.definition.comment.js"
														}
													},
													"end": "(?=')|\\n",
													"name": "comment.line.double-slash.js"
												},
												{
													"begin": "/\\*",
													"beginCaptures": {
														"0": {
															"name": "punctuation.definition.comment.begin.js"
														}
													},
													"end": "(?=')|\\*/",
													"endCaptures": {
														"0": {
															"name": "punctuation.definition.comment.end.js"
														}
													},
													"name": "comment.block.js"
												}
											]
										}
									]
								},
								{
									"match": "=",
									"name": "invalid.illegal.unexpected-equals-sign.html"
								}
							]
						}
					]
				},
				{
					"begin": "(data-[a-z\\-]+)(?![\\w:-])",
					"beginCaptures": {
						"0": {
							"name": "entity.other.attribute-name.html"
						}
					},
					"comment": "HTML5 attributes, data-*",
					"end": "(?=\\s*+[^=\\s])",
					"name": "meta.attribute.data-x.$1.html",
					"patterns": [
						{
							"include": "#attribute-interior"
						}
					]
				},
				{
					"begin": "(align|bgcolor|border)(?![\\w:-])",
					"beginCaptures": {
						"0": {
							"name": "invalid.deprecated.entity.other.attribute-name.html"
						}
					},
					"comment": "HTML attributes, deprecated",
					"end": "(?=\\s*+[^=\\s])",
					"name": "meta.attribute.$1.html",
					"patterns": [
						{
							"include": "#attribute-interior"
						}
					]
				},
				{
					"begin": "([^\\x{0020}\"'<>/=\\x{0000}-\\x{001F}\\x{007F}-\\x{009F}\\x{FDD0}-\\x{FDEF}\\x{FFFE}\\x{FFFF}\\x{1FFFE}\\x{1FFFF}\\x{2FFFE}\\x{2FFFF}\\x{3FFFE}\\x{3FFFF}\\x{4FFFE}\\x{4FFFF}\\x{5FFFE}\\x{5FFFF}\\x{6FFFE}\\x{6FFFF}\\x{7FFFE}\\x{7FFFF}\\x{8FFFE}\\x{8FFFF}\\x{9FFFE}\\x{9FFFF}\\x{AFFFE}\\x{AFFFF}\\x{BFFFE}\\x{BFFFF}\\x{CFFFE}\\x{CFFFF}\\x{DFFFE}\\x{DFFFF}\\x{EFFFE}\\x{EFFFF}\\x{FFFFE}\\x{FFFFF}\\x{10FFFE}\\x{10FFFF}]+)",
					"beginCaptures": {
						"0": {
							"name": "entity.other.attribute-name.html"
						}
					},
					"comment": "Anything else that is valid",
					"end": "(?=\\s*+[^=\\s])",
					"name": "meta.attribute.unrecognized.$1.html",
					"patterns": [
						{
							"include": "#attribute-interior"
						}
					]
				},
				{
					"match": "[^\\s>]+",
					"name": "invalid.illegal.character-not-allowed-here.html"
				}
			]
		},
		"attribute-interior": {
			"patterns": [
				{
					"begin": "=",
					"beginCaptures": {
						"0": {
							"name": "punctuation.separator.key-value.html"
						}
					},
					"end": "(?<=[^\\s=])(?!\\s*=)|(?=/?>)",
					"patterns": [
						{
							"match": "([^\\s\"'=<>`/]|/(?!>))+",
							"name": "string.unquoted.html"
						},
						{
							"begin": "\"",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.string.begin.html"
								}
							},
							"end": "\"",
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.string.end.html"
								}
							},
							"name": "string.quoted.double.html",
							"patterns": [
								{
									"include": "#entities"
								}
							]
						},
						{
							"begin": "'",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.string.begin.html"
								}
							},
							"end": "'",
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.string.end.html"
								}
							},
							"name": "string.quoted.single.html",
							"patterns": [
								{
									"include": "#entities"
								}
							]
						},
						{
							"match": "=",
							"name": "invalid.illegal.unexpected-equals-sign.html"
						}
					]
				}
			]
		},
		"cdata": {
			"begin": "<!\\[CDATA\\[",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.tag.begin.html"
				}
			},
			"contentName": "string.other.inline-data.html",
			"end": "]]>",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.tag.end.html"
				}
			},
			"name": "meta.tag.metadata.cdata.html"
		},
		"comment": {
			"begin": "<!--",
			"captures": {
				"0": {
					"name": "punctuation.definition.comment.html"
				}
			},
			"end": "-->",
			"name": "comment.block.html",
			"patterns": [
				{
					"match": "\\G-?>",
					"name": "invalid.illegal.characters-not-allowed-here.html"
				},
				{
					"match": "<!--(?!>)|<!-(?=-->)",
					"name": "invalid.illegal.characters-not-allowed-here.html"
				},
				{
					"match": "--!>",
					"name": "invalid.illegal.characters-not-allowed-here.html"
				}
			]
		},
		"core-minus-invalid": {
			"comment": "This should be the root pattern array includes minus #tags-invalid",
			"patterns": [
				{
					"include": "#xml-processing"
				},
				{
					"include": "#comment"
				},
				{
					"include": "#doctype"
				},
				{
					"include": "#cdata"
				},
				{
					"include": "#tags-valid"
				},
				{
					"include": "#entities"
				}
			]
		},
		"doctype": {
			"begin": "<!(?=(?i:DOCTYPE\\s))",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.tag.begin.html"
				}
			},
			"end": ">",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.tag.end.html"
				}
			},
			"name": "meta.tag.metadata.doctype.html",
			"patterns": [
				{
					"match": "\\G(?i:DOCTYPE)",
					"name": "entity.name.tag.html"
				},
				{
					"begin": "\"",
					"end": "\"",
					"name": "string.quoted.double.html"
				},
				{
					"match": "[^\\s>]+",
					"name": "entity.other.attribute-name.html"
				}
			]
		},
		"entities": {
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.entity.html"
						},
						"912": {
							"name": "punctuation.definition.entity.html"
						}
					},
					"comment": "Yes this is a bit ridiculous, there are quite a lot of these",
					"match": "(?x)\n\t\t\t\t\t\t(&)\t(?=[a-zA-Z])\n\t\t\t\t\t\t(\n\t\t\t\t\t\t\t(a(s(ymp(eq)?|cr|t)|n(d(slope|d|v|and)?|g(s(t|ph)|zarr|e|le|rt(vb(d)?)?|msd(a(h|c|d|e|f|a|g|b))?)?)|c(y|irc|d|ute|E)?|tilde|o(pf|gon)|uml|p(id|os|prox(eq)?|e|E|acir)?|elig|f(r)?|w(conint|int)|l(pha|e(ph|fsym))|acute|ring|grave|m(p|a(cr|lg))|breve)|A(s(sign|cr)|nd|MP|c(y|irc)|tilde|o(pf|gon)|uml|pplyFunction|fr|Elig|lpha|acute|ring|grave|macr|breve))\n\t\t\t\t\t\t  | (B(scr|cy|opf|umpeq|e(cause|ta|rnoullis)|fr|a(ckslash|r(v|wed))|reve)|b(s(cr|im(e)?|ol(hsub|b)?|emi)|n(ot|e(quiv)?)|c(y|ong)|ig(s(tar|qcup)|c(irc|up|ap)|triangle(down|up)|o(times|dot|plus)|uplus|vee|wedge)|o(t(tom)?|pf|wtie|x(h(d|u|D|U)?|times|H(d|u|D|U)?|d(R|l|r|L)|u(R|l|r|L)|plus|D(R|l|r|L)|v(R|h|H|l|r|L)?|U(R|l|r|L)|V(R|h|H|l|r|L)?|minus|box))|Not|dquo|u(ll(et)?|mp(e(q)?|E)?)|prime|e(caus(e)?|t(h|ween|a)|psi|rnou|mptyv)|karow|fr|l(ock|k(1(2|4)|34)|a(nk|ck(square|triangle(down|left|right)?|lozenge)))|a(ck(sim(eq)?|cong|prime|epsilon)|r(vee|wed(ge)?))|r(eve|vbar)|brk(tbrk)?))\n\t\t\t\t\t\t  | (c(s(cr|u(p(e)?|b(e)?))|h(cy|i|eck(mark)?)|ylcty|c(irc|ups(sm)?|edil|a(ps|ron))|tdot|ir(scir|c(eq|le(d(R|circ|S|dash|ast)|arrow(left|right)))?|e|fnint|E|mid)?|o(n(int|g(dot)?)|p(y(sr)?|f|rod)|lon(e(q)?)?|m(p(fn|le(xes|ment))?|ma(t)?))|dot|u(darr(l|r)|p(s|c(up|ap)|or|dot|brcap)?|e(sc|pr)|vee|wed|larr(p)?|r(vearrow(left|right)|ly(eq(succ|prec)|vee|wedge)|arr(m)?|ren))|e(nt(erdot)?|dil|mptyv)|fr|w(conint|int)|lubs(uit)?|a(cute|p(s|c(up|ap)|dot|and|brcup)?|r(on|et))|r(oss|arr))|C(scr|hi|c(irc|onint|edil|aron)|ircle(Minus|Times|Dot|Plus)|Hcy|o(n(tourIntegral|int|gruent)|unterClockwiseContourIntegral|p(f|roduct)|lon(e)?)|dot|up(Cap)?|OPY|e(nterDot|dilla)|fr|lo(seCurly(DoubleQuote|Quote)|ckwiseContourIntegral)|a(yleys|cute|p(italDifferentialD)?)|ross))\n\t\t\t\t\t\t  | (d(s(c(y|r)|trok|ol)|har(l|r)|c(y|aron)|t(dot|ri(f)?)|i(sin|e|v(ide(ontimes)?|onx)?|am(s|ond(suit)?)?|gamma)|Har|z(cy|igrarr)|o(t(square|plus|eq(dot)?|minus)?|ublebarwedge|pf|wn(harpoon(left|right)|downarrows|arrow)|llar)|d(otseq|a(rr|gger))?|u(har|arr)|jcy|e(lta|g|mptyv)|f(isht|r)|wangle|lc(orn|rop)|a(sh(v)?|leth|rr|gger)|r(c(orn|rop)|bkarow)|b(karow|lac)|Arr)|D(s(cr|trok)|c(y|aron)|Scy|i(fferentialD|a(critical(Grave|Tilde|Do(t|ubleAcute)|Acute)|mond))|o(t(Dot|Equal)?|uble(Right(Tee|Arrow)|ContourIntegral|Do(t|wnArrow)|Up(DownArrow|Arrow)|VerticalBar|L(ong(RightArrow|Left(RightArrow|Arrow))|eft(RightArrow|Tee|Arrow)))|pf|wn(Right(TeeVector|Vector(Bar)?)|Breve|Tee(Arrow)?|arrow|Left(RightVector|TeeVector|Vector(Bar)?)|Arrow(Bar|UpArrow)?))|Zcy|el(ta)?|D(otrahd)?|Jcy|fr|a(shv|rr|gger)))\n\t\t\t\t\t\t  | (e(s(cr|im|dot)|n(sp|g)|c(y|ir(c)?|olon|aron)|t(h|a)|o(pf|gon)|dot|u(ro|ml)|p(si(v|lon)?|lus|ar(sl)?)|e|D(ot|Dot)|q(s(im|lant(less|gtr))|c(irc|olon)|u(iv(DD)?|est|als)|vparsl)|f(Dot|r)|l(s(dot)?|inters|l)?|a(ster|cute)|r(Dot|arr)|g(s(dot)?|rave)?|x(cl|ist|p(onentiale|ectation))|m(sp(1(3|4))?|pty(set|v)?|acr))|E(s(cr|im)|c(y|irc|aron)|ta|o(pf|gon)|NG|dot|uml|TH|psilon|qu(ilibrium|al(Tilde)?)|fr|lement|acute|grave|x(ists|ponentialE)|m(pty(SmallSquare|VerySmallSquare)|acr)))\n\t\t\t\t\t\t  | (f(scr|nof|cy|ilig|o(pf|r(k(v)?|all))|jlig|partint|emale|f(ilig|l(ig|lig)|r)|l(tns|lig|at)|allingdotseq|r(own|a(sl|c(1(2|8|3|4|5|6)|78|2(3|5)|3(8|4|5)|45|5(8|6)))))|F(scr|cy|illed(SmallSquare|VerySmallSquare)|o(uriertrf|pf|rAll)|fr))\n\t\t\t\t\t\t  | (G(scr|c(y|irc|edil)|t|opf|dot|T|Jcy|fr|amma(d)?|reater(Greater|SlantEqual|Tilde|Equal(Less)?|FullEqual|Less)|g|breve)|g(s(cr|im(e|l)?)|n(sim|e(q(q)?)?|E|ap(prox)?)|c(y|irc)|t(c(c|ir)|dot|quest|lPar|r(sim|dot|eq(qless|less)|less|a(pprox|rr)))?|imel|opf|dot|jcy|e(s(cc|dot(o(l)?)?|l(es)?)?|q(slant|q)?|l)?|v(nE|ertneqq)|fr|E(l)?|l(j|E|a)?|a(cute|p|mma(d)?)|rave|g(g)?|breve))\n\t\t\t\t\t\t  | (h(s(cr|trok|lash)|y(phen|bull)|circ|o(ok(leftarrow|rightarrow)|pf|arr|rbar|mtht)|e(llip|arts(uit)?|rcon)|ks(earow|warow)|fr|a(irsp|lf|r(dcy|r(cir|w)?)|milt)|bar|Arr)|H(s(cr|trok)|circ|ilbertSpace|o(pf|rizontalLine)|ump(DownHump|Equal)|fr|a(cek|t)|ARDcy))\n\t\t\t\t\t\t  | (i(s(cr|in(s(v)?|dot|v|E)?)|n(care|t(cal|prod|e(rcal|gers)|larhk)?|odot|fin(tie)?)?|c(y|irc)?|t(ilde)?|i(nfin|i(nt|int)|ota)?|o(cy|ta|pf|gon)|u(kcy|ml)|jlig|prod|e(cy|xcl)|quest|f(f|r)|acute|grave|m(of|ped|a(cr|th|g(part|e|line))))|I(scr|n(t(e(rsection|gral))?|visible(Comma|Times))|c(y|irc)|tilde|o(ta|pf|gon)|dot|u(kcy|ml)|Ocy|Jlig|fr|Ecy|acute|grave|m(plies|a(cr|ginaryI))?))\n\t\t\t\t\t\t  | (j(s(cr|ercy)|c(y|irc)|opf|ukcy|fr|math)|J(s(cr|ercy)|c(y|irc)|opf|ukcy|fr))\n\t\t\t\t\t\t  | (k(scr|hcy|c(y|edil)|opf|jcy|fr|appa(v)?|green)|K(scr|c(y|edil)|Hcy|opf|Jcy|fr|appa))\n\t\t\t\t\t\t  | (l(s(h|cr|trok|im(e|g)?|q(uo(r)?|b)|aquo)|h(ar(d|u(l)?)|blk)|n(sim|e(q(q)?)?|E|ap(prox)?)|c(y|ub|e(il|dil)|aron)|Barr|t(hree|c(c|ir)|imes|dot|quest|larr|r(i(e|f)?|Par))?|Har|o(ng(left(arrow|rightarrow)|rightarrow|mapsto)|times|z(enge|f)?|oparrow(left|right)|p(f|lus|ar)|w(ast|bar)|a(ng|rr)|brk)|d(sh|ca|quo(r)?|r(dhar|ushar))|ur(dshar|uhar)|jcy|par(lt)?|e(s(s(sim|dot|eq(qgtr|gtr)|approx|gtr)|cc|dot(o(r)?)?|g(es)?)?|q(slant|q)?|ft(harpoon(down|up)|threetimes|leftarrows|arrow(tail)?|right(squigarrow|harpoons|arrow(s)?))|g)?|v(nE|ertneqq)|f(isht|loor|r)|E(g)?|l(hard|corner|tri|arr)?|a(ng(d|le)?|cute|t(e(s)?|ail)?|p|emptyv|quo|rr(sim|hk|tl|pl|fs|lp|b(fs)?)?|gran|mbda)|r(har(d)?|corner|tri|arr|m)|g(E)?|m(idot|oust(ache)?)|b(arr|r(k(sl(d|u)|e)|ac(e|k))|brk)|A(tail|arr|rr))|L(s(h|cr|trok)|c(y|edil|aron)|t|o(ng(RightArrow|left(arrow|rightarrow)|rightarrow|Left(RightArrow|Arrow))|pf|wer(RightArrow|LeftArrow))|T|e(ss(Greater|SlantEqual|Tilde|EqualGreater|FullEqual|Less)|ft(Right(Vector|Arrow)|Ceiling|T(ee(Vector|Arrow)?|riangle(Bar|Equal)?)|Do(ubleBracket|wn(TeeVector|Vector(Bar)?))|Up(TeeVector|DownVector|Vector(Bar)?)|Vector(Bar)?|arrow|rightarrow|Floor|A(ngleBracket|rrow(RightArrow|Bar)?)))|Jcy|fr|l(eftarrow)?|a(ng|cute|placetrf|rr|mbda)|midot))\n\t\t\t\t\t\t  | (M(scr|cy|inusPlus|opf|u|e(diumSpace|llintrf)|fr|ap)|m(s(cr|tpos)|ho|nplus|c(y|omma)|i(nus(d(u)?|b)?|cro|d(cir|dot|ast)?)|o(dels|pf)|dash|u(ltimap|map)?|p|easuredangle|DDot|fr|l(cp|dr)|a(cr|p(sto(down|up|left)?)?|l(t(ese)?|e)|rker)))\n\t\t\t\t\t\t  | (n(s(hort(parallel|mid)|c(cue|e|r)?|im(e(q)?)?|u(cc(eq)?|p(set(eq(q)?)?|e|E)?|b(set(eq(q)?)?|e|E)?)|par|qsu(pe|be)|mid)|Rightarrow|h(par|arr|Arr)|G(t(v)?|g)|c(y|ong(dot)?|up|edil|a(p|ron))|t(ilde|lg|riangle(left(eq)?|right(eq)?)|gl)|i(s(d)?|v)?|o(t(ni(v(c|a|b))?|in(dot|v(c|a|b)|E)?)?|pf)|dash|u(m(sp|ero)?)?|jcy|p(olint|ar(sl|t|allel)?|r(cue|e(c(eq)?)?)?)|e(s(im|ear)|dot|quiv|ar(hk|r(ow)?)|xist(s)?|Arr)?|v(sim|infin|Harr|dash|Dash|l(t(rie)?|e|Arr)|ap|r(trie|Arr)|g(t|e))|fr|w(near|ar(hk|r(ow)?)|Arr)|V(dash|Dash)|l(sim|t(ri(e)?)?|dr|e(s(s)?|q(slant|q)?|ft(arrow|rightarrow))?|E|arr|Arr)|a(ng|cute|tur(al(s)?)?|p(id|os|prox|E)?|bla)|r(tri(e)?|ightarrow|arr(c|w)?|Arr)|g(sim|t(r)?|e(s|q(slant|q)?)?|E)|mid|L(t(v)?|eft(arrow|rightarrow)|l)|b(sp|ump(e)?))|N(scr|c(y|edil|aron)|tilde|o(nBreakingSpace|Break|t(R(ightTriangle(Bar|Equal)?|everseElement)|Greater(Greater|SlantEqual|Tilde|Equal|FullEqual|Less)?|S(u(cceeds(SlantEqual|Tilde|Equal)?|perset(Equal)?|bset(Equal)?)|quareSu(perset(Equal)?|bset(Equal)?))|Hump(DownHump|Equal)|Nested(GreaterGreater|LessLess)|C(ongruent|upCap)|Tilde(Tilde|Equal|FullEqual)?|DoubleVerticalBar|Precedes(SlantEqual|Equal)?|E(qual(Tilde)?|lement|xists)|VerticalBar|Le(ss(Greater|SlantEqual|Tilde|Equal|Less)?|ftTriangle(Bar|Equal)?))?|pf)|u|e(sted(GreaterGreater|LessLess)|wLine|gative(MediumSpace|Thi(nSpace|ckSpace)|VeryThinSpace))|Jcy|fr|acute))\n\t\t\t\t\t\t  | (o(s(cr|ol|lash)|h(m|bar)|c(y|ir(c)?)|ti(lde|mes(as)?)|S|int|opf|d(sold|iv|ot|ash|blac)|uml|p(erp|lus|ar)|elig|vbar|f(cir|r)|l(c(ir|ross)|t|ine|arr)|a(st|cute)|r(slope|igof|or|d(er(of)?|f|m)?|v|arr)?|g(t|on|rave)|m(i(nus|cron|d)|ega|acr))|O(s(cr|lash)|c(y|irc)|ti(lde|mes)|opf|dblac|uml|penCurly(DoubleQuote|Quote)|ver(B(ar|rac(e|ket))|Parenthesis)|fr|Elig|acute|r|grave|m(icron|ega|acr)))\n\t\t\t\t\t\t  | (p(s(cr|i)|h(i(v)?|one|mmat)|cy|i(tchfork|v)?|o(intint|und|pf)|uncsp|er(cnt|tenk|iod|p|mil)|fr|l(us(sim|cir|two|d(o|u)|e|acir|mn|b)?|an(ck(h)?|kv))|ar(s(im|l)|t|a(llel)?)?|r(sim|n(sim|E|ap)|cue|ime(s)?|o(d|p(to)?|f(surf|line|alar))|urel|e(c(sim|n(sim|eqq|approx)|curlyeq|eq|approx)?)?|E|ap)?|m)|P(s(cr|i)|hi|cy|i|o(incareplane|pf)|fr|lusMinus|artialD|r(ime|o(duct|portion(al)?)|ecedes(SlantEqual|Tilde|Equal)?)?))\n\t\t\t\t\t\t  | (q(scr|int|opf|u(ot|est(eq)?|at(int|ernions))|prime|fr)|Q(scr|opf|UOT|fr))\n\t\t\t\t\t\t  | (R(s(h|cr)|ho|c(y|edil|aron)|Barr|ight(Ceiling|T(ee(Vector|Arrow)?|riangle(Bar|Equal)?)|Do(ubleBracket|wn(TeeVector|Vector(Bar)?))|Up(TeeVector|DownVector|Vector(Bar)?)|Vector(Bar)?|arrow|Floor|A(ngleBracket|rrow(Bar|LeftArrow)?))|o(undImplies|pf)|uleDelayed|e(verse(UpEquilibrium|E(quilibrium|lement)))?|fr|EG|a(ng|cute|rr(tl)?)|rightarrow)|r(s(h|cr|q(uo(r)?|b)|aquo)|h(o(v)?|ar(d|u(l)?))|nmid|c(y|ub|e(il|dil)|aron)|Barr|t(hree|imes|ri(e|f|ltri)?)|i(singdotseq|ng|ght(squigarrow|harpoon(down|up)|threetimes|left(harpoons|arrows)|arrow(tail)?|rightarrows))|Har|o(times|p(f|lus|ar)|a(ng|rr)|brk)|d(sh|ca|quo(r)?|ldhar)|uluhar|p(polint|ar(gt)?)|e(ct|al(s|ine|part)?|g)|f(isht|loor|r)|l(har|arr|m)|a(ng(d|e|le)?|c(ute|e)|t(io(nals)?|ail)|dic|emptyv|quo|rr(sim|hk|c|tl|pl|fs|w|lp|ap|b(fs)?)?)|rarr|x|moust(ache)?|b(arr|r(k(sl(d|u)|e)|ac(e|k))|brk)|A(tail|arr|rr)))\n\t\t\t\t\t\t  | (s(s(cr|tarf|etmn|mile)|h(y|c(hcy|y)|ort(parallel|mid)|arp)|c(sim|y|n(sim|E|ap)|cue|irc|polint|e(dil)?|E|a(p|ron))?|t(ar(f)?|r(ns|aight(phi|epsilon)))|i(gma(v|f)?|m(ne|dot|plus|e(q)?|l(E)?|rarr|g(E)?)?)|zlig|o(pf|ftcy|l(b(ar)?)?)|dot(e|b)?|u(ng|cc(sim|n(sim|eqq|approx)|curlyeq|eq|approx)?|p(s(im|u(p|b)|et(neq(q)?|eq(q)?)?)|hs(ol|ub)|1|n(e|E)|2|d(sub|ot)|3|plus|e(dot)?|E|larr|mult)?|m|b(s(im|u(p|b)|et(neq(q)?|eq(q)?)?)|n(e|E)|dot|plus|e(dot)?|E|rarr|mult)?)|pa(des(uit)?|r)|e(swar|ct|tm(n|inus)|ar(hk|r(ow)?)|xt|mi|Arr)|q(su(p(set(eq)?|e)?|b(set(eq)?|e)?)|c(up(s)?|ap(s)?)|u(f|ar(e|f))?)|fr(own)?|w(nwar|ar(hk|r(ow)?)|Arr)|larr|acute|rarr|m(t(e(s)?)?|i(d|le)|eparsl|a(shp|llsetminus))|bquo)|S(scr|hort(RightArrow|DownArrow|UpArrow|LeftArrow)|c(y|irc|edil|aron)?|tar|igma|H(cy|CHcy)|opf|u(c(hThat|ceeds(SlantEqual|Tilde|Equal)?)|p(set|erset(Equal)?)?|m|b(set(Equal)?)?)|OFTcy|q(uare(Su(perset(Equal)?|bset(Equal)?)|Intersection|Union)?|rt)|fr|acute|mallCircle))\n\t\t\t\t\t\t  | (t(s(hcy|c(y|r)|trok)|h(i(nsp|ck(sim|approx))|orn|e(ta(sym|v)?|re(4|fore))|k(sim|ap))|c(y|edil|aron)|i(nt|lde|mes(d|b(ar)?)?)|o(sa|p(cir|f(ork)?|bot)?|ea)|dot|prime|elrec|fr|w(ixt|ohead(leftarrow|rightarrow))|a(u|rget)|r(i(sb|time|dot|plus|e|angle(down|q|left(eq)?|right(eq)?)?|minus)|pezium|ade)|brk)|T(s(cr|trok)|RADE|h(i(nSpace|ckSpace)|e(ta|refore))|c(y|edil|aron)|S(cy|Hcy)|ilde(Tilde|Equal|FullEqual)?|HORN|opf|fr|a(u|b)|ripleDot))\n\t\t\t\t\t\t  | (u(scr|h(ar(l|r)|blk)|c(y|irc)|t(ilde|dot|ri(f)?)|Har|o(pf|gon)|d(har|arr|blac)|u(arr|ml)|p(si(h|lon)?|harpoon(left|right)|downarrow|uparrows|lus|arrow)|f(isht|r)|wangle|l(c(orn(er)?|rop)|tri)|a(cute|rr)|r(c(orn(er)?|rop)|tri|ing)|grave|m(l|acr)|br(cy|eve)|Arr)|U(scr|n(ion(Plus)?|der(B(ar|rac(e|ket))|Parenthesis))|c(y|irc)|tilde|o(pf|gon)|dblac|uml|p(si(lon)?|downarrow|Tee(Arrow)?|per(RightArrow|LeftArrow)|DownArrow|Equilibrium|arrow|Arrow(Bar|DownArrow)?)|fr|a(cute|rr(ocir)?)|ring|grave|macr|br(cy|eve)))\n\t\t\t\t\t\t  | (v(s(cr|u(pn(e|E)|bn(e|E)))|nsu(p|b)|cy|Bar(v)?|zigzag|opf|dash|prop|e(e(eq|bar)?|llip|r(t|bar))|Dash|fr|ltri|a(ngrt|r(s(igma|u(psetneq(q)?|bsetneq(q)?))|nothing|t(heta|riangle(left|right))|p(hi|i|ropto)|epsilon|kappa|r(ho)?))|rtri|Arr)|V(scr|cy|opf|dash(l)?|e(e|r(yThinSpace|t(ical(Bar|Separator|Tilde|Line))?|bar))|Dash|vdash|fr|bar))\n\t\t\t\t\t\t  | (w(scr|circ|opf|p|e(ierp|d(ge(q)?|bar))|fr|r(eath)?)|W(scr|circ|opf|edge|fr))\n\t\t\t\t\t\t  | (X(scr|i|opf|fr)|x(s(cr|qcup)|h(arr|Arr)|nis|c(irc|up|ap)|i|o(time|dot|p(f|lus))|dtri|u(tri|plus)|vee|fr|wedge|l(arr|Arr)|r(arr|Arr)|map))\n\t\t\t\t\t\t  | (y(scr|c(y|irc)|icy|opf|u(cy|ml)|en|fr|ac(y|ute))|Y(scr|c(y|irc)|opf|uml|Icy|Ucy|fr|acute|Acy))\n\t\t\t\t\t\t  | (z(scr|hcy|c(y|aron)|igrarr|opf|dot|e(ta|etrf)|fr|w(nj|j)|acute)|Z(scr|c(y|aron)|Hcy|opf|dot|e(ta|roWidthSpace)|fr|acute))\n\t\t\t\t\t\t)\n\t\t\t\t\t\t(;)\n\t\t\t\t\t",
					"name": "constant.character.entity.named.$2.html"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.entity.html"
						},
						"3": {
							"name": "punctuation.definition.entity.html"
						}
					},
					"match": "(&)#[0-9]+(;)",
					"name": "constant.character.entity.numeric.decimal.html"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.entity.html"
						},
						"3": {
							"name": "punctuation.definition.entity.html"
						}
					},
					"match": "(&)#[xX][0-9a-fA-F]+(;)",
					"name": "constant.character.entity.numeric.hexadecimal.html"
				},
				{
					"match": "&(?=[a-zA-Z0-9]+;)",
					"name": "invalid.illegal.ambiguous-ampersand.html"
				}
			]
		},
		"math": {
			"patterns": [
				{
					"begin": "(?i)(<)(math)(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(>))?",
					"beginCaptures": {
						"0": {
							"name": "meta.tag.structure.$2.start.html"
						},
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						},
						"3": {
							"patterns": [
								{
									"include": "#attribute"
								}
							]
						},
						"5": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"end": "(?i)(</)(\\2)\\s*(>)",
					"endCaptures": {
						"0": {
							"name": "meta.tag.structure.$2.end.html"
						},
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						},
						"3": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.element.structure.$2.html",
					"patterns": [
						{
							"begin": "(?<!>)\\G",
							"end": ">",
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"name": "meta.tag.structure.start.html",
							"patterns": [
								{
									"include": "#attribute"
								}
							]
						},
						{
							"include": "#tags"
						}
					]
				}
			],
			"repository": {
				"attribute": {
					"patterns": [
						{
							"begin": "(s(hift|ymmetric|cript(sizemultiplier|level|minsize)|t(ackalign|retchy)|ide|u(pscriptshift|bscriptshift)|e(parator(s)?|lection)|rc)|h(eight|ref)|n(otation|umalign)|c(haralign|olumn(spa(n|cing)|width|lines|align)|lose|rossout)|i(n(dent(shift(first|last)?|target|align(first|last)?)|fixlinebreakstyle)|d)|o(pen|verflow)|d(i(splay(style)?|r)|e(nomalign|cimalpoint|pth))|position|e(dge|qual(columns|rows))|voffset|f(orm|ence|rame(spacing)?)|width|l(space|ine(thickness|leading|break(style|multchar)?)|o(ngdivstyle|cation)|ength|quote|argeop)|a(c(cent(under)?|tiontype)|l(t(text|img(-(height|valign|width))?)|ign(mentscope)?))|r(space|ow(spa(n|cing)|lines|align)|quote)|groupalign|x(link:href|mlns)|m(in(size|labelspacing)|ovablelimits|a(th(size|color|variant|background)|xsize))|bevelled)(?![\\w:-])",
							"beginCaptures": {
								"0": {
									"name": "entity.other.attribute-name.html"
								}
							},
							"end": "(?=\\s*+[^=\\s])",
							"name": "meta.attribute.$1.html",
							"patterns": [
								{
									"include": "#attribute-interior"
								}
							]
						},
						{
							"begin": "([^\\x{0020}\"'<>/=\\x{0000}-\\x{001F}\\x{007F}-\\x{009F}\\x{FDD0}-\\x{FDEF}\\x{FFFE}\\x{FFFF}\\x{1FFFE}\\x{1FFFF}\\x{2FFFE}\\x{2FFFF}\\x{3FFFE}\\x{3FFFF}\\x{4FFFE}\\x{4FFFF}\\x{5FFFE}\\x{5FFFF}\\x{6FFFE}\\x{6FFFF}\\x{7FFFE}\\x{7FFFF}\\x{8FFFE}\\x{8FFFF}\\x{9FFFE}\\x{9FFFF}\\x{AFFFE}\\x{AFFFF}\\x{BFFFE}\\x{BFFFF}\\x{CFFFE}\\x{CFFFF}\\x{DFFFE}\\x{DFFFF}\\x{EFFFE}\\x{EFFFF}\\x{FFFFE}\\x{FFFFF}\\x{10FFFE}\\x{10FFFF}]+)",
							"beginCaptures": {
								"0": {
									"name": "entity.other.attribute-name.html"
								}
							},
							"comment": "Anything else that is valid",
							"end": "(?=\\s*+[^=\\s])",
							"name": "meta.attribute.unrecognized.$1.html",
							"patterns": [
								{
									"include": "#attribute-interior"
								}
							]
						},
						{
							"match": "[^\\s>]+",
							"name": "invalid.illegal.character-not-allowed-here.html"
						}
					]
				},
				"tags": {
					"patterns": [
						{
							"include": "#comment"
						},
						{
							"include": "#cdata"
						},
						{
							"captures": {
								"0": {
									"name": "meta.tag.structure.math.$2.void.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								"5": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"match": "(?i)(<)(annotation|annotation-xml|semantics|menclose|merror|mfenced|mfrac|mpadded|mphantom|mroot|mrow|msqrt|mstyle|mmultiscripts|mover|mprescripts|msub|msubsup|msup|munder|munderover|none|mlabeledtr|mtable|mtd|mtr|mlongdiv|mscarries|mscarry|msgroup|msline|msrow|mstack|maction)(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(/>))",
							"name": "meta.element.structure.math.$2.html"
						},
						{
							"begin": "(?i)(<)(annotation|annotation-xml|semantics|menclose|merror|mfenced|mfrac|mpadded|mphantom|mroot|mrow|msqrt|mstyle|mmultiscripts|mover|mprescripts|msub|msubsup|msup|munder|munderover|none|mlabeledtr|mtable|mtd|mtr|mlongdiv|mscarries|mscarry|msgroup|msline|msrow|mstack|maction)(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(>))?",
							"beginCaptures": {
								"0": {
									"name": "meta.tag.structure.math.$2.start.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								"5": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"end": "(?i)(</)(\\2)\\s*(>)|(/>)|(?=</\\w+)",
							"endCaptures": {
								"0": {
									"name": "meta.tag.structure.math.$2.end.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"name": "punctuation.definition.tag.end.html"
								},
								"4": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"name": "meta.element.structure.math.$2.html",
							"patterns": [
								{
									"begin": "(?<!>)\\G",
									"end": "(?=/>)|>",
									"endCaptures": {
										"0": {
											"name": "punctuation.definition.tag.end.html"
										}
									},
									"name": "meta.tag.structure.start.html",
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								{
									"include": "#tags"
								}
							]
						},
						{
							"captures": {
								"0": {
									"name": "meta.tag.inline.math.$2.void.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								"5": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"match": "(?i)(<)(mi|mn|mo|ms|mspace|mtext|maligngroup|malignmark)(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(/>))",
							"name": "meta.element.inline.math.$2.html"
						},
						{
							"begin": "(?i)(<)(mi|mn|mo|ms|mspace|mtext|maligngroup|malignmark)(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(>))?",
							"beginCaptures": {
								"0": {
									"name": "meta.tag.inline.math.$2.start.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								"5": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"end": "(?i)(</)(\\2)\\s*(>)|(/>)|(?=</\\w+)",
							"endCaptures": {
								"0": {
									"name": "meta.tag.inline.math.$2.end.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"name": "punctuation.definition.tag.end.html"
								},
								"4": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"name": "meta.element.inline.math.$2.html",
							"patterns": [
								{
									"begin": "(?<!>)\\G",
									"end": "(?=/>)|>",
									"endCaptures": {
										"0": {
											"name": "punctuation.definition.tag.end.html"
										}
									},
									"name": "meta.tag.inline.start.html",
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								{
									"include": "#tags"
								}
							]
						},
						{
							"captures": {
								"0": {
									"name": "meta.tag.object.math.$2.void.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								"5": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"match": "(?i)(<)(mglyph)(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(/>))",
							"name": "meta.element.object.math.$2.html"
						},
						{
							"begin": "(?i)(<)(mglyph)(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(>))?",
							"beginCaptures": {
								"0": {
									"name": "meta.tag.object.math.$2.start.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								"5": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"end": "(?i)(</)(\\2)\\s*(>)|(/>)|(?=</\\w+)",
							"endCaptures": {
								"0": {
									"name": "meta.tag.object.math.$2.end.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"name": "punctuation.definition.tag.end.html"
								},
								"4": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"name": "meta.element.object.math.$2.html",
							"patterns": [
								{
									"begin": "(?<!>)\\G",
									"end": "(?=/>)|>",
									"endCaptures": {
										"0": {
											"name": "punctuation.definition.tag.end.html"
										}
									},
									"name": "meta.tag.object.start.html",
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								{
									"include": "#tags"
								}
							]
						},
						{
							"captures": {
								"0": {
									"name": "meta.tag.other.invalid.void.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"name": "invalid.illegal.unrecognized-tag.html"
								},
								"4": {
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								"6": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"match": "(?i)(<)(([\\w:]+))(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(/>))",
							"name": "meta.element.other.invalid.html"
						},
						{
							"begin": "(?i)(<)((\\w[^\\s>]*))(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(>))?",
							"beginCaptures": {
								"0": {
									"name": "meta.tag.other.invalid.start.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"name": "invalid.illegal.unrecognized-tag.html"
								},
								"4": {
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								"6": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"end": "(?i)(</)((\\2))\\s*(>)|(/>)|(?=</\\w+)",
							"endCaptures": {
								"0": {
									"name": "meta.tag.other.invalid.end.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"name": "invalid.illegal.unrecognized-tag.html"
								},
								"4": {
									"name": "punctuation.definition.tag.end.html"
								},
								"5": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"name": "meta.element.other.invalid.html",
							"patterns": [
								{
									"begin": "(?<!>)\\G",
									"end": "(?=/>)|>",
									"endCaptures": {
										"0": {
											"name": "punctuation.definition.tag.end.html"
										}
									},
									"name": "meta.tag.other.invalid.start.html",
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								{
									"include": "#tags"
								}
							]
						},
						{
							"include": "#tags-invalid"
						}
					]
				}
			}
		},
		"svg": {
			"patterns": [
				{
					"begin": "(?i)(<)(svg)(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(>))?",
					"beginCaptures": {
						"0": {
							"name": "meta.tag.structure.$2.start.html"
						},
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						},
						"3": {
							"patterns": [
								{
									"include": "#attribute"
								}
							]
						},
						"5": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"end": "(?i)(</)(\\2)\\s*(>)",
					"endCaptures": {
						"0": {
							"name": "meta.tag.structure.$2.end.html"
						},
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						},
						"3": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.element.structure.$2.html",
					"patterns": [
						{
							"begin": "(?<!>)\\G",
							"end": ">",
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"name": "meta.tag.structure.start.html",
							"patterns": [
								{
									"include": "#attribute"
								}
							]
						},
						{
							"include": "#tags"
						}
					]
				}
			],
			"repository": {
				"attribute": {
					"patterns": [
						{
							"begin": "(s(hape-rendering|ystemLanguage|cale|t(yle|itchTiles|op-(color|opacity)|dDeviation|em(h|v)|artOffset|r(i(ng|kethrough-(thickness|position))|oke(-(opacity|dash(offset|array)|width|line(cap|join)|miterlimit))?))|urfaceScale|p(e(cular(Constant|Exponent)|ed)|acing|readMethod)|eed|lope)|h(oriz-(origin-x|adv-x)|eight|anging|ref(lang)?)|y(1|2|ChannelSelector)?|n(umOctaves|ame)|c(y|o(ntentS(criptType|tyleType)|lor(-(interpolation(-filters)?|profile|rendering))?)|ursor|l(ip(-(path|rule)|PathUnits)?|ass)|a(p-height|lcMode)|x)|t(ype|o|ext(-(decoration|anchor|rendering)|Length)|a(rget(X|Y)?|b(index|leValues))|ransform)|i(n(tercept|2)?|d(eographic)?|mage-rendering)|z(oomAndPan)?|o(p(erator|acity)|ver(flow|line-(thickness|position))|ffset|r(i(ent(ation)?|gin)|der))|d(y|i(splay|visor|ffuseConstant|rection)|ominant-baseline|ur|e(scent|celerate)|x)?|u(1|n(i(code(-(range|bidi))?|ts-per-em)|derline-(thickness|position))|2)|p(ing|oint(s(At(X|Y|Z))?|er-events)|a(nose-1|t(h(Length)?|tern(ContentUnits|Transform|Units))|int-order)|r(imitiveUnits|eserveA(spectRatio|lpha)))|e(n(d|able-background)|dgeMode|levation|x(ternalResourcesRequired|ponent))|v(i(sibility|ew(Box|Target))|-(hanging|ideographic|alphabetic|mathematical)|e(ctor-effect|r(sion|t-(origin-(y|x)|adv-y)))|alues)|k(1|2|3|e(y(Splines|Times|Points)|rn(ing|el(Matrix|UnitLength)))|4)?|f(y|il(ter(Res|Units)?|l(-(opacity|rule))?)|o(nt-(s(t(yle|retch)|ize(-adjust)?)|variant|family|weight)|rmat)|lood-(color|opacity)|r(om)?|x)|w(idth(s)?|ord-spacing|riting-mode)|l(i(ghting-color|mitingConeAngle)|ocal|e(ngthAdjust|tter-spacing)|ang)|a(scent|cc(umulate|ent-height)|ttribute(Name|Type)|zimuth|dditive|utoReverse|l(ignment-baseline|phabetic|lowReorder)|rabic-form|mplitude)|r(y|otate|e(s(tart|ult)|ndering-intent|peat(Count|Dur)|quired(Extensions|Features)|f(X|Y|errerPolicy)|l)|adius|x)?|g(1|2|lyph(Ref|-(name|orientation-(horizontal|vertical)))|radient(Transform|Units))|x(1|2|ChannelSelector|-height|link:(show|href|t(ype|itle)|a(ctuate|rcrole)|role)|ml:(space|lang|base))?|m(in|ode|e(thod|dia)|a(sk(ContentUnits|Units)?|thematical|rker(Height|-(start|end|mid)|Units|Width)|x))|b(y|ias|egin|ase(Profile|line-shift|Frequency)|box))(?![\\w:-])",
							"beginCaptures": {
								"0": {
									"name": "entity.other.attribute-name.html"
								}
							},
							"end": "(?=\\s*+[^=\\s])",
							"name": "meta.attribute.$1.html",
							"patterns": [
								{
									"include": "#attribute-interior"
								}
							]
						},
						{
							"begin": "([^\\x{0020}\"'<>/=\\x{0000}-\\x{001F}\\x{007F}-\\x{009F}\\x{FDD0}-\\x{FDEF}\\x{FFFE}\\x{FFFF}\\x{1FFFE}\\x{1FFFF}\\x{2FFFE}\\x{2FFFF}\\x{3FFFE}\\x{3FFFF}\\x{4FFFE}\\x{4FFFF}\\x{5FFFE}\\x{5FFFF}\\x{6FFFE}\\x{6FFFF}\\x{7FFFE}\\x{7FFFF}\\x{8FFFE}\\x{8FFFF}\\x{9FFFE}\\x{9FFFF}\\x{AFFFE}\\x{AFFFF}\\x{BFFFE}\\x{BFFFF}\\x{CFFFE}\\x{CFFFF}\\x{DFFFE}\\x{DFFFF}\\x{EFFFE}\\x{EFFFF}\\x{FFFFE}\\x{FFFFF}\\x{10FFFE}\\x{10FFFF}]+)",
							"beginCaptures": {
								"0": {
									"name": "entity.other.attribute-name.html"
								}
							},
							"comment": "Anything else that is valid",
							"end": "(?=\\s*+[^=\\s])",
							"name": "meta.attribute.unrecognized.$1.html",
							"patterns": [
								{
									"include": "#attribute-interior"
								}
							]
						},
						{
							"match": "[^\\s>]+",
							"name": "invalid.illegal.character-not-allowed-here.html"
						}
					]
				},
				"tags": {
					"patterns": [
						{
							"include": "#comment"
						},
						{
							"include": "#cdata"
						},
						{
							"captures": {
								"0": {
									"name": "meta.tag.metadata.svg.$2.void.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								"5": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"match": "(?i)(<)(color-profile|desc|metadata|script|style|title)(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(/>))",
							"name": "meta.element.metadata.svg.$2.html"
						},
						{
							"begin": "(?i)(<)(color-profile|desc|metadata|script|style|title)(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(>))?",
							"beginCaptures": {
								"0": {
									"name": "meta.tag.metadata.svg.$2.start.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								"5": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"end": "(?i)(</)(\\2)\\s*(>)|(/>)|(?=</\\w+)",
							"endCaptures": {
								"0": {
									"name": "meta.tag.metadata.svg.$2.end.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"name": "punctuation.definition.tag.end.html"
								},
								"4": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"name": "meta.element.metadata.svg.$2.html",
							"patterns": [
								{
									"begin": "(?<!>)\\G",
									"end": "(?=/>)|>",
									"endCaptures": {
										"0": {
											"name": "punctuation.definition.tag.end.html"
										}
									},
									"name": "meta.tag.metadata.start.html",
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								{
									"include": "#tags"
								}
							]
						},
						{
							"captures": {
								"0": {
									"name": "meta.tag.structure.svg.$2.void.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								"5": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"match": "(?i)(<)(animateMotion|clipPath|defs|feComponentTransfer|feDiffuseLighting|feMerge|feSpecularLighting|filter|g|hatch|linearGradient|marker|mask|mesh|meshgradient|meshpatch|meshrow|pattern|radialGradient|switch|text|textPath)(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(/>))",
							"name": "meta.element.structure.svg.$2.html"
						},
						{
							"begin": "(?i)(<)(animateMotion|clipPath|defs|feComponentTransfer|feDiffuseLighting|feMerge|feSpecularLighting|filter|g|hatch|linearGradient|marker|mask|mesh|meshgradient|meshpatch|meshrow|pattern|radialGradient|switch|text|textPath)(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(>))?",
							"beginCaptures": {
								"0": {
									"name": "meta.tag.structure.svg.$2.start.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								"5": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"end": "(?i)(</)(\\2)\\s*(>)|(/>)|(?=</\\w+)",
							"endCaptures": {
								"0": {
									"name": "meta.tag.structure.svg.$2.end.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"name": "punctuation.definition.tag.end.html"
								},
								"4": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"name": "meta.element.structure.svg.$2.html",
							"patterns": [
								{
									"begin": "(?<!>)\\G",
									"end": "(?=/>)|>",
									"endCaptures": {
										"0": {
											"name": "punctuation.definition.tag.end.html"
										}
									},
									"name": "meta.tag.structure.start.html",
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								{
									"include": "#tags"
								}
							]
						},
						{
							"captures": {
								"0": {
									"name": "meta.tag.inline.svg.$2.void.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								"5": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"match": "(?i)(<)(a|animate|discard|feBlend|feColorMatrix|feComposite|feConvolveMatrix|feDisplacementMap|feDistantLight|feDropShadow|feFlood|feFuncA|feFuncB|feFuncG|feFuncR|feGaussianBlur|feMergeNode|feMorphology|feOffset|fePointLight|feSpotLight|feTile|feTurbulence|hatchPath|mpath|set|solidcolor|stop|tspan)(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(/>))",
							"name": "meta.element.inline.svg.$2.html"
						},
						{
							"begin": "(?i)(<)(a|animate|discard|feBlend|feColorMatrix|feComposite|feConvolveMatrix|feDisplacementMap|feDistantLight|feDropShadow|feFlood|feFuncA|feFuncB|feFuncG|feFuncR|feGaussianBlur|feMergeNode|feMorphology|feOffset|fePointLight|feSpotLight|feTile|feTurbulence|hatchPath|mpath|set|solidcolor|stop|tspan)(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(>))?",
							"beginCaptures": {
								"0": {
									"name": "meta.tag.inline.svg.$2.start.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								"5": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"end": "(?i)(</)(\\2)\\s*(>)|(/>)|(?=</\\w+)",
							"endCaptures": {
								"0": {
									"name": "meta.tag.inline.svg.$2.end.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"name": "punctuation.definition.tag.end.html"
								},
								"4": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"name": "meta.element.inline.svg.$2.html",
							"patterns": [
								{
									"begin": "(?<!>)\\G",
									"end": "(?=/>)|>",
									"endCaptures": {
										"0": {
											"name": "punctuation.definition.tag.end.html"
										}
									},
									"name": "meta.tag.inline.start.html",
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								{
									"include": "#tags"
								}
							]
						},
						{
							"captures": {
								"0": {
									"name": "meta.tag.object.svg.$2.void.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								"5": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"match": "(?i)(<)(circle|ellipse|feImage|foreignObject|image|line|path|polygon|polyline|rect|symbol|use|view)(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(/>))",
							"name": "meta.element.object.svg.$2.html"
						},
						{
							"begin": "(?i)(<)(a|circle|ellipse|feImage|foreignObject|image|line|path|polygon|polyline|rect|symbol|use|view)(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(>))?",
							"beginCaptures": {
								"0": {
									"name": "meta.tag.object.svg.$2.start.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								"5": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"end": "(?i)(</)(\\2)\\s*(>)|(/>)|(?=</\\w+)",
							"endCaptures": {
								"0": {
									"name": "meta.tag.object.svg.$2.end.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"name": "punctuation.definition.tag.end.html"
								},
								"4": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"name": "meta.element.object.svg.$2.html",
							"patterns": [
								{
									"begin": "(?<!>)\\G",
									"end": "(?=/>)|>",
									"endCaptures": {
										"0": {
											"name": "punctuation.definition.tag.end.html"
										}
									},
									"name": "meta.tag.object.start.html",
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								{
									"include": "#tags"
								}
							]
						},
						{
							"captures": {
								"0": {
									"name": "meta.tag.other.svg.$2.void.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"name": "invalid.deprecated.html"
								},
								"4": {
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								"6": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"match": "(?i)(<)((altGlyph|altGlyphDef|altGlyphItem|animateColor|animateTransform|cursor|font|font-face|font-face-format|font-face-name|font-face-src|font-face-uri|glyph|glyphRef|hkern|missing-glyph|tref|vkern))(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(/>))",
							"name": "meta.element.other.svg.$2.html"
						},
						{
							"begin": "(?i)(<)((altGlyph|altGlyphDef|altGlyphItem|animateColor|animateTransform|cursor|font|font-face|font-face-format|font-face-name|font-face-src|font-face-uri|glyph|glyphRef|hkern|missing-glyph|tref|vkern))(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(>))?",
							"beginCaptures": {
								"0": {
									"name": "meta.tag.other.svg.$2.start.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"name": "invalid.deprecated.html"
								},
								"4": {
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								"6": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"end": "(?i)(</)((\\2))\\s*(>)|(/>)|(?=</\\w+)",
							"endCaptures": {
								"0": {
									"name": "meta.tag.other.svg.$2.end.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"name": "invalid.deprecated.html"
								},
								"4": {
									"name": "punctuation.definition.tag.end.html"
								},
								"5": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"name": "meta.element.other.svg.$2.html",
							"patterns": [
								{
									"begin": "(?<!>)\\G",
									"end": "(?=/>)|>",
									"endCaptures": {
										"0": {
											"name": "punctuation.definition.tag.end.html"
										}
									},
									"name": "meta.tag.other.start.html",
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								{
									"include": "#tags"
								}
							]
						},
						{
							"captures": {
								"0": {
									"name": "meta.tag.other.invalid.void.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"name": "invalid.illegal.unrecognized-tag.html"
								},
								"4": {
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								"6": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"match": "(?i)(<)(([\\w:]+))(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(/>))",
							"name": "meta.element.other.invalid.html"
						},
						{
							"begin": "(?i)(<)((\\w[^\\s>]*))(?=\\s|/?>)(?:(([^\"'>]|\"[^\"]*\"|'[^']*')*)(>))?",
							"beginCaptures": {
								"0": {
									"name": "meta.tag.other.invalid.start.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"name": "invalid.illegal.unrecognized-tag.html"
								},
								"4": {
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								"6": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"end": "(?i)(</)((\\2))\\s*(>)|(/>)|(?=</\\w+)",
							"endCaptures": {
								"0": {
									"name": "meta.tag.other.invalid.end.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"name": "invalid.illegal.unrecognized-tag.html"
								},
								"4": {
									"name": "punctuation.definition.tag.end.html"
								},
								"5": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"name": "meta.element.other.invalid.html",
							"patterns": [
								{
									"begin": "(?<!>)\\G",
									"end": "(?=/>)|>",
									"endCaptures": {
										"0": {
											"name": "punctuation.definition.tag.end.html"
										}
									},
									"name": "meta.tag.other.invalid.start.html",
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								{
									"include": "#tags"
								}
							]
						},
						{
							"include": "#tags-invalid"
						}
					]
				}
			}
		},
		"tags-invalid": {
			"patterns": [
				{
					"begin": "(</?)((\\w[^\\s>]*))(?<!/)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						},
						"3": {
							"name": "invalid.illegal.unrecognized-tag.html"
						}
					},
					"end": "((?: ?/)?>)",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.other.$2.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				}
			]
		},
		"tags-valid": {
			"patterns": [
				{
					"begin": "(^[ \\t]+)?(?=<(?i:style)\\b(?!-))",
					"beginCaptures": {
						"1": {
							"name": "punctuation.whitespace.embedded.leading.html"
						}
					},
					"end": "(?!\\G)([ \\t]*$\\n?)?",
					"endCaptures": {
						"1": {
							"name": "punctuation.whitespace.embedded.trailing.html"
						}
					},
					"patterns": [
						{
							"begin": "(?i)(<)(style)(?=\\s|/?>)",
							"beginCaptures": {
								"0": {
									"name": "meta.tag.metadata.style.start.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								}
							},
							"end": "(?i)((<)/)(style)\\s*(>)",
							"endCaptures": {
								"0": {
									"name": "meta.tag.metadata.style.end.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "source.css-ignored-vscode"
								},
								"3": {
									"name": "entity.name.tag.html"
								},
								"4": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"name": "meta.embedded.block.html",
							"patterns": [
								{
									"begin": "\\G",
									"captures": {
										"1": {
											"name": "punctuation.definition.tag.end.html"
										}
									},
									"end": "(>)",
									"name": "meta.tag.metadata.style.start.html",
									"patterns": [
										{
											"include": "#attribute"
										}
									]
								},
								{
									"begin": "(?!\\G)",
									"end": "(?=</(?i:style))",
									"name": "source.css",
									"patterns": [
										{
											"include": "source.css"
										}
									]
								}
							]
						}
					]
				},
				{
					"begin": "(^[ \\t]+)?(?=<(?i:script)\\b(?!-))",
					"beginCaptures": {
						"1": {
							"name": "punctuation.whitespace.embedded.leading.html"
						}
					},
					"end": "(?!\\G)([ \\t]*$\\n?)?",
					"endCaptures": {
						"1": {
							"name": "punctuation.whitespace.embedded.trailing.html"
						}
					},
					"patterns": [
						{
							"begin": "(<)((?i:script))\\b",
							"beginCaptures": {
								"0": {
									"name": "meta.tag.metadata.script.start.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								}
							},
							"end": "(/)((?i:script))(>)",
							"endCaptures": {
								"0": {
									"name": "meta.tag.metadata.script.end.html"
								},
								"1": {
									"name": "punctuation.definition.tag.begin.html"
								},
								"2": {
									"name": "entity.name.tag.html"
								},
								"3": {
									"name": "punctuation.definition.tag.end.html"
								}
							},
							"name": "meta.embedded.block.html",
							"patterns": [
								{
									"begin": "\\G",
									"end": "(?=/)",
									"patterns": [
										{
											"begin": "(>)",
											"beginCaptures": {
												"0": {
													"name": "meta.tag.metadata.script.start.html"
												},
												"1": {
													"name": "punctuation.definition.tag.end.html"
												}
											},
											"end": "((<))(?=/(?i:script))",
											"endCaptures": {
												"0": {
													"name": "meta.tag.metadata.script.end.html"
												},
												"1": {
													"name": "punctuation.definition.tag.begin.html"
												},
												"2": {
													"name": "source.js-ignored-vscode"
												}
											},
											"patterns": [
												{
													"begin": "\\G",
													"end": "(?=</(?i:script))",
													"name": "source.js",
													"patterns": [
														{
															"begin": "(^[ \\t]+)?(?=//)",
															"beginCaptures": {
																"1": {
																	"name": "punctuation.whitespace.comment.leading.js"
																}
															},
															"end": "(?!\\G)",
															"patterns": [
																{
																	"begin": "//",
																	"beginCaptures": {
																		"0": {
																			"name": "punctuation.definition.comment.js"
																		}
																	},
																	"end": "(?=</script)|\\n",
																	"name": "comment.line.double-slash.js"
																}
															]
														},
														{
															"begin": "/\\*",
															"captures": {
																"0": {
																	"name": "punctuation.definition.comment.js"
																}
															},
															"end": "\\*/|(?=</script)",
															"name": "comment.block.js"
														},
														{
															"include": "source.js"
														}
													]
												}
											]
										},
										{
											"begin": "\\G",
											"end": "(?ix:\n\t\t\t\t\t\t\t\t\t\t\t\t(?=>\t\t\t\t\t\t\t\t\t\t\t# Tag without type attribute\n\t\t\t\t\t\t\t\t\t\t\t\t  | type(?=[\\s=])\n\t\t\t\t\t\t\t\t\t\t\t\t  \t(?!\\s*=\\s*\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t''\t\t\t\t\t\t\t\t# Empty\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t  | \"\"\t\t\t\t\t\t\t\t\t#   Values\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t  | ('|\"|)\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t(\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext/\t\t\t\t\t\t\t# Text mime-types\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t(\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tjavascript(1\\.[0-5])?\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  | x-javascript\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  | jscript\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  | livescript\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  | (x-)?ecmascript\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  | babel\t\t\t\t\t\t# Javascript variant currently\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  \t\t\t\t\t\t\t\t#   recognized as such\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  \t)\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  | application/\t\t\t\t\t# Application mime-types\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  \t(\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t(x-)?javascript\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  | (x-)?ecmascript\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t  | module\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t  \t)\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t[\\s\"'>]\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t\t\t\t\t)",
											"name": "meta.tag.metadata.script.start.html",
											"patterns": [
												{
													"include": "#attribute"
												}
											]
										},
										{
											"begin": "(?ix:\n\t\t\t\t\t\t\t\t\t\t\t\t(?=\n\t\t\t\t\t\t\t\t\t\t\t\t\ttype\\s*=\\s*\n\t\t\t\t\t\t\t\t\t\t\t\t\t('|\"|)\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext/\n\t\t\t\t\t\t\t\t\t\t\t\t\t(\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tx-handlebars\n\t\t\t\t\t\t\t\t\t\t\t\t\t  | (x-(handlebars-)?|ng-)?template\n\t\t\t\t\t\t\t\t\t\t\t\t\t  | html\n\t\t\t\t\t\t\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t\t\t\t\t\t\t[\\s\"'>]\n\t\t\t\t\t\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t\t\t\t\t)",
											"end": "((<))(?=/(?i:script))",
											"endCaptures": {
												"0": {
													"name": "meta.tag.metadata.script.end.html"
												},
												"1": {
													"name": "punctuation.definition.tag.begin.html"
												},
												"2": {
													"name": "text.html.basic"
												}
											},
											"patterns": [
												{
													"begin": "\\G",
													"end": "(>)",
													"endCaptures": {
														"1": {
															"name": "punctuation.definition.tag.end.html"
														}
													},
													"name": "meta.tag.metadata.script.start.html",
													"patterns": [
														{
															"include": "#attribute"
														}
													]
												},
												{
													"begin": "(?!\\G)",
													"end": "(?=</(?i:script))",
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
											"begin": "(?=(?i:type))",
											"end": "(<)(?=/(?i:script))",
											"endCaptures": {
												"0": {
													"name": "meta.tag.metadata.script.end.html"
												},
												"1": {
													"name": "punctuation.definition.tag.begin.html"
												}
											},
											"patterns": [
												{
													"begin": "\\G",
													"end": "(>)",
													"endCaptures": {
														"1": {
															"name": "punctuation.definition.tag.end.html"
														}
													},
													"name": "meta.tag.metadata.script.start.html",
													"patterns": [
														{
															"include": "#attribute"
														}
													]
												},
												{
													"begin": "(?!\\G)",
													"end": "(?=</(?i:script))",
													"name": "source.unknown"
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					"begin": "(?i)(<)(base|link|meta)(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						}
					},
					"end": "/?>",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.metadata.$2.void.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(?i)(<)(noscript|title)(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						}
					},
					"end": ">",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.metadata.$2.start.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(?i)(</)(noscript|title)(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						}
					},
					"end": ">",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.metadata.$2.end.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(?i)(<)(col|hr|input)(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						}
					},
					"end": "/?>",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.structure.$2.void.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(?i)(<)(address|article|aside|blockquote|body|button|caption|colgroup|datalist|dd|details|dialog|div|dl|dt|fieldset|figcaption|figure|footer|form|head|header|hgroup|html|h[1-6]|label|legend|li|main|map|menu|meter|nav|ol|optgroup|option|output|p|pre|progress|section|select|slot|summary|table|tbody|td|template|textarea|tfoot|th|thead|tr|ul)(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						}
					},
					"end": ">",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.structure.$2.start.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(?i)(</)(address|article|aside|blockquote|body|button|caption|colgroup|datalist|dd|details|dialog|div|dl|dt|fieldset|figcaption|figure|footer|form|head|header|hgroup|html|h[1-6]|label|legend|li|main|map|menu|meter|nav|ol|optgroup|option|output|p|pre|progress|section|select|slot|summary|table|tbody|td|template|textarea|tfoot|th|thead|tr|ul)(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						}
					},
					"end": ">",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.structure.$2.end.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(?i)(<)(area|br|wbr)(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						}
					},
					"end": "/?>",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.inline.$2.void.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(?i)(<)(a|abbr|b|bdi|bdo|cite|code|data|del|dfn|em|i|ins|kbd|mark|q|rp|rt|ruby|s|samp|small|span|strong|sub|sup|time|u|var)(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						}
					},
					"end": ">",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.inline.$2.start.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(?i)(</)(a|abbr|b|bdi|bdo|cite|code|data|del|dfn|em|i|ins|kbd|mark|q|rp|rt|ruby|s|samp|small|span|strong|sub|sup|time|u|var)(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						}
					},
					"end": ">",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.inline.$2.end.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(?i)(<)(embed|img|param|source|track)(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						}
					},
					"end": "/?>",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.object.$2.void.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(?i)(<)(audio|canvas|iframe|object|picture|video)(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						}
					},
					"end": ">",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.object.$2.start.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(?i)(</)(audio|canvas|iframe|object|picture|video)(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						}
					},
					"end": ">",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.object.$2.end.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(?i)(<)((basefont|isindex))(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						},
						"3": {
							"name": "invalid.deprecated.html"
						}
					},
					"end": "/?>",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.metadata.$2.void.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(?i)(<)((center|frameset|noembed|noframes))(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						},
						"3": {
							"name": "invalid.deprecated.html"
						}
					},
					"end": ">",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.structure.$2.start.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(?i)(</)((center|frameset|noembed|noframes))(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						},
						"3": {
							"name": "invalid.deprecated.html"
						}
					},
					"end": ">",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.structure.$2.end.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(?i)(<)((acronym|big|blink|font|strike|tt|xmp))(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						},
						"3": {
							"name": "invalid.deprecated.html"
						}
					},
					"end": ">",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.inline.$2.start.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(?i)(</)((acronym|big|blink|font|strike|tt|xmp))(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						},
						"3": {
							"name": "invalid.deprecated.html"
						}
					},
					"end": ">",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.inline.$2.end.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(?i)(<)((frame))(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						},
						"3": {
							"name": "invalid.deprecated.html"
						}
					},
					"end": "/?>",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.object.$2.void.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(?i)(<)((applet))(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						},
						"3": {
							"name": "invalid.deprecated.html"
						}
					},
					"end": ">",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.object.$2.start.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(?i)(</)((applet))(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						},
						"3": {
							"name": "invalid.deprecated.html"
						}
					},
					"end": ">",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.object.$2.end.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(?i)(<)((dir|keygen|listing|menuitem|plaintext|spacer))(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						},
						"3": {
							"name": "invalid.illegal.no-longer-supported.html"
						}
					},
					"end": ">",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.other.$2.start.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(?i)(</)((dir|keygen|listing|menuitem|plaintext|spacer))(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						},
						"3": {
							"name": "invalid.illegal.no-longer-supported.html"
						}
					},
					"end": ">",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.other.$2.end.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"include": "#math"
				},
				{
					"include": "#svg"
				},
				{
					"begin": "(<)([a-zA-Z][.0-9_a-zA-Z\\x{00B7}\\x{00C0}-\\x{00D6}\\x{00D8}-\\x{00F6}\\x{00F8}-\\x{037D}\\x{037F}-\\x{1FFF}\\x{200C}-\\x{200D}\\x{203F}-\\x{2040}\\x{2070}-\\x{218F}\\x{2C00}-\\x{2FEF}\\x{3001}-\\x{D7FF}\\x{F900}-\\x{FDCF}\\x{FDF0}-\\x{FFFD}\\x{10000}-\\x{EFFFF}]*-[\\-.0-9_a-zA-Z\\x{00B7}\\x{00C0}-\\x{00D6}\\x{00D8}-\\x{00F6}\\x{00F8}-\\x{037D}\\x{037F}-\\x{1FFF}\\x{200C}-\\x{200D}\\x{203F}-\\x{2040}\\x{2070}-\\x{218F}\\x{2C00}-\\x{2FEF}\\x{3001}-\\x{D7FF}\\x{F900}-\\x{FDCF}\\x{FDF0}-\\x{FFFD}\\x{10000}-\\x{EFFFF}]*)(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						}
					},
					"end": "/?>",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.custom.start.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				},
				{
					"begin": "(</)([a-zA-Z][.0-9_a-zA-Z\\x{00B7}\\x{00C0}-\\x{00D6}\\x{00D8}-\\x{00F6}\\x{00F8}-\\x{037D}\\x{037F}-\\x{1FFF}\\x{200C}-\\x{200D}\\x{203F}-\\x{2040}\\x{2070}-\\x{218F}\\x{2C00}-\\x{2FEF}\\x{3001}-\\x{D7FF}\\x{F900}-\\x{FDCF}\\x{FDF0}-\\x{FFFD}\\x{10000}-\\x{EFFFF}]*-[\\-.0-9_a-zA-Z\\x{00B7}\\x{00C0}-\\x{00D6}\\x{00D8}-\\x{00F6}\\x{00F8}-\\x{037D}\\x{037F}-\\x{1FFF}\\x{200C}-\\x{200D}\\x{203F}-\\x{2040}\\x{2070}-\\x{218F}\\x{2C00}-\\x{2FEF}\\x{3001}-\\x{D7FF}\\x{F900}-\\x{FDCF}\\x{FDF0}-\\x{FFFD}\\x{10000}-\\x{EFFFF}]*)(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "entity.name.tag.html"
						}
					},
					"end": ">",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"name": "meta.tag.custom.end.html",
					"patterns": [
						{
							"include": "#attribute"
						}
					]
				}
			]
		},
		"xml-processing": {
			"begin": "(<\\?)(xml)",
			"captures": {
				"1": {
					"name": "punctuation.definition.tag.html"
				},
				"2": {
					"name": "entity.name.tag.html"
				}
			},
			"end": "(\\?>)",
			"name": "meta.tag.metadata.processing.xml.html",
			"patterns": [
				{
					"include": "#attribute"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/.npmrc]---
Location: vscode-main/extensions/html-language-features/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/.vscodeignore]---
Location: vscode-main/extensions/html-language-features/.vscodeignore

```text
build/**
test/**
.vscode/**
server/.vscode/**
server/node_modules/**
client/src/**
server/src/**
client/out/**
server/out/**
client/tsconfig.json
server/tsconfig.json
server/test/**
server/bin/**
server/build/**
server/lib/cgmanifest.json
server/package-lock.json
server/.npmignore
package-lock.json
server/extension.webpack.config.js
extension.webpack.config.js
server/extension-browser.webpack.config.js
extension-browser.webpack.config.js
CONTRIBUTING.md
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/cgmanifest.json]---
Location: vscode-main/extensions/html-language-features/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "js-beautify",
					"repositoryUrl": "https://github.com/beautify-web/js-beautify",
					"commitHash": "12e73365f9d0b203843c5b7c22d7017845a7c580"
				}
			},
			"license": "MIT",
			"version": "1.6.8"
		},
		{
			"component": {
				"type": "other",
				"other": {
					"name": "HTML 5.1 W3C Working Draft",
					"downloadUrl": "http://www.w3.org/TR/2015/WD-html51-20151008/",
					"version": "08 October 2015"
				}
			},
			"licenseDetail": [
				"Copyright © 2015 W3C® (MIT, ERCIM, Keio, Beihang). This software or document includes material copied ",
				"from or derived from HTML 5.1 W3C Working Draft (http://www.w3.org/TR/2015/WD-html51-20151008/.)",
				"",
				"THIS DOCUMENT IS PROVIDED \"AS IS,\" AND COPYRIGHT HOLDERS MAKE NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT ",
				"NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR TITLE; THAT THE CONTENTS OF ",
				"THE DOCUMENT ARE SUITABLE FOR ANY PURPOSE; NOR THAT THE IMPLEMENTATION OF SUCH CONTENTS WILL NOT INFRINGE ANY THIRD PARTY ",
				"PATENTS, COPYRIGHTS, TRADEMARKS OR OTHER RIGHTS.",
				"",
				"COPYRIGHT HOLDERS WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF ANY USE OF THE ",
				"DOCUMENT OR THE PERFORMANCE OR IMPLEMENTATION OF THE CONTENTS THEREOF.",
				"",
				"The name and trademarks of copyright holders may NOT be used in advertising or publicity pertaining to this document or its contents",
				"without specific, written prior permission. Title to copyright in this document will at all times remain with copyright holders."
			],
			"license": "W3C Document License",
			"version": "08 October 2015"
		},
		{
			"component": {
				"type": "git",
				"git": {
					"name": "Ionic documentation",
					"repositoryUrl": "https://github.com/ionic-team/ionic-site",
					"commitHash": "e952bde103470738e19a456ec4acb0f1e650b619"
				}
			},
			"licenseDetail": [
				"Copyright Drifty Co. http://drifty.com/.",
				"",
				"Apache License",
				"",
				"Version 2.0, January 2004",
				"",
				"http://www.apache.org/licenses/",
				"",
				"TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION",
				"",
				"1. Definitions.",
				"",
				"\"License\" shall mean the terms and conditions for use, reproduction, and distribution as defined by Sections 1 through 9 of this document.",
				"",
				"\"Licensor\" shall mean the copyright owner or entity authorized by the copyright owner that is granting the License.",
				"",
				"\"Legal Entity\" shall mean the union of the acting entity and all other entities that control, are controlled by, or are under common control with that entity. For the purposes of this definition, \"control\" means (i) the power, direct or indirect, to cause the direction or management of such entity, whether by contract or otherwise, or (ii) ownership of fifty percent (50%) or more of the outstanding shares, or (iii) beneficial ownership of such entity.",
				"",
				"\"You\" (or \"Your\") shall mean an individual or Legal Entity exercising permissions granted by this License.",
				"",
				"\"Source\" form shall mean the preferred form for making modifications, including but not limited to software source code, documentation source, and configuration files.",
				"",
				"\"Object\" form shall mean any form resulting from mechanical transformation or translation of a Source form, including but not limited to compiled object code, generated documentation, and conversions to other media types.",
				"",
				"\"Work\" shall mean the work of authorship, whether in Source or Object form, made available under the License, as indicated by a copyright notice that is included in or attached to the work (an example is provided in the Appendix below).",
				"",
				"\"Derivative Works\" shall mean any work, whether in Source or Object form, that is based on (or derived from) the Work and for which the editorial revisions, annotations, elaborations, or other modifications represent, as a whole, an original work of authorship. For the purposes of this License, Derivative Works shall not include works that remain separable from, or merely link (or bind by name) to the interfaces of, the Work and Derivative Works thereof.",
				"",
				"\"Contribution\" shall mean any work of authorship, including the original version of the Work and any modifications or additions to that Work or Derivative Works thereof, that is intentionally submitted to Licensor for inclusion in the Work by the copyright owner or by an individual or Legal Entity authorized to submit on behalf of the copyright owner. For the purposes of this definition, \"submitted\" means any form of electronic, verbal, or written communication sent to the Licensor or its representatives, including but not limited to communication on electronic mailing lists, source code control systems, and issue tracking systems that are managed by, or on behalf of, the Licensor for the purpose of discussing and improving the Work, but excluding communication that is conspicuously marked or otherwise designated in writing by the copyright owner as \"Not a Contribution.\"",
				"",
				"\"Contributor\" shall mean Licensor and any individual or Legal Entity on behalf of whom a Contribution has been received by Licensor and subsequently incorporated within the Work.",
				"",
				"2. Grant of Copyright License. Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license to reproduce, prepare Derivative Works of, publicly display, publicly perform, sublicense, and distribute the Work and such Derivative Works in Source or Object form.",
				"",
				"3. Grant of Patent License. Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable (except as stated in this section) patent license to make, have made, use, offer to sell, sell, import, and otherwise transfer the Work, where such license applies only to those patent claims licensable by such Contributor that are necessarily infringed by their Contribution(s) alone or by combination of their Contribution(s) with the Work to which such Contribution(s) was submitted. If You institute patent litigation against any entity (including a cross-claim or counterclaim in a lawsuit) alleging that the Work or a Contribution incorporated within the Work constitutes direct or contributory patent infringement, then any patent licenses granted to You under this License for that Work shall terminate as of the date such litigation is filed.",
				"",
				"4. Redistribution. You may reproduce and distribute copies of the Work or Derivative Works thereof in any medium, with or without modifications, and in Source or Object form, provided that You meet the following conditions:",
				"",
				"You must give any other recipients of the Work or Derivative Works a copy of this License; and",
				"",
				"You must cause any modified files to carry prominent notices stating that You changed the files; and",
				"",
				"You must retain, in the Source form of any Derivative Works that You distribute, all copyright, patent, trademark, and attribution notices from the Source form of the Work, excluding those notices that do not pertain to any part of the Derivative Works; and",
				"",
				"If the Work includes a \"NOTICE\" text file as part of its distribution, then any Derivative Works that You distribute must include a readable copy of the attribution notices contained within such NOTICE file, excluding those notices that do not pertain to any part of the Derivative Works, in at least one of the following places: within a NOTICE text file distributed as part of the Derivative Works; within the Source form or documentation, if provided along with the Derivative Works; or, within a display generated by the Derivative Works, if and wherever such third-party notices normally appear. The contents of the NOTICE file are for informational purposes only and do not modify the License. You may add Your own attribution notices within Derivative Works that You distribute, alongside or as an addendum to the NOTICE text from the Work, provided that such additional attribution notices cannot be construed as modifying the License. You may add Your own copyright statement to Your modifications and may provide additional or different license terms and conditions for use, reproduction, or distribution of Your modifications, or for any such Derivative Works as a whole, provided Your use, reproduction, and distribution of the Work otherwise complies with the conditions stated in this License.",
				"",
				"5. Submission of Contributions. Unless You explicitly state otherwise, any Contribution intentionally submitted for inclusion in the Work by You to the Licensor shall be under the terms and conditions of this License, without any additional terms or conditions. Notwithstanding the above, nothing herein shall supersede or modify the terms of any separate license agreement you may have executed with Licensor regarding such Contributions.",
				"",
				"6. Trademarks. This License does not grant permission to use the trade names, trademarks, service marks, or product names of the Licensor, except as required for reasonable and customary use in describing the origin of the Work and reproducing the content of the NOTICE file.",
				"",
				"7. Disclaimer of Warranty. Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an \"AS IS\" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.",
				"",
				"8. Limitation of Liability. In no event and under no legal theory, whether in tort (including negligence), contract, or otherwise, unless required by applicable law (such as deliberate and grossly negligent acts) or agreed to in writing, shall any Contributor be liable to You for damages, including any direct, indirect, special, incidental, or consequential damages of any character arising as a result of this License or out of the use or inability to use the Work (including but not limited to damages for loss of goodwill, work stoppage, computer failure or malfunction, or any and all other commercial damages or losses), even if such Contributor has been advised of the possibility of such damages.",
				"",
				"9. Accepting Warranty or Additional Liability. While redistributing the Work or Derivative Works thereof, You may choose to offer, and charge a fee for, acceptance of support, warranty, indemnity, or other liability obligations and/or rights consistent with this License. However, in accepting such obligations, You may act only on Your own behalf and on Your sole responsibility, not on behalf of any other Contributor, and only if You agree to indemnify, defend, and hold each Contributor harmless for any liability incurred by, or claims asserted against, such Contributor by reason of your accepting any such warranty or additional liability.",
				"",
				"END OF TERMS AND CONDITIONS"
			],
			"license": "Apache-2.0",
			"version": "1.2.4"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/CONTRIBUTING.md]---
Location: vscode-main/extensions/html-language-features/CONTRIBUTING.md

```markdown
## Setup

- Clone [microsoft/vscode](https://github.com/microsoft/vscode)
- Run `npm i` at `/`, this will install
	- Dependencies for `/extension/html-language-features/`
	- Dependencies for `/extension/html-language-features/server/`
	- devDependencies such as `gulp`
- Open `/extensions/html-language-features/` as the workspace in VS Code
- In `/extensions/html-language-features/` run `npm run compile`(or `npm run watch`) to build the client and server
- Run the [`Launch Extension`](https://github.com/microsoft/vscode/blob/master/extensions/html-language-features/.vscode/launch.json) debug target in the Debug View. This will:
	- Launch a new VS Code instance with the `html-language-features` extension loaded
- Open a `.html` file to activate the extension. The extension will start the HTML language server process.
- Add `"html.trace.server": "verbose"` to the settings to observe the communication between client and server in the `HTML Language Server` output.
- Debug the extension and the language server client by setting breakpoints in`html-language-features/client/`
- Debug the language server process by using `Attach to Node Process` command in the  VS Code window opened on `html-language-features`.
  - Pick the process that contains `htmlServerMain` in the command line. Hover over `code-insiders` resp `code` processes to see the full process command line.
  - Set breakpoints in `html-language-features/server/`
- Run `Reload Window` command in the launched instance to reload the extension

### Contribute to vscode-html-languageservice

[microsoft/vscode-html-languageservice](https://github.com/microsoft/vscode-html-languageservice) contains the language smarts for html.
This extension wraps the html language service into a Language Server for VS Code.
If you want to fix html issues or make improvements, you should make changes at [microsoft/vscode-html-languageservice](https://github.com/microsoft/vscode-html-languageservice).

However, within this extension, you can run a development version of `vscode-html-languageservice` to debug code or test language features interactively:

#### Linking `vscode-html-languageservice` in `html-language-features/server/`

- Clone [microsoft/vscode-html-languageservice](https://github.com/microsoft/vscode-html-languageservice)
- Run `npm i` in `vscode-html-languageservice`
- Run `npm link` in `vscode-html-languageservice`. This will compile and link `vscode-html-languageservice`
- In `html-language-features/server/`, run `npm link vscode-html-languageservice`

#### Testing the development version of `vscode-html-languageservice`

- Open both `vscode-html-languageservice` and this extension in two windows or with a single window with the[multi-root workspace](https://code.visualstudio.com/docs/editor/multi-root-workspaces) feature
- Run `npm run watch` at `html-languagefeatures/server/` to recompile this extension with the linked version of `vscode-html-languageservice`
- Make some changes in `vscode-html-languageservice`
- Now when you run `Launch Extension` debug target, the launched instance will use your development version of `vscode-html-languageservice`. You can interactively test the language features.
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/html-language-features/extension-browser.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import { browser as withBrowserDefaults } from '../shared.webpack.config.mjs';
import path from 'path';

export default withBrowserDefaults({
	context: path.join(import.meta.dirname, 'client'),
	entry: {
		extension: './src/browser/htmlClientMain.ts'
	},
	output: {
		filename: 'htmlClientMain.js',
		path: path.join(import.meta.dirname, 'client', 'dist', 'browser')
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/extension.webpack.config.js]---
Location: vscode-main/extensions/html-language-features/extension.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import withDefaults from '../shared.webpack.config.mjs';
import path from 'path';

export default withDefaults({
	context: path.join(import.meta.dirname, 'client'),
	entry: {
		extension: './src/node/htmlClientMain.ts',
	},
	output: {
		filename: 'htmlClientMain.js',
		path: path.join(import.meta.dirname, 'client', 'dist', 'node')
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/package-lock.json]---
Location: vscode-main/extensions/html-language-features/package-lock.json

```json
{
  "name": "html-language-features",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "html-language-features",
      "version": "1.0.0",
      "license": "MIT",
      "dependencies": {
        "@vscode/extension-telemetry": "^0.9.8",
        "vscode-languageclient": "^10.0.0-next.18",
        "vscode-uri": "^3.1.0"
      },
      "devDependencies": {
        "@types/node": "22.x"
      },
      "engines": {
        "vscode": "^1.77.0"
      }
    },
    "node_modules/@isaacs/balanced-match": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/@isaacs/balanced-match/-/balanced-match-4.0.1.tgz",
      "integrity": "sha512-yzMTt9lEb8Gv7zRioUilSglI0c0smZ9k5D65677DLWLtWJaXIS3CqcGyUFByYKlnUj6TkjLVs54fBl6+TiGQDQ==",
      "license": "MIT",
      "engines": {
        "node": "20 || >=22"
      }
    },
    "node_modules/@isaacs/brace-expansion": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/@isaacs/brace-expansion/-/brace-expansion-5.0.0.tgz",
      "integrity": "sha512-ZT55BDLV0yv0RBm2czMiZ+SqCGO7AvmOM3G/w2xhVPH+te0aKgFjmBvGlL1dH+ql2tgGO3MVrbb3jCKyvpgnxA==",
      "license": "MIT",
      "dependencies": {
        "@isaacs/balanced-match": "^4.0.1"
      },
      "engines": {
        "node": "20 || >=22"
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
    "node_modules/minimatch": {
      "version": "10.0.3",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-10.0.3.tgz",
      "integrity": "sha512-IPZ167aShDZZUMdRk66cyQAW3qr0WzbHkPdMYa8bzZhlHhO3jALbKdxcaak7W9FfT2rZNpQuUu4Od7ILEpXSaw==",
      "license": "ISC",
      "dependencies": {
        "@isaacs/brace-expansion": "^5.0.0"
      },
      "engines": {
        "node": "20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/semver": {
      "version": "7.7.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.1.tgz",
      "integrity": "sha512-hlq8tAfn0m/61p4BVRcPzIGr6LKiMwo4VM6dGi6pt4qcRkmNzTcWq6eCEjEh+qXjkMDvPlOFFSGwQjoEa6gyMA==",
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/vscode-jsonrpc": {
      "version": "9.0.0-next.10",
      "resolved": "https://registry.npmjs.org/vscode-jsonrpc/-/vscode-jsonrpc-9.0.0-next.10.tgz",
      "integrity": "sha512-P+UOjuG/B1zkLM+bGIdmBwSkDejxtgo6EjG0pIkwnFBI0a2Mb7od36uUu8CPbECeQuh+n3zGcNwDl16DhuJ5IA==",
      "license": "MIT",
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/vscode-languageclient": {
      "version": "10.0.0-next.18",
      "resolved": "https://registry.npmjs.org/vscode-languageclient/-/vscode-languageclient-10.0.0-next.18.tgz",
      "integrity": "sha512-Dpcr0VEEf4SuMW17TFCuKovhvbCx6/tHTnmFyLW1KTJCdVmNG08hXVAmw8Z/izec7TQlzEvzw5PvRfYGzdtr5Q==",
      "license": "MIT",
      "dependencies": {
        "minimatch": "^10.0.3",
        "semver": "^7.7.1",
        "vscode-languageserver-protocol": "3.17.6-next.15"
      },
      "engines": {
        "vscode": "^1.91.0"
      }
    },
    "node_modules/vscode-languageserver-protocol": {
      "version": "3.17.6-next.15",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-protocol/-/vscode-languageserver-protocol-3.17.6-next.15.tgz",
      "integrity": "sha512-aoWX1wwGCndzfrTRhGKVpKAPVy9+WYhUtZW/PJQfHODmVwhVwb4we68CgsQZRTl36t8ZqlSOO2c2TdBPW7hrCw==",
      "license": "MIT",
      "dependencies": {
        "vscode-jsonrpc": "9.0.0-next.10",
        "vscode-languageserver-types": "3.17.6-next.6"
      }
    },
    "node_modules/vscode-languageserver-types": {
      "version": "3.17.6-next.6",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-types/-/vscode-languageserver-types-3.17.6-next.6.tgz",
      "integrity": "sha512-aiJY5/yW+xzw7KPNlwi3gQtddq/3EIn5z8X8nCgJfaiAij2R1APKePngv+MUdLdYJBVTLu+Qa0ODsT+pHgYguQ==",
      "license": "MIT"
    },
    "node_modules/vscode-uri": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/vscode-uri/-/vscode-uri-3.1.0.tgz",
      "integrity": "sha512-/BpdSx+yCQGnCvecbyXdxHDkuk55/G3xwnC0GqY4gmQ3j+A+g8kzzgB4Nk/SINjqn6+waqw3EgbVF2QKExkRxQ==",
      "license": "MIT"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/package.json]---
Location: vscode-main/extensions/html-language-features/package.json

```json
{
  "name": "html-language-features",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "aiKey": "0c6ae279ed8443289764825290e4f9e2-1a736e7c-1324-4338-be46-fc2a58ae4d14-7255",
  "engines": {
    "vscode": "^1.77.0"
  },
  "icon": "icons/html.png",
  "activationEvents": [
    "onLanguage:html",
    "onLanguage:handlebars"
  ],
  "enabledApiProposals": [
    "extensionsAny"
  ],
  "main": "./client/out/node/htmlClientMain",
  "browser": "./client/dist/browser/htmlClientMain",
  "capabilities": {
    "virtualWorkspaces": true,
    "untrustedWorkspaces": {
      "supported": true
    }
  },
  "scripts": {
    "compile": "npx gulp compile-extension:html-language-features-client compile-extension:html-language-features-server",
    "watch": "npx gulp watch-extension:html-language-features-client watch-extension:html-language-features-server",
    "install-client-next": "npm install vscode-languageclient@next"
  },
  "categories": [
    "Programming Languages"
  ],
  "contributes": {
    "configuration": {
      "id": "html",
      "order": 20,
      "type": "object",
      "title": "HTML",
      "properties": {
        "html.completion.attributeDefaultValue": {
          "type": "string",
          "scope": "resource",
          "enum": [
            "doublequotes",
            "singlequotes",
            "empty"
          ],
          "enumDescriptions": [
            "%html.completion.attributeDefaultValue.doublequotes%",
            "%html.completion.attributeDefaultValue.singlequotes%",
            "%html.completion.attributeDefaultValue.empty%"
          ],
          "default": "doublequotes",
          "markdownDescription": "%html.completion.attributeDefaultValue%"
        },
        "html.customData": {
          "type": "array",
          "markdownDescription": "%html.customData.desc%",
          "default": [],
          "items": {
            "type": "string"
          },
          "scope": "resource"
        },
        "html.format.enable": {
          "type": "boolean",
          "scope": "window",
          "default": true,
          "description": "%html.format.enable.desc%"
        },
        "html.format.wrapLineLength": {
          "type": "integer",
          "scope": "resource",
          "default": 120,
          "description": "%html.format.wrapLineLength.desc%"
        },
        "html.format.unformatted": {
          "type": [
            "string",
            "null"
          ],
          "scope": "resource",
          "default": "wbr",
          "markdownDescription": "%html.format.unformatted.desc%"
        },
        "html.format.contentUnformatted": {
          "type": [
            "string",
            "null"
          ],
          "scope": "resource",
          "default": "pre,code,textarea",
          "markdownDescription": "%html.format.contentUnformatted.desc%"
        },
        "html.format.indentInnerHtml": {
          "type": "boolean",
          "scope": "resource",
          "default": false,
          "markdownDescription": "%html.format.indentInnerHtml.desc%"
        },
        "html.format.preserveNewLines": {
          "type": "boolean",
          "scope": "resource",
          "default": true,
          "description": "%html.format.preserveNewLines.desc%"
        },
        "html.format.maxPreserveNewLines": {
          "type": [
            "number",
            "null"
          ],
          "scope": "resource",
          "default": null,
          "markdownDescription": "%html.format.maxPreserveNewLines.desc%"
        },
        "html.format.indentHandlebars": {
          "type": "boolean",
          "scope": "resource",
          "default": false,
          "markdownDescription": "%html.format.indentHandlebars.desc%"
        },
        "html.format.extraLiners": {
          "type": [
            "string",
            "null"
          ],
          "scope": "resource",
          "default": "head, body, /html",
          "markdownDescription": "%html.format.extraLiners.desc%"
        },
        "html.format.wrapAttributes": {
          "type": "string",
          "scope": "resource",
          "default": "auto",
          "enum": [
            "auto",
            "force",
            "force-aligned",
            "force-expand-multiline",
            "aligned-multiple",
            "preserve",
            "preserve-aligned"
          ],
          "enumDescriptions": [
            "%html.format.wrapAttributes.auto%",
            "%html.format.wrapAttributes.force%",
            "%html.format.wrapAttributes.forcealign%",
            "%html.format.wrapAttributes.forcemultiline%",
            "%html.format.wrapAttributes.alignedmultiple%",
            "%html.format.wrapAttributes.preserve%",
            "%html.format.wrapAttributes.preservealigned%"
          ],
          "description": "%html.format.wrapAttributes.desc%"
        },
        "html.format.wrapAttributesIndentSize": {
          "type": [
            "number",
            "null"
          ],
          "scope": "resource",
          "default": null,
          "markdownDescription": "%html.format.wrapAttributesIndentSize.desc%"
        },
        "html.format.templating": {
          "type": "boolean",
          "scope": "resource",
          "default": false,
          "description": "%html.format.templating.desc%"
        },
        "html.format.unformattedContentDelimiter": {
          "type": "string",
          "scope": "resource",
          "default": "",
          "markdownDescription": "%html.format.unformattedContentDelimiter.desc%"
        },
        "html.suggest.html5": {
          "type": "boolean",
          "scope": "resource",
          "default": true,
          "description": "%html.suggest.html5.desc%"
        },
        "html.suggest.hideEndTagSuggestions": {
          "type": "boolean",
          "scope": "resource",
          "default": false,
          "description": "%html.suggest.hideEndTagSuggestions.desc%"
        },
        "html.validate.scripts": {
          "type": "boolean",
          "scope": "resource",
          "default": true,
          "description": "%html.validate.scripts%"
        },
        "html.validate.styles": {
          "type": "boolean",
          "scope": "resource",
          "default": true,
          "description": "%html.validate.styles%"
        },
        "html.autoCreateQuotes": {
          "type": "boolean",
          "scope": "resource",
          "default": true,
          "markdownDescription": "%html.autoCreateQuotes%"
        },
        "html.autoClosingTags": {
          "type": "boolean",
          "scope": "resource",
          "default": true,
          "description": "%html.autoClosingTags%"
        },
        "html.hover.documentation": {
          "type": "boolean",
          "scope": "resource",
          "default": true,
          "description": "%html.hover.documentation%"
        },
        "html.hover.references": {
          "type": "boolean",
          "scope": "resource",
          "default": true,
          "description": "%html.hover.references%"
        },
        "html.mirrorCursorOnMatchingTag": {
          "type": "boolean",
          "scope": "resource",
          "default": false,
          "description": "%html.mirrorCursorOnMatchingTag%",
          "deprecationMessage": "%html.mirrorCursorOnMatchingTagDeprecationMessage%"
        },
        "html.trace.server": {
          "type": "string",
          "scope": "window",
          "enum": [
            "off",
            "messages",
            "verbose"
          ],
          "default": "off",
          "description": "%html.trace.server.desc%"
        }
      }
    },
    "configurationDefaults": {
      "[html]": {
        "editor.suggest.insertMode": "replace"
      },
      "[handlebars]": {
        "editor.suggest.insertMode": "replace"
      }
    },
    "jsonValidation": [
      {
        "fileMatch": "*.html-data.json",
        "url": "https://raw.githubusercontent.com/microsoft/vscode-html-languageservice/master/docs/customData.schema.json"
      },
      {
        "fileMatch": "package.json",
        "url": "./schemas/package.schema.json"
      }
    ]
  },
  "dependencies": {
    "@vscode/extension-telemetry": "^0.9.8",
    "vscode-languageclient": "^10.0.0-next.18",
    "vscode-uri": "^3.1.0"
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

---[FILE: extensions/html-language-features/package.nls.json]---
Location: vscode-main/extensions/html-language-features/package.nls.json

```json
{
	"displayName": "HTML Language Features",
	"description": "Provides rich language support for HTML and Handlebar files",
	"html.customData.desc": "A list of relative file paths pointing to JSON files following the [custom data format](https://github.com/microsoft/vscode-html-languageservice/blob/master/docs/customData.md).\n\nVS Code loads custom data on startup to enhance its HTML support for the custom HTML tags, attributes and attribute values you specify in the JSON files.\n\nThe file paths are relative to workspace and only workspace folder settings are considered.",
	"html.format.enable.desc": "Enable/disable default HTML formatter.",
	"html.format.wrapLineLength.desc": "Maximum amount of characters per line (0 = disable).",
	"html.format.unformatted.desc": "List of tags, comma separated, that shouldn't be reformatted. `null` defaults to all tags listed at https://www.w3.org/TR/html5/dom.html#phrasing-content.",
	"html.format.contentUnformatted.desc": "List of tags, comma separated, where the content shouldn't be reformatted. `null` defaults to the `pre` tag.",
	"html.format.indentInnerHtml.desc": "Indent `<head>` and `<body>` sections.",
	"html.format.preserveNewLines.desc": "Controls whether existing line breaks before elements should be preserved. Only works before elements, not inside tags or for text.",
	"html.format.maxPreserveNewLines.desc": "Maximum number of line breaks to be preserved in one chunk. Use `null` for unlimited.",
	"html.format.indentHandlebars.desc": "Format and indent `{{#foo}}` and `{{/foo}}`.",
	"html.format.extraLiners.desc": "List of tags, comma separated, that should have an extra newline before them. `null` defaults to `\"head, body, /html\"`.",
	"html.format.wrapAttributes.desc": "Wrap attributes.",
	"html.format.wrapAttributes.auto": "Wrap attributes only when line length is exceeded.",
	"html.format.wrapAttributes.force": "Wrap each attribute except first.",
	"html.format.wrapAttributes.forcealign": "Wrap each attribute except first and keep aligned.",
	"html.format.wrapAttributes.forcemultiline": "Wrap each attribute.",
	"html.format.wrapAttributes.alignedmultiple": "Wrap when line length is exceeded, align attributes vertically.",
	"html.format.wrapAttributes.preserve": "Preserve wrapping of attributes.",
	"html.format.wrapAttributes.preservealigned": "Preserve wrapping of attributes but align.",
	"html.format.templating.desc": "Honor django, erb, handlebars and php templating language tags.",
	"html.format.unformattedContentDelimiter.desc": "Keep text content together between this string.",
	"html.format.wrapAttributesIndentSize.desc": "Indent wrapped attributes to after N characters. Use `null` to use the default indent size. Ignored if `#html.format.wrapAttributes#` is set to `aligned`.",
	"html.suggest.html5.desc": "Controls whether the built-in HTML language support suggests HTML5 tags, properties and values.",
	"html.suggest.hideEndTagSuggestions.desc": "Controls whether the built-in HTML language support suggests closing tags. When disabled, end tag completions like `</div>` will not be shown.",
	"html.trace.server.desc": "Traces the communication between VS Code and the HTML language server.",
	"html.validate.scripts": "Controls whether the built-in HTML language support validates embedded scripts.",
	"html.validate.styles": "Controls whether the built-in HTML language support validates embedded styles.",
	"html.autoCreateQuotes": "Enable/disable auto creation of quotes for HTML attribute assignment. The type of quotes can be configured by `#html.completion.attributeDefaultValue#`.",
	"html.autoClosingTags": "Enable/disable autoclosing of HTML tags.",
	"html.completion.attributeDefaultValue": "Controls the default value for attributes when completion is accepted.",
	"html.completion.attributeDefaultValue.doublequotes": "Attribute value is set to \"\".",
	"html.completion.attributeDefaultValue.singlequotes": "Attribute value is set to ''.",
	"html.completion.attributeDefaultValue.empty": "Attribute value is not set.",
	"html.mirrorCursorOnMatchingTag": "Enable/disable mirroring cursor on matching HTML tag.",
	"html.mirrorCursorOnMatchingTagDeprecationMessage": "Deprecated in favor of `editor.linkedEditing`",
	"html.hover.documentation": "Show tag and attribute documentation in hover.",
	"html.hover.references": "Show references to MDN in hover."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/README.md]---
Location: vscode-main/extensions/html-language-features/README.md

```markdown
# Language Features for HTML

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

## Features

See [HTML in Visual Studio Code](https://code.visualstudio.com/docs/languages/html) to learn about the features of this extension.

Please read the [CONTRIBUTING.md](https://github.com/microsoft/vscode/blob/master/extensions/html-language-features/CONTRIBUTING.md) file to learn how to contribute to this extension.
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/.vscode/launch.json]---
Location: vscode-main/extensions/html-language-features/.vscode/launch.json

```json
{
	"version": "0.2.0",
	"compounds": [
		{
			"name": "Debug Extension and Language Server",
			"configurations": ["Launch Extension", "Attach Language Server"]
		}
	],
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
			"outFiles": ["${workspaceFolder}/client/out/**/*.js"]
		},
		{
			"name": "Launch Tests",
			"type": "extensionHost",
			"request": "launch",
			"runtimeExecutable": "${execPath}",
			"args": ["--extensionDevelopmentPath=${workspaceFolder}", "--extensionTestsPath=${workspaceFolder}/client/out/test" ],
			"stopOnEntry": false,
			"sourceMaps": true,
			"outFiles": ["${workspaceFolder}/client/out/test/**/*.js"]
		},
		{
			"name": "Attach Language Server",
			"type": "node",
			"request": "attach",
			"port": 6045,
			"protocol": "inspector",
			"sourceMaps": true,
			"outFiles": ["${workspaceFolder}/server/out/**/*.js"],
			"restart": true
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/.vscode/settings.json]---
Location: vscode-main/extensions/html-language-features/.vscode/settings.json

```json
{
	"editor.insertSpaces": false,
	"prettier.semi": true,
	"prettier.singleQuote": true,
	"prettier.printWidth": 120
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/.vscode/tasks.json]---
Location: vscode-main/extensions/html-language-features/.vscode/tasks.json

```json
{
	"version": "2.0.0",
	"tasks": [
		{
			"label": "npm install",
			"command": "npm i",
			"args": ["compile"],
			"type": "shell",
			"presentation": {
				"reveal": "silent",
				"focus": false,
				"panel": "shared"
			},
			"isBackground": true,
			"problemMatcher": "$tsc-watch"
		}
	],
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/build/bundleTypeScriptLibraries.js]---
Location: vscode-main/extensions/html-language-features/build/bundleTypeScriptLibraries.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

const generatedNote = `//
// **NOTE**: Do not edit directly! This file is generated using \`npm run import-typescript\`
//
`;

const TYPESCRIPT_LIB_SOURCE = path.join(__dirname, '../../node_modules/typescript/lib');
const TYPESCRIPT_LIB_DESTINATION = path.join(__dirname, '../server/build');

(function () {
	try {
		fs.statSync(TYPESCRIPT_LIB_DESTINATION);
	} catch (err) {
		fs.mkdirSync(TYPESCRIPT_LIB_DESTINATION);
	}
	importLibs('es6');
})();


function importLibs(startLib) {
	function getFileName(name) {
		return (name === '' ? 'lib.d.ts' : `lib.${name}.d.ts`);
	}
	function getVariableName(name) {
		return (name === '' ? 'lib_dts' : `lib_${name.replace(/\./g, '_')}_dts`);
	}
	function readLibFile(name) {
		var srcPath = path.join(TYPESCRIPT_LIB_SOURCE, getFileName(name));
		return fs.readFileSync(srcPath).toString();
	}

	var queue = [];
	var in_queue = {};

	var enqueue = function (name) {
		if (in_queue[name]) {
			return;
		}
		in_queue[name] = true;
		queue.push(name);
	};

	enqueue(startLib);

	var result = [];
	while (queue.length > 0) {
		var name = queue.shift();
		var contents = readLibFile(name);
		var lines = contents.split(/\r\n|\r|\n/);

		var output = '';
		var writeOutput = function (text) {
			if (output.length === 0) {
				output = text;
			} else {
				output += ` + ${text}`;
			}
		};
		var outputLines = [];
		var flushOutputLines = function () {
			writeOutput(`"${escapeText(outputLines.join('\n'))}"`);
			outputLines = [];
		};
		var deps = [];
		for (let i = 0; i < lines.length; i++) {
			let m = lines[i].match(/\/\/\/\s*<reference\s*lib="([^"]+)"/);
			if (m) {
				flushOutputLines();
				writeOutput(getVariableName(m[1]));
				deps.push(getVariableName(m[1]));
				enqueue(m[1]);
				continue;
			}
			outputLines.push(lines[i]);
		}
		flushOutputLines();

		result.push({
			name: getVariableName(name),
			deps: deps,
			output: output
		});
	}

	var strResult = `/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
${generatedNote}`;
	// Do a topological sort
	while (result.length > 0) {
		for (let i = result.length - 1; i >= 0; i--) {
			if (result[i].deps.length === 0) {
				// emit this node
				strResult += `\nexport const ${result[i].name}: string = ${result[i].output};\n`;

				// mark dep as resolved
				for (let j = 0; j < result.length; j++) {
					for (let k = 0; k < result[j].deps.length; k++) {
						if (result[j].deps[k] === result[i].name) {
							result[j].deps.splice(k, 1);
							break;
						}
					}
				}

				// remove from result
				result.splice(i, 1);
				break;
			}
		}
	}

	var dstPath = path.join(TYPESCRIPT_LIB_DESTINATION, 'lib.ts');
	fs.writeFileSync(dstPath, strResult);
}

/**
 * Escape text such that it can be used in a javascript string enclosed by double quotes (")
 */
function escapeText(text) {
	// See http://www.javascriptkit.com/jsref/escapesequence.shtml
	var _backspace = '\b'.charCodeAt(0);
	var _formFeed = '\f'.charCodeAt(0);
	var _newLine = '\n'.charCodeAt(0);
	var _nullChar = 0;
	var _carriageReturn = '\r'.charCodeAt(0);
	var _tab = '\t'.charCodeAt(0);
	var _verticalTab = '\v'.charCodeAt(0);
	var _backslash = '\\'.charCodeAt(0);
	var _doubleQuote = '"'.charCodeAt(0);

	var startPos = 0, chrCode, replaceWith = null, resultPieces = [];

	for (var i = 0, len = text.length; i < len; i++) {
		chrCode = text.charCodeAt(i);
		switch (chrCode) {
			case _backspace:
				replaceWith = '\\b';
				break;
			case _formFeed:
				replaceWith = '\\f';
				break;
			case _newLine:
				replaceWith = '\\n';
				break;
			case _nullChar:
				replaceWith = '\\0';
				break;
			case _carriageReturn:
				replaceWith = '\\r';
				break;
			case _tab:
				replaceWith = '\\t';
				break;
			case _verticalTab:
				replaceWith = '\\v';
				break;
			case _backslash:
				replaceWith = '\\\\';
				break;
			case _doubleQuote:
				replaceWith = '\\"';
				break;
		}
		if (replaceWith !== null) {
			resultPieces.push(text.substring(startPos, i));
			resultPieces.push(replaceWith);
			startPos = i + 1;
			replaceWith = null;
		}
	}
	resultPieces.push(text.substring(startPos, len));
	return resultPieces.join('');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/client/tsconfig.json]---
Location: vscode-main/extensions/html-language-features/client/tsconfig.json

```json
{
	"extends": "../../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"lib": [
			"webworker"
		],
		"module": "Node16",
		"typeRoots": [
			"../node_modules/@types"
		]
	},
	"include": [
		"src/**/*",
		"../../../src/vscode-dts/vscode.d.ts",
		"../../../src/vscode-dts/vscode.proposed.extensionsAny.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/client/src/autoInsertion.ts]---
Location: vscode-main/extensions/html-language-features/client/src/autoInsertion.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { window, workspace, Disposable, TextDocument, Position, SnippetString, TextDocumentChangeEvent, TextDocumentChangeReason, TextDocumentContentChangeEvent } from 'vscode';
import { Runtime } from './htmlClient';
import { LanguageParticipants } from './languageParticipants';

export function activateAutoInsertion(provider: (kind: 'autoQuote' | 'autoClose', document: TextDocument, position: Position) => Thenable<string>, languageParticipants: LanguageParticipants, runtime: Runtime): Disposable {
	const disposables: Disposable[] = [];
	workspace.onDidChangeTextDocument(onDidChangeTextDocument, null, disposables);

	let anyIsEnabled = false;
	const isEnabled = {
		'autoQuote': false,
		'autoClose': false
	};
	updateEnabledState();
	window.onDidChangeActiveTextEditor(updateEnabledState, null, disposables);

	let timeout: Disposable | undefined = undefined;

	disposables.push({
		dispose: () => {
			timeout?.dispose();
		}
	});

	function updateEnabledState() {
		anyIsEnabled = false;
		const editor = window.activeTextEditor;
		if (!editor) {
			return;
		}
		const document = editor.document;
		if (!languageParticipants.useAutoInsert(document.languageId)) {
			return;
		}
		const configurations = workspace.getConfiguration(undefined, document.uri);
		isEnabled['autoQuote'] = configurations.get<boolean>('html.autoCreateQuotes') ?? false;
		isEnabled['autoClose'] = configurations.get<boolean>('html.autoClosingTags') ?? false;
		anyIsEnabled = isEnabled['autoQuote'] || isEnabled['autoClose'];
	}

	function onDidChangeTextDocument({ document, contentChanges, reason }: TextDocumentChangeEvent) {
		if (!anyIsEnabled || contentChanges.length === 0 || reason === TextDocumentChangeReason.Undo || reason === TextDocumentChangeReason.Redo) {
			return;
		}
		const activeDocument = window.activeTextEditor && window.activeTextEditor.document;
		if (document !== activeDocument) {
			return;
		}
		if (timeout) {
			timeout.dispose();
		}

		const lastChange = contentChanges[contentChanges.length - 1];
		if (lastChange.rangeLength === 0 && isSingleLine(lastChange.text)) {
			const lastCharacter = lastChange.text[lastChange.text.length - 1];
			if (isEnabled['autoQuote'] && lastCharacter === '=') {
				doAutoInsert('autoQuote', document, lastChange);
			} else if (isEnabled['autoClose'] && (lastCharacter === '>' || lastCharacter === '/')) {
				doAutoInsert('autoClose', document, lastChange);
			}
		}
	}

	function isSingleLine(text: string): boolean {
		return !/\n/.test(text);
	}

	function doAutoInsert(kind: 'autoQuote' | 'autoClose', document: TextDocument, lastChange: TextDocumentContentChangeEvent) {
		const rangeStart = lastChange.range.start;
		const version = document.version;
		timeout = runtime.timer.setTimeout(() => {
			const position = new Position(rangeStart.line, rangeStart.character + lastChange.text.length);
			provider(kind, document, position).then(text => {
				if (text && isEnabled[kind]) {
					const activeEditor = window.activeTextEditor;
					if (activeEditor) {
						const activeDocument = activeEditor.document;
						if (document === activeDocument && activeDocument.version === version) {
							const selections = activeEditor.selections;
							if (selections.length && selections.some(s => s.active.isEqual(position))) {
								activeEditor.insertSnippet(new SnippetString(text), selections.map(s => s.active));
							} else {
								activeEditor.insertSnippet(new SnippetString(text), position);
							}
						}
					}
				}
			});
			timeout = undefined;
		}, 100);
	}
	return Disposable.from(...disposables);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/client/src/customData.ts]---
Location: vscode-main/extensions/html-language-features/client/src/customData.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { workspace, extensions, Uri, EventEmitter, Disposable } from 'vscode';
import { Runtime } from './htmlClient';
import { Utils } from 'vscode-uri';


export function getCustomDataSource(runtime: Runtime, toDispose: Disposable[]) {
	let localExtensionUris = new Set<string>();
	let externalExtensionUris = new Set<string>();
	const workspaceUris = new Set<string>();

	collectInWorkspaces(workspaceUris);
	collectInExtensions(localExtensionUris, externalExtensionUris);

	const onChange = new EventEmitter<void>();

	toDispose.push(extensions.onDidChange(_ => {
		const newLocalExtensionUris = new Set<string>();
		const newExternalExtensionUris = new Set<string>();
		collectInExtensions(newLocalExtensionUris, newExternalExtensionUris);
		if (hasChanges(newLocalExtensionUris, localExtensionUris) || hasChanges(newExternalExtensionUris, externalExtensionUris)) {
			localExtensionUris = newLocalExtensionUris;
			externalExtensionUris = newExternalExtensionUris;
			onChange.fire();
		}
	}));
	toDispose.push(workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration('html.customData')) {
			workspaceUris.clear();
			collectInWorkspaces(workspaceUris);
			onChange.fire();
		}
	}));

	toDispose.push(workspace.onDidChangeTextDocument(e => {
		const path = e.document.uri.toString();
		if (externalExtensionUris.has(path) || workspaceUris.has(path)) {
			onChange.fire();
		}
	}));

	return {
		get uris() {
			return [...localExtensionUris].concat([...externalExtensionUris], [...workspaceUris]);
		},
		get onDidChange() {
			return onChange.event;
		},
		getContent(uriString: string): Thenable<string> {
			const uri = Uri.parse(uriString);
			if (localExtensionUris.has(uriString)) {
				return workspace.fs.readFile(uri).then(buffer => {
					return new runtime.TextDecoder().decode(buffer);
				});
			}
			return workspace.openTextDocument(uri).then(doc => {
				return doc.getText();
			});
		}
	};
}

function hasChanges(s1: Set<string>, s2: Set<string>) {
	if (s1.size !== s2.size) {
		return true;
	}
	for (const uri of s1) {
		if (!s2.has(uri)) {
			return true;
		}
	}
	return false;
}

function isURI(uriOrPath: string) {
	return /^(?<scheme>\w[\w\d+.-]*):/.test(uriOrPath);
}


function collectInWorkspaces(workspaceUris: Set<string>): Set<string> {
	const workspaceFolders = workspace.workspaceFolders;

	const dataPaths = new Set<string>();

	if (!workspaceFolders) {
		return dataPaths;
	}

	const collect = (uriOrPaths: string[] | undefined, rootFolder: Uri) => {
		if (Array.isArray(uriOrPaths)) {
			for (const uriOrPath of uriOrPaths) {
				if (typeof uriOrPath === 'string') {
					if (!isURI(uriOrPath)) {
						// path in the workspace
						workspaceUris.add(Utils.resolvePath(rootFolder, uriOrPath).toString());
					} else {
						// external uri
						workspaceUris.add(uriOrPath);
					}
				}
			}
		}
	};

	for (let i = 0; i < workspaceFolders.length; i++) {
		const folderUri = workspaceFolders[i].uri;
		const allHtmlConfig = workspace.getConfiguration('html', folderUri);
		const customDataInspect = allHtmlConfig.inspect<string[]>('customData');
		if (customDataInspect) {
			collect(customDataInspect.workspaceFolderValue, folderUri);
			if (i === 0) {
				if (workspace.workspaceFile) {
					collect(customDataInspect.workspaceValue, workspace.workspaceFile);
				}
				collect(customDataInspect.globalValue, folderUri);
			}
		}

	}
	return dataPaths;
}

function collectInExtensions(localExtensionUris: Set<string>, externalUris: Set<string>): void {
	for (const extension of extensions.allAcrossExtensionHosts) {
		const customData = extension.packageJSON?.contributes?.html?.customData;
		if (Array.isArray(customData)) {
			for (const uriOrPath of customData) {
				if (!isURI(uriOrPath)) {
					// relative path in an extension
					localExtensionUris.add(Uri.joinPath(extension.extensionUri, uriOrPath).toString());
				} else {
					// external uri
					externalUris.add(uriOrPath);
				}

			}
		}
	}
}
```

--------------------------------------------------------------------------------

````
