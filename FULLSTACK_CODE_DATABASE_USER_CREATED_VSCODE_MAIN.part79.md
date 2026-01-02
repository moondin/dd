---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 79
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 79 of 552)

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

---[FILE: extensions/terminal-suggest/fixtures/shell-parser/primaryExpressions/output.txt]---
Location: vscode-main/extensions/terminal-suggest/fixtures/shell-parser/primaryExpressions/output.txt

```text
// Case 1
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 9,
  "text": "a \"\\${b}\"",
  "innerText": "a \"\\${b}\"",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "command",
      "endIndex": 9,
      "text": "a \"\\${b}\"",
      "innerText": "a \"\\${b}\"",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "word",
          "endIndex": 1,
          "text": "a",
          "innerText": "a",
          "complete": true,
          "children": []
        },
        {
          "startIndex": 2,
          "type": "string",
          "endIndex": 9,
          "text": "\"\\${b}\"",
          "innerText": "${b}",
          "complete": true,
          "children": []
        }
      ]
    }
  ]
}

// Case 2
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 7,
  "text": "a \"'b'\"",
  "innerText": "a \"'b'\"",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "command",
      "endIndex": 7,
      "text": "a \"'b'\"",
      "innerText": "a \"'b'\"",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "word",
          "endIndex": 1,
          "text": "a",
          "innerText": "a",
          "complete": true,
          "children": []
        },
        {
          "startIndex": 2,
          "type": "string",
          "endIndex": 7,
          "text": "\"'b'\"",
          "innerText": "'b'",
          "complete": true,
          "children": []
        }
      ]
    }
  ]
}

// Case 3
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 14,
  "text": "a \"\\${b:+\"c\"}\"",
  "innerText": "a \"\\${b:+\"c\"}\"",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "command",
      "endIndex": 14,
      "text": "a \"\\${b:+\"c\"}\"",
      "innerText": "a \"\\${b:+\"c\"}\"",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "word",
          "endIndex": 1,
          "text": "a",
          "innerText": "a",
          "complete": true,
          "children": []
        },
        {
          "startIndex": 2,
          "type": "concatenation",
          "endIndex": 14,
          "text": "\"\\${b:+\"c\"}\"",
          "innerText": "${b:+c}",
          "complete": true,
          "children": [
            {
              "startIndex": 2,
              "type": "string",
              "endIndex": 10,
              "text": "\"\\${b:+\"",
              "innerText": "${b:+",
              "complete": true,
              "children": []
            },
            {
              "startIndex": 10,
              "type": "word",
              "endIndex": 11,
              "text": "c",
              "innerText": "c",
              "complete": true,
              "children": []
            },
            {
              "startIndex": 11,
              "type": "string",
              "endIndex": 14,
              "text": "\"}\"",
              "innerText": "}",
              "complete": true,
              "children": []
            }
          ]
        }
      ]
    }
  ]
}

// Case 4
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 6,
  "text": "a b\"c\"",
  "innerText": "a b\"c\"",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "command",
      "endIndex": 6,
      "text": "a b\"c\"",
      "innerText": "a b\"c\"",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "word",
          "endIndex": 1,
          "text": "a",
          "innerText": "a",
          "complete": true,
          "children": []
        },
        {
          "startIndex": 2,
          "type": "concatenation",
          "endIndex": 6,
          "text": "b\"c\"",
          "innerText": "bc",
          "complete": true,
          "children": [
            {
              "startIndex": 2,
              "type": "word",
              "endIndex": 3,
              "text": "b",
              "innerText": "b",
              "complete": true,
              "children": []
            },
            {
              "startIndex": 3,
              "type": "string",
              "endIndex": 6,
              "text": "\"c\"",
              "innerText": "c",
              "complete": true,
              "children": []
            }
          ]
        }
      ]
    }
  ]
}

// Case 5
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 9,
  "text": "a '\\${b}'",
  "innerText": "a '\\${b}'",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "command",
      "endIndex": 9,
      "text": "a '\\${b}'",
      "innerText": "a '\\${b}'",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "word",
          "endIndex": 1,
          "text": "a",
          "innerText": "a",
          "complete": true,
          "children": []
        },
        {
          "startIndex": 2,
          "type": "raw_string",
          "endIndex": 9,
          "text": "'\\${b}'",
          "innerText": "\\${b}",
          "complete": true,
          "children": []
        }
      ]
    }
  ]
}

// Case 6
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 10,
  "text": "a $'\\${b}'",
  "innerText": "a $'\\${b}'",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "command",
      "endIndex": 10,
      "text": "a $'\\${b}'",
      "innerText": "a $'\\${b}'",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "word",
          "endIndex": 1,
          "text": "a",
          "innerText": "a",
          "complete": true,
          "children": []
        },
        {
          "startIndex": 2,
          "type": "ansi_c_string",
          "endIndex": 10,
          "text": "$'\\${b}'",
          "innerText": "\\${b}",
          "complete": true,
          "children": []
        }
      ]
    }
  ]
}

// Case 7
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 22,
  "text": "a $'b''c'd$$$e\\${f}\"g\"",
  "innerText": "a $'b''c'd$$$e\\${f}\"g\"",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "command",
      "endIndex": 22,
      "text": "a $'b''c'd$$$e\\${f}\"g\"",
      "innerText": "a $'b''c'd$$$e\\${f}\"g\"",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "word",
          "endIndex": 1,
          "text": "a",
          "innerText": "a",
          "complete": true,
          "children": []
        },
        {
          "startIndex": 2,
          "type": "concatenation",
          "endIndex": 22,
          "text": "$'b''c'd$$$e\\${f}\"g\"",
          "innerText": "bcd$$$e${f}g",
          "complete": true,
          "children": [
            {
              "startIndex": 2,
              "type": "ansi_c_string",
              "endIndex": 6,
              "text": "$'b'",
              "innerText": "b",
              "complete": true,
              "children": []
            },
            {
              "startIndex": 6,
              "type": "raw_string",
              "endIndex": 9,
              "text": "'c'",
              "innerText": "c",
              "complete": true,
              "children": []
            },
            {
              "startIndex": 9,
              "type": "word",
              "endIndex": 10,
              "text": "d",
              "innerText": "d",
              "complete": true,
              "children": []
            },
            {
              "startIndex": 10,
              "type": "special_expansion",
              "endIndex": 12,
              "text": "$$",
              "innerText": "$$",
              "complete": true,
              "children": []
            },
            {
              "startIndex": 12,
              "type": "simple_expansion",
              "endIndex": 14,
              "text": "$e",
              "innerText": "$e",
              "complete": true,
              "children": []
            },
            {
              "startIndex": 15,
              "type": "word",
              "endIndex": 19,
              "text": "${f}",
              "innerText": "${f}",
              "complete": true,
              "children": []
            },
            {
              "startIndex": 19,
              "type": "string",
              "endIndex": 22,
              "text": "\"g\"",
              "innerText": "g",
              "complete": true,
              "children": []
            }
          ]
        }
      ]
    }
  ]
}

// Case 8
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 10,
  "text": "a $'b\\\\'c'",
  "innerText": "a $'b\\\\'c'",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "command",
      "endIndex": 10,
      "text": "a $'b\\\\'c'",
      "innerText": "a $'b\\\\'c'",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "word",
          "endIndex": 1,
          "text": "a",
          "innerText": "a",
          "complete": true,
          "children": []
        },
        {
          "startIndex": 2,
          "type": "concatenation",
          "endIndex": 10,
          "text": "$'b\\\\'c'",
          "innerText": "b\\\\c",
          "complete": false,
          "children": [
            {
              "startIndex": 2,
              "type": "ansi_c_string",
              "endIndex": 8,
              "text": "$'b\\\\'",
              "innerText": "b\\\\",
              "complete": true,
              "children": []
            },
            {
              "startIndex": 8,
              "type": "word",
              "endIndex": 9,
              "text": "c",
              "innerText": "c",
              "complete": true,
              "children": []
            },
            {
              "startIndex": 9,
              "type": "raw_string",
              "endIndex": 10,
              "text": "'",
              "innerText": "",
              "complete": false,
              "children": []
            }
          ]
        }
      ]
    }
  ]
}

// Case 9
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 9,
  "text": "a 'b\\\\'c'",
  "innerText": "a 'b\\\\'c'",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "command",
      "endIndex": 9,
      "text": "a 'b\\\\'c'",
      "innerText": "a 'b\\\\'c'",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "word",
          "endIndex": 1,
          "text": "a",
          "innerText": "a",
          "complete": true,
          "children": []
        },
        {
          "startIndex": 2,
          "type": "concatenation",
          "endIndex": 9,
          "text": "'b\\\\'c'",
          "innerText": "b\\\\c",
          "complete": false,
          "children": [
            {
              "startIndex": 2,
              "type": "raw_string",
              "endIndex": 7,
              "text": "'b\\\\'",
              "innerText": "b\\\\",
              "complete": true,
              "children": []
            },
            {
              "startIndex": 7,
              "type": "word",
              "endIndex": 8,
              "text": "c",
              "innerText": "c",
              "complete": true,
              "children": []
            },
            {
              "startIndex": 8,
              "type": "raw_string",
              "endIndex": 9,
              "text": "'",
              "innerText": "",
              "complete": false,
              "children": []
            }
          ]
        }
      ]
    }
  ]
}

// Case 10
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 6,
  "text": "a \"b$\"",
  "innerText": "a \"b$\"",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "command",
      "endIndex": 6,
      "text": "a \"b$\"",
      "innerText": "a \"b$\"",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "word",
          "endIndex": 1,
          "text": "a",
          "innerText": "a",
          "complete": true,
          "children": []
        },
        {
          "startIndex": 2,
          "type": "string",
          "endIndex": 6,
          "text": "\"b$\"",
          "innerText": "b$",
          "complete": true,
          "children": []
        }
      ]
    }
  ]
}

// Case 11
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 6,
  "text": "a \"$b\"",
  "innerText": "a \"$b\"",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "command",
      "endIndex": 6,
      "text": "a \"$b\"",
      "innerText": "a \"$b\"",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "word",
          "endIndex": 1,
          "text": "a",
          "innerText": "a",
          "complete": true,
          "children": []
        },
        {
          "startIndex": 2,
          "type": "string",
          "endIndex": 6,
          "text": "\"$b\"",
          "innerText": "$b",
          "complete": true,
          "children": [
            {
              "startIndex": 3,
              "type": "simple_expansion",
              "endIndex": 5,
              "text": "$b",
              "innerText": "$b",
              "complete": true,
              "children": []
            }
          ]
        }
      ]
    }
  ]
}

// Case 12
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 17,
  "text": "a \"$(b \"c\" && d)\"",
  "innerText": "a \"$(b \"c\" && d)\"",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "command",
      "endIndex": 17,
      "text": "a \"$(b \"c\" && d)\"",
      "innerText": "a \"$(b \"c\" && d)\"",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "word",
          "endIndex": 1,
          "text": "a",
          "innerText": "a",
          "complete": true,
          "children": []
        },
        {
          "startIndex": 2,
          "type": "string",
          "endIndex": 17,
          "text": "\"$(b \"c\" && d)\"",
          "innerText": "$(b \"c\" && d)",
          "complete": true,
          "children": [
            {
              "startIndex": 3,
              "type": "command_substitution",
              "endIndex": 16,
              "text": "$(b \"c\" && d)",
              "innerText": "$(b \"c\" && d)",
              "complete": true,
              "children": [
                {
                  "startIndex": 5,
                  "type": "list",
                  "endIndex": 15,
                  "text": "b \"c\" && d",
                  "innerText": "b \"c\" && d",
                  "complete": true,
                  "children": [
                    {
                      "startIndex": 5,
                      "type": "command",
                      "endIndex": 11,
                      "text": "b \"c\" ",
                      "innerText": "b \"c\" ",
                      "complete": true,
                      "children": [
                        {
                          "startIndex": 5,
                          "type": "word",
                          "endIndex": 6,
                          "text": "b",
                          "innerText": "b",
                          "complete": true,
                          "children": []
                        },
                        {
                          "startIndex": 7,
                          "type": "string",
                          "endIndex": 10,
                          "text": "\"c\"",
                          "innerText": "c",
                          "complete": true,
                          "children": []
                        }
                      ]
                    },
                    {
                      "startIndex": 14,
                      "type": "command",
                      "endIndex": 15,
                      "text": "d",
                      "innerText": "d",
                      "complete": true,
                      "children": [
                        {
                          "startIndex": 14,
                          "type": "word",
                          "endIndex": 15,
                          "text": "d",
                          "innerText": "d",
                          "complete": true,
                          "children": []
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/fixtures/shell-parser/variables/input.sh]---
Location: vscode-main/extensions/terminal-suggest/fixtures/shell-parser/variables/input.sh

```bash
### Case 1
ENV=a b

### Case 2
ENV=a b c d --op=e

### Case 3
ENV=a ENV=b a

### Case 4
ENV=a ENV=b a && ENV=c c

### Case 5
ENV="a b" c

### Case 6
ENV='a b' c

### Case 7
ENV=`cmd` a

### Case 8
ENV+='100' b

### Case 9
ENV+=a ENV=b

### Case 10
ENV+=a ENV=b && foo

### Case 11
ENV="a

### Case 12
ENV='a

### Case 13
ENV=a ENV=`b

### Case 14
ENV=`ENV="a" b` && ENV="c" d

### Case 15
c $(ENV=a foo)

### Case 16
ENV=a; b

### Case 17
ENV=a ; b

### Case 18
ENV=a & b

### Case 19
ENV=a|b

### Case 20
ENV[0]=a b

### Case 21
ENV[0]=a; b

### Case 22
ENV[1]=`a b

### Case 23
ENV[2]+="a b "

### Case 24
MY_VAR='echo'hi$'quote'"command: $(ps | VAR=2 grep ps)"

### Case 25
ENV="a"'b'c d

### Case 26
ENV=a"b"'c'
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/fixtures/shell-parser/variables/output.txt]---
Location: vscode-main/extensions/terminal-suggest/fixtures/shell-parser/variables/output.txt

