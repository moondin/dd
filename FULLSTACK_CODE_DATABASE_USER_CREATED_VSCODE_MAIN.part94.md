---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 94
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 94 of 552)

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

---[FILE: extensions/typescript-language-features/.npmrc]---
Location: vscode-main/extensions/typescript-language-features/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/.vscodeignore]---
Location: vscode-main/extensions/typescript-language-features/.vscodeignore

```text
build/**
src/**
web/**
test/**
test-workspace/**
out/**
tsconfig.json
extension.webpack.config.js
extension-browser.webpack.config.js
cgmanifest.json
package-lock.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/cgmanifest.json]---
Location: vscode-main/extensions/typescript-language-features/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "TypeScript-TmLanguage",
					"repositoryUrl": "https://github.com/microsoft/TypeScript-TmLanguage",
					"commitHash": "3133e3d914db9a2bb8812119f9273727a305f16b"
				}
			},
			"license": "MIT",
			"version": "0.1.8"
		},
		{
			"component": {
				"type": "git",
				"git": {
					"name": "definitelytyped",
					"repositoryUrl": "https://github.com/DefinitelyTyped/DefinitelyTyped",
					"commitHash": "69e3ac6bec3008271f76bbfa7cf69aa9198c4ff0"
				}
			},
			"license": "MIT"
		},
		{
			"component": {
				"type": "other",
				"other": {
					"name": "Unicode",
					"downloadUrl": "https://home.unicode.org/",
					"version": "12.0.0"
				}
			},
			"licenseDetail": [
				"Unicode Data Files include all data files under the directories",
				"https://www.unicode.org/Public/, https://www.unicode.org/reports/,",
				"https://cldr.unicode.org, https://github.com/unicode-org/icu, and",
				"https://www.unicode.org/utility/trac/browser/.",
				"",
				"Unicode Data Files do not include PDF online code charts under the",
				"directory https://www.unicode.org/Public/.",
				"",
				"Software includes any source code published in the Unicode Standard",
				"or under the directories",
				"https://www.unicode.org/Public/, https://www.unicode.org/reports/,",
				"https://cldr.unicode.org, https://github.com/unicode-org/icu, and",
				"https://www.unicode.org/utility/trac/browser/.",
				"",
				"NOTICE TO USER: Carefully read the following legal agreement.",
				"BY DOWNLOADING, INSTALLING, COPYING OR OTHERWISE USING UNICODE INC.'S",
				"DATA FILES (\"DATA FILES\"), AND/OR SOFTWARE (\"SOFTWARE\"),",
				"YOU UNEQUIVOCALLY ACCEPT, AND AGREE TO BE BOUND BY, ALL OF THE",
				"TERMS AND CONDITIONS OF THIS AGREEMENT.",
				"IF YOU DO NOT AGREE, DO NOT DOWNLOAD, INSTALL, COPY, DISTRIBUTE OR USE",
				"THE DATA FILES OR SOFTWARE.",
				"",
				"COPYRIGHT AND PERMISSION NOTICE",
				"",
				"Copyright (c) 1991-2017 Unicode, Inc. All rights reserved.",
				"Distributed under the Terms of Use in http://www.unicode.org/copyright.html.",
				"",
				"Permission is hereby granted, free of charge, to any person obtaining",
				"a copy of the Unicode data files and any associated documentation",
				"(the \"Data Files\") or Unicode software and any associated documentation",
				"(the \"Software\") to deal in the Data Files or Software",
				"without restriction, including without limitation the rights to use,",
				"copy, modify, merge, publish, distribute, and/or sell copies of",
				"the Data Files or Software, and to permit persons to whom the Data Files",
				"or Software are furnished to do so, provided that either",
				"(a) this copyright and permission notice appear with all copies",
				"of the Data Files or Software, or",
				"(b) this copyright and permission notice appear in associated",
				"Documentation.",
				"",
				"THE DATA FILES AND SOFTWARE ARE PROVIDED \"AS IS\", WITHOUT WARRANTY OF",
				"ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE",
				"WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND",
				"NONINFRINGEMENT OF THIRD PARTY RIGHTS.",
				"IN NO EVENT SHALL THE COPYRIGHT HOLDER OR HOLDERS INCLUDED IN THIS",
				"NOTICE BE LIABLE FOR ANY CLAIM, OR ANY SPECIAL INDIRECT OR CONSEQUENTIAL",
				"DAMAGES, OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE,",
				"DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER",
				"TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR",
				"PERFORMANCE OF THE DATA FILES OR SOFTWARE.",
				"",
				"Except as contained in this notice, the name of a copyright holder",
				"shall not be used in advertising or otherwise to promote the sale,",
				"use or other dealings in these Data Files or Software without prior",
				"written authorization of the copyright holder."
			],
			"version": "12.0.0",
			"license": "UNICODE, INC. LICENSE AGREEMENT - DATA FILES AND SOFTWARE"
		},
		{
			"component": {
				"type": "other",
				"other": {
					"name": "Document Object Model",
					"downloadUrl": "https://www.w3.org/DOM/",
					"version": "4.0.0"
				}
			},
			"licenseDetail": [
				"W3C License",
				"This work is being provided by the copyright holders under the following license.",
				"By obtaining and/or copying this work, you (the licensee) agree that you have read, understood, and will comply with the following terms and conditions.",
				"Permission to copy, modify, and distribute this work, with or without modification, for any purpose and without fee or royalty is hereby granted, provided that you include the following ",
				"on ALL copies of the work or portions thereof, including modifications:",
				"* The full text of this NOTICE in a location viewable to users of the redistributed or derivative work.",
				"* Any pre-existing intellectual property disclaimers, notices, or terms and conditions. If none exist, the W3C Software and Document Short Notice should be included.",
				"* Notice of any changes or modifications, through a copyright statement on the new code or document such as \"This software or document includes material copied from or derived ",
				"from Document Object Model. Copyright © 2015 W3C® (MIT, ERCIM, Keio, Beihang).\" ",
				"Disclaimers",
				"THIS WORK IS PROVIDED \"AS IS",
				" AND COPYRIGHT HOLDERS MAKE NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY OR ",
				"FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF THE SOFTWARE OR DOCUMENT WILL NOT INFRINGE ANY THIRD PARTY PATENTS, COPYRIGHTS, TRADEMARKS OR OTHER RIGHTS.",
				"COPYRIGHT HOLDERS WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF ANY USE OF THE SOFTWARE OR DOCUMENT.",
				"The name and trademarks of copyright holders may NOT be used in advertising or publicity pertaining to the work without specific, written prior permission. ",
				"Title to copyright in this work will at all times remain with copyright holders."
			],
			"license": "W3C License",
			"version": "4.0.0"
		},
		{
			"component": {
				"type": "git",
				"git": {
					"name": "Web Background Synchronization",
					"repositoryUrl": "https://github.com/WICG/BackgroundSync",
					"commitHash": "10778afe95b5d46c99f7a77565328b7108091510"
				}
			},
			"license": "Apache-2.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/typescript-language-features/extension-browser.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import defaultConfig, { browser as withBrowserDefaults, browserPlugins } from '../shared.webpack.config.mjs';

const languages = [
	'zh-tw',
	'cs',
	'de',
	'es',
	'fr',
	'it',
	'ja',
	'ko',
	'pl',
	'pt-br',
	'ru',
	'tr',
	'zh-cn',
];
export default [withBrowserDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/extension.browser.ts',
	},
	plugins: [
		...browserPlugins(import.meta.dirname), // add plugins, don't replace inherited

		// @ts-ignore
		new CopyPlugin({
			patterns: [
				{
					from: '../node_modules/typescript/lib/*.d.ts',
					to: 'typescript/[name][ext]',
				},
				{
					from: '../node_modules/typescript/lib/typesMap.json',
					to: 'typescript/'
				},
				...languages.map(lang => ({
					from: `../node_modules/typescript/lib/${lang}/**/*`,
					to: (pathData) => {
						const normalizedFileName = pathData.absoluteFilename.replace(/[\\/]/g, '/');
						const match = normalizedFileName.match(/typescript\/lib\/(.*)/);
						if (match) {
							return `typescript/${match[1]}`;
						}
						console.log(`Did not find typescript/lib in ${normalizedFileName}`);
						return 'typescript/';
					}
				}))
			],
		}),
	],
}), withBrowserDefaults({
	context: import.meta.dirname,
	entry: {
		'typescript/tsserver.web': './web/src/webServer.ts'
	},
	module: {
		exprContextCritical: false,
	},
	ignoreWarnings: [/Critical dependency: the request of a dependency is an expression/],
	output: {
		// all output goes into `dist`.
		// packaging depends on that and this must always be like it
		filename: '[name].js',
		path: path.join(import.meta.dirname, 'dist', 'browser'),
		libraryTarget: undefined,
	},
	externals: {
		'perf_hooks': 'commonjs perf_hooks',
	}
})];
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/extension.webpack.config.js]---
Location: vscode-main/extensions/typescript-language-features/extension.webpack.config.js

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

---[FILE: extensions/typescript-language-features/package-lock.json]---
Location: vscode-main/extensions/typescript-language-features/package-lock.json

```json
{
  "name": "typescript-language-features",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "typescript-language-features",
      "version": "1.0.0",
      "license": "MIT",
      "dependencies": {
        "@vscode/extension-telemetry": "^0.9.8",
        "@vscode/sync-api-client": "^0.7.2",
        "@vscode/sync-api-common": "^0.7.2",
        "@vscode/sync-api-service": "^0.7.3",
        "@vscode/ts-package-manager": "^0.0.2",
        "jsonc-parser": "^3.2.0",
        "semver": "7.5.2",
        "vscode-tas-client": "^0.1.84",
        "vscode-uri": "^3.0.3"
      },
      "devDependencies": {
        "@types/node": "22.x",
        "@types/semver": "^5.5.0"
      },
      "engines": {
        "vscode": "^1.30.0"
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
    "node_modules/@types/semver": {
      "version": "5.5.0",
      "resolved": "https://registry.npmjs.org/@types/semver/-/semver-5.5.0.tgz",
      "integrity": "sha512-41qEJgBH/TWgo5NFSvBCJ1qkoi3Q6ONSF2avrHq1LVEZfYpdHmj0y9SuTK+u9ZhG1sYQKBL1AWXKyLWP4RaUoQ==",
      "dev": true
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
    "node_modules/@vscode/sync-api-client": {
      "version": "0.7.2",
      "resolved": "https://registry.npmjs.org/@vscode/sync-api-client/-/sync-api-client-0.7.2.tgz",
      "integrity": "sha512-HQHz57RVKmR8sTEen1Y/T3r6mzDX7IaUJz/O2RJkn0Qu9ThvCsakLP0N+1iiwPnPfUfmNSwQXbSw8bEQFPcpYQ==",
      "dependencies": {
        "@vscode/sync-api-common": "0.7.2",
        "vscode-uri": "3.0.3"
      },
      "engines": {
        "node": ">=16.15.1"
      }
    },
    "node_modules/@vscode/sync-api-common": {
      "version": "0.7.2",
      "resolved": "https://registry.npmjs.org/@vscode/sync-api-common/-/sync-api-common-0.7.2.tgz",
      "integrity": "sha512-ne1XEeDIYA3mp4oo1QoF1fqFedd0Vf4ybMmLb9HixbTyXy/qwMNL2p6OjXjOsmx6w2q9eqzGA5W/OPRSJxTTIQ==",
      "engines": {
        "node": ">=16.15.1"
      }
    },
    "node_modules/@vscode/sync-api-service": {
      "version": "0.7.3",
      "resolved": "https://registry.npmjs.org/@vscode/sync-api-service/-/sync-api-service-0.7.3.tgz",
      "integrity": "sha512-m2AmmfG4uzfjLMgWRHQ3xnBkdwCiUTO68vdw1XuzMsOb39Jwm9xr5bVVxwOFR9lPC0FfO1H6FUxBhZQvg7itPA==",
      "dependencies": {
        "@vscode/sync-api-common": "0.7.2",
        "vscode-uri": "3.0.3"
      },
      "engines": {
        "node": ">=16.15.1",
        "vscode": "^1.67.0"
      }
    },
    "node_modules/@vscode/ts-package-manager": {
      "version": "0.0.2",
      "resolved": "https://registry.npmjs.org/@vscode/ts-package-manager/-/ts-package-manager-0.0.2.tgz",
      "integrity": "sha512-cXPxGbPVTkEQI8mUiWYUwB6j3ga6M9i7yubUOCrjgZ01GeZPMSnaWRprfJ09uuy81wJjY2gfHgLsOgwrGvUBTw==",
      "engines": {
        "node": "*"
      }
    },
    "node_modules/jsonc-parser": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/jsonc-parser/-/jsonc-parser-3.2.0.tgz",
      "integrity": "sha512-gfFQZrcTc8CnKXp6Y4/CBT3fTc0OVuDofpre4aEeEpSBPV5X5v4+Vmx+8snU7RLPrNHPKSgLxGo9YuQzz20o+w=="
    },
    "node_modules/lru-cache": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-6.0.0.tgz",
      "integrity": "sha512-Jo6dJ04CmSjuznwJSS3pUeWmd/H0ffTlkXXgwZi+eq1UCmqQwCh+eLsYOYCwY991i2Fah4h1BEMCx4qThGbsiA==",
      "dependencies": {
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/semver": {
      "version": "7.5.2",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.5.2.tgz",
      "integrity": "sha512-SoftuTROv/cRjCze/scjGyiDtcUyxw1rgYQSZY7XTmtR5hX+dm76iDbTH8TkLPHCQmlbQVSSbNZCPM2hb0knnQ==",
      "dependencies": {
        "lru-cache": "^6.0.0"
      },
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/tas-client": {
      "version": "0.2.33",
      "resolved": "https://registry.npmjs.org/tas-client/-/tas-client-0.2.33.tgz",
      "integrity": "sha512-V+uqV66BOQnWxvI6HjDnE4VkInmYZUQ4dgB7gzaDyFyFSK1i1nF/j7DpS9UbQAgV9NaF1XpcyuavnM1qOeiEIg=="
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/vscode-tas-client": {
      "version": "0.1.84",
      "resolved": "https://registry.npmjs.org/vscode-tas-client/-/vscode-tas-client-0.1.84.tgz",
      "integrity": "sha512-rUTrUopV+70hvx1hW5ebdw1nd6djxubkLvVxjGdyD/r5v/wcVF41LIfiAtbm5qLZDtQdsMH1IaCuDoluoIa88w==",
      "dependencies": {
        "tas-client": "0.2.33"
      },
      "engines": {
        "vscode": "^1.85.0"
      }
    },
    "node_modules/vscode-uri": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/vscode-uri/-/vscode-uri-3.0.3.tgz",
      "integrity": "sha512-EcswR2S8bpR7fD0YPeS7r2xXExrScVMxg4MedACaWHEtx9ftCF/qHG1xGkolzTPcEmjTavCQgbVzHUIdTMzFGA=="
    },
    "node_modules/yallist": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-4.0.0.tgz",
      "integrity": "sha512-3wdGidZyq5PB084XLES5TpOSRA3wjXAlIWMhum2kRcv/41Sn2emQ0dycQW4uZXLejwKvg6EsvbdlVL+FYEct7A=="
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/package.json]---
Location: vscode-main/extensions/typescript-language-features/package.json

