---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 762
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 762 of 1290)

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

---[FILE: settings_overlay.hbs]---
Location: zulip-main/web/templates/settings_overlay.hbs

```text
<div id="settings_page" class="overlay-content overlay-container">
    <div class="settings-header mobile">
        <i class="fa fa-chevron-left" aria-hidden="true"></i>
        <h1>{{t "Settings" }}<span class="section"></span></h1>
        <div class="exit">
            <span class="exit-sign">&times;</span>
        </div>
    </div>
    <div class="sidebar-wrapper">
        <div class="tab-container"></div>
        <div class="sidebar left" data-simplebar data-simplebar-tab-index="-1">
            <div class="sidebar-list dark-grey small-text">
                <ul class="normal-settings-list">
                    <li class="sidebar-item" tabindex="0" data-section="profile">
                        <i class="sidebar-item-icon fa fa-user" aria-hidden="true"></i>
                        <div class="text">{{t "Profile" }}</div>
                    </li>
                    <li class="sidebar-item" tabindex="0" data-section="account-and-privacy">
                        <i class="sidebar-item-icon fa fa-lock" aria-hidden="true"></i>
                        <div class="text">{{t "Account & privacy" }}</div>
                    </li>
                    <li class="sidebar-item" tabindex="0" data-section="preferences">
                        <i class="sidebar-item-icon fa fa-sliders" aria-hidden="true"></i>
                        <div class="text">{{t "Preferences" }}</div>
                    </li>
                    <li class="sidebar-item" tabindex="0" data-section="notifications">
                        <i class="sidebar-item-icon fa fa-exclamation-triangle" aria-hidden="true"></i>
                        <div class="text">{{t "Notifications" }}</div>
                    </li>
                    {{#unless is_guest}}
                        <li class="redirected-sidebar-item" tabindex="0">
                            <a href="#organization/bots/your-bots" class="your-bots-link sidebar-item">
                                <i class="sidebar-item-icon zulip-icon zulip-icon-bot" aria-hidden="true"></i>
                                <div class="text">{{t 'Bots'}}</div>
                            </a>
                        </li>
                    {{/unless}}
                    <li class="sidebar-item" tabindex="0" data-section="alert-words">
                        <i class="sidebar-item-icon fa fa-book" aria-hidden="true"></i>
                        <div class="text">{{t "Alert words" }}</div>
                    </li>
                    {{#if show_uploaded_files_section}}
                    <li class="sidebar-item" tabindex="0" data-section="uploaded-files">
                        <i class="sidebar-item-icon fa fa-paperclip" aria-hidden="true"></i>
                        <div class="text">{{t "Uploaded files" }}</div>
                    </li>
                    {{/if}}
                    <li class="sidebar-item" tabindex="0" data-section="topics">
                        <i class="sidebar-item-icon zulip-icon zulip-icon-topic" aria-hidden="true"></i>
                        <div class="text">{{t "Topics" }}</div>
                    </li>
                    <li class="sidebar-item" tabindex="0" data-section="muted-users">
                        <i class="sidebar-item-icon fa fa-eye-slash" aria-hidden="true"></i>
                        <div class="text">{{t "Muted users" }}</div>
                    </li>
                </ul>

                <ul class="org-settings-list">
                    <li class="sidebar-item" tabindex="0" data-section="organization-profile">
                        <i class="sidebar-item-icon fa fa-id-card" aria-hidden="true"></i>
                        <div class="text">{{t "Organization profile" }}</div>
                        <i class="locked fa fa-lock tippy-zulip-tooltip" {{#if is_admin}}style="display: none;"{{/if}} data-tippy-content="{{t 'Only organization administrators can edit these settings.' }}"></i>
                    </li>
                    <li class="sidebar-item" class="collapse-org-settings {{#unless is_admin}}hide-org-settings{{/unless}}" tabindex="0" data-section="organization-settings">
                        <i class="sidebar-item-icon fa fa-sliders" aria-hidden="true"></i>
                        <div class="text">{{t "Organization settings" }}</div>
                        <i class="locked fa fa-lock tippy-zulip-tooltip" {{#if is_admin}}style="display: none;"{{/if}} data-tippy-content="{{t 'Only organization administrators can edit these settings' }}"></i>
                    </li>
                    <li class="sidebar-item" class="collapse-org-settings {{#unless is_admin}}hide-org-settings{{/unless}}" tabindex="0" data-section="organization-permissions">
                        <i class="sidebar-item-icon fa fa-lock" aria-hidden="true"></i>
                        <div class="text">{{t "Organization permissions" }}</div>
                        <i class="locked fa fa-lock tippy-zulip-tooltip" {{#if is_admin}}style="display: none;"{{/if}} data-tippy-content="{{t 'Only organization administrators can edit these settings.' }}"></i>
                    </li>
                    <li class="sidebar-item" tabindex="0" data-section="emoji-settings">
                        <i class="sidebar-item-icon fa fa-smile-o" aria-hidden="true"></i>
                        <div class="text">{{t "Custom emoji" }}</div>
                        <i class="locked fa fa-lock tippy-zulip-tooltip" {{#unless show_emoji_settings_lock}}style="display: none;"{{/unless}} data-tippy-content="{{t 'You do not have permission to add custom emoji.'}}"></i>
                    </li>
                    <li class="sidebar-item" tabindex="0" data-section="linkifier-settings">
                        <i class="sidebar-item-icon fa fa-font" aria-hidden="true"></i>
                        <div class="text">{{t "Linkifiers" }}</div>
                        <i class="locked fa fa-lock tippy-zulip-tooltip" {{#if is_admin}}style="display: none;"{{/if}} data-tippy-content="{{t 'Only organization administrators can edit these settings.' }}"></i>
                    </li>
                    <li class="sidebar-item" tabindex="0" data-section="playground-settings">
                        <i class="sidebar-item-icon fa fa-external-link" aria-hidden="true"></i>
                        <div class="text">{{t "Code playgrounds" }}</div>
                        <i class="locked fa fa-lock tippy-zulip-tooltip" {{#if is_admin}}style="display: none;"{{/if}} data-tippy-content="{{t 'Only organization administrators can edit these settings.' }}"></i>
                    </li>
                    {{#unless is_guest}}
                    <li class="sidebar-item" tabindex="0" data-section="users">
                        <i class="sidebar-item-icon fa fa-user" aria-hidden="true"></i>
                        <div class="text">{{t "Users" }}</div>
                        <i class="locked fa fa-lock tippy-zulip-tooltip" {{#if can_edit_user_panel }}style="display: none;"{{/if}} data-tippy-content="{{t 'Only organization administrators can edit these settings.' }}"></i>
                    </li>
                    {{/unless}}
                    {{#unless is_guest}}
                    <li class="sidebar-item" tabindex="0" data-section="bots">
                        <i class="sidebar-item-icon zulip-icon zulip-icon-bot" aria-hidden="true"></i>
                        <div class="text">{{t "Bots" }}</div>
                        <i class="locked fa fa-lock tippy-zulip-tooltip" {{#if can_create_new_bots}}style="display: none;"{{/if}} data-tippy-content="{{t 'Only organization administrators can edit these settings.' }}"></i>
                    </li>
                    {{/unless}}
                    {{#if is_admin}}
                    <li class="sidebar-item" tabindex="0" data-section="profile-field-settings">
                        <i class="sidebar-item-icon fa fa-id-card" aria-hidden="true"></i>
                        <div class="text">{{t "Custom profile fields" }}</div>
                    </li>
                    {{/if}}
                    <li class="sidebar-item collapse-org-settings {{#unless is_admin}}hide-org-settings{{/unless}}" tabindex="0" data-section="organization-level-user-defaults">
                        <i class="sidebar-item-icon fa fa-cog" aria-hidden="true"></i>
                        <div class="text">{{t "Default user settings" }}</div>
                        <i class="locked fa fa-lock tippy-zulip-tooltip" {{#if is_admin}}style="display: none;"{{/if}} data-tippy-content="{{t 'Only organization administrators can edit these settings.' }}"></i>
                    </li>
                    <li class="sidebar-item collapse-org-settings {{#unless is_admin}}hide-org-settings{{/unless}}" tabindex="0" data-section="channel-folders">
                        <i class="sidebar-item-icon zulip-icon zulip-icon-folder"></i>
                        <div class="text">{{t "Channel folders" }}</div>
                        <i class="locked fa fa-lock tippy-zulip-tooltip" {{#if is_admin}}style="display: none;"{{/if}} data-tippy-content="{{t 'Only organization administrators can edit these settings.' }}"></i>
                    </li>
                    {{#unless is_guest}}
                    <li class="sidebar-item collapse-org-settings {{#unless is_admin}}hide-org-settings{{/unless}}" tabindex="0" data-section="default-channels-list">
                        <i class="sidebar-item-icon fa fa-exchange" aria-hidden="true"></i>
                        <div class="text">{{t "Default channels" }}</div>
                        {{#unless is_admin}}
                        <i class="locked fa fa-lock tippy-zulip-tooltip" data-tippy-content="{{t 'Only organization administrators can edit these settings.' }}"></i>
                        {{/unless}}
                    </li>
                    {{/unless}}
                    <li class="sidebar-item collapse-org-settings {{#unless is_admin}}hide-org-settings{{/unless}}" tabindex="0" data-section="auth-methods">
                        <i class="sidebar-item-icon fa fa-key" aria-hidden="true"></i>
                        <div class="text">{{t "Authentication methods" }}</div>
                        <i class="locked fa fa-lock tippy-zulip-tooltip" {{#if is_owner}}style="display: none;"{{/if}} data-tippy-content="{{t 'Only organization owners can edit these settings.' }}"></i>
                    </li>
                    {{#if is_admin}}
                    <li class="sidebar-item" tabindex="0" data-section="data-exports-admin">
                        <i class="sidebar-item-icon fa fa-database" aria-hidden="true"></i>
                        <div class="text">{{t "Data exports" }}</div>
                    </li>
                    {{/if}}
                    {{#unless is_admin}}
                    <li class="sidebar-item collapse-settings-button">
                        <i id='toggle_collapse_chevron' class='sidebar-item-icon fa fa-angle-double-down'></i>
                        <div class="text" id='toggle_collapse'>{{t "Show more" }}</div>
                    </li>
                    {{/unless}}
                </ul>
            </div>
        </div>
    </div>
    <div class="content-wrapper right">
        <div class="settings-header">
            <h1>{{t "Settings" }}<span class="section"></span></h1>
            <div class="exit">
                <span class="exit-sign">&times;</span>
            </div>
        </div>
        <div id="settings_content" data-simplebar data-simplebar-tab-index="-1" data-simplebar-auto-hide="false">
            <div class="organization-box organization">

            </div>
            <div class="settings-box">
            </div>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: settings_tab.hbs]---
Location: zulip-main/web/templates/settings_tab.hbs

```text
<div id="settings-change-box">
    {{> settings/profile_settings . }}

    {{> settings/account_settings . }}

    {{> settings/user_preferences . }}

    {{> settings/user_notification_settings . }}

    {{> settings/alert_word_settings }}

    {{> settings/attachments_settings }}

    {{> settings/user_topics_settings }}

    {{> settings/muted_users_settings }}
