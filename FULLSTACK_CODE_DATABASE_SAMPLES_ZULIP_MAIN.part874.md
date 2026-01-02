---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 874
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 874 of 1290)

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

---[FILE: email_validation.py]---
Location: zulip-main/zerver/lib/email_validation.py
Signals: Django

```python
from collections.abc import Callable
from email.errors import HeaderParseError
from email.headerregistry import Address

from django.core import validators
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

from zerver.lib.name_restrictions import is_disposable_domain

# TODO: Move DisposableEmailError, etc. into here.
from zerver.models import Realm, RealmDomain
from zerver.models.realms import (
    DisposableEmailError,
    DomainNotAllowedForRealmError,
    EmailContainsPlusError,
)
from zerver.models.users import get_users_by_delivery_email, is_cross_realm_bot_email


def validate_is_not_disposable(email: str) -> None:
    try:
        domain = Address(addr_spec=email).domain
    except (HeaderParseError, ValueError):
        raise DisposableEmailError

    if is_disposable_domain(domain):
        raise DisposableEmailError


def get_realm_email_validator(realm: Realm) -> Callable[[str], None]:
    if not realm.emails_restricted_to_domains:
        # Should we also do '+' check for non-restricted realms?
        if realm.disallow_disposable_email_addresses:
            return validate_is_not_disposable

        # allow any email through
        return lambda email: None

    """
    RESTRICTIVE REALMS:

    Some realms only allow emails within a set
    of domains that are configured in RealmDomain.

    We get the set of domains up front so that
    folks can validate multiple emails without
    multiple round trips to the database.
    """

    query = RealmDomain.objects.filter(realm=realm)
    rows = list(query.values("allow_subdomains", "domain"))

    allowed_domains = {r["domain"] for r in rows}

    allowed_subdomains = {r["domain"] for r in rows if r["allow_subdomains"]}

    def validate(email: str) -> None:
        """
        We don't have to do a "disposable" check for restricted
        domains, since the realm is already giving us
        a small whitelist.
        """

        address = Address(addr_spec=email)
        if "+" in address.username:
            raise EmailContainsPlusError

        domain = address.domain.lower()

        if domain in allowed_domains:
            return

        while len(domain) > 0:
            _subdomain, _sep, domain = domain.partition(".")
            if domain in allowed_subdomains:
                return

        raise DomainNotAllowedForRealmError

    return validate


# Is a user with the given email address allowed to be in the given realm?
# (This function does not check whether the user has been invited to the realm.
# So for invite-only realms, this is the test for whether a user can be invited,
# not whether the user can sign up currently.)
def email_allowed_for_realm(email: str, realm: Realm) -> None:
    """
    Avoid calling this in a loop!
    Instead, call get_realm_email_validator()
    outside of the loop.
    """
    get_realm_email_validator(realm)(email)


def validate_email_is_valid(
    email: str,
    validate_email_allowed_in_realm: Callable[[str], None],
) -> str | None:
    try:
        validators.validate_email(email)
    except ValidationError:
        return _("Invalid address.")

    try:
        validate_email_allowed_in_realm(email)
    except DomainNotAllowedForRealmError:
        return _("Outside your domain.")
    except DisposableEmailError:
        return _("Please use your real email address.")
    except EmailContainsPlusError:
        return _("Email addresses containing + are not allowed.")

    return None


def email_reserved_for_system_bots_error(email: str) -> str:
    return f"{email} is reserved for system bots"


def get_existing_user_errors(
    target_realm: Realm,
    emails: set[str],
    *,
    allow_inactive_mirror_dummies: bool,
    verbose: bool = False,
) -> dict[str, tuple[str, bool]]:
    """
    We use this function even for a list of one emails.

    It checks "new" emails to make sure that they don't
    already exist.  There's a bit of fiddly logic related
    to cross-realm bots and mirror dummies too.
    """

    errors: dict[str, tuple[str, bool]] = {}

    users = get_users_by_delivery_email(emails, target_realm).only(
        "delivery_email",
        "is_active",
        "is_mirror_dummy",
    )

    """
    A note on casing: We will preserve the casing used by
    the user for email in most of this code.  The only
    exception is when we do existence checks against
    the `user_dict` dictionary.  (We don't allow two
    users in the same realm to have the same effective
    delivery email.)
    """
    user_dict = {user.delivery_email.lower(): user for user in users}

    def process_email(email: str) -> None:
        if is_cross_realm_bot_email(email):
            if verbose:
                msg = email_reserved_for_system_bots_error(email)
            else:
                msg = _("Reserved for system bots.")
            deactivated = False
            errors[email] = (msg, deactivated)
            return

        existing_user_profile = user_dict.get(email.lower())

        if existing_user_profile is None:
            # HAPPY PATH!  Most people invite users that don't exist yet.
            return

        if existing_user_profile.is_mirror_dummy and allow_inactive_mirror_dummies:
            if existing_user_profile.is_active:
                raise AssertionError("Mirror dummy user is already active!")
            return

        """
        Email has already been taken by a "normal" user.
        """
        deactivated = not existing_user_profile.is_active

        if existing_user_profile.is_active:
            if verbose:
                msg = _("{email} already has an account").format(email=email)
            else:
                msg = _("Already has an account.")
        else:
            msg = _("Account has been deactivated.")

        errors[email] = (msg, deactivated)

    for email in emails:
        process_email(email)

    return errors


def validate_email_not_already_in_realm(
    target_realm: Realm, email: str, *, allow_inactive_mirror_dummies: bool, verbose: bool = True
) -> None:
    """
    NOTE:
        Only use this to validate that a single email
        is not already used in the realm.

        We should start using bulk_check_new_emails()
        for any endpoint that takes multiple emails,
        such as the "invite" interface.
    """
    error_dict = get_existing_user_errors(
        target_realm,
        {email},
        allow_inactive_mirror_dummies=allow_inactive_mirror_dummies,
        verbose=verbose,
    )

    # Loop through errors, the only key should be our email.
    for key, error_info in error_dict.items():
        assert key == email
        msg, _deactivated = error_info
        raise ValidationError(msg)
```

