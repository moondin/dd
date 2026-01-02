---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 75
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 75 of 552)

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

---[FILE: extensions/ruby/syntaxes/ruby.tmLanguage.json]---
Location: vscode-main/extensions/ruby/syntaxes/ruby.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/Shopify/ruby-lsp/blob/master/vscode/grammars/ruby.cson.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/Shopify/ruby-lsp/commit/2d5552a22f71ac75086c7f03d404df51e23f6535",
	"name": "Ruby",
	"scopeName": "source.ruby",
	"patterns": [
		{
			"captures": {
				"1": {
					"name": "keyword.control.class.ruby"
				},
				"2": {
					"name": "entity.name.type.class.ruby"
				},
				"5": {
					"name": "punctuation.separator.namespace.ruby"
				},
				"7": {
					"name": "punctuation.separator.inheritance.ruby"
				},
				"8": {
					"name": "entity.other.inherited-class.ruby"
				},
				"11": {
					"name": "punctuation.separator.namespace.ruby"
				}
			},
			"comment": "class Namespace::ClassName < OtherNamespace::OtherClassName",
			"match": "\\b(class)\\s+(([a-zA-Z0-9_]+)((::)[a-zA-Z0-9_]+)*)\\s*((<)\\s*(([a-zA-Z0-9_]+)((::)[a-zA-Z0-9_]+)*))?",
			"name": "meta.class.ruby"
		},
		{
			"captures": {
				"1": {
					"name": "keyword.control.module.ruby"
				},
				"2": {
					"name": "entity.name.type.module.ruby"
				},
				"5": {
					"name": "punctuation.separator.namespace.ruby"
				}
			},
			"match": "\\b(module)\\s+(([a-zA-Z0-9_]+)((::)[a-zA-Z0-9_]+)*)",
			"name": "meta.module.ruby"
		},
		{
			"captures": {
				"1": {
					"name": "keyword.control.class.ruby"
				},
				"2": {
					"name": "punctuation.separator.inheritance.ruby"
				}
			},
			"match": "\\b(class)\\s*(<<)\\s*",
			"name": "meta.class.ruby"
		},
		{
			"comment": "else if is a common mistake carried over from other languages. it works if you put in a second end, but it’s never what you want.",
			"match": "(?<!\\.)\\belse(\\s)+if\\b",
			"name": "invalid.deprecated.ruby"
		},
		{
			"captures": {
				"1": {
					"name": "variable.ruby"
				},
				"2": {
					"name": "keyword.operator.assignment.augmented.ruby"
				}
			},
			"match": "^\\s*([_a-z][A-Za-z0-9_]*)\\s*((&&|\\|\\|)=)",
			"comment": "A local variable and/or assignment"
		},
		{
			"captures": {
				"1": {
					"name": "keyword.control.ruby"
				},
				"3": {
					"name": "variable.ruby"
				},
				"4": {
					"name": "keyword.operator.assignment.augmented.ruby"
				}
			},
			"match": "(?<!\\.)\\b(case|if|elsif|unless|until|while)\\b\\s*(\\()*?\\s*([_a-z][A-Za-z0-9_]*)\\s*((&&|\\|\\|)=)",
			"comment": "A local variable and/or assignment in a condition"
		},
		{
			"captures": {
				"1": {
					"name": "variable.ruby"
				},
				"2": {
					"name": "keyword.operator.assignment.augmented.ruby"
				}
			},
			"match": "^\\s*([_a-z][A-Za-z0-9_]*)\\s*((\\+|\\*|-|\\/|%|\\*\\*|&|\\||\\^|<<|>>)=)",
			"comment": "A local variable operation assignment (+=, -=, *=, /=)"
		},
		{
			"captures": {
				"1": {
					"name": "keyword.control.ruby"
				},
				"3": {
					"name": "variable.ruby"
				},
				"4": {
					"name": "keyword.operator.assignment.augmented.ruby"
				}
			},
			"match": "(?<!\\.)\\b(case|if|elsif|unless|until|while)\\b\\s*(\\()*?\\s*([_a-z][A-Za-z0-9_]*)\\s*((\\+|\\*|-|\\/|%|\\*\\*|&|\\||\\^|<<|>>)=)",
			"comment": "A local variable operation assignment in a condition"
		},
		{
			"captures": {
				"1": {
					"name": "variable.ruby"
				}
			},
			"match": "^\\s*([_a-z][A-Za-z0-9_]*)\\s*(?==[^=>])",
			"comment": "A local variable assignment"
		},
		{
			"captures": {
				"1": {
					"name": "keyword.control.ruby"
				},
				"3": {
					"name": "variable.ruby"
				}
			},
			"match": "(?<!\\.)\\b(case|if|elsif|unless|until|while)\\b\\s*(\\()*?\\s*([_a-z][A-Za-z0-9_]*)\\s*=[^=>]",
			"comment": "A local variable assignment in a condition"
		},
		{
			"captures": {
				"1": {
					"name": "punctuation.definition.constant.hashkey.ruby"
				}
			},
			"comment": "symbols as hash key (1.9 syntax)",
			"match": "(?>[a-zA-Z_]\\w*(?>[?!])?)(:)(?!:)",
			"name": "constant.language.symbol.hashkey.ruby"
		},
		{
			"captures": {
				"1": {
					"name": "punctuation.definition.constant.ruby"
				}
			},
			"comment": "symbols as hash key (1.8 syntax)",
			"match": "(?<!:)(:)(?>[a-zA-Z_]\\w*(?>[?!])?)(?=\\s*=>)",
			"name": "constant.language.symbol.hashkey.ruby"
		},
		{
			"comment": "everything being a reserved word, not a value and needing a 'end' is a..",
			"match": "(?<!\\.)\\b(BEGIN|begin|case|class|else|elsif|END|end|ensure|for|if|in|module|rescue|then|unless|until|when|while)\\b(?![?!])",
			"name": "keyword.control.ruby"
		},
		{
			"comment": "contextual smart pair support for block parameters",
			"match": "(?<!\\.)\\bdo\\b",
			"name": "keyword.control.start-block.ruby"
		},
		{
			"comment": "contextual smart pair support",
			"match": "(?<={)(\\s+)",
			"name": "meta.syntax.ruby.start-block"
		},
		{
			"match": "(?<!\\.)\\b(alias|alias_method|break|next|redo|retry|return|super|undef|yield)\\b(?![?!])|\\bdefined\\?|\\b(block_given|iterator)\\?",
			"name": "keyword.control.pseudo-method.ruby"
		},
		{
			"match": "\\bnil\\b(?![?!])",
			"name": "constant.language.nil.ruby"
		},
		{
			"match": "\\b(true|false)\\b(?![?!])",
			"name": "constant.language.boolean.ruby"
		},
		{
			"match": "\\b(__(FILE|LINE)__)\\b(?![?!])",
			"name": "variable.language.ruby"
		},
		{
			"match": "\\bself\\b(?![?!])",
			"name": "variable.language.self.ruby"
		},
		{
			"comment": " everything being a method but having a special function is a..",
			"match": "\\b(initialize|new|loop|include|extend|prepend|raise|fail|attr_reader|attr_writer|attr_accessor|attr|catch|throw|private|private_class_method|module_function|public|public_class_method|protected|refine|using)\\b(?![?!])",
			"name": "keyword.other.special-method.ruby"
		},
		{
			"begin": "\\b(?<!\\.|::)(require|require_relative)\\b(?![?!])",
			"captures": {
				"1": {
					"name": "keyword.other.special-method.ruby"
				}
			},
			"end": "$|(?=#|})",
			"name": "meta.require.ruby",
			"patterns": [
				{
					"include": "$self"
				}
			]
		},
		{
			"captures": {
				"1": {
					"name": "punctuation.definition.variable.ruby"
				}
			},
			"match": "(@)[a-zA-Z_]\\w*",
			"name": "variable.other.readwrite.instance.ruby"
		},
		{
			"captures": {
				"1": {
					"name": "punctuation.definition.variable.ruby"
				}
			},
			"match": "(@@)[a-zA-Z_]\\w*",
			"name": "variable.other.readwrite.class.ruby"
		},
		{
			"captures": {
				"1": {
					"name": "punctuation.definition.variable.ruby"
				}
			},
			"match": "(\\$)[a-zA-Z_]\\w*",
			"name": "variable.other.readwrite.global.ruby"
		},
		{
			"captures": {
				"1": {
					"name": "punctuation.definition.variable.ruby"
				}
			},
			"match": "(\\$)(!|@|&|`|'|\\+|\\d+|~|=|/|\\\\|,|;|\\.|<|>|_|\\*|\\$|\\?|:|\"|-[0adFiIlpv])",
			"name": "variable.other.readwrite.global.pre-defined.ruby"
		},
		{
			"begin": "\\b(ENV)\\[",
			"beginCaptures": {
				"1": {
					"name": "variable.other.constant.ruby"
				}
			},
			"end": "]",
			"name": "meta.environment-variable.ruby",
			"patterns": [
				{
					"include": "$self"
				}
			]
		},
		{
			"match": "\\b[A-Z]\\w*(?=((\\.|::)[A-Za-z]|\\[))",
			"name": "support.class.ruby"
		},
		{
			"match": "\\b((abort|at_exit|autoload|binding|callcc|caller|caller_locations|chomp|chop|eval|exec|exit|fork|format|gets|global_variables|gsub|lambda|load|local_variables|open|p|print|printf|proc|putc|puts|rand|readline|readlines|select|set_trace_func|sleep|spawn|sprintf|srand|sub|syscall|system|test|trace_var|trap|untrace_var|warn)\\b(?![?!])|autoload\\?|exit!)",
			"name": "support.function.kernel.ruby"
		},
		{
			"match": "\\b[_A-Z]\\w*\\b",
			"name": "variable.other.constant.ruby"
		},
		{
			"begin": "(->)\\(",
			"beginCaptures": {
				"1": {
					"name": "support.function.kernel.ruby"
				}
			},
			"comment": "Lambda parameters.",
			"end": "\\)",
			"patterns": [
				{
					"begin": "(?=[&*_a-zA-Z])",
					"end": "(?=[,)])",
					"patterns": [
						{
							"include": "#method_parameters"
						}
					]
				},
				{
					"include": "#method_parameters"
				}
			]
		},
		{
			"begin": "(?x)\n(?=def\\b)                          # optimization to help Oniguruma fail fast\n(?<=^|\\s)(def)\\s+\n(\n  (?>[a-zA-Z_]\\w*(?>\\.|::))?      # method prefix\n  (?>                               # method name\n    [a-zA-Z_]\\w*(?>[?!]|=(?!>))?\n    |\n    ===?|!=|>[>=]?|<=>|<[<=]?|[%&`/\\|]|\\*\\*?|=?~|[-+]@?|\\[]=?\n  )\n)\n\\s*(\\()",
			"beginCaptures": {
				"1": {
					"name": "keyword.control.def.ruby"
				},
				"2": {
					"name": "entity.name.function.ruby"
				},
				"3": {
					"name": "punctuation.definition.parameters.ruby"
				}
			},
			"comment": "The method pattern comes from the symbol pattern. See there for an explanation.",
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.parameters.ruby"
				}
			},
			"name": "meta.function.method.with-arguments.ruby",
			"patterns": [
				{
					"begin": "(?=[&*_a-zA-Z])",
					"end": "(?=[,)])",
					"patterns": [
						{
							"include": "#method_parameters"
						}
					]
				},
				{
					"include": "#method_parameters"
				}
			]
		},
		{
			"begin": "(?x)\n(?=def\\b)                          # optimization to help Oniguruma fail fast\n(?<=^|\\s)(def)\\s+\n(\n  (?>[a-zA-Z_]\\w*(?>\\.|::))?      # method prefix\n  (?>                               # method name\n    [a-zA-Z_]\\w*(?>[?!]|=(?!>))?\n    |\n    ===?|!=|>[>=]?|<=>|<[<=]?|[%&`/\\|]|\\*\\*?|=?~|[-+]@?|\\[]=?\n  )\n)\n[ \\t]\n(?=[ \\t]*[^\\s#;])                 # make sure the following is not comment",
			"beginCaptures": {
				"1": {
					"name": "keyword.control.def.ruby"
				},
				"2": {
					"name": "entity.name.function.ruby"
				}
			},
			"comment": "same as the previous rule, but without parentheses around the arguments",
			"end": "(?=;)|(?<=[\\w\\])}`'\"!?])(?=\\s*#|\\s*$)",
			"name": "meta.function.method.with-arguments.ruby",
			"patterns": [
				{
					"begin": "(?=[&*_a-zA-Z])",
					"end": "(?=,|;|\\s*#|\\s*$)",
					"patterns": [
						{
							"include": "#method_parameters"
						}
					]
				},
				{
					"include": "#method_parameters"
				}
			]
		},
		{
			"captures": {
				"1": {
					"name": "keyword.control.def.ruby"
				},
				"3": {
					"name": "entity.name.function.ruby"
				}
			},
			"comment": " the optional name is just to catch the def also without a method-name",
			"match": "(?x)\n(?=def\\b)                            # optimization to help Oniguruma fail fast\n(?<=^|\\s)(def)\\b\n(\n  \\s+\n  (\n    (?>[a-zA-Z_]\\w*(?>\\.|::))?      # method prefix\n    (?>                               # method name\n      [a-zA-Z_]\\w*(?>[?!]|=(?!>))?\n      |\n      ===?|!=|>[>=]?|<=>|<[<=]?|[%&`/\\|]|\\*\\*?|=?~|[-+]@?|\\[]=?\n    )\n  )\n)?",
			"name": "meta.function.method.without-arguments.ruby"
		},
		{
			"match": "(?x)\n\\b\n(\n  [\\d](?>_?\\d)*                             # 100_000\n  (\\.(?![^[:space:][:digit:]])(?>_?\\d)*)?   # fractional part\n  ([eE][-+]?\\d(?>_?\\d)*)?                   # 1.23e-4\n  |\n  0\n  (?:\n    [xX]\\h(?>_?\\h)*|\n    [oO]?[0-7](?>_?[0-7])*|\n    [bB][01](?>_?[01])*|\n    [dD]\\d(?>_?\\d)*\n  )                                           # A base indicator can only be used with an integer\n)\\b",
			"name": "constant.numeric.ruby"
		},
		{
			"begin": ":'",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.symbol.begin.ruby"
				}
			},
			"comment": "symbol literal with '' delimiter",
			"end": "'",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.symbol.end.ruby"
				}
			},
			"name": "constant.language.symbol.ruby",
			"patterns": [
				{
					"match": "\\\\['\\\\]",
					"name": "constant.character.escape.ruby"
				}
			]
		},
		{
			"begin": ":\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.symbol.begin.ruby"
				}
			},
			"comment": "symbol literal with \"\" delimiter",
			"end": "\"",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.symbol.end.ruby"
				}
			},
			"name": "constant.language.symbol.interpolated.ruby",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				}
			]
		},
		{
			"comment": "Needs higher precedence than regular expressions.",
			"match": "(?<!\\()/=",
			"name": "keyword.operator.assignment.augmented.ruby"
		},
		{
			"begin": "'",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.ruby"
				}
			},
			"comment": "string literal with '' delimiter",
			"end": "'",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.ruby"
				}
			},
			"name": "string.quoted.single.ruby",
			"patterns": [
				{
					"match": "\\\\'|\\\\\\\\",
					"name": "constant.character.escape.ruby"
				}
			]
		},
		{
			"begin": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.ruby"
				}
			},
			"comment": "string literal with interpolation and \"\" delimiter",
			"end": "\"",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.ruby"
				}
			},
			"name": "string.quoted.double.interpolated.ruby",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				}
			]
		},
		{
			"begin": "(?<!\\.)`",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.ruby"
				}
			},
			"comment": "execute string (allows for interpolation)",
			"end": "`",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.ruby"
				}
			},
			"name": "string.interpolated.ruby",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				}
			]
		},
		{
			"begin": "(?x)\n(?<![\\w)])((/))(?![?*+])\n(?=\n  (?:\\\\/|[^/])*+          # Do NOT change the order\n  /[eimnosux]*\\s*\n  (?:\n    [)\\]}#.,?:]|\\|\\||&&|<=>|=>|==|=~|!~|!=|;|$|\n    if|else|elsif|then|do|end|unless|while|until|or|and\n  )\n  |\n  $\n)",
			"captures": {
				"1": {
					"name": "string.regexp.interpolated.ruby"
				},
				"2": {
					"name": "punctuation.section.regexp.ruby"
				}
			},
			"comment": "regular expression literal with interpolation",
			"contentName": "string.regexp.interpolated.ruby",
			"end": "((/[eimnosux]*))",
			"patterns": [
				{
					"include": "#regex_sub"
				}
			]
		},
		{
			"begin": "%r{",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.regexp.begin.ruby"
				}
			},
			"end": "}[eimnosux]*",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.regexp.end.ruby"
				}
			},
			"name": "string.regexp.interpolated.ruby",
			"patterns": [
				{
					"include": "#regex_sub"
				},
				{
					"include": "#nest_curly_r"
				}
			]
		},
		{
			"begin": "%r\\[",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.regexp.begin.ruby"
				}
			},
			"end": "][eimnosux]*",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.regexp.end.ruby"
				}
			},
			"name": "string.regexp.interpolated.ruby",
			"patterns": [
				{
					"include": "#regex_sub"
				},
				{
					"include": "#nest_brackets_r"
				}
			]
		},
		{
			"begin": "%r\\(",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.regexp.begin.ruby"
				}
			},
			"end": "\\)[eimnosux]*",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.regexp.end.ruby"
				}
			},
			"name": "string.regexp.interpolated.ruby",
			"patterns": [
				{
					"include": "#regex_sub"
				},
				{
					"include": "#nest_parens_r"
				}
			]
		},
		{
			"begin": "%r<",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.regexp.begin.ruby"
				}
			},
			"end": ">[eimnosux]*",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.regexp.end.ruby"
				}
			},
			"name": "string.regexp.interpolated.ruby",
			"patterns": [
				{
					"include": "#regex_sub"
				},
				{
					"include": "#nest_ltgt_r"
				}
			]
		},
		{
			"begin": "%r([^\\w])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.regexp.begin.ruby"
				}
			},
			"end": "\\1[eimnosux]*",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.regexp.end.ruby"
				}
			},
			"name": "string.regexp.interpolated.ruby",
			"patterns": [
				{
					"include": "#regex_sub"
				}
			]
		},
		{
			"begin": "%I\\[",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.array.begin.ruby"
				}
			},
			"end": "]",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.array.end.ruby"
				}
			},
			"name": "constant.language.symbol.interpolated.ruby",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nest_brackets_i"
				}
			]
		},
		{
			"begin": "%I\\(",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.array.begin.ruby"
				}
			},
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.array.end.ruby"
				}
			},
			"name": "constant.language.symbol.interpolated.ruby",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nest_parens_i"
				}
			]
		},
		{
			"begin": "%I<",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.array.begin.ruby"
				}
			},
			"end": ">",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.array.end.ruby"
				}
			},
			"name": "constant.language.symbol.interpolated.ruby",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nest_ltgt_i"
				}
			]
		},
		{
			"begin": "%I{",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.array.begin.ruby"
				}
			},
			"end": "}",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.array.end.ruby"
				}
			},
			"name": "constant.language.symbol.interpolated.ruby",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nest_curly_i"
				}
			]
		},
		{
			"begin": "%I([^\\w])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.array.begin.ruby"
				}
			},
			"end": "\\1",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.array.end.ruby"
				}
			},
			"name": "constant.language.symbol.interpolated.ruby",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				}
			]
		},
		{
			"begin": "%i\\[",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.array.begin.ruby"
				}
			},
			"end": "]",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.array.end.ruby"
				}
			},
			"name": "constant.language.symbol.ruby",
			"patterns": [
				{
					"match": "\\\\]|\\\\\\\\",
					"name": "constant.character.escape.ruby"
				},
				{
					"include": "#nest_brackets"
				}
			]
		},
		{
			"begin": "%i\\(",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.array.begin.ruby"
				}
			},
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.array.end.ruby"
				}
			},
			"name": "constant.language.symbol.ruby",
			"patterns": [
				{
					"match": "\\\\\\)|\\\\\\\\",
					"name": "constant.character.escape.ruby"
				},
				{
					"include": "#nest_parens"
				}
			]
		},
		{
			"begin": "%i<",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.array.begin.ruby"
				}
			},
			"end": ">",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.array.end.ruby"
				}
			},
			"name": "constant.language.symbol.ruby",
			"patterns": [
				{
					"match": "\\\\>|\\\\\\\\",
					"name": "constant.character.escape.ruby"
				},
				{
					"include": "#nest_ltgt"
				}
			]
		},
		{
			"begin": "%i{",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.array.begin.ruby"
				}
			},
			"end": "}",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.array.end.ruby"
				}
			},
			"name": "constant.language.symbol.ruby",
			"patterns": [
				{
					"match": "\\\\}|\\\\\\\\",
					"name": "constant.character.escape.ruby"
				},
				{
					"include": "#nest_curly"
				}
			]
		},
		{
			"begin": "%i([^\\w])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.array.begin.ruby"
				}
			},
			"end": "\\1",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.array.end.ruby"
				}
			},
			"name": "constant.language.symbol.ruby",
			"patterns": [
				{
					"comment": "Cant be named because its not necessarily an escape.",
					"match": "\\\\."
				}
			]
		},
		{
			"begin": "%W\\[",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.array.begin.ruby"
				}
			},
			"end": "]",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.array.end.ruby"
				}
			},
			"name": "string.quoted.other.interpolated.ruby",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nest_brackets_i"
				}
			]
		},
		{
			"begin": "%W\\(",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.array.begin.ruby"
				}
			},
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.array.end.ruby"
				}
			},
			"name": "string.quoted.other.interpolated.ruby",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nest_parens_i"
				}
			]
		},
		{
			"begin": "%W<",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.array.begin.ruby"
				}
			},
			"end": ">",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.array.end.ruby"
				}
			},
			"name": "string.quoted.other.interpolated.ruby",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nest_ltgt_i"
				}
			]
		},
		{
			"begin": "%W{",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.array.begin.ruby"
				}
			},
			"end": "}",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.array.end.ruby"
				}
			},
			"name": "string.quoted.other.interpolated.ruby",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nest_curly_i"
				}
			]
		},
		{
			"begin": "%W([^\\w])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.array.begin.ruby"
				}
			},
			"end": "\\1",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.array.end.ruby"
				}
			},
			"name": "string.quoted.other.interpolated.ruby",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				}
			]
		},
		{
			"begin": "%w\\[",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.array.begin.ruby"
				}
			},
			"end": "]",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.array.end.ruby"
				}
			},
			"name": "string.quoted.other.ruby",
			"patterns": [
				{
					"match": "\\\\]|\\\\\\\\",
					"name": "constant.character.escape.ruby"
				},
				{
					"include": "#nest_brackets"
				}
			]
		},
		{
			"begin": "%w\\(",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.array.begin.ruby"
				}
			},
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.array.end.ruby"
				}
			},
			"name": "string.quoted.other.ruby",
			"patterns": [
				{
					"match": "\\\\\\)|\\\\\\\\",
					"name": "constant.character.escape.ruby"
				},
				{
					"include": "#nest_parens"
				}
			]
		},
		{
			"begin": "%w<",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.array.begin.ruby"
				}
			},
			"end": ">",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.array.end.ruby"
				}
			},
			"name": "string.quoted.other.ruby",
			"patterns": [
				{
					"match": "\\\\>|\\\\\\\\",
					"name": "constant.character.escape.ruby"
				},
				{
					"include": "#nest_ltgt"
				}
			]
		},
		{
			"begin": "%w{",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.array.begin.ruby"
				}
			},
			"end": "}",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.array.end.ruby"
				}
			},
			"name": "string.quoted.other.ruby",
			"patterns": [
				{
					"match": "\\\\}|\\\\\\\\",
					"name": "constant.character.escape.ruby"
				},
				{
					"include": "#nest_curly"
				}
			]
		},
		{
			"begin": "%w([^\\w])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.array.begin.ruby"
				}
			},
			"end": "\\1",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.array.end.ruby"
				}
			},
			"name": "string.quoted.other.ruby",
			"patterns": [
				{
					"comment": "Cant be named because its not necessarily an escape.",
					"match": "\\\\."
				}
			]
		},
		{
			"begin": "%[Qx]?\\(",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.ruby"
				}
			},
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.ruby"
				}
			},
			"name": "string.quoted.other.interpolated.ruby",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nest_parens_i"
				}
			]
		},
		{
			"begin": "%[Qx]?\\[",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.ruby"
				}
			},
			"end": "]",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.ruby"
				}
			},
			"name": "string.quoted.other.interpolated.ruby",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nest_brackets_i"
				}
			]
		},
		{
			"begin": "%[Qx]?{",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.ruby"
				}
			},
			"end": "}",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.ruby"
				}
			},
			"name": "string.quoted.other.interpolated.ruby",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nest_curly_i"
				}
			]
		},
		{
			"begin": "%[Qx]?<",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.ruby"
				}
			},
			"end": ">",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.ruby"
				}
			},
			"name": "string.quoted.other.interpolated.ruby",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nest_ltgt_i"
				}
			]
		},
		{
			"begin": "%[Qx]([^\\w])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.ruby"
				}
			},
			"end": "\\1",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.ruby"
				}
			},
			"name": "string.quoted.other.interpolated.ruby",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				}
			]
		},
		{
			"begin": "%([^\\w\\s=])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.ruby"
				}
			},
			"end": "\\1",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.ruby"
				}
			},
			"name": "string.quoted.other.interpolated.ruby",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				}
			]
		},
		{
			"begin": "%q\\(",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.ruby"
				}
			},
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.ruby"
				}
			},
			"name": "string.quoted.other.ruby",
			"patterns": [
				{
					"match": "\\\\\\)|\\\\\\\\",
					"name": "constant.character.escape.ruby"
				},
				{
					"include": "#nest_parens"
				}
			]
		},
		{
			"begin": "%q<",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.ruby"
				}
			},
			"end": ">",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.ruby"
				}
			},
			"name": "string.quoted.other.ruby",
			"patterns": [
				{
					"match": "\\\\>|\\\\\\\\",
					"name": "constant.character.escape.ruby"
				},
				{
					"include": "#nest_ltgt"
				}
			]
		},
		{
			"begin": "%q\\[",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.ruby"
				}
			},
			"end": "]",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.ruby"
				}
			},
			"name": "string.quoted.other.ruby",
			"patterns": [
				{
					"match": "\\\\]|\\\\\\\\",
					"name": "constant.character.escape.ruby"
				},
				{
					"include": "#nest_brackets"
				}
			]
		},
		{
			"begin": "%q{",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.ruby"
				}
			},
			"end": "}",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.ruby"
				}
			},
			"name": "string.quoted.other.ruby",
			"patterns": [
				{
					"match": "\\\\}|\\\\\\\\",
					"name": "constant.character.escape.ruby"
				},
				{
					"include": "#nest_curly"
				}
			]
		},
		{
			"begin": "%q([^\\w])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.ruby"
				}
			},
			"end": "\\1",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.ruby"
				}
			},
			"name": "string.quoted.other.ruby",
			"patterns": [
				{
					"comment": "Cant be named because its not necessarily an escape.",
					"match": "\\\\."
				}
			]
		},
		{
			"begin": "%s\\(",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.symbol.begin.ruby"
				}
			},
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.symbol.end.ruby"
				}
			},
			"name": "constant.language.symbol.ruby",
			"patterns": [
				{
					"match": "\\\\\\)|\\\\\\\\",
					"name": "constant.character.escape.ruby"
				},
				{
					"include": "#nest_parens"
				}
			]
		},
		{
			"begin": "%s<",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.symbol.begin.ruby"
				}
			},
			"end": ">",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.symbol.end.ruby"
				}
			},
			"name": "constant.language.symbol.ruby",
			"patterns": [
				{
					"match": "\\\\>|\\\\\\\\",
					"name": "constant.character.escape.ruby"
				},
				{
					"include": "#nest_ltgt"
				}
			]
		},
		{
			"begin": "%s\\[",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.symbol.begin.ruby"
				}
			},
			"end": "]",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.symbol.end.ruby"
				}
			},
			"name": "constant.language.symbol.ruby",
			"patterns": [
				{
					"match": "\\\\]|\\\\\\\\",
					"name": "constant.character.escape.ruby"
				},
				{
					"include": "#nest_brackets"
				}
			]
		},
		{
			"begin": "%s{",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.symbol.begin.ruby"
				}
			},
			"end": "}",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.symbol.end.ruby"
				}
			},
			"name": "constant.language.symbol.ruby",
			"patterns": [
				{
					"match": "\\\\}|\\\\\\\\",
					"name": "constant.character.escape.ruby"
				},
				{
					"include": "#nest_curly"
				}
			]
		},
		{
			"begin": "%s([^\\w])",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.symbol.begin.ruby"
				}
			},
			"end": "\\1",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.symbol.end.ruby"
				}
			},
			"name": "constant.language.symbol.ruby",
			"patterns": [
				{
					"comment": "Cant be named because its not necessarily an escape.",
					"match": "\\\\."
				}
			]
		},
		{
			"captures": {
				"1": {
					"name": "punctuation.definition.constant.ruby"
				}
			},
			"comment": "symbols",
			"match": "(?x)\n(?<!:)(:)\n(?>\n  [$a-zA-Z_]\\w*(?>[?!]|=(?![>=]))?\n  |\n  ===?|<=>|>[>=]?|<[<=]?|[%&`/\\|]|\\*\\*?|=?~|[-+]@?|\\[]=?\n  |\n  @@?[a-zA-Z_]\\w*\n)",
			"name": "constant.language.symbol.ruby"
		},
		{
			"begin": "^=begin",
			"captures": {
				"0": {
					"name": "punctuation.definition.comment.ruby"
				}
			},
			"comment": "multiline comments",
			"end": "^=end",
			"name": "comment.block.documentation.ruby"
		},
		{
			"include": "#yard"
		},
		{
			"begin": "(^[ \\t]+)?(?=#)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.whitespace.comment.leading.ruby"
				}
			},
			"end": "(?!\\G)",
			"patterns": [
				{
					"begin": "#",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.comment.ruby"
						}
					},
					"end": "\\n",
					"name": "comment.line.number-sign.ruby"
				}
			]
		},
		{
			"comment": "\n\t\t\tmatches questionmark-letters.\n\n\t\t\texamples (1st alternation = hex):\n\t\t\t?\\x1     ?\\x61\n\n\t\t\texamples (2nd alternation = octal):\n\t\t\t?\\0      ?\\07     ?\\017\n\n\t\t\texamples (3rd alternation = escaped):\n\t\t\t?\\n      ?\\b\n\n\t\t\texamples (4th alternation = meta-ctrl):\n\t\t\t?\\C-a    ?\\M-a    ?\\C-\\M-\\C-\\M-a\n\n\t\t\texamples (4th alternation = normal):\n\t\t\t?a       ?A       ?0 \n\t\t\t?*       ?\"       ?( \n\t\t\t?.       ?#\n\t\t\t\n\t\t\t\n\t\t\tthe negative lookbehind prevents against matching\n\t\t\tp(42.tainted?)\n\t\t\t",
			"match": "(?<!\\w)\\?(\\\\(x\\h{1,2}(?!\\h)\\b|0[0-7]{0,2}(?![0-7])\\b|[^x0MC])|(\\\\[MC]-)+\\w|[^\\s\\\\])",
			"name": "constant.numeric.ruby"
		},
		{
			"begin": "^__END__\\n",
			"captures": {
				"0": {
					"name": "string.unquoted.program-block.ruby"
				}
			},
			"comment": "__END__ marker",
			"contentName": "text.plain",
			"end": "(?=not)impossible",
			"patterns": [
				{
					"begin": "(?=<?xml|<(?i:html\\b)|!DOCTYPE (?i:html\\b))",
					"end": "(?=not)impossible",
					"name": "text.html.embedded.ruby",
					"patterns": [
						{
							"include": "text.html.basic"
						}
					]
				}
			]
		},
		{
			"begin": "(?=(?><<[-~]([\"'`]?)((?:[_\\w]+_|)HTML)\\b\\1))",
			"comment": "Heredoc with embedded HTML",
			"end": "(?!\\G)",
			"name": "meta.embedded.block.html",
			"patterns": [
				{
					"begin": "(?><<[-~]([\"'`]?)((?:[_\\w]+_|)HTML)\\b\\1)",
					"beginCaptures": {
						"0": {
							"name": "string.definition.begin.ruby"
						}
					},
					"contentName": "text.html",
					"end": "^\\s*\\2$\\n?",
					"endCaptures": {
						"0": {
							"name": "string.definition.end.ruby"
						}
					},
					"patterns": [
						{
							"include": "#heredoc"
						},
						{
							"include": "#interpolated_ruby"
						},
						{
							"include": "text.html.basic"
						},
						{
							"include": "#escaped_char"
						}
					]
				}
			]
		},
		{
			"begin": "(?=(?><<[-~]([\"'`]?)((?:[_\\w]+_|)HAML)\\b\\1))",
			"comment": "Heredoc with embedded HAML",
			"end": "(?!\\G)",
			"name": "meta.embedded.block.haml",
			"patterns": [
				{
					"begin": "(?><<[-~]([\"'`]?)((?:[_\\w]+_|)HAML)\\b\\1)",
					"beginCaptures": {
						"0": {
							"name": "string.definition.begin.ruby"
						}
					},
					"contentName": "text.haml",
					"end": "^\\s*\\2$\\n?",
					"endCaptures": {
						"0": {
							"name": "string.definition.end.ruby"
						}
					},
					"patterns": [
						{
							"include": "#heredoc"
						},
						{
							"include": "#interpolated_ruby"
						},
						{
							"include": "text.haml"
						},
						{
							"include": "#escaped_char"
						}
					]
				}
			]
		},
		{
			"begin": "(?=(?><<[-~]([\"'`]?)((?:[_\\w]+_|)XML)\\b\\1))",
			"comment": "Heredoc with embedded XML",
			"end": "(?!\\G)",
			"name": "meta.embedded.block.xml",
			"patterns": [
				{
					"begin": "(?><<[-~]([\"'`]?)((?:[_\\w]+_|)XML)\\b\\1)",
					"beginCaptures": {
						"0": {
							"name": "string.definition.begin.ruby"
						}
					},
					"contentName": "text.xml",
					"end": "^\\s*\\2$\\n?",
					"endCaptures": {
						"0": {
							"name": "string.definition.end.ruby"
						}
					},
					"patterns": [
						{
							"include": "#heredoc"
						},
						{
							"include": "#interpolated_ruby"
						},
						{
							"include": "text.xml"
						},
						{
							"include": "#escaped_char"
						}
					]
				}
			]
		},
		{
			"begin": "(?=(?><<[-~]([\"'`]?)((?:[_\\w]+_|)SQL)\\b\\1))",
			"comment": "Heredoc with embedded SQL",
			"end": "(?!\\G)",
			"name": "meta.embedded.block.sql",
			"patterns": [
				{
					"begin": "(?><<[-~]([\"'`]?)((?:[_\\w]+_|)SQL)\\b\\1)",
					"beginCaptures": {
						"0": {
							"name": "string.definition.begin.ruby"
						}
					},
					"contentName": "source.sql",
					"end": "^\\s*\\2$\\n?",
					"endCaptures": {
						"0": {
							"name": "string.definition.end.ruby"
						}
					},
					"patterns": [
						{
							"include": "#heredoc"
						},
						{
							"include": "#interpolated_ruby"
						},
						{
							"include": "source.sql"
						},
						{
							"include": "#escaped_char"
						}
					]
				}
			]
		},
		{
			"begin": "(?=(?><<[-~]([\"'`]?)((?:[_\\w]+_|)(?:GRAPHQL|GQL))\\b\\1))",
			"comment": "Heredoc with embedded GraphQL",
			"end": "(?!\\G)",
			"name": "meta.embedded.block.graphql",
			"patterns": [
				{
					"begin": "(?><<[-~]([\"'`]?)((?:[_\\w]+_|)(?:GRAPHQL|GQL))\\b\\1)",
					"beginCaptures": {
						"0": {
							"name": "string.definition.begin.ruby"
						}
					},
					"contentName": "source.graphql",
					"end": "^\\s*\\2$\\n?",
					"endCaptures": {
						"0": {
							"name": "string.definition.end.ruby"
						}
					},
					"patterns": [
						{
							"include": "#heredoc"
						},
						{
							"include": "#interpolated_ruby"
						},
						{
							"include": "source.graphql"
						},
						{
							"include": "#escaped_char"
						}
					]
				}
			]
		},
		{
			"begin": "(?=(?><<[-~]([\"'`]?)((?:[_\\w]+_|)CSS)\\b\\1))",
			"comment": "Heredoc with embedded CSS",
			"end": "(?!\\G)",
			"name": "meta.embedded.block.css",
			"patterns": [
				{
					"begin": "(?><<[-~]([\"'`]?)((?:[_\\w]+_|)CSS)\\b\\1)",
					"beginCaptures": {
						"0": {
							"name": "string.definition.begin.ruby"
						}
					},
					"contentName": "source.css",
					"end": "^\\s*\\2$\\n?",
					"endCaptures": {
						"0": {
							"name": "string.definition.end.ruby"
						}
					},
					"patterns": [
						{
							"include": "#heredoc"
						},
						{
							"include": "#interpolated_ruby"
						},
						{
							"include": "source.css"
						},
						{
							"include": "#escaped_char"
						}
					]
				}
			]
		},
		{
			"begin": "(?=(?><<[-~]([\"'`]?)((?:[_\\w]+_|)CPP)\\b\\1))",
			"comment": "Heredoc with embedded C++",
			"end": "(?!\\G)",
			"name": "meta.embedded.block.cpp",
			"patterns": [
				{
					"begin": "(?><<[-~]([\"'`]?)((?:[_\\w]+_|)CPP)\\b\\1)",
					"beginCaptures": {
						"0": {
							"name": "string.definition.begin.ruby"
						}
					},
					"contentName": "source.cpp",
					"end": "^\\s*\\2$\\n?",
					"endCaptures": {
						"0": {
							"name": "string.definition.end.ruby"
						}
					},
					"patterns": [
						{
							"include": "#heredoc"
						},
						{
							"include": "#interpolated_ruby"
						},
						{
							"include": "source.cpp"
						},
						{
							"include": "#escaped_char"
						}
					]
				}
			]
		},
		{
			"begin": "(?=(?><<[-~]([\"'`]?)((?:[_\\w]+_|)C)\\b\\1))",
			"comment": "Heredoc with embedded C",
			"end": "(?!\\G)",
			"name": "meta.embedded.block.c",
			"patterns": [
				{
					"begin": "(?><<[-~]([\"'`]?)((?:[_\\w]+_|)C)\\b\\1)",
					"beginCaptures": {
						"0": {
							"name": "string.definition.begin.ruby"
						}
					},
					"contentName": "source.c",
					"end": "^\\s*\\2$\\n?",
					"endCaptures": {
						"0": {
							"name": "string.definition.end.ruby"
						}
					},
					"patterns": [
						{
							"include": "#heredoc"
						},
						{
							"include": "#interpolated_ruby"
						},
						{
							"include": "source.c"
						},
						{
							"include": "#escaped_char"
						}
					]
				}
			]
		},
		{
			"begin": "(?=(?><<[-~]([\"'`]?)((?:[_\\w]+_|)(?:JS|JAVASCRIPT))\\b\\1))",
			"comment": "Heredoc with embedded Javascript",
			"end": "(?!\\G)",
			"name": "meta.embedded.block.js",
			"patterns": [
				{
					"begin": "(?><<[-~]([\"'`]?)((?:[_\\w]+_|)(?:JS|JAVASCRIPT))\\b\\1)",
					"beginCaptures": {
						"0": {
							"name": "string.definition.begin.ruby"
						}
					},
					"contentName": "source.js",
					"end": "^\\s*\\2$\\n?",
					"endCaptures": {
						"0": {
							"name": "string.definition.end.ruby"
						}
					},
					"patterns": [
						{
							"include": "#heredoc"
						},
						{
							"include": "#interpolated_ruby"
						},
						{
							"include": "source.js"
						},
						{
							"include": "#escaped_char"
						}
					]
				}
			]
		},
		{
			"begin": "(?=(?><<[-~]([\"'`]?)((?:[_\\w]+_|)JQUERY)\\b\\1))",
			"comment": "Heredoc with embedded jQuery Javascript",
			"end": "(?!\\G)",
			"name": "meta.embedded.block.js.jquery",
			"patterns": [
				{
					"begin": "(?><<[-~]([\"'`]?)((?:[_\\w]+_|)JQUERY)\\b\\1)",
					"beginCaptures": {
						"0": {
							"name": "string.definition.begin.ruby"
						}
					},
					"contentName": "source.js.jquery",
					"end": "^\\s*\\2$\\n?",
					"endCaptures": {
						"0": {
							"name": "string.definition.end.ruby"
						}
					},
					"patterns": [
						{
							"include": "#heredoc"
						},
						{
							"include": "#interpolated_ruby"
						},
						{
							"include": "source.js.jquery"
						},
						{
							"include": "#escaped_char"
						}
					]
				}
			]
		},
		{
			"begin": "(?=(?><<[-~]([\"'`]?)((?:[_\\w]+_|)(?:SH|SHELL))\\b\\1))",
			"comment": "Heredoc with embedded Shell",
			"end": "(?!\\G)",
			"name": "meta.embedded.block.shell",
			"patterns": [
				{
					"begin": "(?><<[-~]([\"'`]?)((?:[_\\w]+_|)(?:SH|SHELL))\\b\\1)",
					"beginCaptures": {
						"0": {
							"name": "string.definition.begin.ruby"
						}
					},
					"contentName": "source.shell",
					"end": "^\\s*\\2$\\n?",
					"endCaptures": {
						"0": {
							"name": "string.definition.end.ruby"
						}
					},
					"patterns": [
						{
							"include": "#heredoc"
						},
						{
							"include": "#interpolated_ruby"
						},
						{
							"include": "source.shell"
						},
						{
							"include": "#escaped_char"
						}
					]
				}
			]
		},
		{
			"begin": "(?=(?><<[-~]([\"'`]?)((?:[_\\w]+_|)LUA)\\b\\1))",
			"comment": "Heredoc with embedded Lua",
			"end": "(?!\\G)",
			"name": "meta.embedded.block.lua",
			"patterns": [
				{
					"begin": "(?><<[-~]([\"'`]?)((?:[_\\w]+_|)LUA)\\b\\1)",
					"beginCaptures": {
						"0": {
							"name": "string.definition.begin.ruby"
						}
					},
					"contentName": "source.lua",
					"end": "^\\s*\\2$\\n?",
					"endCaptures": {
						"0": {
							"name": "string.definition.end.ruby"
						}
					},
					"patterns": [
						{
							"include": "#heredoc"
						},
						{
							"include": "#interpolated_ruby"
						},
						{
							"include": "source.lua"
						},
						{
							"include": "#escaped_char"
						}
					]
				}
			]
		},
		{
			"begin": "(?=(?><<[-~]([\"'`]?)((?:[_\\w]+_|)RUBY)\\b\\1))",
			"comment": "Heredoc with embedded Ruby",
			"end": "(?!\\G)",
			"name": "meta.embedded.block.ruby",
			"patterns": [
				{
					"begin": "(?><<[-~]([\"'`]?)((?:[_\\w]+_|)RUBY)\\b\\1)",
					"beginCaptures": {
						"0": {
							"name": "string.definition.begin.ruby"
						}
					},
					"contentName": "source.ruby",
					"end": "^\\s*\\2$\\n?",
					"endCaptures": {
						"0": {
							"name": "string.definition.end.ruby"
						}
					},
					"patterns": [
						{
							"include": "#heredoc"
						},
						{
							"include": "#interpolated_ruby"
						},
						{
							"include": "source.ruby"
						},
						{
							"include": "#escaped_char"
						}
					]
				}
			]
		},
		{
			"begin": "(?=(?><<[-~]([\"'`]?)((?:[_\\w]+_|)(?:YAML|YML))\\b\\1))",
			"comment": "Heredoc with embedded YAML",
			"end": "(?!\\G)",
			"name": "meta.embedded.block.yaml",
			"patterns": [
				{
					"begin": "(?><<[-~]([\"'`]?)((?:[_\\w]+_|)(?:YAML|YML))\\b\\1)",
					"beginCaptures": {
						"0": {
							"name": "string.definition.begin.ruby"
						}
					},
					"contentName": "source.yaml",
					"end": "^\\s*\\2$\\n?",
					"endCaptures": {
						"0": {
							"name": "string.definition.end.ruby"
						}
					},
					"patterns": [
						{
							"include": "#heredoc"
						},
						{
							"include": "#interpolated_ruby"
						},
						{
							"include": "source.yaml"
						},
						{
							"include": "#escaped_char"
						}
					]
				}
			]
		},
		{
			"begin": "(?=(?><<[-~]([\"'`]?)((?:[_\\w]+_|)SLIM)\\b\\1))",
			"comment": "Heredoc with embedded Slim",
			"end": "(?!\\G)",
			"name": "meta.embedded.block.slim",
			"patterns": [
				{
					"begin": "(?><<[-~]([\"'`]?)((?:[_\\w]+_|)SLIM)\\b\\1)",
					"beginCaptures": {
						"0": {
							"name": "string.definition.begin.ruby"
						}
					},
					"contentName": "text.slim",
					"end": "^\\s*\\2$\\n?",
					"endCaptures": {
						"0": {
							"name": "string.definition.end.ruby"
						}
					},
					"patterns": [
						{
							"include": "#heredoc"
						},
						{
							"include": "#interpolated_ruby"
						},
						{
							"include": "text.slim"
						},
						{
							"include": "#escaped_char"
						}
					]
				}
			]
		},
		{
			"begin": "(?>=\\s*<<([\"'`]?)(\\w+)\\1)",
			"beginCaptures": {
				"0": {
					"name": "string.definition.begin.ruby"
				}
			},
			"end": "^\\2$",
			"endCaptures": {
				"0": {
					"name": "string.definition.end.ruby"
				}
			},
			"contentName": "string.unquoted.heredoc.ruby",
			"patterns": [
				{
					"include": "#heredoc"
				},
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				}
			]
		},
		{
			"begin": "(?>((<<[-~]([\"'`]?)(\\w+)\\3,\\s?)*<<[-~]([\"'`]?)(\\w+)\\5))(.*)",
			"beginCaptures": {
				"1": {
					"name": "string.definition.begin.ruby"
				},
				"7": {
					"patterns": [
						{
							"include": "source.ruby"
						}
					]
				}
			},
			"comment": "heredoc with multiple inputs and indented terminator",
			"end": "^\\s*\\6$",
			"endCaptures": {
				"0": {
					"name": "string.definition.end.ruby"
				}
			},
			"contentName": "string.unquoted.heredoc.ruby",
			"patterns": [
				{
					"include": "#heredoc"
				},
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				}
			]
		},
		{
			"begin": "(?<={|{\\s+|[^A-Za-z0-9_:@$]do|^do|[^A-Za-z0-9_:@$]do\\s+|^do\\s+)(\\|)",
			"name": "meta.block.parameters.ruby",
			"captures": {
				"1": {
					"name": "punctuation.separator.variable.ruby"
				}
			},
			"end": "(?<!\\|)(\\|)(?!\\|)",
			"patterns": [
				{
					"begin": "(?![\\s,|(])",
					"end": "(?=,|\\|\\s*)",
					"patterns": [
						{
							"match": "\\G((?:&|\\*\\*?)?)([a-zA-Z_][\\w_]*)",
							"captures": {
								"1": {
									"name": "storage.type.variable.ruby"
								},
								"2": {
									"name": "variable.other.block.ruby"
								}
							}
						}
					]
				},
				{
					"match": ",",
					"name": "punctuation.separator.variable.ruby"
				}
			]
		},
		{
			"match": "=>",
			"name": "punctuation.separator.key-value"
		},
		{
			"match": "->",
			"name": "support.function.kernel.ruby"
		},
		{
			"match": "<<=|%=|&{1,2}=|\\*=|\\*\\*=|\\+=|-=|\\^=|\\|{1,2}=|<<",
			"name": "keyword.operator.assignment.augmented.ruby"
		},
		{
			"match": "<=>|<(?!<|=)|>(?!<|=|>)|<=|>=|===|==|=~|!=|!~|(?<=[ \\t])\\?",
			"name": "keyword.operator.comparison.ruby"
		},
		{
			"match": "(?<!\\.)\\b(and|not|or)\\b(?![?!])",
			"name": "keyword.operator.logical.ruby"
		},
		{
			"match": "(?<=^|[ \\t!])!|&&|\\|\\||\\^",
			"name": "keyword.operator.logical.ruby"
		},
		{
			"comment": "Safe navigation operator",
			"match": "(&\\.)\\s*(?![A-Z])",
			"captures": {
				"1": {
					"name": "keyword.operator.logical.ruby"
				}
			}
		},
		{
			"match": "(%|&|\\*\\*|\\*|\\+|-|/)",
			"name": "keyword.operator.arithmetic.ruby"
		},
		{
			"match": "=",
			"name": "keyword.operator.assignment.ruby"
		},
		{
			"match": "\\||~|>>",
			"name": "keyword.operator.other.ruby"
		},
		{
			"match": ";",
			"name": "punctuation.separator.statement.ruby"
		},
		{
			"match": ",",
			"name": "punctuation.separator.object.ruby"
		},
		{
			"comment": "Mark as namespace separator if double colons followed by capital letter",
			"match": "(::)\\s*(?=[A-Z])",
			"captures": {
				"1": {
					"name": "punctuation.separator.namespace.ruby"
				}
			}
		},
		{
			"comment": "Mark as method separator if double colons not followed by capital letter",
			"match": "(\\.|::)\\s*(?![A-Z])",
			"captures": {
				"1": {
					"name": "punctuation.separator.method.ruby"
				}
			}
		},
		{
			"comment": "Must come after method and constant separators to prefer double colons",
			"match": ":",
			"name": "punctuation.separator.other.ruby"
		},
		{
			"match": "{",
			"name": "punctuation.section.scope.begin.ruby"
		},
		{
			"match": "}",
			"name": "punctuation.section.scope.end.ruby"
		},
		{
			"match": "\\[",
			"name": "punctuation.section.array.begin.ruby"
		},
		{
			"match": "]",
			"name": "punctuation.section.array.end.ruby"
		},
		{
			"match": "\\(|\\)",
			"name": "punctuation.section.function.ruby"
		},
		{
			"name": "meta.function-call.ruby",
			"begin": "(?<=[^\\.]\\.|::)(?=[a-zA-Z][a-zA-Z0-9_!?]*[^a-zA-Z0-9_!?])",
			"end": "(?<=[a-zA-Z0-9_!?])(?=[^a-zA-Z0-9_!?])",
			"patterns": [
				{
					"name": "entity.name.function.ruby",
					"match": "([a-zA-Z][a-zA-Z0-9_!?]*)(?=[^a-zA-Z0-9_!?])"
				}
			]
		},
		{
			"begin": "([a-zA-Z]\\w*[!?]?)(\\()",
			"beginCaptures": {
				"1": {
					"name": "entity.name.function.ruby"
				},
				"2": {
					"name": "punctuation.section.function.ruby"
				}
			},
			"end": "(\\))",
			"endCaptures": {
				"1": {
					"name": "punctuation.section.function.ruby"
				}
			},
			"name": "meta.function-call.ruby",
			"patterns": [
				{
					"include": "$self"
				}
			]
		}
	],
	"repository": {
		"method_parameters": {
			"patterns": [
				{
					"include": "#parens"
				},
				{
					"include": "#braces"
				},
				{
					"include": "#brackets"
				},
				{
					"include": "#params"
				},
				{
					"include": "$self"
				}
			],
			"repository": {
				"params": {
					"captures": {
						"1": {
							"name": "storage.type.variable.ruby"
						},
						"2": {
							"name": "constant.other.symbol.hashkey.parameter.function.ruby"
						},
						"3": {
							"name": "punctuation.definition.constant.ruby"
						},
						"4": {
							"name": "variable.parameter.function.ruby"
						}
					},
					"match": "\\G(&|\\*\\*?)?(?:([_a-zA-Z]\\w*[?!]?(:))|([_a-zA-Z]\\w*))"
				},
				"braces": {
					"begin": "\\{",
					"beginCaptures": {
						"0": {
							"name": "punctuation.section.scope.begin.ruby"
						}
					},
					"end": "\\}",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.scope.end.ruby"
						}
					},
					"patterns": [
						{
							"include": "#parens"
						},
						{
							"include": "#braces"
						},
						{
							"include": "#brackets"
						},
						{
							"include": "$self"
						}
					]
				},
				"brackets": {
					"begin": "\\[",
					"beginCaptures": {
						"0": {
							"name": "punctuation.section.array.begin.ruby"
						}
					},
					"end": "\\]",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.array.end.ruby"
						}
					},
					"patterns": [
						{
							"include": "#parens"
						},
						{
							"include": "#braces"
						},
						{
							"include": "#brackets"
						},
						{
							"include": "$self"
						}
					]
				},
				"parens": {
					"begin": "\\(",
					"beginCaptures": {
						"0": {
							"name": "punctuation.section.function.begin.ruby"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.function.end.ruby"
						}
					},
					"patterns": [
						{
							"include": "#parens"
						},
						{
							"include": "#braces"
						},
						{
							"include": "#brackets"
						},
						{
							"include": "$self"
						}
					]
				}
			}
		},
		"escaped_char": {
			"match": "\\\\(?:[0-7]{1,3}|x[\\da-fA-F]{1,2}|.)",
			"name": "constant.character.escape.ruby"
		},
		"heredoc": {
			"begin": "^<<[-~]?\\w+",
			"end": "$",
			"patterns": [
				{
					"include": "$self"
				}
			]
		},
		"interpolated_ruby": {
			"patterns": [
				{
					"begin": "#{",
					"beginCaptures": {
						"0": {
							"name": "punctuation.section.embedded.begin.ruby"
						}
					},
					"contentName": "source.ruby",
					"end": "}",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.embedded.end.ruby"
						}
					},
					"name": "meta.embedded.line.ruby",
					"patterns": [
						{
							"include": "#nest_curly_and_self"
						},
						{
							"include": "$self"
						}
					]
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.variable.ruby"
						}
					},
					"match": "(#@)[a-zA-Z_]\\w*",
					"name": "variable.other.readwrite.instance.ruby"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.variable.ruby"
						}
					},
					"match": "(#@@)[a-zA-Z_]\\w*",
					"name": "variable.other.readwrite.class.ruby"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.variable.ruby"
						}
					},
					"match": "(#\\$)[a-zA-Z_]\\w*",
					"name": "variable.other.readwrite.global.ruby"
				}
			]
		},
		"nest_brackets": {
			"begin": "\\[",
			"captures": {
				"0": {
					"name": "punctuation.section.scope.ruby"
				}
			},
			"end": "]",
			"patterns": [
				{
					"include": "#nest_brackets"
				}
			]
		},
		"nest_brackets_i": {
			"begin": "\\[",
			"captures": {
				"0": {
					"name": "punctuation.section.scope.ruby"
				}
			},
			"end": "]",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nest_brackets_i"
				}
			]
		},
		"nest_brackets_r": {
			"begin": "\\[",
			"captures": {
				"0": {
					"name": "punctuation.section.scope.ruby"
				}
			},
			"end": "]",
			"patterns": [
				{
					"include": "#regex_sub"
				},
				{
					"include": "#nest_brackets_r"
				}
			]
		},
		"nest_curly": {
			"begin": "{",
			"captures": {
				"0": {
					"name": "punctuation.section.scope.ruby"
				}
			},
			"end": "}",
			"patterns": [
				{
					"include": "#nest_curly"
				}
			]
		},
		"nest_curly_and_self": {
			"patterns": [
				{
					"begin": "{",
					"captures": {
						"0": {
							"name": "punctuation.section.scope.ruby"
						}
					},
					"end": "}",
					"patterns": [
						{
							"include": "#nest_curly_and_self"
						}
					]
				},
				{
					"include": "$self"
				}
			]
		},
		"nest_curly_i": {
			"begin": "{",
			"captures": {
				"0": {
					"name": "punctuation.section.scope.ruby"
				}
			},
			"end": "}",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nest_curly_i"
				}
			]
		},
		"nest_curly_r": {
			"begin": "{",
			"captures": {
				"0": {
					"name": "punctuation.section.scope.ruby"
				}
			},
			"end": "}",
			"patterns": [
				{
					"include": "#regex_sub"
				},
				{
					"include": "#nest_curly_r"
				}
			]
		},
		"nest_ltgt": {
			"begin": "<",
			"captures": {
				"0": {
					"name": "punctuation.section.scope.ruby"
				}
			},
			"end": ">",
			"patterns": [
				{
					"include": "#nest_ltgt"
				}
			]
		},
		"nest_ltgt_i": {
			"begin": "<",
			"captures": {
				"0": {
					"name": "punctuation.section.scope.ruby"
				}
			},
			"end": ">",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nest_ltgt_i"
				}
			]
		},
		"nest_ltgt_r": {
			"begin": "<",
			"captures": {
				"0": {
					"name": "punctuation.section.scope.ruby"
				}
			},
			"end": ">",
			"patterns": [
				{
					"include": "#regex_sub"
				},
				{
					"include": "#nest_ltgt_r"
				}
			]
		},
		"nest_parens": {
			"begin": "\\(",
			"captures": {
				"0": {
					"name": "punctuation.section.scope.ruby"
				}
			},
			"end": "\\)",
			"patterns": [
				{
					"include": "#nest_parens"
				}
			]
		},
		"nest_parens_i": {
			"begin": "\\(",
			"captures": {
				"0": {
					"name": "punctuation.section.scope.ruby"
				}
			},
			"end": "\\)",
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				},
				{
					"include": "#nest_parens_i"
				}
			]
		},
		"nest_parens_r": {
			"begin": "\\(",
			"captures": {
				"0": {
					"name": "punctuation.section.scope.ruby"
				}
			},
			"end": "\\)",
			"patterns": [
				{
					"include": "#regex_sub"
				},
				{
					"include": "#nest_parens_r"
				}
			]
		},
		"regex_sub": {
			"patterns": [
				{
					"include": "#interpolated_ruby"
				},
				{
					"include": "#escaped_char"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.arbitrary-repetition.ruby"
						},
						"3": {
							"name": "punctuation.definition.arbitrary-repetition.ruby"
						}
					},
					"match": "({)\\d+(,\\d+)?(})",
					"name": "string.regexp.arbitrary-repetition.ruby"
				},
				{
					"begin": "\\[(?:\\^?])?",
					"captures": {
						"0": {
							"name": "punctuation.definition.character-class.ruby"
						}
					},
					"end": "]",
					"name": "string.regexp.character-class.ruby",
					"patterns": [
						{
							"include": "#escaped_char"
						}
					]
				},
				{
					"begin": "\\(\\?#",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.comment.begin.ruby"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.comment.end.ruby"
						}
					},
					"name": "comment.line.number-sign.ruby",
					"patterns": [
						{
							"include": "#escaped_char"
						}
					]
				},
				{
					"begin": "\\(",
					"captures": {
						"0": {
							"name": "punctuation.definition.group.ruby"
						}
					},
					"end": "\\)",
					"name": "string.regexp.group.ruby",
					"patterns": [
						{
							"include": "#regex_sub"
						}
					]
				},
				{
					"begin": "(?<=^|\\s)(#)\\s(?=[[a-zA-Z0-9,. \\t?!-][^\\x{00}-\\x{7F}]]*$)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.comment.ruby"
						}
					},
					"comment": "We are restrictive in what we allow to go after the comment character to avoid false positives, since the availability of comments depend on regexp flags.",
					"end": "$\\n?",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.comment.ruby"
						}
					},
					"name": "comment.line.number-sign.ruby"
				}
			]
		},
		"yard": {
			"patterns": [
				{
					"include": "#yard_comment"
				},
				{
					"include": "#yard_param_types"
				},
				{
					"include": "#yard_option"
				},
				{
					"include": "#yard_tag"
				},
				{
					"include": "#yard_types"
				},
				{
					"include": "#yard_directive"
				},
				{
					"include": "#yard_see"
				},
				{
					"include": "#yard_macro_attribute"
				}
			]
		},
		"yard_see": {
			"comment": "separate rule for @see because name could contain url",
			"begin": "^(\\s*)(#)(\\s*)(@)(see)(?=\\s)(\\s+(.+?))?(?=\\s|$)",
			"beginCaptures": {
				"2": {
					"name": "punctuation.definition.comment.ruby"
				},
				"4": {
					"name": "comment.line.keyword.punctuation.yard.ruby"
				},
				"5": {
					"name": "comment.line.keyword.yard.ruby"
				},
				"7": {
					"name": "comment.line.parameter.yard.ruby"
				}
			},
			"end": "^(?!\\s*#\\3\\s{2,}|\\s*#\\s*$)",
			"contentName": "comment.line.string.yard.ruby",
			"name": "comment.line.number-sign.ruby",
			"patterns": [
				{
					"include": "#yard"
				},
				{
					"include": "#yard_continuation"
				}
			]
		},
		"yard_macro_attribute": {
			"comment": "separate rule for attribute and macro tags because name goes after []",
			"begin": "^(\\s*)(#)(\\s*)(@!)(attribute|macro)(\\s+((\\[).+(])))?(?=\\s)(\\s+([a-z_]\\w*:?))?",
			"beginCaptures": {
				"2": {
					"name": "punctuation.definition.comment.ruby"
				},
				"4": {
					"name": "comment.line.keyword.punctuation.yard.ruby"
				},
				"5": {
					"name": "comment.line.keyword.yard.ruby"
				},
				"7": {
					"name": "comment.line.type.yard.ruby"
				},
				"8": {
					"name": "comment.line.punctuation.yard.ruby"
				},
				"9": {
					"name": "comment.line.punctuation.yard.ruby"
				},
				"11": {
					"name": "comment.line.parameter.yard.ruby"
				}
			},
			"end": "^(?!\\s*#\\3\\s{2,}|\\s*#\\s*$)",
			"contentName": "comment.line.string.yard.ruby",
			"name": "comment.line.number-sign.ruby",
			"patterns": [
				{
					"include": "#yard"
				},
				{
					"include": "#yard_continuation"
				}
			]
		},
		"yard_comment": {
			"comment": "For YARD tags that follow the tag-comment pattern",
			"begin": "^(\\s*)(#)(\\s*)(@)(abstract|api|author|deprecated|example|macro|note|overload|since|todo|version)(?=\\s|$)",
			"beginCaptures": {
				"2": {
					"name": "punctuation.definition.comment.ruby"
				},
				"4": {
					"name": "comment.line.keyword.punctuation.yard.ruby"
				},
				"5": {
					"name": "comment.line.keyword.yard.ruby"
				}
			},
			"end": "^(?!\\s*#\\3\\s{2,}|\\s*#\\s*$)",
			"contentName": "comment.line.string.yard.ruby",
			"name": "comment.line.number-sign.ruby",
			"patterns": [
				{
					"include": "#yard"
				},
				{
					"include": "#yard_continuation"
				}
			]
		},
		"yard_param_types": {
			"comment": "For YARD tags that follow the tag-name-types-description or tag-types-name-description pattern",
			"begin": "^(\\s*)(#)(\\s*)(@)(attr|attr_reader|attr_writer|yieldparam|param)(?=\\s)(?>\\s+(?>([a-z_]\\w*:?)|((\\[).+(]))))?(?>\\s+(?>((\\[).+(]))|([a-z_]\\w*:?)))?",
			"beginCaptures": {
				"2": {
					"name": "punctuation.definition.comment.ruby"
				},
				"4": {
					"name": "comment.line.keyword.punctuation.yard.ruby"
				},
				"5": {
					"name": "comment.line.keyword.yard.ruby"
				},
				"6": {
					"name": "comment.line.parameter.yard.ruby"
				},
				"7": {
					"name": "comment.line.type.yard.ruby"
				},
				"8": {
					"name": "comment.line.punctuation.yard.ruby"
				},
				"9": {
					"name": "comment.line.punctuation.yard.ruby"
				},
				"10": {
					"name": "comment.line.type.yard.ruby"
				},
				"11": {
					"name": "comment.line.punctuation.yard.ruby"
				},
				"12": {
					"name": "comment.line.punctuation.yard.ruby"
				},
				"13": {
					"name": "comment.line.parameter.yard.ruby"
				}
			},
			"end": "^(?!\\s*#\\3\\s{2,}|\\s*#\\s*$)",
			"contentName": "comment.line.string.yard.ruby",
			"name": "comment.line.number-sign.ruby",
			"patterns": [
				{
					"include": "#yard"
				},
				{
					"include": "#yard_continuation"
				}
			]
		},
		"yard_option": {
			"comment": "For YARD option tag that follow the tag-name-types-key-(value)-description pattern",
			"begin": "^(\\s*)(#)(\\s*)(@)(option)(?=\\s)(?>\\s+([a-z_]\\w*:?))?(?>\\s+((\\[).+(])))?(?>\\s+((\\S*)))?(?>\\s+((\\().+(\\))))?",
			"beginCaptures": {
				"2": {
					"name": "punctuation.definition.comment.ruby"
				},
				"4": {
					"name": "comment.line.keyword.punctuation.yard.ruby"
				},
				"5": {
					"name": "comment.line.keyword.yard.ruby"
				},
				"6": {
					"name": "comment.line.parameter.yard.ruby"
				},
				"7": {
					"name": "comment.line.type.yard.ruby"
				},
				"8": {
					"name": "comment.line.punctuation.yard.ruby"
				},
				"9": {
					"name": "comment.line.punctuation.yard.ruby"
				},
				"10": {
					"name": "comment.line.keyword.yard.ruby"
				},
				"11": {
					"name": "comment.line.hashkey.yard.ruby"
				},
				"12": {
					"name": "comment.line.defaultvalue.yard.ruby"
				},
				"13": {
					"name": "comment.line.punctuation.yard.ruby"
				},
				"14": {
					"name": "comment.line.punctuation.yard.ruby"
				}
			},
			"end": "^(?!\\s*#\\3\\s{2,}|\\s*#\\s*$)",
			"contentName": "comment.line.string.yard.ruby",
			"name": "comment.line.number-sign.ruby",
			"patterns": [
				{
					"include": "#yard"
				},
				{
					"include": "#yard_continuation"
				}
			]
		},
		"yard_tag": {
			"comment": "For YARD tags that are just the tag",
			"match": "^(\\s*)(#)(\\s*)(@)(private)$",
			"captures": {
				"2": {
					"name": "punctuation.definition.comment.ruby"
				},
				"4": {
					"name": "comment.line.keyword.punctuation.yard.ruby"
				},
				"5": {
					"name": "comment.line.keyword.yard.ruby"
				}
			},
			"name": "comment.line.number-sign.ruby"
		},
		"yard_types": {
			"comment": "For YARD tags that follow the tag-types-comment pattern",
			"begin": "^(\\s*)(#)(\\s*)(@)(raise|return|yield(?:return)?)(?=\\s)(\\s+((\\[).+(])))?",
			"beginCaptures": {
				"2": {
					"name": "punctuation.definition.comment.ruby"
				},
				"4": {
					"name": "comment.line.keyword.punctuation.yard.ruby"
				},
				"5": {
					"name": "comment.line.keyword.yard.ruby"
				},
				"7": {
					"name": "comment.line.type.yard.ruby"
				},
				"8": {
					"name": "comment.line.punctuation.yard.ruby"
				},
				"9": {
					"name": "comment.line.punctuation.yard.ruby"
				}
			},
			"end": "^(?!\\s*#\\3\\s{2,}|\\s*#\\s*$)",
			"contentName": "comment.line.string.yard.ruby",
			"name": "comment.line.number-sign.ruby",
			"patterns": [
				{
					"include": "#yard"
				},
				{
					"include": "#yard_continuation"
				}
			]
		},
		"yard_directive": {
			"comment": "For YARD directives",
			"begin": "^(\\s*)(#)(\\s*)(@!)(endgroup|group|method|parse|scope|visibility)(\\s+((\\[).+(])))?(?=\\s)",
			"beginCaptures": {
				"2": {
					"name": "punctuation.definition.comment.ruby"
				},
				"4": {
					"name": "comment.line.keyword.punctuation.yard.ruby"
				},
				"5": {
					"name": "comment.line.keyword.yard.ruby"
				},
				"7": {
					"name": "comment.line.type.yard.ruby"
				},
				"8": {
					"name": "comment.line.punctuation.yard.ruby"
				},
				"9": {
					"name": "comment.line.punctuation.yard.ruby"
				}
			},
			"end": "^(?!\\s*#\\3\\s{2,}|\\s*#\\s*$)",
			"contentName": "comment.line.string.yard.ruby",
			"name": "comment.line.number-sign.ruby",
			"patterns": [
				{
					"include": "#yard"
				},
				{
					"include": "#yard_continuation"
				}
			]
		},
		"yard_continuation": {
			"match": "^\\s*#",
			"name": "punctuation.definition.comment.ruby"
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/rust/.vscodeignore]---
Location: vscode-main/extensions/rust/.vscodeignore

