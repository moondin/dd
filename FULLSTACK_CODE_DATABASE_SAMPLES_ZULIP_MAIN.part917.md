---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 917
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 917 of 1290)

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

---[FILE: validator.py]---
Location: zulip-main/zerver/lib/validator.py
Signals: Django, Pydantic

```python
"""
This module sets up a scheme for validating that arbitrary Python
objects are correctly typed.  It is totally decoupled from Django,
composable, easily wrapped, and easily extended.

A validator takes two parameters--var_name and val--and raises an
error if val is not the correct type.  The var_name parameter is used
to format error messages.  Validators return the validated value when
there are no errors.

Example primitive validators are check_string, check_int, and check_bool.

Compound validators are created by check_list and check_dict.  Note that
those functions aren't directly called for validation; instead, those
functions are called to return other functions that adhere to the validator
contract.  This is similar to how Python decorators are often parameterized.

The contract for check_list and check_dict is that they get passed in other
validators to apply to their items.  This allows you to build up validators
for arbitrarily complex validators.  See ValidatorTestCase for example usage.

A simple example of composition is this:

   check_list(check_string)('my_list', ['a', 'b', 'c'])

To extend this concept, it's simply a matter of writing your own validator
for any particular type of object.

"""

from collections.abc import Collection, Container, Iterator
from dataclasses import dataclass
from datetime import date
from typing import Any, NoReturn, TypeVar, cast, overload

import orjson
from django.core.exceptions import ValidationError
from django.core.validators import URLValidator, validate_email
from django.utils.translation import gettext as _
from pydantic import ValidationInfo, model_validator
from pydantic.functional_validators import ModelWrapValidatorHandler
from typing_extensions import override

from zerver.lib.exceptions import InvalidJSONError, JsonableError
from zerver.lib.types import ProfileFieldData, Validator

ResultT = TypeVar("ResultT")


def check_anything(var_name: str, val: object) -> object:
    return val


def check_string(var_name: str, val: object) -> str:
    if not isinstance(val, str):
        raise ValidationError(_("{var_name} is not a string").format(var_name=var_name))
    return val


def check_required_string(var_name: str, val: object) -> str:
    s = check_string(var_name, val)
    if not s.strip():
        raise ValidationError(_("{item} cannot be blank.").format(item=var_name))
    return s


def check_string_in(possible_values: Container[str]) -> Validator[str]:
    def validator(var_name: str, val: object) -> str:
        s = check_string(var_name, val)
        if s not in possible_values:
            raise ValidationError(_("Invalid {var_name}").format(var_name=var_name))
        return s

    return validator


def check_short_string(var_name: str, val: object) -> str:
    return check_capped_string(50)(var_name, val)


def check_capped_string(max_length: int) -> Validator[str]:
    def validator(var_name: str, val: object) -> str:
        s = check_string(var_name, val)
        if len(s) > max_length:
            raise ValidationError(
                _("{var_name} is too long (limit: {max_length} characters)").format(
                    var_name=var_name,
                    max_length=max_length,
                )
            )
        return s

    return validator


def check_string_fixed_length(length: int) -> Validator[str]:
    def validator(var_name: str, val: object) -> str:
        s = check_string(var_name, val)
        if len(s) != length:
            raise ValidationError(
                _("{var_name} has incorrect length {length}; should be {target_length}").format(
                    var_name=var_name,
                    target_length=length,
                    length=len(s),
                )
            )
        return s

    return validator


def check_long_string(var_name: str, val: object) -> str:
    return check_capped_string(500)(var_name, val)


def check_date(var_name: str, val: object) -> str:
    if not isinstance(val, str):
        raise ValidationError(_("{var_name} is not a string").format(var_name=var_name))
    try:
        if date.fromisoformat(val).isoformat() != val:
            raise ValidationError(_("{var_name} is not a date").format(var_name=var_name))
    except ValueError:
        raise ValidationError(_("{var_name} is not a date").format(var_name=var_name))
    return val


def check_int(var_name: str, val: object) -> int:
    if not isinstance(val, int):
        raise ValidationError(_("{var_name} is not an integer").format(var_name=var_name))
    return val


def check_int_in(possible_values: list[int]) -> Validator[int]:
    """
    Assert that the input is an integer and is contained in `possible_values`. If the input is not in
    `possible_values`, a `ValidationError` is raised containing the failing field's name.
    """

    def validator(var_name: str, val: object) -> int:
        n = check_int(var_name, val)
        if n not in possible_values:
            raise ValidationError(_("Invalid {var_name}").format(var_name=var_name))
        return n

    return validator


def check_int_range(low: int, high: int) -> Validator[int]:
    # low and high are both treated as valid values
    def validator(var_name: str, val: object) -> int:
        n = check_int(var_name, val)
        if n < low:
            raise ValidationError(_("{var_name} is too small").format(var_name=var_name))
        if n > high:
            raise ValidationError(_("{var_name} is too large").format(var_name=var_name))
        return n

    return validator


def check_float(var_name: str, val: object) -> float:
    if not isinstance(val, float):
        raise ValidationError(_("{var_name} is not a float").format(var_name=var_name))
    return val


def check_bool(var_name: str, val: object) -> bool:
    if not isinstance(val, bool):
        raise ValidationError(_("{var_name} is not a boolean").format(var_name=var_name))
    return val


def check_none_or(sub_validator: Validator[ResultT]) -> Validator[ResultT | None]:
    def f(var_name: str, val: object) -> ResultT | None:
        if val is None:
            return val
        else:
            return sub_validator(var_name, val)

    return f


def check_list(
    sub_validator: Validator[ResultT], length: int | None = None
) -> Validator[list[ResultT]]:
    def f(var_name: str, val: object) -> list[ResultT]:
        if not isinstance(val, list):
            raise ValidationError(_("{var_name} is not a list").format(var_name=var_name))

        if length is not None and length != len(val):
            raise ValidationError(
                _("{container} should have exactly {length} items").format(
                    container=var_name,
                    length=length,
                )
            )

        for i, item in enumerate(val):
            vname = f"{var_name}[{i}]"
            valid_item = sub_validator(vname, item)
            assert item is valid_item  # To justify the unchecked cast below

        return cast(list[ResultT], val)

    return f


# https://zulip.readthedocs.io/en/latest/testing/mypy.html#using-overload-to-accurately-describe-variations
@overload
def check_dict(
    required_keys: Collection[tuple[str, Validator[object]]] = [],
    optional_keys: Collection[tuple[str, Validator[object]]] = [],
    *,
    _allow_only_listed_keys: bool = False,
) -> Validator[dict[str, object]]: ...
@overload
def check_dict(
    required_keys: Collection[tuple[str, Validator[ResultT]]] = [],
    optional_keys: Collection[tuple[str, Validator[ResultT]]] = [],
    *,
    value_validator: Validator[ResultT],
    _allow_only_listed_keys: bool = False,
) -> Validator[dict[str, ResultT]]: ...
def check_dict(
    required_keys: Collection[tuple[str, Validator[ResultT]]] = [],
    optional_keys: Collection[tuple[str, Validator[ResultT]]] = [],
    *,
    value_validator: Validator[ResultT] | None = None,
    _allow_only_listed_keys: bool = False,
) -> Validator[dict[str, ResultT]]:
    def f(var_name: str, val: object) -> dict[str, ResultT]:
        if not isinstance(val, dict):
            raise ValidationError(_("{var_name} is not a dict").format(var_name=var_name))

        for k in val:
            check_string(f"{var_name} key", k)

        for k, sub_validator in required_keys:
            if k not in val:
                raise ValidationError(
                    _("{key_name} key is missing from {var_name}").format(
                        key_name=k,
                        var_name=var_name,
                    )
                )
            vname = f'{var_name}["{k}"]'
            sub_validator(vname, val[k])

        for k, sub_validator in optional_keys:
            if k in val:
                vname = f'{var_name}["{k}"]'
                sub_validator(vname, val[k])

        if value_validator:
            for key in val:
                vname = f"{var_name} contains a value that"
                valid_value = value_validator(vname, val[key])
                assert val[key] is valid_value  # To justify the unchecked cast below

        if _allow_only_listed_keys:
            required_keys_set = {x[0] for x in required_keys}
            optional_keys_set = {x[0] for x in optional_keys}
            delta_keys = set(val.keys()) - required_keys_set - optional_keys_set
            if len(delta_keys) != 0:
                raise ValidationError(
                    _("Unexpected arguments: {keys}").format(keys=", ".join(delta_keys))
                )

        return cast(dict[str, ResultT], val)

    return f


def check_dict_only(
    required_keys: Collection[tuple[str, Validator[ResultT]]],
    optional_keys: Collection[tuple[str, Validator[ResultT]]] = [],
) -> Validator[dict[str, ResultT]]:
    return cast(
        Validator[dict[str, ResultT]],
        check_dict(required_keys, optional_keys, _allow_only_listed_keys=True),
    )


def check_union(allowed_type_funcs: Collection[Validator[ResultT]]) -> Validator[ResultT]:
    """
    Use this validator if an argument is of a variable type (e.g. processing
    properties that might be strings or booleans).

    `allowed_type_funcs`: the check_* validator functions for the possible data
    types for this variable.
    """

    def enumerated_type_check(var_name: str, val: object) -> ResultT:
        for func in allowed_type_funcs:
            try:
                return func(var_name, val)
            except ValidationError:
                pass
        raise ValidationError(_("{var_name} is not an allowed_type").format(var_name=var_name))

    return enumerated_type_check


def equals(expected_val: ResultT) -> Validator[ResultT]:
    def f(var_name: str, val: object) -> ResultT:
        if val != expected_val:
            raise ValidationError(
                _("{variable} != {expected_value} ({value} is wrong)").format(
                    variable=var_name,
                    expected_value=expected_val,
                    value=val,
                )
            )
        return cast(ResultT, val)

    return f


def validate_login_email(email: str) -> None:
    try:
        validate_email(email)
    except ValidationError as err:
        raise JsonableError(str(err.message))


def check_url(var_name: str, val: object) -> str:
    # First, ensure val is a string
    s = check_string(var_name, val)
    # Now, validate as URL
    validate = URLValidator()
    try:
        validate(s)
        return s
    except ValidationError:
        raise ValidationError(_("{var_name} is not a URL").format(var_name=var_name))


def check_capped_url(max_length: int) -> Validator[str]:
    def validator(var_name: str, val: object) -> str:
        # Ensure val is a string and length of the string does not
        # exceed max_length.
        s = check_capped_string(max_length)(var_name, val)
        # Validate as URL.
        validate = URLValidator()
        try:
            validate(s)
            return s
        except ValidationError:
            raise ValidationError(_("{var_name} is not a URL").format(var_name=var_name))

    return validator


def check_external_account_url_pattern(var_name: str, val: object) -> str:
    s = check_string(var_name, val)

    if s.count("%(username)s") != 1:
        raise ValidationError(_("URL pattern must contain '%(username)s'."))
    url_val = s.replace("%(username)s", "username")

    check_url(var_name, url_val)
    return s


def validate_select_field_data(field_data: ProfileFieldData) -> dict[str, dict[str, str]]:
    """
    This function is used to validate the data sent to the server while
    creating/editing choices of the choice field in Organization settings.
    """
    validator = check_dict_only(
        [
            ("text", check_required_string),
            ("order", check_required_string),
        ]
    )

    # To create an array of texts of each option
    distinct_field_names: set[str] = set()

    for key, value in field_data.items():
        if not key.strip():
            raise ValidationError(_("'{item}' cannot be blank.").format(item="value"))

        valid_value = validator("field_data", value)
        assert value is valid_value  # To justify the unchecked cast below

        distinct_field_names.add(valid_value["text"])

    # To show error if the options are duplicate
    if len(field_data) != len(distinct_field_names):
        raise ValidationError(_("Field must not have duplicate choices."))

    return cast(dict[str, dict[str, str]], field_data)


def validate_select_field(var_name: str, field_data: str, value: object) -> str:
    """
    This function is used to validate the value selected by the user against a
    choice field. This is not used to validate admin data.
    """
    s = check_string(var_name, value)
    field_data_dict = orjson.loads(field_data)
    if s not in field_data_dict:
        msg = _("'{value}' is not a valid choice for '{field_name}'.")
        raise ValidationError(msg.format(value=value, field_name=var_name))
    return s


def check_widget_content(widget_content: object) -> dict[str, Any]:
    if not isinstance(widget_content, dict):
        raise ValidationError("widget_content is not a dict")

    if "widget_type" not in widget_content:
        raise ValidationError("widget_type is not in widget_content")

    if "extra_data" not in widget_content:
        raise ValidationError("extra_data is not in widget_content")

    widget_type = widget_content["widget_type"]
    extra_data = widget_content["extra_data"]

    if not isinstance(extra_data, dict):
        raise ValidationError("extra_data is not a dict")

    if widget_type == "zform":
        if "type" not in extra_data:
            raise ValidationError("zform is missing type field")

        if extra_data["type"] == "choices":
            check_choices = check_list(
                check_dict(
                    [
                        ("short_name", check_string),
                        ("long_name", check_string),
                        ("reply", check_string),
                    ]
                ),
            )

            # We re-check "type" here just to avoid it looking
            # like we have extraneous keys.
            checker = check_dict(
                [
                    ("type", equals("choices")),
                    ("heading", check_string),
                    ("choices", check_choices),
                ]
            )

            checker("extra_data", extra_data)

            return widget_content

        raise ValidationError("unknown zform type: " + extra_data["type"])

    raise ValidationError("unknown widget type: " + widget_type)


# This should match MAX_IDX in our client widgets. It is somewhat arbitrary.
MAX_IDX = 1000


def validate_poll_data(poll_data: object, is_widget_author: bool) -> None:
    check_dict([("type", check_string)])("poll data", poll_data)

    assert isinstance(poll_data, dict)

    if poll_data["type"] == "vote":
        checker = check_dict_only(
            [
                ("type", check_string),
                ("key", check_string),
                ("vote", check_int_in([1, -1])),
            ]
        )
        checker("poll data", poll_data)
        return

    if poll_data["type"] == "question":
        if not is_widget_author:
            raise ValidationError("You can't edit a question unless you are the author.")

        checker = check_dict_only(
            [
                ("type", check_string),
                ("question", check_string),
            ]
        )
        checker("poll data", poll_data)
        return

    if poll_data["type"] == "new_option":
        checker = check_dict_only(
            [
                ("type", check_string),
                ("option", check_string),
                ("idx", check_int_range(0, MAX_IDX)),
            ]
        )
        checker("poll data", poll_data)
        return

    raise ValidationError(f"Unknown type for poll data: {poll_data['type']}")


def validate_todo_data(todo_data: object, is_widget_author: bool) -> None:
    check_dict([("type", check_string)])("todo data", todo_data)

    assert isinstance(todo_data, dict)

    if todo_data["type"] == "new_task":
        checker = check_dict_only(
            [
                ("type", check_string),
                ("key", check_int_range(0, MAX_IDX)),
                ("task", check_string),
                ("desc", check_string),
                ("completed", check_bool),
            ]
        )
        checker("todo data", todo_data)
        return

    if todo_data["type"] == "strike":
        checker = check_dict_only(
            [
                ("type", check_string),
                ("key", check_string),
            ]
        )
        checker("todo data", todo_data)
        return

    if todo_data["type"] == "new_task_list_title":
        if not is_widget_author:
            raise ValidationError("You can't edit the task list title unless you are the author.")

        checker = check_dict_only(
            [
                ("type", check_string),
                ("title", check_string),
            ]
        )
        checker("todo data", todo_data)
        return

    raise ValidationError(f"Unknown type for todo data: {todo_data['type']}")


def check_string_or_int_list(var_name: str, val: object) -> str | list[int]:
    if isinstance(val, str):
        return val

    if not isinstance(val, list):
        raise ValidationError(
            _("{var_name} is not a string or an integer list").format(var_name=var_name)
        )

    return check_list(check_int)(var_name, val)


def check_string_or_int(var_name: str, val: object) -> str | int:
    if isinstance(val, str | int):
        return val

    raise ValidationError(_("{var_name} is not a string or integer").format(var_name=var_name))


@dataclass(eq=False)
class WildValue:  # noqa: PLW1641
    var_name: str
    value: object

    @model_validator(mode="wrap")
    @classmethod
    def to_wild_value(
        cls,
        value: object,
        # We bypass the original WildValue handler to customize it
        handler: ModelWrapValidatorHandler["WildValue"],
        info: ValidationInfo,
    ) -> "WildValue":
        return wrap_wild_value("request", value)

    def __bool__(self) -> bool:
        return bool(self.value)

    @override
    def __eq__(self, other: object) -> bool:
        raise TypeError("cannot compare WildValue")

    def __len__(self) -> int:
        if not isinstance(self.value, dict | list | str):
            raise ValidationError(
                _("{var_name} does not have a length").format(var_name=self.var_name)
            )
        return len(self.value)

    @override
    def __str__(self) -> NoReturn:
        raise TypeError("cannot convert WildValue to string; try .tame(check_string)")

    def _need_list(self) -> NoReturn:
        raise ValidationError(_("{var_name} is not a list").format(var_name=self.var_name))

    def _need_dict(self) -> NoReturn:
        raise ValidationError(_("{var_name} is not a dict").format(var_name=self.var_name))

    def __iter__(self) -> Iterator["WildValue"]:
        self._need_list()

    def __contains__(self, key: str) -> bool:
        self._need_dict()

    def __getitem__(self, key: int | str) -> "WildValue":
        if isinstance(key, int):
            self._need_list()
        else:
            self._need_dict()

    def get(self, key: str, default: object = None) -> "WildValue":
        self._need_dict()

    def keys(self) -> Iterator[str]:
        self._need_dict()

    def values(self) -> Iterator["WildValue"]:
        self._need_dict()

    def items(self) -> Iterator[tuple[str, "WildValue"]]:
        self._need_dict()

    def tame(self, validator: Validator[ResultT]) -> ResultT:
        return validator(self.var_name, self.value)


class WildValueList(WildValue):
    value: list[object]

    @override
    def __iter__(self) -> Iterator[WildValue]:
        for i, item in enumerate(self.value):
            yield wrap_wild_value(f"{self.var_name}[{i}]", item)

    @override
    def __getitem__(self, key: int | str) -> WildValue:
        if not isinstance(key, int):
            return super().__getitem__(key)

        var_name = f"{self.var_name}[{key!r}]"

        try:
            item = self.value[key]
        except IndexError:
            raise ValidationError(_("{var_name} is missing").format(var_name=var_name)) from None

        return wrap_wild_value(var_name, item)


class WildValueDict(WildValue):
    value: dict[str, object]

    @override
    def __contains__(self, key: str) -> bool:
        return key in self.value

    @override
    def __getitem__(self, key: int | str) -> WildValue:
        if not isinstance(key, str):
            return super().__getitem__(key)

        var_name = f"{self.var_name}[{key!r}]"

        try:
            item = self.value[key]
        except KeyError:
            raise ValidationError(_("{var_name} is missing").format(var_name=var_name)) from None

        return wrap_wild_value(var_name, item)

    @override
    def get(self, key: str, default: object = None) -> WildValue:
        item = self.value.get(key, default)
        if isinstance(item, WildValue):
            return item
        return wrap_wild_value(f"{self.var_name}[{key!r}]", item)

    @override
    def keys(self) -> Iterator[str]:
        yield from self.value.keys()

    @override
    def values(self) -> Iterator[WildValue]:
        for key, value in self.value.items():
            yield wrap_wild_value(f"{self.var_name}[{key!r}]", value)

    @override
    def items(self) -> Iterator[tuple[str, WildValue]]:
        for key, value in self.value.items():
            yield key, wrap_wild_value(f"{self.var_name}[{key!r}]", value)


def wrap_wild_value(var_name: str, value: object) -> WildValue:
    if isinstance(value, list):
        return WildValueList(var_name, value)
    if isinstance(value, dict):
        return WildValueDict(var_name, value)
    return WildValue(var_name, value)


def to_wild_value(var_name: str, input: str) -> WildValue:
    try:
        value = orjson.loads(input)
    except orjson.JSONDecodeError:
        raise InvalidJSONError(_("Malformed JSON"))

    return wrap_wild_value(var_name, value)
```

