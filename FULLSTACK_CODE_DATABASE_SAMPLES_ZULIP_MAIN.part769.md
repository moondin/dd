---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 769
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 769 of 1290)

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

---[FILE: admin_channel_folders.hbs]---
Location: zulip-main/web/templates/settings/admin_channel_folders.hbs

```text
<div id="channel-folder-settings" class="settings-section" data-name="channel-folders">
    <div class="settings_panel_list_header">
        <h3>{{t "Channel folders"}}</h3>
        <div class="alert-notification" id="admin-channel-folder-status"></div>
        {{#if is_admin}}
            {{> ../components/action_button
              custom_classes="add-channel-folder-button"
              label=(t "Add a new channel folder")
              attention="quiet"
              intent="brand"
              }}
        {{/if}}
    </div>
    <div class="progressive-table-wrapper" data-simplebar data-simplebar-tab-index="-1">
        <table class="table table-striped admin_channel_folders_table">
            <thead>
                <tr>
                    <th>{{t "Name" }}</th>
                    <th>{{t "Description" }}</th>
                    {{#if is_admin}}
                    <th class="actions">{{t "Actions" }}</th>
                    {{/if}}
                </tr>
            </thead>
            <tbody id="admin_channel_folders_table" data-empty="{{t 'No channel folders configured.' }}"></tbody>
        </table>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: admin_channel_folder_list_item.hbs]---
Location: zulip-main/web/templates/settings/admin_channel_folder_list_item.hbs

```text
<tr class="channel-folder-row movable-row" data-channel-folder-id="{{id}}">
    <td>
        {{#if is_admin}}
        <span class="move-handle">
            <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
            <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
        </span>
        {{/if}}
        <span class="channel-folder-name">{{folder_name}}</span>
    </td>
    <td>
        <span class="channel-folder-description rendered-markdown">{{rendered_markdown rendered_description}}</span>
    </td>
    {{#if is_admin}}
    <td class="actions">
        {{> ../components/icon_button
          icon="folder-cog"
          intent="neutral"
          custom_classes="tippy-zulip-delayed-tooltip edit-channel-folder-button"
          data-tippy-content=(t "Manage folder")
          }}
        {{> ../components/icon_button
          icon="trash"
          intent="danger"
          custom_classes="tippy-zulip-delayed-tooltip archive-channel-folder-button"
          data-tippy-content=(t "Delete")
          aria-label=(t "Delete")
          }}
    </td>
    {{/if}}
</tr>
```

--------------------------------------------------------------------------------

---[FILE: admin_default_streams_list.hbs]---
Location: zulip-main/web/templates/settings/admin_default_streams_list.hbs

```text
{{#with stream}}
<tr class="default_stream_row hidden-remove-button-row" data-stream-id="{{stream_id}}">
    <td>
        {{#if invite_only}}<i class="fa fa-lock" aria-hidden="true"></i>{{/if}}
        <span class="default_stream_name">{{name}}</span>
    </td>
    {{#if ../can_modify}}
    <td class="actions">
        {{> ../components/icon_button
          icon="close"
          intent="danger"
          custom_classes="remove-default-stream tippy-zulip-delayed-tooltip hidden-remove-button"
          aria-label=(t "Remove from default")
          data-tippy-content=(t "Remove from default")
          }}
    </td>
    {{/if}}
</tr>
{{/with}}
```

--------------------------------------------------------------------------------

---[FILE: admin_emoji_list.hbs]---
Location: zulip-main/web/templates/settings/admin_emoji_list.hbs

```text
{{#with emoji}}
<tr class="emoji_row" id="emoji_{{name}}" data-emoji-name="{{name}}">
    <td>
        <span class="emoji_name">{{display_name}}</span>
    </td>
    <td>
        <span class="emoji_image">
            <a href="{{source_url}}" target="_blank" rel="noopener noreferrer">
                <img class="emoji" src="{{source_url}}" alt="{{display_name}}" />
            </a>
        </span>
    </td>
    <td>
        {{#if author}}
        {{#with author}}
        <span class="emoji_author panel_user_list">{{> ../user_display_only_pill . display_value=full_name img_src=avatar_url}}</span>
        {{/with}}
        {{else}}
        <span class="emoji_author">{{t "Unknown author" }}</span>
        {{/if}}
    </td>
    <td>
        {{> ../components/icon_button
          icon="trash"
          intent="danger"
          custom_classes="tippy-zulip-delayed-tooltip delete"
          disabled=(not can_delete_emoji)
          data-tippy-content=(t "Deactivate")
          }}
    </td>
</tr>
{{/with}}
```

--------------------------------------------------------------------------------

---[FILE: admin_export_consent_list.hbs]---
Location: zulip-main/web/templates/settings/admin_export_consent_list.hbs

```text
{{#with export_consent}}
<tr>
    <td class="user_name panel_user_list">
        {{> ../user_display_only_pill display_value=full_name user_id=user_id img_src=img_src is_active=true}}
    </td>
    <td>
        <span>{{consent}}</span>
    </td>
</tr>
{{/with}}
```

--------------------------------------------------------------------------------

---[FILE: admin_export_list.hbs]---
Location: zulip-main/web/templates/settings/admin_export_list.hbs

```text
{{#with realm_export}}
<tr class="export_row" id="export_{{id}}" data-export-id="{{id}}">
    <td>
        <span class="acting_user">{{acting_user}}</span>
    </td>
    <td>
        <span>{{export_type_description}}</span>
    </td>
    <td>
        <span class="export_time">{{event_time}}</span>
    </td>
    <td>
        {{#if url}}
        <span class="export_url"><a href="{{url}}" download>{{t 'Complete' }}</a></span>
        {{else if time_failed}}
        <span class="export_status">{{t 'Failed' }}: {{time_failed}}</span>
        {{else if pending}}
        <div class="export_url_spinner"></div>
        {{else if time_deleted}}
        <span class="export_status">{{t 'Deleted' }}: {{time_deleted}}</span>
        {{/if}}
    </td>
    <td class="actions">
        {{#if url}}
        {{> ../components/icon_button
          icon="trash"
          intent="danger"
          custom_classes="tippy-zulip-delayed-tooltip delete"
          data-tippy-content=(t "Delete")
          aria-label=(t "Delete")
          }}
        {{/if}}
    </td>
</tr>
{{/with}}
```

--------------------------------------------------------------------------------

---[FILE: admin_human_form.hbs]---
Location: zulip-main/web/templates/settings/admin_human_form.hbs

```text
<div id="edit-user-form" data-user-id="{{user_id}}">
    <form class="name-setting">
        <div class="alert" id="edit-user-form-error"></div>
        <input type="hidden" name="is_full_name" value="true" />
        <div class="input-group name_change_container">
            <label for="edit_user_full_name" class="modal-field-label">{{t "Name" }}</label>
            <input type="text" autocomplete="off" name="full_name" id="edit_user_full_name" class="modal_text_input" value="{{ full_name }}" maxlength="{{max_user_name_length}}" />
        </div>
        {{#if email}}
        <div class="input-group email_change_container">
            <label for="email" class="modal-field-label">{{t "Email" }}</label>
            <input type="text" autocomplete="off" name="email" class="modal_text_input" value="{{ email }}" readonly/>
        </div>
        {{/if}}
        <div class="input-group user_id_container">
            <label for="user_id" class="modal-field-label">{{t "User ID" }}</label>
            <input type="text" autocomplete="off" name="user_id" class="modal_text_input" value="{{ user_id }}" readonly/>
        </div>
        <div class="input-group">
            <label for="user-role-select" class="modal-field-label">{{t 'User role' }}
                {{> ../help_link_widget link="/help/user-roles" }}
            </label>
            <select name="user-role-select" class="bootstrap-focus-style modal_select" id="user-role-select" data-setting-widget-type="number">
                {{> dropdown_options_widget option_values=user_role_values}}
            </select>
        </div>
        <div class="custom-profile-field-form"></div>
    </form>
    <div class="input-group {{#if hide_deactivate_button}}hide{{/if}}">
        {{#if is_active}}
        {{> ../components/action_button custom_classes="deactivate-user-button" attention="quiet" intent="danger" label=(t "Deactivate user") aria-label=(t "Deactivate user") }}
        {{else}}
        {{> ../components/action_button custom_classes="reactivate-user-button" attention="quiet" intent="success" label=(t "Reactivate user") aria-label=(t "Reactivate user") }}
        {{/if}}
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: admin_invites_list.hbs]---
Location: zulip-main/web/templates/settings/admin_invites_list.hbs

```text
{{#with invite}}
<tr class="invite_row" data-invite-id="{{id}}" data-is-multiuse="{{#unless is_multiuse}}false{{else}}true{{/unless}}">
    <td>
        {{#if is_multiuse}}
        <span class="email">
            <a href="{{link_url}}" target="_blank" rel="noopener noreferrer">
                {{t 'Invite link'}}
            </a>
        </span>
        {{else}}
        <span class="email">{{email}}</span>
        {{/if}}
    </td>
    {{#if is_admin}}
    <td>
        <span class="referred_by panel_user_list">
            {{> ../user_display_only_pill display_value=referrer_name user_id=invited_by_user_id is_active=true}}
        </span>
    </td>
    {{/if}}
    <td>
        <span class="invited_at">{{invited_absolute_time}}</span>
    </td>
    <td>
        {{#if expiry_date_absolute_time}}
        <span class="expires_at">{{expiry_date_absolute_time}}</span>
        {{else}}
        <span class="expires_at">{{t "Never expires"}}</span>
        {{/if}}
    </td>
    <td>
        <span>{{invited_as_text}}</span>
    </td>
    <td class="actions">
        {{> ../components/icon_button
          icon="trash"
          intent="danger"
          custom_classes="revoke tippy-zulip-delayed-tooltip"
          data-tippy-content=(t "Revoke")
          disabled=disable_buttons
          }}
        {{#unless is_multiuse}}
        {{> ../components/icon_button
          icon="check"
          intent="success"
          custom_classes="check hide"
          disabled=true
          }}
        {{> ../components/icon_button
          icon="send-dm"
          intent="neutral"
          custom_classes="resend tippy-zulip-delayed-tooltip"
          data-tippy-content=(t "Resend")
          disabled=disable_buttons
          }}
        {{/unless}}
    </td>
</tr>
{{/with}}
```

--------------------------------------------------------------------------------

---[FILE: admin_linkifier_edit_form.hbs]---
Location: zulip-main/web/templates/settings/admin_linkifier_edit_form.hbs

```text
<div id="edit-linkifier-form">
    <form class="linkifier-edit-form">
        <div class="input-group name_change_container">
            <label for="edit-linkifier-pattern" class="modal-field-label">{{t "Pattern" }}</label>
            <input type="text" autocomplete="off" id="edit-linkifier-pattern" class="modal_text_input" name="pattern" placeholder="#(?P<id>[0-9]+)" value="{{ pattern }}" />
            <div class="alert" id="edit-linkifier-pattern-status"></div>
        </div>
        <div class="input-group name_change_container">
            <label for="edit-linkifier-url-template" class="modal-field-label">{{t "URL template" }}</label>
            <input type="text" autocomplete="off" id="edit-linkifier-url-template" class="modal_text_input" name="url_template" placeholder="https://github.com/zulip/zulip/issues/{id}" value="{{ url_template }}" />
            <div class="alert" id="edit-linkifier-template-status"></div>
        </div>
    </form>
</div>
```

--------------------------------------------------------------------------------

---[FILE: admin_linkifier_list.hbs]---
Location: zulip-main/web/templates/settings/admin_linkifier_list.hbs

```text
{{#with linkifier}}
<tr class="linkifier_row{{#if (and ../can_modify ../can_drag)}} movable-row{{/if}}" data-linkifier-id="{{id}}">
    <td>
        {{#if (and ../can_modify ../can_drag)}}
            <span class="move-handle">
                <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
            </span>
        {{/if}}
        <span class="linkifier_pattern">{{pattern}}</span>
    </td>
    <td>
        <span class="linkifier_url_template">{{url_template}}</span>
    </td>
    {{#if ../can_modify}}
    <td class="no-select actions">
        {{> ../components/icon_button
          icon="edit"
          intent="neutral"
          custom_classes="tippy-zulip-delayed-tooltip edit"
          data-tippy-content=(t "Edit")
          aria-label=(t "Edit")
          }}
        {{> ../components/icon_button
          icon="trash"
          intent="danger"
          custom_classes="tippy-zulip-delayed-tooltip delete"
          data-tippy-content=(t "Delete")
          aria-label=(t "Delete")
          }}
    </td>
    {{/if}}
</tr>
{{/with}}
```

--------------------------------------------------------------------------------

---[FILE: admin_playground_list.hbs]---
Location: zulip-main/web/templates/settings/admin_playground_list.hbs

```text
{{#with playground}}
<tr class="playground_row" data-playground-id="{{id}}">
    <td>
        <span class="playground_pygments_language">{{pygments_language}}</span>
    </td>
    <td>
        <span class="playground_name">{{playground_name}}</span>
    </td>
    <td>
        <span class="playground_url_template">{{url_template}}</span>
    </td>
    {{#if ../can_modify}}
    <td class="no-select actions">
        {{> ../components/icon_button
          icon="trash"
          intent="danger"
          custom_classes="delete-code-playground delete"
          data-tippy-content=(t "Delete")
          aria-label=(t "Delete")
          }}
    </td>
    {{/if}}
</tr>
{{/with}}
```

--------------------------------------------------------------------------------

---[FILE: admin_profile_field_list.hbs]---
Location: zulip-main/web/templates/settings/admin_profile_field_list.hbs

```text
{{#with profile_field}}
<tr class="profile-field-row movable-row" data-profile-field-id="{{id}}">
    <td class="profile_field_name">
        {{#if ../can_modify}}
        <span class="move-handle">
            <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
            <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
        </span>
        {{/if}}
        <span class="profile_field_name">{{name}}</span>
    </td>
    <td class="profile_field_hint">
        <span class="profile_field_hint">{{hint}}</span>
    </td>
    <td>
        <span class="profile_field_type">{{type}}</span>
    </td>
    <td class="display_in_profile_summary_cell">
        {{#if valid_to_display_in_summary}}
        <span class="profile_field_display_in_profile_summary">
            <label class="checkbox display_in_profile_summary_{{display_in_profile_summary}}" for="profile_field_display_in_profile_summary_{{id}}">
                <input class="display_in_profile_summary display_in_profile_summary_checkbox_{{display_in_profile_summary}}" type="checkbox" id="profile_field_display_in_profile_summary_{{id}}" {{#if display_in_profile_summary}} checked="checked" {{/if}} data-profile-field-id="{{id}}"/>
                <span class="rendered-checkbox"></span>
            </label>
        </span>
        {{/if}}
    </td>
    <td class="required-cell">
        <span class="profile-field-required">
            <label class="checkbox" for="profile-field-required-{{id}}">
                <input class="required-field-toggle required-checkbox-{{required}}" type="checkbox" id="profile-field-required-{{id}}" {{#if required}} checked="checked" {{/if}} data-profile-field-id="{{id}}"/>
                <span class="rendered-checkbox"></span>
            </label>
        </span>
    </td>
    {{#if ../can_modify}}
    <td class="actions">
        {{> ../components/icon_button
          icon="edit"
          intent="neutral"
          custom_classes="tippy-zulip-delayed-tooltip open-edit-form-modal"
          data-tippy-content=(t "Edit")
          }}
        {{> ../components/icon_button
          icon="trash"
          intent="danger"
          custom_classes="tippy-zulip-delayed-tooltip delete"
          data-tippy-content=(t "Delete")
          aria-label=(t "Delete")
          }}
    </td>
    {{/if}}
</tr>
{{/with}}
```

--------------------------------------------------------------------------------

---[FILE: admin_realm_domains_list.hbs]---
Location: zulip-main/web/templates/settings/admin_realm_domains_list.hbs

```text
{{#with realm_domain}}
<tr>
    <td class="domain">{{domain}}</td>
    <td>
        <label class="checkbox">
            <input type="checkbox" class="allow-subdomains"
              {{#if allow_subdomains}} checked="checked" {{/if}} />
            <span class="rendered-checkbox"></span>
        </label>
    </td>
    <td>
        {{> ../components/action_button
          label=(t "Remove")
          custom_classes="delete_realm_domain"
          attention="quiet"
          intent="danger"
          }}
    </td>
</tr>
{{/with}}
```

--------------------------------------------------------------------------------

---[FILE: admin_settings_modals.hbs]---
Location: zulip-main/web/templates/settings/admin_settings_modals.hbs

```text
<div id="user-info-form-modal-container"></div>
<div id="linkifier-edit-form-modal-container"></div>
```

--------------------------------------------------------------------------------

---[FILE: admin_tab.hbs]---
Location: zulip-main/web/templates/settings/admin_tab.hbs

```text
<div class="alert" id="organization-status"></div>
<div id="revoke_invite_modal_holder"></div>

{{> admin_settings_modals}}

{{> organization_profile_admin . }}

{{> organization_settings_admin . }}

{{> organization_permissions_admin . }}

{{> organization_user_settings_defaults . }}

{{> emoji_settings_admin . }}

{{> user_list_admin . }}

{{> bot_list_admin . }}

{{> admin_channel_folders .}}

{{> default_streams_list_admin . }}

{{> auth_methods_settings_admin . }}

{{> linkifier_settings_admin . }}

{{> playground_settings_admin . }}

{{> profile_field_settings_admin . }}

{{> data_exports_admin . }}
```

--------------------------------------------------------------------------------

---[FILE: alert_word_settings.hbs]---
Location: zulip-main/web/templates/settings/alert_word_settings.hbs

```text
<div id="alert-word-settings" class="settings-section" data-name="alert-words">
    <form id="alert_word_info_box">
        <p class="alert-word-settings-note">
            {{t "Alert words allow you to be notified as if you were @-mentioned when certain words or phrases are used in Zulip. Alert words are not case sensitive."}}
        </p>
    </form>
    {{> ../components/action_button
      label=(t "Add alert word")
      attention="quiet"
      intent="brand"
      id="open-add-alert-word-modal"
      }}

    <div class="settings_panel_list_header">
        <h3>{{t "Alert words"}}</h3>
    </div>
    <div class="banner-wrapper" id="alert_word_status"></div>
    <div class="progressive-table-wrapper" data-simplebar data-simplebar-tab-index="-1">
        <table class="table table-striped wrapped-table">
            <thead class="table-sticky-headers">
                <tr>
                    <th data-sort="alphabetic" data-sort-prop="word">{{t "Word" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th class="actions">{{t "Actions" }}</th>
                </tr>
            </thead>
            <tbody id="alert-words-table" class="alert-words-table"
              data-empty="{{t 'There are no current alert words.' }}"></tbody>
        </table>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: alert_word_settings_item.hbs]---
Location: zulip-main/web/templates/settings/alert_word_settings_item.hbs

```text
{{! Alert word in the settings page that can be removed }}
{{#with alert_word}}
<tr class="alert-word-item" data-word='{{word}}'>
    <td>
        <div class="alert_word_listing">
            <span class="value">{{word}}</span>
        </div>
    </td>
    <td>
        {{> ../components/icon_button
          icon="trash"
          intent="danger"
          custom_classes="delete remove-alert-word tippy-zulip-delayed-tooltip"
          data-tippy-content=(t "Delete")
          }}
    </td>
</tr>
{{/with}}
```

--------------------------------------------------------------------------------

---[FILE: api_key_modal.hbs]---
Location: zulip-main/web/templates/settings/api_key_modal.hbs

```text
<div class="micromodal" id="api_key_modal" aria-hidden="true">
    <div class="modal__overlay" tabindex="-1">
        <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="api_key_modal_label">
            <header class="modal__header">
                <h1 class="modal__title" id="api_key_modal_label">
                    {{t "Show API key" }}
                </h1>
                <button class="modal__close" aria-label="{{t 'Close modal' }}" data-micromodal-close></button>
            </header>
            <main class="modal__content">
                <div id="password_confirmation">
                    <span class="alert-notification" id="api_key_status"></span>
                    <div id="api_key_form">
                        <p>{{t "Please re-enter your password to confirm your identity." }}</p>
                        <div class="settings-password-div">
                            <label for="get_api_key_password" class="modal-field-label">{{t "Your password" }}</label>
                            <div class="password-input-row">
                                <input type="password" autocomplete="off" name="password" id="get_api_key_password" class=" modal_password_input" value="" />
                                <i class="fa fa-eye-slash password_visibility_toggle tippy-zulip-tooltip" role="button"></i>
                            </div>
                        </div>
                        <p class="small">
                            {{#tr}}If you don't know your password, you can <z-link>reset it</z-link>.
                                {{#*inline "z-link"}}<a href="/accounts/password/reset/" target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
                            {{/tr}}
                        </p>
                    </div>
                </div>
                <div id="show_api_key">
                    <p>{{t "Your API key:" }}</p>
                    <p><b class="highlighted-element"><span id="api_key_value"></span></b></p>
                    <div id="user_api_key_error" class="text-error"></div>
                </div>
            </main>
            <footer class="modal__footer">
                <button type="submit" name="view_api_key" id="get_api_key_button" class="modal__button dialog_submit_button">
                    {{t 'Get API key' }}
                </button>
                <div id="api_key_buttons">
                    <button class="modal__button dialog_submit_button" id="regenerate_api_key" aria-label="{{t 'Generate new API key' }}">{{t "Generate new API key" }}</button>
                    <a class="modal__button dialog_submit_button" id="download_zuliprc" download="zuliprc" tabindex="0">{{t "Download zuliprc" }}</a>
                </div>
            </footer>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: attachments_settings.hbs]---
Location: zulip-main/web/templates/settings/attachments_settings.hbs

```text
<div id="attachments-settings" class="settings-section" data-name="uploaded-files">
    <div id="attachment-stats-holder" class="banner-wrapper"></div>
    <div class="settings_panel_list_header">
        <h3>{{t "Your uploads"}}</h3>
        {{> filter_text_input id="upload_file_search" placeholder=(t 'Filter') aria_label=(t 'Filter uploads')}}
    </div>
    <div class="clear-float"></div>
    <div class="alert" id="delete-upload-status"></div>
    <div class="progressive-table-wrapper" data-simplebar data-simplebar-tab-index="-1">
        <table class="table table-striped wrapped-table">
            <thead class="table-sticky-headers">
                <tr>
                    <th data-sort="alphabetic" data-sort-prop="name" class="upload-file-name">{{t "File" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th class="active upload-date" data-sort="numeric" data-sort-prop="create_time">{{t "Date uploaded" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th class="upload-mentioned-in" data-sort="mentioned_in">{{t "Mentioned in" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th class="upload-size" data-sort="numeric" data-sort-prop="size">{{t "Size" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th class="upload-actions actions">{{t "Actions" }}</th>
                </tr>
            </thead>
            <tbody data-empty="{{t 'You have not uploaded any files.' }}" data-search-results-empty="{{t 'No uploaded files match your current filter.' }}" id="uploaded_files_table"></tbody>
        </table>
    </div>
    <div id="attachments_loading_indicator"></div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: auth_methods_settings_admin.hbs]---
Location: zulip-main/web/templates/settings/auth_methods_settings_admin.hbs

```text
<div id="organization-auth-settings" class="settings-section" data-name="auth-methods">
    {{#unless is_owner}}
    <div class="banner-wrapper">
        {{> ../components/banner
          label=(t "Only organization owners can edit these settings.")
          intent="info"
          custom_classes="admin-permissions-banner"
          }}
    </div>
    {{/unless}}
    <form class="admin-realm-form org-authentications-form">
        <div id="org-auth_settings" class="settings-subsection-parent">
            <div class ="subsection-header">
                <h3>{{t "Authentication methods" }}</h3>
                {{> settings_save_discard_widget section_name="auth_settings" }}
            </div>

            <div>
                <p>{{t "Configure the authentication methods for your organization."}}</p>
                <div id="id_realm_authentication_methods" class="prop-element" data-setting-widget-type="auth-methods">
                    {{! Empty div is intentional, it will get populated by a dedicated template }}
                </div>
            </div>
        </div>
    </form>
</div>
```

--------------------------------------------------------------------------------

---[FILE: bot_list.hbs]---
Location: zulip-main/web/templates/settings/bot_list.hbs

```text
<div class="settings_panel_list_header">
    <h3>{{section_title}}</h3>
    <div class="alert-notification"></div>
    <div class="bot-filters">
        {{> ../dropdown_widget widget_name=dropdown_widget_name}}
        {{> filter_text_input placeholder=(t 'Filter') aria_label=(t 'Filter bots')}}
    </div>
</div>

<div class="progressive-table-wrapper" data-simplebar data-simplebar-tab-index="-1">
    <table class="table table-striped wrapped-table">
        <thead class="table-sticky-headers">
            <tr>
                <th class="active" data-sort="alphabetic" data-sort-prop="full_name">{{t "Name" }}
                    <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                </th>
                <th class="settings-email-column" data-sort="email">{{t "Email" }}
                    <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                </th>
                <th class="user_role" data-sort="role">{{t "Role" }}
                    <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                </th>
                <th data-sort="bot_owner">{{t "Owner" }}
                    <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                </th>
                <th data-sort="alphabetic" data-sort-prop="bot_type" class="bot_type">{{t "Bot type" }}
                    <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                </th>
                <th class="actions">{{t "Actions" }}</th>
            </tr>
        </thead>
        <tbody id="admin_{{section_name}}_table" class="admin_bot_table"
          data-empty="{{#if (eq section_name 'all_bots')}}{{t 'There are no active bots in this organization.' }}{{else}}{{t 'You have no active bots'}}{{/if}}" data-search-results-empty="{{#if (eq section_name 'all_bots')}}{{t 'No bots match your current filter.' }}{{else}}{{t 'None of your bots match your current filter.' }}{{/if}}"></tbody>
    </table>
</div>
<div id="admin_page_{{section_name}}_loading_indicator"></div>
```

--------------------------------------------------------------------------------

---[FILE: bot_list_admin.hbs]---
Location: zulip-main/web/templates/settings/bot_list_admin.hbs

```text
<div id="admin-bot-list" class="settings-section" data-name="bots">
    <div class="bot-settings-tip banner-wrapper" id="admin-bot-settings-tip">
    </div>
    <div class="clear-float"></div>
    <div>
        {{> ../components/action_button
          label=(t "Add a new bot")
          attention="quiet"
          intent="brand"
          custom_classes="add-a-new-bot"
          hidden=(not can_create_new_bots)
          }}
    </div>
    <div class="tab-container"></div>
    <div id="admin-all-bots-list" class="bot-settings-section user-or-bot-settings-section" data-bot-settings-section="all-bots">
        {{> bot_list
          section_name="all_bots"
          section_title=(t "All bots")
          dropdown_widget_name=all_bots_list_dropdown_widget_name
          }}
    </div>
    <div id="admin-your-bots-list" class="bot-settings-section user-or-bot-settings-section" data-bot-settings-section="your-bots">
        <div id="botserverrc-text-container" class="config-download-text">
            <span>{{t 'Download config of all active outgoing webhook bots in Zulip Botserver format.' }}</span>
            <a type="submit" download="botserverrc" id= "hidden-botserverrc-download" hidden></a>
            {{> ../components/icon_button
              id= "download-botserverrc-file"
              icon="download"
              intent="brand"
              custom_classes="tippy-zulip-delayed-tooltip inline"
              data-tippy-content=(t "Download botserverrc")
              }}
        </div>

        {{> bot_list
          section_name="your_bots"
          section_title=(t "Your bots")
          dropdown_widget_name=your_bots_list_dropdown_widget_name
          }}
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: bot_settings_tip.hbs]---
Location: zulip-main/web/templates/settings/bot_settings_tip.hbs

```text
{{#unless can_create_any_bots}}
    {{#if can_create_incoming_webhooks}}
        {{> ../components/banner
          label=(t "You can create bots that can only send messages.")
          intent="info"
          custom_classes="admin-permissions-banner"
          }}
    {{else}}
        {{> ../components/banner
          label=(t "You do not have permission to create bots.")
          intent="info"
          custom_classes="admin-permissions-banner"
          }}
    {{/if}}
{{/unless}}
```

--------------------------------------------------------------------------------

---[FILE: convert_demo_organization_form.hbs]---
Location: zulip-main/web/templates/settings/convert_demo_organization_form.hbs

```text
<div id="convert-demo-organization-form">
    {{#unless user_has_email_set}}
    <div class="demo-organization-add-email-banner banner-wrapper"></div>
    {{/unless}}
    <p>{{t "Everyone will need to log in again at the new URL for your organization." }}</p>
    <form class="subdomain-setting">
        <div class="input-group">
            <label for="string_id" class="inline-block modal-field-label">{{t "Organization URL" }}</label>
            <div id="subdomain_input_container">
                <input id="new_subdomain" type="text" class="modal_text_input" autocomplete="off" name="string_id" placeholder="{{t 'acme' }}"/>
                <label for="string_id" class="domain_label">.{{ realm_domain }}</label>
            </div>
        </div>
    </form>
</div>
```

--------------------------------------------------------------------------------

---[FILE: custom_user_profile_field.hbs]---
Location: zulip-main/web/templates/settings/custom_user_profile_field.hbs

```text
<div class="custom_user_field" name="{{ field.name }}" data-field-id="{{ field.id }}">
    <span class="custom-user-field-label-wrapper {{#if field.required}}required-field-wrapper{{/if}}">
        <label class="settings-field-label inline-block" for="id_custom_profile_field_input_{{ field.id }}">{{ field.name }}</label>
        <span class="required-symbol {{#unless is_empty_required_field}}hidden{{/unless}}"> *</span>
    </span>
    <div class="alert-notification custom-field-status"></div>
    <div class="settings-profile-user-field-hint">{{ field.hint }}</div>
    <div class="settings-profile-user-field {{#if is_empty_required_field}}empty-required-field{{/if}} {{#unless editable_by_user}}not-editable-by-user-input-wrapper{{/unless}}{{#if (and is_date_field editable_by_user)}}editable-date-field{{/if}}">
        {{#if is_long_text_field}}
        <textarea id="id_custom_profile_field_input_{{ field.id }}" maxlength="500" class="custom_user_field_value {{#if for_manage_user_modal}}modal-textarea{{else}}settings-textarea{{/if}}" name="{{ field.id }}" {{#unless editable_by_user}}disabled{{/unless}}>{{ field_value.value }}</textarea>
        {{else if is_select_field}}
        <select id="id_custom_profile_field_input_{{ field.id }}" class="custom_user_field_value {{#if for_manage_user_modal}}modal_select{{else}}settings_select{{/if}} bootstrap-focus-style" name="{{ field.id }}" {{#unless editable_by_user}}disabled{{/unless}}>
            <option value=""></option>
            {{#each field_choices}}
                <option value="{{ this.value }}" {{#if this.selected}}selected{{/if}}>{{ this.text }}</option>
            {{/each}}
        </select>
        {{else if is_user_field }}
        <div class="pill-container person_picker {{#unless editable_by_user}}not-editable-by-user disabled{{/unless}}" name="{{ field.id }}">
            <div class="input" {{#if editable_by_user}}contenteditable="true"{{/if}}></div>
        </div>
        {{else if is_date_field }}
        <input class="custom_user_field_value datepicker {{#if for_manage_user_modal}}modal_text_input{{else}}settings_text_input{{/if}}" name="{{ field.id }}" data-field-id="{{ field.id }}" type="text"
          value="{{ field_value.value }}" {{#unless editable_by_user}}disabled{{/unless}}/>
        {{#if editable_by_user}}<span class="remove_date"><i class="zulip-icon zulip-icon-close" aria-hidden="true"></i></span>{{/if}}
        {{else if is_url_field }}
        <input id="id_custom_profile_field_input_{{ field.id }}" class="custom_user_field_value {{#if for_manage_user_modal}}modal_url_input{{else}}settings_url_input{{/if}}" name="{{ field.id }}" type="{{ field_type }}" value="{{ field_value.value }}" maxlength="2048" {{#unless editable_by_user}}disabled{{/unless}}/>
        {{else if is_pronouns_field}}
        <input id="id_custom_profile_field_input_{{ field.id }}" class="custom_user_field_value pronouns_type_field {{#if for_manage_user_modal}}modal_text_input{{else}}settings_text_input{{/if}}" name="{{ field.id }}" type="{{ field_type }}" value="{{ field_value.value }}" maxlength="50" {{#unless editable_by_user}}disabled{{/unless}}/>
        {{else}}
        <input id="id_custom_profile_field_input_{{ field.id }}" class="custom_user_field_value {{#if for_manage_user_modal}}modal_text_input{{else}}settings_text_input{{/if}}" name="{{ field.id }}" type="{{ field_type }}" value="{{ field_value.value }}" maxlength="50" {{#unless editable_by_user}}disabled{{/unless}}/>
        {{/if}}
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: data_exports_admin.hbs]---
Location: zulip-main/web/templates/settings/data_exports_admin.hbs

```text
<div id="data-exports" class="settings-section" data-name="data-exports-admin">
    <h3>{{t "Export organization" }}
        {{> ../help_link_widget link="/help/export-your-organization" }}
    </h3>
    <p>
        {{t 'Your organization’s data will be exported in a format designed for imports into Zulip Cloud or a self-hosted installation of Zulip.' }}
        {{t 'You will be able to export all public data, and (optionally) private data from users who have given their permission.' }}
        {{#tr}}
            <z-link>Learn more</z-link> about other data export options.
            {{#*inline "z-link"}}<a href="/help/export-your-organization" target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
        {{/tr}}
    </p>
    <p>
        {{t 'Depending on the size of your organization, an export can take anywhere from seconds to an hour.' }}
    </p>

    {{#if is_admin}}
    <div class="alert" id="export_status" role="alert">
        <span class="export_status_text"></span>
    </div>
    <form>
        {{> ../components/action_button
          label=(t "Start export")
          id="start-export-button"
          attention="quiet"
          intent="brand"
          type="submit"
          }}
    </form>
    {{/if}}

    <hr/>

    <div class="tab-container"></div>

    <div class="export_section" data-export-section="data-exports">
        <div class="settings_panel_list_header">
            <h3>{{t "Data exports"}}</h3>
            <input type="hidden" class="search" placeholder="{{t 'Filter exports' }}"
              aria-label="{{t 'Filter exports' }}"/>
        </div>

        <div class="progressive-table-wrapper" data-simplebar data-simplebar-tab-index="-1">
            <table class="table table-striped wrapped-table admin_exports_table">
                <thead class="table-sticky-headers">
                    <tr>
                        <th class="active" data-sort="user">{{t "Requesting user" }}
                            <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                        </th>
                        <th>{{t "Type"}}</th>
                        <th data-sort="numeric" data-sort-prop="export_time">{{t "Time" }}
                            <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                        </th>
                        <th>{{t "Status" }}</th>
                        <th class="actions">{{t "Actions" }}</th>
                    </tr>
                </thead>
                <tbody id="admin_exports_table" data-empty="{{t 'There are no exports.' }}"></tbody>
            </table>
        </div>
    </div>

    <div class="export_section" data-export-section="export-permissions">
        <div class="settings_panel_list_header">
            <h3>{{t "Export permissions"}}</h3>
            <div class="user_filters">
                {{> ../dropdown_widget widget_name="filter_by_consent"}}
                {{> filter_text_input placeholder=(t 'Filter') aria_label=(t 'Filter users')}}
            </div>
        </div>

        <div class="progressive-table-wrapper" data-simplebar data-simplebar-tab-index="-1">
            <table class="table table-striped wrapped-table">
                <thead class="table-sticky-headers">
                    <tr>
                        <th class="active" data-sort="full_name">{{t "Name" }}</th>
                        <th>{{t "Export permission"}}</th>
                    </tr>
                </thead>
                <tbody id="admin_export_consents_table"></tbody>
            </table>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

````
