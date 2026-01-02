---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 549
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 549 of 1290)

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

---[FILE: test-help-documentation]---
Location: zulip-main/tools/test-help-documentation

```text
#!/usr/bin/env python3
import argparse
import contextlib
import os
import subprocess
import sys
from collections.abc import Iterator

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ZULIP_PATH)
sys.path.insert(0, ZULIP_PATH)

# check for the venv
from tools.lib import sanity_check

sanity_check.check_venv(__file__)

from tools.lib.test_script import add_provision_check_override_param
from tools.lib.test_server import test_server_running

parser = argparse.ArgumentParser()
add_provision_check_override_param(parser)
parser.add_argument(
    "--skip-external-links",
    dest="skip_external_link_check",
    action="store_true",
    help="Skip checking of external links.",
)
parser.add_argument(
    "--help-center",
    dest="enable_help_center",
    action="store_true",
    help="Test help center generated as part of the astro build process. If this option is set to True, this script assumes that you already have performend the build step.",
)
options = parser.parse_args()

os.makedirs("var/help-documentation", exist_ok=True)

LOG_FILE = "var/help-documentation/server.log"
external_host = "localhost:9981"

extra_args = []

if options.skip_external_link_check:
    extra_args += ["-a", "skip_external=set"]


@contextlib.contextmanager
def vnu_servlet() -> Iterator[None]:
    with subprocess.Popen(
        [
            "java",
            "-cp",
            os.path.join(
                os.path.dirname(__file__),
                "../node_modules/vnu-jar/build/dist/vnu.jar",
            ),
            "-Dnu.validator.servlet.bind-address=127.0.0.1",
            "nu.validator.servlet.Main",
            "9988",
        ]
    ) as proc:
        yield
        proc.terminate()


with (
    vnu_servlet(),
    test_server_running(
        options.skip_provision_check,
        external_host,
        log_file=LOG_FILE,
        dots=True,
        enable_help_center=options.enable_help_center,
    ),
):
    ret_help_doc = subprocess.call(
        ["scrapy", "crawl_with_status", *extra_args, "help_documentation_crawler"],
        cwd="tools/documentation_crawler",
    )
    extra_args += ["-a", "validate_html=set"]
    ret_api_doc = subprocess.call(
        ["scrapy", "crawl_with_status", *extra_args, "api_documentation_crawler"],
        cwd="tools/documentation_crawler",
    )
    ret_portico_doc = subprocess.call(
        ["scrapy", "crawl_with_status", *extra_args, "portico_documentation_crawler"],
        cwd="tools/documentation_crawler",
    )

if ret_help_doc != 0 or ret_api_doc != 0 or ret_portico_doc != 0:
    print("\033[0;91m")
    print("Failed")
    print("\033[0m")
else:
    print("\033[0;92m")
    print("Passed!")
    print("\033[0m")


sys.exit(ret_help_doc or ret_api_doc or ret_portico_doc)
```

--------------------------------------------------------------------------------

---[FILE: test-js-with-node]---
Location: zulip-main/tools/test-js-with-node

