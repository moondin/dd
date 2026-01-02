---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 54
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 54 of 552)

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

---[FILE: extensions/json-language-features/.npmrc]---
Location: vscode-main/extensions/json-language-features/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/.vscodeignore]---
Location: vscode-main/extensions/json-language-features/.vscodeignore

```text
.vscode/**
server/.vscode/**
server/node_modules/**
client/src/**
server/src/**
client/out/**
server/out/**
client/tsconfig.json
server/tsconfig.json
server/test/**
server/bin/**
server/build/**
server/package-lock.json
server/.npmignore
server/README.md
package-lock.json
CONTRIBUTING.md
server/extension.webpack.config.js
extension.webpack.config.js
server/extension-browser.webpack.config.js
extension-browser.webpack.config.js
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/CONTRIBUTING.md]---
Location: vscode-main/extensions/json-language-features/CONTRIBUTING.md

```markdown
## Setup

- Clone [microsoft/vscode](https://github.com/microsoft/vscode)
- Run `npm i` at `/`, this will install
	- Dependencies for `/extension/json-language-features/`
	- Dependencies for `/extension/json-language-features/server/`
	- devDependencies such as `gulp`
- Open `/extensions/json-language-features/` as the workspace in VS Code
- In `/extensions/json-language-features/` run `npm run compile`(or `npm run watch`) to build the client and server
- Run the [`Launch Extension`](https://github.com/microsoft/vscode/blob/master/extensions/json-language-features/.vscode/launch.json) debug target in the Debug View. This will:
	- Launch a new VS Code instance with the `json-language-features` extension loaded
- Open a `.json` file to activate the extension. The extension will start the JSON language server process.
- Add `"json.trace.server": "verbose"` to the settings to observe the communication between client and server in the `JSON Language Server` output.
- Debug the extension and the language server client by setting breakpoints in`json-language-features/client/`
- Debug the language server process by using `Attach to Node Process` command in the  VS Code window opened on `json-language-features`.
  - Pick the process that contains `jsonServerMain` in the command line. Hover over `code-insiders` resp `code` processes to see the full process command line.
  - Set breakpoints in `json-language-features/server/`
- Run `Reload Window` command in the launched instance to reload the extension


### Contribute to vscode-json-languageservice

[microsoft/vscode-json-languageservice](https://github.com/microsoft/vscode-json-languageservice) is the library that implements the language smarts for JSON.
The JSON language server forwards most the of requests to the service library.
If you want to fix JSON issues or make improvements, you should make changes at [microsoft/vscode-json-languageservice](https://github.com/microsoft/vscode-json-languageservice).

However, within this extension, you can run a development version of `vscode-json-languageservice` to debug code or test language features interactively:

#### Linking `vscode-json-languageservice` in `json-language-features/server/`

- Clone [microsoft/vscode-json-languageservice](https://github.com/microsoft/vscode-json-languageservice)
- Run `npm i` in `vscode-json-languageservice`
- Run `npm link` in `vscode-json-languageservice`. This will compile and link `vscode-json-languageservice`
- In `json-language-features/server/`, run `npm link vscode-json-languageservice`

#### Testing the development version of `vscode-json-languageservice`

- Open both `vscode-json-languageservice` and this extension in two windows or with a single window with the[multi-root workspace](https://code.visualstudio.com/docs/editor/multi-root-workspaces) feature.
- Run `npm run watch` at `json-languagefeatures/server/` to recompile this extension with the linked version of `vscode-json-languageservice`
- Make some changes in `vscode-json-languageservice`
- Now when you run `Launch Extension` debug target, the launched instance will use your development version of `vscode-json-languageservice`. You can interactively test the language features.
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/json-language-features/extension-browser.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import { browser as withBrowserDefaults } from '../shared.webpack.config.mjs';
import path from 'path';

export default withBrowserDefaults({
	target: 'webworker',
	context: path.join(import.meta.dirname, 'client'),
	entry: {
		extension: './src/browser/jsonClientMain.ts'
	},
	output: {
		filename: 'jsonClientMain.js',
		path: path.join(import.meta.dirname, 'client', 'dist', 'browser')
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/extension.webpack.config.js]---
Location: vscode-main/extensions/json-language-features/extension.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import withDefaults from '../shared.webpack.config.mjs';
import path from 'path';

const config = withDefaults({
	context: path.join(import.meta.dirname, 'client'),
	entry: {
		extension: './src/node/jsonClientMain.ts'
	},
	output: {
		filename: 'jsonClientMain.js',
		path: path.join(import.meta.dirname, 'client', 'dist', 'node')
	}
});


export default config;
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/package-lock.json]---
Location: vscode-main/extensions/json-language-features/package-lock.json

```json
{
  "name": "json-language-features",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "json-language-features",
      "version": "1.0.0",
      "license": "MIT",
      "dependencies": {
        "@vscode/extension-telemetry": "^0.9.8",
        "request-light": "^0.8.0",
        "vscode-languageclient": "^10.0.0-next.18"
      },
      "devDependencies": {
        "@types/node": "22.x"
      },
      "engines": {
        "vscode": "^1.77.0"
      }
    },
    "node_modules/@isaacs/balanced-match": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/@isaacs/balanced-match/-/balanced-match-4.0.1.tgz",
      "integrity": "sha512-yzMTt9lEb8Gv7zRioUilSglI0c0smZ9k5D65677DLWLtWJaXIS3CqcGyUFByYKlnUj6TkjLVs54fBl6+TiGQDQ==",
      "license": "MIT",
      "engines": {
        "node": "20 || >=22"
      }
    },
    "node_modules/@isaacs/brace-expansion": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/@isaacs/brace-expansion/-/brace-expansion-5.0.0.tgz",
      "integrity": "sha512-ZT55BDLV0yv0RBm2czMiZ+SqCGO7AvmOM3G/w2xhVPH+te0aKgFjmBvGlL1dH+ql2tgGO3MVrbb3jCKyvpgnxA==",
      "license": "MIT",
      "dependencies": {
        "@isaacs/balanced-match": "^4.0.1"
      },
      "engines": {
        "node": "20 || >=22"
      }
    },
    "node_modules/@microsoft/1ds-core-js": {
      "version": "4.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/1ds-core-js/-/1ds-core-js-4.3.4.tgz",
      "integrity": "sha512-3gbDUQgAO8EoyQTNcAEkxpuPnioC0May13P1l1l0NKZ128L9Ts/sj8QsfwCRTjHz0HThlA+4FptcAJXNYUy3rg==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-core-js": "3.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      }
    },
    "node_modules/@microsoft/1ds-post-js": {
      "version": "4.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/1ds-post-js/-/1ds-post-js-4.3.4.tgz",
      "integrity": "sha512-nlKjWricDj0Tn68Dt0P8lX9a+X7LYrqJ6/iSfQwMfDhRIGLqW+wxx8gxS+iGWC/oc8zMQAeiZaemUpCwQcwpRQ==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/1ds-core-js": "4.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      }
    },
    "node_modules/@microsoft/applicationinsights-channel-js": {
      "version": "3.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-channel-js/-/applicationinsights-channel-js-3.3.4.tgz",
      "integrity": "sha512-Z4nrxYwGKP9iyrYtm7iPQXVOFy4FsEsX0nDKkAi96Qpgw+vEh6NH4ORxMMuES0EollBQ3faJyvYCwckuCVIj0g==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-common": "3.3.4",
        "@microsoft/applicationinsights-core-js": "3.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      },
      "peerDependencies": {
        "tslib": ">= 1.0.0"
      }
    },
    "node_modules/@microsoft/applicationinsights-common": {
      "version": "3.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-common/-/applicationinsights-common-3.3.4.tgz",
      "integrity": "sha512-4ms16MlIvcP4WiUPqopifNxcWCcrXQJ2ADAK/75uok2mNQe6ZNRsqb/P+pvhUxc8A5HRlvoXPP1ptDSN5Girgw==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-core-js": "3.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      },
      "peerDependencies": {
        "tslib": ">= 1.0.0"
      }
    },
    "node_modules/@microsoft/applicationinsights-core-js": {
      "version": "3.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-core-js/-/applicationinsights-core-js-3.3.4.tgz",
      "integrity": "sha512-MummANF0mgKIkdvVvfmHQTBliK114IZLRhTL0X0Ep+zjDwWMHqYZgew0nlFKAl6ggu42abPZFK5afpE7qjtYJA==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      },
      "peerDependencies": {
        "tslib": ">= 1.0.0"
      }
    },
    "node_modules/@microsoft/applicationinsights-shims": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-shims/-/applicationinsights-shims-3.0.1.tgz",
      "integrity": "sha512-DKwboF47H1nb33rSUfjqI6ryX29v+2QWcTrRvcQDA32AZr5Ilkr7whOOSsD1aBzwqX0RJEIP1Z81jfE3NBm/Lg==",
      "license": "MIT",
      "dependencies": {
        "@nevware21/ts-utils": ">= 0.9.4 < 2.x"
      }
    },
    "node_modules/@microsoft/applicationinsights-web-basic": {
      "version": "3.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-web-basic/-/applicationinsights-web-basic-3.3.4.tgz",
      "integrity": "sha512-OpEPXr8vU/t/M8T9jvWJzJx/pCyygIiR1nGM/2PTde0wn7anl71Gxl5fWol7K/WwFEORNjkL3CEyWOyDc+28AA==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-channel-js": "3.3.4",
        "@microsoft/applicationinsights-common": "3.3.4",
        "@microsoft/applicationinsights-core-js": "3.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      },
      "peerDependencies": {
        "tslib": ">= 1.0.0"
      }
    },
    "node_modules/@microsoft/dynamicproto-js": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/@microsoft/dynamicproto-js/-/dynamicproto-js-2.0.3.tgz",
      "integrity": "sha512-JTWTU80rMy3mdxOjjpaiDQsTLZ6YSGGqsjURsY6AUQtIj0udlF/jYmhdLZu8693ZIC0T1IwYnFa0+QeiMnziBA==",
      "license": "MIT",
      "dependencies": {
        "@nevware21/ts-utils": ">= 0.10.4 < 2.x"
      }
    },
    "node_modules/@nevware21/ts-async": {
      "version": "0.5.4",
      "resolved": "https://registry.npmjs.org/@nevware21/ts-async/-/ts-async-0.5.4.tgz",
      "integrity": "sha512-IBTyj29GwGlxfzXw2NPnzty+w0Adx61Eze1/lknH/XIVdxtF9UnOpk76tnrHXWa6j84a1RR9hsOcHQPFv9qJjA==",
      "license": "MIT",
      "dependencies": {
        "@nevware21/ts-utils": ">= 0.11.6 < 2.x"
      }
    },
    "node_modules/@nevware21/ts-utils": {
      "version": "0.11.6",
      "resolved": "https://registry.npmjs.org/@nevware21/ts-utils/-/ts-utils-0.11.6.tgz",
      "integrity": "sha512-OUUJTh3fnaUSzg9DEHgv3d7jC+DnPL65mIO7RaR+jWve7+MmcgIvF79gY97DPQ4frH+IpNR78YAYd/dW4gK3kg==",
      "license": "MIT"
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
    "node_modules/@vscode/extension-telemetry": {
      "version": "0.9.8",
      "resolved": "https://registry.npmjs.org/@vscode/extension-telemetry/-/extension-telemetry-0.9.8.tgz",
      "integrity": "sha512-7YcKoUvmHlIB8QYCE4FNzt3ErHi9gQPhdCM3ZWtpw1bxPT0I+lMdx52KHlzTNoJzQ2NvMX7HyzyDwBEiMgTrWQ==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/1ds-core-js": "^4.3.4",
        "@microsoft/1ds-post-js": "^4.3.4",
        "@microsoft/applicationinsights-web-basic": "^3.3.4"
      },
      "engines": {
        "vscode": "^1.75.0"
      }
    },
    "node_modules/minimatch": {
      "version": "10.0.3",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-10.0.3.tgz",
      "integrity": "sha512-IPZ167aShDZZUMdRk66cyQAW3qr0WzbHkPdMYa8bzZhlHhO3jALbKdxcaak7W9FfT2rZNpQuUu4Od7ILEpXSaw==",
      "license": "ISC",
      "dependencies": {
        "@isaacs/brace-expansion": "^5.0.0"
      },
      "engines": {
        "node": "20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/request-light": {
      "version": "0.8.0",
      "resolved": "https://registry.npmjs.org/request-light/-/request-light-0.8.0.tgz",
      "integrity": "sha512-bH6E4PMmsEXYrLX6Kr1vu+xI3HproB1vECAwaPSJeroLE1kpWE3HR27uB4icx+6YORu1ajqBJXxuedv8ZQg5Lw=="
    },
    "node_modules/semver": {
      "version": "7.7.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.1.tgz",
      "integrity": "sha512-hlq8tAfn0m/61p4BVRcPzIGr6LKiMwo4VM6dGi6pt4qcRkmNzTcWq6eCEjEh+qXjkMDvPlOFFSGwQjoEa6gyMA==",
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/vscode-jsonrpc": {
      "version": "9.0.0-next.10",
      "resolved": "https://registry.npmjs.org/vscode-jsonrpc/-/vscode-jsonrpc-9.0.0-next.10.tgz",
      "integrity": "sha512-P+UOjuG/B1zkLM+bGIdmBwSkDejxtgo6EjG0pIkwnFBI0a2Mb7od36uUu8CPbECeQuh+n3zGcNwDl16DhuJ5IA==",
      "license": "MIT",
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/vscode-languageclient": {
      "version": "10.0.0-next.18",
      "resolved": "https://registry.npmjs.org/vscode-languageclient/-/vscode-languageclient-10.0.0-next.18.tgz",
      "integrity": "sha512-Dpcr0VEEf4SuMW17TFCuKovhvbCx6/tHTnmFyLW1KTJCdVmNG08hXVAmw8Z/izec7TQlzEvzw5PvRfYGzdtr5Q==",
      "license": "MIT",
      "dependencies": {
        "minimatch": "^10.0.3",
        "semver": "^7.7.1",
        "vscode-languageserver-protocol": "3.17.6-next.15"
      },
      "engines": {
        "vscode": "^1.91.0"
      }
    },
    "node_modules/vscode-languageserver-protocol": {
      "version": "3.17.6-next.15",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-protocol/-/vscode-languageserver-protocol-3.17.6-next.15.tgz",
      "integrity": "sha512-aoWX1wwGCndzfrTRhGKVpKAPVy9+WYhUtZW/PJQfHODmVwhVwb4we68CgsQZRTl36t8ZqlSOO2c2TdBPW7hrCw==",
      "license": "MIT",
      "dependencies": {
        "vscode-jsonrpc": "9.0.0-next.10",
        "vscode-languageserver-types": "3.17.6-next.6"
      }
    },
    "node_modules/vscode-languageserver-types": {
      "version": "3.17.6-next.6",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-types/-/vscode-languageserver-types-3.17.6-next.6.tgz",
      "integrity": "sha512-aiJY5/yW+xzw7KPNlwi3gQtddq/3EIn5z8X8nCgJfaiAij2R1APKePngv+MUdLdYJBVTLu+Qa0ODsT+pHgYguQ==",
      "license": "MIT"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/package.json]---
Location: vscode-main/extensions/json-language-features/package.json

```json
{
  "name": "json-language-features",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "aiKey": "0c6ae279ed8443289764825290e4f9e2-1a736e7c-1324-4338-be46-fc2a58ae4d14-7255",
  "engines": {
    "vscode": "^1.77.0"
  },
  "enabledApiProposals": [
    "extensionsAny"
  ],
  "icon": "icons/json.png",
  "activationEvents": [
    "onLanguage:json",
    "onLanguage:jsonc",
    "onLanguage:snippets",
    "onCommand:json.validate"
  ],
  "main": "./client/out/node/jsonClientMain",
  "browser": "./client/dist/browser/jsonClientMain",
  "capabilities": {
    "virtualWorkspaces": true,
    "untrustedWorkspaces": {
      "supported": "limited",
      "description": "%json.workspaceTrust%"
    }
  },
  "scripts": {
    "compile": "npx gulp compile-extension:json-language-features-client compile-extension:json-language-features-server",
    "watch": "npx gulp watch-extension:json-language-features-client watch-extension:json-language-features-server",
    "install-client-next": "npm install vscode-languageclient@next"
  },
  "categories": [
    "Programming Languages"
  ],
  "contributes": {
    "configuration": {
      "id": "json",
      "order": 20,
      "type": "object",
      "title": "JSON",
      "properties": {
        "json.schemas": {
          "type": "array",
          "scope": "resource",
          "description": "%json.schemas.desc%",
          "items": {
            "type": "object",
            "default": {
              "fileMatch": [
                "/myfile"
              ],
              "url": "schemaURL"
            },
            "properties": {
              "url": {
                "type": "string",
                "default": "/user.schema.json",
                "description": "%json.schemas.url.desc%"
              },
              "fileMatch": {
                "type": "array",
                "items": {
                  "type": "string",
                  "default": "MyFile.json",
                  "description": "%json.schemas.fileMatch.item.desc%"
                },
                "minItems": 1,
                "description": "%json.schemas.fileMatch.desc%"
              },
              "schema": {
                "$ref": "http://json-schema.org/draft-07/schema#",
                "description": "%json.schemas.schema.desc%"
              }
            }
          }
        },
        "json.validate.enable": {
          "type": "boolean",
          "scope": "window",
          "default": true,
          "description": "%json.validate.enable.desc%"
        },
        "json.format.enable": {
          "type": "boolean",
          "scope": "window",
          "default": true,
          "description": "%json.format.enable.desc%"
        },
        "json.format.keepLines": {
          "type": "boolean",
          "scope": "window",
          "default": false,
          "description": "%json.format.keepLines.desc%"
        },
        "json.trace.server": {
          "type": "string",
          "scope": "window",
          "enum": [
            "off",
            "messages",
            "verbose"
          ],
          "default": "off",
          "description": "%json.tracing.desc%"
        },
        "json.colorDecorators.enable": {
          "type": "boolean",
          "scope": "window",
          "default": true,
          "description": "%json.colorDecorators.enable.desc%",
          "deprecationMessage": "%json.colorDecorators.enable.deprecationMessage%"
        },
        "json.maxItemsComputed": {
          "type": "number",
          "default": 5000,
          "description": "%json.maxItemsComputed.desc%"
        },
        "json.schemaDownload.enable": {
          "type": "boolean",
          "default": true,
          "description": "%json.enableSchemaDownload.desc%",
          "tags": [
            "usesOnlineServices"
          ]
        }
      }
    },
    "configurationDefaults": {
      "[json]": {
        "editor.quickSuggestions": {
          "strings": true
        },
        "editor.suggest.insertMode": "replace"
      },
      "[jsonc]": {
        "editor.quickSuggestions": {
          "strings": true
        },
        "editor.suggest.insertMode": "replace"
      },
      "[snippets]": {
        "editor.quickSuggestions": {
          "strings": true
        },
        "editor.suggest.insertMode": "replace"
      }
    },
    "jsonValidation": [
      {
        "fileMatch": "*.schema.json",
        "url": "http://json-schema.org/draft-07/schema#"
      }
    ],
    "commands": [
      {
        "command": "json.clearCache",
        "title": "%json.command.clearCache%",
        "category": "JSON"
      },
      {
        "command": "json.sort",
        "title": "%json.command.sort%",
        "category": "JSON"
      }
    ]
  },
  "dependencies": {
    "@vscode/extension-telemetry": "^0.9.8",
    "request-light": "^0.8.0",
    "vscode-languageclient": "^10.0.0-next.18"
  },
  "devDependencies": {
    "@types/node": "22.x"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/package.nls.json]---
Location: vscode-main/extensions/json-language-features/package.nls.json

```json
{
	"displayName": "JSON Language Features",
	"description": "Provides rich language support for JSON files.",
	"json.schemas.desc": "Associate schemas to JSON files in the current project.",
	"json.schemas.url.desc": "A URL or absolute file path to a schema. Can be a relative path (starting with './') in workspace and workspace folder settings.",
	"json.schemas.fileMatch.desc": "An array of file patterns to match against when resolving JSON files to schemas. `*` and '**' can be used as a wildcard. Exclusion patterns can also be defined and start with '!'. A file matches when there is at least one matching pattern and the last matching pattern is not an exclusion pattern.",
	"json.schemas.fileMatch.item.desc": "A file pattern that can contain '*' and '**' to match against when resolving JSON files to schemas. When beginning with '!', it defines an exclusion pattern.",
	"json.schemas.schema.desc": "The schema definition for the given URL. The schema only needs to be provided to avoid accesses to the schema URL.",
	"json.format.enable.desc": "Enable/disable default JSON formatter",
	"json.format.keepLines.desc" : "Keep all existing new lines when formatting.",
	"json.validate.enable.desc": "Enable/disable JSON validation.",
	"json.tracing.desc": "Traces the communication between VS Code and the JSON language server.",
	"json.colorDecorators.enable.desc": "Enables or disables color decorators",
	"json.colorDecorators.enable.deprecationMessage": "The setting `json.colorDecorators.enable` has been deprecated in favor of `editor.colorDecorators`.",
	"json.schemaResolutionErrorMessage": "Unable to resolve schema.",
	"json.clickToRetry": "Click to retry.",
	"json.maxItemsComputed.desc": "The maximum number of outline symbols and folding regions computed (limited for performance reasons).",
	"json.maxItemsExceededInformation.desc": "Show notification when exceeding the maximum number of outline symbols and folding regions.",
	"json.enableSchemaDownload.desc": "When enabled, JSON schemas can be fetched from http and https locations.",
	"json.command.clearCache": "Clear Schema Cache",
	"json.command.sort": "Sort Document",
	"json.workspaceTrust": "The extension requires workspace trust to load schemas from http and https."

}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/README.md]---
Location: vscode-main/extensions/json-language-features/README.md

```markdown
# Language Features for JSON files

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

## Features

See [JSON in Visual Studio Code](https://code.visualstudio.com/docs/languages/json) to learn about the features of this extension.
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/.vscode/launch.json]---
Location: vscode-main/extensions/json-language-features/.vscode/launch.json

```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"name": "Launch Extension",
			"type": "extensionHost",
			"request": "launch",
			"runtimeExecutable": "${execPath}",
			"args": [
				"--extensionDevelopmentPath=${workspaceFolder}"
			],
			"stopOnEntry": false,
			"sourceMaps": true,
			"outFiles": ["${workspaceFolder}/client/out"]
		},
		{
			"name": "Launch Tests",
			"type": "extensionHost",
			"request": "launch",
			"runtimeExecutable": "${execPath}",
			"args": ["--extensionDevelopmentPath=${workspaceFolder}", "--extensionTestsPath=${workspaceFolder}/client/out/test" ],
			"stopOnEntry": false,
			"sourceMaps": true,
			"outFiles": ["${workspaceFolder}/client/out/test"]
		},
		{
			"name": "Attach Language Server",
			"type": "node",
			"request": "attach",
			"port": 6004,
			"sourceMaps": true,
			"outFiles": ["${workspaceFolder}/server/out"]
		}
	],
	"compounds": [
		{
			"name": "Launch Extension and Attach Language Server",
			"configurations": [
				"Launch Extension",
				"Attach Language Server"
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/.vscode/tasks.json]---
Location: vscode-main/extensions/json-language-features/.vscode/tasks.json

```json
{
	"version": "2.0.0",
	"command": "npm",
	"type": "shell",
	"presentation": {
		"reveal": "silent"
	},
	"args": ["run", "compile"],
	"isBackground": true,
	"problemMatcher": "$tsc-watch"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/client/tsconfig.json]---
Location: vscode-main/extensions/json-language-features/client/tsconfig.json

```json
{
	"extends": "../../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"lib": [
			"webworker"
		],
		"module": "Node16",
		"typeRoots": [
			"../node_modules/@types"
		]
	},
	"include": [
		"src/**/*",
		"../../../src/vscode-dts/vscode.d.ts",
		"../../../src/vscode-dts/vscode.proposed.languageStatus.d.ts",
		"../../../src/vscode-dts/vscode.proposed.extensionsAny.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/client/src/jsonClient.ts]---
Location: vscode-main/extensions/json-language-features/client/src/jsonClient.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export type JSONLanguageStatus = { schemas: string[] };

import {
	workspace, window, languages, commands, LogOutputChannel, ExtensionContext, extensions, Uri, ColorInformation,
	Diagnostic, StatusBarAlignment, TextEditor, TextDocument, FormattingOptions, CancellationToken, FoldingRange,
	ProviderResult, TextEdit, Range, Position, Disposable, CompletionItem, CompletionList, CompletionContext, Hover, MarkdownString, FoldingContext, DocumentSymbol, SymbolInformation, l10n,
	RelativePattern
} from 'vscode';
import {
	LanguageClientOptions, RequestType, NotificationType, FormattingOptions as LSPFormattingOptions, DocumentDiagnosticReportKind,
	Diagnostic as LSPDiagnostic,
	DidChangeConfigurationNotification, HandleDiagnosticsSignature, ResponseError, DocumentRangeFormattingParams,
	DocumentRangeFormattingRequest, ProvideCompletionItemsSignature, ProvideHoverSignature, BaseLanguageClient, ProvideFoldingRangeSignature, ProvideDocumentSymbolsSignature, ProvideDocumentColorsSignature
} from 'vscode-languageclient';


import { hash } from './utils/hash';
import { createDocumentSymbolsLimitItem, createLanguageStatusItem, createLimitStatusItem } from './languageStatus';
import { getLanguageParticipants, LanguageParticipants } from './languageParticipants';

namespace VSCodeContentRequest {
	export const type: RequestType<string, string, any> = new RequestType('vscode/content');
}

namespace SchemaContentChangeNotification {
	export const type: NotificationType<string | string[]> = new NotificationType('json/schemaContent');
}

namespace ForceValidateRequest {
	export const type: RequestType<string, Diagnostic[], any> = new RequestType('json/validate');
}

namespace LanguageStatusRequest {
	export const type: RequestType<string, JSONLanguageStatus, any> = new RequestType('json/languageStatus');
}

namespace ValidateContentRequest {
	export const type: RequestType<{ schemaUri: string; content: string }, LSPDiagnostic[], any> = new RequestType('json/validateContent');
}
interface SortOptions extends LSPFormattingOptions {
}

interface DocumentSortingParams {
	/**
	 * The uri of the document to sort.
	 */
	readonly uri: string;
	/**
	 * The sort options
	 */
	readonly options: SortOptions;
}

namespace DocumentSortingRequest {
	export interface ITextEdit {
		range: {
			start: { line: number; character: number };
			end: { line: number; character: number };
		};
		newText: string;
	}
	export const type: RequestType<DocumentSortingParams, ITextEdit[], any> = new RequestType('json/sort');
}

export interface ISchemaAssociations {
	[pattern: string]: string[];
}

export interface ISchemaAssociation {
	fileMatch: string[];
	uri: string;
}

namespace SchemaAssociationNotification {
	export const type: NotificationType<ISchemaAssociations | ISchemaAssociation[]> = new NotificationType('json/schemaAssociations');
}

type Settings = {
	json?: {
		schemas?: JSONSchemaSettings[];
		format?: { enable?: boolean };
		keepLines?: { enable?: boolean };
		validate?: { enable?: boolean };
		resultLimit?: number;
		jsonFoldingLimit?: number;
		jsoncFoldingLimit?: number;
		jsonColorDecoratorLimit?: number;
		jsoncColorDecoratorLimit?: number;
	};
	http?: {
		proxy?: string;
		proxyStrictSSL?: boolean;
	};
};

export type JSONSchemaSettings = {
	fileMatch?: string[];
	url?: string;
	schema?: any;
	folderUri?: string;
};

export namespace SettingIds {
	export const enableFormatter = 'json.format.enable';
	export const enableKeepLines = 'json.format.keepLines';
	export const enableValidation = 'json.validate.enable';
	export const enableSchemaDownload = 'json.schemaDownload.enable';
	export const maxItemsComputed = 'json.maxItemsComputed';
	export const editorFoldingMaximumRegions = 'editor.foldingMaximumRegions';
	export const editorColorDecoratorsLimit = 'editor.colorDecoratorsLimit';

	export const editorSection = 'editor';
	export const foldingMaximumRegions = 'foldingMaximumRegions';
	export const colorDecoratorsLimit = 'colorDecoratorsLimit';
}

export interface TelemetryReporter {
	sendTelemetryEvent(eventName: string, properties?: {
		[key: string]: string;
	}, measurements?: {
		[key: string]: number;
	}): void;
}

export type LanguageClientConstructor = (name: string, description: string, clientOptions: LanguageClientOptions) => BaseLanguageClient;

export interface Runtime {
	schemaRequests: SchemaRequestService;
	telemetry?: TelemetryReporter;
	readonly timer: {
		setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable;
	};
	logOutputChannel: LogOutputChannel;
}

export interface SchemaRequestService {
	getContent(uri: string): Promise<string>;
	clearCache?(): Promise<string[]>;
}

export const languageServerDescription = l10n.t('JSON Language Server');

let resultLimit = 5000;
let jsonFoldingLimit = 5000;
let jsoncFoldingLimit = 5000;
let jsonColorDecoratorLimit = 5000;
let jsoncColorDecoratorLimit = 5000;

export interface AsyncDisposable {
	dispose(): Promise<void>;
}

export async function startClient(context: ExtensionContext, newLanguageClient: LanguageClientConstructor, runtime: Runtime): Promise<AsyncDisposable> {
	const languageParticipants = getLanguageParticipants();
	context.subscriptions.push(languageParticipants);

	let client: Disposable | undefined = await startClientWithParticipants(context, languageParticipants, newLanguageClient, runtime);

	let restartTrigger: Disposable | undefined;
	languageParticipants.onDidChange(() => {
		if (restartTrigger) {
			restartTrigger.dispose();
		}
		restartTrigger = runtime.timer.setTimeout(async () => {
			if (client) {
				runtime.logOutputChannel.info('Extensions have changed, restarting JSON server...');
				runtime.logOutputChannel.info('');
				const oldClient = client;
				client = undefined;
				await oldClient.dispose();
				client = await startClientWithParticipants(context, languageParticipants, newLanguageClient, runtime);
			}
		}, 2000);
	});

	return {
		dispose: async () => {
			restartTrigger?.dispose();
			await client?.dispose();
		}
	};
}

async function startClientWithParticipants(_context: ExtensionContext, languageParticipants: LanguageParticipants, newLanguageClient: LanguageClientConstructor, runtime: Runtime): Promise<AsyncDisposable> {

	const toDispose: Disposable[] = [];

	let rangeFormatting: Disposable | undefined = undefined;

	const documentSelector = languageParticipants.documentSelector;

	const schemaResolutionErrorStatusBarItem = window.createStatusBarItem('status.json.resolveError', StatusBarAlignment.Right, 0);
	schemaResolutionErrorStatusBarItem.name = l10n.t('JSON: Schema Resolution Error');
	schemaResolutionErrorStatusBarItem.text = '$(alert)';
	toDispose.push(schemaResolutionErrorStatusBarItem);

	const fileSchemaErrors = new Map<string, string>();
	let schemaDownloadEnabled = true;

	let isClientReady = false;

	const documentSymbolsLimitStatusbarItem = createLimitStatusItem((limit: number) => createDocumentSymbolsLimitItem(documentSelector, SettingIds.maxItemsComputed, limit));
	toDispose.push(documentSymbolsLimitStatusbarItem);

	toDispose.push(commands.registerCommand('json.clearCache', async () => {
		if (isClientReady && runtime.schemaRequests.clearCache) {
			const cachedSchemas = await runtime.schemaRequests.clearCache();
			await client.sendNotification(SchemaContentChangeNotification.type, cachedSchemas);
		}
		window.showInformationMessage(l10n.t('JSON schema cache cleared.'));
	}));

	toDispose.push(commands.registerCommand('json.validate', async (schemaUri: Uri, content: string) => {
		const diagnostics: LSPDiagnostic[] = await client.sendRequest(ValidateContentRequest.type, { schemaUri: schemaUri.toString(), content });
		return diagnostics.map(client.protocol2CodeConverter.asDiagnostic);
	}));

	toDispose.push(commands.registerCommand('json.sort', async () => {

		if (isClientReady) {
			const textEditor = window.activeTextEditor;
			if (textEditor) {
				const documentOptions = textEditor.options;
				const textEdits = await getSortTextEdits(textEditor.document, documentOptions.tabSize, documentOptions.insertSpaces);
				const success = await textEditor.edit(mutator => {
					for (const edit of textEdits) {
						mutator.replace(client.protocol2CodeConverter.asRange(edit.range), edit.newText);
					}
				});
				if (!success) {
					window.showErrorMessage(l10n.t('Failed to sort the JSONC document, please consider opening an issue.'));
				}
			}
		}
	}));

	function filterSchemaErrorDiagnostics(uri: Uri, diagnostics: Diagnostic[]): Diagnostic[] {
		const schemaErrorIndex = diagnostics.findIndex(isSchemaResolveError);
		if (schemaErrorIndex !== -1) {
			const schemaResolveDiagnostic = diagnostics[schemaErrorIndex];
			fileSchemaErrors.set(uri.toString(), schemaResolveDiagnostic.message);
			if (!schemaDownloadEnabled) {
				diagnostics = diagnostics.filter(d => !isSchemaResolveError(d));
			}
			if (window.activeTextEditor && window.activeTextEditor.document.uri.toString() === uri.toString()) {
				schemaResolutionErrorStatusBarItem.show();
			}
		}
		return diagnostics;
	}

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for json documents
		documentSelector,
		initializationOptions: {
			handledSchemaProtocols: ['file'], // language server only loads file-URI. Fetching schemas with other protocols ('http'...) are made on the client.
			provideFormatter: false, // tell the server to not provide formatting capability and ignore the `json.format.enable` setting.
			customCapabilities: { rangeFormatting: { editLimit: 10000 } }
		},
		synchronize: {
			// Synchronize the setting section 'json' to the server
			configurationSection: ['json', 'http'],
			fileEvents: workspace.createFileSystemWatcher('**/*.json')
		},
		middleware: {
			workspace: {
				didChangeConfiguration: () => client.sendNotification(DidChangeConfigurationNotification.type, { settings: getSettings() })
			},
			provideDiagnostics: async (uriOrDoc, previousResolutId, token, next) => {
				const diagnostics = await next(uriOrDoc, previousResolutId, token);
				if (diagnostics && diagnostics.kind === DocumentDiagnosticReportKind.Full) {
					const uri = uriOrDoc instanceof Uri ? uriOrDoc : uriOrDoc.uri;
					diagnostics.items = filterSchemaErrorDiagnostics(uri, diagnostics.items);
				}
				return diagnostics;
			},
			handleDiagnostics: (uri: Uri, diagnostics: Diagnostic[], next: HandleDiagnosticsSignature) => {
				diagnostics = filterSchemaErrorDiagnostics(uri, diagnostics);
				next(uri, diagnostics);
			},
			// testing the replace / insert mode
			provideCompletionItem(document: TextDocument, position: Position, context: CompletionContext, token: CancellationToken, next: ProvideCompletionItemsSignature): ProviderResult<CompletionItem[] | CompletionList> {
				function update(item: CompletionItem) {
					const range = item.range;
					if (range instanceof Range && range.end.isAfter(position) && range.start.isBeforeOrEqual(position)) {
						item.range = { inserting: new Range(range.start, position), replacing: range };
					}
					if (item.documentation instanceof MarkdownString) {
						item.documentation = updateMarkdownString(item.documentation);
					}

				}
				function updateProposals(r: CompletionItem[] | CompletionList | null | undefined): CompletionItem[] | CompletionList | null | undefined {
					if (r) {
						(Array.isArray(r) ? r : r.items).forEach(update);
					}
					return r;
				}

				const r = next(document, position, context, token);
				if (isThenable<CompletionItem[] | CompletionList | null | undefined>(r)) {
					return r.then(updateProposals);
				}
				return updateProposals(r);
			},
			provideHover(document: TextDocument, position: Position, token: CancellationToken, next: ProvideHoverSignature) {
				function updateHover(r: Hover | null | undefined): Hover | null | undefined {
					if (r && Array.isArray(r.contents)) {
						r.contents = r.contents.map(h => h instanceof MarkdownString ? updateMarkdownString(h) : h);
					}
					return r;
				}
				const r = next(document, position, token);
				if (isThenable<Hover | null | undefined>(r)) {
					return r.then(updateHover);
				}
				return updateHover(r);
			},
			provideFoldingRanges(document: TextDocument, context: FoldingContext, token: CancellationToken, next: ProvideFoldingRangeSignature) {
				const r = next(document, context, token);
				if (isThenable<FoldingRange[] | null | undefined>(r)) {
					return r;
				}
				return r;
			},
			provideDocumentColors(document: TextDocument, token: CancellationToken, next: ProvideDocumentColorsSignature) {
				const r = next(document, token);
				if (isThenable<ColorInformation[] | null | undefined>(r)) {
					return r;
				}
				return r;
			},
			provideDocumentSymbols(document: TextDocument, token: CancellationToken, next: ProvideDocumentSymbolsSignature) {
				type T = SymbolInformation[] | DocumentSymbol[];
				function countDocumentSymbols(symbols: DocumentSymbol[]): number {
					return symbols.reduce((previousValue, s) => previousValue + 1 + countDocumentSymbols(s.children), 0);
				}
				function isDocumentSymbol(r: T): r is DocumentSymbol[] {
					return r[0] instanceof DocumentSymbol;
				}
				function checkLimit(r: T | null | undefined): T | null | undefined {
					if (Array.isArray(r) && (isDocumentSymbol(r) ? countDocumentSymbols(r) : r.length) > resultLimit) {
						documentSymbolsLimitStatusbarItem.update(document, resultLimit);
					} else {
						documentSymbolsLimitStatusbarItem.update(document, false);
					}
					return r;
				}
				const r = next(document, token);
				if (isThenable<T | undefined | null>(r)) {
					return r.then(checkLimit);
				}
				return checkLimit(r);
			}
		}
	};

	clientOptions.outputChannel = runtime.logOutputChannel;
	// Create the language client and start the client.
	const client = newLanguageClient('json', languageServerDescription, clientOptions);
	client.registerProposedFeatures();

	const schemaDocuments: { [uri: string]: boolean } = {};

	// handle content request
	client.onRequest(VSCodeContentRequest.type, async (uriPath: string) => {
		const uri = Uri.parse(uriPath);
		const uriString = uri.toString(true);
		if (uri.scheme === 'untitled') {
			throw new ResponseError(3, l10n.t('Unable to load {0}', uriString));
		}
		if (uri.scheme === 'vscode') {
			try {
				runtime.logOutputChannel.info('read schema from vscode: ' + uriString);
				ensureFilesystemWatcherInstalled(uri);
				const content = await workspace.fs.readFile(uri);
				return new TextDecoder().decode(content);
			} catch (e) {
				throw new ResponseError(5, e.toString(), e);
			}
		} else if (uri.scheme !== 'http' && uri.scheme !== 'https') {
			try {
				const document = await workspace.openTextDocument(uri);
				schemaDocuments[uriString] = true;
				return document.getText();
			} catch (e) {
				throw new ResponseError(2, e.toString(), e);
			}
		} else if (schemaDownloadEnabled && workspace.isTrusted) {
			if (runtime.telemetry && uri.authority === 'schema.management.azure.com') {
				/* __GDPR__
					"json.schema" : {
						"owner": "aeschli",
						"comment": "Measure the use of the Azure resource manager schemas",
						"schemaURL" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "The azure schema URL that was requested." }
					}
				*/
				runtime.telemetry.sendTelemetryEvent('json.schema', { schemaURL: uriString });
			}
			try {
				return await runtime.schemaRequests.getContent(uriString);
			} catch (e) {
				throw new ResponseError(4, e.toString());
			}
		} else {
			if (!workspace.isTrusted) {
				throw new ResponseError(1, l10n.t('Downloading schemas is disabled in untrusted workspaces'));
			}
			throw new ResponseError(1, l10n.t('Downloading schemas is disabled through setting \'{0}\'', SettingIds.enableSchemaDownload));
		}
	});

	await client.start();

	isClientReady = true;

	const handleContentChange = (uriString: string) => {
		if (schemaDocuments[uriString]) {
			client.sendNotification(SchemaContentChangeNotification.type, uriString);
			return true;
		}
		return false;
	};
	const handleActiveEditorChange = (activeEditor?: TextEditor) => {
		if (!activeEditor) {
			return;
		}

		const activeDocUri = activeEditor.document.uri.toString();

		if (activeDocUri && fileSchemaErrors.has(activeDocUri)) {
			schemaResolutionErrorStatusBarItem.show();
		} else {
			schemaResolutionErrorStatusBarItem.hide();
		}
	};
	const handleContentClosed = (uriString: string) => {
		if (handleContentChange(uriString)) {
			delete schemaDocuments[uriString];
		}
		fileSchemaErrors.delete(uriString);
	};

	const watchers: Map<string, Disposable> = new Map();
	toDispose.push(new Disposable(() => {
		for (const d of watchers.values()) {
			d.dispose();
		}
	}));


	const ensureFilesystemWatcherInstalled = (uri: Uri) => {

		const uriString = uri.toString();
		if (!watchers.has(uriString)) {
			try {
				const watcher = workspace.createFileSystemWatcher(new RelativePattern(uri, '*'));
				const handleChange = (uri: Uri) => {
					runtime.logOutputChannel.info('schema change detected ' + uri.toString());
					client.sendNotification(SchemaContentChangeNotification.type, uriString);
				};
				const createListener = watcher.onDidCreate(handleChange);
				const changeListener = watcher.onDidChange(handleChange);
				const deleteListener = watcher.onDidDelete(() => {
					const watcher = watchers.get(uriString);
					if (watcher) {
						watcher.dispose();
						watchers.delete(uriString);
					}
				});
				watchers.set(uriString, Disposable.from(watcher, createListener, changeListener, deleteListener));
			} catch {
				runtime.logOutputChannel.info('Problem installing a file system watcher for ' + uriString);
			}
		}
	};

	toDispose.push(workspace.onDidChangeTextDocument(e => handleContentChange(e.document.uri.toString())));
	toDispose.push(workspace.onDidCloseTextDocument(d => handleContentClosed(d.uri.toString())));

	toDispose.push(window.onDidChangeActiveTextEditor(handleActiveEditorChange));

	const handleRetryResolveSchemaCommand = () => {
		if (window.activeTextEditor) {
			schemaResolutionErrorStatusBarItem.text = '$(watch)';
			const activeDocUri = window.activeTextEditor.document.uri.toString();
			client.sendRequest(ForceValidateRequest.type, activeDocUri).then((diagnostics) => {
				const schemaErrorIndex = diagnostics.findIndex(isSchemaResolveError);
				if (schemaErrorIndex !== -1) {
					// Show schema resolution errors in status bar only; ref: #51032
					const schemaResolveDiagnostic = diagnostics[schemaErrorIndex];
					fileSchemaErrors.set(activeDocUri, schemaResolveDiagnostic.message);
				} else {
					schemaResolutionErrorStatusBarItem.hide();
				}
				schemaResolutionErrorStatusBarItem.text = '$(alert)';
			});
		}
	};

	toDispose.push(commands.registerCommand('_json.retryResolveSchema', handleRetryResolveSchemaCommand));

	client.sendNotification(SchemaAssociationNotification.type, await getSchemaAssociations());

	toDispose.push(extensions.onDidChange(async _ => {
		client.sendNotification(SchemaAssociationNotification.type, await getSchemaAssociations());
	}));

	const associationWatcher = workspace.createFileSystemWatcher(new RelativePattern(
		Uri.parse(`vscode://schemas-associations/`),
		'**/schemas-associations.json')
	);
	toDispose.push(associationWatcher);
	toDispose.push(associationWatcher.onDidChange(async _e => {
		client.sendNotification(SchemaAssociationNotification.type, await getSchemaAssociations());
	}));

	// manually register / deregister format provider based on the `json.format.enable` setting avoiding issues with late registration. See #71652.
	updateFormatterRegistration();
	toDispose.push({ dispose: () => rangeFormatting && rangeFormatting.dispose() });

	updateSchemaDownloadSetting();

	toDispose.push(workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration(SettingIds.enableFormatter)) {
			updateFormatterRegistration();
		} else if (e.affectsConfiguration(SettingIds.enableSchemaDownload)) {
			updateSchemaDownloadSetting();
		} else if (e.affectsConfiguration(SettingIds.editorFoldingMaximumRegions) || e.affectsConfiguration(SettingIds.editorColorDecoratorsLimit)) {
			client.sendNotification(DidChangeConfigurationNotification.type, { settings: getSettings() });
		}
	}));
	toDispose.push(workspace.onDidGrantWorkspaceTrust(updateSchemaDownloadSetting));

	toDispose.push(createLanguageStatusItem(documentSelector, (uri: string) => client.sendRequest(LanguageStatusRequest.type, uri)));

	function updateFormatterRegistration() {
		const formatEnabled = workspace.getConfiguration().get(SettingIds.enableFormatter);
		if (!formatEnabled && rangeFormatting) {
			rangeFormatting.dispose();
			rangeFormatting = undefined;
		} else if (formatEnabled && !rangeFormatting) {
			rangeFormatting = languages.registerDocumentRangeFormattingEditProvider(documentSelector, {
				provideDocumentRangeFormattingEdits(document: TextDocument, range: Range, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]> {
					const filesConfig = workspace.getConfiguration('files', document);
					const fileFormattingOptions = {
						trimTrailingWhitespace: filesConfig.get<boolean>('trimTrailingWhitespace'),
						trimFinalNewlines: filesConfig.get<boolean>('trimFinalNewlines'),
						insertFinalNewline: filesConfig.get<boolean>('insertFinalNewline'),
					};
					const params: DocumentRangeFormattingParams = {
						textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
						range: client.code2ProtocolConverter.asRange(range),
						options: client.code2ProtocolConverter.asFormattingOptions(options, fileFormattingOptions)
					};

					return client.sendRequest(DocumentRangeFormattingRequest.type, params, token).then(
						client.protocol2CodeConverter.asTextEdits,
						(error) => {
							client.handleFailedRequest(DocumentRangeFormattingRequest.type, undefined, error, []);
							return Promise.resolve([]);
						}
					);
				}
			});
		}
	}

	function updateSchemaDownloadSetting() {
		if (!workspace.isTrusted) {
			schemaResolutionErrorStatusBarItem.tooltip = l10n.t('Unable to download schemas in untrusted workspaces.');
			schemaResolutionErrorStatusBarItem.command = 'workbench.trust.manage';
			return;
		}
		schemaDownloadEnabled = workspace.getConfiguration().get(SettingIds.enableSchemaDownload) !== false;
		if (schemaDownloadEnabled) {
			schemaResolutionErrorStatusBarItem.tooltip = l10n.t('Unable to resolve schema. Click to retry.');
			schemaResolutionErrorStatusBarItem.command = '_json.retryResolveSchema';
			handleRetryResolveSchemaCommand();
		} else {
			schemaResolutionErrorStatusBarItem.tooltip = l10n.t('Downloading schemas is disabled. Click to configure.');
			schemaResolutionErrorStatusBarItem.command = { command: 'workbench.action.openSettings', arguments: [SettingIds.enableSchemaDownload], title: '' };
		}
	}

	async function getSortTextEdits(document: TextDocument, tabSize: string | number = 4, insertSpaces: string | boolean = true): Promise<TextEdit[]> {
		const filesConfig = workspace.getConfiguration('files', document);
		const options: SortOptions = {
			tabSize: Number(tabSize),
			insertSpaces: Boolean(insertSpaces),
			trimTrailingWhitespace: filesConfig.get<boolean>('trimTrailingWhitespace'),
			trimFinalNewlines: filesConfig.get<boolean>('trimFinalNewlines'),
			insertFinalNewline: filesConfig.get<boolean>('insertFinalNewline'),
		};
		const params: DocumentSortingParams = {
			uri: document.uri.toString(),
			options
		};
		const edits = await client.sendRequest(DocumentSortingRequest.type, params);
		// Here we convert the JSON objects to real TextEdit objects
		return edits.map((edit) => {
			return new TextEdit(
				new Range(edit.range.start.line, edit.range.start.character, edit.range.end.line, edit.range.end.character),
				edit.newText
			);
		});
	}

	return {
		dispose: async () => {
			await client.stop();
			toDispose.forEach(d => d.dispose());
			rangeFormatting?.dispose();
		}
	};
}

async function getSchemaAssociations(): Promise<ISchemaAssociation[]> {
	return getSchemaExtensionAssociations()
		.concat(await getDynamicSchemaAssociations());
}

function getSchemaExtensionAssociations(): ISchemaAssociation[] {
	const associations: ISchemaAssociation[] = [];
	extensions.allAcrossExtensionHosts.forEach(extension => {
		const packageJSON = extension.packageJSON;
		if (packageJSON && packageJSON.contributes && packageJSON.contributes.jsonValidation) {
			const jsonValidation = packageJSON.contributes.jsonValidation;
			if (Array.isArray(jsonValidation)) {
				jsonValidation.forEach(jv => {
					let { fileMatch, url } = jv;
					if (typeof fileMatch === 'string') {
						fileMatch = [fileMatch];
					}
					if (Array.isArray(fileMatch) && typeof url === 'string') {
						let uri: string = url;
						if (uri[0] === '.' && uri[1] === '/') {
							uri = Uri.joinPath(extension.extensionUri, uri).toString();
						}
						fileMatch = fileMatch.map(fm => {
							if (fm[0] === '%') {
								fm = fm.replace(/%APP_SETTINGS_HOME%/, '/User');
								fm = fm.replace(/%MACHINE_SETTINGS_HOME%/, '/Machine');
								fm = fm.replace(/%APP_WORKSPACES_HOME%/, '/Workspaces');
							} else if (!fm.match(/^(\w+:\/\/|\/|!)/)) {
								fm = '/' + fm;
							}
							return fm;
						});
						associations.push({ fileMatch, uri });
					}
				});
			}
		}
	});
	return associations;
}

async function getDynamicSchemaAssociations(): Promise<ISchemaAssociation[]> {
	const result: ISchemaAssociation[] = [];
	try {
		const data = await workspace.fs.readFile(Uri.parse(`vscode://schemas-associations/schemas-associations.json`));
		const rawStr = new TextDecoder().decode(data);
		const obj = <Record<string, string[]>>JSON.parse(rawStr);
		for (const item of Object.keys(obj)) {
			result.push({
				fileMatch: obj[item],
				uri: item
			});
		}
	} catch {
		// ignore
	}
	return result;
}

function getSettings(): Settings {
	const configuration = workspace.getConfiguration();
	const httpSettings = workspace.getConfiguration('http');

	const normalizeLimit = (settingValue: any) => Math.trunc(Math.max(0, Number(settingValue))) || 5000;

	resultLimit = normalizeLimit(workspace.getConfiguration().get(SettingIds.maxItemsComputed));
	const editorJSONSettings = workspace.getConfiguration(SettingIds.editorSection, { languageId: 'json' });
	const editorJSONCSettings = workspace.getConfiguration(SettingIds.editorSection, { languageId: 'jsonc' });

	jsonFoldingLimit = normalizeLimit(editorJSONSettings.get(SettingIds.foldingMaximumRegions));
	jsoncFoldingLimit = normalizeLimit(editorJSONCSettings.get(SettingIds.foldingMaximumRegions));
	jsonColorDecoratorLimit = normalizeLimit(editorJSONSettings.get(SettingIds.colorDecoratorsLimit));
	jsoncColorDecoratorLimit = normalizeLimit(editorJSONCSettings.get(SettingIds.colorDecoratorsLimit));

	const schemas: JSONSchemaSettings[] = [];

	const settings: Settings = {
		http: {
			proxy: httpSettings.get('proxy'),
			proxyStrictSSL: httpSettings.get('proxyStrictSSL')
		},
		json: {
			validate: { enable: configuration.get(SettingIds.enableValidation) },
			format: { enable: configuration.get(SettingIds.enableFormatter) },
			keepLines: { enable: configuration.get(SettingIds.enableKeepLines) },
			schemas,
			resultLimit: resultLimit + 1, // ask for one more so we can detect if the limit has been exceeded
			jsonFoldingLimit: jsonFoldingLimit + 1,
			jsoncFoldingLimit: jsoncFoldingLimit + 1,
			jsonColorDecoratorLimit: jsonColorDecoratorLimit + 1,
			jsoncColorDecoratorLimit: jsoncColorDecoratorLimit + 1
		}
	};

	/*
	 * Add schemas from the settings
	 * folderUri to which folder the setting is scoped to. `undefined` means global (also external files)
	 * settingsLocation against which path relative schema URLs are resolved
	 */
	const collectSchemaSettings = (schemaSettings: JSONSchemaSettings[] | undefined, folderUri: string | undefined, settingsLocation: Uri | undefined) => {
		if (schemaSettings) {
			for (const setting of schemaSettings) {
				const url = getSchemaId(setting, settingsLocation);
				if (url) {
					const schemaSetting: JSONSchemaSettings = { url, fileMatch: setting.fileMatch, folderUri, schema: setting.schema };
					schemas.push(schemaSetting);
				}
			}
		}
	};

	const folders = workspace.workspaceFolders ?? [];

	const schemaConfigInfo = workspace.getConfiguration('json', null).inspect<JSONSchemaSettings[]>('schemas');
	if (schemaConfigInfo) {
		// settings in user config
		collectSchemaSettings(schemaConfigInfo.globalValue, undefined, undefined);
		if (workspace.workspaceFile) {
			if (schemaConfigInfo.workspaceValue) {
				const settingsLocation = Uri.joinPath(workspace.workspaceFile, '..');
				// settings in the workspace configuration file apply to all files (also external files)
				collectSchemaSettings(schemaConfigInfo.workspaceValue, undefined, settingsLocation);
			}
			for (const folder of folders) {
				const folderUri = folder.uri;
				const folderSchemaConfigInfo = workspace.getConfiguration('json', folderUri).inspect<JSONSchemaSettings[]>('schemas');
				collectSchemaSettings(folderSchemaConfigInfo?.workspaceFolderValue, folderUri.toString(false), folderUri);
			}
		} else {
			if (schemaConfigInfo.workspaceValue && folders.length === 1) {
				// single folder workspace: settings apply to all files (also external files)
				collectSchemaSettings(schemaConfigInfo.workspaceValue, undefined, folders[0].uri);
			}
		}
	}
	return settings;
}

function getSchemaId(schema: JSONSchemaSettings, settingsLocation?: Uri): string | undefined {
	let url = schema.url;
	if (!url) {
		if (schema.schema) {
			url = schema.schema.id || `vscode://schemas/custom/${encodeURIComponent(hash(schema.schema).toString(16))}`;
		}
	} else if (settingsLocation && (url[0] === '.' || url[0] === '/')) {
		url = Uri.joinPath(settingsLocation, url).toString(false);
	}
	return url;
}

function isThenable<T>(obj: unknown): obj is Thenable<T> {
	return !!obj && typeof (obj as unknown as Thenable<T>).then === 'function';
}

function updateMarkdownString(h: MarkdownString): MarkdownString {
	const n = new MarkdownString(h.value, true);
	n.isTrusted = h.isTrusted;
	return n;
}

function isSchemaResolveError(d: Diagnostic) {
	return d.code === /* SchemaResolveError */ 0x300;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/client/src/languageParticipants.ts]---
Location: vscode-main/extensions/json-language-features/client/src/languageParticipants.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event, EventEmitter, extensions } from 'vscode';

/**
 * JSON language participant contribution.
 */
interface LanguageParticipantContribution {
	/**
	 * The id of the language which participates with the JSON language server.
	 */
	languageId: string;
	/**
	 * true if the language allows comments and false otherwise.
	 * TODO: implement server side setting
	 */
	comments?: boolean;
}

export interface LanguageParticipants {
	readonly onDidChange: Event<void>;
	readonly documentSelector: string[];
	hasLanguage(languageId: string): boolean;
	useComments(languageId: string): boolean;
	dispose(): void;
}

export function getLanguageParticipants(): LanguageParticipants {
	const onDidChangeEmmiter = new EventEmitter<void>();
	let languages = new Set<string>();
	let comments = new Set<string>();

	function update() {
		const oldLanguages = languages, oldComments = comments;

		languages = new Set();
		languages.add('json');
		languages.add('jsonc');
		languages.add('snippets');
		comments = new Set();
		comments.add('jsonc');
		comments.add('snippets');

		for (const extension of extensions.allAcrossExtensionHosts) {
			const jsonLanguageParticipants = extension.packageJSON?.contributes?.jsonLanguageParticipants as LanguageParticipantContribution[];
			if (Array.isArray(jsonLanguageParticipants)) {
				for (const jsonLanguageParticipant of jsonLanguageParticipants) {
					const languageId = jsonLanguageParticipant.languageId;
					if (typeof languageId === 'string') {
						languages.add(languageId);
						if (jsonLanguageParticipant.comments === true) {
							comments.add(languageId);
						}
					}
				}
			}
		}
		return !isEqualSet(languages, oldLanguages) || !isEqualSet(comments, oldComments);
	}
	update();

	const changeListener = extensions.onDidChange(_ => {
		if (update()) {
			onDidChangeEmmiter.fire();
		}
	});

	return {
		onDidChange: onDidChangeEmmiter.event,
		get documentSelector() { return Array.from(languages); },
		hasLanguage(languageId: string) { return languages.has(languageId); },
		useComments(languageId: string) { return comments.has(languageId); },
		dispose: () => changeListener.dispose()
	};
}

function isEqualSet<T>(s1: Set<T>, s2: Set<T>) {
	if (s1.size !== s2.size) {
		return false;
	}
	for (const e of s1) {
		if (!s2.has(e)) {
			return false;
		}
	}
	return true;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/client/src/languageStatus.ts]---
Location: vscode-main/extensions/json-language-features/client/src/languageStatus.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
	window, languages, Uri, Disposable, commands, QuickPickItem,
	extensions, workspace, Extension, WorkspaceFolder, QuickPickItemKind,
	ThemeIcon, TextDocument, LanguageStatusSeverity, l10n, DocumentSelector
} from 'vscode';
import { JSONLanguageStatus, JSONSchemaSettings } from './jsonClient';

