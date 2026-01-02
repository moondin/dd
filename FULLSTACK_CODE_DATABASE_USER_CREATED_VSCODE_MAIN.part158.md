---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 158
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 158 of 552)

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

---[FILE: extensions/yaml/syntaxes/yaml-embedded.tmLanguage.json]---
Location: vscode-main/extensions/yaml/syntaxes/yaml-embedded.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/RedCMD/YAML-Syntax-Highlighter/blob/master/syntaxes/yaml-embedded.tmLanguage.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/RedCMD/YAML-Syntax-Highlighter/commit/c42cf86959ba238dc8a825bdd07bed6f5e97c978",
	"name": "YAML embedded",
	"scopeName": "source.yaml.embedded",
	"patterns": [
		{
			"include": "source.yaml.1.2#byte-order-mark"
		},
		{
			"include": "#directives"
		},
		{
			"include": "#document"
		},
		{
			"include": "#block-sequence"
		},
		{
			"include": "#block-mapping"
		},
		{
			"include": "#block-map-key-explicit"
		},
		{
			"include": "#block-map-value"
		},
		{
			"include": "#block-scalar"
		},
		{
			"include": "source.yaml.1.2#anchor-property"
		},
		{
			"include": "source.yaml.1.2#tag-property"
		},
		{
			"include": "#alias"
		},
		{
			"include": "source.yaml.1.2#double"
		},
		{
			"include": "source.yaml.1.2#single"
		},
		{
			"include": "source.yaml.1.2#flow-mapping"
		},
		{
			"include": "source.yaml.1.2#flow-sequence"
		},
		{
			"include": "#block-plain-out"
		},
		{
			"include": "#presentation-detail"
		}
	],
	"repository": {
		"directives": {
			"comment": "https://yaml.org/spec/1.2.2/#68-directives",
			"patterns": [
				{
					"comment": "https://yaml.org/spec/1.2.2/#681-yaml-directives",
					"begin": "(?>^|\\G)(%)(YAML)([\t ]+)([0-9]+\\.[0-9]*)",
					"end": "$",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.directive.begin.yaml"
						},
						"2": {
							"name": "keyword.other.directive.yaml.yaml"
						},
						"3": {
							"name": "punctuation.whitespace.separator.yaml"
						},
						"4": {
							"name": "constant.numeric.yaml-version.yaml"
						}
					},
					"name": "meta.directives.yaml",
					"patterns": [
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"comment": "https://yaml.org/spec/1.2.2/#682-tag-directives",
					"begin": "(?>^|\\G)(%)(TAG)(?>([\t ]++)((!)(?>[0-9A-Za-z-]*+(!))?+))?+",
					"end": "$",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.directive.begin.yaml"
						},
						"2": {
							"name": "keyword.other.directive.tag.yaml"
						},
						"3": {
							"name": "punctuation.whitespace.separator.yaml"
						},
						"4": {
							"name": "storage.type.tag-handle.yaml"
						},
						"5": {
							"name": "punctuation.definition.tag.begin.yaml"
						},
						"6": {
							"name": "punctuation.definition.tag.end.yaml"
						},
						"comment": "https://yaml.org/spec/1.2.2/#rule-c-tag-handle"
					},
					"patterns": [
						{
							"comment": "technically the beginning should only validate against a valid uri scheme [A-Za-z][A-Za-z0-9.+-]*",
							"begin": "\\G[\t ]++(?!#)",
							"end": "(?=[\r\n\t ])",
							"beginCaptures": {
								"0": {
									"name": "punctuation.whitespace.separator.yaml"
								}
							},
							"contentName": "support.type.tag-prefix.yaml",
							"patterns": [
								{
									"match": "%[0-9a-fA-F]{2}",
									"name": "constant.character.escape.unicode.8-bit.yaml"
								},
								{
									"match": "%[^\r\n\t ]{2,0}",
									"name": "invalid.illegal.constant.character.escape.unicode.8-bit.yaml"
								},
								{
									"match": "\\G[,\\[\\]{}]",
									"name": "invalid.illegal.character.uri.yaml"
								},
								{
									"include": "source.yaml#non-printable"
								},
								{
									"match": "[^\r\n\t a-zA-Z0-9-#;/?:@&=+$,_.!~*'()\\[\\]]++",
									"name": "invalid.illegal.unrecognized.yaml"
								}
							]
						},
						{
							"include": "#presentation-detail"
						}
					]
				},
				{
					"comment": "https://yaml.org/spec/1.2.2/#rule-ns-reserved-directive",
					"begin": "(?>^|\\G)(%)([\\x{85}[^ \\p{Cntrl}\\p{Surrogate}\\x{FEFF FFFE FFFF}]]++)",
					"end": "$",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.directive.begin.yaml"
						},
						"2": {
							"name": "keyword.other.directive.other.yaml"
						}
					},
					"patterns": [
						{
							"match": "\\G([\t ]++)([\\x{85}[^ \\p{Cntrl}\\p{Surrogate}\\x{FEFF FFFE FFFF}]]++)",
							"captures": {
								"1": {
									"name": "punctuation.whitespace.separator.yaml"
								},
								"2": {
									"name": "string.unquoted.directive-name.yaml"
								}
							}
						},
						{
							"match": "([\t ]++)([\\x{85}[^ \\p{Cntrl}\\p{Surrogate}\\x{FEFF FFFE FFFF}]]++)",
							"captures": {
								"1": {
									"name": "punctuation.whitespace.separator.yaml"
								},
								"2": {
									"name": "string.unquoted.directive-parameter.yaml"
								}
							}
						},
						{
							"include": "#presentation-detail"
						}
					]
				}
			]
		},
		"document": {
			"comment": "https://yaml.org/spec/1.2.2/#91-documents",
			"patterns": [
				{
					"match": "(?>^|\\G)---(?=[\r\n\t ])",
					"name": "entity.other.document.begin.yaml"
				},
				{
					"begin": "(?>^|\\G)\\.{3}(?=[\r\n\t ])",
					"end": "$",
					"name": "entity.other.document.end.yaml",
					"patterns": [
						{
							"include": "#presentation-detail"
						},
						{
							"include": "source.yaml.1.2#unknown"
						}
					]
				}
			]
		},
		"block-mapping": {
			"//": "The check for plain keys is expensive",
			"begin": "(?<=^|\\G|\t| )(?<![^\t ][\t ]*+:[\t ]*+|^---[\t ]*+)(?!:[\r\n\t ])(?=(?>(?#Double Quote)\"(?>[^\\\\\"]++|\\\\.)*+\"|(?#Single Quote)'(?>[^']++|'')*+'|(?#Flow-Map){(?>[^}]++|}[ \t]*+(?!:[\r\n\t ]))++}|(?#Flow-Seq)\\[(?>[^]]++|][ \t]*+(?!:[\r\n\t ]))++]|(?#Plain)(?>[\\x{85}[^-?:,\\[\\]{}#&*!|>'\"%@` \\p{Cntrl}\\p{Surrogate}\\x{FEFF FFFE FFFF}]]|[?:-](?![\r\n\t ]))(?>[^:#]++|:(?![\r\n\t ])|(?<! |\t)#++)*+)?+(?#Map Value)[\t ]*+:[\r\n\t ])",
			"end": "(?=:[\r\n\t ])",
			"endCaptures": {
				"0": {
					"name": "punctuation.separator.map.value.yaml"
				}
			},
			"name": "meta.map.yaml",
			"patterns": [
				{
					"include": "source.yaml.1.2#block-map-key-double"
				},
				{
					"include": "source.yaml#block-map-key-single"
				},
				{
					"include": "source.yaml.1.2#block-map-key-plain"
				},
				{
					"include": "source.yaml.1.2#flow-mapping"
				},
				{
					"include": "source.yaml.1.2#flow-sequence"
				}
			]
		},
		"block-sequence": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-l+block-sequence",
			"match": "(?<![^\t ][\t ]*+: *+|^--- *+)-(?=[\r\n\t ])",
			"name": "punctuation.definition.block.sequence.item.yaml"
		},
		"block-map-key-explicit": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-c-l-block-map-explicit-key",
			"begin": "\\?(?=[\r\n\t ])",
			"end": "(?=(?>:|(?>^|\\G)(?>\\.{3}|---))[\r\n\t ])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.map.key.yaml"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.separator.map.value.yaml"
				}
			},
			"name": "meta.map.explicit.yaml",
			"patterns": [
				{
					"include": "source.yaml.1.2#key-double"
				},
				{
					"include": "source.yaml#key-single"
				},
				{
					"include": "#flow-key-plain-out"
				},
				{
					"include": "#block-sequence"
				},
				{
					"include": "#block-mapping"
				},
				{
					"include": "#block-scalar"
				},
				{
					"include": "source.yaml.1.2#anchor-property"
				},
				{
					"include": "source.yaml.1.2#tag-property"
				},
				{
					"include": "#alias"
				},
				{
					"include": "source.yaml.1.2#flow-mapping"
				},
				{
					"include": "source.yaml.1.2#flow-sequence"
				},
				{
					"include": "#presentation-detail"
				}
			]
		},
		"block-map-value": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-c-l-block-map-implicit-value",
			"match": ":(?=[\r\n\t ])",
			"name": "punctuation.separator.map.value.yaml"
		},
		"block-scalar": {
			"patterns": [
				{
					"comment": "This doesn't work correctly when indented. Might have to dump it",
					"begin": "(?>(\\|)|(>))(?<chomp>[+-])?+([1-9])(?(<chomp>)|\\g<chomp>)?+",
					"while": "(?>^|\\G)(?> {\\4}| *+$)",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.flow.block-scalar.literal.yaml"
						},
						"2": {
							"name": "keyword.control.flow.block-scalar.folded.yaml"
						},
						"3": {
							"name": "storage.modifier.chomping-indicator.yaml"
						},
						"4": {
							"name": "constant.numeric.indentation-indicator.yaml"
						}
					},
					"whileCaptures": {
						"0": {
							"name": "punctuation.whitespace.indentation.yaml"
						}
					},
					"name": "meta.scalar.yaml",
					"patterns": [
						{
							"begin": "$",
							"while": "\\G",
							"contentName": "string.unquoted.block.yaml",
							"patterns": [
								{
									"include": "source.yaml#non-printable"
								}
							]
						},
						{
							"begin": "\\G",
							"end": "$",
							"patterns": [
								{
									"include": "#presentation-detail"
								},
								{
									"include": "source.yaml.1.2#unknown"
								}
							]
						}
					]
				},
				{
					"comment": "I'm not sure how I feel about this",
					"begin": "(?>(\\|)|(>))([+-]?+)(.*+)",
					"end": "(?! |$)",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.flow.block-scalar.literal.yaml"
						},
						"2": {
							"name": "keyword.control.flow.block-scalar.folded.yaml"
						},
						"3": {
							"name": "storage.modifier.chomping-indicator.yaml"
						},
						"4": {
							"patterns": [
								{
									"include": "#presentation-detail"
								},
								{
									"include": "source.yaml.1.2#unknown"
								}
							]
						}
					},
					"name": "meta.scalar.yaml",
					"patterns": [
						{
							"comment": "https://yaml.org/spec/1.2.2/#rule-l-nb-literal-text",
							"//": "Find the highest indented line",
							"begin": "(?>^|\\G)(?=( ++)$)",
							"end": "(?>^|\\G)(?>(?=\\1(?!$))|(?!\\1| *+$) *+)",
							"endCaptures": {
								"0": {
									"name": "punctuation.whitespace.separator.yaml"
								}
							},
							"patterns": [
								{
									"include": "#presentation-detail"
								}
							]
						},
						{
							"comment": "https://yaml.org/spec/1.2.2/#rule-l-nb-literal-text",
							"begin": "(?>^|\\G)(?=( ++))",
							"end": "(?>^|\\G)(?!\\1| *+$) *+",
							"endCaptures": {
								"0": {
									"name": "punctuation.whitespace.separator.yaml"
								}
							},
							"contentName": "string.unquoted.block.yaml",
							"patterns": [
								{
									"comment": "This is not 100% correct",
									"match": "(?>^|\\G) ++",
									"name": "punctuation.whitespace.separator.yaml"
								},
								{
									"include": "source.yaml#non-printable"
								}
							]
						}
					]
				}
			]
		},
		"block-plain-out": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-ns-plain-multi-line (FLOW-OUT)",
			"begin": "(?=[\\x{85}[^-?:,\\[\\]{}#&*!|>'\"%@` \\p{Cntrl}\\p{Surrogate}\\x{FEFF FFFE FFFF}]]|[?:-](?![\r\n\t ]))",
			"end": "(?=[\t ]++#|[\t ]*+$)",
			"name": "string.unquoted.plain.out.yaml",
			"patterns": [
				{
					"include": "source.yaml.1.2#tag-implicit-plain-out"
				},
				{
					"match": ":(?=[\r\n\t ])",
					"name": "invalid.illegal.multiline-key.yaml"
				},
				{
					"match": "\\x{FEFF}",
					"name": "invalid.illegal.bom.yaml"
				},
				{
					"include": "source.yaml#non-printable"
				}
			]
		},
		"flow-key-plain-out": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-ns-plain-one-line (FLOW-OUT)",
			"begin": "(?=[\\x{85}[^-?:,\\[\\]{}#&*!|>'\"%@` \\p{Cntrl}\\p{Surrogate}\\x{FEFF FFFE FFFF}]]|[?:-](?![\r\n\t ]))",
			"end": "(?=[\t ]*+(?>$|:[\r\n\t ])|[\t ]++#)",
			"name": "meta.map.key.yaml string.unquoted.plain.yaml entity.name.tag.yaml",
			"patterns": [
				{
					"include": "source.yaml.1.2#tag-implicit-plain-out"
				},
				{
					"match": "\\x{FEFF}",
					"name": "invalid.illegal.bom.yaml"
				},
				{
					"include": "source.yaml#non-printable"
				}
			]
		},
		"alias": {
			"match": "(\\*)([\\x{85}[^ ,\\[\\]{}\\p{Cntrl}\\p{Surrogate}\\x{FEFF FFFE FFFF}]]++)|(\\*)",
			"captures": {
				"0": {
					"name": "keyword.control.flow.alias.yaml"
				},
				"1": {
					"name": "punctuation.definition.alias.yaml"
				},
				"2": {
					"name": "variable.other.alias.yaml"
				},
				"3": {
					"name": "invalid.illegal.flow.alias.yaml"
				}
			}
		},
		"presentation-detail": {
			"patterns": [
				{
					"match": "[\t ]++",
					"name": "punctuation.whitespace.separator.yaml"
				},
				{
					"include": "source.yaml#non-printable"
				},
				{
					"include": "source.yaml.1.2#comment"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/yaml/syntaxes/yaml.tmLanguage.json]---
Location: vscode-main/extensions/yaml/syntaxes/yaml.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/RedCMD/YAML-Syntax-Highlighter/blob/master/syntaxes/yaml.tmLanguage.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/RedCMD/YAML-Syntax-Highlighter/commit/c42cf86959ba238dc8a825bdd07bed6f5e97c978",
	"name": "YAML Ain't Markup Language",
	"scopeName": "source.yaml",
	"patterns": [
		{
			"comment": "Default to YAML version 1.2",
			"begin": "\\A",
			"while": "^",
			"patterns": [
				{
					"include": "source.yaml.1.2"
				}
			]
		},
		{
			"comment": "Support legacy FrontMatter integration",
			"//": "https://github.com/microsoft/vscode-markdown-tm-grammar/pull/162",
			"begin": "(?<=^-{3,}\\s*+)\\G$",
			"while": "^(?! {3,0}-{3,}[ \t]*+$|[ \t]*+\\.{3}$)",
			"patterns": [
				{
					"include": "source.yaml.1.2"
				}
			]
		},
		{
			"comment": "Basic version for embedding",
			"include": "source.yaml.embedded"
		}
	],
	"repository": {
		"parity": {
			"comment": "Yes... That is right. Due to the changes with \\x2028, \\x2029, \\x85 and 'tags'. This is all the code I was able to reuse between all YAML versions 1.3, 1.2, 1.1 and 1.0"
		},
		"block-map-key-single": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-c-single-quoted (BLOCK-KEY)",
			"begin": "\\G'",
			"end": "'(?!')",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.yaml"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.yaml"
				}
			},
			"name": "meta.map.key.yaml string.quoted.single.yaml entity.name.tag.yaml",
			"patterns": [
				{
					"match": ".[\t ]*+$",
					"name": "invalid.illegal.multiline-key.yaml"
				},
				{
					"match": "[^\t -\\x{10FFFF}]++",
					"name": "invalid.illegal.character.yaml"
				},
				{
					"match": "''",
					"name": "constant.character.escape.single-quote.yaml"
				}
			]
		},
		"key-single": {
			"comment": "https://yaml.org/spec/1.2.2/#rule-c-single-quoted (FLOW-OUT)",
			"begin": "'",
			"end": "'(?!')",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.yaml"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.yaml"
				}
			},
			"name": "meta.map.key.yaml string.quoted.single.yaml entity.name.tag.yaml",
			"patterns": [
				{
					"match": "[^\r\n\t -\\x{10FFFF}]++",
					"name": "invalid.illegal.character.yaml"
				},
				{
					"match": "''",
					"name": "constant.character.escape.single-quote.yaml"
				}
			]
		},
		"non-printable": {
			"//": {
				"85": "",
				"2028": "",
				"2029": "",
				"10000": "𐀀",
				"A0": " ",
				"D7FF": "퟿",
				"E000": "",
				"FFFD": "�",
				"FEFF": "﻿",
				"FFFF": "￿",
				"10FFFF": "􏿿"
			},
			"//match": "[\\p{Cntrl}\\p{Surrogate}\\x{FFFE FFFF}&&[^\t\n\r\\x{85}]]++",
			"match": "[^\t\n\r -~\\x{85}\\x{A0}-\\x{D7FF}\\x{E000}-\\x{FFFD}\\x{010000}-\\x{10FFFF}]++",
			"name": "invalid.illegal.non-printable.yaml"
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: remote/.npmrc]---
Location: vscode-main/remote/.npmrc

