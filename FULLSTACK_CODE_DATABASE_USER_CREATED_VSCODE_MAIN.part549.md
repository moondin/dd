---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 549
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 549 of 552)

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

---[FILE: test/automation/package-lock.json]---
Location: vscode-main/test/automation/package-lock.json

```json
{
  "name": "vscode-automation",
  "version": "1.71.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "vscode-automation",
      "version": "1.71.0",
      "license": "MIT",
      "dependencies": {
        "ncp": "^2.0.0",
        "tmp": "0.2.4",
        "tree-kill": "1.2.2",
        "vscode-uri": "3.0.2"
      },
      "devDependencies": {
        "@types/ncp": "2.0.1",
        "@types/node": "22.x",
        "@types/tmp": "0.2.2",
        "cpx2": "3.0.0",
        "nodemon": "^3.1.9",
        "npm-run-all": "^4.1.5"
      }
    },
    "node_modules/@types/ncp": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/@types/ncp/-/ncp-2.0.1.tgz",
      "integrity": "sha512-TeiJ7uvv/92ugSqZ0v9l0eNXzutlki0aK+R1K5bfA5SYUil46ITlxLW4iNTCf55P4L5weCmaOdtxGeGWvudwPg==",
      "dev": true,
      "dependencies": {
        "@types/node": "*"
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
    "node_modules/@types/tmp": {
      "version": "0.2.2",
      "resolved": "https://registry.npmjs.org/@types/tmp/-/tmp-0.2.2.tgz",
      "integrity": "sha512-MhSa0yylXtVMsyT8qFpHA1DLHj4DvQGH5ntxrhHSh8PxUVNi35Wk+P5hVgqbO2qZqOotqr9jaoPRL+iRjWYm/A==",
      "dev": true
    },
    "node_modules/ansi-styles": {
      "version": "3.2.1",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-3.2.1.tgz",
      "integrity": "sha512-VT0ZI6kZRdTh8YyJw3SMbYm/u+NqfsAxEpWO0Pf9sq8/e94WxxOpPKx9FR1FlyCtOVDNOQ+8ntlqFxiRc+r5qA==",
      "dev": true,
      "dependencies": {
        "color-convert": "^1.9.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/anymatch": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/anymatch/-/anymatch-3.1.3.tgz",
      "integrity": "sha512-KMReFUr0B4t+D+OBkjR3KYqvocp2XaSzO55UcB6mgQMd3KbcE+mWTyvVV7D/zsdEbNnV6acZUutkiHQXvTr1Rw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "normalize-path": "^3.0.0",
        "picomatch": "^2.0.4"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/at-least-node": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/at-least-node/-/at-least-node-1.0.0.tgz",
      "integrity": "sha512-+q/t7Ekv1EDY2l6Gda6LLiX14rU9TV20Wa3ofeQmwPFZbOMo9DXrLbOjFaaclkXKWidIaopwAObQDqwWtGUjqg==",
      "dev": true,
      "engines": {
        "node": ">= 4.0.0"
      }
    },
    "node_modules/balanced-match": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.0.tgz",
      "integrity": "sha1-ibTRmasr7kneFk6gK4nORi1xt2c= sha512-9Y0g0Q8rmSt+H33DfKv7FOc3v+iRI+o1lbzt8jGcIosYW37IIW/2XVYq5NPdmaD5NQ59Nk26Kl/vZbwW9Fr8vg==",
      "dev": true
    },
    "node_modules/binary-extensions": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/binary-extensions/-/binary-extensions-2.3.0.tgz",
      "integrity": "sha512-Ceh+7ox5qe7LJuLHoY0feh3pHuUDHAcRUeyL2VYghZwfpkNIy/+8Ocg0a3UuSoYzavmylwuLWQOf3hl0jjMMIw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/brace-expansion": {
      "version": "1.1.12",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.12.tgz",
      "integrity": "sha512-9T9UjW3r0UW5c1Q7GTwllptXwhvYmEzFhzMfZ9H7FQWt+uZePjZPjBP/W1ZEyZ1twGWom5/56TF4lPcqjnDHcg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^1.0.0",
        "concat-map": "0.0.1"
      }
    },
    "node_modules/braces": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/braces/-/braces-3.0.3.tgz",
      "integrity": "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fill-range": "^7.1.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/call-bind": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/call-bind/-/call-bind-1.0.0.tgz",
      "integrity": "sha512-AEXsYIyyDY3MCzbwdhzG3Jx1R0J2wetQyUynn6dYHAO+bg8l1k7jwZtRv4ryryFs7EP+NDlikJlVe59jr0cM2w==",
      "dev": true,
      "dependencies": {
        "function-bind": "^1.1.1",
        "get-intrinsic": "^1.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/chalk": {
      "version": "2.4.2",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-2.4.2.tgz",
      "integrity": "sha512-Mti+f9lpJNcwF4tWV8/OrTTtF1gZi+f8FqlyAdouralcFWFQWF2+NgCHShjkCb+IFBLq9buZwE1xckQU4peSuQ==",
      "dev": true,
      "dependencies": {
        "ansi-styles": "^3.2.1",
        "escape-string-regexp": "^1.0.5",
        "supports-color": "^5.3.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/chokidar": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/chokidar/-/chokidar-3.6.0.tgz",
      "integrity": "sha512-7VT13fmjotKpGipCW9JEQAusEPE+Ei8nl6/g4FBAmIm0GOOLMua9NDDo/DWp0ZAxCr3cPq5ZpBqmPAQgDda2Pw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "anymatch": "~3.1.2",
        "braces": "~3.0.2",
        "glob-parent": "~5.1.2",
        "is-binary-path": "~2.1.0",
        "is-glob": "~4.0.1",
        "normalize-path": "~3.0.0",
        "readdirp": "~3.6.0"
      },
      "engines": {
        "node": ">= 8.10.0"
      },
      "funding": {
        "url": "https://paulmillr.com/funding/"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.2"
      }
    },
    "node_modules/co": {
      "version": "4.6.0",
      "resolved": "https://registry.npmjs.org/co/-/co-4.6.0.tgz",
      "integrity": "sha1-bqa989hTrlTMuOR7+gvz+QMfsYQ= sha512-QVb0dM5HvG+uaxitm8wONl7jltx8dqhfU33DcqtOZcLSVIKSDDLDi7+0LbAKiyI8hD9u42m2YxXSkMGWThaecQ==",
      "dev": true,
      "engines": {
        "iojs": ">= 1.0.0",
        "node": ">= 0.12.0"
      }
    },
    "node_modules/color-convert": {
      "version": "1.9.3",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-1.9.3.tgz",
      "integrity": "sha512-QfAUtd+vFdAtFQcC8CCyYt1fYWxSqAiK2cSD6zDB8N3cpsEBAvRxp9zOGg6G/SHHJYAT88/az/IuDGALsNVbGg==",
      "dev": true,
      "dependencies": {
        "color-name": "1.1.3"
      }
    },
    "node_modules/color-name": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.3.tgz",
      "integrity": "sha1-p9BVi9icQveV3UIyj3QIMcpTvCU= sha512-72fSenhMw2HZMTVHeCA9KCmpEIbzWiQsjN+BHcBbS9vr1mtt+vJjPdksIBNUmKAW8TFUDPJK5SUU3QhE9NEXDw==",
      "dev": true
    },
    "node_modules/concat-map": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz",
      "integrity": "sha1-2Klr13/Wjfd5OnMDajug1UBdR3s= sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==",
      "dev": true
    },
    "node_modules/cpx2": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/cpx2/-/cpx2-3.0.0.tgz",
      "integrity": "sha512-WVI69l0qqlDboGngiggQitRyto20og3YNNZp6ySva9dRMYpy9OQd5ep7mQvkvuBeUkIluOKR6jBOek7FRS7X0w==",
      "dev": true,
      "dependencies": {
        "co": "^4.6.0",
        "debounce": "^1.2.0",
        "debug": "^4.1.1",
        "duplexer": "^0.1.1",
        "fs-extra": "^9.0.1",
        "glob": "^7.1.4",
        "glob2base": "0.0.12",
        "minimatch": "^3.0.4",
        "resolve": "^1.12.0",
        "safe-buffer": "^5.2.0",
        "shell-quote": "^1.7.1",
        "subarg": "^1.0.0"
      },
      "bin": {
        "cpx": "bin/index.js"
      },
      "engines": {
        "node": ">=6.5"
      }
    },
    "node_modules/cross-spawn": {
      "version": "6.0.6",
      "resolved": "https://registry.npmjs.org/cross-spawn/-/cross-spawn-6.0.6.tgz",
      "integrity": "sha512-VqCUuhcd1iB+dsv8gxPttb5iZh/D0iubSP21g36KXdEuf6I5JiioesUVjpCdHV9MZRUfVFlvwtIUyPfxo5trtw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "nice-try": "^1.0.4",
        "path-key": "^2.0.1",
        "semver": "^5.5.0",
        "shebang-command": "^1.2.0",
        "which": "^1.2.9"
      },
      "engines": {
        "node": ">=4.8"
      }
    },
    "node_modules/debounce": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/debounce/-/debounce-1.2.1.tgz",
      "integrity": "sha512-XRRe6Glud4rd/ZGQfiV1ruXSfbvfJedlV9Y6zOlP+2K04vBYiJEte6stfFkCP03aMnY5tsipamumUjL14fofug==",
      "dev": true
    },
    "node_modules/debug": {
      "version": "4.3.4",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.3.4.tgz",
      "integrity": "sha512-PRWFHuSU3eDtQJPvnNY7Jcket1j0t5OuOsFzPPzsekD52Zl8qUfFIPEiswXqIvHWGVHOgX+7G/vCNNhehwxfkQ==",
      "dev": true,
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
    "node_modules/define-properties": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/define-properties/-/define-properties-1.1.3.tgz",
      "integrity": "sha512-3MqfYKj2lLzdMSf8ZIZE/V+Zuy+BgD6f164e8K2w7dgnpKArBDerGYpM46IYYcjnkdPNMjPk9A6VFB8+3SKlXQ==",
      "dev": true,
      "dependencies": {
        "object-keys": "^1.0.12"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/duplexer": {
      "version": "0.1.2",
      "resolved": "https://registry.npmjs.org/duplexer/-/duplexer-0.1.2.tgz",
      "integrity": "sha512-jtD6YG370ZCIi/9GTaJKQxWTZD045+4R4hTk/x1UyoqadyJ9x9CgSi1RlVDQF8U2sxLLSnFkCaMihqljHIWgMg==",
      "dev": true
    },
    "node_modules/error-ex": {
      "version": "1.3.2",
      "resolved": "https://registry.npmjs.org/error-ex/-/error-ex-1.3.2.tgz",
      "integrity": "sha512-7dFHNmqeFSEt2ZBsCriorKnn3Z2pj+fd9kmI6QoWw4//DL+icEBfc0U7qJCisqrTsKTjw4fNFy2pW9OqStD84g==",
      "dev": true,
      "dependencies": {
        "is-arrayish": "^0.2.1"
      }
    },
    "node_modules/es-abstract": {
      "version": "1.18.0-next.1",
      "resolved": "https://registry.npmjs.org/es-abstract/-/es-abstract-1.18.0-next.1.tgz",
      "integrity": "sha512-I4UGspA0wpZXWENrdA0uHbnhte683t3qT/1VFH9aX2dA5PPSf6QW5HHXf5HImaqPmjXaVeVk4RGWnaylmV7uAA==",
      "dev": true,
      "dependencies": {
        "es-to-primitive": "^1.2.1",
        "function-bind": "^1.1.1",
        "has": "^1.0.3",
        "has-symbols": "^1.0.1",
        "is-callable": "^1.2.2",
        "is-negative-zero": "^2.0.0",
        "is-regex": "^1.1.1",
        "object-inspect": "^1.8.0",
        "object-keys": "^1.1.1",
        "object.assign": "^4.1.1",
        "string.prototype.trimend": "^1.0.1",
        "string.prototype.trimstart": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/es-to-primitive": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/es-to-primitive/-/es-to-primitive-1.2.1.tgz",
      "integrity": "sha512-QCOllgZJtaUo9miYBcLChTUaHNjJF3PYs1VidD7AwiEj1kYxKeQTctLAezAOH5ZKRH0g2IgPn6KwB4IT8iRpvA==",
      "dev": true,
      "dependencies": {
        "is-callable": "^1.1.4",
        "is-date-object": "^1.0.1",
        "is-symbol": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/escape-string-regexp": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-1.0.5.tgz",
      "integrity": "sha1-G2HAViGQqN/2rjuyzwIAyhMLhtQ= sha512-vbRorB5FUQWvla16U8R/qgaFIya2qGzwDrNmCZuYKrbdSUMG6I1ZCGQRefkRVhuOkIGVne7BQ35DSfo1qvJqFg==",
      "dev": true,
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/fill-range": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/fill-range/-/fill-range-7.1.1.tgz",
      "integrity": "sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "to-regex-range": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/find-index": {
      "version": "0.1.1",
      "resolved": "https://registry.npmjs.org/find-index/-/find-index-0.1.1.tgz",
      "integrity": "sha1-Z101iyyjiS15Whq0cjL4tuLg3eQ= sha512-uJ5vWrfBKMcE6y2Z8834dwEZj9mNGxYa3t3I53OwFeuZ8D9oc2E5zcsrkuhX6h4iYrjhiv0T3szQmxlAV9uxDg==",
      "dev": true
    },
    "node_modules/fs-extra": {
      "version": "9.1.0",
      "resolved": "https://registry.npmjs.org/fs-extra/-/fs-extra-9.1.0.tgz",
      "integrity": "sha512-hcg3ZmepS30/7BSFqRvoo3DOMQu7IjqxO5nCDt+zM9XWjb33Wg7ziNT+Qvqbuc3+gWpzO02JubVyk2G4Zvo1OQ==",
      "dev": true,
      "dependencies": {
        "at-least-node": "^1.0.0",
        "graceful-fs": "^4.2.0",
        "jsonfile": "^6.0.1",
        "universalify": "^2.0.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/fs.realpath": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/fs.realpath/-/fs.realpath-1.0.0.tgz",
      "integrity": "sha1-FQStJSMVjKpA20onh8sBQRmU6k8= sha512-OO0pH2lK6a0hZnAdau5ItzHPI6pUlvI7jMVnxUQRtw4owF2wk8lOSabtGDCTP4Ggrg2MbGnWO9X8K1t4+fGMDw==",
      "dev": true
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.1.tgz",
      "integrity": "sha512-yIovAzMX49sF8Yl58fSCWJ5svSLuaibPxXQJFLmBObTuCr0Mf1KiPopGM9NiFjiYBCbfaa2Fh6breQ6ANVTI0A==",
      "dev": true
    },
    "node_modules/get-intrinsic": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.0.1.tgz",
      "integrity": "sha512-ZnWP+AmS1VUaLgTRy47+zKtjTxz+0xMpx3I52i+aalBK1QP19ggLF3Db89KJX7kjfOfP2eoa01qc++GwPgufPg==",
      "dev": true,
      "dependencies": {
        "function-bind": "^1.1.1",
        "has": "^1.0.3",
        "has-symbols": "^1.0.1"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/glob": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/glob/-/glob-7.2.0.tgz",
      "integrity": "sha512-lmLf6gtyrPq8tTjSmrO94wBeQbFR3HbLHbuyD69wuyQkImp2hWqMGB47OX65FBkPffO641IP9jWa1z4ivqG26Q==",
      "deprecated": "Glob versions prior to v9 are no longer supported",
      "dev": true,
      "dependencies": {
        "fs.realpath": "^1.0.0",
        "inflight": "^1.0.4",
        "inherits": "2",
        "minimatch": "^3.0.4",
        "once": "^1.3.0",
        "path-is-absolute": "^1.0.0"
      },
      "engines": {
        "node": "*"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/glob-parent": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
      "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/glob2base": {
      "version": "0.0.12",
      "resolved": "https://registry.npmjs.org/glob2base/-/glob2base-0.0.12.tgz",
      "integrity": "sha1-nUGbPijxLoOjYhZKJ3BVkiycDVY= sha512-ZyqlgowMbfj2NPjxaZZ/EtsXlOch28FRXgMd64vqZWk1bT9+wvSRLYD1om9M7QfQru51zJPAT17qXm4/zd+9QA==",
      "dev": true,
      "dependencies": {
        "find-index": "^0.1.1"
      },
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/graceful-fs": {
      "version": "4.2.8",
      "resolved": "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.2.8.tgz",
      "integrity": "sha512-qkIilPUYcNhJpd33n0GBXTB1MMPp14TxEsEs0pTrsSVucApsYzW5V+Q8Qxhik6KU3evy+qkAAowTByymK0avdg==",
      "dev": true
    },
    "node_modules/has": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/has/-/has-1.0.3.tgz",
      "integrity": "sha512-f2dvO0VU6Oej7RkWJGrehjbzMAjFp5/VKPp5tTpWIV4JHHZK1/BxbFRtf/siA2SWTe09caDmVtYYzWEIbBS4zw==",
      "dev": true,
      "dependencies": {
        "function-bind": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4.0"
      }
    },
    "node_modules/has-flag": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-3.0.0.tgz",
      "integrity": "sha1-tdRU3CGZriJWmfNGfloH87lVuv0= sha512-sKJf1+ceQBr4SMkvQnBDNDtf4TXpVhVGateu0t918bl30FnbE2m4vNLX+VWe/dpjlb+HugGYzW7uQXH98HPEYw==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.0.1.tgz",
      "integrity": "sha512-PLcsoqu++dmEIZB+6totNFKq/7Do+Z0u4oT0zKOJNl3lYK6vGwwu2hjHs+68OEZbTjiUE9bgOABXbP/GvrS0Kg==",
      "dev": true,
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/hosted-git-info": {
      "version": "2.8.9",
      "resolved": "https://registry.npmjs.org/hosted-git-info/-/hosted-git-info-2.8.9.tgz",
      "integrity": "sha512-mxIDAb9Lsm6DoOJ7xH+5+X4y1LU/4Hi50L9C5sIswK3JzULS4bwk1FvjdBgvYR4bzT4tuUQiC15FE2f5HbLvYw==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/ignore-by-default": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/ignore-by-default/-/ignore-by-default-1.0.1.tgz",
      "integrity": "sha512-Ius2VYcGNk7T90CppJqcIkS5ooHUZyIQK+ClZfMfMNFEF9VSE73Fq+906u/CWu92x4gzZMWOwfFYckPObzdEbA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/inflight": {
      "version": "1.0.6",
      "resolved": "https://registry.npmjs.org/inflight/-/inflight-1.0.6.tgz",
      "integrity": "sha1-Sb1jMdfQLQwJvJEKEHW6gWW1bfk= sha512-k92I/b08q4wvFscXCLvqfsHCrjrF7yiXsQuIVvVE7N82W3+aqpzuUdBbfhWcy/FZR3/4IgflMgKLOsvPDrGCJA==",
      "deprecated": "This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.",
      "dev": true,
      "dependencies": {
        "once": "^1.3.0",
        "wrappy": "1"
      }
    },
    "node_modules/inherits": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
      "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==",
      "dev": true
    },
    "node_modules/is-arrayish": {
      "version": "0.2.1",
      "resolved": "https://registry.npmjs.org/is-arrayish/-/is-arrayish-0.2.1.tgz",
      "integrity": "sha1-d8mYQFJ6qOyxqLppe4BkWnqSap0= sha512-zz06S8t0ozoDXMG+ube26zeCTNXcKIPJZJi8hBrF4idCLms4CG9QtK7qBl1boi5ODzFpjswb5JPmHCbMpjaYzg==",
      "dev": true
    },
    "node_modules/is-binary-path": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/is-binary-path/-/is-binary-path-2.1.0.tgz",
      "integrity": "sha512-ZMERYes6pDydyuGidse7OsHxtbI7WVeUEozgR/g7rd0xUimYNlvZRE/K2MgZTjWy725IfelLeVcEM97mmtRGXw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "binary-extensions": "^2.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-callable": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/is-callable/-/is-callable-1.2.2.tgz",
      "integrity": "sha512-dnMqspv5nU3LoewK2N/y7KLtxtakvTuaCsU9FU50/QDmdbHNy/4/JuRtMHqRU22o3q+W89YQndQEeCVwK+3qrA==",
      "dev": true,
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-core-module": {
      "version": "2.8.0",
      "resolved": "https://registry.npmjs.org/is-core-module/-/is-core-module-2.8.0.tgz",
      "integrity": "sha512-vd15qHsaqrRL7dtH6QNuy0ndJmRDrS9HAM1CAiSifNUFv4x1a0CCVsj18hJ1mShxIG6T2i1sO78MkP56r0nYRw==",
      "dev": true,
      "dependencies": {
        "has": "^1.0.3"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-date-object": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/is-date-object/-/is-date-object-1.0.2.tgz",
      "integrity": "sha512-USlDT524woQ08aoZFzh3/Z6ch9Y/EWXEHQ/AaRN0SkKq4t2Jw2R2339tSXmwuVoY7LLlBCbOIlx2myP/L5zk0g==",
      "dev": true,
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-extglob": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/is-extglob/-/is-extglob-2.1.1.tgz",
      "integrity": "sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-glob": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/is-glob/-/is-glob-4.0.3.tgz",
      "integrity": "sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-extglob": "^2.1.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-negative-zero": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/is-negative-zero/-/is-negative-zero-2.0.1.tgz",
      "integrity": "sha512-2z6JzQvZRa9A2Y7xC6dQQm4FSTSTNWjKIYYTt4246eMTJmIo0Q+ZyOsU66X8lxK1AbB92dFeglPLrhwpeRKO6w==",
      "dev": true,
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-number": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/is-number/-/is-number-7.0.0.tgz",
      "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.12.0"
      }
    },
    "node_modules/is-regex": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-regex/-/is-regex-1.1.1.tgz",
      "integrity": "sha512-1+QkEcxiLlB7VEyFtyBg94e08OAsvq7FUBgApTq/w2ymCLyKJgDPsybBENVtA7XCQEgEXxKPonG+mvYRxh/LIg==",
      "dev": true,
      "dependencies": {
        "has-symbols": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-symbol": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/is-symbol/-/is-symbol-1.0.3.tgz",
      "integrity": "sha512-OwijhaRSgqvhm/0ZdAcXNZt9lYdKFpcRDT5ULUuYXPoT794UNOdU+gpT6Rzo7b4V2HUl/op6GqY894AZwv9faQ==",
      "dev": true,
      "dependencies": {
        "has-symbols": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/isexe": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz",
      "integrity": "sha1-6PvzdNxVb/iUehDcsFctYz8s+hA= sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==",
      "dev": true
    },
    "node_modules/json-parse-better-errors": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/json-parse-better-errors/-/json-parse-better-errors-1.0.2.tgz",
      "integrity": "sha512-mrqyZKfX5EhL7hvqcV6WG1yYjnjeuYDzDhhcAAUrq8Po85NBQBJP+ZDUT75qZQ98IkUoBqdkExkukOU7Ts2wrw==",
      "dev": true
    },
    "node_modules/jsonfile": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/jsonfile/-/jsonfile-6.1.0.tgz",
      "integrity": "sha512-5dgndWOriYSm5cnYaJNhalLNDKOqFwyDB/rr1E9ZsGciGvKPs8R2xYGCacuf3z6K1YKDz182fd+fY3cn3pMqXQ==",
      "dev": true,
      "dependencies": {
        "universalify": "^2.0.0"
      },
      "optionalDependencies": {
        "graceful-fs": "^4.1.6"
      }
    },
    "node_modules/load-json-file": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/load-json-file/-/load-json-file-4.0.0.tgz",
      "integrity": "sha1-L19Fq5HjMhYjT9U62rZo607AmTs= sha512-Kx8hMakjX03tiGTLAIdJ+lL0htKnXjEZN6hk/tozf/WOuYGdZBJrZ+rCJRbVCugsjB3jMLn9746NsQIf5VjBMw==",
      "dev": true,
      "dependencies": {
        "graceful-fs": "^4.1.2",
        "parse-json": "^4.0.0",
        "pify": "^3.0.0",
        "strip-bom": "^3.0.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/memorystream": {
      "version": "0.3.1",
      "resolved": "https://registry.npmjs.org/memorystream/-/memorystream-0.3.1.tgz",
      "integrity": "sha1-htcJCzDORV1j+64S3aUaR93K+bI= sha512-S3UwM3yj5mtUSEfP41UZmt/0SCoVYUcU1rkXv+BQ5Ig8ndL4sPoJNBUJERafdPb5jjHJGuMgytgKvKIf58XNBw==",
      "dev": true,
      "engines": {
        "node": ">= 0.10.0"
      }
    },
    "node_modules/minimatch": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.1.2.tgz",
      "integrity": "sha512-J7p63hRiAjw1NDEww1W7i37+ByIrOWO5XQQAzZ3VOcL0PNybwpfmV/N05zFAzwQ9USyEcX6t3UO+K5aqBQOIHw==",
      "dev": true,
      "dependencies": {
        "brace-expansion": "^1.1.7"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/minimist": {
      "version": "1.2.6",
      "resolved": "https://registry.npmjs.org/minimist/-/minimist-1.2.6.tgz",
      "integrity": "sha512-Jsjnk4bw3YJqYzbdyBiNsPWHPfO++UGG749Cxs6peCu5Xg4nrena6OVxOYxrQTqww0Jmwt+Ref8rggumkTLz9Q==",
      "dev": true
    },
    "node_modules/ms": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.2.tgz",
      "integrity": "sha512-sGkPx+VjMtmA6MX27oA4FBFELFCZZ4S4XqeGOXCv68tT+jb3vk/RyaKWP0PTKyWtmLSM0b+adUTEvbs1PEaH2w==",
      "dev": true
    },
    "node_modules/ncp": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ncp/-/ncp-2.0.0.tgz",
      "integrity": "sha1-GVoh1sRuNh0vsSgbo4uR6d9727M= sha512-zIdGUrPRFTUELUvr3Gmc7KZ2Sw/h1PiVM0Af/oHB6zgnV1ikqSfRk+TOufi79aHYCW3NiOXmr1BP5nWbzojLaA==",
      "bin": {
        "ncp": "bin/ncp"
      }
    },
    "node_modules/nice-try": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/nice-try/-/nice-try-1.0.5.tgz",
      "integrity": "sha512-1nh45deeb5olNY7eX82BkPO7SSxR5SSYJiPTrTdFUVYwAl8CKMA5N9PjTYkHiRjisVcxcQ1HXdLhx2qxxJzLNQ==",
      "dev": true
    },
    "node_modules/nodemon": {
      "version": "3.1.9",
      "resolved": "https://registry.npmjs.org/nodemon/-/nodemon-3.1.9.tgz",
      "integrity": "sha512-hdr1oIb2p6ZSxu3PB2JWWYS7ZQ0qvaZsc3hK8DR8f02kRzc8rjYmxAIvdz+aYC+8F2IjNaB7HMcSDg8nQpJxyg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "chokidar": "^3.5.2",
        "debug": "^4",
        "ignore-by-default": "^1.0.1",
        "minimatch": "^3.1.2",
        "pstree.remy": "^1.1.8",
        "semver": "^7.5.3",
        "simple-update-notifier": "^2.0.0",
        "supports-color": "^5.5.0",
        "touch": "^3.1.0",
        "undefsafe": "^2.0.5"
      },
      "bin": {
        "nodemon": "bin/nodemon.js"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/nodemon"
      }
    },
    "node_modules/nodemon/node_modules/semver": {
      "version": "7.7.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.1.tgz",
      "integrity": "sha512-hlq8tAfn0m/61p4BVRcPzIGr6LKiMwo4VM6dGi6pt4qcRkmNzTcWq6eCEjEh+qXjkMDvPlOFFSGwQjoEa6gyMA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/normalize-package-data": {
      "version": "2.5.0",
      "resolved": "https://registry.npmjs.org/normalize-package-data/-/normalize-package-data-2.5.0.tgz",
      "integrity": "sha512-/5CMN3T0R4XTj4DcGaexo+roZSdSFW/0AOOTROrjxzCG1wrWXEsGbRKevjlIL+ZDE4sZlJr5ED4YW0yqmkK+eA==",
      "dev": true,
      "dependencies": {
        "hosted-git-info": "^2.1.4",
        "resolve": "^1.10.0",
        "semver": "2 || 3 || 4 || 5",
        "validate-npm-package-license": "^3.0.1"
      }
    },
    "node_modules/normalize-path": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/normalize-path/-/normalize-path-3.0.0.tgz",
      "integrity": "sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/npm-run-all": {
      "version": "4.1.5",
      "resolved": "https://registry.npmjs.org/npm-run-all/-/npm-run-all-4.1.5.tgz",
      "integrity": "sha512-Oo82gJDAVcaMdi3nuoKFavkIHBRVqQ1qvMb+9LHk/cF4P6B2m8aP04hGf7oL6wZ9BuGwX1onlLhpuoofSyoQDQ==",
      "dev": true,
      "dependencies": {
        "ansi-styles": "^3.2.1",
        "chalk": "^2.4.1",
        "cross-spawn": "^6.0.5",
        "memorystream": "^0.3.1",
        "minimatch": "^3.0.4",
        "pidtree": "^0.3.0",
        "read-pkg": "^3.0.0",
        "shell-quote": "^1.6.1",
        "string.prototype.padend": "^3.0.0"
      },
      "bin": {
        "npm-run-all": "bin/npm-run-all/index.js",
        "run-p": "bin/run-p/index.js",
        "run-s": "bin/run-s/index.js"
      },
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/object-inspect": {
      "version": "1.9.0",
      "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.9.0.tgz",
      "integrity": "sha512-i3Bp9iTqwhaLZBxGkRfo5ZbE07BQRT7MGu8+nNgwW9ItGp1TzCTw2DLEoWwjClxBjOFI/hWljTAmYGCEwmtnOw==",
      "dev": true,
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/object-keys": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/object-keys/-/object-keys-1.1.1.tgz",
      "integrity": "sha512-NuAESUOUMrlIXOfHKzD6bpPu3tYt3xvjNdRIQ+FeT0lNb4K8WR70CaDxhuNguS2XG+GjkyMwOzsN5ZktImfhLA==",
      "dev": true,
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/object.assign": {
      "version": "4.1.2",
      "resolved": "https://registry.npmjs.org/object.assign/-/object.assign-4.1.2.tgz",
      "integrity": "sha512-ixT2L5THXsApyiUPYKmW+2EHpXXe5Ii3M+f4e+aJFAHao5amFRW6J0OO6c/LU8Be47utCx2GL89hxGB6XSmKuQ==",
      "dev": true,
      "dependencies": {
        "call-bind": "^1.0.0",
        "define-properties": "^1.1.3",
        "has-symbols": "^1.0.1",
        "object-keys": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/once": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
      "integrity": "sha1-WDsap3WWHUsROsF9nFC6753Xa9E= sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==",
      "dev": true,
      "dependencies": {
        "wrappy": "1"
      }
    },
    "node_modules/parse-json": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/parse-json/-/parse-json-4.0.0.tgz",
      "integrity": "sha1-vjX1Qlvh9/bHRxhPmKeIy5lHfuA= sha512-aOIos8bujGN93/8Ox/jPLh7RwVnPEysynVFE+fQZyg6jKELEHwzgKdLRFHUgXJL6kylijVSBC4BvN9OmsB48Rw==",
      "dev": true,
      "dependencies": {
        "error-ex": "^1.3.1",
        "json-parse-better-errors": "^1.0.1"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/path-is-absolute": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/path-is-absolute/-/path-is-absolute-1.0.1.tgz",
      "integrity": "sha1-F0uSaHNVNP+8es5r9TpanhtcX18= sha512-AVbw3UJ2e9bq64vSaS9Am0fje1Pa8pbGqTTsmXfaIiMpnr5DlDhfJOuLj9Sf95ZPVDAUerDfEk88MPmPe7UCQg==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/path-key": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/path-key/-/path-key-2.0.1.tgz",
      "integrity": "sha1-QRyttXTFoUDTpLGRDUDYDMn0C0A= sha512-fEHGKCSmUSDPv4uoj8AlD+joPlq3peND+HRYyxFz4KPw4z926S/b8rIuFs2FYJg3BwsxJf6A9/3eIdLaYC+9Dw==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/path-parse": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/path-parse/-/path-parse-1.0.7.tgz",
      "integrity": "sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/path-type": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/path-type/-/path-type-3.0.0.tgz",
      "integrity": "sha512-T2ZUsdZFHgA3u4e5PfPbjd7HDDpxPnQb5jN0SrDsjNSuVXHJqtwTnWqG0B1jZrgmJ/7lj1EmVIByWt1gxGkWvg==",
      "dev": true,
      "dependencies": {
        "pify": "^3.0.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/picomatch": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.1.tgz",
      "integrity": "sha512-JU3teHTNjmE2VCGFzuY8EXzCDVwEqB2a8fsIvwaStHhAWJEeVd1o1QD80CU6+ZdEXXSLbSsuLwJjkCBWqRQUVA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/pidtree": {
      "version": "0.3.1",
      "resolved": "https://registry.npmjs.org/pidtree/-/pidtree-0.3.1.tgz",
      "integrity": "sha512-qQbW94hLHEqCg7nhby4yRC7G2+jYHY4Rguc2bjw7Uug4GIJuu1tvf2uHaZv5Q8zdt+WKJ6qK1FOI6amaWUo5FA==",
      "dev": true,
      "bin": {
        "pidtree": "bin/pidtree.js"
      },
      "engines": {
        "node": ">=0.10"
      }
    },
    "node_modules/pify": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/pify/-/pify-3.0.0.tgz",
      "integrity": "sha1-5aSs0sEB/fPZpNB/DbxNtJ3SgXY= sha512-C3FsVNH1udSEX48gGX1xfvwTWfsYWj5U+8/uK15BGzIGrKoUpghX8hWZwa/OFnakBiiVNmBvemTJR5mcy7iPcg==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/pstree.remy": {
      "version": "1.1.8",
      "resolved": "https://registry.npmjs.org/pstree.remy/-/pstree.remy-1.1.8.tgz",
      "integrity": "sha512-77DZwxQmxKnu3aR542U+X8FypNzbfJ+C5XQDk3uWjWxn6151aIMGthWYRXTqT1E5oJvg+ljaa2OJi+VfvCOQ8w==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/read-pkg": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/read-pkg/-/read-pkg-3.0.0.tgz",
      "integrity": "sha1-nLxoaXj+5l0WwA4rGcI3/Pbjg4k= sha512-BLq/cCO9two+lBgiTYNqD6GdtK8s4NpaWrl6/rCO9w0TUS8oJl7cmToOZfRYllKTISY6nt1U7jQ53brmKqY6BA==",
      "dev": true,
      "dependencies": {
        "load-json-file": "^4.0.0",
        "normalize-package-data": "^2.3.2",
        "path-type": "^3.0.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/readdirp": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/readdirp/-/readdirp-3.6.0.tgz",
      "integrity": "sha512-hOS089on8RduqdbhvQ5Z37A0ESjsqz6qnRcffsMU3495FuTdqSm+7bhJ29JvIOsBDEEnan5DPu9t3To9VRlMzA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "picomatch": "^2.2.1"
      },
      "engines": {
        "node": ">=8.10.0"
      }
    },
    "node_modules/resolve": {
      "version": "1.20.0",
      "resolved": "https://registry.npmjs.org/resolve/-/resolve-1.20.0.tgz",
      "integrity": "sha512-wENBPt4ySzg4ybFQW2TT1zMQucPK95HSh/nq2CFTZVOGut2+pQvSsgtda4d26YrYcr067wjbmzOG8byDPBX63A==",
      "dev": true,
      "dependencies": {
        "is-core-module": "^2.2.0",
        "path-parse": "^1.0.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/safe-buffer": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.2.1.tgz",
      "integrity": "sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==",
      "dev": true,
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
      "version": "5.7.2",
      "resolved": "https://registry.npmjs.org/semver/-/semver-5.7.2.tgz",
      "integrity": "sha512-cBznnQ9KjJqU67B52RMC65CMarK2600WFnbkcaiwWq3xy/5haFJlshgnpjovMVJ+Hff49d8GEn0b87C5pDQ10g==",
      "dev": true,
      "bin": {
        "semver": "bin/semver"
      }
    },
    "node_modules/shebang-command": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/shebang-command/-/shebang-command-1.2.0.tgz",
      "integrity": "sha1-RKrGW2lbAzmJaMOfNj/uXer98eo= sha512-EV3L1+UQWGor21OmnvojK36mhg+TyIKDh3iFBKBohr5xeXIhNBcx8oWdgkTEEQ+BEFFYdLRuqMfd5L84N1V5Vg==",
      "dev": true,
      "dependencies": {
        "shebang-regex": "^1.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/shebang-regex": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/shebang-regex/-/shebang-regex-1.0.0.tgz",
      "integrity": "sha1-2kL0l0DAtC2yypcoVxyxkMmO/qM= sha512-wpoSFAxys6b2a2wHZ1XpDSgD7N9iVjg29Ph9uV/uaP9Ex/KXlkTZTeddxDPSYQpgvzKLGJke2UU0AzoGCjNIvQ==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/shell-quote": {
      "version": "1.7.3",
      "resolved": "https://registry.npmjs.org/shell-quote/-/shell-quote-1.7.3.tgz",
      "integrity": "sha512-Vpfqwm4EnqGdlsBFNmHhxhElJYrdfcxPThu+ryKS5J8L/fhAwLazFZtq+S+TWZ9ANj2piSQLGj6NQg+lKPmxrw==",
      "dev": true
    },
    "node_modules/simple-update-notifier": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/simple-update-notifier/-/simple-update-notifier-2.0.0.tgz",
      "integrity": "sha512-a2B9Y0KlNXl9u/vsW6sTIu9vGEpfKu2wRV6l1H3XEas/0gUIzGzBoP/IouTcUQbm9JWZLH3COxyn03TYlFax6w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "semver": "^7.5.3"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/simple-update-notifier/node_modules/semver": {
      "version": "7.7.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.1.tgz",
      "integrity": "sha512-hlq8tAfn0m/61p4BVRcPzIGr6LKiMwo4VM6dGi6pt4qcRkmNzTcWq6eCEjEh+qXjkMDvPlOFFSGwQjoEa6gyMA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/spdx-correct": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/spdx-correct/-/spdx-correct-3.1.1.tgz",
      "integrity": "sha512-cOYcUWwhCuHCXi49RhFRCyJEK3iPj1Ziz9DpViV3tbZOwXD49QzIN3MpOLJNxh2qwq2lJJZaKMVw9qNi4jTC0w==",
      "dev": true,
      "dependencies": {
        "spdx-expression-parse": "^3.0.0",
        "spdx-license-ids": "^3.0.0"
      }
    },
    "node_modules/spdx-exceptions": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/spdx-exceptions/-/spdx-exceptions-2.3.0.tgz",
      "integrity": "sha512-/tTrYOC7PPI1nUAgx34hUpqXuyJG+DTHJTnIULG4rDygi4xu/tfgmq1e1cIRwRzwZgo4NLySi+ricLkZkw4i5A==",
      "dev": true
    },
    "node_modules/spdx-expression-parse": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/spdx-expression-parse/-/spdx-expression-parse-3.0.1.tgz",
      "integrity": "sha512-cbqHunsQWnJNE6KhVSMsMeH5H/L9EpymbzqTQ3uLwNCLZ1Q481oWaofqH7nO6V07xlXwY6PhQdQ2IedWx/ZK4Q==",
      "dev": true,
      "dependencies": {
        "spdx-exceptions": "^2.1.0",
        "spdx-license-ids": "^3.0.0"
      }
    },
    "node_modules/spdx-license-ids": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/spdx-license-ids/-/spdx-license-ids-3.0.7.tgz",
      "integrity": "sha512-U+MTEOO0AiDzxwFvoa4JVnMV6mZlJKk2sBLt90s7G0Gd0Mlknc7kxEn3nuDPNZRta7O2uy8oLcZLVT+4sqNZHQ==",
      "dev": true
    },
    "node_modules/string.prototype.padend": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/string.prototype.padend/-/string.prototype.padend-3.1.1.tgz",
      "integrity": "sha512-eCzTASPnoCr5Ht+Vn1YXgm8SB015hHKgEIMu9Nr9bQmLhRBxKRfmzSj/IQsxDFc8JInJDDFA0qXwK+xxI7wDkg==",
      "dev": true,
      "dependencies": {
        "call-bind": "^1.0.0",
        "define-properties": "^1.1.3",
        "es-abstract": "^1.18.0-next.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/string.prototype.trimend": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/string.prototype.trimend/-/string.prototype.trimend-1.0.3.tgz",
      "integrity": "sha512-ayH0pB+uf0U28CtjlLvL7NaohvR1amUvVZk+y3DYb0Ey2PUV5zPkkKy9+U1ndVEIXO8hNg18eIv9Jntbii+dKw==",
      "dev": true,
      "dependencies": {
        "call-bind": "^1.0.0",
        "define-properties": "^1.1.3"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/string.prototype.trimstart": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/string.prototype.trimstart/-/string.prototype.trimstart-1.0.3.tgz",
      "integrity": "sha512-oBIBUy5lea5tt0ovtOFiEQaBkoBBkyJhZXzJYrSmDo5IUUqbOPvVezuRs/agBIdZ2p2Eo1FD6bD9USyBLfl3xg==",
      "dev": true,
      "dependencies": {
        "call-bind": "^1.0.0",
        "define-properties": "^1.1.3"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/strip-bom": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/strip-bom/-/strip-bom-3.0.0.tgz",
      "integrity": "sha1-IzTBjpx1n3vdVv3vfprj1YjmjtM= sha512-vavAMRXOgBVNF6nyEEmL3DBK19iRpDcoIwW+swQ+CbGiu7lju6t+JklA1MHweoWtadgt4ISVUsXLyDq34ddcwA==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/subarg": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/subarg/-/subarg-1.0.0.tgz",
      "integrity": "sha1-9izxdYHplrSPyWVpn1TAauJouNI= sha512-RIrIdRY0X1xojthNcVtgT9sjpOGagEUKpZdgBUi054OEPFo282yg+zE+t1Rj3+RqKq2xStL7uUHhY+AjbC4BXg==",
      "dev": true,
      "dependencies": {
        "minimist": "^1.1.0"
      }
    },
    "node_modules/supports-color": {
      "version": "5.5.0",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-5.5.0.tgz",
      "integrity": "sha512-QjVjwdXIt408MIiAqCX4oUKsgU2EqAGzs2Ppkm4aQYbjm+ZEWEcW4SfFNTr4uMNZma0ey4f5lgLrkB0aX0QMow==",
      "dev": true,
      "dependencies": {
        "has-flag": "^3.0.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/tmp": {
      "version": "0.2.4",
      "resolved": "https://registry.npmjs.org/tmp/-/tmp-0.2.4.tgz",
      "integrity": "sha512-UdiSoX6ypifLmrfQ/XfiawN6hkjSBpCjhKxxZcWlUUmoXLaCKQU0bx4HF/tdDK2uzRuchf1txGvrWBzYREssoQ==",
      "license": "MIT",
      "engines": {
        "node": ">=14.14"
      }
    },
    "node_modules/to-regex-range": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz",
      "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-number": "^7.0.0"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/touch": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/touch/-/touch-3.1.1.tgz",
      "integrity": "sha512-r0eojU4bI8MnHr8c5bNo7lJDdI2qXlWWJk6a9EAFG7vbhTjElYhBVS3/miuE0uOuoLdb8Mc/rVfsmm6eo5o9GA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "nodetouch": "bin/nodetouch.js"
      }
    },
    "node_modules/tree-kill": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/tree-kill/-/tree-kill-1.2.2.tgz",
      "integrity": "sha512-L0Orpi8qGpRG//Nd+H90vFB+3iHnue1zSSGmNOOCh1GLJ7rUKVwV2HvijphGQS2UmhUZewS9VgvxYIdgr+fG1A==",
      "bin": {
        "tree-kill": "cli.js"
      }
    },
    "node_modules/undefsafe": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/undefsafe/-/undefsafe-2.0.5.tgz",
      "integrity": "sha512-WxONCrssBM8TSPRqN5EmsjVrsv4A8X12J4ArBiiayv3DyyG3ZlIg6yysuuSYdZsVz3TKcTg2fd//Ujd4CHV1iA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/universalify": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/universalify/-/universalify-2.0.0.tgz",
      "integrity": "sha512-hAZsKq7Yy11Zu1DE0OzWjw7nnLZmJZYTDZZyEFHZdUhV8FkH5MCfoU1XMaxXovpyW5nq5scPqq0ZDP9Zyl04oQ==",
      "dev": true,
      "engines": {
        "node": ">= 10.0.0"
      }
    },
    "node_modules/validate-npm-package-license": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/validate-npm-package-license/-/validate-npm-package-license-3.0.4.tgz",
      "integrity": "sha512-DpKm2Ui/xN7/HQKCtpZxoRWBhZ9Z0kqtygG8XCgNQ8ZlDnxuQmWhj566j8fN4Cu3/JmbhsDo7fcAJq4s9h27Ew==",
      "dev": true,
      "dependencies": {
        "spdx-correct": "^3.0.0",
        "spdx-expression-parse": "^3.0.0"
      }
    },
    "node_modules/vscode-uri": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/vscode-uri/-/vscode-uri-3.0.2.tgz",
      "integrity": "sha512-jkjy6pjU1fxUvI51P+gCsxg1u2n8LSt0W6KrCNQceaziKzff74GoWmjVG46KieVzybO1sttPQmYfrwSHey7GUA=="
    },
    "node_modules/which": {
      "version": "1.3.1",
      "resolved": "https://registry.npmjs.org/which/-/which-1.3.1.tgz",
      "integrity": "sha512-HxJdYWq1MTIQbJ3nw0cqssHoTNU267KlrDuGZ1WYlxDStUtKUhOaJmh112/TZmHxxUfuJqPXSOm7tDyas0OSIQ==",
      "dev": true,
      "dependencies": {
        "isexe": "^2.0.0"
      },
      "bin": {
        "which": "bin/which"
      }
    },
    "node_modules/wrappy": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
      "integrity": "sha1-tSQ9jz7BqjXxNkYFvA0QNuMKtp8= sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==",
      "dev": true
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/package.json]---
Location: vscode-main/test/automation/package.json

```json
{
  "name": "vscode-automation",
  "version": "1.71.0",
  "description": "VS Code UI automation driver",
  "author": {
    "name": "Microsoft Corporation"
  },
  "license": "MIT",
  "main": "./out/index.js",
  "private": true,
  "scripts": {
    "compile": "npm run copy-driver-definition && node ../../node_modules/typescript/bin/tsc",
    "watch": "npm-run-all -lp watch-driver-definition watch-tsc",
    "watch-tsc": "node ../../node_modules/typescript/bin/tsc --watch --preserveWatchOutput",
    "copy-driver-definition": "node tools/copy-driver-definition.js",
    "watch-driver-definition": "nodemon --watch ../../src/vs/workbench/services/driver/common/driver.ts tools/copy-driver-definition.js",
    "copy-package-version": "node tools/copy-package-version.js",
    "prepublishOnly": "npm run copy-package-version"
  },
  "dependencies": {
    "ncp": "^2.0.0",
    "tmp": "0.2.4",
    "tree-kill": "1.2.2",
    "vscode-uri": "3.0.2"
  },
  "devDependencies": {
    "@types/ncp": "2.0.1",
    "@types/node": "22.x",
    "@types/tmp": "0.2.2",
    "cpx2": "3.0.0",
    "nodemon": "^3.1.9",
    "npm-run-all": "^4.1.5"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/README.md]---
Location: vscode-main/test/automation/README.md

```markdown
# VS Code Automation Package

This package contains functionality for automating various components of the VS Code UI, via an automation "driver" that connects from a separate process. It is used by the `smoke` tests.
```

--------------------------------------------------------------------------------

---[FILE: test/automation/tsconfig.json]---
Location: vscode-main/test/automation/tsconfig.json

```json
{
	"compilerOptions": {
		"module": "commonjs",
		"target": "es2024",
		"strict": true,
		"noUnusedParameters": false,
		"noUnusedLocals": true,
		"outDir": "out",
		"sourceMap": true,
		"declaration": true,
		"skipLibCheck": true,
		"lib": [
			"esnext", // for #201187
			"dom"
		],
		"paths": {
			"playwright-core/types/protocol": [
				"../../node_modules/playwright-core/types/protocol.d.ts"
			]
		}
	},
	"exclude": [
		"node_modules",
		"out",
		"tools"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/activityBar.ts]---
Location: vscode-main/test/automation/src/activityBar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Code } from './code';

export const enum ActivityBarPosition {
	LEFT = 0,
	RIGHT = 1
}

export class ActivityBar {

	constructor(private code: Code) { }

	async waitForActivityBar(position: ActivityBarPosition): Promise<void> {
		let positionClass: string;

		if (position === ActivityBarPosition.LEFT) {
			positionClass = 'left';
		} else if (position === ActivityBarPosition.RIGHT) {
			positionClass = 'right';
		} else {
			throw new Error('No such position for activity bar defined.');
		}

		await this.code.waitForElement(`.part.activitybar.${positionClass}`);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/application.ts]---
Location: vscode-main/test/automation/src/application.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Workbench } from './workbench';
import { Code, launch, LaunchOptions } from './code';
import { Logger, measureAndLog } from './logger';
import { Profiler } from './profiler';

export const enum Quality {
	Dev,
	Insiders,
	Stable,
	Exploration,
	OSS
}

export interface ApplicationOptions extends LaunchOptions {
	quality: Quality;
}

export class Application {

	constructor(private options: ApplicationOptions) {
		this._userDataPath = options.userDataDir;
		this._workspacePathOrFolder = options.workspacePath;
	}

	private _code: Code | undefined;
	get code(): Code { return this._code!; }

	private _workbench: Workbench | undefined;
	get workbench(): Workbench { return this._workbench!; }

	get quality(): Quality {
		return this.options.quality;
	}

	get logger(): Logger {
		return this.options.logger;
	}

	get remote(): boolean {
		return !!this.options.remote;
	}

	get web(): boolean {
		return !!this.options.web;
	}

	private _workspacePathOrFolder: string;
	get workspacePathOrFolder(): string {
		return this._workspacePathOrFolder;
	}

	get extensionsPath(): string | undefined {
		return this.options.extensionsPath;
	}

	private _userDataPath: string | undefined;
	get userDataPath(): string | undefined {
		return this._userDataPath;
	}

	private _profiler: Profiler | undefined;

	get profiler(): Profiler { return this._profiler!; }

	async start(): Promise<void> {
		await this._start();
	}

	async restart(options?: { workspaceOrFolder?: string; extraArgs?: string[] }): Promise<void> {
		await measureAndLog(() => (async () => {
			await this.stop();
			await this._start(options?.workspaceOrFolder, options?.extraArgs);
		})(), 'Application#restart()', this.logger);
	}

	private async _start(workspaceOrFolder = this.workspacePathOrFolder, extraArgs: string[] = []): Promise<void> {
		this._workspacePathOrFolder = workspaceOrFolder;

		// Launch Code...
		const code = await this.startApplication(extraArgs);

		// ...and make sure the window is ready to interact
		await measureAndLog(() => this.checkWindowReady(code), 'Application#checkWindowReady()', this.logger);
	}

	async stop(): Promise<void> {
		if (this._code) {
			try {
				await this._code.exit();
			} finally {
				this._code = undefined;
			}
		}
	}

	async startTracing(name?: string): Promise<void> {
		await this._code?.startTracing(name);
	}

	async stopTracing(name?: string, persist: boolean = false): Promise<void> {
		await this._code?.stopTracing(name, persist);
	}

	private async startApplication(extraArgs: string[] = []): Promise<Code> {
		const code = this._code = await launch({
			...this.options,
			extraArgs: [...(this.options.extraArgs || []), ...extraArgs],
		});

		this._workbench = new Workbench(this._code);
		this._profiler = new Profiler(this.code);

		return code;
	}

	private async checkWindowReady(code: Code): Promise<void> {

		// We need a rendered workbench
		await measureAndLog(() => code.didFinishLoad(), 'Application#checkWindowReady: wait for navigation to be committed', this.logger);
		await measureAndLog(() => code.waitForElement('.monaco-workbench'), 'Application#checkWindowReady: wait for .monaco-workbench element', this.logger);
		await measureAndLog(() => code.whenWorkbenchRestored(), 'Application#checkWorkbenchRestored', this.logger);

		// Remote but not web: wait for a remote connection state change
		if (this.remote) {
			await measureAndLog(() => code.waitForTextContent('.monaco-workbench .statusbar-item[id="status.host"]', undefined, statusHostLabel => {
				this.logger.log(`checkWindowReady: remote indicator text is ${statusHostLabel}`);

				// The absence of "Opening Remote" is not a strict
				// indicator for a successful connection, but we
				// want to avoid hanging here until timeout because
				// this method is potentially called from a location
				// that has no tracing enabled making it hard to
				// diagnose this. As such, as soon as the connection
				// state changes away from the "Opening Remote..." one
				// we return.
				return !statusHostLabel.includes('Opening Remote');
			}, 300 /* = 30s of retry */), 'Application#checkWindowReady: wait for remote indicator', this.logger);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/chat.ts]---
Location: vscode-main/test/automation/src/chat.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Code } from './code';
import { Notification } from './notification';

const CHAT_VIEW = 'div[id="workbench.panel.chat"]';
const CHAT_INPUT = `${CHAT_VIEW} .monaco-editor[role="code"]`;
const CHAT_INPUT_FOCUSED = `${CHAT_VIEW} .monaco-editor.focused[role="code"]`;

export class Chat {

	constructor(private code: Code, private notification: Notification) { }

	async waitForChatView(): Promise<void> {
		await this.code.waitForElement(CHAT_VIEW);
	}

	async waitForInputFocus(): Promise<void> {
		await this.code.waitForElement(CHAT_INPUT_FOCUSED);
	}

	async sendMessage(message: string): Promise<void> {
		if (await this.notification.isNotificationVisible()) {
			throw new Error('Notification is visible');
		}
		// Click on the chat input to focus it
		await this.code.waitAndClick(CHAT_INPUT);

		// Wait for the editor to be focused
		await this.waitForInputFocus();

		// Dispatch a paste event with the message
		await this.code.driver.currentPage.evaluate(({ selector, text }: { selector: string; text: string }) => {
			const element = document.querySelector(selector);
			if (element) {
				const dataTransfer = new DataTransfer();
				dataTransfer.setData('text/plain', text);
				const pasteEvent = new ClipboardEvent('paste', {
					clipboardData: dataTransfer,
					bubbles: true,
					cancelable: true
				});
				element.dispatchEvent(pasteEvent);
			}
		}, { selector: CHAT_INPUT, text: message });

		// Submit the message
		await this.code.dispatchKeybinding('enter', () => Promise.resolve());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/code.ts]---
Location: vscode-main/test/automation/src/code.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as cp from 'child_process';
import * as os from 'os';
import * as playwright from 'playwright';
import { IElement, ILocaleInfo, ILocalizedStrings, ILogFile } from './driver';
import { Logger, measureAndLog } from './logger';
import { launch as launchPlaywrightBrowser } from './playwrightBrowser';
import { PlaywrightDriver } from './playwrightDriver';
import { launch as launchPlaywrightElectron } from './playwrightElectron';
import { teardown } from './processes';
import { Quality } from './application';

export interface LaunchOptions {
	// Allows you to override the Playwright instance
	playwright?: typeof playwright;
	codePath?: string;
	readonly workspacePath: string;
	userDataDir?: string;
	readonly extensionsPath?: string;
	readonly logger: Logger;
	logsPath: string;
	crashesPath: string;
	readonly videosPath?: string;
	verbose?: boolean;
	useInMemorySecretStorage?: boolean;
	readonly extraArgs?: string[];
	readonly remote?: boolean;
	readonly web?: boolean;
	readonly tracing?: boolean;
	snapshots?: boolean;
	readonly headless?: boolean;
	readonly browser?: 'chromium' | 'webkit' | 'firefox' | 'chromium-msedge' | 'chromium-chrome';
	readonly quality: Quality;
	version: { major: number; minor: number; patch: number };
}

interface ICodeInstance {
	kill: () => Promise<void>;
}

const instances = new Set<ICodeInstance>();

function registerInstance(process: cp.ChildProcess, logger: Logger, type: 'electron' | 'server'): { safeToKill: Promise<void> } {
	const instance = { kill: () => teardown(process, logger) };
	instances.add(instance);

	const safeToKill = new Promise<void>(resolve => {
		process.stdout?.on('data', data => {
			const output = data.toString();
			if (output.indexOf('calling app.quit()') >= 0 && type === 'electron') {
				setTimeout(() => resolve(), 500 /* give Electron some time to actually terminate fully */);
			}
			logger.log(`[${type}] stdout: ${output}`);
		});
		process.stderr?.on('data', error => logger.log(`[${type}] stderr: ${error}`));
	});

	process.once('exit', (code, signal) => {
		logger.log(`[${type}] Process terminated (pid: ${process.pid}, code: ${code}, signal: ${signal})`);

		instances.delete(instance);
	});

	return { safeToKill };
}

async function teardownAll(signal?: number) {
	stopped = true;

	for (const instance of instances) {
		await instance.kill();
	}

	if (typeof signal === 'number') {
		process.exit(signal);
	}
}

let stopped = false;
process.on('exit', () => teardownAll());
process.on('SIGINT', () => teardownAll(128 + 2)); 	 // https://nodejs.org/docs/v14.16.0/api/process.html#process_signal_events
process.on('SIGTERM', () => teardownAll(128 + 15)); // same as above

export async function launch(options: LaunchOptions): Promise<Code> {
	if (stopped) {
		throw new Error('Smoke test process has terminated, refusing to spawn Code');
	}

	// Browser smoke tests
	if (options.web) {
		const { serverProcess, driver } = await measureAndLog(() => launchPlaywrightBrowser(options), 'launch playwright (browser)', options.logger);
		registerInstance(serverProcess, options.logger, 'server');

		return new Code(driver, options.logger, serverProcess, undefined, options.quality, options.version);
	}

	// Electron smoke tests (playwright)
	else {
		const { electronProcess, driver } = await measureAndLog(() => launchPlaywrightElectron(options), 'launch playwright (electron)', options.logger);
		const { safeToKill } = registerInstance(electronProcess, options.logger, 'electron');

		return new Code(driver, options.logger, electronProcess, safeToKill, options.quality, options.version);
	}
}

export class Code {

	readonly driver: PlaywrightDriver;

	constructor(
		driver: PlaywrightDriver,
		readonly logger: Logger,
		private readonly mainProcess: cp.ChildProcess,
		private readonly safeToKill: Promise<void> | undefined,
		readonly quality: Quality,
		readonly version: { major: number; minor: number; patch: number }
	) {
		this.driver = new Proxy(driver, {
			get(target, prop) {
				if (typeof prop === 'symbol') {
					throw new Error('Invalid usage');
				}

				// eslint-disable-next-line local/code-no-any-casts
				const targetProp = (target as any)[prop];
				if (typeof targetProp !== 'function') {
					return targetProp;
				}

				return function (this: any, ...args: any[]) {
					logger.log(`${prop}`, ...args.filter(a => typeof a === 'string'));
					return targetProp.apply(this, args);
				};
			}
		});
	}

	get editContextEnabled(): boolean {
		return !(this.quality === Quality.Stable && this.version.major === 1 && this.version.minor < 101);
	}

	async startTracing(name?: string): Promise<void> {
		return await this.driver.startTracing(name);
	}

	async stopTracing(name?: string, persist: boolean = false): Promise<void> {
		return await this.driver.stopTracing(name, persist);
	}

	/**
	 * Dispatch a keybinding to the application.
	 * @param keybinding The keybinding to dispatch, e.g. 'ctrl+shift+p'.
	 * @param accept The acceptance function to await before returning. Wherever
	 * possible this should verify that the keybinding did what was expected,
	 * otherwise it will likely be a cause of difficult to investigate race
	 * conditions. This is particularly insidious when used in the automation
	 * library as it can surface across many test suites.
	 *
	 * This requires an async function even when there's no implementation to
	 * force the author to think about the accept callback and prevent mistakes
	 * like not making it async.
	 */
	async dispatchKeybinding(keybinding: string, accept: () => Promise<void>): Promise<void> {
		await this.driver.sendKeybinding(keybinding, accept);
	}

	async didFinishLoad(): Promise<void> {
		return this.driver.didFinishLoad();
	}

	async exit(): Promise<void> {
		return measureAndLog(() => new Promise<void>(resolve => {
			const pid = this.mainProcess.pid!;

			let done = false;

			// Start the exit flow via driver
			this.driver.close();

			let safeToKill = false;
			this.safeToKill?.then(() => {
				this.logger.log('Smoke test exit(): safeToKill() called');
				safeToKill = true;
			});

			// Await the exit of the application
			(async () => {
				let retries = 0;
				while (!done) {
					retries++;

					if (safeToKill) {
						this.logger.log('Smoke test exit(): call did not terminate the process yet, but safeToKill is true, so we can kill it');
						this.kill(pid);
					}

					switch (retries) {

						// after 10 seconds: forcefully kill
						case 20: {
							this.logger.log('Smoke test exit(): call did not terminate process after 10s, forcefully exiting the application...');
							this.kill(pid);
							break;
						}

						// after 20 seconds: give up
						case 40: {
							this.logger.log('Smoke test exit(): call did not terminate process after 20s, giving up');
							this.kill(pid);
							done = true;
							resolve();
							break;
						}
					}

					try {
						process.kill(pid, 0); // throws an exception if the process doesn't exist anymore.
						await this.wait(500);
					} catch (error) {
						this.logger.log('Smoke test exit(): call terminated process successfully');

						done = true;
						resolve();
					}
				}
			})();
		}), 'Code#exit()', this.logger);
	}

	private kill(pid: number): void {
		try {
			process.kill(pid, 0); // throws an exception if the process doesn't exist anymore.
		} catch (e) {
			this.logger.log('Smoke test kill(): returning early because process does not exist anymore');
			return;
		}

		try {
			this.logger.log(`Smoke test kill(): Trying to SIGTERM process: ${pid}`);
			process.kill(pid);
		} catch (e) {
			this.logger.log('Smoke test kill(): SIGTERM failed', e);
		}
	}

	async getElement(selector: string): Promise<IElement | undefined> {
		return (await this.driver.getElements(selector))?.[0];
	}

	async getElements(selector: string, recursive: boolean): Promise<IElement[] | undefined> {
		return this.driver.getElements(selector, recursive);
	}

	async waitForTextContent(selector: string, textContent?: string, accept?: (result: string) => boolean, retryCount?: number): Promise<string> {
		accept = accept || (result => textContent !== undefined ? textContent === result : !!result);

		return await this.poll(
			() => this.driver.getElements(selector).then(els => els.length > 0 ? Promise.resolve(els[0].textContent) : Promise.reject(new Error('Element not found for textContent'))),
			s => accept!(typeof s === 'string' ? s : ''),
			`get text content '${selector}'`,
			retryCount
		);
	}

	async waitAndClick(selector: string, xoffset?: number, yoffset?: number, retryCount: number = 200): Promise<void> {
		await this.poll(() => this.driver.click(selector, xoffset, yoffset), () => true, `click '${selector}'`, retryCount);
	}

	async waitForSetValue(selector: string, value: string): Promise<void> {
		await this.poll(() => this.driver.setValue(selector, value), () => true, `set value '${selector}'`);
	}

	async waitForElements(selector: string, recursive: boolean, accept: (result: IElement[]) => boolean = result => result.length > 0): Promise<IElement[]> {
		return await this.poll(() => this.driver.getElements(selector, recursive), accept, `get elements '${selector}'`);
	}

	async waitForElement(selector: string, accept: (result: IElement | undefined) => boolean = result => !!result, retryCount: number = 200): Promise<IElement> {
		return await this.poll<IElement>(() => this.driver.getElements(selector).then(els => els[0]), accept, `get element '${selector}'`, retryCount);
	}

	async waitForActiveElement(selector: string, retryCount: number = 200): Promise<void> {
		await this.poll(() => this.driver.isActiveElement(selector), r => r, `is active element '${selector}'`, retryCount);
	}

	async waitForTitle(accept: (title: string) => boolean): Promise<void> {
		await this.poll(() => this.driver.getTitle(), accept, `get title`);
	}

	async waitForTypeInEditor(selector: string, text: string): Promise<void> {
		await this.poll(() => this.driver.typeInEditor(selector, text), () => true, `type in editor '${selector}'`);
	}

	async waitForEditorSelection(selector: string, accept: (selection: { selectionStart: number; selectionEnd: number }) => boolean): Promise<void> {
		await this.poll(() => this.driver.getEditorSelection(selector), accept, `get editor selection '${selector}'`);
	}

	async waitForTerminalBuffer(selector: string, accept: (result: string[]) => boolean): Promise<void> {
		await this.poll(() => this.driver.getTerminalBuffer(selector), accept, `get terminal buffer '${selector}'`);
	}

	async writeInTerminal(selector: string, value: string): Promise<void> {
		await this.poll(() => this.driver.writeInTerminal(selector, value), () => true, `writeInTerminal '${selector}'`);
	}

	async whenWorkbenchRestored(): Promise<void> {
		await this.poll(() => this.driver.whenWorkbenchRestored(), () => true, `when workbench restored`);
	}

	getLocaleInfo(): Promise<ILocaleInfo> {
		return this.driver.getLocaleInfo();
	}

	getLocalizedStrings(): Promise<ILocalizedStrings> {
		return this.driver.getLocalizedStrings();
	}

	getLogs(): Promise<ILogFile[]> {
		return this.driver.getLogs();
	}

	wait(millis: number): Promise<void> {
		return this.driver.wait(millis);
	}

	private async poll<T>(
		fn: () => Promise<T>,
		acceptFn: (result: T) => boolean,
		timeoutMessage: string,
		retryCount = 200,
		retryInterval = 100 // millis
	): Promise<T> {
		let trial = 1;
		let lastError: string = '';

		while (true) {
			if (trial > retryCount) {
				this.logger.log('Timeout!');
				this.logger.log(lastError);
				this.logger.log(`Timeout: ${timeoutMessage} after ${(retryCount * retryInterval) / 1000} seconds.`);

				throw new Error(`Timeout: ${timeoutMessage} after ${(retryCount * retryInterval) / 1000} seconds.`);
			}

			let result;
			try {
				result = await fn();
				if (acceptFn(result)) {
					return result;
				} else {
					lastError = 'Did not pass accept function';
				}
			} catch (e: any) {
				lastError = Array.isArray(e.stack) ? e.stack.join(os.EOL) : e.stack;
			}

			await this.wait(retryInterval);
			trial++;
		}
	}
}

export function findElement(element: IElement, fn: (element: IElement) => boolean): IElement | null {
	const queue = [element];

	while (queue.length > 0) {
		const element = queue.shift()!;

		if (fn(element)) {
			return element;
		}

		queue.push(...element.children);
	}

	return null;
}

export function findElements(element: IElement, fn: (element: IElement) => boolean): IElement[] {
	const result: IElement[] = [];
	const queue = [element];

	while (queue.length > 0) {
		const element = queue.shift()!;

		if (fn(element)) {
			result.push(element);
		}

		queue.push(...element.children);
	}

	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/debug.ts]---
Location: vscode-main/test/automation/src/debug.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Viewlet } from './viewlet';
import { Commands } from './workbench';
import { Code, findElement } from './code';
import { Editors } from './editors';
import { Editor } from './editor';
import { IElement } from './driver';

const VIEWLET = 'div[id="workbench.view.debug"]';
const DEBUG_VIEW = `${VIEWLET}`;
const CONFIGURE = `div[id="workbench.parts.sidebar"] .actions-container .codicon-gear`;
const STOP = `.debug-toolbar .action-label[title*="Stop"]`;
const STEP_OVER = `.debug-toolbar .action-label[title*="Step Over"]`;
const STEP_IN = `.debug-toolbar .action-label[title*="Step Into"]`;
const STEP_OUT = `.debug-toolbar .action-label[title*="Step Out"]`;
const CONTINUE = `.debug-toolbar .action-label[title*="Continue"]`;
const GLYPH_AREA = '.margin-view-overlays>:nth-child';
const BREAKPOINT_GLYPH = '.codicon-debug-breakpoint';
const PAUSE = `.debug-toolbar .action-label[title*="Pause"]`;
const DEBUG_STATUS_BAR = `.statusbar.debugging`;
const NOT_DEBUG_STATUS_BAR = `.statusbar:not(debugging)`;
const TOOLBAR_HIDDEN = `.debug-toolbar[aria-hidden="true"]`;
const STACK_FRAME = `${VIEWLET} .monaco-list-row .stack-frame`;
const SPECIFIC_STACK_FRAME = (filename: string) => `${STACK_FRAME} .file[title*="${filename}"]`;
const VARIABLE = `${VIEWLET} .debug-variables .monaco-list-row .expression`;
const CONSOLE_OUTPUT = `.repl .output.expression .value`;
const CONSOLE_EVALUATION_RESULT = `.repl .evaluation-result.expression .value`;
const CONSOLE_LINK = `.repl .value a.link`;

const REPL_FOCUSED_NATIVE_EDIT_CONTEXT = '.repl-input-wrapper .monaco-editor .native-edit-context';
const REPL_FOCUSED_TEXTAREA = '.repl-input-wrapper .monaco-editor textarea';

export interface IStackFrame {
	name: string;
	lineNumber: number;
}

function toStackFrame(element: IElement): IStackFrame {
	const name = findElement(element, e => /\bfile-name\b/.test(e.className))!;
	const line = findElement(element, e => /\bline-number\b/.test(e.className))!;
	const lineNumber = line.textContent ? parseInt(line.textContent.split(':').shift() || '0') : 0;

	return {
		name: name.textContent || '',
		lineNumber
	};
}

export class Debug extends Viewlet {

	constructor(code: Code, private commands: Commands, private editors: Editors, private editor: Editor) {
		super(code);
	}

	async openDebugViewlet(): Promise<any> {
		await this.code.dispatchKeybinding(process.platform === 'darwin' ? 'cmd+shift+d' : 'ctrl+shift+d', async () => {
			await this.code.waitForElement(DEBUG_VIEW);
		});
	}

	async configure(): Promise<any> {
		await this.code.waitAndClick(CONFIGURE);
		await this.editors.waitForEditorFocus('launch.json');
	}

	async setBreakpointOnLine(lineNumber: number): Promise<any> {
		await this.code.waitForElement(`${GLYPH_AREA}(${lineNumber})`);
		await this.code.waitAndClick(`${GLYPH_AREA}(${lineNumber})`, 5, 5);
		await this.code.waitForElement(BREAKPOINT_GLYPH);
	}

	async startDebugging(): Promise<number> {
		await this.code.dispatchKeybinding('f5', async () => {
			await this.code.waitForElement(PAUSE);
			await this.code.waitForElement(DEBUG_STATUS_BAR);
		});
		const portPrefix = 'Port: ';

		const output = await this.waitForOutput(output => output.some(line => line.indexOf(portPrefix) >= 0));
		const lastOutput = output.filter(line => line.indexOf(portPrefix) >= 0)[0];

		return lastOutput ? parseInt(lastOutput.substr(portPrefix.length)) : 3000;
	}

	async stepOver(): Promise<any> {
		await this.code.waitAndClick(STEP_OVER);
	}

	async stepIn(): Promise<any> {
		await this.code.waitAndClick(STEP_IN);
	}

	async stepOut(): Promise<any> {
		await this.code.waitAndClick(STEP_OUT);
	}

	async continue(): Promise<any> {
		await this.code.waitAndClick(CONTINUE);
		await this.waitForStackFrameLength(0);
	}

	async stopDebugging(): Promise<any> {
		await this.code.waitAndClick(STOP);
		await this.code.waitForElement(TOOLBAR_HIDDEN);
		await this.code.waitForElement(NOT_DEBUG_STATUS_BAR);
	}

	async waitForStackFrame(func: (stackFrame: IStackFrame) => boolean, message: string): Promise<IStackFrame> {
		const elements = await this.code.waitForElements(STACK_FRAME, true, elements => elements.some(e => func(toStackFrame(e))));
		return elements.map(toStackFrame).filter(s => func(s))[0];
	}

	async waitForStackFrameLength(length: number): Promise<any> {
		await this.code.waitForElements(STACK_FRAME, false, result => result.length === length);
	}

	async focusStackFrame(name: string, message: string): Promise<any> {
		await this.code.waitAndClick(SPECIFIC_STACK_FRAME(name), 0, 0);
		await this.editors.waitForTab(name);
	}

	async waitForReplCommand(text: string, accept: (result: string) => boolean): Promise<void> {
		await this.commands.runCommand('Debug: Focus on Debug Console View');
		const selector = !this.code.editContextEnabled ? REPL_FOCUSED_TEXTAREA : REPL_FOCUSED_NATIVE_EDIT_CONTEXT;
		await this.code.waitForActiveElement(selector);
		await this.code.waitForSetValue(selector, text);

		// Wait for the keys to be picked up by the editor model such that repl evaluates what just got typed
		await this.editor.waitForEditorContents('debug:replinput', s => s.indexOf(text) >= 0);
		await this.code.dispatchKeybinding('enter', async () => {
			await this.code.waitForElements(CONSOLE_EVALUATION_RESULT, false,
				elements => !!elements.length && accept(elements[elements.length - 1].textContent));
		});
	}

	// Different node versions give different number of variables. As a workaround be more relaxed when checking for variable count
	async waitForVariableCount(count: number, alternativeCount: number): Promise<void> {
		await this.code.waitForElements(VARIABLE, false, els => els.length === count || els.length === alternativeCount);
	}

	async waitForLink(): Promise<void> {
		await this.code.waitForElement(CONSOLE_LINK);
	}

	private async waitForOutput(fn: (output: string[]) => boolean): Promise<string[]> {
		const elements = await this.code.waitForElements(CONSOLE_OUTPUT, false, elements => fn(elements.map(e => e.textContent)));
		return elements.map(e => e.textContent);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/editor.ts]---
Location: vscode-main/test/automation/src/editor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { References } from './peek';
import { Commands } from './workbench';
import { Code } from './code';

const RENAME_BOX = '.monaco-editor .monaco-editor.rename-box';
const RENAME_INPUT = `${RENAME_BOX} .rename-input`;
const EDITOR = (filename: string) => `.monaco-editor[data-uri$="${filename}"]`;
const VIEW_LINES = (filename: string) => `${EDITOR(filename)} .view-lines`;
const LINE_NUMBERS = (filename: string) => `${EDITOR(filename)} .margin .margin-view-overlays .line-numbers`;

export class Editor {

	private static readonly FOLDING_EXPANDED = '.monaco-editor .margin .margin-view-overlays>:nth-child(${INDEX}) .folding';
	private static readonly FOLDING_COLLAPSED = `${Editor.FOLDING_EXPANDED}.collapsed`;

	constructor(private code: Code, private commands: Commands) { }

	async findReferences(filename: string, term: string, line: number): Promise<References> {
		await this.clickOnTerm(filename, term, line);
		await this.commands.runCommand('Peek References');
		const references = new References(this.code);
		await references.waitUntilOpen();
		return references;
	}

	async rename(filename: string, line: number, from: string, to: string): Promise<void> {
		await this.clickOnTerm(filename, from, line);
		await this.commands.runCommand('Rename Symbol');

		await this.code.waitForActiveElement(RENAME_INPUT);
		await this.code.waitForSetValue(RENAME_INPUT, to);

		await this.code.dispatchKeybinding('enter', async () => {
			// TODO: Add an accept callback to verify the keybinding was successful
		});
	}

	async gotoDefinition(filename: string, term: string, line: number): Promise<void> {
		await this.clickOnTerm(filename, term, line);
		await this.commands.runCommand('Go to Implementations');
	}

	async peekDefinition(filename: string, term: string, line: number): Promise<References> {
		await this.clickOnTerm(filename, term, line);
		await this.commands.runCommand('Peek Definition');
		const peek = new References(this.code);
		await peek.waitUntilOpen();
		return peek;
	}

	private async getSelector(filename: string, term: string, line: number): Promise<string> {
		const lineIndex = await this.getViewLineIndex(filename, line);
		const classNames = await this.getClassSelectors(filename, term, lineIndex);

		return `${VIEW_LINES(filename)}>:nth-child(${lineIndex}) span span.${classNames[0]}`;
	}

	async foldAtLine(filename: string, line: number): Promise<any> {
		const lineIndex = await this.getViewLineIndex(filename, line);
		await this.code.waitAndClick(Editor.FOLDING_EXPANDED.replace('${INDEX}', '' + lineIndex));
		await this.code.waitForElement(Editor.FOLDING_COLLAPSED.replace('${INDEX}', '' + lineIndex));
	}

	async unfoldAtLine(filename: string, line: number): Promise<any> {
		const lineIndex = await this.getViewLineIndex(filename, line);
		await this.code.waitAndClick(Editor.FOLDING_COLLAPSED.replace('${INDEX}', '' + lineIndex));
		await this.code.waitForElement(Editor.FOLDING_EXPANDED.replace('${INDEX}', '' + lineIndex));
	}

	private async clickOnTerm(filename: string, term: string, line: number): Promise<void> {
		const selector = await this.getSelector(filename, term, line);
		await this.code.waitAndClick(selector);
	}

	async waitForEditorFocus(filename: string, lineNumber: number, selectorPrefix = ''): Promise<void> {
		const editor = [selectorPrefix || '', EDITOR(filename)].join(' ');
		const line = `${editor} .view-lines > .view-line:nth-child(${lineNumber})`;
		const editContext = `${editor} ${this._editContextSelector()}`;

		await this.code.waitAndClick(line, 1, 1);
		await this.code.waitForActiveElement(editContext);
	}

	async waitForTypeInEditor(filename: string, text: string, selectorPrefix = ''): Promise<any> {
		if (text.includes('\n')) {
			throw new Error('waitForTypeInEditor does not support new lines, use either a long single line or dispatchKeybinding(\'Enter\')');
		}
		const editor = [selectorPrefix || '', EDITOR(filename)].join(' ');

		await this.code.waitForElement(editor);

		const editContext = `${editor} ${this._editContextSelector()}`;
		await this.code.waitForActiveElement(editContext);

		await this.code.waitForTypeInEditor(editContext, text);

		await this.waitForEditorContents(filename, c => c.indexOf(text) > -1, selectorPrefix);
	}

	async waitForEditorSelection(filename: string, accept: (selection: { selectionStart: number; selectionEnd: number }) => boolean): Promise<void> {
		const selector = `${EDITOR(filename)} ${this._editContextSelector()}`;
		await this.code.waitForEditorSelection(selector, accept);
	}

	private _editContextSelector() {
		return !this.code.editContextEnabled ? 'textarea' : '.native-edit-context';
	}

	async waitForEditorContents(filename: string, accept: (contents: string) => boolean, selectorPrefix = ''): Promise<any> {
		const selector = [selectorPrefix || '', `${EDITOR(filename)} .view-lines`].join(' ');
		return this.code.waitForTextContent(selector, undefined, c => accept(c.replace(/\u00a0/g, ' ')));
	}

	private async getClassSelectors(filename: string, term: string, viewline: number): Promise<string[]> {
		const elements = await this.code.waitForElements(`${VIEW_LINES(filename)}>:nth-child(${viewline}) span span`, false, els => els.some(el => el.textContent === term));
		const { className } = elements.filter(r => r.textContent === term)[0];
		return className.split(/\s/g);
	}

	private async getViewLineIndex(filename: string, line: number): Promise<number> {
		const elements = await this.code.waitForElements(LINE_NUMBERS(filename), false, els => {
			return els.some(el => el.textContent === `${line}`);
		});

		for (let index = 0; index < elements.length; index++) {
			if (elements[index].textContent === `${line}`) {
				return index + 1;
			}
		}

		throw new Error('Line not found');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/editors.ts]---
Location: vscode-main/test/automation/src/editors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Code } from './code';

export class Editors {

	constructor(private code: Code) { }

	async saveOpenedFile(): Promise<any> {
		await this.code.dispatchKeybinding(process.platform === 'darwin' ? 'cmd+s' : 'ctrl+s', async () => {
			await this.code.waitForElements('.tab.active.dirty', false, results => results.length === 0);
		});
	}

	async selectTab(fileName: string): Promise<void> {

		// Selecting a tab and making an editor have keyboard focus
		// is critical to almost every test. As such, we try our
		// best to retry this task in case some other component steals
		// focus away from the editor while we attempt to get focus

		let error: unknown | undefined = undefined;
		let retries = 0;
		while (retries < 10) {
			await this.code.waitAndClick(`.tabs-container div.tab[data-resource-name$="${fileName}"]`);

			try {
				await this.waitForEditorFocus(fileName, 5 /* 5 retries * 100ms delay = 0.5s */);
				return;
			} catch (e) {
				error = e;
				retries++;
			}
		}

		// We failed after 10 retries
		throw error;
	}

	async waitForEditorFocus(fileName: string, retryCount?: number): Promise<void> {
		await this.waitForActiveTab(fileName, undefined, retryCount);
		await this.waitForActiveEditor(fileName, retryCount);
	}

	async waitForActiveTab(fileName: string, isDirty: boolean = false, retryCount?: number): Promise<void> {
		await this.code.waitForElement(`.tabs-container div.tab.active${isDirty ? '.dirty' : ''}[aria-selected="true"][data-resource-name$="${fileName}"]`, undefined, retryCount);
	}

	async waitForActiveEditor(fileName: string, retryCount?: number): Promise<any> {
		const selector = `.editor-instance .monaco-editor[data-uri$="${fileName}"] ${!this.code.editContextEnabled ? 'textarea' : '.native-edit-context'}`;
		return this.code.waitForActiveElement(selector, retryCount);
	}

	async waitForTab(fileName: string, isDirty: boolean = false): Promise<void> {
		await this.code.waitForElement(`.tabs-container div.tab${isDirty ? '.dirty' : ''}[data-resource-name$="${fileName}"]`);
	}

	async newUntitledFile(): Promise<void> {
		const accept = () => this.waitForEditorFocus('Untitled-1');
		if (process.platform === 'darwin') {
			await this.code.dispatchKeybinding('cmd+n', accept);
		} else {
			await this.code.dispatchKeybinding('ctrl+n', accept);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/electron.ts]---
Location: vscode-main/test/automation/src/electron.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { join } from 'path';
import * as fs from 'fs';
import { copyExtension } from './extensions';
import { URI } from 'vscode-uri';
import { measureAndLog } from './logger';
import type { LaunchOptions } from './code';

const root = join(__dirname, '..', '..', '..');

export interface IElectronConfiguration {
	readonly electronPath: string;
	readonly args: string[];
	readonly env?: NodeJS.ProcessEnv;
}

export async function resolveElectronConfiguration(options: LaunchOptions): Promise<IElectronConfiguration> {
	const { codePath, workspacePath, extensionsPath, userDataDir, remote, logger, logsPath, crashesPath, extraArgs } = options;
	const env = { ...process.env };

	const args = [
		workspacePath,
		'--skip-release-notes',
		'--skip-welcome',
		'--disable-telemetry',
		'--disable-experiments',
		'--no-cached-data',
		'--disable-updates',
		'--disable-extension=vscode.vscode-api-tests',
		`--crash-reporter-directory=${crashesPath}`,
		'--disable-workspace-trust',
		`--logsPath=${logsPath}`
	];
	if (options.useInMemorySecretStorage) {
		args.push('--use-inmemory-secretstorage');
	}
	if (userDataDir) {
		args.push(`--user-data-dir=${userDataDir}`);
	}
	if (extensionsPath) {
		args.push(`--extensions-dir=${extensionsPath}`);
	}
	if (options.verbose) {
		args.push('--verbose');
	}

	if (remote) {
		// Replace workspace path with URI
		args[0] = `--${workspacePath.endsWith('.code-workspace') ? 'file' : 'folder'}-uri=vscode-remote://test+test/${URI.file(workspacePath).path}`;

		if (codePath) {
			if (!extensionsPath) {
				throw new Error('Extensions path is required when running against a build at the moment.');
			}
			// running against a build: copy the test resolver extension
			await measureAndLog(() => copyExtension(root, extensionsPath, 'vscode-test-resolver'), 'copyExtension(vscode-test-resolver)', logger);
		}
		args.push('--enable-proposed-api=vscode.vscode-test-resolver');
		if (userDataDir) {
			const remoteDataDir = `${userDataDir}-server`;
			fs.mkdirSync(remoteDataDir, { recursive: true });
			env['TESTRESOLVER_DATA_FOLDER'] = remoteDataDir;
		}
		env['TESTRESOLVER_LOGS_FOLDER'] = join(logsPath, 'server');
		if (options.verbose) {
			env['TESTRESOLVER_LOG_LEVEL'] = 'trace';
		}
	}

	if (!codePath) {
		args.unshift(root);
	}

	if (extraArgs) {
		args.push(...extraArgs);
	}

	const electronPath = codePath ? getBuildElectronPath(codePath) : getDevElectronPath();

	return {
		env,
		args,
		electronPath
	};
}