```text
// Case 1
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 7,
  "text": "ENV=a b",
  "innerText": "ENV=a b",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "assignment_list",
      "endIndex": 7,
      "text": "ENV=a b",
      "innerText": "ENV=a b",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment",
          "endIndex": 5,
          "text": "ENV=a",
          "innerText": "ENV=a",
          "complete": true,
          "children": [
            {
              "startIndex": 4,
              "type": "word",
              "endIndex": 5,
              "text": "a",
              "innerText": "a",
              "complete": true,
              "children": []
            }
          ],
          "name": {
            "startIndex": 0,
            "type": "variable_name",
            "endIndex": 3,
            "text": "ENV",
            "innerText": "ENV",
            "complete": true,
            "children": []
          },
          "operator": "="
        },
        {
          "startIndex": 6,
          "type": "command",
          "endIndex": 7,
          "text": "b",
          "innerText": "b",
          "complete": true,
          "children": [
            {
              "startIndex": 6,
              "type": "word",
              "endIndex": 7,
              "text": "b",
              "innerText": "b",
              "complete": true,
              "children": []
            }
          ]
        }
      ],
      "hasCommand": true
    }
  ]
}

// Case 2
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 18,
  "text": "ENV=a b c d --op=e",
  "innerText": "ENV=a b c d --op=e",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "assignment_list",
      "endIndex": 18,
      "text": "ENV=a b c d --op=e",
      "innerText": "ENV=a b c d --op=e",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment",
          "endIndex": 5,
          "text": "ENV=a",
          "innerText": "ENV=a",
          "complete": true,
          "children": [
            {
              "startIndex": 4,
              "type": "word",
              "endIndex": 5,
              "text": "a",
              "innerText": "a",
              "complete": true,
              "children": []
            }
          ],
          "name": {
            "startIndex": 0,
            "type": "variable_name",
            "endIndex": 3,
            "text": "ENV",
            "innerText": "ENV",
            "complete": true,
            "children": []
          },
          "operator": "="
        },
        {
          "startIndex": 6,
          "type": "command",
          "endIndex": 18,
          "text": "b c d --op=e",
          "innerText": "b c d --op=e",
          "complete": true,
          "children": [
            {
              "startIndex": 6,
              "type": "word",
              "endIndex": 7,
              "text": "b",
              "innerText": "b",
              "complete": true,
              "children": []
            },
            {
              "startIndex": 8,
              "type": "word",
              "endIndex": 9,
              "text": "c",
              "innerText": "c",
              "complete": true,
              "children": []
            },
            {
              "startIndex": 10,
              "type": "word",
              "endIndex": 11,
              "text": "d",
              "innerText": "d",
              "complete": true,
              "children": []
            },
            {
              "startIndex": 12,
              "type": "word",
              "endIndex": 18,
              "text": "--op=e",
              "innerText": "--op=e",
              "complete": true,
              "children": []
            }
          ]
        }
      ],
      "hasCommand": true
    }
  ]
}

// Case 3
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 13,
  "text": "ENV=a ENV=b a",
  "innerText": "ENV=a ENV=b a",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "assignment_list",
      "endIndex": 13,
      "text": "ENV=a ENV=b a",
      "innerText": "ENV=a ENV=b a",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment",
          "endIndex": 5,
          "text": "ENV=a",
          "innerText": "ENV=a",
          "complete": true,
          "children": [
            {
              "startIndex": 4,
              "type": "word",
              "endIndex": 5,
              "text": "a",
              "innerText": "a",
              "complete": true,
              "children": []
            }
          ],
          "name": {
            "startIndex": 0,
            "type": "variable_name",
            "endIndex": 3,
            "text": "ENV",
            "innerText": "ENV",
            "complete": true,
            "children": []
          },
          "operator": "="
        },
        {
          "startIndex": 6,
          "type": "assignment",
          "endIndex": 11,
          "text": "ENV=b",
          "innerText": "ENV=b",
          "complete": true,
          "children": [
            {
              "startIndex": 10,
              "type": "word",
              "endIndex": 11,
              "text": "b",
              "innerText": "b",
              "complete": true,
              "children": []
            }
          ],
          "name": {
            "startIndex": 6,
            "type": "variable_name",
            "endIndex": 9,
            "text": "ENV",
            "innerText": "ENV",
            "complete": true,
            "children": []
          },
          "operator": "="
        },
        {
          "startIndex": 12,
          "type": "command",
          "endIndex": 13,
          "text": "a",
          "innerText": "a",
          "complete": true,
          "children": [
            {
              "startIndex": 12,
              "type": "word",
              "endIndex": 13,
              "text": "a",
              "innerText": "a",
              "complete": true,
              "children": []
            }
          ]
        }
      ],
      "hasCommand": true
    }
  ]
}

// Case 4
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 24,
  "text": "ENV=a ENV=b a && ENV=c c",
  "innerText": "ENV=a ENV=b a && ENV=c c",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "list",
      "endIndex": 24,
      "text": "ENV=a ENV=b a && ENV=c c",
      "innerText": "ENV=a ENV=b a && ENV=c c",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment_list",
          "endIndex": 14,
          "text": "ENV=a ENV=b a ",
          "innerText": "ENV=a ENV=b a ",
          "complete": true,
          "children": [
            {
              "startIndex": 0,
              "type": "assignment",
              "endIndex": 5,
              "text": "ENV=a",
              "innerText": "ENV=a",
              "complete": true,
              "children": [
                {
                  "startIndex": 4,
                  "type": "word",
                  "endIndex": 5,
                  "text": "a",
                  "innerText": "a",
                  "complete": true,
                  "children": []
                }
              ],
              "name": {
                "startIndex": 0,
                "type": "variable_name",
                "endIndex": 3,
                "text": "ENV",
                "innerText": "ENV",
                "complete": true,
                "children": []
              },
              "operator": "="
            },
            {
              "startIndex": 6,
              "type": "assignment",
              "endIndex": 11,
              "text": "ENV=b",
              "innerText": "ENV=b",
              "complete": true,
              "children": [
                {
                  "startIndex": 10,
                  "type": "word",
                  "endIndex": 11,
                  "text": "b",
                  "innerText": "b",
                  "complete": true,
                  "children": []
                }
              ],
              "name": {
                "startIndex": 6,
                "type": "variable_name",
                "endIndex": 9,
                "text": "ENV",
                "innerText": "ENV",
                "complete": true,
                "children": []
              },
              "operator": "="
            },
            {
              "startIndex": 12,
              "type": "command",
              "endIndex": 14,
              "text": "a ",
              "innerText": "a ",
              "complete": true,
              "children": [
                {
                  "startIndex": 12,
                  "type": "word",
                  "endIndex": 13,
                  "text": "a",
                  "innerText": "a",
                  "complete": true,
                  "children": []
                }
              ]
            }
          ],
          "hasCommand": true
        },
        {
          "startIndex": 17,
          "type": "assignment_list",
          "endIndex": 24,
          "text": "ENV=c c",
          "innerText": "ENV=c c",
          "complete": true,
          "children": [
            {
              "startIndex": 17,
              "type": "assignment",
              "endIndex": 22,
              "text": "ENV=c",
              "innerText": "ENV=c",
              "complete": true,
              "children": [
                {
                  "startIndex": 21,
                  "type": "word",
                  "endIndex": 22,
                  "text": "c",
                  "innerText": "c",
                  "complete": true,
                  "children": []
                }
              ],
              "name": {
                "startIndex": 17,
                "type": "variable_name",
                "endIndex": 20,
                "text": "ENV",
                "innerText": "ENV",
                "complete": true,
                "children": []
              },
              "operator": "="
            },
            {
              "startIndex": 23,
              "type": "command",
              "endIndex": 24,
              "text": "c",
              "innerText": "c",
              "complete": true,
              "children": [
                {
                  "startIndex": 23,
                  "type": "word",
                  "endIndex": 24,
                  "text": "c",
                  "innerText": "c",
                  "complete": true,
                  "children": []
                }
              ]
            }
          ],
          "hasCommand": true
        }
      ]
    }
  ]
}

// Case 5
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 11,
  "text": "ENV=\"a b\" c",
  "innerText": "ENV=\"a b\" c",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "assignment_list",
      "endIndex": 11,
      "text": "ENV=\"a b\" c",
      "innerText": "ENV=\"a b\" c",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment",
          "endIndex": 9,
          "text": "ENV=\"a b\"",
          "innerText": "ENV=\"a b\"",
          "complete": true,
          "children": [
            {
              "startIndex": 4,
              "type": "string",
              "endIndex": 9,
              "text": "\"a b\"",
              "innerText": "a b",
              "complete": true,
              "children": []
            }
          ],
          "name": {
            "startIndex": 0,
            "type": "variable_name",
            "endIndex": 3,
            "text": "ENV",
            "innerText": "ENV",
            "complete": true,
            "children": []
          },
          "operator": "="
        },
        {
          "startIndex": 10,
          "type": "command",
          "endIndex": 11,
          "text": "c",
          "innerText": "c",
          "complete": true,
          "children": [
            {
              "startIndex": 10,
              "type": "word",
              "endIndex": 11,
              "text": "c",
              "innerText": "c",
              "complete": true,
              "children": []
            }
          ]
        }
      ],
      "hasCommand": true
    }
  ]
}

// Case 6
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 11,
  "text": "ENV='a b' c",
  "innerText": "ENV='a b' c",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "assignment_list",
      "endIndex": 11,
      "text": "ENV='a b' c",
      "innerText": "ENV='a b' c",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment",
          "endIndex": 9,
          "text": "ENV='a b'",
          "innerText": "ENV='a b'",
          "complete": true,
          "children": [
            {
              "startIndex": 4,
              "type": "raw_string",
              "endIndex": 9,
              "text": "'a b'",
              "innerText": "a b",
              "complete": true,
              "children": []
            }
          ],
          "name": {
            "startIndex": 0,
            "type": "variable_name",
            "endIndex": 3,
            "text": "ENV",
            "innerText": "ENV",
            "complete": true,
            "children": []
          },
          "operator": "="
        },
        {
          "startIndex": 10,
          "type": "command",
          "endIndex": 11,
          "text": "c",
          "innerText": "c",
          "complete": true,
          "children": [
            {
              "startIndex": 10,
              "type": "word",
              "endIndex": 11,
              "text": "c",
              "innerText": "c",
              "complete": true,
              "children": []
            }
          ]
        }
      ],
      "hasCommand": true
    }
  ]
}

// Case 7
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 11,
  "text": "ENV=`cmd` a",
  "innerText": "ENV=`cmd` a",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "assignment_list",
      "endIndex": 11,
      "text": "ENV=`cmd` a",
      "innerText": "ENV=`cmd` a",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment",
          "endIndex": 9,
          "text": "ENV=`cmd`",
          "innerText": "ENV=`cmd`",
          "complete": true,
          "children": [
            {
              "startIndex": 4,
              "type": "command_substitution",
              "endIndex": 9,
              "text": "`cmd`",
              "innerText": "`cmd`",
              "complete": true,
              "children": [
                {
                  "startIndex": 5,
                  "type": "command",
                  "endIndex": 8,
                  "text": "cmd",
                  "innerText": "cmd",
                  "complete": true,
                  "children": [
                    {
                      "startIndex": 5,
                      "type": "word",
                      "endIndex": 8,
                      "text": "cmd",
                      "innerText": "cmd",
                      "complete": true,
                      "children": []
                    }
                  ]
                }
              ]
            }
          ],
          "name": {
            "startIndex": 0,
            "type": "variable_name",
            "endIndex": 3,
            "text": "ENV",
            "innerText": "ENV",
            "complete": true,
            "children": []
          },
          "operator": "="
        },
        {
          "startIndex": 10,
          "type": "command",
          "endIndex": 11,
          "text": "a",
          "innerText": "a",
          "complete": true,
          "children": [
            {
              "startIndex": 10,
              "type": "word",
              "endIndex": 11,
              "text": "a",
              "innerText": "a",
              "complete": true,
              "children": []
            }
          ]
        }
      ],
      "hasCommand": true
    }
  ]
}

// Case 8
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 12,
  "text": "ENV+='100' b",
  "innerText": "ENV+='100' b",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "assignment_list",
      "endIndex": 12,
      "text": "ENV+='100' b",
      "innerText": "ENV+='100' b",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment",
          "endIndex": 10,
          "text": "ENV+='100'",
          "innerText": "ENV+='100'",
          "complete": true,
          "children": [
            {
              "startIndex": 5,
              "type": "raw_string",
              "endIndex": 10,
              "text": "'100'",
              "innerText": "100",
              "complete": true,
              "children": []
            }
          ],
          "name": {
            "startIndex": 0,
            "type": "variable_name",
            "endIndex": 3,
            "text": "ENV",
            "innerText": "ENV",
            "complete": true,
            "children": []
          },
          "operator": "+="
        },
        {
          "startIndex": 11,
          "type": "command",
          "endIndex": 12,
          "text": "b",
          "innerText": "b",
          "complete": true,
          "children": [
            {
              "startIndex": 11,
              "type": "word",
              "endIndex": 12,
              "text": "b",
              "innerText": "b",
              "complete": true,
              "children": []
            }
          ]
        }
      ],
      "hasCommand": true
    }
  ]
}

// Case 9
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 12,
  "text": "ENV+=a ENV=b",
  "innerText": "ENV+=a ENV=b",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "assignment_list",
      "endIndex": 12,
      "text": "ENV+=a ENV=b",
      "innerText": "ENV+=a ENV=b",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment",
          "endIndex": 6,
          "text": "ENV+=a",
          "innerText": "ENV+=a",
          "complete": true,
          "children": [
            {
              "startIndex": 5,
              "type": "word",
              "endIndex": 6,
              "text": "a",
              "innerText": "a",
              "complete": true,
              "children": []
            }
          ],
          "name": {
            "startIndex": 0,
            "type": "variable_name",
            "endIndex": 3,
            "text": "ENV",
            "innerText": "ENV",
            "complete": true,
            "children": []
          },
          "operator": "+="
        },
        {
          "startIndex": 7,
          "type": "assignment",
          "endIndex": 12,
          "text": "ENV=b",
          "innerText": "ENV=b",
          "complete": true,
          "children": [
            {
              "startIndex": 11,
              "type": "word",
              "endIndex": 12,
              "text": "b",
              "innerText": "b",
              "complete": true,
              "children": []
            }
          ],
          "name": {
            "startIndex": 7,
            "type": "variable_name",
            "endIndex": 10,
            "text": "ENV",
            "innerText": "ENV",
            "complete": true,
            "children": []
          },
          "operator": "="
        }
      ],
      "hasCommand": false
    }
  ]
}

// Case 10
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 19,
  "text": "ENV+=a ENV=b && foo",
  "innerText": "ENV+=a ENV=b && foo",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "list",
      "endIndex": 19,
      "text": "ENV+=a ENV=b && foo",
      "innerText": "ENV+=a ENV=b && foo",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment_list",
          "endIndex": 12,
          "text": "ENV+=a ENV=b",
          "innerText": "ENV+=a ENV=b",
          "complete": true,
          "children": [
            {
              "startIndex": 0,
              "type": "assignment",
              "endIndex": 6,
              "text": "ENV+=a",
              "innerText": "ENV+=a",
              "complete": true,
              "children": [
                {
                  "startIndex": 5,
                  "type": "word",
                  "endIndex": 6,
                  "text": "a",
                  "innerText": "a",
                  "complete": true,
                  "children": []
                }
              ],
              "name": {
                "startIndex": 0,
                "type": "variable_name",
                "endIndex": 3,
                "text": "ENV",
                "innerText": "ENV",
                "complete": true,
                "children": []
              },
              "operator": "+="
            },
            {
              "startIndex": 7,
              "type": "assignment",
              "endIndex": 12,
              "text": "ENV=b",
              "innerText": "ENV=b",
              "complete": true,
              "children": [
                {
                  "startIndex": 11,
                  "type": "word",
                  "endIndex": 12,
                  "text": "b",
                  "innerText": "b",
                  "complete": true,
                  "children": []
                }
              ],
              "name": {
                "startIndex": 7,
                "type": "variable_name",
                "endIndex": 10,
                "text": "ENV",
                "innerText": "ENV",
                "complete": true,
                "children": []
              },
              "operator": "="
            }
          ],
          "hasCommand": false
        },
        {
          "startIndex": 16,
          "type": "command",
          "endIndex": 19,
          "text": "foo",
          "innerText": "foo",
          "complete": true,
          "children": [
            {
              "startIndex": 16,
              "type": "word",
              "endIndex": 19,
              "text": "foo",
              "innerText": "foo",
              "complete": true,
              "children": []
            }
          ]
        }
      ]
    }
  ]
}

// Case 11
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 6,
  "text": "ENV=\"a",
  "innerText": "ENV=\"a",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "assignment_list",
      "endIndex": 6,
      "text": "ENV=\"a",
      "innerText": "ENV=\"a",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment",
          "endIndex": 6,
          "text": "ENV=\"a",
          "innerText": "ENV=\"a",
          "complete": false,
          "children": [
            {
              "startIndex": 4,
              "type": "string",
              "endIndex": 6,
              "text": "\"a",
              "innerText": "a",
              "complete": false,
              "children": []
            }
          ],
          "name": {
            "startIndex": 0,
            "type": "variable_name",
            "endIndex": 3,
            "text": "ENV",
            "innerText": "ENV",
            "complete": true,
            "children": []
          },
          "operator": "="
        }
      ],
      "hasCommand": false
    }
  ]
}

// Case 12
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 6,
  "text": "ENV='a",
  "innerText": "ENV='a",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "assignment_list",
      "endIndex": 6,
      "text": "ENV='a",
      "innerText": "ENV='a",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment",
          "endIndex": 6,
          "text": "ENV='a",
          "innerText": "ENV='a",
          "complete": false,
          "children": [
            {
              "startIndex": 4,
              "type": "raw_string",
              "endIndex": 6,
              "text": "'a",
              "innerText": "a",
              "complete": false,
              "children": []
            }
          ],
          "name": {
            "startIndex": 0,
            "type": "variable_name",
            "endIndex": 3,
            "text": "ENV",
            "innerText": "ENV",
            "complete": true,
            "children": []
          },
          "operator": "="
        }
      ],
      "hasCommand": false
    }
  ]
}

// Case 13
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 12,
  "text": "ENV=a ENV=`b",
  "innerText": "ENV=a ENV=`b",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "assignment_list",
      "endIndex": 12,
      "text": "ENV=a ENV=`b",
      "innerText": "ENV=a ENV=`b",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment",
          "endIndex": 5,
          "text": "ENV=a",
          "innerText": "ENV=a",
          "complete": true,
          "children": [
            {
              "startIndex": 4,
              "type": "word",
              "endIndex": 5,
              "text": "a",
              "innerText": "a",
              "complete": true,
              "children": []
            }
          ],
          "name": {
            "startIndex": 0,
            "type": "variable_name",
            "endIndex": 3,
            "text": "ENV",
            "innerText": "ENV",
            "complete": true,
            "children": []
          },
          "operator": "="
        },
        {
          "startIndex": 6,
          "type": "assignment",
          "endIndex": 12,
          "text": "ENV=`b",
          "innerText": "ENV=`b",
          "complete": false,
          "children": [
            {
              "startIndex": 10,
              "type": "command_substitution",
              "endIndex": 12,
              "text": "`b",
              "innerText": "`b",
              "complete": false,
              "children": [
                {
                  "startIndex": 11,
                  "type": "command",
                  "endIndex": 12,
                  "text": "b",
                  "innerText": "b",
                  "complete": true,
                  "children": [
                    {
                      "startIndex": 11,
                      "type": "word",
                      "endIndex": 12,
                      "text": "b",
                      "innerText": "b",
                      "complete": true,
                      "children": []
                    }
                  ]
                }
              ]
            }
          ],
          "name": {
            "startIndex": 6,
            "type": "variable_name",
            "endIndex": 9,
            "text": "ENV",
            "innerText": "ENV",
            "complete": true,
            "children": []
          },
          "operator": "="
        }
      ],
      "hasCommand": false
    }
  ]
}

// Case 14
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 28,
  "text": "ENV=`ENV=\"a\" b` && ENV=\"c\" d",
  "innerText": "ENV=`ENV=\"a\" b` && ENV=\"c\" d",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "list",
      "endIndex": 28,
      "text": "ENV=`ENV=\"a\" b` && ENV=\"c\" d",
      "innerText": "ENV=`ENV=\"a\" b` && ENV=\"c\" d",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment_list",
          "endIndex": 15,
          "text": "ENV=`ENV=\"a\" b`",
          "innerText": "ENV=`ENV=\"a\" b`",
          "complete": true,
          "children": [
            {
              "startIndex": 0,
              "type": "assignment",
              "endIndex": 15,
              "text": "ENV=`ENV=\"a\" b`",
              "innerText": "ENV=`ENV=\"a\" b`",
              "complete": true,
              "children": [
                {
                  "startIndex": 4,
                  "type": "command_substitution",
                  "endIndex": 15,
                  "text": "`ENV=\"a\" b`",
                  "innerText": "`ENV=\"a\" b`",
                  "complete": true,
                  "children": [
                    {
                      "startIndex": 5,
                      "type": "assignment_list",
                      "endIndex": 14,
                      "text": "ENV=\"a\" b",
                      "innerText": "ENV=\"a\" b",
                      "complete": true,
                      "children": [
                        {
                          "startIndex": 5,
                          "type": "assignment",
                          "endIndex": 12,
                          "text": "ENV=\"a\"",
                          "innerText": "ENV=\"a\"",
                          "complete": true,
                          "children": [
                            {
                              "startIndex": 9,
                              "type": "string",
                              "endIndex": 12,
                              "text": "\"a\"",
                              "innerText": "a",
                              "complete": true,
                              "children": []
                            }
                          ],
                          "name": {
                            "startIndex": 5,
                            "type": "variable_name",
                            "endIndex": 8,
                            "text": "ENV",
                            "innerText": "ENV",
                            "complete": true,
                            "children": []
                          },
                          "operator": "="
                        },
                        {
                          "startIndex": 13,
                          "type": "command",
                          "endIndex": 14,
                          "text": "b",
                          "innerText": "b",
                          "complete": true,
                          "children": [
                            {
                              "startIndex": 13,
                              "type": "word",
                              "endIndex": 14,
                              "text": "b",
                              "innerText": "b",
                              "complete": true,
                              "children": []
                            }
                          ]
                        }
                      ],
                      "hasCommand": true
                    }
                  ]
                }
              ],
              "name": {
                "startIndex": 0,
                "type": "variable_name",
                "endIndex": 3,
                "text": "ENV",
                "innerText": "ENV",
                "complete": true,
                "children": []
              },
              "operator": "="
            }
          ],
          "hasCommand": false
        },
        {
          "startIndex": 19,
          "type": "assignment_list",
          "endIndex": 28,
          "text": "ENV=\"c\" d",
          "innerText": "ENV=\"c\" d",
          "complete": true,
          "children": [
            {
              "startIndex": 19,
              "type": "assignment",
              "endIndex": 26,
              "text": "ENV=\"c\"",
              "innerText": "ENV=\"c\"",
              "complete": true,
              "children": [
                {
                  "startIndex": 23,
                  "type": "string",
                  "endIndex": 26,
                  "text": "\"c\"",
                  "innerText": "c",
                  "complete": true,
                  "children": []
                }
              ],
              "name": {
                "startIndex": 19,
                "type": "variable_name",
                "endIndex": 22,
                "text": "ENV",
                "innerText": "ENV",
                "complete": true,
                "children": []
              },
              "operator": "="
            },
            {
              "startIndex": 27,
              "type": "command",
              "endIndex": 28,
              "text": "d",
              "innerText": "d",
              "complete": true,
              "children": [
                {
                  "startIndex": 27,
                  "type": "word",
                  "endIndex": 28,
                  "text": "d",
                  "innerText": "d",
                  "complete": true,
                  "children": []
                }
              ]
            }
          ],
          "hasCommand": true
        }
      ]
    }
  ]
}