```text
disturl="https://nodejs.org/dist"
target="22.21.1"
ms_build_id="374314"
runtime="node"
build_from_source="true"
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: remote/package-lock.json]---
Location: vscode-main/remote/package-lock.json

```json
{
  "name": "vscode-reh",
  "version": "0.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "vscode-reh",
      "version": "0.0.0",
      "dependencies": {
        "@microsoft/1ds-core-js": "^3.2.13",
        "@microsoft/1ds-post-js": "^3.2.13",
        "@parcel/watcher": "parcel-bundler/watcher#1ca032aa8339260a8a3bcf825c3a1a71e3e43542",
        "@vscode/deviceid": "^0.1.1",
        "@vscode/iconv-lite-umd": "0.7.1",
        "@vscode/proxy-agent": "^0.36.0",
        "@vscode/ripgrep": "^1.15.13",
        "@vscode/spdlog": "^0.15.2",
        "@vscode/tree-sitter-wasm": "^0.3.0",
        "@vscode/vscode-languagedetection": "1.0.21",
        "@vscode/windows-process-tree": "^0.6.0",
        "@vscode/windows-registry": "^1.1.0",
        "@xterm/addon-clipboard": "^0.2.0-beta.119",
        "@xterm/addon-image": "^0.9.0-beta.136",
        "@xterm/addon-ligatures": "^0.10.0-beta.136",
        "@xterm/addon-progress": "^0.2.0-beta.42",
        "@xterm/addon-search": "^0.16.0-beta.136",
        "@xterm/addon-serialize": "^0.14.0-beta.136",
        "@xterm/addon-unicode11": "^0.9.0-beta.136",
        "@xterm/addon-webgl": "^0.19.0-beta.136",
        "@xterm/headless": "^5.6.0-beta.136",
        "@xterm/xterm": "^5.6.0-beta.136",
        "cookie": "^0.7.0",
        "http-proxy-agent": "^7.0.0",
        "https-proxy-agent": "^7.0.2",
        "jschardet": "3.1.4",
        "katex": "^0.16.22",
        "kerberos": "2.1.1",
        "minimist": "^1.2.8",
        "native-watchdog": "^1.4.1",
        "node-pty": "^1.1.0-beta42",
        "tas-client": "0.3.1",
        "vscode-oniguruma": "1.7.0",
        "vscode-regexpp": "^3.1.0",
        "vscode-textmate": "^9.3.0",
        "yauzl": "^3.0.0",
        "yazl": "^2.4.3"
      }
    },
    "node_modules/@microsoft/1ds-core-js": {
      "version": "3.2.13",
      "resolved": "https://registry.npmjs.org/@microsoft/1ds-core-js/-/1ds-core-js-3.2.13.tgz",
      "integrity": "sha512-CluYTRWcEk0ObG5EWFNWhs87e2qchJUn0p2D21ZUa3PWojPZfPSBs4//WIE0MYV8Qg1Hdif2ZTwlM7TbYUjfAg==",
      "dependencies": {
        "@microsoft/applicationinsights-core-js": "2.8.15",
        "@microsoft/applicationinsights-shims": "^2.0.2",
        "@microsoft/dynamicproto-js": "^1.1.7"
      }
    },
    "node_modules/@microsoft/1ds-post-js": {
      "version": "3.2.13",
      "resolved": "https://registry.npmjs.org/@microsoft/1ds-post-js/-/1ds-post-js-3.2.13.tgz",
      "integrity": "sha512-HgS574fdD19Bo2vPguyznL4eDw7Pcm1cVNpvbvBLWiW3x4e1FCQ3VMXChWnAxCae8Hb0XqlA2sz332ZobBavTA==",
      "dependencies": {
        "@microsoft/1ds-core-js": "3.2.13",
        "@microsoft/applicationinsights-shims": "^2.0.2",
        "@microsoft/dynamicproto-js": "^1.1.7"
      }
    },
    "node_modules/@microsoft/applicationinsights-core-js": {
      "version": "2.8.15",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-core-js/-/applicationinsights-core-js-2.8.15.tgz",
      "integrity": "sha512-yYAs9MyjGr2YijQdUSN9mVgT1ijI1FPMgcffpaPmYbHAVbQmF7bXudrBWHxmLzJlwl5rfep+Zgjli2e67lwUqQ==",
      "dependencies": {
        "@microsoft/applicationinsights-shims": "2.0.2",
        "@microsoft/dynamicproto-js": "^1.1.9"
      },
      "peerDependencies": {
        "tslib": "*"
      }
    },
    "node_modules/@microsoft/applicationinsights-shims": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-shims/-/applicationinsights-shims-2.0.2.tgz",
      "integrity": "sha512-PoHEgsnmcqruLNHZ/amACqdJ6YYQpED0KSRe6J7gIJTtpZC1FfFU9b1fmDKDKtFoUSrPzEh1qzO3kmRZP0betg=="
    },
    "node_modules/@microsoft/dynamicproto-js": {
      "version": "1.1.9",
      "resolved": "https://registry.npmjs.org/@microsoft/dynamicproto-js/-/dynamicproto-js-1.1.9.tgz",
      "integrity": "sha512-n1VPsljTSkthsAFYdiWfC+DKzK2WwcRp83Y1YAqdX552BstvsDjft9YXppjUzp11BPsapDoO1LDgrDB0XVsfNQ=="
    },
    "node_modules/@parcel/watcher": {
      "version": "2.5.1",
      "resolved": "git+ssh://git@github.com/parcel-bundler/watcher.git#1ca032aa8339260a8a3bcf825c3a1a71e3e43542",
      "integrity": "sha512-Z0lk8pM5vwuOJU6pfheRXHrOpQYIIEnVl/z8DY6370D4+ZnrOTvFa5BUdf3pGxahT5ILbPWwQSm2Wthy4q1OTg==",
      "hasInstallScript": true,
      "license": "MIT",
      "dependencies": {
        "detect-libc": "^2.0.3",
        "is-glob": "^4.0.3",
        "micromatch": "^4.0.5",
        "node-addon-api": "^7.0.0"
      },
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/@tootallnate/once": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/@tootallnate/once/-/once-3.0.0.tgz",
      "integrity": "sha512-OAdBVB7rlwvLD+DiecSAyVKzKVmSfXbouCyM5I6wHGi4MGXIyFqErg1IvyJ7PI1e+GYZuZh7cCHV/c4LA8SKMw==",
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@vscode/deviceid": {
      "version": "0.1.1",
      "resolved": "https://registry.npmjs.org/@vscode/deviceid/-/deviceid-0.1.1.tgz",
      "integrity": "sha512-ErpoMeKKNYAkR1IT3zxB5RtiTqEECdh8fxggupWvzuxpTAX77hwOI2NdJ7um+vupnXRBZVx4ugo0+dVHJWUkag==",
      "hasInstallScript": true,
      "dependencies": {
        "fs-extra": "^11.2.0",
        "uuid": "^9.0.1"
      }
    },
    "node_modules/@vscode/iconv-lite-umd": {
      "version": "0.7.1",
      "resolved": "https://registry.npmjs.org/@vscode/iconv-lite-umd/-/iconv-lite-umd-0.7.1.tgz",
      "integrity": "sha512-tK6k0DXFHW7q5+GGuGZO+phpAqpxO4WXl+BLc/8/uOk3RsM2ssAL3CQUQDb1TGfwltjsauhN6S4ghYZzs4sPFw==",
      "license": "MIT"
    },
    "node_modules/@vscode/proxy-agent": {
      "version": "0.36.0",
      "resolved": "https://registry.npmjs.org/@vscode/proxy-agent/-/proxy-agent-0.36.0.tgz",
      "integrity": "sha512-W4mls/+zErqTYcKC41utdmoYnBWZRH1dRF9U4cBAyKU5EhcnWfVsPBvUnXXw1CffI3djmMWnu9JrF/Ynw7lkcg==",
      "license": "MIT",
      "dependencies": {
        "@tootallnate/once": "^3.0.0",
        "agent-base": "^7.0.1",
        "debug": "^4.3.4",
        "http-proxy-agent": "^7.0.0",
        "https-proxy-agent": "^7.0.2",
        "socks-proxy-agent": "^8.0.1",
        "undici": "^7.2.0"
      },
      "engines": {
        "node": ">=22.15.0"
      },
      "optionalDependencies": {
        "@vscode/windows-ca-certs": "^0.3.1"
      }
    },
    "node_modules/@vscode/ripgrep": {
      "version": "1.15.14",
      "resolved": "https://registry.npmjs.org/@vscode/ripgrep/-/ripgrep-1.15.14.tgz",
      "integrity": "sha512-/G1UJPYlm+trBWQ6cMO3sv6b8D1+G16WaJH1/DSqw32JOVlzgZbLkDxRyzIpTpv30AcYGMkCf5tUqGlW6HbDWw==",
      "hasInstallScript": true,
      "license": "MIT",
      "dependencies": {
        "https-proxy-agent": "^7.0.2",
        "proxy-from-env": "^1.1.0",
        "yauzl": "^2.9.2"
      }
    },
    "node_modules/@vscode/ripgrep/node_modules/yauzl": {
      "version": "2.10.0",
      "resolved": "https://registry.npmjs.org/yauzl/-/yauzl-2.10.0.tgz",
      "integrity": "sha1-x+sXyT4RLLEIb6bY5R+wZnt5pfk= sha512-p4a9I6X6nu6IhoGmBqAcbJy1mlC4j27vEPZX9F4L4/vZT3Lyq1VkFHw/V/PUcB9Buo+DG3iHkT0x3Qya58zc3g==",
      "dependencies": {
        "buffer-crc32": "~0.2.3",
        "fd-slicer": "~1.1.0"
      }
    },
    "node_modules/@vscode/spdlog": {
      "version": "0.15.4",
      "resolved": "https://registry.npmjs.org/@vscode/spdlog/-/spdlog-0.15.4.tgz",
      "integrity": "sha512-NmFasVWjn/6BjHMAjqalsbG2srQCt8yfC0EczP5wzNQFawv74rhvuarhWi44x3St9LB8bZBxrpbT7igPaTJwcw==",
      "hasInstallScript": true,
      "license": "MIT",
      "dependencies": {
        "bindings": "^1.5.0",
        "mkdirp": "^1.0.4",
        "node-addon-api": "7.1.0"
      }
    },
    "node_modules/@vscode/tree-sitter-wasm": {
      "version": "0.3.0",
      "resolved": "https://registry.npmjs.org/@vscode/tree-sitter-wasm/-/tree-sitter-wasm-0.3.0.tgz",
      "integrity": "sha512-4kjB1jgLyG9VimGfyJb1F8/GFdrx55atsBCH/9r2D/iZHAUDCvZ5zhWXB7sRQ2z2WkkuNYm/0pgQtUm1jhdf7A==",
      "license": "MIT"
    },
    "node_modules/@vscode/vscode-languagedetection": {
      "version": "1.0.21",
      "resolved": "https://registry.npmjs.org/@vscode/vscode-languagedetection/-/vscode-languagedetection-1.0.21.tgz",
      "integrity": "sha512-zSUH9HYCw5qsCtd7b31yqkpaCU6jhtkKLkvOOA8yTrIRfBSOFb8PPhgmMicD7B/m+t4PwOJXzU1XDtrM9Fd3/g==",
      "bin": {
        "vscode-languagedetection": "cli/index.js"
      }
    },
    "node_modules/@vscode/windows-ca-certs": {
      "version": "0.3.3",
      "resolved": "https://registry.npmjs.org/@vscode/windows-ca-certs/-/windows-ca-certs-0.3.3.tgz",
      "integrity": "sha512-C0Iq5RcH+H31GUZ8bsMORsX3LySVkGAqe4kQfUSVcCqJ0QOhXkhgwUMU7oCiqYLXaQWyXFp6Fj6eMdt05uK7VA==",
      "hasInstallScript": true,
      "license": "BSD",
      "optional": true,
      "os": [
        "win32"
      ],
      "dependencies": {
        "node-addon-api": "^8.2.0"
      }
    },
    "node_modules/@vscode/windows-ca-certs/node_modules/node-addon-api": {
      "version": "8.2.0",
      "resolved": "https://registry.npmjs.org/node-addon-api/-/node-addon-api-8.2.0.tgz",
      "integrity": "sha512-qnyuI2ROiCkye42n9Tj5aX1ns7rzj6n7zW1XReSnLSL9v/vbLeR6fJq6PU27YU/ICfYw6W7Ouk/N7cysWu/hlw==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": "^18 || ^20 || >= 21"
      }
    },
    "node_modules/@vscode/windows-process-tree": {
      "version": "0.6.2",
      "resolved": "https://registry.npmjs.org/@vscode/windows-process-tree/-/windows-process-tree-0.6.2.tgz",
      "integrity": "sha512-uzyUuQ93m7K1jSPrB/72m4IspOyeGpvvghNwFCay/McZ+y4Hk2BnLdZPb6EJ8HLRa3GwCvYjH/MQZzcnLOVnaQ==",
      "hasInstallScript": true,
      "license": "MIT",
      "dependencies": {
        "node-addon-api": "7.1.0"
      }
    },
    "node_modules/@vscode/windows-registry": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/@vscode/windows-registry/-/windows-registry-1.1.2.tgz",
      "integrity": "sha512-/eDRmGNe6g11wHckOyiVLvK/mEE5UBZFeoRlBosIL343LDrSKUL5JDAcFeAZqOXnlTtZ3UZtj5yezKiAz99NcA==",
      "hasInstallScript": true,
      "license": "MIT"
    },
    "node_modules/@xterm/addon-clipboard": {
      "version": "0.2.0-beta.119",
      "resolved": "https://registry.npmjs.org/@xterm/addon-clipboard/-/addon-clipboard-0.2.0-beta.119.tgz",
      "integrity": "sha512-yWmCpGuTvSaIeEfdSijdf8K8qRAYuEGnKkaJZ6er+cOzdmGHBNzyBDKKeyins0aV2j4CGKPDiWHQF5+qGzZDGw==",
      "license": "MIT",
      "dependencies": {
        "js-base64": "^3.7.5"
      },
      "peerDependencies": {
        "@xterm/xterm": "^5.6.0-beta.136"
      }
    },
    "node_modules/@xterm/addon-image": {
      "version": "0.9.0-beta.136",
      "resolved": "https://registry.npmjs.org/@xterm/addon-image/-/addon-image-0.9.0-beta.136.tgz",
      "integrity": "sha512-syWhqpFMAcQ1+US0JjFzj0ORokj8hkz2VgXcCCbTfO0cDtpSYYxMNLaY2fpL459rnOFB4olI9Nf9PZdonmBPDw==",
      "license": "MIT",
      "peerDependencies": {
        "@xterm/xterm": "^5.6.0-beta.136"
      }
    },
    "node_modules/@xterm/addon-ligatures": {
      "version": "0.10.0-beta.136",
      "resolved": "https://registry.npmjs.org/@xterm/addon-ligatures/-/addon-ligatures-0.10.0-beta.136.tgz",
      "integrity": "sha512-WkvL7BVdoqpNf8QsH4n37Pu7jEZTiJ+OD4FmLMVavw0euhgG18zzJKNKIYRuKcddR52dT/Q8TrspVJofpL98GQ==",
      "license": "MIT",
      "dependencies": {
        "font-finder": "^1.1.0",
        "font-ligatures": "^1.4.1"
      },
      "engines": {
        "node": ">8.0.0"
      },
      "peerDependencies": {
        "@xterm/xterm": "^5.6.0-beta.136"
      }
    },
    "node_modules/@xterm/addon-progress": {
      "version": "0.2.0-beta.42",
      "resolved": "https://registry.npmjs.org/@xterm/addon-progress/-/addon-progress-0.2.0-beta.42.tgz",
      "integrity": "sha512-C5w7y6rwSUdRcEiJHFnB2qJI/6DBOi/fJAvTmIpmNZE60cVnrLUuyLmXh6aKbSQ44J6W3PrD5xthb8re3UVUOw==",
      "license": "MIT",
      "peerDependencies": {
        "@xterm/xterm": "^5.6.0-beta.136"
      }
    },
    "node_modules/@xterm/addon-search": {
      "version": "0.16.0-beta.136",
      "resolved": "https://registry.npmjs.org/@xterm/addon-search/-/addon-search-0.16.0-beta.136.tgz",
      "integrity": "sha512-Y2T/ShQBelmOGy7lup3VEfFF/yXeNkkMXqhGftmjzmwSA+eylFW+92vczMSrckTW++EFvVLR/L5jMXiSw0qOWQ==",
      "license": "MIT",
      "peerDependencies": {
        "@xterm/xterm": "^5.6.0-beta.136"
      }
    },
    "node_modules/@xterm/addon-serialize": {
      "version": "0.14.0-beta.136",
      "resolved": "https://registry.npmjs.org/@xterm/addon-serialize/-/addon-serialize-0.14.0-beta.136.tgz",
      "integrity": "sha512-ursvqITzhZrBQT8XsbOyAQJJKohv33NEm6ToLtMZUmPurBG6KXlVZ9LAPs2YpCBqkifLktSE1GdsofJCpADWuA==",
      "license": "MIT",
      "peerDependencies": {
        "@xterm/xterm": "^5.6.0-beta.136"
      }
    },
    "node_modules/@xterm/addon-unicode11": {
      "version": "0.9.0-beta.136",
      "resolved": "https://registry.npmjs.org/@xterm/addon-unicode11/-/addon-unicode11-0.9.0-beta.136.tgz",
      "integrity": "sha512-RwtNbON1uNndrtPCM6qMMElTTpxs7ZLRQVbSm4/BMW6GAt6AbW1RAqwoxMRhbz7VVTux/c3HcKfj3SI1MhqSOw==",
      "license": "MIT",
      "peerDependencies": {
        "@xterm/xterm": "^5.6.0-beta.136"
      }
    },
    "node_modules/@xterm/addon-webgl": {
      "version": "0.19.0-beta.136",
      "resolved": "https://registry.npmjs.org/@xterm/addon-webgl/-/addon-webgl-0.19.0-beta.136.tgz",
      "integrity": "sha512-MzVlFKrlgJjKQ6T4/TuamvlvR2FFDvxAPY90lo9u4899k7NNif+M8bBdNea3+bsPMU3fKLhGHoTp0+8MjskaeA==",
      "license": "MIT",
      "peerDependencies": {
        "@xterm/xterm": "^5.6.0-beta.136"
      }
    },
    "node_modules/@xterm/headless": {
      "version": "5.6.0-beta.136",
      "resolved": "https://registry.npmjs.org/@xterm/headless/-/headless-5.6.0-beta.136.tgz",
      "integrity": "sha512-3irueWS6Ei+XlTMCuh6ZWj1tBnVvjitDtD4PN+v81RKjaCNO/QN9abGTHQx+651GP291ESwY8ocKThSoQ9yklw==",
      "license": "MIT"
    },
    "node_modules/@xterm/xterm": {
      "version": "5.6.0-beta.136",
      "resolved": "https://registry.npmjs.org/@xterm/xterm/-/xterm-5.6.0-beta.136.tgz",
      "integrity": "sha512-cOWfdbPUYjV8qJY0yg/HdJBiq/hl8J2NRma563crQbSveDpuiiKV+T+ZVeGKQ2YZztLCz6h+kox6J7LQcPtpiQ==",
      "license": "MIT"
    },
    "node_modules/agent-base": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-7.1.1.tgz",
      "integrity": "sha512-H0TSyFNDMomMNJQBn8wFV5YC/2eJ+VXECwOadZJT554xP6cODZHPX3H9QMQECxvrgiSOP1pHjy1sMWQVYJOUOA==",
      "dependencies": {
        "debug": "^4.3.4"
      },
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/base64-js": {
      "version": "1.5.1",
      "resolved": "https://registry.npmjs.org/base64-js/-/base64-js-1.5.1.tgz",
      "integrity": "sha512-AKpaYlHn8t4SVbOHCy+b5+KKgvR4vrsD8vbvrbiQJps7fKDTkjkDry6ji0rUJjC0kzbNePLwzxq8iypo41qeWA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ]
    },
    "node_modules/bindings": {
      "version": "1.5.0",
      "resolved": "https://registry.npmjs.org/bindings/-/bindings-1.5.0.tgz",
      "integrity": "sha512-p2q/t/mhvuOj/UeLlV6566GD/guowlr0hHxClI0W9m7MWYkL1F0hLo+0Aexs9HSPCtR1SXQ0TD3MMKrXZajbiQ==",
      "dependencies": {
        "file-uri-to-path": "1.0.0"
      }
    },
    "node_modules/bl": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/bl/-/bl-4.1.0.tgz",
      "integrity": "sha512-1W07cM9gS6DcLperZfFSj+bWLtaPGSOHWhPiGzXmvVJbRLdG82sH/Kn8EtW1VqWVA54AKf2h5k5BbnIbwF3h6w==",
      "dependencies": {
        "buffer": "^5.5.0",
        "inherits": "^2.0.4",
        "readable-stream": "^3.4.0"
      }
    },
    "node_modules/braces": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/braces/-/braces-3.0.3.tgz",
      "integrity": "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
      "dependencies": {
        "fill-range": "^7.1.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/buffer": {
      "version": "5.7.1",
      "resolved": "https://registry.npmjs.org/buffer/-/buffer-5.7.1.tgz",
      "integrity": "sha512-EHcyIPBQ4BSGlvjB16k5KgAJ27CIsHY/2JBmCRReo48y9rQ3MaUzWX3KVlBa4U7MyX02HdVj0K7C3WaB3ju7FQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "dependencies": {
        "base64-js": "^1.3.1",
        "ieee754": "^1.1.13"
      }
    },
    "node_modules/buffer-crc32": {
      "version": "0.2.13",
      "resolved": "https://registry.npmjs.org/buffer-crc32/-/buffer-crc32-0.2.13.tgz",
      "integrity": "sha1-DTM+PwDqxQqhRUq9MO+MKl2ackI= sha512-VO9Ht/+p3SN7SKWqcrgEzjGbRSJYTx+Q1pTQC0wrWqHx0vpJraQ6GtHx8tvcg1rlK1byhU5gccxgOgj7B0TDkQ==",
      "engines": {
        "node": "*"
      }
    },
    "node_modules/chownr": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/chownr/-/chownr-1.1.4.tgz",
      "integrity": "sha512-jJ0bqzaylmJtVnNgzTeSOs8DPavpbYgEr/b0YL8/2GO3xJEhInFmhKMUnEJQjZumK7KXGFhUy89PrsJWlakBVg=="
    },
    "node_modules/commander": {
      "version": "8.3.0",
      "resolved": "https://registry.npmjs.org/commander/-/commander-8.3.0.tgz",
      "integrity": "sha512-OkTL9umf+He2DZkUq8f8J9of7yL6RJKI24dVITBmNfZBmri9zYZQrKkuXiKhyfPSu8tUhnVBB1iKXevvnlR4Ww==",
      "license": "MIT",
      "engines": {
        "node": ">= 12"
      }
    },
    "node_modules/cookie": {
      "version": "0.7.2",
      "resolved": "https://registry.npmjs.org/cookie/-/cookie-0.7.2.tgz",
      "integrity": "sha512-yki5XnKuf750l50uGTllt6kKILY4nQ1eNIQatoXEByZ5dWgnKqbnqmTrBE5B4N7lrMJKQ2ytWMiTO2o0v6Ew/w==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/debug": {
      "version": "4.3.4",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.3.4.tgz",
      "integrity": "sha512-PRWFHuSU3eDtQJPvnNY7Jcket1j0t5OuOsFzPPzsekD52Zl8qUfFIPEiswXqIvHWGVHOgX+7G/vCNNhehwxfkQ==",
      "dependencies": {
        "ms": "2.1.2"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/decompress-response": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/decompress-response/-/decompress-response-6.0.0.tgz",
      "integrity": "sha512-aW35yZM6Bb/4oJlZncMH2LCoZtJXTRxES17vE3hoRiowU2kWHaJKFkSBDnDR+cm9J+9QhXmREyIfv0pji9ejCQ==",
      "dependencies": {
        "mimic-response": "^3.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/deep-extend": {
      "version": "0.6.0",
      "resolved": "https://registry.npmjs.org/deep-extend/-/deep-extend-0.6.0.tgz",
      "integrity": "sha512-LOHxIOaPYdHlJRtCQfDIVZtfw/ufM8+rVj649RIHzcm/vGwQRXFt6OPqIFWsm2XEMrNIEtWR64sY1LEKD2vAOA==",
      "engines": {
        "node": ">=4.0.0"
      }
    },
    "node_modules/detect-libc": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.0.4.tgz",
      "integrity": "sha512-3UDv+G9CsCKO1WKMGw9fwq/SWJYbI0c5Y7LU1AXYoDdbhE2AHQ6N6Nb34sG8Fj7T5APy8qXDCKuuIHd1BR0tVA==",
      "license": "Apache-2.0",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/end-of-stream": {
      "version": "1.4.4",
      "resolved": "https://registry.npmjs.org/end-of-stream/-/end-of-stream-1.4.4.tgz",
      "integrity": "sha512-+uw1inIHVPQoaVuHzRyXd21icM+cnt4CzD5rW+NC1wjOUSTOs+Te7FOv7AhN7vS9x/oIyhLP5PR1H+phQAHu5Q==",
      "dependencies": {
        "once": "^1.4.0"
      }
    },
    "node_modules/expand-template": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/expand-template/-/expand-template-2.0.3.tgz",
      "integrity": "sha512-XYfuKMvj4O35f/pOXLObndIRvyQ+/+6AhODh+OKWj9S9498pHHn/IMszH+gt0fBCRWMNfk1ZSp5x3AifmnI2vg==",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/fd-slicer": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/fd-slicer/-/fd-slicer-1.1.0.tgz",
      "integrity": "sha1-JcfInLH5B3+IkbvmHY85Dq4lbx4= sha512-cE1qsB/VwyQozZ+q1dGxR8LBYNZeofhEdUNGSMbQD3Gw2lAzX9Zb3uIU6Ebc/Fmyjo9AWWfnn0AUCHqtevs/8g==",
      "dependencies": {
        "pend": "~1.2.0"
      }
    },
    "node_modules/file-uri-to-path": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/file-uri-to-path/-/file-uri-to-path-1.0.0.tgz",
      "integrity": "sha512-0Zt+s3L7Vf1biwWZ29aARiVYLx7iMGnEUl9x33fbB/j3jR81u/O2LbqK+Bm1CDSNDKVtJ/YjwY7TUd5SkeLQLw=="
    },
    "node_modules/fill-range": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/fill-range/-/fill-range-7.1.1.tgz",
      "integrity": "sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==",
      "dependencies": {
        "to-regex-range": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/font-finder": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/font-finder/-/font-finder-1.1.0.tgz",
      "integrity": "sha512-wpCL2uIbi6GurJbU7ZlQ3nGd61Ho+dSU6U83/xJT5UPFfN35EeCW/rOtS+5k+IuEZu2SYmHzDIPL9eA5tSYRAw==",
      "license": "MIT",
      "dependencies": {
        "get-system-fonts": "^2.0.0",
        "promise-stream-reader": "^1.0.1"
      },
      "engines": {
        "node": ">8.0.0"
      }
    },
    "node_modules/font-ligatures": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/font-ligatures/-/font-ligatures-1.4.1.tgz",
      "integrity": "sha512-7W6zlfyhvCqShZ5ReUWqmSd9vBaUudW0Hxis+tqUjtHhsPU+L3Grf8mcZAtCiXHTzorhwdRTId2WeH/88gdFkw==",
      "license": "MIT",
      "dependencies": {
        "font-finder": "^1.0.3",
        "lru-cache": "^6.0.0",
        "opentype.js": "^0.8.0"
      },
      "engines": {
        "node": ">8.0.0"
      }
    },
    "node_modules/fs-constants": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/fs-constants/-/fs-constants-1.0.0.tgz",
      "integrity": "sha512-y6OAwoSIf7FyjMIv94u+b5rdheZEjzR63GTyZJm5qh4Bi+2YgwLCcI/fPFZkL5PSixOt6ZNKm+w+Hfp/Bciwow=="
    },
    "node_modules/fs-extra": {
      "version": "11.2.0",
      "resolved": "https://registry.npmjs.org/fs-extra/-/fs-extra-11.2.0.tgz",
      "integrity": "sha512-PmDi3uwK5nFuXh7XDTlVnS17xJS7vW36is2+w3xcv8SVxiB4NyATf4ctkVY5bkSjX0Y4nbvZCq1/EjtEyr9ktw==",
      "dependencies": {
        "graceful-fs": "^4.2.0",
        "jsonfile": "^6.0.1",
        "universalify": "^2.0.0"
      },
      "engines": {
        "node": ">=14.14"
      }
    },
    "node_modules/get-system-fonts": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/get-system-fonts/-/get-system-fonts-2.0.2.tgz",
      "integrity": "sha512-zzlgaYnHMIEgHRrfC7x0Qp0Ylhw/sHpM6MHXeVBTYIsvGf5GpbnClB+Q6rAPdn+0gd2oZZIo6Tj3EaWrt4VhDQ==",
      "license": "MIT",
      "engines": {
        "node": ">8.0.0"
      }
    },
    "node_modules/github-from-package": {
      "version": "0.0.0",
      "resolved": "https://registry.npmjs.org/github-from-package/-/github-from-package-0.0.0.tgz",
      "integrity": "sha1-l/tdlr/eiXMxPyDoKI75oWf6ZM4= sha512-SyHy3T1v2NUXn29OsWdxmK6RwHD+vkj3v8en8AOBZ1wBQ/hCAQ5bAQTD02kW4W9tUp/3Qh6J8r9EvntiyCmOOw=="
    },
    "node_modules/graceful-fs": {
      "version": "4.2.11",
      "resolved": "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.2.11.tgz",
      "integrity": "sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ=="
    },
    "node_modules/http-proxy-agent": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/http-proxy-agent/-/http-proxy-agent-7.0.0.tgz",
      "integrity": "sha512-+ZT+iBxVUQ1asugqnD6oWoRiS25AkjNfG085dKJGtGxkdwLQrMKU5wJr2bOOFAXzKcTuqq+7fZlTMgG3SRfIYQ==",
      "dependencies": {
        "agent-base": "^7.1.0",
        "debug": "^4.3.4"
      },
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/https-proxy-agent": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/https-proxy-agent/-/https-proxy-agent-7.0.2.tgz",
      "integrity": "sha512-NmLNjm6ucYwtcUmL7JQC1ZQ57LmHP4lT15FQ8D61nak1rO6DH+fz5qNK2Ap5UN4ZapYICE3/0KodcLYSPsPbaA==",
      "dependencies": {
        "agent-base": "^7.0.2",
        "debug": "4"
      },
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/ieee754": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/ieee754/-/ieee754-1.2.1.tgz",
      "integrity": "sha512-dcyqhDvX1C46lXZcVqCpK+FtMRQVdIMN6/Df5js2zouUsqG7I6sFxitIC+7KYK29KdXOLHdu9zL4sFnoVQnqaA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ]
    },
    "node_modules/inherits": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
      "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ=="
    },
    "node_modules/ini": {
      "version": "1.3.8",
      "resolved": "https://registry.npmjs.org/ini/-/ini-1.3.8.tgz",
      "integrity": "sha512-JV/yugV2uzW5iMRSiZAyDtQd+nxtUnjeLt0acNdw98kKLrvuRVyB80tsREOE7yvGVgalhZ6RNXCmEHkUKBKxew=="
    },
    "node_modules/ip-address": {
      "version": "9.0.5",
      "resolved": "https://registry.npmjs.org/ip-address/-/ip-address-9.0.5.tgz",
      "integrity": "sha512-zHtQzGojZXTwZTHQqra+ETKd4Sn3vgi7uBmlPoXVWZqYvuKmtI0l/VZTjqGmJY9x88GGOaZ9+G9ES8hC4T4X8g==",
      "dependencies": {
        "jsbn": "1.1.0",
        "sprintf-js": "^1.1.3"
      },
      "engines": {
        "node": ">= 12"
      }
    },
    "node_modules/is-extglob": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/is-extglob/-/is-extglob-2.1.1.tgz",
      "integrity": "sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-glob": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/is-glob/-/is-glob-4.0.3.tgz",
      "integrity": "sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==",
      "dependencies": {
        "is-extglob": "^2.1.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-number": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/is-number/-/is-number-7.0.0.tgz",
      "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
      "engines": {
        "node": ">=0.12.0"
      }
    },
    "node_modules/js-base64": {
      "version": "3.7.7",
      "resolved": "https://registry.npmjs.org/js-base64/-/js-base64-3.7.7.tgz",
      "integrity": "sha512-7rCnleh0z2CkXhH67J8K1Ytz0b2Y+yxTPL+/KOJoa20hfnVQ/3/T6W/KflYI4bRHRagNeXeU2bkNGI3v1oS/lw=="
    },
    "node_modules/jsbn": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/jsbn/-/jsbn-1.1.0.tgz",
      "integrity": "sha512-4bYVV3aAMtDTTu4+xsDYa6sy9GyJ69/amsu9sYF2zqjiEoZA5xJi3BrfX3uY+/IekIu7MwdObdbDWpoZdBv3/A=="
    },
    "node_modules/jschardet": {
      "version": "3.1.4",
      "resolved": "https://registry.npmjs.org/jschardet/-/jschardet-3.1.4.tgz",
      "integrity": "sha512-/kmVISmrwVwtyYU40iQUOp3SUPk2dhNCMsZBQX0R1/jZ8maaXJ/oZIzUOiyOqcgtLnETFKYChbJ5iDC/eWmFHg==",
      "license": "LGPL-2.1+",
      "engines": {
        "node": ">=0.1.90"
      }
    },
    "node_modules/jsonfile": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/jsonfile/-/jsonfile-6.1.0.tgz",
      "integrity": "sha512-5dgndWOriYSm5cnYaJNhalLNDKOqFwyDB/rr1E9ZsGciGvKPs8R2xYGCacuf3z6K1YKDz182fd+fY3cn3pMqXQ==",
      "dependencies": {
        "universalify": "^2.0.0"
      },
      "optionalDependencies": {
        "graceful-fs": "^4.1.6"
      }
    },
    "node_modules/katex": {
      "version": "0.16.22",
      "resolved": "https://registry.npmjs.org/katex/-/katex-0.16.22.tgz",
      "integrity": "sha512-XCHRdUw4lf3SKBaJe4EvgqIuWwkPSo9XoeO8GjQW94Bp7TWv9hNhzZjZ+OH9yf1UmLygb7DIT5GSFQiyt16zYg==",
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
    "node_modules/kerberos": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/kerberos/-/kerberos-2.1.1.tgz",
      "integrity": "sha512-414s1G/qgK2T60cXnZsHbtRj8Ynjg0DBlQWeY99tkyqQ2e8vGgFHvxRdvjTlLHg/SxBA0zLQcGE6Pk6Dfq/BCA==",
      "hasInstallScript": true,
      "dependencies": {
        "bindings": "^1.5.0",
        "node-addon-api": "^6.1.0",
        "prebuild-install": "^7.1.2"
      },
      "engines": {
        "node": ">=12.9.0"
      }
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
    "node_modules/micromatch": {
      "version": "4.0.8",
      "resolved": "https://registry.npmjs.org/micromatch/-/micromatch-4.0.8.tgz",
      "integrity": "sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==",
      "dependencies": {
        "braces": "^3.0.3",
        "picomatch": "^2.3.1"
      },
      "engines": {
        "node": ">=8.6"
      }
    },
    "node_modules/mimic-response": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/mimic-response/-/mimic-response-3.1.0.tgz",
      "integrity": "sha512-z0yWI+4FDrrweS8Zmt4Ej5HdJmky15+L2e6Wgn3+iK5fWzb6T3fhNFq2+MeTRb064c6Wr4N/wv0DzQTjNzHNGQ==",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/minimist": {
      "version": "1.2.8",
      "resolved": "https://registry.npmjs.org/minimist/-/minimist-1.2.8.tgz",
      "integrity": "sha512-2yyAR8qBkN3YuheJanUpWC5U3bb5osDywNB8RzDVlDwDHbocAJveqqj1u8+SVD7jkWT4yvsHCpWqqWqAxb0zCA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/mkdirp": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/mkdirp/-/mkdirp-1.0.4.tgz",
      "integrity": "sha512-vVqVZQyf3WLx2Shd0qJ9xuvqgAyKPLAiqITEtqW0oIUjzo3PePDd6fW9iFz30ef7Ysp/oiWqbhszeGWW2T6Gzw==",
      "bin": {
        "mkdirp": "bin/cmd.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/mkdirp-classic": {
      "version": "0.5.3",
      "resolved": "https://registry.npmjs.org/mkdirp-classic/-/mkdirp-classic-0.5.3.tgz",
      "integrity": "sha512-gKLcREMhtuZRwRAfqP3RFW+TK4JqApVBtOIftVgjuABpAtpxhPGaDcfvbhNvD0B8iD1oUr/txX35NjcaY6Ns/A=="
    },
    "node_modules/ms": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.2.tgz",
      "integrity": "sha512-sGkPx+VjMtmA6MX27oA4FBFELFCZZ4S4XqeGOXCv68tT+jb3vk/RyaKWP0PTKyWtmLSM0b+adUTEvbs1PEaH2w=="
    },
    "node_modules/napi-build-utils": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/napi-build-utils/-/napi-build-utils-1.0.2.tgz",
      "integrity": "sha512-ONmRUqK7zj7DWX0D9ADe03wbwOBZxNAfF20PlGfCWQcD3+/MakShIHrMqx9YwPTfxDdF1zLeL+RGZiR9kGMLdg=="
    },
    "node_modules/native-watchdog": {
      "version": "1.4.2",
      "resolved": "https://registry.npmjs.org/native-watchdog/-/native-watchdog-1.4.2.tgz",
      "integrity": "sha512-iT3Uj6FFdrW5vHbQ/ybiznLus9oiUoMJ8A8nyugXv9rV3EBhIodmGs+mztrwQyyBc+PB5/CrskAH/WxaUVRRSQ==",
      "hasInstallScript": true
    },
    "node_modules/node-abi": {
      "version": "3.8.0",
      "resolved": "https://registry.npmjs.org/node-abi/-/node-abi-3.8.0.tgz",
      "integrity": "sha512-tzua9qWWi7iW4I42vUPKM+SfaF0vQSLAm4yO5J83mSwB7GeoWrDKC/K+8YCnYNwqP5duwazbw2X9l4m8SC2cUw==",
      "dependencies": {
        "semver": "^7.3.5"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/node-addon-api": {
      "version": "7.1.0",
      "resolved": "https://registry.npmjs.org/node-addon-api/-/node-addon-api-7.1.0.tgz",
      "integrity": "sha512-mNcltoe1R8o7STTegSOHdnJNN7s5EUvhoS7ShnTHDyOSd+8H+UdWODq6qSv67PjC8Zc5JRT8+oLAMCr0SIXw7g==",
      "license": "MIT",
      "engines": {
        "node": "^16 || ^18 || >= 20"
      }
    },
    "node_modules/node-pty": {
      "version": "1.1.0-beta42",
      "resolved": "https://registry.npmjs.org/node-pty/-/node-pty-1.1.0-beta42.tgz",
      "integrity": "sha512-59KoV6xxhJciRVpo4lQ9wnP38SPaBlXgwszYS8nlHAHrt02d14peg+kHtJ4AOtyLWiCf8WPCeJNbxBkiA7Oy7Q==",
      "hasInstallScript": true,
      "license": "MIT",
      "dependencies": {
        "node-addon-api": "^7.1.0"
      }
    },
    "node_modules/once": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
      "integrity": "sha1-WDsap3WWHUsROsF9nFC6753Xa9E= sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==",
      "dependencies": {
        "wrappy": "1"
      }
    },
    "node_modules/opentype.js": {
      "version": "0.8.0",
      "resolved": "https://registry.npmjs.org/opentype.js/-/opentype.js-0.8.0.tgz",
      "integrity": "sha512-FQHR4oGP+a0m/f6yHoRpBOIbn/5ZWxKd4D/djHVJu8+KpBTYrJda0b7mLcgDEMWXE9xBCJm+qb0yv6FcvPjukg==",
      "license": "MIT",
      "dependencies": {
        "tiny-inflate": "^1.0.2"
      },
      "bin": {
        "ot": "bin/ot"
      }
    },
    "node_modules/pend": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/pend/-/pend-1.2.0.tgz",
      "integrity": "sha1-elfrVQpng/kRUzH89GY9XI4AelA= sha512-F3asv42UuXchdzt+xXqfW1OGlVBe+mxa2mqI0pg5yAHZPvFmY3Y6drSf/GQ1A86WgWEN9Kzh/WrgKa6iGcHXLg=="
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
    "node_modules/prebuild-install": {
      "version": "7.1.2",
      "resolved": "https://registry.npmjs.org/prebuild-install/-/prebuild-install-7.1.2.tgz",
      "integrity": "sha512-UnNke3IQb6sgarcZIDU3gbMeTp/9SSU1DAIkil7PrqG1vZlBtY5msYccSKSHDqa3hNg436IXK+SNImReuA1wEQ==",
      "dependencies": {
        "detect-libc": "^2.0.0",
        "expand-template": "^2.0.3",
        "github-from-package": "0.0.0",
        "minimist": "^1.2.3",
        "mkdirp-classic": "^0.5.3",
        "napi-build-utils": "^1.0.1",
        "node-abi": "^3.3.0",
        "pump": "^3.0.0",
        "rc": "^1.2.7",
        "simple-get": "^4.0.0",
        "tar-fs": "^2.0.0",
        "tunnel-agent": "^0.6.0"
      },
      "bin": {
        "prebuild-install": "bin.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/promise-stream-reader": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/promise-stream-reader/-/promise-stream-reader-1.0.1.tgz",
      "integrity": "sha512-Tnxit5trUjBAqqZCGWwjyxhmgMN4hGrtpW3Oc/tRI4bpm/O2+ej72BB08l6JBnGQgVDGCLvHFGjGgQS6vzhwXg==",
      "license": "MIT",
      "engines": {
        "node": ">8.0.0"
      }
    },
    "node_modules/proxy-from-env": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/proxy-from-env/-/proxy-from-env-1.1.0.tgz",
      "integrity": "sha512-D+zkORCbA9f1tdWRK0RaCR3GPv50cMxcrz4X8k5LTSUD1Dkw47mKJEZQNunItRTkWwgtaUSo1RVFRIG9ZXiFYg=="
    },
    "node_modules/pump": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/pump/-/pump-3.0.0.tgz",
      "integrity": "sha512-LwZy+p3SFs1Pytd/jYct4wpv49HiYCqd9Rlc5ZVdk0V+8Yzv6jR5Blk3TRmPL1ft69TxP0IMZGJ+WPFU2BFhww==",
      "dependencies": {
        "end-of-stream": "^1.1.0",
        "once": "^1.3.1"
      }
    },
    "node_modules/rc": {
      "version": "1.2.8",
      "resolved": "https://registry.npmjs.org/rc/-/rc-1.2.8.tgz",
      "integrity": "sha512-y3bGgqKj3QBdxLbLkomlohkvsA8gdAiUQlSBJnBhfn+BPxg4bc62d8TcBW15wavDfgexCgccckhcZvywyQYPOw==",
      "dependencies": {
        "deep-extend": "^0.6.0",
        "ini": "~1.3.0",
        "minimist": "^1.2.0",
        "strip-json-comments": "~2.0.1"
      },
      "bin": {
        "rc": "cli.js"
      }
    },
    "node_modules/readable-stream": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/readable-stream/-/readable-stream-3.6.0.tgz",
      "integrity": "sha512-BViHy7LKeTz4oNnkcLJ+lVSL6vpiFeX6/d3oSH8zCW7UxP2onchk+vTGB143xuFjHS3deTgkKoXXymXqymiIdA==",
      "dependencies": {
        "inherits": "^2.0.3",
        "string_decoder": "^1.1.1",
        "util-deprecate": "^1.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/safe-buffer": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.2.1.tgz",
      "integrity": "sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ]
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
    "node_modules/simple-concat": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/simple-concat/-/simple-concat-1.0.1.tgz",
      "integrity": "sha512-cSFtAPtRhljv69IK0hTVZQ+OfE9nePi/rtJmw5UjHeVyVroEqJXP1sFztKUy1qU+xvz3u/sfYJLa947b7nAN2Q==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ]
    },
    "node_modules/simple-get": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/simple-get/-/simple-get-4.0.1.tgz",
      "integrity": "sha512-brv7p5WgH0jmQJr1ZDDfKDOSeWWg+OVypG99A/5vYGPqJ6pxiaHLy8nxtFjBA7oMa01ebA9gfh1uMCFqOuXxvA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "dependencies": {
        "decompress-response": "^6.0.0",
        "once": "^1.3.1",
        "simple-concat": "^1.0.0"
      }
    },
    "node_modules/smart-buffer": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/smart-buffer/-/smart-buffer-4.2.0.tgz",
      "integrity": "sha512-94hK0Hh8rPqQl2xXc3HsaBoOXKV20MToPkcXvwbISWLEs+64sBq5kFgn2kJDHb1Pry9yrP0dxrCI9RRci7RXKg==",
      "engines": {
        "node": ">= 6.0.0",
        "npm": ">= 3.0.0"
      }
    },
    "node_modules/socks": {
      "version": "2.8.3",
      "resolved": "https://registry.npmjs.org/socks/-/socks-2.8.3.tgz",
      "integrity": "sha512-l5x7VUUWbjVFbafGLxPWkYsHIhEvmF85tbIeFZWc8ZPtoMyybuEhL7Jye/ooC4/d48FgOjSJXgsF/AJPYCW8Zw==",
      "dependencies": {
        "ip-address": "^9.0.5",
        "smart-buffer": "^4.2.0"
      },
      "engines": {
        "node": ">= 10.0.0",
        "npm": ">= 3.0.0"
      }
    },
    "node_modules/socks-proxy-agent": {
      "version": "8.0.4",
      "resolved": "https://registry.npmjs.org/socks-proxy-agent/-/socks-proxy-agent-8.0.4.tgz",
      "integrity": "sha512-GNAq/eg8Udq2x0eNiFkr9gRg5bA7PXEWagQdeRX4cPSG+X/8V38v637gim9bjFptMk1QWsCTr0ttrJEiXbNnRw==",
      "dependencies": {
        "agent-base": "^7.1.1",
        "debug": "^4.3.4",
        "socks": "^2.8.3"
      },
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/sprintf-js": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/sprintf-js/-/sprintf-js-1.1.3.tgz",
      "integrity": "sha512-Oo+0REFV59/rz3gfJNKQiBlwfHaSESl1pcGyABQsnnIfWOFt6JNj5gCog2U6MLZ//IGYD+nA8nI+mTShREReaA=="
    },
    "node_modules/string_decoder": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/string_decoder/-/string_decoder-1.3.0.tgz",
      "integrity": "sha512-hkRX8U1WjJFd8LsDJ2yQ/wWWxaopEsABU1XfkM8A+j0+85JAGppt16cr1Whg6KIbb4okU6Mql6BOj+uup/wKeA==",
      "dependencies": {
        "safe-buffer": "~5.2.0"
      }
    },
    "node_modules/strip-json-comments": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/strip-json-comments/-/strip-json-comments-2.0.1.tgz",
      "integrity": "sha1-PFMZQukIwml8DsNEhYwobHygpgo= sha512-4gB8na07fecVVkOI6Rs4e7T6NOTki5EmL7TUduTs6bu3EdnSycntVJ4re8kgZA+wx9IueI2Y11bfbgwtzuE0KQ==",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/tar-fs": {
      "version": "2.1.4",
      "resolved": "https://registry.npmjs.org/tar-fs/-/tar-fs-2.1.4.tgz",
      "integrity": "sha512-mDAjwmZdh7LTT6pNleZ05Yt65HC3E+NiQzl672vQG38jIrehtJk/J3mNwIg+vShQPcLF/LV7CMnDW6vjj6sfYQ==",
      "license": "MIT",
      "dependencies": {
        "chownr": "^1.1.1",
        "mkdirp-classic": "^0.5.2",
        "pump": "^3.0.0",
        "tar-stream": "^2.1.4"
      }
    },
    "node_modules/tar-stream": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/tar-stream/-/tar-stream-2.2.0.tgz",
      "integrity": "sha512-ujeqbceABgwMZxEJnk2HDY2DlnUZ+9oEcb1KzTVfYHio0UE6dG71n60d8D2I4qNvleWrrXpmjpt7vZeF1LnMZQ==",
      "dependencies": {
        "bl": "^4.0.3",
        "end-of-stream": "^1.4.1",
        "fs-constants": "^1.0.0",
        "inherits": "^2.0.3",
        "readable-stream": "^3.1.1"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/tas-client": {
      "version": "0.3.1",
      "resolved": "https://registry.npmjs.org/tas-client/-/tas-client-0.3.1.tgz",
      "integrity": "sha512-Mn4+4t/KXEf8aIENeI1TkzpKIImzmG+FjPZ2dlaoGNFgxJqBE/pp3MT7nc2032EG4aS73E4OEcr2WiNaWW8mdA==",
      "license": "MIT",
      "engines": {
        "node": ">=22"
      }
    },
    "node_modules/tiny-inflate": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/tiny-inflate/-/tiny-inflate-1.0.3.tgz",
      "integrity": "sha512-pkY1fj1cKHb2seWDy0B16HeWyczlJA9/WW3u3c4z/NiWDsO3DOU5D7nhTLE9CF0yXv/QZFY7sEJmj24dK+Rrqw==",
      "license": "MIT"
    },
    "node_modules/to-regex-range": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz",
      "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
      "dependencies": {
        "is-number": "^7.0.0"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/tunnel-agent": {
      "version": "0.6.0",
      "resolved": "https://registry.npmjs.org/tunnel-agent/-/tunnel-agent-0.6.0.tgz",
      "integrity": "sha1-J6XeoGs2sEoKmWZ3SykIaPD8QP0= sha512-McnNiV1l8RYeY8tBgEpuodCC1mLUdbSN+CYBL7kJsJNInOP8UjDDEwdk6Mw60vdLLrr5NHKZhMAOSrR2NZuQ+w==",
      "dependencies": {
        "safe-buffer": "^5.0.1"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/undici": {
      "version": "7.9.0",
      "resolved": "https://registry.npmjs.org/undici/-/undici-7.9.0.tgz",
      "integrity": "sha512-e696y354tf5cFZPXsF26Yg+5M63+5H3oE6Vtkh2oqbvsE2Oe7s2nIbcQh5lmG7Lp/eS29vJtTpw9+p6PX0qNSg==",
      "license": "MIT",
      "engines": {
        "node": ">=20.18.1"
      }
    },
    "node_modules/universalify": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/universalify/-/universalify-2.0.1.tgz",
      "integrity": "sha512-gptHNQghINnc/vTGIk0SOFGFNXw7JVrlRUtConJRlvaw6DuX0wO5Jeko9sWrMBhh+PsYAZ7oXAiOnf/UKogyiw==",
      "engines": {
        "node": ">= 10.0.0"
      }
    },
    "node_modules/util-deprecate": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/util-deprecate/-/util-deprecate-1.0.2.tgz",
      "integrity": "sha1-RQ1Nyfpw3nMnYvvS1KKJgUGaDM8= sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw=="
    },
    "node_modules/uuid": {
      "version": "9.0.1",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-9.0.1.tgz",
      "integrity": "sha512-b+1eJOlsR9K8HJpow9Ok3fiWOWSIcIzXodvv0rQjVoOVNpWMpxf1wZNpt4y9h10odCNrqnYp1OBzRktckBe3sA==",
      "funding": [
        "https://github.com/sponsors/broofa",
        "https://github.com/sponsors/ctavan"
      ],
      "bin": {
        "uuid": "dist/bin/uuid"
      }
    },
    "node_modules/vscode-oniguruma": {
      "version": "1.7.0",
      "resolved": "https://registry.npmjs.org/vscode-oniguruma/-/vscode-oniguruma-1.7.0.tgz",
      "integrity": "sha512-L9WMGRfrjOhgHSdOYgCt/yRMsXzLDJSL7BPrOZt73gU0iWO4mpqzqQzOz5srxqTvMBaR0XZTSrVWo4j55Rc6cA=="
    },
    "node_modules/vscode-regexpp": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/vscode-regexpp/-/vscode-regexpp-3.1.0.tgz",
      "integrity": "sha512-pqtN65VC1jRLawfluX4Y80MMG0DHJydWhe5ZwMHewZD6sys4LbU6lHwFAHxeuaVE6Y6+xZOtAw+9hvq7/0ejkg==",
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/mysticatea"
      }
    },
    "node_modules/vscode-textmate": {
      "version": "9.3.0",
      "resolved": "https://registry.npmjs.org/vscode-textmate/-/vscode-textmate-9.3.0.tgz",
      "integrity": "sha512-zHiZZOdb9xqj5/X1C4a29sbgT2HngdWxPLSl3PyHRQF+5visI4uNM020OHiLJjsMxUssyk/pGVAg/9LCIobrVg==",
      "license": "MIT"
    },
    "node_modules/wrappy": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
      "integrity": "sha1-tSQ9jz7BqjXxNkYFvA0QNuMKtp8= sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ=="
    },
    "node_modules/yallist": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-4.0.0.tgz",
      "integrity": "sha512-3wdGidZyq5PB084XLES5TpOSRA3wjXAlIWMhum2kRcv/41Sn2emQ0dycQW4uZXLejwKvg6EsvbdlVL+FYEct7A=="
    },
    "node_modules/yauzl": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/yauzl/-/yauzl-3.1.1.tgz",
      "integrity": "sha512-MPxA7oN5cvGV0wzfkeHKF2/+Q4TkMpHSWGRy/96I4Cozljmx0ph91+Muxh6HegEtDC4GftJ8qYDE51vghFiEYA==",
      "dependencies": {
        "buffer-crc32": "~0.2.3",
        "pend": "~1.2.0"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/yazl": {
      "version": "2.4.3",
      "resolved": "https://registry.npmjs.org/yazl/-/yazl-2.4.3.tgz",
      "integrity": "sha1-7CblzIfVYBud+EMtvdPNLlFzoHE= sha512-cIUrm3/81iF/BzuyORI7ppz1vGHAhA62JYzAFFC+rwJ2jQF1LcYxY9UXx4XyUXojkCnol0SvPuc+Toc7FO4W8g==",
      "dependencies": {
        "buffer-crc32": "~0.2.3"
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: remote/package.json]---
Location: vscode-main/remote/package.json

```json
{
  "name": "vscode-reh",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "@microsoft/1ds-core-js": "^3.2.13",
    "@microsoft/1ds-post-js": "^3.2.13",
    "@parcel/watcher": "parcel-bundler/watcher#1ca032aa8339260a8a3bcf825c3a1a71e3e43542",
    "@vscode/deviceid": "^0.1.1",
    "@vscode/iconv-lite-umd": "0.7.1",
    "@vscode/proxy-agent": "^0.36.0",
    "@vscode/ripgrep": "^1.15.13",
    "@vscode/spdlog": "^0.15.2",
    "@vscode/tree-sitter-wasm": "^0.3.0",
    "@vscode/vscode-languagedetection": "1.0.21",
    "@vscode/windows-process-tree": "^0.6.0",
    "@vscode/windows-registry": "^1.1.0",
    "@xterm/addon-clipboard": "^0.2.0-beta.119",
    "@xterm/addon-image": "^0.9.0-beta.136",
    "@xterm/addon-ligatures": "^0.10.0-beta.136",
    "@xterm/addon-progress": "^0.2.0-beta.42",
    "@xterm/addon-search": "^0.16.0-beta.136",
    "@xterm/addon-serialize": "^0.14.0-beta.136",
    "@xterm/addon-unicode11": "^0.9.0-beta.136",
    "@xterm/addon-webgl": "^0.19.0-beta.136",
    "@xterm/headless": "^5.6.0-beta.136",
    "@xterm/xterm": "^5.6.0-beta.136",
    "cookie": "^0.7.0",
    "http-proxy-agent": "^7.0.0",
    "https-proxy-agent": "^7.0.2",
    "jschardet": "3.1.4",
    "katex": "^0.16.22",
    "kerberos": "2.1.1",
    "minimist": "^1.2.8",
    "native-watchdog": "^1.4.1",
    "node-pty": "^1.1.0-beta42",
    "tas-client": "0.3.1",
    "vscode-oniguruma": "1.7.0",
    "vscode-regexpp": "^3.1.0",
    "vscode-textmate": "^9.3.0",
    "yauzl": "^3.0.0",
    "yazl": "^2.4.3"
  },
  "overrides": {
    "node-gyp-build": "4.8.1",
    "kerberos@2.1.1": {
      "node-addon-api": "7.1.0"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: remote/web/.npmrc]---
Location: vscode-main/remote/web/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: remote/web/package-lock.json]---
Location: vscode-main/remote/web/package-lock.json

```json
{
  "name": "vscode-web",
  "version": "0.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "vscode-web",
      "version": "0.0.0",
      "dependencies": {
        "@microsoft/1ds-core-js": "^3.2.13",
        "@microsoft/1ds-post-js": "^3.2.13",
        "@vscode/iconv-lite-umd": "0.7.1",
        "@vscode/tree-sitter-wasm": "^0.3.0",
        "@vscode/vscode-languagedetection": "1.0.21",
        "@xterm/addon-clipboard": "^0.2.0-beta.119",
        "@xterm/addon-image": "^0.9.0-beta.136",
        "@xterm/addon-ligatures": "^0.10.0-beta.136",
        "@xterm/addon-progress": "^0.2.0-beta.42",
        "@xterm/addon-search": "^0.16.0-beta.136",
        "@xterm/addon-serialize": "^0.14.0-beta.136",
        "@xterm/addon-unicode11": "^0.9.0-beta.136",
        "@xterm/addon-webgl": "^0.19.0-beta.136",
        "@xterm/xterm": "^5.6.0-beta.136",
        "jschardet": "3.1.4",
        "katex": "^0.16.22",
        "tas-client": "0.3.1",
        "vscode-oniguruma": "1.7.0",
        "vscode-textmate": "^9.3.0"
      }
    },
    "node_modules/@microsoft/1ds-core-js": {
      "version": "3.2.13",
      "resolved": "https://registry.npmjs.org/@microsoft/1ds-core-js/-/1ds-core-js-3.2.13.tgz",
      "integrity": "sha512-CluYTRWcEk0ObG5EWFNWhs87e2qchJUn0p2D21ZUa3PWojPZfPSBs4//WIE0MYV8Qg1Hdif2ZTwlM7TbYUjfAg==",
      "dependencies": {
        "@microsoft/applicationinsights-core-js": "2.8.15",
        "@microsoft/applicationinsights-shims": "^2.0.2",
        "@microsoft/dynamicproto-js": "^1.1.7"
      }
    },
    "node_modules/@microsoft/1ds-post-js": {
      "version": "3.2.13",
      "resolved": "https://registry.npmjs.org/@microsoft/1ds-post-js/-/1ds-post-js-3.2.13.tgz",
      "integrity": "sha512-HgS574fdD19Bo2vPguyznL4eDw7Pcm1cVNpvbvBLWiW3x4e1FCQ3VMXChWnAxCae8Hb0XqlA2sz332ZobBavTA==",
      "dependencies": {
        "@microsoft/1ds-core-js": "3.2.13",
        "@microsoft/applicationinsights-shims": "^2.0.2",
        "@microsoft/dynamicproto-js": "^1.1.7"
      }
    },
    "node_modules/@microsoft/applicationinsights-core-js": {
      "version": "2.8.15",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-core-js/-/applicationinsights-core-js-2.8.15.tgz",
      "integrity": "sha512-yYAs9MyjGr2YijQdUSN9mVgT1ijI1FPMgcffpaPmYbHAVbQmF7bXudrBWHxmLzJlwl5rfep+Zgjli2e67lwUqQ==",
      "dependencies": {
        "@microsoft/applicationinsights-shims": "2.0.2",
        "@microsoft/dynamicproto-js": "^1.1.9"
      },
      "peerDependencies": {
        "tslib": "*"
      }
    },
    "node_modules/@microsoft/applicationinsights-shims": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-shims/-/applicationinsights-shims-2.0.2.tgz",
      "integrity": "sha512-PoHEgsnmcqruLNHZ/amACqdJ6YYQpED0KSRe6J7gIJTtpZC1FfFU9b1fmDKDKtFoUSrPzEh1qzO3kmRZP0betg=="
    },
    "node_modules/@microsoft/dynamicproto-js": {
      "version": "1.1.9",
      "resolved": "https://registry.npmjs.org/@microsoft/dynamicproto-js/-/dynamicproto-js-1.1.9.tgz",
      "integrity": "sha512-n1VPsljTSkthsAFYdiWfC+DKzK2WwcRp83Y1YAqdX552BstvsDjft9YXppjUzp11BPsapDoO1LDgrDB0XVsfNQ=="
    },
    "node_modules/@vscode/iconv-lite-umd": {
      "version": "0.7.1",
      "resolved": "https://registry.npmjs.org/@vscode/iconv-lite-umd/-/iconv-lite-umd-0.7.1.tgz",
      "integrity": "sha512-tK6k0DXFHW7q5+GGuGZO+phpAqpxO4WXl+BLc/8/uOk3RsM2ssAL3CQUQDb1TGfwltjsauhN6S4ghYZzs4sPFw==",
      "license": "MIT"
    },
    "node_modules/@vscode/tree-sitter-wasm": {
      "version": "0.3.0",
      "resolved": "https://registry.npmjs.org/@vscode/tree-sitter-wasm/-/tree-sitter-wasm-0.3.0.tgz",
      "integrity": "sha512-4kjB1jgLyG9VimGfyJb1F8/GFdrx55atsBCH/9r2D/iZHAUDCvZ5zhWXB7sRQ2z2WkkuNYm/0pgQtUm1jhdf7A==",
      "license": "MIT"
    },
    "node_modules/@vscode/vscode-languagedetection": {
      "version": "1.0.21",
      "resolved": "https://registry.npmjs.org/@vscode/vscode-languagedetection/-/vscode-languagedetection-1.0.21.tgz",
      "integrity": "sha512-zSUH9HYCw5qsCtd7b31yqkpaCU6jhtkKLkvOOA8yTrIRfBSOFb8PPhgmMicD7B/m+t4PwOJXzU1XDtrM9Fd3/g==",
      "bin": {
        "vscode-languagedetection": "cli/index.js"
      }
    },
    "node_modules/@xterm/addon-clipboard": {
      "version": "0.2.0-beta.119",
      "resolved": "https://registry.npmjs.org/@xterm/addon-clipboard/-/addon-clipboard-0.2.0-beta.119.tgz",
      "integrity": "sha512-yWmCpGuTvSaIeEfdSijdf8K8qRAYuEGnKkaJZ6er+cOzdmGHBNzyBDKKeyins0aV2j4CGKPDiWHQF5+qGzZDGw==",
      "license": "MIT",
      "dependencies": {
        "js-base64": "^3.7.5"
      },
      "peerDependencies": {
        "@xterm/xterm": "^5.6.0-beta.136"
      }
    },
    "node_modules/@xterm/addon-image": {
      "version": "0.9.0-beta.136",
      "resolved": "https://registry.npmjs.org/@xterm/addon-image/-/addon-image-0.9.0-beta.136.tgz",
      "integrity": "sha512-syWhqpFMAcQ1+US0JjFzj0ORokj8hkz2VgXcCCbTfO0cDtpSYYxMNLaY2fpL459rnOFB4olI9Nf9PZdonmBPDw==",
      "license": "MIT",
      "peerDependencies": {
        "@xterm/xterm": "^5.6.0-beta.136"
      }
    },
    "node_modules/@xterm/addon-ligatures": {
      "version": "0.10.0-beta.136",
      "resolved": "https://registry.npmjs.org/@xterm/addon-ligatures/-/addon-ligatures-0.10.0-beta.136.tgz",
      "integrity": "sha512-WkvL7BVdoqpNf8QsH4n37Pu7jEZTiJ+OD4FmLMVavw0euhgG18zzJKNKIYRuKcddR52dT/Q8TrspVJofpL98GQ==",
      "license": "MIT",
      "dependencies": {
        "font-finder": "^1.1.0",
        "font-ligatures": "^1.4.1"
      },
      "engines": {
        "node": ">8.0.0"
      },
      "peerDependencies": {
        "@xterm/xterm": "^5.6.0-beta.136"
      }
    },
    "node_modules/@xterm/addon-progress": {
      "version": "0.2.0-beta.42",
      "resolved": "https://registry.npmjs.org/@xterm/addon-progress/-/addon-progress-0.2.0-beta.42.tgz",
      "integrity": "sha512-C5w7y6rwSUdRcEiJHFnB2qJI/6DBOi/fJAvTmIpmNZE60cVnrLUuyLmXh6aKbSQ44J6W3PrD5xthb8re3UVUOw==",
      "license": "MIT",
      "peerDependencies": {
        "@xterm/xterm": "^5.6.0-beta.136"
      }
    },
    "node_modules/@xterm/addon-search": {
      "version": "0.16.0-beta.136",
      "resolved": "https://registry.npmjs.org/@xterm/addon-search/-/addon-search-0.16.0-beta.136.tgz",
      "integrity": "sha512-Y2T/ShQBelmOGy7lup3VEfFF/yXeNkkMXqhGftmjzmwSA+eylFW+92vczMSrckTW++EFvVLR/L5jMXiSw0qOWQ==",
      "license": "MIT",
      "peerDependencies": {
        "@xterm/xterm": "^5.6.0-beta.136"
      }
    },
    "node_modules/@xterm/addon-serialize": {
      "version": "0.14.0-beta.136",
      "resolved": "https://registry.npmjs.org/@xterm/addon-serialize/-/addon-serialize-0.14.0-beta.136.tgz",
      "integrity": "sha512-ursvqITzhZrBQT8XsbOyAQJJKohv33NEm6ToLtMZUmPurBG6KXlVZ9LAPs2YpCBqkifLktSE1GdsofJCpADWuA==",
      "license": "MIT",
      "peerDependencies": {
        "@xterm/xterm": "^5.6.0-beta.136"
      }
    },
    "node_modules/@xterm/addon-unicode11": {
      "version": "0.9.0-beta.136",
      "resolved": "https://registry.npmjs.org/@xterm/addon-unicode11/-/addon-unicode11-0.9.0-beta.136.tgz",
      "integrity": "sha512-RwtNbON1uNndrtPCM6qMMElTTpxs7ZLRQVbSm4/BMW6GAt6AbW1RAqwoxMRhbz7VVTux/c3HcKfj3SI1MhqSOw==",
      "license": "MIT",
      "peerDependencies": {
        "@xterm/xterm": "^5.6.0-beta.136"
      }
    },
    "node_modules/@xterm/addon-webgl": {
      "version": "0.19.0-beta.136",
      "resolved": "https://registry.npmjs.org/@xterm/addon-webgl/-/addon-webgl-0.19.0-beta.136.tgz",
      "integrity": "sha512-MzVlFKrlgJjKQ6T4/TuamvlvR2FFDvxAPY90lo9u4899k7NNif+M8bBdNea3+bsPMU3fKLhGHoTp0+8MjskaeA==",
      "license": "MIT",
      "peerDependencies": {
        "@xterm/xterm": "^5.6.0-beta.136"
      }
    },
    "node_modules/@xterm/xterm": {
      "version": "5.6.0-beta.136",
      "resolved": "https://registry.npmjs.org/@xterm/xterm/-/xterm-5.6.0-beta.136.tgz",
      "integrity": "sha512-cOWfdbPUYjV8qJY0yg/HdJBiq/hl8J2NRma563crQbSveDpuiiKV+T+ZVeGKQ2YZztLCz6h+kox6J7LQcPtpiQ==",
      "license": "MIT"
    },
    "node_modules/commander": {
      "version": "8.3.0",
      "resolved": "https://registry.npmjs.org/commander/-/commander-8.3.0.tgz",
      "integrity": "sha512-OkTL9umf+He2DZkUq8f8J9of7yL6RJKI24dVITBmNfZBmri9zYZQrKkuXiKhyfPSu8tUhnVBB1iKXevvnlR4Ww==",
      "license": "MIT",
      "engines": {
        "node": ">= 12"
      }
    },
    "node_modules/font-finder": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/font-finder/-/font-finder-1.1.0.tgz",
      "integrity": "sha512-wpCL2uIbi6GurJbU7ZlQ3nGd61Ho+dSU6U83/xJT5UPFfN35EeCW/rOtS+5k+IuEZu2SYmHzDIPL9eA5tSYRAw==",
      "license": "MIT",
      "dependencies": {
        "get-system-fonts": "^2.0.0",
        "promise-stream-reader": "^1.0.1"
      },
      "engines": {
        "node": ">8.0.0"
      }
    },
    "node_modules/font-ligatures": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/font-ligatures/-/font-ligatures-1.4.1.tgz",
      "integrity": "sha512-7W6zlfyhvCqShZ5ReUWqmSd9vBaUudW0Hxis+tqUjtHhsPU+L3Grf8mcZAtCiXHTzorhwdRTId2WeH/88gdFkw==",
      "license": "MIT",
      "dependencies": {
        "font-finder": "^1.0.3",
        "lru-cache": "^6.0.0",
        "opentype.js": "^0.8.0"
      },
      "engines": {
        "node": ">8.0.0"
      }
    },
    "node_modules/get-system-fonts": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/get-system-fonts/-/get-system-fonts-2.0.2.tgz",
      "integrity": "sha512-zzlgaYnHMIEgHRrfC7x0Qp0Ylhw/sHpM6MHXeVBTYIsvGf5GpbnClB+Q6rAPdn+0gd2oZZIo6Tj3EaWrt4VhDQ==",
      "license": "MIT",
      "engines": {
        "node": ">8.0.0"
      }
    },
    "node_modules/js-base64": {
      "version": "3.7.7",
      "resolved": "https://registry.npmjs.org/js-base64/-/js-base64-3.7.7.tgz",
      "integrity": "sha512-7rCnleh0z2CkXhH67J8K1Ytz0b2Y+yxTPL+/KOJoa20hfnVQ/3/T6W/KflYI4bRHRagNeXeU2bkNGI3v1oS/lw=="
    },
    "node_modules/jschardet": {
      "version": "3.1.4",
      "resolved": "https://registry.npmjs.org/jschardet/-/jschardet-3.1.4.tgz",
      "integrity": "sha512-/kmVISmrwVwtyYU40iQUOp3SUPk2dhNCMsZBQX0R1/jZ8maaXJ/oZIzUOiyOqcgtLnETFKYChbJ5iDC/eWmFHg==",
      "license": "LGPL-2.1+",
      "engines": {
        "node": ">=0.1.90"
      }
    },
    "node_modules/katex": {
      "version": "0.16.22",
      "resolved": "https://registry.npmjs.org/katex/-/katex-0.16.22.tgz",
      "integrity": "sha512-XCHRdUw4lf3SKBaJe4EvgqIuWwkPSo9XoeO8GjQW94Bp7TWv9hNhzZjZ+OH9yf1UmLygb7DIT5GSFQiyt16zYg==",
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
    "node_modules/lru-cache": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-6.0.0.tgz",
      "integrity": "sha512-Jo6dJ04CmSjuznwJSS3pUeWmd/H0ffTlkXXgwZi+eq1UCmqQwCh+eLsYOYCwY991i2Fah4h1BEMCx4qThGbsiA==",
      "license": "ISC",
      "dependencies": {
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/opentype.js": {
      "version": "0.8.0",
      "resolved": "https://registry.npmjs.org/opentype.js/-/opentype.js-0.8.0.tgz",
      "integrity": "sha512-FQHR4oGP+a0m/f6yHoRpBOIbn/5ZWxKd4D/djHVJu8+KpBTYrJda0b7mLcgDEMWXE9xBCJm+qb0yv6FcvPjukg==",
      "license": "MIT",
      "dependencies": {
        "tiny-inflate": "^1.0.2"
      },
      "bin": {
        "ot": "bin/ot"
      }
    },
    "node_modules/promise-stream-reader": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/promise-stream-reader/-/promise-stream-reader-1.0.1.tgz",
      "integrity": "sha512-Tnxit5trUjBAqqZCGWwjyxhmgMN4hGrtpW3Oc/tRI4bpm/O2+ej72BB08l6JBnGQgVDGCLvHFGjGgQS6vzhwXg==",
      "license": "MIT",
      "engines": {
        "node": ">8.0.0"
      }
    },
    "node_modules/tas-client": {
      "version": "0.3.1",
      "resolved": "https://registry.npmjs.org/tas-client/-/tas-client-0.3.1.tgz",
      "integrity": "sha512-Mn4+4t/KXEf8aIENeI1TkzpKIImzmG+FjPZ2dlaoGNFgxJqBE/pp3MT7nc2032EG4aS73E4OEcr2WiNaWW8mdA==",
      "license": "MIT",
      "engines": {
        "node": ">=22"
      }
    },
    "node_modules/tiny-inflate": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/tiny-inflate/-/tiny-inflate-1.0.3.tgz",
      "integrity": "sha512-pkY1fj1cKHb2seWDy0B16HeWyczlJA9/WW3u3c4z/NiWDsO3DOU5D7nhTLE9CF0yXv/QZFY7sEJmj24dK+Rrqw==",
      "license": "MIT"
    },
    "node_modules/vscode-oniguruma": {
      "version": "1.7.0",
      "resolved": "https://registry.npmjs.org/vscode-oniguruma/-/vscode-oniguruma-1.7.0.tgz",
      "integrity": "sha512-L9WMGRfrjOhgHSdOYgCt/yRMsXzLDJSL7BPrOZt73gU0iWO4mpqzqQzOz5srxqTvMBaR0XZTSrVWo4j55Rc6cA=="
    },
    "node_modules/vscode-textmate": {
      "version": "9.3.0",
      "resolved": "https://registry.npmjs.org/vscode-textmate/-/vscode-textmate-9.3.0.tgz",
      "integrity": "sha512-zHiZZOdb9xqj5/X1C4a29sbgT2HngdWxPLSl3PyHRQF+5visI4uNM020OHiLJjsMxUssyk/pGVAg/9LCIobrVg==",
      "license": "MIT"
    },
    "node_modules/yallist": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-4.0.0.tgz",
      "integrity": "sha512-3wdGidZyq5PB084XLES5TpOSRA3wjXAlIWMhum2kRcv/41Sn2emQ0dycQW4uZXLejwKvg6EsvbdlVL+FYEct7A==",
      "license": "ISC"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: remote/web/package.json]---