function findFilePath(root: string, path: string): string {
	// First check if the path exists directly in the root
	const directPath = join(root, path);
	if (fs.existsSync(directPath)) {
		return directPath;
	}

	// If not found directly, search through subdirectories
	const entries = fs.readdirSync(root, { withFileTypes: true });

	for (const entry of entries) {
		if (entry.isDirectory()) {
			const found = join(root, entry.name, path);
			if (fs.existsSync(found)) {
				return found;
			}
		}
	}

	throw new Error(`Could not find ${path} in any subdirectory`);
}

export function getDevElectronPath(): string {
	const buildPath = join(root, '.build');
	const product = require(join(root, 'product.json'));

	switch (process.platform) {
		case 'darwin':
			return join(buildPath, 'electron', `${product.nameLong}.app`, 'Contents', 'MacOS', 'Electron');
		case 'linux':
			return join(buildPath, 'electron', `${product.applicationName}`);
		case 'win32':
			return join(buildPath, 'electron', `${product.nameShort}.exe`);
		default:
			throw new Error('Unsupported platform.');
	}
}

export function getBuildElectronPath(root: string): string {
	switch (process.platform) {
		case 'darwin':
			return join(root, 'Contents', 'MacOS', 'Electron');
		case 'linux': {
			const product = require(join(root, 'resources', 'app', 'product.json'));
			return join(root, product.applicationName);
		}
		case 'win32': {
			const productPath = findFilePath(root, join('resources', 'app', 'product.json'));
			const product = require(productPath);
			return join(root, `${product.nameShort}.exe`);
		}
		default:
			throw new Error('Unsupported platform.');
	}
}