type ShowSchemasInput = {
	schemas: string[];
	uri: string;
};

interface ShowSchemasItem extends QuickPickItem {
	uri?: Uri;
	buttonCommands?: (() => void)[];
}

function getExtensionSchemaAssociations() {
	const associations: { fullUri: string; extension: Extension<any>; label: string }[] = [];

	for (const extension of extensions.all) {
		const jsonValidations = extension.packageJSON?.contributes?.jsonValidation;
		if (Array.isArray(jsonValidations)) {
			for (const jsonValidation of jsonValidations) {
				let uri = jsonValidation.url;
				if (typeof uri === 'string') {
					if (uri[0] === '.' && uri[1] === '/') {
						uri = Uri.joinPath(extension.extensionUri, uri).toString(false);
					}
					associations.push({ fullUri: uri, extension, label: jsonValidation.url });
				}
			}
		}
	}
	return {
		findExtension(uri: string): ShowSchemasItem | undefined {
			for (const association of associations) {
				if (association.fullUri === uri) {
					return {
						label: association.label,
						detail: l10n.t('Configured by extension: {0}', association.extension.id),
						uri: Uri.parse(association.fullUri),
						buttons: [{ iconPath: new ThemeIcon('extensions'), tooltip: l10n.t('Open Extension') }],
						buttonCommands: [() => commands.executeCommand('workbench.extensions.action.showExtensionsWithIds', [[association.extension.id]])]
					};
				}
			}
			return undefined;
		}
	};
}

