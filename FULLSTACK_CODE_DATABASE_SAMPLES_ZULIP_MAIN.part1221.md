---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1221
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1221 of 1290)

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

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/jotform/view.py
Signals: Django

```python
# Webhooks for external integrations.

import json
from typing import Any
from urllib.parse import unquote

from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _

from zerver.decorator import webhook_view
from zerver.lib.exceptions import JsonableError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint_without_parameters
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile


def format_uploaded_file_links(file_question_value: str, file_url_mappings: dict[str, str]) -> str:
    words = file_question_value.split()
    url_markdown_list = []
    current_file_name_words = []
    for word in words:
        current_file_name_words.append(word)

        # Greedy approach to find the filenames in file_url_mappings.
        potential_file_name = " ".join(current_file_name_words)
        if potential_file_name in file_url_mappings:
            file_url = file_url_mappings.get(potential_file_name)
            url_markdown_list.append(f"[{potential_file_name}]({file_url})")
            current_file_name_words = []

    return ", ".join(url_markdown_list)


def is_non_file_upload_question_with_response(field: str, raw_request: dict[str, Any]) -> bool:
    """
    File upload questions are in raw_request["temp_upload"].
    So, the other questions are the keys in raw_request starting
    with "q". We exclude any questions with a zero length value,
    because they are not in the "pretty" data of the payload.
    """
    field_value = raw_request.get(field)
    return bool(
        field
        and field[0] == "q"
        and field_value
        and (
            isinstance(field_value, str)
            or (
                isinstance(field_value, dict)
                # Non-empty Appointment, Date fields
                and "" not in field_value.values()
                # Non-empty Input Table field
                and not (
                    len(field_value) == 2 and "colIds" in field_value and "rowIds" in field_value
                )
            )
            # Multiple choice questions
            or isinstance(field_value, list)
        )
    )


def format_value(value: str | list[str] | dict[str, str]) -> str:
    if isinstance(value, str):
        return value
    elif isinstance(value, list):
        return " ".join(value)

    return " ".join(value.values())


def get_pretty_fields(pretty: str, values: list[str]) -> list[tuple[str, str]]:
    """
    The format of "pretty" data in the payload is "key1:value1, key2:value2, ..."
    The parameter "values" contains all substrings that appear as values
    in the pretty data. Extracts each key-value pair by locating the position
    of each value in the string and separating the corresponding key and value,
    by tracking the starting position of the next key-value pair.
    This approach is necessary because keys and values may contain colons
    or commas, making it unreliable to simply split the string using ', '.

    Returns a list of (key, value) pairs to preserve order and allow duplicate keys.
    """

    pretty_fields = []
    pair_starting_index = 0

    for value in values:
        value_length = len(value)
        possible_match_index = pretty.find(value + ":", pair_starting_index)

        # If the current pair starts with a key that is equal to the value
        if possible_match_index == pair_starting_index:
            key = value
            val = value

            # 3 characters for colon, comma and space.
            pair_starting_index += 2 * value_length + 3
        else:
            value_occurrence_index = pretty.find(value, pair_starting_index)
            value_ending_index = value_occurrence_index + value_length

            # -1 for colon, separating key and value
            key = pretty[pair_starting_index : value_occurrence_index - 1]
            val = pretty[value_occurrence_index:value_ending_index]

            # 2 characters for comma and space, which separate the fields
            pair_starting_index = value_ending_index + 2

        pretty_fields.append((key, val))

    return pretty_fields


@webhook_view("Jotform")
@typed_endpoint_without_parameters
def api_jotform_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
) -> HttpResponse:
    payload = request.POST
    topic_name = payload.get("formTitle")

    raw_request = json.loads(payload.get("rawRequest", "{}"))
    non_file_upload_values_in_pretty_data = [
        format_value(value)
        for field, value in raw_request.items()
        if is_non_file_upload_question_with_response(field, raw_request)
    ]

    url_mappings = {}
    file_values_in_pretty_data = []
    if raw_request.get("temp_upload"):
        upload_keys = raw_request.get("temp_upload").keys()
        file_questions_keys = [key.split("_", 1)[-1] for key in upload_keys]
        file_values_in_pretty_data = [
            " ".join(unquote(url.split("/")[-1]) for url in raw_request.get(key, []))
            for key in file_questions_keys
        ]
        url_mappings = {
            unquote(url.split("/")[-1]): url
            for key in file_questions_keys
            for url in raw_request.get(key, [])
        }

    # Non file values come earlier than file values in the "pretty" data of the payload.
    pretty_values = non_file_upload_values_in_pretty_data + list(file_values_in_pretty_data)
    pretty_fields = get_pretty_fields(payload.get("pretty", ""), pretty_values)

    if not topic_name or not pretty_fields:
        raise JsonableError(_("Unable to handle Jotform payload"))

    form_response = ""
    for index, (label, value) in enumerate(pretty_fields):
        separator = " " if label.endswith("?") else ": "

        # File upload fields are last in the "pretty" payload data.
        if index >= len(non_file_upload_values_in_pretty_data):
            value = format_uploaded_file_links(value, url_mappings)
            # We add a new line so that image files are rendered
            # correctly in the message.
            form_response += "\n"
        form_response += f"* **{label}**{separator}{value}\n"

    message = form_response.strip()

    check_send_webhook_message(request, user_profile, topic_name, message)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: response.multipart]---
Location: zulip-main/zerver/webhooks/jotform/fixtures/response.multipart

```text
--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="action"