```json
{
  "name": "typescript-language-features",
  "description": "%description%",
  "displayName": "%displayName%",
  "version": "1.0.0",
  "author": "vscode",
  "publisher": "vscode",
  "license": "MIT",
  "aiKey": "0c6ae279ed8443289764825290e4f9e2-1a736e7c-1324-4338-be46-fc2a58ae4d14-7255",
  "enabledApiProposals": [
    "workspaceTrust",
    "multiDocumentHighlightProvider",
    "codeActionAI",
    "codeActionRanges",
    "editorHoverVerbosityLevel"
  ],
  "capabilities": {
    "virtualWorkspaces": {
      "supported": "limited",
      "description": "%virtualWorkspaces%"
    },
    "untrustedWorkspaces": {
      "supported": "limited",
      "description": "%workspaceTrust%",
      "restrictedConfigurations": [
        "typescript.tsdk",
        "typescript.tsserver.pluginPaths",
        "typescript.npm",
        "typescript.tsserver.nodePath"
      ]
    }
  },
  "engines": {
    "vscode": "^1.30.0"
  },
  "icon": "media/icon.png",
  "categories": [
    "Programming Languages"
  ],
  "dependencies": {
    "@vscode/extension-telemetry": "^0.9.8",
    "@vscode/sync-api-client": "^0.7.2",
    "@vscode/sync-api-common": "^0.7.2",
    "@vscode/sync-api-service": "^0.7.3",
    "@vscode/ts-package-manager": "^0.0.2",
    "jsonc-parser": "^3.2.0",
    "semver": "7.5.2",
    "vscode-tas-client": "^0.1.84",
    "vscode-uri": "^3.0.3"
  },
  "devDependencies": {
    "@types/node": "22.x",
    "@types/semver": "^5.5.0"
  },
  "scripts": {
    "vscode:prepublish": "node ../../node_modules/gulp/bin/gulp.js --gulpfile ../../build/gulpfile.extensions.mjs compile-extension:typescript-language-features",
    "compile-web": "npx webpack-cli --config extension-browser.webpack.config --mode none",
    "watch-web": "npx webpack-cli --config extension-browser.webpack.config --mode none --watch"
  },
  "activationEvents": [
    "onLanguage:javascript",
    "onLanguage:javascriptreact",
    "onLanguage:typescript",
    "onLanguage:typescriptreact",
    "onLanguage:jsx-tags",
    "onCommand:typescript.tsserverRequest",
    "onCommand:_typescript.configurePlugin",
    "onCommand:_typescript.learnMoreAboutRefactorings",
    "onCommand:typescript.fileReferences",
    "onTaskType:typescript",
    "onLanguage:jsonc",
    "onWalkthrough:nodejsWelcome"
  ],
  "main": "./out/extension",
  "browser": "./dist/browser/extension",
  "contributes": {
    "jsonValidation": [
      {
        "fileMatch": "package.json",
        "url": "./schemas/package.schema.json"
      },
      {
        "fileMatch": "tsconfig.json",
        "url": "https://www.schemastore.org/tsconfig"
      },
      {
        "fileMatch": "tsconfig.json",
        "url": "./schemas/tsconfig.schema.json"
      },
      {
        "fileMatch": "tsconfig.*.json",
        "url": "https://www.schemastore.org/tsconfig"
      },
      {
        "fileMatch": "tsconfig-*.json",
        "url": "./schemas/tsconfig.schema.json"
      },
      {
        "fileMatch": "tsconfig-*.json",
        "url": "https://www.schemastore.org/tsconfig"
      },
      {
        "fileMatch": "tsconfig.*.json",
        "url": "./schemas/tsconfig.schema.json"
      },
      {
        "fileMatch": "typings.json",
        "url": "https://www.schemastore.org/typings"
      },
      {
        "fileMatch": ".bowerrc",
        "url": "https://www.schemastore.org/bowerrc"
      },
      {
        "fileMatch": ".babelrc",
        "url": "https://www.schemastore.org/babelrc"
      },
      {
        "fileMatch": ".babelrc.json",
        "url": "https://www.schemastore.org/babelrc"
      },
      {
        "fileMatch": "babel.config.json",
        "url": "https://www.schemastore.org/babelrc"
      },
      {
        "fileMatch": "jsconfig.json",
        "url": "https://www.schemastore.org/jsconfig"
      },
      {
        "fileMatch": "jsconfig.json",
        "url": "./schemas/jsconfig.schema.json"
      },
      {
        "fileMatch": "jsconfig.*.json",
        "url": "https://www.schemastore.org/jsconfig"
      },
      {
        "fileMatch": "jsconfig.*.json",
        "url": "./schemas/jsconfig.schema.json"
      },
      {
        "fileMatch": ".swcrc",
        "url": "https://swc.rs/schema.json"
      },
      {
        "fileMatch": "typedoc.json",
        "url": "https://typedoc.org/schema.json"
      }
    ],
    "configuration": [
      {
        "type": "object",
        "order": 20,
        "properties": {
          "typescript.tsdk": {
            "type": "string",
            "markdownDescription": "%typescript.tsdk.desc%",
            "scope": "window"
          },
          "typescript.disableAutomaticTypeAcquisition": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "%typescript.disableAutomaticTypeAcquisition%",
            "scope": "window",
            "tags": [
              "usesOnlineServices"
            ]
          },
          "typescript.enablePromptUseWorkspaceTsdk": {
            "type": "boolean",
            "default": false,
            "description": "%typescript.enablePromptUseWorkspaceTsdk%",
            "scope": "window"
          },
          "javascript.referencesCodeLens.enabled": {
            "type": "boolean",
            "default": false,
            "description": "%javascript.referencesCodeLens.enabled%",
            "scope": "window"
          },
          "javascript.referencesCodeLens.showOnAllFunctions": {
            "type": "boolean",
            "default": false,
            "description": "%javascript.referencesCodeLens.showOnAllFunctions%",
            "scope": "window"
          },
          "typescript.referencesCodeLens.enabled": {
            "type": "boolean",
            "default": false,
            "description": "%typescript.referencesCodeLens.enabled%",
            "scope": "window"
          },
          "typescript.referencesCodeLens.showOnAllFunctions": {
            "type": "boolean",
            "default": false,
            "description": "%typescript.referencesCodeLens.showOnAllFunctions%",
            "scope": "window"
          },
          "typescript.implementationsCodeLens.enabled": {
            "type": "boolean",
            "default": false,
            "description": "%typescript.implementationsCodeLens.enabled%",
            "scope": "window"
          },
          "typescript.experimental.useTsgo": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "%typescript.useTsgo%",
            "scope": "window",
            "tags": [
              "experimental"
            ]
          },
          "typescript.implementationsCodeLens.showOnInterfaceMethods": {
            "type": "boolean",
            "default": false,
            "description": "%typescript.implementationsCodeLens.showOnInterfaceMethods%",
            "scope": "window"
          },
          "typescript.implementationsCodeLens.showOnAllClassMethods": {
            "type": "boolean",
            "default": false,
            "description": "%typescript.implementationsCodeLens.showOnAllClassMethods%",
            "scope": "window"
          },
          "typescript.reportStyleChecksAsWarnings": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.reportStyleChecksAsWarnings%",
            "scope": "window"
          },
          "typescript.validate.enable": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.validate.enable%",
            "scope": "window"
          },
          "javascript.validate.enable": {
            "type": "boolean",
            "default": true,
            "description": "%javascript.validate.enable%",
            "scope": "window"
          },
          "js/ts.implicitProjectConfig.module": {
            "type": "string",
            "markdownDescription": "%configuration.implicitProjectConfig.module%",
            "default": "ESNext",
            "enum": [
              "CommonJS",
              "AMD",
              "System",
              "UMD",
              "ES6",
              "ES2015",
              "ES2020",
              "ESNext",
              "None",
              "ES2022",
              "Node12",
              "NodeNext"
            ],
            "scope": "window"
          },
          "js/ts.implicitProjectConfig.target": {
            "type": "string",
            "default": "ES2024",
            "markdownDescription": "%configuration.implicitProjectConfig.target%",
            "enum": [
              "ES3",
              "ES5",
              "ES6",
              "ES2015",
              "ES2016",
              "ES2017",
              "ES2018",
              "ES2019",
              "ES2020",
              "ES2021",
              "ES2022",
              "ES2023",
              "ES2024",
              "ESNext"
            ],
            "scope": "window"
          },
          "js/ts.implicitProjectConfig.checkJs": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "%configuration.implicitProjectConfig.checkJs%",
            "scope": "window"
          },
          "js/ts.implicitProjectConfig.experimentalDecorators": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "%configuration.implicitProjectConfig.experimentalDecorators%",
            "scope": "window"
          },
          "js/ts.implicitProjectConfig.strictNullChecks": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "%configuration.implicitProjectConfig.strictNullChecks%",
            "scope": "window"
          },
          "js/ts.implicitProjectConfig.strictFunctionTypes": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "%configuration.implicitProjectConfig.strictFunctionTypes%",
            "scope": "window"
          },
          "js/ts.implicitProjectConfig.strict": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "%configuration.implicitProjectConfig.strict%",
            "scope": "window"
          },
          "typescript.tsc.autoDetect": {
            "type": "string",
            "default": "on",
            "enum": [
              "on",
              "off",
              "build",
              "watch"
            ],
            "markdownEnumDescriptions": [
              "%typescript.tsc.autoDetect.on%",
              "%typescript.tsc.autoDetect.off%",
              "%typescript.tsc.autoDetect.build%",
              "%typescript.tsc.autoDetect.watch%"
            ],
            "description": "%typescript.tsc.autoDetect%",
            "scope": "window"
          },
          "typescript.locale": {
            "type": "string",
            "default": "auto",
            "enum": [
              "auto",
              "de",
              "es",
              "en",
              "fr",
              "it",
              "ja",
              "ko",
              "ru",
              "zh-CN",
              "zh-TW"
            ],
            "enumDescriptions": [
              "%typescript.locale.auto%",
              "Deutsch",
              "español",
              "English",
              "français",
              "italiano",
              "日本語",
              "한국어",
              "русский",
              "中文(简体)",
              "中文(繁體)"
            ],
            "markdownDescription": "%typescript.locale%",
            "scope": "window"
          },
          "javascript.suggestionActions.enabled": {
            "type": "boolean",
            "default": true,
            "description": "%javascript.suggestionActions.enabled%",
            "scope": "resource"
          },
          "typescript.suggestionActions.enabled": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.suggestionActions.enabled%",
            "scope": "resource"
          },
          "typescript.updateImportsOnFileMove.enabled": {
            "type": "string",
            "enum": [
              "prompt",
              "always",
              "never"
            ],
            "markdownEnumDescriptions": [
              "%typescript.updateImportsOnFileMove.enabled.prompt%",
              "%typescript.updateImportsOnFileMove.enabled.always%",
              "%typescript.updateImportsOnFileMove.enabled.never%"
            ],
            "default": "prompt",
            "description": "%typescript.updateImportsOnFileMove.enabled%",
            "scope": "resource"
          },
          "javascript.updateImportsOnFileMove.enabled": {
            "type": "string",
            "enum": [
              "prompt",
              "always",
              "never"
            ],
            "markdownEnumDescriptions": [
              "%typescript.updateImportsOnFileMove.enabled.prompt%",
              "%typescript.updateImportsOnFileMove.enabled.always%",
              "%typescript.updateImportsOnFileMove.enabled.never%"
            ],
            "default": "prompt",
            "description": "%typescript.updateImportsOnFileMove.enabled%",
            "scope": "resource"
          },
          "typescript.autoClosingTags": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.autoClosingTags%",
            "scope": "language-overridable"
          },
          "javascript.autoClosingTags": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.autoClosingTags%",
            "scope": "language-overridable"
          },
          "typescript.workspaceSymbols.scope": {
            "type": "string",
            "enum": [
              "allOpenProjects",
              "currentProject"
            ],
            "enumDescriptions": [
              "%typescript.workspaceSymbols.scope.allOpenProjects%",
              "%typescript.workspaceSymbols.scope.currentProject%"
            ],
            "default": "allOpenProjects",
            "markdownDescription": "%typescript.workspaceSymbols.scope%",
            "scope": "window"
          },
          "typescript.preferGoToSourceDefinition": {
            "type": "boolean",
            "default": false,
            "description": "%configuration.preferGoToSourceDefinition%",
            "scope": "window"
          },
          "javascript.preferGoToSourceDefinition": {
            "type": "boolean",
            "default": false,
            "description": "%configuration.preferGoToSourceDefinition%",
            "scope": "window"
          },
          "typescript.workspaceSymbols.excludeLibrarySymbols": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "%typescript.workspaceSymbols.excludeLibrarySymbols%",
            "scope": "window"
          },
          "typescript.tsserver.enableRegionDiagnostics": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.tsserver.enableRegionDiagnostics%",
            "scope": "window"
          },
          "javascript.updateImportsOnPaste.enabled": {
            "scope": "window",
            "type": "boolean",
            "default": true,
            "markdownDescription": "%configuration.updateImportsOnPaste%"
          },
          "typescript.updateImportsOnPaste.enabled": {
            "scope": "window",
            "type": "boolean",
            "default": true,
            "markdownDescription": "%configuration.updateImportsOnPaste%"
          },
          "js/ts.hover.maximumLength": {
            "type": "number",
            "default": 500,
            "description": "%configuration.hover.maximumLength%",
            "scope": "resource"
          }
        }
      },
      {
        "type": "object",
        "title": "%configuration.suggest%",
        "order": 21,
        "properties": {
          "javascript.suggest.enabled": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.suggest.enabled%",
            "scope": "language-overridable"
          },
          "typescript.suggest.enabled": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.suggest.enabled%",
            "scope": "language-overridable"
          },
          "javascript.suggest.autoImports": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.suggest.autoImports%",
            "scope": "resource"
          },
          "typescript.suggest.autoImports": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.suggest.autoImports%",
            "scope": "resource"
          },
          "javascript.suggest.names": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "%configuration.suggest.names%",
            "scope": "resource"
          },
          "javascript.suggest.completeFunctionCalls": {
            "type": "boolean",
            "default": false,
            "description": "%configuration.suggest.completeFunctionCalls%",
            "scope": "resource"
          },
          "typescript.suggest.completeFunctionCalls": {
            "type": "boolean",
            "default": false,
            "description": "%configuration.suggest.completeFunctionCalls%",
            "scope": "resource"
          },
          "javascript.suggest.paths": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.suggest.paths%",
            "scope": "resource"
          },
          "typescript.suggest.paths": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.suggest.paths%",
            "scope": "resource"
          },
          "javascript.suggest.completeJSDocs": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.suggest.completeJSDocs%",
            "scope": "language-overridable"
          },
          "typescript.suggest.completeJSDocs": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.suggest.completeJSDocs%",
            "scope": "language-overridable"
          },
          "javascript.suggest.jsdoc.generateReturns": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "%configuration.suggest.jsdoc.generateReturns%",
            "scope": "language-overridable"
          },
          "typescript.suggest.jsdoc.generateReturns": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "%configuration.suggest.jsdoc.generateReturns%",
            "scope": "language-overridable"
          },
          "javascript.suggest.includeAutomaticOptionalChainCompletions": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.suggest.includeAutomaticOptionalChainCompletions%",
            "scope": "resource"
          },
          "typescript.suggest.includeAutomaticOptionalChainCompletions": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.suggest.includeAutomaticOptionalChainCompletions%",
            "scope": "resource"
          },
          "javascript.suggest.includeCompletionsForImportStatements": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.suggest.includeCompletionsForImportStatements%",
            "scope": "resource"
          },
          "typescript.suggest.includeCompletionsForImportStatements": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.suggest.includeCompletionsForImportStatements%",
            "scope": "resource"
          },
          "javascript.suggest.classMemberSnippets.enabled": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.suggest.classMemberSnippets.enabled%",
            "scope": "resource"
          },
          "typescript.suggest.classMemberSnippets.enabled": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.suggest.classMemberSnippets.enabled%",
            "scope": "resource"
          },
          "typescript.suggest.objectLiteralMethodSnippets.enabled": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.suggest.objectLiteralMethodSnippets.enabled%",
            "scope": "resource"
          }
        }
      },
      {
        "type": "object",
        "title": "%configuration.preferences%",
        "order": 21,
        "properties": {
          "javascript.preferences.quoteStyle": {
            "type": "string",
            "enum": [
              "auto",
              "single",
              "double"
            ],
            "default": "auto",
            "markdownDescription": "%typescript.preferences.quoteStyle%",
            "markdownEnumDescriptions": [
              "%typescript.preferences.quoteStyle.auto%",
              "%typescript.preferences.quoteStyle.single%",
              "%typescript.preferences.quoteStyle.double%"
            ],
            "scope": "language-overridable"
          },
          "typescript.preferences.quoteStyle": {
            "type": "string",
            "enum": [
              "auto",
              "single",
              "double"
            ],
            "default": "auto",
            "markdownDescription": "%typescript.preferences.quoteStyle%",
            "markdownEnumDescriptions": [
              "%typescript.preferences.quoteStyle.auto%",
              "%typescript.preferences.quoteStyle.single%",
              "%typescript.preferences.quoteStyle.double%"
            ],
            "scope": "language-overridable"
          },
          "javascript.preferences.importModuleSpecifier": {
            "type": "string",
            "enum": [
              "shortest",
              "relative",
              "non-relative",
              "project-relative"
            ],
            "markdownEnumDescriptions": [
              "%typescript.preferences.importModuleSpecifier.shortest%",
              "%typescript.preferences.importModuleSpecifier.relative%",
              "%typescript.preferences.importModuleSpecifier.nonRelative%",
              "%typescript.preferences.importModuleSpecifier.projectRelative%"
            ],
            "default": "shortest",
            "description": "%typescript.preferences.importModuleSpecifier%",
            "scope": "language-overridable"
          },
          "typescript.preferences.importModuleSpecifier": {
            "type": "string",
            "enum": [
              "shortest",
              "relative",
              "non-relative",
              "project-relative"
            ],
            "markdownEnumDescriptions": [
              "%typescript.preferences.importModuleSpecifier.shortest%",
              "%typescript.preferences.importModuleSpecifier.relative%",
              "%typescript.preferences.importModuleSpecifier.nonRelative%",
              "%typescript.preferences.importModuleSpecifier.projectRelative%"
            ],
            "default": "shortest",
            "description": "%typescript.preferences.importModuleSpecifier%",
            "scope": "language-overridable"
          },
          "javascript.preferences.importModuleSpecifierEnding": {
            "type": "string",
            "enum": [
              "auto",
              "minimal",
              "index",
              "js"
            ],
            "enumItemLabels": [
              null,
              null,
              null,
              "%typescript.preferences.importModuleSpecifierEnding.label.js%"
            ],
            "markdownEnumDescriptions": [
              "%typescript.preferences.importModuleSpecifierEnding.auto%",
              "%typescript.preferences.importModuleSpecifierEnding.minimal%",
              "%typescript.preferences.importModuleSpecifierEnding.index%",
              "%typescript.preferences.importModuleSpecifierEnding.js%"
            ],
            "default": "auto",
            "description": "%typescript.preferences.importModuleSpecifierEnding%",
            "scope": "language-overridable"
          },
          "typescript.preferences.importModuleSpecifierEnding": {
            "type": "string",
            "enum": [
              "auto",
              "minimal",
              "index",
              "js"
            ],
            "enumItemLabels": [
              null,
              null,
              null,
              "%typescript.preferences.importModuleSpecifierEnding.label.js%"
            ],
            "markdownEnumDescriptions": [
              "%typescript.preferences.importModuleSpecifierEnding.auto%",
              "%typescript.preferences.importModuleSpecifierEnding.minimal%",
              "%typescript.preferences.importModuleSpecifierEnding.index%",
              "%typescript.preferences.importModuleSpecifierEnding.js%"
            ],
            "default": "auto",
            "description": "%typescript.preferences.importModuleSpecifierEnding%",
            "scope": "language-overridable"
          },
          "javascript.preferences.jsxAttributeCompletionStyle": {
            "type": "string",
            "enum": [
              "auto",
              "braces",
              "none"
            ],
            "markdownEnumDescriptions": [
              "%javascript.preferences.jsxAttributeCompletionStyle.auto%",
              "%typescript.preferences.jsxAttributeCompletionStyle.braces%",
              "%typescript.preferences.jsxAttributeCompletionStyle.none%"
            ],
            "default": "auto",
            "description": "%typescript.preferences.jsxAttributeCompletionStyle%",
            "scope": "language-overridable"
          },
          "typescript.preferences.jsxAttributeCompletionStyle": {
            "type": "string",
            "enum": [
              "auto",
              "braces",
              "none"
            ],
            "markdownEnumDescriptions": [
              "%typescript.preferences.jsxAttributeCompletionStyle.auto%",
              "%typescript.preferences.jsxAttributeCompletionStyle.braces%",
              "%typescript.preferences.jsxAttributeCompletionStyle.none%"
            ],
            "default": "auto",
            "description": "%typescript.preferences.jsxAttributeCompletionStyle%",
            "scope": "language-overridable"
          },
          "typescript.preferences.includePackageJsonAutoImports": {
            "type": "string",
            "enum": [
              "auto",
              "on",
              "off"
            ],
            "enumDescriptions": [
              "%typescript.preferences.includePackageJsonAutoImports.auto%",
              "%typescript.preferences.includePackageJsonAutoImports.on%",
              "%typescript.preferences.includePackageJsonAutoImports.off%"
            ],
            "default": "auto",
            "markdownDescription": "%typescript.preferences.includePackageJsonAutoImports%",
            "scope": "window"
          },
          "javascript.preferences.autoImportFileExcludePatterns": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "markdownDescription": "%typescript.preferences.autoImportFileExcludePatterns%",
            "scope": "resource"
          },
          "typescript.preferences.autoImportFileExcludePatterns": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "markdownDescription": "%typescript.preferences.autoImportFileExcludePatterns%",
            "scope": "resource"
          },
          "javascript.preferences.autoImportSpecifierExcludeRegexes": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "markdownDescription": "%typescript.preferences.autoImportSpecifierExcludeRegexes%",
            "scope": "resource"
          },
          "typescript.preferences.autoImportSpecifierExcludeRegexes": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "markdownDescription": "%typescript.preferences.autoImportSpecifierExcludeRegexes%",
            "scope": "resource"
          },
          "typescript.preferences.preferTypeOnlyAutoImports": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "%typescript.preferences.preferTypeOnlyAutoImports%",
            "scope": "resource"
          },
          "javascript.preferences.useAliasesForRenames": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.preferences.useAliasesForRenames%",
            "scope": "language-overridable"
          },
          "typescript.preferences.useAliasesForRenames": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.preferences.useAliasesForRenames%",
            "scope": "language-overridable"
          },
          "javascript.preferences.renameMatchingJsxTags": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.preferences.renameMatchingJsxTags%",
            "scope": "language-overridable"
          },
          "typescript.preferences.renameMatchingJsxTags": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.preferences.renameMatchingJsxTags%",
            "scope": "language-overridable"
          },
          "javascript.preferences.organizeImports": {
            "type": "object",
            "markdownDescription": "%typescript.preferences.organizeImports%",
            "properties": {
              "caseSensitivity": {
                "type": "string",
                "markdownDescription": "%typescript.preferences.organizeImports.caseSensitivity%",
                "enum": [
                  "auto",
                  "caseInsensitive",
                  "caseSensitive"
                ],
                "markdownEnumDescriptions": [
                  "%typescript.preferences.organizeImports.caseSensitivity.auto%",
                  "%typescript.preferences.organizeImports.caseSensitivity.insensitive",
                  "%typescript.preferences.organizeImports.caseSensitivity.sensitive%"
                ],
                "default": "auto"
              },
              "typeOrder": {
                "type": "string",
                "markdownDescription": "%typescript.preferences.organizeImports.typeOrder%",
                "enum": [
                  "auto",
                  "last",
                  "inline",
                  "first"
                ],
                "default": "auto",
                "markdownEnumDescriptions": [
                  "%typescript.preferences.organizeImports.typeOrder.auto%",
                  "%typescript.preferences.organizeImports.typeOrder.last%",
                  "%typescript.preferences.organizeImports.typeOrder.inline%",
                  "%typescript.preferences.organizeImports.typeOrder.first%"
                ]
              },
              "unicodeCollation": {
                "type": "string",
                "markdownDescription": "%typescript.preferences.organizeImports.unicodeCollation%",
                "enum": [
                  "ordinal",
                  "unicode"
                ],
                "markdownEnumDescriptions": [
                  "%typescript.preferences.organizeImports.unicodeCollation.ordinal%",
                  "%typescript.preferences.organizeImports.unicodeCollation.unicode%"
                ],
                "default": "ordinal"
              },
              "locale": {
                "type": "string",
                "markdownDescription": "%typescript.preferences.organizeImports.locale%"
              },
              "numericCollation": {
                "type": "boolean",
                "markdownDescription": "%typescript.preferences.organizeImports.numericCollation%"
              },
              "accentCollation": {
                "type": "boolean",
                "markdownDescription": "%typescript.preferences.organizeImports.accentCollation%"
              },
              "caseFirst": {
                "type": "string",
                "markdownDescription": "%typescript.preferences.organizeImports.caseFirst%",
                "enum": [
                  "default",
                  "upper",
                  "lower"
                ],
                "markdownEnumDescriptions": [
                  "%typescript.preferences.organizeImports.caseFirst.default%",
                  "%typescript.preferences.organizeImports.caseFirst.upper%",
                  "%typescript.preferences.organizeImports.caseFirst.lower%"
                ],
                "default": "default"
              }
            }
          },
          "typescript.preferences.organizeImports": {
            "type": "object",
            "markdownDescription": "%typescript.preferences.organizeImports%",
            "properties": {
              "caseSensitivity": {
                "type": "string",
                "markdownDescription": "%typescript.preferences.organizeImports.caseSensitivity%",
                "enum": [
                  "auto",
                  "caseInsensitive",
                  "caseSensitive"
                ],
                "markdownEnumDescriptions": [
                  "%typescript.preferences.organizeImports.caseSensitivity.auto%",
                  "%typescript.preferences.organizeImports.caseSensitivity.insensitive",
                  "%typescript.preferences.organizeImports.caseSensitivity.sensitive%"
                ],
                "default": "auto"
              },
              "typeOrder": {
                "type": "string",
                "markdownDescription": "%typescript.preferences.organizeImports.typeOrder%",
                "enum": [
                  "auto",
                  "last",
                  "inline",
                  "first"
                ],
                "default": "auto",
                "markdownEnumDescriptions": [
                  "%typescript.preferences.organizeImports.typeOrder.auto%",
                  "%typescript.preferences.organizeImports.typeOrder.last%",
                  "%typescript.preferences.organizeImports.typeOrder.inline%",
                  "%typescript.preferences.organizeImports.typeOrder.first%"
                ]
              },
              "unicodeCollation": {
                "type": "string",
                "markdownDescription": "%typescript.preferences.organizeImports.unicodeCollation%",
                "enum": [
                  "ordinal",
                  "unicode"
                ],
                "markdownEnumDescriptions": [
                  "%typescript.preferences.organizeImports.unicodeCollation.ordinal%",
                  "%typescript.preferences.organizeImports.unicodeCollation.unicode%"
                ],
                "default": "ordinal"
              },
              "locale": {
                "type": "string",
                "markdownDescription": "%typescript.preferences.organizeImports.locale%"
              },
              "numericCollation": {
                "type": "boolean",
                "markdownDescription": "%typescript.preferences.organizeImports.numericCollation%"
              },
              "accentCollation": {
                "type": "boolean",
                "markdownDescription": "%typescript.preferences.organizeImports.accentCollation%"
              },
              "caseFirst": {
                "type": "string",
                "markdownDescription": "%typescript.preferences.organizeImports.caseFirst%",
                "enum": [
                  "default",
                  "upper",
                  "lower"
                ],
                "markdownEnumDescriptions": [
                  "%typescript.preferences.organizeImports.caseFirst.default%",
                  "%typescript.preferences.organizeImports.caseFirst.upper%",
                  "%typescript.preferences.organizeImports.caseFirst.lower%"
                ],
                "default": "default"
              }
            }
          }
        }
      },
      {
        "type": "object",
        "title": "%configuration.format%",
        "order": 23,
        "properties": {
          "javascript.format.enable": {
            "type": "boolean",
            "default": true,
            "description": "%javascript.format.enable%",
            "scope": "window"
          },
          "typescript.format.enable": {
            "type": "boolean",
            "default": true,
            "description": "%typescript.format.enable%",
            "scope": "window"
          },
          "javascript.format.insertSpaceAfterCommaDelimiter": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterCommaDelimiter%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterCommaDelimiter": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterCommaDelimiter%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceAfterConstructor": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterConstructor%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterConstructor": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterConstructor%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceAfterSemicolonInForStatements": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterSemicolonInForStatements%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterSemicolonInForStatements": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterSemicolonInForStatements%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceBeforeAndAfterBinaryOperators": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceBeforeAndAfterBinaryOperators%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceBeforeAndAfterBinaryOperators": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceBeforeAndAfterBinaryOperators%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceAfterKeywordsInControlFlowStatements": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterKeywordsInControlFlowStatements%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterKeywordsInControlFlowStatements": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterKeywordsInControlFlowStatements%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceAfterFunctionKeywordForAnonymousFunctions": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterFunctionKeywordForAnonymousFunctions%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterFunctionKeywordForAnonymousFunctions": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterFunctionKeywordForAnonymousFunctions%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceBeforeFunctionParenthesis": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceBeforeFunctionParenthesis%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceBeforeFunctionParenthesis": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceBeforeFunctionParenthesis%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceAfterOpeningAndBeforeClosingEmptyBraces": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingEmptyBraces%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterOpeningAndBeforeClosingEmptyBraces": {
            "type": "boolean",
            "default": true,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingEmptyBraces%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces%",
            "scope": "resource"
          },
          "javascript.format.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces%",
            "scope": "resource"
          },
          "typescript.format.insertSpaceAfterTypeAssertion": {
            "type": "boolean",
            "default": false,
            "description": "%format.insertSpaceAfterTypeAssertion%",
            "scope": "resource"
          },
          "javascript.format.placeOpenBraceOnNewLineForFunctions": {
            "type": "boolean",
            "default": false,
            "description": "%format.placeOpenBraceOnNewLineForFunctions%",
            "scope": "resource"
          },
          "typescript.format.placeOpenBraceOnNewLineForFunctions": {
            "type": "boolean",
            "default": false,
            "description": "%format.placeOpenBraceOnNewLineForFunctions%",
            "scope": "resource"
          },
          "javascript.format.placeOpenBraceOnNewLineForControlBlocks": {
            "type": "boolean",
            "default": false,
            "description": "%format.placeOpenBraceOnNewLineForControlBlocks%",
            "scope": "resource"
          },
          "typescript.format.placeOpenBraceOnNewLineForControlBlocks": {
            "type": "boolean",
            "default": false,
            "description": "%format.placeOpenBraceOnNewLineForControlBlocks%",
            "scope": "resource"
          },
          "javascript.format.semicolons": {
            "type": "string",
            "default": "ignore",
            "description": "%format.semicolons%",
            "scope": "resource",
            "enum": [
              "ignore",
              "insert",
              "remove"
            ],
            "enumDescriptions": [
              "%format.semicolons.ignore%",
              "%format.semicolons.insert%",
              "%format.semicolons.remove%"
            ]
          },
          "typescript.format.semicolons": {
            "type": "string",
            "default": "ignore",
            "description": "%format.semicolons%",
            "scope": "resource",
            "enum": [
              "ignore",
              "insert",
              "remove"
            ],
            "enumDescriptions": [
              "%format.semicolons.ignore%",
              "%format.semicolons.insert%",
              "%format.semicolons.remove%"
            ]
          },
          "javascript.format.indentSwitchCase": {
            "type": "boolean",
            "default": true,
            "description": "%format.indentSwitchCase%",
            "scope": "resource"
          },
          "typescript.format.indentSwitchCase": {
            "type": "boolean",
            "default": true,
            "description": "%format.indentSwitchCase%",
            "scope": "resource"
          }
        }
      },
      {
        "type": "object",
        "title": "%configuration.inlayHints%",
        "order": 24,
        "properties": {
          "typescript.inlayHints.parameterNames.enabled": {
            "type": "string",
            "enum": [
              "none",
              "literals",
              "all"
            ],
            "enumDescriptions": [
              "%inlayHints.parameterNames.none%",
              "%inlayHints.parameterNames.literals%",
              "%inlayHints.parameterNames.all%"
            ],
            "default": "none",
            "markdownDescription": "%configuration.inlayHints.parameterNames.enabled%",
            "scope": "resource"
          },
          "typescript.inlayHints.parameterNames.suppressWhenArgumentMatchesName": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "%configuration.inlayHints.parameterNames.suppressWhenArgumentMatchesName%",
            "scope": "resource"
          },
          "typescript.inlayHints.parameterTypes.enabled": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "%configuration.inlayHints.parameterTypes.enabled%",
            "scope": "resource"
          },
          "typescript.inlayHints.variableTypes.enabled": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "%configuration.inlayHints.variableTypes.enabled%",
            "scope": "resource"
          },
          "typescript.inlayHints.variableTypes.suppressWhenTypeMatchesName": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "%configuration.inlayHints.variableTypes.suppressWhenTypeMatchesName%",
            "scope": "resource"
          },
          "typescript.inlayHints.propertyDeclarationTypes.enabled": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "%configuration.inlayHints.propertyDeclarationTypes.enabled%",
            "scope": "resource"
          },
          "typescript.inlayHints.functionLikeReturnTypes.enabled": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "%configuration.inlayHints.functionLikeReturnTypes.enabled%",
            "scope": "resource"
          },
          "typescript.inlayHints.enumMemberValues.enabled": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "%configuration.inlayHints.enumMemberValues.enabled%",
            "scope": "resource"
          },
          "javascript.inlayHints.parameterNames.enabled": {
            "type": "string",
            "enum": [
              "none",
              "literals",
              "all"
            ],
            "enumDescriptions": [
              "%inlayHints.parameterNames.none%",
              "%inlayHints.parameterNames.literals%",
              "%inlayHints.parameterNames.all%"
            ],
            "default": "none",
            "markdownDescription": "%configuration.inlayHints.parameterNames.enabled%",
            "scope": "resource"
          },
          "javascript.inlayHints.parameterNames.suppressWhenArgumentMatchesName": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "%configuration.inlayHints.parameterNames.suppressWhenArgumentMatchesName%",
            "scope": "resource"
          },
          "javascript.inlayHints.parameterTypes.enabled": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "%configuration.inlayHints.parameterTypes.enabled%",
            "scope": "resource"
          },
          "javascript.inlayHints.variableTypes.enabled": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "%configuration.inlayHints.variableTypes.enabled%",
            "scope": "resource"
          },
          "javascript.inlayHints.variableTypes.suppressWhenTypeMatchesName": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "%configuration.inlayHints.variableTypes.suppressWhenTypeMatchesName%",
            "scope": "resource"
          },
          "javascript.inlayHints.propertyDeclarationTypes.enabled": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "%configuration.inlayHints.propertyDeclarationTypes.enabled%",
            "scope": "resource"
          },
          "javascript.inlayHints.functionLikeReturnTypes.enabled": {
            "type": "boolean",
            "default": false,
            "markdownDescription": "%configuration.inlayHints.functionLikeReturnTypes.enabled%",
            "scope": "resource"
          }
        }
      },
      {
        "type": "object",
        "title": "%configuration.server%",
        "order": 25,
        "properties": {
          "typescript.tsserver.nodePath": {
            "type": "string",
            "description": "%configuration.tsserver.nodePath%",
            "scope": "window"
          },
          "typescript.npm": {
            "type": "string",
            "markdownDescription": "%typescript.npm%",
            "scope": "machine"
          },
          "typescript.check.npmIsInstalled": {
            "type": "boolean",
            "default": true,
            "markdownDescription": "%typescript.check.npmIsInstalled%",
            "scope": "window"
          },
          "typescript.tsserver.web.projectWideIntellisense.enabled": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.tsserver.web.projectWideIntellisense.enabled%",
            "scope": "window"
          },
          "typescript.tsserver.web.projectWideIntellisense.suppressSemanticErrors": {
            "type": "boolean",
            "default": false,
            "description": "%configuration.tsserver.web.projectWideIntellisense.suppressSemanticErrors%",
            "scope": "window"
          },
          "typescript.tsserver.web.typeAcquisition.enabled": {
            "type": "boolean",
            "default": true,
            "description": "%configuration.tsserver.web.typeAcquisition.enabled%",
            "scope": "window"
          },
          "typescript.tsserver.useSyntaxServer": {
            "type": "string",
            "scope": "window",
            "description": "%configuration.tsserver.useSyntaxServer%",
            "default": "auto",
            "enum": [
              "always",
              "never",
              "auto"
            ],
            "enumDescriptions": [
              "%configuration.tsserver.useSyntaxServer.always%",
              "%configuration.tsserver.useSyntaxServer.never%",
              "%configuration.tsserver.useSyntaxServer.auto%"
            ]
          },
          "typescript.tsserver.maxTsServerMemory": {
            "type": "number",
            "default": 3072,
            "markdownDescription": "%configuration.tsserver.maxTsServerMemory%",
            "scope": "window"
          },
          "typescript.tsserver.experimental.enableProjectDiagnostics": {
            "type": "boolean",
            "default": false,
            "description": "%configuration.tsserver.experimental.enableProjectDiagnostics%",
            "scope": "window",
            "tags": [
              "experimental"
            ]
          },
          "typescript.tsserver.watchOptions": {
            "description": "%configuration.tsserver.watchOptions%",
            "scope": "window",
            "default": "vscode",
            "oneOf": [
              {
                "type": "string",
                "const": "vscode",
                "description": "%configuration.tsserver.watchOptions.vscode%"
              },
              {
                "type": "object",
                "properties": {
                  "watchFile": {
                    "type": "string",
                    "description": "%configuration.tsserver.watchOptions.watchFile%",
                    "enum": [
                      "fixedChunkSizePolling",
                      "fixedPollingInterval",
                      "priorityPollingInterval",
                      "dynamicPriorityPolling",
                      "useFsEvents",
                      "useFsEventsOnParentDirectory"
                    ],
                    "enumDescriptions": [
                      "%configuration.tsserver.watchOptions.watchFile.fixedChunkSizePolling%",
                      "%configuration.tsserver.watchOptions.watchFile.fixedPollingInterval%",
                      "%configuration.tsserver.watchOptions.watchFile.priorityPollingInterval%",
                      "%configuration.tsserver.watchOptions.watchFile.dynamicPriorityPolling%",
                      "%configuration.tsserver.watchOptions.watchFile.useFsEvents%",
                      "%configuration.tsserver.watchOptions.watchFile.useFsEventsOnParentDirectory%"
                    ],
                    "default": "useFsEvents"
                  },
                  "watchDirectory": {
                    "type": "string",
                    "description": "%configuration.tsserver.watchOptions.watchDirectory%",
                    "enum": [
                      "fixedChunkSizePolling",
                      "fixedPollingInterval",
                      "dynamicPriorityPolling",
                      "useFsEvents"
                    ],
                    "enumDescriptions": [
                      "%configuration.tsserver.watchOptions.watchDirectory.fixedChunkSizePolling%",
                      "%configuration.tsserver.watchOptions.watchDirectory.fixedPollingInterval%",
                      "%configuration.tsserver.watchOptions.watchDirectory.dynamicPriorityPolling%",
                      "%configuration.tsserver.watchOptions.watchDirectory.useFsEvents%"
                    ],
                    "default": "useFsEvents"
                  },
                  "fallbackPolling": {
                    "type": "string",
                    "description": "%configuration.tsserver.watchOptions.fallbackPolling%",
                    "enum": [
                      "fixedPollingInterval",
                      "priorityPollingInterval",
                      "dynamicPriorityPolling"
                    ],
                    "enumDescriptions": [
                      "configuration.tsserver.watchOptions.fallbackPolling.fixedPollingInterval",
                      "configuration.tsserver.watchOptions.fallbackPolling.priorityPollingInterval",
                      "configuration.tsserver.watchOptions.fallbackPolling.dynamicPriorityPolling"
                    ]
                  },
                  "synchronousWatchDirectory": {
                    "type": "boolean",
                    "description": "%configuration.tsserver.watchOptions.synchronousWatchDirectory%"
                  }
                }
              }
            ]
          },
          "typescript.tsserver.enableTracing": {
            "type": "boolean",
            "default": false,
            "description": "%typescript.tsserver.enableTracing%",
            "scope": "window"
          },
          "typescript.tsserver.log": {
            "type": "string",
            "enum": [
              "off",
              "terse",
              "normal",
              "verbose",
              "requestTime"
            ],
            "default": "off",
            "description": "%typescript.tsserver.log%",
            "scope": "window"
          },
          "typescript.tsserver.pluginPaths": {
            "type": "array",
            "items": {
              "type": "string",
              "description": "%typescript.tsserver.pluginPaths.item%"
            },
            "default": [],
            "description": "%typescript.tsserver.pluginPaths%",
            "scope": "machine"
          }
        }
      }
    ],
    "commands": [
      {
        "command": "typescript.reloadProjects",
        "title": "%reloadProjects.title%",
        "category": "TypeScript"
      },
      {
        "command": "javascript.reloadProjects",
        "title": "%reloadProjects.title%",
        "category": "JavaScript"
      },
      {
        "command": "typescript.selectTypeScriptVersion",
        "title": "%typescript.selectTypeScriptVersion.title%",
        "category": "TypeScript"
      },
      {
        "command": "typescript.goToProjectConfig",
        "title": "%typescript.goToProjectConfig.title%",
        "category": "TypeScript"
      },
      {
        "command": "javascript.goToProjectConfig",
        "title": "%javascript.goToProjectConfig.title%",
        "category": "JavaScript"
      },
      {
        "command": "typescript.openTsServerLog",
        "title": "%typescript.openTsServerLog.title%",
        "category": "TypeScript"
      },
      {
        "command": "typescript.restartTsServer",
        "title": "%typescript.restartTsServer%",
        "category": "TypeScript"
      },
      {
        "command": "typescript.findAllFileReferences",
        "title": "%typescript.findAllFileReferences%",
        "category": "TypeScript"
      },
      {
        "command": "typescript.goToSourceDefinition",
        "title": "%typescript.goToSourceDefinition%",
        "category": "TypeScript"
      },
      {
        "command": "typescript.sortImports",
        "title": "%typescript.sortImports%",
        "category": "TypeScript"
      },
      {
        "command": "javascript.sortImports",
        "title": "%typescript.sortImports%",
        "category": "JavaScript"
      },
      {
        "command": "typescript.removeUnusedImports",
        "title": "%typescript.removeUnusedImports%",
        "category": "TypeScript"
      },
      {
        "command": "javascript.removeUnusedImports",
        "title": "%typescript.removeUnusedImports%",
        "category": "JavaScript"
      },
      {
        "command": "typescript.experimental.enableTsgo",
        "title": "Use TypeScript Go (Experimental)",
        "category": "TypeScript",
        "enablement": "!config.typescript.experimental.useTsgo && config.typescript-go.executablePath"
      },
      {
        "command": "typescript.experimental.disableTsgo",
        "title": "Stop using TypeScript Go (Experimental)",
        "category": "TypeScript",
        "enablement": "config.typescript.experimental.useTsgo"
      }
    ],
    "menus": {
      "commandPalette": [
        {
          "command": "typescript.reloadProjects",
          "when": "editorLangId == typescript && typescript.isManagedFile"
        },
        {
          "command": "typescript.reloadProjects",
          "when": "editorLangId == typescriptreact && typescript.isManagedFile"
        },
        {
          "command": "javascript.reloadProjects",
          "when": "editorLangId == javascript && typescript.isManagedFile"
        },
        {
          "command": "javascript.reloadProjects",
          "when": "editorLangId == javascriptreact && typescript.isManagedFile"
        },
        {
          "command": "typescript.goToProjectConfig",
          "when": "editorLangId == typescript && typescript.isManagedFile"
        },
        {
          "command": "typescript.goToProjectConfig",
          "when": "editorLangId == typescriptreact && typescript.isManagedFile"
        },
        {
          "command": "javascript.goToProjectConfig",
          "when": "editorLangId == javascript && typescript.isManagedFile"
        },
        {
          "command": "javascript.goToProjectConfig",
          "when": "editorLangId == javascriptreact && typescript.isManagedFile"
        },
        {
          "command": "typescript.selectTypeScriptVersion",
          "when": "typescript.isManagedFile"
        },
        {
          "command": "typescript.openTsServerLog",
          "when": "typescript.isManagedFile"
        },
        {
          "command": "typescript.restartTsServer",
          "when": "typescript.isManagedFile"
        },
        {
          "command": "typescript.findAllFileReferences",
          "when": "tsSupportsFileReferences && typescript.isManagedFile"
        },
        {
          "command": "typescript.goToSourceDefinition",
          "when": "tsSupportsSourceDefinition && typescript.isManagedFile"
        },
        {
          "command": "typescript.sortImports",
          "when": "supportedCodeAction =~ /(\\s|^)source\\.sortImports\\b/ && editorLangId =~ /^typescript(react)?$/"
        },
        {
          "command": "javascript.sortImports",
          "when": "supportedCodeAction =~ /(\\s|^)source\\.sortImports\\b/ && editorLangId =~ /^javascript(react)?$/"
        },
        {
          "command": "typescript.removeUnusedImports",
          "when": "supportedCodeAction =~ /(\\s|^)source\\.removeUnusedImports\\b/ && editorLangId =~ /^typescript(react)?$/"
        },
        {
          "command": "javascript.removeUnusedImports",
          "when": "supportedCodeAction =~ /(\\s|^)source\\.removeUnusedImports\\b/ && editorLangId =~ /^javascript(react)?$/"
        }
      ],
      "editor/context": [
        {
          "command": "typescript.goToSourceDefinition",
          "when": "!config.typescript.experimental.useTsgo && tsSupportsSourceDefinition && (resourceLangId == typescript || resourceLangId == typescriptreact || resourceLangId == javascript || resourceLangId == javascriptreact)",
          "group": "navigation@1.41"
        }
      ],
      "explorer/context": [
        {
          "command": "typescript.findAllFileReferences",
          "when": "tsSupportsFileReferences && resourceLangId == typescript",
          "group": "4_search"
        },
        {
          "command": "typescript.findAllFileReferences",
          "when": "tsSupportsFileReferences && resourceLangId == typescriptreact",
          "group": "4_search"
        },
        {
          "command": "typescript.findAllFileReferences",
          "when": "tsSupportsFileReferences && resourceLangId == javascript",
          "group": "4_search"
        },
        {
          "command": "typescript.findAllFileReferences",
          "when": "tsSupportsFileReferences && resourceLangId == javascriptreact",
          "group": "4_search"
        }
      ],
      "editor/title/context": [
        {
          "command": "typescript.findAllFileReferences",
          "when": "tsSupportsFileReferences && resourceLangId == javascript"
        },
        {
          "command": "typescript.findAllFileReferences",
          "when": "tsSupportsFileReferences && resourceLangId == javascriptreact"
        },
        {
          "command": "typescript.findAllFileReferences",
          "when": "tsSupportsFileReferences && resourceLangId == typescript"
        },
        {
          "command": "typescript.findAllFileReferences",
          "when": "tsSupportsFileReferences && resourceLangId == typescriptreact"
        }
      ]
    },
    "breakpoints": [
      {
        "language": "typescript"
      },
      {
        "language": "typescriptreact"
      }
    ],
    "taskDefinitions": [
      {
        "type": "typescript",
        "required": [
          "tsconfig"
        ],
        "properties": {
          "tsconfig": {
            "type": "string",
            "description": "%taskDefinition.tsconfig.description%"
          },
          "option": {
            "type": "string"
          }
        },
        "when": "shellExecutionSupported"
      }
    ],
    "problemPatterns": [
      {
        "name": "tsc",
        "regexp": "^([^\\s].*)[\\(:](\\d+)[,:](\\d+)(?:\\):\\s+|\\s+-\\s+)(error|warning|info)\\s+TS(\\d+)\\s*:\\s*(.*)$",
        "file": 1,
        "line": 2,
        "column": 3,
        "severity": 4,
        "code": 5,
        "message": 6
      }
    ],
    "problemMatchers": [
      {
        "name": "tsc",
        "label": "%typescript.problemMatchers.tsc.label%",
        "owner": "typescript",
        "source": "ts",
        "applyTo": "closedDocuments",
        "fileLocation": [
          "relative",
          "${cwd}"
        ],
        "pattern": "$tsc"
      },
      {
        "name": "tsgo-watch",
        "label": "%typescript.problemMatchers.tsgo-watch.label%",
        "owner": "typescript",
        "source": "ts",
        "applyTo": "closedDocuments",
        "fileLocation": [
          "relative",
          "${cwd}"
        ],
        "pattern": "$tsc",
        "background": {
          "activeOnStart": true,
          "beginsPattern": {
            "regexp": "^build starting at .*$"
          },
          "endsPattern": {
            "regexp": "^build finished in .*$"
          }
        }
      },
      {
        "name": "tsc-watch",
        "label": "%typescript.problemMatchers.tscWatch.label%",
        "owner": "typescript",
        "source": "ts",
        "applyTo": "closedDocuments",
        "fileLocation": [
          "relative",
          "${cwd}"
        ],
        "pattern": "$tsc",
        "background": {
          "activeOnStart": true,
          "beginsPattern": {
            "regexp": "^\\s*(?:message TS6032:|\\[?\\D*.{1,2}[:.].{1,2}[:.].{1,2}\\D*(├\\D*\\d{1,2}\\D+┤)?(?:\\]| -)) (Starting compilation in watch mode|File change detected\\. Starting incremental compilation)\\.\\.\\."
          },
          "endsPattern": {
            "regexp": "^\\s*(?:message TS6042:|\\[?\\D*.{1,2}[:.].{1,2}[:.].{1,2}\\D*(├\\D*\\d{1,2}\\D+┤)?(?:\\]| -)) (?:Compilation complete\\.|Found \\d+ errors?\\.) Watching for file changes\\."
          }
        }
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

---[FILE: extensions/typescript-language-features/package.nls.json]---
Location: vscode-main/extensions/typescript-language-features/package.nls.json

```json
{
	"displayName": "TypeScript and JavaScript Language Features",
	"description": "Provides rich language support for JavaScript and TypeScript.",
	"workspaceTrust": "The extension requires workspace trust when the workspace version is used because it executes code specified by the workspace.",
	"virtualWorkspaces": "In virtual workspaces, resolving and finding references across files is not supported.",
	"reloadProjects.title": "Reload Project",
	"configuration.typescript": "TypeScript",
	"configuration.preferences": "Preferences",
	"configuration.format": "Formatting",
	"configuration.suggest": "Suggestions",
	"configuration.inlayHints": "Inlay Hints",
	"configuration.server": "TS Server",
	"configuration.suggest.completeFunctionCalls": "Complete functions with their parameter signature.",
	"configuration.suggest.includeAutomaticOptionalChainCompletions": "Enable/disable showing completions on potentially undefined values that insert an optional chain call. Requires strict null checks to be enabled.",
	"configuration.suggest.includeCompletionsForImportStatements": "Enable/disable auto-import-style completions on partially-typed import statements.",
	"typescript.useTsgo": "Disables TypeScript and JavaScript language features to allow usage of the TypeScript Go experimental extension. Requires TypeScript Go to be installed and configured. Requires reloading extensions after changing this setting.",
	"typescript.tsdk.desc": "Specifies the folder path to the tsserver and `lib*.d.ts` files under a TypeScript install to use for IntelliSense, for example: `./node_modules/typescript/lib`.\n\n- When specified as a user setting, the TypeScript version from `typescript.tsdk` automatically replaces the built-in TypeScript version.\n- When specified as a workspace setting, `typescript.tsdk` allows you to switch to use that workspace version of TypeScript for IntelliSense with the `TypeScript: Select TypeScript version` command.\n\nSee the [TypeScript documentation](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-newer-typescript-versions) for more detail about managing TypeScript versions.",
	"typescript.disableAutomaticTypeAcquisition": "Disables [automatic type acquisition](https://code.visualstudio.com/docs/nodejs/working-with-javascript#_typings-and-automatic-type-acquisition). Automatic type acquisition fetches `@types` packages from npm to improve IntelliSense for external libraries.",
	"typescript.enablePromptUseWorkspaceTsdk": "Enables prompting of users to use the TypeScript version configured in the workspace for Intellisense.",
	"typescript.tsserver.enableTracing": "Enables tracing TS server performance to a directory. These trace files can be used to diagnose TS Server performance issues. The log may contain file paths, source code, and other potentially sensitive information from your project.",
	"typescript.tsserver.log": "Enables logging of the TS server to a file. This log can be used to diagnose TS Server issues. The log may contain file paths, source code, and other potentially sensitive information from your project.",
	"typescript.tsserver.pluginPaths": "Additional paths to discover TypeScript Language Service plugins.",
	"typescript.tsserver.pluginPaths.item": "Either an absolute or relative path. Relative path will be resolved against workspace folder(s).",
	"typescript.tsserver.trace": "Enables tracing of messages sent to the TS server. This trace can be used to diagnose TS Server issues. The trace may contain file paths, source code, and other potentially sensitive information from your project.",
	"typescript.tsserver.enableRegionDiagnostics": "Enables region-based diagnostics in TypeScript. Requires using TypeScript 5.6+ in the workspace.",
	"typescript.validate.enable": "Enable/disable TypeScript validation.",
	"typescript.format.enable": "Enable/disable default TypeScript formatter.",
	"javascript.format.enable": "Enable/disable default JavaScript formatter.",
	"format.insertSpaceAfterCommaDelimiter": "Defines space handling after a comma delimiter.",
	"format.insertSpaceAfterConstructor": "Defines space handling after the constructor keyword.",
	"format.insertSpaceAfterSemicolonInForStatements": "Defines space handling after a semicolon in a for statement.",
	"format.insertSpaceBeforeAndAfterBinaryOperators": "Defines space handling after a binary operator.",
	"format.insertSpaceAfterKeywordsInControlFlowStatements": "Defines space handling after keywords in a control flow statement.",
	"format.insertSpaceAfterFunctionKeywordForAnonymousFunctions": "Defines space handling after function keyword for anonymous functions.",
	"format.insertSpaceBeforeFunctionParenthesis": "Defines space handling before function argument parentheses.",
	"format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis": "Defines space handling after opening and before closing non-empty parenthesis.",
	"format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets": "Defines space handling after opening and before closing non-empty brackets.",
	"format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces": "Defines space handling after opening and before closing non-empty braces.",
	"format.insertSpaceAfterOpeningAndBeforeClosingEmptyBraces": "Defines space handling after opening and before closing empty braces.",
	"format.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces": "Defines space handling after opening and before closing template string braces.",
	"format.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces": "Defines space handling after opening and before closing JSX expression braces.",
	"format.insertSpaceAfterTypeAssertion": "Defines space handling after type assertions in TypeScript.",
	"format.placeOpenBraceOnNewLineForFunctions": "Defines whether an open brace is put onto a new line for functions or not.",
	"format.placeOpenBraceOnNewLineForControlBlocks": "Defines whether an open brace is put onto a new line for control blocks or not.",
	"format.semicolons": "Defines handling of optional semicolons.",
	"format.semicolons.ignore": "Don't insert or remove any semicolons.",
	"format.semicolons.insert": "Insert semicolons at statement ends.",
	"format.semicolons.remove": "Remove unnecessary semicolons.",
	"format.indentSwitchCase": "Indent case clauses in switch statements. Requires using TypeScript 5.1+ in the workspace.",
	"javascript.validate.enable": "Enable/disable JavaScript validation.",
	"javascript.goToProjectConfig.title": "Go to Project Configuration (jsconfig / tsconfig)",
	"typescript.goToProjectConfig.title": "Go to Project Configuration (tsconfig)",
	"javascript.referencesCodeLens.enabled": "Enable/disable references CodeLens in JavaScript files.",
	"javascript.referencesCodeLens.showOnAllFunctions": "Enable/disable references CodeLens on all functions in JavaScript files.",
	"typescript.referencesCodeLens.enabled": "Enable/disable references CodeLens in TypeScript files.",
	"typescript.referencesCodeLens.showOnAllFunctions": "Enable/disable references CodeLens on all functions in TypeScript files.",
	"typescript.implementationsCodeLens.enabled": "Enable/disable implementations CodeLens. This CodeLens shows the implementers of an interface.",
	"typescript.implementationsCodeLens.showOnInterfaceMethods": "Enable/disable implementations CodeLens on interface methods.",
	"typescript.implementationsCodeLens.showOnAllClassMethods": "Enable/disable showing implementations CodeLens above all class methods instead of only on abstract methods.",
	"typescript.openTsServerLog.title": "Open TS Server log",
	"typescript.restartTsServer": "Restart TS Server",
	"typescript.selectTypeScriptVersion.title": "Select TypeScript Version...",
	"typescript.reportStyleChecksAsWarnings": "Report style checks as warnings.",
	"typescript.npm": "Specifies the path to the npm executable used for [Automatic Type Acquisition](https://code.visualstudio.com/docs/nodejs/working-with-javascript#_typings-and-automatic-type-acquisition).",
	"typescript.check.npmIsInstalled": "Check if npm is installed for [Automatic Type Acquisition](https://code.visualstudio.com/docs/nodejs/working-with-javascript#_typings-and-automatic-type-acquisition).",
	"configuration.suggest.names": "Enable/disable including unique names from the file in JavaScript suggestions. Note that name suggestions are always disabled in JavaScript code that is semantically checked using `@ts-check` or `checkJs`.",
	"typescript.tsc.autoDetect": "Controls auto detection of tsc tasks.",
	"typescript.tsc.autoDetect.off": "Disable this feature.",
	"typescript.tsc.autoDetect.on": "Create both build and watch tasks.",
	"typescript.tsc.autoDetect.build": "Only create single run compile tasks.",
	"typescript.tsc.autoDetect.watch": "Only create compile and watch tasks.",
	"typescript.problemMatchers.tsc.label": "TypeScript problems",
	"typescript.problemMatchers.tsgo-watch.label": "TypeScript problems (watch mode)",
	"typescript.problemMatchers.tscWatch.label": "TypeScript problems (watch mode)",
	"configuration.suggest.paths": "Enable/disable suggestions for paths in import statements and require calls.",
	"configuration.tsserver.useSeparateSyntaxServer": "Enable/disable spawning a separate TypeScript server that can more quickly respond to syntax related operations, such as calculating folding or computing document symbols.",
	"configuration.tsserver.useSyntaxServer": "Controls if TypeScript launches a dedicated server to more quickly handle syntax related operations, such as computing code folding.",
	"configuration.tsserver.useSyntaxServer.always": "Use a lighter weight syntax server to handle all IntelliSense operations. This syntax server can only provide IntelliSense for opened files.",
	"configuration.tsserver.useSyntaxServer.never": "Don't use a dedicated syntax server. Use a single server to handle all IntelliSense operations.",
	"configuration.tsserver.useSyntaxServer.auto": "Spawn both a full server and a lighter weight server dedicated to syntax operations. The syntax server is used to speed up syntax operations and provide IntelliSense while projects are loading.",
	"configuration.tsserver.maxTsServerMemory": "The maximum amount of memory (in MB) to allocate to the TypeScript server process. To use a memory limit greater than 4 GB, use `#typescript.tsserver.nodePath#` to run TS Server with a custom Node installation.",
	"configuration.tsserver.experimental.enableProjectDiagnostics": "Enables project wide error reporting.",
	"typescript.locale": "Sets the locale used to report JavaScript and TypeScript errors. Defaults to use VS Code's locale.",
	"typescript.locale.auto": "Use VS Code's configured display language.",
	"configuration.implicitProjectConfig.module": "Sets the module system for the program. See more: https://www.typescriptlang.org/tsconfig#module.",
	"configuration.implicitProjectConfig.target": "Set target JavaScript language version for emitted JavaScript and include library declarations. See more: https://www.typescriptlang.org/tsconfig#target.",
	"configuration.implicitProjectConfig.checkJs": "Enable/disable semantic checking of JavaScript files. Existing `jsconfig.json` or `tsconfig.json` files override this setting.",
	"configuration.implicitProjectConfig.experimentalDecorators": "Enable/disable `experimentalDecorators` in JavaScript files that are not part of a project. Existing `jsconfig.json` or `tsconfig.json` files override this setting.",
	"configuration.implicitProjectConfig.strictNullChecks": "Enable/disable [strict null checks](https://www.typescriptlang.org/tsconfig#strictNullChecks) in JavaScript and TypeScript files that are not part of a project. Existing `jsconfig.json` or `tsconfig.json` files override this setting.",
	"configuration.implicitProjectConfig.strictFunctionTypes": "Enable/disable [strict function types](https://www.typescriptlang.org/tsconfig#strictFunctionTypes) in JavaScript and TypeScript files that are not part of a project. Existing `jsconfig.json` or `tsconfig.json` files override this setting.",
	"configuration.implicitProjectConfig.strict": "Enable/disable [strict mode](https://www.typescriptlang.org/tsconfig#strict) in JavaScript and TypeScript files that are not part of a project. Existing `jsconfig.json` or `tsconfig.json` files override this setting.",
	"configuration.suggest.jsdoc.generateReturns": "Enable/disable generating `@returns` annotations for JSDoc templates.",
	"configuration.suggest.autoImports": "Enable/disable auto import suggestions.",
	"configuration.preferGoToSourceDefinition": "Makes `Go to Definition` avoid type declaration files when possible by triggering `Go to Source Definition` instead. This allows `Go to Source Definition` to be triggered with the mouse gesture.",
	"inlayHints.parameterNames.none": "Disable parameter name hints.",
	"inlayHints.parameterNames.literals": "Enable parameter name hints only for literal arguments.",
	"inlayHints.parameterNames.all": "Enable parameter name hints for literal and non-literal arguments.",
	"configuration.inlayHints.parameterNames.enabled": {
		"message": "Enable/disable inlay hints for parameter names:\n```typescript\n\nparseInt(/* str: */ '123', /* radix: */ 8)\n \n```",
		"comment": [
			"The text inside the ``` block is code and should not be localized."
		]
	},
	"configuration.inlayHints.parameterNames.suppressWhenArgumentMatchesName": "Suppress parameter name hints on arguments whose text is identical to the parameter name.",
	"configuration.inlayHints.parameterTypes.enabled": {
		"message": "Enable/disable inlay hints for implicit parameter types:\n```typescript\n\nel.addEventListener('click', e /* :MouseEvent */ => ...)\n \n```",
		"comment": [
			"The text inside the ``` block is code and should not be localized."
		]
	},
	"configuration.inlayHints.variableTypes.enabled": {
		"message": "Enable/disable inlay hints for implicit variable types:\n```typescript\n\nconst foo /* :number */ = Date.now();\n \n```",
		"comment": [
			"The text inside the ``` block is code and should not be localized."
		]
	},
	"configuration.inlayHints.variableTypes.suppressWhenTypeMatchesName": "Suppress type hints on variables whose name is identical to the type name.",
	"configuration.inlayHints.propertyDeclarationTypes.enabled": {
		"message": "Enable/disable inlay hints for implicit types on property declarations:\n```typescript\n\nclass Foo {\n\tprop /* :number */ = Date.now();\n}\n \n```",
		"comment": [
			"The text inside the ``` block is code and should not be localized."
		]
	},
	"configuration.inlayHints.functionLikeReturnTypes.enabled": {
		"message": "Enable/disable inlay hints for implicit return types on function signatures:\n```typescript\n\nfunction foo() /* :number */ {\n\treturn Date.now();\n} \n \n```",
		"comment": [
			"The text inside the ``` block is code and should not be localized."
		]
	},
	"configuration.inlayHints.enumMemberValues.enabled": {
		"message": "Enable/disable inlay hints for member values in enum declarations:\n```typescript\n\nenum MyValue {\n\tA /* = 0 */;\n\tB /* = 1 */;\n}\n \n```",
		"comment": [
			"The text inside the ``` block is code and should not be localized."
		]
	},
	"taskDefinition.tsconfig.description": "The tsconfig file that defines the TS build.",
	"javascript.suggestionActions.enabled": "Enable/disable suggestion diagnostics for JavaScript files in the editor.",
	"typescript.suggestionActions.enabled": "Enable/disable suggestion diagnostics for TypeScript files in the editor.",
	"typescript.preferences.quoteStyle": "Preferred quote style to use for Quick Fixes.",
	"typescript.preferences.quoteStyle.single": "Always use single quotes: `'`",
	"typescript.preferences.quoteStyle.double": "Always use double quotes: `\"`",
	"typescript.preferences.quoteStyle.auto": "Infer quote type from existing code",
	"typescript.preferences.importModuleSpecifier": "Preferred path style for auto imports.",
	"typescript.preferences.importModuleSpecifier.shortest": "Prefers a non-relative import only if one is available that has fewer path segments than a relative import.",
	"typescript.preferences.importModuleSpecifier.relative": "Prefers a relative path to the imported file location.",
	"typescript.preferences.importModuleSpecifier.nonRelative": "Prefers a non-relative import based on the `baseUrl` or `paths` configured in your `jsconfig.json` / `tsconfig.json`.",
	"typescript.preferences.importModuleSpecifier.projectRelative": "Prefers a non-relative import only if the relative import path would leave the package or project directory.",
	"typescript.preferences.importModuleSpecifierEnding": "Preferred path ending for auto imports.",
	"typescript.preferences.importModuleSpecifierEnding.label.js": ".js / .ts",
	"typescript.preferences.importModuleSpecifierEnding.auto": "Use project settings to select a default.",
	"typescript.preferences.importModuleSpecifierEnding.minimal": "Shorten `./component/index.js` to `./component`.",
	"typescript.preferences.importModuleSpecifierEnding.index": "Shorten `./component/index.js` to `./component/index`.",
	"typescript.preferences.importModuleSpecifierEnding.js": "Do not shorten path endings; include the `.js` or `.ts` extension.",
	"typescript.preferences.jsxAttributeCompletionStyle": "Preferred style for JSX attribute completions.",
	"javascript.preferences.jsxAttributeCompletionStyle.auto": "Insert `={}` or `=\"\"` after attribute names based on the prop type. See `#javascript.preferences.quoteStyle#` to control the type of quotes used for string attributes.",
	"typescript.preferences.jsxAttributeCompletionStyle.auto": "Insert `={}` or `=\"\"` after attribute names based on the prop type. See `#typescript.preferences.quoteStyle#` to control the type of quotes used for string attributes.",
	"typescript.preferences.jsxAttributeCompletionStyle.braces": "Insert `={}` after attribute names.",
	"typescript.preferences.jsxAttributeCompletionStyle.none": "Only insert attribute names.",
	"typescript.preferences.includePackageJsonAutoImports": "Enable/disable searching `package.json` dependencies for available auto imports.",
	"typescript.preferences.includePackageJsonAutoImports.auto": "Search dependencies based on estimated performance impact.",
	"typescript.preferences.includePackageJsonAutoImports.on": "Always search dependencies.",
	"typescript.preferences.includePackageJsonAutoImports.off": "Never search dependencies.",
	"typescript.preferences.autoImportFileExcludePatterns": "Specify glob patterns of files to exclude from auto imports. Relative paths are resolved relative to the workspace root. Patterns are evaluated using tsconfig.json [`exclude`](https://www.typescriptlang.org/tsconfig#exclude) semantics.",
	"typescript.preferences.autoImportSpecifierExcludeRegexes": "Specify regular expressions to exclude auto imports with matching import specifiers. Examples:\n\n- `^node:`\n- `lib/internal` (slashes don't need to be escaped...)\n- `/lib\\/internal/i` (...unless including surrounding slashes for `i` or `u` flags)\n- `^lodash$` (only allow subpath imports from lodash)",
	"typescript.preferences.preferTypeOnlyAutoImports": "Include the `type` keyword in auto-imports whenever possible. Requires using TypeScript 5.3+ in the workspace.",
	"typescript.workspaceSymbols.excludeLibrarySymbols": "Exclude symbols that come from library files in `Go to Symbol in Workspace` results. Requires using TypeScript 5.3+ in the workspace.",
	"typescript.updateImportsOnFileMove.enabled": "Enable/disable automatic updating of import paths when you rename or move a file in VS Code.",
	"typescript.updateImportsOnFileMove.enabled.prompt": "Prompt on each rename.",
	"typescript.updateImportsOnFileMove.enabled.always": "Always update paths automatically.",
	"typescript.updateImportsOnFileMove.enabled.never": "Never rename paths and don't prompt.",
	"typescript.autoClosingTags": "Enable/disable automatic closing of JSX tags.",
	"typescript.suggest.enabled": "Enable/disable autocomplete suggestions.",
	"configuration.suggest.completeJSDocs": "Enable/disable suggestion to complete JSDoc comments.",
	"configuration.tsserver.useVsCodeWatcher": "Use VS Code's file watchers instead of TypeScript's. Requires using TypeScript 5.4+ in the workspace.",
	"configuration.tsserver.watchOptions": "Configure which watching strategies should be used to keep track of files and directories.",
	"configuration.tsserver.watchOptions.vscode": "Use VS Code's file watchers instead of TypeScript's. Requires using TypeScript 5.4+ in the workspace.",
	"configuration.tsserver.watchOptions.watchFile": "Strategy for how individual files are watched.",
	"configuration.tsserver.watchOptions.watchFile.fixedChunkSizePolling": "Polls files in chunks at regular interval.",
	"configuration.tsserver.watchOptions.watchFile.fixedPollingInterval": "Check every file for changes several times a second at a fixed interval.",
	"configuration.tsserver.watchOptions.watchFile.priorityPollingInterval": "Check every file for changes several times a second, but use heuristics to check certain types of files less frequently than others.",
	"configuration.tsserver.watchOptions.watchFile.dynamicPriorityPolling": "Use a dynamic queue where less-frequently modified files will be checked less often.",
	"configuration.tsserver.watchOptions.watchFile.useFsEvents": "Attempt to use the operating system/file system's native events for file changes.",
	"configuration.tsserver.watchOptions.watchFile.useFsEventsOnParentDirectory": "Attempt to use the operating system/file system's native events to listen for changes on a file's containing directories. This can use fewer file watchers, but might be less accurate.",
	"configuration.tsserver.watchOptions.watchDirectory": "Strategy for how entire directory trees are watched under systems that lack recursive file-watching functionality.",
	"configuration.tsserver.watchOptions.watchDirectory.fixedChunkSizePolling": "Polls directories in chunks at regular interval.",
	"configuration.tsserver.watchOptions.watchDirectory.fixedPollingInterval": "Check every directory for changes several times a second at a fixed interval.",
	"configuration.tsserver.watchOptions.watchDirectory.dynamicPriorityPolling": "Use a dynamic queue where less-frequently modified directories will be checked less often.",
	"configuration.tsserver.watchOptions.watchDirectory.useFsEvents": "Attempt to use the operating system/file system's native events for directory changes.",
	"configuration.tsserver.watchOptions.fallbackPolling": "When using file system events, this option specifies the polling strategy that gets used when the system runs out of native file watchers and/or doesn't support native file watchers.",
	"configuration.tsserver.watchOptions.fallbackPolling.fixedPollingInterval": "Check every file for changes several times a second at a fixed interval.",
	"configuration.tsserver.watchOptions.fallbackPolling.priorityPollingInterval": "Check every file for changes several times a second, but use heuristics to check certain types of files less frequently than others.",
	"configuration.tsserver.watchOptions.fallbackPolling.dynamicPriorityPolling ": "Use a dynamic queue where less-frequently modified files will be checked less often.",
	"configuration.tsserver.watchOptions.synchronousWatchDirectory": "Disable deferred watching on directories. Deferred watching is useful when lots of file changes might occur at once (e.g. a change in node_modules from running npm install), but you might want to disable it with this flag for some less-common setups.",
	"typescript.preferences.useAliasesForRenames": "Enable/disable introducing aliases for object shorthand properties during renames.",
	"typescript.preferences.renameMatchingJsxTags": "When on a JSX tag, try to rename the matching tag instead of renaming the symbol. Requires using TypeScript 5.1+ in the workspace.",
	"typescript.preferences.organizeImports": "Advanced preferences that control how imports are ordered.",
	"javascript.preferences.organizeImports": "Advanced preferences that control how imports are ordered.",
	"typescript.preferences.organizeImports.caseSensitivity": "Specifies how imports should be sorted with regards to case-sensitivity. If `auto` or unspecified, we will detect the case-sensitivity per file",
	"typescript.preferences.organizeImports.caseSensitivity.auto": "Detect case-sensitivity for import sorting.",
	"typescript.preferences.organizeImports.caseSensitivity.insensitive": "Sort imports case-insensitively.",
	"typescript.preferences.organizeImports.caseSensitivity.sensitive": "Sort imports case-sensitively.",
	"typescript.preferences.organizeImports.typeOrder": "Specify how type-only named imports should be sorted.",
	"typescript.preferences.organizeImports.typeOrder.auto": "Detect where type-only named imports should be sorted.",
	"typescript.preferences.organizeImports.typeOrder.last": "Type only named imports are sorted to the end of the import list. E.g. `import { B, Z, type A, type Y } from 'module';`",
	"typescript.preferences.organizeImports.typeOrder.inline": "Named imports are sorted by name only. E.g. `import { type A, B, type Y, Z } from 'module';`",
	"typescript.preferences.organizeImports.typeOrder.first": "Type only named imports are sorted to the beginning of the import list. E.g. `import { type A, type Y, B, Z } from 'module';`",
	"typescript.preferences.organizeImports.unicodeCollation": "Specify whether to sort imports using Unicode or Ordinal collation.",
	"typescript.preferences.organizeImports.unicodeCollation.ordinal": "Sort imports using the numeric value of each code point.",
	"typescript.preferences.organizeImports.unicodeCollation.unicode": "Sort imports using the Unicode code collation.",
	"typescript.preferences.organizeImports.locale": "Requires `organizeImports.unicodeCollation: 'unicode'`. Overrides the locale used for collation. Specify `auto` to use the UI locale.",
	"typescript.preferences.organizeImports.caseFirst": "Requires `organizeImports.unicodeCollation: 'unicode'`, and `organizeImports.caseSensitivity` is not `caseInsensitive`. Indicates whether upper-case will sort before lower-case.",
	"typescript.preferences.organizeImports.caseFirst.default": "Default order given by `locale`.",
	"typescript.preferences.organizeImports.caseFirst.lower": "Lower-case comes before upper-case. E.g.` a, A, z, Z`.",
	"typescript.preferences.organizeImports.caseFirst.upper": "Upper-case comes before lower-case. E.g. ` A, a, B, b`.",
	"typescript.preferences.organizeImports.numericCollation": "Requires `organizeImports.unicodeCollation: 'unicode'`. Sort numeric strings by integer value.",
	"typescript.preferences.organizeImports.accentCollation": "Requires `organizeImports.unicodeCollation: 'unicode'`. Compare characters with diacritical marks as unequal to base character.",
	"typescript.workspaceSymbols.scope": "Controls which files are searched by [Go to Symbol in Workspace](https://code.visualstudio.com/docs/editor/editingevolved#_open-symbol-by-name).",
	"typescript.workspaceSymbols.scope.allOpenProjects": "Search all open JavaScript or TypeScript projects for symbols.",
	"typescript.workspaceSymbols.scope.currentProject": "Only search for symbols in the current JavaScript or TypeScript project.",
	"typescript.sortImports": "Sort Imports",
	"typescript.removeUnusedImports": "Remove Unused Imports",
	"typescript.findAllFileReferences": "Find File References",
	"typescript.goToSourceDefinition": "Go to Source Definition",
	"configuration.suggest.classMemberSnippets.enabled": "Enable/disable snippet completions for class members.",
	"configuration.suggest.objectLiteralMethodSnippets.enabled": "Enable/disable snippet completions for methods in object literals.",
	"configuration.tsserver.web.projectWideIntellisense.enabled": "Enable/disable project-wide IntelliSense on web. Requires that VS Code is running in a trusted context.",
	"configuration.tsserver.web.projectWideIntellisense.suppressSemanticErrors": "Suppresses semantic errors on web even when project wide IntelliSense is enabled. This is always on when project wide IntelliSense is not enabled or available. See `#typescript.tsserver.web.projectWideIntellisense.enabled#`",
	"configuration.tsserver.web.typeAcquisition.enabled": "Enable/disable package acquisition on the web. This enables IntelliSense for imported packages. Requires `#typescript.tsserver.web.projectWideIntellisense.enabled#`. Currently not supported for Safari.",
	"configuration.tsserver.nodePath": "Run TS Server on a custom Node installation. This can be a path to a Node executable, or 'node' if you want VS Code to detect a Node installation.",
	"configuration.updateImportsOnPaste": "Automatically update imports when pasting code. Requires TypeScript 5.6+.",
	"configuration.hover.maximumLength": "The maximum number of characters in a hover. If the hover is longer than this, it will be truncated. Requires TypeScript 5.9+.",
	"walkthroughs.nodejsWelcome.title": "Get started with JavaScript and Node.js",
	"walkthroughs.nodejsWelcome.description": "Make the most of Visual Studio Code's first-class JavaScript experience.",
	"walkthroughs.nodejsWelcome.downloadNode.forMacOrWindows.title": "Install Node.js",
	"walkthroughs.nodejsWelcome.downloadNode.forMacOrWindows.description": "Node.js is an easy way to run JavaScript code. You can use it to quickly build command-line apps and servers. It also comes with npm, a package manager which makes reusing and sharing JavaScript code easy.\n[Install Node.js](https://nodejs.org/en/download/)",
	"walkthroughs.nodejsWelcome.downloadNode.forLinux.title": "Install Node.js",
	"walkthroughs.nodejsWelcome.downloadNode.forLinux.description": "Node.js is an easy way to run JavaScript code. You can use it to quickly build command-line apps and servers. It also comes with npm, a package manager which makes reusing and sharing JavaScript code easy.\n[Install Node.js](https://nodejs.org/en/download/package-manager/)",
	"walkthroughs.nodejsWelcome.makeJsFile.title": "Create a JavaScript File",
	"walkthroughs.nodejsWelcome.makeJsFile.description": "Let's write our first JavaScript file. We'll have to create a new file and save it with the ``.js`` extension at the end of the file name.\n[Create a JavaScript File](command:javascript-walkthrough.commands.createJsFile)",
	"walkthroughs.nodejsWelcome.debugJsFile.title": "Run and Debug your JavaScript",
	"walkthroughs.nodejsWelcome.debugJsFile.description": "Once you've installed Node.js, you can run JavaScript programs at a terminal by entering ``node your-file-name.js``\nAnother easy way to run Node.js programs is by using VS Code's debugger which lets you run your code, pause at different points, and help you understand what's going on step-by-step.\n[Start Debugging](command:javascript-walkthrough.commands.debugJsFile)",
	"walkthroughs.nodejsWelcome.debugJsFile.altText": "Debug and run your JavaScript code in Node.js with Visual Studio Code.",
	"walkthroughs.nodejsWelcome.learnMoreAboutJs.title": "Explore More",
	"walkthroughs.nodejsWelcome.learnMoreAboutJs.description": "Want to get more comfortable with JavaScript, Node.js, and VS Code? Be sure to check out our docs!\nWe've got lots of resources for learning [JavaScript](https://code.visualstudio.com/docs/nodejs/working-with-javascript) and [Node.js](https://code.visualstudio.com/docs/nodejs/nodejs-tutorial).\n\n[Learn More](https://code.visualstudio.com/docs/nodejs/nodejs-tutorial)",
	"walkthroughs.nodejsWelcome.learnMoreAboutJs.altText": "Learn more about JavaScript and Node.js in Visual Studio Code."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/README.md]---
