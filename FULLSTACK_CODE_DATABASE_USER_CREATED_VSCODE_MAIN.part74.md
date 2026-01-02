---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 74
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 74 of 552)

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

---[FILE: extensions/razor/syntaxes/cshtml.tmLanguage.json]---
Location: vscode-main/extensions/razor/syntaxes/cshtml.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/dotnet/razor/blob/master/src/Razor/src/Microsoft.VisualStudio.RazorExtension/EmbeddedGrammars/aspnetcorerazor.tmLanguage.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/dotnet/razor/commit/9b1e979b6c3fe7cfbe30f595b9b0994d20bd482c",
	"name": "ASP.NET Razor",
	"scopeName": "text.html.cshtml",
	"injections": {
		"string.quoted.double.html": {
			"patterns": [
				{
					"include": "#explicit-razor-expression"
				},
				{
					"include": "#implicit-expression"
				}
			]
		},
		"string.quoted.single.html": {
			"patterns": [
				{
					"include": "#explicit-razor-expression"
				},
				{
					"include": "#implicit-expression"
				}
			]
		}
	},
	"patterns": [
		{
			"include": "#razor-control-structures"
		},
		{
			"include": "text.html.derivative"
		}
	],
	"repository": {
		"razor-control-structures": {
			"patterns": [
				{
					"include": "#razor-comment"
				},
				{
					"include": "#razor-codeblock"
				},
				{
					"include": "#explicit-razor-expression"
				},
				{
					"include": "#escaped-transition"
				},
				{
					"include": "#directives"
				},
				{
					"include": "#transitioned-csharp-control-structures"
				},
				{
					"include": "#implicit-expression"
				}
			]
		},
		"optionally-transitioned-razor-control-structures": {
			"patterns": [
				{
					"include": "#razor-comment"
				},
				{
					"include": "#razor-codeblock"
				},
				{
					"include": "#explicit-razor-expression"
				},
				{
					"include": "#escaped-transition"
				},
				{
					"include": "#directives"
				},
				{
					"include": "#optionally-transitioned-csharp-control-structures"
				},
				{
					"include": "#implicit-expression"
				}
			]
		},
		"escaped-transition": {
			"name": "constant.character.escape.razor.transition",
			"match": "@@"
		},
		"transition": {
			"match": "@",
			"name": "keyword.control.cshtml.transition"
		},
		"razor-codeblock": {
			"name": "meta.structure.razor.codeblock",
			"begin": "(@)(\\{)",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.razor.directive.codeblock.open"
				}
			},
			"contentName": "source.cs",
			"patterns": [
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(\\})",
			"endCaptures": {
				"1": {
					"name": "keyword.control.razor.directive.codeblock.close"
				}
			}
		},
		"razor-codeblock-body": {
			"patterns": [
				{
					"include": "#text-tag"
				},
				{
					"include": "#wellformed-html"
				},
				{
					"include": "#razor-single-line-markup"
				},
				{
					"include": "#optionally-transitioned-razor-control-structures"
				},
				{
					"include": "source.cs"
				}
			]
		},
		"razor-single-line-markup": {
			"match": "(\\@\\:)([^$]*)$",
			"captures": {
				"1": {
					"name": "keyword.control.razor.singleLineMarkup"
				},
				"2": {
					"patterns": [
						{
							"include": "#razor-control-structures"
						},
						{
							"include": "text.html.derivative"
						}
					]
				}
			}
		},
		"text-tag": {
			"begin": "(<text\\s*>)",
			"beginCaptures": {
				"1": {
					"name": "keyword.control.cshtml.transition.textTag.open"
				}
			},
			"patterns": [
				{
					"include": "#wellformed-html"
				},
				{
					"include": "$self"
				}
			],
			"end": "(</text>)",
			"endCaptures": {
				"1": {
					"name": "keyword.control.cshtml.transition.textTag.close"
				}
			}
		},
		"razor-comment": {
			"name": "meta.comment.razor",
			"begin": "(@)(\\*)",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.razor.comment.star"
				}
			},
			"contentName": "comment.block.razor",
			"end": "(\\*)(@)",
			"endCaptures": {
				"1": {
					"name": "keyword.control.razor.comment.star"
				},
				"2": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				}
			}
		},
		"wellformed-html": {
			"patterns": [
				{
					"include": "#void-tag"
				},
				{
					"include": "#non-void-tag"
				}
			]
		},
		"void-tag": {
			"name": "meta.tag.structure.$3.void.html",
			"begin": "(?i)(<)(!)?(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)(?=\\s|/?>)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.tag.begin.html"
				},
				"2": {
					"name": "constant.character.escape.razor.tagHelperOptOut"
				},
				"3": {
					"name": "entity.name.tag.html"
				}
			},
			"patterns": [
				{
					"include": "text.html.derivative"
				}
			],
			"end": "/?>",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.tag.end.html"
				}
			}
		},
		"non-void-tag": {
			"begin": "(?=<(!)?([^/\\s>]+)(\\s|/?>))",
			"end": "(</)(\\2)\\s*(>)|(/>)",
			"endCaptures": {
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
			"patterns": [
				{
					"begin": "(<)(!)?([^/\\s>]+)(?=\\s|/?>)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.tag.begin.html"
						},
						"2": {
							"name": "constant.character.escape.razor.tagHelperOptOut"
						},
						"3": {
							"name": "entity.name.tag.html"
						}
					},
					"end": "(?=/?>)",
					"patterns": [
						{
							"include": "#razor-control-structures"
						},
						{
							"include": "text.html.derivative"
						}
					]
				},
				{
					"begin": ">",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.tag.end.html"
						}
					},
					"end": "(?=</)",
					"patterns": [
						{
							"include": "#wellformed-html"
						},
						{
							"include": "$self"
						}
					]
				}
			]
		},
		"explicit-razor-expression": {
			"name": "meta.expression.explicit.cshtml",
			"begin": "(@)\\(",
			"beginCaptures": {
				"0": {
					"name": "keyword.control.cshtml"
				},
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				}
			},
			"patterns": [
				{
					"include": "source.cs#expression"
				}
			],
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "keyword.control.cshtml"
				}
			}
		},
		"implicit-expression": {
			"name": "meta.expression.implicit.cshtml",
			"contentName": "source.cs",
			"begin": "(?<![[:alpha:][:alnum:]])(@)",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				}
			},
			"patterns": [
				{
					"include": "#await-prefix"
				},
				{
					"include": "#implicit-expression-body"
				}
			],
			"end": "(?=[\\s<>\\{\\}\\)\\]'\"])"
		},
		"implicit-expression-body": {
			"patterns": [
				{
					"include": "#implicit-expression-invocation-start"
				},
				{
					"include": "#implicit-expression-accessor-start"
				}
			],
			"end": "(?=[\\s<>\\{\\}\\)\\]'\"])"
		},
		"implicit-expression-invocation-start": {
			"begin": "([_[:alpha:]][_[:alnum:]]*)(?=\\()",
			"beginCaptures": {
				"1": {
					"name": "entity.name.function.cs"
				}
			},
			"patterns": [
				{
					"include": "#implicit-expression-continuation"
				}
			],
			"end": "(?=[\\s<>\\{\\}\\)\\]'\"])"
		},
		"implicit-expression-accessor-start": {
			"begin": "([_[:alpha:]][_[:alnum:]]*)",
			"beginCaptures": {
				"1": {
					"name": "variable.other.object.cs"
				}
			},
			"patterns": [
				{
					"include": "#implicit-expression-continuation"
				}
			],
			"end": "(?=[\\s<>\\{\\}\\)\\]'\"])"
		},
		"implicit-expression-continuation": {
			"patterns": [
				{
					"include": "#balanced-parenthesis-csharp"
				},
				{
					"include": "#balanced-brackets-csharp"
				},
				{
					"include": "#implicit-expression-invocation"
				},
				{
					"include": "#implicit-expression-accessor"
				},
				{
					"include": "#implicit-expression-extension"
				}
			],
			"end": "(?=[\\s<>\\{\\}\\)\\]'\"])"
		},
		"implicit-expression-accessor": {
			"match": "(?<=\\.)[_[:alpha:]][_[:alnum:]]*",
			"name": "variable.other.object.property.cs"
		},
		"implicit-expression-invocation": {
			"match": "(?<=\\.)[_[:alpha:]][_[:alnum:]]*(?=\\()",
			"name": "entity.name.function.cs"
		},
		"implicit-expression-operator": {
			"patterns": [
				{
					"include": "#implicit-expression-dot-operator"
				},
				{
					"include": "#implicit-expression-null-conditional-operator"
				},
				{
					"include": "#implicit-expression-null-forgiveness-operator"
				}
			]
		},
		"implicit-expression-dot-operator": {
			"match": "(\\.)(?=[_[:alpha:]][_[:alnum:]]*)",
			"captures": {
				"1": {
					"name": "punctuation.accessor.cs"
				}
			}
		},
		"implicit-expression-null-conditional-operator": {
			"match": "(\\?)(?=[.\\[])",
			"captures": {
				"1": {
					"name": "keyword.operator.null-conditional.cs"
				}
			}
		},
		"implicit-expression-null-forgiveness-operator": {
			"match": "(\\!)(?=(?:\\.[_[:alpha:]][_[:alnum:]]*)|\\?|[\\[\\(])",
			"captures": {
				"1": {
					"name": "keyword.operator.logical.cs"
				}
			}
		},
		"balanced-parenthesis-csharp": {
			"begin": "(\\()",
			"beginCaptures": {
				"1": {
					"name": "punctuation.parenthesis.open.cs"
				}
			},
			"name": "razor.test.balanced.parenthesis",
			"patterns": [
				{
					"include": "source.cs"
				}
			],
			"end": "(\\))",
			"endCaptures": {
				"1": {
					"name": "punctuation.parenthesis.close.cs"
				}
			}
		},
		"balanced-brackets-csharp": {
			"begin": "(\\[)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.squarebracket.open.cs"
				}
			},
			"name": "razor.test.balanced.brackets",
			"patterns": [
				{
					"include": "source.cs"
				}
			],
			"end": "(\\])",
			"endCaptures": {
				"1": {
					"name": "punctuation.squarebracket.close.cs"
				}
			}
		},
		"directives": {
			"patterns": [
				{
					"include": "#code-directive"
				},
				{
					"include": "#functions-directive"
				},
				{
					"include": "#page-directive"
				},
				{
					"include": "#addTagHelper-directive"
				},
				{
					"include": "#removeTagHelper-directive"
				},
				{
					"include": "#tagHelperPrefix-directive"
				},
				{
					"include": "#model-directive"
				},
				{
					"include": "#inherits-directive"
				},
				{
					"include": "#implements-directive"
				},
				{
					"include": "#namespace-directive"
				},
				{
					"include": "#inject-directive"
				},
				{
					"include": "#attribute-directive"
				},
				{
					"include": "#section-directive"
				},
				{
					"include": "#layout-directive"
				},
				{
					"include": "#using-directive"
				},
				{
					"include": "#rendermode-directive"
				},
				{
					"include": "#preservewhitespace-directive"
				},
				{
					"include": "#typeparam-directive"
				}
			]
		},
		"code-directive": {
			"begin": "(@)(code)((?=\\{)|\\s+)",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.razor.directive.code"
				}
			},
			"patterns": [
				{
					"include": "#directive-codeblock"
				}
			],
			"end": "(?<=})|\\s"
		},
		"functions-directive": {
			"begin": "(@)(functions)((?=\\{)|\\s+)",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.razor.directive.functions"
				}
			},
			"patterns": [
				{
					"include": "#directive-codeblock"
				}
			],
			"end": "(?<=})|\\s"
		},
		"directive-codeblock": {
			"begin": "(\\{)",
			"beginCaptures": {
				"1": {
					"name": "keyword.control.razor.directive.codeblock.open"
				}
			},
			"name": "meta.structure.razor.directive.codeblock",
			"contentName": "source.cs",
			"patterns": [
				{
					"include": "source.cs#class-or-struct-members"
				}
			],
			"end": "(\\})",
			"endCaptures": {
				"1": {
					"name": "keyword.control.razor.directive.codeblock.close"
				}
			}
		},
		"page-directive": {
			"name": "meta.directive",
			"match": "(@)(page)\\s+([^$]+)?",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.razor.directive.page"
				},
				"3": {
					"patterns": [
						{
							"include": "source.cs#string-literal"
						}
					]
				}
			}
		},
		"addTagHelper-directive": {
			"name": "meta.directive",
			"match": "(@)(addTagHelper)\\s+([^$]+)?",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.razor.directive.addTagHelper"
				},
				"3": {
					"patterns": [
						{
							"include": "#tagHelper-directive-argument"
						}
					]
				}
			}
		},
		"removeTagHelper-directive": {
			"name": "meta.directive",
			"match": "(@)(removeTagHelper)\\s+([^$]+)?",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.razor.directive.removeTagHelper"
				},
				"3": {
					"patterns": [
						{
							"include": "#tagHelper-directive-argument"
						}
					]
				}
			}
		},
		"tagHelperPrefix-directive": {
			"name": "meta.directive",
			"match": "(@)(tagHelperPrefix)\\s+([^$]+)?",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.razor.directive.tagHelperPrefix"
				},
				"3": {
					"patterns": [
						{
							"include": "#tagHelper-directive-argument"
						}
					]
				}
			}
		},
		"tagHelper-directive-argument": {
			"patterns": [
				{
					"include": "source.cs#string-literal"
				},
				{
					"include": "#unquoted-string-argument"
				}
			]
		},
		"unquoted-string-argument": {
			"name": "string.quoted.double.cs",
			"match": "[^$]+"
		},
		"model-directive": {
			"name": "meta.directive",
			"match": "(@)(model)\\s+([^$]+)?",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.razor.directive.model"
				},
				"3": {
					"patterns": [
						{
							"include": "source.cs#type"
						}
					]
				}
			}
		},
		"inherits-directive": {
			"name": "meta.directive",
			"match": "(@)(inherits)\\s+([^$]+)?",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.razor.directive.inherits"
				},
				"3": {
					"patterns": [
						{
							"include": "source.cs#type"
						}
					]
				}
			}
		},
		"implements-directive": {
			"name": "meta.directive",
			"match": "(@)(implements)\\s+([^$]+)?",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.razor.directive.implements"
				},
				"3": {
					"patterns": [
						{
							"include": "source.cs#type"
						}
					]
				}
			}
		},
		"layout-directive": {
			"name": "meta.directive",
			"match": "(@)(layout)\\s+([^$]+)?",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.razor.directive.layout"
				},
				"3": {
					"patterns": [
						{
							"include": "source.cs#type"
						}
					]
				}
			}
		},
		"namespace-directive": {
			"name": "meta.directive",
			"match": "(@)(namespace)\\s+([^\\s]+)?",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.razor.directive.namespace"
				},
				"3": {
					"patterns": [
						{
							"include": "#namespace-directive-argument"
						}
					]
				}
			}
		},
		"namespace-directive-argument": {
			"match": "([_[:alpha:]][_[:alnum:]]*)(\\.)?",
			"captures": {
				"1": {
					"name": "entity.name.type.namespace.cs"
				},
				"2": {
					"name": "punctuation.accessor.cs"
				}
			}
		},
		"inject-directive": {
			"name": "meta.directive",
			"match": "(@)(inject)\\s*([\\S\\s]+?)?\\s*([_[:alpha:]][_[:alnum:]]*)?\\s*(?=$)",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.razor.directive.inject"
				},
				"3": {
					"patterns": [
						{
							"include": "source.cs#type"
						}
					]
				},
				"4": {
					"name": "entity.name.variable.property.cs"
				}
			}
		},
		"rendermode-directive": {
			"name": "meta.directive",
			"match": "(@)(rendermode)\\s+([^$]+)?",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.razor.directive.rendermode"
				},
				"3": {
					"patterns": [
						{
							"include": "source.cs#type"
						}
					]
				}
			}
		},
		"preservewhitespace-directive": {
			"name": "meta.directive",
			"match": "(@)(preservewhitespace)\\s+([^$]+)?",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.razor.directive.preservewhitespace"
				},
				"3": {
					"patterns": [
						{
							"include": "source.cs#boolean-literal"
						}
					]
				}
			}
		},
		"typeparam-directive": {
			"name": "meta.directive",
			"match": "(@)(typeparam)\\s+([^$]+)?",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.razor.directive.typeparam"
				},
				"3": {
					"patterns": [
						{
							"include": "source.cs#type"
						}
					]
				}
			}
		},
		"attribute-directive": {
			"name": "meta.directive",
			"begin": "(@)(attribute)\\b\\s+",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.razor.directive.attribute"
				}
			},
			"patterns": [
				{
					"include": "source.cs#attribute-section"
				}
			],
			"end": "(?<=\\])|$"
		},
		"section-directive": {
			"name": "meta.directive.block",
			"begin": "(@)(section)\\b\\s+([_[:alpha:]][_[:alnum:]]*)?",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.razor.directive.section"
				},
				"3": {
					"name": "variable.other.razor.directive.sectionName"
				}
			},
			"patterns": [
				{
					"include": "#directive-markupblock"
				}
			],
			"end": "(?<=})"
		},
		"directive-markupblock": {
			"name": "meta.structure.razor.directive.markblock",
			"begin": "(\\{)",
			"beginCaptures": {
				"1": {
					"name": "keyword.control.razor.directive.codeblock.open"
				}
			},
			"patterns": [
				{
					"include": "$self"
				}
			],
			"end": "(\\})",
			"endCaptures": {
				"1": {
					"name": "keyword.control.razor.directive.codeblock.close"
				}
			}
		},
		"using-directive": {
			"name": "meta.directive",
			"match": "(@)(using)\\b\\s+(?!\\(|\\s)(.+?)?(;)?$",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.other.using.cs"
				},
				"3": {
					"patterns": [
						{
							"include": "#using-static-directive"
						},
						{
							"include": "#using-alias-directive"
						},
						{
							"include": "#using-standard-directive"
						}
					]
				},
				"4": {
					"name": "keyword.control.razor.optionalSemicolon"
				}
			}
		},
		"using-static-directive": {
			"match": "(static)\\b\\s+(.+)",
			"captures": {
				"1": {
					"name": "keyword.other.static.cs"
				},
				"2": {
					"patterns": [
						{
							"include": "source.cs#type"
						}
					]
				}
			}
		},
		"using-alias-directive": {
			"match": "([_[:alpha:]][_[:alnum:]]*)\\b\\s*(=)\\s*(.+)\\s*",
			"captures": {
				"1": {
					"name": "entity.name.type.alias.cs"
				},
				"2": {
					"name": "keyword.operator.assignment.cs"
				},
				"3": {
					"patterns": [
						{
							"include": "source.cs#type"
						}
					]
				}
			}
		},
		"using-standard-directive": {
			"match": "([_[:alpha:]][_[:alnum:]]*)\\s*",
			"captures": {
				"1": {
					"name": "entity.name.type.namespace.cs"
				}
			}
		},
		"optionally-transitioned-csharp-control-structures": {
			"patterns": [
				{
					"include": "#using-statement-with-optional-transition"
				},
				{
					"include": "#if-statement-with-optional-transition"
				},
				{
					"include": "#else-part"
				},
				{
					"include": "#foreach-statement-with-optional-transition"
				},
				{
					"include": "#for-statement-with-optional-transition"
				},
				{
					"include": "#while-statement"
				},
				{
					"include": "#switch-statement-with-optional-transition"
				},
				{
					"include": "#lock-statement-with-optional-transition"
				},
				{
					"include": "#do-statement-with-optional-transition"
				},
				{
					"include": "#try-statement-with-optional-transition"
				}
			]
		},
		"transitioned-csharp-control-structures": {
			"patterns": [
				{
					"include": "#using-statement"
				},
				{
					"include": "#if-statement"
				},
				{
					"include": "#else-part"
				},
				{
					"include": "#foreach-statement"
				},
				{
					"include": "#for-statement"
				},
				{
					"include": "#while-statement"
				},
				{
					"include": "#switch-statement"
				},
				{
					"include": "#lock-statement"
				},
				{
					"include": "#do-statement"
				},
				{
					"include": "#try-statement"
				}
			]
		},
		"using-statement": {
			"name": "meta.statement.using.razor",
			"begin": "(?:(@))(using)\\b\\s*(?=\\()",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.other.using.cs"
				}
			},
			"patterns": [
				{
					"include": "#csharp-condition"
				},
				{
					"include": "#csharp-code-block"
				},
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(?<=})"
		},
		"using-statement-with-optional-transition": {
			"name": "meta.statement.using.razor",
			"begin": "(?:^\\s*|(@))(using)\\b\\s*(?=\\()",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.other.using.cs"
				}
			},
			"patterns": [
				{
					"include": "#csharp-condition"
				},
				{
					"include": "#csharp-code-block"
				},
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(?<=})"
		},
		"if-statement": {
			"name": "meta.statement.if.razor",
			"begin": "(?:(@))(if)\\b\\s*(?=\\()",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.conditional.if.cs"
				}
			},
			"patterns": [
				{
					"include": "#csharp-condition"
				},
				{
					"include": "#csharp-code-block"
				},
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(?<=})"
		},
		"if-statement-with-optional-transition": {
			"name": "meta.statement.if.razor",
			"begin": "(?:^\\s*|(@))(if)\\b\\s*(?=\\()",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.conditional.if.cs"
				}
			},
			"patterns": [
				{
					"include": "#csharp-condition"
				},
				{
					"include": "#csharp-code-block"
				},
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(?<=})"
		},
		"else-part": {
			"name": "meta.statement.else.razor",
			"begin": "(?:^|(?<=}))\\s*(else)\\b\\s*?(?: (if))?\\s*?(?=[\\n\\(\\{])",
			"beginCaptures": {
				"1": {
					"name": "keyword.control.conditional.else.cs"
				},
				"2": {
					"name": "keyword.control.conditional.if.cs"
				}
			},
			"patterns": [
				{
					"include": "#csharp-condition"
				},
				{
					"include": "#csharp-code-block"
				},
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(?<=})"
		},
		"for-statement": {
			"name": "meta.statement.for.razor",
			"begin": "(?:(@))(for)\\b\\s*(?=\\()",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.loop.for.cs"
				}
			},
			"patterns": [
				{
					"include": "#csharp-condition"
				},
				{
					"include": "#csharp-code-block"
				},
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(?<=})"
		},
		"for-statement-with-optional-transition": {
			"name": "meta.statement.for.razor",
			"begin": "(?:^\\s*|(@))(for)\\b\\s*(?=\\()",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.loop.for.cs"
				}
			},
			"patterns": [
				{
					"include": "#csharp-condition"
				},
				{
					"include": "#csharp-code-block"
				},
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(?<=})"
		},
		"foreach-statement": {
			"name": "meta.statement.foreach.razor",
			"begin": "(?:(@)(await\\s+)?)(foreach)\\b\\s*(?=\\()",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"patterns": [
						{
							"include": "#await-prefix"
						}
					]
				},
				"3": {
					"name": "keyword.control.loop.foreach.cs"
				}
			},
			"patterns": [
				{
					"include": "#foreach-condition"
				},
				{
					"include": "#csharp-code-block"
				},
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(?<=})"
		},
		"foreach-statement-with-optional-transition": {
			"name": "meta.statement.foreach.razor",
			"begin": "(?:^\\s*|(@)(await\\s+)?)(foreach)\\b\\s*(?=\\()",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"patterns": [
						{
							"include": "#await-prefix"
						}
					]
				},
				"3": {
					"name": "keyword.control.loop.foreach.cs"
				}
			},
			"patterns": [
				{
					"include": "#foreach-condition"
				},
				{
					"include": "#csharp-code-block"
				},
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(?<=})"
		},
		"foreach-condition": {
			"begin": "\\(",
			"beginCaptures": {
				"0": {
					"name": "punctuation.parenthesis.open.cs"
				}
			},
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "punctuation.parenthesis.close.cs"
				}
			},
			"patterns": [
				{
					"match": "(?x)\n(?:\n  (\\bvar\\b)|\n  (?<type-name>\n    (?:\n      (?:\n        (?:(?<identifier>@?[_[:alpha:]][_[:alnum:]]*)\\s*\\:\\:\\s*)? # alias-qualification\n        (?<name-and-type-args> # identifier + type arguments (if any)\n          \\g<identifier>\\s*\n          (?<type-args>\\s*<(?:[^<>]|\\g<type-args>)+>\\s*)?\n        )\n        (?:\\s*\\.\\s*\\g<name-and-type-args>)* | # Are there any more names being dotted into?\n        (?<tuple>\\s*\\((?:[^\\(\\)]|\\g<tuple>)+\\))\n      )\n      (?:\\s*\\?\\s*)? # nullable suffix?\n      (?:\\s*\\[(?:\\s*,\\s*)*\\]\\s*)* # array suffix?\n    )\n  )\n)\\s+\n(\\g<identifier>)\\s+\n\\b(in)\\b",
					"captures": {
						"1": {
							"name": "keyword.other.var.cs"
						},
						"2": {
							"patterns": [
								{
									"include": "source.cs#type"
								}
							]
						},
						"7": {
							"name": "entity.name.variable.local.cs"
						},
						"8": {
							"name": "keyword.control.loop.in.cs"
						}
					}
				},
				{
					"match": "(?x) # match foreach (var (x, y) in ...)\n(?:\\b(var)\\b\\s*)?\n(?<tuple>\\((?:[^\\(\\)]|\\g<tuple>)+\\))\\s+\n\\b(in)\\b",
					"captures": {
						"1": {
							"name": "keyword.other.var.cs"
						},
						"2": {
							"patterns": [
								{
									"include": "source.cs#tuple-declaration-deconstruction-element-list"
								}
							]
						},
						"3": {
							"name": "keyword.control.loop.in.cs"
						}
					}
				},
				{
					"include": "source.cs#expression"
				}
			]
		},
		"do-statement": {
			"name": "meta.statement.do.razor",
			"begin": "(?:(@))(do)\\b\\s",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.loop.do.cs"
				}
			},
			"patterns": [
				{
					"include": "#csharp-condition"
				},
				{
					"include": "#csharp-code-block"
				},
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(?<=})"
		},
		"do-statement-with-optional-transition": {
			"name": "meta.statement.do.razor",
			"begin": "(?:^\\s*|(@))(do)\\b\\s",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.loop.do.cs"
				}
			},
			"patterns": [
				{
					"include": "#csharp-condition"
				},
				{
					"include": "#csharp-code-block"
				},
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(?<=})"
		},
		"while-statement": {
			"name": "meta.statement.while.razor",
			"begin": "(?:(@)|^\\s*|(?<=})\\s*)(while)\\b\\s*(?=\\()",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.loop.while.cs"
				}
			},
			"patterns": [
				{
					"include": "#csharp-condition"
				},
				{
					"include": "#csharp-code-block"
				},
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(?<=})|(;)",
			"endCaptures": {
				"1": {
					"name": "punctuation.terminator.statement.cs"
				}
			}
		},
		"switch-statement": {
			"name": "meta.statement.switch.razor",
			"begin": "(?:(@))(switch)\\b\\s*(?=\\()",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.switch.cs"
				}
			},
			"patterns": [
				{
					"include": "#csharp-condition"
				},
				{
					"include": "#switch-code-block"
				},
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(?<=})"
		},
		"switch-statement-with-optional-transition": {
			"name": "meta.statement.switch.razor",
			"begin": "(?:^\\s*|(@))(switch)\\b\\s*(?=\\()",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.switch.cs"
				}
			},
			"patterns": [
				{
					"include": "#csharp-condition"
				},
				{
					"include": "#switch-code-block"
				},
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(?<=})"
		},
		"switch-code-block": {
			"name": "meta.structure.razor.csharp.codeblock.switch",
			"begin": "(\\{)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.curlybrace.open.cs"
				}
			},
			"patterns": [
				{
					"include": "source.cs#switch-label"
				},
				{
					"include": "#csharp-code-block"
				},
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(\\})",
			"endCaptures": {
				"1": {
					"name": "punctuation.curlybrace.close.cs"
				}
			}
		},
		"lock-statement": {
			"name": "meta.statement.lock.razor",
			"begin": "(?:(@))(lock)\\b\\s*(?=\\()",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.other.lock.cs"
				}
			},
			"patterns": [
				{
					"include": "#csharp-condition"
				},
				{
					"include": "#csharp-code-block"
				},
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(?<=})"
		},
		"lock-statement-with-optional-transition": {
			"name": "meta.statement.lock.razor",
			"begin": "(?:^\\s*|(@))(lock)\\b\\s*(?=\\()",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.other.lock.cs"
				}
			},
			"patterns": [
				{
					"include": "#csharp-condition"
				},
				{
					"include": "#csharp-code-block"
				},
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(?<=})"
		},
		"try-statement": {
			"patterns": [
				{
					"include": "#try-block"
				},
				{
					"include": "#catch-clause"
				},
				{
					"include": "#finally-clause"
				}
			]
		},
		"try-statement-with-optional-transition": {
			"patterns": [
				{
					"include": "#try-block-with-optional-transition"
				},
				{
					"include": "#catch-clause"
				},
				{
					"include": "#finally-clause"
				}
			]
		},
		"try-block": {
			"name": "meta.statement.try.razor",
			"begin": "(?:(@))(try)\\b\\s*",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.try.cs"
				}
			},
			"patterns": [
				{
					"include": "#csharp-condition"
				},
				{
					"include": "#csharp-code-block"
				},
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(?<=})"
		},
		"try-block-with-optional-transition": {
			"name": "meta.statement.try.razor",
			"begin": "(?:^\\s*|(@))(try)\\b\\s*",
			"beginCaptures": {
				"1": {
					"patterns": [
						{
							"include": "#transition"
						}
					]
				},
				"2": {
					"name": "keyword.control.try.cs"
				}
			},
			"patterns": [
				{
					"include": "#csharp-condition"
				},
				{
					"include": "#csharp-code-block"
				},
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(?<=})"
		},
		"catch-clause": {
			"name": "meta.statement.catch.razor",
			"begin": "(?:^|(?<=}))\\s*(catch)\\b\\s*?(?=[\\n\\(\\{])",
			"beginCaptures": {
				"1": {
					"name": "keyword.control.try.catch.cs"
				}
			},
			"patterns": [
				{
					"include": "#catch-condition"
				},
				{
					"include": "source.cs#when-clause"
				},
				{
					"include": "#csharp-code-block"
				},
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(?<=})"
		},
		"catch-condition": {
			"begin": "\\(",
			"beginCaptures": {
				"0": {
					"name": "punctuation.parenthesis.open.cs"
				}
			},
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "punctuation.parenthesis.close.cs"
				}
			},
			"patterns": [
				{
					"match": "(?x)\n(?<type-name>\n  (?:\n    (?:\n      (?:(?<identifier>@?[_[:alpha:]][_[:alnum:]]*)\\s*\\:\\:\\s*)? # alias-qualification\n      (?<name-and-type-args> # identifier + type arguments (if any)\n        \\g<identifier>\\s*\n        (?<type-args>\\s*<(?:[^<>]|\\g<type-args>)+>\\s*)?\n      )\n      (?:\\s*\\.\\s*\\g<name-and-type-args>)* | # Are there any more names being dotted into?\n      (?<tuple>\\s*\\((?:[^\\(\\)]|\\g<tuple>)+\\))\n    )\n    (?:\\s*\\?\\s*)? # nullable suffix?\n    (?:\\s*\\[(?:\\s*,\\s*)*\\]\\s*)* # array suffix?\n  )\n)\\s*\n(?:(\\g<identifier>)\\b)?",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "source.cs#type"
								}
							]
						},
						"6": {
							"name": "entity.name.variable.local.cs"
						}
					}
				}
			]
		},
		"finally-clause": {
			"name": "meta.statement.finally.razor",
			"begin": "(?:^|(?<=}))\\s*(finally)\\b\\s*?(?=[\\n\\{])",
			"beginCaptures": {
				"1": {
					"name": "keyword.control.try.finally.cs"
				}
			},
			"patterns": [
				{
					"include": "#csharp-code-block"
				},
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(?<=})"
		},
		"await-prefix": {
			"name": "keyword.other.await.cs",
			"match": "(await)\\s+"
		},
		"csharp-code-block": {
			"name": "meta.structure.razor.csharp.codeblock",
			"begin": "(\\{)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.curlybrace.open.cs"
				}
			},
			"patterns": [
				{
					"include": "#razor-codeblock-body"
				}
			],
			"end": "(\\})",
			"endCaptures": {
				"1": {
					"name": "punctuation.curlybrace.close.cs"
				}
			}
		},
		"csharp-condition": {
			"begin": "(\\()",
			"beginCaptures": {
				"1": {
					"name": "punctuation.parenthesis.open.cs"
				}
			},
			"patterns": [
				{
					"include": "source.cs#local-variable-declaration"
				},
				{
					"include": "source.cs#expression"
				},
				{
					"include": "source.cs#punctuation-comma"
				},
				{
					"include": "source.cs#punctuation-semicolon"
				}
			],
			"end": "(\\))",
			"endCaptures": {
				"1": {
					"name": "punctuation.parenthesis.close.cs"
				}
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/references-view/.npmrc]---
Location: vscode-main/extensions/references-view/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/references-view/.vscodeignore]---
Location: vscode-main/extensions/references-view/.vscodeignore