--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="webhookURL"

https://3a95-27-5-198-172.ngrok-free.app/api/v1/external/jotform?api_key=DhXGrkyy2bK2SXMQMXwhs95H4kVVwv2w
--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="username"

UserNiloth
--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="formID"

243231271343446
--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="type"

WEB
--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="customParams"


--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="product"


--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="formTitle"

Tutor Appointment Form
--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="customTitle"


--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="submissionID"

6084250982513018472
--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="event"


--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="documentID"


--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="teamID"


--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="subject"


--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="isSilent"


--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="customBody"


--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="rawRequest"

{"slug":"submit\/243231271343446","jsExecutionTracker":"build-date-1732271172685=>init-started:1732615894703=>validator-called:1732615894706=>validator-mounted-false:1732615894706=>init-complete:1732615894707=>onsubmit-fired:1732615897940=>observerSubmitHandler_received-submit-event:1732615897941=>submit-validation-passed:1732615897942=>observerSubmitHandler_validation-passed-submitting-form:1732615897944","submitSource":"form","buildDate":"1732271172685","uploadServerUrl":"https:\/\/upload.jotform.com\/upload","eventObserver":"1","q3_studentsName":{"first":"Niloth","last":"P"},"q33_typeOf":"Online Tutoring","q34_subjectFor":"Math","q35_grade":"12","q27_priorTutoring":"No","q28_appointment":{"implementation":"new","date":"","duration":"60","timezone":"Asia\/Calcutta (GMT+06:30)"},"q15_date":{"month":"","day":"","year":""},"q19_table":{"colIds":"[\"0\",\"1\",\"2\",\"3\"]","rowIds":"[\"0\",\"1\",\"2\",\"3\"]"},"timeToSubmit":"3","temp_upload":{"q5_identityProof":["Student_ID_!#$&'()*+,-.;=@[]^_`{}~ .png#jotformfs-e4f4ece4d0a90#01940839-37f4-7a46-9b4e-71107f08774a", "Driving.license.png#jotformfs-e4f4ece4d0a90#01940839-37f4-7a46-9b4e-71107f08774a"], "q6_reports":["Report Card.pdf#jotformfs-e4f4ece4d0a90#01940839-37f4-7a46-9b4e-71107f08774a"]},"file_server":"jotforms-e4f4ece4d0a90#01940839-37f4-7a46-9b4e-71107f08774a","preview":"true","validatedNewRequiredFieldIDs":"{\"new\":1}","path":"\/submit\/243231271343446","q7_description":"","identityProof":["https:\/\/www.jotform.com\/uploads\/UserNiloth\/243231271343446\/6111139644845227683\/Student_ID_%21_%24%26%27%28%29_%2C-.%3B%3D%40%5B%5D%5E_%60%7B%7D~%20.png","https:\/\/www.jotform.com\/uploads\/UserNiloth\/243231271343446\/6111139644845227684\/Driving.license.png"],"reports":["https:\/\/www.jotform.com\/uploads\/UserNiloth\/243231271343446\/6111139644845227685\/Report%20Card.pdf"]}
--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="fromTable"