```text
#!/usr/bin/env python3
import argparse
import glob
import os
import pwd
import subprocess
import sys
from typing import Any

TOOLS_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(TOOLS_DIR))
ROOT_DIR = os.path.dirname(TOOLS_DIR)

# check for the venv
from tools.lib import sanity_check

sanity_check.check_venv(__file__)

# Import this after we do the sanity_check so it doesn't crash.
import orjson
from zulint.printer import BOLDRED, CYAN, ENDC, GREEN

INDEX_JS = os.path.join(ROOT_DIR, "web/tests/lib/index.cjs")
NODE_COVERAGE_PATH = os.path.join(ROOT_DIR, "var/node-coverage/coverage-final.json")

# Ideally, we wouldn't need this line, but it seems to be required to
# avoid problems finding node_modules when running `cd tools; ./test-js-with-node`.
os.chdir(ROOT_DIR)

USAGE = """
    tools/test-js-with-node                                  - to run all tests
    tools/test-js-with-node util.test.cjs activity.test.cjs  - to run just a couple tests
    tools/test-js-with-node --coverage                       - to generate coverage report
    """


def make_set(files: list[str]) -> set[str]:
    for i in range(1, len(files)):
        if files[i - 1] > files[i]:
            raise Exception(f"Please move {files[i]} so that names are sorted.")
    return set(files)


# We do not yet require 100% line coverage for these files:
EXEMPT_FILES = make_set(
    [
        "web/src/about_zulip.ts",
        "web/src/add_group_members_pill.ts",
        "web/src/add_stream_options_popover.ts",
        "web/src/add_subscribers_pill.ts",
        "web/src/admin.ts",
        "web/src/alert_popup.ts",
        "web/src/alert_words_ui.ts",
        "web/src/assets.d.ts",
        "web/src/attachments.ts",
        "web/src/attachments_ui.ts",
        "web/src/audible_notifications.ts",
        "web/src/avatar.ts",
        "web/src/banners.ts",
        "web/src/base_page_params.ts",
        "web/src/blueslip.ts",
        "web/src/blueslip_stacktrace.ts",
        "web/src/bootstrap_typeahead.ts",
        "web/src/bot_helper.ts",
        "web/src/browser_history.ts",
        "web/src/buddy_list.ts",
        "web/src/buttons.ts",
        "web/src/channel_folders_popover.ts",
        "web/src/channel_folders_ui.ts",
        "web/src/click_handlers.ts",
        "web/src/color_picker_popover.ts",
        "web/src/compose.ts",
        "web/src/compose_actions.ts",
        "web/src/compose_banner.ts",
        "web/src/compose_call_ui.ts",
        "web/src/compose_closed_ui.ts",
        "web/src/compose_fade.ts",
        "web/src/compose_notifications.ts",
        "web/src/compose_paste.ts",
        "web/src/compose_recipient.ts",
        "web/src/compose_reply.ts",
        "web/src/compose_send_menu_popover.ts",
        "web/src/compose_setup.ts",
        "web/src/compose_state.ts",
        "web/src/compose_textarea.ts",
        "web/src/compose_tooltips.ts",
        "web/src/compose_ui.ts",
        "web/src/compose_validate.ts",
        "web/src/composebox_typeahead.ts",
        "web/src/condense.ts",
        "web/src/confirm_dialog.ts",
        "web/src/copied_tooltip.ts",
        "web/src/copy_messages.ts",
        "web/src/csrf.ts",
        "web/src/css_variables.ts",
        "web/src/custom_profile_fields_ui.ts",
        "web/src/debug.ts",
        "web/src/demo_organizations_ui.ts",
        "web/src/deprecated_feature_notice.ts",
        "web/src/desktop_integration.ts",
        "web/src/desktop_notifications.ts",
        "web/src/dialog_widget.ts",
        "web/src/drafts.ts",
        "web/src/drafts_overlay_ui.ts",
        "web/src/dropdown_widget.ts",
        "web/src/echo.ts",
        "web/src/electron_bridge.ts",
        "web/src/email_pill.ts",
        "web/src/emoji_frequency.ts",
        "web/src/emoji_picker.ts",
        "web/src/emojisets.ts",
        "web/src/favicon.ts",
        "web/src/feedback_widget.ts",
        "web/src/fetch_status.ts",
        "web/src/flatpickr.ts",
        "web/src/gear_menu.ts",
        "web/src/gif_state.ts",
        "web/src/giphy.ts",
        "web/src/global.ts",
        "web/src/group_permission_settings.ts",
        "web/src/group_setting_pill.ts",
        "web/src/hash_util.ts",
        "web/src/hashchange.ts",
        "web/src/hbs.d.ts",
        "web/src/hotkey.ts",
        "web/src/inbox_ui.ts",
        "web/src/inbox_util.ts",
        "web/src/info_overlay.ts",
        "web/src/information_density.ts",
        "web/src/input_pill.ts",
        "web/src/inputs.ts",
        "web/src/integration_branch_pill.ts",
        "web/src/integration_url_modal.ts",
        "web/src/invite.ts",
        "web/src/invite_stream_picker_pill.ts",
        "web/src/left_sidebar_navigation_area.ts",
        "web/src/left_sidebar_navigation_area_popovers.ts",
        "web/src/left_sidebar_tooltips.ts",
        "web/src/lightbox.ts",
        "web/src/list_util.ts",
        "web/src/list_widget.ts",
        "web/src/loading.ts",
        "web/src/local_message.ts",
        "web/src/localstorage.ts",
        "web/src/message_actions_popover.ts",
        "web/src/message_delete.ts",
        "web/src/message_edit.ts",
        "web/src/message_edit_history.ts",
        "web/src/message_events.ts",
        "web/src/message_events_util.ts",
        "web/src/message_feed_loading.ts",
        "web/src/message_feed_top_notices.ts",
        "web/src/message_fetch.ts",
        "web/src/message_list.ts",
        "web/src/message_list_data.ts",
        "web/src/message_list_data_cache.ts",
        "web/src/message_list_hover.ts",
        "web/src/message_list_tooltips.ts",
        "web/src/message_list_view.ts",
        "web/src/message_lists.ts",
        "web/src/message_live_update.ts",
        "web/src/message_notifications.ts",
        "web/src/message_reminder.ts",
        "web/src/message_report.ts",
        "web/src/message_scroll.ts",
        "web/src/message_scroll_state.ts",
        "web/src/message_summary.ts",
        "web/src/message_util.ts",
        "web/src/message_view.ts",
        "web/src/message_view_header.ts",
        "web/src/message_viewport.ts",
        "web/src/messages_overlay_ui.ts",
        "web/src/modals.ts",
        "web/src/mouse_drag.ts",
        "web/src/muted_users_ui.ts",
        "web/src/narrow_history.ts",
        "web/src/narrow_title.ts",
        "web/src/navbar_alerts.ts",
        "web/src/navbar_help_menu.ts",
        "web/src/navbar_menus.ts",
        "web/src/navigate.ts",
        "web/src/onboarding_steps.ts",
        "web/src/overlay_util.ts",
        "web/src/overlays.ts",
        "web/src/padded_widget.ts",
        "web/src/page_params.ts",
        "web/src/personal_menu_popover.ts",
        "web/src/playground_links_popover.ts",
        "web/src/pm_list.ts",
        "web/src/pm_list_dom.ts",
        "web/src/poll_data.ts",
        "web/src/poll_widget.ts",
        "web/src/popover_menus.ts",
        "web/src/popover_menus_data.ts",
        "web/src/popovers.ts",
        "web/src/popup_banners.ts",
        "web/src/read_receipts.ts",
        "web/src/realm_icon.ts",
        "web/src/realm_logo.ts",
        "web/src/realm_playground.ts",
        "web/src/recent_view_ui.ts",
        "web/src/reload.ts",
        "web/src/reload_setup.ts",
        "web/src/reminders_overlay_ui.ts",
        "web/src/resize.ts",
        "web/src/resize_handler.ts",
        "web/src/rows.ts",
        "web/src/saved_snippets_ui.ts",
        "web/src/scheduled_messages.ts",
        "web/src/scheduled_messages_feed_ui.ts",
        "web/src/scheduled_messages_overlay_ui.ts",
        "web/src/scheduled_messages_ui.ts",
        "web/src/scroll_bar.ts",
        "web/src/scroll_util.ts",
        "web/src/search.ts",
        "web/src/search_pill.ts",
        "web/src/search_suggestion.ts",
        "web/src/sent_messages.ts",
        "web/src/sentry.ts",
        "web/src/server_event_types.ts",
        "web/src/server_events.js",
        "web/src/server_events_state.ts",
        "web/src/settings.ts",
        "web/src/settings_account.ts",
        "web/src/settings_banner.ts",
        "web/src/settings_bots.ts",
        "web/src/settings_components.ts",
        "web/src/settings_emoji.ts",
        "web/src/settings_exports.ts",
        "web/src/settings_folders.ts",
        "web/src/settings_invites.ts",
        "web/src/settings_linkifiers.ts",
        "web/src/settings_muted_users.ts",
        "web/src/settings_notifications.ts",
        "web/src/settings_org.ts",
        "web/src/settings_panel_menu.ts",
        "web/src/settings_playgrounds.ts",
        "web/src/settings_preferences.ts",
        "web/src/settings_profile_fields.ts",
        "web/src/settings_realm_domains.ts",
        "web/src/settings_realm_user_settings_defaults.ts",
        "web/src/settings_sections.ts",
        "web/src/settings_streams.ts",
        "web/src/settings_toggle.ts",
        "web/src/settings_ui.ts",
        "web/src/settings_user_topics.ts",
        "web/src/settings_users.ts",
        "web/src/setup.ts",
        "web/src/sidebar_ui.ts",
        "web/src/spectators.ts",
        "web/src/spoilers.ts",
        "web/src/starred_messages_ui.ts",
        "web/src/state_data.ts",
        "web/src/stream_card_popover.ts",
        "web/src/stream_color.ts",
        "web/src/stream_color_events.ts",
        "web/src/stream_create.ts",
        "web/src/stream_create_subscribers.ts",
        "web/src/stream_edit.ts",
        "web/src/stream_edit_subscribers.ts",
        "web/src/stream_edit_toggler.ts",
        "web/src/stream_list.ts",
        "web/src/stream_muting.ts",
        "web/src/stream_popover.ts",
        "web/src/stream_settings_api.ts",
        "web/src/stream_settings_components.ts",
        "web/src/stream_settings_containers.ts",
        "web/src/stream_settings_ui.ts",
        "web/src/stream_ui_updates.ts",
        "web/src/submessage.ts",
        "web/src/subscriber_api.ts",
        "web/src/tenor.ts",
        "web/src/theme.ts",
        "web/src/thumbnail.ts",
        "web/src/timerender.ts",
        "web/src/tippyjs.ts",
        "web/src/todo_widget.ts",
        "web/src/topic_filter_pill.ts",
        "web/src/topic_generator.ts",
        "web/src/topic_list.ts",
        "web/src/topic_popover.ts",
        "web/src/typing.ts",
        "web/src/typing_events.ts",
        "web/src/ui_init.js",
        "web/src/ui_report.ts",
        "web/src/ui_util.ts",
        "web/src/unread.ts",
        "web/src/unread_ops.ts",
        "web/src/unread_ui.ts",
        "web/src/upload.ts",
        "web/src/upload_widget.ts",
        "web/src/user_card_popover.ts",
        "web/src/user_deactivation_ui.ts",
        "web/src/user_events.ts",
        "web/src/user_group_components.ts",
        "web/src/user_group_create.ts",
        "web/src/user_group_create_members.ts",
        "web/src/user_group_create_members_data.ts",
        "web/src/user_group_edit.ts",
        "web/src/user_group_edit_members.ts",
        "web/src/user_group_picker_pill.ts",
        "web/src/user_group_popover.ts",
        "web/src/user_groups.ts",
        "web/src/user_pill.ts",
        "web/src/user_profile.ts",
        "web/src/user_sort.ts",
        "web/src/user_status.ts",
        "web/src/user_status_ui.ts",
        "web/src/user_topic_popover.ts",
        "web/src/user_topics.ts",
        "web/src/user_topics_ui.ts",
        "web/src/views_util.ts",
        "web/src/widget_modal.ts",
        "web/src/zcommand.ts",
        "web/src/zform.ts",
        "web/src/zulip_test.ts",
        # Test library code isn't always fully used.
        "web/tests/lib/example_user.cjs",
        "web/tests/lib/mdiff.cjs",
        "web/tests/lib/real_jquery.cjs",
        "web/tests/lib/zjquery_element.cjs",
        "web/tests/lib/zpage_billing_params.cjs",
        # There are some important functions which are not called right now but will
        # be reused when we add tests for dropdown widget so it doesn't make sense to remove them.
        "web/tests/recent_view.test.cjs",
    ]
)

from tools.lib.test_script import add_provision_check_override_param, assert_provisioning_status_ok

parser = argparse.ArgumentParser(USAGE)
parser.add_argument("--coverage", action="store_true", help="Get coverage report")
add_provision_check_override_param(parser)
parser.add_argument("args", nargs=argparse.REMAINDER)
parser.add_argument(
    "--parallel",
    dest="parallel",
    action="store",
    type=int,
    # Since process startup time is a significant portion of total
    # runtime, so rather than doing os.cpu_count, we just do a fixed 4
    # processes by default.
    default=4,
    help="Specify the number of processes to run the "
    "tests in. Default is the number of logical CPUs",
)
options = parser.parse_args()
individual_files = options.args
parallel = options.parallel

if options.coverage and parallel > 1:
    parallel = 1
    print(
        BOLDRED + "You cannot use --coverage with parallel tests. Running in serial mode.\n" + ENDC
    )

assert_provisioning_status_ok(options.skip_provision_check)


def get_dev_host() -> str:
    # See similar code in dev_settings.py.  We only use
    # this to report where you can find coverage reports.
    # We duplicate the code here to avoid depending on
    # Django.

    host = os.getenv("EXTERNAL_HOST")
    if host is not None:
        return host

    user_id = os.getuid()
    user_name = pwd.getpwuid(user_id).pw_name
    if user_name == "zulipdev":
        hostname = os.uname()[1].lower()
        if ".zulipdev.org" not in hostname:
            hostname += ".zulipdev.org"
        return hostname + ":9991"
    else:
        # For local development environments, we use localhost by
        # default, via the "zulipdev.com" hostname.
        return "zulipdev.com:9991"


def print_error(msg: str) -> None:
    print(BOLDRED + "ERROR:" + ENDC + " " + msg)


def clean_file(orig_fn: str) -> str:
    fn = orig_fn
    if not fn.endswith(".test.cjs"):
        fn += ".test.cjs"
    if "web/tests/" not in fn:
        fn = os.path.join(ROOT_DIR, "web", "tests", fn)
    fn = os.path.abspath(fn)
    if not os.path.exists(fn):
        print(f"Cannot find {orig_fn} ({fn})")
        sys.exit(1)
    return fn


def clean_files(fns: list[str]) -> list[str]:
    cleaned_files = [clean_file(fn) for fn in fns]
    return cleaned_files


def run_tests_via_node_js() -> int:
    os.environ["TZ"] = "UTC"

    # The index.cjs test runner is the real "driver" here, and we launch
    # with either nyc or node, depending on whether we want coverage
    # reports.  Running under nyc is slower and creates funny
    # tracebacks, so you generally want to get coverage reports only
    # after making sure tests will pass.
    node_tests_cmd = ["node", "--stack-trace-limit=100", INDEX_JS]
    if individual_files:
        # If we passed a specific set of tests, run in serial mode.
        global parallel
        parallel = 1
        files = individual_files
    else:
        files = sorted(glob.glob(os.path.join(ROOT_DIR, "web/tests/*.test.cjs")))

    test_files = clean_files(files)

    print("Starting node tests...")

    # If we got this far, we can run the tests!
    ret = 0
    if parallel > 1:
        sub_tests = [test_files[i::parallel] for i in range(parallel)]
        parallel_processes = [subprocess.Popen(node_tests_cmd + sub_test) for sub_test in sub_tests]

        for process in parallel_processes:
            status_code = process.wait()
            if status_code != 0:
                ret = status_code
        return ret

    node_tests_cmd += test_files
    if options.coverage:
        os.environ["USING_INSTRUMENTED_CODE"] = "TRUE"
        coverage_dir = os.path.join(ROOT_DIR, "var/node-coverage")

        nyc = os.path.join(ROOT_DIR, "node_modules/.bin/nyc")
        command = [nyc]
        command += [f"--extension={ext}" for ext in [".cjs", ".cts", ".hbs", ".mjs", ".mts", ".ts"]]
        command += ["--report-dir", coverage_dir]
        command += ["--temp-directory", coverage_dir]
        command += ["-r=lcov", "-r=json", "-r=text-summary"]
        command += node_tests_cmd
    else:
        # Normal testing, no coverage analysis.
        # Run the index.cjs test runner, which runs all the other tests.
        command = node_tests_cmd

    try:
        ret = subprocess.check_call(command)
    except OSError:
        print(f"Bad command: {command}")
        raise
    except subprocess.CalledProcessError:
        print("\n** Tests failed, PLEASE FIX! **\n")
        sys.exit(1)
    return ret


def check_line_coverage(
    fn: str, line_coverage: dict[Any, Any], line_mapping: dict[Any, Any], log: bool = True
) -> bool:
    missing_lines = [
        str(line_mapping[line]["start"]["line"])
        for line, coverage in line_coverage.items()
        if coverage == 0
    ]
    if missing_lines:
        if log:
            print_error(f"{fn} no longer has complete node test coverage")
            print("  Lines missing coverage: {}".format(", ".join(sorted(missing_lines, key=int))))
            print()
        return False
    return True


def read_coverage() -> Any:
    coverage_json = None
    try:
        with open(NODE_COVERAGE_PATH, "rb") as f:
            coverage_json = orjson.loads(f.read())
    except OSError:
        print(NODE_COVERAGE_PATH + " doesn't exist. Cannot enforce fully covered files.")
        raise
    return coverage_json


def enforce_proper_coverage(coverage_json: Any) -> bool:
    all_js_files = {
        *glob.glob("web/src/*.js"),
        *glob.glob("web/src/*.ts"),
        *glob.glob("web/src/billing/*.js"),
        *glob.glob("web/tests/*.cjs"),
        *glob.glob("web/tests/lib/*.cjs"),
    }
    missing_files = sorted(EXEMPT_FILES - all_js_files)
    assert not missing_files, f"Missing files should be removed from EXEMPT_FILES: {missing_files}"
    enforce_fully_covered = sorted(all_js_files - EXEMPT_FILES)

    coverage_lost = False
    for relative_path in enforce_fully_covered:
        path = ROOT_DIR + "/" + relative_path
        if path not in coverage_json:
            coverage_lost = True
            print_error(f"{relative_path} has no node test coverage")
            continue
        line_coverage = coverage_json[path]["s"]
        line_mapping = coverage_json[path]["statementMap"]
        if not check_line_coverage(relative_path, line_coverage, line_mapping):
            coverage_lost = True
    if coverage_lost:
        print()
        print("It looks like your changes lost 100% test coverage in one or more files.")
        print("Ideally, you should add some tests to restore coverage.")
        print("A worse option is to update EXEMPT_FILES in `tools/test-js-with-node`.")
        print("To run this check locally, use `test-js-with-node --coverage`.")
        print()

    coverage_not_enforced = False
    for path in coverage_json:
        relative_path = os.path.relpath(path, ROOT_DIR)
        if relative_path in EXEMPT_FILES:
            line_coverage = coverage_json[path]["s"]
            line_mapping = coverage_json[path]["statementMap"]
            if check_line_coverage(relative_path, line_coverage, line_mapping, log=False):
                coverage_not_enforced = True
                print_error(f"{relative_path} unexpectedly has 100% line coverage.")

    if coverage_not_enforced:
        print()
        print("One or more fully covered files are miscategorized.")
        print("Remove the file(s) from EXEMPT_FILES in `tools/test-js-with-node`.")

    problems_encountered = coverage_lost or coverage_not_enforced
    return problems_encountered


ret = run_tests_via_node_js()

if options.coverage and ret == 0:
    if not individual_files:
        coverage_json = read_coverage()
        problems_encountered = enforce_proper_coverage(coverage_json)
        if problems_encountered:
            ret = 1

    reports_location = f"http://{get_dev_host()}/node-coverage/index.html"
    print()
    print("View coverage reports at " + CYAN + reports_location + ENDC)

print()
if ret == 0:
    print(GREEN + "Test(s) passed. SUCCESS!" + ENDC)
else:
    print(BOLDRED + "FAIL - Test(s) failed" + ENDC)

sys.exit(ret)
```

