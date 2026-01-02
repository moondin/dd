---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 764
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 764 of 1290)

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

---[FILE: automatic_new_visibility_policy_banner.hbs]---
Location: zulip-main/web/templates/compose_banner/automatic_new_visibility_policy_banner.hbs

```text
{{#> compose_banner . }}
    <p class="banner_message">
        {{#if followed}}
            {{#tr}}
                Now following <z-link></z-link>.
                {{#*inline "z-link"~}}
                    <a class="above_compose_banner_action_link white-space-preserve-wrap" href="{{narrow_url}}" data-message-id="{{link_msg_id}}">
                        {{~!-- squash whitespace --~}}
                        #{{channel_name}} &gt; <span {{#if is_empty_string_topic}}class="empty-topic-display"{{/if}}>{{topic_display_name}}</span>
                        {{~!-- squash whitespace --~}}
                    </a>
                {{~/inline}}
            {{/tr}}
        {{else}}
            {{#tr}}
                Unmuted <z-link></z-link>.
                {{#*inline "z-link"~}}
                    <a class="above_compose_banner_action_link white-space-preserve-wrap" href="{{narrow_url}}" data-message-id="{{link_msg_id}}">
                        {{~!-- squash whitespace --~}}
                        #{{channel_name}} &gt; <span {{#if is_empty_string_topic}}class="empty-topic-display"{{/if}}>{{topic_display_name}}</span>
                        {{~!-- squash whitespace --~}}
                    </a>
                {{~/inline}}
            {{/tr}}
        {{/if}}
    </p>
{{/compose_banner}}
```

--------------------------------------------------------------------------------

---[FILE: cannot_send_direct_message_error.hbs]---
Location: zulip-main/web/templates/compose_banner/cannot_send_direct_message_error.hbs

```text
{{#> compose_banner . }}
    <p class="banner_message">
        {{error_message}}
        {{#tr}}
        <z-link>Learn more.</z-link>
        {{#*inline "z-link"}}<a target="_blank" rel="noopener noreferrer" href="/help/restrict-direct-messages">{{> @partial-block}}</a>{{/inline}}
        {{/tr}}
    </p>
{{/compose_banner}}
```

--------------------------------------------------------------------------------

---[FILE: compose_banner.hbs]---
Location: zulip-main/web/templates/compose_banner/compose_banner.hbs