--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="appID"


--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="pretty"

Student's Name:Niloth P, Type of Tutoring:Online Tutoring, Subject for Tutoring:Math, Grade:12, Prior Tutoring?:No, Identity Proof:Student_ID_!_$&'()_,-.;=@[]^_`{}~ .png Driving.license.png, Reports:Report Card.pdf
--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="unread"


--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="parent"


--------------------------J1JNT4vbVO4FCC1qLG4HSv
Content-Disposition: form-data; name="ip"

27.51.18.17
--------------------------J1JNT4vbVO4FCC1qLG4HSv--
```

--------------------------------------------------------------------------------

---[FILE: response_with_colon_comma_characters.multipart]---
Location: zulip-main/zerver/webhooks/jotform/fixtures/response_with_colon_comma_characters.multipart

```text
--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="action"


--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="webhookURL"

https://a395-103-151-209-147.ngrok-free.app/api/v1/external/jotform?api_key=6SuIPsdyiL6Bgljov4wp67wD4rqHRWOg&stream=15&topic=jotform
--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="username"

kolanuvarun739
--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="formID"

243490908500051
--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="type"

WEB
--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="customParams"


--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="product"


--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="formTitle"

Sample testing
--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="customTitle"


--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="submissionID"

6197916587414311452
--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="event"


--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="documentID"


--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="teamID"


--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="subject"


--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="isSilent"


--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="customBody"


--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="rawRequest"

{"slug":"submit\/243490908500051","jsExecutionTracker":"build-date-1743981991368=>init-started:1743982445902=>validator-called:1743982445907=>validator-mounted-false:1743982445907=>init-complete:1743982445910=>onsubmit-fired:1743982457902=>observerSubmitHandler_received-submit-event:1743982457903=>submit-validation-passed:1743982457907=>observerSubmitHandler_validation-passed-submitting-form:1743982457914","submitSource":"form","buildDate":"1743981991368","uploadServerUrl":"https:\/\/upload.jotform.com\/upload","eventObserver":"1","q10_key1With":"Value1 with colon: and comma, end","q11_sameKey":"Value 1","q12_sameKey2":"Value 2","q13_sameKeyValue":"Same Key-Value","q14_value2":"Value 3","q23_multipleChoice":["Option; 1","Option2"],"event_id":"1743982445903_243490908500051_4IYtoJz","timeToSubmit":"11","temp_upload":{"q22_fileUpload":["error; frontend, UI.png#jotformfs-e4f4ece4d0a90#01960d74-6a25-7398-87c7-df56ce6711f1","Screenshot_20250331_201054.png#jotformfs-e4f4ece4d0a90#01960d74-6bbc-7e1b-8187-9028f55b6ef6"]},"file_server":"jotformfs-e4f4ece4d0a90#01960d74-6bbc-7e1b-8187-9028f55b6ef6","validatedNewRequiredFieldIDs":"{\"new\":1}","path":"\/submit\/243490908500051","fileUpload":["https:\/\/www.jotform.com\/uploads\/kolanuvarun739\/243490908500051\/6197916587414311452\/error%3B%20frontend%2C%20UI.png","https:\/\/www.jotform.com\/uploads\/kolanuvarun739\/243490908500051\/6197916587414311452\/Screenshot_20250331_201054.png"]}
--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="fromTable"


--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="appID"


--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="pretty"

Key1 with colon: and comma, end:Value1 with colon: and comma, end, Same Key:Value 1, Same Key:Value 2, Same Key-Value:Same Key-Value, Value 2:Value 3, Multiple Choice Question, options::Option; 1 Option2, File Upload with colon : and comma , end:error; frontend, UI.png Screenshot_20250331_201054.png
--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="unread"


--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="parent"


--------------------------BIoxRptelgempTlOi8T0XA
Content-Disposition: form-data; name="ip"

103.151.209.147
--------------------------BIoxRptelgempTlOi8T0XA--
```

