---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 924
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 924 of 1290)

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

---[FILE: common.py]---
Location: zulip-main/zerver/lib/webhooks/common.py
Signals: Django, Pydantic

```python
import fnmatch
import hashlib
import hmac
import importlib
from collections.abc import Callable
from dataclasses import dataclass
from enum import Enum
from typing import Annotated, Any, TypeAlias
from urllib.parse import unquote

from django.conf import settings
from django.http import HttpRequest
from django.utils.encoding import force_bytes
from django.utils.translation import gettext as _
from pydantic import Json
from typing_extensions import override

from zerver.actions.message_send import (
    check_send_private_message,
    check_send_stream_message,
    check_send_stream_message_by_id,
    send_rate_limited_pm_notification_to_bot_owner,
)
from zerver.lib.exceptions import (
    AnomalousWebhookPayloadError,
    ErrorCode,
    JsonableError,
    StreamDoesNotExistError,
)
from zerver.lib.request import RequestNotes
from zerver.lib.send_email import FromAddress
from zerver.lib.typed_endpoint import ApiParamConfig, typed_endpoint
from zerver.lib.validator import check_bool, check_string
from zerver.models import UserProfile

MISSING_EVENT_HEADER_MESSAGE = """\
Hi there!  Your bot {bot_name} just sent an HTTP request to {request_path} that
is missing the HTTP {header_name} header.  Because this header is how
{integration_name} indicates the event type, this usually indicates a configuration
issue, where you either entered the URL for a different integration, or are running
an older version of the third-party service that doesn't provide that header.
Contact {support_email} if you need help debugging!
"""

INVALID_JSON_MESSAGE = """
Hi there! It looks like you tried to set up the Zulip {webhook_name} integration,
but didn't correctly configure the webhook to send data in the JSON format
that this integration expects!
"""

SETUP_MESSAGE_TEMPLATE = "{integration} webhook has been successfully configured"
SETUP_MESSAGE_USER_PART = " by {user_name}"

OptionalUserSpecifiedTopicStr: TypeAlias = Annotated[str | None, ApiParamConfig("topic")]


class PresetUrlOption(str, Enum):
    BRANCHES = "branches"
    IGNORE_PRIVATE_REPOSITORIES = "ignore_private_repositories"
    CHANNEL_MAPPING = "mapping"


@dataclass
class WebhookConfigOption:
    name: str
    label: str
    validator: Callable[[str, str], str | bool | None]


@dataclass
class WebhookUrlOption:
    name: str
    label: str
    validator: Callable[[str, str], str | bool | None]

    @classmethod
    def build_preset_config(cls, config: PresetUrlOption) -> "WebhookUrlOption":
        """
        This creates a pre-configured WebhookUrlOption object to be used
        in various incoming webhook integrations.

        See https://zulip.com/api/incoming-webhooks-walkthrough#webhookurloption-presets
        for more details on this system and what each option does.
        """
        match config:
            case PresetUrlOption.BRANCHES:
                return cls(
                    name=config.value,
                    label="",
                    validator=check_string,
                )
            case PresetUrlOption.IGNORE_PRIVATE_REPOSITORIES:
                return cls(
                    name=config.value,
                    label="Exclude notifications from private repositories",
                    validator=check_bool,
                )
            case PresetUrlOption.CHANNEL_MAPPING:
                return cls(
                    name=config.value,
                    label="",
                    validator=check_string,
                )

        raise AssertionError(_("Unknown 'PresetUrlOption': {config}").format(config=config))


def get_setup_webhook_message(integration: str, user_name: str | None = None) -> str:
    content = SETUP_MESSAGE_TEMPLATE.format(integration=integration)
    if user_name:
        content += SETUP_MESSAGE_USER_PART.format(user_name=user_name)
    content = f"{content}."
    return content


def notify_bot_owner_about_invalid_json(
    user_profile: UserProfile, webhook_client_name: str
) -> None:
    send_rate_limited_pm_notification_to_bot_owner(
        user_profile,
        user_profile.realm,
        INVALID_JSON_MESSAGE.format(webhook_name=webhook_client_name).strip(),
    )


class MissingHTTPEventHeaderError(AnomalousWebhookPayloadError):
    code = ErrorCode.MISSING_HTTP_EVENT_HEADER
    data_fields = ["header"]

    def __init__(self, header: str) -> None:
        self.header = header

    @staticmethod
    @override
    def msg_format() -> str:
        return _("Missing the HTTP event header '{header}'")


@typed_endpoint
def check_send_webhook_message(
    request: HttpRequest,
    user_profile: UserProfile,
    topic: str,
    body: str,
    complete_event_type: str | None = None,
    *,
    stream: str | None = None,
    user_specified_topic: OptionalUserSpecifiedTopicStr = None,
    only_events: Json[list[str]] | None = None,
    exclude_events: Json[list[str]] | None = None,
    unquote_url_parameters: bool = False,
    no_previews: bool = False,
) -> int | None:
    if complete_event_type is not None and (
        # Here, we implement Zulip's generic support for filtering
        # events sent by the third-party service.
        #
        # If complete_event_type is passed to this function, we will check the event
        # type against user configured lists of only_events and exclude events.
        # If the event does not satisfy the configuration, the function will return
        # without sending any messages.
        #
        # We match items in only_events and exclude_events using Unix
        # shell-style wildcards.
        (
            only_events is not None
            and all(not fnmatch.fnmatch(complete_event_type, pattern) for pattern in only_events)
        )
        or (
            exclude_events is not None
            and any(fnmatch.fnmatch(complete_event_type, pattern) for pattern in exclude_events)
        )
    ):
        return None

    client = RequestNotes.get_notes(request).client
    assert client is not None
    if stream is None:
        assert user_profile.bot_owner is not None
        return check_send_private_message(
            user_profile, client, user_profile.bot_owner, body, no_previews=no_previews
        )
    else:
        # Some third-party websites (such as Atlassian's Jira), tend to
        # double escape their URLs in a manner that escaped space characters
        # (%20) are never properly decoded. We work around that by making sure
        # that the URL parameters are decoded on our end.
        if unquote_url_parameters:
            stream = unquote(stream)

        if user_specified_topic is not None:
            topic = user_specified_topic
            if unquote_url_parameters:
                topic = unquote(topic)

        try:
            if stream.isdecimal():
                return check_send_stream_message_by_id(
                    user_profile, client, int(stream), topic, body, no_previews=no_previews
                )
            else:
                return check_send_stream_message(
                    user_profile, client, stream, topic, body, no_previews=no_previews
                )
        except StreamDoesNotExistError:
            # A direct message will be sent to the bot_owner by check_message,
            # notifying that the webhook bot just tried to send a message to a
            # non-existent stream, so we don't need to re-raise it since it
            # clutters up webhook-errors.log
            return None


def standardize_headers(input_headers: None | dict[str, Any]) -> dict[str, str]:
    """This method can be used to standardize a dictionary of headers with
    the standard format that Django expects. For reference, refer to:
    https://docs.djangoproject.com/en/5.0/ref/request-response/#django.http.HttpRequest.headers

    NOTE: Historically, Django's headers were not case-insensitive. We're still
    capitalizing our headers to make it easier to compare/search later if required.
    """
    canonical_headers = {}

    if not input_headers:
        return {}

    for raw_header in input_headers:
        polished_header = raw_header.upper().replace("-", "_")
        if polished_header not in [
            "CONTENT_TYPE",
            "CONTENT_LENGTH",
        ] and not polished_header.startswith("HTTP_"):
            polished_header = "HTTP_" + polished_header
        canonical_headers[polished_header] = str(input_headers[raw_header])

    return canonical_headers


def validate_extract_webhook_http_header(
    request: HttpRequest, header: str, integration_name: str
) -> str:
    assert request.user.is_authenticated

    extracted_header = request.headers.get(header)
    if extracted_header is None:
        message_body = MISSING_EVENT_HEADER_MESSAGE.format(
            bot_name=request.user.full_name,
            request_path=request.path,
            header_name=header,
            integration_name=integration_name,
            support_email=FromAddress.SUPPORT,
        )
        send_rate_limited_pm_notification_to_bot_owner(
            request.user, request.user.realm, message_body
        )

        raise MissingHTTPEventHeaderError(header)

    return extracted_header


def get_fixture_http_headers(integration_dir_name: str, fixture_name: str) -> dict["str", "str"]:
    """For integrations that require custom HTTP headers for some (or all)
    of their test fixtures, this method will call a specially named
    function from the target integration module to determine what set
    of HTTP headers goes with the given test fixture.
    """
    view_module_name = f"zerver.webhooks.{integration_dir_name}.view"
    try:
        # TODO: We may want to migrate to a more explicit registration
        # strategy for this behavior rather than a try/except import.
        view_module = importlib.import_module(view_module_name)
        fixture_to_headers = view_module.fixture_to_headers
    except (ImportError, AttributeError):
        return {}
    return fixture_to_headers(fixture_name)


def get_http_headers_from_filename(http_header_key: str) -> Callable[[str], dict[str, str]]:
    """If an integration requires an event type kind of HTTP header which can
    be easily (statically) determined, then name the fixtures in the format
    of "header_value__other_details" or even "header_value" and the use this
    method in the headers.py file for the integration."""

    def fixture_to_headers(filename: str) -> dict[str, str]:
        if "__" in filename:
            event_type = filename.split("__")[0]
        else:
            event_type = filename
        return {http_header_key: event_type}

    return fixture_to_headers


def parse_multipart_string(body: str) -> dict[str, str]:
    """
    Converts multipart/form-data string (fixture) to dict
    """
    boundary = body.split("\n")[0][2:]
    parts = body.split(f"--{boundary}")

    data = {}
    for part in parts:
        if part.strip() in ["", "--"]:
            continue

        headers, body = part.split("\n\n", 1)
        body = body.removesuffix("\n--")

        content_disposition = next(
            (line for line in headers.splitlines() if "Content-Disposition" in line), ""
        )
        field_name = content_disposition.split('name="')[1].split('"')[0]
        data[field_name] = body

    return data


def validate_webhook_signature(
    request: HttpRequest, payload: str, signature: str, algorithm: str = "sha256"
) -> None:
    if not settings.VERIFY_WEBHOOK_SIGNATURES:  # nocoverage
        return

    if algorithm not in hashlib.algorithms_available:
        raise AssertionError(
            _("The algorithm '{algorithm}' is not supported.").format(algorithm=algorithm)
        )

    webhook_secret: str | None = request.GET.get("webhook_secret")
    if webhook_secret is None:
        raise JsonableError(
            _(
                "The webhook secret is missing. Please set the webhook_secret while generating the URL."
            )
        )
    webhook_secret_bytes = force_bytes(webhook_secret)
    payload_bytes = force_bytes(payload)

    signed_payload = hmac.new(
        webhook_secret_bytes,
        payload_bytes,
        algorithm,
    ).hexdigest()

    if signed_payload != signature:
        raise JsonableError(_("Webhook signature verification failed."))
```

