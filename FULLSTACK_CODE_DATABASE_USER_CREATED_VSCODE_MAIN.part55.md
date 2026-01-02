---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 55
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 55 of 552)

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

---[FILE: extensions/julia/syntaxes/julia.tmLanguage.json]---
Location: vscode-main/extensions/julia/syntaxes/julia.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/JuliaEditorSupport/atom-language-julia/blob/master/grammars/julia_vscode.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/JuliaEditorSupport/atom-language-julia/commit/111548fbd25d083ec131d2732a4f46953ea92a65",
	"name": "Julia",
	"scopeName": "source.julia",
	"comment": "This grammar is used by Atom (Oniguruma), GitHub (PCRE), and VSCode (Oniguruma),\nso all regexps must be compatible with both engines.\n\nSpecs:\n- https://github.com/kkos/oniguruma/blob/master/doc/RE\n- https://www.pcre.org/current/doc/html/",
	"patterns": [
		{
			"include": "#operator"
		},
		{
			"include": "#array"
		},
		{
			"include": "#string"
		},
		{
			"include": "#parentheses"
		},
		{
			"include": "#bracket"
		},
		{
			"include": "#function_decl"
		},
		{
			"include": "#function_call"
		},
		{
			"include": "#for_block"
		},
		{
			"include": "#keyword"
		},
		{
			"include": "#number"
		},
		{
			"include": "#comment"
		},
		{
			"include": "#type_decl"
		},
		{
			"include": "#symbol"
		},
		{
			"include": "#punctuation"
		}
	],
	"repository": {
		"array": {
			"patterns": [
				{
					"begin": "\\[",
					"beginCaptures": {
						"0": {
							"name": "meta.bracket.julia"
						}
					},
					"end": "(\\])((?:\\.)?'*)",
					"endCaptures": {
						"1": {
							"name": "meta.bracket.julia"
						},
						"2": {
							"name": "keyword.operator.transpose.julia"
						}
					},
					"name": "meta.array.julia",
					"patterns": [
						{
							"match": "\\bbegin\\b",
							"name": "constant.numeric.julia"
						},
						{
							"match": "\\bend\\b",
							"name": "constant.numeric.julia"
						},
						{
							"include": "#self_no_for_block"
						}
					]
				}
			]
		},
		"parentheses": {
			"patterns": [
				{
					"begin": "\\(",
					"beginCaptures": {
						"0": {
							"name": "meta.bracket.julia"
						}
					},
					"end": "(\\))((?:\\.)?'*)",
					"endCaptures": {
						"1": {
							"name": "meta.bracket.julia"
						},
						"2": {
							"name": "keyword.operator.transpose.julia"
						}
					},
					"patterns": [
						{
							"include": "#self_no_for_block"
						}
					]
				}
			]
		},
		"bracket": {
			"patterns": [
				{
					"begin": "\\{",
					"beginCaptures": {
						"0": {
							"name": "meta.bracket.julia"
						}
					},
					"end": "(\\})((?:\\.)?'*)",
					"endCaptures": {
						"1": {
							"name": "meta.bracket.julia"
						},
						"2": {
							"name": "keyword.operator.transpose.julia"
						}
					},
					"patterns": [
						{
							"include": "#self_no_for_block"
						}
					]
				}
			]
		},
		"comment_tags": {
			"patterns": [
				{
					"match": "\\bTODO\\b",
					"name": "keyword.other.comment-annotation.julia"
				},
				{
					"match": "\\bFIXME\\b",
					"name": "keyword.other.comment-annotation.julia"
				},
				{
					"match": "\\bCHANGED\\b",
					"name": "keyword.other.comment-annotation.julia"
				},
				{
					"match": "\\bXXX\\b",
					"name": "keyword.other.comment-annotation.julia"
				}
			]
		},
		"comment": {
			"patterns": [
				{
					"include": "#comment_block"
				},
				{
					"begin": "#",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.comment.julia"
						}
					},
					"end": "\\n",
					"name": "comment.line.number-sign.julia",
					"patterns": [
						{
							"include": "#comment_tags"
						}
					]
				}
			]
		},
		"comment_block": {
			"patterns": [
				{
					"begin": "#=",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.comment.begin.julia"
						}
					},
					"end": "=#",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.comment.end.julia"
						}
					},
					"name": "comment.block.number-sign-equals.julia",
					"patterns": [
						{
							"include": "#comment_tags"
						},
						{
							"include": "#comment_block"
						}
					]
				}
			]
		},
		"function_call": {
			"patterns": [
				{
					"begin": "((?:[[:alpha:]_\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{So}←-⇿])(?:[[:word:]_!\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{Mn}\u0001-¡]|[^\\P{Mc}\u0001-¡]|[^\\P{Nd}\u0001-¡]|[^\\P{Pc}\u0001-¡]|[^\\P{Sk}\u0001-¡]|[^\\P{Me}\u0001-¡]|[^\\P{No}\u0001-¡]|[′-‷⁗]|[^\\P{So}←-⇿])*)({(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*})?\\.?(\\()",
					"beginCaptures": {
						"1": {
							"name": "support.function.julia"
						},
						"2": {
							"name": "support.type.julia"
						},
						"3": {
							"name": "meta.bracket.julia"
						}
					},
					"end": "\\)(('|(\\.'))*\\.?')?",
					"endCaptures": {
						"0": {
							"name": "meta.bracket.julia"
						},
						"1": {
							"name": "keyword.operator.transposed-func.julia"
						}
					},
					"patterns": [
						{
							"include": "#self_no_for_block"
						}
					]
				}
			]
		},
		"function_decl": {
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "entity.name.function.julia"
						},
						"2": {
							"name": "support.type.julia"
						}
					},
					"match": "((?:[[:alpha:]_\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{So}←-⇿])(?:[[:word:]_!\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{Mn}\u0001-¡]|[^\\P{Mc}\u0001-¡]|[^\\P{Nd}\u0001-¡]|[^\\P{Pc}\u0001-¡]|[^\\P{Sk}\u0001-¡]|[^\\P{Me}\u0001-¡]|[^\\P{No}\u0001-¡]|[′-‷⁗]|[^\\P{So}←-⇿])*)({(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*})?(?=\\([^#]*\\)(::[^\\s]+)?(\\s*\\bwhere\\b\\s+.+?)?\\s*?=(?![=>]))",
					"comment": "first group is function name\nSecond group is type parameters (e.g. {T<:Number, S})\nThen open parens\nThen a lookahead ensures that we are followed by:\n  - anything (function arguments)\n  - 0 or more spaces\n  - Finally an equal sign\nNegative lookahead ensures we don't have another equal sign (not `==`)"
				},
				{
					"captures": {
						"1": {
							"name": "keyword.other.julia"
						},
						"2": {
							"name": "keyword.operator.dots.julia"
						},
						"3": {
							"name": "entity.name.function.julia"
						},
						"4": {
							"name": "support.type.julia"
						}
					},
					"match": "\\b(function|macro)(?:\\s+(?:(?:[[:alpha:]_\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{So}←-⇿])(?:[[:word:]_!\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{Mn}\u0001-¡]|[^\\P{Mc}\u0001-¡]|[^\\P{Nd}\u0001-¡]|[^\\P{Pc}\u0001-¡]|[^\\P{Sk}\u0001-¡]|[^\\P{Me}\u0001-¡]|[^\\P{No}\u0001-¡]|[′-‷⁗]|[^\\P{So}←-⇿])*(\\.))?((?:[[:alpha:]_\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{So}←-⇿])(?:[[:word:]_!\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{Mn}\u0001-¡]|[^\\P{Mc}\u0001-¡]|[^\\P{Nd}\u0001-¡]|[^\\P{Pc}\u0001-¡]|[^\\P{Sk}\u0001-¡]|[^\\P{Me}\u0001-¡]|[^\\P{No}\u0001-¡]|[′-‷⁗]|[^\\P{So}←-⇿])*)({(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*})?|\\s*)(?=\\()",
					"comment": "similar regex to previous, but with keyword not 1-line syntax"
				}
			]
		},
		"for_block": {
			"comment": "for blocks need to be special-cased to support tokenizing 'outer' properly",
			"patterns": [
				{
					"begin": "\\b(for)\\b",
					"beginCaptures": {
						"0": {
							"name": "keyword.control.julia"
						}
					},
					"end": "(?<!,|\\s)(\\s*\\n)",
					"patterns": [
						{
							"match": "\\bouter\\b",
							"name": "keyword.other.julia"
						},
						{
							"include": "$self"
						}
					]
				}
			]
		},
		"keyword": {
			"patterns": [
				{
					"match": "\\b(?<![:_\\.])(?:function|mutable\\s+struct|struct|macro|quote|abstract\\s+type|primitive\\s+type|module|baremodule|where)\\b",
					"name": "keyword.other.julia"
				},
				{
					"match": "\\b(?<![:_])(?:if|else|elseif|for|while|begin|let|do|try|catch|finally|return|break|continue)\\b",
					"name": "keyword.control.julia"
				},
				{
					"match": "\\b(?<![:_])end\\b",
					"name": "keyword.control.end.julia"
				},
				{
					"match": "\\b(?<![:_])(?:global|local|const)\\b",
					"name": "keyword.storage.modifier.julia"
				},
				{
					"match": "\\b(?<![:_])(?:export)\\b",
					"name": "keyword.control.export.julia"
				},
				{
					"match": "^(?:public)\\b",
					"name": "keyword.control.public.julia"
				},
				{
					"match": "\\b(?<![:_])(?:import)\\b",
					"name": "keyword.control.import.julia"
				},
				{
					"match": "\\b(?<![:_])(?:using)\\b",
					"name": "keyword.control.using.julia"
				},
				{
					"match": "(?<=\\S\\s+)\\b(as)\\b(?=\\s+\\S)",
					"name": "keyword.control.as.julia"
				},
				{
					"match": "@(\\.|(?:[[:alpha:]_\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{So}←-⇿])(?:[[:word:]_!\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{Mn}\u0001-¡]|[^\\P{Mc}\u0001-¡]|[^\\P{Nd}\u0001-¡]|[^\\P{Pc}\u0001-¡]|[^\\P{Sk}\u0001-¡]|[^\\P{Me}\u0001-¡]|[^\\P{No}\u0001-¡]|[′-‷⁗]|[^\\P{So}←-⇿])*|[\\p{S}\\p{P}&&[^\\s@]]+)",
					"name": "support.function.macro.julia"
				}
			]
		},
		"number": {
			"patterns": [
				{
					"match": "((?<!(?:[[:word:]_!\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{Mn}\u0001-¡]|[^\\P{Mc}\u0001-¡]|[^\\P{Nd}\u0001-¡]|[^\\P{Pc}\u0001-¡]|[^\\P{Sk}\u0001-¡]|[^\\P{Me}\u0001-¡]|[^\\P{No}\u0001-¡]|[′-‷⁗]|[^\\P{So}←-⇿]))(?:(?:\\b0(?:x|X)[0-9a-fA-F](?:_?[0-9a-fA-F])*)|(?:\\b0o[0-7](?:_?[0-7])*)|(?:\\b0b[0-1](?:_?[0-1])*)|(?:(?:\\b[0-9](?:_?[0-9])*\\.?(?!\\.)(?:[_0-9]*))|(?:\\b\\.[0-9](?:_?[0-9])*))(?:[efE][+-]?[0-9](?:_?[0-9])*)?(?:im\\b|Inf(?:16|32|64)?\\b|NaN(?:16|32|64)?\\b|π\\b|pi\\b|ℯ\\b)?|\\b[0-9]+|\\bInf(?:16|32|64)?\\b|\\bNaN(?:16|32|64)?\\b|\\bπ\\b|\\bpi\\b|\\bℯ\\b))('*)",
					"captures": {
						"1": {
							"name": "constant.numeric.julia"
						},
						"2": {
							"name": "keyword.operator.conjugate-number.julia"
						}
					}
				},
				{
					"match": "\\bARGS\\b|\\bC_NULL\\b|\\bDEPOT_PATH\\b|\\bENDIAN_BOM\\b|\\bENV\\b|\\bLOAD_PATH\\b|\\bPROGRAM_FILE\\b|\\bstdin\\b|\\bstdout\\b|\\bstderr\\b|\\bVERSION\\b|\\bdevnull\\b",
					"name": "constant.global.julia"
				},
				{
					"match": "\\btrue\\b|\\bfalse\\b|\\bnothing\\b|\\bmissing\\b",
					"name": "constant.language.julia"
				}
			]
		},
		"operator": {
			"patterns": [
				{
					"match": "\\.?(?:<-->|->|-->|<--|←|→|↔|↚|↛|↞|↠|↢|↣|↦|↤|↮|⇎|⇍|⇏|⇐|⇒|⇔|⇴|⇶|⇷|⇸|⇹|⇺|⇻|⇼|⇽|⇾|⇿|⟵|⟶|⟷|⟹|⟺|⟻|⟼|⟽|⟾|⟿|⤀|⤁|⤂|⤃|⤄|⤅|⤆|⤇|⤌|⤍|⤎|⤏|⤐|⤑|⤔|⤕|⤖|⤗|⤘|⤝|⤞|⤟|⤠|⥄|⥅|⥆|⥇|⥈|⥊|⥋|⥎|⥐|⥒|⥓|⥖|⥗|⥚|⥛|⥞|⥟|⥢|⥤|⥦|⥧|⥨|⥩|⥪|⥫|⥬|⥭|⥰|⧴|⬱|⬰|⬲|⬳|⬴|⬵|⬶|⬷|⬸|⬹|⬺|⬻|⬼|⬽|⬾|⬿|⭀|⭁|⭂|⭃|⥷|⭄|⥺|⭇|⭈|⭉|⭊|⭋|⭌|￩|￫|⇜|⇝|↜|↝|↩|↪|↫|↬|↼|↽|⇀|⇁|⇄|⇆|⇇|⇉|⇋|⇌|⇚|⇛|⇠|⇢|↷|↶|↺|↻|=>)",
					"name": "keyword.operator.arrow.julia"
				},
				{
					"match": "(?::=|\\+=|-=|\\*=|//=|/=|\\.//=|\\./=|\\.\\*=|\\\\=|\\.\\\\=|\\^=|\\.\\^=|%=|\\.%=|÷=|\\.÷=|\\|=|&=|\\.&=|⊻=|\\.⊻=|\\$=|<<=|>>=|>>>=|=(?!=))",
					"name": "keyword.operator.update.julia"
				},
				{
					"match": "(?:<<|>>>|>>|\\.>>>|\\.>>|\\.<<)",
					"name": "keyword.operator.shift.julia"
				},
				{
					"match": "(?:\\s*(::|>:|<:)\\s*((?:(?:Union)?\\([^)]*\\)|[[:alpha:]_$∇][[:word:]⁺-ₜ!′\\.]*(?:(?:{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*})|(?:\".+?(?<!\\\\)\"))?)))(?:\\.\\.\\.)?((?:\\.)?'*)",
					"captures": {
						"1": {
							"name": "keyword.operator.relation.types.julia"
						},
						"2": {
							"name": "support.type.julia"
						},
						"3": {
							"name": "keyword.operator.transpose.julia"
						}
					}
				},
				{
					"match": "(\\.?((?<!<)<=|(?<!>)>=|>|<|≥|≤|===|==|≡|!=|≠|!==|≢|∈|∉|∋|∌|⊆|⊈|⊂|⊄|⊊|∝|∊|∍|∥|∦|∷|∺|∻|∽|∾|≁|≃|≂|≄|≅|≆|≇|≈|≉|≊|≋|≌|≍|≎|≐|≑|≒|≓|≖|≗|≘|≙|≚|≛|≜|≝|≞|≟|≣|≦|≧|≨|≩|≪|≫|≬|≭|≮|≯|≰|≱|≲|≳|≴|≵|≶|≷|≸|≹|≺|≻|≼|≽|≾|≿|⊀|⊁|⊃|⊅|⊇|⊉|⊋|⊏|⊐|⊑|⊒|⊜|⊩|⊬|⊮|⊰|⊱|⊲|⊳|⊴|⊵|⊶|⊷|⋍|⋐|⋑|⋕|⋖|⋗|⋘|⋙|⋚|⋛|⋜|⋝|⋞|⋟|⋠|⋡|⋢|⋣|⋤|⋥|⋦|⋧|⋨|⋩|⋪|⋫|⋬|⋭|⋲|⋳|⋴|⋵|⋶|⋷|⋸|⋹|⋺|⋻|⋼|⋽|⋾|⋿|⟈|⟉|⟒|⦷|⧀|⧁|⧡|⧣|⧤|⧥|⩦|⩧|⩪|⩫|⩬|⩭|⩮|⩯|⩰|⩱|⩲|⩳|⩵|⩶|⩷|⩸|⩹|⩺|⩻|⩼|⩽|⩾|⩿|⪀|⪁|⪂|⪃|⪄|⪅|⪆|⪇|⪈|⪉|⪊|⪋|⪌|⪍|⪎|⪏|⪐|⪑|⪒|⪓|⪔|⪕|⪖|⪗|⪘|⪙|⪚|⪛|⪜|⪝|⪞|⪟|⪠|⪡|⪢|⪣|⪤|⪥|⪦|⪧|⪨|⪩|⪪|⪫|⪬|⪭|⪮|⪯|⪰|⪱|⪲|⪳|⪴|⪵|⪶|⪷|⪸|⪹|⪺|⪻|⪼|⪽|⪾|⪿|⫀|⫁|⫂|⫃|⫄|⫅|⫆|⫇|⫈|⫉|⫊|⫋|⫌|⫍|⫎|⫏|⫐|⫑|⫒|⫓|⫔|⫕|⫖|⫗|⫘|⫙|⫷|⫸|⫹|⫺|⊢|⊣|⟂|⫪|⫫|<:|>:))",
					"name": "keyword.operator.relation.julia"
				},
				{
					"match": "(?<=\\s)(?:\\?)(?=\\s)",
					"name": "keyword.operator.ternary.julia"
				},
				{
					"match": "(?<=\\s)(?:\\:)(?=\\s)",
					"name": "keyword.operator.ternary.julia"
				},
				{
					"match": "(?:\\|\\||&&|(?<!(?:[[:word:]_!\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{Mn}\u0001-¡]|[^\\P{Mc}\u0001-¡]|[^\\P{Nd}\u0001-¡]|[^\\P{Pc}\u0001-¡]|[^\\P{Sk}\u0001-¡]|[^\\P{Me}\u0001-¡]|[^\\P{No}\u0001-¡]|[′-‷⁗]|[^\\P{So}←-⇿]))!)",
					"name": "keyword.operator.boolean.julia"
				},
				{
					"match": "(?<=[[:word:]⁺-ₜ!′∇\\)\\]\\}])(?::)",
					"name": "keyword.operator.range.julia"
				},
				{
					"match": "(?:\\|>)",
					"name": "keyword.operator.applies.julia"
				},
				{
					"match": "(?:\\||\\.\\||\\&|\\.\\&|~|¬|\\.~|⊻|\\.⊻)",
					"name": "keyword.operator.bitwise.julia"
				},
				{
					"match": "\\.?(?:\\+\\+|\\-\\-|\\+|\\-|−|¦|\\||⊕|⊖|⊞|⊟|∪|∨|⊔|±|∓|∔|∸|≏|⊎|⊻|⊽|⋎|⋓|⟇|⧺|⧻|⨈|⨢|⨣|⨤|⨥|⨦|⨧|⨨|⨩|⨪|⨫|⨬|⨭|⨮|⨹|⨺|⩁|⩂|⩅|⩊|⩌|⩏|⩐|⩒|⩔|⩖|⩗|⩛|⩝|⩡|⩢|⩣|\\*|//?|⌿|÷|%|&|·|·|⋅|∘|×|\\\\|∩|∧|⊗|⊘|⊙|⊚|⊛|⊠|⊡|⊓|∗|∙|∤|⅋|≀|⊼|⋄|⋆|⋇|⋉|⋊|⋋|⋌|⋏|⋒|⟑|⦸|⦼|⦾|⦿|⧶|⧷|⨇|⨰|⨱|⨲|⨳|⨴|⨵|⨶|⨷|⨸|⨻|⨼|⨽|⩀|⩃|⩄|⩋|⩍|⩎|⩑|⩓|⩕|⩘|⩚|⩜|⩞|⩟|⩠|⫛|⊍|▷|⨝|⟕|⟖|⟗|⨟|\\^|↑|↓|⇵|⟰|⟱|⤈|⤉|⤊|⤋|⤒|⤓|⥉|⥌|⥍|⥏|⥑|⥔|⥕|⥘|⥙|⥜|⥝|⥠|⥡|⥣|⥥|⥮|⥯|￪|￬|√|∛|∜|⋆|±|∓)",
					"name": "keyword.operator.arithmetic.julia"
				},
				{
					"match": "(?:∘)",
					"name": "keyword.operator.compose.julia"
				},
				{
					"match": "(?:::|(?<=\\s)isa(?=\\s))",
					"name": "keyword.operator.isa.julia"
				},
				{
					"match": "(?:(?<=\\s)in(?=\\s))",
					"name": "keyword.operator.relation.in.julia"
				},
				{
					"match": "(?:\\.(?=(?:@|_|\\p{L}))|\\.\\.+|…|⁝|⋮|⋱|⋰|⋯)",
					"name": "keyword.operator.dots.julia"
				},
				{
					"match": "(?:\\$)(?=.+)",
					"name": "keyword.operator.interpolation.julia"
				},
				{
					"captures": {
						"2": {
							"name": "keyword.operator.transposed-variable.julia"
						}
					},
					"match": "((?:[[:alpha:]_\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{So}←-⇿])(?:[[:word:]_!\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{Mn}\u0001-¡]|[^\\P{Mc}\u0001-¡]|[^\\P{Nd}\u0001-¡]|[^\\P{Pc}\u0001-¡]|[^\\P{Sk}\u0001-¡]|[^\\P{Me}\u0001-¡]|[^\\P{No}\u0001-¡]|[′-‷⁗]|[^\\P{So}←-⇿])*)(('|(\\.'))*\\.?')"
				},
				{
					"captures": {
						"1": {
							"name": "bracket.end.julia"
						},
						"2": {
							"name": "keyword.operator.transposed-matrix.julia"
						}
					},
					"match": "(\\])((?:'|(?:\\.'))*\\.?')"
				},
				{
					"captures": {
						"1": {
							"name": "bracket.end.julia"
						},
						"2": {
							"name": "keyword.operator.transposed-parens.julia"
						}
					},
					"match": "(\\))((?:'|(?:\\.'))*\\.?')"
				}
			]
		},
		"string": {
			"patterns": [
				{
					"begin": "(?:(@doc)\\s((?:doc)?\"\"\")|(doc\"\"\"))",
					"beginCaptures": {
						"1": {
							"name": "support.function.macro.julia"
						},
						"2": {
							"name": "punctuation.definition.string.begin.julia"
						}
					},
					"end": "(\"\"\") ?(->)?",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.string.end.julia"
						},
						"2": {
							"name": "keyword.operator.arrow.julia"
						}
					},
					"name": "string.docstring.julia",
					"patterns": [
						{
							"include": "#string_escaped_char"
						},
						{
							"include": "#string_dollar_sign_interpolate"
						}
					]
				},
				{
					"begin": "(i?cxx)(\"\"\")",
					"beginCaptures": {
						"1": {
							"name": "support.function.macro.julia"
						},
						"2": {
							"name": "punctuation.definition.string.begin.julia"
						}
					},
					"end": "\"\"\"",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.julia"
						}
					},
					"name": "embed.cxx.julia",
					"contentName": "meta.embedded.inline.cpp",
					"patterns": [
						{
							"include": "source.cpp#root_context"
						},
						{
							"include": "#string_dollar_sign_interpolate"
						}
					]
				},
				{
					"begin": "(py)(\"\"\")",
					"beginCaptures": {
						"1": {
							"name": "support.function.macro.julia"
						},
						"2": {
							"name": "punctuation.definition.string.begin.julia"
						}
					},
					"end": "([\\s\\w]*)(\"\"\")",
					"endCaptures": {
						"2": {
							"name": "punctuation.definition.string.end.julia"
						}
					},
					"name": "embed.python.julia",
					"contentName": "meta.embedded.inline.python",
					"patterns": [
						{
							"include": "source.python"
						},
						{
							"include": "#string_dollar_sign_interpolate"
						}
					]
				},
				{
					"begin": "(js)(\"\"\")",
					"beginCaptures": {
						"1": {
							"name": "support.function.macro.julia"
						},
						"2": {
							"name": "punctuation.definition.string.begin.julia"
						}
					},
					"end": "\"\"\"",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.julia"
						}
					},
					"name": "embed.js.julia",
					"contentName": "meta.embedded.inline.javascript",
					"patterns": [
						{
							"include": "source.js"
						},
						{
							"include": "#string_dollar_sign_interpolate"
						}
					]
				},
				{
					"begin": "(R)(\"\"\")",
					"beginCaptures": {
						"1": {
							"name": "support.function.macro.julia"
						},
						"2": {
							"name": "punctuation.definition.string.begin.julia"
						}
					},
					"end": "\"\"\"",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.julia"
						}
					},
					"name": "embed.R.julia",
					"contentName": "meta.embedded.inline.r",
					"patterns": [
						{
							"include": "source.r"
						},
						{
							"include": "#string_dollar_sign_interpolate"
						}
					]
				},
				{
					"begin": "(raw)(\"\"\")",
					"beginCaptures": {
						"1": {
							"name": "support.function.macro.julia"
						},
						"2": {
							"name": "punctuation.definition.string.begin.julia"
						}
					},
					"end": "\"\"\"",
					"name": "string.quoted.other.julia",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.julia"
						}
					},
					"patterns": [
						{
							"include": "#string_escaped_char"
						}
					]
				},
				{
					"begin": "(raw)(\")",
					"beginCaptures": {
						"1": {
							"name": "support.function.macro.julia"
						},
						"2": {
							"name": "punctuation.definition.string.begin.julia"
						}
					},
					"end": "\"",
					"name": "string.quoted.other.julia",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.julia"
						}
					},
					"patterns": [
						{
							"include": "#string_escaped_char"
						}
					]
				},
				{
					"begin": "(sql)(\"\"\")",
					"beginCaptures": {
						"1": {
							"name": "support.function.macro.julia"
						},
						"2": {
							"name": "punctuation.definition.string.begin.julia"
						}
					},
					"end": "\"\"\"",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.julia"
						}
					},
					"name": "embed.sql.julia",
					"contentName": "meta.embedded.inline.sql",
					"patterns": [
						{
							"include": "source.sql"
						},
						{
							"include": "#string_dollar_sign_interpolate"
						}
					]
				},
				{
					"begin": "var\"\"\"",
					"end": "\"\"\"",
					"name": "constant.other.symbol.julia",
					"patterns": [
						{
							"include": "#string_escaped_char"
						}
					]
				},
				{
					"begin": "var\"",
					"end": "\"",
					"name": "constant.other.symbol.julia",
					"patterns": [
						{
							"include": "#string_escaped_char"
						}
					]
				},
				{
					"begin": "^\\s?(doc)?(\"\"\")\\s?$",
					"beginCaptures": {
						"1": {
							"name": "support.function.macro.julia"
						},
						"2": {
							"name": "punctuation.definition.string.begin.julia"
						}
					},
					"end": "(\"\"\")",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.string.end.julia"
						}
					},
					"name": "string.docstring.julia",
					"comment": "This only matches docstrings that start and end with triple quotes on\ntheir own line in the void",
					"patterns": [
						{
							"include": "#string_escaped_char"
						},
						{
							"include": "#string_dollar_sign_interpolate"
						}
					]
				},
				{
					"begin": "'",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.julia"
						}
					},
					"end": "'(?!')",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.julia"
						}
					},
					"name": "string.quoted.single.julia",
					"patterns": [
						{
							"include": "#string_escaped_char"
						}
					]
				},
				{
					"begin": "\"\"\"",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.multiline.begin.julia"
						}
					},
					"end": "\"\"\"",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.multiline.end.julia"
						}
					},
					"name": "string.quoted.triple.double.julia",
					"comment": "multi-line string with triple double quotes",
					"patterns": [
						{
							"include": "#string_escaped_char"
						},
						{
							"include": "#string_dollar_sign_interpolate"
						}
					]
				},
				{
					"name": "string.quoted.double.julia",
					"begin": "\"(?!\"\")",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.julia"
						}
					},
					"end": "\"",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.julia"
						}
					},
					"comment": "String with single pair of double quotes. Regex matches isolated double quote",
					"patterns": [
						{
							"include": "#string_escaped_char"
						},
						{
							"include": "#string_dollar_sign_interpolate"
						}
					]
				},
				{
					"begin": "r\"\"\"",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.regexp.begin.julia"
						}
					},
					"end": "(\"\"\")([imsx]{0,4})?",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.string.regexp.end.julia"
						},
						"2": {
							"comment": "I took this scope name from python regex grammar",
							"name": "keyword.other.option-toggle.regexp.julia"
						}
					},
					"name": "string.regexp.julia",
					"patterns": [
						{
							"include": "#string_escaped_char"
						}
					]
				},
				{
					"begin": "r\"",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.regexp.begin.julia"
						}
					},
					"end": "(\")([imsx]{0,4})?",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.string.regexp.end.julia"
						},
						"2": {
							"comment": "I took this scope name from python regex grammar",
							"name": "keyword.other.option-toggle.regexp.julia"
						}
					},
					"name": "string.regexp.julia",
					"patterns": [
						{
							"include": "#string_escaped_char"
						}
					]
				},
				{
					"begin": "(?<!\")((?:[[:alpha:]_\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{So}←-⇿])(?:[[:word:]_!\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{Mn}\u0001-¡]|[^\\P{Mc}\u0001-¡]|[^\\P{Nd}\u0001-¡]|[^\\P{Pc}\u0001-¡]|[^\\P{Sk}\u0001-¡]|[^\\P{Me}\u0001-¡]|[^\\P{No}\u0001-¡]|[′-‷⁗]|[^\\P{So}←-⇿])*)\"\"\"",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.julia"
						},
						"1": {
							"name": "support.function.macro.julia"
						}
					},
					"end": "(\"\"\")((?:[[:alpha:]_\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{So}←-⇿])(?:[[:word:]_!\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{Mn}\u0001-¡]|[^\\P{Mc}\u0001-¡]|[^\\P{Nd}\u0001-¡]|[^\\P{Pc}\u0001-¡]|[^\\P{Sk}\u0001-¡]|[^\\P{Me}\u0001-¡]|[^\\P{No}\u0001-¡]|[′-‷⁗]|[^\\P{So}←-⇿])*)?",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.string.end.julia"
						},
						"2": {
							"name": "support.function.macro.julia"
						}
					},
					"name": "string.quoted.other.julia",
					"patterns": [
						{
							"include": "#string_escaped_char"
						}
					]
				},
				{
					"begin": "(?<!\")((?:[[:alpha:]_\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{So}←-⇿])(?:[[:word:]_!\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{Mn}\u0001-¡]|[^\\P{Mc}\u0001-¡]|[^\\P{Nd}\u0001-¡]|[^\\P{Pc}\u0001-¡]|[^\\P{Sk}\u0001-¡]|[^\\P{Me}\u0001-¡]|[^\\P{No}\u0001-¡]|[′-‷⁗]|[^\\P{So}←-⇿])*)\"",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.julia"
						},
						"1": {
							"name": "support.function.macro.julia"
						}
					},
					"end": "(?<![^\\\\]\\\\)(\")((?:[[:alpha:]_\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{So}←-⇿])(?:[[:word:]_!\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{Mn}\u0001-¡]|[^\\P{Mc}\u0001-¡]|[^\\P{Nd}\u0001-¡]|[^\\P{Pc}\u0001-¡]|[^\\P{Sk}\u0001-¡]|[^\\P{Me}\u0001-¡]|[^\\P{No}\u0001-¡]|[′-‷⁗]|[^\\P{So}←-⇿])*)?",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.string.end.julia"
						},
						"2": {
							"name": "support.function.macro.julia"
						}
					},
					"name": "string.quoted.other.julia",
					"patterns": [
						{
							"include": "#string_escaped_char"
						}
					]
				},
				{
					"begin": "(?<!`)((?:[[:alpha:]_\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{So}←-⇿])(?:[[:word:]_!\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{Mn}\u0001-¡]|[^\\P{Mc}\u0001-¡]|[^\\P{Nd}\u0001-¡]|[^\\P{Pc}\u0001-¡]|[^\\P{Sk}\u0001-¡]|[^\\P{Me}\u0001-¡]|[^\\P{No}\u0001-¡]|[′-‷⁗]|[^\\P{So}←-⇿])*)?```",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.julia"
						},
						"1": {
							"name": "support.function.macro.julia"
						}
					},
					"end": "(```)((?:[[:alpha:]_\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{So}←-⇿])(?:[[:word:]_!\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{Mn}\u0001-¡]|[^\\P{Mc}\u0001-¡]|[^\\P{Nd}\u0001-¡]|[^\\P{Pc}\u0001-¡]|[^\\P{Sk}\u0001-¡]|[^\\P{Me}\u0001-¡]|[^\\P{No}\u0001-¡]|[′-‷⁗]|[^\\P{So}←-⇿])*)?",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.string.end.julia"
						},
						"2": {
							"name": "support.function.macro.julia"
						}
					},
					"name": "string.interpolated.backtick.julia",
					"patterns": [
						{
							"include": "#string_escaped_char"
						},
						{
							"include": "#string_dollar_sign_interpolate"
						}
					]
				},
				{
					"begin": "(?<!`)((?:[[:alpha:]_\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{So}←-⇿])(?:[[:word:]_!\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{Mn}\u0001-¡]|[^\\P{Mc}\u0001-¡]|[^\\P{Nd}\u0001-¡]|[^\\P{Pc}\u0001-¡]|[^\\P{Sk}\u0001-¡]|[^\\P{Me}\u0001-¡]|[^\\P{No}\u0001-¡]|[′-‷⁗]|[^\\P{So}←-⇿])*)?`",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.julia"
						},
						"1": {
							"name": "support.function.macro.julia"
						}
					},
					"end": "(?<![^\\\\]\\\\)(`)((?:[[:alpha:]_\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{So}←-⇿])(?:[[:word:]_!\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{Mn}\u0001-¡]|[^\\P{Mc}\u0001-¡]|[^\\P{Nd}\u0001-¡]|[^\\P{Pc}\u0001-¡]|[^\\P{Sk}\u0001-¡]|[^\\P{Me}\u0001-¡]|[^\\P{No}\u0001-¡]|[′-‷⁗]|[^\\P{So}←-⇿])*)?",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.string.end.julia"
						},
						"2": {
							"name": "support.function.macro.julia"
						}
					},
					"name": "string.interpolated.backtick.julia",
					"patterns": [
						{
							"include": "#string_escaped_char"
						},
						{
							"include": "#string_dollar_sign_interpolate"
						}
					]
				}
			]
		},
		"string_escaped_char": {
			"patterns": [
				{
					"match": "\\\\(\\\\|[0-3]\\d{,2}|[4-7]\\d?|x[a-fA-F0-9]{,2}|u[a-fA-F0-9]{,4}|U[a-fA-F0-9]{,8}|.)",
					"name": "constant.character.escape.julia"
				}
			]
		},
		"string_dollar_sign_interpolate": {
			"patterns": [
				{
					"match": "\\$(?:[[:alpha:]_\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{So}←-⇿]|[^\\p{^Sc}$])(?:[[:word:]_!\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{Mn}\u0001-¡]|[^\\P{Mc}\u0001-¡]|[^\\P{Nd}\u0001-¡]|[^\\P{Pc}\u0001-¡]|[^\\P{Sk}\u0001-¡]|[^\\P{Me}\u0001-¡]|[^\\P{No}\u0001-¡]|[′-‷⁗]|[^\\P{So}←-⇿]|[^\\p{^Sc}$])*",
					"name": "variable.interpolation.julia"
				},
				{
					"begin": "\\$(\\()",
					"beginCaptures": {
						"1": {
							"name": "meta.bracket.julia"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "meta.bracket.julia"
						}
					},
					"name": "variable.interpolation.julia",
					"comment": "`punctuation.section.embedded`, `constant.escape`,\n& `meta.embedded.line` were considered but appear to have even spottier\nsupport among popular syntaxes.",
					"patterns": [
						{
							"include": "#self_no_for_block"
						}
					]
				}
			]
		},
		"symbol": {
			"patterns": [
				{
					"match": "(?<![[:word:]⁺-ₜ!′∇\\)\\]\\}]):(?:(?:[[:alpha:]_\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{So}←-⇿])(?:[[:word:]_!\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{Mn}\u0001-¡]|[^\\P{Mc}\u0001-¡]|[^\\P{Nd}\u0001-¡]|[^\\P{Pc}\u0001-¡]|[^\\P{Sk}\u0001-¡]|[^\\P{Me}\u0001-¡]|[^\\P{No}\u0001-¡]|[′-‷⁗]|[^\\P{So}←-⇿])*)(?!(?:[[:word:]_!\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{Mn}\u0001-¡]|[^\\P{Mc}\u0001-¡]|[^\\P{Nd}\u0001-¡]|[^\\P{Pc}\u0001-¡]|[^\\P{Sk}\u0001-¡]|[^\\P{Me}\u0001-¡]|[^\\P{No}\u0001-¡]|[′-‷⁗]|[^\\P{So}←-⇿]))(?![\"`])",
					"name": "constant.other.symbol.julia",
					"comment": "This is string.quoted.symbol.julia in tpoisot's package"
				}
			]
		},
		"type_decl": {
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "entity.name.type.julia"
						},
						"2": {
							"name": "entity.other.inherited-class.julia"
						},
						"3": {
							"name": "punctuation.separator.inheritance.julia"
						}
					},
					"match": "(?>!:_)(?:struct|mutable\\s+struct|abstract\\s+type|primitive\\s+type)\\s+((?:[[:alpha:]_\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{So}←-⇿])(?:[[:word:]_!\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{Mn}\u0001-¡]|[^\\P{Mc}\u0001-¡]|[^\\P{Nd}\u0001-¡]|[^\\P{Pc}\u0001-¡]|[^\\P{Sk}\u0001-¡]|[^\\P{Me}\u0001-¡]|[^\\P{No}\u0001-¡]|[′-‷⁗]|[^\\P{So}←-⇿])*)(\\s*(<:)\\s*(?:[[:alpha:]_\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{So}←-⇿])(?:[[:word:]_!\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}\\p{Sc}⅀-⅄∿⊾⊿⊤⊥∂∅-∇∎∏∐∑∞∟∫-∳⋀-⋃◸-◿♯⟘⟙⟀⟁⦰-⦴⨀-⨆⨉-⨖⨛⨜𝛁𝛛𝛻𝜕𝜵𝝏𝝯𝞉𝞩𝟃ⁱ-⁾₁-₎∠-∢⦛-⦯℘℮゛-゜𝟎-𝟡]|[^\\P{Mn}\u0001-¡]|[^\\P{Mc}\u0001-¡]|[^\\P{Nd}\u0001-¡]|[^\\P{Pc}\u0001-¡]|[^\\P{Sk}\u0001-¡]|[^\\P{Me}\u0001-¡]|[^\\P{No}\u0001-¡]|[′-‷⁗]|[^\\P{So}←-⇿])*(?:{.*})?)?",
					"name": "meta.type.julia"
				}
			]
		},
		"self_no_for_block": {
			"comment": "Same as $self, but does not contain #for_block. 'outer' is not valid in some contexts (e.g. generators, comprehensions, indexing), so use this when matching those in begin/end patterns. Keep this up-to-date with $self!",
			"patterns": [
				{
					"include": "#operator"
				},
				{
					"include": "#array"
				},
				{
					"include": "#string"
				},
				{
					"include": "#parentheses"
				},
				{
					"include": "#bracket"
				},
				{
					"include": "#function_decl"
				},
				{
					"include": "#function_call"
				},
				{
					"include": "#keyword"
				},
				{
					"include": "#number"
				},
				{
					"include": "#comment"
				},
				{
					"include": "#type_decl"
				},
				{
					"include": "#symbol"
				},
				{
					"include": "#punctuation"
				}
			]
		},
		"punctuation": {
			"patterns": [
				{
					"match": ",",
					"name": "punctuation.separator.comma.julia"
				},
				{
					"match": ";",
					"name": "punctuation.separator.semicolon.julia"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/latex/.vscodeignore]---
Location: vscode-main/extensions/latex/.vscodeignore

```text
cgmanifest.json
build/**
```

--------------------------------------------------------------------------------

---[FILE: extensions/latex/cgmanifest.json]---
Location: vscode-main/extensions/latex/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "jlelong/vscode-latex-basics",
					"repositoryUrl": "https://github.com/jlelong/vscode-latex-basics",
					"commitHash": "f40116471b3b479082937850c822a27208d6b054"
				}
			},
			"license": "MIT",
			"version": "1.15.0",
			"description": "The files in syntaxes/ were originally part of https://github.com/James-Yu/LaTeX-Workshop. They have been extracted in the hope that they can useful outside of the LaTeX-Workshop extension.",
			"licenseDetail": [
				"Copyright (c) vscode-latex-basics authors",
				"",
				"If not otherwise specified (see below), files in this repository fall under the MIT License",
				"",
				"",
				"The file syntaxes/LaTeX.tmLanguage.json is based on https://github.com/textmate/latex.tmbundle/blob/master/Syntaxes/LaTeX.plist",
				"but has been largely modified. The original file falls under the following license",
				"",
				"Permission to copy, use, modify, sell and distribute this",
				"software is granted. This software is provided \"as is\" without",
				"express or implied warranty, and with no claim as to its",
				"suitability for any purpose.",
				"",
				"The file syntaxes/markdown-latex-combined.tmLanguage.json is generated from the Markdown grammar",
				"included in VSCode and falls under the license described in markdown-latex-combined-license.txt.",
				"",
				"The file syntaxes/cpp-grammar-bailout.tmLanguage.json is generated from https://github.com/jeff-hykin/better-cpp-syntax",
				"and falls under the license described in cpp-bailout-license.txt."
			]
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/latex/cpp-bailout-license.txt]---
Location: vscode-main/extensions/latex/cpp-bailout-license.txt