// Case 15
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 14,
  "text": "c $(ENV=a foo)",
  "innerText": "c $(ENV=a foo)",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "command",
      "endIndex": 14,
      "text": "c $(ENV=a foo)",
      "innerText": "c $(ENV=a foo)",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "word",
          "endIndex": 1,
          "text": "c",
          "innerText": "c",
          "complete": true,
          "children": []
        },
        {
          "startIndex": 2,
          "type": "command_substitution",
          "endIndex": 14,
          "text": "$(ENV=a foo)",
          "innerText": "$(ENV=a foo)",
          "complete": true,
          "children": [
            {
              "startIndex": 4,
              "type": "assignment_list",
              "endIndex": 13,
              "text": "ENV=a foo",
              "innerText": "ENV=a foo",
              "complete": true,
              "children": [
                {
                  "startIndex": 4,
                  "type": "assignment",
                  "endIndex": 9,
                  "text": "ENV=a",
                  "innerText": "ENV=a",
                  "complete": true,
                  "children": [
                    {
                      "startIndex": 8,
                      "type": "word",
                      "endIndex": 9,
                      "text": "a",
                      "innerText": "a",
                      "complete": true,
                      "children": []
                    }
                  ],
                  "name": {
                    "startIndex": 4,
                    "type": "variable_name",
                    "endIndex": 7,
                    "text": "ENV",
                    "innerText": "ENV",
                    "complete": true,
                    "children": []
                  },
                  "operator": "="
                },
                {
                  "startIndex": 10,
                  "type": "command",
                  "endIndex": 13,
                  "text": "foo",
                  "innerText": "foo",
                  "complete": true,
                  "children": [
                    {
                      "startIndex": 10,
                      "type": "word",
                      "endIndex": 13,
                      "text": "foo",
                      "innerText": "foo",
                      "complete": true,
                      "children": []
                    }
                  ]
                }
              ],
              "hasCommand": true
            }
          ]
        }
      ]
    }
  ]
}

// Case 16
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 8,
  "text": "ENV=a; b",
  "innerText": "ENV=a; b",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "assignment_list",
      "endIndex": 5,
      "text": "ENV=a",
      "innerText": "ENV=a",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment",
          "endIndex": 5,
          "text": "ENV=a",
          "innerText": "ENV=a",
          "complete": true,
          "children": [
            {
              "startIndex": 4,
              "type": "word",
              "endIndex": 5,
              "text": "a",
              "innerText": "a",
              "complete": true,
              "children": []
            }
          ],
          "name": {
            "startIndex": 0,
            "type": "variable_name",
            "endIndex": 3,
            "text": "ENV",
            "innerText": "ENV",
            "complete": true,
            "children": []
          },
          "operator": "="
        }
      ],
      "hasCommand": false
    },
    {
      "startIndex": 7,
      "type": "command",
      "endIndex": 8,
      "text": "b",
      "innerText": "b",
      "complete": true,
      "children": [
        {
          "startIndex": 7,
          "type": "word",
          "endIndex": 8,
          "text": "b",
          "innerText": "b",
          "complete": true,
          "children": []
        }
      ]
    }
  ]
}

// Case 17
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 9,
  "text": "ENV=a ; b",
  "innerText": "ENV=a ; b",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "assignment_list",
      "endIndex": 5,
      "text": "ENV=a",
      "innerText": "ENV=a",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment",
          "endIndex": 5,
          "text": "ENV=a",
          "innerText": "ENV=a",
          "complete": true,
          "children": [
            {
              "startIndex": 4,
              "type": "word",
              "endIndex": 5,
              "text": "a",
              "innerText": "a",
              "complete": true,
              "children": []
            }
          ],
          "name": {
            "startIndex": 0,
            "type": "variable_name",
            "endIndex": 3,
            "text": "ENV",
            "innerText": "ENV",
            "complete": true,
            "children": []
          },
          "operator": "="
        }
      ],
      "hasCommand": false
    },
    {
      "startIndex": 8,
      "type": "command",
      "endIndex": 9,
      "text": "b",
      "innerText": "b",
      "complete": true,
      "children": [
        {
          "startIndex": 8,
          "type": "word",
          "endIndex": 9,
          "text": "b",
          "innerText": "b",
          "complete": true,
          "children": []
        }
      ]
    }
  ]
}

// Case 18
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 9,
  "text": "ENV=a & b",
  "innerText": "ENV=a & b",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "assignment_list",
      "endIndex": 5,
      "text": "ENV=a",
      "innerText": "ENV=a",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment",
          "endIndex": 5,
          "text": "ENV=a",
          "innerText": "ENV=a",
          "complete": true,
          "children": [
            {
              "startIndex": 4,
              "type": "word",
              "endIndex": 5,
              "text": "a",
              "innerText": "a",
              "complete": true,
              "children": []
            }
          ],
          "name": {
            "startIndex": 0,
            "type": "variable_name",
            "endIndex": 3,
            "text": "ENV",
            "innerText": "ENV",
            "complete": true,
            "children": []
          },
          "operator": "="
        }
      ],
      "hasCommand": false
    },
    {
      "startIndex": 8,
      "type": "command",
      "endIndex": 9,
      "text": "b",
      "innerText": "b",
      "complete": true,
      "children": [
        {
          "startIndex": 8,
          "type": "word",
          "endIndex": 9,
          "text": "b",
          "innerText": "b",
          "complete": true,
          "children": []
        }
      ]
    }
  ]
}

// Case 19
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 7,
  "text": "ENV=a|b",
  "innerText": "ENV=a|b",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "pipeline",
      "endIndex": 7,
      "text": "ENV=a|b",
      "innerText": "ENV=a|b",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment_list",
          "endIndex": 5,
          "text": "ENV=a",
          "innerText": "ENV=a",
          "complete": true,
          "children": [
            {
              "startIndex": 0,
              "type": "assignment",
              "endIndex": 5,
              "text": "ENV=a",
              "innerText": "ENV=a",
              "complete": true,
              "children": [
                {
                  "startIndex": 4,
                  "type": "word",
                  "endIndex": 5,
                  "text": "a",
                  "innerText": "a",
                  "complete": true,
                  "children": []
                }
              ],
              "name": {
                "startIndex": 0,
                "type": "variable_name",
                "endIndex": 3,
                "text": "ENV",
                "innerText": "ENV",
                "complete": true,
                "children": []
              },
              "operator": "="
            }
          ],
          "hasCommand": false
        },
        {
          "startIndex": 6,
          "type": "command",
          "endIndex": 7,
          "text": "b",
          "innerText": "b",
          "complete": true,
          "children": [
            {
              "startIndex": 6,
              "type": "word",
              "endIndex": 7,
              "text": "b",
              "innerText": "b",
              "complete": true,
              "children": []
            }
          ]
        }
      ]
    }
  ]
}

// Case 20
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 10,
  "text": "ENV[0]=a b",
  "innerText": "ENV[0]=a b",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "assignment_list",
      "endIndex": 10,
      "text": "ENV[0]=a b",
      "innerText": "ENV[0]=a b",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment",
          "endIndex": 8,
          "text": "ENV[0]=a",
          "innerText": "ENV[0]=a",
          "complete": true,
          "children": [
            {
              "startIndex": 7,
              "type": "word",
              "endIndex": 8,
              "text": "a",
              "innerText": "a",
              "complete": true,
              "children": []
            }
          ],
          "name": {
            "startIndex": 0,
            "type": "subscript",
            "endIndex": 6,
            "text": "ENV[0]",
            "innerText": "ENV[0]",
            "complete": true,
            "children": [
              {
                "startIndex": 4,
                "type": "word",
                "endIndex": 5,
                "text": "0",
                "innerText": "0",
                "complete": true,
                "children": []
              }
            ],
            "name": {
              "startIndex": 0,
              "type": "variable_name",
              "endIndex": 3,
              "text": "ENV",
              "innerText": "ENV",
              "complete": true,
              "children": []
            }
          },
          "operator": "="
        },
        {
          "startIndex": 9,
          "type": "command",
          "endIndex": 10,
          "text": "b",
          "innerText": "b",
          "complete": true,
          "children": [
            {
              "startIndex": 9,
              "type": "word",
              "endIndex": 10,
              "text": "b",
              "innerText": "b",
              "complete": true,
              "children": []
            }
          ]
        }
      ],
      "hasCommand": true
    }
  ]
}

// Case 21
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 11,
  "text": "ENV[0]=a; b",
  "innerText": "ENV[0]=a; b",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "assignment_list",
      "endIndex": 8,
      "text": "ENV[0]=a",
      "innerText": "ENV[0]=a",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment",
          "endIndex": 8,
          "text": "ENV[0]=a",
          "innerText": "ENV[0]=a",
          "complete": true,
          "children": [
            {
              "startIndex": 7,
              "type": "word",
              "endIndex": 8,
              "text": "a",
              "innerText": "a",
              "complete": true,
              "children": []
            }
          ],
          "name": {
            "startIndex": 0,
            "type": "subscript",
            "endIndex": 6,
            "text": "ENV[0]",
            "innerText": "ENV[0]",
            "complete": true,
            "children": [
              {
                "startIndex": 4,
                "type": "word",
                "endIndex": 5,
                "text": "0",
                "innerText": "0",
                "complete": true,
                "children": []
              }
            ],
            "name": {
              "startIndex": 0,
              "type": "variable_name",
              "endIndex": 3,
              "text": "ENV",
              "innerText": "ENV",
              "complete": true,
              "children": []
            }
          },
          "operator": "="
        }
      ],
      "hasCommand": false
    },
    {
      "startIndex": 10,
      "type": "command",
      "endIndex": 11,
      "text": "b",
      "innerText": "b",
      "complete": true,
      "children": [
        {
          "startIndex": 10,
          "type": "word",
          "endIndex": 11,
          "text": "b",
          "innerText": "b",
          "complete": true,
          "children": []
        }
      ]
    }
  ]
}

// Case 22
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 11,
  "text": "ENV[1]=`a b",
  "innerText": "ENV[1]=`a b",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "assignment_list",
      "endIndex": 11,
      "text": "ENV[1]=`a b",
      "innerText": "ENV[1]=`a b",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment",
          "endIndex": 11,
          "text": "ENV[1]=`a b",
          "innerText": "ENV[1]=`a b",
          "complete": false,
          "children": [
            {
              "startIndex": 7,
              "type": "command_substitution",
              "endIndex": 11,
              "text": "`a b",
              "innerText": "`a b",
              "complete": false,
              "children": [
                {
                  "startIndex": 8,
                  "type": "command",
                  "endIndex": 11,
                  "text": "a b",
                  "innerText": "a b",
                  "complete": true,
                  "children": [
                    {
                      "startIndex": 8,
                      "type": "word",
                      "endIndex": 9,
                      "text": "a",
                      "innerText": "a",
                      "complete": true,
                      "children": []
                    },
                    {
                      "startIndex": 10,
                      "type": "word",
                      "endIndex": 11,
                      "text": "b",
                      "innerText": "b",
                      "complete": true,
                      "children": []
                    }
                  ]
                }
              ]
            }
          ],
          "name": {
            "startIndex": 0,
            "type": "subscript",
            "endIndex": 6,
            "text": "ENV[1]",
            "innerText": "ENV[1]",
            "complete": true,
            "children": [
              {
                "startIndex": 4,
                "type": "word",
                "endIndex": 5,
                "text": "1",
                "innerText": "1",
                "complete": true,
                "children": []
              }
            ],
            "name": {
              "startIndex": 0,
              "type": "variable_name",
              "endIndex": 3,
              "text": "ENV",
              "innerText": "ENV",
              "complete": true,
              "children": []
            }
          },
          "operator": "="
        }
      ],
      "hasCommand": false
    }
  ]
}

// Case 23
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 14,
  "text": "ENV[2]+=\"a b \"",
  "innerText": "ENV[2]+=\"a b \"",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "assignment_list",
      "endIndex": 14,
      "text": "ENV[2]+=\"a b \"",
      "innerText": "ENV[2]+=\"a b \"",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment",
          "endIndex": 14,
          "text": "ENV[2]+=\"a b \"",
          "innerText": "ENV[2]+=\"a b \"",
          "complete": true,
          "children": [
            {
              "startIndex": 8,
              "type": "string",
              "endIndex": 14,
              "text": "\"a b \"",
              "innerText": "a b ",
              "complete": true,
              "children": []
            }
          ],
          "name": {
            "startIndex": 0,
            "type": "subscript",
            "endIndex": 6,
            "text": "ENV[2]",
            "innerText": "ENV[2]",
            "complete": true,
            "children": [
              {
                "startIndex": 4,
                "type": "word",
                "endIndex": 5,
                "text": "2",
                "innerText": "2",
                "complete": true,
                "children": []
              }
            ],
            "name": {
              "startIndex": 0,
              "type": "variable_name",
              "endIndex": 3,
              "text": "ENV",
              "innerText": "ENV",
              "complete": true,
              "children": []
            }
          },
          "operator": "+="
        }
      ],
      "hasCommand": false
    }
  ]
}

// Case 24
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 55,
  "text": "MY_VAR='echo'hi$'quote'\"command: $(ps | VAR=2 grep ps)\"",
  "innerText": "MY_VAR='echo'hi$'quote'\"command: $(ps | VAR=2 grep ps)\"",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "assignment_list",
      "endIndex": 55,
      "text": "MY_VAR='echo'hi$'quote'\"command: $(ps | VAR=2 grep ps)\"",
      "innerText": "MY_VAR='echo'hi$'quote'\"command: $(ps | VAR=2 grep ps)\"",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment",
          "endIndex": 55,
          "text": "MY_VAR='echo'hi$'quote'\"command: $(ps | VAR=2 grep ps)\"",
          "innerText": "MY_VAR='echo'hi$'quote'\"command: $(ps | VAR=2 grep ps)\"",
          "complete": true,
          "children": [
            {
              "startIndex": 7,
              "type": "concatenation",
              "endIndex": 55,
              "text": "'echo'hi$'quote'\"command: $(ps | VAR=2 grep ps)\"",
              "innerText": "echohiquotecommand: $(ps | VAR=2 grep ps)",
              "complete": true,
              "children": [
                {
                  "startIndex": 7,
                  "type": "raw_string",
                  "endIndex": 13,
                  "text": "'echo'",
                  "innerText": "echo",
                  "complete": true,
                  "children": []
                },
                {
                  "startIndex": 13,
                  "type": "word",
                  "endIndex": 15,
                  "text": "hi",
                  "innerText": "hi",
                  "complete": true,
                  "children": []
                },
                {
                  "startIndex": 15,
                  "type": "ansi_c_string",
                  "endIndex": 23,
                  "text": "$'quote'",
                  "innerText": "quote",
                  "complete": true,
                  "children": []
                },
                {
                  "startIndex": 23,
                  "type": "string",
                  "endIndex": 55,
                  "text": "\"command: $(ps | VAR=2 grep ps)\"",
                  "innerText": "command: $(ps | VAR=2 grep ps)",
                  "complete": true,
                  "children": [
                    {
                      "startIndex": 33,
                      "type": "command_substitution",
                      "endIndex": 54,
                      "text": "$(ps | VAR=2 grep ps)",
                      "innerText": "$(ps | VAR=2 grep ps)",
                      "complete": true,
                      "children": [
                        {
                          "startIndex": 35,
                          "type": "pipeline",
                          "endIndex": 53,
                          "text": "ps | VAR=2 grep ps",
                          "innerText": "ps | VAR=2 grep ps",
                          "complete": true,
                          "children": [
                            {
                              "startIndex": 35,
                              "type": "command",
                              "endIndex": 38,
                              "text": "ps ",
                              "innerText": "ps ",
                              "complete": true,
                              "children": [
                                {
                                  "startIndex": 35,
                                  "type": "word",
                                  "endIndex": 37,
                                  "text": "ps",
                                  "innerText": "ps",
                                  "complete": true,
                                  "children": []
                                }
                              ]
                            },
                            {
                              "startIndex": 40,
                              "type": "assignment_list",
                              "endIndex": 53,
                              "text": "VAR=2 grep ps",
                              "innerText": "VAR=2 grep ps",
                              "complete": true,
                              "children": [
                                {
                                  "startIndex": 40,
                                  "type": "assignment",
                                  "endIndex": 45,
                                  "text": "VAR=2",
                                  "innerText": "VAR=2",
                                  "complete": true,
                                  "children": [
                                    {
                                      "startIndex": 44,
                                      "type": "word",
                                      "endIndex": 45,
                                      "text": "2",
                                      "innerText": "2",
                                      "complete": true,
                                      "children": []
                                    }
                                  ],
                                  "name": {
                                    "startIndex": 40,
                                    "type": "variable_name",
                                    "endIndex": 43,
                                    "text": "VAR",
                                    "innerText": "VAR",
                                    "complete": true,
                                    "children": []
                                  },
                                  "operator": "="
                                },
                                {
                                  "startIndex": 46,
                                  "type": "command",
                                  "endIndex": 53,
                                  "text": "grep ps",
                                  "innerText": "grep ps",
                                  "complete": true,
                                  "children": [
                                    {
                                      "startIndex": 46,
                                      "type": "word",
                                      "endIndex": 50,
                                      "text": "grep",
                                      "innerText": "grep",
                                      "complete": true,
                                      "children": []
                                    },
                                    {
                                      "startIndex": 51,
                                      "type": "word",
                                      "endIndex": 53,
                                      "text": "ps",
                                      "innerText": "ps",
                                      "complete": true,
                                      "children": []
                                    }
                                  ]
                                }
                              ],
                              "hasCommand": true
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "name": {
            "startIndex": 0,
            "type": "variable_name",
            "endIndex": 6,
            "text": "MY_VAR",
            "innerText": "MY_VAR",
            "complete": true,
            "children": []
          },
          "operator": "="
        }
      ],
      "hasCommand": false
    }
  ]
}

// Case 25
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 13,
  "text": "ENV=\"a\"'b'c d",
  "innerText": "ENV=\"a\"'b'c d",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "assignment_list",
      "endIndex": 13,
      "text": "ENV=\"a\"'b'c d",
      "innerText": "ENV=\"a\"'b'c d",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment",
          "endIndex": 11,
          "text": "ENV=\"a\"'b'c",
          "innerText": "ENV=\"a\"'b'c",
          "complete": true,
          "children": [
            {
              "startIndex": 4,
              "type": "concatenation",
              "endIndex": 11,
              "text": "\"a\"'b'c",
              "innerText": "abc",
              "complete": true,
              "children": [
                {
                  "startIndex": 4,
                  "type": "string",
                  "endIndex": 7,
                  "text": "\"a\"",
                  "innerText": "a",
                  "complete": true,
                  "children": []
                },
                {
                  "startIndex": 7,
                  "type": "raw_string",
                  "endIndex": 10,
                  "text": "'b'",
                  "innerText": "b",
                  "complete": true,
                  "children": []
                },
                {
                  "startIndex": 10,
                  "type": "word",
                  "endIndex": 11,
                  "text": "c",
                  "innerText": "c",
                  "complete": true,
                  "children": []
                }
              ]
            }
          ],
          "name": {
            "startIndex": 0,
            "type": "variable_name",
            "endIndex": 3,
            "text": "ENV",
            "innerText": "ENV",
            "complete": true,
            "children": []
          },
          "operator": "="
        },
        {
          "startIndex": 12,
          "type": "command",
          "endIndex": 13,
          "text": "d",
          "innerText": "d",
          "complete": true,
          "children": [
            {
              "startIndex": 12,
              "type": "word",
              "endIndex": 13,
              "text": "d",
              "innerText": "d",
              "complete": true,
              "children": []
            }
          ]
        }
      ],
      "hasCommand": true
    }
  ]
}