--------------------------------------------------------------------------------

---[FILE: screenshot_response.multipart]---
Location: zulip-main/zerver/webhooks/jotform/fixtures/screenshot_response.multipart

```text
--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="action"


--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="webhookURL"

https://959c-103-151-209-117.ngrok-free.app/api/v1/external/jotform?api_key=3BKWHdX6ZZpvIkzts68PKE30Dw8871kS&stream=22&topic=Feedback+Form
--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="username"

kolanuvarun739
--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="formID"

243615086540051
--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="type"

WEB
--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="customParams"


--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="product"


--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="formTitle"

Feedback Form
--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="customTitle"


--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="submissionID"

6114090137116205381
--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="event"


--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="documentID"


--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="teamID"


--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="subject"


--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="isSilent"


--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="customBody"


--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="rawRequest"

{"slug":"submit\/243615086540051","jsExecutionTracker":"build-date-1735597456482=>init-started:1735597457312=>validator-called:1735597457313=>validator-mounted-false:1735597457313=>init-complete:1735597457316=>interval-complete:1735597478103=>onsubmit-fired:1735598288656=>observerSubmitHandler_received-submit-event:1735598288656=>submit-validation-passed:1735598288659=>observerSubmitHandler_validation-passed-submitting-form:1735598288668=>init-started:1735598444979=>validator-called:1735598444980=>validator-mounted-false:1735598444980=>init-complete:1735598444983=>init-started:1735598447982=>validator-called:1735598447983=>validator-mounted-false:1735598447983=>init-complete:1735598447985=>interval-complete:1735598469193=>onsubmit-fired:1735598480950=>observerSubmitHandler_received-submit-event:1735598480950=>submit-validation-passed:1735598480954=>observerSubmitHandler_validation-passed-submitting-form:1735598480962=>init-started:1735598975826=>validator-called:1735598975828=>validator-mounted-false:1735598975828=>init-complete:1735598975836=>interval-complete:1735598996957=>onsubmit-fired:1735599067954=>observerSubmitHandler_received-submit-event:1735599067954=>submit-validation-passed:1735599067956=>observerSubmitHandler_validation-passed-submitting-form:1735599067962=>init-started:1735599159857=>validator-called:1735599159859=>validator-mounted-false:1735599159859=>init-complete:1735599159861=>interval-complete:1735599181032=>onsubmit-fired:1735599182145=>observerSubmitHandler_received-submit-event:1735599182145=>submit-validation-passed:1735599182149=>observerSubmitHandler_validation-passed-submitting-form:1735599182155=>init-started:1735599251872=>validator-called:1735599251873=>validator-mounted-false:1735599251873=>init-complete:1735599251877=>interval-complete:1735599272970=>onsubmit-fired:1735599584836=>observerSubmitHandler_received-submit-event:1735599584836=>submit-validation-passed:1735599584840=>observerSubmitHandler_validation-passed-submitting-form:1735599584847=>init-started:1735599791882=>validator-called:1735599791884=>validator-mounted-false:1735599791884=>init-complete:1735599791885=>interval-complete:1735599813033=>onsubmit-fired:1735599813327=>observerSubmitHandler_received-submit-event:1735599813327=>submit-validation-passed:1735599813330=>observerSubmitHandler_validation-passed-submitting-form:1735599813338","submitSource":"form","buildDate":"1735598447069","uploadServerUrl":"https:\/\/upload.jotform.com\/upload","eventObserver":"1","q3_howOften":"Daily","q4_howLikely":"9","q7_feedback":"The new personalized recommendations feature is great!","event_id":"1735599791882_243615086540051_ZWbBbs3","timeToSubmit":"20","temp_upload":{"q9_filesRelated":["frontend setup.jpg#jotformfs-e4f4ece4d0a90#019419cf-4a02-7e71-a373-8a2d40622c3d","workflow.png#jotformfs-e4f4ece4d0a90#019419cf-4b57-7881-82a8-ab02b2cde277"]},"file_server":"jotformfs-e4f4ece4d0a90#019419cf-6b35-79cf-86c7-880b6c4343ca","validatedNewRequiredFieldIDs":"{\"new\":1}","path":"\/submit\/243615086540051","filesRelated":["https:\/\/www.jotform.com\/uploads\/kolanuvarun739\/243615086540051\/6114090137116205381\/frontend%20setup.jpg","https:\/\/www.jotform.com\/uploads\/kolanuvarun739\/243615086540051\/6114090137116205381\/workflow.png"]}
--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="fromTable"


--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="appID"


--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="pretty"

How often do you use the application?:Daily, How likely are you to recommend it to a friend on a scale of 0-10?:9, Feedback:The new personalized recommendations feature is great!, Upload images of your customized setup to get featured!:frontend setup.jpg workflow.png
--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="unread"


--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="parent"


--------------------------1WSA91c0mNqsH82UlEp0qj
Content-Disposition: form-data; name="ip"

103.151.209.117
--------------------------1WSA91c0mNqsH82UlEp0qj--
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/json/doc.md

```text
# Zulip JSON formatter

