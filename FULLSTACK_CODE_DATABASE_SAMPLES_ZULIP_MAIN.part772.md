---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 772
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 772 of 1290)

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

---[FILE: organization_profile_admin.hbs]---
Location: zulip-main/web/templates/settings/organization_profile_admin.hbs

```text
<div id="organization-profile" data-name="organization-profile" class="settings-section">
    <form class="admin-realm-form org-profile-form">
        <div class="alert" id="admin-realm-deactivation-status"></div>

        <div id="org-org-profile" class="settings-subsection-parent">
            <div class="subsection-header">
                <h3>{{t "Organization profile" }}
                    {{> ../help_link_widget link="/help/create-your-organization-profile" }}
                </h3>
                {{> settings_save_discard_widget section_name="org-profile" }}
            </div>

            <div class="organization-settings-parent">
                <div class="input-group admin-realm">
                    <label for="id_realm_name" class="settings-field-label">{{t "Organization name" }}</label>
                    <input type="text" id="id_realm_name" name="realm_name" class="admin-realm-name setting-widget prop-element settings_text_input"
                      autocomplete="off" data-setting-widget-type="string"
                      value="{{ realm_name }}" maxlength="40" />
                </div>
                <div class="input-group admin-realm">
                    <label for="id_realm_org_type" class="settings-field-label">{{t "Organization type" }}
                        {{> ../help_link_widget link="/help/organization-type" }}
                    </label>
                    <select name="realm_org_type" class="setting-widget prop-element settings_select bootstrap-focus-style" id="id_realm_org_type" data-setting-widget-type="number">
                        {{> dropdown_options_widget option_values=realm_org_type_values}}
                    </select>
                </div>
                {{> settings_checkbox
                  setting_name="realm_want_advertise_in_communities_directory"
                  prefix="id_"
                  is_checked=realm_want_advertise_in_communities_directory
                  is_disabled=disable_want_advertise_in_communities_directory
                  label=admin_settings_label.realm_want_advertise_in_communities_directory
                  help_link="/help/communities-directory"}}
                {{> realm_description . }}
            </div>
        </div>

        <div>{{t "Organization profile picture" }}</div>
        <div class="realm-icon-section">
            {{> image_upload_widget
              widget = "realm-icon"
              upload_text = (t "Upload icon")
              delete_text = (t "Delete icon")
              is_editable_by_current_user = is_admin
              image = realm_icon_url }}
        </div>
        {{> ../components/action_button
          label=(t "Preview organization profile")
          custom_classes="block"
          id="id_org_profile_preview"
          icon="external-link"
          attention="quiet"
          intent="brand"
          }}
        <div class="subsection-header">
            <h3>{{t "Organization logo" }}
                {{> ../help_link_widget link="/help/create-your-organization-profile#add-a-wide-logo" }}
            </h3>
        </div>
        {{> upgrade_tip_widget . }}

        <p>{{t "A wide image (200×25 pixels) for the upper left corner of the app." }}</p>
        <div class="realm-logo-group">
            <div class="realm-logo-block realm-logo-section">
                <h5 class="realm-logo-title">{{t "Light theme logo" }}</h5>
                {{> image_upload_widget
                  widget = "realm-day-logo"
                  upload_text = (t "Upload logo")
                  delete_text = (t "Delete logo")
                  is_editable_by_current_user = user_can_change_logo
                  image = realm_logo_url }}
            </div>
            <div class="realm-logo-block realm-logo-section">
                <h5 class="realm-logo-title">{{t "Dark theme logo" }}</h5>
                {{> image_upload_widget
                  widget = "realm-night-logo"
                  upload_text = (t "Upload logo")
                  delete_text = (t "Delete logo")
                  is_editable_by_current_user = user_can_change_logo
                  image = realm_night_logo_url }}
            </div>
        </div>
        <div class="deactivate-realm-section">
            <h3 class="light">
                {{t "Deactivate organization" }}
                {{> ../help_link_widget link="/help/deactivate-your-organization" }}
            </h3>
            <div class="input-group">
                <div id="deactivate_realm_button_container" class="inline-block">
                    {{> ../components/action_button
                      label=(t "Deactivate organization")
                      attention="quiet"
                      intent="danger"
                      custom_classes="deactivate_realm_button"
                      }}
                </div>
            </div>
        </div>
    </form>
</div>
```

