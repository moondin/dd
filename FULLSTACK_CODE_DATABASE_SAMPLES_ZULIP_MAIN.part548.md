---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 548
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 548 of 1290)

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

---[FILE: tail-ses]---
Location: zulip-main/tools/tail-ses

```text
#!/usr/bin/env python3
import os
import sys
from email.headerregistry import Address
from email.utils import parseaddr

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from scripts.lib.setup_path import setup_path

setup_path()

os.environ["DJANGO_SETTINGS_MODULE"] = "zproject.settings"
import argparse
import secrets
from collections.abc import Iterator
from contextlib import contextmanager
from typing import TypedDict

import boto3.session
import orjson
from django.conf import settings
from mypy_boto3_ses import SESClient
from mypy_boto3_sns import SNSClient
from mypy_boto3_sqs import SQSClient
from mypy_boto3_sqs.type_defs import DeleteMessageBatchRequestEntryTypeDef


class IdentityArgsDict(TypedDict, total=False):
    default: str
    required: bool


def main() -> None:
    session = boto3.session.Session(region_name=settings.S3_REGION)

    # Strip off the realname, if present, and extract just the domain name
    _, from_address = parseaddr(settings.NOREPLY_EMAIL_ADDRESS)
    from_host = Address(addr_spec=from_address).domain

    ses: SESClient = session.client("ses")
    possible_identities = []
    identity_paginator = ses.get_paginator("list_identities")
    for identity_resp in identity_paginator.paginate():
        possible_identities += identity_resp["Identities"]

    identity_args: IdentityArgsDict = {}
    if from_host in possible_identities:
        identity_args["default"] = from_host
    elif from_address in possible_identities:
        identity_args["default"] = from_address
    else:
        identity_args["required"] = True

    parser = argparse.ArgumentParser(description="Tail SES delivery or bounces")
    parser.add_argument(
        "--identity",
        "-i",
        choices=possible_identities,
        help="Sending identity in SES",
        **identity_args,
    )
    topic_group = parser.add_mutually_exclusive_group(required=True)
    topic_group.add_argument("--bounces", "-b", action="store_true")
    topic_group.add_argument("--deliveries", "-d", action="store_true")
    topic_group.add_argument("--complaints", "-c", action="store_true")
    args = parser.parse_args()

    sns_topic_arn = get_ses_arn(session, args)
    with (
        our_sqs_queue(session, sns_topic_arn) as (queue_arn, queue_url),
        our_sns_subscription(session, sns_topic_arn, queue_arn),
    ):
        print_messages(session, queue_url)


def get_ses_arn(session: boto3.session.Session, args: argparse.Namespace) -> str:
    ses: SESClient = session.client("ses")

    notification_settings = ses.get_identity_notification_attributes(Identities=[args.identity])
    settings = notification_settings["NotificationAttributes"][args.identity]

    if args.bounces:
        return settings["BounceTopic"]
    elif args.complaints:
        return settings["ComplaintTopic"]
    elif args.deliveries:
        return settings["DeliveryTopic"]
    raise AssertionError  # Unreachable


@contextmanager
def our_sqs_queue(session: boto3.session.Session, ses_topic_arn: str) -> Iterator[tuple[str, str]]:
    (_, _, _, region, account_id, _topic_name) = ses_topic_arn.split(":")

    sqs: SQSClient = session.client("sqs")
    queue_name = "tail-ses-" + secrets.token_hex(10)
    try:
        resp = sqs.create_queue(
            QueueName=queue_name,
            Attributes={
                "Policy": orjson.dumps(
                    {
                        "Version": "2012-10-17",
                        "Id": secrets.token_hex(10),
                        "Statement": [
                            {
                                "Sid": "Sid" + secrets.token_hex(10),
                                "Effect": "Allow",
                                "Principal": {"AWS": "*"},
                                "Action": "SQS:SendMessage",
                                "Resource": f"arn:aws:sqs:{region}:{account_id}:{queue_name}",
                                "Condition": {"ArnEquals": {"aws:SourceArn": ses_topic_arn}},
                            }
                        ],
                    }
                ).decode("UTF-8")
            },
        )
        queue_url = resp["QueueUrl"]
        yield f"arn:aws:sqs:{region}:{account_id}:{queue_name}", queue_url
    finally:
        if queue_url is not None:
            print("Deleting temporary queue...", file=sys.stderr)
            sqs.delete_queue(QueueUrl=queue_url)


@contextmanager
def our_sns_subscription(
    session: boto3.session.Session, ses_topic_arn: str, queue_arn: str
) -> Iterator[str]:
    sns: SNSClient = session.client("sns")
    try:
        resp = sns.subscribe(
            TopicArn=ses_topic_arn,
            Protocol="sqs",
            Endpoint=queue_arn,
            Attributes={"RawMessageDelivery": "false"},
            ReturnSubscriptionArn=True,
        )
        subscription_arn = resp["SubscriptionArn"]
        yield subscription_arn
    finally:
        if subscription_arn is not None:
            print("Deleting temporary SNS subscription...", file=sys.stderr)
            sns.unsubscribe(SubscriptionArn=subscription_arn)


def print_messages(session: boto3.session.Session, queue_url: str) -> None:
    sqs: SQSClient = session.client("sqs")
    try:
        while True:
            resp = sqs.receive_message(
                QueueUrl=queue_url,
                MaxNumberOfMessages=10,
                WaitTimeSeconds=5,
                MessageAttributeNames=["All"],
            )
            messages = resp.get("Messages", [])
            delete_list: list[DeleteMessageBatchRequestEntryTypeDef] = []
            for m in messages:
                body = orjson.loads(m["Body"])
                body_message = orjson.loads(body["Message"])
                print(
                    body["Timestamp"]
                    + " "
                    + orjson.dumps(body_message, option=orjson.OPT_INDENT_2).decode("utf-8")
                )
                delete_list.append({"Id": m["MessageId"], "ReceiptHandle": m["ReceiptHandle"]})
            if delete_list:
                sqs.delete_message_batch(QueueUrl=queue_url, Entries=delete_list)
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: test-all]---
Location: zulip-main/tools/test-all

```text
#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"/..

