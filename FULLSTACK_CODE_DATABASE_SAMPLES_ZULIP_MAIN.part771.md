---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 771
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 771 of 1290)

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

---[FILE: notification_settings.hbs]---
Location: zulip-main/web/templates/settings/notification_settings.hbs

```text
<form class="notification-settings-form">
    <div class="general_notifications {{#if for_realm_settings}}settings-subsection-parent{{else}}subsection-parent{{/if}}">
        <div class="subsection-header">
            <h3>{{t "Notification triggers" }}</h3>
            {{> settings_save_discard_widget section_name="general-notify-settings" show_only_indicator=(not for_realm_settings) }}
        </div>
        <p>{{t "Configure how Zulip notifies you about new messages. In muted channels, channel notification settings apply only to unmuted topics." }}</p>
        <table class="notification-table table table-bordered wrapped-table">
            <thead>
                <tr>
                    <th rowspan="2" width="30%"></th>
                    <th colspan="2" width="28%">{{t "Desktop"}}</th>
                    <th rowspan="2" width="14%">
                        <span {{#if (not realm_push_notifications_enabled) }}class="control-label-disabled tippy-zulip-tooltip" data-tooltip-template-id="mobile-push-notification-tooltip-template"{{/if}}>
                            {{t "Mobile"}}
                        </span>
                        {{> ../help_link_widget link="/help/mobile-notifications#enabling-push-notifications-for-self-hosted-servers" }}
                    </th>
                    <th rowspan="2" width="14%">{{t "Email"}}</th>
                    <th rowspan="2" width="14%">@all
                        <i class="fa fa-question-circle settings-info-icon tippy-zulip-tooltip" data-tippy-content="{{t 'Whether wildcard mentions like @all are treated as mentions for the purpose of notifications.' }}"></i>
                    </th>
                </tr>
                <tr>
                    <th>{{t "Visual"}}</th>
                    <th>{{t "Audible"}}</th>
                </tr>
            </thead>
            <tbody>
                {{#each general_settings}}
                    <tr>
                        <td>
                            {{ this.label }}
                            {{#if this.help_link}}
                                {{> ../help_link_widget link=this.help_link }}
                            {{/if}}
                        </td>
                        {{#each this.notification_settings}}
                            {{> notification_settings_checkboxes
                              setting_name=this.setting_name
                              is_checked=this.is_checked
                              is_disabled=this.is_disabled
                              is_mobile_checkbox=this.is_mobile_checkbox
                              push_notifications_disabled=this.push_notifications_disabled
                              prefix=../../prefix }}
                        {{/each}}
                    </tr>
                {{/each}}
            </tbody>
            {{#unless for_realm_settings}}
            <tbody id="stream-specific-notify-table">
            </tbody>
            <tbody id="customizable_stream_notifications_table">
                <tr>
                    <td>
                        {{> ../dropdown_widget widget_name="customize_stream_notifications" custom_classes="decorated-stream-name-dropdown-widget"}}
                    </td>
                    {{#each custom_stream_specific_notification_settings}}
                        {{> notification_settings_checkboxes
                          setting_name=this.setting_name
                          is_checked=this.is_checked
                          is_mobile_checkbox=this.is_mobile_checkbox
                          is_disabled=this.is_disabled
                          push_notifications_disabled=this.push_notifications_disabled
                          prefix="customize_stream_" }}
                    {{/each}}
                </tr>
            </tbody>
            {{/unless}}
        </table>
    </div>

    <div class="topic_notifications m-10 {{#if for_realm_settings}}settings-subsection-parent{{else}}subsection-parent{{/if}}">

        <div class="subsection-header">
            <h3>{{t "Topic notifications" }}
                {{> ../help_link_widget link="/help/topic-notifications" }}
            </h3>
            {{> settings_save_discard_widget section_name="topic-notifications-settings" show_only_indicator=(not for_realm_settings) }}
        </div>
        <p>
            {{#tr}}
                You will automatically follow topics that you have configured to both <z-follow>follow</z-follow> and <z-unmute>unmute</z-unmute>.
                {{#*inline "z-follow"}}<a href="/help/follow-a-topic" target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
                {{#*inline "z-unmute"}}<a href="/help/mute-a-topic" target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
            {{/tr}}
        </p>

        <div class="input-group">
            <label for="{{prefix}}automatically_follow_topics_policy" class="settings-field-label">
                {{ settings_label.automatically_follow_topics_policy }}
                {{> ../help_link_widget link="/help/follow-a-topic" }}
            </label>
            <select name="automatically_follow_topics_policy" class="setting_automatically_follow_topics_policy prop-element settings_select bootstrap-focus-style"
              id="{{prefix}}automatically_follow_topics_policy" data-setting-widget-type="number">
                {{> dropdown_options_widget option_values=automatically_follow_topics_policy_values}}
            </select>
        </div>

        {{> settings_checkbox
          setting_name="automatically_follow_topics_where_mentioned"
          is_checked=(lookup settings_object "automatically_follow_topics_where_mentioned")
          label=(lookup settings_label "automatically_follow_topics_where_mentioned")
          prefix=prefix}}

        <div class="input-group">
            <label for="{{prefix}}automatically_unmute_topics_in_muted_streams_policy" class="settings-field-label">
                {{ settings_label.automatically_unmute_topics_in_muted_streams_policy }}
                {{> ../help_link_widget link="/help/mute-a-topic" }}
            </label>
            <select name="automatically_unmute_topics_in_muted_streams_policy" class="setting_automatically_unmute_topics_in_muted_streams_policy prop-element settings_select bootstrap-focus-style"
              id="{{prefix}}automatically_unmute_topics_in_muted_streams_policy" data-setting-widget-type="number">
                {{> dropdown_options_widget option_values=automatically_unmute_topics_in_muted_streams_policy_values}}
            </select>
        </div>

        <div class="input-group">
            <label for="{{prefix}}resolved_topic_notice_auto_read_policy" class="settings-field-label">{{t "Automatically mark resolved topic notices as read" }}</label>
            <select name="resolved_topic_notice_auto_read_policy" class="setting_resolved_topic_notice_auto_read_policy prop-element settings_select bootstrap-focus-style" id="{{prefix}}resolved_topic_notice_auto_read_policy" data-setting-widget-type="string">
                {{> dropdown_options_widget option_values=resolved_topic_notice_auto_read_policy_values}}
            </select>
        </div>
    </div>

    <div class="desktop_notifications m-10 {{#if for_realm_settings}}settings-subsection-parent{{else}}subsection-parent{{/if}}">

        <div class="subsection-header">
            <h3>{{t "Desktop message notifications" }}
                {{> ../help_link_widget link="/help/desktop-notifications" }}
            </h3>
            {{> settings_save_discard_widget section_name="desktop-message-settings" show_only_indicator=(not for_realm_settings) }}
        </div>

        {{#if (eq prefix "user_")}}
        <div class="desktop-notification-settings-banners banner-wrapper"></div>
        {{/if}}

        {{#unless for_realm_settings}}
        {{> ../components/action_button
          label=(t "Send a test notification")
          attention="quiet"
          intent="neutral"
          custom_classes="send_test_notification"
          }}
        {{/unless}}

        {{#each notification_settings.desktop_notification_settings}}
            {{> settings_checkbox
              setting_name=this
              is_checked=(lookup ../settings_object this)
              label=(lookup ../settings_label this)
              prefix=../prefix}}
        {{/each}}

        <label for="{{prefix}}notification_sound">
            {{t "Notification sound" }}
        </label>

        <div class="input-group input-element-with-control {{#unless enable_sound_select}}control-label-disabled{{/unless}}">
            <select name="notification_sound" class="setting_notification_sound prop-element settings_select bootstrap-focus-style" id="{{prefix}}notification_sound" data-setting-widget-type="string"
              {{#unless enable_sound_select}}
              disabled
              {{/unless}}>
                <option value="none">{{t "None" }}</option>
                {{#each settings_object.available_notification_sounds}}
                    <option value="{{ this }}">{{ this }}</option>
                {{/each}}
            </select>
            <span class="play_notification_sound">
                <i class="notification-sound-icon fa fa-play-circle" aria-label="{{t 'Play sound' }}"></i>
            </span>
        </div>

        <div class="input-group">
            <label for="{{prefix}}desktop_icon_count_display" class="settings-field-label">{{ settings_label.desktop_icon_count_display }}</label>
            <select name="desktop_icon_count_display" class="setting_desktop_icon_count_display prop-element settings_select bootstrap-focus-style" id="{{prefix}}desktop_icon_count_display" data-setting-widget-type="number">
                {{> dropdown_options_widget option_values=desktop_icon_count_display_values}}
            </select>
        </div>
    </div>

    <div class="mobile_notifications m-10 {{#if for_realm_settings}}settings-subsection-parent{{else}}subsection-parent{{/if}}">

        <div class="subsection-header">
            <h3>{{t "Mobile message notifications" }}
                {{> ../help_link_widget link="/help/mobile-notifications" }}
            </h3>
            {{> settings_save_discard_widget section_name="mobile-message-settings" show_only_indicator=(not for_realm_settings) }}
        </div>
        {{#unless realm_push_notifications_enabled}}
        <div class="mobile-push-notifications-banner-container banner-wrapper">
        </div>
        {{/unless}}

        {{#each notification_settings.mobile_notification_settings}}
            {{> settings_checkbox
              setting_name=this
              is_checked=(lookup ../settings_object this)
              is_disabled=(lookup ../disabled_notification_settings this)
              label=(lookup ../settings_label this)
              prefix=../prefix}}
        {{/each}}
    </div>

    <div class="email_message_notifications m-10 {{#if for_realm_settings}}settings-subsection-parent{{else}}subsection-parent{{/if}}">

        <div class="subsection-header">
            <h3>{{t "Email message notifications" }}
                {{> ../help_link_widget link="/help/email-notifications" }}
            </h3>
            {{> settings_save_discard_widget section_name="email-message-settings" show_only_indicator=(not for_realm_settings) }}
        </div>

        <div class="input-group time-limit-setting">

            <label for="{{prefix}}email_notifications_batching_period_seconds" class="settings-field-label">
                {{t "Delay before sending message notification emails" }}
            </label>
            <select name="email_notifications_batching_period_seconds" class="setting_email_notifications_batching_period_seconds prop-element settings_select bootstrap-focus-style" id="{{prefix}}email_notifications_batching_period_seconds" data-setting-widget-type="time-limit">
                {{#each email_notifications_batching_period_values}}
                    <option value="{{ this.value }}">{{ this.description }}</option>
                {{/each}}
            </select>
            <div class="dependent-settings-block">
                <label for="{{prefix}}email_notification_batching_period_edit_minutes" class="inline-block">
                    {{t 'Delay period (minutes)' }}:
                </label>
                <input type="text"
                  name="email_notification_batching_period_edit_minutes"
                  class="email_notification_batching_period_edit_minutes time-limit-custom-input"
                  data-setting-widget-type="time-limit"
                  autocomplete="off"
                  id="{{prefix}}email_notification_batching_period_edit_minutes"/>
            </div>
        </div>

        <div class="input-group">
            <label for="{{prefix}}realm_name_in_email_notifications_policy" class="settings-field-label">{{ settings_label.realm_name_in_email_notifications_policy }}</label>
            <select name="realm_name_in_email_notifications_policy" class="setting_realm_name_in_email_notifications_policy prop-element settings_select bootstrap-focus-style" id="{{prefix}}realm_name_in_email_notifications_policy" data-setting-widget-type="number">
                {{> dropdown_options_widget option_values=realm_name_in_email_notifications_policy_values}}
            </select>
        </div>

        {{#each notification_settings.email_message_notification_settings}}
            {{> settings_checkbox
              setting_name=this
              is_checked=(lookup ../settings_object this)
              label=(lookup ../settings_label this)
              is_disabled=(lookup ../disabled_notification_settings this)
              prefix=../prefix}}
        {{/each}}
    </div>

    <div class="other_email_notifications m-10 {{#if for_realm_settings}}settings-subsection-parent{{else}}subsection-parent{{/if}}">

        <div class="subsection-header">
            <h3>{{t "Other emails" }}</h3>
            {{> settings_save_discard_widget section_name="other-emails-settings" show_only_indicator=(not for_realm_settings) }}
        </div>
        {{#each notification_settings.other_email_settings}}
            {{> settings_checkbox
              setting_name=this
              is_checked=(lookup ../settings_object this)
              label=(lookup ../settings_label this)
              prefix=../prefix}}
        {{/each}}
    </div>
</form>
```