// Case 26
{
  "startIndex": 0,
  "type": "program",
  "endIndex": 11,
  "text": "ENV=a\"b\"'c'",
  "innerText": "ENV=a\"b\"'c'",
  "complete": true,
  "children": [
    {
      "startIndex": 0,
      "type": "assignment_list",
      "endIndex": 11,
      "text": "ENV=a\"b\"'c'",
      "innerText": "ENV=a\"b\"'c'",
      "complete": true,
      "children": [
        {
          "startIndex": 0,
          "type": "assignment",
          "endIndex": 11,
          "text": "ENV=a\"b\"'c'",
          "innerText": "ENV=a\"b\"'c'",
          "complete": true,
          "children": [
            {
              "startIndex": 4,
              "type": "concatenation",
              "endIndex": 11,
              "text": "a\"b\"'c'",
              "innerText": "abc",
              "complete": true,
              "children": [
                {
                  "startIndex": 4,
                  "type": "word",
                  "endIndex": 5,
                  "text": "a",
                  "innerText": "a",
                  "complete": true,
                  "children": []
                },
                {
                  "startIndex": 5,
                  "type": "string",
                  "endIndex": 8,
                  "text": "\"b\"",
                  "innerText": "b",
                  "complete": true,
                  "children": []
                },
                {
                  "startIndex": 8,
                  "type": "raw_string",
                  "endIndex": 11,
                  "text": "'c'",
                  "innerText": "c",
                  "complete": true,
                  "children": []
                }
              ]
            }
          ],
          "name": {
            "startIndex": 0,
            "type": "variable_name",
            "endIndex": 3,
            "text": "ENV",
            "innerText": "ENV",
            "complete": true,
            "children": []
          },
          "operator": "="
        }
      ],
      "hasCommand": false
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/scripts/clone-fig.ps1]---
Location: vscode-main/extensions/terminal-suggest/scripts/clone-fig.ps1

```powershell
git clone https://github.com/withfig/autocomplete third_party/autocomplete
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/scripts/clone-fig.sh]---
Location: vscode-main/extensions/terminal-suggest/scripts/clone-fig.sh

```bash
git clone https://github.com/withfig/autocomplete third_party/autocomplete
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/scripts/pullFishBuiltins.ts]---
Location: vscode-main/extensions/terminal-suggest/scripts/pullFishBuiltins.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs/promises';
import * as path from 'path';
import { cleanupText, checkWindows, execAsync, copyright } from './terminalScriptHelpers';

checkWindows();

interface ICommandDetails {
	description: string;
	args: string | undefined;
	shortDescription?: string;
}

let fishBuiltinsCommandDescriptionsCache = new Map<string, ICommandDetails>();

// Fallback descriptions for commands that don't return proper help information
const fallbackDescriptions: Record<string, ICommandDetails> = {
	'[': {
		shortDescription: 'Test if a statement is true',
		description: 'Evaluate an expression and return a status of true (0) or false (non-zero). Unlike the `test` command, the `[` command requires a closing `]`.',
		args: 'EXPRESSION ]'
	},
	'break': {
		shortDescription: 'Exit the current loop',
		description: 'Terminate the execution of the nearest enclosing `while` or `for` loop and proceed with the next command after the loop.',
		args: undefined
	},
	'breakpoint': {
		shortDescription: 'Launch debug mode',
		description: 'Pause execution and launch an interactive debug prompt. This is useful for inspecting the state of a script at a specific point.',
		args: undefined
	},
	'case': {
		shortDescription: 'Match a value against patterns',
		description: 'Within a `switch` block, the `case` command specifies patterns to match against the given value, executing the associated block if a match is found.',
		args: 'PATTERN...'
	},
	'continue': {
		shortDescription: 'Skip to the next iteration of a loop',
		description: 'Within a `while` or `for` loop, `continue` skips the remaining commands in the current iteration and proceeds to the next iteration of the loop.',
		args: undefined
	},
	'else': {
		shortDescription: 'Execute commands if the previous condition was false',
		description: 'In an `if` block, the `else` section contains commands that execute if none of the preceding `if` or `else if` conditions were true.',
		args: undefined
	},
	'end': {
		shortDescription: 'Terminate a block of code',
		description: 'Conclude a block of code initiated by constructs like `if`, `switch`, `while`, `for`, or `function`.',
		args: undefined
	},
	'eval': {
		shortDescription: 'Execute arguments as a command',
		description: 'Concatenate all arguments into a single command and execute it. This allows for dynamic construction and execution of commands.',
		args: 'COMMAND...'
	},
	'false': {
		shortDescription: 'Return an unsuccessful result',
		description: 'A command that returns a non-zero exit status, indicating failure. It is often used in scripts to represent a false condition.',
		args: undefined
	},
	'realpath': {
		shortDescription: 'Resolve and print the absolute path',
		description: 'Convert each provided path to its absolute, canonical form by resolving symbolic links and relative path components.',
		args: 'PATH...'
	},
	':': {
		shortDescription: 'No operation command',
		description: 'The `:` command is a no-op (no operation) command that returns a successful (zero) exit status. It can be used as a placeholder in scripts where a command is syntactically required but no action is desired.',
		args: undefined
	},
	'test': {
		shortDescription: 'Evaluate conditional expressions',
		description: 'The `test` command evaluates conditional expressions and sets the exit status to 0 if the expression is true, and 1 if it is false. It supports various operators to evaluate expressions related to strings, numbers, and file attributes.',
		args: 'EXPRESSION'
	},
	'true': {
		shortDescription: 'Return a successful result',
		description: 'The `true` command always returns a successful (zero) exit status. It is often used in scripts and conditional statements where an unconditional success result is needed.',
		args: undefined
	},
	'printf': {
		shortDescription: 'Display formatted text',
		description: 'The `printf` command formats and prints text according to a specified format string. Unlike `echo`, `printf` does not append a newline unless explicitly included in the format.',
		args: 'FORMAT [ARGUMENT...]'
	}
};


async function createCommandDescriptionsCache(): Promise<void> {
	const cachedCommandDescriptions: Map<string, { shortDescription?: string; description: string; args: string | undefined }> = new Map();

	try {
		// Get list of all builtins
		const builtinsOutput = await execAsync('fish -c "builtin -n"').then(r => r.stdout.trim());
		const builtins = builtinsOutput.split('\n');

		console.log(`Found ${builtins.length} Fish builtin commands`);

		for (const cmd of builtins) {
			try {
				// Get help info for each builtin
				const helpOutput = await execAsync(`fish -c "${cmd} --help 2>&1"`).then(r => r.stdout);
				let set = false;
				if (helpOutput && !helpOutput.includes('No help for function') && !helpOutput.includes('See the web documentation')) {
					const cleanHelpText = cleanupText(helpOutput);

					// Split the text into lines to process
					const lines = cleanHelpText.split('\n');


					// Extract the short description, args, and full description
					const { shortDescription, args, description } = extractHelpContent(cmd, lines);

					cachedCommandDescriptions.set(cmd, {
						shortDescription,
						description,
						args
					});
					set = description !== '';
				}
				if (!set) {
					// Use fallback descriptions for commands that don't return proper help
					if (fallbackDescriptions[cmd]) {
						console.info(`Using fallback description for ${cmd}`);
						cachedCommandDescriptions.set(cmd, fallbackDescriptions[cmd]);
					} else {
						console.info(`No fallback description exists for ${cmd}`);
					}
				}
			} catch {
				// Use fallback descriptions for commands that throw an error
				if (fallbackDescriptions[cmd]) {
					console.info('Using fallback description for', cmd);
					cachedCommandDescriptions.set(cmd, fallbackDescriptions[cmd]);
				} else {
					console.info(`Error getting help for ${cmd}`);
				}
			}
		}
	} catch (e) {
		console.error('Error creating Fish builtins cache:', e);
		process.exit(1);
	}

	fishBuiltinsCommandDescriptionsCache = cachedCommandDescriptions;
}

/**
 * Extracts short description, args, and full description from help text lines
 */
function extractHelpContent(cmd: string, lines: string[]): { shortDescription: string; args: string | undefined; description: string } {
	let shortDescription = '';
	let args: string | undefined;
	let description = '';

	// Skip the first line (usually just command name and basic usage)
	let i = 1;

	// Skip any leading empty lines
	while (i < lines.length && lines[i].trim().length === 0) {
		i++;
	}

	// The next non-empty line after the command name is typically
	// either the short description or additional usage info
	const startLine = i;

	// Find where the short description starts
	if (i < lines.length) {
		// First, check if the line has a command prefix and remove it
		let firstContentLine = lines[i].trim();
		const cmdPrefixRegex = new RegExp(`^${cmd}\\s*-\\s*`, 'i');
		firstContentLine = firstContentLine.replace(cmdPrefixRegex, '');

		// First non-empty line is the short description
		shortDescription = firstContentLine;
		i++;

		// Next non-empty line (after short description) is typically args
		while (i < lines.length && lines[i].trim().length === 0) {
			i++;
		}

		if (i < lines.length) {
			// Found a line after the short description - that's our args
			args = lines[i].trim();
			i++;
		}
	}

	// Find the DESCRIPTION marker which marks the end of args section
	let descriptionIndex = -1;
	for (let j = i; j < lines.length; j++) {
		if (lines[j].trim() === 'DESCRIPTION') {
			descriptionIndex = j;
			break;
		}
	}

	// If DESCRIPTION marker is found, consider everything between i and descriptionIndex as part of args
	if (descriptionIndex > i) {
		// Combine lines from i up to (but not including) descriptionIndex
		const additionalArgs = lines.slice(i, descriptionIndex).join('\n').trim();
		if (additionalArgs) {
			args = args ? `${args}\n${additionalArgs}` : additionalArgs;
		}
		i = descriptionIndex + 1; // Move past the DESCRIPTION line
	}

	// The rest is the full description (skipping any empty lines after args)
	while (i < lines.length && lines[i].trim().length === 0) {
		i++;
	}

	// Combine the remaining lines into the full description
	description = lines.slice(Math.max(i, startLine)).join('\n').trim();

	// If description is empty, use the short description
	if (!description && shortDescription) {
		description = shortDescription;
	}

	// Extract just the first sentence for short description
	const firstPeriodIndex = shortDescription.indexOf('.');
	if (firstPeriodIndex > 0) {
		shortDescription = shortDescription.substring(0, firstPeriodIndex + 1).trim();
	} else if (shortDescription.length > 100) {
		shortDescription = shortDescription.substring(0, 100) + '...';
	}

	return {
		shortDescription,
		args,
		description
	};
}

const main = async () => {
	try {
		await createCommandDescriptionsCache();
		console.log('Created Fish command descriptions cache with', fishBuiltinsCommandDescriptionsCache.size, 'entries');

		// Save the cache to a TypeScript file
		const cacheFilePath = path.join(__dirname, '../src/shell/fishBuiltinsCache.ts');
		const cacheObject = Object.fromEntries(fishBuiltinsCommandDescriptionsCache);
		const tsContent = `${copyright}\n\nexport const fishBuiltinsCommandDescriptionsCache = ${JSON.stringify(cacheObject, null, 2)} as const;`;
		await fs.writeFile(cacheFilePath, tsContent, 'utf8');
		console.log('Saved Fish command descriptions cache to fishBuiltinsCache.ts with', Object.keys(cacheObject).length, 'entries');
	} catch (error) {
		console.error('Error:', error);
	}
};

main();
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/scripts/pullZshBuiltins.ts]---
Location: vscode-main/extensions/terminal-suggest/scripts/pullZshBuiltins.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs/promises';
import * as path from 'path';
import { checkWindows, execAsync, copyright } from './terminalScriptHelpers';

checkWindows();

const latestZshVersion = 5.9;

const shortDescriptions: Map<string, string> = new Map([
	['.', 'Source a file'],
	[':', 'No effect'],
	['alias', 'Define or view aliases'],
	['autoload', 'Autoload a function'],
	['bg', 'Put a job in the background'],
	['bindkey', 'Manipulate keymap names'],
	['break', 'Exit from a loop'],
	['builtin', 'Executes a builtin'],
	['bye', 'Exit the shell'],
	['cap', 'Manipulating POSIX capability sets'],
	['cd', 'Change the current directory'],
	['chdir', 'Change the current directory'],
	['clone', 'Clone shell onto another terminal'],
	['command', 'Execute a command'],
	['comparguments', 'Complete arguments'],
	['compcall', 'Complete call'],
	['compctl', 'Complete control'],
	['compdescribe', 'Complete describe'],
	['compfiles', 'Complete files'],
	['compgroups', 'Complete groups'],
	['compquote', 'Complete quote'],
	['comptags', 'Complete tags'],
	['comptry', 'Complete try'],
	['compvalues', 'Complete values'],
	['continue', 'Resume the next loop iteration'],
	['declare', 'Set or display parameter attributes/values'],
	['dirs', 'Interact with directory stack'],
	['disable', 'Disable shell features'],
	['disown', 'Remove job from job table'],
	['echo', 'Write on standard output'],
	['echotc', 'Echo terminal capabilities'],
	['echoti', 'Echo terminal info'],
	['emulate', 'Emulate a shell'],
	['enable', 'Enable shell features'],
	['eval', 'Execute arguments in shell'],
	['exec', 'Replace shell with command'],
	['exit', 'Exit the shell'],
	['export', 'Export to environment'],
	['false', 'Return exit status of 1'],
	['fc', 'Fix command'],
	['fg', 'Put a job in the foreground'],
	['float', 'Floating point arithmetic'],
	['functions', 'List functions'],
	['getcap', 'Get capabilities'],
	['getln', 'Get line from buffer'],
	['getopts', 'Parse positional parameters'],
	['hash', 'Remember command locations'],
	['history', 'Command history'],
	['integer', 'Integer arithmetic'],
	['jobs', 'List active jobs'],
	['kill', 'Send a signal to a process'],
	['let', 'Evaluate arithmetic expression'],
	['limit', 'Set or display resource limits'],
	['local', 'Create a local variable'],
	['logout', 'Exit the shell'],
	['noglob', 'Disable filename expansion'],
	['popd', 'Remove directory from stack'],
	['print', 'Print arguments'],
	['printf', 'Format and print data'],
	['pushd', 'Add directory to stack'],
	['pushln', 'Push arguments onto the buffer'],
	['pwd', 'Print working directory'],
	['r', 'Re-execute command'],
	['read', 'Read a line from input'],
	['readonly', 'Mark variables as read-only'],
	['rehash', 'Recompute command hash table'],
	['return', 'Return from a function'],
	['sched', 'Schedule commands'],
	['set', 'Set shell options'],
	['setcap', 'Set capabilities'],
	['setopt', 'Set shell options'],
	['shift', 'Shift positional parameters'],
	['source', 'Source a file'],
	['stat', 'Display file status'],
	['suspend', 'Suspend the shell'],
	['test', 'Evaluate a conditional expression'],
	['times', 'Display shell times'],
	['trap', 'Set signal handlers'],
	['true', 'Return exit status of 0'],
	['ttyctl', 'Control terminal attributes'],
	['type', 'Describe a command'],
	['typeset', 'Set or display parameter attributes/values'],
	['ulimit', 'Set or display resource limits'],
	['umask', 'Set file creation mask'],
	['unalias', 'Removes aliases'],
	['unfunction', 'Remove function definition'],
	['unhash', 'Remove command from hash table'],
	['unlimit', 'Remove resource limits'],
	['unset', 'Unset values and attributes of variables'],
	['unsetopt', 'Unset shell options'],
	['vared', 'Edit shell variables'],
	['wait', 'Wait for a process'],
	['whence', 'Locate a command'],
	['where', 'Locate a command'],
	['which', 'Locate a command'],
	['zcompile', 'Compile functions'],
	['zformat', 'Format strings'],
	['zftp', 'Zsh FTP client'],
	['zle', 'Zsh line editor'],
	['zmodload', 'Load a module'],
	['zparseopts', 'Parse options'],
	['zprof', 'Zsh profiler'],
	['zpty', 'Zsh pseudo terminal'],
	['zregexparse', 'Parse regex'],
	['zsocket', 'Zsh socket interface'],
	['zstyle', 'Define styles'],
	['ztcp', 'Manipulate TCP sockets'],
]);

interface ICommandDetails {
	description: string;
	args: string | undefined;
	shortDescription?: string;
}

let zshBuiltinsCommandDescriptionsCache = new Map<string, ICommandDetails>();

async function createCommandDescriptionsCache(): Promise<void> {
	const cachedCommandDescriptions: Map<string, { shortDescription?: string; description: string; args: string | undefined }> = new Map();
	let output = '';
	const zshVersionOutput = await execAsync('zsh --version').then(r => r.stdout);
	const zshVersionMatch = zshVersionOutput.match(/zsh (\d+\.\d+)/);
	if (!zshVersionMatch) {
		console.error('\x1b[31mFailed to determine zsh version\x1b[0m');
		process.exit(1);
	}
	const zshVersion = parseFloat(zshVersionMatch[1]);
	if (zshVersion < latestZshVersion) {
		console.error(`\x1b[31mZsh version must be ${latestZshVersion} or higher\x1b[0m`);
		process.exit(1);
	}
	try {
		output = await execAsync('pandoc --from man --to markdown --wrap=none < $(man -w zshbuiltins)').then(r => r.stdout);
	} catch {
	}

	const commands: Map<string, string[]> = new Map();
	const commandRegex = /^\*\*(?<command>[a-z\.:]+)\*\*(?:\s\*.+\*)?(?:\s\\\[.+\\\])?$/;
	if (output) {
		const lines = output.split('\n');
		let currentCommand: string | undefined;
		let currentCommandStart = 0;
		let seenOutput = false;
		let i = 0;
		for (; i < lines.length; i++) {
			if (!currentCommand || seenOutput) {
				const match = lines[i].match(commandRegex);
				if (match?.groups?.command) {
					if (currentCommand) {
						commands.set(currentCommand, lines.slice(currentCommandStart, i));
					}
					currentCommand = match.groups.command;
					currentCommandStart = i;
					seenOutput = false;
				}
			}
			if (!currentCommand) {
				continue;
			}
			// There may be several examples of usage
			if (!seenOutput) {
				seenOutput = lines[i].length > 0 && !lines[i].match(commandRegex);
			}
		}
		if (currentCommand) {
			commands.set(currentCommand, lines.slice(currentCommandStart, i - 1));
		}
	}

	if (commands.size === 0) {
		console.error('\x1b[31mFailed to parse command descriptions\x1b[30m');
		process.exit(1);
	}

	for (const [command, lines] of commands) {
		const shortDescription = shortDescriptions.get(command);
		let argsEnd = 0;
		try {
			while (true) {
				const line = lines[++argsEnd];
				if (line.trim().length > 0 && !line.match(commandRegex)) {
					break;
				}
			}
		} catch (e) {
			console.log(e);
		}
		const formattedArgs = lines.slice(0, argsEnd - 1).join('\n');
		const args = (await execAsync(`pandoc --from markdown --to plain <<< "${formattedArgs}"`)).stdout.trim();
		const description = lines.slice(argsEnd).map(e => formatLineAsMarkdown(e)).join('\n').trim();
		if (shortDescription) {
			cachedCommandDescriptions.set(command, {
				shortDescription,
				description,
				args
			});
		} else {
			cachedCommandDescriptions.set(command, {
				description,
				args
			});
		}
	}

	zshBuiltinsCommandDescriptionsCache = cachedCommandDescriptions;
}

