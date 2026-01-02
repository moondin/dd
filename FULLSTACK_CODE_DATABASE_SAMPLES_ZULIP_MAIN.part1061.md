---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 1061
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1061 of 1290)

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

---[FILE: test_tutorial.py]---
Location: zulip-main/zerver/tests/test_tutorial.py
Signals: Django

```python
from django.conf import settings
from django.test import override_settings
from typing_extensions import override

from zerver.actions.message_send import internal_send_private_message
from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.test_helpers import message_stream_count, most_recent_message
from zerver.models.recipients import get_or_create_direct_message_group
from zerver.models.users import get_system_bot


class TutorialTests(ZulipTestCase):
    @override
    def setUp(self) -> None:
        super().setUp()
        # This emulates the welcome message sent by the welcome bot to hamlet@zulip.com
        # This is only a quick fix - ideally, we would have this message sent by the initialization
        # code in populate_db.py
        user = self.example_user("hamlet")
        welcome_bot = get_system_bot(settings.WELCOME_BOT, user.realm_id)
        content = "Shortened welcome message."
        internal_send_private_message(
            welcome_bot,
            user,
            content,
            # disable_external_notifications set to False will still lead
            # the tests to pass. Setting this to True, because we contextually
            # set this to true for welcome_bot in the codebase.
            disable_external_notifications=True,
        )

    def test_response_to_pm_for_app(self) -> None:
        user = self.example_user("hamlet")
        bot = get_system_bot(settings.WELCOME_BOT, user.realm_id)
        messages = ["app", "Apps"]
        self.login_user(user)
        for content in messages:
            self.send_personal_message(user, bot, content)
            expected_response = (
                "You can [download](/apps/) the [mobile and desktop apps](/apps/). "
                "Zulip also works great in a browser."
            )
            self.assertEqual(most_recent_message(user).content, expected_response)

    def test_response_to_pm_for_edit(self) -> None:
        user = self.example_user("hamlet")
        bot = get_system_bot(settings.WELCOME_BOT, user.realm_id)
        messages = ["profile", "Profile"]
        self.login_user(user)
        for content in messages:
            self.send_personal_message(user, bot, content)
            expected_response = (
                "Go to [Profile settings](#settings/profile) "
                "to add a [profile picture](/help/change-your-profile-picture) "
                "and edit your [profile information](/help/edit-your-profile)."
            )
            self.assertEqual(most_recent_message(user).content, expected_response)

    def test_response_to_pm_for_theme(self) -> None:
        user = self.example_user("hamlet")
        bot = get_system_bot(settings.WELCOME_BOT, user.realm_id)
        messages = ["theme", "Theme"]
        self.login_user(user)
        for content in messages:
            self.send_personal_message(user, bot, content)
            expected_response = (
                "You can switch between [light and dark theme](/help/dark-theme), "
                "[pick your favorite emoji set](/help/emoji-and-emoticons#change-your-emoji-set), "
                "[change your language](/help/change-your-language), and otherwise customize "
                "your Zulip experience in your [Preferences](#settings/preferences)."
            )
            self.assertEqual(most_recent_message(user).content, expected_response)

    def test_response_to_pm_for_stream(self) -> None:
        user = self.example_user("hamlet")
        bot = get_system_bot(settings.WELCOME_BOT, user.realm_id)
        messages = ["Streams", "streams", "channels"]
        self.login_user(user)
        for content in messages:
            self.send_personal_message(user, bot, content)
            expected_response = (
                "Channels organize conversations based on who needs to see them. "
                "For example, it's common to have a channel for each team in an organization.\n\n"
                "[Browse and subscribe to channels](#channels/all)."
            )
            self.assertEqual(most_recent_message(user).content, expected_response)

    def test_response_to_pm_for_topic(self) -> None:
        user = self.example_user("hamlet")
        bot = get_system_bot(settings.WELCOME_BOT, user.realm_id)
        messages = ["Topics", "topics"]
        self.login_user(user)
        for content in messages:
            self.send_personal_message(user, bot, content)
            expected_response = (
                "[Topics](/help/introduction-to-topics) summarize what each conversation in Zulip "
                "is about. You can read Zulip one topic at a time, seeing each message in context, "
                "no matter how many other conversations are going on.\n\n"
                "When you start a conversation, label it with a new topic. For a good topic name, "
                "think about finishing the sentence: “Hey, can we chat about…?”\n\n"
                "Check out [Recent conversations](#recent) for a list of topics that are being discussed."
            )
            self.assertEqual(most_recent_message(user).content, expected_response)

    def test_response_to_pm_for_shortcuts(self) -> None:
        user = self.example_user("hamlet")
        bot = get_system_bot(settings.WELCOME_BOT, user.realm_id)
        messages = ["Keyboard shortcuts", "shortcuts", "Shortcuts"]
        self.login_user(user)
        for content in messages:
            self.send_personal_message(user, bot, content)
            expected_response = (
                "Zulip's [keyboard shortcuts](#keyboard-shortcuts) "
                "let you navigate the app quickly and efficiently.\n\n"
                "Press `?` any time to see a [cheat sheet](#keyboard-shortcuts)."
            )
            self.assertEqual(most_recent_message(user).content, expected_response)

    def test_response_to_pm_for_formatting(self) -> None:
        user = self.example_user("hamlet")
        bot = get_system_bot(settings.WELCOME_BOT, user.realm_id)
        messages = ["message formatting", "Formatting"]
        self.login_user(user)
        for content in messages:
            self.send_personal_message(user, bot, content)
            expected_response = (
                "You can **format** *your* `message` using the handy formatting "
                "buttons, or by typing your formatting with Markdown.\n\n"
                "Check out the [cheat sheet](#message-formatting) to learn about "
                "spoilers, global times, and more."
            )
            self.assertEqual(most_recent_message(user).content, expected_response)

    def test_response_to_pm_for_help(self) -> None:
        user = self.example_user("hamlet")
        bot = get_system_bot(settings.WELCOME_BOT, user.realm_id)
        messages = ["help", "Help", "?"]
        self.login_user(user)
        for content in messages:
            self.send_personal_message(user, bot, content)
            expected_response = (
                "Here are a few messages I understand: "
                "`apps`, `profile`, `theme`, "
                "`channels`, `topics`, `message formatting`, `keyboard shortcuts`.\n\n"
                "Check out our [Getting started guide](/help/getting-started-with-zulip), "
                "or browse the [help center](/help/) to learn more!"
            )
            self.assertEqual(most_recent_message(user).content, expected_response)

    @override_settings(PREFER_DIRECT_MESSAGE_GROUP=True)
    def test_response_to_pm_for_help_using_direct_message_group(self) -> None:
        user = self.example_user("hamlet")
        bot = get_system_bot(settings.WELCOME_BOT, user.realm_id)

        direct_group_message = get_or_create_direct_message_group(id_list=[user.id, bot.id])

        messages = ["help", "Help", "?"]
        self.login_user(user)
        for content in messages:
            self.send_personal_message(user, bot, content)
            expected_response = (
                "Here are a few messages I understand: "
                "`apps`, `profile`, `theme`, "
                "`channels`, `topics`, `message formatting`, `keyboard shortcuts`.\n\n"
                "Check out our [Getting started guide](/help/getting-started-with-zulip), "
                "or browse the [help center](/help/) to learn more!"
            )
            message = most_recent_message(user)
            self.assertEqual(message.content, expected_response)
            self.assertEqual(message.recipient, direct_group_message.recipient)

    def test_no_response_to_direct_message_group_with_a_soft_diactivated_user(self) -> None:
        user = self.example_user("hamlet")
        soft_deactivated_user = self.example_user("cordelia")
        self.soft_deactivate_user(soft_deactivated_user)
        bot = get_system_bot(settings.WELCOME_BOT, user.realm_id)

        messages = ["help", "Help", "?"]
        self.login_user(user)
        for content in messages:
            self.send_group_direct_message(user, [soft_deactivated_user, bot], content)
            message = most_recent_message(user)
            self.assertEqual(message.content, content)
            self.assertEqual(message.sender, user)

    def test_response_to_pm_for_undefined(self) -> None:
        user = self.example_user("hamlet")
        bot = get_system_bot(settings.WELCOME_BOT, user.realm_id)
        messages = ["Hello", "HAHAHA", "OKOK", "LalulaLapas"]
        self.login_user(user)
        # First undefined message sent.
        self.send_personal_message(user, bot, "Hello")
        expected_response = (
            "You can chat with me as much as you like! To get help, try one of the following messages: "
            "`apps`, `profile`, `theme`, `channels`, "
            "`topics`, `message formatting`, `keyboard shortcuts`, `help`."
        )
        self.assertEqual(most_recent_message(user).content, expected_response)

        # For future undefined messages, welcome bot won't send a reply.
        for content in messages:
            self.send_personal_message(user, bot, content)
            self.assertEqual(most_recent_message(user).content, content)

        # Check if Welcome bot still replies for bot commands
        self.send_personal_message(user, bot, "apps")
        expected_response = (
            "You can [download](/apps/) the [mobile and desktop apps](/apps/). "
            "Zulip also works great in a browser."
        )
        self.assertEqual(most_recent_message(user).content, expected_response)

    @override_settings(PREFER_DIRECT_MESSAGE_GROUP=True)
    def test_response_to_pm_for_undefined_using_direct_message_group(self) -> None:
        user = self.example_user("hamlet")
        bot = get_system_bot(settings.WELCOME_BOT, user.realm_id)

        get_or_create_direct_message_group(id_list=[user.id, bot.id])

        messages = ["Hello", "HAHAHA", "OKOK", "LalulaLapas"]
        self.login_user(user)

        # First undefined message sent.
        self.send_personal_message(user, bot, "Hello")
        expected_response = (
            "You can chat with me as much as you like! To get help, try one of the following messages: "
            "`apps`, `profile`, `theme`, `channels`, "
            "`topics`, `message formatting`, `keyboard shortcuts`, `help`."
        )
        self.assertEqual(most_recent_message(user).content, expected_response)

        # For future undefined messages, welcome bot won't send a reply.
        for content in messages:
            self.send_personal_message(user, bot, content)
            self.assertEqual(most_recent_message(user).content, content)

        # Check if Welcome bot still replies for bot commands
        self.send_personal_message(user, bot, "apps")
        expected_response = (
            "You can [download](/apps/) the [mobile and desktop apps](/apps/). "
            "Zulip also works great in a browser."
        )
        self.assertEqual(most_recent_message(user).content, expected_response)

    def test_no_response_to_group_pm(self) -> None:
        user1 = self.example_user("hamlet")
        user2 = self.example_user("cordelia")
        bot = get_system_bot(settings.WELCOME_BOT, user1.realm_id)
        content = "whatever"
        self.login_user(user1)
        self.send_group_direct_message(user1, [bot, user2], content)
        user1_messages = message_stream_count(user1)
        self.assertEqual(most_recent_message(user1).content, content)
        # Welcome bot should still respond to initial direct message
        # after group direct message.
        self.send_personal_message(user1, bot, content)
        self.assertEqual(message_stream_count(user1), user1_messages + 2)
```