--------------------------------------------------------------------------------

---[FILE: notification_settings_checkboxes.hbs]---
Location: zulip-main/web/templates/settings/notification_settings_checkboxes.hbs

```text
<td>
    <span {{#if (and is_mobile_checkbox push_notifications_disabled)}} class="tippy-zulip-tooltip" data-tooltip-template-id="mobile-push-notification-tooltip-template"{{/if}}>
        <label class="checkbox">
            <input type="checkbox" name="{{setting_name}}" id="{{prefix}}{{setting_name}}"
              {{#if is_disabled}} disabled {{/if}}
              {{#if is_checked}}checked="checked"{{/if}} data-setting-widget-type="boolean"
              class="{{setting_name}}{{#unless is_disabled}} prop-element{{/unless}}"/>
            <span class="rendered-checkbox"></span>
        </label>
    </span>
</td>
```

--------------------------------------------------------------------------------

---[FILE: organization_permissions_admin.hbs]---
Location: zulip-main/web/templates/settings/organization_permissions_admin.hbs

```text
<div id="organization-permissions" data-name="organization-permissions" class="settings-section">
    <form class="admin-realm-form org-permissions-form">

        <div id="org-join-settings" class="settings-subsection-parent">
            <div class="subsection-header">
                <h3>
                    {{t "Joining the organization" }}
                    <i class="fa fa-info-circle settings-info-icon tippy-zulip-tooltip" aria-hidden="true" data-tippy-content="{{t 'Only owners can change these settings.' }}"></i>
                </h3>
                {{> settings_save_discard_widget section_name="join-settings" }}
            </div>
            <div class="m-10 inline-block organization-permissions-parent">
                <div id="realm_invite_required_container" {{#unless user_has_email_set}}class="disabled_setting_tooltip"{{/unless}}>
                    {{> settings_checkbox
                      setting_name="realm_invite_required"
                      prefix="id_"
                      is_checked=realm_invite_required
                      is_disabled=(not user_has_email_set)
                      label=admin_settings_label.realm_invite_required}}
                </div>
                {{> group_setting_value_pill_input
                  setting_name="realm_can_invite_users_group"
                  label=group_setting_labels.can_invite_users_group}}

                {{> group_setting_value_pill_input
                  setting_name="realm_create_multiuse_invite_group"
                  label=group_setting_labels.create_multiuse_invite_group}}

                <div class="input-group">
                    <label for="id_realm_org_join_restrictions" class="settings-field-label">{{t "Restrict email domains of new users" }}</label>
                    <select name="realm_org_join_restrictions" id="id_realm_org_join_restrictions" class="prop-element settings_select bootstrap-focus-style" data-setting-widget-type="string">
                        <option value="no_restriction">{{t "No restrictions" }}</option>
                        <option value="no_disposable_email">{{t "Don’t allow disposable email addresses" }}</option>
                        <option value="only_selected_domain">{{t "Restrict to a list of domains" }}</option>
                    </select>
                    <div class="dependent-settings-block">
                        <p id="allowed_domains_label" class="inline-block"></p>
                        {{#if is_owner }}
                        <a id="show_realm_domains_modal" role="button">{{t "[Configure]" }}</a>
                        {{/if}}
                    </div>
                </div>
                <div class="input-group time-limit-setting">
                    <label for="id_realm_waiting_period_threshold" class="settings-field-label">
                        {{t "Waiting period before new members turn into full members" }}
                        {{> ../help_link_widget link="/help/restrict-permissions-of-new-members" }}
                    </label>
                    <select name="realm_waiting_period_threshold" id="id_realm_waiting_period_threshold" class="prop-element settings_select bootstrap-focus-style" data-setting-widget-type="time-limit">
                        {{> dropdown_options_widget option_values=waiting_period_threshold_dropdown_values}}
                    </select>
                    {{!-- This setting is hidden unless `custom_period` --}}
                    <div class="dependent-settings-block">
                        <label for="id_realm_waiting_period_threshold_custom_input" class="inline-block">{{t "Waiting period (days)" }}:</label>
                        <input type="text" id="id_realm_waiting_period_threshold_custom_input"
                          name="realm_waiting_period_threshold_custom_input"
                          class="time-limit-custom-input"
                          value="{{ realm_waiting_period_threshold }}"/>
                    </div>
                </div>
            </div>
        </div>

        <div id="org-stream-permissions" class="settings-subsection-parent">
            <div class="subsection-header">
                <h3>{{t "Channel permissions" }}
                    {{> ../help_link_widget link="/help/channel-permissions" }}
                </h3>
                {{> settings_save_discard_widget section_name="stream-permissions" }}
            </div>
            <div class="m-10 organization-permissions-parent">
                {{> group_setting_value_pill_input
                  setting_name="realm_can_create_public_channel_group"
                  label=group_setting_labels.can_create_public_channel_group}}

                {{> upgrade_tip_widget . }}
                {{> settings_checkbox
                  setting_name="realm_enable_spectator_access"
                  prefix="id_"
                  is_checked=realm_enable_spectator_access
                  label=admin_settings_label.realm_enable_spectator_access
                  is_disabled=disable_enable_spectator_access_setting
                  help_link="/help/public-access-option"}}

                {{> ../dropdown_widget_with_label
                  widget_name="realm_can_create_web_public_channel_group"
                  label=group_setting_labels.can_create_web_public_channel_group
                  value_type="number"}}

                {{> group_setting_value_pill_input
                  setting_name="realm_can_create_private_channel_group"
                  label=group_setting_labels.can_create_private_channel_group}}


                {{> group_setting_value_pill_input
                  setting_name="realm_can_add_subscribers_group"
                  label=group_setting_labels.can_add_subscribers_group}}

                {{> group_setting_value_pill_input
                  setting_name="realm_can_mention_many_users_group"
                  label=group_setting_labels.can_mention_many_users_group
                  help_link="/help/restrict-wildcard-mentions"}}

                {{> group_setting_value_pill_input
                  setting_name="realm_can_set_topics_policy_group"
                  label=group_setting_labels.can_set_topics_policy_group
                  help_link="/help/require-topics"}}
            </div>
        </div>

        <div id="org-group-permissions" class="settings-subsection-parent">
            <div class="subsection-header">
                <h3>{{t "Group permissions" }}
                    {{> ../help_link_widget link="/help/manage-user-groups" }}
                </h3>
                {{> settings_save_discard_widget section_name="group-permissions" }}
            </div>
            <div class="m-10 organization-permissions-parent">
                {{> group_setting_value_pill_input
                  setting_name="realm_can_manage_all_groups"
                  label=group_setting_labels.can_manage_all_groups}}
                {{> upgrade_tip_widget . }}
                {{> group_setting_value_pill_input
                  setting_name="realm_can_create_groups"
                  label=group_setting_labels.can_create_groups}}
            </div>
        </div>

        <div id="org-direct-message-permissions" class="settings-subsection-parent">
            <div class="subsection-header">
                <h3>{{t "Direct message permissions" }}
                    {{> ../help_link_widget link="/help/restrict-direct-messages" }}
                </h3>
                {{> settings_save_discard_widget section_name="direct-message-permissions" }}
            </div>

            {{> group_setting_value_pill_input
              setting_name="realm_direct_message_permission_group"
              label=group_setting_labels.direct_message_permission_group}}

            {{> group_setting_value_pill_input
              setting_name="realm_direct_message_initiator_group"
              label=group_setting_labels.direct_message_initiator_group}}
        </div>

        <div id="org-msg-editing" class="settings-subsection-parent">
            <div class="subsection-header">
                <h3>{{t "Message editing" }}
                    {{> ../help_link_widget link="/help/restrict-message-editing-and-deletion" }}
                </h3>
                {{> settings_save_discard_widget section_name="msg-editing" }}
            </div>
            <div class="inline-block organization-settings-parent">
                {{> settings_checkbox
                  setting_name="realm_allow_message_editing"
                  prefix="id_"
                  is_checked=realm_allow_message_editing
                  label=admin_settings_label.realm_allow_message_editing}}

                <div class="input-group">
                    <label for="id_realm_message_edit_history_visibility_policy" class="settings-field-label">{{t "Allow viewing the history of a message?"}}</label>
                    <select name="realm_message_edit_history_visibility_policy" id="id_realm_message_edit_history_visibility_policy" class="prop-element settings_select bootstrap-focus-style" data-setting-widget-type="string">
                        {{> dropdown_options_widget option_values=message_edit_history_visibility_policy_values}}
                    </select>
                </div>

                <div class="input-group time-limit-setting">
                    <label for="id_realm_message_content_edit_limit_seconds" class="settings-field-label">{{t "Time limit for editing messages" }}</label>
                    <select name="realm_message_content_edit_limit_seconds" id="id_realm_message_content_edit_limit_seconds" class="prop-element settings_select bootstrap-focus-style" {{#unless realm_allow_message_editing}}disabled{{/unless}} data-setting-widget-type="time-limit">
                        {{#each msg_edit_limit_dropdown_values}}
                            <option value="{{value}}">{{text}}</option>
                        {{/each}}
                    </select>
                    <div class="dependent-settings-block">
                        <label for="id_realm_message_content_edit_limit_minutes" class="inline-block realm-time-limit-label">
                            {{t 'Time limit'}}:&nbsp;
                        </label>
                        <input type="text" id="id_realm_message_content_edit_limit_minutes"
                          name="realm_message_content_edit_limit_minutes"
                          class="time-limit-custom-input"
                          autocomplete="off"
                          value="{{ realm_message_content_edit_limit_minutes }}"
                          {{#unless realm_allow_message_editing}}disabled{{/unless}}/>&nbsp;
                        <span class="time-unit-text">
                            {{t "{realm_message_content_edit_limit_minutes, plural, one {minute} other {minutes}}"}}
                        </span>


                    </div>
                </div>
            </div>
        </div>

        <div id="org-moving-msgs" class="settings-subsection-parent">
            <div class="subsection-header">
                <h3>{{t "Moving messages" }}
                    {{> ../help_link_widget link="/help/restrict-moving-messages" }}
                </h3>
                {{> settings_save_discard_widget section_name="moving-msgs" }}
            </div>

            {{> group_setting_value_pill_input
              setting_name="realm_can_move_messages_between_topics_group"
              label=group_setting_labels.can_move_messages_between_topics_group}}

            <div class="input-group time-limit-setting">
                <label for="id_realm_move_messages_within_stream_limit_seconds" class="settings-field-label">{{t "Time limit for editing topics" }} <i>({{t "does not apply to moderators and administrators" }})</i></label>
                <select name="realm_move_messages_within_stream_limit_seconds" id="id_realm_move_messages_within_stream_limit_seconds" class="prop-element settings_select" data-setting-widget-type="time-limit">
                    {{#each msg_move_limit_dropdown_values}}
                        <option value="{{value}}">{{text}}</option>
                    {{/each}}
                </select>
                <div class="dependent-settings-block">
                    <label for="id_realm_move_messages_within_stream_limit_minutes" class="inline-block realm-time-limit-label">
                        {{t 'Time limit'}}:&nbsp;
                    </label>
                    <input type="text" id="id_realm_move_messages_within_stream_limit_minutes"
                      name="realm_move_messages_within_stream_limit_minutes"
                      class="time-limit-custom-input"
                      autocomplete="off"/>&nbsp;
                    <span class="time-unit-text">
                        {{t "{realm_move_messages_within_stream_limit_minutes, plural, one {minute} other {minutes}}"}}
                    </span>
                </div>
            </div>

            {{> group_setting_value_pill_input
              setting_name="realm_can_move_messages_between_channels_group"
              label=group_setting_labels.can_move_messages_between_channels_group}}

            <div class="input-group time-limit-setting">
                <label for="id_realm_move_messages_between_streams_limit_seconds" class="settings-field-label">{{t "Time limit for moving messages between channels" }} <i>({{t "does not apply to moderators and administrators" }})</i></label>
                <select name="realm_move_messages_between_streams_limit_seconds" id="id_realm_move_messages_between_streams_limit_seconds" class="prop-element bootstrap-focus-style settings_select" data-setting-widget-type="time-limit">
                    {{#each msg_move_limit_dropdown_values}}
                        <option value="{{value}}">{{text}}</option>
                    {{/each}}
                </select>
                <div class="dependent-settings-block">
                    <label for="id_realm_move_messages_between_streams_limit_minutes" class="inline-block realm-time-limit-label">
                        {{t 'Time limit'}}:&nbsp;
                    </label>
                    <input type="text" id="id_realm_move_messages_between_streams_limit_minutes"
                      name="realm_move_messages_between_streams_limit_minutes"
                      class="time-limit-custom-input"
                      autocomplete="off"/>&nbsp;
                    <span class="time-unit-text">
                        {{t "{realm_move_messages_between_streams_limit_minutes, plural, one {minute} other {minutes}}"}}
                    </span>
                </div>
            </div>

            {{> group_setting_value_pill_input
              setting_name="realm_can_resolve_topics_group"
              label=group_setting_labels.can_resolve_topics_group}}
        </div>

        <div id="org-msg-deletion" class="settings-subsection-parent">
            <div class="subsection-header">
                <h3>{{t "Message deletion" }}
                    {{> ../help_link_widget link="/help/delete-a-message" }}
                </h3>
                {{> settings_save_discard_widget section_name="msg-deletion" }}
            </div>
            <div class="inline-block organization-settings-parent">
                {{> group_setting_value_pill_input
                  setting_name="realm_can_delete_any_message_group"
                  label=group_setting_labels.can_delete_any_message_group}}

                {{> group_setting_value_pill_input
                  setting_name="realm_can_delete_own_message_group"
                  label=group_setting_labels.can_delete_own_message_group}}

                <div class="input-group time-limit-setting">
                    <label for="id_realm_message_content_delete_limit_seconds" class="settings-field-label">
                        {{t "Time limit for deleting messages" }} <i>({{t "does not apply to users who can delete any message" }})</i>
                    </label>
                    <select name="realm_message_content_delete_limit_seconds" id="id_realm_message_content_delete_limit_seconds" class="prop-element bootstrap-focus-style settings_select" data-setting-widget-type="time-limit">
                        {{#each msg_delete_limit_dropdown_values}}
                            <option value="{{value}}">{{text}}</option>
                        {{/each}}
                    </select>
                    <div class="dependent-settings-block">
                        <label for="id_realm_message_content_delete_limit_minutes" class="inline-block realm-time-limit-label">
                            {{t "Time limit" }}:&nbsp;
                        </label>
                        <input type="text" id="id_realm_message_content_delete_limit_minutes"
                          name="realm_message_content_delete_limit_minutes"
                          class="time-limit-custom-input"
                          autocomplete="off"
                          value="{{ realm_message_content_delete_limit_minutes }}"/>&nbsp;
                        <span class="time-unit-text">{{t "{realm_message_content_delete_limit_minutes, plural, one {minute} other {minutes}}"}}</span>
                    </div>
                </div>

                {{> group_setting_value_pill_input
                  setting_name="realm_can_set_delete_message_policy_group"
                  label=group_setting_labels.can_set_delete_message_policy_group}}
            </div>
        </div>

        <div id="org-user-identity" class="settings-subsection-parent">
            <div class="subsection-header">
                <h3>{{t "User identity" }}
                    {{> ../help_link_widget link="/help/restrict-name-and-email-changes" }}
                </h3>
                {{> settings_save_discard_widget section_name="user-identity" }}
            </div>
            <div class="inline-block organization-permissions-parent">
                {{> settings_checkbox
                  setting_name="realm_require_unique_names"
                  prefix="id_"
                  is_checked=realm_require_unique_names
                  label=admin_settings_label.realm_require_unique_names}}

                {{> settings_checkbox
                  setting_name="realm_name_changes_disabled"
                  prefix="id_"
                  is_checked=(or realm_name_changes_disabled server_name_changes_disabled)
                  label=admin_settings_label.realm_name_changes_disabled
                  is_disabled=server_name_changes_disabled}}

                {{> settings_checkbox
                  setting_name="realm_email_changes_disabled"
                  prefix="id_"
                  is_checked=realm_email_changes_disabled
                  label=admin_settings_label.realm_email_changes_disabled}}

                {{> settings_checkbox
                  setting_name="realm_avatar_changes_disabled"
                  prefix="id_"
                  is_checked=(or realm_avatar_changes_disabled server_avatar_changes_disabled)
                  label=admin_settings_label.realm_avatar_changes_disabled
                  is_disabled=server_avatar_changes_disabled}}

            </div>
        </div>

        <div id="org-guest-settings" class="settings-subsection-parent">
            <div class="subsection-header">
                <h3>{{t "Guests" }}</h3>
                {{> settings_save_discard_widget section_name="guest-settings" }}
            </div>

            <div class="inline-block organization-permissions-parent">
                {{> settings_checkbox
                  setting_name="realm_enable_guest_user_indicator"
                  prefix="id_"
                  is_checked=realm_enable_guest_user_indicator
                  label=admin_settings_label.realm_enable_guest_user_indicator}}

                {{> settings_checkbox
                  setting_name="realm_enable_guest_user_dm_warning"
                  prefix="id_"
                  is_checked=realm_enable_guest_user_dm_warning
                  label=admin_settings_label.realm_enable_guest_user_dm_warning}}

                {{> ../dropdown_widget_with_label
                  widget_name="realm_can_access_all_users_group"
                  label=group_setting_labels.can_access_all_users_group
                  value_type="number"
                  help_link="/help/guest-users#configure-whether-guests-can-see-all-other-users"}}
            </div>
        </div>

        <div id="org-other-permissions" class="settings-subsection-parent">
            <div class="subsection-header">
                <h3>{{t "Other permissions" }}</h3>
                {{> settings_save_discard_widget section_name="other-permissions" }}
            </div>
            <div class="m-10 inline-block organization-permissions-parent">
                {{#if is_plan_self_hosted}}
                    {{> group_setting_value_pill_input
                      setting_name="realm_can_manage_billing_group"
                      label=group_setting_labels.can_manage_billing_group
                      help_link="https://zulip.com//help/self-hosted-billing"
                      }}
                {{else}}
                    {{> group_setting_value_pill_input
                      setting_name="realm_can_manage_billing_group"
                      label=group_setting_labels.can_manage_billing_group
                      help_link="/help/zulip-cloud-billing"
                      }}
                {{/if}}

                <div class="disabled-unfinished-feature"
                  {{#unless server_can_summarize_topics}}style="display: none"{{/unless}}>
                    {{#unless server_can_summarize_topics}}
                        <div class="tip">
                            {{#if is_plan_self_hosted}}
                            {{t "AI summaries are not enabled on this server."}}
                            {{else}}
                            {{t "AI summaries are not available on Zulip Cloud yet."}}
                            {{/if}}
                        </div>
                    {{/unless}}
                    {{> group_setting_value_pill_input
                      setting_name="realm_can_summarize_topics_group"
                      label=group_setting_labels.can_summarize_topics_group}}
                </div>

                {{> group_setting_value_pill_input
                  setting_name="realm_can_create_write_only_bots_group"
                  label=group_setting_labels.can_create_write_only_bots_group}}

                {{> group_setting_value_pill_input
                  setting_name="realm_can_create_bots_group"
                  label=group_setting_labels.can_create_bots_group}}

                {{> group_setting_value_pill_input
                  setting_name="realm_can_add_custom_emoji_group"
                  label=group_setting_labels.can_add_custom_emoji_group}}
            </div>
        </div>
    </form>
</div>
```

--------------------------------------------------------------------------------

````