export function getBuildVersion(root: string): string {
	switch (process.platform) {
		case 'darwin':
			return require(join(root, 'Contents', 'Resources', 'app', 'package.json')).version;
		case 'win32': {
			const packagePath = findFilePath(root, join('resources', 'app', 'package.json'));
			return require(packagePath).version;
		}
		default:
			return require(join(root, 'resources', 'app', 'package.json')).version;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/explorer.ts]---
Location: vscode-main/test/automation/src/explorer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Viewlet } from './viewlet';
import { Code } from './code';

export class Explorer extends Viewlet {

	private static readonly EXPLORER_VIEWLET = 'div[id="workbench.view.explorer"]';
	private static readonly OPEN_EDITORS_VIEW = `${Explorer.EXPLORER_VIEWLET} .split-view-view:nth-child(1) .title`;

	constructor(code: Code) {
		super(code);
	}

	async openExplorerView(): Promise<any> {
		await this.code.dispatchKeybinding(process.platform === 'darwin' ? 'cmd+shift+e' : 'ctrl+shift+e', async () => {
			await this.code.waitForElement(Explorer.EXPLORER_VIEWLET);
		});
	}

	async waitForOpenEditorsViewTitle(fn: (title: string) => boolean): Promise<void> {
		await this.code.waitForTextContent(Explorer.OPEN_EDITORS_VIEW, undefined, fn);
	}

