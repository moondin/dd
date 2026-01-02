---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 558
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 558 of 1290)

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

---[FILE: exclude.py]---
Location: zulip-main/tools/linter_lib/exclude.py

```python
# Exclude some directories and files from lint checking
EXCLUDED_FILES = [
    # Third-party code that doesn't match our style
    "web/third",
]

PUPPET_CHECK_RULES_TO_EXCLUDE = [
    "--no-documentation-check",
    "--no-80chars-check",
]
```

--------------------------------------------------------------------------------

---[FILE: dump_fixtures.js]---
Location: zulip-main/tools/node_lib/dump_fixtures.js

```javascript
import * as events from "../../web/tests/lib/events.cjs";

console.info(JSON.stringify(events.fixtures, null, 4));
```

--------------------------------------------------------------------------------

---[FILE: prepare_digital_ocean_one_click_app_release.py]---
Location: zulip-main/tools/oneclickapps/prepare_digital_ocean_one_click_app_release.py

```python
import os
import subprocess
import time
from pathlib import Path

import digitalocean
import zulip
from requests.adapters import HTTPAdapter
from urllib3.util import Retry

manager = digitalocean.Manager(token=os.environ["DIGITALOCEAN_API_KEY"])
# We just temporarily create the client now, to validate that we can
# auth to the server; reusing it after the whole install fails because
# the connection has been half-closed in a way that breaks it.
zulip.Client()
TEST_DROPLET_SUBDOMAIN = "do"


def generate_ssh_keys() -> None:
    subprocess.check_call(
        ["ssh-keygen", "-f", str(Path.home()) + "/.ssh/id_ed25519", "-P", "", "-t", "ed25519"]
    )


def get_public_ssh_key() -> str:
    try:
        with open(str(Path.home()) + "/.ssh/id_ed25519.pub") as f:
            return f.read()
    except FileNotFoundError:
        return ""


def sleep_until_droplet_action_is_completed(
    droplet: digitalocean.Droplet, action_type: str
) -> None:
    incomplete = True
    while incomplete:
        for action in droplet.get_actions():
            action.load()
            print(f"...[{action.type}]: {action.status}")
            if action.type == action_type and action.status == "completed":
                incomplete = False
                break
        if incomplete:
            time.sleep(5)

    # Sometimes the droplet does not yet have an .ip_address value
    # (the attribute is None) after .load()ing the droplet. We cannot
    # proceed without the IP, so we wait in a loop until the IP is
    # returned to us.
    while True:
        droplet.load()
        if droplet.ip_address:
            break
        time.sleep(5)


def set_api_request_retry_limits(api_object: digitalocean.baseapi.BaseAPI) -> None:
    retry = Retry(connect=5, read=5, backoff_factor=0.1)
    adapter = HTTPAdapter(max_retries=retry)
    api_object._session.mount("https://", adapter)


def create_droplet(
    name: str, ssh_keys: list[str], image: str = "ubuntu-22-04-x64"
) -> digitalocean.Droplet:
    droplet = digitalocean.Droplet(
        token=manager.token,
        name=name,
        region="nyc3",
        size_slug="s-1vcpu-2gb",
        image=image,
        backups=False,
        ssh_keys=ssh_keys,
        tags=["github-action", "temporary"],
    )
    set_api_request_retry_limits(droplet)
    droplet.create()
    sleep_until_droplet_action_is_completed(droplet, "create")
    return droplet


def create_ssh_key(name: str, public_key: str) -> digitalocean.SSHKey:
    action_public_ssh_key_object = digitalocean.SSHKey(
        name=name, public_key=public_key, token=manager.token
    )
    set_api_request_retry_limits(action_public_ssh_key_object)
    action_public_ssh_key_object.create()
    return action_public_ssh_key_object


def create_snapshot(droplet: digitalocean.Droplet, snapshot_name: str) -> None:
    droplet.take_snapshot(snapshot_name, power_off=True)
    droplet.load()
    sleep_until_droplet_action_is_completed(droplet, "snapshot")


def create_dns_records(droplet: digitalocean.Droplet) -> None:
    domain = digitalocean.Domain(token=manager.token, name="oneclick.zulip.dev")
    set_api_request_retry_limits(domain)
    domain.load()

    oneclick_test_app_record_names = [TEST_DROPLET_SUBDOMAIN, f"*.{TEST_DROPLET_SUBDOMAIN}"]
    for record in domain.get_records():
        if (
            record.name in oneclick_test_app_record_names
            and record.domain == "oneclick.zulip.dev"
            and record.type == "A"
        ):
            record.destroy()

    domain.load()
    for record_name in oneclick_test_app_record_names:
        domain.create_new_domain_record(type="A", name=record_name, data=droplet.ip_address)


def setup_one_click_app_installer(droplet: digitalocean.Droplet) -> None:
    subprocess.check_call(
        [
            "fab",
            "build_image",
            "-H",
            droplet.ip_address,
            "--keepalive",
            "5",
            "--connection-attempts",
            "10",
        ],
        cwd="marketplace-partners/marketplace_docs/templates/Fabric",
    )


def send_message(content: str) -> None:
    request = {
        "type": "stream",
        "to": os.environ["ONE_CLICK_ACTION_STREAM"],
        "topic": "digitalocean installer",
        "content": content,
    }
    zulip.Client().send_message(request)


if __name__ == "__main__":
    release_version = os.environ["RELEASE_VERSION"]

    generate_ssh_keys()
    action_public_ssh_key_object = create_ssh_key(
        f"oneclickapp-{release_version}-image-generator-public-key", get_public_ssh_key()
    )

    image_generator_droplet = create_droplet(
        f"oneclickapp-{release_version}-image-generator", [action_public_ssh_key_object]
    )

    setup_one_click_app_installer(image_generator_droplet)

    oneclick_image_name = f"oneclickapp-{release_version}"
    create_snapshot(image_generator_droplet, oneclick_image_name)
    snapshot = image_generator_droplet.get_snapshots()[0]
    send_message(f"One click app image `{oneclick_image_name}` created.")

    image_generator_droplet.destroy()
    action_public_ssh_key_object.destroy()

    test_droplet_name = f"oneclickapp-{release_version}-test"
    test_droplet = create_droplet(test_droplet_name, manager.get_all_sshkeys(), image=snapshot.id)
    create_dns_records(test_droplet)
    send_message(
        f"Test droplet `{test_droplet_name}` created. SSH as root to {TEST_DROPLET_SUBDOMAIN}.oneclick.zulip.dev for testing."
    )
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: zulip-main/tools/oneclickapps/README.md

```text
# One click app release automation