--------------------------------------------------------------------------------

---[FILE: git.py]---
Location: zulip-main/zerver/lib/webhooks/git.py

```python
import string
from collections import defaultdict
from typing import Any

TOPIC_WITH_BRANCH_TEMPLATE = "{repo} / {branch}"
TOPIC_WITH_PR_OR_ISSUE_INFO_TEMPLATE = "{repo} / {type} #{id} {title}"
TOPIC_WITH_RELEASE_TEMPLATE = "{repo} / {tag} {title}"

EMPTY_SHA = "0000000000000000000000000000000000000000"

COMMITS_LIMIT = 20
COMMIT_ROW_TEMPLATE = "* {commit_msg} ([{commit_short_sha}]({commit_url}))\n"
COMMITS_MORE_THAN_LIMIT_TEMPLATE = "[and {commits_number} more commit(s)]"
COMMIT_OR_COMMITS = "commit{}"

PUSH_PUSHED_TEXT_WITH_URL = "[{push_type}]({compare_url}) {number_of_commits} {commit_or_commits}"
PUSH_PUSHED_TEXT_WITHOUT_URL = "{push_type} {number_of_commits} {commit_or_commits}"

PUSH_COMMITS_BASE = "{user_name} {pushed_text} to branch {branch_name}."
PUSH_COMMITS_BASE_WITH_REPOSITORY_NAME = (
    "{user_name} {pushed_text} to branch {branch_name} of [{repository_name}]({repository_url})."
)
PUSH_COMMITS_MESSAGE_TEMPLATE_WITH_COMMITTERS = """{base_message} {committers_details}.

{commits_data}
"""
PUSH_COMMITS_MESSAGE_TEMPLATE_WITHOUT_COMMITTERS = """{base_message}

{commits_data}
"""
PUSH_DELETE_BRANCH_MESSAGE_TEMPLATE = (
    "{user_name} [deleted]({compare_url}) the branch {branch_name}."
)
PUSH_LOCAL_BRANCH_WITHOUT_COMMITS_MESSAGE_TEMPLATE = (
    "{user_name} [{push_type}]({compare_url}) the branch {branch_name}."
)
PUSH_LOCAL_BRANCH_WITHOUT_COMMITS_MESSAGE_WITHOUT_URL_TEMPLATE = (
    "{user_name} {push_type} the branch {branch_name}."
)
PUSH_COMMITS_MESSAGE_EXTENSION = "Commits by {}"
PUSH_COMMITTERS_LIMIT_INFO = 3

FORCE_PUSH_COMMITS_MESSAGE_TEMPLATE = (
    "{user_name} [force pushed]({url}) to branch {branch_name}. Head is now {head}."
)
CREATE_BRANCH_MESSAGE_TEMPLATE = "{user_name} created [{branch_name}]({url}) branch."
CREATE_BRANCH_WITHOUT_URL_MESSAGE_TEMPLATE = "{user_name} created {branch_name} branch."
REMOVE_BRANCH_MESSAGE_TEMPLATE = "{user_name} deleted branch {branch_name}."

ISSUE_LABELED_OR_UNLABELED_MESSAGE_TEMPLATE = (
    "[{user_name}]({user_url}) {action} the {label_name} label {preposition} [Issue #{id}]({url})."
)
ISSUE_LABELED_OR_UNLABELED_MESSAGE_TEMPLATE_WITH_TITLE = "[{user_name}]({user_url}) {action} the {label_name} label {preposition} [Issue #{id} {title}]({url})."

ISSUE_MILESTONED_OR_DEMILESTONED_MESSAGE_TEMPLATE = "[{user_name}]({user_url}) {action} milestone [{milestone_name}]({milestone_url}) {preposition} [issue #{id}]({url})."
ISSUE_MILESTONED_OR_DEMILESTONED_MESSAGE_TEMPLATE_WITH_TITLE = "[{user_name}]({user_url}) {action} milestone [{milestone_name}]({milestone_url}) {preposition} [issue #{id} {title}]({url})."

PULL_REQUEST_OR_ISSUE_MESSAGE_TEMPLATE = "{user_name} {action}{assignee} [{type}{id}{title}]({url})"
PULL_REQUEST_OR_ISSUE_ASSIGNEE_INFO_TEMPLATE = "(assigned to {assignee})"
PULL_REQUEST_REVIEWER_INFO_TEMPLATE = "(assigned reviewers: {reviewer})"
PULL_REQUEST_BRANCH_INFO_TEMPLATE = "from `{target}` to `{base}`"

CONTENT_MESSAGE_TEMPLATE = "\n~~~ quote\n{message}\n~~~"

COMMITS_COMMENT_MESSAGE_TEMPLATE = "{user_name} {action} on [{sha}]({url})"

PUSH_TAGS_MESSAGE_TEMPLATE = """{user_name} {action} tag {tag}"""
TAG_WITH_URL_TEMPLATE = "[{tag_name}]({tag_url})"
TAG_WITHOUT_URL_TEMPLATE = "{tag_name}"

RELEASE_MESSAGE_TEMPLATE = "{user_name} {action} release [{release_name}]({url}) for tag {tagname}."
RELEASE_MESSAGE_TEMPLATE_WITHOUT_USER_NAME = (
    "Release [{release_name}]({url}) for tag {tagname} was {action}."
)
RELEASE_MESSAGE_TEMPLATE_WITHOUT_USER_NAME_WITHOUT_URL = (
    "Release {release_name} for tag {tagname} was {action}."
)


def get_assignee_string(assignees: list[dict[str, Any]]) -> str:
    assignees_string = ""
    if len(assignees) == 1:
        assignees_string = "{username}".format(**assignees[0])
    else:
        usernames = [a["username"] for a in assignees]

        assignees_string = ", ".join(usernames[:-1]) + " and " + usernames[-1]
    return assignees_string


def get_push_commits_event_message(
    user_name: str,
    compare_url: str | None,
    branch_name: str,
    commits_data: list[dict[str, Any]],
    is_truncated: bool = False,
    deleted: bool = False,
    force_push: bool | None = False,
    repository_name: str | None = None,
    repository_url: str | None = None,
) -> str:
    if not commits_data and deleted:
        return PUSH_DELETE_BRANCH_MESSAGE_TEMPLATE.format(
            user_name=user_name,
            compare_url=compare_url,
            branch_name=branch_name,
        )

    push_type = "force pushed" if force_push else "pushed"
    if not commits_data and not deleted:
        if compare_url:
            return PUSH_LOCAL_BRANCH_WITHOUT_COMMITS_MESSAGE_TEMPLATE.format(
                push_type=push_type,
                user_name=user_name,
                compare_url=compare_url,
                branch_name=branch_name,
            )
        return PUSH_LOCAL_BRANCH_WITHOUT_COMMITS_MESSAGE_WITHOUT_URL_TEMPLATE.format(
            push_type=push_type,
            user_name=user_name,
            branch_name=branch_name,
        )

    pushed_message_template = (
        PUSH_PUSHED_TEXT_WITH_URL if compare_url else PUSH_PUSHED_TEXT_WITHOUT_URL
    )

    pushed_text_message = pushed_message_template.format(
        push_type=push_type,
        compare_url=compare_url,
        number_of_commits=len(commits_data),
        commit_or_commits=COMMIT_OR_COMMITS.format("s" if len(commits_data) > 1 else ""),
    )

    base_message_template = (
        PUSH_COMMITS_BASE_WITH_REPOSITORY_NAME
        if repository_name and repository_url
        else PUSH_COMMITS_BASE
    )
    base_message = base_message_template.format(
        user_name=user_name,
        pushed_text=pushed_text_message,
        branch_name=branch_name,
        repository_name=repository_name,
        repository_url=repository_url,
    )

    committers_items: list[tuple[str, int]] = get_all_committers(commits_data)
    if len(committers_items) == 1 and user_name == committers_items[0][0]:
        return PUSH_COMMITS_MESSAGE_TEMPLATE_WITHOUT_COMMITTERS.format(
            base_message=base_message,
            commits_data=get_commits_content(commits_data, is_truncated),
        ).rstrip()
    else:
        committers_details = "{} ({})".format(*committers_items[0])

        for name, number_of_commits in committers_items[1:-1]:
            committers_details = f"{committers_details}, {name} ({number_of_commits})"

        if len(committers_items) > 1:
            committers_details = "{} and {} ({})".format(committers_details, *committers_items[-1])

        return PUSH_COMMITS_MESSAGE_TEMPLATE_WITH_COMMITTERS.format(
            base_message=base_message,
            committers_details=PUSH_COMMITS_MESSAGE_EXTENSION.format(committers_details),
            commits_data=get_commits_content(commits_data, is_truncated),
        ).rstrip()


def get_force_push_commits_event_message(
    user_name: str, url: str, branch_name: str, head: str
) -> str:
    return FORCE_PUSH_COMMITS_MESSAGE_TEMPLATE.format(
        user_name=user_name,
        url=url,
        branch_name=branch_name,
        head=head,
    )


def get_create_branch_event_message(user_name: str, url: str | None, branch_name: str) -> str:
    if url is None:
        return CREATE_BRANCH_WITHOUT_URL_MESSAGE_TEMPLATE.format(
            user_name=user_name,
            branch_name=branch_name,
        )
    return CREATE_BRANCH_MESSAGE_TEMPLATE.format(
        user_name=user_name,
        url=url,
        branch_name=branch_name,
    )


def get_remove_branch_event_message(user_name: str, branch_name: str) -> str:
    return REMOVE_BRANCH_MESSAGE_TEMPLATE.format(
        user_name=user_name,
        branch_name=branch_name,
    )


def get_pull_request_event_message(
    *,
    user_name: str,
    action: str,
    url: str,
    number: int | None = None,
    target_branch: str | None = None,
    base_branch: str | None = None,
    message: str | None = None,
    assignee: str | None = None,
    assignees: list[dict[str, Any]] | None = None,
    assignee_updated: str | None = None,
    reviewer: str | None = None,
    type: str = "PR",
    title: str | None = None,
) -> str:
    action_messages = {
        "approval": "added their approval for",
        "unapproval": "removed their approval for",
    }

    kwargs = {
        "user_name": user_name,
        "action": action_messages.get(action, action),
        "type": type,
        "url": url,
        "id": f" #{number}" if number is not None else "",
        "title": f" {title}" if title is not None else "",
        "assignee": {
            "assigned": f" {assignee_updated} to",
            "unassigned": f" {assignee_updated} from",
        }.get(action, ""),
    }

    main_message = PULL_REQUEST_OR_ISSUE_MESSAGE_TEMPLATE.format(**kwargs)

    if target_branch and base_branch:
        branch_info = PULL_REQUEST_BRANCH_INFO_TEMPLATE.format(
            target=target_branch,
            base=base_branch,
        )
        main_message = f"{main_message} {branch_info}"

    if assignees:
        assignee_string = get_assignee_string(assignees)
        assignee_info = PULL_REQUEST_OR_ISSUE_ASSIGNEE_INFO_TEMPLATE.format(
            assignee=assignee_string
        )

    elif assignee:
        assignee_info = PULL_REQUEST_OR_ISSUE_ASSIGNEE_INFO_TEMPLATE.format(assignee=assignee)

    elif reviewer:
        assignee_info = PULL_REQUEST_REVIEWER_INFO_TEMPLATE.format(reviewer=reviewer)

    if assignees or assignee or reviewer:
        main_message = f"{main_message} {assignee_info}"

    punctuation = ":" if message else "."
    if (
        assignees
        or assignee
        or (target_branch and base_branch)
        or title is None
        # Once we get here, we know that the message ends with a title
        # which could already have punctuation at the end
        or title[-1] not in string.punctuation
    ):
        main_message = f"{main_message}{punctuation}"

    if message:
        main_message += "\n" + CONTENT_MESSAGE_TEMPLATE.format(message=message)
    return main_message.rstrip()


def get_issue_event_message(
    *,
    user_name: str,
    action: str,
    url: str,
    number: int | None = None,
    message: str | None = None,
    assignee: str | None = None,
    assignees: list[dict[str, Any]] | None = None,
    assignee_updated: str | None = None,
    title: str | None = None,
) -> str:
    return get_pull_request_event_message(
        user_name=user_name,
        action=action,
        url=url,
        number=number,
        message=message,
        assignee=assignee,
        assignees=assignees,
        assignee_updated=assignee_updated,
        type="issue",
        title=title,
    )


def get_issue_labeled_or_unlabeled_event_message(
    user_name: str,
    action: str,
    url: str,
    number: int,
    label_name: str,
    user_url: str,
    title: str | None = None,
) -> str:
    args = {
        "user_name": user_name,
        "action": action,
        "url": url,
        "id": number,
        "label_name": label_name,
        "user_url": user_url,
        "title": title,
        "preposition": "to" if action == "added" else "from",
    }
    if title is not None:
        return ISSUE_LABELED_OR_UNLABELED_MESSAGE_TEMPLATE_WITH_TITLE.format(**args)
    return ISSUE_LABELED_OR_UNLABELED_MESSAGE_TEMPLATE.format(**args)


def get_issue_milestoned_or_demilestoned_event_message(
    user_name: str,
    action: str,
    url: str,
    number: int,
    milestone_name: str,
    milestone_url: str,
    user_url: str,
    title: str | None = None,
) -> str:
    args = {
        "user_name": user_name,
        "action": action,
        "url": url,
        "id": number,
        "milestone_name": milestone_name,
        "milestone_url": milestone_url,
        "user_url": user_url,
        "title": title,
        "preposition": "to" if action == "added" else "from",
    }
    if title is not None:
        return ISSUE_MILESTONED_OR_DEMILESTONED_MESSAGE_TEMPLATE_WITH_TITLE.format(**args)
    return ISSUE_MILESTONED_OR_DEMILESTONED_MESSAGE_TEMPLATE.format(**args)


def get_push_tag_event_message(
    user_name: str, tag_name: str, tag_url: str | None = None, action: str = "pushed"
) -> str:
    if tag_url:
        tag_part = TAG_WITH_URL_TEMPLATE.format(tag_name=tag_name, tag_url=tag_url)
    else:
        tag_part = TAG_WITHOUT_URL_TEMPLATE.format(tag_name=tag_name)

    message = PUSH_TAGS_MESSAGE_TEMPLATE.format(
        user_name=user_name,
        action=action,
        tag=tag_part,
    )

    if tag_name[-1] not in string.punctuation:
        message = f"{message}."

    return message


def get_commits_comment_action_message(
    user_name: str, action: str, commit_url: str, sha: str, message: str | None = None
) -> str:
    content = COMMITS_COMMENT_MESSAGE_TEMPLATE.format(
        user_name=user_name,
        action=action,
        sha=get_short_sha(sha),
        url=commit_url,
    )
    punctuation = ":" if message else "."
    content = f"{content}{punctuation}"
    if message:
        content += CONTENT_MESSAGE_TEMPLATE.format(
            message=message,
        )

    return content


def get_commits_content(commits_data: list[dict[str, Any]], is_truncated: bool = False) -> str:
    commits_content = ""
    for commit in commits_data[:COMMITS_LIMIT]:
        commits_content += COMMIT_ROW_TEMPLATE.format(
            commit_short_sha=get_short_sha(commit["sha"]),
            commit_url=commit.get("url"),
            commit_msg=commit["message"].partition("\n")[0],
        )

    if len(commits_data) > COMMITS_LIMIT:
        commits_content += COMMITS_MORE_THAN_LIMIT_TEMPLATE.format(
            commits_number=len(commits_data) - COMMITS_LIMIT,
        )
    elif is_truncated:
        commits_content += COMMITS_MORE_THAN_LIMIT_TEMPLATE.format(
            commits_number="",
        ).replace("  ", " ")
    return commits_content.rstrip()


def get_release_event_message(
    user_name: str, action: str, tagname: str, release_name: str, url: str
) -> str:
    content = RELEASE_MESSAGE_TEMPLATE.format(
        user_name=user_name,
        action=action,
        tagname=tagname,
        release_name=release_name,
        url=url,
    )

    return content


def get_short_sha(sha: str) -> str:
    return sha[:11]


def get_all_committers(commits_data: list[dict[str, Any]]) -> list[tuple[str, int]]:
    committers: dict[str, int] = defaultdict(int)

    for commit in commits_data:
        committers[commit["name"]] += 1

    # Sort by commit count, breaking ties alphabetically.
    committers_items: list[tuple[str, int]] = sorted(
        committers.items(),
        key=lambda item: (-item[1], item[0]),
    )
    committers_values: list[int] = [c_i[1] for c_i in committers_items]

    if len(committers) > PUSH_COMMITTERS_LIMIT_INFO:
        others_number_of_commits = sum(committers_values[PUSH_COMMITTERS_LIMIT_INFO:])
        committers_items = committers_items[:PUSH_COMMITTERS_LIMIT_INFO]
        committers_items.append(("others", others_number_of_commits))

    return committers_items


def is_branch_name_notifiable(branch: str, branches: str | None) -> bool:
    """
    Check if the branch name is in the list of branches to notify.
    This helper function is used in all Git-related integrations that
    support branch filtering.
    """
    return branches is None or branch in {
        branch_name.strip() for branch_name in branches.split(",")
    }
```

