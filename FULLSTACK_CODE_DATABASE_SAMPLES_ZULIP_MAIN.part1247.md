---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1247
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1247 of 1290)

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

---[FILE: event_for_exception_vue.json]---
Location: zulip-main/zerver/webhooks/sentry/fixtures/event_for_exception_vue.json

```json
{
    "action": "triggered",
    "installation": {
        "uuid": "be1b14f8-ffad-41af-8e97-24a9c32ebc26"
    },
    "data": {
        "event": {
            "event_id": "292f78454e774e62999506f759ad791d",
            "project": 4505266924748801,
            "release": null,
            "dist": null,
            "platform": "javascript",
            "message": "",
            "datetime": "2023-05-29T11:08:30.821000Z",
            "tags": [
                [
                    "browser",
                    "Chrome 110.0.0"
                ],
                [
                    "browser.name",
                    "Chrome"
                ],
                [
                    "environment",
                    "production"
                ],
                [
                    "handled",
                    "no"
                ],
                [
                    "level",
                    "error"
                ],
                [
                    "mechanism",
                    "onunhandledrejection"
                ],
                [
                    "os.name",
                    "Linux"
                ],
                [
                    "replayId",
                    "f6eba8bdc1824d4faec200863e316c32"
                ],
                [
                    "user",
                    "ip:49.36.170.187"
                ],
                [
                    "transaction",
                    "home"
                ],
                [
                    "url",
                    "http://localhost:5173/"
                ]
            ],
            "_metrics": {
                "bytes.ingested.event": 6013,
                "bytes.stored.event": 21343
            },
            "_ref": 4505266924748801,
            "_ref_version": 2,
            "breadcrumbs": {
                "values": [
                    {
                        "timestamp": 1685358510.768,
                        "type": "default",
                        "category": "console",
                        "level": "warning",
                        "message": "[@sentry/vue]: Misconfigured SDK. Vue app is already mounted. Make sure to call `app.mount()` after `Sentry.init()`.",
                        "data": {
                            "arguments": [
                                "[@sentry/vue]: Misconfigured SDK. Vue app is already mounted. Make sure to call `app.mount()` after `Sentry.init()`."
                            ],
                            "logger": "console"
                        }
                    },
                    {
                        "timestamp": 1685358510.768,
                        "type": "default",
                        "category": "console",
                        "level": "warning",
                        "message": "[Vue warn]: Plugin has already been applied to target app.",
                        "data": {
                            "arguments": [
                                "[Vue warn]: Plugin has already been applied to target app."
                            ],
                            "logger": "console"
                        }
                    },
                    {
                        "timestamp": 1685358510.769,
                        "type": "default",
                        "category": "console",
                        "level": "warning",
                        "message": "[Vue warn]: App has already been mounted.\nIf you want to remount the same app, move your app creation logic into a factory function and create fresh app instances for each mount - e.g. `const createMyApp = () => createApp(App)`",
                        "data": {
                            "arguments": [
                                "[Vue warn]: App has already been mounted.\nIf you want to remount the same app, move your app creation logic into a factory function and create fresh app instances for each mount - e.g. `const createMyApp = () => createApp(App)`"
                            ],
                            "logger": "console"
                        }
                    },
                    {
                        "timestamp": 1685358510.769,
                        "type": "default",
                        "category": "navigation",
                        "level": "info",
                        "data": {
                            "from": "/",
                            "to": "/"
                        }
                    },
                    {
                        "timestamp": 1685358510.778,
                        "type": "default",
                        "category": "console",
                        "level": "warning",
                        "message": "[Vue warn]: Unhandled error during execution of scheduler flush. This is likely a Vue internals bug. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/core \n  at <HomeView onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< viewRef > > \n  at <RouterView> \n  at <App>",
                        "data": {
                            "arguments": [
                                "[Vue warn]: Unhandled error during execution of scheduler flush. This is likely a Vue internals bug. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/core",
                                "\n",
                                " at <HomeView",
                                "onVnodeUnmounted=fn<onVnodeUnmounted>",
                                "ref=Ref<",
                                "viewRef",
                                ">",
                                ">",
                                "\n",
                                " at <RouterView>",
                                "\n",
                                " at <App>"
                            ],
                            "logger": "console"
                        }
                    }
                ]
            },
            "contexts": {
                "browser": {
                    "name": "Chrome",
                    "version": "110.0.0",
                    "type": "browser"
                },
                "os": {
                    "name": "Linux",
                    "type": "os"
                },
                "replay": {
                    "replay_id": "f6eba8bdc1824d4faec200863e316c32",
                    "type": "replay"
                },
                "trace": {
                    "trace_id": "b1b7eb2d91cc4d0580d3f9b72d3a244c",
                    "span_id": "86a7afb4c705ca3c",
                    "op": "pageload",
                    "status": "internal_error",
                    "client_sample_rate": 1.0,
                    "sampled": true,
                    "data": {
                        "params": {},
                        "query": {}
                    },
                    "tags": {
                        "routing.instrumentation": "vue-router"
                    },
                    "type": "trace"
                }
            },
            "culprit": "insert(deps/chunk-G4DFXOZZ)",
            "environment": "production",
            "errors": [
                {
                    "type": "js_no_source",
                    "url": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f"
                }
            ],
            "exception": {
                "values": [
                    {
                        "type": "TypeError",
                        "value": "Cannot read properties of null (reading 'insertBefore')",
                        "stacktrace": {
                            "frames": [
                                {
                                    "function": "flushJobs",
                                    "module": "deps/chunk-G4DFXOZZ",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 1763,
                                    "colno": 9,
                                    "in_app": true
                                },
                                {
                                    "function": "callWithErrorHandling",
                                    "module": "deps/chunk-G4DFXOZZ",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 1565,
                                    "colno": 32,
                                    "in_app": true
                                },
                                {
                                    "function": "instance.update",
                                    "module": "deps/chunk-G4DFXOZZ",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 7212,
                                    "colno": 52,
                                    "in_app": true
                                },
                                {
                                    "function": "ReactiveEffect.run",
                                    "module": "deps/chunk-G4DFXOZZ",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 423,
                                    "colno": 19,
                                    "in_app": true
                                },
                                {
                                    "function": "ReactiveEffect.componentUpdateFn [as fn]",
                                    "module": "deps/chunk-G4DFXOZZ",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 7171,
                                    "colno": 9,
                                    "in_app": true
                                },
                                {
                                    "function": "patch",
                                    "module": "deps/chunk-G4DFXOZZ",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 6436,
                                    "colno": 11,
                                    "in_app": true
                                },
                                {
                                    "function": "processComponent",
                                    "module": "deps/chunk-G4DFXOZZ",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 6963,
                                    "colno": 9,
                                    "in_app": true
                                },
                                {
                                    "function": "mountComponent",
                                    "module": "deps/chunk-G4DFXOZZ",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 7010,
                                    "colno": 5,
                                    "in_app": true
                                },
                                {
                                    "function": "setupRenderEffect",
                                    "module": "deps/chunk-G4DFXOZZ",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 7220,
                                    "colno": 5,
                                    "in_app": true
                                },
                                {
                                    "function": "instance.update",
                                    "module": "deps/chunk-G4DFXOZZ",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 7212,
                                    "colno": 52,
                                    "in_app": true
                                },
                                {
                                    "function": "ReactiveEffect.run",
                                    "module": "deps/chunk-G4DFXOZZ",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 423,
                                    "colno": 19,
                                    "in_app": true
                                },
                                {
                                    "function": "ReactiveEffect.componentUpdateFn [as fn]",
                                    "module": "deps/chunk-G4DFXOZZ",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 7106,
                                    "colno": 11,
                                    "in_app": true
                                },
                                {
                                    "function": "patch",
                                    "module": "deps/chunk-G4DFXOZZ",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 6424,
                                    "colno": 11,
                                    "in_app": true
                                },
                                {
                                    "function": "processElement",
                                    "module": "deps/chunk-G4DFXOZZ",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 6552,
                                    "colno": 7,
                                    "in_app": true
                                },
                                {
                                    "function": "mountElement",
                                    "module": "deps/chunk-G4DFXOZZ",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 6642,
                                    "colno": 5,
                                    "in_app": true
                                },
                                {
                                    "function": "insert",
                                    "module": "deps/chunk-G4DFXOZZ",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 9134,
                                    "colno": 12,
                                    "in_app": true
                                }
                            ]
                        },
                        "raw_stacktrace": {
                            "frames": [
                                {
                                    "function": "flushJobs",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 1763,
                                    "colno": 9,
                                    "in_app": true
                                },
                                {
                                    "function": "callWithErrorHandling",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 1565,
                                    "colno": 32,
                                    "in_app": true
                                },
                                {
                                    "function": "instance.update",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 7212,
                                    "colno": 52,
                                    "in_app": true
                                },
                                {
                                    "function": "ReactiveEffect.run",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 423,
                                    "colno": 19,
                                    "in_app": true
                                },
                                {
                                    "function": "ReactiveEffect.componentUpdateFn [as fn]",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 7171,
                                    "colno": 9,
                                    "in_app": true
                                },
                                {
                                    "function": "patch",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 6436,
                                    "colno": 11,
                                    "in_app": true
                                },
                                {
                                    "function": "processComponent",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 6963,
                                    "colno": 9,
                                    "in_app": true
                                },
                                {
                                    "function": "mountComponent",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 7010,
                                    "colno": 5,
                                    "in_app": true
                                },
                                {
                                    "function": "setupRenderEffect",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 7220,
                                    "colno": 5,
                                    "in_app": true
                                },
                                {
                                    "function": "instance.update",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 7212,
                                    "colno": 52,
                                    "in_app": true
                                },
                                {
                                    "function": "ReactiveEffect.run",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 423,
                                    "colno": 19,
                                    "in_app": true
                                },
                                {
                                    "function": "ReactiveEffect.componentUpdateFn [as fn]",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 7106,
                                    "colno": 11,
                                    "in_app": true
                                },
                                {
                                    "function": "patch",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 6424,
                                    "colno": 11,
                                    "in_app": true
                                },
                                {
                                    "function": "processElement",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 6552,
                                    "colno": 7,
                                    "in_app": true
                                },
                                {
                                    "function": "mountElement",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 6642,
                                    "colno": 5,
                                    "in_app": true
                                },
                                {
                                    "function": "insert",
                                    "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                                    "abs_path": "http://localhost:5173/node_modules/.vite/deps/chunk-G4DFXOZZ.js?v=530d9f5f",
                                    "lineno": 9134,
                                    "colno": 12,
                                    "in_app": true
                                }
                            ]
                        },
                        "mechanism": {
                            "type": "onunhandledrejection",
                            "handled": false
                        }
                    }
                ]
            },
            "fingerprint": [
                "{{ default }}"
            ],
            "grouping_config": {
                "enhancements": "eJybzDRxY3J-bm5-npWRgaGlroGxrpHxBABcYgcZ",
                "id": "newstyle:2019-10-29"
            },
            "hashes": [
                "fdd7bfccd74d70129094ae0482059ab1"
            ],
            "ingest_path": [
                {
                    "version": "23.5.1",
                    "public_key": "XE7QiyuNlja9PZ7I9qJlwQotzecWrUIN91BAO7Q5R38"
                }
            ],
            "key_id": "3162314",
            "level": "error",
            "location": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
            "logger": "",
            "metadata": {
                "display_title_with_tree_label": false,
                "filename": "/node_modules/.vite/deps/chunk-G4DFXOZZ.js",
                "function": "insert",
                "type": "TypeError",
                "value": "Cannot read properties of null (reading 'insertBefore')"
            },
            "nodestore_insert": 1685358514.576503,
            "processed_by_symbolicator": true,
            "received": 1685358510.991622,
            "request": {
                "url": "http://localhost:5173/",
                "headers": [
                    [
                        "Referer",
                        "http://localhost:5173/"
                    ],
                    [
                        "User-Agent",
                        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
                    ]
                ]
            },
            "sdk": {
                "name": "sentry.javascript.vue",
                "version": "7.53.1",
                "integrations": [
                    "InboundFilters",
                    "FunctionToString",
                    "TryCatch",
                    "Breadcrumbs",
                    "GlobalHandlers",
                    "LinkedErrors",
                    "Dedupe",
                    "HttpContext",
                    "BrowserTracing",
                    "Replay"
                ],
                "packages": [
                    {
                        "name": "npm:@sentry/vue",
                        "version": "7.53.1"
                    }
                ]
            },
            "timestamp": 1685358510.821,
            "title": "TypeError: Cannot read properties of null (reading 'insertBefore')",
            "type": "error",
            "user": {
                "ip_address": "49.36.170.187",
                "geo": {
                    "country_code": "IN",
                    "city": "Lucknow",
                    "subdivision": "Uttar Pradesh",
                    "region": "India"
                }
            },
            "version": "7",
            "url": "https://sentry.io/api/0/projects/nitk-46/javascript-vue-new/events/292f78454e774e62999506f759ad791d/",
            "web_url": "https://sentry.io/organizations/nitk-46/issues/4214010673/events/292f78454e774e62999506f759ad791d/",
            "issue_url": "https://sentry.io/api/0/issues/4214010673/",
            "issue_id": "4214010673"
        },
        "triggered_rule": "vue-alert"
    },
    "actor": {
        "type": "application",
        "id": "sentry",
        "name": "Sentry"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: event_for_message_golang.json]---
Location: zulip-main/zerver/webhooks/sentry/fixtures/event_for_message_golang.json

```json
{
    "action": "triggered",
    "data": {
        "event": {
            "event_id": "01ecb45633bc4f5ca940ada671124c8f",
            "project": 5216640,
            "release": null,
            "dist": null,
            "platform": "go",
            "message": "A test message event from golang.",
            "datetime": "2020-04-30T06:14:13.611851Z",
            "tags": [
                [
                    "level",
                    "info"
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
                "bytes.ingested.event": 551,
                "bytes.stored.event": 1205
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
            "culprit": "",
            "fingerprint": [
                "{{ default }}"
            ],
            "grouping_config": {
                "enhancements": "eJybzDhxY3J-bm5-npWRgaGlroGxrpHxBABcTQcY",
                "id": "newstyle:2019-10-29"
            },
            "hashes": [
                "dbd68cd07ee5d429a42cdc0da3bf8823"
            ],
            "key_id": "1146336",
            "level": "info",
            "location": null,
            "logentry": {
                "message": null,
                "params": null,
                "formatted": "A test message event from golang."
            },
            "logger": "",
            "metadata": {
                "title": "A test message event from golang."
            },
            "received": 1588227254.623787,
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
            "timestamp": 1588227253.611851,
            "title": "A test message event from golang.",
            "type": "default",
            "version": "7",
            "url": "https://sentry.io/api/0/projects/hypro999-personal-organization/zulip-integration-testing/events/01ecb45633bc4f5ca940ada671124c8f/",
            "web_url": "https://sentry.io/organizations/hypro999-personal-organization/issues/1638844654/events/01ecb45633bc4f5ca940ada671124c8f/",
            "issue_url": "https://sentry.io/api/0/issues/1638844654/"
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

---[FILE: event_for_message_node.json]---
Location: zulip-main/zerver/webhooks/sentry/fixtures/event_for_message_node.json

```json
{
    "action": "triggered",
    "data": {
        "event": {
            "event_id": "6886bb1fe7ce4497b7836f6083d5fd34",
            "project": 5216640,
            "release": null,
            "dist": null,
            "platform": "node",
            "message": "Test event from node.",
            "datetime": "2020-04-30T06:09:56.493251Z",
            "tags": [
                [
                    "level",
                    "info"
                ]
            ],
            "_metrics": {
                "bytes.ingested.event": 363,
                "bytes.stored.event": 933
            },
            "culprit": "",
            "fingerprint": [
                "{{ default }}"
            ],
            "grouping_config": {
                "enhancements": "eJybzDhxY3J-bm5-npWRgaGlroGxrpHxBABcTQcY",
                "id": "newstyle:2019-10-29"
            },
            "hashes": [
                "b1e874f29de1cc06a65a1cb4faafc21b"
            ],
            "key_id": "1146336",
            "level": "info",
            "location": null,
            "logentry": {
                "message": null,
                "params": null,
                "formatted": "Test event from node."
            },
            "logger": "",
            "metadata": {
                "title": "Test event from node."
            },
            "received": 1588226996.493251,
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
            "timestamp": 1588226996.493251,
            "title": "Test event from node.",
            "type": "default",
            "version": "7",
            "url": "https://sentry.io/api/0/projects/hypro999-personal-organization/zulip-integration-testing/events/6886bb1fe7ce4497b7836f6083d5fd34/",
            "web_url": "https://sentry.io/organizations/hypro999-personal-organization/issues/1638840427/events/6886bb1fe7ce4497b7836f6083d5fd34/",
            "issue_url": "https://sentry.io/api/0/issues/1638840427/"
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

---[FILE: event_for_message_python.json]---
Location: zulip-main/zerver/webhooks/sentry/fixtures/event_for_message_python.json

```json
{
  "action": "triggered",
  "data": {
    "event": {
      "event_id": "8da63b42375e4d3b803c377fefb062f8",
      "project": 5216640,
      "release": null,
      "dist": null,
      "platform": "python",
      "message": "A simple message-based issue.",
      "datetime": "2020-04-28T14:05:04.210463Z",
      "tags": [
        [
          "level",
          "info"
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
      "_metrics": {
        "bytes.ingested.event": 796,
        "bytes.stored.event": 1339
      },
      "contexts": {
        "runtime": {
          "version": "3.6.9",
          "type": "runtime",
          "name": "CPython",
          "build": "3.6.9 (default, Apr 18 2020, 01:56:04) \n[GCC 8.4.0]"
        }
      },
      "culprit": "",
      "extra": {
        "sys.argv": [
          "trigger-message.py"
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
        "b31896ab3433f42862a78d60fca14636"
      ],
      "key_id": "1146336",
      "level": "info",
      "location": null,
      "logentry": {
        "message": null,
        "params": null,
        "formatted": "A simple message-based issue."
      },
      "logger": "",
      "metadata": {
        "title": "A simple message-based issue."
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
      "received": 1588082705.406414,
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
      "timestamp": 1588082704.210463,
      "title": "A simple message-based issue.",
      "type": "default",
      "version": "7",
      "url": "https://sentry.io/api/0/projects/hypro999-personal-organization/zulip-integration-testing/events/8da63b42375e4d3b803c377fefb062f8/",
      "web_url": "https://sentry.io/organizations/hypro999-personal-organization/issues/1635261062/events/8da63b42375e4d3b803c377fefb062f8/",
      "issue_url": "https://sentry.io/api/0/issues/1635261062/"
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
