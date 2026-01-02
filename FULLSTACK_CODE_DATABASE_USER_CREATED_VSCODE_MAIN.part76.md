---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 76
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 76 of 552)

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

---[FILE: extensions/search-result/syntaxes/searchResult.tmLanguage.json]---
Location: vscode-main/extensions/search-result/syntaxes/searchResult.tmLanguage.json

```json
{
  "information_for_contributors": "This file is generated from ./generateTMLanguage.js.",
  "name": "Search Results",
  "scopeName": "text.searchResult",
  "patterns": [
    {
      "begin": "^(# Query): ",
      "end": "\n",
      "name": "meta.header.search keyword.operator.word.search",
      "beginCaptures": {
        "1": {
          "name": "entity.other.attribute-name"
        }
      },
      "patterns": [
        {
          "match": "(\\\\n)|(\\\\\\\\)",
          "name": "entity.other.attribute-value string.unquoted constant.character.escape"
        },
        {
          "match": "\\\\.|\\\\$",
          "name": "entity.other.attribute-value string.unquoted invalid.illegal"
        },
        {
          "match": "[^\\\\\\\n]+",
          "name": "entity.other.attribute-value string.unquoted"
        }
      ]
    },
    {
      "begin": "^(# Flags): ",
      "end": "\n",
      "name": "meta.header.search keyword.operator.word.search",
      "beginCaptures": {
        "1": {
          "name": "entity.other.attribute-name"
        }
      },
      "patterns": [
        {
          "match": "(RegExp|CaseSensitive|IgnoreExcludeSettings|WordMatch)",
          "name": "entity.other.attribute-value string.unquoted keyword.other"
        },
        {
          "match": "."
        }
      ]
    },
    {
      "begin": "^(# ContextLines): ",
      "end": "\n",
      "name": "meta.header.search keyword.operator.word.search",
      "beginCaptures": {
        "1": {
          "name": "entity.other.attribute-name"
        }
      },
      "patterns": [
        {
          "match": "\\d",
          "name": "entity.other.attribute-value string.unquoted constant.numeric.integer"
        },
        {
          "match": ".",
          "name": "invalid.illegal"
        }
      ]
    },
    {
      "match": "^(# (?:Including|Excluding)): (.*)$",
      "name": "meta.header.search keyword.operator.word.search",
      "captures": {
        "1": {
          "name": "entity.other.attribute-name"
        },
        "2": {
          "name": "entity.other.attribute-value string.unquoted"
        }
      }
    },
    {
      "include": "#bat"
    },
    {
      "include": "#c"
    },
    {
      "include": "#clj"
    },
    {
      "include": "#coffee"
    },
    {
      "include": "#cpp"
    },
    {
      "include": "#cs"
    },
    {
      "include": "#cshtml"
    },
    {
      "include": "#css"
    },
    {
      "include": "#dart"
    },
    {
      "include": "#diff"
    },
    {
      "include": "#dockerfile"
    },
    {
      "include": "#fs"
    },
    {
      "include": "#go"
    },
    {
      "include": "#groovy"
    },
    {
      "include": "#h"
    },
    {
      "include": "#handlebars"
    },
    {
      "include": "#hlsl"
    },
    {
      "include": "#hpp"
    },
    {
      "include": "#html"
    },
    {
      "include": "#ini"
    },
    {
      "include": "#java"
    },
    {
      "include": "#jl"
    },
    {
      "include": "#js"
    },
    {
      "include": "#json"
    },
    {
      "include": "#jsx"
    },
    {
      "include": "#less"
    },
    {
      "include": "#log"
    },
    {
      "include": "#lua"
    },
    {
      "include": "#m"
    },
    {
      "include": "#makefile"
    },
    {
      "include": "#md"
    },
    {
      "include": "#mm"
    },
    {
      "include": "#p6"
    },
    {
      "include": "#perl"
    },
    {
      "include": "#php"
    },
    {
      "include": "#ps1"
    },
    {
      "include": "#pug"
    },
    {
      "include": "#py"
    },
    {
      "include": "#r"
    },
    {
      "include": "#rb"
    },
    {
      "include": "#rs"
    },
    {
      "include": "#scala"
    },
    {
      "include": "#scss"
    },
    {
      "include": "#sh"
    },
    {
      "include": "#sql"
    },
    {
      "include": "#swift"
    },
    {
      "include": "#ts"
    },
    {
      "include": "#tsx"
    },
    {
      "include": "#vb"
    },
    {
      "include": "#xml"
    },
    {
      "include": "#yaml"
    },
    {
      "match": "^(?!\\s)(.*?)([^\\\\\\/\\n]*)(:)$",
      "name": "meta.resultBlock.search string meta.path.search",
      "captures": {
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      }
    },
    {
      "match": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+)( ))(.*))",
      "name": "meta.resultBlock.search meta.resultLine.search",
      "captures": {
        "1": {
          "name": "constant.numeric.integer meta.resultLinePrefix.search meta.resultLinePrefix.matchLinePrefix.search"
        },
        "2": {
          "name": "meta.resultLinePrefix.lineNumber.search"
        },
        "3": {
          "name": "punctuation.separator"
        },
        "4": {
          "name": "constant.numeric.integer meta.resultLinePrefix.search meta.resultLinePrefix.contextLinePrefix.search"
        },
        "5": {
          "name": "meta.resultLinePrefix.lineNumber.search"
        }
      }
    },
    {
      "match": "⟪ [0-9]+ characters skipped ⟫",
      "name": "meta.resultBlock.search comment meta.resultLine.elision"
    }
  ],
  "repository": {
    "bat": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.bat)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.batchfile"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.batchfile"
            }
          ]
        }
      ]
    },
    "c": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.c)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.c"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.c"
            }
          ]
        }
      ]
    },
    "clj": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.clj)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.clojure"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.clojure"
            }
          ]
        }
      ]
    },
    "coffee": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.coffee)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.coffee"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.coffee"
            }
          ]
        }
      ]
    },
    "cpp": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.(?:cpp|c\\+\\+|cc|cxx|hxx|h\\+\\+|hh))(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.cpp"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.cpp"
            }
          ]
        }
      ]
    },
    "cs": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.cs)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.cs"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.cs"
            }
          ]
        }
      ]
    },
    "cshtml": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.cshtml)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "text.html.cshtml"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "text.html.cshtml"
            }
          ]
        }
      ]
    },
    "css": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.css)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.css"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.css"
            }
          ]
        }
      ]
    },
    "dart": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.dart)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.dart"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.dart"
            }
          ]
        }
      ]
    },
    "diff": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.diff)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.diff"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.diff"
            }
          ]
        }
      ]
    },
    "dockerfile": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*(?:dockerfile|Dockerfile|containerfile|Containerfile))(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.dockerfile"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.dockerfile"
            }
          ]
        }
      ]
    },
    "fs": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.fs)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.fsharp"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.fsharp"
            }
          ]
        }
      ]
    },
    "go": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.go)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.go"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.go"
            }
          ]
        }
      ]
    },
    "groovy": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.groovy)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.groovy"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.groovy"
            }
          ]
        }
      ]
    },
    "h": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.h)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.objc"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.objc"
            }
          ]
        }
      ]
    },
    "handlebars": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.(?:handlebars|hbs))(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "text.html.handlebars"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "text.html.handlebars"
            }
          ]
        }
      ]
    },
    "hlsl": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.hlsl)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.hlsl"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.hlsl"
            }
          ]
        }
      ]
    },
    "hpp": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.hpp)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.objcpp"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.objcpp"
            }
          ]
        }
      ]
    },
    "html": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.html)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "text.html.basic"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "text.html.basic"
            }
          ]
        }
      ]
    },
    "ini": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.ini)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.ini"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.ini"
            }
          ]
        }
      ]
    },
    "java": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.java)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.java"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.java"
            }
          ]
        }
      ]
    },
    "jl": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.jl)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.julia"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.julia"
            }
          ]
        }
      ]
    },
    "js": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.js)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.js"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.js"
            }
          ]
        }
      ]
    },
    "json": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.json)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.json.comments"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.json.comments"
            }
          ]
        }
      ]
    },
    "jsx": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.jsx)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.js.jsx"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.js.jsx"
            }
          ]
        }
      ]
    },
    "less": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.less)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.css.less"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.css.less"
            }
          ]
        }
      ]
    },
    "log": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.log)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "text.log"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "text.log"
            }
          ]
        }
      ]
    },
    "lua": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.lua)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.lua"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.lua"
            }
          ]
        }
      ]
    },
    "m": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.m)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.objc"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.objc"
            }
          ]
        }
      ]
    },
    "makefile": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*(?:makefile|Makefile)(?:\\..*)?)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.makefile"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.makefile"
            }
          ]
        }
      ]
    },
    "md": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.md)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "text.html.markdown"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "text.html.markdown"
            }
          ]
        }
      ]
    },
    "mm": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.mm)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.objcpp"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.objcpp"
            }
          ]
        }
      ]
    },
    "p6": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.p6)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.perl.6"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.perl.6"
            }
          ]
        }
      ]
    },
    "perl": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.(?:perl|pl|pm))(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.perl"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.perl"
            }
          ]
        }
      ]
    },
    "php": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.php)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.php"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.php"
            }
          ]
        }
      ]
    },
    "ps1": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.ps1)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.powershell"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.powershell"
            }
          ]
        }
      ]
    },
    "pug": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.pug)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "text.pug"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "text.pug"
            }
          ]
        }
      ]
    },
    "py": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.py)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.python"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.python"
            }
          ]
        }
      ]
    },
    "r": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.r)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.r"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.r"
            }
          ]
        }
      ]
    },
    "rb": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.rb)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.ruby"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.ruby"
            }
          ]
        }
      ]
    },
    "rs": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.rs)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.rust"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.rust"
            }
          ]
        }
      ]
    },
    "scala": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.scala)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.scala"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.scala"
            }
          ]
        }
      ]
    },
    "scss": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.scss)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.css.scss"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.css.scss"
            }
          ]
        }
      ]
    },
    "sh": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.sh)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.shell"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.shell"
            }
          ]
        }
      ]
    },
    "sql": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.sql)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.sql"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.sql"
            }
          ]
        }
      ]
    },
    "swift": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.swift)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.swift"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.swift"
            }
          ]
        }
      ]
    },
    "ts": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.ts)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.ts"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.ts"
            }
          ]
        }
      ]
    },
    "tsx": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.tsx)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.tsx"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.tsx"
            }
          ]
        }
      ]
    },
    "vb": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.vb)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.asp.vb.net"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.asp.vb.net"
            }
          ]
        }
      ]
    },
    "xml": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.xml)(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "text.xml"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "text.xml"
            }
          ]
        }
      ]
    },
    "yaml": {
      "name": "meta.resultBlock.search",
      "begin": "^(?!\\s)(.*?)([^\\\\\\/\\n]*\\.(?:ya?ml))(:)$",
      "end": "^(?!\\s)",
      "beginCaptures": {
        "0": {
          "name": "string meta.path.search"
        },
        "1": {
          "name": "meta.path.dirname.search"
        },
        "2": {
          "name": "meta.path.basename.search"
        },
        "3": {
          "name": "punctuation.separator"
        }
      },
      "patterns": [
        {
          "name": "meta.resultLine.search meta.resultLine.multiLine.search",
          "begin": "^  (?:\\s*)((\\d+) )",
          "while": "^  (?:\\s*)(?:((\\d+)(:))|((\\d+) ))",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "whileCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            },
            "4": {
              "name": "meta.resultLinePrefix.contextLinePrefix.search"
            },
            "5": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            }
          },
          "patterns": [
            {
              "include": "source.yaml"
            }
          ]
        },
        {
          "begin": "^  (?:\\s*)((\\d+)(:))",
          "while": "(?=not)possible",
          "name": "meta.resultLine.search meta.resultLine.singleLine.search",
          "beginCaptures": {
            "0": {
              "name": "constant.numeric.integer meta.resultLinePrefix.search"
            },
            "1": {
              "name": "meta.resultLinePrefix.matchLinePrefix.search"
            },
            "2": {
              "name": "meta.resultLinePrefix.lineNumber.search"
            },
            "3": {
              "name": "punctuation.separator"
            }
          },
          "patterns": [
            {
              "include": "source.yaml"
            }
          ]
        }
      ]
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/shaderlab/.vscodeignore]---
Location: vscode-main/extensions/shaderlab/.vscodeignore

```text
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/shaderlab/cgmanifest.json]---
Location: vscode-main/extensions/shaderlab/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "shaders-tmLanguage",
					"repositoryUrl": "https://github.com/tgjones/shaders-tmLanguage",
					"commitHash": "c72c8b39380ba5a86c58ceed053b5d965ebf38b3"
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

