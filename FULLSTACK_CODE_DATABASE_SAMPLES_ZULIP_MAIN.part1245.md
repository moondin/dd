---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1245
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1245 of 1290)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - zulip-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/zulip-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: event_for_exception_golang.json]---
Location: zulip-main/zerver/webhooks/sentry/fixtures/event_for_exception_golang.json

```json
{
    "action": "triggered",
    "data": {
        "event": {
            "event_id": "80777a9cc30e4d0eb8904333d5c298b0",
            "project": 5216640,
            "release": null,
            "dist": null,
            "platform": "go",
            "message": "",
            "datetime": "2020-04-29T11:23:45.978469Z",
            "tags": [
                [
                    "level",
                    "error"
                ],
                [
                    "os.name",
                    "linux"
                ],
                [
                    "runtime",
                    "go go1.14.1"
                ],
                [
                    "runtime.name",
                    "go"
                ],
                [
                    "server_name",
                    "hp-pavilion"
                ]
            ],
            "_metrics": {
                "bytes.ingested.event": 1225,
                "bytes.stored.event": 2231
            },
            "contexts": {
                "device": {
                    "num_cpu": 8,
                    "arch": "amd64",
                    "type": "device"
                },
                "runtime": {
                    "name": "go",
                    "go_numcgocalls": 1,
                    "go_numroutines": 2,
                    "version": "go1.14.1",
                    "go_maxprocs": 8,
                    "type": "runtime"
                },
                "os": {
                    "type": "os",
                    "name": "linux"
                }
            },
            "culprit": "main in main",
            "exception": {
                "values": [
                    {
                        "type": "*http.badStringError",
                        "value": "unsupported protocol scheme \"\""
                    },
                    {
                        "stacktrace": {
                            "frames": [
                                {
                                    "function": "main",
                                    "abs_path": "/home/hemanth/Desktop/sentry/trigger-exception.go",
                                    "errors": null,
                                    "pre_context": [
                                        "    // Set the timeout to the maximum duration the program can afford to wait.",
                                        "    defer sentry.Flush(2 * time.Second)",
                                        "",
                                        "    resp, err := http.Get(os.Args[1])",
                                        "    if err != nil {"
                                    ],
                                    "post_context": [
                                        "        log.Printf(\"reported to Sentry: %s\", err)",
                                        "        return",
                                        "    }",
                                        "    defer resp.Body.Close()",
                                        ""
                                    ],
                                    "vars": null,
                                    "package": null,
                                    "context_line": "        sentry.CaptureException(err)",
                                    "symbol": null,
                                    "image_addr": null,
                                    "module": "main",
                                    "in_app": false,
                                    "symbol_addr": null,
                                    "filename": "trigger-exception.go",
                                    "lineno": 45,
                                    "colno": null,
                                    "trust": null,
                                    "data": {
                                        "orig_in_app": 1
                                    },
                                    "platform": null,
                                    "instruction_addr": null,
                                    "raw_function": null
                                }
                            ]
                        },
                        "type": "*url.Error",
                        "value": "Get \"bad_url\": unsupported protocol scheme \"\""
                    }
                ]
            },
            "fingerprint": [
                "{{ default }}"
            ],
            "grouping_config": {
                "enhancements": "eJybzDhxY3J-bm5-npWRgaGlroGxrpHxBABcTQcY",
                "id": "newstyle:2019-10-29"
            },
            "hashes": [
                "acfd5581b952e2955c28d0d4615b2eeb",
                "62313c010c35c98db6151e708d658e61"
            ],
            "key_id": "1146336",
            "level": "error",
            "location": "trigger-exception.go",
            "logger": "",
            "metadata": {
                "function": "main",
                "type": "*url.Error",
                "value": "Get \"bad_url\": unsupported protocol scheme \"\"",
                "filename": "trigger-exception.go"
            },
            "received": 1588159427.160184,
            "sdk": {
                "version": "0.6.0",
                "name": "sentry.go",
                "packages": [
                    {
                        "version": "0.6.0",
                        "name": "sentry-go"
                    }
                ],
                "integrations": [
                    "ContextifyFrames",
                    "Environment",
                    "IgnoreErrors",
                    "Modules"
                ]
            },
            "timestamp": 1588159425.978469,
            "title": "*url.Error: Get \"bad_url\": unsupported protocol scheme \"\"",
            "type": "error",
            "version": "7",
            "url": "https://sentry.io/api/0/projects/hypro999-personal-organization/zulip-integration-testing/events/80777a9cc30e4d0eb8904333d5c298b0/",
            "web_url": "https://sentry.io/organizations/hypro999-personal-organization/issues/1637164584/events/80777a9cc30e4d0eb8904333d5c298b0/",
            "issue_url": "https://sentry.io/api/0/issues/1637164584/"
        },
        "triggered_rule": "Send a webhook payload to Webhook.site"
    },
    "installation": {
        "uuid": "65027794-169a-4042-80d0-808ece377141"
    },
    "actor": {
        "type": "application",
        "id": "sentry",
        "name": "Sentry"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: event_for_exception_js.json]---
Location: zulip-main/zerver/webhooks/sentry/fixtures/event_for_exception_js.json

```json
{
    "action": "triggered",
    "data": {
        "event": {
            "event_id": "355c3b2a142046629dd410db2fdda003",
            "project": 5216640,
            "release": null,
            "dist": null,
            "platform": "javascript",
            "message": "",
            "datetime": "2020-06-17T14:42:54.656000Z",
            "tags": [
                ["browser", "Firefox 77.0"],
                ["browser.name", "Firefox"],
                ["handled", "yes"],
                ["level", "error"],
                ["mechanism", "generic"],
                ["os.name", "Ubuntu"],
                ["user", "ip:223.230.114.198"],
                [
                    "url",
                    "file:///mnt/data/Documents/Stuff%20for%20Zulip/Repos/sentry/js/trigger-exception-with-external.html"
                ]
            ],
            "_metrics": {
                "bytes.ingested.event": 876,
                "flag.processing.error": true,
                "bytes.stored.event": 2637
            },
            "contexts": {
                "os": {
                    "type": "os",
                    "name": "Ubuntu"
                },
                "browser": {
                    "version": "77.0",
                    "type": "browser",
                    "name": "Firefox"
                }
            },
            "culprit": "?(/mnt/data/Documents/Stuff%20for%20Zulip/Repos/sentry/js/external.js)",
            "errors": [
                {
                    "url": "file:///mnt/data/Documents/Stuff%20for%20Zulip/Repos/sentry/js/external.js",
                    "type": "js_no_source"
                }
            ],
            "exception": {
                "values": [
                    {
                        "stacktrace": {
                            "frames": [
                                {
                                    "abs_path": "file:///mnt/data/Documents/Stuff%20for%20Zulip/Repos/sentry/js/external.js",
                                    "filename": "/mnt/data/Documents/Stuff%20for%20Zulip/Repos/sentry/js/external.js",
                                    "colno": 25,
                                    "data": {
                                        "orig_in_app": 1
                                    },
                                    "lineno": 4
                                }
                            ]
                        },
                        "type": "Error",
                        "mechanism": {
                            "synthetic": null,
                            "help_link": null,
                            "type": "generic",
                            "meta": null,
                            "handled": true,
                            "data": null,
                            "description": null
                        },
                        "value": "Something external broke."
                    }
                ]
            },
            "fingerprint": ["{{ default }}"],
            "grouping_config": {
                "enhancements": "eJybzDhxY3J-bm5-npWRgaGlroGxrpHxBABcTQcY",
                "id": "newstyle:2019-10-29"
            },
            "hashes": ["2058ed8b75cb570c9646adcd9dc21843"],
            "key_id": "1146336",
            "level": "error",
            "location": null,
            "logger": "",
            "metadata": {
                "type": "Error",
                "filename": "/mnt/data/Documents/Stuff%20for%20Zulip/Repos/sentry/js/external.js",
                "value": "Something external broke."
            },
            "received": 1592406695.060435,
            "request": {
                "cookies": null,
                "url": "file:///mnt/data/Documents/Stuff%20for%20Zulip/Repos/sentry/js/trigger-exception-with-external.html",
                "headers": [
                    [
                        "User-Agent",
                        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:77.0) Gecko/20100101 Firefox/77.0"
                    ]
                ],
                "env": null,
                "fragment": null,
                "query_string": [],
                "data": null,
                "method": null,
                "inferred_content_type": null
            },
            "sdk": {
                "version": "5.17.0",
                "name": "sentry.javascript.browser",
                "packages": [
                    {
                        "version": "5.17.0",
                        "name": "npm:@sentry/browser"
                    }
                ],
                "integrations": [
                    "InboundFilters",
                    "FunctionToString",
                    "TryCatch",
                    "Breadcrumbs",
                    "GlobalHandlers",
                    "LinkedErrors",
                    "UserAgent"
                ]
            },
            "timestamp": 1592404974.656,
            "title": "Error: Something external broke.",
            "type": "error",
            "user": {
                "geo": {
                    "city": "Hyderabad",
                    "region": "India",
                    "country_code": "IN"
                },
                "ip_address": "223.230.114.198"
            },
            "version": "7",
            "url": "https://sentry.io/api/0/projects/hypro999-personal-organization/zulip-integration-testing/events/355c3b2a142046629dd410db2fdda003/",
            "web_url": "https://sentry.io/organizations/hypro999-personal-organization/issues/1731239773/events/355c3b2a142046629dd410db2fdda003/",
            "issue_url": "https://sentry.io/api/0/issues/1731239773/"
        },
        "triggered_rule": "Send a webhook payload to Webhook.site"
    },
    "installation": {
        "uuid": "65027794-169a-4042-80d0-808ece377141"
    },
    "actor": {
        "type": "application",
        "id": "sentry",
        "name": "Sentry"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: event_for_exception_node.json]---
