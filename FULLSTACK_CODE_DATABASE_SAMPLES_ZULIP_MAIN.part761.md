---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 761
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 761 of 1290)

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

---[FILE: recipient_row.hbs]---
Location: zulip-main/web/templates/recipient_row.hbs

```text
{{#if is_stream}}
<div class="message_header message_header_stream right_part" data-stream-id="{{stream_id}}" data-topic-name="{{topic}}">
    <div class="message-header-contents" style="background: {{recipient_bar_color}};">
        {{! stream link }}
        <a class="message_label_clickable narrows_by_recipient stream_label tippy-narrow-tooltip"
          href="{{stream_url}}"
          draggable="false"
          data-tippy-content="{{t 'Go to #{display_recipient}' }}">
            <span class="stream-privacy-modified-color-{{stream_id}} stream-privacy filter-icon"  style="color: {{stream_privacy_icon_color}}">
                {{> stream_privacy .}}
            </span>

            {{~! Recipient (e.g. stream/topic or topic) ~}}
            <span class="message-header-stream-name">
                {{~display_recipient~}}
            </span>
            {{#if is_archived}}
            <span class="message-header-stream-archived"><i class="archived-indicator">({{t 'archived' }})</i></span>
            {{/if}}
        </a>
        <span class="stream_topic_separator"><i class="zulip-icon zulip-icon-chevron-right"></i></span>

        {{! hidden narrow icon for copy-pasting }}
        <span class="copy-paste-text">&gt;</span>

        {{! topic stuff }}
        <span class="stream_topic">
            {{! topic link }}
            <a class="message_label_clickable narrows_by_topic tippy-narrow-tooltip"
              draggable="false"
              href="{{topic_url}}"
              data-tippy-content="{{t 'Go to #{display_recipient} > {topic_display_name}' }}">
                {{#if (and use_match_properties (not is_empty_string_topic))}}
                    <span class="stream-topic-inner">{{{match_topic_html}}}</span>
                {{else}}
                    <span class="stream-topic-inner {{#if is_empty_string_topic}}empty-topic-display{{/if}}">{{topic_display_name}}</span>
                {{/if}}
            </a>
        </span>
        <span class="recipient_bar_controls no-select">
            <span class="topic_edit hidden-for-spectators"></span>

            {{! exterior links (e.g. to a trac ticket) }}
            {{#each topic_links}}
                {{#with this}}
                    {{!-- TODO: Find a way to use the icon_button component with <a> tags,
                    instead of copying over the icon button styles via the utility classes. --}}
                    <a href="{{url}}" target="_blank" rel="noopener noreferrer" class="recipient-bar-control recipient-bar-control-icon no-underline icon-button icon-button-neutral" data-tippy-content="{{t 'Open {text}' }}" aria-label="{{t 'Open {text}' }}" tabindex="0">
                        <i class="zulip-icon zulip-icon-external-link" aria-hidden="true"></i>
                    </a>
                {{/with}}
            {{/each}}

            {{! edit topic pencil icon }}
            {{#if is_topic_editable}}
                {{> components/icon_button icon="pencil" intent="neutral" custom_classes="on_hover_topic_edit recipient-bar-control recipient-bar-control-icon hidden-for-spectators" data-tippy-content=(t "Edit topic") aria-label=(t "Edit topic") }}
            {{/if}}

            {{#if (and user_can_resolve_topic (not is_empty_string_topic))}}
                {{#if topic_is_resolved}}
                    {{> components/icon_button icon="placeholder" intent="neutral" custom_classes="recipient-bar-control on-hover-unresolve-loading-indicator hidden-for-spectators hide" }}
                {{else}}
                    {{> components/icon_button icon="check" intent="neutral" custom_classes="on_hover_topic_resolve recipient-bar-control recipient-bar-control-icon hidden-for-spectators" data-tippy-content=(t "Mark as resolved") aria-label=(t "Mark as resolved") }}
                {{/if}}
            {{/if}}

            {{! visibility policy menu }}
            {{#if (and is_subscribed (not is_archived))}}
            {{!-- We define the change_visibility_policy class in a wrapper span
            since the icon button component already has a tippy tooltip attached
            to it and Tippy does not support multiple tooltips on a single element. --}}
            <span class="change_visibility_policy recipient-bar-control hidden-for-spectators" aria-haspopup="true">
                {{#if (eq visibility_policy all_visibility_policies.FOLLOWED)}}
                    {{> components/icon_button icon="follow" intent="neutral" custom_classes="recipient-bar-control-icon" data-tippy-content=(t "You follow this topic.") aria-label=(t "You follow this topic.") }}
                {{else if (eq visibility_policy all_visibility_policies.UNMUTED)}}
                    {{> components/icon_button icon="unmute" intent="neutral" custom_classes="recipient-bar-control recipient-bar-control-icon" data-tippy-content=(t "You have unmuted this topic.") aria-label=(t "You have unmuted this topic.") }}
                {{else if (eq visibility_policy all_visibility_policies.MUTED)}}
                    {{> components/icon_button icon="mute" intent="neutral" custom_classes="recipient-bar-control-icon" data-tippy-content=(t "You have muted this topic.") aria-label=(t "You have muted this topic.") }}
                {{else}}
                    {{> components/icon_button icon="inherit" intent="neutral" custom_classes="recipient-bar-control-icon" data-tippy-content=(t "Notifications are based on your configuration for this channel.") aria-label=(t "Notifications are based on your configuration for this channel.") }}
                {{/if}}
            </span>
            {{/if}}

            {{! Topic menu }}
            {{!-- We define the recipient-row-topic-menu class in a wrapper span
            since the icon button component already has a tippy tooltip attached
            to it and attaching the topic actions menu popover to it causes buggy behavior. --}}
            <span class="recipient-row-topic-menu recipient-bar-control" aria-haspopup="true">
                {{> components/icon_button icon="more-vertical" intent="neutral" custom_classes="recipient-bar-control-icon" data-tippy-content=(t "Topic actions") aria-label=(t "Topic actions") }}
            </span>
        </span>
        <span class="recipient_row_date {{#if (and (not always_display_date) date_unchanged )}}recipient_row_date_unchanged{{/if}}">{{{date_html}}}</span>
    </div>
</div>
{{else}}
<div class="message_header message_header_private_message">
    <div class="message-header-contents">
        <a class="message_label_clickable narrows_by_recipient stream_label tippy-narrow-tooltip"
          href="{{pm_with_url}}"
          draggable="false"
          data-tippy-content="{{#if is_dm_with_self}}{{t 'Go to direct messages with yourself' }}{{else}}{{t 'Go to direct messages with {display_reply_to_for_tooltip}' }}{{/if}}">
        <span class="private_message_header_icon"><i class="zulip-icon zulip-icon-user"></i></span>
        <span class="private_message_header_name">
            {{#if is_dm_with_self}}
                {{t 'Messages with yourself' }}
            {{else}}
                {{~#tr}}You and <z-user-names></z-user-names>
                {{#*inline "z-user-names"}}
                    {{#each recipient_users}}
                        {{~full_name}}{{#if is_bot}}<i class="zulip-icon zulip-icon-bot" aria-label="{{t 'Bot' }}"></i>{{/if~}}
                        {{#if should_add_guest_user_indicator}}&nbsp;<i>({{t 'guest'}})</i>{{/if}}{{#unless @last}}, {{/unless}}
                    {{/each}}
                {{/inline}}
                {{/tr~}}
            {{/if}}
        </span>
        </a>
        <span class="recipient_row_date {{#if (and (not always_display_date) date_unchanged )}}recipient_row_date_unchanged{{/if}}">{{{date_html}}}</span>
    </div>
</div>
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: reminders_overlay.hbs]---
Location: zulip-main/web/templates/reminders_overlay.hbs

```text
<div id="reminders-overlay" class="overlay" data-overlay="reminders">
    <div class="flex overlay-content">
        <div class="overlay-messages-container overlay-container reminders-container">
            <div class="overlay-messages-header">
                <h1>{{t 'Scheduled reminders' }}</h1>
                <div class="exit">
                    <span class="exit-sign">&times;</span>
                </div>
            </div>
            <div class="reminders-list overlay-messages-list">
                <div class="no-overlay-messages">
                    {{t 'No reminders scheduled.'}}
                </div>
            </div>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: reminder_list.hbs]---