# read the options
TEMP=$(getopt -o "" --long skip-provision-check -- "$@")
eval set -- "$TEMP"

# extract options.
forcearg=()
while true; do
    case "$1" in
        --skip-provision-check)
            forcearg=(--skip-provision-check)
            shift
            ;;
        --)
            shift
            break
            ;;
    esac
done

function run() {
    echo '----'
    printf 'Running'
    printf ' %q' "$@"
    printf '\n'
    if ! "$@"; then
        printf '\n\e[31;1mFAILED\e[0m'
        printf ' %q' "$@"
        printf '\n'
        exit 1
    else
        echo
    fi
}

printf '\n\e[33;1m'
echo "Because test-all is very slow, we recommend running individual (sub)suites "
echo "and relying on CI to run the complete test suite for a fast edit-test cycle.  See"
echo "  https://zulip.readthedocs.io/en/latest/testing/testing.html#running-tests"
echo "for details on how to run just the relevant subsets of our tests."
printf '\e[0m'
echo

# prep
run ./tools/check-provision "${forcearg[@]}"

# ci/backend
run ./tools/lint --groups=backend "${forcearg[@]}"
run ./tools/test-tools
run ./tools/test-backend --include-webhooks --ban-console-output "${forcearg[@]}"
run ./tools/test-migrations
# Not running SVG optimizing since it's low-churn
# run ./tools/setup/optimize-svg
# Not running missing bot avatar detection since it's low churn
# ./tools/setup/generate_integration_bots_avatars.py --check-missing
# Not running documentation tests since it takes 20s and only tests documentation
# run ./tools/test-documentation --skip-external-links
run ./tools/test-help-documentation --skip-external-links "${forcearg[@]}"
run ./tools/test-api
run uv lock --check
# Not running run-dev tests locally; we never have
# run ./tools/test-run-dev
# Not running queue worker reload tests since it's low-churn code
# run ./tools/test-queue-worker-reload

# ci/frontend
run ./tools/lint --groups=frontend "${forcearg[@]}"
run ./tools/test-js-with-node
run ./tools/check-schemas
run ./manage.py makemessages --locale en
run env PYTHONWARNINGS=ignore ./tools/check-capitalization --no-generate
run env PYTHONWARNINGS=ignore ./tools/check-frontend-i18n --no-generate
run pnpm run --filter=starlight_help check
run ./tools/test-js-with-puppeteer "${forcearg[@]}"

printf '\n\e[32mAll OK!\e[0m\n'
```

--------------------------------------------------------------------------------

---[FILE: test-api]---
Location: zulip-main/tools/test-api

```text
#!/usr/bin/env python3
import argparse
import os
import sys

os.environ["RUNNING_OPENAPI_CURL_TEST"] = "1"

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ZULIP_PATH)
os.chdir(ZULIP_PATH)