Location: zulip-main/zerver/webhooks/sentry/fixtures/event_for_exception_node.json
Signals: Next.js

```json
{
    "action": "triggered",
    "data": {
        "event": {
            "event_id": "f9cb0f2afff74a5aa92e766fb7ac3fe3",
            "project": 5216640,
            "release": null,
            "dist": null,
            "platform": "node",
            "message": "",
            "datetime": "2020-04-30T06:19:33.562812Z",
            "tags": [
                [
                    "handled",
                    "yes"
                ],
                [
                    "level",
                    "error"
                ],
                [
                    "mechanism",
                    "generic"
                ]
            ],
            "_metrics": {
                "bytes.ingested.event": 4145,
                "bytes.stored.event": 7690
            },
            "culprit": "null.<anonymous>(trigger-exception)",
            "errors": [
                {
                    "url": "/home/hemanth/Desktop/sentry/trigger-exception.js",
                    "type": "js_no_source"
                }
            ],
            "exception": {
                "values": [
                    {
                        "stacktrace": {
                            "frames": [
                                {
                                    "function": "Module._load",
                                    "abs_path": "module.js",
                                    "errors": null,
                                    "pre_context": null,
                                    "vars": null,
                                    "package": null,
                                    "context_line": null,
                                    "symbol": null,
                                    "image_addr": null,
                                    "post_context": null,
                                    "in_app": false,
                                    "symbol_addr": null,
                                    "filename": "module.js",
                                    "module": "module",
                                    "colno": 3,
                                    "raw_function": null,
                                    "trust": null,
                                    "data": null,
                                    "platform": null,
                                    "instruction_addr": null,
                                    "lineno": 497
                                },
                                {
                                    "function": "tryModuleLoad",
                                    "abs_path": "module.js",
                                    "errors": null,
                                    "pre_context": null,
                                    "vars": null,
                                    "package": null,
                                    "context_line": null,
                                    "symbol": null,
                                    "image_addr": null,
                                    "post_context": null,
                                    "in_app": false,
                                    "symbol_addr": null,
                                    "filename": "module.js",
                                    "module": "module",
                                    "colno": 12,
                                    "raw_function": null,
                                    "trust": null,
                                    "data": null,
                                    "platform": null,
                                    "instruction_addr": null,
                                    "lineno": 505
                                },
                                {
                                    "function": "Module.load",
                                    "abs_path": "module.js",
                                    "errors": null,
                                    "pre_context": null,
                                    "vars": null,
                                    "package": null,
                                    "context_line": null,
                                    "symbol": null,
                                    "image_addr": null,
                                    "post_context": null,
                                    "in_app": false,
                                    "symbol_addr": null,
                                    "filename": "module.js",
                                    "module": "module",
                                    "colno": 32,
                                    "raw_function": null,
                                    "trust": null,
                                    "data": null,
                                    "platform": null,
                                    "instruction_addr": null,
                                    "lineno": 565
                                },
                                {
                                    "function": "Module._extensions..js",
                                    "abs_path": "module.js",
                                    "errors": null,
                                    "pre_context": null,
                                    "vars": null,
                                    "package": null,
                                    "context_line": null,
                                    "symbol": null,
                                    "image_addr": null,
                                    "post_context": null,
                                    "in_app": false,
                                    "symbol_addr": null,
                                    "filename": "module.js",
                                    "module": "module",
                                    "colno": 10,
                                    "raw_function": null,
                                    "trust": null,
                                    "data": null,
                                    "platform": null,
                                    "instruction_addr": null,
                                    "lineno": 663
                                },
                                {
                                    "function": "Module._compile",
                                    "abs_path": "module.js",
                                    "errors": null,
                                    "pre_context": null,
                                    "vars": null,
                                    "package": null,
                                    "context_line": null,
                                    "symbol": null,
                                    "image_addr": null,
                                    "post_context": null,
                                    "in_app": false,
                                    "symbol_addr": null,
                                    "filename": "module.js",
                                    "module": "module",
                                    "colno": 30,
                                    "raw_function": null,
                                    "trust": null,
                                    "data": null,
                                    "platform": null,
                                    "instruction_addr": null,
                                    "lineno": 652
                                },
                                {
                                    "function": "Object.<anonymous>",
                                    "abs_path": "/home/hemanth/Desktop/sentry/trigger-exception.js",
                                    "errors": null,
                                    "pre_context": [
                                        "const Sentry = require('@sentry/node');",
                                        "",
                                        "Sentry.init({",
                                        "  dsn: 'https://redacted.ingest.sentry.io/5216640',",
                                        "});",
                                        ""
                                    ],
                                    "post_context": [
                                        "  scope.addEventProcessor(function(event, hint) {",
                                        "    return event;",
                                        "  });",
                                        "  Sentry.captureException(new Error('Sample error from node.'));",
                                        "});",
                                        "",
                                        ""
                                    ],
                                    "vars": null,
                                    "package": null,
                                    "context_line": "Sentry.withScope(function(scope) {",
                                    "symbol": null,
                                    "image_addr": null,
                                    "module": "trigger-exception",
                                    "in_app": true,
                                    "symbol_addr": null,
                                    "filename": "/home/hemanth/Desktop/sentry/trigger-exception.js",
                                    "lineno": 7,
                                    "colno": 8,
                                    "trust": null,
                                    "data": null,
                                    "platform": null,
                                    "instruction_addr": null,
                                    "raw_function": null
                                },
                                {
                                    "function": "Object.withScope",
                                    "abs_path": "/home/hemanth/Desktop/sentry/node_modules/@sentry/minimal/dist/index.js",
                                    "errors": null,
                                    "pre_context": [
                                        " *     pushScope();",
                                        " *     callback();",
                                        " *     popScope();",
                                        " *",
                                        " * @param callback that will be enclosed into push/popScope.",
                                        " */",
                                        "function withScope(callback) {"
                                    ],
                                    "post_context": [
                                        "}",
                                        "exports.withScope = withScope;",
                                        "/**",
                                        " * Calls a function on the latest client. Use this with caution, it's meant as",
                                        " * in \"internal\" helper so we don't need to expose every possible function in",
                                        " * the shim. It is not guaranteed that the client actually implements the",
                                        " * function."
                                    ],
                                    "vars": null,
                                    "package": null,
                                    "context_line": "    callOnHub('withScope', callback);",
                                    "symbol": null,
                                    "image_addr": null,
                                    "module": "@sentry.minimal.dist:index",
                                    "in_app": false,
                                    "symbol_addr": null,
                                    "filename": "/home/hemanth/Desktop/sentry/node_modules/@sentry/minimal/dist/index.js",
                                    "lineno": 158,
                                    "colno": 5,
                                    "trust": null,
                                    "data": null,
                                    "platform": null,
                                    "instruction_addr": null,
                                    "raw_function": null
                                },
                                {
                                    "function": "callOnHub",
                                    "abs_path": "/home/hemanth/Desktop/sentry/node_modules/@sentry/minimal/dist/index.js",
                                    "errors": null,
                                    "pre_context": [
                                        "    var args = [];",
                                        "    for (var _i = 1; _i < arguments.length; _i++) {",
                                        "        args[_i - 1] = arguments[_i];",
                                        "    }",
                                        "    var hub = hub_1.getCurrentHub();",
                                        "    if (hub && hub[method]) {",
                                        "        // tslint:disable-next-line:no-unsafe-any"
                                    ],
                                    "post_context": [
                                        "    }",
                                        "    throw new Error(\"No hub defined or \" + method + \" was not found on the hub, please open a bug report.\");",
                                        "}",
                                        "/**",
                                        " * Captures an exception event and sends it to Sentry.",
                                        " *",
                                        " * @param exception An exception-like object."
                                    ],
                                    "vars": null,
                                    "package": null,
                                    "context_line": "        return hub[method].apply(hub, tslib_1.__spread(args));",
                                    "symbol": null,
                                    "image_addr": null,
                                    "module": "@sentry.minimal.dist:index",
                                    "in_app": false,
                                    "symbol_addr": null,
                                    "filename": "/home/hemanth/Desktop/sentry/node_modules/@sentry/minimal/dist/index.js",
                                    "lineno": 17,
                                    "colno": 28,
                                    "trust": null,
                                    "data": null,
                                    "platform": null,
                                    "instruction_addr": null,
                                    "raw_function": null
                                },
                                {
                                    "function": "Hub.withScope",
                                    "abs_path": "/home/hemanth/Desktop/sentry/node_modules/@sentry/hub/dist/hub.js",
                                    "errors": null,
                                    "pre_context": [
                                        "    };",
                                        "    /**",
                                        "     * @inheritDoc",
                                        "     */",
                                        "    Hub.prototype.withScope = function (callback) {",
                                        "        var scope = this.pushScope();",
                                        "        try {"
                                    ],
                                    "post_context": [
                                        "        }",
                                        "        finally {",
                                        "            this.popScope();",
                                        "        }",
                                        "    };",
                                        "    /**",
                                        "     * @inheritDoc"
                                    ],
                                    "vars": null,
                                    "package": null,
                                    "context_line": "            callback(scope);",
                                    "symbol": null,
                                    "image_addr": null,
                                    "module": "@sentry.hub.dist:hub",
                                    "in_app": false,
                                    "symbol_addr": null,
                                    "filename": "/home/hemanth/Desktop/sentry/node_modules/@sentry/hub/dist/hub.js",
                                    "lineno": 103,
                                    "colno": 13,
                                    "trust": null,
                                    "data": null,
                                    "platform": null,
                                    "instruction_addr": null,
                                    "raw_function": null
                                },
                                {
                                    "function": "null.<anonymous>",
                                    "abs_path": "/home/hemanth/Desktop/sentry/trigger-exception.js",
                                    "errors": null,
                                    "pre_context": [
                                        "  dsn: 'https://redacted.ingest.sentry.io/5216640',",
                                        "});",
                                        "",
                                        "Sentry.withScope(function(scope) {",
                                        "  scope.addEventProcessor(function(event, hint) {",
                                        "    return event;",
                                        "  });"
                                    ],
                                    "post_context": [
                                        "});",
                                        "",
                                        ""
                                    ],
                                    "vars": null,
                                    "package": null,
                                    "context_line": "  Sentry.captureException(new Error('Sample error from node.'));",
                                    "symbol": null,
                                    "image_addr": null,
                                    "module": "trigger-exception",
                                    "in_app": true,
                                    "symbol_addr": null,
                                    "filename": "/home/hemanth/Desktop/sentry/trigger-exception.js",
                                    "lineno": 11,
                                    "colno": 27,
                                    "trust": null,
                                    "data": null,
                                    "platform": null,
                                    "instruction_addr": null,
                                    "raw_function": null
                                }
                            ]
                        },
                        "type": "Error",
                        "mechanism": {
                            "synthetic": null,
                            "help_link": null,
                            "type": "generic",
                            "meta": null,
                            "handled": true,
                            "data": null,
                            "description": null
                        },
                        "value": "Sample error from node."
                    }
                ]
            },
            "fingerprint": [
                "{{ default }}"
            ],
            "grouping_config": {
                "enhancements": "eJybzDhxY3J-bm5-npWRgaGlroGxrpHxBABcTQcY",
                "id": "newstyle:2019-10-29"
            },
            "hashes": [
                "0f8707d55b9a07f1d98f7f411ae91921",
                "2b51fa6978fa72e1a400507643d03846"
            ],
            "key_id": "1146336",
            "level": "error",
            "location": "/home/hemanth/Desktop/sentry/trigger-exception.js",
            "logger": "",
            "metadata": {
                "function": "null.<anonymous>",
                "type": "Error",
                "value": "Sample error from node.",
                "filename": "/home/hemanth/Desktop/sentry/trigger-exception.js"
            },
            "received": 1588227573.562812,
            "sdk": {
                "version": "5.15.5",
                "name": "sentry.javascript.node",
                "packages": [
                    {
                        "version": "5.15.5",
                        "name": "npm:@sentry/node"
                    }
                ],
                "integrations": [
                    "InboundFilters",
                    "FunctionToString",
                    "Console",
                    "Http",
                    "OnUncaughtException",
                    "OnUnhandledRejection",
                    "LinkedErrors"
                ]
            },
            "timestamp": 1588227573.562812,
            "title": "Error: Sample error from node.",
            "type": "error",
            "version": "7",
            "url": "https://sentry.io/api/0/projects/hypro999-personal-organization/zulip-integration-testing/events/f9cb0f2afff74a5aa92e766fb7ac3fe3/",
            "web_url": "https://sentry.io/organizations/hypro999-personal-organization/issues/1638852747/events/f9cb0f2afff74a5aa92e766fb7ac3fe3/",
            "issue_url": "https://sentry.io/api/0/issues/1638852747/"
        },
        "triggered_rule": "Send a webhook payload to Webhook.site"
    },
    "installation": {
        "uuid": "65027794-169a-4042-80d0-808ece377141"
    },
    "actor": {
        "type": "application",
        "id": "sentry",
        "name": "Sentry"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: event_for_exception_python.json]---
Location: zulip-main/zerver/webhooks/sentry/fixtures/event_for_exception_python.json

```json
{
  "action": "triggered",
  "data": {
    "event": {
      "event_id": "599349254a1447a99774b5310711c1a8",
      "project": 5216640,
      "release": null,
      "dist": null,
      "platform": "python",
      "message": "",
      "datetime": "2020-04-28T13:56:05.903736Z",
      "tags": [
        [
          "level",
          "error"
        ],
        [
          "runtime",
          "CPython 3.6.9"
        ],
        [
          "runtime.name",
          "CPython"
        ],
        [
          "server_name",
          "hp-pavilion"
        ]
      ],
      "_meta": {
        "exception": {
          "values": {
            "0": {
              "stacktrace": {
                "frames": {
                  "0": {
                    "vars": {
                      "": {
                        "len": 11
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "_metrics": {
        "bytes.ingested.event": 1972,
        "bytes.stored.event": 2666
      },
      "contexts": {
        "runtime": {
          "version": "3.6.9",
          "type": "runtime",
          "name": "CPython",
          "build": "3.6.9 (default, Apr 18 2020, 01:56:04) \n[GCC 8.4.0]"
        }
      },
      "culprit": "__main__ in <module>",
      "exception": {
        "values": [
          {
            "stacktrace": {
              "frames": [
                {
                  "function": "<module>",
                  "abs_path": "/home/hemanth/Desktop/sentry/trigger-exception.py",
                  "errors": null,
                  "pre_context": [
                    "",
                    "",
                    "if __name__ == \"__main__\":",
                    "    sentry_sdk.init(dsn=SECRET_DSN)",
                    "    try:"
                  ],
                  "post_context": [
                    "    except Exception as e:",
                    "        sentry_sdk.capture_exception(e)",
                    ""
                  ],
                  "vars": {
                    "__spec__": "None",
                    "__builtins__": "<module 'builtins' (built-in)>",
                    "__annotations__": {},
                    "__file__": "'trigger-exception.py'",
                    "__loader__": "<_frozen_importlib_external.SourceFileLoader object at 0x7f9bedf106d8>",
                    "__cached__": "None",
                    "__name__": "'__main__'",
                    "__package__": "None",
                    "__doc__": "None",
                    "sentry_sdk": "<module 'sentry_sdk' from '/home/hemanth/Desktop/sentry/venv/local/lib/python3.6/site-packages/sentry_sdk/__init__.py'>"
                  },
                  "package": null,
                  "context_line": "        raise Exception(\"Custom exception!\")",
                  "symbol": null,
                  "image_addr": null,
                  "module": "__main__",
                  "in_app": false,
                  "symbol_addr": null,
                  "filename": "trigger-exception.py",
                  "lineno": 7,
                  "colno": null,
                  "trust": null,
                  "data": {
                    "orig_in_app": 1
                  },
                  "platform": null,
                  "instruction_addr": null,
                  "raw_function": null
                }
              ]
            },
            "type": "Exception",
            "value": "Custom exception!"
          }
        ]
      },
      "extra": {
        "sys.argv": [
          "trigger-exception.py"
        ]
      },
      "fingerprint": [
        "{{ default }}"
      ],
      "grouping_config": {
        "enhancements": "eJybzDhxY3J-bm5-npWRgaGlroGxrpHxBABcTQcY",
        "id": "newstyle:2019-10-29"
      },
      "hashes": [
        "448593f0ce4993462d80e817945a3190"
      ],
      "key_id": "1146336",
      "level": "error",
      "location": "trigger-exception.py",
      "logger": "",
      "metadata": {
        "function": "<module>",
        "type": "Exception",
        "value": "Custom exception!",
        "filename": "trigger-exception.py"
      },
      "modules": {
        "wheel": "0.34.2",
        "pkg-resources": "0.0.0",
        "sentry-sdk": "0.14.3",
        "urllib3": "1.25.9",
        "setuptools": "46.1.3",
        "pip": "20.0.2",
        "certifi": "2020.4.5.1"
      },
      "received": 1588082166.991354,
      "sdk": {
        "version": "0.14.3",
        "name": "sentry.python",
        "packages": [
          {
            "version": "0.14.3",
            "name": "pypi:sentry-sdk"
          }
        ],
        "integrations": [
          "argv",
          "atexit",
          "dedupe",
          "excepthook",
          "logging",
          "modules",
          "stdlib",
          "threading"
        ]
      },
      "timestamp": 1588082165.903736,
      "title": "Exception: Custom exception!",
      "type": "error",
      "version": "7",
      "url": "https://sentry.io/api/0/projects/hypro999-personal-organization/zulip-integration-testing/events/599349254a1447a99774b5310711c1a8/",
      "web_url": "https://sentry.io/organizations/hypro999-personal-organization/issues/1635244907/events/599349254a1447a99774b5310711c1a8/",
      "issue_url": "https://sentry.io/api/0/issues/1635244907/"
    },
    "triggered_rule": "Send a webhook payload to Webhook.site"
  },
  "installation": {
    "uuid": "65027794-169a-4042-80d0-808ece377141"
  },
  "actor": {
    "type": "application",
    "id": "sentry",
    "name": "Sentry"
  }
}
```

--------------------------------------------------------------------------------

````