--------------------------------------------------------------------------------

---[FILE: add_users_to_streams.py]---
Location: zulip-main/zerver/management/commands/add_users_to_streams.py
Signals: Django

```python
from typing import Any

from django.core.management.base import CommandParser
from typing_extensions import override

from zerver.actions.streams import bulk_add_subscriptions
from zerver.lib.management import ZulipBaseCommand
from zerver.lib.streams import ensure_stream


class Command(ZulipBaseCommand):
    help = """Add some or all users in a realm to a set of streams."""

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        self.add_realm_args(parser, required=True)
        self.add_user_list_args(parser, all_users_help="Add all users in realm to these streams.")

        parser.add_argument(
            "-s", "--streams", required=True, help="A comma-separated list of stream names."
        )

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        realm = self.get_realm(options)
        assert realm is not None  # Should be ensured by parser

        user_profiles = self.get_users(options, realm)
        stream_names = {stream.strip() for stream in options["streams"].split(",")}

        for stream_name in stream_names:
            for user_profile in user_profiles:
                stream = ensure_stream(realm, stream_name, acting_user=None)
                _ignore, already_subscribed = bulk_add_subscriptions(
                    realm, [stream], [user_profile], acting_user=None
                )
                was_there_already = user_profile.id in (info.user.id for info in already_subscribed)
                print(
                    "{} {} to {}".format(
                        "Already subscribed" if was_there_already else "Subscribed",
                        user_profile.delivery_email,
                        stream_name,
                    )
                )
```