# check for the venv
from tools.lib import sanity_check

sanity_check.check_venv(__file__)

from zulip import Client

from tools.lib.test_script import add_provision_check_override_param, assert_provisioning_status_ok
from tools.lib.test_server import test_server_running

usage = """test-api [options]"""
parser = argparse.ArgumentParser(usage)
add_provision_check_override_param(parser)
options = parser.parse_args()

assert_provisioning_status_ok(options.skip_provision_check)

with test_server_running(
    skip_provision_check=options.skip_provision_check, external_host="zulipdev.com:9981"
):
    # zerver imports should happen after `django.setup()` is run
    # by the test_server_running decorator.
    from zerver.actions.create_user import do_create_user, do_reactivate_user
    from zerver.actions.realm_settings import (
        do_change_realm_permission_group_setting,
        do_deactivate_realm,
        do_reactivate_realm,
    )
    from zerver.actions.user_settings import do_change_user_setting
    from zerver.actions.users import change_user_is_active
    from zerver.lib.test_helpers import reset_email_visibility_to_everyone_in_zulip_realm
    from zerver.models.groups import NamedUserGroup, SystemGroups
    from zerver.models.realms import get_realm
    from zerver.models.users import get_user
    from zerver.openapi.javascript_examples import test_js_bindings
    from zerver.openapi.python_examples import (
        test_invalid_api_key,
        test_realm_deactivated,
        test_the_api,
        test_user_account_deactivated,
    )
    from zerver.openapi.test_curl_examples import test_generated_curl_examples_for_success

    print("Running API tests...")

    reset_email_visibility_to_everyone_in_zulip_realm()

    # Prepare the admin client
    email = "iago@zulip.com"  # Iago is an admin
    realm = get_realm("zulip")
    iago = get_user(email, realm)
    user = iago

    # Iago needs permission to manage all user groups.
    admins_group = NamedUserGroup.objects.get(
        name=SystemGroups.ADMINISTRATORS, realm_for_sharding=realm, is_system_group=True
    )
    do_change_realm_permission_group_setting(
        realm, "can_manage_all_groups", admins_group, acting_user=None
    )

    # Required to test can_create_users and can_change_user_emails endpoints.
    user.can_create_users = True
    user.can_change_user_emails = True
    user.save(update_fields=["can_create_users", "can_change_user_emails"])

    api_key = user.api_key
    site = "http://zulip.zulipdev.com:9981"
    client = Client(
        email=email,
        api_key=api_key,
        site=site,
    )

    # Prepare the owner client
    email = "desdemona@zulip.com"  # desdemona is an owner
    realm = get_realm("zulip")
    user = get_user(email, realm)

    do_change_user_setting(user, "allow_private_data_export", True, acting_user=user)

    api_key = user.api_key
    site = "http://zulip.zulipdev.com:9981"
    owner_client = Client(
        email=email,
        api_key=api_key,
        site=site,
    )

    # Prepare the non-admin client
    email = "guest@zulip.com"  # guest is not an admin
    guest_user = do_create_user(
        "guest@zulip.com", "secret", get_realm("zulip"), "Mr. Guest", acting_user=None
    )
    api_key = guest_user.api_key
    nonadmin_client = Client(
        email=email,
        api_key=api_key,
        site=site,
    )

    test_the_api(client, nonadmin_client, owner_client)
    test_generated_curl_examples_for_success(client)
    test_js_bindings(client)

    # Test error payloads
    client = Client(
        email=email,
        api_key="X" * 32,
        site=site,
    )
    test_invalid_api_key(client)

    # Test account deactivated error
    # we deactivate user manually because do_deactivate_user removes user session
    change_user_is_active(guest_user, False)
    client = Client(
        email=email,
        api_key=api_key,
        site=site,
    )
    test_user_account_deactivated(client)
    # reactivate user to avoid any side-effects in other tests.
    do_reactivate_user(guest_user, acting_user=None)

    # Test realm deactivated error
    do_deactivate_realm(
        guest_user.realm, acting_user=None, deactivation_reason="owner_request", email_owners=False
    )

    client = Client(
        email=email,
        api_key=api_key,
        site=site,
    )
    test_realm_deactivated(client)
    do_reactivate_realm(guest_user.realm)


print("API tests passed!")
```

--------------------------------------------------------------------------------

---[FILE: test-backend]---
Location: zulip-main/tools/test-backend

```text
#!/usr/bin/env python3

