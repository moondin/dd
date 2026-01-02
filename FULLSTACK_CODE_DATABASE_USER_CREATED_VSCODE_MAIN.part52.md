---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 52
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 52 of 552)

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

---[FILE: extensions/javascript/syntaxes/Readme.md]---
Location: vscode-main/extensions/javascript/syntaxes/Readme.md

```markdown
The file `JavaScript.tmLanguage.json` is derived from [TypeScriptReact.tmLanguage](https://github.com/microsoft/TypeScript-TmLanguage/blob/master/TypeScriptReact.tmLanguage).

To update to the latest version:

- `cd extensions/typescript-basics` and run `npm run update-grammars`
- don't forget to run the integration tests at `./scripts/test-integration.sh`

The script does the following changes:

- fileTypes .tsx -> .js & .jsx
- scopeName scope.tsx -> scope.js
- update all rule names .tsx -> .js
```

--------------------------------------------------------------------------------

---[FILE: extensions/javascript/syntaxes/Regular Expressions (JavaScript).tmLanguage]---
Location: vscode-main/extensions/javascript/syntaxes/Regular Expressions (JavaScript).tmLanguage

```text
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>fileTypes</key>
	<array/>
	<key>hideFromUser</key>
	<true/>
	<key>name</key>
	<string>Regular Expressions (JavaScript)</string>
	<key>patterns</key>
	<array>
		<dict>
			<key>include</key>
			<string>#regexp</string>
		</dict>
	</array>
	<key>repository</key>
	<dict>
		<key>regex-character-class</key>
		<dict>
			<key>patterns</key>
			<array>
				<dict>
					<key>match</key>
					<string>\\[wWsSdD]|\.</string>
					<key>name</key>
					<string>constant.character.character-class.regexp</string>
				</dict>
				<dict>
					<key>match</key>
					<string>\\([0-7]{3}|x\h\h|u\h\h\h\h)</string>
					<key>name</key>
					<string>constant.character.numeric.regexp</string>
				</dict>
				<dict>
					<key>match</key>
					<string>\\c[A-Z]</string>
					<key>name</key>
					<string>constant.character.control.regexp</string>
				</dict>
				<dict>
					<key>match</key>
					<string>\\.</string>
					<key>name</key>
					<string>constant.character.escape.backslash.regexp</string>
				</dict>
			</array>
		</dict>
		<key>regexp</key>
		<dict>
			<key>patterns</key>
			<array>
				<dict>
					<key>match</key>
					<string>\\[bB]|\^|\$</string>
					<key>name</key>
					<string>keyword.control.anchor.regexp</string>
				</dict>
				<dict>
					<key>match</key>
					<string>\\[1-9]\d*</string>
					<key>name</key>
					<string>keyword.other.back-reference.regexp</string>
				</dict>
				<dict>
					<key>match</key>
					<string>[?+*]|\{(\d+,\d+|\d+,|,\d+|\d+)\}\??</string>
					<key>name</key>
					<string>keyword.operator.quantifier.regexp</string>
				</dict>
				<dict>
					<key>match</key>
					<string>\|</string>
					<key>name</key>
					<string>keyword.operator.or.regexp</string>
				</dict>
				<dict>
					<key>begin</key>
					<string>(\()((\?=)|(\?!))</string>
					<key>beginCaptures</key>
					<dict>
						<key>1</key>
						<dict>
							<key>name</key>
							<string>punctuation.definition.group.regexp</string>
						</dict>
						<key>3</key>
						<dict>
							<key>name</key>
							<string>meta.assertion.look-ahead.regexp</string>
						</dict>
						<key>4</key>
						<dict>
							<key>name</key>
							<string>meta.assertion.negative-look-ahead.regexp</string>
						</dict>
					</dict>
					<key>end</key>
					<string>(\))</string>
					<key>endCaptures</key>
					<dict>
						<key>1</key>
						<dict>
							<key>name</key>
							<string>punctuation.definition.group.regexp</string>
						</dict>
					</dict>
					<key>name</key>
					<string>meta.group.assertion.regexp</string>
					<key>patterns</key>
					<array>
						<dict>
							<key>include</key>
							<string>#regexp</string>
						</dict>
					</array>
				</dict>
				<dict>
					<key>begin</key>
					<string>\((\?:)?</string>
					<key>beginCaptures</key>
					<dict>
						<key>0</key>
						<dict>
							<key>name</key>
							<string>punctuation.definition.group.regexp</string>
						</dict>
					</dict>
					<key>end</key>
					<string>\)</string>
					<key>endCaptures</key>
					<dict>
						<key>0</key>
						<dict>
							<key>name</key>
							<string>punctuation.definition.group.regexp</string>
						</dict>
					</dict>
					<key>name</key>
					<string>meta.group.regexp</string>
					<key>patterns</key>
					<array>
						<dict>
							<key>include</key>
							<string>#regexp</string>
						</dict>
					</array>
				</dict>
				<dict>
					<key>begin</key>
					<string>(\[)(\^)?</string>
					<key>beginCaptures</key>
					<dict>
						<key>1</key>
						<dict>
							<key>name</key>
							<string>punctuation.definition.character-class.regexp</string>
						</dict>
						<key>2</key>
						<dict>
							<key>name</key>
							<string>keyword.operator.negation.regexp</string>
						</dict>
					</dict>
					<key>end</key>
					<string>(\])</string>
					<key>endCaptures</key>
					<dict>
						<key>1</key>
						<dict>
							<key>name</key>
							<string>punctuation.definition.character-class.regexp</string>
						</dict>
					</dict>
					<key>name</key>
					<string>constant.other.character-class.set.regexp</string>
					<key>patterns</key>
					<array>
						<dict>
							<key>captures</key>
							<dict>
								<key>1</key>
								<dict>
									<key>name</key>
									<string>constant.character.numeric.regexp</string>
								</dict>
								<key>2</key>
								<dict>
									<key>name</key>
									<string>constant.character.control.regexp</string>
								</dict>
								<key>3</key>
								<dict>
									<key>name</key>
									<string>constant.character.escape.backslash.regexp</string>
								</dict>
								<key>4</key>
								<dict>
									<key>name</key>
									<string>constant.character.numeric.regexp</string>
								</dict>
								<key>5</key>
								<dict>
									<key>name</key>
									<string>constant.character.control.regexp</string>
								</dict>
								<key>6</key>
								<dict>
									<key>name</key>
									<string>constant.character.escape.backslash.regexp</string>
								</dict>
							</dict>
							<key>match</key>
							<string>(?:.|(\\(?:[0-7]{3}|x\h\h|u\h\h\h\h))|(\\c[A-Z])|(\\.))\-(?:[^\]\\]|(\\(?:[0-7]{3}|x\h\h|u\h\h\h\h))|(\\c[A-Z])|(\\.))</string>
							<key>name</key>
							<string>constant.other.character-class.range.regexp</string>
						</dict>
						<dict>
							<key>include</key>
							<string>#regex-character-class</string>
						</dict>
					</array>
				</dict>
				<dict>
					<key>include</key>
					<string>#regex-character-class</string>
				</dict>
			</array>
		</dict>
	</dict>
	<key>scopeName</key>
	<string>source.js.regexp</string>
	<key>uuid</key>
	<string>AC8679DE-3AC7-4056-84F9-69A7ADC29DDD</string>
</dict>
</plist>
```

