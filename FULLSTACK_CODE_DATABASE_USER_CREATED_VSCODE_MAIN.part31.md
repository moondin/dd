---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:25Z
part: 31
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 31 of 552)

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

---[FILE: extensions/css/syntaxes/css.tmLanguage.json]---
Location: vscode-main/extensions/css/syntaxes/css.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/microsoft/vscode-css/blob/master/grammars/css.cson",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/microsoft/vscode-css/commit/a927fe2f73927bf5c25d0b0c4dd0e63d69fd8887",
	"name": "CSS",
	"scopeName": "source.css",
	"patterns": [
		{
			"include": "#comment-block"
		},
		{
			"include": "#escapes"
		},
		{
			"include": "#combinators"
		},
		{
			"include": "#selector"
		},
		{
			"include": "#at-rules"
		},
		{
			"include": "#rule-list"
		}
	],
	"repository": {
		"at-rules": {
			"patterns": [
				{
					"begin": "\\A(?:\\xEF\\xBB\\xBF)?(?i:(?=\\s*@charset\\b))",
					"end": ";|(?=$)",
					"endCaptures": {
						"0": {
							"name": "punctuation.terminator.rule.css"
						}
					},
					"name": "meta.at-rule.charset.css",
					"patterns": [
						{
							"captures": {
								"1": {
									"name": "invalid.illegal.not-lowercase.charset.css"
								},
								"2": {
									"name": "invalid.illegal.leading-whitespace.charset.css"
								},
								"3": {
									"name": "invalid.illegal.no-whitespace.charset.css"
								},
								"4": {
									"name": "invalid.illegal.whitespace.charset.css"
								},
								"5": {
									"name": "invalid.illegal.not-double-quoted.charset.css"
								},
								"6": {
									"name": "invalid.illegal.unclosed-string.charset.css"
								},
								"7": {
									"name": "invalid.illegal.unexpected-characters.charset.css"
								}
							},
							"match": "(?x)        # Possible errors:\n\\G\n((?!@charset)@\\w+)   # Not lowercase (@charset is case-sensitive)\n|\n\\G(\\s+)             # Preceding whitespace\n|\n(@charset\\S[^;]*)    # No whitespace after @charset\n|\n(?<=@charset)         # Before quoted charset name\n(\\x20{2,}|\\t+)      # More than one space used, or a tab\n|\n(?<=@charset\\x20)    # Beginning of charset name\n([^\";]+)              # Not double-quoted\n|\n(\"[^\"]+$)             # Unclosed quote\n|\n(?<=\")                # After charset name\n([^;]+)               # Unexpected junk instead of semicolon"
						},
						{
							"captures": {
								"1": {
									"name": "keyword.control.at-rule.charset.css"
								},
								"2": {
									"name": "punctuation.definition.keyword.css"
								}
							},
							"match": "((@)charset)(?=\\s)"
						},
						{
							"begin": "\"",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.string.begin.css"
								}
							},
							"end": "\"|$",
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.string.end.css"
								}
							},
							"name": "string.quoted.double.css",
							"patterns": [
								{
									"begin": "(?:\\G|^)(?=(?:[^\"])+$)",
									"end": "$",
									"name": "invalid.illegal.unclosed.string.css"
								}
							]
						}
					]
				},
				{
					"begin": "(?i)((@)import)(?:\\s+|$|(?=['\"]|/\\*))",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.at-rule.import.css"
						},
						"2": {
							"name": "punctuation.definition.keyword.css"
						}
					},
					"end": ";",
					"endCaptures": {
						"0": {
							"name": "punctuation.terminator.rule.css"
						}
					},
					"name": "meta.at-rule.import.css",
					"patterns": [
						{
							"begin": "\\G\\s*(?=/\\*)",
							"end": "(?<=\\*/)\\s*",
							"patterns": [
								{
									"include": "#comment-block"
								}
							]
						},
						{
							"include": "#string"
						},
						{
							"include": "#url"
						},
						{
							"include": "#media-query-list"
						}
					]
				},
				{
					"begin": "(?i)((@)font-face)(?=\\s*|{|/\\*|$)",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.at-rule.font-face.css"
						},
						"2": {
							"name": "punctuation.definition.keyword.css"
						}
					},
					"end": "(?!\\G)",
					"name": "meta.at-rule.font-face.css",
					"patterns": [
						{
							"include": "#comment-block"
						},
						{
							"include": "#escapes"
						},
						{
							"include": "#rule-list"
						}
					]
				},
				{
					"begin": "(?i)(@)page(?=[\\s:{]|/\\*|$)",
					"captures": {
						"0": {
							"name": "keyword.control.at-rule.page.css"
						},
						"1": {
							"name": "punctuation.definition.keyword.css"
						}
					},
					"end": "(?=\\s*($|[:{;]))",
					"name": "meta.at-rule.page.css",
					"patterns": [
						{
							"include": "#rule-list"
						}
					]
				},
				{
					"begin": "(?i)(?=@media(\\s|\\(|/\\*|$))",
					"end": "(?<=})(?!\\G)",
					"patterns": [
						{
							"begin": "(?i)\\G(@)media",
							"beginCaptures": {
								"0": {
									"name": "keyword.control.at-rule.media.css"
								},
								"1": {
									"name": "punctuation.definition.keyword.css"
								}
							},
							"end": "(?=\\s*[{;])",
							"name": "meta.at-rule.media.header.css",
							"patterns": [
								{
									"include": "#media-query-list"
								}
							]
						},
						{
							"begin": "{",
							"beginCaptures": {
								"0": {
									"name": "punctuation.section.media.begin.bracket.curly.css"
								}
							},
							"end": "}",
							"endCaptures": {
								"0": {
									"name": "punctuation.section.media.end.bracket.curly.css"
								}
							},
							"name": "meta.at-rule.media.body.css",
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					]
				},
				{
					"begin": "(?i)(?=@counter-style([\\s'\"{;]|/\\*|$))",
					"end": "(?<=})(?!\\G)",
					"patterns": [
						{
							"begin": "(?i)\\G(@)counter-style",
							"beginCaptures": {
								"0": {
									"name": "keyword.control.at-rule.counter-style.css"
								},
								"1": {
									"name": "punctuation.definition.keyword.css"
								}
							},
							"end": "(?=\\s*{)",
							"name": "meta.at-rule.counter-style.header.css",
							"patterns": [
								{
									"include": "#comment-block"
								},
								{
									"include": "#escapes"
								},
								{
									"captures": {
										"0": {
											"patterns": [
												{
													"include": "#escapes"
												}
											]
										}
									},
									"match": "(?x)\n(?:[-a-zA-Z_]    | [^\\x00-\\x7F])     # First letter\n(?:[-a-zA-Z0-9_] | [^\\x00-\\x7F]      # Remainder of identifier\n  |\\\\(?:[0-9a-fA-F]{1,6}|.)\n)*",
									"name": "variable.parameter.style-name.css"
								}
							]
						},
						{
							"begin": "{",
							"beginCaptures": {
								"0": {
									"name": "punctuation.section.property-list.begin.bracket.curly.css"
								}
							},
							"end": "}",
							"endCaptures": {
								"0": {
									"name": "punctuation.section.property-list.end.bracket.curly.css"
								}
							},
							"name": "meta.at-rule.counter-style.body.css",
							"patterns": [
								{
									"include": "#comment-block"
								},
								{
									"include": "#escapes"
								},
								{
									"include": "#rule-list-innards"
								}
							]
						}
					]
				},
				{
					"begin": "(?i)(?=@document([\\s'\"{;]|/\\*|$))",
					"end": "(?<=})(?!\\G)",
					"patterns": [
						{
							"begin": "(?i)\\G(@)document",
							"beginCaptures": {
								"0": {
									"name": "keyword.control.at-rule.document.css"
								},
								"1": {
									"name": "punctuation.definition.keyword.css"
								}
							},
							"end": "(?=\\s*[{;])",
							"name": "meta.at-rule.document.header.css",
							"patterns": [
								{
									"begin": "(?i)(?<![\\w-])(url-prefix|domain|regexp)(\\()",
									"beginCaptures": {
										"1": {
											"name": "support.function.document-rule.css"
										},
										"2": {
											"name": "punctuation.section.function.begin.bracket.round.css"
										}
									},
									"end": "\\)",
									"endCaptures": {
										"0": {
											"name": "punctuation.section.function.end.bracket.round.css"
										}
									},
									"name": "meta.function.document-rule.css",
									"patterns": [
										{
											"include": "#string"
										},
										{
											"include": "#comment-block"
										},
										{
											"include": "#escapes"
										},
										{
											"match": "[^'\")\\s]+",
											"name": "variable.parameter.document-rule.css"
										}
									]
								},
								{
									"include": "#url"
								},
								{
									"include": "#commas"
								},
								{
									"include": "#comment-block"
								},
								{
									"include": "#escapes"
								}
							]
						},
						{
							"begin": "{",
							"beginCaptures": {
								"0": {
									"name": "punctuation.section.document.begin.bracket.curly.css"
								}
							},
							"end": "}",
							"endCaptures": {
								"0": {
									"name": "punctuation.section.document.end.bracket.curly.css"
								}
							},
							"name": "meta.at-rule.document.body.css",
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					]
				},
				{
					"begin": "(?i)(?=@(?:-(?:webkit|moz|o|ms)-)?keyframes([\\s'\"{;]|/\\*|$))",
					"end": "(?<=})(?!\\G)",
					"patterns": [
						{
							"begin": "(?i)\\G(@)(?:-(?:webkit|moz|o|ms)-)?keyframes",
							"beginCaptures": {
								"0": {
									"name": "keyword.control.at-rule.keyframes.css"
								},
								"1": {
									"name": "punctuation.definition.keyword.css"
								}
							},
							"end": "(?=\\s*{)",
							"name": "meta.at-rule.keyframes.header.css",
							"patterns": [
								{
									"include": "#comment-block"
								},
								{
									"include": "#escapes"
								},
								{
									"captures": {
										"0": {
											"patterns": [
												{
													"include": "#escapes"
												}
											]
										}
									},
									"match": "(?x)\n(?:[-a-zA-Z_]    | [^\\x00-\\x7F])     # First letter\n(?:[-a-zA-Z0-9_] | [^\\x00-\\x7F]      # Remainder of identifier\n  |\\\\(?:[0-9a-fA-F]{1,6}|.)\n)*",
									"name": "variable.parameter.keyframe-list.css"
								}
							]
						},
						{
							"begin": "{",
							"beginCaptures": {
								"0": {
									"name": "punctuation.section.keyframes.begin.bracket.curly.css"
								}
							},
							"end": "}",
							"endCaptures": {
								"0": {
									"name": "punctuation.section.keyframes.end.bracket.curly.css"
								}
							},
							"name": "meta.at-rule.keyframes.body.css",
							"patterns": [
								{
									"include": "#comment-block"
								},
								{
									"include": "#escapes"
								},
								{
									"captures": {
										"1": {
											"name": "entity.other.keyframe-offset.css"
										},
										"2": {
											"name": "entity.other.keyframe-offset.percentage.css"
										}
									},
									"match": "(?xi)\n(?<![\\w-]) (from|to) (?![\\w-])         # Keywords for 0% | 100%\n|\n([-+]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)%)     # Percentile value"
								},
								{
									"include": "#rule-list"
								}
							]
						}
					]
				},
				{
					"begin": "(?i)(?=@supports(\\s|\\(|/\\*|$))",
					"end": "(?<=})(?!\\G)|(?=;)",
					"patterns": [
						{
							"begin": "(?i)\\G(@)supports",
							"beginCaptures": {
								"0": {
									"name": "keyword.control.at-rule.supports.css"
								},
								"1": {
									"name": "punctuation.definition.keyword.css"
								}
							},
							"end": "(?=\\s*[{;])",
							"name": "meta.at-rule.supports.header.css",
							"patterns": [
								{
									"include": "#feature-query-operators"
								},
								{
									"include": "#feature-query"
								},
								{
									"include": "#comment-block"
								},
								{
									"include": "#escapes"
								}
							]
						},
						{
							"begin": "{",
							"beginCaptures": {
								"0": {
									"name": "punctuation.section.supports.begin.bracket.curly.css"
								}
							},
							"end": "}",
							"endCaptures": {
								"0": {
									"name": "punctuation.section.supports.end.bracket.curly.css"
								}
							},
							"name": "meta.at-rule.supports.body.css",
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					]
				},
				{
					"begin": "(?i)((@)(-(ms|o)-)?viewport)(?=[\\s'\"{;]|/\\*|$)",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.at-rule.viewport.css"
						},
						"2": {
							"name": "punctuation.definition.keyword.css"
						}
					},
					"end": "(?=\\s*[@{;])",
					"name": "meta.at-rule.viewport.css",
					"patterns": [
						{
							"include": "#comment-block"
						},
						{
							"include": "#escapes"
						}
					]
				},
				{
					"begin": "(?i)((@)font-feature-values)(?=[\\s'\"{;]|/\\*|$)\\s*",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.at-rule.font-feature-values.css"
						},
						"2": {
							"name": "punctuation.definition.keyword.css"
						}
					},
					"contentName": "variable.parameter.font-name.css",
					"end": "(?=\\s*[@{;])",
					"name": "meta.at-rule.font-features.css",
					"patterns": [
						{
							"include": "#comment-block"
						},
						{
							"include": "#escapes"
						}
					]
				},
				{
					"include": "#font-features"
				},
				{
					"begin": "(?i)((@)namespace)(?=[\\s'\";]|/\\*|$)",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.at-rule.namespace.css"
						},
						"2": {
							"name": "punctuation.definition.keyword.css"
						}
					},
					"end": ";|(?=[@{])",
					"endCaptures": {
						"0": {
							"name": "punctuation.terminator.rule.css"
						}
					},
					"name": "meta.at-rule.namespace.css",
					"patterns": [
						{
							"include": "#url"
						},
						{
							"captures": {
								"1": {
									"patterns": [
										{
											"include": "#comment-block"
										}
									]
								},
								"2": {
									"name": "entity.name.function.namespace-prefix.css",
									"patterns": [
										{
											"include": "#escapes"
										}
									]
								}
							},
							"match": "(?xi)\n(?:\\G|^|(?<=\\s))\n(?=\n  (?<=\\s|^)                             # Starts with whitespace\n  (?:[-a-zA-Z_]|[^\\x00-\\x7F])          # Then a valid identifier character\n  |\n  \\s*                                   # Possible adjoining whitespace\n  /\\*(?:[^*]|\\*[^/])*\\*/              # Injected comment\n)\n(.*?)                                    # Grouped to embed #comment-block\n(\n  (?:[-a-zA-Z_]    | [^\\x00-\\x7F])     # First letter\n  (?:[-a-zA-Z0-9_] | [^\\x00-\\x7F]      # Remainder of identifier\n    |\\\\(?:[0-9a-fA-F]{1,6}|.)\n  )*\n)"
						},
						{
							"include": "#comment-block"
						},
						{
							"include": "#escapes"
						},
						{
							"include": "#string"
						}
					]
				},
				{
					"begin": "(?i)(?=@[\\w-]+[^;]+;s*$)",
					"end": "(?<=;)(?!\\G)",
					"patterns": [
						{
							"begin": "(?i)\\G(@)[\\w-]+",
							"beginCaptures": {
								"0": {
									"name": "keyword.control.at-rule.css"
								},
								"1": {
									"name": "punctuation.definition.keyword.css"
								}
							},
							"end": ";",
							"endCaptures": {
								"0": {
									"name": "punctuation.terminator.rule.css"
								}
							},
							"name": "meta.at-rule.header.css"
						}
					]
				},
				{
					"begin": "(?i)(?=@[\\w-]+(\\s|\\(|{|/\\*|$))",
					"end": "(?<=})(?!\\G)",
					"patterns": [
						{
							"begin": "(?i)\\G(@)[\\w-]+",
							"beginCaptures": {
								"0": {
									"name": "keyword.control.at-rule.css"
								},
								"1": {
									"name": "punctuation.definition.keyword.css"
								}
							},
							"end": "(?=\\s*[{;])",
							"name": "meta.at-rule.header.css"
						},
						{
							"begin": "{",
							"beginCaptures": {
								"0": {
									"name": "punctuation.section.begin.bracket.curly.css"
								}
							},
							"end": "}",
							"endCaptures": {
								"0": {
									"name": "punctuation.section.end.bracket.curly.css"
								}
							},
							"name": "meta.at-rule.body.css",
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					]
				}
			]
		},
		"color-keywords": {
			"patterns": [
				{
					"match": "(?i)(?<![\\w-])(aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow)(?![\\w-])",
					"name": "support.constant.color.w3c-standard-color-name.css"
				},
				{
					"match": "(?xi) (?<![\\w-])\n(aliceblue|antiquewhite|aquamarine|azure|beige|bisque|blanchedalmond|blueviolet|brown|burlywood\n|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan\n|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange\n|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise\n|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen\n|gainsboro|ghostwhite|gold|goldenrod|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki\n|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow\n|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray\n|lightslategrey|lightsteelblue|lightyellow|limegreen|linen|magenta|mediumaquamarine|mediumblue\n|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise\n|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|oldlace|olivedrab|orangered\n|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum\n|powderblue|rebeccapurple|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell\n|sienna|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|thistle|tomato\n|transparent|turquoise|violet|wheat|whitesmoke|yellowgreen)\n(?![\\w-])",
					"name": "support.constant.color.w3c-extended-color-name.css"
				},
				{
					"match": "(?i)(?<![\\w-])currentColor(?![\\w-])",
					"name": "support.constant.color.current.css"
				},
				{
					"match": "(?xi) (?<![\\w-])\n(ActiveBorder|ActiveCaption|AppWorkspace|Background|ButtonFace|ButtonHighlight|ButtonShadow\n|ButtonText|CaptionText|GrayText|Highlight|HighlightText|InactiveBorder|InactiveCaption\n|InactiveCaptionText|InfoBackground|InfoText|Menu|MenuText|Scrollbar|ThreeDDarkShadow\n|ThreeDFace|ThreeDHighlight|ThreeDLightShadow|ThreeDShadow|Window|WindowFrame|WindowText)\n(?![\\w-])",
					"name": "invalid.deprecated.color.system.css"
				}
			]
		},
		"combinators": {
			"patterns": [
				{
					"match": "/deep/|>>>",
					"name": "invalid.deprecated.combinator.css"
				},
				{
					"match": ">>|>|\\+|~",
					"name": "keyword.operator.combinator.css"
				}
			]
		},
		"commas": {
			"match": ",",
			"name": "punctuation.separator.list.comma.css"
		},
		"comment-block": {
			"begin": "/\\*",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.comment.begin.css"
				}
			},
			"end": "\\*/",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.comment.end.css"
				}
			},
			"name": "comment.block.css"
		},
		"escapes": {
			"patterns": [
				{
					"match": "\\\\[0-9a-fA-F]{1,6}",
					"name": "constant.character.escape.codepoint.css"
				},
				{
					"begin": "\\\\$\\s*",
					"end": "^(?<!\\G)",
					"name": "constant.character.escape.newline.css"
				},
				{
					"match": "\\\\.",
					"name": "constant.character.escape.css"
				}
			]
		},
		"feature-query": {
			"begin": "\\(",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.condition.begin.bracket.round.css"
				}
			},
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.condition.end.bracket.round.css"
				}
			},
			"name": "meta.feature-query.css",
			"patterns": [
				{
					"include": "#feature-query-operators"
				},
				{
					"include": "#feature-query"
				}
			]
		},
		"feature-query-operators": {
			"patterns": [
				{
					"match": "(?i)(?<=[\\s()]|^|\\*/)(and|not|or)(?=[\\s()]|/\\*|$)",
					"name": "keyword.operator.logical.feature.$1.css"
				},
				{
					"include": "#rule-list-innards"
				}
			]
		},
		"font-features": {
			"begin": "(?xi)\n((@)(annotation|character-variant|ornaments|styleset|stylistic|swash))\n(?=[\\s@'\"{;]|/\\*|$)",
			"beginCaptures": {
				"1": {
					"name": "keyword.control.at-rule.${3:/downcase}.css"
				},
				"2": {
					"name": "punctuation.definition.keyword.css"
				}
			},
			"end": "(?<=})",
			"name": "meta.at-rule.${3:/downcase}.css",
			"patterns": [
				{
					"begin": "{",
					"beginCaptures": {
						"0": {
							"name": "punctuation.section.property-list.begin.bracket.curly.css"
						}
					},
					"end": "}",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.property-list.end.bracket.curly.css"
						}
					},
					"name": "meta.property-list.font-feature.css",
					"patterns": [
						{
							"captures": {
								"0": {
									"patterns": [
										{
											"include": "#escapes"
										}
									]
								}
							},
							"match": "(?x)\n(?: [-a-zA-Z_]    | [^\\x00-\\x7F] )   # First letter\n(?: [-a-zA-Z0-9_] | [^\\x00-\\x7F]     # Remainder of identifier\n  | \\\\(?:[0-9a-fA-F]{1,6}|.)\n)*",
							"name": "variable.font-feature.css"
						},
						{
							"include": "#rule-list-innards"
						}
					]
				}
			]
		},
		"functions": {
			"patterns": [
				{
					"begin": "(?i)(?<![\\w-])(calc)(\\()",
					"beginCaptures": {
						"1": {
							"name": "support.function.calc.css"
						},
						"2": {
							"name": "punctuation.section.function.begin.bracket.round.css"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.function.end.bracket.round.css"
						}
					},
					"name": "meta.function.calc.css",
					"patterns": [
						{
							"match": "[*/]|(?<=\\s|^)[-+](?=\\s|$)",
							"name": "keyword.operator.arithmetic.css"
						},
						{
							"include": "#property-values"
						}
					]
				},
				{
					"begin": "(?i)(?<![\\w-])(rgba?|rgb|hsla?|hsl|hwb|lab|oklab|lch|oklch|color)(\\()",
					"beginCaptures": {
						"1": {
							"name": "support.function.misc.css"
						},
						"2": {
							"name": "punctuation.section.function.begin.bracket.round.css"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.function.end.bracket.round.css"
						}
					},
					"name": "meta.function.color.css",
					"patterns": [
						{
							"include": "#property-values"
						}
					]
				},
				{
					"begin": "(?xi) (?<![\\w-])\n(\n  (?:-webkit-|-moz-|-o-)?    # Accept prefixed/historical variants\n  (?:repeating-)?            # \"Repeating\"-type gradient\n  (?:linear|radial|conic)    # Shape\n  -gradient\n)\n(\\()",
					"beginCaptures": {
						"1": {
							"name": "support.function.gradient.css"
						},
						"2": {
							"name": "punctuation.section.function.begin.bracket.round.css"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.function.end.bracket.round.css"
						}
					},
					"name": "meta.function.gradient.css",
					"patterns": [
						{
							"match": "(?i)(?<![\\w-])(from|to|at|in|hue)(?![\\w-])",
							"name": "keyword.operator.gradient.css"
						},
						{
							"include": "#property-values"
						}
					]
				},
				{
					"begin": "(?i)(?<![\\w-])(-webkit-gradient)(\\()",
					"beginCaptures": {
						"1": {
							"name": "invalid.deprecated.gradient.function.css"
						},
						"2": {
							"name": "punctuation.section.function.begin.bracket.round.css"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.function.end.bracket.round.css"
						}
					},
					"name": "meta.function.gradient.invalid.deprecated.gradient.css",
					"patterns": [
						{
							"begin": "(?i)(?<![\\w-])(from|to|color-stop)(\\()",
							"beginCaptures": {
								"1": {
									"name": "invalid.deprecated.function.css"
								},
								"2": {
									"name": "punctuation.section.function.begin.bracket.round.css"
								}
							},
							"end": "\\)",
							"endCaptures": {
								"0": {
									"name": "punctuation.section.function.end.bracket.round.css"
								}
							},
							"patterns": [
								{
									"include": "#property-values"
								}
							]
						},
						{
							"include": "#property-values"
						}
					]
				},
				{
					"begin": "(?xi) (?<![\\w-])\n(annotation|attr|blur|brightness|character-variant|clamp|contrast|counters?\n|cross-fade|drop-shadow|element|fit-content|format|grayscale|hue-rotate|color-mix\n|image-set|invert|local|max|min|minmax|opacity|ornaments|repeat|saturate|sepia\n|styleset|stylistic|swash|symbols\n|cos|sin|tan|acos|asin|atan|atan2|hypot|sqrt|pow|log|exp|abs|sign)\n(\\()",
					"beginCaptures": {
						"1": {
							"name": "support.function.misc.css"
						},
						"2": {
							"name": "punctuation.section.function.begin.bracket.round.css"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.function.end.bracket.round.css"
						}
					},
					"name": "meta.function.misc.css",
					"patterns": [
						{
							"match": "(?i)(?<=[,\\s\"]|\\*/|^)\\d+x(?=[\\s,\"')]|/\\*|$)",
							"name": "constant.numeric.other.density.css"
						},
						{
							"include": "#property-values"
						},
						{
							"match": "[^'\"),\\s]+",
							"name": "variable.parameter.misc.css"
						}
					]
				},
				{
					"begin": "(?i)(?<![\\w-])(circle|ellipse|inset|polygon|rect)(\\()",
					"beginCaptures": {
						"1": {
							"name": "support.function.shape.css"
						},
						"2": {
							"name": "punctuation.section.function.begin.bracket.round.css"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.function.end.bracket.round.css"
						}
					},
					"name": "meta.function.shape.css",
					"patterns": [
						{
							"match": "(?i)(?<=\\s|^|\\*/)(at|round)(?=\\s|/\\*|$)",
							"name": "keyword.operator.shape.css"
						},
						{
							"include": "#property-values"
						}
					]
				},
				{
					"begin": "(?i)(?<![\\w-])(cubic-bezier|steps)(\\()",
					"beginCaptures": {
						"1": {
							"name": "support.function.timing-function.css"
						},
						"2": {
							"name": "punctuation.section.function.begin.bracket.round.css"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.function.end.bracket.round.css"
						}
					},
					"name": "meta.function.timing-function.css",
					"patterns": [
						{
							"match": "(?i)(?<![\\w-])(start|end)(?=\\s*\\)|$)",
							"name": "support.constant.step-direction.css"
						},
						{
							"include": "#property-values"
						}
					]
				},
				{
					"begin": "(?xi) (?<![\\w-])\n( (?:translate|scale|rotate)(?:[XYZ]|3D)?\n| matrix(?:3D)?\n| skew[XY]?\n| perspective\n)\n(\\()",
					"beginCaptures": {
						"1": {
							"name": "support.function.transform.css"
						},
						"2": {
							"name": "punctuation.section.function.begin.bracket.round.css"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.function.end.bracket.round.css"
						}
					},
					"patterns": [
						{
							"include": "#property-values"
						}
					]
				},
				{
					"include": "#url"
				},
				{
					"begin": "(?i)(?<![\\w-])(var)(\\()",
					"beginCaptures": {
						"1": {
							"name": "support.function.misc.css"
						},
						"2": {
							"name": "punctuation.section.function.begin.bracket.round.css"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.function.end.bracket.round.css"
						}
					},
					"name": "meta.function.variable.css",
					"patterns": [
						{
							"name": "variable.argument.css",
							"match": "(?x)\n--\n(?:[-a-zA-Z_]    | [^\\x00-\\x7F])     # First letter\n(?:[-a-zA-Z0-9_] | [^\\x00-\\x7F]      # Remainder of identifier\n  |\\\\(?:[0-9a-fA-F]{1,6}|.)\n)*"
						},
						{
							"include": "#property-values"
						}
					]
				}
			]
		},
		"functional-pseudo-classes": {
			"patterns": [
				{
					"begin": "(?i)((:)dir)(\\()",
					"beginCaptures": {
						"1": {
							"name": "entity.other.attribute-name.pseudo-class.css"
						},
						"2": {
							"name": "punctuation.definition.entity.css"
						},
						"3": {
							"name": "punctuation.section.function.begin.bracket.round.css"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.function.end.bracket.round.css"
						}
					},
					"patterns": [
						{
							"include": "#comment-block"
						},
						{
							"include": "#escapes"
						},
						{
							"match": "(?i)(?<![\\w-])(ltr|rtl)(?![\\w-])",
							"name": "support.constant.text-direction.css"
						},
						{
							"include": "#property-values"
						}
					]
				},
				{
					"begin": "(?i)((:)lang)(\\()",
					"beginCaptures": {
						"1": {
							"name": "entity.other.attribute-name.pseudo-class.css"
						},
						"2": {
							"name": "punctuation.definition.entity.css"
						},
						"3": {
							"name": "punctuation.section.function.begin.bracket.round.css"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.function.end.bracket.round.css"
						}
					},
					"patterns": [
						{
							"match": "(?<=[(,\\s])[a-zA-Z]+(-[a-zA-Z0-9]*|\\\\(?:[0-9a-fA-F]{1,6}|.))*(?=[),\\s])",
							"name": "support.constant.language-range.css"
						},
						{
							"begin": "\"",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.string.begin.css"
								}
							},
							"end": "\"",
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.string.end.css"
								}
							},
							"name": "string.quoted.double.css",
							"patterns": [
								{
									"include": "#escapes"
								},
								{
									"match": "(?<=[\"\\s])[a-zA-Z*]+(-[a-zA-Z0-9*]*)*(?=[\"\\s])",
									"name": "support.constant.language-range.css"
								}
							]
						},
						{
							"begin": "'",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.string.begin.css"
								}
							},
							"end": "'",
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.string.end.css"
								}
							},
							"name": "string.quoted.single.css",
							"patterns": [
								{
									"include": "#escapes"
								},
								{
									"match": "(?<=['\\s])[a-zA-Z*]+(-[a-zA-Z0-9*]*)*(?=['\\s])",
									"name": "support.constant.language-range.css"
								}
							]
						},
						{
							"include": "#commas"
						}
					]
				},
				{
					"begin": "(?i)((:)(?:not|has|matches|where|is))(\\()",
					"beginCaptures": {
						"1": {
							"name": "entity.other.attribute-name.pseudo-class.css"
						},
						"2": {
							"name": "punctuation.definition.entity.css"
						},
						"3": {
							"name": "punctuation.section.function.begin.bracket.round.css"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.function.end.bracket.round.css"
						}
					},
					"patterns": [
						{
							"include": "#selector-innards"
						}
					]
				},
				{
					"begin": "(?i)((:)nth-(?:last-)?(?:child|of-type))(\\()",
					"beginCaptures": {
						"1": {
							"name": "entity.other.attribute-name.pseudo-class.css"
						},
						"2": {
							"name": "punctuation.definition.entity.css"
						},
						"3": {
							"name": "punctuation.section.function.begin.bracket.round.css"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.function.end.bracket.round.css"
						}
					},
					"patterns": [
						{
							"match": "(?i)[+-]?(\\d+n?|n)(\\s*[+-]\\s*\\d+)?",
							"name": "constant.numeric.css"
						},
						{
							"match": "(?i)even|odd",
							"name": "support.constant.parity.css"
						}
					]
				}
			]
		},
		"media-features": {
			"captures": {
				"1": {
					"name": "support.type.property-name.media.css"
				},
				"2": {
					"name": "support.type.property-name.media.css"
				},
				"3": {
					"name": "support.type.vendored.property-name.media.css"
				}
			},
			"match": "(?xi)\n(?<=^|\\s|\\(|\\*/)           # Preceded by whitespace, bracket or comment\n(?:\n  # Standardised features\n  (\n    (?:min-|max-)?            # Range features\n    (?: height\n      | width\n      | aspect-ratio\n      | color\n      | color-index\n      | monochrome\n      | resolution\n    )\n    | grid                    # Discrete features\n    | scan\n    | orientation\n    | display-mode\n    | hover\n  )\n  |\n  # Deprecated features\n  (\n    (?:min-|max-)?            # Deprecated in Media Queries 4\n    device-\n    (?: height\n      | width\n      | aspect-ratio\n    )\n  )\n  |\n  # Vendor extensions\n  (\n    (?:\n      # Spec-compliant syntax\n      [-_]\n      (?: webkit              # Webkit/Blink\n        | apple|khtml         # Webkit aliases\n        | epub                # ePub3\n        | moz                 # Gecko\n        | ms                  # Microsoft\n        | o                   # Presto (pre-Opera 15)\n        | xv|ah|rim|atsc|     # Less common vendors\n          hp|tc|wap|ro\n      )\n      |\n      # Non-standard prefixes\n      (?: mso                 # Microsoft Office\n        | prince              # YesLogic\n      )\n    )\n    -\n    [\\w-]+                   # Feature name\n    (?=                       # Terminates correctly\n      \\s*                    # Possible whitespace\n      (?:                     # Possible injected comment\n        /\\*\n        (?:[^*]|\\*[^/])*\n        \\*/\n      )?\n      \\s*\n      [:)]                    # Ends with a colon or closed bracket\n    )\n  )\n)\n(?=\\s|$|[><:=]|\\)|/\\*)     # Terminates cleanly"
		},
		"media-feature-keywords": {
			"match": "(?xi)\n(?<=^|\\s|:|\\*/)\n(?: portrait                  # Orientation\n  | landscape\n  | progressive               # Scan types\n  | interlace\n  | fullscreen                # Display modes\n  | standalone\n  | minimal-ui\n  | browser\n  | hover\n)\n(?=\\s|\\)|$)",
			"name": "support.constant.property-value.css"
		},
		"media-query": {
			"begin": "\\G",
			"end": "(?=\\s*[{;])",
			"patterns": [
				{
					"include": "#comment-block"
				},
				{
					"include": "#escapes"
				},
				{
					"include": "#media-types"
				},
				{
					"match": "(?i)(?<=\\s|^|,|\\*/)(only|not)(?=\\s|{|/\\*|$)",
					"name": "keyword.operator.logical.$1.media.css"
				},
				{
					"match": "(?i)(?<=\\s|^|\\*/|\\))and(?=\\s|/\\*|$)",
					"name": "keyword.operator.logical.and.media.css"
				},
				{
					"match": ",(?:(?:\\s*,)+|(?=\\s*[;){]))",
					"name": "invalid.illegal.comma.css"
				},
				{
					"include": "#commas"
				},
				{
					"begin": "\\(",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.parameters.begin.bracket.round.css"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.parameters.end.bracket.round.css"
						}
					},
					"patterns": [
						{
							"include": "#media-features"
						},
						{
							"include": "#media-feature-keywords"
						},
						{
							"match": ":",
							"name": "punctuation.separator.key-value.css"
						},
						{
							"match": ">=|<=|=|<|>",
							"name": "keyword.operator.comparison.css"
						},
						{
							"captures": {
								"1": {
									"name": "constant.numeric.css"
								},
								"2": {
									"name": "keyword.operator.arithmetic.css"
								},
								"3": {
									"name": "constant.numeric.css"
								}
							},
							"match": "(\\d+)\\s*(/)\\s*(\\d+)",
							"name": "meta.ratio.css"
						},
						{
							"include": "#numeric-values"
						},
						{
							"include": "#comment-block"
						}
					]
				}
			]
		},
		"media-query-list": {
			"begin": "(?=\\s*[^{;])",
			"end": "(?=\\s*[{;])",
			"patterns": [
				{
					"include": "#media-query"
				}
			]
		},
		"media-types": {
			"captures": {
				"1": {
					"name": "support.constant.media.css"
				},
				"2": {
					"name": "invalid.deprecated.constant.media.css"
				}
			},
			"match": "(?xi)\n(?<=^|\\s|,|\\*/)\n(?:\n  # Valid media types\n  (all|print|screen|speech)\n  |\n  # Deprecated in Media Queries 4: http://dev.w3.org/csswg/mediaqueries/#media-types\n  (aural|braille|embossed|handheld|projection|tty|tv)\n)\n(?=$|[{,\\s;]|/\\*)"
		},
		"numeric-values": {
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.constant.css"
						}
					},
					"match": "(#)(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b",
					"name": "constant.other.color.rgb-value.hex.css"
				},
				{
					"captures": {
						"1": {
							"name": "keyword.other.unit.percentage.css"
						},
						"2": {
							"name": "keyword.other.unit.${2:/downcase}.css"
						}
					},
					"match": "(?xi) (?<![\\w-])\n[-+]?                               # Sign indicator\n\n(?:                                 # Numerals\n    [0-9]+ (?:\\.[0-9]+)?           # Integer/float with leading digits\n  | \\.[0-9]+                       # Float without leading digits\n)\n\n(?:                                 # Scientific notation\n  (?<=[0-9])                        # Exponent must follow a digit\n  E                                 # Exponent indicator\n  [-+]?                             # Possible sign indicator\n  [0-9]+                            # Exponent value\n)?\n\n(?:                                 # Possible unit for data-type:\n  (%)                               # - Percentage\n  | ( deg|grad|rad|turn             # - Angle\n    | Hz|kHz                        # - Frequency\n    | ch|cm|em|ex|fr|in|mm|mozmm|   # - Length\n      pc|pt|px|q|rem|rch|rex|rlh|\n      ic|ric|rcap|vh|vw|vb|vi|svh|\n      svw|svb|svi|dvh|dvw|dvb|dvi|\n      lvh|lvw|lvb|lvi|vmax|vmin|\n      cqw|cqi|cqh|cqb|cqmin|cqmax\n    | dpi|dpcm|dppx                 # - Resolution\n    | s|ms                          # - Time\n    )\n  \\b                               # Boundary checking intentionally lax to\n)?                                  # facilitate embedding in CSS-like grammars",
					"name": "constant.numeric.css"
				}
			]
		},
		"property-keywords": {
			"patterns": [
				{
					"match": "(?xi) (?<![\\w-])\n(above|absolute|active|add|additive|after-edge|alias|all|all-petite-caps|all-scroll|all-small-caps|alpha|alphabetic|alternate|alternate-reverse\n|always|antialiased|auto|auto-fill|auto-fit|auto-pos|available|avoid|avoid-column|avoid-page|avoid-region|backwards|balance|baseline|before-edge|below|bevel\n|bidi-override|blink|block|block-axis|block-start|block-end|bold|bolder|border|border-box|both|bottom|bottom-outside|break-all|break-word|bullets\n|butt|capitalize|caption|cell|center|central|char|circle|clip|clone|close-quote|closest-corner|closest-side|col-resize|collapse|color|color-burn\n|color-dodge|column|column-reverse|common-ligatures|compact|condensed|contain|content|content-box|contents|context-menu|contextual|copy|cover\n|crisp-edges|crispEdges|crosshair|cyclic|dark|darken|dashed|decimal|default|dense|diagonal-fractions|difference|digits|disabled|disc|discretionary-ligatures\n|distribute|distribute-all-lines|distribute-letter|distribute-space|dot|dotted|double|double-circle|downleft|downright|e-resize|each-line|ease|ease-in\n|ease-in-out|ease-out|economy|ellipse|ellipsis|embed|end|evenodd|ew-resize|exact|exclude|exclusion|expanded|extends|extra-condensed|extra-expanded\n|fallback|farthest-corner|farthest-side|fill|fill-available|fill-box|filled|fit-content|fixed|flat|flex|flex-end|flex-start|flip|flow-root|forwards|freeze\n|from-image|full-width|geometricPrecision|georgian|grab|grabbing|grayscale|grid|groove|hand|hanging|hard-light|help|hidden|hide\n|historical-forms|historical-ligatures|horizontal|horizontal-tb|hue|icon|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space\n|ideographic|inactive|infinite|inherit|initial|inline|inline-axis|inline-block|inline-end|inline-flex|inline-grid|inline-list-item|inline-start\n|inline-table|inset|inside|inter-character|inter-ideograph|inter-word|intersect|invert|isolate|isolate-override|italic|jis04|jis78|jis83\n|jis90|justify|justify-all|kannada|keep-all|landscape|large|larger|left|light|lighten|lighter|line|line-edge|line-through|linear|linearRGB\n|lining-nums|list-item|local|loose|lowercase|lr|lr-tb|ltr|luminance|luminosity|main-size|mandatory|manipulation|manual|margin-box|match-parent\n|match-source|mathematical|max-content|medium|menu|message-box|middle|min-content|miter|mixed|move|multiply|n-resize|narrower|ne-resize\n|nearest-neighbor|nesw-resize|newspaper|no-change|no-clip|no-close-quote|no-common-ligatures|no-contextual|no-discretionary-ligatures\n|no-drop|no-historical-ligatures|no-open-quote|no-repeat|none|nonzero|normal|not-allowed|nowrap|ns-resize|numbers|numeric|nw-resize|nwse-resize\n|oblique|oldstyle-nums|open|open-quote|optimizeLegibility|optimizeQuality|optimizeSpeed|optional|ordinal|outset|outside|over|overlay|overline|padding\n|padding-box|page|painted|pan-down|pan-left|pan-right|pan-up|pan-x|pan-y|paused|petite-caps|pixelated|plaintext|pointer|portrait|pre|pre-line\n|pre-wrap|preserve-3d|progress|progressive|proportional-nums|proportional-width|proximity|radial|recto|region|relative|remove|repeat|repeat-[xy]\n|reset-size|reverse|revert|ridge|right|rl|rl-tb|round|row|row-resize|row-reverse|row-severse|rtl|ruby|ruby-base|ruby-base-container|ruby-text\n|ruby-text-container|run-in|running|s-resize|saturation|scale-down|screen|scroll|scroll-position|se-resize|semi-condensed|semi-expanded|separate\n|sesame|show|sideways|sideways-left|sideways-lr|sideways-right|sideways-rl|simplified|slashed-zero|slice|small|small-caps|small-caption|smaller\n|smooth|soft-light|solid|space|space-around|space-between|space-evenly|spell-out|square|sRGB|stacked-fractions|start|static|status-bar|swap\n|step-end|step-start|sticky|stretch|strict|stroke|stroke-box|style|sub|subgrid|subpixel-antialiased|subtract|super|sw-resize|symbolic|table\n|table-caption|table-cell|table-column|table-column-group|table-footer-group|table-header-group|table-row|table-row-group|tabular-nums|tb|tb-rl\n|text|text-after-edge|text-before-edge|text-bottom|text-top|thick|thin|titling-caps|top|top-outside|touch|traditional|transparent|triangle\n|ultra-condensed|ultra-expanded|under|underline|unicase|unset|upleft|uppercase|upright|use-glyph-orientation|use-script|verso|vertical\n|vertical-ideographic|vertical-lr|vertical-rl|vertical-text|view-box|visible|visibleFill|visiblePainted|visibleStroke|w-resize|wait|wavy\n|weight|whitespace|wider|words|wrap|wrap-reverse|x|x-large|x-small|xx-large|xx-small|y|zero|zoom-in|zoom-out)\n(?![\\w-])",
					"name": "support.constant.property-value.css"
				},
				{
					"match": "(?xi) (?<![\\w-])\n(arabic-indic|armenian|bengali|cambodian|circle|cjk-decimal|cjk-earthly-branch|cjk-heavenly-stem|cjk-ideographic\n|decimal|decimal-leading-zero|devanagari|disc|disclosure-closed|disclosure-open|ethiopic-halehame-am\n|ethiopic-halehame-ti-e[rt]|ethiopic-numeric|georgian|gujarati|gurmukhi|hangul|hangul-consonant|hebrew\n|hiragana|hiragana-iroha|japanese-formal|japanese-informal|kannada|katakana|katakana-iroha|khmer\n|korean-hangul-formal|korean-hanja-formal|korean-hanja-informal|lao|lower-alpha|lower-armenian|lower-greek\n|lower-latin|lower-roman|malayalam|mongolian|myanmar|oriya|persian|simp-chinese-formal|simp-chinese-informal\n|square|tamil|telugu|thai|tibetan|trad-chinese-formal|trad-chinese-informal|upper-alpha|upper-armenian\n|upper-latin|upper-roman|urdu)\n(?![\\w-])",
					"name": "support.constant.property-value.list-style-type.css"
				},
				{
					"match": "(?<![\\w-])(?i:-(?:ah|apple|atsc|epub|hp|khtml|moz|ms|o|rim|ro|tc|wap|webkit|xv)|(?:mso|prince))-[a-zA-Z-]+",
					"name": "support.constant.vendored.property-value.css"
				},
				{
					"match": "(?<![\\w-])(?i:arial|century|comic|courier|garamond|georgia|helvetica|impact|lucida|symbol|system-ui|system|tahoma|times|trebuchet|ui-monospace|ui-rounded|ui-sans-serif|ui-serif|utopia|verdana|webdings|sans-serif|serif|monospace)(?![\\w-])",
					"name": "support.constant.font-name.css"
				}
			]
		},
		"property-names": {
			"patterns": [
				{
					"match": "(?xi) (?<![\\w-])\n(?:\n  # Standard CSS\n  accent-color|additive-symbols|align-content|align-items|align-self|all|animation|animation-delay|animation-direction|animation-duration\n  | animation-fill-mode|animation-iteration-count|animation-name|animation-play-state|animation-timing-function|aspect-ratio|backdrop-filter\n  | backface-visibility|background|background-attachment|background-blend-mode|background-clip|background-color|background-image\n  | background-origin|background-position|background-position-[xy]|background-repeat|background-size|bleed|block-size|border\n  | border-block-end|border-block-end-color|border-block-end-style|border-block-end-width|border-block-start|border-block-start-color\n  | border-block-start-style|border-block-start-width|border-bottom|border-bottom-color|border-bottom-left-radius|border-bottom-right-radius\n  | border-bottom-style|border-bottom-width|border-collapse|border-color|border-end-end-radius|border-end-start-radius|border-image\n  | border-image-outset|border-image-repeat|border-image-slice|border-image-source|border-image-width|border-inline-end\n  | border-inline-end-color|border-inline-end-style|border-inline-end-width|border-inline-start|border-inline-start-color\n  | border-inline-start-style|border-inline-start-width|border-left|border-left-color|border-left-style|border-left-width\n  | border-radius|border-right|border-right-color|border-right-style|border-right-width|border-spacing|border-start-end-radius\n  | border-start-start-radius|border-style|border-top|border-top-color|border-top-left-radius|border-top-right-radius|border-top-style\n  | border-top-width|border-width|bottom|box-decoration-break|box-shadow|box-sizing|break-after|break-before|break-inside|caption-side\n  | caret-color|clear|clip|clip-path|clip-rule|color|color-adjust|color-interpolation-filters|color-scheme|column-count|column-fill|column-gap\n  | column-rule|column-rule-color|column-rule-style|column-rule-width|column-span|column-width|columns|contain|container|container-name|container-type|content|counter-increment\n  | counter-reset|cursor|direction|display|empty-cells|enable-background|fallback|fill|fill-opacity|fill-rule|filter|flex|flex-basis\n  | flex-direction|flex-flow|flex-grow|flex-shrink|flex-wrap|float|flood-color|flood-opacity|font|font-display|font-family\n  | font-feature-settings|font-kerning|font-language-override|font-optical-sizing|font-size|font-size-adjust|font-stretch\n  | font-style|font-synthesis|font-variant|font-variant-alternates|font-variant-caps|font-variant-east-asian|font-variant-ligatures\n  | font-variant-numeric|font-variant-position|font-variation-settings|font-weight|gap|glyph-orientation-horizontal|glyph-orientation-vertical\n  | grid|grid-area|grid-auto-columns|grid-auto-flow|grid-auto-rows|grid-column|grid-column-end|grid-column-gap|grid-column-start\n  | grid-gap|grid-row|grid-row-end|grid-row-gap|grid-row-start|grid-template|grid-template-areas|grid-template-columns|grid-template-rows\n  | hanging-punctuation|height|hyphens|image-orientation|image-rendering|image-resolution|ime-mode|initial-letter|initial-letter-align\n  | inline-size|inset|inset-block|inset-block-end|inset-block-start|inset-inline|inset-inline-end|inset-inline-start|isolation\n  | justify-content|justify-items|justify-self|kerning|left|letter-spacing|lighting-color|line-break|line-clamp|line-height|list-style\n  | list-style-image|list-style-position|list-style-type|margin|margin-block|margin-block-end|margin-block-start|margin-bottom|margin-inline|margin-inline-end|margin-inline-start\n  | margin-left|margin-right|margin-top|marker-end|marker-mid|marker-start|marks|mask|mask-border|mask-border-mode|mask-border-outset\n  | mask-border-repeat|mask-border-slice|mask-border-source|mask-border-width|mask-clip|mask-composite|mask-image|mask-mode\n  | mask-origin|mask-position|mask-repeat|mask-size|mask-type|max-block-size|max-height|max-inline-size|max-lines|max-width\n  | max-zoom|min-block-size|min-height|min-inline-size|min-width|min-zoom|mix-blend-mode|negative|object-fit|object-position\n  | offset|offset-anchor|offset-distance|offset-path|offset-position|offset-rotation|opacity|order|orientation|orphans\n  | outline|outline-color|outline-offset|outline-style|outline-width|overflow|overflow-anchor|overflow-block|overflow-inline\n  | overflow-wrap|overflow-[xy]|overscroll-behavior|overscroll-behavior-block|overscroll-behavior-inline|overscroll-behavior-[xy]\n  | pad|padding|padding-block|padding-block-end|padding-block-start|padding-bottom|padding-inline|padding-inline-end|padding-inline-start|padding-left\n  | padding-right|padding-top|page-break-after|page-break-before|page-break-inside|paint-order|perspective|perspective-origin\n  | place-content|place-items|place-self|pointer-events|position|prefix|quotes|range|resize|right|rotate|row-gap|ruby-align\n  | ruby-merge|ruby-position|scale|scroll-behavior|scroll-margin|scroll-margin-block|scroll-margin-block-end|scroll-margin-block-start\n  | scroll-margin-bottom|scroll-margin-inline|scroll-margin-inline-end|scroll-margin-inline-start|scroll-margin-left|scroll-margin-right\n  | scroll-margin-top|scroll-padding|scroll-padding-block|scroll-padding-block-end|scroll-padding-block-start|scroll-padding-bottom\n  | scroll-padding-inline|scroll-padding-inline-end|scroll-padding-inline-start|scroll-padding-left|scroll-padding-right\n  | scroll-padding-top|scroll-snap-align|scroll-snap-coordinate|scroll-snap-destination|scroll-snap-stop|scroll-snap-type\n  | scrollbar-color|scrollbar-gutter|scrollbar-width|shape-image-threshold|shape-margin|shape-outside|shape-rendering|size\n  | speak-as|src|stop-color|stop-opacity|stroke|stroke-dasharray|stroke-dashoffset|stroke-linecap|stroke-linejoin|stroke-miterlimit\n  | stroke-opacity|stroke-width|suffix|symbols|system|tab-size|table-layout|text-align|text-align-last|text-anchor|text-combine-upright\n  | text-decoration|text-decoration-color|text-decoration-line|text-decoration-skip|text-decoration-skip-ink|text-decoration-style|text-decoration-thickness\n  | text-emphasis|text-emphasis-color|text-emphasis-position|text-emphasis-style|text-indent|text-justify|text-orientation\n  | text-overflow|text-rendering|text-shadow|text-size-adjust|text-transform|text-underline-offset|text-underline-position|top|touch-action|transform\n  | transform-box|transform-origin|transform-style|transition|transition-delay|transition-duration|transition-property|transition-timing-function\n  | translate|unicode-bidi|unicode-range|user-select|user-zoom|vertical-align|visibility|white-space|widows|width|will-change\n  | word-break|word-spacing|word-wrap|writing-mode|z-index|zoom\n\n  # SVG attributes\n  | alignment-baseline|baseline-shift|clip-rule|color-interpolation|color-interpolation-filters|color-profile\n  | color-rendering|cx|cy|dominant-baseline|enable-background|fill|fill-opacity|fill-rule|flood-color|flood-opacity\n  | glyph-orientation-horizontal|glyph-orientation-vertical|height|kerning|lighting-color|marker-end|marker-mid\n  | marker-start|r|rx|ry|shape-rendering|stop-color|stop-opacity|stroke|stroke-dasharray|stroke-dashoffset|stroke-linecap\n  | stroke-linejoin|stroke-miterlimit|stroke-opacity|stroke-width|text-anchor|width|x|y\n\n  # Not listed on MDN; presumably deprecated\n  | adjust|after|align|align-last|alignment|alignment-adjust|appearance|attachment|azimuth|background-break\n  | balance|baseline|before|bidi|binding|bookmark|bookmark-label|bookmark-level|bookmark-target|border-length\n  | bottom-color|bottom-left-radius|bottom-right-radius|bottom-style|bottom-width|box|box-align|box-direction\n  | box-flex|box-flex-group|box-lines|box-ordinal-group|box-orient|box-pack|break|character|collapse|column\n  | column-break-after|column-break-before|count|counter|crop|cue|cue-after|cue-before|decoration|decoration-break\n  | delay|display-model|display-role|down|drop|drop-initial-after-adjust|drop-initial-after-align|drop-initial-before-adjust\n  | drop-initial-before-align|drop-initial-size|drop-initial-value|duration|elevation|emphasis|family|fit|fit-position\n  | flex-group|float-offset|gap|grid-columns|grid-rows|hanging-punctuation|header|hyphenate|hyphenate-after|hyphenate-before\n  | hyphenate-character|hyphenate-lines|hyphenate-resource|icon|image|increment|indent|index|initial-after-adjust\n  | initial-after-align|initial-before-adjust|initial-before-align|initial-size|initial-value|inline-box-align|iteration-count\n  | justify|label|left-color|left-style|left-width|length|level|line|line-stacking|line-stacking-ruby|line-stacking-shift\n  | line-stacking-strategy|lines|list|mark|mark-after|mark-before|marks|marquee|marquee-direction|marquee-play-count|marquee-speed\n  | marquee-style|max|min|model|move-to|name|nav|nav-down|nav-index|nav-left|nav-right|nav-up|new|numeral|offset|ordinal-group\n  | orient|origin|overflow-style|overhang|pack|page|page-policy|pause|pause-after|pause-before|phonemes|pitch|pitch-range\n  | play-count|play-during|play-state|point|presentation|presentation-level|profile|property|punctuation|punctuation-trim\n  | radius|rate|rendering-intent|repeat|replace|reset|resolution|resource|respond-to|rest|rest-after|rest-before|richness\n  | right-color|right-style|right-width|role|rotation|rotation-point|rows|ruby|ruby-overhang|ruby-span|rule|rule-color\n  | rule-style|rule-width|shadow|size|size-adjust|sizing|space|space-collapse|spacing|span|speak|speak-header|speak-numeral\n  | speak-punctuation|speech|speech-rate|speed|stacking|stacking-ruby|stacking-shift|stacking-strategy|stress|stretch\n  | string-set|style|style-image|style-position|style-type|target|target-name|target-new|target-position|text|text-height\n  | text-justify|text-outline|text-replace|text-wrap|timing-function|top-color|top-left-radius|top-right-radius|top-style\n  | top-width|trim|unicode|up|user-select|variant|voice|voice-balance|voice-duration|voice-family|voice-pitch|voice-pitch-range\n  | voice-rate|voice-stress|voice-volume|volume|weight|white|white-space-collapse|word|wrap\n)\n(?![\\w-])",
					"name": "support.type.property-name.css"
				},
				{
					"match": "(?<![\\w-])(?i:-(?:ah|apple|atsc|epub|hp|khtml|moz|ms|o|rim|ro|tc|wap|webkit|xv)|(?:mso|prince))-[a-zA-Z-]+",
					"name": "support.type.vendored.property-name.css"
				}
			]
		},
		"property-values": {
			"patterns": [
				{
					"include": "#commas"
				},
				{
					"include": "#comment-block"
				},
				{
					"include": "#escapes"
				},
				{
					"include": "#functions"
				},
				{
					"include": "#property-keywords"
				},
				{
					"include": "#unicode-range"
				},
				{
					"include": "#numeric-values"
				},
				{
					"include": "#color-keywords"
				},
				{
					"include": "#string"
				},
				{
					"match": "!\\s*important(?![\\w-])",
					"name": "keyword.other.important.css"
				}
			]
		},
		"pseudo-classes": {
			"captures": {
				"1": {
					"name": "punctuation.definition.entity.css"
				},
				"2": {
					"name": "invalid.illegal.colon.css"
				}
			},
			"match": "(?xi)\n(:)(:*)\n(?: active|any-link|checked|default|disabled|empty|enabled|first\n  | (?:first|last|only)-(?:child|of-type)|focus|focus-visible|focus-within|fullscreen|host|hover\n  | in-range|indeterminate|invalid|left|link|optional|out-of-range\n  | read-only|read-write|required|right|root|scope|target|unresolved\n  | valid|visited\n)(?![\\w-]|\\s*[;}])",
			"name": "entity.other.attribute-name.pseudo-class.css"
		},
		"pseudo-elements": {
			"captures": {
				"1": {
					"name": "punctuation.definition.entity.css"
				},
				"2": {
					"name": "punctuation.definition.entity.css"
				}
			},
			"match": "(?xi)\n(?:\n  (::?)                       # Elements using both : and :: notation\n  (?: after\n    | before\n    | first-letter\n    | first-line\n    | (?:-(?:ah|apple|atsc|epub|hp|khtml|moz\n            |ms|o|rim|ro|tc|wap|webkit|xv)\n        | (?:mso|prince))\n      -[a-z-]+\n  )\n  |\n  (::)                        # Double-colon only\n  (?: backdrop\n    | content\n    | grammar-error\n    | marker\n    | placeholder\n    | selection\n    | shadow\n    | spelling-error\n  )\n)\n(?![\\w-]|\\s*[;}])",
			"name": "entity.other.attribute-name.pseudo-element.css"
		},
		"rule-list": {
			"begin": "{",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.property-list.begin.bracket.curly.css"
				}
			},
			"end": "}",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.property-list.end.bracket.curly.css"
				}
			},
			"name": "meta.property-list.css",
			"patterns": [
				{
					"include": "#rule-list-innards"
				}
			]
		},
		"rule-list-innards": {
			"patterns": [
				{
					"include": "#comment-block"
				},
				{
					"include": "#escapes"
				},
				{
					"include": "#font-features"
				},
				{
					"match": "(?x) (?<![\\w-])\n--\n(?:[-a-zA-Z_]    | [^\\x00-\\x7F])     # First letter\n(?:[-a-zA-Z0-9_] | [^\\x00-\\x7F]      # Remainder of identifier\n  |\\\\(?:[0-9a-fA-F]{1,6}|.)\n)*",
					"name": "variable.css"
				},
				{
					"begin": "(?<![-a-zA-Z])(?=[-a-zA-Z])",
					"end": "$|(?![-a-zA-Z])",
					"name": "meta.property-name.css",
					"patterns": [
						{
							"include": "#property-names"
						}
					]
				},
				{
					"begin": "(:)\\s*",
					"beginCaptures": {
						"1": {
							"name": "punctuation.separator.key-value.css"
						}
					},
					"end": "\\s*(;)|\\s*(?=}|\\))",
					"endCaptures": {
						"1": {
							"name": "punctuation.terminator.rule.css"
						}
					},
					"contentName": "meta.property-value.css",
					"patterns": [
						{
							"include": "#comment-block"
						},
						{
							"include": "#property-values"
						}
					]
				},
				{
					"match": ";",
					"name": "punctuation.terminator.rule.css"
				}
			]
		},
		"selector": {
			"begin": "(?x)\n(?=\n  (?:\\|)?                    # Possible anonymous namespace prefix\n  (?:\n    [-\\[:.*\\#a-zA-Z_]       # Valid selector character\n    |\n    [^\\x00-\\x7F]            # Which can include non-ASCII symbols\n    |\n    \\\\                      # Or an escape sequence\n    (?:[0-9a-fA-F]{1,6}|.)\n  )\n)",
			"end": "(?=\\s*[/@{)])",
			"name": "meta.selector.css",
			"patterns": [
				{
					"include": "#selector-innards"
				}
			]
		},
		"selector-innards": {
			"patterns": [
				{
					"include": "#comment-block"
				},
				{
					"include": "#commas"
				},
				{
					"include": "#escapes"
				},
				{
					"include": "#combinators"
				},
				{
					"captures": {
						"1": {
							"name": "entity.other.namespace-prefix.css"
						},
						"2": {
							"name": "punctuation.separator.css"
						}
					},
					"match": "(?x)\n(?:^|(?<=[\\s,(};]))         # Follows whitespace, comma, semicolon, or bracket\n(?!\n  [-\\w*]+\n  \\|\n  (?!\n      [-\\[:.*\\#a-zA-Z_]    # Make sure there's a selector to match\n    | [^\\x00-\\x7F]\n  )\n)\n(\n  (?: [-a-zA-Z_]    | [^\\x00-\\x7F] )   # First letter\n  (?: [-a-zA-Z0-9_] | [^\\x00-\\x7F]     # Remainder of identifier\n    | \\\\(?:[0-9a-fA-F]{1,6}|.)\n  )*\n  |\n  \\*     # Universal namespace\n)?\n(\\|)     # Namespace separator"
				},
				{
					"include": "#tag-names"
				},
				{
					"match": "\\*",
					"name": "entity.name.tag.wildcard.css"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.entity.css"
						},
						"2": {
							"patterns": [
								{
									"include": "#escapes"
								}
							]
						}
					},
					"match": "(?x) (?<![@\\w-])\n([.\\#])\n# Invalid identifier\n(\n  (?:\n    # Starts with ASCII digits, with possible hyphen preceding it\n    -?[0-9]\n    |\n    # Consists of a hyphen only\n    -                                      # Terminated by either:\n    (?= $                                  # - End-of-line\n      | [\\s,.\\#)\\[:{>+~|]               # - Followed by another selector\n      | /\\*                               # - Followed by a block comment\n    )\n    |\n    # Name contains unescaped ASCII symbol\n    (?:                                    # Check for acceptable preceding characters\n        [-a-zA-Z_0-9]|[^\\x00-\\x7F]       # - Valid selector character\n      | \\\\(?:[0-9a-fA-F]{1,6}|.)         # - Escape sequence\n    )*\n    (?:                                    # Invalid punctuation\n      [!\"'%&(*;<?@^`|\\]}]                 # - NOTE: We exempt `)` from the list of checked\n      |                                    #   symbols to avoid matching `:not(.invalid)`\n      / (?!\\*)                            # - Avoid invalidating the start of a comment\n    )+\n  )\n  # Mark remainder of selector invalid\n  (?: [-a-zA-Z_0-9]|[^\\x00-\\x7F]         # - Otherwise valid identifier characters\n    | \\\\(?:[0-9a-fA-F]{1,6}|.)           # - Escape sequence\n  )*\n)",
					"name": "invalid.illegal.bad-identifier.css"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.entity.css"
						},
						"2": {
							"patterns": [
								{
									"include": "#escapes"
								}
							]
						}
					},
					"match": "(?x)\n(\\.)                                  # Valid class-name\n(\n  (?: [-a-zA-Z_0-9]|[^\\x00-\\x7F]     # Valid identifier characters\n    | \\\\(?:[0-9a-fA-F]{1,6}|.)       # Escape sequence\n  )+\n)                                      # Followed by either:\n(?= $                                  # - End of the line\n  | [\\s,.\\#)\\[:{>+~|]               # - Another selector\n  | /\\*                               # - A block comment\n)",
					"name": "entity.other.attribute-name.class.css"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.entity.css"
						},
						"2": {
							"patterns": [
								{
									"include": "#escapes"
								}
							]
						}
					},
					"match": "(?x)\n(\\#)\n(\n  -?\n  (?![0-9])\n  (?:[-a-zA-Z0-9_]|[^\\x00-\\x7F]|\\\\(?:[0-9a-fA-F]{1,6}|.))+\n)\n(?=$|[\\s,.\\#)\\[:{>+~|]|/\\*)",
					"name": "entity.other.attribute-name.id.css"
				},
				{
					"begin": "\\[",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.entity.begin.bracket.square.css"
						}
					},
					"end": "\\]",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.entity.end.bracket.square.css"
						}
					},
					"name": "meta.attribute-selector.css",
					"patterns": [
						{
							"include": "#comment-block"
						},
						{
							"include": "#string"
						},
						{
							"captures": {
								"1": {
									"name": "storage.modifier.ignore-case.css"
								}
							},
							"match": "(?<=[\"'\\s]|^|\\*/)\\s*([iI])\\s*(?=[\\s\\]]|/\\*|$)"
						},
						{
							"captures": {
								"1": {
									"name": "string.unquoted.attribute-value.css",
									"patterns": [
										{
											"include": "#escapes"
										}
									]
								}
							},
							"match": "(?x)(?<==)\\s*((?!/\\*)(?:[^\\\\\"'\\s\\]]|\\\\.)+)"
						},
						{
							"include": "#escapes"
						},
						{
							"match": "[~|^$*]?=",
							"name": "keyword.operator.pattern.css"
						},
						{
							"match": "\\|",
							"name": "punctuation.separator.css"
						},
						{
							"captures": {
								"1": {
									"name": "entity.other.namespace-prefix.css",
									"patterns": [
										{
											"include": "#escapes"
										}
									]
								}
							},
							"match": "(?x)\n# Qualified namespace prefix\n( -?(?!\\d)(?:[\\w-]|[^\\x00-\\x7F]|\\\\(?:[0-9a-fA-F]{1,6}|.))+\n| \\*\n)\n# Lookahead to ensure there's a valid identifier ahead\n(?=\n  \\| (?!\\s|=|$|\\])\n  (?: -?(?!\\d)\n   |   [\\\\\\w-]\n   |   [^\\x00-\\x7F]\n   )\n)"
						},
						{
							"captures": {
								"1": {
									"name": "entity.other.attribute-name.css",
									"patterns": [
										{
											"include": "#escapes"
										}
									]
								}
							},
							"match": "(?x)\n(-?(?!\\d)(?>[\\w-]|[^\\x00-\\x7F]|\\\\(?:[0-9a-fA-F]{1,6}|.))+)\n\\s*\n(?=[~|^\\]$*=]|/\\*)"
						}
					]
				},
				{
					"include": "#pseudo-classes"
				},
				{
					"include": "#pseudo-elements"
				},
				{
					"include": "#functional-pseudo-classes"
				},
				{
					"match": "(?x) (?<![@\\w-])\n(?=            # Custom element names must:\n  [a-z]        # - start with a lowercase ASCII letter,\n  \\w* -       # - contain at least one dash\n)\n(?:\n  (?![A-Z])    # No uppercase ASCII letters are allowed\n  [\\w-]       # Allow any other word character or dash\n)+\n(?![(\\w-])",
					"name": "entity.name.tag.custom.css"
				}
			]
		},
		"string": {
			"patterns": [
				{
					"begin": "\"",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.css"
						}
					},
					"end": "\"|(?<!\\\\)(?=$|\\n)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.css"
						}
					},
					"name": "string.quoted.double.css",
					"patterns": [
						{
							"begin": "(?:\\G|^)(?=(?:[^\\\\\"]|\\\\.)+$)",
							"end": "$",
							"name": "invalid.illegal.unclosed.string.css",
							"patterns": [
								{
									"include": "#escapes"
								}
							]
						},
						{
							"include": "#escapes"
						}
					]
				},
				{
					"begin": "'",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.css"
						}
					},
					"end": "'|(?<!\\\\)(?=$|\\n)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.css"
						}
					},
					"name": "string.quoted.single.css",
					"patterns": [
						{
							"begin": "(?:\\G|^)(?=(?:[^\\\\']|\\\\.)+$)",
							"end": "$",
							"name": "invalid.illegal.unclosed.string.css",
							"patterns": [
								{
									"include": "#escapes"
								}
							]
						},
						{
							"include": "#escapes"
						}
					]
				}
			]
		},
		"tag-names": {
			"match": "(?xi) (?<![\\w:-])\n(?:\n    # HTML\n    a|abbr|acronym|address|applet|area|article|aside|audio|b|base|basefont|bdi|bdo|bgsound\n  | big|blink|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup|command\n  | content|data|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|element|em|embed|fieldset\n  | figcaption|figure|font|footer|form|frame|frameset|h[1-6]|head|header|hgroup|hr|html|i\n  | iframe|image|img|input|ins|isindex|kbd|keygen|label|legend|li|link|listing|main|map|mark\n  | marquee|math|menu|menuitem|meta|meter|multicol|nav|nextid|nobr|noembed|noframes|noscript\n  | object|ol|optgroup|option|output|p|param|picture|plaintext|pre|progress|q|rb|rp|rt|rtc\n  | ruby|s|samp|script|section|select|shadow|slot|small|source|spacer|span|strike|strong\n  | style|sub|summary|sup|table|tbody|td|template|textarea|tfoot|th|thead|time|title|tr\n  | track|tt|u|ul|var|video|wbr|xmp\n\n  # SVG\n  | altGlyph|altGlyphDef|altGlyphItem|animate|animateColor|animateMotion|animateTransform\n  | circle|clipPath|color-profile|cursor|defs|desc|discard|ellipse|feBlend|feColorMatrix\n  | feComponentTransfer|feComposite|feConvolveMatrix|feDiffuseLighting|feDisplacementMap\n  | feDistantLight|feDropShadow|feFlood|feFuncA|feFuncB|feFuncG|feFuncR|feGaussianBlur\n  | feImage|feMerge|feMergeNode|feMorphology|feOffset|fePointLight|feSpecularLighting\n  | feSpotLight|feTile|feTurbulence|filter|font-face|font-face-format|font-face-name\n  | font-face-src|font-face-uri|foreignObject|g|glyph|glyphRef|hatch|hatchpath|hkern\n  | line|linearGradient|marker|mask|mesh|meshgradient|meshpatch|meshrow|metadata\n  | missing-glyph|mpath|path|pattern|polygon|polyline|radialGradient|rect|set|solidcolor\n  | stop|svg|switch|symbol|text|textPath|tref|tspan|use|view|vkern\n\n  # MathML\n  | annotation|annotation-xml|maction|maligngroup|malignmark|math|menclose|merror|mfenced\n  | mfrac|mglyph|mi|mlabeledtr|mlongdiv|mmultiscripts|mn|mo|mover|mpadded|mphantom|mroot\n  | mrow|ms|mscarries|mscarry|msgroup|msline|mspace|msqrt|msrow|mstack|mstyle|msub|msubsup\n  | msup|mtable|mtd|mtext|mtr|munder|munderover|semantics\n)\n(?=[+~>\\s,.\\#|){:\\[]|/\\*|$)",
			"name": "entity.name.tag.css"
		},
		"unicode-range": {
			"captures": {
				"0": {
					"name": "constant.other.unicode-range.css"
				},
				"1": {
					"name": "punctuation.separator.dash.unicode-range.css"
				}
			},
			"match": "(?<![\\w-])[Uu]\\+[0-9A-Fa-f?]{1,6}(?:(-)[0-9A-Fa-f]{1,6})?(?![\\w-])"
		},
		"url": {
			"begin": "(?i)(?<![\\w@-])(url)(\\()",
			"beginCaptures": {
				"1": {
					"name": "support.function.url.css"
				},
				"2": {
					"name": "punctuation.section.function.begin.bracket.round.css"
				}
			},
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.function.end.bracket.round.css"
				}
			},
			"name": "meta.function.url.css",
			"patterns": [
				{
					"match": "[^'\")\\s]+",
					"name": "variable.parameter.url.css"
				},
				{
					"include": "#string"
				},
				{
					"include": "#comment-block"
				},
				{
					"include": "#escapes"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/.npmrc]---
Location: vscode-main/extensions/css-language-features/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/.vscodeignore]---
Location: vscode-main/extensions/css-language-features/.vscodeignore

