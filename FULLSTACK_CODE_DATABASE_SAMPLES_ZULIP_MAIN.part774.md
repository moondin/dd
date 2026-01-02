---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 774
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 774 of 1290)

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

---[FILE: channel_folder.hbs]---
Location: zulip-main/web/templates/stream_settings/channel_folder.hbs

```text
<div class="channel-folder-subsection">
    <div class="input-group channel-folder-container">
        {{!-- This is a modified version of dropdown_widget_with_label.hbs
        component so that we can show dropdown button and button to create
        a new folder on same line without having to add much CSS with
        hardcoded margin and padding values. --}}
        <label class="settings-field-label" for="{{channel_folder_widget_name}}_widget">
            {{t "Channel folder"}}
            {{> ../help_link_widget link="/help/channel-folders" }}
        </label>
        <span class="prop-element hide" id="id_{{channel_folder_widget_name}}" data-setting-widget-type="dropdown-list-widget" data-setting-value-type="number"></span>
        <div class="dropdown_widget_with_label_wrapper channel-folder-widget-container">
            {{> ../dropdown_widget widget_name=channel_folder_widget_name}}

            {{#if is_admin}}
                {{> ../components/action_button
                  label=(t "Create new folder")
                  attention="quiet"
                  intent="neutral"
                  type="button"
                  custom_classes="create-channel-folder-button"
                  }}
            {{/if}}
        </div>
    </div>

    <span class="settings-field-label no-folders-configured-message">
        {{t "There are no channel folders configured in this organization."}}
        {{> ../help_link_widget link="/help/channel-folders" }}
    </span>
</div>
```

--------------------------------------------------------------------------------

---[FILE: channel_name_conflict_error.hbs]---
Location: zulip-main/web/templates/stream_settings/channel_name_conflict_error.hbs

