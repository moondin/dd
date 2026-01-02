---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 835
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 835 of 1290)

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

---[FILE: example_realm.cjs]---
Location: zulip-main/web/tests/lib/example_realm.cjs

```text
"use strict";

const {server_supported_permission_settings} = require("./example_settings.cjs");

exports.make_realm = (opts = {}) => {
    const default_realm = {
        custom_profile_fields: [],
        custom_profile_field_types: [],
        giphy_api_key: "giphy-api-key",
        gif_rating_options: {disabled: {id: 0, name: ""}},
        max_avatar_file_size_mib: 0,
        max_channel_folder_description_length: 0,
        max_channel_folder_name_length: 0,
        max_file_upload_size_mib: 0,
        max_icon_file_size_mib: 0,
        max_logo_file_size_mib: 0,
        max_message_length: 100,
        max_reminder_note_length: 0,
        max_stream_description_length: 0,
        max_stream_name_length: 0,
        max_topic_length: 0,
        max_bulk_new_subscription_messages: 0,
        password_min_guesses: 0,
        password_min_length: 0,
        password_max_length: 0,
        realm_allow_message_editing: false,
        realm_authentication_methods: {
            default: {
                enabled: false,
                available: false,
                unavailable_reason: "",
            },
        },
        realm_available_video_chat_providers_default: {
            disabled: {name: "", id: 0},
            jitsi_meet: {name: "", id: 0},
            zoom: undefined,
            zoom_server_to_server: undefined,
            big_blue_button: undefined,
        },
        realm_avatar_changes_disabled: false,
        realm_bot_domain: "",
        realm_can_access_all_users_group: 0,
        realm_can_add_custom_emoji_group: 0,
        realm_can_add_subscribers_group: 0,
        realm_can_create_bots_group: 0,
        realm_can_create_groups: 0,
        realm_can_create_public_channel_group: 0,
        realm_can_create_private_channel_group: 0,
        realm_can_create_web_public_channel_group: 0,
        realm_can_create_write_only_bots_group: 0,
        realm_can_delete_any_message_group: {
            direct_subgroups: [],
            direct_members: [],
        },
        realm_can_delete_own_message_group: 0,
        realm_can_invite_users_group: 0,
        realm_can_manage_all_groups: 0,
        realm_can_manage_billing_group: 0,
        realm_can_mention_many_users_group: 0,
        realm_can_move_messages_between_channels_group: 0,
        realm_can_move_messages_between_topics_group: 0,
        realm_can_resolve_topics_group: 0,
        realm_can_set_delete_message_policy_group: 0,
        realm_can_set_topics_policy_group: 0,
        realm_can_summarize_topics_group: 0,
        realm_create_multiuse_invite_group: 0,
        realm_date_created: 0,
        realm_default_code_block_language: "",
        realm_default_external_accounts: {},
        realm_default_language: "",
        realm_description: "Dummy realm",
        realm_digest_emails_enabled: false,
        realm_digest_weekday: 0,
        realm_direct_message_initiator_group: 0,
        realm_direct_message_permission_group: 0,
        realm_disallow_disposable_email_addresses: false,
        realm_domains: [],
        realm_email_auth_enabled: false,
        realm_email_changes_disabled: false,
        realm_emails_restricted_to_domains: false,
        realm_embedded_bots: [],
        realm_empty_topic_display_name: "",
        realm_enable_guest_user_dm_warning: false,
        realm_enable_guest_user_indicator: false,
        realm_enable_read_receipts: false,
        realm_enable_spectator_access: false,
        realm_giphy_rating: 0,
        realm_icon_source: "",
        realm_icon_url: "",
        realm_incoming_webhook_bots: [],
        realm_inline_image_preview: false,
        realm_inline_url_embed_preview: false,
        realm_invite_required: false,
        realm_jitsi_server_url: null,
        realm_linkifiers: [],
        realm_logo_source: "",
        realm_logo_url: "",
        realm_message_content_allowed_in_email_notifications: false,
        realm_message_content_edit_limit_seconds: null,
        realm_message_content_delete_limit_seconds: null,
        realm_message_edit_history_visibility_policy: "all",
        realm_message_retention_days: 0,
        realm_move_messages_between_streams_limit_seconds: null,
        realm_move_messages_within_stream_limit_seconds: null,
        realm_name_changes_disabled: false,
        realm_name: "",
        realm_new_stream_announcements_stream_id: 0,
        realm_night_logo_source: "",
        realm_night_logo_url: "",
        realm_org_type: 0,
        realm_password_auth_enabled: false,
        realm_plan_type: 0,
        realm_playgrounds: [],
        realm_presence_disabled: false,
        realm_push_notifications_enabled: false,
        realm_push_notifications_enabled_end_timestamp: null,
        realm_require_e2ee_push_notifications: false,
        realm_require_unique_names: false,
        realm_send_welcome_emails: false,
        realm_signup_announcements_stream_id: 0,
        realm_topics_policy: "allow_empty_topic",
        realm_upload_quota_mib: null,
        realm_url: "",
        realm_video_chat_provider: 0,
        realm_waiting_period_threshold: 0,
        realm_want_advertise_in_communities_directory: false,
        realm_welcome_message_custom_text: "",
        realm_zulip_update_announcements_stream_id: 0,
        server_avatar_changes_disabled: false,
        server_can_summarize_topics: false,
        server_emoji_data_url: "",
        server_inline_image_preview: false,
        server_inline_url_embed_preview: false,
        server_max_deactivated_realm_deletion_days: null,
        server_min_deactivated_realm_deletion_days: null,
        server_jitsi_server_url: null,
        server_name_changes_disabled: false,
        server_needs_upgrade: false,
        server_presence_offline_threshold_seconds: 0,
        server_presence_ping_interval_seconds: 0,
        server_supported_permission_settings,
        server_thumbnail_formats: [],
        server_typing_started_expiry_period_milliseconds: 0,
        server_typing_started_wait_period_milliseconds: 0,
        server_typing_stopped_wait_period_milliseconds: 0,
        server_web_public_streams_enabled: false,
        settings_send_digest_emails: false,
        stop_words: [],
        upgrade_text_for_wide_organization_logo: "",
        zulip_feature_level: 0,
        zulip_merge_base: "",
        zulip_plan_is_not_limited: false,
        zulip_version: "11",
    };
    return {
        ...default_realm,
        ...opts,
    };
};
```