```text
.vscode/**
src/**
out/**
tsconfig.json
*.webpack.config.js
package-lock.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/references-view/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/references-view/extension-browser.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import { browser as withBrowserDefaults } from '../shared.webpack.config.mjs';
import path from 'path';

export default withBrowserDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/extension.ts'
	},
	output: {
		filename: 'extension.js',
		path: path.join(import.meta.dirname, 'dist')
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/references-view/extension.webpack.config.js]---
Location: vscode-main/extensions/references-view/extension.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import withDefaults from '../shared.webpack.config.mjs';

export default withDefaults({
	context: import.meta.dirname,
	resolve: {
		mainFields: ['module', 'main']
	},
	entry: {
		extension: './src/extension.ts',
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/references-view/package-lock.json]---
Location: vscode-main/extensions/references-view/package-lock.json

```json
{
  "name": "references-view",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "references-view",
      "version": "1.0.0",
      "license": "MIT",
      "devDependencies": {
        "@types/node": "22.x"
      },
      "engines": {
        "vscode": "^1.67.0"
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
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/references-view/package.json]---
Location: vscode-main/extensions/references-view/package.json

```json
{
  "name": "references-view",
  "displayName": "%displayName%",
  "description": "%description%",
  "icon": "media/icon.png",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "^1.67.0"
  },
  "capabilities": {
    "virtualWorkspaces": true,
    "untrustedWorkspaces": {
      "supported": true
    }
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/Microsoft/vscode-references-view"
  },
  "bugs": {
    "url": "https://github.com/Microsoft/vscode-references-view/issues"
  },
  "activationEvents": [
    "onCommand:references-view.find",
    "onCommand:editor.action.showReferences"
  ],
  "main": "./out/extension",
  "browser": "./dist/extension.js",
  "contributes": {
    "configuration": {
      "properties": {
        "references.preferredLocation": {
          "description": "%config.references.preferredLocation%",
          "type": "string",
          "default": "peek",
          "enum": [
            "peek",
            "view"
          ],
          "enumDescriptions": [
            "%config.references.preferredLocation.peek%",
            "%config.references.preferredLocation.view%"
          ]
        }
      }
    },
    "viewsContainers": {
      "activitybar": [
        {
          "id": "references-view",
          "icon": "$(references)",
          "title": "%container.title%"
        }
      ]
    },
    "views": {
      "references-view": [
        {
          "id": "references-view.tree",
          "name": "%view.title%",
          "when": "reference-list.isActive"
        }
      ]
    },
    "commands": [
      {
        "command": "references-view.findReferences",
        "title": "%cmd.references-view.findReferences%",
        "category": "%cmd.category.references%"
      },
      {
        "command": "references-view.findImplementations",
        "title": "%cmd.references-view.findImplementations%",
        "category": "%cmd.category.references%"
      },
      {
        "command": "references-view.clearHistory",
        "title": "%cmd.references-view.clearHistory%",
        "category": "%cmd.category.references%",
        "icon": "$(clear-all)"
      },
      {
        "command": "references-view.clear",
        "title": "%cmd.references-view.clear%",
        "category": "%cmd.category.references%",
        "icon": "$(clear-all)"
      },
      {
        "command": "references-view.refresh",
        "title": "%cmd.references-view.refresh%",
        "category": "%cmd.category.references%",
        "icon": "$(refresh)"
      },
      {
        "command": "references-view.pickFromHistory",
        "title": "%cmd.references-view.pickFromHistory%",
        "category": "%cmd.category.references%"
      },
      {
        "command": "references-view.removeReferenceItem",
        "title": "%cmd.references-view.removeReferenceItem%",
        "icon": "$(close)"
      },
      {
        "command": "references-view.copy",
        "title": "%cmd.references-view.copy%"
      },
      {
        "command": "references-view.copyAll",
        "title": "%cmd.references-view.copyAll%"
      },
      {
        "command": "references-view.copyPath",
        "title": "%cmd.references-view.copyPath%"
      },
      {
        "command": "references-view.refind",
        "title": "%cmd.references-view.refind%",
        "icon": "$(refresh)"
      },
      {
        "command": "references-view.showCallHierarchy",
        "title": "%cmd.references-view.showCallHierarchy%",
        "category": "Calls"
      },
      {
        "command": "references-view.showOutgoingCalls",
        "title": "%cmd.references-view.showOutgoingCalls%",
        "category": "Calls",
        "icon": "$(call-incoming)"
      },
      {
        "command": "references-view.showIncomingCalls",
        "title": "%cmd.references-view.showIncomingCalls%",
        "category": "Calls",
        "icon": "$(call-outgoing)"
      },
      {
        "command": "references-view.removeCallItem",
        "title": "%cmd.references-view.removeCallItem%",
        "icon": "$(close)"
      },
      {
        "command": "references-view.next",
        "title": "%cmd.references-view.next%",
        "enablement": "references-view.canNavigate"
      },
      {
        "command": "references-view.prev",
        "title": "%cmd.references-view.prev%",
        "enablement": "references-view.canNavigate"
      },
      {
        "command": "references-view.showTypeHierarchy",
        "title": "%cmd.references-view.showTypeHierarchy%",
        "category": "Types"
      },
      {
        "command": "references-view.showSupertypes",
        "title": "%cmd.references-view.showSupertypes%",
        "category": "Types",
        "icon": "$(type-hierarchy-super)"
      },
      {
        "command": "references-view.showSubtypes",
        "title": "%cmd.references-view.showSubtypes%",
        "category": "Types",
        "icon": "$(type-hierarchy-sub)"
      },
      {
        "command": "references-view.removeTypeItem",
        "title": "%cmd.references-view.removeTypeItem%",
        "icon": "$(close)"
      }
    ],
    "menus": {
      "editor/context": [
        {
          "command": "references-view.findReferences",
          "when": "editorHasReferenceProvider",
          "group": "0_navigation@1"
        },
        {
          "command": "references-view.findImplementations",
          "when": "editorHasImplementationProvider",
          "group": "0_navigation@2"
        },
        {
          "command": "references-view.showCallHierarchy",
          "when": "editorHasCallHierarchyProvider",
          "group": "0_navigation@3"
        },
        {
          "command": "references-view.showTypeHierarchy",
          "when": "editorHasTypeHierarchyProvider",
          "group": "0_navigation@4"
        }
      ],
      "view/title": [
        {
          "command": "references-view.clear",
          "group": "navigation@3",
          "when": "view == references-view.tree && reference-list.hasResult"
        },
        {
          "command": "references-view.clearHistory",
          "group": "navigation@3",
          "when": "view == references-view.tree && reference-list.hasHistory && !reference-list.hasResult"
        },
        {
          "command": "references-view.refresh",
          "group": "navigation@2",
          "when": "view == references-view.tree && reference-list.hasResult"
        },
        {
          "command": "references-view.showOutgoingCalls",
          "group": "navigation@1",
          "when": "view == references-view.tree && reference-list.hasResult && reference-list.source == callHierarchy &&  references-view.callHierarchyMode == showIncoming"
        },
        {
          "command": "references-view.showIncomingCalls",
          "group": "navigation@1",
          "when": "view == references-view.tree && reference-list.hasResult && reference-list.source == callHierarchy &&  references-view.callHierarchyMode == showOutgoing"
        },
        {
          "command": "references-view.showSupertypes",
          "group": "navigation@1",
          "when": "view == references-view.tree && reference-list.hasResult && reference-list.source == typeHierarchy &&  references-view.typeHierarchyMode != supertypes"
        },
        {
          "command": "references-view.showSubtypes",
          "group": "navigation@1",
          "when": "view == references-view.tree && reference-list.hasResult && reference-list.source == typeHierarchy &&  references-view.typeHierarchyMode != subtypes"
        }
      ],
      "view/item/context": [
        {
          "command": "references-view.removeReferenceItem",
          "group": "inline",
          "when": "view == references-view.tree && viewItem == file-item || view == references-view.tree && viewItem == reference-item"
        },
        {
          "command": "references-view.removeCallItem",
          "group": "inline",
          "when": "view == references-view.tree && viewItem == call-item"
        },
        {
          "command": "references-view.removeTypeItem",
          "group": "inline",
          "when": "view == references-view.tree && viewItem == type-item"
        },
        {
          "command": "references-view.refind",
          "group": "inline",
          "when": "view == references-view.tree && viewItem == history-item"
        },
        {
          "command": "references-view.removeReferenceItem",
          "group": "1",
          "when": "view == references-view.tree && viewItem == file-item || view == references-view.tree && viewItem == reference-item"
        },
        {
          "command": "references-view.removeCallItem",
          "group": "1",
          "when": "view == references-view.tree && viewItem == call-item"
        },
        {
          "command": "references-view.removeTypeItem",
          "group": "1",
          "when": "view == references-view.tree && viewItem == type-item"
        },
        {
          "command": "references-view.refind",
          "group": "1",
          "when": "view == references-view.tree && viewItem == history-item"
        },
        {
          "command": "references-view.copy",
          "group": "2@1",
          "when": "view == references-view.tree && viewItem == file-item || view == references-view.tree && viewItem == reference-item"
        },
        {
          "command": "references-view.copyPath",
          "group": "2@2",
          "when": "view == references-view.tree && viewItem == file-item"
        },
        {
          "command": "references-view.copyAll",
          "group": "2@3",
          "when": "view == references-view.tree && viewItem == file-item || view == references-view.tree && viewItem == reference-item"
        },
        {
          "command": "references-view.showOutgoingCalls",
          "group": "1",
          "when": "view == references-view.tree && viewItem == call-item"
        },
        {
          "command": "references-view.showIncomingCalls",
          "group": "1",
          "when": "view == references-view.tree && viewItem == call-item"
        },
        {
          "command": "references-view.showSupertypes",
          "group": "1",
          "when": "view == references-view.tree && viewItem == type-item"
        },
        {
          "command": "references-view.showSubtypes",
          "group": "1",
          "when": "view == references-view.tree && viewItem == type-item"
        }
      ],
      "commandPalette": [
        {
          "command": "references-view.removeReferenceItem",
          "when": "never"
        },
        {
          "command": "references-view.removeCallItem",
          "when": "never"
        },
        {
          "command": "references-view.removeTypeItem",
          "when": "never"
        },
        {
          "command": "references-view.copy",
          "when": "never"
        },
        {
          "command": "references-view.copyAll",
          "when": "never"
        },
        {
          "command": "references-view.copyPath",
          "when": "never"
        },
        {
          "command": "references-view.refind",
          "when": "never"
        },
        {
          "command": "references-view.findReferences",
          "when": "editorHasReferenceProvider"
        },
        {
          "command": "references-view.clear",
          "when": "reference-list.hasResult"
        },
        {
          "command": "references-view.clearHistory",
          "when": "reference-list.isActive && !reference-list.hasResult"
        },
        {
          "command": "references-view.refresh",
          "when": "reference-list.hasResult"
        },
        {
          "command": "references-view.pickFromHistory",
          "when": "reference-list.isActive"
        },
        {
          "command": "references-view.next",
          "when": "never"
        },
        {
          "command": "references-view.prev",
          "when": "never"
        }
      ]
    },
    "keybindings": [
      {
        "command": "references-view.findReferences",
        "when": "editorHasReferenceProvider",
        "key": "shift+alt+f12"
      },
      {
        "command": "references-view.next",
        "when": "reference-list.hasResult",
        "key": "f4"
      },
      {
        "command": "references-view.prev",
        "when": "reference-list.hasResult",
        "key": "shift+f4"
      },
      {
        "command": "references-view.showCallHierarchy",
        "when": "editorHasCallHierarchyProvider",
        "key": "shift+alt+h"
      }
    ]
  },
  "scripts": {
    "compile": "npx gulp compile-extension:references-view",
    "watch": "npx gulp watch-extension:references-view"
  },
  "devDependencies": {
    "@types/node": "22.x"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/references-view/package.nls.json]---
Location: vscode-main/extensions/references-view/package.nls.json

```json
{
	"displayName": "Reference Search View",
	"description": "Reference Search results as separate, stable view in the sidebar",
	"config.references.preferredLocation": "Controls whether 'Peek References' or 'Find References' is invoked when selecting CodeLens references.",
	"config.references.preferredLocation.peek": "Show references in peek editor.",
	"config.references.preferredLocation.view": "Show references in separate view.",
	"container.title": "References",
	"view.title": "Reference Search Results",
	"cmd.category.references": "References",
	"cmd.references-view.findReferences": "Find All References",
	"cmd.references-view.findImplementations": "Find All Implementations",
	"cmd.references-view.clearHistory": "Clear History",
	"cmd.references-view.clear": "Clear",
	"cmd.references-view.refresh": "Refresh",
	"cmd.references-view.pickFromHistory": "Show History",
	"cmd.references-view.removeReferenceItem": "Dismiss",
	"cmd.references-view.copy": "Copy",
	"cmd.references-view.copyAll": "Copy All",
	"cmd.references-view.copyPath": "Copy Path",
	"cmd.references-view.refind": "Rerun",
	"cmd.references-view.showCallHierarchy": "Show Call Hierarchy",
	"cmd.references-view.showOutgoingCalls": "Show Outgoing Calls",
	"cmd.references-view.showIncomingCalls": "Show Incoming Calls",
	"cmd.references-view.removeCallItem": "Dismiss",
	"cmd.references-view.next": "Go to Next Reference",
	"cmd.references-view.prev": "Go to Previous Reference",
	"cmd.references-view.showTypeHierarchy": "Show Type Hierarchy",
	"cmd.references-view.showSupertypes": "Show Supertypes",
	"cmd.references-view.showSubtypes": "Show Subtypes",
	"cmd.references-view.removeTypeItem": "Dismiss"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/references-view/README.md]---
Location: vscode-main/extensions/references-view/README.md

```markdown
# References View

This extension shows reference search results as separate view, just like search results. It complements the peek view presentation that is also built into VS Code. The following features are available:

- List All References via the Command Palette, the Context Menu, or via <kbd>Alt+Shift+F12</kbd>
- View references in a dedicated tree view that sits in the sidebar
- Navigate through search results via <kbd>F4</kbd> and <kbd>Shift+F4</kbd>
- Remove references from the list via inline commands

![](https://raw.githubusercontent.com/microsoft/vscode-references-view/master/media/demo.png)

**Note** that this extension is bundled with Visual Studio Code version 1.29 and later - it doesn't need to be installed anymore.

## Requirements

This extension is just an alternative UI for reference search and extensions implementing reference search must still be installed.

## Issues

This extension ships with Visual Studio Code and uses its issue tracker. Please file issue here: https://github.com/Microsoft/vscode/issues

# Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
```

--------------------------------------------------------------------------------

---[FILE: extensions/references-view/tsconfig.json]---
Location: vscode-main/extensions/references-view/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"typeRoots": [
			"./node_modules/@types"
		]
	},
	"include": [
		"src/**/*",
		"../../src/vscode-dts/vscode.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/references-view/src/extension.ts]---
Location: vscode-main/extensions/references-view/src/extension.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as calls from './calls';
import * as references from './references';
import { SymbolTree, SymbolTreeInput } from './references-view';
import { SymbolsTree } from './tree';
import * as types from './types';

export function activate(context: vscode.ExtensionContext): SymbolTree {

	const tree = new SymbolsTree();

	references.register(tree, context);
	calls.register(tree, context);
	types.register(tree, context);

	function setInput(input: SymbolTreeInput<unknown>) {
		tree.setInput(input);
	}

	function getInput(): SymbolTreeInput<unknown> | undefined {
		return tree.getInput();
	}

	return { setInput, getInput };
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/references-view/src/highlights.ts]---
Location: vscode-main/extensions/references-view/src/highlights.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { SymbolItemEditorHighlights } from './references-view';

export class EditorHighlights<T> {

	private readonly _decorationType = vscode.window.createTextEditorDecorationType({
		backgroundColor: new vscode.ThemeColor('editor.findMatchHighlightBackground'),
		rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
		overviewRulerLane: vscode.OverviewRulerLane.Center,
		overviewRulerColor: new vscode.ThemeColor('editor.findMatchHighlightBackground'),
	});

	private readonly disposables: vscode.Disposable[] = [];
	private readonly _ignore = new Set<string>();

	constructor(private readonly _view: vscode.TreeView<T>, private readonly _delegate: SymbolItemEditorHighlights<T>) {
		this.disposables.push(
			vscode.workspace.onDidChangeTextDocument(e => this._ignore.add(e.document.uri.toString())),
			vscode.window.onDidChangeActiveTextEditor(() => _view.visible && this.update()),
			_view.onDidChangeVisibility(e => e.visible ? this._show() : this._hide()),
			_view.onDidChangeSelection(() => {
				if (_view.visible) {
					this.update();
				}
			})
		);
		this._show();
	}

	dispose() {
		vscode.Disposable.from(...this.disposables).dispose();
		for (const editor of vscode.window.visibleTextEditors) {
			editor.setDecorations(this._decorationType, []);
		}
	}

	private _show(): void {
		const { activeTextEditor: editor } = vscode.window;
		if (!editor || !editor.viewColumn) {
			return;
		}
		if (this._ignore.has(editor.document.uri.toString())) {
			return;
		}
		const [anchor] = this._view.selection;
		if (!anchor) {
			return;
		}
		const ranges = this._delegate.getEditorHighlights(anchor, editor.document.uri);
		if (ranges) {
			editor.setDecorations(this._decorationType, ranges);
		}
	}

	private _hide(): void {
		for (const editor of vscode.window.visibleTextEditors) {
			editor.setDecorations(this._decorationType, []);
		}
	}

	update(): void {
		this._hide();
		this._show();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/references-view/src/navigation.ts]---
Location: vscode-main/extensions/references-view/src/navigation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { SymbolItemNavigation } from './references-view';
import { ContextKey } from './utils';

export class Navigation {

	private readonly _disposables: vscode.Disposable[] = [];
	private readonly _ctxCanNavigate = new ContextKey<boolean>('references-view.canNavigate');

	private _delegate?: SymbolItemNavigation<unknown>;

	constructor(private readonly _view: vscode.TreeView<unknown>) {
		this._disposables.push(
			vscode.commands.registerCommand('references-view.next', () => this.next(false)),
			vscode.commands.registerCommand('references-view.prev', () => this.previous(false)),
		);
	}

	dispose(): void {
		vscode.Disposable.from(...this._disposables).dispose();
	}

	update(delegate: SymbolItemNavigation<unknown> | undefined) {
		this._delegate = delegate;
		this._ctxCanNavigate.set(Boolean(this._delegate));
	}

	private _anchor(): undefined | unknown {
		if (!this._delegate) {
			return undefined;
		}
		const [sel] = this._view.selection;
		if (sel) {
			return sel;
		}
		if (!vscode.window.activeTextEditor) {
			return undefined;
		}
		return this._delegate.nearest(vscode.window.activeTextEditor.document.uri, vscode.window.activeTextEditor.selection.active);
	}

	private _open(loc: vscode.Location, preserveFocus: boolean) {
		vscode.commands.executeCommand('vscode.open', loc.uri, {
			selection: new vscode.Selection(loc.range.start, loc.range.start),
			preserveFocus
		});
	}

	previous(preserveFocus: boolean): void {
		if (!this._delegate) {
			return;
		}
		const item = this._anchor();
		if (!item) {
			return;
		}
		const newItem = this._delegate.previous(item);
		const newLocation = this._delegate.location(newItem);
		if (newLocation) {
			this._view.reveal(newItem, { select: true, focus: true });
			this._open(newLocation, preserveFocus);
		}
	}

	next(preserveFocus: boolean): void {
		if (!this._delegate) {
			return;
		}
		const item = this._anchor();
		if (!item) {
			return;
		}
		const newItem = this._delegate.next(item);
		const newLocation = this._delegate.location(newItem);
		if (newLocation) {
			this._view.reveal(newItem, { select: true, focus: true });
			this._open(newLocation, preserveFocus);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/references-view/src/references-view.d.ts]---
Location: vscode-main/extensions/references-view/src/references-view.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

/**
 * This interface describes the shape for the references viewlet API. It includes
 * a single `setInput` function which must be called with a full implementation
 * of the `SymbolTreeInput`-interface. You can also use `getInput` function to
 * get the current `SymbolTreeInput`. To acquire this API use the default mechanics, e.g:
 *
 * ```ts
 * // get references viewlet API
 * const api = await vscode.extensions.getExtension<SymbolTree>('vscode.references-view').activate();
 *
 * // instantiate and set input which updates the view
 * const myInput: SymbolTreeInput<MyItems> = ...
 * api.setInput(myInput);
 * const currentInput = api.getInput();
 * ```
 */
export interface SymbolTree {

	/**
	 * Set the contents of the references viewlet.
	 *
	 * @param input A symbol tree input object
	 */
	setInput(input: SymbolTreeInput<unknown>): void;

	/**
	 * Get the contents of the references viewlet.
	 *
	 * @returns The current symbol tree input object
	 */
	getInput(): SymbolTreeInput<unknown> | undefined;
}

/**
 * A symbol tree input is the entry point for populating the references viewlet.
 * Inputs must be anchored at a code location, they must have a title, and they
 * must resolve to a model.
 */
export interface SymbolTreeInput<T> {

	/**
	 * The value of the `reference-list.source` context key. Use this to control
	 * input dependent commands.
	 */
	readonly contextValue: string;

	/**
	 * The (short) title of this input, like "Implementations" or "Callers Of"
	 */
	readonly title: string;

	/**
	 * The location at which this position is anchored. Locations are validated and inputs
	 * with "funny" locations might be ignored
	 */
	readonly location: vscode.Location;

	/**
	 * Resolve this input to a model that contains the actual data. When there are no result
	 * than `undefined` or `null` should be returned.
	 */
	resolve(): vscode.ProviderResult<SymbolTreeModel<T>>;

	/**
	 * This function is called when re-running from history. The symbols tree has tracked
	 * the original location of this input and that is now passed to this input. The
	 * implementation of this function should return a clone where the `location`-property
	 * uses the provided `location`
	 *
	 * @param location The location at which the new input should be anchored.
	 * @returns A new input which location is anchored at the position.
	 */
	with(location: vscode.Location): SymbolTreeInput<T>;
}

/**
 * A symbol tree model which is used to populate the symbols tree.
 */
export interface SymbolTreeModel<T> {

	/**
	 * A tree data provider which is used to populate the symbols tree.
	 */
	provider: vscode.TreeDataProvider<T>;

	/**
	 * An optional message that is displayed above the tree. Whenever the provider
	 * fires a change event this message is read again.
	 */
	message: string | undefined;

	/**
	 * Optional support for symbol navigation. When implemented, navigation commands like
	 * "Go to Next" and "Go to Previous" will be working with this model.
	 */
	navigation?: SymbolItemNavigation<T>;

	/**
	 * Optional support for editor highlights. WHen implemented, the editor will highlight
	 * symbol ranges in the source code.
	 */
	highlights?: SymbolItemEditorHighlights<T>;

	/**
	 * Optional support for drag and drop.
	 */
	dnd?: SymbolItemDragAndDrop<T>;

	/**
	 * Optional dispose function which is invoked when this model is
	 * needed anymore
	 */
	dispose?(): void;
}

/**
 * Interface to support the built-in symbol navigation.
 */
export interface SymbolItemNavigation<T> {
	/**
	 * Return the item that is the nearest to the given location or `undefined`
	 */
	nearest(uri: vscode.Uri, position: vscode.Position): T | undefined;
	/**
	 * Return the next item from the given item or the item itself.
	 */
	next(from: T): T;
	/**
	 * Return the previous item from the given item or the item itself.
	 */
	previous(from: T): T;
	/**
	 * Return the location of the given item.
	 */
	location(item: T): vscode.Location | undefined;
}

/**
 * Interface to support the built-in editor highlights.
 */
export interface SymbolItemEditorHighlights<T> {
	/**
	 * Given an item and an uri return an array of ranges to highlight.
	 */
	getEditorHighlights(item: T, uri: vscode.Uri): vscode.Range[] | undefined;
}

export interface SymbolItemDragAndDrop<T> {

	getDragUri(item: T): vscode.Uri | undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/references-view/src/tree.ts]---
Location: vscode-main/extensions/references-view/src/tree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { EditorHighlights } from './highlights';
import { Navigation } from './navigation';
import { SymbolItemDragAndDrop, SymbolTreeInput } from './references-view';
import { ContextKey, isValidRequestPosition, WordAnchor } from './utils';


export class SymbolsTree {

	readonly viewId = 'references-view.tree';

	private readonly _ctxIsActive = new ContextKey<boolean>('reference-list.isActive');
	private readonly _ctxHasResult = new ContextKey<boolean>('reference-list.hasResult');
	private readonly _ctxInputSource = new ContextKey<string>('reference-list.source');

	private readonly _history = new TreeInputHistory(this);
	private readonly _provider = new TreeDataProviderDelegate();
	private readonly _dnd = new TreeDndDelegate();
	private readonly _tree: vscode.TreeView<unknown>;
	private readonly _navigation: Navigation;

	private _input?: SymbolTreeInput<unknown>;
	private _sessionDisposable?: vscode.Disposable;

	constructor() {
		this._tree = vscode.window.createTreeView<unknown>(this.viewId, {
			treeDataProvider: this._provider,
			showCollapseAll: true,
			dragAndDropController: this._dnd
		});
		this._navigation = new Navigation(this._tree);
	}

	dispose(): void {
		this._history.dispose();
		this._tree.dispose();
		this._sessionDisposable?.dispose();
	}

	getInput(): SymbolTreeInput<unknown> | undefined {
		return this._input;
	}

	async setInput(input: SymbolTreeInput<unknown>) {

		if (!await isValidRequestPosition(input.location.uri, input.location.range.start)) {
			this.clearInput();
			return;
		}

		this._ctxInputSource.set(input.contextValue);
		this._ctxIsActive.set(true);
		this._ctxHasResult.set(true);
		vscode.commands.executeCommand(`${this.viewId}.focus`);

		const newInputKind = !this._input || Object.getPrototypeOf(this._input) !== Object.getPrototypeOf(input);
		this._input = input;
		this._sessionDisposable?.dispose();

		this._tree.title = input.title;
		this._tree.message = newInputKind ? undefined : this._tree.message;

		const modelPromise = Promise.resolve(input.resolve());

		// set promise to tree data provider to trigger tree loading UI
		this._provider.update(modelPromise.then(model => model?.provider ?? this._history));
		this._dnd.update(modelPromise.then(model => model?.dnd));

		const model = await modelPromise;
		if (this._input !== input) {
			return;
		}

		if (!model) {
			this.clearInput();
			return;
		}

		this._history.add(input);
		this._tree.message = model.message;

		// navigation
		this._navigation.update(model.navigation);

		// reveal & select
		const selection = model.navigation?.nearest(input.location.uri, input.location.range.start);
		if (selection && this._tree.visible) {
			await this._tree.reveal(selection, { select: true, focus: true, expand: true });
		}

		const disposables: vscode.Disposable[] = [];

		// editor highlights
		let highlights: EditorHighlights<unknown> | undefined;
		if (model.highlights) {
			highlights = new EditorHighlights(this._tree, model.highlights);
			disposables.push(highlights);
		}

		// listener
		if (model.provider.onDidChangeTreeData) {
			disposables.push(model.provider.onDidChangeTreeData(() => {
				this._tree.title = input.title;
				this._tree.message = model.message;
				highlights?.update();
			}));
		}
		if (typeof model.dispose === 'function') {
			disposables.push(new vscode.Disposable(() => model.dispose!()));
		}
		this._sessionDisposable = vscode.Disposable.from(...disposables);
	}

	clearInput(): void {
		this._sessionDisposable?.dispose();
		this._input = undefined;
		this._ctxHasResult.set(false);
		this._ctxInputSource.reset();
		this._tree.title = vscode.l10n.t('References');
		this._tree.message = this._history.size === 0
			? vscode.l10n.t('No results.')
			: vscode.l10n.t('No results. Try running a previous search again:');
		this._provider.update(Promise.resolve(this._history));
	}
}

// --- tree data

interface ActiveTreeDataProviderWrapper {
	provider: Promise<vscode.TreeDataProvider<any>>;
}

class TreeDataProviderDelegate implements vscode.TreeDataProvider<undefined> {

	provider?: Promise<vscode.TreeDataProvider<any>>;

	private _sessionDispoables?: vscode.Disposable;
	private _onDidChange = new vscode.EventEmitter<any>();

	readonly onDidChangeTreeData = this._onDidChange.event;

	update(provider: Promise<vscode.TreeDataProvider<any>>) {

		this._sessionDispoables?.dispose();
		this._sessionDispoables = undefined;

		this._onDidChange.fire(undefined);

		this.provider = provider;

		provider.then(value => {
			if (this.provider === provider && value.onDidChangeTreeData) {
				this._sessionDispoables = value.onDidChangeTreeData(this._onDidChange.fire, this._onDidChange);
			}
		}).catch(err => {
			this.provider = undefined;
			console.error(err);
		});
	}

	async getTreeItem(element: unknown) {
		this._assertProvider();
		return (await this.provider).getTreeItem(element);
	}

	async getChildren(parent?: unknown | undefined) {
		this._assertProvider();
		return (await this.provider).getChildren(parent);
	}

	async getParent(element: unknown) {
		this._assertProvider();
		const provider = await this.provider;
		return provider.getParent ? provider.getParent(element) : undefined;
	}

	private _assertProvider(): asserts this is ActiveTreeDataProviderWrapper {
		if (!this.provider) {
			throw new Error('MISSING provider');
		}
	}
}

// --- tree dnd

class TreeDndDelegate implements vscode.TreeDragAndDropController<undefined> {

	private _delegate: SymbolItemDragAndDrop<undefined> | undefined;

	readonly dropMimeTypes: string[] = [];

	readonly dragMimeTypes: string[] = ['text/uri-list'];

	update(delegate: Promise<SymbolItemDragAndDrop<unknown> | undefined>) {
		this._delegate = undefined;
		delegate.then(value => this._delegate = value);
	}

	handleDrag(source: undefined[], data: vscode.DataTransfer) {
		if (this._delegate) {
			const urls: string[] = [];
			for (const item of source) {
				const uri = this._delegate.getDragUri(item);
				if (uri) {
					urls.push(uri.toString());
				}
			}
			if (urls.length > 0) {
				data.set('text/uri-list', new vscode.DataTransferItem(urls.join('\r\n')));
			}
		}
	}

	handleDrop(): void | Thenable<void> {
		throw new Error('Method not implemented.');
	}
}

// --- history

class HistoryItem {

	readonly description: string;

	constructor(
		readonly key: string,
		readonly word: string,
		readonly anchor: WordAnchor,
		readonly input: SymbolTreeInput<unknown>,
	) {
		this.description = `${vscode.workspace.asRelativePath(input.location.uri)} • ${input.title.toLocaleLowerCase()}`;
	}
}

class TreeInputHistory implements vscode.TreeDataProvider<HistoryItem> {

	private readonly _onDidChangeTreeData = new vscode.EventEmitter<HistoryItem | undefined>();
	readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

	private readonly _disposables: vscode.Disposable[] = [];
	private readonly _ctxHasHistory = new ContextKey<boolean>('reference-list.hasHistory');
	private readonly _inputs = new Map<string, HistoryItem>();

	constructor(private readonly _tree: SymbolsTree) {

		this._disposables.push(
			vscode.commands.registerCommand('references-view.clear', () => _tree.clearInput()),
			vscode.commands.registerCommand('references-view.clearHistory', () => {
				this.clear();
				_tree.clearInput();
			}),
			vscode.commands.registerCommand('references-view.refind', (item) => {
				if (item instanceof HistoryItem) {
					this._reRunHistoryItem(item);
				}
			}),
			vscode.commands.registerCommand('references-view.refresh', () => {
				const item = Array.from(this._inputs.values()).pop();
				if (item) {
					this._reRunHistoryItem(item);
				}
			}),
			vscode.commands.registerCommand('_references-view.showHistoryItem', async (item) => {
				if (item instanceof HistoryItem) {
					const position = item.anchor.guessedTrackedPosition() ?? item.input.location.range.start;
					await vscode.commands.executeCommand('vscode.open', item.input.location.uri, { selection: new vscode.Range(position, position) });
				}
			}),
			vscode.commands.registerCommand('references-view.pickFromHistory', async () => {
				interface HistoryPick extends vscode.QuickPickItem {
					item: HistoryItem;
				}
				const entries = await this.getChildren();
				const picks = entries.map((item): HistoryPick => ({
					label: item.word,
					description: item.description,
					item
				}));
				const pick = await vscode.window.showQuickPick(picks, { placeHolder: vscode.l10n.t('Select previous reference search') });
				if (pick) {
					this._reRunHistoryItem(pick.item);
				}
			}),
		);
	}

	dispose(): void {
		vscode.Disposable.from(...this._disposables).dispose();
		this._onDidChangeTreeData.dispose();
	}

	private _reRunHistoryItem(item: HistoryItem): void {
		this._inputs.delete(item.key);
		const newPosition = item.anchor.guessedTrackedPosition();
		let newInput = item.input;
		// create a new input when having a tracked position which is
		// different than the original position.
		if (newPosition && !item.input.location.range.start.isEqual(newPosition)) {
			newInput = item.input.with(new vscode.Location(item.input.location.uri, newPosition));
		}
		this._tree.setInput(newInput);
	}

	async add(input: SymbolTreeInput<unknown>) {

		const doc = await vscode.workspace.openTextDocument(input.location.uri);

		const anchor = new WordAnchor(doc, input.location.range.start);
		const range = doc.getWordRangeAtPosition(input.location.range.start) ?? doc.getWordRangeAtPosition(input.location.range.start, /[^\s]+/);
		const word = range ? doc.getText(range) : '???';

		const item = new HistoryItem(JSON.stringify([range?.start ?? input.location.range.start, input.location.uri, input.title]), word, anchor, input);
		// use filo-ordering of native maps
		this._inputs.delete(item.key);
		this._inputs.set(item.key, item);
		this._ctxHasHistory.set(true);
	}

	clear(): void {
		this._inputs.clear();
		this._ctxHasHistory.set(false);
		this._onDidChangeTreeData.fire(undefined);
	}

	get size() {
		return this._inputs.size;
	}

	// --- tree data provider

	getTreeItem(item: HistoryItem): vscode.TreeItem {
		const result = new vscode.TreeItem(item.word);
		result.description = item.description;
		result.command = { command: '_references-view.showHistoryItem', arguments: [item], title: vscode.l10n.t('Rerun') };
		result.collapsibleState = vscode.TreeItemCollapsibleState.None;
		result.contextValue = 'history-item';
		return result;
	}

	getChildren() {
		return Promise.all([...this._inputs.values()].reverse());
	}

	getParent() {
		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/references-view/src/utils.ts]---
Location: vscode-main/extensions/references-view/src/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export function del<T>(array: T[], e: T): void {
	const idx = array.indexOf(e);
	if (idx >= 0) {
		array.splice(idx, 1);
	}
}

export function tail<T>(array: T[]): T | undefined {
	return array[array.length - 1];
}

export function asResourceUrl(uri: vscode.Uri, range: vscode.Range): vscode.Uri {
	return uri.with({ fragment: `L${1 + range.start.line},${1 + range.start.character}-${1 + range.end.line},${1 + range.end.character}` });
}

export async function isValidRequestPosition(uri: vscode.Uri, position: vscode.Position) {
	const doc = await vscode.workspace.openTextDocument(uri);
	let range = doc.getWordRangeAtPosition(position);
	if (!range) {
		range = doc.getWordRangeAtPosition(position, /[^\s]+/);
	}
	return Boolean(range);
}

export function getPreviewChunks(doc: vscode.TextDocument, range: vscode.Range, beforeLen: number = 8, trim: boolean = true) {
	const previewStart = range.start.with({ character: Math.max(0, range.start.character - beforeLen) });
	const wordRange = doc.getWordRangeAtPosition(previewStart);
	let before = doc.getText(new vscode.Range(wordRange ? wordRange.start : previewStart, range.start));
	const inside = doc.getText(range);
	const previewEnd = range.end.translate(0, 331);
	let after = doc.getText(new vscode.Range(range.end, previewEnd));
	if (trim) {
		before = before.replace(/^\s*/g, '');
		after = after.replace(/\s*$/g, '');
	}
	return { before, inside, after };
}

export class ContextKey<V> {

	constructor(readonly name: string) { }

	async set(value: V) {
		await vscode.commands.executeCommand('setContext', this.name, value);
	}

	async reset() {
		await vscode.commands.executeCommand('setContext', this.name, undefined);
	}
}

export class WordAnchor {

	private readonly _version: number;
	private readonly _word: string | undefined;

	constructor(private readonly _doc: vscode.TextDocument, private readonly _position: vscode.Position) {
		this._version = _doc.version;
		this._word = this._getAnchorWord(_doc, _position);
	}

	private _getAnchorWord(doc: vscode.TextDocument, pos: vscode.Position): string | undefined {
		const range = doc.getWordRangeAtPosition(pos) || doc.getWordRangeAtPosition(pos, /[^\s]+/);
		return range && doc.getText(range);
	}

	guessedTrackedPosition(): vscode.Position | undefined {
		// funky entry
		if (!this._word) {
			return this._position;
		}

		// no changes
		if (this._version === this._doc.version) {
			return this._position;
		}

		// no changes here...
		const wordNow = this._getAnchorWord(this._doc, this._position);
		if (this._word === wordNow) {
			return this._position;
		}

		// changes: search _word downwards and upwards
		const startLine = this._position.line;
		let i = 0;
		let line: number;
		let checked: boolean;
		do {
			checked = false;
			// nth line down
			line = startLine + i;
			if (line < this._doc.lineCount) {
				checked = true;
				const ch = this._doc.lineAt(line).text.indexOf(this._word);
				if (ch >= 0) {
					return new vscode.Position(line, ch);
				}
			}
			i += 1;
			// nth line up
			line = startLine - i;
			if (line >= 0) {
				checked = true;
				const ch = this._doc.lineAt(line).text.indexOf(this._word);
				if (ch >= 0) {
					return new vscode.Position(line, ch);
				}
			}
		} while (i < 100 && checked);

		// fallback
		return this._position;
	}
}

// vscode.SymbolKind.File === 0, Module === 1, etc...
const _themeIconIds = [
	'symbol-file', 'symbol-module', 'symbol-namespace', 'symbol-package', 'symbol-class', 'symbol-method',
	'symbol-property', 'symbol-field', 'symbol-constructor', 'symbol-enum', 'symbol-interface',
	'symbol-function', 'symbol-variable', 'symbol-constant', 'symbol-string', 'symbol-number', 'symbol-boolean',
	'symbol-array', 'symbol-object', 'symbol-key', 'symbol-null', 'symbol-enum-member', 'symbol-struct',
	'symbol-event', 'symbol-operator', 'symbol-type-parameter'
];

export function getThemeIcon(kind: vscode.SymbolKind): vscode.ThemeIcon | undefined {
	const id = _themeIconIds[kind];
	return id ? new vscode.ThemeIcon(id) : undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/references-view/src/calls/index.ts]---
Location: vscode-main/extensions/references-view/src/calls/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { SymbolsTree } from '../tree';
import { ContextKey } from '../utils';
import { CallItem, CallsDirection, CallsTreeInput } from './model';

export function register(tree: SymbolsTree, context: vscode.ExtensionContext): void {

	const direction = new RichCallsDirection(context.workspaceState, CallsDirection.Incoming);

	function showCallHierarchy() {
		if (vscode.window.activeTextEditor) {
			const input = new CallsTreeInput(new vscode.Location(vscode.window.activeTextEditor.document.uri, vscode.window.activeTextEditor.selection.active), direction.value);
			tree.setInput(input);
		}
	}

	function setCallsDirection(value: CallsDirection, anchor: CallItem | unknown) {
		direction.value = value;

		let newInput: CallsTreeInput | undefined;
		const oldInput = tree.getInput();
		if (anchor instanceof CallItem) {
			newInput = new CallsTreeInput(new vscode.Location(anchor.item.uri, anchor.item.selectionRange.start), direction.value);
		} else if (oldInput instanceof CallsTreeInput) {
			newInput = new CallsTreeInput(oldInput.location, direction.value);
		}
		if (newInput) {
			tree.setInput(newInput);
		}
	}

	context.subscriptions.push(
		vscode.commands.registerCommand('references-view.showCallHierarchy', showCallHierarchy),
		vscode.commands.registerCommand('references-view.showOutgoingCalls', (item: CallItem | unknown) => setCallsDirection(CallsDirection.Outgoing, item)),
		vscode.commands.registerCommand('references-view.showIncomingCalls', (item: CallItem | unknown) => setCallsDirection(CallsDirection.Incoming, item)),
		vscode.commands.registerCommand('references-view.removeCallItem', removeCallItem)
	);
}

function removeCallItem(item: CallItem | unknown): void {
	if (item instanceof CallItem) {
		item.remove();
	}
}

class RichCallsDirection {

	private static _key = 'references-view.callHierarchyMode';

	private _ctxMode = new ContextKey<'showIncoming' | 'showOutgoing'>('references-view.callHierarchyMode');

	constructor(
		private _mem: vscode.Memento,
		private _value: CallsDirection = CallsDirection.Outgoing,
	) {
		const raw = _mem.get<number>(RichCallsDirection._key);
		if (typeof raw === 'number' && raw >= 0 && raw <= 1) {
			this.value = raw;
		} else {
			this.value = _value;
		}
	}

	get value() {
		return this._value;
	}

	set value(value: CallsDirection) {
		this._value = value;
		this._ctxMode.set(this._value === CallsDirection.Incoming ? 'showIncoming' : 'showOutgoing');
		this._mem.update(RichCallsDirection._key, value);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/references-view/src/calls/model.ts]---
Location: vscode-main/extensions/references-view/src/calls/model.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { SymbolItemDragAndDrop, SymbolItemEditorHighlights, SymbolItemNavigation, SymbolTreeInput } from '../references-view';
import { asResourceUrl, del, getThemeIcon, tail } from '../utils';

export class CallsTreeInput implements SymbolTreeInput<CallItem> {

	readonly title: string;
	readonly contextValue: string = 'callHierarchy';

	constructor(
		readonly location: vscode.Location,
		readonly direction: CallsDirection,
	) {
		this.title = direction === CallsDirection.Incoming
			? vscode.l10n.t('Callers Of')
			: vscode.l10n.t('Calls From');
	}

	async resolve() {

		const items = await Promise.resolve(vscode.commands.executeCommand<vscode.CallHierarchyItem[]>('vscode.prepareCallHierarchy', this.location.uri, this.location.range.start));
		const model = new CallsModel(this.direction, items ?? []);
		const provider = new CallItemDataProvider(model);

		if (model.roots.length === 0) {
			return;
		}

		return {
			provider,
			get message() { return model.roots.length === 0 ? vscode.l10n.t('No results.') : undefined; },
			navigation: model,
			highlights: model,
			dnd: model,
			dispose() {
				provider.dispose();
			}
		};
	}

	with(location: vscode.Location): CallsTreeInput {
		return new CallsTreeInput(location, this.direction);
	}
}


export const enum CallsDirection {
	Incoming,
	Outgoing
}



export class CallItem {

	children?: CallItem[];

	constructor(
		readonly model: CallsModel,
		readonly item: vscode.CallHierarchyItem,
		readonly parent: CallItem | undefined,
		readonly locations: vscode.Location[] | undefined
	) { }

	remove(): void {
		this.model.remove(this);
	}
}

class CallsModel implements SymbolItemNavigation<CallItem>, SymbolItemEditorHighlights<CallItem>, SymbolItemDragAndDrop<CallItem> {

	readonly roots: CallItem[] = [];

	private readonly _onDidChange = new vscode.EventEmitter<CallsModel>();
	readonly onDidChange = this._onDidChange.event;

	constructor(readonly direction: CallsDirection, items: vscode.CallHierarchyItem[]) {
		this.roots = items.map(item => new CallItem(this, item, undefined, undefined));
	}

	private async _resolveCalls(call: CallItem): Promise<CallItem[]> {
		if (this.direction === CallsDirection.Incoming) {
			const calls = await vscode.commands.executeCommand<vscode.CallHierarchyIncomingCall[]>('vscode.provideIncomingCalls', call.item);
			return calls ? calls.map(item => new CallItem(this, item.from, call, item.fromRanges.map(range => new vscode.Location(item.from.uri, range)))) : [];
		} else {
			const calls = await vscode.commands.executeCommand<vscode.CallHierarchyOutgoingCall[]>('vscode.provideOutgoingCalls', call.item);
			return calls ? calls.map(item => new CallItem(this, item.to, call, item.fromRanges.map(range => new vscode.Location(call.item.uri, range)))) : [];
		}
	}

	async getCallChildren(call: CallItem): Promise<CallItem[]> {
		if (!call.children) {
			call.children = await this._resolveCalls(call);
		}
		return call.children;
	}

	// -- navigation

	location(item: CallItem) {
		return new vscode.Location(item.item.uri, item.item.range);
	}

	nearest(uri: vscode.Uri, _position: vscode.Position): CallItem | undefined {
		return this.roots.find(item => item.item.uri.toString() === uri.toString()) ?? this.roots[0];
	}

	next(from: CallItem): CallItem {
		return this._move(from, true) ?? from;
	}

	previous(from: CallItem): CallItem {
		return this._move(from, false) ?? from;
	}

	private _move(item: CallItem, fwd: boolean): CallItem | void {
		if (item.children?.length) {
			return fwd ? item.children[0] : tail(item.children);
		}
		const array = this.roots.includes(item) ? this.roots : item.parent?.children;
		if (array?.length) {
			const idx = array.indexOf(item);
			const delta = fwd ? 1 : -1;
			return array[idx + delta + array.length % array.length];
		}
	}

	// --- dnd

	getDragUri(item: CallItem): vscode.Uri | undefined {
		return asResourceUrl(item.item.uri, item.item.range);
	}

	// --- highlights

	getEditorHighlights(item: CallItem, uri: vscode.Uri): vscode.Range[] | undefined {
		if (!item.locations) {
			return item.item.uri.toString() === uri.toString() ? [item.item.selectionRange] : undefined;
		}
		return item.locations
			.filter(loc => loc.uri.toString() === uri.toString())
			.map(loc => loc.range);
	}

	remove(item: CallItem) {
		const isInRoot = this.roots.includes(item);
		const siblings = isInRoot ? this.roots : item.parent?.children;
		if (siblings) {
			del(siblings, item);
			this._onDidChange.fire(this);
		}
	}
}

class CallItemDataProvider implements vscode.TreeDataProvider<CallItem> {

	private readonly _emitter = new vscode.EventEmitter<CallItem | undefined>();
	readonly onDidChangeTreeData = this._emitter.event;

	private readonly _modelListener: vscode.Disposable;

	constructor(private _model: CallsModel) {
		this._modelListener = _model.onDidChange(e => this._emitter.fire(e instanceof CallItem ? e : undefined));
	}

	dispose(): void {
		this._emitter.dispose();
		this._modelListener.dispose();
	}

	getTreeItem(element: CallItem): vscode.TreeItem {

		const item = new vscode.TreeItem(element.item.name);
		item.description = element.item.detail;
		item.tooltip = item.label && element.item.detail ? `${item.label} - ${element.item.detail}` : item.label ? `${item.label}` : element.item.detail;
		item.contextValue = 'call-item';
		item.iconPath = getThemeIcon(element.item.kind);

		type OpenArgs = [vscode.Uri, vscode.TextDocumentShowOptions];
		let openArgs: OpenArgs;

		if (element.model.direction === CallsDirection.Outgoing) {

			openArgs = [element.item.uri, { selection: element.item.selectionRange.with({ end: element.item.selectionRange.start }) }];

		} else {
			// incoming call -> reveal first call instead of caller
			let firstLoctionStart: vscode.Position | undefined;
			if (element.locations) {
				for (const loc of element.locations) {
					if (loc.uri.toString() === element.item.uri.toString()) {
						firstLoctionStart = firstLoctionStart?.isBefore(loc.range.start) ? firstLoctionStart : loc.range.start;
					}
				}
			}
			if (!firstLoctionStart) {
				firstLoctionStart = element.item.selectionRange.start;
			}
			openArgs = [element.item.uri, { selection: new vscode.Range(firstLoctionStart, firstLoctionStart) }];
		}

		item.command = {
			command: 'vscode.open',
			title: vscode.l10n.t('Open Call'),
			arguments: openArgs
		};
		item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
		return item;
	}

	getChildren(element?: CallItem | undefined) {
		return element
			? this._model.getCallChildren(element)
			: this._model.roots;
	}

	getParent(element: CallItem) {
		return element.parent;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/references-view/src/references/index.ts]---
Location: vscode-main/extensions/references-view/src/references/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { SymbolsTree } from '../tree';
import { FileItem, ReferenceItem, ReferencesModel, ReferencesTreeInput } from './model';

export function register(tree: SymbolsTree, context: vscode.ExtensionContext): void {

	function findLocations(title: string, command: string) {
		if (vscode.window.activeTextEditor) {
			const input = new ReferencesTreeInput(title, new vscode.Location(vscode.window.activeTextEditor.document.uri, vscode.window.activeTextEditor.selection.active), command);
			tree.setInput(input);
		}
	}

	context.subscriptions.push(
		vscode.commands.registerCommand('references-view.findReferences', () => findLocations('References', 'vscode.executeReferenceProvider')),
		vscode.commands.registerCommand('references-view.findImplementations', () => findLocations('Implementations', 'vscode.executeImplementationProvider')),
		// --- legacy name
		vscode.commands.registerCommand('references-view.find', (...args: any[]) => vscode.commands.executeCommand('references-view.findReferences', ...args)),
		vscode.commands.registerCommand('references-view.removeReferenceItem', removeReferenceItem),
		vscode.commands.registerCommand('references-view.copy', copyCommand),
		vscode.commands.registerCommand('references-view.copyAll', copyAllCommand),
		vscode.commands.registerCommand('references-view.copyPath', copyPathCommand),
	);


	// --- references.preferredLocation setting

	let showReferencesDisposable: vscode.Disposable | undefined;
	const config = 'references.preferredLocation';
	function updateShowReferences(event?: vscode.ConfigurationChangeEvent) {
		if (event && !event.affectsConfiguration(config)) {
			return;
		}
		const value = vscode.workspace.getConfiguration().get<string>(config);

		showReferencesDisposable?.dispose();
		showReferencesDisposable = undefined;

		if (value === 'view') {
			showReferencesDisposable = vscode.commands.registerCommand('editor.action.showReferences', async (uri: vscode.Uri, position: vscode.Position, locations: vscode.Location[]) => {
				const input = new ReferencesTreeInput(vscode.l10n.t('References'), new vscode.Location(uri, position), 'vscode.executeReferenceProvider', locations);
				tree.setInput(input);
			});
		}
	}
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(updateShowReferences));
	context.subscriptions.push({ dispose: () => showReferencesDisposable?.dispose() });
	updateShowReferences();
}

const copyAllCommand = async (item: ReferenceItem | FileItem | unknown) => {
	if (item instanceof ReferenceItem) {
		copyCommand(item.file.model);
	} else if (item instanceof FileItem) {
		copyCommand(item.model);
	}
};

function removeReferenceItem(item: FileItem | ReferenceItem | unknown) {
	if (item instanceof FileItem) {
		item.remove();
	} else if (item instanceof ReferenceItem) {
		item.remove();
	}
}


async function copyCommand(item: ReferencesModel | ReferenceItem | FileItem | unknown) {
	let val: string | undefined;
	if (item instanceof ReferencesModel) {
		val = await item.asCopyText();
	} else if (item instanceof ReferenceItem) {
		val = await item.asCopyText();
	} else if (item instanceof FileItem) {
		val = await item.asCopyText();
	}
	if (val) {
		await vscode.env.clipboard.writeText(val);
	}
}

async function copyPathCommand(item: FileItem | unknown) {
	if (item instanceof FileItem) {
		if (item.uri.scheme === 'file') {
			vscode.env.clipboard.writeText(item.uri.fsPath);
		} else {
			vscode.env.clipboard.writeText(item.uri.toString(true));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/references-view/src/references/model.ts]---
Location: vscode-main/extensions/references-view/src/references/model.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { SymbolItemDragAndDrop, SymbolItemEditorHighlights, SymbolItemNavigation, SymbolTreeInput, SymbolTreeModel } from '../references-view';
import { asResourceUrl, del, getPreviewChunks, tail } from '../utils';

export class ReferencesTreeInput implements SymbolTreeInput<FileItem | ReferenceItem> {

	readonly contextValue: string;

	constructor(
		readonly title: string,
		readonly location: vscode.Location,
		private readonly _command: string,
		private readonly _result?: vscode.Location[] | vscode.LocationLink[]
	) {
		this.contextValue = _command;
	}

	async resolve(): Promise<SymbolTreeModel<FileItem | ReferenceItem> | undefined> {

		let model: ReferencesModel;
		if (this._result) {
			model = new ReferencesModel(this._result);
		} else {
			const resut = await Promise.resolve(vscode.commands.executeCommand<vscode.Location[] | vscode.LocationLink[]>(this._command, this.location.uri, this.location.range.start));
			model = new ReferencesModel(resut ?? []);
		}

		if (model.items.length === 0) {
			return;
		}

		const provider = new ReferencesTreeDataProvider(model);
		return {
			provider,
			get message() { return model.message; },
			navigation: model,
			highlights: model,
			dnd: model,
			dispose(): void {
				provider.dispose();
			}
		};
	}

	with(location: vscode.Location): ReferencesTreeInput {
		return new ReferencesTreeInput(this.title, location, this._command);
	}
}

export class ReferencesModel implements SymbolItemNavigation<FileItem | ReferenceItem>, SymbolItemEditorHighlights<FileItem | ReferenceItem>, SymbolItemDragAndDrop<FileItem | ReferenceItem> {

	private _onDidChange = new vscode.EventEmitter<FileItem | ReferenceItem | undefined>();
	readonly onDidChangeTreeData = this._onDidChange.event;

	readonly items: FileItem[] = [];

	constructor(locations: vscode.Location[] | vscode.LocationLink[]) {
		let last: FileItem | undefined;
		for (const item of locations.sort(ReferencesModel._compareLocations)) {
			const loc = item instanceof vscode.Location
				? item
				: new vscode.Location(item.targetUri, item.targetRange);

			if (!last || ReferencesModel._compareUriIgnoreFragment(last.uri, loc.uri) !== 0) {
				last = new FileItem(loc.uri.with({ fragment: '' }), [], this);
				this.items.push(last);
			}
			last.references.push(new ReferenceItem(loc, last));
		}
	}

	private static _compareUriIgnoreFragment(a: vscode.Uri, b: vscode.Uri): number {
		const aStr = a.with({ fragment: '' }).toString();
		const bStr = b.with({ fragment: '' }).toString();
		if (aStr < bStr) {
			return -1;
		} else if (aStr > bStr) {
			return 1;
		}
		return 0;
	}

	private static _compareLocations(a: vscode.Location | vscode.LocationLink, b: vscode.Location | vscode.LocationLink): number {
		const aUri = a instanceof vscode.Location ? a.uri : a.targetUri;
		const bUri = b instanceof vscode.Location ? b.uri : b.targetUri;
		if (aUri.toString() < bUri.toString()) {
			return -1;
		} else if (aUri.toString() > bUri.toString()) {
			return 1;
		}

		const aRange = a instanceof vscode.Location ? a.range : a.targetRange;
		const bRange = b instanceof vscode.Location ? b.range : b.targetRange;
		if (aRange.start.isBefore(bRange.start)) {
			return -1;
		} else if (aRange.start.isAfter(bRange.start)) {
			return 1;
		} else {
			return 0;
		}
	}

	// --- adapter

	get message() {
		if (this.items.length === 0) {
			return vscode.l10n.t('No results.');
		}
		const total = this.items.reduce((prev, cur) => prev + cur.references.length, 0);
		const files = this.items.length;
		if (total === 1 && files === 1) {
			return vscode.l10n.t('{0} result in {1} file', total, files);
		} else if (total === 1) {
			return vscode.l10n.t('{0} result in {1} files', total, files);
		} else if (files === 1) {
			return vscode.l10n.t('{0} results in {1} file', total, files);
		} else {
			return vscode.l10n.t('{0} results in {1} files', total, files);
		}
	}

	location(item: FileItem | ReferenceItem) {
		return item instanceof ReferenceItem
			? item.location
			: new vscode.Location(item.uri, item.references[0]?.location.range ?? new vscode.Position(0, 0));
	}

	nearest(uri: vscode.Uri, position: vscode.Position): FileItem | ReferenceItem | undefined {

		if (this.items.length === 0) {
			return;
		}
		// NOTE: this.items is sorted by location (uri/range)
		for (const item of this.items) {
			if (item.uri.toString() === uri.toString()) {
				// (1) pick the item at the request position
				for (const ref of item.references) {
					if (ref.location.range.contains(position)) {
						return ref;
					}
				}
				// (2) pick the first item after or last before the request position
				let lastBefore: ReferenceItem | undefined;
				for (const ref of item.references) {
					if (ref.location.range.end.isAfter(position)) {
						return ref;
					}
					lastBefore = ref;
				}
				if (lastBefore) {
					return lastBefore;
				}

				break;
			}
		}

		// (3) pick the file with the longest common prefix
		let best = 0;
		const bestValue = ReferencesModel._prefixLen(this.items[best].toString(), uri.toString());

		for (let i = 1; i < this.items.length; i++) {
			const value = ReferencesModel._prefixLen(this.items[i].uri.toString(), uri.toString());
			if (value > bestValue) {
				best = i;
			}
		}

		return this.items[best].references[0];
	}

	private static _prefixLen(a: string, b: string): number {
		let pos = 0;
		while (pos < a.length && pos < b.length && a.charCodeAt(pos) === b.charCodeAt(pos)) {
			pos += 1;
		}
		return pos;
	}

	next(item: FileItem | ReferenceItem): FileItem | ReferenceItem {
		return this._move(item, true) ?? item;
	}

	previous(item: FileItem | ReferenceItem): FileItem | ReferenceItem {
		return this._move(item, false) ?? item;
	}

	private _move(item: FileItem | ReferenceItem, fwd: boolean): ReferenceItem | void {

		const delta = fwd ? +1 : -1;

		const _move = (item: FileItem): FileItem => {
			const idx = (this.items.indexOf(item) + delta + this.items.length) % this.items.length;
			return this.items[idx];
		};

		if (item instanceof FileItem) {
			if (fwd) {
				return _move(item).references[0];
			} else {
				return tail(_move(item).references);
			}
		}

		if (item instanceof ReferenceItem) {
			const idx = item.file.references.indexOf(item) + delta;
			if (idx < 0) {
				return tail(_move(item.file).references);
			} else if (idx >= item.file.references.length) {
				return _move(item.file).references[0];
			} else {
				return item.file.references[idx];
			}
		}
	}

	getEditorHighlights(_item: FileItem | ReferenceItem, uri: vscode.Uri): vscode.Range[] | undefined {
		const file = this.items.find(file => file.uri.toString() === uri.toString());
		return file?.references.map(ref => ref.location.range);
	}

	remove(item: FileItem | ReferenceItem) {
		if (item instanceof FileItem) {
			del(this.items, item);
			this._onDidChange.fire(undefined);
		} else {
			del(item.file.references, item);
			if (item.file.references.length === 0) {
				del(this.items, item.file);
				this._onDidChange.fire(undefined);
			} else {
				this._onDidChange.fire(item.file);
			}
		}
	}

	async asCopyText() {
		let result = '';
		for (const item of this.items) {
			result += `${await item.asCopyText()}\n`;
		}
		return result;
	}

	getDragUri(item: FileItem | ReferenceItem): vscode.Uri | undefined {
		if (item instanceof FileItem) {
			return item.uri;
		} else {
			return asResourceUrl(item.file.uri, item.location.range);
		}
	}
}

class ReferencesTreeDataProvider implements vscode.TreeDataProvider<FileItem | ReferenceItem> {

	private readonly _listener: vscode.Disposable;
	private readonly _onDidChange = new vscode.EventEmitter<FileItem | ReferenceItem | undefined>();

	readonly onDidChangeTreeData = this._onDidChange.event;

	constructor(private readonly _model: ReferencesModel) {
		this._listener = _model.onDidChangeTreeData(() => this._onDidChange.fire(undefined));
	}

	dispose(): void {
		this._onDidChange.dispose();
		this._listener.dispose();
	}

	async getTreeItem(element: FileItem | ReferenceItem) {
		if (element instanceof FileItem) {
			// files
			const result = new vscode.TreeItem(element.uri);
			result.contextValue = 'file-item';
			result.description = true;
			result.iconPath = vscode.ThemeIcon.File;
			result.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
			return result;

		} else {
			// references
			const { range } = element.location;
			const doc = await element.getDocument(true);
			const { before, inside, after } = getPreviewChunks(doc, range);

			const label: vscode.TreeItemLabel = {
				label: before + inside + after,
				highlights: [[before.length, before.length + inside.length]]
			};

			const result = new vscode.TreeItem(label);
			result.collapsibleState = vscode.TreeItemCollapsibleState.None;
			result.contextValue = 'reference-item';
			result.command = {
				command: 'vscode.open',
				title: vscode.l10n.t('Open Reference'),
				arguments: [
					element.location.uri,
					{ selection: range.with({ end: range.start }) } satisfies vscode.TextDocumentShowOptions
				]
			};
			return result;
		}
	}

	async getChildren(element?: FileItem | ReferenceItem) {
		if (!element) {
			return this._model.items;
		}
		if (element instanceof FileItem) {
			return element.references;
		}
		return undefined;
	}

	getParent(element: FileItem | ReferenceItem) {
		return element instanceof ReferenceItem ? element.file : undefined;
	}
}

export class FileItem {

	constructor(
		readonly uri: vscode.Uri,
		readonly references: Array<ReferenceItem>,
		readonly model: ReferencesModel
	) { }

	// --- adapter

	remove(): void {
		this.model.remove(this);
	}

	async asCopyText() {
		let result = `${vscode.workspace.asRelativePath(this.uri)}\n`;
		for (const ref of this.references) {
			result += `  ${await ref.asCopyText()}\n`;
		}
		return result;
	}
}

export class ReferenceItem {

	private _document: Thenable<vscode.TextDocument> | undefined;

	constructor(
		readonly location: vscode.Location,
		readonly file: FileItem,
	) { }

	async getDocument(warmUpNext?: boolean) {
		if (!this._document) {
			this._document = vscode.workspace.openTextDocument(this.location.uri);
		}
		if (warmUpNext) {
			// load next document once this document has been loaded
			const next = this.file.model.next(this.file);
			if (next instanceof FileItem && next !== this.file) {
				vscode.workspace.openTextDocument(next.uri);
			} else if (next instanceof ReferenceItem) {
				vscode.workspace.openTextDocument(next.location.uri);
			}
		}
		return this._document;
	}

	// --- adapter

	remove(): void {
		this.file.model.remove(this);
	}

	async asCopyText() {
		const doc = await this.getDocument();
		const chunks = getPreviewChunks(doc, this.location.range, 21, false);
		return `${this.location.range.start.line + 1}, ${this.location.range.start.character + 1}: ${chunks.before + chunks.inside + chunks.after}`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/references-view/src/types/index.ts]---
Location: vscode-main/extensions/references-view/src/types/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { SymbolsTree } from '../tree';
import { ContextKey } from '../utils';
import { TypeHierarchyDirection, TypeItem, TypesTreeInput } from './model';

export function register(tree: SymbolsTree, context: vscode.ExtensionContext): void {

	const direction = new RichTypesDirection(context.workspaceState, TypeHierarchyDirection.Subtypes);

	function showTypeHierarchy() {
		if (vscode.window.activeTextEditor) {
			const input = new TypesTreeInput(new vscode.Location(vscode.window.activeTextEditor.document.uri, vscode.window.activeTextEditor.selection.active), direction.value);
			tree.setInput(input);
		}
	}

	function setTypeHierarchyDirection(value: TypeHierarchyDirection, anchor: TypeItem | vscode.Location | unknown) {
		direction.value = value;

		let newInput: TypesTreeInput | undefined;
		const oldInput = tree.getInput();
		if (anchor instanceof TypeItem) {
			newInput = new TypesTreeInput(new vscode.Location(anchor.item.uri, anchor.item.selectionRange.start), direction.value);
		} else if (anchor instanceof vscode.Location) {
			newInput = new TypesTreeInput(anchor, direction.value);
		} else if (oldInput instanceof TypesTreeInput) {
			newInput = new TypesTreeInput(oldInput.location, direction.value);
		}
		if (newInput) {
			tree.setInput(newInput);
		}
	}

	context.subscriptions.push(
		vscode.commands.registerCommand('references-view.showTypeHierarchy', showTypeHierarchy),
		vscode.commands.registerCommand('references-view.showSupertypes', (item: TypeItem | vscode.Location | unknown) => setTypeHierarchyDirection(TypeHierarchyDirection.Supertypes, item)),
		vscode.commands.registerCommand('references-view.showSubtypes', (item: TypeItem | vscode.Location | unknown) => setTypeHierarchyDirection(TypeHierarchyDirection.Subtypes, item)),
		vscode.commands.registerCommand('references-view.removeTypeItem', removeTypeItem)
	);
}

function removeTypeItem(item: TypeItem | unknown): void {
	if (item instanceof TypeItem) {
		item.remove();
	}
}

class RichTypesDirection {

	private static _key = 'references-view.typeHierarchyMode';

	private _ctxMode = new ContextKey<TypeHierarchyDirection>('references-view.typeHierarchyMode');

	constructor(
		private _mem: vscode.Memento,
		private _value: TypeHierarchyDirection = TypeHierarchyDirection.Subtypes,
	) {
		const raw = _mem.get<TypeHierarchyDirection>(RichTypesDirection._key);
		if (typeof raw === 'string') {
			this.value = raw;
		} else {
			this.value = _value;
		}
	}

	get value() {
		return this._value;
	}

	set value(value: TypeHierarchyDirection) {
		this._value = value;
		this._ctxMode.set(value);
		this._mem.update(RichTypesDirection._key, value);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/references-view/src/types/model.ts]---
Location: vscode-main/extensions/references-view/src/types/model.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { SymbolItemDragAndDrop, SymbolItemEditorHighlights, SymbolItemNavigation, SymbolTreeInput } from '../references-view';
import { asResourceUrl, del, getThemeIcon, tail } from '../utils';

export class TypesTreeInput implements SymbolTreeInput<TypeItem> {

	readonly title: string;
	readonly contextValue: string = 'typeHierarchy';

	constructor(
		readonly location: vscode.Location,
		readonly direction: TypeHierarchyDirection,
	) {
		this.title = direction === TypeHierarchyDirection.Supertypes
			? vscode.l10n.t('Supertypes Of')
			: vscode.l10n.t('Subtypes Of');
	}

	async resolve() {

		const items = await Promise.resolve(vscode.commands.executeCommand<vscode.TypeHierarchyItem[]>('vscode.prepareTypeHierarchy', this.location.uri, this.location.range.start));
		const model = new TypesModel(this.direction, items ?? []);
		const provider = new TypeItemDataProvider(model);

		if (model.roots.length === 0) {
			return;
		}

		return {
			provider,
			get message() { return model.roots.length === 0 ? vscode.l10n.t('No results.') : undefined; },
			navigation: model,
			highlights: model,
			dnd: model,
			dispose() {
				provider.dispose();
			}
		};
	}

	with(location: vscode.Location): TypesTreeInput {
		return new TypesTreeInput(location, this.direction);
	}
}


export const enum TypeHierarchyDirection {
	Subtypes = 'subtypes',
	Supertypes = 'supertypes'
}


export class TypeItem {

	children?: TypeItem[];

	constructor(
		readonly model: TypesModel,
		readonly item: vscode.TypeHierarchyItem,
		readonly parent: TypeItem | undefined,
	) { }

	remove(): void {
		this.model.remove(this);
	}
}

class TypesModel implements SymbolItemNavigation<TypeItem>, SymbolItemEditorHighlights<TypeItem>, SymbolItemDragAndDrop<TypeItem> {

	readonly roots: TypeItem[] = [];

	private readonly _onDidChange = new vscode.EventEmitter<TypesModel>();
	readonly onDidChange = this._onDidChange.event;

	constructor(readonly direction: TypeHierarchyDirection, items: vscode.TypeHierarchyItem[]) {
		this.roots = items.map(item => new TypeItem(this, item, undefined));
	}

	private async _resolveTypes(currentType: TypeItem): Promise<TypeItem[]> {
		if (this.direction === TypeHierarchyDirection.Supertypes) {
			const types = await vscode.commands.executeCommand<vscode.TypeHierarchyItem[]>('vscode.provideSupertypes', currentType.item);
			return types ? types.map(item => new TypeItem(this, item, currentType)) : [];
		} else {
			const types = await vscode.commands.executeCommand<vscode.TypeHierarchyItem[]>('vscode.provideSubtypes', currentType.item);
			return types ? types.map(item => new TypeItem(this, item, currentType)) : [];
		}
	}

	async getTypeChildren(item: TypeItem): Promise<TypeItem[]> {
		if (!item.children) {
			item.children = await this._resolveTypes(item);
		}
		return item.children;
	}

	// -- dnd

	getDragUri(item: TypeItem): vscode.Uri | undefined {
		return asResourceUrl(item.item.uri, item.item.range);
	}

	// -- navigation

	location(currentType: TypeItem) {
		return new vscode.Location(currentType.item.uri, currentType.item.range);
	}

	nearest(uri: vscode.Uri, _position: vscode.Position): TypeItem | undefined {
		return this.roots.find(item => item.item.uri.toString() === uri.toString()) ?? this.roots[0];
	}

	next(from: TypeItem): TypeItem {
		return this._move(from, true) ?? from;
	}

	previous(from: TypeItem): TypeItem {
		return this._move(from, false) ?? from;
	}

	private _move(item: TypeItem, fwd: boolean): TypeItem | void {
		if (item.children?.length) {
			return fwd ? item.children[0] : tail(item.children);
		}
		const array = this.roots.includes(item) ? this.roots : item.parent?.children;
		if (array?.length) {
			const idx = array.indexOf(item);
			const delta = fwd ? 1 : -1;
			return array[idx + delta + array.length % array.length];
		}
	}

	// --- highlights

	getEditorHighlights(currentType: TypeItem, uri: vscode.Uri): vscode.Range[] | undefined {
		return currentType.item.uri.toString() === uri.toString() ? [currentType.item.selectionRange] : undefined;
	}

	remove(item: TypeItem) {
		const isInRoot = this.roots.includes(item);
		const siblings = isInRoot ? this.roots : item.parent?.children;
		if (siblings) {
			del(siblings, item);
			this._onDidChange.fire(this);
		}
	}
}

class TypeItemDataProvider implements vscode.TreeDataProvider<TypeItem> {

	private readonly _emitter = new vscode.EventEmitter<TypeItem | undefined>();
	readonly onDidChangeTreeData = this._emitter.event;

	private readonly _modelListener: vscode.Disposable;

	constructor(private _model: TypesModel) {
		this._modelListener = _model.onDidChange(e => this._emitter.fire(e instanceof TypeItem ? e : undefined));
	}

	dispose(): void {
		this._emitter.dispose();
		this._modelListener.dispose();
	}

	getTreeItem(element: TypeItem): vscode.TreeItem {

		const item = new vscode.TreeItem(element.item.name);
		item.description = element.item.detail;
		item.contextValue = 'type-item';
		item.iconPath = getThemeIcon(element.item.kind);
		item.command = {
			command: 'vscode.open',
			title: vscode.l10n.t('Open Type'),
			arguments: [
				element.item.uri,
				{ selection: element.item.selectionRange.with({ end: element.item.selectionRange.start }) } satisfies vscode.TextDocumentShowOptions
			]
		};
		item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
		return item;
	}

	getChildren(element?: TypeItem | undefined) {
		return element
			? this._model.getTypeChildren(element)
			: this._model.roots;
	}

	getParent(element: TypeItem) {
		return element.parent;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/restructuredtext/.vscodeignore]---
Location: vscode-main/extensions/restructuredtext/.vscodeignore

```text
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/restructuredtext/cgmanifest.json]---
Location: vscode-main/extensions/restructuredtext/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "trond-snekvik/vscode-rst",
					"repositoryUrl": "https://github.com/trond-snekvik/vscode-rst",
					"commitHash": "7f2d6bb4e20642b60f2979afcb594cfe4b48117a"
				}
			},
			"license": "MIT",
			"version": "1.5.3"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/restructuredtext/language-configuration.json]---
Location: vscode-main/extensions/restructuredtext/language-configuration.json

```json
{
	"comments": {
		"lineComment": ".."
	},
	"brackets": [
		["(", ")"],
		["<", ">"],
		["[", "]"]
	],
	"surroundingPairs": [
		["(", ")"],
		["<", ">"],
		["`", "`"],
		["*", "*"],
		["|", "|"],
		["[", "]"]
	],
	"autoClosingPairs": [
		{ "open": "(", "close": ")" },
		{ "open": "<", "close": ">" },
		{ "open": "'", "close": "'"},
		{ "open": "`", "close": "`", "notIn": ["string"]},
		{ "open": "\"", "close": "\""},
		{ "open": "[", "close": "]"}
	],
	"autoCloseBefore": ":})>`\\n ",
	"onEnterRules": [
		{
			"beforeText": "^\\s*\\.\\. *$|(?<!:)::(\\s|$)",
			"action": { "indent": "indent" }
		}
	],
	"wordPattern": "[\\w-]*\\w[\\w-]*"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/restructuredtext/package.json]---
Location: vscode-main/extensions/restructuredtext/package.json

```json
{
	"name": "restructuredtext",
	"displayName": "%displayName%",
	"description": "%description%",
	"version": "1.0.0",
	"publisher": "vscode",
	"license": "MIT",
	"engines": {
		"vscode": "*"
	},
	"scripts": {
		"update-grammar": "node ../node_modules/vscode-grammar-updater/bin trond-snekvik/vscode-rst syntaxes/rst.tmLanguage.json ./syntaxes/rst.tmLanguage.json"
	},
	"categories": ["Programming Languages"],
	"contributes": {
		"languages": [
			{
				"id": "restructuredtext",
				"aliases": [
					"reStructuredText"
				],
				"configuration": "./language-configuration.json",
				"extensions": [
					".rst"
				]
			}
		],
		"grammars": [
			{
				"language": "restructuredtext",
				"scopeName": "source.rst",
				"path": "./syntaxes/rst.tmLanguage.json"
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

---[FILE: extensions/restructuredtext/package.nls.json]---
Location: vscode-main/extensions/restructuredtext/package.nls.json

```json
{
	"displayName": "reStructuredText Language Basics",
	"description": "Provides syntax highlighting in reStructuredText files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/restructuredtext/syntaxes/rst.tmLanguage.json]---
Location: vscode-main/extensions/restructuredtext/syntaxes/rst.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/trond-snekvik/vscode-rst/blob/master/syntaxes/rst.tmLanguage.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/trond-snekvik/vscode-rst/commit/7f2d6bb4e20642b60f2979afcb594cfe4b48117a",
	"scopeName": "source.rst",
	"patterns": [
		{
			"include": "#body"
		}
	],
	"repository": {
		"body": {
			"patterns": [
				{
					"include": "#title"
				},
				{
					"include": "#inline-markup"
				},
				{
					"include": "#anchor"
				},
				{
					"include": "#line-block"
				},
				{
					"include": "#replace-include"
				},
				{
					"include": "#footnote"
				},
				{
					"include": "#substitution"
				},
				{
					"include": "#blocks"
				},
				{
					"include": "#table"
				},
				{
					"include": "#simple-table"
				},
				{
					"include": "#options-list"
				}
			]
		},
		"title": {
			"match": "^(\\*{3,}|#{3,}|\\={3,}|~{3,}|\\+{3,}|-{3,}|`{3,}|\\^{3,}|:{3,}|\"{3,}|_{3,}|'{3,})$",
			"name": "markup.heading"
		},
		"inline-markup": {
			"patterns": [
				{
					"include": "#escaped"
				},
				{
					"include": "#ignore"
				},
				{
					"include": "#ref"
				},
				{
					"include": "#literal"
				},
				{
					"include": "#monospaced"
				},
				{
					"include": "#citation"
				},
				{
					"include": "#bold"
				},
				{
					"include": "#italic"
				},
				{
					"include": "#list"
				},
				{
					"include": "#macro"
				},
				{
					"include": "#reference"
				},
				{
					"include": "#footnote-ref"
				}
			]
		},
		"ignore": {
			"patterns": [
				{
					"match": "'[`*]+'"
				},
				{
					"match": "<[`*]+>"
				},
				{
					"match": "{[`*]+}"
				},
				{
					"match": "\\([`*]+\\)"
				},
				{
					"match": "\\[[`*]+\\]"
				},
				{
					"match": "\"[`*]+\""
				}
			]
		},
		"table": {
			"begin": "^\\s*\\+[=+-]+\\+\\s*$",
			"end": "^(?![+|])",
			"beginCaptures": {
				"0": {
					"name": "keyword.control.table"
				}
			},
			"patterns": [
				{
					"match": "[=+|-]",
					"name": "keyword.control.table"
				}
			]
		},
		"simple-table": {
			"match": "^[=\\s]+$",
			"name": "keyword.control.table"
		},
		"ref": {
			"begin": "(:ref:)`",
			"end": "`|^\\s*$",
			"name": "entity.name.tag",
			"beginCaptures": {
				"1": {
					"name": "keyword.control"
				}
			},
			"patterns": [
				{
					"match": "<.*?>",
					"name": "markup.underline.link"
				}
			]
		},
		"reference": {
			"match": "[\\w-]*[a-zA-Z\\d-]__?\\b",
			"name": "entity.name.tag"
		},
		"macro": {
			"match": "\\|[^\\|]+\\|",
			"name": "entity.name.tag"
		},
		"literal": {
			"match": "(:\\S+:)(`.*?`\\\\?)",
			"captures": {
				"1": {
					"name": "keyword.control"
				},
				"2": {
					"name": "entity.name.tag"
				}
			}
		},
		"monospaced": {
			"begin": "(?<=[\\s\"'(\\[{<]|^)``[^\\s`]",
			"end": "``|^\\s*$",
			"name": "string.interpolated"
		},
		"citation": {
			"begin": "(?<=[\\s\"'(\\[{<]|^)`[^\\s`]",
			"end": "`_{,2}|^\\s*$",
			"name": "entity.name.tag",
			"applyEndPatternLast": 0
		},
		"bold": {
			"begin": "(?<=[\\s\"'(\\[{<]|^)\\*{2}[^\\s*]",
			"end": "\\*{2}|^\\s*$",
			"name": "markup.bold"
		},
		"italic": {
			"begin": "(?<=[\\s\"'(\\[{<]|^)\\*[^\\s*]",
			"end": "\\*|^\\s*$",
			"name": "markup.italic"
		},
		"escaped": {
			"match": "\\\\.",
			"name": "constant.character.escape"
		},
		"list": {
			"match": "^\\s*(\\d+\\.|\\* -|[a-zA-Z#]\\.|[iIvVxXmMcC]+\\.|\\(\\d+\\)|\\d+\\)|[*+-])\\s+",
			"name": "keyword.control"
		},
		"line-block": {
			"match": "^\\|\\s+",
			"name": "keyword.control"
		},
		"raw-html": {
			"begin": "^(\\s*)(\\.{2}\\s+raw\\s*::)\\s+(html)\\s*$",
			"while": "^\\1(?=\\s)|^\\s*$",
			"beginCaptures": {
				"2": {
					"name": "keyword.control"
				},
				"3": {
					"name": "variable.parameter.html"
				}
			},
			"patterns": [
				{
					"include": "#block-param"
				},
				{
					"include": "text.html.derivative"
				}
			]
		},
		"anchor": {
			"match": "^\\.{2}\\s+(_[^:]+:)\\s*",
			"name": "entity.name.tag.anchor"
		},
		"replace-include": {
			"match": "^\\s*(\\.{2})\\s+(\\|[^\\|]+\\|)\\s+(replace::)",
			"captures": {
				"1": {
					"name": "keyword.control"
				},
				"2": {
					"name": "entity.name.tag"
				},
				"3": {
					"name": "keyword.control"
				}
			}
		},
		"footnote": {
			"match": "^\\s*\\.{2}\\s+\\[(?:[\\w\\.-]+|[#*]|#\\w+)\\]\\s+",
			"name": "entity.name.tag"
		},
		"footnote-ref": {
			"match": "\\[(?:[\\w\\.-]+|[#*])\\]_",
			"name": "entity.name.tag"
		},
		"substitution": {
			"match": "^\\.{2}\\s*\\|([^|]+)\\|",
			"name": "entity.name.tag"
		},
		"options-list": {
			"match": "(?:(?:^|,\\s+)(?:[-+]\\w|--?[a-zA-Z][\\w-]+|/\\w+)(?:[ =](?:\\w+|<[^<>]+?>))?)+(?=  |\\t|$)",
			"name": "variable.parameter"
		},
		"blocks": {
			"patterns": [
				{
					"include": "#domains"
				},
				{
					"include": "#doctest"
				},
				{
					"include": "#code-block-cpp"
				},
				{
					"include": "#code-block-py"
				},
				{
					"include": "#code-block-console"
				},
				{
					"include": "#code-block-javascript"
				},
				{
					"include": "#code-block-yaml"
				},
				{
					"include": "#code-block-cmake"
				},
				{
					"include": "#code-block-kconfig"
				},
				{
					"include": "#code-block-ruby"
				},
				{
					"include": "#code-block-dts"
				},
				{
					"include": "#code-block"
				},
				{
					"include": "#doctest-block"
				},
				{
					"include": "#raw-html"
				},
				{
					"include": "#block"
				},
				{
					"include": "#literal-block"
				},
				{
					"include": "#block-comment"
				}
			]
		},
		"block-comment": {
			"begin": "^(\\s*)\\.{2}(\\s+|$)",
			"end": "^(?=\\S)|^\\s*$",
			"name": "comment.block",
			"patterns": [
				{
					"begin": "^\\s{3,}(?=\\S)",
					"while": "^\\s{3}.*|^\\s*$",
					"name": "comment.block"
				}
			]
		},
		"literal-block": {
			"begin": "^(\\s*)(.*)(::)\\s*$",
			"while": "^\\1(?=\\s)|^\\s*$",
			"beginCaptures": {
				"2": {
					"patterns": [
						{
							"include": "#inline-markup"
						}
					]
				},
				"3": {
					"name": "keyword.control"
				}
			}
		},
		"block": {
			"begin": "^(\\s*)(\\.{2}\\s+\\S+::)(.*)",
			"end": "^(?!\\1\\s|\\s*$)",
			"beginCaptures": {
				"2": {
					"name": "keyword.control"
				},
				"3": {
					"name": "variable"
				}
			},
			"patterns": [
				{
					"include": "#block-param"
				},
				{
					"include": "#body"
				}
			]
		},
		"block-param": {
			"patterns": [
				{
					"match": "(:param\\s+(.+?):)(?:\\s|$)",
					"captures": {
						"1": {
							"name": "keyword.control"
						},
						"2": {
							"name": "variable.parameter"
						}
					}
				},
				{
					"match": "(:.+?:)(?:$|\\s+(.*))",
					"captures": {
						"1": {
							"name": "keyword.control"
						},
						"2": {
							"patterns": [
								{
									"match": "\\b(0x[a-fA-F\\d]+|\\d+)\\b",
									"name": "constant.numeric"
								},
								{
									"include": "#inline-markup"
								}
							]
						}
					}
				}
			]
		},
		"domains": {
			"patterns": [
				{
					"include": "#domain-cpp"
				},
				{
					"include": "#domain-py"
				},
				{
					"include": "#domain-auto"
				},
				{
					"include": "#domain-js"
				}
			]
		},
		"domain-cpp": {
			"begin": "^(\\s*)(\\.{2}\\s+(?:cpp|c):(?:class|struct|function|member|var|type|enum|enum-struct|enum-class|enumerator|union|concept)::)\\s*(?:(@\\w+)|(.*))",
			"while": "^\\1(?=\\s)|^\\s*$",
			"beginCaptures": {
				"2": {
					"name": "keyword.control"
				},
				"3": {
					"name": "entity.name.tag"
				},
				"4": {
					"patterns": [
						{
							"include": "source.cpp"
						}
					]
				}
			},
			"patterns": [
				{
					"include": "#block-param"
				},
				{
					"include": "#body"
				}
			]
		},
		"domain-py": {
			"begin": "^(\\s*)(\\.{2}\\s+py:(?:module|function|data|exception|class|attribute|property|method|staticmethod|classmethod|decorator|decoratormethod)::)\\s*(.*)",
			"while": "^\\1(?=\\s)|^\\s*$",
			"beginCaptures": {
				"2": {
					"name": "keyword.control"
				},
				"3": {
					"patterns": [
						{
							"include": "source.python"
						}
					]
				}
			},
			"patterns": [
				{
					"include": "#block-param"
				},
				{
					"include": "#body"
				}
			]
		},
		"domain-auto": {
			"begin": "^(\\s*)(\\.{2}\\s+auto(?:class|module|exception|function|decorator|data|method|attribute|property)::)\\s*(.*)",
			"while": "^\\1(?=\\s)|^\\s*$",
			"beginCaptures": {
				"2": {
					"name": "keyword.control.py"
				},
				"3": {
					"patterns": [
						{
							"include": "source.python"
						}
					]
				}
			},
			"patterns": [
				{
					"include": "#block-param"
				},
				{
					"include": "#body"
				}
			]
		},
		"domain-js": {
			"begin": "^(\\s*)(\\.{2}\\s+js:\\w+::)\\s*(.*)",
			"end": "^(?!\\1[ \\t]|$)",
			"beginCaptures": {
				"2": {
					"name": "keyword.control"
				},
				"3": {
					"patterns": [
						{
							"include": "source.js"
						}
					]
				}
			},
			"patterns": [
				{
					"include": "#block-param"
				},
				{
					"include": "#body"
				}
			]
		},
		"doctest": {
			"begin": "^(>>>)\\s*(.*)",
			"end": "^\\s*$",
			"beginCaptures": {
				"1": {
					"name": "keyword.control"
				},
				"2": {
					"patterns": [
						{
							"include": "source.python"
						}
					]
				}
			}
		},
		"code-block-cpp": {
			"begin": "^(\\s*)(\\.{2}\\s+(code|code-block)::)\\s*(c|c\\+\\+|cpp|C|C\\+\\+|CPP|Cpp)\\s*$",
			"while": "^\\1(?=\\s)|^\\s*$",
			"beginCaptures": {
				"2": {
					"name": "keyword.control"
				},
				"4": {
					"name": "variable.parameter.codeblock.cpp"
				}
			},
			"patterns": [
				{
					"include": "#block-param"
				},
				{
					"include": "source.cpp"
				}
			]
		},
		"code-block-console": {
			"begin": "^(\\s*)(\\.{2}\\s+(code|code-block)::)\\s*(console|shell|bash)\\s*$",
			"while": "^\\1(?=\\s)|^\\s*$",
			"beginCaptures": {
				"2": {
					"name": "keyword.control"
				},
				"4": {
					"name": "variable.parameter.codeblock.console"
				}
			},
			"patterns": [
				{
					"include": "#block-param"
				},
				{
					"include": "source.shell"
				}
			]
		},
		"code-block-py": {
			"begin": "^(\\s*)(\\.{2}\\s+(code|code-block)::)\\s*(python)\\s*$",
			"while": "^\\1(?=\\s)|^\\s*$",
			"beginCaptures": {
				"2": {
					"name": "keyword.control"
				},
				"4": {
					"name": "variable.parameter.codeblock.py"
				}
			},
			"patterns": [
				{
					"include": "#block-param"
				},
				{
					"include": "source.python"
				}
			]
		},
		"code-block-javascript": {
			"begin": "^(\\s*)(\\.{2}\\s+(code|code-block)::)\\s*(javascript)\\s*$",
			"while": "^\\1(?=\\s)|^\\s*$",
			"beginCaptures": {
				"2": {
					"name": "keyword.control"
				},
				"4": {
					"name": "variable.parameter.codeblock.js"
				}
			},
			"patterns": [
				{
					"include": "#block-param"
				},
				{
					"include": "source.js"
				}
			]
		},
		"code-block-yaml": {
			"begin": "^(\\s*)(\\.{2}\\s+(code|code-block)::)\\s*(ya?ml)\\s*$",
			"while": "^\\1(?=\\s)|^\\s*$",
			"beginCaptures": {
				"2": {
					"name": "keyword.control"
				},
				"4": {
					"name": "variable.parameter.codeblock.yaml"
				}
			},
			"patterns": [
				{
					"include": "#block-param"
				},
				{
					"include": "source.yaml"
				}
			]
		},
		"code-block-cmake": {
			"begin": "^(\\s*)(\\.{2}\\s+(code|code-block)::)\\s*(cmake)\\s*$",
			"while": "^\\1(?=\\s)|^\\s*$",
			"beginCaptures": {
				"2": {
					"name": "keyword.control"
				},
				"4": {
					"name": "variable.parameter.codeblock.cmake"
				}
			},
			"patterns": [
				{
					"include": "#block-param"
				},
				{
					"include": "source.cmake"
				}
			]
		},
		"code-block-kconfig": {
			"begin": "^(\\s*)(\\.{2}\\s+(code|code-block)::)\\s*([kK]config)\\s*$",
			"while": "^\\1(?=\\s)|^\\s*$",
			"beginCaptures": {
				"2": {
					"name": "keyword.control"
				},
				"4": {
					"name": "variable.parameter.codeblock.kconfig"
				}
			},
			"patterns": [
				{
					"include": "#block-param"
				},
				{
					"include": "source.kconfig"
				}
			]
		},
		"code-block-ruby": {
			"begin": "^(\\s*)(\\.{2}\\s+(code|code-block)::)\\s*(ruby)\\s*$",
			"while": "^\\1(?=\\s)|^\\s*$",
			"beginCaptures": {
				"2": {
					"name": "keyword.control"
				},
				"4": {
					"name": "variable.parameter.codeblock.ruby"
				}
			},
			"patterns": [
				{
					"include": "#block-param"
				},
				{
					"include": "source.ruby"
				}
			]
		},
		"code-block-dts": {
			"begin": "^(\\s*)(\\.{2}\\s+(code|code-block)::)\\s*(dts|DTS|devicetree)\\s*$",
			"while": "^\\1(?=\\s)|^\\s*$",
			"beginCaptures": {
				"2": {
					"name": "keyword.control"
				},
				"4": {
					"name": "variable.parameter.codeblock.dts"
				}
			},
			"patterns": [
				{
					"include": "#block-param"
				},
				{
					"include": "source.dts"
				}
			]
		},
		"code-block": {
			"begin": "^(\\s*)(\\.{2}\\s+(code|code-block)::)",
			"while": "^\\1(?=\\s)|^\\s*$",
			"beginCaptures": {
				"2": {
					"name": "keyword.control"
				}
			},
			"patterns": [
				{
					"include": "#block-param"
				}
			]
		},
		"doctest-block": {
			"begin": "^(\\s*)(\\.{2}\\s+doctest::)\\s*$",
			"while": "^\\1(?=\\s)|^\\s*$",
			"beginCaptures": {
				"2": {
					"name": "keyword.control"
				}
			},
			"patterns": [
				{
					"include": "#block-param"
				},
				{
					"include": "source.python"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ruby/.vscodeignore]---
Location: vscode-main/extensions/ruby/.vscodeignore

```text
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/ruby/cgmanifest.json]---
Location: vscode-main/extensions/ruby/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "Shopify/ruby-lsp",
					"repositoryUrl": "https://github.com/Shopify/ruby-lsp",
					"commitHash": "2d5552a22f71ac75086c7f03d404df51e23f6535"
				}
			},
			"licenseDetail": [
				"The MIT License (MIT)",
				"",
				"Copyright (c) 2022-present, Shopify Inc.",
				"",
				"Permission is hereby granted, free of charge, to any person obtaining a copy",
				"of this software and associated documentation files (the \"Software\"), to deal",
				"in the Software without restriction, including without limitation the rights",
				"to use, copy, modify, merge, publish, distribute, sublicense, and/or sell",
				"copies of the Software, and to permit persons to whom the Software is",
				"furnished to do so, subject to the following conditions:",
				"",
				"The above copyright notice and this permission notice shall be included in",
				"all copies or substantial portions of the Software.",
				"",
				"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
				"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,",
				"FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE",
				"AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER",
				"LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,",
				"OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN",
				"THE SOFTWARE.",
				"",
				"================================================================================",
				"The following files and related configuration in package.json are based on a",
				"sequence of adaptions: grammars/ruby.cson.json, grammars/erb.cson.json,",
				"languages/erb.json.",
				"",
				"Copyright (c) 2016 Peng Lv",
				"Copyright (c) 2017-2019 Stafford Brunk",
				"https://github.com/rubyide/vscode-ruby",
				"",
				"    Released under the MIT license",
				"    https://github.com/rubyide/vscode-ruby/blob/main/LICENSE.txt",
				"",
				"Copyright (c) 2014 GitHub Inc.",
				"https://github.com/atom/language-ruby",
				"",
				"    Released under the MIT license",
				"    https://github.com/atom/language-ruby/blob/master/LICENSE.md",
				"",
				"https://github.com/textmate/ruby.tmbundle",
				"    https://github.com/textmate/ruby.tmbundle#license"
			],
			"license": "MIT License",
			"version": "0.0.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ruby/language-configuration.json]---
Location: vscode-main/extensions/ruby/language-configuration.json

```json
{
	"comments": {
		"lineComment": "#",
		"blockComment": [ "=begin", "=end" ]
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
		{ "open": "'", "close": "'", "notIn": ["string"] },
		{ "open": "`", "close": "`", "notIn": ["string"] }
	],
	"surroundingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["\"", "\""],
		["'", "'"],
		["`", "`"]
	],
	"indentationRules": {
		"increaseIndentPattern": "^\\s*((begin|class|(private|protected)\\s+def|def|else|elsif|ensure|for|if|module|rescue|unless|until|when|in|while|case)|([^#]*\\sdo\\b)|([^#]*=\\s*(case|if|unless)))\\b([^#\\{;]|(\"|'|\/).*\\4)*(#.*)?$",
		"decreaseIndentPattern": "^\\s*([}\\]]([,)]?\\s*(#|$)|\\.[a-zA-Z_]\\w*\\b)|(end|rescue|ensure|else|elsif)\\b|(in|when)\\s)"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ruby/package.json]---
Location: vscode-main/extensions/ruby/package.json

```json
{
  "name": "ruby",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin Shopify/ruby-lsp vscode/grammars/ruby.cson.json ./syntaxes/ruby.tmLanguage.json"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "ruby",
        "extensions": [
          ".rb",
          ".rbx",
          ".rjs",
          ".gemspec",
          ".rake",
          ".ru",
          ".erb",
          ".podspec",
          ".rbi"
        ],
        "filenames": [
          "rakefile",
          "gemfile",
          "guardfile",
          "podfile",
          "capfile",
          "cheffile",
          "hobofile",
          "vagrantfile",
          "appraisals",
          "rantfile",
          "berksfile",
          "berksfile.lock",
          "thorfile",
          "puppetfile",
          "dangerfile",
          "brewfile",
          "fastfile",
          "appfile",
          "deliverfile",
          "matchfile",
          "scanfile",
          "snapfile",
          "gymfile"
        ],
        "aliases": [
          "Ruby",
          "rb"
        ],
        "firstLine": "^#!\\s*/.*\\bruby\\b",
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "ruby",
        "scopeName": "source.ruby",
        "path": "./syntaxes/ruby.tmLanguage.json"
      }
    ],
    "configurationDefaults": {
      "[ruby]": {
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

---[FILE: extensions/ruby/package.nls.json]---
Location: vscode-main/extensions/ruby/package.nls.json

```json
{
	"displayName": "Ruby Language Basics",
	"description": "Provides syntax highlighting and bracket matching in Ruby files."
}
```

--------------------------------------------------------------------------------

````