function formatLineAsMarkdown(text: string): string {
	// Detect any inline code blocks which use the form `code' (backtick, single quote) and convert
	// them to standard markdown `code` (backtick, backtick). This doesn't attempt to remove
	// formatting inside the code blocks. We probably need to use the original .troff format to do
	// this
	const formattedText = text.replace(/\\`([^']+)\\'/g, '`$1`');
	return formattedText;
}

const main = async () => {
	try {
		await createCommandDescriptionsCache();
		console.log('created command descriptions cache with ', zshBuiltinsCommandDescriptionsCache.size, 'entries');

		const missingShortDescription: string[] = [];
		for (const [command, entry] of zshBuiltinsCommandDescriptionsCache.entries()) {
			if (entry.shortDescription === undefined) {
				missingShortDescription.push(command);
			}
		}
		if (missingShortDescription.length > 0) {
			console.log('\x1b[31mmissing short description for commands:\n' + missingShortDescription.join('\n') + '\x1b[0m');
		}

		// Save the cache to a TypeScript file
		const cacheFilePath = path.join(__dirname, '../src/shell/zshBuiltinsCache.ts');
		const cacheObject = Object.fromEntries(zshBuiltinsCommandDescriptionsCache);
		const tsContent = `${copyright}\n\nexport const zshBuiltinsCommandDescriptionsCache = ${JSON.stringify(cacheObject, null, 2)} as const;`;
		await fs.writeFile(cacheFilePath, tsContent, 'utf8');
		console.log('saved command descriptions cache to zshBuiltinsCache.ts with ', Object.keys(cacheObject).length, 'entries');
	} catch (error) {
		console.error('Error:', error);
	}
};

main();
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/scripts/terminalScriptHelpers.ts]---
Location: vscode-main/extensions/terminal-suggest/scripts/terminalScriptHelpers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { platform } from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

export const execAsync = promisify(exec);

/**
 * Cleans up text from terminal control sequences and formatting artifacts
 */
export function cleanupText(text: string): string {
	// Remove ANSI escape codes
	let cleanedText = text.replace(/\x1b\[\d+m/g, '');

	// Remove backspace sequences (like a\bb which tries to print a, move back, print b)
	// This regex looks for a character followed by a backspace and another character
	const backspaceRegex = /.\x08./g;
	while (backspaceRegex.test(cleanedText)) {
		cleanedText = cleanedText.replace(backspaceRegex, match => match.charAt(2));
	}

	// Remove any remaining backspaces and their preceding characters
	cleanedText = cleanedText.replace(/.\x08/g, '');

	// Remove underscores that are used for formatting in some fish help output
	cleanedText = cleanedText.replace(/_\b/g, '');

	return cleanedText;
}

/**
 * Copyright notice for generated files
 */
export const copyright = `/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/`;

/**
 * Checks if the script is running on Windows and exits if so
 */
export function checkWindows(): void {
	if (platform() === 'win32') {
		console.error('\x1b[31mThis command is not supported on Windows\x1b[0m');
		process.exit(1);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/scripts/update-specs.js]---
Location: vscode-main/extensions/terminal-suggest/scripts/update-specs.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check

const fs = require('fs');
const path = require('path');

const upstreamSpecs = require('../out/constants.js').upstreamSpecs;
const extRoot = path.resolve(path.join(__dirname, '..'));
const replaceStrings = [
	[
		'import { filepaths } from "@fig/autocomplete-generators";',
		'import { filepaths } from \'../../helpers/filepaths\';'
	],
	[
		'import { filepaths, keyValue } from "@fig/autocomplete-generators";',
		'import { filepaths } from \'../../helpers/filepaths\'; import { keyValue } from \'../../helpers/keyvalue\';'
	],
];
const indentSearch = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(e => new RegExp('^' + ' '.repeat(e * 2), 'gm'));
const indentReplaceValue = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(e => '\t'.repeat(e));

const specSpecificReplaceStrings = new Map([
	['docker', [
		[
			'console.error(error);',
			'console.error(error); return null!;'
		]
	]],
	['dotnet', [
		[
			'.match(argRegex)',
			'.match(argRegex)!'
		], [
			'"https://upload.wikimedia.org/wikipedia/commons/7/7d/Microsoft_.NET_logo.svg";',
			'undefined;',
		]
	]],
	['gh', [
		[
			'const parts = elm.match(/\\S+/g);',
			'const parts = elm.match(/\\S+/g)!;'
		],
		[
			'description: repo.description,',
			'description: repo.description ?? undefined,'
		],
		[
			'icon: "fig://icon?type=git"',
			'icon: "vscode://icon?type=11"'
		]
	]],
	['git', [
		[
			'import { ai } from "@fig/autocomplete-generators";',
			'function ai(...args: any[]): undefined { return undefined; }'
		], [
			'prompt: async ({ executeCommand }) => {',
			'prompt: async ({ executeCommand }: any) => {'
		], [
			'message: async ({ executeCommand }) =>',
			'message: async ({ executeCommand }: any) =>'
		]
	]],
	['yo', [
		[
			'icon: "https://avatars.githubusercontent.com/u/1714870?v=4",',
			'icon: undefined,',
		]
	]],
]);

for (const spec of upstreamSpecs) {
	const source = path.join(extRoot, `third_party/autocomplete/src/${spec}.ts`);
	const destination = path.join(extRoot, `src/completions/upstream/${spec}.ts`);
	fs.copyFileSync(source, destination);

	let content = fs.readFileSync(destination).toString();
	for (const replaceString of replaceStrings) {
		content = content.replaceAll(replaceString[0], replaceString[1]);
	}
	for (let i = 0; i < indentSearch.length; i++) {
		content = content.replaceAll(indentSearch[i], indentReplaceValue[i]);
	}
	const thisSpecReplaceStrings = specSpecificReplaceStrings.get(spec);
	if (thisSpecReplaceStrings) {
		for (const replaceString of thisSpecReplaceStrings) {
			content = content.replaceAll(replaceString[0], replaceString[1]);
		}
	}

	fs.writeFileSync(destination, content);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/scripts/update-specs.ps1]---
Location: vscode-main/extensions/terminal-suggest/scripts/update-specs.ps1

```powershell
node "$PSScriptRoot/update-specs.js"
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/scripts/update-specs.sh]---
Location: vscode-main/extensions/terminal-suggest/scripts/update-specs.sh

```bash
node ./update-specs.js
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/constants.ts]---
Location: vscode-main/extensions/terminal-suggest/src/constants.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const upstreamSpecs = [
	'basename',
	'cat',
	'chmod',
	'chown',
	'clear',
	'cp',
	'curl',
	'cut',
	'date',
	'dd',
	'df',
	'diff',
	'dig',
	'dirname',
	'du',
	'echo',
	'env',
	'export',
	'fdisk',
	'find',
	'fmt',
	'fold',
	'grep',
	'head',
	'htop',
	'id',
	'jq',
	'kill',
	'killall',
	'less',
	'ln',
	'ls',
	'lsblk',
	'lsof',
	'mkdir',
	'more',
	'mount',
	'mv',
	'nl',
	'od',
	'paste',
	'ping',
	'pkill',
	'ps',
	'pwd',
	'readlink',
	'rm',
	'rmdir',
	'rsync',
	'scp',
	'sed',
	'seq',
	'shred',
	'sort',
	'source',
	'split',
	'stat',
	'su',
	'sudo',
	'tac',
	'tail',
	'tar',
	'tee',
	'time',
	'top',
	'touch',
	'tr',
	'traceroute',
	'tree',
	'truncate',
	'uname',
	'uniq',
	'unzip',
	'wc',
	'wget',
	'where',
	'whereis',
	'which',
	'who',
	'xargs',
	'xxd',
	'zip',

	// OS package management
	'apt',
	'brew',

	// Editors
	'nano',
	'vim',

	// Shells
	'ssh',

	// Android
	'adb',

	// Docker
	'docker',
	'docker-compose',

	// Dotnet
	'dotnet',

	// Go
	'go',

	// JavaScript / TypeScript
	'node',
	'npm',
	'nvm',
	'pnpm',
	'yarn',
	'yo',

	// Python
	'python',
	'python3',
	'ruff',

	// Ruby
	'bundle',
	'ruby',
];


export const enum SettingsIds {
	SuggestPrefix = 'terminal.integrated.suggest',
	CachedWindowsExecutableExtensions = 'terminal.integrated.suggest.windowsExecutableExtensions',
	CachedWindowsExecutableExtensionsSuffixOnly = 'windowsExecutableExtensions',
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/terminalSuggestMain.ts]---
Location: vscode-main/extensions/terminal-suggest/src/terminalSuggestMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExecOptionsWithStringEncoding } from 'child_process';
import * as fs from 'fs';
import { basename, delimiter } from 'path';
import * as vscode from 'vscode';
import azdSpec from './completions/azd';
import cdSpec from './completions/cd';
import codeCompletionSpec from './completions/code';
import codeInsidersCompletionSpec from './completions/code-insiders';
import codeTunnelCompletionSpec from './completions/code-tunnel';
import codeTunnelInsidersCompletionSpec from './completions/code-tunnel-insiders';
import copilotSpec from './completions/copilot';
import gitCompletionSpec from './completions/git';
import ghCompletionSpec from './completions/gh';
import npxCompletionSpec from './completions/npx';
import setLocationSpec from './completions/set-location';
import { upstreamSpecs } from './constants';
import { ITerminalEnvironment, PathExecutableCache } from './env/pathExecutableCache';
import { executeCommand, executeCommandTimeout, IFigExecuteExternals } from './fig/execute';
import { getFigSuggestions } from './fig/figInterface';
import { createCompletionItem } from './helpers/completionItem';
import { osIsWindows } from './helpers/os';
import { createTimeoutPromise } from './helpers/promise';
import { getFriendlyResourcePath } from './helpers/uri';
import { getBashGlobals } from './shell/bash';
import { getFishGlobals } from './shell/fish';
import { getPwshGlobals } from './shell/pwsh';
import { getZshGlobals } from './shell/zsh';
import { defaultShellTypeResetChars, getTokenType, shellTypeResetChars, TokenType } from './tokens';
import type { ICompletionResource } from './types';
export const enum TerminalShellType {
	Bash = 'bash',
	Fish = 'fish',
	Zsh = 'zsh',
	PowerShell = 'pwsh',
	WindowsPowerShell = 'powershell',
	GitBash = 'gitbash',
}

const isWindows = osIsWindows();
type ShellGlobalsCacheEntry = {
	commands: ICompletionResource[] | undefined;
	existingCommands?: string[];
};

type ShellGlobalsCacheEntryWithMeta = ShellGlobalsCacheEntry & { timestamp: number };
const cachedGlobals: Map<string, ShellGlobalsCacheEntryWithMeta> = new Map();
const inflightRequests: Map<string, Promise<ICompletionResource[] | undefined>> = new Map();
let pathExecutableCache: PathExecutableCache;
const CACHE_KEY = 'terminalSuggestGlobalsCacheV2';
let globalStorageUri: vscode.Uri;
const CACHE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getCacheKey(machineId: string, remoteAuthority: string | undefined, shellType: TerminalShellType): string {
	return `${machineId}:${remoteAuthority ?? 'local'}:${shellType}`;
}

export const availableSpecs: Fig.Spec[] = [
	azdSpec,
	cdSpec,
	codeInsidersCompletionSpec,
	codeCompletionSpec,
	codeTunnelCompletionSpec,
	codeTunnelInsidersCompletionSpec,
	copilotSpec,
	gitCompletionSpec,
	ghCompletionSpec,
	npxCompletionSpec,
	setLocationSpec,
];
for (const spec of upstreamSpecs) {
	availableSpecs.push(require(`./completions/upstream/${spec}`).default);
}

const getShellSpecificGlobals: Map<TerminalShellType, (options: ExecOptionsWithStringEncoding, existingCommands?: Set<string>) => Promise<(string | ICompletionResource)[]>> = new Map([
	[TerminalShellType.Bash, getBashGlobals],
	[TerminalShellType.Zsh, getZshGlobals],
	[TerminalShellType.GitBash, getBashGlobals], // Git Bash is a bash shell
	// TODO: Ghost text in the command line prevents completions from working ATM for fish
	[TerminalShellType.Fish, getFishGlobals],
	[TerminalShellType.PowerShell, getPwshGlobals],
	[TerminalShellType.WindowsPowerShell, getPwshGlobals],
]);

async function getShellGlobals(
	shellType: TerminalShellType,
	existingCommands?: Set<string>,
	machineId?: string,
	remoteAuthority?: string
): Promise<ICompletionResource[] | undefined> {
	if (!machineId) {
		// fallback: don't cache
		return await fetchAndCacheShellGlobals(shellType, existingCommands, undefined, undefined);
	}
	const cacheKey = getCacheKey(machineId, remoteAuthority, shellType);
	const cached = cachedGlobals.get(cacheKey);
	const now = Date.now();
	const existingCommandsArr = existingCommands ? Array.from(existingCommands) : undefined;
	let shouldRefresh = false;
	if (cached) {
		// Evict if too old
		if (now - cached.timestamp > CACHE_MAX_AGE_MS) {
			cachedGlobals.delete(cacheKey);
			await writeGlobalsCache();
		} else {
			if (existingCommandsArr && cached.existingCommands) {
				if (existingCommandsArr.length !== cached.existingCommands.length) {
					shouldRefresh = true;
				}
			} else if (existingCommandsArr || cached.existingCommands) {
				shouldRefresh = true;
			}
			if (!shouldRefresh && cached.commands) {
				// NOTE: This used to trigger a background refresh in order to ensure all commands
				// are up to date, but this ends up launching way too many processes. Especially on
				// Windows where this caused significant performance issues as processes can block
				// the extension host for several seconds
				// (https://github.com/microsoft/vscode/issues/259343).
				return cached.commands;
			}
		}
	}
	// No cache or should refresh
	return await fetchAndCacheShellGlobals(shellType, existingCommands, machineId, remoteAuthority);
}

async function fetchAndCacheShellGlobals(
	shellType: TerminalShellType,
	existingCommands?: Set<string>,
	machineId?: string,
	remoteAuthority?: string,
	background?: boolean
): Promise<ICompletionResource[] | undefined> {
	const cacheKey = getCacheKey(machineId ?? 'no-machine-id', remoteAuthority, shellType);

	// Check if there's a cached entry
	const cached = cachedGlobals.get(cacheKey);
	if (cached) {
		return cached.commands;
	}

	// Check if there's already an in-flight request for this cache key
	const existingRequest = inflightRequests.get(cacheKey);
	if (existingRequest) {
		// Wait for the existing request to complete rather than spawning a new process
		return existingRequest;
	}

	// Create a new request and store it in the inflight map
	const requestPromise = (async () => {
		try {
			let execShellType = shellType;
			if (shellType === TerminalShellType.GitBash) {
				execShellType = TerminalShellType.Bash; // Git Bash is a bash shell
			}
			const options: ExecOptionsWithStringEncoding = { encoding: 'utf-8', shell: execShellType, windowsHide: true };
			const mixedCommands: (string | ICompletionResource)[] | undefined = await getShellSpecificGlobals.get(shellType)?.(options, existingCommands);
			const normalizedCommands = mixedCommands?.map(command => typeof command === 'string' ? ({ label: command }) : command);
			if (machineId) {
				const cacheKey = getCacheKey(machineId, remoteAuthority, shellType);
				cachedGlobals.set(cacheKey, {
					commands: normalizedCommands,
					existingCommands: existingCommands ? Array.from(existingCommands) : undefined,
					timestamp: Date.now()
				});
				await writeGlobalsCache();
			}
			return normalizedCommands;
		} catch (error) {
			if (!background) {
				console.error('Error fetching builtin commands:', error);
			}
			return;
		} finally {
			// Always remove the promise from inflight requests when done
			inflightRequests.delete(cacheKey);
		}
	})();

	// Store the promise in the inflight map
	inflightRequests.set(cacheKey, requestPromise);

	return requestPromise;
}


async function writeGlobalsCache(): Promise<void> {
	if (!globalStorageUri) {
		return;
	}
	// Remove old entries
	const now = Date.now();
	for (const [key, value] of cachedGlobals.entries()) {
		if (now - value.timestamp > CACHE_MAX_AGE_MS) {
			cachedGlobals.delete(key);
		}
	}
	const obj: Record<string, ShellGlobalsCacheEntryWithMeta> = {};
	for (const [key, value] of cachedGlobals.entries()) {
		obj[key] = value;
	}
	try {
		// Ensure the directory exists
		const terminalSuggestDir = vscode.Uri.joinPath(globalStorageUri, 'terminal-suggest');
		await vscode.workspace.fs.createDirectory(terminalSuggestDir);
		const cacheFile = vscode.Uri.joinPath(terminalSuggestDir, `${CACHE_KEY}.json`);
		const data = Buffer.from(JSON.stringify(obj), 'utf8');
		await vscode.workspace.fs.writeFile(cacheFile, data);
	} catch (err) {
		console.error('Failed to write terminal suggest globals cache:', err);
	}
}


async function readGlobalsCache(): Promise<void> {
	if (!globalStorageUri) {
		return;
	}
	try {
		const terminalSuggestDir = vscode.Uri.joinPath(globalStorageUri, 'terminal-suggest');
		const cacheFile = vscode.Uri.joinPath(terminalSuggestDir, `${CACHE_KEY}.json`);
		const data = await vscode.workspace.fs.readFile(cacheFile);
		const obj = JSON.parse(data.toString()) as Record<string, ShellGlobalsCacheEntryWithMeta>;
		if (obj) {
			for (const key of Object.keys(obj)) {
				cachedGlobals.set(key, obj[key]);
			}
		}
	} catch (err) {
		// File might not exist yet, which is expected on first run
		if (err instanceof vscode.FileSystemError && err.code === 'FileNotFound') {
			// This is expected on first run
			return;
		}
		console.error('Failed to read terminal suggest globals cache:', err);
	}
}



export async function activate(context: vscode.ExtensionContext) {
	pathExecutableCache = new PathExecutableCache();
	context.subscriptions.push(pathExecutableCache);
	let currentTerminalEnv: ITerminalEnvironment = process.env;

	globalStorageUri = context.globalStorageUri;
	await readGlobalsCache();

	// Get a machineId for this install (persisted per machine, not synced)
	const machineId = await vscode.env.machineId;
	const remoteAuthority = vscode.env.remoteName;

	context.subscriptions.push(vscode.window.registerTerminalCompletionProvider({
		async provideTerminalCompletions(terminal: vscode.Terminal, terminalContext: vscode.TerminalCompletionContext, token: vscode.CancellationToken): Promise<vscode.TerminalCompletionItem[] | vscode.TerminalCompletionList | undefined> {
			currentTerminalEnv = terminal.shellIntegration?.env?.value ?? process.env;
			if (token.isCancellationRequested) {
				console.debug('#terminalCompletions token cancellation requested');
				return;
			}

			const shellType: string | undefined = 'shell' in terminal.state ? terminal.state.shell as string : undefined;
			const terminalShellType = getTerminalShellType(shellType);
			if (!terminalShellType) {
				console.debug(`#terminalCompletions Shell type ${shellType} not supported`);
				return;
			}

			const commandsInPath = await pathExecutableCache.getExecutablesInPath(terminal.shellIntegration?.env?.value, terminalShellType);
			const shellGlobals = await getShellGlobals(terminalShellType, commandsInPath?.labels, machineId, remoteAuthority) ?? [];

			if (!commandsInPath?.completionResources) {
				console.debug('#terminalCompletions No commands found in path');
				return;
			}
			// Order is important here, add shell globals first so they are prioritized over path commands
			const commands = [...shellGlobals, ...commandsInPath.completionResources];
			const currentCommandString = getCurrentCommandAndArgs(terminalContext.commandLine, terminalContext.cursorIndex, terminalShellType);
			const pathSeparator = isWindows ? '\\' : '/';
			const tokenType = getTokenType(terminalContext, terminalShellType);
			const result = await Promise.race([
				getCompletionItemsFromSpecs(
					availableSpecs,
					terminalContext,
					commands,
					currentCommandString,
					tokenType,
					terminal.shellIntegration?.cwd,
					getEnvAsRecord(currentTerminalEnv),
					terminal.name,
					token
				),
				createTimeoutPromise(5000, undefined)
			]);
			if (!result) {
				console.debug('#terminalCompletions Timed out fetching completions from specs');
				return;
			}

			if (terminal.shellIntegration?.env) {
				const homeDirCompletion = result.items.find(i => i.label === '~');
				if (homeDirCompletion && terminal.shellIntegration.env?.value?.HOME) {
					homeDirCompletion.documentation = getFriendlyResourcePath(vscode.Uri.file(terminal.shellIntegration.env.value.HOME), pathSeparator, vscode.TerminalCompletionItemKind.Folder);
					homeDirCompletion.kind = vscode.TerminalCompletionItemKind.Folder;
				}
			}

			const cwd = result.cwd ?? terminal.shellIntegration?.cwd;
			if (cwd && (result.showFiles || result.showFolders)) {
				const globPattern = createFileGlobPattern(result.fileExtensions);
				return new vscode.TerminalCompletionList(result.items, {
					showFiles: result.showFiles,
					showDirectories: result.showFolders,
					globPattern,
					cwd,
				});
			}
			return result.items;
		}
	}, '/', '\\'));
	watchPathDirectories(context, currentTerminalEnv, pathExecutableCache);

	context.subscriptions.push(vscode.commands.registerCommand('terminal.integrated.suggest.clearCachedGlobals', () => {
		cachedGlobals.clear();
	}));
}