--------------------------------------------------------------------------------

---[FILE: widget.py]---
Location: zulip-main/zerver/lib/widget.py

```python
import json
import re
from typing import Any

from zerver.lib.message import SendMessageRequest
from zerver.models import Message, SubMessage


def get_widget_data(content: str) -> tuple[str | None, Any]:
    valid_widget_types = ["poll", "todo"]
    tokens = re.split(r"\s+|\n+", content)

    # tokens[0] will always exist
    if tokens[0].startswith("/"):
        widget_type = tokens[0].removeprefix("/")
        if widget_type in valid_widget_types:
            remaining_content = content.replace(tokens[0], "", 1)
            extra_data = get_extra_data_from_widget_type(remaining_content, widget_type)
            return widget_type, extra_data

    return None, None


def parse_poll_extra_data(content: str) -> Any:
    # This is used to extract the question from the poll command.
    # The command '/poll question' will pre-set the question in the poll
    lines = content.splitlines()
    question = ""
    options = []
    if lines and lines[0]:
        question = lines.pop(0).strip()
    for line in lines:
        # If someone is using the list syntax, we remove it
        # before adding an option.
        option = re.sub(r"(\s*[-*]?\s*)", "", line.strip(), count=1)
        if len(option) > 0:
            options.append(option)
    extra_data = {
        "question": question,
        "options": options,
    }
    return extra_data


def parse_todo_extra_data(content: str) -> Any:
    # This is used to extract the task list title from the todo command.
    # The command '/todo Title' will pre-set the task list title
    lines = content.splitlines()
    task_list_title = ""
    if lines and lines[0]:
        task_list_title = lines.pop(0).strip()
    tasks = []
    for line in lines:
        # If someone is using the list syntax, we remove it
        # before adding a task.
        task_data = re.sub(r"(\s*[-*]?\s*)", "", line.strip(), count=1)
        if len(task_data) > 0:
            # a task and its description (optional) are separated
            # by the (first) `: ` substring
            task_data_array = task_data.split(": ", 1)
            tasks.append(
                {
                    "task": task_data_array[0].strip(),
                    "desc": task_data_array[1].strip() if len(task_data_array) > 1 else "",
                }
            )
    extra_data = {
        "task_list_title": task_list_title,
        "tasks": tasks,
    }
    return extra_data


def get_extra_data_from_widget_type(content: str, widget_type: str | None) -> Any:
    if widget_type == "poll":
        return parse_poll_extra_data(content)
    else:
        return parse_todo_extra_data(content)


def do_widget_post_save_actions(send_request: SendMessageRequest) -> None:
    """
    This code works with the web app; mobile and other
    clients should also start supporting this soon.
    """
    message_content = send_request.message.content
    sender_id = send_request.message.sender_id
    message_id = send_request.message.id

    widget_type = None
    extra_data = None

    widget_type, extra_data = get_widget_data(message_content)
    widget_content = send_request.widget_content
    if widget_content is not None:
        # Note that we validate this data in check_message,
        # so we can trust it here.
        widget_type = widget_content["widget_type"]
        extra_data = widget_content["extra_data"]

    if widget_type:
        content = dict(
            widget_type=widget_type,
            extra_data=extra_data,
        )
        submessage = SubMessage(
            sender_id=sender_id,
            message_id=message_id,
            msg_type="widget",
            content=json.dumps(content),
        )
        submessage.save()
        send_request.submessages = SubMessage.get_raw_db_rows([message_id])


def get_widget_type(*, message_id: int) -> str | None:
    submessage = (
        SubMessage.objects.filter(
            message_id=message_id,
            msg_type="widget",
        )
        .only("content")
        .first()
    )

    if submessage is None:
        return None

    try:
        data = json.loads(submessage.content)
    except Exception:
        return None

    try:
        return data["widget_type"]
    except Exception:
        return None


def is_widget_message(message: Message) -> bool:
    # Right now all messages that are widgetized use submessage, and vice versa.
    return message.submessage_set.exists()
```