Render JSON payloads nicely in a Zulip code block! This is
particularly useful when you want to capture a webhook payload as part
of [writing an incoming webhook
integration](/api/incoming-webhooks-overview).

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Configure your application to send the webhook
   payload to the **URL** generated above.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/json/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/json/tests.py

```python
import json

from zerver.lib.test_classes import WebhookTestCase


class JsonHookTests(WebhookTestCase):
    CHANNEL_NAME = "json"
    URL_TEMPLATE = "/api/v1/external/json?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "json"

    def test_json_github_push__1_commit_message(self) -> None:
        """
        Tests if json github push 1 commit is handled correctly
        """
        with open("zerver/webhooks/json/fixtures/json_github_push__1_commit.json") as f:
            original_fixture = json.load(f)

        expected_topic_name = "JSON"
        expected_message = f"""```json
{json.dumps(original_fixture, indent=2)}
```"""
        self.check_webhook("json_github_push__1_commit", expected_topic_name, expected_message)

    def test_json_pingdom_http_up_to_down_message(self) -> None:
        """
        Tests if json pingdom http up to down is handled correctly
        """
        with open("zerver/webhooks/json/fixtures/json_pingdom_http_up_to_down.json") as f:
            original_fixture = json.load(f)

        expected_topic_name = "JSON"
        expected_message = f"""```json
{json.dumps(original_fixture, indent=2)}
```"""
        self.check_webhook("json_pingdom_http_up_to_down", expected_topic_name, expected_message)

    def test_json_sentry_event_for_exception_js_message(self) -> None:
        """
        Tests if json sentry event for exception js is handled correctly
        """
        with open("zerver/webhooks/json/fixtures/json_sentry_event_for_exception_js.json") as f:
            original_fixture = json.load(f)

        expected_topic_name = "JSON"
        expected_message = f"""```json
{json.dumps(original_fixture, indent=2)}
```"""
        self.check_webhook(
            "json_sentry_event_for_exception_js", expected_topic_name, expected_message
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/json/view.py
Signals: Django

```python
import json
from typing import Any

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

JSON_MESSAGE_TEMPLATE = """
```json
{webhook_payload}
```
""".strip()


@webhook_view("JSON")
@typed_endpoint
def api_json_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[dict[str, Any]],
) -> HttpResponse:
    body = get_body_for_http_request(payload)
    topic_name = get_topic_for_http_request(payload)

    check_send_webhook_message(request, user_profile, topic_name, body)
    return json_success(request)


def get_topic_for_http_request(payload: dict[str, Any]) -> str:
    return "JSON"


def get_body_for_http_request(payload: dict[str, Any]) -> str:
    prettypayload = json.dumps(payload, indent=2)
    return JSON_MESSAGE_TEMPLATE.format(webhook_payload=prettypayload, sort_keys=True)