--------------------------------------------------------------------------------

---[FILE: test-js-with-puppeteer]---
Location: zulip-main/tools/test-js-with-puppeteer

```text
#!/usr/bin/env python3
import argparse
import os
import shlex
import subprocess
import sys

import requests

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from scripts.lib.zulip_tools import ENDC, FAIL, OKGREEN

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
from zerver.lib.test_fixtures import reset_zulip_test_database

# Request the special webpack setup for frontend integration tests,
# where webpack assets are compiled up front rather than running in
# watch mode.
os.environ["PUPPETEER_TESTS"] = "1"

# The locale can have impact how Firefox does locale-aware sorting,
# which we do verify in some tests.
os.environ["LC_ALL"] = "C.UTF-8"

os.environ.pop("http_proxy", "")
os.environ.pop("https_proxy", "")

usage = """test-js-with-puppeteer [options]
    test-js-with-puppeteer # Run all test files
    test-js-with-puppeteer navigation.test.ts # Run a single test file
    test-js-with-puppeteer navi # Run a single test file navigation.test.ts
    test-js-with-puppeteer login.test.ts compose.test.ts # Run a few test files
    test-js-with-puppeteer login compose # Run a few test files, login.test.ts and compose.test.ts here"""

sys.path.insert(0, ZULIP_PATH)

# check for the venv
from tools.lib import sanity_check

sanity_check.check_venv(__file__)

from collections.abc import Iterable

from tools.lib.test_script import (
    add_provision_check_override_param,
    assert_provisioning_status_ok,
    find_js_test_files,
    prepare_puppeteer_run,
)
from tools.lib.test_server import test_server_running

parser = argparse.ArgumentParser(usage)

parser.add_argument("--interactive", action="store_true", help="Run tests interactively")
add_provision_check_override_param(parser)
parser.add_argument("--firefox", action="store_true", help="Run tests with firefox.")
parser.add_argument("--loop", nargs="?", type=int, default=1)
parser.add_argument(
    "tests", nargs=argparse.REMAINDER, help="Specific tests to run; by default, runs all tests"
)

options = parser.parse_args()


def run_single_test(test_file: str, test_number: int, total_tests: int) -> int:
    cmd = ["node", test_file]

    test_name = os.path.basename(test_file)
    cmd_str = shlex.join(cmd)
    print(
        f"\n\n===================== ({test_number}/{total_tests}) {test_name} =====================\nRunning {cmd_str}\n\n",
        flush=True,
    )

    ret = subprocess.call(cmd)

    # Resetting test environment.
    reset_zulip_test_database()

    # We are calling to /flush_caches to remove all the server-side caches.
    response = requests.post("http://zulip.zulipdev.com:9981/flush_caches")
    assert response.status_code == 200

    return ret


def run_tests(files: Iterable[str], external_host: str, loop: int = 1) -> None:
    test_dir = os.path.join(ZULIP_PATH, "web/e2e-tests")
    test_files = find_js_test_files(test_dir, files)
    total_tests = len(test_files)

    def run_tests(test_number: int = 0) -> tuple[int, int]:
        current_test_num = test_number
        for test_file in test_files[test_number:]:
            return_code = run_single_test(test_file, current_test_num + 1, total_tests)
            if return_code != 0:
                return return_code, current_test_num
            current_test_num += 1
        return 0, -1

    with test_server_running(options.skip_provision_check, external_host):
        # Important: do this next call inside the `with` block, when Django
        #            will be pointing at the test database.
        subprocess.check_call("tools/setup/generate-test-credentials")
        if options.interactive:
            response = input('Press Enter to run tests, "q" to quit: ')
            ret = 1
            failed_test_num = 0
            while response != "q":
                ret, failed_test_num = run_tests(failed_test_num)
                if ret == 0:
                    failed_test_num = 0
                    response = input('Tests succeeded. Press Enter to re-run tests, "q" to quit: ')
                else:
                    response = input('Tests failed. Press Enter to re-run tests, "q" to quit: ')
        else:
            ret = 1
            for loop_num in range(1, loop + 1):
                print(f"\n\nRunning tests in loop ({loop_num}/{loop})\n")
                ret, current_test_num = run_tests()
                if ret == 0:
                    print(f"{OKGREEN}All tests passed!{ENDC}")
                else:
                    break

    if ret != 0:
        failed_test_file_name = os.path.basename(test_files[current_test_num])
        print(
            f"""
{FAIL}The Puppeteer frontend tests failed! The failing test was:
    ./tools/test-js-with-puppeteer {"--firefox " if options.firefox else ""}{failed_test_file_name}{ENDC}
For help debugging, read:
  https://zulip.readthedocs.io/en/latest/testing/testing-with-puppeteer.html
or report and ask for help in chat.zulip.org""",
            file=sys.stderr,
        )
        if os.environ.get("GITHUB_ACTIONS"):
            print(file=sys.stderr)
            print(
                """
Screenshots generated on failure are extremely helpful for understanding
puppeteer test failures, which are uploaded as artifacts. Use the
artifact download URL available in the "Store Puppeteer artifacts" step
below to download and view the generated screenshots.
            """,
                file=sys.stderr,
            )
            print(file=sys.stderr)
        else:
            print(
                "It's also worthy to see screenshots generated on failure stored under var/puppeteer/*.png"
            )
        sys.exit(ret)


external_host = "zulipdev.com:9981"
assert_provisioning_status_ok(options.skip_provision_check)
prepare_puppeteer_run(is_firefox=options.firefox)
run_tests(options.tests, external_host, options.loop)
sys.exit(0)
```