Location: zulip-main/web/templates/reminder_list.hbs

```text
{{#each reminders_data}}
    <div class="reminder-row overlay-message-row" data-reminder-id="{{reminder_id}}">
        <div class="reminder-info-box overlay-message-info-box" tabindex="0">
            <div class="message_header message_header_private_message overlay-message-header">
                <div class="message-header-contents">
                    <div class="message_label_clickable stream_label">
                        <span class="private_message_header_icon"><i class="zulip-icon zulip-icon-user"></i></span>
                        <span class="private_message_header_name">{{t "Notification Bot to you" }}</span>
                    </div>
                    {{> scheduled_message_stream_pm_common .}}
                </div>
            </div>
            <div class="message_row{{#unless is_stream}} private-message{{/unless}}" role="listitem">
                <div class="messagebox">
                    <div class="messagebox-content">
                        <div class="message_top_line">
                            <div class="overlay_message_controls">
                                {{> ./components/icon_button intent="danger" custom_classes="delete-overlay-message tippy-zulip-delayed-tooltip" icon="trash" data-tooltip-template-id="delete-reminder-tooltip-template" aria-label=(t "Delete") }}
                            </div>
                        </div>
                        <div class="message_content rendered_markdown restore-overlay-message">{{rendered_markdown rendered_content}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{{/each}}
```