--------------------------------------------------------------------------------

---[FILE: archive_messages.py]---
Location: zulip-main/zerver/management/commands/archive_messages.py

```python
from typing import Any

from typing_extensions import override

from zerver.actions.realm_settings import (
    clean_deactivated_realm_data,
    delete_expired_demo_organizations,
)
from zerver.lib.management import ZulipBaseCommand, abort_unless_locked
from zerver.lib.retention import archive_messages, clean_archived_data


class Command(ZulipBaseCommand):
    @override
    @abort_unless_locked
    def handle(self, *args: Any, **options: str) -> None:
        clean_archived_data()
        archive_messages()
        scrub_realms()


def scrub_realms() -> None:
    # First, scrub currently deactivated realms that have an expired
    # scheduled deletion date. Then, deactivate and scrub realms with
    # an expired scheduled demo organization deletion date.
    clean_deactivated_realm_data()
    delete_expired_demo_organizations()
```

--------------------------------------------------------------------------------

---[FILE: audit_fts_indexes.py]---
Location: zulip-main/zerver/management/commands/audit_fts_indexes.py
Signals: Django

```python
from typing import Any

from django.db import connection
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    @override
    def handle(self, *args: Any, **kwargs: str) -> None:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE zerver_message
                SET search_tsvector =
                to_tsvector('zulip.english_us_search', subject || rendered_content)
                WHERE to_tsvector('zulip.english_us_search', subject || rendered_content) != search_tsvector
            """
            )

            fixed_message_count = cursor.rowcount
            print(f"Fixed {fixed_message_count} messages.")
```

