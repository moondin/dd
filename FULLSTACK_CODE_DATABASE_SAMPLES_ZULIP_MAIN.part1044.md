---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 1044
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1044 of 1290)

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

---[FILE: test_realm_export.py]---
Location: zulip-main/zerver/tests/test_realm_export.py
Signals: Django

```python
import os
from unittest.mock import patch
from urllib.parse import urlsplit

import botocore.exceptions
import orjson
from django.conf import settings
from django.utils.timezone import now as timezone_now

from analytics.models import RealmCount
from zerver.actions.user_settings import do_change_user_setting
from zerver.lib.exceptions import JsonableError
from zerver.lib.queue import queue_json_publish_rollback_unsafe
from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.test_helpers import (
    HostRequestMock,
    create_dummy_file,
    create_s3_buckets,
    stdout_suppressed,
    use_s3_backend,
)
from zerver.models import Realm, RealmExport, UserProfile
from zerver.views.realm_export import export_realm


class RealmExportTest(ZulipTestCase):
    """
    API endpoint testing covers the full end-to-end flow
    from both the S3 and local uploads perspective.

    `test_endpoint_s3` and `test_endpoint_local_uploads` follow
    an identical pattern, which is documented in both test
    functions.
    """

    def test_export_as_not_admin(self) -> None:
        user = self.example_user("hamlet")
        self.login_user(user)
        with self.assertRaises(JsonableError):
            export_realm(HostRequestMock(), user)

    @use_s3_backend
    def test_endpoint_s3(self) -> None:
        admin = self.example_user("iago")
        self.login_user(admin)
        bucket = create_s3_buckets(settings.S3_EXPORT_BUCKET)[0]
        tarball_path = create_dummy_file("test-export.tar.gz")

        # Test the export logic.
        with patch(
            "zerver.lib.export.do_export_realm", return_value=(tarball_path, dict())
        ) as mock_export:
            with (
                self.settings(LOCAL_UPLOADS_DIR=None),
                stdout_suppressed(),
                self.assertLogs(level="INFO") as info_logs,
                self.captureOnCommitCallbacks(execute=True),
            ):
                result = self.client_post("/json/export/realm")
            self.assertTrue("INFO:root:Completed data export for zulip in " in info_logs.output[0])
        self.assert_json_success(result)
        self.assertFalse(os.path.exists(tarball_path))
        args = mock_export.call_args_list[0][1]
        self.assertEqual(args["realm"], admin.realm)
        self.assertEqual(args["export_type"], RealmExport.EXPORT_PUBLIC)
        self.assertTrue(os.path.basename(args["output_dir"]).startswith("zulip-export-"))
        self.assertEqual(args["processes"], 6)

        # Get the entry and test that iago initiated it.
        export_row = RealmExport.objects.first()
        assert export_row is not None
        self.assertEqual(export_row.acting_user_id, admin.id)
        self.assertEqual(export_row.status, RealmExport.SUCCEEDED)

        # Test that the file is hosted, and the contents are as expected.
        export_path = export_row.export_path
        assert export_path is not None
        assert export_path.startswith("/")
        path_id = export_path.removeprefix("/")
        self.assertEqual(bucket.Object(path_id).get()["Body"].read(), b"zulip!")

        result = self.client_get("/json/export/realm")
        response_dict = self.assert_json_success(result)

        # Test that the export we have is the export we created.
        export_dict = response_dict["exports"]
        self.assertEqual(export_dict[0]["id"], export_row.id)
        parsed_url = urlsplit(export_dict[0]["export_url"])
        self.assertEqual(
            parsed_url._replace(query="").geturl(),
            "https://test-export-bucket.s3.amazonaws.com" + export_path,
        )
        self.assertEqual(export_dict[0]["acting_user_id"], admin.id)
        self.assert_length(
            export_dict,
            RealmExport.objects.filter(realm=admin.realm).count(),
        )

        # Finally, delete the file.
        result = self.client_delete(f"/json/export/realm/{export_row.id}")
        self.assert_json_success(result)
        with self.assertRaises(botocore.exceptions.ClientError):
            bucket.Object(path_id).load()

        # Try to delete an export with a `DELETED` status.
        export_row.refresh_from_db()
        self.assertEqual(export_row.status, RealmExport.DELETED)
        self.assertIsNotNone(export_row.date_deleted)
        result = self.client_delete(f"/json/export/realm/{export_row.id}")
        self.assert_json_error(result, "Export already deleted")

        # Now try to delete a non-existent export.
        result = self.client_delete("/json/export/realm/0")
        self.assert_json_error(result, "Invalid data export ID")

    def test_endpoint_local_uploads(self) -> None:
        admin = self.example_user("iago")
        self.login_user(admin)
        tarball_path = create_dummy_file("test-export.tar.gz")

        # Test the export logic.
        def fake_export_realm(
            realm: Realm,
            output_dir: str,
            processes: int,
            export_type: int,
            exportable_user_ids: set[int] | None = None,
            export_as_active: bool | None = None,
        ) -> tuple[str, dict[str, int | dict[str, int]]]:
            self.assertEqual(realm, admin.realm)
            self.assertEqual(export_type, RealmExport.EXPORT_PUBLIC)
            self.assertTrue(os.path.basename(output_dir).startswith("zulip-export-"))
            self.assertEqual(processes, 6)

            # Check that the export shows up as in progress
            result = self.client_get("/json/export/realm")
            response_dict = self.assert_json_success(result)
            export_dict = response_dict["exports"]
            self.assert_length(export_dict, 1)
            id = export_dict[0]["id"]
            self.assertEqual(export_dict[0]["pending"], True)
            self.assertIsNone(export_dict[0]["export_url"])
            self.assertIsNone(export_dict[0]["deleted_timestamp"])
            self.assertIsNone(export_dict[0]["failed_timestamp"])
            self.assertEqual(export_dict[0]["acting_user_id"], admin.id)

            # While the export is in progress, we can't delete it
            result = self.client_delete(f"/json/export/realm/{id}")
            self.assert_json_error(result, "Export still in progress")

            return tarball_path, dict()

        with patch(
            "zerver.lib.export.do_export_realm", side_effect=fake_export_realm
        ) as mock_export:
            with (
                stdout_suppressed(),
                self.assertLogs(level="INFO") as info_logs,
                self.captureOnCommitCallbacks(execute=True),
            ):
                result = self.client_post("/json/export/realm")
            self.assertTrue("INFO:root:Completed data export for zulip in " in info_logs.output[0])
        mock_export.assert_called_once()
        data = self.assert_json_success(result)
        self.assertFalse(os.path.exists(tarball_path))

        # Get the entry and test that iago initiated it.
        export_row = RealmExport.objects.first()
        assert export_row is not None
        self.assertEqual(export_row.id, data["id"])
        self.assertEqual(export_row.acting_user_id, admin.id)
        self.assertEqual(export_row.status, RealmExport.SUCCEEDED)

        # Test that the file is hosted, and the contents are as expected.
        export_path = export_row.export_path
        assert export_path is not None
        response = self.client_get(export_path)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.getvalue(), b"zulip!")

        result = self.client_get("/json/export/realm")
        response_dict = self.assert_json_success(result)

        # Test that the export we have is the export we created.
        export_dict = response_dict["exports"]
        self.assertEqual(export_dict[0]["id"], export_row.id)
        self.assertEqual(export_dict[0]["export_url"], admin.realm.url + export_path)
        self.assertEqual(export_dict[0]["acting_user_id"], admin.id)
        self.assert_length(export_dict, RealmExport.objects.filter(realm=admin.realm).count())

        # Finally, delete the file.
        result = self.client_delete(f"/json/export/realm/{export_row.id}")
        self.assert_json_success(result)
        response = self.client_get(export_path)
        self.assertEqual(response.status_code, 404)

        # Try to delete an export with a `DELETED` status.
        export_row.refresh_from_db()
        self.assertEqual(export_row.status, RealmExport.DELETED)
        self.assertIsNotNone(export_row.date_deleted)
        result = self.client_delete(f"/json/export/realm/{export_row.id}")
        self.assert_json_error(result, "Export already deleted")

        # Now try to delete a non-existent export.
        result = self.client_delete("/json/export/realm/0")
        self.assert_json_error(result, "Invalid data export ID")

    def test_export_failure(self) -> None:
        admin = self.example_user("iago")
        self.login_user(admin)

        with (
            patch(
                "zerver.lib.export.do_export_realm", side_effect=Exception("failure")
            ) as mock_export,
            stdout_suppressed(),
            self.assertLogs(level="INFO") as info_logs,
            self.captureOnCommitCallbacks(execute=True),
        ):
            result = self.client_post("/json/export/realm")
        self.assertTrue(
            info_logs.output[0].startswith("ERROR:root:Data export for zulip failed after ")
        )
        mock_export.assert_called_once()
        # This is a success because the failure is swallowed in the queue worker
        data = self.assert_json_success(result)
        export_id = data["id"]

        # Check that the export shows up as failed
        result = self.client_get("/json/export/realm")
        response_dict = self.assert_json_success(result)
        export_dict = response_dict["exports"]
        self.assert_length(export_dict, 1)
        self.assertEqual(export_dict[0]["id"], export_id)
        self.assertEqual(export_dict[0]["pending"], False)
        self.assertIsNone(export_dict[0]["export_url"])
        self.assertIsNone(export_dict[0]["deleted_timestamp"])
        self.assertIsNotNone(export_dict[0]["failed_timestamp"])
        self.assertEqual(export_dict[0]["acting_user_id"], admin.id)

        export_row = RealmExport.objects.get(id=export_id)
        self.assertEqual(export_row.status, RealmExport.FAILED)

        # Check that we can't delete it
        result = self.client_delete(f"/json/export/realm/{export_id}")
        self.assert_json_error(result, "Export failed, nothing to delete")

        # If the queue worker sees the same export-id again, it aborts
        # instead of retrying
        with (
            patch("zerver.lib.export.do_export_realm") as mock_export,
            self.assertLogs(level="INFO") as info_logs,
        ):
            queue_json_publish_rollback_unsafe(
                "deferred_work",
                {
                    "type": "realm_export",
                    "user_profile_id": admin.id,
                    "realm_export_id": export_id,
                },
            )
        mock_export.assert_not_called()
        self.assertEqual(
            info_logs.output,
            [
                (
                    "ERROR:zerver.worker.deferred_work:Marking export for realm zulip "
                    "as failed due to retry -- possible OOM during export?"
                )
            ],
        )

    def test_realm_export_rate_limited(self) -> None:
        admin = self.example_user("iago")
        self.login_user(admin)

        export_rows = RealmExport.objects.all()
        self.assert_length(export_rows, 0)

        exports = [
            RealmExport(
                realm=admin.realm,
                type=RealmExport.EXPORT_PUBLIC,
                date_requested=timezone_now(),
                acting_user=admin,
            )
            for i in range(5)
        ]
        RealmExport.objects.bulk_create(exports)

        with self.assertRaises(JsonableError) as error:
            export_realm(HostRequestMock(), admin)
        self.assertEqual(str(error.exception), "Exceeded rate limit.")

    def test_upload_and_message_limit(self) -> None:
        admin = self.example_user("iago")
        self.login_user(admin)
        realm_count = RealmCount.objects.create(
            realm_id=admin.realm.id,
            end_time=timezone_now(),
            value=0,
            property="messages_sent:message_type:day",
            subgroup="public_stream",
        )

        # Space limit is set as 20 GiB
        with patch(
            "zerver.models.Realm.currently_used_upload_space_bytes",
            return_value=21 * 1024 * 1024 * 1024,
        ):
            result = self.client_post("/json/export/realm")
        self.assert_json_error(
            result,
            f"The export you requested is too large for automatic processing. Please request a manual export by contacting {settings.ZULIP_ADMINISTRATOR}.",
        )

        # Message limit is set as 250000
        realm_count.value = 250001
        realm_count.save(update_fields=["value"])
        result = self.client_post("/json/export/realm")
        self.assert_json_error(
            result,
            f"The export you requested is too large for automatic processing. Please request a manual export by contacting {settings.ZULIP_ADMINISTRATOR}.",
        )

    def test_get_users_export_consents(self) -> None:
        admin = self.example_user("iago")
        self.login_user(admin)

        # By default, export consent is set to False.
        self.assertFalse(
            UserProfile.objects.filter(
                realm=admin.realm, is_active=True, is_bot=False, allow_private_data_export=True
            ).exists()
        )

        # Hamlet and Aaron consented to export their private data.
        hamlet = self.example_user("hamlet")
        aaron = self.example_user("aaron")
        for user in [hamlet, aaron]:
            do_change_user_setting(user, "allow_private_data_export", True, acting_user=None)

        # Verify export consents of users.
        aaron.role = UserProfile.ROLE_REALM_ADMINISTRATOR
        aaron.save()
        do_change_user_setting(
            aaron,
            "email_address_visibility",
            UserProfile.EMAIL_ADDRESS_VISIBILITY_NOBODY,
            acting_user=aaron,
        )
        result = self.client_get("/json/export/realm/consents")
        response_dict = self.assert_json_success(result)
        export_consents = response_dict["export_consents"]
        for export_consent in export_consents:
            if export_consent["user_id"] == aaron.id:
                self.assertEqual(
                    export_consent["email_address_visibility"],
                    UserProfile.EMAIL_ADDRESS_VISIBILITY_NOBODY,
                )
            if export_consent["user_id"] in [hamlet.id, aaron.id]:
                self.assertTrue(export_consent["consented"])
                continue
            self.assertFalse(export_consent["consented"])

    def test_allow_export_with_no_usable_user_accounts(self) -> None:
        """
        Generating export with no usable accounts should be allowed.
        """
        admin = self.example_user("iago")
        self.login_user(admin)

        def check_success_realm_export(acting_user: UserProfile, export_type: int) -> None:
            with patch("zerver.views.realm_export.queue_event_on_commit") as mock_event_on_commit:
                result = self.client_post(
                    "/json/export/realm",
                    {
                        "export_type": export_type,
                    },
                )
            self.assert_json_success(result)
            response = orjson.loads(result.content)
            realm_export_id = response["id"]
            expected_event = {
                "type": "realm_export",
                "user_profile_id": acting_user.id,
                "realm_export_id": realm_export_id,
            }
            mock_event_on_commit.assert_called_once_with("deferred_work", expected_event)
            realm_export = RealmExport.objects.get(id=realm_export_id)
            self.assertEqual(realm_export.type, export_type)

        # For standard export, this means no one consented to their
        # private data being shared.
        UserProfile.objects.filter(
            role=UserProfile.ROLE_REALM_OWNER,
            realm=admin.realm,
        ).update(
            allow_private_data_export=False,
        )
        check_success_realm_export(admin, RealmExport.EXPORT_FULL_WITH_CONSENT)

        # For public export, this means everyone has set their email
        # address visibility policy to nobody.
        UserProfile.objects.filter(
            role=UserProfile.ROLE_REALM_OWNER,
            realm=admin.realm,
        ).update(
            email_address_visibility=UserProfile.EMAIL_ADDRESS_VISIBILITY_NOBODY,
        )

        check_success_realm_export(admin, RealmExport.EXPORT_PUBLIC)
```

