---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 798
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 798 of 1290)

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

---[FILE: markdown_parse.test.cjs]---
Location: zulip-main/web/tests/markdown_parse.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const url_template_lib = require("url-template");

const {zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const markdown = zrequire("markdown");
const linkifiers = zrequire("linkifiers");

const my_id = 101;

const user_map = new Map([
    [my_id, "Me Myself"],
    [105, "greg"],
]);

function get_actual_name_from_user_id(user_id) {
    return user_map.get(user_id);
}

function get_user_id_from_name(name) {
    for (const [user_id, _name] of user_map.entries()) {
        if (name === _name) {
            return user_id;
        }
    }

    /* istanbul ignore next */
    throw new Error(`unexpected name ${name}`);
}

function is_valid_full_name_and_user_id(name, user_id) {
    return user_map.has(user_id) && user_map.get(user_id) === name;
}

function my_user_id() {
    return my_id;
}

function is_valid_user_id(user_id) {
    return user_map.has(user_id);
}

const staff_group = {
    id: 201,
    name: "Staff",
};

const user_group_map = new Map([[staff_group.name, staff_group]]);

function get_user_group_from_name(name) {
    return user_group_map.get(name);
}

function is_member_of_user_group(user_group_id, user_id) {
    assert.equal(user_group_id, staff_group.id);
    assert.equal(user_id, my_id);
    return true;
}

const social = {
    stream_id: 301,
    name: "social",
};

const sub_map = new Map([[social.name, social]]);

function get_stream_by_name(name) {
    return sub_map.get(name);
}

function stream_hash(stream_id) {
    return `stream-${stream_id}`;
}

function stream_topic_hash(stream_id, topic) {
    return `stream-${stream_id}-topic-${topic}`;
}

function get_emoticon_translations() {
    return [
        {regex: /(:\))/g, replacement_text: ":smile:"},
        {regex: /(<3)/g, replacement_text: ":heart:"},
    ];
}

const emoji_map = new Map([
    ["smile", "1f604"],
    ["alien", "1f47d"],
]);

function get_emoji_codepoint(emoji_name) {
    return emoji_map.get(emoji_name);
}

function get_emoji_name(codepoint) {
    for (const [emoji_name, _codepoint] of emoji_map.entries()) {
        if (codepoint === _codepoint) {
            return emoji_name;
        }
    }

    /* istanbul ignore next */
    throw new Error(`unexpected codepoint ${codepoint}`);
}

const realm_emoji_map = new Map([["heart", "/images/emoji/heart.bmp"]]);

function get_realm_emoji_url(emoji_name) {
    return realm_emoji_map.get(emoji_name);
}

const regex = /#foo(\d+)(?!\w)/g;
const linkifier_map = new Map([
    [
        regex,
        {
            url_template: url_template_lib.parseTemplate("http://foo.com/{id}"),
            group_number_to_name: {1: "id"},
        },
    ],
]);

function get_linkifier_map() {
    return linkifier_map;
}

const helper_config = {
    // user stuff
    get_actual_name_from_user_id,
    get_user_id_from_name,
    is_valid_full_name_and_user_id,
    is_valid_user_id,
    my_user_id,

    // user groups
    get_user_group_from_name,
    is_member_of_user_group,

    // stream hashes
    get_stream_by_name,
    stream_hash,
    stream_topic_hash,

    // settings
    should_translate_emoticons: () => true,

    // emojis
    get_emoji_codepoint,
    get_emoji_name,
    get_emoticon_translations,
    get_realm_emoji_url,

    // linkifiers
    get_linkifier_map,
};

function assert_parse(raw_content, expected_content) {
    const {content} = markdown.parse({raw_content, helper_config});
    assert.equal(content, expected_content);
}

run_test("basics", () => {
    assert_parse("boring", "<p>boring</p>");
    assert_parse("**bold**", "<p><strong>bold</strong></p>");
});