--------------------------------------------------------------------------------

---[FILE: test_typed_endpoint.py]---
Location: zulip-main/zerver/tests/test_typed_endpoint.py
Signals: Django, Pydantic

```python
from collections.abc import Callable
from typing import Annotated, Any, Literal, TypeAlias, TypeVar, cast

import orjson
from django.core.exceptions import ValidationError as DjangoValidationError
from django.http import HttpRequest, HttpResponse
from pydantic import BaseModel, ConfigDict, Json, StringConstraints, ValidationInfo, WrapValidator
from pydantic.dataclasses import dataclass
from pydantic.functional_validators import ModelWrapValidatorHandler
from typing_extensions import override

from zerver.lib.exceptions import ApiParamValidationError, JsonableError
from zerver.lib.request import RequestConfusingParamsError, RequestVariableMissingError
from zerver.lib.response import MutableJsonResponse, json_success
from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.test_helpers import HostRequestMock
from zerver.lib.typed_endpoint import (
    ApiParamConfig,
    DocumentationStatus,
    JsonBodyPayload,
    PathOnly,
    RequiredStringConstraint,
    is_optional,
    typed_endpoint,
    typed_endpoint_without_parameters,
)
from zerver.lib.validator import WildValue, check_bool
from zerver.models import UserProfile

ParamTypes: TypeAlias = Literal["none", "json_only", "both"]
T = TypeVar("T")


def call_endpoint(
    view: Callable[..., T], request: HttpRequest, *args: object, **kwargs: object
) -> T:
    """A helper to let us ignore the view function's signature"""
    return view(request, *args, **kwargs)


class TestEndpoint(ZulipTestCase):
    def test_is_optional(self) -> None:
        """This test is only needed because we don't
        have coverage of is_optional in Python 3.11.
        """
        self.assertTrue(is_optional(cast(type[str | None], str | None)))
        self.assertFalse(is_optional(str))

    def test_coerce(self) -> None:
        @typed_endpoint
        def view(request: HttpRequest, *, strict_int: int) -> None: ...

        with self.assertRaisesMessage(JsonableError, "strict_int is not an integer"):
            call_endpoint(view, HostRequestMock({"strict_int": orjson.dumps("10").decode()}))
        with self.assertRaisesMessage(JsonableError, "strict_int is not an integer"):
            self.assertEqual(call_endpoint(view, HostRequestMock({"strict_int": 10})), 20)

        @typed_endpoint
        def view2(request: HttpRequest, *, strict_int: Json[int]) -> int:
            return strict_int * 2

        with self.assertRaisesMessage(JsonableError, "strict_int is not an integer"):
            call_endpoint(view2, HostRequestMock({"strict_int": orjson.dumps("10").decode()}))
        # This is the same as orjson.dumps(10).decode()
        self.assertEqual(call_endpoint(view2, HostRequestMock({"strict_int": "10"})), 20)
        self.assertEqual(call_endpoint(view2, HostRequestMock({"strict_int": 10})), 20)

    def test_json(self) -> None:
        @dataclass(frozen=True)
        class Foo:
            num1: int
            num2: int

            __pydantic_config__ = ConfigDict(extra="forbid")

        default_foo = Foo(10, 10)

        @typed_endpoint
        def view(
            request: HttpRequest,
            *,
            json_int: Json[int],
            json_str: Json[str],
            json_data: Json[Foo],
            json_optional: Json[int | None] | None = None,
            json_default: Json[Foo] = default_foo,
            non_json: str = "ok",
            non_json_optional: str | None = None,
        ) -> HttpResponse:
            return MutableJsonResponse(
                data={
                    "result1": json_int * json_data.num1 * json_data.num2,
                    "result2": json_default.num1 * json_default.num2,
                    "optional": json_optional,
                    "str": json_str + non_json,
                },
                content_type="application/json",
                status=200,
            )

        response = call_endpoint(
            view,
            HostRequestMock(
                post_data={
                    "json_int": "2",
                    "json_str": orjson.dumps("asd").decode(),
                    "json_data": orjson.dumps({"num1": 5, "num2": 7}).decode(),
                }
            ),
        )
        self.assertDictEqual(
            orjson.loads(response.content),
            {"result1": 70, "result2": 100, "str": "asdok", "optional": None},
        )

        data = {
            "json_int": "2",
            "json_str": orjson.dumps("asd").decode(),
            "json_data": orjson.dumps({"num1": 5, "num2": 7}).decode(),
            "json_default": orjson.dumps({"num1": 3, "num2": 11}).decode(),
            "json_optional": "5",
            "non_json": "asd",
        }
        response = call_endpoint(
            view,
            HostRequestMock(post_data=data),
        )
        self.assertDictEqual(
            orjson.loads(response.content),
            {"result1": 70, "result2": 33, "str": "asdasd", "optional": 5},
        )

        request = HostRequestMock()
        request.GET.update(data)
        response = call_endpoint(
            view,
            request,
        )
        self.assertDictEqual(
            orjson.loads(response.content),
            {"result1": 70, "result2": 33, "str": "asdasd", "optional": 5},
        )

        with self.assertRaisesMessage(JsonableError, "json_int is not valid JSON"):
            call_endpoint(
                view,
                HostRequestMock(
                    post_data={
                        "json_int": "foo",
                        "json_str": "asd",
                        "json_data": orjson.dumps({"num1": 5, "num2": 7}).decode(),
                    }
                ),
            )
        with self.assertRaisesMessage(JsonableError, "json_str is not valid JSON"):
            call_endpoint(
                view,
                HostRequestMock(
                    post_data={
                        "json_int": 5,
                        "json_str": "asd",
                        "json_data": orjson.dumps({"num1": 5, "num2": 7}).decode(),
                    }
                ),
            )

        with self.assertRaisesMessage(RequestVariableMissingError, "Missing 'json_int' argument"):
            call_endpoint(view, HostRequestMock())

        with self.assertRaisesMessage(JsonableError, "json_int is not an integer"):
            call_endpoint(
                view,
                HostRequestMock(
                    {
                        "json_int": orjson.dumps(False).decode(),
                        "json_str": orjson.dumps("10").decode(),
                        "json_data": orjson.dumps({"num1": "a", "num2": "b"}).decode(),
                    }
                ),
            )

        with self.assertRaisesMessage(JsonableError, 'json_data["num1"] is not an integer'):
            call_endpoint(
                view,
                HostRequestMock(
                    {
                        "json_int": orjson.dumps(0).decode(),
                        "json_str": orjson.dumps("test").decode(),
                        "json_data": orjson.dumps({"num1": "10", "num2": 20}).decode(),
                    }
                ),
            )

        response = call_endpoint(
            view,
            HostRequestMock(
                post_data={
                    "json_int": 5,
                    "json_str": orjson.dumps("asd").decode(),
                    "json_data": orjson.dumps({"num1": 5, "num2": 7}).decode(),
                    "json_optional": orjson.dumps(None).decode(),
                    "non_json_optional": None,
                }
            ),
            json_optional="asd",
        )
        # Note that json_optional is ignored because we have passed it as a kwarg already.
        self.assertDictEqual(
            orjson.loads(response.content),
            {
                "result1": 175,
                "result2": 100,
                "str": "asdok",
                "optional": "asd",
                "ignored_parameters_unsupported": ["json_optional"],
            },
        )

        with self.assertRaisesMessage(
            JsonableError, 'Argument "unknown" at json_data["unknown"] is unexpected'
        ):
            call_endpoint(
                view,
                HostRequestMock(
                    {
                        "json_int": orjson.dumps(19).decode(),
                        "json_str": orjson.dumps("10").decode(),
                        "json_data": orjson.dumps({"num1": 1, "num2": 4, "unknown": "c"}).decode(),
                    }
                ),
            )

    def test_whence(self) -> None:
        @typed_endpoint
        def whence_view(
            request: HttpRequest, *, param: Annotated[str, ApiParamConfig(whence="foo")]
        ) -> str:
            return param

        with self.assertRaisesMessage(RequestVariableMissingError, "Missing 'foo' argument"):
            call_endpoint(whence_view, HostRequestMock({"param": "hi"}))

        result = call_endpoint(whence_view, HostRequestMock({"foo": "hi"}))
        self.assertEqual(result, "hi")

    def test_argument_type(self) -> None:
        @typed_endpoint
        def webhook(
            request: HttpRequest,
            *,
            body: JsonBodyPayload[WildValue],
            non_body: Json[int] = 0,
        ) -> dict[str, object]:
            status = body["totame"]["status"].tame(check_bool)
            return {"status": status, "foo": non_body}

        # A normal request that uses a JSON encoded body
        request = HostRequestMock({"non_body": 15, "totame": {"status": True}})
        result = call_endpoint(webhook, request)
        self.assertDictEqual(result, {"status": True, "foo": 15})

        # Set the body manually so that we can pass in something unusual
        request = HostRequestMock()
        request._body = orjson.dumps([])
        with self.assertRaisesRegex(DjangoValidationError, "request is not a dict"):
            result = call_endpoint(webhook, request)

        # Test for the rare case when both body and GET are used
        request = HostRequestMock()
        request.GET.update({"non_body": "15"})
        request._body = orjson.dumps({"totame": {"status": True}})
        result = call_endpoint(webhook, request)
        self.assertDictEqual(result, {"status": True, "foo": 15})

        with self.assertRaisesMessage(JsonableError, "Malformed JSON"):
            request = HostRequestMock()
            request._body = b"{malformed_json"
            call_endpoint(webhook, request)

        with self.assertRaisesMessage(JsonableError, "Malformed payload"):
            request = HostRequestMock()
            # This body triggers UnicodeDecodeError
            request._body = b"\x81"
            call_endpoint(webhook, request)

    def test_path_only(self) -> None:
        @typed_endpoint
        def path_only(
            request: HttpRequest,
            *,
            path_var: PathOnly[int],
            other: Json[int],
        ) -> MutableJsonResponse:
            # Return a MutableJsonResponse to see parameters ignored
            return json_success(request, data={"val": path_var + other})

        response = call_endpoint(path_only, HostRequestMock(post_data={"other": 1}), path_var=20)
        self.assert_json_success(response)
        self.assertEqual(orjson.loads(response.content)["val"], 21)

        with self.assertRaisesMessage(
            AssertionError, "Path-only variable path_var should be passed already"
        ):
            call_endpoint(path_only, HostRequestMock(post_data={"other": 1}))

        # Even if the path-only variable is present in the request data, it
        # shouldn't be parsed either.
        with self.assertRaisesMessage(
            AssertionError, "Path-only variable path_var should be passed already"
        ):
            call_endpoint(path_only, HostRequestMock(post_data={"path_var": 15, "other": 1}))

        # path_var in the request body is ignored
        response = call_endpoint(
            path_only, HostRequestMock(post_data={"path_var": 15, "other": 1}), path_var=10
        )
        self.assert_json_success(response, ignored_parameters=["path_var"])
        self.assertEqual(orjson.loads(response.content)["val"], 11)

        def path_only_default(
            request: HttpRequest,
            *,
            path_var_default: PathOnly[str] = "test",
        ) -> None: ...

        with self.assertRaisesMessage(
            AssertionError, "Path-only parameter path_var_default should not have a default value"
        ):
            typed_endpoint(path_only_default)

    def test_documentation_status(self) -> None:
        def documentation(
            request: HttpRequest,
            *,
            foo: Annotated[
                str,
                ApiParamConfig(documentation_status=DocumentationStatus.INTENTIONALLY_UNDOCUMENTED),
            ],
            bar: Annotated[
                str, ApiParamConfig(documentation_status=DocumentationStatus.DOCUMENTATION_PENDING)
            ],
            baz: Annotated[
                str, ApiParamConfig(documentation_status=DocumentationStatus.DOCUMENTED)
            ],
            paz: PathOnly[int],
            other: str,
        ) -> None: ...

        from zerver.lib.request import arguments_map

        view_func_full_name = f"{documentation.__module__}.{documentation.__name__}"
        typed_endpoint(documentation)
        # Path-only and non DOCUMENTED parameters should not be added
        self.assertEqual(arguments_map[view_func_full_name], ["baz", "other"])

    def test_annotated(self) -> None:
        @typed_endpoint
        def valid_usage_of_api_param_config(
            request: HttpRequest,
            *,
            foo: Annotated[
                Json[int],
                ApiParamConfig(path_only=True),
            ],
        ) -> None: ...

        def annotated_with_repeated_api_param_config(
            request: HttpRequest,
            user_profile: UserProfile,
            *,
            foo: Annotated[Json[int], ApiParamConfig(), ApiParamConfig()],
        ) -> None: ...

        with self.assertRaisesMessage(
            AssertionError, "ApiParamConfig can only be defined once per parameter"
        ):
            typed_endpoint(annotated_with_repeated_api_param_config)

        @typed_endpoint
        def annotated_with_extra_unrelated_metadata(
            request: HttpRequest,
            user_profile: UserProfile,
            *,
            foo: Annotated[Json[bool], str, "unrelated"],
        ) -> bool:
            return foo

        hamlet = self.example_user("hamlet")
        result = call_endpoint(
            annotated_with_extra_unrelated_metadata,
            HostRequestMock({"foo": orjson.dumps(False).decode()}),
            hamlet,
        )
        self.assertFalse(result)

        # Not nesting the Annotated type with the ApiParamConfig inside Optional is fine
        @typed_endpoint
        def no_nesting(
            request: HttpRequest,
            *,
            bar: Annotated[
                str | None,
                StringConstraints(strip_whitespace=True, max_length=3),
                ApiParamConfig("test"),
            ] = None,
        ) -> None: ...

        with self.assertRaisesMessage(ApiParamValidationError, "test is too long"):
            call_endpoint(no_nesting, HostRequestMock({"test": "long"}))
        call_endpoint(no_nesting, HostRequestMock({"test": "lon"}))

        # Nesting Annotated with ApiParamConfig inside Optional is not fine
        def nesting_with_config(
            request: HttpRequest,
            *,
            invalid_param: Annotated[str, ApiParamConfig("test")] | None = None,
        ) -> None:
            raise AssertionError

        with self.assertRaisesRegex(
            AssertionError,
            "Detected incorrect usage of Annotated types for parameter invalid_param!",
        ):
            typed_endpoint(nesting_with_config)

        # Nesting Annotated inside Optional, when ApiParamConfig is not also nested is fine
        @typed_endpoint
        def nesting_without_config(
            request: HttpRequest,
            *,
            bar: Annotated[str, StringConstraints(max_length=3)] | None = None,
        ) -> None:
            raise AssertionError

        with self.assertRaisesMessage(ApiParamValidationError, "bar is too long"):
            call_endpoint(nesting_without_config, HostRequestMock({"bar": "long"}))

    def test_aliases(self) -> None:
        @typed_endpoint
        def view_with_aliased_parameter(
            request: HttpRequest, *, topic: Annotated[str, ApiParamConfig(aliases=["legacy_topic"])]
        ) -> HttpResponse:
            return json_success(request, {"value": topic})

        result = call_endpoint(
            view_with_aliased_parameter, HostRequestMock({"topic": "topic is topic"})
        )
        value = self.assert_json_success(result)["value"]
        self.assertEqual(value, "topic is topic")

        req = HostRequestMock({"topic": "topic is topic"})
        req.GET["legacy_topic"] = "topic is"
        with self.assertRaisesMessage(
            RequestConfusingParamsError, "Can't decide between 'topic' and 'legacy_topic' arguments"
        ):
            call_endpoint(view_with_aliased_parameter, req)

        with self.assertRaisesMessage(
            RequestConfusingParamsError, "Can't decide between 'topic' and 'legacy_topic' arguments"
        ):
            call_endpoint(
                view_with_aliased_parameter,
                HostRequestMock({"topic": "test", "legacy_topic": "test2"}),
            )

        result = call_endpoint(
            view_with_aliased_parameter, HostRequestMock({"legacy_topic": "legacy_topic is topic"})
        )
        value = self.assert_json_success(result)["value"]
        self.assertEqual(value, "legacy_topic is topic")

        result = call_endpoint(
            view_with_aliased_parameter,
            HostRequestMock(
                {"legacy_topic": "legacy_topic is topic", "ignored": "extra parameter"}
            ),
        )
        value = self.assert_json_success(result, ignored_parameters=["ignored"])["value"]
        self.assertEqual(value, "legacy_topic is topic")

        # aliases should work in combination with whence
        @typed_endpoint
        def view_with_aliased_and_whenced_parameter(
            request: HttpRequest,
            *,
            topic: Annotated[str, ApiParamConfig(whence="topic_name", aliases=["legacy_topic"])],
        ) -> HttpResponse:
            return json_success(request, {"value": topic})

        result = call_endpoint(
            view_with_aliased_and_whenced_parameter,
            HostRequestMock({"legacy_topic": "legacy_topic is topic", "topic": "extra parameter"}),
        )
        value = self.assert_json_success(result, ignored_parameters=["topic"])["value"]
        self.assertEqual(value, "legacy_topic is topic")

        with self.assertRaisesMessage(
            RequestConfusingParamsError,
            "Can't decide between 'topic_name' and 'legacy_topic' arguments",
        ):
            call_endpoint(
                view_with_aliased_and_whenced_parameter,
                HostRequestMock({"topic_name": "test", "legacy_topic": "test2"}),
            )

    def test_expect_no_parameters(self) -> None:
        def no_parameter(request: HttpRequest) -> None: ...

        def has_parameters(request: HttpRequest, *, foo: int, bar: str) -> None: ...

        with self.assertRaisesRegex(AssertionError, "there is no keyword-only parameter found"):
            typed_endpoint(no_parameter)
        # No assertion errors expected
        typed_endpoint(has_parameters)

        with self.assertRaisesMessage(AssertionError, "Unexpected keyword-only parameters found"):
            typed_endpoint_without_parameters(has_parameters)
        # No assertion errors expected
        typed_endpoint_without_parameters(no_parameter)

    def test_custom_validator(self) -> None:
        @dataclass
        class CustomType:
            val: int

        def validate_custom_type(
            value: object,
            handler: ModelWrapValidatorHandler[CustomType],
            info: ValidationInfo,
        ) -> CustomType:
            return CustomType(42)

        @typed_endpoint
        def test_view(
            request: HttpRequest, *, foo: Annotated[CustomType, WrapValidator(validate_custom_type)]
        ) -> None:
            self.assertEqual(foo.val, 42)

        call_endpoint(test_view, HostRequestMock({"foo": ""}))

    def test_json_optional(self) -> None:
        # Optional[Json[int]] does not allow client provided optional value at
        # all. The only possible way for val to be None is through the default
        # value (if it has one).
        @typed_endpoint
        def foo(request: HttpRequest, *, val: Json[int] | None) -> None: ...

        # Json[Optional[int]] however, allows client specified None value.
        @typed_endpoint
        def bar(request: HttpRequest, *, val: Json[int | None]) -> None: ...

        with self.assertRaisesMessage(ApiParamValidationError, "val is not an integer"):
            call_endpoint(foo, HostRequestMock({"val": orjson.dumps(None).decode()}))
        call_endpoint(bar, HostRequestMock({"val": orjson.dumps(None).decode()}))


class ValidationErrorHandlingTest(ZulipTestCase):
    def test_special_handling_errors(self) -> None:
        """Test for errors that require special handling beyond an ERROR_TEMPLATES lookup.
        Not all error types need to be tested here."""

        @dataclass
        class DataFoo:
            __pydantic_config__ = ConfigDict(extra="forbid")
            message: str

        class DataModel(BaseModel):
            model_config = ConfigDict(extra="forbid")
            message: str

        @dataclass
        class SubTest:
            """This describes a parameterized test case
            for our handling of Pydantic validation errors"""

            # The type of the error, can be found at
            # https://docs.pydantic.dev/latest/errors/validation_errors/
            error_type: str
            # The type of the parameter. We set on a view function decorated
            # with @typed_endpoint for a parameter named "input".
            param_type: object
            # Because QueryDict always converts the data into a str, this
            # conversion can be unexpected so we ask the caller to convert
            # input_data to str explicitly beforehand. The input data is
            # automatically set to POST["input"] in the mock request.
            input_data: str
            # The exact error message we expect from the ApiValidationError
            # raised when the view function is called with the provided input
            # data.
            error_message: str

            @override
            def __repr__(self) -> str:
                return f"Pydantic error type: {self.error_type}; Parameter type: {self.param_type}; Expected error message: {self.error_message}"

        parameterized_tests: list[SubTest] = [
            SubTest(
                error_type="string_too_short",
                param_type=Json[list[Annotated[str, RequiredStringConstraint()]]],
                input_data=orjson.dumps([""]).decode(),
                error_message="input[0] cannot be blank",
            ),
            SubTest(
                error_type="string_too_short",
                param_type=Json[list[Annotated[str, RequiredStringConstraint()]]],
                input_data=orjson.dumps(["g", "  "]).decode(),
                error_message="input[1] cannot be blank",
            ),
            SubTest(
                error_type="unexpected_keyword_argument",
                param_type=Json[DataFoo],
                input_data=orjson.dumps({"message": "asd", "test": ""}).decode(),
                error_message='Argument "test" at input["test"] is unexpected',
            ),
            SubTest(
                error_type="extra_forbidden",
                param_type=Json[DataModel],
                input_data=orjson.dumps({"message": "asd", "test": ""}).decode(),
                error_message='Argument "test" at input["test"] is unexpected',
            ),
        ]

        for index, subtest in enumerate(parameterized_tests):
            subtest_title = f"Subtest #{index + 1}: {subtest!r}"
            with self.subTest(subtest_title):
                # We use Any here so that we don't perform unnecessary type
                # checking.
                # Without this, mypy crashes with an internal error:
                # INTERNAL ERROR: maximum semantic analysis iteration count reached
                input_type: Any = subtest.param_type

                @typed_endpoint
                def func(request: HttpRequest, *, input: input_type) -> None: ...

                with self.assertRaises(ApiParamValidationError) as m:
                    call_endpoint(func, HostRequestMock({"input": subtest.input_data}))

                self.assertEqual(m.exception.msg, subtest.error_message)
                self.assertEqual(m.exception.error_type, subtest.error_type)

    def test_response(self) -> None:
        @typed_endpoint
        def view(request: HttpRequest, *, foo: Json[int]) -> MutableJsonResponse:
            return json_success(request, {"value": foo})

        response = call_endpoint(view, HostRequestMock({"foo": orjson.dumps(42).decode()}))
        for content in response:
            decoded_content = content.decode()
            self.assertIn("value", decoded_content)
            self.assertIn("success", decoded_content)
```