```text
{{#if is_archived}}
    {{#if can_view_channel}}
        {{#tr}}
            An <z-link>archived channel</z-link> with this name already exists.
            {{#*inline "z-link"}}<a href="#channels/{{stream_id}}/general" class="stream-settings-link">{{> @partial-block}}</a>{{/inline}}
        {{/tr}}
    {{else}}
        {{t "An archived channel with this name already exists." }}
    {{/if}}
    {{#if show_rename}}
        <a id="archived_stream_rename" data-stream-id="{{stream_id}}">{{t "Rename it" }}</a>
    {{/if}}
{{else}}
    {{#if can_view_channel}}
        {{#tr}}
            A <z-link>channel</z-link> with this name already exists.
            {{#*inline "z-link"}}<a href="#channels/{{stream_id}}/general" class="stream-settings-link">{{> @partial-block}}</a>{{/inline}}
        {{/tr}}
    {{else}}
        {{t "A channel with this name already exists." }}
    {{/if}}
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: channel_permissions.hbs]---
Location: zulip-main/web/templates/stream_settings/channel_permissions.hbs

```text
<div id="channel-subscription-permissions" class="settings-subsection-parent">
    <div class="channel-subscription-permissions-title-container {{#if is_stream_edit}}subsection-header{{/if}}">
        <h4 class="stream_setting_subsection_title">{{t "Subscription permissions"}}</h4>
        {{#if is_stream_edit}}
            {{> ../settings/settings_save_discard_widget section_name="subscription-permissions"}}
        {{/if}}
    </div>

    {{#if is_stream_edit}}
        <div class="stream-permissions-warning-banner"></div>
        {{> channel_type .
          channel_privacy_widget_name="channel_privacy" }}

        <div class="default-stream">
            {{> ../settings/settings_checkbox
              prefix=prefix
              setting_name="is_default_stream"
              is_checked=check_default_stream
              label=(t "Default channel for new users")
              help_link="/help/set-default-channels-for-new-users"
              }}
        </div>
    {{/if}}

    {{> ../settings/group_setting_value_pill_input
      setting_name="can_subscribe_group"
      label=group_setting_labels.can_subscribe_group
      prefix=prefix }}

    {{> ../settings/group_setting_value_pill_input
      setting_name="can_add_subscribers_group"
      label=group_setting_labels.can_add_subscribers_group
      prefix=prefix }}

    {{> ../settings/group_setting_value_pill_input
      setting_name="can_remove_subscribers_group"
      label=group_setting_labels.can_remove_subscribers_group
      prefix=prefix }}
</div>

<div id="channel-messaging-permissions" class="settings-subsection-parent">
    <div class="channel-messaging-permissions-title-container {{#if is_stream_edit}}subsection-header{{/if}}">
        <h4 class="stream_setting_subsection_title">{{t "Messaging permissions"}}</h4>
        {{#if is_stream_edit}}
            {{> ../settings/settings_save_discard_widget section_name="messaging-permissions"}}
        {{/if}}
    </div>

    {{> ../settings/group_setting_value_pill_input
      setting_name="can_send_message_group"
      label=group_setting_labels.can_send_message_group
      prefix=prefix
      help_link="/help/channel-posting-policy" }}

    {{> ../settings/group_setting_value_pill_input
      setting_name="can_create_topic_group"
      label=group_setting_labels.can_create_topic_group
      prefix=prefix
      help_link="/help/configure-who-can-start-new-topics" }}

    <div class="input-group">
        <label for="{{prefix}}topics_policy" class="settings-field-label">{{> stream_topics_policy_label .}}</label>
        <select name="stream-topics-policy-setting" id="{{prefix}}topics_policy" class="prop-element settings_select bootstrap-focus-style" data-setting-widget-type="string">
            {{> ../settings/dropdown_options_widget option_values=stream_topics_policy_values}}
        </select>
        {{> topics_already_exist_error .}}
    </div>
</div>

<div id="channel-moderation-permissions" class="settings-subsection-parent">
    <div class="channel-moderation-permissions-title-container {{#if is_stream_edit}}subsection-header{{/if}}">
        <h4 class="stream_setting_subsection_title">{{t "Moderation permissions"}}</h4>
        {{#if is_stream_edit}}
            {{> ../settings/settings_save_discard_widget section_name="moderation-permissions"}}
        {{/if}}
    </div>

    {{> ../settings/group_setting_value_pill_input
      setting_name="can_move_messages_within_channel_group"
      label=group_setting_labels.can_move_messages_within_channel_group
      prefix=prefix }}

    {{> ../settings/group_setting_value_pill_input
      setting_name="can_move_messages_out_of_channel_group"
      label=group_setting_labels.can_move_messages_out_of_channel_group
      prefix=prefix }}

    {{> ../settings/group_setting_value_pill_input
      setting_name="can_resolve_topics_group"
      label=group_setting_labels.can_resolve_topics_group
      prefix=prefix }}

    {{> ../settings/group_setting_value_pill_input
      setting_name="can_delete_any_message_group"
      label=group_setting_labels.can_delete_any_message_group
      prefix=prefix }}

    {{> ../settings/group_setting_value_pill_input
      setting_name="can_delete_own_message_group"
      label=group_setting_labels.can_delete_own_message_group
      prefix=prefix }}
</div>

<div id="channel-administrative-permissions" class="settings-subsection-parent">
    <div class="channel-administrative-permissions-title-container {{#if is_stream_edit}}subsection-header{{/if}}">
        <h4 class="stream_setting_subsection_title">{{t "Administrative permissions"}}</h4>
        {{#if is_stream_edit}}
            {{> ../settings/settings_save_discard_widget section_name="administrative-permissions"}}
        {{/if}}
    </div>
    <div class="admin-permissions-tip">
        {{t 'Organization administrators can automatically administer all channels.'}}
    </div>
    {{> ../settings/group_setting_value_pill_input
      setting_name="can_administer_channel_group"
      label=group_setting_labels.can_administer_channel_group
      prefix=prefix }}

    {{#if (or is_owner is_stream_edit)}}
        <div>
            <div class="input-group message-retention-setting-group time-limit-setting">
                <label class="dropdown-title settings-field-label" for="{{prefix}}message_retention_days">{{t "Message retention period" }}
                    {{> ../help_link_widget link="/help/message-retention-policy" }}
                </label>

                {{> ../settings/upgrade_tip_widget .}}

                <select name="stream_message_retention_setting"
                  class="stream_message_retention_setting prop-element settings_select bootstrap-focus-style"
                  id="{{prefix}}message_retention_days"
                  data-setting-widget-type="message-retention-setting">
                    <option value="realm_default">{{t "Organization default {org_level_message_retention_setting}" }}</option>
                    <option value="unlimited">{{t 'Retain forever' }}</option>
                    <option value="custom_period">{{t 'Custom' }}</option>
                </select>

                <div class="dependent-settings-block stream-message-retention-days-input">
                    <label class="inline-block" for="{{prefix}}stream_message_retention_custom_input">
                        {{t 'Retention period (days)' }}:
                    </label>
                    <input type="text" autocomplete="off"
                      name="stream-message-retention-days"
                      class="stream-message-retention-days message-retention-setting-custom-input time-limit-custom-input"
                      id="{{prefix}}stream_message_retention_custom_input" />
                </div>
            </div>
        </div>
    {{/if}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: channel_type.hbs]---
Location: zulip-main/web/templates/stream_settings/channel_type.hbs

```text
{{> ../dropdown_widget_with_label
  widget_name=channel_privacy_widget_name
  label=(t 'Who can access this channel')}}

<div class="history-public-to-subscribers">
    {{> ../settings/settings_checkbox
      prefix=prefix
      setting_name="history_public_to_subscribers"
      is_checked=history_public_to_subscribers
      label=(t "Subscribers can view messages sent before they joined")
      help_link="/help/channel-permissions#private-channels"
      }}
</div>
```

--------------------------------------------------------------------------------

---[FILE: confirm_stream_privacy_change_modal.hbs]---
Location: zulip-main/web/templates/stream_settings/confirm_stream_privacy_change_modal.hbs

```text
<div class="confirm-stream-privacy-modal">
    <p class="confirm-stream-privacy-info">
        {{t "This change will make this channel's entire message history accessible according to the new configuration."}}
    </p>
</div>
```

--------------------------------------------------------------------------------

---[FILE: copy_email_address_modal.hbs]---
Location: zulip-main/web/templates/stream_settings/copy_email_address_modal.hbs

```text
<div class="copy-email-modal">
    {{> ../dropdown_widget_with_label
      widget_name="sender_channel_email_address"
      label=(t 'Who should be the sender of the Zulip messages for this email address?')}}
    <p class="question-which-parts">
        {{t "Which parts of the emails should be included in the Zulip messages?"}}
    </p>
    {{#each tags}}
        {{#if (eq this.name "prefer-html") }}
        <hr />
        {{/if}}
        <div class="input-group" id="{{this.name}}-input-group">
            <label class="checkbox">
                <input class="tag-checkbox" id="{{ this.name }}" type="checkbox"/>
                <span class="rendered-checkbox"></span>
            </label>
            <label class="inline" for="{{this.name}}">{{this.description}}</label>
        </div>
    {{/each}}
    <hr />
    <p class="stream-email-header">
        {{t "Channel email address:"}}
    </p>
    <div class="stream-email">
        <div class="email-address">{{email_address}}</div>
        <span class="copy-button tippy-zulip-tooltip copy-email-address" data-tippy-content="{{t 'Copy email address' }}" data-clipboard-text="{{email_address}}">
            <i class="zulip-icon zulip-icon-copy"></i>
        </span>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: create_channel_folder_modal.hbs]---
Location: zulip-main/web/templates/stream_settings/create_channel_folder_modal.hbs

```text
<div>
    <label for="new_channel_folder_name" class="modal-field-label">
        {{t 'Channel folder name' }}
    </label>
    <input type="text" id="new_channel_folder_name" class="modal_text_input" name="channel_folder_name" maxlength="{{ max_channel_folder_name_length }}" />
</div>
<div>
    <label for="new_channel_folder_description" class="modal-field-label">
        {{t 'Description' }}
    </label>
    <textarea id="new_channel_folder_description" class="modal-textarea" name="channel_folder_description" maxlength="{{ max_channel_folder_description_length }}"></textarea>
</div>
```

--------------------------------------------------------------------------------

---[FILE: edit_channel_folder_modal.hbs]---
Location: zulip-main/web/templates/stream_settings/edit_channel_folder_modal.hbs

```text
<div id="channel_folder_banner" class="banner-wrapper"></div>
<div>
    <label for="edit_channel_folder_name" class="modal-field-label">
        {{t 'Channel folder name' }}
    </label>
    <input type="text" id="edit_channel_folder_name" class="modal_text_input" name="channel_folder_name" maxlength="{{ max_channel_folder_name_length }}" value="{{name}}" />
</div>
<div>
    <label for="edit_channel_folder_description" class="modal-field-label">
        {{t 'Description' }}
    </label>
    <textarea id="edit_channel_folder_description" class="modal-textarea" name="channel_folder_description" maxlength="{{ max_channel_folder_description_length }}">{{~description~}}</textarea>
</div>
<div>
    <div>
        <h3 class="folder-channels-list-header">
            {{t 'Channels' }}
        </h3>
    </div>
    <div class="stream-list-container" data-folder-id="{{folder_id}}">
        <div class="stream-search-container filter-input has-input-icon has-input-button input-element-wrapper">
            <i class="input-icon zulip-icon zulip-icon-search" aria-hidden="true"></i>
            <input type="text" class="input-element stream-search" placeholder="{{t 'Filter' }}" />
            <button type="button" class="input-button input-close-filter-button icon-button icon-button-square icon-button-neutral ">
                <i class="zulip-icon zulip-icon-close" aria-hidden="true"></i>
            </button>
        </div>
        <div class="edit-channel-folder-stream-list" data-simplebar data-simplebar-tab-index="-1">
            <ul class="folder-stream-list" data-empty="{{t 'No channel in channel folder.' }}" data-search-results-empty="{{t 'No matching channels.' }}"></ul>
        </div>
    </div>
</div>
<div>
    <div>
        <h3 class="folder-channels-list-header">
            {{t 'Add a channel' }}
        </h3>
    </div>
    <div class="add_channel_folder_widget">
        {{> ../dropdown_widget widget_name="add_channel_folder"}}
        {{> ../components/action_button label=(t "Add") custom_classes="add-channel-button" attention="quiet" intent="brand" aria-label=(t "Add") }}
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: first_stream_created_modal.hbs]---
Location: zulip-main/web/templates/stream_settings/first_stream_created_modal.hbs

```text
{{t 'You will now see the channel you created. To go back to channel settings, you can:' }}
<ul>
    <li>
        {{#tr}}
        Click on <z-stream></z-stream> at the top of your Zulip window.
        {{#*inline "z-stream"}}<b class="highlighted-element">{{> ../inline_decorated_channel_name stream=stream}}</b>{{/inline}}
        {{/tr}}
    </li>
    <li>
        {{#tr}}
        Use the <z-highlight>back</z-highlight> button in your browser or desktop app.
        {{#*inline "z-highlight"}}<b class="highlighted-element">{{> @partial-block}}</b>{{/inline}}
        {{/tr}}
    </li>
</ul>
```

--------------------------------------------------------------------------------

---[FILE: new_stream_configuration.hbs]---
Location: zulip-main/web/templates/stream_settings/new_stream_configuration.hbs

```text
{{> channel_type .
  channel_privacy_widget_name="new_channel_privacy" }}

{{#if ask_to_announce_stream}}
    <div id="announce-new-stream">
        {{>announce_stream_checkbox . }}
    </div>
{{/if}}

<div class="default-stream">
    {{> ../settings/settings_checkbox
      prefix=prefix
      setting_name="is_default_stream"
      is_checked=check_default_stream
      label=(t "Default channel for new users")
      help_link="/help/set-default-channels-for-new-users"
      }}
</div>

{{> channel_folder .
  is_stream_edit=false
  }}

<div class="advanced-configurations-container">
    <div class="advance-config-title-container">
        <div class="advance-config-toggle-area">
            <i class="fa fa-sm fa-caret-right toggle-advanced-configurations-icon" aria-hidden="true"></i>
            <h3 class="stream_setting_subsection_title"><span>{{t 'Advanced configuration' }}</span></h3>
        </div>
    </div>
    <div class="advanced-configurations-collapase-view hide">
        {{> channel_permissions .
          is_stream_edit=false
          }}
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: new_stream_user.hbs]---
Location: zulip-main/web/templates/stream_settings/new_stream_user.hbs

```text
<tr class="settings-subscriber-row" data-user-id="{{user_id}}" >
    <td class="panel_user_list">
        {{> ../user_display_only_pill . display_value=full_name strikethrough=soft_removed is_active=true is_bot=is_bot}}
    </td>
    {{#if email}}
        <td class="subscriber-email settings-email-column {{#if soft_removed}} strikethrough {{/if}}">{{email}}</td>
    {{else}}
        <td class="hidden-subscriber-email {{#if soft_removed}} strikethrough {{/if}}">{{t "(hidden)"}}</td>
    {{/if}}
    <td class="action-column">
        {{#if soft_removed}}
            {{> ../components/action_button custom_classes="undo_soft_removed_potential_subscriber" label=(t "Add") attention="quiet" intent="neutral" aria-label=(t "Add") }}
        {{else}}
            {{> ../components/action_button custom_classes="remove_potential_subscriber" label=(t "Remove") attention="quiet" intent="neutral" aria-label=(t "Remove") }}
        {{/if}}
    </td>
</tr>
```

--------------------------------------------------------------------------------

---[FILE: new_stream_users.hbs]---
Location: zulip-main/web/templates/stream_settings/new_stream_users.hbs

```text
<div class="subscriber_list_settings">
    <div class="subscriber_list_add float-left">
        {{> add_subscribers_form hide_add_button=true}}
    </div>
    <br />
</div>

<div class="create_stream_subscriber_list_header">
    <h4 class="stream_setting_subsection_title">{{t 'Subscribers preview' }}</h4>
    <input class="add-user-list-filter filter_text_input" name="user_list_filter" type="text"
      autocomplete="off" placeholder="{{t 'Filter' }}" />
</div>

<div class="add-subscriber-loading-spinner"></div>

<div class="subscriber-list-box">
    <div class="subscriber_list_container" data-simplebar data-simplebar-tab-index="-1">
        <table class="subscriber-list table table-striped">
            <thead class="table-sticky-headers">
                <tr>
                    <th class="panel_user_list" data-sort="alphabetic" data-sort-prop="full_name">{{t "Name" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th class="settings-email-column" data-sort="email">{{t "Email" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th class="action-column">{{t "Action" }}</th>
                </tr>
            </thead>
            <tbody id="create_stream_subscribers" class="subscriber_table" data-empty="{{t 'This channel has no subscribers.' }}" data-search-results-empty="{{t 'No channel subscribers match your current filter.'}}"></tbody>
        </table>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: selected_stream_title.hbs]---
Location: zulip-main/web/templates/stream_settings/selected_stream_title.hbs

```text
<a {{#if preview_url}}class="tippy-zulip-delayed-tooltip selected-stream-title" data-tooltip-template-id="view-stream-tooltip-template" data-tippy-placement="top" href="{{preview_url}}{{/if}}">
{{#unless preview_url}}{{t "Add subscribers to "}}{{/unless}}
{{> stream_privacy_icon
  invite_only=sub.invite_only
  is_web_public=sub.is_web_public
  is_archived=sub.is_archived }}
<span class="stream-name-title">{{sub.name}}</span>
</a>
```

--------------------------------------------------------------------------------

---[FILE: stream_can_subscribe_group_label.hbs]---
Location: zulip-main/web/templates/stream_settings/stream_can_subscribe_group_label.hbs

```text
{{t "Who can subscribe to this channel"}}
{{#unless is_invite_only}}
<i>({{t "everyone except guests can subscribe to any public channel"}})</i>
{{/unless}}
```

--------------------------------------------------------------------------------

---[FILE: stream_creation_form.hbs]---
Location: zulip-main/web/templates/stream_settings/stream_creation_form.hbs

```text
<div class="hide two-pane-settings-right-simplebar-container" id="stream-creation" tabindex="-1" role="dialog"
  aria-label="{{t 'Channel creation' }}">
    <form id="stream_creation_form">
        <div class="two-pane-settings-creation-simplebar-container" data-simplebar data-simplebar-tab-index="-1">
            <div class="alert stream_create_info"></div>
            <div id="stream_creating_indicator"></div>
            <div class="stream-creation-body">
                <div class="configure_channel_settings stream_creation_container">
                    <section id="create_stream_title_container">
                        <label for="create_stream_name">
                            {{t "Channel name" }}
                        </label>
                        <input type="text" name="stream_name" id="create_stream_name" class="settings_text_input"
                          placeholder="{{t 'Channel name' }}" value="" autocomplete="off" maxlength="{{ max_stream_name_length }}" />
                        <div id="stream_name_error" class="stream_creation_error"></div>
                    </section>
                    <section id="create_stream_description_container">
                        <label for="create_stream_description" class="settings-field-label">
                            {{t "Channel description" }}
                            {{> ../help_link_widget link="/help/change-the-channel-description" }}
                        </label>
                        <input type="text" name="stream_description" id="create_stream_description" class="settings_text_input"
                          placeholder="{{t 'Channel description' }}" value="" autocomplete="off" maxlength="{{ max_stream_description_length }}" />
                    </section>
                    <section id="make-invite-only">
                        <div class="new-stream-configuration">
                            {{> new_stream_configuration .
                              prefix="id_new_"
                              channel_folder_widget_name="new_channel_folder_id"}}
                        </div>
                    </section>
                </div>
                <div class="subscribers_container stream_creation_container">
                    <section class="stream_create_add_subscriber_container">
                        <h4 class="stream_setting_subsection_title">
                            <label class="choose-subscribers-label">{{t "Choose subscribers" }}</label>
                        </h4>
                        <div id="stream_subscription_error" class="stream_creation_error"></div>
                        <div class="controls" id="people_to_add"></div>
                    </section>
                </div>
            </div>
        </div>
        <div class="settings-sticky-footer">
            <div class="settings-sticky-footer-left">
                {{> ../components/action_button
                  label=(t "Back to settings")
                  custom_classes="hide"
                  id="stream_creation_go_to_configure_channel_settings"
                  attention="quiet"
                  intent="brand"
                  }}
            </div>
            <div class="settings-sticky-footer-right">
                {{> ../components/action_button
                  label=(t "Cancel")
                  custom_classes="create_stream_cancel inline-block"
                  attention="quiet"
                  intent="neutral"
                  }}
                {{> ../components/action_button
                  label=(t "Create")
                  custom_classes="finalize_create_stream hide"
                  attention="quiet"
                  intent="brand"
                  type="submit"
                  }}
                {{> ../components/action_button
                  label=(t "Continue to add subscribers")
                  custom_classes="inline-block"
                  id="stream_creation_go_to_subscribers"
                  attention="quiet"
                  intent="brand"
                  }}
            </div>
        </div>
    </form>
</div>
```

--------------------------------------------------------------------------------

---[FILE: stream_description.hbs]---
Location: zulip-main/web/templates/stream_settings/stream_description.hbs

```text
{{#if rendered_description}}
<span class="sub-stream-description rendered_markdown">
    {{rendered_markdown rendered_description}}
</span>
{{else}}
<span class="sub-stream-description no-description">
    {{t "This channel does not yet have a description." }}
</span>
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: stream_members.hbs]---
Location: zulip-main/web/templates/stream_settings/stream_members.hbs

```text
<div class="subscriber_list_settings_container no-display">
    <h4 class="stream_setting_subsection_title">
        {{t "Add subscribers" }}
    </h4>
    <div class="subscriber_list_settings">
        <div class="subscriber_list_add float-left">
            <div class="stream_subscription_request_result banner-wrapper"></div>
            {{> add_subscribers_form .}}
        </div>
        <div class="clear-float"></div>
    </div>
    <div>
        <div class="subsection-parent send_notification_to_new_subscribers_container inline-block">
            {{> ./../settings/settings_checkbox
              setting_name="send_notification_to_new_subscribers"
              is_checked=true
              label=(t "Send notification message to newly subscribed users")
              }}
        </div>
    </div>
    <div>
        <h4 class="inline-block stream_setting_subsection_title">{{t "Subscribers"}}</h4>
        <span class="subscriber-search float-right">
            <input type="text" class="search filter_text_input" placeholder="{{t 'Filter' }}" />
        </span>
    </div>
    <div class="add-subscriber-loading-spinner"></div>
    <div class="subscriber-list-box">
        {{> stream_members_table .}}
    </div>
</div>
<div class="subscriber-list-settings-loading"></div>
```

--------------------------------------------------------------------------------

---[FILE: stream_members_table.hbs]---
Location: zulip-main/web/templates/stream_settings/stream_members_table.hbs

```text
<div class="subscriber_list_container" data-simplebar data-simplebar-tab-index="-1">
    <div class="subscriber_list_loading_indicator"></div>
    <table id="stream_members_list" class="subscriber-list table table-striped">
        <thead class="table-sticky-headers">
            <tr>
                <th class="panel_user_list" data-sort="alphabetic" data-sort-prop="full_name">{{t "Name" }}
                    <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                </th>
                <th class="settings-email-column" data-sort="email">{{t "Email" }}
                    <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                </th>
                {{#if can_remove_subscribers}}
                <th class="remove-button-column"></th>
                {{/if}}
            </tr>
        </thead>
        <tbody class="subscriber_table" data-empty="{{t 'This channel has no subscribers.' }}" data-search-results-empty="{{t 'No channel subscribers match your current filter.'}}"></tbody>
    </table>
</div>
```

--------------------------------------------------------------------------------

---[FILE: stream_member_list_entry.hbs]---
Location: zulip-main/web/templates/stream_settings/stream_member_list_entry.hbs

```text
<tr data-subscriber-id="{{user_id}}" class="hidden-remove-button-row">
    <td class="subscriber-name panel_user_list">
        {{> ../user_display_only_pill . display_value=name is_active=true}}
    </td>
    {{#if email}}
    <td class="subscriber-email settings-email-column">{{email}}</td>
    {{else}}
    <td class="hidden-subscriber-email">{{t "(hidden)"}}</td>
    {{/if}}
    {{#if can_remove_subscribers}}
    <td class="unsubscribe remove-button-wrapper remove-button-column">
        {{#if for_user_group_members}}
            {{> ../components/icon_button icon="close" custom_classes="hidden-remove-button remove-subscriber-button tippy-zulip-delayed-tooltip" intent="danger" aria-label=(t "Remove") data-tippy-content=(t "Remove") }}
        {{else}}
            {{> ../components/icon_button icon="close" custom_classes="hidden-remove-button remove-subscriber-button tippy-zulip-delayed-tooltip" intent="danger" aria-label=(t "Unsubscribe") data-tippy-content=(t "Unsubscribe") }}
        {{/if}}
    </td>
    {{/if}}
</tr>
```

--------------------------------------------------------------------------------

---[FILE: stream_privacy_icon.hbs]---
Location: zulip-main/web/templates/stream_settings/stream_privacy_icon.hbs

```text
{{! This controls whether the swatch next to streams in the stream edit page has a lock icon. }}
{{#if is_archived}}
<div class="large-icon" {{#if title_icon_color}}style="color: {{title_icon_color}}{{/if}}">
    <i class="zulip-icon zulip-icon-archive" aria-hidden="true"></i>
</div>
{{else if invite_only}}
<div class="large-icon" {{#if title_icon_color}}style="color: {{title_icon_color}}"{{/if}}>
    <i class="zulip-icon zulip-icon-lock" aria-hidden="true"></i>
</div>
{{else if is_web_public}}
<div class="large-icon" {{#if title_icon_color}}style="color: {{title_icon_color}}"{{/if}}>
    <i class="zulip-icon zulip-icon-globe" aria-hidden="true"></i>
</div>
{{else}}
<div class="large-icon" {{#if title_icon_color}}style="color: {{title_icon_color}}"{{/if}}>
    <i class="zulip-icon zulip-icon-hashtag" aria-hidden="true"></i>
</div>
{{/if}}
```

--------------------------------------------------------------------------------

````