```text
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
server/package-lock.json
server/.npmignore
package-lock.json
server/extension.webpack.config.js
extension.webpack.config.js
server/extension-browser.webpack.config.js
extension-browser.webpack.config.js
CONTRIBUTING.md
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/CONTRIBUTING.md]---
Location: vscode-main/extensions/css-language-features/CONTRIBUTING.md

```markdown

## Setup

- Clone [microsoft/vscode](https://github.com/microsoft/vscode)
- Run `npm i` at `/`, this will install
	- Dependencies for `/extension/css-language-features/`
	- Dependencies for `/extension/css-language-features/server/`
	- devDependencies such as `gulp`

- Open `/extensions/css-language-features/` as the workspace in VS Code
- In `/extensions/css-language-features/` run `npm run compile`(or `npm run watch`) to build the client and server
- Run the [`Launch Extension`](https://github.com/microsoft/vscode/blob/master/extensions/css-language-features/.vscode/launch.json) debug target in the Debug View. This will:
	- Launch a new VS Code instance with the `css-language-features` extension loaded
- Open a `.css` file to activate the extension. The extension will start the CSS language server process.
- Add `"css.trace.server": "verbose"` to the settings to observe the communication between client and server in the `CSS Language Server` output.
- Debug the extension and the language server client by setting breakpoints in`css-language-features/client/`
- Debug the language server process by using `Attach to Node Process` command in the  VS Code window opened on `css-language-features`.
  - Pick the process that contains `cssServerMain` in the command line. Hover over `code-insiders` resp `code` processes to see the full process command line.
  - Set breakpoints in `css-language-features/server/`
- Run `Reload Window` command in the launched instance to reload the extension

## Contribute to vscode-css-languageservice

[microsoft/vscode-css-languageservice](https://github.com/microsoft/vscode-css-languageservice) contains the language smarts for CSS/SCSS/Less.
This extension wraps the css language service into a Language Server for VS Code.
If you want to fix CSS/SCSS/Less issues or make improvements, you should make changes at [microsoft/vscode-css-languageservice](https://github.com/microsoft/vscode-css-languageservice).

However, within this extension, you can run a development version of `vscode-css-languageservice` to debug code or test language features interactively:

#### Linking `vscode-css-languageservice` in `css-language-features/server/`

- Clone [microsoft/vscode-css-languageservice](https://github.com/microsoft/vscode-css-languageservice)
- Run `npm i` in `vscode-css-languageservice`
- Run `npm link` in `vscode-css-languageservice`. This will compile and link `vscode-css-languageservice`
- In `css-language-features/server/`, run `npm link vscode-css-languageservice`

#### Testing the development version of `vscode-css-languageservice`

- Open both `vscode-css-languageservice` and this extension in a single workspace with [multi-root workspace](https://code.visualstudio.com/docs/editor/multi-root-workspaces) feature
- Run `npm run watch` in `vscode-css-languageservice` to recompile the extension whenever it changes
- Run `npm run watch` at `css-language-features/server/` to recompile this extension with the linked version of `vscode-css-languageservice`
- Make some changes in `vscode-css-languageservice`
- Now when you run `Launch Extension` debug target, the launched instance will use your development version of `vscode-css-languageservice`. You can interactively test the language features.
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/css-language-features/extension-browser.webpack.config.js

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
		extension: './src/browser/cssClientMain.ts'
	},
	output: {
		filename: 'cssClientMain.js',
		path: path.join(import.meta.dirname, 'client', 'dist', 'browser')
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/extension.webpack.config.js]---
Location: vscode-main/extensions/css-language-features/extension.webpack.config.js

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
		extension: './src/node/cssClientMain.ts',
	},
	output: {
		filename: 'cssClientMain.js',
		path: path.join(import.meta.dirname, 'client', 'dist', 'node')
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/package-lock.json]---
Location: vscode-main/extensions/css-language-features/package-lock.json

```json
{
  "name": "css-language-features",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "css-language-features",
      "version": "1.0.0",
      "license": "MIT",
      "dependencies": {
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

---[FILE: extensions/css-language-features/package.json]---
Location: vscode-main/extensions/css-language-features/package.json

```json
{
  "name": "css-language-features",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "^1.77.0"
  },
  "icon": "icons/css.png",
  "activationEvents": [
    "onLanguage:css",
    "onLanguage:less",
    "onLanguage:scss",
    "onCommand:_css.applyCodeAction"
  ],
  "main": "./client/out/node/cssClientMain",
  "browser": "./client/dist/browser/cssClientMain",
  "capabilities": {
    "virtualWorkspaces": true,
    "untrustedWorkspaces": {
      "supported": true
    }
  },
  "scripts": {
    "compile": "npx gulp compile-extension:css-language-features-client compile-extension:css-language-features-server",
    "watch": "npx gulp watch-extension:css-language-features-client watch-extension:css-language-features-server",
    "test": "node ../../node_modules/mocha/bin/mocha",
    "install-client-next": "npm install vscode-languageclient@next"
  },
  "categories": [
    "Programming Languages"
  ],
  "contributes": {
    "configuration": [
      {
        "order": 22,
        "id": "css",
        "title": "%css.title%",
        "properties": {
          "css.customData": {
            "type": "array",
            "markdownDescription": "%css.customData.desc%",
            "default": [],
            "items": {
              "type": "string"
            },
            "scope": "resource"
          },
          "css.completion.triggerPropertyValueCompletion": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%css.completion.triggerPropertyValueCompletion.desc%"
          },
          "css.completion.completePropertyWithSemicolon": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%css.completion.completePropertyWithSemicolon.desc%"
          },
          "css.validate": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%css.validate.desc%"
          },
          "css.hover.documentation": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%css.hover.documentation%"
          },
          "css.hover.references": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%css.hover.references%"
          },
          "css.lint.compatibleVendorPrefixes": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "description": "%css.lint.compatibleVendorPrefixes.desc%"
          },
          "css.lint.vendorPrefix": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "warning",
            "description": "%css.lint.vendorPrefix.desc%"
          },
          "css.lint.duplicateProperties": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "description": "%css.lint.duplicateProperties.desc%"
          },
          "css.lint.emptyRules": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "warning",
            "description": "%css.lint.emptyRules.desc%"
          },
          "css.lint.importStatement": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "description": "%css.lint.importStatement.desc%"
          },
          "css.lint.boxModel": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "markdownDescription": "%css.lint.boxModel.desc%"
          },
          "css.lint.universalSelector": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "markdownDescription": "%css.lint.universalSelector.desc%"
          },
          "css.lint.zeroUnits": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "description": "%css.lint.zeroUnits.desc%"
          },
          "css.lint.fontFaceProperties": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "warning",
            "markdownDescription": "%css.lint.fontFaceProperties.desc%"
          },
          "css.lint.hexColorLength": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "error",
            "description": "%css.lint.hexColorLength.desc%"
          },
          "css.lint.argumentsInColorFunction": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "error",
            "description": "%css.lint.argumentsInColorFunction.desc%"
          },
          "css.lint.unknownProperties": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "warning",
            "description": "%css.lint.unknownProperties.desc%"
          },
          "css.lint.validProperties": {
            "type": "array",
            "uniqueItems": true,
            "items": {
              "type": "string"
            },
            "scope": "resource",
            "default": [],
            "description": "%css.lint.validProperties.desc%"
          },
          "css.lint.ieHack": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "description": "%css.lint.ieHack.desc%"
          },
          "css.lint.unknownVendorSpecificProperties": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "description": "%css.lint.unknownVendorSpecificProperties.desc%"
          },
          "css.lint.propertyIgnoredDueToDisplay": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "warning",
            "markdownDescription": "%css.lint.propertyIgnoredDueToDisplay.desc%"
          },
          "css.lint.important": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "markdownDescription": "%css.lint.important.desc%"
          },
          "css.lint.float": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "markdownDescription": "%css.lint.float.desc%"
          },
          "css.lint.idSelector": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "description": "%css.lint.idSelector.desc%"
          },
          "css.lint.unknownAtRules": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "warning",
            "description": "%css.lint.unknownAtRules.desc%"
          },
          "css.trace.server": {
            "type": "string",
            "scope": "window",
            "enum": [
              "off",
              "messages",
              "verbose"
            ],
            "default": "off",
            "description": "%css.trace.server.desc%"
          },
          "css.format.enable": {
            "type": "boolean",
            "scope": "window",
            "default": true,
            "description": "%css.format.enable.desc%"
          },
          "css.format.newlineBetweenSelectors": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "markdownDescription": "%css.format.newlineBetweenSelectors.desc%"
          },
          "css.format.newlineBetweenRules": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "markdownDescription": "%css.format.newlineBetweenRules.desc%"
          },
          "css.format.spaceAroundSelectorSeparator": {
            "type": "boolean",
            "scope": "resource",
            "default": false,
            "markdownDescription": "%css.format.spaceAroundSelectorSeparator.desc%"
          },
          "css.format.braceStyle": {
            "type": "string",
            "scope": "resource",
            "default": "collapse",
            "enum": [
              "collapse",
              "expand"
            ],
            "markdownDescription": "%css.format.braceStyle.desc%"
          },
          "css.format.preserveNewLines": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "markdownDescription": "%css.format.preserveNewLines.desc%"
          },
          "css.format.maxPreserveNewLines": {
            "type": [
              "number",
              "null"
            ],
            "scope": "resource",
            "default": null,
            "markdownDescription": "%css.format.maxPreserveNewLines.desc%"
          }
        }
      },
      {
        "id": "scss",
        "order": 24,
        "title": "%scss.title%",
        "properties": {
          "scss.completion.triggerPropertyValueCompletion": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%scss.completion.triggerPropertyValueCompletion.desc%"
          },
          "scss.completion.completePropertyWithSemicolon": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%scss.completion.completePropertyWithSemicolon.desc%"
          },
          "scss.validate": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%scss.validate.desc%"
          },
          "scss.hover.documentation": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%scss.hover.documentation%"
          },
          "scss.hover.references": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%scss.hover.references%"
          },
          "scss.lint.compatibleVendorPrefixes": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "description": "%scss.lint.compatibleVendorPrefixes.desc%"
          },
          "scss.lint.vendorPrefix": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "warning",
            "description": "%scss.lint.vendorPrefix.desc%"
          },
          "scss.lint.duplicateProperties": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "description": "%scss.lint.duplicateProperties.desc%"
          },
          "scss.lint.emptyRules": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "warning",
            "description": "%scss.lint.emptyRules.desc%"
          },
          "scss.lint.importStatement": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "description": "%scss.lint.importStatement.desc%"
          },
          "scss.lint.boxModel": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "markdownDescription": "%scss.lint.boxModel.desc%"
          },
          "scss.lint.universalSelector": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "markdownDescription": "%scss.lint.universalSelector.desc%"
          },
          "scss.lint.zeroUnits": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "description": "%scss.lint.zeroUnits.desc%"
          },
          "scss.lint.fontFaceProperties": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "warning",
            "markdownDescription": "%scss.lint.fontFaceProperties.desc%"
          },
          "scss.lint.hexColorLength": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "error",
            "description": "%scss.lint.hexColorLength.desc%"
          },
          "scss.lint.argumentsInColorFunction": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "error",
            "description": "%scss.lint.argumentsInColorFunction.desc%"
          },
          "scss.lint.unknownProperties": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "warning",
            "description": "%scss.lint.unknownProperties.desc%"
          },
          "scss.lint.validProperties": {
            "type": "array",
            "uniqueItems": true,
            "items": {
              "type": "string"
            },
            "scope": "resource",
            "default": [],
            "description": "%scss.lint.validProperties.desc%"
          },
          "scss.lint.ieHack": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "description": "%scss.lint.ieHack.desc%"
          },
          "scss.lint.unknownVendorSpecificProperties": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "description": "%scss.lint.unknownVendorSpecificProperties.desc%"
          },
          "scss.lint.propertyIgnoredDueToDisplay": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "warning",
            "markdownDescription": "%scss.lint.propertyIgnoredDueToDisplay.desc%"
          },
          "scss.lint.important": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "markdownDescription": "%scss.lint.important.desc%"
          },
          "scss.lint.float": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "markdownDescription": "%scss.lint.float.desc%"
          },
          "scss.lint.idSelector": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "description": "%scss.lint.idSelector.desc%"
          },
          "scss.lint.unknownAtRules": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "warning",
            "description": "%scss.lint.unknownAtRules.desc%"
          },
          "scss.format.enable": {
            "type": "boolean",
            "scope": "window",
            "default": true,
            "description": "%scss.format.enable.desc%"
          },
          "scss.format.newlineBetweenSelectors": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "markdownDescription": "%scss.format.newlineBetweenSelectors.desc%"
          },
          "scss.format.newlineBetweenRules": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "markdownDescription": "%scss.format.newlineBetweenRules.desc%"
          },
          "scss.format.spaceAroundSelectorSeparator": {
            "type": "boolean",
            "scope": "resource",
            "default": false,
            "markdownDescription": "%scss.format.spaceAroundSelectorSeparator.desc%"
          },
          "scss.format.braceStyle": {
            "type": "string",
            "scope": "resource",
            "default": "collapse",
            "enum": [
              "collapse",
              "expand"
            ],
            "markdownDescription": "%scss.format.braceStyle.desc%"
          },
          "scss.format.preserveNewLines": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "markdownDescription": "%scss.format.preserveNewLines.desc%"
          },
          "scss.format.maxPreserveNewLines": {
            "type": [
              "number",
              "null"
            ],
            "scope": "resource",
            "default": null,
            "markdownDescription": "%scss.format.maxPreserveNewLines.desc%"
          }
        }
      },
      {
        "id": "less",
        "order": 23,
        "type": "object",
        "title": "%less.title%",
        "properties": {
          "less.completion.triggerPropertyValueCompletion": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%less.completion.triggerPropertyValueCompletion.desc%"
          },
          "less.completion.completePropertyWithSemicolon": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%less.completion.completePropertyWithSemicolon.desc%"
          },
          "less.validate": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%less.validate.desc%"
          },
          "less.hover.documentation": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%less.hover.documentation%"
          },
          "less.hover.references": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%less.hover.references%"
          },
          "less.lint.compatibleVendorPrefixes": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "description": "%less.lint.compatibleVendorPrefixes.desc%"
          },
          "less.lint.vendorPrefix": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "warning",
            "description": "%less.lint.vendorPrefix.desc%"
          },
          "less.lint.duplicateProperties": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "description": "%less.lint.duplicateProperties.desc%"
          },
          "less.lint.emptyRules": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "warning",
            "description": "%less.lint.emptyRules.desc%"
          },
          "less.lint.importStatement": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "description": "%less.lint.importStatement.desc%"
          },
          "less.lint.boxModel": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "markdownDescription": "%less.lint.boxModel.desc%"
          },
          "less.lint.universalSelector": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "markdownDescription": "%less.lint.universalSelector.desc%"
          },
          "less.lint.zeroUnits": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "description": "%less.lint.zeroUnits.desc%"
          },
          "less.lint.fontFaceProperties": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "warning",
            "markdownDescription": "%less.lint.fontFaceProperties.desc%"
          },
          "less.lint.hexColorLength": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "error",
            "description": "%less.lint.hexColorLength.desc%"
          },
          "less.lint.argumentsInColorFunction": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "error",
            "description": "%less.lint.argumentsInColorFunction.desc%"
          },
          "less.lint.unknownProperties": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "warning",
            "description": "%less.lint.unknownProperties.desc%"
          },
          "less.lint.validProperties": {
            "type": "array",
            "uniqueItems": true,
            "items": {
              "type": "string"
            },
            "scope": "resource",
            "default": [],
            "description": "%less.lint.validProperties.desc%"
          },
          "less.lint.ieHack": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "description": "%less.lint.ieHack.desc%"
          },
          "less.lint.unknownVendorSpecificProperties": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "description": "%less.lint.unknownVendorSpecificProperties.desc%"
          },
          "less.lint.propertyIgnoredDueToDisplay": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "warning",
            "markdownDescription": "%less.lint.propertyIgnoredDueToDisplay.desc%"
          },
          "less.lint.important": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "markdownDescription": "%less.lint.important.desc%"
          },
          "less.lint.float": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "markdownDescription": "%less.lint.float.desc%"
          },
          "less.lint.idSelector": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "ignore",
            "description": "%less.lint.idSelector.desc%"
          },
          "less.lint.unknownAtRules": {
            "type": "string",
            "scope": "resource",
            "enum": [
              "ignore",
              "warning",
              "error"
            ],
            "default": "warning",
            "description": "%less.lint.unknownAtRules.desc%"
          },
          "less.format.enable": {
            "type": "boolean",
            "scope": "window",
            "default": true,
            "description": "%less.format.enable.desc%"
          },
          "less.format.newlineBetweenSelectors": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "markdownDescription": "%less.format.newlineBetweenSelectors.desc%"
          },
          "less.format.newlineBetweenRules": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "markdownDescription": "%less.format.newlineBetweenRules.desc%"
          },
          "less.format.spaceAroundSelectorSeparator": {
            "type": "boolean",
            "scope": "resource",
            "default": false,
            "markdownDescription": "%less.format.spaceAroundSelectorSeparator.desc%"
          },
          "less.format.braceStyle": {
            "type": "string",
            "scope": "resource",
            "default": "collapse",
            "enum": [
              "collapse",
              "expand"
            ],
            "markdownDescription": "%less.format.braceStyle.desc%"
          },
          "less.format.preserveNewLines": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "markdownDescription": "%less.format.preserveNewLines.desc%"
          },
          "less.format.maxPreserveNewLines": {
            "type": [
              "number",
              "null"
            ],
            "scope": "resource",
            "default": null,
            "markdownDescription": "%less.format.maxPreserveNewLines.desc%"
          }
        }
      }
    ],
    "configurationDefaults": {
      "[css]": {
        "editor.suggest.insertMode": "replace"
      },
      "[scss]": {
        "editor.suggest.insertMode": "replace"
      },
      "[less]": {
        "editor.suggest.insertMode": "replace"
      }
    },
    "jsonValidation": [
      {
        "fileMatch": "*.css-data.json",
        "url": "https://raw.githubusercontent.com/microsoft/vscode-css-languageservice/master/docs/customData.schema.json"
      },
      {
        "fileMatch": "package.json",
        "url": "./schemas/package.schema.json"
      }
    ]
  },
  "dependencies": {
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

---[FILE: extensions/css-language-features/package.nls.json]---
Location: vscode-main/extensions/css-language-features/package.nls.json

```json
{
	"displayName": "CSS Language Features",
	"description": "Provides rich language support for CSS, LESS and SCSS files.",
	"css.title": "CSS",
	"css.customData.desc": "A list of relative file paths pointing to JSON files following the [custom data format](https://github.com/microsoft/vscode-css-languageservice/blob/master/docs/customData.md).\n\nVS Code loads custom data on startup to enhance its CSS support for CSS custom properties (variables), at-rules, pseudo-classes, and pseudo-elements you specify in the JSON files.\n\nThe file paths are relative to workspace and only workspace folder settings are considered.",
	"css.completion.triggerPropertyValueCompletion.desc": "By default, VS Code triggers property value completion after selecting a CSS property. Use this setting to disable this behavior.",
	"css.completion.completePropertyWithSemicolon.desc": "Insert semicolon at end of line when completing CSS properties.",
	"css.lint.argumentsInColorFunction.desc": "Invalid number of parameters.",
	"css.lint.boxModel.desc": "Do not use `width` or `height` when using `padding` or `border`.",
	"css.lint.compatibleVendorPrefixes.desc": "When using a vendor-specific prefix make sure to also include all other vendor-specific properties.",
	"css.lint.duplicateProperties.desc": "Do not use duplicate style definitions.",
	"css.lint.emptyRules.desc": "Do not use empty rulesets.",
	"css.lint.float.desc": "Avoid using `float`. Floats lead to fragile CSS that is easy to break if one aspect of the layout changes.",
	"css.lint.fontFaceProperties.desc": "`@font-face` rule must define `src` and `font-family` properties.",
	"css.lint.hexColorLength.desc": "Hex colors must consist of 3, 4, 6 or 8 hex numbers.",
	"css.lint.idSelector.desc": "Selectors should not contain IDs because these rules are too tightly coupled with the HTML.",
	"css.lint.ieHack.desc": "IE hacks are only necessary when supporting IE7 and older.",
	"css.lint.important.desc": "Avoid using `!important`. It is an indication that the specificity of the entire CSS has gotten out of control and needs to be refactored.",
	"css.lint.importStatement.desc": "Import statements do not load in parallel.",
	"css.lint.propertyIgnoredDueToDisplay.desc": "Property is ignored due to the display. E.g. with `display: inline`, the `width`, `height`, `margin-top`, `margin-bottom`, and `float` properties have no effect.",
	"css.lint.universalSelector.desc": "The universal selector (`*`) is known to be slow.",
	"css.lint.unknownAtRules.desc": "Unknown at-rule.",
	"css.lint.unknownProperties.desc": "Unknown property.",
	"css.lint.validProperties.desc": "A list of properties that are not validated against the `unknownProperties` rule.",
	"css.lint.unknownVendorSpecificProperties.desc": "Unknown vendor specific property.",
	"css.lint.vendorPrefix.desc": "When using a vendor-specific prefix, also include the standard property.",
	"css.lint.zeroUnits.desc": "No unit for zero needed.",
	"css.trace.server.desc": "Traces the communication between VS Code and the CSS language server.",
	"css.validate.title": "Controls CSS validation and problem severities.",
	"css.validate.desc": "Enables or disables all validations.",
	"css.hover.documentation": "Show property and value documentation in CSS hovers.",
	"css.hover.references": "Show references to MDN in CSS hovers.",
	"css.format.enable.desc": "Enable/disable default CSS formatter.",
	"css.format.newlineBetweenSelectors.desc": "Separate selectors with a new line.",
	"css.format.newlineBetweenRules.desc": "Separate rulesets by a blank line.",
	"css.format.spaceAroundSelectorSeparator.desc": "Ensure a space character around selector separators '>', '+', '~' (e.g. `a > b`).",
	"css.format.braceStyle.desc": "Put braces on the same line as rules (`collapse`) or put braces on own line (`expand`).",
	"css.format.preserveNewLines.desc": "Whether existing line breaks before rules and declarations should be preserved.",
	"css.format.maxPreserveNewLines.desc": "Maximum number of line breaks to be preserved in one chunk, when `#css.format.preserveNewLines#` is enabled.",
	"less.title": "LESS",
	"less.completion.triggerPropertyValueCompletion.desc": "By default, VS Code triggers property value completion after selecting a CSS property. Use this setting to disable this behavior.",
	"less.completion.completePropertyWithSemicolon.desc": "Insert semicolon at end of line when completing CSS properties.",
	"less.lint.argumentsInColorFunction.desc": "Invalid number of parameters.",
	"less.lint.boxModel.desc": "Do not use `width` or `height` when using `padding` or `border`.",
	"less.lint.compatibleVendorPrefixes.desc": "When using a vendor-specific prefix make sure to also include all other vendor-specific properties.",
	"less.lint.duplicateProperties.desc": "Do not use duplicate style definitions.",
	"less.lint.emptyRules.desc": "Do not use empty rulesets.",
	"less.lint.float.desc": "Avoid using `float`. Floats lead to fragile CSS that is easy to break if one aspect of the layout changes.",
	"less.lint.fontFaceProperties.desc": "`@font-face` rule must define `src` and `font-family` properties.",
	"less.lint.hexColorLength.desc": "Hex colors must consist of 3, 4, 6 or 8 hex numbers.",
	"less.lint.idSelector.desc": "Selectors should not contain IDs because these rules are too tightly coupled with the HTML.",
	"less.lint.ieHack.desc": "IE hacks are only necessary when supporting IE7 and older.",
	"less.lint.important.desc": "Avoid using `!important`. It is an indication that the specificity of the entire CSS has gotten out of control and needs to be refactored.",
	"less.lint.importStatement.desc": "Import statements do not load in parallel.",
	"less.lint.propertyIgnoredDueToDisplay.desc": "Property is ignored due to the display. E.g. with `display: inline`, the `width`, `height`, `margin-top`, `margin-bottom`, and `float` properties have no effect.",
	"less.lint.universalSelector.desc": "The universal selector (`*`) is known to be slow.",
	"less.lint.unknownAtRules.desc": "Unknown at-rule.",
	"less.lint.unknownProperties.desc": "Unknown property.",
	"less.lint.validProperties.desc": "A list of properties that are not validated against the `unknownProperties` rule.",
	"less.lint.unknownVendorSpecificProperties.desc": "Unknown vendor specific property.",
	"less.lint.vendorPrefix.desc": "When using a vendor-specific prefix, also include the standard property.",
	"less.lint.zeroUnits.desc": "No unit for zero needed.",
	"less.validate.title": "Controls LESS validation and problem severities.",
	"less.validate.desc": "Enables or disables all validations.",
	"less.hover.documentation": "Show property and value documentation in LESS hovers.",
	"less.hover.references": "Show references to MDN in LESS hovers.",
	"less.format.enable.desc": "Enable/disable default LESS formatter.",
	"less.format.newlineBetweenSelectors.desc": "Separate selectors with a new line.",
	"less.format.newlineBetweenRules.desc": "Separate rulesets by a blank line.",
	"less.format.spaceAroundSelectorSeparator.desc": "Ensure a space character around selector separators '>', '+', '~' (e.g. `a > b`).",
	"less.format.braceStyle.desc": "Put braces on the same line as rules (`collapse`) or put braces on own line (`expand`).",
	"less.format.preserveNewLines.desc": "Whether existing line breaks before rules and declarations should be preserved.",
	"less.format.maxPreserveNewLines.desc": "Maximum number of line breaks to be preserved in one chunk, when `#less.format.preserveNewLines#` is enabled.",
	"scss.title": "SCSS (Sass)",
	"scss.completion.triggerPropertyValueCompletion.desc": "By default, VS Code triggers property value completion after selecting a CSS property. Use this setting to disable this behavior.",
	"scss.completion.completePropertyWithSemicolon.desc": "Insert semicolon at end of line when completing CSS properties.",
	"scss.lint.argumentsInColorFunction.desc": "Invalid number of parameters.",
	"scss.lint.boxModel.desc": "Do not use `width` or `height` when using `padding` or `border`.",
	"scss.lint.compatibleVendorPrefixes.desc": "When using a vendor-specific prefix make sure to also include all other vendor-specific properties.",
	"scss.lint.duplicateProperties.desc": "Do not use duplicate style definitions.",
	"scss.lint.emptyRules.desc": "Do not use empty rulesets.",
	"scss.lint.float.desc": "Avoid using `float`. Floats lead to fragile CSS that is easy to break if one aspect of the layout changes.",
	"scss.lint.fontFaceProperties.desc": "`@font-face` rule must define `src` and `font-family` properties.",
	"scss.lint.hexColorLength.desc": "Hex colors must consist of 3, 4, 6 or 8 hex numbers.",
	"scss.lint.idSelector.desc": "Selectors should not contain IDs because these rules are too tightly coupled with the HTML.",
	"scss.lint.ieHack.desc": "IE hacks are only necessary when supporting IE7 and older.",
	"scss.lint.important.desc": "Avoid using `!important`. It is an indication that the specificity of the entire CSS has gotten out of control and needs to be refactored.",
	"scss.lint.importStatement.desc": "Import statements do not load in parallel.",
	"scss.lint.propertyIgnoredDueToDisplay.desc": "Property is ignored due to the display. E.g. with `display: inline`, the `width`, `height`, `margin-top`, `margin-bottom`, and `float` properties have no effect.",
	"scss.lint.universalSelector.desc": "The universal selector (`*`) is known to be slow.",
	"scss.lint.unknownAtRules.desc": "Unknown at-rule.",
	"scss.lint.unknownProperties.desc": "Unknown property.",
	"scss.lint.validProperties.desc": "A list of properties that are not validated against the `unknownProperties` rule.",
	"scss.lint.unknownVendorSpecificProperties.desc": "Unknown vendor specific property.",
	"scss.lint.vendorPrefix.desc": "When using a vendor-specific prefix, also include the standard property.",
	"scss.lint.zeroUnits.desc": "No unit for zero needed.",
	"scss.validate.title": "Controls SCSS validation and problem severities.",
	"scss.validate.desc": "Enables or disables all validations.",
	"scss.hover.documentation": "Show property and value documentation in SCSS hovers.",
	"scss.hover.references": "Show references to MDN in SCSS hovers.",
	"scss.format.enable.desc": "Enable/disable default SCSS formatter.",
	"scss.format.newlineBetweenSelectors.desc": "Separate selectors with a new line.",
	"scss.format.newlineBetweenRules.desc": "Separate rulesets by a blank line.",
	"scss.format.spaceAroundSelectorSeparator.desc": "Ensure a space character around selector separators '>', '+', '~' (e.g. `a > b`).",
	"scss.format.braceStyle.desc": "Put braces on the same line as rules (`collapse`) or put braces on own line (`expand`).",
	"scss.format.preserveNewLines.desc": "Whether existing line breaks before rules and declarations should be preserved.",
	"scss.format.maxPreserveNewLines.desc": "Maximum number of line breaks to be preserved in one chunk, when `#scss.format.preserveNewLines#` is enabled.",
	"css.colorDecorators.enable.deprecationMessage": "The setting `css.colorDecorators.enable` has been deprecated in favor of `editor.colorDecorators`.",
	"scss.colorDecorators.enable.deprecationMessage": "The setting `scss.colorDecorators.enable` has been deprecated in favor of `editor.colorDecorators`.",
	"less.colorDecorators.enable.deprecationMessage": "The setting `less.colorDecorators.enable` has been deprecated in favor of `editor.colorDecorators`."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/README.md]---