//

function getSettingsSchemaAssociations(uri: string) {
	const resourceUri = Uri.parse(uri);
	const workspaceFolder = workspace.getWorkspaceFolder(resourceUri);

	const settings = workspace.getConfiguration('json', resourceUri).inspect<JSONSchemaSettings[]>('schemas');

	const associations: { fullUri: string; workspaceFolder: WorkspaceFolder | undefined; label: string }[] = [];

	const folderSettingSchemas = settings?.workspaceFolderValue;
	if (workspaceFolder && Array.isArray(folderSettingSchemas)) {
		for (const setting of folderSettingSchemas) {
			const uri = setting.url;
			if (typeof uri === 'string') {
				let fullUri = uri;
				if (uri[0] === '.' && uri[1] === '/') {
					fullUri = Uri.joinPath(workspaceFolder.uri, uri).toString(false);
				}
				associations.push({ fullUri, workspaceFolder, label: uri });
			}
		}
	}
	const userSettingSchemas = settings?.globalValue;
	if (Array.isArray(userSettingSchemas)) {
		for (const setting of userSettingSchemas) {
			const uri = setting.url;
			if (typeof uri === 'string') {
				let fullUri = uri;
				if (workspaceFolder && uri[0] === '.' && uri[1] === '/') {
					fullUri = Uri.joinPath(workspaceFolder.uri, uri).toString(false);
				}
				associations.push({ fullUri, workspaceFolder: undefined, label: uri });
			}
		}
	}
	return {
		findSetting(uri: string): ShowSchemasItem | undefined {
			for (const association of associations) {
				if (association.fullUri === uri) {
					return {
						label: association.label,
						detail: association.workspaceFolder ? l10n.t('Configured in workspace settings') : l10n.t('Configured in user settings'),
						uri: Uri.parse(association.fullUri),
						buttons: [{ iconPath: new ThemeIcon('gear'), tooltip: l10n.t('Open Settings') }],
						buttonCommands: [() => commands.executeCommand(association.workspaceFolder ? 'workbench.action.openWorkspaceSettingsFile' : 'workbench.action.openSettingsJson', ['json.schemas'])]
					};
				}
			}
			return undefined;
		}
	};
}