async function watchPathDirectories(context: vscode.ExtensionContext, env: ITerminalEnvironment, pathExecutableCache: PathExecutableCache | undefined): Promise<void> {
	const pathDirectories = new Set<string>();

	const envPath = env.PATH;
	if (envPath) {
		envPath.split(delimiter).forEach(p => pathDirectories.add(p));
	}

	const activeWatchers = new Set<string>();

	let debounceTimer: NodeJS.Timeout | undefined; // debounce in case many file events fire at once
	function handleChange() {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		debounceTimer = setTimeout(() => {
			pathExecutableCache?.refresh();
			debounceTimer = undefined;
		}, 300);
	}

	// Watch each directory
	for (const dir of pathDirectories) {
		if (activeWatchers.has(dir)) {
			// Skip if already watching this directory
			continue;
		}

		try {
			const stat = await fs.promises.stat(dir);
			if (!stat.isDirectory()) {
				continue;
			}
		} catch {
			// File not found
			continue;
		}

		const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.Uri.file(dir), '*'));
		context.subscriptions.push(
			watcher,
			watcher.onDidCreate(() => handleChange()),
			watcher.onDidChange(() => handleChange()),
			watcher.onDidDelete(() => handleChange())
		);

		activeWatchers.add(dir);
	}
}

/**
 * Adjusts the current working directory based on a given current command string if it is a folder.
 * @param currentCommandString - The current command string, which might contain a folder path prefix.
 * @param currentCwd - The current working directory.
 * @returns The new working directory.
 */
export async function resolveCwdFromCurrentCommandString(currentCommandString: string, currentCwd?: vscode.Uri): Promise<vscode.Uri | undefined> {
	const prefix = currentCommandString.split(/\s+/).pop()?.trim() ?? '';

	if (!currentCwd) {
		return;
	}
	try {
		// Get the nearest folder path from the prefix. This ignores everything after the `/` as
		// they are what triggers changes in the directory.
		let lastSlashIndex: number;
		if (isWindows) {
			// TODO: This support is very basic, ideally the slashes supported would depend upon the
			//       shell type. For example git bash under Windows does not allow using \ as a path
			//       separator.
			lastSlashIndex = prefix.lastIndexOf('\\');
			if (lastSlashIndex === -1) {
				lastSlashIndex = prefix.lastIndexOf('/');
			}
		} else {
			lastSlashIndex = prefix.lastIndexOf('/');
		}
		const relativeFolder = lastSlashIndex === -1 ? '' : prefix.slice(0, lastSlashIndex);

		// Use vscode.Uri.joinPath for path resolution
		const resolvedUri = vscode.Uri.joinPath(currentCwd, relativeFolder);

		const stat = await vscode.workspace.fs.stat(resolvedUri);
		if (stat.type & vscode.FileType.Directory) {
			return resolvedUri;
		}
	} catch {
		// Ignore errors
	}

	// No valid path found
	return undefined;
}

// Retrurns the string that represents the current command and its arguments up to the cursor position.
// Uses shell specific separators to determine the current command and its arguments.
export function getCurrentCommandAndArgs(commandLine: string, cursorIndex: number, shellType: TerminalShellType | undefined): string {

	// Return an empty string if the command line is empty after trimming
	if (commandLine.trim() === '') {
		return '';
	}

	// Check if cursor is not at the end and there's non-whitespace after the cursor
	if (cursorIndex < commandLine.length && /\S/.test(commandLine[cursorIndex])) {
		return '';
	}

	// Extract the part of the line up to the cursor position
	const beforeCursor = commandLine.slice(0, cursorIndex);

	const resetChars = shellType ? shellTypeResetChars.get(shellType) ?? defaultShellTypeResetChars : defaultShellTypeResetChars;
	// Find the last reset character before the cursor
	let lastResetIndex = -1;
	for (const char of resetChars) {
		const idx = beforeCursor.lastIndexOf(char);
		if (idx > lastResetIndex) {
			lastResetIndex = idx;
		}
	}

	// The start of the current command string is after the last reset char (plus one for the char itself)
	const currentCommandStart = lastResetIndex + 1;
	const currentCommandString = beforeCursor.slice(currentCommandStart).replace(/^\s+/, '');

	return currentCommandString;
}

export function asArray<T>(x: T | T[]): T[];
export function asArray<T>(x: T | readonly T[]): readonly T[];
export function asArray<T>(x: T | T[]): T[] {
	return Array.isArray(x) ? x : [x];
}

export async function getCompletionItemsFromSpecs(
	specs: Fig.Spec[],
	terminalContext: vscode.TerminalCompletionContext,
	availableCommands: ICompletionResource[],
	currentCommandString: string,
	tokenType: TokenType,
	shellIntegrationCwd: vscode.Uri | undefined,
	env: Record<string, string>,
	name: string,
	token?: vscode.CancellationToken,
	executeExternals?: IFigExecuteExternals,
): Promise<{ items: vscode.TerminalCompletionItem[]; showFiles: boolean; showFolders: boolean; fileExtensions?: string[]; cwd?: vscode.Uri }> {
	let items: vscode.TerminalCompletionItem[] = [];
	let showFiles = false;
	let showFolders = false;
	let hasCurrentArg = false;
	let fileExtensions: string[] | undefined;

	if (isWindows) {
		const spaceIndex = currentCommandString.indexOf(' ');
		const commandEndIndex = spaceIndex === -1 ? currentCommandString.length : spaceIndex;
		const lastDotIndex = currentCommandString.lastIndexOf('.', commandEndIndex);
		if (lastDotIndex > 0) { // Don't treat dotfiles as extensions
			currentCommandString = currentCommandString.substring(0, lastDotIndex) + currentCommandString.substring(spaceIndex);
		}
	}

	let executeExternalsFallbackCwd = shellIntegrationCwd?.fsPath;
	if (!executeExternalsFallbackCwd) {
		console.error('No shellIntegrationCwd set, falling back to process.cwd()');
		executeExternalsFallbackCwd = process.cwd();
	}
	const executeExternalsFallbacks: {
		cwd: string;
		env: Record<string, string | undefined>;
	} = {
		cwd: executeExternalsFallbackCwd,
		env,
	};
	const executeExternalsWithFallback = executeExternals ?? {
		executeCommand: executeCommand.bind(executeCommand, executeExternalsFallbacks),
		executeCommandTimeout: executeCommandTimeout.bind(executeCommandTimeout, executeExternalsFallbacks),
	};

	const result = await getFigSuggestions(specs, terminalContext, availableCommands, currentCommandString, tokenType, shellIntegrationCwd, env, name, executeExternalsWithFallback, token);
	if (result) {
		hasCurrentArg ||= result.hasCurrentArg;
		showFiles ||= result.showFiles;
		showFolders ||= result.showFolders;
		fileExtensions = result.fileExtensions;
		if (result.items) {
			items = items.concat(result.items);
		}
	}

	if (tokenType === TokenType.Command) {
		// Include builitin/available commands in the results
		const labels = new Set(items.map((i) => typeof i.label === 'string' ? i.label : i.label.label));
		for (const command of availableCommands) {
			const commandTextLabel = typeof command.label === 'string' ? command.label : command.label.label;
			// Remove any file extension for matching on Windows
			const labelWithoutExtension = isWindows ? commandTextLabel.replace(/\.[^ ]+$/, '') : commandTextLabel;
			if (!labels.has(labelWithoutExtension)) {
				items.push(createCompletionItem(
					terminalContext.cursorIndex,
					currentCommandString,
					command,
					command.detail,
					command.documentation,
					vscode.TerminalCompletionItemKind.Method
				));
				labels.add(commandTextLabel);
			}
			else {
				const existingItem = items.find(i => (typeof i.label === 'string' ? i.label : i.label.label) === commandTextLabel);
				if (!existingItem) {
					continue;
				}

				existingItem.documentation ??= command.documentation;
				existingItem.detail ??= command.detail;
			}
		}
		showFiles = true;
		showFolders = true;
	} else if (!items.length && !showFiles && !showFolders && !hasCurrentArg) {
		showFiles = true;
		showFolders = true;
	}

	let cwd: vscode.Uri | undefined;
	if (shellIntegrationCwd && (showFiles || showFolders)) {
		cwd = await resolveCwdFromCurrentCommandString(currentCommandString, shellIntegrationCwd);
	}

	return { items, showFiles, showFolders, fileExtensions, cwd };
}

function getEnvAsRecord(shellIntegrationEnv: ITerminalEnvironment): Record<string, string> {
	const env: Record<string, string> = {};
	for (const [key, value] of Object.entries(shellIntegrationEnv ?? process.env)) {
		if (typeof value === 'string') {
			env[key] = value;
		}
	}
	if (!shellIntegrationEnv) {
		sanitizeProcessEnvironment(env);
	}
	return env;
}

function getTerminalShellType(shellType: string | undefined): TerminalShellType | undefined {
	switch (shellType) {
		case 'bash':
			return TerminalShellType.Bash;
		case 'gitbash':
			return TerminalShellType.GitBash;
		case 'zsh':
			return TerminalShellType.Zsh;
		case 'pwsh':
			return basename(vscode.env.shell, '.exe') === 'powershell' ? TerminalShellType.WindowsPowerShell : TerminalShellType.PowerShell;
		case 'fish':
			return TerminalShellType.Fish;
		default:
			return undefined;
	}
}

export function sanitizeProcessEnvironment(env: Record<string, string>, ...preserve: string[]): void {
	const set = preserve.reduce<Record<string, boolean>>((set, key) => {
		set[key] = true;
		return set;
	}, {});
	const keysToRemove = [
		/^ELECTRON_.$/,
		/^VSCODE_(?!(PORTABLE|SHELL_LOGIN|ENV_REPLACE|ENV_APPEND|ENV_PREPEND)).+$/,
		/^SNAP(|_.*)$/,
		/^GDK_PIXBUF_.$/,
	];
	const envKeys = Object.keys(env);
	envKeys
		.filter(key => !set[key])
		.forEach(envKey => {
			for (let i = 0; i < keysToRemove.length; i++) {
				if (envKey.search(keysToRemove[i]) !== -1) {
					delete env[envKey];
					break;
				}
			}
		});
}

function createFileGlobPattern(fileExtensions?: string[]): string | undefined {
	if (!fileExtensions || fileExtensions.length === 0) {
		return undefined;
	}
	const exts = fileExtensions.map(ext => ext.startsWith('.') ? ext.slice(1) : ext);
	if (exts.length === 1) {
		return `**/*.${exts[0]}`;
	}
	return `**/*.{${exts.join(',')}}`;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/tokens.ts]---
Location: vscode-main/extensions/terminal-suggest/src/tokens.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TerminalShellType } from './terminalSuggestMain';


export const enum TokenType {
	Command,
	Argument,
}

export const shellTypeResetChars = new Map<TerminalShellType, string[]>([
	[TerminalShellType.Bash, ['>', '>>', '<', '2>', '2>>', '&>', '&>>', '|', '|&', '&&', '||', '&', ';', '(', '{', '<<']],
	[TerminalShellType.Zsh, ['>', '>>', '<', '2>', '2>>', '&>', '&>>', '<>', '|', '|&', '&&', '||', '&', ';', '(', '{', '<<', '<<<', '<(']],
	[TerminalShellType.PowerShell, ['>', '>>', '<', '2>', '2>>', '*>', '*>>', '|', ';', ' -and ', ' -or ', ' -not ', '!', '&', ' -eq ', ' -ne ', ' -gt ', ' -lt ', ' -ge ', ' -le ', ' -like ', ' -notlike ', ' -match ', ' -notmatch ', ' -contains ', ' -notcontains ', ' -in ', ' -notin ']]
]);

export const defaultShellTypeResetChars = shellTypeResetChars.get(TerminalShellType.Bash)!;

export function getTokenType(ctx: { commandLine: string; cursorIndex: number }, shellType: TerminalShellType | undefined): TokenType {
	const commandLine = ctx.commandLine;
	const cursorPosition = ctx.cursorIndex;
	const commandResetChars = shellType === undefined ? defaultShellTypeResetChars : shellTypeResetChars.get(shellType) ?? defaultShellTypeResetChars;

	// Check for reset char before the current word
	const beforeCursor = commandLine.substring(0, cursorPosition);
	const wordStart = beforeCursor.lastIndexOf(' ') + 1;
	const beforeWord = commandLine.substring(0, wordStart);

	// Look for " <reset char> " before the word
	for (const resetChar of commandResetChars) {
		const pattern = shellType === TerminalShellType.PowerShell ? `${resetChar}` : ` ${resetChar} `;
		if (beforeWord.endsWith(pattern)) {
			return TokenType.Command;
		}
	}

	// Fallback to original logic for the very first command
	const spaceIndex = beforeCursor.lastIndexOf(' ');
	if (spaceIndex === -1) {
		return TokenType.Command;
	}
	const previousTokens = beforeCursor.substring(0, spaceIndex + 1).trim();
	if (commandResetChars.some(e => previousTokens.endsWith(e))) {
		return TokenType.Command;
	}
	return TokenType.Argument;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/types.ts]---
