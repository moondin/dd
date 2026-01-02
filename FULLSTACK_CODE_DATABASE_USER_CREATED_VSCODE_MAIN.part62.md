---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 62
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 62 of 552)

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

---[FILE: extensions/markdown-math/syntaxes/md-math.tmLanguage.json]---
Location: vscode-main/extensions/markdown-math/syntaxes/md-math.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file includes some grammar rules copied from https://github.com/James-Yu/LaTeX-Workshop/blob/master/syntax/TeX.tmLanguage.json"
	],
	"name": "Markdown Math",
	"scopeName": "text.html.markdown.math",
	"patterns": [
		{
			"include": "#math"
		}
	],
	"repository": {
		"math": {
			"patterns": [
				{
					"name": "comment.line.math.tex",
					"match": "((?<!\\\\)%)(.+)$",
					"captures": {
						"1": {
							"name": "punctuation.definition.comment.math.tex"
						}
					}
				},
				{
					"name": "line.separator.math.tex",
					"match": "(\\\\\\\\)$",
					"captures": {
						"1": {
							"name": "punctuation.line.separator.math.tex"
						}
					}
				},
				{
					"name": "meta.function.math.tex",
					"begin": "((\\\\)([a-zA-Z_]+))\\s*(\\{)",
					"beginCaptures": {
						"1": {
							"name": "storage.type.function.math.tex"
						},
						"2": {
							"name": "punctuation.definition.function.math.tex"
						},
						"3": {
							"name": "entity.name.function.math.tex"
						},
						"4": {
							"name": "punctuation.definition.arguments.begin.math.tex"
						}
					},
					"end": "\\}",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.arguments.end.math.tex"
						}
					},
					"patterns": [
						{
							"include": "$self"
						}
					]
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.constant.math.tex"
						}
					},
					"match": "(\\\\)([a-zA-Z_]+)\\b",
					"name": "constant.character.math.tex"
				},
				{
					"captures": {
						"1": {
							"name": "punctuation.definition.constant.math.tex"
						}
					},
					"match": "(\\\\)(?!begin\\*\\{|verb)([A-Za-z]+)",
					"name": "constant.other.general.math.tex"
				},
				{
					"match": "(?<!\\\\)\\{",
					"name": "punctuation.math.begin.bracket.curly"
				},
				{
					"match": "(?<!\\\\)\\}",
					"name": "punctuation.math.end.bracket.curly"
				},
				{
					"match": "\\(",
					"name": "punctuation.math.begin.bracket.round"
				},
				{
					"match": "\\)",
					"name": "punctuation.math.end.bracket.round"
				},
				{
					"match": "(([0-9]*[\\.][0-9]+)|[0-9]+)",
					"name": "constant.numeric.math.tex"
				},
				{
					"match": "[\\+\\*/_\\^-]",
					"name": "punctuation.math.operator.latex"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/.npmrc]---
Location: vscode-main/extensions/media-preview/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/.vscodeignore]---
Location: vscode-main/extensions/media-preview/.vscodeignore