function showSchemaList(input: ShowSchemasInput) {

	const extensionSchemaAssocations = getExtensionSchemaAssociations();
	const settingsSchemaAssocations = getSettingsSchemaAssociations(input.uri);

	const extensionEntries = [];
	const settingsEntries = [];
	const otherEntries = [];

	for (const schemaUri of input.schemas) {
		const extensionEntry = extensionSchemaAssocations.findExtension(schemaUri);
		if (extensionEntry) {
			extensionEntries.push(extensionEntry);
			continue;
		}
		const settingsEntry = settingsSchemaAssocations.findSetting(schemaUri);
		if (settingsEntry) {
			settingsEntries.push(settingsEntry);
			continue;
		}
		otherEntries.push({ label: schemaUri, uri: Uri.parse(schemaUri) });
	}

	const items: ShowSchemasItem[] = [...extensionEntries, ...settingsEntries, ...otherEntries];
	if (items.length === 0) {
		items.push({
			label: l10n.t('No schema configured for this file'),
			buttons: [{ iconPath: new ThemeIcon('gear'), tooltip: l10n.t('Open Settings') }],
			buttonCommands: [() => commands.executeCommand('workbench.action.openSettingsJson', ['json.schemas'])]
		});
	}

	items.push({ label: '', kind: QuickPickItemKind.Separator });
	items.push({ label: l10n.t('Learn more about JSON schema configuration...'), uri: Uri.parse('https://code.visualstudio.com/docs/languages/json#_json-schemas-and-settings') });

	const quickPick = window.createQuickPick<ShowSchemasItem>();
	quickPick.placeholder = items.length ? l10n.t('Select the schema to use for {0}', input.uri) : undefined;
	quickPick.items = items;
	quickPick.show();
	quickPick.onDidAccept(() => {
		const uri = quickPick.selectedItems[0].uri;
		if (uri) {
			commands.executeCommand('vscode.open', uri);
			quickPick.dispose();
		}
	});
	quickPick.onDidTriggerItemButton(b => {
		const index = b.item.buttons?.indexOf(b.button);
		if (index !== undefined && index >= 0 && b.item.buttonCommands && b.item.buttonCommands[index]) {
			b.item.buttonCommands[index]();
		}
	});
}

export function createLanguageStatusItem(documentSelector: DocumentSelector, statusRequest: (uri: string) => Promise<JSONLanguageStatus>): Disposable {
	const statusItem = languages.createLanguageStatusItem('json.projectStatus', documentSelector);
	statusItem.name = l10n.t('JSON Validation Status');
	statusItem.severity = LanguageStatusSeverity.Information;

	const showSchemasCommand = commands.registerCommand('_json.showAssociatedSchemaList', showSchemaList);

	const activeEditorListener = window.onDidChangeActiveTextEditor(() => {
		updateLanguageStatus();
	});

	async function updateLanguageStatus() {
		const document = window.activeTextEditor?.document;
		if (document) {
			try {
				statusItem.text = '$(loading~spin)';
				statusItem.detail = l10n.t('Loading JSON info');
				statusItem.command = undefined;

				const schemas = (await statusRequest(document.uri.toString())).schemas;
				statusItem.detail = undefined;
				if (schemas.length === 0) {
					statusItem.text = l10n.t('No schema validation');
					statusItem.detail = l10n.t('no JSON schema configured');
				} else if (schemas.length === 1) {
					statusItem.text = l10n.t('Schema validated');
					statusItem.detail = l10n.t('JSON schema configured');
				} else {
					statusItem.text = l10n.t('Schema validated');
					statusItem.detail = l10n.t('multiple JSON schemas configured');
				}
				statusItem.command = {
					command: '_json.showAssociatedSchemaList',
					title: l10n.t('Show Schemas'),
					arguments: [{ schemas, uri: document.uri.toString() } satisfies ShowSchemasInput]
				};
			} catch (e) {
				statusItem.text = l10n.t('Unable to compute used schemas: {0}', e.message);
				statusItem.detail = undefined;
				statusItem.command = undefined;
			}
		} else {
			statusItem.text = l10n.t('Unable to compute used schemas: No document');
			statusItem.detail = undefined;
			statusItem.command = undefined;
		}
	}

	updateLanguageStatus();

	return Disposable.from(statusItem, activeEditorListener, showSchemasCommand);
}

export function createLimitStatusItem(newItem: (limit: number) => Disposable) {
	let statusItem: Disposable | undefined;
	const activeLimits: Map<TextDocument, number> = new Map();

	const toDispose: Disposable[] = [];
	toDispose.push(window.onDidChangeActiveTextEditor(textEditor => {
		statusItem?.dispose();
		statusItem = undefined;
		const doc = textEditor?.document;
		if (doc) {
			const limit = activeLimits.get(doc);
			if (limit !== undefined) {
				statusItem = newItem(limit);
			}
		}
	}));
	toDispose.push(workspace.onDidCloseTextDocument(document => {
		activeLimits.delete(document);
	}));

	function update(document: TextDocument, limitApplied: number | false) {
		if (limitApplied === false) {
			activeLimits.delete(document);
			if (statusItem && document === window.activeTextEditor?.document) {
				statusItem.dispose();
				statusItem = undefined;
			}
		} else {
			activeLimits.set(document, limitApplied);
			if (document === window.activeTextEditor?.document) {
				if (!statusItem || limitApplied !== activeLimits.get(document)) {
					statusItem?.dispose();
					statusItem = newItem(limitApplied);
				}
			}
		}
	}
	return {
		update,
		dispose() {
			statusItem?.dispose();
			toDispose.forEach(d => d.dispose());
			toDispose.length = 0;
			statusItem = undefined;
			activeLimits.clear();
		}
	};
}

const openSettingsCommand = 'workbench.action.openSettings';
const configureSettingsLabel = l10n.t('Configure');

export function createDocumentSymbolsLimitItem(documentSelector: DocumentSelector, settingId: string, limit: number): Disposable {
	const statusItem = languages.createLanguageStatusItem('json.documentSymbolsStatus', documentSelector);
	statusItem.name = l10n.t('JSON Outline Status');
	statusItem.severity = LanguageStatusSeverity.Warning;
	statusItem.text = l10n.t('Outline');
	statusItem.detail = l10n.t('only {0} document symbols shown for performance reasons', limit);
	statusItem.command = { command: openSettingsCommand, arguments: [settingId], title: configureSettingsLabel };
	return Disposable.from(statusItem);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/client/src/browser/jsonClientMain.ts]---
Location: vscode-main/extensions/json-language-features/client/src/browser/jsonClientMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, ExtensionContext, Uri, l10n, window } from 'vscode';
import { LanguageClientOptions } from 'vscode-languageclient';
import { startClient, LanguageClientConstructor, SchemaRequestService, AsyncDisposable, languageServerDescription } from '../jsonClient';
import { LanguageClient } from 'vscode-languageclient/browser';

let client: AsyncDisposable | undefined;

// this method is called when vs code is activated
export async function activate(context: ExtensionContext) {
	const serverMain = Uri.joinPath(context.extensionUri, 'server/dist/browser/jsonServerMain.js');
	try {
		const worker = new Worker(serverMain.toString());
		worker.postMessage({ i10lLocation: l10n.uri?.toString(false) ?? '' });

		const newLanguageClient: LanguageClientConstructor = (id: string, name: string, clientOptions: LanguageClientOptions) => {
			return new LanguageClient(id, name, worker, clientOptions);
		};

		const schemaRequests: SchemaRequestService = {
			getContent(uri: string) {
				return fetch(uri, { mode: 'cors' })
					.then(function (response: any) {
						return response.text();
					});
			}
		};

		const timer = {
			setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable {
				const handle = setTimeout(callback, ms, ...args);
				return { dispose: () => clearTimeout(handle) };
			}
		};

		const logOutputChannel = window.createOutputChannel(languageServerDescription, { log: true });
		context.subscriptions.push(logOutputChannel);

		client = await startClient(context, newLanguageClient, { schemaRequests, timer, logOutputChannel });

	} catch (e) {
		console.log(e);
	}
}

export async function deactivate(): Promise<void> {
	if (client) {
		await client.dispose();
		client = undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/client/src/node/jsonClientMain.ts]---
Location: vscode-main/extensions/json-language-features/client/src/node/jsonClientMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, ExtensionContext, LogOutputChannel, window, l10n, env, LogLevel } from 'vscode';
import { startClient, LanguageClientConstructor, SchemaRequestService, languageServerDescription, AsyncDisposable } from '../jsonClient';
import { ServerOptions, TransportKind, LanguageClientOptions, LanguageClient } from 'vscode-languageclient/node';

import { promises as fs } from 'fs';
import * as path from 'path';
import { xhr, XHRResponse, getErrorStatusDescription, Headers } from 'request-light';

import TelemetryReporter from '@vscode/extension-telemetry';
import { JSONSchemaCache } from './schemaCache';

let client: AsyncDisposable | undefined;