</div>
```

--------------------------------------------------------------------------------

---[FILE: set_status_overlay.hbs]---
Location: zulip-main/web/templates/set_status_overlay.hbs

```text
<div class="user-status-content-wrapper">
    <div class="user-status-emoji-picker" data-tippy-content="{{t 'Select emoji' }}" aria-label="{{t 'Select emoji' }}" id="selected_emoji">
        <div class="status-emoji-wrapper" tabindex="0">
            {{> status_emoji_selector .}}
        </div>
    </div>
    <input type="text" class="user-status modal_text_input" id="user-status-input" placeholder="{{t 'Your status' }}" maxlength="60"/>
    {{> ./components/icon_button id="clear_status_message_button" squared=true intent="neutral" icon="close" }}
</div>
<ul class="user-status-options modal-options-list">
    {{#each default_status_messages_and_emoji_info}}
        <li class="user-status-option">
            <a class="modal-option-content trigger-click-on-enter user-status-value" tabindex="0">
                {{#if emoji.emoji_alt_code}}
                    <div class="emoji_alt_code">&nbsp;:{{emoji.emoji_name}}:</div>
                {{else if emoji.url}}
                    <img src="{{emoji.url}}" class="emoji status-emoji" />
                {{else}}
                    <div class="emoji status-emoji emoji-{{emoji.emoji_code}}"></div>
                {{/if}}
                <span class="status-text">{{status_text}}</span>
            </a>
        </li>
    {{/each}}
</ul>
```

--------------------------------------------------------------------------------

---[FILE: show_inactive_or_muted_channels.hbs]---
Location: zulip-main/web/templates/show_inactive_or_muted_channels.hbs

```text
<div class="stream-list-toggle-inactive-or-muted-channels bottom_left_row zoom-in-hide">
    <div class="show-inactive-or-muted-channels sidebar-topic-action-heading">
        <i class="zulip-icon zulip-icon-expand" aria-hidden="true"></i>
        <div class="stream-list-toggle-inactive-or-muted-channels-text">
            {{button_text}}
        </div>
        <div class="markers-and-unreads">
            <span class="unread_count quiet-count"></span>
            <span class="masked_unread_count">
                <i class="zulip-icon zulip-icon-masked-unread"></i>
            </span>
        </div>
    </div>
    <div class="hide-inactive-or-muted-channels sidebar-topic-action-heading">
        <i class="zulip-icon zulip-icon-collapse" aria-hidden="true"></i>
        <div class="stream-list-toggle-inactive-or-muted-channels-text">
            {{button_text}}
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: single_message.hbs]---
Location: zulip-main/web/templates/single_message.hbs

```text
<div id="message-row-{{message_list_id}}-{{msg/id}}" data-message-id="{{msg/id}}"
  class="message_row{{#unless msg/is_stream}} private-message{{/unless}}{{#if include_sender}} messagebox-includes-sender{{/if}}{{#if mention_classname}} {{mention_classname}}{{/if}}{{#if msg.unread}} unread{{/if}} {{#if msg.locally_echoed}}locally-echoed{{/if}} selectable_row {{#if is_hidden}}muted-message-sender{{/if}}"
  role="listitem">
    {{#if want_date_divider}}
    <div class="unread_marker date_unread_marker"><div class="unread-marker-fill"></div></div>
    <div class="date_row no-select">
        {{{date_divider_html}}}
    </div>
    {{/if}}
    <div class="unread_marker message_unread_marker"><div class="unread-marker-fill"></div></div>
    <div class="messagebox">
        <div class="messagebox-content {{#if status_message}}is-me-message{{/if}}">
            {{> message_body .}}
            {{!-- message_edit_form.hbs is inserted here when editing a message. --}}
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: skipped_marking_unread.hbs]---
Location: zulip-main/web/templates/skipped_marking_unread.hbs

```text
{{#tr}}
    Because you are not subscribed to <z-streams></z-streams>, messages in this channel were not marked as unread.
    {{#*inline "z-streams"}}<strong>{{{streams_html}}}</strong>{{/inline}}
{{/tr}}
```

--------------------------------------------------------------------------------

---[FILE: start_export_modal.hbs]---
Location: zulip-main/web/templates/start_export_modal.hbs

```text
<p id="allow_private_data_export_banner_container"></p>
<p>
    {{#tr}}
        A public data export is a complete data export for your organization other than
        <z-private-channel-link>private channel</z-private-channel-link> messages and
        <z-direct-messages-link>direct messages</z-direct-messages-link>.
        {{#*inline "z-private-channel-link"}}<a href="/help/channel-permissions#private-channels" target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
        {{#*inline "z-direct-messages-link"}}<a href="/help/direct-messages" target="_blank" rel="noopener noreferrer">{{> @partial-block}}</a>{{/inline}}
    {{/tr}}
</p>
<p>
    {{t 'A standard export additionally includes private data accessible to users who have allowed administrators to export their private data.' }}
</p>
<form id="start-export-form">
    <div class="input-group">
        <label for="export_type" class="modal-field-label">{{t "Export type" }}</label>
        <select id="export_type" class="modal_select bootstrap-focus-style">
            {{#each export_type_values}}
                <option {{#if this.default }}selected{{/if}} value="{{this.value}}">{{this.description}}</option>
            {{/each}}
        </select>
    </div>
    <p id="allow_private_data_export_stats"></p>
    <div id="unusable-user-accounts-warning"></div>
</form>
```

--------------------------------------------------------------------------------

---[FILE: status_emoji.hbs]---
Location: zulip-main/web/templates/status_emoji.hbs

```text
{{~#if . ~}}
{{~#if emoji_alt_code ~}}
<span class="emoji_alt_code">&nbsp;:{{emoji_name}}:</span>
{{~else if still_url ~}}
<img src="{{still_url}}" class="emoji status-emoji status-emoji-name" data-animated-url="{{url}}" data-still-url="{{still_url}}" data-tippy-content=":{{emoji_name}}:" />
{{~else if url ~}}
{{~!-- note that we have no still_url --~}}
<img src="{{url}}" class="emoji status-emoji status-emoji-name" data-animated-url="{{url}}" data-tippy-content=":{{emoji_name}}:" />
{{~else if emoji_name ~}}
<span class="emoji status-emoji status-emoji-name emoji-{{emoji_code}}" data-tippy-content=":{{emoji_name}}:"></span>
{{~/if ~}}
{{~/if ~}}
```

--------------------------------------------------------------------------------

---[FILE: status_emoji_selector.hbs]---
Location: zulip-main/web/templates/status_emoji_selector.hbs

```text
{{#if selected_emoji}}
    {{#if selected_emoji.emoji_alt_code}}
        <div class="emoji_alt_code">&nbsp;:{{selected_emoji.emoji_name}}:</div>
    {{else if selected_emoji.url}}
        <img src="{{selected_emoji.url}}" class="emoji selected-emoji" />
    {{else}}
        <div class="emoji selected-emoji emoji-{{selected_emoji.emoji_code}}"></div>
    {{/if}}
{{else}}
    <span class="smiley-icon show zulip-icon zulip-icon-smile"></span>
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: stream_list_item.hbs]---
Location: zulip-main/web/templates/stream_list_item.hbs

```text
<li class="stream-list-item" role="presentation" data-stream-id="{{stream_id}}">
    <a class="stream-row hidden-remove-button-row" href="{{stream_edit_url}}">
        <span class="stream-row-content">
            <span class="stream-privacy-original-color-{{stream_id}} stream-privacy filter-icon" style="color: {{stream_color}}">
                {{> stream_privacy . }}
            </span>
            <span class="stream-name">{{name}}</span>
        </span>
        <div class="remove-button-wrapper">
            {{#if show_unsubscribe_button}}
                {{#if show_private_stream_unsub_tooltip}}
                    {{> components/icon_button  icon="close" custom_classes="hidden-remove-button remove-button tippy-zulip-tooltip" intent="danger" aria-label=(t "Unsubscribe") data-tippy-content=(t "Use channel settings to unsubscribe from private channels.") }}
                {{else if show_last_user_in_private_stream_unsub_tooltip}}
                    {{> components/icon_button  icon="close" custom_classes="hidden-remove-button remove-button tippy-zulip-tooltip" intent="danger" aria-label=(t "Unsubscribe") data-tippy-content=(t "Use channel settings to unsubscribe the last user from a private channel.") }}
                {{else}}
                    {{> components/icon_button  icon="close" custom_classes="hidden-remove-button remove-button tippy-zulip-delayed-tooltip" intent="danger" aria-label=(t "Unsubscribe") data-tippy-content=(t "Unsubscribe") }}
                {{/if}}
            {{/if}}
            {{#if show_remove_channel_from_folder}}
                {{> components/icon_button  icon="close" custom_classes="hidden-remove-button remove-button tippy-zulip-delayed-tooltip" intent="danger" aria-label=(t "Remove channel") data-tippy-content=(t "Remove channel") }}
            {{/if}}
        </div>
    </a>
</li>
```

--------------------------------------------------------------------------------

---[FILE: stream_list_section_container.hbs]---
Location: zulip-main/web/templates/stream_list_section_container.hbs

```text
<div id="stream-list-{{id}}-container" data-section-id="{{id}}" class="stream-list-section-container">
    <div class="stream-list-subsection-header zoom-in-hide">
        <i class="stream-list-section-toggle zulip-icon zulip-icon-heading-triangle-right rotate-icon-down" aria-hidden="true"></i>
        <h4 class="left-sidebar-title">
            {{section_title}}
        </h4>
        {{#if plus_icon_url}}
        <a href="{{plus_icon_url}}" class="add-stream-tooltip add-stream-icon-container hidden-for-spectators" data-tippy-content="{{t 'Create a channel' }}">
            <i class="add_stream_icon zulip-icon zulip-icon-square-plus" aria-hidden="true" ></i>
        </a>
        {{/if}}
        <div class="markers-and-unreads">
            <span class="unread_mention_info"></span>
            <span class="unread_count normal-count"></span>
            <span class="masked_unread_count">
                <i class="zulip-icon zulip-icon-masked-unread"></i>
            </span>
        </div>
    </div>
    <ul id="stream-list-{{id}}" class="stream-list-section"></ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: stream_privacy.hbs]---
Location: zulip-main/web/templates/stream_privacy.hbs

```text
{{! This controls whether the swatch next to streams in the left sidebar has a lock icon. }}
{{#if is_archived}}
<i class="zulip-icon zulip-icon-archive" aria-hidden="true"></i>
{{else if invite_only}}
<i class="zulip-icon zulip-icon-lock" aria-hidden="true"></i>
{{else if is_web_public}}
<i class="zulip-icon zulip-icon-globe" aria-hidden="true"></i>
{{else}}
<i class="zulip-icon zulip-icon-hashtag" aria-hidden="true"></i>
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: stream_sidebar_row.hbs]---
Location: zulip-main/web/templates/stream_sidebar_row.hbs

```text
{{! Stream sidebar rows }}

<li class="narrow-filter{{#if is_muted}} out_of_home_view{{/if}}" data-stream-id="{{id}}">
    <div class="bottom_left_row">
        <a href="{{url}}" class="subscription_block selectable_sidebar_block" draggable="false">

            <span class="stream-privacy-original-color-{{id}} stream-privacy filter-icon" style="color: {{color}}">
                {{> stream_privacy . }}
            </span>

            <span class="stream-name">{{name}}</span>

            <div class="left-sidebar-controls">
                {{#if can_post_messages}}
                <div class="channel-new-topic-button tippy-zulip-tooltip hidden-for-spectators auto-hide-left-sidebar-overlay" data-tippy-content="{{#if (or is_empty_topic_only_channel cannot_create_topics_in_channel)}}{{t 'New message'}}{{else}}{{t 'New topic'}}{{/if}}" data-stream-id="{{id}}">
                    <i class="channel-new-topic-icon zulip-icon zulip-icon-square-plus" aria-hidden="true"></i>
                </div>
                {{/if}}
            </div>

            <div class="stream-markers-and-unreads">
                <span class="unread_mention_info"></span>
                <span class="unread_count normal-count"></span>
                <span class="masked_unread_count">
                    <i class="zulip-icon zulip-icon-masked-unread"></i>
                </span>
            </div>

            <span class="sidebar-menu-icon stream-sidebar-menu-icon"><i class="zulip-icon zulip-icon-more-vertical" aria-hidden="true"></i></span>
        </a>
    </div>
</li>
```

--------------------------------------------------------------------------------

---[FILE: stream_topic_widget.hbs]---
Location: zulip-main/web/templates/stream_topic_widget.hbs

```text
<strong>
    <span class="stream">{{stream_name}}</span> &gt; <span class="topic white-space-preserve-wrap {{#if is_empty_string_topic}}empty-topic-display{{/if}}">{{topic_display_name}}</span>
</strong>
```

--------------------------------------------------------------------------------

---[FILE: subscribe_to_more_streams.hbs]---
Location: zulip-main/web/templates/subscribe_to_more_streams.hbs

```text
{{#if exactly_one_unsubscribed_stream}}
    <a class="subscribe-more-link" href="#channels/available">
        <i class="subscribe-more-icon zulip-icon zulip-icon-browse-channels" aria-hidden="true" ></i>
        <span class="subscribe-more-label">{{~t "BROWSE 1 MORE CHANNEL" ~}}</span>
    </a>
{{else if can_subscribe_stream_count}}
    <a class="subscribe-more-link" href="#channels/available">
        <i class="subscribe-more-icon zulip-icon zulip-icon-browse-channels" aria-hidden="true" ></i>
        <span class="subscribe-more-label">{{~t "BROWSE {can_subscribe_stream_count} MORE CHANNELS" ~}}</span>
    </a>
{{else if can_create_streams}}
    <a class="subscribe-more-link" href="#channels/new">
        <i class="subscribe-more-icon zulip-icon zulip-icon-browse-channels" aria-hidden="true" ></i>
        <span class="subscribe-more-label">{{~t "CREATE A CHANNEL" ~}}</span>
    </a>
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: tenor_gif.hbs]---
Location: zulip-main/web/templates/tenor_gif.hbs

```text
<img src="{{preview_url}}" data-insert-url="{{insert_url}}" class="tenor-gif" tabindex="0" loading="lazy" data-gif-index="{{gif_index}}"/>
```

--------------------------------------------------------------------------------

---[FILE: todo_modal_task.hbs]---
Location: zulip-main/web/templates/todo_modal_task.hbs

```text
<li class="option-row">
    <i class="zulip-icon zulip-icon-grip-vertical drag-icon"></i>
    <input type="text" class="todo-input modal_text_input" placeholder="{{t 'New task'}}" />
    <div class="todo-description-container">
        <input type="text" class="todo-description-input modal_text_input" disabled="true" placeholder="{{t 'Task description (optional)'}}" />
    </div>
    {{> ./components/icon_button intent="danger" custom_classes="delete-option" icon="trash" aria-label=(t "Delete") }}
</li>
```

--------------------------------------------------------------------------------

---[FILE: tooltip_templates.hbs]---
Location: zulip-main/web/templates/tooltip_templates.hbs

```text
<template id="view-user-card-tooltip-template">
    {{t 'View user card' }}
    {{tooltip_hotkey_hints "U"}}
</template>
<template id="view-bot-card-tooltip-template">
    {{t 'View bot card' }}
    {{tooltip_hotkey_hints "U"}}
</template>
<template id="scroll-to-bottom-button-tooltip-template">
    {{t 'Scroll to bottom' }}
    {{tooltip_hotkey_hints "End"}}
</template>
<template id="compose_disable_stream_reply_button_tooltip_template">
    {{t 'You do not have permission to post in this channel.' }}
</template>
<template id="compose_reply_message_button_tooltip_template">
    {{t 'Reply to selected message' }}
    {{tooltip_hotkey_hints "R"}}
</template>
<template id="compose_reply_selected_topic_button_tooltip_template">
    {{t 'Reply to selected conversation' }}
    {{tooltip_hotkey_hints "R"}}
</template>
<template id="left_bar_compose_mobile_button_tooltip_template">
    {{t 'Start new conversation' }}
</template>
<template id="new_topic_message_button_tooltip_template">
    {{t 'New topic' }}
    {{tooltip_hotkey_hints "C"}}
</template>
<template id="new_message_button_tooltip_template">
    {{t 'New message'}}
    {{tooltip_hotkey_hints "C"}}
</template>
<template id="new_stream_message_button_tooltip_template">
    {{t 'New channel message' }}
    {{tooltip_hotkey_hints "C"}}
</template>
<template id="new_direct_message_button_tooltip_template">
    {{t 'New direct message' }}
    {{tooltip_hotkey_hints "X"}}
</template>
<template id="compose_close_tooltip_template">
    {{t 'Cancel compose' }}
    {{tooltip_hotkey_hints "Esc"}}
</template>
<template id="compose_close_and_save_tooltip_template">
    {{t 'Cancel compose and save draft' }}
    {{tooltip_hotkey_hints "Esc"}}
</template>
<template id="send-enter-tooltip-template">
    {{t 'Send' }}
    {{tooltip_hotkey_hints "Enter"}}
</template>
<template id="send-ctrl-enter-tooltip-template">
    {{t 'Send' }}
    {{tooltip_hotkey_hints "Ctrl" "Enter"}}
</template>
<template id="preview-tooltip">
    {{t 'Preview mode' }}
    {{tooltip_hotkey_hints "Alt" "P"}}
</template>
<template id="exit-preview-tooltip">
    {{t 'Exit preview mode' }}
    {{tooltip_hotkey_hints "Alt" "P"}}
</template>
<template id="add-global-time-tooltip">
    <div>
        <div>{{t "Add global time" }}</div>
        <div class="tooltip-inner-content italic">{{t "Everyone sees global times in their own time zone." }}</div>
    </div>
</template>
<template id="add-poll-tooltip">
    <div>
        <span>{{t "Add poll" }}</span><br/>
        <span class="tooltip-inner-content italic">{{t "A poll must be an entire message." }}</span>
    </div>
</template>
<template id="add-todo-tooltip">
    <div>
        <span>{{t "Add to-do list" }}</span><br/>
        <span class="tooltip-inner-content italic">{{t "A to-do list must be an entire message." }}</span>
    </div>
</template>
<template id="add-saved-snippet-tooltip">
    {{t "Add saved snippet" }}
    {{tooltip_hotkey_hints "Ctrl" "'"}}
</template>
<template id="link-tooltip">
    {{t 'Link' }}
    {{tooltip_hotkey_hints "Ctrl" "Shift" "L"}}
</template>
<template id="bold-tooltip">
    {{t 'Bold' }}
    {{tooltip_hotkey_hints "Ctrl" "B"}}
</template>
<template id="italic-tooltip">
    {{t 'Italic' }}
    {{tooltip_hotkey_hints "Ctrl" "I"}}
</template>
<template id="code-tooltip">
    {{t 'Code' }}
    {{tooltip_hotkey_hints "Ctrl" "Shift" "C"}}
</template>
<template id="delete-draft-tooltip-template">
    {{t 'Delete draft' }}
    {{tooltip_hotkey_hints "Backspace"}}
</template>
<template id="gear-menu-tooltip-template">
    {{t 'Main menu' }}
    {{tooltip_hotkey_hints "G"}}
</template>
<template id="personal-menu-tooltip-template">
    {{t 'Personal menu' }}
    {{tooltip_hotkey_hints "G" "→"}}
</template>
<template id="help-menu-tooltip-template">
    {{t 'Help menu' }}
    {{tooltip_hotkey_hints "G" "←"}}
</template>
<template id="automatic-theme-template">
    <div>
        <div>{{t "Automatic theme" }}</div>
        <div class="tooltip-inner-content italic">{{t "Follows system settings." }}</div>
    </div>
</template>
<template id="all-message-tooltip-template">
    <div class="views-tooltip-container" data-view-code="all_messages">
        <div>{{t 'Combined feed' }}</div>
        <div class="tootlip-inner-content views-message-count italic hidden-for-spectators"></div>
        <div class="tooltip-inner-content views-tooltip-home-view-note italic hide">{{t 'This is your home view.' }}</div>
    </div>
    {{tooltip_hotkey_hints "A"}}
</template>
<template id="recent-conversations-tooltip-template">
    <div class="views-tooltip-container" data-view-code="recent_topics">
        <div>{{t 'Recent conversations' }}</div>
        <div class="tootlip-inner-content views-message-count italic hidden-for-spectators"></div>
        <div class="tooltip-inner-content views-tooltip-home-view-note italic hide hidden-for-spectators">{{t 'This is your home view.' }}</div>
    </div>
    {{tooltip_hotkey_hints "T"}}
</template>
<template id="starred-message-tooltip-template">
    <div class="views-tooltip-container" data-view-code="starred_message">
        <div>{{t 'Starred messages' }}</div>
        <div class="tootlip-inner-content views-message-count italic"></div>
    </div>
    {{tooltip_hotkey_hints "*"}}
</template>
<template id="my-reactions-tooltip-template">
    <div class="views-tooltip-container" data-view-code="recent_topics">
        <div>{{t 'Reactions to your messages' }}</div>
    </div>
</template>
<template id="inbox-tooltip-template">
    <div class="views-tooltip-container" data-view-code="inbox">
        <div>{{t 'Inbox' }}</div>
        <div class="tootlip-inner-content views-message-count italic"></div>
        <div class="tooltip-inner-content views-tooltip-home-view-note italic hide">{{t 'This is your home view.' }}</div>
    </div>
    {{tooltip_hotkey_hints "Shift" "I"}}
</template>
<template id="drafts-tooltip-template">
    <div class="views-tooltip-container" data-view-code="drafts">
        <div>{{t 'Drafts' }}</div>
        <div class="tootlip-inner-content views-message-count italic"></div>
    </div>
    {{tooltip_hotkey_hints "D"}}
</template>
<template id="scheduled-tooltip-template">
    <div class="views-tooltip-container" data-view-code="scheduled_message">
        <div>{{t 'Scheduled messages'}}</div>
        <div class="tootlip-inner-content views-message-count italic"></div>
    </div>
</template>
<template id="reminders-tooltip-template">
    <div class="views-tooltip-container" data-view-code="reminders">
        <div>{{t 'Reminders'}}</div>
        <div class="tootlip-inner-content views-message-count italic"></div>
    </div>
</template>
<template id="show-all-direct-messages-template">
    {{t 'Direct message feed' }}
    {{tooltip_hotkey_hints "Shift" "P"}}
</template>
<template id="mentions-tooltip-template">
    <div class="views-tooltip-container" data-view-code="mentions">
        <div>{{t 'Mentions' }}</div>
        <div class="tootlip-inner-content views-message-count italic"></div>
    </div>
</template>
<template id="message-expander-tooltip-template">
    {{t 'Show more' }}
    {{tooltip_hotkey_hints "-"}}
</template>
<template id="message-condenser-tooltip-template">
    {{t 'Show less' }}
    {{tooltip_hotkey_hints "-"}}
</template>
<template id="edit-content-tooltip-template">
    {{t "Edit message" }}
    {{tooltip_hotkey_hints "E"}}
</template>
<template id="move-message-tooltip-template">
    {{t "Move message" }}
    {{tooltip_hotkey_hints "M"}}
</template>
<template id="add-emoji-tooltip-template">
    {{t "Add emoji reaction" }}
    {{tooltip_hotkey_hints ":"}}
</template>
<template id="message-actions-tooltip-template">
    {{t "Message actions" }}
    {{tooltip_hotkey_hints "I"}}
</template>
<template id="dismiss-failed-send-button-tooltip-template">
    <div>
        <div>{{t "Dismiss failed message" }}</div>
        <div class="italic tooltip-inner-content">
            {{t "This content remains saved in your drafts." }}
        </div>
    </div>
</template>
<template id="slow-send-spinner-tooltip-template">
    <div>
        <div>{{t "Sending…" }}</div>
        <div class="italic">
            {{t "This message will remain saved in your drafts until it is successfully sent." }}
        </div>
    </div>
</template>
<template id="star-message-tooltip-template">
    <div class="starred-status">{{t "Star this message" }}</div>
    {{tooltip_hotkey_hints "Ctrl" "S"}}
</template>
<template id="unstar-message-tooltip-template">
    <div class="starred-status">{{t "Unstar this message" }}</div>
    {{tooltip_hotkey_hints "Ctrl" "S"}}
</template>
<template id="search-query-tooltip-template">
    {{t 'Search' }}
    {{tooltip_hotkey_hints "/"}}
</template>
<template id="show-left-sidebar-tooltip-template" >
    {{t 'Show left sidebar' }}
    {{tooltip_hotkey_hints "Q"}}
</template>
<template id="hide-left-sidebar-tooltip-template" >
    {{t 'Hide left sidebar' }}
</template>
<template id="show-userlist-tooltip-template">
    {{t 'Show user list' }}
    {{tooltip_hotkey_hints "W"}}
</template>
<template id="hide-userlist-tooltip-template">
    {{t 'Hide user list' }}
</template>
<template id="topic-unmute-tooltip-template">
    {{t "Unmute topic" }}
    {{tooltip_hotkey_hints "Shift" "M"}}
</template>
<template id="topic-mute-tooltip-template">
    {{t "Mute topic" }}
    {{tooltip_hotkey_hints "Shift" "M"}}
</template>
<template id="delete-scheduled-message-tooltip-template">
    {{t 'Delete scheduled message' }}
    {{tooltip_hotkey_hints "Backspace"}}
</template>
<template id="delete-reminder-tooltip-template">
    {{t 'Delete reminder' }}
    {{tooltip_hotkey_hints "Backspace"}}
</template>
<template id="create-new-stream-tooltip-template">
    {{t 'Create new channel' }}
    {{tooltip_hotkey_hints "N"}}
</template>
<template id="show-subscribe-tooltip-template">
    {{t 'Subscribe to this channel' }}
    {{tooltip_hotkey_hints "Shift" "S"}}
</template>
<template id="show-unsubscribe-tooltip-template">
    {{t 'Unsubscribe from this channel' }}
    {{tooltip_hotkey_hints "Shift" "S"}}
</template>
<template id="view-stream-tooltip-template">
    {{t 'View channel' }}
    {{tooltip_hotkey_hints "Shift" "V"}}
</template>
<template id="mobile-push-notification-tooltip-template">
    {{t 'Mobile push notifications are not enabled on this server.' }}
</template>
<template id="color-picker-confirm-button-tooltip-template">
    {{t 'Confirm new color' }}
</template>
<template id="save-button-tooltip-template">
    {{t 'Save' }}
</template>
<template id="cancel-button-tooltip-template">
    {{t 'Cancel' }}
</template>
<template id="filter-left-sidebar-tooltip-template">
    {{t 'Filter left sidebar' }}
    {{tooltip_hotkey_hints "Q"}}
</template>
<template id="inbox-channel-mute-toggle-tooltip-template">
    <div>
        <div>{{t "You have muted this channel." }}</div>
        <div class="italic">
            {{t "Click to unmute this channel." }}
        </div>
    </div>
</template>
```

--------------------------------------------------------------------------------

---[FILE: topics_not_allowed_error.hbs]---
Location: zulip-main/web/templates/topics_not_allowed_error.hbs

```text
{{#tr}}
    Only the <z-empty-string-topic-display-name></z-empty-string-topic-display-name> topic is allowed in this channel.
    {{#*inline "z-empty-string-topic-display-name"}}<span class="empty-topic-display">{{empty_string_topic_display_name}}</span>{{/inline}}
{{/tr}}
```

--------------------------------------------------------------------------------

---[FILE: topics_required_error_message.hbs]---
Location: zulip-main/web/templates/topics_required_error_message.hbs

```text
{{#tr}}
    Sending messages to the <z-empty-string-topic-display-name></z-empty-string-topic-display-name> topic is not allowed in this channel.
    {{#*inline "z-empty-string-topic-display-name"}}<span class="empty-topic-display">{{empty_string_topic_display_name}}</span>{{/inline}}
{{/tr}}
```

--------------------------------------------------------------------------------

````
