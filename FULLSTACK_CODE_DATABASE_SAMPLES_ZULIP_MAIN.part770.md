---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 770
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 770 of 1290)

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

---[FILE: deactivated_users_admin.hbs]---
Location: zulip-main/web/templates/settings/deactivated_users_admin.hbs

```text
<div id="admin-deactivated-users-list" class="user-settings-section user-or-bot-settings-section" data-user-settings-section="deactivated">
    <div class="clear-float"></div>

    <div class="settings_panel_list_header">
        <h3>{{t "Deactivated users" }}
            {{> ../help_link_widget link="/help/deactivate-or-reactivate-a-user" }}
        </h3>
        <div class="alert-notification" id="deactivated-user-field-status"></div>
        <div class="user_filters">
            {{> ../dropdown_widget widget_name=deactivated_user_list_dropdown_widget_name}}
            {{> filter_text_input placeholder=(t 'Filter') aria_label=(t 'Filter deactivated users')}}
        </div>
    </div>

    <div class="progressive-table-wrapper" data-simplebar data-simplebar-tab-index="-1">
        <table class="table table-striped wrapped-table">
            <thead class="table-sticky-headers">
                <tr>
                    <th class="active" data-sort="alphabetic" data-sort-prop="full_name">{{t "Name" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th class="settings-email-column" {{#if allow_sorting_deactivated_users_list_by_email}}data-sort="email"{{/if}}>{{t "Email" }}
                        {{#if allow_sorting_deactivated_users_list_by_email}}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                        {{/if}}
                    </th>
                    <th class="user_role" data-sort="role">{{t "Role" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    {{#if is_admin}}
                    <th class="actions">{{t "Actions" }}</th>
                    {{/if}}
                </tr>
            </thead>
            <tbody id="admin_deactivated_users_table" class="admin_user_table"
              data-empty="{{t 'There are no deactivated users.' }}"
              data-search-results-empty="{{t 'No deactivated users match your filters.' }}">
            </tbody>
        </table>
    </div>
    <div id="admin_page_deactivated_users_loading_indicator"></div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: default_streams_list_admin.hbs]---
Location: zulip-main/web/templates/settings/default_streams_list_admin.hbs

```text
<div id="admin-default-channels-list" class="settings-section" data-name="default-channels-list">
    <p>{{t "Configure the default channels new users are subscribed to when joining your organization." }}</p>

    <div class="settings_panel_list_header">
        <h3>{{t "Default channels"}}</h3>
        <div class="add_default_streams_button_container">
            {{#if is_admin}}
                {{> ../components/action_button
                  id="show-add-default-streams-modal"
                  label=(t "Add channel")
                  attention="quiet"
                  intent="brand"
                  type="submit"
                  }}
            {{/if}}
            {{> filter_text_input placeholder=(t 'Filter') aria_label=(t 'Filter default channels')}}
        </div>
    </div>

    <div class="progressive-table-wrapper" data-simplebar data-simplebar-tab-index="-1">
        <table class="table table-striped wrapped-table">
            <thead class="table-sticky-headers">
                <tr>
                    <th class="active" data-sort="alphabetic" data-sort-prop="name">{{t "Name" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    {{#if is_admin}}
                    <th class="actions"></th>
                    {{/if}}
                </tr>
            </thead>
            <tbody data-empty="{{t 'There are no default channels.' }}" data-search-results-empty="{{t 'No default channels match your current filter.' }}"
              id="admin_default_streams_table" class="admin_default_stream_table"></tbody>
        </table>
    </div>

    <div id="admin_page_default_streams_loading_indicator"></div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: default_stream_choice.hbs]---
Location: zulip-main/web/templates/settings/default_stream_choice.hbs

```text
<div class="choice-row" data-value="{{value}}">
    {{> ../dropdown_widget widget_name=stream_dropdown_widget_name default_text=(t 'Select channel')}}
    {{> ../components/icon_button intent="danger" custom_classes="delete-choice tippy-zulip-delayed-tooltip" icon="trash" data-tippy-content=(t "Delete") aria-label=(t "Delete") }}
</div>
```

--------------------------------------------------------------------------------

---[FILE: demo_organization_warning.hbs]---
Location: zulip-main/web/templates/settings/demo_organization_warning.hbs

```text
{{#if is_demo_organization }}
<div class="demo-organization-warning banner-wrapper"></div>
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: dev_env_email_access.hbs]---
Location: zulip-main/web/templates/settings/dev_env_email_access.hbs

```text
In the development environment, outgoing emails are logged to <a href="/emails" class="banner-link">/emails</a>.
```

--------------------------------------------------------------------------------

---[FILE: dropdown_options_widget.hbs]---
Location: zulip-main/web/templates/settings/dropdown_options_widget.hbs

```text
{{#each option_values}}
    <option value='{{this.code}}'>{{this.description}}</option>
{{/each}}
```

--------------------------------------------------------------------------------

---[FILE: edit_bot_form.hbs]---
Location: zulip-main/web/templates/settings/edit_bot_form.hbs

```text
<div id="bot-edit-form" data-user-id="{{user_id}}" data-email="{{email}}">
    <form class="edit_bot_form name-setting">
        <div class="alert" id="bot-edit-form-error"></div>
        <div class="input-group name_change_container">
            <label for="edit_bot_full_name" class="modal-field-label">{{t "Name" }}</label>
            <input type="text" autocomplete="off" name="full_name" id="edit_bot_full_name" class="modal_text_input" value="{{ full_name }}" maxlength="{{max_bot_name_length}}" />
        </div>
        <input type="hidden" name="is_full_name" value="true" />
        <div class="input-group email_change_container">
            <label for="email" class="modal-field-label">{{t "Email" }}</label>
            <input type="text" autocomplete="off" name="email" class="modal_text_input" value="{{ email }}" readonly/>
        </div>
        <div class="input-group user_id_container">
            <label for="user_id" class="modal-field-label">{{t "User ID" }}</label>
            <input type="text" autocomplete="off" name="user_id" class="modal_text_input" value="{{ user_id }}" readonly/>
        </div>
        <div class="input-group">
            <label for="bot-role-select" class="modal-field-label">{{t 'Role' }}
                {{> ../help_link_widget link="/help/user-roles" }}
            </label>
            <select name="bot-role-select" id="bot-role-select" class="modal_select bootstrap-focus-style" data-setting-widget-type="number" {{#if disable_role_dropdown}}disabled{{/if}}>
                {{> dropdown_options_widget option_values=user_role_values}}
            </select>
        </div>
        <div class="input-group">
            <label for="bot-type" class="modal-field-label">{{t "Bot type"}}</label>
            <input type="text" autocomplete="off" name="bot-type" class="modal_text_input" value="{{ bot_type }}" readonly/>
        </div>
        {{> ../dropdown_widget_with_label
          widget_name="edit_bot_owner"
          label=(t 'Owner')}}

        <div id="service_data">
        </div>
        <div class="input-group edit-avatar-section">
            <label class="modal-field-label">{{t "Avatar" }}</label>
            {{!-- Shows the current avatar --}}
            <img src="{{bot_avatar_url}}" id="current_bot_avatar_image" />
            <input type="file" name="bot_avatar_file_input" class="notvisible edit_bot_avatar_file_input" value="{{t 'Upload profile picture' }}" />
            <div class="edit_bot_avatar_file"></div>
            <div class="edit_bot_avatar_preview_text">
                <img class="edit_bot_avatar_preview_image" />
            </div>
            {{> ../components/action_button
              label=(t "Change avatar")
              attention="quiet"
              intent="neutral"
              custom_classes="edit_bot_avatar_upload_button"
              }}
            {{> ../components/action_button
              label=(t "Clear profile picture")
              attention="quiet"
              intent="danger"
              custom_classes="edit_bot_avatar_clear_button"
              hidden=true
              }}
            <div><label for="edit_bot_avatar_file" generated="true" class="edit_bot_avatar_error text-error"></label></div>
        </div>
    </form>
    {{#if is_incoming_webhook_bot}}
    <div class="input-group">
        {{> ../components/action_button
          label=(t "Generate URL for an integration")
          attention="quiet"
          intent="neutral"
          custom_classes="generate_url_for_integration"
          }}
    </div>
    {{/if}}
    {{#if (and is_active is_bot_owner_current_user)}}
    <div id="zuliprc-section" class="input-group">
        <div class="zuliprc-container">
            <label class="modal-field-label">{{t "Zuliprc configuration" }} {{> ../help_link_widget link="/api/configuring-python-bindings" }}</label>
            <div class="buttons-container">
                <span>
                    <a type="submit" download="{{zuliprc}}" data-email="{{email}}" data-user-id="{{user_id}}" class="hidden-zuliprc-download" hidden></a>
                    {{> ../components/icon_button
                      custom_classes="download-bot-zuliprc tippy-zulip-delayed-tooltip"
                      icon="download"
                      intent="brand"
                      data-tippy-content=(t 'Download zuliprc')
                      }}
                </span>
                {{> ../components/icon_button
                  icon="copy"
                  intent="success"
                  id="copy-zuliprc-config"
                  custom_classes="copy-zuliprc tippy-zulip-delayed-tooltip"
                  data-tippy-content=(t "Copy zuliprc")
                  }}
            </div>
        </div>
    </div>
    <div class="input-group">
        <label for="api-key" class="modal-field-label">{{t "API key"}}</label>
        <div class="api-key-details-container">
            <input type="text" autocomplete="off" name="api-key" class="modal_text_input api-key inline-block" value="{{ api_key }}" readonly/>
            <div class="buttons-container">
                <span data-user-id="{{user_id}}">
                    {{> ../components/icon_button
                      icon="refresh-cw"
                      intent="brand"
                      custom_classes="bot-modal-regenerate-bot-api-key tippy-zulip-delayed-tooltip"
                      data-tippy-content=(t "Generate new API key")
                      }}
                </span>
                <span data-api-key="{{api_key}}">
                    {{> ../components/icon_button
                      icon="copy"
                      intent="success"
                      id="copy-api-key-button"
                      custom_classes="copy-api-key tippy-zulip-delayed-tooltip"
                      data-tippy-content=(t "Copy API key")
                      }}
                </span>
            </div>
        </div>
        <div class="bot-modal-api-key-error text-error"></div>
    </div>
    {{/if}}
    <div class="input-group">
        {{#if is_active}}
        {{> ../components/action_button
          label=(t "Deactivate bot")
          attention="quiet"
          intent="danger"
          custom_classes="deactivate-bot-button"
          }}
        {{else}}
        <span>
            {{> ../components/action_button
              label=(t "Reactivate bot")
              attention="quiet"
              intent="success"
              custom_classes="reactivate-user-button"
              }}
        </span>
        {{/if}}
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: edit_custom_profile_field_form.hbs]---
Location: zulip-main/web/templates/settings/edit_custom_profile_field_form.hbs

```text
{{#with profile_field_info}}
<form class="name-setting profile-field-form" id="edit-custom-profile-field-form-{{id}}" data-profile-field-id="{{id}}">
    <div class="input-group">
        <label for="id-custom-profile-field-name" class="modal-field-label">{{t "Label" }}</label>
        <input type="text" name="name" id="id-custom-profile-field-name" class="modal_text_input prop-element" value="{{ name }}" maxlength="40" data-setting-widget-type="string" />
    </div>
    <div class="input-group hint_change_container">
        <label for="id-custom-profile-field-hint" class="modal-field-label">{{t "Hint" }}</label>
        <input type="text" name="hint" id="id-custom-profile-field-hint" class="modal_text_input prop-element" value="{{ hint }}" maxlength="80" data-setting-widget-type="string" />
    </div>
    {{#if is_select_field }}
    <div class="input-group prop-element profile-field-choices-wrapper" id="id-custom-profile-field-field-data" data-setting-widget-type="field-data-setting">
        <label for="profile_field_choices_edit" class="modal-field-label">{{t "Field choices" }}</label>
        <div class="profile-field-choices" name="profile_field_choices_edit">
            <div class="edit_profile_field_choices_container">
                {{#each choices}}
                    {{> profile_field_choice . }}
                {{/each}}
            </div>
        </div>
        {{> ../components/action_button
          label=(t "Alphabetize choices")
          custom_classes="alphabetize-choices-button"
          intent="neutral"
          attention="quiet"
          }}
    </div>
    {{else if is_external_account_field}}
    <div class="prop-element" id="id-custom-profile-field-field-data" data-setting-widget-type="field-data-setting">
        <div class="input-group profile_field_external_accounts_edit" >
            <label for="external_acc_field_type" class="modal-field-label">{{t "External account type" }}</label>
            <select name="external_acc_field_type" class="modal_select" disabled>
                {{#each ../realm_default_external_accounts}}
                    <option value='{{@key}}'>{{this.text}}</option>
                {{/each}}
                <option value="custom">{{t 'Custom' }}</option>
            </select>
        </div>
        <div class="input-group custom_external_account_detail">
            <label for="url_pattern" class="modal-field-label">{{t "URL pattern" }}</label>
            <input type="url" class="modal_url_input" name="url_pattern" autocomplete="off" maxlength="80" />
        </div>
    </div>
    {{/if}}
    {{#if valid_to_display_in_summary}}
        <div class="input-group">
            <label class="checkbox edit_profile_field_display_label" for="id-custom-profile-field-display-in-profile-summary">
                <input class="edit_display_in_profile_summary prop-element" data-setting-widget-type="boolean" type="checkbox" id="id-custom-profile-field-display-in-profile-summary" name="display_in_profile_summary" data-setting-widget-type="boolean" {{#if display_in_profile_summary}} checked="checked" {{/if}}/>
                <span class="rendered-checkbox"></span>
                {{t 'Display on user card' }}
            </label>
        </div>
    {{/if}}
    <div class="input-group">
        <label class="checkbox" for="id-custom-profile-field-required">
            <input class="edit-required prop-element" type="checkbox" id="id-custom-profile-field-required" name="required" data-setting-widget-type="boolean" {{#if required}} checked="checked" {{/if}}/>
            <span class="rendered-checkbox"></span>
            {{t 'Required field' }}
        </label>
    </div>
    {{> settings_checkbox
      prefix="id-custom-profile-field-"
      setting_name="editable-by-user"
      is_checked= editable_by_user
      label=(t "Users can edit this field for their own account")
      }}
</form>
{{/with}}
```

--------------------------------------------------------------------------------

---[FILE: edit_embedded_bot_service.hbs]---
Location: zulip-main/web/templates/settings/edit_embedded_bot_service.hbs

```text
{{#if service}}
    {{#if service.config_data}}
        <div id="config_edit_inputbox">
            {{#each service.config_data}}
                <div class="input-group">
                    <label for="embedded_bot_{{@key}}_edit" class="modal-field-label">{{@key}}</label>
                    <input type="text" name="{{@key}}" id="embedded_bot_{{@key}}_edit" class="modal_text_input"
                      maxlength=1000 value="{{this}}" />
                </div>
            {{/each}}
        </div>
    {{/if}}
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: edit_outgoing_webhook_service.hbs]---
Location: zulip-main/web/templates/settings/edit_outgoing_webhook_service.hbs

```text
<div class="input-group">
    <label for="edit_service_base_url">{{t "Endpoint URL" }}</label>
    <input id="edit_service_base_url" type="text" name="service_payload_url" class="edit_service_base_url required modal_text_input"value="{{service.base_url}}" maxlength=2083 />
    <div><label for="edit_service_base_url" generated="true" class="text-error"></label></div>
</div>
<div class="input-group">
    <label for="edit_service_interface">{{t "Webhook format" }}</label>
    <select id="edit_service_interface" class="modal_select bootstrap-focus-style" name="service_interface">
        <option value="1">Zulip</option>
        <option value="2">{{t "Slack-compatible" }}</option>
    </select>
</div>
```

--------------------------------------------------------------------------------

---[FILE: emoji_settings_admin.hbs]---
Location: zulip-main/web/templates/settings/emoji_settings_admin.hbs

```text
<div id="emoji-settings" data-name="emoji-settings" class="settings-section">
    <div class="emoji-settings-tip-container {{#if can_add_emojis}}hide{{/if}}">
        <div class="tip">{{t "You do not have permission to add custom emoji."}}</div>
    </div>
    <p class="add-emoji-text {{#unless can_add_emojis}}hide{{/unless}}">
        {{t "Add extra emoji for members of the {realm_name} organization." }}
    </p>
    {{> ../components/action_button
      id="add-custom-emoji-button"
      attention="quiet"
      intent="brand"
      label=(t "Add a new emoji")
      hidden=(not can_add_emojis)
      }}

    <div class="settings_panel_list_header">
        <h3>{{t "Custom emoji"}}</h3>
        {{> filter_text_input placeholder=(t 'Filter') aria_label=(t 'Filter emoji')}}
    </div>
    <div class="progressive-table-wrapper" data-simplebar data-simplebar-tab-index="-1">
        <table class="table table-striped wrapped-table admin_emoji_table">
            <thead class="table-sticky-headers">
                <tr>
                    <th class="active" data-sort="alphabetic" data-sort-prop="name">{{t "Name" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th class="image">{{t "Image" }}</th>
                    <th class="image" data-sort="author_full_name">{{t "Author" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th class="actions">{{t "Actions" }}</th>
                </tr>
            </thead>
            <tbody id="admin_emoji_table" data-empty="{{t 'There are no custom emoji.' }}" data-search-results-empty="{{t 'No custom emojis match your current filter.' }}"></tbody>
        </table>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: filter_text_input.hbs]---
Location: zulip-main/web/templates/settings/filter_text_input.hbs

```text
<div class="search-container">
    <input type="text" {{#if id}}id="{{id}}"{{/if}} class="search filter_text_input" placeholder="{{placeholder}}" aria-label="{{aria_label}}"/>
    <button type="button" class="clear-filter">
        <i class="zulip-icon zulip-icon-close"></i>
    </button>
</div>
```

--------------------------------------------------------------------------------

---[FILE: generate_integration_url_config_checkbox_modal.hbs]---
Location: zulip-main/web/templates/settings/generate_integration_url_config_checkbox_modal.hbs

```text
<div class="input-group" id="integration-url-{{key}}-container">
    <label class="checkbox">
        <input type="checkbox" id="integration-url-{{key}}-checkbox" class="integration-url-parameter" />
        <span class="rendered-checkbox"></span>
    </label>
    <label class="inline" for="integration-url-{{key}}-checkbox">{{label}}</label>
</div>
```

--------------------------------------------------------------------------------

---[FILE: generate_integration_url_config_text_modal.hbs]---
Location: zulip-main/web/templates/settings/generate_integration_url_config_text_modal.hbs

```text
<div class="input-group" id="integration-url-{{key}}-container">
    <label for="integration-url-{{key}}-text" class="modal-label-field">{{label}}</label>
    <input type="text" id="integration-url-{{key}}-text" class="modal_text_input integration-url-parameter" value=""/>
</div>
```

--------------------------------------------------------------------------------

---[FILE: generate_integration_url_filter_branches_modal.hbs]---
Location: zulip-main/web/templates/settings/generate_integration_url_filter_branches_modal.hbs

```text
<div class="input-group" id="integration-url-branches-parameter">
    <label class="checkbox">
        <input type="checkbox" id="integration-url-all-branches" class="integration-url-parameter" checked/>
        <span class="rendered-checkbox"></span>
    </label>
    <label class="inline" for="integration-url-all-branches">
        {{t "Send notifications for all branches"}}
    </label>
</div>
<div class="input-group hide" id="integration-url-filter-branches">
    <label for="integration-url-branches-text" class="modal-label-field">
        {{t "Which branches should notifications be sent for?"}}
    </label>
    <div class="pill-container">
        <div id="integration-url-branches-text" class="input" contenteditable="true"></div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: generate_integration_url_modal.hbs]---
Location: zulip-main/web/templates/settings/generate_integration_url_modal.hbs

```text
<div class="input-group">
    <div class="integration-url-name-wrapper integration-url-parameter">
        {{> ../dropdown_widget_with_label
          widget_name="integration-name"
          label=(t "Integration")}}
    </div>
</div>
<div class="input-group">
    <div class="integration-url-stream-wrapper integration-url-parameter">
        {{> ../dropdown_widget_with_label
          widget_name="integration-url-stream"
          label=(t "Where to send notifications")}}
    </div>
</div>
<div class="input-group control-label-disabled">
    <label class="checkbox">
        <input type="checkbox" id="integration-url-override-topic" class="integration-url-parameter" disabled/>
        <span class="rendered-checkbox"></span>
    </label>
    <label class="inline" for="integration-url-override-topic">
        {{t "Send all notifications to a single topic"}}
    </label>
</div>
<div class="input-group hide">
    <label for="integration-url-topic-input" class="modal-label-field">{{t "Topic"}}</label>
    <input type="text" id="integration-url-topic-input" class="modal_text_input integration-url-parameter" maxlength="{{ max_topic_length }}" />
</div>
<div id="integration-url-config-options-container">
    <!-- Dynamic Config Options will be rendered here -->
</div>
<div id="integration-events-parameter" class="input-group hide">
    <label class="checkbox">
        <input type="checkbox" id="show-integration-events"/>
        <span class="rendered-checkbox"></span>
    </label>
    <label class="inline" for="show-integration-events">
        {{t "Filter events that will trigger notifications?"}}
    </label>
</div>
<div class="input-group hide" id="integrations-event-container">
    <label for="integrations-event-options">{{t "Events to include:"}}</label>
    <div class="integration-all-events-buttons">
        {{> ../components/action_button attention="quiet" intent="neutral" id="add-all-integration-events" label=(t "Check all") }}
        {{> ../components/action_button attention="quiet" intent="neutral" id="remove-all-integration-events" label=(t "Uncheck all") }}
    </div>
    <div id="integrations-event-options"></div>
</div>
<hr />
<p class="integration-url-header">{{t "URL for your integration"}}</p>
<div class="integration-url">
    {{default_url_message}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: group_setting_value_pill_input.hbs]---
Location: zulip-main/web/templates/settings/group_setting_value_pill_input.hbs

```text
<div class="input-group {{setting_name}}_container">
    {{!-- We are using snake case for one of the classes since setting_name
    is always in snake case and it would be weird to have the resultant id
    be a mix of two types of cases. --}}
    <label class="group-setting-label {{setting_name}}_label">
        {{label}}
        {{#if label_parens_text}}(<i>{{label_parens_text}}</i>){{/if}}
        {{#if help_link}}
        {{> ../help_link_widget link=help_link }}
        {{/if}}
    </label>
    <div class="pill-container person_picker prop-element" id="{{#if prefix}}{{prefix}}{{else}}id_{{/if}}{{setting_name}}" data-setting-widget-type="group-setting-type">
        <div class="input" contenteditable="true" data-placeholder="{{t 'Add roles, groups or users' }}">
            {{~! Squash whitespace so that placeholder is displayed when empty. ~}}
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: image_upload_widget.hbs]---
Location: zulip-main/web/templates/settings/image_upload_widget.hbs

```text
<div id="{{widget}}-upload-widget" class="inline-block image_upload_widget">
    {{#if disabled_text}}
    <div class="image-disabled {{#if is_editable_by_current_user}}hide{{/if}}">
        <div class="image-hover-background"></div>
        <span class="image-disabled-text flex" aria-label="{{ disabled_text }}" role="button" tabindex="0">
            {{ disabled_text }}
        </span>
    </div>
    {{/if}}
    <div class="image_upload_button {{#unless is_editable_by_current_user}}hide{{/unless}}">
        <div class="image-hover-background"></div>
        <button class="image-delete-button" aria-label="{{ delete_text }}" role="button" tabindex="0">
            &times;
        </button>
        <span class="image-delete-text" aria-label="{{ delete_text }}" tabindex="0">
            {{ delete_text }}
        </span>
        <span class="image-upload-text" aria-label="{{ upload_text }}" role="button" tabindex="0">
            {{ upload_text }}
        </span>
        <span class="upload-spinner-background">
            <img class="image_upload_spinner" src="../../images/loading/tail-spin.svg" alt="" />
        </span>
    </div>
    <img class="image-block" src="{{ image }}"/>
    <input type="file" name="file_input" class="notvisible image_file_input"  value="{{ upload_text }}" />
</div>

<div id="{{widget}}-upload-widget-error" class="image_file_input_error text-error"></div>
```

--------------------------------------------------------------------------------

---[FILE: info_density_control_button_group.hbs]---
Location: zulip-main/web/templates/settings/info_density_control_button_group.hbs

```text
<div class="button-group" data-property="{{property}}">
    {{#if for_settings_ui}}
        <div class="info-density-button-container">
            <button class="info-density-button default-button" aria-label="{{#if (eq property "web_font_size_px")}}{{t 'Set font size to default'}}{{else}}{{t 'Set line spacing to default' }}{{/if}}">
                <i class="zulip-icon {{default_icon_class}}" aria-hidden="true"></i>
            </button>
        </div>
    {{/if}}
    {{#if for_settings_ui}}
        <span class="display-value">{{display_value}}</span>
    {{/if}}
    <input class="current-value prop-element" id="{{prefix}}{{property}}" data-setting-widget-type="info-density-setting" type="hidden" value="{{property_value}}" />
    <div class="info-density-button-container">
        <button class="info-density-button decrease-button" aria-label="{{#if (eq property "web_font_size_px")}}{{t 'Decrease font size'}}{{else}}{{t 'Decrease line spacing' }}{{/if}}">
            <i class="zulip-icon zulip-icon-minus" aria-hidden="true"></i>
        </button>
    </div>
    {{#unless for_settings_ui}}
        <div class="info-density-button-container">
            <button class="info-density-button default-button" aria-label="{{#if (eq property "web_font_size_px")}}{{t 'Set font size to default'}}{{else}}{{t 'Set line spacing to default' }}{{/if}}">
                <i class="zulip-icon {{default_icon_class}}" aria-hidden="true"></i>
            </button>
        </div>
    {{/unless}}
    <div class="info-density-button-container">
        <button class="info-density-button increase-button" aria-label="{{#if (eq property "web_font_size_px")}}{{t 'Increase font size'}}{{else}}{{t 'Increase line spacing' }}{{/if}}">
            <i class="zulip-icon zulip-icon-plus" aria-hidden="true"></i>
        </button>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: integration_events.hbs]---
Location: zulip-main/web/templates/settings/integration_events.hbs

```text
{{#each events }}
    <div class="integration-event-wrapper">
        <label class="checkbox">
            <input type="checkbox" class="integration-event" id="{{this.event_id}}" checked=true
              value="{{this.event}}" />
            <span class="rendered-checkbox"></span>
        </label>
        <label for="{{this.event_id}}" class="inline integration-event-name">
            {{this.event}}
        </label>
    </div>
{{/each}}
```

--------------------------------------------------------------------------------

---[FILE: invites_list_admin.hbs]---
Location: zulip-main/web/templates/settings/invites_list_admin.hbs

```text
<div id="admin-invites-list" class="user-settings-section" data-user-settings-section="invitations">
    <div class="invite-user-settings-banner banner-wrapper">
        {{> ../components/banner
          label=(t "You do not have permission to send invite emails in this organization.")
          intent="info"
          custom_classes="admin-permissions-banner"
          }}
    </div>
    {{#unless is_admin }}
    <div class="banner-wrapper">
        {{> ../components/banner
          label=(t "You can only view or manage invitations that you sent.")
          intent="info"
          custom_classes="admin-permissions-banner"
          }}
    </div>
    {{/unless}}
    {{> ../components/action_button
      label=(t 'Invite users to organization')
      attention="quiet"
      intent="brand"
      custom_classes="user-settings-invite-user-label invite-user-link"
      }}
    <div class="settings_panel_list_header">
        <h3>{{t "Invitations "}}</h3>
        <div class="alert-notification" id="invites-field-status"></div>
        {{> filter_text_input placeholder=(t 'Filter') aria_label=(t 'Filter invitations')}}
    </div>

    <div class="progressive-table-wrapper" data-simplebar data-simplebar-tab-index="-1">
        <table class="table table-striped">
            <thead class="table-sticky-headers">
                <tr>
                    <th class="active" data-sort="invitee">{{t "Invitee" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    {{#if is_admin }}
                    <th data-sort="alphabetic" data-sort-prop="referrer_name">{{t "Invited by" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    {{/if}}
                    <th data-sort="numeric" data-sort-prop="invited">{{t "Invited at" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th data-sort="numeric" data-sort-prop="expiry_date">{{t "Expires at" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th data-sort="numeric" data-sort-prop="invited_as">{{t "Invited as" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th class="actions">{{t "Actions" }}</th>
                </tr>
            </thead>
            <tbody id="admin_invites_table" class="admin_invites_table" data-empty="{{t 'There are no invitations.' }}" data-search-results-empty="{{t 'No invitations match your current filter.' }}"></tbody>
        </table>
    </div>
    <div id="admin_page_invites_loading_indicator"></div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: linkifier_settings_admin.hbs]---
Location: zulip-main/web/templates/settings/linkifier_settings_admin.hbs

```text
<div id="linkifier-settings" class="settings-section" data-name="linkifier-settings">
    <p>
        {{t "Configure regular expression patterns that will be used to
          automatically transform any matching text in Zulip messages
          and topics into links." }}
    </p>
    <p>
        {{t "Linkifiers make it easy to refer to issues or tickets in
          third party issue trackers, like GitHub, Salesforce, Zendesk,
          and others. For instance, you can add a linkifier that
          automatically turns #2468 into a link to the GitHub issue
          in the Zulip repository with:" }}
    </p>
    <ul>
        <li>
            {{t "Pattern" }}: <span class="rendered_markdown"><code>#(?P&lt;id&gt;[0-9]+)</code></span>
        </li>
        <li>
            {{t "URL template" }}: <span class="rendered_markdown"><code>https://github.com/zulip/zulip/issues/{id}</code></span>
        </li>
    </ul>
    <p>
        {{#tr}}
            For more examples, see the <z-link>help center documentation</z-link>
            on adding linkifiers.
            {{#*inline "z-link"}}<a href="/help/add-a-custom-linkifier" target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
        {{/tr}}
    </p>

    {{#if is_admin}}
    <form class="admin-linkifier-form">
        <div class="add-new-linkifier-box settings-highlight-box">
            <div class="new-linkifier-form wrapper">
                <div class="settings-section-title new-linkifier-section-title">
                    {{t "Add a new linkifier" }}
                    {{> ../help_link_widget link="/help/add-a-custom-linkifier" }}
                </div>
                <div class="alert" id="admin-linkifier-status"></div>
                <div class="input-group">
                    <label for="linkifier_pattern">{{t "Pattern" }}</label>
                    <input type="text" id="linkifier_pattern" class="settings_text_input" name="pattern" placeholder="#(?P<id>[0-9]+)" />
                    <div class="alert" id="admin-linkifier-pattern-status"></div>
                </div>
                <div class="input-group">
                    <label for="linkifier_template">{{t "URL template" }}</label>
                    <input type="text" id="linkifier_template" class="settings_text_input" name="url_template" placeholder="https://github.com/zulip/zulip/issues/{id}" />
                    <div class="alert" id="admin-linkifier-template-status"></div>
                </div>
                {{> ../components/action_button
                  label=(t 'Add linkifier')
                  attention="quiet"
                  intent="brand"
                  type="submit"
                  }}
            </div>
        </div>
    </form>
    {{/if}}

    <div class="settings_panel_list_header">
        <h3>{{t "Linkifiers"}}</h3>
        <div class="alert-notification edit-linkifier-status" id="linkifier-field-status"></div>
        {{> filter_text_input placeholder=(t 'Filter') aria_label=(t 'Filter linkifiers')}}
    </div>

    <div class="progressive-table-wrapper" data-simplebar data-simplebar-tab-index="-1">
        <table class="table table-striped wrapped-table admin_linkifiers_table">
            <thead class="table-sticky-headers">
                <tr>
                    <th>{{t "Pattern" }}</th>
                    <th>{{t "URL template" }}</th>
                    {{#if is_admin}}
                    <th class="actions">{{t "Actions" }}</th>
                    {{/if}}
                </tr>
            </thead>
            <tbody id="admin_linkifiers_table" data-empty="{{t 'No linkifiers configured.' }}" data-search-results-empty="{{t 'No linkifiers match your current filter.' }}"></tbody>
        </table>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: muted_users_settings.hbs]---
Location: zulip-main/web/templates/settings/muted_users_settings.hbs

```text
<div id="muted-user-settings" class="settings-section" data-name="muted-users">
    <div class="settings_panel_list_header">
        <h3>{{t "Muted users"}}</h3>
        {{> filter_text_input id="muted_users_search" placeholder=(t 'Filter') aria_label=(t 'Filter muted users')}}
    </div>
    <div class="progressive-table-wrapper" data-simplebar data-simplebar-tab-index="-1">
        <table class="table table-striped wrapped-table">
            <thead class="table-sticky-headers">
                <tr>
                    <th data-sort="alphabetic" data-sort-prop="user_name">{{t "User" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th data-sort="numeric" data-sort-prop="date_muted">{{t "Date muted" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th class="actions">{{t "Actions" }}</th>
                </tr>
            </thead>
            <tbody id="muted_users_table" data-empty="{{t 'You have not muted any users yet.'}}" data-search-results-empty="{{t 'No users match your current filter.' }}"></tbody>
        </table>
    </div>
</div>
```

--------------------------------------------------------------------------------

````