--------------------------------------------------------------------------------

---[FILE: zcommand.py]---
Location: zulip-main/zerver/lib/zcommand.py
Signals: Django

```python
from typing import Any

from django.utils.translation import gettext as _

from zerver.actions.user_settings import do_change_user_setting
from zerver.lib.exceptions import JsonableError
from zerver.models import UserProfile


def process_zcommands(content: str, user_profile: UserProfile) -> dict[str, Any]:
    def change_mode_setting(
        setting_name: str, switch_command: str, setting: str, setting_value: int
    ) -> str:
        msg = f"Changed to {setting_name}! To revert {setting_name}, type `/{switch_command}`."
        do_change_user_setting(
            user_profile=user_profile,
            setting_name=setting,
            setting_value=setting_value,
            acting_user=user_profile,
        )
        return msg

    if not content.startswith("/"):
        raise JsonableError(_("There should be a leading slash in the zcommand."))
    command = content.removeprefix("/")

    if command == "ping":
        return {}
    elif command == "dark":
        if user_profile.color_scheme == UserProfile.COLOR_SCHEME_DARK:
            return dict(msg="You are still in dark theme.")
        return dict(
            msg=change_mode_setting(
                setting_name="dark theme",
                switch_command="light",
                setting="color_scheme",
                setting_value=UserProfile.COLOR_SCHEME_DARK,
            )
        )
    elif command == "light":
        if user_profile.color_scheme == UserProfile.COLOR_SCHEME_LIGHT:
            return dict(msg="You are still in light theme.")
        return dict(
            msg=change_mode_setting(
                setting_name="light theme",
                switch_command="dark",
                setting="color_scheme",
                setting_value=UserProfile.COLOR_SCHEME_LIGHT,
            )
        )
    elif command == "fluid-width":
        if user_profile.fluid_layout_width:
            return dict(msg="You are still in fluid width mode.")
        return dict(
            msg=change_mode_setting(
                setting_name="fluid-width mode",
                switch_command="fixed-width",
                setting="fluid_layout_width",
                setting_value=True,
            )
        )
    elif command == "fixed-width":
        if not user_profile.fluid_layout_width:
            return dict(msg="You are still in fixed width mode.")
        return dict(
            msg=change_mode_setting(
                setting_name="fixed-width mode",
                switch_command="fluid-width",
                setting="fluid_layout_width",
                setting_value=False,
            )
        )
    raise JsonableError(_("No such command: {command}").format(command=command))
```

--------------------------------------------------------------------------------

---[FILE: zstd_level9.py]---
Location: zulip-main/zerver/lib/zstd_level9.py

```python
from zstd import compress as original_compress
from zstd import decompress

__all__ = ["compress", "decompress"]


def compress(data: bytes, level: int | None = None) -> bytes:
    if level is None:
        level = 9
    return original_compress(data, level)
```

--------------------------------------------------------------------------------

````
