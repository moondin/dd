---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 766
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 766 of 1290)

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

---[FILE: navbar_banners_testing_popover.hbs]---
Location: zulip-main/web/templates/popovers/navbar_banners_testing_popover.hbs

```text
<div class="popover-menu navbar-banners-testing-popover" data-simplebar data-simplebar-tab-index="-1">
    <ul role="menu" class="popover-menu-list">
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="desktop-notifications popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-edit" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Desktop notifications"}}</span>
            </a>
        </li>
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="configure-outgoing-mail popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-edit" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Configure outgoing mail"}}</span>
            </a>
        </li>
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="insecure-desktop-app popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-edit" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Insecure desktop app"}}</span>
            </a>
        </li>
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="profile-missing-required-fields popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-edit" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Profile missing required fields"}}</span>
            </a>
        </li>
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="organization-profile-incomplete popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-edit" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Organization profile incomplete"}}</span>
            </a>
        </li>
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="server-needs-upgrade popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-edit" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Server needs upgrade"}}</span>
            </a>
        </li>
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="bankruptcy popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-edit" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Bankruptcy"}}</span>
            </a>
        </li>
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="demo-organization-deadline popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-edit" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Demo organization deadline"}}</span>
            </a>
        </li>
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="time_zone_update_offer popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-edit" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Time zone update offer"}}</span>
            </a>
        </li>
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: playground_links_popover.hbs]---
Location: zulip-main/web/templates/popovers/playground_links_popover.hbs

```text
<div class="popover-menu playground-links-popover" data-simplebar data-simplebar-tab-index="-1">
    <ul role="menu" class="popover-menu-list">
        {{#each playground_info}}
            <li role="none" class="link-item popover-menu-list-item">
                <a href="{{this/playground_url}}" target="_blank" rel="noopener noreferrer" role="menuitem" class="popover_playground_link popover-menu-link" tabindex="0">
                    <span class="popover-menu-label">{{t "View in {name}" }}</span>
                </a>
            </li>
        {{/each}}
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: schedule_message_popover.hbs]---
Location: zulip-main/web/templates/popovers/schedule_message_popover.hbs

```text
<div class="popover-menu {{#if is_reminder}}message-reminder-popover{{/if}}" id="send-later-options" data-simplebar data-simplebar-tab-index="-1">
    <ul role="menu" class="popover-menu-list">
        <li role="none" class="text-item popover-menu-list-item">
            <span class="popover-header-name">
                {{#if is_reminder}}
                    {{t "Schedule reminder" }}
                {{else}}
                    {{t "Schedule message" }}
                {{/if}}
            </span>
        </li>
        {{#if is_reminder}}
        <li role="separator" class="popover-menu-separator"></li>
        <li role="none" class="text-item popover-menu-list-item schedule-reminder-note-item">
            <textarea class="schedule-reminder-note"  placeholder="{{t 'Note'}}" tabindex="0"
              maxlength="{{max_reminder_note_length}}"
              ></textarea>
        </li>
        {{/if}}
        {{#if possible_send_later_today}}
            <li role="separator" class="popover-menu-separator"></li>
            {{#each possible_send_later_today}}
                <li role="none" class="link-item popover-menu-list-item">
                    <a role="menuitem" id="{{@key}}" class="send_later_today send_later_option popover-menu-link" data-send-stamp="{{this.stamp}}" tabindex="0">
                        <span class="popover-menu-label">{{this.text}}</span>
                    </a>
                </li>
            {{/each}}
        {{/if}}
        <li role="separator" class="popover-menu-separator"></li>
        {{#each send_later_tomorrow}}
            <li role="none" class="link-item popover-menu-list-item">
                <a role="menuitem" id="{{@key}}" class="send_later_tomorrow send_later_option popover-menu-link" data-send-stamp="{{this.stamp}}" tabindex="0">
                    <span class="popover-menu-label">{{this.text}}</span>
                </a>
            </li>
        {{/each}}
        {{#if possible_send_later_monday}}
            <li role="separator" class="popover-menu-separator"></li>
            {{#each possible_send_later_monday}}
                <li role="none" class="link-item popover-menu-list-item">
                    <a role="menuitem" id="{{@key}}" class="send_later_monday send_later_option popover-menu-link" data-send-stamp="{{this.stamp}}" tabindex="0">
                        <span class="popover-menu-label">{{this.text}}</span>
                    </a>
                </li>
            {{/each}}
        {{/if}}
        <li role="separator" class="popover-menu-separator"></li>
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="send_later_custom send_later_option popover-menu-link" tabindex="0">
                <span class="popover-menu-label">{{t 'Custom time'}}</span>
            </a>
        </li>
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: send_later_popover.hbs]---
Location: zulip-main/web/templates/popovers/send_later_popover.hbs

```text
<div class="popover-menu" id="send_later_popover" data-simplebar data-simplebar-tab-index="-1">
    <ul role="menu" class="popover-menu-list">
        <li role="none" class="popover-menu-list-item">
            <div role="group" class="enter_sends_choices" aria-label="{{t 'Enter to send choices' }}">
                <label role="menuitemradio" class="enter_sends_choice" tabindex="0">
                    <input type="radio" class="enter_sends_choice_radio" name="enter_sends_choice" value="true"{{#if enter_sends_true }} checked{{/if}} />
                    <span class="enter_sends_choice_text_container">
                        <span class="enter_sends_major enter_sends_choice_text">
                            {{#tr}}
                                Press <z-shortcut></z-shortcut> to send
                                {{#*inline "z-shortcut"}}{{popover_hotkey_hints "Enter"}}{{/inline}}
                            {{/tr}}
                        </span>
                        <span class="enter_sends_minor enter_sends_choice_text">
                            {{#tr}}
                                Press <z-shortcut></z-shortcut> to add a new line
                                {{#*inline "z-shortcut"}}{{popover_hotkey_hints "Ctrl" "Enter"}}{{/inline}}
                            {{/tr}}
                        </span>
                    </span>
                </label>
                <label role="menuitemradio" class="enter_sends_choice" tabindex="0">
                    <input type="radio" class="enter_sends_choice_radio" name="enter_sends_choice" value="false"{{#unless enter_sends_true }} checked{{/unless}} />
                    <span class="enter_sends_choice_text_container">
                        <span class="enter_sends_major enter_sends_choice_text">
                            {{#tr}}
                                Press <z-shortcut></z-shortcut> to send
                                {{#*inline "z-shortcut"}}{{popover_hotkey_hints "Ctrl" "Enter"}}{{/inline}}
                            {{/tr}}
                        </span>
                        <span class="enter_sends_minor enter_sends_choice_text">
                            {{#tr}}
                                Press <z-shortcut></z-shortcut> to add a new line
                                {{#*inline "z-shortcut"}}{{popover_hotkey_hints "Enter"}}{{/inline}}
                            {{/tr}}
                        </span>
                    </span>
                </label>
            </div>
        </li>
        <li role="separator" class="popover-menu-separator"></li>
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="open_send_later_modal popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-calendar" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Schedule message" }}</span>
            </a>
        </li>
        {{#if formatted_send_later_time}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="send_later_selected_send_later_time popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-calendar-clock" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'Schedule for {formatted_send_later_time}' }}</span>
            </a>
        </li>
        {{/if}}
        <li role="none" class="link-item popover-menu-list-item">
            <a href="#scheduled" role="menuitem" class="navigate-link-on-enter popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-calendar-days" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "View scheduled messages" }}</span>
            </a>
        </li>
        <li role="separator" class="popover-menu-separator drafts-item-in-popover"></li>
        <li role="none" class="link-item popover-menu-list-item drafts-item-in-popover">
            <a href="#drafts" role="menuitem" class="view_contextual_drafts popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-drafts" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "View drafts" }}</span>
                <span class="compose-drafts-count-container"><span class="unread_count quiet-count compose-drafts-count"></span></span>
            </a>
        </li>
        {{#if show_compose_new_message}}
        <li role="separator" class="popover-menu-separator"></li>
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="compose_new_message popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-file-check" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Save draft and start a new message" }}</span>
            </a>
        </li>
        {{/if}}
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: stream_card_popover.hbs]---
Location: zulip-main/web/templates/popovers/stream_card_popover.hbs

```text
<div class="popover-menu" id="stream-card-popover" data-simplebar data-simplebar-tab-index="-1">
    <ul role="menu" class="popover-menu-list">
        <li role="none" class="popover-stream-header text-item popover-menu-list-item">
            <span class="stream-privacy-original-color-{{stream.stream_id}} stream-privacy filter-icon" style="color: {{stream.color}}">
                {{> ../stream_privacy
                  invite_only=stream.invite_only
                  is_web_public=stream.is_web_public
                  is_archived=stream.is_archived }}
            </span>
            <span class="popover-stream-name">{{stream.name}}</span>
        </li>
        <li role="none" class="popover-stream-info-menu-description text-item popover-menu-list-item">
            {{> ../stream_settings/stream_description
              rendered_description=stream.rendered_description}}
        </li>
        <li role="none" class="popover-menu-list-item text-item italic">
            {{#tr}}
            {subscribers_count, plural, =0 {No subscribers} =1 {1 subscriber} other {# subscribers}}
            {{/tr}}
        </li>
        <li role="separator" class="popover-menu-separator hidden-for-spectators"></li>
        <li role="none" class="link-item popover-menu-list-item hidden-for-spectators">
            <a role="menuitem" class="open_stream_settings popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-gear" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Channel settings" }}</span>
            </a>
        </li>
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: user_group_info_popover.hbs]---
Location: zulip-main/web/templates/popovers/user_group_info_popover.hbs

```text
<div class="popover-menu user-group-info-popover" data-simplebar data-simplebar-tab-index="-1">
    <ul role="menu" class="popover-menu-list">
        <li role="none" class="link-item popover-menu-list-item">
            <div class="popover-group-menu-info">
                <div class="popover-group-menu-name-container">
                    <i class="popover-menu-icon zulip-icon zulip-icon-user-group" aria-hidden="true"></i>
                    <span class="popover-group-menu-name">{{group_name}}</span>
                </div>
                {{#if group_description}}
                    <div class="popover-group-menu-description">{{group_description}}</div>
                {{/if}}
            </div>
        </li>
        {{#if (or displayed_members.length displayed_subgroups.length)}}
            {{#if user_can_access_all_other_users}}
                <li role="none" class="popover-menu-list-item text-item italic">
                    {{#tr}}
                        {members_count, plural, =1 {1 member} other {# members}}
                    {{/tr}}
                </li>
            {{/if}}
        {{/if}}
        {{#if deactivated}}
            <li role="none" class="popover-menu-list-item text-item italic hidden-for-spectators">
                <span class="popover-menu-label">{{t "This group has been deactivated." }}</span>
            </li>
        {{/if}}
        <li role="separator" class="popover-menu-separator"></li>
        <li role="none" class="popover-menu-list-item">
            {{#if (or displayed_members.length displayed_subgroups.length)}}
                <ul class="popover-menu-list popover-group-menu-member-list" data-simplebar data-simplebar-tab-index="-1" data-simplebar-auto-hide="false">
                    {{#each displayed_subgroups}}
                        <li class="popover-group-menu-member">
                            <i class="popover-group-member-icon popover-menu-icon zulip-icon zulip-icon-user-group" aria-hidden="true"></i>
                            <span class="popover-group-menu-member-name">{{name}}</span>
                        </li>
                    {{/each}}
                    {{#each displayed_members}}
                        <li class="popover-group-menu-member">
                            {{#if is_bot}}
                                <i class="popover-group-member-icon zulip-icon zulip-icon-bot" aria-hidden="true"></i>
                            {{else}}
                                <span class="popover-group-member-icon user-circle zulip-icon zulip-icon-{{user_circle_class}} {{user_circle_class}} popover-group-menu-user-presence hidden-for-spectators" data-tippy-content="{{user_last_seen_time_status}}"></span>
                            {{/if}}
                            <span class="popover-group-menu-member-name">{{full_name}}</span>
                        </li>
                    {{/each}}
                    {{#unless display_all_subgroups_and_members}}
                        <li class="popover-group-menu-member">
                            <span class="popover-group-menu-member-name">
                                {{#if is_system_group}}
                                    {{#if has_bots}}
                                        {{#tr class="popover-group-menu-member"}}
                                            View all <z-link-users>users</z-link-users> and <z-link-bots>bots</z-link-bots>
                                            {{#*inline "z-link-users"}}<a href="#organization/users">{{> @partial-block}}</a>{{/inline}}
                                            {{#*inline "z-link-bots"}}<a href="#organization/bots">{{> @partial-block}}</a>{{/inline}}
                                        {{/tr}}
                                    {{else}}
                                        <a href="#organization/users" role="menuitem">
                                            {{t "View all users"}}
                                        </a>
                                    {{/if}}
                                {{else}}
                                    <a href="{{group_members_url}}" role="menuitem">
                                        {{t "View all members"}}
                                    </a>
                                {{/if}}
                            </span>
                        </li>
                    {{/unless}}
                </ul>
            {{else}}
                <span class="popover-group-menu-placeholder"><i>{{t 'This group has no members.'}}</i></span>
            {{/if}}
        </li>
        {{#unless (or is_guest is_system_group)}}
            <li role="separator" class="popover-menu-separator hidden-for-spectators"></li>
            <li role="none" class="link-item popover-menu-list-item hidden-for-spectators">
                <a href="{{group_edit_url}}" role="menuitem" class="navigate-link-on-enter popover-menu-link" tabindex="0">
                    <i class="popover-menu-icon zulip-icon zulip-icon-user-group-cog" aria-hidden="true"></i>
                    <span class="popover-menu-label">{{t "Group settings" }}</span>
                </a>
            </li>
        {{/unless}}
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: emoji_popover.hbs]---
Location: zulip-main/web/templates/popovers/emoji/emoji_popover.hbs

```text
<div class="emoji-picker-popover" data-emoji-destination="{{#if message_id }}reaction{{else if is_status_emoji_popover}}status{{else}}composition{{/if}}">
    <div class="emoji-popover">
        <div class="popover-filter-input-wrapper">
            <input id="emoji-popover-filter" class="popover-filter-input filter_text_input" type="text" autocomplete="off" placeholder="{{t 'Filter' }}" autofocus/>
        </div>
        <div class="emoji-popover-category-tabs">
            {{#each emoji_categories}}
                <span class="emoji-popover-tab-item {{#if @first}} active {{/if}}" data-tab-name='{{name}}' title='{{name}}'><i class="fa {{icon}}"></i></span>
            {{/each}}
        </div>
        <div class="emoji-popover-emoji-map" data-simplebar data-simplebar-tab-index="-1" data-simplebar-auto-hide="false" data-message-id="{{message_id}}">
        </div>
        <div class="emoji-search-results-container" data-simplebar data-simplebar-tab-index="-1" data-simplebar-auto-hide="false" data-message-id="{{message_id}}">
            <div class="emoji-popover-results-heading">{{t "Search results" }}</div>
            <div class="emoji-search-results"></div>
        </div>
    </div>
    <div class="emoji-showcase-container"></div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: emoji_popover_emoji.hbs]---
Location: zulip-main/web/templates/popovers/emoji/emoji_popover_emoji.hbs

```text
{{#with emoji_dict}}
<div class="emoji-popover-emoji {{#if has_reacted}}reacted{{/if}}" data-emoji-name="{{#if emoji_name}}{{emoji_name}}{{else}}{{name}}{{/if}}" tabindex="0" data-emoji-id="{{../type}},{{../section}},{{../index}}">
    {{#if is_realm_emoji}}
    <img src="{{url}}" class="emoji"/>
    {{else}}
    <div class="emoji emoji-{{emoji_code}}"></div>
    {{/if}}
</div>
{{/with}}
```

--------------------------------------------------------------------------------

---[FILE: emoji_popover_emoji_map.hbs]---
Location: zulip-main/web/templates/popovers/emoji/emoji_popover_emoji_map.hbs

```text
{{#each emoji_categories }}
    <div class="emoji-popover-subheading" data-section="{{name}}">{{translated}}</div>
    <div class="emoji-collection" data-section="{{name}}">
        {{#each this.emojis }}
            {{> emoji_popover_emoji type="emoji_picker_emoji" section=@../index index=@index message_id=../../message_id is_status_emoji_popover=../../is_status_emoji_popover emoji_dict=this}}
        {{/each}}
    </div>
{{/each}}
```

--------------------------------------------------------------------------------

---[FILE: emoji_popover_search_results.hbs]---
Location: zulip-main/web/templates/popovers/emoji/emoji_popover_search_results.hbs

```text
{{#each search_results}}
    {{> emoji_popover_emoji type="emoji_search_result" section="0" index=@index message_id=../message_id is_status_emoji_popover=../is_status_emoji_popover emoji_dict=this }}
{{/each}}
```

--------------------------------------------------------------------------------

---[FILE: emoji_showcase.hbs]---
Location: zulip-main/web/templates/popovers/emoji/emoji_showcase.hbs

```text
{{#with emoji_dict}}
<div class="emoji-showcase">
    {{#if is_realm_emoji}}
    <img src="{{url}}" class="emoji emoji-preview"/>
    {{else}}
    <div class="emoji emoji-preview emoji-{{emoji_code}}"></div>
    {{/if}}
    <div class="emoji-canonical-name" title="{{name}}">{{name}}</div>
</div>
{{/with}}
```

--------------------------------------------------------------------------------

---[FILE: left_sidebar_all_messages_popover.hbs]---
Location: zulip-main/web/templates/popovers/left_sidebar/left_sidebar_all_messages_popover.hbs

```text
<div class="popover-menu" data-simplebar data-simplebar-tab-index="-1">
    <ul role="menu" class="popover-menu-list">
        {{#if is_home_view}}
        {{#if unread_messages_present}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="popover-menu-link mark_all_messages_as_read" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-mark-as-read" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Mark messages as read" }}</span>
            </a>
        </li>
        {{/if}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="popover-menu-link toggle_display_unread_message_count" tabindex="0">
                {{#if show_unread_count}}
                <i class="popover-menu-icon zulip-icon zulip-icon-hide" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Hide unread counter" }}</span>
                {{else}}
                <i class="popover-menu-icon zulip-icon zulip-icon-eye" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Show unread counter" }}</span>
                {{/if}}
            </a>
        </li>
        {{else}}
        <li role="none" class="link-item popover-menu-list-item no-auto-hide-left-sidebar-overlay">
            <a role="menuitem" class="set-home-view popover-menu-link" data-view-code="{{view_code}}" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-house" aria-hidden="true"></i>
                <span class="popover-menu-label">
                    {{#tr}}
                        Make <z-highlight>combined feed</z-highlight> my home view
                        {{#*inline "z-highlight"}}<b class="highlighted-element">{{> @partial-block}}</b>{{/inline}}
                    {{/tr}}
                </span>
            </a>
        </li>
        {{/if}}
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: left_sidebar_drafts_popover.hbs]---
Location: zulip-main/web/templates/popovers/left_sidebar/left_sidebar_drafts_popover.hbs

```text
<div class="popover-menu" data-simplebar data-simplebar-tab-index="-1">
    <ul role="menu" class="popover-menu-list">
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" id="delete_all_drafts_sidebar" class="popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-trash" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Delete all drafts" }}</span>
            </a>
        </li>
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: left_sidebar_inbox_popover.hbs]---
Location: zulip-main/web/templates/popovers/left_sidebar/left_sidebar_inbox_popover.hbs

```text
<div class="popover-menu" data-simplebar data-simplebar-tab-index="-1">
    <ul role="menu" class="popover-menu-list">
        {{#if is_home_view}}
        {{#if unread_messages_present}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="popover-menu-link mark_all_messages_as_read" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-mark-as-read" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Mark messages as read" }}</span>
            </a>
        </li>
        {{/if}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="popover-menu-link toggle_display_unread_message_count" tabindex="0">
                {{#if show_unread_count}}
                <i class="popover-menu-icon zulip-icon zulip-icon-hide" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Hide unread counter" }}</span>
                {{else}}
                <i class="popover-menu-icon zulip-icon zulip-icon-eye" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Show unread counter" }}</span>
                {{/if}}
            </a>
        </li>
        {{else}}
        <li role="none" class="link-item popover-menu-list-item no-auto-hide-left-sidebar-overlay">
            <a role="menuitem" class="set-home-view popover-menu-link" data-view-code="{{view_code}}" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-house" aria-hidden="true"></i>
                <span class="popover-menu-label">
                    {{#tr}}
                        Make <z-highlight>inbox</z-highlight> my home view
                        {{#*inline "z-highlight"}}<b class="highlighted-element">{{> @partial-block}}</b>{{/inline}}
                    {{/tr}}
                </span>
            </a>
        </li>
        {{/if}}
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: left_sidebar_recent_view_popover.hbs]---
Location: zulip-main/web/templates/popovers/left_sidebar/left_sidebar_recent_view_popover.hbs

```text
<div class="popover-menu" data-simplebar data-simplebar-tab-index="-1">
    <ul role="menu" class="popover-menu-list">
        {{#if is_home_view}}
        {{#if unread_messages_present}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="popover-menu-link mark_all_messages_as_read" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-mark-as-read" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Mark messages as read" }}</span>
            </a>
        </li>
        {{/if}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="popover-menu-link toggle_display_unread_message_count" tabindex="0">
                {{#if show_unread_count}}
                <i class="popover-menu-icon zulip-icon zulip-icon-hide" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Hide unread counter" }}</span>
                {{else}}
                <i class="popover-menu-icon zulip-icon zulip-icon-eye" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Show unread counter" }}</span>
                {{/if}}
            </a>
        </li>
        {{else}}
        <li role="none" class="link-item popover-menu-list-item no-auto-hide-left-sidebar-overlay">
            <a role="menuitem" class="set-home-view popover-menu-link" data-view-code="{{view_code}}" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-house" aria-hidden="true"></i>
                <span class="popover-menu-label">
                    {{#tr}}
                        Make <z-highlight>recent conversations</z-highlight> my home view
                        {{#*inline "z-highlight"}}<b class="highlighted-element">{{> @partial-block}}</b>{{/inline}}
                    {{/tr}}
                </span>
            </a>
        </li>
        {{/if}}
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: left_sidebar_starred_messages_popover.hbs]---
Location: zulip-main/web/templates/popovers/left_sidebar/left_sidebar_starred_messages_popover.hbs

```text
<div class="popover-menu no-auto-hide-left-sidebar-overlay" data-simplebar data-simplebar-tab-index="-1">
    <ul role="menu" class="popover-menu-list">
        {{#if show_unstar_all_button}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" id="unstar_all_messages" class="popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-star" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Unstar all messages" }}</span>
            </a>
        </li>
        {{/if}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" id="toggle_display_starred_msg_count" class="popover-menu-link" tabindex="0">
                {{#if starred_message_counts}}
                <i class="popover-menu-icon zulip-icon zulip-icon-hide" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Hide starred message count" }}</span>
                {{else}}
                <i class="popover-menu-icon zulip-icon zulip-icon-eye" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Show starred message count" }}</span>
                {{/if}}
            </a>
        </li>
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: left_sidebar_stream_actions_popover.hbs]---
Location: zulip-main/web/templates/popovers/left_sidebar/left_sidebar_stream_actions_popover.hbs

```text
<div class="popover-menu no-auto-hide-left-sidebar-overlay" id="stream-actions-menu-popover" data-simplebar data-simplebar-tab-index="-1">
    <ul role="menu" class="popover-menu-list" data-stream-id="{{ stream.stream_id }}" data-name="{{ stream.name }}">
        <li role="none" class="popover-stream-header text-item popover-menu-list-item">
            <span class="stream-privacy-original-color-{{stream.stream_id}} stream-privacy filter-icon" style="color: {{stream.color}}">
                {{> ../../stream_privacy
                  invite_only=stream.invite_only
                  is_web_public=stream.is_web_public }}
            </span>
            <span class="popover-stream-name">{{stream.name}}</span>
        </li>
        <li role="separator" class="popover-menu-separator"></li>
        {{#if has_unread_messages}}
        <li role="none" class="link-item popover-menu-list-item hidden-for-spectators">
            <a role="menuitem" class="mark_stream_as_read popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-mark-as-read" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Mark all messages as read"}}</span>
            </a>
        </li>
        {{else}}
        <li role="none" class="link-item popover-menu-list-item hidden-for-spectators">
            <a role="menuitem" class="mark_stream_as_unread popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-mark-as-unread" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Mark all messages as unread"}}</span>
            </a>
        </li>
        {{/if}}
        {{#if show_go_to_channel_feed}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="stream-popover-go-to-channel-feed popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-all-messages" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Go to channel feed" }}</span>
            </a>
        </li>
        {{/if}}
        {{#if show_go_to_list_of_topics}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" href="{{stream.list_of_topics_view_url}}" class="stream-popover-go-to-list-of-topics navigate-link-on-enter popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-topic-list" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Go to list of topics" }}</span>
                {{../popover_hotkey_hints "Y"}}
            </a>
        </li>
        {{/if}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" class="copy_stream_link popover-menu-link" data-clipboard-text="{{ stream.url }}" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-link-alt" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Copy link to channel" }}</span>
            </a>
        </li>
        <li role="separator" class="popover-menu-separator hidden-for-spectators"></li>
        <li role="none" class="link-item popover-menu-list-item hidden-for-spectators">
            <a role="menuitem" href="{{stream_edit_hash}}" class="open_stream_settings popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-gear" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Channel settings" }}</span>
            </a>
        </li>
        <li role="none" class="link-item popover-menu-list-item hidden-for-spectators">
            <a role="menuitem" class="pin_to_top popover-menu-link" tabindex="0">
                {{#if stream.pin_to_top}}
                <i class="popover-menu-icon zulip-icon zulip-icon-unpin" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Unpin channel from top"}}</span>
                {{else}}
                <i class="popover-menu-icon zulip-icon zulip-icon-pin" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Pin channel to top"}}</span>
                {{/if}}
            </a>
        </li>
        <li role="none" class="link-item popover-menu-list-item hidden-for-spectators">
            <a role="menuitem" class="toggle_stream_muted popover-menu-link" tabindex="0">
                {{#if stream.is_muted}}
                <i class="popover-menu-icon zulip-icon zulip-icon-unmute" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Unmute channel"}}</span>
                {{else}}
                <i class="popover-menu-icon zulip-icon zulip-icon-mute" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Mute channel"}}</span>
                {{/if}}
            </a>
        </li>
        {{#unless stream.is_archived}}
        <li role="none" class="link-item popover-menu-list-item hidden-for-spectators">
            <a role="menuitem" class="popover_sub_unsub_button popover-menu-link" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-circle-x" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Unsubscribe"}}</span>
            </a>
        </li>
        <li role="separator" class="popover-menu-separator hidden-for-spectators"></li>
        <li role="none" class="link-item popover-menu-list-item hidden-for-spectators">
            <a role="menuitem" class="choose_stream_color popover-menu-link" data-stream-id="{{ stream.stream_id }}" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-pipette" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Change color"}}</span>
            </a>
        </li>
        {{/unless}}
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: left_sidebar_stream_setting_popover.hbs]---
Location: zulip-main/web/templates/popovers/left_sidebar/left_sidebar_stream_setting_popover.hbs

```text
<div class="popover-menu" data-simplebar data-simplebar-tab-index="-1">
    <ul role="menu" class="popover-menu-list">
        <li role="none" class="link-item popover-menu-list-item">
            <a href="#channels/available" role="menuitem" class="popover-menu-link navigate_and_close_popover" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-browse-channels" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Browse channels" }}</span>
            </a>
        </li>
        <li role="none" class="link-item popover-menu-list-item">
            <a href="#channels/new" role="menuitem" class="popover-menu-link navigate_and_close_popover" tabindex="0">
                <i class="popover-menu-icon zulip-icon zulip-icon-square-plus" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "Create a channel" }}</span>
            </a>
        </li>
    </ul>
</div>
```

--------------------------------------------------------------------------------

````
