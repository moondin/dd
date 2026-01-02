---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 1043
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1043 of 1290)

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

---[FILE: test_realm_domains.py]---
Location: zulip-main/zerver/tests/test_realm_domains.py
Signals: Django

```python
import orjson
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
from typing_extensions import override

from zerver.actions.create_realm import do_create_realm
from zerver.actions.realm_domains import do_change_realm_domain, do_remove_realm_domain
from zerver.actions.realm_settings import do_set_realm_property
from zerver.lib.domains import validate_domain
from zerver.lib.email_validation import email_allowed_for_realm
from zerver.lib.test_classes import ZulipTestCase
from zerver.models import RealmDomain, UserProfile
from zerver.models.realms import DomainNotAllowedForRealmError, get_realm


class RealmDomainTest(ZulipTestCase):
    @override
    def setUp(self) -> None:
        super().setUp()
        realm = get_realm("zulip")
        do_set_realm_property(realm, "emails_restricted_to_domains", True, acting_user=None)

    def test_list_realm_domains(self) -> None:
        self.login("iago")
        realm = get_realm("zulip")
        RealmDomain.objects.create(realm=realm, domain="acme.com", allow_subdomains=True)
        result = self.client_get("/json/realm/domains")
        received = self.assert_json_success(result)["domains"]
        expected = [
            {"domain": "zulip.com", "allow_subdomains": False},
            {"domain": "acme.com", "allow_subdomains": True},
        ]
        self.assertEqual(received, expected)

    def test_not_realm_owner(self) -> None:
        self.login("iago")
        result = self.client_post("/json/realm/domains")
        self.assert_json_error(result, "Must be an organization owner")
        result = self.client_patch("/json/realm/domains/15")
        self.assert_json_error(result, "Must be an organization owner")
        result = self.client_delete("/json/realm/domains/15")
        self.assert_json_error(result, "Must be an organization owner")

    def test_create_realm_domain(self) -> None:
        self.login("desdemona")
        data = {
            "domain": "",
            "allow_subdomains": orjson.dumps(True).decode(),
        }
        result = self.client_post("/json/realm/domains", info=data)
        self.assert_json_error(result, "Invalid domain: Domain can't be empty.")

        data["domain"] = "acme.com"
        result = self.client_post("/json/realm/domains", info=data)
        self.assert_json_success(result)
        realm = get_realm("zulip")
        self.assertTrue(
            RealmDomain.objects.filter(
                realm=realm, domain="acme.com", allow_subdomains=True
            ).exists()
        )

        result = self.client_post("/json/realm/domains", info=data)
        self.assert_json_error(
            result, "The domain acme.com is already a part of your organization."
        )

        mit_user_profile = self.mit_user("sipbtest")
        self.login_user(mit_user_profile)

        self.set_user_role(mit_user_profile, UserProfile.ROLE_REALM_OWNER)

        result = self.client_post(
            "/json/realm/domains", info=data, HTTP_HOST=mit_user_profile.realm.host
        )
        self.assert_json_success(result)

    def test_patch_realm_domain(self) -> None:
        self.login("desdemona")
        realm = get_realm("zulip")
        RealmDomain.objects.create(realm=realm, domain="acme.com", allow_subdomains=False)
        data = {
            "allow_subdomains": orjson.dumps(True).decode(),
        }
        url = "/json/realm/domains/acme.com"
        result = self.client_patch(url, data)
        self.assert_json_success(result)
        self.assertTrue(
            RealmDomain.objects.filter(
                realm=realm, domain="acme.com", allow_subdomains=True
            ).exists()
        )

        url = "/json/realm/domains/non-existent.com"
        result = self.client_patch(url, data)
        self.assertEqual(result.status_code, 400)
        self.assert_json_error(result, "No entry found for domain non-existent.com.")

    def test_delete_realm_domain(self) -> None:
        self.login("desdemona")
        realm = get_realm("zulip")
        RealmDomain.objects.create(realm=realm, domain="acme.com")
        result = self.client_delete("/json/realm/domains/non-existent.com")
        self.assertEqual(result.status_code, 400)
        self.assert_json_error(result, "No entry found for domain non-existent.com.")

        result = self.client_delete("/json/realm/domains/acme.com")
        self.assert_json_success(result)
        self.assertFalse(RealmDomain.objects.filter(domain="acme.com").exists())
        self.assertTrue(realm.emails_restricted_to_domains)

    def test_delete_all_realm_domains(self) -> None:
        self.login("iago")
        realm = get_realm("zulip")
        query = RealmDomain.objects.filter(realm=realm)

        self.assertTrue(realm.emails_restricted_to_domains)
        for realm_domain in query.all():
            do_remove_realm_domain(realm_domain, acting_user=None)
        self.assertEqual(query.count(), 0)
        # Deleting last realm_domain should set `emails_restricted_to_domains` to False.
        # This should be tested on a fresh instance, since the cached objects
        # would not be updated.
        self.assertFalse(get_realm("zulip").emails_restricted_to_domains)

    def test_email_allowed_for_realm(self) -> None:
        realm1 = do_create_realm("testrealm1", "Test Realm 1", emails_restricted_to_domains=True)
        realm2 = do_create_realm("testrealm2", "Test Realm 2", emails_restricted_to_domains=True)

        realm_domain = RealmDomain.objects.create(
            realm=realm1, domain="test1.com", allow_subdomains=False
        )
        RealmDomain.objects.create(realm=realm2, domain="test2.test1.com", allow_subdomains=True)

        email_allowed_for_realm("user@test1.com", realm1)
        with self.assertRaises(DomainNotAllowedForRealmError):
            email_allowed_for_realm("user@test2.test1.com", realm1)
        email_allowed_for_realm("user@test2.test1.com", realm2)
        email_allowed_for_realm("user@test3.test2.test1.com", realm2)
        with self.assertRaises(DomainNotAllowedForRealmError):
            email_allowed_for_realm("user@test3.test1.com", realm2)

        do_change_realm_domain(realm_domain, True, acting_user=None)
        email_allowed_for_realm("user@test1.com", realm1)
        email_allowed_for_realm("user@test2.test1.com", realm1)
        with self.assertRaises(DomainNotAllowedForRealmError):
            email_allowed_for_realm("user@test2.com", realm1)

    def test_realm_realm_domains_uniqueness(self) -> None:
        realm = get_realm("zulip")
        with self.assertRaises(IntegrityError):
            RealmDomain.objects.create(realm=realm, domain="zulip.com", allow_subdomains=True)

    def test_validate_domain(self) -> None:
        invalid_domains = [
            "",
            "test",
            "t.",
            "test.",
            ".com",
            "-test",
            "test...com",
            "test-",
            "test_domain.com",
            "test.-domain.com",
            "a" * 255 + ".com",
        ]
        for domain in invalid_domains:
            with self.assertRaises(ValidationError):
                validate_domain(domain)

        valid_domains = ["acme.com", "x-x.y.3.z"]
        for domain in valid_domains:
            validate_domain(domain)
```