--------------------------------------------------------------------------------

---[FILE: example_settings.cjs]---
Location: zulip-main/web/tests/lib/example_settings.cjs

```text
"use strict";

exports.server_supported_permission_settings = {
    stream: {
        can_add_subscribers_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: false,
            default_group_name: "role:nobody",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_administer_channel_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: false,
            default_group_name: "channel_creator",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_create_topic_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: true,
            default_group_name: "role:everyone",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_delete_any_message_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: true,
            default_group_name: "role:nobody",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_delete_own_message_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: true,
            default_group_name: "role:nobody",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_move_messages_out_of_channel_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: true,
            default_group_name: "role:nobody",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_move_messages_within_channel_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: true,
            default_group_name: "role:nobody",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_remove_subscribers_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: false,
            allow_everyone_group: true,
            default_group_name: "role:administrators",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_resolve_topics_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: true,
            default_group_name: "role:nobody",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_send_message_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: true,
            default_group_name: "role:everyone",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_subscribe_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: false,
            default_group_name: "role:nobody",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
    },
    realm: {
        can_access_all_users_group: {
            require_system_group: true,
            allow_internet_group: false,
            allow_nobody_group: false,
            allow_everyone_group: true,
            default_group_name: "role:everyone",
            default_for_system_groups: null,
            allowed_system_groups: ["role:everyone", "role:members"],
        },
        can_add_custom_emoji_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: false,
            default_group_name: "role:members",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_add_subscribers_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: false,
            default_group_name: "role:members",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_create_bots_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: false,
            default_group_name: "role:members",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_create_groups: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: false,
            default_group_name: "role:members",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_create_private_channel_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: false,
            default_group_name: "role:members",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_create_public_channel_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: false,
            default_group_name: "role:members",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_create_web_public_channel_group: {
            require_system_group: true,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: false,
            default_group_name: "role:owners",
            default_for_system_groups: null,
            allowed_system_groups: [
                "role:moderators",
                "role:administrators",
                "role:owners",
                "role:nobody",
            ],
        },
        can_create_write_only_bots_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: false,
            default_group_name: "role:members",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_delete_any_message_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: false,
            default_group_name: "role:administrators",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_delete_own_message_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: true,
            default_group_name: "role:everyone",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_invite_users_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: false,
            default_group_name: "role:members",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_manage_all_groups: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: false,
            allow_everyone_group: false,
            default_group_name: "role:owners",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_manage_billing_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: false,
            allow_everyone_group: false,
            default_group_name: "role:administrators",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_mention_many_users_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: true,
            default_group_name: "role:administrators",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_move_messages_between_channels_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: false,
            default_group_name: "role:members",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_move_messages_between_topics_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: true,
            default_group_name: "role:everyone",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_resolve_topics_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: true,
            default_group_name: "role:everyone",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_set_delete_message_policy_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: false,
            default_group_name: "role:moderators",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_set_topics_policy_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: true,
            default_group_name: "role:members",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        can_summarize_topics_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: true,
            default_group_name: "role:everyone",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        create_multiuse_invite_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: false,
            default_group_name: "role:administrators",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        direct_message_initiator_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: true,
            default_group_name: "role:everyone",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
        direct_message_permission_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: true,
            default_group_name: "role:everyone",
            default_for_system_groups: null,
            allowed_system_groups: [],
        },
    },
    group: {
        can_add_members_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: false,
            default_group_name: "group_creator",
            default_for_system_groups: "role:nobody",
            allowed_system_groups: [],
        },
        can_join_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: false,
            default_group_name: "role:nobody",
            default_for_system_groups: "role:nobody",
            allowed_system_groups: [],
        },
        can_leave_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: true,
            default_group_name: "role:everyone",
            default_for_system_groups: "role:nobody",
            allowed_system_groups: [],
        },
        can_manage_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: false,
            default_group_name: "group_creator",
            default_for_system_groups: "role:nobody",
            allowed_system_groups: [],
        },
        can_mention_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: true,
            default_group_name: "role:everyone",
            default_for_system_groups: "role:nobody",
            allowed_system_groups: [],
        },
        can_remove_members_group: {
            require_system_group: false,
            allow_internet_group: false,
            allow_nobody_group: true,
            allow_everyone_group: false,
            default_group_name: "role:nobody",
            default_for_system_groups: "role:nobody",
            allowed_system_groups: [],
        },
    },
};
```

