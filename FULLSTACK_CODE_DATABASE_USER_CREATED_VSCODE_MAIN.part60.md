---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 60
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 60 of 552)

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

---[FILE: extensions/markdown-language-features/package.json]---
Location: vscode-main/extensions/markdown-language-features/package.json

```json
{
  "name": "markdown-language-features",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "icon": "icon.png",
  "publisher": "vscode",
  "license": "MIT",
  "aiKey": "0c6ae279ed8443289764825290e4f9e2-1a736e7c-1324-4338-be46-fc2a58ae4d14-7255",
  "engines": {
    "vscode": "^1.70.0"
  },
  "main": "./out/extension",
  "browser": "./dist/browser/extension",
  "categories": [
    "Programming Languages"
  ],
  "activationEvents": [
    "onLanguage:markdown",
    "onLanguage:prompt",
    "onLanguage:instructions",
    "onLanguage:chatmode",
    "onCommand:markdown.api.render",
    "onCommand:markdown.api.reloadPlugins",
    "onWebviewPanel:markdown.preview"
  ],
  "capabilities": {
    "virtualWorkspaces": true,
    "untrustedWorkspaces": {
      "supported": "limited",
      "description": "%workspaceTrust%",
      "restrictedConfigurations": [
        "markdown.styles"
      ]
    }
  },
  "contributes": {
    "notebookRenderer": [
      {
        "id": "vscode.markdown-it-renderer",
        "displayName": "Markdown it renderer",
        "entrypoint": "./notebook-out/index.js",
        "mimeTypes": [
          "text/markdown",
          "text/latex",
          "text/x-css",
          "text/x-html",
          "text/x-json",
          "text/x-typescript",
          "text/x-abap",
          "text/x-apex",
          "text/x-azcli",
          "text/x-bat",
          "text/x-cameligo",
          "text/x-clojure",
          "text/x-coffee",
          "text/x-cpp",
          "text/x-csharp",
          "text/x-csp",
          "text/x-css",
          "text/x-dart",
          "text/x-dockerfile",
          "text/x-ecl",
          "text/x-fsharp",
          "text/x-go",
          "text/x-graphql",
          "text/x-handlebars",
          "text/x-hcl",
          "text/x-html",
          "text/x-ini",
          "text/x-java",
          "text/x-javascript",
          "text/x-julia",
          "text/x-kotlin",
          "text/x-less",
          "text/x-lexon",
          "text/x-lua",
          "text/x-m3",
          "text/x-markdown",
          "text/x-mips",
          "text/x-msdax",
          "text/x-mysql",
          "text/x-objective-c/objective",
          "text/x-pascal",
          "text/x-pascaligo",
          "text/x-perl",
          "text/x-pgsql",
          "text/x-php",
          "text/x-postiats",
          "text/x-powerquery",
          "text/x-powershell",
          "text/x-pug",
          "text/x-python",
          "text/x-r",
          "text/x-razor",
          "text/x-redis",
          "text/x-redshift",
          "text/x-restructuredtext",
          "text/x-ruby",
          "text/x-rust",
          "text/x-sb",
          "text/x-scala",
          "text/x-scheme",
          "text/x-scss",
          "text/x-shell",
          "text/x-solidity",
          "text/x-sophia",
          "text/x-sql",
          "text/x-st",
          "text/x-swift",
          "text/x-systemverilog",
          "text/x-tcl",
          "text/x-twig",
          "text/x-typescript",
          "text/x-vb",
          "text/x-xml",
          "text/x-yaml",
          "application/json"
        ]
      }
    ],
    "commands": [
      {
        "command": "_markdown.copyImage",
        "title": "%markdown.copyImage.title%",
        "category": "Markdown"
      },
      {
        "command": "_markdown.openImage",
        "title": "%markdown.openImage.title%",
        "category": "Markdown"
      },
      {
        "command": "markdown.showPreview",
        "title": "%markdown.preview.title%",
        "category": "Markdown",
        "icon": {
          "light": "./media/preview-light.svg",
          "dark": "./media/preview-dark.svg"
        }
      },
      {
        "command": "markdown.showPreviewToSide",
        "title": "%markdown.previewSide.title%",
        "category": "Markdown",
        "icon": "$(open-preview)"
      },
      {
        "command": "markdown.showLockedPreviewToSide",
        "title": "%markdown.showLockedPreviewToSide.title%",
        "category": "Markdown",
        "icon": "$(open-preview)"
      },
      {
        "command": "markdown.showSource",
        "title": "%markdown.showSource.title%",
        "category": "Markdown",
        "icon": "$(go-to-file)"
      },
      {
        "command": "markdown.showPreviewSecuritySelector",
        "title": "%markdown.showPreviewSecuritySelector.title%",
        "category": "Markdown"
      },
      {
        "command": "markdown.preview.refresh",
        "title": "%markdown.preview.refresh.title%",
        "category": "Markdown"
      },
      {
        "command": "markdown.preview.toggleLock",
        "title": "%markdown.preview.toggleLock.title%",
        "category": "Markdown"
      },
      {
        "command": "markdown.findAllFileReferences",
        "title": "%markdown.findAllFileReferences%",
        "category": "Markdown"
      },
      {
        "command": "markdown.editor.insertLinkFromWorkspace",
        "title": "%markdown.editor.insertLinkFromWorkspace%",
        "category": "Markdown",
        "enablement": "editorLangId =~ /^(markdown|prompt|instructions|chatmode)$/ && !activeEditorIsReadonly"
      },
      {
        "command": "markdown.editor.insertImageFromWorkspace",
        "title": "%markdown.editor.insertImageFromWorkspace%",
        "category": "Markdown",
        "enablement": "editorLangId =~ /^(markdown|prompt|instructions|chatmode)$/ && !activeEditorIsReadonly"
      }
    ],
    "menus": {
      "webview/context": [
        {
          "command": "_markdown.copyImage",
          "when": "webviewId == 'markdown.preview' && (webviewSection == 'image' || webviewSection == 'localImage')"
        },
        {
          "command": "_markdown.openImage",
          "when": "webviewId == 'markdown.preview' && webviewSection == 'localImage'"
        }
      ],
      "editor/title": [
        {
          "command": "markdown.showPreviewToSide",
          "when": "editorLangId =~ /^(markdown|prompt|instructions|chatmode)$/ && !notebookEditorFocused && !hasCustomMarkdownPreview",
          "alt": "markdown.showPreview",
          "group": "navigation"
        },
        {
          "command": "markdown.showSource",
          "when": "activeWebviewPanelId == 'markdown.preview' || activeCustomEditorId == 'vscode.markdown.preview.editor'",
          "group": "navigation"
        },
        {
          "command": "markdown.preview.refresh",
          "when": "activeWebviewPanelId == 'markdown.preview' || activeCustomEditorId == 'vscode.markdown.preview.editor'",
          "group": "1_markdown"
        },
        {
          "command": "markdown.preview.toggleLock",
          "when": "activeWebviewPanelId == 'markdown.preview' || activeCustomEditorId == 'vscode.markdown.preview.editor'",
          "group": "1_markdown"
        },
        {
          "command": "markdown.showPreviewSecuritySelector",
          "when": "activeWebviewPanelId == 'markdown.preview' || activeCustomEditorId == 'vscode.markdown.preview.editor'",
          "group": "1_markdown"
        }
      ],
      "explorer/context": [
        {
          "command": "markdown.showPreview",
          "when": "resourceLangId =~ /^(markdown|prompt|instructions|chatmode)$/ && !hasCustomMarkdownPreview",
          "group": "navigation"
        },
        {
          "command": "markdown.findAllFileReferences",
          "when": "resourceLangId =~ /^(markdown|prompt|instructions|chatmode)$/",
          "group": "4_search"
        }
      ],
      "editor/title/context": [
        {
          "command": "markdown.showPreview",
          "when": "resourceLangId =~ /^(markdown|prompt|instructions|chatmode)$/ && !hasCustomMarkdownPreview",
          "group": "1_open"
        },
        {
          "command": "markdown.findAllFileReferences",
          "when": "resourceLangId =~ /^(markdown|prompt|instructions|chatmode)$/"
        }
      ],
      "commandPalette": [
        {
          "command": "_markdown.openImage",
          "when": "false"
        },
        {
          "command": "_markdown.copyImage",
          "when": "false"
        },
        {
          "command": "markdown.showPreview",
          "when": "editorLangId =~ /^(markdown|prompt|instructions|chatmode)$/ && !notebookEditorFocused",
          "group": "navigation"
        },
        {
          "command": "markdown.showPreviewToSide",
          "when": "editorLangId =~ /^(markdown|prompt|instructions|chatmode)$/ && !notebookEditorFocused",
          "group": "navigation"
        },
        {
          "command": "markdown.showLockedPreviewToSide",
          "when": "editorLangId =~ /^(markdown|prompt|instructions|chatmode)$/ && !notebookEditorFocused",
          "group": "navigation"
        },
        {
          "command": "markdown.showSource",
          "when": "activeWebviewPanelId == 'markdown.preview' || activeCustomEditorId == 'vscode.markdown.preview.editor'",
          "group": "navigation"
        },
        {
          "command": "markdown.showPreviewSecuritySelector",
          "when": "editorLangId =~ /^(markdown|prompt|instructions|chatmode)$/ && !notebookEditorFocused"
        },
        {
          "command": "markdown.showPreviewSecuritySelector",
          "when": "activeWebviewPanelId == 'markdown.preview' || activeCustomEditorId == 'vscode.markdown.preview.editor'"
        },
        {
          "command": "markdown.preview.toggleLock",
          "when": "activeWebviewPanelId == 'markdown.preview' || activeCustomEditorId == 'vscode.markdown.preview.editor'"
        },
        {
          "command": "markdown.preview.refresh",
          "when": "editorLangId =~ /^(markdown|prompt|instructions|chatmode)$/ && !notebookEditorFocused"
        },
        {
          "command": "markdown.preview.refresh",
          "when": "activeWebviewPanelId == 'markdown.preview' || activeCustomEditorId == 'vscode.markdown.preview.editor'"
        },
        {
          "command": "markdown.findAllFileReferences",
          "when": "editorLangId =~ /^(markdown|prompt|instructions|chatmode)$/"
        }
      ]
    },
    "keybindings": [
      {
        "command": "markdown.showPreview",
        "key": "shift+ctrl+v",
        "mac": "shift+cmd+v",
        "when": "editorLangId =~ /^(markdown|prompt|instructions|chatmode)$/ && !notebookEditorFocused"
      },
      {
        "command": "markdown.showPreviewToSide",
        "key": "ctrl+k v",
        "mac": "cmd+k v",
        "when": "editorLangId =~ /^(markdown|prompt|instructions|chatmode)$/ && !notebookEditorFocused"
      }
    ],
    "configuration": {
      "type": "object",
      "title": "Markdown",
      "order": 20,
      "properties": {
        "markdown.styles": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "default": [],
          "description": "%markdown.styles.dec%",
          "scope": "resource"
        },
        "markdown.preview.breaks": {
          "type": "boolean",
          "default": false,
          "markdownDescription": "%markdown.preview.breaks.desc%",
          "scope": "resource"
        },
        "markdown.preview.linkify": {
          "type": "boolean",
          "default": true,
          "description": "%markdown.preview.linkify%",
          "scope": "resource"
        },
        "markdown.preview.typographer": {
          "type": "boolean",
          "default": false,
          "description": "%markdown.preview.typographer%",
          "scope": "resource"
        },
        "markdown.preview.fontFamily": {
          "type": "string",
          "default": "-apple-system, BlinkMacSystemFont, 'Segoe WPC', 'Segoe UI', system-ui, 'Ubuntu', 'Droid Sans', sans-serif",
          "description": "%markdown.preview.fontFamily.desc%",
          "scope": "resource"
        },
        "markdown.preview.fontSize": {
          "type": "number",
          "default": 14,
          "description": "%markdown.preview.fontSize.desc%",
          "scope": "resource"
        },
        "markdown.preview.lineHeight": {
          "type": "number",
          "default": 1.6,
          "description": "%markdown.preview.lineHeight.desc%",
          "scope": "resource"
        },
        "markdown.preview.scrollPreviewWithEditor": {
          "type": "boolean",
          "default": true,
          "description": "%markdown.preview.scrollPreviewWithEditor.desc%",
          "scope": "resource"
        },
        "markdown.preview.markEditorSelection": {
          "type": "boolean",
          "default": true,
          "description": "%markdown.preview.markEditorSelection.desc%",
          "scope": "resource"
        },
        "markdown.preview.scrollEditorWithPreview": {
          "type": "boolean",
          "default": true,
          "description": "%markdown.preview.scrollEditorWithPreview.desc%",
          "scope": "resource"
        },
        "markdown.preview.doubleClickToSwitchToEditor": {
          "type": "boolean",
          "default": true,
          "description": "%markdown.preview.doubleClickToSwitchToEditor.desc%",
          "scope": "resource"
        },
        "markdown.preview.openMarkdownLinks": {
          "type": "string",
          "default": "inPreview",
          "description": "%configuration.markdown.preview.openMarkdownLinks.description%",
          "scope": "resource",
          "enum": [
            "inPreview",
            "inEditor"
          ],
          "enumDescriptions": [
            "%configuration.markdown.preview.openMarkdownLinks.inPreview%",
            "%configuration.markdown.preview.openMarkdownLinks.inEditor%"
          ]
        },
        "markdown.links.openLocation": {
          "type": "string",
          "default": "currentGroup",
          "description": "%configuration.markdown.links.openLocation.description%",
          "scope": "resource",
          "enum": [
            "currentGroup",
            "beside"
          ],
          "enumDescriptions": [
            "%configuration.markdown.links.openLocation.currentGroup%",
            "%configuration.markdown.links.openLocation.beside%"
          ]
        },
        "markdown.suggest.paths.enabled": {
          "type": "boolean",
          "default": true,
          "description": "%configuration.markdown.suggest.paths.enabled.description%",
          "scope": "resource"
        },
        "markdown.suggest.paths.includeWorkspaceHeaderCompletions": {
          "type": "string",
          "default": "onDoubleHash",
          "scope": "resource",
          "markdownDescription": "%configuration.markdown.suggest.paths.includeWorkspaceHeaderCompletions%",
          "enum": [
            "never",
            "onDoubleHash",
            "onSingleOrDoubleHash"
          ],
          "markdownEnumDescriptions": [
            "%configuration.markdown.suggest.paths.includeWorkspaceHeaderCompletions.never%",
            "%configuration.markdown.suggest.paths.includeWorkspaceHeaderCompletions.onDoubleHash%",
            "%configuration.markdown.suggest.paths.includeWorkspaceHeaderCompletions.onSingleOrDoubleHash%"
          ]
        },
        "markdown.trace.server": {
          "type": "string",
          "scope": "window",
          "enum": [
            "off",
            "messages",
            "verbose"
          ],
          "default": "off",
          "description": "%markdown.trace.server.desc%"
        },
        "markdown.server.log": {
          "type": "string",
          "scope": "window",
          "enum": [
            "off",
            "debug",
            "trace"
          ],
          "default": "off",
          "description": "%markdown.server.log.desc%"
        },
        "markdown.editor.drop.enabled": {
          "type": "string",
          "scope": "resource",
          "markdownDescription": "%configuration.markdown.editor.drop.enabled%",
          "default": "smart",
          "enum": [
            "always",
            "smart",
            "never"
          ],
          "markdownEnumDescriptions": [
            "%configuration.markdown.editor.drop.enabled.always%",
            "%configuration.markdown.editor.drop.enabled.smart%",
            "%configuration.markdown.editor.drop.enabled.never%"
          ]
        },
        "markdown.editor.drop.copyIntoWorkspace": {
          "type": "string",
          "markdownDescription": "%configuration.markdown.editor.drop.copyIntoWorkspace%",
          "default": "mediaFiles",
          "enum": [
            "mediaFiles",
            "never"
          ],
          "markdownEnumDescriptions": [
            "%configuration.copyIntoWorkspace.mediaFiles%",
            "%configuration.copyIntoWorkspace.never%"
          ]
        },
        "markdown.editor.filePaste.enabled": {
          "type": "string",
          "scope": "resource",
          "markdownDescription": "%configuration.markdown.editor.filePaste.enabled%",
          "default": "smart",
          "enum": [
            "always",
            "smart",
            "never"
          ],
          "markdownEnumDescriptions": [
            "%configuration.markdown.editor.filePaste.enabled.always%",
            "%configuration.markdown.editor.filePaste.enabled.smart%",
            "%configuration.markdown.editor.filePaste.enabled.never%"
          ]
        },
        "markdown.editor.filePaste.copyIntoWorkspace": {
          "type": "string",
          "markdownDescription": "%configuration.markdown.editor.filePaste.copyIntoWorkspace%",
          "default": "mediaFiles",
          "enum": [
            "mediaFiles",
            "never"
          ],
          "markdownEnumDescriptions": [
            "%configuration.copyIntoWorkspace.mediaFiles%",
            "%configuration.copyIntoWorkspace.never%"
          ]
        },
        "markdown.editor.filePaste.videoSnippet": {
          "type": "string",
          "markdownDescription": "%configuration.markdown.editor.filePaste.videoSnippet%",
          "default": "<video controls src=\"${src}\" title=\"${title}\"></video>"
        },
        "markdown.editor.filePaste.audioSnippet": {
          "type": "string",
          "markdownDescription": "%configuration.markdown.editor.filePaste.audioSnippet%",
          "default": "<audio controls src=\"${src}\" title=\"${title}\"></audio>"
        },
        "markdown.editor.pasteUrlAsFormattedLink.enabled": {
          "type": "string",
          "scope": "resource",
          "markdownDescription": "%configuration.markdown.editor.pasteUrlAsFormattedLink.enabled%",
          "default": "smartWithSelection",
          "enum": [
            "always",
            "smart",
            "smartWithSelection",
            "never"
          ],
          "markdownEnumDescriptions": [
            "%configuration.pasteUrlAsFormattedLink.always%",
            "%configuration.pasteUrlAsFormattedLink.smart%",
            "%configuration.pasteUrlAsFormattedLink.smartWithSelection%",
            "%configuration.pasteUrlAsFormattedLink.never%"
          ]
        },
        "markdown.validate.enabled": {
          "type": "boolean",
          "scope": "resource",
          "description": "%configuration.markdown.validate.enabled.description%",
          "default": false
        },
        "markdown.validate.referenceLinks.enabled": {
          "type": "string",
          "scope": "resource",
          "markdownDescription": "%configuration.markdown.validate.referenceLinks.enabled.description%",
          "default": "warning",
          "enum": [
            "ignore",
            "warning",
            "error"
          ]
        },
        "markdown.validate.fragmentLinks.enabled": {
          "type": "string",
          "scope": "resource",
          "markdownDescription": "%configuration.markdown.validate.fragmentLinks.enabled.description%",
          "default": "warning",
          "enum": [
            "ignore",
            "warning",
            "error"
          ]
        },
        "markdown.validate.fileLinks.enabled": {
          "type": "string",
          "scope": "resource",
          "markdownDescription": "%configuration.markdown.validate.fileLinks.enabled.description%",
          "default": "warning",
          "enum": [
            "ignore",
            "warning",
            "error"
          ]
        },
        "markdown.validate.fileLinks.markdownFragmentLinks": {
          "type": "string",
          "scope": "resource",
          "markdownDescription": "%configuration.markdown.validate.fileLinks.markdownFragmentLinks.description%",
          "default": "inherit",
          "enum": [
            "inherit",
            "ignore",
            "warning",
            "error"
          ]
        },
        "markdown.validate.ignoredLinks": {
          "type": "array",
          "scope": "resource",
          "markdownDescription": "%configuration.markdown.validate.ignoredLinks.description%",
          "items": {
            "type": "string"
          }
        },
        "markdown.validate.unusedLinkDefinitions.enabled": {
          "type": "string",
          "scope": "resource",
          "markdownDescription": "%configuration.markdown.validate.unusedLinkDefinitions.description%",
          "default": "hint",
          "enum": [
            "ignore",
            "hint",
            "warning",
            "error"
          ]
        },
        "markdown.validate.duplicateLinkDefinitions.enabled": {
          "type": "string",
          "scope": "resource",
          "markdownDescription": "%configuration.markdown.validate.duplicateLinkDefinitions.description%",
          "default": "warning",
          "enum": [
            "ignore",
            "warning",
            "error"
          ]
        },
        "markdown.updateLinksOnFileMove.enabled": {
          "type": "string",
          "enum": [
            "prompt",
            "always",
            "never"
          ],
          "markdownEnumDescriptions": [
            "%configuration.markdown.updateLinksOnFileMove.enabled.prompt%",
            "%configuration.markdown.updateLinksOnFileMove.enabled.always%",
            "%configuration.markdown.updateLinksOnFileMove.enabled.never%"
          ],
          "default": "never",
          "markdownDescription": "%configuration.markdown.updateLinksOnFileMove.enabled%",
          "scope": "window"
        },
        "markdown.updateLinksOnFileMove.include": {
          "type": "array",
          "markdownDescription": "%configuration.markdown.updateLinksOnFileMove.include%",
          "scope": "window",
          "items": {
            "type": "string",
            "description": "%configuration.markdown.updateLinksOnFileMove.include.property%"
          },
          "default": [
            "**/*.{md,mkd,mdwn,mdown,markdown,markdn,mdtxt,mdtext,workbook}",
            "**/*.{jpg,jpe,jpeg,png,bmp,gif,ico,webp,avif,tiff,svg,mp4}"
          ]
        },
        "markdown.updateLinksOnFileMove.enableForDirectories": {
          "type": "boolean",
          "default": true,
          "description": "%configuration.markdown.updateLinksOnFileMove.enableForDirectories%",
          "scope": "window"
        },
        "markdown.occurrencesHighlight.enabled": {
          "type": "boolean",
          "default": false,
          "description": "%configuration.markdown.occurrencesHighlight.enabled%",
          "scope": "resource"
        },
        "markdown.copyFiles.destination": {
          "type": "object",
          "markdownDescription": "%configuration.markdown.copyFiles.destination%",
          "additionalProperties": {
            "type": "string"
          }
        },
        "markdown.copyFiles.overwriteBehavior": {
          "type": "string",
          "markdownDescription": "%configuration.markdown.copyFiles.overwriteBehavior%",
          "default": "nameIncrementally",
          "enum": [
            "nameIncrementally",
            "overwrite"
          ],
          "markdownEnumDescriptions": [
            "%configuration.markdown.copyFiles.overwriteBehavior.nameIncrementally%",
            "%configuration.markdown.copyFiles.overwriteBehavior.overwrite%"
          ]
        },
        "markdown.preferredMdPathExtensionStyle": {
          "type": "string",
          "default": "auto",
          "markdownDescription": "%configuration.markdown.preferredMdPathExtensionStyle%",
          "enum": [
            "auto",
            "includeExtension",
            "removeExtension"
          ],
          "markdownEnumDescriptions": [
            "%configuration.markdown.preferredMdPathExtensionStyle.auto%",
            "%configuration.markdown.preferredMdPathExtensionStyle.includeExtension%",
            "%configuration.markdown.preferredMdPathExtensionStyle.removeExtension%"
          ]
        },
        "markdown.editor.updateLinksOnPaste.enabled": {
          "type": "boolean",
          "markdownDescription": "%configuration.markdown.editor.updateLinksOnPaste.enabled%",
          "scope": "resource",
          "default": true
        }
      }
    },
    "configurationDefaults": {
      "[markdown]": {
        "editor.wordWrap": "on",
        "editor.quickSuggestions": {
          "comments": "off",
          "strings": "off",
          "other": "off"
        }
      }
    },
    "jsonValidation": [
      {
        "fileMatch": "package.json",
        "url": "./schemas/package.schema.json"
      }
    ],
    "markdown.previewStyles": [
      "./media/markdown.css",
      "./media/highlight.css"
    ],
    "markdown.previewScripts": [
      "./media/index.js"
    ],
    "customEditors": [
      {
        "viewType": "vscode.markdown.preview.editor",
        "displayName": "Markdown Preview",
        "priority": "option",
        "selector": [
          {
            "filenamePattern": "*.md"
          }
        ]
      }
    ]
  },
  "scripts": {
    "compile": "gulp compile-extension:markdown-language-features-languageService && gulp compile-extension:markdown-language-features && npm run build-preview && npm run build-notebook",
    "watch": "npm run build-preview && gulp watch-extension:markdown-language-features watch-extension:markdown-language-features-languageService",
    "vscode:prepublish": "npm run build-ext && npm run build-preview",
    "build-ext": "node ../../node_modules/gulp/bin/gulp.js --gulpfile ../../build/gulpfile.extensions.mjs compile-extension:markdown-language-features ./tsconfig.json",
    "build-notebook": "node ./esbuild-notebook.mjs",
    "build-preview": "node ./esbuild-preview.mjs",
    "compile-web": "npx webpack-cli --config extension-browser.webpack.config --mode none",
    "watch-web": "npx webpack-cli --config extension-browser.webpack.config --mode none --watch"
  },
  "dependencies": {
    "@vscode/extension-telemetry": "^0.9.8",
    "dompurify": "^3.2.7",
    "highlight.js": "^11.8.0",
    "markdown-it": "^12.3.2",
    "markdown-it-front-matter": "^0.2.4",
    "morphdom": "^2.7.4",
    "picomatch": "^2.3.1",
    "punycode": "^2.3.1",
    "vscode-languageclient": "^8.0.2",
    "vscode-languageserver-textdocument": "^1.0.11",
    "vscode-markdown-languageserver": "^0.5.0-alpha.12",
    "vscode-uri": "^3.0.3"
  },
  "devDependencies": {
    "@types/dompurify": "^3.0.5",
    "@types/lodash.throttle": "^4.1.9",
    "@types/markdown-it": "12.2.3",
    "@types/node": "22.x",
    "@types/picomatch": "^2.3.0",
    "@types/vscode-notebook-renderer": "^1.60.0",
    "@types/vscode-webview": "^1.57.0",
    "@vscode/markdown-it-katex": "^1.1.1",
    "lodash.throttle": "^4.1.1",
    "vscode-languageserver-types": "^3.17.2",
    "vscode-markdown-languageservice": "^0.3.0-alpha.3"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/package.nls.json]---
Location: vscode-main/extensions/markdown-language-features/package.nls.json

```json
{
	"displayName": "Markdown Language Features",
	"description": "Provides rich language support for Markdown.",
	"markdown.copyImage.title": "Copy Image",
	"markdown.openImage.title": "Open Image",
	"markdown.preview.breaks.desc": "Sets how line-breaks are rendered in the Markdown preview. Setting it to `true` creates a `<br>` for newlines inside paragraphs.",
	"markdown.preview.linkify": "Convert URL-like text to links in the Markdown preview.",
	"markdown.preview.typographer": "Enable some language-neutral replacement and quotes beautification in the Markdown preview.",
	"markdown.preview.doubleClickToSwitchToEditor.desc": "Double-click in the Markdown preview to switch to the editor.",
	"markdown.preview.fontFamily.desc": "Controls the font family used in the Markdown preview.",
	"markdown.preview.fontSize.desc": "Controls the font size in pixels used in the Markdown preview.",
	"markdown.preview.lineHeight.desc": "Controls the line height used in the Markdown preview. This number is relative to the font size.",
	"markdown.preview.markEditorSelection.desc": "Mark the current editor selection in the Markdown preview.",
	"markdown.preview.scrollEditorWithPreview.desc": "When a Markdown preview is scrolled, update the view of the editor.",
	"markdown.preview.scrollPreviewWithEditor.desc": "When a Markdown editor is scrolled, update the view of the preview.",
	"markdown.preview.title": "Open Preview",
	"markdown.previewSide.title": "Open Preview to the Side",
	"markdown.showLockedPreviewToSide.title": "Open Locked Preview to the Side",
	"markdown.showSource.title": "Show Source",
	"markdown.styles.dec": "A list of URLs or local paths to CSS style sheets to use from the Markdown preview. Relative paths are interpreted relative to the folder open in the Explorer. If there is no open folder, they are interpreted relative to the location of the Markdown file. All '\\' need to be written as '\\\\'.",
	"markdown.showPreviewSecuritySelector.title": "Change Preview Security Settings",
	"markdown.trace.extension.desc": "Enable debug logging for the Markdown extension.",
	"markdown.trace.server.desc": "Traces the communication between VS Code and the Markdown language server.",
	"markdown.server.log.desc": "Controls the logging level of the Markdown language server.",
	"markdown.preview.refresh.title": "Refresh Preview",
	"markdown.preview.toggleLock.title": "Toggle Preview Locking",
	"markdown.findAllFileReferences": "Find File References",
	"markdown.editor.insertLinkFromWorkspace": "Insert Link to File in Workspace",
	"markdown.editor.insertImageFromWorkspace": "Insert Image from Workspace",
	"configuration.markdown.preview.openMarkdownLinks.description": "Controls how links to other Markdown files in the Markdown preview should be opened.",
	"configuration.markdown.preview.openMarkdownLinks.inEditor": "Try to open links in the editor.",
	"configuration.markdown.preview.openMarkdownLinks.inPreview": "Try to open links in the Markdown preview.",
	"configuration.markdown.links.openLocation.description": "Controls where links in Markdown files should be opened.",
	"configuration.markdown.links.openLocation.currentGroup": "Open links in the active editor group.",
	"configuration.markdown.links.openLocation.beside": "Open links beside the active editor.",
	"configuration.markdown.suggest.paths.enabled.description": "Enable path suggestions while writing links in Markdown files.",
	"configuration.markdown.suggest.paths.includeWorkspaceHeaderCompletions": "Enable suggestions for headers in other Markdown files in the current workspace. Accepting one of these suggestions inserts the full path to header in that file, for example: `[link text](/path/to/file.md#header)`.",
	"configuration.markdown.suggest.paths.includeWorkspaceHeaderCompletions.never": "Disable workspace header suggestions.",
	"configuration.markdown.suggest.paths.includeWorkspaceHeaderCompletions.onDoubleHash": "Enable workspace header suggestions after typing `##` in a path, for example: `[link text](##`.",
	"configuration.markdown.suggest.paths.includeWorkspaceHeaderCompletions.onSingleOrDoubleHash": "Enable workspace header suggestions after typing either `##` or `#` in a path, for example: `[link text](#` or `[link text](##`.",
	"configuration.markdown.editor.drop.enabled": "Enable dropping files into a Markdown editor while holding Shift. Requires enabling `#editor.dropIntoEditor.enabled#`.",
	"configuration.markdown.editor.drop.enabled.always": "Always insert Markdown links.",
	"configuration.markdown.editor.drop.enabled.smart": "Smartly create Markdown links by default when not dropping into a code block or other special element. Use the drop widget to switch between pasting as plain text or as Markdown links.",
	"configuration.markdown.editor.drop.enabled.never": "Never create Markdown links.",
	"configuration.markdown.editor.drop.copyIntoWorkspace": "Controls if files outside of the workspace that are dropped into a Markdown editor should be copied into the workspace.\n\nUse `#markdown.copyFiles.destination#` to configure where copied dropped files should be created",
	"configuration.markdown.editor.filePaste.enabled": "Enable pasting files into a Markdown editor to create Markdown links. Requires enabling `#editor.pasteAs.enabled#`.",
	"configuration.markdown.editor.filePaste.enabled.always": "Always insert Markdown links.",
	"configuration.markdown.editor.filePaste.enabled.smart": "Smartly create Markdown links by default when not pasting into a code block or other special element. Use the paste widget to switch between pasting as plain text or as Markdown links.",
	"configuration.markdown.editor.filePaste.enabled.never": "Never create Markdown links.",
	"configuration.markdown.editor.filePaste.copyIntoWorkspace": "Controls if files outside of the workspace that are pasted into a Markdown editor should be copied into the workspace.\n\nUse `#markdown.copyFiles.destination#` to configure where copied files should be created.",
	"configuration.copyIntoWorkspace.mediaFiles": "Try to copy external image and video files into the workspace.",
	"configuration.copyIntoWorkspace.never": "Do not copy external files into the workspace.",
	"configuration.markdown.editor.pasteUrlAsFormattedLink.enabled": "Controls if Markdown links are created when URLs are pasted into a Markdown editor. Requires enabling `#editor.pasteAs.enabled#`.",
	"configuration.pasteUrlAsFormattedLink.always": "Always insert Markdown links.",
	"configuration.pasteUrlAsFormattedLink.smart": "Smartly create Markdown links by default when not pasting into a code block or other special element. Use the paste widget to switch between pasting as plain text or as Markdown links.",
	"configuration.pasteUrlAsFormattedLink.smartWithSelection": "Smartly create Markdown links by default when you have selected text and are not pasting into a code block or other special element. Use the paste widget to switch between pasting as plain text or as Markdown links.",
	"configuration.pasteUrlAsFormattedLink.never": "Never create Markdown links.",
	"configuration.markdown.validate.enabled.description": "Enable all error reporting in Markdown files.",
	"configuration.markdown.validate.referenceLinks.enabled.description": "Validate reference links in Markdown files, for example: `[link][ref]`. Requires enabling `#markdown.validate.enabled#`.",
	"configuration.markdown.validate.fragmentLinks.enabled.description": "Validate fragment links to headers in the current Markdown file, for example: `[link](#header)`. Requires enabling `#markdown.validate.enabled#`.",
	"configuration.markdown.validate.fileLinks.enabled.description": "Validate links to other files in Markdown files, for example `[link](/path/to/file.md)`. This checks that the target files exists. Requires enabling `#markdown.validate.enabled#`.",
	"configuration.markdown.validate.fileLinks.markdownFragmentLinks.description": "Validate the fragment part of links to headers in other files in Markdown files, for example: `[link](/path/to/file.md#header)`. Inherits the setting value from `#markdown.validate.fragmentLinks.enabled#` by default.",
	"configuration.markdown.validate.ignoredLinks.description": "Configure links that should not be validated. For example adding `/about` would not validate the link `[about](/about)`, while the glob `/assets/**/*.svg` would let you skip validation for any link to `.svg` files under the `assets` directory.",
	"configuration.markdown.validate.unusedLinkDefinitions.description": "Validate link definitions that are unused in the current file.",
	"configuration.markdown.validate.duplicateLinkDefinitions.description": "Validate duplicated definitions in the current file.",
	"configuration.markdown.updateLinksOnFileMove.enabled": "Try to update links in Markdown files when a file is renamed/moved in the workspace. Use `#markdown.updateLinksOnFileMove.include#` to configure which files trigger link updates.",
	"configuration.markdown.updateLinksOnFileMove.enabled.prompt": "Prompt on each file move.",
	"configuration.markdown.updateLinksOnFileMove.enabled.always": "Always update links automatically.",
	"configuration.markdown.updateLinksOnFileMove.enabled.never": "Never try to update link and don't prompt.",
	"configuration.markdown.updateLinksOnFileMove.include": "Glob patterns that specifies files that trigger automatic link updates. See `#markdown.updateLinksOnFileMove.enabled#` for details about this feature.",
	"configuration.markdown.updateLinksOnFileMove.include.property": "The glob pattern to match file paths against. Set to true to enable the pattern.",
	"configuration.markdown.updateLinksOnFileMove.enableForDirectories": "Enable updating links when a directory is moved or renamed in the workspace.",
	"configuration.markdown.occurrencesHighlight.enabled": "Enable highlighting link occurrences in the current document.",
	"configuration.markdown.copyFiles.destination": {
		"message": "Configures the path and file name of files created by copy/paste or drag and drop. This is a map of globs that match against a Markdown document path to the destination path where the new file should be created.\n\nThe destination path may use the following variables:\n\n- `${documentDirName}` — Absolute parent directory path of the Markdown document, e.g. `/Users/me/myProject/docs`.\n- `${documentRelativeDirName}` — Relative parent directory path of the Markdown document, e.g. `docs`. This is the same as `${documentDirName}` if the file is not part of a workspace.\n- `${documentFileName}` — The full filename of the Markdown document, e.g. `README.md`.\n- `${documentBaseName}` — The basename of the Markdown document, e.g. `README`.\n- `${documentExtName}` — The extension of the Markdown document, e.g. `md`.\n- `${documentFilePath}` — Absolute path of the Markdown document, e.g. `/Users/me/myProject/docs/README.md`.\n- `${documentRelativeFilePath}` — Relative path of the Markdown document, e.g. `docs/README.md`. This is the same as `${documentFilePath}` if the file is not part of a workspace.\n- `${documentWorkspaceFolder}` — The workspace folder for the Markdown document, e.g. `/Users/me/myProject`. This is the same as `${documentDirName}` if the file is not part of a workspace.\n- `${fileName}` — The file name of the dropped file, e.g. `image.png`.\n- `${fileExtName}` — The extension of the dropped file, e.g. `png`.\n- `${unixTime}` — The current Unix timestamp in milliseconds.\n- `${isoTime}` — The current time in ISO 8601 format, e.g. '2025-06-06T08:40:32.123Z'.",
		"comment": [
			"This setting is use the user drops or pastes image data into the editor. In this case, VS Code automatically creates a new image file in the workspace containing the dropped/pasted image.",
			"It's easier to explain this setting with an example. For example, let's say the setting value was:",
			"",
			"{ 'docs/*.md': '${documentDirName}/images/${fileName}' }",
			"",
			"Here the setting is an object mapping from a set of globs to a set of file destinations.",
			"The left hand side ('docs/*.md') is a glob that matches against a markdown document. If the glob, matches then we use the right hand side to compute the new file's path and name. The right hand side can also use the special variables document in this setting description."
		]
	},
	"configuration.markdown.copyFiles.overwriteBehavior": "Controls if files created by drop or paste should overwrite existing files.",
	"configuration.markdown.copyFiles.overwriteBehavior.nameIncrementally": "If a file with the same name already exists, append a number to the file name, for example: `image.png` becomes `image-1.png`.",
	"configuration.markdown.copyFiles.overwriteBehavior.overwrite": "If a file with the same name already exists, overwrite it.",
	"configuration.markdown.preferredMdPathExtensionStyle": "Controls if file extensions (for example `.md`) are added or not for links to Markdown files. This setting is used when file paths are added by tooling such as path completions or file renames.",
	"configuration.markdown.preferredMdPathExtensionStyle.auto": "For existing paths, try to maintain the file extension style. For new paths, add file extensions.",
	"configuration.markdown.preferredMdPathExtensionStyle.includeExtension": "Prefer including the file extension. For example, path completions to a file named `file.md` will insert `file.md`.",
	"configuration.markdown.preferredMdPathExtensionStyle.removeExtension": "Prefer removing the file extension. For example, path completions to a file named `file.md` will insert `file` without the `.md`.",
	"configuration.markdown.editor.filePaste.videoSnippet": "Snippet used when adding videos to Markdown. This snippet can use the following variables:\n- `${src}` — The resolved path of the video file.\n- `${title}` — The title used for the video. A snippet placeholder will automatically be created for this variable.",
	"configuration.markdown.editor.filePaste.audioSnippet": "Snippet used when adding audio to Markdown. This snippet can use the following variables:\n- `${src}` — The resolved path of the audio  file.\n- `${title}` — The title used for the audio. A snippet placeholder will automatically be created for this variable.",
	"configuration.markdown.editor.updateLinksOnPaste.enabled": "Enable/disable a paste option that updates links and reference in text that is copied and pasted between Markdown editors.\n\nTo use this feature, after pasting text that contains updatable links, just click on the Paste Widget and select `Paste and update pasted links`.",
	"workspaceTrust": "Required for loading styles configured in the workspace."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/README.md]---