```text
MIT License

Copyright (c) 2019 Jeff Hykin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

--------------------------------------------------------------------------------

---[FILE: extensions/latex/latex-cpp-embedded-language-configuration.json]---
Location: vscode-main/extensions/latex/latex-cpp-embedded-language-configuration.json

```json
{
	"comments": {
		"lineComment": "//",
		"blockComment": ["/*", "*/"]
	},
	"brackets": [
		["{", "}"],
		["[", "]"],
		["(", ")"]
	],
	"autoClosingPairs": [
		{ "open": "[", "close": "]" },
		{ "open": "{", "close": "}" },
		{ "open": "(", "close": ")" },
		{ "open": "'", "close": "'", "notIn": ["string", "comment"] },
		{ "open": "\"", "close": "\"", "notIn": ["string"] }
	],
	"surroundingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["\"", "\""],
		["'", "'"],
		["<", ">"]
	],
	"wordPattern": "(-?\\d*\\.\\d\\w*)|([^\\`\\~\\!\\@\\#\\%\\^\\&\\*\\(\\)\\-\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\'\\\"\\,\\.\\<\\>\\/\\?\\s]+)",
	"folding": {
		"markers": {
			"start": "^\\s*#pragma\\s+region\\b",
			"end": "^\\s*#pragma\\s+endregion\\b"
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/latex/latex-language-configuration.json]---
Location: vscode-main/extensions/latex/latex-language-configuration.json

```json
{
	"comments": {
		"lineComment": "%"
	},
	"brackets": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["[", ")"],
		["(", "]"],
		["\\left(", "\\right)"],
		["\\left(", "\\right."],
		["\\left.", "\\right)"],
		["\\left[", "\\right]"],
		["\\left[", "\\right."],
		["\\left.", "\\right]"],
		["\\left\\{", "\\right\\}"],
		["\\left\\{", "\\right."],
		["\\left.", "\\right\\}"],
		["\\left<", "\\right>"],
		["\\bigl(", "\\bigr)"],
		["\\bigl[", "\\bigr]"],
		["\\bigl\\{", "\\bigr\\}"],
		["\\Bigl(", "\\Bigr)"],
		["\\Bigl[", "\\Bigr]"],
		["\\Bigl\\{", "\\Bigr\\}"],
		["\\biggl(", "\\biggr)"],
		["\\biggl[", "\\biggr]"],
		["\\biggl\\{", "\\biggr\\}"],
		["\\Biggl(", "\\Biggr)"],
		["\\Biggl[", "\\Biggr]"],
		["\\Biggl\\{", "\\Biggr\\}"],
		["\\langle", "\\rangle"],
		["\\lvert", "\\rvert"],
		["\\lVert", "\\rVert"],
		["\\left|", "\\right|"],
		["\\left\\vert", "\\right\\vert"],
		["\\left\\|", "\\right\\|"],
		["\\left\\Vert", "\\right\\Vert"],
		["\\left\\langle", "\\right\\rangle"],
		["\\left\\lvert", "\\right\\rvert"],
		["\\left\\lVert", "\\right\\rVert"],
		["\\bigl\\langle", "\\bigr\\rangle"],
		["\\bigl|", "\\bigr|"],
		["\\bigl\\vert", "\\bigr\\vert"],
		["\\bigl\\lvert", "\\bigr\\rvert"],
		["\\bigl\\|", "\\bigr\\|"],
		["\\bigl\\lVert", "\\bigr\\rVert"],
		["\\bigl\\Vert", "\\bigr\\Vert"],
		["\\Bigl\\langle", "\\Bigr\\rangle"],
		["\\Bigl|", "\\Bigr|"],
		["\\Bigl\\lvert", "\\Bigr\\rvert"],
		["\\Bigl\\vert", "\\Bigr\\vert"],
		["\\Bigl\\|", "\\Bigr\\|"],
		["\\Bigl\\lVert", "\\Bigr\\rVert"],
		["\\Bigl\\Vert", "\\Bigr\\Vert"],
		["\\biggl\\langle", "\\biggr\\rangle"],
		["\\biggl|", "\\biggr|"],
		["\\biggl\\lvert", "\\biggr\\rvert"],
		["\\biggl\\vert", "\\biggr\\vert"],
		["\\biggl\\|", "\\biggr\\|"],
		["\\biggl\\lVert", "\\biggr\\rVert"],
		["\\biggl\\Vert", "\\biggr\\Vert"],
		["\\Biggl\\langle", "\\Biggr\\rangle"],
		["\\Biggl|", "\\Biggr|"],
		["\\Biggl\\lvert", "\\Biggr\\rvert"],
		["\\Biggl\\vert", "\\Biggr\\vert"],
		["\\Biggl\\|", "\\Biggr\\|"],
		["\\Biggl\\lVert", "\\Biggr\\rVert"],
		["\\Biggl\\Vert", "\\Biggr\\Vert"]
	],
	"autoClosingPairs": [
		["\\left(", "\\right)"],
		["\\left[", "\\right]"],
		["\\left\\{", "\\right\\}"],
		["\\bigl(", "\\bigr)"],
		["\\bigl[", "\\bigr]"],
		["\\bigl\\{", "\\bigr\\}"],
		["\\Bigl(", "\\Bigr)"],
		["\\Bigl[", "\\Bigr]"],
		["\\Bigl\\{", "\\Bigr\\}"],
		["\\biggl(", "\\biggr)"],
		["\\biggl[", "\\biggr]"],
		["\\biggl\\{", "\\biggr\\}"],
		["\\Biggl(", "\\Biggr)"],
		["\\Biggl[", "\\Biggr]"],
		["\\Biggl\\{", "\\Biggr\\}"],
		["\\(", "\\)"],
		["\\[", "\\]"],
		["\\{", "\\}"],
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["`", "'"]
	],
	"surroundingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["\"", "\""],
		["'", "'"],
		["`", "'"],
		["$", "$"]
	],
	"indentationRules": {
		"increaseIndentPattern": "\\\\begin{(?!document)([^}]*)}(?!.*\\\\end{\\1})",
		"decreaseIndentPattern": "^\\s*\\\\end{(?!document)"
	},
	"folding": {
		"markers": {
			"start": "^\\s*%?\\s*(region|\\\\begingroup)\\b",
			"end": "^\\s*%?\\s*(endregion|\\\\endgroup)\\b"
		}
	},
	"autoCloseBefore": ";:.,={}])>\\` \n\t$",
	"wordPattern": {
		"pattern": "(\\p{Alphabetic}|\\p{Number}|\\p{Nonspacing_Mark}){1,}",
		"flags": "u"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/latex/markdown-latex-combined-language-configuration.json]---