--------------------------------------------------------------------------------

---[FILE: organization_settings_admin.hbs]---
Location: zulip-main/web/templates/settings/organization_settings_admin.hbs

```text
<div id="organization-settings" data-name="organization-settings" class="settings-section">
    <form class="admin-realm-form org-settings-form">

        <div id="org-notifications" class="settings-subsection-parent">
            <div class="subsection-header">
                <h3>{{t "Automated messages and emails" }}</h3>
                {{> settings_save_discard_widget section_name="notifications" }}
            </div>
            <div class="inline-block organization-settings-parent">
                {{> ../dropdown_widget_with_label
                  widget_name="realm_default_language"
                  label=admin_settings_label.realm_default_language
                  value_type="string"
                  help_link="/help/configure-organization-language"}}

                {{> ../dropdown_widget_with_label
                  widget_name="realm_moderation_request_channel_id"
                  label=admin_settings_label.realm_moderation_request_channel
                  value_type="number"
                  help_link="/help/enable-moderation-requests"
                  }}

                {{> ../dropdown_widget_with_label
                  widget_name="realm_new_stream_announcements_stream_id"
                  label=admin_settings_label.realm_new_stream_announcements_stream
                  value_type="number"
                  custom_classes="decorated-stream-name-dropdown-widget"}}

                {{> ../dropdown_widget_with_label
                  widget_name="realm_signup_announcements_stream_id"
                  label=admin_settings_label.realm_signup_announcements_stream
                  value_type="number"
                  custom_classes="decorated-stream-name-dropdown-widget"}}

                {{> ../dropdown_widget_with_label
                  widget_name="realm_zulip_update_announcements_stream_id"
                  label=admin_settings_label.realm_zulip_update_announcements_stream
                  value_type="number"
                  custom_classes="decorated-stream-name-dropdown-widget"}}

                {{> settings_checkbox
                  setting_name="realm_send_channel_events_messages"
                  prefix="id_"
                  is_checked=realm_send_channel_events_messages
                  label=admin_settings_label.realm_send_channel_events_messages
                  help_link="/help/configure-automated-notices#notices-about-channels"}}

                {{#if settings_send_digest_emails }}
                {{> settings_checkbox
                  setting_name="realm_digest_emails_enabled"
                  prefix="id_"
                  is_checked=realm_digest_emails_enabled
                  label=admin_settings_label.realm_digest_emails_enabled}}
                {{/if}}
                <div class="input-group">
                    <label for="id_realm_digest_weekday" class="settings-field-label">{{t "Day of the week to send digests" }}</label>
                    <select name="realm_digest_weekday"
                      id="id_realm_digest_weekday"
                      class="setting-widget prop-element settings_select bootstrap-focus-style"
                      data-setting-widget-type="number">
                        <option value="0">{{t "Monday" }}</option>
                        <option value="1">{{t "Tuesday" }}</option>
                        <option value="2">{{t "Wednesday" }}</option>
                        <option value="3">{{t "Thursday" }}</option>
                        <option value="4">{{t "Friday" }}</option>
                        <option value="5">{{t "Saturday" }}</option>
                        <option value="6">{{t "Sunday" }}</option>
                    </select>
                </div>

            </div>
        </div>

        <div id="org-onboarding" class="settings-subsection-parent">
            <div class="subsection-header">
                <h3>{{t "Onboarding" }}</h3>
                {{> settings_save_discard_widget section_name="onboarding" }}
            </div>
            <div class="organization-settings-parent">
                {{> settings_checkbox
                  setting_name="realm_enable_welcome_message_custom_text"
                  prefix="id_"
                  is_checked=realm_enable_welcome_message_custom_text
                  label=admin_settings_label.realm_enable_welcome_message_custom_text
                  skip_prop_element=true}}
                <div class="input-group" id="welcome_message_custom_text_container">
                    <label for="id_realm_welcome_message_custom_text" class="settings-field-label">
                        {{t "Message text" }}
                    </label>
                    <textarea id="id_realm_welcome_message_custom_text" name="welcome_message_custom_text"
                      class="admin-realm-welcome-message-custom-text setting-widget prop-element settings-textarea display-block" maxlength="8000"
                      data-setting-widget-type="string">{{ realm_welcome_message_custom_text }}</textarea>
                    <div id="welcome_message_custom_text_buttons_container">
                        {{> ../components/action_button attention="quiet" intent="neutral" label=(t "Send me a test message") id="send_test_welcome_bot_custom_message"}}
                    </div>
                </div>

                {{> settings_checkbox
                  setting_name="realm_send_welcome_emails"
                  prefix="id_"
                  is_checked=realm_send_welcome_emails
                  label=admin_settings_label.realm_send_welcome_emails}}
            </div>
        </div>

        <div class="settings-subsection-parent">
            <div class="subsection-header">
                <h3>{{t "Notifications security" }}</h3>
                {{> settings_save_discard_widget section_name="notifications-security" }}
            </div>
            <div class="inline-block organization-settings-parent">
                {{> settings_checkbox
                  setting_name="realm_require_e2ee_push_notifications"
                  prefix="id_"
                  is_checked=realm_require_e2ee_push_notifications
                  label=admin_settings_label.realm_require_e2ee_push_notifications
                  help_link="/help/mobile-notifications"}}

                {{> settings_checkbox
                  setting_name="realm_message_content_allowed_in_email_notifications"
                  prefix="id_"
                  is_checked=realm_message_content_allowed_in_email_notifications
                  label=admin_settings_label.realm_message_content_allowed_in_email_notifications}}
            </div>
        </div>

        <div id="org-compose-settings" class="settings-subsection-parent">
            <div class="subsection-header">
                <h3>{{t "Compose settings"}}</h3>
                {{> settings_save_discard_widget section_name="compose-settings"}}
            </div>
            <div class="inline-block organization-settings-parent">
                <div class="input-group">
                    <label for="id_realm_video_chat_provider" class="settings-field-label">
                        {{t 'Call provider' }}
                        {{> ../help_link_widget link="/help/configure-call-provider" }}
                    </label>
                    <select name="realm_video_chat_provider" class ="setting-widget prop-element settings_select bootstrap-focus-style" id="id_realm_video_chat_provider" data-setting-widget-type="number">
                        {{#each realm_available_video_chat_providers}}
                            <option value='{{this.id}}'>{{this.name}}</option>
                        {{/each}}
                    </select>

                    <div class="dependent-settings-block" id="realm_jitsi_server_url_setting">
                        <div>
                            <label for="id_realm_jitsi_server_url" class="settings-field-label">
                                {{t "Jitsi server URL" }}
                                {{> ../help_link_widget link="/help/configure-call-provider#use-a-self-hosted-instance-of-jitsi-meet" }}
                            </label>
                            <select name="realm_jitsi_server_url" id="id_realm_jitsi_server_url" class="setting-widget prop-element settings_select bootstrap-focus-style" data-setting-widget-type="jitsi-server-url-setting">
                                {{#if server_jitsi_server_url}}
                                    <option value="server_default">
                                        {{#tr}}{server_jitsi_server_url} (default){{/tr}}
                                    </option>
                                {{else}}
                                    <option value="server_default">{{t 'Disabled' }}</option>
                                {{/if}}
                                <option value="custom">{{t 'Custom URL' }}</option>
                            </select>
                        </div>

                        <div>
                            <label for="id_realm_jitsi_server_url_custom_input" class="jitsi_server_url_custom_input_label">
                                {{t 'URL' }}
                            </label>
                            <input type="text" id="id_realm_jitsi_server_url_custom_input" autocomplete="off"
                              name="realm_jitsi_server_url_custom_input" class="realm_jitsi_server_url_custom_input settings_url_input" maxlength="200" />
                        </div>
                    </div>
                </div>
                <div class="input-group">
                    <label for="id_realm_giphy_rating" class="settings-field-label">
                        {{t 'GIF integration' }}
                        {{> ../help_link_widget link=gif_help_link }}
                    </label>
                    <select name="realm_giphy_rating" class ="setting-widget prop-element settings_select bootstrap-focus-style" id="id_realm_giphy_rating" data-setting-widget-type="number" {{#if gif_api_key_empty}}disabled{{/if}}>
                        {{#each gif_rating_options}}
                            <option value='{{this.id}}'>{{this.name}}</option>
                        {{/each}}
                    </select>
                </div>

                <div class="input-group">
                    <label for="id_realm_topics_policy" class="settings-field-label">{{> realm_topics_policy_label .}}</label>
                    <select name="realm_topics_policy" id="id_realm_topics_policy" class="prop-element settings_select bootstrap-focus-style" data-setting-widget-type="string">
                        {{> dropdown_options_widget option_values=realm_topics_policy_values}}
                    </select>
                </div>
            </div>
        </div>

        <div id="org-msg-feed-settings" class="settings-subsection-parent">
            <div class="subsection-header">
                <h3>{{t "Message feed settings"}}</h3>
                {{> settings_save_discard_widget section_name="msg-feed-settings"}}
            </div>
            <div class="inline-block organization-settings-parent">
                {{> ../dropdown_widget_with_label
                  widget_name="realm_default_code_block_language"
                  label=admin_settings_label.realm_default_code_block_language
                  value_type="string"}}

                {{> settings_checkbox
                  setting_name="realm_enable_read_receipts"
                  prefix="id_"
                  is_checked=realm_enable_read_receipts
                  label=admin_settings_label.realm_enable_read_receipts
                  label_parens_text=admin_settings_label.realm_enable_read_receipts_parens_text}}

                {{#if server_inline_image_preview}}
                {{> settings_checkbox
                  setting_name="realm_inline_image_preview"
                  prefix="id_"
                  is_checked=realm_inline_image_preview
                  label=admin_settings_label.realm_inline_image_preview
                  help_link="/help/image-video-and-website-previews"}}
                {{/if}}

                {{#if server_inline_url_embed_preview}}
                {{> settings_checkbox
                  setting_name="realm_inline_url_embed_preview"
                  prefix="id_"
                  is_checked=realm_inline_url_embed_preview
                  label=admin_settings_label.realm_inline_url_embed_preview
                  help_link="/help/image-video-and-website-previews"}}
                {{/if}}
            </div>
        </div>

        <div id="org-message-retention" class="settings-subsection-parent">
            <div class="subsection-header">
                <h3>{{t "Message retention period" }}
                    {{> ../help_link_widget link="/help/message-retention-policy" }}
                </h3>
                {{> settings_save_discard_widget section_name="message-retention" }}
            </div>

            {{> upgrade_tip_widget . }}

            <div class="inline-block organization-settings-parent">
                <div class="input-group time-limit-setting">
                    <label for="id_realm_message_retention_days" class="settings-field-label">{{t "Message retention period" }}
                    </label>
                    <select name="realm_message_retention_days"
                      id="id_realm_message_retention_days" class="prop-element settings_select bootstrap-focus-style"
                      data-setting-widget-type="message-retention-setting"
                      {{#unless zulip_plan_is_not_limited}}disabled{{/unless}}>
                        <option value="unlimited">{{t 'Retain forever' }}</option>
                        <option value="custom_period">{{t 'Custom' }}</option>
                    </select>

                    <div class="dependent-settings-block">
                        <label for="id_realm_message_retention_custom_input" class="inline-block realm-time-limit-label">
                            {{t 'Retention period (days)' }}:
                        </label>
                        <input type="text" id="id_realm_message_retention_custom_input" autocomplete="off"
                          name="realm_message_retention_custom_input"
                          class="admin-realm-message-retention-days message-retention-setting-custom-input time-limit-custom-input"
                          data-setting-widget-type="number"
                          {{#unless zulip_plan_is_not_limited}}disabled{{/unless}}/>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
```