Location: vscode-main/extensions/markdown-language-features/README.md

```markdown
# Language Features for Markdown files

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

## Features

See [Markdown in Visual Studio Code](https://code.visualstudio.com/docs/languages/markdown) to learn about the features of this extension.
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/tsconfig.browser.json]---
Location: vscode-main/extensions/markdown-language-features/tsconfig.browser.json

```json
{
	"extends": "./tsconfig.json",
	"compilerOptions": {},
	"exclude": [
		"./src/test/**"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/tsconfig.json]---
Location: vscode-main/extensions/markdown-language-features/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"typeRoots": [
			"./node_modules/@types"
		],
		"skipLibCheck": true
	},
	"include": [
		"src/**/*",
		"../../src/vscode-dts/vscode.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/media/highlight.css]---
Location: vscode-main/extensions/markdown-language-features/media/highlight.css

```css
/*
https://raw.githubusercontent.com/isagalaev/highlight.js/master/src/styles/vs2015.css
*/
/*
 * Visual Studio 2015 dark style
 * Author: Nicolas LLOBERA <nllobera@gmail.com>
 */


.hljs-keyword,
.hljs-literal,
.hljs-symbol,
.hljs-name {
	color: #569CD6;
}
.hljs-link {
	color: #569CD6;
	text-decoration: underline;
}

.hljs-built_in,
.hljs-type {
	color: #4EC9B0;
}

.hljs-number,
.hljs-class {
	color: #B8D7A3;
}

.hljs-string,
.hljs-meta-string {
	color: #D69D85;
}

.hljs-regexp,
.hljs-template-tag {
	color: #9A5334;
}

.hljs-subst,
.hljs-function,
.hljs-title,
.hljs-params,
.hljs-formula {
	color: #DCDCDC;
}

.hljs-comment,
.hljs-quote {
	color: #57A64A;
	font-style: italic;
}

.hljs-doctag {
	color: #608B4E;
}

.hljs-meta,
.hljs-meta-keyword,
.hljs-tag {
	color: #9B9B9B;
}

.hljs-variable,
.hljs-template-variable {
	color: #BD63C5;
}

.hljs-attr,
.hljs-attribute,
.hljs-builtin-name {
	color: #9CDCFE;
}

.hljs-section {
	color: gold;
}

.hljs-emphasis {
	font-style: italic;
}

.hljs-strong {
	font-weight: bold;
}

/*.hljs-code {
	font-family:'Monospace';
}*/

.hljs-bullet,
.hljs-selector-tag,
.hljs-selector-id,
.hljs-selector-class,
.hljs-selector-attr,
.hljs-selector-pseudo {
	color: #D7BA7D;
}

.hljs-addition {
	background-color: var(--vscode-diffEditor-insertedTextBackground, rgba(155, 185, 85, 0.2));
	color: rgb(155, 185, 85);
	display: inline-block;
	width: 100%;
}

.hljs-deletion {
	background: var(--vscode-diffEditor-removedTextBackground, rgba(255, 0, 0, 0.2));
	color: rgb(255, 0, 0);
	display: inline-block;
	width: 100%;
}


/*
From https://raw.githubusercontent.com/isagalaev/highlight.js/master/src/styles/vs.css
*/
/*

Visual Studio-like style based on original C# coloring by Jason Diamond <jason@diamond.name>

*/

.vscode-light .hljs-function,
.vscode-light .hljs-params,
.vscode-light .hljs-number,
.vscode-light .hljs-class  {
	color: inherit;
}

.vscode-light .hljs-comment,
.vscode-light .hljs-quote,
.vscode-light .hljs-number,
.vscode-light .hljs-class,
.vscode-light .hljs-variable {
	color: #008000;
}

.vscode-light .hljs-keyword,
.vscode-light .hljs-selector-tag,
.vscode-light .hljs-name,
.vscode-light .hljs-tag {
	color: #00f;
}

.vscode-light .hljs-built_in,
.vscode-light .hljs-builtin-name {
	color: #007acc;
}

.vscode-light .hljs-string,
.vscode-light .hljs-section,
.vscode-light .hljs-attribute,
.vscode-light .hljs-literal,
.vscode-light .hljs-template-tag,
.vscode-light .hljs-template-variable,
.vscode-light .hljs-type {
	color: #a31515;
}

.vscode-light .hljs-subst,
.vscode-light .hljs-selector-attr,
.vscode-light .hljs-selector-pseudo,
.vscode-light .hljs-meta,
.vscode-light .hljs-meta-keyword {
	color: #2b91af;
}
.vscode-light .hljs-title,
.vscode-light .hljs-doctag {
	color: #808080;
}

.vscode-light .hljs-attr {
	color: #f00;
}

.vscode-light .hljs-symbol,
.vscode-light .hljs-bullet,
.vscode-light .hljs-link {
	color: #00b0e8;
}


.vscode-light .hljs-emphasis {
	font-style: italic;
}

.vscode-light .hljs-strong {
	font-weight: bold;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/media/markdown.css]---
Location: vscode-main/extensions/markdown-language-features/media/markdown.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

html, body {
	font-family: var(--markdown-font-family, -apple-system, BlinkMacSystemFont, "Segoe WPC", "Segoe UI", system-ui, "Ubuntu", "Droid Sans", sans-serif);
	font-size: var(--markdown-font-size, 14px);
	padding: 0 26px;
	line-height: var(--markdown-line-height, 22px);
	word-wrap: break-word;
}

body {
	padding-top: 1em;
}

/* Reset margin top for elements */
h1, h2, h3, h4, h5, h6,
p, ol, ul, pre {
	margin-top: 0;
}

h1, h2, h3, h4, h5, h6 {
	font-weight: 600;
	margin-top: 24px;
	margin-bottom: 16px;
	line-height: 1.25;
}

#code-csp-warning {
	position: fixed;
	top: 0;
	right: 0;
	color: white;
	margin: 16px;
	text-align: center;
	font-size: 12px;
	font-family: sans-serif;
	background-color:#444444;
	cursor: pointer;
	padding: 6px;
	box-shadow: 1px 1px 1px rgba(0,0,0,.25);
}

#code-csp-warning:hover {
	text-decoration: none;
	background-color:#007acc;
	box-shadow: 2px 2px 2px rgba(0,0,0,.25);
}

body.scrollBeyondLastLine {
	margin-bottom: calc(100vh - 22px);
}

body.showEditorSelection .code-line {
	position: relative;
}

body.showEditorSelection :not(tr,ul,ol).code-active-line:before,
body.showEditorSelection :not(tr,ul,ol).code-line:hover:before {
	content: "";
	display: block;
	position: absolute;
	top: 0;
	left: -12px;
	height: 100%;
}

.vscode-high-contrast.showEditorSelection  :not(tr,ul,ol).code-line .code-line:hover:before {
	border-left: none;
}

body.showEditorSelection li.code-active-line:before,
body.showEditorSelection li.code-line:hover:before {
	left: -30px;
}

.vscode-light.showEditorSelection .code-active-line:before {
	border-left: 3px solid rgba(0, 0, 0, 0.15);
}

.vscode-light.showEditorSelection .code-line:hover:before {
	border-left: 3px solid rgba(0, 0, 0, 0.40);
}

.vscode-dark.showEditorSelection .code-active-line:before {
	border-left: 3px solid rgba(255, 255, 255, 0.4);
}

.vscode-dark.showEditorSelection .code-line:hover:before {
	border-left: 3px solid rgba(255, 255, 255, 0.60);
}

.vscode-high-contrast.showEditorSelection .code-active-line:before {
	border-left: 3px solid rgba(255, 160, 0, 0.7);
}

.vscode-high-contrast.showEditorSelection .code-line:hover:before {
	border-left: 3px solid rgba(255, 160, 0, 1);
}

/* Prevent `sub` and `sup` elements from affecting line height */
sub,
sup {
	line-height: 0;
}

ul ul:first-child,
ul ol:first-child,
ol ul:first-child,
ol ol:first-child {
	margin-bottom: 0;
}

img, video {
	max-width: 100%;
	max-height: 100%;
}

a {
	text-decoration: none;
}

a:hover {
	text-decoration: underline;
}

a:focus,
input:focus,
select:focus,
textarea:focus {
	outline: 1px solid -webkit-focus-ring-color;
	outline-offset: -1px;
}

p {
	margin-bottom: 16px;
}

li p {
	margin-bottom: 0.7em;
}

ul,
ol {
	margin-bottom: 0.7em;
}

hr {
	border: 0;
	height: 1px;
	border-bottom: 1px solid;
}

h1 {
	font-size: 2em;
	margin-top: 0;
	padding-bottom: 0.3em;
	border-bottom-width: 1px;
	border-bottom-style: solid;
}

h2 {
	font-size: 1.5em;
	padding-bottom: 0.3em;
	border-bottom-width: 1px;
	border-bottom-style: solid;
}

h3 {
	font-size: 1.25em;
}

h4 {
	font-size: 1em;
}

h5 {
	font-size: 0.875em;
}

h6 {
	font-size: 0.85em;
}

table {
	border-collapse: collapse;
	margin-bottom: 0.7em;
}

th {
	text-align: left;
	border-bottom: 1px solid;
}

th,
td {
	padding: 5px 10px;
}

table > tbody > tr + tr > td {
	border-top: 1px solid;
}

blockquote {
	margin: 0;
	padding: 0px 16px 0 10px;
	border-left-width: 5px;
	border-left-style: solid;
	border-radius: 2px;
}

code {
	font-family: var(--vscode-editor-font-family, "SF Mono", Monaco, Menlo, Consolas, "Ubuntu Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace);
	font-size: 1em;
	line-height: 1.357em;
}

body.wordWrap pre {
	white-space: pre-wrap;
}

pre:not(.hljs),
pre.hljs code > div {
	padding: 16px;
	border-radius: 3px;
	overflow: auto;
}

pre code {
	display: inline-block;
	color: var(--vscode-editor-foreground);
	tab-size: 4;
	background: none;
}

/** Theming */

pre {
	background-color: var(--vscode-textCodeBlock-background);
	border: 1px solid var(--vscode-widget-border);
}

.vscode-high-contrast h1 {
	border-color: rgb(0, 0, 0);
}

.vscode-light th {
	border-color: rgba(0, 0, 0, 0.69);
}

.vscode-dark th {
	border-color: rgba(255, 255, 255, 0.69);
}

.vscode-light h1,
.vscode-light h2,
.vscode-light hr,
.vscode-light td {
	border-color: rgba(0, 0, 0, 0.18);
}

.vscode-dark h1,
.vscode-dark h2,
.vscode-dark hr,
.vscode-dark td {
	border-color: rgba(255, 255, 255, 0.18);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/media/preview-dark.svg]---
Location: vscode-main/extensions/markdown-language-features/media/preview-dark.svg

```text
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2 2L1 3V13L2 14H14L15 13V3L14 2H2ZM2 13V3H14V13H2ZM12 5H4V6H12V5ZM3 4V7H13V4H3ZM7 9H3V8H7V9ZM3 12H7V11H3V12ZM12 9H10V11H12V9ZM9 8V12H13V8H9Z" fill="#C5C5C5"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/media/preview-light.svg]---
Location: vscode-main/extensions/markdown-language-features/media/preview-light.svg

```text
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2 2L1 3V13L2 14H14L15 13V3L14 2H2ZM2 13V3H14V13H2ZM12 5H4V6H12V5ZM3 4V7H13V4H3ZM7 9H3V8H7V9ZM3 12H7V11H3V12ZM12 9H10V11H12V9ZM9 8V12H13V8H9Z" fill="#424242"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/notebook/index.ts]---
Location: vscode-main/extensions/markdown-language-features/notebook/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';
import type * as MarkdownItToken from 'markdown-it/lib/token';
import type { ActivationFunction } from 'vscode-notebook-renderer';

const allowedHtmlTags = Object.freeze(['a',
	'abbr',
	'b',
	'bdo',
	'blockquote',
	'br',
	'caption',
	'cite',
	'code',
	'col',
	'colgroup',
	'dd',
	'del',
	'details',
	'dfn',
	'div',
	'dl',
	'dt',
	'em',
	'figcaption',
	'figure',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'hr',
	'i',
	'img',
	'ins',
	'kbd',
	'label',
	'li',
	'mark',
	'ol',
	'p',
	'pre',
	'q',
	'rp',
	'rt',
	'ruby',
	'samp',
	'small',
	'small',
	'source',
	'span',
	'strike',
	'strong',
	'sub',
	'summary',
	'sup',
	'table',
	'tbody',
	'td',
	'tfoot',
	'th',
	'thead',
	'time',
	'tr',
	'tt',
	'u',
	'ul',
	'var',
	'video',
	'wbr',
]);

const allowedSvgTags = Object.freeze([
	'svg',
	'a',
	'altglyph',
	'altglyphdef',
	'altglyphitem',
	'animatecolor',
	'animatemotion',
	'animatetransform',
	'circle',
	'clippath',
	'defs',
	'desc',
	'ellipse',
	'filter',
	'font',
	'g',
	'glyph',
	'glyphref',
	'hkern',
	'image',
	'line',
	'lineargradient',
	'marker',
	'mask',
	'metadata',
	'mpath',
	'path',
	'pattern',
	'polygon',
	'polyline',
	'radialgradient',
	'rect',
	'stop',
	'style',
	'switch',
	'symbol',
	'text',
	'textpath',
	'title',
	'tref',
	'tspan',
	'view',
	'vkern',
]);

const sanitizerOptions: DOMPurify.Config = {
	ALLOWED_TAGS: [
		...allowedHtmlTags,
		...allowedSvgTags,
	],
};

export const activate: ActivationFunction<void> = (ctx) => {
	const markdownIt: MarkdownIt = new MarkdownIt({
		html: true,
		linkify: true,
		highlight: (str: string, lang?: string) => {
			if (lang) {
				return `<div class="vscode-code-block" data-vscode-code-block-lang="${markdownIt.utils.escapeHtml(lang)}">${markdownIt.utils.escapeHtml(str)}</div>`;
			}
			return markdownIt.utils.escapeHtml(str);
		}
	});
	markdownIt.linkify.set({ fuzzyLink: false });

	addNamedHeaderRendering(markdownIt);
	addLinkRenderer(markdownIt);

	const style = document.createElement('style');
	style.textContent = `
		.emptyMarkdownCell::before {
			content: "${document.documentElement.style.getPropertyValue('--notebook-cell-markup-empty-content')}";
			font-style: italic;
			opacity: 0.6;
		}

		img {
			max-width: 100%;
			max-height: 100%;
		}

		a {
			text-decoration: none;
		}

		a:hover {
			text-decoration: underline;
		}

		a:focus,
		input:focus,
		select:focus,
		textarea:focus {
			outline: 1px solid -webkit-focus-ring-color;
			outline-offset: -1px;
		}

		hr {
			border: 0;
			height: 2px;
			border-bottom: 2px solid;
		}

		h2, h3, h4, h5, h6 {
			font-weight: normal;
		}

		h1 {
			font-size: 2.3em;
		}

		h2 {
			font-size: 2em;
		}

		h3 {
			font-size: 1.7em;
		}

		h3 {
			font-size: 1.5em;
		}

		h4 {
			font-size: 1.3em;
		}

		h5 {
			font-size: 1.2em;
		}

		h1,
		h2,
		h3 {
			font-weight: normal;
		}

		div {
			width: 100%;
		}

		/* Adjust margin of first item in markdown cell */
		*:first-child {
			margin-top: 0px;
		}

		/* h1 tags don't need top margin */
		h1:first-child {
			margin-top: 0;
		}

		/* Removes bottom margin when only one item exists in markdown cell */
		#preview > *:only-child,
		#preview > *:last-child {
			margin-bottom: 0;
			padding-bottom: 0;
		}

		/* makes all markdown cells consistent */
		div {
			min-height: var(--notebook-markdown-min-height);
		}

		table {
			border-collapse: collapse;
			border-spacing: 0;
		}

		table th,
		table td {
			border: 1px solid;
		}

		table > thead > tr > th {
			text-align: left;
			border-bottom: 1px solid;
		}

		table > thead > tr > th,
		table > thead > tr > td,
		table > tbody > tr > th,
		table > tbody > tr > td {
			padding: 5px 10px;
		}

		table > tbody > tr + tr > td {
			border-top: 1px solid;
		}

		blockquote {
			margin: 0 7px 0 5px;
			padding: 0 16px 0 10px;
			border-left-width: 5px;
			border-left-style: solid;
		}

		code {
			font-size: 1em;
			font-family: var(--vscode-editor-font-family);
		}

		pre code {
			line-height: 1.357em;
			white-space: pre-wrap;
			padding: 0;
		}

		li p {
			margin-bottom: 0.7em;
		}

		ul,
		ol {
			margin-bottom: 0.7em;
		}
	`;
	const template = document.createElement('template');
	template.classList.add('markdown-style');
	template.content.appendChild(style);
	document.head.appendChild(template);

	return {
		renderOutputItem: (outputInfo, element) => {
			let previewNode: HTMLElement;
			if (!element.shadowRoot) {
				const previewRoot = element.attachShadow({ mode: 'open' });

				// Insert styles into markdown preview shadow dom so that they are applied.
				// First add default webview style
				const defaultStyles = document.getElementById('_defaultStyles') as HTMLStyleElement;
				previewRoot.appendChild(defaultStyles.cloneNode(true));

				// And then contributed styles
				for (const element of document.getElementsByClassName('markdown-style')) {
					if (element instanceof HTMLTemplateElement) {
						previewRoot.appendChild(element.content.cloneNode(true));
					} else {
						previewRoot.appendChild(element.cloneNode(true));
					}
				}

				previewNode = document.createElement('div');
				previewNode.id = 'preview';
				previewRoot.appendChild(previewNode);
			} else {
				previewNode = element.shadowRoot.getElementById('preview')!;
			}

			const text = outputInfo.text();
			if (text.trim().length === 0) {
				previewNode.innerText = '';
				previewNode.classList.add('emptyMarkdownCell');
			} else {
				previewNode.classList.remove('emptyMarkdownCell');
				const markdownText = outputInfo.mime.startsWith('text/x-') ? `\`\`\`${outputInfo.mime.substr(7)}\n${text}\n\`\`\``
					: (outputInfo.mime.startsWith('application/') ? `\`\`\`${outputInfo.mime.substr(12)}\n${text}\n\`\`\`` : text);
				const unsanitizedRenderedMarkdown = markdownIt.render(markdownText, {
					outputItem: outputInfo,
				});
				previewNode.innerHTML = (ctx.workspace.isTrusted
					? unsanitizedRenderedMarkdown
					: DOMPurify.sanitize(unsanitizedRenderedMarkdown, sanitizerOptions)) as string;
			}
		},
		extendMarkdownIt: (f: (md: typeof markdownIt) => void) => {
			try {
				f(markdownIt);
			} catch (err) {
				console.error('Error extending markdown-it', err);
			}
		}
	};
};