--------------------------------------------------------------------------------

---[FILE: test_realm_linkifiers.py]---
Location: zulip-main/zerver/tests/test_realm_linkifiers.py
Signals: Django

```python
import re

import orjson
from django.core.exceptions import ValidationError
from typing_extensions import override

from zerver.lib.test_classes import ZulipTestCase
from zerver.models import RealmAuditLog, RealmFilter
from zerver.models.linkifiers import url_template_validator
from zerver.models.realm_audit_logs import AuditLogEventType


class RealmFilterTest(ZulipTestCase):
    @override
    def setUp(self) -> None:
        super().setUp()
        iago = self.example_user("iago")
        RealmFilter.objects.filter(realm=iago.realm).delete()

    def test_list(self) -> None:
        self.login("iago")
        data = {
            "pattern": "#(?P<id>[123])",
            "url_template": "https://realm.com/my_realm_filter/{id}",
        }
        result = self.client_post("/json/realm/filters", info=data)
        self.assert_json_success(result)

        result = self.client_get("/json/realm/linkifiers")
        linkifiers = self.assert_json_success(result)["linkifiers"]
        self.assert_length(linkifiers, 1)
        self.assertEqual(linkifiers[0]["pattern"], "#(?P<id>[123])")
        self.assertEqual(linkifiers[0]["url_template"], "https://realm.com/my_realm_filter/{id}")

    def test_create(self) -> None:
        self.login("iago")
        data = {"pattern": "", "url_template": "https://realm.com/my_realm_filter/{id}"}
        result = self.client_post("/json/realm/filters", info=data)
        self.assert_json_error(result, "This field cannot be blank.")

        data["pattern"] = "(foo"
        result = self.client_post("/json/realm/filters", info=data)
        self.assert_json_error(result, "Bad regular expression: missing ): (foo")

        data["pattern"] = r"ZUL-(?P<id>\d????)"
        result = self.client_post("/json/realm/filters", info=data)
        self.assert_json_error(result, "Bad regular expression: bad repetition operator: ????")

        data["pattern"] = r"ZUL-(?P<id>\d+)"
        data["url_template"] = "$fgfg"
        result = self.client_post("/json/realm/filters", info=data)
        self.assert_json_error(
            result, "Group 'id' in linkifier pattern is not present in URL template."
        )

        data["pattern"] = r"ZUL-(?P<id>\d+)"
        data["url_template"] = "https://realm.com/my_realm_filter/"
        result = self.client_post("/json/realm/filters", info=data)
        self.assert_json_error(
            result, "Group 'id' in linkifier pattern is not present in URL template."
        )

        data["url_template"] = "https://realm.com/my_realm_filter/#hashtag/{id}"
        result = self.client_post("/json/realm/filters", info=data)
        self.assert_json_success(result)
        self.assertIsNotNone(re.match(data["pattern"], "ZUL-15"))

        data["pattern"] = r"ZUL2-(?P<id>\d+)"
        data["url_template"] = "https://realm.com/my_realm_filter/?value={id}"
        result = self.client_post("/json/realm/filters", info=data)
        self.assert_json_success(result)
        self.assertIsNotNone(re.match(data["pattern"], "ZUL2-15"))

        data["pattern"] = r"_code=(?P<id>[0-9a-zA-Z]+)"
        data["url_template"] = "https://example.com/product/{id}/details"
        result = self.client_post("/json/realm/filters", info=data)
        self.assert_json_success(result)
        self.assertIsNotNone(re.match(data["pattern"], "_code=123abcdZ"))

        data["pattern"] = r"PR (?P<id>[0-9]+)"
        data["url_template"] = (
            "https://example.com/~user/web#view_type=type&model=model&action=12345&id={id}"
        )
        result = self.client_post("/json/realm/filters", info=data)
        self.assert_json_success(result)
        self.assertIsNotNone(re.match(data["pattern"], "PR 123"))

        data["pattern"] = r"lp/(?P<id>[0-9]+)"
        data["url_template"] = "https://realm.com/my_realm_filter/?value={id}&sort=reverse"
        result = self.client_post("/json/realm/filters", info=data)
        self.assert_json_success(result)
        self.assertIsNotNone(re.match(data["pattern"], "lp/123"))

        data["pattern"] = r"lp:(?P<id>[0-9]+)"
        data["url_template"] = "https://realm.com/my_realm_filter/?sort=reverse&value={id}"
        result = self.client_post("/json/realm/filters", info=data)
        self.assert_json_success(result)
        self.assertIsNotNone(re.match(data["pattern"], "lp:123"))

        data["pattern"] = r"!(?P<id>[0-9]+)"
        data["url_template"] = "https://realm.com/index.pl?Action=AgentTicketZoom;TicketNumber={id}"
        result = self.client_post("/json/realm/filters", info=data)
        self.assert_json_success(result)
        self.assertIsNotNone(re.match(data["pattern"], "!123"))

        # This block of tests is for mismatches between field sets
        data["pattern"] = r"ZUL-(?P<id>\d+)"
        data["url_template"] = r"https://realm.com/my_realm_filter/{hello}"
        result = self.client_post("/json/realm/filters", info=data)
        self.assert_json_error(
            result, "Group 'hello' in URL template is not present in linkifier pattern."
        )

        data["pattern"] = r"ZUL-(?P<id>\d+)-(?P<hello>\d+)"
        data["url_template"] = r"https://realm.com/my_realm_filter/{hello}"
        result = self.client_post("/json/realm/filters", info=data)
        self.assert_json_error(
            result, "Group 'id' in linkifier pattern is not present in URL template."
        )

        data["pattern"] = r"ZULZ-(?P<hello>\d+)-(?P<world>\d+)"
        data["url_template"] = r"https://realm.com/my_realm_filter/{hello}/{world}"
        result = self.client_post("/json/realm/filters", info=data)
        self.assert_json_success(result)

        data["pattern"] = r"ZUL-(?P<id>\d+)-(?P<hello>\d+)-(?P<world>\d+)"
        data["url_template"] = r"https://realm.com/my_realm_filter/{hello}"
        result = self.client_post("/json/realm/filters", info=data)
        self.assert_json_error(
            result, "Group 'id' in linkifier pattern is not present in URL template."
        )

        data["pattern"] = r"ZUL-URL-(?P<id>\d+)"
        data["url_template"] = "https://example.com/%ba/{id}"
        result = self.client_post("/json/realm/filters", info=data)
        self.assert_json_success(result)

        data["pattern"] = r"(?P<org>[a-zA-Z0-9_-]+)/(?P<repo>[a-zA-Z0-9_-]+)#(?P<id>[0-9]+)"
        data["url_template"] = "https://github.com/{org}/{repo}/issue/{id}"
        result = self.client_post("/json/realm/filters", info=data)
        self.assert_json_success(result)
        self.assertIsNotNone(re.match(data["pattern"], "zulip/zulip#123"))

        data["pattern"] = (
            r"FOO_(?P<id>[a-f]{5});(?P<zone>[a-f]);(?P<domain>[a-z]+);(?P<location>[a-z]+);(?P<name>[a-z]{2,8});(?P<chapter>[0-9]{2,3});(?P<fragment>[a-z]{2,8})"
        )
        data["url_template"] = (
            "https://zone_{zone}{.domain}.net/ticket{/location}{/id}{?name,chapter}{#fragment:5}"
        )
        result = self.client_post("/json/realm/filters", info=data)
        self.assert_json_success(result)

    def test_not_realm_admin(self) -> None:
        self.login("hamlet")
        result = self.client_post("/json/realm/filters")
        self.assert_json_error(result, "Must be an organization administrator")
        result = self.client_delete("/json/realm/filters/15")
        self.assert_json_error(result, "Must be an organization administrator")

    def test_delete(self) -> None:
        self.login("iago")
        data = {
            "pattern": "#(?P<id>[123])",
            "url_template": "https://realm.com/my_realm_filter/{id}",
        }
        result = self.client_post("/json/realm/filters", info=data)
        linkifier_id = self.assert_json_success(result)["id"]
        linkifiers_count = RealmFilter.objects.count()
        result = self.client_delete(f"/json/realm/filters/{linkifier_id + 1}")
        self.assert_json_error(result, "Linkifier not found.")

        result = self.client_delete(f"/json/realm/filters/{linkifier_id}")
        self.assert_json_success(result)
        self.assertEqual(RealmFilter.objects.count(), linkifiers_count - 1)

    def test_update(self) -> None:
        self.login("iago")
        data = {
            "pattern": "#(?P<id>[123])",
            "url_template": "https://realm.com/my_realm_filter/{id}",
        }
        result = self.client_post("/json/realm/filters", info=data)
        linkifier_id = self.assert_json_success(result)["id"]
        data = {
            "pattern": "#(?P<id>[0-9]+)",
            "url_template": "https://realm.com/my_realm_filter/issues/{id}",
        }
        result = self.client_patch(f"/json/realm/filters/{linkifier_id}", info=data)
        self.assert_json_success(result)
        self.assertIsNotNone(re.match(data["pattern"], "#1234"))

        # Verify that the linkifier is updated accordingly.
        result = self.client_get("/json/realm/linkifiers")
        linkifier = self.assert_json_success(result)["linkifiers"]
        self.assert_length(linkifier, 1)
        self.assertEqual(linkifier[0]["pattern"], "#(?P<id>[0-9]+)")
        self.assertEqual(
            linkifier[0]["url_template"], "https://realm.com/my_realm_filter/issues/{id}"
        )

        data = {
            "pattern": r"ZUL-(?P<id>\d????)",
            "url_template": "https://realm.com/my_realm_filter/{id}",
        }
        result = self.client_patch(f"/json/realm/filters/{linkifier_id}", info=data)
        self.assert_json_error(result, "Bad regular expression: bad repetition operator: ????")

        data["pattern"] = r"ZUL-(?P<id>\d+)"
        data["url_template"] = "$fgfg"
        result = self.client_patch(f"/json/realm/filters/{linkifier_id}", info=data)
        self.assert_json_error(
            result, "Group 'id' in linkifier pattern is not present in URL template."
        )

        data["pattern"] = r"#(?P<id>[123])"
        data["url_template"] = "https://realm.com/my_realm_filter/{id}"
        result = self.client_patch(f"/json/realm/filters/{linkifier_id + 1}", info=data)
        self.assert_json_error(result, "Linkifier not found.")

        data["pattern"] = r"#(?P<id>[123])"
        data["url_template"] = "{id"
        result = self.client_patch(f"/json/realm/filters/{linkifier_id}", info=data)
        self.assert_json_error(result, "Invalid URL template.")

    def test_valid_urls(self) -> None:
        valid_urls = [
            "http://example.com/",
            "https://example.com/",
            "https://user:password@example.com/",
            "https://example.com/@user/thing",
            "https://example.com/!path",
            "https://example.com/foo.bar",
            "https://example.com/foo[bar]",
            "https://example.com/{foo}",
            "https://example.com/{foo}{bars}",
            "https://example.com/{foo}/and/{bar}",
            "https://example.com/?foo={foo}",
            "https://example.com/%ab",
            "https://example.com/%ba",
            "https://example.com/%21",
            "https://example.com/words%20with%20spaces",
            "https://example.com/back%20to%20{back}",
            "https://example.com/encoded%2fwith%2fletters",
            "https://example.com/encoded%2Fwith%2Fupper%2Fcase%2Fletters",
            "https://example.com/%%",
            "https://example.com/%%(",
            "https://example.com/%%()",
            "https://example.com/%%(foo",
            "https://example.com/%%(foo)",
            "https://example.com/%%(foo)s",
            "https://example.com{/foo,bar,baz}",
            "https://example.com/{?foo*}",
            "https://example.com/{+foo,bar}",
            "https://chat{.domain}.com/{#foo}",
            "https://zone_{zone}{.domain}.net/ticket{/location}{/id}{?name,chapter}{#fragment:5}",
            "$not_a_url$",
        ]
        for url in valid_urls:
            url_template_validator(url)

        # No need to test this extensively, because most of the invalid
        # cases should be handled and tested in the uri_template library
        # we used for validation.
        invalid_urls = [
            "https://example.com/{foo",
            "https://example.com/{{}",
            "https://example.com/{//foo}",
            "https://example.com/{bar++}",
        ]
        for url in invalid_urls:
            with self.assertRaises(ValidationError):
                url_template_validator(url)

    def test_reorder_linkifiers(self) -> None:
        iago = self.example_user("iago")
        self.login("iago")

        def assert_linkifier_audit_logs(expected_id_order: list[int]) -> None:
            """Check if the audit log created orders the linkifiers correctly"""
            extra_data = (
                RealmAuditLog.objects.filter(
                    acting_user=iago, event_type=AuditLogEventType.REALM_LINKIFIERS_REORDERED
                )
                .latest("event_time")
                .extra_data
            )
            audit_logged_ids = [
                linkifier_dict["id"] for linkifier_dict in extra_data["realm_linkifiers"]
            ]
            self.assertListEqual(expected_id_order, audit_logged_ids)

        def assert_linkifier_order(expected_id_order: list[int]) -> None:
            """Verify that the realm audit log created matches the expected ordering"""
            result = self.client_get("/json/realm/linkifiers")
            actual_id_order = [
                linkifier["id"] for linkifier in self.assert_json_success(result)["linkifiers"]
            ]
            self.assertListEqual(expected_id_order, actual_id_order)

        def reorder_verify_succeed(expected_id_order: list[int]) -> None:
            """Send a reorder request and verify that it succeeds"""
            result = self.client_patch(
                "/json/realm/linkifiers",
                {"ordered_linkifier_ids": orjson.dumps(expected_id_order).decode()},
            )
            self.assert_json_success(result)

        reorder_verify_succeed([])
        self.assertEqual(
            RealmAuditLog.objects.filter(
                realm=iago.realm, event_type=AuditLogEventType.REALM_LINKIFIERS_REORDERED
            ).count(),
            0,
        )

        linkifiers = [
            {
                "pattern": "1#(?P<id>[123])",
                "url_template": "https://filter.com/foo/{id}",
            },
            {
                "pattern": "2#(?P<id>[123])",
                "url_template": "https://filter.com/bar/{id}",
            },
            {
                "pattern": "3#(?P<id>[123])",
                "url_template": "https://filter.com/baz/{id}",
            },
        ]
        original_id_order = []
        for linkifier in linkifiers:
            result = self.client_post("/json/realm/filters", linkifier)
            original_id_order.append(self.assert_json_success(result)["id"])
        assert_linkifier_order(original_id_order)
        self.assertListEqual([0, 1, 2], list(RealmFilter.objects.values_list("order", flat=True)))

        # The creation order orders the linkifiers by default.
        # When the order values are the same, fallback to order by ID.
        RealmFilter.objects.all().update(order=0)
        assert_linkifier_order(original_id_order)

        # This should successfully reorder the linkifiers.
        new_order = [original_id_order[2], original_id_order[1], original_id_order[0]]
        reorder_verify_succeed(new_order)
        assert_linkifier_audit_logs(new_order)
        assert_linkifier_order(new_order)

        # After reordering, newly created linkifier is ordered at the last, and
        # the other linkifiers are unchanged.
        result = self.client_post(
            "/json/realm/filters", {"pattern": "3#123", "url_template": "https://example.com"}
        )
        new_linkifier_id = self.assert_json_success(result)["id"]
        new_order = [*new_order, new_linkifier_id]
        assert_linkifier_order(new_order)

        # Deleting a linkifier should preserve the order.
        deleted_linkifier_id = new_order[2]
        result = self.client_delete(f"/json/realm/filters/{deleted_linkifier_id}")
        self.assert_json_success(result)
        new_order = [*new_order[:2], new_linkifier_id]
        assert_linkifier_order(new_order)

        # Extra non-existent ids are ignored.
        new_order = [new_order[2], new_order[0], new_order[1]]
        result = self.client_patch(
            "/json/realm/linkifiers", {"ordered_linkifier_ids": [deleted_linkifier_id, *new_order]}
        )
        self.assert_json_error(
            result, "The ordered list must enumerate all existing linkifiers exactly once"
        )

        # Duplicated IDs are not allowed.
        new_order = [*new_order, new_order[0]]
        result = self.client_patch("/json/realm/linkifiers", {"ordered_linkifier_ids": new_order})
        self.assert_json_error(result, "The ordered list must not contain duplicated linkifiers")

        # Incomplete lists of linkifiers are not allowed.
        result = self.client_patch(
            "/json/realm/linkifiers", {"ordered_linkifier_ids": new_order[:2]}
        )
        self.assert_json_error(
            result, "The ordered list must enumerate all existing linkifiers exactly once"
        )
```

--------------------------------------------------------------------------------

````
