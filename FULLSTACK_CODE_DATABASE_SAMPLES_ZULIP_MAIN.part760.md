---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 760
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 760 of 1290)

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

---[FILE: message_reactions.hbs]---
Location: zulip-main/web/templates/message_reactions.hbs

```text
<div class="message_reactions">
    {{#each this/msg/message_reactions}}
        {{> message_reaction . is_archived=../is_archived}}
    {{/each}}
    {{#unless is_archived}}
        <div class="reaction_button" role="button" aria-haspopup="true" data-tooltip-template-id="add-emoji-tooltip-template" aria-label="{{t 'Add emoji reaction' }} (:)">
            <div class="emoji-message-control-button-container">
                <i class="zulip-icon zulip-icon-smile" tabindex="0"></i>
                <div class="message_reaction_count">+</div>
            </div>
        </div>
    {{/unless}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: message_reminders.hbs]---
Location: zulip-main/web/templates/message_reminders.hbs

```text
<div class="message-reminders">
    {{#each this/msg/reminders}}
        <p class="message-reminder">
            {{#tr}}
                <z-link>Reminder</z-link> scheduled for {formatted_delivery_time}.
                {{#*inline "z-link"~}}
                    <a href="#reminders" class="message-reminder-overlay-link" data-reminder-id="{{ this/reminder_id }}">
                        {{> @partial-block}}
                    </a>
                {{~/inline}}
            {{/tr}}
        </p>
    {{/each}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: message_view_header.hbs]---
Location: zulip-main/web/templates/message_view_header.hbs

```text
{{#if stream_settings_link}}
<a class="message-header-stream-settings-button tippy-zulip-tooltip" data-tooltip-template-id="stream-details-tooltip-template" data-tippy-placement="bottom" href="{{stream_settings_link}}">
    {{> navbar_icon_and_title . }}
</a>
<template id="stream-details-tooltip-template">
    <div>
        <div>{{t "Go to channel settings" }}</div>
        {{#unless is_spectator}}
        <div class="tooltip-inner-content italic">
            {{t "This channel has {sub_count, plural, =0 {no subscribers} one {# subscriber} other {# subscribers}}." }}
        </div>
        {{/unless}}
    </div>
</template>
<span class="narrow_description rendered_markdown single-line-rendered-markdown">
    {{#if rendered_narrow_description}}
    {{rendered_markdown rendered_narrow_description}}
    {{else}}
    {{#if is_admin}}
    <a href="{{stream_settings_link}}">
        {{t "Add a description"}}
    </a>
    {{/if}}
    {{/if}}
</span>
{{else}}
<span class="navbar_title">
    {{> navbar_icon_and_title . }}
</span>
{{#if description}}
    <span class="narrow_description rendered_markdown single-line-rendered-markdown">{{description}}
        {{#if link}}
        <a class="help_link_widget" href="{{link}}" target="_blank" rel="noopener noreferrer">
            <i class="fa fa-question-circle-o" aria-hidden="true"></i>
        </a>
        {{/if}}
    </span>
{{/if}}
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: more_pms.hbs]---
Location: zulip-main/web/templates/more_pms.hbs

```text
<li id="show-more-direct-messages" class="dm-list-item dm-box bottom_left_row {{#unless more_conversations_unread_count}}zero-dm-unreads{{/unless}}">
    <a class="dm-name trigger-click-on-enter" tabindex="0">{{t "more conversations" }}</a>
    <span class="unread_count {{#unless more_conversations_unread_count}}zero_count{{/unless}}">
        {{more_conversations_unread_count}}
    </span>
</li>
```

--------------------------------------------------------------------------------

---[FILE: more_topics.hbs]---
Location: zulip-main/web/templates/more_topics.hbs

```text
<li class="topic-list-item show-more-topics bottom_left_row
  {{#unless more_topics_unreads}}zero-topic-unreads{{/unless}}
  {{#if more_topics_unread_count_muted}}more_topic_unreads_muted_only{{/if}}">
    <div class="topic-box">
        <a href="" class="sidebar-topic-action-heading" tabindex="0">{{t "Show all topics" }}</a>
        <div class="topic-markers-and-unreads">
            {{#if more_topics_have_unread_mention_messages}}
                <span class="unread_mention_info">
                    @
                </span>
            {{/if}}
            <span class="unread_count normal-count {{#unless more_topics_unreads}}zero_count{{/unless}}">
                {{more_topics_unreads}}
            </span>
        </div>
    </div>
</li>
```

--------------------------------------------------------------------------------

---[FILE: more_topics_spinner.hbs]---
Location: zulip-main/web/templates/more_topics_spinner.hbs

```text
<li class="searching-for-more-topics">
    <img src="../images/loading/loading-ellipsis.svg" alt="" />
</li>
```

--------------------------------------------------------------------------------

---[FILE: move_topic_to_stream.hbs]---
Location: zulip-main/web/templates/move_topic_to_stream.hbs

```text
<form id="move_topic_form">
    <div class="move_topic_warning_container"></div>
    <div class="topic_stream_edit_header">
        {{#unless only_topic_edit}}
        <div class="input-group">
            <label class="modal-field-label">{{t "New channel" }}</label>
            {{> dropdown_widget_wrapper widget_name="move_topic_to_stream"}}
        </div>
        {{/unless}}
        <div class="input-group">
            <label for="move-topic-new-topic-name" class="modal-field-label">{{t "New topic" }}</label>
            <div id="move-topic-new-topic-input-wrapper">
                <input id="move-topic-new-topic-name" name="new_topic_name" type="text" class="move_messages_edit_topic modal_text_input" autocomplete="off" value="{{topic_name}}" {{#if disable_topic_input}}disabled{{/if}} maxlength="{{ max_topic_length }}"/>
                <span class="move-topic-new-topic-placeholder placeholder">
                    {{> topic_not_mandatory_placeholder_text empty_string_topic_display_name=empty_string_topic_display_name}}
                </span>
                <button type="button" id="clear_move_topic_new_topic_name" class="clear_search_button">
                    <i class="zulip-icon zulip-icon-close"></i>
                </button>
            </div>
            <div class="new-topic-name-error"></div>
        </div>
        <input name="old_topic_name" type="hidden" value="{{topic_name}}" />
        <input name="current_stream_id" type="hidden" value="{{current_stream_id}}" />
        {{#if from_message_actions_popover}}
        <div class="input-group">
            <label for="message_move_select_options">{{t "Which messages should be moved?"}}</label>
            <select name="propagate_mode" id="message_move_select_options" class="message_edit_topic_propagate modal_select bootstrap-focus-style">
                <option value="change_one" {{#if (eq message_placement "last")}}selected{{/if}}> {{t "Move only this message" }}</option>
                <option value="change_later" {{#if (eq message_placement "intermediate")}}selected{{/if}}> {{t "Move this and all following messages in this topic" }}</option>
                <option value="change_all" {{#if (eq message_placement "first")}}selected{{/if}}> {{t "Move all messages in this topic" }}</option>
            </select>
        </div>
        {{/if}}
        <p id="move_messages_count"></p>
        <div class="topic_move_breadcrumb_messages">
            <label class="checkbox">
                <input class="send_notification_to_new_thread" name="send_notification_to_new_thread" type="checkbox" {{#if notify_new_thread}}checked="checked"{{/if}} />
                <span class="rendered-checkbox"></span>
                {{t "Send automated notice to new topic" }}
            </label>
            <label class="checkbox">
                <input class="send_notification_to_old_thread" name="send_notification_to_old_thread" type="checkbox" {{#if notify_old_thread}}checked="checked"{{/if}} />
                <span class="rendered-checkbox"></span>
                {{t "Send automated notice to old topic" }}
            </label>
        </div>
    </div>
</form>
```

--------------------------------------------------------------------------------

---[FILE: muted_user_ui_row.hbs]---
Location: zulip-main/web/templates/muted_user_ui_row.hbs

```text
{{#with muted_user}}
<tr data-user-id="{{user_id}}" data-user-name="{{user_name}}" data-date-muted="{{date_muted_str}}">
    <td>{{user_name}}</td>
    <td>{{date_muted_str}}</td>
    <td class="actions">
        {{#if can_unmute}}
        {{> ./components/action_button
          label=(t "Unmute")
          attention="quiet"
          intent="danger"
          custom_classes="settings-unmute-user"
          }}
        {{/if}}
    </td>
</tr>
{{/with}}
```

--------------------------------------------------------------------------------

---[FILE: narrow_tooltip.hbs]---
Location: zulip-main/web/templates/narrow_tooltip.hbs

```text
{{content}}
{{tooltip_hotkey_hints "S"}}
```

--------------------------------------------------------------------------------

---[FILE: narrow_tooltip_list_of_topics.hbs]---
Location: zulip-main/web/templates/narrow_tooltip_list_of_topics.hbs

```text
{{content}}
{{tooltip_hotkey_hints "Y"}}
```

--------------------------------------------------------------------------------

---[FILE: narrow_to_compose_recipients_tooltip.hbs]---
Location: zulip-main/web/templates/narrow_to_compose_recipients_tooltip.hbs

```text
<div>
    <div>{{t "Go to conversation"}}</div>
    {{#if display_current_view}}
        <div class="tooltip-inner-content italic">{{display_current_view}}</div>
    {{/if}}
</div>
{{tooltip_hotkey_hints "Ctrl" "."}}
```

--------------------------------------------------------------------------------

---[FILE: navbar.hbs]---
Location: zulip-main/web/templates/navbar.hbs

```text
<div class="header">
    <nav class="header-main" id="top_navbar">
        <div class="column-left">
            <a class="header-button left-sidebar-toggle-button {{#if embedded}}hide-streamlist-toggle-visibility{{/if}}" tabindex="0" role="button">
                <i class="zulip-icon zulip-icon-panel-left-dashed"></i>
                <i class="zulip-icon zulip-icon-panel-left"></i>
                <span class="left-sidebar-toggle-unreadcount"></span>
            </a>
            <a href="" class="brand no-style">
                <img id="realm-navbar-wide-logo" src="" alt="" class="nav-logo no-drag"/>
            </a>
        </div>
        <div class="column-middle" id="navbar-middle">
            <div class="column-middle-inner">
                <div id="streamlist-toggle" class="tippy-zulip-delayed-tooltip {{#if embedded}}hide-streamlist-toggle-visibility{{/if}}" data-tooltip-template-id="show-left-sidebar-tooltip-template">
                    <a class="left-sidebar-toggle-button" role="button" tabindex="0">
                        <i class="zulip-icon zulip-icon-panel-left-dashed"></i>
                        <i class="zulip-icon zulip-icon-panel-left"></i>
                        <span class="left-sidebar-toggle-unreadcount"></span>
                    </a>
                </div>
                <div class="top-navbar-container">
                    <div id="message_view_header" class="notdisplayed">
                    </div>
                    <div id="searchbox">
                        <form id="searchbox_form" class="navbar-search">
                            <div id="searchbox-input-container" class="input-append pill-container">
                                <i class="search_icon zulip-icon zulip-icon-search"></i>
                                <div class="search-input-and-pills">
                                    <div class="search-input input input-block-level home-page-input" id="search_query" type="text" data-placeholder-text="{{t 'Search' }}"
                                      autocomplete="off" contenteditable="true"></div>
                                </div>
                                <button class="search_close_button tippy-zulip-delayed-tooltip" type="button" id="search_exit" aria-label="{{t 'Exit search' }}" data-tippy-content="Close"><i class="zulip-icon zulip-icon-close" aria-hidden="true"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="column-right">
            <div class="spectator_login_buttons only-visible-for-spectators">
                <a id="login_button" class="login_button navbar-item" tabindex="0">
                    {{t 'Log in' }}
                </a>
            </div>
            <div id="help-menu" class="navbar-item">
                <a class="header-button tippy-zulip-delayed-tooltip" tabindex="0" role="button" data-tooltip-template-id="help-menu-tooltip-template">
                    <i class="zulip-icon zulip-icon-help-bigger" aria-hidden="true"></i>
                </a>
            </div>
            <div id="gear-menu" class="{{#if embedded}}hide-navbar-buttons-visibility{{/if}} navbar-item">
                <a id="settings-dropdown" tabindex="0" role="button" class="header-button tippy-zulip-delayed-tooltip" data-tooltip-template-id="gear-menu-tooltip-template">
                    <i class="zulip-icon zulip-icon-gear" aria-hidden="true"></i>
                </a>
            </div>
            <div id="personal-menu" class="hidden-for-spectators navbar-item">
                <a class="header-button tippy-zulip-delayed-tooltip" tabindex="0" role="button" data-tooltip-template-id="personal-menu-tooltip-template">
                    <div class="header-button-avatar">
                        <img class="header-button-avatar-image" src="{{user_avatar}}"/>
                    </div>
                </a>
            </div>
            <div class="spectator_narrow_login_button only-visible-for-spectators" data-tippy-content="{{t 'Log in' }}" data-tippy-placement="bottom">
                <a id="login_button" class="header-button login_button navbar-item" tabindex="0">
                    <i class="zulip-icon zulip-icon-log-in-navbar"></i>
                </a>
            </div>
            <div id="userlist-toggle" class="hidden-for-spectators">
                <a id="userlist-toggle-button" role="button" class="header-button navbar-item" tabindex="0">
                    <i class="zulip-icon zulip-icon-user-list"></i>
                </a>
            </div>
        </div>
    </nav>
</div>
```

--------------------------------------------------------------------------------

---[FILE: navbar_icon_and_title.hbs]---
Location: zulip-main/web/templates/navbar_icon_and_title.hbs

```text
{{#if zulip_icon}}
<i class="navbar-icon zulip-icon zulip-icon-{{zulip_icon}}" aria-hidden="true"></i>
{{else if icon}}
<i class="navbar-icon fa fa-{{icon}}" aria-hidden="true"></i>
{{/if}}
{{#if title}}
<span class="message-header-navbar-title">{{title}}</span>
{{/if}}
{{#if title_html}}
<span class="message-header-navbar-title">{{{title_html}}}</span>
{{/if}}
{{#if stream}}
    {{#if stream.is_archived}}
    <span class="message-header-archived">
        <i class="archived-indicator">({{t 'archived' }})</i>
    </span>
    {{/if}}
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: navigation_tour_video_modal.hbs]---
Location: zulip-main/web/templates/navigation_tour_video_modal.hbs

```text
<p>{{t "Learn where to find everything you need to get started with this 2-minute video tour."}}</p>
<div id="navigation-tour-video-wrapper">
    <video id="navigation-tour-video" controls poster="{{poster_src}}">
        <source src="{{video_src}}" type="video/mp4"/>
    </video>
    <div id="navigation-tour-video-ended-button-wrapper">
        <button id="navigation-tour-video-ended-button" class="action-button-primary-brand">{{t "Let's go!"}}</button>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: org_logo_tooltip.hbs]---
Location: zulip-main/web/templates/org_logo_tooltip.hbs

```text
<div>
    <div>{{t "Go to home view"}} ({{home_view}})</div>
</div>
{{#if escape_navigates_to_home_view}}
    {{tooltip_hotkey_hints "Esc"}}
{{else}}
    {{tooltip_hotkey_hints "Ctrl" "["}}
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: pm_list_item.hbs]---
Location: zulip-main/web/templates/pm_list_item.hbs

```text
<li class="{{#if is_active}}active-sub-filter{{/if}} {{#if is_zero}}zero-dm-unreads{{/if}} dm-list-item bottom_left_row" data-user-ids-string="{{user_ids_string}}">
    <a href="{{url}}" draggable="false" class="dm-box dm-user-status" data-user-ids-string="{{user_ids_string}}" data-is-group="{{is_group}}">

        {{#if is_group}}
        <span class="conversation-partners-icon zulip-icon zulip-icon-dm-groups-3"></span>
        {{else}}
        <span class="conversation-partners-icon zulip-icon zulip-icon-{{user_circle_class}} {{user_circle_class}} user-circle"></span>
        {{/if}}

        <span class="conversation-partners">
            <span class="conversation-partners-list">{{recipients}}
                {{#if is_current_user}}<span class="my_user_status">{{t '(you)'}}</span>{{/if}}
                {{> status_emoji status_emoji_info}}
                {{#if is_bot}}
                    <i class="zulip-icon zulip-icon-bot" aria-label="{{t 'Bot' }}"></i>
                {{/if}}
            </span>

        </span>
        <div class="dm-markers-and-unreads">
            {{#if has_unread_mention}}
                <span class="unread_mention_info">
                    @
                </span>
            {{/if}}
            <span class="unread_count {{#if is_zero}}zero_count{{/if}}">
                {{unread}}
            </span>
        </div>
    </a>
</li>
```

--------------------------------------------------------------------------------

---[FILE: poll_modal_option.hbs]---
Location: zulip-main/web/templates/poll_modal_option.hbs

```text
<li class="option-row">
    <i class="zulip-icon zulip-icon-grip-vertical drag-icon"></i>
    <input type="text" class="poll-option-input modal_text_input" placeholder="{{t 'New option' }}" />
    {{> ./components/icon_button intent="danger" custom_classes="delete-option" icon="trash" }}
</li>
```

--------------------------------------------------------------------------------

---[FILE: presence_row.hbs]---
Location: zulip-main/web/templates/presence_row.hbs

```text
<li data-user-id="{{user_id}}" data-name="{{name}}" class="user_sidebar_entry {{#if user_list_style.WITH_AVATAR}}with_avatar{{/if}} {{#if has_status_text}}with_status{{/if}} {{#if is_current_user}}user_sidebar_entry_me {{/if}} narrow-filter {{#if faded}} user-fade {{/if}}">
    <div class="selectable_sidebar_block">
        {{#if user_list_style.WITH_STATUS}}
            <span class="zulip-icon zulip-icon-{{user_circle_class}} {{user_circle_class}} user-circle"></span>
            <a class="user-presence-link" href="{{href}}" draggable="false">
                <div class="user-name-and-status-wrapper">
                    <div class="user-name-and-status-emoji">
                        {{> user_full_name .}}
                        {{> status_emoji status_emoji_info}}
                    </div>
                    <span class="status-text">{{status_text}}</span>
                </div>
            </a>
        {{else if user_list_style.WITH_AVATAR}}
            <div class="user-profile-picture-container">
                <div class="user-profile-picture avatar-preload-background">
                    <img loading="lazy" src="{{profile_picture}}"/>
                    <span class="zulip-icon zulip-icon-{{user_circle_class}} {{user_circle_class}} user-circle"></span>
                </div>
            </div>
            <a class="user-presence-link" href="{{href}}" draggable="false">
                <div class="user-name-and-status-wrapper">
                    <div class="user-name-and-status-emoji">
                        {{> user_full_name .}}
                        {{> status_emoji status_emoji_info}}
                    </div>
                    <span class="status-text">{{status_text}}</span>
                </div>
            </a>
        {{else}}
            <span class="zulip-icon zulip-icon-{{user_circle_class}} {{user_circle_class}} user-circle"></span>
            <a class="user-presence-link" href="{{href}}" draggable="false">
                <div class="user-name-and-status-emoji">
                    {{> user_full_name .}}
                    {{> status_emoji status_emoji_info}}
                </div>
            </a>
        {{/if}}
        <span class="unread_count {{#unless num_unread}}hide{{/unless}}">{{#if num_unread}}{{num_unread}}{{/if}}</span>
    </div>
    {{#unless user_list_style.WITH_AVATAR}}
    <span class="sidebar-menu-icon user-list-sidebar-menu-icon"><i class="zulip-icon zulip-icon-more-vertical" aria-hidden="true"></i></span>
    {{/unless}}
</li>
```

--------------------------------------------------------------------------------

---[FILE: presence_rows.hbs]---
Location: zulip-main/web/templates/presence_rows.hbs

```text
{{#each presence_rows}}
    {{> presence_row .}}
{{/each}}
```

--------------------------------------------------------------------------------

---[FILE: profile_access_error_modal.hbs]---
Location: zulip-main/web/templates/profile_access_error_modal.hbs

```text
<div class="micromodal" id="profile_access_error_modal" aria-hidden="true">
    <div class="modal__overlay" tabindex="-1">
        <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="profile_access_error_modal_label">
            <header class="modal__header">
                <h1 class="modal__title" id="profile_access_error_modal_label">
                    {{t "No user found" }}
                </h1>
                <button class="modal__close" aria-label="{{t 'Close modal' }}" data-micromodal-close></button>
            </header>
            <main class="modal__content">
                <p>
                    {{t "Either this user does not exist, or you do not have access to their profile." }}
                </p>
            </main>
            <footer class="modal__footer">
                <button type="button" class="modal__button dialog_exit_button" aria-label="{{t 'Close this dialog window' }}" data-micromodal-close>{{t "Close" }}</button>
            </footer>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: read_receipts.hbs]---
Location: zulip-main/web/templates/read_receipts.hbs

```text
{{#each users}}
    <li class="view_user_profile" data-user-id="{{user_id}}" tabindex="0" role="button">
        <img class="read_receipts_user_avatar" src="{{avatar_url}}" />
        <span>{{full_name}}</span>
    </li>
{{/each}}
```

--------------------------------------------------------------------------------

---[FILE: read_receipts_modal.hbs]---
Location: zulip-main/web/templates/read_receipts_modal.hbs

```text
<div class="micromodal" id="read_receipts_modal" aria-hidden="true" data-message-id="{{message_id}}">
    <div class="modal__overlay" tabindex="-1">
        <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="read_receipts_modal_label">
            <header class="modal__header">
                <h1 class="modal__title" id="read_receipts_modal_label">
                    {{t "Read receipts" }}
                </h1>
                <button class="modal__close" aria-label="{{t 'Close modal' }}" data-micromodal-close></button>
            </header>
            <hr/>
            <main class="modal__content">
                <div class="alert" id="read_receipts_error"></div>
                <div class="read_receipts_info">
                </div>
                <div class="loading_indicator"></div>
                <ul class="read_receipts_list"></ul>
            </main>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: recent_view_filters.hbs]---
Location: zulip-main/web/templates/recent_view_filters.hbs

```text
{{> ./dropdown_widget widget_name="recent-view-filter"}}
<button data-filter="include_private" type="button" class="button-recent-filters {{#if is_spectator}}fake_disabled_button{{/if}}" role="checkbox" aria-checked="true">
    {{#if filter_pm}}
    <i class="fa fa-check-square-o"></i>
    {{else}}
    <i class="fa fa-square-o"></i>
    {{/if}}
    {{t 'Include DMs' }}
</button>
<button data-filter="unread" type="button" class="button-recent-filters {{#if is_spectator}}fake_disabled_button{{/if}}" role="checkbox" aria-checked="false">
    {{#if filter_unread}}
    <i class="fa fa-check-square-o"></i>
    {{else}}
    <i class="fa fa-square-o"></i>
    {{/if}}
    {{t 'Unread' }}
</button>
<button data-filter="participated" type="button" class="button-recent-filters {{#if is_spectator}}fake_disabled_button{{/if}}" role="checkbox" aria-checked="false">
    {{#if filter_participated}}
    <i class="fa fa-check-square-o"></i>
    {{else}}
    <i class="fa fa-square-o"></i>
    {{/if}}
    {{t 'Participated' }}
</button>
```

--------------------------------------------------------------------------------

---[FILE: recent_view_row.hbs]---
Location: zulip-main/web/templates/recent_view_row.hbs

```text
<tr id="recent_conversation:{{conversation_key}}" class="{{#if unread_count}}unread_topic{{/if}} {{#if is_private}}private_conversation_row{{/if}}">
    <td class="recent_topic_stream">
        <div class="flex_container flex_container_pm">
            <div class="left_part recent_view_focusable" data-col-index="{{ column_indexes.stream }}">
                {{#if is_private}}
                <span class="zulip-icon zulip-icon-user"></span>
                <a href="{{pm_url}}" class="recent-view-table-link">{{t "Direct messages" }}</a>
                {{else}}
                <span class="stream-privacy-original-color-{{stream_id}} stream-privacy filter-icon" style="color: {{stream_color}}">
                    {{> stream_privacy . }}
                </span>
                <a href="{{topic_url}}" class="recent-view-table-link">{{stream_name}}</a>
                {{/if}}
            </div>
            {{!-- For presence/group indicator --}}
            {{#if is_private}}
            <div class="right_part">
                <span class="pm_status_icon {{#unless is_group}}show-tooltip{{/unless}}" data-tippy-placement="top" data-user-ids-string="{{user_ids_string}}">
                    {{#if is_group}}
                    <span class="conversation-partners-icon zulip-icon zulip-icon-dm-groups-3"></span>
                    {{else if is_bot}}
                    <span class="zulip-icon zulip-icon-bot" aria-hidden="true"></span>
                    {{else}}
                    <span class="zulip-icon zulip-icon-{{user_circle_class}} {{user_circle_class}} user-circle" data-presence-indicator-user-id="{{user_ids_string}}"></span>
                    {{/if}}
                </span>
            </div>
            {{/if}}
        </div>
    </td>
    <td class="recent_topic_name"{{#if (not is_spectator) }} colspan="2"{{/if}}>
        <div class="flex_container">
            <div class="left_part recent_view_focusable line_clamp" data-col-index="{{ column_indexes.topic }}">
                {{#if is_private}}
                <a href="{{pm_url}}" class="recent-view-table-link {{#if is_group}}recent-view-dm-group{{else}}recent-view-dm{{/if}}">{{{rendered_pm_with_html}}}</a>
                {{else}}
                <a class="white-space-preserve-wrap recent-view-table-link {{#if is_empty_string_topic}}empty-topic-display{{/if}}" href="{{topic_url}}">{{topic_display_name}}</a>
                {{/if}}
            </div>
            <div class="right_part">
                {{#if is_private}}
                <span class="unread_mention_info tippy-zulip-tooltip {{#unless has_unread_mention}}unread_hidden{{/unless}}"
                  data-tippy-content="{{t 'You have unread mentions' }}">@</span>
                <div class="recent_topic_actions">
                    <div class="recent_view_focusable" data-col-index="{{ column_indexes.read }}">
                        <span class="unread_count unread_count_pm recent-view-table-unread-count {{#unless unread_count}}unread_hidden{{/unless}} tippy-zulip-tooltip on_hover_topic_read" data-user-ids-string="{{user_ids_string}}" data-tippy-content="{{t 'Mark as read' }}" role="button" tabindex="0" aria-label="{{t 'Mark as read' }}">{{unread_count}}</span>
                    </div>
                </div>
                <div class="recent_topic_actions dummy_action_button">
                    <div class="recent_view_focusable" data-col-index="{{ column_indexes.read }}">
                        {{!-- Invisible icon, used only for alignment of unread count. --}}
                        <i class="zulip-icon zulip-icon-mute on_hover_topic_unmute recipient_bar_icon"></i>
                    </div>
                </div>
                {{else}}
                <span class="unread_mention_info tippy-zulip-tooltip {{#unless mention_in_unread}}unread_hidden{{/unless}}"
                  data-tippy-content="{{t 'You have unread mentions'}}">@</span>
                <div class="recent_topic_actions">
                    <div class="recent_view_focusable hidden-for-spectators" data-col-index="{{ column_indexes.read }}">
                        <span class="unread_count recent-view-table-unread-count {{#unless unread_count}}unread_hidden{{/unless}} tippy-zulip-tooltip on_hover_topic_read" data-stream-id="{{stream_id}}" data-topic-name="{{topic}}" data-tippy-content="{{t 'Mark as read' }}" role="button" tabindex="0" aria-label="{{t 'Mark as read' }}">{{unread_count}}</span>
                    </div>
                </div>
                <div class="recent_topic_actions">
                    <div class="hidden-for-spectators">
                        {{#unless is_archived}}
                        <span class="recent_view_focusable change_visibility_policy hidden-for-spectators" data-stream-id="{{stream_id}}" data-topic-name="{{topic}}" data-col-index="{{ column_indexes.mute }}">
                            {{#if (eq visibility_policy all_visibility_policies.FOLLOWED)}}
                                <i class="zulip-icon zulip-icon-follow recipient_bar_icon visibility-status-icon" tabindex="0" aria-label="{{t 'Topic actions menu' }}" aria-haspopup="true" data-stream-id="{{stream_id}}" data-topic-name="{{topic}}" data-topic-url="{{topic_url}}" data-tippy-content="{{t 'You follow this topic.'}}" role="button"></i>
                            {{else if (eq visibility_policy all_visibility_policies.UNMUTED)}}
                                <i class="zulip-icon zulip-icon-unmute recipient_bar_icon visibility-status-icon" tabindex="0" aria-label="{{t 'Topic actions menu' }}" aria-haspopup="true" data-stream-id="{{stream_id}}" data-topic-name="{{topic}}" data-topic-url="{{topic_url}}" data-tippy-content="{{t 'You have unmuted this topic.'}}" role="button"></i>
                            {{else if (eq visibility_policy all_visibility_policies.MUTED)}}
                                <i class="zulip-icon zulip-icon-mute recipient_bar_icon visibility-status-icon" tabindex="0" aria-label="{{t 'Topic actions menu' }}" aria-haspopup="true" data-stream-id="{{stream_id}}" data-topic-name="{{topic}}" data-topic-url="{{topic_url}}" data-tippy-content="{{t 'You have muted this topic.'}}" role="button"></i>
                            {{else}}
                                <i class="zulip-icon zulip-icon-more-vertical recent-view-row-topic-menu visibility-status-icon" tabindex="0" aria-label="{{t 'Topic actions menu' }}" aria-haspopup="true" data-stream-id="{{stream_id}}" data-topic-name="{{topic}}" data-topic-url="{{topic_url}}" role="button"></i>
                            {{/if}}
                        </span>
                        {{/unless}}
                    </div>
                </div>
                {{/if}}
            </div>
        </div>
    </td>
    <td class='recent_topic_users'>
        <ul class="recent_view_participants">
            {{#if other_senders_count}}
            <li class="recent_view_participant_item tippy-zulip-tooltip" data-tooltip-template-id="recent_view_participant_overflow_tooltip:{{conversation_key}}">
                <span class="recent_view_participant_overflow">+{{other_senders_count}}</span>
            </li>
            <template id="recent_view_participant_overflow_tooltip:{{conversation_key}}">{{{other_sender_names_html}}}</template>
            {{/if}}
            {{#each senders}}
                {{#if this.is_muted}}
                <li class="recent_view_participant_item participant_profile tippy-zulip-tooltip" data-tippy-content="{{t 'Muted user'}}" data-user-id="{{this.user_id}}">
                    <span><i class="fa fa-user recent_view_participant_overflow"></i></span>
                </li>
                {{else}}
                <li class="recent_view_participant_item participant_profile tippy-zulip-tooltip" data-tippy-content="{{this.full_name}}" data-user-id="{{this.user_id}}">
                    <img src="{{this.avatar_url_small}}" class="recent_view_participant_avatar" />
                </li>
                {{/if}}
            {{/each}}
        </ul>
    </td>
    <td class="recent_topic_timestamp">
        <div class="last_msg_time tippy-zulip-tooltip" data-tippy-content="{{this.full_last_msg_date_time}}">
            <a href="{{last_msg_url}}" tabindex="-1">{{ last_msg_time }}</a>
        </div>
    </td>
</tr>
```

--------------------------------------------------------------------------------

---[FILE: recent_view_table.hbs]---
Location: zulip-main/web/templates/recent_view_table.hbs

```text
<div id="recent_view_filter_buttons" role="group">
    <div id="recent_filters_group">
        {{> recent_view_filters .}}
    </div>
    {{#> input_wrapper . input_type="filter-input" id="recent-view-search-wrapper" icon="search" input_button_icon="close"}}
        <input type="text" id="recent_view_search" class="input-element user-list-filter" value="{{ search_val }}" autocomplete="off" placeholder="{{t 'Filter topics' }}" />
    {{/input_wrapper}}
</div>
<div class="table_fix_head">
    <div class="recent-view-container">
        <table class="table table-responsive">
            <thead id="recent-view-table-headers">
                <tr>
                    <th class="recent-view-stream-header" data-sort="stream_sort">{{t 'Channel' }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th class="recent-view-topic-header" data-sort="topic_sort">{{t 'Topic' }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th data-sort="unread_sort" data-tippy-content="{{t 'Sort by unread message count' }}" class="recent-view-unread-header unread_sort tippy-zulip-delayed-tooltip hidden-for-spectators">
                        <i class="zulip-icon zulip-icon-unread"></i>
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                    <th class='recent-view-participants-header participants_header'>{{t 'Participants' }}</th>
                    <th data-sort="numeric" data-sort-prop="last_msg_id" class="recent-view-last-msg-time-header last_msg_time_header active descend">{{t 'Time' }}
                        <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                    </th>
                </tr>
            </thead>
        </table>
    </div>
</div>
```

--------------------------------------------------------------------------------

````