function addNamedHeaderRendering(md: InstanceType<typeof MarkdownIt>): void {
	const slugCounter = new Map<string, number>();

	const originalHeaderOpen = md.renderer.rules.heading_open;
	md.renderer.rules.heading_open = (tokens: MarkdownItToken[], idx: number, options, env, self) => {
		const title = tokens[idx + 1].children!.reduce<string>((acc, t) => acc + t.content, '');
		let slug = slugify(title);

		if (slugCounter.has(slug)) {
			const count = slugCounter.get(slug)!;
			slugCounter.set(slug, count + 1);
			slug = slugify(slug + '-' + (count + 1));
		} else {
			slugCounter.set(slug, 0);
		}

		tokens[idx].attrSet('id', slug);

		if (originalHeaderOpen) {
			return originalHeaderOpen(tokens, idx, options, env, self);
		} else {
			return self.renderToken(tokens, idx, options);
		}
	};

	const originalRender = md.render;
	md.render = function () {
		slugCounter.clear();
		// eslint-disable-next-line local/code-no-any-casts
		return originalRender.apply(this, arguments as any);
	};
}

function addLinkRenderer(md: MarkdownIt): void {
	const original = md.renderer.rules.link_open;

	md.renderer.rules.link_open = (tokens: MarkdownItToken[], idx: number, options, env, self) => {
		const token = tokens[idx];
		const href = token.attrGet('href');
		if (typeof href === 'string' && href.startsWith('#')) {
			token.attrSet('href', '#' + slugify(href.slice(1)));
		}
		if (original) {
			return original(tokens, idx, options, env, self);
		} else {
			return self.renderToken(tokens, idx, options);
		}
	};
}

