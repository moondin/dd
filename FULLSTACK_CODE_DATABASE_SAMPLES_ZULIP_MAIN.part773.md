---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 773
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 773 of 1290)

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

---[FILE: preferences_left_sidebar.hbs]---
Location: zulip-main/web/templates/settings/preferences_left_sidebar.hbs

```text
<div class="left-sidebar-settings {{#if for_realm_settings}}settings-subsection-parent{{else}}subsection-parent{{/if}}">
    <div class="subsection-header">
        <h3 class="light">{{t "Left sidebar" }}</h3>
        {{> settings_save_discard_widget section_name="left-sidebar-settings" show_only_indicator=(not for_realm_settings) }}
    </div>

    <div class="input-group">
        <label for="{{prefix}}web_stream_unreads_count_display_policy" class="settings-field-label">{{t "Show unread counts for" }}</label>
        <select name="web_stream_unreads_count_display_policy" class="setting_web_stream_unreads_count_display_policy prop-element bootstrap-focus-style settings_select" id="{{prefix}}web_stream_unreads_count_display_policy"  data-setting-widget-type="number">
            {{> dropdown_options_widget option_values=web_stream_unreads_count_display_policy_values}}
        </select>
    </div>

    {{> settings_checkbox
      setting_name="web_left_sidebar_unreads_count_summary"
      is_checked=settings_object.web_left_sidebar_unreads_count_summary
      label=settings_label.web_left_sidebar_unreads_count_summary
      render_only=settings_render_only.web_left_sidebar_unreads_count_summary
      prefix=prefix}}

    {{> settings_checkbox
      setting_name="starred_message_counts"
      is_checked=settings_object.starred_message_counts
      label=settings_label.starred_message_counts
      render_only=settings_render_only.starred_message_counts
      prefix=prefix}}

    {{> settings_checkbox
      setting_name="web_left_sidebar_show_channel_folders"
      is_checked=settings_object.web_left_sidebar_show_channel_folders
      label=settings_label.web_left_sidebar_show_channel_folders
      render_only=settings_render_only.web_left_sidebar_show_channel_folders
      help_link="/help/channel-folders"
      prefix=prefix}}

    <div class="input-group">
        <label for="{{prefix}}demote_inactive_streams" class="settings-field-label">{{t "Hide inactive channels" }}
            {{> ../help_link_widget link="/help/manage-inactive-channels" }}
        </label>
        <select name="demote_inactive_streams" class="setting_demote_inactive_streams prop-element settings_select bootstrap-focus-style" id="{{prefix}}demote_inactive_streams"  data-setting-widget-type="number">
            {{> dropdown_options_widget option_values=demote_inactive_streams_values}}
        </select>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: preferences_navigation.hbs]---
Location: zulip-main/web/templates/settings/preferences_navigation.hbs

```text
<div class="navigation-settings {{#if for_realm_settings}}settings-subsection-parent{{else}}subsection-parent{{/if}}">
    <div class="subsection-header">
        <h3 class="light">{{t "Navigation" }}</h3>
        {{> settings_save_discard_widget section_name="navigation-settings" show_only_indicator=(not for_realm_settings) }}
    </div>

    <div class="input-group">
        <label for="{{prefix}}web_home_view" class="settings-field-label">{{t "Home view" }}
            {{> ../help_link_widget link="/help/configure-home-view" }}
        </label>
        <select name="web_home_view" class="setting_web_home_view prop-element settings_select bootstrap-focus-style" id="{{prefix}}web_home_view" data-setting-widget-type="string">
            {{> dropdown_options_widget option_values=web_home_view_values}}
        </select>
    </div>

    {{> settings_checkbox
      setting_name="web_escape_navigates_to_home_view"
      is_checked=settings_object.web_escape_navigates_to_home_view
      label=settings_label.web_escape_navigates_to_home_view
      prefix=prefix}}

    {{> settings_checkbox
      setting_name="web_navigate_to_sent_message"
      is_checked=settings_object.web_navigate_to_sent_message
      label=settings_label.web_navigate_to_sent_message
      prefix=prefix}}

    <div class="input-group">
        <label for="{{prefix}}web_mark_read_on_scroll_policy" class="settings-field-label">{{t "Automatically mark messages as read" }}
            {{> ../help_link_widget link="/help/marking-messages-as-read" }}
        </label>
        <select name="web_mark_read_on_scroll_policy" class="setting_web_mark_read_on_scroll_policy prop-element settings_select bootstrap-focus-style" id="{{prefix}}web_mark_read_on_scroll_policy"  data-setting-widget-type="number">
            {{> dropdown_options_widget option_values=web_mark_read_on_scroll_policy_values}}
        </select>
    </div>

    <div class="input-group">
        <label for="{{prefix}}web_channel_default_view" class="settings-field-label">{{t "Channel links in the left sidebar go to" }}</label>
        <select name="web_channel_default_view" class="setting_web_channel_default_view prop-element settings_select bootstrap-focus-style" id="{{prefix}}web_channel_default_view"  data-setting-widget-type="number">
            {{> dropdown_options_widget option_values=web_channel_default_view_values}}
        </select>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: privacy_settings.hbs]---