Location: vscode-main/extensions/terminal-suggest/src/types.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export interface ICompletionResource {
	label: string | vscode.CompletionItemLabel;
	/**
	 * The definition command of the completion, this will be the resolved value of an alias
	 * completion.
	 */
	definitionCommand?: string;
	documentation?: string | vscode.MarkdownString;
	detail?: string;
	kind?: vscode.TerminalCompletionItemKind;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/azd.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/azd.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

interface AzdEnvListItem {
	Name: string;
	DotEnvPath: string;
	HasLocal: boolean;
	HasRemote: boolean;
	IsDefault: boolean;
}

interface AzdTemplateListItem {
	name: string;
	description: string;
	repositoryPath: string;
	tags: string[];
}

interface AzdExtensionListItem {
	id: string;
	name: string;
	namespace: string;
	version: string;
	installedVersion: string;
	source: string;
}

const azdGenerators: Record<string, Fig.Generator> = {
	listEnvironments: {
		script: ['azd', 'env', 'list', '--output', 'json'],
		postProcess: (out) => {
			try {
				const envs: AzdEnvListItem[] = JSON.parse(out);
				return envs.map((env) => ({
					name: env.Name,
					displayName: env.IsDefault ? 'Default' : undefined,
				}));
			} catch {
				return [];
			}
		},
	},
	listEnvironmentVariables: {
		script: ['azd', 'env', 'get-values', '--output', 'json'],
		postProcess: (out) => {
			try {
				const envVars: Record<string, string> = JSON.parse(out);
				return Object.keys(envVars).map((key) => ({
					name: key,
				}));
			} catch {
				return [];
			}
		},
	},
	listTemplates: {
		script: ['azd', 'template', 'list', '--output', 'json'],
		postProcess: (out) => {
			try {
				const templates: AzdTemplateListItem[] = JSON.parse(out);
				return templates.map((template) => ({
					name: template.repositoryPath,
					description: template.name,
				}));
			} catch {
				return [];
			}
		},
		cache: {
			strategy: 'stale-while-revalidate',
		}
	},
	listTemplateTags: {
		script: ['azd', 'template', 'list', '--output', 'json'],
		postProcess: (out) => {
			try {
				const templates: AzdTemplateListItem[] = JSON.parse(out);
				const tagsSet = new Set<string>();

				// Collect all unique tags from all templates
				templates.forEach((template) => {
					if (template.tags && Array.isArray(template.tags)) {
						template.tags.forEach((tag) => tagsSet.add(tag));
					}
				});

				// Convert set to array and return as suggestions
				return Array.from(tagsSet).sort().map((tag) => ({
					name: tag,
				}));
			} catch {
				return [];
			}
		},
		cache: {
			strategy: 'stale-while-revalidate',
		}
	},
	listTemplatesFiltered: {
		custom: async (tokens, executeCommand, generatorContext) => {
			// Find if there's a -f or --filter flag in the tokens
			let filterValue: string | undefined;
			for (let i = 0; i < tokens.length; i++) {
				if ((tokens[i] === '-f' || tokens[i] === '--filter') && i + 1 < tokens.length) {
					filterValue = tokens[i + 1];
					break;
				}
			}

			// Build the azd command with filter if present
			const args = ['template', 'list', '--output', 'json'];
			if (filterValue) {
				args.push('--filter', filterValue);
			}

			try {
				const { stdout } = await executeCommand({
					command: 'azd',
					args: args,
				});

				const templates: AzdTemplateListItem[] = JSON.parse(stdout);
				return templates.map((template) => ({
					name: template.repositoryPath,
					description: template.name,
				}));
			} catch {
				return [];
			}
		},
		cache: {
			strategy: 'stale-while-revalidate',
		}
	},
	listExtensions: {
		script: ['azd', 'ext', 'list', '--output', 'json'],
		postProcess: (out) => {
			try {
				const extensions: AzdExtensionListItem[] = JSON.parse(out);
				const uniqueExtensions = new Map<string, AzdExtensionListItem>();

				extensions.forEach((ext) => {
					if (!uniqueExtensions.has(ext.id)) {
						uniqueExtensions.set(ext.id, ext);
					}
				});

				return Array.from(uniqueExtensions.values()).map((ext) => ({
					name: ext.id,
					description: ext.name,
				}));
			} catch {
				return [];
			}
		},
		cache: {
			strategy: 'stale-while-revalidate',
		}
	},
	listInstalledExtensions: {
		script: ['azd', 'ext', 'list', '--installed', '--output', 'json'],
		postProcess: (out) => {
			try {
				const extensions: AzdExtensionListItem[] = JSON.parse(out);
				const uniqueExtensions = new Map<string, AzdExtensionListItem>();

				extensions.forEach((ext) => {
					if (!uniqueExtensions.has(ext.id)) {
						uniqueExtensions.set(ext.id, ext);
					}
				});

				return Array.from(uniqueExtensions.values()).map((ext) => ({
					name: ext.id,
					description: ext.name,
				}));
			} catch {
				return [];
			}
		},
	},
};

const completionSpec: Fig.Spec = {
	name: 'azd',
	description: 'Azure Developer CLI',
	subcommands: [
		{
			name: ['add'],
			description: 'Add a component to your project.',
		},
		{
			name: ['ai'],
			description: 'Extension for the Foundry Agent Service. (Preview)',
			subcommands: [
				{
					name: ['agent'],
					description: 'Extension for the Foundry Agent Service. (Preview)',
				},
			],
		},
		{
			name: ['auth'],
			description: 'Authenticate with Azure.',
			subcommands: [
				{
					name: ['login'],
					description: 'Log in to Azure.',
					options: [
						{
							name: ['--check-status'],
							description: 'Checks the log-in status instead of logging in.',
						},
						{
							name: ['--client-certificate'],
							description: 'The path to the client certificate for the service principal to authenticate with.',
							args: [
								{
									name: 'client-certificate',
								},
							],
						},
						{
							name: ['--client-id'],
							description: 'The client id for the service principal to authenticate with.',
							args: [
								{
									name: 'client-id',
								},
							],
						},
						{
							name: ['--client-secret'],
							description: 'The client secret for the service principal to authenticate with. Set to the empty string to read the value from the console.',
							args: [
								{
									name: 'client-secret',
								},
							],
						},
						{
							name: ['--federated-credential-provider'],
							description: 'The provider to use to acquire a federated token to authenticate with. Supported values: github, azure-pipelines, oidc',
							args: [
								{
									name: 'federated-credential-provider',
									suggestions: ['github', 'azure-pipelines', 'oidc'],
								},
							],
						},
						{
							name: ['--managed-identity'],
							description: 'Use a managed identity to authenticate.',
						},
						{
							name: ['--redirect-port'],
							description: 'Choose the port to be used as part of the redirect URI during interactive login.',
							args: [
								{
									name: 'redirect-port',
								},
							],
						},
						{
							name: ['--tenant-id'],
							description: 'The tenant id or domain name to authenticate with.',
							args: [
								{
									name: 'tenant-id',
								},
							],
						},
						{
							name: ['--use-device-code'],
							description: 'When true, log in by using a device code instead of a browser.',
						},
					],
				},
				{
					name: ['logout'],
					description: 'Log out of Azure.',
				},
			],
		},
		{
			name: ['coding-agent'],
			description: 'This extension configures GitHub Copilot Coding Agent access to Azure',
		},
		{
			name: ['completion'],
			description: 'Generate shell completion scripts.',
			subcommands: [
				{
					name: ['bash'],
					description: 'Generate bash completion script.',
				},
				{
					name: ['fig'],
					description: 'Generate Fig autocomplete spec.',
				},
				{
					name: ['fish'],
					description: 'Generate fish completion script.',
				},
				{
					name: ['powershell'],
					description: 'Generate PowerShell completion script.',
				},
				{
					name: ['zsh'],
					description: 'Generate zsh completion script.',
				},
			],
		},
		{
			name: ['config'],
			description: 'Manage azd configurations (ex: default Azure subscription, location).',
			subcommands: [
				{
					name: ['get'],
					description: 'Gets a configuration.',
					args: {
						name: 'path',
					},
				},
				{
					name: ['list-alpha'],
					description: 'Display the list of available features in alpha stage.',
				},
				{
					name: ['reset'],
					description: 'Resets configuration to default.',
					options: [
						{
							name: ['--force', '-f'],
							description: 'Force reset without confirmation.',
							isDangerous: true,
						},
					],
				},
				{
					name: ['set'],
					description: 'Sets a configuration.',
					args: [
						{
							name: 'path',
						},
						{
							name: 'value',
						},
					],
				},
				{
					name: ['show'],
					description: 'Show all the configuration values.',
				},
				{
					name: ['unset'],
					description: 'Unsets a configuration.',
					args: {
						name: 'path',
					},
				},
			],
		},
		{
			name: ['demo'],
			description: 'This extension provides examples of the AZD extension framework.',
		},
		{
			name: ['deploy'],
			description: 'Deploy your project code to Azure.',
			options: [
				{
					name: ['--all'],
					description: 'Deploys all services that are listed in azure.yaml',
				},
				{
					name: ['--environment', '-e'],
					description: 'The name of the environment to use.',
					args: [
						{
							name: 'environment',
						},
					],
				},
				{
					name: ['--from-package'],
					description: 'Deploys the packaged service located at the provided path. Supports zipped file packages (file path) or container images (image tag).',
					args: [
						{
							name: 'file-path|image-tag',
						},
					],
				},
			],
			args: {
				name: 'service',
				isOptional: true,
			},
		},
		{
			name: ['down'],
			description: 'Delete your project\'s Azure resources.',
			options: [
				{
					name: ['--environment', '-e'],
					description: 'The name of the environment to use.',
					args: [
						{
							name: 'environment',
						},
					],
				},
				{
					name: ['--force'],
					description: 'Does not require confirmation before it deletes resources.',
					isDangerous: true,
				},
				{
					name: ['--purge'],
					description: 'Does not require confirmation before it permanently deletes resources that are soft-deleted by default (for example, key vaults).',
					isDangerous: true,
				},
			],
			args: {
				name: 'layer',
				isOptional: true,
			},
		},
		{
			name: ['env'],
			description: 'Manage environments (ex: default environment, environment variables).',
			subcommands: [
				{
					name: ['get-value'],
					description: 'Get specific environment value.',
					options: [
						{
							name: ['--environment', '-e'],
							description: 'The name of the environment to use.',
							args: [
								{
									name: 'environment',
								},
							],
						},
					],
					args: {
						name: 'keyName',
						generators: azdGenerators.listEnvironmentVariables,
					},
				},
				{
					name: ['get-values'],
					description: 'Get all environment values.',
					options: [
						{
							name: ['--environment', '-e'],
							description: 'The name of the environment to use.',
							args: [
								{
									name: 'environment',
								},
							],
						},
					],
				},
				{
					name: ['list', 'ls'],
					description: 'List environments.',
				},
				{
					name: ['new'],
					description: 'Create a new environment and set it as the default.',
					options: [
						{
							name: ['--location', '-l'],
							description: 'Azure location for the new environment',
							args: [
								{
									name: 'location',
								},
							],
						},
						{
							name: ['--subscription'],
							description: 'Name or ID of an Azure subscription to use for the new environment',
							args: [
								{
									name: 'subscription',
								},
							],
						},
					],
					args: {
						name: 'environment',
					},
				},
				{
					name: ['refresh'],
					description: 'Refresh environment values by using information from a previous infrastructure provision.',
					options: [
						{
							name: ['--environment', '-e'],
							description: 'The name of the environment to use.',
							args: [
								{
									name: 'environment',
								},
							],
						},
						{
							name: ['--hint'],
							description: 'Hint to help identify the environment to refresh',
							args: [
								{
									name: 'hint',
								},
							],
						},
						{
							name: ['--layer'],
							description: 'Provisioning layer to refresh the environment from.',
							args: [
								{
									name: 'layer',
								},
							],
						},
					],
					args: {
						name: 'environment',
					},
				},
				{
					name: ['select'],
					description: 'Set the default environment.',
					args: {
						name: 'environment',
						generators: azdGenerators.listEnvironments,
					},
				},
				{
					name: ['set'],
					description: 'Set one or more environment values.',
					options: [
						{
							name: ['--environment', '-e'],
							description: 'The name of the environment to use.',
							args: [
								{
									name: 'environment',
								},
							],
						},
						{
							name: ['--file'],
							description: 'Path to .env formatted file to load environment values from.',
							args: [
								{
									name: 'file',
								},
							],
						},
					],
					args: [
						{
							name: 'key',
							isOptional: true,
						},
						{
							name: 'value',
							isOptional: true,
						},
					],
				},
				{
					name: ['set-secret'],
					description: 'Set a name as a reference to a Key Vault secret in the environment.',
					options: [
						{
							name: ['--environment', '-e'],
							description: 'The name of the environment to use.',
							args: [
								{
									name: 'environment',
								},
							],
						},
					],
					args: {
						name: 'name',
					},
				},
			],
		},
		{
			name: ['extension', 'ext'],
			description: 'Manage azd extensions.',
			subcommands: [
				{
					name: ['install'],
					description: 'Installs specified extensions.',
					options: [
						{
							name: ['--force', '-f'],
							description: 'Force installation even if it would downgrade the current version',
							isDangerous: true,
						},
						{
							name: ['--source', '-s'],
							description: 'The extension source to use for installs',
							args: [
								{
									name: 'source',
								},
							],
						},
						{
							name: ['--version', '-v'],
							description: 'The version of the extension to install',
							args: [
								{
									name: 'version',
								},
							],
						},
					],
					args: {
						name: 'extension-id',
						generators: azdGenerators.listExtensions,
					},
				},
				{
					name: ['list'],
					description: 'List available extensions.',
					options: [
						{
							name: ['--installed'],
							description: 'List installed extensions',
						},
						{
							name: ['--source'],
							description: 'Filter extensions by source',
							args: [
								{
									name: 'source',
								},
							],
						},
						{
							name: ['--tags'],
							description: 'Filter extensions by tags',
							isRepeatable: true,
							args: [
								{
									name: 'tags',
								},
							],
						},
					],
				},
				{
					name: ['show'],
					description: 'Show details for a specific extension.',
					options: [
						{
							name: ['--source', '-s'],
							description: 'The extension source to use.',
							args: [
								{
									name: 'source',
								},
							],
						},
					],
					args: {
						name: 'extension-id',
						generators: azdGenerators.listExtensions,
					},
				},
				{
					name: ['source'],
					description: 'View and manage extension sources',
					subcommands: [
						{
							name: ['add'],
							description: 'Add an extension source with the specified name',
							options: [
								{
									name: ['--location', '-l'],
									description: 'The location of the extension source',
									args: [
										{
											name: 'location',
										},
									],
								},
								{
									name: ['--name', '-n'],
									description: 'The name of the extension source',
									args: [
										{
											name: 'name',
										},
									],
								},
								{
									name: ['--type', '-t'],
									description: 'The type of the extension source. Supported types are \'file\' and \'url\'',
									args: [
										{
											name: 'type',
										},
									],
								},
							],
						},
						{
							name: ['list'],
							description: 'List extension sources',
						},
						{
							name: ['remove'],
							description: 'Remove an extension source with the specified name',
							args: {
								name: 'name',
							},
						},
					],
				},
				{
					name: ['uninstall'],
					description: 'Uninstall specified extensions.',
					options: [
						{
							name: ['--all'],
							description: 'Uninstall all installed extensions',
						},
					],
					args: {
						name: 'extension-id',
						isOptional: true,
						generators: azdGenerators.listInstalledExtensions,
					},
				},
				{
					name: ['upgrade'],
					description: 'Upgrade specified extensions.',
					options: [
						{
							name: ['--all'],
							description: 'Upgrade all installed extensions',
						},
						{
							name: ['--source', '-s'],
							description: 'The extension source to use for upgrades',
							args: [
								{
									name: 'source',
								},
							],
						},
						{
							name: ['--version', '-v'],
							description: 'The version of the extension to upgrade to',
							args: [
								{
									name: 'version',
								},
							],
						},
					],
					args: {
						name: 'extension-id',
						isOptional: true,
						generators: azdGenerators.listInstalledExtensions,
					},
				},
			],
		},
		{
			name: ['hooks'],
			description: 'Develop, test and run hooks for a project.',
			subcommands: [
				{
					name: ['run'],
					description: 'Runs the specified hook for the project and services',
					options: [
						{
							name: ['--environment', '-e'],
							description: 'The name of the environment to use.',
							args: [
								{
									name: 'environment',
								},
							],
						},
						{
							name: ['--platform'],
							description: 'Forces hooks to run for the specified platform.',
							args: [
								{
									name: 'platform',
								},
							],
						},
						{
							name: ['--service'],
							description: 'Only runs hooks for the specified service.',
							args: [
								{
									name: 'service',
								},
							],
						},
					],
					args: {
						name: 'name',
						suggestions: [
							'prebuild',
							'postbuild',
							'predeploy',
							'postdeploy',
							'predown',
							'postdown',
							'prepackage',
							'postpackage',
							'preprovision',
							'postprovision',
							'prepublish',
							'postpublish',
							'prerestore',
							'postrestore',
							'preup',
							'postup',
						],
					},
				},
			],
		},
		{
			name: ['infra'],
			description: 'Manage your Infrastructure as Code (IaC).',
			subcommands: [
				{
					name: ['generate', 'gen', 'synth'],
					description: 'Write IaC for your project to disk, allowing you to manually manage it.',
					options: [
						{
							name: ['--environment', '-e'],
							description: 'The name of the environment to use.',
							args: [
								{
									name: 'environment',
								},
							],
						},
						{
							name: ['--force'],
							description: 'Overwrite any existing files without prompting',
							isDangerous: true,
						},
					],
				},
			],
		},
		{
			name: ['init'],
			description: 'Initialize a new application.',
			options: [
				{
					name: ['--branch', '-b'],
					description: 'The template branch to initialize from. Must be used with a template argument (--template or -t).',
					args: [
						{
							name: 'branch',
						},
					],
				},
				{
					name: ['--environment', '-e'],
					description: 'The name of the environment to use.',
					args: [
						{
							name: 'environment',
						},
					],
				},
				{
					name: ['--filter', '-f'],
					description: 'The tag(s) used to filter template results. Supports comma-separated values.',
					isRepeatable: true,
					args: [
						{
							name: 'filter',
							generators: azdGenerators.listTemplateTags,
						},
					],
				},
				{
					name: ['--from-code'],
					description: 'Initializes a new application from your existing code.',
				},
				{
					name: ['--location', '-l'],
					description: 'Azure location for the new environment',
					args: [
						{
							name: 'location',
						},
					],
				},
				{
					name: ['--minimal', '-m'],
					description: 'Initializes a minimal project.',
				},
				{
					name: ['--subscription', '-s'],
					description: 'Name or ID of an Azure subscription to use for the new environment',
					args: [
						{
							name: 'subscription',
						},
					],
				},
				{
					name: ['--template', '-t'],
					description: 'Initializes a new application from a template. You can use Full URI, <owner>/<repository>, or <repository> if it\'s part of the azure-samples organization.',
					args: [
						{
							name: 'template',
							generators: azdGenerators.listTemplatesFiltered,
						},
					],
				},
				{
					name: ['--up'],
					description: 'Provision and deploy to Azure after initializing the project from a template.',
				},
			],
		},
		{
			name: ['mcp'],
			description: 'Manage Model Context Protocol (MCP) server. (Alpha)',
			subcommands: [
				{
					name: ['consent'],
					description: 'Manage MCP tool consent.',
					subcommands: [
						{
							name: ['grant'],
							description: 'Grant consent trust rules.',
							options: [
								{
									name: ['--action'],
									description: 'Action type: \'all\' or \'readonly\'',
									args: [
										{
											name: 'action',
											suggestions: ['all', 'readonly'],
										},
									],
								},
								{
									name: ['--global'],
									description: 'Apply globally to all servers',
								},
								{
									name: ['--operation'],
									description: 'Operation type: \'tool\' or \'sampling\'',
									args: [
										{
											name: 'operation',
											suggestions: ['tool', 'sampling'],
										},
									],
								},
								{
									name: ['--permission'],
									description: 'Permission: \'allow\', \'deny\', or \'prompt\'',
									args: [
										{
											name: 'permission',
											suggestions: ['allow', 'deny', 'prompt'],
										},
									],
								},
								{
									name: ['--scope'],
									description: 'Rule scope: \'global\', or \'project\'',
									args: [
										{
											name: 'scope',
											suggestions: ['global', 'project'],
										},
									],
								},
								{
									name: ['--server'],
									description: 'Server name',
									args: [
										{
											name: 'server',
										},
									],
								},
								{
									name: ['--tool'],
									description: 'Specific tool name (requires --server)',
									args: [
										{
											name: 'tool',
										},
									],
								},
							],
						},
						{
							name: ['list'],
							description: 'List consent rules.',
							options: [
								{
									name: ['--action'],
									description: 'Action type to filter by (readonly, any)',
									args: [
										{
											name: 'action',
											suggestions: ['all', 'readonly'],
										},
									],
								},
								{
									name: ['--operation'],
									description: 'Operation to filter by (tool, sampling)',
									args: [
										{
											name: 'operation',
											suggestions: ['tool', 'sampling'],
										},
									],
								},
								{
									name: ['--permission'],
									description: 'Permission to filter by (allow, deny, prompt)',
									args: [
										{
											name: 'permission',
											suggestions: ['allow', 'deny', 'prompt'],
										},
									],
								},
								{
									name: ['--scope'],
									description: 'Consent scope to filter by (global, project). If not specified, lists rules from all scopes.',
									args: [
										{
											name: 'scope',
											suggestions: ['global', 'project'],
										},
									],
								},
								{
									name: ['--target'],
									description: 'Specific target to operate on (server/tool format)',
									args: [
										{
											name: 'target',
										},
									],
								},
							],
						},
						{
							name: ['revoke'],
							description: 'Revoke consent rules.',
							options: [
								{
									name: ['--action'],
									description: 'Action type to filter by (readonly, any)',
									args: [
										{
											name: 'action',
											suggestions: ['all', 'readonly'],
										},
									],
								},
								{
									name: ['--operation'],
									description: 'Operation to filter by (tool, sampling)',
									args: [
										{
											name: 'operation',
											suggestions: ['tool', 'sampling'],
										},
									],
								},
								{
									name: ['--permission'],
									description: 'Permission to filter by (allow, deny, prompt)',
									args: [
										{
											name: 'permission',
											suggestions: ['allow', 'deny', 'prompt'],
										},
									],
								},
								{
									name: ['--scope'],
									description: 'Consent scope to filter by (global, project). If not specified, revokes rules from all scopes.',
									args: [
										{
											name: 'scope',
											suggestions: ['global', 'project'],
										},
									],
								},
								{
									name: ['--target'],
									description: 'Specific target to operate on (server/tool format)',
									args: [
										{
											name: 'target',
										},
									],
								},
							],
						},
					],
				},
				{
					name: ['start'],
					description: 'Starts the MCP server.',
				},
			],
		},
		{
			name: ['monitor'],
			description: 'Monitor a deployed project.',
			options: [
				{
					name: ['--environment', '-e'],
					description: 'The name of the environment to use.',
					args: [
						{
							name: 'environment',
						},
					],
				},
				{
					name: ['--live'],
					description: 'Open a browser to Application Insights Live Metrics. Live Metrics is currently not supported for Python apps.',
				},
				{
					name: ['--logs'],
					description: 'Open a browser to Application Insights Logs.',
				},
				{
					name: ['--overview'],
					description: 'Open a browser to Application Insights Overview Dashboard.',
				},
			],
		},
		{
			name: ['package'],
			description: 'Packages the project\'s code to be deployed to Azure.',
			options: [
				{
					name: ['--all'],
					description: 'Packages all services that are listed in azure.yaml',
				},
				{
					name: ['--environment', '-e'],
					description: 'The name of the environment to use.',
					args: [
						{
							name: 'environment',
						},
					],
				},
				{
					name: ['--output-path'],
					description: 'File or folder path where the generated packages will be saved.',
					args: [
						{
							name: 'output-path',
						},
					],
				},
			],
			args: {
				name: 'service',
				isOptional: true,
			},
		},
		{
			name: ['pipeline'],
			description: 'Manage and configure your deployment pipelines.',
			subcommands: [
				{
					name: ['config'],
					description: 'Configure your deployment pipeline to connect securely to Azure. (Beta)',
					options: [
						{
							name: ['--applicationServiceManagementReference', '-m'],
							description: 'Service Management Reference. References application or service contact information from a Service or Asset Management database. This value must be a Universally Unique Identifier (UUID). You can set this value globally by running azd config set pipeline.config.applicationServiceManagementReference <UUID>.',
							args: [
								{
									name: 'applicationServiceManagementReference',
								},
							],
						},
						{
							name: ['--auth-type'],
							description: 'The authentication type used between the pipeline provider and Azure for deployment (Only valid for GitHub provider). Valid values: federated, client-credentials.',
							args: [
								{
									name: 'auth-type',
									suggestions: ['federated', 'client-credentials'],
								},
							],
						},
						{
							name: ['--environment', '-e'],
							description: 'The name of the environment to use.',
							args: [
								{
									name: 'environment',
								},
							],
						},
						{
							name: ['--principal-id'],
							description: 'The client id of the service principal to use to grant access to Azure resources as part of the pipeline.',
							args: [
								{
									name: 'principal-id',
								},
							],
						},
						{
							name: ['--principal-name'],
							description: 'The name of the service principal to use to grant access to Azure resources as part of the pipeline.',
							args: [
								{
									name: 'principal-name',
								},
							],
						},
						{
							name: ['--principal-role'],
							description: 'The roles to assign to the service principal. By default the service principal will be granted the Contributor and User Access Administrator roles.',
							isRepeatable: true,
							args: [
								{
									name: 'principal-role',
								},
							],
						},
						{
							name: ['--provider'],
							description: 'The pipeline provider to use (github for Github Actions and azdo for Azure Pipelines).',
							args: [
								{
									name: 'provider',
									suggestions: ['github', 'azdo'],
								},
							],
						},
						{
							name: ['--remote-name'],
							description: 'The name of the git remote to configure the pipeline to run on.',
							args: [
								{
									name: 'remote-name',
								},
							],
						},
					],
				},
			],
		},
		{
			name: ['provision'],
			description: 'Provision Azure resources for your project.',
			options: [
				{
					name: ['--environment', '-e'],
					description: 'The name of the environment to use.',
					args: [
						{
							name: 'environment',
						},
					],
				},
				{
					name: ['--no-state'],
					description: '(Bicep only) Forces a fresh deployment based on current Bicep template files, ignoring any stored deployment state.',
				},
				{
					name: ['--preview'],
					description: 'Preview changes to Azure resources.',
				},
			],
			args: {
				name: 'layer',
				isOptional: true,
			},
		},
		{
			name: ['publish'],
			description: 'Publish a service to a container registry.',
			options: [
				{
					name: ['--all'],
					description: 'Publishes all services that are listed in azure.yaml',
				},
				{
					name: ['--environment', '-e'],
					description: 'The name of the environment to use.',
					args: [
						{
							name: 'environment',
						},
					],
				},
				{
					name: ['--from-package'],
					description: 'Publishes the service from a container image (image tag).',
					args: [
						{
							name: 'image-tag',
						},
					],
				},
				{
					name: ['--to'],
					description: 'The target container image in the form \'[registry/]repository[:tag]\' to publish to.',
					args: [
						{
							name: 'image-tag',
						},
					],
				},
			],
			args: {
				name: 'service',
				isOptional: true,
			},
		},
		{
			name: ['restore'],
			description: 'Restores the project\'s dependencies.',
			options: [
				{
					name: ['--all'],
					description: 'Restores all services that are listed in azure.yaml',
				},
				{
					name: ['--environment', '-e'],
					description: 'The name of the environment to use.',
					args: [
						{
							name: 'environment',
						},
					],
				},
			],
			args: {
				name: 'service',
				isOptional: true,
			},
		},
		{
			name: ['show'],
			description: 'Display information about your project and its resources.',
			options: [
				{
					name: ['--environment', '-e'],
					description: 'The name of the environment to use.',
					args: [
						{
							name: 'environment',
						},
					],
				},
				{
					name: ['--show-secrets'],
					description: 'Unmask secrets in output.',
					isDangerous: true,
				},
			],
			args: {
				name: 'resource-name|resource-id',
				isOptional: true,
			},
		},
		{
			name: ['template'],
			description: 'Find and view template details.',
			subcommands: [
				{
					name: ['list', 'ls'],
					description: 'Show list of sample azd templates. (Beta)',
					options: [
						{
							name: ['--filter', '-f'],
							description: 'The tag(s) used to filter template results. Supports comma-separated values.',
							isRepeatable: true,
							args: [
								{
									name: 'filter',
									generators: azdGenerators.listTemplateTags,
								},
							],
						},
						{
							name: ['--source', '-s'],
							description: 'Filters templates by source.',
							args: [
								{
									name: 'source',
								},
							],
						},
					],
				},
				{
					name: ['show'],
					description: 'Show details for a given template. (Beta)',
					args: {
						name: 'template',
						generators: azdGenerators.listTemplates,
					},
				},
				{
					name: ['source'],
					description: 'View and manage template sources. (Beta)',
					subcommands: [
						{
							name: ['add'],
							description: 'Adds an azd template source with the specified key. (Beta)',
							options: [
								{
									name: ['--location', '-l'],
									description: 'Location of the template source. Required when using type flag.',
									args: [
										{
											name: 'location',
										},
									],
								},
								{
									name: ['--name', '-n'],
									description: 'Display name of the template source.',
									args: [
										{
											name: 'name',
										},
									],
								},
								{
									name: ['--type', '-t'],
									description: 'Kind of the template source. Supported types are \'file\', \'url\' and \'gh\'.',
									args: [
										{
											name: 'type',
										},
									],
								},
							],
							args: {
								name: 'key',
							},
						},
						{
							name: ['list', 'ls'],
							description: 'Lists the configured azd template sources. (Beta)',
						},
						{
							name: ['remove'],
							description: 'Removes the specified azd template source (Beta)',
							args: {
								name: 'key',
							},
						},
					],
				},
			],
		},
		{
			name: ['up'],
			description: 'Provision and deploy your project to Azure with a single command.',
			options: [
				{
					name: ['--environment', '-e'],
					description: 'The name of the environment to use.',
					args: [
						{
							name: 'environment',
						},
					],
				},
			],
		},
		{
			name: ['version'],
			description: 'Print the version number of Azure Developer CLI.',
		},
		{
			name: ['x'],
			description: 'This extension provides a set of tools for AZD extension developers to test and debug their extensions.',
		},
		{
			name: ['help'],
			description: 'Help about any command',
			subcommands: [
				{
					name: ['add'],
					description: 'Add a component to your project.',
				},
				{
					name: ['ai'],
					description: 'Extension for the Foundry Agent Service. (Preview)',
					subcommands: [
						{
							name: ['agent'],
							description: 'Extension for the Foundry Agent Service. (Preview)',
						},
					],
				},
				{
					name: ['auth'],
					description: 'Authenticate with Azure.',
					subcommands: [
						{
							name: ['login'],
							description: 'Log in to Azure.',
						},
						{
							name: ['logout'],
							description: 'Log out of Azure.',
						},
					],
				},
				{
					name: ['coding-agent'],
					description: 'This extension configures GitHub Copilot Coding Agent access to Azure',
				},
				{
					name: ['completion'],
					description: 'Generate shell completion scripts.',
					subcommands: [
						{
							name: ['bash'],
							description: 'Generate bash completion script.',
						},
						{
							name: ['fig'],
							description: 'Generate Fig autocomplete spec.',
						},
						{
							name: ['fish'],
							description: 'Generate fish completion script.',
						},
						{
							name: ['powershell'],
							description: 'Generate PowerShell completion script.',
						},
						{
							name: ['zsh'],
							description: 'Generate zsh completion script.',
						},
					],
				},
				{
					name: ['config'],
					description: 'Manage azd configurations (ex: default Azure subscription, location).',
					subcommands: [
						{
							name: ['get'],
							description: 'Gets a configuration.',
						},
						{
							name: ['list-alpha'],
							description: 'Display the list of available features in alpha stage.',
						},
						{
							name: ['reset'],
							description: 'Resets configuration to default.',
						},
						{
							name: ['set'],
							description: 'Sets a configuration.',
						},
						{
							name: ['show'],
							description: 'Show all the configuration values.',
						},
						{
							name: ['unset'],
							description: 'Unsets a configuration.',
						},
					],
				},
				{
					name: ['demo'],
					description: 'This extension provides examples of the AZD extension framework.',
				},
				{
					name: ['deploy'],
					description: 'Deploy your project code to Azure.',
				},
				{
					name: ['down'],
					description: 'Delete your project\'s Azure resources.',
				},
				{
					name: ['env'],
					description: 'Manage environments (ex: default environment, environment variables).',
					subcommands: [
						{
							name: ['get-value'],
							description: 'Get specific environment value.',
						},
						{
							name: ['get-values'],
							description: 'Get all environment values.',
						},
						{
							name: ['list', 'ls'],
							description: 'List environments.',
						},
						{
							name: ['new'],
							description: 'Create a new environment and set it as the default.',
						},
						{
							name: ['refresh'],
							description: 'Refresh environment values by using information from a previous infrastructure provision.',
						},
						{
							name: ['select'],
							description: 'Set the default environment.',
						},
						{
							name: ['set'],
							description: 'Set one or more environment values.',
						},
						{
							name: ['set-secret'],
							description: 'Set a name as a reference to a Key Vault secret in the environment.',
						},
					],
				},
				{
					name: ['extension', 'ext'],
					description: 'Manage azd extensions.',
					subcommands: [
						{
							name: ['install'],
							description: 'Installs specified extensions.',
						},
						{
							name: ['list'],
							description: 'List available extensions.',
						},
						{
							name: ['show'],
							description: 'Show details for a specific extension.',
						},
						{
							name: ['source'],
							description: 'View and manage extension sources',
							subcommands: [
								{
									name: ['add'],
									description: 'Add an extension source with the specified name',
								},
								{
									name: ['list'],
									description: 'List extension sources',
								},
								{
									name: ['remove'],
									description: 'Remove an extension source with the specified name',
								},
							],
						},
						{
							name: ['uninstall'],
							description: 'Uninstall specified extensions.',
						},
						{
							name: ['upgrade'],
							description: 'Upgrade specified extensions.',
						},
					],
				},
				{
					name: ['hooks'],
					description: 'Develop, test and run hooks for a project.',
					subcommands: [
						{
							name: ['run'],
							description: 'Runs the specified hook for the project and services',
						},
					],
				},
				{
					name: ['infra'],
					description: 'Manage your Infrastructure as Code (IaC).',
					subcommands: [
						{
							name: ['generate', 'gen', 'synth'],
							description: 'Write IaC for your project to disk, allowing you to manually manage it.',
						},
					],
				},
				{
					name: ['init'],
					description: 'Initialize a new application.',
				},
				{
					name: ['mcp'],
					description: 'Manage Model Context Protocol (MCP) server. (Alpha)',
					subcommands: [
						{
							name: ['consent'],
							description: 'Manage MCP tool consent.',
							subcommands: [
								{
									name: ['grant'],
									description: 'Grant consent trust rules.',
								},
								{
									name: ['list'],
									description: 'List consent rules.',
								},
								{
									name: ['revoke'],
									description: 'Revoke consent rules.',
								},
							],
						},
						{
							name: ['start'],
							description: 'Starts the MCP server.',
						},
					],
				},
				{
					name: ['monitor'],
					description: 'Monitor a deployed project.',
				},
				{
					name: ['package'],
					description: 'Packages the project\'s code to be deployed to Azure.',
				},
				{
					name: ['pipeline'],
					description: 'Manage and configure your deployment pipelines.',
					subcommands: [
						{
							name: ['config'],
							description: 'Configure your deployment pipeline to connect securely to Azure. (Beta)',
						},
					],
				},
				{
					name: ['provision'],
					description: 'Provision Azure resources for your project.',
				},
				{
					name: ['publish'],
					description: 'Publish a service to a container registry.',
				},
				{
					name: ['restore'],
					description: 'Restores the project\'s dependencies.',
				},
				{
					name: ['show'],
					description: 'Display information about your project and its resources.',
				},
				{
					name: ['template'],
					description: 'Find and view template details.',
					subcommands: [
						{
							name: ['list', 'ls'],
							description: 'Show list of sample azd templates. (Beta)',
						},
						{
							name: ['show'],
							description: 'Show details for a given template. (Beta)',
						},
						{
							name: ['source'],
							description: 'View and manage template sources. (Beta)',
							subcommands: [
								{
									name: ['add'],
									description: 'Adds an azd template source with the specified key. (Beta)',
								},
								{
									name: ['list', 'ls'],
									description: 'Lists the configured azd template sources. (Beta)',
								},
								{
									name: ['remove'],
									description: 'Removes the specified azd template source (Beta)',
								},
							],
						},
					],
				},
				{
					name: ['up'],
					description: 'Provision and deploy your project to Azure with a single command.',
				},
				{
					name: ['version'],
					description: 'Print the version number of Azure Developer CLI.',
				},
				{
					name: ['x'],
					description: 'This extension provides a set of tools for AZD extension developers to test and debug their extensions.',
				},
			],
		},
	],
	options: [
		{
			name: ['--cwd', '-C'],
			description: 'Sets the current working directory.',
			isPersistent: true,
			args: [
				{
					name: 'cwd',
				},
			],
		},
		{
			name: ['--debug'],
			description: 'Enables debugging and diagnostics logging.',
			isPersistent: true,
		},
		{
			name: ['--no-prompt'],
			description: 'Accepts the default value instead of prompting, or it fails if there is no default.',
			isPersistent: true,
		},
		{
			name: ['--docs'],
			description: 'Opens the documentation for azd in your web browser.',
			isPersistent: true,
		},
		{
			name: ['--help', '-h'],
			description: 'Gets help for azd.',
			isPersistent: true,
		},
	],
};

export default completionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/cd.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/cd.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const cdSpec: Fig.Spec = {
	name: 'cd',
	description: 'Change the shell working directory',
	args: {
		name: 'folder',
		template: 'folders',

		suggestions: [
			{
				name: '-',
				description: 'Switch to the last used folder',
				hidden: true,
			},
		],
	}
};

export default cdSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/code-insiders.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/code-insiders.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import code, { commonOptions, extensionManagementOptions, troubleshootingOptions } from './code';

const codeInsidersCompletionSpec: Fig.Spec = {
	...code,
	name: 'code-insiders',
	description: 'Visual Studio Code Insiders',
	options: [
		...commonOptions,
		...extensionManagementOptions('code-insiders'),
		...troubleshootingOptions('code-insiders'),
	],
};

export default codeInsidersCompletionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/code-tunnel-insiders.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/code-tunnel-insiders.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { commonOptions, extensionManagementOptions, troubleshootingOptions, globalTunnelOptions, codeTunnelSubcommands, extTunnelSubcommand, codeTunnelOptions } from './code';
import codeTunnelCompletionSpec from './code-tunnel';

const codeTunnelInsidersCompletionSpec: Fig.Spec = {
	...codeTunnelCompletionSpec,
	name: 'code-tunnel-insiders',
	description: 'Visual Studio Code Insiders',
	subcommands: [...codeTunnelSubcommands, extTunnelSubcommand],
	options: [
		...commonOptions,
		...extensionManagementOptions('code-tunnel-insiders'),
		...troubleshootingOptions('code-tunnel-insiders'),
		...globalTunnelOptions,
		...codeTunnelOptions,
	]
};

export default codeTunnelInsidersCompletionSpec;
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/completions/code-tunnel.ts]---
Location: vscode-main/extensions/terminal-suggest/src/completions/code-tunnel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import code, { codeTunnelSubcommands, commonOptions, extensionManagementOptions, troubleshootingOptions, globalTunnelOptions, extTunnelSubcommand, codeTunnelOptions } from './code';