function slugify(text: string): string {
	const slugifiedHeading = encodeURI(
		text.trim()
			.toLowerCase()
			.replace(/\s+/g, '-') // Replace whitespace with -
			// allow-any-unicode-next-line
			.replace(/[\]\[\!\/\'\"\#\$\%\&\(\)\*\+\,\.\/\:\;\<\=\>\?\@\\\^\{\|\}\~\`。，、；：？！…—·ˉ¨‘’“”々～‖∶＂＇｀｜〃〔〕〈〉《》「」『』．〖〗【】（）［］｛｝]/g, '') // Remove known punctuators
			.replace(/^\-+/, '') // Remove leading -
			.replace(/\-+$/, '') // Remove trailing -
	);
	return slugifiedHeading;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/notebook/tsconfig.json]---
Location: vscode-main/extensions/markdown-language-features/notebook/tsconfig.json

```json
{
	"extends": "../../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./dist/",
		"jsx": "react",
		"module": "esnext",
		"lib": [
			"ES2024",
			"DOM",
			"DOM.Iterable"
		],
		"types": [],
		"typeRoots": [
			"../node_modules/@types"
		],
		"skipLibCheck": true
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/preview-src/activeLineMarker.ts]---
Location: vscode-main/extensions/markdown-language-features/preview-src/activeLineMarker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { getElementsForSourceLine } from './scroll-sync';

export class ActiveLineMarker {
	private _current: any;

	onDidChangeTextEditorSelection(line: number, documentVersion: number) {
		const { previous } = getElementsForSourceLine(line, documentVersion);
		this._update(previous && (previous.codeElement || previous.element));
	}

	private _update(before: HTMLElement | undefined) {
		this._unmarkActiveElement(this._current);
		this._markActiveElement(before);
		this._current = before;
	}

	private _unmarkActiveElement(element: HTMLElement | undefined) {
		if (!element) {
			return;
		}
		element.classList.toggle('code-active-line', false);
	}

	private _markActiveElement(element: HTMLElement | undefined) {
		if (!element) {
			return;
		}

		element.classList.toggle('code-active-line', true);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/preview-src/csp.ts]---
Location: vscode-main/extensions/markdown-language-features/preview-src/csp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MessagePoster } from './messaging';
import { SettingsManager } from './settings';
import { getStrings } from './strings';

/**
 * Shows an alert when there is a content security policy violation.
 */
export class CspAlerter {
	private _didShow = false;
	private _didHaveCspWarning = false;

	private _messaging?: MessagePoster;

	constructor(
		private readonly _settingsManager: SettingsManager,
	) {
		document.addEventListener('securitypolicyviolation', () => {
			this._onCspWarning();
		});

		window.addEventListener('message', (event) => {
			if (event?.data && event.data.name === 'vscode-did-block-svg') {
				this._onCspWarning();
			}
		});
	}

	public setPoster(poster: MessagePoster) {
		this._messaging = poster;
		if (this._didHaveCspWarning) {
			this._showCspWarning();
		}
	}

	private _onCspWarning() {
		this._didHaveCspWarning = true;
		this._showCspWarning();
	}

	private _showCspWarning() {
		const strings = getStrings();
		const settings = this._settingsManager.settings;

		if (this._didShow || settings.disableSecurityWarnings || !this._messaging) {
			return;
		}
		this._didShow = true;

		const notification = document.createElement('a');
		notification.innerText = strings.cspAlertMessageText;
		notification.setAttribute('id', 'code-csp-warning');
		notification.setAttribute('title', strings.cspAlertMessageTitle);

		notification.setAttribute('role', 'button');
		notification.setAttribute('aria-label', strings.cspAlertMessageLabel);
		notification.onclick = () => {
			this._messaging!.postMessage('showPreviewSecuritySelector', { source: settings.source });
		};
		document.body.appendChild(notification);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/preview-src/events.ts]---
Location: vscode-main/extensions/markdown-language-features/preview-src/events.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function onceDocumentLoaded(f: () => void) {
	if (document.readyState === 'loading' || document.readyState as string === 'uninitialized') {
		document.addEventListener('DOMContentLoaded', f);
	} else {
		f();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/preview-src/index.ts]---
Location: vscode-main/extensions/markdown-language-features/preview-src/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ActiveLineMarker } from './activeLineMarker';
import { onceDocumentLoaded } from './events';
import { createPosterForVsCode } from './messaging';
import { getEditorLineNumberForPageOffset, scrollToRevealSourceLine, getLineElementForFragment } from './scroll-sync';
import { SettingsManager, getData, getRawData } from './settings';
import throttle = require('lodash.throttle');
import morphdom from 'morphdom';
import type { ToWebviewMessage } from '../types/previewMessaging';
import { isOfScheme, Schemes } from '../src/util/schemes';

let scrollDisabledCount = 0;

const marker = new ActiveLineMarker();
const settings = new SettingsManager();

let documentVersion = 0;
let documentResource = settings.settings.source;

const vscode = acquireVsCodeApi();

// eslint-disable-next-line local/code-no-any-casts
const originalState = vscode.getState() ?? {} as any;
const state = {
	...originalState,
	...getData<any>('data-state')
};

if (typeof originalState.scrollProgress !== 'undefined' && originalState?.resource !== state.resource) {
	state.scrollProgress = 0;
}

// Make sure to sync VS Code state here
vscode.setState(state);

const messaging = createPosterForVsCode(vscode, settings);

window.cspAlerter.setPoster(messaging);
window.styleLoadingMonitor.setPoster(messaging);


function doAfterImagesLoaded(cb: () => void) {
	const imgElements = document.getElementsByTagName('img');
	if (imgElements.length > 0) {
		const ps = Array.from(imgElements, e => {
			if (e.complete) {
				return Promise.resolve();
			} else {
				return new Promise<void>((resolve) => {
					e.addEventListener('load', () => resolve());
					e.addEventListener('error', () => resolve());
				});
			}
		});
		Promise.all(ps).then(() => setTimeout(cb, 0));
	} else {
		setTimeout(cb, 0);
	}
}

onceDocumentLoaded(() => {
	// Load initial html
	const htmlParser = new DOMParser();
	const markDownHtml = htmlParser.parseFromString(
		getRawData('data-initial-md-content'),
		'text/html'
	);

	const newElements = [...markDownHtml.body.children];
	document.body.append(...newElements);
	for (const el of newElements) {
		if (el instanceof HTMLElement) {
			domEval(el);
		}
	}

	// Restore
	const scrollProgress = state.scrollProgress;
	addImageContexts();
	if (typeof scrollProgress === 'number' && !settings.settings.fragment) {
		doAfterImagesLoaded(() => {
			scrollDisabledCount += 1;
			// Always set scroll of at least 1 to prevent VS Code's webview code from auto scrolling us
			const scrollToY = Math.max(1, scrollProgress * document.body.clientHeight);
			window.scrollTo(0, scrollToY);
		});
		return;
	}

	if (settings.settings.scrollPreviewWithEditor) {
		doAfterImagesLoaded(() => {
			// Try to scroll to fragment if available
			if (settings.settings.fragment) {
				let fragment: string;
				try {
					fragment = encodeURIComponent(settings.settings.fragment);
				} catch {
					fragment = settings.settings.fragment;
				}
				state.fragment = undefined;
				vscode.setState(state);

				const element = getLineElementForFragment(fragment, documentVersion);
				if (element) {
					scrollDisabledCount += 1;
					scrollToRevealSourceLine(element.line, documentVersion, settings);
				}
			} else {
				if (!isNaN(settings.settings.line!)) {
					scrollDisabledCount += 1;
					scrollToRevealSourceLine(settings.settings.line!, documentVersion, settings);
				}
			}
		});
	}

	if (typeof settings.settings.selectedLine === 'number') {
		marker.onDidChangeTextEditorSelection(settings.settings.selectedLine, documentVersion);
	}
});

const onUpdateView = (() => {
	const doScroll = throttle((line: number) => {
		scrollDisabledCount += 1;
		doAfterImagesLoaded(() => scrollToRevealSourceLine(line, documentVersion, settings));
	}, 50);

	return (line: number) => {
		if (!isNaN(line)) {
			state.line = line;

			doScroll(line);
		}
	};
})();

window.addEventListener('resize', () => {
	scrollDisabledCount += 1;
	updateScrollProgress();
}, true);

function addImageContexts() {
	const images = document.getElementsByTagName('img');
	let idNumber = 0;
	for (const img of images) {
		img.id = 'image-' + idNumber;
		idNumber += 1;
		const imageSource = img.getAttribute('data-src');
		const isLocalFile = imageSource && !(isOfScheme(Schemes.http, imageSource) || isOfScheme(Schemes.https, imageSource));
		const webviewSection = isLocalFile ? 'localImage' : 'image';
		img.setAttribute('data-vscode-context', JSON.stringify({ webviewSection, id: img.id, 'preventDefaultContextMenuItems': true, resource: documentResource, imageSource }));
	}
}

async function copyImage(image: HTMLImageElement, retries = 5) {
	if (!document.hasFocus() && retries > 0) {
		// copyImage is called at the same time as webview.reveal, which means this function is running whilst the webview is gaining focus.
		// Since navigator.clipboard.write requires the document to be focused, we need to wait for focus.
		// We cannot use a listener, as there is a high chance the focus is gained during the setup of the listener resulting in us missing it.
		setTimeout(() => { copyImage(image, retries - 1); }, 20);
		return;
	}

	try {
		await navigator.clipboard.write([new ClipboardItem({
			'image/png': new Promise((resolve) => {
				const canvas = document.createElement('canvas');
				if (canvas !== null) {
					canvas.width = image.naturalWidth;
					canvas.height = image.naturalHeight;
					const context = canvas.getContext('2d');
					context?.drawImage(image, 0, 0);
				}
				canvas.toBlob((blob) => {
					if (blob) {
						resolve(blob);
					}
					canvas.remove();
				}, 'image/png');
			})
		})]);
	} catch (e) {
		console.error(e);
		const selection = window.getSelection();
		if (!selection) {
			await navigator.clipboard.writeText(image.getAttribute('data-src') ?? image.src);
			return;
		}
		selection.removeAllRanges();
		const range = document.createRange();
		range.selectNode(image);
		selection.addRange(range);
		document.execCommand('copy');
		selection.removeAllRanges();
	}
}

window.addEventListener('message', async event => {
	const data = event.data as ToWebviewMessage.Type;
	switch (data.type) {
		case 'copyImage': {
			const img = document.getElementById(data.id);
			if (img instanceof HTMLImageElement) {
				copyImage(img);
			}
			return;
		}
		case 'onDidChangeTextEditorSelection':
			if (data.source === documentResource) {
				marker.onDidChangeTextEditorSelection(data.line, documentVersion);
			}
			return;

		case 'updateView':
			if (data.source === documentResource) {
				onUpdateView(data.line);
			}
			return;

		case 'updateContent': {
			const root = document.querySelector('.markdown-body')!;

			const parser = new DOMParser();
			const newContent = parser.parseFromString(data.content, 'text/html'); // CodeQL [SM03712] This renderers content from the workspace into the Markdown preview. Webviews (and the markdown preview) have many other security measures in place to make this safe

			// Strip out meta http-equiv tags
			for (const metaElement of Array.from(newContent.querySelectorAll('meta'))) {
				if (metaElement.hasAttribute('http-equiv')) {
					metaElement.remove();
				}
			}

			if (data.source !== documentResource) {
				documentResource = data.source;
				const newBody = newContent.querySelector('.markdown-body')!;
				root.replaceWith(newBody);
				domEval(newBody);
			} else {
				const newRoot = newContent.querySelector('.markdown-body')!;

				// Move styles to head
				// This prevents an ugly flash of unstyled content
				const styles = newRoot.querySelectorAll('link');
				for (const style of styles) {
					style.remove();
				}
				newRoot.prepend(...styles);

				// eslint-disable-next-line local/code-no-any-casts
				morphdom(root, newRoot, {
					childrenOnly: true,
					onBeforeElUpdated: (fromEl: Element, toEl: Element) => {
						if (areNodesEqual(fromEl, toEl)) {
							// areEqual doesn't look at `data-line` so copy those over manually
							const fromLines = fromEl.querySelectorAll('[data-line]');
							const toLines = toEl.querySelectorAll('[data-line]');
							if (fromLines.length !== toLines.length) {
								console.log('unexpected line number change');
							}

							for (let i = 0; i < fromLines.length; ++i) {
								const fromChild = fromLines[i];
								const toChild = toLines[i];
								if (toChild) {
									fromChild.setAttribute('data-line', toChild.getAttribute('data-line')!);
								}
							}

							return false;
						}

						if (fromEl.tagName === 'DETAILS' && toEl.tagName === 'DETAILS') {
							if (fromEl.hasAttribute('open')) {
								toEl.setAttribute('open', '');
							}
						}

						return true;
					},
					addChild: (parentNode: Node, childNode: Node) => {
						parentNode.appendChild(childNode);
						if (childNode instanceof HTMLElement) {
							domEval(childNode);
						}
					}
				} as any);
			}

			++documentVersion;

			window.dispatchEvent(new CustomEvent('vscode.markdown.updateContent'));
			addImageContexts();
			break;
		}
	}
}, false);



document.addEventListener('dblclick', event => {
	if (!settings.settings.doubleClickToSwitchToEditor) {
		return;
	}

	// Disable double-click to switch editor for .copilotmd files
	if (documentResource.endsWith('.copilotmd')) {
		return;
	}

	// Ignore clicks on links
	for (let node = event.target as HTMLElement; node; node = node.parentNode as HTMLElement) {
		if (node.tagName === 'A') {
			return;
		}
	}

	const offset = event.pageY;
	const line = getEditorLineNumberForPageOffset(offset, documentVersion);
	if (typeof line === 'number' && !isNaN(line)) {
		messaging.postMessage('didClick', { line: Math.floor(line) });
	}
});

const passThroughLinkSchemes = ['http:', 'https:', 'mailto:', 'vscode:', 'vscode-insiders:'];

document.addEventListener('click', event => {
	if (!event) {
		return;
	}

	let node: any = event.target;
	while (node) {
		if (node.tagName && node.tagName === 'A' && node.href) {
			if (node.getAttribute('href').startsWith('#')) {
				return;
			}

			let hrefText = node.getAttribute('data-href');
			if (!hrefText) {
				hrefText = node.getAttribute('href');
				// Pass through known schemes
				if (passThroughLinkSchemes.some(scheme => hrefText.startsWith(scheme))) {
					return;
				}
			}

			// If original link doesn't look like a url, delegate back to VS Code to resolve
			if (!/^[a-z\-]+:/i.test(hrefText)) {
				messaging.postMessage('openLink', { href: hrefText });
				event.preventDefault();
				event.stopPropagation();
				return;
			}

			return;
		}
		node = node.parentNode;
	}
}, true);

window.addEventListener('scroll', throttle(() => {
	updateScrollProgress();

	if (scrollDisabledCount > 0) {
		scrollDisabledCount -= 1;
	} else {
		const line = getEditorLineNumberForPageOffset(window.scrollY, documentVersion);
		if (typeof line === 'number' && !isNaN(line)) {
			messaging.postMessage('revealLine', { line });
		}
	}
}, 50));

function updateScrollProgress() {
	state.scrollProgress = window.scrollY / document.body.clientHeight;
	vscode.setState(state);
}


/**
 * Compares two nodes for morphdom to see if they are equal.
 *
 * This skips some attributes that should not cause equality to fail.
 */
function areNodesEqual(a: Element, b: Element): boolean {
	const skippedAttrs = [
		'open', // for details
	];

	if (a.isEqualNode(b)) {
		return true;
	}

	if (a.tagName !== b.tagName || a.textContent !== b.textContent) {
		return false;
	}

	const aAttrs = [...a.attributes].filter(attr => !skippedAttrs.includes(attr.name));
	const bAttrs = [...b.attributes].filter(attr => !skippedAttrs.includes(attr.name));
	if (aAttrs.length !== bAttrs.length) {
		return false;
	}

	for (let i = 0; i < aAttrs.length; ++i) {
		const aAttr = aAttrs[i];
		const bAttr = bAttrs[i];
		if (aAttr.name !== bAttr.name) {
			return false;
		}
		if (aAttr.value !== bAttr.value && aAttr.name !== 'data-line') {
			return false;
		}
	}

	const aChildren = Array.from(a.children);
	const bChildren = Array.from(b.children);

	return aChildren.length === bChildren.length && aChildren.every((x, i) => areNodesEqual(x, bChildren[i]));
}


function domEval(el: Element): void {
	const preservedScriptAttributes: (keyof HTMLScriptElement)[] = [
		'type', 'src', 'nonce', 'noModule', 'async',
	];

	const scriptNodes = el.tagName === 'SCRIPT' ? [el] : Array.from(el.getElementsByTagName('script'));

	for (const node of scriptNodes) {
		if (!(node instanceof HTMLElement)) {
			continue;
		}

		const scriptTag = document.createElement('script');
		const trustedScript = node.innerText;
		scriptTag.text = trustedScript as string;
		for (const key of preservedScriptAttributes) {
			const val = node.getAttribute?.(key);
			if (val) {
				// eslint-disable-next-line local/code-no-any-casts
				scriptTag.setAttribute(key, val as any);
			}
		}

		node.insertAdjacentElement('afterend', scriptTag);
		node.remove();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/preview-src/loading.ts]---
Location: vscode-main/extensions/markdown-language-features/preview-src/loading.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MessagePoster } from './messaging';

export class StyleLoadingMonitor {
	private readonly _unloadedStyles: string[] = [];
	private _finishedLoading: boolean = false;

	private _poster?: MessagePoster;

	constructor() {
		const onStyleLoadError = (event: any) => {
			const source = event.target.dataset.source;
			this._unloadedStyles.push(source);
		};

		window.addEventListener('DOMContentLoaded', () => {
			for (const link of document.getElementsByClassName('code-user-style') as HTMLCollectionOf<HTMLElement>) {
				if (link.dataset.source) {
					link.onerror = onStyleLoadError;
				}
			}
		});

		window.addEventListener('load', () => {
			if (!this._unloadedStyles.length) {
				return;
			}
			this._finishedLoading = true;
			this._poster?.postMessage('previewStyleLoadError', { unloadedStyles: this._unloadedStyles });
		});
	}

	public setPoster(poster: MessagePoster): void {
		this._poster = poster;
		if (this._finishedLoading) {
			poster.postMessage('previewStyleLoadError', { unloadedStyles: this._unloadedStyles });
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/preview-src/messaging.ts]---
Location: vscode-main/extensions/markdown-language-features/preview-src/messaging.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SettingsManager } from './settings';
import type { FromWebviewMessage } from '../types/previewMessaging';

export interface MessagePoster {
	/**
	 * Post a message to the markdown extension
	 */
	postMessage<T extends FromWebviewMessage.Type>(
		type: T['type'],
		body: Omit<T, 'source' | 'type'>
	): void;
}

export const createPosterForVsCode = (vscode: any, settingsManager: SettingsManager): MessagePoster => {
	return {
		postMessage<T extends FromWebviewMessage.Type>(
			type: T['type'],
			body: Omit<T, 'source' | 'type'>
		): void {
			vscode.postMessage({
				type,
				source: settingsManager.settings!.source,
				...body
			});
		}
	};
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/preview-src/pre.ts]---
Location: vscode-main/extensions/markdown-language-features/preview-src/pre.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CspAlerter } from './csp';
import { StyleLoadingMonitor } from './loading';
import { SettingsManager } from './settings';

declare global {
	interface Window {
		cspAlerter: CspAlerter;
		styleLoadingMonitor: StyleLoadingMonitor;
	}
}

window.cspAlerter = new CspAlerter(new SettingsManager());
window.styleLoadingMonitor = new StyleLoadingMonitor();
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/preview-src/scroll-sync.ts]---
Location: vscode-main/extensions/markdown-language-features/preview-src/scroll-sync.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SettingsManager } from './settings';

const codeLineClass = 'code-line';


export class CodeLineElement {
	private readonly _detailParentElements: readonly HTMLDetailsElement[];

	constructor(
		readonly element: HTMLElement,
		readonly line: number,
		readonly codeElement?: HTMLElement,
	) {
		this._detailParentElements = Array.from(getParentsWithTagName<HTMLDetailsElement>(element, 'DETAILS'));
	}

	get isVisible(): boolean {
		if (this._detailParentElements.some(x => !x.open)) {
			return false;
		}

		const style = window.getComputedStyle(this.element);
		if (style.display === 'none' || style.visibility === 'hidden') {
			return false;
		}

		const bounds = this.element.getBoundingClientRect();
		if (bounds.height === 0 || bounds.width === 0) {
			return false;
		}

		return true;
	}
}

const getCodeLineElements = (() => {
	let cachedElements: CodeLineElement[] | undefined;
	let cachedVersion = -1;
	return (documentVersion: number) => {
		if (!cachedElements || documentVersion !== cachedVersion) {
			cachedVersion = documentVersion;
			cachedElements = [new CodeLineElement(document.body, -1)];
			for (const element of document.getElementsByClassName(codeLineClass)) {
				if (!(element instanceof HTMLElement)) {
					continue;
				}

				const line = +element.getAttribute('data-line')!;
				if (isNaN(line)) {
					continue;
				}


				if (element.tagName === 'CODE' && element.parentElement && element.parentElement.tagName === 'PRE') {
					// Fenced code blocks are a special case since the `code-line` can only be marked on
					// the `<code>` element and not the parent `<pre>` element.
					cachedElements.push(new CodeLineElement(element.parentElement, line, element));
				} else if (element.tagName === 'UL' || element.tagName === 'OL') {
					// Skip adding list elements since the first child has the same code line (and should be preferred)
				} else {
					cachedElements.push(new CodeLineElement(element, line));
				}
			}
		}
		return cachedElements;
	};
})();

/**
 * Find the html elements that map to a specific target line in the editor.
 *
 * If an exact match, returns a single element. If the line is between elements,
 * returns the element prior to and the element after the given line.
 */
export function getElementsForSourceLine(targetLine: number, documentVersion: number): { previous: CodeLineElement; next?: CodeLineElement } {
	const lineNumber = Math.floor(targetLine);
	const lines = getCodeLineElements(documentVersion);
	let previous = lines[0] || null;
	for (const entry of lines) {
		if (entry.line === lineNumber) {
			return { previous: entry, next: undefined };
		} else if (entry.line > lineNumber) {
			return { previous, next: entry };
		}
		previous = entry;
	}
	return { previous };
}

/**
 * Find the html elements that are at a specific pixel offset on the page.
 */
export function getLineElementsAtPageOffset(offset: number, documentVersion: number): { previous: CodeLineElement; next?: CodeLineElement } {
	const lines = getCodeLineElements(documentVersion).filter(x => x.isVisible);
	const position = offset - window.scrollY;
	let lo = -1;
	let hi = lines.length - 1;
	while (lo + 1 < hi) {
		const mid = Math.floor((lo + hi) / 2);
		const bounds = getElementBounds(lines[mid]);
		if (bounds.top + bounds.height >= position) {
			hi = mid;
		}
		else {
			lo = mid;
		}
	}
	const hiElement = lines[hi];
	const hiBounds = getElementBounds(hiElement);
	if (hi >= 1 && hiBounds.top > position) {
		const loElement = lines[lo];
		return { previous: loElement, next: hiElement };
	}
	if (hi > 1 && hi < lines.length && hiBounds.top + hiBounds.height > position) {
		return { previous: hiElement, next: lines[hi + 1] };
	}
	return { previous: hiElement };
}

function getElementBounds({ element }: CodeLineElement): { top: number; height: number } {
	const myBounds = element.getBoundingClientRect();

	// Some code line elements may contain other code line elements.
	// In those cases, only take the height up to that child.
	const codeLineChild = element.querySelector(`.${codeLineClass}`);
	if (codeLineChild) {
		const childBounds = codeLineChild.getBoundingClientRect();
		const height = Math.max(1, (childBounds.top - myBounds.top));
		return {
			top: myBounds.top,
			height: height
		};
	}

	return myBounds;
}

/**
 * Attempt to reveal the element for a source line in the editor.
 */
export function scrollToRevealSourceLine(line: number, documentVersion: number, settingsManager: SettingsManager) {
	if (!settingsManager.settings?.scrollPreviewWithEditor) {
		return;
	}

	if (line <= 0) {
		window.scroll(window.scrollX, 0);
		return;
	}

	const { previous, next } = getElementsForSourceLine(line, documentVersion);
	if (!previous) {
		return;
	}
	let scrollTo = 0;
	const rect = getElementBounds(previous);
	const previousTop = rect.top;
	if (next && next.line !== previous.line) {
		// Between two elements. Go to percentage offset between them.
		const betweenProgress = (line - previous.line) / (next.line - previous.line);
		const previousEnd = previousTop + rect.height;
		const betweenHeight = next.element.getBoundingClientRect().top - previousEnd;
		scrollTo = previousEnd + betweenProgress * betweenHeight;
	} else {
		const progressInElement = line - Math.floor(line);
		scrollTo = previousTop + (rect.height * progressInElement);
	}
	window.scroll(window.scrollX, Math.max(1, window.scrollY + scrollTo));
}

export function getEditorLineNumberForPageOffset(offset: number, documentVersion: number): number | null {
	const { previous, next } = getLineElementsAtPageOffset(offset, documentVersion);
	if (previous) {
		if (previous.line < 0) {
			return 0;
		}
		const previousBounds = getElementBounds(previous);
		const offsetFromPrevious = (offset - window.scrollY - previousBounds.top);
		if (next) {
			const progressBetweenElements = offsetFromPrevious / (getElementBounds(next).top - previousBounds.top);
			return previous.line + progressBetweenElements * (next.line - previous.line);
		} else {
			const progressWithinElement = offsetFromPrevious / (previousBounds.height);
			return previous.line + progressWithinElement;
		}
	}
	return null;
}

/**
 * Try to find the html element by using a fragment id
 */
export function getLineElementForFragment(fragment: string, documentVersion: number): CodeLineElement | undefined {
	return getCodeLineElements(documentVersion).find((element) => {
		return element.element.id === fragment;
	});
}

function* getParentsWithTagName<T extends HTMLElement>(element: HTMLElement, tagName: string): Iterable<T> {
	for (let parent = element.parentElement; parent; parent = parent.parentElement) {
		if (parent.tagName === tagName) {
			yield parent as T;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/preview-src/settings.ts]---
Location: vscode-main/extensions/markdown-language-features/preview-src/settings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface PreviewSettings {
	readonly source: string;
	readonly line?: number;
	readonly fragment?: string;
	readonly selectedLine?: number;

	readonly scrollPreviewWithEditor?: boolean;
	readonly scrollEditorWithPreview: boolean;
	readonly disableSecurityWarnings: boolean;
	readonly doubleClickToSwitchToEditor: boolean;
	readonly webviewResourceRoot: string;
}

export function getRawData(key: string): string {
	const element = document.getElementById('vscode-markdown-preview-data');
	if (element) {
		const data = element.getAttribute(key);
		if (data) {
			return data;
		}
	}

	throw new Error(`Could not load data for ${key}`);
}

export function getData<T = {}>(key: string): T {
	return JSON.parse(getRawData(key));
}

export class SettingsManager {
	private _settings: PreviewSettings = getData('data-settings');

	public get settings(): PreviewSettings {
		return this._settings;
	}

	public updateSettings(newSettings: PreviewSettings) {
		this._settings = newSettings;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/preview-src/strings.ts]---
Location: vscode-main/extensions/markdown-language-features/preview-src/strings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function getStrings(): { [key: string]: string } {
	const store = document.getElementById('vscode-markdown-preview-data');
	if (store) {
		const data = store.getAttribute('data-strings');
		if (data) {
			return JSON.parse(data);
		}
	}
	throw new Error('Could not load strings');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/preview-src/tsconfig.json]---
Location: vscode-main/extensions/markdown-language-features/preview-src/tsconfig.json

```json
{
	"extends": "../../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./dist/",
		"jsx": "react",
		"esModuleInterop": true,
		"lib": [
			"es2024",
			"DOM",
			"DOM.Iterable"
		],
		"types": [
			"vscode-webview"
		],
		"typeRoots": [
			"../node_modules/@types"
		],
		"skipLibCheck": true
	},
	"typeAcquisition": {
		"include": [
			"@types/vscode-webview"
		]
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/schemas/package.schema.json]---
Location: vscode-main/extensions/markdown-language-features/schemas/package.schema.json

```json
{
	"$schema": "http://json-schema.org/draft-07/schema#",
	"type": "object",
	"properties": {
		"contributes": {
			"type": "object",
			"properties": {
				"markdown.previewStyles": {
					"type": "array",
					"description": "Contributed CSS files that change the look or layout of the Markdown preview",
					"items": {
						"type": "string",
						"description": "Extension relative path to a css file"
					}
				},
				"markdown.previewScripts": {
					"type": "array",
					"description": "Contributed scripts that are executed in the Markdown preview",
					"items": {
						"type": "string",
						"description": "Extension relative path to a JavaScript file"
					}
				},
				"markdown.markdownItPlugins": {
					"type": "boolean",
					"description": "Does this extension contribute a markdown-it plugin?"
				}
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/commandManager.ts]---
Location: vscode-main/extensions/markdown-language-features/src/commandManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export interface Command {
	readonly id: string;

	execute(...args: any[]): void;
}

export class CommandManager {
	private readonly _commands = new Map<string, vscode.Disposable>();

	public dispose() {
		for (const registration of this._commands.values()) {
			registration.dispose();
		}
		this._commands.clear();
	}

	public register<T extends Command>(command: T): vscode.Disposable {
		this._registerCommand(command.id, command.execute, command);
		return new vscode.Disposable(() => {
			this._commands.delete(command.id);
		});
	}

	private _registerCommand(id: string, impl: (...args: any[]) => void, thisArg?: any) {
		if (this._commands.has(id)) {
			return;
		}

		this._commands.set(id, vscode.commands.registerCommand(id, impl, thisArg));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/extension.browser.ts]---
Location: vscode-main/extensions/markdown-language-features/src/extension.browser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions } from 'vscode-languageclient/browser';
import { MdLanguageClient, startClient } from './client/client';
import { activateShared } from './extension.shared';
import { VsCodeOutputLogger } from './logging';
import { IMdParser, MarkdownItEngine } from './markdownEngine';
import { getMarkdownExtensionContributions } from './markdownExtensions';
import { githubSlugifier } from './slugify';

export async function activate(context: vscode.ExtensionContext) {
	const contributions = getMarkdownExtensionContributions(context);
	context.subscriptions.push(contributions);

	const logger = new VsCodeOutputLogger();
	context.subscriptions.push(logger);

	const engine = new MarkdownItEngine(contributions, githubSlugifier, logger);

	const client = await startServer(context, engine);
	context.subscriptions.push(client);
	activateShared(context, client, engine, logger, contributions);
}

function startServer(context: vscode.ExtensionContext, parser: IMdParser): Promise<MdLanguageClient> {
	const serverMain = vscode.Uri.joinPath(context.extensionUri, 'dist', 'browser', 'serverWorkerMain.js');

	const worker = new Worker(serverMain.toString());
	worker.postMessage({ i10lLocation: vscode.l10n.uri?.toString() ?? '' });

	return startClient((id: string, name: string, clientOptions: LanguageClientOptions) => {
		return new LanguageClient(id, name, clientOptions, worker);
	}, parser);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/extension.shared.ts]---
Location: vscode-main/extensions/markdown-language-features/src/extension.shared.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { MdLanguageClient } from './client/client';
import { CommandManager } from './commandManager';
import { registerMarkdownCommands } from './commands/index';
import { registerPasteUrlSupport } from './languageFeatures/copyFiles/pasteUrlProvider';
import { registerResourceDropOrPasteSupport } from './languageFeatures/copyFiles/dropOrPasteResource';
import { registerDiagnosticSupport } from './languageFeatures/diagnostics';
import { registerFindFileReferenceSupport } from './languageFeatures/fileReferences';
import { registerUpdateLinksOnRename } from './languageFeatures/linkUpdater';
import { ILogger } from './logging';
import { IMdParser, MarkdownItEngine } from './markdownEngine';
import { MarkdownContributionProvider } from './markdownExtensions';
import { MdDocumentRenderer } from './preview/documentRenderer';
import { MarkdownPreviewManager } from './preview/previewManager';
import { ExtensionContentSecurityPolicyArbiter } from './preview/security';
import { loadDefaultTelemetryReporter } from './telemetryReporter';
import { MdLinkOpener } from './util/openDocumentLink';
import { registerUpdatePastedLinks } from './languageFeatures/updateLinksOnPaste';
import { markdownLanguageIds } from './util/file';

export function activateShared(
	context: vscode.ExtensionContext,
	client: MdLanguageClient,
	engine: MarkdownItEngine,
	logger: ILogger,
	contributions: MarkdownContributionProvider,
) {
	const telemetryReporter = loadDefaultTelemetryReporter();
	context.subscriptions.push(telemetryReporter);

	const cspArbiter = new ExtensionContentSecurityPolicyArbiter(context.globalState, context.workspaceState);
	const commandManager = new CommandManager();

	const opener = new MdLinkOpener(client);

	const contentProvider = new MdDocumentRenderer(engine, context, cspArbiter, contributions, logger);
	const previewManager = new MarkdownPreviewManager(contentProvider, logger, contributions, opener);
	context.subscriptions.push(previewManager);

	context.subscriptions.push(registerMarkdownLanguageFeatures(client, commandManager, engine));
	context.subscriptions.push(registerMarkdownCommands(commandManager, previewManager, telemetryReporter, cspArbiter, engine));

	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => {
		previewManager.updateConfiguration();
	}));
}

function registerMarkdownLanguageFeatures(
	client: MdLanguageClient,
	commandManager: CommandManager,
	parser: IMdParser,
): vscode.Disposable {
	const selector: vscode.DocumentSelector = markdownLanguageIds;
	return vscode.Disposable.from(
		// Language features
		registerDiagnosticSupport(selector, commandManager),
		registerFindFileReferenceSupport(commandManager, client),
		registerResourceDropOrPasteSupport(selector, parser),
		registerPasteUrlSupport(selector, parser),
		registerUpdateLinksOnRename(client),
		registerUpdatePastedLinks(selector, client),
	);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/extension.ts]---
Location: vscode-main/extensions/markdown-language-features/src/extension.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { LanguageClient, ServerOptions, TransportKind } from 'vscode-languageclient/node';
import { MdLanguageClient, startClient } from './client/client';
import { activateShared } from './extension.shared';
import { VsCodeOutputLogger } from './logging';
import { IMdParser, MarkdownItEngine } from './markdownEngine';
import { getMarkdownExtensionContributions } from './markdownExtensions';
import { githubSlugifier } from './slugify';

export async function activate(context: vscode.ExtensionContext) {
	const contributions = getMarkdownExtensionContributions(context);
	context.subscriptions.push(contributions);

	const logger = new VsCodeOutputLogger();
	context.subscriptions.push(logger);

	const engine = new MarkdownItEngine(contributions, githubSlugifier, logger);

	const client = await startServer(context, engine);
	context.subscriptions.push(client);
	activateShared(context, client, engine, logger, contributions);
}

function startServer(context: vscode.ExtensionContext, parser: IMdParser): Promise<MdLanguageClient> {
	const isDebugBuild = context.extension.packageJSON.main.includes('/out/');

	const serverModule = context.asAbsolutePath(
		isDebugBuild
			// For local non bundled version of vscode-markdown-languageserver
			// ? './node_modules/vscode-markdown-languageserver/out/node/workerMain'
			? './node_modules/vscode-markdown-languageserver/dist/node/workerMain'
			: './dist/serverWorkerMain'
	);

	// The debug options for the server
	const debugOptions = { execArgv: ['--nolazy', '--inspect=' + (7000 + Math.round(Math.random() * 999))] };

	// If the extension is launch in debug mode the debug server options are use
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
	};

	// pass the location of the localization bundle to the server
	process.env['VSCODE_L10N_BUNDLE_LOCATION'] = vscode.l10n.uri?.toString() ?? '';

	return startClient((id, name, clientOptions) => {
		return new LanguageClient(id, name, serverOptions, clientOptions);
	}, parser);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/logging.ts]---
Location: vscode-main/extensions/markdown-language-features/src/logging.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Disposable } from './util/dispose';


export interface ILogger {
	trace(title: string, message: string, data?: any): void;
}

export class VsCodeOutputLogger extends Disposable implements ILogger {
	private _outputChannelValue?: vscode.LogOutputChannel;

	private get _outputChannel() {
		this._outputChannelValue ??= this._register(vscode.window.createOutputChannel('Markdown', { log: true }));
		return this._outputChannelValue;
	}

	constructor() {
		super();
	}

	public trace(title: string, message: string, data?: any): void {
		this._outputChannel.trace(`${title}: ${message}`, ...(data ? [JSON.stringify(data, null, 4)] : []));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/markdownEngine.ts]---
Location: vscode-main/extensions/markdown-language-features/src/markdownEngine.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type MarkdownIt = require('markdown-it');
import type Token = require('markdown-it/lib/token');
import * as vscode from 'vscode';
import { ILogger } from './logging';
import { MarkdownContributionProvider } from './markdownExtensions';
import { MarkdownPreviewConfiguration } from './preview/previewConfig';
import { ISlugifier, SlugBuilder } from './slugify';
import { ITextDocument } from './types/textDocument';
import { WebviewResourceProvider } from './util/resources';
import { isOfScheme, Schemes } from './util/schemes';

/**
 * Adds begin line index to the output via the 'data-line' data attribute.
 */
const pluginSourceMap: MarkdownIt.PluginSimple = (md): void => {
	// Set the attribute on every possible token.
	md.core.ruler.push('source_map_data_attribute', (state): void => {
		for (const token of state.tokens) {
			if (token.map && token.type !== 'inline') {
				token.attrSet('data-line', String(token.map[0]));
				token.attrJoin('class', 'code-line');
				token.attrJoin('dir', 'auto');
			}
		}
	});

	// The 'html_block' renderer doesn't respect `attrs`. We need to insert a marker.
	const originalHtmlBlockRenderer = md.renderer.rules['html_block'];
	if (originalHtmlBlockRenderer) {
		md.renderer.rules['html_block'] = (tokens, idx, options, env, self) => (
			`<div ${self.renderAttrs(tokens[idx])} ></div>\n` +
			originalHtmlBlockRenderer(tokens, idx, options, env, self)
		);
	}
};

/**
 * The markdown-it options that we expose in the settings.
 */
type MarkdownItConfig = Readonly<Required<Pick<MarkdownIt.Options, 'breaks' | 'linkify' | 'typographer'>>>;

class TokenCache {
	private _cachedDocument?: {
		readonly uri: vscode.Uri;
		readonly version: number;
		readonly config: MarkdownItConfig;
	};
	private _tokens?: Token[];

	public tryGetCached(document: ITextDocument, config: MarkdownItConfig): Token[] | undefined {
		if (this._cachedDocument
			&& this._cachedDocument.uri.toString() === document.uri.toString()
			&& document.version >= 0 && this._cachedDocument.version === document.version
			&& this._cachedDocument.config.breaks === config.breaks
			&& this._cachedDocument.config.linkify === config.linkify
		) {
			return this._tokens;
		}
		return undefined;
	}

	public update(document: ITextDocument, config: MarkdownItConfig, tokens: Token[]) {
		this._cachedDocument = {
			uri: document.uri,
			version: document.version,
			config,
		};
		this._tokens = tokens;
	}

	public clean(): void {
		this._cachedDocument = undefined;
		this._tokens = undefined;
	}
}

export interface RenderOutput {
	html: string;
	containingImages: Set<string>;
}

interface RenderEnv {
	readonly containingImages: Set<string>;
	readonly currentDocument: vscode.Uri | undefined;
	readonly resourceProvider: WebviewResourceProvider | undefined;
	readonly slugifier: SlugBuilder;
}

export interface IMdParser {
	readonly slugifier: ISlugifier;

	tokenize(document: ITextDocument): Promise<Token[]>;
}

export class MarkdownItEngine implements IMdParser {

	private _md?: Promise<MarkdownIt>;

	private readonly _tokenCache = new TokenCache();

	public readonly slugifier: ISlugifier;

	public constructor(
		private readonly _contributionProvider: MarkdownContributionProvider,
		slugifier: ISlugifier,
		private readonly _logger: ILogger,
	) {
		this.slugifier = slugifier;

		_contributionProvider.onContributionsChanged(() => {
			// Markdown plugin contributions may have changed
			this._md = undefined;
			this._tokenCache.clean();
		});
	}


	public async getEngine(resource: vscode.Uri | undefined): Promise<MarkdownIt> {
		const config = this._getConfig(resource);
		return this._getEngine(config);
	}

	private async _getEngine(config: MarkdownItConfig): Promise<MarkdownIt> {
		if (!this._md) {
			this._md = (async () => {
				const markdownIt = await import('markdown-it');
				let md: MarkdownIt = markdownIt.default(await getMarkdownOptions(() => md));
				md.linkify.set({ fuzzyLink: false });

				for (const plugin of this._contributionProvider.contributions.markdownItPlugins.values()) {
					try {
						md = (await plugin)(md);
					} catch (e) {
						console.error('Could not load markdown it plugin', e);
					}
				}

				const frontMatterPlugin = await import('markdown-it-front-matter');
				// Extract rules from front matter plugin and apply at a lower precedence
				let fontMatterRule: any;
				// eslint-disable-next-line local/code-no-any-casts
				frontMatterPlugin.default(<any>{
					block: {
						ruler: {
							before: (_id: any, _id2: any, rule: any) => { fontMatterRule = rule; }
						}
					}
				}, () => { /* noop */ });

				md.block.ruler.before('fence', 'front_matter', fontMatterRule, {
					alt: ['paragraph', 'reference', 'blockquote', 'list']
				});

				this._addImageRenderer(md);
				this._addFencedRenderer(md);
				this._addLinkNormalizer(md);
				this._addLinkValidator(md);
				this._addNamedHeaders(md);
				this._addLinkRenderer(md);
				md.use(pluginSourceMap);
				return md;
			})();
		}

		const md = await this._md!;
		md.set(config);
		return md;
	}

	public reloadPlugins() {
		this._md = undefined;
	}

	private _tokenizeDocument(
		document: ITextDocument,
		config: MarkdownItConfig,
		engine: MarkdownIt
	): Token[] {
		const cached = this._tokenCache.tryGetCached(document, config);
		if (cached) {
			return cached;
		}

		this._logger.trace('MarkdownItEngine', `tokenizeDocument - ${document.uri}`);
		const tokens = this._tokenizeString(document.getText(), engine);
		this._tokenCache.update(document, config, tokens);
		return tokens;
	}

	private _tokenizeString(text: string, engine: MarkdownIt) {
		const env: RenderEnv = {
			currentDocument: undefined,
			containingImages: new Set<string>(),
			slugifier: this.slugifier.createBuilder(),
			resourceProvider: undefined,
		};
		return engine.parse(text, env);
	}

	public async render(input: ITextDocument | string, resourceProvider?: WebviewResourceProvider): Promise<RenderOutput> {
		const config = this._getConfig(typeof input === 'string' ? undefined : input.uri);
		const engine = await this._getEngine(config);

		const tokens = typeof input === 'string'
			? this._tokenizeString(input, engine)
			: this._tokenizeDocument(input, config, engine);

		const env: RenderEnv = {
			containingImages: new Set<string>(),
			currentDocument: typeof input === 'string' ? undefined : input.uri,
			resourceProvider,
			slugifier: this.slugifier.createBuilder(),
		};

		const html = engine.renderer.render(tokens, {
			...engine.options,
			...config
		}, env);

		return {
			html,
			containingImages: env.containingImages
		};
	}

	public async tokenize(document: ITextDocument): Promise<Token[]> {
		const config = this._getConfig(document.uri);
		const engine = await this._getEngine(config);
		return this._tokenizeDocument(document, config, engine);
	}

	public cleanCache(): void {
		this._tokenCache.clean();
	}

	private _getConfig(resource?: vscode.Uri): MarkdownItConfig {
		const config = MarkdownPreviewConfiguration.getForResource(resource ?? null);
		return {
			breaks: config.previewLineBreaks,
			linkify: config.previewLinkify,
			typographer: config.previewTypographer,
		};
	}

	private _addImageRenderer(md: MarkdownIt): void {
		const original = md.renderer.rules.image;
		md.renderer.rules.image = (tokens: Token[], idx: number, options, env: RenderEnv, self) => {
			const token = tokens[idx];
			const src = token.attrGet('src');
			if (src) {
				env.containingImages?.add(src);

				if (!token.attrGet('data-src')) {
					token.attrSet('src', this._toResourceUri(src, env.currentDocument, env.resourceProvider));
					token.attrSet('data-src', src);
				}
			}

			if (original) {
				return original(tokens, idx, options, env, self);
			} else {
				return self.renderToken(tokens, idx, options);
			}
		};
	}

	private _addFencedRenderer(md: MarkdownIt): void {
		const original = md.renderer.rules['fenced'];
		md.renderer.rules['fenced'] = (tokens: Token[], idx: number, options, env, self) => {
			const token = tokens[idx];
			if (token.map?.length) {
				token.attrJoin('class', 'hljs');
			}

			if (original) {
				return original(tokens, idx, options, env, self);
			} else {
				return self.renderToken(tokens, idx, options);
			}
		};
	}

	private _addLinkNormalizer(md: MarkdownIt): void {
		const normalizeLink = md.normalizeLink;
		md.normalizeLink = (link: string) => {
			try {
				// Normalize VS Code schemes to target the current version
				if (isOfScheme(Schemes.vscode, link) || isOfScheme(Schemes['vscode-insiders'], link)) {
					return normalizeLink(vscode.Uri.parse(link).with({ scheme: vscode.env.uriScheme }).toString());
				}

			} catch (e) {
				// noop
			}
			return normalizeLink(link);
		};
	}

	private _addLinkValidator(md: MarkdownIt): void {
		const validateLink = md.validateLink;
		md.validateLink = (link: string) => {
			return validateLink(link)
				|| isOfScheme(Schemes.vscode, link)
				|| isOfScheme(Schemes['vscode-insiders'], link)
				|| /^data:image\/.*?;/.test(link);
		};
	}

	private _addNamedHeaders(md: MarkdownIt): void {
		const original = md.renderer.rules.heading_open;
		md.renderer.rules.heading_open = (tokens: Token[], idx: number, options, env: unknown, self) => {
			const title = this._tokenToPlainText(tokens[idx + 1]);
			const slug = (env as RenderEnv).slugifier ? (env as RenderEnv).slugifier.add(title) : this.slugifier.fromHeading(title);
			tokens[idx].attrSet('id', slug.value);

			if (original) {
				return original(tokens, idx, options, env, self);
			} else {
				return self.renderToken(tokens, idx, options);
			}
		};
	}

	private _tokenToPlainText(token: Token): string {
		if (token.children) {
			return token.children.map(x => this._tokenToPlainText(x)).join('');
		}

		switch (token.type) {
			case 'text':
			case 'emoji':
			case 'code_inline':
				return token.content;
			default:
				return '';
		}
	}

	private _addLinkRenderer(md: MarkdownIt): void {
		const original = md.renderer.rules.link_open;

		md.renderer.rules.link_open = (tokens: Token[], idx: number, options, env, self) => {
			const token = tokens[idx];
			const href = token.attrGet('href');
			// A string, including empty string, may be `href`.
			if (typeof href === 'string') {
				token.attrSet('data-href', href);
			}
			if (original) {
				return original(tokens, idx, options, env, self);
			} else {
				return self.renderToken(tokens, idx, options);
			}
		};
	}

	private _toResourceUri(href: string, currentDocument: vscode.Uri | undefined, resourceProvider: WebviewResourceProvider | undefined): string {
		try {
			// Support file:// links
			if (isOfScheme(Schemes.file, href)) {
				const uri = vscode.Uri.parse(href);
				if (resourceProvider) {
					return resourceProvider.asWebviewUri(uri).toString(true);
				}
				// Not sure how to resolve this
				return href;
			}

			// If original link doesn't look like a url with a scheme, assume it must be a link to a file in workspace
			if (!/^[a-z\-]+:/i.test(href)) {
				// Use a fake scheme for parsing
				let uri = vscode.Uri.parse('markdown-link:' + href);

				// Relative paths should be resolved correctly inside the preview but we need to
				// handle absolute paths specially to resolve them relative to the workspace root
				if (uri.path[0] === '/' && currentDocument) {
					const root = vscode.workspace.getWorkspaceFolder(currentDocument);
					if (root) {
						uri = vscode.Uri.joinPath(root.uri, uri.fsPath).with({
							fragment: uri.fragment,
							query: uri.query,
						});

						if (resourceProvider) {
							return resourceProvider.asWebviewUri(uri).toString(true);
						} else {
							uri = uri.with({ scheme: 'markdown-link' });
						}
					}
				}

				return uri.toString(true).replace(/^markdown-link:/, '');
			}

			return href;
		} catch {
			return href;
		}
	}
}

async function getMarkdownOptions(md: () => MarkdownIt): Promise<MarkdownIt.Options> {
	const hljs = (await import('highlight.js')).default;
	return {
		html: true,
		highlight: (str: string, lang?: string) => {
			lang = normalizeHighlightLang(lang);
			if (lang && hljs.getLanguage(lang)) {
				try {
					return hljs.highlight(str, {
						language: lang,
						ignoreIllegals: true,
					}).value;
				}
				catch (error) { }
			}
			return md().utils.escapeHtml(str);
		}
	};
}

function normalizeHighlightLang(lang: string | undefined) {
	switch (lang?.toLowerCase()) {
		case 'shell':
			return 'sh';

		case 'py3':
			return 'python';

		case 'tsx':
		case 'typescriptreact':
			// Workaround for highlight not supporting tsx: https://github.com/isagalaev/highlight.js/issues/1155
			return 'jsx';

		case 'json5':
		case 'jsonc':
			return 'json';

		case 'c#':
		case 'csharp':
			return 'cs';

		default:
			return lang;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/markdownExtensions.ts]---
Location: vscode-main/extensions/markdown-language-features/src/markdownExtensions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as arrays from './util/arrays';
import { Disposable } from './util/dispose';

function resolveExtensionResource(extension: vscode.Extension<any>, resourcePath: string): vscode.Uri {
	return vscode.Uri.joinPath(extension.extensionUri, resourcePath);
}

function* resolveExtensionResources(extension: vscode.Extension<any>, resourcePaths: unknown): Iterable<vscode.Uri> {
	if (Array.isArray(resourcePaths)) {
		for (const resource of resourcePaths) {
			try {
				yield resolveExtensionResource(extension, resource);
			} catch {
				// noop
			}
		}
	}
}

export interface MarkdownContributions {
	readonly previewScripts: readonly vscode.Uri[];
	readonly previewStyles: readonly vscode.Uri[];
	readonly previewResourceRoots: readonly vscode.Uri[];
	readonly markdownItPlugins: ReadonlyMap<string, Thenable<(md: any) => any>>;
}

export namespace MarkdownContributions {
	export const Empty: MarkdownContributions = {
		previewScripts: [],
		previewStyles: [],
		previewResourceRoots: [],
		markdownItPlugins: new Map()
	};

	export function merge(a: MarkdownContributions, b: MarkdownContributions): MarkdownContributions {
		return {
			previewScripts: [...a.previewScripts, ...b.previewScripts],
			previewStyles: [...a.previewStyles, ...b.previewStyles],
			previewResourceRoots: [...a.previewResourceRoots, ...b.previewResourceRoots],
			markdownItPlugins: new Map([...a.markdownItPlugins.entries(), ...b.markdownItPlugins.entries()]),
		};
	}

	function uriEqual(a: vscode.Uri, b: vscode.Uri): boolean {
		return a.toString() === b.toString();
	}

	export function equal(a: MarkdownContributions, b: MarkdownContributions): boolean {
		return arrays.equals(a.previewScripts, b.previewScripts, uriEqual)
			&& arrays.equals(a.previewStyles, b.previewStyles, uriEqual)
			&& arrays.equals(a.previewResourceRoots, b.previewResourceRoots, uriEqual)
			&& arrays.equals(Array.from(a.markdownItPlugins.keys()), Array.from(b.markdownItPlugins.keys()));
	}

	export function fromExtension(extension: vscode.Extension<any>): MarkdownContributions {
		const contributions = extension.packageJSON?.contributes;
		if (!contributions) {
			return MarkdownContributions.Empty;
		}

		const previewStyles = Array.from(getContributedStyles(contributions, extension));
		const previewScripts = Array.from(getContributedScripts(contributions, extension));
		const previewResourceRoots = previewStyles.length || previewScripts.length ? [extension.extensionUri] : [];
		const markdownItPlugins = getContributedMarkdownItPlugins(contributions, extension);

		return {
			previewScripts,
			previewStyles,
			previewResourceRoots,
			markdownItPlugins
		};
	}

	function getContributedMarkdownItPlugins(
		contributes: any,
		extension: vscode.Extension<any>
	): Map<string, Thenable<(md: any) => any>> {
		const map = new Map<string, Thenable<(md: any) => any>>();
		if (contributes['markdown.markdownItPlugins']) {
			map.set(extension.id, extension.activate().then(() => {
				if (extension.exports?.extendMarkdownIt) {
					return (md: any) => extension.exports.extendMarkdownIt(md);
				}
				return (md: any) => md;
			}));
		}
		return map;
	}

	function getContributedScripts(
		contributes: any,
		extension: vscode.Extension<any>
	) {
		return resolveExtensionResources(extension, contributes['markdown.previewScripts']);
	}

	function getContributedStyles(
		contributes: any,
		extension: vscode.Extension<any>
	) {
		return resolveExtensionResources(extension, contributes['markdown.previewStyles']);
	}
}

export interface MarkdownContributionProvider {
	readonly extensionUri: vscode.Uri;

	readonly contributions: MarkdownContributions;
	readonly onContributionsChanged: vscode.Event<this>;

	dispose(): void;
}

class VSCodeExtensionMarkdownContributionProvider extends Disposable implements MarkdownContributionProvider {

	private _contributions?: MarkdownContributions;

	public constructor(
		private readonly _extensionContext: vscode.ExtensionContext,
	) {
		super();

		this._register(vscode.extensions.onDidChange(() => {
			const currentContributions = this._getCurrentContributions();
			const existingContributions = this._contributions || MarkdownContributions.Empty;
			if (!MarkdownContributions.equal(existingContributions, currentContributions)) {
				this._contributions = currentContributions;
				this._onContributionsChanged.fire(this);
			}
		}));
	}

	public get extensionUri() {
		return this._extensionContext.extensionUri;
	}

	private readonly _onContributionsChanged = this._register(new vscode.EventEmitter<this>());
	public readonly onContributionsChanged = this._onContributionsChanged.event;

	public get contributions(): MarkdownContributions {
		this._contributions ??= this._getCurrentContributions();
		return this._contributions;
	}

	private _getCurrentContributions(): MarkdownContributions {
		return vscode.extensions.all
			.map(MarkdownContributions.fromExtension)
			.reduce(MarkdownContributions.merge, MarkdownContributions.Empty);
	}
}

export function getMarkdownExtensionContributions(context: vscode.ExtensionContext): MarkdownContributionProvider {
	return new VSCodeExtensionMarkdownContributionProvider(context);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/slugify.ts]---
Location: vscode-main/extensions/markdown-language-features/src/slugify.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface ISlug {
	readonly value: string;
	equals(other: ISlug): boolean;
}

export class GithubSlug implements ISlug {
	public constructor(
		public readonly value: string
	) { }

	public equals(other: ISlug): boolean {
		return other instanceof GithubSlug && this.value.toLowerCase() === other.value.toLowerCase();
	}
}

export interface SlugBuilder {
	add(headingText: string): ISlug;
}

/**
 * Generates unique ids for headers in the Markdown.
 */
export interface ISlugifier {
	/**
	 * Create a new slug from the text of a markdown heading.
	 *
	 * For a heading such as `# Header`, this will be called with `Header`
	 */
	fromHeading(headingText: string): ISlug;

	/**
	 * Create a slug from a link fragment.
	 *
	 * For a link such as `[text](#header)`, this will be called with `header`
	 */
	fromFragment(fragmentText: string): ISlug;

	/**
	 * Creates a stateful object that can be used to build slugs incrementally.
	 *
	 * This should be used when getting all slugs in a document as it handles duplicate headings
	 */
	createBuilder(): SlugBuilder;
}

// Copied from https://github.com/Flet/github-slugger since we can't use esm yet.
// eslint-disable-next-line no-misleading-character-class
const githubSlugReplaceRegex = /[\0-\x1F!-,\.\/:-@\[-\^`\{-\xA9\xAB-\xB4\xB6-\xB9\xBB-\xBF\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0378\u0379\u037E\u0380-\u0385\u0387\u038B\u038D\u03A2\u03F6\u0482\u0530\u0557\u0558\u055A-\u055F\u0589-\u0590\u05BE\u05C0\u05C3\u05C6\u05C8-\u05CF\u05EB-\u05EE\u05F3-\u060F\u061B-\u061F\u066A-\u066D\u06D4\u06DD\u06DE\u06E9\u06FD\u06FE\u0700-\u070F\u074B\u074C\u07B2-\u07BF\u07F6-\u07F9\u07FB\u07FC\u07FE\u07FF\u082E-\u083F\u085C-\u085F\u086B-\u089F\u08B5\u08C8-\u08D2\u08E2\u0964\u0965\u0970\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09F2-\u09FB\u09FD\u09FF\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF0-\u0AF8\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B54\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B70\u0B72-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BF0-\u0BFF\u0C0D\u0C11\u0C29\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5B-\u0C5F\u0C64\u0C65\u0C70-\u0C7F\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0CFF\u0D0D\u0D11\u0D45\u0D49\u0D4F-\u0D53\u0D58-\u0D5E\u0D64\u0D65\u0D70-\u0D79\u0D80\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DE5\u0DF0\u0DF1\u0DF4-\u0E00\u0E3B-\u0E3F\u0E4F\u0E5A-\u0E80\u0E83\u0E85\u0E8B\u0EA4\u0EA6\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F01-\u0F17\u0F1A-\u0F1F\u0F2A-\u0F34\u0F36\u0F38\u0F3A-\u0F3D\u0F48\u0F6D-\u0F70\u0F85\u0F98\u0FBD-\u0FC5\u0FC7-\u0FFF\u104A-\u104F\u109E\u109F\u10C6\u10C8-\u10CC\u10CE\u10CF\u10FB\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u1360-\u137F\u1390-\u139F\u13F6\u13F7\u13FE-\u1400\u166D\u166E\u1680\u169B-\u169F\u16EB-\u16ED\u16F9-\u16FF\u170D\u1715-\u171F\u1735-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17D4-\u17D6\u17D8-\u17DB\u17DE\u17DF\u17EA-\u180A\u180E\u180F\u181A-\u181F\u1879-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191F\u192C-\u192F\u193C-\u1945\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DA-\u19FF\u1A1C-\u1A1F\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1AA6\u1AA8-\u1AAF\u1AC1-\u1AFF\u1B4C-\u1B4F\u1B5A-\u1B6A\u1B74-\u1B7F\u1BF4-\u1BFF\u1C38-\u1C3F\u1C4A-\u1C4C\u1C7E\u1C7F\u1C89-\u1C8F\u1CBB\u1CBC\u1CC0-\u1CCF\u1CD3\u1CFB-\u1CFF\u1DFA\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FBD\u1FBF-\u1FC1\u1FC5\u1FCD-\u1FCF\u1FD4\u1FD5\u1FDC-\u1FDF\u1FED-\u1FF1\u1FF5\u1FFD-\u203E\u2041-\u2053\u2055-\u2070\u2072-\u207E\u2080-\u208F\u209D-\u20CF\u20F1-\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F-\u215F\u2189-\u24B5\u24EA-\u2BFF\u2C2F\u2C5F\u2CE5-\u2CEA\u2CF4-\u2CFF\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D70-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E00-\u2E2E\u2E30-\u3004\u3008-\u3020\u3030\u3036\u3037\u303D-\u3040\u3097\u3098\u309B\u309C\u30A0\u30FB\u3100-\u3104\u3130\u318F-\u319F\u31C0-\u31EF\u3200-\u33FF\u4DC0-\u4DFF\u9FFD-\u9FFF\uA48D-\uA4CF\uA4FE\uA4FF\uA60D-\uA60F\uA62C-\uA63F\uA673\uA67E\uA6F2-\uA716\uA720\uA721\uA789\uA78A\uA7C0\uA7C1\uA7CB-\uA7F4\uA828-\uA82B\uA82D-\uA83F\uA874-\uA87F\uA8C6-\uA8CF\uA8DA-\uA8DF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA954-\uA95F\uA97D-\uA97F\uA9C1-\uA9CE\uA9DA-\uA9DF\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A-\uAA5F\uAA77-\uAA79\uAAC3-\uAADA\uAADE\uAADF\uAAF0\uAAF1\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB5B\uAB6A-\uAB6F\uABEB\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uD7FF\uE000-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB29\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFC-\uFDFF\uFE10-\uFE1F\uFE30-\uFE32\uFE35-\uFE4C\uFE50-\uFE6F\uFE75\uFEFD-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF3E\uFF40\uFF5B-\uFF65\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFFF]|\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDD3F\uDD75-\uDDFC\uDDFE-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEDF\uDEE1-\uDEFF\uDF20-\uDF2C\uDF4B-\uDF4F\uDF7B-\uDF7F\uDF9E\uDF9F\uDFC4-\uDFC7\uDFD0\uDFD6-\uDFFF]|\uD801[\uDC9E\uDC9F\uDCAA-\uDCAF\uDCD4-\uDCD7\uDCFC-\uDCFF\uDD28-\uDD2F\uDD64-\uDDFF\uDF37-\uDF3F\uDF56-\uDF5F\uDF68-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56-\uDC5F\uDC77-\uDC7F\uDC9F-\uDCDF\uDCF3\uDCF6-\uDCFF\uDD16-\uDD1F\uDD3A-\uDD7F\uDDB8-\uDDBD\uDDC0-\uDDFF\uDE04\uDE07-\uDE0B\uDE14\uDE18\uDE36\uDE37\uDE3B-\uDE3E\uDE40-\uDE5F\uDE7D-\uDE7F\uDE9D-\uDEBF\uDEC8\uDEE7-\uDEFF\uDF36-\uDF3F\uDF56-\uDF5F\uDF73-\uDF7F\uDF92-\uDFFF]|\uD803[\uDC49-\uDC7F\uDCB3-\uDCBF\uDCF3-\uDCFF\uDD28-\uDD2F\uDD3A-\uDE7F\uDEAA\uDEAD-\uDEAF\uDEB2-\uDEFF\uDF1D-\uDF26\uDF28-\uDF2F\uDF51-\uDFAF\uDFC5-\uDFDF\uDFF7-\uDFFF]|\uD804[\uDC47-\uDC65\uDC70-\uDC7E\uDCBB-\uDCCF\uDCE9-\uDCEF\uDCFA-\uDCFF\uDD35\uDD40-\uDD43\uDD48-\uDD4F\uDD74\uDD75\uDD77-\uDD7F\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDFF\uDE12\uDE38-\uDE3D\uDE3F-\uDE7F\uDE87\uDE89\uDE8E\uDE9E\uDEA9-\uDEAF\uDEEB-\uDEEF\uDEFA-\uDEFF\uDF04\uDF0D\uDF0E\uDF11\uDF12\uDF29\uDF31\uDF34\uDF3A\uDF45\uDF46\uDF49\uDF4A\uDF4E\uDF4F\uDF51-\uDF56\uDF58-\uDF5C\uDF64\uDF65\uDF6D-\uDF6F\uDF75-\uDFFF]|\uD805[\uDC4B-\uDC4F\uDC5A-\uDC5D\uDC62-\uDC7F\uDCC6\uDCC8-\uDCCF\uDCDA-\uDD7F\uDDB6\uDDB7\uDDC1-\uDDD7\uDDDE-\uDDFF\uDE41-\uDE43\uDE45-\uDE4F\uDE5A-\uDE7F\uDEB9-\uDEBF\uDECA-\uDEFF\uDF1B\uDF1C\uDF2C-\uDF2F\uDF3A-\uDFFF]|\uD806[\uDC3B-\uDC9F\uDCEA-\uDCFE\uDD07\uDD08\uDD0A\uDD0B\uDD14\uDD17\uDD36\uDD39\uDD3A\uDD44-\uDD4F\uDD5A-\uDD9F\uDDA8\uDDA9\uDDD8\uDDD9\uDDE2\uDDE5-\uDDFF\uDE3F-\uDE46\uDE48-\uDE4F\uDE9A-\uDE9C\uDE9E-\uDEBF\uDEF9-\uDFFF]|\uD807[\uDC09\uDC37\uDC41-\uDC4F\uDC5A-\uDC71\uDC90\uDC91\uDCA8\uDCB7-\uDCFF\uDD07\uDD0A\uDD37-\uDD39\uDD3B\uDD3E\uDD48-\uDD4F\uDD5A-\uDD5F\uDD66\uDD69\uDD8F\uDD92\uDD99-\uDD9F\uDDAA-\uDEDF\uDEF7-\uDFAF\uDFB1-\uDFFF]|\uD808[\uDF9A-\uDFFF]|\uD809[\uDC6F-\uDC7F\uDD44-\uDFFF]|[\uD80A\uD80B\uD80E-\uD810\uD812-\uD819\uD824-\uD82B\uD82D\uD82E\uD830-\uD833\uD837\uD839\uD83D\uD83F\uD87B-\uD87D\uD87F\uD885-\uDB3F\uDB41-\uDBFF][\uDC00-\uDFFF]|\uD80D[\uDC2F-\uDFFF]|\uD811[\uDE47-\uDFFF]|\uD81A[\uDE39-\uDE3F\uDE5F\uDE6A-\uDECF\uDEEE\uDEEF\uDEF5-\uDEFF\uDF37-\uDF3F\uDF44-\uDF4F\uDF5A-\uDF62\uDF78-\uDF7C\uDF90-\uDFFF]|\uD81B[\uDC00-\uDE3F\uDE80-\uDEFF\uDF4B-\uDF4E\uDF88-\uDF8E\uDFA0-\uDFDF\uDFE2\uDFE5-\uDFEF\uDFF2-\uDFFF]|\uD821[\uDFF8-\uDFFF]|\uD823[\uDCD6-\uDCFF\uDD09-\uDFFF]|\uD82C[\uDD1F-\uDD4F\uDD53-\uDD63\uDD68-\uDD6F\uDEFC-\uDFFF]|\uD82F[\uDC6B-\uDC6F\uDC7D-\uDC7F\uDC89-\uDC8F\uDC9A-\uDC9C\uDC9F-\uDFFF]|\uD834[\uDC00-\uDD64\uDD6A-\uDD6C\uDD73-\uDD7A\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDE41\uDE45-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3\uDFCC\uDFCD]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85-\uDE9A\uDEA0\uDEB0-\uDFFF]|\uD838[\uDC07\uDC19\uDC1A\uDC22\uDC25\uDC2B-\uDCFF\uDD2D-\uDD2F\uDD3E\uDD3F\uDD4A-\uDD4D\uDD4F-\uDEBF\uDEFA-\uDFFF]|\uD83A[\uDCC5-\uDCCF\uDCD7-\uDCFF\uDD4C-\uDD4F\uDD5A-\uDFFF]|\uD83B[\uDC00-\uDDFF\uDE04\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDFFF]|\uD83C[\uDC00-\uDD2F\uDD4A-\uDD4F\uDD6A-\uDD6F\uDD8A-\uDFFF]|\uD83E[\uDC00-\uDFEF\uDFFA-\uDFFF]|\uD869[\uDEDE-\uDEFF]|\uD86D[\uDF35-\uDF3F]|\uD86E[\uDC1E\uDC1F]|\uD873[\uDEA2-\uDEAF]|\uD87A[\uDFE1-\uDFFF]|\uD87E[\uDE1E-\uDFFF]|\uD884[\uDF4B-\uDFFF]|\uDB40[\uDC00-\uDCFF\uDDF0-\uDFFF]/g;

/**
 * A {@link ISlugifier slugifier} that approximates how GitHub's slugifier works.
 */
export const githubSlugifier: ISlugifier = new class implements ISlugifier {
	fromHeading(heading: string): ISlug {
		const slugifiedHeading = heading.trim()
			.toLowerCase()
			.replace(githubSlugReplaceRegex, '')
			.replace(/\s/g, '-'); // Replace whitespace with -

		return new GithubSlug(slugifiedHeading);
	}

	fromFragment(fragmentText: string): ISlug {
		return new GithubSlug(fragmentText.toLowerCase());
	}

	createBuilder() {
		const entries = new Map<string, { count: number }>();
		return {
			add: (heading: string): ISlug => {
				const slug = this.fromHeading(heading);
				const existingSlugEntry = entries.get(slug.value);
				if (existingSlugEntry) {
					++existingSlugEntry.count;
					return this.fromHeading(slug.value + '-' + existingSlugEntry.count);
				}

				entries.set(slug.value, { count: 0 });
				return slug;
			}
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/telemetryReporter.ts]---
Location: vscode-main/extensions/markdown-language-features/src/telemetryReporter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { default as VSCodeTelemetryReporter } from '@vscode/extension-telemetry';
import * as vscode from 'vscode';

interface IPackageInfo {
	name: string;
	version: string;
	aiKey: string;
}

export interface TelemetryReporter {
	dispose(): void;
	sendTelemetryEvent(eventName: string, properties?: {
		[key: string]: string;
	}): void;
}

const nullReporter = new class NullTelemetryReporter implements TelemetryReporter {
	sendTelemetryEvent() { /** noop */ }
	dispose() { /** noop */ }
};

class ExtensionReporter implements TelemetryReporter {
	private readonly _reporter: VSCodeTelemetryReporter;

	constructor(
		packageInfo: IPackageInfo
	) {
		this._reporter = new VSCodeTelemetryReporter(packageInfo.aiKey);
	}
	sendTelemetryEvent(eventName: string, properties?: {
		[key: string]: string;
	}) {
		this._reporter.sendTelemetryEvent(eventName, properties);
	}

	dispose() {
		this._reporter.dispose();
	}
}

export function loadDefaultTelemetryReporter(): TelemetryReporter {
	const packageInfo = getPackageInfo();
	return packageInfo ? new ExtensionReporter(packageInfo) : nullReporter;
}

function getPackageInfo(): IPackageInfo | null {
	const extension = vscode.extensions.getExtension('Microsoft.vscode-markdown');
	if (extension?.packageJSON) {
		return {
			name: extension.packageJSON.name,
			version: extension.packageJSON.version,
			aiKey: extension.packageJSON.aiKey
		};
	}
	return null;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/client/client.ts]---
Location: vscode-main/extensions/markdown-language-features/src/client/client.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { BaseLanguageClient, LanguageClientOptions, NotebookDocumentSyncRegistrationType, Range, TextEdit } from 'vscode-languageclient';
import { IMdParser } from '../markdownEngine';
import { IDisposable } from '../util/dispose';
import { looksLikeMarkdownPath, markdownFileExtensions, markdownLanguageIds } from '../util/file';
import { FileWatcherManager } from './fileWatchingManager';
import { InMemoryDocument } from './inMemoryDocument';
import * as proto from './protocol';
import { VsCodeMdWorkspace } from './workspace';

export type LanguageClientConstructor = (name: string, description: string, clientOptions: LanguageClientOptions) => BaseLanguageClient;

export class MdLanguageClient implements IDisposable {

	constructor(
		private readonly _client: BaseLanguageClient,
		private readonly _workspace: VsCodeMdWorkspace,
	) { }

	dispose(): void {
		this._client.stop();
		this._workspace.dispose();
	}

	resolveLinkTarget(linkText: string, uri: vscode.Uri): Promise<proto.ResolvedDocumentLinkTarget> {
		return this._client.sendRequest(proto.resolveLinkTarget, { linkText, uri: uri.toString() });
	}

	getEditForFileRenames(files: ReadonlyArray<{ oldUri: string; newUri: string }>, token: vscode.CancellationToken) {
		return this._client.sendRequest(proto.getEditForFileRenames, files, token);
	}

	getReferencesToFileInWorkspace(resource: vscode.Uri, token: vscode.CancellationToken) {
		return this._client.sendRequest(proto.getReferencesToFileInWorkspace, { uri: resource.toString() }, token);
	}

	prepareUpdatePastedLinks(doc: vscode.Uri, ranges: readonly vscode.Range[], token: vscode.CancellationToken) {
		return this._client.sendRequest(proto.prepareUpdatePastedLinks, {
			uri: doc.toString(),
			ranges: ranges.map(range => Range.create(range.start.line, range.start.character, range.end.line, range.end.character)),
		}, token);
	}

	getUpdatePastedLinksEdit(pastingIntoDoc: vscode.Uri, edits: readonly vscode.TextEdit[], metadata: string, token: vscode.CancellationToken) {
		return this._client.sendRequest(proto.getUpdatePastedLinksEdit, {
			metadata,
			pasteIntoDoc: pastingIntoDoc.toString(),
			edits: edits.map(edit => TextEdit.replace(edit.range, edit.newText)),
		}, token);
	}
}

export async function startClient(factory: LanguageClientConstructor, parser: IMdParser): Promise<MdLanguageClient> {

	const mdFileGlob = `**/*.{${markdownFileExtensions.join(',')}}`;

	const clientOptions: LanguageClientOptions = {
		documentSelector: markdownLanguageIds,
		synchronize: {
			configurationSection: ['markdown'],
			fileEvents: vscode.workspace.createFileSystemWatcher(mdFileGlob),
		},
		initializationOptions: {
			markdownFileExtensions,
			i10lLocation: vscode.l10n.uri?.toJSON(),
		},
		diagnosticPullOptions: {
			onChange: true,
			onTabs: true,
			match(_documentSelector, resource) {
				return looksLikeMarkdownPath(resource);
			},
		},
		markdown: {
			supportHtml: true,
		}
	};

	const client = factory('markdown', vscode.l10n.t("Markdown Language Server"), clientOptions);

	client.registerProposedFeatures();

	const notebookFeature = client.getFeature(NotebookDocumentSyncRegistrationType.method);
	if (notebookFeature !== undefined) {
		notebookFeature.register({
			id: String(Date.now()),
			registerOptions: {
				notebookSelector: [{
					notebook: '*',
					cells: [{ language: 'markdown' }]
				}]
			}
		});
	}

	const workspace = new VsCodeMdWorkspace();

	client.onRequest(proto.parse, async (e) => {
		const uri = vscode.Uri.parse(e.uri);
		if (typeof e.text === 'string') {
			return parser.tokenize(new InMemoryDocument(uri, e.text, -1));
		} else {
			const doc = await workspace.getOrLoadMarkdownDocument(uri);
			if (doc) {
				return parser.tokenize(doc);
			} else {
				return [];
			}
		}
	});

	client.onRequest(proto.fs_readFile, async (e): Promise<number[]> => {
		const uri = vscode.Uri.parse(e.uri);
		return Array.from(await vscode.workspace.fs.readFile(uri));
	});

	client.onRequest(proto.fs_stat, async (e): Promise<{ isDirectory: boolean } | undefined> => {
		const uri = vscode.Uri.parse(e.uri);
		try {
			const stat = await vscode.workspace.fs.stat(uri);
			return { isDirectory: stat.type === vscode.FileType.Directory };
		} catch {
			return undefined;
		}
	});

	client.onRequest(proto.fs_readDirectory, async (e): Promise<[string, { isDirectory: boolean }][]> => {
		const uri = vscode.Uri.parse(e.uri);
		const result = await vscode.workspace.fs.readDirectory(uri);
		return result.map(([name, type]) => [name, { isDirectory: type === vscode.FileType.Directory }]);
	});

	client.onRequest(proto.findMarkdownFilesInWorkspace, async (): Promise<string[]> => {
		return (await vscode.workspace.findFiles(mdFileGlob, '**/node_modules/**')).map(x => x.toString());
	});

	const watchers = new FileWatcherManager();

	client.onRequest(proto.fs_watcher_create, async (params): Promise<void> => {
		const id = params.id;
		const uri = vscode.Uri.parse(params.uri);

		const sendWatcherChange = (kind: 'create' | 'change' | 'delete') => {
			client.sendRequest(proto.fs_watcher_onChange, { id, uri: params.uri, kind });
		};

		watchers.create(id, uri, params.watchParentDirs, {
			create: params.options.ignoreCreate ? undefined : () => sendWatcherChange('create'),
			change: params.options.ignoreChange ? undefined : () => sendWatcherChange('change'),
			delete: params.options.ignoreDelete ? undefined : () => sendWatcherChange('delete'),
		});
	});

	client.onRequest(proto.fs_watcher_delete, async (params): Promise<void> => {
		watchers.delete(params.id);
	});

	vscode.commands.registerCommand('vscodeMarkdownLanguageservice.open', (uri, args) => {
		return vscode.commands.executeCommand('vscode.open', uri, args);
	});

	vscode.commands.registerCommand('vscodeMarkdownLanguageservice.rename', (uri, pos) => {
		return vscode.commands.executeCommand('editor.action.rename', [vscode.Uri.from(uri), new vscode.Position(pos.line, pos.character)]);
	});

	await client.start();

	return new MdLanguageClient(client, workspace);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/client/fileWatchingManager.ts]---
Location: vscode-main/extensions/markdown-language-features/src/client/fileWatchingManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Utils } from 'vscode-uri';
import { disposeAll, IDisposable } from '../util/dispose';
import { ResourceMap } from '../util/resourceMap';
import { Schemes } from '../util/schemes';

type DirWatcherEntry = {
	readonly uri: vscode.Uri;
	readonly disposables: readonly IDisposable[];
};


export class FileWatcherManager {

	private readonly _fileWatchers = new Map<number, {
		readonly watcher: vscode.FileSystemWatcher;
		readonly dirWatchers: DirWatcherEntry[];
	}>();

	private readonly _dirWatchers = new ResourceMap<{
		readonly watcher: vscode.FileSystemWatcher;
		refCount: number;
	}>();

	create(id: number, uri: vscode.Uri, watchParentDirs: boolean, listeners: { create?: () => void; change?: () => void; delete?: () => void }): void {
		// Non-writable file systems do not support file watching
		if (!vscode.workspace.fs.isWritableFileSystem(uri.scheme)) {
			return;
		}

		const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(uri, '*'), !listeners.create, !listeners.change, !listeners.delete);
		const parentDirWatchers: DirWatcherEntry[] = [];
		this._fileWatchers.set(id, { watcher, dirWatchers: parentDirWatchers });

		if (listeners.create) { watcher.onDidCreate(listeners.create); }
		if (listeners.change) { watcher.onDidChange(listeners.change); }
		if (listeners.delete) { watcher.onDidDelete(listeners.delete); }

		if (watchParentDirs && uri.scheme !== Schemes.untitled) {
			// We need to watch the parent directories too for when these are deleted / created
			for (let dirUri = Utils.dirname(uri); dirUri.path.length > 1; dirUri = Utils.dirname(dirUri)) {
				const disposables: IDisposable[] = [];

				let parentDirWatcher = this._dirWatchers.get(dirUri);
				if (!parentDirWatcher) {
					const glob = new vscode.RelativePattern(Utils.dirname(dirUri), Utils.basename(dirUri));
					const parentWatcher = vscode.workspace.createFileSystemWatcher(glob, !listeners.create, true, !listeners.delete);
					parentDirWatcher = { refCount: 0, watcher: parentWatcher };
					this._dirWatchers.set(dirUri, parentDirWatcher);
				}
				parentDirWatcher.refCount++;

				if (listeners.create) {
					disposables.push(parentDirWatcher.watcher.onDidCreate(async () => {
						// Just because the parent dir was created doesn't mean our file was created
						try {
							const stat = await vscode.workspace.fs.stat(uri);
							if (stat.type === vscode.FileType.File) {
								listeners.create!();
							}
						} catch {
							// Noop
						}
					}));
				}

				if (listeners.delete) {
					// When the parent dir is deleted, consider our file deleted too
					// TODO: this fires if the file previously did not exist and then the parent is deleted
					disposables.push(parentDirWatcher.watcher.onDidDelete(listeners.delete));
				}

				parentDirWatchers.push({ uri: dirUri, disposables });
			}
		}
	}

	delete(id: number): void {
		const entry = this._fileWatchers.get(id);
		if (entry) {
			for (const dirWatcher of entry.dirWatchers) {
				disposeAll(dirWatcher.disposables);

				const dirWatcherEntry = this._dirWatchers.get(dirWatcher.uri);
				if (dirWatcherEntry) {
					if (--dirWatcherEntry.refCount <= 0) {
						dirWatcherEntry.watcher.dispose();
						this._dirWatchers.delete(dirWatcher.uri);
					}
				}
			}

			entry.watcher.dispose();
		}

		this._fileWatchers.delete(id);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/client/inMemoryDocument.ts]---
Location: vscode-main/extensions/markdown-language-features/src/client/inMemoryDocument.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TextDocument } from 'vscode-languageserver-textdocument';
import * as vscode from 'vscode';
import { ITextDocument } from '../types/textDocument';

export class InMemoryDocument implements ITextDocument {

	private readonly _doc: TextDocument;

	public readonly uri: vscode.Uri;
	public readonly version: number;

	constructor(
		uri: vscode.Uri,
		contents: string,
		version: number = 0,
	) {
		this.uri = uri;
		this.version = version;
		this._doc = TextDocument.create(this.uri.toString(), 'markdown', 0, contents);
	}

	getText(range?: vscode.Range): string {
		return this._doc.getText(range);
	}

	positionAt(offset: number): vscode.Position {
		const pos = this._doc.positionAt(offset);
		return new vscode.Position(pos.line, pos.character);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/client/protocol.ts]---
Location: vscode-main/extensions/markdown-language-features/src/client/protocol.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type Token = require('markdown-it/lib/token');
import * as vscode from 'vscode';
import { FileRename, RequestType } from 'vscode-languageclient';
import type * as lsp from 'vscode-languageserver-types';
import type * as md from 'vscode-markdown-languageservice';


export type ResolvedDocumentLinkTarget =
	| { readonly kind: 'file'; readonly uri: vscode.Uri; position?: lsp.Position; fragment?: string }
	| { readonly kind: 'folder'; readonly uri: vscode.Uri }
	| { readonly kind: 'external'; readonly uri: vscode.Uri };

//#region From server
export const parse = new RequestType<{ uri: string; text?: string }, Token[], any>('markdown/parse');

export const fs_readFile = new RequestType<{ uri: string }, number[], any>('markdown/fs/readFile');
export const fs_readDirectory = new RequestType<{ uri: string }, [string, { isDirectory: boolean }][], any>('markdown/fs/readDirectory');
export const fs_stat = new RequestType<{ uri: string }, { isDirectory: boolean } | undefined, any>('markdown/fs/stat');

export const fs_watcher_create = new RequestType<{ id: number; uri: string; options: md.FileWatcherOptions; watchParentDirs: boolean }, void, any>('markdown/fs/watcher/create');
export const fs_watcher_delete = new RequestType<{ id: number }, void, any>('markdown/fs/watcher/delete');

export const findMarkdownFilesInWorkspace = new RequestType<{}, string[], any>('markdown/findMarkdownFilesInWorkspace');
//#endregion

//#region To server
export const getReferencesToFileInWorkspace = new RequestType<{ uri: string }, lsp.Location[], any>('markdown/getReferencesToFileInWorkspace');
export const getEditForFileRenames = new RequestType<Array<FileRename>, { participatingRenames: readonly FileRename[]; edit: lsp.WorkspaceEdit }, any>('markdown/getEditForFileRenames');

export const prepareUpdatePastedLinks = new RequestType<{ uri: string; ranges: lsp.Range[] }, string, any>('markdown/prepareUpdatePastedLinks');
export const getUpdatePastedLinksEdit = new RequestType<{ pasteIntoDoc: string; metadata: string; edits: lsp.TextEdit[] }, lsp.TextEdit[] | undefined, any>('markdown/getUpdatePastedLinksEdit');

export const fs_watcher_onChange = new RequestType<{ id: number; uri: string; kind: 'create' | 'change' | 'delete' }, void, any>('markdown/fs/watcher/onChange');

export const resolveLinkTarget = new RequestType<{ linkText: string; uri: string }, ResolvedDocumentLinkTarget, any>('markdown/resolveLinkTarget');
//#endregion
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/client/workspace.ts]---
Location: vscode-main/extensions/markdown-language-features/src/client/workspace.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { ITextDocument } from '../types/textDocument';
import { Disposable } from '../util/dispose';
import { isMarkdownFile, looksLikeMarkdownPath } from '../util/file';
import { InMemoryDocument } from './inMemoryDocument';
import { ResourceMap } from '../util/resourceMap';

/**
 * Provides set of markdown files known to VS Code.
 *
 * This includes both opened text documents and markdown files in the workspace.
 */
export class VsCodeMdWorkspace extends Disposable {

	private readonly _watcher: vscode.FileSystemWatcher | undefined;

	private readonly _documentCache = new ResourceMap<ITextDocument>();

	private readonly _utf8Decoder = new TextDecoder('utf-8');

	constructor() {
		super();

		this._watcher = this._register(vscode.workspace.createFileSystemWatcher('**/*.md'));

		this._register(this._watcher.onDidChange(async resource => {
			this._documentCache.delete(resource);
		}));

		this._register(this._watcher.onDidDelete(resource => {
			this._documentCache.delete(resource);
		}));

		this._register(vscode.workspace.onDidOpenTextDocument(e => {
			this._documentCache.delete(e.uri);
		}));

		this._register(vscode.workspace.onDidCloseTextDocument(e => {
			this._documentCache.delete(e.uri);
		}));
	}

	private _isRelevantMarkdownDocument(doc: vscode.TextDocument) {
		return isMarkdownFile(doc) && doc.uri.scheme !== 'vscode-bulkeditpreview';
	}

	public async getOrLoadMarkdownDocument(resource: vscode.Uri): Promise<ITextDocument | undefined> {
		const existing = this._documentCache.get(resource);
		if (existing) {
			return existing;
		}

		const matchingDocument = vscode.workspace.textDocuments.find((doc) => this._isRelevantMarkdownDocument(doc) && doc.uri.toString() === resource.toString());
		if (matchingDocument) {
			this._documentCache.set(resource, matchingDocument);
			return matchingDocument;
		}

		if (!looksLikeMarkdownPath(resource)) {
			return undefined;
		}

		try {
			const bytes = await vscode.workspace.fs.readFile(resource);

			// We assume that markdown is in UTF-8
			const text = this._utf8Decoder.decode(bytes);
			const doc = new InMemoryDocument(resource, text, 0);
			this._documentCache.set(resource, doc);
			return doc;
		} catch {
			return undefined;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/commands/copyImage.ts]---
Location: vscode-main/extensions/markdown-language-features/src/commands/copyImage.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Command } from '../commandManager';
import { MarkdownPreviewManager } from '../preview/previewManager';

export class CopyImageCommand implements Command {
	public readonly id = '_markdown.copyImage';

	public constructor(
		private readonly _webviewManager: MarkdownPreviewManager,
	) { }

	public execute(args: { id: string; resource: string }) {
		const source = vscode.Uri.parse(args.resource);
		this._webviewManager.findPreview(source)?.copyImage(args.id);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/commands/index.ts]---
Location: vscode-main/extensions/markdown-language-features/src/commands/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { CommandManager } from '../commandManager';
import { MarkdownItEngine } from '../markdownEngine';
import { MarkdownPreviewManager } from '../preview/previewManager';
import { ContentSecurityPolicyArbiter, PreviewSecuritySelector } from '../preview/security';
import { TelemetryReporter } from '../telemetryReporter';
import { InsertLinkFromWorkspace, InsertImageFromWorkspace } from './insertResource';
import { RefreshPreviewCommand } from './refreshPreview';
import { ReloadPlugins } from './reloadPlugins';
import { RenderDocument } from './renderDocument';
import { ShowLockedPreviewToSideCommand, ShowPreviewCommand, ShowPreviewToSideCommand } from './showPreview';
import { CopyImageCommand } from './copyImage';
import { ShowPreviewSecuritySelectorCommand } from './showPreviewSecuritySelector';
import { ShowSourceCommand } from './showSource';
import { ToggleLockCommand } from './toggleLock';
import { OpenImageCommand } from './openImage';

export function registerMarkdownCommands(
	commandManager: CommandManager,
	previewManager: MarkdownPreviewManager,
	telemetryReporter: TelemetryReporter,
	cspArbiter: ContentSecurityPolicyArbiter,
	engine: MarkdownItEngine,
): vscode.Disposable {
	const previewSecuritySelector = new PreviewSecuritySelector(cspArbiter, previewManager);

	commandManager.register(new OpenImageCommand(previewManager));
	commandManager.register(new CopyImageCommand(previewManager));
	commandManager.register(new ShowPreviewCommand(previewManager, telemetryReporter));
	commandManager.register(new ShowPreviewToSideCommand(previewManager, telemetryReporter));
	commandManager.register(new ShowLockedPreviewToSideCommand(previewManager, telemetryReporter));
	commandManager.register(new ShowSourceCommand(previewManager));
	commandManager.register(new RefreshPreviewCommand(previewManager, engine));
	commandManager.register(new ShowPreviewSecuritySelectorCommand(previewSecuritySelector, previewManager));
	commandManager.register(new ToggleLockCommand(previewManager));
	commandManager.register(new RenderDocument(engine));
	commandManager.register(new ReloadPlugins(previewManager, engine));
	commandManager.register(new InsertLinkFromWorkspace());
	commandManager.register(new InsertImageFromWorkspace());

	return commandManager;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/commands/insertResource.ts]---
Location: vscode-main/extensions/markdown-language-features/src/commands/insertResource.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Utils } from 'vscode-uri';
import { Command } from '../commandManager';
import { createUriListSnippet, linkEditKind } from '../languageFeatures/copyFiles/shared';
import { mediaFileExtensions } from '../util/mimes';
import { coalesce } from '../util/arrays';
import { getParentDocumentUri } from '../util/document';
import { Schemes } from '../util/schemes';


export class InsertLinkFromWorkspace implements Command {
	public readonly id = 'markdown.editor.insertLinkFromWorkspace';

	public async execute(resources?: vscode.Uri[]) {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			return;
		}

		resources ??= await vscode.window.showOpenDialog({
			canSelectFiles: true,
			canSelectFolders: false,
			canSelectMany: true,
			openLabel: vscode.l10n.t("Insert link"),
			title: vscode.l10n.t("Insert link"),
			defaultUri: getDefaultUri(activeEditor.document),
		});
		if (!resources) {
			return;
		}

		return insertLink(activeEditor, resources, false);
	}
}

export class InsertImageFromWorkspace implements Command {
	public readonly id = 'markdown.editor.insertImageFromWorkspace';

	public async execute(resources?: vscode.Uri[]) {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			return;
		}

		resources ??= await vscode.window.showOpenDialog({
			canSelectFiles: true,
			canSelectFolders: false,
			canSelectMany: true,
			filters: {
				[vscode.l10n.t("Media")]: Array.from(mediaFileExtensions.keys())
			},
			openLabel: vscode.l10n.t("Insert image"),
			title: vscode.l10n.t("Insert image"),
			defaultUri: getDefaultUri(activeEditor.document),
		});
		if (!resources) {
			return;
		}

		return insertLink(activeEditor, resources, true);
	}
}

function getDefaultUri(document: vscode.TextDocument) {
	const docUri = getParentDocumentUri(document.uri);
	if (docUri.scheme === Schemes.untitled) {
		return vscode.workspace.workspaceFolders?.[0]?.uri;
	}
	return Utils.dirname(docUri);
}

async function insertLink(activeEditor: vscode.TextEditor, selectedFiles: readonly vscode.Uri[], insertAsMedia: boolean): Promise<void> {
	const edit = createInsertLinkEdit(activeEditor, selectedFiles, insertAsMedia);
	if (edit) {
		await vscode.workspace.applyEdit(edit);
	}
}

function createInsertLinkEdit(activeEditor: vscode.TextEditor, selectedFiles: readonly vscode.Uri[], insertAsMedia: boolean) {
	const snippetEdits = coalesce(activeEditor.selections.map((selection, i): vscode.SnippetTextEdit | undefined => {
		const selectionText = activeEditor.document.getText(selection);
		const snippet = createUriListSnippet(activeEditor.document.uri, selectedFiles.map(uri => ({ uri })), {
			linkKindHint: insertAsMedia ? 'media' : linkEditKind,
			placeholderText: selectionText,
			placeholderStartIndex: (i + 1) * selectedFiles.length,
			separator: insertAsMedia ? '\n' : ' ',
		});

		return snippet ? new vscode.SnippetTextEdit(selection, snippet.snippet) : undefined;
	}));
	if (!snippetEdits.length) {
		return;
	}

	const edit = new vscode.WorkspaceEdit();
	edit.set(activeEditor.document.uri, snippetEdits);
	return edit;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/commands/openImage.ts]---
Location: vscode-main/extensions/markdown-language-features/src/commands/openImage.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Command } from '../commandManager';
import { MarkdownPreviewManager } from '../preview/previewManager';

export class OpenImageCommand implements Command {
	public readonly id = '_markdown.openImage';

	public constructor(
		private readonly _webviewManager: MarkdownPreviewManager,
	) { }

	public execute(args: { resource: string; imageSource: string }) {
		const source = vscode.Uri.parse(args.resource);
		this._webviewManager.openDocumentLink(args.imageSource, source);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/commands/refreshPreview.ts]---
Location: vscode-main/extensions/markdown-language-features/src/commands/refreshPreview.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Command } from '../commandManager';
import { MarkdownItEngine } from '../markdownEngine';
import { MarkdownPreviewManager } from '../preview/previewManager';

export class RefreshPreviewCommand implements Command {
	public readonly id = 'markdown.preview.refresh';

	public constructor(
		private readonly _webviewManager: MarkdownPreviewManager,
		private readonly _engine: MarkdownItEngine
	) { }

	public execute() {
		this._engine.cleanCache();
		this._webviewManager.refresh();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/commands/reloadPlugins.ts]---
Location: vscode-main/extensions/markdown-language-features/src/commands/reloadPlugins.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Command } from '../commandManager';
import { MarkdownItEngine } from '../markdownEngine';
import { MarkdownPreviewManager } from '../preview/previewManager';

export class ReloadPlugins implements Command {
	public readonly id = 'markdown.api.reloadPlugins';

	public constructor(
		private readonly _webviewManager: MarkdownPreviewManager,
		private readonly _engine: MarkdownItEngine,
	) { }

	public execute(): void {
		this._engine.reloadPlugins();
		this._engine.cleanCache();
		this._webviewManager.refresh();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/commands/renderDocument.ts]---
Location: vscode-main/extensions/markdown-language-features/src/commands/renderDocument.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Command } from '../commandManager';
import { MarkdownItEngine } from '../markdownEngine';
import { ITextDocument } from '../types/textDocument';

export class RenderDocument implements Command {
	public readonly id = 'markdown.api.render';

	public constructor(
		private readonly _engine: MarkdownItEngine
	) { }

	public async execute(document: ITextDocument | string): Promise<string> {
		return (await (this._engine.render(document))).html;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/commands/showPreview.ts]---
Location: vscode-main/extensions/markdown-language-features/src/commands/showPreview.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Command } from '../commandManager';
import { DynamicPreviewSettings, MarkdownPreviewManager } from '../preview/previewManager';
import { TelemetryReporter } from '../telemetryReporter';


interface ShowPreviewSettings {
	readonly sideBySide?: boolean;
	readonly locked?: boolean;
}

async function showPreview(
	webviewManager: MarkdownPreviewManager,
	telemetryReporter: TelemetryReporter,
	uri: vscode.Uri | undefined,
	previewSettings: ShowPreviewSettings,
): Promise<any> {
	let resource = uri;
	if (!(resource instanceof vscode.Uri)) {
		if (vscode.window.activeTextEditor) {
			// we are relaxed and don't check for markdown files
			resource = vscode.window.activeTextEditor.document.uri;
		}
	}

	if (!(resource instanceof vscode.Uri)) {
		if (!vscode.window.activeTextEditor) {
			// this is most likely toggling the preview
			return vscode.commands.executeCommand('markdown.showSource');
		}
		// nothing found that could be shown or toggled
		return;
	}

	const resourceColumn = vscode.window.activeTextEditor?.viewColumn || vscode.ViewColumn.One;
	webviewManager.openDynamicPreview(resource, {
		resourceColumn: resourceColumn,
		previewColumn: previewSettings.sideBySide ? vscode.ViewColumn.Beside : resourceColumn,
		locked: !!previewSettings.locked
	});

	telemetryReporter.sendTelemetryEvent('openPreview', {
		where: previewSettings.sideBySide ? 'sideBySide' : 'inPlace',
		how: (uri instanceof vscode.Uri) ? 'action' : 'pallete'
	});
}

export class ShowPreviewCommand implements Command {
	public readonly id = 'markdown.showPreview';

	public constructor(
		private readonly _webviewManager: MarkdownPreviewManager,
		private readonly _telemetryReporter: TelemetryReporter
	) { }

	public execute(mainUri?: vscode.Uri, allUris?: vscode.Uri[], previewSettings?: DynamicPreviewSettings) {
		for (const uri of Array.isArray(allUris) ? allUris : [mainUri]) {
			showPreview(this._webviewManager, this._telemetryReporter, uri, {
				sideBySide: false,
				locked: previewSettings?.locked
			});
		}
	}
}

export class ShowPreviewToSideCommand implements Command {
	public readonly id = 'markdown.showPreviewToSide';

	public constructor(
		private readonly _webviewManager: MarkdownPreviewManager,
		private readonly _telemetryReporter: TelemetryReporter
	) { }

	public execute(uri?: vscode.Uri, previewSettings?: DynamicPreviewSettings) {
		showPreview(this._webviewManager, this._telemetryReporter, uri, {
			sideBySide: true,
			locked: previewSettings?.locked
		});
	}
}


export class ShowLockedPreviewToSideCommand implements Command {
	public readonly id = 'markdown.showLockedPreviewToSide';

	public constructor(
		private readonly _webviewManager: MarkdownPreviewManager,
		private readonly _telemetryReporter: TelemetryReporter
	) { }

	public execute(uri?: vscode.Uri) {
		showPreview(this._webviewManager, this._telemetryReporter, uri, {
			sideBySide: true,
			locked: true
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/commands/showPreviewSecuritySelector.ts]---
Location: vscode-main/extensions/markdown-language-features/src/commands/showPreviewSecuritySelector.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Command } from '../commandManager';
import { MarkdownPreviewManager } from '../preview/previewManager';
import { PreviewSecuritySelector } from '../preview/security';
import { isMarkdownFile } from '../util/file';

export class ShowPreviewSecuritySelectorCommand implements Command {
	public readonly id = 'markdown.showPreviewSecuritySelector';

	public constructor(
		private readonly _previewSecuritySelector: PreviewSecuritySelector,
		private readonly _previewManager: MarkdownPreviewManager
	) { }

	public execute(resource: string | undefined) {
		if (this._previewManager.activePreviewResource) {
			this._previewSecuritySelector.showSecuritySelectorForResource(this._previewManager.activePreviewResource);
		} else if (resource) {
			const source = vscode.Uri.parse(resource);
			this._previewSecuritySelector.showSecuritySelectorForResource(source.query ? vscode.Uri.parse(source.query) : source);
		} else if (vscode.window.activeTextEditor && isMarkdownFile(vscode.window.activeTextEditor.document)) {
			this._previewSecuritySelector.showSecuritySelectorForResource(vscode.window.activeTextEditor.document.uri);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/commands/showSource.ts]---
Location: vscode-main/extensions/markdown-language-features/src/commands/showSource.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Command } from '../commandManager';
import { MarkdownPreviewManager } from '../preview/previewManager';

export class ShowSourceCommand implements Command {
	public readonly id = 'markdown.showSource';

	public constructor(
		private readonly _previewManager: MarkdownPreviewManager
	) { }

	public execute() {
		const { activePreviewResource, activePreviewResourceColumn } = this._previewManager;
		if (activePreviewResource && activePreviewResourceColumn) {
			return vscode.workspace.openTextDocument(activePreviewResource).then(document => {
				return vscode.window.showTextDocument(document, activePreviewResourceColumn);
			});
		}
		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/commands/toggleLock.ts]---
Location: vscode-main/extensions/markdown-language-features/src/commands/toggleLock.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Command } from '../commandManager';
import { MarkdownPreviewManager } from '../preview/previewManager';

export class ToggleLockCommand implements Command {
	public readonly id = 'markdown.preview.toggleLock';

	public constructor(
		private readonly _previewManager: MarkdownPreviewManager
	) { }

	public execute() {
		this._previewManager.toggleLock();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/languageFeatures/diagnostics.ts]---
Location: vscode-main/extensions/markdown-language-features/src/languageFeatures/diagnostics.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { CommandManager } from '../commandManager';
import { isMarkdownFile } from '../util/file';


// Copied from markdown language service
export enum DiagnosticCode {
	link_noSuchReferences = 'link.no-such-reference',
	link_noSuchHeaderInOwnFile = 'link.no-such-header-in-own-file',
	link_noSuchFile = 'link.no-such-file',
	link_noSuchHeaderInFile = 'link.no-such-header-in-file',
}


class AddToIgnoreLinksQuickFixProvider implements vscode.CodeActionProvider {

	private static readonly _addToIgnoreLinksCommandId = '_markdown.addToIgnoreLinks';

	private static readonly _metadata: vscode.CodeActionProviderMetadata = {
		providedCodeActionKinds: [
			vscode.CodeActionKind.QuickFix
		],
	};

	public static register(selector: vscode.DocumentSelector, commandManager: CommandManager): vscode.Disposable {
		const reg = vscode.languages.registerCodeActionsProvider(selector, new AddToIgnoreLinksQuickFixProvider(), AddToIgnoreLinksQuickFixProvider._metadata);
		const commandReg = commandManager.register({
			id: AddToIgnoreLinksQuickFixProvider._addToIgnoreLinksCommandId,
			execute(resource: vscode.Uri, path: string) {
				const settingId = 'validate.ignoredLinks';
				const config = vscode.workspace.getConfiguration('markdown', resource);
				const paths = new Set(config.get<string[]>(settingId, []));
				paths.add(path);
				config.update(settingId, [...paths], vscode.ConfigurationTarget.WorkspaceFolder);
			}
		});
		return vscode.Disposable.from(reg, commandReg);
	}

	provideCodeActions(document: vscode.TextDocument, _range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, _token: vscode.CancellationToken): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
		const fixes: vscode.CodeAction[] = [];

		for (const diagnostic of context.diagnostics) {
			switch (diagnostic.code) {
				case DiagnosticCode.link_noSuchReferences:
				case DiagnosticCode.link_noSuchHeaderInOwnFile:
				case DiagnosticCode.link_noSuchFile:
				case DiagnosticCode.link_noSuchHeaderInFile: {
					// eslint-disable-next-line local/code-no-any-casts
					const hrefText = (diagnostic as any).data?.hrefText;
					if (hrefText) {
						const fix = new vscode.CodeAction(
							vscode.l10n.t("Exclude '{0}' from link validation.", hrefText),
							vscode.CodeActionKind.QuickFix);

						fix.command = {
							command: AddToIgnoreLinksQuickFixProvider._addToIgnoreLinksCommandId,
							title: '',
							arguments: [document.uri, hrefText],
						};
						fixes.push(fix);
					}
					break;
				}
			}
		}

		return fixes;
	}
}

function registerMarkdownStatusItem(selector: vscode.DocumentSelector, commandManager: CommandManager): vscode.Disposable {
	const statusItem = vscode.languages.createLanguageStatusItem('markdownStatus', selector);

	const enabledSettingId = 'validate.enabled';
	const commandId = '_markdown.toggleValidation';

	const commandSub = commandManager.register({
		id: commandId,
		execute: (enabled: boolean) => {
			vscode.workspace.getConfiguration('markdown').update(enabledSettingId, enabled);
		}
	});

	const update = () => {
		const activeDoc = vscode.window.activeTextEditor?.document;
		const markdownDoc = activeDoc && isMarkdownFile(activeDoc) ? activeDoc : undefined;

		const enabled = vscode.workspace.getConfiguration('markdown', markdownDoc).get(enabledSettingId);
		if (enabled) {
			statusItem.text = vscode.l10n.t('Markdown link validation enabled');
			statusItem.command = {
				command: commandId,
				arguments: [false],
				title: vscode.l10n.t('Disable'),
				tooltip: vscode.l10n.t('Disable validation of Markdown links'),
			};
		} else {
			statusItem.text = vscode.l10n.t('Markdown link validation disabled');
			statusItem.command = {
				command: commandId,
				arguments: [true],
				title: vscode.l10n.t('Enable'),
				tooltip: vscode.l10n.t('Enable validation of Markdown links'),
			};
		}
	};
	update();

	return vscode.Disposable.from(
		statusItem,
		commandSub,
		vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('markdown.' + enabledSettingId)) {
				update();
			}
		}),
	);
}

export function registerDiagnosticSupport(
	selector: vscode.DocumentSelector,
	commandManager: CommandManager,
): vscode.Disposable {
	return vscode.Disposable.from(
		AddToIgnoreLinksQuickFixProvider.register(selector, commandManager),
		registerMarkdownStatusItem(selector, commandManager),
	);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/languageFeatures/fileReferences.ts]---
Location: vscode-main/extensions/markdown-language-features/src/languageFeatures/fileReferences.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import type * as lsp from 'vscode-languageserver-types';
import { MdLanguageClient } from '../client/client';
import { Command, CommandManager } from '../commandManager';


export class FindFileReferencesCommand implements Command {

	public readonly id = 'markdown.findAllFileReferences';

	constructor(
		private readonly _client: MdLanguageClient,
	) { }

	public async execute(resource?: vscode.Uri) {
		resource ??= vscode.window.activeTextEditor?.document.uri;
		if (!resource) {
			vscode.window.showErrorMessage(vscode.l10n.t("Find file references failed. No resource provided."));
			return;
		}

		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Window,
			title: vscode.l10n.t("Finding file references")
		}, async (_progress, token) => {
			const locations = (await this._client.getReferencesToFileInWorkspace(resource, token)).map(loc => {
				return new vscode.Location(vscode.Uri.parse(loc.uri), convertRange(loc.range));
			});

			const config = vscode.workspace.getConfiguration('references');
			const existingSetting = config.inspect<string>('preferredLocation');

			await config.update('preferredLocation', 'view');
			try {
				await vscode.commands.executeCommand('editor.action.showReferences', resource, new vscode.Position(0, 0), locations);
			} finally {
				await config.update('preferredLocation', existingSetting?.workspaceFolderValue ?? existingSetting?.workspaceValue);
			}
		});
	}
}