--------------------------------------------------------------------------------

---[FILE: emoji.py]---
Location: zulip-main/zerver/lib/emoji.py
Signals: Django

```python
import hashlib
import os
import re
from dataclasses import dataclass

import orjson
from django.conf import settings
from django.contrib.staticfiles.storage import staticfiles_storage
from django.utils.translation import gettext as _

from zerver.lib.exceptions import JsonableError
from zerver.lib.mime_types import guess_extension
from zerver.lib.storage import static_path
from zerver.lib.upload import upload_backend
from zerver.models import Reaction, Realm, RealmEmoji, UserProfile
from zerver.models.realm_emoji import (
    get_all_custom_emoji_for_realm,
    get_name_keyed_dict_for_active_realm_emoji,
)

emoji_codes_path = static_path("generated/emoji/emoji_codes.json")
if not os.path.exists(emoji_codes_path):  # nocoverage
    # During the collectstatic step of build-release-tarball,
    # prod-static/serve/generated/emoji won't exist yet.
    emoji_codes_path = os.path.join(
        os.path.dirname(__file__),
        "../../static/generated/emoji/emoji_codes.json",
    )

with open(emoji_codes_path, "rb") as fp:
    emoji_codes = orjson.loads(fp.read())

name_to_codepoint = emoji_codes["name_to_codepoint"]
codepoint_to_name = emoji_codes["codepoint_to_name"]
EMOTICON_CONVERSIONS = emoji_codes["emoticon_conversions"]

possible_emoticons = EMOTICON_CONVERSIONS.keys()
possible_emoticon_regexes = (re.escape(emoticon) for emoticon in possible_emoticons)
terminal_symbols = r",.;?!()\[\] \"'\n\t"  # from composebox_typeahead.ts
EMOTICON_RE = (
    rf"(?<![^{terminal_symbols}])(?P<emoticon>("
    + r")|(".join(possible_emoticon_regexes)
    + rf"))(?![^{terminal_symbols}])"
)


def data_url() -> str:
    # This bakes a hash into the URL, which looks something like
    # static/webpack-bundles/files/64.0cdafdf0b6596657a9be.png
    # This is how Django deals with serving static files in a cacheable way.
    # See PR #22275 for details.
    return staticfiles_storage.url("generated/emoji/emoji_api.json")


# Translates emoticons to their colon syntax, e.g. `:smiley:`.
def translate_emoticons(text: str) -> str:
    translated = text

    for emoticon in EMOTICON_CONVERSIONS:
        translated = re.sub(re.escape(emoticon), EMOTICON_CONVERSIONS[emoticon], translated)

    return translated


@dataclass
class EmojiData:
    emoji_code: str
    reaction_type: str


def get_emoji_data(realm_id: int, emoji_name: str) -> EmojiData:
    # Even if emoji_name is either in name_to_codepoint or named "zulip",
    # we still need to call get_realm_active_emoji.
    realm_emoji_dict = get_name_keyed_dict_for_active_realm_emoji(realm_id)
    realm_emoji = realm_emoji_dict.get(emoji_name)

    if realm_emoji is not None:
        emoji_code = str(realm_emoji["id"])
        return EmojiData(emoji_code=emoji_code, reaction_type=Reaction.REALM_EMOJI)

    if emoji_name == "zulip":
        return EmojiData(emoji_code=emoji_name, reaction_type=Reaction.ZULIP_EXTRA_EMOJI)

    if emoji_name in name_to_codepoint:
        emoji_code = name_to_codepoint[emoji_name]
        return EmojiData(emoji_code=emoji_code, reaction_type=Reaction.UNICODE_EMOJI)

    raise JsonableError(_("Emoji '{emoji_name}' does not exist").format(emoji_name=emoji_name))


def check_emoji_request(realm: Realm, emoji_name: str, emoji_code: str, emoji_type: str) -> None:
    # For a given realm and emoji type, checks whether an emoji
    # code is valid for new reactions, or not.
    if emoji_type == "realm_emoji":
        # We cache emoji, so this generally avoids a round trip,
        # but it does require deserializing a bigger data structure
        # than we need.
        realm_emojis = get_all_custom_emoji_for_realm(realm.id)
        realm_emoji = realm_emojis.get(emoji_code)
        if realm_emoji is None:
            raise JsonableError(_("Invalid custom emoji."))
        if realm_emoji["name"] != emoji_name:
            raise JsonableError(_("Invalid custom emoji name."))
        if realm_emoji["deactivated"]:
            raise JsonableError(_("This custom emoji has been deactivated."))
    elif emoji_type == "zulip_extra_emoji":
        if emoji_code not in ["zulip"]:
            raise JsonableError(_("Invalid emoji code."))
        if emoji_name != emoji_code:
            raise JsonableError(_("Invalid emoji name."))
    elif emoji_type == "unicode_emoji":
        if emoji_code not in codepoint_to_name:
            raise JsonableError(_("Invalid emoji code."))
        if name_to_codepoint.get(emoji_name) != emoji_code:
            raise JsonableError(_("Invalid emoji name."))
    else:
        # The above are the only valid emoji types
        raise JsonableError(_("Invalid emoji type."))


def check_remove_custom_emoji(user_profile: UserProfile, emoji_name: str) -> None:
    # normal users can remove emoji they themselves added
    if user_profile.is_realm_admin:
        return

    emoji = RealmEmoji.objects.filter(
        realm=user_profile.realm, name=emoji_name, deactivated=False
    ).first()
    current_user_is_author = (
        emoji is not None and emoji.author is not None and emoji.author.id == user_profile.id
    )
    if not current_user_is_author:
        raise JsonableError(_("Must be an organization administrator or emoji author"))


def check_valid_emoji_name(emoji_name: str) -> None:
    if emoji_name:
        if re.match(r"^[0-9a-z\-_]+(?<![\-_])$", emoji_name):
            return
        if re.match(r"^[0-9a-z\-_]+$", emoji_name):
            raise JsonableError(_("Emoji names must end with either a letter or digit."))
        raise JsonableError(
            _(
                "Emoji names must contain only lowercase English letters, digits, spaces, dashes, and underscores.",
            )
        )
    raise JsonableError(_("Emoji name is missing"))


def get_emoji_url(emoji_file_name: str, realm_id: int, still: bool = False) -> str:
    return upload_backend.get_emoji_url(emoji_file_name, realm_id, still)


def get_emoji_file_name(content_type: str, emoji_id: int) -> str:
    image_ext = guess_extension(content_type, strict=False)
    # The only callsite of this pre-limits the content_type to a
    # reasonable set that we know have extensions.
    assert image_ext is not None

    # We salt this with a server-side secret so that it is not
    # enumerable by clients, and will not collide on the server.  New
    # realm imports may pass a synthetic emoji_id, which is fine as
    # long as it starts at 1, and as such later emoji cannot collide
    # unless there is a legit hash collision.
    #
    # We truncate the hash at 8 characters, as this is enough entropy
    # to make collisions vanishingly unlikely.  In the event of a
    # collusion, the id will advance and a manual retry will succeed.
    hash_key = settings.AVATAR_SALT.encode() + b":" + str(emoji_id).encode()
    return "".join((hashlib.sha256(hash_key).hexdigest()[0:8], image_ext))
```

--------------------------------------------------------------------------------

---[FILE: emoji_utils.py]---
Location: zulip-main/zerver/lib/emoji_utils.py
Signals: Django

```python
# This file doesn't import from django so that we can use it in `build_emoji`


def unqualify_emoji(emoji: str) -> str:
    # Starting from version 4.0.0, `emoji_datasource` package has started to
    # add an emoji presentation variation selector for certain emojis which
    # have defined variation sequences. The emoji presentation selector
    # "qualifies" an emoji, and an "unqualified" version of an emoji does
    # not have an emoji presentation selector.
    #
    # Since in informal environments(like texting and chat), it is more
    # appropriate for an emoji to have a colorful display so until emoji
    # characters have a text presentation selector, it should have a
    # colorful display. Hence we can continue using emoji characters
    # without appending emoji presentation selector.
    # (http://unicode.org/reports/tr51/index.html#Presentation_Style)
    return emoji.replace("\ufe0f", "")


def emoji_to_hex_codepoint(emoji: str) -> str:
    return "-".join(f"{ord(c):04x}" for c in emoji)


def hex_codepoint_to_emoji(hex: str) -> str:
    return "".join(chr(int(h, 16)) for h in hex.split("-"))
```

--------------------------------------------------------------------------------

````