Location: vscode-main/extensions/css-language-features/README.md

```markdown
# Language Features for CSS, SCSS, and LESS files

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

## Features

See [CSS, SCSS and Less in VS Code](https://code.visualstudio.com/docs/languages/css) to learn about the features of this extension.

Please read the [CONTRIBUTING.md](https://github.com/microsoft/vscode/blob/master/extensions/css-language-features/CONTRIBUTING.md) file to learn how to contribute to this extension.
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/.vscode/launch.json]---
Location: vscode-main/extensions/css-language-features/.vscode/launch.json

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
			"outFiles": [
				"${workspaceFolder}/client/out/**/*.js"
			],
			"smartStep": true
		},
		{
			"name": "Launch Tests",
			"type": "extensionHost",
			"request": "launch",
			"runtimeExecutable": "${execPath}",
			"args": [
				"--extensionDevelopmentPath=${workspaceFolder}",
				"--extensionTestsPath=${workspaceFolder}/client/out/test"
			],
			"stopOnEntry": false,
			"sourceMaps": true,
			"outFiles": [
				"${workspaceFolder}/client/out/test/**/*.js"
			]
		},
		{
			"name": "Server Unit Tests",
			"type": "node",
			"request": "launch",
			"program": "${workspaceRoot}/node_modules/mocha/bin/_mocha",
			"stopOnEntry": false,
			"args": [
				"--timeout",
				"999999",
				"--colors"
			],
			"cwd": "${workspaceRoot}",
			"runtimeExecutable": null,
			"runtimeArgs": [],
			"env": {},
			"sourceMaps": true,
			"outFiles": [
				"${workspaceRoot}/server/out/**"
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/.vscode/settings.json]---
Location: vscode-main/extensions/css-language-features/.vscode/settings.json

```json
{
  "prettier.semi": true,
  "prettier.singleQuote": true,
  "prettier.printWidth": 120,
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/.vscode/tasks.json]---
Location: vscode-main/extensions/css-language-features/.vscode/tasks.json