	getExtensionSelector(fileName: string): string {
		const extension = fileName.split('.')[1];
		if (extension === 'js') {
			return 'js-ext-file-icon ext-file-icon javascript-lang-file-icon';
		} else if (extension === 'json') {
			return 'json-ext-file-icon ext-file-icon json-lang-file-icon';
		} else if (extension === 'md') {
			return 'md-ext-file-icon ext-file-icon markdown-lang-file-icon';
		}
		throw new Error('No class defined for this file extension');
	}

}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/extensions.ts]---
Location: vscode-main/test/automation/src/extensions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Viewlet } from './viewlet';
import { Code } from './code';
import { ncp } from 'ncp';
import { promisify } from 'util';
import { Commands } from './workbench';
import path = require('path');
import fs = require('fs');


export class Extensions extends Viewlet {

	constructor(code: Code, private commands: Commands) {
		super(code);
	}

	async searchForExtension(id: string): Promise<any> {
		await this.commands.runCommand('Extensions: Focus on Extensions View', { exactLabelMatch: true });
		await this.code.waitForTypeInEditor(`div.extensions-viewlet[id="workbench.view.extensions"] .monaco-editor ${!this.code.editContextEnabled ? 'textarea' : '.native-edit-context'}`, `@id:${id}`);
		await this.code.waitForTextContent(`div.part.sidebar div.composite.title h2`, 'Extensions: Marketplace');

		let retrials = 1;
		while (retrials++ < 10) {
			try {
				return await this.code.waitForElement(`div.extensions-viewlet[id="workbench.view.extensions"] .monaco-list-row[data-extension-id="${id}"]`, undefined, 100);
			} catch (error) {
				this.code.logger.log(`Extension '${id}' is not found. Retrying count: ${retrials}`);
				await this.commands.runCommand('workbench.extensions.action.refreshExtension');
			}
		}
		throw new Error(`Extension ${id} is not found`);
	}