import argparse
import contextlib
import glob
import os
import shlex
import subprocess
import sys
import tempfile
from collections.abc import Iterator
from typing import TYPE_CHECKING, cast
from unittest import mock

if TYPE_CHECKING:
    # This script does not have access to the zerver module during runtime.
    # We can only import this when type checking.
    from zerver.lib.test_runner import Runner

TOOLS_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(os.path.dirname(TOOLS_DIR))
sys.path.insert(0, os.path.dirname(TOOLS_DIR))

# check for the venv
from tools.lib import sanity_check

sanity_check.check_venv(__file__)

import django
import orjson
import responses
from django.conf import settings
from django.test.utils import get_runner

source_files = [
    "analytics/**/*.py",
    "confirmation/**/*.py",
    "corporate/**/*.py",
    "pgroonga/**/*.py",
    "zerver/**/*.py",
    "zilencer/**/*.py",
    "zproject/**/*.py",
]

not_yet_fully_covered = [
    "*/migrations/*.py",
    "*/management/commands/*.py",
    # Analytics fixtures library is used to generate test fixtures;
    # isn't properly accounted for in test coverage analysis since it
    # runs before tests.
    "analytics/lib/fixtures.py",
    # We have 100% coverage on the new stuff; need to refactor old stuff.
    "analytics/views/stats.py",
    # TODO: This is a work in progress and therefore without
    # tests yet.
    "corporate/views/installation_activity.py",
    "corporate/views/plan_activity.py",
    "corporate/views/realm_activity.py",
    "corporate/views/remote_billing_page.py",
    "corporate/views/audit_logs.py",
    "corporate/views/support.py",
    "corporate/lib/activity.py",
    "corporate/lib/remote_billing_util.py",
    # Major lib files should have 100% coverage
    "zerver/lib/addressee.py",
    "zerver/lib/markdown/__init__.py",
    "zerver/lib/cache.py",
    "zerver/lib/cache_helpers.py",
    "zerver/lib/i18n.py",
    "zerver/lib/send_email.py",
    "zerver/lib/url_preview/preview.py",
    # Markdown sub-libs should have full coverage too; a lot are really close
    "zerver/lib/markdown/api_arguments_table_generator.py",
    "zerver/lib/markdown/fenced_code.py",
    "zerver/lib/markdown/nested_code_blocks.py",
    # Workers should get full coverage; many have it already
    "zerver/worker/deferred_work.py",
    "zerver/worker/missedmessage_emails.py",
    # Worker-associated files; lower-priority to get testing on
    "zerver/worker/base.py",
    "zerver/worker/queue_processors.py",
    "zerver/worker/test.py",
    # Other lib files that ideally would coverage, but aren't sorted
    "zerver/middleware.py",
    "zerver/lib/bot_lib.py",
    "zerver/lib/camo.py",
    "zerver/lib/debug.py",
    "zerver/lib/export.py",
    "zerver/lib/fix_unreads.py",
    "zerver/lib/import_realm.py",
    "zerver/lib/logging_util.py",
    "zerver/lib/profile.py",
    "zerver/lib/queue.py",
    "zerver/lib/sqlalchemy_utils.py",
    "zerver/lib/storage.py",
    "zerver/lib/templates.py",
    # Low priority for coverage
    "zerver/lib/generate_test_data.py",
    "zerver/lib/server_initialization.py",
    "zerver/lib/test_fixtures.py",
    "zerver/lib/test_runner.py",
    "zerver/lib/test_console_output.py",
    "zerver/lib/zstd_level9.py",
    "zerver/openapi/curl_param_value_generators.py",
    "zerver/openapi/javascript_examples.py",
    "zerver/openapi/python_examples.py",
    "zerver/openapi/test_curl_examples.py",
    # Helper for tooling; doesn't need coverage
    "zerver/openapi/merge_api_changelogs.py",
    # Tornado should ideally have full coverage, but we're not there.
    "zerver/tornado/descriptors.py",
    "zerver/tornado/django_api.py",
    "zerver/tornado/event_queue.py",
    "zerver/tornado/exceptions.py",
    "zerver/tornado/handlers.py",
    "zerver/tornado/ioloop_logging.py",
    "zerver/tornado/sharding.py",
    "zerver/tornado/views.py",
    # Data import files; relatively low priority
    "zerver/data_import/slack.py",
    "zerver/data_import/import_util.py",
    # Webhook integrations with incomplete coverage
    "zerver/webhooks/greenhouse/view.py",
    "zerver/webhooks/jira/view.py",
    "zerver/webhooks/teamcity/view.py",
    "zerver/webhooks/travis/view.py",
    "zerver/webhooks/zapier/view.py",
    # This is hard to get test coverage for, and low value to do so
    "zerver/views/sentry.py",
    # Cannot have coverage, as tests run in a transaction
    "zerver/lib/safe_session_cached_db.py",
    "zerver/lib/singleton_bmemcached.py",
    # Only covered when we run migrations tests, which are not
    # guaranteed to exist or be runnable
    "zerver/lib/migrate.py",
    # Branches in Django settings files are hard to test
    "zproject/computed_settings.py",
    # Used to override settings
    "zproject/custom_dev_settings.py",
    "zproject/dev_settings.py",
    "zproject/test_extra_settings.py",
    # Better tested in a full deployment
    "zproject/sentry.py",
    "zproject/wsgi.py",
]