--------------------------------------------------------------------------------

---[FILE: organization_settings_tip.hbs]---
Location: zulip-main/web/templates/settings/organization_settings_tip.hbs

```text
{{#unless is_admin}}
<div class="banner-wrapper">
    {{> ../components/banner
      label=(t "Only organization administrators can edit these settings.")
      intent="info"
      custom_classes="admin-permissions-banner"
      }}
</div>
{{/unless}}
```

--------------------------------------------------------------------------------

---[FILE: organization_user_settings_defaults.hbs]---
Location: zulip-main/web/templates/settings/organization_user_settings_defaults.hbs

```text
<div id="realm-user-default-settings" class="settings-section" data-name="organization-level-user-defaults">
    {{#if is_admin}}
    <div>
        {{#tr}}
            Configure the <z-link>default personal preference settings</z-link>
            for new users joining your organization.
            {{#*inline "z-link"}}<a href="/help/configure-default-new-user-settings" target="_blank" rel="noopener noreferrer">{{> @partial-block }}</a>{{/inline}}
        {{/tr}}
    </div>
    {{/if}}
    {{> preferences . prefix="realm_" for_realm_settings=true full_name=full_name}}

    {{> notification_settings . prefix="realm_" for_realm_settings=true}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: playground_settings_admin.hbs]---
Location: zulip-main/web/templates/settings/playground_settings_admin.hbs

```text
<div id="playground-settings" class="settings-section" data-name="playground-settings">
    <div>
        <p>
            {{#tr}}
                Code playgrounds are interactive in-browser development environments,
                that are designed to make
                it convenient to edit and debug code. Zulip <z-link-code-blocks>code blocks</z-link-code-blocks>
                that are tagged with a programming language will have a button visible on
                hover that allows users to open the code block on the code playground site.
                {{#*inline "z-link-code-blocks"}}<a href="/help/code-blocks" target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
            {{/tr}}
        </p>
        <p>
            {{t "For example, to configure a code playground for code blocks tagged as Rust,
              you can set:" }}
        </p>
        <ul>
            <li>
                {{t "Language" }}: <span class="rendered_markdown"><code>Rust</code></span>
            </li>
            <li>
                {{t "Name" }}: <span class="rendered_markdown"><code>Rust playground</code></span>
            </li>
            <li>
                {{t "URL template" }}: <span class="rendered_markdown"><code>https://play.rust-lang.org/?code={code}</code></span>
            </li>
        </ul>
        <p>
            {{#tr}}
                For more examples and technical details, see the <z-link>help center documentation</z-link>
                on adding code playgrounds.
                {{#*inline "z-link"}}<a href="/help/code-blocks#code-playgrounds" target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
            {{/tr}}
        </p>

        {{#if is_admin}}
        <form class="admin-playground-form">
            <div class="add-new-playground-box settings-highlight-box">
                <div class="new-playground-form wrapper">
                    <div class="settings-section-title">
                        {{t "Add a new code playground" }}
                        {{> ../help_link_widget link="/help/code-blocks#code-playgrounds" }}
                    </div>
                    <div class="alert" id="admin-playground-status"></div>
                    <div class="input-group">
                        <label for="playground_pygments_language"> {{t "Language" }}</label>
                        <input type="text" id="playground_pygments_language" class="settings_text_input" name="pygments_language" autocomplete="off" placeholder="Rust" />
                    </div>
                    <div class="input-group">
                        <label for="playground_name"> {{t "Name" }}</label>
                        <input type="text" id="playground_name" class="settings_text_input" name="playground_name" autocomplete="off" placeholder="Rust playground" />
                    </div>
                    <div class="input-group">
                        <label for="playground_url_template"> {{t "URL template" }}</label>
                        <input type="text" id="playground_url_template" class="settings_text_input" name="url_template" placeholder="https://play.rust-lang.org/?code={code}" />
                    </div>
                    {{> ../components/action_button
                      id="submit_playground_button"
                      label=(t "Add code playground")
                      attention="quiet"
                      intent="brand"
                      type="submit"
                      }}
                </div>
            </div>
        </form>
        {{/if}}

        <div class="settings_panel_list_header">
            <h3>{{t "Code playgrounds"}}</h3>
            {{> filter_text_input placeholder=(t 'Filter') aria_label=(t 'Filter code playgrounds')}}
        </div>

        <div class="progressive-table-wrapper" data-simplebar data-simplebar-tab-index="-1">
            <table class="table table-striped wrapped-table admin_playgrounds_table">
                <thead class="table-sticky-headers">
                    <tr>
                        <th class="active" data-sort="alphabetic" data-sort-prop="pygments_language">{{t "Language" }}
                            <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                        </th>
                        <th data-sort="alphabetic" data-sort-prop="name">{{t "Name" }}
                            <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                        </th>
                        <th data-sort="alphabetic" data-sort-prop="url_template">{{t "URL template" }}
                            <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                        </th>
                        {{#if is_admin}}
                        <th class="actions">{{t "Actions" }}</th>
                        {{/if}}
                    </tr>
                </thead>
                <tbody id="admin_playgrounds_table" data-empty="{{t 'No playgrounds configured.' }}" data-search-results-empty="{{t 'No playgrounds match your current filter.' }}"></tbody>
            </table>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: preferences.hbs]---
Location: zulip-main/web/templates/settings/preferences.hbs

```text
<form class="preferences-settings-form">
    {{>preferences_general .}}
    {{!-- user_has_email_set is passed as true here, because we don't disable the dropdown in organization panel also there's no need to show tooltip here. --}}
    {{#if for_realm_settings}}{{> privacy_settings . prefix="realm_" read_receipts_help_icon_tooltip_text="" hide_read_receipts_tooltip=true user_has_email_set=true}}{{/if}}

    {{>preferences_emoji .}}

    {{>preferences_navigation .}}

    {{>preferences_information .}}

    {{>preferences_left_sidebar .}}
</form>
```

--------------------------------------------------------------------------------

---[FILE: preferences_emoji.hbs]---
Location: zulip-main/web/templates/settings/preferences_emoji.hbs

```text
<div class="emoji-preferences {{#if for_realm_settings}}settings-subsection-parent{{else}}subsection-parent{{/if}}">
    <div class="subsection-header">
        <h3 class="light">{{t "Emoji" }}</h3>
        {{> settings_save_discard_widget section_name="emoji-preferences-settings" show_only_indicator=(not for_realm_settings) }}
    </div>

    <div class="input-group">
        <label class="settings-field-label">{{t "Emoji theme" }}</label>
        <div class="emojiset_choices settings-highlight-box prop-element" id="{{prefix}}emojiset" data-setting-widget-type="radio-group" data-setting-choice-type="string">
            {{#each settings_object.emojiset_choices}}
                <label class="preferences-radio-choice-label">
                    <span class="radio-choice-controls">
                        <input type="radio" class="setting_emojiset_choice" name="emojiset" value="{{this.key}}"/>
                        <span class="preferences-radio-choice-text">{{this.text}}</span>
                    </span>
                    <span class="right">
                        {{#if (eq this.key "text") }}
                        <span class="emoji_alt_code">&nbsp;:relaxed:</span>
                        {{else}}
                        <img class="emoji" src="/static/generated/emoji/images-{{this.key}}-64/1f604.png" />
                        <img class="emoji" src="/static/generated/emoji/images-{{this.key}}-64/1f44d.png" />
                        <img class="emoji" src="/static/generated/emoji/images-{{this.key}}-64/1f680.png" />
                        <img class="emoji" src="/static/generated/emoji/images-{{this.key}}-64/1f389.png" />
                        {{/if}}
                    </span>
                </label>
            {{/each}}
        </div>
    </div>

    {{> settings_checkbox
      setting_name="translate_emoticons"
      is_checked=settings_object.translate_emoticons
      label=settings_label.translate_emoticons
      help_link="/help/configure-emoticon-translations"
      prefix=prefix}}

    {{> settings_checkbox
      setting_name="display_emoji_reaction_users"
      is_checked=settings_object.display_emoji_reaction_users
      label=settings_label.display_emoji_reaction_users
      prefix=prefix}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: preferences_general.hbs]---
Location: zulip-main/web/templates/settings/preferences_general.hbs

```text
<div class="general-settings {{#if for_realm_settings}}settings-subsection-parent{{else}}subsection-parent{{/if}}">
    <!-- this is inline block so that the alert notification can sit beside
    it. If there's not an alert, don't make it inline-block.-->
    <div class="subsection-header">
        <h3>{{t "General" }}</h3>
        {{> settings_save_discard_widget section_name="general-settings" show_only_indicator=(not for_realm_settings) }}
    </div>
    {{#unless for_realm_settings}}
        {{> ../dropdown_widget_with_label
          widget_name="default_language"
          label=settings_label.default_language_settings_label
          value_type="string"
          help_link="/help/change-your-language"}}
    {{/unless}}

    <div class="input-group">
        <label for="{{prefix}}twenty_four_hour_time" class="settings-field-label">{{ settings_label.twenty_four_hour_time }}</label>
        <select name="twenty_four_hour_time" class="setting_twenty_four_hour_time prop-element settings_select bootstrap-focus-style" id="{{prefix}}twenty_four_hour_time" data-setting-widget-type="string">
            {{#each twenty_four_hour_time_values}}
                <option value='{{ this.value }}'>{{ this.description }}</option>
            {{/each}}
        </select>
    </div>
    <div class="input-group">
        <label for="{{prefix}}color_scheme" class="settings-field-label">{{t "Theme" }}</label>
        <div id="{{prefix}}color_scheme" class="tab-picker prop-element" data-setting-widget-type="radio-group" data-setting-choice-type="number">
            <input type="radio" id="{{prefix}}theme_select_automatic" class="tab-option setting_color_scheme" data-setting-widget-type="number" name="{{prefix}}theme_select" value="{{color_scheme_values.automatic.code}}" />
            <label class="tab-option-content tippy-zulip-delayed-tooltip" for="{{prefix}}theme_select_automatic" aria-label="{{t 'Select automatic theme' }}" data-tooltip-template-id="automatic-theme-template" tabindex="0">
                <i class="zulip-icon zulip-icon-monitor" aria-hidden="true"></i>
            </label>
            <input type="radio" id="{{prefix}}theme_select_light" class="tab-option setting_color_scheme" data-setting-widget-type="number" name="{{prefix}}theme_select" value="{{color_scheme_values.light.code}}" />
            <label class="tab-option-content tippy-zulip-delayed-tooltip" for="{{prefix}}theme_select_light" aria-label="{{t 'Select light theme' }}" data-tippy-content="{{t 'Light theme' }}" tabindex="0">
                <i class="zulip-icon zulip-icon-sun" aria-hidden="true"></i>
            </label>
            <input type="radio" id="{{prefix}}theme_select_dark" class="tab-option setting_color_scheme" data-setting-widget-type="number" name="{{prefix}}theme_select" value="{{color_scheme_values.dark.code}}" />
            <label class="tab-option-content tippy-zulip-delayed-tooltip" for="{{prefix}}theme_select_dark" aria-label="{{t 'Select dark theme' }}" data-tippy-content="{{t 'Dark theme' }}" tabindex="0">
                <i class="zulip-icon zulip-icon-moon" aria-hidden="true"></i>
            </label>
            <span class="slider"></span>
        </div>
    </div>

    {{> settings_checkbox
      setting_name="enter_sends"
      is_checked=settings_object.enter_sends
      label=settings_label.enter_sends
      prefix=prefix}}

    <div class="information-density-settings">
        <div class="font-size-setting info-density-controls">
            <div class="title">{{t "Font size"}}</div>
            {{> info_density_control_button_group
              property="web_font_size_px"
              default_icon_class="zulip-icon-type-big"
              property_value=settings_object.web_font_size_px
              display_value=settings_object.web_font_size_px
              for_settings_ui=true
              prefix=prefix
              }}
        </div>
        <div class="line-height-setting info-density-controls">
            <div class="title">{{t "Line spacing"}}</div>
            {{> info_density_control_button_group
              property="web_line_height_percent"
              default_icon_class="zulip-icon-line-height-big"
              property_value=settings_object.web_line_height_percent
              display_value=web_line_height_percent_display_value
              for_settings_ui=true
              prefix=prefix
              }}
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: preferences_information.hbs]---
Location: zulip-main/web/templates/settings/preferences_information.hbs

```text
<div class="information-settings {{#if for_realm_settings}}settings-subsection-parent{{else}}subsection-parent{{/if}}">
    <div class="subsection-header">
        <h3 class="light">{{t "Information" }}</h3>
        {{> settings_save_discard_widget section_name="information-settings" show_only_indicator=(not for_realm_settings) }}
    </div>

    <div class="input-group">
        <label class="settings-field-label">{{t "User list style" }}</label>
        <div class="user_list_style_values settings-highlight-box prop-element" id="{{prefix}}user_list_style" data-setting-widget-type="radio-group" data-setting-choice-type="number">
            {{#each user_list_style_values}}
                <label class="preferences-radio-choice-label">
                    <span class="radio-choice-controls">
                        <input type="radio" class="setting_user_list_style_choice" name="user_list_style" value="{{this.code}}"/>
                        <span class="preferences-radio-choice-text">{{this.description}}</span>
                    </span>
                    <span class="right preview">
                        {{#if (eq this.code 1)}}
                        <span class="user-name-and-status-emoji">
                            <span class="user-name">{{../full_name}}</span>
                            {{> ../status_emoji emoji_name="house" emoji_code="1f3e0"}}
                        </span>
                        {{/if}}
                        {{#if (eq this.code 2)}}
                        <span class="user-name-and-status-text">
                            <span class="user-name-and-status-emoji">
                                <span class="user-name">{{../full_name}}</span>
                                {{> ../status_emoji emoji_name="house" emoji_code="1f3e0"}}
                            </span>
                            <span class="status-text">{{t "Working remotely" }}</span>
                        </span>
                        {{/if}}
                        {{#if (eq this.code 3)}}
                        <span class="profile-with-avatar">
                            <span class="user-profile-picture">
                                <img src="{{../profile_picture}}"/>
                            </span>
                            <span class="user-name-and-status-wrapper">
                                <span class="user-name-and-status-emoji">
                                    <span class="user-name">{{../full_name}}</span>
                                    {{> ../status_emoji emoji_name="house" emoji_code="1f3e0"}}
                                </span>
                                <span class="status-text">{{t "Working remotely" }}</span>
                            </span>
                        </span>
                        {{/if}}
                    </span>
                </label>
            {{/each}}
        </div>
    </div>

    <div class="input-group">
        <label for="{{prefix}}web_animate_image_previews" class="settings-field-label">{{t "Play animated images" }}</label>
        <select name="web_animate_image_previews" class="setting_web_animate_image_previews prop-element settings_select bootstrap-focus-style" id="{{prefix}}web_animate_image_previews" data-setting-widget-type="string">
            {{> dropdown_options_widget option_values=web_animate_image_previews_values}}
        </select>
    </div>

    {{> settings_checkbox
      setting_name="receives_typing_notifications"
      is_checked=settings_object.receives_typing_notifications
      label=settings_label.receives_typing_notifications
      render_only=settings_render_only.receives_typing_notifications
      prefix=prefix}}

    {{> settings_checkbox
      setting_name="web_inbox_show_channel_folders"
      is_checked=settings_object.web_inbox_show_channel_folders
      label=settings_label.web_inbox_show_channel_folders
      render_only=settings_render_only.web_inbox_show_channel_folders
      help_link="/help/channel-folders"
      prefix=prefix}}

    {{> settings_checkbox
      setting_name="hide_ai_features"
      is_checked=settings_object.hide_ai_features
      label=settings_label.hide_ai_features
      render_only=settings_render_only.hide_ai_features
      prefix=prefix}}

    {{> settings_checkbox
      setting_name="fluid_layout_width"
      is_checked=settings_object.fluid_layout_width
      label=settings_label.fluid_layout_width
      render_only=settings_render_only.fluid_layout_width
      prefix=prefix}}

    {{> settings_checkbox
      setting_name="high_contrast_mode"
      is_checked=settings_object.high_contrast_mode
      label=settings_label.high_contrast_mode
      render_only=settings_render_only.high_contrast_mode
      prefix=prefix}}
</div>
```

--------------------------------------------------------------------------------

````