	async openExtension(id: string): Promise<any> {
		await this.searchForExtension(id);
		await this.code.waitAndClick(`div.extensions-viewlet[id="workbench.view.extensions"] .monaco-list-row[data-extension-id="${id}"]`);
	}

	async closeExtension(title: string): Promise<any> {
		try {
			await this.code.waitAndClick(`.tabs-container div.tab[aria-label="Extension: ${title}, preview"] div.tab-actions a.action-label.codicon.codicon-close`);
		} catch (e) {
			this.code.logger.log(`Extension '${title}' not opened as preview. Trying without 'preview'.`);
			await this.code.waitAndClick(`.tabs-container div.tab[aria-label="Extension: ${title}"] div.tab-actions a.action-label.codicon.codicon-close`);
		}
	}

	async installExtension(id: string, waitUntilEnabled: boolean): Promise<void> {
		await this.searchForExtension(id);

		// try to install extension 3 times
		let attempt = 1;
		while (true) {
			await this.code.waitAndClick(`div.extensions-viewlet[id="workbench.view.extensions"] .monaco-list-row[data-extension-id="${id}"] .extension-list-item .monaco-action-bar .action-item:not(.disabled) .extension-action.install`);

			try {
				await this.waitForExtensionToBeInstalled();
				break;
			} catch (err) {
				if (attempt++ === 3) {
					throw err;
				}
			}
		}

		if (waitUntilEnabled) {
			await this.code.waitForElement(`.extension-editor .monaco-action-bar .action-item:not(.disabled) a[aria-label="Disable this extension"]`);
		}
	}

	private async waitForExtensionToBeInstalled(): Promise<void> {
		let attempt = 1;
		while (true) {
			try {
				await this.code.waitForElement(`.extension-editor .monaco-action-bar .action-item:not(.disabled) .extension-action.uninstall`, undefined);
				break;
			} catch (err) {
				if (await this.code.getElement(`.extension-editor .monaco-action-bar .action-item .extension-action.install.installing`)) {
					if (attempt++ === 3) {
						throw err;
					}
					this.code.logger.log('Extension is still being installed. Waiting...');
				} else {
					throw err;
				}
			}
		}
	}
}

export async function copyExtension(repoPath: string, extensionsPath: string, extId: string): Promise<void> {
	const dest = path.join(extensionsPath, extId);
	if (!fs.existsSync(dest)) {
		const orig = path.join(repoPath, 'extensions', extId);

		return promisify(ncp)(orig, dest);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/index.ts]---
Location: vscode-main/test/automation/src/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export * from './activityBar';
export * from './application';
export * from './code';
export * from './debug';
export * from './editor';
export * from './editors';
export * from './explorer';
export * from './extensions';
export * from './keybindings';
export * from './logger';
export * from './peek';
export * from './problems';
export * from './quickinput';
export * from './quickaccess';
export * from './scm';
export * from './search';
export * from './settings';
export * from './statusbar';
export * from './terminal';
export * from './viewlet';
export * from './localization';
export * from './workbench';
export * from './task';
export * from './chat';
export * from './notification';
export { getDevElectronPath, getBuildElectronPath, getBuildVersion } from './electron';
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/keybindings.ts]---
Location: vscode-main/test/automation/src/keybindings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Code } from './code';

const SEARCH_INPUT = '.keybindings-header .settings-search-input input';

export class KeybindingsEditor {

	constructor(private code: Code) { }

	async updateKeybinding(command: string, commandName: string | undefined, keybinding: string, keybindingTitle: string): Promise<any> {
		const accept = () => this.code.waitForActiveElement(SEARCH_INPUT);
		if (process.platform === 'darwin') {
			await this.code.dispatchKeybinding('cmd+k cmd+s', accept);
		} else {
			await this.code.dispatchKeybinding('ctrl+k ctrl+s', accept);
		}

		await this.code.waitForActiveElement(SEARCH_INPUT);
		await this.code.waitForSetValue(SEARCH_INPUT, `@command:${command}`);

		const commandTitle = commandName ? `${commandName} (${command})` : command;
		await this.code.waitAndClick(`.keybindings-table-container .monaco-list-row .command[aria-label="${commandTitle}"]`);
		await this.code.waitForElement(`.keybindings-table-container .monaco-list-row.focused.selected .command[aria-label="${commandTitle}"]`);
		await this.code.dispatchKeybinding('enter', () => this.code.waitForActiveElement('.defineKeybindingWidget .monaco-inputbox input'));
		await this.code.dispatchKeybinding(keybinding, async () => { }); // No accept cb is fine as the following keybinding verifies
		await this.code.dispatchKeybinding('enter', async () => { await this.code.waitForElement(`.keybindings-table-container .keybinding-label div[aria-label="${keybindingTitle}"]`); });
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/localization.ts]---
Location: vscode-main/test/automation/src/localization.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Code } from './code';
import { ILocalizedStrings, ILocaleInfo } from './driver';

export class Localization {
	constructor(private code: Code) { }

	async getLocaleInfo(): Promise<ILocaleInfo> {
		return this.code.getLocaleInfo();
	}

	async getLocalizedStrings(): Promise<ILocalizedStrings> {
		return this.code.getLocalizedStrings();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/logger.ts]---
Location: vscode-main/test/automation/src/logger.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { appendFileSync, writeFileSync } from 'fs';
import { format } from 'util';
import { EOL } from 'os';

export interface Logger {
	log(message: string, ...args: any[]): void;
}

export class ConsoleLogger implements Logger {

	log(message: string, ...args: any[]): void {
		console.log('**', message, ...args);
	}
}

export class FileLogger implements Logger {

	constructor(private path: string) {
		writeFileSync(path, '');
	}

	log(message: string, ...args: any[]): void {
		const date = new Date().toISOString();
		appendFileSync(this.path, `[${date}] ${format(message, ...args)}${EOL}`);
	}
}

export class MultiLogger implements Logger {

	constructor(private loggers: Logger[]) { }

	log(message: string, ...args: any[]): void {
		for (const logger of this.loggers) {
			logger.log(message, ...args);
		}
	}
}

export async function measureAndLog<T>(promiseFactory: () => Promise<T>, name: string, logger: Logger): Promise<T> {
	const now = Date.now();

	logger.log(`Starting operation '${name}'...`);

	let res: T | undefined = undefined;
	let e: unknown;
	try {
		res = await promiseFactory();
	} catch (error) {
		e = error;
	}

	if (e) {
		logger.log(`Finished operation '${name}' with error ${e} after ${Date.now() - now}ms`);
		throw e;
	}

	logger.log(`Finished operation '${name}' successfully after ${Date.now() - now}ms`);

	return res as unknown as T;
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/notebook.ts]---
Location: vscode-main/test/automation/src/notebook.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Code } from './code';
import { QuickAccess } from './quickaccess';
import { QuickInput } from './quickinput';

const anyRowSelector = `.notebook-editor .monaco-list-row`;
const activeRowSelector = `${anyRowSelector}.focused`;
const activeMarkdownRowSelector = `${activeRowSelector}.markdown-cell-row`;

export class Notebook {

	constructor(
		private readonly quickAccess: QuickAccess,
		private readonly quickInput: QuickInput,
		private readonly code: Code) {
	}

	async openNotebook() {
		await this.code.whenWorkbenchRestored();
		await this.quickAccess.openFileQuickAccessAndWait('notebook.ipynb', 1);
		await this.quickInput.selectQuickInputElement(0);

		await this.code.waitForElement(anyRowSelector);
		await this.focusFirstCell();
		await this.code.waitForElement(activeRowSelector);
	}

	async focusNextCell() {
		await this.code.dispatchKeybinding('down', async () => {
			// TODO: Add an accept callback to verify the keybinding was successful
		});
	}

	async focusFirstCell() {
		await this.quickAccess.runCommand('notebook.focusTop');
	}

	async editCell() {
		await this.code.dispatchKeybinding('enter', async () => {
			// TODO: Add an accept callback to verify the keybinding was successful
		});
	}

	async stopEditingCell() {
		await this.quickAccess.runCommand('notebook.cell.quitEdit');
	}

	async waitForTypeInEditor(text: string): Promise<any> {
		const editor = `${activeRowSelector} .monaco-editor`;

		await this.code.waitForElement(editor);

		const editContext = `${editor} ${!this.code.editContextEnabled ? 'textarea' : '.native-edit-context'}`;
		await this.code.waitForActiveElement(editContext);

		await this.code.waitForTypeInEditor(editContext, text);

		await this._waitForActiveCellEditorContents(c => c.indexOf(text) > -1);
	}

	async waitForActiveCellEditorContents(contents: string): Promise<any> {
		return this._waitForActiveCellEditorContents(str => str === contents);
	}

	private async _waitForActiveCellEditorContents(accept: (contents: string) => boolean): Promise<any> {
		const selector = `${activeRowSelector} .monaco-editor .view-lines`;
		return this.code.waitForTextContent(selector, undefined, c => accept(c.replace(/\u00a0/g, ' ')));
	}

	async waitForMarkdownContents(markdownSelector: string, text: string): Promise<void> {
		const selector = `${activeMarkdownRowSelector} ${markdownSelector}`;
		await this.code.waitForTextContent(selector, text);
	}

	async insertNotebookCell(kind: 'markdown' | 'code'): Promise<void> {
		if (kind === 'markdown') {
			await this.quickAccess.runCommand('notebook.cell.insertMarkdownCellBelow');
		} else {
			await this.quickAccess.runCommand('notebook.cell.insertCodeCellBelow');
		}
	}

	async deleteActiveCell(): Promise<void> {
		await this.quickAccess.runCommand('notebook.cell.delete');
	}

	async focusInCellOutput(): Promise<void> {
		await this.quickAccess.runCommand('notebook.cell.focusInOutput');
		await this.code.waitForActiveElement('iframe.webview.ready');
	}

	async focusOutCellOutput(): Promise<void> {
		await this.quickAccess.runCommand('notebook.cell.focusOutOutput');
	}

	async executeActiveCell(): Promise<void> {
		await this.quickAccess.runCommand('notebook.cell.execute');
	}

	async executeCellAction(selector: string): Promise<void> {
		await this.code.waitAndClick(selector);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/notification.ts]---
Location: vscode-main/test/automation/src/notification.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Code } from './code';

const NOTIFICATION_TOAST = '.notification-toast';

export class Notification {

	constructor(private code: Code) { }

	async isNotificationVisible(): Promise<boolean> {
		try {
			await this.code.waitForElement(NOTIFICATION_TOAST, undefined, 1);
			return true;
		} catch {
			return false;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/peek.ts]---
Location: vscode-main/test/automation/src/peek.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Code } from './code';

export class References {

	private static readonly REFERENCES_WIDGET = '.monaco-editor .zone-widget .zone-widget-container.peekview-widget.reference-zone-widget.results-loaded';
	private static readonly REFERENCES_TITLE_FILE_NAME = `${References.REFERENCES_WIDGET} .head .peekview-title .filename`;
	private static readonly REFERENCES_TITLE_COUNT = `${References.REFERENCES_WIDGET} .head .peekview-title .meta`;
	private static readonly REFERENCES = `${References.REFERENCES_WIDGET} .body .ref-tree.inline .monaco-list-row .highlight`;

	constructor(private code: Code) { }

	async waitUntilOpen(): Promise<void> {
		await this.code.waitForElement(References.REFERENCES_WIDGET);
	}

	async waitForReferencesCountInTitle(count: number): Promise<void> {
		await this.code.waitForTextContent(References.REFERENCES_TITLE_COUNT, undefined, titleCount => {
			const matches = titleCount.match(/\d+/);
			return matches ? parseInt(matches[0]) === count : false;
		});
	}

	async waitForReferencesCount(count: number): Promise<void> {
		await this.code.waitForElements(References.REFERENCES, false, result => result && result.length === count);
	}

	async waitForFile(file: string): Promise<void> {
		await this.code.waitForTextContent(References.REFERENCES_TITLE_FILE_NAME, file);
	}