run_test("user mentions", () => {
    assert_parse("@**greg**", '<p><span class="user-mention" data-user-id="105">@greg</span></p>');

    assert_parse("@**|105**", '<p><span class="user-mention" data-user-id="105">@greg</span></p>');

    assert_parse(
        "@**greg|105**",
        '<p><span class="user-mention" data-user-id="105">@greg</span></p>',
    );

    assert_parse(
        "@**Me Myself|101**",
        '<p><span class="user-mention" data-user-id="101">@Me Myself</span></p>',
    );
});

run_test("user group mentions", () => {
    assert_parse(
        "@*Staff*",
        '<p><span class="user-group-mention" data-user-group-id="201">@Staff</span></p>',
    );
});

run_test("stream links", () => {
    assert_parse(
        "#**social**",
        '<p><a class="stream" data-stream-id="301" href="/stream-301">#social</a></p>',
    );

    assert_parse(
        "#**social>lunch**",
        '<p><a class="stream-topic" data-stream-id="301" href="stream-301-topic-lunch">#social &gt; lunch</a></p>',
    );
});

run_test("emojis", () => {
    assert_parse(
        "yup :)",
        '<p>yup <span aria-label="smile" class="emoji emoji-1f604" role="img" title="smile">:smile:</span></p>',
    );
    assert_parse(
        "I <3 JavaScript",
        '<p>I <img alt=":heart:" class="emoji" src="/images/emoji/heart.bmp" title="heart"> JavaScript</p>',
    );
    assert_parse(
        "Mars Attacks! \uD83D\uDC7D",
        '<p>Mars Attacks! <span aria-label="alien" class="emoji emoji-1f47d" role="img" title="alien">:alien:</span></p>',
    );
});

run_test("linkifiers", () => {
    assert_parse(
        "see #foo12345 for details",
        '<p>see <a href="http://foo.com/12345" title="http://foo.com/12345">#foo12345</a> for details</p>',
    );
});

function assert_topic_links(topic, expected_links) {
    const topic_links = markdown.get_topic_links(topic);
    assert.deepEqual(topic_links, expected_links);
}

run_test("topic links", () => {
    linkifiers.initialize([{pattern: "#foo(?P<id>\\d+)", url_template: "http://foo.com/{id}"}]);
    markdown.initialize({
        get_linkifier_map: linkifiers.get_linkifier_map,
    });
    assert_topic_links("progress on #foo101 and #foo102", [
        {
            text: "#foo101",
            url: "http://foo.com/101",
        },
        {
            text: "#foo102",
            url: "http://foo.com/102",
        },
    ]);
});

run_test("topic links repeated", () => {
    // Links generated from repeated patterns should preserve the order.
    const topic =
        "#foo101 https://google.com #foo102 #foo103 https://google.com #foo101 #foo102 #foo103";
    linkifiers.initialize([{pattern: "#foo(?P<id>\\d+)", url_template: "http://foo.com/{id}"}]);
    assert_topic_links(topic, [
        {
            text: "#foo101",
            url: "http://foo.com/101",
        },
        {
            text: "https://google.com",
            url: "https://google.com",
        },
        {
            text: "#foo102",
            url: "http://foo.com/102",
        },
        {
            text: "#foo103",
            url: "http://foo.com/103",
        },
        {
            text: "https://google.com",
            url: "https://google.com",
        },
        {
            text: "#foo101",
            url: "http://foo.com/101",
        },
        {
            text: "#foo102",
            url: "http://foo.com/102",
        },
        {
            text: "#foo103",
            url: "http://foo.com/103",
        },
    ]);
});