--------------------------------------------------------------------------------

---[FILE: test-migrations]---
Location: zulip-main/tools/test-migrations

```text
#!/usr/bin/env bash
set -e
echo 'Testing whether migrations are consistent with models'

# Check if any migration looks to have a meaningless 'auto' name,
# other than the existing handful from 2016 and 2017.
new_auto_named_migrations=$(./manage.py showmigrations \
    | grep -E ' [0-9]{4}_auto_' \
    | grep -Eve ' [0-9]{4}_auto_201[67]' \
        -e ' 0052_auto_fix_realmalias_realm_nullable' \
        -e ' 0003_auto_20150817_1733' \
        -e ' 0002_auto_20150110_0810' \
        -e ' 0002_auto_20190420_0723' \
        -e ' 0009_auto_20191118_0520' \
        -e ' 0007_auto_20201201_1019' \
    | sed 's/\[[x ]\] /  /' \
    || true)
if [ "$new_auto_named_migrations" != "" ]; then
    echo "ERROR: New migrations with unclear automatically generated names."
    echo "Please rename these migrations to have readable names:"
    echo
    echo "$new_auto_named_migrations"
    echo
    echo 'See https://zulip.readthedocs.io/en/latest/subsystems/schema-migrations.html for advice.'
    echo
    exit 1
fi

if ! ./manage.py makemigrations --check --dry-run; then
    echo
    # shellcheck disable=SC2016
    echo 'ERROR: Migrations are not consistent with models!  Fix with `./tools/renumber-migrations`.'
    echo 'See https://zulip.readthedocs.io/en/latest/subsystems/schema-migrations.html for details.'
    echo
    exit 1
fi

echo "Success!  Migrations are consistent with models."
```