	async close(): Promise<void> {
		// Sometimes someone else eats up the `Escape` key
		let count = 0;
		while (true) {

			try {
				await this.code.dispatchKeybinding('escape', async () => { await this.code.waitForElement(References.REFERENCES_WIDGET, el => !el, 10); });
				return;
			} catch (err) {
				if (++count > 5) {
					throw err;
				}
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/playwrightBrowser.ts]---
Location: vscode-main/test/automation/src/playwrightBrowser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as playwright from '@playwright/test';
import { ChildProcess, spawn } from 'child_process';
import { join } from 'path';
import * as fs from 'fs';
import { URI } from 'vscode-uri';
import { Logger, measureAndLog } from './logger';
import type { LaunchOptions } from './code';
import { PlaywrightDriver } from './playwrightDriver';

const root = join(__dirname, '..', '..', '..');

let port = 9000;

export async function launch(options: LaunchOptions): Promise<{ serverProcess: ChildProcess; driver: PlaywrightDriver }> {

	// Launch server
	const { serverProcess, endpoint } = await launchServer(options);

	// Launch browser
	const { browser, context, page, pageLoadedPromise } = await launchBrowser(options, endpoint);

	return {
		serverProcess,
		driver: new PlaywrightDriver(browser, context, page, serverProcess, pageLoadedPromise, options)
	};
}

async function launchServer(options: LaunchOptions) {
	const { userDataDir, codePath, extensionsPath, logger, logsPath } = options;
	const serverLogsPath = join(logsPath, 'server');
	const codeServerPath = codePath ?? process.env.VSCODE_REMOTE_SERVER_PATH;
	const agentFolder = userDataDir;

	const env = {
		VSCODE_REMOTE_SERVER_PATH: codeServerPath,
		...process.env
	};

	const args = [
		'--disable-telemetry',
		'--disable-experiments',
		'--disable-workspace-trust',
		`--port=${port++}`,
		'--enable-smoke-test-driver',
		'--accept-server-license-terms',
		`--logsPath=${serverLogsPath}`
	];
	if (agentFolder) {
		await measureAndLog(() => fs.promises.mkdir(agentFolder, { recursive: true }), `mkdirp(${agentFolder})`, logger);
		args.push(`--server-data-dir=${agentFolder}`);
	}
	if (extensionsPath) {
		args.push(`--extensions-dir=${extensionsPath}`);
	}

	if (options.verbose) {
		args.push('--log=trace');
	}

	let serverLocation: string | undefined;
	if (codeServerPath) {
		const { serverApplicationName } = require(join(codeServerPath, 'product.json'));
		serverLocation = join(codeServerPath, 'bin', `${serverApplicationName}${process.platform === 'win32' ? '.cmd' : ''}`);

		logger.log(`Starting built server from '${serverLocation}'`);
	} else {
		serverLocation = join(root, `scripts/code-server.${process.platform === 'win32' ? 'bat' : 'sh'}`);

		logger.log(`Starting server out of sources from '${serverLocation}'`);
	}

	logger.log(`Storing log files into '${serverLogsPath}'`);

	logger.log(`Command line: '${serverLocation}' ${args.join(' ')}`);
	const shell: boolean = (process.platform === 'win32');
	const serverProcess = spawn(
		serverLocation,
		args,
		{ env, shell }
	);

	logger.log(`Started server for browser smoke tests (pid: ${serverProcess.pid})`);

	return {
		serverProcess,
		endpoint: await measureAndLog(() => waitForEndpoint(serverProcess, logger), 'waitForEndpoint(serverProcess)', logger)
	};
}

async function launchBrowser(options: LaunchOptions, endpoint: string) {
	const { logger, workspacePath, tracing, snapshots, headless } = options;

	const playwrightImpl = options.playwright ?? playwright;
	const [browserType, browserChannel] = (options.browser ?? 'chromium').split('-');
	const browser = await measureAndLog(() => playwrightImpl[browserType as unknown as 'chromium' | 'webkit' | 'firefox'].launch({
		headless: headless ?? false,
		timeout: 0,
		channel: browserChannel,
	}), 'playwright#launch', logger);

	browser.on('disconnected', () => logger.log(`Playwright: browser disconnected`));

	const context = await measureAndLog(
		() => browser.newContext({
			recordVideo: options.videosPath
				? {
					dir: options.videosPath,
					size: { width: 1920, height: 1080 }
				} : undefined,
		}),
		'browser.newContext',
		logger
	);

	if (tracing) {
		try {
			await measureAndLog(() => context.tracing.start({ screenshots: true, snapshots }), 'context.tracing.start()', logger);
		} catch (error) {
			logger.log(`Playwright (Browser): Failed to start playwright tracing (${error})`); // do not fail the build when this fails
		}
	}

	const page = await measureAndLog(() => context.newPage(), 'context.newPage()', logger);
	await measureAndLog(() => page.setViewportSize({ width: 1440, height: 900 }), 'page.setViewportSize', logger);

	if (options.verbose) {
		context.on('page', () => logger.log(`Playwright (Browser): context.on('page')`));
		context.on('requestfailed', e => logger.log(`Playwright (Browser): context.on('requestfailed') [${e.failure()?.errorText} for ${e.url()}]`));

		page.on('console', e => logger.log(`Playwright (Browser): window.on('console') [${e.text()}]`));
		page.on('dialog', () => logger.log(`Playwright (Browser): page.on('dialog')`));
		page.on('domcontentloaded', () => logger.log(`Playwright (Browser): page.on('domcontentloaded')`));
		page.on('load', () => logger.log(`Playwright (Browser): page.on('load')`));
		page.on('popup', () => logger.log(`Playwright (Browser): page.on('popup')`));
		page.on('framenavigated', () => logger.log(`Playwright (Browser): page.on('framenavigated')`));
		page.on('requestfailed', e => logger.log(`Playwright (Browser): page.on('requestfailed') [${e.failure()?.errorText} for ${e.url()}]`));
	}

	page.on('pageerror', async (error) => logger.log(`Playwright (Browser) ERROR: page error: ${error}`));
	page.on('crash', () => logger.log('Playwright (Browser) ERROR: page crash'));
	page.on('close', () => logger.log('Playwright (Browser): page close'));
	page.on('response', async (response) => {
		if (response.status() >= 400) {
			logger.log(`Playwright (Browser) ERROR: HTTP status ${response.status()} for ${response.url()}`);
		}
	});

	const payloadParam = `[${[
		'["enableProposedApi",""]',
		'["skipWelcome", "true"]',
		'["skipReleaseNotes", "true"]',
		`["logLevel","${options.verbose ? 'trace' : 'info'}"]`
	].join(',')}]`;

	const gotoPromise = measureAndLog(() => page.goto(`${endpoint}&${workspacePath.endsWith('.code-workspace') ? 'workspace' : 'folder'}=${URI.file(workspacePath!).path}&payload=${payloadParam}`), 'page.goto()', logger);
	const pageLoadedPromise = page.waitForLoadState('load');

	await gotoPromise;

	return { browser, context, page, pageLoadedPromise };
}

function waitForEndpoint(server: ChildProcess, logger: Logger): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		let endpointFound = false;

		server.stdout?.on('data', data => {
			if (!endpointFound) {
				logger.log(`[server] stdout: ${data}`); // log until endpoint found to diagnose issues
			}

			const matches = data.toString('ascii').match(/Web UI available at (.+)/);
			if (matches !== null) {
				endpointFound = true;

				resolve(matches[1]);
			}
		});

		server.stderr?.on('data', error => {
			if (!endpointFound) {
				logger.log(`[server] stderr: ${error}`); // log until endpoint found to diagnose issues
			}

			if (error.toString().indexOf('EADDRINUSE') !== -1) {
				reject(new Error(error));
			}
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/playwrightDriver.ts]---
Location: vscode-main/test/automation/src/playwrightDriver.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as playwright from '@playwright/test';
import type { Protocol } from 'playwright-core/types/protocol';
import { dirname, join } from 'path';
import { promises } from 'fs';
import { IWindowDriver } from './driver';
import { measureAndLog } from './logger';
import { LaunchOptions } from './code';
import { teardown } from './processes';
import { ChildProcess } from 'child_process';

type PageFunction<Arg, T> = (arg: Arg) => T | Promise<T>;

export class PlaywrightDriver {

	private static traceCounter = 1;
	private static screenShotCounter = 1;

	private static readonly vscodeToPlaywrightKey: { [key: string]: string } = {
		cmd: 'Meta',
		ctrl: 'Control',
		shift: 'Shift',
		enter: 'Enter',
		escape: 'Escape',
		right: 'ArrowRight',
		up: 'ArrowUp',
		down: 'ArrowDown',
		left: 'ArrowLeft',
		home: 'Home',
		esc: 'Escape'
	};

	constructor(
		private readonly application: playwright.Browser | playwright.ElectronApplication,
		private readonly context: playwright.BrowserContext,
		private readonly page: playwright.Page,
		private readonly serverProcess: ChildProcess | undefined,
		private readonly whenLoaded: Promise<unknown>,
		private readonly options: LaunchOptions
	) {
	}

	get browserContext(): playwright.BrowserContext {
		return this.context;
	}

	get currentPage(): playwright.Page {
		return this.page;
	}

	async startTracing(name?: string): Promise<void> {
		if (!this.options.tracing) {
			return; // tracing disabled
		}

		try {
			await measureAndLog(() => this.context.tracing.startChunk({ title: name }), `startTracing${name ? ` for ${name}` : ''}`, this.options.logger);
		} catch (error) {
			// Ignore
		}
	}

	async stopTracing(name?: string, persist: boolean = false): Promise<void> {
		if (!this.options.tracing) {
			return; // tracing disabled
		}

		try {
			let persistPath: string | undefined = undefined;
			if (persist) {
				const nameSuffix = name ? `-${name.replace(/\s+/g, '-')}` : '';
				persistPath = join(this.options.logsPath, `playwright-trace-${PlaywrightDriver.traceCounter++}${nameSuffix}.zip`);
			}

			await measureAndLog(() => this.context.tracing.stopChunk({ path: persistPath }), `stopTracing${name ? ` for ${name}` : ''}`, this.options.logger);

			// To ensure we have a screenshot at the end where
			// it failed, also trigger one explicitly. Tracing
			// does not guarantee to give us a screenshot unless
			// some driver action ran before.
			if (persist) {
				await this.takeScreenshot(name);
			}
		} catch (error) {
			// Ignore
		}
	}

	async didFinishLoad(): Promise<void> {
		await this.whenLoaded;
	}

	private _cdpSession: playwright.CDPSession | undefined;

	async startCDP() {
		if (this._cdpSession) {
			return;
		}

		this._cdpSession = await this.page.context().newCDPSession(this.page);
	}

	async collectGarbage() {
		if (!this._cdpSession) {
			throw new Error('CDP not started');
		}

		await this._cdpSession.send('HeapProfiler.collectGarbage');
	}

	async evaluate(options: Protocol.Runtime.evaluateParameters): Promise<Protocol.Runtime.evaluateReturnValue> {
		if (!this._cdpSession) {
			throw new Error('CDP not started');
		}

		return await this._cdpSession.send('Runtime.evaluate', options);
	}

	async releaseObjectGroup(parameters: Protocol.Runtime.releaseObjectGroupParameters): Promise<void> {
		if (!this._cdpSession) {
			throw new Error('CDP not started');
		}

		await this._cdpSession.send('Runtime.releaseObjectGroup', parameters);
	}

	async queryObjects(parameters: Protocol.Runtime.queryObjectsParameters): Promise<Protocol.Runtime.queryObjectsReturnValue> {
		if (!this._cdpSession) {
			throw new Error('CDP not started');
		}

		return await this._cdpSession.send('Runtime.queryObjects', parameters);
	}

	async callFunctionOn(parameters: Protocol.Runtime.callFunctionOnParameters): Promise<Protocol.Runtime.callFunctionOnReturnValue> {
		if (!this._cdpSession) {
			throw new Error('CDP not started');
		}

		return await this._cdpSession.send('Runtime.callFunctionOn', parameters);
	}

	async takeHeapSnapshot(): Promise<string> {
		if (!this._cdpSession) {
			throw new Error('CDP not started');
		}

		let snapshot = '';
		const listener = (c: { chunk: string }) => {
			snapshot += c.chunk;
		};

		this._cdpSession.addListener('HeapProfiler.addHeapSnapshotChunk', listener);

		await this._cdpSession.send('HeapProfiler.takeHeapSnapshot');

		this._cdpSession.removeListener('HeapProfiler.addHeapSnapshotChunk', listener);
		return snapshot;
	}

	async getProperties(parameters: Protocol.Runtime.getPropertiesParameters): Promise<Protocol.Runtime.getPropertiesReturnValue> {
		if (!this._cdpSession) {
			throw new Error('CDP not started');
		}

		return await this._cdpSession.send('Runtime.getProperties', parameters);
	}

	private async takeScreenshot(name?: string): Promise<void> {
		try {
			const nameSuffix = name ? `-${name.replace(/\s+/g, '-')}` : '';
			const persistPath = join(this.options.logsPath, `playwright-screenshot-${PlaywrightDriver.screenShotCounter++}${nameSuffix}.png`);

			await measureAndLog(() => this.page.screenshot({ path: persistPath, type: 'png' }), 'takeScreenshot', this.options.logger);
		} catch (error) {
			// Ignore
		}
	}

	async reload() {
		await this.page.reload();
	}

	async close() {

		// Stop tracing
		try {
			if (this.options.tracing) {
				await measureAndLog(() => this.context.tracing.stop(), 'stop tracing', this.options.logger);
			}
		} catch (error) {
			// Ignore
		}

		// Web: Extract client logs
		if (this.options.web) {
			try {
				await measureAndLog(() => this.saveWebClientLogs(), 'saveWebClientLogs()', this.options.logger);
			} catch (error) {
				this.options.logger.log(`Error saving web client logs (${error})`);
			}
		}

		//  exit via `close` method
		try {
			await measureAndLog(() => this.application.close(), 'playwright.close()', this.options.logger);
		} catch (error) {
			this.options.logger.log(`Error closing application (${error})`);
		}

		// Server: via `teardown`
		if (this.serverProcess) {
			await measureAndLog(() => teardown(this.serverProcess!, this.options.logger), 'teardown server process', this.options.logger);
		}
	}

	private async saveWebClientLogs(): Promise<void> {
		const logs = await this.getLogs();

		for (const log of logs) {
			const absoluteLogsPath = join(this.options.logsPath, log.relativePath);

			await promises.mkdir(dirname(absoluteLogsPath), { recursive: true });
			await promises.writeFile(absoluteLogsPath, log.contents);
		}
	}

	async sendKeybinding(keybinding: string, accept?: () => Promise<void> | void) {
		const chords = keybinding.split(' ');
		for (let i = 0; i < chords.length; i++) {
			const chord = chords[i];
			if (i > 0) {
				await this.wait(100);
			}

			if (keybinding.startsWith('Alt') || keybinding.startsWith('Control') || keybinding.startsWith('Backspace')) {
				await this.page.keyboard.press(keybinding);
				return;
			}

			const keys = chord.split('+');
			const keysDown: string[] = [];
			for (let i = 0; i < keys.length; i++) {
				if (keys[i] in PlaywrightDriver.vscodeToPlaywrightKey) {
					keys[i] = PlaywrightDriver.vscodeToPlaywrightKey[keys[i]];
				}
				await this.page.keyboard.down(keys[i]);
				keysDown.push(keys[i]);
			}
			while (keysDown.length > 0) {
				await this.page.keyboard.up(keysDown.pop()!);
			}
		}

		await accept?.();
	}

	async click(selector: string, xoffset?: number | undefined, yoffset?: number | undefined) {
		const { x, y } = await this.getElementXY(selector, xoffset, yoffset);
		await this.page.mouse.click(x + (xoffset ? xoffset : 0), y + (yoffset ? yoffset : 0));
	}

	async setValue(selector: string, text: string) {
		return this.page.evaluate(([driver, selector, text]) => driver.setValue(selector, text), [await this.getDriverHandle(), selector, text] as const);
	}

	async getTitle() {
		return this.page.title();
	}

	async isActiveElement(selector: string) {
		return this.page.evaluate(([driver, selector]) => driver.isActiveElement(selector), [await this.getDriverHandle(), selector] as const);
	}

	async getElements(selector: string, recursive: boolean = false) {
		return this.page.evaluate(([driver, selector, recursive]) => driver.getElements(selector, recursive), [await this.getDriverHandle(), selector, recursive] as const);
	}

	async getElementXY(selector: string, xoffset?: number, yoffset?: number) {
		return this.page.evaluate(([driver, selector, xoffset, yoffset]) => driver.getElementXY(selector, xoffset, yoffset), [await this.getDriverHandle(), selector, xoffset, yoffset] as const);
	}

	async typeInEditor(selector: string, text: string) {
		return this.page.evaluate(([driver, selector, text]) => driver.typeInEditor(selector, text), [await this.getDriverHandle(), selector, text] as const);
	}

	async getEditorSelection(selector: string) {
		return this.page.evaluate(([driver, selector]) => driver.getEditorSelection(selector), [await this.getDriverHandle(), selector] as const);
	}

	async getTerminalBuffer(selector: string) {
		return this.page.evaluate(([driver, selector]) => driver.getTerminalBuffer(selector), [await this.getDriverHandle(), selector] as const);
	}

	async writeInTerminal(selector: string, text: string) {
		return this.page.evaluate(([driver, selector, text]) => driver.writeInTerminal(selector, text), [await this.getDriverHandle(), selector, text] as const);
	}

	async getLocaleInfo() {
		return this.evaluateWithDriver(([driver]) => driver.getLocaleInfo());
	}

	async getLocalizedStrings() {
		return this.evaluateWithDriver(([driver]) => driver.getLocalizedStrings());
	}

	async getLogs() {
		return this.page.evaluate(([driver]) => driver.getLogs(), [await this.getDriverHandle()] as const);
	}

	private async evaluateWithDriver<T>(pageFunction: PageFunction<IWindowDriver[], T>) {
		return this.page.evaluate(pageFunction, [await this.getDriverHandle()]);
	}

	wait(ms: number): Promise<void> {
		return wait(ms);
	}

	whenWorkbenchRestored(): Promise<void> {
		return this.evaluateWithDriver(([driver]) => driver.whenWorkbenchRestored());
	}

	private async getDriverHandle(): Promise<playwright.JSHandle<IWindowDriver>> {
		return this.page.evaluateHandle('window.driver');
	}

	async isAlive(): Promise<boolean> {
		try {
			await this.getDriverHandle();
			return true;
		} catch (error) {
			return false;
		}
	}
}

export function wait(ms: number): Promise<void> {
	return new Promise<void>(resolve => setTimeout(resolve, ms));
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/playwrightElectron.ts]---
Location: vscode-main/test/automation/src/playwrightElectron.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as playwright from '@playwright/test';
import type { LaunchOptions } from './code';
import { PlaywrightDriver } from './playwrightDriver';
import { IElectronConfiguration, resolveElectronConfiguration } from './electron';
import { measureAndLog } from './logger';
import { ChildProcess } from 'child_process';

export async function launch(options: LaunchOptions): Promise<{ electronProcess: ChildProcess; driver: PlaywrightDriver }> {

	// Resolve electron config and update
	const { electronPath, args, env } = await resolveElectronConfiguration(options);
	args.push('--enable-smoke-test-driver');

	// Launch electron via playwright
	const { electron, context, page } = await launchElectron({ electronPath, args, env }, options);
	const electronProcess = electron.process();

	return {
		electronProcess,
		driver: new PlaywrightDriver(electron, context, page, undefined /* no server process */, Promise.resolve() /* Window is open already */, options)
	};
}

async function launchElectron(configuration: IElectronConfiguration, options: LaunchOptions) {
	const { logger, tracing, snapshots } = options;

	const playwrightImpl = options.playwright ?? playwright;
	const electron = await measureAndLog(() => playwrightImpl._electron.launch({
		executablePath: configuration.electronPath,
		args: configuration.args,
		recordVideo: options.videosPath
			? {
				dir: options.videosPath,
				size: { width: 1920, height: 1080 }
			} : undefined,
		env: configuration.env as { [key: string]: string },
		timeout: 0
	}), 'playwright-electron#launch', logger);

	let window = electron.windows()[0];
	if (!window) {
		window = await measureAndLog(() => electron.waitForEvent('window', { timeout: 0 }), 'playwright-electron#firstWindow', logger);
	}

	const context = window.context();

	if (tracing) {
		try {
			await measureAndLog(() => context.tracing.start({ screenshots: true, snapshots }), 'context.tracing.start()', logger);
		} catch (error) {
			logger.log(`Playwright (Electron): Failed to start playwright tracing (${error})`); // do not fail the build when this fails
		}
	}

	if (options.verbose) {
		electron.on('window', () => logger.log(`Playwright (Electron): electron.on('window')`));
		electron.on('close', () => logger.log(`Playwright (Electron): electron.on('close')`));

		context.on('page', () => logger.log(`Playwright (Electron): context.on('page')`));
		context.on('requestfailed', e => logger.log(`Playwright (Electron): context.on('requestfailed') [${e.failure()?.errorText} for ${e.url()}]`));

		window.on('dialog', () => logger.log(`Playwright (Electron): window.on('dialog')`));
		window.on('domcontentloaded', () => logger.log(`Playwright (Electron): window.on('domcontentloaded')`));
		window.on('load', () => logger.log(`Playwright (Electron): window.on('load')`));
		window.on('popup', () => logger.log(`Playwright (Electron): window.on('popup')`));
		window.on('framenavigated', () => logger.log(`Playwright (Electron): window.on('framenavigated')`));
		window.on('requestfailed', e => logger.log(`Playwright (Electron): window.on('requestfailed') [${e.failure()?.errorText} for ${e.url()}]`));
	}

	window.on('console', e => logger.log(`Playwright (Electron): window.on('console') [${e.text()}]`));
	window.on('pageerror', async (error) => logger.log(`Playwright (Electron) ERROR: page error: ${error}`));
	window.on('crash', () => logger.log('Playwright (Electron) ERROR: page crash'));
	window.on('close', () => logger.log('Playwright (Electron): page close'));
	window.on('response', async (response) => {
		if (response.status() >= 400) {
			logger.log(`Playwright (Electron) ERROR: HTTP status ${response.status()} for ${response.url()}`);
		}
	});

	return { electron, context, page: window };
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/problems.ts]---
Location: vscode-main/test/automation/src/problems.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Code } from './code';
import { QuickAccess } from './quickaccess';

export const enum ProblemSeverity {
	WARNING = 0,
	ERROR = 1
}

export class Problems {

	static PROBLEMS_VIEW_SELECTOR = '.panel .markers-panel';

	constructor(private code: Code, private quickAccess: QuickAccess) { }

	async showProblemsView(): Promise<any> {
		await this.quickAccess.runCommand('workbench.panel.markers.view.focus');
		await this.waitForProblemsView();
	}

	async hideProblemsView(): Promise<any> {
		await this.quickAccess.runCommand('workbench.actions.view.problems');
		await this.code.waitForElement(Problems.PROBLEMS_VIEW_SELECTOR, el => !el);
	}

	async waitForProblemsView(): Promise<void> {
		await this.code.waitForElement(Problems.PROBLEMS_VIEW_SELECTOR);
	}

	static getSelectorInProblemsView(problemType: ProblemSeverity): string {
		const selector = problemType === ProblemSeverity.WARNING ? 'codicon-warning' : 'codicon-error';
		return `div[id="workbench.panel.markers"] .monaco-tl-contents .marker-icon .${selector}`;
	}

	static getSelectorInEditor(problemType: ProblemSeverity): string {
		const selector = problemType === ProblemSeverity.WARNING ? 'squiggly-warning' : 'squiggly-error';
		return `.view-overlays .cdr.${selector}`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/processes.ts]---
Location: vscode-main/test/automation/src/processes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ChildProcess } from 'child_process';
import { promisify } from 'util';
import treekill from 'tree-kill';
import { Logger } from './logger';

export async function teardown(p: ChildProcess, logger: Logger, retryCount = 3): Promise<void> {
	const pid = p.pid;
	if (typeof pid !== 'number') {
		return;
	}

	let retries = 0;
	while (retries < retryCount) {
		retries++;

		try {
			return await promisify(treekill)(pid);
		} catch (error) {
			try {
				process.kill(pid, 0); // throws an exception if the process doesn't exist anymore
				logger.log(`Error tearing down process (pid: ${pid}, attempt: ${retries}): ${error}`);
			} catch (error) {
				return; // Expected when process is gone
			}
		}
	}

	logger.log(`Gave up tearing down process client after ${retries} attempts...`);
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/profiler.ts]---
Location: vscode-main/test/automation/src/profiler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const { decode_bytes } = require('@vscode/v8-heap-parser');
import { Code } from './code';
import { PlaywrightDriver } from './playwrightDriver';

export class Profiler {
	constructor(private readonly code: Code) {
	}

	async checkObjectLeaks(classNames: string | string[], fn: () => Promise<void>): Promise<void> {
		await this.code.driver.startCDP();

		const classNamesArray = Array.isArray(classNames) ? classNames : [classNames];
		const countsBefore = await getInstances(this.code.driver, classNamesArray);

		await fn();

		const countAfter = await getInstances(this.code.driver, classNamesArray);
		const leaks: string[] = [];
		for (const className of classNamesArray) {
			const count = countAfter[className] ?? 0;
			const countBefore = countsBefore[className] ?? 0;
			if (count !== countBefore) {
				leaks.push(`Leaked ${count - countBefore} ${className}`);
			}
		}

		if (leaks.length > 0) {
			throw new Error(leaks.join('\n'));
		}
	}

	async checkHeapLeaks(classNames: string | string[], fn: () => Promise<void>): Promise<void> {
		await this.code.driver.startCDP();
		await fn();

		const heapSnapshotAfter = await this.code.driver.takeHeapSnapshot();
		const buff = Buffer.from(heapSnapshotAfter);
		const graph = await decode_bytes(buff);
		const counts: number[] = Array.from(graph.get_class_counts(classNames));
		const leaks: string[] = [];
		for (let i = 0; i < classNames.length; i++) {
			if (counts[i] > 0) {
				leaks.push(`Leaked ${counts[i]} ${classNames[i]}`);
			}
		}

		if (leaks.length > 0) {
			throw new Error(leaks.join('\n'));
		}
	}
}

/**
 * Copied from src/vs/base/common/uuid.ts
 */
export function generateUuid(): string {
	// use `randomUUID` if possible
	if (typeof crypto.randomUUID === 'function') {
		// see https://developer.mozilla.org/en-US/docs/Web/API/Window/crypto
		// > Although crypto is available on all windows, the returned Crypto object only has one
		// > usable feature in insecure contexts: the getRandomValues() method.
		// > In general, you should use this API only in secure contexts.

		return crypto.randomUUID.bind(crypto)();
	}

	// prep-work
	const _data = new Uint8Array(16);
	const _hex: string[] = [];
	for (let i = 0; i < 256; i++) {
		_hex.push(i.toString(16).padStart(2, '0'));
	}

	// get data
	crypto.getRandomValues(_data);

	// set version bits
	_data[6] = (_data[6] & 0x0f) | 0x40;
	_data[8] = (_data[8] & 0x3f) | 0x80;

	// print as string
	let i = 0;
	let result = '';
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += '-';
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += '-';
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += '-';
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += '-';
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	result += _hex[_data[i++]];
	return result;
}



/*---------------------------------------------------------------------------------------------
 *  The MIT License (MIT)
 *  Copyright (c) 2023-present, Simon Siefke
 *
 *  This code is derived from https://github.com/SimonSiefke/vscode-memory-leak-finder
 *--------------------------------------------------------------------------------------------*/

const getInstances = async (driver: PlaywrightDriver, classNames: string[]): Promise<{ [key: string]: number }> => {
	await driver.collectGarbage();
	const objectGroup = `og:${generateUuid()}`;
	const prototypeDescriptor = await driver.evaluate({
		expression: 'Object.prototype',
		returnByValue: false,
		objectGroup,
	});
	const objects = await driver.queryObjects({
		prototypeObjectId: prototypeDescriptor.result.objectId!,
		objectGroup,
	});
	const fnResult1 = await driver.callFunctionOn({
		functionDeclaration: `function(){
	const objects = this
	const classNames = ${JSON.stringify(classNames)}

	const nativeConstructors = [
		Object,
		Array,
		Function,
		Set,
		Map,
		WeakMap,
		WeakSet,
		RegExp,
		Node,
		HTMLScriptElement,
		DOMRectReadOnly,
		DOMRect,
		HTMLHtmlElement,
		Node,
		DOMTokenList,
		HTMLUListElement,
		HTMLStyleElement,
		HTMLDivElement,
		HTMLCollection,
		FocusEvent,
		Promise,
		HTMLLinkElement,
		HTMLLIElement,
		HTMLAnchorElement,
		HTMLSpanElement,
		ArrayBuffer,
		Uint16Array,
		HTMLLabelElement,
		TrustedTypePolicy,
		Uint8Array,
		Uint32Array,
		HTMLHeadingElement,
		MediaQueryList,
		HTMLDocument,
		TextDecoder,
		TextEncoder,
		HTMLInputElement,
		HTMLCanvasElement,
		HTMLIFrameElement,
		Int32Array,
		CSSStyleDeclaration
	]

	const isNativeConstructor = object => {
		return nativeConstructors.includes(object.constructor) ||
			object.constructor.name === 'AsyncFunction' ||
			object.constructor.name === 'GeneratorFunction' ||
			object.constructor.name === 'AsyncGeneratorFunction'
	}

	const isInstance = (object) => {
		return object && !isNativeConstructor(object)
	}

	const instances = objects.filter(isInstance)

	const counts = Object.create(null)
	for(const instance of instances){
		const name=instance.constructor.name
		if(classNames.includes(name)){
			counts[name]||= 0
			counts[name]++
		}
	}
	return counts
}`,
		objectId: objects.objects.objectId,
		returnByValue: true,
		objectGroup,
	});

	const returnObject = fnResult1.result.value;
	await driver.releaseObjectGroup({ objectGroup: objectGroup });
	return returnObject;
};
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/quickaccess.ts]---
Location: vscode-main/test/automation/src/quickaccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Editors } from './editors';
import { Code } from './code';
import { QuickInput } from './quickinput';
import { basename, isAbsolute } from 'path';

enum QuickAccessKind {
	Files = 1,
	Commands,
	Symbols
}

export class QuickAccess {

	constructor(private code: Code, private editors: Editors, private quickInput: QuickInput) { }

	async openFileQuickAccessAndWait(searchValue: string, expectedFirstElementNameOrExpectedResultCount: string | number): Promise<void> {

		// make sure the file quick access is not "polluted"
		// with entries from the editor history when opening
		await this.runCommand('workbench.action.clearEditorHistoryWithoutConfirm');

		const PollingStrategy = {
			Stop: true,
			Continue: false
		};

		let retries = 0;
		let success = false;

		while (++retries < 10) {
			let retry = false;

			try {
				await this.openQuickAccessWithRetry(QuickAccessKind.Files, searchValue);
				await this.quickInput.waitForQuickInputElements(elementNames => {
					this.code.logger.log('QuickAccess: resulting elements: ', elementNames);

					// Quick access seems to be still running -> retry
					if (elementNames.length === 0) {
						this.code.logger.log('QuickAccess: file search returned 0 elements, will continue polling...');

						return PollingStrategy.Continue;
					}

					// Quick access does not seem healthy/ready -> retry
					const firstElementName = elementNames[0];
					if (firstElementName === 'No matching results') {
						this.code.logger.log(`QuickAccess: file search returned "No matching results", will retry...`);

						retry = true;

						return PollingStrategy.Stop;
					}

					// Expected: number of results
					if (typeof expectedFirstElementNameOrExpectedResultCount === 'number') {
						if (elementNames.length === expectedFirstElementNameOrExpectedResultCount) {
							success = true;

							return PollingStrategy.Stop;
						}

						this.code.logger.log(`QuickAccess: file search returned ${elementNames.length} results but was expecting ${expectedFirstElementNameOrExpectedResultCount}, will retry...`);

						retry = true;

						return PollingStrategy.Stop;
					}

					// Expected: string
					else {
						if (firstElementName === expectedFirstElementNameOrExpectedResultCount) {
							success = true;

							return PollingStrategy.Stop;
						}

						this.code.logger.log(`QuickAccess: file search returned ${firstElementName} as first result but was expecting ${expectedFirstElementNameOrExpectedResultCount}, will retry...`);

						retry = true;

						return PollingStrategy.Stop;
					}
				});
			} catch (error) {
				this.code.logger.log(`QuickAccess: file search waitForQuickInputElements threw an error ${error}, will retry...`);

				retry = true;
			}

			if (!retry) {
				break;
			}

			await this.quickInput.closeQuickInput();
		}

		if (!success) {
			if (typeof expectedFirstElementNameOrExpectedResultCount === 'string') {
				throw new Error(`Quick open file search was unable to find '${expectedFirstElementNameOrExpectedResultCount}' after 10 attempts, giving up.`);
			} else {
				throw new Error(`Quick open file search was unable to find ${expectedFirstElementNameOrExpectedResultCount} result items after 10 attempts, giving up.`);
			}
		}
	}