This directory contains scripts for automating the release of Zulip one click apps.

## DigitalOcean 1-Click Application

`prepare_digital_ocean_one_click_app_release.py` creates the image of DigitalOcean 1-Click
app from the latest Zulip release (fetched from https://download.zulip.com/server/). It will
also create a test droplet from the image and send the image and droplet
details to a pre-configured Zulip stream. Anyone, whose key is added to the
Zulip DigitalOcean team can SSH into the droplet for testing.

### Running as GitHub action

`.github/workflows/update-oneclick-apps.yml` is configured to invoke
`prepare_digital_ocean_one_click_app_release.py` as a GitHub action during each Zulip
server release.

You also need to set the following secrets in your GitHub repository to make the action
work correctly. These secrets are passed as environment variables to the GitHub action.

- `ONE_CLICK_ACTION_DIGITALOCEAN_API_KEY` - DigitalOcean API key used for creating droplets, snapshots etc.
- `ONE_CLICK_ACTION_ZULIP_BOT_API_KEY` - The API key of the Zulip bot used for sending messages.
- `ONE_CLICK_ACTION_ZULIP_BOT_EMAIL` - The email of the Zulip bot.

Also pass the following as environment variables in `.github/workflows/update-oneclick-apps.yml`.

- `PYTHON_DIGITALOCEAN_REQUEST_TIMEOUT_SEC` - This configures the maximum number of seconds
  to wait before the requests made by `python-digitalocean` time out. If not configured, it's
  common for the requests to take 20+ minutes before getting timed out.

### Verifying the one click app image

- The action will send the image name and test droplet details to the stream configured in the
  above steps.
- SSH into the test droplet by following the instructions in the message. In order to do this,
  you need to add your SSH key to the team.
- After logging into the test droplet, exit the installer and run the following script.

  https://raw.githubusercontent.com/digitalocean/marketplace-partners/master/scripts/99-img-check.sh

  This script checks whether the image created is valid. It is also run by the DigitalOcean team
  before they approve the image submission in the one click app marketplace.

- If there are no errors (you can ignore most of the warnings), exit the SSH connection and
  reconnect.
- Populate the details asked by the installer and verify that the installer completes successfully.
  One error is expected:
  ```
  User root has a populated authorized_keys file in /root/.ssh/authorized_keys
  ```
  The key in that file will be the SSH key you've authenticated with.
  If there are other errors see the section below.
- Use the link generated by the installer to create a new Zulip organization. Do some basic
  testing like sending a bunch of messages and reloading the webpage.
- If there are no issues, submit the image in the
  [DigitalOcean vendor portal](https://marketplace.digitalocean.com/vendorportal). You need to be
  added to the vendor portal team for doing this. Ask Tim to add you if required. During the submission,
  make sure to update the blog post URL if it's a major release.
- Keep checking the vendor portal for change in status of the submission. DigitalOcean does nominally send
  emails when there are updates on the submission, but we have found the emails to not always arrive.
- If there are any issues with submission, rebuild the image by manually invoking the script and
  resubmit. The issues we have seen mostly in the past are caused by the dependencies getting outdated
  by the time the DigitalOcean team run the checks. In that case you have to just rebuild the image
  by invoking the script.
- Delete the test droplet `oneclickapp-{release_version}-test` after you have completed testing
  by going to the [DigitalOcean Zulip team account](https://cloud.digitalocean.com/droplets?i=0242e0).
  If there are other existing test droplets with the same name format but with with older release versions
  feel free to delete them as well. These droplets are also tagged with the `github-action` and `temporary`
  tags.

**Errors**

If there are any errors while setting up the one click app installer, you have three options

- Include the fix in the Fabric script that setups the installer.
  [01-initial-setup](https://raw.githubusercontent.com/zulip/marketplace-partners/master/marketplace_docs/templates/Fabric/scripts/01-initial-setup)
  file should be a good place to include the fix. See
  [zulip/marketplace-partners#4](https://github.com/zulip/marketplace-partners/pull/4/files) for an
  example fix.
- Wait for the next release to fix the error.
```

--------------------------------------------------------------------------------

---[FILE: companies.json]---
Location: zulip-main/tools/screenshots/companies.json

```json
[
    {
        "recipient_type": "channel",
        "channel": "general",
        "color": "#94C849",
        "topic": "Zulip features",
        "users": {
            "Bo Williams": {},
            "Ariella Drake": {},
            "Kevin Lin": {},
            "Nolan Turner": {},
            "Anna Smith": {},
            "Zoe Davis": {}
        },
        "messages": [
            {
                "sender": "Bo Williams",
                "content": "When you hover over a Python code block, you'll now see a button that opens the code in a playground. Try it out: :playground_slide:\n\n```python\nprint(\"Hello world!\")\n```",
                "reactions": {
                    "tada": [
                        "Zoe Davis",
                        "Nolan Turner",
                        "Anna Smith",
                        "Ariella Drake",
                        "Kevin Lin"
                    ]
                },
                "date": {"year": 2024, "month": 5, "day": 16, "hour": 13, "minute": 59}
            },
            {
                "sender": "Ariella Drake",
                "content": "LaTeX math blocks are nice — I wish I had them in grad school. :wink:",
                "date": {"year": 2024, "month": 5, "day": 16, "hour": 14, "minute": 27}
            },
            {
                "sender": "Ariella Drake",
                "content": "```math\n\\phi = 1 + \\cfrac{1}{1+\\cfrac{1}{1+\\cdots}}\n```",
                "date": {"year": 2024, "month": 5, "day": 16, "hour": 14, "minute": 30}
            },
            {
                "sender": "Kevin Lin",
                "content": "Interesting! https://www.youtube.com/watch?v=cbj59mVwErg",
                "date": {"year": 2024, "month": 5, "day": 16, "hour": 15, "minute": 5}
            }
        ],
        "screenshot": "static/images/landing-page/companies/message-formatting-top.png"
    },
    {
        "recipient_type": "channel",
        "channel": "general",
        "color": "#9987E1",
        "topic": "presentation feedback",
        "users": {
            "Maxy Stert": {},
            "Kevin Lin": {}
        },
        "messages": [
            {
                "sender": "Maxy Stert",
                "content": "Could someone take a look at my presentation draft? [presentation](#)",
                "date": {"year": 2024, "month": 5, "day": 17, "hour": 16, "minute": 35}
            },
            {
                "sender": "Kevin Lin",
                "content": "Sure! Let’s do a call at <time:2024-05-17T14:30:00-07:00> to go through it.",
                "reactions": {
                    "+1": ["Maxy Stert"]
                },
                "date": {"year": 2024, "month": 5, "day": 17, "hour": 17, "minute": 37}
            },
            {
                "sender": "Maxy Stert",
                "content": "[Join video call.](#)",
                "date": {"year": 2024, "month": 5, "day": 17, "hour": 21, "minute": 30}
            },
            {
                "sender": "Maxy Stert",
                "content": "I got great feedback from @_**Kevin Lin**",
                "date": {"year": 2024, "month": 5, "day": 17, "hour": 22, "minute": 7}
            },
            {
                "sender": "Maxy Stert",
                "content": "/poll When we should do a dry run?\nExtend tomorrow's meeting\nNext week",
                "date": {"year": 2024, "month": 5, "day": 17, "hour": 22, "minute": 15}
            }
        ],
        "screenshot": "static/images/landing-page/companies/message-formatting-bottom.png"
    }
]
```

--------------------------------------------------------------------------------

---[FILE: for-education.json]---
Location: zulip-main/tools/screenshots/for-education.json

```json
[
    {
        "recipient_type": "channel",
        "channel": "Lecture 3 Heaps",
        "color": "#A6DCBF",
        "topic": "✔ problem 2a clarification",
        "users": {
            "John Lin": {},
            "Dal Kim": {}
        },
        "messages": [
            {
                "sender": "John Lin",
                "content": "I'm confused -- why does the code for this one say: \n\n```python\nint my_array[] = {0, 1, 2, 3}\n```\nBut in 2b it's:\n\n```python\nint my_array[4] = {0, 1, 2, 3}\n```\nis it a typo?",
                "edited": true,
                "date": {"year": 2025, "month": 6, "day": 19, "hour": 18, "minute": 0}
            },
            {
                "sender": "Dal Kim",
                "content": "Nope, both are correct! Take a look at slide 17 in the lecture notes.",
                "reactions": {
                    "+1": ["John Lin"]
                },
                "date": {"year": 2025, "month": 6, "day": 19, "hour": 18, "minute": 37}
            },
            {
                "sender": "Notification Bot",
                "content": "@_**Dal Kim** has marked this topic as resolved.",
                "date": {"year": 2025, "month": 6, "day": 19, "hour": 19, "minute": 0}
            }
        ],
        "screenshot": "static/images/landing-page/education/message_formatting_day_1.png"
    },
    {
        "recipient_type": "channel",
        "channel": "Lecture 3 Heaps",
        "color": "#A6DCBF",
        "topic": "lecture notes and recording",
        "users": {
            "Elena García": {},
            "Dal Kim": {},
            "John Lin": {},
            "Maxy Stert": {},
            "Kevin Lin": {}
        },
        "messages": [
            {
                "sender": "Elena García",
                "content": "Here are the notes for today's class: [lecture3.pdf](#). You can also [watch the recording](#) if you missed it.",
                "reactions": {
                    "+1": ["Dal Kim", "John Lin", "Maxy Stert", "Kevin Lin"]
                },
                "starred": true,
                "date": {"year": 2025, "month": 5, "day": 21, "hour": 11, "minute": 3}
            }
        ],
        "screenshot": "static/images/landing-page/education/interactive_messaging_day_1.png"
    },
    {
        "recipient_type": "channel",
        "channel": "staff",
        "invite_only": true,
        "color": "#E4523D",
        "topic": "assignment #3 solutions",
        "users": {
            "Dal Kim": {},
            "Zoe Davis": {}
        },
        "messages": [
            {
                "sender": "Dal Kim",
                "content": "Can someone double-check my solution for problem 4? The run time is $$O(\\log n)$$, right?",
                "date": {"year": 2025, "month": 5, "day": 19, "hour": 14, "minute": 40}
            },
            {
                "sender": "Zoe Davis",
                "content": "Yep, that's the amortized time, but the upper bound of it is $$O(2^{2\\sqrt{\\log \\log n}})$$.",
                "reactions": {
                    "+1": ["Iago"]
                },
                "date": {"year": 2025, "month": 5, "day": 19, "hour": 15, "minute": 43}
            }
        ],
        "screenshot": "static/images/landing-page/education/message_formatting_day_2.png"
    },
    {
        "recipient_type": "channel",
        "channel": "announcements",
        "color": "#A6C7E5",
        "topic": "homework reminders",
        "users": {
            "Elena García": {}
        },
        "messages": [
            {
                "sender": "Elena García",
                "content": "@**everyone** Please remember to submit your assignments before <time:2025-05-12T00:00:00+05:30>! You will lose **at least 25%** of the credit if your assignment is late.",
                "date": {"year": 2025, "month": 5, "day": 21, "hour": 13, "minute": 10}
            },
            {
                "sender": "Elena García",
                "content": "It sounds like many of you are stuck at the bonus problem, so here's a hint. Please think about the question first before you view it\n\n```spoiler Hint for bonus problem\nHint\n```",
                "date": {"year": 2025, "month": 5, "day": 21, "hour": 14, "minute": 11}
            }
        ],
        "screenshot": "static/images/landing-page/education/interactive_messaging_day_2.png"
    },
    {
        "recipient_type": "channel",
        "channel": "announcements",
        "color": "#A6C7E5",
        "topic": "rescheduling office hours",
        "user_groups": [
            {
                "group_name": "section 1",
                "members": ["Dal Kim"]
            }
        ],
        "users": {
            "Dal Kim": {}
        },
        "messages": [
            {
                "sender": "Dal Kim",
                "content": "@*section 1* I need to reschedule my office hours this week. Which time works better?",
                "date": {"year": 2025, "month": 5, "day": 20, "hour": 15, "minute": 15}
            },
            {
                "sender": "Dal Kim",
                "content": "/poll Section 1 office hours\nThursday 1-2 PM\nFriday 10-11 AM",
                "date": {"year": 2025, "month": 5, "day": 20, "hour": 15, "minute": 20}
            }
        ],
        "screenshot": "static/images/landing-page/education/interactive_messaging_day_3.png"
    }
]
```

--------------------------------------------------------------------------------

---[FILE: for-events.json]---
Location: zulip-main/tools/screenshots/for-events.json

```json
[
    {
        "recipient_type": "channel",
        "channel": "Session 2 Keynote",
        "color": "#C6A8AD",
        "topic": "slides and presentation",
        "users": {
            "Dal Kim": {},
            "Kevin Lin": {},
            "John Lin": {}
        },
        "messages": [
            {
                "sender": "Dal Kim",
                "content": "Welcome everyone! Here are the slides for the keynote talk: [keynote-slides.ppt](#). Don't forget to join for a live presentation at <time:2024-05-22T17:00:00+05:30>!",
                "starred": true,
                "reactions": {
                    "+1": ["Iago", "Kevin Lin", "John Lin"],
                    "tada": ["John Lin", "Kevin Lin"]
                },
                "date": {"year": 2024, "month": 5, "day": 21, "hour": 13, "minute": 45}
            },
            {
                "sender": "Dal Kim",
                "content": "Join now for the Keynote presentation!\nWe'll be using this stream for Q&A.\n\n[Join video call.](#)",
                "date": {"year": 2024, "month": 5, "day": 21, "hour": 17, "minute": 0}
            }
        ],
        "screenshot": "static/images/landing-page/events/your_communication_hub_day_1.png"
    },
    {
        "recipient_type": "channel",
        "channel": "general",
        "color": "#9987E1",
        "topic": "conference feedback",
        "users": {
            "James Williams": {}
        },
        "messages": [
            {
                "sender": "James Williams",
                "content": "As we are wrapping up, let us know what you enjoyed the most about this conference.",
                "date": {"year": 2024, "month": 5, "day": 21, "hour": 20, "minute": 50}
            },
            {
                "sender": "James Williams",
                "content": "/poll What did you like the best?\nKeynote address\nLightning talks\nUsing Zulip",
                "date": {"year": 2024, "month": 5, "day": 21, "hour": 20, "minute": 55}
            }
        ],
        "screenshot": "static/images/landing-page/events/your_communication_hub_day_2.png"
    },
    {
        "recipient_type": "channel",
        "channel": "Day 2: Intro to RSA",
        "color": "#94C849",
        "topic": "factorization algorithms",
        "users": {
            "Manvir Singh": {},
            "Zoe Davis": {},
            "Maxy Stert": {}
        },
        "messages": [
            {
                "sender": "Manvir Singh",
                "content": "You could use [Pollard's rho algorithm](#), which factors a number n in time $$O(n^{\\frac{1}{4}})$$, faster than trial division:\n\n```python\ndef pollard_rho(n: int) -> int:\n    g = lambda x: (x ** 2 + 1) % n\n    x, y, d = 2, 2, 1\n    while d == 1:\n        x, y = g(x), g(g(y))\n        d = math.gcd(x - y, n)\n    return d\n```",
                "reactions": {
                    "+1": ["Zoe Davis"]
                },
                "date": {"year": 2024, "month": 5, "day": 14, "hour": 16, "minute": 59}
            },
            {
                "sender": "Zoe Davis",
                "content": "The fastest known algorithm is the general number field sieve, which heuristically runs in time:\n```math\n\\exp\\left(\\left(\\sqrt[3]{\\frac{64}{9}} + o(1)\\right)(\\ln n)^{\\frac{1}{3}} (\\ln\\ln n)^{\\frac{2}{3}}\\right)\n```\n However, it is much more complicated.",
                "reactions": {
                    "runner": ["Manvir Singh"],
                    "thinking": ["Maxy Stert", "Iago"]
                },
                "date": {"year": 2024, "month": 5, "day": 14, "hour": 18, "minute": 19}
            }
        ],
        "screenshot": "static/images/landing-page/events/message_formatting_day.png"
    }
]
```

--------------------------------------------------------------------------------

---[FILE: for-research.json]---
Location: zulip-main/tools/screenshots/for-research.json

```json
[
    {
        "recipient_type": "channel",
        "channel": "general",
        "color": "#9987E1",
        "topic": "paper posted",
        "users": {
            "John Lin": {},
            "Dal Kim": {},
            "Bo Lin": {}
        },
        "messages": [
            {
                "sender": "John Lin",
                "content": "Hi all! We just posted a pre-publication draft of our paper! Sharing here for feedback, suggestions, etc. [paper.pdf](#)",
                "reactions": {
                    "tada": ["John Lin", "Iago", "Dal Kim", "Bo Lin"],
                    "eyes": ["Dal Kim", "Iago"]
                },
                "date": {"year": 2024, "month": 6, "day": 4, "hour": 14, "minute": 39}
            },
            {
                "sender": "Dal Kim",
                "content": "Just noticed a small typo in Figure 4. The caption says `detales` instead of `details`. :smile:",
                "reactions": {
                    "check": ["John Lin"]
                },
                "date": {"year": 2024, "month": 6, "day": 4, "hour": 14, "minute": 57}
            }
        ],
        "screenshot": "static/images/landing-page/research/interactive_messaging_day_1.png"
    },
    {
        "recipient_type": "channel",
        "channel": "thesis support group",
        "color": "#95A5FD",
        "topic": "chat live",
        "users": {
            "Zoe Davis": {},
            "James Williams": {},
            "Bo Lin": {},
            "Nolan Turner": {}
        },
        "messages": [
            {
                "sender": "Zoe Davis",
                "content": "Hey! How does <time:2024-05-14T17:00:00+05:30> sound for doing a video call today? My paper just got rejected.",
                "reactions": {
                    "+1": ["James Williams", "Iago", "Zoe Davis", "Bo Lin", "Nolan Turner"],
                    "broken_heart": ["James Williams", "Iago", "Zoe Davis", "Nolan Turner"]
                },
                "date": {"year": 2024, "month": 5, "day": 13, "hour": 15, "minute": 15}
            },
            {
                "sender": "James Williams",
                "content": "I need to send off a draft of chapter 2 to my advisor. Will try to make it!",
                "date": {"year": 2024, "month": 5, "day": 13, "hour": 15, "minute": 34}
            },
            {
                "sender": "Zoe Davis",
                "content": "@**everyone** Video call is happening now! [Join video call.](#)",
                "date": {"year": 2024, "month": 5, "day": 13, "hour": 16, "minute": 30}
            }
        ],
        "screenshot": "static/images/landing-page/research/interactive_messaging_day_2.png"
    }
]
```

--------------------------------------------------------------------------------

````
