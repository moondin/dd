---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 57
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 57 of 552)

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

---[FILE: extensions/latex/syntaxes/LaTeX.tmLanguage.json]---
Location: vscode-main/extensions/latex/syntaxes/LaTeX.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/jlelong/vscode-latex-basics/blob/master/syntaxes/LaTeX.tmLanguage.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/jlelong/vscode-latex-basics/commit/84ce12aa6be384369ff218ac25efb27e6f34e78c",
	"name": "LaTeX",
	"scopeName": "text.tex.latex",
	"patterns": [
		{
			"match": "(?<=\\\\[\\w@]|\\\\[\\w@]{2}|\\\\[\\w@]{3}|\\\\[\\w@]{4}|\\\\[\\w@]{5}|\\\\[\\w@]{6})\\s",
			"comment": "This scope identifies partially typed commands such as `\\tab`. We use this to trigger “Command Completion” only when it makes sense.",
			"name": "meta.space-after-command.latex"
		},
		{
			"include": "#songs-env"
		},
		{
			"include": "#embedded-code-env"
		},
		{
			"include": "#verbatim-env"
		},
		{
			"include": "#document-env"
		},
		{
			"include": "#all-balanced-env"
		},
		{
			"include": "#documentclass-usepackage-macro"
		},
		{
			"include": "#input-macro"
		},
		{
			"include": "#sections-macro"
		},
		{
			"include": "#hyperref-macro"
		},
		{
			"include": "#newcommand-macro"
		},
		{
			"include": "#text-font-macro"
		},
		{
			"include": "#citation-macro"
		},
		{
			"include": "#references-macro"
		},
		{
			"include": "#label-macro"
		},
		{
			"include": "#verb-macro"
		},
		{
			"include": "#inline-code-macro"
		},
		{
			"include": "#all-other-macro"
		},
		{
			"include": "#display-math"
		},
		{
			"include": "#inline-math"
		},
		{
			"include": "#column-specials"
		},
		{
			"include": "text.tex"
		}
	],
	"repository": {
		"documentclass-usepackage-macro": {
			"begin": "((\\\\)(?:usepackage|documentclass))\\b(?=\\[|\\{)",
			"beginCaptures": {
				"1": {
					"name": "keyword.control.preamble.latex"
				},
				"2": {
					"name": "punctuation.definition.function.latex"
				}
			},
			"end": "(?<=\\})",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.arguments.end.latex"
				}
			},
			"name": "meta.preamble.latex",
			"patterns": [
				{
					"include": "#multiline-optional-arg"
				},
				{
					"begin": "((?:\\G|(?<=\\]))\\{)",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.arguments.begin.latex"
						}
					},
					"contentName": "support.class.latex",
					"end": "(\\})",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.arguments.end.latex"
						}
					},
					"patterns": [
						{
							"include": "$self"
						}
					]
				}
			]
		},
		"document-env": {
			"patterns": [
				{
					"match": "(\\s*\\\\begin\\{document\\})",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"comment": "These two patterns match the \\begin{document} and \\end{document} commands, so that the environment matching pattern following them will ignore those commands.",
					"name": "meta.function.begin-document.latex"
				},
				{
					"match": "(\\s*\\\\end\\{document\\})",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"name": "meta.function.end-document.latex"
				}
			]
		},
		"input-macro": {
			"begin": "((\\\\)(?:include|input))(\\{)",
			"beginCaptures": {
				"1": {
					"name": "keyword.control.include.latex"
				},
				"2": {
					"name": "punctuation.definition.function.latex"
				},
				"3": {
					"name": "punctuation.definition.arguments.begin.latex"
				}
			},
			"end": "\\}",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.arguments.end.latex"
				}
			},
			"name": "meta.include.latex",
			"patterns": [
				{
					"include": "$self"
				}
			]
		},
		"sections-macro": {
			"begin": "((\\\\)((?:sub){0,2}section|(?:sub)?paragraph|chapter|part|addpart|addchap|addsec|minisec|frametitle)(?:\\*)?)((?:\\[[^\\[]*?\\]){0,2})(\\{)",
			"beginCaptures": {
				"1": {
					"name": "support.function.section.latex"
				},
				"2": {
					"name": "punctuation.definition.function.latex"
				},
				"4": {
					"patterns": [
						{
							"include": "#optional-arg-bracket"
						}
					]
				},
				"5": {
					"name": "punctuation.definition.arguments.begin.latex"
				}
			},
			"comment": "this works OK with all kinds of crazy stuff as long as section is one line",
			"contentName": "entity.name.section.latex",
			"end": "\\}",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.arguments.end.latex"
				}
			},
			"name": "meta.function.section.$3.latex",
			"patterns": [
				{
					"include": "text.tex#braces"
				},
				{
					"include": "$self"
				}
			]
		},
		"text-font-macro": {
			"patterns": [
				{
					"begin": "((\\\\)emph)(\\{)",
					"beginCaptures": {
						"1": {
							"name": "support.function.emph.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						},
						"3": {
							"name": "punctuation.definition.emph.begin.latex"
						}
					},
					"contentName": "markup.italic.emph.latex",
					"end": "\\}",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.emph.end.latex"
						}
					},
					"name": "meta.function.emph.latex",
					"patterns": [
						{
							"include": "text.tex#braces"
						},
						{
							"include": "$self"
						}
					]
				},
				{
					"begin": "((\\\\)textit)(\\{)",
					"captures": {
						"1": {
							"name": "support.function.textit.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						},
						"3": {
							"name": "punctuation.definition.textit.begin.latex"
						}
					},
					"comment": "We put the keyword in a capture and name this capture, so that disabling spell checking for “keyword” won't be inherited by the argument to \\textit{...}.\n\nPut specific matches for particular LaTeX keyword.functions before the last two more general functions",
					"contentName": "markup.italic.textit.latex",
					"end": "\\}",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.textit.end.latex"
						}
					},
					"name": "meta.function.textit.latex",
					"patterns": [
						{
							"include": "text.tex#braces"
						},
						{
							"include": "$self"
						}
					]
				},
				{
					"begin": "((\\\\)textbf)(\\{)",
					"captures": {
						"1": {
							"name": "support.function.textbf.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						},
						"3": {
							"name": "punctuation.definition.textbf.begin.latex"
						}
					},
					"contentName": "markup.bold.textbf.latex",
					"end": "\\}",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.textbf.end.latex"
						}
					},
					"name": "meta.function.textbf.latex",
					"patterns": [
						{
							"include": "text.tex#braces"
						},
						{
							"include": "$self"
						}
					]
				},
				{
					"begin": "((\\\\)texttt)(\\{)",
					"captures": {
						"1": {
							"name": "support.function.texttt.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						},
						"3": {
							"name": "punctuation.definition.texttt.begin.latex"
						}
					},
					"contentName": "markup.raw.texttt.latex",
					"end": "\\}",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.texttt.end.latex"
						}
					},
					"name": "meta.function.texttt.latex",
					"patterns": [
						{
							"include": "text.tex#braces"
						},
						{
							"include": "$self"
						}
					]
				}
			]
		},
		"songs-env": {
			"patterns": [
				{
					"begin": "(\\s*\\\\begin\\{songs\\}\\{.*\\})",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"contentName": "meta.data.environment.songs.latex",
					"end": "(\\\\end\\{songs\\}(?:\\s*\\n)?)",
					"name": "meta.function.environment.songs.latex",
					"patterns": [
						{
							"include": "text.tex.latex#songs-chords"
						}
					]
				},
				{
					"comment": "This scope applies songs-environment coloring between \\\\beginsong and \\\\endsong. Useful in separate files without \\\\begin{songs}.",
					"begin": "\\s*((\\\\)beginsong)(?=\\{)",
					"captures": {
						"1": {
							"name": "support.function.be.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						},
						"3": {
							"name": "punctuation.definition.arguments.begin.latex"
						},
						"4": {
							"name": "punctuation.definition.arguments.end.latex"
						}
					},
					"end": "((\\\\)endsong)(?:\\s*\\n)?",
					"name": "meta.function.environment.song.latex",
					"patterns": [
						{
							"include": "#multiline-arg-no-highlight"
						},
						{
							"include": "#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?:\\G|(?<=\\]|\\}))\\s*",
							"end": "\\s*(?=\\\\endsong)",
							"contentName": "meta.data.environment.song.latex",
							"patterns": [
								{
									"include": "text.tex.latex#songs-chords"
								}
							]
						}
					]
				}
			]
		},
		"embedded-code-env": {
			"patterns": [
				{
					"begin": "(?:^\\s*)?\\\\begin\\{(lstlisting|minted|pyglist)\\}(?=\\[|\\{)",
					"captures": {
						"0": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"end": "\\\\end\\{\\1\\}",
					"patterns": [
						{
							"include": "#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)((?:asy|asymptote))(\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								},
								"2": {
									"name": "variable.parameter.function.latex"
								},
								"3": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"end": "^\\s*(?=\\\\end\\{(?:minted|lstlisting|pyglist)\\})",
							"contentName": "source.asy",
							"patterns": [
								{
									"include": "source.asy"
								}
							]
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)((?:bash))(\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								},
								"2": {
									"name": "variable.parameter.function.latex"
								},
								"3": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"end": "^\\s*(?=\\\\end\\{(?:minted|lstlisting|pyglist)\\})",
							"contentName": "source.shell",
							"patterns": [
								{
									"include": "source.shell"
								}
							]
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)((?:c|cpp))(\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								},
								"2": {
									"name": "variable.parameter.function.latex"
								},
								"3": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"end": "^\\s*(?=\\\\end\\{(?:minted|lstlisting|pyglist)\\})",
							"contentName": "source.cpp.embedded.latex",
							"patterns": [
								{
									"include": "source.cpp.embedded.latex"
								}
							]
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)((?:css))(\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								},
								"2": {
									"name": "variable.parameter.function.latex"
								},
								"3": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"end": "^\\s*(?=\\\\end\\{(?:minted|lstlisting|pyglist)\\})",
							"contentName": "source.css",
							"patterns": [
								{
									"include": "source.css"
								}
							]
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)((?:gnuplot))(\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								},
								"2": {
									"name": "variable.parameter.function.latex"
								},
								"3": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"end": "^\\s*(?=\\\\end\\{(?:minted|lstlisting|pyglist)\\})",
							"contentName": "source.gnuplot",
							"patterns": [
								{
									"include": "source.gnuplot"
								}
							]
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)((?:hs|haskell))(\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								},
								"2": {
									"name": "variable.parameter.function.latex"
								},
								"3": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"end": "^\\s*(?=\\\\end\\{(?:minted|lstlisting|pyglist)\\})",
							"contentName": "source.haskell",
							"patterns": [
								{
									"include": "source.haskell"
								}
							]
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)((?:html))(\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								},
								"2": {
									"name": "variable.parameter.function.latex"
								},
								"3": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"end": "^\\s*(?=\\\\end\\{(?:minted|lstlisting|pyglist)\\})",
							"contentName": "text.html",
							"patterns": [
								{
									"include": "text.html.basic"
								}
							]
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)((?:java))(\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								},
								"2": {
									"name": "variable.parameter.function.latex"
								},
								"3": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"end": "^\\s*(?=\\\\end\\{(?:minted|lstlisting|pyglist)\\})",
							"contentName": "source.java",
							"patterns": [
								{
									"include": "source.java"
								}
							]
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)((?:jl|julia))(\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								},
								"2": {
									"name": "variable.parameter.function.latex"
								},
								"3": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"end": "^\\s*(?=\\\\end\\{(?:minted|lstlisting|pyglist)\\})",
							"contentName": "source.julia",
							"patterns": [
								{
									"include": "source.julia"
								}
							]
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)((?:js|javascript))(\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								},
								"2": {
									"name": "variable.parameter.function.latex"
								},
								"3": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"end": "^\\s*(?=\\\\end\\{(?:minted|lstlisting|pyglist)\\})",
							"contentName": "source.js",
							"patterns": [
								{
									"include": "source.js"
								}
							]
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)((?:lua))(\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								},
								"2": {
									"name": "variable.parameter.function.latex"
								},
								"3": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"end": "^\\s*(?=\\\\end\\{(?:minted|lstlisting|pyglist)\\})",
							"contentName": "source.lua",
							"patterns": [
								{
									"include": "source.lua"
								}
							]
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)((?:py|python|sage))(\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								},
								"2": {
									"name": "variable.parameter.function.latex"
								},
								"3": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"end": "^\\s*(?=\\\\end\\{(?:minted|lstlisting|pyglist)\\})",
							"contentName": "source.python",
							"patterns": [
								{
									"include": "source.python"
								}
							]
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)((?:rb|ruby))(\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								},
								"2": {
									"name": "variable.parameter.function.latex"
								},
								"3": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"end": "^\\s*(?=\\\\end\\{(?:minted|lstlisting|pyglist)\\})",
							"contentName": "source.ruby",
							"patterns": [
								{
									"include": "source.ruby"
								}
							]
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)((?:rust))(\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								},
								"2": {
									"name": "variable.parameter.function.latex"
								},
								"3": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"end": "^\\s*(?=\\\\end\\{(?:minted|lstlisting|pyglist)\\})",
							"contentName": "source.rust",
							"patterns": [
								{
									"include": "source.rust"
								}
							]
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)((?:ts|typescript))(\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								},
								"2": {
									"name": "variable.parameter.function.latex"
								},
								"3": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"end": "^\\s*(?=\\\\end\\{(?:minted|lstlisting|pyglist)\\})",
							"contentName": "source.ts",
							"patterns": [
								{
									"include": "source.ts"
								}
							]
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)((?:xml))(\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								},
								"2": {
									"name": "variable.parameter.function.latex"
								},
								"3": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"end": "^\\s*(?=\\\\end\\{(?:minted|lstlisting|pyglist)\\})",
							"contentName": "text.xml",
							"patterns": [
								{
									"include": "text.xml"
								}
							]
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)((?:yaml))(\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								},
								"2": {
									"name": "variable.parameter.function.latex"
								},
								"3": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"end": "^\\s*(?=\\\\end\\{(?:minted|lstlisting|pyglist)\\})",
							"contentName": "source.yaml",
							"patterns": [
								{
									"include": "source.yaml"
								}
							]
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)([a-zA-Z]*)(\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								},
								"2": {
									"name": "variable.parameter.function.latex"
								},
								"3": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "meta.function.embedded.latex",
							"end": "^\\s*(?=\\\\end\\{(?:lstlisting|minted|pyglist)\\})",
							"name": "meta.embedded.block.generic.latex"
						}
					]
				},
				{
					"begin": "\\s*\\\\begin\\{(?:asy|asycode)\\*?\\}(?:\\[[a-zA-Z0-9_-]*\\])?(?=\\[|\\{|\\s*$)",
					"end": "\\s*\\\\end\\{(?:asy|asycode)\\*?\\}",
					"captures": {
						"0": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"patterns": [
						{
							"include": "#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"end": "(\\})",
							"endCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "variable.parameter.function.latex"
						},
						{
							"begin": "^(?=\\s*)",
							"end": "^\\s*(?=\\\\end\\{(?:asy|asycode)\\*?\\})",
							"contentName": "source.asymptote",
							"patterns": [
								{
									"include": "source.asymptote"
								}
							]
						}
					]
				},
				{
					"begin": "\\s*\\\\begin\\{(?:cppcode)\\*?\\}(?:\\[[a-zA-Z0-9_-]*\\])?(?=\\[|\\{|\\s*$)",
					"end": "\\s*\\\\end\\{(?:cppcode)\\*?\\}",
					"captures": {
						"0": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"patterns": [
						{
							"include": "#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"end": "(\\})",
							"endCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "variable.parameter.function.latex"
						},
						{
							"begin": "^(?=\\s*)",
							"end": "^\\s*(?=\\\\end\\{(?:cppcode)\\*?\\})",
							"contentName": "source.cpp.embedded.latex",
							"patterns": [
								{
									"include": "source.cpp.embedded.latex"
								}
							]
						}
					]
				},
				{
					"begin": "\\s*\\\\begin\\{(?:dot2tex|dotcode)\\*?\\}(?:\\[[a-zA-Z0-9_-]*\\])?(?=\\[|\\{|\\s*$)",
					"end": "\\s*\\\\end\\{(?:dot2tex|dotcode)\\*?\\}",
					"captures": {
						"0": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"patterns": [
						{
							"include": "#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"end": "(\\})",
							"endCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "variable.parameter.function.latex"
						},
						{
							"begin": "^(?=\\s*)",
							"end": "^\\s*(?=\\\\end\\{(?:dot2tex|dotcode)\\*?\\})",
							"contentName": "source.dot",
							"patterns": [
								{
									"include": "source.dot"
								}
							]
						}
					]
				},
				{
					"begin": "\\s*\\\\begin\\{(?:gnuplot)\\*?\\}(?:\\[[a-zA-Z0-9_-]*\\])?(?=\\[|\\{|\\s*$)",
					"end": "\\s*\\\\end\\{(?:gnuplot)\\*?\\}",
					"captures": {
						"0": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"patterns": [
						{
							"include": "#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"end": "(\\})",
							"endCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "variable.parameter.function.latex"
						},
						{
							"begin": "^(?=\\s*)",
							"end": "^\\s*(?=\\\\end\\{(?:gnuplot)\\*?\\})",
							"contentName": "source.gnuplot",
							"patterns": [
								{
									"include": "source.gnuplot"
								}
							]
						}
					]
				},
				{
					"begin": "\\s*\\\\begin\\{(?:hscode)\\*?\\}(?:\\[[a-zA-Z0-9_-]*\\])?(?=\\[|\\{|\\s*$)",
					"end": "\\s*\\\\end\\{(?:hscode)\\*?\\}",
					"captures": {
						"0": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"patterns": [
						{
							"include": "#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"end": "(\\})",
							"endCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "variable.parameter.function.latex"
						},
						{
							"begin": "^(?=\\s*)",
							"end": "^\\s*(?=\\\\end\\{(?:hscode)\\*?\\})",
							"contentName": "source.haskell",
							"patterns": [
								{
									"include": "source.haskell"
								}
							]
						}
					]
				},
				{
					"begin": "\\s*\\\\begin\\{(?:javacode|javaverbatim|javablock|javaconcode|javaconsole|javaconverbatim)\\*?\\}(?:\\[[a-zA-Z0-9_-]*\\])?(?=\\[|\\{|\\s*$)",
					"end": "\\s*\\\\end\\{(?:javacode|javaverbatim|javablock|javaconcode|javaconsole|javaconverbatim)\\*?\\}",
					"captures": {
						"0": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"patterns": [
						{
							"include": "#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"end": "(\\})",
							"endCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "variable.parameter.function.latex"
						},
						{
							"begin": "^(?=\\s*)",
							"end": "^\\s*(?=\\\\end\\{(?:javacode|javaverbatim|javablock|javaconcode|javaconsole|javaconverbatim)\\*?\\})",
							"contentName": "source.java",
							"patterns": [
								{
									"include": "source.java"
								}
							]
						}
					]
				},
				{
					"begin": "\\s*\\\\begin\\{(?:jlcode|jlverbatim|jlblock|jlconcode|jlconsole|jlconverbatim)\\*?\\}(?:\\[[a-zA-Z0-9_-]*\\])?(?=\\[|\\{|\\s*$)",
					"end": "\\s*\\\\end\\{(?:jlcode|jlverbatim|jlblock|jlconcode|jlconsole|jlconverbatim)\\*?\\}",
					"captures": {
						"0": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"patterns": [
						{
							"include": "#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"end": "(\\})",
							"endCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "variable.parameter.function.latex"
						},
						{
							"begin": "^(?=\\s*)",
							"end": "^\\s*(?=\\\\end\\{(?:jlcode|jlverbatim|jlblock|jlconcode|jlconsole|jlconverbatim)\\*?\\})",
							"contentName": "source.julia",
							"patterns": [
								{
									"include": "source.julia"
								}
							]
						}
					]
				},
				{
					"begin": "\\s*\\\\begin\\{(?:juliacode|juliaverbatim|juliablock|juliaconcode|juliaconsole|juliaconverbatim)\\*?\\}(?:\\[[a-zA-Z0-9_-]*\\])?(?=\\[|\\{|\\s*$)",
					"end": "\\s*\\\\end\\{(?:juliacode|juliaverbatim|juliablock|juliaconcode|juliaconsole|juliaconverbatim)\\*?\\}",
					"captures": {
						"0": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"patterns": [
						{
							"include": "#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"end": "(\\})",
							"endCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "variable.parameter.function.latex"
						},
						{
							"begin": "^(?=\\s*)",
							"end": "^\\s*(?=\\\\end\\{(?:juliacode|juliaverbatim|juliablock|juliaconcode|juliaconsole|juliaconverbatim)\\*?\\})",
							"contentName": "source.julia",
							"patterns": [
								{
									"include": "source.julia"
								}
							]
						}
					]
				},
				{
					"begin": "\\s*\\\\begin\\{(?:luacode|luadraw)\\*?\\}(?:\\[[a-zA-Z0-9_-]*\\])?(?=\\[|\\{|\\s*$)",
					"end": "\\s*\\\\end\\{(?:luacode|luadraw)\\*?\\}",
					"captures": {
						"0": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"patterns": [
						{
							"include": "#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"end": "(\\})",
							"endCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "variable.parameter.function.latex"
						},
						{
							"begin": "^(?=\\s*)",
							"end": "^\\s*(?=\\\\end\\{(?:luacode|luadraw)\\*?\\})",
							"contentName": "source.lua",
							"patterns": [
								{
									"include": "source.lua"
								}
							]
						}
					]
				},
				{
					"begin": "\\s*\\\\begin\\{(?:pycode|pyverbatim|pyblock|pyconcode|pyconsole|pyconverbatim)\\*?\\}(?:\\[[a-zA-Z0-9_-]*\\])?(?=\\[|\\{|\\s*$)",
					"end": "\\s*\\\\end\\{(?:pycode|pyverbatim|pyblock|pyconcode|pyconsole|pyconverbatim)\\*?\\}",
					"captures": {
						"0": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"patterns": [
						{
							"include": "#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"end": "(\\})",
							"endCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "variable.parameter.function.latex"
						},
						{
							"begin": "^(?=\\s*)",
							"end": "^\\s*(?=\\\\end\\{(?:pycode|pyverbatim|pyblock|pyconcode|pyconsole|pyconverbatim)\\*?\\})",
							"contentName": "source.python",
							"patterns": [
								{
									"include": "source.python"
								}
							]
						}
					]
				},
				{
					"begin": "\\s*\\\\begin\\{(?:pylabcode|pylabverbatim|pylabblock|pylabconcode|pylabconsole|pylabconverbatim)\\*?\\}(?:\\[[a-zA-Z0-9_-]*\\])?(?=\\[|\\{|\\s*$)",
					"end": "\\s*\\\\end\\{(?:pylabcode|pylabverbatim|pylabblock|pylabconcode|pylabconsole|pylabconverbatim)\\*?\\}",
					"captures": {
						"0": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"patterns": [
						{
							"include": "#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"end": "(\\})",
							"endCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "variable.parameter.function.latex"
						},
						{
							"begin": "^(?=\\s*)",
							"end": "^\\s*(?=\\\\end\\{(?:pylabcode|pylabverbatim|pylabblock|pylabconcode|pylabconsole|pylabconverbatim)\\*?\\})",
							"contentName": "source.python",
							"patterns": [
								{
									"include": "source.python"
								}
							]
						}
					]
				},
				{
					"begin": "\\s*\\\\begin\\{(?:sageblock|sagesilent|sageverbatim|sageexample|sagecommandline|python|pythonq|pythonrepl)\\*?\\}(?:\\[[a-zA-Z0-9_-]*\\])?(?=\\[|\\{|\\s*$)",
					"end": "\\s*\\\\end\\{(?:sageblock|sagesilent|sageverbatim|sageexample|sagecommandline|python|pythonq|pythonrepl)\\*?\\}",
					"captures": {
						"0": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"patterns": [
						{
							"include": "#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"end": "(\\})",
							"endCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "variable.parameter.function.latex"
						},
						{
							"begin": "^(?=\\s*)",
							"end": "^\\s*(?=\\\\end\\{(?:sageblock|sagesilent|sageverbatim|sageexample|sagecommandline|python|pythonq|pythonrepl)\\*?\\})",
							"contentName": "source.python",
							"patterns": [
								{
									"include": "source.python"
								}
							]
						}
					]
				},
				{
					"begin": "\\s*\\\\begin\\{(?:scalacode)\\*?\\}(?:\\[[a-zA-Z0-9_-]*\\])?(?=\\[|\\{|\\s*$)",
					"end": "\\s*\\\\end\\{(?:scalacode)\\*?\\}",
					"captures": {
						"0": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"patterns": [
						{
							"include": "#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"end": "(\\})",
							"endCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "variable.parameter.function.latex"
						},
						{
							"begin": "^(?=\\s*)",
							"end": "^\\s*(?=\\\\end\\{(?:scalacode)\\*?\\})",
							"contentName": "source.scala",
							"patterns": [
								{
									"include": "source.scala"
								}
							]
						}
					]
				},
				{
					"begin": "\\s*\\\\begin\\{(?:sympycode|sympyverbatim|sympyblock|sympyconcode|sympyconsole|sympyconverbatim)\\*?\\}(?:\\[[a-zA-Z0-9_-]*\\])?(?=\\[|\\{|\\s*$)",
					"end": "\\s*\\\\end\\{(?:sympycode|sympyverbatim|sympyblock|sympyconcode|sympyconsole|sympyconverbatim)\\*?\\}",
					"captures": {
						"0": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"patterns": [
						{
							"include": "#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"end": "(\\})",
							"endCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "variable.parameter.function.latex"
						},
						{
							"begin": "^(?=\\s*)",
							"end": "^\\s*(?=\\\\end\\{(?:sympycode|sympyverbatim|sympyblock|sympyconcode|sympyconsole|sympyconverbatim)\\*?\\})",
							"contentName": "source.python",
							"patterns": [
								{
									"include": "source.python"
								}
							]
						}
					]
				},
				{
					"begin": "\\s*\\\\begin\\{((?:[a-zA-Z]*code|lstlisting|minted|pyglist)\\*?)\\}(?:\\[.*\\])?(?:\\{.*\\})?",
					"captures": {
						"0": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"contentName": "meta.function.embedded.latex",
					"end": "\\\\end\\{\\1\\}(?:\\s*\\n)?",
					"name": "meta.embedded.block.generic.latex"
				},
				{
					"begin": "((?:^\\s*)?\\\\begin\\{((?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?))\\})(?:\\[[^\\]]*\\]){,2}(?=\\{)",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"end": "(\\\\end\\{\\2\\})",
					"patterns": [
						{
							"begin": "\\G(\\{)(?:__|[a-z\\s]*)(?i:asy|asymptote)",
							"end": "(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"patterns": [
								{
									"begin": "\\G",
									"end": "(\\})\\s*$",
									"endCaptures": {
										"1": {
											"name": "punctuation.definition.arguments.end.latex"
										}
									},
									"patterns": [
										{
											"include": "text.tex#braces"
										},
										{
											"include": "$self"
										}
									]
								},
								{
									"begin": "^(\\s*)",
									"end": "^\\s*(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
									"contentName": "source.asy",
									"patterns": [
										{
											"include": "source.asy"
										}
									]
								}
							]
						},
						{
							"begin": "\\G(\\{)(?:__|[a-z\\s]*)(?i:bash)",
							"end": "(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"patterns": [
								{
									"begin": "\\G",
									"end": "(\\})\\s*$",
									"endCaptures": {
										"1": {
											"name": "punctuation.definition.arguments.end.latex"
										}
									},
									"patterns": [
										{
											"include": "text.tex#braces"
										},
										{
											"include": "$self"
										}
									]
								},
								{
									"begin": "^(\\s*)",
									"end": "^\\s*(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
									"contentName": "source.shell",
									"patterns": [
										{
											"include": "source.shell"
										}
									]
								}
							]
						},
						{
							"begin": "\\G(\\{)(?:__|[a-z\\s]*)(?i:c|cpp)",
							"end": "(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"patterns": [
								{
									"begin": "\\G",
									"end": "(\\})\\s*$",
									"endCaptures": {
										"1": {
											"name": "punctuation.definition.arguments.end.latex"
										}
									},
									"patterns": [
										{
											"include": "text.tex#braces"
										},
										{
											"include": "$self"
										}
									]
								},
								{
									"begin": "^(\\s*)",
									"end": "^\\s*(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
									"contentName": "source.cpp.embedded.latex",
									"patterns": [
										{
											"include": "source.cpp.embedded.latex"
										}
									]
								}
							]
						},
						{
							"begin": "\\G(\\{)(?:__|[a-z\\s]*)(?i:css)",
							"end": "(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"patterns": [
								{
									"begin": "\\G",
									"end": "(\\})\\s*$",
									"endCaptures": {
										"1": {
											"name": "punctuation.definition.arguments.end.latex"
										}
									},
									"patterns": [
										{
											"include": "text.tex#braces"
										},
										{
											"include": "$self"
										}
									]
								},
								{
									"begin": "^(\\s*)",
									"end": "^\\s*(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
									"contentName": "source.css",
									"patterns": [
										{
											"include": "source.css"
										}
									]
								}
							]
						},
						{
							"begin": "\\G(\\{)(?:__|[a-z\\s]*)(?i:gnuplot)",
							"end": "(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"patterns": [
								{
									"begin": "\\G",
									"end": "(\\})\\s*$",
									"endCaptures": {
										"1": {
											"name": "punctuation.definition.arguments.end.latex"
										}
									},
									"patterns": [
										{
											"include": "text.tex#braces"
										},
										{
											"include": "$self"
										}
									]
								},
								{
									"begin": "^(\\s*)",
									"end": "^\\s*(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
									"contentName": "source.gnuplot",
									"patterns": [
										{
											"include": "source.gnuplot"
										}
									]
								}
							]
						},
						{
							"begin": "\\G(\\{)(?:__|[a-z\\s]*)(?i:hs|haskell)",
							"end": "(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"patterns": [
								{
									"begin": "\\G",
									"end": "(\\})\\s*$",
									"endCaptures": {
										"1": {
											"name": "punctuation.definition.arguments.end.latex"
										}
									},
									"patterns": [
										{
											"include": "text.tex#braces"
										},
										{
											"include": "$self"
										}
									]
								},
								{
									"begin": "^(\\s*)",
									"end": "^\\s*(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
									"contentName": "source.haskell",
									"patterns": [
										{
											"include": "source.haskell"
										}
									]
								}
							]
						},
						{
							"begin": "\\G(\\{)(?:__|[a-z\\s]*)(?i:html)",
							"end": "(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"patterns": [
								{
									"begin": "\\G",
									"end": "(\\})\\s*$",
									"endCaptures": {
										"1": {
											"name": "punctuation.definition.arguments.end.latex"
										}
									},
									"patterns": [
										{
											"include": "text.tex#braces"
										},
										{
											"include": "$self"
										}
									]
								},
								{
									"begin": "^(\\s*)",
									"end": "^\\s*(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
									"contentName": "text.html",
									"patterns": [
										{
											"include": "text.html.basic"
										}
									]
								}
							]
						},
						{
							"begin": "\\G(\\{)(?:__|[a-z\\s]*)(?i:java)",
							"end": "(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"patterns": [
								{
									"begin": "\\G",
									"end": "(\\})\\s*$",
									"endCaptures": {
										"1": {
											"name": "punctuation.definition.arguments.end.latex"
										}
									},
									"patterns": [
										{
											"include": "text.tex#braces"
										},
										{
											"include": "$self"
										}
									]
								},
								{
									"begin": "^(\\s*)",
									"end": "^\\s*(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
									"contentName": "source.java",
									"patterns": [
										{
											"include": "source.java"
										}
									]
								}
							]
						},
						{
							"begin": "\\G(\\{)(?:__|[a-z\\s]*)(?i:jl|julia)",
							"end": "(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"patterns": [
								{
									"begin": "\\G",
									"end": "(\\})\\s*$",
									"endCaptures": {
										"1": {
											"name": "punctuation.definition.arguments.end.latex"
										}
									},
									"patterns": [
										{
											"include": "text.tex#braces"
										},
										{
											"include": "$self"
										}
									]
								},
								{
									"begin": "^(\\s*)",
									"end": "^\\s*(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
									"contentName": "source.julia",
									"patterns": [
										{
											"include": "source.julia"
										}
									]
								}
							]
						},
						{
							"begin": "\\G(\\{)(?:__|[a-z\\s]*)(?i:js|javascript)",
							"end": "(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"patterns": [
								{
									"begin": "\\G",
									"end": "(\\})\\s*$",
									"endCaptures": {
										"1": {
											"name": "punctuation.definition.arguments.end.latex"
										}
									},
									"patterns": [
										{
											"include": "text.tex#braces"
										},
										{
											"include": "$self"
										}
									]
								},
								{
									"begin": "^(\\s*)",
									"end": "^\\s*(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
									"contentName": "source.js",
									"patterns": [
										{
											"include": "source.js"
										}
									]
								}
							]
						},
						{
							"begin": "\\G(\\{)(?:__|[a-z\\s]*)(?i:lua)",
							"end": "(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"patterns": [
								{
									"begin": "\\G",
									"end": "(\\})\\s*$",
									"endCaptures": {
										"1": {
											"name": "punctuation.definition.arguments.end.latex"
										}
									},
									"patterns": [
										{
											"include": "text.tex#braces"
										},
										{
											"include": "$self"
										}
									]
								},
								{
									"begin": "^(\\s*)",
									"end": "^\\s*(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
									"contentName": "source.lua",
									"patterns": [
										{
											"include": "source.lua"
										}
									]
								}
							]
						},
						{
							"begin": "\\G(\\{)(?:__|[a-z\\s]*)(?i:py|python|sage)",
							"end": "(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"patterns": [
								{
									"begin": "\\G",
									"end": "(\\})\\s*$",
									"endCaptures": {
										"1": {
											"name": "punctuation.definition.arguments.end.latex"
										}
									},
									"patterns": [
										{
											"include": "text.tex#braces"
										},
										{
											"include": "$self"
										}
									]
								},
								{
									"begin": "^(\\s*)",
									"end": "^\\s*(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
									"contentName": "source.python",
									"patterns": [
										{
											"include": "source.python"
										}
									]
								}
							]
						},
						{
							"begin": "\\G(\\{)(?:__|[a-z\\s]*)(?i:rb|ruby)",
							"end": "(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"patterns": [
								{
									"begin": "\\G",
									"end": "(\\})\\s*$",
									"endCaptures": {
										"1": {
											"name": "punctuation.definition.arguments.end.latex"
										}
									},
									"patterns": [
										{
											"include": "text.tex#braces"
										},
										{
											"include": "$self"
										}
									]
								},
								{
									"begin": "^(\\s*)",
									"end": "^\\s*(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
									"contentName": "source.ruby",
									"patterns": [
										{
											"include": "source.ruby"
										}
									]
								}
							]
						},
						{
							"begin": "\\G(\\{)(?:__|[a-z\\s]*)(?i:rust)",
							"end": "(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"patterns": [
								{
									"begin": "\\G",
									"end": "(\\})\\s*$",
									"endCaptures": {
										"1": {
											"name": "punctuation.definition.arguments.end.latex"
										}
									},
									"patterns": [
										{
											"include": "text.tex#braces"
										},
										{
											"include": "$self"
										}
									]
								},
								{
									"begin": "^(\\s*)",
									"end": "^\\s*(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
									"contentName": "source.rust",
									"patterns": [
										{
											"include": "source.rust"
										}
									]
								}
							]
						},
						{
							"begin": "\\G(\\{)(?:__|[a-z\\s]*)(?i:ts|typescript)",
							"end": "(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"patterns": [
								{
									"begin": "\\G",
									"end": "(\\})\\s*$",
									"endCaptures": {
										"1": {
											"name": "punctuation.definition.arguments.end.latex"
										}
									},
									"patterns": [
										{
											"include": "text.tex#braces"
										},
										{
											"include": "$self"
										}
									]
								},
								{
									"begin": "^(\\s*)",
									"end": "^\\s*(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
									"contentName": "source.ts",
									"patterns": [
										{
											"include": "source.ts"
										}
									]
								}
							]
						},
						{
							"begin": "\\G(\\{)(?:__|[a-z\\s]*)(?i:xml)",
							"end": "(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"patterns": [
								{
									"begin": "\\G",
									"end": "(\\})\\s*$",
									"endCaptures": {
										"1": {
											"name": "punctuation.definition.arguments.end.latex"
										}
									},
									"patterns": [
										{
											"include": "text.tex#braces"
										},
										{
											"include": "$self"
										}
									]
								},
								{
									"begin": "^(\\s*)",
									"end": "^\\s*(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
									"contentName": "text.xml",
									"patterns": [
										{
											"include": "text.xml"
										}
									]
								}
							]
						},
						{
							"begin": "\\G(\\{)(?:__|[a-z\\s]*)(?i:yaml)",
							"end": "(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"patterns": [
								{
									"begin": "\\G",
									"end": "(\\})\\s*$",
									"endCaptures": {
										"1": {
											"name": "punctuation.definition.arguments.end.latex"
										}
									},
									"patterns": [
										{
											"include": "text.tex#braces"
										},
										{
											"include": "$self"
										}
									]
								},
								{
									"begin": "^(\\s*)",
									"end": "^\\s*(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
									"contentName": "source.yaml",
									"patterns": [
										{
											"include": "source.yaml"
										}
									]
								}
							]
						},
						{
							"begin": "\\G(\\{)(?:__|[a-z\\s]*)(?i:tikz|tikzpicture)",
							"end": "(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"patterns": [
								{
									"begin": "\\G",
									"end": "(\\})\\s*$",
									"endCaptures": {
										"1": {
											"name": "punctuation.definition.arguments.end.latex"
										}
									},
									"patterns": [
										{
											"include": "text.tex#braces"
										},
										{
											"include": "$self"
										}
									]
								},
								{
									"begin": "^(\\s*)",
									"end": "^\\s*(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
									"contentName": "text.tex.latex",
									"patterns": [
										{
											"include": "text.tex.latex"
										}
									]
								}
							]
						},
						{
							"begin": "\\G(\\{)",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"end": "(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
							"patterns": [
								{
									"begin": "\\G",
									"end": "(\\})\\s*$",
									"endCaptures": {
										"1": {
											"name": "punctuation.definition.arguments.end.latex"
										}
									},
									"patterns": [
										{
											"include": "text.tex#braces"
										},
										{
											"include": "$self"
										}
									]
								},
								{
									"begin": "^(\\s*)",
									"contentName": "meta.function.embedded.latex",
									"end": "^\\s*(?=\\\\end\\{(?:RobExt)?(?:CacheMeCode|PlaceholderPathFromCode\\*?|PlaceholderFromCode\\*?|SetPlaceholderCode\\*?)\\})",
									"name": "meta.embedded.block.generic.latex"
								}
							]
						}
					]
				},
				{
					"begin": "(?:^\\s*)?\\\\begin\\{(terminal\\*?)\\}(?=\\[|\\{)",
					"captures": {
						"0": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"end": "\\\\end\\{\\1\\}",
					"patterns": [
						{
							"include": "#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)([a-zA-Z]*)(\\})",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								},
								"2": {
									"name": "variable.parameter.function.latex"
								},
								"3": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "meta.function.embedded.latex",
							"end": "^\\s*(?=\\\\end\\{terminal\\*?\\})",
							"name": "meta.embedded.block.generic.latex"
						}
					]
				}
			]
		},
		"verbatim-env": {
			"patterns": [
				{
					"begin": "(\\s*\\\\begin\\{((?:fboxv|boxedv|V|v|spv)erbatim\\*?)\\})",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"contentName": "markup.raw.verbatim.latex",
					"end": "(\\\\end\\{\\2\\})",
					"name": "meta.function.verbatim.latex"
				},
				{
					"begin": "(\\s*\\\\begin\\{VerbatimOut\\}\\{[^\\}]*\\})",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"contentName": "markup.raw.verbatim.latex",
					"end": "(\\\\end\\{\\VerbatimOut\\})",
					"name": "meta.function.verbatim.latex"
				},
				{
					"begin": "(\\s*\\\\begin\\{alltt\\})",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"contentName": "markup.raw.verbatim.latex",
					"end": "(\\\\end\\{alltt\\})",
					"name": "meta.function.alltt.latex",
					"patterns": [
						{
							"captures": {
								"1": {
									"name": "punctuation.definition.function.latex"
								}
							},
							"match": "(\\\\)[A-Za-z]+",
							"name": "support.function.general.latex"
						}
					]
				},
				{
					"begin": "(\\s*\\\\begin\\{([Cc]omment)\\})",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"contentName": "comment.line.percentage.latex",
					"end": "(\\\\end\\{\\2\\})",
					"name": "meta.function.verbatim.latex"
				}
			]
		},
		"hyperref-macro": {
			"patterns": [
				{
					"begin": "(?:\\s*)((\\\\)(?:href|hyperref|hyperimage))(?=\\[|\\{)",
					"beginCaptures": {
						"1": {
							"name": "support.function.url.latex"
						}
					},
					"comment": "Captures \\command[option]{url}{optional category}{optional name}{text}",
					"end": "(\\})",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.arguments.end.latex"
						}
					},
					"name": "meta.function.hyperlink.latex",
					"patterns": [
						{
							"include": "#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?:\\G|(?<=\\]))(\\{)([^}]*)(\\})(?:\\{[^}]*\\}){2}?(\\{)",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								},
								"2": {
									"name": "markup.underline.link.latex"
								},
								"3": {
									"name": "punctuation.definition.arguments.end.latex"
								},
								"4": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"contentName": "meta.variable.parameter.function.latex",
							"end": "(?=\\})",
							"patterns": [
								{
									"include": "$self"
								}
							]
						},
						{
							"begin": "(?:\\G|(?<=\\]))(?:(\\{)[^}]*(\\}))?(\\{)",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.arguments.begin.latex"
								},
								"2": {
									"name": "punctuation.definition.arguments.end.latex"
								},
								"3": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"contentName": "meta.variable.parameter.function.latex",
							"end": "(?=\\})",
							"patterns": [
								{
									"include": "$self"
								}
							]
						}
					]
				},
				{
					"match": "(?:\\s*)((\\\\)(?:url|path))(\\{)([^}]*)(\\})",
					"captures": {
						"1": {
							"name": "support.function.url.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						},
						"3": {
							"name": "punctuation.definition.arguments.begin.latex"
						},
						"4": {
							"name": "markup.underline.link.latex"
						},
						"5": {
							"name": "punctuation.definition.arguments.end.latex"
						}
					},
					"name": "meta.function.link.url.latex"
				}
			]
		},
		"inline-code-macro": {
			"patterns": [
				{
					"begin": "((\\\\)addplot)(?:\\+?)((?:\\[[^\\[]*\\]))*\\s*(gnuplot)\\s*((?:\\[[^\\[]*\\]))*\\s*(\\{)",
					"captures": {
						"1": {
							"name": "support.function.be.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						},
						"3": {
							"patterns": [
								{
									"include": "#optional-arg-bracket"
								}
							]
						},
						"4": {
							"name": "variable.parameter.function.latex"
						},
						"5": {
							"patterns": [
								{
									"include": "#optional-arg-bracket"
								}
							]
						},
						"6": {
							"name": "punctuation.definition.arguments.begin.latex"
						}
					},
					"end": "\\s*(\\};)",
					"patterns": [
						{
							"begin": "%",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.comment.latex"
								}
							},
							"end": "$\\n?",
							"name": "comment.line.percentage.latex"
						},
						{
							"include": "source.gnuplot"
						}
					]
				},
				{
					"match": "((\\\\)(?:mint|mintinline))((?:\\[[^\\[]*?\\])?)(\\{)[a-zA-Z]*(\\})(?:(?:([^a-zA-Z\\{])(.*?)(\\6))|(?:(\\{)(.*?)(\\})))",
					"captures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						},
						"3": {
							"patterns": [
								{
									"include": "#optional-arg-bracket"
								}
							]
						},
						"4": {
							"name": "punctuation.definition.arguments.begin.latex"
						},
						"5": {
							"name": "punctuation.definition.arguments.end.latex"
						},
						"6": {
							"name": "punctuation.definition.verb.latex"
						},
						"7": {
							"name": "markup.raw.verb.latex"
						},
						"8": {
							"name": "punctuation.definition.verb.latex"
						},
						"9": {
							"name": "punctuation.definition.verb.latex"
						},
						"10": {
							"name": "markup.raw.verb.latex"
						},
						"11": {
							"name": "punctuation.definition.verb.latex"
						}
					},
					"name": "meta.function.verb.latex"
				},
				{
					"match": "((\\\\)[a-z]+inline)((?:\\[[^\\[]*?\\])?)(?:(?:([^a-zA-Z\\{])(.*?)(\\4))|(?:(\\{)(.*?)(\\})))",
					"captures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						},
						"3": {
							"patterns": [
								{
									"include": "#optional-arg-bracket"
								}
							]
						},
						"4": {
							"name": "punctuation.definition.verb.latex"
						},
						"5": {
							"name": "markup.raw.verb.latex"
						},
						"6": {
							"name": "punctuation.definition.verb.latex"
						},
						"7": {
							"name": "punctuation.definition.verb.latex"
						},
						"8": {
							"name": "markup.raw.verb.latex"
						},
						"9": {
							"name": "punctuation.definition.verb.latex"
						}
					},
					"name": "meta.function.verb.latex"
				},
				{
					"match": "((\\\\)(?:(?:py|pycon|pylab|pylabcon|sympy|sympycon)[cv]?|pyq|pycq|pyif))((?:\\[[^\\[]*?\\])?)(?:(?:([^a-zA-Z\\{])(.*?)(\\4))|(?:(\\{)(.*?)(\\})))",
					"captures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						},
						"3": {
							"patterns": [
								{
									"include": "#optional-arg-bracket"
								}
							]
						},
						"4": {
							"name": "punctuation.definition.verb.latex"
						},
						"5": {
							"name": "source.python",
							"patterns": [
								{
									"include": "source.python"
								}
							]
						},
						"6": {
							"name": "punctuation.definition.verb.latex"
						},
						"7": {
							"name": "punctuation.definition.verb.latex"
						},
						"8": {
							"name": "source.python",
							"patterns": [
								{
									"include": "source.python"
								}
							]
						},
						"9": {
							"name": "punctuation.definition.verb.latex"
						}
					},
					"name": "meta.function.verb.latex"
				},
				{
					"match": "((\\\\)(?:jl|julia)[cv]?)((?:\\[[^\\[]*?\\])?)(?:(?:([^a-zA-Z\\{])(.*?)(\\4))|(?:(\\{)(.*?)(\\})))",
					"captures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						},
						"3": {
							"patterns": [
								{
									"include": "#optional-arg-bracket"
								}
							]
						},
						"4": {
							"name": "punctuation.definition.verb.latex"
						},
						"5": {
							"name": "source.julia",
							"patterns": [
								{
									"include": "source.julia"
								}
							]
						},
						"6": {
							"name": "punctuation.definition.verb.latex"
						},
						"7": {
							"name": "punctuation.definition.verb.latex"
						},
						"8": {
							"name": "source.julia",
							"patterns": [
								{
									"include": "source.julia"
								}
							]
						},
						"9": {
							"name": "punctuation.definition.verb.latex"
						}
					},
					"name": "meta.function.verb.latex"
				},
				{
					"begin": "((\\\\)(?:directlua|luadirect|luaexec))(\\{)",
					"beginCaptures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						},
						"3": {
							"name": "punctuation.definition.arguments.begin.latex"
						}
					},
					"end": "\\}",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.arguments.end.latex"
						}
					},
					"contentName": "source.lua",
					"patterns": [
						{
							"include": "source.lua"
						},
						{
							"include": "text.tex#braces"
						}
					]
				},
				{
					"begin": "((\\\\)cacheMeCode)(?=\\[(?i:asy|asymptote)\\b|\\{)",
					"end": "(?<=\\})",
					"beginCaptures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						}
					},
					"patterns": [
						{
							"include": "text.tex.latex#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?<=\\])(\\{)",
							"end": "\\}",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "source.asy",
							"patterns": [
								{
									"include": "source.asy"
								}
							]
						}
					]
				},
				{
					"begin": "((\\\\)cacheMeCode)(?=\\[(?i:bash)\\b|\\{)",
					"end": "(?<=\\})",
					"beginCaptures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						}
					},
					"patterns": [
						{
							"include": "text.tex.latex#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?<=\\])(\\{)",
							"end": "\\}",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "source.shell",
							"patterns": [
								{
									"include": "source.shell"
								}
							]
						}
					]
				},
				{
					"begin": "((\\\\)cacheMeCode)(?=\\[(?i:c|cpp)\\b|\\{)",
					"end": "(?<=\\})",
					"beginCaptures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						}
					},
					"patterns": [
						{
							"include": "text.tex.latex#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?<=\\])(\\{)",
							"end": "\\}",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "source.cpp.embedded.latex",
							"patterns": [
								{
									"include": "source.cpp.embedded.latex"
								}
							]
						}
					]
				},
				{
					"begin": "((\\\\)cacheMeCode)(?=\\[(?i:css)\\b|\\{)",
					"end": "(?<=\\})",
					"beginCaptures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						}
					},
					"patterns": [
						{
							"include": "text.tex.latex#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?<=\\])(\\{)",
							"end": "\\}",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "source.css",
							"patterns": [
								{
									"include": "source.css"
								}
							]
						}
					]
				},
				{
					"begin": "((\\\\)cacheMeCode)(?=\\[(?i:gnuplot)\\b|\\{)",
					"end": "(?<=\\})",
					"beginCaptures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						}
					},
					"patterns": [
						{
							"include": "text.tex.latex#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?<=\\])(\\{)",
							"end": "\\}",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "source.gnuplot",
							"patterns": [
								{
									"include": "source.gnuplot"
								}
							]
						}
					]
				},
				{
					"begin": "((\\\\)cacheMeCode)(?=\\[(?i:hs|haskell)\\b|\\{)",
					"end": "(?<=\\})",
					"beginCaptures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						}
					},
					"patterns": [
						{
							"include": "text.tex.latex#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?<=\\])(\\{)",
							"end": "\\}",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "source.haskell",
							"patterns": [
								{
									"include": "source.haskell"
								}
							]
						}
					]
				},
				{
					"begin": "((\\\\)cacheMeCode)(?=\\[(?i:html)\\b|\\{)",
					"end": "(?<=\\})",
					"beginCaptures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						}
					},
					"patterns": [
						{
							"include": "text.tex.latex#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?<=\\])(\\{)",
							"end": "\\}",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "text.html",
							"patterns": [
								{
									"include": "text.html.basic"
								}
							]
						}
					]
				},
				{
					"begin": "((\\\\)cacheMeCode)(?=\\[(?i:java)\\b|\\{)",
					"end": "(?<=\\})",
					"beginCaptures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						}
					},
					"patterns": [
						{
							"include": "text.tex.latex#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?<=\\])(\\{)",
							"end": "\\}",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "source.java",
							"patterns": [
								{
									"include": "source.java"
								}
							]
						}
					]
				},
				{
					"begin": "((\\\\)cacheMeCode)(?=\\[(?i:jl|julia)\\b|\\{)",
					"end": "(?<=\\})",
					"beginCaptures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						}
					},
					"patterns": [
						{
							"include": "text.tex.latex#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?<=\\])(\\{)",
							"end": "\\}",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "source.julia",
							"patterns": [
								{
									"include": "source.julia"
								}
							]
						}
					]
				},
				{
					"begin": "((\\\\)cacheMeCode)(?=\\[(?i:js|javascript)\\b|\\{)",
					"end": "(?<=\\})",
					"beginCaptures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						}
					},
					"patterns": [
						{
							"include": "text.tex.latex#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?<=\\])(\\{)",
							"end": "\\}",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "source.js",
							"patterns": [
								{
									"include": "source.js"
								}
							]
						}
					]
				},
				{
					"begin": "((\\\\)cacheMeCode)(?=\\[(?i:lua)\\b|\\{)",
					"end": "(?<=\\})",
					"beginCaptures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						}
					},
					"patterns": [
						{
							"include": "text.tex.latex#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?<=\\])(\\{)",
							"end": "\\}",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "source.lua",
							"patterns": [
								{
									"include": "source.lua"
								}
							]
						}
					]
				},
				{
					"begin": "((\\\\)cacheMeCode)(?=\\[(?i:py|python|sage)\\b|\\{)",
					"end": "(?<=\\})",
					"beginCaptures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						}
					},
					"patterns": [
						{
							"include": "text.tex.latex#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?<=\\])(\\{)",
							"end": "\\}",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "source.python",
							"patterns": [
								{
									"include": "source.python"
								}
							]
						}
					]
				},
				{
					"begin": "((\\\\)cacheMeCode)(?=\\[(?i:rb|ruby)\\b|\\{)",
					"end": "(?<=\\})",
					"beginCaptures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						}
					},
					"patterns": [
						{
							"include": "text.tex.latex#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?<=\\])(\\{)",
							"end": "\\}",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "source.ruby",
							"patterns": [
								{
									"include": "source.ruby"
								}
							]
						}
					]
				},
				{
					"begin": "((\\\\)cacheMeCode)(?=\\[(?i:rust)\\b|\\{)",
					"end": "(?<=\\})",
					"beginCaptures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						}
					},
					"patterns": [
						{
							"include": "text.tex.latex#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?<=\\])(\\{)",
							"end": "\\}",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "source.rust",
							"patterns": [
								{
									"include": "source.rust"
								}
							]
						}
					]
				},
				{
					"begin": "((\\\\)cacheMeCode)(?=\\[(?i:ts|typescript)\\b|\\{)",
					"end": "(?<=\\})",
					"beginCaptures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						}
					},
					"patterns": [
						{
							"include": "text.tex.latex#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?<=\\])(\\{)",
							"end": "\\}",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "source.ts",
							"patterns": [
								{
									"include": "source.ts"
								}
							]
						}
					]
				},
				{
					"begin": "((\\\\)cacheMeCode)(?=\\[(?i:xml)\\b|\\{)",
					"end": "(?<=\\})",
					"beginCaptures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						}
					},
					"patterns": [
						{
							"include": "text.tex.latex#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?<=\\])(\\{)",
							"end": "\\}",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "text.xml",
							"patterns": [
								{
									"include": "text.xml"
								}
							]
						}
					]
				},
				{
					"begin": "((\\\\)cacheMeCode)(?=\\[(?i:yaml)\\b|\\{)",
					"end": "(?<=\\})",
					"beginCaptures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						}
					},
					"patterns": [
						{
							"include": "text.tex.latex#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?<=\\])(\\{)",
							"end": "\\}",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "source.yaml",
							"patterns": [
								{
									"include": "source.yaml"
								}
							]
						}
					]
				},
				{
					"begin": "((\\\\)cacheMeCode)(?=\\[(?i:tikz|tikzpicture)\\b|\\{)",
					"end": "(?<=\\})",
					"beginCaptures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						}
					},
					"patterns": [
						{
							"include": "text.tex.latex#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?<=\\])(\\{)",
							"end": "\\}",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "text.tex.latex",
							"patterns": [
								{
									"include": "text.tex.latex"
								}
							]
						}
					]
				},
				{
					"begin": "((\\\\)cacheMeCode)(?=\\[|\\{)",
					"end": "(?<=\\})",
					"beginCaptures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						}
					},
					"patterns": [
						{
							"include": "text.tex.latex#multiline-optional-arg-no-highlight"
						},
						{
							"begin": "(?<=\\])(\\{)",
							"end": "\\}",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.begin.latex"
								}
							},
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.arguments.end.latex"
								}
							},
							"contentName": "meta.embedded.block.generic.latex",
							"patterns": [
								{
									"include": "text.tex#braces"
								}
							]
						}
					]
				}
			]
		},
		"citation-macro": {
			"begin": "((\\\\)(?:[aA]uto|foot|full|no|ref|short|[tT]ext|[pP]aren|[sS]mart)?[cC]ite(?:al)?(?:p|s|t|author|year(?:par)?|title)?[ANP]*\\*?)((?:(?:\\([^\\)]*\\)){0,2}(?:\\[[^\\]]*\\]){0,2}\\{[\\p{Alphabetic}\\p{Number}_:.-]*\\})*)(<[^\\]<>]*>)?((?:\\[[^\\]]*\\])*)(\\{)",
			"captures": {
				"1": {
					"name": "keyword.control.cite.latex"
				},
				"2": {
					"name": "punctuation.definition.keyword.latex"
				},
				"3": {
					"patterns": [
						{
							"include": "#autocites-arg"
						}
					]
				},
				"4": {
					"patterns": [
						{
							"include": "#optional-arg-angle-no-highlight"
						}
					]
				},
				"5": {
					"patterns": [
						{
							"include": "#optional-arg-bracket-no-highlight"
						}
					]
				},
				"6": {
					"name": "punctuation.definition.arguments.begin.latex"
				}
			},
			"end": "\\}",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.arguments.end.latex"
				}
			},
			"name": "meta.citation.latex",
			"patterns": [
				{
					"match": "((%).*)$",
					"captures": {
						"1": {
							"name": "comment.line.percentage.tex"
						},
						"2": {
							"name": "punctuation.definition.comment.tex"
						}
					}
				},
				{
					"match": "[\\p{Alphabetic}\\p{Number}:.-]+",
					"name": "constant.other.reference.citation.latex"
				}
			]
		},
		"references-macro": {
			"patterns": [
				{
					"begin": "((\\\\)(?:\\w*[rR]ef\\*?))(?:\\[[^\\]]*\\])?(\\{)",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.ref.latex"
						},
						"2": {
							"name": "punctuation.definition.keyword.latex"
						},
						"3": {
							"name": "punctuation.definition.arguments.begin.latex"
						}
					},
					"end": "\\}",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.arguments.end.latex"
						}
					},
					"name": "meta.reference.label.latex",
					"patterns": [
						{
							"match": "[\\p{Alphabetic}\\p{Number}\\.,:/*!^_-]+",
							"name": "constant.other.reference.label.latex"
						}
					]
				},
				{
					"match": "((\\\\)(?:\\w*[rR]efrange\\*?))(?:\\[[^\\]]*\\])?(\\{)([\\p{Alphabetic}\\p{Number}\\.,:/*!^_-]+)(\\})(\\{)([\\p{Alphabetic}\\p{Number}\\.,:/*!^_-]+)(\\})",
					"captures": {
						"1": {
							"name": "keyword.control.ref.latex"
						},
						"2": {
							"name": "punctuation.definition.keyword.latex"
						},
						"3": {
							"name": "punctuation.definition.arguments.begin.latex"
						},
						"4": {
							"name": "constant.other.reference.label.latex"
						},
						"5": {
							"name": "punctuation.definition.arguments.end.latex"
						},
						"6": {
							"name": "punctuation.definition.arguments.begin.latex"
						},
						"7": {
							"name": "constant.other.reference.label.latex"
						},
						"8": {
							"name": "punctuation.definition.arguments.end.latex"
						}
					}
				},
				{
					"begin": "((\\\\)bibentry)(\\{)",
					"captures": {
						"1": {
							"name": "keyword.control.cite.latex"
						},
						"2": {
							"name": "punctuation.definition.keyword.latex"
						},
						"3": {
							"name": "punctuation.definition.arguments.begin.latex"
						}
					},
					"end": "\\}",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.arguments.end.latex"
						}
					},
					"name": "meta.citation.latex",
					"patterns": [
						{
							"match": "[\\p{Alphabetic}\\p{Number}:.]+",
							"name": "constant.other.reference.citation.latex"
						}
					]
				}
			]
		},
		"display-math": {
			"patterns": [
				{
					"begin": "\\\\\\[",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.latex"
						}
					},
					"end": "\\\\\\]",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.latex"
						}
					},
					"name": "meta.math.block.latex support.class.math.block.environment.latex",
					"patterns": [
						{
							"include": "text.tex#math-content"
						},
						{
							"include": "$self"
						}
					]
				},
				{
					"begin": "\\$\\$",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.latex"
						}
					},
					"end": "\\$\\$",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.latex"
						}
					},
					"name": "meta.math.block.latex support.class.math.block.environment.latex",
					"patterns": [
						{
							"match": "\\\\\\$",
							"name": "constant.character.escape.latex"
						},
						{
							"include": "text.tex#math-content"
						},
						{
							"include": "$self"
						}
					]
				}
			]
		},
		"inline-math": {
			"patterns": [
				{
					"begin": "\\\\\\(",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.latex"
						}
					},
					"end": "\\\\\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.latex"
						}
					},
					"name": "meta.math.block.latex support.class.math.block.environment.latex",
					"patterns": [
						{
							"include": "text.tex#math-content"
						},
						{
							"include": "$self"
						}
					]
				},
				{
					"begin": "\\$(?!\\$)",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.tex"
						}
					},
					"end": "(?<!\\$)\\$",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.tex"
						}
					},
					"name": "meta.math.block.tex support.class.math.block.tex",
					"patterns": [
						{
							"match": "\\\\\\$",
							"name": "constant.character.escape.latex"
						},
						{
							"include": "text.tex#math-content"
						},
						{
							"include": "$self"
						}
					]
				}
			]
		},
		"verb-macro": {
			"patterns": [
				{
					"begin": "((\\\\)(?:verb|Verb|spverb)\\*?)\\s*((\\\\)scantokens)(\\{)",
					"beginCaptures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						},
						"3": {
							"name": "support.function.verb.latex"
						},
						"4": {
							"name": "punctuation.definition.verb.latex"
						},
						"5": {
							"name": "punctuation.definition.begin.latex"
						}
					},
					"contentName": "markup.raw.verb.latex",
					"end": "(\\})",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.end.latex"
						}
					},
					"name": "meta.function.verb.latex",
					"patterns": [
						{
							"include": "$self"
						}
					]
				},
				{
					"match": "((\\\\)(?:verb|Verb|spverb)\\*?)\\s*((?<=\\s)\\S|[^a-zA-Z])(.*?)(\\3|$)",
					"captures": {
						"1": {
							"name": "support.function.verb.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						},
						"3": {
							"name": "punctuation.definition.verb.latex"
						},
						"4": {
							"name": "markup.raw.verb.latex"
						},
						"5": {
							"name": "punctuation.definition.verb.latex"
						}
					},
					"name": "meta.function.verb.latex"
				}
			]
		},
		"all-balanced-env": {
			"patterns": [
				{
					"begin": "(?:\\s*)((\\\\)begin)(\\{)((?:\\+?array|equation|(?:IEEE|sub)?eqnarray|multline|align|aligned|alignat|alignedat|flalign|flaligned|flalignat|split|gather|gathered|\\+?cases|(?:display)?math|\\+?[a-zA-Z]*matrix|[pbBvV]?NiceMatrix|[pbBvV]?NiceArray|(?:(?:arg)?(?:mini|maxi)))(?:\\*|!)?)(\\})(\\s*\\n)?",
					"captures": {
						"1": {
							"name": "support.function.be.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						},
						"3": {
							"name": "punctuation.definition.arguments.begin.latex"
						},
						"4": {
							"name": "variable.parameter.function.latex"
						},
						"5": {
							"name": "punctuation.definition.arguments.end.latex"
						}
					},
					"contentName": "meta.math.block.latex support.class.math.block.environment.latex",
					"end": "(?:\\s*)((\\\\)end)(\\{)(\\4)(\\})(?:\\s*\\n)?",
					"name": "meta.function.environment.math.latex",
					"patterns": [
						{
							"match": "(?<!\\\\)&",
							"name": "keyword.control.equation.align.latex"
						},
						{
							"match": "\\\\\\\\",
							"name": "keyword.control.equation.newline.latex"
						},
						{
							"include": "#label-macro"
						},
						{
							"include": "text.tex#math-content"
						},
						{
							"include": "$self"
						}
					]
				},
				{
					"begin": "(?:\\s*)(\\\\begin\\{empheq\\}(?:\\[.*\\])?)",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"contentName": "meta.math.block.latex support.class.math.block.environment.latex",
					"end": "(?:\\s*)(\\\\end\\{empheq\\})",
					"name": "meta.function.environment.math.latex",
					"patterns": [
						{
							"match": "(?<!\\\\)&",
							"name": "keyword.control.equation.align.latex"
						},
						{
							"match": "\\\\\\\\",
							"name": "keyword.control.equation.newline.latex"
						},
						{
							"include": "#label-macro"
						},
						{
							"include": "text.tex#math-content"
						},
						{
							"include": "$self"
						}
					]
				},
				{
					"begin": "(\\s*\\\\begin\\{(tabular[xy*]?|xltabular|longtable|(?:long)?tabu|(?:long|tall)?tblr|NiceTabular[X*]?|booktabs)\\}(\\s*\\n)?)",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"contentName": "meta.data.environment.tabular.latex",
					"end": "(\\s*\\\\end\\{(\\2)\\}(?:\\s*\\n)?)",
					"name": "meta.function.environment.tabular.latex",
					"patterns": [
						{
							"match": "(?<!\\\\)&",
							"name": "keyword.control.table.cell.latex"
						},
						{
							"match": "\\\\\\\\",
							"name": "keyword.control.table.newline.latex"
						},
						{
							"include": "$self"
						}
					]
				},
				{
					"begin": "(\\s*\\\\begin\\{(itemize|enumerate|description|list)\\})",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"end": "(\\\\end\\{\\2\\}(?:\\s*\\n)?)",
					"name": "meta.function.environment.list.latex",
					"patterns": [
						{
							"include": "$self"
						}
					]
				},
				{
					"begin": "(\\s*\\\\begin\\{tikzpicture\\})",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"end": "(\\\\end\\{tikzpicture\\}(?:\\s*\\n)?)",
					"name": "meta.function.environment.latex.tikz",
					"patterns": [
						{
							"include": "$self"
						}
					]
				},
				{
					"begin": "(\\s*\\\\begin\\{frame\\})",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"end": "(\\\\end\\{frame\\})",
					"name": "meta.function.environment.frame.latex",
					"patterns": [
						{
							"include": "$self"
						}
					]
				},
				{
					"begin": "(\\s*\\\\begin\\{(mpost\\*?)\\})",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"end": "(\\\\end\\{\\2\\}(?:\\s*\\n)?)",
					"name": "meta.function.environment.latex.mpost"
				},
				{
					"begin": "(\\s*\\\\begin\\{markdown\\})",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"contentName": "meta.embedded.markdown_latex_combined",
					"end": "(\\\\end\\{markdown\\})",
					"patterns": [
						{
							"include": "text.tex.markdown_latex_combined"
						}
					]
				},
				{
					"begin": "(\\s*\\\\begin\\{(\\p{Alphabetic}+\\*?)\\})",
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#macro-with-args-tokenizer"
								}
							]
						}
					},
					"end": "(\\\\end\\{\\2\\}(?:\\s*\\n)?)",
					"name": "meta.function.environment.general.latex",
					"patterns": [
						{
							"include": "$self"
						}
					]
				}
			]
		},
		"newcommand-macro": {
			"begin": "((\\\\)(?:newcommand|renewcommand|(?:re)?newrobustcmd|DeclareRobustCommand)\\*?)(\\{)((\\\\)\\p{Alphabetic}+\\*?)(\\})(?:(\\[)[^\\]]*(\\])){0,2}(\\{)",
			"beginCaptures": {
				"1": {
					"name": "storage.type.function.latex"
				},
				"2": {
					"name": "punctuation.definition.function.latex"
				},
				"3": {
					"name": "punctuation.definition.begin.latex"
				},
				"4": {
					"name": "support.function.general.latex"
				},
				"5": {
					"name": "punctuation.definition.function.latex"
				},
				"6": {
					"name": "punctuation.definition.end.latex"
				},
				"7": {
					"name": "punctuation.definition.arguments.optional.begin.latex"
				},
				"8": {
					"name": "punctuation.definition.arguments.optional.end.latex"
				},
				"9": {
					"name": "punctuation.definition.arguments.begin.latex"
				}
			},
			"end": "\\}",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.arguments.end.latex"
				}
			},
			"name": "meta.parameter.newcommand.latex",
			"patterns": [
				{
					"include": "#documentclass-usepackage-macro"
				},
				{
					"include": "#input-macro"
				},
				{
					"include": "#sections-macro"
				},
				{
					"include": "#hyperref-macro"
				},
				{
					"include": "#text-font-macro"
				},
				{
					"include": "#citation-macro"
				},
				{
					"include": "#references-macro"
				},
				{
					"include": "#label-macro"
				},
				{
					"include": "#verb-macro"
				},
				{
					"include": "#inline-code-macro"
				},
				{
					"include": "#macro-with-args-tokenizer"
				},
				{
					"include": "#all-other-macro"
				},
				{
					"include": "#display-math"
				},
				{
					"include": "#inline-math"
				},
				{
					"include": "#column-specials"
				},
				{
					"include": "text.tex#braces"
				},
				{
					"include": "text.tex"
				}
			]
		},
		"label-macro": {
			"begin": "((\\\\)z?label)((?:\\[[^\\[]*?\\])*)(\\{)",
			"beginCaptures": {
				"1": {
					"name": "keyword.control.label.latex"
				},
				"2": {
					"name": "punctuation.definition.keyword.latex"
				},
				"3": {
					"patterns": [
						{
							"include": "#optional-arg-bracket"
						}
					]
				},
				"4": {
					"name": "punctuation.definition.arguments.begin.latex"
				}
			},
			"end": "\\}",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.arguments.end.latex"
				}
			},
			"name": "meta.definition.label.latex",
			"patterns": [
				{
					"match": "[\\p{Alphabetic}\\p{Number}\\.,:/*!^_-]+",
					"name": "variable.parameter.definition.label.latex"
				}
			]
		},
		"all-other-macro": {
			"patterns": [
				{
					"match": "\\\\(?:newline|pagebreak|clearpage|linebreak|pause)(?:\\b)",
					"name": "keyword.control.layout.latex"
				},
				{
					"begin": "((\\\\)marginpar)((?:\\[[^\\[]*?\\])*)(\\{)",
					"beginCaptures": {
						"1": {
							"name": "support.function.marginpar.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						},
						"3": {
							"patterns": [
								{
									"include": "#optional-arg-bracket"
								}
							]
						},
						"4": {
							"name": "punctuation.definition.marginpar.begin.latex"
						}
					},
					"contentName": "meta.paragraph.margin.latex",
					"end": "\\}",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.marginpar.end.latex"
						}
					},
					"patterns": [
						{
							"include": "text.tex#braces"
						},
						{
							"include": "$self"
						}
					]
				},
				{
					"begin": "((\\\\)footnote)((?:\\[[^\\[]*?\\])*)(\\{)",
					"beginCaptures": {
						"1": {
							"name": "support.function.footnote.latex"
						},
						"2": {
							"name": "punctuation.definition.function.latex"
						},
						"3": {
							"patterns": [
								{
									"include": "#optional-arg-bracket"
								}
							]
						},
						"4": {
							"name": "punctuation.definition.footnote.begin.latex"
						}
					},
					"contentName": "entity.name.footnote.latex",
					"end": "\\}",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.footnote.end.latex"
						}
					},
					"patterns": [
						{
							"include": "text.tex#braces"
						},
						{
							"include": "$self"
						}
					]
				},
				{
					"match": "(\\\\)item\\b",
					"captures": {
						"0": {
							"name": "keyword.other.item.latex"
						},
						"1": {
							"name": "punctuation.definition.keyword.latex"
						}
					},
					"name": "meta.scope.item.latex"
				},
				{
					"match": "(\\\\)(text(s(terling|ixoldstyle|urd|e(ction|venoldstyle|rvicemark))|yen|n(ineoldstyle|umero|aira)|c(ircledP|o(py(left|right)|lonmonetary)|urrency|e(nt(oldstyle)?|lsius))|t(hree(superior|oldstyle|quarters(emdash)?)|i(ldelow|mes)|w(o(superior|oldstyle)|elveudash)|rademark)|interrobang(down)?|zerooldstyle|o(hm|ne(superior|half|oldstyle|quarter)|penbullet|rd(feminine|masculine))|d(i(scount|ed|v(orced)?)|o(ng|wnarrow|llar(oldstyle)?)|egree|agger(dbl)?|blhyphen(char)?)|uparrow|p(ilcrow|e(so|r(t(housand|enthousand)|iodcentered))|aragraph|m)|e(stimated|ightoldstyle|uro)|quotes(traight(dblbase|base)|ingle)|f(iveoldstyle|ouroldstyle|lorin|ractionsolidus)|won|l(not|ira|e(ftarrow|af)|quill|angle|brackdbl)|a(s(cii(caron|dieresis|acute|grave|macron|breve)|teriskcentered)|cutedbl)|r(ightarrow|e(cipe|ferencemark|gistered)|quill|angle|brackdbl)|g(uarani|ravedbl)|m(ho|inus|u(sicalnote)?|arried)|b(igcircle|orn|ullet|lank|a(ht|rdbl)|rokenbar)))\\b",
					"captures": {
						"1": {
							"name": "punctuation.definition.constant.latex"
						}
					},
					"name": "constant.character.latex"
				},
				{
					"match": "(\\\\)(?:[cgl]_+[_\\p{Alphabetic}@]+_[a-z]+|[qs]_[_\\p{Alphabetic}@]+[\\p{Alphabetic}@])",
					"captures": {
						"1": {
							"name": "punctuation.definition.variable.latex"
						}
					},
					"name": "variable.other.latex3.latex"
				}
			]
		},
		"column-specials": {
			"match": "(?:<|>)(\\{)\\$(\\})",
			"captures": {
				"1": {
					"name": "punctuation.definition.column-specials.begin.latex"
				},
				"2": {
					"name": "punctuation.definition.column-specials.end.latex"
				}
			},
			"name": "meta.column-specials.latex"
		},
		"autocites-arg": {
			"patterns": [
				{
					"captures": {
						"1": {
							"patterns": [
								{
									"include": "#optional-arg-parenthesis-no-highlight"
								}
							]
						},
						"2": {
							"patterns": [
								{
									"include": "#optional-arg-bracket-no-highlight"
								}
							]
						},
						"3": {
							"name": "punctuation.definition.arguments.begin.latex"
						},
						"4": {
							"name": "constant.other.reference.citation.latex"
						},
						"5": {
							"name": "punctuation.definition.arguments.end.latex"
						},
						"6": {
							"patterns": [
								{
									"include": "#autocites-arg"
								}
							]
						}
					},
					"match": "((?:\\([^\\)]*\\)){0,2})((?:\\[[^\\]]*\\]){0,2})(\\{)([\\p{Alphabetic}\\p{Number}_:.-]+)(\\})(.*)"
				}
			]
		},
		"macro-with-args-tokenizer": {
			"match": "\\s*((\\\\)(?:\\p{Alphabetic}+))(\\{)(\\\\?\\p{Alphabetic}+\\*?)(\\})(?:(\\[)([^\\]]*)(\\])){,2}(?:(\\{)([^{}]*)(\\}))?",
			"captures": {
				"1": {
					"name": "support.function.be.latex"
				},
				"2": {
					"name": "punctuation.definition.function.latex"
				},
				"3": {
					"name": "punctuation.definition.arguments.begin.latex"
				},
				"4": {
					"name": "variable.parameter.function.latex"
				},
				"5": {
					"name": "punctuation.definition.arguments.end.latex"
				},
				"6": {
					"name": "punctuation.definition.arguments.optional.begin.latex"
				},
				"7": {
					"patterns": [
						{
							"include": "$self"
						}
					]
				},
				"8": {
					"name": "punctuation.definition.arguments.optional.end.latex"
				},
				"9": {
					"name": "punctuation.definition.arguments.begin.latex"
				},
				"10": {
					"name": "variable.parameter.function.latex"
				},
				"11": {
					"name": "punctuation.definition.arguments.end.latex"
				}
			}
		},
		"multiline-optional-arg": {
			"begin": "\\G\\[",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.arguments.optional.begin.latex"
				}
			},
			"contentName": "variable.parameter.function.latex",
			"end": "\\]",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.arguments.optional.end.latex"
				}
			},
			"name": "meta.parameter.optional.latex",
			"patterns": [
				{
					"include": "$self"
				}
			]
		},
		"multiline-optional-arg-no-highlight": {
			"begin": "(?:\\G|(?<=\\}))\\s*\\[",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.arguments.optional.begin.latex"
				}
			},
			"end": "\\]",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.arguments.optional.end.latex"
				}
			},
			"name": "meta.parameter.optional.latex",
			"patterns": [
				{
					"include": "$self"
				}
			]
		},
		"multiline-arg-no-highlight": {
			"begin": "\\G\\{",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.arguments.begin.latex"
				}
			},
			"end": "\\}",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.arguments.end.latex"
				}
			},
			"name": "meta.parameter.latex",
			"comment": "Do not look for balanced expressions, ie environments, inside a command argument",
			"patterns": [
				{
					"include": "#documentclass-usepackage-macro"
				},
				{
					"include": "#input-macro"
				},
				{
					"include": "#sections-macro"
				},
				{
					"include": "#hyperref-macro"
				},
				{
					"include": "#newcommand-macro"
				},
				{
					"include": "#text-font-macro"
				},
				{
					"include": "#citation-macro"
				},
				{
					"include": "#references-macro"
				},
				{
					"include": "#label-macro"
				},
				{
					"include": "#verb-macro"
				},
				{
					"include": "#inline-code-macro"
				},
				{
					"include": "#all-other-macro"
				},
				{
					"include": "#display-math"
				},
				{
					"include": "#inline-math"
				},
				{
					"include": "#column-specials"
				},
				{
					"include": "text.tex#braces"
				},
				{
					"include": "text.tex"
				}
			]
		},
		"optional-arg-bracket": {
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.arguments.optional.begin.latex"
						},
						"2": {
							"name": "variable.parameter.function.latex"
						},
						"3": {
							"name": "punctuation.definition.arguments.optional.end.latex"
						}
					},
					"match": "(\\[)([^\\[]*?)(\\])",
					"name": "meta.parameter.optional.latex"
				}
			]
		},
		"optional-arg-parenthesis": {
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.arguments.optional.begin.latex"
						},
						"2": {
							"name": "variable.parameter.function.latex"
						},
						"3": {
							"name": "punctuation.definition.arguments.optional.end.latex"
						}
					},
					"match": "(\\()([^\\(]*?)(\\))",
					"name": "meta.parameter.optional.latex"
				}
			]
		},
		"optional-arg-bracket-no-highlight": {
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.arguments.optional.begin.latex"
						},
						"2": {
							"name": "punctuation.definition.arguments.optional.end.latex"
						}
					},
					"match": "(\\[)[^\\[]*?(\\])",
					"name": "meta.parameter.optional.latex"
				}
			]
		},
		"optional-arg-angle-no-highlight": {
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.arguments.optional.begin.latex"
						},
						"2": {
							"name": "punctuation.definition.arguments.optional.end.latex"
						}
					},
					"match": "(<)[^<]*?(>)",
					"name": "meta.parameter.optional.latex"
				}
			]
		},
		"optional-arg-parenthesis-no-highlight": {
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.arguments.optional.begin.latex"
						},
						"2": {
							"name": "punctuation.definition.arguments.optional.end.latex"
						}
					},
					"match": "(\\()[^\\(]*?(\\))",
					"name": "meta.parameter.optional.latex"
				}
			]
		},
		"songs-chords": {
			"patterns": [
				{
					"begin": "\\\\\\[",
					"end": "\\]",
					"name": "meta.chord.block.latex support.class.chord.block.environment.latex",
					"patterns": [
						{
							"include": "$self"
						}
					]
				},
				{
					"match": "\\^",
					"name": "meta.chord.block.latex support.class.chord.block.environment.latex"
				},
				{
					"include": "$self"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/latex/syntaxes/markdown-latex-combined.tmLanguage.json]---
Location: vscode-main/extensions/latex/syntaxes/markdown-latex-combined.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/jlelong/vscode-latex-basics/blob/master/syntaxes/markdown-latex-combined.tmLanguage.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/jlelong/vscode-latex-basics/commit/d689e50d5a02534f9385306b3d0225d78be4db85",
	"name": "Markdown",
	"scopeName": "text.tex.markdown_latex_combined",
	"patterns": [
		{
			"include": "text.tex.latex"
		},
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
					"include": "text.tex.latex"
				},
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
			"match": "(?<!\\\\)(~{2,})((?:[^~]|(?!(?<![~\\\\])\\1(?!~))~)*+)(\\1)",
			"name": "markup.strikethrough.markdown"
		}
	}
}
```

--------------------------------------------------------------------------------

````