export function convertRange(range: lsp.Range): vscode.Range {
	return new vscode.Range(range.start.line, range.start.character, range.end.line, range.end.character);
}

export function registerFindFileReferenceSupport(
	commandManager: CommandManager,
	client: MdLanguageClient,
): vscode.Disposable {
	return commandManager.register(new FindFileReferencesCommand(client));
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/markdown-language-features/src/languageFeatures/linkUpdater.ts]---
Location: vscode-main/extensions/markdown-language-features/src/languageFeatures/linkUpdater.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as picomatch from 'picomatch';
import * as vscode from 'vscode';
import { TextDocumentEdit } from 'vscode-languageclient';
import { Utils } from 'vscode-uri';
import { MdLanguageClient } from '../client/client';
import { Delayer } from '../util/async';
import { noopToken } from '../util/cancellation';
import { Disposable } from '../util/dispose';
import { convertRange } from './fileReferences';


const settingNames = Object.freeze({
	enabled: 'updateLinksOnFileMove.enabled',
	include: 'updateLinksOnFileMove.include',
	enableForDirectories: 'updateLinksOnFileMove.enableForDirectories',
});

const enum UpdateLinksOnFileMoveSetting {
	Prompt = 'prompt',
	Always = 'always',
	Never = 'never',
}

interface RenameAction {
	readonly oldUri: vscode.Uri;
	readonly newUri: vscode.Uri;
}