--------------------------------------------------------------------------------

---[FILE: example_stream.cjs]---
Location: zulip-main/web/tests/lib/example_stream.cjs

```text
"use strict";

let last_issued_stream_id = 20000;

const get_stream_id = () => {
    last_issued_stream_id += 1 + Math.floor(Math.random() * 10);
    return last_issued_stream_id;
};

exports.make_stream = (opts = {}) => {
    // Since other fields are computed from these, we need to
    // pull these out of opts early.
    const stream_id = opts.stream_id ?? get_stream_id();
    const name = opts.name ?? `stream-${stream_id}`;

    const default_channel = {
        audible_notifications: false,
        /* BUG: This should always be a group ID. But it's annoying to
         * fix without assuming groups exist in the data set. */
        can_remove_subscribers_group: 0,
        can_administer_channel_group: 2,
        can_create_topic_group: 2,
        color: "abcd12",
        /* This is rarely going to be the case, but a valid possibility. */
        creator_id: null,
        date_created: Date.now(),
        description: `Description of ${name}`,
        desktop_notifications: false,
        email_address: "channel-email-address@example.com",
        email_notifications: false,
        /* This will rarely be the case, but is a valid possibility*/
        first_message_id: null,
        history_public_to_subscribers: true,
        invite_only: false,
        is_announcement_only: false,
        is_muted: false,
        is_web_public: false,
        message_retention_days: null,
        name,
        newly_subscribed: false,
        pin_to_top: false,
        previously_subscribed: false,
        push_notifications: false,
        rendered_description: `<p>Description of ${name}</p>`,
        stream_id,
        /* STREAM_POST_POLICY_EVERYONE */
        stream_post_policy: 1,
        stream_weekly_traffic: 0,
        /* Most tests want to work with a channel the current user is subscribed to. */
        subscribed: true,
        wildcard_mentions_notify: false,
        folder_id: null,
    };

    return {...default_channel, ...opts};
};
```

