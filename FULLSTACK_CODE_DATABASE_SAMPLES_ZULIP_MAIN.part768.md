---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 768
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 768 of 1290)

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

---[FILE: user_card_popover.hbs]---
Location: zulip-main/web/templates/popovers/user_card/user_card_popover.hbs

```text
<div class="popover-menu user-card-popover-actions no-auto-hide-right-sidebar-overlay" id="user_card_popover" data-simplebar data-simplebar-tab-index="-1">
    <div class="popover-menu-user-header">
        <div class="popover-menu-user-avatar-container {{#if (not is_active)}}deactivated{{/if}}">
            <img class="popover-menu-user-avatar{{#if user_is_guest}} guest-avatar{{/if}}" src="{{user_avatar}}" />
            {{#if (and is_active (not is_bot))}}
                <div class="popover-menu-user-presence user-circle zulip-icon zulip-icon-{{user_circle_class}} {{user_circle_class}} hidden-for-spectators" data-presence-indicator-user-id="{{user_id}}"></div>
            {{/if}}
            {{#if (not is_active)}}
                <span class="popover-menu-user-presence conversation-partners-icon fa fa-ban fa-lg deactivated-user-icon user_circle"></span>
            {{/if}}
        </div>
        <div class="popover-menu-user-info">
            <div class="popover-menu-user-full-name text-select" data-tippy-content="{{user_full_name}}">
                {{> ../../user_full_name name=user_full_name}}
                {{#if is_bot}}
                    <i class="zulip-icon zulip-icon-bot" aria-hidden="true"></i>
                {{/if}}
            </div>
            <div class="popover-menu-user-type">
                {{#if is_bot}}
                    {{#if is_system_bot}}
                        <div>{{t "System bot" }}</div>
                    {{else}}
                        <div>{{t "Bot" }}
                            {{~#unless (eq user_type "Member")}}
                                <span class="lowercase">({{user_type}})</span>
                            {{/unless~}}
                        </div>
                    {{/if}}
                {{else}}
                    <div>{{ user_type }}</div>
                {{/if}}
            </div>
        </div>
    </div>
    <ul role="menu" class="popover-menu-list" data-user-id="{{user_id}}">
        {{#if status_content_available}}
            <li role="none" class="text-item popover-menu-list-item hidden-for-spectators">
                <span class="personal-menu-status-wrapper">
                    {{#if status_emoji_info}}
                        {{#if status_emoji_info.emoji_alt_code}}
                            <span class="emoji_alt_code">&nbsp;:{{status_emoji_info.emoji_name}}:</span>
                        {{else if status_emoji_info.url}}
                            <img src="{{status_emoji_info.url}}" class="emoji status_emoji" data-tippy-content=":{{status_emoji_info.emoji_name}}:"/>
                        {{else}}
                            <span class="emoji status_emoji emoji-{{status_emoji_info.emoji_code}}" data-tippy-content=":{{status_emoji_info.emoji_name}}:"></span>
                        {{/if}}
                    {{/if}}
                    <span class="status_text personal-menu-status-text">
                        {{#if show_placeholder_for_status_text}}
                            <i class="personal-menu-no-status-text">{{t "No status text"}}</i>
                        {{else}}
                            {{status_text}}
                        {{/if}}
                    </span>
                </span>
                {{#if is_me}}
                    <a role="menuitem" tabindex="0" class="personal-menu-clear-status user-card-clear-status-button popover-menu-link" aria-label="{{t 'Clear status'}}" data-tippy-content="{{t 'Clear your status' }}">
                        <i class="personal-menu-clear-status-icon popover-menu-icon zulip-icon zulip-icon-x-circle" aria-hidden="true"></i>
                    </a>
                {{/if}}
            </li>
        {{/if}}
        {{#if is_me}}
            {{#if status_content_available}}
                <li role="none" class="link-item popover-menu-list-item hidden-for-spectators">
                    <a role="menuitem" tabindex="0" class="update_status_text popover-menu-link">
                        <i class="popover-menu-icon zulip-icon zulip-icon-smile-smaller" aria-hidden="true"></i>
                        <span class="popover-menu-label">{{t 'Edit status' }}</span>
                    </a>
                </li>
            {{else}}
                <li role="none" class="link-item popover-menu-list-item hidden-for-spectators">
                    <a role="menuitem" tabindex="0" class="update_status_text popover-menu-link">
                        <i class="popover-menu-icon zulip-icon zulip-icon-smile-smaller" aria-hidden="true"></i>
                        <span class="popover-menu-label">{{t 'Set status' }}</span>
                    </a>
                </li>
            {{/if}}
            {{#if invisible_mode}}
                <li role="none" class="link-item popover-menu-list-item">
                    <a role="menuitem" tabindex="0" class="invisible_mode_turn_off popover-menu-link">
                        <i class="popover-menu-icon zulip-icon zulip-icon-play-circle" aria-hidden="true"></i>
                        <span class="popover-menu-label">{{t 'Turn off invisible mode' }}</span>
                    </a>
                </li>
            {{else}}
                <li role="none" class="link-item popover-menu-list-item hidden-for-spectators">
                    <a role="menuitem" tabindex="0" class="invisible_mode_turn_on popover-menu-link">
                        <i class="popover-menu-icon zulip-icon zulip-icon-stop-circle" aria-hidden="true"></i>
                        <span class="popover-menu-label">{{t 'Go invisible' }}</span>
                    </a>
                </li>
            {{/if}}
        {{/if}}
        {{#if (or is_me status_content_available)}}
            <li role="separator" class="popover-menu-separator hidden-for-spectators"></li>
        {{/if}}
        {{#if is_active}}
            {{#unless is_bot}}
                <li role="none" class="popover-menu-list-item text-item hidden-for-spectators">
                    <i class="popover-menu-icon zulip-icon zulip-icon-past-time" aria-hidden="true"></i>
                    <span class="popover-menu-label user-last-seen-time">{{user_last_seen_time_status}}</span>
                </li>
            {{/unless}}
            {{#if user_time}}
                <li role="none" class="popover-menu-list-item text-item hidden-for-spectators">
                    <i class="popover-menu-icon zulip-icon zulip-icon-clock" aria-hidden="true"></i>
                    <span class="popover-menu-label">{{t "{user_time} local time" }}</span>
                </li>
            {{/if}}
        {{else}}
            <li role="none" class="popover-menu-list-item text-item italic hidden-for-spectators">
                {{#if is_bot}}
                    <span class="popover-menu-label">{{t "This bot has been deactivated." }}</span>
                {{else}}
                    <span class="popover-menu-label">{{t "This user has been deactivated." }}</span>
                {{/if}}
            </li>
        {{/if}}
        {{#if spectator_view}}
            <li role="none" class="popover-menu-list-item text-item">
                <span class="popover-menu-label">{{t "Joined {date_joined}" }}</span>
            </li>
        {{/if}}
        <li role="separator" class="popover-menu-separator hidden-for-spectators"></li>
        {{#if is_bot}}
            {{#if bot_owner}}
                <li role="none" class="popover-menu-list-item user-card-popover-bot-owner-field text-item hidden-for-spectators">
                    <span class="bot_owner" data-tippy-content="{{ bot_owner.full_name }}">{{t "Bot owner" }}:</span>
                    {{> ../../user_display_only_pill display_value=bot_owner.full_name user_id=bot_owner.user_id img_src=bot_owner.avatar_url is_active=true}}
                </li>
            {{/if}}
        {{/if}}
        {{#if is_active }}
            {{#if user_email}}
                <li role="none" class="popover-menu-list-item text-item user-card-popover-email-field hidden-for-spectators">
                    <span class="user_popover_email">{{ user_email }}</span>
                    <span role="menuitem" tabindex="0" id="popover-menu-copy-email" class="popover-menu-link copy-button hide_copy_icon" aria-label="{{t 'Copy email'}}" data-tippy-content="{{t 'Copy email' }}" data-clipboard-text="{{ user_email }}">
                        <i class="zulip-icon zulip-icon-copy hide" aria-hidden="true"></i>
                    </span>
                </li>
            {{/if}}
        {{/if}}
        {{> ./user_card_popover_custom_fields profile_fields=display_profile_fields}}
        <li role="none" class="popover-menu-list-item link-item hidden-for-spectators">
            <a role="menuitem" class="popover-menu-link view_full_user_profile" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-account" aria-hidden="true"></i>
                {{#if is_me}}
                    <span class="popover-menu-label">{{t "View your profile" }}</span>
                {{else}}
                    <span class="popover-menu-label">{{t "View profile" }}</span>
                {{/if}}
            </a>
        </li>
        {{#if can_send_private_message}}
            <li role="none" class="popover-menu-list-item link-item hidden-for-spectators">
                <a role="menuitem" class="popover-menu-link {{ private_message_class }}" tabindex="0">
                    <i class="popover-menu-icon zulip-icon zulip-icon-send-dm" aria-hidden="true"></i>
                    <span class="popover-menu-label">{{t "Send direct message" }}</span>
                    {{#if is_sender_popover}}
                        {{popover_hotkey_hints "Shift" "R"}}
                    {{/if}}
                </a>
            </li>
        {{/if}}
        {{#unless is_me}}
            <li role="none" class="popover-menu-list-item link-item hidden-for-spectators">
                {{#if has_message_context}}
                    <a role="menuitem" class="popover-menu-link mention_user" tabindex="0">
                        <i class="popover-menu-icon zulip-icon zulip-icon-at-sign" aria-hidden="true"></i>
                        {{#if is_bot}}
                            <span class="popover-menu-label">{{t "Reply mentioning bot" }}</span>
                        {{else}}
                            <span class="popover-menu-label">{{t "Reply mentioning user" }}</span>
                        {{/if}}
                        {{#if is_sender_popover}}
                            {{popover_hotkey_hints "@"}}
                        {{/if}}
                    </a>
                {{else}}
                    <a role="menuitem" class="popover-menu-link copy_mention_syntax" tabindex="0" data-clipboard-text="{{ user_mention_syntax }}">
                        <i class="popover-menu-icon fa zulip-icon zulip-icon-at-sign" aria-hidden="true"></i>
                        <span class="popover-menu-label">{{t "Copy mention syntax" }}</span>
                        {{#if is_sender_popover}}
                            {{popover_hotkey_hints "@"}}
                        {{/if}}
                    </a>
                {{/if}}
            </li>
        {{/unless}}
        {{#if is_me}}
            <li role="none" class="popover-menu-list-item link-item hidden-for-spectators">
                <a role="menuitem" class="popover-menu-link edit-your-profile" tabindex="0">
                    <i class="popover-menu-icon zulip-icon zulip-icon-tool" aria-hidden="true"></i>
                    <span class="popover-menu-label">{{t "Edit your profile" }}</span>
                </a>
            </li>
        {{/if}}
        <li role="separator" class="popover-menu-separator hidden-for-spectators"></li>
        <li role="none" class="popover-menu-list-item link-item">
            <a role="menuitem" href="{{ pm_with_url }}" class="narrow_to_private_messages popover-menu-link hidden-for-spectators" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-user" aria-hidden="true"></i>
                {{#if is_me}}
                    <span class="popover-menu-label">{{t "View messages with yourself" }}</span>
                {{else}}
                    <span class="popover-menu-label">{{t "View direct messages" }}</span>
                {{/if}}
            </a>
        </li>
        <li role="none" class="popover-menu-list-item link-item">
            <a role="menuitem" href="{{ sent_by_url }}" class="narrow_to_messages_sent popover-menu-link hidden-for-spectators" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-message-square" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "View messages sent" }}</span>
            </a>
        </li>
        {{#if show_manage_section}}
            <li role="separator" class="popover-menu-separator hidden-for-spectators"></li>
            {{#if can_mute}}
                <li role="none" class="popover-menu-list-item link-item">
                    <a role="menuitem" class="sidebar-popover-mute-user popover-menu-link hidden-for-spectators" tabindex="0">
                        <i class="popover-menu-icon zulip-icon zulip-icon-hide" aria-hidden="true"></i>
                        {{#if is_bot}}
                            <span class="popover-menu-label">{{t "Mute this bot" }}</span>
                        {{else}}
                            <span class="popover-menu-label">{{t "Mute this user" }}</span>
                        {{/if}}
                    </a>
                </li>
            {{/if}}
            {{#if can_unmute}}
                <li role="none" class="popover-menu-list-item link-item">
                    <a role="menuitem" class="sidebar-popover-unmute-user popover-menu-link hidden-for-spectators" tabindex="0">
                        <i class="popover-menu-icon fa fa-eye" aria-hidden="true"></i>
                        {{#if is_bot}}
                            <span class="popover-menu-label">{{t "Unmute this bot" }}</span>
                        {{else}}
                            <span class="popover-menu-label">{{t "Unmute this user" }}</span>
                        {{/if}}
                    </a>
                </li>
            {{/if}}
            {{#if can_manage_user}}
                <li role="separator" class="popover-menu-separator hidden-for-spectators"></li>
                <li role="none" class="popover-menu-list-item link-item">
                    <a role="menuitem" class="sidebar-popover-manage-user popover-menu-link hidden-for-spectators" tabindex="0">
                        <i class="popover-menu-icon zulip-icon zulip-icon-user-cog" aria-hidden="true"></i>
                        {{#if is_bot}}
                            <span class="popover-menu-label">{{t "Manage this bot" }}</span>
                        {{else}}
                            <span class="popover-menu-label">{{t "Manage this user" }}</span>
                        {{/if}}
                    </a>
                </li>
                {{#if (not is_active)}}
                    <li role="none" class="popover-menu-list-item link-item">
                        <a role="menuitem" class="sidebar-popover-reactivate-user popover-menu-link hidden-for-spectators" tabindex="0">
                            <i class="popover-menu-icon zulip-icon zulip-icon-user-plus" aria-hidden="true"></i>
                            {{#if is_bot}}
                                <span class="popover-menu-label">{{t "Reactivate this bot" }}</span>
                            {{else}}
                                <span class="popover-menu-label">{{t "Reactivate this user" }}</span>
                            {{/if}}
                        </a>
                    </li>
                {{/if}}
            {{/if}}
        {{/if}}
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: user_card_popover_custom_fields.hbs]---
Location: zulip-main/web/templates/popovers/user_card/user_card_popover_custom_fields.hbs

```text
{{#each profile_fields}}
    <li role="none" class="popover-menu-list-item text-item custom_user_field" data-type="{{this.type}}" data-field-id="{{this.id}}">
        {{#if this.is_link}}
            <a href="{{this.value}}" target="_blank" rel="noopener noreferrer" class="custom-profile-field-value custom-profile-field-link" data-tippy-content="{{this.name}}" tabindex="0">
                <span class="custom-profile-field-text">{{this.value}}</span>
            </a>
            <span role="menuitem" tabindex="0" class="popover-menu-link copy-button copy-custom-profile-field-link" aria-label="{{t 'Copy URL' }}" data-tippy-content="{{t 'Copy URL' }}">
                <i class="zulip-icon zulip-icon-copy" aria-hidden="true"></i>
            </span>
        {{else if this.is_external_account}}
            <a href="{{this.link}}" target="_blank" rel="noopener noreferrer" class="custom-profile-field-value custom-profile-field-link" data-tippy-content="{{this.name}}" tabindex="0">
                {{#if (eq this.subtype "github") }}
                    <i class="popover-menu-icon fa fa-github" aria-hidden="true"></i>
                {{else if (eq this.subtype "twitter") }}
                    <i class="popover-menu-icon fa fa-twitter" aria-hidden="true"></i>
                {{/if}}
                <span class="custom-profile-field-text">{{this.value}}</span>
            </a>
        {{else if this.rendered_value}}
            <div class="custom-profile-field-value rendered_markdown" data-tippy-content="{{this.name}}">
                {{rendered_markdown this.rendered_value}}
            </div>
        {{else}}
            <div class="custom-profile-field-value" data-tippy-content="{{this.name}}">
                <span class="custom-profile-field-text">{{this.value}}</span>
            </div>
        {{/if}}
    </li>
{{/each}}
```

--------------------------------------------------------------------------------

---[FILE: user_card_popover_for_unknown_user.hbs]---
Location: zulip-main/web/templates/popovers/user_card/user_card_popover_for_unknown_user.hbs

```text
<div class="popover-menu user-card-popover-actions no-auto-hide-right-sidebar-overlay" id="user_card_popover" data-simplebar data-simplebar-tab-index="-1">
    <div class="popover-menu-user-header">
        <div class="popover-menu-user-avatar-container">
            <img class="popover-menu-user-avatar" src="{{user_avatar}}" />
        </div>
        <div class="popover-menu-user-info">
            <div class="popover-menu-user-full-name text-select" data-tippy-content="{{t 'Unknown user' }}">
                {{t 'Unknown user' }}
            </div>
        </div>
    </div>
    <ul role="menu" class="popover-menu-list" data-user-id="{{user_id}}">
        <li role="separator" class="popover-menu-separator hidden-for-spectators"></li>
        <li role="none" class="popover-menu-list-item link-item">
            <a role="menuitem" href="{{ sent_by_url }}" class="narrow_to_messages_sent popover-menu-link hidden-for-spectators" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-message-square" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "View messages sent" }}</span>
            </a>
        </li>
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: account_settings.hbs]---
Location: zulip-main/web/templates/settings/account_settings.hbs

```text
<div id="account-settings" class="settings-section" data-name="account-and-privacy">
    <div class="alert" id="dev-account-settings-status"></div>
    <div class="account-settings-form">
        <div id="user_details_section">
            <h3 class="inline-block account-settings-heading">{{t "Account" }}</h3>
            <div class="alert-notification account-alert-notification" id="account-settings-status"></div>
            <form class="grid">
                {{#if user_has_email_set}}
                <div class="input-group">
                    <label class="settings-field-label {{#unless user_can_change_email}}cursor-text{{/unless}}" for="change_email_button">{{t "Email" }}</label>
                    <div class="change-email">
                        <div id="email_field_container" class="inline-block {{#unless user_can_change_email}}disabled_setting_tooltip{{/unless}}">
                            <input type="email" value="{{current_user.delivery_email}}" class="settings_text_input" disabled="disabled" />
                        </div>
                        {{> ../components/icon_button
                          id="change_email_button"
                          icon="edit"
                          intent="neutral"
                          custom_classes="tippy-zulip-delayed-tooltip"
                          hidden=(not user_can_change_email)
                          aria-label=(t "Change your email")
                          data-tippy-content=(t "Change your email")
                          }}
                    </div>
                    <div id="email-change-status"></div>
                </div>
                {{else}}
                {{! Demo organizations before the owner has configured an email address. }}
                <div class="input-group">
                    <p>
                        {{#tr}}
                            Add your email to <z-link-invite-users-help>invite other users</z-link-invite-users-help>
                            or <z-link-convert-demo-organization-help>convert to a permanent Zulip organization</z-link-convert-demo-organization-help>.
                            {{#*inline "z-link-invite-users-help"}}<a href="/help/invite-new-users" target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
                            {{#*inline "z-link-convert-demo-organization-help"}}<a href="/help/demo-organizations#convert-a-demo-organization-to-a-permanent-organization" target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
                        {{/tr}}
                    </p>
                    {{> ../components/action_button
                      id="demo_organization_add_email_button"
                      label=(t "Add email")
                      attention="quiet"
                      intent="brand"
                      }}
                </div>
                {{/if}}
            </form>

            {{#if page_params.two_fa_enabled }}
            <p for="two_factor_auth" class="inline-block title">
                {{t "Two factor authentication" }}: {{#if page_params.two_fa_enabled_user }}{{t "Enabled" }}{{else}}{{t "Disabled" }}{{/if}}
                <a target="_blank" rel="noopener noreferrer" id="two_factor_auth" href="/account/two_factor/" title="{{t 'Set up two factor authentication' }}">[{{t "Setup" }}]</a>
            </p>
            {{/if}}

            <form class="password-change-form grid">
                {{#if user_can_change_password}}
                <div>
                    <label class="settings-field-label" for="change_password">{{t "Password" }}</label>
                    <div class="input-group">
                        {{> ../components/action_button
                          label=(t "Change your password")
                          attention="quiet"
                          intent="neutral"
                          id="change_password"
                          }}
                    </div>
                </div>
                {{/if}}
            </form>

            <form class="user-self-role-change-form grid">
                <div class="input-group">
                    <label for="user-self-role-select" class="settings-field-label">
                        {{t 'Role' }}
                        {{> ../help_link_widget link="/help/user-roles" }}
                    </label>
                    <select name="user-self-role-select"
                      class="prop-element settings_select bootstrap-focus-style"
                      id="user-self-role-select"
                      data-setting-widget-type="number"
                      >
                        {{> dropdown_options_widget option_values=user_role_values}}
                    </select>
                </div>
            </form>

            <div class="input-group deactivate-buttons-group">
                <div id="deactivate_account_container" class="inline-block {{#if user_is_only_organization_owner}}disabled_setting_tooltip{{/if}}">
                    {{> ../components/action_button
                      label=(t "Deactivate account")
                      attention="quiet"
                      intent="danger"
                      id="user_deactivate_account_button"
                      disabled=user_is_only_organization_owner
                      }}
                </div>
                {{#if owner_is_only_user_in_organization}}
                    {{> ../components/action_button
                      label=(t "Deactivate organization")
                      attention="quiet"
                      intent="danger"
                      custom_classes="deactivate_realm_button"
                      }}
                {{/if}}
            </div>
        </div>

        {{> privacy_settings . for_realm_settings=false prefix="user_" read_receipts_help_icon_tooltip_text=send_read_receipts_tooltip hide_read_receipts_tooltip=realm.realm_enable_read_receipts}}

        <div id="api_key_button_box">
            <h3>{{t "API key" }}</h3>

            <div class="input-group">
                <p class="api-key-note">
                    {{#tr}}
                    An API key can be used to programmatically access a Zulip account.
                    Anyone with access to your API key has the ability to read your messages, send
                    messages on your behalf, and otherwise impersonate you on Zulip, so you should
                    guard your API key as carefully as you guard your password. <br />
                    We recommend creating bots and using the bots' accounts and API keys to access
                    the Zulip API, unless the task requires access to your account.
                    {{/tr}}
                </p>
                <div id="api_key_button_container" class="inline-block {{#unless user_has_email_set}}disabled_setting_tooltip{{/unless}}">
                    {{> ../components/action_button
                      label=(t "Manage your API key")
                      attention="quiet"
                      intent="neutral"
                      id="api_key_button"
                      disabled=(not user_has_email_set)
                      }}
                </div>
            </div>
        </div>
        <!-- Render /settings/api_key_modal.hbs after #api_key_button is clicked
        to avoid password being inserted by password manager too aggressively. -->
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: active_user_list_admin.hbs]---
Location: zulip-main/web/templates/settings/active_user_list_admin.hbs

```text
<div id="admin-active-users-list" class="user-settings-section user-or-bot-settings-section" data-user-settings-section="active">

    <div class="settings_panel_list_header">
        <h3>{{t "Users"}}</h3>
        <div class="alert-notification" id="user-field-status"></div>
        <div class="user_filters">
            {{> ../dropdown_widget widget_name=active_user_list_dropdown_widget_name}}
            {{> filter_text_input placeholder=(t 'Filter') aria_label=(t 'Filter users')}}
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
                    <th class="last_active" data-sort="last_active">{{t "Last active" }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    {{#if is_admin}}
                    <th class="actions">{{t "Actions" }}</th>
                    {{/if}}
                </tr>
            </thead>
            <tbody id="admin_users_table" class="admin_user_table"
              data-empty="{{t 'No users match your filters.' }}"></tbody>
        </table>
    </div>
    <div id="admin_page_users_loading_indicator"></div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: add_alert_word.hbs]---
Location: zulip-main/web/templates/settings/add_alert_word.hbs

```text
<form id="add-alert-word-form">
    <label for="add-alert-word-name" class="modal-field-label">{{t "Alert word" }}</label>
    <input type="text" name="alert-word-name" id="add-alert-word-name" class="required modal_text_input" maxlength=100 placeholder="{{t 'Alert word' }}" value="" />
</form>
```

--------------------------------------------------------------------------------

---[FILE: add_default_streams.hbs]---
Location: zulip-main/web/templates/settings/add_default_streams.hbs

```text
<table class="default_stream_choices_table">
    <tbody id="default-stream-choices"></tbody>
</table>
```

--------------------------------------------------------------------------------

---[FILE: add_emoji.hbs]---
Location: zulip-main/web/templates/settings/add_emoji.hbs

```text
<form id="add-custom-emoji-form">
    <div>
        <input type="file" name="emoji_file_input" class="notvisible"
          id="emoji_file_input" value="{{t 'Upload image or GIF' }}"/>
        {{> ../components/action_button
          label=(t "Clear image")
          attention="quiet"
          intent="danger"
          id="emoji_image_clear_button"
          hidden=true
          }}
        {{> ../components/action_button
          label=(t "Upload image or GIF")
          attention="quiet"
          intent="brand"
          id="emoji_upload_button"
          }}
        <div style="display: none;" id="emoji_preview_text">
            {{t "Preview:" }} <i id="emoji_placeholder_icon" class="fa fa-file-image-o" aria-hidden="true"></i><img class="emoji" id="emoji_preview_image" src=""/>
        </div>
        <div id="emoji-file-name"></div>
    </div>
    <div id="emoji_file_input_error" class="text-error"></div>
    <div class="emoji_name_input">
        <label for="emoji_name" class="modal-field-label">{{t "Emoji name" }}</label>
        <input type="text" name="name" id="emoji_name" class="modal_text_input" autocomplete="off" placeholder="{{t 'leafy green vegetable' }}" />
    </div>
</form>
```

--------------------------------------------------------------------------------

---[FILE: add_new_bot_form.hbs]---
Location: zulip-main/web/templates/settings/add_new_bot_form.hbs

```text
<form id="create_bot_form">
    <div class="new-bot-form">
        <div class="input-group">
            <label for="create_bot_type" class="modal-field-label">
                {{t "Bot type" }}
                {{> ../help_link_widget link="/help/bots-overview#bot-type" }}
            </label>
            <select name="bot_type" id="create_bot_type" class="modal_select bootstrap-focus-style">
                {{#each bot_types}}
                    <option value="{{this.type_id}}">{{this.name}}</option>
                {{/each}}
            </select>
        </div>
        <div class="input-group" id="service_name_list">
            <label for="select_service_name" class="modal-field-label">{{t "Bot"}}</label>
            <select name="service_name" id="select_service_name" class="modal_select bootstrap-focus-style">
                {{#each realm_embedded_bots}}
                    <option value="{{this.name}}">{{this.name}}</option>
                {{/each}}
            </select>
        </div>
        <div class="input-group">
            <label for="create_bot_name" class="modal-field-label">{{t "Name" }}</label>
            <input type="text" name="bot_name" id="create_bot_name" class="required modal_text_input"
              maxlength=100 placeholder="{{t 'Cookie Bot' }}" value="" />
            <div><label for="create_bot_name" generated="true" class="text-error"></label></div>
        </div>
        <div class="input-group">
            <label for="create_bot_short_name" class="modal-field-label">{{t "Bot email (a-z, 0-9, and dashes only)" }}</label>
            <input type="text" name="bot_short_name" id="create_bot_short_name" class="required bot_local_part modal_text_input"
              placeholder="{{t 'cookie' }}" value="" />
            -bot@{{ realm_bot_domain }}
            <div>
                <label for="create_bot_short_name" generated="true" class="text-error"></label>
            </div>
        </div>
        <div id="payload_url_inputbox">
            <div class="input-group">
                <label for="create_payload_url" class="modal-field-label">{{t "Endpoint URL" }}</label>
                <input type="text" name="payload_url" id="create_payload_url" class="modal_text_input"
                  maxlength=2083 placeholder="https://hostname.example.com" value="" />
                <div><label for="create_payload_url" generated="true" class="text-error"></label></div>
            </div>
            <div class="input-group">
                <label for="interface_type" class="modal-field-label">{{t "Webhook format" }}</label>
                <select name="interface_type" id="create_interface_type" class="modal_select bootstrap-focus-style">
                    <option value="1">Zulip</option>
                    <option value="2">{{t "Slack-compatible" }}</option>
                </select>
                <div><label for="create_interface_type" generated="true" class="text-error"></label></div>
            </div>
        </div>
        <div id="config_inputbox">
            {{#each realm_embedded_bots}}
                {{#each config}}
                    {{> ../embedded_bot_config_item botname=../name key=@key value=this}}
                {{/each}}
            {{/each}}
        </div>
        <div class="input-group">
            <label for="bot_avatar_file_input" class="modal-field-label">{{t "Avatar" }}</label>
            <div id="bot_avatar_file"></div>
            <input type="file" name="bot_avatar_file_input" class="notvisible" id="bot_avatar_file_input" value="{{t 'Upload avatar' }}" />
            <div id="add_bot_preview_text">
                <img id="add_bot_preview_image" />
            </div>
            {{> ../components/action_button
              label=(t "Clear avatar")
              attention="quiet"
              intent="danger"
              id="bot_avatar_clear_button"
              hidden=true
              }}
            {{> ../components/action_button
              label=(t "Upload avatar")
              attention="quiet"
              intent="neutral"
              id="bot_avatar_upload_button"
              custom_classes="inline-block"
              }}
            ({{t "Optional" }})
        </div>
        <p id="bot_avatar_file_input_error" class="text-error"></p>
    </div>
</form>
```

--------------------------------------------------------------------------------

---[FILE: add_new_custom_profile_field_form.hbs]---
Location: zulip-main/web/templates/settings/add_new_custom_profile_field_form.hbs

```text
<form class="admin-profile-field-form" id="add-new-custom-profile-field-form">
    <div class="new-profile-field-form wrapper">
        <div class="input-group">
            <label for="profile_field_type" class="modal-field-label">{{t "Type" }}</label>
            <select id="profile_field_type" name="field_type" class="modal_select bootstrap-focus-style">
                {{#each custom_profile_field_types}}
                    <option value='{{this.id}}'>{{this.name}}</option>
                {{/each}}
            </select>
        </div>
        <div class="input-group" id="profile_field_external_accounts">
            <label for="profile_field_external_accounts_type" class="modal-field-label">{{t "External account type" }}</label>
            <select id="profile_field_external_accounts_type" name="external_acc_field_type" class="modal_select bootstrap-focus-style">
                {{#each realm_default_external_accounts}}
                    <option value='{{@key}}'>{{this.text}}</option>
                {{/each}}
                <option value="custom">{{t 'Custom' }}</option>
            </select>
        </div>
        <div class="input-group">
            <label for="profile_field_name" class="modal-field-label">{{t "Label" }}</label>
            <input type="text" id="profile_field_name" class="modal_text_input" name="name" autocomplete="off" maxlength="40" />
        </div>
        <div class="input-group">
            <label for="profile_field_hint" class="modal-field-label">{{t "Hint (up to 80 characters)" }}</label>
            <input type="text" id="profile_field_hint" class="modal_text_input" name="hint" autocomplete="off" maxlength="80" />
            <div class="alert" id="admin-profile-field-hint-status"></div>
        </div>
        <div class="input-group profile-field-choices-wrapper" id="profile_field_choices_row">
            <label for="profile_field_choices" class="modal-field-label">{{t "Field choices" }}</label>
            <table class="profile_field_choices_table">
                <tbody id="profile_field_choices" class="profile-field-choices"></tbody>
            </table>
            {{> ../components/action_button
              label=(t "Alphabetize choices")
              custom_classes="alphabetize-choices-button"
              intent="neutral"
              attention="quiet"
              }}
        </div>
        <div class="input-group" id="custom_external_account_url_pattern">
            <label for="custom_field_url_pattern" class="modal-field-label">{{t "URL pattern" }}</label>
            <input type="url" id="custom_field_url_pattern" class="modal_url_input" name="url_pattern" autocomplete="off" maxlength="1024" placeholder="https://example.com/path/%(username)s"/>
        </div>
        <div class="input-group">
            <label class="checkbox profile_field_display_label" for="profile_field_display_in_profile_summary">
                <input type="checkbox" id="profile_field_display_in_profile_summary" name="display_in_profile_summary"/>
                <span class="rendered-checkbox"></span>
                {{t 'Display on user card' }}
            </label>
        </div>
        <div class="input-group">
            <label class="checkbox" for="profile-field-required">
                <input type="checkbox" id="profile-field-required" name="required"/>
                <span class="rendered-checkbox"></span>
                {{t 'Required field' }}
            </label>
        </div>
        {{> settings_checkbox
          prefix="profile_field_"
          setting_name="editable_by_user"
          is_checked=true
          label=(t "Users can edit this field for their own account")
          }}
    </div>
</form>
```

--------------------------------------------------------------------------------

---[FILE: admin_auth_methods_list.hbs]---
Location: zulip-main/web/templates/settings/admin_auth_methods_list.hbs

```text
<div class="method_row" data-method="{{method}}">
    {{> settings_checkbox
      setting_name="realm_authentication_methods"
      prefix=prefix
      is_checked=enabled
      label=method
      is_disabled=disable_configure_auth_method
      help_icon_tooltip_text=unavailable_reason
      skip_prop_element=true}}
</div>
```

--------------------------------------------------------------------------------

````