```text
test/**
src/**
tsconfig.json
out/test/**
out/**
extension.webpack.config.js
extension-browser.webpack.config.js
cgmanifest.json
package-lock.json
preview-src/**
webpack.config.js
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/media-preview/extension-browser.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import { browser as withBrowserDefaults } from '../shared.webpack.config.mjs';

export default withBrowserDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/extension.ts'
	},
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/extension.webpack.config.js]---
Location: vscode-main/extensions/media-preview/extension.webpack.config.js

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

---[FILE: extensions/media-preview/package-lock.json]---
Location: vscode-main/extensions/media-preview/package-lock.json

```json
{
  "name": "media-preview",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "media-preview",
      "version": "1.0.0",
      "license": "MIT",
      "dependencies": {
        "@vscode/extension-telemetry": "^0.9.8",
        "vscode-uri": "^3.0.6"
      },
      "devDependencies": {
        "@types/node": "22.x"
      },
      "engines": {
        "vscode": "^1.70.0"
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
      "version": "22.18.13",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.18.13.tgz",
      "integrity": "sha512-Bo45YKIjnmFtv6I1TuC8AaHBbqXtIo+Om5fE4QiU1Tj8QR/qt+8O3BAtOimG5IFmwaWiPmB3Mv3jtYzBA4Us2A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.21.0"
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
    "node_modules/undici-types": {
      "version": "6.21.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",
      "integrity": "sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/vscode-uri": {
      "version": "3.0.6",
      "resolved": "https://registry.npmjs.org/vscode-uri/-/vscode-uri-3.0.6.tgz",
      "integrity": "sha512-fmL7V1eiDBFRRnu+gfRWTzyPpNIHJTc4mWnFkwBUmO9U3KPgJAmTx7oxi2bl/Rh6HLdU7+4C9wlj0k2E4AdKFQ=="
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/package.json]---
Location: vscode-main/extensions/media-preview/package.json

```json
{
  "name": "media-preview",
  "displayName": "%displayName%",
  "description": "%description%",
  "extensionKind": [
    "ui",
    "workspace"
  ],
  "version": "1.0.0",
  "publisher": "vscode",
  "icon": "icon.png",
  "license": "MIT",
  "aiKey": "0c6ae279ed8443289764825290e4f9e2-1a736e7c-1324-4338-be46-fc2a58ae4d14-7255",
  "engines": {
    "vscode": "^1.70.0"
  },
  "main": "./out/extension",
  "browser": "./dist/browser/extension.js",
  "categories": [
    "Other"
  ],
  "activationEvents": [],
  "capabilities": {
    "virtualWorkspaces": true,
    "untrustedWorkspaces": {
      "supported": true
    }
  },
  "contributes": {
    "configuration": {
      "type": "object",
      "title": "Media Previewer",
      "properties": {
        "mediaPreview.video.autoPlay": {
          "type": "boolean",
          "default": false,
          "markdownDescription": "%videoPreviewerAutoPlay%"
        },
        "mediaPreview.video.loop": {
          "type": "boolean",
          "default": false,
          "markdownDescription": "%videoPreviewerLoop%"
        }
      }
    },
    "customEditors": [
      {
        "viewType": "imagePreview.previewEditor",
        "displayName": "%customEditor.imagePreview.displayName%",
        "priority": "builtin",
        "selector": [
          {
            "filenamePattern": "*.{jpg,jpe,jpeg,png,bmp,gif,ico,webp,avif,svg}"
          }
        ]
      },
      {
        "viewType": "vscode.audioPreview",
        "displayName": "%customEditor.audioPreview.displayName%",
        "priority": "builtin",
        "selector": [
          {
            "filenamePattern": "*.{mp3,wav,ogg,oga}"
          }
        ]
      },
      {
        "viewType": "vscode.videoPreview",
        "displayName": "%customEditor.videoPreview.displayName%",
        "priority": "builtin",
        "selector": [
          {
            "filenamePattern": "*.{mp4,webm}"
          }
        ]
      }
    ],
    "commands": [
      {
        "command": "imagePreview.zoomIn",
        "title": "%command.zoomIn%",
        "category": "Image Preview"
      },
      {
        "command": "imagePreview.zoomOut",
        "title": "%command.zoomOut%",
        "category": "Image Preview"
      },
      {
        "command": "imagePreview.copyImage",
        "title": "%command.copyImage%",
        "category": "Image Preview"
      },
      {
        "command": "imagePreview.reopenAsPreview",
        "title": "%command.reopenAsPreview%",
        "category": "Image Preview",
        "icon": "$(preview)"
      },
      {
        "command": "imagePreview.reopenAsText",
        "title": "%command.reopenAsText%",
        "category": "Image Preview",
        "icon": "$(go-to-file)"
      }
    ],
    "menus": {
      "commandPalette": [
        {
          "command": "imagePreview.zoomIn",
          "when": "activeCustomEditorId == 'imagePreview.previewEditor'",
          "group": "1_imagePreview"
        },
        {
          "command": "imagePreview.zoomOut",
          "when": "activeCustomEditorId == 'imagePreview.previewEditor'",
          "group": "1_imagePreview"
        },
        {
          "command": "imagePreview.copyImage",
          "when": "false"
        },
        {
          "command": "imagePreview.reopenAsPreview",
          "when": "activeEditor == workbench.editors.files.textFileEditor && resourceExtname == '.svg'",
          "group": "navigation"
        },
        {
          "command": "imagePreview.reopenAsText",
          "when": "activeCustomEditorId == 'imagePreview.previewEditor' && resourceExtname == '.svg'",
          "group": "navigation"
        }
      ],
      "webview/context": [
        {
          "command": "imagePreview.copyImage",
          "when": "webviewId == 'imagePreview.previewEditor'"
        }
      ],
      "editor/title": [
        {
          "command": "imagePreview.reopenAsPreview",
          "when": "editorFocus && resourceExtname == '.svg'",
          "group": "navigation"
        },
        {
          "command": "imagePreview.reopenAsText",
          "when": "activeCustomEditorId == 'imagePreview.previewEditor' && resourceExtname == '.svg'",
          "group": "navigation"
        }
      ]
    }
  },
  "scripts": {
    "compile": "gulp compile-extension:media-preview",
    "watch": "npm run build-preview && gulp watch-extension:media-preview",
    "vscode:prepublish": "npm run build-ext",
    "build-ext": "node ../../node_modules/gulp/bin/gulp.js --gulpfile ../../build/gulpfile.extensions.mjs compile-extension:media-preview ./tsconfig.json",
    "compile-web": "npx webpack-cli --config extension-browser.webpack.config --mode none",
    "watch-web": "npx webpack-cli --config extension-browser.webpack.config --mode none --watch --info-verbosity verbose"
  },
  "dependencies": {
    "@vscode/extension-telemetry": "^0.9.8",
    "vscode-uri": "^3.0.6"
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

---[FILE: extensions/media-preview/package.nls.json]---
Location: vscode-main/extensions/media-preview/package.nls.json

```json
{
	"displayName": "Media Preview",
	"description": "Provides VS Code's built-in previews for images, audio, and video",
	"customEditor.audioPreview.displayName": "Audio Preview",
	"customEditor.imagePreview.displayName": "Image Preview",
	"customEditor.videoPreview.displayName": "Video Preview",
	"videoPreviewerAutoPlay": "Start playing videos on mute automatically.",
	"videoPreviewerLoop": "Loop videos over again automatically.",
	"command.zoomIn": "Zoom in",
	"command.zoomOut": "Zoom out",
	"command.copyImage": "Copy",
	"command.reopenAsPreview": "Reopen as image preview",
	"command.reopenAsText": "Reopen as source text"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/README.md]---
Location: vscode-main/extensions/media-preview/README.md

```markdown
# Media Preview

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

## Features

This extension provides basic preview for images, audio and video files.

### Supported image file extensions

- `.jpg`, `.jpe`, `.jpeg`
- `.png`
- `.bmp`
- `.gif`
- `.ico`
- `.webp`
- `.avif`

### Supported audio formats

- `.mp3`
- `.wav`
- `.ogg`, `.oga`

### Supported video formats

- `.mp4` (does not support `aac` audio tracks)
- `.webm` (vp8 only)
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/tsconfig.json]---
Location: vscode-main/extensions/media-preview/tsconfig.json

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

---[FILE: extensions/media-preview/media/audioPreview.css]---
Location: vscode-main/extensions/media-preview/media/audioPreview.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

html, body {
	width: 100%;
	height: 100%;
	text-align: center;
}

body {
	padding: 5px 10px;
	box-sizing: border-box;
	-webkit-user-select: none;
	user-select: none;
}

.audio-container {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.container.loading,
.container.error {
	display: flex;
	justify-content: center;
	align-items: center;
}

.loading-indicator {
	width: 30px;
	height: 30px;
	background-image: url('./loading.svg');
	background-size: cover;
}

.loading-indicator,
.loading-error {
	display: none;
}

.loading .loading-indicator,
.error .loading-error {
	display: block;
}

.loading-error {
	margin: 1em;
}

.vscode-dark .loading-indicator {
	background-image: url('./loading-dark.svg');
}

.vscode-high-contrast .loading-indicator {
	background-image: url('./loading-hc.svg');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/media/audioPreview.js]---
Location: vscode-main/extensions/media-preview/media/audioPreview.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
"use strict";

(function () {
	// @ts-ignore
	const vscode = acquireVsCodeApi();

	function getSettings() {
		const element = document.getElementById('settings');
		if (element) {
			const data = element.getAttribute('data-settings');
			if (data) {
				return JSON.parse(data);
			}
		}

		throw new Error(`Could not load settings`);
	}

	const settings = getSettings();

	// State
	let hasLoadedMedia = false;

	// Elements
	const container = document.createElement('div');
	container.className = 'audio-container';
	document.body.appendChild(container);

	const audio = new Audio(settings.src === null ? undefined : settings.src);
	audio.controls = true;

	function onLoaded() {
		if (hasLoadedMedia) {
			return;
		}
		hasLoadedMedia = true;

		document.body.classList.remove('loading');
		document.body.classList.add('ready');
		container.append(audio);
	}

	audio.addEventListener('error', e => {
		if (hasLoadedMedia) {
			return;
		}

		hasLoadedMedia = true;
		document.body.classList.add('error');
		document.body.classList.remove('loading');
	});

	if (settings.src === null) {
		onLoaded();
	} else {
		audio.addEventListener('canplaythrough', () => {
			onLoaded();
		});
	}

	document.querySelector('.open-file-link')?.addEventListener('click', (e) => {
		e.preventDefault();
		vscode.postMessage({
			type: 'reopen-as-text',
		});
	});
}());
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/media/imagePreview.css]---
Location: vscode-main/extensions/media-preview/media/imagePreview.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

html, body {
	width: 100%;
	height: 100%;
	text-align: center;
}

body img {
	max-width: none;
	max-height: none;
}

.container:focus {
	outline: none !important;
}

.container {
	padding: 5px 0 0 10px;
	box-sizing: border-box;
	-webkit-user-select: none;
	user-select: none;
}

.container.image {
	padding: 0;
	display: flex;
	box-sizing: border-box;
}

.container.image img {
	padding: 0;
	background-position: 0 0, 8px 8px;
	background-size: 16px 16px;
	border: 1px solid var(--vscode-imagePreview-border);
}

.container.image img {
	background-image:
		linear-gradient(45deg, rgb(230, 230, 230) 25%, transparent 25%, transparent 75%, rgb(230, 230, 230) 75%, rgb(230, 230, 230)),
		linear-gradient(45deg, rgb(230, 230, 230) 25%, transparent 25%, transparent 75%, rgb(230, 230, 230) 75%, rgb(230, 230, 230));
}

.vscode-dark.container.image img {
	background-image:
		linear-gradient(45deg, rgb(20, 20, 20) 25%, transparent 25%, transparent 75%, rgb(20, 20, 20) 75%, rgb(20, 20, 20)),
		linear-gradient(45deg, rgb(20, 20, 20) 25%, transparent 25%, transparent 75%, rgb(20, 20, 20) 75%, rgb(20, 20, 20));
}

.container img.pixelated {
	image-rendering: pixelated;
}

.container img.scale-to-fit {
	max-width: calc(100% - 20px);
	max-height: calc(100% - 20px);
	object-fit: contain;
}

.container img {
	margin: auto;
}

.container.ready.zoom-in {
	cursor: zoom-in;
}

.container.ready.zoom-out {
	cursor: zoom-out;
}

.container .embedded-link,
.container .embedded-link:hover {
	cursor: pointer;
	text-decoration: underline;
	margin-left: 5px;
}

.container.loading,
.container.error {
	display: flex;
	justify-content: center;
	align-items: center;
}

.loading-indicator {
	width: 30px;
	height: 30px;
	background-image: url('./loading.svg');
	background-size: cover;
}

.loading-indicator,
.image-load-error {
	display: none;
}

.loading .loading-indicator,
.error .image-load-error {
	display: block;
}

.image-load-error {
	margin: 1em;
}

.vscode-dark .loading-indicator {
	background-image: url('./loading-dark.svg');
}

.vscode-high-contrast .loading-indicator {
	background-image: url('./loading-hc.svg');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/media/imagePreview.js]---
Location: vscode-main/extensions/media-preview/media/imagePreview.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
"use strict";

(function () {
	/**
	 * @param {number} value
	 * @param {number} min
	 * @param {number} max
	 * @return {number}
	 */
	function clamp(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}

	function getSettings() {
		const element = document.getElementById('image-preview-settings');
		if (element) {
			const data = element.getAttribute('data-settings');
			if (data) {
				return JSON.parse(data);
			}
		}

		throw new Error(`Could not load settings`);
	}

	/**
	 * Enable image-rendering: pixelated for images scaled by more than this.
	 */
	const PIXELATION_THRESHOLD = 3;

	const SCALE_PINCH_FACTOR = 0.075;
	const MAX_SCALE = 20;
	const MIN_SCALE = 0.1;

	const zoomLevels = [
		0.1,
		0.2,
		0.3,
		0.4,
		0.5,
		0.6,
		0.7,
		0.8,
		0.9,
		1,
		1.5,
		2,
		3,
		5,
		7,
		10,
		15,
		20
	];

	const settings = getSettings();
	const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

	// @ts-ignore
	const vscode = acquireVsCodeApi();

	const initialState = vscode.getState() || { scale: 'fit', offsetX: 0, offsetY: 0 };

	// State
	let scale = initialState.scale;
	let ctrlPressed = false;
	let altPressed = false;
	let hasLoadedImage = false;
	let consumeClick = true;
	let isActive = false;

	// Elements
	const container = document.body;
	const image = document.createElement('img');

	function updateScale(newScale) {
		if (!image || !hasLoadedImage || !image.parentElement) {
			return;
		}

		if (newScale === 'fit') {
			scale = 'fit';
			image.classList.add('scale-to-fit');
			image.classList.remove('pixelated');
			// @ts-ignore Non-standard CSS property
			image.style.zoom = 'normal';
			vscode.setState(undefined);
		} else {
			scale = clamp(newScale, MIN_SCALE, MAX_SCALE);
			if (scale >= PIXELATION_THRESHOLD) {
				image.classList.add('pixelated');
			} else {
				image.classList.remove('pixelated');
			}

			const dx = (window.scrollX + container.clientWidth / 2) / container.scrollWidth;
			const dy = (window.scrollY + container.clientHeight / 2) / container.scrollHeight;

			image.classList.remove('scale-to-fit');
			// @ts-ignore Non-standard CSS property
			image.style.zoom = scale;

			const newScrollX = container.scrollWidth * dx - container.clientWidth / 2;
			const newScrollY = container.scrollHeight * dy - container.clientHeight / 2;

			window.scrollTo(newScrollX, newScrollY);

			vscode.setState({ scale: scale, offsetX: newScrollX, offsetY: newScrollY });
		}

		vscode.postMessage({
			type: 'zoom',
			value: scale
		});
	}

	function setActive(value) {
		isActive = value;
		if (value) {
			if (isMac ? altPressed : ctrlPressed) {
				container.classList.remove('zoom-in');
				container.classList.add('zoom-out');
			} else {
				container.classList.remove('zoom-out');
				container.classList.add('zoom-in');
			}
		} else {
			ctrlPressed = false;
			altPressed = false;
			container.classList.remove('zoom-out');
			container.classList.remove('zoom-in');
		}
	}

	function firstZoom() {
		if (!image || !hasLoadedImage) {
			return;
		}

		scale = image.clientWidth / image.naturalWidth;
		updateScale(scale);
	}

	function zoomIn() {
		if (scale === 'fit') {
			firstZoom();
		}

		let i = 0;
		for (; i < zoomLevels.length; ++i) {
			if (zoomLevels[i] > scale) {
				break;
			}
		}
		updateScale(zoomLevels[i] || MAX_SCALE);
	}

	function zoomOut() {
		if (scale === 'fit') {
			firstZoom();
		}

		let i = zoomLevels.length - 1;
		for (; i >= 0; --i) {
			if (zoomLevels[i] < scale) {
				break;
			}
		}
		updateScale(zoomLevels[i] || MIN_SCALE);
	}

	window.addEventListener('keydown', (/** @type {KeyboardEvent} */ e) => {
		if (!image || !hasLoadedImage) {
			return;
		}
		ctrlPressed = e.ctrlKey;
		altPressed = e.altKey;

		if (isMac ? altPressed : ctrlPressed) {
			container.classList.remove('zoom-in');
			container.classList.add('zoom-out');
		}
	});

	window.addEventListener('keyup', (/** @type {KeyboardEvent} */ e) => {
		if (!image || !hasLoadedImage) {
			return;
		}

		ctrlPressed = e.ctrlKey;
		altPressed = e.altKey;

		if (!(isMac ? altPressed : ctrlPressed)) {
			container.classList.remove('zoom-out');
			container.classList.add('zoom-in');
		}
	});

	container.addEventListener('mousedown', (/** @type {MouseEvent} */ e) => {
		if (!image || !hasLoadedImage) {
			return;
		}

		if (e.button !== 0) {
			return;
		}

		ctrlPressed = e.ctrlKey;
		altPressed = e.altKey;

		consumeClick = !isActive;
	});

	container.addEventListener('click', (/** @type {MouseEvent} */ e) => {
		if (!image || !hasLoadedImage) {
			return;
		}

		if (e.button !== 0) {
			return;
		}

		if (consumeClick) {
			consumeClick = false;
			return;
		}
		// left click
		if (scale === 'fit') {
			firstZoom();
		}

		if (!(isMac ? altPressed : ctrlPressed)) { // zoom in
			zoomIn();
		} else {
			zoomOut();
		}
	});

	container.addEventListener('wheel', (/** @type {WheelEvent} */ e) => {
		// Prevent pinch to zoom
		if (e.ctrlKey) {
			e.preventDefault();
		}

		if (!image || !hasLoadedImage) {
			return;
		}

		const isScrollWheelKeyPressed = isMac ? altPressed : ctrlPressed;
		if (!isScrollWheelKeyPressed && !e.ctrlKey) { // pinching is reported as scroll wheel + ctrl
			return;
		}

		if (scale === 'fit') {
			firstZoom();
		}

		const delta = e.deltaY > 0 ? 1 : -1;
		updateScale(scale * (1 - delta * SCALE_PINCH_FACTOR));
	}, { passive: false });

	window.addEventListener('scroll', e => {
		if (!image || !hasLoadedImage || !image.parentElement || scale === 'fit') {
			return;
		}

		const entry = vscode.getState();
		if (entry) {
			vscode.setState({ scale: entry.scale, offsetX: window.scrollX, offsetY: window.scrollY });
		}
	}, { passive: true });

	container.classList.add('image');

	image.classList.add('scale-to-fit');

	image.addEventListener('load', () => {
		if (hasLoadedImage) {
			return;
		}
		hasLoadedImage = true;

		vscode.postMessage({
			type: 'size',
			value: `${image.naturalWidth}x${image.naturalHeight}`,
		});

		document.body.classList.remove('loading');
		document.body.classList.add('ready');
		document.body.append(image);

		updateScale(scale);

		if (initialState.scale !== 'fit') {
			window.scrollTo(initialState.offsetX, initialState.offsetY);
		}
	});

	image.addEventListener('error', e => {
		if (hasLoadedImage) {
			return;
		}

		console.error('Error loading image', e);

		hasLoadedImage = true;
		document.body.classList.add('error');
		document.body.classList.remove('loading');
	});

	image.src = settings.src;

	document.querySelector('.open-file-link')?.addEventListener('click', (e) => {
		e.preventDefault();
		vscode.postMessage({
			type: 'reopen-as-text',
		});
	});

	window.addEventListener('message', e => {
		if (e.origin !== window.origin) {
			console.error('Dropping message from unknown origin in image preview');
			return;
		}

		switch (e.data.type) {
			case 'setScale': {
				updateScale(e.data.scale);
				break;
			}
			case 'setActive': {
				setActive(e.data.value);
				break;
			}
			case 'zoomIn': {
				zoomIn();
				break;
			}
			case 'zoomOut': {
				zoomOut();
				break;
			}
			case 'copyImage': {
				copyImage();
				break;
			}
		}
	});

	document.addEventListener('copy', () => {
		copyImage();
	});

	async function copyImage(retries = 5) {
		if (!document.hasFocus() && retries > 0) {
			// copyImage is called at the same time as webview.reveal, which means this function is running whilst the webview is gaining focus.
			// Since navigator.clipboard.write requires the document to be focused, we need to wait for focus.
			// We cannot use a listener, as there is a high chance the focus is gained during the setup of the listener resulting in us missing it.
			setTimeout(() => { copyImage(retries - 1); }, 20);
			return;
		}

		try {
			await navigator.clipboard.write([new ClipboardItem({
				'image/png': new Promise((resolve, reject) => {
					const canvas = document.createElement('canvas');
					canvas.width = image.naturalWidth;
					canvas.height = image.naturalHeight;
					canvas.getContext('2d').drawImage(image, 0, 0);
					canvas.toBlob((blob) => {
						resolve(blob);
						canvas.remove();
					}, 'image/png');
				})
			})]);
		} catch (e) {
			console.error(e);
		}
	}
}());
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/media/loading-dark.svg]---
Location: vscode-main/extensions/media-preview/media/loading-dark.svg

```text
<?xml version='1.0' standalone='no' ?>
<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='10px' height='10px'>
	<style>
    circle {
      animation: ball 0.6s linear infinite;
    }

    circle:nth-child(2) { animation-delay: 0.075s; }
    circle:nth-child(3) { animation-delay: 0.15s; }
    circle:nth-child(4) { animation-delay: 0.225s; }
    circle:nth-child(5) { animation-delay: 0.3s; }
    circle:nth-child(6) { animation-delay: 0.375s; }
    circle:nth-child(7) { animation-delay: 0.45s; }
    circle:nth-child(8) { animation-delay: 0.525s; }

    @keyframes ball {
      from { opacity: 1; }
      to { opacity: 0.3; }
    }
	</style>
	<g style="fill:grey;">
		<circle cx='5' cy='1' r='1' style='opacity:0.3;' />
		<circle cx='7.8284' cy='2.1716' r='1' style='opacity:0.3;' />
		<circle cx='9' cy='5' r='1' style='opacity:0.3;' />
		<circle cx='7.8284' cy='7.8284' r='1' style='opacity:0.3;' />
		<circle cx='5' cy='9' r='1' style='opacity:0.3;' />
		<circle cx='2.1716' cy='7.8284' r='1' style='opacity:0.3;' />
		<circle cx='1' cy='5' r='1' style='opacity:0.3;' />
		<circle cx='2.1716' cy='2.1716' r='1' style='opacity:0.3;' />
	</g>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/media/loading-hc.svg]---
Location: vscode-main/extensions/media-preview/media/loading-hc.svg

```text
<?xml version='1.0' standalone='no' ?>
<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='10px' height='10px'>
	<style>
    circle {
      animation: ball 0.6s linear infinite;
    }

    circle:nth-child(2) { animation-delay: 0.075s; }
    circle:nth-child(3) { animation-delay: 0.15s; }
    circle:nth-child(4) { animation-delay: 0.225s; }
    circle:nth-child(5) { animation-delay: 0.3s; }
    circle:nth-child(6) { animation-delay: 0.375s; }
    circle:nth-child(7) { animation-delay: 0.45s; }
    circle:nth-child(8) { animation-delay: 0.525s; }

    @keyframes ball {
      from { opacity: 1; }
      to { opacity: 0.3; }
    }
	</style>
	<g style="fill:white;">
		<circle cx='5' cy='1' r='1' style='opacity:0.3;' />
		<circle cx='7.8284' cy='2.1716' r='1' style='opacity:0.3;' />
		<circle cx='9' cy='5' r='1' style='opacity:0.3;' />
		<circle cx='7.8284' cy='7.8284' r='1' style='opacity:0.3;' />
		<circle cx='5' cy='9' r='1' style='opacity:0.3;' />
		<circle cx='2.1716' cy='7.8284' r='1' style='opacity:0.3;' />
		<circle cx='1' cy='5' r='1' style='opacity:0.3;' />
		<circle cx='2.1716' cy='2.1716' r='1' style='opacity:0.3;' />
	</g>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/media/loading.svg]---
Location: vscode-main/extensions/media-preview/media/loading.svg

```text
<?xml version='1.0' standalone='no' ?>
<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='10px' height='10px'>
	<style>
    circle {
      animation: ball 0.6s linear infinite;
    }

    circle:nth-child(2) { animation-delay: 0.075s; }
    circle:nth-child(3) { animation-delay: 0.15s; }
    circle:nth-child(4) { animation-delay: 0.225s; }
    circle:nth-child(5) { animation-delay: 0.3s; }
    circle:nth-child(6) { animation-delay: 0.375s; }
    circle:nth-child(7) { animation-delay: 0.45s; }
    circle:nth-child(8) { animation-delay: 0.525s; }

    @keyframes ball {
      from { opacity: 1; }
      to { opacity: 0.3; }
    }
	</style>
	<g>
		<circle cx='5' cy='1' r='1' style='opacity:0.3;' />
		<circle cx='7.8284' cy='2.1716' r='1' style='opacity:0.3;' />
		<circle cx='9' cy='5' r='1' style='opacity:0.3;' />
		<circle cx='7.8284' cy='7.8284' r='1' style='opacity:0.3;' />
		<circle cx='5' cy='9' r='1' style='opacity:0.3;' />
		<circle cx='2.1716' cy='7.8284' r='1' style='opacity:0.3;' />
		<circle cx='1' cy='5' r='1' style='opacity:0.3;' />
		<circle cx='2.1716' cy='2.1716' r='1' style='opacity:0.3;' />
	</g>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/media/videoPreview.css]---
Location: vscode-main/extensions/media-preview/media/videoPreview.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

html {
	width: 100%;
	height: 100%;
	text-align: center;
}

body {
	padding: 5px 10px;
	width: calc(100% - 20px);
	height: calc(100% - 10px);
	display: flex;
	justify-content: center;
	align-items: center;
	-webkit-user-select: none;
	user-select: none;
}

.loading-indicator {
	width: 30px;
	height: 30px;
	background-image: url('./loading.svg');
	background-size: cover;
}

.loading-indicator,
.loading-error {
	display: none;
}

.loading .loading-indicator,
.error .loading-error {
	display: block;
}

.loading-error {
	margin: 1em;
}

.vscode-dark .loading-indicator {
	background-image: url('./loading-dark.svg');
}

.vscode-high-contrast .loading-indicator {
	background-image: url('./loading-hc.svg');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/media/videoPreview.js]---
Location: vscode-main/extensions/media-preview/media/videoPreview.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
"use strict";

(function () {
	// @ts-ignore
	const vscode = acquireVsCodeApi();

	function getSettings() {
		const element = document.getElementById('settings');
		if (element) {
			const data = element.getAttribute('data-settings');
			if (data) {
				return JSON.parse(data);
			}
		}

		throw new Error(`Could not load settings`);
	}

	const settings = getSettings();

	// State
	let hasLoadedMedia = false;

	// Elements
	const video = document.createElement('video');
	if (settings.src !== null) {
		video.src = settings.src;
	}
	video.playsInline = true;
	video.controls = true;
	video.autoplay = settings.autoplay;
	video.muted = settings.autoplay;
	video.loop = settings.loop;

	function onLoaded() {
		if (hasLoadedMedia) {
			return;
		}
		hasLoadedMedia = true;

		document.body.classList.remove('loading');
		document.body.classList.add('ready');
		document.body.append(video);
	}

	video.addEventListener('error', e => {
		if (hasLoadedMedia) {
			return;
		}

		hasLoadedMedia = true;
		document.body.classList.add('error');
		document.body.classList.remove('loading');
	});

	if (settings.src === null) {
		onLoaded();
	} else {
		video.addEventListener('canplaythrough', () => {
			onLoaded();
		});
	}

	document.querySelector('.open-file-link')?.addEventListener('click', (e) => {
		e.preventDefault();
		vscode.postMessage({
			type: 'reopen-as-text',
		});
	});
}());
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/src/audioPreview.ts]---
Location: vscode-main/extensions/media-preview/src/audioPreview.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { BinarySizeStatusBarEntry } from './binarySizeStatusBarEntry';
import { MediaPreview, reopenAsText } from './mediaPreview';
import { escapeAttribute } from './util/dom';
import { generateUuid } from './util/uuid';

