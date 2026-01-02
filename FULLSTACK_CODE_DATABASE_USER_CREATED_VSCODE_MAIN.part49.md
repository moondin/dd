---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 49
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 49 of 552)

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

---[FILE: extensions/java/syntaxes/java.tmLanguage.json]---
Location: vscode-main/extensions/java/syntaxes/java.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/redhat-developer/vscode-java/blob/master/language-support/java/java.tmLanguage.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/redhat-developer/vscode-java/commit/f09b712f5d6d6339e765f58c8dfab3f78a378183",
	"name": "Java",
	"scopeName": "source.java",
	"patterns": [
		{
			"begin": "\\b(package)\\b\\s*",
			"beginCaptures": {
				"1": {
					"name": "keyword.other.package.java"
				}
			},
			"end": "\\s*(;)",
			"endCaptures": {
				"1": {
					"name": "punctuation.terminator.java"
				}
			},
			"name": "meta.package.java",
			"contentName": "storage.modifier.package.java",
			"patterns": [
				{
					"include": "#comments"
				},
				{
					"match": "(?<=\\.)\\s*\\.|\\.(?=\\s*;)",
					"name": "invalid.illegal.character_not_allowed_here.java"
				},
				{
					"match": "(?<!_)_(?=\\s*(\\.|;))|\\b\\d+|-+",
					"name": "invalid.illegal.character_not_allowed_here.java"
				},
				{
					"match": "[A-Z]+",
					"name": "invalid.deprecated.package_name_not_lowercase.java"
				},
				{
					"match": "(?x)\\b(?<!\\$)\n(abstract|assert|boolean|break|byte|case|catch|char|class|\nconst|continue|default|do|double|else|enum|extends|final|\nfinally|float|for|goto|if|implements|import|instanceof|int|\ninterface|long|native|new|non-sealed|package|permits|private|protected|public|\nreturn|sealed|short|static|strictfp|super|switch|syncronized|this|\nthrow|throws|transient|try|void|volatile|while|yield|\ntrue|false|null)\\b",
					"name": "invalid.illegal.character_not_allowed_here.java"
				},
				{
					"match": "\\.",
					"name": "punctuation.separator.java"
				}
			]
		},
		{
			"begin": "\\b(import)\\b\\s*\\b(static)?\\b\\s",
			"beginCaptures": {
				"1": {
					"name": "keyword.other.import.java"
				},
				"2": {
					"name": "storage.modifier.java"
				}
			},
			"end": "\\s*(;)",
			"endCaptures": {
				"1": {
					"name": "punctuation.terminator.java"
				}
			},
			"name": "meta.import.java",
			"contentName": "storage.modifier.import.java",
			"patterns": [
				{
					"include": "#comments"
				},
				{
					"match": "(?<=\\.)\\s*\\.|\\.(?=\\s*;)",
					"name": "invalid.illegal.character_not_allowed_here.java"
				},
				{
					"match": "(?<!\\.)\\s*\\*",
					"name": "invalid.illegal.character_not_allowed_here.java"
				},
				{
					"match": "(?<!_)_(?=\\s*(\\.|;))|\\b\\d+|-+",
					"name": "invalid.illegal.character_not_allowed_here.java"
				},
				{
					"match": "(?x)\\b(?<!\\$)\n(abstract|assert|boolean|break|byte|case|catch|char|class|\nconst|continue|default|do|double|else|enum|extends|final|\nfinally|float|for|goto|if|implements|import|instanceof|int|\ninterface|long|native|new|non-sealed|package|permits|private|protected|public|\nreturn|sealed|short|static|strictfp|super|switch|syncronized|this|\nthrow|throws|transient|try|void|volatile|while|yield|\ntrue|false|null)\\b",
					"name": "invalid.illegal.character_not_allowed_here.java"
				},
				{
					"match": "\\.",
					"name": "punctuation.separator.java"
				},
				{
					"match": "\\*",
					"name": "variable.language.wildcard.java"
				}
			]
		},
		{
			"include": "#comments-javadoc"
		},
		{
			"include": "#code"
		},
		{
			"include": "#module"
		}
	],
	"repository": {
		"all-types": {
			"patterns": [
				{
					"include": "#primitive-arrays"
				},
				{
					"include": "#primitive-types"
				},
				{
					"include": "#object-types"
				}
			]
		},
		"annotations": {
			"patterns": [
				{
					"begin": "((@)\\s*([^\\s(]+))(\\()",
					"beginCaptures": {
						"2": {
							"name": "punctuation.definition.annotation.java"
						},
						"3": {
							"name": "storage.type.annotation.java"
						},
						"4": {
							"name": "punctuation.definition.annotation-arguments.begin.bracket.round.java"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.annotation-arguments.end.bracket.round.java"
						}
					},
					"name": "meta.declaration.annotation.java",
					"patterns": [
						{
							"captures": {
								"1": {
									"name": "constant.other.key.java"
								},
								"2": {
									"name": "keyword.operator.assignment.java"
								}
							},
							"match": "(\\w*)\\s*(=)"
						},
						{
							"include": "#code"
						}
					]
				},
				{
					"match": "(@)(interface)\\s+(\\w*)|((@)\\s*(\\w+))",
					"name": "meta.declaration.annotation.java",
					"captures": {
						"1": {
							"name": "punctuation.definition.annotation.java"
						},
						"2": {
							"name": "storage.modifier.java"
						},
						"3": {
							"name": "storage.type.annotation.java"
						},
						"5": {
							"name": "punctuation.definition.annotation.java"
						},
						"6": {
							"name": "storage.type.annotation.java"
						}
					}
				}
			]
		},
		"anonymous-block-and-instance-initializer": {
			"begin": "{",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.block.begin.bracket.curly.java"
				}
			},
			"end": "}",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.block.end.bracket.curly.java"
				}
			},
			"patterns": [
				{
					"include": "#code"
				}
			]
		},
		"anonymous-classes-and-new": {
			"begin": "\\bnew\\b",
			"beginCaptures": {
				"0": {
					"name": "keyword.control.new.java"
				}
			},
			"end": "(?=;|\\)|\\]|\\.|,|\\?|:|}|\\+|\\-|\\*|\\/(?!\\/|\\*)|%|!|&|\\||\\^|=)",
			"patterns": [
				{
					"include": "#comments"
				},
				{
					"include": "#function-call"
				},
				{
					"include": "#all-types"
				},
				{
					"begin": "(?<=\\))",
					"end": "(?=;|\\)|\\]|\\.|,|\\?|:|}|\\+|\\-|\\*|\\/(?!\\/|\\*)|%|!|&|\\||\\^|=)",
					"patterns": [
						{
							"include": "#comments"
						},
						{
							"begin": "{",
							"beginCaptures": {
								"0": {
									"name": "punctuation.section.inner-class.begin.bracket.curly.java"
								}
							},
							"end": "}",
							"endCaptures": {
								"0": {
									"name": "punctuation.section.inner-class.end.bracket.curly.java"
								}
							},
							"name": "meta.inner-class.java",
							"patterns": [
								{
									"include": "#class-body"
								}
							]
						}
					]
				},
				{
					"begin": "(?<=\\])",
					"end": "(?=;|\\)|\\]|\\.|,|\\?|:|}|\\+|\\-|\\*|\\/(?!\\/|\\*)|%|!|&|\\||\\^|=)",
					"patterns": [
						{
							"include": "#comments"
						},
						{
							"begin": "{",
							"beginCaptures": {
								"0": {
									"name": "punctuation.section.array-initializer.begin.bracket.curly.java"
								}
							},
							"end": "}",
							"endCaptures": {
								"0": {
									"name": "punctuation.section.array-initializer.end.bracket.curly.java"
								}
							},
							"name": "meta.array-initializer.java",
							"patterns": [
								{
									"include": "#code"
								}
							]
						}
					]
				},
				{
					"include": "#parens"
				}
			]
		},
		"assertions": {
			"patterns": [
				{
					"begin": "\\b(assert)\\s",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.assert.java"
						}
					},
					"end": "$",
					"name": "meta.declaration.assertion.java",
					"patterns": [
						{
							"match": ":",
							"name": "keyword.operator.assert.expression-separator.java"
						},
						{
							"include": "#code"
						}
					]
				}
			]
		},
		"class": {
			"begin": "(?=\\w?[\\w\\s-]*\\b(?:class|(?<!@)interface|enum)\\s+[\\w$]+)",
			"end": "}",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.class.end.bracket.curly.java"
				}
			},
			"name": "meta.class.java",
			"patterns": [
				{
					"include": "#storage-modifiers"
				},
				{
					"include": "#generics"
				},
				{
					"include": "#comments"
				},
				{
					"captures": {
						"1": {
							"name": "storage.modifier.java"
						},
						"2": {
							"name": "entity.name.type.class.java"
						}
					},
					"match": "(class|(?<!@)interface|enum)\\s+([\\w$]+)",
					"name": "meta.class.identifier.java"
				},
				{
					"begin": "extends",
					"beginCaptures": {
						"0": {
							"name": "storage.modifier.extends.java"
						}
					},
					"end": "(?={|implements|permits)",
					"name": "meta.definition.class.inherited.classes.java",
					"patterns": [
						{
							"include": "#object-types-inherited"
						},
						{
							"include": "#comments"
						}
					]
				},
				{
					"begin": "(implements)\\s",
					"beginCaptures": {
						"1": {
							"name": "storage.modifier.implements.java"
						}
					},
					"end": "(?=\\s*extends|permits|\\{)",
					"name": "meta.definition.class.implemented.interfaces.java",
					"patterns": [
						{
							"include": "#object-types-inherited"
						},
						{
							"include": "#comments"
						}
					]
				},
				{
					"begin": "(permits)\\s",
					"beginCaptures": {
						"1": {
							"name": "storage.modifier.permits.java"
						}
					},
					"end": "(?=\\s*extends|implements|\\{)",
					"name": "meta.definition.class.permits.classes.java",
					"patterns": [
						{
							"include": "#object-types-inherited"
						},
						{
							"include": "#comments"
						}
					]
				},
				{
					"begin": "{",
					"beginCaptures": {
						"0": {
							"name": "punctuation.section.class.begin.bracket.curly.java"
						}
					},
					"end": "(?=})",
					"contentName": "meta.class.body.java",
					"patterns": [
						{
							"include": "#class-body"
						}
					]
				}
			]
		},
		"class-body": {
			"patterns": [
				{
					"include": "#comments-javadoc"
				},
				{
					"include": "#comments"
				},
				{
					"include": "#enums"
				},
				{
					"include": "#class"
				},
				{
					"include": "#generics"
				},
				{
					"include": "#static-initializer"
				},
				{
					"include": "#class-fields-and-methods"
				},
				{
					"include": "#annotations"
				},
				{
					"include": "#storage-modifiers"
				},
				{
					"include": "#member-variables"
				},
				{
					"include": "#code"
				}
			]
		},
		"class-fields-and-methods": {
			"patterns": [
				{
					"begin": "(?=\\=)",
					"end": "(?=;)",
					"patterns": [
						{
							"include": "#code"
						}
					]
				},
				{
					"include": "#methods"
				}
			]
		},
		"code": {
			"patterns": [
				{
					"include": "#annotations"
				},
				{
					"include": "#comments"
				},
				{
					"include": "#enums"
				},
				{
					"include": "#class"
				},
				{
					"include": "#record"
				},
				{
					"include": "#anonymous-block-and-instance-initializer"
				},
				{
					"include": "#try-catch-finally"
				},
				{
					"include": "#assertions"
				},
				{
					"include": "#parens"
				},
				{
					"include": "#constants-and-special-vars"
				},
				{
					"include": "#numbers"
				},
				{
					"include": "#anonymous-classes-and-new"
				},
				{
					"include": "#lambda-expression"
				},
				{
					"include": "#keywords"
				},
				{
					"include": "#storage-modifiers"
				},
				{
					"include": "#method-call"
				},
				{
					"include": "#function-call"
				},
				{
					"include": "#variables"
				},
				{
					"include": "#variables-local"
				},
				{
					"include": "#objects"
				},
				{
					"include": "#properties"
				},
				{
					"include": "#strings"
				},
				{
					"include": "#all-types"
				},
				{
					"match": ",",
					"name": "punctuation.separator.delimiter.java"
				},
				{
					"match": "\\.",
					"name": "punctuation.separator.period.java"
				},
				{
					"match": ";",
					"name": "punctuation.terminator.java"
				}
			]
		},
		"comments": {
			"patterns": [
				{
					"captures": {
						"0": {
							"name": "punctuation.definition.comment.java"
						}
					},
					"match": "/\\*\\*/",
					"name": "comment.block.empty.java"
				},
				{
					"include": "#comments-inline"
				}
			]
		},
		"comments-inline": {
			"patterns": [
				{
					"begin": "/\\*",
					"captures": {
						"0": {
							"name": "punctuation.definition.comment.java"
						}
					},
					"end": "\\*/",
					"name": "comment.block.java"
				},
				{
					"begin": "(^[ \\t]+)?(?=//)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.whitespace.comment.leading.java"
						}
					},
					"end": "(?!\\G)",
					"patterns": [
						{
							"begin": "//",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.comment.java"
								}
							},
							"end": "\\n",
							"name": "comment.line.double-slash.java"
						}
					]
				}
			]
		},
		"comments-javadoc": {
			"patterns": [
				{
					"begin": "^\\s*(/\\*\\*)(?!/)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.comment.java"
						}
					},
					"end": "\\*/",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.comment.java"
						}
					},
					"name": "comment.block.javadoc.java",
					"patterns": [
						{
							"match": "@(author|deprecated|return|see|serial|since|version)\\b",
							"name": "keyword.other.documentation.javadoc.java"
						},
						{
							"match": "(@param)\\s+(\\S+)",
							"captures": {
								"1": {
									"name": "keyword.other.documentation.javadoc.java"
								},
								"2": {
									"name": "variable.parameter.java"
								}
							}
						},
						{
							"match": "(@(?:exception|throws))\\s+(\\S+)",
							"captures": {
								"1": {
									"name": "keyword.other.documentation.javadoc.java"
								},
								"2": {
									"name": "entity.name.type.class.java"
								}
							}
						},
						{
							"match": "{(@link)\\s+(\\S+)?#([\\w$]+\\s*\\([^\\(\\)]*\\)).*?}",
							"captures": {
								"1": {
									"name": "keyword.other.documentation.javadoc.java"
								},
								"2": {
									"name": "entity.name.type.class.java"
								},
								"3": {
									"name": "variable.parameter.java"
								}
							}
						}
					]
				}
			]
		},
		"constants-and-special-vars": {
			"patterns": [
				{
					"match": "\\b(true|false|null)\\b",
					"name": "constant.language.java"
				},
				{
					"match": "\\bthis\\b",
					"name": "variable.language.this.java"
				},
				{
					"match": "\\bsuper\\b",
					"name": "variable.language.java"
				}
			]
		},
		"enums": {
			"begin": "^\\s*([\\w\\s]*)(enum)\\s+(\\w+)",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#storage-modifiers"
						}
					]
				},
				"2": {
					"name": "storage.modifier.java"
				},
				"3": {
					"name": "entity.name.type.enum.java"
				}
			},
			"end": "}",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.enum.end.bracket.curly.java"
				}
			},
			"name": "meta.enum.java",
			"patterns": [
				{
					"begin": "\\b(extends)\\b",
					"beginCaptures": {
						"1": {
							"name": "storage.modifier.extends.java"
						}
					},
					"end": "(?={|\\bimplements\\b)",
					"name": "meta.definition.class.inherited.classes.java",
					"patterns": [
						{
							"include": "#object-types-inherited"
						},
						{
							"include": "#comments"
						}
					]
				},
				{
					"begin": "\\b(implements)\\b",
					"beginCaptures": {
						"1": {
							"name": "storage.modifier.implements.java"
						}
					},
					"end": "(?={|\\bextends\\b)",
					"name": "meta.definition.class.implemented.interfaces.java",
					"patterns": [
						{
							"include": "#object-types-inherited"
						},
						{
							"include": "#comments"
						}
					]
				},
				{
					"begin": "{",
					"beginCaptures": {
						"0": {
							"name": "punctuation.section.enum.begin.bracket.curly.java"
						}
					},
					"end": "(?=})",
					"patterns": [
						{
							"begin": "(?<={)",
							"end": "(?=;|})",
							"patterns": [
								{
									"include": "#comments-javadoc"
								},
								{
									"include": "#comments"
								},
								{
									"begin": "\\b(\\w+)\\b",
									"beginCaptures": {
										"1": {
											"name": "constant.other.enum.java"
										}
									},
									"end": "(,)|(?=;|})",
									"endCaptures": {
										"1": {
											"name": "punctuation.separator.delimiter.java"
										}
									},
									"patterns": [
										{
											"include": "#comments-javadoc"
										},
										{
											"include": "#comments"
										},
										{
											"begin": "\\(",
											"beginCaptures": {
												"0": {
													"name": "punctuation.bracket.round.java"
												}
											},
											"end": "\\)",
											"endCaptures": {
												"0": {
													"name": "punctuation.bracket.round.java"
												}
											},
											"patterns": [
												{
													"include": "#code"
												}
											]
										},
										{
											"begin": "{",
											"beginCaptures": {
												"0": {
													"name": "punctuation.bracket.curly.java"
												}
											},
											"end": "}",
											"endCaptures": {
												"0": {
													"name": "punctuation.bracket.curly.java"
												}
											},
											"patterns": [
												{
													"include": "#class-body"
												}
											]
										}
									]
								}
							]
						},
						{
							"include": "#class-body"
						}
					]
				}
			]
		},
		"function-call": {
			"begin": "([A-Za-z_$][\\w$]*)\\s*(\\()",
			"beginCaptures": {
				"1": {
					"name": "entity.name.function.java"
				},
				"2": {
					"name": "punctuation.definition.parameters.begin.bracket.round.java"
				}
			},
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.parameters.end.bracket.round.java"
				}
			},
			"name": "meta.function-call.java",
			"patterns": [
				{
					"include": "#code"
				}
			]
		},
		"generics": {
			"begin": "<",
			"beginCaptures": {
				"0": {
					"name": "punctuation.bracket.angle.java"
				}
			},
			"end": ">",
			"endCaptures": {
				"0": {
					"name": "punctuation.bracket.angle.java"
				}
			},
			"patterns": [
				{
					"match": "\\b(extends|super)\\b",
					"name": "storage.modifier.$1.java"
				},
				{
					"match": "(?<!\\.)([a-zA-Z$_][a-zA-Z0-9$_]*)(?=\\s*<)",
					"captures": {
						"1": {
							"name": "storage.type.java"
						}
					}
				},
				{
					"include": "#primitive-arrays"
				},
				{
					"match": "[a-zA-Z$_][a-zA-Z0-9$_]*",
					"name": "storage.type.generic.java"
				},
				{
					"match": "\\?",
					"name": "storage.type.generic.wildcard.java"
				},
				{
					"match": "&",
					"name": "punctuation.separator.types.java"
				},
				{
					"match": ",",
					"name": "punctuation.separator.delimiter.java"
				},
				{
					"match": "\\.",
					"name": "punctuation.separator.period.java"
				},
				{
					"include": "#parens"
				},
				{
					"include": "#generics"
				},
				{
					"include": "#comments"
				}
			]
		},
		"keywords": {
			"patterns": [
				{
					"match": "\\bthrow\\b",
					"name": "keyword.control.throw.java"
				},
				{
					"match": "\\?|:",
					"name": "keyword.control.ternary.java"
				},
				{
					"match": "\\b(return|yield|break|case|continue|default|do|while|for|switch|if|else)\\b",
					"name": "keyword.control.java"
				},
				{
					"match": "\\b(instanceof)\\b",
					"name": "keyword.operator.instanceof.java"
				},
				{
					"match": "(<<|>>>?|~|\\^)",
					"name": "keyword.operator.bitwise.java"
				},
				{
					"match": "((&|\\^|\\||<<|>>>?)=)",
					"name": "keyword.operator.assignment.bitwise.java"
				},
				{
					"match": "(===?|!=|<=|>=|<>|<|>)",
					"name": "keyword.operator.comparison.java"
				},
				{
					"match": "([+*/%-]=)",
					"name": "keyword.operator.assignment.arithmetic.java"
				},
				{
					"match": "(=)",
					"name": "keyword.operator.assignment.java"
				},
				{
					"match": "(\\-\\-|\\+\\+)",
					"name": "keyword.operator.increment-decrement.java"
				},
				{
					"match": "(\\-|\\+|\\*|\\/|%)",
					"name": "keyword.operator.arithmetic.java"
				},
				{
					"match": "(!|&&|\\|\\|)",
					"name": "keyword.operator.logical.java"
				},
				{
					"match": "(\\||&)",
					"name": "keyword.operator.bitwise.java"
				},
				{
					"match": "\\b(const|goto)\\b",
					"name": "keyword.reserved.java"
				}
			]
		},
		"lambda-expression": {
			"patterns": [
				{
					"match": "->",
					"name": "storage.type.function.arrow.java"
				}
			]
		},
		"member-variables": {
			"begin": "(?=private|protected|public|native|synchronized|abstract|threadsafe|transient|static|final)",
			"end": "(?=\\=|;)",
			"patterns": [
				{
					"include": "#storage-modifiers"
				},
				{
					"include": "#variables"
				},
				{
					"include": "#primitive-arrays"
				},
				{
					"include": "#object-types"
				}
			]
		},
		"method-call": {
			"begin": "(\\.)\\s*([A-Za-z_$][\\w$]*)\\s*(\\()",
			"beginCaptures": {
				"1": {
					"name": "punctuation.separator.period.java"
				},
				"2": {
					"name": "entity.name.function.java"
				},
				"3": {
					"name": "punctuation.definition.parameters.begin.bracket.round.java"
				}
			},
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.parameters.end.bracket.round.java"
				}
			},
			"name": "meta.method-call.java",
			"patterns": [
				{
					"include": "#code"
				}
			]
		},
		"methods": {
			"begin": "(?!new)(?=[\\w<].*\\s+)(?=([^=/]|/(?!/))+\\()",
			"end": "(})|(?=;)",
			"endCaptures": {
				"1": {
					"name": "punctuation.section.method.end.bracket.curly.java"
				}
			},
			"name": "meta.method.java",
			"patterns": [
				{
					"include": "#storage-modifiers"
				},
				{
					"begin": "(\\w+)\\s*(\\()",
					"beginCaptures": {
						"1": {
							"name": "entity.name.function.java"
						},
						"2": {
							"name": "punctuation.definition.parameters.begin.bracket.round.java"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.parameters.end.bracket.round.java"
						}
					},
					"name": "meta.method.identifier.java",
					"patterns": [
						{
							"include": "#parameters"
						},
						{
							"include": "#parens"
						},
						{
							"include": "#comments"
						}
					]
				},
				{
					"include": "#generics"
				},
				{
					"begin": "(?=\\w.*\\s+\\w+\\s*\\()",
					"end": "(?=\\s+\\w+\\s*\\()",
					"name": "meta.method.return-type.java",
					"patterns": [
						{
							"include": "#all-types"
						},
						{
							"include": "#parens"
						},
						{
							"include": "#comments"
						}
					]
				},
				{
					"include": "#throws"
				},
				{
					"begin": "{",
					"beginCaptures": {
						"0": {
							"name": "punctuation.section.method.begin.bracket.curly.java"
						}
					},
					"end": "(?=})",
					"contentName": "meta.method.body.java",
					"patterns": [
						{
							"include": "#code"
						}
					]
				},
				{
					"include": "#comments"
				}
			]
		},
		"module": {
			"begin": "((open)\\s)?(module)\\s+(\\w+)",
			"end": "}",
			"beginCaptures": {
				"1": {
					"name": "storage.modifier.java"
				},
				"3": {
					"name": "storage.modifier.java"
				},
				"4": {
					"name": "entity.name.type.module.java"
				}
			},
			"endCaptures": {
				"0": {
					"name": "punctuation.section.module.end.bracket.curly.java"
				}
			},
			"name": "meta.module.java",
			"patterns": [
				{
					"begin": "{",
					"beginCaptures": {
						"0": {
							"name": "punctuation.section.module.begin.bracket.curly.java"
						}
					},
					"end": "(?=})",
					"contentName": "meta.module.body.java",
					"patterns": [
						{
							"include": "#comments"
						},
						{
							"include": "#comments-javadoc"
						},
						{
							"match": "\\b(requires|transitive|exports|opens|to|uses|provides|with)\\b",
							"name": "keyword.module.java"
						}
					]
				}
			]
		},
		"numbers": {
			"patterns": [
				{
					"match": "(?x)\n\\b(?<!\\$)\n0(x|X)\n(\n  (?<!\\.)[0-9a-fA-F]([0-9a-fA-F_]*[0-9a-fA-F])?[Ll]?(?!\\.)\n  |\n  (\n    [0-9a-fA-F]([0-9a-fA-F_]*[0-9a-fA-F])?\\.?\n    |\n    ([0-9a-fA-F]([0-9a-fA-F_]*[0-9a-fA-F])?)?\\.[0-9a-fA-F]([0-9a-fA-F_]*[0-9a-fA-F])?\n  )\n  [Pp][+-]?[0-9]([0-9_]*[0-9])?[FfDd]?\n)\n\\b(?!\\$)",
					"name": "constant.numeric.hex.java"
				},
				{
					"match": "\\b(?<!\\$)0(b|B)[01]([01_]*[01])?[Ll]?\\b(?!\\$)",
					"name": "constant.numeric.binary.java"
				},
				{
					"match": "\\b(?<!\\$)0[0-7]([0-7_]*[0-7])?[Ll]?\\b(?!\\$)",
					"name": "constant.numeric.octal.java"
				},
				{
					"match": "(?x)\n(?<!\\$)\n(\n  \\b[0-9]([0-9_]*[0-9])?\\.\\B(?!\\.)\n  |\n  \\b[0-9]([0-9_]*[0-9])?\\.([Ee][+-]?[0-9]([0-9_]*[0-9])?)[FfDd]?\\b\n  |\n  \\b[0-9]([0-9_]*[0-9])?\\.([Ee][+-]?[0-9]([0-9_]*[0-9])?)?[FfDd]\\b\n  |\n  \\b[0-9]([0-9_]*[0-9])?\\.([0-9]([0-9_]*[0-9])?)([Ee][+-]?[0-9]([0-9_]*[0-9])?)?[FfDd]?\\b\n  |\n  (?<!\\.)\\B\\.[0-9]([0-9_]*[0-9])?([Ee][+-]?[0-9]([0-9_]*[0-9])?)?[FfDd]?\\b\n  |\n  \\b[0-9]([0-9_]*[0-9])?([Ee][+-]?[0-9]([0-9_]*[0-9])?)[FfDd]?\\b\n  |\n  \\b[0-9]([0-9_]*[0-9])?([Ee][+-]?[0-9]([0-9_]*[0-9])?)?[FfDd]\\b\n  |\n  \\b(0|[1-9]([0-9_]*[0-9])?)(?!\\.)[Ll]?\\b\n)\n(?!\\$)",
					"name": "constant.numeric.decimal.java"
				}
			]
		},
		"object-types": {
			"patterns": [
				{
					"include": "#generics"
				},
				{
					"begin": "\\b((?:[A-Za-z_]\\w*\\s*\\.\\s*)*)([A-Z_]\\w*)\\s*(?=\\[)",
					"beginCaptures": {
						"1": {
							"patterns": [
								{
									"match": "[A-Za-z_]\\w*",
									"name": "storage.type.java"
								},
								{
									"match": "\\.",
									"name": "punctuation.separator.period.java"
								}
							]
						},
						"2": {
							"name": "storage.type.object.array.java"
						}
					},
					"end": "(?!\\s*\\[)",
					"patterns": [
						{
							"include": "#comments"
						},
						{
							"include": "#parens"
						}
					]
				},
				{
					"match": "\\b((?:[A-Za-z_]\\w*\\s*\\.\\s*)*[A-Z_]\\w*)\\s*(?=<)",
					"captures": {
						"1": {
							"patterns": [
								{
									"match": "[A-Za-z_]\\w*",
									"name": "storage.type.java"
								},
								{
									"match": "\\.",
									"name": "punctuation.separator.period.java"
								}
							]
						}
					}
				},
				{
					"match": "\\b((?:[A-Za-z_]\\w*\\s*\\.\\s*)*[A-Z_]\\w*)\\b((?=\\s*[A-Za-z$_\\n])|(?=\\s*\\.\\.\\.))",
					"captures": {
						"1": {
							"patterns": [
								{
									"match": "[A-Za-z_]\\w*",
									"name": "storage.type.java"
								},
								{
									"match": "\\.",
									"name": "punctuation.separator.period.java"
								}
							]
						}
					}
				}
			]
		},
		"object-types-inherited": {
			"patterns": [
				{
					"include": "#generics"
				},
				{
					"match": "\\b(?:[A-Z]\\w*\\s*(\\.)\\s*)*[A-Z]\\w*\\b",
					"name": "entity.other.inherited-class.java",
					"captures": {
						"1": {
							"name": "punctuation.separator.period.java"
						}
					}
				},
				{
					"match": ",",
					"name": "punctuation.separator.delimiter.java"
				}
			]
		},
		"objects": {
			"match": "(?<![\\w$])[a-zA-Z_$][\\w$]*(?=\\s*\\.\\s*[\\w$]+)",
			"name": "variable.other.object.java"
		},
		"parameters": {
			"patterns": [
				{
					"match": "\\bfinal\\b",
					"name": "storage.modifier.java"
				},
				{
					"include": "#annotations"
				},
				{
					"include": "#all-types"
				},
				{
					"include": "#strings"
				},
				{
					"match": "\\w+",
					"name": "variable.parameter.java"
				},
				{
					"match": ",",
					"name": "punctuation.separator.delimiter.java"
				},
				{
					"match": "\\.\\.\\.",
					"name": "punctuation.definition.parameters.varargs.java"
				}
			]
		},
		"parens": {
			"patterns": [
				{
					"begin": "\\(",
					"beginCaptures": {
						"0": {
							"name": "punctuation.bracket.round.java"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.bracket.round.java"
						}
					},
					"patterns": [
						{
							"include": "#code"
						}
					]
				},
				{
					"begin": "\\[",
					"beginCaptures": {
						"0": {
							"name": "punctuation.bracket.square.java"
						}
					},
					"end": "\\]",
					"endCaptures": {
						"0": {
							"name": "punctuation.bracket.square.java"
						}
					},
					"patterns": [
						{
							"include": "#code"
						}
					]
				},
				{
					"begin": "{",
					"beginCaptures": {
						"0": {
							"name": "punctuation.bracket.curly.java"
						}
					},
					"end": "}",
					"endCaptures": {
						"0": {
							"name": "punctuation.bracket.curly.java"
						}
					},
					"patterns": [
						{
							"include": "#code"
						}
					]
				}
			]
		},
		"primitive-arrays": {
			"patterns": [
				{
					"begin": "\\b(void|boolean|byte|char|short|int|float|long|double)\\b\\s*(?=\\[)",
					"beginCaptures": {
						"1": {
							"name": "storage.type.primitive.array.java"
						}
					},
					"end": "(?!\\s*\\[)",
					"patterns": [
						{
							"include": "#comments"
						},
						{
							"include": "#parens"
						}
					]
				}
			]
		},
		"primitive-types": {
			"match": "\\b(void|boolean|byte|char|short|int|float|long|double)\\b",
			"name": "storage.type.primitive.java"
		},
		"properties": {
			"patterns": [
				{
					"match": "(\\.)\\s*(new)",
					"captures": {
						"1": {
							"name": "punctuation.separator.period.java"
						},
						"2": {
							"name": "keyword.control.new.java"
						}
					}
				},
				{
					"match": "(\\.)\\s*([a-zA-Z_$][\\w$]*)(?=\\s*\\.\\s*[a-zA-Z_$][\\w$]*)",
					"captures": {
						"1": {
							"name": "punctuation.separator.period.java"
						},
						"2": {
							"name": "variable.other.object.property.java"
						}
					}
				},
				{
					"match": "(\\.)\\s*([a-zA-Z_$][\\w$]*)",
					"captures": {
						"1": {
							"name": "punctuation.separator.period.java"
						},
						"2": {
							"name": "variable.other.object.property.java"
						}
					}
				},
				{
					"match": "(\\.)\\s*([0-9][\\w$]*)",
					"captures": {
						"1": {
							"name": "punctuation.separator.period.java"
						},
						"2": {
							"name": "invalid.illegal.identifier.java"
						}
					}
				}
			]
		},
		"record": {
			"begin": "(?=\\w?[\\w\\s]*\\b(?:record)\\s+[\\w$]+)",
			"end": "}",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.class.end.bracket.curly.java"
				}
			},
			"name": "meta.record.java",
			"patterns": [
				{
					"include": "#storage-modifiers"
				},
				{
					"include": "#generics"
				},
				{
					"include": "#comments"
				},
				{
					"begin": "(record)\\s+([\\w$]+)(<[\\w$]+>)?(\\()",
					"beginCaptures": {
						"1": {
							"name": "storage.modifier.java"
						},
						"2": {
							"name": "entity.name.type.record.java"
						},
						"3": {
							"patterns": [
								{
									"include": "#generics"
								}
							]
						},
						"4": {
							"name": "punctuation.definition.parameters.begin.bracket.round.java"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.parameters.end.bracket.round.java"
						}
					},
					"name": "meta.record.identifier.java",
					"patterns": [
						{
							"include": "#code"
						}
					]
				},
				{
					"begin": "(implements)\\s",
					"beginCaptures": {
						"1": {
							"name": "storage.modifier.implements.java"
						}
					},
					"end": "(?=\\s*\\{)",
					"name": "meta.definition.class.implemented.interfaces.java",
					"patterns": [
						{
							"include": "#object-types-inherited"
						},
						{
							"include": "#comments"
						}
					]
				},
				{
					"include": "#record-body"
				}
			]
		},
		"record-body": {
			"begin": "{",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.class.begin.bracket.curly.java"
				}
			},
			"end": "(?=})",
			"name": "meta.record.body.java",
			"patterns": [
				{
					"include": "#record-constructor"
				},
				{
					"include": "#class-body"
				}
			]
		},
		"record-constructor": {
			"begin": "(?!new)(?=[\\w<].*\\s+)(?=([^\\(=/]|/(?!/))+(?={))",
			"end": "(})|(?=;)",
			"endCaptures": {
				"1": {
					"name": "punctuation.section.method.end.bracket.curly.java"
				}
			},
			"name": "meta.method.java",
			"patterns": [
				{
					"include": "#storage-modifiers"
				},
				{
					"begin": "(\\w+)",
					"beginCaptures": {
						"1": {
							"name": "entity.name.function.java"
						}
					},
					"end": "(?=\\s*{)",
					"name": "meta.method.identifier.java",
					"patterns": [
						{
							"include": "#comments"
						}
					]
				},
				{
					"include": "#comments"
				},
				{
					"begin": "{",
					"beginCaptures": {
						"0": {
							"name": "punctuation.section.method.begin.bracket.curly.java"
						}
					},
					"end": "(?=})",
					"contentName": "meta.method.body.java",
					"patterns": [
						{
							"include": "#code"
						}
					]
				}
			]
		},
		"static-initializer": {
			"patterns": [
				{
					"include": "#anonymous-block-and-instance-initializer"
				},
				{
					"match": "static",
					"name": "storage.modifier.java"
				}
			]
		},
		"storage-modifiers": {
			"match": "\\b(public|private|protected|static|final|native|synchronized|abstract|threadsafe|transient|volatile|default|strictfp|sealed|non-sealed)\\b",
			"name": "storage.modifier.java"
		},
		"strings": {
			"patterns": [
				{
					"begin": "\"\"\"",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.java"
						}
					},
					"end": "\"\"\"",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.java"
						}
					},
					"name": "string.quoted.triple.java",
					"patterns": [
						{
							"match": "(\\\\\"\"\")(?!\")|(\\\\.)",
							"name": "constant.character.escape.java"
						}
					]
				},
				{
					"begin": "\"",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.java"
						}
					},
					"end": "\"",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.java"
						}
					},
					"name": "string.quoted.double.java",
					"patterns": [
						{
							"match": "\\\\.",
							"name": "constant.character.escape.java"
						}
					]
				},
				{
					"begin": "'",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.java"
						}
					},
					"end": "'",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.java"
						}
					},
					"name": "string.quoted.single.java",
					"patterns": [
						{
							"match": "\\\\.",
							"name": "constant.character.escape.java"
						}
					]
				}
			]
		},
		"throws": {
			"begin": "throws",
			"beginCaptures": {
				"0": {
					"name": "storage.modifier.java"
				}
			},
			"end": "(?={|;)",
			"name": "meta.throwables.java",
			"patterns": [
				{
					"match": ",",
					"name": "punctuation.separator.delimiter.java"
				},
				{
					"match": "[a-zA-Z$_][\\.a-zA-Z0-9$_]*",
					"name": "storage.type.java"
				},
				{
					"include": "#comments"
				}
			]
		},
		"try-catch-finally": {
			"patterns": [
				{
					"begin": "\\btry\\b",
					"beginCaptures": {
						"0": {
							"name": "keyword.control.try.java"
						}
					},
					"end": "}",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.try.end.bracket.curly.java"
						}
					},
					"name": "meta.try.java",
					"patterns": [
						{
							"begin": "\\(",
							"beginCaptures": {
								"0": {
									"name": "punctuation.section.try.resources.begin.bracket.round.java"
								}
							},
							"end": "\\)",
							"endCaptures": {
								"0": {
									"name": "punctuation.section.try.resources.end.bracket.round.java"
								}
							},
							"name": "meta.try.resources.java",
							"patterns": [
								{
									"include": "#code"
								}
							]
						},
						{
							"begin": "{",
							"beginCaptures": {
								"0": {
									"name": "punctuation.section.try.begin.bracket.curly.java"
								}
							},
							"end": "(?=})",
							"contentName": "meta.try.body.java",
							"patterns": [
								{
									"include": "#code"
								}
							]
						}
					]
				},
				{
					"begin": "\\b(catch)\\b",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.catch.java"
						}
					},
					"end": "}",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.catch.end.bracket.curly.java"
						}
					},
					"name": "meta.catch.java",
					"patterns": [
						{
							"include": "#comments"
						},
						{
							"begin": "\\(",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.parameters.begin.bracket.round.java"
								}
							},
							"end": "\\)",
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.parameters.end.bracket.round.java"
								}
							},
							"contentName": "meta.catch.parameters.java",
							"patterns": [
								{
									"include": "#comments"
								},
								{
									"include": "#storage-modifiers"
								},
								{
									"begin": "[a-zA-Z$_][\\.a-zA-Z0-9$_]*",
									"beginCaptures": {
										"0": {
											"name": "storage.type.java"
										}
									},
									"end": "(\\|)|(?=\\))",
									"endCaptures": {
										"1": {
											"name": "punctuation.catch.separator.java"
										}
									},
									"patterns": [
										{
											"include": "#comments"
										},
										{
											"match": "\\w+",
											"captures": {
												"0": {
													"name": "variable.parameter.java"
												}
											}
										}
									]
								}
							]
						},
						{
							"begin": "{",
							"beginCaptures": {
								"0": {
									"name": "punctuation.section.catch.begin.bracket.curly.java"
								}
							},
							"end": "(?=})",
							"contentName": "meta.catch.body.java",
							"patterns": [
								{
									"include": "#code"
								}
							]
						}
					]
				},
				{
					"begin": "\\bfinally\\b",
					"beginCaptures": {
						"0": {
							"name": "keyword.control.finally.java"
						}
					},
					"end": "}",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.finally.end.bracket.curly.java"
						}
					},
					"name": "meta.finally.java",
					"patterns": [
						{
							"begin": "{",
							"beginCaptures": {
								"0": {
									"name": "punctuation.section.finally.begin.bracket.curly.java"
								}
							},
							"end": "(?=})",
							"contentName": "meta.finally.body.java",
							"patterns": [
								{
									"include": "#code"
								}
							]
						}
					]
				}
			]
		},
		"variables": {
			"begin": "(?x)\n(?=\n  \\b\n  (\n    (void|boolean|byte|char|short|int|float|long|double)\n    |\n    (?>(\\w+\\.)*[A-Z_]+\\w*) # e.g. `javax.ws.rs.Response`, or `String`\n  )\n  \\b\n  \\s*\n  (\n    <[\\w<>,\\.?\\s\\[\\]]*> # e.g. `HashMap<Integer, String>`, or `List<java.lang.String>`\n  )?\n  \\s*\n  (\n    (\\[\\])* # int[][]\n  )?\n  \\s+\n  [A-Za-z_$][\\w$]* # At least one identifier after space\n  ([\\w\\[\\],$][\\w\\[\\],\\s]*)? # possibly primitive array or additional identifiers\n  \\s*(=|:|;)\n)",
			"end": "(?=\\=|:|;)",
			"name": "meta.definition.variable.java",
			"patterns": [
				{
					"match": "([A-Za-z$_][\\w$]*)(?=\\s*(\\[\\])*\\s*(;|:|=|,))",
					"captures": {
						"1": {
							"name": "variable.other.definition.java"
						}
					}
				},
				{
					"include": "#all-types"
				},
				{
					"include": "#code"
				}
			]
		},
		"variables-local": {
			"begin": "(?=\\b(var)\\b\\s+[A-Za-z_$][\\w$]*\\s*(=|:|;))",
			"end": "(?=\\=|:|;)",
			"name": "meta.definition.variable.local.java",
			"patterns": [
				{
					"match": "\\bvar\\b",
					"name": "storage.type.local.java"
				},
				{
					"match": "([A-Za-z$_][\\w$]*)(?=\\s*(\\[\\])*\\s*(=|:|;))",
					"captures": {
						"1": {
							"name": "variable.other.definition.java"
						}
					}
				},
				{
					"include": "#code"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/javascript/.vscodeignore]---
Location: vscode-main/extensions/javascript/.vscodeignore

```text
test/**
src/**/*.ts
syntaxes/Readme.md
tsconfig.json
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/javascript/cgmanifest.json]---
Location: vscode-main/extensions/javascript/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "microsoft/TypeScript-TmLanguage",
					"repositoryUrl": "https://github.com/microsoft/TypeScript-TmLanguage",
					"commitHash": "3133e3d914db9a2bb8812119f9273727a305f16b"
				}
			},
			"license": "MIT",
			"version": "0.0.1",
			"description": "The file syntaxes/JavaScript.tmLanguage.json was derived from TypeScriptReact.tmLanguage in https://github.com/microsoft/TypeScript-TmLanguage."
		},
		{
			"component": {
				"type": "git",
				"git": {
					"name": "textmate/javascript.tmbundle",
					"repositoryUrl": "https://github.com/textmate/javascript.tmbundle",
					"commitHash": "fccf0af0c95430a42e1bf98f0c7a4723a53283e7"
				}
			},
			"licenseDetail": [
				"Copyright (c) textmate-javascript.tmbundle project authors",
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

---[FILE: extensions/javascript/javascript-language-configuration.json]---
Location: vscode-main/extensions/javascript/javascript-language-configuration.json

```json
{
	// Note that this file should stay in sync with 'typescript-language-basics/language-configuration.json'
	"comments": {
		"lineComment": "//",
		"blockComment": [
			"/*",
			"*/"
		]
	},
	"brackets": [
		[
			"${",
			"}"
		],
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
			"open": "`",
			"close": "`",
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
		],
		[
			"<",
			">"
		]
	],
	"autoCloseBefore": ";:.,=}])>` \n\t",
	"folding": {
		"markers": {
			"start": "^\\s*//\\s*#?region\\b",
			"end": "^\\s*//\\s*#?endregion\\b"
		}
	},
	"wordPattern": {
		"pattern": "(-?\\d*\\.\\d\\w*)|([^\\`\\~\\@\\!\\%\\^\\&\\*\\(\\)\\-\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\'\\\"\\,\\.\\<\\>/\\?\\s]+)",
	},
	"indentationRules": {
		"decreaseIndentPattern": {
			"pattern": "^\\s*[\\}\\]\\)].*$"
		},
		"increaseIndentPattern": {
			"pattern": "^.*(\\{[^}]*|\\([^)]*|\\[[^\\]]*)$"
		},
		// e.g.  * ...| or */| or *-----*/|
		"unIndentedLinePattern": {
			"pattern": "^(\\t|[ ])*[ ]\\*[^/]*\\*/\\s*$|^(\\t|[ ])*[ ]\\*/\\s*$|^(\\t|[ ])*[ ]\\*([ ]([^\\*]|\\*(?!/))*)?$"
		},
		"indentNextLinePattern": {
			"pattern": "^((.*=>\\s*)|((.*[^\\w]+|\\s*)((if|while|for)\\s*\\(.*\\)\\s*|else\\s*)))$"
		}
	},
	"onEnterRules": [
		{
			// e.g. /** | */
			"beforeText": {
				"pattern": "^\\s*/\\*\\*(?!/)([^\\*]|\\*(?!/))*$"
			},
			"afterText": {
				"pattern": "^\\s*\\*/$"
			},
			"action": {
				"indent": "indentOutdent",
				"appendText": " * "
			}
		},
		{
			// e.g. /** ...|
			"beforeText": {
				"pattern": "^\\s*/\\*\\*(?!/)([^\\*]|\\*(?!/))*$"
			},
			"action": {
				"indent": "none",
				"appendText": " * "
			}
		},
		{
			// e.g.  * ...|
			"beforeText": {
				"pattern": "^(\\t|[ ])*[ ]\\*([ ]([^\\*]|\\*(?!/))*)?$"
			},
			"previousLineText": {
				"pattern": "(?=^(\\s*(/\\*\\*|\\*)).*)(?=(?!(\\s*\\*/)))"
			},
			"action": {
				"indent": "none",
				"appendText": "* "
			}
		},
		{
			// e.g.  */|
			"beforeText": {
				"pattern": "^(\\t|[ ])*[ ]\\*/\\s*$"
			},
			"action": {
				"indent": "none",
				"removeText": 1
			},
		},
		{
			// e.g.  *-----*/|
			"beforeText": {
				"pattern": "^(\\t|[ ])*[ ]\\*[^/]*\\*/\\s*$"
			},
			"action": {
				"indent": "none",
				"removeText": 1
			},
		},
		{
			"beforeText": {
				"pattern": "^\\s*(\\bcase\\s.+:|\\bdefault:)$"
			},
			"afterText": {
				"pattern": "^(?!\\s*(\\bcase\\b|\\bdefault\\b))"
			},
			"action": {
				"indent": "indent"
			}
		},
		{
			// Decrease indentation after single line if/else if/else, for, or while
			"previousLineText": "^\\s*(((else ?)?if|for|while)\\s*\\(.*\\)\\s*|else\\s*)$",
			// But make sure line doesn't have braces or is not another if statement
			"beforeText": "^\\s+([^{i\\s]|i(?!f\\b))",
			"action": {
				"indent": "outdent"
			}
		},
		// Indent when pressing enter from inside ()
		{
			"beforeText": "^.*\\([^\\)]*$",
			"afterText": "^\\s*\\).*$",
			"action": {
				"indent": "indentOutdent",
				"appendText": "\t",
			}
		},
		// Indent when pressing enter from inside {}
		{
			"beforeText": "^.*\\{[^\\}]*$",
			"afterText": "^\\s*\\}.*$",
			"action": {
				"indent": "indentOutdent",
				"appendText": "\t",
			}
		},
		// Indent when pressing enter from inside []
		{
			"beforeText": "^.*\\[[^\\]]*$",
			"afterText": "^\\s*\\].*$",
			"action": {
				"indent": "indentOutdent",
				"appendText": "\t",
			}
		},
		// Add // when pressing enter from inside line comment
		{
			"beforeText": "(?<!\\\\|\\w:)\/\/\\s*\\S",
			"afterText": "^(?!\\s*$).+",
			"action": {
				"indent": "none",
				"appendText": "// "
			}
		},
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/javascript/package.json]---
Location: vscode-main/extensions/javascript/package.json

```json
{
  "name": "javascript",
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
    "configurationDefaults": {
      "[javascript]": {
        "editor.maxTokenizationLineLength": 2500
      }
    },
    "languages": [
      {
        "id": "javascriptreact",
        "aliases": [
          "JavaScript JSX",
          "JavaScript React",
          "jsx"
        ],
        "extensions": [
          ".jsx"
        ],
        "configuration": "./javascript-language-configuration.json"
      },
      {
        "id": "javascript",
        "aliases": [
          "JavaScript",
          "javascript",
          "js"
        ],
        "extensions": [
          ".js",
          ".es6",
          ".mjs",
          ".cjs",
          ".pac"
        ],
        "filenames": [
          "jakefile"
        ],
        "firstLine": "^#!.*\\bnode",
        "mimetypes": [
          "text/javascript"
        ],
        "configuration": "./javascript-language-configuration.json"
      },
      {
        "id": "jsx-tags",
        "aliases": [],
        "configuration": "./tags-language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "javascriptreact",
        "scopeName": "source.js.jsx",
        "path": "./syntaxes/JavaScriptReact.tmLanguage.json",
        "embeddedLanguages": {
          "meta.tag.js": "jsx-tags",
          "meta.tag.without-attributes.js": "jsx-tags",
          "meta.tag.attributes.js.jsx": "javascriptreact",
          "meta.embedded.expression.js": "javascriptreact"
        },
        "tokenTypes": {
          "punctuation.definition.template-expression": "other",
          "entity.name.type.instance.jsdoc": "other",
          "entity.name.function.tagged-template": "other",
          "meta.import string.quoted": "other",
          "variable.other.jsdoc": "other"
        }
      },
      {
        "language": "javascript",
        "scopeName": "source.js",
        "path": "./syntaxes/JavaScript.tmLanguage.json",
        "embeddedLanguages": {
          "meta.tag.js": "jsx-tags",
          "meta.tag.without-attributes.js": "jsx-tags",
          "meta.tag.attributes.js": "javascript",
          "meta.embedded.expression.js": "javascript"
        },
        "tokenTypes": {
          "punctuation.definition.template-expression": "other",
          "entity.name.type.instance.jsdoc": "other",
          "entity.name.function.tagged-template": "other",
          "meta.import string.quoted": "other",
          "variable.other.jsdoc": "other"
        }
      },
      {
        "scopeName": "source.js.regexp",
        "path": "./syntaxes/Regular Expressions (JavaScript).tmLanguage"
      }
    ],
    "semanticTokenScopes": [
      {
        "language": "javascript",
        "scopes": {
          "property": [
            "variable.other.property.js"
          ],
          "property.readonly": [
            "variable.other.constant.property.js"
          ],
          "variable": [
            "variable.other.readwrite.js"
          ],
          "variable.readonly": [
            "variable.other.constant.object.js"
          ],
          "function": [
            "entity.name.function.js"
          ],
          "namespace": [
            "entity.name.type.module.js"
          ],
          "variable.defaultLibrary": [
            "support.variable.js"
          ],
          "function.defaultLibrary": [
            "support.function.js"
          ]
        }
      },
      {
        "language": "javascriptreact",
        "scopes": {
          "property": [
            "variable.other.property.jsx"
          ],
          "property.readonly": [
            "variable.other.constant.property.jsx"
          ],
          "variable": [
            "variable.other.readwrite.jsx"
          ],
          "variable.readonly": [
            "variable.other.constant.object.jsx"
          ],
          "function": [
            "entity.name.function.jsx"
          ],
          "namespace": [
            "entity.name.type.module.jsx"
          ],
          "variable.defaultLibrary": [
            "support.variable.js"
          ],
          "function.defaultLibrary": [
            "support.function.js"
          ]
        }
      }
    ],
    "snippets": [
      {
        "language": "javascript",
        "path": "./snippets/javascript.code-snippets"
      },
      {
        "language": "javascriptreact",
        "path": "./snippets/javascript.code-snippets"
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

---[FILE: extensions/javascript/package.nls.json]---
Location: vscode-main/extensions/javascript/package.nls.json

```json
{
	"displayName": "JavaScript Language Basics",
	"description": "Provides snippets, syntax highlighting, bracket matching and folding in JavaScript files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/javascript/tags-language-configuration.json]---
Location: vscode-main/extensions/javascript/tags-language-configuration.json

```json
{
	"comments": {
		"blockComment": [
			"{/*",
			"*/}"
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
		],
		[
			"<",
			">"
		]
	],
	"colorizedBracketPairs": [
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
			"<",
			">"
		],
		[
			"'",
			"'"
		],
		[
			"\"",
			"\""
		]
	],
	"wordPattern": {
		"pattern": "(-?\\d*\\.\\d\\w*)|([^\\`\\~\\!\\@\\$\\^\\&\\*\\(\\)\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:'\"\\,\\.\\<\\>\\/\\s]+)"
	},
	"onEnterRules": [
		{
			"beforeText": {
				"pattern": "<(?!(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr))([_:\\w][_:\\w\\-.\\d]*)([^/>]*(?!/)>)[^<]*$",
				"flags": "i"
			},
			"afterText": {
				"pattern": "^<\\/([_:\\w][_:\\w-.\\d]*)\\s*>$",
				"flags": "i"
			},
			"action": {
				"indent": "indentOutdent"
			}
		},
		{
			"beforeText": {
				"pattern": "<(?!(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr))([_:\\w][_:\\w\\-.\\d]*)([^/>]*(?!/)>)[^<]*$",
				"flags": "i"
			},
			"action": {
				"indent": "indent"
			}
		},
		{
			// `beforeText` only applies to tokens of a given language. Since we are dealing with jsx-tags,
			// make sure we apply to the closing `>` of a tag so that mixed language spans
			// such as `<div onclick={1}>` are handled properly.
			"beforeText": {
				"pattern": "^>$"
			},
			"afterText": {
				"pattern": "^<\\/([_:\\w][_:\\w-.\\d]*)\\s*>$",
				"flags": "i"
			},
			"action": {
				"indent": "indentOutdent"
			}
		},
		{
			"beforeText": {
				"pattern": "^>$"
			},
			"action": {
				"indent": "indent"
			}
		}
	],
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/javascript/snippets/javascript.code-snippets]---
Location: vscode-main/extensions/javascript/snippets/javascript.code-snippets

```text
{
	"Constructor": {
		"prefix": "ctor",
		"body": [
			"/**",
			" *",
			" */",
			"constructor() {",
			"\tsuper();",
			"\t$0",
			"}"
		],
		"description": "Constructor"
	},
	"Class Definition": {
		"prefix": "class",
		"isFileTemplate": true,
		"body": [
			"class ${1:name} {",
			"\tconstructor(${2:parameters}) {",
			"\t\t$0",
			"\t}",
			"}"
		],
		"description": "Class Definition"
	},
	"Method Definition": {
		"prefix": "method",
		"body": [
			"/**",
			" * ",
			" */",
			"${1:name}() {",
			"\t$0",
			"}"
		],
		"description": "Method Definition"
	},
	"Import Statement": {
		"prefix": "import",
		"body": [
			"import { $0 } from \"${1:module}\";"
		],
		"description": "Import external module"
	},
	"Log to the console": {
		"prefix": "log",
		"body": [
			"console.log($1);",
			"$0"
		],
		"description": "Log to the console"
	},
	"Log warning to console": {
		"prefix": "warn",
		"body": [
			"console.warn($1);",
			"$0"
		],
		"description": "Log warning to the console"
	},
	"Log error to console": {
		"prefix": "error",
		"body": [
			"console.error($1);",
			"$0"
		],
		"description": "Log error to the console"
	},
	"Throw Exception": {
		"prefix": "throw",
		"body": [
			"throw new Error(\"$1\");",
			"$0"
		],
		"description": "Throw Exception"
	},
	"For Loop": {
		"prefix": "for",
		"body": [
			"for (let ${1:index} = 0; ${1:index} < ${2:array}.length; ${1:index}++) {",
			"\tconst ${3:element} = ${2:array}[${1:index}];",
			"\t$TM_SELECTED_TEXT$0",
			"}"
		],
		"description": "For Loop"
	},
	"For-Each Loop using =>": {
		"prefix": "foreach =>",
		"body": [
			"${1:array}.forEach(${2:element} => {",
			"\t$TM_SELECTED_TEXT$0",
			"});"
		],
		"description": "For-Each Loop using =>"
	},
	"For-In Loop": {
		"prefix": "forin",
		"body": [
			"for (const ${1:key} in ${2:object}) {",
			"\tif (!Object.hasOwn(${2:object}, ${1:key})) continue;",
			"\t",
			"\tconst ${3:element} = ${2:object}[${1:key}];",
			"\t",
			"\t$TM_SELECTED_TEXT$0",
			"}"
		],
		"description": "For-In Loop"
	},
	"For-Of Loop": {
		"prefix": "forof",
		"body": [
			"for (const ${1:element} of ${2:object}) {",
			"\t$TM_SELECTED_TEXT$0",
			"}"
		],
		"description": "For-Of Loop"
	},
	"For-Await-Of Loop": {
		"prefix": "forawaitof",
		"body": [
			"for await (const ${1:element} of ${2:object}) {",
			"\t$TM_SELECTED_TEXT$0",
			"}"
		],
		"description": "For-Await-Of Loop"
	},
	"Function Statement": {
		"prefix": "function",
		"body": [
			"function ${1:name}(${2:params}) {",
			"\t$TM_SELECTED_TEXT$0",
			"}"
		],
		"description": "Function Statement"
	},
	"If Statement": {
		"prefix": "if",
		"body": [
			"if (${1:condition}) {",
			"\t$TM_SELECTED_TEXT$0",
			"}"
		],
		"description": "If Statement"
	},
	"If-Else Statement": {
		"prefix": "ifelse",
		"body": [
			"if (${1:condition}) {",
			"\t$TM_SELECTED_TEXT$0",
			"} else {",
			"\t",
			"}"
		],
		"description": "If-Else Statement"
	},
	"New Statement": {
		"prefix": "new",
		"body": [
			"const ${1:name} = new ${2:type}(${3:arguments});$0"
		],
		"description": "New Statement"
	},
	"Switch Statement": {
		"prefix": "switch",
		"body": [
			"switch (${1:key}) {",
			"\tcase ${2:value}:",
			"\t\t$0",
			"\t\tbreak;",
			"",
			"\tdefault:",
			"\t\tbreak;",
			"}"
		],
		"description": "Switch Statement"
	},
	"While Statement": {
		"prefix": "while",
		"body": [
			"while (${1:condition}) {",
			"\t$TM_SELECTED_TEXT$0",
			"}"
		],
		"description": "While Statement"
	},
	"Do-While Statement": {
		"prefix": "dowhile",
		"body": [
			"do {",
			"\t$TM_SELECTED_TEXT$0",
			"} while (${1:condition});"
		],
		"description": "Do-While Statement"
	},
	"Try-Catch Statement": {
		"prefix": "trycatch",
		"body": [
			"try {",
			"\t$TM_SELECTED_TEXT$0",
			"} catch (${1:error}) {",
			"\t",
			"}"
		],
		"description": "Try-Catch Statement"
	},
	"Set Timeout Function": {
		"prefix": "settimeout",
		"body": [
			"setTimeout(() => {",
			"\t$TM_SELECTED_TEXT$0",
			"}, ${1:timeout});"
		],
		"description": "Set Timeout Function"
	},
	"Set Interval Function": {
		"prefix": "setinterval",
		"body": [
			"setInterval(() => {",
			"\t$TM_SELECTED_TEXT$0",
			"}, ${1:interval});"
		],
		"description": "Set Interval Function"
	},
	"Region Start": {
		"prefix": "#region",
		"body": [
			"//#region $0"
		],
		"description": "Folding Region Start"
	},
	"Region End": {
		"prefix": "#endregion",
		"body": [
			"//#endregion"
		],
		"description": "Folding Region End"
	},
	"new Promise": {
		"prefix": "newpromise",
		"body": [
			"new Promise((resolve, reject) => {",
			"\t$TM_SELECTED_TEXT$0",
			"})"
		],
		"description": "Create a new Promise"
	},
	"Async Function Statement": {
		"prefix": "async function",
		"body": [
			"async function ${1:name}(${2:params}) {",
			"\t$TM_SELECTED_TEXT$0",
			"}"
		],
		"description": "Async Function Statement"
	},
	"Async Function Expression": {
		"prefix": "async arrow function",
		"body": [
			"async (${1:params}) => {",
			"\t$TM_SELECTED_TEXT$0",
			"}"
		],
		"description": "Async Function Expression"
	}
}
```

--------------------------------------------------------------------------------

````