run_test("topic links overlapping", () => {
    linkifiers.initialize([
        {pattern: "[a-z]+(?P<id>1\\d+) #[a-z]+", url_template: "http://a.com/{id}"},
        {pattern: "[a-z]+(?P<id>1\\d+)", url_template: "http://b.com/{id}"},
        {pattern: ".+#(?P<id>[a-z]+)", url_template: "http://wildcard.com/{id}"},
        {pattern: "#(?P<id>[a-z]+)", url_template: "http://c.com/{id}"},
    ]);
    // b.com's pattern should be matched while it overlaps with c.com's.
    assert_topic_links("#foo100", [
        {
            text: "foo100",
            url: "http://b.com/100",
        },
    ]);
    // a.com's pattern should be matched while it overlaps with b.com's, wildcard.com's and c.com's.
    assert_topic_links("#asd123 #asd", [
        {
            text: "asd123 #asd",
            url: "http://a.com/123",
        },
    ]);
    // a.com's pattern do not match, wildcard.com's and b.com's patterns should match
    // and the links are ordered by the matched index.
    assert_topic_links("/#asd #foo100", [
        {
            text: "/#asd",
            url: "http://wildcard.com/asd",
        },
        {
            text: "foo100",
            url: "http://b.com/100",
        },
    ]);
    assert_topic_links("foo.anything/#asd", [
        {
            text: "foo.anything/#asd",
            url: "http://wildcard.com/asd",
        },
    ]);

    // While the raw URL "http://foo.com/foo100" appears before b.com's match "foo100",
    // we prioritize the linkifier match first.
    assert_topic_links("http://foo.com/foo100", [
        {
            text: "foo100",
            url: "http://b.com/100",
        },
    ]);

    // Here the raw URL "https://foo.com/#asd" appears after wildcard.com's match "something https://foo.com/#asd".
    // The latter is prioritized and the raw URL does not get included.
    assert_topic_links("something https://foo.com/#asd", [
        {
            text: "something https://foo.com/#asd",
            url: "http://wildcard.com/asd",
        },
    ]);
});