class AudioPreviewProvider implements vscode.CustomReadonlyEditorProvider {

	public static readonly viewType = 'vscode.audioPreview';

	constructor(
		private readonly extensionRoot: vscode.Uri,
		private readonly binarySizeStatusBarEntry: BinarySizeStatusBarEntry,
	) { }

	public async openCustomDocument(uri: vscode.Uri) {
		return { uri, dispose: () => { } };
	}

	public async resolveCustomEditor(document: vscode.CustomDocument, webviewEditor: vscode.WebviewPanel): Promise<void> {
		new AudioPreview(this.extensionRoot, document.uri, webviewEditor, this.binarySizeStatusBarEntry);
	}
}


class AudioPreview extends MediaPreview {

	constructor(
		private readonly extensionRoot: vscode.Uri,
		resource: vscode.Uri,
		webviewEditor: vscode.WebviewPanel,
		binarySizeStatusBarEntry: BinarySizeStatusBarEntry,
	) {
		super(extensionRoot, resource, webviewEditor, binarySizeStatusBarEntry);

		this._register(webviewEditor.webview.onDidReceiveMessage(message => {
			switch (message.type) {
				case 'reopen-as-text': {
					reopenAsText(resource, webviewEditor.viewColumn);
					break;
				}
			}
		}));

		this.updateBinarySize();
		this.render();
		this.updateState();
	}

	protected async getWebviewContents(): Promise<string> {
		const version = Date.now().toString();
		const settings = {
			src: await this.getResourcePath(this._webviewEditor, this._resource, version),
		};

		const nonce = generateUuid();

		const cspSource = this._webviewEditor.webview.cspSource;
		return /* html */`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">

	<!-- Disable pinch zooming -->
	<meta name="viewport"
		content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">

	<title>Audio Preview</title>

	<link rel="stylesheet" href="${escapeAttribute(this.extensionResource('media', 'audioPreview.css'))}" type="text/css" media="screen" nonce="${nonce}">

	<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: ${cspSource}; media-src ${cspSource}; script-src 'nonce-${nonce}'; style-src ${cspSource} 'nonce-${nonce}';">
	<meta id="settings" data-settings="${escapeAttribute(JSON.stringify(settings))}">
</head>
<body class="container loading" data-vscode-context='{ "preventDefaultContextMenuItems": true }'>
	<div class="loading-indicator"></div>
	<div class="loading-error">
		<p>${vscode.l10n.t("An error occurred while loading the audio file.")}</p>
		<a href="#" class="open-file-link">${vscode.l10n.t("Open file using VS Code's standard text/binary editor?")}</a>
	</div>
	<script src="${escapeAttribute(this.extensionResource('media', 'audioPreview.js'))}" nonce="${nonce}"></script>
</body>
</html>`;
	}

	private async getResourcePath(webviewEditor: vscode.WebviewPanel, resource: vscode.Uri, version: string): Promise<string | null> {
		if (resource.scheme === 'git') {
			const stat = await vscode.workspace.fs.stat(resource);
			if (stat.size === 0) {
				// The file is stored on git lfs
				return null;
			}
		}

		// Avoid adding cache busting if there is already a query string
		if (resource.query) {
			return webviewEditor.webview.asWebviewUri(resource).toString();
		}
		return webviewEditor.webview.asWebviewUri(resource).with({ query: `version=${version}` }).toString();
	}

	private extensionResource(...parts: string[]) {
		return this._webviewEditor.webview.asWebviewUri(vscode.Uri.joinPath(this.extensionRoot, ...parts));
	}
}