class UpdateLinksOnFileRenameHandler extends Disposable {

	private readonly _delayer = new Delayer(50);
	private readonly _pendingRenames = new Set<RenameAction>();

	public constructor(
		private readonly _client: MdLanguageClient,
	) {
		super();

		this._register(vscode.workspace.onDidRenameFiles(async (e) => {
			await Promise.all(e.files.map(async (rename) => {
				if (await this._shouldParticipateInLinkUpdate(rename.newUri)) {
					this._pendingRenames.add(rename);
				}
			}));

			if (this._pendingRenames.size) {
				this._delayer.trigger(() => {
					vscode.window.withProgress({
						location: vscode.ProgressLocation.Window,
						title: vscode.l10n.t("Checking for Markdown links to update")
					}, () => this._flushRenames());
				});
			}
		}));
	}

	private async _flushRenames(): Promise<void> {
		const renames = Array.from(this._pendingRenames);
		this._pendingRenames.clear();

		const result = await this._getEditsForFileRename(renames, noopToken);

		if (result?.edit.size) {
			if (await this._confirmActionWithUser(result.resourcesBeingRenamed)) {
				await vscode.workspace.applyEdit(result.edit);
			}
		}
	}

	private async _confirmActionWithUser(newResources: readonly vscode.Uri[]): Promise<boolean> {
		if (!newResources.length) {
			return false;
		}

		const config = vscode.workspace.getConfiguration('markdown', newResources[0]);
		const setting = config.get<UpdateLinksOnFileMoveSetting>(settingNames.enabled);
		switch (setting) {
			case UpdateLinksOnFileMoveSetting.Prompt:
				return this._promptUser(newResources);
			case UpdateLinksOnFileMoveSetting.Always:
				return true;
			case UpdateLinksOnFileMoveSetting.Never:
			default:
				return false;
		}
	}
	private async _shouldParticipateInLinkUpdate(newUri: vscode.Uri): Promise<boolean> {
		const config = vscode.workspace.getConfiguration('markdown', newUri);
		const setting = config.get<UpdateLinksOnFileMoveSetting>(settingNames.enabled);
		if (setting === UpdateLinksOnFileMoveSetting.Never) {
			return false;
		}

		const externalGlob = config.get<string[]>(settingNames.include);
		if (externalGlob) {
			for (const glob of externalGlob) {
				if (picomatch.isMatch(newUri.fsPath, glob)) {
					return true;
				}
			}
		}

		const stat = await vscode.workspace.fs.stat(newUri);
		if (stat.type === vscode.FileType.Directory) {
			return config.get<boolean>(settingNames.enableForDirectories, true);
		}

		return false;
	}