--------------------------------------------------------------------------------

---[FILE: test-queue-worker-reload]---
Location: zulip-main/tools/test-queue-worker-reload

```text
#!/usr/bin/env python3
import os
import signal
import subprocess
import sys
import time
import types

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

# check for the venv
from tools.lib import sanity_check

sanity_check.check_venv(__file__)

# TODO: Convert this to use scripts/lib/queue_workers.py
TOOLS_DIR = os.path.dirname(os.path.abspath(__file__))
successful_worker_launch = "[process_queue] 15 queue worker threads were launched\n"


def check_worker_launch(run_dev: "subprocess.Popen[str]") -> bool:
    failed = False
    i = 0

    def on_timer(signum: int, frame: types.FrameType | None) -> None:
        nonlocal failed, i
        sys.stdout.write(".")
        sys.stdout.flush()
        i += 1
        if i == 200:
            failed = True
            run_dev.send_signal(signal.SIGINT)
            signal.setitimer(signal.ITIMER_REAL, 0, 0)

    log_output = []
    print("Polling run-dev", end="")
    # Attempt to poll the log file for 60 sec. to see if all worker threads are launched.
    old_handler = signal.signal(signal.SIGALRM, on_timer)
    signal.setitimer(signal.ITIMER_REAL, 0.3, 0.3)
    assert run_dev.stdout is not None
    for line in run_dev.stdout:
        log_output.append(line)
        if line.endswith(successful_worker_launch):
            break
    else:
        failed = True
    signal.setitimer(signal.ITIMER_REAL, 0, 0)
    signal.signal(signal.SIGALRM, old_handler)
    sys.stdout.write("\n")

    if not failed:
        print("Worker threads launched successfully")
    else:
        print("Error in server startup. Dumping logs")
        print("".join(log_output))

    return failed


if __name__ == "__main__":
    print("\nStarting development server")
    args = [f"{TOOLS_DIR}/run-dev"]
    run_dev = subprocess.Popen(
        args,
        bufsize=1,  # line buffered
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )
    failed = check_worker_launch(run_dev)

    if failed:
        run_dev.send_signal(signal.SIGINT)
        run_dev.wait()
        sys.exit(1)

    # In dev. environment, queues are run through Django's autoreload code. The
    # autoreload code of Django works by looping over the files associated with
    # all the loaded modules. This loop is run after every 1 second. If the
    # file is found for the first time by the loop, it is assumed that the
    # file is new and is not modified between the time it is loaded and is
    # checked by the loop. This assumption is the source of a race condition.

    # We can either implement a more sensitive version of the loop or we can
    # just allow enough time to the Django loop to touch every file at least
    # once.
    time.sleep(1.3)

    print("Attempting to modify a file")
    os.utime("zerver/models/__init__.py")
    failed = check_worker_launch(run_dev)

    run_dev.send_signal(signal.SIGINT)
    run_dev.wait()
    if failed:
        sys.exit(1)
```