enforce_fully_covered = sorted(
    {path for target in source_files for path in glob.glob(target, recursive=True)}
    - {path for target in not_yet_fully_covered for path in glob.glob(target, recursive=True)}
)

FAILED_TEST_PATH = "var/last_test_failure.json"


def get_failed_tests() -> list[str]:
    try:
        with open(FAILED_TEST_PATH, "rb") as f:
            return orjson.loads(f.read())
    except OSError:
        print("var/last_test_failure.json doesn't exist; running all tests.")
        return []


@contextlib.contextmanager
def block_internet() -> Iterator[None]:
    # Monkey-patching - responses library raises requests.ConnectionError when access to an unregistered URL
    # is attempted. We want to replace that with our own exception, so that it propagates all the way:
    with (
        mock.patch.object(responses, "ConnectionError", new=ZulipInternetBlockedError),
        # We'll run all tests in this context manager. It'll cause an error to be raised (see above comment),
        # if any code attempts to access the internet.
        responses.RequestsMock(),
    ):
        yield


class ZulipInternetBlockedError(Exception):
    def __init__(self, original_msg: str) -> None:
        zulip_msg = (
            "Outgoing network requests are not allowed in the Zulip tests. "
            "More details and advice are available here:"
            "https://zulip.readthedocs.io/en/latest/testing/testing.html#internet-access-inside-test-suites"
        )
        msg = f"{zulip_msg}\nResponses library error message: {original_msg}"
        super().__init__(msg)