	private async _promptUser(newResources: readonly vscode.Uri[]): Promise<boolean> {
		if (!newResources.length) {
			return false;
		}

		const rejectItem: vscode.MessageItem = {
			title: vscode.l10n.t("No"),
			isCloseAffordance: true,
		};

		const acceptItem: vscode.MessageItem = {
			title: vscode.l10n.t("Yes"),
		};

		const alwaysItem: vscode.MessageItem = {
			title: vscode.l10n.t("Always"),
		};

		const neverItem: vscode.MessageItem = {
			title: vscode.l10n.t("Never"),
		};

		const choice = await vscode.window.showInformationMessage(
			newResources.length === 1
				? vscode.l10n.t("Update Markdown links for '{0}'?", Utils.basename(newResources[0]))
				: this._getConfirmMessage(vscode.l10n.t("Update Markdown links for the following {0} files?", newResources.length), newResources), {
			modal: true,
		}, rejectItem, acceptItem, alwaysItem, neverItem);

		switch (choice) {
			case acceptItem: {
				return true;
			}
			case rejectItem: {
				return false;
			}
			case alwaysItem: {
				const config = vscode.workspace.getConfiguration('markdown', newResources[0]);
				config.update(
					settingNames.enabled,
					UpdateLinksOnFileMoveSetting.Always,
					this._getConfigTargetScope(config, settingNames.enabled));
				return true;
			}
			case neverItem: {
				const config = vscode.workspace.getConfiguration('markdown', newResources[0]);
				config.update(
					settingNames.enabled,
					UpdateLinksOnFileMoveSetting.Never,
					this._getConfigTargetScope(config, settingNames.enabled));
				return false;
			}
			default: {
				return false;
			}
		}
	}