Location: zulip-main/web/templates/settings/privacy_settings.hbs

```text
<div {{#if for_realm_settings}}class="privacy_settings settings-subsection-parent" {{else}} id="privacy_settings_box"
  {{/if}}>
    <div class="subsection-header inline-block">
        {{#if for_realm_settings}}
        <h3 class="inline-block">{{t "Privacy settings"}}</h3>
        {{> settings_save_discard_widget section_name="privacy-setting" show_only_indicator=false }}
        {{else}}
        <h3 class="inline-block">{{t "Privacy"}}</h3>
        {{> settings_save_discard_widget section_name="privacy-setting" show_only_indicator=(not for_realm_settings) }}
        {{/if}}
    </div>

    {{> settings_checkbox
      setting_name="send_private_typing_notifications"
      is_checked=settings_object.send_private_typing_notifications
      label=settings_label.send_private_typing_notifications
      prefix=prefix
      }}
    {{> settings_checkbox
      setting_name="send_stream_typing_notifications"
      is_checked=settings_object.send_stream_typing_notifications
      label=settings_label.send_stream_typing_notifications
      prefix=prefix
      }}
    {{> settings_checkbox
      setting_name="send_read_receipts"
      is_checked=settings_object.send_read_receipts
      label=settings_label.send_read_receipts
      prefix=prefix
      help_link="/help/read-receipts"
      help_icon_tooltip_text=read_receipts_help_icon_tooltip_text
      hide_tooltip=hide_read_receipts_tooltip
      }}
    {{> settings_checkbox
      setting_name="presence_enabled"
      is_checked=settings_object.presence_enabled
      label=settings_label.presence_enabled
      label_parens_text=settings_label.presence_enabled_parens_text
      help_link="/help/status-and-availability"
      prefix=prefix
      }}
    {{#unless for_realm_settings}}
    {{> settings_checkbox
      setting_name="allow_private_data_export"
      is_checked=private_data_export_is_checked
      is_disabled=private_data_export_is_disabled
      tooltip_message=private_data_export_tooltip_text
      label=settings_label.allow_private_data_export
      help_link="/help/export-your-organization#export-your-organization"
      }}
    {{/unless}}

    <div class="input-group">
        <label for="{{prefix}}email_address_visibility" class="settings-field-label">
            {{#if for_realm_settings}}
            {{t "Who can access user's email address"}}
            {{else}}
            {{t "Who can access your email address"}}
            {{/if}}
            {{> ../help_link_widget link="/help/configure-email-visibility" }}
        </label>
        <div id="user_email_address_dropdown_container"
          class="inline-block {{#unless user_has_email_set}}disabled_setting_tooltip{{/unless}}">
            <select name="email_address_visibility"
              class="email_address_visibility prop-element settings_select bootstrap-focus-style"
              data-setting-widget-type="number"
              id="{{prefix}}email_address_visibility"
              {{#unless user_has_email_set}}disabled="disabled"{{/unless}}>
                {{> dropdown_options_widget option_values=email_address_visibility_values}}
            </select>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: profile_field_choice.hbs]---
Location: zulip-main/web/templates/settings/profile_field_choice.hbs

```text
<div class='choice-row movable-row' data-value="{{value}}">
    <span class="move-handle {{#if new_empty_choice_row}}invisible{{/if}}">
        <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
        <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
    </span>
    <input type='text' class="modal_text_input" placeholder='{{t "New option" }}' value="{{ text }}" />
    {{> ../components/icon_button intent="danger" custom_classes="delete-choice tippy-zulip-tooltip" hidden=new_empty_choice_row icon="trash" data-tippy-content=(t "Delete") aria-label=(t "Delete") }}