--------------------------------------------------------------------------------

---[FILE: test-run-dev]---
Location: zulip-main/tools/test-run-dev

```text
#!/usr/bin/env python3
import os
import signal
import subprocess
import sys
import tempfile
import time

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from tools.lib import sanity_check

sanity_check.check_venv(__file__)

TOOLS_DIR = os.path.dirname(os.path.abspath(__file__))


def start_server(logfile_name: str) -> tuple[bool, str]:
    failure = True
    key = "Quit the server with CONTROL-C."
    datalog = []
    with open(logfile_name, "rb", buffering=0) as logfile:
        for i in range(200):
            time.sleep(0.5)
            print(f"{i}. Polling run-dev...")
            new_data = logfile.read().decode()
            if new_data:
                datalog.append(new_data)

            if key in "".join(datalog):
                failure = False
                break

    return failure, "".join(datalog)


if __name__ == "__main__":
    print("Testing development server start!")

    with tempfile.NamedTemporaryFile(buffering=0) as logfile:
        run_dev = subprocess.Popen(
            [os.path.join(TOOLS_DIR, "run-dev")], stdout=logfile, stderr=subprocess.STDOUT
        )
        failure, log = start_server(logfile.name)

    run_dev.send_signal(signal.SIGINT)
    run_dev.wait()

    if "Traceback" in log:
        failure = True

    if failure:
        print("Development server is not working properly:")
        print(log)
        sys.exit(1)
    else:
        print("Development server is working properly.")
        sys.exit(0)
```

--------------------------------------------------------------------------------

---[FILE: test-tools]---
Location: zulip-main/tools/test-tools

```text
#!/usr/bin/env python3
import argparse
import os
import sys
import unittest

tools_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(tools_dir, ".."))
tools_test_dir = os.path.join(tools_dir, "tests")

sys.path.insert(0, root_dir)

# check for the venv
from tools.lib import sanity_check

sanity_check.check_venv(__file__)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--coverage", action="store_true", help="compute test coverage")
    args = parser.parse_args()

    loader = unittest.TestLoader()

    if args.coverage:
        import coverage

        cov = coverage.Coverage(branch=True, omit=[os.path.join(tools_test_dir, "*")])
        cov.start()

    suite = loader.discover(start_dir=tools_test_dir, top_level_dir=root_dir)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    if result.errors or result.failures:
        raise Exception("Test failed!")

    if args.coverage:
        cov.stop()
        cov.save()
        cov.html_report(directory="var/tools_coverage")
        print("HTML report saved to var/tools_coverage")

    print("SUCCESS")
```

--------------------------------------------------------------------------------

````