run_test("topic links ordering by priority", () => {
    // The same test case is also implemented in zerver/tests/test_markdown.py
    linkifiers.initialize([
        {pattern: "http", url_template: "http://example.com/"},
        {pattern: "b#(?P<id>[a-z]+)", url_template: "http://example.com/b/{id}"},
        {
            pattern: "a#(?P<aid>[a-z]+) b#(?P<bid>[a-z]+)",
            url_template: "http://example.com/a/{aid}/b/%(bid)",
        },
        {pattern: "a#(?P<id>[a-z]+)", url_template: "http://example.com/a/{id}"},
    ]);

    // There should be 5 link matches in the topic, if ordered from the most prioritized to the least:
    // 1. "http" (linkifier)
    // 2. "b#bar" (linkifier)
    // 3. "a#asd b#bar" (linkifier)
    // 4. "a#asd" (linkifier)
    // 5. "http://foo.com" (raw URL)
    // When there are overlapping matches, the one that appears earlier in the list should
    // have a topic link generated.
    // For this test case, while "a#asd" and "a#asd b#bar" both match and they overlap,
    // there is a match "b#bar" with a higher priority, preventing "a#asd b#bar" from being matched.
    assert_topic_links("http://foo.com a#asd b#bar", [
        {
            text: "http",
            url: "http://example.com/",
        },
        {
            text: "a#asd",
            url: "http://example.com/a/asd",
        },
        {
            text: "b#bar",
            url: "http://example.com/b/bar",
        },
    ]);
});
```

--------------------------------------------------------------------------------

---[FILE: message_delete.test.cjs]---
Location: zulip-main/web/tests/message_delete.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const {page_params} = require("./lib/zpage_params.cjs");

const message_delete = zrequire("message_delete");
const stream_data = zrequire("stream_data");
const people = zrequire("people");
const {set_current_user, set_realm} = zrequire("state_data");
const user_groups = zrequire("user_groups");

mock_esm("../src/group_permission_settings", {
    get_group_permission_setting_config() {
        return {
            allow_everyone_group: false,
        };
    },
});

const realm = make_realm();
set_realm(realm);
const current_user = {};
set_current_user(current_user);

const me = {
    email: "me@zulip.com",
    full_name: "Current User",
    user_id: 100,
};

const moderator = {
    email: "moderator@zulip.com",
    full_name: "Moderator",
    user_id: 2,
    is_moderator: true,
};

const admin = {
    email: "admin@zulip.com",
    full_name: "Admin",
    user_id: 3,
    is_admin: true,
};
// set up user data
const admins_group = {
    name: "Admins",
    id: 1,
    members: new Set([admin.user_id]),
    is_system_group: true,
    direct_subgroup_ids: new Set(),
};

const moderators_group = {
    name: "Moderators",
    id: 2,
    members: new Set([moderator.user_id]),
    is_system_group: true,
    direct_subgroup_ids: new Set([admins_group.id]),
};

const everyone_group = {
    name: "Everyone",
    id: 3,
    members: new Set([me.user_id]),
    is_system_group: true,
    direct_subgroup_ids: new Set([moderators_group.id]),
};

const nobody_group = {
    name: "Nobody",
    id: 4,
    members: new Set(),
    is_system_group: true,
    direct_subgroup_ids: new Set(),
};
user_groups.initialize({
    realm_user_groups: [admins_group, moderators_group, everyone_group, nobody_group],
});

people.init();
people.add_active_user(me);

function initialize_and_override_current_user(user_id, override) {
    people.initialize_current_user(user_id);
    override(current_user, "user_id", user_id);
}

run_test("get_deletability", ({override}) => {
    let message = {
        sent_by_me: false,
        locally_echoed: true,
        sender_id: me.user_id,
    };
    people.add_active_user(moderator);
    override(realm, "realm_can_delete_any_message_group", everyone_group.id);
    override(realm, "realm_can_delete_own_message_group", nobody_group.id);
    override(realm, "realm_message_content_delete_limit_seconds", null);
    initialize_and_override_current_user(me.user_id, override);

    // Spectators cannot delete messages
    page_params.is_spectator = true;
    assert.equal(message_delete.get_deletability(message), false);

    page_params.is_spectator = false;

    // User can delete any message
    assert.equal(message_delete.get_deletability(message), true);

    override(realm, "realm_can_delete_any_message_group", nobody_group.id);
    // User can't delete message sent by others
    assert.equal(message_delete.get_deletability(message), false);

    // Locally echoed messages are not deletable
    message.sent_by_me = true;
    assert.equal(message_delete.get_deletability(message), false);

    message.locally_echoed = false;
    assert.equal(message_delete.get_deletability(message), false);

    override(realm, "realm_can_delete_own_message_group", everyone_group.id);
    assert.equal(message_delete.get_deletability(message), true);

    message.sent_by_me = false;
    assert.equal(message_delete.get_deletability(message), false);
    message.sent_by_me = true;

    const now = new Date();
    const current_timestamp = now / 1000;
    message.timestamp = current_timestamp - 5;

    // Time limit not exceeded
    override(realm, "realm_message_content_delete_limit_seconds", 10);
    assert.equal(message_delete.get_deletability(message), true);

    // Time limit exceeded, so user cannot delete messaeges now
    message.timestamp = current_timestamp - 60;
    assert.equal(message_delete.get_deletability(message), false);

    initialize_and_override_current_user(admin.user_id, override);
    assert.equal(message_delete.get_deletability(message), false);
    // Time limit doesn't apply to users who can delete any message
    override(realm, "realm_can_delete_any_message_group", admins_group.id);
    assert.equal(message_delete.get_deletability(message), true);

    message.sent_by_me = false;
    override(realm, "realm_message_content_delete_limit_seconds", null);

    assert.equal(message_delete.get_deletability(message), true);

    initialize_and_override_current_user(moderator.user_id, override);
    assert.equal(message_delete.get_deletability(message), false);

    // Test per-channel delete permission for deleting any message in the channel.
    const social = {
        subscribed: true,
        color: "red",
        name: "social",
        stream_id: 2,
        can_delete_any_message_group: moderators_group.id,
        can_delete_own_message_group: moderators_group.id,
    };
    const denmark = {
        subscribed: true,
        color: "red",
        name: "denmark",
        stream_id: 3,
        can_delete_any_message_group: nobody_group.id,
        can_delete_own_message_group: moderators_group.id,
    };
    stream_data.add_sub_for_tests(social);
    stream_data.add_sub_for_tests(denmark);

    message = {
        locally_echoed: true,
        type: "stream",
        stream_id: social.stream_id,
    };
    people.add_active_user(moderator);
    override(realm, "realm_can_delete_any_message_group", nobody_group.id);
    override(realm, "realm_can_delete_own_message_group", nobody_group.id);

    message.sender_id = moderator.user_id;
    initialize_and_override_current_user(moderator.user_id, override);
    assert.equal(message_delete.get_deletability(message), true);

    message.sender_id = me.user_id;
    initialize_and_override_current_user(me.user_id, override);
    assert.equal(message_delete.get_deletability(message), false);

    message.stream_id = denmark.stream_id;
    assert.equal(message_delete.get_deletability(message), false);

    message.sender_id = moderator.user_id;
    initialize_and_override_current_user(moderator.user_id, override);
    assert.equal(message_delete.get_deletability(message), false);

    // Test per-channel delete permissions for deleting own messages.
    message.stream_id = social.stream_id;

    message.sender_id = moderator.user_id;
    initialize_and_override_current_user(moderator.user_id, override);
    assert.equal(message_delete.get_deletability(message), true);

    message.sender_id = me.user_id;
    initialize_and_override_current_user(me.user_id, override);
    assert.equal(message_delete.get_deletability(message), false);

    message.stream_id = denmark.stream_id;
    assert.equal(message_delete.get_deletability(message), false);

    initialize_and_override_current_user(moderator.user_id, override);
    assert.equal(message_delete.get_deletability(message), false);

    message.sender_id = moderator.user_id;
    assert.equal(message_delete.get_deletability(message), false);
});
```