--------------------------------------------------------------------------------

---[FILE: test_typed_endpoint_validators.py]---
Location: zulip-main/zerver/tests/test_typed_endpoint_validators.py

```python
from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.typed_endpoint_validators import (
    check_int_in,
    check_string_in,
    check_url,
    to_non_negative_int_or_none,
)


class ValidatorTestCase(ZulipTestCase):
    def test_check_int_in(self) -> None:
        check_int_in(3, [1, 2, 3])
        with self.assertRaisesRegex(ValueError, "Not in the list of possible values"):
            check_int_in(3, [1, 2])

    def test_check_string_in(self) -> None:
        check_string_in("foo", ["foo", "bar"])
        with self.assertRaisesRegex(ValueError, "Not in the list of possible values"):
            check_string_in("foo", ["bar"])

    def test_check_url(self) -> None:
        check_url("https://example.com")
        with self.assertRaisesRegex(ValueError, "Not a URL"):
            check_url("https://127.0.0..:5000")

    def test_to_non_negative_int_or_none(self) -> None:
        self.assertEqual(to_non_negative_int_or_none("3"), 3)
        self.assertEqual(to_non_negative_int_or_none("-3"), None)
        self.assertEqual(to_non_negative_int_or_none("a"), None)
        self.assertEqual(to_non_negative_int_or_none("3.5"), None)
        self.assertEqual(to_non_negative_int_or_none("3.0"), None)
        self.assertEqual(to_non_negative_int_or_none("3.1"), None)
        self.assertEqual(to_non_negative_int_or_none("3.9"), None)
        self.assertEqual(to_non_negative_int_or_none("3.5"), None)
        self.assertEqual(to_non_negative_int_or_none("foo"), None)
```

--------------------------------------------------------------------------------

````