def main() -> None:
    default_parallel = os.cpu_count()

    # Remove proxy settings for running backend tests
    os.environ.pop("http_proxy", "")
    os.environ.pop("https_proxy", "")

    from tools.lib.test_script import (
        add_provision_check_override_param,
        assert_provisioning_status_ok,
    )
    from zerver.lib.test_fixtures import (
        remove_test_run_directories,
        update_test_databases_if_required,
    )

    os.environ["DJANGO_SETTINGS_MODULE"] = "zproject.test_settings"
    # "-u" uses unbuffered IO, which is important when wrapping it in subprocess
    os.environ["PYTHONUNBUFFERED"] = "y"

    usage = """test-backend [options]
    test-backend # Runs all backend tests
    test-backend zerver.tests.test_markdown # run all tests in a test module
    test-backend zerver/tests/test_markdown.py # run all tests in a test module
    test-backend test_markdown # run all tests in a test module
    test-backend zerver.tests.test_markdown.MarkdownEmbedsTest # run all tests in a test class
    test-backend MarkdownEmbedsTest # run all tests in a test class
    test-backend zerver.tests.test_markdown.MarkdownEmbedsTest.test_inline_youtube # run a single test
    test-backend MarkdownEmbedsTest.test_inline_youtube # run a single test"""

    parser = argparse.ArgumentParser(
        description=usage, formatter_class=argparse.RawTextHelpFormatter
    )

    parser.add_argument(
        "-x",
        "--stop",
        action="store_true",
        dest="fatal_errors",
        help="Stop running tests after the first failure.",
    )
    parser.add_argument("--coverage", action="store_true", help="Compute test coverage.")
    parser.add_argument(
        "--verbose-coverage", action="store_true", help="Enable verbose print of coverage report."
    )
    parser.add_argument(
        "--xml-report", action="store_true", help="Enable (slow) XML coverage report."
    )
    parser.add_argument(
        "--no-html-report", action="store_true", help="Disable (slow) HTML coverage report."
    )
    parser.add_argument(
        "--no-cov-cleanup", action="store_true", help="Do not clean generated coverage files."
    )

    parser.add_argument(
        "--parallel",
        dest="processes",
        type=int,
        default=None,
        help="Specify the number of processes to run the "
        "tests in. Default is the number of logical CPUs",
    )
    parser.add_argument("--profile", action="store_true", help="Profile test runtime.")
    add_provision_check_override_param(parser)
    parser.add_argument(
        "--no-shallow",
        action="store_true",
        help="Don't allow shallow testing of templates (deprecated)",
    )
    parser.add_argument("--verbose", action="store_true", help="Show detailed output")
    parser.add_argument("--reverse", action="store_true", help="Run tests in reverse order.")
    parser.add_argument(
        "--rerun",
        action="store_true",
        help="Run the tests which failed the last time test-backend was run.  Implies not --stop.",
    )
    parser.add_argument(
        "--include-webhooks",
        action="store_true",
        help="Include webhook tests.  By default, they are skipped for performance.",
    )
    parser.add_argument(
        "--include-transaction-tests",
        action="store_true",
        help="Include transaction tests.  By default, they are skipped for performance.",
    )
    parser.add_argument(
        "--generate-stripe-fixtures",
        action="store_true",
        help="Generate Stripe test fixtures by making requests to Stripe test network",
    )
    parser.add_argument(
        "--generate-litellm-fixtures",
        action="store_true",
        help="Generate litellm test fixtures using credentials in zproject/dev-secrets.conf",
    )
    parser.add_argument("args", nargs="*")
    parser.add_argument(
        "--ban-console-output",
        action="store_true",
        help="Require stdout and stderr to be clean of unexpected output.",
    )

    options = parser.parse_args()
    if options.ban_console_output:
        os.environ["BAN_CONSOLE_OUTPUT"] = "1"

    args = options.args
    include_webhooks = options.coverage or options.include_webhooks
    include_transaction_tests = options.coverage or options.include_transaction_tests

    if options.processes is not None and options.processes < 1:
        raise argparse.ArgumentTypeError("option processes: Only positive integers are allowed.")

    test_dirs = ["zerver/tests/", "corporate/tests", "analytics/tests"]

    # While running --rerun, we read var/last_test_failure.json to get
    # the list of tests that failed on the last run, and then pretend
    # those tests were passed explicitly.  --rerun implies
    # !fatal_errors, so that we don't end up removing tests from
    # the list that weren't run.
    if options.rerun:
        default_parallel = 1
        options.fatal_errors = False
        failed_tests = get_failed_tests()
        if failed_tests:
            args = failed_tests
    if len(args) > 0:
        # If we passed a specific set of tests, run in serial mode.
        default_parallel = 1

        # to transform forward slashes '/' present in the argument into dots '.'
        for i, suite in enumerate(args):
            args[i] = suite.rstrip("/").replace("/", ".")

        def rewrite_arguments(search_key: str) -> None:
            for test_dir in test_dirs:
                for root, dirs, files_names in os.walk(test_dir, topdown=False):
                    for file_name in files_names:
                        # Check for files starting with alphanumeric characters and ending with '.py'
                        # Ignore backup files if any
                        if not file_name[0].isalnum() or not file_name.endswith(".py"):
                            continue
                        filepath = os.path.join(root, file_name)
                        with open(filepath) as f:
                            for line in f:
                                if search_key not in line:
                                    continue
                                new_suite = filepath.replace(".py", ".") + suite
                                args[i] = new_suite
                                return

        for suite in args:
            if suite[0].isupper() and "test_" in suite:
                classname = suite.rsplit(".", 1)[0]
                rewrite_arguments(classname)
            elif suite[0].isupper():
                rewrite_arguments(f"class {suite}(")

        for i, suite in enumerate(args):
            if suite.startswith("test"):
                for test_dir in test_dirs:
                    for root, dirs, files_names in os.walk(test_dir):
                        for file_name in files_names:
                            if file_name in (suite, f"{suite}.py"):
                                new_suite = os.path.join(root, file_name)
                                args[i] = new_suite
                                break

        for i, suite in enumerate(args):
            args[i] = suite.replace(".py", "")

        # to transform forward slashes '/' introduced by the zerver_test_dir into dots '.'
        # taking care of any forward slashes that might be present
        for i, suite in enumerate(args):
            args[i] = suite.replace("/", ".")

    full_suite = len(args) == 0

    if full_suite:
        suites = [
            "zerver.tests",
            "analytics.tests",
            "corporate.tests",
        ]
    else:
        suites = args

    if full_suite and include_webhooks:
        suites.append("zerver.webhooks")

    if full_suite and include_transaction_tests:
        suites.append("zerver.transaction_tests")

    if options.generate_stripe_fixtures:
        if full_suite:
            suites = [
                "corporate.tests.test_stripe",
            ]
            full_suite = False
        print("-- Forcing serial mode for generating stripe fixtures.", flush=True)
        default_parallel = 1
        os.environ["GENERATE_STRIPE_FIXTURES"] = "1"

    if options.generate_litellm_fixtures:
        if full_suite:
            suites = [
                "zerver.tests.test_message_summary",
            ]
            full_suite = False
        print("-- Forcing serial mode for generating litellm fixtures.", flush=True)
        default_parallel = 1
        os.environ["GENERATE_LITELLM_FIXTURES"] = "1"

    assert_provisioning_status_ok(options.skip_provision_check)

    if options.coverage:
        import coverage

        cov = coverage.Coverage(
            data_suffix="", config_file="tools/coveragerc", concurrency="multiprocessing"
        )
        # Do not clean .coverage file in continuous integration job so that coverage data can be uploaded.
        if not options.no_cov_cleanup:
            import atexit

            atexit.register(cov.erase)  # Ensure the data file gets cleaned up at the end.
        cov.start()
    if options.profile:
        import cProfile

        prof = cProfile.Profile()
        prof.enable()

    # This is kind of hacky, but it's the most reliable way
    # to make sure instrumentation decorators know the
    # setting when they run.
    os.environ["TEST_INSTRUMENT_URL_COVERAGE"] = "TRUE"

    # setup() needs to be called after coverage is started to get proper coverage reports of model
    # files, since part of setup is importing the models for all applications in INSTALLED_APPS.
    django.setup()

    update_test_databases_if_required()

    subprocess.check_call(["tools/webpack", "--test"])

    # isinstance check cannot be used with types. This can potentially improved by supporting
    # dynamic resolution of the test runner type with the django-stubs mypy plugin.
    TestRunner = cast("type[Runner]", get_runner(settings))

    if options.processes:
        parallel = options.processes
    elif options.profile:
        parallel = 1
    else:
        parallel = default_parallel
    if parallel > 1:
        print(f"-- Running tests in parallel mode with {parallel} processes.", flush=True)
    else:
        print("-- Running tests in serial mode.", flush=True)

    with block_internet():
        test_runner = TestRunner(
            failfast=options.fatal_errors,
            verbosity=2,
            parallel=parallel,
            reverse=options.reverse,
            keepdb=True,
        )
        failures = test_runner.run_tests(
            suites,
            failed_tests_path=FAILED_TEST_PATH,
            full_suite=full_suite,
            include_webhooks=include_webhooks,
        )

    templates_not_rendered = test_runner.get_shallow_tested_templates()
    # We only check the templates if all the tests ran and passed
    if not failures and full_suite and templates_not_rendered:
        missed_count = len(templates_not_rendered)
        print(f"\nError: {missed_count} templates have no tests!")
        for template in templates_not_rendered:
            print(f"  {template}")
        print("See zerver/tests/test_templates.py for the exclude list.")
        failures = True

    if options.coverage:
        cov.stop()
        cov.save()
        cov.combine()
        cov.save()
        if options.verbose_coverage:
            print("Printing coverage data")
            cov.report(show_missing=False)
        if options.xml_report:
            print("Writing XML report")
            cov.xml_report(outfile="var/coverage.xml")
            print("XML report saved; see var/coverage.xml")

    if full_suite and not failures and options.coverage:
        # Assert that various files have full coverage
        for path in enforce_fully_covered:
            missing_lines = cov.analysis2(path)[3]
            if len(missing_lines) > 0:
                print(f"ERROR: {path} no longer has complete backend test coverage")
                print(f"  Lines missing coverage: {missing_lines}")
                print()
                failures = True
        if failures:
            print("It looks like your changes lost 100% test coverage in one or more files")
            print("Usually, the right fix for this is to add some tests.")
            print("But also check out the include/exclude lists in tools/test-backend.")
            print("If this line intentionally is not tested, you can use a # nocoverage comment.")
            print("To run this check locally, use `test-backend --coverage`.")
        ok = True
        for path in not_yet_fully_covered:
            try:
                missing_lines = cov.analysis2(path)[3]
                if not missing_lines:
                    print(
                        f"ERROR: {path} has complete backend test coverage but is still in not_yet_fully_covered."
                    )
                    ok = False
            except coverage.misc.NoSource:
                continue
        if ok:
            print("Coverage checks pass!")
        else:
            print()
            print(
                "There are one or more fully covered files that are still in not_yet_fully_covered."
            )
            print("Remove the file(s) from not_yet_fully_covered in `tools/test-backend`.")
            failures = True

    if options.coverage and not options.no_html_report:
        # We do this late, because it can take quite a while.
        print("Writing HTML report")
        cov.html_report(directory="var/coverage", show_contexts=True)
        print("HTML report saved; visit at http://127.0.0.1:9991/coverage/index.html")

    if options.profile:
        prof.disable()
        with tempfile.NamedTemporaryFile(prefix="profile.data.", delete=False) as stats_file:
            prof.dump_stats(stats_file.name)
            print(f"Profile data saved to {stats_file.name}")
            print(f"You can visualize it using e.g. `snakeviz {shlex.quote(stats_file.name)}`")
            print("Note: If you are using vagrant for development environment you will need to do:")
            print("1.) `vagrant ssh -- -L 8080:127.0.0.1:8080`")
            print(f"2.) `snakeviz -s {shlex.quote(stats_file.name)}`")

    # Ideally, we'd check for any leaked test databases here;
    # but that needs some hackery with database names.
    #
    # destroy_leaked_test_databases()

    removed = remove_test_run_directories()
    if removed:
        print(f"Removed {removed} stale test run directories!")

    # We'll have printed whether tests passed or failed above
    sys.exit(bool(failures))


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: test-documentation]---
Location: zulip-main/tools/test-documentation