export function registerAudioPreviewSupport(context: vscode.ExtensionContext, binarySizeStatusBarEntry: BinarySizeStatusBarEntry): vscode.Disposable {
	const provider = new AudioPreviewProvider(context.extensionUri, binarySizeStatusBarEntry);
	return vscode.window.registerCustomEditorProvider(AudioPreviewProvider.viewType, provider, {
		supportsMultipleEditorsPerDocument: true,
		webviewOptions: {
			retainContextWhenHidden: true,
		}
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/src/binarySizeStatusBarEntry.ts]---
Location: vscode-main/extensions/media-preview/src/binarySizeStatusBarEntry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { PreviewStatusBarEntry } from './ownedStatusBarEntry';


class BinarySize {
	static readonly KB = 1024;
	static readonly MB = BinarySize.KB * BinarySize.KB;
	static readonly GB = BinarySize.MB * BinarySize.KB;
	static readonly TB = BinarySize.GB * BinarySize.KB;

	static formatSize(size: number): string {
		if (size < BinarySize.KB) {
			return vscode.l10n.t("{0}B", size);
		}

		if (size < BinarySize.MB) {
			return vscode.l10n.t("{0}KB", (size / BinarySize.KB).toFixed(2));
		}

		if (size < BinarySize.GB) {
			return vscode.l10n.t("{0}MB", (size / BinarySize.MB).toFixed(2));
		}

		if (size < BinarySize.TB) {
			return vscode.l10n.t("{0}GB", (size / BinarySize.GB).toFixed(2));
		}

		return vscode.l10n.t("{0}TB", (size / BinarySize.TB).toFixed(2));
	}
}

export class BinarySizeStatusBarEntry extends PreviewStatusBarEntry {

	constructor() {
		super('status.imagePreview.binarySize', vscode.l10n.t("Image Binary Size"), vscode.StatusBarAlignment.Right, 100);
	}

	public show(owner: unknown, size: number | undefined) {
		if (typeof size === 'number') {
			super.showItem(owner, BinarySize.formatSize(size));
		} else {
			this.hide(owner);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/src/extension.ts]---
Location: vscode-main/extensions/media-preview/src/extension.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { registerAudioPreviewSupport } from './audioPreview';
import { BinarySizeStatusBarEntry } from './binarySizeStatusBarEntry';
import { registerImagePreviewSupport } from './imagePreview';
import { registerVideoPreviewSupport } from './videoPreview';

export function activate(context: vscode.ExtensionContext) {
	const binarySizeStatusBarEntry = new BinarySizeStatusBarEntry();
	context.subscriptions.push(binarySizeStatusBarEntry);

	context.subscriptions.push(registerImagePreviewSupport(context, binarySizeStatusBarEntry));
	context.subscriptions.push(registerAudioPreviewSupport(context, binarySizeStatusBarEntry));
	context.subscriptions.push(registerVideoPreviewSupport(context, binarySizeStatusBarEntry));
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/src/mediaPreview.ts]---
Location: vscode-main/extensions/media-preview/src/mediaPreview.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Utils } from 'vscode-uri';
import { BinarySizeStatusBarEntry } from './binarySizeStatusBarEntry';
import { Disposable } from './util/dispose';

export async function reopenAsText(resource: vscode.Uri, viewColumn: vscode.ViewColumn | undefined): Promise<void> {
	await vscode.commands.executeCommand('vscode.openWith', resource, 'default', viewColumn);
}

export const enum PreviewState {
	Disposed,
	Visible,
	Active,
}

export abstract class MediaPreview extends Disposable {

	protected previewState = PreviewState.Visible;
	private _binarySize: number | undefined;

	constructor(
		extensionRoot: vscode.Uri,
		protected readonly _resource: vscode.Uri,
		protected readonly _webviewEditor: vscode.WebviewPanel,
		private readonly _binarySizeStatusBarEntry: BinarySizeStatusBarEntry,
	) {
		super();

		_webviewEditor.webview.options = {
			enableScripts: true,
			enableForms: false,
			localResourceRoots: [
				Utils.dirname(_resource),
				extensionRoot,
			]
		};

		this._register(_webviewEditor.onDidChangeViewState(() => {
			this.updateState();
		}));

		this._register(_webviewEditor.onDidDispose(() => {
			this.previewState = PreviewState.Disposed;
			this.dispose();
		}));

		const watcher = this._register(vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(_resource, '*')));
		this._register(watcher.onDidChange(e => {
			if (e.toString() === this._resource.toString()) {
				this.updateBinarySize();
				this.render();
			}
		}));

		this._register(watcher.onDidDelete(e => {
			if (e.toString() === this._resource.toString()) {
				this._webviewEditor.dispose();
			}
		}));
	}

	public override dispose() {
		super.dispose();
		this._binarySizeStatusBarEntry.hide(this);
	}

	public get resource() {
		return this._resource;
	}

	protected updateBinarySize() {
		vscode.workspace.fs.stat(this._resource).then(({ size }) => {
			this._binarySize = size;
			this.updateState();
		});
	}

	protected async render() {
		if (this.previewState === PreviewState.Disposed) {
			return;
		}

		const content = await this.getWebviewContents();
		if (this.previewState as PreviewState === PreviewState.Disposed) {
			return;
		}

		this._webviewEditor.webview.html = content;
	}

	protected abstract getWebviewContents(): Promise<string>;

	protected updateState() {
		if (this.previewState === PreviewState.Disposed) {
			return;
		}

		if (this._webviewEditor.active) {
			this.previewState = PreviewState.Active;
			this._binarySizeStatusBarEntry.show(this, this._binarySize);
		} else {
			this._binarySizeStatusBarEntry.hide(this);
			this.previewState = PreviewState.Visible;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/src/ownedStatusBarEntry.ts]---
Location: vscode-main/extensions/media-preview/src/ownedStatusBarEntry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Disposable } from './util/dispose';

export abstract class PreviewStatusBarEntry extends Disposable {
	private _showOwner: unknown | undefined;

	protected readonly entry: vscode.StatusBarItem;

	constructor(id: string, name: string, alignment: vscode.StatusBarAlignment, priority: number) {
		super();
		this.entry = this._register(vscode.window.createStatusBarItem(id, alignment, priority));
		this.entry.name = name;
	}

	protected showItem(owner: unknown, text: string) {
		this._showOwner = owner;
		this.entry.text = text;
		this.entry.show();
	}

	public hide(owner: unknown) {
		if (owner === this._showOwner) {
			this.entry.hide();
			this._showOwner = undefined;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/src/videoPreview.ts]---
Location: vscode-main/extensions/media-preview/src/videoPreview.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { BinarySizeStatusBarEntry } from './binarySizeStatusBarEntry';
import { MediaPreview, reopenAsText } from './mediaPreview';
import { escapeAttribute } from './util/dom';
import { generateUuid } from './util/uuid';


class VideoPreviewProvider implements vscode.CustomReadonlyEditorProvider {

	public static readonly viewType = 'vscode.videoPreview';

	constructor(
		private readonly extensionRoot: vscode.Uri,
		private readonly binarySizeStatusBarEntry: BinarySizeStatusBarEntry,
	) { }

	public async openCustomDocument(uri: vscode.Uri) {
		return { uri, dispose: () => { } };
	}

	public async resolveCustomEditor(document: vscode.CustomDocument, webviewEditor: vscode.WebviewPanel): Promise<void> {
		new VideoPreview(this.extensionRoot, document.uri, webviewEditor, this.binarySizeStatusBarEntry);
	}
}


class VideoPreview extends MediaPreview {

	constructor(
		private readonly extensionRoot: vscode.Uri,
		resource: vscode.Uri,
		webviewEditor: vscode.WebviewPanel,
		binarySizeStatusBarEntry: BinarySizeStatusBarEntry,
	) {
		super(extensionRoot, resource, webviewEditor, binarySizeStatusBarEntry);

		this._register(webviewEditor.webview.onDidReceiveMessage(message => {
			switch (message.type) {
				case 'reopen-as-text': {
					reopenAsText(resource, webviewEditor.viewColumn);
					break;
				}
			}
		}));

		this.updateBinarySize();
		this.render();
		this.updateState();
	}

	protected async getWebviewContents(): Promise<string> {
		const version = Date.now().toString();
		const configurations = vscode.workspace.getConfiguration('mediaPreview.video');
		const settings = {
			src: await this.getResourcePath(this._webviewEditor, this._resource, version),
			autoplay: configurations.get('autoPlay'),
			loop: configurations.get('loop'),
		};

		const nonce = generateUuid();

		const cspSource = this._webviewEditor.webview.cspSource;
		return /* html */`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">

	<!-- Disable pinch zooming -->
	<meta name="viewport"
		content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">

	<title>Video Preview</title>

	<link rel="stylesheet" href="${escapeAttribute(this.extensionResource('media', 'videoPreview.css'))}" type="text/css" media="screen" nonce="${nonce}">

	<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: ${cspSource}; media-src ${cspSource}; script-src 'nonce-${nonce}'; style-src ${cspSource} 'nonce-${nonce}';">
	<meta id="settings" data-settings="${escapeAttribute(JSON.stringify(settings))}">
</head>
<body class="loading" data-vscode-context='{ "preventDefaultContextMenuItems": true }'>
	<div class="loading-indicator"></div>
	<div class="loading-error">
		<p>${vscode.l10n.t("An error occurred while loading the video file.")}</p>
		<a href="#" class="open-file-link">${vscode.l10n.t("Open file using VS Code's standard text/binary editor?")}</a>
	</div>
	<script src="${escapeAttribute(this.extensionResource('media', 'videoPreview.js'))}" nonce="${nonce}"></script>
</body>
</html>`;
	}

	private async getResourcePath(webviewEditor: vscode.WebviewPanel, resource: vscode.Uri, version: string): Promise<string | null> {
		if (resource.scheme === 'git') {
			const stat = await vscode.workspace.fs.stat(resource);
			if (stat.size === 0) {
				// The file is stored on git lfs
				return null;
			}
		}

		// Avoid adding cache busting if there is already a query string
		if (resource.query) {
			return webviewEditor.webview.asWebviewUri(resource).toString();
		}
		return webviewEditor.webview.asWebviewUri(resource).with({ query: `version=${version}` }).toString();
	}

	private extensionResource(...parts: string[]) {
		return this._webviewEditor.webview.asWebviewUri(vscode.Uri.joinPath(this.extensionRoot, ...parts));
	}
}

export function registerVideoPreviewSupport(context: vscode.ExtensionContext, binarySizeStatusBarEntry: BinarySizeStatusBarEntry): vscode.Disposable {
	const provider = new VideoPreviewProvider(context.extensionUri, binarySizeStatusBarEntry);
	return vscode.window.registerCustomEditorProvider(VideoPreviewProvider.viewType, provider, {
		supportsMultipleEditorsPerDocument: true,
		webviewOptions: {
			retainContextWhenHidden: true,
		}
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/src/imagePreview/index.ts]---
Location: vscode-main/extensions/media-preview/src/imagePreview/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { BinarySizeStatusBarEntry } from '../binarySizeStatusBarEntry';
import { MediaPreview, PreviewState, reopenAsText } from '../mediaPreview';
import { escapeAttribute } from '../util/dom';
import { generateUuid } from '../util/uuid';
import { SizeStatusBarEntry } from './sizeStatusBarEntry';
import { Scale, ZoomStatusBarEntry } from './zoomStatusBarEntry';


export class ImagePreviewManager implements vscode.CustomReadonlyEditorProvider {

	public static readonly viewType = 'imagePreview.previewEditor';

	private readonly _previews = new Set<ImagePreview>();
	private _activePreview: ImagePreview | undefined;

	constructor(
		private readonly extensionRoot: vscode.Uri,
		private readonly sizeStatusBarEntry: SizeStatusBarEntry,
		private readonly binarySizeStatusBarEntry: BinarySizeStatusBarEntry,
		private readonly zoomStatusBarEntry: ZoomStatusBarEntry,
	) { }

	public async openCustomDocument(uri: vscode.Uri) {
		return { uri, dispose: () => { } };
	}

	public async resolveCustomEditor(
		document: vscode.CustomDocument,
		webviewEditor: vscode.WebviewPanel,
	): Promise<void> {
		const preview = new ImagePreview(this.extensionRoot, document.uri, webviewEditor, this.sizeStatusBarEntry, this.binarySizeStatusBarEntry, this.zoomStatusBarEntry);
		this._previews.add(preview);
		this.setActivePreview(preview);

		webviewEditor.onDidDispose(() => { this._previews.delete(preview); });

		webviewEditor.onDidChangeViewState(() => {
			if (webviewEditor.active) {
				this.setActivePreview(preview);
			} else if (this._activePreview === preview && !webviewEditor.active) {
				this.setActivePreview(undefined);
			}
		});
	}

	public get activePreview() {
		return this._activePreview;
	}

	public getPreviewFor(resource: vscode.Uri, viewColumn?: vscode.ViewColumn): ImagePreview | undefined {
		for (const preview of this._previews) {
			if (preview.resource.toString() === resource.toString()) {
				if (!viewColumn || preview.viewColumn === viewColumn) {
					return preview;
				}
			}
		}
		return undefined;
	}

	private setActivePreview(value: ImagePreview | undefined): void {
		this._activePreview = value;
	}
}


class ImagePreview extends MediaPreview {

	private _imageSize: string | undefined;
	private _imageZoom: Scale | undefined;

	private readonly emptyPngDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR42gEFAPr/AP///wAI/AL+Sr4t6gAAAABJRU5ErkJggg==';

	constructor(
		private readonly extensionRoot: vscode.Uri,
		resource: vscode.Uri,
		webviewEditor: vscode.WebviewPanel,
		private readonly sizeStatusBarEntry: SizeStatusBarEntry,
		binarySizeStatusBarEntry: BinarySizeStatusBarEntry,
		private readonly zoomStatusBarEntry: ZoomStatusBarEntry,
	) {
		super(extensionRoot, resource, webviewEditor, binarySizeStatusBarEntry);

		this._register(webviewEditor.webview.onDidReceiveMessage(message => {
			switch (message.type) {
				case 'size': {
					this._imageSize = message.value;
					this.updateState();
					break;
				}
				case 'zoom': {
					this._imageZoom = message.value;
					this.updateState();
					break;
				}
				case 'reopen-as-text': {
					reopenAsText(resource, webviewEditor.viewColumn);
					break;
				}
			}
		}));

		this._register(zoomStatusBarEntry.onDidChangeScale(e => {
			if (this.previewState === PreviewState.Active) {
				this._webviewEditor.webview.postMessage({ type: 'setScale', scale: e.scale });
			}
		}));

		this._register(webviewEditor.onDidChangeViewState(() => {
			this._webviewEditor.webview.postMessage({ type: 'setActive', value: this._webviewEditor.active });
		}));

		this._register(webviewEditor.onDidDispose(() => {
			if (this.previewState === PreviewState.Active) {
				this.sizeStatusBarEntry.hide(this);
				this.zoomStatusBarEntry.hide(this);
			}
			this.previewState = PreviewState.Disposed;
		}));

		this.updateBinarySize();
		this.render();
		this.updateState();
	}

	public override dispose(): void {
		super.dispose();
		this.sizeStatusBarEntry.hide(this);
		this.zoomStatusBarEntry.hide(this);
	}

	public get viewColumn() {
		return this._webviewEditor.viewColumn;
	}

	public zoomIn() {
		if (this.previewState === PreviewState.Active) {
			this._webviewEditor.webview.postMessage({ type: 'zoomIn' });
		}
	}

	public zoomOut() {
		if (this.previewState === PreviewState.Active) {
			this._webviewEditor.webview.postMessage({ type: 'zoomOut' });
		}
	}

	public copyImage() {
		if (this.previewState === PreviewState.Active) {
			this._webviewEditor.reveal();
			this._webviewEditor.webview.postMessage({ type: 'copyImage' });
		}
	}

	protected override updateState() {
		super.updateState();

		if (this.previewState === PreviewState.Disposed) {
			return;
		}

		if (this._webviewEditor.active) {
			this.sizeStatusBarEntry.show(this, this._imageSize || '');
			this.zoomStatusBarEntry.show(this, this._imageZoom || 'fit');
		} else {
			this.sizeStatusBarEntry.hide(this);
			this.zoomStatusBarEntry.hide(this);
		}
	}

	protected override async render(): Promise<void> {
		await super.render();
		this._webviewEditor.webview.postMessage({ type: 'setActive', value: this._webviewEditor.active });
	}

	protected override async getWebviewContents(): Promise<string> {
		const version = Date.now().toString();
		const settings = {
			src: await this.getResourcePath(this._webviewEditor, this._resource, version),
		};

		const nonce = generateUuid();

		const cspSource = this._webviewEditor.webview.cspSource;
		return /* html */`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">

	<!-- Disable pinch zooming -->
	<meta name="viewport"
		content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">

	<title>Image Preview</title>

	<link rel="stylesheet" href="${escapeAttribute(this.extensionResource('media', 'imagePreview.css'))}" type="text/css" media="screen" nonce="${nonce}">

	<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: ${cspSource}; connect-src ${cspSource}; script-src 'nonce-${nonce}'; style-src ${cspSource} 'nonce-${nonce}';">
	<meta id="image-preview-settings" data-settings="${escapeAttribute(JSON.stringify(settings))}">
</head>
<body class="container image scale-to-fit loading" data-vscode-context='{ "preventDefaultContextMenuItems": true }'>
	<div class="loading-indicator"></div>
	<div class="image-load-error">
		<p>${vscode.l10n.t("An error occurred while loading the image.")}</p>
		<a href="#" class="open-file-link">${vscode.l10n.t("Open file using VS Code's standard text/binary editor?")}</a>
	</div>
	<script src="${escapeAttribute(this.extensionResource('media', 'imagePreview.js'))}" nonce="${nonce}"></script>
</body>
</html>`;
	}

	private async getResourcePath(webviewEditor: vscode.WebviewPanel, resource: vscode.Uri, version: string): Promise<string> {
		if (resource.scheme === 'git') {
			const stat = await vscode.workspace.fs.stat(resource);
			if (stat.size === 0) {
				return this.emptyPngDataUri;
			}
		}

		// Avoid adding cache busting if there is already a query string
		if (resource.query) {
			return webviewEditor.webview.asWebviewUri(resource).toString();
		}
		return webviewEditor.webview.asWebviewUri(resource).with({ query: `version=${version}` }).toString();
	}

	private extensionResource(...parts: string[]) {
		return this._webviewEditor.webview.asWebviewUri(vscode.Uri.joinPath(this.extensionRoot, ...parts));
	}

	public async reopenAsText() {
		await vscode.commands.executeCommand('reopenActiveEditorWith', 'default');
		this._webviewEditor.dispose();
	}
}


export function registerImagePreviewSupport(context: vscode.ExtensionContext, binarySizeStatusBarEntry: BinarySizeStatusBarEntry): vscode.Disposable {
	const disposables: vscode.Disposable[] = [];

	const sizeStatusBarEntry = new SizeStatusBarEntry();
	disposables.push(sizeStatusBarEntry);

	const zoomStatusBarEntry = new ZoomStatusBarEntry();
	disposables.push(zoomStatusBarEntry);

	const previewManager = new ImagePreviewManager(context.extensionUri, sizeStatusBarEntry, binarySizeStatusBarEntry, zoomStatusBarEntry);

	disposables.push(vscode.window.registerCustomEditorProvider(ImagePreviewManager.viewType, previewManager, {
		supportsMultipleEditorsPerDocument: true,
	}));

	disposables.push(vscode.commands.registerCommand('imagePreview.zoomIn', () => {
		previewManager.activePreview?.zoomIn();
	}));

	disposables.push(vscode.commands.registerCommand('imagePreview.zoomOut', () => {
		previewManager.activePreview?.zoomOut();
	}));

	disposables.push(vscode.commands.registerCommand('imagePreview.copyImage', () => {
		previewManager.activePreview?.copyImage();
	}));

	disposables.push(vscode.commands.registerCommand('imagePreview.reopenAsText', async () => {
		return previewManager.activePreview?.reopenAsText();
	}));

	disposables.push(vscode.commands.registerCommand('imagePreview.reopenAsPreview', async () => {

		await vscode.commands.executeCommand('reopenActiveEditorWith', ImagePreviewManager.viewType);
	}));

	return vscode.Disposable.from(...disposables);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/src/imagePreview/sizeStatusBarEntry.ts]---
Location: vscode-main/extensions/media-preview/src/imagePreview/sizeStatusBarEntry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { PreviewStatusBarEntry } from '../ownedStatusBarEntry';


export class SizeStatusBarEntry extends PreviewStatusBarEntry {

	constructor() {
		super('status.imagePreview.size', vscode.l10n.t("Image Size"), vscode.StatusBarAlignment.Right, 101 /* to the left of editor status (100) */);
	}

	public show(owner: unknown, text: string) {
		this.showItem(owner, text);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/src/imagePreview/zoomStatusBarEntry.ts]---
Location: vscode-main/extensions/media-preview/src/imagePreview/zoomStatusBarEntry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { PreviewStatusBarEntry as OwnedStatusBarEntry } from '../ownedStatusBarEntry';


const selectZoomLevelCommandId = '_imagePreview.selectZoomLevel';

export type Scale = number | 'fit';

export class ZoomStatusBarEntry extends OwnedStatusBarEntry {

	private readonly _onDidChangeScale = this._register(new vscode.EventEmitter<{ scale: Scale }>());
	public readonly onDidChangeScale = this._onDidChangeScale.event;

	constructor() {
		super('status.imagePreview.zoom', vscode.l10n.t("Image Zoom"), vscode.StatusBarAlignment.Right, 102 /* to the left of editor size entry (101) */);

		this._register(vscode.commands.registerCommand(selectZoomLevelCommandId, async () => {
			type MyPickItem = vscode.QuickPickItem & { scale: Scale };

			const scales: Scale[] = [10, 5, 2, 1, 0.5, 0.2, 'fit'];
			const options = scales.map((scale): MyPickItem => ({
				label: this.zoomLabel(scale),
				scale
			}));

			const pick = await vscode.window.showQuickPick(options, {
				placeHolder: vscode.l10n.t("Select zoom level")
			});
			if (pick) {
				this._onDidChangeScale.fire({ scale: pick.scale });
			}
		}));

		this.entry.command = selectZoomLevelCommandId;
	}

	public show(owner: unknown, scale: Scale) {
		this.showItem(owner, this.zoomLabel(scale));
	}

	private zoomLabel(scale: Scale): string {
		return scale === 'fit'
			? vscode.l10n.t("Whole Image")
			: `${Math.round(scale * 100)}%`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/src/util/dispose.ts]---
Location: vscode-main/extensions/media-preview/src/util/dispose.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export function disposeAll(disposables: vscode.Disposable[]) {
	while (disposables.length) {
		const item = disposables.pop();
		if (item) {
			item.dispose();
		}
	}
}

export abstract class Disposable {
	private _isDisposed = false;

	protected _disposables: vscode.Disposable[] = [];

	public dispose(): any {
		if (this._isDisposed) {
			return;
		}
		this._isDisposed = true;
		disposeAll(this._disposables);
	}

	protected _register<T extends vscode.Disposable>(value: T): T {
		if (this._isDisposed) {
			value.dispose();
		} else {
			this._disposables.push(value);
		}
		return value;
	}

	protected get isDisposed() {
		return this._isDisposed;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/src/util/dom.ts]---
Location: vscode-main/extensions/media-preview/src/util/dom.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as vscode from 'vscode';

export function escapeAttribute(value: string | vscode.Uri): string {
	return value.toString().replace(/"/g, '&quot;');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/media-preview/src/util/uuid.ts]---
Location: vscode-main/extensions/media-preview/src/util/uuid.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

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
```

--------------------------------------------------------------------------------

---[FILE: extensions/merge-conflict/.npmrc]---
Location: vscode-main/extensions/merge-conflict/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/merge-conflict/.vscodeignore]---
Location: vscode-main/extensions/merge-conflict/.vscodeignore

```text
src/**
tsconfig.json
out/**
extension.webpack.config.js
extension-browser.webpack.config.js
package-lock.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/merge-conflict/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/merge-conflict/extension-browser.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import { browser as withBrowserDefaults } from '../shared.webpack.config.mjs';

export default withBrowserDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/mergeConflictMain.ts'
	},
	output: {
		filename: 'mergeConflictMain.js'
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/merge-conflict/extension.webpack.config.js]---
Location: vscode-main/extensions/merge-conflict/extension.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import withDefaults from '../shared.webpack.config.mjs';

export default withDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/mergeConflictMain.ts'
	},
	output: {
		filename: 'mergeConflictMain.js'
	},
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/merge-conflict/package-lock.json]---
Location: vscode-main/extensions/merge-conflict/package-lock.json

```json
{
  "name": "merge-conflict",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "merge-conflict",
      "version": "1.0.0",
      "license": "MIT",
      "dependencies": {
        "@vscode/extension-telemetry": "^0.9.8"
      },
      "devDependencies": {
        "@types/node": "22.x"
      },
      "engines": {
        "vscode": "^1.5.0"
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

---[FILE: extensions/merge-conflict/package.json]---
Location: vscode-main/extensions/merge-conflict/package.json

```json
{
  "name": "merge-conflict",
  "publisher": "vscode",
  "displayName": "%displayName%",
  "description": "%description%",
  "icon": "media/icon.png",
  "version": "1.0.0",
  "license": "MIT",
  "aiKey": "0c6ae279ed8443289764825290e4f9e2-1a736e7c-1324-4338-be46-fc2a58ae4d14-7255",
  "engines": {
    "vscode": "^1.5.0"
  },
  "categories": [
    "Other"
  ],
  "capabilities": {
    "virtualWorkspaces": true,
    "untrustedWorkspaces": {
      "supported": true
    }
  },
  "activationEvents": [
    "onStartupFinished"
  ],
  "main": "./out/mergeConflictMain",
  "browser": "./dist/browser/mergeConflictMain",
  "scripts": {
    "compile": "gulp compile-extension:merge-conflict",
    "watch": "gulp watch-extension:merge-conflict"
  },
  "contributes": {
    "commands": [
      {
        "category": "%command.category%",
        "title": "%command.accept.all-current%",
        "original": "Accept All Current",
        "command": "merge-conflict.accept.all-current",
        "enablement": "!isMergeEditor"
      },
      {
        "category": "%command.category%",
        "title": "%command.accept.all-incoming%",
        "original": "Accept All Incoming",
        "command": "merge-conflict.accept.all-incoming",
        "enablement": "!isMergeEditor"
      },
      {
        "category": "%command.category%",
        "title": "%command.accept.all-both%",
        "original": "Accept All Both",
        "command": "merge-conflict.accept.all-both",
        "enablement": "!isMergeEditor"
      },
      {
        "category": "%command.category%",
        "title": "%command.accept.current%",
        "original": "Accept Current",
        "command": "merge-conflict.accept.current",
        "enablement": "!isMergeEditor"
      },
      {
        "category": "%command.category%",
        "title": "%command.accept.incoming%",
        "original": "Accept Incoming",
        "command": "merge-conflict.accept.incoming",
        "enablement": "!isMergeEditor"
      },
      {
        "category": "%command.category%",
        "title": "%command.accept.selection%",
        "original": "Accept Selection",
        "command": "merge-conflict.accept.selection",
        "enablement": "!isMergeEditor"
      },
      {
        "category": "%command.category%",
        "title": "%command.accept.both%",
        "original": "Accept Both",
        "command": "merge-conflict.accept.both",
        "enablement": "!isMergeEditor"
      },
      {
        "category": "%command.category%",
        "title": "%command.next%",
        "original": "Next Conflict",
        "command": "merge-conflict.next",
        "enablement": "!isMergeEditor",
        "icon": "$(arrow-down)"
      },
      {
        "category": "%command.category%",
        "title": "%command.previous%",
        "original": "Previous Conflict",
        "command": "merge-conflict.previous",
        "enablement": "!isMergeEditor",
        "icon": "$(arrow-up)"
      },
      {
        "category": "%command.category%",
        "title": "%command.compare%",
        "original": "Compare Current Conflict",
        "command": "merge-conflict.compare",
        "enablement": "!isMergeEditor"
      }
    ],
    "menus": {
      "scm/resourceState/context": [
        {
          "command": "merge-conflict.accept.all-current",
          "when": "scmProvider == git && scmResourceGroup == merge",
          "group": "1_modification"
        },
        {
          "command": "merge-conflict.accept.all-incoming",
          "when": "scmProvider == git && scmResourceGroup == merge",
          "group": "1_modification"
        }
      ],
      "editor/title": [
        {
          "command": "merge-conflict.previous",
          "group": "navigation@1",
          "when": "!isMergeEditor && mergeConflictsCount && mergeConflictsCount != 0"
        },
        {
          "command": "merge-conflict.next",
          "group": "navigation@2",
          "when": "!isMergeEditor && mergeConflictsCount && mergeConflictsCount != 0"
        }
      ]
    },
    "configuration": {
      "title": "%config.title%",
      "properties": {
        "merge-conflict.codeLens.enabled": {
          "type": "boolean",
          "description": "%config.codeLensEnabled%",
          "default": true
        },
        "merge-conflict.decorators.enabled": {
          "type": "boolean",
          "description": "%config.decoratorsEnabled%",
          "default": true
        },
        "merge-conflict.autoNavigateNextConflict.enabled": {
          "type": "boolean",
          "description": "%config.autoNavigateNextConflictEnabled%",
          "default": false
        },
        "merge-conflict.diffViewPosition": {
          "type": "string",
          "enum": [
            "Current",
            "Beside",
            "Below"
          ],
          "description": "%config.diffViewPosition%",
          "enumDescriptions": [
            "%config.diffViewPosition.current%",
            "%config.diffViewPosition.beside%",
            "%config.diffViewPosition.below%"
          ],
          "default": "Current"
        }
      }
    }
  },
  "dependencies": {
    "@vscode/extension-telemetry": "^0.9.8"
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

---[FILE: extensions/merge-conflict/package.nls.json]---
Location: vscode-main/extensions/merge-conflict/package.nls.json

```json
{
	"displayName": "Merge Conflict",
	"description": "Highlighting and commands for inline merge conflicts.",
	"command.category": "Merge Conflict",
	"command.accept.all-current": "Accept All Current",
	"command.accept.all-incoming": "Accept All Incoming",
	"command.accept.all-both": "Accept All Both",
	"command.accept.current": "Accept Current",
	"command.accept.incoming": "Accept Incoming",
	"command.accept.selection": "Accept Selection",
	"command.accept.both": "Accept Both",
	"command.next": "Next Conflict",
	"command.previous": "Previous Conflict",
	"command.compare": "Compare Current Conflict",
	"config.title": "Merge Conflict",
	"config.autoNavigateNextConflictEnabled": "Whether to automatically navigate to the next merge conflict after resolving a merge conflict.",
	"config.codeLensEnabled": "Create a CodeLens for merge conflict blocks within editor.",
	"config.decoratorsEnabled": "Create decorators for merge conflict blocks within editor.",
	"config.diffViewPosition": "Controls where the diff view should be opened when comparing changes in merge conflicts.",
	"config.diffViewPosition.current": "Open the diff view in the current editor group.",
	"config.diffViewPosition.beside": "Open the diff view next to the current editor group.",
	"config.diffViewPosition.below": "Open the diff view below the current editor group."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/merge-conflict/README.md]---
Location: vscode-main/extensions/merge-conflict/README.md

```markdown
# Merge Conflict

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

## Features

See [Merge Conflicts in VS Code](https://code.visualstudio.com/docs/editor/versioncontrol#_merge-conflicts) to learn about features of this extension.
```

--------------------------------------------------------------------------------

---[FILE: extensions/merge-conflict/tsconfig.json]---
Location: vscode-main/extensions/merge-conflict/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"types": [
			"node"
		],
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

---[FILE: extensions/merge-conflict/src/codelensProvider.ts]---
Location: vscode-main/extensions/merge-conflict/src/codelensProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as interfaces from './interfaces';

export default class MergeConflictCodeLensProvider implements vscode.CodeLensProvider, vscode.Disposable {
	private codeLensRegistrationHandle?: vscode.Disposable | null;
	private config?: interfaces.IExtensionConfiguration;
	private tracker: interfaces.IDocumentMergeConflictTracker;

	constructor(trackerService: interfaces.IDocumentMergeConflictTrackerService) {
		this.tracker = trackerService.createTracker('codelens');
	}

	begin(config: interfaces.IExtensionConfiguration) {
		this.config = config;

		if (this.config.enableCodeLens) {
			this.registerCodeLensProvider();
		}
	}

	configurationUpdated(updatedConfig: interfaces.IExtensionConfiguration) {

		if (updatedConfig.enableCodeLens === false && this.codeLensRegistrationHandle) {
			this.codeLensRegistrationHandle.dispose();
			this.codeLensRegistrationHandle = null;
		}
		else if (updatedConfig.enableCodeLens === true && !this.codeLensRegistrationHandle) {
			this.registerCodeLensProvider();
		}

		this.config = updatedConfig;
	}


	dispose() {
		if (this.codeLensRegistrationHandle) {
			this.codeLensRegistrationHandle.dispose();
			this.codeLensRegistrationHandle = null;
		}
	}

	async provideCodeLenses(document: vscode.TextDocument, _token: vscode.CancellationToken): Promise<vscode.CodeLens[] | null> {

		if (!this.config || !this.config.enableCodeLens) {
			return null;
		}

		const conflicts = await this.tracker.getConflicts(document);
		const conflictsCount = conflicts?.length ?? 0;
		vscode.commands.executeCommand('setContext', 'mergeConflictsCount', conflictsCount);

		if (!conflictsCount) {
			return null;
		}

		const items: vscode.CodeLens[] = [];

		conflicts.forEach(conflict => {
			const acceptCurrentCommand: vscode.Command = {
				command: 'merge-conflict.accept.current',
				title: vscode.l10n.t("Accept Current Change"),
				arguments: ['known-conflict', conflict]
			};

			const acceptIncomingCommand: vscode.Command = {
				command: 'merge-conflict.accept.incoming',
				title: vscode.l10n.t("Accept Incoming Change"),
				arguments: ['known-conflict', conflict]
			};

			const acceptBothCommand: vscode.Command = {
				command: 'merge-conflict.accept.both',
				title: vscode.l10n.t("Accept Both Changes"),
				arguments: ['known-conflict', conflict]
			};

			const diffCommand: vscode.Command = {
				command: 'merge-conflict.compare',
				title: vscode.l10n.t("Compare Changes"),
				arguments: [conflict]
			};

			const range = document.lineAt(conflict.range.start.line).range;
			items.push(
				new vscode.CodeLens(range, acceptCurrentCommand),
				new vscode.CodeLens(range, acceptIncomingCommand),
				new vscode.CodeLens(range, acceptBothCommand),
				new vscode.CodeLens(range, diffCommand)
			);
		});

		return items;
	}

	private registerCodeLensProvider() {
		this.codeLensRegistrationHandle = vscode.languages.registerCodeLensProvider([
			{ scheme: 'file' },
			{ scheme: 'vscode-vfs' },
			{ scheme: 'untitled' },
			{ scheme: 'vscode-userdata' },
		], this);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/merge-conflict/src/commandHandler.ts]---
Location: vscode-main/extensions/merge-conflict/src/commandHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as vscode from 'vscode';
import * as interfaces from './interfaces';
import ContentProvider from './contentProvider';

interface IDocumentMergeConflictNavigationResults {
	canNavigate: boolean;
	conflict?: interfaces.IDocumentMergeConflict;
}

enum NavigationDirection {
	Forwards,
	Backwards
}

export default class CommandHandler implements vscode.Disposable {

	private disposables: vscode.Disposable[] = [];
	private tracker: interfaces.IDocumentMergeConflictTracker;

	constructor(trackerService: interfaces.IDocumentMergeConflictTrackerService) {
		this.tracker = trackerService.createTracker('commands');
	}

	begin() {
		this.disposables.push(
			this.registerTextEditorCommand('merge-conflict.accept.current', this.acceptCurrent),
			this.registerTextEditorCommand('merge-conflict.accept.incoming', this.acceptIncoming),
			this.registerTextEditorCommand('merge-conflict.accept.selection', this.acceptSelection),
			this.registerTextEditorCommand('merge-conflict.accept.both', this.acceptBoth),
			this.registerTextEditorCommand('merge-conflict.accept.all-current', this.acceptAllCurrent, this.acceptAllCurrentResources),
			this.registerTextEditorCommand('merge-conflict.accept.all-incoming', this.acceptAllIncoming, this.acceptAllIncomingResources),
			this.registerTextEditorCommand('merge-conflict.accept.all-both', this.acceptAllBoth),
			this.registerTextEditorCommand('merge-conflict.next', this.navigateNext),
			this.registerTextEditorCommand('merge-conflict.previous', this.navigatePrevious),
			this.registerTextEditorCommand('merge-conflict.compare', this.compare)
		);
	}

	private registerTextEditorCommand(command: string, cb: (editor: vscode.TextEditor, ...args: any[]) => Promise<void>, resourceCB?: (uris: vscode.Uri[]) => Promise<void>) {
		return vscode.commands.registerCommand(command, (...args) => {
			if (resourceCB && args.length && args.every(arg => arg && arg.resourceUri)) {
				return resourceCB.call(this, args.map(arg => arg.resourceUri));
			}
			const editor = vscode.window.activeTextEditor;
			return editor && cb.call(this, editor, ...args);
		});
	}

	acceptCurrent(editor: vscode.TextEditor, ...args: any[]): Promise<void> {
		return this.accept(interfaces.CommitType.Current, editor, ...args);
	}

	acceptIncoming(editor: vscode.TextEditor, ...args: any[]): Promise<void> {
		return this.accept(interfaces.CommitType.Incoming, editor, ...args);
	}

	acceptBoth(editor: vscode.TextEditor, ...args: any[]): Promise<void> {
		return this.accept(interfaces.CommitType.Both, editor, ...args);
	}

	acceptAllCurrent(editor: vscode.TextEditor): Promise<void> {
		return this.acceptAll(interfaces.CommitType.Current, editor);
	}

	acceptAllIncoming(editor: vscode.TextEditor): Promise<void> {
		return this.acceptAll(interfaces.CommitType.Incoming, editor);
	}

	acceptAllCurrentResources(resources: vscode.Uri[]): Promise<void> {
		return this.acceptAllResources(interfaces.CommitType.Current, resources);
	}

	acceptAllIncomingResources(resources: vscode.Uri[]): Promise<void> {
		return this.acceptAllResources(interfaces.CommitType.Incoming, resources);
	}

	acceptAllBoth(editor: vscode.TextEditor): Promise<void> {
		return this.acceptAll(interfaces.CommitType.Both, editor);
	}

	async compare(editor: vscode.TextEditor, conflict: interfaces.IDocumentMergeConflict | null) {

		// No conflict, command executed from command palette
		if (!conflict) {
			conflict = await this.findConflictContainingSelection(editor);

			// Still failed to find conflict, warn the user and exit
			if (!conflict) {
				vscode.window.showWarningMessage(vscode.l10n.t("Editor cursor is not within a merge conflict"));
				return;
			}
		}

		const conflicts = await this.tracker.getConflicts(editor.document);

		// Still failed to find conflict, warn the user and exit
		if (!conflicts) {
			vscode.window.showWarningMessage(vscode.l10n.t("Editor cursor is not within a merge conflict"));
			return;
		}

		const scheme = editor.document.uri.scheme;
		let range = conflict.current.content;
		const leftRanges = conflicts.map(conflict => [conflict.current.content, conflict.range]);
		const rightRanges = conflicts.map(conflict => [conflict.incoming.content, conflict.range]);

		const leftUri = editor.document.uri.with({
			scheme: ContentProvider.scheme,
			query: JSON.stringify({ scheme, range: range, ranges: leftRanges })
		});


		range = conflict.incoming.content;
		const rightUri = leftUri.with({ query: JSON.stringify({ scheme, ranges: rightRanges }) });

		let mergeConflictLineOffsets = 0;
		for (const nextconflict of conflicts) {
			if (nextconflict.range.isEqual(conflict.range)) {
				break;
			} else {
				mergeConflictLineOffsets += (nextconflict.range.end.line - nextconflict.range.start.line) - (nextconflict.incoming.content.end.line - nextconflict.incoming.content.start.line);
			}
		}
		const selection = new vscode.Range(
			conflict.range.start.line - mergeConflictLineOffsets, conflict.range.start.character,
			conflict.range.start.line - mergeConflictLineOffsets, conflict.range.start.character
		);

		const docPath = editor.document.uri.path;
		const fileName = docPath.substring(docPath.lastIndexOf('/') + 1); // avoid NodeJS path to keep browser webpack small
		const title = vscode.l10n.t("{0}: Current Changes ↔ Incoming Changes", fileName);
		const mergeConflictConfig = vscode.workspace.getConfiguration('merge-conflict');
		const openToTheSide = mergeConflictConfig.get<string>('diffViewPosition');
		const opts: vscode.TextDocumentShowOptions = {
			viewColumn: openToTheSide === 'Beside' ? vscode.ViewColumn.Beside : vscode.ViewColumn.Active,
			selection
		};

		if (openToTheSide === 'Below') {
			await vscode.commands.executeCommand('workbench.action.newGroupBelow');
		}

		await vscode.commands.executeCommand('vscode.diff', leftUri, rightUri, title, opts);
	}

	navigateNext(editor: vscode.TextEditor): Promise<void> {
		return this.navigate(editor, NavigationDirection.Forwards);
	}

	navigatePrevious(editor: vscode.TextEditor): Promise<void> {
		return this.navigate(editor, NavigationDirection.Backwards);
	}

	async acceptSelection(editor: vscode.TextEditor): Promise<void> {
		const conflict = await this.findConflictContainingSelection(editor);

		if (!conflict) {
			vscode.window.showWarningMessage(vscode.l10n.t("Editor cursor is not within a merge conflict"));
			return;
		}

		let typeToAccept: interfaces.CommitType;
		let tokenAfterCurrentBlock: vscode.Range = conflict.splitter;

		if (conflict.commonAncestors.length > 0) {
			tokenAfterCurrentBlock = conflict.commonAncestors[0].header;
		}

		// Figure out if the cursor is in current or incoming, we do this by seeing if
		// the active position is before or after the range of the splitter or common
		// ancestors marker. We can use this trick as the previous check in
		// findConflictByActiveSelection will ensure it's within the conflict range, so
		// we don't falsely identify "current" or "incoming" if outside of a conflict range.
		if (editor.selection.active.isBefore(tokenAfterCurrentBlock.start)) {
			typeToAccept = interfaces.CommitType.Current;
		}
		else if (editor.selection.active.isAfter(conflict.splitter.end)) {
			typeToAccept = interfaces.CommitType.Incoming;
		}
		else if (editor.selection.active.isBefore(conflict.splitter.start)) {
			vscode.window.showWarningMessage(vscode.l10n.t('Editor cursor is within the common ancestors block, please move it to either the "current" or "incoming" block'));
			return;
		}
		else {
			vscode.window.showWarningMessage(vscode.l10n.t('Editor cursor is within the merge conflict splitter, please move it to either the "current" or "incoming" block'));
			return;
		}

		this.tracker.forget(editor.document);
		conflict.commitEdit(typeToAccept, editor);
	}

	dispose() {
		this.disposables.forEach(disposable => disposable.dispose());
		this.disposables = [];
	}

	private async navigate(editor: vscode.TextEditor, direction: NavigationDirection): Promise<void> {
		const navigationResult = await this.findConflictForNavigation(editor, direction);

		if (!navigationResult) {
			// Check for autoNavigateNextConflict, if it's enabled(which indicating no conflict remain), then do not show warning
			const mergeConflictConfig = vscode.workspace.getConfiguration('merge-conflict');
			if (mergeConflictConfig.get<boolean>('autoNavigateNextConflict.enabled')) {
				return;
			}
			vscode.window.showWarningMessage(vscode.l10n.t("No merge conflicts found in this file"));
			return;
		}
		else if (!navigationResult.canNavigate) {
			vscode.window.showWarningMessage(vscode.l10n.t("No other merge conflicts within this file"));
			return;
		}
		else if (!navigationResult.conflict) {
			// TODO: Show error message?
			return;
		}

		// Move the selection to the first line of the conflict
		editor.selection = new vscode.Selection(navigationResult.conflict.range.start, navigationResult.conflict.range.start);
		editor.revealRange(navigationResult.conflict.range, vscode.TextEditorRevealType.Default);
	}

	private async accept(type: interfaces.CommitType, editor: vscode.TextEditor, ...args: any[]): Promise<void> {

		let conflict: interfaces.IDocumentMergeConflict | null;

		// If launched with known context, take the conflict from that
		if (args[0] === 'known-conflict') {
			conflict = args[1];
		}
		else {
			// Attempt to find a conflict that matches the current cursor position
			conflict = await this.findConflictContainingSelection(editor);
		}

		if (!conflict) {
			vscode.window.showWarningMessage(vscode.l10n.t("Editor cursor is not within a merge conflict"));
			return;
		}

		// Tracker can forget as we know we are going to do an edit
		this.tracker.forget(editor.document);
		conflict.commitEdit(type, editor);

		// navigate to the next merge conflict
		const mergeConflictConfig = vscode.workspace.getConfiguration('merge-conflict');
		if (mergeConflictConfig.get<boolean>('autoNavigateNextConflict.enabled')) {
			this.navigateNext(editor);
		}

	}

	private async acceptAll(type: interfaces.CommitType, editor: vscode.TextEditor): Promise<void> {
		const conflicts = await this.tracker.getConflicts(editor.document);

		if (!conflicts || conflicts.length === 0) {
			vscode.window.showWarningMessage(vscode.l10n.t("No merge conflicts found in this file"));
			return;
		}

		// For get the current state of the document, as we know we are doing to do a large edit
		this.tracker.forget(editor.document);

		// Apply all changes as one edit
		await editor.edit((edit) => conflicts.forEach(conflict => {
			conflict.applyEdit(type, editor.document, edit);
		}));
	}

	private async acceptAllResources(type: interfaces.CommitType, resources: vscode.Uri[]): Promise<void> {
		const documents = await Promise.all(resources.map(resource => vscode.workspace.openTextDocument(resource)));
		const edit = new vscode.WorkspaceEdit();
		for (const document of documents) {
			const conflicts = await this.tracker.getConflicts(document);

			if (!conflicts || conflicts.length === 0) {
				continue;
			}

			// For get the current state of the document, as we know we are doing to do a large edit
			this.tracker.forget(document);

			// Apply all changes as one edit
			conflicts.forEach(conflict => {
				conflict.applyEdit(type, document, { replace: (range, newText) => edit.replace(document.uri, range, newText) });
			});
		}
		vscode.workspace.applyEdit(edit);
	}

	private async findConflictContainingSelection(editor: vscode.TextEditor, conflicts?: interfaces.IDocumentMergeConflict[]): Promise<interfaces.IDocumentMergeConflict | null> {

		if (!conflicts) {
			conflicts = await this.tracker.getConflicts(editor.document);
		}

		if (!conflicts || conflicts.length === 0) {
			return null;
		}

		for (const conflict of conflicts) {
			if (conflict.range.contains(editor.selection.active)) {
				return conflict;
			}
		}

		return null;
	}

	private async findConflictForNavigation(editor: vscode.TextEditor, direction: NavigationDirection, conflicts?: interfaces.IDocumentMergeConflict[]): Promise<IDocumentMergeConflictNavigationResults | null> {
		if (!conflicts) {
			conflicts = await this.tracker.getConflicts(editor.document);
		}

		if (!conflicts || conflicts.length === 0) {
			return null;
		}

		const selection = editor.selection.active;
		if (conflicts.length === 1) {
			if (conflicts[0].range.contains(selection)) {
				return {
					canNavigate: false
				};
			}

			return {
				canNavigate: true,
				conflict: conflicts[0]
			};
		}

		let predicate: (_conflict: any) => boolean;
		let fallback: () => interfaces.IDocumentMergeConflict;
		let scanOrder: interfaces.IDocumentMergeConflict[];

		if (direction === NavigationDirection.Forwards) {
			predicate = (conflict) => selection.isBefore(conflict.range.start);
			fallback = () => conflicts![0];
			scanOrder = conflicts;
		} else if (direction === NavigationDirection.Backwards) {
			predicate = (conflict) => selection.isAfter(conflict.range.start);
			fallback = () => conflicts![conflicts!.length - 1];
			scanOrder = conflicts.slice().reverse();
		} else {
			throw new Error(`Unsupported direction ${direction}`);
		}

		for (const conflict of scanOrder) {
			if (predicate(conflict) && !conflict.range.contains(selection)) {
				return {
					canNavigate: true,
					conflict: conflict
				};
			}
		}

		// Went all the way to the end, return the head
		return {
			canNavigate: true,
			conflict: fallback()
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/merge-conflict/src/contentProvider.ts]---
Location: vscode-main/extensions/merge-conflict/src/contentProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export default class MergeConflictContentProvider implements vscode.TextDocumentContentProvider, vscode.Disposable {

	static scheme = 'merge-conflict.conflict-diff';

	constructor(private context: vscode.ExtensionContext) {
	}

	begin() {
		this.context.subscriptions.push(
			vscode.workspace.registerTextDocumentContentProvider(MergeConflictContentProvider.scheme, this)
		);
	}

	dispose() {
	}

	async provideTextDocumentContent(uri: vscode.Uri): Promise<string | null> {
		try {
			const { scheme, ranges } = JSON.parse(uri.query) as { scheme: string; ranges: [{ line: number; character: number }[], { line: number; character: number }[]][] };

			// complete diff
			const document = await vscode.workspace.openTextDocument(uri.with({ scheme, query: '' }));

			let text = '';
			let lastPosition = new vscode.Position(0, 0);

			ranges.forEach(rangeObj => {
				const [conflictRange, fullRange] = rangeObj;
				const [start, end] = conflictRange;
				const [fullStart, fullEnd] = fullRange;

				text += document.getText(new vscode.Range(lastPosition.line, lastPosition.character, fullStart.line, fullStart.character));
				text += document.getText(new vscode.Range(start.line, start.character, end.line, end.character));
				lastPosition = new vscode.Position(fullEnd.line, fullEnd.character);
			});

			const documentEnd = document.lineAt(document.lineCount - 1).range.end;
			text += document.getText(new vscode.Range(lastPosition.line, lastPosition.character, documentEnd.line, documentEnd.character));

			return text;
		}
		catch (ex) {
			await vscode.window.showErrorMessage('Unable to show comparison');
			return null;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/merge-conflict/src/delayer.ts]---
Location: vscode-main/extensions/merge-conflict/src/delayer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface ITask<T> {
	(): T;
}

export class Delayer<T> {

	public defaultDelay: number;
	private timeout: any; // Timer
	private completionPromise: Promise<T> | null;
	private onSuccess: ((value: T | PromiseLike<T> | undefined) => void) | null;
	private task: ITask<T> | null;

	constructor(defaultDelay: number) {
		this.defaultDelay = defaultDelay;
		this.timeout = null;
		this.completionPromise = null;
		this.onSuccess = null;
		this.task = null;
	}

	public trigger(task: ITask<T>, delay: number = this.defaultDelay): Promise<T> {
		this.task = task;
		if (delay >= 0) {
			this.cancelTimeout();
		}

		if (!this.completionPromise) {
			this.completionPromise = new Promise<T | undefined>((resolve) => {
				this.onSuccess = resolve;
			}).then(() => {
				this.completionPromise = null;
				this.onSuccess = null;
				const result = this.task!();
				this.task = null;
				return result;
			});
		}

		if (delay >= 0 || this.timeout === null) {
			this.timeout = setTimeout(() => {
				this.timeout = null;
				this.onSuccess!(undefined);
			}, delay >= 0 ? delay : this.defaultDelay);
		}

		return this.completionPromise;
	}

	public forceDelivery(): Promise<T> | null {
		if (!this.completionPromise) {
			return null;
		}
		this.cancelTimeout();
		const result = this.completionPromise;
		this.onSuccess!(undefined);
		return result;
	}

	public isTriggered(): boolean {
		return this.timeout !== null;
	}

	public cancel(): void {
		this.cancelTimeout();
		this.completionPromise = null;
	}

	private cancelTimeout(): void {
		if (this.timeout !== null) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/merge-conflict/src/documentMergeConflict.ts]---
Location: vscode-main/extensions/merge-conflict/src/documentMergeConflict.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as interfaces from './interfaces';
import * as vscode from 'vscode';
import type TelemetryReporter from '@vscode/extension-telemetry';

export class DocumentMergeConflict implements interfaces.IDocumentMergeConflict {

	public range: vscode.Range;
	public current: interfaces.IMergeRegion;
	public incoming: interfaces.IMergeRegion;
	public commonAncestors: interfaces.IMergeRegion[];
	public splitter: vscode.Range;
	private applied = false;

	constructor(descriptor: interfaces.IDocumentMergeConflictDescriptor, private readonly telemetryReporter: TelemetryReporter) {
		this.range = descriptor.range;
		this.current = descriptor.current;
		this.incoming = descriptor.incoming;
		this.commonAncestors = descriptor.commonAncestors;
		this.splitter = descriptor.splitter;
	}

	public commitEdit(type: interfaces.CommitType, editor: vscode.TextEditor, edit?: vscode.TextEditorEdit): Thenable<boolean> {
		function commitTypeToString(type: interfaces.CommitType): string {
			switch (type) {
				case interfaces.CommitType.Current:
					return 'current';
				case interfaces.CommitType.Incoming:
					return 'incoming';
				case interfaces.CommitType.Both:
					return 'both';
			}
		}

		/* __GDPR__
			"mergeMarkers.accept" : {
				"owner": "hediet",
				"comment": "Used to understand how the inline merge editor experience is used.",
				"resolution": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "Indicates how the merge conflict was resolved by the user" }
			}
		*/
		this.telemetryReporter.sendTelemetryEvent('mergeMarkers.accept', { resolution: commitTypeToString(type) });

		if (edit) {

			this.applyEdit(type, editor.document, edit);
			return Promise.resolve(true);
		}

		return editor.edit((edit) => this.applyEdit(type, editor.document, edit));
	}

	public applyEdit(type: interfaces.CommitType, document: vscode.TextDocument, edit: { replace(range: vscode.Range, newText: string): void }): void {
		if (this.applied) {
			return;
		}
		this.applied = true;

		// Each conflict is a set of ranges as follows, note placements or newlines
		// which may not in spans
		// [ Conflict Range             -- (Entire content below)
		//   [ Current Header ]\n       -- >>>>> Header
		//   [ Current Content ]        -- (content)
		//   [ Splitter ]\n             -- =====
		//   [ Incoming Content ]       -- (content)
		//   [ Incoming Header ]\n      -- <<<<< Incoming
		// ]
		if (type === interfaces.CommitType.Current) {
			// Replace [ Conflict Range ] with [ Current Content ]
			const content = document.getText(this.current.content);
			this.replaceRangeWithContent(content, edit);
		}
		else if (type === interfaces.CommitType.Incoming) {
			const content = document.getText(this.incoming.content);
			this.replaceRangeWithContent(content, edit);
		}
		else if (type === interfaces.CommitType.Both) {
			// Replace [ Conflict Range ] with [ Current Content ] + \n + [ Incoming Content ]

			const currentContent = document.getText(this.current.content);
			const incomingContent = document.getText(this.incoming.content);

			edit.replace(this.range, currentContent.concat(incomingContent));
		}
	}

	private replaceRangeWithContent(content: string, edit: { replace(range: vscode.Range, newText: string): void }) {
		if (this.isNewlineOnly(content)) {
			edit.replace(this.range, '');
			return;
		}

		// Replace [ Conflict Range ] with [ Current Content ]
		edit.replace(this.range, content);
	}

	private isNewlineOnly(text: string) {
		return text === '\n' || text === '\r\n';
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/merge-conflict/src/documentTracker.ts]---
Location: vscode-main/extensions/merge-conflict/src/documentTracker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { MergeConflictParser } from './mergeConflictParser';
import * as interfaces from './interfaces';
import { Delayer } from './delayer';
import TelemetryReporter from '@vscode/extension-telemetry';

class ScanTask {
	public origins: Set<string> = new Set<string>();
	public delayTask: Delayer<interfaces.IDocumentMergeConflict[]>;

	constructor(delayTime: number, initialOrigin: string) {
		this.origins.add(initialOrigin);
		this.delayTask = new Delayer<interfaces.IDocumentMergeConflict[]>(delayTime);
	}

	public addOrigin(name: string): void {
		this.origins.add(name);
	}

	public hasOrigin(name: string): boolean {
		return this.origins.has(name);
	}
}

class OriginDocumentMergeConflictTracker implements interfaces.IDocumentMergeConflictTracker {
	constructor(private parent: DocumentMergeConflictTracker, private origin: string) {
	}

	getConflicts(document: vscode.TextDocument): PromiseLike<interfaces.IDocumentMergeConflict[]> {
		return this.parent.getConflicts(document, this.origin);
	}

	isPending(document: vscode.TextDocument): boolean {
		return this.parent.isPending(document, this.origin);
	}

	forget(document: vscode.TextDocument) {
		this.parent.forget(document);
	}
}

export default class DocumentMergeConflictTracker implements vscode.Disposable, interfaces.IDocumentMergeConflictTrackerService {
	private cache: Map<string, ScanTask> = new Map();
	private delayExpireTime: number = 0;

	constructor(private readonly telemetryReporter: TelemetryReporter) { }

	getConflicts(document: vscode.TextDocument, origin: string): PromiseLike<interfaces.IDocumentMergeConflict[]> {
		// Attempt from cache

		const key = this.getCacheKey(document);

		if (!key) {
			// Document doesn't have a uri, can't cache it, so return
			return Promise.resolve(this.getConflictsOrEmpty(document, [origin]));
		}

		let cacheItem = this.cache.get(key);
		if (!cacheItem) {
			cacheItem = new ScanTask(this.delayExpireTime, origin);
			this.cache.set(key, cacheItem);
		}
		else {
			cacheItem.addOrigin(origin);
		}

		return cacheItem.delayTask.trigger(() => {
			const conflicts = this.getConflictsOrEmpty(document, Array.from(cacheItem!.origins));

			this.cache?.delete(key!);

			return conflicts;
		});
	}

	isPending(document: vscode.TextDocument, origin: string): boolean {
		if (!document) {
			return false;
		}

		const key = this.getCacheKey(document);
		if (!key) {
			return false;
		}

		const task = this.cache.get(key);
		if (!task) {
			return false;
		}

		return task.hasOrigin(origin);
	}

	createTracker(origin: string): interfaces.IDocumentMergeConflictTracker {
		return new OriginDocumentMergeConflictTracker(this, origin);
	}

	forget(document: vscode.TextDocument) {
		const key = this.getCacheKey(document);

		if (key) {
			this.cache.delete(key);
		}
	}

	dispose() {
		this.cache.clear();
	}

	private readonly seenDocumentsWithConflicts = new Set<string>();

	private getConflictsOrEmpty(document: vscode.TextDocument, _origins: string[]): interfaces.IDocumentMergeConflict[] {
		const containsConflict = MergeConflictParser.containsConflict(document);

		if (!containsConflict) {
			return [];
		}

		const conflicts = MergeConflictParser.scanDocument(document, this.telemetryReporter);

		const key = document.uri.toString();
		// Don't report telemetry for the same document twice. This is an approximation, but good enough.
		// Otherwise redo/undo could trigger this event multiple times.
		if (!this.seenDocumentsWithConflicts.has(key)) {
			this.seenDocumentsWithConflicts.add(key);

			/* __GDPR__
				"mergeMarkers.documentWithConflictMarkersOpened" : {
					"owner": "hediet",
					"comment": "Used to determine how many documents with conflicts are opened.",
					"conflictCount": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true, "comment": "Total number of conflict counts" }
				}
			*/
			this.telemetryReporter.sendTelemetryEvent('mergeMarkers.documentWithConflictMarkersOpened', {}, {
				conflictCount: conflicts.length,
			});
		}

		return conflicts;
	}

	private getCacheKey(document: vscode.TextDocument): string | null {
		if (document.uri) {
			return document.uri.toString();
		}

		return null;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/merge-conflict/src/interfaces.ts]---
Location: vscode-main/extensions/merge-conflict/src/interfaces.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as vscode from 'vscode';

export interface IMergeRegion {
	name: string;
	header: vscode.Range;
	content: vscode.Range;
	decoratorContent: vscode.Range;
}

export const enum CommitType {
	Current,
	Incoming,
	Both
}

export interface IExtensionConfiguration {
	enableCodeLens: boolean;
	enableDecorations: boolean;
	enableEditorOverview: boolean;
}

export interface IDocumentMergeConflict extends IDocumentMergeConflictDescriptor {
	commitEdit(type: CommitType, editor: vscode.TextEditor, edit?: vscode.TextEditorEdit): Thenable<boolean>;
	applyEdit(type: CommitType, document: vscode.TextDocument, edit: { replace(range: vscode.Range, newText: string): void }): void;
}

export interface IDocumentMergeConflictDescriptor {
	range: vscode.Range;
	current: IMergeRegion;
	incoming: IMergeRegion;
	commonAncestors: IMergeRegion[];
	splitter: vscode.Range;
}

export interface IDocumentMergeConflictTracker {
	getConflicts(document: vscode.TextDocument): PromiseLike<IDocumentMergeConflict[]>;
	isPending(document: vscode.TextDocument): boolean;
	forget(document: vscode.TextDocument): void;
}

export interface IDocumentMergeConflictTrackerService {
	createTracker(origin: string): IDocumentMergeConflictTracker;
	forget(document: vscode.TextDocument): void;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/merge-conflict/src/mergeConflictMain.ts]---
Location: vscode-main/extensions/merge-conflict/src/mergeConflictMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import MergeConflictServices from './services';

export function activate(context: vscode.ExtensionContext) {
	// Register disposables
	const services = new MergeConflictServices(context);
	services.begin();
	context.subscriptions.push(services);
}

export function deactivate() {
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/merge-conflict/src/mergeConflictParser.ts]---
Location: vscode-main/extensions/merge-conflict/src/mergeConflictParser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as vscode from 'vscode';
import * as interfaces from './interfaces';
import { DocumentMergeConflict } from './documentMergeConflict';
import TelemetryReporter from '@vscode/extension-telemetry';

const startHeaderMarker = '<<<<<<<';
const commonAncestorsMarker = '|||||||';
const splitterMarker = '=======';
const endFooterMarker = '>>>>>>>';

interface IScanMergedConflict {
	startHeader: vscode.TextLine;
	commonAncestors: vscode.TextLine[];
	splitter?: vscode.TextLine;
	endFooter?: vscode.TextLine;
}

export class MergeConflictParser {

	static scanDocument(document: vscode.TextDocument, telemetryReporter: TelemetryReporter): interfaces.IDocumentMergeConflict[] {

		// Scan each line in the document, we already know there is at least a <<<<<<< and
		// >>>>>> marker within the document, we need to group these into conflict ranges.
		// We initially build a scan match, that references the lines of the header, splitter
		// and footer. This is then converted into a full descriptor containing all required
		// ranges.

		let currentConflict: IScanMergedConflict | null = null;
		const conflictDescriptors: interfaces.IDocumentMergeConflictDescriptor[] = [];

		for (let i = 0; i < document.lineCount; i++) {
			const line = document.lineAt(i);

			// Ignore empty lines
			if (!line || line.isEmptyOrWhitespace) {
				continue;
			}

			// Is this a start line? <<<<<<<
			if (line.text.startsWith(startHeaderMarker)) {
				if (currentConflict !== null) {
					// Error, we should not see a startMarker before we've seen an endMarker
					currentConflict = null;

					// Give up parsing, anything matched up this to this point will be decorated
					// anything after will not
					break;
				}

				// Create a new conflict starting at this line
				currentConflict = { startHeader: line, commonAncestors: [] };
			}
			// Are we within a conflict block and is this a common ancestors marker? |||||||
			else if (currentConflict && !currentConflict.splitter && line.text.startsWith(commonAncestorsMarker)) {
				currentConflict.commonAncestors.push(line);
			}
			// Are we within a conflict block and is this a splitter? =======
			else if (currentConflict && !currentConflict.splitter && line.text === splitterMarker) {
				currentConflict.splitter = line;
			}
			// Are we within a conflict block and is this a footer? >>>>>>>
			else if (currentConflict && line.text.startsWith(endFooterMarker)) {
				currentConflict.endFooter = line;

				// Create a full descriptor from the lines that we matched. This can return
				// null if the descriptor could not be completed.
				const completeDescriptor = MergeConflictParser.scanItemTolMergeConflictDescriptor(document, currentConflict);

				if (completeDescriptor !== null) {
					conflictDescriptors.push(completeDescriptor);
				}

				// Reset the current conflict to be empty, so we can match the next
				// starting header marker.
				currentConflict = null;
			}
		}

		return conflictDescriptors
			.filter(Boolean)
			.map(descriptor => new DocumentMergeConflict(descriptor, telemetryReporter));
	}

	private static scanItemTolMergeConflictDescriptor(document: vscode.TextDocument, scanned: IScanMergedConflict): interfaces.IDocumentMergeConflictDescriptor | null {
		// Validate we have all the required lines within the scan item.
		if (!scanned.startHeader || !scanned.splitter || !scanned.endFooter) {
			return null;
		}

		const tokenAfterCurrentBlock: vscode.TextLine = scanned.commonAncestors[0] || scanned.splitter;

		// Assume that descriptor.current.header, descriptor.incoming.header and descriptor.splitter
		// have valid ranges, fill in content and total ranges from these parts.
		// NOTE: We need to shift the decorator range back one character so the splitter does not end up with
		// two decoration colors (current and splitter), if we take the new line from the content into account
		// the decorator will wrap to the next line.
		return {
			current: {
				header: scanned.startHeader.range,
				decoratorContent: new vscode.Range(
					scanned.startHeader.rangeIncludingLineBreak.end,
					MergeConflictParser.shiftBackOneCharacter(document, tokenAfterCurrentBlock.range.start, scanned.startHeader.rangeIncludingLineBreak.end)),
				// Current content is range between header (shifted for linebreak) and splitter or common ancestors mark start
				content: new vscode.Range(
					scanned.startHeader.rangeIncludingLineBreak.end,
					tokenAfterCurrentBlock.range.start),
				name: scanned.startHeader.text.substring(startHeaderMarker.length + 1)
			},
			commonAncestors: scanned.commonAncestors.map((currentTokenLine, index, commonAncestors) => {
				const nextTokenLine = commonAncestors[index + 1] || scanned.splitter;
				return {
					header: currentTokenLine.range,
					decoratorContent: new vscode.Range(
						currentTokenLine.rangeIncludingLineBreak.end,
						MergeConflictParser.shiftBackOneCharacter(document, nextTokenLine.range.start, currentTokenLine.rangeIncludingLineBreak.end)),
					// Each common ancestors block is range between one common ancestors token
					// (shifted for linebreak) and start of next common ancestors token or splitter
					content: new vscode.Range(
						currentTokenLine.rangeIncludingLineBreak.end,
						nextTokenLine.range.start),
					name: currentTokenLine.text.substring(commonAncestorsMarker.length + 1)
				};
			}),
			splitter: scanned.splitter.range,
			incoming: {
				header: scanned.endFooter.range,
				decoratorContent: new vscode.Range(
					scanned.splitter.rangeIncludingLineBreak.end,
					MergeConflictParser.shiftBackOneCharacter(document, scanned.endFooter.range.start, scanned.splitter.rangeIncludingLineBreak.end)),
				// Incoming content is range between splitter (shifted for linebreak) and footer start
				content: new vscode.Range(
					scanned.splitter.rangeIncludingLineBreak.end,
					scanned.endFooter.range.start),
				name: scanned.endFooter.text.substring(endFooterMarker.length + 1)
			},
			// Entire range is between current header start and incoming header end (including line break)
			range: new vscode.Range(scanned.startHeader.range.start, scanned.endFooter.rangeIncludingLineBreak.end)
		};
	}

	static containsConflict(document: vscode.TextDocument): boolean {
		if (!document) {
			return false;
		}

		const text = document.getText();
		return text.includes(startHeaderMarker) && text.includes(endFooterMarker);
	}

	private static shiftBackOneCharacter(document: vscode.TextDocument, range: vscode.Position, unlessEqual: vscode.Position): vscode.Position {
		if (range.isEqual(unlessEqual)) {
			return range;
		}

		let line = range.line;
		let character = range.character - 1;

		if (character < 0) {
			line--;
			character = document.lineAt(line).range.end.character;
		}

		return new vscode.Position(line, character);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/merge-conflict/src/mergeDecorator.ts]---
Location: vscode-main/extensions/merge-conflict/src/mergeDecorator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as vscode from 'vscode';
import * as interfaces from './interfaces';


export default class MergeDecorator implements vscode.Disposable {

	private decorations: { [key: string]: vscode.TextEditorDecorationType } = {};

	private decorationUsesWholeLine: boolean = true; // Useful for debugging, set to false to see exact match ranges

	private config?: interfaces.IExtensionConfiguration;
	private tracker: interfaces.IDocumentMergeConflictTracker;
	private updating = new Map<vscode.TextEditor, boolean>();

	constructor(private context: vscode.ExtensionContext, trackerService: interfaces.IDocumentMergeConflictTrackerService) {
		this.tracker = trackerService.createTracker('decorator');
	}

	begin(config: interfaces.IExtensionConfiguration) {
		this.config = config;
		this.registerDecorationTypes(config);

		// Check if we already have a set of active windows, attempt to track these.
		vscode.window.visibleTextEditors.forEach(e => this.applyDecorations(e));

		vscode.workspace.onDidOpenTextDocument(event => {
			this.applyDecorationsFromEvent(event);
		}, null, this.context.subscriptions);

		vscode.workspace.onDidChangeTextDocument(event => {
			this.applyDecorationsFromEvent(event.document);
		}, null, this.context.subscriptions);

		vscode.window.onDidChangeVisibleTextEditors((e) => {
			// Any of which could be new (not just the active one).
			e.forEach(e => this.applyDecorations(e));
		}, null, this.context.subscriptions);
	}

	configurationUpdated(config: interfaces.IExtensionConfiguration) {
		this.config = config;
		this.registerDecorationTypes(config);

		// Re-apply the decoration
		vscode.window.visibleTextEditors.forEach(e => {
			this.removeDecorations(e);
			this.applyDecorations(e);
		});
	}

	private registerDecorationTypes(config: interfaces.IExtensionConfiguration) {

		// Dispose of existing decorations
		Object.keys(this.decorations).forEach(k => this.decorations[k].dispose());
		this.decorations = {};

		// None of our features are enabled
		if (!config.enableDecorations || !config.enableEditorOverview) {
			return;
		}

		// Create decorators
		if (config.enableDecorations || config.enableEditorOverview) {
			this.decorations['current.content'] = vscode.window.createTextEditorDecorationType(
				this.generateBlockRenderOptions('merge.currentContentBackground', 'editorOverviewRuler.currentContentForeground', config)
			);

			this.decorations['incoming.content'] = vscode.window.createTextEditorDecorationType(
				this.generateBlockRenderOptions('merge.incomingContentBackground', 'editorOverviewRuler.incomingContentForeground', config)
			);

			this.decorations['commonAncestors.content'] = vscode.window.createTextEditorDecorationType(
				this.generateBlockRenderOptions('merge.commonContentBackground', 'editorOverviewRuler.commonContentForeground', config)
			);
		}

		if (config.enableDecorations) {
			this.decorations['current.header'] = vscode.window.createTextEditorDecorationType({
				isWholeLine: this.decorationUsesWholeLine,
				backgroundColor: new vscode.ThemeColor('merge.currentHeaderBackground'),
				color: new vscode.ThemeColor('editor.foreground'),
				outlineStyle: 'solid',
				outlineWidth: '1pt',
				outlineColor: new vscode.ThemeColor('merge.border'),
				after: {
					contentText: ' ' + vscode.l10n.t("(Current Change)"),
					color: new vscode.ThemeColor('descriptionForeground')
				}
			});

			this.decorations['commonAncestors.header'] = vscode.window.createTextEditorDecorationType({
				isWholeLine: this.decorationUsesWholeLine,
				backgroundColor: new vscode.ThemeColor('merge.commonHeaderBackground'),
				color: new vscode.ThemeColor('editor.foreground'),
				outlineStyle: 'solid',
				outlineWidth: '1pt',
				outlineColor: new vscode.ThemeColor('merge.border')
			});

			this.decorations['splitter'] = vscode.window.createTextEditorDecorationType({
				color: new vscode.ThemeColor('editor.foreground'),
				outlineStyle: 'solid',
				outlineWidth: '1pt',
				outlineColor: new vscode.ThemeColor('merge.border'),
				isWholeLine: this.decorationUsesWholeLine,
			});

			this.decorations['incoming.header'] = vscode.window.createTextEditorDecorationType({
				backgroundColor: new vscode.ThemeColor('merge.incomingHeaderBackground'),
				color: new vscode.ThemeColor('editor.foreground'),
				outlineStyle: 'solid',
				outlineWidth: '1pt',
				outlineColor: new vscode.ThemeColor('merge.border'),
				isWholeLine: this.decorationUsesWholeLine,
				after: {
					contentText: ' ' + vscode.l10n.t("(Incoming Change)"),
					color: new vscode.ThemeColor('descriptionForeground')
				}
			});
		}
	}

	dispose() {

		// TODO: Replace with Map<string, T>
		Object.keys(this.decorations).forEach(name => {
			this.decorations[name].dispose();
		});

		this.decorations = {};
	}

	private generateBlockRenderOptions(backgroundColor: string, overviewRulerColor: string, config: interfaces.IExtensionConfiguration): vscode.DecorationRenderOptions {

		const renderOptions: vscode.DecorationRenderOptions = {};

		if (config.enableDecorations) {
			renderOptions.backgroundColor = new vscode.ThemeColor(backgroundColor);
			renderOptions.isWholeLine = this.decorationUsesWholeLine;
		}

		if (config.enableEditorOverview) {
			renderOptions.overviewRulerColor = new vscode.ThemeColor(overviewRulerColor);
			renderOptions.overviewRulerLane = vscode.OverviewRulerLane.Full;
		}

		return renderOptions;
	}

	private applyDecorationsFromEvent(eventDocument: vscode.TextDocument) {
		for (const editor of vscode.window.visibleTextEditors) {
			if (editor.document === eventDocument) {
				// Attempt to apply
				this.applyDecorations(editor);
			}
		}
	}

	private async applyDecorations(editor: vscode.TextEditor) {
		if (!editor || !editor.document) { return; }

		if (!this.config || (!this.config.enableDecorations && !this.config.enableEditorOverview)) {
			return;
		}

		// If we have a pending scan from the same origin, exit early. (Cannot use this.tracker.isPending() because decorations are per editor.)
		if (this.updating.get(editor)) {
			return;
		}

		try {
			this.updating.set(editor, true);

			const conflicts = await this.tracker.getConflicts(editor.document);
			if (vscode.window.visibleTextEditors.indexOf(editor) === -1) {
				return;
			}

			if (conflicts.length === 0) {
				this.removeDecorations(editor);
				return;
			}

			// Store decorations keyed by the type of decoration, set decoration wants a "style"
			// to go with it, which will match this key (see constructor);
			const matchDecorations: { [key: string]: vscode.Range[] } = {};

			const pushDecoration = (key: string, d: vscode.Range) => {
				matchDecorations[key] = matchDecorations[key] || [];
				matchDecorations[key].push(d);
			};

			conflicts.forEach(conflict => {
				// TODO, this could be more effective, just call getMatchPositions once with a map of decoration to position
				if (!conflict.current.decoratorContent.isEmpty) {
					pushDecoration('current.content', conflict.current.decoratorContent);
				}
				if (!conflict.incoming.decoratorContent.isEmpty) {
					pushDecoration('incoming.content', conflict.incoming.decoratorContent);
				}

				conflict.commonAncestors.forEach(commonAncestorsRegion => {
					if (!commonAncestorsRegion.decoratorContent.isEmpty) {
						pushDecoration('commonAncestors.content', commonAncestorsRegion.decoratorContent);
					}
				});

				if (this.config!.enableDecorations) {
					pushDecoration('current.header', conflict.current.header);
					pushDecoration('splitter', conflict.splitter);
					pushDecoration('incoming.header', conflict.incoming.header);

					conflict.commonAncestors.forEach(commonAncestorsRegion => {
						pushDecoration('commonAncestors.header', commonAncestorsRegion.header);
					});
				}
			});

			// For each match we've generated, apply the generated decoration with the matching decoration type to the
			// editor instance. Keys in both matches and decorations should match.
			Object.keys(matchDecorations).forEach(decorationKey => {
				const decorationType = this.decorations[decorationKey];

				if (decorationType) {
					editor.setDecorations(decorationType, matchDecorations[decorationKey]);
				}
			});

		} finally {
			this.updating.delete(editor);
		}
	}

	private removeDecorations(editor: vscode.TextEditor) {
		// Remove all decorations, there might be none
		Object.keys(this.decorations).forEach(decorationKey => {

			// Race condition, while editing the settings, it's possible to
			// generate regions before the configuration has been refreshed
			const decorationType = this.decorations[decorationKey];

			if (decorationType) {
				editor.setDecorations(decorationType, []);
			}
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/merge-conflict/src/services.ts]---
Location: vscode-main/extensions/merge-conflict/src/services.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as vscode from 'vscode';
import DocumentTracker from './documentTracker';
import CodeLensProvider from './codelensProvider';
import CommandHandler from './commandHandler';
import ContentProvider from './contentProvider';
import Decorator from './mergeDecorator';
import * as interfaces from './interfaces';
import TelemetryReporter from '@vscode/extension-telemetry';

const ConfigurationSectionName = 'merge-conflict';

export default class ServiceWrapper implements vscode.Disposable {

	private services: vscode.Disposable[] = [];
	private telemetryReporter: TelemetryReporter;

	constructor(private context: vscode.ExtensionContext) {
		const { aiKey } = context.extension.packageJSON as { aiKey: string };
		this.telemetryReporter = new TelemetryReporter(aiKey);
		context.subscriptions.push(this.telemetryReporter);
	}

	begin() {

		const configuration = this.createExtensionConfiguration();
		const documentTracker = new DocumentTracker(this.telemetryReporter);

		this.services.push(
			documentTracker,
			new CommandHandler(documentTracker),
			new CodeLensProvider(documentTracker),
			new ContentProvider(this.context),
			new Decorator(this.context, documentTracker),
		);

		this.services.forEach((service: any) => {
			if (service.begin && service.begin instanceof Function) {
				service.begin(configuration);
			}
		});

		vscode.workspace.onDidChangeConfiguration(() => {
			this.services.forEach((service: any) => {
				if (service.configurationUpdated && service.configurationUpdated instanceof Function) {
					service.configurationUpdated(this.createExtensionConfiguration());
				}
			});
		});
	}

	createExtensionConfiguration(): interfaces.IExtensionConfiguration {
		const workspaceConfiguration = vscode.workspace.getConfiguration(ConfigurationSectionName);
		const codeLensEnabled: boolean = workspaceConfiguration.get('codeLens.enabled', true);
		const decoratorsEnabled: boolean = workspaceConfiguration.get('decorators.enabled', true);

		return {
			enableCodeLens: codeLensEnabled,
			enableDecorations: decoratorsEnabled,
			enableEditorOverview: decoratorsEnabled
		};
	}

	dispose() {
		this.services.forEach(disposable => disposable.dispose());
		this.services = [];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/mermaid-chat-features/.gitignore]---
Location: vscode-main/extensions/mermaid-chat-features/.gitignore

```text
chat-webview-out
```

--------------------------------------------------------------------------------

---[FILE: extensions/mermaid-chat-features/.npmrc]---
Location: vscode-main/extensions/mermaid-chat-features/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/mermaid-chat-features/.vscodeignore]---
Location: vscode-main/extensions/mermaid-chat-features/.vscodeignore

```text
src/**
extension.webpack.config.js
esbuild.*
cgmanifest.json
package-lock.json
webpack.config.js
tsconfig*.json
.gitignore
```

--------------------------------------------------------------------------------

---[FILE: extensions/mermaid-chat-features/cgmanifest.json]---
Location: vscode-main/extensions/mermaid-chat-features/cgmanifest.json

```json
{
	"registrations": [],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/mermaid-chat-features/esbuild-chat-webview.mjs]---
Location: vscode-main/extensions/mermaid-chat-features/esbuild-chat-webview.mjs

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import path from 'path';
import { run } from '../esbuild-webview-common.mjs';

const srcDir = path.join(import.meta.dirname, 'chat-webview-src');
const outDir = path.join(import.meta.dirname, 'chat-webview-out');

run({
	entryPoints: [
		path.join(srcDir, 'index.ts'),
	],
	srcDir,
	outdir: outDir,
}, process.argv);
```

--------------------------------------------------------------------------------

---[FILE: extensions/mermaid-chat-features/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/mermaid-chat-features/extension-browser.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import { browser as withBrowserDefaults } from '../shared.webpack.config.mjs';

export default withBrowserDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/extension.ts'
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/mermaid-chat-features/extension.webpack.config.js]---
Location: vscode-main/extensions/mermaid-chat-features/extension.webpack.config.js

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

````