--------------------------------------------------------------------------------

---[FILE: message_edit.test.cjs]---
Location: zulip-main/web/tests/message_edit.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const message_edit = zrequire("message_edit");
const {set_current_user, set_realm} = zrequire("state_data");

const is_content_editable = message_edit.is_content_editable;

const stream_data = mock_esm("../src/stream_data");

const realm = make_realm();
set_realm(realm);
const current_user = {};
set_current_user(current_user);

run_test("is_content_editable", ({override}) => {
    // You can't edit a null message
    assert.equal(is_content_editable(null), false);
    // You can't edit a message you didn't send
    assert.equal(
        is_content_editable({
            sent_by_me: false,
        }),
        false,
    );

    // Failed request are currently not editable (though we want to
    // change this back).
    assert.equal(
        is_content_editable({
            sent_by_me: true,
            failed_request: true,
        }),
        false,
    );

    // Locally echoed messages are not editable, since the message hasn't
    // finished being sent yet.
    assert.equal(
        is_content_editable({
            sent_by_me: true,
            locally_echoed: true,
        }),
        false,
    );

    // For the rest of these tests, we only consider messages sent by the
    // user, and that were successfully sent (i.e. no failed_request or local_id)
    const message = {
        sent_by_me: true,
        submessages: [],
    };

    override(realm, "realm_allow_message_editing", false);
    assert.equal(is_content_editable(message), false);

    override(realm, "realm_allow_message_editing", true);
    // Limit of 0 means no time limit on editing messages
    override(realm, "realm_message_content_edit_limit_seconds", null);
    assert.equal(is_content_editable(message), true);

    override(realm, "realm_message_content_edit_limit_seconds", 10);
    const now = new Date();
    const current_timestamp = now / 1000;
    message.timestamp = current_timestamp - 60;
    // Have 55+10 > 60 seconds from message.timestamp to edit the message; we're good!
    assert.equal(is_content_editable(message, 55), true);
    // It's been 60 > 45+10 since message.timestamp. When realm_allow_message_editing
    // is true, we can edit the topic if there is one.
    assert.equal(is_content_editable(message, 45), false);
    // Right now, we prevent users from editing widgets.
    message.submessages = ["/poll"];
    assert.equal(is_content_editable(message, 55), false);
    message.submessages = [];
    message.type = "private";
    assert.equal(is_content_editable(message, 45), false);

    assert.equal(is_content_editable(message, 55), true);
    // If we don't pass a second argument, treat it as 0
    assert.equal(is_content_editable(message), false);
});