---[FILE: extensions/shaderlab/language-configuration.json]---
Location: vscode-main/extensions/shaderlab/language-configuration.json

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
		{ "open": "\"", "close": "\"", "notIn": ["string"] }
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

---[FILE: extensions/shaderlab/package.json]---
Location: vscode-main/extensions/shaderlab/package.json

```json
{
  "name": "shaderlab",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin tgjones/shaders-tmLanguage grammars/shaderlab.json ./syntaxes/shaderlab.tmLanguage.json"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "shaderlab",
        "extensions": [
          ".shader"
        ],
        "aliases": [
          "ShaderLab",
          "shaderlab"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "shaderlab",
        "path": "./syntaxes/shaderlab.tmLanguage.json",
        "scopeName": "source.shaderlab"
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

---[FILE: extensions/shaderlab/package.nls.json]---
Location: vscode-main/extensions/shaderlab/package.nls.json

```json
{
	"displayName": "Shaderlab Language Basics",
	"description": "Provides syntax highlighting and bracket matching in Shaderlab files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/shaderlab/syntaxes/shaderlab.tmLanguage.json]---
Location: vscode-main/extensions/shaderlab/syntaxes/shaderlab.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/tgjones/shaders-tmLanguage/blob/master/grammars/shaderlab.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/tgjones/shaders-tmLanguage/commit/c72c8b39380ba5a86c58ceed053b5d965ebf38b3",
	"name": "ShaderLab",
	"scopeName": "source.shaderlab",
	"patterns": [
		{
			"name": "comment.line.double-slash.shaderlab",
			"begin": "//",
			"end": "$"
		},
		{
			"name": "support.type.basic.shaderlab",
			"match": "\\b(?i:Range|Float|Int|Color|Vector|2D|3D|Cube|Any)\\b"
		},
		{
			"include": "#numbers"
		},
		{
			"name": "storage.type.structure.shaderlab",
			"match": "\\b(?i:Shader|Properties|SubShader|Pass|Category)\\b"
		},
		{
			"name": "support.type.propertyname.shaderlab",
			"match": "\\b(?i:Name|Tags|Fallback|CustomEditor|Cull|ZWrite|ZTest|Offset|Blend|BlendOp|ColorMask|AlphaToMask|LOD|Lighting|Stencil|Ref|ReadMask|WriteMask|Comp|CompBack|CompFront|Fail|ZFail|UsePass|GrabPass|Dependency|Material|Diffuse|Ambient|Shininess|Specular|Emission|Fog|Mode|Density|SeparateSpecular|SetTexture|Combine|ConstantColor|Matrix|AlphaTest|ColorMaterial|BindChannels|Bind)\\b"
		},
		{
			"name": "support.constant.property-value.shaderlab",
			"match": "\\b(?i:Back|Front|On|Off|[RGBA]{1,3}|AmbientAndDiffuse|Emission)\\b"
		},
		{
			"name": "support.constant.property-value.comparisonfunction.shaderlab",
			"match": "\\b(?i:Less|Greater|LEqual|GEqual|Equal|NotEqual|Always|Never)\\b"
		},
		{
			"name": "support.constant.property-value.stenciloperation.shaderlab",
			"match": "\\b(?i:Keep|Zero|Replace|IncrSat|DecrSat|Invert|IncrWrap|DecrWrap)\\b"
		},
		{
			"name": "support.constant.property-value.texturecombiners.shaderlab",
			"match": "\\b(?i:Previous|Primary|Texture|Constant|Lerp|Double|Quad|Alpha)\\b"
		},
		{
			"name": "support.constant.property-value.fog.shaderlab",
			"match": "\\b(?i:Global|Linear|Exp2|Exp)\\b"
		},
		{
			"name": "support.constant.property-value.bindchannels.shaderlab",
			"match": "\\b(?i:Vertex|Normal|Tangent|TexCoord0|TexCoord1)\\b"
		},
		{
			"name": "support.constant.property-value.blendoperations.shaderlab",
			"match": "\\b(?i:Add|Sub|RevSub|Min|Max|LogicalClear|LogicalSet|LogicalCopyInverted|LogicalCopy|LogicalNoop|LogicalInvert|LogicalAnd|LogicalNand|LogicalOr|LogicalNor|LogicalXor|LogicalEquiv|LogicalAndReverse|LogicalAndInverted|LogicalOrReverse|LogicalOrInverted)\\b"
		},
		{
			"name": "support.constant.property-value.blendfactors.shaderlab",
			"match": "\\b(?i:One|Zero|SrcColor|SrcAlpha|DstColor|DstAlpha|OneMinusSrcColor|OneMinusSrcAlpha|OneMinusDstColor|OneMinusDstAlpha)\\b"
		},
		{
			"name": "support.variable.reference.shaderlab",
			"match": "\\[([a-zA-Z_][a-zA-Z0-9_]*)\\](?!\\s*[a-zA-Z_][a-zA-Z0-9_]*\\s*\\(\")"
		},
		{
			"name": "meta.attribute.shaderlab",
			"begin": "(\\[)",
			"end": "(\\])",
			"patterns": [
				{
					"name": "support.type.attributename.shaderlab",
					"match": "\\G([a-zA-Z]+)\\b"
				},
				{
					"include": "#numbers"
				}
			]
		},
		{
			"name": "support.variable.declaration.shaderlab",
			"match": "\\b([a-zA-Z_][a-zA-Z0-9_]*)\\s*\\("
		},
		{
			"name": "meta.cgblock",
			"begin": "\\b(CGPROGRAM|CGINCLUDE)\\b",
			"beginCaptures": {
				"1": {
					"name": "keyword.other"
				}
			},
			"end": "\\b(ENDCG)\\b",
			"endCaptures": {
				"1": {
					"name": "keyword.other"
				}
			},
			"patterns": [
				{
					"include": "#hlsl-embedded"
				}
			]
		},
		{
			"name": "meta.hlslblock",
			"begin": "\\b(HLSLPROGRAM|HLSLINCLUDE)\\b",
			"beginCaptures": {
				"1": {
					"name": "keyword.other"
				}
			},
			"end": "\\b(ENDHLSL)\\b",
			"endCaptures": {
				"1": {
					"name": "keyword.other"
				}
			},
			"patterns": [
				{
					"include": "#hlsl-embedded"
				}
			]
		},
		{
			"name": "string.quoted.double.shaderlab",
			"begin": "\"",
			"end": "\""
		}
	],
	"repository": {
		"numbers": {
			"patterns": [
				{
					"name": "constant.numeric.shaderlab",
					"match": "\\b([0-9]+\\.?[0-9]*)\\b"
				}
			]
		},
		"hlsl-embedded": {
			"patterns": [
				{
					"include": "source.hlsl"
				},
				{
					"name": "storage.type.basic.shaderlab",
					"match": "\\b(fixed([1-4](x[1-4])?)?)\\b"
				},
				{
					"name": "support.variable.transformations.shaderlab",
					"match": "\\b(UNITY_MATRIX_MVP|UNITY_MATRIX_MV|UNITY_MATRIX_M|UNITY_MATRIX_V|UNITY_MATRIX_P|UNITY_MATRIX_VP|UNITY_MATRIX_T_MV|UNITY_MATRIX_I_V|UNITY_MATRIX_IT_MV|_Object2World|_World2Object|unity_ObjectToWorld|unity_WorldToObject)\\b"
				},
				{
					"name": "support.variable.camera.shaderlab",
					"match": "\\b(_WorldSpaceCameraPos|_ProjectionParams|_ScreenParams|_ZBufferParams|unity_OrthoParams|unity_CameraProjection|unity_CameraInvProjection|unity_CameraWorldClipPlanes)\\b"
				},
				{
					"name": "support.variable.time.shaderlab",
					"match": "\\b(_Time|_SinTime|_CosTime|unity_DeltaTime)\\b"
				},
				{
					"name": "support.variable.lighting.shaderlab",
					"match": "\\b(_LightColor0|_WorldSpaceLightPos0|_LightMatrix0|unity_4LightPosX0|unity_4LightPosY0|unity_4LightPosZ0|unity_4LightAtten0|unity_LightColor|_LightColor|unity_LightPosition|unity_LightAtten|unity_SpotDirection)\\b"
				},
				{
					"name": "support.variable.fog.shaderlab",
					"match": "\\b(unity_AmbientSky|unity_AmbientEquator|unity_AmbientGround|UNITY_LIGHTMODEL_AMBIENT|unity_FogColor|unity_FogParams)\\b"
				},
				{
					"name": "support.variable.various.shaderlab",
					"match": "\\b(unity_LODFade)\\b"
				},
				{
					"name": "support.variable.preprocessor.targetplatform.shaderlab",
					"match": "\\b(SHADER_API_D3D9|SHADER_API_D3D11|SHADER_API_GLCORE|SHADER_API_OPENGL|SHADER_API_GLES|SHADER_API_GLES3|SHADER_API_METAL|SHADER_API_D3D11_9X|SHADER_API_PSSL|SHADER_API_XBOXONE|SHADER_API_PSP2|SHADER_API_WIIU|SHADER_API_MOBILE|SHADER_API_GLSL)\\b"
				},
				{
					"name": "support.variable.preprocessor.targetmodel.shaderlab",
					"match": "\\b(SHADER_TARGET)\\b"
				},
				{
					"name": "support.variable.preprocessor.unityversion.shaderlab",
					"match": "\\b(UNITY_VERSION)\\b"
				},
				{
					"name": "support.variable.preprocessor.platformdifference.shaderlab",
					"match": "\\b(UNITY_BRANCH|UNITY_FLATTEN|UNITY_NO_SCREENSPACE_SHADOWS|UNITY_NO_LINEAR_COLORSPACE|UNITY_NO_RGBM|UNITY_NO_DXT5nm|UNITY_FRAMEBUFFER_FETCH_AVAILABLE|UNITY_USE_RGBA_FOR_POINT_SHADOWS|UNITY_ATTEN_CHANNEL|UNITY_HALF_TEXEL_OFFSET|UNITY_UV_STARTS_AT_TOP|UNITY_MIGHT_NOT_HAVE_DEPTH_Texture|UNITY_NEAR_CLIP_VALUE|UNITY_VPOS_TYPE|UNITY_CAN_COMPILE_TESSELLATION|UNITY_COMPILER_HLSL|UNITY_COMPILER_HLSL2GLSL|UNITY_COMPILER_CG|UNITY_REVERSED_Z)\\b"
				},
				{
					"name": "support.variable.preprocessor.texture2D.shaderlab",
					"match": "\\b(UNITY_PASS_FORWARDBASE|UNITY_PASS_FORWARDADD|UNITY_PASS_DEFERRED|UNITY_PASS_SHADOWCASTER|UNITY_PASS_PREPASSBASE|UNITY_PASS_PREPASSFINAL)\\b"
				},
				{
					"name": "support.class.structures.shaderlab",
					"match": "\\b(appdata_base|appdata_tan|appdata_full|appdata_img)\\b"
				},
				{
					"name": "support.class.surface.shaderlab",
					"match": "\\b(SurfaceOutputStandardSpecular|SurfaceOutputStandard|SurfaceOutput|Input)\\b"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/shellscript/.vscodeignore]---
Location: vscode-main/extensions/shellscript/.vscodeignore

```text
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/shellscript/cgmanifest.json]---
Location: vscode-main/extensions/shellscript/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "jeff-hykin/better-shell-syntax",
					"repositoryUrl": "https://github.com/jeff-hykin/better-shell-syntax",
					"commitHash": "35020b0bd79a90d3b262b4c13a8bb0b33adc1f45"
				}
			},
			"license": "MIT",
			"version": "1.8.7"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/shellscript/language-configuration.json]---
Location: vscode-main/extensions/shellscript/language-configuration.json

```json
{
	"comments": {
		"lineComment": "#"
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
	"folding": {
		"markers": {
			"start": "^\\s*#\\s*#?region\\b.*",
			"end": "^\\s*#\\s*#?endregion\\b.*"
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/shellscript/package.json]---
Location: vscode-main/extensions/shellscript/package.json

```json
{
  "name": "shellscript",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin jeff-hykin/better-shell-syntax autogenerated/shell.tmLanguage.json ./syntaxes/shell-unix-bash.tmLanguage.json"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "shellscript",
        "aliases": [
          "Shell Script",
          "shellscript",
          "bash",
          "fish",
          "sh",
          "zsh",
          "ksh",
          "csh"
        ],
        "extensions": [
          ".sh",
          ".bash",
          ".bashrc",
          ".bash_aliases",
          ".bash_profile",
          ".bash_login",
          ".ebuild",
          ".eclass",
          ".profile",
          ".bash_logout",
          ".xprofile",
          ".xsession",
          ".xsessionrc",
          ".Xsession",
          ".zsh",
          ".zshrc",
          ".zprofile",
          ".zlogin",
          ".zlogout",
          ".zshenv",
          ".zsh-theme",
          ".fish",
          ".ksh",
          ".csh",
          ".cshrc",
          ".tcshrc",
          ".yashrc",
          ".yash_profile"
        ],
        "filenames": [
          "APKBUILD",
          "PKGBUILD",
          ".envrc",
          ".hushlogin",
          "zshrc",
          "zshenv",
          "zlogin",
          "zprofile",
          "zlogout",
          "bashrc_Apple_Terminal",
          "zshrc_Apple_Terminal"
        ],
        "firstLine": "^#!.*\\b(bash|fish|zsh|sh|ksh|dtksh|pdksh|mksh|ash|dash|yash|sh|csh|jcsh|tcsh|itcsh).*|^#\\s*-\\*-[^*]*mode:\\s*shell-script[^*]*-\\*-",
        "configuration": "./language-configuration.json",
        "mimetypes": [
          "text/x-shellscript"
        ]
      }
    ],
    "grammars": [
      {
        "language": "shellscript",
        "scopeName": "source.shell",
        "path": "./syntaxes/shell-unix-bash.tmLanguage.json",
        "balancedBracketScopes": [
          "*"
        ],
        "unbalancedBracketScopes": [
          "meta.scope.case-pattern.shell"
        ]
      }
    ],
    "configurationDefaults": {
      "[shellscript]": {
        "files.eol": "\n",
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

---[FILE: extensions/shellscript/package.nls.json]---
Location: vscode-main/extensions/shellscript/package.nls.json

```json
{
	"displayName": "Shell Script Language Basics",
	"description": "Provides syntax highlighting and bracket matching in Shell Script files."
}
```

--------------------------------------------------------------------------------

````