--------------------------------------------------------------------------------

---[FILE: reply_recipient_label.hbs]---
Location: zulip-main/web/templates/reply_recipient_label.hbs

```text
{{#if is_dm_with_self}}
{{#tr}}
    Write yourself a note
{{/tr}}
{{else}}
{{#tr}}
    Message <z-recipient-label></z-recipient-label>
    {{#*inline "z-recipient-label"}}
        {{#if has_empty_string_topic~}}
        #{{channel_name}} &gt; <span class="empty-topic-display">{{empty_string_topic_display_name}}</span>
        {{~else~}}
        {{label_text}}
        {{~/if}}
    {{~/inline}}
{{/tr}}
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: report_message_modal.hbs]---
Location: zulip-main/web/templates/report_message_modal.hbs

```text
<form id="message_report_form">
    <p>
        {{t "Your report will be sent to the private moderation requests channel for this organization." }}
    </p>
    <div id="report-message-preview-container" class="input-group">
        {{> recipient_row recipient_row_data}}
        {{> single_message message_container_data}}
    </div>
    <div class="input-group">
        <label class="report-type-wrapper modal-field-label">
            {{t "What's the problem with this message?" }}
        </label>
        {{> dropdown_widget_wrapper widget_name="report_type_options"}}
    </div>
    <div class="input-group">
        <label for="message-report-description" class="modal-field-label">
            {{t "Can you provide more details?" }}
        </label>
        <textarea id="message-report-description" class="modal-textarea" rows="4" maxlength=1000></textarea>
    </div>