--------------------------------------------------------------------------------

---[FILE: test_realm_emoji.py]---
Location: zulip-main/zerver/tests/test_realm_emoji.py

```python
from unittest import mock

from zerver.actions.create_realm import do_create_realm
from zerver.actions.create_user import do_create_user
from zerver.actions.realm_emoji import check_add_realm_emoji
from zerver.actions.realm_settings import (
    do_change_realm_permission_group_setting,
    do_set_realm_property,
)
from zerver.actions.user_groups import check_add_user_group
from zerver.lib.emoji import get_emoji_file_name
from zerver.lib.exceptions import JsonableError
from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.test_helpers import get_test_image_file
from zerver.lib.thumbnail import BadImageError
from zerver.models import NamedUserGroup, Realm, RealmEmoji, UserProfile
from zerver.models.groups import SystemGroups
from zerver.models.realms import get_realm


class RealmEmojiTest(ZulipTestCase):
    def create_test_emoji(self, name: str, author: UserProfile) -> RealmEmoji:
        with get_test_image_file("img.png") as img_file:
            realm_emoji = check_add_realm_emoji(
                realm=author.realm,
                name=name,
                author=author,
                image_file=img_file,
                content_type="image/png",
            )
            if realm_emoji is None:
                raise Exception("Error creating test emoji.")  # nocoverage
        return realm_emoji

    def create_test_emoji_with_no_author(self, name: str, realm: Realm) -> RealmEmoji:
        realm_emoji = RealmEmoji.objects.create(realm=realm, name=name, file_name=name)
        return realm_emoji

    def test_list(self) -> None:
        emoji_author = self.example_user("iago")
        self.login_user(emoji_author)
        self.create_test_emoji("my_emoji", emoji_author)

        result = self.client_get("/json/realm/emoji")
        response_dict = self.assert_json_success(result)
        self.assert_length(response_dict["emoji"], 2)

    def test_list_no_author(self) -> None:
        self.login("iago")
        realm = get_realm("zulip")
        realm_emoji = self.create_test_emoji_with_no_author("my_emoji", realm)

        result = self.client_get("/json/realm/emoji")
        content = self.assert_json_success(result)
        self.assert_length(content["emoji"], 2)
        test_emoji = content["emoji"][str(realm_emoji.id)]
        self.assertIsNone(test_emoji["author_id"])

    def test_list_admins_only(self) -> None:
        # Test that realm emoji list is public and realm emojis
        # having no author are also there in the list.
        self.login("othello")
        realm = get_realm("zulip")
        administrators_system_group = NamedUserGroup.objects.get(
            name=SystemGroups.ADMINISTRATORS, realm_for_sharding=realm, is_system_group=True
        )
        do_change_realm_permission_group_setting(
            realm,
            "can_add_custom_emoji_group",
            administrators_system_group,
            acting_user=None,
        )
        realm_emoji = self.create_test_emoji_with_no_author("my_emoji", realm)

        result = self.client_get("/json/realm/emoji")
        content = self.assert_json_success(result)
        self.assert_length(content["emoji"], 2)
        test_emoji = content["emoji"][str(realm_emoji.id)]
        self.assertIsNone(test_emoji["author_id"])

    def test_upload(self) -> None:
        user = self.example_user("iago")
        email = user.email
        self.login_user(user)
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/my_emoji", info=emoji_data)
        self.assert_json_success(result)
        self.assertEqual(200, result.status_code)
        realm_emoji = RealmEmoji.objects.get(name="my_emoji")
        assert realm_emoji.author is not None
        self.assertEqual(realm_emoji.author.email, email)

        result = self.client_get("/json/realm/emoji")
        content = self.assert_json_success(result)
        self.assert_length(content["emoji"], 2)
        test_emoji = content["emoji"][str(realm_emoji.id)]
        self.assertIn("author_id", test_emoji)
        author = UserProfile.objects.get(id=test_emoji["author_id"])
        self.assertEqual(author.email, email)

    def test_override_built_in_emoji_by_admin(self) -> None:
        # Test that only administrators can override built-in emoji.
        self.login("othello")
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/laughing", info=emoji_data)
        self.assert_json_error(
            result,
            "Only administrators can override default emoji.",
        )

        user = self.example_user("iago")
        email = user.email
        self.login_user(user)
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/smile", info=emoji_data)
        self.assert_json_success(result)
        self.assertEqual(200, result.status_code)
        realm_emoji = RealmEmoji.objects.get(name="smile")
        assert realm_emoji.author is not None
        self.assertEqual(realm_emoji.author.email, email)

    def test_realm_emoji_repr(self) -> None:
        realm_emoji = RealmEmoji.objects.get(name="green_tick")
        file_name = get_emoji_file_name("image/png", realm_emoji.id)
        self.assertEqual(
            repr(realm_emoji),
            f"<RealmEmoji: zulip: {realm_emoji.id} green_tick False {file_name}>",
        )

    def test_upload_exception(self) -> None:
        self.login("iago")
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/my_em*oji", info=emoji_data)
        self.assert_json_error(
            result,
            "Emoji names must contain only lowercase English letters, digits, spaces, dashes, and underscores.",
        )

    def test_forward_slash_exception(self) -> None:
        self.login("iago")
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post(
                "/json/realm/emoji/my/emoji/with/forward/slash/", info=emoji_data
            )
        self.assert_json_error(
            result,
            "Emoji names must contain only lowercase English letters, digits, spaces, dashes, and underscores.",
        )

    def test_upload_uppercase_exception(self) -> None:
        self.login("iago")
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/my_EMoji", info=emoji_data)
        self.assert_json_error(
            result,
            "Emoji names must contain only lowercase English letters, digits, spaces, dashes, and underscores.",
        )

    def test_upload_end_character_exception(self) -> None:
        self.login("iago")
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/my_emoji_", info=emoji_data)
        self.assert_json_error(result, "Emoji names must end with either a letter or digit.")

    def test_missing_name_exception(self) -> None:
        self.login("iago")
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/%20", info=emoji_data)
        self.assert_json_error(result, "Emoji name is missing")

    def test_user_settings_for_adding_custom_emoji(self) -> None:
        othello = self.example_user("othello")
        cordelia = self.example_user("cordelia")
        iago = self.example_user("iago")

        realm = othello.realm
        self.login_user(othello)

        self.set_user_role(othello, UserProfile.ROLE_MODERATOR)
        administrators_system_group = NamedUserGroup.objects.get(
            name=SystemGroups.ADMINISTRATORS, realm_for_sharding=realm, is_system_group=True
        )
        do_change_realm_permission_group_setting(
            realm,
            "can_add_custom_emoji_group",
            administrators_system_group,
            acting_user=None,
        )
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/my_emoji_1", info=emoji_data)
        self.assert_json_error(result, "Insufficient permission")

        self.set_user_role(othello, UserProfile.ROLE_REALM_ADMINISTRATOR)
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/my_emoji_1", info=emoji_data)
        self.assert_json_success(result)

        moderators_system_group = NamedUserGroup.objects.get(
            name=SystemGroups.MODERATORS, realm_for_sharding=realm, is_system_group=True
        )
        do_change_realm_permission_group_setting(
            realm,
            "can_add_custom_emoji_group",
            moderators_system_group,
            acting_user=None,
        )
        self.set_user_role(othello, UserProfile.ROLE_MEMBER)
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/my_emoji_2", info=emoji_data)
        self.assert_json_error(result, "Insufficient permission")

        self.set_user_role(othello, UserProfile.ROLE_MODERATOR)
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/my_emoji_2", info=emoji_data)
        self.assert_json_success(result)

        full_members_system_group = NamedUserGroup.objects.get(
            name=SystemGroups.FULL_MEMBERS, realm_for_sharding=realm, is_system_group=True
        )
        do_change_realm_permission_group_setting(
            realm,
            "can_add_custom_emoji_group",
            full_members_system_group,
            acting_user=None,
        )
        do_set_realm_property(othello.realm, "waiting_period_threshold", 100000, acting_user=None)
        self.set_user_role(othello, UserProfile.ROLE_MEMBER)

        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/my_emoji_3", info=emoji_data)
        self.assert_json_error(result, "Insufficient permission")

        do_set_realm_property(othello.realm, "waiting_period_threshold", 0, acting_user=None)
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/my_emoji_3", info=emoji_data)
        self.assert_json_success(result)

        members_system_group = NamedUserGroup.objects.get(
            name=SystemGroups.MEMBERS, realm_for_sharding=realm, is_system_group=True
        )
        do_change_realm_permission_group_setting(
            realm,
            "can_add_custom_emoji_group",
            members_system_group,
            acting_user=None,
        )
        self.set_user_role(othello, UserProfile.ROLE_GUEST)
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/my_emoji_4", info=emoji_data)
        self.assert_json_error(result, "Not allowed for guest users")

        self.set_user_role(othello, UserProfile.ROLE_MEMBER)
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/my_emoji_4", info=emoji_data)
        self.assert_json_success(result)

        # Test for checking setting for non-system user group.
        user_group = check_add_user_group(
            realm, "newgroup", [othello, cordelia], acting_user=othello
        )
        do_change_realm_permission_group_setting(
            realm, "can_add_custom_emoji_group", user_group, acting_user=None
        )

        # Othello is in the allowed user group, so can add custom emoji.
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/my_emoji_5", info=emoji_data)
        self.assert_json_success(result)

        # Iago is not present in the allowed user group, so cannot add custom emoji.
        self.login_user(iago)
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/my_emoji_6", info=emoji_data)
        self.assert_json_error(result, "Insufficient permission")

        # Test for checking the setting for anonymous user group.
        anonymous_user_group = self.create_or_update_anonymous_group_for_setting(
            [othello],
            [administrators_system_group],
        )
        do_change_realm_permission_group_setting(
            realm,
            "can_add_custom_emoji_group",
            anonymous_user_group,
            acting_user=None,
        )

        # Iago is present in the `administrators_system_group` subgroup, so can add
        # custom emoji.
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/my_emoji_6", info=emoji_data)
        self.assert_json_success(result)

        # Othello is the direct member of the allowed anonymous user group, so can add
        # custom emoji.
        self.login_user(othello)
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/my_emoji_7", info=emoji_data)
        self.assert_json_success(result)

        # Cordelia is not present in the anonymous user group, so cannot add custom emoji.
        self.login_user(cordelia)
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/my_emoji_6", info=emoji_data)
        self.assert_json_error(result, "Insufficient permission")

    def test_delete(self) -> None:
        emoji_author = self.example_user("iago")
        self.login_user(emoji_author)
        realm_emoji = self.create_test_emoji("my_emoji", emoji_author)
        result = self.client_delete("/json/realm/emoji/my_emoji")
        self.assert_json_success(result)

        result = self.client_get("/json/realm/emoji")
        emojis = self.assert_json_success(result)["emoji"]
        # We only mark an emoji as deactivated instead of
        # removing it from the database.
        self.assert_length(emojis, 2)
        test_emoji = emojis[str(realm_emoji.id)]
        self.assertEqual(test_emoji["deactivated"], True)

    def test_delete_no_author(self) -> None:
        self.login("iago")
        realm = get_realm("zulip")
        self.create_test_emoji_with_no_author("my_emoji", realm)
        result = self.client_delete("/json/realm/emoji/my_emoji")
        self.assert_json_success(result)

    def test_delete_admin_or_author(self) -> None:
        # Admins can delete emoji added by others also.
        # Non-admins can only delete emoji they added themselves.
        emoji_author = self.example_user("othello")

        self.create_test_emoji("my_emoji_1", emoji_author)
        self.login_user(emoji_author)
        result = self.client_delete("/json/realm/emoji/my_emoji_1")
        self.assert_json_success(result)
        self.logout()

        self.create_test_emoji("my_emoji_2", emoji_author)
        self.login("iago")
        result = self.client_delete("/json/realm/emoji/my_emoji_2")
        self.assert_json_success(result)
        self.logout()

        self.create_test_emoji("my_emoji_3", emoji_author)
        self.login("cordelia")
        result = self.client_delete("/json/realm/emoji/my_emoji_3")
        self.assert_json_error(result, "Must be an organization administrator or emoji author")

    def test_delete_exception(self) -> None:
        self.login("iago")
        result = self.client_delete("/json/realm/emoji/invalid_emoji")
        self.assert_json_error(result, "Emoji 'invalid_emoji' does not exist", status_code=404)

    def test_multiple_upload(self) -> None:
        self.login("iago")
        with get_test_image_file("img.png") as fp1, get_test_image_file("img.png") as fp2:
            result = self.client_post("/json/realm/emoji/my_emoji", {"f1": fp1, "f2": fp2})
        self.assert_json_error(result, "You must upload exactly one file.")

    def test_emoji_upload_success(self) -> None:
        self.login("iago")
        with get_test_image_file("img.gif") as fp:
            result = self.client_post("/json/realm/emoji/my_emoji", {"file": fp})
        self.assert_json_success(result)

    def test_emoji_upload_resize_success(self) -> None:
        self.login("iago")
        with get_test_image_file("still_large_img.gif") as fp:
            result = self.client_post("/json/realm/emoji/my_emoji", {"file": fp})
        self.assert_json_success(result)

    def test_emoji_upload_file_size_error(self) -> None:
        self.login("iago")
        with get_test_image_file("img.png") as fp, self.settings(MAX_EMOJI_FILE_SIZE_MIB=0):
            result = self.client_post("/json/realm/emoji/my_emoji", {"file": fp})
        self.assert_json_error(result, "Uploaded file is larger than the allowed limit of 0 MiB")

    def test_emoji_upload_file_format_error(self) -> None:
        self.login("iago")
        with get_test_image_file("img.tif") as fp:
            result = self.client_post("/json/realm/emoji/my_emoji", {"file": fp})
        self.assert_json_error(result, "Invalid image format")

    def test_upload_already_existed_emoji(self) -> None:
        self.login("iago")
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/green_tick", info=emoji_data)
        self.assert_json_error(result, "A custom emoji with this name already exists.")

    def test_reupload(self) -> None:
        # A user should be able to reupload an emoji with same name.
        self.login("iago")
        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/my_emoji", info=emoji_data)
        self.assert_json_success(result)

        result = self.client_delete("/json/realm/emoji/my_emoji")
        self.assert_json_success(result)

        with get_test_image_file("img.png") as fp1:
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/my_emoji", info=emoji_data)
        self.assert_json_success(result)

        result = self.client_get("/json/realm/emoji")
        emojis = self.assert_json_success(result)["emoji"]
        self.assert_length(emojis, 3)

    def test_failed_file_upload(self) -> None:
        self.login("iago")
        with (
            mock.patch(
                "zerver.lib.upload.local.write_local_file", side_effect=BadImageError(msg="Broken")
            ),
            get_test_image_file("img.png") as fp1,
        ):
            emoji_data = {"f1": fp1}
            result = self.client_post("/json/realm/emoji/my_emoji", info=emoji_data)
        self.assert_json_error(result, "Broken")

    def test_check_admin_realm_emoji(self) -> None:
        # Test that a user A is able to remove a realm emoji uploaded by him
        # and having same name as a deactivated realm emoji uploaded by some
        # other user B.
        emoji_author_1 = self.example_user("cordelia")
        self.create_test_emoji("test_emoji", emoji_author_1)
        self.login_user(emoji_author_1)
        result = self.client_delete("/json/realm/emoji/test_emoji")
        self.assert_json_success(result)

        emoji_author_2 = self.example_user("othello")
        self.create_test_emoji("test_emoji", emoji_author_2)
        self.login_user(emoji_author_2)
        result = self.client_delete("/json/realm/emoji/test_emoji")
        self.assert_json_success(result)

    def test_check_admin_different_realm_emoji(self) -> None:
        # Test that two different realm emojis in two different realms but
        # having same name can be administered independently.
        realm_1 = do_create_realm("test_realm", "test_realm")
        emoji_author_1 = do_create_user(
            "abc@example.com", password="abc", realm=realm_1, full_name="abc", acting_user=None
        )
        self.create_test_emoji("test_emoji", emoji_author_1)

        emoji_author_2 = self.example_user("othello")
        self.create_test_emoji("test_emoji", emoji_author_2)
        self.login_user(emoji_author_2)
        result = self.client_delete("/json/realm/emoji/test_emoji")
        self.assert_json_success(result)

    def test_upload_already_existed_emoji_in_check_add_realm_emoji(self) -> None:
        realm_1 = do_create_realm("test_realm", "test_realm")
        emoji_author = do_create_user(
            "abc@example.com", password="abc", realm=realm_1, full_name="abc", acting_user=None
        )
        emoji_name = "emoji_test"
        with get_test_image_file("img.png") as img_file:
            # Because we want to verify the IntegrityError handling
            # logic in check_add_realm_emoji rather than the primary
            # check in upload_emoji, we need to make this request via
            # that helper rather than via the API.
            check_add_realm_emoji(
                realm=emoji_author.realm,
                name=emoji_name,
                author=emoji_author,
                image_file=img_file,
                content_type="image/png",
            )
            with self.assertRaises(JsonableError):
                check_add_realm_emoji(
                    realm=emoji_author.realm,
                    name=emoji_name,
                    author=emoji_author,
                    image_file=img_file,
                    content_type="image/png",
                )
```

--------------------------------------------------------------------------------

````