--------------------------------------------------------------------------------

---[FILE: extensions/json/.vscodeignore]---
Location: vscode-main/extensions/json/.vscodeignore

```text
build/**
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/json/cgmanifest.json]---
Location: vscode-main/extensions/json/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "microsoft/vscode-JSON.tmLanguage",
					"repositoryUrl": "https://github.com/microsoft/vscode-JSON.tmLanguage",
					"commitHash": "9bd83f1c252b375e957203f21793316203f61f70"
				}
			},
			"license": "MIT",
			"version": "0.0.0"
		},
		{
			"component": {
				"type": "git",
				"git": {
					"name": "jeff-hykin/better-snippet-syntax",
					"repositoryUrl": "https://github.com/jeff-hykin/better-snippet-syntax",
					"commitHash": "2b1bb124cb2b9c75c3c80eae1b8f3a043841d654"
				}
			},
			"license": "MIT",
			"version": "1.0.2"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json/language-configuration.json]---
Location: vscode-main/extensions/json/language-configuration.json

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
				"string"
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
			"open": "`",
			"close": "`",
			"notIn": [
				"string",
				"comment"
			]
		}
	],
	"indentationRules": {
		"increaseIndentPattern": "({+(?=((\\\\.|[^\"\\\\])*\"(\\\\.|[^\"\\\\])*\")*[^\"}]*)$)|(\\[+(?=((\\\\.|[^\"\\\\])*\"(\\\\.|[^\"\\\\])*\")*[^\"\\]]*)$)",
		"decreaseIndentPattern": "^\\s*[}\\]],?\\s*$"
	},
	"onEnterRules": [
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

---[FILE: extensions/json/package.json]---
Location: vscode-main/extensions/json/package.json

```json
{
  "name": "json",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "0.10.x"
  },
  "scripts": {
    "update-grammar": "node ./build/update-grammars.js"
  },
  "categories": [
    "Programming Languages"
  ],
  "contributes": {
    "languages": [
      {
        "id": "json",
        "aliases": [
          "JSON",
          "json"
        ],
        "extensions": [
          ".json",
          ".bowerrc",
          ".jscsrc",
          ".webmanifest",
          ".js.map",
          ".css.map",
          ".ts.map",
          ".har",
          ".jslintrc",
          ".jsonld",
          ".geojson",
          ".ipynb",
          ".vuerc"
        ],
        "filenames": [
          "composer.lock",
          ".watchmanconfig"
        ],
        "mimetypes": [
          "application/json",
          "application/manifest+json"
        ],
        "configuration": "./language-configuration.json"
      },
      {
        "id": "jsonc",
        "aliases": [
          "JSON with Comments"
        ],
        "extensions": [
          ".jsonc",
          ".eslintrc",
          ".eslintrc.json",
          ".jsfmtrc",
          ".jshintrc",
          ".swcrc",
          ".hintrc",
          ".babelrc",
          ".toolset.jsonc"
        ],
        "filenames": [
          "babel.config.json",
          "bun.lock",
          ".babelrc.json",
          ".ember-cli",
          "typedoc.json"
        ],
        "configuration": "./language-configuration.json"
      },
      {
        "id": "jsonl",
        "aliases": [
          "JSON Lines"
        ],
        "extensions": [
          ".jsonl",
          ".ndjson"
        ],
        "filenames": [],
        "configuration": "./language-configuration.json"
      },
      {
        "id": "snippets",
        "aliases": [
          "Code Snippets"
        ],
        "extensions": [
          ".code-snippets"
        ],
        "filenamePatterns": [
          "**/User/snippets/*.json",
          "**/User/profiles/*/snippets/*.json",
          "**/snippets*.json"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "json",
        "scopeName": "source.json",
        "path": "./syntaxes/JSON.tmLanguage.json"
      },
      {
        "language": "jsonc",
        "scopeName": "source.json.comments",
        "path": "./syntaxes/JSONC.tmLanguage.json"
      },
      {
        "language": "jsonl",
        "scopeName": "source.json.lines",
        "path": "./syntaxes/JSONL.tmLanguage.json"
      },
      {
        "language": "snippets",
        "scopeName": "source.json.comments.snippets",
        "path": "./syntaxes/snippets.tmLanguage.json"
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

---[FILE: extensions/json/package.nls.json]---
Location: vscode-main/extensions/json/package.nls.json

```json
{
	"displayName": "JSON Language Basics",
	"description": "Provides syntax highlighting & bracket matching in JSON files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json/build/update-grammars.js]---
Location: vscode-main/extensions/json/build/update-grammars.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

var updateGrammar = require('vscode-grammar-updater');

function adaptJSON(grammar, name, replacementScope, replaceeScope = 'json') {
	grammar.name = name;
	grammar.scopeName = `source${replacementScope}`;
	const regex = new RegExp(`\.${replaceeScope}`, 'g');
	var fixScopeNames = function (rule) {
		if (typeof rule.name === 'string') {
			rule.name = rule.name.replace(regex, replacementScope);
		}
		if (typeof rule.contentName === 'string') {
			rule.contentName = rule.contentName.replace(regex, replacementScope);
		}
		for (var property in rule) {
			var value = rule[property];
			if (typeof value === 'object') {
				fixScopeNames(value);
			}
		}
	};

	var repository = grammar.repository;
	for (var key in repository) {
		fixScopeNames(repository[key]);
	}
}

var tsGrammarRepo = 'microsoft/vscode-JSON.tmLanguage';
updateGrammar.update(tsGrammarRepo, 'JSON.tmLanguage', './syntaxes/JSON.tmLanguage.json');
updateGrammar.update(tsGrammarRepo, 'JSON.tmLanguage', './syntaxes/JSONC.tmLanguage.json', grammar => adaptJSON(grammar, 'JSON with Comments', '.json.comments'));
updateGrammar.update(tsGrammarRepo, 'JSON.tmLanguage', './syntaxes/JSONL.tmLanguage.json', grammar => adaptJSON(grammar, 'JSON Lines', '.json.lines'));

updateGrammar.update('jeff-hykin/better-snippet-syntax', 'autogenerated/jsonc.tmLanguage.json', './syntaxes/snippets.tmLanguage.json', grammar => adaptJSON(grammar, 'Snippets', '.json.comments.snippets', 'json.comments'));
```

--------------------------------------------------------------------------------

---[FILE: extensions/json/syntaxes/JSON.tmLanguage.json]---
Location: vscode-main/extensions/json/syntaxes/JSON.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/microsoft/vscode-JSON.tmLanguage/blob/master/JSON.tmLanguage",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/microsoft/vscode-JSON.tmLanguage/commit/9bd83f1c252b375e957203f21793316203f61f70",
	"name": "JSON (Javascript Next)",
	"scopeName": "source.json",
	"patterns": [
		{
			"include": "#value"
		}
	],
	"repository": {
		"array": {
			"begin": "\\[",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.array.begin.json"
				}
			},
			"end": "\\]",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.array.end.json"
				}
			},
			"name": "meta.structure.array.json",
			"patterns": [
				{
					"include": "#value"
				},
				{
					"match": ",",
					"name": "punctuation.separator.array.json"
				},
				{
					"match": "[^\\s\\]]",
					"name": "invalid.illegal.expected-array-separator.json"
				}
			]
		},
		"comments": {
			"patterns": [
				{
					"begin": "/\\*\\*(?!/)",
					"captures": {
						"0": {
							"name": "punctuation.definition.comment.json"
						}
					},
					"end": "\\*/",
					"name": "comment.block.documentation.json"
				},
				{
					"begin": "/\\*",
					"captures": {
						"0": {
							"name": "punctuation.definition.comment.json"
						}
					},
					"end": "\\*/",
					"name": "comment.block.json"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.comment.json"
						}
					},
					"match": "(//).*$\\n?",
					"name": "comment.line.double-slash.js"
				}
			]
		},
		"constant": {
			"match": "\\b(?:true|false|null)\\b",
			"name": "constant.language.json"
		},
		"number": {
			"match": "(?x)        # turn on extended mode\n  -?        # an optional minus\n  (?:\n    0       # a zero\n    |       # ...or...\n    [1-9]   # a 1-9 character\n    \\d*     # followed by zero or more digits\n  )\n  (?:\n    (?:\n      \\.    # a period\n      \\d+   # followed by one or more digits\n    )?\n    (?:\n      [eE]  # an e character\n      [+-]? # followed by an option +/-\n      \\d+   # followed by one or more digits\n    )?      # make exponent optional\n  )?        # make decimal portion optional",
			"name": "constant.numeric.json"
		},
		"object": {
			"begin": "\\{",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.dictionary.begin.json"
				}
			},
			"end": "\\}",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.dictionary.end.json"
				}
			},
			"name": "meta.structure.dictionary.json",
			"patterns": [
				{
					"comment": "the JSON object key",
					"include": "#objectkey"
				},
				{
					"include": "#comments"
				},
				{
					"begin": ":",
					"beginCaptures": {
						"0": {
							"name": "punctuation.separator.dictionary.key-value.json"
						}
					},
					"end": "(,)|(?=\\})",
					"endCaptures": {
						"1": {
							"name": "punctuation.separator.dictionary.pair.json"
						}
					},
					"name": "meta.structure.dictionary.value.json",
					"patterns": [
						{
							"comment": "the JSON object value",
							"include": "#value"
						},
						{
							"match": "[^\\s,]",
							"name": "invalid.illegal.expected-dictionary-separator.json"
						}
					]
				},
				{
					"match": "[^\\s\\}]",
					"name": "invalid.illegal.expected-dictionary-separator.json"
				}
			]
		},
		"string": {
			"begin": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.json"
				}
			},
			"end": "\"",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.json"
				}
			},
			"name": "string.quoted.double.json",
			"patterns": [
				{
					"include": "#stringcontent"
				}
			]
		},
		"objectkey": {
			"begin": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.support.type.property-name.begin.json"
				}
			},
			"end": "\"",
			"endCaptures": {
				"0": {
					"name": "punctuation.support.type.property-name.end.json"
				}
			},
			"name": "string.json support.type.property-name.json",
			"patterns": [
				{
					"include": "#stringcontent"
				}
			]
		},
		"stringcontent": {
			"patterns": [
				{
					"match": "(?x)                # turn on extended mode\n  \\\\                # a literal backslash\n  (?:               # ...followed by...\n    [\"\\\\/bfnrt]     # one of these characters\n    |               # ...or...\n    u               # a u\n    [0-9a-fA-F]{4}) # and four hex digits",
					"name": "constant.character.escape.json"
				},
				{
					"match": "\\\\.",
					"name": "invalid.illegal.unrecognized-string-escape.json"
				}
			]
		},
		"value": {
			"patterns": [
				{
					"include": "#constant"
				},
				{
					"include": "#number"
				},
				{
					"include": "#string"
				},
				{
					"include": "#array"
				},
				{
					"include": "#object"
				},
				{
					"include": "#comments"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json/syntaxes/JSONC.tmLanguage.json]---
Location: vscode-main/extensions/json/syntaxes/JSONC.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/microsoft/vscode-JSON.tmLanguage/blob/master/JSON.tmLanguage",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/microsoft/vscode-JSON.tmLanguage/commit/9bd83f1c252b375e957203f21793316203f61f70",
	"name": "JSON with Comments",
	"scopeName": "source.json.comments",
	"patterns": [
		{
			"include": "#value"
		}
	],
	"repository": {
		"array": {
			"begin": "\\[",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.array.begin.json.comments"
				}
			},
			"end": "\\]",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.array.end.json.comments"
				}
			},
			"name": "meta.structure.array.json.comments",
			"patterns": [
				{
					"include": "#value"
				},
				{
					"match": ",",
					"name": "punctuation.separator.array.json.comments"
				},
				{
					"match": "[^\\s\\]]",
					"name": "invalid.illegal.expected-array-separator.json.comments"
				}
			]
		},
		"comments": {
			"patterns": [
				{
					"begin": "/\\*\\*(?!/)",
					"captures": {
						"0": {
							"name": "punctuation.definition.comment.json.comments"
						}
					},
					"end": "\\*/",
					"name": "comment.block.documentation.json.comments"
				},
				{
					"begin": "/\\*",
					"captures": {
						"0": {
							"name": "punctuation.definition.comment.json.comments"
						}
					},
					"end": "\\*/",
					"name": "comment.block.json.comments"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.comment.json.comments"
						}
					},
					"match": "(//).*$\\n?",
					"name": "comment.line.double-slash.js"
				}
			]
		},
		"constant": {
			"match": "\\b(?:true|false|null)\\b",
			"name": "constant.language.json.comments"
		},
		"number": {
			"match": "(?x)        # turn on extended mode\n  -?        # an optional minus\n  (?:\n    0       # a zero\n    |       # ...or...\n    [1-9]   # a 1-9 character\n    \\d*     # followed by zero or more digits\n  )\n  (?:\n    (?:\n      \\.    # a period\n      \\d+   # followed by one or more digits\n    )?\n    (?:\n      [eE]  # an e character\n      [+-]? # followed by an option +/-\n      \\d+   # followed by one or more digits\n    )?      # make exponent optional\n  )?        # make decimal portion optional",
			"name": "constant.numeric.json.comments"
		},
		"object": {
			"begin": "\\{",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.dictionary.begin.json.comments"
				}
			},
			"end": "\\}",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.dictionary.end.json.comments"
				}
			},
			"name": "meta.structure.dictionary.json.comments",
			"patterns": [
				{
					"comment": "the JSON object key",
					"include": "#objectkey"
				},
				{
					"include": "#comments"
				},
				{
					"begin": ":",
					"beginCaptures": {
						"0": {
							"name": "punctuation.separator.dictionary.key-value.json.comments"
						}
					},
					"end": "(,)|(?=\\})",
					"endCaptures": {
						"1": {
							"name": "punctuation.separator.dictionary.pair.json.comments"
						}
					},
					"name": "meta.structure.dictionary.value.json.comments",
					"patterns": [
						{
							"comment": "the JSON object value",
							"include": "#value"
						},
						{
							"match": "[^\\s,]",
							"name": "invalid.illegal.expected-dictionary-separator.json.comments"
						}
					]
				},
				{
					"match": "[^\\s\\}]",
					"name": "invalid.illegal.expected-dictionary-separator.json.comments"
				}
			]
		},
		"string": {
			"begin": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.json.comments"
				}
			},
			"end": "\"",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.json.comments"
				}
			},
			"name": "string.quoted.double.json.comments",
			"patterns": [
				{
					"include": "#stringcontent"
				}
			]
		},
		"objectkey": {
			"begin": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.support.type.property-name.begin.json.comments"
				}
			},
			"end": "\"",
			"endCaptures": {
				"0": {
					"name": "punctuation.support.type.property-name.end.json.comments"
				}
			},
			"name": "string.json.comments support.type.property-name.json.comments",
			"patterns": [
				{
					"include": "#stringcontent"
				}
			]
		},
		"stringcontent": {
			"patterns": [
				{
					"match": "(?x)                # turn on extended mode\n  \\\\                # a literal backslash\n  (?:               # ...followed by...\n    [\"\\\\/bfnrt]     # one of these characters\n    |               # ...or...\n    u               # a u\n    [0-9a-fA-F]{4}) # and four hex digits",
					"name": "constant.character.escape.json.comments"
				},
				{
					"match": "\\\\.",
					"name": "invalid.illegal.unrecognized-string-escape.json.comments"
				}
			]
		},
		"value": {
			"patterns": [
				{
					"include": "#constant"
				},
				{
					"include": "#number"
				},
				{
					"include": "#string"
				},
				{
					"include": "#array"
				},
				{
					"include": "#object"
				},
				{
					"include": "#comments"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json/syntaxes/JSONL.tmLanguage.json]---
Location: vscode-main/extensions/json/syntaxes/JSONL.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/microsoft/vscode-JSON.tmLanguage/blob/master/JSON.tmLanguage",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/microsoft/vscode-JSON.tmLanguage/commit/9bd83f1c252b375e957203f21793316203f61f70",
	"name": "JSON Lines",
	"scopeName": "source.json.lines",
	"patterns": [
		{
			"include": "#value"
		}
	],
	"repository": {
		"array": {
			"begin": "\\[",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.array.begin.json.lines"
				}
			},
			"end": "\\]",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.array.end.json.lines"
				}
			},
			"name": "meta.structure.array.json.lines",
			"patterns": [
				{
					"include": "#value"
				},
				{
					"match": ",",
					"name": "punctuation.separator.array.json.lines"
				},
				{
					"match": "[^\\s\\]]",
					"name": "invalid.illegal.expected-array-separator.json.lines"
				}
			]
		},
		"comments": {
			"patterns": [
				{
					"begin": "/\\*\\*(?!/)",
					"captures": {
						"0": {
							"name": "punctuation.definition.comment.json.lines"
						}
					},
					"end": "\\*/",
					"name": "comment.block.documentation.json.lines"
				},
				{
					"begin": "/\\*",
					"captures": {
						"0": {
							"name": "punctuation.definition.comment.json.lines"
						}
					},
					"end": "\\*/",
					"name": "comment.block.json.lines"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.comment.json.lines"
						}
					},
					"match": "(//).*$\\n?",
					"name": "comment.line.double-slash.js"
				}
			]
		},
		"constant": {
			"match": "\\b(?:true|false|null)\\b",
			"name": "constant.language.json.lines"
		},
		"number": {
			"match": "(?x)        # turn on extended mode\n  -?        # an optional minus\n  (?:\n    0       # a zero\n    |       # ...or...\n    [1-9]   # a 1-9 character\n    \\d*     # followed by zero or more digits\n  )\n  (?:\n    (?:\n      \\.    # a period\n      \\d+   # followed by one or more digits\n    )?\n    (?:\n      [eE]  # an e character\n      [+-]? # followed by an option +/-\n      \\d+   # followed by one or more digits\n    )?      # make exponent optional\n  )?        # make decimal portion optional",
			"name": "constant.numeric.json.lines"
		},
		"object": {
			"begin": "\\{",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.dictionary.begin.json.lines"
				}
			},
			"end": "\\}",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.dictionary.end.json.lines"
				}
			},
			"name": "meta.structure.dictionary.json.lines",
			"patterns": [
				{
					"comment": "the JSON object key",
					"include": "#objectkey"
				},
				{
					"include": "#comments"
				},
				{
					"begin": ":",
					"beginCaptures": {
						"0": {
							"name": "punctuation.separator.dictionary.key-value.json.lines"
						}
					},
					"end": "(,)|(?=\\})",
					"endCaptures": {
						"1": {
							"name": "punctuation.separator.dictionary.pair.json.lines"
						}
					},
					"name": "meta.structure.dictionary.value.json.lines",
					"patterns": [
						{
							"comment": "the JSON object value",
							"include": "#value"
						},
						{
							"match": "[^\\s,]",
							"name": "invalid.illegal.expected-dictionary-separator.json.lines"
						}
					]
				},
				{
					"match": "[^\\s\\}]",
					"name": "invalid.illegal.expected-dictionary-separator.json.lines"
				}
			]
		},
		"string": {
			"begin": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.json.lines"
				}
			},
			"end": "\"",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.json.lines"
				}
			},
			"name": "string.quoted.double.json.lines",
			"patterns": [
				{
					"include": "#stringcontent"
				}
			]
		},
		"objectkey": {
			"begin": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.support.type.property-name.begin.json.lines"
				}
			},
			"end": "\"",
			"endCaptures": {
				"0": {
					"name": "punctuation.support.type.property-name.end.json.lines"
				}
			},
			"name": "string.json.lines support.type.property-name.json.lines",
			"patterns": [
				{
					"include": "#stringcontent"
				}
			]
		},
		"stringcontent": {
			"patterns": [
				{
					"match": "(?x)                # turn on extended mode\n  \\\\                # a literal backslash\n  (?:               # ...followed by...\n    [\"\\\\/bfnrt]     # one of these characters\n    |               # ...or...\n    u               # a u\n    [0-9a-fA-F]{4}) # and four hex digits",
					"name": "constant.character.escape.json.lines"
				},
				{
					"match": "\\\\.",
					"name": "invalid.illegal.unrecognized-string-escape.json.lines"
				}
			]
		},
		"value": {
			"patterns": [
				{
					"include": "#constant"
				},
				{
					"include": "#number"
				},
				{
					"include": "#string"
				},
				{
					"include": "#array"
				},
				{
					"include": "#object"
				},
				{
					"include": "#comments"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

````