</form>
```

--------------------------------------------------------------------------------

---[FILE: resolve_topic_time_limit_error_modal.hbs]---
Location: zulip-main/web/templates/resolve_topic_time_limit_error_modal.hbs

```text
<p>
    {{resolve_topic_time_limit_error_string}}
    {{#if topic_is_resolved}}
        {{t "Contact a moderator to unresolve this topic."}}
    {{else}}
        {{t "Contact a moderator to resolve this topic." }}
    {{/if}}
</p>
```

--------------------------------------------------------------------------------

---[FILE: revealed_message_hide_button.hbs]---
Location: zulip-main/web/templates/revealed_message_hide_button.hbs

```text
{{#if is_inline_hide_button}}
    <span class="inline-hide-button-space-wrapper"> </span>
{{/if}}
<button data-message-id="{{message_id}}" class="action-button rehide-muted-user-message {{#if is_inline_hide_button}}inline-hide-button{{else}}block-hide-button{{/if}}" tabindex="0" aria-label="{{t 'Hide message from muted user' }}">
    <i class="zulip-icon zulip-icon-hide"></i>
    <span class="action-button-label">{{t 'Hide'}}</span>
</button>
```

--------------------------------------------------------------------------------

---[FILE: right_sidebar.hbs]---
Location: zulip-main/web/templates/right_sidebar.hbs

```text
<div class="right-sidebar" id="right-sidebar" role="navigation">
    <div class="right-sidebar-items">
        <div id="user-list">
            <div id="userlist-header">
                {{#> input_wrapper input_type="filter-input" id="userlist-header-search" icon="search" input_button_icon="close"}}
                    <input type="text" class="input-element user-list-filter home-page-input" autocomplete="off" placeholder="{{t 'Filter users' }}" />
                {{/input_wrapper}}
                <span id="buddy-list-menu-icon" class="user-list-sidebar-menu-icon">
                    <i class="zulip-icon zulip-icon-more-vertical" aria-hidden="true"></i>
                </span>
            </div>
            <div id="buddy_list_wrapper" class="scrolling_list" data-simplebar data-simplebar-tab-index="-1">
                <div id="buddy-list-participants-container" class="buddy-list-section-container">
                    <div class="buddy-list-subsection-header"></div>
                    <ul id="buddy-list-participants" class="buddy-list-section"></ul>
                </div>
                <div id="buddy-list-users-matching-view-container" class="buddy-list-section-container">
                    <div class="buddy-list-subsection-header"></div>
                    <ul id="buddy-list-users-matching-view" class="buddy-list-section"></ul>
                    <div class="buddy-list-user-link view-all-subscribers-link"></div>
                </div>
                <div id="buddy-list-other-users-container" class="buddy-list-section-container">
                    <div class="buddy-list-subsection-header"></div>
                    <ul id="buddy-list-other-users" class="buddy-list-section"></ul>
                    <div class="buddy-list-user-link view-all-users-link"></div>
                </div>
                <div id="buddy_list_wrapper_padding"></div>
                <div class="invite-user-shortcut">
                    <a class="invite-user-link right-sidebar-wrappable-text-container" role="button">
                        <span class="right-sidebar-wrappable-text-inner">
                            {{t 'Invite to organization' }}
                        </span>
                    </a>
                </div>
            </div>
            <div id="buddy-list-loading-subscribers"></div>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: scheduled_message.hbs]---
Location: zulip-main/web/templates/scheduled_message.hbs

```text
{{#each scheduled_messages_data}}
    <div class="scheduled-message-row overlay-message-row" data-scheduled-message-id="{{scheduled_message_id}}">
        <div class="scheduled-message-info-box overlay-message-info-box" tabindex="0">
            {{#if is_stream}}
            <div class="message_header message_header_stream restore-overlay-message overlay-message-header">
                <div class="message-header-contents" style="background: {{recipient_bar_color}};">
                    <div class="message_label_clickable stream_label">
                        <span class="stream-privacy-modified-color-{{stream_id}} stream-privacy filter-icon"  style="color: {{stream_privacy_icon_color}}">
                            {{> stream_privacy .}}
                        </span>
                        {{stream_name}}
                    </div>
                    <span class="stream_topic_separator"><i class="zulip-icon zulip-icon-chevron-right"></i></span>
                    <span class="stream_topic">
                        <span class="message_label_clickable narrows_by_topic">
                            <span {{#if is_empty_string_topic}}class="empty-topic-display"{{/if}}>{{topic_display_name}}</span>
                        </span>
                    </span>
                    <span class="recipient_bar_controls"></span>
                    {{> scheduled_message_stream_pm_common .}}
                </div>
            </div>
            {{else}}
            <div class="message_header message_header_private_message restore-overlay-message overlay-message-header">
                <div class="message-header-contents">
                    <div class="message_label_clickable stream_label">
                        <span class="private_message_header_icon"><i class="zulip-icon zulip-icon-user"></i></span>
                        {{#if is_dm_with_self}}
                        <span class="private_message_header_name">{{t "You" }}</span>
                        {{else}}
                        <span class="private_message_header_name">{{t "You and {recipients}" }}</span>
                        {{/if}}
                    </div>
                    {{> scheduled_message_stream_pm_common .}}
                </div>
            </div>
            {{/if}}
            <div class="message_row{{#unless is_stream}} private-message{{/unless}}" role="listitem">
                <div class="messagebox">
                    <div class="messagebox-content">
                        <div class="message_top_line">
                            <div class="overlay_message_controls">
                                {{> ./components/icon_button intent="danger" custom_classes="delete-overlay-message tippy-zulip-delayed-tooltip" icon="trash" data-tooltip-template-id="delete-scheduled-message-tooltip-template" aria-label=(t "Delete") }}
                            </div>
                        </div>
                        <div class="message_content rendered_markdown restore-overlay-message">{{rendered_markdown rendered_content}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{{/each}}
```

--------------------------------------------------------------------------------

---[FILE: scheduled_messages_indicator.hbs]---
Location: zulip-main/web/templates/scheduled_messages_indicator.hbs

```text

<div class="scheduled_message_indicator">
    {{#tr}}
    You have <z-link>{scheduled_message_count, plural, =1 {1 scheduled message} other {# scheduled messages}}</z-link> for this conversation.
    {{#*inline "z-link"}}<a href='/#scheduled'>{{> @partial-block}}</a>{{/inline}}
    {{/tr}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: scheduled_messages_overlay.hbs]---
Location: zulip-main/web/templates/scheduled_messages_overlay.hbs

```text
<div id="scheduled_messages_overlay" class="overlay" data-overlay="scheduled">
    <div class="flex overlay-content">
        <div class="overlay-messages-container overlay-container scheduled-messages-container">
            <div class="overlay-messages-header">
                <h1>{{t 'Scheduled messages' }}</h1>
                <div class="exit">
                    <span class="exit-sign">&times;</span>
                </div>
                <div class="removed-drafts">
                    <div class="overlay-keyboard-shortcuts">
                        {{#tr}}
                            To edit or reschedule a message, click on it or press <z-shortcut></z-shortcut>.
                            {{#*inline "z-shortcut"}}{{popover_hotkey_hints "Enter"}}{{/inline}}
                        {{/tr}}
                    </div>
                </div>
            </div>
            <div class="scheduled-messages-list overlay-messages-list">
                <div class="no-overlay-messages">
                    {{t 'No scheduled messages.'}}
                </div>
            </div>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: scheduled_message_stream_pm_common.hbs]---
Location: zulip-main/web/templates/scheduled_message_stream_pm_common.hbs

```text
{{#if failed}}
<div class="error-icon-message-recipient">
    <i class="zulip-icon zulip-icon-exclamation-circle" data-tippy-content="{{t 'This message could not be sent at the scheduled time.' }}"></i>
</div>
{{/if}}
<div class="recipient_row_date">{{ formatted_send_at_time }}</div>
```

--------------------------------------------------------------------------------

---[FILE: search_description.hbs]---
Location: zulip-main/web/templates/search_description.hbs

```text
{{~#each parts ~}}

    {{#if (eq this.type "plain_text")~}}
        {{~this.content~}}
    {{else if (eq this.type "channel_topic")}}
        {{~#if is_empty_string_topic~}}
        messages in #{{this.channel}} > <span class="empty-topic-display">{{this.topic_display_name}}</span>
        {{~else~}}
        messages in #{{this.channel}} > {{this.topic_display_name}}
        {{~/if~}}
    {{else if (eq this.type "channel")}}
        {{~!-- squash whitespace --~}}
        {{this.prefix_for_operator}}{{this.operand}}
        {{~!-- squash whitespace --~}}
    {{else if (eq this.type "invalid_has")}}
        {{~!-- squash whitespace --~}}
        invalid {{this.operand}} operand for has operator
        {{~!-- squash whitespace --~}}
    {{else if (eq this.type "prefix_for_operator")}}
        {{~#if is_empty_string_topic~}}
        {{this.prefix_for_operator}} <span class="empty-topic-display">{{this.operand}}</span>
        {{~ else ~}}
        {{this.prefix_for_operator}} {{this.operand}}{{#if (or (eq this.operand "link") (eq this.operand "image") (eq this.operand "attachment") (eq this.operand "reaction"))}}s{{/if}}
        {{~/if~}}
    {{else if (eq this.type "user_pill")}}
        {{~!-- squash whitespace --~}}
        {{this.operator}}
        {{~#each this.users}}
            {{#if this.valid_user}}
                {{> user_pill .}}
            {{else}}
                {{this.operand}}
            {{/if}}
        {{~/each~}}
        {{~!-- squash whitespace --~}}
    {{else if (eq this.type "is_operator")}}
        {{#if (eq this.operand "mentioned")}}
            {{~!-- squash whitespace --~}}
            {{this.verb}}messages that mention you
            {{~!-- squash whitespace --~}}
        {{else if (or (eq this.operand "starred") (eq this.operand "alerted") (eq this.operand "unread"))}}
            {{~!-- squash whitespace --~}}
            {{this.verb}}{{this.operand}} messages
            {{~!-- squash whitespace --~}}
        {{else if (or (eq this.operand "dm") (eq this.operand "private"))}}
            {{~!-- squash whitespace --~}}
            {{this.verb}}direct messages
            {{~!-- squash whitespace --~}}
        {{else if (eq this.operand "resolved")}}
            {{~!-- squash whitespace --~}}
            {{this.verb}}resolved topics
            {{~!-- squash whitespace --~}}
        {{else if (eq this.operand "followed")}}
            {{~!-- squash whitespace --~}}
            {{this.verb}}followed topics
            {{~!-- squash whitespace --~}}
        {{else if (eq this.operand "muted")}}
            {{~!-- squash whitespace --~}}
            {{this.verb}}muted messages
            {{~!-- squash whitespace --~}}
        {{else if (eq this.operand "unresolved")}}
            {{~!-- squash whitespace --~}}
            {{this.verb}}unresolved topics
            {{~!-- squash whitespace --~}}
        {{else}}
            {{~!-- squash whitespace --~}}
            invalid {{this.operand}} operand for is operator
            {{~!-- squash whitespace --~}}
        {{~/if~}}
    {{~/if~}}
    {{~#if (not @last)~}}, {{/if~}}

{{~/each~}}
```

--------------------------------------------------------------------------------

---[FILE: search_list_item.hbs]---
Location: zulip-main/web/templates/search_list_item.hbs

```text
<div class="search_list_item">
    {{#each pills}}
        {{#if (eq this.operator "search")}}
            <div class="description">{{{this.description_html}}}</div>
        {{else if (eq this.type "search_user")}}
            <span class="pill-container">{{> search_user_pill this}}</span>
        {{else}}
            <span class="pill-container">{{> input_pill this}}</span>
        {{/if}}
    {{/each}}
    {{#if description_html}}<div class="description">{{{description_html}}}</div>{{/if}}
</div>
```

--------------------------------------------------------------------------------

---[FILE: search_operators.hbs]---
Location: zulip-main/web/templates/search_operators.hbs

```text
<div class="overlay-modal hide" id="search-operators" tabindex="-1" role="dialog" aria-label="{{t 'Search filters' }}">
    <div class="overlay-scroll-container" data-simplebar data-simplebar-tab-index="-1" data-simplebar-auto-hide="false">
        <div id="operators-instructions">
            <table class="table table-striped table-rounded table-bordered help-table">
                <thead>
                    <tr>
                        <th id="search-operators-first-header">{{t "Filter" }}</th>
                        <th>{{t "Effect" }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="operator"><span class="operator_value">keyword</span></td>
                        <td class="definition">
                            {{#tr}}
                                Search for <z-value></z-value> in the topic or message content.
                                {{#*inline "z-value"}}<span class="operator_value">keyword</span>{{/inline}}
                            {{/tr}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">channel:<span class="operator_value">channel</span></td>
                        <td class="definition">
                            {{#tr}}
                                Narrow to messages on channel <z-value></z-value>.
                                {{#*inline "z-value"}}<span class="operator_value">channel</span>{{/inline}}
                            {{/tr}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">topic:<span class="operator_value">topic</span></td>
                        <td class="definition">
                            {{#tr}}
                                Narrow to messages with topic <z-value></z-value>.
                                {{#*inline "z-value"}}<span class="operator_value">topic</span>{{/inline}}
                            {{/tr}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">is:dm</td>
                        <td class="definition">
                            {{t 'Narrow to direct messages.'}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">dm:<span class="operator_value">user</span></td>
                        <td class="definition">
                            {{#tr}}
                                Narrow to direct messages with <z-value></z-value>.
                                {{#*inline "z-value"}}<span class="operator_value">user</span>{{/inline}}
                            {{/tr}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">dm-including:<span class="operator_value">user</span></td>
                        <td class="definition">
                            {{#tr}}
                                Narrow to direct messages that include <z-value></z-value>.
                                {{#*inline "z-value"}}<span class="operator_value">user</span>{{/inline}}
                            {{/tr}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">channels:public</td>
                        <td class="definition">
                            {{#if can_access_all_public_channels }}
                            {{t 'Search all public channels.'}}
                            {{else}}
                            {{t 'Search all public channels that you can view.'}}
                            {{/if}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">channels:web-public</td>
                        <td class="definition">
                            {{t 'Search all web-public channels.'}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">sender:<span class="operator_value">user</span></td>
                        <td class="definition">
                            {{#tr}}
                                Narrow to messages sent by <z-value></z-value>.
                                {{#*inline "z-value"}}<span class="operator_value">user</span>{{/inline}}
                            {{/tr}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">sender:me</td>
                        <td class="definition">
                            {{t 'Narrow to messages sent by you.'}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">has:link</td>
                        <td class="definition">
                            {{t 'Narrow to messages containing links.'}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">has:attachment</td>
                        <td class="definition">
                            {{t 'Narrow to messages containing uploads.'}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">has:image</td>
                        <td class="definition">
                            {{t 'Narrow to messages containing images.'}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">has:reaction</td>
                        <td class="definition">
                            {{t 'Narrow to messages with emoji reactions.'}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">is:alerted</td>
                        <td class="definition">
                            {{t 'Narrow to messages with alert words.'}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">is:mentioned</td>
                        <td class="definition">
                            {{t 'Narrow to messages that mention you.'}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">is:starred</td>
                        <td class="definition">
                            {{t 'Narrow to starred messages.'}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">is:resolved</td>
                        <td class="definition">
                            {{t 'Narrow to messages in resolved topics.'}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">-is:resolved</td>
                        <td class="definition">
                            {{t 'Narrow to messages in unresolved topics.'}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">is:followed</td>
                        <td class="definition">
                            {{t 'Narrow to messages in followed topics.'}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">is:unread</td>
                        <td class="definition">
                            {{t 'Narrow to unread messages.'}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">is:muted</td>
                        <td class="definition">
                            {{t 'Narrow to muted messages.'}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">near:<span class="operator_value">id</span></td>
                        <td class="definition">
                            {{#tr}}
                                Center the view around message ID <z-value></z-value>.
                                {{#*inline "z-value"}}<span class="operator_value">id</span>{{/inline}}
                            {{/tr}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">id:<span class="operator_value">id</span></td>
                        <td class="definition">
                            {{#tr}}
                                Narrow to just message ID <z-value></z-value>.
                                {{#*inline "z-value"}}<span class="operator_value">id</span>{{/inline}}
                            {{/tr}}
                        </td>
                    </tr>
                    <tr>
                        <td class="operator">-topic:<span class="operator_value">topic</span></td>
                        <td class="definition">
                            {{#tr}}
                                Exclude messages with topic <z-value></z-value>.
                                {{#*inline "z-value"}}<span class="operator_value">topic</span>{{/inline}}
                            {{/tr}}
                        </td>
                    </tr>
                </tbody>
            </table>
            <p>{{t "You can combine search filters as needed." }}</p>
            <hr />
            <a href="help/search-for-messages#search-filters" target="_blank" rel="noopener noreferrer">{{t "Detailed search filters documentation" }}</a>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: search_user_pill.hbs]---
Location: zulip-main/web/templates/search_user_pill.hbs

```text
<div class="user-pill-container pill" tabindex=0>
    <span class="pill-label">
        {{~#if this.negated}}-{{~/if~}}
        {{ operator }}:
    </span>
    {{#each users}}
        <div class="pill{{#if deactivated}} deactivated-pill{{/if}}" data-user-id="{{this.user_id}}">
            <img class="pill-image" src="{{this.img_src}}" />
            <div class="pill-image-border"></div>
            {{#if deactivated}}
            <span class="fa fa-ban slashed-circle-icon"></span>
            {{/if}}
            <span class="pill-label">
                <span class="pill-value">{{ this.full_name }}</span>
                {{~#if this.should_add_guest_user_indicator}}&nbsp;<i>({{t 'guest'}})</i>{{~/if~}}
                {{~#if this.status_emoji_info~}}
                    {{~> status_emoji this.status_emoji_info~}}
                {{~/if~}}
            </span>
            <div class="exit">
                <a role="button" class="zulip-icon zulip-icon-close pill-close-button"></a>
            </div>
        </div>
    {{/each}}
</div>
```

--------------------------------------------------------------------------------

````