--------------------------------------------------------------------------------

---[FILE: example_user.cjs]---
Location: zulip-main/web/tests/lib/example_user.cjs

```text
"use strict";

let last_issued_user_id = 1000;

const get_user_id = () => {
    last_issued_user_id += 1 + Math.floor(Math.random() * 100);
    return last_issued_user_id;
};

const Role = Object.freeze({
    OWNER: 100,
    ADMINISTRATOR: 200,
    MODERATOR: 300,
    MEMBER: 400,
    GUEST: 600,
});

const Bot = Object.freeze({
    GENERIC: 1,
    INCOMING_WEBHOOK: 2,
    OUTGOING_WEBHOOK: 3,
    EMBEDDED: 4,
});

const bot_or_user_props = (opts = {}) => {
    // Since other fields need `user_id`, we extract it early.
    const user_id = opts.user_id ?? get_user_id();

    const common_props = {
        user_id,
        delivery_email: opts.delivery_email ?? null,
        email: `user-${user_id}@example.org`,
        full_name: `user-${user_id}-ex_name`,
        date_joined: Date.now(),
        is_owner: false,
        is_admin: false,
        is_guest: false,
        timezone: "UTC",
        avatar_version: 0,
        // By default a member.
        role: Role.MEMBER,
    };

    return {...common_props, ...opts};
};

const make_user = (opts = {}) => ({
    ...bot_or_user_props(opts),
    is_bot: false,
    // By default an empty dictionary.
    profile_data: opts.profile_data ?? {},
});

const make_bot = (opts = {}) => ({
    ...bot_or_user_props(opts),
    is_bot: true,
    // By default a generic bot.
    bot_type: opts.bot_type ?? Bot.GENERIC,
    bot_owner_id: opts.bot_owner_id ?? null,
});

const make_cross_realm_bot = (opts = {}) => ({
    ...make_bot(opts),
    is_system_bot: true,
});

exports.make_bot = make_bot;
exports.make_user = make_user;
exports.make_cross_realm_bot = make_cross_realm_bot;
```

--------------------------------------------------------------------------------

---[FILE: handlebars.cjs]---
Location: zulip-main/web/tests/lib/handlebars.cjs

```text
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const Handlebars = require("handlebars");
const {SourceMapConsumer, SourceNode} = require("source-map");

const hb = Handlebars.create();

class ZJavaScriptCompiler extends hb.JavaScriptCompiler {
    nameLookup(parent, name, type) {
        // Auto-register partials with relative paths, like handlebars-loader.
        if (type === "partial" && name !== "@partial-block") {
            const filename = path.resolve(path.dirname(this.options.srcName), name + ".hbs");
            return ["require(", JSON.stringify(filename), ")"];
        }
        return super.nameLookup(parent, name, type);
    }
}

ZJavaScriptCompiler.prototype.compiler = ZJavaScriptCompiler;
hb.JavaScriptCompiler = ZJavaScriptCompiler;

function compile_hbs(module, filename) {
    const code = fs.readFileSync(filename, "utf8");
    const pc = hb.precompile(code, {
        preventIndent: true,
        srcName: filename,
        strict: true,
        explicitPartialContext: true,
    });
    const node = new SourceNode();
    node.add([
        'const Handlebars = require("handlebars/runtime.js");\n',
        "module.exports = Handlebars.template(",
        SourceNode.fromStringWithSourceMap(pc.code, new SourceMapConsumer(pc.map)),
        ");\n",
    ]);
    const out = node.toStringWithSourceMap();
    module._compile(
        out.code +
            "\n//# sourceMappingURL=data:application/json;charset=utf-8;base64," +
            Buffer.from(out.map.toString()).toString("base64"),
        filename,
    );
}

exports.hook_require = () => {
    require.extensions[".hbs"] = compile_hbs;
};
```