run_test("is_topic_editable", ({override}) => {
    const now = new Date();
    const current_timestamp = now / 1000;

    const message = {
        sent_by_me: true,
        locally_echoed: true,
        type: "stream",
    };
    override(realm, "realm_allow_message_editing", true);
    override(stream_data, "is_stream_archived_by_id", () => false);
    override(stream_data, "user_can_move_messages_within_channel", () => true);
    override(stream_data, "get_sub_by_id", () => ({}));
    override(stream_data, "is_empty_topic_only_channel", () => false);
    override(current_user, "is_moderator", true);

    assert.equal(message_edit.is_topic_editable(message), false);

    message.locally_echoed = false;
    message.failed_request = true;
    assert.equal(message_edit.is_topic_editable(message), false);

    message.failed_request = false;
    assert.equal(message_edit.is_topic_editable(message), true);

    message.sent_by_me = false;
    assert.equal(message_edit.is_topic_editable(message), true);

    override(stream_data, "user_can_move_messages_within_channel", () => false);
    assert.equal(message_edit.is_topic_editable(message), false);

    override(current_user, "is_moderator", false);
    assert.equal(message_edit.is_topic_editable(message), false);

    message.topic = "translated: (no topic)";
    assert.equal(message_edit.is_topic_editable(message), false);

    message.topic = "test topic";
    override(stream_data, "user_can_move_messages_within_channel", () => false);
    assert.equal(message_edit.is_topic_editable(message), false);

    override(realm, "realm_move_messages_within_stream_limit_seconds", 259200);
    message.timestamp = current_timestamp - 60;

    override(stream_data, "user_can_move_messages_within_channel", () => true);
    assert.equal(message_edit.is_topic_editable(message), true);

    message.timestamp = current_timestamp - 600000;
    assert.equal(message_edit.is_topic_editable(message), false);

    override(current_user, "is_moderator", true);
    assert.equal(message_edit.is_topic_editable(message), true);

    override(realm, "realm_allow_message_editing", false);
    assert.equal(message_edit.is_topic_editable(message), true);
});

run_test("is_stream_editable", ({override}) => {
    const now = new Date();
    const current_timestamp = now / 1000;

    const message = {
        sent_by_me: true,
        locally_echoed: true,
        type: "stream",
    };
    override(realm, "realm_allow_message_editing", true);
    override(stream_data, "user_can_move_messages_out_of_channel", () => true);
    override(stream_data, "get_sub_by_id", () => ({}));
    override(current_user, "is_moderator", true);
    override(stream_data, "is_stream_archived_by_id", () => false);

    assert.equal(message_edit.is_stream_editable(message), false);

    message.locally_echoed = false;
    message.failed_request = true;
    assert.equal(message_edit.is_stream_editable(message), false);

    message.failed_request = false;
    assert.equal(message_edit.is_stream_editable(message), true);

    message.sent_by_me = false;
    assert.equal(message_edit.is_stream_editable(message), true);

    override(stream_data, "user_can_move_messages_out_of_channel", () => false);
    assert.equal(message_edit.is_stream_editable(message), false);

    override(current_user, "is_moderator", false);
    assert.equal(message_edit.is_stream_editable(message), false);

    override(realm, "realm_move_messages_between_streams_limit_seconds", 259200);
    message.timestamp = current_timestamp - 60;

    override(stream_data, "user_can_move_messages_out_of_channel", () => true);
    assert.equal(message_edit.is_stream_editable(message), true);

    message.timestamp = current_timestamp - 600000;
    assert.equal(message_edit.is_stream_editable(message), false);

    override(current_user, "is_moderator", true);
    assert.equal(message_edit.is_stream_editable(message), true);
});