```json
{
	"version": "2.0.0",
	"tasks": [
		{
			"type": "npm",
			"script": "compile",
			"problemMatcher": "$tsc-watch",
			"isBackground": true,
			"presentation": {
				"reveal": "never"
			},
			"group": {
				"kind": "build",
				"isDefault": true
			}
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/client/tsconfig.json]---
Location: vscode-main/extensions/css-language-features/client/tsconfig.json

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
		"../../../src/vscode-dts/vscode.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/client/src/cssClient.ts]---
Location: vscode-main/extensions/css-language-features/client/src/cssClient.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { commands, CompletionItem, CompletionItemKind, ExtensionContext, languages, Position, Range, SnippetString, TextEdit, window, TextDocument, CompletionContext, CancellationToken, ProviderResult, CompletionList, FormattingOptions, workspace, l10n } from 'vscode';
import { Disposable, LanguageClientOptions, ProvideCompletionItemsSignature, NotificationType, BaseLanguageClient, DocumentRangeFormattingParams, DocumentRangeFormattingRequest } from 'vscode-languageclient';
import { getCustomDataSource } from './customData';
import { RequestService, serveFileSystemRequests } from './requests';

namespace CustomDataChangedNotification {
	export const type: NotificationType<string[]> = new NotificationType('css/customDataChanged');
}

export type LanguageClientConstructor = (name: string, description: string, clientOptions: LanguageClientOptions) => BaseLanguageClient;

export interface Runtime {
	TextDecoder: typeof TextDecoder;
	fs?: RequestService;
}

interface FormatterRegistration {
	readonly languageId: string;
	readonly settingId: string;
	provider: Disposable | undefined;
}

interface CSSFormatSettings {
	newlineBetweenSelectors?: boolean;
	newlineBetweenRules?: boolean;
	spaceAroundSelectorSeparator?: boolean;
	braceStyle?: 'collapse' | 'expand';
	preserveNewLines?: boolean;
	maxPreserveNewLines?: number | null;
}

const cssFormatSettingKeys: (keyof CSSFormatSettings)[] = ['newlineBetweenSelectors', 'newlineBetweenRules', 'spaceAroundSelectorSeparator', 'braceStyle', 'preserveNewLines', 'maxPreserveNewLines'];

export async function startClient(context: ExtensionContext, newLanguageClient: LanguageClientConstructor, runtime: Runtime): Promise<BaseLanguageClient> {

	const customDataSource = getCustomDataSource(context.subscriptions);

	const documentSelector = ['css', 'scss', 'less'];

	const formatterRegistrations: FormatterRegistration[] = documentSelector.map(languageId => ({
		languageId, settingId: `${languageId}.format.enable`, provider: undefined
	}));

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		documentSelector,
		synchronize: {
			configurationSection: ['css', 'scss', 'less']
		},
		initializationOptions: {
			handledSchemas: ['file'],
			provideFormatter: false, // tell the server to not provide formatting capability
			customCapabilities: { rangeFormatting: { editLimit: 10000 } }
		},
		middleware: {
			provideCompletionItem(document: TextDocument, position: Position, context: CompletionContext, token: CancellationToken, next: ProvideCompletionItemsSignature): ProviderResult<CompletionItem[] | CompletionList> {
				// testing the replace / insert mode
				function updateRanges(item: CompletionItem) {
					const range = item.range;
					if (range instanceof Range && range.end.isAfter(position) && range.start.isBeforeOrEqual(position)) {
						item.range = { inserting: new Range(range.start, position), replacing: range };

					}
				}
				function updateLabel(item: CompletionItem) {
					if (item.kind === CompletionItemKind.Color) {
						item.label = {
							label: item.label as string,
							description: (item.documentation as string)
						};
					}
				}
				// testing the new completion
				function updateProposals(r: CompletionItem[] | CompletionList | null | undefined): CompletionItem[] | CompletionList | null | undefined {
					if (r) {
						(Array.isArray(r) ? r : r.items).forEach(updateRanges);
						(Array.isArray(r) ? r : r.items).forEach(updateLabel);
					}
					return r;
				}
				function isThenable<T>(obj: unknown): obj is Thenable<T> {
					return !!obj && typeof (obj as unknown as Thenable<T>).then === 'function';
				}

				const r = next(document, position, context, token);
				if (isThenable<CompletionItem[] | CompletionList | null | undefined>(r)) {
					return r.then(updateProposals);
				}
				return updateProposals(r);
			}
		}
	};

	// Create the language client and start the client.
	const client = newLanguageClient('css', l10n.t('CSS Language Server'), clientOptions);
	client.registerProposedFeatures();

	await client.start();

	client.sendNotification(CustomDataChangedNotification.type, customDataSource.uris);
	customDataSource.onDidChange(() => {
		client.sendNotification(CustomDataChangedNotification.type, customDataSource.uris);
	});

	// manually register / deregister format provider based on the `css/less/scss.format.enable` setting avoiding issues with late registration. See #71652.
	for (const registration of formatterRegistrations) {
		updateFormatterRegistration(registration);
		context.subscriptions.push({ dispose: () => registration.provider?.dispose() });
		context.subscriptions.push(workspace.onDidChangeConfiguration(e => e.affectsConfiguration(registration.settingId) && updateFormatterRegistration(registration)));
	}

	serveFileSystemRequests(client, runtime);


	context.subscriptions.push(initCompletionProvider());

	function initCompletionProvider(): Disposable {
		const regionCompletionRegExpr = /^(\s*)(\/(\*\s*(#\w*)?)?)?$/;

		return languages.registerCompletionItemProvider(documentSelector, {
			provideCompletionItems(doc: TextDocument, pos: Position) {
				const lineUntilPos = doc.getText(new Range(new Position(pos.line, 0), pos));
				const match = lineUntilPos.match(regionCompletionRegExpr);
				if (match) {
					const range = new Range(new Position(pos.line, match[1].length), pos);
					const beginProposal = new CompletionItem('#region', CompletionItemKind.Snippet);
					beginProposal.range = range; TextEdit.replace(range, '/* #region */');
					beginProposal.insertText = new SnippetString('/* #region $1*/');
					beginProposal.documentation = l10n.t('Folding Region Start');
					beginProposal.filterText = match[2];
					beginProposal.sortText = 'za';
					const endProposal = new CompletionItem('#endregion', CompletionItemKind.Snippet);
					endProposal.range = range;
					endProposal.insertText = '/* #endregion */';
					endProposal.documentation = l10n.t('Folding Region End');
					endProposal.sortText = 'zb';
					endProposal.filterText = match[2];
					return [beginProposal, endProposal];
				}
				return null;
			}
		});
	}

	commands.registerCommand('_css.applyCodeAction', applyCodeAction);

	function applyCodeAction(uri: string, documentVersion: number, edits: TextEdit[]) {
		const textEditor = window.activeTextEditor;
		if (textEditor && textEditor.document.uri.toString() === uri) {
			if (textEditor.document.version !== documentVersion) {
				window.showInformationMessage(l10n.t('CSS fix is outdated and can\'t be applied to the document.'));
			}
			textEditor.edit(mutator => {
				for (const edit of edits) {
					mutator.replace(client.protocol2CodeConverter.asRange(edit.range), edit.newText);
				}
			}).then(success => {
				if (!success) {
					window.showErrorMessage(l10n.t('Failed to apply CSS fix to the document. Please consider opening an issue with steps to reproduce.'));
				}
			});
		}
	}

	function updateFormatterRegistration(registration: FormatterRegistration) {
		const formatEnabled = workspace.getConfiguration().get(registration.settingId);
		if (!formatEnabled && registration.provider) {
			registration.provider.dispose();
			registration.provider = undefined;
		} else if (formatEnabled && !registration.provider) {
			registration.provider = languages.registerDocumentRangeFormattingEditProvider(registration.languageId, {
				provideDocumentRangeFormattingEdits(document: TextDocument, range: Range, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]> {
					const filesConfig = workspace.getConfiguration('files', document);

					const fileFormattingOptions = {
						trimTrailingWhitespace: filesConfig.get<boolean>('trimTrailingWhitespace'),
						trimFinalNewlines: filesConfig.get<boolean>('trimFinalNewlines'),
						insertFinalNewline: filesConfig.get<boolean>('insertFinalNewline'),
					};
					const params: DocumentRangeFormattingParams = {
						textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
						range: client.code2ProtocolConverter.asRange(range),
						options: client.code2ProtocolConverter.asFormattingOptions(options, fileFormattingOptions)
					};
					// add the css formatter options from the settings
					const formatterSettings = workspace.getConfiguration(registration.languageId, document).get<CSSFormatSettings>('format');
					if (formatterSettings) {
						for (const key of cssFormatSettingKeys) {
							const val = formatterSettings[key];
							if (val !== undefined && val !== null) {
								params.options[key] = val;
							}
						}
					}
					return client.sendRequest(DocumentRangeFormattingRequest.type, params, token).then(
						client.protocol2CodeConverter.asTextEdits,
						(error) => {
							client.handleFailedRequest(DocumentRangeFormattingRequest.type, undefined, error, []);
							return Promise.resolve([]);
						}
					);
				}
			});
		}
	}

	return client;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/client/src/customData.ts]---
Location: vscode-main/extensions/css-language-features/client/src/customData.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { workspace, extensions, Uri, EventEmitter, Disposable } from 'vscode';
import { Utils } from 'vscode-uri';

export function getCustomDataSource(toDispose: Disposable[]) {
	let pathsInWorkspace = getCustomDataPathsInAllWorkspaces();
	let pathsInExtensions = getCustomDataPathsFromAllExtensions();

	const onChange = new EventEmitter<void>();

	toDispose.push(extensions.onDidChange(_ => {
		const newPathsInExtensions = getCustomDataPathsFromAllExtensions();
		if (newPathsInExtensions.length !== pathsInExtensions.length || !newPathsInExtensions.every((val, idx) => val === pathsInExtensions[idx])) {
			pathsInExtensions = newPathsInExtensions;
			onChange.fire();
		}
	}));
	toDispose.push(workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration('css.customData')) {
			pathsInWorkspace = getCustomDataPathsInAllWorkspaces();
			onChange.fire();
		}
	}));

	return {
		get uris() {
			return pathsInWorkspace.concat(pathsInExtensions);
		},
		get onDidChange() {
			return onChange.event;
		}
	};
}


function getCustomDataPathsInAllWorkspaces(): string[] {
	const workspaceFolders = workspace.workspaceFolders;

	const dataPaths: string[] = [];

	if (!workspaceFolders) {
		return dataPaths;
	}

	const collect = (paths: string[] | undefined, rootFolder: Uri) => {
		if (Array.isArray(paths)) {
			for (const path of paths) {
				if (typeof path === 'string') {
					dataPaths.push(Utils.resolvePath(rootFolder, path).toString());
				}
			}
		}
	};

	for (let i = 0; i < workspaceFolders.length; i++) {
		const folderUri = workspaceFolders[i].uri;
		const allCssConfig = workspace.getConfiguration('css', folderUri);
		const customDataInspect = allCssConfig.inspect<string[]>('customData');
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

function getCustomDataPathsFromAllExtensions(): string[] {
	const dataPaths: string[] = [];
	for (const extension of extensions.all) {
		const customData = extension.packageJSON?.contributes?.css?.customData;
		if (Array.isArray(customData)) {
			for (const rp of customData) {
				dataPaths.push(Utils.joinPath(extension.extensionUri, rp).toString());
			}
		}
	}
	return dataPaths;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/client/src/requests.ts]---
Location: vscode-main/extensions/css-language-features/client/src/requests.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Uri, workspace } from 'vscode';
import { RequestType, BaseLanguageClient } from 'vscode-languageclient';
import { Runtime } from './cssClient';

export namespace FsContentRequest {
	export const type: RequestType<{ uri: string; encoding?: string }, string, any> = new RequestType('fs/content');
}
export namespace FsStatRequest {
	export const type: RequestType<string, FileStat, any> = new RequestType('fs/stat');
}

export namespace FsReadDirRequest {
	export const type: RequestType<string, [string, FileType][], any> = new RequestType('fs/readDir');
}

export function serveFileSystemRequests(client: BaseLanguageClient, runtime: Runtime) {
	client.onRequest(FsContentRequest.type, (param: { uri: string; encoding?: string }) => {
		const uri = Uri.parse(param.uri);
		if (uri.scheme === 'file' && runtime.fs) {
			return runtime.fs.getContent(param.uri);
		}
		return workspace.fs.readFile(uri).then(buffer => {
			return new runtime.TextDecoder(param.encoding).decode(buffer);
		});
	});
	client.onRequest(FsReadDirRequest.type, (uriString: string) => {
		const uri = Uri.parse(uriString);
		if (uri.scheme === 'file' && runtime.fs) {
			return runtime.fs.readDirectory(uriString);
		}
		return workspace.fs.readDirectory(uri);
	});
	client.onRequest(FsStatRequest.type, (uriString: string) => {
		const uri = Uri.parse(uriString);
		if (uri.scheme === 'file' && runtime.fs) {
			return runtime.fs.stat(uriString);
		}
		return workspace.fs.stat(uri);
	});
}

export enum FileType {
	/**
	 * The file type is unknown.
	 */
	Unknown = 0,
	/**
	 * A regular file.
	 */
	File = 1,
	/**
	 * A directory.
	 */
	Directory = 2,
	/**
	 * A symbolic link to a file.
	 */
	SymbolicLink = 64
}
export interface FileStat {
	/**
	 * The type of the file, e.g. is a regular file, a directory, or symbolic link
	 * to a file.
	 */
	type: FileType;
	/**
	 * The creation timestamp in milliseconds elapsed since January 1, 1970 00:00:00 UTC.
	 */
	ctime: number;
	/**
	 * The modification timestamp in milliseconds elapsed since January 1, 1970 00:00:00 UTC.
	 */
	mtime: number;
	/**
	 * The size in bytes.
	 */
	size: number;
}

export interface RequestService {
	getContent(uri: string, encoding?: string): Promise<string>;

	stat(uri: string): Promise<FileStat>;
	readDirectory(uri: string): Promise<[string, FileType][]>;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/client/src/browser/cssClientMain.ts]---
Location: vscode-main/extensions/css-language-features/client/src/browser/cssClientMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtensionContext, Uri, l10n } from 'vscode';
import { BaseLanguageClient, LanguageClientOptions } from 'vscode-languageclient';
import { startClient, LanguageClientConstructor } from '../cssClient';
import { LanguageClient } from 'vscode-languageclient/browser';
import { registerDropOrPasteResourceSupport } from '../dropOrPaste/dropOrPasteResource';

let client: BaseLanguageClient | undefined;

// this method is called when vs code is activated
export async function activate(context: ExtensionContext) {
	const serverMain = Uri.joinPath(context.extensionUri, 'server/dist/browser/cssServerMain.js');
	try {
		const worker = new Worker(serverMain.toString());
		worker.postMessage({ i10lLocation: l10n.uri?.toString(false) ?? '' });

		const newLanguageClient: LanguageClientConstructor = (id: string, name: string, clientOptions: LanguageClientOptions) => {
			return new LanguageClient(id, name, worker, clientOptions);
		};

		client = await startClient(context, newLanguageClient, { TextDecoder });

		context.subscriptions.push(registerDropOrPasteResourceSupport({ language: 'css', scheme: '*' }));
	} catch (e) {
		console.log(e);
	}
}

export async function deactivate(): Promise<void> {
	if (client) {
		await client.stop();
		client = undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/client/src/dropOrPaste/dropOrPasteResource.ts]---
Location: vscode-main/extensions/css-language-features/client/src/dropOrPaste/dropOrPasteResource.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as vscode from 'vscode';
import { getDocumentDir, Mimes, Schemes } from './shared';
import { UriList } from './uriList';

class DropOrPasteResourceProvider implements vscode.DocumentDropEditProvider, vscode.DocumentPasteEditProvider {

	readonly kind = vscode.DocumentDropOrPasteEditKind.Empty.append('css', 'link', 'url');

	async provideDocumentDropEdits(
		document: vscode.TextDocument,
		position: vscode.Position,
		dataTransfer: vscode.DataTransfer,
		token: vscode.CancellationToken,
	): Promise<vscode.DocumentDropEdit | undefined> {
		const uriList = await this.getUriList(dataTransfer);
		if (!uriList.entries.length || token.isCancellationRequested) {
			return;
		}

		const snippet = await this.createUriListSnippet(document.uri, uriList);
		if (!snippet || token.isCancellationRequested) {
			return;
		}

		return {
			kind: this.kind,
			title: snippet.label,
			insertText: snippet.snippet.value,
			yieldTo: this.pasteAsCssUrlByDefault(document, position) ? [] : [vscode.DocumentDropOrPasteEditKind.Empty.append('uri')]
		};
	}

	async provideDocumentPasteEdits(
		document: vscode.TextDocument,
		ranges: readonly vscode.Range[],
		dataTransfer: vscode.DataTransfer,
		_context: vscode.DocumentPasteEditContext,
		token: vscode.CancellationToken
	): Promise<vscode.DocumentPasteEdit[] | undefined> {
		const uriList = await this.getUriList(dataTransfer);
		if (!uriList.entries.length || token.isCancellationRequested) {
			return;
		}

		const snippet = await this.createUriListSnippet(document.uri, uriList);
		if (!snippet || token.isCancellationRequested) {
			return;
		}

		return [{
			kind: this.kind,
			title: snippet.label,
			insertText: snippet.snippet.value,
			yieldTo: this.pasteAsCssUrlByDefault(document, ranges[0].start) ? [] : [vscode.DocumentDropOrPasteEditKind.Empty.append('uri')]
		}];
	}

	private async getUriList(dataTransfer: vscode.DataTransfer): Promise<UriList> {
		const urlList = await dataTransfer.get(Mimes.uriList)?.asString();
		if (urlList) {
			return UriList.from(urlList);
		}

		// Find file entries
		const uris: vscode.Uri[] = [];
		for (const [_, entry] of dataTransfer) {
			const file = entry.asFile();
			if (file?.uri) {
				uris.push(file.uri);
			}
		}

		return new UriList(uris.map(uri => ({ uri, str: uri.toString(true) })));
	}

	private async createUriListSnippet(docUri: vscode.Uri, uriList: UriList): Promise<{ readonly snippet: vscode.SnippetString; readonly label: string } | undefined> {
		if (!uriList.entries.length) {
			return;
		}

		const snippet = new vscode.SnippetString();
		for (let i = 0; i < uriList.entries.length; i++) {
			const uri = uriList.entries[i];
			const relativePath = getRelativePath(getDocumentDir(docUri), uri.uri);
			const urlText = relativePath ?? uri.str;

			snippet.appendText(`url(${urlText})`);
			if (i !== uriList.entries.length - 1) {
				snippet.appendText(' ');
			}
		}

		return {
			snippet,
			label: uriList.entries.length > 1
				? vscode.l10n.t('Insert url() Functions')
				: vscode.l10n.t('Insert url() Function')
		};
	}

	private pasteAsCssUrlByDefault(document: vscode.TextDocument, position: vscode.Position): boolean {
		const regex = /url\(.+?\)/gi;
		for (const match of Array.from(document.lineAt(position.line).text.matchAll(regex))) {
			if (position.character > match.index && position.character < match.index + match[0].length) {
				return false;
			}
		}
		return true;
	}
}

function getRelativePath(fromFile: vscode.Uri | undefined, toFile: vscode.Uri): string | undefined {
	if (fromFile && fromFile.scheme === toFile.scheme && fromFile.authority === toFile.authority) {
		if (toFile.scheme === Schemes.file) {
			// On windows, we must use the native `path.relative` to generate the relative path
			// so that drive-letters are resolved cast insensitively. However we then want to
			// convert back to a posix path to insert in to the document
			const relativePath = path.relative(fromFile.fsPath, toFile.fsPath);
			return path.posix.normalize(relativePath.split(path.sep).join(path.posix.sep));
		}

		return path.posix.relative(fromFile.path, toFile.path);
	}

	return undefined;
}

export function registerDropOrPasteResourceSupport(selector: vscode.DocumentSelector): vscode.Disposable {
	const provider = new DropOrPasteResourceProvider();

	return vscode.Disposable.from(
		vscode.languages.registerDocumentDropEditProvider(selector, provider, {
			providedDropEditKinds: [provider.kind],
			dropMimeTypes: [
				Mimes.uriList,
				'files'
			]
		}),
		vscode.languages.registerDocumentPasteEditProvider(selector, provider, {
			providedPasteEditKinds: [provider.kind],
			pasteMimeTypes: [
				Mimes.uriList,
				'files'
			]
		})
	);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/client/src/dropOrPaste/shared.ts]---
Location: vscode-main/extensions/css-language-features/client/src/dropOrPaste/shared.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Utils } from 'vscode-uri';

export const Schemes = Object.freeze({
	file: 'file',
	notebookCell: 'vscode-notebook-cell',
	untitled: 'untitled',
});

export const Mimes = Object.freeze({
	plain: 'text/plain',
	uriList: 'text/uri-list',
});


export function getDocumentDir(uri: vscode.Uri): vscode.Uri | undefined {
	const docUri = getParentDocumentUri(uri);
	if (docUri.scheme === Schemes.untitled) {
		return vscode.workspace.workspaceFolders?.[0]?.uri;
	}
	return Utils.dirname(docUri);
}

function getParentDocumentUri(uri: vscode.Uri): vscode.Uri {
	if (uri.scheme === Schemes.notebookCell) {
		// is notebook documents necessary?
		for (const notebook of vscode.workspace.notebookDocuments) {
			for (const cell of notebook.getCells()) {
				if (cell.document.uri.toString() === uri.toString()) {
					return notebook.uri;
				}
			}
		}
	}

	return uri;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/client/src/dropOrPaste/uriList.ts]---
Location: vscode-main/extensions/css-language-features/client/src/dropOrPaste/uriList.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

function splitUriList(str: string): string[] {
	return str.split('\r\n');
}

function parseUriList(str: string): string[] {
	return splitUriList(str)
		.filter(value => !value.startsWith('#')) // Remove comments
		.map(value => value.trim());
}

export class UriList {

	static from(str: string): UriList {
		return new UriList(coalesce(parseUriList(str).map(line => {
			try {
				return { uri: vscode.Uri.parse(line), str: line };
			} catch {
				// Uri parse failure
				return undefined;
			}
		})));
	}

	constructor(
		public readonly entries: ReadonlyArray<{ readonly uri: vscode.Uri; readonly str: string }>
	) { }
}

function coalesce<T>(array: ReadonlyArray<T | undefined | null>): T[] {
	return <T[]>array.filter(e => !!e);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/client/src/node/cssClientMain.ts]---
Location: vscode-main/extensions/css-language-features/client/src/node/cssClientMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtensionContext, extensions, l10n } from 'vscode';
import { BaseLanguageClient, LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node';
import { LanguageClientConstructor, startClient } from '../cssClient';
import { getNodeFSRequestService } from './nodeFs';
import { registerDropOrPasteResourceSupport } from '../dropOrPaste/dropOrPasteResource';

let client: BaseLanguageClient | undefined;

// this method is called when vs code is activated
export async function activate(context: ExtensionContext) {
	const clientMain = extensions.getExtension('vscode.css-language-features')?.packageJSON?.main || '';

	const serverMain = `./server/${clientMain.indexOf('/dist/') !== -1 ? 'dist' : 'out'}/node/cssServerMain`;
	const serverModule = context.asAbsolutePath(serverMain);

	// The debug options for the server
	const debugOptions = { execArgv: ['--nolazy', '--inspect=' + (7000 + Math.round(Math.random() * 999))] };

	// If the extension is launch in debug mode the debug server options are use
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
	};

	const newLanguageClient: LanguageClientConstructor = (id: string, name: string, clientOptions: LanguageClientOptions) => {
		return new LanguageClient(id, name, serverOptions, clientOptions);
	};

	// pass the location of the localization bundle to the server
	process.env['VSCODE_L10N_BUNDLE_LOCATION'] = l10n.uri?.toString() ?? '';

	client = await startClient(context, newLanguageClient, { fs: getNodeFSRequestService(), TextDecoder });

	context.subscriptions.push(registerDropOrPasteResourceSupport({ language: 'css', scheme: '*' }));
}

export async function deactivate(): Promise<void> {
	if (client) {
		await client.stop();
		client = undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/client/src/node/nodeFs.ts]---
Location: vscode-main/extensions/css-language-features/client/src/node/nodeFs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import { Uri } from 'vscode';
import { RequestService, FileType } from '../requests';

export function getNodeFSRequestService(): RequestService {
	function ensureFileUri(location: string) {
		if (!location.startsWith('file://')) {
			throw new Error('fileRequestService can only handle file URLs');
		}
	}
	return {
		getContent(location: string, encoding?: BufferEncoding) {
			ensureFileUri(location);
			return new Promise((c, e) => {
				const uri = Uri.parse(location);
				fs.readFile(uri.fsPath, encoding, (err, buf) => {
					if (err) {
						return e(err);
					}
					c(buf.toString());

				});
			});
		},
		stat(location: string) {
			ensureFileUri(location);
			return new Promise((c, e) => {
				const uri = Uri.parse(location);
				fs.stat(uri.fsPath, (err, stats) => {
					if (err) {
						if (err.code === 'ENOENT') {
							return c({ type: FileType.Unknown, ctime: -1, mtime: -1, size: -1 });
						} else {
							return e(err);
						}
					}

					let type = FileType.Unknown;
					if (stats.isFile()) {
						type = FileType.File;
					} else if (stats.isDirectory()) {
						type = FileType.Directory;
					} else if (stats.isSymbolicLink()) {
						type = FileType.SymbolicLink;
					}

					c({
						type,
						ctime: stats.ctime.getTime(),
						mtime: stats.mtime.getTime(),
						size: stats.size
					});
				});
			});
		},
		readDirectory(location: string) {
			ensureFileUri(location);
			return new Promise((c, e) => {
				const path = Uri.parse(location).fsPath;

				fs.readdir(path, { withFileTypes: true }, (err, children) => {
					if (err) {
						return e(err);
					}
					c(children.map(stat => {
						if (stat.isSymbolicLink()) {
							return [stat.name, FileType.SymbolicLink];
						} else if (stat.isDirectory()) {
							return [stat.name, FileType.Directory];
						} else if (stat.isFile()) {
							return [stat.name, FileType.File];
						} else {
							return [stat.name, FileType.Unknown];
						}
					}));
				});
			});
		}
	};
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/schemas/package.schema.json]---
Location: vscode-main/extensions/css-language-features/schemas/package.schema.json

```json
{
	"$schema": "http://json-schema.org/draft-07/schema#",
	"type": "object",
	"properties": {
		"contributes": {
			"type": "object",
			"properties": {
				"css.customData": {
					"type": "array",
					"markdownDescription": "A list of relative file paths pointing to JSON files following the [custom data format](https://github.com/microsoft/vscode-css-languageservice/blob/master/docs/customData.md).\n\nVS Code loads custom data on startup to enhance its CSS support for the custom CSS properties, at directives, pseudo classes and pseudo elements you specify in the JSON files.\n\nThe file paths are relative to workspace and only workspace folder settings are considered.",
					"items": {
						"type": "string",
						"description": "Relative path to a CSS custom data file"
					}
				}
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/.npmrc]---
Location: vscode-main/extensions/css-language-features/server/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/css-language-features/server/extension-browser.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import { browser as withBrowserDefaults } from '../../shared.webpack.config.mjs';
import path from 'path';

export default withBrowserDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/browser/cssServerWorkerMain.ts',
	},
	output: {
		filename: 'cssServerMain.js',
		path: path.join(import.meta.dirname, 'dist', 'browser'),
		libraryTarget: 'var',
		library: 'serverExportVar'
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/extension.webpack.config.js]---
Location: vscode-main/extensions/css-language-features/server/extension.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import withDefaults from '../../shared.webpack.config.mjs';
import path from 'path';

export default withDefaults({
	context: path.join(import.meta.dirname),
	entry: {
		extension: './src/node/cssServerNodeMain.ts',
	},
	output: {
		filename: 'cssServerMain.js',
		path: path.join(import.meta.dirname, 'dist', 'node'),
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/package-lock.json]---
Location: vscode-main/extensions/css-language-features/server/package-lock.json

```json
{
  "name": "vscode-css-languageserver",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "vscode-css-languageserver",
      "version": "1.0.0",
      "license": "MIT",
      "dependencies": {
        "@vscode/l10n": "^0.0.18",
        "vscode-css-languageservice": "^6.3.9",
        "vscode-languageserver": "^10.0.0-next.15",
        "vscode-uri": "^3.1.0"
      },
      "devDependencies": {
        "@types/mocha": "^10.0.10",
        "@types/node": "22.x"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/@types/mocha": {
      "version": "10.0.10",
      "resolved": "https://registry.npmjs.org/@types/mocha/-/mocha-10.0.10.tgz",
      "integrity": "sha512-xPyYSz1cMPnJQhl0CLMH68j3gprKZaTjG3s5Vi+fDgx+uhG9NOXwbVt52eFS8ECyXhyKcjDLCBEqBExKuiZb7Q==",
      "dev": true,
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
    "node_modules/@vscode/l10n": {
      "version": "0.0.18",
      "resolved": "https://registry.npmjs.org/@vscode/l10n/-/l10n-0.0.18.tgz",
      "integrity": "sha512-KYSIHVmslkaCDyw013pphY+d7x1qV8IZupYfeIfzNA+nsaWHbn5uPuQRvdRFsa9zFzGeudPuoGoZ1Op4jrJXIQ=="
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/vscode-css-languageservice": {
      "version": "6.3.9",
      "resolved": "https://registry.npmjs.org/vscode-css-languageservice/-/vscode-css-languageservice-6.3.9.tgz",
      "integrity": "sha512-1tLWfp+TDM5ZuVWht3jmaY5y7O6aZmpeXLoHl5bv1QtRsRKt4xYGRMmdJa5Pqx/FTkgRbsna9R+Gn2xE+evVuA==",
      "license": "MIT",
      "dependencies": {
        "@vscode/l10n": "^0.0.18",
        "vscode-languageserver-textdocument": "^1.0.12",
        "vscode-languageserver-types": "3.17.5",
        "vscode-uri": "^3.1.0"
      }
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
    "node_modules/vscode-languageserver": {
      "version": "10.0.0-next.15",
      "resolved": "https://registry.npmjs.org/vscode-languageserver/-/vscode-languageserver-10.0.0-next.15.tgz",
      "integrity": "sha512-vs+bwci/lM83ZhrR9t8DcZ2AgS2CKx4i6Yw86teKKkqlzlrYWTixuBd9w6H/UP9s8EGBvii0jnbjQd6wsKJ0ig==",
      "license": "MIT",
      "dependencies": {
        "vscode-languageserver-protocol": "3.17.6-next.15"
      },
      "bin": {
        "installServerIntoExtension": "bin/installServerIntoExtension"
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
    "node_modules/vscode-languageserver-protocol/node_modules/vscode-languageserver-types": {
      "version": "3.17.6-next.6",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-types/-/vscode-languageserver-types-3.17.6-next.6.tgz",
      "integrity": "sha512-aiJY5/yW+xzw7KPNlwi3gQtddq/3EIn5z8X8nCgJfaiAij2R1APKePngv+MUdLdYJBVTLu+Qa0ODsT+pHgYguQ==",
      "license": "MIT"
    },
    "node_modules/vscode-languageserver-textdocument": {
      "version": "1.0.12",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-textdocument/-/vscode-languageserver-textdocument-1.0.12.tgz",
      "integrity": "sha512-cxWNPesCnQCcMPeenjKKsOCKQZ/L6Tv19DTRIGuLWe32lyzWhihGVJ/rcckZXJxfdKCFvRLS3fpBIsV/ZGX4zA=="
    },
    "node_modules/vscode-languageserver-types": {
      "version": "3.17.5",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-types/-/vscode-languageserver-types-3.17.5.tgz",
      "integrity": "sha512-Ld1VelNuX9pdF39h2Hgaeb5hEZM2Z3jUrrMgWQAu82jMtZp7p3vJT3BzToKtZI7NgQssZje5o0zryOrhQvzQAg=="
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

---[FILE: extensions/css-language-features/server/package.json]---
Location: vscode-main/extensions/css-language-features/server/package.json

```json
{
  "name": "vscode-css-languageserver",
  "description": "CSS/LESS/SCSS language server",
  "version": "1.0.0",
  "author": "Microsoft Corporation",
  "license": "MIT",
  "engines": {
    "node": "*"
  },
  "main": "./out/node/cssServerMain",
  "browser": "./dist/browser/cssServerMain",
  "dependencies": {
    "@vscode/l10n": "^0.0.18",
    "vscode-css-languageservice": "^6.3.9",
    "vscode-languageserver": "^10.0.0-next.15",
    "vscode-uri": "^3.1.0"
  },
  "devDependencies": {
    "@types/mocha": "^10.0.10",
    "@types/node": "22.x"
  },
  "scripts": {
    "compile": "gulp compile-extension:css-language-features-server",
    "watch": "gulp watch-extension:css-language-features-server",
    "install-service-next": "npm install vscode-css-languageservice",
    "install-service-local": "npm link vscode-css-languageservice",
    "install-server-next": "npm install vscode-languageserver@next",
    "install-server-local": "npm install vscode-languageserver",
    "test": "node ./test/index.js"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/tsconfig.json]---
Location: vscode-main/extensions/css-language-features/server/tsconfig.json

```json
{
	"extends": "../../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"lib": [
			"ES2024",
			"WebWorker"
		],
		"module": "Node16",
		"typeRoots": [
			"../node_modules/@types"
		]
	},
	"include": [
		"src/**/*"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/.vscode/launch.json]---
Location: vscode-main/extensions/css-language-features/server/.vscode/launch.json

```json
{
	"version": "0.1.0",
	// List of configurations. Add new configurations or edit existing ones.
	"configurations": [
		{
			"name": "Attach",
			"type": "node",
			"request": "attach",
			"port": 6044,
			"protocol": "inspector",
			"sourceMaps": true,
			"outFiles": ["${workspaceFolder}/out/**/*.js"]
		},
		{
			"name": "Unit Tests",
			"type": "node",
			"request": "launch",
			"program": "${workspaceFolder}/../../../node_modules/mocha/bin/_mocha",
			"stopOnEntry": false,
			"args": [
				"--timeout",
				"999999",
				"--colors"
			],
			"cwd": "${workspaceFolder}",
			"runtimeExecutable": null,
			"runtimeArgs": [],
			"env": {},
			"sourceMaps": true,
			"outFiles": ["${workspaceFolder}/out/**/*.js"]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/.vscode/tasks.json]---
Location: vscode-main/extensions/css-language-features/server/.vscode/tasks.json

```json
{
	"version": "0.1.0",
	"command": "npm",
	"isShellCommand": true,
	"showOutput": "silent",
	"args": ["run", "watch"],
	"isWatching": true,
	"problemMatcher": "$tsc-watch"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/src/cssServer.ts]---
Location: vscode-main/extensions/css-language-features/server/src/cssServer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
	Connection, TextDocuments, InitializeParams, InitializeResult, ServerCapabilities, ConfigurationRequest, WorkspaceFolder, TextDocumentSyncKind, NotificationType, Disposable, TextDocumentIdentifier, Range, FormattingOptions, TextEdit, Diagnostic
} from 'vscode-languageserver';
import { URI } from 'vscode-uri';
import { getCSSLanguageService, getSCSSLanguageService, getLESSLanguageService, LanguageSettings, LanguageService, Stylesheet, TextDocument, Position, CodeActionKind } from 'vscode-css-languageservice';
import { getLanguageModelCache } from './languageModelCache';
import { runSafeAsync } from './utils/runner';
import { DiagnosticsSupport, registerDiagnosticsPullSupport, registerDiagnosticsPushSupport } from './utils/validation';
import { getDocumentContext } from './utils/documentContext';
import { fetchDataProviders } from './customData';
import { RequestService, getRequestService } from './requests';

namespace CustomDataChangedNotification {
	export const type: NotificationType<string[]> = new NotificationType('css/customDataChanged');
}

export interface Settings {
	css: LanguageSettings;
	less: LanguageSettings;
	scss: LanguageSettings;
}

export interface RuntimeEnvironment {
	readonly file?: RequestService;
	readonly http?: RequestService;
	readonly timer: {
		setImmediate(callback: (...args: any[]) => void, ...args: any[]): Disposable;
		setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable;
	};
}

export function startServer(connection: Connection, runtime: RuntimeEnvironment) {

	// Create a text document manager.
	const documents = new TextDocuments(TextDocument);
	// Make the text document manager listen on the connection
	// for open, change and close text document events
	documents.listen(connection);

	const stylesheets = getLanguageModelCache<Stylesheet>(10, 60, document => getLanguageService(document).parseStylesheet(document));
	documents.onDidClose(e => {
		stylesheets.onDocumentRemoved(e.document);
	});
	connection.onShutdown(() => {
		stylesheets.dispose();
	});

	let scopedSettingsSupport = false;
	let foldingRangeLimit = Number.MAX_VALUE;
	let workspaceFolders: WorkspaceFolder[];
	let formatterMaxNumberOfEdits = Number.MAX_VALUE;

	let dataProvidersReady: Promise<any> = Promise.resolve();

	let diagnosticsSupport: DiagnosticsSupport | undefined;

	const languageServices: { [id: string]: LanguageService } = {};

	const notReady = () => Promise.reject('Not Ready');
	let requestService: RequestService = { getContent: notReady, stat: notReady, readDirectory: notReady };

	// After the server has started the client sends an initialize request. The server receives
	// in the passed params the rootPath of the workspace plus the client capabilities.
	connection.onInitialize((params: InitializeParams): InitializeResult => {

		const initializationOptions = params.initializationOptions || {};

		if (!Array.isArray(params.workspaceFolders)) {
			workspaceFolders = [];
			if (params.rootPath) {
				workspaceFolders.push({ name: '', uri: URI.file(params.rootPath).toString(true) });
			}
		} else {
			workspaceFolders = params.workspaceFolders;
		}

		requestService = getRequestService(initializationOptions?.handledSchemas || ['file'], connection, runtime);

		function getClientCapability<T>(name: string, def: T) {
			const keys = name.split('.');
			let c: any = params.capabilities;
			for (let i = 0; c && i < keys.length; i++) {
				if (!c.hasOwnProperty(keys[i])) {
					return def;
				}
				c = c[keys[i]];
			}
			return c;
		}
		const snippetSupport = !!getClientCapability('textDocument.completion.completionItem.snippetSupport', false);
		scopedSettingsSupport = !!getClientCapability('workspace.configuration', false);
		foldingRangeLimit = getClientCapability('textDocument.foldingRange.rangeLimit', Number.MAX_VALUE);

		formatterMaxNumberOfEdits = initializationOptions?.customCapabilities?.rangeFormatting?.editLimit || Number.MAX_VALUE;

		languageServices.css = getCSSLanguageService({ fileSystemProvider: requestService, clientCapabilities: params.capabilities });
		languageServices.scss = getSCSSLanguageService({ fileSystemProvider: requestService, clientCapabilities: params.capabilities });
		languageServices.less = getLESSLanguageService({ fileSystemProvider: requestService, clientCapabilities: params.capabilities });

		const supportsDiagnosticPull = getClientCapability('textDocument.diagnostic', undefined);
		if (supportsDiagnosticPull === undefined) {
			diagnosticsSupport = registerDiagnosticsPushSupport(documents, connection, runtime, validateTextDocument);
		} else {
			diagnosticsSupport = registerDiagnosticsPullSupport(documents, connection, runtime, validateTextDocument);
		}

		const capabilities: ServerCapabilities = {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			completionProvider: snippetSupport ? { resolveProvider: false, triggerCharacters: ['/', '-', ':'] } : undefined,
			hoverProvider: true,
			documentSymbolProvider: true,
			referencesProvider: true,
			definitionProvider: true,
			documentHighlightProvider: true,
			documentLinkProvider: {
				resolveProvider: false
			},
			codeActionProvider: {
				codeActionKinds: [CodeActionKind.QuickFix]
			},
			renameProvider: true,
			colorProvider: {},
			foldingRangeProvider: true,
			selectionRangeProvider: true,
			diagnosticProvider: {
				documentSelector: null,
				interFileDependencies: false,
				workspaceDiagnostics: false
			},
			documentRangeFormattingProvider: initializationOptions?.provideFormatter === true,
			documentFormattingProvider: initializationOptions?.provideFormatter === true,
		};
		return { capabilities };
	});

	function getLanguageService(document: TextDocument) {
		let service = languageServices[document.languageId];
		if (!service) {
			connection.console.log('Document type is ' + document.languageId + ', using css instead.');
			service = languageServices['css'];
		}
		return service;
	}

	let documentSettings: { [key: string]: Thenable<LanguageSettings | undefined> } = {};
	// remove document settings on close
	documents.onDidClose(e => {
		delete documentSettings[e.document.uri];
	});
	function getDocumentSettings(textDocument: TextDocument): Thenable<LanguageSettings | undefined> {
		if (scopedSettingsSupport) {
			let promise = documentSettings[textDocument.uri];
			if (!promise) {
				const configRequestParam = { items: [{ scopeUri: textDocument.uri, section: textDocument.languageId }] };
				promise = connection.sendRequest(ConfigurationRequest.type, configRequestParam).then(s => s[0] as LanguageSettings | undefined);
				documentSettings[textDocument.uri] = promise;
			}
			return promise;
		}
		return Promise.resolve(undefined);
	}

	// The settings have changed. Is send on server activation as well.
	connection.onDidChangeConfiguration(change => {
		updateConfiguration(change.settings as { [languageId: string]: LanguageSettings });
	});

	function updateConfiguration(settings: { [languageId: string]: LanguageSettings }) {
		for (const languageId in languageServices) {
			languageServices[languageId].configure(settings[languageId]);
		}
		// reset all document settings
		documentSettings = {};
		diagnosticsSupport?.requestRefresh();
	}

	async function validateTextDocument(textDocument: TextDocument): Promise<Diagnostic[]> {
		const settingsPromise = getDocumentSettings(textDocument);
		const [settings] = await Promise.all([settingsPromise, dataProvidersReady]);

		const stylesheet = stylesheets.get(textDocument);
		return getLanguageService(textDocument).doValidation(textDocument, stylesheet, settings);
	}

	function updateDataProviders(dataPaths: string[]) {
		dataProvidersReady = fetchDataProviders(dataPaths, requestService).then(customDataProviders => {
			for (const lang in languageServices) {
				languageServices[lang].setDataProviders(true, customDataProviders);
			}
		});
	}

	connection.onCompletion((textDocumentPosition, token) => {
		return runSafeAsync(runtime, async () => {
			const document = documents.get(textDocumentPosition.textDocument.uri);
			if (document) {
				const [settings,] = await Promise.all([getDocumentSettings(document), dataProvidersReady]);
				const styleSheet = stylesheets.get(document);
				const documentContext = getDocumentContext(document.uri, workspaceFolders);
				return getLanguageService(document).doComplete2(document, textDocumentPosition.position, styleSheet, documentContext, settings?.completion);
			}
			return null;
		}, null, `Error while computing completions for ${textDocumentPosition.textDocument.uri}`, token);
	});

	connection.onHover((textDocumentPosition, token) => {
		return runSafeAsync(runtime, async () => {
			const document = documents.get(textDocumentPosition.textDocument.uri);
			if (document) {
				const [settings,] = await Promise.all([getDocumentSettings(document), dataProvidersReady]);
				const styleSheet = stylesheets.get(document);
				return getLanguageService(document).doHover(document, textDocumentPosition.position, styleSheet, settings?.hover);
			}
			return null;
		}, null, `Error while computing hover for ${textDocumentPosition.textDocument.uri}`, token);
	});

	connection.onDocumentSymbol((documentSymbolParams, token) => {
		return runSafeAsync(runtime, async () => {
			const document = documents.get(documentSymbolParams.textDocument.uri);
			if (document) {
				await dataProvidersReady;
				const stylesheet = stylesheets.get(document);
				return getLanguageService(document).findDocumentSymbols2(document, stylesheet);
			}
			return [];
		}, [], `Error while computing document symbols for ${documentSymbolParams.textDocument.uri}`, token);
	});

	connection.onDefinition((documentDefinitionParams, token) => {
		return runSafeAsync(runtime, async () => {
			const document = documents.get(documentDefinitionParams.textDocument.uri);
			if (document) {
				await dataProvidersReady;
				const stylesheet = stylesheets.get(document);
				return getLanguageService(document).findDefinition(document, documentDefinitionParams.position, stylesheet);
			}
			return null;
		}, null, `Error while computing definitions for ${documentDefinitionParams.textDocument.uri}`, token);
	});

	connection.onDocumentHighlight((documentHighlightParams, token) => {
		return runSafeAsync(runtime, async () => {
			const document = documents.get(documentHighlightParams.textDocument.uri);
			if (document) {
				await dataProvidersReady;
				const stylesheet = stylesheets.get(document);
				return getLanguageService(document).findDocumentHighlights(document, documentHighlightParams.position, stylesheet);
			}
			return [];
		}, [], `Error while computing document highlights for ${documentHighlightParams.textDocument.uri}`, token);
	});


	connection.onDocumentLinks(async (documentLinkParams, token) => {
		return runSafeAsync(runtime, async () => {
			const document = documents.get(documentLinkParams.textDocument.uri);
			if (document) {
				await dataProvidersReady;
				const documentContext = getDocumentContext(document.uri, workspaceFolders);
				const stylesheet = stylesheets.get(document);
				return getLanguageService(document).findDocumentLinks2(document, stylesheet, documentContext);
			}
			return [];
		}, [], `Error while computing document links for ${documentLinkParams.textDocument.uri}`, token);
	});


	connection.onReferences((referenceParams, token) => {
		return runSafeAsync(runtime, async () => {
			const document = documents.get(referenceParams.textDocument.uri);
			if (document) {
				await dataProvidersReady;
				const stylesheet = stylesheets.get(document);
				return getLanguageService(document).findReferences(document, referenceParams.position, stylesheet);
			}
			return [];
		}, [], `Error while computing references for ${referenceParams.textDocument.uri}`, token);
	});

	connection.onCodeAction((codeActionParams, token) => {
		return runSafeAsync(runtime, async () => {
			const document = documents.get(codeActionParams.textDocument.uri);
			if (document) {
				await dataProvidersReady;
				const stylesheet = stylesheets.get(document);
				return getLanguageService(document).doCodeActions2(document, codeActionParams.range, codeActionParams.context, stylesheet);
			}
			return [];
		}, [], `Error while computing code actions for ${codeActionParams.textDocument.uri}`, token);
	});

	connection.onDocumentColor((params, token) => {
		return runSafeAsync(runtime, async () => {
			const document = documents.get(params.textDocument.uri);
			if (document) {
				await dataProvidersReady;
				const stylesheet = stylesheets.get(document);
				return getLanguageService(document).findDocumentColors(document, stylesheet);
			}
			return [];
		}, [], `Error while computing document colors for ${params.textDocument.uri}`, token);
	});

	connection.onColorPresentation((params, token) => {
		return runSafeAsync(runtime, async () => {
			const document = documents.get(params.textDocument.uri);
			if (document) {
				await dataProvidersReady;
				const stylesheet = stylesheets.get(document);
				return getLanguageService(document).getColorPresentations(document, stylesheet, params.color, params.range);
			}
			return [];
		}, [], `Error while computing color presentations for ${params.textDocument.uri}`, token);
	});

	connection.onRenameRequest((renameParameters, token) => {
		return runSafeAsync(runtime, async () => {
			const document = documents.get(renameParameters.textDocument.uri);
			if (document) {
				await dataProvidersReady;
				const stylesheet = stylesheets.get(document);
				return getLanguageService(document).doRename(document, renameParameters.position, renameParameters.newName, stylesheet);
			}
			return null;
		}, null, `Error while computing renames for ${renameParameters.textDocument.uri}`, token);
	});

	connection.onFoldingRanges((params, token) => {
		return runSafeAsync(runtime, async () => {
			const document = documents.get(params.textDocument.uri);
			if (document) {
				await dataProvidersReady;
				return getLanguageService(document).getFoldingRanges(document, { rangeLimit: foldingRangeLimit });
			}
			return null;
		}, null, `Error while computing folding ranges for ${params.textDocument.uri}`, token);
	});

	connection.onSelectionRanges((params, token) => {
		return runSafeAsync(runtime, async () => {
			const document = documents.get(params.textDocument.uri);
			const positions: Position[] = params.positions;

			if (document) {
				await dataProvidersReady;
				const stylesheet = stylesheets.get(document);
				return getLanguageService(document).getSelectionRanges(document, positions, stylesheet);
			}
			return [];
		}, [], `Error while computing selection ranges for ${params.textDocument.uri}`, token);
	});

	async function onFormat(textDocument: TextDocumentIdentifier, range: Range | undefined, options: FormattingOptions): Promise<TextEdit[]> {
		const document = documents.get(textDocument.uri);
		if (document) {
			const edits = getLanguageService(document).format(document, range ?? getFullRange(document), options);
			if (edits.length > formatterMaxNumberOfEdits) {
				const newText = TextDocument.applyEdits(document, edits);
				return [TextEdit.replace(getFullRange(document), newText)];
			}
			return edits;
		}
		return [];
	}

	connection.onDocumentRangeFormatting((formatParams, token) => {
		return runSafeAsync(runtime, () => onFormat(formatParams.textDocument, formatParams.range, formatParams.options), [], `Error while formatting range for ${formatParams.textDocument.uri}`, token);
	});

	connection.onDocumentFormatting((formatParams, token) => {
		return runSafeAsync(runtime, () => onFormat(formatParams.textDocument, undefined, formatParams.options), [], `Error while formatting ${formatParams.textDocument.uri}`, token);
	});

	connection.onNotification(CustomDataChangedNotification.type, updateDataProviders);

	// Listen on the connection
	connection.listen();

}

function getFullRange(document: TextDocument): Range {
	return Range.create(Position.create(0, 0), document.positionAt(document.getText().length));
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/src/customData.ts]---
Location: vscode-main/extensions/css-language-features/server/src/customData.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICSSDataProvider, newCSSDataProvider } from 'vscode-css-languageservice';
import { RequestService } from './requests';

export function fetchDataProviders(dataPaths: string[], requestService: RequestService): Promise<ICSSDataProvider[]> {
	const providers = dataPaths.map(async p => {
		try {
			const content = await requestService.getContent(p);
			return parseCSSData(content);
		} catch (e) {
			return newCSSDataProvider({ version: 1 });
		}
	});

	return Promise.all(providers);
}

function parseCSSData(source: string): ICSSDataProvider {
	let rawData: any;

	try {
		rawData = JSON.parse(source);
	} catch (err) {
		return newCSSDataProvider({ version: 1 });
	}

	return newCSSDataProvider({
		version: rawData.version || 1,
		properties: rawData.properties || [],
		atDirectives: rawData.atDirectives || [],
		pseudoClasses: rawData.pseudoClasses || [],
		pseudoElements: rawData.pseudoElements || []
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/src/languageModelCache.ts]---
Location: vscode-main/extensions/css-language-features/server/src/languageModelCache.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TextDocument } from 'vscode-css-languageservice';

export interface LanguageModelCache<T> {
	get(document: TextDocument): T;
	onDocumentRemoved(document: TextDocument): void;
	dispose(): void;
}

export function getLanguageModelCache<T>(maxEntries: number, cleanupIntervalTimeInSec: number, parse: (document: TextDocument) => T): LanguageModelCache<T> {
	let languageModels: { [uri: string]: { version: number; languageId: string; cTime: number; languageModel: T } } = {};
	let nModels = 0;

	let cleanupInterval: NodeJS.Timeout | undefined = undefined;
	if (cleanupIntervalTimeInSec > 0) {
		cleanupInterval = setInterval(() => {
			const cutoffTime = Date.now() - cleanupIntervalTimeInSec * 1000;
			const uris = Object.keys(languageModels);
			for (const uri of uris) {
				const languageModelInfo = languageModels[uri];
				if (languageModelInfo.cTime < cutoffTime) {
					delete languageModels[uri];
					nModels--;
				}
			}
		}, cleanupIntervalTimeInSec * 1000);
	}

	return {
		get(document: TextDocument): T {
			const version = document.version;
			const languageId = document.languageId;
			const languageModelInfo = languageModels[document.uri];
			if (languageModelInfo && languageModelInfo.version === version && languageModelInfo.languageId === languageId) {
				languageModelInfo.cTime = Date.now();
				return languageModelInfo.languageModel;
			}
			const languageModel = parse(document);
			languageModels[document.uri] = { languageModel, version, languageId, cTime: Date.now() };
			if (!languageModelInfo) {
				nModels++;
			}

			if (nModels === maxEntries) {
				let oldestTime = Number.MAX_VALUE;
				let oldestUri = null;
				for (const uri in languageModels) {
					const languageModelInfo = languageModels[uri];
					if (languageModelInfo.cTime < oldestTime) {
						oldestUri = uri;
						oldestTime = languageModelInfo.cTime;
					}
				}
				if (oldestUri) {
					delete languageModels[oldestUri];
					nModels--;
				}
			}
			return languageModel;

		},
		onDocumentRemoved(document: TextDocument) {
			const uri = document.uri;
			if (languageModels[uri]) {
				delete languageModels[uri];
				nModels--;
			}
		},
		dispose() {
			if (typeof cleanupInterval !== 'undefined') {
				clearInterval(cleanupInterval);
				cleanupInterval = undefined;
				languageModels = {};
				nModels = 0;
			}
		}
	};
}
```

--------------------------------------------------------------------------------

````