Location: vscode-main/remote/web/package.json

```json
{
  "name": "vscode-web",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "@microsoft/1ds-core-js": "^3.2.13",
    "@microsoft/1ds-post-js": "^3.2.13",
    "@vscode/iconv-lite-umd": "0.7.1",
    "@vscode/tree-sitter-wasm": "^0.3.0",
    "@vscode/vscode-languagedetection": "1.0.21",
    "@xterm/addon-clipboard": "^0.2.0-beta.119",
    "@xterm/addon-image": "^0.9.0-beta.136",
    "@xterm/addon-ligatures": "^0.10.0-beta.136",
    "@xterm/addon-progress": "^0.2.0-beta.42",
    "@xterm/addon-search": "^0.16.0-beta.136",
    "@xterm/addon-serialize": "^0.14.0-beta.136",
    "@xterm/addon-unicode11": "^0.9.0-beta.136",
    "@xterm/addon-webgl": "^0.19.0-beta.136",
    "@xterm/xterm": "^5.6.0-beta.136",
    "jschardet": "3.1.4",
    "katex": "^0.16.22",
    "tas-client": "0.3.1",
    "vscode-oniguruma": "1.7.0",
    "vscode-textmate": "^9.3.0"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: resources/completions/bash/code]---
Location: vscode-main/resources/completions/bash/code

```text
_@@APPNAME@@()
{
	local cur prev words cword split
	_init_completion -s || return

	_expand || return

	case $prev in
		-d|--diff)
			_filedir
			return
			;;
		-a|--add|--user-data-dir|--extensions-dir)
			_filedir -d
			return
			;;
		-g|--goto)
			compopt -o nospace
			_filedir
			return
			;;
		--locale)
			COMPREPLY=( $( compgen -W 'de en en-US es fr it ja ko ru zh-CN zh-TW bg hu pt-br tr' ) )
			return
			;;
		--install-extension|--uninstall-extension)
			_filedir vsix
			return
			;;
		--log)
			COMPREPLY=( $( compgen -W 'critical error warn info debug trace off' ) )
			return
			;;
		--folder-uri|--disable-extension)
			# argument required but no completions available
			return 0
			;;
		--enable-proposed-api)
			# argument optional but no completions available
			;;
	esac

	$split && return

	if [[ $cur == -* ]]; then
		COMPREPLY=( $( compgen -W '-d --diff --folder-uri -a --add -g
			--goto -n --new-window -r --reuse-window -w --wait --locale=
			--user-data-dir -v --version -h --help --extensions-dir
			--list-extensions --show-versions --install-extension
			--uninstall-extension --enable-proposed-api --verbose --log -s
			--status -p --performance --prof-startup --disable-extensions
			--disable-extension --inspect-extensions --update-extensions
			--inspect-brk-extensions --disable-gpu' -- "$cur") )
		[[ $COMPREPLY == *= ]] && compopt -o nospace
		return
	fi

	_filedir
} &&
complete -F _@@APPNAME@@ @@APPNAME@@
```

--------------------------------------------------------------------------------

---[FILE: resources/completions/zsh/_code]---
Location: vscode-main/resources/completions/zsh/_code

```text
#compdef @@APPNAME@@

local arguments

arguments=(
	'(-d --diff)'{-d,--diff}'[compare two files with each other]:file to compare:_files:file to compare with:_files'
	\*'--folder-uri[open a window with given folder uri(s)]:folder uri: '
	\*{-a,--add}'[add folder(s) to the last active window]:directory:_directories'
	'(-g --goto)'{-g,--goto}'[open a file at the path on the specified line and column position]:file\:line[\:column]:_files -r \:'
	'(-n --new-window -r --reuse-window)'{-n,--new-window}'[force to open a new window]'
	'(-n --new-window -r --reuse-window)'{-r,--reuse-window}'[force to open a file or folder in an already opened window]'
	'(-w --wait)'{-w,--wait}'[wait for the files to be closed before returning]'
	'--locale=[the locale to use (e.g. en-US or zh-TW)]:locale (e.g. en-US or zh-TW):(de en en-US es fr it ja ko ru zh-CN zh-TW bg hu pt-br tr)'
	'--user-data-dir[specify the directory that user data is kept in]:directory:_directories'
	'(- *)'{-v,--version}'[print version]'
	'(- *)'{-h,--help}'[print usage]'
	'--telemetry[show all telemetry events which VS code collects]'
	'--extensions-dir[set the root path for extensions]:root path:_directories'
	'--list-extensions[list the installed extensions]'
	'--category[filters installed extension list by category, when using --list-extensions]'
	'--show-versions[show versions of installed extensions, when using --list-extensions]'
	'--install-extension[install an extension]:id or path:_files -g "*.vsix(-.)"'
	'--uninstall-extension[uninstall an extension]:id or path:_files -g "*.vsix(-.)"'
	'--update-extensions[update the installed extensions]'
	'--enable-proposed-api[enables proposed API features for extensions]::extension id: '
	'--verbose[print verbose output (implies --wait)]'
	'--log[log level to use]:level [info]:(critical error warn info debug trace off)'
	'(-s --status)'{-s,--status}'[print process usage and diagnostics information]'
	'(-p --performance)'{-p,--performance}'[start with the "Developer: Startup Performance" command enabled]'
	'--prof-startup[run CPU profiler during startup]'
	'(--disable-extension --disable-extensions)--disable-extensions[disable all installed extensions]'
	\*'--disable-extension[disable an extension]:extension id: '
	'--inspect-extensions[allow debugging and profiling of extensions]'
	'--inspect-brk-extensions[allow debugging and profiling of extensions with the extension host being paused after start]'
	'--disable-gpu[disable GPU hardware acceleration]'
	'*:file or directory:_files'
)

_arguments -s -S $arguments
```

--------------------------------------------------------------------------------

---[FILE: resources/darwin/bin/code.sh]---
Location: vscode-main/resources/darwin/bin/code.sh

```bash
#!/usr/bin/env bash
#
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

# when run in remote terminal, use the remote cli
if [ -n "$VSCODE_IPC_HOOK_CLI" ]; then
	REMOTE_CLI="$(which -a '@@APPNAME@@' | grep /remote-cli/)"
	if [ -n "$REMOTE_CLI" ]; then
		"$REMOTE_CLI" "$@"
		exit $?
	fi
fi

function app_realpath() {
	SOURCE=$1
	while [ -h "$SOURCE" ]; do
		DIR=$(dirname "$SOURCE")
		SOURCE=$(readlink "$SOURCE")
		[[ $SOURCE != /* ]] && SOURCE=$DIR/$SOURCE
	done
	SOURCE_DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"
	echo "${SOURCE_DIR%%${SOURCE_DIR#*.app}}"
}

APP_PATH="$(app_realpath "${BASH_SOURCE[0]}")"
if [ -z "$APP_PATH" ]; then
	echo "Unable to determine app path from symlink : ${BASH_SOURCE[0]}"
	exit 1
fi
CONTENTS="$APP_PATH/Contents"
ELECTRON="$CONTENTS/MacOS/Electron"
CLI="$CONTENTS/Resources/app/out/cli.js"
export VSCODE_NODE_OPTIONS=$NODE_OPTIONS
export VSCODE_NODE_REPL_EXTERNAL_MODULE=$NODE_REPL_EXTERNAL_MODULE
unset NODE_OPTIONS
unset NODE_REPL_EXTERNAL_MODULE
ELECTRON_RUN_AS_NODE=1 "$ELECTRON" "$CLI" "$@"
exit $?
```

--------------------------------------------------------------------------------

---[FILE: resources/linux/code-url-handler.desktop]---
Location: vscode-main/resources/linux/code-url-handler.desktop

```text
[Desktop Entry]
Name=@@NAME_LONG@@ - URL Handler
Comment=Code Editing. Redefined.
GenericName=Text Editor
Exec=@@EXEC@@ --open-url %U
Icon=@@ICON@@
Type=Application
NoDisplay=true
StartupNotify=true
Categories=Utility;TextEditor;Development;IDE;
MimeType=x-scheme-handler/@@URLPROTOCOL@@;
Keywords=vscode;
```

--------------------------------------------------------------------------------

---[FILE: resources/linux/code-workspace.xml]---
Location: vscode-main/resources/linux/code-workspace.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<mime-info xmlns="http://www.freedesktop.org/standards/shared-mime-info">
	<mime-type type="application/x-@@NAME@@-workspace">
		<comment>@@NAME_LONG@@ Workspace</comment>
		<glob pattern="*.code-workspace"/>
	</mime-type>
</mime-info>
```

--------------------------------------------------------------------------------

---[FILE: resources/linux/code.appdata.xml]---
Location: vscode-main/resources/linux/code.appdata.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<component type="desktop">
	<id>@@NAME@@.desktop</id>
	<metadata_license>@@LICENSE@@</metadata_license>
	<project_license>@@LICENSE@@</project_license>
	<name>@@NAME_LONG@@</name>
	<url type="homepage">https://code.visualstudio.com</url>
	<summary>Visual Studio Code. Code editing. Redefined.</summary>
	<description>
		<p>Visual Studio Code is a new choice of tool that combines the simplicity of a code editor with what developers need for the core edit-build-debug cycle. See https://code.visualstudio.com/docs/setup/linux for installation instructions and FAQ.</p>
	</description>
	<screenshots>
		<screenshot type="default">
			<image>https://code.visualstudio.com/home/home-screenshot-linux-lg.png</image>
			<caption>Editing TypeScript and searching for extensions</caption>
		</screenshot>
	</screenshots>
</component>
```

--------------------------------------------------------------------------------

---[FILE: resources/linux/code.desktop]---
Location: vscode-main/resources/linux/code.desktop

```text
[Desktop Entry]
Name=@@NAME_LONG@@
Comment=Code Editing. Redefined.
GenericName=Text Editor
Exec=@@EXEC@@ %F
Icon=@@ICON@@
Type=Application
StartupNotify=false
StartupWMClass=@@NAME_SHORT@@
Categories=TextEditor;Development;IDE;
MimeType=application/x-@@NAME@@-workspace;
Actions=new-empty-window;
Keywords=vscode;

[Desktop Action new-empty-window]
Name=New Empty Window
Name[cs]=Nové prázdné okno
Name[de]=Neues leeres Fenster
Name[es]=Nueva ventana vacía
Name[fr]=Nouvelle fenêtre vide
Name[it]=Nuova finestra vuota
Name[ja]=新しい空のウィンドウ
Name[ko]=새 빈 창
Name[ru]=Новое пустое окно
Name[zh_CN]=新建空窗口
Name[zh_TW]=開新空視窗
Exec=@@EXEC@@ --new-window %F
Icon=@@ICON@@
```

--------------------------------------------------------------------------------

---[FILE: resources/linux/bin/code.sh]---
Location: vscode-main/resources/linux/bin/code.sh

```bash
#!/usr/bin/env sh
#
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

# when run in remote terminal, use the remote cli
if [ -n "$VSCODE_IPC_HOOK_CLI" ]; then
	REMOTE_CLI="$(which -a '@@APPNAME@@' | grep /remote-cli/)"
	if [ -n "$REMOTE_CLI" ]; then
		"$REMOTE_CLI" "$@"
		exit $?
	fi
fi

# test that VSCode wasn't installed inside WSL
if grep -qi Microsoft /proc/version && [ -z "$DONT_PROMPT_WSL_INSTALL" ]; then
	echo "To use @@PRODNAME@@ with the Windows Subsystem for Linux, please install @@PRODNAME@@ in Windows and uninstall the Linux version in WSL. You can then use the \`@@APPNAME@@\` command in a WSL terminal just as you would in a normal command prompt." 1>&2
	printf "Do you want to continue anyway? [y/N] " 1>&2
	read -r YN
	YN=$(printf '%s' "$YN" | tr '[:upper:]' '[:lower:]')
	case "$YN" in
		y | yes )
		;;
		* )
			exit 1
		;;
	esac
	echo "To no longer see this prompt, start @@PRODNAME@@ with the environment variable DONT_PROMPT_WSL_INSTALL defined." 1>&2
fi

# If root, ensure that --user-data-dir or --file-write is specified
if [ "$(id -u)" = "0" ]; then
	for i in "$@"
	do
		case "$i" in
			--user-data-dir | --user-data-dir=* | --file-write | tunnel | serve-web )
				CAN_LAUNCH_AS_ROOT=1
			;;
		esac
	done
	if [ -z $CAN_LAUNCH_AS_ROOT ]; then
		echo "You are trying to start @@PRODNAME@@ as a super user which isn't recommended. If this was intended, please add the argument \`--no-sandbox\` and specify an alternate user data directory using the \`--user-data-dir\` argument." 1>&2
		exit 1
	fi
fi

if [ ! -L "$0" ]; then
	# if path is not a symlink, find relatively
	VSCODE_PATH="$(dirname "$0")/.."
else
	if command -v readlink >/dev/null; then
		# if readlink exists, follow the symlink and find relatively
		VSCODE_PATH="$(dirname "$(readlink -f "$0")")/.."
	else
		# else use the standard install location
		VSCODE_PATH="/usr/share/@@APPNAME@@"
	fi
fi

ELECTRON="$VSCODE_PATH/@@APPNAME@@"
CLI="$VSCODE_PATH/resources/app/out/cli.js"
ELECTRON_RUN_AS_NODE=1 "$ELECTRON" "$CLI" "$@"
exit $?
```

--------------------------------------------------------------------------------

---[FILE: resources/linux/debian/control.template]---
Location: vscode-main/resources/linux/debian/control.template

```text
Package: @@NAME@@
Version: @@VERSION@@
Section: devel
Depends: @@DEPENDS@@
Recommends: @@RECOMMENDS@@
Priority: optional
Architecture: @@ARCHITECTURE@@
Maintainer: Microsoft Corporation <vscode-linux@microsoft.com>
Homepage: https://code.visualstudio.com/
Installed-Size: @@INSTALLEDSIZE@@
Provides: visual-studio-@@NAME@@
Conflicts: visual-studio-@@NAME@@
Replaces: visual-studio-@@NAME@@
Description: Code editing. Redefined.
 Visual Studio Code is a new choice of tool that combines the simplicity of
 a code editor with what developers need for the core edit-build-debug cycle.
 See https://code.visualstudio.com/docs/setup/linux for installation
 instructions and FAQ.
```

--------------------------------------------------------------------------------

---[FILE: resources/linux/debian/postinst.template]---
Location: vscode-main/resources/linux/debian/postinst.template

```text
#!/usr/bin/env bash
#
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

# Symlink bin command to /usr/bin
rm -f /usr/bin/@@NAME@@
ln -s /usr/share/@@NAME@@/bin/@@NAME@@ /usr/bin/@@NAME@@

# Register code in the alternatives system
# Priority of 0 should never make code the default editor in auto mode as most
# developers would prefer a terminal editor as the default.
update-alternatives --install /usr/bin/editor editor /usr/bin/@@NAME@@ 0

# Install the desktop entry
if hash update-desktop-database 2>/dev/null; then
	update-desktop-database
fi

# Update mimetype database to pickup workspace mimetype
if hash update-mime-database 2>/dev/null; then
	update-mime-database /usr/share/mime
fi

if [ "@@NAME@@" != "code-oss" ]; then
	# Remove the legacy bin command if this is the stable build
	if [ "@@NAME@@" = "code" ]; then
		rm -f /usr/local/bin/code
	fi

	# Register apt repository
	eval $(apt-config shell APT_SOURCE_PARTS Dir::Etc::sourceparts/d)
	CODE_SOURCE_PART=${APT_SOURCE_PARTS}vscode.list
	CODE_SOURCE_PART_DEB822=${APT_SOURCE_PARTS}vscode.sources

	CODE_TRUSTED_PART=/usr/share/keyrings/microsoft.gpg
	CODE_TRUSTED_PART_OLD="/etc/apt/trusted.gpg.d/microsoft.gpg"

	# RET seems to be true by default even after db_get is called on a first install.
	RET='true'
	if [ -e '/usr/share/debconf/confmodule' ]; then
		. /usr/share/debconf/confmodule
		db_get @@NAME@@/add-microsoft-repo || true
	fi

	# Determine whether to write the Microsoft repository source list
	WRITE_SOURCE='no'
	if [ "$RET" = 'false' ]; then
		# The user specified in debconf not to add the Microsoft repository
		WRITE_SOURCE='no'
	elif [ -f "$CODE_SOURCE_PART" ]; then
		# The user is not on the new DEB822 format
		WRITE_SOURCE='yes'
	elif [ -f "$CODE_SOURCE_PART_DEB822" ]; then
		# The user is on the new DEB822 format, but refresh the file contents
		WRITE_SOURCE='yes'
	elif [ -f /etc/rpi-issue ]; then
		# Do not write on Raspberry Pi OS
		# https://github.com/microsoft/vscode/issues/118825
		WRITE_SOURCE='no'
	else
		WRITE_SOURCE='ask'
	fi

	if [ "$WRITE_SOURCE" = 'ask' ]; then
		if ! [ -t 1 ]; then
			# By default, write sources in a non-interactive terminal
			# to match old behavior.
			WRITE_SOURCE='yes'
		elif [ -e '/usr/share/debconf/confmodule' ]; then
			# Ask the user whether to actually write the source list
			db_input high @@NAME@@/add-microsoft-repo || true
			db_go || true

			db_get @@NAME@@/add-microsoft-repo
			if [ "$RET" = false ]; then
				WRITE_SOURCE='no'
			else
				WRITE_SOURCE='yes'
			fi
		else
			# The terminal is interactive but there is no debconf.
			# Write sources to match old behavior.
			WRITE_SOURCE='yes'
		fi
	fi

	if [ "$WRITE_SOURCE" != 'no' ]; then
		# Write repository in deb822 format with Signed-By.
		echo "### THIS FILE IS AUTOMATICALLY CONFIGURED ###
# You may comment out this entry, but any other modifications may be lost." > "$CODE_SOURCE_PART_DEB822"
		cat <<EOF >> "$CODE_SOURCE_PART_DEB822"
Types: deb
URIs: https://packages.microsoft.com/repos/code
Suites: stable
Components: main
Architectures: @@ARCHITECTURE@@
Signed-By: $CODE_TRUSTED_PART
EOF
		if [ -f "$CODE_SOURCE_PART" ]; then
			rm -f "$CODE_SOURCE_PART"
		fi

		# Sourced from https://packages.microsoft.com/keys/microsoft.asc
		if [ ! -f $CODE_TRUSTED_PART ]; then
			echo "-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: BSN Pgp v1.1.0.0

mQENBFYxWIwBCADAKoZhZlJxGNGWzqV+1OG1xiQeoowKhssGAKvd+buXCGISZJwT
LXZqIcIiLP7pqdcZWtE9bSc7yBY2MalDp9Liu0KekywQ6VVX1T72NPf5Ev6x6DLV
7aVWsCzUAF+eb7DC9fPuFLEdxmOEYoPjzrQ7cCnSV4JQxAqhU4T6OjbvRazGl3ag
OeizPXmRljMtUUttHQZnRhtlzkmwIrUivbfFPD+fEoHJ1+uIdfOzZX8/oKHKLe2j
H632kvsNzJFlROVvGLYAk2WRcLu+RjjggixhwiB+Mu/A8Tf4V6b+YppS44q8EvVr
M+QvY7LNSOffSO6Slsy9oisGTdfE39nC7pVRABEBAAG0N01pY3Jvc29mdCAoUmVs
ZWFzZSBzaWduaW5nKSA8Z3Bnc2VjdXJpdHlAbWljcm9zb2Z0LmNvbT6JATQEEwEI
AB4FAlYxWIwCGwMGCwkIBwMCAxUIAwMWAgECHgECF4AACgkQ6z6Urb4SKc+P9gf/
diY2900wvWEgV7iMgrtGzx79W/PbwWiOkKoD9sdzhARXWiP8Q5teL/t5TUH6TZ3B
ENboDjwr705jLLPwuEDtPI9jz4kvdT86JwwG6N8gnWM8Ldi56SdJEtXrzwtlB/Fe
6tyfMT1E/PrJfgALUG9MWTIJkc0GhRJoyPpGZ6YWSLGXnk4c0HltYKDFR7q4wtI8
4cBu4mjZHZbxIO6r8Cci+xxuJkpOTIpr4pdpQKpECM6x5SaT2gVnscbN0PE19KK9
nPsBxyK4wW0AvAhed2qldBPTipgzPhqB2gu0jSryil95bKrSmlYJd1Y1XfNHno5D
xfn5JwgySBIdWWvtOI05gw==
=zPfd
-----END PGP PUBLIC KEY BLOCK-----
" | gpg --dearmor > $CODE_TRUSTED_PART
			if [ -f "$CODE_TRUSTED_PART_OLD" ]; then
				rm -f "$CODE_TRUSTED_PART_OLD"
			fi
		fi
	fi
fi
```

--------------------------------------------------------------------------------

---[FILE: resources/linux/debian/postrm.template]---
Location: vscode-main/resources/linux/debian/postrm.template

```text
#!/bin/bash
#
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

rm -f /usr/bin/@@NAME@@

# Uninstall the desktop entry
if hash update-desktop-database 2>/dev/null; then
	update-desktop-database
fi

# Update mimetype database for removed workspace mimetype
if hash update-mime-database 2>/dev/null; then
	update-mime-database /usr/share/mime
fi

RET=true
if [ -e '/usr/share/debconf/confmodule' ]; then
	. /usr/share/debconf/confmodule
	db_get @@NAME@@/add-microsoft-repo || true
fi
if [ "$RET" = "true" ]; then
	eval $(apt-config shell APT_SOURCE_PARTS Dir::Etc::sourceparts/d)
	CODE_SOURCE_PART=${APT_SOURCE_PARTS}vscode.sources
	rm -f $CODE_SOURCE_PART

	CODE_TRUSTED_PART=/usr/share/keyrings/microsoft.gpg
	rm -f $CODE_TRUSTED_PART
fi

if [ "$1" = "purge" ] && [ -e '/usr/share/debconf/confmodule' ]; then
	db_purge
fi
```

--------------------------------------------------------------------------------

---[FILE: resources/linux/debian/prerm.template]---
Location: vscode-main/resources/linux/debian/prerm.template

```text
#!/usr/bin/env bash
#
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

# Deregister code from the alternatives system
update-alternatives --remove editor /usr/bin/@@NAME@@
```

--------------------------------------------------------------------------------

---[FILE: resources/linux/debian/templates.template]---
Location: vscode-main/resources/linux/debian/templates.template

```text
Template: @@NAME@@/add-microsoft-repo
Type: boolean
Default: true
Description: Add Microsoft apt repository for Visual Studio Code?
 The installer would like to add the Microsoft repository and signing
 key to update VS Code through apt.
```

--------------------------------------------------------------------------------

---[FILE: resources/linux/rpm/code.spec.template]---
Location: vscode-main/resources/linux/rpm/code.spec.template

```text
Name:     @@NAME@@
Version:  @@VERSION@@
Release:  @@RELEASE@@.el8
Summary:  Code editing. Redefined.
Group:    Development/Tools
Vendor:   Microsoft Corporation
Packager: Visual Studio Code Team <vscode-linux@microsoft.com>
License:  @@LICENSE@@
URL:      https://code.visualstudio.com/
Icon:     @@NAME@@.xpm
Requires: @@DEPENDENCIES@@
AutoReq:  0

%global __provides_exclude_from ^%{_datadir}/%{name}/.*\\.so.*$
# Disable elf stripping, refer https://github.com/microsoft/vscode/issues/223455#issuecomment-2610001754
%global __brp_strip %{nil}
%global __brp_strip_comment_note %{nil}

%description
Visual Studio Code is a new choice of tool that combines the simplicity of a code editor with what developers need for the core edit-build-debug cycle. See https://code.visualstudio.com/docs/setup/linux for installation instructions and FAQ.

# Don't generate build_id links to prevent conflicts when installing multiple
# versions of VS Code alongside each other (e.g. `code` and `code-insiders`)
%define _build_id_links none
%define __strip @@STRIP@@

%install
# Destination directories
mkdir -p %{buildroot}%{_bindir}
mkdir -p %{buildroot}%{_datadir}/%{name}
mkdir -p %{buildroot}%{_datadir}/applications
mkdir -p %{buildroot}%{_datadir}/appdata
mkdir -p %{buildroot}%{_datadir}/mime/packages
mkdir -p %{buildroot}%{_datadir}/pixmaps
mkdir -p %{buildroot}%{_datadir}/bash-completion/completions
mkdir -p %{buildroot}%{_datadir}/zsh/site-functions
# Application
cp -r usr/share/%{name}/* %{buildroot}%{_datadir}/%{name}
ln -s %{_datadir}/%{name}/bin/%{name} %{buildroot}%{_bindir}/%{name}
# Support files
cp -r usr/share/applications/%{name}.desktop %{buildroot}%{_datadir}/applications
cp -r usr/share/applications/%{name}-url-handler.desktop %{buildroot}%{_datadir}/applications
cp -r usr/share/appdata/%{name}.appdata.xml %{buildroot}%{_datadir}/appdata
cp -r usr/share/mime/packages/%{name}-workspace.xml %{buildroot}%{_datadir}/mime/packages/%{name}-workspace.xml
cp -r usr/share/pixmaps/@@ICON@@.png %{buildroot}%{_datadir}/pixmaps
# Shell completions
cp usr/share/bash-completion/completions/%{name} %{buildroot}%{_datadir}/bash-completion/completions/%{name}
cp usr/share/zsh/site-functions/_%{name} %{buildroot}%{_datadir}/zsh/site-functions/_%{name}

%post
# Remove the legacy bin command if this is the stable build
if [ "%{name}" = "code" ]; then
	rm -f /usr/local/bin/code
fi

# Register yum repository
# TODO: #229: Enable once the yum repository is signed
#if [ "@@NAME@@" != "code-oss" ]; then
#	if [ -d "/etc/yum.repos.d" ]; then
#		REPO_FILE=/etc/yum.repos.d/@@NAME@@.repo
#		rm -f $REPO_FILE
#		echo -e "[@@NAME@@]\nname=@@NAME_LONG@@\nbaseurl=@@UPDATEURL@@/api/rpm/@@QUALITY@@/@@ARCHITECTURE@@/rpm" > $REPO_FILE
#	fi
#fi

# Install the desktop entry
update-desktop-database &> /dev/null || :

# Update mimetype database to pickup workspace mimetype
update-mime-database %{_datadir}/mime &> /dev/null || :

%postun
# Uninstall the desktop entry
update-desktop-database &> /dev/null || :

# Update mimetype database for removed workspace mimetype
update-mime-database %{_datadir}/mime &> /dev/null || :

%files
%defattr(-,root,root)
%attr(4755, root, root) %{_datadir}/%{name}/chrome-sandbox

%{_bindir}/%{name}
%{_datadir}/%{name}/
%{_datadir}/applications/%{name}.desktop
%{_datadir}/applications/%{name}-url-handler.desktop
%{_datadir}/appdata/%{name}.appdata.xml
%{_datadir}/mime/packages/%{name}-workspace.xml
%{_datadir}/pixmaps/@@ICON@@.png
%{_datadir}/bash-completion/completions/%{name}
%{_datadir}/zsh/site-functions/_%{name}
```

--------------------------------------------------------------------------------

````