Location: vscode-main/extensions/latex/markdown-latex-combined-language-configuration.json

```json
{
	"comments": {
		"blockComment": [
			"<!--",
			"-->"
		]
	},
	"brackets": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["[", ")"],
		["(", "]"],
		["\\left(", "\\right)"],
		["\\left(", "\\right."],
		["\\left.", "\\right)"],
		["\\left[", "\\right]"],
		["\\left[", "\\right."],
		["\\left.", "\\right]"],
		["\\left\\{", "\\right\\}"],
		["\\left\\{", "\\right."],
		["\\left.", "\\right\\}"],
		["\\left<", "\\right>"],
		["\\bigl(", "\\bigr)"],
		["\\bigl[", "\\bigr]"],
		["\\bigl\\{", "\\bigr\\}"],
		["\\Bigl(", "\\Bigr)"],
		["\\Bigl[", "\\Bigr]"],
		["\\Bigl\\{", "\\Bigr\\}"],
		["\\biggl(", "\\biggr)"],
		["\\biggl[", "\\biggr]"],
		["\\biggl\\{", "\\biggr\\}"],
		["\\Biggl(", "\\Biggr)"],
		["\\Biggl[", "\\Biggr]"],
		["\\Biggl\\{", "\\Biggr\\}"],
		["\\langle", "\\rangle"],
		["\\lvert", "\\rvert"],
		["\\lVert", "\\rVert"],
		["\\left|", "\\right|"],
		["\\left\\vert", "\\right\\vert"],
		["\\left\\|", "\\right\\|"],
		["\\left\\Vert", "\\right\\Vert"],
		["\\left\\langle", "\\right\\rangle"],
		["\\left\\lvert", "\\right\\rvert"],
		["\\left\\lVert", "\\right\\rVert"],
		["\\bigl\\langle", "\\bigr\\rangle"],
		["\\bigl|", "\\bigr|"],
		["\\bigl\\vert", "\\bigr\\vert"],
		["\\bigl\\lvert", "\\bigr\\rvert"],
		["\\bigl\\|", "\\bigr\\|"],
		["\\bigl\\lVert", "\\bigr\\rVert"],
		["\\bigl\\Vert", "\\bigr\\Vert"],
		["\\Bigl\\langle", "\\Bigr\\rangle"],
		["\\Bigl|", "\\Bigr|"],
		["\\Bigl\\lvert", "\\Bigr\\rvert"],
		["\\Bigl\\vert", "\\Bigr\\vert"],
		["\\Bigl\\|", "\\Bigr\\|"],
		["\\Bigl\\lVert", "\\Bigr\\rVert"],
		["\\Bigl\\Vert", "\\Bigr\\Vert"],
		["\\biggl\\langle", "\\biggr\\rangle"],
		["\\biggl|", "\\biggr|"],
		["\\biggl\\lvert", "\\biggr\\rvert"],
		["\\biggl\\vert", "\\biggr\\vert"],
		["\\biggl\\|", "\\biggr\\|"],
		["\\biggl\\lVert", "\\biggr\\rVert"],
		["\\biggl\\Vert", "\\biggr\\Vert"],
		["\\Biggl\\langle", "\\Biggr\\rangle"],
		["\\Biggl|", "\\Biggr|"],
		["\\Biggl\\lvert", "\\Biggr\\rvert"],
		["\\Biggl\\vert", "\\Biggr\\vert"],
		["\\Biggl\\|", "\\Biggr\\|"],
		["\\Biggl\\lVert", "\\Biggr\\rVert"],
		["\\Biggl\\Vert", "\\Biggr\\Vert"]
	],
	"autoClosingPairs": [
		["\\left(", "\\right)"],
		["\\left[", "\\right]"],
		["\\left\\{", "\\right\\}"],
		["\\bigl(", "\\bigr)"],
		["\\bigl[", "\\bigr]"],
		["\\bigl\\{", "\\bigr\\}"],
		["\\Bigl(", "\\Bigr)"],
		["\\Bigl[", "\\Bigr]"],
		["\\Bigl\\{", "\\Bigr\\}"],
		["\\biggl(", "\\biggr)"],
		["\\biggl[", "\\biggr]"],
		["\\biggl\\{", "\\biggr\\}"],
		["\\Biggl(", "\\Biggr)"],
		["\\Biggl[", "\\Biggr]"],
		["\\Biggl\\{", "\\Biggr\\}"],
		["\\(", "\\)"],
		["\\[", "\\]"],
		["\\{", "\\}"],
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["`", "'"]
	],
	"surroundingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["\"", "\""],
		["'", "'"],
		["$", "$"],
		["`", "`"],
		["_", "_"],
		["*", "*"]
	],
	"indentationRules": {
		"increaseIndentPattern": "\\\\begin{(?!document)([^}]*)}(?!.*\\\\end{\\1})",
		"decreaseIndentPattern": "^\\s*\\\\end{(?!document)"
	},
	"folding": {
		"offSide": true,
		"markers": {
			"start": "^\\s*<!--\\s*#?region\\b.*-->",
			"end": "^\\s*<!--\\s*#?endregion\\b.*-->"
		}
	},
	"autoCloseBefore": ";:.,={}])>\\` \n\t$",
	"wordPattern": {
		"pattern": "([*_]{1,2})?(\\p{Alphabetic}|\\p{Number}|\\p{Nonspacing_Mark})(((\\p{Alphabetic}|\\p{Number}|\\p{Nonspacing_Mark})|[_])?(\\p{Alphabetic}|\\p{Number}|\\p{Nonspacing_Mark}))*\\1",
		"flags": "u"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/latex/markdown-latex-combined-license.txt]---