```text
<div
  class="main-view-banner {{banner_type}} {{classname}}"
  {{#if user_id}}data-user-id="{{user_id}}"{{/if}}
  {{#if stream_id}}data-stream-id="{{stream_id}}"{{/if}}
  {{#if (or topic_name is_empty_string_topic)}}data-topic-name="{{topic_name}}"{{/if}}>
    <div class="main-view-banner-elements-wrapper">
        {{#if banner_text}}
        <p class="banner_content">{{banner_text}}</p>
        {{else}}
        <div class="banner_content">{{> @partial-block .}}</div>
        {{/if}}
        {{#if button_text}}
        <button class="main-view-banner-action-button{{#if hide_close_button}} right_edge{{/if}}" {{#if scheduling_message}}data-validation-trigger="schedule"{{/if}}>{{button_text}}</button>
        {{/if}}
        {{#if is_onboarding_banner}}
        <button class="main-view-banner-action-button right_edge" data-action="mark-as-read">{{t "Got it"}}</button>
        {{/if}}
    </div>
    {{#if hide_close_button}}
    {{!-- hide_close_button is null by default, and false if explicitly set as false. --}}
    {{else}}
    <a role="button" class="zulip-icon zulip-icon-close main-view-banner-close-button"></a>
    {{/if}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: compose_mention_group_warning.hbs]---
Location: zulip-main/web/templates/compose_banner/compose_mention_group_warning.hbs

```text
{{#> compose_banner . }}
    <p class="banner_message">
        {{#tr}}
            None of the members of <z-group-pill></z-group-pill> are subscribed to this channel.
            {{#*inline "z-group-pill"}}
                <span class="display_only_group_pill">
                    <a data-user-group-id="{{group_id}}" class="view_user_group_mention" tabindex="0">
                        <span class="pill-label">
                            <span>{{group_name}}</span>
                        </span>
                    </a>
                </span>
            {{/inline}}
        {{/tr}}
    </p>
{{/compose_banner}}
```

--------------------------------------------------------------------------------

---[FILE: guest_in_dm_recipient_warning.hbs]---
Location: zulip-main/web/templates/compose_banner/guest_in_dm_recipient_warning.hbs

```text
<div class="above_compose_banner main-view-banner warning-style {{classname}}">
    <p class="banner_content">
        {{banner_text}}
    </p>
    <a role="button" class="zulip-icon zulip-icon-close main-view-banner-close-button"></a>
</div>
```

--------------------------------------------------------------------------------

---[FILE: jump_to_sent_message_conversation_banner.hbs]---
Location: zulip-main/web/templates/compose_banner/jump_to_sent_message_conversation_banner.hbs

```text
{{#> compose_banner . }}
    <p class="banner_message">
        {{#tr}}
        Viewing the conversation where you sent your message. To go back, use the <z-highlight>back</z-highlight>
        button in your browser or desktop app.
        {{#*inline "z-highlight"}}<b class="highlighted-element">{{> @partial-block}}</b>{{/inline}}
        {{/tr}}
    </p>
{{/compose_banner}}
```

--------------------------------------------------------------------------------

---[FILE: long_paste_options.hbs]---
Location: zulip-main/web/templates/compose_banner/long_paste_options.hbs

```text
<div
  class="main-view-banner {{banner_type}} {{classname}}">
    <div class="main-view-banner-elements-wrapper">
        {{#if show_paste_button}}
        <div class="banner_content">{{t 'Paste text directly or convert to a file?'}}</div>
        <button class="main-view-banner-action-button paste-to-compose">{{t 'Paste'}}</button>
        <button class="main-view-banner-action-button convert-to-file secondary-button right_edge">{{t 'Convert'}}</button>
        {{else}}
        <div class="banner_content">{{t 'Do you want to convert the pasted text into a file?'}}</div>
        <button class="main-view-banner-action-button convert-to-file right_edge">{{t 'Yes, convert'}}</button>
        {{/if}}
    </div>
    <a role="button" class="zulip-icon zulip-icon-close main-view-banner-close-button"></a>
</div>
```

--------------------------------------------------------------------------------

---[FILE: message_sent_banner.hbs]---
Location: zulip-main/web/templates/compose_banner/message_sent_banner.hbs

```text
<div class="above_compose_banner main-view-banner success {{classname}}">
    <p class="banner_content">
        {{banner_text}}
        {{#if message_recipient}}
        <a class="above_compose_banner_action_link" {{#if above_composebox_narrow_url}}href="{{above_composebox_narrow_url}}"{{/if}} data-message-id="{{link_msg_id}}">
            {{#with message_recipient}}
            {{#if (eq message_type "channel")}}
                {{#tr}}
                    Go to #{channel_name} &gt; <z-topic-display-name></z-topic-display-name>
                    {{#*inline "z-topic-display-name"}}<span {{#if is_empty_string_topic}}class="empty-topic-display"{{/if}}>{{topic_display_name}}</span>{{/inline}}
                {{/tr}}
            {{else}}
                {{t 'Go to {recipient_text}' }}
            {{/if}}
            {{/with}}
        </a>
        {{/if}}
    </p>
    {{#if action_button_text}}
        <button class="action-button action-button-quiet-success" data-message-id="{{link_msg_id}}">
            <span class="action-button-label">{{ action_button_text }}</span>
        </button>
    {{/if}}
    <a role="button" class="zulip-icon zulip-icon-close main-view-banner-close-button"></a>
</div>
```

--------------------------------------------------------------------------------

---[FILE: not_subscribed_warning.hbs]---
Location: zulip-main/web/templates/compose_banner/not_subscribed_warning.hbs

```text
{{#> compose_banner . }}
    <p class="banner_message">
        {{#if can_subscribe_other_users}}
            {{#if should_add_guest_user_indicator}}
            {{#tr}}<strong>{name}</strong> <i>(guest)</i> is not subscribed to this channel. They will not be notified unless you subscribe them.{{/tr}}
            {{else}}
            {{#tr}}<strong>{name}</strong> is not subscribed to this channel. They will not be notified unless you subscribe them.{{/tr}}
            {{/if}}
        {{else}}
            {{#if should_add_guest_user_indicator}}
            {{#tr}}<strong>{name}</strong> <i>(guest)</i> is not subscribed to this channel. They will not be notified if you mention them.{{/tr}}
            {{else}}
            {{#tr}}<strong>{name}</strong> is not subscribed to this channel. They will not be notified if you mention them.{{/tr}}
            {{/if}}
        {{/if}}
    </p>
{{/compose_banner}}
```

--------------------------------------------------------------------------------

---[FILE: private_stream_warning.hbs]---
Location: zulip-main/web/templates/compose_banner/private_stream_warning.hbs

```text
{{#> compose_banner . }}
    <p class="banner_message">
        {{#tr}}Warning: <strong>#{channel_name}</strong> is a private channel.{{/tr}}
    </p>
{{/compose_banner}}
```

--------------------------------------------------------------------------------

---[FILE: stream_does_not_exist_error.hbs]---
Location: zulip-main/web/templates/compose_banner/stream_does_not_exist_error.hbs

```text
{{#> compose_banner . }}
    <p class="banner_message">
        {{#tr}}
        The channel <z-highlight>#{channel_name}</z-highlight> does not exist. Manage your subscriptions
        <z-link>on your Channels page</z-link>.
        {{#*inline "z-link"}}<a href='#channels/all'>{{> @partial-block}}</a>{{/inline}}
        {{#*inline "z-highlight"}}<b class="highlighted-element">{{> @partial-block}}</b>{{/inline}}
        {{/tr}}
    </p>
{{/compose_banner}}
```

--------------------------------------------------------------------------------

---[FILE: stream_wildcard_warning.hbs]---
Location: zulip-main/web/templates/compose_banner/stream_wildcard_warning.hbs

```text
{{#> compose_banner . }}
    <p class="banner_message">
        {{#tr}}
        Are you sure you want to send @-mention notifications to the <strong>{subscriber_count}</strong> users subscribed to #{channel_name}? If not, please edit your message to remove the <strong>@{wildcard_mention}</strong> mention.
        {{/tr}}
    </p>
{{/compose_banner}}
```

--------------------------------------------------------------------------------

---[FILE: success_message_scheduled_banner.hbs]---
Location: zulip-main/web/templates/compose_banner/success_message_scheduled_banner.hbs

```text
<div
  class="main-view-banner success message_scheduled_success_compose_banner"
  data-scheduled-message-id="{{scheduled_message_id}}">
    <div class="main-view-banner-elements-wrapper">
        <p class="banner_content">
            {{#if minimum_scheduled_message_delay_minutes_note}}
                {{t 'Messages must be scheduled at least {minimum_scheduled_message_delay_minutes} minutes in the future.'}}
            {{/if}}
            {{t 'Your message has been scheduled for {deliver_at}.'}}
            <a href="#scheduled">{{t "View scheduled messages"}}</a>
        </p>
        <button class="main-view-banner-action-button undo_scheduled_message" >{{t "Undo"}}</button>
    </div>
    <a role="button" class="zulip-icon zulip-icon-close main-view-banner-close-button"></a>
</div>
```

--------------------------------------------------------------------------------

---[FILE: topics_required_error_banner.hbs]---
Location: zulip-main/web/templates/compose_banner/topics_required_error_banner.hbs

```text
{{#> compose_banner . }}
    <p class="banner_message">
        {{> ../topics_required_error_message .}}
    </p>
{{/compose_banner}}
```

--------------------------------------------------------------------------------

---[FILE: topic_moved_banner.hbs]---
Location: zulip-main/web/templates/compose_banner/topic_moved_banner.hbs

```text
{{#> compose_banner . }}
    <p class="banner_message">
        {{#tr}}
            The topic you were composing to (<z-link></z-link>) was moved, and the destination for your message has been updated to its new location.
            {{#*inline "z-link"~}}
                <a class="above_compose_banner_action_link" href="{{narrow_url}}">
                    {{~> ../inline_topic_link_label channel_name=old_stream topic_display_name=orig_topic is_empty_string_topic=is_empty_string_topic~}}
                </a>
            {{~/inline}}
        {{/tr}}
    </p>
{{/compose_banner}}
```

--------------------------------------------------------------------------------

---[FILE: unknown_zoom_user_error.hbs]---
Location: zulip-main/web/templates/compose_banner/unknown_zoom_user_error.hbs

```text
{{#> compose_banner . }}
    <p class="banner_message">
        {{#tr}}
        Your Zulip account email (<z-highlight>{email}</z-highlight>) is not linked to this organization's Zoom account.
        {{#*inline "z-highlight"}}<b class="highlighted-element">{{> @partial-block}}</b>{{/inline}}
        {{/tr}}
    </p>
{{/compose_banner}}
```

--------------------------------------------------------------------------------

---[FILE: unmute_topic_banner.hbs]---
Location: zulip-main/web/templates/compose_banner/unmute_topic_banner.hbs

```text
{{#> compose_banner . }}
    <p class="banner_message">
        {{#if (eq muted_narrow "stream")}}
            {{#tr}}Your message was sent to a channel you have muted.{{/tr}}
        {{else if (eq muted_narrow "topic")}}
            {{#tr}}Your message was sent to a topic you have muted.{{/tr}}
        {{/if}}
        {{#tr}}You will not receive notifications about new messages.{{/tr}}
    </p>
{{/compose_banner}}
```

--------------------------------------------------------------------------------

---[FILE: upload_banner.hbs]---
Location: zulip-main/web/templates/compose_banner/upload_banner.hbs

```text
<div class="upload_banner file_{{file_id}} main-view-banner {{banner_type}}">
    <div class="moving_bar"></div>
    <p class="upload_msg banner_content">{{banner_text}}</p>
    {{#if is_upload_process_tracker}}
        <button class="upload_banner_cancel_button">{{t 'Cancel' }}</button>
    {{/if}}
    <a role="button" class="zulip-icon zulip-icon-close main-view-banner-close-button"></a>
</div>
```

--------------------------------------------------------------------------------

---[FILE: wildcard_mention_not_allowed_error.hbs]---
Location: zulip-main/web/templates/compose_banner/wildcard_mention_not_allowed_error.hbs

```text
{{#> compose_banner . }}
    <p class="banner_message">
        {{#if wildcard_mention_string}}
            {{#tr}}
            You do not have permission to use <z-highlight>@{wildcard_mention_string}</z-highlight> mentions in this channel.
            {{#*inline "z-highlight"}}<b class="highlighted-element">{{> @partial-block}}</b>{{/inline}}
            {{/tr}}
        {{else}}
            {{#tr}}
            You do not have permission to use <z-highlight>@topic</z-highlight> mentions in this topic.
            {{#*inline "z-highlight"}}<b class="highlighted-element">{{> @partial-block}}</b>{{/inline}}
            {{/tr}}
        {{/if}}
    </p>
{{/compose_banner}}
```

--------------------------------------------------------------------------------

---[FILE: confirm_archive_channel_folder.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_archive_channel_folder.hbs

```text
<p>{{t "Channels in this folder will become uncategorized."}}</p>
<p>{{t "This action cannot be undone."}}</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_deactivate_bot.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_deactivate_bot.hbs

```text
<p>{{t "A deactivated bot cannot send messages, access data, or take any other action." }}</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_deactivate_custom_emoji.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_deactivate_custom_emoji.hbs

```text
<p>{{t "A deactivated emoji will remain visible in existing messages and emoji reactions, but cannot be used on new messages."}}</p>
<p>{{t "This action cannot be undone."}}</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_deactivate_own_user.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_deactivate_own_user.hbs

```text
<p>{{t "By deactivating your account, you will be logged out immediately." }}</p>
<p>{{t "Note that any bots that you maintain will be disabled." }}</p>
<p>{{t "Are you sure you want to deactivate your account?"}}</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_deactivate_realm.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_deactivate_realm.hbs

```text
<form id="realm-data-deletion-form">
    <div class="input-group">
        <label for="delete-realm-data-in" class="modal-field-label">{{t "After how much time should all data for this organization be permanently deleted (users, channels, messages, etc.)?" }}</label>
        <select id="delete-realm-data-in" name="delete-realm-data-in" class="modal_select bootstrap-focus-style">
            {{#each delete_in_options}}
                <option {{#if this.default }}selected{{/if}} value="{{this.value}}">{{this.description}}</option>
            {{/each}}
        </select>
        <p class="time-input-formatted-description"></p>
        <div id="custom-realm-deletion-time" class="dependent-settings-block custom-time-input-container">
            <label class="modal-field-label">{{custom_deletion_input_label}}</label>
            <input id="custom-deletion-time-input" name="custom-deletion-time-input" class="custom-time-input-value inline-block modal_text_input" type="text" autocomplete="off" value="" maxlength="4"/>
            <select id="custom-deletion-time-unit" name="custom-deletion-time-unit" class="custom-time-input-unit bootstrap-focus-style modal_select" >
                {{#each time_choices}}
                    <option value="{{this.name}}">{{this.description}}</option>
                {{/each}}
            </select>
            <p class="custom-time-input-formatted-description"></p>
        </div>
    </div>
</form>
<p>{{t "Are you sure you want to deactivate this organization? All users will lose access to their Zulip accounts." }}</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_deactivate_stream.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_deactivate_stream.hbs

```text
<p>
    {{#tr}}Archiving this channel will:{{/tr}}
</p>
<ul>
    <li>{{#tr}}Remove it from the left sidebar for all users.{{/tr}}</li>
    <li>{{#tr}}Prevent new messages from being sent to this channel.{{/tr}}</li>
    <li>{{#tr}}Prevent messages in this channel from being edited, deleted, or moved.{{/tr}}</li>
    {{#if is_announcement_stream}}
    <li>{{#tr}}Disable announcements that are currently sent to this channel:{{/tr}}
        <ul>
            {{#if is_moderation_request_channel}}
                <li>{{#tr}}Moderation requests{{/tr}}</li>
            {{/if}}
            {{#if is_new_stream_announcements_stream}}
                <li>{{#tr}}New channel announcements{{/tr}}</li>
            {{/if}}
            {{#if is_signup_announcements_stream}}
                <li>{{#tr}}New user announcements{{/tr}}</li>
            {{/if}}
            {{#if is_zulip_update_announcements_stream}}
                <li>{{#tr}}Zulip update announcements{{/tr}}</li>
            {{/if}}
        </ul>
    </li>
    {{/if}}
</ul>
<p>
    {{#tr}}
        Users can still search for messages in archived channels.
        You can always unarchive this channel.
    {{/tr}}
</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_deactivate_user.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_deactivate_user.hbs

```text
<p>
    {{#tr}}
        When you deactivate <z-user></z-user>, they will be immediately logged out.
        {{#*inline "z-user"}}<strong>{{username}}</strong>{{#if email}} &lt;{{email}}&gt;{{/if}}{{/inline}}
    {{/tr}}
</p>
<p>{{t "Their password will be cleared from our systems, and any bots they maintain will be disabled." }}</p>
<p>
    {{#if number_of_invites_by_user}}
        {{#tr}}
            <strong>{username}</strong> has {number_of_invites_by_user, plural, one {# unexpired invitation} other {# unexpired invitations}}.
        {{/tr}}
    {{/if}}
</p>
{{#if bots_owned_by_user}}
    <p>
        {{t "They administer the following bots:"}}
    </p>
    <ul>
        {{#each bots_owned_by_user}}
            <li>{{this.full_name}}</li>
        {{/each}}
    </ul>
{{/if}}
<label class="checkbox">
    <input type="checkbox" class="send_email" />
    <span class="rendered-checkbox"></span>
    {{t "Notify this user by email?" }}
</label>
<div class="email_field">
    <p class="border-top">
        <strong>{{t "Subject" }}:</strong>
        {{t "Notification of account deactivation on {realm_name}" }}
    </p>
    <div class="email-body">
        <p>
            {{#tr}}
                Your Zulip account on <z-link></z-link> has been deactivated,
                and you will no longer be able to log in.
                {{#*inline "z-link"}}<a href="{{realm_url}}">{{realm_url}}</a>{{/inline}}
            {{/tr}}
        </p>
        <p>{{t "The administrators provided the following comment:" }}</p>
        <textarea class="email_field_textarea modal-textarea" rows="8" maxlength="2000"></textarea>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: confirm_deactivate_user_group.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_deactivate_user_group.hbs

```text
<p>
    {{t "You can always reactivate this group later." }}
</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_delete_all_drafts.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_delete_all_drafts.hbs

```text
<p>
    {{t "Are you sure you want to delete all drafts?  This action cannot be undone." }}
</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_delete_attachment.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_delete_attachment.hbs

```text
{{#tr}}
    <p><strong>{file_name}</strong> will be removed from the messages where it was shared. This action cannot be undone.</p>
{{/tr}}
```

--------------------------------------------------------------------------------

---[FILE: confirm_delete_data_export.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_delete_data_export.hbs

```text
<p>{{t "This action cannot be undone."}}</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_delete_detached_attachments.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_delete_detached_attachments.hbs

```text
<div>
    {{#if realm_message_edit_history_is_visible}}
        {{#tr}}
            The following <z-link>uploaded files</z-link> are no longer attached to any messages. They can still be accessed from this message's edit history. Would you like to delete them entirely?
            {{#*inline "z-link"}}<a class="uploaded_files_settings_link" href="/#settings/uploaded-files">{{> @partial-block}}</a>{{/inline}}
        {{/tr}}
    {{else}}
        {{#tr}}
            The following <z-link>uploaded files</z-link> are no longer attached to any messages. Would you like to delete them entirely?
            {{#*inline "z-link"}}<a class="uploaded_files_settings_link" href="/#settings/uploaded-files">{{> @partial-block}}</a>{{/inline}}
        {{/tr}}
    {{/if}}
</div>
<ul>
    {{#each attachments_list}}
        <li>
            <a href="/user_uploads/{{this.path_id}}" rel="noopener noreferrer" target="_blank">{{this.name}}</a>
        </li>
    {{/each}}
</ul>
```

--------------------------------------------------------------------------------

---[FILE: confirm_delete_linkifier.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_delete_linkifier.hbs

```text
<p>{{t "This action cannot be undone."}}</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_delete_message.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_delete_message.hbs

```text
<p>{{t "Deleting a message permanently removes it for everyone."}}</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_delete_playground.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_delete_playground.hbs

```text
<p>{{t "This action cannot be undone."}}</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_delete_profile_field.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_delete_profile_field.hbs

```text
{{#if (eq count 1)}}
    {{#tr}}
        This will delete the <z-profile-field-name></z-profile-field-name> profile field for 1 user.
        {{#*inline "z-profile-field-name"}}<strong>{{profile_field_name}}</strong>{{/inline}}
    {{/tr}}
{{else}}
    {{#tr}}
        This will delete the <z-profile-field-name></z-profile-field-name> profile field for <z-count></z-count> users.
        {{#*inline "z-count"}}{{count}}{{/inline}}
        {{#*inline "z-profile-field-name"}}<strong>{{profile_field_name}}</strong>{{/inline}}
    {{/tr}}
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: confirm_delete_profile_field_option.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_delete_profile_field_option.hbs

```text
<p>
    {{#if (eq count 1)}}
        {{#tr}}
            This will clear the <z-field-name></z-field-name> profile field for 1 user.
            {{#*inline "z-field-name"}}<strong>{{field_name}}</strong>{{/inline}}
        {{/tr}}
    {{else}}
        {{#tr}}
            This will clear the <z-field-name></z-field-name> profile field for <z-count></z-count> users.
            {{#*inline "z-count"}}{{count}}{{/inline}}
            {{#*inline "z-field-name"}}<strong>{{field_name}}</strong>{{/inline}}
        {{/tr}}
    {{/if}}
</p>
<div>
    {{#if (eq deleted_options_count 1)}}
        {{t "Deleted option:" }}
    {{else}}
        {{t "Deleted options:" }}
    {{/if}}
</div>
<ul>
    {{#each deleted_values}}
        <li>{{this}}</li>
    {{/each}}
</ul>
```

--------------------------------------------------------------------------------

---[FILE: confirm_delete_saved_snippet.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_delete_saved_snippet.hbs

```text
<p>{{t "This action cannot be undone."}}</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_delete_topic.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_delete_topic.hbs

```text
<p>
    {{t "Deleting a topic will immediately remove it and its messages for everyone. Other users may find this confusing, especially if they had received an email or push notification related to the deleted messages." }}
</p>
<p class="white-space-preserve-wrap">
    {{#tr}}
        Are you sure you want to permanently delete <z-topic-display-name></z-topic-display-name>?
        {{#*inline "z-topic-display-name"}}<span {{#if is_empty_string_topic}}class="empty-topic-display"{{/if}}><b class="highlighted-element">{{topic_display_name}}</b></span>{{/inline}}
    {{/tr}}
</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_delete_user_avatar.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_delete_user_avatar.hbs

```text
<p>
    {{t "Are you sure you want to delete your profile picture?" }}
</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_disable_all_notifications.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_disable_all_notifications.hbs

```text
<p>
    {{#tr}}
    You are about to disable all notifications for direct messages,
    @&#8209;mentions and alerts, which may cause you to miss messages
    that require your timely attention.
    If you would like to temporarily disable all desktop notifications,
    consider <z-link>turning on "Do not disturb"</z-link> instead.
    {{#*inline "z-link"}}<a target="_blank" rel="noopener noreferrer" href="/help/do-not-disturb">{{> @partial-block}}</a>{{/inline}}
    {{/tr}}
</p>

<p>{{t "Are you sure you want to continue?"}}</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_edit_messages.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_edit_messages.hbs

```text
<p>
    {{#tr}}
    Scrolling to your last message will mark <b>{num_unread}</b> unread messages as read. Would you like to scroll to that message and edit it?
    {{/tr}}
</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_emoji_settings_warning.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_emoji_settings_warning.hbs

```text
<div class="rendered_markdown">
    <p>
        {{#tr}}
        There is a default emoji with this name. Do you want to override it with a custom emoji?
        The name <code>:{emoji_name}:</code> will no longer work to access the default emoji.
        {{/tr}}
    </p>
</div>
```

--------------------------------------------------------------------------------

---[FILE: confirm_join_group_direct_member.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_join_group_direct_member.hbs

```text
<p>
    {{t "You are already a member of this group because you are a member of a subgroup"}} (<b class="highlighted-element">{{associated_subgroup_names}}</b>).
    {{t "Are you sure you want to join it directly as well?" }}
</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_mark_all_as_read.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_mark_all_as_read.hbs

```text
<p>
    {{t "Which messages do you want to mark as read? This action cannot be undone." }}
</p>
<div class="input-group">
    <select id="mark_as_read_option" class="modal_select bootstrap-style-font">
        <option value="muted_topics">{{t "Muted topics" }}</option>
        <option value="topics_not_followed" selected>{{t "Topics you don't follow" }}</option>
        <option value="all_messages">{{t "All messages" }}</option>
    </select>
    <p id="message_count" class="message_count"></p>
</div>
```

--------------------------------------------------------------------------------

---[FILE: confirm_mark_as_unread_from_here.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_mark_as_unread_from_here.hbs

```text
<p>
    {{#if show_message_count}}
        {{t "Are you sure you want to mark {count} messages as unread? Messages in multiple conversations may be affected."}}
    {{else}}
        {{t "Are you sure you want to mark messages as unread? Messages in multiple conversations may be affected."}}
    {{/if}}
</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_merge_topics_with_rename.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_merge_topics_with_rename.hbs

```text
<p>
    {{#tr}}
    The topic <z-topic-name>{topic_display_name}</z-topic-name> already exists in this channel.
    Are you sure you want to combine messages from these topics? This cannot be undone.
    {{#*inline "z-topic-name"}}<strong class="white-space-preserve-wrap {{#if is_empty_string_topic}}empty-topic-display{{/if}}">{{> @partial-block}}</strong>{{/inline}}
    {{/tr}}
</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_moving_messages.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_moving_messages.hbs

```text
<p>{{t "You do not have permission to move some of the messages in this topic. Contact a moderator to move all messages."}}
</p>
<p>
    {{messages_allowed_to_move_text}}
    {{messages_not_allowed_to_move_text}}
</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_mute_user.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_mute_user.hbs

```text
<p>
    {{#tr}}
    Are you sure you want to mute <z-highlight>{user_name}</z-highlight>?  Messages sent by muted users will never trigger notifications, will be marked as read, and will be hidden.
    {{#*inline "z-highlight"}}<b class="highlighted-element">{{> @partial-block}}</b>{{/inline}}
    {{/tr}}
</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_reactivate_bot.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_reactivate_bot.hbs

```text
<p>
    {{#tr}}
    <z-user></z-user> will have the same properties as it did prior to deactivation,
    including role, owner and channel subscriptions.
    {{#*inline "z-user"}}<strong>{{username}}</strong>{{/inline}}
    {{/tr}}
</p>
{{#if original_owner_deactivated}}
    <p>
        {{#tr}}
        Because the original owner of this bot <z-bot-owner></z-bot-owner> is deactivated, you will become the owner for this bot.
        {{#*inline "z-bot-owner"}}<strong>{{owner_name}}</strong>{{/inline}}
        {{/tr}}
        {{t "However, it will no longer be subscribed to the private channels that you are not subscribed to." }}
    </p>
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: confirm_reactivate_stream.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_reactivate_stream.hbs

```text
<p>
    {{#tr}}Unarchiving this channel will:{{/tr}}
</p>
<ul>
    <li>{{#tr}}Make it appear in the left sidebar for all subscribers.{{/tr}}</li>
    <li>{{#tr}}Allow sending new messages to this channel.{{/tr}}</li>
    <li>{{#tr}}Allow messages in this channel to be edited, deleted, or moved.{{/tr}}</li>
</ul>
```

--------------------------------------------------------------------------------

---[FILE: confirm_reactivate_user.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_reactivate_user.hbs

```text
<p>
    {{#tr}}
    <z-user></z-user> will have the same role, channel subscriptions,
    user group memberships, and other settings and permissions as they did
    prior to deactivation.
    {{#*inline "z-user"}}<strong>{{username}}</strong>{{/inline}}
    {{/tr}}
</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_resend_invite.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_resend_invite.hbs

```text
<p>
    {{#tr}}
        Are you sure you want to resend the invitation to <z-email></z-email>?
        {{#*inline "z-email"}}<strong>{{email}}</strong>{{/inline}}
    {{/tr}}
</p>
<p>
    {{#tr}}
    This will not change the expiration time for this invitation.
    {{/tr}}
</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_reset_stream_notifications.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_reset_stream_notifications.hbs

```text
<p>
    {{#tr}}
    Are you sure you want to reset notifications for <z-stream></z-stream>?
    {{#*inline "z-stream"}}{{> ../inline_decorated_channel_name stream=sub show_colored_icon=false}}{{/inline}}
    {{/tr}}
</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_revoke_invite.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_revoke_invite.hbs

```text
{{#if is_multiuse}}
{{#if referred_by}}
<p>{{#tr}}Are you sure you want to revoke this invitation link created by <strong>{referred_by}</strong>?{{/tr}}</p>
{{else}}
<p>{{#tr}}Are you sure you want to revoke this invitation link?{{/tr}}</p>
{{/if}}
{{else}}
<p>{{#tr}}Are you sure you want to revoke the invitation to <strong>{email}</strong>?{{/tr}}</p>
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: confirm_subscription_invites_warning.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_subscription_invites_warning.hbs

```text
<p>
    {{t "Are you sure you want to create channel ''''{channel_name}'''' and subscribe {count} users to it?" }}
</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_unstar_all_messages.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_unstar_all_messages.hbs

```text
<p>
    {{t "Are you sure you want to unstar all starred messages?  This action cannot be undone." }}
</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_unstar_all_messages_in_topic.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_unstar_all_messages_in_topic.hbs

```text
<p>
    {{#tr}}
        Are you sure you want to unstar all messages in <stream-topic></stream-topic>?  This action cannot be undone.
        {{#*inline "stream-topic"}}{{> ../stream_topic_widget .}}{{/inline}}
    {{/tr}}
</p>
```

--------------------------------------------------------------------------------

---[FILE: confirm_unsubscribe_private_stream.hbs]---
Location: zulip-main/web/templates/confirm_dialog/confirm_unsubscribe_private_stream.hbs

```text
{{#unless unsubscribing_other_user}}
    <p>{{t "Once you leave this channel, you will not be able to rejoin."}}</p>
{{/unless}}
{{#if organization_will_lose_content_access}}
    <p>
        {{t "Your organization will lose access content in this channel, and nobody will be able to subscribe to it in the future."}}
    </p>
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: intro_resolve_topic.hbs]---
Location: zulip-main/web/templates/confirm_dialog/intro_resolve_topic.hbs

```text
{{#tr}}
You're marking the topic <z-highlight>{topic_name}</z-highlight> as resolved. This adds a ✔ at the beginning of the topic name to let everyone know that this conversation is done. <z-link>Learn more</z-link>
{{#*inline "z-link"}}<a target="_blank" rel="noopener noreferrer" href="/help/resolve-a-topic">{{>
    @partial-block}}</a>{{/inline}}
{{#*inline "z-highlight"}}<b class="highlighted-element">{{> @partial-block}}</b>{{/inline}}
{{/tr}}
```

--------------------------------------------------------------------------------

---[FILE: inbox_folder_row.hbs]---
Location: zulip-main/web/templates/inbox_view/inbox_folder_row.hbs

```text
{{!-- col-index `0` is COLUMNS.FULL_ROW --}}
<div id="{{ header_id }}" tabindex="0" class="inbox-header inbox-folder {{#unless is_header_visible}}hidden_by_filters{{/unless}} {{#if is_collapsed}}inbox-collapsed-state{{/if}}" data-col-index="0">
    <div class="inbox-focus-border">
        <div class="inbox-left-part-wrapper">
            <div class="inbox-left-part">
                <div class="inbox-header-name">
                    <span class="inbox-header-name-text">
                        {{#if is_dm_header}}
                            {{t 'DIRECT MESSAGES'}}
                        {{else}}
                            {{name}}
                        {{/if}}
                    </span>
                </div>
                <div class="collapsible-button"><i class="folder-row-chevron zulip-icon zulip-icon-chevron-down"></i></div>
                <span class="unread_mention_info tippy-zulip-tooltip
                  {{#unless has_unread_mention}}hidden{{/unless}}"
                  data-tippy-content="{{t 'You have unread mentions' }}">@</span>
                <div class="unread-count-focus-outline">
                    <span class="unread_count">{{unread_count}}</span>
                </div>
            </div>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

````