</div>
```

--------------------------------------------------------------------------------

---[FILE: profile_field_settings_admin.hbs]---
Location: zulip-main/web/templates/settings/profile_field_settings_admin.hbs

```text
<div id="profile-field-settings" class="settings-section" data-name="profile-field-settings">
    <div class="settings_panel_list_header">
        <h3>{{t "Custom profile fields"}}</h3>
        <div class="alert-notification" id="admin-profile-field-status"></div>
        {{#if is_admin}}
            {{> ../components/action_button
              id="add-custom-profile-field-button"
              label=(t "Add a new profile field")
              attention="quiet"
              intent="brand"
              }}
        {{/if}}
    </div>
    <div class="progressive-table-wrapper" data-simplebar data-simplebar-tab-index="-1">
        <table class="table table-striped admin_profile_fields_table">
            <thead>
                <tr>
                    <th>{{t "Label" }}</th>
                    <th>{{t "Hint" }}</th>
                    <th>{{t "Type" }}</th>
                    {{#if is_admin}}
                    <th class="display">{{t "Card"}}</th>
                    <th class="required">{{t "Required"}}</th>
                    <th class="actions">{{t "Actions" }}</th>
                    {{/if}}
                </tr>
            </thead>
            <tbody id="admin_profile_fields_table" data-empty="{{t 'No custom profile fields configured.' }}"></tbody>
        </table>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: profile_settings.hbs]---
Location: zulip-main/web/templates/settings/profile_settings.hbs

```text
<div id="profile-settings" class="settings-section" data-name="profile">
    <div class="profile-settings-form">
        <div class="profile-main-panel inline-block">
            <h3 class="inline-block" id="user-profile-header">{{t "Profile" }}</h3>
            <div id="user_details_section">
                <div class="full-name-change-container">
                    <div class="input-group inline-block grid user-name-parent">
                        <div class="user-name-section inline-block">
                            <label for="full_name" class="settings-field-label inline-block {{#unless user_can_change_name}}cursor-text{{/unless}}">{{t "Name" }}</label>
                            <div class="alert-notification full-name-status"></div>
                            <div class="settings-profile-user-field-hint">{{t "How your account is displayed in Zulip." }}</div>
                            <div id="full_name_input_container" {{#unless user_can_change_name}}class="disabled_setting_tooltip"{{/unless}}>
                                <input id="full_name" name="full_name" class="settings_text_input" type="text" value="{{ current_user.full_name }}" {{#unless user_can_change_name}}disabled="disabled"{{/unless}} maxlength="{{max_user_name_length}}" />
                            </div>
                        </div>
                    </div>
                </div>

                <form class="timezone-setting-form">
                    <div class="input-group grid">
                        <label for="user_timezone_widget" class="settings-field-label inline-block">{{t "Time zone" }}</label>
                        <div class="alert-notification timezone-setting-status"></div>
                        <div class="timezone-input">
                            {{> ../dropdown_widget_with_label
                              widget_name="user_timezone"
                              label=""
                              value_type="string"
                              value=settings_object.timezone
                              custom_classes="timezone-dropdown-widget"
                              }}
                        </div>
                    </div>
                    <div id="automatically_offer_update_time_zone_container">
                        {{> settings_checkbox
                          setting_name="automatically_offer_update_time_zone"
                          is_checked=settings_object.web_suggest_update_timezone
                          label=settings_label.web_suggest_update_timezone
                          }}
                    </div>
                </form>

                <form class="custom-profile-fields-form grid"></form>
            </div>
        </div>

        <div class="profile-side-panel">
            <div class="inline-block user-avatar-section">
                {{> image_upload_widget
                  widget = "user-avatar"
                  upload_text = (t "Upload new profile picture")
                  delete_text = (t "Delete profile picture")
                  disabled_text = (t "Avatar changes are disabled in this organization")
                  is_editable_by_current_user = user_can_change_avatar
                  image = current_user.avatar_url_medium}}
                <div id="user-avatar-source">
                    <a href="https://en.gravatar.com/" target="_blank" rel="noopener noreferrer">{{t "Avatar from Gravatar" }}</a>
                </div>
            </div>
            <div class="user-details">
                <div id="user_role_details" class="input-group">
                    <span class="user-details-title">{{t "Role" }}:</span>
                    <span class="user-details-desc">{{user_role_text}}</span>
                </div>

                <div class="input-group">
                    <span class="user-details-title">{{t "Joined" }}: </span>
                    <span class="user-details-desc">{{date_joined_text}}</span>
                </div>
            </div>
            {{> ../components/action_button
              label=(t "Preview profile")
              attention="quiet"
              intent="brand"
              id="show_my_user_profile_modal"
              icon="external-link"
              aria-hidden="true"
              }}
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: realm_description.hbs]---
Location: zulip-main/web/templates/settings/realm_description.hbs

```text
<div class="input-group admin-realm">
    <label for="id_realm_description" class="settings-field-label">
        {{t "Organization description" }}
    </label>
    {{#if is_admin}}
        <textarea id="id_realm_description" name="realm_description"
          class="admin-realm-description setting-widget prop-element settings-textarea"
          maxlength="1000" data-setting-widget-type="string">{{ realm_description_text }}</textarea>
    {{else}}
        <div class="admin-realm-description settings-highlight-box rendered_markdown">
            {{rendered_markdown realm_description_html}}
        </div>
    {{/if}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: realm_domains_modal.hbs]---
Location: zulip-main/web/templates/settings/realm_domains_modal.hbs

```text
<table class="table table-stripped" id="realm_domains_table">
    <thead>
        <tr>
            <th>{{t "Domain" }}</th>
            <th>{{t "Allow subdomains"}}</th>
            <th>{{t "Action" }}</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
    <tfoot>
        <tr id="add-realm-domain-widget">
            <td><input type="text" class="new-realm-domain modal_text_input" placeholder="acme.com" /></td>
            <td>
                <label class="checkbox">
                    <input type="checkbox" class="new-realm-domain-allow-subdomains" />
                    <span class="rendered-checkbox"></span>
                </label>
            </td>
            <td>
                {{> ../components/action_button
                  label=(t "Add")
                  id="submit-add-realm-domain"
                  attention="quiet"
                  intent="brand"
                  }}
            </td>
        </tr>
    </tfoot>
</table>
<div class="alert realm_domains_info"></div>
```

--------------------------------------------------------------------------------

---[FILE: realm_topics_policy_label.hbs]---
Location: zulip-main/web/templates/settings/realm_topics_policy_label.hbs

```text
{{#tr}}
    Default <z-empty-string-topic-display-name></z-empty-string-topic-display-name> topic configuration for channels
    {{#*inline "z-empty-string-topic-display-name"}}<span class="empty-topic-display">{{empty_string_topic_display_name}}</span>{{/inline}}
{{/tr}}
```

--------------------------------------------------------------------------------

---[FILE: settings_checkbox.hbs]---
Location: zulip-main/web/templates/settings/settings_checkbox.hbs

```text
{{#unless (eq render_only false)}}
<div class="input-group settings-checkbox-wrapper {{#if is_disabled}}control-label-disabled{{/if}}{{#if tooltip_message}} tippy-zulip-tooltip{{/if}}"{{#if tooltip_message}} data-tippy-content="{{tooltip_message}}"{{/if}}>
    <label class="checkbox">
        <input type="checkbox" class="{{setting_name}} inline-block setting-widget {{#unless skip_prop_element}}prop-element{{/unless}}" name="{{setting_name}}" data-setting-widget-type="boolean"
          id="{{#if prefix}}{{prefix}}{{/if}}{{setting_name}}" {{#if is_checked}}checked="checked"{{/if}} {{#if is_disabled}}disabled{{/if}} />
        <span class="rendered-checkbox"></span>
    </label>
    <label for="{{#if prefix}}{{prefix}}{{/if}}{{setting_name}}" class="inline {{setting_name}}_label" id="{{#if prefix}}{{prefix}}{{/if}}{{setting_name}}_label">
        {{label}}
        {{#if label_parens_text}}
        (<i>{{label_parens_text}}</i>)
        {{/if}}
        {{#if help_link}}
        {{> ../help_link_widget link=help_link }}
        {{/if}}
        {{#if help_icon_tooltip_text}}
        <i class="tippy-zulip-tooltip fa fa-info-circle settings-info-icon" {{#if hide_tooltip}}style="display: none;"{{/if}} data-tippy-content="{{help_icon_tooltip_text}}"></i>
        {{/if}}
    </label>
</div>
{{/unless}}
```

--------------------------------------------------------------------------------

---[FILE: settings_numeric_input.hbs]---
Location: zulip-main/web/templates/settings/settings_numeric_input.hbs

```text
{{#unless (eq render_only false)}}
<div class="input-group {{#if is_disabled}}control-label-disabled{{/if}}">
    <label for="{{#if prefix}}{{prefix}}{{/if}}{{setting_name}}" class="{{setting_name}}_label" id="{{#if prefix}}{{prefix}}{{/if}}{{setting_name}}_label">
        {{label}}
        {{#if label_parens_text}}
        (<i>{{label_parens_text}}</i>)
        {{/if}}
        {{#if help_link}}
        {{> ../help_link_widget link=help_link }}
        {{/if}}
        {{#if help_icon_tooltip_text}}
        <i class="tippy-zulip-tooltip fa fa-info-circle settings-info-icon" {{#if hide_tooltip}}style="display: none;"{{/if}} data-tippy-content="{{help_icon_tooltip_text}}"></i>
        {{/if}}
    </label>
    <input type="text" inputmode="numeric" pattern="\d*" value="{{setting_value}}" class="{{setting_name}} settings_text_input setting-widget prop-element" name="{{setting_name}}" data-setting-widget-type="number"
      id="{{#if prefix}}{{prefix}}{{/if}}{{setting_name}}" {{#if is_disabled}}disabled{{/if}} />
</div>
{{/unless}}
```

--------------------------------------------------------------------------------

---[FILE: settings_save_discard_widget.hbs]---
Location: zulip-main/web/templates/settings/settings_save_discard_widget.hbs

```text
{{#unless show_only_indicator}}
<div class="save-button-controls hide">
    <div class="inline-block subsection-changes-save">
        {{> ../components/action_button custom_classes="save-button" attention="primary" intent="brand" label=(t "Save changes") }}
    </div>
    <div class="inline-block subsection-changes-discard">
        {{> ../components/action_button custom_classes="discard-button" attention="quiet" intent="neutral" label=(t "Discard") }}
    </div>
    <div class="inline-block subsection-failed-status"><p class="hide"></p></div>
</div>
{{else}}
<div class="alert-notification {{section_name}}-status"></div>
{{/unless}}
```

--------------------------------------------------------------------------------

---[FILE: settings_user_list_row.hbs]---
Location: zulip-main/web/templates/settings/settings_user_list_row.hbs

```text
<tr class="user_row{{#if is_active}} active-user{{else}} deactivated_user{{/if}}" data-user-id="{{user_id}}">
    <td class="user_name panel_user_list">
        {{> ../user_display_only_pill display_value=full_name user_id=user_id is_bot=is_bot img_src=img_src is_active=is_active is_current_user=is_current_user}}
    </td>
    {{#if display_email}}
    <td class="email settings-email-column">
        <span class="email">{{display_email}}</span>
    </td>
    {{else}}
    <td class="email settings-email-column">
        <span class="hidden-email">{{t "(hidden)"}}</span>
    </td>
    {{/if}}
    <td>
        <span class="user_role">{{user_role_text}}</span>
    </td>
    {{#if is_bot}}
    <td>
        <span class="owner panel_user_list">
            {{#if no_owner }}
            {{bot_owner_full_name}}
            {{else}}
            {{> ../user_display_only_pill display_value=bot_owner_full_name user_id=bot_owner_id img_src=owner_img_src is_active=is_bot_owner_active}}
            {{/if}}
        </span>
    </td>
    <td class="bot_type">
        <span class="bot type">{{bot_type}}</span>
    </td>
    {{else if display_last_active_column}}
    <td class="last_active">
        {{#if last_active_date}}
            {{last_active_date}}
        {{else}}
            <div class="loading-placeholder"></div>
        {{/if}}
    </td>
    {{/if}}
    {{#if (or is_bot can_modify)}}
    <td class="actions">
        <span class="user-status-settings">
            {{#if (and is_bot show_download_zuliprc_button)}}
            <a type="submit" download="zuliprc" data-user-id="{{user_id}}" class="hidden-zuliprc-download" hidden></a>
            <span class="tippy-zulip-delayed-tooltip" data-tippy-content="{{t 'Download zuliprc'}}">
                {{> ../components/icon_button
                  icon="download"
                  intent="neutral"
                  custom_classes="download-bot-zuliprc-button"
                  }}
            </span>
            {{/if}}
            {{#if (and is_bot show_generate_integration_url_button)}}
            <span class="tippy-zulip-delayed-tooltip" data-tippy-content="{{t 'Generate URL for integration'}}">
                {{> ../components/icon_button
                  icon="link-2"
                  intent="neutral"
                  custom_classes="generate-integration-url-button"
                  }}
            </span>
            {{/if}}
            <span class="{{#if (and is_bot cannot_edit)}}tippy-zulip-tooltip{{else}}tippy-zulip-delayed-tooltip{{/if}}"
              {{#if (and is_bot cannot_edit)}}
              data-tippy-content="{{t 'This bot cannot be managed.'}}"
              {{else}}
              data-tippy-content="{{#if is_bot}}{{#unless cannot_edit}}{{t 'Manage bot'}}{{/unless}}{{else}}{{t 'Manage user'}}{{/if}}"
              {{/if}}>
                {{> ../components/icon_button
                  icon="user-cog"
                  intent="neutral"
                  custom_classes="open-user-form manage-user-button"
                  disabled=cannot_edit
                  }}
            </span>
            {{#if is_active}}
            <span class="{{#if is_bot}}deactivate-bot-tooltip{{else}}deactivate-user-tooltip{{/if}} {{#if cannot_deactivate}}tippy-zulip-tooltip{{/if}}"
              {{#if (and is_bot cannot_deactivate)}}data-tippy-content="{{t 'This bot cannot be deactivated.'}}"{{else if cannot_deactivate}}data-tippy-content="{{t 'This user cannot be deactivated.'}}"{{/if}}>
                {{> ../components/icon_button
                  icon="user-x"
                  intent="danger"
                  custom_classes="deactivate"
                  disabled=cannot_deactivate
                  }}
            </span>
            {{else}}
            <span class="{{#if is_bot}}reactivate-bot-tooltip{{else}}reactivate-user-tooltip{{/if}}">
                {{> ../components/icon_button
                  icon="user-plus"
                  intent="success"
                  custom_classes="reactivate"
                  }}
            </span>
            {{/if}}
        </span>
    </td>
    {{/if}}
</tr>
```

--------------------------------------------------------------------------------

---[FILE: stream_specific_notification_row.hbs]---
Location: zulip-main/web/templates/settings/stream_specific_notification_row.hbs

```text
<tr class="stream-notifications-row" data-stream-id="{{stream.stream_id}}">
    <td class="stream-controls">
        <span class="stream-privacy-original-color-{{stream.stream_id}} stream-privacy filter-icon" style="color: {{stream.color}}">
            {{> ../stream_privacy
              invite_only=stream.invite_only
              is_web_public=stream.is_web_public }}
        </span>
        {{stream.stream_name}}
        <i class="zulip-icon icon-button-brand zulip-icon-mute tippy-zulip-delayed-tooltip unmute_stream" role="button" tabindex="0" data-tippy-content="{{t 'Unmute' }}" aria-label="{{t 'Unmute' }}" {{#unless muted}}style="display: none;"{{/unless}}></i>
        <i class="zulip-icon icon-button-neutral zulip-icon-reset tippy-zulip-delayed-tooltip reset_stream_notifications" role="button" tabindex="0" data-tippy-content="{{t 'Reset to default notifications' }}" aria-label="{{t 'Reset to default notifications' }}"></i>
    </td>
    {{#each stream_specific_notification_settings}}
        {{> notification_settings_checkboxes
          setting_name=this
          prefix=(lookup ../stream "stream_id")
          is_checked=(lookup ../stream this)
          is_disabled=(lookup ../is_disabled this)
          is_mobile_checkbox=(eq this "push_notifications")
          push_notifications_disabled=../push_notifications_disabled
          }}
    {{/each}}
</tr>
```

--------------------------------------------------------------------------------

---[FILE: upgrade_tip_widget.hbs]---
Location: zulip-main/web/templates/settings/upgrade_tip_widget.hbs

```text
<div>
    {{#unless is_guest}}
        {{#unless zulip_plan_is_not_limited}}
            <div class="upgrade-organization-banner-container banner-wrapper"></div>
        {{/unless}}
    {{/unless}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: uploaded_files_list.hbs]---
Location: zulip-main/web/templates/settings/uploaded_files_list.hbs

```text
{{#with attachment}}
<tr class="uploaded_file_row" data-attachment-name="{{name}}" data-attachment-id="{{id}}">
    <td>
        <a type="submit" class="tippy-zulip-delayed-tooltip" href="/user_uploads/{{path_id}}" target="_blank" rel="noopener noreferrer" data-tippy-content="{{t 'View file' }}">
            {{ name }}
        </a>
    </td>
    <td>{{ create_time_str }}</td>
    <td>
        {{#if messages }}
        <div class="attachment-messages">
            {{#each messages}}
                <a class="ind-message" href="/#narrow/id/{{ this.id }}">
                    #{{ this.id }}
                </a>
            {{/each}}
        </div>
        {{/if}}
    </td>
    <td class="upload-size" >{{ size_str }}</td>
    <td class="actions">
        <span class="edit-attachment-buttons">
            <a type="submit" href="/user_uploads/{{path_id}}" class="hidden-attachment-download" download></a>
            {{> ../components/icon_button
              icon="download"
              intent="info"
              custom_classes="tippy-zulip-delayed-tooltip download-attachment"
              data-tippy-content=(t "Download")
              }}
        </span>
        <span class="edit-attachment-buttons">
            {{> ../components/icon_button
              icon="trash"
              custom_classes="tippy-zulip-delayed-tooltip delete remove-attachment"
              intent="danger"
              data-tippy-content=(t "Delete")
              }}
        </span>
    </td>
</tr>
{{/with}}
```

--------------------------------------------------------------------------------

---[FILE: user_list_admin.hbs]---
Location: zulip-main/web/templates/settings/user_list_admin.hbs

```text
<div id="admin-user-list" class="settings-section" data-name="users">

    <div class="tab-container"></div>

    {{>active_user_list_admin .}}

    {{>deactivated_users_admin .}}

    {{>invites_list_admin .}}

</div>
```

--------------------------------------------------------------------------------

---[FILE: user_notification_settings.hbs]---
Location: zulip-main/web/templates/settings/user_notification_settings.hbs

```text
<div id="user-notification-settings" class="settings-section" data-name="notifications">
    {{> notification_settings . prefix="user_" for_realm_settings=false}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: user_preferences.hbs]---
Location: zulip-main/web/templates/settings/user_preferences.hbs

```text
<div id="user-preferences" class="settings-section" data-name="preferences">
    {{> preferences . prefix="user_" for_realm_settings=false}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: user_topics_settings.hbs]---
Location: zulip-main/web/templates/settings/user_topics_settings.hbs

```text
<div id="user-topic-settings" class="settings-section" data-name="topics">
    <p>
        {{#tr}}
            Zulip lets you follow topics you are interested in, and mute topics you want to ignore.
            You can also <z-automatically-follow>automatically follow</z-automatically-follow>
            topics you start or participate in, and topics where you're mentioned.
            {{#*inline "z-automatically-follow"}}<a href="/help/follow-a-topic#automatically-follow-topics" target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
        {{/tr}}
    </p>
    <div class="settings_panel_list_header">
        <h3>{{t "Topic settings"}}
            {{> ../help_link_widget link="/help/topic-notifications" }}
        </h3>
        {{> settings_save_discard_widget section_name="user-topics-settings" show_only_indicator=true }}
        {{> filter_text_input id="user_topics_search" placeholder=(t 'Filter') aria_label=(t 'Filter invitations')}}
    </div>
    <div class="progressive-table-wrapper" data-simplebar data-simplebar-tab-index="-1">
        <table class="table table-striped wrapped-table">
            <thead class="table-sticky-headers">
                <tr>
                    <th data-sort="alphabetic" data-sort-prop="stream">{{t "Channel" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th data-sort="alphabetic" data-sort-prop="topic">{{t "Topic" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th data-sort="numeric" data-sort-prop="visibility_policy">{{t "Status" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th data-sort="numeric" data-sort-prop="date_updated" class="active topic_date_updated">{{t "Date updated" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                </tr>
            </thead>
            <tbody id="user_topics_table" data-empty="{{t 'You have not configured any topics yet.'}}" data-search-results-empty="{{t 'No topics match your current filter.' }}"></tbody>
        </table>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: add_subscribers_form.hbs]---
Location: zulip-main/web/templates/stream_settings/add_subscribers_form.hbs

```text
<div class="add_subscribers_container add-button-container">
    <div class="pill-container person_picker">
        <div class="input" contenteditable="true"
          data-placeholder="{{t 'Add subscribers.' }}">
            {{~! Squash whitespace so that placeholder is displayed when empty. ~}}
        </div>
    </div>
    {{#if (not hide_add_button)}}
        <div class="add_subscriber_button_wrapper add-users-button-wrapper inline-block">
            {{> ../components/action_button
              label=(t "Add")
              custom_classes="add-subscriber-button add-users-button"
              attention="quiet"
              intent="brand"
              type="submit"
              }}

            {{> ../components/icon_button
              icon="check"
              intent="success"
              custom_classes="check hidden-below"
              disabled=true
              }}
        </div>
    {{/if}}
</div>
<div class="add-subscribers-subtitle">
    {{#tr}}
        Enter a <z-user-roles-link>user role</z-user-roles-link>,
        <z-user-groups-link>user group</z-user-groups-link>,
        or <z-channel-link>#channel</z-channel-link> to add multiple users at once.
        {{#*inline "z-user-roles-link"}}<a href="/help/user-roles" target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
        {{#*inline "z-user-groups-link"}}<a href="/help/user-groups" target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
        {{#*inline "z-channel-link"}}<a href="/help/introduction-to-channels" target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
    {{/tr}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: announce_stream_checkbox.hbs]---
Location: zulip-main/web/templates/stream_settings/announce_stream_checkbox.hbs

```text
<label class="checkbox" for="id_should_announce_new_stream">
    <input type="checkbox" name="announce" value="announce" checked id="id_should_announce_new_stream"/>
    <span class="rendered-checkbox"></span>
    {{t "Announce new channel in"}}
    {{#if new_stream_announcements_stream_sub}}
        <strong>
            {{> ../inline_decorated_channel_name
              stream=new_stream_announcements_stream_sub
              }}
        </strong>
    {{/if}}
    {{> ../help_link_widget link="/help/configure-automated-notices#new-channel-announcements"}}
</label>
```

--------------------------------------------------------------------------------

---[FILE: browse_streams_list.hbs]---
Location: zulip-main/web/templates/stream_settings/browse_streams_list.hbs

```text
{{#each subscriptions}}
    {{> browse_streams_list_item . }}
{{/each}}
```

--------------------------------------------------------------------------------

---[FILE: browse_streams_list_item.hbs]---
Location: zulip-main/web/templates/stream_settings/browse_streams_list_item.hbs

```text
{{! Client-side Handlebars template for rendering subscriptions. }}
<div class="stream-row" data-stream-id="{{stream_id}}" data-stream-name="{{name}}">

    {{#if subscribed}}
        <div class="check checked sub_unsub_button">

            <div class="tippy-zulip-tooltip" data-tooltip-template-id="unsubscribe-from-{{stream_id}}-stream-tooltip-template">
                <template id="unsubscribe-from-{{stream_id}}-stream-tooltip-template">
                    <span>
                        {{#tr}}
                            Unsubscribe from <z-stream></z-stream>
                            {{#*inline "z-stream"}}{{> ../inline_decorated_channel_name stream=this}}{{/inline}}
                        {{/tr}}
                    </span>
                </template>

                <i class="zulip-icon zulip-icon-subscriber-check sub-unsub-icon"></i>
            </div>
            <div class='sub_unsub_status'></div>
        </div>
    {{else}}
        <div class="check sub_unsub_button {{#unless should_display_subscription_button}}disabled{{/unless}}">

            <div class="tippy-zulip-tooltip"  data-tooltip-template-id="{{#if should_display_subscription_button}}subscribe-to-{{stream_id}}-stream-tooltip-template{{else}}cannot-subscribe-to-{{stream_id}}-stream-tooltip-template{{/if}}">
                <template id="subscribe-to-{{stream_id}}-stream-tooltip-template">
                    <span>
                        {{#tr}}
                            Subscribe to <z-stream></z-stream>
                            {{#*inline "z-stream"}}{{> ../inline_decorated_channel_name stream=this}}{{/inline}}
                        {{/tr}}
                    </span>
                </template>

                <template id="cannot-subscribe-to-{{stream_id}}-stream-tooltip-template">
                    <span>
                        {{#tr}}
                            Cannot subscribe to <z-stream></z-stream>
                            {{#*inline "z-stream"}}{{> ../inline_decorated_channel_name stream=this}}{{/inline}}
                        {{/tr}}
                    </span>
                </template>

                <i class="zulip-icon zulip-icon-subscriber-plus sub-unsub-icon"></i>
            </div>
            <div class='sub_unsub_status'></div>
        </div>
    {{/if}}
    {{> subscription_setting_icon . }}
    <div class="sub-info-box">
        <div class="top-bar">
            <div class="stream-name">{{name}}</div>
            <div class="subscriber-count tippy-zulip-tooltip" data-tippy-content="{{t 'Subscriber count' }}">
                {{> subscriber_count .}}
            </div>
        </div>
        <div class="bottom-bar">
            <div class="description rendered_markdown" data-no-description="{{t 'No description.'}}">{{rendered_markdown rendered_description}}</div>
            {{#if is_old_stream}}
            <div class="stream-message-count tippy-zulip-tooltip" data-tippy-content="{{t 'Estimated messages per week' }}">
                <i class="fa fa-bar-chart"></i>
                <span class="stream-message-count-text">{{stream_weekly_traffic}}</span>
            </div>
            {{else}}
            <div class="stream-message-count tippy-zulip-tooltip" data-tippy-content="{{t 'Channel created recently' }}">
                <span class="stream-message-count-text">{{t "New" }}</span>
            </div>
            {{/if}}
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: change_stream_info_modal.hbs]---
Location: zulip-main/web/templates/stream_settings/change_stream_info_modal.hbs

```text
<div class="change-stream-name-container">
    <label for="change_stream_name" class="modal-field-label">
        {{t 'Channel name' }}
    </label>
    <input type="text" id="change_stream_name" class="modal_text_input" name="stream_name" value="{{ stream_name }}" maxlength="{{ max_stream_name_length }}" />
    <div id="change_stream_name_error"></div>
</div>
<div>
    <label for="change_stream_description" class="modal-field-label">
        {{t 'Description' }}
        {{> ../help_link_widget link="/help/change-the-channel-description" }}
    </label>
    <textarea id="change_stream_description" class="modal-textarea" name="stream_description" maxlength="{{ max_stream_description_length }}">{{ stream_description }}</textarea>
</div>
```

--------------------------------------------------------------------------------

````