--------------------------------------------------------------------------------

---[FILE: i18n.cjs]---
Location: zulip-main/web/tests/lib/i18n.cjs

```text
"use strict";

const {createIntl, createIntlCache} = require("@formatjs/intl");
const _ = require("lodash");

const cache = createIntlCache();

exports.intl = createIntl(
    {
        locale: "en",
        defaultLocale: "en",
        defaultRichTextElements: Object.fromEntries(
            ["b", "code", "em", "i", "kbd", "p", "strong"].map((tag) => [
                tag,
                /* istanbul ignore next */
                (content_html) => `<${tag}>${content_html.join("")}</${tag}>`,
            ]),
        ),
    },
    cache,
);

exports.$t = (descriptor, values) => {
    descriptor = {
        id: `${descriptor.defaultMessage}#${descriptor.description}`,
        ...descriptor,
    };
    return "translated: " + exports.intl.formatMessage(descriptor, values);
};

const default_html_elements = Object.fromEntries(
    ["b", "code", "em", "i", "kbd", "p", "strong"].map((tag) => [
        tag,
        (content_html) => `<${tag}>${content_html.join("")}</${tag}>`,
    ]),
);

exports.$t_html = (descriptor, values) => {
    descriptor = {
        id: `${descriptor.defaultMessage}#${descriptor.description}`,
        ...descriptor,
    };
    return (
        "translated HTML: " +
        exports.intl.formatMessage(descriptor, {
            ...default_html_elements,
            ...Object.fromEntries(
                Object.entries(values ?? {}).map(([key, value]) => [
                    key,
                    typeof value === "function" ? value : _.escape(value),
                ]),
            ),
        })
    );
};
```

--------------------------------------------------------------------------------

---[FILE: index.cjs]---
Location: zulip-main/web/tests/lib/index.cjs

```text
"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");

require("@date-fns/tz"); // To prevent mockdate from interfering with it
require("css.escape");
require("handlebars/runtime.js");
const {JSDOM} = require("jsdom");
const _ = require("lodash");

const handlebars = require("./handlebars.cjs");
const stub_i18n = require("./i18n.cjs");
const namespace = require("./namespace.cjs");
const test = require("./test.cjs");
const blueslip = require("./zblueslip.cjs");
const zjquery = require("./zjquery.cjs");
const zpage_billing_params = require("./zpage_billing_params.cjs");
const zpage_params = require("./zpage_params.cjs");

process.env.NODE_ENV = "test";

const dom = new JSDOM("", {url: "http://zulip.zulipdev.com/"});
global.DOMParser = dom.window.DOMParser;
global.HTMLAnchorElement = dom.window.HTMLAnchorElement;
global.HTMLElement = dom.window.HTMLElement;
global.HTMLImageElement = dom.window.HTMLImageElement;
global.Window = dom.window.Window;
Object.defineProperty(global, "navigator", {
    value: {
        userAgent: "node.js",
    },
    writable: true,
});

require("@babel/register")({
    extensions: [".cjs", ".cts", ".js", ".mjs", ".mts", ".ts"],
    only: [new RegExp("^" + _.escapeRegExp(path.resolve(__dirname, "../../src") + path.sep))],
    plugins: [
        ...(process.env.USING_INSTRUMENTED_CODE ? [["istanbul", {exclude: []}]] : []),
        ["@babel/plugin-transform-modules-commonjs", {lazy: () => true}],
    ],
    root: path.resolve(__dirname, "../.."),
});

// Create a helper function to avoid sneaky delays in tests.
function immediate(f) {
    return () => f();
}

// Find the files we need to run.
const files = process.argv.slice(2);
assert.notEqual(files.length, 0, "No tests found");

// Set up our namespace helpers.
const window = new Proxy(global, {
    set(_obj, prop, value) {
        namespace.set_global(prop, value);
        return true;
    },
});