```

--------------------------------------------------------------------------------

---[FILE: json_github_push__1_commit.json]---
Location: zulip-main/zerver/webhooks/json/fixtures/json_github_push__1_commit.json

```json
../../github/fixtures/push__1_commit.json
```

--------------------------------------------------------------------------------

---[FILE: json_pingdom_http_up_to_down.json]---
Location: zulip-main/zerver/webhooks/json/fixtures/json_pingdom_http_up_to_down.json

```json
../../pingdom/fixtures/http_up_to_down.json
```

--------------------------------------------------------------------------------

---[FILE: json_sentry_event_for_exception_js.json]---
Location: zulip-main/zerver/webhooks/json/fixtures/json_sentry_event_for_exception_js.json

```json
../../sentry/fixtures/event_for_exception_js.json
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/librato/doc.md

```text
# Zulip AppOptics/Librato integration

Get Zulip notifications for your AppOptics/Librato alerts!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your AppOptics/Librato homepage, and click on **Settings**.
   Select **Notification Services**, and click **Webhooks**.

1. Set **Title** to a title of your choice, such as `Zulip`. Set **URL**
   to the URL generated above, and click **Add**. When you create a
   new **Alert**, you can enable this webhook under the **Notification
   Services** tab.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/librato/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/librato/tests.py

```python
from urllib.parse import urlencode

from typing_extensions import override

from zerver.lib.test_classes import WebhookTestCase