Location: vscode-main/extensions/typescript-language-features/README.md

```markdown
# Language Features for TypeScript and JavaScript files

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

## Features

See [TypeScript in Visual Studio Code](https://code.visualstudio.com/docs/languages/typescript) and [JavaScript in Visual Studio Code](https://code.visualstudio.com/docs/languages/javascript) to learn about the features of this extension.
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/tsconfig.json]---
Location: vscode-main/extensions/typescript-language-features/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"typeRoots": [
			"./node_modules/@types"
		],
		"esModuleInterop": true,
		"types": [
			"node"
		]
	},
	"include": [
		"src/**/*",
		"../../src/vscode-dts/vscode.d.ts",
		"../../src/vscode-dts/vscode.proposed.codeActionAI.d.ts",
		"../../src/vscode-dts/vscode.proposed.codeActionRanges.d.ts",
		"../../src/vscode-dts/vscode.proposed.multiDocumentHighlightProvider.d.ts",
		"../../src/vscode-dts/vscode.proposed.workspaceTrust.d.ts",
		"../../src/vscode-dts/vscode.proposed.editorHoverVerbosityLevel.d.ts",
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/resources/walkthroughs/create-a-js-file.svg]---
Location: vscode-main/extensions/typescript-language-features/resources/walkthroughs/create-a-js-file.svg

```text
<svg width="524" height="158" viewBox="0 0 524 158" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g>
    <g>
      <rect width="474" height="35" transform="translate(25.6238)" fill="var(--vscode-editorGroupHeader-tabsBackground, #292929)" />
      <g clip-path="url(#clip0_1720_12451)">
        <g>
          <rect width="123" height="35" transform="translate(25.6238)" fill="var(--vscode-tab-activeBackground, #252526)" />
          <g>
            <path d="M42.7438 13.74H44.4438V18.5C44.4438 19.5267 44.2038 20.2733 43.7238 20.74C43.2838 21.1667 42.6238 21.38 41.7438 21.38C41.5438 21.38 41.3238 21.3667 41.0838 21.34C40.8438 21.3 40.6504 21.2467 40.5038 21.18L40.6838 19.82C40.9371 19.94 41.2304 20 41.5638 20C41.9371 20 42.2171 19.9 42.4038 19.7C42.6304 19.46 42.7438 19.06 42.7438 18.5V13.74ZM45.9438 19.5C46.1838 19.6333 46.4638 19.7467 46.7838 19.84C47.1438 19.9467 47.4838 20 47.8038 20C48.2038 20 48.5038 19.9333 48.7038 19.8C48.9038 19.6533 49.0038 19.4533 49.0038 19.2C49.0038 18.9467 48.9104 18.7467 48.7238 18.6C48.5371 18.44 48.2104 18.28 47.7438 18.12C46.3704 17.64 45.6838 16.8933 45.6838 15.88C45.6838 15.2133 45.9371 14.6733 46.4438 14.26C46.9638 13.8333 47.6704 13.62 48.5638 13.62C49.2704 13.62 49.9171 13.7467 50.5038 14L50.1238 15.38L50.0038 15.32C49.7638 15.2267 49.5704 15.16 49.4238 15.12C49.1438 15.04 48.8571 15 48.5638 15C48.2038 15 47.9238 15.0733 47.7238 15.22C47.5371 15.3533 47.4438 15.5333 47.4438 15.76C47.4438 15.9867 47.5504 16.1733 47.7638 16.32C47.9238 16.44 48.2704 16.6067 48.8038 16.82C49.4704 17.0733 49.9571 17.38 50.2638 17.74C50.5838 18.1 50.7438 18.54 50.7438 19.06C50.7438 19.7267 50.4904 20.2667 49.9838 20.68C49.4371 21.1467 48.6704 21.38 47.6838 21.38C47.2971 21.38 46.8904 21.3267 46.4638 21.22C46.1304 21.1533 45.8304 21.06 45.5638 20.94L45.9438 19.5Z" fill="#CBCB41" />
          </g>
          <rect x="57.6238" y="14" width="79" height="7" rx="3.5" fill="var(--vscode-tab-inactiveForeground, #FFFFFF)" fill-opacity="0.12" />
        </g>
      </g>
    </g>
    <g filter="url(#filter0_d_1720_12451)">
      <rect x="16" y="35" width="492" height="105" rx="2" fill="var(--vscode-quickInput-background, #292929)" />
    </g>
    <g>
      <rect x="17" y="79" width="490" height="20" stroke="var(--vscode-editor-lineHighlightBorder, #333333)" stroke-width="2" />
      <g>
        <path d="M48.812 93.6382C48.4989 93.8201 48.1751 93.9556 47.8408 94.0444C47.5107 94.1375 47.1722 94.1841 46.8252 94.1841C45.7249 94.1841 44.8638 93.854 44.2417 93.1938C43.6239 92.5337 43.3149 91.6196 43.3149 90.4517C43.3149 89.2837 43.6239 88.3696 44.2417 87.7095C44.8638 87.0493 45.7249 86.7192 46.8252 86.7192C47.168 86.7192 47.5023 86.7637 47.8281 86.8525C48.154 86.9414 48.4819 87.0789 48.812 87.2651V88.4902C48.5031 88.2152 48.1921 88.0163 47.8789 87.8936C47.57 87.7708 47.2188 87.7095 46.8252 87.7095C46.0931 87.7095 45.5303 87.9465 45.1367 88.4204C44.7432 88.8944 44.5464 89.5715 44.5464 90.4517C44.5464 91.3276 44.7432 92.0047 45.1367 92.4829C45.5345 92.9569 46.0973 93.1938 46.8252 93.1938C47.2314 93.1938 47.5954 93.1325 47.917 93.0098C48.2386 92.8828 48.5369 92.6882 48.812 92.4258V93.6382ZM53.8203 87.7095C53.2279 87.7095 52.7793 87.9401 52.4746 88.4014C52.1699 88.8626 52.0176 89.5461 52.0176 90.4517C52.0176 91.353 52.1699 92.0365 52.4746 92.502C52.7793 92.9632 53.2279 93.1938 53.8203 93.1938C54.417 93.1938 54.8677 92.9632 55.1724 92.502C55.4771 92.0365 55.6294 91.353 55.6294 90.4517C55.6294 89.5461 55.4771 88.8626 55.1724 88.4014C54.8677 87.9401 54.417 87.7095 53.8203 87.7095ZM53.8203 86.7192C54.8063 86.7192 55.5596 87.0387 56.0801 87.6777C56.6048 88.3167 56.8672 89.2414 56.8672 90.4517C56.8672 91.6662 56.6069 92.5929 56.0864 93.2319C55.5659 93.8667 54.8105 94.1841 53.8203 94.1841C52.8343 94.1841 52.0811 93.8667 51.5605 93.2319C51.04 92.5929 50.7798 91.6662 50.7798 90.4517C50.7798 89.2414 51.04 88.3167 51.5605 87.6777C52.0811 87.0387 52.8343 86.7192 53.8203 86.7192ZM64.4146 89.5947V94H63.2402V89.5947C63.2402 88.9557 63.1281 88.486 62.9038 88.1855C62.6795 87.8851 62.3283 87.7349 61.8501 87.7349C61.3042 87.7349 60.8831 87.9295 60.5869 88.3188C60.2949 88.7039 60.1489 89.2583 60.1489 89.9819V94H58.981V86.8906H60.1489V87.957C60.3563 87.5508 60.6377 87.244 60.9932 87.0366C61.3486 86.825 61.7697 86.7192 62.2563 86.7192C62.98 86.7192 63.5195 86.9583 63.875 87.4365C64.2347 87.9105 64.4146 88.6299 64.4146 89.5947ZM71.7524 87.1382V88.2808C71.4181 88.0861 71.0817 87.9401 70.7432 87.8428C70.4046 87.7454 70.0597 87.6968 69.7085 87.6968C69.1795 87.6968 68.7839 87.7835 68.5215 87.957C68.2633 88.1263 68.1343 88.3866 68.1343 88.7378C68.1343 89.0552 68.2316 89.2922 68.4263 89.4487C68.6209 89.6053 69.1055 89.7576 69.8799 89.9058L70.3496 89.9946C70.9294 90.1047 71.3674 90.3247 71.6636 90.6548C71.964 90.9849 72.1143 91.4144 72.1143 91.9434C72.1143 92.6458 71.8646 93.196 71.3652 93.5938C70.8659 93.9873 70.1719 94.1841 69.2832 94.1841C68.932 94.1841 68.5638 94.146 68.1787 94.0698C67.7936 93.9979 67.3768 93.8879 66.9282 93.7397V92.5337C67.3641 92.758 67.7809 92.9272 68.1787 93.0415C68.5765 93.1515 68.9531 93.2065 69.3086 93.2065C69.8249 93.2065 70.2248 93.1029 70.5083 92.8955C70.7918 92.6839 70.9336 92.3898 70.9336 92.0132C70.9336 91.4715 70.4152 91.097 69.3784 90.8896L69.3276 90.877L68.8896 90.7881C68.2168 90.6569 67.7259 90.4368 67.417 90.1279C67.1081 89.8148 66.9536 89.3895 66.9536 88.8521C66.9536 88.1707 67.1842 87.646 67.6455 87.2778C68.1068 86.9054 68.7648 86.7192 69.6196 86.7192C70.0005 86.7192 70.3665 86.7552 70.7178 86.8271C71.069 86.8949 71.4139 86.9985 71.7524 87.1382ZM77.3193 87.7095C76.7269 87.7095 76.2783 87.9401 75.9736 88.4014C75.6689 88.8626 75.5166 89.5461 75.5166 90.4517C75.5166 91.353 75.6689 92.0365 75.9736 92.502C76.2783 92.9632 76.7269 93.1938 77.3193 93.1938C77.916 93.1938 78.3667 92.9632 78.6714 92.502C78.9761 92.0365 79.1284 91.353 79.1284 90.4517C79.1284 89.5461 78.9761 88.8626 78.6714 88.4014C78.3667 87.9401 77.916 87.7095 77.3193 87.7095ZM77.3193 86.7192C78.3053 86.7192 79.0586 87.0387 79.5791 87.6777C80.1038 88.3167 80.3662 89.2414 80.3662 90.4517C80.3662 91.6662 80.106 92.5929 79.5854 93.2319C79.0649 93.8667 78.3096 94.1841 77.3193 94.1841C76.3333 94.1841 75.5801 93.8667 75.0596 93.2319C74.5391 92.5929 74.2788 91.6662 74.2788 90.4517C74.2788 89.2414 74.5391 88.3167 75.0596 87.6777C75.5801 87.0387 76.3333 86.7192 77.3193 86.7192ZM85.8062 91.4292C85.8062 91.9539 85.9014 92.3496 86.0918 92.6162C86.2865 92.8828 86.5721 93.0161 86.9487 93.0161H88.3135V94H86.8345C86.1362 94 85.5946 93.7778 85.2095 93.3335C84.8286 92.8849 84.6382 92.2502 84.6382 91.4292V84.999H82.7656V84.085H85.8062V91.4292ZM96.1846 89.8613V90.4326H91.1255V90.4707C91.0916 91.4398 91.2757 92.1359 91.6777 92.5591C92.084 92.9823 92.6553 93.1938 93.3916 93.1938C93.764 93.1938 94.1533 93.1346 94.5596 93.0161C94.9658 92.8976 95.3996 92.7178 95.8608 92.4766V93.6382C95.4165 93.8201 94.987 93.9556 94.5723 94.0444C94.1618 94.1375 93.764 94.1841 93.3789 94.1841C92.2744 94.1841 91.4111 93.854 90.7891 93.1938C90.167 92.5295 89.856 91.6154 89.856 90.4517C89.856 89.3175 90.1606 88.4119 90.77 87.7349C91.3794 87.0578 92.1919 86.7192 93.2075 86.7192C94.1131 86.7192 94.8262 87.026 95.3467 87.6396C95.8714 88.2533 96.1507 88.9938 96.1846 89.8613ZM95.0166 89.5186C94.9658 89.0277 94.786 88.6045 94.4771 88.249C94.1724 87.8893 93.7323 87.7095 93.1567 87.7095C92.5939 87.7095 92.1305 87.8957 91.7666 88.2681C91.4027 88.6405 91.2038 89.0594 91.1699 89.5249L95.0166 89.5186Z" fill="#9CDCFE" />
        <path d="M99.3774 91.4355H101.612V94H99.3774V91.4355Z" fill="var(--vscode-editor-foreground, #FFFFFF)" />
        <path d="M109.305 91.4292C109.305 91.9539 109.4 92.3496 109.591 92.6162C109.785 92.8828 110.071 93.0161 110.448 93.0161H111.812V94H110.333C109.635 94 109.094 93.7778 108.708 93.3335C108.328 92.8849 108.137 92.2502 108.137 91.4292V84.999H106.265V84.085H109.305V91.4292ZM116.484 87.7095C115.892 87.7095 115.443 87.9401 115.139 88.4014C114.834 88.8626 114.682 89.5461 114.682 90.4517C114.682 91.353 114.834 92.0365 115.139 92.502C115.443 92.9632 115.892 93.1938 116.484 93.1938C117.081 93.1938 117.532 92.9632 117.836 92.502C118.141 92.0365 118.293 91.353 118.293 90.4517C118.293 89.5461 118.141 88.8626 117.836 88.4014C117.532 87.9401 117.081 87.7095 116.484 87.7095ZM116.484 86.7192C117.47 86.7192 118.224 87.0387 118.744 87.6777C119.269 88.3167 119.531 89.2414 119.531 90.4517C119.531 91.6662 119.271 92.5929 118.75 93.2319C118.23 93.8667 117.475 94.1841 116.484 94.1841C115.498 94.1841 114.745 93.8667 114.225 93.2319C113.704 92.5929 113.444 91.6662 113.444 90.4517C113.444 89.2414 113.704 88.3167 114.225 87.6777C114.745 87.0387 115.498 86.7192 116.484 86.7192ZM125.854 90.3882C125.854 89.5122 125.71 88.8478 125.422 88.395C125.138 87.938 124.724 87.7095 124.178 87.7095C123.606 87.7095 123.171 87.938 122.87 88.395C122.57 88.8478 122.419 89.5122 122.419 90.3882C122.419 91.2642 122.57 91.9328 122.87 92.394C123.175 92.8511 123.615 93.0796 124.19 93.0796C124.728 93.0796 125.138 92.849 125.422 92.3877C125.71 91.9264 125.854 91.2599 125.854 90.3882ZM127.021 93.543C127.021 94.6094 126.77 95.4176 126.266 95.9678C125.763 96.5179 125.022 96.793 124.044 96.793C123.723 96.793 123.386 96.7633 123.035 96.7041C122.684 96.6449 122.333 96.5581 121.981 96.4438V95.2886C122.396 95.4832 122.773 95.6271 123.111 95.7202C123.45 95.8133 123.761 95.8599 124.044 95.8599C124.675 95.8599 125.134 95.6885 125.422 95.3457C125.71 95.0029 125.854 94.4591 125.854 93.7144V93.6636V92.8701C125.667 93.2679 125.413 93.5641 125.092 93.7588C124.77 93.9535 124.379 94.0508 123.917 94.0508C123.088 94.0508 122.426 93.7186 121.931 93.0542C121.436 92.3898 121.188 91.5011 121.188 90.3882C121.188 89.271 121.436 88.3802 121.931 87.7158C122.426 87.0514 123.088 86.7192 123.917 86.7192C124.375 86.7192 124.762 86.8102 125.079 86.9922C125.396 87.1742 125.655 87.4556 125.854 87.8364V86.916H127.021V93.543Z" fill="#D7BA7D" />
      </g>
      <rect x="128.717" y="78" width="4.21333" height="22" fill="var(--vscode-editorCursor-foreground, #CCCCCC)" />
    </g>
    <rect opacity="0.5" x="35.7571" y="57" width="65.3067" height="8" rx="4" fill="var(--vscode-gitDecoration-renamedResourceForeground, #73C991)" />
    <rect opacity="0.5" x="107" y="57" width="142" height="8" rx="4" fill="var(--vscode-gitDecoration-renamedResourceForeground, #73C991)" />
  </g>
  <defs>
    <filter id="filter0_d_1720_12451" x="0" y="21" width="524" height="137" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
      <feOffset dy="2" />
      <feGaussianBlur stdDeviation="8" />
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.36 0" />
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1720_12451" />
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1720_12451" result="shape" />
    </filter>
  </defs>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/resources/walkthroughs/debug-and-run.svg]---