const ls_container = new Map();
const localStorage = {
    getItem(key) {
        return ls_container.get(key);
    },
    setItem(key, val) {
        ls_container.set(key, val);
    },
    /* istanbul ignore next */
    removeItem(key) {
        ls_container.delete(key);
    },
    clear() {
        ls_container.clear();
    },
};

// Set up Handlebars
handlebars.hook_require();

const noop = function () {};

require("../../src/templates.ts"); // register Zulip extensions

async function run_one_module(file) {
    zjquery.clear_all_elements();
    console.info("running test " + path.basename(file, ".test.cjs"));
    test.set_current_file_name(file);
    test.suite.length = 0;
    require(file);
    for (const f of test.suite) {
        await f();
    }
    namespace.complain_about_unused_mocks();
}

test.set_verbose(files.length === 1);

// In case someone mistakenly vanishes the async task with something like `await
// new Promise(() => {})`, assume failure until we establish otherwise.
process.exitCode = 1;

(async () => {
    let exit_code = 0;

    for (const file of files) {
        namespace.start();
        namespace.set_global("window", window);
        namespace.set_global("location", dom.window.location);
        window.location.href = "http://zulip.zulipdev.com/#";
        namespace.set_global("setTimeout", noop);
        namespace.set_global("setInterval", noop);
        namespace.set_global("localStorage", localStorage);
        ls_container.clear();
        _.throttle = immediate;
        _.debounce = immediate;
        zpage_billing_params.reset();
        zpage_params.reset();

        namespace.mock_esm("../../src/blueslip", blueslip);
        require("../../src/blueslip.ts");
        namespace.mock_esm("../../src/i18n", stub_i18n);
        require("../../src/i18n.ts");
        namespace.mock_esm("../../src/base_page_params", zpage_params);
        require("../../src/base_page_params.ts");
        namespace.mock_esm("../../src/billing/page_params", zpage_billing_params);
        require("../../src/billing/page_params.ts");
        namespace.mock_esm("../../src/page_params", zpage_params);
        require("../../src/page_params.ts");

        // Make sure we re-register our Handlebars helpers.
        require("../../src/templates.ts");

        try {
            await run_one_module(file);
            blueslip.reset();
        } catch (error) /* istanbul ignore next */ {
            console.error(error);
            exit_code = 1;
            blueslip.reset(true);
        }

        namespace.finish();
    }

    process.exitCode = exit_code;
})().catch((error) => /* istanbul ignore next */ {
    console.error(error);
});
```

--------------------------------------------------------------------------------

---[FILE: markdown_assert.cjs]---
Location: zulip-main/web/tests/lib/markdown_assert.cjs

```text
"use strict";

/**
 * markdown_assert.js
 *
 * Used to determine whether two Markdown HTML strings are semantically
 * equivalent. Differs from the naive string-comparison approach in that
 * differently typed but equivalent HTML fragments, such as '<p>&quot;</p>'
 * and '<p>\"</p>', and '<span attr1="a" attr2="b"></span>' and
 * '<span attr2="a" attr1="b"></span>', are still considered equal.
 *
 * The exported method equal() serves as a drop-in replacement for
 * assert.equal().  Likewise, the exported method notEqual() replaces
 * assert.notEqual().
 *
 * There is a default _output_formatter used to create the
 * AssertionError error message; this function can be overridden using
 * the exported setFormatter() function below.
 *
 * The HTML passed to the _output_formatter is not the original HTML, but
 * rather a serialized version of a DOM element generated from the original
 * HTML.  This makes it easier to spot relevant differences.
 */

const assert = require("node:assert/strict");

const {JSDOM} = require("jsdom");
const _ = require("lodash");

const mdiff = require("./mdiff.cjs");

// Module-level global instance of MarkdownComparer, initialized when needed
let _markdownComparerInstance = null;

class MarkdownComparer {
    constructor(output_formatter) {
        this._output_formatter =
            output_formatter ||
            /* istanbul ignore next */
            function (actual, expected) {
                return ["Actual and expected output do not match.", actual, "!=", expected].join(
                    "\n",
                );
            };
        this._document = new JSDOM().window.document;
    }

