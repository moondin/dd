---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 1006
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1006 of 1290)

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

---[FILE: test_legacy_subject.py]---
Location: zulip-main/zerver/tests/test_legacy_subject.py

```python
import orjson

from zerver.lib.test_classes import ZulipTestCase


class LegacySubjectTest(ZulipTestCase):
    def test_legacy_subject(self) -> None:
        self.login("hamlet")

        payload = dict(
            type="stream",
            to=orjson.dumps("Verona").decode(),
            content="Test message",
        )

        payload["subject"] = "whatever"
        result = self.client_post("/json/messages", payload)
        self.assert_json_success(result)

        # You can't use both subject and topic.
        payload["topic"] = "whatever"
        result = self.client_post("/json/messages", payload)
        self.assert_json_error(result, "Can't decide between 'topic' and 'subject' arguments")
```

--------------------------------------------------------------------------------

````