```text
#!/usr/bin/env python3
import argparse
import os
import subprocess
import sys
from collections.abc import Sequence

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ZULIP_PATH)
sys.path.insert(0, ZULIP_PATH)

# check for the venv
from tools.lib import sanity_check

sanity_check.check_venv(__file__)


def color_message(color_code: str, message: str) -> None:
    print(f"\033[0;{color_code}m{message}\033[0m", file=sys.stderr)


parser = argparse.ArgumentParser()
parser.add_argument(
    "-L",
    "--loglevel",
    dest="loglevel",
    nargs=1,
    help="Log level (default: ERROR)",
)
parser.add_argument(
    "--skip-check-links",
    dest="skip_check_links",
    action="store_true",
    help="Skip checking of links.",
)
parser.add_argument(
    "--skip-external-links",
    dest="skip_external_link_check",
    # default = false
    action="store_true",
    help="Skip checking of external links.",
)
options = parser.parse_args()
# loglevel should be used as an extra command line option
# in the form of ["-L", "LOGLEVEL"]
# if loglevel is defined, insert "-L" ahead of loglevel
if options.loglevel:
    options.loglevel.insert(0, "-L")
# if loglevel is undefined, make loglevel an empty list
else:
    options.loglevel = []

os.chdir("docs")

# collapse_navigation is set to False in conf.py to improve sidebar navigation for users.
# However, we must change its value to True before we begin testing links.
# Otherwise, sphinx would generate a large number of links we don't need to test.
# The crawler would take a very long time to finish and GitHub Actions would fail as a result.
subprocess.check_call(
    ["make", "clean", "html", "O='-D html_theme_options.collapse_navigation=True'"]
)

err = 0


def check(args: Sequence[str]) -> None:
    global err
    if subprocess.call(args) == 0:
        color_message("92", "Passed!")
    else:
        color_message("91", "Failed!")
        err = 1


color_message("94", "Validating HTML...")
check(
    [
        "java",
        "-jar",
        "../node_modules/vnu-jar/build/dist/vnu.jar",
        "--filterfile",
        "../tools/documentation.vnufilter",
        "--skip-non-html",
        "_build/html",
    ]
)

if options.skip_check_links:
    color_message("94", "Skipped testing links in documentation.")
else:
    os.chdir("../tools/documentation_crawler")
    if options.skip_external_link_check:
        color_message("94", "Testing only internal links in documentation...")
        check(
            [
                "scrapy",
                "crawl_with_status",
                "documentation_crawler",
                "-a",
                "skip_external=set",
                *options.loglevel,
            ]
        )
        # calling crawl directly as parameter needs to be passed
    else:
        color_message("94", "Testing links in documentation...")
        check(["scrapy", "crawl_with_status", "documentation_crawler", *options.loglevel])


sys.exit(err)
```

--------------------------------------------------------------------------------

````