// this method is called when vs code is activated
export async function activate(context: ExtensionContext) {
	const clientPackageJSON = await getPackageInfo(context);
	const telemetry = new TelemetryReporter(clientPackageJSON.aiKey);
	context.subscriptions.push(telemetry);

	const logOutputChannel = window.createOutputChannel(languageServerDescription, { log: true });
	context.subscriptions.push(logOutputChannel);

	const serverMain = `./server/${clientPackageJSON.main.indexOf('/dist/') !== -1 ? 'dist' : 'out'}/node/jsonServerMain`;
	const serverModule = context.asAbsolutePath(serverMain);

	// The debug options for the server
	const debugOptions = { execArgv: ['--nolazy', '--inspect=' + (6000 + Math.round(Math.random() * 999))] };

	// If the extension is launch in debug mode the debug server options are use
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
	};

	const newLanguageClient: LanguageClientConstructor = (id: string, name: string, clientOptions: LanguageClientOptions) => {
		return new LanguageClient(id, name, serverOptions, clientOptions);
	};

	const timer = {
		setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable {
			const handle = setTimeout(callback, ms, ...args);
			return { dispose: () => clearTimeout(handle) };
		}
	};

	// pass the location of the localization bundle to the server
	process.env['VSCODE_L10N_BUNDLE_LOCATION'] = l10n.uri?.toString() ?? '';

	const schemaRequests = await getSchemaRequestService(context, logOutputChannel);

	client = await startClient(context, newLanguageClient, { schemaRequests, telemetry, timer, logOutputChannel });
}

export async function deactivate(): Promise<any> {
	if (client) {
		await client.dispose();
		client = undefined;
	}
}

interface IPackageInfo {
	name: string;
	version: string;
	aiKey: string;
	main: string;
}

async function getPackageInfo(context: ExtensionContext): Promise<IPackageInfo> {
	const location = context.asAbsolutePath('./package.json');
	try {
		return JSON.parse((await fs.readFile(location)).toString());
	} catch (e) {
		console.log(`Problems reading ${location}: ${e}`);
		return { name: '', version: '', aiKey: '', main: '' };
	}
}

const retryTimeoutInHours = 2 * 24; // 2 days

async function getSchemaRequestService(context: ExtensionContext, log: LogOutputChannel): Promise<SchemaRequestService> {
	let cache: JSONSchemaCache | undefined = undefined;
	const globalStorage = context.globalStorageUri;

	let clearCache: (() => Promise<string[]>) | undefined;
	if (globalStorage.scheme === 'file') {
		const schemaCacheLocation = path.join(globalStorage.fsPath, 'json-schema-cache');
		await fs.mkdir(schemaCacheLocation, { recursive: true });

		const schemaCache = new JSONSchemaCache(schemaCacheLocation, context.globalState);
		log.trace(`[json schema cache] initial state: ${JSON.stringify(schemaCache.getCacheInfo(), null, ' ')}`);
		cache = schemaCache;
		clearCache = async () => {
			const cachedSchemas = await schemaCache.clearCache();
			log.trace(`[json schema cache] cache cleared. Previously cached schemas: ${cachedSchemas.join(', ')}`);
			return cachedSchemas;
		};
	}


	const isXHRResponse = (error: any): error is XHRResponse => typeof error?.status === 'number';

	const request = async (uri: string, etag?: string): Promise<string> => {
		const headers: Headers = {
			'Accept-Encoding': 'gzip, deflate',
			'User-Agent': `${env.appName} (${env.appHost})`
		};
		if (etag) {
			headers['If-None-Match'] = etag;
		}
		try {
			log.trace(`[json schema cache] Requesting schema ${uri} etag ${etag}...`);

			const response = await xhr({ url: uri, followRedirects: 5, headers });
			if (cache) {
				const etag = response.headers['etag'];
				if (typeof etag === 'string') {
					log.trace(`[json schema cache] Storing schema ${uri} etag ${etag} in cache`);
					await cache.putSchema(uri, etag, response.responseText);
				} else {
					log.trace(`[json schema cache] Response: schema ${uri} no etag`);
				}
			}
			return response.responseText;
		} catch (error: unknown) {
			if (isXHRResponse(error)) {
				if (error.status === 304 && etag && cache) {

					log.trace(`[json schema cache] Response: schema ${uri} unchanged etag ${etag}`);

					const content = await cache.getSchema(uri, etag, true);
					if (content) {
						log.trace(`[json schema cache] Get schema ${uri} etag ${etag} from cache`);
						return content;
					}
					return request(uri);
				}

				let status = getErrorStatusDescription(error.status);
				if (status && error.responseText) {
					status = `${status}\n${error.responseText.substring(0, 200)}`;
				}
				if (!status) {
					status = error.toString();
				}
				log.trace(`[json schema cache] Respond schema ${uri} error ${status}`);

				throw status;
			}
			throw error;
		}
	};

	return {
		getContent: async (uri: string) => {
			if (cache && /^https?:\/\/(json|www)\.schemastore\.org\//.test(uri)) {
				const content = await cache.getSchemaIfUpdatedSince(uri, retryTimeoutInHours);
				if (content) {
					if (log.logLevel === LogLevel.Trace) {
						log.trace(`[json schema cache] Schema ${uri} from cache without request (last accessed ${cache.getLastUpdatedInHours(uri)} hours ago)`);
					}

					return content;
				}
			}
			return request(uri, cache?.getETag(uri));
		},
		clearCache
	};
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/client/src/node/schemaCache.ts]---
Location: vscode-main/extensions/json-language-features/client/src/node/schemaCache.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { promises as fs } from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import { Memento } from 'vscode';

interface CacheEntry {
	etag: string;
	fileName: string;
	updateTime: number;
}

interface CacheInfo {
	[schemaUri: string]: CacheEntry;
}

const MEMENTO_KEY = 'json-schema-cache';

export class JSONSchemaCache {
	private cacheInfo: CacheInfo;

	constructor(private readonly schemaCacheLocation: string, private readonly globalState: Memento) {
		const infos = globalState.get<CacheInfo>(MEMENTO_KEY, {}) as CacheInfo;
		const validated: CacheInfo = {};
		for (const schemaUri in infos) {
			const { etag, fileName, updateTime } = infos[schemaUri];
			if (typeof etag === 'string' && typeof fileName === 'string' && typeof updateTime === 'number') {
				validated[schemaUri] = { etag, fileName, updateTime };
			}
		}
		this.cacheInfo = validated;
	}

	getETag(schemaUri: string): string | undefined {
		return this.cacheInfo[schemaUri]?.etag;
	}

	getLastUpdatedInHours(schemaUri: string): number | undefined {
		const updateTime = this.cacheInfo[schemaUri]?.updateTime;
		if (updateTime !== undefined) {
			return (new Date().getTime() - updateTime) / 1000 / 60 / 60;
		}
		return undefined;
	}

	async putSchema(schemaUri: string, etag: string, schemaContent: string): Promise<void> {
		try {
			const fileName = getCacheFileName(schemaUri);
			await fs.writeFile(path.join(this.schemaCacheLocation, fileName), schemaContent);
			const entry: CacheEntry = { etag, fileName, updateTime: new Date().getTime() };
			this.cacheInfo[schemaUri] = entry;
		} catch (e) {
			delete this.cacheInfo[schemaUri];
		} finally {
			await this.updateMemento();
		}
	}

	async getSchemaIfUpdatedSince(schemaUri: string, expirationDurationInHours: number): Promise<string | undefined> {
		const lastUpdatedInHours = this.getLastUpdatedInHours(schemaUri);
		if (lastUpdatedInHours !== undefined && (lastUpdatedInHours < expirationDurationInHours)) {
			return this.loadSchemaFile(schemaUri, this.cacheInfo[schemaUri], false);
		}
		return undefined;
	}

	async getSchema(schemaUri: string, etag: string, etagValid: boolean): Promise<string | undefined> {
		const cacheEntry = this.cacheInfo[schemaUri];
		if (cacheEntry) {
			if (cacheEntry.etag === etag) {
				return this.loadSchemaFile(schemaUri, cacheEntry, etagValid);
			} else {
				this.deleteSchemaFile(schemaUri, cacheEntry);
			}
		}
		return undefined;
	}

	private async loadSchemaFile(schemaUri: string, cacheEntry: CacheEntry, isUpdated: boolean): Promise<string | undefined> {
		const cacheLocation = path.join(this.schemaCacheLocation, cacheEntry.fileName);
		try {
			const content = (await fs.readFile(cacheLocation)).toString();
			if (isUpdated) {
				cacheEntry.updateTime = new Date().getTime();
			}
			return content;
		} catch (e) {
			delete this.cacheInfo[schemaUri];
			return undefined;
		} finally {
			await this.updateMemento();
		}
	}

	private async deleteSchemaFile(schemaUri: string, cacheEntry: CacheEntry): Promise<void> {
		const cacheLocation = path.join(this.schemaCacheLocation, cacheEntry.fileName);
		delete this.cacheInfo[schemaUri];
		await this.updateMemento();
		try {
			await fs.rm(cacheLocation);
		} catch (e) {
			// ignore
		}
	}


	// for debugging
	public getCacheInfo() {
		return this.cacheInfo;
	}

	private async updateMemento() {
		try {
			await this.globalState.update(MEMENTO_KEY, this.cacheInfo);
		} catch (e) {
			// ignore
		}
	}

	public async clearCache(): Promise<string[]> {
		const uris = Object.keys(this.cacheInfo);
		try {
			const files = await fs.readdir(this.schemaCacheLocation);
			for (const file of files) {
				try {
					await fs.unlink(path.join(this.schemaCacheLocation, file));
				} catch (_e) {
					// ignore
				}
			}
		} catch (e) {
			// ignore
		} finally {

			this.cacheInfo = {};
			await this.updateMemento();
		}
		return uris;
	}
}
function getCacheFileName(uri: string): string {
	return `${createHash('sha256').update(uri).digest('hex')}.schema.json`;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/client/src/utils/hash.ts]---
Location: vscode-main/extensions/json-language-features/client/src/utils/hash.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Return a hash value for an object.
 */
export function hash(obj: any, hashVal = 0): number {
	switch (typeof obj) {
		case 'object':
			if (obj === null) {
				return numberHash(349, hashVal);
			} else if (Array.isArray(obj)) {
				return arrayHash(obj, hashVal);
			}
			return objectHash(obj, hashVal);
		case 'string':
			return stringHash(obj, hashVal);
		case 'boolean':
			return booleanHash(obj, hashVal);
		case 'number':
			return numberHash(obj, hashVal);
		case 'undefined':
			return 937 * 31;
		default:
			return numberHash(obj, 617);
	}
}

function numberHash(val: number, initialHashVal: number): number {
	return (((initialHashVal << 5) - initialHashVal) + val) | 0;  // hashVal * 31 + ch, keep as int32
}

function booleanHash(b: boolean, initialHashVal: number): number {
	return numberHash(b ? 433 : 863, initialHashVal);
}

function stringHash(s: string, hashVal: number) {
	hashVal = numberHash(149417, hashVal);
	for (let i = 0, length = s.length; i < length; i++) {
		hashVal = numberHash(s.charCodeAt(i), hashVal);
	}
	return hashVal;
}

function arrayHash(arr: any[], initialHashVal: number): number {
	initialHashVal = numberHash(104579, initialHashVal);
	return arr.reduce((hashVal, item) => hash(item, hashVal), initialHashVal);
}

function objectHash(obj: any, initialHashVal: number): number {
	initialHashVal = numberHash(181387, initialHashVal);
	return Object.keys(obj).sort().reduce((hashVal, key) => {
		hashVal = stringHash(key, hashVal);
		return hash(obj[key], hashVal);
	}, initialHashVal);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/server/.npmignore]---
Location: vscode-main/extensions/json-language-features/server/.npmignore

```text
.vscode/
out/test/
out/**/*.js.map
src/
test/
tsconfig.json
.gitignore
package-lock.json
extension.webpack.config.js
vscode-json-languageserver-*.tgz
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/server/.npmrc]---
Location: vscode-main/extensions/json-language-features/server/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/server/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/json-language-features/server/extension-browser.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import { browser as withBrowserDefaults } from '../../shared.webpack.config.mjs';
import path from 'path';

export default withBrowserDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/browser/jsonServerWorkerMain.ts',
	},
	output: {
		filename: 'jsonServerMain.js',
		path: path.join(import.meta.dirname, 'dist', 'browser'),
		libraryTarget: 'var',
		library: 'serverExportVar'
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/server/extension.webpack.config.js]---
Location: vscode-main/extensions/json-language-features/server/extension.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import withDefaults from '../../shared.webpack.config.mjs';
import path from 'path';

const config = withDefaults({
	context: path.join(import.meta.dirname),
	entry: {
		extension: './src/node/jsonServerNodeMain.ts',
	},
	output: {
		filename: 'jsonServerMain.js',
		path: path.join(import.meta.dirname, 'dist', 'node'),
	}
});

export default config;
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/server/package-lock.json]---
Location: vscode-main/extensions/json-language-features/server/package-lock.json

```json
{
  "name": "vscode-json-languageserver",
  "version": "1.3.4",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "vscode-json-languageserver",
      "version": "1.3.4",
      "license": "MIT",
      "dependencies": {
        "@vscode/l10n": "^0.0.18",
        "jsonc-parser": "^3.3.1",
        "request-light": "^0.8.0",
        "vscode-json-languageservice": "^5.6.4",
        "vscode-languageserver": "^10.0.0-next.15",
        "vscode-uri": "^3.1.0"
      },
      "bin": {
        "vscode-json-languageserver": "bin/vscode-json-languageserver"
      },
      "devDependencies": {
        "@types/mocha": "^10.0.10",
        "@types/node": "22.x"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/@types/mocha": {
      "version": "10.0.10",
      "resolved": "https://registry.npmjs.org/@types/mocha/-/mocha-10.0.10.tgz",
      "integrity": "sha512-xPyYSz1cMPnJQhl0CLMH68j3gprKZaTjG3s5Vi+fDgx+uhG9NOXwbVt52eFS8ECyXhyKcjDLCBEqBExKuiZb7Q==",
      "dev": true,
      "license": "MIT"
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
    "node_modules/@vscode/l10n": {
      "version": "0.0.18",
      "resolved": "https://registry.npmjs.org/@vscode/l10n/-/l10n-0.0.18.tgz",
      "integrity": "sha512-KYSIHVmslkaCDyw013pphY+d7x1qV8IZupYfeIfzNA+nsaWHbn5uPuQRvdRFsa9zFzGeudPuoGoZ1Op4jrJXIQ=="
    },
    "node_modules/jsonc-parser": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/jsonc-parser/-/jsonc-parser-3.3.1.tgz",
      "integrity": "sha512-HUgH65KyejrUFPvHFPbqOY0rsFip3Bo5wb4ngvdi1EpCYWUQDC5V+Y7mZws+DLkr4M//zQJoanu1SP+87Dv1oQ=="
    },
    "node_modules/request-light": {
      "version": "0.8.0",
      "resolved": "https://registry.npmjs.org/request-light/-/request-light-0.8.0.tgz",
      "integrity": "sha512-bH6E4PMmsEXYrLX6Kr1vu+xI3HproB1vECAwaPSJeroLE1kpWE3HR27uB4icx+6YORu1ajqBJXxuedv8ZQg5Lw=="
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/vscode-json-languageservice": {
      "version": "5.6.4",
      "resolved": "https://registry.npmjs.org/vscode-json-languageservice/-/vscode-json-languageservice-5.6.4.tgz",
      "integrity": "sha512-i0MhkFmnQAbYr+PiE6Th067qa3rwvvAErCEUo0ql+ghFXHvxbwG3kLbwMaIUrrbCLUDEeULiLgROJjtuyYoIsA==",
      "license": "MIT",
      "dependencies": {
        "@vscode/l10n": "^0.0.18",
        "jsonc-parser": "^3.3.1",
        "vscode-languageserver-textdocument": "^1.0.12",
        "vscode-languageserver-types": "^3.17.5",
        "vscode-uri": "^3.1.0"
      }
    },
    "node_modules/vscode-jsonrpc": {
      "version": "9.0.0-next.10",
      "resolved": "https://registry.npmjs.org/vscode-jsonrpc/-/vscode-jsonrpc-9.0.0-next.10.tgz",
      "integrity": "sha512-P+UOjuG/B1zkLM+bGIdmBwSkDejxtgo6EjG0pIkwnFBI0a2Mb7od36uUu8CPbECeQuh+n3zGcNwDl16DhuJ5IA==",
      "license": "MIT",
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/vscode-languageserver": {
      "version": "10.0.0-next.15",
      "resolved": "https://registry.npmjs.org/vscode-languageserver/-/vscode-languageserver-10.0.0-next.15.tgz",
      "integrity": "sha512-vs+bwci/lM83ZhrR9t8DcZ2AgS2CKx4i6Yw86teKKkqlzlrYWTixuBd9w6H/UP9s8EGBvii0jnbjQd6wsKJ0ig==",
      "license": "MIT",
      "dependencies": {
        "vscode-languageserver-protocol": "3.17.6-next.15"
      },
      "bin": {
        "installServerIntoExtension": "bin/installServerIntoExtension"
      }
    },
    "node_modules/vscode-languageserver-protocol": {
      "version": "3.17.6-next.15",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-protocol/-/vscode-languageserver-protocol-3.17.6-next.15.tgz",
      "integrity": "sha512-aoWX1wwGCndzfrTRhGKVpKAPVy9+WYhUtZW/PJQfHODmVwhVwb4we68CgsQZRTl36t8ZqlSOO2c2TdBPW7hrCw==",
      "license": "MIT",
      "dependencies": {
        "vscode-jsonrpc": "9.0.0-next.10",
        "vscode-languageserver-types": "3.17.6-next.6"
      }
    },
    "node_modules/vscode-languageserver-protocol/node_modules/vscode-languageserver-types": {
      "version": "3.17.6-next.6",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-types/-/vscode-languageserver-types-3.17.6-next.6.tgz",
      "integrity": "sha512-aiJY5/yW+xzw7KPNlwi3gQtddq/3EIn5z8X8nCgJfaiAij2R1APKePngv+MUdLdYJBVTLu+Qa0ODsT+pHgYguQ==",
      "license": "MIT"
    },
    "node_modules/vscode-languageserver-textdocument": {
      "version": "1.0.12",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-textdocument/-/vscode-languageserver-textdocument-1.0.12.tgz",
      "integrity": "sha512-cxWNPesCnQCcMPeenjKKsOCKQZ/L6Tv19DTRIGuLWe32lyzWhihGVJ/rcckZXJxfdKCFvRLS3fpBIsV/ZGX4zA=="
    },
    "node_modules/vscode-languageserver-types": {
      "version": "3.17.5",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-types/-/vscode-languageserver-types-3.17.5.tgz",
      "integrity": "sha512-Ld1VelNuX9pdF39h2Hgaeb5hEZM2Z3jUrrMgWQAu82jMtZp7p3vJT3BzToKtZI7NgQssZje5o0zryOrhQvzQAg=="
    },
    "node_modules/vscode-uri": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/vscode-uri/-/vscode-uri-3.1.0.tgz",
      "integrity": "sha512-/BpdSx+yCQGnCvecbyXdxHDkuk55/G3xwnC0GqY4gmQ3j+A+g8kzzgB4Nk/SINjqn6+waqw3EgbVF2QKExkRxQ==",
      "license": "MIT"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/server/package.json]---