```text
test/**
cgmanifest.json
build/**
```

--------------------------------------------------------------------------------

---[FILE: extensions/rust/cgmanifest.json]---
Location: vscode-main/extensions/rust/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "rust-syntax",
					"repositoryUrl": "https://github.com/dustypomerleau/rust-syntax",
					"commitHash": "268fd42cfd4aa96a6ed9024a2850d17d6cd2dc7b"
				}
			},
			"license": "MIT",
			"description": "A TextMate-style grammar for Rust.",
			"version": "0.6.1"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/rust/language-configuration.json]---
Location: vscode-main/extensions/rust/language-configuration.json

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
			"open": "\"",
			"close": "\"",
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
			"<",
			">"
		]
	],
	"indentationRules": {
		"increaseIndentPattern": "^.*\\{[^}\"']*$|^.*\\([^\\)\"']*$",
		"decreaseIndentPattern": "^\\s*(\\s*\\/[*].*[*]\\/\\s*)*[})]"
	},
	"folding": {
		"markers": {
			"start": "^\\s*//\\s*#?region\\b",
			"end": "^\\s*//\\s*#?endregion\\b"
		}
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

---[FILE: extensions/rust/package.json]---
Location: vscode-main/extensions/rust/package.json

```json
{
  "name": "rust",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "scripts": {
    "update-grammar": "node ./build/update-grammar.mjs"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "rust",
        "extensions": [
          ".rs"
        ],
        "aliases": [
          "Rust",
          "rust"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "rust",
        "path": "./syntaxes/rust.tmLanguage.json",
        "scopeName": "source.rust"
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

---[FILE: extensions/rust/package.nls.json]---
Location: vscode-main/extensions/rust/package.nls.json

```json
{
	"displayName": "Rust Language Basics",
	"description": "Provides syntax highlighting and bracket matching in Rust files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/rust/build/update-grammar.mjs]---
Location: vscode-main/extensions/rust/build/update-grammar.mjs

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
//@ts-check

import * as vscodeGrammarUpdater from 'vscode-grammar-updater';

vscodeGrammarUpdater.update('dustypomerleau/rust-syntax', 'syntaxes/rust.tmLanguage.json', './syntaxes/rust.tmLanguage.json', undefined, 'main');
```

--------------------------------------------------------------------------------

---[FILE: extensions/rust/syntaxes/rust.tmLanguage.json]---
Location: vscode-main/extensions/rust/syntaxes/rust.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/dustypomerleau/rust-syntax/blob/master/syntaxes/rust.tmLanguage.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/dustypomerleau/rust-syntax/commit/268fd42cfd4aa96a6ed9024a2850d17d6cd2dc7b",
	"name": "Rust",
	"scopeName": "source.rust",
	"patterns": [
		{
			"comment": "boxed slice literal",
			"begin": "(<)(\\[)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.brackets.angle.rust"
				},
				"2": {
					"name": "punctuation.brackets.square.rust"
				}
			},
			"end": ">",
			"endCaptures": {
				"0": {
					"name": "punctuation.brackets.angle.rust"
				}
			},
			"patterns": [
				{
					"include": "#block-comments"
				},
				{
					"include": "#comments"
				},
				{
					"include": "#gtypes"
				},
				{
					"include": "#lvariables"
				},
				{
					"include": "#lifetimes"
				},
				{
					"include": "#punctuation"
				},
				{
					"include": "#types"
				}
			]
		},
		{
			"comment": "macro type metavariables",
			"name": "meta.macro.metavariable.type.rust",
			"match": "(\\$)((crate)|([A-Z]\\w*))(\\s*(:)\\s*(block|expr(?:_2021)?|ident|item|lifetime|literal|meta|pat(?:_param)?|path|stmt|tt|ty|vis)\\b)?",
			"captures": {
				"1": {
					"name": "keyword.operator.macro.dollar.rust"
				},
				"3": {
					"name": "keyword.other.crate.rust"
				},
				"4": {
					"name": "entity.name.type.metavariable.rust"
				},
				"6": {
					"name": "keyword.operator.key-value.rust"
				},
				"7": {
					"name": "variable.other.metavariable.specifier.rust"
				}
			},
			"patterns": [
				{
					"include": "#keywords"
				}
			]
		},
		{
			"comment": "macro metavariables",
			"name": "meta.macro.metavariable.rust",
			"match": "(\\$)([a-z]\\w*)(\\s*(:)\\s*(block|expr(?:_2021)?|ident|item|lifetime|literal|meta|pat(?:_param)?|path|stmt|tt|ty|vis)\\b)?",
			"captures": {
				"1": {
					"name": "keyword.operator.macro.dollar.rust"
				},
				"2": {
					"name": "variable.other.metavariable.name.rust"
				},
				"4": {
					"name": "keyword.operator.key-value.rust"
				},
				"5": {
					"name": "variable.other.metavariable.specifier.rust"
				}
			},
			"patterns": [
				{
					"include": "#keywords"
				}
			]
		},
		{
			"comment": "macro rules",
			"name": "meta.macro.rules.rust",
			"match": "\\b(macro_rules!)\\s+(([a-z0-9_]+)|([A-Z][a-z0-9_]*))\\s+(\\{)",
			"captures": {
				"1": {
					"name": "entity.name.function.macro.rules.rust"
				},
				"3": {
					"name": "entity.name.function.macro.rust"
				},
				"4": {
					"name": "entity.name.type.macro.rust"
				},
				"5": {
					"name": "punctuation.brackets.curly.rust"
				}
			}
		},
		{
			"comment": "modules",
			"match": "(mod)\\s+((?:r#(?!crate|[Ss]elf|super))?[a-z][A-Za-z0-9_]*)",
			"captures": {
				"1": {
					"name": "storage.type.rust"
				},
				"2": {
					"name": "entity.name.module.rust"
				}
			}
		},
		{
			"comment": "external crate imports",
			"name": "meta.import.rust",
			"begin": "\\b(extern)\\s+(crate)",
			"beginCaptures": {
				"1": {
					"name": "storage.type.rust"
				},
				"2": {
					"name": "keyword.other.crate.rust"
				}
			},
			"end": ";",
			"endCaptures": {
				"0": {
					"name": "punctuation.semi.rust"
				}
			},
			"patterns": [
				{
					"include": "#block-comments"
				},
				{
					"include": "#comments"
				},
				{
					"include": "#keywords"
				},
				{
					"include": "#punctuation"
				}
			]
		},
		{
			"comment": "use statements",
			"name": "meta.use.rust",
			"begin": "\\b(use)\\s",
			"beginCaptures": {
				"1": {
					"name": "keyword.other.rust"
				}
			},
			"end": ";",
			"endCaptures": {
				"0": {
					"name": "punctuation.semi.rust"
				}
			},
			"patterns": [
				{
					"include": "#block-comments"
				},
				{
					"include": "#comments"
				},
				{
					"include": "#keywords"
				},
				{
					"include": "#namespaces"
				},
				{
					"include": "#punctuation"
				},
				{
					"include": "#types"
				},
				{
					"include": "#lvariables"
				}
			]
		},
		{
			"include": "#block-comments"
		},
		{
			"include": "#comments"
		},
		{
			"include": "#attributes"
		},
		{
			"include": "#lvariables"
		},
		{
			"include": "#constants"
		},
		{
			"include": "#gtypes"
		},
		{
			"include": "#functions"
		},
		{
			"include": "#types"
		},
		{
			"include": "#keywords"
		},
		{
			"include": "#lifetimes"
		},
		{
			"include": "#macros"
		},
		{
			"include": "#namespaces"
		},
		{
			"include": "#punctuation"
		},
		{
			"include": "#strings"
		},
		{
			"include": "#variables"
		}
	],
	"repository": {
		"comments": {
			"patterns": [
				{
					"comment": "documentation comments",
					"name": "comment.line.documentation.rust",
					"match": "(///).*$",
					"captures": {
						"1": {
							"name": "punctuation.definition.comment.rust"
						}
					}
				},
				{
					"comment": "line comments",
					"name": "comment.line.double-slash.rust",
					"match": "(//).*$",
					"captures": {
						"1": {
							"name": "punctuation.definition.comment.rust"
						}
					}
				}
			]
		},
		"block-comments": {
			"patterns": [
				{
					"comment": "empty block comments",
					"name": "comment.block.rust",
					"match": "/\\*\\*/"
				},
				{
					"comment": "block documentation comments",
					"name": "comment.block.documentation.rust",
					"begin": "/\\*\\*",
					"end": "\\*/",
					"patterns": [
						{
							"include": "#block-comments"
						}
					]
				},
				{
					"comment": "block comments",
					"name": "comment.block.rust",
					"begin": "/\\*(?!\\*)",
					"end": "\\*/",
					"patterns": [
						{
							"include": "#block-comments"
						}
					]
				}
			]
		},
		"constants": {
			"patterns": [
				{
					"comment": "ALL CAPS constants",
					"name": "constant.other.caps.rust",
					"match": "\\b[A-Z]{2}[A-Z0-9_]*\\b"
				},
				{
					"comment": "constant declarations",
					"match": "\\b(const)\\s+([A-Z][A-Za-z0-9_]*)\\b",
					"captures": {
						"1": {
							"name": "storage.type.rust"
						},
						"2": {
							"name": "constant.other.caps.rust"
						}
					}
				},
				{
					"comment": "decimal integers and floats",
					"name": "constant.numeric.decimal.rust",
					"match": "\\b\\d[\\d_]*(\\.?)[\\d_]*(?:(E|e)([+-]?)([\\d_]+))?(f32|f64|i128|i16|i32|i64|i8|isize|u128|u16|u32|u64|u8|usize)?\\b",
					"captures": {
						"1": {
							"name": "punctuation.separator.dot.decimal.rust"
						},
						"2": {
							"name": "keyword.operator.exponent.rust"
						},
						"3": {
							"name": "keyword.operator.exponent.sign.rust"
						},
						"4": {
							"name": "constant.numeric.decimal.exponent.mantissa.rust"
						},
						"5": {
							"name": "entity.name.type.numeric.rust"
						}
					}
				},
				{
					"comment": "hexadecimal integers",
					"name": "constant.numeric.hex.rust",
					"match": "\\b0x[\\da-fA-F_]+(i128|i16|i32|i64|i8|isize|u128|u16|u32|u64|u8|usize)?\\b",
					"captures": {
						"1": {
							"name": "entity.name.type.numeric.rust"
						}
					}
				},
				{
					"comment": "octal integers",
					"name": "constant.numeric.oct.rust",
					"match": "\\b0o[0-7_]+(i128|i16|i32|i64|i8|isize|u128|u16|u32|u64|u8|usize)?\\b",
					"captures": {
						"1": {
							"name": "entity.name.type.numeric.rust"
						}
					}
				},
				{
					"comment": "binary integers",
					"name": "constant.numeric.bin.rust",
					"match": "\\b0b[01_]+(i128|i16|i32|i64|i8|isize|u128|u16|u32|u64|u8|usize)?\\b",
					"captures": {
						"1": {
							"name": "entity.name.type.numeric.rust"
						}
					}
				},
				{
					"comment": "booleans",
					"name": "constant.language.bool.rust",
					"match": "\\b(true|false)\\b"
				}
			]
		},
		"escapes": {
			"comment": "escapes: ASCII, byte, Unicode, quote, regex",
			"name": "constant.character.escape.rust",
			"match": "(\\\\)(?:(?:(x[0-7][\\da-fA-F])|(u(\\{)[\\da-fA-F]{4,6}(\\}))|.))",
			"captures": {
				"1": {
					"name": "constant.character.escape.backslash.rust"
				},
				"2": {
					"name": "constant.character.escape.bit.rust"
				},
				"3": {
					"name": "constant.character.escape.unicode.rust"
				},
				"4": {
					"name": "constant.character.escape.unicode.punctuation.rust"
				},
				"5": {
					"name": "constant.character.escape.unicode.punctuation.rust"
				}
			}
		},
		"attributes": {
			"comment": "attributes",
			"name": "meta.attribute.rust",
			"begin": "(#)(\\!?)(\\[)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.attribute.rust"
				},
				"3": {
					"name": "punctuation.brackets.attribute.rust"
				}
			},
			"end": "\\]",
			"endCaptures": {
				"0": {
					"name": "punctuation.brackets.attribute.rust"
				}
			},
			"patterns": [
				{
					"include": "#block-comments"
				},
				{
					"include": "#comments"
				},
				{
					"include": "#keywords"
				},
				{
					"include": "#lifetimes"
				},
				{
					"include": "#punctuation"
				},
				{
					"include": "#strings"
				},
				{
					"include": "#gtypes"
				},
				{
					"include": "#types"
				}
			]
		},
		"functions": {
			"patterns": [
				{
					"comment": "pub as a function",
					"match": "\\b(pub)(\\()",
					"captures": {
						"1": {
							"name": "keyword.other.rust"
						},
						"2": {
							"name": "punctuation.brackets.round.rust"
						}
					}
				},
				{
					"comment": "function definition",
					"name": "meta.function.definition.rust",
					"begin": "\\b(fn)\\s+((?:r#(?!crate|[Ss]elf|super))?[A-Za-z0-9_]+)((\\()|(<))",
					"beginCaptures": {
						"1": {
							"name": "keyword.other.fn.rust"
						},
						"2": {
							"name": "entity.name.function.rust"
						},
						"4": {
							"name": "punctuation.brackets.round.rust"
						},
						"5": {
							"name": "punctuation.brackets.angle.rust"
						}
					},
					"end": "(\\{)|(;)",
					"endCaptures": {
						"1": {
							"name": "punctuation.brackets.curly.rust"
						},
						"2": {
							"name": "punctuation.semi.rust"
						}
					},
					"patterns": [
						{
							"include": "#block-comments"
						},
						{
							"include": "#comments"
						},
						{
							"include": "#keywords"
						},
						{
							"include": "#lvariables"
						},
						{
							"include": "#constants"
						},
						{
							"include": "#gtypes"
						},
						{
							"include": "#functions"
						},
						{
							"include": "#lifetimes"
						},
						{
							"include": "#macros"
						},
						{
							"include": "#namespaces"
						},
						{
							"include": "#punctuation"
						},
						{
							"include": "#strings"
						},
						{
							"include": "#types"
						},
						{
							"include": "#variables"
						}
					]
				},
				{
					"comment": "function/method calls, chaining",
					"name": "meta.function.call.rust",
					"begin": "((?:r#(?!crate|[Ss]elf|super))?[A-Za-z0-9_]+)(\\()",
					"beginCaptures": {
						"1": {
							"name": "entity.name.function.rust"
						},
						"2": {
							"name": "punctuation.brackets.round.rust"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.brackets.round.rust"
						}
					},
					"patterns": [
						{
							"include": "#block-comments"
						},
						{
							"include": "#comments"
						},
						{
							"include": "#attributes"
						},
						{
							"include": "#keywords"
						},
						{
							"include": "#lvariables"
						},
						{
							"include": "#constants"
						},
						{
							"include": "#gtypes"
						},
						{
							"include": "#functions"
						},
						{
							"include": "#lifetimes"
						},
						{
							"include": "#macros"
						},
						{
							"include": "#namespaces"
						},
						{
							"include": "#punctuation"
						},
						{
							"include": "#strings"
						},
						{
							"include": "#types"
						},
						{
							"include": "#variables"
						}
					]
				},
				{
					"comment": "function/method calls with turbofish",
					"name": "meta.function.call.rust",
					"begin": "((?:r#(?!crate|[Ss]elf|super))?[A-Za-z0-9_]+)(?=::<.*>\\()",
					"beginCaptures": {
						"1": {
							"name": "entity.name.function.rust"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.brackets.round.rust"
						}
					},
					"patterns": [
						{
							"include": "#block-comments"
						},
						{
							"include": "#comments"
						},
						{
							"include": "#attributes"
						},
						{
							"include": "#keywords"
						},
						{
							"include": "#lvariables"
						},
						{
							"include": "#constants"
						},
						{
							"include": "#gtypes"
						},
						{
							"include": "#functions"
						},
						{
							"include": "#lifetimes"
						},
						{
							"include": "#macros"
						},
						{
							"include": "#namespaces"
						},
						{
							"include": "#punctuation"
						},
						{
							"include": "#strings"
						},
						{
							"include": "#types"
						},
						{
							"include": "#variables"
						}
					]
				}
			]
		},
		"keywords": {
			"patterns": [
				{
					"comment": "control flow keywords",
					"name": "keyword.control.rust",
					"match": "\\b(await|break|continue|do|else|for|if|loop|match|return|try|while|yield)\\b"
				},
				{
					"comment": "storage keywords",
					"name": "keyword.other.rust storage.type.rust",
					"match": "\\b(extern|let|macro|mod)\\b"
				},
				{
					"comment": "const keyword",
					"name": "storage.modifier.rust",
					"match": "\\b(const)\\b"
				},
				{
					"comment": "type keyword",
					"name": "keyword.declaration.type.rust storage.type.rust",
					"match": "\\b(type)\\b"
				},
				{
					"comment": "enum keyword",
					"name": "keyword.declaration.enum.rust storage.type.rust",
					"match": "\\b(enum)\\b"
				},
				{
					"comment": "trait keyword",
					"name": "keyword.declaration.trait.rust storage.type.rust",
					"match": "\\b(trait)\\b"
				},
				{
					"comment": "struct keyword",
					"name": "keyword.declaration.struct.rust storage.type.rust",
					"match": "\\b(struct)\\b"
				},
				{
					"comment": "storage modifiers",
					"name": "storage.modifier.rust",
					"match": "\\b(abstract|static)\\b"
				},
				{
					"comment": "other keywords",
					"name": "keyword.other.rust",
					"match": "\\b(as|async|become|box|dyn|move|final|gen|impl|in|override|priv|pub|ref|typeof|union|unsafe|unsized|use|virtual|where)\\b"
				},
				{
					"comment": "fn",
					"name": "keyword.other.fn.rust",
					"match": "\\bfn\\b"
				},
				{
					"comment": "crate",
					"name": "keyword.other.crate.rust",
					"match": "\\bcrate\\b"
				},
				{
					"comment": "mut",
					"name": "storage.modifier.mut.rust",
					"match": "\\bmut\\b"
				},
				{
					"comment": "logical operators",
					"name": "keyword.operator.logical.rust",
					"match": "(\\^|\\||\\|\\||&&|<<|>>|!)(?!=)"
				},
				{
					"comment": "logical AND, borrow references",
					"name": "keyword.operator.borrow.and.rust",
					"match": "&(?![&=])"
				},
				{
					"comment": "assignment operators",
					"name": "keyword.operator.assignment.rust",
					"match": "(\\+=|-=|\\*=|/=|%=|\\^=|&=|\\|=|<<=|>>=)"
				},
				{
					"comment": "single equal",
					"name": "keyword.operator.assignment.equal.rust",
					"match": "(?<![<>])=(?!=|>)"
				},
				{
					"comment": "comparison operators",
					"name": "keyword.operator.comparison.rust",
					"match": "(=(=)?(?!>)|!=|<=|(?<!=)>=)"
				},
				{
					"comment": "math operators",
					"name": "keyword.operator.math.rust",
					"match": "(([+%]|(\\*(?!\\w)))(?!=))|(-(?!>))|(/(?!/))"
				},
				{
					"comment": "less than, greater than (special case)",
					"match": "(?:\\b|(?:(\\))|(\\])|(\\})))[ \\t]+([<>])[ \\t]+(?:\\b|(?:(\\()|(\\[)|(\\{)))",
					"captures": {
						"1": {
							"name": "punctuation.brackets.round.rust"
						},
						"2": {
							"name": "punctuation.brackets.square.rust"
						},
						"3": {
							"name": "punctuation.brackets.curly.rust"
						},
						"4": {
							"name": "keyword.operator.comparison.rust"
						},
						"5": {
							"name": "punctuation.brackets.round.rust"
						},
						"6": {
							"name": "punctuation.brackets.square.rust"
						},
						"7": {
							"name": "punctuation.brackets.curly.rust"
						}
					}
				},
				{
					"comment": "namespace operator",
					"name": "keyword.operator.namespace.rust",
					"match": "::"
				},
				{
					"comment": "dereference asterisk",
					"match": "(\\*)(?=\\w+)",
					"captures": {
						"1": {
							"name": "keyword.operator.dereference.rust"
						}
					}
				},
				{
					"comment": "subpattern binding",
					"name": "keyword.operator.subpattern.rust",
					"match": "@"
				},
				{
					"comment": "dot access",
					"name": "keyword.operator.access.dot.rust",
					"match": "\\.(?!\\.)"
				},
				{
					"comment": "ranges, range patterns",
					"name": "keyword.operator.range.rust",
					"match": "\\.{2}(=|\\.)?"
				},
				{
					"comment": "colon",
					"name": "keyword.operator.key-value.rust",
					"match": ":(?!:)"
				},
				{
					"comment": "dashrocket, skinny arrow",
					"name": "keyword.operator.arrow.skinny.rust",
					"match": "->|<-"
				},
				{
					"comment": "hashrocket, fat arrow",
					"name": "keyword.operator.arrow.fat.rust",
					"match": "=>"
				},
				{
					"comment": "dollar macros",
					"name": "keyword.operator.macro.dollar.rust",
					"match": "\\$"
				},
				{
					"comment": "question mark operator, questionably sized, macro kleene matcher",
					"name": "keyword.operator.question.rust",
					"match": "\\?"
				}
			]
		},
		"interpolations": {
			"comment": "curly brace interpolations",
			"name": "meta.interpolation.rust",
			"match": "({)[^\"{}]*(})",
			"captures": {
				"1": {
					"name": "punctuation.definition.interpolation.rust"
				},
				"2": {
					"name": "punctuation.definition.interpolation.rust"
				}
			}
		},
		"lifetimes": {
			"patterns": [
				{
					"comment": "named lifetime parameters",
					"match": "(['])([a-zA-Z_][0-9a-zA-Z_]*)(?!['])\\b",
					"captures": {
						"1": {
							"name": "punctuation.definition.lifetime.rust"
						},
						"2": {
							"name": "entity.name.type.lifetime.rust"
						}
					}
				},
				{
					"comment": "borrowing references to named lifetimes",
					"match": "(\\&)(['])([a-zA-Z_][0-9a-zA-Z_]*)(?!['])\\b",
					"captures": {
						"1": {
							"name": "keyword.operator.borrow.rust"
						},
						"2": {
							"name": "punctuation.definition.lifetime.rust"
						},
						"3": {
							"name": "entity.name.type.lifetime.rust"
						}
					}
				}
			]
		},
		"macros": {
			"patterns": [
				{
					"comment": "macros",
					"name": "meta.macro.rust",
					"match": "(([a-z_][A-Za-z0-9_]*!)|([A-Z_][A-Za-z0-9_]*!))",
					"captures": {
						"2": {
							"name": "entity.name.function.macro.rust"
						},
						"3": {
							"name": "entity.name.type.macro.rust"
						}
					}
				}
			]
		},
		"namespaces": {
			"patterns": [
				{
					"comment": "namespace (non-type, non-function path segment)",
					"match": "(?<![A-Za-z0-9_])([A-Za-z0-9_]+)((?<!super|self)::)",
					"captures": {
						"1": {
							"name": "entity.name.namespace.rust"
						},
						"2": {
							"name": "keyword.operator.namespace.rust"
						}
					}
				}
			]
		},
		"types": {
			"patterns": [
				{
					"comment": "numeric types",
					"match": "(?<![A-Za-z])(f32|f64|i128|i16|i32|i64|i8|isize|u128|u16|u32|u64|u8|usize)\\b",
					"captures": {
						"1": {
							"name": "entity.name.type.numeric.rust"
						}
					}
				},
				{
					"comment": "parameterized types",
					"begin": "\\b(_?[A-Z][A-Za-z0-9_]*)(<)",
					"beginCaptures": {
						"1": {
							"name": "entity.name.type.rust"
						},
						"2": {
							"name": "punctuation.brackets.angle.rust"
						}
					},
					"end": ">",
					"endCaptures": {
						"0": {
							"name": "punctuation.brackets.angle.rust"
						}
					},
					"patterns": [
						{
							"include": "#block-comments"
						},
						{
							"include": "#comments"
						},
						{
							"include": "#keywords"
						},
						{
							"include": "#lvariables"
						},
						{
							"include": "#lifetimes"
						},
						{
							"include": "#punctuation"
						},
						{
							"include": "#types"
						},
						{
							"include": "#variables"
						}
					]
				},
				{
					"comment": "primitive types",
					"name": "entity.name.type.primitive.rust",
					"match": "\\b(bool|char|str)\\b"
				},
				{
					"comment": "trait declarations",
					"match": "\\b(trait)\\s+(_?[A-Z][A-Za-z0-9_]*)\\b",
					"captures": {
						"1": {
							"name": "keyword.declaration.trait.rust storage.type.rust"
						},
						"2": {
							"name": "entity.name.type.trait.rust"
						}
					}
				},
				{
					"comment": "struct declarations",
					"match": "\\b(struct)\\s+(_?[A-Z][A-Za-z0-9_]*)\\b",
					"captures": {
						"1": {
							"name": "keyword.declaration.struct.rust storage.type.rust"
						},
						"2": {
							"name": "entity.name.type.struct.rust"
						}
					}
				},
				{
					"comment": "enum declarations",
					"match": "\\b(enum)\\s+(_?[A-Z][A-Za-z0-9_]*)\\b",
					"captures": {
						"1": {
							"name": "keyword.declaration.enum.rust storage.type.rust"
						},
						"2": {
							"name": "entity.name.type.enum.rust"
						}
					}
				},
				{
					"comment": "type declarations",
					"match": "\\b(type)\\s+(_?[A-Z][A-Za-z0-9_]*)\\b",
					"captures": {
						"1": {
							"name": "keyword.declaration.type.rust storage.type.rust"
						},
						"2": {
							"name": "entity.name.type.declaration.rust"
						}
					}
				},
				{
					"comment": "types",
					"name": "entity.name.type.rust",
					"match": "\\b_?[A-Z][A-Za-z0-9_]*\\b(?!!)"
				}
			]
		},
		"gtypes": {
			"patterns": [
				{
					"comment": "option types",
					"name": "entity.name.type.option.rust",
					"match": "\\b(Some|None)\\b"
				},
				{
					"comment": "result types",
					"name": "entity.name.type.result.rust",
					"match": "\\b(Ok|Err)\\b"
				}
			]
		},
		"punctuation": {
			"patterns": [
				{
					"comment": "comma",
					"name": "punctuation.comma.rust",
					"match": ","
				},
				{
					"comment": "curly braces",
					"name": "punctuation.brackets.curly.rust",
					"match": "[{}]"
				},
				{
					"comment": "parentheses, round brackets",
					"name": "punctuation.brackets.round.rust",
					"match": "[()]"
				},
				{
					"comment": "semicolon",
					"name": "punctuation.semi.rust",
					"match": ";"
				},
				{
					"comment": "square brackets",
					"name": "punctuation.brackets.square.rust",
					"match": "[\\[\\]]"
				},
				{
					"comment": "angle brackets",
					"name": "punctuation.brackets.angle.rust",
					"match": "(?<!=)[<>]"
				}
			]
		},
		"strings": {
			"patterns": [
				{
					"comment": "double-quoted strings and byte strings",
					"name": "string.quoted.double.rust",
					"begin": "(b?)(\")",
					"beginCaptures": {
						"1": {
							"name": "string.quoted.byte.raw.rust"
						},
						"2": {
							"name": "punctuation.definition.string.rust"
						}
					},
					"end": "\"",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.rust"
						}
					},
					"patterns": [
						{
							"include": "#escapes"
						},
						{
							"include": "#interpolations"
						}
					]
				},
				{
					"comment": "double-quoted raw strings and raw byte strings",
					"name": "string.quoted.double.rust",
					"begin": "(b?r)(#*)(\")",
					"beginCaptures": {
						"1": {
							"name": "string.quoted.byte.raw.rust"
						},
						"2": {
							"name": "punctuation.definition.string.raw.rust"
						},
						"3": {
							"name": "punctuation.definition.string.rust"
						}
					},
					"end": "(\")(\\2)",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.string.rust"
						},
						"2": {
							"name": "punctuation.definition.string.raw.rust"
						}
					}
				},
				{
					"comment": "characters and bytes",
					"name": "string.quoted.single.char.rust",
					"begin": "(b)?(')",
					"beginCaptures": {
						"1": {
							"name": "string.quoted.byte.raw.rust"
						},
						"2": {
							"name": "punctuation.definition.char.rust"
						}
					},
					"end": "'",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.char.rust"
						}
					},
					"patterns": [
						{
							"include": "#escapes"
						}
					]
				}
			]
		},
		"lvariables": {
			"patterns": [
				{
					"comment": "self",
					"name": "variable.language.self.rust",
					"match": "\\b[Ss]elf\\b"
				},
				{
					"comment": "super",
					"name": "variable.language.super.rust",
					"match": "\\bsuper\\b"
				}
			]
		},
		"variables": {
			"patterns": [
				{
					"comment": "variables",
					"name": "variable.other.rust",
					"match": "\\b(?<!(?<!\\.)\\.)(?:r#(?!(crate|[Ss]elf|super)))?[a-z0-9_]+\\b"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/scss/.vscodeignore]---
Location: vscode-main/extensions/scss/.vscodeignore

```text
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/scss/cgmanifest.json]---
Location: vscode-main/extensions/scss/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "atom/language-sass",
					"repositoryUrl": "https://github.com/atom/language-sass",
					"commitHash": "f52ab12f7f9346cc2568129d8c4419bd3d506b47"
				}
			},
			"license": "MIT",
			"description": "The file syntaxes/scss.json was derived from the Atom package https://github.com/atom/language-sass which was originally converted from the TextMate bundle https://github.com/alexsancho/SASS.tmbundle.",
			"version": "0.62.1"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/scss/language-configuration.json]---
