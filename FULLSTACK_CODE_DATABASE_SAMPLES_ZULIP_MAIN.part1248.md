---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1248
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1248 of 1290)

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

---[FILE: issue_assigned_to_individual.json]---
Location: zulip-main/zerver/webhooks/sentry/fixtures/issue_assigned_to_individual.json

```json
{
    "action": "assigned",
    "data": {
        "assignee": {
            "type": "user",
            "id": 662437,
            "name": "Hemanth V. Alluri",
            "email": "hdrive1999@gmail.com"
        },
        "issue": {
            "platform": "go",
            "lastSeen": "2020-04-30T06:14:13.611851Z",
            "numComments": 0,
            "userCount": 0,
            "culprit": "",
            "title": "A test message event from golang.",
            "id": "1638844654",
            "assignedTo": {
                "type": "user",
                "email": "hdrive1999@gmail.com",
                "name": "Hemanth V. Alluri",
                "id": "662437"
            },
            "logger": null,
            "type": "default",
            "annotations": [],
            "metadata": {
                "title": "A test message event from golang."
            },
            "status": "unresolved",
            "subscriptionDetails": null,
            "isPublic": false,
            "hasSeen": false,
            "shortId": "ZULIP-INTEGRATION-TESTING-G",
            "shareId": null,
            "firstSeen": "2020-04-30T06:14:13.611851Z",
            "count": "1",
            "permalink": null,
            "level": "info",
            "isSubscribed": false,
            "isBookmarked": false,
            "project": {
                "platform": "python",
                "slug": "zulip-integration-testing",
                "id": "5216640",
                "name": "Zulip Integration Testing"
            },
            "statusDetails": {}
        }
    },
    "installation": {
        "uuid": "65027794-169a-4042-80d0-808ece377141"
    },
    "actor": {
        "type": "user",
        "id": 662437,
        "name": "Hemanth V. Alluri"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: issue_assigned_to_team.json]---
Location: zulip-main/zerver/webhooks/sentry/fixtures/issue_assigned_to_team.json

```json
{
    "action": "assigned",
    "data": {
        "assignee": {
            "type": "team",
            "name": "Hypro999",
            "id": 473371
        },
        "issue": {
            "platform": "python",
            "lastSeen": "2020-04-30T05:54:15.092476Z",
            "numComments": 0,
            "userCount": 0,
            "culprit": "__main__ in <module>",
            "title": "Exception: program has entered an invalid state.",
            "id": "1638821441",
            "assignedTo": {
                "type": "team",
                "id": "473371",
                "name": "lone-wolf"
            },
            "logger": null,
            "type": "error",
            "annotations": [],
            "metadata": {
                "function": "<module>",
                "type": "Exception",
                "value": "program has entered an invalid state.",
                "filename": "trigger-exception.py"
            },
            "status": "unresolved",
            "subscriptionDetails": null,
            "isPublic": false,
            "hasSeen": false,
            "shortId": "ZULIP-INTEGRATION-TESTING-E",
            "shareId": null,
            "firstSeen": "2020-04-30T05:54:15.092476Z",
            "count": "1",
            "permalink": null,
            "level": "error",
            "isSubscribed": false,
            "isBookmarked": false,
            "project": {
                "platform": "python",
                "slug": "zulip-integration-testing",
                "id": "5216640",
                "name": "Zulip Integration Testing"
            },
            "statusDetails": {}
        }
    },
    "installation": {
        "uuid": "65027794-169a-4042-80d0-808ece377141"
    },
    "actor": {
        "type": "user",
        "id": 662437,
        "name": "Hemanth V. Alluri"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: issue_created_for_exception.json]---
Location: zulip-main/zerver/webhooks/sentry/fixtures/issue_created_for_exception.json

```json
{
  "action": "created",
  "data": {
    "issue": {
      "platform": "python",
      "lastSeen": "2020-04-28T13:56:05.903736Z",
      "numComments": 0,
      "userCount": 0,
      "culprit": "__main__ in <module>",
      "title": "Exception: Custom exception!",
      "id": "1635244907",
      "assignedTo": null,
      "logger": null,
      "type": "error",
      "annotations": [],
      "metadata": {
        "function": "<module>",
        "type": "Exception",
        "value": "Custom exception!",
        "filename": "trigger-exception.py"
      },
      "status": "unresolved",
      "subscriptionDetails": null,
      "isPublic": false,
      "hasSeen": false,
      "shortId": "ZULIP-INTEGRATION-TESTING-2",
      "shareId": null,
      "firstSeen": "2020-04-28T13:56:05.903736Z",
      "count": "1",
      "permalink": null,
      "level": "error",
      "isSubscribed": false,
      "isBookmarked": false,
      "project": {
        "platform": "python",
        "slug": "zulip-integration-testing",
        "id": "5216640",
        "name": "Zulip Integration Testing"
      },
      "statusDetails": {}
    }
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

---[FILE: issue_created_for_message.json]---
Location: zulip-main/zerver/webhooks/sentry/fixtures/issue_created_for_message.json

```json
{
  "action": "created",
  "data": {
    "issue": {
      "platform": "python",
      "lastSeen": "2020-04-28T14:05:04.210463Z",
      "numComments": 0,
      "userCount": 0,
      "culprit": "",
      "title": "A simple message-based issue.",
      "id": "1635261062",
      "assignedTo": null,
      "logger": null,
      "type": "default",
      "annotations": [],
      "metadata": {
        "title": "A simple message-based issue."
      },
      "status": "unresolved",
      "subscriptionDetails": null,
      "isPublic": false,
      "hasSeen": false,
      "shortId": "ZULIP-INTEGRATION-TESTING-3",
      "shareId": null,
      "firstSeen": "2020-04-28T14:05:04.210463Z",
      "count": "1",
      "permalink": null,
      "level": "info",
      "isSubscribed": false,
      "isBookmarked": false,
      "project": {
        "platform": "python",
        "slug": "zulip-integration-testing",
        "id": "5216640",
        "name": "Zulip Integration Testing"
      },
      "statusDetails": {}
    }
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

---[FILE: issue_ignored.json]---
Location: zulip-main/zerver/webhooks/sentry/fixtures/issue_ignored.json

```json
{
  "action": "ignored",
  "data": {
    "issue": {
      "platform": "python",
      "lastSeen": "2020-04-30T05:54:15.092476Z",
      "numComments": 0,
      "userCount": 0,
      "culprit": "__main__ in <module>",
      "title": "Exception: program has entered an invalid state.",
      "id": "1638821441",
      "assignedTo": null,
      "logger": null,
      "type": "error",
      "annotations": [],
      "metadata": {
        "function": "<module>",
        "type": "Exception",
        "value": "program has entered an invalid state.",
        "filename": "trigger-exception.py"
      },
      "status": "ignored",
      "subscriptionDetails": null,
      "isPublic": false,
      "hasSeen": false,
      "shortId": "ZULIP-INTEGRATION-TESTING-E",
      "shareId": null,
      "firstSeen": "2020-04-30T05:54:15.092476Z",
      "count": "1",
      "permalink": null,
      "level": "error",
      "isSubscribed": false,
      "isBookmarked": false,
      "project": {
        "platform": "python",
        "slug": "zulip-integration-testing",
        "id": "5216640",
        "name": "Zulip Integration Testing"
      },
      "statusDetails": {}
    }
  },
  "installation": {
    "uuid": "65027794-169a-4042-80d0-808ece377141"
  },
  "actor": {
    "type": "user",
    "id": 662437,
    "name": "Hemanth V. Alluri"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: issue_resolved.json]---
Location: zulip-main/zerver/webhooks/sentry/fixtures/issue_resolved.json

```json
{
    "action": "resolved",
    "data": {
        "resolution_type": "now",
        "issue": {
            "platform": "python",
            "lastSeen": "2020-04-30T05:54:15.092476Z",
            "numComments": 0,
            "userCount": 0,
            "culprit": "__main__ in <module>",
            "title": "Exception: program has entered an invalid state.",
            "id": "1638821441",
            "assignedTo": null,
            "logger": null,
            "type": "error",
            "annotations": [],
            "metadata": {
                "function": "<module>",
                "type": "Exception",
                "value": "program has entered an invalid state.",
                "filename": "trigger-exception.py"
            },
            "status": "resolved",
            "subscriptionDetails": null,
            "isPublic": false,
            "hasSeen": false,
            "shortId": "ZULIP-INTEGRATION-TESTING-E",
            "shareId": null,
            "firstSeen": "2020-04-30T05:54:15.092476Z",
            "count": "1",
            "permalink": null,
            "level": "error",
            "isSubscribed": false,
            "isBookmarked": false,
            "project": {
                "platform": "python",
                "slug": "zulip-integration-testing",
                "id": "5216640",
                "name": "Zulip Integration Testing"
            },
            "statusDetails": {}
        }
    },
    "installation": {
        "uuid": "65027794-169a-4042-80d0-808ece377141"
    },
    "actor": {
        "type": "user",
        "id": 662437,
        "name": "Hemanth V. Alluri"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: raven_sdk_python_event.json]---
Location: zulip-main/zerver/webhooks/sentry/fixtures/raven_sdk_python_event.json

```json
{
    "id": "4311163364",
    "project": "python-raven",
    "project_name": "python-raven",
    "project_slug": "python-raven",
    "logger": null,
    "level": "error",
    "culprit": "__main__ in <module>",
    "message": "ZeroDivisionError: division by zero",
    "url": "https://nitk-46.sentry.io/issues/4311163364/?referrer=webhooks_plugin",
    "triggering_rules": [
        "a"
    ],
    "event": {
        "event_id": "b465c7ca9581475093a6f5c3c6a523d2",
        "level": "error",
        "version": "6",
        "type": "error",
        "fingerprint": [
            "{{ default }}"
        ],
        "culprit": "__main__ in <module>",
        "logentry": {
            "formatted": "ZeroDivisionError: division by zero"
        },
        "logger": "",
        "modules": {
            "python": "3.10.6"
        },
        "platform": "python",
        "timestamp": 1689194871.0,
        "received": 1689194872.041476,
        "exception": {
            "values": [
                {
                    "type": "ZeroDivisionError",
                    "value": "division by zero",
                    "module": "builtins",
                    "stacktrace": {
                        "frames": [
                            {
                                "function": "<module>",
                                "module": "__main__",
                                "filename": "sentry/temp.py",
                                "abs_path": "/home/sbansal1999/p/sentry/temp.py",
                                "lineno": 6,
                                "pre_context": [
                                    "from raven import Client",
                                    "",
                                    "client = Client('https://6130e69dc19e426e87deaa54744be1cd@o4505261800423424.ingest.sentry.io/4505518370586624')",
                                    "",
                                    "try:"
                                ],
                                "context_line": "    1 / 0",
                                "post_context": [
                                    "except ZeroDivisionError:",
                                    "    client.captureException()"
                                ],
                                "in_app": false,
                                "vars": {
                                    "Client": "<class 'raven.base.Client'>",
                                    "__annotations__": {},
                                    "__builtins__": "<module 'builtins' (built-in)>",
                                    "__cached__": null,
                                    "__doc__": null,
                                    "__file__": "'/home/sbansal1999/p/sentry/temp.py'",
                                    "__loader__": "<_frozen_importlib_external.SourceFileLoader object at 0x7fd40cfdd930>",
                                    "__name__": "'__main__'",
                                    "__package__": null,
                                    "__spec__": null,
                                    "client": "<raven.base.Client object at 0x7fd40d107c10>"
                                },
                                "data": {
                                    "orig_in_app": -1
                                }
                            }
                        ]
                    }
                }
            ]
        },
        "tags": [
            [
                "level",
                "error"
            ],
            [
                "server_name",
                "sbansal1999-OMEN-Laptop-15-en0xxx"
            ]
        ],
        "extra": {
            "sys.argv": [
                "'temp.py'"
            ]
        },
        "sdk": {
            "name": "raven-python",
            "version": "6.10.0"
        },
        "ingest_path": [
            {
                "version": "23.6.2",
                "public_key": "XE7QiyuNlja9PZ7I9qJlwQotzecWrUIN91BAO7Q5R38"
            }
        ],
        "key_id": "3267509",
        "project": 4505518370586624,
        "grouping_config": {
            "enhancements": "eJybzDRxc15qeXFJZU6qlZGBkbGugaGuoeEEAHJMCAM",
            "id": "newstyle:2023-01-11"
        },
        "_metrics": {
            "bytes.ingested.event": 1549,
            "bytes.stored.event": 2356
        },
        "_ref": 4505518370586624,
        "_ref_version": 2,
        "hashes": [
            "cac8c3af9240e70448922144a14f55b3"
        ],
        "location": "sentry/temp.py",
        "metadata": {
            "display_title_with_tree_label": false,
            "filename": "sentry/temp.py",
            "function": "<module>",
            "type": "ZeroDivisionError",
            "value": "division by zero"
        },
        "nodestore_insert": 1689194873.112506,
        "title": "ZeroDivisionError: division by zero",
        "id": "b465c7ca9581475093a6f5c3c6a523d2"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: sample_event_through_alert.json]---
Location: zulip-main/zerver/webhooks/sentry/fixtures/sample_event_through_alert.json

```json
{
    "action": "triggered",
    "installation": {
        "uuid": "be1b14f8-ffad-41af-8e97-24a9c32ebc26"
    },
    "data": {
        "event": {
            "event_id": "b6eff1a49b1f4132850b1238d968da70",
            "project": 4505278293147648,
            "release": null,
            "dist": null,
            "platform": "python",
            "message": "This is an example Python exception",
            "datetime": "2023-05-31T11:06:16.247000Z",
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
                    "sample_event",
                    "yes"
                ],
                [
                    "user",
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
            "_metrics": {
                "bytes.stored.event": 8070
            },
            "_ref": 4505278293147648,
            "_ref_version": 2,
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
            "culprit": "raven.scripts.runner in main",
            "environment": "prod",
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
            "level": "error",
            "location": null,
            "logentry": {
                "formatted": "This is an example Python exception",
                "message": null,
                "params": null
            },
            "logger": "",
            "metadata": {
                "title": "This is an example Python exception"
            },
            "modules": {
                "my.package": "1.0.0"
            },
            "nodestore_insert": 1685531237.009953,
            "received": 1685531236.249363,
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
                "fragment": null
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
                        "snapshot": null
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
                        "snapshot": null
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
                        "snapshot": null
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
                        "snapshot": null
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
                        "snapshot": null
                    }
                ]
            },
            "timestamp": 1685531176.247,
            "title": "This is an example Python exception",
            "type": "default",
            "user": {
                "id": "1",
                "email": "sentry@example.com",
                "ip_address": "127.0.0.1",
                "username": "sentry",
                "name": "Sentry",
                "geo": {
                    "country_code": "AU",
                    "city": "Melbourne",
                    "region": "VIC"
                }
            },
            "version": "5",
            "url": "https://sentry.io/api/0/projects/nitk-46/python/events/b6eff1a49b1f4132850b1238d968da70/",
            "web_url": "https://sentry.io/organizations/nitk-46/issues/4218258981/events/b6eff1a49b1f4132850b1238d968da70/",
            "issue_url": "https://sentry.io/api/0/issues/4218258981/",
            "issue_id": "4218258981"
        },
        "triggered_rule": ""
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