export const codeTunnelSpecOptions: Fig.Option[] = [
	{
		name: '--cli-data-dir',
		description: 'Directory where CLI metadata should be stored',
		isRepeatable: true,
		args: {
			name: 'cli_data_dir',
			isOptional: true,
		},
	},
	{
		name: '--log-to-file',
		description: 'Log to a file in addition to stdout. Used when running as a service',
		hidden: true,
		isRepeatable: true,
		args: {
			name: 'log_to_file',
			isOptional: true,
			template: 'filepaths',
		},
	},
	{
		name: '--log',
		description: 'Log level to use',
		isRepeatable: true,
		args: {
			name: 'log',
			isOptional: true,
			suggestions: [
				'trace',
				'debug',
				'info',
				'warn',
				'error',
				'critical',
				'off',
			],
		},
	},
	{
		name: '--telemetry-level',
		description: 'Sets the initial telemetry level',
		hidden: true,
		isRepeatable: true,
		args: {
			name: 'telemetry_level',
			isOptional: true,
			suggestions: [
				'off',
				'crash',
				'error',
				'all',
			],
		},
	},
	{
		name: '--verbose',
		description: 'Print verbose output (implies --wait)',
	},
	{
		name: '--disable-telemetry',
		description: 'Disable telemetry for the current command, even if it was previously accepted as part of the license prompt or specified in \'--telemetry-level\'',
	},
	{
		name: ['-h', '--help'],
		description: 'Print help',
	},
];

const codeTunnelCompletionSpec: Fig.Spec = {
	...code,
	name: 'code-tunnel',
	subcommands: [
		...codeTunnelSubcommands,
		extTunnelSubcommand
	],
	options: [
		...commonOptions,
		...extensionManagementOptions('code-tunnel'),
		...troubleshootingOptions('code-tunnel'),
		...globalTunnelOptions,
		...codeTunnelOptions,
	]
};

export default codeTunnelCompletionSpec;
```

--------------------------------------------------------------------------------

````