	private async _getEditsForFileRename(renames: readonly RenameAction[], token: vscode.CancellationToken): Promise<{ edit: vscode.WorkspaceEdit; resourcesBeingRenamed: vscode.Uri[] } | undefined> {
		const result = await this._client.getEditForFileRenames(renames.map(rename => ({ oldUri: rename.oldUri.toString(), newUri: rename.newUri.toString() })), token);
		if (!result?.edit.documentChanges?.length) {
			return undefined;
		}

		const workspaceEdit = new vscode.WorkspaceEdit();

		for (const change of result.edit.documentChanges as TextDocumentEdit[]) {
			const uri = vscode.Uri.parse(change.textDocument.uri);
			for (const edit of change.edits) {
				workspaceEdit.replace(uri, convertRange(edit.range), edit.newText);
			}
		}

		return {
			edit: workspaceEdit,
			resourcesBeingRenamed: result.participatingRenames.map(x => vscode.Uri.parse(x.newUri)),
		};
	}

	private _getConfirmMessage(start: string, resourcesToConfirm: readonly vscode.Uri[]): string {
		const MAX_CONFIRM_FILES = 10;

		const paths = [start];
		paths.push('');
		paths.push(...resourcesToConfirm.slice(0, MAX_CONFIRM_FILES).map(r => Utils.basename(r)));

		if (resourcesToConfirm.length > MAX_CONFIRM_FILES) {
			if (resourcesToConfirm.length - MAX_CONFIRM_FILES === 1) {
				paths.push(vscode.l10n.t("...1 additional file not shown"));
			} else {
				paths.push(vscode.l10n.t("...{0} additional files not shown", resourcesToConfirm.length - MAX_CONFIRM_FILES));
			}
		}

		paths.push('');
		return paths.join('\n');
	}

	private _getConfigTargetScope(config: vscode.WorkspaceConfiguration, settingsName: string): vscode.ConfigurationTarget {
		const inspected = config.inspect(settingsName);
		if (inspected?.workspaceFolderValue) {
			return vscode.ConfigurationTarget.WorkspaceFolder;
		}

		if (inspected?.workspaceValue) {
			return vscode.ConfigurationTarget.Workspace;
		}

		return vscode.ConfigurationTarget.Global;
	}
}

export function registerUpdateLinksOnRename(client: MdLanguageClient): vscode.Disposable {
	return new UpdateLinksOnFileRenameHandler(client);
}
```

--------------------------------------------------------------------------------

````