	async openFile(path: string): Promise<void> {
		if (!isAbsolute(path)) {
			// we require absolute paths to get a single
			// result back that is unique and avoid hitting
			// the search process to reduce chances of
			// search needing longer.
			throw new Error('QuickAccess.openFile requires an absolute path');
		}

		const fileName = basename(path);

		// quick access shows files with the basename of the path
		await this.openFileQuickAccessAndWait(path, basename(path));

		// open first element
		await this.quickInput.selectQuickInputElement(0);

		// wait for editor being focused
		await this.editors.waitForActiveTab(fileName);
		await this.editors.selectTab(fileName);
	}

	private async openQuickAccessWithRetry(kind: QuickAccessKind, value?: string): Promise<void> {
		let retries = 0;

		// Other parts of code might steal focus away from quickinput :(
		while (retries < 5) {

			try {
				// Await for quick input widget opened
				const accept = () => this.quickInput.waitForQuickInputOpened(10);
				// Open via keybinding
				switch (kind) {
					case QuickAccessKind.Files:
						await this.code.dispatchKeybinding(process.platform === 'darwin' ? 'cmd+p' : 'ctrl+p', accept);
						break;
					case QuickAccessKind.Symbols:
						await this.code.dispatchKeybinding(process.platform === 'darwin' ? 'cmd+shift+o' : 'ctrl+shift+o', accept);
						break;
					case QuickAccessKind.Commands:
						await this.code.dispatchKeybinding(process.platform === 'darwin' ? 'cmd+shift+p' : 'ctrl+shift+p', async () => {

							await this.code.wait(100);
							await this.quickInput.waitForQuickInputOpened(10);
						});
						break;
				}
				break;
			} catch (err) {
				if (++retries > 5) {
					throw new Error(`QuickAccess.openQuickAccessWithRetry(kind: ${kind}) failed: ${err}`);
				}

				// Retry
				await this.code.dispatchKeybinding('escape', async () => { });
			}
		}

		// Type value if any
		if (value) {
			await this.quickInput.type(value);
		}
	}

	async runCommand(commandId: string, options?: { keepOpen?: boolean; exactLabelMatch?: boolean }): Promise<void> {
		const keepOpen = options?.keepOpen;
		const exactLabelMatch = options?.exactLabelMatch;

		const openCommandPalletteAndTypeCommand = async (): Promise<boolean> => {
			// open commands picker
			await this.openQuickAccessWithRetry(QuickAccessKind.Commands, `>${commandId}`);

			// wait for best choice to be focused
			await this.quickInput.waitForQuickInputElementFocused();

			// Retry for as long as the command not found
			const text = await this.quickInput.waitForQuickInputElementText();

			if (text === 'No matching commands' || (exactLabelMatch && text !== commandId)) {
				return false;
			}

			return true;
		};

		let hasCommandFound = await openCommandPalletteAndTypeCommand();

		if (!hasCommandFound) {

			this.code.logger.log(`QuickAccess: No matching commands, will retry...`);
			await this.quickInput.closeQuickInput();

			let retries = 0;
			while (++retries < 5) {
				hasCommandFound = await openCommandPalletteAndTypeCommand();
				if (hasCommandFound) {
					break;
				} else {
					this.code.logger.log(`QuickAccess: No matching commands, will retry...`);
					await this.quickInput.closeQuickInput();
					await this.code.wait(1000);
				}
			}

			if (!hasCommandFound) {
				throw new Error(`QuickAccess.runCommand(commandId: ${commandId}) failed to find command.`);
			}
		}

		// wait and click on best choice
		await this.quickInput.selectQuickInputElement(0, keepOpen);
	}

	async openQuickOutline(): Promise<void> {
		let retries = 0;

		while (++retries < 10) {

			// open quick outline via keybinding
			await this.openQuickAccessWithRetry(QuickAccessKind.Symbols);

			const text = await this.quickInput.waitForQuickInputElementText();

			// Retry for as long as no symbols are found
			if (text === 'No symbol information for the file') {
				this.code.logger.log(`QuickAccess: openQuickOutline indicated 'No symbol information for the file', will retry...`);

				// close and retry
				await this.quickInput.closeQuickInput();

				continue;
			}
		}
	}

	async getVisibleCommandNames(searchValue: string): Promise<string[]> {

		// open commands picker
		await this.openQuickAccessWithRetry(QuickAccessKind.Commands, `>${searchValue}`);

		// wait for quick input elements to be available
		let commandNames: string[] = [];
		await this.quickInput.waitForQuickInputElements(elementNames => {
			commandNames = elementNames;
			return true;
		});

		// close the quick input
		await this.quickInput.closeQuickInput();

		return commandNames;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/quickinput.ts]---
Location: vscode-main/test/automation/src/quickinput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Code } from './code';

export class QuickInput {

	private static QUICK_INPUT = '.quick-input-widget';
	private static QUICK_INPUT_INPUT = `${QuickInput.QUICK_INPUT} .quick-input-box input`;
	private static QUICK_INPUT_ROW = `${QuickInput.QUICK_INPUT} .quick-input-list .monaco-list-row`;
	private static QUICK_INPUT_FOCUSED_ELEMENT = `${QuickInput.QUICK_INPUT_ROW}.focused .monaco-highlighted-label`;
	// Note: this only grabs the label and not the description or detail
	private static QUICK_INPUT_ENTRY_LABEL = `${QuickInput.QUICK_INPUT_ROW} .quick-input-list-row > .monaco-icon-label .label-name`;
	private static QUICK_INPUT_ENTRY_LABEL_SPAN = `${QuickInput.QUICK_INPUT_ROW} .monaco-highlighted-label`;

	constructor(private code: Code) { }

	async waitForQuickInputOpened(retryCount?: number): Promise<void> {
		await this.code.waitForActiveElement(QuickInput.QUICK_INPUT_INPUT, retryCount);
	}

	async type(value: string): Promise<void> {
		await this.code.waitForSetValue(QuickInput.QUICK_INPUT_INPUT, value);
	}

	async waitForQuickInputElementFocused(): Promise<void> {
		await this.code.waitForTextContent(QuickInput.QUICK_INPUT_FOCUSED_ELEMENT);
	}

	async waitForQuickInputElementText(): Promise<string> {
		return this.code.waitForTextContent(QuickInput.QUICK_INPUT_ENTRY_LABEL_SPAN);
	}

	async closeQuickInput(): Promise<void> {
		await this.code.dispatchKeybinding('escape', () => this.waitForQuickInputClosed());
	}

	async waitForQuickInputElements(accept: (names: string[]) => boolean): Promise<void> {
		await this.code.waitForElements(QuickInput.QUICK_INPUT_ENTRY_LABEL, false, els => accept(els.map(e => e.textContent)));
	}

	async waitForQuickInputClosed(): Promise<void> {
		await this.code.waitForElement(QuickInput.QUICK_INPUT, r => !!r && r.attributes.style.indexOf('display: none;') !== -1);
	}

