---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1249
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1249 of 1290)

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

---[FILE: sample_event_through_plugin.json]---
Location: zulip-main/zerver/webhooks/sentry/fixtures/sample_event_through_plugin.json

```json
{
    "id": "4218258981",
    "project": "python",
    "project_name": "python",
    "project_slug": "python",
    "logger": null,
    "level": "error",
    "culprit": "raven.scripts.runner in main",
    "message": "This is an example Python exception",
    "url": "https://nitk-46.sentry.io/issues/4218258981/?referrer=webhooks_plugin",
    "triggering_rules": [],
    "event": {
        "event_id": "4dc4fc2858aa450eb658be9e5b8ad149",
        "level": "error",
        "version": "5",
        "type": "default",
        "logentry": {
            "formatted": "This is an example Python exception",
            "message": null,
            "params": null
        },
        "logger": "",
        "modules": {
            "my.package": "1.0.0"
        },
        "platform": "python",
        "timestamp": 1688935284.772,
        "received": 1688935344.773181,
        "environment": "prod",
        "user": {
            "id": "1",
            "email": "sentry@example.com",
            "ip_address": "127.0.0.1",
            "username": "sentry",
            "name": "Sentry",
            "geo": {
                "country_code": "GB",
                "city": "London",
                "region": "H9"
            }
        },
        "request": {
            "url": "http://example.com/foo",
            "method": "GET",
            "data": {
                "hello": "world"
            },
            "query_string": [
                [
                    "foo",
                    "bar"
                ]
            ],
            "cookies": [
                [
                    "foo",
                    "bar"
                ],
                [
                    "biz",
                    "baz"
                ]
            ],
            "headers": [
                [
                    "Content-Type",
                    "application/json"
                ],
                [
                    "Referer",
                    "http://example.com"
                ],
                [
                    "User-Agent",
                    "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.72 Safari/537.36"
                ]
            ],
            "env": {
                "ENV": "prod"
            },
            "inferred_content_type": "application/json",
            "api_target": null,
            "fragment": null
        },
        "contexts": {
            "browser": {
                "name": "Chrome",
                "version": "28.0.1500",
                "type": "browser"
            },
            "client_os": {
                "name": "Windows",
                "version": "8",
                "type": "os"
            }
        },
        "stacktrace": {
            "frames": [
                {
                    "function": "build_msg",
                    "module": "raven.base",
                    "filename": "raven/base.py",
                    "abs_path": "/home/ubuntu/.virtualenvs/getsentry/src/raven/raven/base.py",
                    "lineno": 303,
                    "pre_context": [
                        "                frames = stack",
                        "",
                        "            data.update({",
                        "                'sentry.interfaces.Stacktrace': {",
                        "                    'frames': get_stack_info(frames,"
                    ],
                    "context_line": "                        transformer=self.transform)",
                    "post_context": [
                        "                },",
                        "            })",
                        "",
                        "        if 'sentry.interfaces.Stacktrace' in data:",
                        "            if self.include_paths:"
                    ],
                    "in_app": false,
                    "vars": {
                        "'culprit'": null,
                        "'data'": {
                            "'message'": "u'This is a test message generated using ``raven test``'",
                            "'sentry.interfaces.Message'": {
                                "'message'": "u'This is a test message generated using ``raven test``'",
                                "'params'": []
                            }
                        },
                        "'date'": "datetime.datetime(2013, 8, 13, 3, 8, 24, 880386)",
                        "'event_id'": "'54a322436e1b47b88e239b78998ae742'",
                        "'event_type'": "'raven.events.Message'",
                        "'extra'": {
                            "'go_deeper'": [
                                [
                                    "{\"'bar'\":[\"'baz'\"],\"'foo'\":\"'bar'\"}"
                                ]
                            ],
                            "'loadavg'": [
                                0.37255859375,
                                0.5341796875,
                                0.62939453125
                            ],
                            "'user'": "'dcramer'"
                        },
                        "'frames'": "<generator object iter_stack_frames at 0x107bcc3c0>",
                        "'handler'": "<raven.events.Message object at 0x107bd0890>",
                        "'k'": "'sentry.interfaces.Message'",
                        "'kwargs'": {
                            "'level'": 20,
                            "'message'": "'This is a test message generated using ``raven test``'"
                        },
                        "'public_key'": null,
                        "'result'": {
                            "'message'": "u'This is a test message generated using ``raven test``'",
                            "'sentry.interfaces.Message'": {
                                "'message'": "u'This is a test message generated using ``raven test``'",
                                "'params'": []
                            }
                        },
                        "'self'": "<raven.base.Client object at 0x107bb8210>",
                        "'stack'": true,
                        "'tags'": null,
                        "'time_spent'": null,
                        "'v'": {
                            "'message'": "u'This is a test message generated using ``raven test``'",
                            "'params'": []
                        }
                    },
                    "colno": null,
                    "data": null,
                    "errors": null,
                    "raw_function": null,
                    "image_addr": null,
                    "instruction_addr": null,
                    "addr_mode": null,
                    "package": null,
                    "platform": null,
                    "symbol": null,
                    "symbol_addr": null,
                    "trust": null,
                    "snapshot": null,
                    "lock": null
                },
                {
                    "function": "capture",
                    "module": "raven.base",
                    "filename": "raven/base.py",
                    "abs_path": "/home/ubuntu/.virtualenvs/getsentry/src/raven/raven/base.py",
                    "lineno": 459,
                    "pre_context": [
                        "        if not self.is_enabled():",
                        "            return",
                        "",
                        "        data = self.build_msg(",
                        "            event_type, data, date, time_spent, extra, stack, tags=tags,"
                    ],
                    "context_line": "            **kwargs)",
                    "post_context": [
                        "",
                        "        self.send(**data)",
                        "",
                        "        return (data.get('event_id'),)",
                        ""
                    ],
                    "in_app": false,
                    "vars": {
                        "'data'": null,
                        "'date'": null,
                        "'event_type'": "'raven.events.Message'",
                        "'extra'": {
                            "'go_deeper'": [
                                [
                                    "{\"'bar'\":[\"'baz'\"],\"'foo'\":\"'bar'\"}"
                                ]
                            ],
                            "'loadavg'": [
                                0.37255859375,
                                0.5341796875,
                                0.62939453125
                            ],
                            "'user'": "'dcramer'"
                        },
                        "'kwargs'": {
                            "'level'": 20,
                            "'message'": "'This is a test message generated using ``raven test``'"
                        },
                        "'self'": "<raven.base.Client object at 0x107bb8210>",
                        "'stack'": true,
                        "'tags'": null,
                        "'time_spent'": null
                    },
                    "colno": null,
                    "data": null,
                    "errors": null,
                    "raw_function": null,
                    "image_addr": null,
                    "instruction_addr": null,
                    "addr_mode": null,
                    "package": null,
                    "platform": null,
                    "symbol": null,
                    "symbol_addr": null,
                    "trust": null,
                    "snapshot": null,
                    "lock": null
                },
                {
                    "function": "captureMessage",
                    "module": "raven.base",
                    "filename": "raven/base.py",
                    "abs_path": "/home/ubuntu/.virtualenvs/getsentry/src/raven/raven/base.py",
                    "lineno": 577,
                    "pre_context": [
                        "        \"\"\"",
                        "        Creates an event from ``message``.",
                        "",
                        "        >>> client.captureMessage('My event just happened!')",
                        "        \"\"\""
                    ],
                    "context_line": "        return self.capture('raven.events.Message', message=message, **kwargs)",
                    "post_context": [
                        "",
                        "    def captureException(self, exc_info=None, **kwargs):",
                        "        \"\"\"",
                        "        Creates an event from an exception.",
                        ""
                    ],
                    "in_app": false,
                    "vars": {
                        "'kwargs'": {
                            "'data'": null,
                            "'extra'": {
                                "'go_deeper'": [
                                    "[{\"'bar'\":[\"'baz'\"],\"'foo'\":\"'bar'\"}]"
                                ],
                                "'loadavg'": [
                                    0.37255859375,
                                    0.5341796875,
                                    0.62939453125
                                ],
                                "'user'": "'dcramer'"
                            },
                            "'level'": 20,
                            "'stack'": true,
                            "'tags'": null
                        },
                        "'message'": "'This is a test message generated using ``raven test``'",
                        "'self'": "<raven.base.Client object at 0x107bb8210>"
                    },
                    "colno": null,
                    "data": null,
                    "errors": null,
                    "raw_function": null,
                    "image_addr": null,
                    "instruction_addr": null,
                    "addr_mode": null,
                    "package": null,
                    "platform": null,
                    "symbol": null,
                    "symbol_addr": null,
                    "trust": null,
                    "snapshot": null,
                    "lock": null
                },
                {
                    "function": "send_test_message",
                    "module": "raven.scripts.runner",
                    "filename": "raven/scripts/runner.py",
                    "abs_path": "/home/ubuntu/.virtualenvs/getsentry/src/raven/raven/scripts/runner.py",
                    "lineno": 77,
                    "pre_context": [
                        "        level=logging.INFO,",
                        "        stack=True,",
                        "        tags=options.get('tags', {}),",
                        "        extra={",
                        "            'user': get_uid(),"
                    ],
                    "context_line": "            'loadavg': get_loadavg(),",
                    "post_context": [
                        "        },",
                        "    ))",
                        "",
                        "    if client.state.did_fail():",
                        "        print('error!')"
                    ],
                    "in_app": false,
                    "vars": {
                        "'client'": "<raven.base.Client object at 0x107bb8210>",
                        "'data'": null,
                        "'k'": "'secret_key'",
                        "'options'": {
                            "'data'": null,
                            "'tags'": null
                        }
                    },
                    "colno": null,
                    "data": null,
                    "errors": null,
                    "raw_function": null,
                    "image_addr": null,
                    "instruction_addr": null,
                    "addr_mode": null,
                    "package": null,
                    "platform": null,
                    "symbol": null,
                    "symbol_addr": null,
                    "trust": null,
                    "snapshot": null,
                    "lock": null
                },
                {
                    "function": "main",
                    "module": "raven.scripts.runner",
                    "filename": "raven/scripts/runner.py",
                    "abs_path": "/home/ubuntu/.virtualenvs/getsentry/src/raven/raven/scripts/runner.py",
                    "lineno": 112,
                    "pre_context": [
                        "    print(\"Using DSN configuration:\")",
                        "    print(\" \", dsn)",
                        "    print()",
                        "",
                        "    client = Client(dsn, include_paths=['raven'])"
                    ],
                    "context_line": "    send_test_message(client, opts.__dict__)",
                    "in_app": false,
                    "vars": {
                        "'args'": [
                            "'test'",
                            "'https://ebc35f33e151401f9deac549978bda11:f3403f81e12e4c24942d505f086b2cad@sentry.io/1'"
                        ],
                        "'client'": "<raven.base.Client object at 0x107bb8210>",
                        "'dsn'": "'https://ebc35f33e151401f9deac549978bda11:f3403f81e12e4c24942d505f086b2cad@sentry.io/1'",
                        "'opts'": "<Values at 0x107ba3b00: {'data': None, 'tags': None}>",
                        "'parser'": "<optparse.OptionParser instance at 0x107ba3368>",
                        "'root'": "<logging.Logger object at 0x107ba5b10>"
                    },
                    "colno": null,
                    "data": null,
                    "errors": null,
                    "raw_function": null,
                    "image_addr": null,
                    "instruction_addr": null,
                    "addr_mode": null,
                    "package": null,
                    "platform": null,
                    "post_context": null,
                    "symbol": null,
                    "symbol_addr": null,
                    "trust": null,
                    "snapshot": null,
                    "lock": null
                }
            ]
        },
        "tags": [
            [
                "browser",
                "Chrome 28.0.1500"
            ],
            [
                "browser.name",
                "Chrome"
            ],
            [
                "client_os",
                "Windows 8"
            ],
            [
                "client_os.name",
                "Windows"
            ],
            [
                "environment",
                "prod"
            ],
            [
                "level",
                "error"
            ],
            [
                "sentry:user",
                "id:1"
            ],
            [
                "server_name",
                "web01.example.org"
            ],
            [
                "url",
                "http://example.com/foo"
            ]
        ],
        "extra": {
            "emptyList": [],
            "emptyMap": {},
            "length": 10837790,
            "results": [
                1,
                2,
                3,
                4,
                5
            ],
            "session": {
                "foo": "bar"
            },
            "unauthorized": false,
            "url": "http://example.org/foo/bar/"
        },
        "fingerprint": [
            "{{ default }}"
        ],
        "hashes": [
            "3a2b45089d0211943e5a6645fb4cea3f"
        ],
        "culprit": "raven.scripts.runner in main",
        "metadata": {
            "title": "This is an example Python exception"
        },
        "title": "This is an example Python exception",
        "location": null,
        "_ref": 4505278293147648,
        "_ref_version": 2,
        "_metrics": {
            "bytes.stored.event": 8121
        },
        "nodestore_insert": 1688935345.484592,
        "id": "4dc4fc2858aa450eb658be9e5b8ad149"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: webhook_event_for_exception_javascript.json]---
Location: zulip-main/zerver/webhooks/sentry/fixtures/webhook_event_for_exception_javascript.json

```json
{
  "project_name": "Live",
  "message": "",
  "id": "1982047746",
  "culprit": "debugger eval code",
  "project_slug": "live",
  "url": "https://sentry.io/organizations/foo-bar-org/issues/1982047746/?referrer=webhooks_plugin",
  "level": "error",
  "triggering_rules": [
    "Send a notification for new issues"
  ],
  "event": {
    "extra": {
      "session:duration": 71705
    },
    "_ref_version": 2,
    "_ref": 5481202,
    "id": "f3bf5fc4e354451db9e885a69b2a2b51",
    "_metrics": {
      "bytes.ingested.event": 946,
      "flag.processing.error": true,
      "bytes.stored.event": 2683
    },
    "errors": [
      {
        "type": "invalid_attribute",
        "name": "trimHeadFrames"
      },
      {
        "url": "debugger eval code",
        "type": "js_no_source"
      }
    ],
    "culprit": "debugger eval code",
    "title": "TypeError: can't access property \"bar\", x.foo is undefined",
    "event_id": "f3bf5fc4e354451db9e885a69b2a2b51",
    "breadcrumbs": {
      "values": [
        {
          "category": "console",
          "timestamp": 1603730322.773,
          "message": "configured !!!!",
          "type": "default",
          "level": "info"
        },
        {
          "category": "sentry",
          "timestamp": 1603730337.597,
          "message": "ReferenceError: doMoreSomethingUndefined is not defined",
          "type": "default",
          "level": "error"
        }
      ]
    },
    "grouping_config": {
      "enhancements": "eJybzDhxY3J-bm5-npWRgaGlroGxrpHxBABcTQcY",
      "id": "newstyle:2019-10-29"
    },
    "platform": "javascript",
    "trimHeadFrames": null,
    "version": "7",
    "logger": "javascript",
    "type": "error",
    "metadata": {
      "type": "TypeError",
      "value": "can't access property \"bar\", x.foo is undefined"
    },
    "tags": [
      [
        "browser",
        "Firefox 83.0"
      ],
      [
        "browser.name",
        "Firefox"
      ],
      [
        "level",
        "error"
      ],
      [
        "logger",
        "javascript"
      ],
      [
        "os.name",
        "Ubuntu"
      ],
      [
        "sentry:user",
        "ip:106.206.50.32"
      ],
      [
        "transaction",
        "debugger eval code"
      ],
      [
        "url",
        "file:///tmp/raven-js-test.html"
      ]
    ],
    "user": {
      "geo": {
        "city": "Bengaluru",
        "region": "India",
        "country_code": "IN"
      },
      "ip_address": "106.206.50.32"
    },
    "fingerprint": [
      "{{ default }}"
    ],
    "hashes": [
      "338ec9eb220a67d39c935292df886c3f"
    ],
    "sdk": {
      "version": "3.26.4",
      "name": "raven-js"
    },
    "received": 1603730394.648839,
    "exception": {
      "values": [
        {
          "stacktrace": {
            "frames": [
              {
                "abs_path": "debugger eval code",
                "in_app": false,
                "data": {
                  "orig_in_app": 1
                },
                "lineno": 3,
                "filename": "debugger eval code"
              }
            ]
          },
          "type": "TypeError",
          "value": "can't access property \"bar\", x.foo is undefined"
        }
      ]
    },
    "transaction": "debugger eval code",
    "_meta": {
      "trimHeadFrames": {
        "": {
          "err": [
            "invalid_attribute"
          ]
        }
      }
    },
    "level": "error",
    "contexts": {
      "os": {
        "type": "os",
        "name": "Ubuntu"
      },
      "browser": {
        "version": "83.0",
        "type": "browser",
        "name": "Firefox"
      }
    },
    "request": {
      "url": "file:///tmp/raven-js-test.html",
      "headers": [
        [
          "User-Agent",
          "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:83.0) Gecko/20100101 Firefox/83.0"
        ]
      ]
    },
    "project": 5481202,
    "key_id": "1381841"
  },
  "project": "live",
  "logger": "javascript"
}
```

--------------------------------------------------------------------------------

---[FILE: webhook_event_for_exception_python.json]---
Location: zulip-main/zerver/webhooks/sentry/fixtures/webhook_event_for_exception_python.json

```json
{
  "project_name": "live",
  "message": "",
  "id": "1972208801",
  "culprit": "__main__ in <module>",
  "project_slug": "foo-live",
  "url": "https://sentry.io/organizations/bar-foundation/issues/1972208801/?referrer=webhooks_plugin",
  "level": "error",
  "triggering_rules": [
    "Send a notification for new events"
  ],
  "event": {
    "extra": {
      "sys.argv": [
        "data/trigger-exception.py"
      ]
    },
    "_ref_version": 2,
    "_ref": 218288,
    "id": "c916dccfd58e41dcabaebef0091f0736",
    "_metrics": {
      "bytes.ingested.event": 2229,
      "bytes.stored.event": 3021
    },
    "culprit": "__main__ in <module>",
    "title": "ValueError: new sentry error.",
    "event_id": "c916dccfd58e41dcabaebef0091f0736",
    "grouping_config": {
      "enhancements": "eJybzDhxY05qemJypZWRgaGlroGxrqHRBABbEwcC",
      "id": "legacy:2019-03-12"
    },
    "platform": "python",
    "version": "7",
    "location": "trigger-exception.py",
    "logger": "",
    "type": "error",
    "metadata": {
      "function": "<module>",
      "type": "ValueError",
      "value": "new sentry error.",
      "filename": "trigger-exception.py"
    },
    "tags": [
      [
        "level",
        "error"
      ],
      [
        "runtime",
        "CPython 3.8.5"
      ],
      [
        "runtime.name",
        "CPython"
      ],
      [
        "server_name",
        "enterprise"
      ]
    ],
    "timestamp": 1603322711.147672,
    "fingerprint": [
      "{{ default }}"
    ],
    "hashes": [
      "05eeb8cc2a9103790797a56728cfa1e8"
    ],
    "sdk": {
      "version": "0.19.1",
      "name": "sentry.python",
      "packages": [
        {
          "version": "0.19.1",
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
    "received": 1603322712.317751,
    "exception": {
      "values": [
        {
          "stacktrace": {
            "frames": [
              {
                "function": "<module>",
                "abs_path": "/home/user/software/bar/bar-foo/data/trigger-exception.py",
                "pre_context": [
                  "",
                  "",
                  "if __name__ == \"__main__\":",
                  "    sentry_sdk.init(dsn=DSN_SECRET)",
                  "    try:"
                ],
                "post_context": [
                  "    except Exception as e:",
                  "        sentry_sdk.capture_exception(e)"
                ],
                "vars": {
                  "__spec__": "None",
                  "__builtins__": "<module 'builtins' (built-in)>",
                  "__annotations__": null,
                  "__file__": "'data/trigger-exception.py'",
                  "__loader__": "<_frozen_importlib_external.SourceFileLoader object at 0x7f80a18acc70>",
                  "__cached__": "None",
                  "__name__": "'__main__'",
                  "__package__": "None",
                  "__doc__": "None",
                  "sentry_sdk": "<module 'sentry_sdk' from '/home/user/.virtualenvs/sentry-test/lib/python3.8/site-packages/sentry_sdk/__init__.py'>"
                },
                "module": "__main__",
                "filename": "trigger-exception.py",
                "lineno": 10,
                "in_app": false,
                "data": {
                  "orig_in_app": 1
                },
                "context_line": "        raise ValueError(\"new sentry error.\")"
              }
            ]
          },
          "type": "ValueError",
          "value": "new sentry error."
        }
      ]
    },
    "_meta": {
      "exception": {
        "values": {
          "0": {
            "stacktrace": {
              "frames": {
                "0": {
                  "vars": {
                    "": {
                      "len": 12
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "level": "error",
    "contexts": {
      "runtime": {
        "version": "3.8.5",
        "type": "runtime",
        "name": "CPython",
        "build": "3.8.5 (default, Jul 28 2020, 12:59:40) \n[GCC 9.3.0]"
      }
    },
    "modules": {
      "six": "1.14.0",
      "packaging": "20.3",
      "pip": "20.0.2",
      "pyparsing": "2.4.6",
      "html5lib": "1.0.1",
      "appdirs": "1.4.3",
      "distlib": "0.3.0",
      "msgpack": "0.6.2",
      "sentry-sdk": "0.19.1",
      "pytoml": "0.1.21",
      "ipaddr": "2.2.0",
      "webencodings": "0.5.1",
      "progress": "1.5",
      "certifi": "2019.11.28",
      "distro": "1.4.0",
      "wheel": "0.34.2",
      "pkg-resources": "0.0.0",
      "urllib3": "1.25.8",
      "retrying": "1.3.3",
      "colorama": "0.4.3",
      "cachecontrol": "0.12.6",
      "lockfile": "0.12.2",
      "pep517": "0.8.2",
      "contextlib2": "0.6.0",
      "chardet": "3.0.4",
      "setuptools": "44.0.0",
      "requests": "2.22.0",
      "idna": "2.8"
    },
    "project": 218288,
    "key_id": "430951"
  },
  "project": "foo-live",
  "logger": null
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/slack/doc.md

```text
# Forward Slack messages into Zulip

Forward messages sent to your Slack workspace's public channels into Zulip!

This integration lets you choose how to organize your Slack messages in Zulip.
You can:

- Send messages from each Slack channel into a **matching Zulip channel**.
- Send messages from each Slack channel into a **matching Zulip topic**.
- Send all Slack messages into a **single Zulip topic**.

If you'd like to forward messages in both directions (Slack to Zulip and Zulip
to Slack), please see [separate instructions][6] for how to set this up.

If you are looking to quickly move your Slack integrations to Zulip, check out
[Zulip's Slack-compatible incoming webhook][1].

!!! warn ""

    Using [Slack's legacy Outgoing Webhook service][5] is no longer
    recommended. Follow these instructions to switch to the new
    [Slack Events API][3].

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

    To send messages from each Slack channel into a **matching Zulip channel**,
    open the **Where to send notifications** dropdown and select **Matching
    Zulip channel**.

    To send messages from each Slack channel into a **matching Zulip topic**,
    disable the **Send all notifications to a single topic** option when
    generating the URL. Add `&channels_map_to_topics=1` to the generated URL.

    To send all Slack messages into a **single Zulip topic**, enable the **Send
    all notifications to a single topic** option, with no further modifications.

1. *(optional)* If you're setting up a [Slack bridge][6] to forward Zulip messages
   into your Slack workspace, replace the value of the `?api_key=` parameter in
   the **integration URL** you generated with the API key of the **Generic bot**
   you're using for the Slack bridge.

1. Create a new [Slack app][4], and open it. Navigate to the **OAuth
   & Permissions** menu, and scroll down to the **Scopes** section.

1. Make sure **Bot Token Scopes** includes `channels:history`, `channels:read`,
   and `users:read`. If you're setting up a [bidirectional bridge][6], make sure
   to also include the `chat:write` scope.

    !!! tip ""

        See the [required bot token scopes](#required-bot-token-scopes)
        section for details about these scopes.

1. Scroll to the **OAuth Tokens** section in the same menu, and click **Install
   to Workspace**.  Grant the app permission to access your workspace
   by clicking **Allow** when prompted.

1. You will immediately see a **Bot User OAuth Token**. Copy it and add it
   to the end of your **integration URL** as `&slack_app_token=BOT_OAUTH_TOKEN`.

1. Go to the **Event Subscriptions** menu, toggle **Enable Events**, and enter
   your updated **integration URL** in the **Request URL** field.

1. In the same menu, scroll down to the **Subscribe to bot events**
   section, and click on **Add Bot User Event**. Select the
   `message.channels` event.

1. Add the bot as an app to the Slack channels you'd like to receive
   notifications from.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/slack/001.png)

### Required bot token scopes

- `channels:history` is required by Slack's Event API's
  [message.channels](https://api.slack.com/events/message.channels) event. This
  is used to send new messages from Slack to Zulip.

- `channels:read` is required for Slack's
  [conversations.info](https://api.slack.com/methods/conversations.info)
  endpoint. This is used to get the name of the Slack channel a message came
  from.

- For a [bidirectional bridge][6] setup, the `chat:write` is also required for
  Slack's
  [chat.postMessage](https://docs.slack.dev/reference/methods/chat.postMessage/)
  method. This is used to send new messages from Zulip to Slack.

- `users:read` is required to call
  Slack's [users.info](https://api.slack.com/methods/users.info) endpoint. This
  is used to get the name of the Slack message's sender.

### Related documentation

- [Forward messages Slack <-> Zulip][6] (both directions)

- [Slack Events API documentation][3]

- [Slack Apps][4]

- [Zulip's Slack-compatible incoming webhook][1]

{!webhooks-url-specification.md!}

[1]: /integrations/slack_incoming
[2]: /help/create-a-channel
[3]: https://api.slack.com/apis/events-api
[4]: https://api.slack.com/apps
[5]: https://api.slack.com/legacy/custom-integrations/outgoing-webhooks
[6]: https://github.com/zulip/python-zulip-api/blob/main/zulip/integrations/bridge_with_slack/README.md
```

--------------------------------------------------------------------------------

````