--------------------------------------------------------------------------------

---[FILE: backup.py]---
Location: zulip-main/zerver/management/commands/backup.py
Signals: Django

```python
import os
import re
import tempfile
from argparse import ArgumentParser, RawTextHelpFormatter
from contextlib import ExitStack
from typing import Any

from django.conf import settings
from django.core.management.base import CommandParser
from django.db import connection
from django.utils.timezone import now as timezone_now
from typing_extensions import override

from scripts.lib.zulip_tools import TIMESTAMP_FORMAT, parse_os_release, run
from version import ZULIP_VERSION
from zerver.lib.management import ZulipBaseCommand
from zerver.logging_handlers import try_git_describe


class Command(ZulipBaseCommand):
    # Fix support for multi-line usage strings
    @override
    def create_parser(self, prog_name: str, subcommand: str, **kwargs: Any) -> CommandParser:
        parser = super().create_parser(prog_name, subcommand, **kwargs)
        parser.formatter_class = RawTextHelpFormatter
        return parser

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--output", help="Filename of output tarball")
        parser.add_argument("--skip-db", action="store_true", help="Skip database backup")
        parser.add_argument("--skip-uploads", action="store_true", help="Skip uploads backup")

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        timestamp = timezone_now().strftime(TIMESTAMP_FORMAT)
        with ExitStack() as stack:
            tmp = stack.enter_context(
                tempfile.TemporaryDirectory(prefix=f"zulip-backup-{timestamp}-")
            )
            os.mkdir(os.path.join(tmp, "zulip-backup"))
            members = []
            paths = []

            with open(os.path.join(tmp, "zulip-backup", "zulip-version"), "w") as f:
                print(ZULIP_VERSION, file=f)
                git = try_git_describe()
                if git:
                    print(git, file=f)
            members.append("zulip-backup/zulip-version")

            with open(os.path.join(tmp, "zulip-backup", "os-version"), "w") as f:
                print(
                    "{ID} {VERSION_ID}".format(**parse_os_release()),
                    file=f,
                )
            members.append("zulip-backup/os-version")

            with open(os.path.join(tmp, "zulip-backup", "postgres-version"), "w") as f:
                pg_server_version = connection.cursor().connection.server_version
                major_pg_version = pg_server_version // 10000
                print(pg_server_version, file=f)
            members.append("zulip-backup/postgres-version")

            if settings.DEVELOPMENT:
                members.append(
                    os.path.join(settings.DEPLOY_ROOT, "zproject", "dev-secrets.conf"),
                )
                paths.append(
                    ("zproject", os.path.join(settings.DEPLOY_ROOT, "zproject")),
                )
            else:
                members.append("/etc/zulip")
                paths.append(("settings", "/etc/zulip"))

            if not options["skip_db"]:
                pg_dump_command = [
                    f"/usr/lib/postgresql/{major_pg_version}/bin/pg_dump",
                    "--format=directory",
                    "--file=" + os.path.join(tmp, "zulip-backup", "database"),
                    "--username=" + settings.DATABASES["default"]["USER"],
                    "--dbname=" + settings.DATABASES["default"]["NAME"],
                    "--no-password",
                ]
                if settings.DATABASES["default"].get("HOST"):
                    pg_dump_command += ["--host=" + settings.DATABASES["default"]["HOST"]]
                if settings.DATABASES["default"].get("PORT"):
                    pg_dump_command += ["--port=" + str(settings.DATABASES["default"]["PORT"])]

                os.environ["PGPASSWORD"] = settings.DATABASES["default"]["PASSWORD"]

                run(
                    pg_dump_command,
                    cwd=tmp,
                )
                members.append("zulip-backup/database")

            if (
                not options["skip_uploads"]
                and settings.LOCAL_UPLOADS_DIR is not None
                and os.path.exists(
                    os.path.join(settings.DEPLOY_ROOT, settings.LOCAL_UPLOADS_DIR),
                )
            ):
                members.append(
                    os.path.join(settings.DEPLOY_ROOT, settings.LOCAL_UPLOADS_DIR),
                )
                paths.append(
                    (
                        "uploads",
                        os.path.join(settings.DEPLOY_ROOT, settings.LOCAL_UPLOADS_DIR),
                    ),
                )

            assert not any("|" in name or "|" in path for name, path in paths)
            transform_args = [
                r"--transform=s|^{}(/.*)?$|zulip-backup/{}\1|x".format(
                    re.escape(path),
                    name.replace("\\", r"\\"),
                )
                for name, path in paths
            ]

            try:
                if options["output"] is None:
                    tarball_path = stack.enter_context(
                        tempfile.NamedTemporaryFile(
                            prefix=f"zulip-backup-{timestamp}-",
                            suffix=".tar.gz",
                            delete=False,
                        )
                    ).name
                else:
                    tarball_path = options["output"]

                run(
                    [
                        "tar",
                        f"--directory={tmp}",
                        "-cPhzf",
                        tarball_path,
                        *transform_args,
                        "--",
                        *members,
                    ]
                )
                print(f"Backup tarball written to {tarball_path}")
            except BaseException:
                if options["output"] is None:
                    os.unlink(tarball_path)
                raise
```

--------------------------------------------------------------------------------

---[FILE: bulk_change_user_name.py]---
Location: zulip-main/zerver/management/commands/bulk_change_user_name.py
Signals: Django

```python
from argparse import ArgumentParser
from typing import Any

from django.core.management.base import CommandError
from typing_extensions import override

from zerver.actions.user_settings import do_change_full_name
from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    help = """Change the names for many users."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "data_file",
            metavar="<data file>",
            help="file containing rows of the form <email>,<desired name>",
        )
        self.add_realm_args(parser, required=True)

    @override
    def handle(self, *args: Any, **options: str) -> None:
        data_file = options["data_file"]
        realm = self.get_realm(options)
        with open(data_file) as f:
            for line in f:
                email, new_name = line.strip().split(",", 1)

                try:
                    user_profile = self.get_user(email, realm)
                    old_name = user_profile.full_name
                    print(f"{email}: {old_name} -> {new_name}")
                    do_change_full_name(user_profile, new_name, None)
                except CommandError:
                    print(f"e-mail {email} doesn't exist in the realm {realm}, skipping")
```

--------------------------------------------------------------------------------

````
