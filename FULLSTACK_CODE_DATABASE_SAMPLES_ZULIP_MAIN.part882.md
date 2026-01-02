---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 882
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 882 of 1290)

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

---[FILE: initial_password.py]---
Location: zulip-main/zerver/lib/initial_password.py
Signals: Django

```python
import base64
import hashlib

from django.conf import settings


def initial_password(email: str) -> str | None:
    """Given an email address, returns the initial password for that account, as
    created by populate_db."""

    if settings.INITIAL_PASSWORD_SALT is not None:
        # We check settings.DEVELOPMENT, not settings.PRODUCTION,
        # because some tests mock settings.PRODUCTION and then use
        # self.login, which will call this function.
        assert settings.DEVELOPMENT, "initial_password_salt should not be set in production."
        encoded_key = (settings.INITIAL_PASSWORD_SALT + email).encode()
        digest = hashlib.sha256(encoded_key).digest()
        return base64.b64encode(digest)[:16].decode()
    else:
        # None as a password for a user tells Django to set an unusable password
        return None
```

--------------------------------------------------------------------------------

````