class LibratoHookTests(WebhookTestCase):
    CHANNEL_NAME = "librato"
    URL_TEMPLATE = "/api/v1/external/librato?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "librato"
    IS_ATTACHMENT = False

    @override
    def get_body(self, fixture_name: str) -> str:
        if self.IS_ATTACHMENT:
            return self.webhook_fixture_data("librato", fixture_name, file_type="json")
        return urlencode(
            {"payload": self.webhook_fixture_data("librato", fixture_name, file_type="json")}
        )

    def test_alert_message_with_default_topic(self) -> None:
        expected_topic_name = "Alert alert.name"
        expected_message = "Alert [alert_name](https://metrics.librato.com/alerts#/6294535) has triggered! [Reaction steps](http://www.google.pl):\n * Metric `librato.cpu.percent.idle`, sum was below 44 by 300s, recorded at <time:2016-03-31T09:11:42+00:00>.\n * Metric `librato.swap.swap.cached`, average was absent  by 300s, recorded at <time:2016-03-31T09:11:42+00:00>.\n * Metric `librato.swap.swap.cached`, derivative was above 9 by 300s, recorded at <time:2016-03-31T09:11:42+00:00>."
        self.check_webhook(
            "alert",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_alert_message_with_custom_topic(self) -> None:
        custom_topic_name = "custom_name"
        self.url = self.build_webhook_url(topic=custom_topic_name)
        expected_message = "Alert [alert_name](https://metrics.librato.com/alerts#/6294535) has triggered! [Reaction steps](http://www.google.pl):\n * Metric `librato.cpu.percent.idle`, sum was below 44 by 300s, recorded at <time:2016-03-31T09:11:42+00:00>.\n * Metric `librato.swap.swap.cached`, average was absent  by 300s, recorded at <time:2016-03-31T09:11:42+00:00>.\n * Metric `librato.swap.swap.cached`, derivative was above 9 by 300s, recorded at <time:2016-03-31T09:11:42+00:00>."
        self.check_webhook(
            "alert",
            custom_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_three_conditions_alert_message(self) -> None:
        expected_message = "Alert [alert_name](https://metrics.librato.com/alerts#/6294535) has triggered! [Reaction steps](http://www.use.water.pl):\n * Metric `collectd.interface.eth0.if_octets.tx`, absolute_value was above 4 by 300s, recorded at <time:2016-04-11T20:40:14+00:00>.\n * Metric `collectd.load.load.longterm`, max was above 99, recorded at <time:2016-04-11T20:40:14+00:00>.\n * Metric `librato.swap.swap.cached`, average was absent  by 60s, recorded at <time:2016-04-11T20:40:14+00:00>."
        expected_topic_name = "Alert TooHighTemperature"
        self.check_webhook(
            "three_conditions_alert",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_alert_clear(self) -> None:
        expected_topic_name = "Alert Alert_name"
        expected_message = "Alert [alert_name](https://metrics.librato.com/alerts#/6309313) has cleared at <time:2016-04-12T13:11:44+00:00>!"
        self.check_webhook(
            "alert_cleared",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_snapshot(self) -> None:
        self.IS_ATTACHMENT = True
        expected_topic_name = "Snapshots"
        expected_message = "**Hamlet** sent a [snapshot](http://snapshots.librato.com/chart/nr5l3n0c-82162.png) of [metric](https://metrics.librato.com/s/spaces/167315/explore/1731491?duration=72039&end_time=1460569409)."
        self.check_webhook(
            "snapshot",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )
        self.IS_ATTACHMENT = False

    def test_bad_request(self) -> None:
        with self.assertRaises(AssertionError) as e:
            self.check_webhook(
                "bad",
                "",
                "",
                content_type="application/json",
            )
        self.assertIn("Malformed JSON input", e.exception.args[0])

    def test_bad_msg_type(self) -> None:
        with self.assertRaises(AssertionError) as e:
            self.check_webhook(
                "bad_msg_type",
                "",
                "",
                content_type="application/x-www-form-urlencoded",
            )
        self.assertIn("Unexpected message type", e.exception.args[0])
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/librato/view.py
Signals: Django, Pydantic

```python
from collections.abc import Callable, Mapping
from typing import Any

import orjson
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _
from pydantic import Json

from zerver.decorator import webhook_view
from zerver.lib.exceptions import JsonableError
from zerver.lib.response import json_success
from zerver.lib.timestamp import datetime_to_global_time, timestamp_to_datetime
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

ALERT_CLEAR = "clear"
ALERT_VIOLATION = "violations"
SNAPSHOT = "image_url"


class LibratoWebhookParser:
    ALERT_URL_TEMPLATE = "https://metrics.librato.com/alerts#/{alert_id}"

    def __init__(self, payload: Mapping[str, Any], attachments: list[dict[str, Any]]) -> None:
        self.payload = payload
        self.attachments = attachments

    def generate_alert_url(self, alert_id: int) -> str:
        return self.ALERT_URL_TEMPLATE.format(alert_id=alert_id)

    def parse_alert(self) -> tuple[int, str, str, str]:
        alert = self.payload["alert"]
        alert_id = alert["id"]
        return alert_id, alert["name"], self.generate_alert_url(alert_id), alert["runbook_url"]

    def parse_condition(self, condition: dict[str, Any]) -> tuple[str, str, str, str]:
        summary_function = condition["summary_function"]
        threshold = condition.get("threshold", "")
        condition_type = condition["type"]
        duration = condition.get("duration", "")
        return summary_function, threshold, condition_type, duration

    def parse_violation(self, violation: dict[str, Any]) -> tuple[str, str]:
        metric_name = violation["metric"]
        recorded_at = datetime_to_global_time(timestamp_to_datetime(violation["recorded_at"]))
        return metric_name, recorded_at

    def parse_conditions(self) -> list[dict[str, Any]]:
        conditions = self.payload["conditions"]
        return conditions

    def parse_violations(self) -> list[dict[str, Any]]:
        violations = self.payload["violations"]["test-source"]
        return violations

    def parse_snapshot(self, snapshot: dict[str, Any]) -> tuple[str, str, str]:
        author_name, image_url, title = (
            snapshot["author_name"],
            snapshot["image_url"],
            snapshot["title"],
        )
        return author_name, image_url, title


class LibratoWebhookHandler(LibratoWebhookParser):
    def __init__(self, payload: Mapping[str, Any], attachments: list[dict[str, Any]]) -> None:
        super().__init__(payload, attachments)
        self.payload_available_types = {
            ALERT_CLEAR: self.handle_alert_clear_message,
            ALERT_VIOLATION: self.handle_alert_violation_message,
        }

        self.attachments_available_types = {
            SNAPSHOT: self.handle_snapshots,
        }

    def find_handle_method(self) -> Callable[[], str]:
        for available_type in self.payload_available_types:
            if self.payload.get(available_type):
                return self.payload_available_types[available_type]
        for available_type in self.attachments_available_types:
            if len(self.attachments) > 0 and self.attachments[0].get(available_type):
                return self.attachments_available_types[available_type]
        raise Exception("Unexpected message type")

    def handle(self) -> str:
        return self.find_handle_method()()

    def generate_topic(self) -> str:
        if self.attachments:
            return "Snapshots"
        topic_template = "Alert {alert_name}"
        _alert_id, alert_name, _alert_url, _alert_runbook_url = self.parse_alert()
        return topic_template.format(alert_name=alert_name)

    def handle_alert_clear_message(self) -> str:
        alert_clear_template = "Alert [alert_name]({alert_url}) has cleared at {trigger_time}!"
        trigger_time = datetime_to_global_time(timestamp_to_datetime(self.payload["trigger_time"]))
        _alert_id, alert_name, alert_url, _alert_runbook_url = self.parse_alert()
        content = alert_clear_template.format(
            alert_name=alert_name, alert_url=alert_url, trigger_time=trigger_time
        )
        return content

    def handle_snapshots(self) -> str:
        content = ""
        for attachment in self.attachments:
            content += self.handle_snapshot(attachment)
        return content

    def handle_snapshot(self, snapshot: dict[str, Any]) -> str:
        snapshot_template = "**{author_name}** sent a [snapshot]({image_url}) of [metric]({title})."
        author_name, image_url, title = self.parse_snapshot(snapshot)
        content = snapshot_template.format(
            author_name=author_name, image_url=image_url, title=title
        )
        return content

    def handle_alert_violation_message(self) -> str:
        alert_violation_template = "Alert [alert_name]({alert_url}) has triggered! "
        _alert_id, alert_name, alert_url, alert_runbook_url = self.parse_alert()
        content = alert_violation_template.format(alert_name=alert_name, alert_url=alert_url)
        if alert_runbook_url:
            alert_runbook_template = "[Reaction steps]({alert_runbook_url}):"
            content += alert_runbook_template.format(alert_runbook_url=alert_runbook_url)
        content += self.generate_conditions_and_violations()
        return content

    def generate_conditions_and_violations(self) -> str:
        conditions = self.parse_conditions()
        violations = self.parse_violations()
        content = ""
        for condition, violation in zip(conditions, violations, strict=False):
            content += self.generate_violated_metric_condition(violation, condition)
        return content

    def generate_violated_metric_condition(
        self, violation: dict[str, Any], condition: dict[str, Any]
    ) -> str:
        summary_function, threshold, condition_type, duration = self.parse_condition(condition)
        metric_name, recorded_at = self.parse_violation(violation)
        metric_condition_template = (
            "\n * Metric `{metric_name}`, {summary_function} was {condition_type} {threshold}"
        )
        content = metric_condition_template.format(
            metric_name=metric_name,
            summary_function=summary_function,
            condition_type=condition_type,
            threshold=threshold,
        )
        if duration:
            content += f" by {duration}s"
        content += f", recorded at {recorded_at}."
        return content


@webhook_view("Librato")
@typed_endpoint
def api_librato_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: Json[Mapping[str, Any]] = {},  # noqa: B006 # Mapping is indeed immutable, but Json's type annotation drops that information
) -> HttpResponse:
    try:
        attachments = orjson.loads(request.body).get("attachments", [])
    except orjson.JSONDecodeError:
        attachments = []

    if not attachments and not payload:
        raise JsonableError(_("Malformed JSON input"))

    message_handler = LibratoWebhookHandler(payload, attachments)
    topic_name = message_handler.generate_topic()

    try:
        content = message_handler.handle()
    except Exception as e:
        raise JsonableError(str(e))

    check_send_webhook_message(request, user_profile, topic_name, content)
    return json_success(request)
```

--------------------------------------------------------------------------------

````