    /* istanbul ignore next */
    setFormatter(output_formatter) {
        this._output_formatter = output_formatter || this._output_formatter;
    }

    _htmlToElement(html, id) {
        const template = this._document.createElement("template");
        const id_node = this._document.createAttribute("id");
        id_node.value = id;
        template.setAttributeNode(id_node);
        template.innerHTML = html;
        return template;
    }

    _haveEqualContents(node1, node2) {
        if (node1.content.childNodes.length !== node2.content.childNodes.length) {
            return false;
        }
        return _.zip(node1.content.childNodes, node2.content.childNodes).every(([child1, child2]) =>
            child1.isEqualNode(child2),
        );
    }

    _reorderAttributes(node) {
        // Sorts every attribute in every element by name.  Ensures consistent diff HTML output

        const attributeList = [];

        for (const attr of node.attributes) {
            attributeList.push(attr);
        }

        // If put in above forEach loop, causes issues (possible nodes.attribute invalidation?)
        for (const attr of attributeList) {
            node.removeAttribute(attr.name);
        }

        attributeList.sort((a, b) => {
            const name_a = a.name;
            const name_b = b.name;
            if (name_a < name_b) {
                return -1;
            } else if (name_a > name_b) {
                return 1;
            }
            /* istanbul ignore next */
            return 0;
        });

        // Put them back in, in order
        for (const attribute of attributeList) {
            node.setAttribute(attribute.name, attribute.value);
        }

        if (node.hasChildNodes()) {
            for (const childNode of node.children) {
                this._reorderAttributes(childNode);
            }
        }
        if (node.content && node.content.hasChildNodes()) {
            for (const childNode of node.content.children) {
                this._reorderAttributes(childNode);
            }
        }
        return node;
    }

    _compare(actual_markdown, expected_markdown) {
        const ID_ACTUAL = "0";
        const ID_EXPECTED = "1";

        const element_actual = this._htmlToElement(actual_markdown, ID_ACTUAL);
        const element_expected = this._htmlToElement(expected_markdown, ID_EXPECTED);

        let are_equivalent = false;
        let html = {};

        are_equivalent = this._haveEqualContents(element_actual, element_expected);
        if (!are_equivalent) {
            html = {
                actual: this._reorderAttributes(element_actual).innerHTML,
                expected: this._reorderAttributes(element_expected).innerHTML,
            };
        }

        element_actual.remove();
        element_expected.remove();

        return {are_equivalent, html};
    }

    assertEqual(actual, expected, message) {
        const comparison_results = this._compare(actual, expected);

        message = message || "";
        message += "\n";

        /* istanbul ignore if */
        if (comparison_results.are_equivalent === false) {
            throw new assert.AssertionError({
                message:
                    message +
                    this._output_formatter(
                        comparison_results.html.actual,
                        comparison_results.html.expected,
                    ),
            });
        }
    }

    assertNotEqual(actual, expected, message) {
        const comparison_results = this._compare(actual, expected);

        message = message || "";
        message += "\n";

        /* istanbul ignore if */
        if (comparison_results.are_equivalent) {
            throw new assert.AssertionError({
                message:
                    message +
                    [
                        "actual and expected output produce semantically identical HTML",
                        actual,
                        "==",
                        expected,
                    ].join("\n"),
            });
        }
    }
}

function returnComparer() {
    if (!_markdownComparerInstance) {
        _markdownComparerInstance = new MarkdownComparer(
            /* istanbul ignore next */
            (actual, expected) =>
                [
                    "Actual and expected output do not match.  Showing diff",
                    mdiff.diff_strings(actual, expected),
                ].join("\n"),
        );
    }
    return _markdownComparerInstance;
}

module.exports = {
    equal(expected, actual, message) {
        returnComparer().assertEqual(actual, expected, message);
    },

    notEqual(expected, actual, message) {
        returnComparer().assertNotEqual(actual, expected, message);
    },

    /* istanbul ignore next */
    setFormatter(output_formatter) {
        returnComparer().setFormatter(output_formatter);
    },
};
```

--------------------------------------------------------------------------------

````
