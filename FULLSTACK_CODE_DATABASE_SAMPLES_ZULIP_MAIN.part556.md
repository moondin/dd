---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 556
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 556 of 1290)

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

---[FILE: test_script.py]---
Location: zulip-main/tools/lib/test_script.py

```python
import glob
import os
import subprocess
import sys
from argparse import ArgumentParser
from collections.abc import Iterable

from scripts.lib.zulip_tools import get_dev_uuid_var_path
from version import PROVISION_VERSION

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def get_version_file() -> str:
    uuid_var_path = get_dev_uuid_var_path()
    return os.path.join(uuid_var_path, "provision_version")


PREAMBLE = """
Provisioning state check failed! This check compares
`var/provision_version` (currently {}) to the version in
source control (`version.py`), which is {}, to see if you
likely need to provision before this command can run
properly.
"""


def preamble(version: tuple[int, ...]) -> str:
    text = PREAMBLE.format(version, PROVISION_VERSION)
    text += "\n"
    return text


NEED_TO_DOWNGRADE = """
The branch you are currently on expects an older version of
dependencies than the version you provisioned last. This may
be ok, but it's likely that you either want to rebase your
branch on top of upstream/main or re-provision your machine.

Do this: `./tools/provision`
"""

NEED_TO_UPGRADE = """
The branch you are currently on has added dependencies beyond
what you last provisioned. Your command is likely to fail
until you add dependencies by provisioning.

Do this: `./tools/provision`
"""


def get_provisioning_status() -> tuple[bool, str | None]:
    version_file = get_version_file()
    if not os.path.exists(version_file):
        # If the developer doesn't have a version_file written by
        # a previous provision, then we don't do any safety checks
        # here on the assumption that the developer is managing
        # their own dependencies and not running provision.
        return True, None

    with open(version_file) as f:
        version = tuple(map(int, f.read().strip().split(".")))

    # We may be more provisioned than the branch we just moved to.  As
    # long as the major version hasn't changed, then we should be ok.
    if version < PROVISION_VERSION:
        return False, preamble(version) + NEED_TO_UPGRADE
    elif version < (PROVISION_VERSION[0] + 1,):
        return True, None
    else:
        return False, preamble(version) + NEED_TO_DOWNGRADE


def assert_provisioning_status_ok(skip_provision_check: bool) -> None:
    if not skip_provision_check:
        ok, msg = get_provisioning_status()
        if not ok:
            print(msg)
            print(
                "If you really know what you are doing, use --skip-provision-check to run anyway."
            )
            sys.exit(1)


def add_provision_check_override_param(parser: ArgumentParser) -> None:
    """
    Registers --skip-provision-check argument to be used with various commands/tests in our tools.
    """
    parser.add_argument(
        "--skip-provision-check",
        action="store_true",
        help="Skip check that provision has been run; useful to save time if you know the dependency changes are not relevant to this command and will not cause it to fail",
    )


def find_js_test_files(test_dir: str, files: Iterable[str]) -> list[str]:
    test_files = []
    for file in files:
        file = min(
            (
                os.path.join(test_dir, file_name)
                for file_name in os.listdir(test_dir)
                if file_name.startswith(file)
            ),
            default=file,
        )

        if not os.path.isfile(file):
            raise Exception(f"Cannot find a matching file for '{file}' in '{test_dir}'")

        test_files.append(os.path.abspath(file))

    if not test_files:
        test_files = sorted(
            glob.glob(os.path.join(test_dir, "*.ts")) + glob.glob(os.path.join(test_dir, "*.js"))
        )

    return test_files


def prepare_puppeteer_run(is_firefox: bool = False) -> None:
    os.chdir(ZULIP_PATH)
    # This will determine if the browser will be firefox or chrome.
    os.environ["PUPPETEER_PRODUCT"] = "firefox" if is_firefox else "chrome"
    subprocess.check_call(["node", "install.mjs"], cwd="node_modules/puppeteer")
    os.makedirs("var/puppeteer", exist_ok=True)
    for f in glob.glob("var/puppeteer/failure-*.png"):
        os.remove(f)
```

