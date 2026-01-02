---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1113
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1113 of 1290)

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

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/alertmanager/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class AlertmanagerHookTests(WebhookTestCase):
    CHANNEL_NAME = "alertmanager"
    URL_TEMPLATE = "/api/v1/external/alertmanager?&api_key={api_key}&stream={stream}&name=topic&desc=description"
    WEBHOOK_DIR_NAME = "alertmanager"

    def test_error_issue_message(self) -> None:
        expected_topic_name = "andromeda"
        expected_message = """
:alert: **FIRING**
* CPU core temperature is 34.75C ([source](http://cobalt:9090/graph?g0.expr=avg+by%28host%29+%28sensors_temp_input%7Bfeature%3D~%22core_%5B0-9%5D%2B%22%7D%29+%3E+15&g0.tab=0))
* CPU core temperature is 17.625C ([source](http://cobalt:9090/graph?g0.expr=avg+by%28host%29+%28sensors_temp_input%7Bfeature%3D~%22core_%5B0-9%5D%2B%22%7D%29+%3E+15&g0.tab=0))
""".strip()

        self.check_webhook(
            "alert",
            expected_topic_name,
            expected_message,
            "application/json",
        )

    def test_single_error_issue_message(self) -> None:
        expected_topic_name = "andromeda"
        expected_message = """
:squared_ok: **Resolved** CPU core temperature is 34.75C ([source](http://cobalt:9090/graph?g0.expr=avg+by%28host%29+%28sensors_temp_input%7Bfeature%3D~%22core_%5B0-9%5D%2B%22%7D%29+%3E+15&g0.tab=0))
""".strip()

        self.check_webhook(
            "single_alert",
            expected_topic_name,
            expected_message,
            "application/json",
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/alertmanager/view.py
Signals: Django

```python
# Webhooks for external integrations.

from typing import Annotated

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import ApiParamConfig, JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile


@webhook_view("Alertmanager")
@typed_endpoint
def api_alertmanager_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
    name_field: Annotated[str, ApiParamConfig("name")] = "instance",
    desc_field: Annotated[str, ApiParamConfig("desc")] = "alertname",
) -> HttpResponse:
    topics: dict[str, dict[str, list[str]]] = {}

    for alert in payload["alerts"]:
        labels = alert.get("labels", {})
        annotations = alert.get("annotations", {})

        name = labels.get(name_field, annotations.get(name_field, "(unknown)")).tame(check_string)
        desc = labels.get(
            desc_field, annotations.get(desc_field, f"<missing field: {desc_field}>")
        ).tame(check_string)

        url = alert["generatorURL"].tame(check_string).replace("tab=1", "tab=0")

        body = f"{desc} ([source]({url}))"
        if name not in topics:
            topics[name] = {"firing": [], "resolved": []}
        topics[name][alert["status"].tame(check_string)].append(body)

    for topic_name, statuses in topics.items():
        for status, messages in statuses.items():
            if len(messages) == 0:
                continue

            if status == "firing":
                icon = ":alert:"
                title = "FIRING"
            else:
                title = "Resolved"
                icon = ":squared_ok:"

            if len(messages) == 1:
                body = f"{icon} **{title}** {messages[0]}"
            else:
                message_list = "\n".join(f"* {m}" for m in messages)
                body = f"{icon} **{title}**\n{message_list}"

            check_send_webhook_message(request, user_profile, topic_name, body)

    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: alert.json]---
Location: zulip-main/zerver/webhooks/alertmanager/fixtures/alert.json

```json
{
    "receiver": "ops-zulip",
    "status": "firing",
    "groupLabels": {},
    "commonLabels": {
        "alertname": "High CPU Temperature",
        "severity": "critical"
    },
    "commonAnnotations": {
        "summary": "High CPU core temperature"
    },
    "externalURL": "http://ops1:9093",
    "version": "4",
    "groupKey": "{}/{}:{}",
    "alerts": [
        {
            "status": "firing",
            "labels": {
                "alertname": "High CPU Temperature",
                "host": "andromeda",
                "severity": "critical"
            },
            "annotations": {
                "description": "CPU core temperature is 34.75C",
                "topic": "andromeda",
                "summary": "High CPU core temperature"
            },
            "startsAt": "2020-02-06T00:17:58.432911368Z",
            "endsAt": "0001-01-01T00:00:00Z",
            "generatorURL": "http://cobalt:9090/graph?g0.expr=avg+by%28host%29+%28sensors_temp_input%7Bfeature%3D~%22core_%5B0-9%5D%2B%22%7D%29+%3E+15&g0.tab=1",
            "fingerprint": "a1bc48475b20e73d"
        },
        {
            "status": "firing",
            "labels": {
                "alertname": "High CPU Temperature",
                "host": "andromeda",
                "severity": "critical"
            },
            "annotations": {
                "description": "CPU core temperature is 17.625C",
                "topic": "andromeda",
                "summary": "High CPU core temperature"
            },
            "startsAt": "2020-02-06T00:17:58.432911368Z",
            "endsAt": "0001-01-01T00:00:00Z",
            "generatorURL": "http://cobalt:9090/graph?g0.expr=avg+by%28host%29+%28sensors_temp_input%7Bfeature%3D~%22core_%5B0-9%5D%2B%22%7D%29+%3E+15&g0.tab=1",
            "fingerprint": "c2ea85182f28cbd9"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: single_alert.json]---
Location: zulip-main/zerver/webhooks/alertmanager/fixtures/single_alert.json

```json
{
    "receiver": "ops-zulip",
    "status": "resolved",
    "groupLabels": {},
    "commonLabels": {
        "alertname": "High CPU Temperature",
        "severity": "critical"
    },
    "commonAnnotations": {
        "summary": "High CPU core temperature"
    },
    "externalURL": "http://ops1:9093",
    "version": "4",
    "groupKey": "{}/{}:{}",
    "alerts": [
        {
            "status": "resolved",
            "labels": {
                "alertname": "High CPU Temperature",
                "host": "andromeda",
                "severity": "critical"
            },
            "annotations": {
                "description": "CPU core temperature is 34.75C",
                "topic": "andromeda",
                "summary": "High CPU core temperature"
            },
            "startsAt": "2020-02-06T00:17:58.432911368Z",
            "endsAt": "0001-01-01T00:00:00Z",
            "generatorURL": "http://cobalt:9090/graph?g0.expr=avg+by%28host%29+%28sensors_temp_input%7Bfeature%3D~%22core_%5B0-9%5D%2B%22%7D%29+%3E+15&g0.tab=1",
            "fingerprint": "a1bc48475b20e73d"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/ansibletower/doc.md

```text
# Zulip Ansible Tower integration

Get Ansible Tower notifications in Zulip!

{start_tabs}

 1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to **Notifications** in your Ansible Tower or AWX Admin Portal,
   and select **Add**.

1. Set **Name** to a name of your choice, such as `Zulip`. Select the
   organization you'd like to be notified about, and set **Type** to
   **Webhook**. Set **Target URL** to the URL generated above, and
   click **Save**.

1. Go to **Organizations**, and find the organization you selected
   when adding the webhook notification. Click the pencil icon to edit
   the organization.

1. Select **Notifications**, and then select the events you would like
   to be notified about, and click **Save**.

{end_tabs}

 {!congrats.md!}

 ![](/static/images/integrations/ansibletower/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/ansibletower/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class AnsibletowerHookTests(WebhookTestCase):
    CHANNEL_NAME = "ansibletower"
    URL_TEMPLATE = "/api/v1/external/ansibletower?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "ansibletower"

    def test_ansibletower_project_update_successful_message(self) -> None:
        """
        Tests if ansibletower project update successful notification is handled correctly
        """
        expected_topic_name = "AWX - Project Update"
        expected_message = (
            "Project Update: [#2677 AWX - Project Update]"
            "(http://awx.example.co.uk/#/jobs/project/2677) was successful."
        )

        self.check_webhook("project_update_successful", expected_topic_name, expected_message)

    def test_ansibletower_project_update_failed_message(self) -> None:
        """
        Tests if ansibletower project update failed notification is handled correctly
        """
        expected_topic_name = "AWX - Project Update"
        expected_message = (
            "Project Update: [#2678 AWX - Project Update]"
            "(http://awx.example.co.uk/#/jobs/project/2678) failed."
        )

        self.check_webhook("project_update_failed", expected_topic_name, expected_message)

    def test_ansibletower_job_successful_multiple_hosts_message(self) -> None:
        """
        Tests if ansibletower job successful multiple hosts notification is handled correctly
        """
        expected_topic_name = "System - Deploy - Zabbix Agent"
        expected_message = """
Job: [#2674 System - Deploy - Zabbix Agent](http://awx.example.co.uk/#/jobs/playbook/2674) was successful:
* chat.example.co.uk: Success
* devops.example.co.uk: Success
* gitlab.example.co.uk: Success
* ipa.example.co.uk: Success
* mail.example.co.uk: Success
""".strip()

        self.check_webhook("job_successful_multiple_hosts", expected_topic_name, expected_message)

    def test_ansibletower_job_successful_message(self) -> None:
        """
        Tests if ansibletower job successful notification is handled correctly
        """
        expected_topic_name = "System - Deploy - Zabbix Agent"
        expected_message = """
Job: [#2674 System - Deploy - Zabbix Agent](http://awx.example.co.uk/#/jobs/playbook/2674) was successful:
* chat.example.co.uk: Success
""".strip()

        self.check_webhook("job_successful", expected_topic_name, expected_message)

    def test_ansibletower_nine_job_successful_message(self) -> None:
        """
        Test to see if awx/ansibletower 9.x.x job successful notifications are
        handled just as successfully as prior to 9.x.x.
        """
        expected_topic_name = "Demo Job Template"
        expected_message = """
Job: [#1 Demo Job Template](https://towerhost/#/jobs/playbook/1) was successful:
* localhost: Success
""".strip()

        self.check_webhook(
            "job_complete_successful_awx_9.1.1", expected_topic_name, expected_message
        )

    def test_ansibletower_job_failed_message(self) -> None:
        """
        Tests if ansibletower job failed notification is handled correctly
        """
        expected_topic_name = "System - Updates - Ubuntu"
        expected_message = """
Job: [#2722 System - Updates - Ubuntu](http://awx.example.co.uk/#/jobs/playbook/2722) failed:
* chat.example.co.uk: Failed
""".strip()

        self.check_webhook("job_failed", expected_topic_name, expected_message)

    def test_ansibletower_job_failed_multiple_hosts_message(self) -> None:
        """
        Tests if ansibletower job failed notification is handled correctly
        """
        expected_topic_name = "System - Updates - Ubuntu"
        expected_message = """
Job: [#2722 System - Updates - Ubuntu](http://awx.example.co.uk/#/jobs/playbook/2722) failed:
* chat.example.co.uk: Failed
* devops.example.co.uk: Failed
* gitlab.example.co.uk: Failed
* ipa.example.co.uk: Failed
* mail.example.co.uk: Failed
""".strip()

        self.check_webhook("job_failed_multiple_hosts", expected_topic_name, expected_message)

    def test_ansibletower_inventory_update_successful_message(self) -> None:
        """
        Tests if ansibletower inventory update successful notification is handled correctly
        """
        expected_topic_name = "AWX - Inventory Update"
        expected_message = (
            "Inventory Update: [#2724 AWX - Inventory Update]"
            "(http://awx.example.co.uk/#/jobs/inventory/2724) was successful."
        )

        self.check_webhook("inventory_update_successful", expected_topic_name, expected_message)

    def test_ansibletower_inventory_update_failed_message(self) -> None:
        """
        Tests if ansibletower inventory update failed notification is handled correctly
        """
        expected_topic_name = "AWX - Inventory Update"
        expected_message = (
            "Inventory Update: [#2724 AWX - Inventory Update]"
            "(http://awx.example.co.uk/#/jobs/inventory/2724) failed."
        )

        self.check_webhook("inventory_update_failed", expected_topic_name, expected_message)

    def test_ansibletower_adhoc_command_successful_message(self) -> None:
        """
        Tests if ansibletower adhoc command successful notification is handled correctly
        """
        expected_topic_name = "shell: uname -r"
        expected_message = (
            "AdHoc Command: [#2726 shell: uname -r]"
            "(http://awx.example.co.uk/#/jobs/command/2726) was successful."
        )

        self.check_webhook("adhoc_command_successful", expected_topic_name, expected_message)

    def test_ansibletower_adhoc_command_failed_message(self) -> None:
        """
        Tests if ansibletower adhoc command failed notification is handled correctly
        """
        expected_topic_name = "shell: uname -r"
        expected_message = (
            "AdHoc Command: [#2726 shell: uname -r]"
            "(http://awx.example.co.uk/#/jobs/command/2726) failed."
        )

        self.check_webhook("adhoc_command_failed", expected_topic_name, expected_message)

    def test_ansibletower_system_job_successful_message(self) -> None:
        """
        Tests if ansibletower system job successful notification is handled correctly
        """
        expected_topic_name = "Cleanup Job Details"
        expected_message = (
            "System Job: [#2721 Cleanup Job Details]"
            "(http://awx.example.co.uk/#/jobs/system/2721) was successful."
        )

        self.check_webhook("system_job_successful", expected_topic_name, expected_message)

    def test_ansibletower_system_job_failed_message(self) -> None:
        """
        Tests if ansibletower system job failed notification is handled correctly
        """
        expected_topic_name = "Cleanup Job Details"
        expected_message = (
            "System Job: [#2721 Cleanup Job Details]"
            "(http://awx.example.co.uk/#/jobs/system/2721) failed."
        )

        self.check_webhook("system_job_failed", expected_topic_name, expected_message)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/ansibletower/view.py
Signals: Django

```python
import operator

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_bool, check_int, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

ANSIBLETOWER_DEFAULT_MESSAGE_TEMPLATE = "{friendly_name}: [#{id} {name}]({url}) {status}."


ANSIBLETOWER_JOB_MESSAGE_TEMPLATE = """
{friendly_name}: [#{id} {name}]({url}) {status}:
{hosts_final_data}
""".strip()

ANSIBLETOWER_JOB_HOST_ROW_TEMPLATE = "* {hostname}: {status}\n"


@webhook_view("AnsibleTower")
@typed_endpoint
def api_ansibletower_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    body = get_body(payload)
    topic_name = payload["name"].tame(check_string)

    check_send_webhook_message(request, user_profile, topic_name, body)
    return json_success(request)


def extract_friendly_name(payload: WildValue) -> str:
    tentative_job_name = payload.get("friendly_name", "").tame(check_string)
    if not tentative_job_name:
        url = payload["url"].tame(check_string)
        segments = url.split("/")
        tentative_job_name = segments[-3]
        if tentative_job_name == "jobs":
            tentative_job_name = "Job"
    return tentative_job_name


def get_body(payload: WildValue) -> str:
    friendly_name = extract_friendly_name(payload)
    if friendly_name == "Job":
        hosts_data = []
        for host, host_data in payload["hosts"].items():
            if host_data["failed"].tame(check_bool):
                hoststatus = "Failed"
            else:
                hoststatus = "Success"
            hosts_data.append(
                {
                    "hostname": host,
                    "status": hoststatus,
                }
            )

        if payload["status"].tame(check_string) == "successful":
            status = "was successful"
        else:
            status = "failed"

        return ANSIBLETOWER_JOB_MESSAGE_TEMPLATE.format(
            name=payload["name"].tame(check_string),
            friendly_name=friendly_name,
            id=payload["id"].tame(check_int),
            url=payload["url"].tame(check_string),
            status=status,
            hosts_final_data=get_hosts_content(hosts_data),
        )

    else:
        if payload["status"].tame(check_string) == "successful":
            status = "was successful"
        else:
            status = "failed"

        data = {
            "name": payload["name"].tame(check_string),
            "friendly_name": friendly_name,
            "id": payload["id"].tame(check_int),
            "url": payload["url"].tame(check_string),
            "status": status,
        }

        return ANSIBLETOWER_DEFAULT_MESSAGE_TEMPLATE.format(**data)


def get_hosts_content(hosts_data: list[dict[str, str]]) -> str:
    hosts_data = sorted(hosts_data, key=operator.itemgetter("hostname"))
    hosts_content = ""
    for host in hosts_data:
        hosts_content += ANSIBLETOWER_JOB_HOST_ROW_TEMPLATE.format(
            hostname=host["hostname"],
            status=host["status"],
        )
    return hosts_content
```

--------------------------------------------------------------------------------

---[FILE: adhoc_command_failed.json]---
Location: zulip-main/zerver/webhooks/ansibletower/fixtures/adhoc_command_failed.json

```json
{
    "status": "failed",
    "name": "shell: uname -r",
    "started": "2018-09-13T19:58:18.972357+00:00",
    "traceback": "",
    "friendly_name": "AdHoc Command",
    "created_by": "admin",
    "url": "http://awx.example.co.uk/#/jobs/command/2726",
    "finished": "2018-09-13T19:58:32.465169+00:00",
    "id": 2726
}
```

--------------------------------------------------------------------------------

---[FILE: adhoc_command_successful.json]---
Location: zulip-main/zerver/webhooks/ansibletower/fixtures/adhoc_command_successful.json

```json
{
    "status": "successful",
    "name": "shell: uname -r",
    "started": "2018-09-13T19:58:18.972357+00:00",
    "traceback": "",
    "friendly_name": "AdHoc Command",
    "created_by": "admin",
    "url": "http://awx.example.co.uk/#/jobs/command/2726",
    "finished": "2018-09-13T19:58:32.465169+00:00",
    "id": 2726
}
```

--------------------------------------------------------------------------------

---[FILE: inventory_update_failed.json]---
Location: zulip-main/zerver/webhooks/ansibletower/fixtures/inventory_update_failed.json

```json
{
    "status": "failed",
    "name": "AWX - Inventory Update",
    "started": "2018-09-13T19:49:13.628571+00:00",
    "traceback": "",
    "friendly_name": "Inventory Update",
    "created_by": "admin",
    "url": "http://awx.example.co.uk/#/jobs/inventory/2724",
    "finished": "2018-09-13T19:49:18.236014+00:00",
    "id": 2724
}
```

--------------------------------------------------------------------------------

---[FILE: inventory_update_successful.json]---
Location: zulip-main/zerver/webhooks/ansibletower/fixtures/inventory_update_successful.json

```json
{
    "status": "successful",
    "name": "AWX - Inventory Update",
    "started": "2018-09-13T19:49:13.628571+00:00",
    "traceback": "",
    "friendly_name": "Inventory Update",
    "created_by": "admin",
    "url": "http://awx.example.co.uk/#/jobs/inventory/2724",
    "finished": "2018-09-13T19:49:18.236014+00:00",
    "id": 2724
}
```

--------------------------------------------------------------------------------

---[FILE: job_complete_successful_awx_9.1.1.json]---
Location: zulip-main/zerver/webhooks/ansibletower/fixtures/job_complete_successful_awx_9.1.1.json

```json
{
  "id": 1,
  "name": "Demo Job Template",
  "url": "https://towerhost/#/jobs/playbook/1",
  "created_by": "admin",
  "started": "2020-01-23T09:15:45.741213+00:00",
  "finished": "2020-01-23T09:15:49.729882+00:00",
  "status": "successful",
  "traceback": "",
  "inventory": "Demo Inventory",
  "project": "Demo Project",
  "playbook": "hello_world.yml",
  "credential": "Demo Credential",
  "limit": "",
  "extra_vars": "{}",
  "hosts": {
    "localhost": {
      "failed": false,
      "changed": 0,
      "dark": 0,
      "failures": 0,
      "ok": 2,
      "processed": 1,
      "skipped": 0,
      "rescued": 0,
      "ignored": 0
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: job_failed.json]---
Location: zulip-main/zerver/webhooks/ansibletower/fixtures/job_failed.json

```json
{
    "status": "failed",
    "credential": null,
    "name": "System - Updates - Ubuntu",
    "started": "2018-09-13T19:05:18.276217+00:00",
    "extra_vars": "{}",
    "traceback": "",
    "friendly_name": "Job",
    "created_by": "admin",
    "project": "AWX - Ansible Playbooks",
    "url": "http://awx.example.co.uk/#/jobs/playbook/2722",
    "finished": "2018-09-13T19:05:29.927509+00:00",
    "hosts": {
      "chat.example.co.uk": {
        "skipped": 0,
        "ok": 0,
        "changed": 0,
        "dark": 1,
        "failed": true,
        "processed": 1,
        "failures": 0
      }
    },
    "playbook": "system-updates/run-apt-updates.yml",
    "limit": "os-ubuntu",
    "id": 2722,
    "inventory": "Production Servers"
}
```

--------------------------------------------------------------------------------

---[FILE: job_failed_multiple_hosts.json]---
Location: zulip-main/zerver/webhooks/ansibletower/fixtures/job_failed_multiple_hosts.json

```json
{
    "status": "failed",
    "credential": null,
    "name": "System - Updates - Ubuntu",
    "started": "2018-09-13T19:05:18.276217+00:00",
    "extra_vars": "{}",
    "traceback": "",
    "friendly_name": "Job",
    "created_by": "admin",
    "project": "AWX - Ansible Playbooks",
    "url": "http://awx.example.co.uk/#/jobs/playbook/2722",
    "finished": "2018-09-13T19:05:29.927509+00:00",
    "hosts": {
      "chat.example.co.uk": {
        "skipped": 0,
        "ok": 0,
        "changed": 0,
        "dark": 1,
        "failed": true,
        "processed": 1,
        "failures": 0
      },
      "ipa.example.co.uk": {
        "skipped": 0,
        "ok": 0,
        "changed": 0,
        "dark": 1,
        "failed": true,
        "processed": 1,
        "failures": 0
      },
      "mail.example.co.uk": {
        "skipped": 0,
        "ok": 0,
        "changed": 0,
        "dark": 1,
        "failed": true,
        "processed": 1,
        "failures": 0
      },
      "devops.example.co.uk": {
        "skipped": 0,
        "ok": 0,
        "changed": 0,
        "dark": 1,
        "failed": true,
        "processed": 1,
        "failures": 0
      },
      "gitlab.example.co.uk": {
        "skipped": 0,
        "ok": 0,
        "changed": 0,
        "dark": 1,
        "failed": true,
        "processed": 1,
        "failures": 0
      }
    },
    "playbook": "system-updates/run-apt-updates.yml",
    "limit": "os-ubuntu",
    "id": 2722,
    "inventory": "Production Servers"
}
```

--------------------------------------------------------------------------------

---[FILE: job_successful.json]---
Location: zulip-main/zerver/webhooks/ansibletower/fixtures/job_successful.json

```json
{
    "status": "successful",
    "credential": "AWX - SSH",
    "name": "System - Deploy - Zabbix Agent",
    "started": "2018-09-11T19:19:10.153888+00:00",
    "extra_vars": "{}",
    "traceback": "",
    "friendly_name": "Job",
    "created_by": "None",
    "project": "AWX - Ansible Playbooks",
    "url": "http://awx.example.co.uk/#/jobs/playbook/2674",
    "finished": "2018-09-11T19:21:41.187605+00:00",
    "hosts": {
      "chat.example.co.uk": {
        "skipped": 28,
        "ok": 16,
        "changed": 0,
        "dark": 0,
        "failed": false,
        "processed": 1,
        "failures": 0
      }
    },
    "playbook": "system-zabbix-agent/deploy-zabbix-agent.yml",
    "limit": "!system-awx",
    "id": 2674,
    "inventory": "Production Servers"
}
```

--------------------------------------------------------------------------------

---[FILE: job_successful_multiple_hosts.json]---
Location: zulip-main/zerver/webhooks/ansibletower/fixtures/job_successful_multiple_hosts.json

```json
{
    "status": "successful",
    "credential": "AWX - SSH",
    "name": "System - Deploy - Zabbix Agent",
    "started": "2018-09-11T19:19:10.153888+00:00",
    "extra_vars": "{}",
    "traceback": "",
    "friendly_name": "Job",
    "created_by": "None",
    "project": "AWX - Ansible Playbooks",
    "url": "http://awx.example.co.uk/#/jobs/playbook/2674",
    "finished": "2018-09-11T19:21:41.187605+00:00",
    "hosts": {
      "gitlab.example.co.uk": {
        "skipped": 29,
        "ok": 15,
        "changed": 0,
        "dark": 0,
        "failed": false,
        "processed": 1,
        "failures": 0
      },
      "chat.example.co.uk": {
        "skipped": 28,
        "ok": 16,
        "changed": 0,
        "dark": 0,
        "failed": false,
        "processed": 1,
        "failures": 0
      },
      "devops.example.co.uk": {
        "skipped": 31,
        "ok": 13,
        "changed": 0,
        "dark": 0,
        "failed": false,
        "processed": 1,
        "failures": 0
      },
      "ipa.example.co.uk": {
        "skipped": 31,
        "ok": 13,
        "changed": 0,
        "dark": 0,
        "failed": false,
        "processed": 1,
        "failures": 0
      },
      "mail.example.co.uk": {
        "skipped": 31,
        "ok": 13,
        "changed": 0,
        "dark": 0,
        "failed": false,
        "processed": 1,
        "failures": 0
      }
    },
    "playbook": "system-zabbix-agent/deploy-zabbix-agent.yml",
    "limit": "!system-awx",
    "id": 2674,
    "inventory": "Production Servers"
}
```

--------------------------------------------------------------------------------

---[FILE: project_update_failed.json]---
Location: zulip-main/zerver/webhooks/ansibletower/fixtures/project_update_failed.json

```json
{
    "status": "failed",
    "name": "AWX - Project Update",
    "started": "2018-09-11T19:26:52.035205+00:00",
    "traceback": "",
    "friendly_name": "Project Update",
    "created_by": "admin",
    "url": "http://awx.example.co.uk/#/jobs/project/2678",
    "finished": "2018-09-11T19:26:56.193385+00:00",
    "id": 2678
}
```

--------------------------------------------------------------------------------

---[FILE: project_update_successful.json]---
Location: zulip-main/zerver/webhooks/ansibletower/fixtures/project_update_successful.json

```json
{
    "status": "successful",
    "name": "AWX - Project Update",
    "started": "2018-09-11T19:26:43.861738+00:00",
    "traceback": "",
    "friendly_name": "Project Update",
    "created_by": "admin",
    "url": "http://awx.example.co.uk/#/jobs/project/2677",
    "finished": "2018-09-11T19:26:50.966798+00:00",
    "id": 2677
}
```

--------------------------------------------------------------------------------

---[FILE: system_job_failed.json]---
Location: zulip-main/zerver/webhooks/ansibletower/fixtures/system_job_failed.json

```json
{
    "status": "failed",
    "name": "Cleanup Job Details",
    "started": "2018-09-13T18:57:15.891742+00:00",
    "traceback": "",
    "friendly_name": "System Job",
    "created_by": "admin",
    "url": "http://awx.example.co.uk/#/jobs/system/2721",
    "finished": "2018-09-13T19:00:39.919286+00:00",
    "id": 2721
}
```

--------------------------------------------------------------------------------

---[FILE: system_job_successful.json]---
Location: zulip-main/zerver/webhooks/ansibletower/fixtures/system_job_successful.json

```json
{
    "status": "successful",
    "name": "Cleanup Job Details",
    "started": "2018-09-13T18:57:15.891742+00:00",
    "traceback": "",
    "friendly_name": "System Job",
    "created_by": "admin",
    "url": "http://awx.example.co.uk/#/jobs/system/2721",
    "finished": "2018-09-13T19:00:39.919286+00:00",
    "id": 2721
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/appfollow/doc.md

```text
# Zulip AppFollow integration

Receive user reviews from your tracked apps on AppFollow!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. In AppFollow, go to **Integrations**, and select **Add new
   integration**. Select your app under **Tracked apps**.

1. Search for **WebHook URL**, and click **Add integration**.

1. Set **WebHook URL** to the URL generated above, and fill out the rest
   of the form. Click **Add integration**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/appfollow/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/appfollow/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase, ZulipTestCase
from zerver.webhooks.appfollow.view import convert_markdown


class AppFollowHookTests(WebhookTestCase):
    CHANNEL_NAME = "appfollow"
    URL_TEMPLATE = "/api/v1/external/appfollow?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "appfollow"

    def test_sample(self) -> None:
        expected_topic_name = "Webhook integration was successful."
        expected_message = """Webhook integration was successful.
Test User / Acme (Google Play)"""
        self.check_webhook(
            "sample",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_reviews(self) -> None:
        expected_topic_name = "Acme - Group chat"
        expected_message = """Acme - Group chat
App Store, Acme Technologies, Inc.
★★★★★ United States
**Great for Information Management**
Acme enables me to manage the flow of information quite well. I only wish I could create and edit my Acme Post files in the iOS app.
*by* **Mr RESOLUTIONARY** *for v3.9*
[Permalink](http://appfollow.io/permalink) · [Add tag](http://watch.appfollow.io/add_tag)"""
        self.check_webhook(
            "review",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_reviews_with_topic(self) -> None:
        # This temporary patch of URL_TEMPLATE is code smell but required due to the way
        # WebhookTestCase is built.
        original_url_template = self.URL_TEMPLATE
        self.URL_TEMPLATE = original_url_template + "&topic=foo"
        self.url = self.build_webhook_url()
        expected_topic_name = "foo"
        expected_message = """Acme - Group chat
App Store, Acme Technologies, Inc.
★★★★★ United States
**Great for Information Management**
Acme enables me to manage the flow of information quite well. I only wish I could create and edit my Acme Post files in the iOS app.
*by* **Mr RESOLUTIONARY** *for v3.9*
[Permalink](http://appfollow.io/permalink) · [Add tag](http://watch.appfollow.io/add_tag)"""
        self.check_webhook(
            "review",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )
        self.URL_TEMPLATE = original_url_template


class ConvertMarkdownTest(ZulipTestCase):
    def test_convert_bold(self) -> None:
        self.assertEqual(convert_markdown("*test message*"), "**test message**")

    def test_convert_italics(self) -> None:
        self.assertEqual(convert_markdown("_test message_"), "*test message*")
        self.assertEqual(convert_markdown("_  spaced message _"), "  *spaced message* ")

    def test_convert_strikethrough(self) -> None:
        self.assertEqual(convert_markdown("~test message~"), "~~test message~~")
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/appfollow/view.py
Signals: Django

```python
# Webhooks for external integrations.
import re

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile


@webhook_view("AppFollow")
@typed_endpoint
def api_appfollow_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    message = payload["text"].tame(check_string)
    app_name_search = re.search(r"\A(.+)", message)
    assert app_name_search is not None
    app_name = app_name_search.group(0)
    topic_name = app_name

    check_send_webhook_message(request, user_profile, topic_name, body=convert_markdown(message))
    return json_success(request)


def convert_markdown(text: str) -> str:
    # Converts Slack-style Markdown to Zulip format
    # Implemented mainly for AppFollow messages
    # Not ready for general use as some edge-cases not handled
    # Convert bold
    text = re.sub(r"(?:(?<=\s)|(?<=^))\*(.+?\S)\*(?=\s|$)", r"**\1**", text)
    # Convert italics
    text = re.sub(r"\b_(\s*)(.+?)(\s*)_\b", r"\1*\2*\3", text)
    # Convert strikethrough
    text = re.sub(r"(?:(?<=\s)|(?<=^))~(.+?\S)~(?=\s|$)", r"~~\1~~", text)

    return text
```

--------------------------------------------------------------------------------

---[FILE: review.json]---
Location: zulip-main/zerver/webhooks/appfollow/fixtures/review.json

```json
{
  "text":"Acme - Group chat\nApp Store, Acme Technologies, Inc.\n★★★★★ United States\n*Great for Information Management*\nAcme enables me to manage the flow of information quite well. I only wish I could create and edit my Acme Post files in the iOS app.\n_by_ *Mr RESOLUTIONARY* _for v3.9_\n[Permalink](http:\/\/appfollow.io\/permalink) · [Add tag](http:\/\/watch.appfollow.io\/add_tag)"
}
```

--------------------------------------------------------------------------------

---[FILE: sample.json]---
Location: zulip-main/zerver/webhooks/appfollow/fixtures/sample.json

```json
{
  "text":"Webhook integration was successful.\nTest User \/ Acme (Google Play)"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/appveyor/doc.md

```text
# Zulip AppVeyor integration

Receive AppVeyor notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your AppVeyor Project Settings, and select **Notifications**.
   Click on **Add notification**, and then select **Webhook**.

1. Set **Webhook URL** to the URL generated above. Select the events
   you'd like to be notified about, and click **Save**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/appveyor/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/appveyor/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class AppveyorHookTests(WebhookTestCase):
    CHANNEL_NAME = "appveyor"
    URL_TEMPLATE = "/api/v1/external/appveyor?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "appveyor"

    def test_appveyor_build_success_message(self) -> None:
        """
        Tests if appveyor build success notification is handled correctly
        """
        expected_topic_name = "Hubot-DSC-Resource"
        expected_message = """
[Build Hubot-DSC-Resource 2.0.59 completed](https://ci.appveyor.com/project/joebloggs/hubot-dsc-resource/build/2.0.59):
* **Commit**: [c06e208b47: Increment version number.](https://github.com/joebloggs/Hubot-DSC-Resource/commit/c06e208b47) by Joe Bloggs
* **Started**: <time:2018-09-09T19:04:00+00:00>
* **Finished**: <time:2018-09-09T19:06:00+00:00>
""".strip()

        self.check_webhook("appveyor_build_success", expected_topic_name, expected_message)

    def test_appveyor_build_failure_message(self) -> None:
        """
        Tests if appveyor build failure notification is handled correctly
        """
        expected_topic_name = "Hubot-DSC-Resource"
        expected_message = """
[Build Hubot-DSC-Resource 2.0.59 failed](https://ci.appveyor.com/project/joebloggs/hubot-dsc-resource/build/2.0.59):
* **Commit**: [c06e208b47: Increment version number.](https://github.com/joebloggs/Hubot-DSC-Resource/commit/c06e208b47) by Joe Bloggs
* **Started**: <time:2018-09-09T19:04:00+00:00>
* **Finished**: <time:2018-09-09T19:06:00+00:00>
""".strip()

        self.check_webhook("appveyor_build_failure", expected_topic_name, expected_message)
```

--------------------------------------------------------------------------------

````