Location: vscode-main/extensions/json-language-features/server/package.json

```json
{
  "name": "vscode-json-languageserver",
  "description": "JSON language server",
  "version": "1.3.4",
  "author": "Microsoft Corporation",
  "license": "MIT",
  "engines": {
    "node": "*"
  },
  "bin": {
    "vscode-json-languageserver": "./bin/vscode-json-languageserver"
  },
  "main": "./out/node/jsonServerMain",
  "dependencies": {
    "@vscode/l10n": "^0.0.18",
    "jsonc-parser": "^3.3.1",
    "request-light": "^0.8.0",
    "vscode-json-languageservice": "^5.6.4",
    "vscode-languageserver": "^10.0.0-next.15",
    "vscode-uri": "^3.1.0"
  },
  "devDependencies": {
    "@types/mocha": "^10.0.10",
    "@types/node": "22.x"
  },
  "scripts": {
    "prepublishOnly": "npm run clean && npm run compile",
    "compile": "npx gulp compile-extension:json-language-features-server",
    "watch": "npx gulp watch-extension:json-language-features-server",
    "clean": "../../../node_modules/.bin/rimraf out",
    "install-service-next": "npm install vscode-json-languageservice",
    "install-service-latest": "npm install vscode-json-languageservice",
    "install-service-local": "npm link vscode-json-languageservice",
    "install-server-next": "npm install vscode-languageserver@next",
    "install-server-local": "npm link vscode-languageserver-server",
    "version": "git commit -m \"JSON Language Server $npm_package_version\" package.json"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/server/README.md]---
Location: vscode-main/extensions/json-language-features/server/README.md

```markdown
# VSCode JSON Language Server