--------------------------------------------------------------------------------

---[FILE: test_server.py]---
Location: zulip-main/tools/lib/test_server.py
Signals: Django

```python
import os
import subprocess
import sys
import time
from collections.abc import Iterator
from contextlib import ExitStack, contextmanager

# Verify the Zulip venv is available.
from tools.lib import sanity_check

sanity_check.check_venv(__file__)

import django
import requests

MAX_SERVER_WAIT = 180

TOOLS_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if TOOLS_DIR not in sys.path:
    sys.path.insert(0, os.path.dirname(TOOLS_DIR))

from scripts.lib.zulip_tools import get_or_create_dev_uuid_var_path
from zerver.lib.test_fixtures import update_test_databases_if_required


def set_up_django(external_host: str) -> None:
    os.environ["FULL_STACK_ZULIP_TEST"] = "1"
    os.environ["TEST_EXTERNAL_HOST"] = external_host
    os.environ["LOCAL_UPLOADS_DIR"] = get_or_create_dev_uuid_var_path("test-backend/test_uploads")
    os.environ["DJANGO_SETTINGS_MODULE"] = "zproject.test_settings"
    django.setup()
    os.environ["PYTHONUNBUFFERED"] = "y"


def assert_server_running(server: "subprocess.Popen[bytes]", log_file: str | None) -> None:
    """Get the exit code of the server, or None if it is still running."""
    if server.poll() is not None:
        message = "Server died unexpectedly!"
        if log_file:
            message += f"\nSee {log_file}\n"
        raise RuntimeError(message)


def server_is_up(server: "subprocess.Popen[bytes]", log_file: str | None) -> bool:
    assert_server_running(server, log_file)
    try:
        # We could get a 501 error if the reverse proxy is up but the Django app isn't.
        # Note that zulipdev.com is mapped via DNS to 127.0.0.1.
        return requests.get("http://zulipdev.com:9981/accounts/home").status_code == 200
    except requests.RequestException:
        return False


@contextmanager
def test_server_running(
    skip_provision_check: bool = False,
    external_host: str = "testserver",
    log_file: str | None = None,
    dots: bool = False,
    enable_help_center: bool = False,
) -> Iterator[None]:
    with ExitStack() as stack:
        log = sys.stdout
        if log_file:
            if os.path.exists(log_file) and os.path.getsize(log_file) < 100000:
                log = stack.enter_context(open(log_file, "a"))
                log.write("\n\n")
            else:
                log = stack.enter_context(open(log_file, "w"))

        set_up_django(external_host)

        update_test_databases_if_required(rebuild_test_database=True)

        # Run this not through the shell, so that we have the actual PID.
        run_dev_server_command = ["tools/run-dev", "--test", "--streamlined"]
        if skip_provision_check:
            run_dev_server_command.append("--skip-provision-check")
        if enable_help_center:
            run_dev_server_command.append("--help-center-static-build")
        server = subprocess.Popen(run_dev_server_command, stdout=log, stderr=log)

        try:
            # Wait for the server to start up.
            print(end="\nWaiting for test server (may take a while)")
            if not dots:
                print("\n", flush=True)
            t = time.time()
            while not server_is_up(server, log_file):
                if dots:
                    print(end=".", flush=True)
                time.sleep(0.4)
                if time.time() - t > MAX_SERVER_WAIT:
                    raise Exception("Timeout waiting for server")
            print("\n\n--- SERVER IS UP! ---\n", flush=True)

            # DO OUR ACTUAL TESTING HERE!!!
            yield

        finally:
            assert_server_running(server, log_file)
            server.terminate()
            server.wait()


if __name__ == "__main__":
    # The code below is for testing this module works
    with test_server_running():
        print("\n\n SERVER IS UP!\n\n")
```

--------------------------------------------------------------------------------

````