Location: vscode-main/extensions/scss/language-configuration.json

```json
{
	"comments": {
		"blockComment": ["/*", "*/"],
		"lineComment": "//"
	},
	"brackets": [
		["{", "}"],
		["[", "]"],
		["(", ")"]
	],
	"autoClosingPairs": [
		{ "open": "{", "close": "}", "notIn": ["string", "comment"] },
		{ "open": "[", "close": "]", "notIn": ["string", "comment"] },
		{ "open": "(", "close": ")", "notIn": ["string", "comment"] },
		{ "open": "\"", "close": "\"", "notIn": ["string", "comment"] },
		{ "open": "'", "close": "'", "notIn": ["string", "comment"] }
	],
	"surroundingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["\"", "\""],
		["'", "'"]
	],
	"folding": {
		"markers": {
			"start": "^\\s*\\/\\*\\s*#region\\b\\s*(.*?)\\s*\\*\\/",
			"end": "^\\s*\\/\\*\\s*#endregion\\b.*\\*\\/"
		}
	},
	"indentationRules": {
		"increaseIndentPattern": "(^.*\\{[^}]*$)",
		"decreaseIndentPattern": "^\\s*\\}"
	},
	"wordPattern": "(#?-?\\d*\\.\\d\\w*%?)|(::?[\\w-]*(?=[^,{;]*[,{]))|(([@$#.!])?[\\w-?]+%?|[@#!$.])",
	"onEnterRules": [
		{
			"beforeText": "^[\\s]*///.*$",
			"action": {
				"indent": "none",
				"appendText": "/// "
			}
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/scss/package.json]---
Location: vscode-main/extensions/scss/package.json

```json
{
  "name": "scss",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin atom/language-sass grammars/scss.cson ./syntaxes/scss.tmLanguage.json grammars/sassdoc.cson ./syntaxes/sassdoc.tmLanguage.json"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "scss",
        "aliases": [
          "SCSS",
          "scss"
        ],
        "extensions": [
          ".scss"
        ],
        "mimetypes": [
          "text/x-scss",
          "text/scss"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "scss",
        "scopeName": "source.css.scss",
        "path": "./syntaxes/scss.tmLanguage.json"
      },
      {
        "scopeName": "source.sassdoc",
        "path": "./syntaxes/sassdoc.tmLanguage.json"
      }
    ],
    "problemMatchers": [
      {
        "name": "node-sass",
        "label": "Node Sass Compiler",
        "owner": "node-sass",
        "fileLocation": "absolute",
        "pattern": [
          {
            "regexp": "^{$"
          },
          {
            "regexp": "\\s*\"status\":\\s\\d+,"
          },
          {
            "regexp": "\\s*\"file\":\\s\"(.*)\",",
            "file": 1
          },
          {
            "regexp": "\\s*\"line\":\\s(\\d+),",
            "line": 1
          },
          {
            "regexp": "\\s*\"column\":\\s(\\d+),",
            "column": 1
          },
          {
            "regexp": "\\s*\"message\":\\s\"(.*)\",",
            "message": 1
          },
          {
            "regexp": "\\s*\"formatted\":\\s(.*)"
          },
          {
            "regexp": "^}$"
          }
        ]
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

---[FILE: extensions/scss/package.nls.json]---
Location: vscode-main/extensions/scss/package.nls.json

```json
{
	"displayName": "SCSS Language Basics",
	"description": "Provides syntax highlighting, bracket matching and folding in SCSS files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/scss/syntaxes/sassdoc.tmLanguage.json]---
Location: vscode-main/extensions/scss/syntaxes/sassdoc.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/atom/language-sass/blob/master/grammars/sassdoc.cson",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/atom/language-sass/commit/303bbf0c250fe380b9e57375598cfd916110758b",
	"name": "SassDoc",
	"scopeName": "source.sassdoc",
	"patterns": [
		{
			"match": "(?x)\n((@)(?:access))\n\\s+\n(private|public)\n\\b",
			"captures": {
				"1": {
					"name": "storage.type.class.sassdoc"
				},
				"2": {
					"name": "punctuation.definition.block.tag.sassdoc"
				},
				"3": {
					"name": "constant.language.access-type.sassdoc"
				}
			}
		},
		{
			"match": "(?x)\n((@)author)\n\\s+\n(\n  [^@\\s<>*/]\n  (?:[^@<>*/]|\\*[^/])*\n)\n(?:\n  \\s*\n  (<)\n  ([^>\\s]+)\n  (>)\n)?",
			"captures": {
				"1": {
					"name": "storage.type.class.sassdoc"
				},
				"2": {
					"name": "punctuation.definition.block.tag.sassdoc"
				},
				"3": {
					"name": "entity.name.type.instance.sassdoc"
				},
				"4": {
					"name": "punctuation.definition.bracket.angle.begin.sassdoc"
				},
				"5": {
					"name": "constant.other.email.link.underline.sassdoc"
				},
				"6": {
					"name": "punctuation.definition.bracket.angle.end.sassdoc"
				}
			}
		},
		{
			"name": "meta.example.css.scss.sassdoc",
			"begin": "(?x)\n((@)example)\n\\s+\n(css|scss)",
			"end": "(?=@|///$)",
			"beginCaptures": {
				"1": {
					"name": "storage.type.class.sassdoc"
				},
				"2": {
					"name": "punctuation.definition.block.tag.sassdoc"
				},
				"3": {
					"name": "variable.other.sassdoc"
				}
			},
			"patterns": [
				{
					"match": "^///\\s+"
				},
				{
					"match": "[^\\s@*](?:[^*]|\\*[^/])*",
					"captures": {
						"0": {
							"name": "source.embedded.css.scss",
							"patterns": [
								{
									"include": "source.css.scss"
								}
							]
						}
					}
				}
			]
		},
		{
			"name": "meta.example.html.sassdoc",
			"begin": "(?x)\n((@)example)\n\\s+\n(markup)",
			"end": "(?=@|///$)",
			"beginCaptures": {
				"1": {
					"name": "storage.type.class.sassdoc"
				},
				"2": {
					"name": "punctuation.definition.block.tag.sassdoc"
				},
				"3": {
					"name": "variable.other.sassdoc"
				}
			},
			"patterns": [
				{
					"match": "^///\\s+"
				},
				{
					"match": "[^\\s@*](?:[^*]|\\*[^/])*",
					"captures": {
						"0": {
							"name": "source.embedded.html",
							"patterns": [
								{
									"include": "source.html"
								}
							]
						}
					}
				}
			]
		},
		{
			"name": "meta.example.js.sassdoc",
			"begin": "(?x)\n((@)example)\n\\s+\n(javascript)",
			"end": "(?=@|///$)",
			"beginCaptures": {
				"1": {
					"name": "storage.type.class.sassdoc"
				},
				"2": {
					"name": "punctuation.definition.block.tag.sassdoc"
				},
				"3": {
					"name": "variable.other.sassdoc"
				}
			},
			"patterns": [
				{
					"match": "^///\\s+"
				},
				{
					"match": "[^\\s@*](?:[^*]|\\*[^/])*",
					"captures": {
						"0": {
							"name": "source.embedded.js",
							"patterns": [
								{
									"include": "source.js"
								}
							]
						}
					}
				}
			]
		},
		{
			"match": "(?x)\n((@)link)\n\\s+\n(?:\n  # URL\n  (\n    (?=https?://)\n    (?:[^\\s*]|\\*[^/])+\n  )\n)",
			"captures": {
				"1": {
					"name": "storage.type.class.sassdoc"
				},
				"2": {
					"name": "punctuation.definition.block.tag.sassdoc"
				},
				"3": {
					"name": "variable.other.link.underline.sassdoc"
				},
				"4": {
					"name": "entity.name.type.instance.sassdoc"
				}
			}
		},
		{
			"match": "(?x)\n(\n  (@)\n  (?:arg|argument|param|parameter|requires?|see|colors?|fonts?|ratios?|sizes?)\n)\n\\s+\n(\n  [A-Za-z_$%]\n  [\\-\\w$.\\[\\]]*\n)",
			"captures": {
				"1": {
					"name": "storage.type.class.sassdoc"
				},
				"2": {
					"name": "punctuation.definition.block.tag.sassdoc"
				},
				"3": {
					"name": "variable.other.sassdoc"
				}
			}
		},
		{
			"begin": "((@)(?:arg|argument|param|parameter|prop|property|requires?|see|sizes?))\\s+(?={)",
			"beginCaptures": {
				"1": {
					"name": "storage.type.class.sassdoc"
				},
				"2": {
					"name": "punctuation.definition.block.tag.sassdoc"
				}
			},
			"end": "(?=\\s|\\*/|[^{}\\[\\]A-Za-z_$])",
			"patterns": [
				{
					"include": "#sassdoctype"
				},
				{
					"match": "([A-Za-z_$%][\\-\\w$.\\[\\]]*)",
					"name": "variable.other.sassdoc"
				},
				{
					"name": "variable.other.sassdoc",
					"match": "(?x)\n(\\[)\\s*\n[\\w$]+\n(?:\n  (?:\\[\\])?                                        # Foo[].bar properties within an array\n  \\.                                                # Foo.Bar namespaced parameter\n  [\\w$]+\n)*\n(?:\n  \\s*\n  (=)                                                # [foo=bar] Default parameter value\n  \\s*\n  (\n    # The inner regexes are to stop the match early at */ and to not stop at escaped quotes\n    (?>\n      \"(?:(?:\\*(?!/))|(?:\\\\(?!\"))|[^*\\\\])*?\" |  # [foo=\"bar\"] Double-quoted\n      '(?:(?:\\*(?!/))|(?:\\\\(?!'))|[^*\\\\])*?' |  # [foo='bar'] Single-quoted\n      \\[ (?:(?:\\*(?!/))|[^*])*? \\] |              # [foo=[1,2]] Array literal\n      (?:(?:\\*(?!/))|\\s(?!\\s*\\])|\\[.*?(?:\\]|(?=\\*/))|[^*\\s\\[\\]])* # Everything else (sorry)\n    )*\n  )\n)?\n\\s*(?:(\\])((?:[^*\\s]|\\*[^\\s/])+)?|(?=\\*/))",
					"captures": {
						"1": {
							"name": "punctuation.definition.optional-value.begin.bracket.square.sassdoc"
						},
						"2": {
							"name": "keyword.operator.assignment.sassdoc"
						},
						"3": {
							"name": "source.embedded.js",
							"patterns": [
								{
									"include": "source.js"
								}
							]
						},
						"4": {
							"name": "punctuation.definition.optional-value.end.bracket.square.sassdoc"
						},
						"5": {
							"name": "invalid.illegal.syntax.sassdoc"
						}
					}
				}
			]
		},
		{
			"begin": "(?x)\n(\n  (@)\n  (?:returns?|throws?|exception|outputs?)\n)\n\\s+(?={)",
			"beginCaptures": {
				"1": {
					"name": "storage.type.class.sassdoc"
				},
				"2": {
					"name": "punctuation.definition.block.tag.sassdoc"
				}
			},
			"end": "(?=\\s|[^{}\\[\\]A-Za-z_$])",
			"patterns": [
				{
					"include": "#sassdoctype"
				}
			]
		},
		{
			"match": "(?x)\n(\n  (@)\n  (?:type)\n)\n\\s+\n(\n  (?:\n    [A-Za-z |]+\n  )\n)",
			"captures": {
				"1": {
					"name": "storage.type.class.sassdoc"
				},
				"2": {
					"name": "punctuation.definition.block.tag.sassdoc"
				},
				"3": {
					"name": "entity.name.type.instance.sassdoc",
					"patterns": [
						{
							"include": "#sassdoctypedelimiter"
						}
					]
				}
			}
		},
		{
			"match": "(?x)\n(\n  (@)\n  (?:alias|group|name|requires?|see|icons?)\n)\n\\s+\n(\n  (?:\n    [^{}@\\s*] | \\*[^/]\n  )+\n)",
			"captures": {
				"1": {
					"name": "storage.type.class.sassdoc"
				},
				"2": {
					"name": "punctuation.definition.block.tag.sassdoc"
				},
				"3": {
					"name": "entity.name.type.instance.sassdoc"
				}
			}
		},
		{
			"name": "storage.type.class.sassdoc",
			"match": "(?x)\n(@)\n(?:access|alias|author|content|deprecated|example|exception|group\n|ignore|name|prop|property|requires?|returns?|see|since|throws?|todo\n|type|outputs?)\n\\b",
			"captures": {
				"1": {
					"name": "punctuation.definition.block.tag.sassdoc"
				}
			}
		}
	],
	"repository": {
		"brackets": {
			"patterns": [
				{
					"begin": "{",
					"end": "}|(?=$)",
					"patterns": [
						{
							"include": "#brackets"
						}
					]
				},
				{
					"begin": "\\[",
					"end": "\\]|(?=$)",
					"patterns": [
						{
							"include": "#brackets"
						}
					]
				}
			]
		},
		"sassdoctypedelimiter": {
			"match": "(\\|)",
			"captures": {
				"1": {
					"name": "punctuation.definition.delimiter.sassdoc"
				}
			}
		},
		"sassdoctype": {
			"patterns": [
				{
					"name": "invalid.illegal.type.sassdoc",
					"match": "\\G{(?:[^}*]|\\*[^/}])+$"
				},
				{
					"begin": "\\G({)",
					"beginCaptures": {
						"0": {
							"name": "entity.name.type.instance.sassdoc"
						},
						"1": {
							"name": "punctuation.definition.bracket.curly.begin.sassdoc"
						}
					},
					"contentName": "entity.name.type.instance.sassdoc",
					"end": "((}))\\s*|(?=$)",
					"endCaptures": {
						"1": {
							"name": "entity.name.type.instance.sassdoc"
						},
						"2": {
							"name": "punctuation.definition.bracket.curly.end.sassdoc"
						}
					},
					"patterns": [
						{
							"include": "#brackets"
						}
					]
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/scss/syntaxes/scss.tmLanguage.json]---
Location: vscode-main/extensions/scss/syntaxes/scss.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/atom/language-sass/blob/master/grammars/scss.cson",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/atom/language-sass/commit/f52ab12f7f9346cc2568129d8c4419bd3d506b47",
	"name": "SCSS",
	"scopeName": "source.css.scss",
	"patterns": [
		{
			"include": "#variable_setting"
		},
		{
			"include": "#at_rule_forward"
		},
		{
			"include": "#at_rule_use"
		},
		{
			"include": "#at_rule_include"
		},
		{
			"include": "#at_rule_import"
		},
		{
			"include": "#general"
		},
		{
			"include": "#flow_control"
		},
		{
			"include": "#rules"
		},
		{
			"include": "#property_list"
		},
		{
			"include": "#at_rule_mixin"
		},
		{
			"include": "#at_rule_media"
		},
		{
			"include": "#at_rule_function"
		},
		{
			"include": "#at_rule_charset"
		},
		{
			"include": "#at_rule_option"
		},
		{
			"include": "#at_rule_namespace"
		},
		{
			"include": "#at_rule_fontface"
		},
		{
			"include": "#at_rule_page"
		},
		{
			"include": "#at_rule_keyframes"
		},
		{
			"include": "#at_rule_at_root"
		},
		{
			"include": "#at_rule_supports"
		},
		{
			"match": ";",
			"name": "punctuation.terminator.rule.css"
		}
	],
	"repository": {
		"at_rule_charset": {
			"begin": "\\s*((@)charset\\b)\\s*",
			"captures": {
				"1": {
					"name": "keyword.control.at-rule.charset.scss"
				},
				"2": {
					"name": "punctuation.definition.keyword.scss"
				}
			},
			"end": "\\s*((?=;|$))",
			"name": "meta.at-rule.charset.scss",
			"patterns": [
				{
					"include": "#variable"
				},
				{
					"include": "#string_single"
				},
				{
					"include": "#string_double"
				}
			]
		},
		"at_rule_content": {
			"begin": "\\s*((@)content\\b)\\s*",
			"captures": {
				"1": {
					"name": "keyword.control.content.scss"
				}
			},
			"end": "\\s*((?=;))",
			"name": "meta.content.scss",
			"patterns": [
				{
					"include": "#variable"
				},
				{
					"include": "#selectors"
				},
				{
					"include": "#property_values"
				}
			]
		},
		"at_rule_each": {
			"begin": "\\s*((@)each\\b)\\s*",
			"captures": {
				"1": {
					"name": "keyword.control.each.scss"
				},
				"2": {
					"name": "punctuation.definition.keyword.scss"
				}
			},
			"end": "\\s*((?=}))",
			"name": "meta.at-rule.each.scss",
			"patterns": [
				{
					"match": "\\b(in|,)\\b",
					"name": "keyword.control.operator"
				},
				{
					"include": "#variable"
				},
				{
					"include": "#property_values"
				},
				{
					"include": "$self"
				}
			]
		},
		"at_rule_else": {
			"begin": "\\s*((@)else(\\s*(if)?))\\s*",
			"captures": {
				"1": {
					"name": "keyword.control.else.scss"
				},
				"2": {
					"name": "punctuation.definition.keyword.scss"
				}
			},
			"end": "\\s*(?={)",
			"name": "meta.at-rule.else.scss",
			"patterns": [
				{
					"include": "#conditional_operators"
				},
				{
					"include": "#variable"
				},
				{
					"include": "#property_values"
				}
			]
		},
		"at_rule_extend": {
			"begin": "\\s*((@)extend\\b)\\s*",
			"captures": {
				"1": {
					"name": "keyword.control.at-rule.extend.scss"
				},
				"2": {
					"name": "punctuation.definition.keyword.scss"
				}
			},
			"end": "\\s*(?=;)",
			"name": "meta.at-rule.extend.scss",
			"patterns": [
				{
					"include": "#variable"
				},
				{
					"include": "#selectors"
				},
				{
					"include": "#property_values"
				}
			]
		},
		"at_rule_fontface": {
			"patterns": [
				{
					"begin": "^\\s*((@)font-face\\b)",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.at-rule.fontface.scss"
						},
						"2": {
							"name": "punctuation.definition.keyword.scss"
						}
					},
					"end": "\\s*(?={)",
					"name": "meta.at-rule.fontface.scss",
					"patterns": [
						{
							"include": "#function_attributes"
						}
					]
				}
			]
		},
		"at_rule_for": {
			"begin": "\\s*((@)for\\b)\\s*",
			"captures": {
				"1": {
					"name": "keyword.control.for.scss"
				},
				"2": {
					"name": "punctuation.definition.keyword.scss"
				}
			},
			"end": "\\s*(?={)",
			"name": "meta.at-rule.for.scss",
			"patterns": [
				{
					"match": "(==|!=|<=|>=|<|>|from|to|through)",
					"name": "keyword.control.operator"
				},
				{
					"include": "#variable"
				},
				{
					"include": "#property_values"
				},
				{
					"include": "$self"
				}
			]
		},
		"at_rule_forward": {
			"begin": "\\s*((@)forward\\b)\\s*",
			"captures": {
				"1": {
					"name": "keyword.control.at-rule.forward.scss"
				},
				"2": {
					"name": "punctuation.definition.keyword.scss"
				}
			},
			"end": "\\s*(?=;)",
			"name": "meta.at-rule.forward.scss",
			"patterns": [
				{
					"match": "\\b(as|hide|show)\\b",
					"name": "keyword.control.operator"
				},
				{
					"match": "\\b([\\w-]+)(\\*)",
					"captures": {
						"1": {
							"name": "entity.other.attribute-name.module.scss"
						},
						"2": {
							"name": "punctuation.definition.wildcard.scss"
						}
					}
				},
				{
					"match": "\\b[\\w-]+\\b",
					"name": "entity.name.function.scss"
				},
				{
					"include": "#variable"
				},
				{
					"include": "#string_single"
				},
				{
					"include": "#string_double"
				},
				{
					"include": "#comment_line"
				},
				{
					"include": "#comment_block"
				}
			]
		},
		"at_rule_function": {
			"patterns": [
				{
					"begin": "\\s*((@)function\\b)\\s*",
					"captures": {
						"1": {
							"name": "keyword.control.at-rule.function.scss"
						},
						"2": {
							"name": "punctuation.definition.keyword.scss"
						},
						"3": {
							"name": "entity.name.function.scss"
						}
					},
					"end": "\\s*(?={)",
					"name": "meta.at-rule.function.scss",
					"patterns": [
						{
							"include": "#function_attributes"
						}
					]
				},
				{
					"captures": {
						"1": {
							"name": "keyword.control.at-rule.function.scss"
						},
						"2": {
							"name": "punctuation.definition.keyword.scss"
						},
						"3": {
							"name": "entity.name.function.scss"
						}
					},
					"match": "\\s*((@)function\\b)\\s*",
					"name": "meta.at-rule.function.scss"
				}
			]
		},
		"at_rule_if": {
			"begin": "\\s*((@)if\\b)\\s*",
			"captures": {
				"1": {
					"name": "keyword.control.if.scss"
				},
				"2": {
					"name": "punctuation.definition.keyword.scss"
				}
			},
			"end": "\\s*(?={)",
			"name": "meta.at-rule.if.scss",
			"patterns": [
				{
					"include": "#conditional_operators"
				},
				{
					"include": "#variable"
				},
				{
					"include": "#property_values"
				}
			]
		},
		"at_rule_import": {
			"begin": "\\s*((@)import\\b)\\s*",
			"captures": {
				"1": {
					"name": "keyword.control.at-rule.import.scss"
				},
				"2": {
					"name": "punctuation.definition.keyword.scss"
				}
			},
			"end": "\\s*((?=;)|(?=}))",
			"name": "meta.at-rule.import.scss",
			"patterns": [
				{
					"include": "#variable"
				},
				{
					"include": "#string_single"
				},
				{
					"include": "#string_double"
				},
				{
					"include": "#functions"
				},
				{
					"include": "#comment_line"
				}
			]
		},
		"at_rule_include": {
			"patterns": [
				{
					"begin": "(?<=@include)\\s+(?:([\\w-]+)\\s*(\\.))?([\\w-]+)\\s*(\\()",
					"beginCaptures": {
						"1": {
							"name": "variable.scss"
						},
						"2": {
							"name": "punctuation.access.module.scss"
						},
						"3": {
							"name": "entity.name.function.scss"
						},
						"4": {
							"name": "punctuation.definition.parameters.begin.bracket.round.scss"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.parameters.end.bracket.round.scss"
						}
					},
					"name": "meta.at-rule.include.scss",
					"patterns": [
						{
							"include": "#function_attributes"
						}
					]
				},
				{
					"match": "(?<=@include)\\s+(?:([\\w-]+)\\s*(\\.))?([\\w-]+)",
					"captures": {
						"0": {
							"name": "meta.at-rule.include.scss"
						},
						"1": {
							"name": "variable.scss"
						},
						"2": {
							"name": "punctuation.access.module.scss"
						},
						"3": {
							"name": "entity.name.function.scss"
						}
					}
				},
				{
					"match": "((@)include)\\b",
					"captures": {
						"0": {
							"name": "meta.at-rule.include.scss"
						},
						"1": {
							"name": "keyword.control.at-rule.include.scss"
						},
						"2": {
							"name": "punctuation.definition.keyword.scss"
						}
					}
				}
			]
		},
		"at_rule_keyframes": {
			"begin": "(?<=^|\\s)(@)(?:-(?:webkit|moz)-)?keyframes\\b",
			"beginCaptures": {
				"0": {
					"name": "keyword.control.at-rule.keyframes.scss"
				},
				"1": {
					"name": "punctuation.definition.keyword.scss"
				}
			},
			"end": "(?<=})",
			"name": "meta.at-rule.keyframes.scss",
			"patterns": [
				{
					"match": "(?<=@keyframes)\\s+((?:[_A-Za-z][-\\w]|-[_A-Za-z])[-\\w]*)",
					"captures": {
						"1": {
							"name": "entity.name.function.scss"
						}
					}
				},
				{
					"begin": "(?<=@keyframes)\\s+(\")",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.string.begin.scss"
						}
					},
					"end": "\"",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.scss"
						}
					},
					"name": "string.quoted.double.scss",
					"contentName": "entity.name.function.scss",
					"patterns": [
						{
							"match": "\\\\(\\h{1,6}|.)",
							"name": "constant.character.escape.scss"
						},
						{
							"include": "#interpolation"
						}
					]
				},
				{
					"begin": "(?<=@keyframes)\\s+(')",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.string.begin.scss"
						}
					},
					"end": "'",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.scss"
						}
					},
					"name": "string.quoted.single.scss",
					"contentName": "entity.name.function.scss",
					"patterns": [
						{
							"match": "\\\\(\\h{1,6}|.)",
							"name": "constant.character.escape.scss"
						},
						{
							"include": "#interpolation"
						}
					]
				},
				{
					"begin": "{",
					"beginCaptures": {
						"0": {
							"name": "punctuation.section.keyframes.begin.scss"
						}
					},
					"end": "}",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.keyframes.end.scss"
						}
					},
					"patterns": [
						{
							"match": "\\b(?:(?:100|[1-9]\\d|\\d)%|from|to)(?=\\s*{)",
							"name": "entity.other.attribute-name.scss"
						},
						{
							"include": "#flow_control"
						},
						{
							"include": "#interpolation"
						},
						{
							"include": "#property_list"
						},
						{
							"include": "#rules"
						}
					]
				}
			]
		},
		"at_rule_media": {
			"patterns": [
				{
					"begin": "^\\s*((@)media)\\b",
					"beginCaptures": {
						"1": {
							"name": "keyword.control.at-rule.media.scss"
						},
						"2": {
							"name": "punctuation.definition.keyword.scss"
						}
					},
					"end": "\\s*(?={)",
					"name": "meta.at-rule.media.scss",
					"patterns": [
						{
							"include": "#comment_docblock"
						},
						{
							"include": "#comment_block"
						},
						{
							"include": "#comment_line"
						},
						{
							"match": "\\b(only)\\b",
							"name": "keyword.control.operator.css.scss"
						},
						{
							"begin": "\\(",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.media-query.begin.bracket.round.scss"
								}
							},
							"end": "\\)",
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.media-query.end.bracket.round.scss"
								}
							},
							"name": "meta.property-list.media-query.scss",
							"patterns": [
								{
									"begin": "(?<![-a-z])(?=[-a-z])",
									"end": "$|(?![-a-z])",
									"name": "meta.property-name.media-query.scss",
									"patterns": [
										{
											"include": "source.css#media-features"
										},
										{
											"include": "source.css#property-names"
										}
									]
								},
								{
									"begin": "(:)\\s*(?!(\\s*{))",
									"beginCaptures": {
										"1": {
											"name": "punctuation.separator.key-value.scss"
										}
									},
									"end": "\\s*(;|(?=}|\\)))",
									"endCaptures": {
										"1": {
											"name": "punctuation.terminator.rule.scss"
										}
									},
									"contentName": "meta.property-value.media-query.scss",
									"patterns": [
										{
											"include": "#general"
										},
										{
											"include": "#property_values"
										}
									]
								}
							]
						},
						{
							"include": "#variable"
						},
						{
							"include": "#conditional_operators"
						},
						{
							"include": "source.css#media-types"
						}
					]
				}
			]
		},
		"at_rule_mixin": {
			"patterns": [
				{
					"begin": "(?<=@mixin)\\s+([\\w-]+)\\s*(\\()",
					"beginCaptures": {
						"1": {
							"name": "entity.name.function.scss"
						},
						"2": {
							"name": "punctuation.definition.parameters.begin.bracket.round.scss"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.parameters.end.bracket.round.scss"
						}
					},
					"name": "meta.at-rule.mixin.scss",
					"patterns": [
						{
							"include": "#function_attributes"
						}
					]
				},
				{
					"match": "(?<=@mixin)\\s+([\\w-]+)",
					"captures": {
						"1": {
							"name": "entity.name.function.scss"
						}
					},
					"name": "meta.at-rule.mixin.scss"
				},
				{
					"match": "((@)mixin)\\b",
					"captures": {
						"1": {
							"name": "keyword.control.at-rule.mixin.scss"
						},
						"2": {
							"name": "punctuation.definition.keyword.scss"
						}
					},
					"name": "meta.at-rule.mixin.scss"
				}
			]
		},
		"at_rule_namespace": {
			"patterns": [
				{
					"begin": "(?<=@namespace)\\s+(?=url)",
					"end": "(?=;|$)",
					"name": "meta.at-rule.namespace.scss",
					"patterns": [
						{
							"include": "#property_values"
						},
						{
							"include": "#string_single"
						},
						{
							"include": "#string_double"
						}
					]
				},
				{
					"begin": "(?<=@namespace)\\s+([\\w-]*)",
					"captures": {
						"1": {
							"name": "entity.name.namespace-prefix.scss"
						}
					},
					"end": "(?=;|$)",
					"name": "meta.at-rule.namespace.scss",
					"patterns": [
						{
							"include": "#variables"
						},
						{
							"include": "#property_values"
						},
						{
							"include": "#string_single"
						},
						{
							"include": "#string_double"
						}
					]
				},
				{
					"match": "((@)namespace)\\b",
					"captures": {
						"1": {
							"name": "keyword.control.at-rule.namespace.scss"
						},
						"2": {
							"name": "punctuation.definition.keyword.scss"
						}
					},
					"name": "meta.at-rule.namespace.scss"
				}
			]
		},
		"at_rule_option": {
			"captures": {
				"1": {
					"name": "keyword.control.at-rule.charset.scss"
				},
				"2": {
					"name": "punctuation.definition.keyword.scss"
				}
			},
			"match": "^\\s*((@)option\\b)\\s*",
			"name": "meta.at-rule.option.scss"
		},
		"at_rule_page": {
			"patterns": [
				{
					"begin": "^\\s*((@)page)(?=:|\\s)\\s*([-:\\w]*)",
					"captures": {
						"1": {
							"name": "keyword.control.at-rule.page.scss"
						},
						"2": {
							"name": "punctuation.definition.keyword.scss"
						},
						"3": {
							"name": "entity.name.function.scss"
						}
					},
					"end": "\\s*(?={)",
					"name": "meta.at-rule.page.scss"
				}
			]
		},
		"at_rule_return": {
			"begin": "\\s*((@)(return)\\b)",
			"captures": {
				"1": {
					"name": "keyword.control.return.scss"
				},
				"2": {
					"name": "punctuation.definition.keyword.scss"
				}
			},
			"end": "\\s*((?=;))",
			"name": "meta.at-rule.return.scss",
			"patterns": [
				{
					"include": "#variable"
				},
				{
					"include": "#property_values"
				}
			]
		},
		"at_rule_at_root": {
			"begin": "\\s*((@)(at-root))(\\s+|$)",
			"end": "\\s*(?={)",
			"beginCaptures": {
				"1": {
					"name": "keyword.control.at-rule.at-root.scss"
				},
				"2": {
					"name": "punctuation.definition.keyword.scss"
				}
			},
			"name": "meta.at-rule.at-root.scss",
			"patterns": [
				{
					"include": "#function_attributes"
				},
				{
					"include": "#functions"
				},
				{
					"include": "#selectors"
				}
			]
		},
		"at_rule_supports": {
			"begin": "(?<=^|\\s)(@)supports\\b",
			"captures": {
				"0": {
					"name": "keyword.control.at-rule.supports.scss"
				},
				"1": {
					"name": "punctuation.definition.keyword.scss"
				}
			},
			"end": "(?={)|$",
			"name": "meta.at-rule.supports.scss",
			"patterns": [
				{
					"include": "#logical_operators"
				},
				{
					"include": "#properties"
				},
				{
					"match": "\\(",
					"name": "punctuation.definition.condition.begin.bracket.round.scss"
				},
				{
					"match": "\\)",
					"name": "punctuation.definition.condition.end.bracket.round.scss"
				}
			]
		},
		"at_rule_use": {
			"begin": "\\s*((@)use\\b)\\s*",
			"captures": {
				"1": {
					"name": "keyword.control.at-rule.use.scss"
				},
				"2": {
					"name": "punctuation.definition.keyword.scss"
				}
			},
			"end": "\\s*(?=;)",
			"name": "meta.at-rule.use.scss",
			"patterns": [
				{
					"match": "\\b(as|with)\\b",
					"name": "keyword.control.operator"
				},
				{
					"match": "\\b[\\w-]+\\b",
					"name": "variable.scss"
				},
				{
					"match": "\\*",
					"name": "variable.language.expanded-namespace.scss"
				},
				{
					"include": "#string_single"
				},
				{
					"include": "#string_double"
				},
				{
					"include": "#comment_line"
				},
				{
					"include": "#comment_block"
				},
				{
					"begin": "\\(",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.parameters.begin.bracket.round.scss"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.parameters.end.bracket.round.scss"
						}
					},
					"patterns": [
						{
							"include": "#function_attributes"
						}
					]
				}
			]
		},
		"at_rule_warn": {
			"begin": "\\s*((@)(warn|debug|error)\\b)\\s*",
			"captures": {
				"1": {
					"name": "keyword.control.warn.scss"
				},
				"2": {
					"name": "punctuation.definition.keyword.scss"
				}
			},
			"end": "\\s*(?=;)",
			"name": "meta.at-rule.warn.scss",
			"patterns": [
				{
					"include": "#variable"
				},
				{
					"include": "#string_double"
				},
				{
					"include": "#string_single"
				}
			]
		},
		"at_rule_while": {
			"begin": "\\s*((@)while\\b)\\s*",
			"captures": {
				"1": {
					"name": "keyword.control.while.scss"
				},
				"2": {
					"name": "punctuation.definition.keyword.scss"
				}
			},
			"end": "\\s*(?=})",
			"name": "meta.at-rule.while.scss",
			"patterns": [
				{
					"include": "#conditional_operators"
				},
				{
					"include": "#variable"
				},
				{
					"include": "#property_values"
				},
				{
					"include": "$self"
				}
			]
		},
		"comment_docblock": {
			"name": "comment.block.documentation.scss",
			"begin": "///",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.comment.scss"
				}
			},
			"end": "(?=$)",
			"patterns": [
				{
					"include": "source.sassdoc"
				}
			]
		},
		"comment_block": {
			"begin": "/\\*",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.comment.scss"
				}
			},
			"end": "\\*/",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.comment.scss"
				}
			},
			"name": "comment.block.scss"
		},
		"comment_line": {
			"begin": "//",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.comment.scss"
				}
			},
			"end": "\\n",
			"name": "comment.line.scss"
		},
		"constant_default": {
			"match": "!default",
			"name": "keyword.other.default.scss"
		},
		"constant_functions": {
			"begin": "(?:([\\w-]+)(\\.))?([\\w-]+)(\\()",
			"beginCaptures": {
				"1": {
					"name": "variable.scss"
				},
				"2": {
					"name": "punctuation.access.module.scss"
				},
				"3": {
					"name": "support.function.misc.scss"
				},
				"4": {
					"name": "punctuation.section.function.scss"
				}
			},
			"end": "(\\))",
			"endCaptures": {
				"1": {
					"name": "punctuation.section.function.scss"
				}
			},
			"patterns": [
				{
					"include": "#parameters"
				}
			]
		},
		"constant_important": {
			"match": "!important",
			"name": "keyword.other.important.scss"
		},
		"constant_mathematical_symbols": {
			"match": "\\b(\\+|-|\\*|/)\\b",
			"name": "support.constant.mathematical-symbols.scss"
		},
		"constant_optional": {
			"match": "!optional",
			"name": "keyword.other.optional.scss"
		},
		"constant_sass_functions": {
			"begin": "(headings|stylesheet-url|rgba?|hsla?|ie-hex-str|red|green|blue|alpha|opacity|hue|saturation|lightness|prefixed|prefix|-moz|-svg|-css2|-pie|-webkit|-ms|font-(?:files|url)|grid-image|image-(?:width|height|url|color)|sprites?|sprite-(?:map|map-name|file|url|position)|inline-(?:font-files|image)|opposite-position|grad-point|grad-end-position|color-stops|color-stops-in-percentages|grad-color-stops|(?:radial|linear)-(?:gradient|svg-gradient)|opacify|fade-?in|transparentize|fade-?out|lighten|darken|saturate|desaturate|grayscale|adjust-(?:hue|lightness|saturation|color)|scale-(?:lightness|saturation|color)|change-color|spin|complement|invert|mix|-compass-(?:list|space-list|slice|nth|list-size)|blank|compact|nth|first-value-of|join|length|append|nest|append-selector|headers|enumerate|range|percentage|unitless|unit|if|type-of|comparable|elements-of-type|quote|unquote|escape|e|sin|cos|tan|abs|round|ceil|floor|pi|translate(?:X|Y))(\\()",
			"beginCaptures": {
				"1": {
					"name": "support.function.misc.scss"
				},
				"2": {
					"name": "punctuation.section.function.scss"
				}
			},
			"end": "(\\))",
			"endCaptures": {
				"1": {
					"name": "punctuation.section.function.scss"
				}
			},
			"patterns": [
				{
					"include": "#parameters"
				}
			]
		},
		"flow_control": {
			"patterns": [
				{
					"include": "#at_rule_if"
				},
				{
					"include": "#at_rule_else"
				},
				{
					"include": "#at_rule_warn"
				},
				{
					"include": "#at_rule_for"
				},
				{
					"include": "#at_rule_while"
				},
				{
					"include": "#at_rule_each"
				},
				{
					"include": "#at_rule_return"
				}
			]
		},
		"function_attributes": {
			"patterns": [
				{
					"match": ":",
					"name": "punctuation.separator.key-value.scss"
				},
				{
					"include": "#general"
				},
				{
					"include": "#property_values"
				},
				{
					"match": "[={}\\?;@]",
					"name": "invalid.illegal.scss"
				}
			]
		},
		"functions": {
			"patterns": [
				{
					"begin": "([\\w-]{1,})(\\()\\s*",
					"beginCaptures": {
						"1": {
							"name": "support.function.misc.scss"
						},
						"2": {
							"name": "punctuation.section.function.scss"
						}
					},
					"end": "(\\))",
					"endCaptures": {
						"1": {
							"name": "punctuation.section.function.scss"
						}
					},
					"patterns": [
						{
							"include": "#parameters"
						}
					]
				},
				{
					"match": "([\\w-]{1,})",
					"name": "support.function.misc.scss"
				}
			]
		},
		"general": {
			"patterns": [
				{
					"include": "#variable"
				},
				{
					"include": "#comment_docblock"
				},
				{
					"include": "#comment_block"
				},
				{
					"include": "#comment_line"
				}
			]
		},
		"interpolation": {
			"begin": "#{",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.interpolation.begin.bracket.curly.scss"
				}
			},
			"end": "}",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.interpolation.end.bracket.curly.scss"
				}
			},
			"name": "variable.interpolation.scss",
			"patterns": [
				{
					"include": "#variable"
				},
				{
					"include": "#property_values"
				}
			]
		},
		"conditional_operators": {
			"patterns": [
				{
					"include": "#comparison_operators"
				},
				{
					"include": "#logical_operators"
				}
			]
		},
		"comparison_operators": {
			"match": "==|!=|<=|>=|<|>",
			"name": "keyword.operator.comparison.scss"
		},
		"logical_operators": {
			"match": "\\b(not|or|and)\\b",
			"name": "keyword.operator.logical.scss"
		},
		"map": {
			"begin": "\\(",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.map.begin.bracket.round.scss"
				}
			},
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.map.end.bracket.round.scss"
				}
			},
			"name": "meta.definition.variable.map.scss",
			"patterns": [
				{
					"include": "#comment_docblock"
				},
				{
					"include": "#comment_block"
				},
				{
					"include": "#comment_line"
				},
				{
					"match": "\\b([\\w-]+)\\s*(:)",
					"captures": {
						"1": {
							"name": "support.type.map.key.scss"
						},
						"2": {
							"name": "punctuation.separator.key-value.scss"
						}
					}
				},
				{
					"match": ",",
					"name": "punctuation.separator.delimiter.scss"
				},
				{
					"include": "#map"
				},
				{
					"include": "#variable"
				},
				{
					"include": "#property_values"
				}
			]
		},
		"operators": {
			"match": "[-+*/](?!\\s*[-+*/])",
			"name": "keyword.operator.css"
		},
		"parameters": {
			"patterns": [
				{
					"include": "#variable"
				},
				{
					"begin": "\\(",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.begin.bracket.round.scss"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.round.scss"
						}
					},
					"patterns": [
						{
							"include": "#function_attributes"
						}
					]
				},
				{
					"include": "#property_values"
				},
				{
					"include": "#comment_block"
				},
				{
					"match": "[^'\",) \\t]+",
					"name": "variable.parameter.url.scss"
				},
				{
					"match": ",",
					"name": "punctuation.separator.delimiter.scss"
				}
			]
		},
		"properties": {
			"patterns": [
				{
					"begin": "(?<![-a-z])(?=[-a-z])",
					"end": "$|(?![-a-z])",
					"name": "meta.property-name.scss",
					"patterns": [
						{
							"include": "source.css#property-names"
						},
						{
							"include": "#at_rule_include"
						}
					]
				},
				{
					"begin": "(:)\\s*(?!(\\s*{))",
					"beginCaptures": {
						"1": {
							"name": "punctuation.separator.key-value.scss"
						}
					},
					"end": "\\s*(;|(?=}|\\)))",
					"endCaptures": {
						"1": {
							"name": "punctuation.terminator.rule.scss"
						}
					},
					"contentName": "meta.property-value.scss",
					"patterns": [
						{
							"include": "#general"
						},
						{
							"include": "#property_values"
						}
					]
				}
			]
		},
		"property_list": {
			"begin": "{",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.property-list.begin.bracket.curly.scss"
				}
			},
			"end": "}",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.property-list.end.bracket.curly.scss"
				}
			},
			"name": "meta.property-list.scss",
			"patterns": [
				{
					"include": "#flow_control"
				},
				{
					"include": "#rules"
				},
				{
					"include": "#properties"
				},
				{
					"include": "$self"
				}
			]
		},
		"property_values": {
			"patterns": [
				{
					"include": "#string_single"
				},
				{
					"include": "#string_double"
				},
				{
					"include": "#constant_functions"
				},
				{
					"include": "#constant_sass_functions"
				},
				{
					"include": "#constant_important"
				},
				{
					"include": "#constant_default"
				},
				{
					"include": "#constant_optional"
				},
				{
					"include": "source.css#numeric-values"
				},
				{
					"include": "source.css#property-keywords"
				},
				{
					"include": "source.css#color-keywords"
				},
				{
					"include": "source.css#property-names"
				},
				{
					"include": "#constant_mathematical_symbols"
				},
				{
					"include": "#operators"
				},
				{
					"begin": "\\(",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.begin.bracket.round.scss"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.end.bracket.round.scss"
						}
					},
					"patterns": [
						{
							"include": "#general"
						},
						{
							"include": "#property_values"
						}
					]
				}
			]
		},
		"rules": {
			"patterns": [
				{
					"include": "#general"
				},
				{
					"include": "#at_rule_extend"
				},
				{
					"include": "#at_rule_content"
				},
				{
					"include": "#at_rule_include"
				},
				{
					"include": "#at_rule_media"
				},
				{
					"include": "#selectors"
				}
			]
		},
		"selector_attribute": {
			"match": "(?xi)\n(\\[)\n\\s*\n(\n  (?:\n    [-a-zA-Z_0-9]|[^\\x00-\\x7F]       # Valid identifier characters\n    | \\\\(?:[0-9a-fA-F]{1,6}|.)       # Escape sequence\n    | \\#\\{                           # Interpolation (escaped to avoid Coffeelint errors)\n    | \\.?\\$                          # Possible start of interpolation variable\n    | }                                # Possible end of interpolation\n  )+?\n)\n(?:\n  \\s*([~|^$*]?=)\\s*\n  (?:\n    (\n      (?:\n        [-a-zA-Z_0-9]|[^\\x00-\\x7F]       # Valid identifier characters\n        | \\\\(?:[0-9a-fA-F]{1,6}|.)       # Escape sequence\n        | \\#\\{                           # Interpolation (escaped to avoid Coffeelint errors)\n        | \\.?\\$                          # Possible start of interpolation variable\n        | }                                # Possible end of interpolation\n      )+\n    )\n    |\n    ((\")(.*?)(\"))\n    |\n    ((')(.*?)('))\n  )\n)?\n\\s*\n(\\])",
			"name": "meta.attribute-selector.scss",
			"captures": {
				"1": {
					"name": "punctuation.definition.attribute-selector.begin.bracket.square.scss"
				},
				"2": {
					"name": "entity.other.attribute-name.attribute.scss",
					"patterns": [
						{
							"include": "#interpolation"
						},
						{
							"match": "\\\\([0-9a-fA-F]{1,6}|.)",
							"name": "constant.character.escape.scss"
						},
						{
							"match": "\\$|}",
							"name": "invalid.illegal.scss"
						}
					]
				},
				"3": {
					"name": "keyword.operator.scss"
				},
				"4": {
					"name": "string.unquoted.attribute-value.scss",
					"patterns": [
						{
							"include": "#interpolation"
						},
						{
							"match": "\\\\([0-9a-fA-F]{1,6}|.)",
							"name": "constant.character.escape.scss"
						},
						{
							"match": "\\$|}",
							"name": "invalid.illegal.scss"
						}
					]
				},
				"5": {
					"name": "string.quoted.double.attribute-value.scss"
				},
				"6": {
					"name": "punctuation.definition.string.begin.scss"
				},
				"7": {
					"patterns": [
						{
							"include": "#interpolation"
						},
						{
							"match": "\\\\([0-9a-fA-F]{1,6}|.)",
							"name": "constant.character.escape.scss"
						},
						{
							"match": "\\$|}",
							"name": "invalid.illegal.scss"
						}
					]
				},
				"8": {
					"name": "punctuation.definition.string.end.scss"
				},
				"9": {
					"name": "string.quoted.single.attribute-value.scss"
				},
				"10": {
					"name": "punctuation.definition.string.begin.scss"
				},
				"11": {
					"patterns": [
						{
							"include": "#interpolation"
						},
						{
							"match": "\\\\([0-9a-fA-F]{1,6}|.)",
							"name": "constant.character.escape.scss"
						},
						{
							"match": "\\$|}",
							"name": "invalid.illegal.scss"
						}
					]
				},
				"12": {
					"name": "punctuation.definition.string.end.scss"
				},
				"13": {
					"name": "punctuation.definition.attribute-selector.end.bracket.square.scss"
				}
			}
		},
		"selector_class": {
			"match": "(?x)\n(\\.)                                  # Valid class-name\n(\n  (?: [-a-zA-Z_0-9]|[^\\x00-\\x7F]     # Valid identifier characters\n    | \\\\(?:[0-9a-fA-F]{1,6}|.)       # Escape sequence\n    | \\#\\{                           # Interpolation (escaped to avoid Coffeelint errors)\n    | \\.?\\$                          # Possible start of interpolation variable\n    | }                                # Possible end of interpolation\n  )+\n)                                      # Followed by either:\n(?= $                                  # - End of the line\n  | [\\s,\\#)\\[:{>+~|]                # - Another selector\n  | \\.[^$]                            # - Class selector, negating module variable\n  | /\\*                               # - A block comment\n  | ;                                  # - A semicolon\n)",
			"name": "entity.other.attribute-name.class.css",
			"captures": {
				"1": {
					"name": "punctuation.definition.entity.css"
				},
				"2": {
					"patterns": [
						{
							"include": "#interpolation"
						},
						{
							"match": "\\\\([0-9a-fA-F]{1,6}|.)",
							"name": "constant.character.escape.scss"
						},
						{
							"match": "\\$|}",
							"name": "invalid.illegal.scss"
						}
					]
				}
			}
		},
		"selector_custom": {
			"match": "\\b([a-zA-Z0-9]+(-[a-zA-Z0-9]+)+)(?=\\.|\\s++[^:]|\\s*[,\\[{]|:(link|visited|hover|active|focus|target|lang|disabled|enabled|checked|indeterminate|root|nth-(child|last-child|of-type|last-of-type)|first-child|last-child|first-of-type|last-of-type|only-child|only-of-type|empty|not|valid|invalid)(\\([0-9A-Za-z]*\\))?)",
			"name": "entity.name.tag.custom.scss"
		},
		"selector_id": {
			"match": "(?x)\n(\\#)                                  # Valid id-name\n(\n  (?: [-a-zA-Z_0-9]|[^\\x00-\\x7F]     # Valid identifier characters\n    | \\\\(?:[0-9a-fA-F]{1,6}|.)       # Escape sequence\n    | \\#\\{                           # Interpolation (escaped to avoid Coffeelint errors)\n    | \\.?\\$                          # Possible start of interpolation variable\n    | }                                # Possible end of interpolation\n  )+\n)                                      # Followed by either:\n(?= $                                  # - End of the line\n  | [\\s,\\#)\\[:{>+~|]                # - Another selector\n  | \\.[^$]                            # - Class selector, negating module variable\n  | /\\*                               # - A block comment\n)",
			"name": "entity.other.attribute-name.id.css",
			"captures": {
				"1": {
					"name": "punctuation.definition.entity.css"
				},
				"2": {
					"patterns": [
						{
							"include": "#interpolation"
						},
						{
							"match": "\\\\([0-9a-fA-F]{1,6}|.)",
							"name": "constant.character.escape.scss"
						},
						{
							"match": "\\$|}",
							"name": "invalid.illegal.identifier.scss"
						}
					]
				}
			}
		},
		"selector_placeholder": {
			"match": "(?x)\n(%)                                    # Valid placeholder-name\n(\n  (?: [-a-zA-Z_0-9]|[^\\x00-\\x7F]     # Valid identifier characters\n    | \\\\(?:[0-9a-fA-F]{1,6}|.)       # Escape sequence\n    | \\#\\{                           # Interpolation (escaped to avoid Coffeelint errors)\n    | \\.\\$                           # Possible start of interpolation module scope variable\n    | \\$                              # Possible start of interpolation variable\n    | }                                # Possible end of interpolation\n  )+\n)                                      # Followed by either:\n(?= ;                                  # - End of statement\n  | $                                  # - End of the line\n  | [\\s,\\#)\\[:{>+~|]                # - Another selector\n  | \\.[^$]                            # - Class selector, negating module variable\n  | /\\*                               # - A block comment\n)",
			"name": "entity.other.attribute-name.placeholder.css",
			"captures": {
				"1": {
					"name": "punctuation.definition.entity.css"
				},
				"2": {
					"patterns": [
						{
							"include": "#interpolation"
						},
						{
							"match": "\\\\([0-9a-fA-F]{1,6}|.)",
							"name": "constant.character.escape.scss"
						},
						{
							"match": "\\$|}",
							"name": "invalid.illegal.identifier.scss"
						}
					]
				}
			}
		},
		"parent_selector_suffix": {
			"match": "(?x)\n(?<=&)\n(\n  (?: [-a-zA-Z_0-9]|[^\\x00-\\x7F]     # Valid identifier characters\n    | \\\\(?:[0-9a-fA-F]{1,6}|.)       # Escape sequence\n    | \\#\\{                           # Interpolation (escaped to avoid Coffeelint errors)\n    | \\$                              # Possible start of interpolation variable\n    | }                                # Possible end of interpolation\n  )+\n)                                      # Followed by either:\n(?= $                                  # - End of the line\n  | [\\s,.\\#)\\[:{>+~|]               # - Another selector\n  | /\\*                               # - A block comment\n)",
			"name": "entity.other.attribute-name.parent-selector-suffix.css",
			"captures": {
				"1": {
					"name": "punctuation.definition.entity.css"
				},
				"2": {
					"patterns": [
						{
							"include": "#interpolation"
						},
						{
							"match": "\\\\([0-9a-fA-F]{1,6}|.)",
							"name": "constant.character.escape.scss"
						},
						{
							"match": "\\$|}",
							"name": "invalid.illegal.identifier.scss"
						}
					]
				}
			}
		},
		"selector_pseudo_class": {
			"patterns": [
				{
					"begin": "((:)\\bnth-(?:child|last-child|of-type|last-of-type))(\\()",
					"beginCaptures": {
						"1": {
							"name": "entity.other.attribute-name.pseudo-class.css"
						},
						"2": {
							"name": "punctuation.definition.entity.css"
						},
						"3": {
							"name": "punctuation.definition.pseudo-class.begin.bracket.round.css"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.pseudo-class.end.bracket.round.css"
						}
					},
					"patterns": [
						{
							"include": "#interpolation"
						},
						{
							"match": "\\d+",
							"name": "constant.numeric.css"
						},
						{
							"match": "(?<=\\d)n\\b|\\b(n|even|odd)\\b",
							"name": "constant.other.scss"
						},
						{
							"match": "\\w+",
							"name": "invalid.illegal.scss"
						}
					]
				},
				{
					"include": "source.css#pseudo-classes"
				},
				{
					"include": "source.css#pseudo-elements"
				},
				{
					"include": "source.css#functional-pseudo-classes"
				}
			]
		},
		"selectors": {
			"patterns": [
				{
					"include": "source.css#tag-names"
				},
				{
					"include": "#selector_custom"
				},
				{
					"include": "#selector_class"
				},
				{
					"include": "#selector_id"
				},
				{
					"include": "#selector_pseudo_class"
				},
				{
					"include": "#tag_wildcard"
				},
				{
					"include": "#tag_parent_reference"
				},
				{
					"include": "source.css#pseudo-elements"
				},
				{
					"include": "#selector_attribute"
				},
				{
					"include": "#selector_placeholder"
				},
				{
					"include": "#parent_selector_suffix"
				}
			]
		},
		"string_double": {
			"begin": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.scss"
				}
			},
			"end": "\"",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.scss"
				}
			},
			"name": "string.quoted.double.scss",
			"patterns": [
				{
					"match": "\\\\(\\h{1,6}|.)",
					"name": "constant.character.escape.scss"
				},
				{
					"include": "#interpolation"
				}
			]
		},
		"string_single": {
			"begin": "'",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.scss"
				}
			},
			"end": "'",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.scss"
				}
			},
			"name": "string.quoted.single.scss",
			"patterns": [
				{
					"match": "\\\\(\\h{1,6}|.)",
					"name": "constant.character.escape.scss"
				},
				{
					"include": "#interpolation"
				}
			]
		},
		"tag_parent_reference": {
			"match": "&",
			"name": "entity.name.tag.reference.scss"
		},
		"tag_wildcard": {
			"match": "\\*",
			"name": "entity.name.tag.wildcard.scss"
		},
		"variable": {
			"patterns": [
				{
					"include": "#variables"
				},
				{
					"include": "#interpolation"
				}
			]
		},
		"variable_setting": {
			"begin": "(?=\\$[\\w-]+\\s*:)",
			"end": ";",
			"endCaptures": {
				"0": {
					"name": "punctuation.terminator.rule.scss"
				}
			},
			"contentName": "meta.definition.variable.scss",
			"patterns": [
				{
					"match": "\\$[\\w-]+(?=\\s*:)",
					"name": "variable.scss"
				},
				{
					"begin": ":",
					"beginCaptures": {
						"0": {
							"name": "punctuation.separator.key-value.scss"
						}
					},
					"end": "(?=;)",
					"patterns": [
						{
							"include": "#comment_docblock"
						},
						{
							"include": "#comment_block"
						},
						{
							"include": "#comment_line"
						},
						{
							"include": "#map"
						},
						{
							"include": "#property_values"
						},
						{
							"include": "#variable"
						},
						{
							"match": ",",
							"name": "punctuation.separator.delimiter.scss"
						}
					]
				}
			]
		},
		"variables": {
			"patterns": [
				{
					"match": "\\b([\\w-]+)(\\.)(\\$[\\w-]+)\\b",
					"captures": {
						"1": {
							"name": "variable.scss"
						},
						"2": {
							"name": "punctuation.access.module.scss"
						},
						"3": {
							"name": "variable.scss"
						}
					}
				},
				{
					"match": "(\\$|\\-\\-)[A-Za-z0-9_-]+\\b",
					"name": "variable.scss"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/search-result/.vscodeignore]---
Location: vscode-main/extensions/search-result/.vscodeignore

```text
src/**
out/**
tsconfig.json
extension.webpack.config.js
extension-browser.webpack.config.js
package-lock.json
syntaxes/generateTMLanguage.js
```

--------------------------------------------------------------------------------

---[FILE: extensions/search-result/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/search-result/extension-browser.webpack.config.js

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

---[FILE: extensions/search-result/extension.webpack.config.js]---
Location: vscode-main/extensions/search-result/extension.webpack.config.js

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

---[FILE: extensions/search-result/package-lock.json]---
Location: vscode-main/extensions/search-result/package-lock.json

```json
{
  "name": "search-result",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "search-result",
      "version": "1.0.0",
      "license": "MIT",
      "devDependencies": {
        "@types/node": "^22.18.10"
      },
      "engines": {
        "vscode": "^1.39.0"
      }
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
    "node_modules/undici-types": {
      "version": "6.21.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",
      "integrity": "sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==",
      "dev": true,
      "license": "MIT"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/search-result/package.json]---
Location: vscode-main/extensions/search-result/package.json

```json
{
  "name": "search-result",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "icon": "images/icon.png",
  "engines": {
    "vscode": "^1.39.0"
  },
  "main": "./out/extension.js",
  "browser": "./dist/extension.js",
  "activationEvents": [
    "onLanguage:search-result"
  ],
  "scripts": {
    "generate-grammar": "node ./syntaxes/generateTMLanguage.js",
    "vscode:prepublish": "node ../../node_modules/gulp/bin/gulp.js --gulpfile ../../build/gulpfile.extensions.mjs compile-extension:search-result ./tsconfig.json"
  },
  "capabilities": {
    "virtualWorkspaces": true,
    "untrustedWorkspaces": {
      "supported": true
    }
  },
  "enabledApiProposals": [
    "documentFiltersExclusive"
  ],
  "contributes": {
    "configurationDefaults": {
      "[search-result]": {
        "editor.lineNumbers": "off"
      }
    },
    "languages": [
      {
        "id": "search-result",
        "extensions": [
          ".code-search"
        ],
        "aliases": [
          "Search Result"
        ]
      }
    ],
    "grammars": [
      {
        "language": "search-result",
        "scopeName": "text.searchResult",
        "path": "./syntaxes/searchResult.tmLanguage.json"
      }
    ]
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  },
  "devDependencies": {
    "@types/node": "^22.18.10"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/search-result/package.nls.json]---
Location: vscode-main/extensions/search-result/package.nls.json

```json
{
	"displayName": "Search Result",
	"description": "Provides syntax highlighting and language features for tabbed search results."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/search-result/README.md]---
Location: vscode-main/extensions/search-result/README.md

```markdown
# Language Features for Search Result files

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

This extension provides Syntax Highlighting, Symbol Information, Result Highlighting, and Go to Definition capabilities for the Search Results Editor.
```

--------------------------------------------------------------------------------

---[FILE: extensions/search-result/tsconfig.json]---
Location: vscode-main/extensions/search-result/tsconfig.json

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

---[FILE: extensions/search-result/src/extension.ts]---
Location: vscode-main/extensions/search-result/src/extension.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as pathUtils from 'path';

const FILE_LINE_REGEX = /^(\S.*):$/;
const RESULT_LINE_REGEX = /^(\s+)(\d+)(: |  )(\s*)(.*)$/;
const ELISION_REGEX = /⟪ ([0-9]+) characters skipped ⟫/g;
const SEARCH_RESULT_SELECTOR = { language: 'search-result', exclusive: true };
const DIRECTIVES = ['# Query:', '# Flags:', '# Including:', '# Excluding:', '# ContextLines:'];
const FLAGS = ['RegExp', 'CaseSensitive', 'IgnoreExcludeSettings', 'WordMatch'];

let cachedLastParse: { version: number; parse: ParsedSearchResults; uri: vscode.Uri } | undefined;
let documentChangeListener: vscode.Disposable | undefined;


export function activate(context: vscode.ExtensionContext) {

	const contextLineDecorations = vscode.window.createTextEditorDecorationType({ opacity: '0.7' });
	const matchLineDecorations = vscode.window.createTextEditorDecorationType({ fontWeight: 'bold' });

	const decorate = (editor: vscode.TextEditor) => {
		const parsed = parseSearchResults(editor.document).filter(isResultLine);
		const contextRanges = parsed.filter(line => line.isContext).map(line => line.prefixRange);
		const matchRanges = parsed.filter(line => !line.isContext).map(line => line.prefixRange);
		editor.setDecorations(contextLineDecorations, contextRanges);
		editor.setDecorations(matchLineDecorations, matchRanges);
	};

	if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.languageId === 'search-result') {
		decorate(vscode.window.activeTextEditor);
	}

	context.subscriptions.push(

		vscode.languages.registerDocumentSymbolProvider(SEARCH_RESULT_SELECTOR, {
			provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.DocumentSymbol[] {
				const results = parseSearchResults(document, token)
					.filter(isFileLine)
					.map(line => new vscode.DocumentSymbol(
						line.path,
						'',
						vscode.SymbolKind.File,
						line.allLocations.map(({ originSelectionRange }) => originSelectionRange!).reduce((p, c) => p.union(c), line.location.originSelectionRange!),
						line.location.originSelectionRange!,
					));

				return results;
			}
		}),

		vscode.languages.registerCompletionItemProvider(SEARCH_RESULT_SELECTOR, {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {

				const line = document.lineAt(position.line);
				if (position.line > 3) { return []; }
				if (position.character === 0 || (position.character === 1 && line.text === '#')) {
					const header = Array.from({ length: DIRECTIVES.length }).map((_, i) => document.lineAt(i).text);

					return DIRECTIVES
						.filter(suggestion => header.every(line => line.indexOf(suggestion) === -1))
						.map(flag => ({ label: flag, insertText: (flag.slice(position.character)) + ' ' }));
				}

				if (line.text.indexOf('# Flags:') === -1) { return []; }

				return FLAGS
					.filter(flag => line.text.indexOf(flag) === -1)
					.map(flag => ({ label: flag, insertText: flag + ' ' }));
			}
		}, '#'),

		vscode.languages.registerDefinitionProvider(SEARCH_RESULT_SELECTOR, {
			provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.DefinitionLink[] {
				const lineResult = parseSearchResults(document, token)[position.line];
				if (!lineResult) { return []; }
				if (lineResult.type === 'file') {
					return lineResult.allLocations.map(l => ({ ...l, originSelectionRange: lineResult.location.originSelectionRange }));
				}

				const location = lineResult.locations.find(l => l.originSelectionRange.contains(position));
				if (!location) {
					return [];
				}

				const targetPos = new vscode.Position(
					location.targetSelectionRange.start.line,
					location.targetSelectionRange.start.character + (position.character - location.originSelectionRange.start.character)
				);
				return [{
					...location,
					targetSelectionRange: new vscode.Range(targetPos, targetPos),
				}];
			}
		}),

		vscode.languages.registerDocumentLinkProvider(SEARCH_RESULT_SELECTOR, {
			async provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.DocumentLink[]> {
				return parseSearchResults(document, token)
					.filter(isFileLine)
					.map(({ location }) => ({ range: location.originSelectionRange!, target: location.targetUri }));
			}
		}),

		vscode.window.onDidChangeActiveTextEditor(editor => {
			if (editor?.document.languageId === 'search-result') {
				// Clear the parse whenever we open a new editor.
				// Conservative because things like the URI might remain constant even if the contents change, and re-parsing even large files is relatively fast.
				cachedLastParse = undefined;

				documentChangeListener?.dispose();
				documentChangeListener = vscode.workspace.onDidChangeTextDocument(doc => {
					if (doc.document.uri === editor.document.uri) {
						decorate(editor);
					}
				});

				decorate(editor);
			}
		}),

		{ dispose() { cachedLastParse = undefined; documentChangeListener?.dispose(); } }
	);
}


function relativePathToUri(path: string, resultsUri: vscode.Uri): vscode.Uri | undefined {

	const userDataPrefix = '(Settings) ';
	if (path.startsWith(userDataPrefix)) {
		return vscode.Uri.file(path.slice(userDataPrefix.length)).with({ scheme: 'vscode-userdata' });
	}

	if (pathUtils.isAbsolute(path)) {
		if (/^[\\\/]Untitled-\d*$/.test(path)) {
			return vscode.Uri.file(path.slice(1)).with({ scheme: 'untitled', path: path.slice(1) });
		}
		return vscode.Uri.file(path);
	}

	if (path.indexOf('~/') === 0) {
		const homePath = process.env.HOME || process.env.HOMEPATH || '';
		return vscode.Uri.file(pathUtils.join(homePath, path.slice(2)));
	}

	const uriFromFolderWithPath = (folder: vscode.WorkspaceFolder, path: string): vscode.Uri =>
		vscode.Uri.joinPath(folder.uri, path);

	if (vscode.workspace.workspaceFolders) {
		const multiRootFormattedPath = /^(.*) • (.*)$/.exec(path);
		if (multiRootFormattedPath) {
			const [, workspaceName, workspacePath] = multiRootFormattedPath;
			const folder = vscode.workspace.workspaceFolders.filter(wf => wf.name === workspaceName)[0];
			if (folder) {
				return uriFromFolderWithPath(folder, workspacePath);
			}
		}
		else if (vscode.workspace.workspaceFolders.length === 1) {
			return uriFromFolderWithPath(vscode.workspace.workspaceFolders[0], path);
		} else if (resultsUri.scheme !== 'untitled') {
			// We're in a multi-root workspace, but the path is not multi-root formatted
			// Possibly a saved search from a single root session. Try checking if the search result document's URI is in a current workspace folder.
			const prefixMatch = vscode.workspace.workspaceFolders.filter(wf => resultsUri.toString().startsWith(wf.uri.toString()))[0];
			if (prefixMatch) {
				return uriFromFolderWithPath(prefixMatch, path);
			}
		}
	}

	console.error(`Unable to resolve path ${path}`);
	return undefined;
}

type ParsedSearchFileLine = { type: 'file'; location: vscode.LocationLink; allLocations: vscode.LocationLink[]; path: string };
type ParsedSearchResultLine = { type: 'result'; locations: Required<vscode.LocationLink>[]; isContext: boolean; prefixRange: vscode.Range };
type ParsedSearchResults = Array<ParsedSearchFileLine | ParsedSearchResultLine>;
const isFileLine = (line: ParsedSearchResultLine | ParsedSearchFileLine): line is ParsedSearchFileLine => line.type === 'file';
const isResultLine = (line: ParsedSearchResultLine | ParsedSearchFileLine): line is ParsedSearchResultLine => line.type === 'result';


function parseSearchResults(document: vscode.TextDocument, token?: vscode.CancellationToken): ParsedSearchResults {

	if (cachedLastParse && cachedLastParse.uri === document.uri && cachedLastParse.version === document.version) {
		return cachedLastParse.parse;
	}

	const lines = document.getText().split(/\r?\n/);
	const links: ParsedSearchResults = [];

	let currentTarget: vscode.Uri | undefined = undefined;
	let currentTargetLocations: vscode.LocationLink[] | undefined = undefined;

	for (let i = 0; i < lines.length; i++) {
		// TODO: This is probably always false, given we're pegging the thread...
		if (token?.isCancellationRequested) { return []; }
		const line = lines[i];

		const fileLine = FILE_LINE_REGEX.exec(line);
		if (fileLine) {
			const [, path] = fileLine;

			currentTarget = relativePathToUri(path, document.uri);
			if (!currentTarget) { continue; }
			currentTargetLocations = [];

			const location: vscode.LocationLink = {
				targetRange: new vscode.Range(0, 0, 0, 1),
				targetUri: currentTarget,
				originSelectionRange: new vscode.Range(i, 0, i, line.length),
			};


			links[i] = { type: 'file', location, allLocations: currentTargetLocations, path };
		}

		if (!currentTarget) { continue; }

		const resultLine = RESULT_LINE_REGEX.exec(line);
		if (resultLine) {
			const [, indentation, _lineNumber, separator] = resultLine;
			const lineNumber = +_lineNumber - 1;
			const metadataOffset = (indentation + _lineNumber + separator).length;
			const targetRange = new vscode.Range(Math.max(lineNumber - 3, 0), 0, lineNumber + 3, line.length);

			const locations: Required<vscode.LocationLink>[] = [];

			let lastEnd = metadataOffset;
			let offset = 0;
			ELISION_REGEX.lastIndex = metadataOffset;
			for (let match: RegExpExecArray | null; (match = ELISION_REGEX.exec(line));) {
				locations.push({
					targetRange,
					targetSelectionRange: new vscode.Range(lineNumber, offset, lineNumber, offset),
					targetUri: currentTarget,
					originSelectionRange: new vscode.Range(i, lastEnd, i, ELISION_REGEX.lastIndex - match[0].length),
				});

				offset += (ELISION_REGEX.lastIndex - lastEnd - match[0].length) + Number(match[1]);
				lastEnd = ELISION_REGEX.lastIndex;
			}

			if (lastEnd < line.length) {
				locations.push({
					targetRange,
					targetSelectionRange: new vscode.Range(lineNumber, offset, lineNumber, offset),
					targetUri: currentTarget,
					originSelectionRange: new vscode.Range(i, lastEnd, i, line.length),
				});
			}
			// only show result lines in file-level peek
			if (separator.includes(':')) {
				currentTargetLocations?.push(...locations);
			}

			// Allow line number, indentation, etc to take you to definition as well.
			const convenienceLocation: Required<vscode.LocationLink> = {
				targetRange,
				targetSelectionRange: new vscode.Range(lineNumber, 0, lineNumber, 1),
				targetUri: currentTarget,
				originSelectionRange: new vscode.Range(i, 0, i, metadataOffset - 1),
			};
			locations.push(convenienceLocation);
			links[i] = { type: 'result', locations, isContext: separator === ' ', prefixRange: new vscode.Range(i, 0, i, metadataOffset) };
		}
	}

	cachedLastParse = {
		version: document.version,
		parse: links,
		uri: document.uri
	};

	return links;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/search-result/src/media/refresh-dark.svg]---
Location: vscode-main/extensions/search-result/src/media/refresh-dark.svg

```text
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.56253 2.51577C3.46348 3.4501 2 5.55414 2 7.99999C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 7.99999C14 5.32519 12.2497 3.05919 9.83199 2.28482L9.52968 3.23832C11.5429 3.88454 13 5.7721 13 7.99999C13 10.7614 10.7614 13 8 13C5.23858 13 3 10.7614 3 7.99999C3 6.31104 3.83742 4.81767 5.11969 3.91245L5.56253 2.51577Z" fill="#C5C5C5"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M5 3H2V2H5.5L6 2.5V6H5V3Z" fill="#C5C5C5"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: extensions/search-result/src/media/refresh-light.svg]---
Location: vscode-main/extensions/search-result/src/media/refresh-light.svg

```text
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.56253 2.51577C3.46348 3.4501 2 5.55414 2 7.99999C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 7.99999C14 5.32519 12.2497 3.05919 9.83199 2.28482L9.52968 3.23832C11.5429 3.88454 13 5.7721 13 7.99999C13 10.7614 10.7614 13 8 13C5.23858 13 3 10.7614 3 7.99999C3 6.31104 3.83742 4.81767 5.11969 3.91245L5.56253 2.51577Z" fill="#424242"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M5 3H2V2H5.5L6 2.5V6H5V3Z" fill="#424242"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: extensions/search-result/syntaxes/generateTMLanguage.js]---
Location: vscode-main/extensions/search-result/syntaxes/generateTMLanguage.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check

const mappings = [
	['bat', 'source.batchfile'],
	['c', 'source.c'],
	['clj', 'source.clojure'],
	['coffee', 'source.coffee'],
	['cpp', 'source.cpp', '\\.(?:cpp|c\\+\\+|cc|cxx|hxx|h\\+\\+|hh)'],
	['cs', 'source.cs'],
	['cshtml', 'text.html.cshtml'],
	['css', 'source.css'],
	['dart', 'source.dart'],
	['diff', 'source.diff'],
	['dockerfile', 'source.dockerfile', '(?:dockerfile|Dockerfile|containerfile|Containerfile)'],
	['fs', 'source.fsharp'],
	['go', 'source.go'],
	['groovy', 'source.groovy'],
	['h', 'source.objc'],
	['handlebars', 'text.html.handlebars', '\\.(?:handlebars|hbs)'],
	['hlsl', 'source.hlsl'],
	['hpp', 'source.objcpp'],
	['html', 'text.html.basic'],
	['ini', 'source.ini'],
	['java', 'source.java'],
	['jl', 'source.julia'],
	['js', 'source.js'],
	['json', 'source.json.comments'],
	['jsx', 'source.js.jsx'],
	['less', 'source.css.less'],
	['log', 'text.log'],
	['lua', 'source.lua'],
	['m', 'source.objc'],
	['makefile', 'source.makefile', '(?:makefile|Makefile)(?:\\..*)?'],
	['md', 'text.html.markdown'],
	['mm', 'source.objcpp'],
	['p6', 'source.perl.6'],
	['perl', 'source.perl', '\\.(?:perl|pl|pm)'],
	['php', 'source.php'],
	['ps1', 'source.powershell'],
	['pug', 'text.pug'],
	['py', 'source.python'],
	['r', 'source.r'],
	['rb', 'source.ruby'],
	['rs', 'source.rust'],
	['scala', 'source.scala'],
	['scss', 'source.css.scss'],
	['sh', 'source.shell'],
	['sql', 'source.sql'],
	['swift', 'source.swift'],
	['ts', 'source.ts'],
	['tsx', 'source.tsx'],
	['vb', 'source.asp.vb.net'],
	['xml', 'text.xml'],
	['yaml', 'source.yaml', '\\.(?:ya?ml)'],
];

const scopes = {
	root: 'text.searchResult',
	header: {
		meta: 'meta.header.search keyword.operator.word.search',
		key: 'entity.other.attribute-name',
		value: 'entity.other.attribute-value string.unquoted',
		flags: {
			keyword: 'keyword.other',
		},
		contextLines: {
			number: 'constant.numeric.integer',
			invalid: 'invalid.illegal',
		},
		query: {
			escape: 'constant.character.escape',
			invalid: 'invalid.illegal',
		}
	},
	resultBlock: {
		meta: 'meta.resultBlock.search',
		path: {
			meta: 'string meta.path.search',
			dirname: 'meta.path.dirname.search',
			basename: 'meta.path.basename.search',
			colon: 'punctuation.separator',
		},
		result: {
			meta: 'meta.resultLine.search',
			metaSingleLine: 'meta.resultLine.singleLine.search',
			metaMultiLine: 'meta.resultLine.multiLine.search',
			elision: 'comment meta.resultLine.elision',
			prefix: {
				meta: 'constant.numeric.integer meta.resultLinePrefix.search',
				metaContext: 'meta.resultLinePrefix.contextLinePrefix.search',
				metaMatch: 'meta.resultLinePrefix.matchLinePrefix.search',
				lineNumber: 'meta.resultLinePrefix.lineNumber.search',
				colon: 'punctuation.separator',
			}
		}
	}
};

const repository = {};
mappings.forEach(([ext, scope, regexp]) =>
	repository[ext] = {
		name: scopes.resultBlock.meta,
		begin: `^(?!\\s)(.*?)([^\\\\\\/\\n]*${regexp || `\\.${ext}`})(:)$`,
		end: '^(?!\\s)',
		beginCaptures: {
			'0': { name: scopes.resultBlock.path.meta },
			'1': { name: scopes.resultBlock.path.dirname },
			'2': { name: scopes.resultBlock.path.basename },
			'3': { name: scopes.resultBlock.path.colon },
		},
		patterns: [
			{
				name: [scopes.resultBlock.result.meta, scopes.resultBlock.result.metaMultiLine].join(' '),
				begin: '^  (?:\\s*)((\\d+) )',
				while: '^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))',
				beginCaptures: {
					'0': { name: scopes.resultBlock.result.prefix.meta },
					'1': { name: scopes.resultBlock.result.prefix.metaContext },
					'2': { name: scopes.resultBlock.result.prefix.lineNumber },
				},
				whileCaptures: {
					'0': { name: scopes.resultBlock.result.prefix.meta },
					'1': { name: scopes.resultBlock.result.prefix.metaMatch },
					'2': { name: scopes.resultBlock.result.prefix.lineNumber },
					'3': { name: scopes.resultBlock.result.prefix.colon },

					'4': { name: scopes.resultBlock.result.prefix.metaContext },
					'5': { name: scopes.resultBlock.result.prefix.lineNumber },
				},
				patterns: [{ include: scope }]
			},
			{
				begin: '^  (?:\\s*)((\\d+)(:))',
				while: '(?=not)possible',
				name: [scopes.resultBlock.result.meta, scopes.resultBlock.result.metaSingleLine].join(' '),
				beginCaptures: {
					'0': { name: scopes.resultBlock.result.prefix.meta },
					'1': { name: scopes.resultBlock.result.prefix.metaMatch },
					'2': { name: scopes.resultBlock.result.prefix.lineNumber },
					'3': { name: scopes.resultBlock.result.prefix.colon },
				},
				patterns: [{ include: scope }]
			}
		]
	});

const header = [
	{
		begin: '^(# Query): ',
		end: '\n',
		name: scopes.header.meta,
		beginCaptures: { '1': { name: scopes.header.key }, },
		patterns: [
			{
				match: '(\\\\n)|(\\\\\\\\)',
				name: [scopes.header.value, scopes.header.query.escape].join(' ')
			},
			{
				match: '\\\\.|\\\\$',
				name: [scopes.header.value, scopes.header.query.invalid].join(' ')
			},
			{
				match: '[^\\\\\\\n]+',
				name: [scopes.header.value].join(' ')
			},
		]
	},
	{
		begin: '^(# Flags): ',
		end: '\n',
		name: scopes.header.meta,
		beginCaptures: { '1': { name: scopes.header.key }, },
		patterns: [
			{
				match: '(RegExp|CaseSensitive|IgnoreExcludeSettings|WordMatch)',
				name: [scopes.header.value, 'keyword.other'].join(' ')
			},
			{ match: '.' },
		]
	},
	{
		begin: '^(# ContextLines): ',
		end: '\n',
		name: scopes.header.meta,
		beginCaptures: { '1': { name: scopes.header.key }, },
		patterns: [
			{
				match: '\\d',
				name: [scopes.header.value, scopes.header.contextLines.number].join(' ')
			},
			{ match: '.', name: scopes.header.contextLines.invalid },
		]
	},
	{
		match: '^(# (?:Including|Excluding)): (.*)$',
		name: scopes.header.meta,
		captures: {
			'1': { name: scopes.header.key },
			'2': { name: scopes.header.value }
		}
	},
];

const plainText = [
	{
		match: '^(?!\\s)(.*?)([^\\\\\\/\\n]*)(:)$',
		name: [scopes.resultBlock.meta, scopes.resultBlock.path.meta].join(' '),
		captures: {
			'1': { name: scopes.resultBlock.path.dirname },
			'2': { name: scopes.resultBlock.path.basename },
			'3': { name: scopes.resultBlock.path.colon }
		}
	},
	{
		match: '^  (?:\\s*)(?:((\\d+)(:))|((\\d+)( ))(.*))',
		name: [scopes.resultBlock.meta, scopes.resultBlock.result.meta].join(' '),
		captures: {
			'1': { name: [scopes.resultBlock.result.prefix.meta, scopes.resultBlock.result.prefix.metaMatch].join(' ') },
			'2': { name: scopes.resultBlock.result.prefix.lineNumber },
			'3': { name: scopes.resultBlock.result.prefix.colon },

			'4': { name: [scopes.resultBlock.result.prefix.meta, scopes.resultBlock.result.prefix.metaContext].join(' ') },
			'5': { name: scopes.resultBlock.result.prefix.lineNumber },
		}
	},
	{
		match: '⟪ [0-9]+ characters skipped ⟫',
		name: [scopes.resultBlock.meta, scopes.resultBlock.result.elision].join(' '),
	}
];

const tmLanguage = {
	'information_for_contributors': 'This file is generated from ./generateTMLanguage.js.',
	name: 'Search Results',
	scopeName: scopes.root,
	patterns: [
		...header,
		...mappings.map(([ext]) => ({ include: `#${ext}` })),
		...plainText
	],
	repository
};

require('fs').writeFileSync(
	require('path').join(__dirname, './searchResult.tmLanguage.json'),
	JSON.stringify(tmLanguage, null, 2));
```

--------------------------------------------------------------------------------

````