	async selectQuickInputElement(index: number, keepOpen?: boolean): Promise<void> {
		await this.waitForQuickInputOpened();
		for (let from = 0; from < index; from++) {
			await this.code.dispatchKeybinding('down', async () => { });
		}
		await this.code.dispatchKeybinding('enter', async () => {
			if (!keepOpen) {
				await this.waitForQuickInputClosed();
			}
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/scm.ts]---
Location: vscode-main/test/automation/src/scm.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Viewlet } from './viewlet';
import { IElement } from './driver';
import { findElement, findElements, Code } from './code';

const VIEWLET = 'div[id="workbench.view.scm"]';
const SCM_INPUT_NATIVE_EDIT_CONTEXT = `${VIEWLET} .scm-editor .native-edit-context`;
const SCM_INPUT_TEXTAREA = `${VIEWLET} .scm-editor textarea`;
const SCM_RESOURCE = `${VIEWLET} .monaco-list-row .resource`;
const REFRESH_COMMAND = `div[id="workbench.parts.sidebar"] .actions-container a.action-label[aria-label="Refresh"]`;
const COMMIT_COMMAND = `div[id="workbench.parts.sidebar"] .actions-container a.action-label[aria-label="Commit"]`;
const SCM_RESOURCE_CLICK = (name: string) => `${SCM_RESOURCE} .monaco-icon-label[aria-label*="${name}"] .label-name`;
const SCM_RESOURCE_ACTION_CLICK = (name: string, actionName: string) => `${SCM_RESOURCE} .monaco-icon-label[aria-label*="${name}"] .actions .action-label[aria-label="${actionName}"]`;

interface Change {
	name: string;
	type: string;
	actions: string[];
}

function toChange(element: IElement): Change {
	const name = findElement(element, e => /\blabel-name\b/.test(e.className))!;
	const type = element.attributes['data-tooltip'] || '';

	const actionElementList = findElements(element, e => /\baction-label\b/.test(e.className));
	const actions = actionElementList.map(e => e.attributes['title']);

	return {
		name: name.textContent || '',
		type,
		actions
	};
}


export class SCM extends Viewlet {

	constructor(code: Code) {
		super(code);
	}

	async openSCMViewlet(): Promise<any> {
		await this.code.dispatchKeybinding('ctrl+shift+g', async () => { await this.code.waitForElement(this._editContextSelector()); });
	}

	async waitForChange(name: string, type?: string): Promise<void> {
		const func = (change: Change) => change.name === name && (!type || change.type === type);
		await this.code.waitForElements(SCM_RESOURCE, true, elements => elements.some(e => func(toChange(e))));
	}

	async refreshSCMViewlet(): Promise<any> {
		await this.code.waitAndClick(REFRESH_COMMAND);
	}

	async openChange(name: string): Promise<void> {
		await this.code.waitAndClick(SCM_RESOURCE_CLICK(name));
	}

	async stage(name: string): Promise<void> {
		await this.code.waitAndClick(SCM_RESOURCE_ACTION_CLICK(name, 'Stage Changes'));
		await this.waitForChange(name, 'Index Modified');
	}

	async unstage(name: string): Promise<void> {
		await this.code.waitAndClick(SCM_RESOURCE_ACTION_CLICK(name, 'Unstage Changes'));
		await this.waitForChange(name, 'Modified');
	}

	async commit(message: string): Promise<void> {
		await this.code.waitAndClick(this._editContextSelector());
		await this.code.waitForActiveElement(this._editContextSelector());
		await this.code.waitForSetValue(this._editContextSelector(), message);
		await this.code.waitAndClick(COMMIT_COMMAND);
	}

	private _editContextSelector(): string {
		return !this.code.editContextEnabled ? SCM_INPUT_TEXTAREA : SCM_INPUT_NATIVE_EDIT_CONTEXT;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/search.ts]---
Location: vscode-main/test/automation/src/search.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Viewlet } from './viewlet';
import { Code } from './code';

const VIEWLET = '.search-view';
const INPUT = `${VIEWLET} .search-widget .search-container .monaco-inputbox textarea`;
const INCLUDE_INPUT = `${VIEWLET} .query-details .file-types.includes .monaco-inputbox input`;
const FILE_MATCH = (filename: string) => `${VIEWLET} .results .filematch[data-resource$="${filename}"]`;

async function retry(setup: () => Promise<any>, attempt: () => Promise<any>) {
	let count = 0;
	while (true) {
		await setup();

		try {
			await attempt();
			return;
		} catch (err) {
			if (++count > 5) {
				throw err;
			}
		}
	}
}

export class Search extends Viewlet {

	constructor(code: Code) {
		super(code);
	}

	async clearSearchResults(): Promise<void> {
		await retry(
			() => this.code.waitAndClick(`.sidebar .title-actions .codicon-search-clear-results`),
			() => this.waitForNoResultText(10));
	}

	async openSearchViewlet(): Promise<any> {
		const accept = () => this.waitForInputFocus(INPUT);
		if (process.platform === 'darwin') {
			await this.code.dispatchKeybinding('cmd+shift+f', accept);
		} else {
			await this.code.dispatchKeybinding('ctrl+shift+f', accept);
		}
	}

	async getSearchTooltip(): Promise<any> {
		const icon = await this.code.waitForElement(`.activitybar .action-label.codicon.codicon-search-view-icon`, (el) => !!el?.attributes?.['title']);
		return icon.attributes['title'];
	}

	async searchFor(text: string): Promise<void> {
		await this.clearSearchResults();
		await this.waitForInputFocus(INPUT);
		await this.code.waitForSetValue(INPUT, text);
		await this.submitSearch();
	}

	async hasActivityBarMoved() {
		await this.code.waitForElement('.activitybar');

		const elementBoundingBox = await this.code.driver.getElementXY('.activitybar');
		return elementBoundingBox !== null && elementBoundingBox.x === 48 && elementBoundingBox.y === 375;
	}

	async waitForPageUp(): Promise<void> {
		await this.code.dispatchKeybinding('PageUp', async () => { });
	}

	async waitForPageDown(): Promise<void> {
		await this.code.dispatchKeybinding('PageDown', async () => { });
	}

	async submitSearch(): Promise<void> {
		await this.waitForInputFocus(INPUT);
		await this.code.dispatchKeybinding('enter', async () => { await this.code.waitForElement(`${VIEWLET} .messages`); });
	}

	async setFilesToIncludeText(text: string): Promise<void> {
		await this.waitForInputFocus(INCLUDE_INPUT);
		await this.code.waitForSetValue(INCLUDE_INPUT, text || '');
	}

	async showQueryDetails(): Promise<void> {
		await this.code.waitAndClick(`${VIEWLET} .query-details .more`);
	}

	async hideQueryDetails(): Promise<void> {
		await this.code.waitAndClick(`${VIEWLET} .query-details.more .more`);
	}

	async removeFileMatch(filename: string, expectedText: string): Promise<void> {
		const fileMatch = FILE_MATCH(filename);

		// Retry this because the click can fail if the search tree is rerendered at the same time
		await retry(
			async () => {
				await this.code.waitAndClick(fileMatch);
				await this.code.waitAndClick(`${fileMatch} .action-label.codicon-search-remove`);
			},
			async () => this.waitForResultText(expectedText, 10));
	}

	async expandReplace(): Promise<void> {
		await this.code.waitAndClick(`${VIEWLET} .search-widget .monaco-button.toggle-replace-button.codicon-search-hide-replace`);
	}

	async collapseReplace(): Promise<void> {
		await this.code.waitAndClick(`${VIEWLET} .search-widget .monaco-button.toggle-replace-button.codicon-search-show-replace`);
	}

	async setReplaceText(text: string): Promise<void> {
		await this.code.waitForSetValue(`${VIEWLET} .search-widget .replace-container .monaco-inputbox textarea[aria-label="Replace"]`, text);
	}

	async replaceFileMatch(filename: string, expectedText: string): Promise<void> {
		const fileMatch = FILE_MATCH(filename);

		// Retry this because the click can fail if the search tree is rerendered at the same time
		await retry(
			async () => {
				await this.code.waitAndClick(fileMatch);
				await this.code.waitAndClick(`${fileMatch} .action-label.codicon.codicon-search-replace-all`);
			},
			() => this.waitForResultText(expectedText, 10));
	}

	async waitForResultText(text: string, retryCount?: number): Promise<void> {
		// The label can end with " - " depending on whether the search editor is enabled
		await this.code.waitForTextContent(`${VIEWLET} .messages .message`, undefined, result => result.startsWith(text), retryCount);
	}

	async waitForNoResultText(retryCount?: number): Promise<void> {
		await this.code.waitForTextContent(`${VIEWLET} .messages`, undefined, text => text === '' || text.startsWith('Search was canceled before any results could be found'), retryCount);
	}

	private async waitForInputFocus(selector: string): Promise<void> {
		let retries = 0;

		// other parts of code might steal focus away from input boxes :(
		while (retries < 5) {
			await this.code.waitAndClick(INPUT, 2, 2);

			try {
				await this.code.waitForActiveElement(INPUT, 10);
				break;
			} catch (err) {
				if (++retries > 5) {
					throw err;
				}
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/settings.ts]---
Location: vscode-main/test/automation/src/settings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Editor } from './editor';
import { Editors } from './editors';
import { Code } from './code';
import { QuickAccess } from './quickaccess';

const SEARCH_BOX_NATIVE_EDIT_CONTEXT = '.settings-editor .suggest-input-container .monaco-editor .native-edit-context';
const SEARCH_BOX_TEXTAREA = '.settings-editor .suggest-input-container .monaco-editor textarea';

export class SettingsEditor {
	constructor(private code: Code, private editors: Editors, private editor: Editor, private quickaccess: QuickAccess) { }

	/**
	 * Write a single setting key value pair.
	 *
	 * Warning: You may need to set `editor.wordWrap` to `"on"` if this is called with a really long
	 * setting.
	 */
	async addUserSetting(setting: string, value: string): Promise<void> {
		await this.openUserSettingsFile();

		await this.editors.selectTab('settings.json');
		await this.code.dispatchKeybinding('right', () =>
			this.editor.waitForEditorSelection('settings.json', (s) => this._acceptEditorSelection(this.code.editContextEnabled, s)));
		await this.editor.waitForTypeInEditor('settings.json', `"${setting}": ${value},`);
		await this.editors.saveOpenedFile();
	}

	/**
	 * Write several settings faster than multiple calls to {@link addUserSetting}.
	 *
	 * Warning: You will likely also need to set `editor.wordWrap` to `"on"` if `addUserSetting` is
	 * called after this in the test.
	 */
	async addUserSettings(settings: [key: string, value: string][]): Promise<void> {
		await this.openUserSettingsFile();

		await this.editors.selectTab('settings.json');
		await this.code.dispatchKeybinding('right', () =>
			this.editor.waitForEditorSelection('settings.json', (s) => this._acceptEditorSelection(this.code.editContextEnabled, s)));
		await this.editor.waitForTypeInEditor('settings.json', settings.map(v => `"${v[0]}": ${v[1]},`).join(''));
		await this.editors.saveOpenedFile();
	}

	async clearUserSettings(): Promise<void> {
		await this.openUserSettingsFile();
		await this.quickaccess.runCommand('editor.action.selectAll');
		await this.code.dispatchKeybinding('Delete', async () => {
			await this.editor.waitForEditorContents('settings.json', contents => contents === '');
		});
		await this.editor.waitForTypeInEditor('settings.json', `{`); // will auto close }
		await this.editors.saveOpenedFile();
		await this.quickaccess.runCommand('workbench.action.closeActiveEditor');
	}

	async openUserSettingsFile(): Promise<void> {
		await this.quickaccess.runCommand('workbench.action.openSettingsJson');
		await this.editor.waitForEditorFocus('settings.json', 1);
	}

	async openUserSettingsUI(): Promise<void> {
		await this.quickaccess.runCommand('workbench.action.openSettings2');
		await this.code.waitForActiveElement(this._editContextSelector());
	}

	async searchSettingsUI(query: string): Promise<void> {
		await this.openUserSettingsUI();

		await this.code.waitAndClick(this._editContextSelector());
		await this.code.dispatchKeybinding(process.platform === 'darwin' ? 'cmd+a' : 'ctrl+a', async () => { });
		await this.code.dispatchKeybinding('Delete', async () => {
			await this.code.waitForElements('.settings-editor .settings-count-widget', false, results => !results || (results?.length === 1 && !results[0].textContent));
		});
		await this.code.waitForTypeInEditor(this._editContextSelector(), query);
		await this.code.waitForElements('.settings-editor .settings-count-widget', false, results => results?.length === 1 && results[0].textContent.includes('Found'));
	}

	private _editContextSelector() {
		return !this.code.editContextEnabled ? SEARCH_BOX_TEXTAREA : SEARCH_BOX_NATIVE_EDIT_CONTEXT;
	}

	private _acceptEditorSelection(editContextEnabled: boolean, s: { selectionStart: number; selectionEnd: number }): boolean {
		if (!editContextEnabled) {
			return true;
		}
		return s.selectionStart === 1 && s.selectionEnd === 1;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/statusbar.ts]---
Location: vscode-main/test/automation/src/statusbar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Code } from './code';

export const enum StatusBarElement {
	BRANCH_STATUS = 0,
	SYNC_STATUS = 1,
	PROBLEMS_STATUS = 2,
	SELECTION_STATUS = 3,
	INDENTATION_STATUS = 4,
	ENCODING_STATUS = 5,
	EOL_STATUS = 6,
	LANGUAGE_STATUS = 7
}

export class StatusBar {

	private readonly mainSelector = 'footer[id="workbench.parts.statusbar"]';

	constructor(private code: Code) { }

	async waitForStatusbarElement(element: StatusBarElement): Promise<void> {
		await this.code.waitForElement(this.getSelector(element));
	}

	async clickOn(element: StatusBarElement): Promise<void> {
		await this.code.waitAndClick(this.getSelector(element));
	}

	async waitForEOL(eol: string): Promise<string> {
		return this.code.waitForTextContent(this.getSelector(StatusBarElement.EOL_STATUS), eol);
	}

	async waitForStatusbarText(title: string, text: string): Promise<void> {
		await this.code.waitForTextContent(`${this.mainSelector} .statusbar-item[aria-label="${title}"]`, text);
	}

	private getSelector(element: StatusBarElement): string {
		switch (element) {
			case StatusBarElement.BRANCH_STATUS:
				return `.statusbar-item[id="status.scm.0"] .codicon`;
			case StatusBarElement.SYNC_STATUS:
				return `.statusbar-item[id="status.scm.1"] .codicon.codicon-sync`;
			case StatusBarElement.PROBLEMS_STATUS:
				return `.statusbar-item[id="status.problems"]`;
			case StatusBarElement.SELECTION_STATUS:
				return `.statusbar-item[id="status.editor.selection"]`;
			case StatusBarElement.INDENTATION_STATUS:
				return `.statusbar-item[id="status.editor.indentation"]`;
			case StatusBarElement.ENCODING_STATUS:
				return `.statusbar-item[id="status.editor.encoding"]`;
			case StatusBarElement.EOL_STATUS:
				return `.statusbar-item[id="status.editor.eol"]`;
			case StatusBarElement.LANGUAGE_STATUS:
				return `.statusbar-item[id="status.editor.mode"]`;
			default:
				throw new Error(element);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/task.ts]---
Location: vscode-main/test/automation/src/task.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Editor } from './editor';
import { Code } from './code';
import { QuickAccess } from './quickaccess';
import { Editors } from './editors';
import { QuickInput } from './quickinput';
import { Terminal } from './terminal';
import { wait } from './playwrightDriver';

interface ITaskConfigurationProperties {
	label?: string;
	type?: string;
	command?: string;
	identifier?: string;
	group?: string;
	isBackground?: boolean;
	promptOnClose?: boolean;
	icon?: { id?: string; color?: string };
	hide?: boolean;
}

export enum TaskCommandId {
	TerminalRename = 'workbench.action.terminal.rename'
}

export class Task {

	constructor(private code: Code, private editor: Editor, private editors: Editors, private quickaccess: QuickAccess, private quickinput: QuickInput, private terminal: Terminal) {

	}

	async assertTasks(filter: string, expected: ITaskConfigurationProperties[], type: 'run' | 'configure') {
		// TODO https://github.com/microsoft/vscode/issues/242535
		// Artificial delay before running non hidden tasks
		// so that entries from configureTask show up in the quick access.
		await wait(1000);
		type === 'run' ? await this.quickaccess.runCommand('workbench.action.tasks.runTask', { keepOpen: true }) : await this.quickaccess.runCommand('workbench.action.tasks.configureTask', { keepOpen: true });
		if (expected.length === 0) {
			await this.quickinput.waitForQuickInputElements(e => e.length > 1 && e.every(label => label.trim() !== filter.trim()));
		}
		if (expected.length > 0 && !expected[0].hide) {
			await this.quickinput.waitForQuickInputElements(e => e.length > 1 && e.some(label => label.trim() === filter.trim()));
			// select the expected task
			await this.quickinput.selectQuickInputElement(0, true);
			// Continue without scanning the output
			await this.quickinput.selectQuickInputElement(0);
			if (expected[0].icon) {
				await this.terminal.assertSingleTab({ color: expected[0].icon.color, icon: expected[0].icon.id || 'tools' });
			}
		}
		await this.quickinput.closeQuickInput();
	}

	async configureTask(properties: ITaskConfigurationProperties) {
		await this.quickaccess.openFileQuickAccessAndWait('tasks.json', 'tasks.json');
		await this.quickinput.selectQuickInputElement(0);
		await this.quickaccess.runCommand('editor.action.selectAll');
		await this.code.dispatchKeybinding('Delete', async () => {
			// TODO https://github.com/microsoft/vscode/issues/242535
			await wait(100);
		});
		const taskStringLines: string[] = [
			'{', // Brackets auto close
			'"version": "2.0.0",',
			'"tasks": [{' // Brackets auto close
		];
		for (let [key, value] of Object.entries(properties)) {
			if (typeof value === 'object') {
				value = JSON.stringify(value);
			} else if (typeof value === 'boolean') {
				value = value;
			} else if (typeof value === 'string') {
				value = `"${value}"`;
			} else {
				throw new Error('Unsupported task property value type');
			}
			taskStringLines.push(`"${key}": ${value},`);
		}
		for (const [i, line] of taskStringLines.entries()) {
			await this.editor.waitForTypeInEditor('tasks.json', `${line}`);
			if (i !== taskStringLines.length - 1) {
				await this.code.dispatchKeybinding('Enter', async () => {
					// TODO https://github.com/microsoft/vscode/issues/242535
					await wait(100);
				});
			}
		}
		await this.editors.saveOpenedFile();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/terminal.ts]---
Location: vscode-main/test/automation/src/terminal.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { QuickInput } from './quickinput';
import { Code } from './code';
import { QuickAccess } from './quickaccess';
import { IElement } from './driver';
import { wait } from './playwrightDriver';

export enum Selector {
	TerminalView = `#terminal`,
	CommandDecorationPlaceholder = `.terminal-command-decoration.codicon-terminal-decoration-incomplete`,
	CommandDecorationSuccess = `.terminal-command-decoration.codicon-terminal-decoration-success`,
	CommandDecorationError = `.terminal-command-decoration.codicon-terminal-decoration-error`,
	Xterm = `#terminal .terminal-wrapper`,
	XtermEditor = `.editor-instance .terminal-wrapper`,
	TabsEntry = '.terminal-tabs-entry',
	Name = '.label-name',
	Description = '.label-description',
	XtermFocused = '.terminal.xterm.focus',
	PlusButton = '.codicon-plus',
	EditorGroups = '.editor .split-view-view',
	EditorTab = '.terminal-tab',
	SingleTab = '.single-terminal-tab',
	Tabs = '.tabs-list .monaco-list-row',
	SplitButton = '.editor .codicon-split-horizontal',
	XtermSplitIndex0 = '#terminal .terminal-groups-container .split-view-view:nth-child(1) .terminal-wrapper',
	XtermSplitIndex1 = '#terminal .terminal-groups-container .split-view-view:nth-child(2) .terminal-wrapper',
	Hide = '.hide'
}

/**
 * Terminal commands that accept a value in a quick input.
 */
export enum TerminalCommandIdWithValue {
	Rename = 'workbench.action.terminal.rename',
	ChangeColor = 'workbench.action.terminal.changeColor',
	ChangeIcon = 'workbench.action.terminal.changeIcon',
	NewWithProfile = 'workbench.action.terminal.newWithProfile',
	SelectDefaultProfile = 'workbench.action.terminal.selectDefaultShell',
	AttachToSession = 'workbench.action.terminal.attachToSession',
	WriteDataToTerminal = 'workbench.action.terminal.writeDataToTerminal'
}

/**
 * Terminal commands that do not present a quick input.
 */
export enum TerminalCommandId {
	Split = 'workbench.action.terminal.split',
	KillAll = 'workbench.action.terminal.killAll',
	Unsplit = 'workbench.action.terminal.unsplit',
	Join = 'workbench.action.terminal.join',
	Show = 'workbench.action.terminal.toggleTerminal',
	CreateNewEditor = 'workbench.action.createTerminalEditor',
	SplitEditor = 'workbench.action.createTerminalEditorSide',
	MoveToPanel = 'workbench.action.terminal.moveToTerminalPanel',
	MoveToEditor = 'workbench.action.terminal.moveToEditor',
	NewWithProfile = 'workbench.action.terminal.newWithProfile',
	SelectDefaultProfile = 'workbench.action.terminal.selectDefaultShell',
	DetachSession = 'workbench.action.terminal.detachSession',
	CreateNew = 'workbench.action.terminal.new'
}
interface TerminalLabel {
	name?: string;
	description?: string;
	icon?: string;
	color?: string;
}
type TerminalGroup = TerminalLabel[];

interface ICommandDecorationCounts {
	placeholder: number;
	success: number;
	error: number;
}

export class Terminal {

	constructor(private code: Code, private quickaccess: QuickAccess, private quickinput: QuickInput) { }

	async runCommand(commandId: TerminalCommandId, expectedLocation?: 'editor' | 'panel'): Promise<void> {
		const keepOpen = commandId === TerminalCommandId.Join;
		await this.quickaccess.runCommand(commandId, { keepOpen });
		if (keepOpen) {
			await this.code.dispatchKeybinding('enter', async () => {
				await this.quickinput.waitForQuickInputClosed();
			});
		}
		switch (commandId) {
			case TerminalCommandId.Show:
			case TerminalCommandId.CreateNewEditor:
			case TerminalCommandId.CreateNew:
			case TerminalCommandId.NewWithProfile:
				await this._waitForTerminal(expectedLocation === 'editor' || commandId === TerminalCommandId.CreateNewEditor ? 'editor' : 'panel');
				break;
			case TerminalCommandId.KillAll:
				// HACK: Attempt to kill all terminals to clean things up, this is known to be flaky
				// but the reason why isn't known. This is typically called in the after each hook,
				// Since it's not actually required that all terminals are killed just continue on
				// after 2 seconds.
				await Promise.race([
					this.code.waitForElements(Selector.Xterm, true, e => e.length === 0),
					this.code.wait(2000)
				]);
				break;
		}
	}

	async runCommandWithValue(commandId: TerminalCommandIdWithValue, value?: string, altKey?: boolean): Promise<void> {
		const keepOpen = !!value || commandId === TerminalCommandIdWithValue.NewWithProfile || commandId === TerminalCommandIdWithValue.Rename || (commandId === TerminalCommandIdWithValue.SelectDefaultProfile && value !== 'PowerShell');
		await this.quickaccess.runCommand(commandId, { keepOpen });
		// Running the command should hide the quick input in the following frame, this next wait
		// ensures that the quick input is opened again before proceeding to avoid a race condition
		// where the enter keybinding below would close the quick input if it's triggered before the
		// new quick input shows.
		await this.quickinput.waitForQuickInputOpened();
		if (value) {
			await this.quickinput.type(value);
		} else if (commandId === TerminalCommandIdWithValue.Rename) {
			// Reset
			await this.code.dispatchKeybinding('Backspace', async () => {
				// TODO https://github.com/microsoft/vscode/issues/242535
				await wait(100);
			});
		}
		await this.code.wait(100);
		await this.code.dispatchKeybinding(altKey ? 'Alt+Enter' : 'enter', async () => {
			// TODO https://github.com/microsoft/vscode/issues/242535
			await wait(100);
		});
		await this.quickinput.waitForQuickInputClosed();
		if (commandId === TerminalCommandIdWithValue.NewWithProfile) {
			await this._waitForTerminal();
		}
	}

	async runCommandInTerminal(commandText: string, skipEnter?: boolean): Promise<void> {
		await this.code.writeInTerminal(Selector.Xterm, commandText);
		if (!skipEnter) {
			await this.code.dispatchKeybinding('enter', async () => {
				// TODO https://github.com/microsoft/vscode/issues/242535
				await wait(100);
			});
		}
	}

	/**
	 * Creates a terminal using the new terminal command.
	 * @param expectedLocation The location to check the terminal for, defaults to panel.
	 */
	async createTerminal(expectedLocation?: 'editor' | 'panel'): Promise<void> {
		await this.runCommand(TerminalCommandId.CreateNew, expectedLocation);
		await this._waitForTerminal(expectedLocation);
	}

	/**
	 * Creates an empty terminal by opening a regular terminal and resetting its state such that it
	 * essentially acts like an Pseudoterminal extension API-based terminal. This can then be paired
	 * with `TerminalCommandIdWithValue.WriteDataToTerminal` to make more reliable tests.
	 */
	async createEmptyTerminal(expectedLocation?: 'editor' | 'panel'): Promise<void> {
		await this.createTerminal(expectedLocation);

		// Run a command to ensure the shell has started, this is used to ensure the shell's data
		// does not leak into the "empty terminal"
		await this.runCommandInTerminal('echo "initialized"');
		await this.waitForTerminalText(buffer => buffer.some(line => line.startsWith('initialized')));

		// Erase all content and reset cursor to top
		await this.runCommandWithValue(TerminalCommandIdWithValue.WriteDataToTerminal, `${csi('2J')}${csi('H')}`);

		// Force windows pty mode off; assume all sequences are rendered in correct position
		if (process.platform === 'win32') {
			await this.runCommandWithValue(TerminalCommandIdWithValue.WriteDataToTerminal, `${vsc('P;IsWindows=False')}`);
		}
	}

	async assertEditorGroupCount(count: number): Promise<void> {
		await this.code.waitForElements(Selector.EditorGroups, true, editorGroups => editorGroups && editorGroups.length === count);
	}

	async assertSingleTab(label: TerminalLabel, editor?: boolean): Promise<void> {
		let regex = undefined;
		if (label.name && label.description) {
			regex = new RegExp(label.name + ' - ' + label.description);
		} else if (label.name) {
			regex = new RegExp(label.name);
		}
		await this.assertTabExpected(editor ? Selector.EditorTab : Selector.SingleTab, undefined, regex, label.icon, label.color);
	}

	async assertTerminalGroups(expectedGroups: TerminalGroup[]): Promise<void> {
		let expectedCount = 0;
		expectedGroups.forEach(g => expectedCount += g.length);
		let index = 0;
		while (index < expectedCount) {
			for (let groupIndex = 0; groupIndex < expectedGroups.length; groupIndex++) {
				const terminalsInGroup = expectedGroups[groupIndex].length;
				let indexInGroup = 0;
				const isSplit = terminalsInGroup > 1;
				while (indexInGroup < terminalsInGroup) {
					const instance = expectedGroups[groupIndex][indexInGroup];
					const nameRegex = instance.name && isSplit ? new RegExp('\\s*[├┌└]\\s*' + instance.name) : instance.name ? new RegExp(/^\s*/ + instance.name) : undefined;
					await this.assertTabExpected(undefined, index, nameRegex, instance.icon, instance.color, instance.description);
					indexInGroup++;
					index++;
				}
			}
		}
	}

	async getTerminalGroups(): Promise<TerminalGroup[]> {
		const tabCount = (await this.code.waitForElements(Selector.Tabs, true)).length;
		const groups: TerminalGroup[] = [];
		for (let i = 0; i < tabCount; i++) {
			const title = await this.code.waitForElement(`${Selector.Tabs}[data-index="${i}"] ${Selector.TabsEntry} ${Selector.Name}`, e => e?.textContent?.length ? e?.textContent?.length > 1 : false);
			const description: IElement | undefined = await this.code.waitForElement(`${Selector.Tabs}[data-index="${i}"] ${Selector.TabsEntry} ${Selector.Description}`, () => true);

			const label: TerminalLabel = {
				name: title.textContent.replace(/^[├┌└]\s*/, ''),
				description: description?.textContent
			};
			// It's a new group if the tab does not start with ├ or └
			if (title.textContent.match(/^[├└]/)) {
				groups[groups.length - 1].push(label);
			} else {
				groups.push([label]);
			}
		}
		return groups;
	}

	async getSingleTabName(): Promise<string> {
		const tab = await this.code.waitForElement(Selector.SingleTab, singleTab => !!singleTab && singleTab?.textContent.length > 1);
		return tab.textContent;
	}

	private async assertTabExpected(selector?: string, listIndex?: number, nameRegex?: RegExp, icon?: string, color?: string, description?: string): Promise<void> {
		if (listIndex) {
			if (nameRegex) {
				await this.code.waitForElement(`${Selector.Tabs}[data-index="${listIndex}"] ${Selector.TabsEntry} ${Selector.Name}`, entry => !!entry && !!entry?.textContent.match(nameRegex));
				if (description) {
					await this.code.waitForElement(`${Selector.Tabs}[data-index="${listIndex}"] ${Selector.TabsEntry} ${Selector.Description}`, e => !!e && e.textContent === description);
				}
			}
			if (color) {
				await this.code.waitForElement(`${Selector.Tabs}[data-index="${listIndex}"] ${Selector.TabsEntry} .monaco-icon-label.terminal-icon-terminal_ansi${color}`);
			}
			if (icon) {
				await this.code.waitForElement(`${Selector.Tabs}[data-index="${listIndex}"] ${Selector.TabsEntry} .codicon-${icon}`);
			}
		} else if (selector) {
			if (nameRegex) {
				await this.code.waitForElement(`${selector}`, singleTab => !!singleTab && !!singleTab?.textContent.match(nameRegex));
			}
			if (color) {
				await this.code.waitForElement(`${selector}`, singleTab => !!singleTab && !!singleTab.className.includes(`terminal-icon-terminal_ansi${color}`));
			}
			if (icon) {
				selector = selector === Selector.EditorTab ? selector : `${selector} .codicon`;
				await this.code.waitForElement(`${selector}`, singleTab => !!singleTab && !!singleTab.className.includes(icon));
			}
		}
	}

	async assertTerminalViewHidden(): Promise<void> {
		await this.code.waitForElement(Selector.TerminalView, result => result === undefined);
	}

	async assertCommandDecorations(expectedCounts?: ICommandDecorationCounts, customIcon?: { updatedIcon: string; count: number }, showDecorations?: 'both' | 'gutter' | 'overviewRuler' | 'never'): Promise<void> {
		if (expectedCounts) {
			const placeholderSelector = showDecorations === 'overviewRuler' ? `${Selector.CommandDecorationPlaceholder}${Selector.Hide}` : Selector.CommandDecorationPlaceholder;
			await this.code.waitForElements(placeholderSelector, true, decorations => decorations && decorations.length === expectedCounts.placeholder);
			const successSelector = showDecorations === 'overviewRuler' ? `${Selector.CommandDecorationSuccess}${Selector.Hide}` : Selector.CommandDecorationSuccess;
			await this.code.waitForElements(successSelector, true, decorations => decorations && decorations.length === expectedCounts.success);
			const errorSelector = showDecorations === 'overviewRuler' ? `${Selector.CommandDecorationError}${Selector.Hide}` : Selector.CommandDecorationError;
			await this.code.waitForElements(errorSelector, true, decorations => decorations && decorations.length === expectedCounts.error);
		}

		if (customIcon) {
			await this.code.waitForElements(`.terminal-command-decoration.codicon-${customIcon.updatedIcon}`, true, decorations => decorations && decorations.length === customIcon.count);
		}
	}

	async clickPlusButton(): Promise<void> {
		await this.code.waitAndClick(Selector.PlusButton);
	}

	async clickSplitButton(): Promise<void> {
		await this.code.waitAndClick(Selector.SplitButton);
	}

	async clickSingleTab(): Promise<void> {
		await this.code.waitAndClick(Selector.SingleTab);
	}

	async waitForTerminalText(accept: (buffer: string[]) => boolean, message?: string, splitIndex?: 0 | 1): Promise<void> {
		try {
			let selector: string = Selector.Xterm;
			if (splitIndex !== undefined) {
				selector = splitIndex === 0 ? Selector.XtermSplitIndex0 : Selector.XtermSplitIndex1;
			}
			await this.code.waitForTerminalBuffer(selector, accept);
		} catch (err: any) {
			if (message) {
				throw new Error(`${message} \n\nInner exception: \n${err.message} `);
			}
			throw err;
		}
	}

	async getPage(): Promise<any> {
		// eslint-disable-next-line local/code-no-any-casts
		return (this.code.driver as any).page;
	}

	/**
	 * Waits for the terminal to be focused and to contain content.
	 * @param expectedLocation The location to check the terminal for, defaults to panel.
	 */
	private async _waitForTerminal(expectedLocation?: 'editor' | 'panel'): Promise<void> {
		await this.code.waitForElement(Selector.XtermFocused);
		await this.code.waitForTerminalBuffer(expectedLocation === 'editor' ? Selector.XtermEditor : Selector.Xterm, lines => lines.some(line => line.length > 0));
	}
}

function vsc(data: string) {
	return setTextParams(`633;${data}`);
}

function setTextParams(data: string) {
	return osc(`${data}\\x07`);
}

function osc(data: string) {
	return `\\x1b]${data}`;
}

function csi(data: string) {
	return `\\x1b[${data}`;
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/viewlet.ts]---
Location: vscode-main/test/automation/src/viewlet.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Code } from './code';

export abstract class Viewlet {

	constructor(protected code: Code) { }

	async waitForTitle(fn: (title: string) => boolean): Promise<void> {
		await this.code.waitForTextContent('.monaco-workbench .part.sidebar > .title > .title-label > h2', undefined, fn);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/automation/src/workbench.ts]---
Location: vscode-main/test/automation/src/workbench.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Explorer } from './explorer';
import { ActivityBar } from './activityBar';
import { QuickAccess } from './quickaccess';
import { QuickInput } from './quickinput';
import { Extensions } from './extensions';
import { Search } from './search';
import { Editor } from './editor';
import { SCM } from './scm';
import { Debug } from './debug';
import { StatusBar } from './statusbar';
import { Problems } from './problems';
import { SettingsEditor } from './settings';
import { KeybindingsEditor } from './keybindings';
import { Editors } from './editors';
import { Code } from './code';
import { Terminal } from './terminal';
import { Notebook } from './notebook';
import { Localization } from './localization';
import { Task } from './task';
import { Chat } from './chat';
import { Notification } from './notification';

export interface Commands {
	runCommand(command: string, options?: { exactLabelMatch?: boolean }): Promise<any>;
}

export class Workbench {

	readonly quickaccess: QuickAccess;
	readonly quickinput: QuickInput;
	readonly editors: Editors;
	readonly explorer: Explorer;
	readonly activitybar: ActivityBar;
	readonly search: Search;
	readonly extensions: Extensions;
	readonly editor: Editor;
	readonly scm: SCM;
	readonly debug: Debug;
	readonly statusbar: StatusBar;
	readonly problems: Problems;
	readonly settingsEditor: SettingsEditor;
	readonly keybindingsEditor: KeybindingsEditor;
	readonly terminal: Terminal;
	readonly notebook: Notebook;
	readonly localization: Localization;
	readonly task: Task;
	readonly chat: Chat;
	readonly notification: Notification;

	constructor(code: Code) {
		this.editors = new Editors(code);
		this.quickinput = new QuickInput(code);
		this.quickaccess = new QuickAccess(code, this.editors, this.quickinput);
		this.explorer = new Explorer(code);
		this.activitybar = new ActivityBar(code);
		this.search = new Search(code);
		this.extensions = new Extensions(code, this.quickaccess);
		this.editor = new Editor(code, this.quickaccess);
		this.scm = new SCM(code);
		this.debug = new Debug(code, this.quickaccess, this.editors, this.editor);
		this.statusbar = new StatusBar(code);
		this.problems = new Problems(code, this.quickaccess);
		this.settingsEditor = new SettingsEditor(code, this.editors, this.editor, this.quickaccess);
		this.keybindingsEditor = new KeybindingsEditor(code);
		this.terminal = new Terminal(code, this.quickaccess, this.quickinput);
		this.notebook = new Notebook(this.quickaccess, this.quickinput, code);
		this.localization = new Localization(code);
		this.task = new Task(code, this.editor, this.editors, this.quickaccess, this.quickinput, this.terminal);
		this.notification = new Notification(code);
		this.chat = new Chat(code, this.notification);
	}
}
```

--------------------------------------------------------------------------------

````