Location: vscode-main/extensions/typescript-language-features/resources/walkthroughs/debug-and-run.svg

```text
<svg width="526" height="328" viewBox="0 0 526 328" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g>
    <g filter="url(#filter0_d_1724_12223)">
      <rect width="192" height="268" transform="translate(8 28)" fill="var(--vscode-sideBar-background, #252526)" />
      <g>
        <g>
          <path d="M25.8019 54.1377H27.2078L28.5158 56.6069H29.6681L28.2266 53.982C29.0096 53.7195 29.4723 53.0166 29.4723 52.149C29.4723 50.9522 28.6403 50.187 27.3457 50.187H24.8053V56.6069H25.8019V54.1377ZM25.8019 51.0234H27.2078C27.9774 51.0234 28.449 51.4549 28.449 52.1712C28.449 52.9053 28.0041 53.3191 27.2344 53.3191H25.8019V51.0234ZM31.8792 50.187H30.8827V54.3958C30.8827 55.7839 31.8748 56.7626 33.4809 56.7626C35.0959 56.7626 36.0836 55.7839 36.0836 54.3958V50.187H35.087V54.3157C35.087 55.2322 34.5042 55.8773 33.4809 55.8773C32.4621 55.8773 31.8792 55.2322 31.8792 54.3157V50.187ZM38.6596 56.6069V51.9443H38.7308L42.0275 56.6069H42.9262V50.187H41.9563V54.8585H41.8851L38.5884 50.187H37.6897V56.6069H38.6596ZM51.1881 56.6069H52.2469L49.929 50.187H48.8568L46.5388 56.6069H47.5621L48.1538 54.8718H50.6008L51.1881 56.6069ZM49.3417 51.3215H49.4173L50.3472 54.071H48.4074L49.3417 51.3215ZM54.338 56.6069V51.9443H54.4092L57.7059 56.6069H58.6046V50.187H57.6347V54.8585H57.5635L54.2668 50.187H53.3681V56.6069H54.338ZM60.2196 50.187V56.6069H62.5375C64.4506 56.6069 65.5584 55.4235 65.5584 53.3814C65.5584 51.3615 64.4417 50.187 62.5375 50.187H60.2196ZM61.2162 51.0456H62.4263C63.7566 51.0456 64.5441 51.9132 64.5441 53.3947C64.5441 54.8896 63.7699 55.7483 62.4263 55.7483H61.2162V51.0456ZM69.4024 50.187V56.6069H71.7204C73.6334 56.6069 74.7413 55.4235 74.7413 53.3814C74.7413 51.3615 73.6245 50.187 71.7204 50.187H69.4024ZM70.399 51.0456H71.6091C72.9394 51.0456 73.7269 51.9132 73.7269 53.3947C73.7269 54.8896 72.9527 55.7483 71.6091 55.7483H70.399V51.0456ZM80.1691 55.7483H77.0903V53.7507H80.0045V52.9231H77.0903V51.0456H80.1691V50.187H76.0938V56.6069H80.1691V55.7483ZM84.2488 56.6069C85.6191 56.6069 86.4422 55.9218 86.4422 54.7917C86.4422 53.9509 85.8638 53.3369 84.9963 53.2435V53.1678C85.628 53.0611 86.1219 52.4604 86.1219 51.7886C86.1219 50.8009 85.3967 50.187 84.191 50.187H81.6106V56.6069H84.2488ZM82.6071 51.0011H83.9597C84.6982 51.0011 85.1298 51.3526 85.1298 51.9621C85.1298 52.5895 84.6715 52.9187 83.7906 52.9187H82.6071V51.0011ZM82.6071 55.7928V53.6795H83.9908C84.9295 53.6795 85.4234 54.0354 85.4234 54.7294C85.4234 55.4235 84.9473 55.7928 84.0486 55.7928H82.6071ZM88.7112 50.187H87.7146V54.3958C87.7146 55.7839 88.7068 56.7626 90.3129 56.7626C91.9279 56.7626 92.9156 55.7839 92.9156 54.3958V50.187H91.919V54.3157C91.919 55.2322 91.3362 55.8773 90.3129 55.8773C89.2941 55.8773 88.7112 55.2322 88.7112 54.3157V50.187ZM99.9984 54.0799V53.2835H97.3646V54.0888H99.0196V54.2311C99.0107 55.2144 98.29 55.8773 97.24 55.8773C96.0343 55.8773 95.278 54.9296 95.278 53.3903C95.278 51.8732 96.0299 50.9166 97.2178 50.9166C98.0942 50.9166 98.7038 51.3482 98.9529 52.1446H99.9539C99.7359 50.8499 98.6771 50.0313 97.2178 50.0313C95.4204 50.0313 94.2592 51.3526 94.2592 53.3947C94.2592 55.4635 95.407 56.7626 97.2267 56.7626C98.9084 56.7626 99.9984 55.7082 99.9984 54.0799Z" fill="var(--vscode-sideBarTitle-foreground, #CCCCCC)" />
        </g>
      </g>
      <g>
        <g>
          <path d="M29.984 81.064L34.336 76.712L34.96 77.336L30.288 81.992H29.664L25.008 77.336L25.616 76.712L29.984 81.064Z" fill="#808080" />
          <path d="M50.0649 82L52.1787 75.6587H50.7505L49.3354 80.5498H49.2563L47.8149 75.6587H46.3164L48.4609 82H50.0649ZM56.7666 82H58.2036L56.002 75.6587H54.4419L52.2402 82H53.5718L54.0596 80.4619H56.2876L56.7666 82ZM55.1406 76.9463H55.2197L56.0063 79.4688H54.3452L55.1406 76.9463ZM60.6118 79.6797H61.6973L62.8794 82H64.3823L63.0464 79.4819C63.7759 79.1963 64.1978 78.4932 64.1978 77.6802C64.1978 76.4277 63.3408 75.6587 61.9478 75.6587H59.2847V82H60.6118V79.6797ZM60.6118 76.6958H61.7632C62.4224 76.6958 62.8354 77.0825 62.8354 77.6978C62.8354 78.3262 62.4443 78.6909 61.7764 78.6909H60.6118V76.6958ZM66.8608 82V75.6587H65.5337V82H66.8608ZM72.4727 82H73.9097L71.708 75.6587H70.1479L67.9463 82H69.2778L69.7656 80.4619H71.9937L72.4727 82ZM70.8467 76.9463H70.9258L71.7124 79.4688H70.0513L70.8467 76.9463ZM77.8384 82C79.1919 82 80.0312 81.3013 80.0312 80.1851C80.0312 79.3677 79.4204 78.7393 78.5811 78.6733V78.5942C79.2314 78.4976 79.728 77.9131 79.728 77.2407C79.728 76.2607 78.9941 75.6587 77.7637 75.6587H74.9907V82H77.8384ZM76.3179 76.6431H77.4253C78.0581 76.6431 78.4229 76.9507 78.4229 77.4692C78.4229 77.9966 78.0317 78.2954 77.3154 78.2954H76.3179V76.6431ZM76.3179 81.0112V79.1699H77.4692C78.2515 79.1699 78.6777 79.4863 78.6777 80.0796C78.6777 80.686 78.2646 81.0112 77.5 81.0112H76.3179ZM85.3794 80.8838H82.5581V75.6587H81.231V82H85.3794V80.8838ZM90.7847 80.9058H87.9106V79.3018H90.6221V78.2822H87.9106V76.7529H90.7847V75.6587H86.5835V82H90.7847V80.9058ZM91.8965 80.2466C91.9448 81.4199 92.9248 82.1626 94.4365 82.1626C96.0273 82.1626 97.0073 81.3804 97.0073 80.1147C97.0073 79.1348 96.458 78.5854 95.1836 78.313L94.4189 78.1504C93.6763 77.9878 93.373 77.7549 93.373 77.355C93.373 76.8584 93.8125 76.5376 94.4761 76.5376C95.1177 76.5376 95.5835 76.876 95.645 77.3945H96.8931C96.8535 76.2739 95.8647 75.4961 94.4673 75.4961C93.0039 75.4961 92.0415 76.2783 92.0415 77.4604C92.0415 78.4229 92.6084 79.0161 93.7642 79.2622L94.5903 79.4424C95.3682 79.6138 95.6846 79.8555 95.6846 80.2729C95.6846 80.7651 95.1968 81.1123 94.5068 81.1123C93.7598 81.1123 93.2412 80.7739 93.1797 80.2466H91.8965Z" fill="var(--vscode-sideBarTitle-foreground, #FFFFFF)" />
        </g>
      </g>
      <g>
        <path d="M32.08 103.016L27.712 98.664L28.336 98.04L33.008 102.712V103.336L28.336 107.992L27.712 107.384L32.08 103.032V103.016Z" fill="#808080" />
        <rect x="46" y="99.5" width="27" height="7" rx="3.5" fill="#B180D7" />
        <rect x="79" y="99.5" width="70" height="7" rx="3.5" fill="var(--vscode-list-deemphasizedForeground, #FFFFFF)" fill-opacity="0.16" />
      </g>
      <g>
        <path d="M32.08 127.016L27.712 122.664L28.336 122.04L33.008 126.712V127.336L28.336 131.992L27.712 131.384L32.08 127.032V127.016Z" fill="#808080" />
        <rect x="46" y="123.5" width="27" height="7" rx="3.5" fill="#B180D7" />
        <rect x="79" y="123.5" width="61" height="7" rx="3.5" fill="var(--vscode-list-deemphasizedForeground, #FFFFFF)" fill-opacity="0.16" />
      </g>
      <g>
        <path d="M32.08 151.016L27.712 146.664L28.336 146.04L33.008 150.712V151.336L28.336 155.992L27.712 155.384L32.08 151.032V151.016Z" fill="#808080" />
        <rect x="46" y="147.5" width="40" height="7" rx="3.5" fill="#B180D7" />
        <rect x="92" y="147.5" width="34" height="7" rx="3.5" fill="var(--vscode-list-deemphasizedForeground, #FFFFFF)" fill-opacity="0.16" />
      </g>
      <g>
        <g>
          <path d="M32.08 175.016L27.712 170.664L28.336 170.04L33.008 174.712V175.336L28.336 179.992L27.712 179.384L32.08 175.032V175.016Z" fill="#808080" />
          <path d="M50.5044 173.729H50.5747L51.7744 178H53.0181L54.7012 171.659H53.3301L52.3501 176.189H52.2798L51.1021 171.659H49.9814L48.8257 176.189H48.7554L47.7666 171.659H46.3867L48.0654 178H49.3179L50.5044 173.729ZM59.4033 178H60.8403L58.6387 171.659H57.0786L54.877 178H56.2085L56.6963 176.462H58.9243L59.4033 178ZM57.7773 172.946H57.8564L58.6431 175.469H56.9819L57.7773 172.946ZM64.1011 178V172.753H66.0039V171.659H60.8711V172.753H62.7739V178H64.1011ZM69.6514 178.163C71.1807 178.163 72.2969 177.235 72.4067 175.882H71.1147C70.9873 176.581 70.416 177.029 69.6558 177.029C68.6538 177.029 68.0342 176.185 68.0342 174.827C68.0342 173.469 68.6538 172.625 69.6514 172.625C70.4072 172.625 70.9829 173.109 71.1104 173.843H72.4023C72.3057 172.48 71.1543 171.496 69.6514 171.496C67.8101 171.496 66.6763 172.766 66.6763 174.827C66.6763 176.888 67.8145 178.163 69.6514 178.163ZM79.1392 178V171.659H77.812V174.234H74.9556V171.659H73.6284V178H74.9556V175.328H77.812V178H79.1392Z" fill="var(--vscode-sideBarTitle-foreground, #FFFFFF)" />
        </g>
      </g>
      <g>
        <g>
          <path d="M29.984 201.064L34.336 196.712L34.96 197.336L30.288 201.992H29.664L25.008 197.336L25.616 196.712L29.984 201.064Z" fill="#808080" />
          <path d="M49.4629 202.163C50.9922 202.163 52.1084 201.235 52.2183 199.882H50.9263C50.7988 200.581 50.2275 201.029 49.4673 201.029C48.4653 201.029 47.8457 200.185 47.8457 198.827C47.8457 197.469 48.4653 196.625 49.4629 196.625C50.2188 196.625 50.7944 197.109 50.9219 197.843H52.2139C52.1172 196.48 50.9658 195.496 49.4629 195.496C47.6216 195.496 46.4878 196.766 46.4878 198.827C46.4878 200.888 47.626 202.163 49.4629 202.163ZM57.3115 202H58.7485L56.5469 195.659H54.9868L52.7852 202H54.1167L54.6045 200.462H56.8325L57.3115 202ZM55.6855 196.946H55.7646L56.5513 199.469H54.8901L55.6855 196.946ZM63.978 200.884H61.1567V195.659H59.8296V202H63.978V200.884ZM69.3306 200.884H66.5093V195.659H65.1821V202H69.3306V200.884ZM72.5693 200.247C72.6177 201.42 73.5977 202.163 75.1094 202.163C76.7002 202.163 77.6802 201.38 77.6802 200.115C77.6802 199.135 77.1309 198.585 75.8564 198.313L75.0918 198.15C74.3491 197.988 74.0459 197.755 74.0459 197.355C74.0459 196.858 74.4854 196.538 75.1489 196.538C75.7905 196.538 76.2563 196.876 76.3179 197.395H77.5659C77.5264 196.274 76.5376 195.496 75.1401 195.496C73.6768 195.496 72.7144 196.278 72.7144 197.46C72.7144 198.423 73.2812 199.016 74.437 199.262L75.2632 199.442C76.041 199.614 76.3574 199.855 76.3574 200.273C76.3574 200.765 75.8696 201.112 75.1797 201.112C74.4326 201.112 73.9141 200.774 73.8525 200.247H72.5693ZM81.8022 202V196.753H83.7051V195.659H78.5723V196.753H80.4751V202H81.8022ZM88.2666 202H89.7036L87.502 195.659H85.9419L83.7402 202H85.0718L85.5596 200.462H87.7876L88.2666 202ZM86.6406 196.946H86.7197L87.5063 199.469H85.8452L86.6406 196.946ZM93.1885 202.163C94.7178 202.163 95.834 201.235 95.9438 199.882H94.6519C94.5244 200.581 93.9531 201.029 93.1929 201.029C92.1909 201.029 91.5713 200.185 91.5713 198.827C91.5713 197.469 92.1909 196.625 93.1885 196.625C93.9443 196.625 94.52 197.109 94.6475 197.843H95.9395C95.8428 196.48 94.6914 195.496 93.1885 195.496C91.3472 195.496 90.2134 196.766 90.2134 198.827C90.2134 200.888 91.3516 202.163 93.1885 202.163ZM98.4927 202V200.062L99.1211 199.306L100.962 202H102.553L100.079 198.436L102.391 195.659H100.914L98.5718 198.506H98.4927V195.659H97.1655V202H98.4927Z" fill="var(--vscode-sideBarTitle-foreground, #FFFFFF)" />
        </g>
      </g>
      <g>
        <path d="M32.08 223.016L27.712 218.664L28.336 218.04L33.008 222.712V223.336L28.336 227.992L27.712 227.384L32.08 223.032V223.016Z" fill="#808080" />
        <rect x="46" y="219.5" width="70" height="7" rx="3.5" fill="var(--vscode-list-deemphasizedForeground, #FFFFFF)" fill-opacity="0.16" />
      </g>
      <g>
        <path d="M32.08 247.016L27.712 242.664L28.336 242.04L33.008 246.712V247.336L28.336 251.992L27.712 251.384L32.08 247.032V247.016Z" fill="#808080" />
        <rect x="46" y="243.5" width="48" height="7" rx="3.5" fill="var(--vscode-list-deemphasizedForeground, #FFFFFF)" fill-opacity="0.16" />
      </g>
      <g>
        <path d="M32.08 271.016L27.712 266.664L28.336 266.04L33.008 270.712V271.336L28.336 275.992L27.712 275.384L32.08 271.032V271.016Z" fill="#808080" />
        <rect x="46" y="267.5" width="46" height="7" rx="3.5" fill="var(--vscode-list-deemphasizedForeground, #FFFFFF)" fill-opacity="0.16" />
      </g>
    </g>
    <g filter="url(#filter1_d_1724_12223)">
      <rect width="379" height="296" transform="translate(131 14)" fill="var(--vscode-quickInput-background, #252526)" />
      <g>
        <rect width="379" height="35" transform="translate(131 14)" fill="var(--vscode-editorGroupHeader-tabsBackground, #292929)" />
        <g clip-path="url(#clip0_1724_12223)">
          <g>
            <rect width="103" height="35" transform="translate(131 14)" fill="var(--vscode-tab-activeBackground, #1E1E1E)" />
            <rect x="143" y="28" width="79" height="7" rx="3.5" fill="var(--vscode-tab-inactiveForeground, #FFFFFF)" fill-opacity="0.12" />
          </g>
        </g>
      </g>
      <g>
        <g>
          <rect width="379" height="24" transform="translate(131 95)" fill="#555522" />
          <path d="M151.496 106.152L147.24 101.416L146.312 101H141.256L140.008 102.248V111.736L141.256 112.984H146.312L147.24 112.552L151.496 107.816V106.152ZM146.312 111.736H141.256V102.248H146.312L150.568 106.984L146.312 111.736Z" fill="#FFFF00" />
          <g>
            <path d="M177.217 110.666C176.928 110.834 176.629 110.959 176.32 111.041C176.016 111.127 175.703 111.17 175.383 111.17C174.367 111.17 173.572 110.865 172.998 110.256C172.428 109.646 172.143 108.803 172.143 107.725C172.143 106.646 172.428 105.803 172.998 105.193C173.572 104.584 174.367 104.279 175.383 104.279C175.699 104.279 176.008 104.32 176.309 104.402C176.609 104.484 176.912 104.611 177.217 104.783V105.914C176.932 105.66 176.645 105.477 176.355 105.363C176.07 105.25 175.746 105.193 175.383 105.193C174.707 105.193 174.188 105.412 173.824 105.85C173.461 106.287 173.279 106.912 173.279 107.725C173.279 108.533 173.461 109.158 173.824 109.6C174.191 110.037 174.711 110.256 175.383 110.256C175.758 110.256 176.094 110.199 176.391 110.086C176.688 109.969 176.963 109.789 177.217 109.547V110.666ZM181.84 105.193C181.293 105.193 180.879 105.406 180.598 105.832C180.316 106.258 180.176 106.889 180.176 107.725C180.176 108.557 180.316 109.188 180.598 109.617C180.879 110.043 181.293 110.256 181.84 110.256C182.391 110.256 182.807 110.043 183.088 109.617C183.369 109.188 183.51 108.557 183.51 107.725C183.51 106.889 183.369 106.258 183.088 105.832C182.807 105.406 182.391 105.193 181.84 105.193ZM181.84 104.279C182.75 104.279 183.445 104.574 183.926 105.164C184.41 105.754 184.652 106.607 184.652 107.725C184.652 108.846 184.412 109.701 183.932 110.291C183.451 110.877 182.754 111.17 181.84 111.17C180.93 111.17 180.234 110.877 179.754 110.291C179.273 109.701 179.033 108.846 179.033 107.725C179.033 106.607 179.273 105.754 179.754 105.164C180.234 104.574 180.93 104.279 181.84 104.279ZM191.619 106.934V111H190.535V106.934C190.535 106.344 190.432 105.91 190.225 105.633C190.018 105.355 189.693 105.217 189.252 105.217C188.748 105.217 188.359 105.396 188.086 105.756C187.816 106.111 187.682 106.623 187.682 107.291V111H186.604V104.438H187.682V105.422C187.873 105.047 188.133 104.764 188.461 104.572C188.789 104.377 189.178 104.279 189.627 104.279C190.295 104.279 190.793 104.5 191.121 104.941C191.453 105.379 191.619 106.043 191.619 106.934ZM198.393 104.666V105.721C198.084 105.541 197.773 105.406 197.461 105.316C197.148 105.227 196.83 105.182 196.506 105.182C196.018 105.182 195.652 105.262 195.41 105.422C195.172 105.578 195.053 105.818 195.053 106.143C195.053 106.436 195.143 106.654 195.322 106.799C195.502 106.943 195.949 107.084 196.664 107.221L197.098 107.303C197.633 107.404 198.037 107.607 198.311 107.912C198.588 108.217 198.727 108.613 198.727 109.102C198.727 109.75 198.496 110.258 198.035 110.625C197.574 110.988 196.934 111.17 196.113 111.17C195.789 111.17 195.449 111.135 195.094 111.064C194.738 110.998 194.354 110.896 193.939 110.76V109.646C194.342 109.854 194.727 110.01 195.094 110.115C195.461 110.217 195.809 110.268 196.137 110.268C196.613 110.268 196.982 110.172 197.244 109.98C197.506 109.785 197.637 109.514 197.637 109.166C197.637 108.666 197.158 108.32 196.201 108.129L196.154 108.117L195.75 108.035C195.129 107.914 194.676 107.711 194.391 107.426C194.105 107.137 193.963 106.744 193.963 106.248C193.963 105.619 194.176 105.135 194.602 104.795C195.027 104.451 195.635 104.279 196.424 104.279C196.775 104.279 197.113 104.312 197.438 104.379C197.762 104.441 198.08 104.537 198.393 104.666ZM203.531 105.193C202.984 105.193 202.57 105.406 202.289 105.832C202.008 106.258 201.867 106.889 201.867 107.725C201.867 108.557 202.008 109.188 202.289 109.617C202.57 110.043 202.984 110.256 203.531 110.256C204.082 110.256 204.498 110.043 204.779 109.617C205.061 109.188 205.201 108.557 205.201 107.725C205.201 106.889 205.061 106.258 204.779 105.832C204.498 105.406 204.082 105.193 203.531 105.193ZM203.531 104.279C204.441 104.279 205.137 104.574 205.617 105.164C206.102 105.754 206.344 106.607 206.344 107.725C206.344 108.846 206.104 109.701 205.623 110.291C205.143 110.877 204.445 111.17 203.531 111.17C202.621 111.17 201.926 110.877 201.445 110.291C200.965 109.701 200.725 108.846 200.725 107.725C200.725 106.607 200.965 105.754 201.445 105.164C201.926 104.574 202.621 104.279 203.531 104.279ZM211.365 108.627C211.365 109.111 211.453 109.477 211.629 109.723C211.809 109.969 212.072 110.092 212.42 110.092H213.68V111H212.314C211.67 111 211.17 110.795 210.814 110.385C210.463 109.971 210.287 109.385 210.287 108.627V102.691H208.559V101.848H211.365V108.627ZM220.945 107.18V107.707H216.275V107.742C216.244 108.637 216.414 109.279 216.785 109.67C217.16 110.061 217.688 110.256 218.367 110.256C218.711 110.256 219.07 110.201 219.445 110.092C219.82 109.982 220.221 109.816 220.646 109.594V110.666C220.236 110.834 219.84 110.959 219.457 111.041C219.078 111.127 218.711 111.17 218.355 111.17C217.336 111.17 216.539 110.865 215.965 110.256C215.391 109.643 215.104 108.799 215.104 107.725C215.104 106.678 215.385 105.842 215.947 105.217C216.51 104.592 217.26 104.279 218.197 104.279C219.033 104.279 219.691 104.562 220.172 105.129C220.656 105.695 220.914 106.379 220.945 107.18ZM219.867 106.863C219.82 106.41 219.654 106.02 219.369 105.691C219.088 105.359 218.682 105.193 218.15 105.193C217.631 105.193 217.203 105.365 216.867 105.709C216.531 106.053 216.348 106.439 216.316 106.869L219.867 106.863Z" fill="#9CDCFE" />
            <path d="M223.893 108.633H225.955V111H223.893V108.633ZM233.057 108.627C233.057 109.111 233.145 109.477 233.32 109.723C233.5 109.969 233.764 110.092 234.111 110.092H235.371V111H234.006C233.361 111 232.861 110.795 232.506 110.385C232.154 109.971 231.979 109.385 231.979 108.627V102.691H230.25V101.848H233.057V108.627ZM239.684 105.193C239.137 105.193 238.723 105.406 238.441 105.832C238.16 106.258 238.02 106.889 238.02 107.725C238.02 108.557 238.16 109.188 238.441 109.617C238.723 110.043 239.137 110.256 239.684 110.256C240.234 110.256 240.65 110.043 240.932 109.617C241.213 109.188 241.354 108.557 241.354 107.725C241.354 106.889 241.213 106.258 240.932 105.832C240.65 105.406 240.234 105.193 239.684 105.193ZM239.684 104.279C240.594 104.279 241.289 104.574 241.77 105.164C242.254 105.754 242.496 106.607 242.496 107.725C242.496 108.846 242.256 109.701 241.775 110.291C241.295 110.877 240.598 111.17 239.684 111.17C238.773 111.17 238.078 110.877 237.598 110.291C237.117 109.701 236.877 108.846 236.877 107.725C236.877 106.607 237.117 105.754 237.598 105.164C238.078 104.574 238.773 104.279 239.684 104.279ZM248.332 107.666C248.332 106.857 248.199 106.244 247.934 105.826C247.672 105.404 247.289 105.193 246.785 105.193C246.258 105.193 245.855 105.404 245.578 105.826C245.301 106.244 245.162 106.857 245.162 107.666C245.162 108.475 245.301 109.092 245.578 109.518C245.859 109.939 246.266 110.15 246.797 110.15C247.293 110.15 247.672 109.938 247.934 109.512C248.199 109.086 248.332 108.471 248.332 107.666ZM249.41 110.578C249.41 111.562 249.178 112.309 248.713 112.816C248.248 113.324 247.564 113.578 246.662 113.578C246.365 113.578 246.055 113.551 245.73 113.496C245.406 113.441 245.082 113.361 244.758 113.256V112.189C245.141 112.369 245.488 112.502 245.801 112.588C246.113 112.674 246.4 112.717 246.662 112.717C247.244 112.717 247.668 112.559 247.934 112.242C248.199 111.926 248.332 111.424 248.332 110.736V110.689V109.957C248.16 110.324 247.926 110.598 247.629 110.777C247.332 110.957 246.971 111.047 246.545 111.047C245.779 111.047 245.168 110.74 244.711 110.127C244.254 109.514 244.025 108.693 244.025 107.666C244.025 106.635 244.254 105.812 244.711 105.199C245.168 104.586 245.779 104.279 246.545 104.279C246.967 104.279 247.324 104.363 247.617 104.531C247.91 104.699 248.148 104.959 248.332 105.311V104.461H249.41V110.578Z" fill="#D7BA7D" />
            <path d="M255.545 101.309C255.025 102.199 254.637 103.088 254.379 103.975C254.125 104.857 253.998 105.748 253.998 106.646C253.998 107.541 254.125 108.432 254.379 109.318C254.637 110.205 255.025 111.098 255.545 111.996H254.607C254.018 111.066 253.578 110.162 253.289 109.283C253 108.4 252.855 107.521 252.855 106.646C252.855 105.775 253 104.898 253.289 104.016C253.578 103.133 254.018 102.23 254.607 101.309H255.545ZM353.801 101.309H354.738C355.328 102.23 355.768 103.133 356.057 104.016C356.346 104.898 356.49 105.775 356.49 106.646C356.49 107.525 356.346 108.406 356.057 109.289C355.768 110.172 355.328 111.074 354.738 111.996H353.801C354.32 111.09 354.707 110.193 354.961 109.307C355.219 108.42 355.348 107.533 355.348 106.646C355.348 105.756 355.219 104.867 354.961 103.98C354.707 103.094 354.32 102.203 353.801 101.309ZM361.582 108.885H363.41V110.438L362.256 112.676H361.002L361.582 110.438V108.885ZM361.506 104.443H363.334V106.559H361.506V104.443Z" fill="#FFFFFF" />
            <path d="M261.955 105.334H260.479V104.121L261.627 101.883H262.529L261.955 104.121V105.334ZM265.799 102.252H266.988V105.604H270.229V102.252H271.418V111H270.229V106.6H266.988V111H265.799V102.252ZM278.789 107.18V107.707H274.119V107.742C274.088 108.637 274.258 109.279 274.629 109.67C275.004 110.061 275.531 110.256 276.211 110.256C276.555 110.256 276.914 110.201 277.289 110.092C277.664 109.982 278.064 109.816 278.49 109.594V110.666C278.08 110.834 277.684 110.959 277.301 111.041C276.922 111.127 276.555 111.17 276.199 111.17C275.18 111.17 274.383 110.865 273.809 110.256C273.234 109.643 272.947 108.799 272.947 107.725C272.947 106.678 273.229 105.842 273.791 105.217C274.354 104.592 275.104 104.279 276.041 104.279C276.877 104.279 277.535 104.562 278.016 105.129C278.5 105.695 278.758 106.379 278.789 107.18ZM277.711 106.863C277.664 106.41 277.498 106.02 277.213 105.691C276.932 105.359 276.525 105.193 275.994 105.193C275.475 105.193 275.047 105.365 274.711 105.709C274.375 106.053 274.191 106.439 274.16 106.869L277.711 106.863ZM283.67 108.627C283.67 109.111 283.758 109.477 283.934 109.723C284.113 109.969 284.377 110.092 284.725 110.092H285.984V111H284.619C283.975 111 283.475 110.795 283.119 110.385C282.768 109.971 282.592 109.385 282.592 108.627V102.691H280.863V101.848H283.67V108.627ZM290.9 108.627C290.9 109.111 290.988 109.477 291.164 109.723C291.344 109.969 291.607 110.092 291.955 110.092H293.215V111H291.85C291.205 111 290.705 110.795 290.35 110.385C289.998 109.971 289.822 109.385 289.822 108.627V102.691H288.094V101.848H290.9V108.627ZM297.527 105.193C296.98 105.193 296.566 105.406 296.285 105.832C296.004 106.258 295.863 106.889 295.863 107.725C295.863 108.557 296.004 109.188 296.285 109.617C296.566 110.043 296.98 110.256 297.527 110.256C298.078 110.256 298.494 110.043 298.775 109.617C299.057 109.188 299.197 108.557 299.197 107.725C299.197 106.889 299.057 106.258 298.775 105.832C298.494 105.406 298.078 105.193 297.527 105.193ZM297.527 104.279C298.438 104.279 299.133 104.574 299.613 105.164C300.098 105.754 300.34 106.607 300.34 107.725C300.34 108.846 300.1 109.701 299.619 110.291C299.139 110.877 298.441 111.17 297.527 111.17C296.617 111.17 295.922 110.877 295.441 110.291C294.961 109.701 294.721 108.846 294.721 107.725C294.721 106.607 294.961 105.754 295.441 105.164C295.922 104.574 296.617 104.279 297.527 104.279ZM308.379 102.252H309.533L310.371 109.354L311.367 104.654H312.604L313.611 109.365L314.449 102.252H315.604L314.297 111H313.178L311.988 105.803L310.805 111H309.686L308.379 102.252ZM319.219 105.193C318.672 105.193 318.258 105.406 317.977 105.832C317.695 106.258 317.555 106.889 317.555 107.725C317.555 108.557 317.695 109.188 317.977 109.617C318.258 110.043 318.672 110.256 319.219 110.256C319.77 110.256 320.186 110.043 320.467 109.617C320.748 109.188 320.889 108.557 320.889 107.725C320.889 106.889 320.748 106.258 320.467 105.832C320.186 105.406 319.77 105.193 319.219 105.193ZM319.219 104.279C320.129 104.279 320.824 104.574 321.305 105.164C321.789 105.754 322.031 106.607 322.031 107.725C322.031 108.846 321.791 109.701 321.311 110.291C320.83 110.877 320.133 111.17 319.219 111.17C318.309 111.17 317.613 110.877 317.133 110.291C316.652 109.701 316.412 108.846 316.412 107.725C316.412 106.607 316.652 105.754 317.133 105.164C317.613 104.574 318.309 104.279 319.219 104.279ZM329.607 105.791C329.377 105.611 329.143 105.48 328.904 105.398C328.666 105.316 328.404 105.275 328.119 105.275C327.447 105.275 326.934 105.486 326.578 105.908C326.223 106.33 326.045 106.939 326.045 107.736V111H324.961V104.438H326.045V105.721C326.225 105.256 326.5 104.9 326.871 104.654C327.246 104.404 327.689 104.279 328.201 104.279C328.467 104.279 328.715 104.312 328.945 104.379C329.176 104.445 329.396 104.549 329.607 104.689V105.791ZM334.283 108.627C334.283 109.111 334.371 109.477 334.547 109.723C334.727 109.969 334.99 110.092 335.338 110.092H336.598V111H335.232C334.588 111 334.088 110.795 333.732 110.385C333.381 109.971 333.205 109.385 333.205 108.627V102.691H331.477V101.848H334.283V108.627ZM342.328 105.275V101.883H343.406V111H342.328V110.174C342.148 110.498 341.908 110.746 341.607 110.918C341.311 111.086 340.967 111.17 340.576 111.17C339.783 111.17 339.158 110.863 338.701 110.25C338.248 109.633 338.021 108.783 338.021 107.701C338.021 106.635 338.25 105.799 338.707 105.193C339.164 104.584 339.787 104.279 340.576 104.279C340.971 104.279 341.318 104.365 341.619 104.537C341.92 104.705 342.156 104.951 342.328 105.275ZM339.158 107.725C339.158 108.561 339.291 109.191 339.557 109.617C339.822 110.043 340.215 110.256 340.734 110.256C341.254 110.256 341.648 110.041 341.918 109.611C342.191 109.182 342.328 108.553 342.328 107.725C342.328 106.893 342.191 106.264 341.918 105.838C341.648 105.408 341.254 105.193 340.734 105.193C340.215 105.193 339.822 105.406 339.557 105.832C339.291 106.258 339.158 106.889 339.158 107.725ZM347.818 101.883H349.295V103.09L348.141 105.334H347.244L347.818 103.09V101.883Z" fill="#D88E73" />
          </g>
          <circle cx="145" cy="107" r="2" fill="#FF0000" />
        </g>
      </g>
      <rect opacity="0.5" x="150.757" y="71" width="65.3067" height="8" rx="4" fill="#73C991" />
      <rect opacity="0.5" x="222" y="71" width="159" height="8" rx="4" fill="#73C991" />
    </g>
  </g>
  <defs>
    <filter id="filter0_d_1724_12223" x="0" y="22" width="208" height="284" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
      <feOffset dy="2" />
      <feGaussianBlur stdDeviation="4" />
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" />
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1724_12223" />
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1724_12223" result="shape" />
    </filter>
    <filter id="filter1_d_1724_12223" x="115" y="0" width="411" height="328" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
      <feOffset dy="2" />
      <feGaussianBlur stdDeviation="8" />
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.36 0" />
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1724_12223" />
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1724_12223" result="shape" />
    </filter>
    <clipPath id="clip0_1724_12223">
      <rect width="103" height="35" fill="#FFFFFF" transform="translate(131 14)" />
    </clipPath>
  </defs>
</svg>
```

--------------------------------------------------------------------------------

````