run_test("stream_and_topic_exist_in_edit_history", () => {
    // A message with no edit history should always return false;
    // the message's current stream_id and topic are not compared
    // to the stream_id and topic parameters.
    const message_no_edits = {
        stream_id: 1,
        type: "stream",
        topic: "topic match",
    };
    assert.equal(
        message_edit.stream_and_topic_exist_in_edit_history(message_no_edits, 2, "no match"),
        false,
    );
    assert.equal(
        message_edit.stream_and_topic_exist_in_edit_history(message_no_edits, 1, "topic match"),
        false,
    );

    // A non-stream message (object has no stream_id or topic)
    // with content edit history, should return false.
    const private_message = {
        edit_history: [{prev_content: "content edit to direct message"}],
    };
    assert.equal(
        message_edit.stream_and_topic_exist_in_edit_history(private_message, 1, "topic match"),
        false,
    );

    // A stream message with only content edits should return false,
    // even if the message's current stream_id and topic are a match.
    const message_content_edit = {
        stream_id: 1,
        type: "stream",
        topic: "topic match",
        edit_history: [{prev_content: "content edit"}],
    };
    assert.equal(
        message_edit.stream_and_topic_exist_in_edit_history(message_content_edit, 1, "topic match"),
        false,
    );

    const message_stream_edit = {
        stream_id: 6,
        type: "stream",
        topic: "topic match",
        edit_history: [{stream: 6, prev_stream: 1}],
    };
    assert.equal(
        message_edit.stream_and_topic_exist_in_edit_history(message_stream_edit, 2, "topic match"),
        false,
    );
    assert.equal(
        message_edit.stream_and_topic_exist_in_edit_history(message_stream_edit, 1, "topic match"),
        true,
    );

    const message_topic_edit = {
        stream_id: 1,
        type: "stream",
        topic: "final topic",
        edit_history: [{topic: "final topic", prev_topic: "topic match"}],
    };
    assert.equal(
        message_edit.stream_and_topic_exist_in_edit_history(message_topic_edit, 1, "no match"),
        false,
    );
    assert.equal(
        message_edit.stream_and_topic_exist_in_edit_history(message_topic_edit, 1, "topic match"),
        true,
    );

    const message_many_edits = {
        stream_id: 6,
        type: "stream",
        topic: "final topic",
        edit_history: [
            {stream: 6, prev_stream: 5},
            {prev_content: "content only edit"},
            {topic: "final topic", prev_topic: "topic match"},
            {stream: 5, prev_stream: 1},
        ],
    };
    assert.equal(
        message_edit.stream_and_topic_exist_in_edit_history(message_many_edits, 1, "no match"),
        false,
    );
    assert.equal(
        message_edit.stream_and_topic_exist_in_edit_history(message_many_edits, 2, "topic match"),
        false,
    );
    assert.equal(
        message_edit.stream_and_topic_exist_in_edit_history(message_many_edits, 1, "topic match"),
        true,
    );

    // When the topic and stream_id exist in the message's edit history
    // individually, but not together in a historical state, it should return false.
    const message_no_historical_match = {
        stream_id: 6,
        type: "stream",
        topic: "final topic",
        edit_history: [
            {stream: 6, prev_stream: 1}, // stream matches, topic does not
            {stream: 1, prev_stream: 5}, // neither match
            {topic: "final topic", prev_topic: "topic match"}, // topic matches, stream does not
        ],
    };
    assert.equal(
        message_edit.stream_and_topic_exist_in_edit_history(
            message_no_historical_match,
            1,
            "topic match",
        ),
        false,
    );
});
```

--------------------------------------------------------------------------------

---[FILE: message_events.test.cjs]---
Location: zulip-main/web/tests/message_events.test.cjs

```text
"use strict";

const assert = require("node:assert/strict");

const {make_realm} = require("./lib/example_realm.cjs");
const {mock_esm, zrequire} = require("./lib/namespace.cjs");
const {run_test, noop} = require("./lib/test.cjs");
const $ = require("./lib/zjquery.cjs");

const message_edit = mock_esm("../src/message_edit");
const message_lists = mock_esm("../src/message_lists");
const message_notifications = mock_esm("../src/message_notifications");
const pm_list = mock_esm("../src/pm_list");
const stream_list = mock_esm("../src/stream_list");
const unread_ui = mock_esm("../src/unread_ui");
mock_esm("../src/message_parser", {
    message_has_attachment: noop,
    message_has_image: noop,
    message_has_link: noop,
});
message_lists.current = {};
message_lists.all_rendered_message_lists = () => [message_lists.current];