[![NPM Version](https://img.shields.io/npm/v/vscode-json-languageserver.svg)](https://npmjs.org/package/vscode-json-languageserver)
[![NPM Downloads](https://img.shields.io/npm/dm/vscode-json-languageserver.svg)](https://npmjs.org/package/vscode-json-languageserver)
[![NPM Version](https://img.shields.io/npm/l/vscode-json-languageserver.svg)](https://npmjs.org/package/vscode-json-languageserver)

The JSON Language server provides language-specific smarts for editing, validating and understanding JSON documents. It runs as a separate executable and implements the [language server protocol](https://microsoft.github.io/language-server-protocol/overview) to be connected by any code editor or IDE.

## Capabilities

### Server capabilities

The JSON language server supports requests on documents of language id `json` and `jsonc`.

- `json` documents are parsed and validated following the [JSON specification](https://tools.ietf.org/html/rfc7159).
- `jsonc` documents additionally accept single line (`//`) and multi-line comments (`/* ... */`). JSONC is a VSCode specific file format, intended for VSCode configuration files, without any aspirations to define a new common file format.

The server implements the following capabilities of the language server protocol:

- [Inline Suggestion](https://microsoft.github.io/language-server-protocol/specification#textDocument_completion) for JSON properties and values based on the document's [JSON schema](http://json-schema.org/) or based on existing properties and values used at other places in the document. JSON schemas are configured through the server configuration options.
- [Hover](https://microsoft.github.io/language-server-protocol/specification#textDocument_hover) for values based on descriptions in the document's [JSON schema](http://json-schema.org/).
- [Document Symbols](https://microsoft.github.io/language-server-protocol/specification#textDocument_documentSymbol) for quick navigation to properties in the document.
- [Document Colors](https://microsoft.github.io/language-server-protocol/specification#textDocument_documentColor) for showing color decorators on values representing colors and [Color Presentation](https://microsoft.github.io/language-server-protocol/specification#textDocument_colorPresentation) for color presentation information to support color pickers. The location of colors is defined by the document's [JSON schema](http://json-schema.org/). All values marked with `"format": "color-hex"` (VSCode specific, non-standard JSON Schema extension) are considered color values. The supported color formats are `#rgb[a]` and `#rrggbb[aa]`.
- [Code Formatting](https://microsoft.github.io/language-server-protocol/specification#textDocument_rangeFormatting) supporting ranges and formatting the whole document.
- [Folding Ranges](https://microsoft.github.io/language-server-protocol/specification#textDocument_foldingRange) for all folding ranges in the document.
- Semantic Selection for semantic selection for one or multiple cursor positions.
- [Goto Definition](https://microsoft.github.io/language-server-protocol/specification#textDocument_definition) for $ref references in JSON schemas
- [Diagnostics (Validation)](https://microsoft.github.io/language-server-protocol/specification#textDocument_publishDiagnostics) are pushed for all open documents
  - syntax errors
  - structural validation based on the document's [JSON schema](http://json-schema.org/).

In order to load JSON schemas, the JSON server uses NodeJS `http` and `fs` modules. For all other features, the JSON server only relies on the documents and settings provided by the client through the LSP.

### Client requirements

The JSON language server expects the client to only send requests and notifications for documents of language id `json` and `jsonc`.

The JSON language server has the following dependencies on the client's capabilities:

- Inline suggestion requires that the client capability has *snippetSupport*. If not supported by the client, the server will not offer the completion capability.
- Formatting support requires the client to support *dynamicRegistration* for *rangeFormatting*. If not supported by the client, the server will not offer the format capability.

## Configuration

### Initialization options

The client can send the following initialization options to the server:

- `provideFormatter: boolean | undefined`. If defined, the value defines whether the server provides the `documentRangeFormattingProvider` capability on initialization. If undefined, the setting `json.format.enable` is used to determine whether formatting is provided. The formatter will then be registered through dynamic registration. If the client does not support dynamic registration, no formatter will be available.
- `handledSchemaProtocols`: The URI schemas handles by the server. See section `Schema configuration` below.
- `customCapabilities`: Additional non-LSP client capabilities:
  - `rangeFormatting: { editLimit: x } }`: For performance reasons, limit the number of edits returned by the range formatter to `x`.

### Settings

Clients may send a `workspace/didChangeConfiguration` notification to notify the server of settings changes.
The server supports the following settings:

- http
  - `proxy`: The URL of the proxy server to use when fetching schema. When undefined or empty, no proxy is used.
  - `proxyStrictSSL`: Whether the proxy server certificate should be verified against the list of supplied CAs.

- json
  - `format`
    - `enable`: Whether the server should register the formatting support. This option is only applicable if the client supports *dynamicRegistration* for *rangeFormatting* and `initializationOptions.provideFormatter` is not defined.
  - `validate`
    - `enable`: Whether the server should validate. Defaults to `true` if not set.
  - `schemas`: Configures association of file names to schema URL or schemas and/or associations of schema URL to schema content.
    - `fileMatch`: an array of file names or paths (separated by `/`). `*` can be used as a wildcard. Exclusion patterns can also be defined and start with '!'. A file matches when there is at least one matching pattern and the last matching pattern is not an exclusion pattern.
    - `folderUri`: If provided, the association is only used if the document is located in the given folder (directly or in a subfolder)
    - `url`: The URL of the schema, optional when also a schema is provided.
    - `schema`: The schema content, optional
  - `resultLimit`: The max number of color decorators and outline symbols to be computed (for performance reasons)
  - `jsonFoldingLimit`: The max number of folding ranges to be computed for json documents (for performance reasons)
  - `jsoncFoldingLimit`: The max number of folding ranges to be computed for jsonc documents (for performance reasons)

```json
    {
        "http": {
            "proxy": "",
            "proxyStrictSSL": true
        },
        "json": {
            "format": {
                "enable": true
            },
            "schemas": [
                {
                    "fileMatch": [
                        "foo.json",
                        "*.superfoo.json"
                    ],
                    "url": "http://www.schemastore.org/foo",
                    "schema": {
                        "type": "array"
                    }
                }
            ]
        }
    }
```

### Schema configuration and custom schema content delivery

[JSON schemas](http://json-schema.org/) are essential for code assist, hovers, color decorators to work and are required for structural validation.

To find the schema for a given JSON document, the server uses the following mechanisms:

- JSON documents can define the schema URL using a `$schema` property
- The settings define a schema association based on the documents URL. Settings can either associate a schema URL to a file or path pattern, and they can directly provide a schema.
- Additionally, schema associations can also be provided by a custom 'schemaAssociations' configuration call.

Schemas are identified by URLs. To load the content of a schema, the JSON language server either tries to load from that URI or path itself or delegates to the client.

The `initializationOptions.handledSchemaProtocols` initialization option defines which URLs are handled by the server. Requests for all other URIs are sent to the client.

`handledSchemaProtocols` is part of the initialization options and can't be changed while the server is running.

```ts
let clientOptions: LanguageClientOptions = {
  initializationOptions: {
   handledSchemaProtocols: ['file'] // language server should only try to load file URLs
  }
        ...
}
```

If `handledSchemaProtocols` is not set, the JSON language server will load the following URLs itself:

- `http`, `https`: Loaded using NodeJS's HTTP support. Proxies can be configured through the settings.
- `file`: Loaded using NodeJS's `fs` support.

#### Schema content request

Requests for schemas with URLs not handled by the server are forwarded to the client through an LSP request. This request is a JSON language server-specific, non-standardized, extension to the LSP.

Request:

- method: 'vscode/content'
- params: `string` - The schema URL to request.
- response: `string` - The content of the schema with the given URL

#### Schema content change notification

When the client is aware that a schema content has changed, it will notify the server through a notification. This notification is a JSON language server-specific, non-standardized, extension to the LSP.
The server will, as a response, clear the schema content from the cache and reload the schema content when required again.

#### Schema associations notification

In addition to the settings, schemas associations can also be provided through a notification from the client to the server. This notification is a JSON language server-specific, non-standardized, extension to the LSP.

Notification:

- method: 'json/schemaAssociations'
- params: `ISchemaAssociations` or `ISchemaAssociation[]` defined as follows

```ts
interface ISchemaAssociations {
  /**
   * An object where:
   *  - keys are file names or file paths (using `/` as path separator). `*` can be used as a wildcard.
   *  - values are an arrays of schema URIs
   */
  [pattern: string]: string[];
}

interface ISchemaAssociation {
  /**
   * The URI of the schema, which is also the identifier of the schema.
   */
  uri: string;

  /**
   * A list of file path patterns that are associated to the schema. The '*' wildcard can be used. Exclusion patterns starting with '!'.
   * For example '*.schema.json', 'package.json', '!foo*.schema.json'.
   * A match succeeds when there is at least one pattern matching and last matching pattern does not start with '!'.
   */
  fileMatch: string[];
  /**
   * If provided, the association is only used if the validated document is located in the given folder (directly or in a subfolder)
   */
  folderUri?: string;
  /*
   * The schema for the given URI.
   * If no schema is provided, the schema will be fetched with the schema request service (if available).
   */
  schema?: JSONSchema;
}

```

`ISchemaAssociations`

- keys: a file names or file path (separated by `/`). `*` can be used as a wildcard.
- values: An array of schema URLs

Notification:

- method: 'json/schemaContent'
- params: `string` the URL of the schema that has changed.

### Item Limit

If the setting `resultLimit` is set, the JSON language server will limit the number of color symbols and document symbols computed.
If the setting `jsonFoldingLimit` or `jsoncFoldingLimit` is set, the JSON language server will limit the number of folding ranges computed.

## Try

The JSON language server is shipped with [Visual Studio Code](https://code.visualstudio.com/) as part of the built-in VSCode extension `json-language-features`. The server is started when the first JSON file is opened. The [VSCode JSON documentation](https://code.visualstudio.com/docs/languages/json) for detailed information on the user experience and has more information on how to configure the language support.

## Integrate

If you plan to integrate the JSON language server into an editor and IDE, check out [this page](https://microsoft.github.io/language-server-protocol/implementors/tools/) if there's already an LSP client integration available.

You can also launch the language server as a command and connect to it.
For that, install the `vscode-json-languageserver` npm module:

`npm install -g vscode-json-languageserver`

Start the language server with the `vscode-json-languageserver` command. Use a command line argument to specify the preferred communication channel:

```
vscode-json-languageserver --node-ipc
vscode-json-languageserver --stdio
vscode-json-languageserver --socket=<port>
```

To connect to the server from NodeJS, see Remy Suen's great write-up on [how to communicate with the server](https://github.com/rcjsuen/dockerfile-language-server-nodejs#communicating-with-the-server) through the available communication channels.

## Participate

The source code of the JSON language server can be found in the [VSCode repository](https://github.com/microsoft/vscode) at [extensions/json-language-features/server](https://github.com/microsoft/vscode/tree/master/extensions/json-language-features/server).

File issues and pull requests in the [VSCode GitHub Issues](https://github.com/microsoft/vscode/issues). See the document [How to Contribute](https://github.com/microsoft/vscode/wiki/How-to-Contribute) on how to build and run from source.

Most of the functionality of the server is located in libraries:

- [jsonc-parser](https://github.com/microsoft/node-jsonc-parser) contains the JSON parser and scanner.
- [vscode-json-languageservice](https://github.com/microsoft/vscode-json-languageservice) contains the implementation of all features as a re-usable library.
- [vscode-languageserver-node](https://github.com/microsoft/vscode-languageserver-node) contains the implementation of language server for NodeJS.

Help on any of these projects is very welcome.

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## License

Copyright (c) Microsoft Corporation. All rights reserved.

Licensed under the [MIT](https://github.com/microsoft/vscode/blob/master/LICENSE.txt) License.
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/server/tsconfig.json]---
Location: vscode-main/extensions/json-language-features/server/tsconfig.json

```json
{
	"extends": "../../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"sourceMap": true,
		"sourceRoot": "../src",
		"lib": [
			"ES2024",
			"WebWorker"
		],
		"module": "Node16",
		"typeRoots": [
			"../node_modules/@types"
		]
	},
	"include": [
		"src/**/*"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/server/.vscode/launch.json]---
Location: vscode-main/extensions/json-language-features/server/.vscode/launch.json

```json
{
	"version": "0.1.0",
	// List of configurations. Add new configurations or edit existing ones.
	"configurations": [
		{
			"name": "Attach",
			"type": "node",
			"request": "attach",
			"port": 6004,
			"sourceMaps": true,
			"outFiles": ["${workspaceFolder}/out/**/*js"],
			"preLaunchTask": "npm: compile"
		},
		{
			"name": "Unit Tests",
			"type": "node",
			"request": "launch",
			"program": "${workspaceFolder}/../../../node_modules/mocha/bin/_mocha",
			"stopOnEntry": false,
			"args": [
				"--timeout",
				"999999",
				"--colors"
			],
			"cwd": "${workspaceFolder}",
			"runtimeExecutable": null,
			"runtimeArgs": [],
			"env": {},
			"sourceMaps": true,
			"outFiles": ["${workspaceFolder}/out/**/*js"],
			"preLaunchTask": "npm: compile"
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/server/.vscode/tasks.json]---
Location: vscode-main/extensions/json-language-features/server/.vscode/tasks.json

```json
// See https://go.microsoft.com/fwlink/?LinkId=733558
// for the documentation about the tasks.json format
{
	"version": "2.0.0",
	"tasks": [
		{
			"type": "npm",
			"script": "compile",
			"problemMatcher": "$tsc-watch",
			"isBackground": true,
			"presentation": {
				"reveal": "never"
			},
			"group": {
				"kind": "build",
				"isDefault": true
			}
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/server/bin/vscode-json-languageserver]---
Location: vscode-main/extensions/json-language-features/server/bin/vscode-json-languageserver

```text
#!/usr/bin/env node
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
require('../out/node/jsonServerMain');
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/server/src/jsonServer.ts]---
Location: vscode-main/extensions/json-language-features/server/src/jsonServer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
	Connection,
	TextDocuments, InitializeParams, InitializeResult, NotificationType, RequestType,
	DocumentRangeFormattingRequest, Disposable, ServerCapabilities, TextDocumentSyncKind, TextEdit, DocumentFormattingRequest, TextDocumentIdentifier, FormattingOptions, Diagnostic, CodeAction, CodeActionKind
} from 'vscode-languageserver';

import { runSafe, runSafeAsync } from './utils/runner';
import { DiagnosticsSupport, registerDiagnosticsPullSupport, registerDiagnosticsPushSupport } from './utils/validation';
import { TextDocument, JSONDocument, JSONSchema, getLanguageService, DocumentLanguageSettings, SchemaConfiguration, ClientCapabilities, Range, Position, SortOptions } from 'vscode-json-languageservice';
import { getLanguageModelCache } from './languageModelCache';
import { Utils, URI } from 'vscode-uri';
import * as l10n from '@vscode/l10n';

type ISchemaAssociations = Record<string, string[]>;

type JSONLanguageStatus = { schemas: string[] };

namespace SchemaAssociationNotification {
	export const type: NotificationType<ISchemaAssociations | SchemaConfiguration[]> = new NotificationType('json/schemaAssociations');
}

namespace VSCodeContentRequest {
	export const type: RequestType<string, string, any> = new RequestType('vscode/content');
}

namespace SchemaContentChangeNotification {
	export const type: NotificationType<string | string[]> = new NotificationType('json/schemaContent');
}

namespace ForceValidateRequest {
	export const type: RequestType<string, Diagnostic[], any> = new RequestType('json/validate');
}

namespace LanguageStatusRequest {
	export const type: RequestType<string, JSONLanguageStatus, any> = new RequestType('json/languageStatus');
}

namespace ValidateContentRequest {
	export const type: RequestType<{ schemaUri: string; content: string }, Diagnostic[], any> = new RequestType('json/validateContent');
}

export interface DocumentSortingParams {
	/**
	 * The uri of the document to sort.
	 */
	uri: string;
	/**
	 * The sort options
	 */
	options: SortOptions;
}

namespace DocumentSortingRequest {
	export const type: RequestType<DocumentSortingParams, TextEdit[], any> = new RequestType('json/sort');
}

const workspaceContext = {
	resolveRelativePath: (relativePath: string, resource: string) => {
		const base = resource.substring(0, resource.lastIndexOf('/') + 1);
		return Utils.resolvePath(URI.parse(base), relativePath).toString();
	}
};

export interface RequestService {
	getContent(uri: string): Promise<string>;
}

export interface RuntimeEnvironment {
	file?: RequestService;
	http?: RequestService;
	configureHttpRequests?(proxy: string | undefined, strictSSL: boolean): void;
	readonly timer: {
		setImmediate(callback: (...args: any[]) => void, ...args: any[]): Disposable;
		setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable;
	};
}

const sortCodeActionKind = CodeActionKind.Source.concat('.sort', '.json');

export function startServer(connection: Connection, runtime: RuntimeEnvironment) {

	function getSchemaRequestService(handledSchemas: string[] = ['https', 'http', 'file']) {
		const builtInHandlers: { [protocol: string]: RequestService | undefined } = {};
		for (const protocol of handledSchemas) {
			if (protocol === 'file') {
				builtInHandlers[protocol] = runtime.file;
			} else if (protocol === 'http' || protocol === 'https') {
				builtInHandlers[protocol] = runtime.http;
			}
		}
		return (uri: string): Thenable<string> => {
			const protocol = uri.substr(0, uri.indexOf(':'));

			const builtInHandler = builtInHandlers[protocol];
			if (builtInHandler) {
				return builtInHandler.getContent(uri);
			}
			return connection.sendRequest(VSCodeContentRequest.type, uri).then(responseText => {
				return responseText;
			}, error => {
				return Promise.reject(error.message);
			});
		};
	}

	// create the JSON language service
	let languageService = getLanguageService({
		workspaceContext,
		contributions: [],
		clientCapabilities: ClientCapabilities.LATEST
	});

	// Create a text document manager.
	const documents = new TextDocuments(TextDocument);

	// Make the text document manager listen on the connection
	// for open, change and close text document events
	documents.listen(connection);

	let clientSnippetSupport = false;
	let dynamicFormatterRegistration = false;
	let hierarchicalDocumentSymbolSupport = false;

	let foldingRangeLimitDefault = Number.MAX_VALUE;
	let resultLimit = Number.MAX_VALUE;
	let jsonFoldingRangeLimit = Number.MAX_VALUE;
	let jsoncFoldingRangeLimit = Number.MAX_VALUE;
	let jsonColorDecoratorLimit = Number.MAX_VALUE;
	let jsoncColorDecoratorLimit = Number.MAX_VALUE;

	let formatterMaxNumberOfEdits = Number.MAX_VALUE;
	let diagnosticsSupport: DiagnosticsSupport | undefined;


	// After the server has started the client sends an initialize request. The server receives
	// in the passed params the rootPath of the workspace plus the client capabilities.
	connection.onInitialize((params: InitializeParams): InitializeResult => {

		const initializationOptions = params.initializationOptions || {};

		const handledProtocols = initializationOptions?.handledSchemaProtocols;

		languageService = getLanguageService({
			schemaRequestService: getSchemaRequestService(handledProtocols),
			workspaceContext,
			contributions: [],
			clientCapabilities: params.capabilities
		});

		function getClientCapability<T>(name: string, def: T) {
			const keys = name.split('.');
			let c: any = params.capabilities;
			for (let i = 0; c && i < keys.length; i++) {
				if (!c.hasOwnProperty(keys[i])) {
					return def;
				}
				c = c[keys[i]];
			}
			return c;
		}

		clientSnippetSupport = getClientCapability('textDocument.completion.completionItem.snippetSupport', false);
		dynamicFormatterRegistration = getClientCapability('textDocument.rangeFormatting.dynamicRegistration', false) && (typeof initializationOptions.provideFormatter !== 'boolean');
		foldingRangeLimitDefault = getClientCapability('textDocument.foldingRange.rangeLimit', Number.MAX_VALUE);
		hierarchicalDocumentSymbolSupport = getClientCapability('textDocument.documentSymbol.hierarchicalDocumentSymbolSupport', false);
		formatterMaxNumberOfEdits = initializationOptions.customCapabilities?.rangeFormatting?.editLimit || Number.MAX_VALUE;

		const supportsDiagnosticPull = getClientCapability('textDocument.diagnostic', undefined);
		if (supportsDiagnosticPull === undefined) {
			diagnosticsSupport = registerDiagnosticsPushSupport(documents, connection, runtime, validateTextDocument);
		} else {
			diagnosticsSupport = registerDiagnosticsPullSupport(documents, connection, runtime, validateTextDocument);
		}

		const capabilities: ServerCapabilities = {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			completionProvider: clientSnippetSupport ? {
				resolveProvider: false, // turn off resolving as the current language service doesn't do anything on resolve. Also fixes #91747
				triggerCharacters: ['"', ':']
			} : undefined,
			hoverProvider: true,
			documentSymbolProvider: true,
			documentRangeFormattingProvider: initializationOptions.provideFormatter === true,
			documentFormattingProvider: initializationOptions.provideFormatter === true,
			colorProvider: {},
			foldingRangeProvider: true,
			selectionRangeProvider: true,
			documentLinkProvider: {},
			diagnosticProvider: {
				documentSelector: null,
				interFileDependencies: false,
				workspaceDiagnostics: false
			},
			codeActionProvider: {
				codeActionKinds: [sortCodeActionKind]
			}
		};

		return { capabilities };
	});



	// The settings interface describes the server relevant settings part
	interface Settings {
		json?: {
			schemas?: JSONSchemaSettings[];
			format?: { enable?: boolean };
			keepLines?: { enable?: boolean };
			validate?: { enable?: boolean };
			resultLimit?: number;
			jsonFoldingLimit?: number;
			jsoncFoldingLimit?: number;
			jsonColorDecoratorLimit?: number;
			jsoncColorDecoratorLimit?: number;
		};
		http?: {
			proxy?: string;
			proxyStrictSSL?: boolean;
		};
	}

	interface JSONSchemaSettings {
		fileMatch?: string[];
		url?: string;
		schema?: JSONSchema;
		folderUri?: string;
	}



	let jsonConfigurationSettings: JSONSchemaSettings[] | undefined = undefined;
	let schemaAssociations: ISchemaAssociations | SchemaConfiguration[] | undefined = undefined;
	let formatterRegistrations: Thenable<Disposable>[] | null = null;
	let validateEnabled = true;
	let keepLinesEnabled = false;

	// The settings have changed. Is sent on server activation as well.
	connection.onDidChangeConfiguration((change) => {
		const settings = <Settings>change.settings;
		runtime.configureHttpRequests?.(settings?.http?.proxy, !!settings.http?.proxyStrictSSL);
		jsonConfigurationSettings = settings.json?.schemas;
		validateEnabled = !!settings.json?.validate?.enable;
		keepLinesEnabled = settings.json?.keepLines?.enable || false;
		updateConfiguration();

		const sanitizeLimitSetting = (settingValue: any) => Math.trunc(Math.max(settingValue, 0));
		resultLimit = sanitizeLimitSetting(settings.json?.resultLimit || Number.MAX_VALUE);
		jsonFoldingRangeLimit = sanitizeLimitSetting(settings.json?.jsonFoldingLimit || foldingRangeLimitDefault);
		jsoncFoldingRangeLimit = sanitizeLimitSetting(settings.json?.jsoncFoldingLimit || foldingRangeLimitDefault);
		jsonColorDecoratorLimit = sanitizeLimitSetting(settings.json?.jsonColorDecoratorLimit || Number.MAX_VALUE);
		jsoncColorDecoratorLimit = sanitizeLimitSetting(settings.json?.jsoncColorDecoratorLimit || Number.MAX_VALUE);

		// dynamically enable & disable the formatter
		if (dynamicFormatterRegistration) {
			const enableFormatter = settings.json?.format?.enable;
			if (enableFormatter) {
				if (!formatterRegistrations) {
					const documentSelector = [{ language: 'json' }, { language: 'jsonc' }];
					formatterRegistrations = [
						connection.client.register(DocumentRangeFormattingRequest.type, { documentSelector }),
						connection.client.register(DocumentFormattingRequest.type, { documentSelector })
					];
				}
			} else if (formatterRegistrations) {
				formatterRegistrations.forEach(p => p.then(r => r.dispose()));
				formatterRegistrations = null;
			}
		}
	});

	// The jsonValidation extension configuration has changed
	connection.onNotification(SchemaAssociationNotification.type, associations => {
		schemaAssociations = associations;
		updateConfiguration();
	});

	// A schema has changed
	connection.onNotification(SchemaContentChangeNotification.type, uriOrUris => {
		let needsRevalidation = false;
		if (Array.isArray(uriOrUris)) {
			for (const uri of uriOrUris) {
				if (languageService.resetSchema(uri)) {
					needsRevalidation = true;
				}
			}
		} else {
			needsRevalidation = languageService.resetSchema(uriOrUris);
		}
		if (needsRevalidation) {
			diagnosticsSupport?.requestRefresh();
		}
	});

	// Retry schema validation on all open documents
	connection.onRequest(ForceValidateRequest.type, async uri => {
		const document = documents.get(uri);
		if (document) {
			updateConfiguration();
			return await validateTextDocument(document);
		}
		return [];
	});

	connection.onRequest(ValidateContentRequest.type, async ({ schemaUri, content }) => {
		const docURI = 'vscode://schemas/temp/' + new Date().getTime();
		const document = TextDocument.create(docURI, 'json', 1, content);
		updateConfiguration([{ uri: schemaUri, fileMatch: [docURI] }]);
		return await validateTextDocument(document);
	});


	connection.onRequest(LanguageStatusRequest.type, async uri => {
		const document = documents.get(uri);
		if (document) {
			const jsonDocument = getJSONDocument(document);
			return languageService.getLanguageStatus(document, jsonDocument);
		} else {
			return { schemas: [] };
		}
	});

	connection.onRequest(DocumentSortingRequest.type, async params => {
		const uri = params.uri;
		const options = params.options;
		const document = documents.get(uri);
		if (document) {
			return languageService.sort(document, options);
		}
		return [];
	});

	function updateConfiguration(extraSchemas?: SchemaConfiguration[]) {
		const languageSettings = {
			validate: validateEnabled,
			allowComments: true,
			schemas: new Array<SchemaConfiguration>()
		};
		if (schemaAssociations) {
			if (Array.isArray(schemaAssociations)) {
				Array.prototype.push.apply(languageSettings.schemas, schemaAssociations);
			} else {
				for (const pattern in schemaAssociations) {
					const association = schemaAssociations[pattern];
					if (Array.isArray(association)) {
						association.forEach(uri => {
							languageSettings.schemas.push({ uri, fileMatch: [pattern] });
						});
					}
				}
			}
		}
		if (jsonConfigurationSettings) {
			jsonConfigurationSettings.forEach((schema, index) => {
				let uri = schema.url;
				if (!uri && schema.schema) {
					uri = schema.schema.id || `vscode://schemas/custom/${index}`;
				}
				if (uri) {
					languageSettings.schemas.push({ uri, fileMatch: schema.fileMatch, schema: schema.schema, folderUri: schema.folderUri });
				}
			});
		}
		if (extraSchemas) {
			languageSettings.schemas.push(...extraSchemas);
		}

		languageService.configure(languageSettings);

		diagnosticsSupport?.requestRefresh();
	}

	async function validateTextDocument(textDocument: TextDocument): Promise<Diagnostic[]> {
		if (textDocument.getText().length === 0) {
			return []; // ignore empty documents
		}
		const jsonDocument = getJSONDocument(textDocument);
		const documentSettings: DocumentLanguageSettings = textDocument.languageId === 'jsonc' ? { comments: 'ignore', trailingCommas: 'warning' } : { comments: 'error', trailingCommas: 'error' };
		return await languageService.doValidation(textDocument, jsonDocument, documentSettings);
	}

	connection.onDidChangeWatchedFiles((change) => {
		// Monitored files have changed in VSCode
		let hasChanges = false;
		change.changes.forEach(c => {
			if (languageService.resetSchema(c.uri)) {
				hasChanges = true;
			}
		});
		if (hasChanges) {
			diagnosticsSupport?.requestRefresh();
		}
	});

	const jsonDocuments = getLanguageModelCache<JSONDocument>(10, 60, document => languageService.parseJSONDocument(document));
	documents.onDidClose(e => {
		jsonDocuments.onDocumentRemoved(e.document);
	});
	connection.onShutdown(() => {
		jsonDocuments.dispose();
	});

	function getJSONDocument(document: TextDocument): JSONDocument {
		return jsonDocuments.get(document);
	}

	connection.onCompletion((textDocumentPosition, token) => {
		return runSafeAsync(runtime, async () => {
			const document = documents.get(textDocumentPosition.textDocument.uri);
			if (document) {
				const jsonDocument = getJSONDocument(document);
				return languageService.doComplete(document, textDocumentPosition.position, jsonDocument);
			}
			return null;
		}, null, `Error while computing completions for ${textDocumentPosition.textDocument.uri}`, token);
	});

	connection.onHover((textDocumentPositionParams, token) => {
		return runSafeAsync(runtime, async () => {
			const document = documents.get(textDocumentPositionParams.textDocument.uri);
			if (document) {
				const jsonDocument = getJSONDocument(document);
				return languageService.doHover(document, textDocumentPositionParams.position, jsonDocument);
			}
			return null;
		}, null, `Error while computing hover for ${textDocumentPositionParams.textDocument.uri}`, token);
	});

	connection.onDocumentSymbol((documentSymbolParams, token) => {
		return runSafe(runtime, () => {
			const document = documents.get(documentSymbolParams.textDocument.uri);
			if (document) {
				const jsonDocument = getJSONDocument(document);
				if (hierarchicalDocumentSymbolSupport) {
					return languageService.findDocumentSymbols2(document, jsonDocument, { resultLimit });
				} else {
					return languageService.findDocumentSymbols(document, jsonDocument, { resultLimit });
				}
			}
			return [];
		}, [], `Error while computing document symbols for ${documentSymbolParams.textDocument.uri}`, token);
	});

	connection.onCodeAction((codeActionParams, token) => {
		return runSafeAsync(runtime, async () => {
			const document = documents.get(codeActionParams.textDocument.uri);
			if (document) {
				const sortCodeAction = CodeAction.create('Sort JSON', sortCodeActionKind);
				sortCodeAction.command = {
					command: 'json.sort',
					title: l10n.t('Sort JSON')
				};
				return [sortCodeAction];
			}
			return [];
		}, [], `Error while computing code actions for ${codeActionParams.textDocument.uri}`, token);
	});

	function onFormat(textDocument: TextDocumentIdentifier, range: Range | undefined, options: FormattingOptions): TextEdit[] {

		options.keepLines = keepLinesEnabled;
		const document = documents.get(textDocument.uri);
		if (document) {
			const edits = languageService.format(document, range ?? getFullRange(document), options);
			if (edits.length > formatterMaxNumberOfEdits) {
				const newText = TextDocument.applyEdits(document, edits);
				return [TextEdit.replace(getFullRange(document), newText)];
			}
			return edits;
		}
		return [];
	}

	connection.onDocumentRangeFormatting((formatParams, token) => {
		return runSafe(runtime, () => onFormat(formatParams.textDocument, formatParams.range, formatParams.options), [], `Error while formatting range for ${formatParams.textDocument.uri}`, token);
	});

	connection.onDocumentFormatting((formatParams, token) => {
		return runSafe(runtime, () => onFormat(formatParams.textDocument, undefined, formatParams.options), [], `Error while formatting ${formatParams.textDocument.uri}`, token);
	});

	connection.onDocumentColor((params, token) => {
		return runSafeAsync(runtime, async () => {
			const document = documents.get(params.textDocument.uri);
			if (document) {

				const jsonDocument = getJSONDocument(document);
				const resultLimit = document.languageId === 'jsonc' ? jsoncColorDecoratorLimit : jsonColorDecoratorLimit;
				return languageService.findDocumentColors(document, jsonDocument, { resultLimit });
			}
			return [];
		}, [], `Error while computing document colors for ${params.textDocument.uri}`, token);
	});

	connection.onColorPresentation((params, token) => {
		return runSafe(runtime, () => {
			const document = documents.get(params.textDocument.uri);
			if (document) {
				const jsonDocument = getJSONDocument(document);
				return languageService.getColorPresentations(document, jsonDocument, params.color, params.range);
			}
			return [];
		}, [], `Error while computing color presentations for ${params.textDocument.uri}`, token);
	});

	connection.onFoldingRanges((params, token) => {
		return runSafe(runtime, () => {
			const document = documents.get(params.textDocument.uri);
			if (document) {
				const rangeLimit = document.languageId === 'jsonc' ? jsoncFoldingRangeLimit : jsonFoldingRangeLimit;
				return languageService.getFoldingRanges(document, { rangeLimit });
			}
			return null;
		}, null, `Error while computing folding ranges for ${params.textDocument.uri}`, token);
	});


	connection.onSelectionRanges((params, token) => {
		return runSafe(runtime, () => {
			const document = documents.get(params.textDocument.uri);
			if (document) {
				const jsonDocument = getJSONDocument(document);
				return languageService.getSelectionRanges(document, params.positions, jsonDocument);
			}
			return [];
		}, [], `Error while computing selection ranges for ${params.textDocument.uri}`, token);
	});

	connection.onDocumentLinks((params, token) => {
		return runSafeAsync(runtime, async () => {
			const document = documents.get(params.textDocument.uri);
			if (document) {
				const jsonDocument = getJSONDocument(document);
				return languageService.findLinks(document, jsonDocument);
			}
			return [];
		}, [], `Error while computing links for ${params.textDocument.uri}`, token);
	});

	// Listen on the connection
	connection.listen();
}

function getFullRange(document: TextDocument): Range {
	return Range.create(Position.create(0, 0), document.positionAt(document.getText().length));
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/server/src/languageModelCache.ts]---
Location: vscode-main/extensions/json-language-features/server/src/languageModelCache.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TextDocument } from 'vscode-languageserver';

export interface LanguageModelCache<T> {
	get(document: TextDocument): T;
	onDocumentRemoved(document: TextDocument): void;
	dispose(): void;
}

export function getLanguageModelCache<T>(maxEntries: number, cleanupIntervalTimeInSec: number, parse: (document: TextDocument) => T): LanguageModelCache<T> {
	let languageModels: { [uri: string]: { version: number; languageId: string; cTime: number; languageModel: T } } = {};
	let nModels = 0;

	let cleanupInterval: NodeJS.Timeout | undefined = undefined;
	if (cleanupIntervalTimeInSec > 0) {
		cleanupInterval = setInterval(() => {
			const cutoffTime = Date.now() - cleanupIntervalTimeInSec * 1000;
			const uris = Object.keys(languageModels);
			for (const uri of uris) {
				const languageModelInfo = languageModels[uri];
				if (languageModelInfo.cTime < cutoffTime) {
					delete languageModels[uri];
					nModels--;
				}
			}
		}, cleanupIntervalTimeInSec * 1000);
	}

	return {
		get(document: TextDocument): T {
			const version = document.version;
			const languageId = document.languageId;
			const languageModelInfo = languageModels[document.uri];
			if (languageModelInfo && languageModelInfo.version === version && languageModelInfo.languageId === languageId) {
				languageModelInfo.cTime = Date.now();
				return languageModelInfo.languageModel;
			}
			const languageModel = parse(document);
			languageModels[document.uri] = { languageModel, version, languageId, cTime: Date.now() };
			if (!languageModelInfo) {
				nModels++;
			}

			if (nModels === maxEntries) {
				let oldestTime = Number.MAX_VALUE;
				let oldestUri = null;
				for (const uri in languageModels) {
					const languageModelInfo = languageModels[uri];
					if (languageModelInfo.cTime < oldestTime) {
						oldestUri = uri;
						oldestTime = languageModelInfo.cTime;
					}
				}
				if (oldestUri) {
					delete languageModels[oldestUri];
					nModels--;
				}
			}
			return languageModel;

		},
		onDocumentRemoved(document: TextDocument) {
			const uri = document.uri;
			if (languageModels[uri]) {
				delete languageModels[uri];
				nModels--;
			}
		},
		dispose() {
			if (typeof cleanupInterval !== 'undefined') {
				clearInterval(cleanupInterval);
				cleanupInterval = undefined;
				languageModels = {};
				nModels = 0;
			}
		}
	};
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/server/src/browser/jsonServerMain.ts]---
Location: vscode-main/extensions/json-language-features/server/src/browser/jsonServerMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createConnection, BrowserMessageReader, BrowserMessageWriter, Disposable } from 'vscode-languageserver/browser';
import { RuntimeEnvironment, startServer } from '../jsonServer';


const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);

const runtime: RuntimeEnvironment = {
	timer: {
		setImmediate(callback: (...args: any[]) => void, ...args: any[]): Disposable {
			const handle = setTimeout(callback, 0, ...args);
			return { dispose: () => clearTimeout(handle) };
		},
		setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable {
			const handle = setTimeout(callback, ms, ...args);
			return { dispose: () => clearTimeout(handle) };
		}
	}
};

startServer(connection, runtime);
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/server/src/browser/jsonServerWorkerMain.ts]---
Location: vscode-main/extensions/json-language-features/server/src/browser/jsonServerWorkerMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as l10n from '@vscode/l10n';

let initialized = false;
const pendingMessages: any[] = [];
const messageHandler = async (e: any) => {
	if (!initialized) {
		const l10nLog: string[] = [];
		initialized = true;
		const i10lLocation = e.data.i10lLocation;
		if (i10lLocation) {
			try {
				await l10n.config({ uri: i10lLocation });
				l10nLog.push(`l10n: Configured to ${i10lLocation.toString()}.`);
			} catch (e) {
				l10nLog.push(`l10n: Problems loading ${i10lLocation.toString()} : ${e}.`);
			}
		} else {
			l10nLog.push(`l10n: No bundle configured.`);
		}
		await import('./jsonServerMain.js');
		if (self.onmessage !== messageHandler) {
			pendingMessages.forEach(msg => self.onmessage?.(msg));
			pendingMessages.length = 0;
		}
		l10nLog.forEach(console.log);
	} else {
		pendingMessages.push(e);
	}
};
self.onmessage = messageHandler;
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/server/src/node/jsonServerMain.ts]---
Location: vscode-main/extensions/json-language-features/server/src/node/jsonServerMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createConnection, Connection, Disposable } from 'vscode-languageserver/node';
import { formatError } from '../utils/runner';
import { RequestService, RuntimeEnvironment, startServer } from '../jsonServer';

import { xhr, XHRResponse, configure as configureHttpRequests, getErrorStatusDescription } from 'request-light';
import { URI as Uri } from 'vscode-uri';
import { promises as fs } from 'fs';
import * as l10n from '@vscode/l10n';

// Create a connection for the server.
const connection: Connection = createConnection();

console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);

process.on('unhandledRejection', (e: any) => {
	connection.console.error(formatError(`Unhandled exception`, e));
});

function getHTTPRequestService(): RequestService {
	return {
		getContent(uri: string, _encoding?: string) {
			const headers = { 'Accept-Encoding': 'gzip, deflate' };
			return xhr({ url: uri, followRedirects: 5, headers }).then(response => {
				return response.responseText;
			}, (error: XHRResponse) => {
				return Promise.reject(error.responseText || getErrorStatusDescription(error.status) || error.toString());
			});
		}
	};
}

function getFileRequestService(): RequestService {
	return {
		async getContent(location: string, encoding?: BufferEncoding) {
			try {
				const uri = Uri.parse(location);
				return (await fs.readFile(uri.fsPath, encoding)).toString();
			} catch (e) {
				if (e.code === 'ENOENT') {
					throw new Error(l10n.t('Schema not found: {0}', location));
				} else if (e.code === 'EISDIR') {
					throw new Error(l10n.t('{0} is a directory, not a file', location));
				}
				throw e;
			}
		}
	};
}

const runtime: RuntimeEnvironment = {
	timer: {
		setImmediate(callback: (...args: any[]) => void, ...args: any[]): Disposable {
			const handle = setImmediate(callback, ...args);
			return { dispose: () => clearImmediate(handle) };
		},
		setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable {
			const handle = setTimeout(callback, ms, ...args);
			return { dispose: () => clearTimeout(handle) };
		}
	},
	file: getFileRequestService(),
	http: getHTTPRequestService(),
	configureHttpRequests
};



startServer(connection, runtime);
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/server/src/node/jsonServerNodeMain.ts]---
Location: vscode-main/extensions/json-language-features/server/src/node/jsonServerNodeMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as l10n from '@vscode/l10n';

async function setupMain() {
	const l10nLog: string[] = [];

	const i10lLocation = process.env['VSCODE_L10N_BUNDLE_LOCATION'];
	if (i10lLocation) {
		try {
			await l10n.config({ uri: i10lLocation });
			l10nLog.push(`l10n: Configured to ${i10lLocation.toString()}`);
		} catch (e) {
			l10nLog.push(`l10n: Problems loading ${i10lLocation.toString()} : ${e}`);
		}
	}
	await import('./jsonServerMain.js');
	l10nLog.forEach(console.log);
}
setupMain();
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/server/src/utils/runner.ts]---
Location: vscode-main/extensions/json-language-features/server/src/utils/runner.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken, ResponseError, LSPErrorCodes } from 'vscode-languageserver';
import { RuntimeEnvironment } from '../jsonServer';

export function formatError(message: string, err: any): string {
	if (err instanceof Error) {
		const error = <Error>err;
		return `${message}: ${error.message}\n${error.stack}`;
	} else if (typeof err === 'string') {
		return `${message}: ${err}`;
	} else if (err) {
		return `${message}: ${err.toString()}`;
	}
	return message;
}

export function runSafeAsync<T>(runtime: RuntimeEnvironment, func: () => Thenable<T>, errorVal: T, errorMessage: string, token: CancellationToken): Thenable<T | ResponseError<any>> {
	return new Promise<T | ResponseError<any>>((resolve) => {
		runtime.timer.setImmediate(() => {
			if (token.isCancellationRequested) {
				resolve(cancelValue());
				return;
			}
			return func().then(result => {
				if (token.isCancellationRequested) {
					resolve(cancelValue());
					return;
				} else {
					resolve(result);
				}
			}, e => {
				console.error(formatError(errorMessage, e));
				resolve(errorVal);
			});
		});
	});
}

export function runSafe<T, E>(runtime: RuntimeEnvironment, func: () => T, errorVal: T, errorMessage: string, token: CancellationToken): Thenable<T | ResponseError<E>> {
	return new Promise<T | ResponseError<E>>((resolve) => {
		runtime.timer.setImmediate(() => {
			if (token.isCancellationRequested) {
				resolve(cancelValue());
			} else {
				try {
					const result = func();
					if (token.isCancellationRequested) {
						resolve(cancelValue());
						return;
					} else {
						resolve(result);
					}

				} catch (e) {
					console.error(formatError(errorMessage, e));
					resolve(errorVal);
				}
			}
		});
	});
}

function cancelValue<E>() {
	console.log('cancelled');
	return new ResponseError<E>(LSPErrorCodes.RequestCancelled, 'Request cancelled');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/server/src/utils/strings.ts]---
Location: vscode-main/extensions/json-language-features/server/src/utils/strings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Determines if haystack ends with needle.
 */
export function endsWith(haystack: string, needle: string): boolean {
	const diff = haystack.length - needle.length;
	if (diff > 0) {
		return haystack.lastIndexOf(needle) === diff;
	} else if (diff === 0) {
		return haystack === needle;
	} else {
		return false;
	}
}

export function convertSimple2RegExpPattern(pattern: string): string {
	return pattern.replace(/[\-\\\{\}\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, '\\$&').replace(/[\*]/g, '.*');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/server/src/utils/validation.ts]---
Location: vscode-main/extensions/json-language-features/server/src/utils/validation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken, Connection, Diagnostic, Disposable, DocumentDiagnosticParams, DocumentDiagnosticReport, DocumentDiagnosticReportKind, TextDocuments } from 'vscode-languageserver';
import { TextDocument } from 'vscode-json-languageservice';
import { formatError, runSafeAsync } from './runner';
import { RuntimeEnvironment } from '../jsonServer';

export type Validator = (textDocument: TextDocument) => Promise<Diagnostic[]>;
export type DiagnosticsSupport = {
	dispose(): void;
	requestRefresh(): void;
};

export function registerDiagnosticsPushSupport(documents: TextDocuments<TextDocument>, connection: Connection, runtime: RuntimeEnvironment, validate: Validator): DiagnosticsSupport {

	const pendingValidationRequests: { [uri: string]: Disposable } = {};
	const validationDelayMs = 500;

	const disposables: Disposable[] = [];

	// The content of a text document has changed. This event is emitted
	// when the text document first opened or when its content has changed.
	documents.onDidChangeContent(change => {
		triggerValidation(change.document);
	}, undefined, disposables);

	// a document has closed: clear all diagnostics
	documents.onDidClose(event => {
		cleanPendingValidation(event.document);
		connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
	}, undefined, disposables);

	function cleanPendingValidation(textDocument: TextDocument): void {
		const request = pendingValidationRequests[textDocument.uri];
		if (request) {
			request.dispose();
			delete pendingValidationRequests[textDocument.uri];
		}
	}

	function triggerValidation(textDocument: TextDocument): void {
		cleanPendingValidation(textDocument);
		const request = pendingValidationRequests[textDocument.uri] = runtime.timer.setTimeout(async () => {
			if (request === pendingValidationRequests[textDocument.uri]) {
				try {
					const diagnostics = await validate(textDocument);
					if (request === pendingValidationRequests[textDocument.uri]) {
						connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
					}
					delete pendingValidationRequests[textDocument.uri];
				} catch (e) {
					connection.console.error(formatError(`Error while validating ${textDocument.uri}`, e));
				}
			}
		}, validationDelayMs);
	}

	return {
		requestRefresh: () => {
			documents.all().forEach(triggerValidation);
		},
		dispose: () => {
			disposables.forEach(d => d.dispose());
			disposables.length = 0;
			const keys = Object.keys(pendingValidationRequests);
			for (const key of keys) {
				pendingValidationRequests[key].dispose();
				delete pendingValidationRequests[key];
			}
		}
	};
}

export function registerDiagnosticsPullSupport(documents: TextDocuments<TextDocument>, connection: Connection, runtime: RuntimeEnvironment, validate: Validator): DiagnosticsSupport {

	function newDocumentDiagnosticReport(diagnostics: Diagnostic[]): DocumentDiagnosticReport {
		return {
			kind: DocumentDiagnosticReportKind.Full,
			items: diagnostics
		};
	}

	const registration = connection.languages.diagnostics.on(async (params: DocumentDiagnosticParams, token: CancellationToken) => {
		return runSafeAsync(runtime, async () => {
			const document = documents.get(params.textDocument.uri);
			if (document) {
				return newDocumentDiagnosticReport(await validate(document));
			}
			return newDocumentDiagnosticReport([]);

		}, newDocumentDiagnosticReport([]), `Error while computing diagnostics for ${params.textDocument.uri}`, token);
	});

	function requestRefresh(): void {
		connection.languages.diagnostics.refresh();
	}

	return {
		requestRefresh,
		dispose: () => {
			registration.dispose();
		}
	};

}
```

--------------------------------------------------------------------------------

---[FILE: extensions/json-language-features/server/test/mocha.opts]---
Location: vscode-main/extensions/json-language-features/server/test/mocha.opts

```text
--ui tdd
--useColors true
./out/test/**/*.test.js
```

--------------------------------------------------------------------------------

---[FILE: extensions/julia/.vscodeignore]---
Location: vscode-main/extensions/julia/.vscodeignore

```text
build/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/julia/cgmanifest.json]---
Location: vscode-main/extensions/julia/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "JuliaEditorSupport/atom-language-julia",
					"repositoryUrl": "https://github.com/JuliaEditorSupport/atom-language-julia",
					"commitHash": "111548fbd25d083ec131d2732a4f46953ea92a65"
				}
			},
			"license": "MIT",
			"version": "0.23.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/julia/language-configuration.json]---
Location: vscode-main/extensions/julia/language-configuration.json

```json
{
	"comments": {
		"lineComment": "#",
		"blockComment": [ "#=", "=#" ]
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
		["`", "`"],
		{ "open": "\"", "close": "\"", "notIn": ["string", "comment"] }
	],
	"surroundingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["\"", "\""],
		["`", "`"]
	],
	"folding": {
		"markers": {
			"start": "^\\s*#region",
			"end": "^\\s*#endregion"
		}
	},
	"indentationRules": {
		"increaseIndentPattern": "^(\\s*|.*=\\s*|.*@\\w*\\s*)[\\w\\s]*(?:[\"'`][^\"'`]*[\"'`])*[\\w\\s]*\\b(if|while|for|function|macro|(mutable\\s+)?struct|abstract\\s+type|primitive\\s+type|let|quote|try|begin|.*\\)\\s*do|else|elseif|catch|finally)\\b(?!(?:.*\\bend\\b[^\\]]*)|(?:[^\\[]*\\].*)$).*$",
		"decreaseIndentPattern": "^\\s*(end|else|elseif|catch|finally)\\b.*$"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/julia/package.json]---
Location: vscode-main/extensions/julia/package.json

```json
{
	"name": "julia",
	"displayName": "%displayName%",
	"description": "%description%",
	"version": "1.0.0",
	"publisher": "vscode",
	"license": "MIT",
	"engines": {
		"vscode": "0.10.x"
	},
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin JuliaEditorSupport/atom-language-julia grammars/julia_vscode.json ./syntaxes/julia.tmLanguage.json"
  },
  "categories": ["Programming Languages"],
	"contributes": {
		"languages": [
			{
					"id": "julia",
					"aliases": [
							"Julia",
							"julia"
					],
					"extensions": [
							".jl"
					],
					"firstLine": "^#!\\s*/.*\\bjulia[0-9.-]*\\b",
					"configuration": "./language-configuration.json"
			},
			{
					"id": "juliamarkdown",
					"aliases": [
							"Julia Markdown",
							"juliamarkdown"
					],
					"extensions": [
							".jmd"
					]
			}
		],
		"grammars": [
			{
					"language": "julia",
					"scopeName": "source.julia",
					"path": "./syntaxes/julia.tmLanguage.json",
					"embeddedLanguages": {
							"meta.embedded.inline.cpp": "cpp",
							"meta.embedded.inline.javascript": "javascript",
							"meta.embedded.inline.python": "python",
							"meta.embedded.inline.r": "r",
							"meta.embedded.inline.sql": "sql"
					}
			}
		],
		"configurationDefaults": {
			"[julia]": {
				"editor.defaultColorDecorators": "never"
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/julia/package.nls.json]---
Location: vscode-main/extensions/julia/package.nls.json

```json
{
	"displayName": "Julia Language Basics",
	"description": "Provides syntax highlighting & bracket matching in Julia files."
}
```

--------------------------------------------------------------------------------

````