Location: vscode-main/extensions/latex/markdown-latex-combined-license.txt

```text
The MIT License (MIT)

Copyright (c) Microsoft 2018

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

--------------------------------------------------------------------------------

---[FILE: extensions/latex/package.json]---
Location: vscode-main/extensions/latex/package.json

```json
{
  "name": "latex",
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
        "id": "tex",
        "aliases": [
          "TeX",
          "tex"
        ],
        "extensions": [
          ".sty",
          ".cls",
          ".bbx",
          ".cbx"
        ],
        "configuration": "latex-language-configuration.json"
      },
      {
        "id": "latex",
        "aliases": [
          "LaTeX",
          "latex"
        ],
        "extensions": [
          ".tex",
          ".ltx",
          ".ctx"
        ],
        "configuration": "latex-language-configuration.json"
      },
      {
        "id": "bibtex",
        "aliases": [
          "BibTeX",
          "bibtex"
        ],
        "extensions": [
          ".bib"
        ]
      },
      {
        "id": "cpp_embedded_latex",
        "configuration": "latex-cpp-embedded-language-configuration.json",
        "aliases": []
      },
      {
        "id": "markdown_latex_combined",
        "configuration": "markdown-latex-combined-language-configuration.json",
        "aliases": []
      }
    ],
    "grammars": [
      {
        "language": "tex",
        "scopeName": "text.tex",
        "path": "./syntaxes/TeX.tmLanguage.json",
        "unbalancedBracketScopes": [
          "keyword.control.ifnextchar.tex",
          "punctuation.math.operator.tex"
        ]
      },
      {
        "language": "latex",
        "scopeName": "text.tex.latex",
        "path": "./syntaxes/LaTeX.tmLanguage.json",
        "unbalancedBracketScopes": [
          "keyword.control.ifnextchar.tex",
          "punctuation.math.operator.tex"
        ],
        "embeddedLanguages": {
          "source.cpp": "cpp_embedded_latex",
          "source.css": "css",
          "text.html": "html",
          "source.java": "java",
          "source.js": "javascript",
          "source.julia": "julia",
          "source.lua": "lua",
          "source.python": "python",
          "source.ruby": "ruby",
          "source.ts": "typescript",
          "text.xml": "xml",
          "source.yaml": "yaml",
          "meta.embedded.markdown_latex_combined": "markdown_latex_combined"
        }
      },
      {
        "language": "bibtex",
        "scopeName": "text.bibtex",
        "path": "./syntaxes/Bibtex.tmLanguage.json"
      },
      {
        "language": "markdown_latex_combined",
        "scopeName": "text.tex.markdown_latex_combined",
        "path": "./syntaxes/markdown-latex-combined.tmLanguage.json"
      },
      {
        "language": "cpp_embedded_latex",
        "scopeName": "source.cpp.embedded.latex",
        "path": "./syntaxes/cpp-grammar-bailout.tmLanguage.json"
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

---[FILE: extensions/latex/package.nls.json]---
Location: vscode-main/extensions/latex/package.nls.json

```json
{
	"displayName": "LaTeX Language Basics",
	"description": "Provides syntax highlighting and bracket matching for TeX, LaTeX and BibTeX."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/latex/build/update-grammars.js]---
Location: vscode-main/extensions/latex/build/update-grammars.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

var updateGrammar = require('vscode-grammar-updater');

updateGrammar.update('jlelong/vscode-latex-basics', 'syntaxes/Bibtex.tmLanguage.json', 'syntaxes/Bibtex.tmLanguage.json', undefined, 'main');
updateGrammar.update('jlelong/vscode-latex-basics', 'syntaxes/LaTeX.tmLanguage.json', 'syntaxes/LaTeX.tmLanguage.json', undefined, 'main');
updateGrammar.update('jlelong/vscode-latex-basics', 'syntaxes/TeX.tmLanguage.json', 'syntaxes/TeX.tmLanguage.json', undefined, 'main');
updateGrammar.update('jlelong/vscode-latex-basics', 'syntaxes/cpp-grammar-bailout.tmLanguage.json', 'syntaxes/cpp-grammar-bailout.tmLanguage.json', undefined, 'main');
updateGrammar.update('jlelong/vscode-latex-basics', 'syntaxes/markdown-latex-combined.tmLanguage.json', 'syntaxes/markdown-latex-combined.tmLanguage.json', undefined, 'main');
```

--------------------------------------------------------------------------------

---[FILE: extensions/latex/syntaxes/Bibtex.tmLanguage.json]---
Location: vscode-main/extensions/latex/syntaxes/Bibtex.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/jlelong/vscode-latex-basics/blob/master/syntaxes/Bibtex.tmLanguage.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/jlelong/vscode-latex-basics/commit/0fcf9283828cab2aa611072f54feb1e7d501c2b4",
	"name": "BibTeX",
	"scopeName": "text.bibtex",
	"comment": "Grammar based on description from https://github.com/aclements/biblib",
	"patterns": [
		{
			"match": "@(?i:comment)(?=[\\s{(])",
			"captures": {
				"0": {
					"name": "punctuation.definition.comment.bibtex"
				}
			},
			"name": "comment.block.at-sign.bibtex"
		},
		{
			"include": "#preamble"
		},
		{
			"include": "#string"
		},
		{
			"include": "#entry"
		},
		{
			"begin": "[^@\\n]",
			"end": "(?=@)",
			"name": "comment.block.bibtex"
		}
	],
	"repository": {
		"preamble": {
			"patterns": [
				{
					"begin": "((@)(?i:preamble))\\s*(\\{)\\s*",
					"beginCaptures": {
						"1": {
							"name": "keyword.other.preamble.bibtex"
						},
						"2": {
							"name": "punctuation.definition.keyword.bibtex"
						},
						"3": {
							"name": "punctuation.section.preamble.begin.bibtex"
						}
					},
					"end": "\\}",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.preamble.end.bibtex"
						}
					},
					"name": "meta.preamble.braces.bibtex",
					"patterns": [
						{
							"include": "#field_value"
						}
					]
				},
				{
					"begin": "((@)(?i:preamble))\\s*(\\()\\s*",
					"beginCaptures": {
						"1": {
							"name": "keyword.other.preamble.bibtex"
						},
						"2": {
							"name": "punctuation.definition.keyword.bibtex"
						},
						"3": {
							"name": "punctuation.section.preamble.begin.bibtex"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.preamble.end.bibtex"
						}
					},
					"name": "meta.preamble.parenthesis.bibtex",
					"patterns": [
						{
							"include": "#field_value"
						}
					]
				}
			]
		},
		"string": {
			"patterns": [
				{
					"begin": "((@)(?i:string))\\s*(\\{)\\s*([a-zA-Z!$&*+\\-./:;<>?@\\[\\\\\\]^_`|~][a-zA-Z0-9!$&*+\\-./:;<>?@\\[\\\\\\]^_`|~]*)",
					"beginCaptures": {
						"1": {
							"name": "keyword.other.string-constant.bibtex"
						},
						"2": {
							"name": "punctuation.definition.keyword.bibtex"
						},
						"3": {
							"name": "punctuation.section.string-constant.begin.bibtex"
						},
						"4": {
							"name": "variable.other.bibtex"
						}
					},
					"end": "\\}",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.string-constant.end.bibtex"
						}
					},
					"name": "meta.string-constant.braces.bibtex",
					"patterns": [
						{
							"include": "#field_value"
						}
					]
				},
				{
					"begin": "((@)(?i:string))\\s*(\\()\\s*([a-zA-Z!$&*+\\-./:;<>?@\\[\\\\\\]^_`|~][a-zA-Z0-9!$&*+\\-./:;<>?@\\[\\\\\\]^_`|~]*)",
					"beginCaptures": {
						"1": {
							"name": "keyword.other.string-constant.bibtex"
						},
						"2": {
							"name": "punctuation.definition.keyword.bibtex"
						},
						"3": {
							"name": "punctuation.section.string-constant.begin.bibtex"
						},
						"4": {
							"name": "variable.other.bibtex"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.string-constant.end.bibtex"
						}
					},
					"name": "meta.string-constant.parenthesis.bibtex",
					"patterns": [
						{
							"include": "#field_value"
						}
					]
				}
			]
		},
		"entry": {
			"patterns": [
				{
					"begin": "((@)[a-zA-Z!$&*+\\-./:;<>?@\\[\\\\\\]^_`|~][a-zA-Z0-9!$&*+\\-./:;<>?@\\[\\\\\\]^_`|~]*)\\s*(\\{)\\s*([^\\s,}]*)",
					"beginCaptures": {
						"1": {
							"name": "keyword.other.entry-type.bibtex"
						},
						"2": {
							"name": "punctuation.definition.keyword.bibtex"
						},
						"3": {
							"name": "punctuation.section.entry.begin.bibtex"
						},
						"4": {
							"name": "entity.name.type.entry-key.bibtex"
						}
					},
					"end": "\\}",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.entry.end.bibtex"
						}
					},
					"name": "meta.entry.braces.bibtex",
					"patterns": [
						{
							"begin": "([a-zA-Z!$&*+\\-./:;<>?@\\[\\\\\\]^_`|~][a-zA-Z0-9!$&*+\\-./:;<>?@\\[\\\\\\]^_`|~]*)\\s*(\\=)",
							"beginCaptures": {
								"1": {
									"name": "support.function.key.bibtex"
								},
								"2": {
									"name": "punctuation.separator.key-value.bibtex"
								}
							},
							"end": "(?=[,}])",
							"name": "meta.key-assignment.bibtex",
							"patterns": [
								{
									"include": "#field_value"
								}
							]
						}
					]
				},
				{
					"begin": "((@)[a-zA-Z!$&*+\\-./:;<>?@\\[\\\\\\]^_`|~][a-zA-Z0-9!$&*+\\-./:;<>?@\\[\\\\\\]^_`|~]*)\\s*(\\()\\s*([^\\s,]*)",
					"beginCaptures": {
						"1": {
							"name": "keyword.other.entry-type.bibtex"
						},
						"2": {
							"name": "punctuation.definition.keyword.bibtex"
						},
						"3": {
							"name": "punctuation.section.entry.begin.bibtex"
						},
						"4": {
							"name": "entity.name.type.entry-key.bibtex"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.entry.end.bibtex"
						}
					},
					"name": "meta.entry.parenthesis.bibtex",
					"patterns": [
						{
							"begin": "([a-zA-Z!$&*+\\-./:;<>?@\\[\\\\\\]^_`|~][a-zA-Z0-9!$&*+\\-./:;<>?@\\[\\\\\\]^_`|~]*)\\s*(\\=)",
							"beginCaptures": {
								"1": {
									"name": "support.function.key.bibtex"
								},
								"2": {
									"name": "punctuation.separator.key-value.bibtex"
								}
							},
							"end": "(?=[,)])",
							"name": "meta.key-assignment.bibtex",
							"patterns": [
								{
									"include": "#field_value"
								}
							]
						}
					]
				}
			]
		},
		"field_value": {
			"patterns": [
				{
					"include": "#string_content"
				},
				{
					"include": "#integer"
				},
				{
					"include": "#string_var"
				},
				{
					"match": "#",
					"name": "keyword.operator.bibtex"
				}
			]
		},
		"integer": {
			"captures": {
				"1": {
					"name": "constant.numeric.bibtex"
				}
			},
			"match": "\\s*(\\d+)\\s*"
		},
		"nested_braces": {
			"begin": "\\{",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.group.begin.bibtex"
				}
			},
			"end": "\\}",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.group.end.bibtex"
				}
			},
			"patterns": [
				{
					"include": "#nested_braces"
				}
			]
		},
		"string_content": {
			"patterns": [
				{
					"begin": "\\{",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.bibtex"
						}
					},
					"end": "\\}",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.bibtex"
						}
					},
					"patterns": [
						{
							"include": "#nested_braces"
						}
					]
				},
				{
					"begin": "\"",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.bibtex"
						}
					},
					"end": "\"",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.bibtex"
						}
					},
					"patterns": [
						{
							"include": "#nested_braces"
						}
					]
				}
			]
		},
		"string_var": {
			"captures": {
				"0": {
					"name": "support.variable.bibtex"
				}
			},
			"match": "[a-zA-Z!$&*+\\-./:;<>?@\\[\\\\\\]^_`|~][a-zA-Z0-9!$&*+\\-./:;<>?@\\[\\\\\\]^_`|~]*"
		}
	}
}
```

--------------------------------------------------------------------------------

````
