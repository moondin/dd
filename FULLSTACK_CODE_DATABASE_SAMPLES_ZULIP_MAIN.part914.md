---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 914
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 914 of 1290)

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

---[FILE: user_agent.py]---
Location: zulip-main/zerver/lib/user_agent.py

```python
import re

# Warning: If you change this parsing, please test using
#   zerver/tests/test_decorators.py
# And extend zerver/tests/fixtures/user_agents_unique with any new test cases
pattern = re.compile(
    r"""^ (?P<name> [^/ ]* [^0-9/(]* )
    (/ (?P<version> [^/ ]* ))?
    ([ /] .*)?
    $""",
    re.VERBOSE,
)


def parse_user_agent(user_agent: str) -> dict[str, str]:
    match = pattern.match(user_agent)
    assert match is not None
    return match.groupdict()
```

--------------------------------------------------------------------------------

---[FILE: user_counts.py]---
Location: zulip-main/zerver/lib/user_counts.py
Signals: Django

```python
from typing import Any

from django.db.models import Count

from zerver.models import Realm, RealmAuditLog, UserProfile


def realm_user_count(realm: Realm) -> int:
    return UserProfile.objects.filter(realm=realm, is_active=True, is_bot=False).count()


def realm_user_count_by_role(realm: Realm) -> dict[str, Any]:
    human_counts = {
        str(UserProfile.ROLE_REALM_ADMINISTRATOR): 0,
        str(UserProfile.ROLE_REALM_OWNER): 0,
        str(UserProfile.ROLE_MODERATOR): 0,
        str(UserProfile.ROLE_MEMBER): 0,
        str(UserProfile.ROLE_GUEST): 0,
    }
    for value_dict in (
        UserProfile.objects.filter(realm=realm, is_bot=False, is_active=True)
        .values("role")
        .annotate(Count("role"))
    ):
        human_counts[str(value_dict["role"])] = value_dict["role__count"]
    bot_count = UserProfile.objects.filter(realm=realm, is_bot=True, is_active=True).count()
    return {
        RealmAuditLog.ROLE_COUNT_HUMANS: human_counts,
        RealmAuditLog.ROLE_COUNT_BOTS: bot_count,
    }
```

--------------------------------------------------------------------------------

````