const people = zrequire("people");
const message_events = zrequire("message_events");
const message_helper = zrequire("message_helper");
const {set_realm} = zrequire("state_data");
const stream_data = zrequire("stream_data");
const settings_config = zrequire("settings_config");
const stream_topic_history = zrequire("stream_topic_history");
const unread = zrequire("unread");
const {initialize_user_settings} = zrequire("user_settings");

const realm = make_realm();
set_realm(realm);

initialize_user_settings({user_settings: {}});

const alice = {
    email: "alice@example.com",
    user_id: 32,
    full_name: "Alice Patel",
};

people.add_active_user(alice);

const denmark = {
    subscribed: false,
    name: "Denmark",
    stream_id: 101,
};
stream_data.add_sub_for_tests(denmark);

function test_helper(side_effects) {
    const events = [];

    for (const [module, field] of side_effects) {
        module[field] = () => {
            events.push([module, field]);
        };
    }

    return {
        verify() {
            assert.deepEqual(side_effects, events);
        },
    };
}

run_test("update_messages", ({override, override_rewire}) => {
    override_rewire(message_events, "update_views_filtered_on_message_property", () => {});

    const raw_message = {
        id: 111,
        display_recipient: denmark.name,
        flags: ["mentioned"],
        sender_id: alice.user_id,
        stream_id: denmark.stream_id,
        topic: "lunch",
        type: "stream",
        reactions: [],
        submessages: [],
        avatar_url: `/avatar/${alice.user_id}`,
    };

    const original_message = message_helper.process_new_message({
        type: "server_message",
        raw_message,
    }).message;

    assert.equal(original_message.mentioned, true);
    assert.equal(original_message.unread, true);

    assert.deepEqual(stream_topic_history.get_recent_topic_names(denmark.stream_id), ["lunch"]);

    unread.update_message_for_mention(original_message);
    assert.ok(unread.unread_mentions_counter.has(original_message.id));

    const events = [
        {
            message_id: original_message.id,
            flags: [],
            orig_content: "old stuff",
            content: "**new content**",
            rendered_content: "<b>new content</b>",
        },
    ];

    message_lists.current.view = {};

    let rendered_mgs;

    message_lists.current.view.rerender_messages = (msgs_to_rerender, message_content_edited) => {
        rendered_mgs = msgs_to_rerender;
        assert.equal(message_content_edited, true);
    };

    const side_effects = [
        [message_edit, "end_message_edit"],
        [message_notifications, "received_messages"],
        [unread_ui, "update_unread_counts"],
        [stream_list, "update_streams_sidebar"],
        [pm_list, "update_private_messages"],
    ];

    const helper = test_helper(side_effects);

    override(
        realm,
        "realm_message_edit_history_visibility_policy",
        settings_config.message_edit_history_visibility_policy_values.never.code,
    );

    const $message_edit_history_modal = $.create("#message-edit-history");
    const $modal = $.create("micromodal").addClass("modal--open");
    $message_edit_history_modal.set_parents_result(".micromodal", $modal);

    // TEST THIS:
    message_events.update_messages(events);

    assert.ok(!unread.unread_mentions_counter.has(original_message.id));

    helper.verify();

    assert.deepEqual(rendered_mgs, [
        {
            avatar_url: `/avatar/${alice.user_id}`,
            display_reply_to: undefined,
            alerted: false,
            clean_reactions: new Map(),
            collapsed: false,
            content: "<b>new content</b>",
            display_recipient: denmark.name,
            historical: false,
            id: 111,
            is_stream: true,
            is_private: false,
            last_edit_timestamp: undefined,
            mentioned: false,
            stream_wildcard_mentioned: false,
            topic_wildcard_mentioned: false,
            mentioned_me_directly: false,
            raw_content: "**new content**",
            reply_to: alice.email,
            sender_email: alice.email,
            sender_full_name: alice.full_name,
            sender_id: 32,
            sent_by_me: false,
            starred: false,
            status_emoji_info: undefined,
            stream_id: denmark.stream_id,
            stream: "Denmark",
            submessages: [],
            topic: "lunch",
            type: "stream",
            unread: true,
        },
    ]);
});
```

--------------------------------------------------------------------------------

````
