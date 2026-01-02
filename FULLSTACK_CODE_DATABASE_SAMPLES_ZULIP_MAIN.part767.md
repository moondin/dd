---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 767
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 767 of 1290)

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

---[FILE: left_sidebar_topic_actions_popover.hbs]---
Location: zulip-main/web/templates/popovers/left_sidebar/left_sidebar_topic_actions_popover.hbs

```text
<div class="popover-menu no-auto-hide-left-sidebar-overlay" id="topic-actions-menu-popover" data-simplebar data-simplebar-tab-index="-1">
    <ul role="menu" class="popover-menu-list">
        <li role="none" class="popover-topic-header text-item popover-menu-list-item">
            <span class="popover-topic-name {{#if is_empty_string_topic}}empty-topic-display{{/if}}">{{topic_display_name}}</span>
        </li>
        {{!-- Group 1 --}}
        {{#unless is_spectator}}
            {{#unless stream_archived}}
            <li role="separator" class="popover-menu-separator"></li>
            <li role="none" class="popover-menu-list-item">
                <div role="group" class="tab-picker popover-menu-tab-group" aria-label="{{t 'Topic visibility' }}">
                    <input type="radio" id="sidebar-topic-muted-policy" class="tab-option" name="sidebar-topic-visibility-select" data-visibility-policy="{{all_visibility_policies.MUTED}}" {{#if (eq visibility_policy all_visibility_policies.MUTED)}}checked{{/if}} />
                    <label role="menuitemradio" class="tab-option-content tippy-zulip-delayed-tooltip" for="sidebar-topic-muted-policy" aria-label="{{t 'Mute' }}" data-tippy-content="{{t 'Mute' }}" tabindex="0">
                        <i class="zulip-icon zulip-icon-mute" aria-hidden="true"></i>
                    </label>
                    <input type="radio" id="sidebar-topic-inherit-policy" class="tab-option" name="sidebar-topic-visibility-select" data-visibility-policy="{{all_visibility_policies.INHERIT}}" {{#if (eq visibility_policy all_visibility_policies.INHERIT)}}checked{{/if}} />
                    <label role="menuitemradio" class="tab-option-content tippy-zulip-delayed-tooltip" for="sidebar-topic-inherit-policy" aria-label="{{t 'Default' }}" data-tippy-content="{{t 'Default' }}" tabindex="0">
                        <i class="zulip-icon zulip-icon-inherit" aria-hidden="true"></i>
                    </label>
                    {{#if (or stream_muted topic_unmuted)}}
                    <input type="radio" id="sidebar-topic-unmuted-policy" class="tab-option" name="sidebar-topic-visibility-select" data-visibility-policy="{{all_visibility_policies.UNMUTED}}" {{#if (eq visibility_policy all_visibility_policies.UNMUTED)}}checked{{/if}} />
                    <label role="menuitemradio" class="tab-option-content tippy-zulip-delayed-tooltip" for="sidebar-topic-unmuted-policy" aria-label="{{t 'Unmute' }}" data-tippy-content="{{t 'Unmute' }}" tabindex="0">
                        <i class="zulip-icon zulip-icon-unmute" aria-hidden="true"></i>
                    </label>
                    {{/if}}
                    <input type="radio" id="sidebar-topic-followed-policy" class="tab-option" name="sidebar-topic-visibility-select" data-visibility-policy="{{all_visibility_policies.FOLLOWED}}" {{#if (eq visibility_policy all_visibility_policies.FOLLOWED)}}checked{{/if}} />
                    <label role="menuitemradio" class="tab-option-content tippy-zulip-delayed-tooltip" for="sidebar-topic-followed-policy" aria-label="{{t 'Follow' }}" data-tippy-content="{{t 'Follow' }}" tabindex="0">
                        <i class="zulip-icon zulip-icon-follow" aria-hidden="true"></i>
                    </label>
                    <span class="slider"></span>
                </div>
            </li>
            {{/unless}}
        {{/unless}}
        {{#if is_topic_empty}}
            <li role="separator" class="popover-menu-separator"></li>
            <li role="none" class="popover-menu-list-item text-item italic">
                <span class="popover-menu-label">{{t "There are no messages in this topic." }}</span>
            </li>
        {{else}}
            {{!-- Group 2 --}}
            <li role="separator" class="popover-menu-separator"></li>
            {{#if (and show_ai_features can_summarize_topics)}}
            <li role="none" class="link-item popover-menu-list-item">
                <a role="menuitem" class="sidebar-popover-summarize-topic popover-menu-link" tabindex="0">
                    <i class="popover-menu-icon fa fa-magic" aria-hidden="true"></i>
                    <span class="popover-menu-label">{{t "Summarize recent messages"}}</span>
                </a>
            </li>
            {{/if}}
            {{#if has_starred_messages}}
            <li role="none" class="link-item popover-menu-list-item hidden-for-spectators">
                <a role="menuitem" class="sidebar-popover-unstar-all-in-topic popover-menu-link" tabindex="0">
                    <i class="popover-menu-icon zulip-icon zulip-icon-star" aria-hidden="true"></i>
                    <span class="popover-menu-label">{{t "Unstar all messages in topic" }}</span>
                </a>
            </li>
            {{/if}}
            {{#if has_unread_messages}}
            <li role="none" class="link-item popover-menu-list-item hidden-for-spectators">
                <a role="menuitem" class="sidebar-popover-mark-topic-read popover-menu-link" tabindex="0">
                    <i class="popover-menu-icon zulip-icon zulip-icon-mark-as-read" aria-hidden="true"></i>
                    <span class="popover-menu-label">{{t "Mark all messages as read" }}</span>
                </a>
            </li>
            {{else}}
            <li role="none" class="link-item popover-menu-list-item hidden-for-spectators">
                <a role="menuitem" class="sidebar-popover-mark-topic-unread popover-menu-link" tabindex="0">
                    <i class="popover-menu-icon zulip-icon zulip-icon-mark-as-unread" aria-hidden="true"></i>
                    <span class="popover-menu-label">{{t "Mark all messages as unread" }}</span>
                </a>
            </li>
            {{/if}}
            <li role="none" class="link-item popover-menu-list-item">
                <a role="menuitem" class="sidebar-popover-copy-link-to-topic popover-menu-link" data-clipboard-text="{{ url }}" tabindex="0">
                    <i class="popover-menu-icon zulip-icon zulip-icon-link-alt" aria-hidden="true"></i>
                    <span class="popover-menu-label">{{t "Copy link to topic" }}</span>
                </a>
            </li>
            {{!-- Group 3 --}}
            {{#if (or can_move_topic can_rename_topic is_realm_admin)}}
                {{#unless stream_archived}}
                <li role="separator" class="popover-menu-separator"></li>
                {{/unless}}
            {{/if}}
            {{#if can_move_topic}}
            <li role="none" class="link-item popover-menu-list-item">
                <a role="menuitem" class="sidebar-popover-move-topic-messages popover-menu-link" tabindex="0">
                    <i class="popover-menu-icon zulip-icon zulip-icon-move-alt" aria-hidden="true"></i>
                    <span class="popover-menu-label">{{t "Move topic" }}</span>
                </a>
            </li>
            {{else if can_rename_topic}}
            <li role="none" class="link-item popover-menu-list-item">
                <a role="menuitem" class="sidebar-popover-rename-topic-messages popover-menu-link" tabindex="0">
                    <i class="popover-menu-icon zulip-icon zulip-icon-rename" aria-hidden="true"></i>
                    <span class="popover-menu-label">{{t "Rename topic" }}</span>
                </a>
            </li>
            {{/if}}
            {{#if (and can_resolve_topic (not is_empty_string_topic))}}
            <li role="none" class="link-item popover-menu-list-item">
                <a role="menuitem" class="sidebar-popover-toggle-resolved popover-menu-link" tabindex="0">
                    {{# if topic_is_resolved }}
                    <i class="popover-menu-icon zulip-icon zulip-icon-check-x" aria-hidden="true"></i>
                    <span class="popover-menu-label">{{t "Mark as unresolved"}}</span>
                    {{else}}
                    <i class="popover-menu-icon zulip-icon zulip-icon-check" aria-hidden="true"></i>
                    <span class="popover-menu-label">{{t "Mark as resolved"}}</span>
                    {{/if}}
                </a>
            </li>
            {{/if}}
            {{#if (and is_realm_admin (not stream_archived))}}
            <li role="none" class="link-item popover-menu-list-item">
                <a role="menuitem" class="sidebar-popover-delete-topic-messages popover-menu-link" tabindex="0">
                    <i class="popover-menu-icon zulip-icon zulip-icon-trash" aria-hidden="true"></i>
                    <span class="popover-menu-label">{{t "Delete topic"}}</span>
                </a>
            </li>
            {{/if}}
        {{/if}}
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: left_sidebar_views_popover.hbs]---
Location: zulip-main/web/templates/popovers/left_sidebar/left_sidebar_views_popover.hbs

```text
<div class="popover-menu" data-simplebar data-simplebar-tab-index="-1">
    <ul role="menu" class="popover-menu-list condensed-views-popover-menu">
        {{#each views}}
            {{> left_sidebar_view_popover_item .}}
        {{/each}}
        {{#unless is_home_view_active}}
        <li role="separator" class="popover-menu-separator"></li>
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
        {{/unless}}
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: left_sidebar_view_popover_item.hbs]---
Location: zulip-main/web/templates/popovers/left_sidebar/left_sidebar_view_popover_item.hbs

```text
<li role="none" class="link-item popover-menu-list-item views-popover-menu-{{css_class_suffix}}">
    <a href="#{{fragment}}" role="menuitem" class="popover-menu-link tippy-left-sidebar-tooltip" data-tooltip-template-id="{{tooltip_template_id}}" tabindex="0">
        <i class="popover-menu-icon zulip-icon {{icon}}" aria-hidden="true"></i>
        {{#if has_unread_count}}
        <span class="label-and-unread-wrapper">
            <span class="popover-menu-label">{{name}}</span>
            <span class="unread_count {{unread_count_type}}">{{#if unread_count}}{{unread_count}}{{/if}}</span>
            {{#if supports_masked_unread}}
            <span class="masked_unread_count">
                <i class="zulip-icon zulip-icon-masked-unread"></i>
            </span>
            {{/if}}
        </span>
        {{else}}
        <span class="popover-menu-label">{{name}}</span>
        {{/if}}
    </a>
</li>
```

--------------------------------------------------------------------------------

---[FILE: navbar_gear_menu_popover.hbs]---
Location: zulip-main/web/templates/popovers/navbar/navbar_gear_menu_popover.hbs

```text
<div class="popover-menu" id="gear-menu-dropdown" aria-labelledby="settings-dropdown" data-simplebar data-simplebar-tab-index="-1">
    <div class="org-info-container">
        <div class="org-info org-name">{{realm_name}}</div>
        <div class="org-info org-url">{{realm_url}}</div>
        {{#if is_self_hosted }}
        <div class="org-info org-version">
            <a href="#about-zulip" class="navigate-link-on-enter popover-menu-link">{{version_display_string}}</a>
        </div>
        {{#if server_needs_upgrade }}
        <div class="org-info org-upgrade">
            <a href="https://zulip.readthedocs.io/en/stable/production/upgrade.html" target="_blank" rel="noopener noreferrer" class="navigate-link-on-enter popover-menu-link">{{t 'Upgrade to the latest release' }}</a>
        </div>
        {{/if}}
        {{else}}
        <div class="org-info org-plan hidden-for-spectators">
            {{#if is_demo_organization }}
            <a href="/help/demo-organizations" target="_blank" rel="noopener noreferrer" class="navigate-link-on-enter popover-menu-link">{{t "Demo organization" }}</a>
            {{else if is_plan_limited }}
            <a href="/plans/" target="_blank" rel="noopener noreferrer" class="navigate-link-on-enter popover-menu-link">Zulip Cloud Free</a>
            {{else if is_plan_standard}}
            <a href="/plans/" target="_blank" rel="noopener noreferrer" class="navigate-link-on-enter popover-menu-link">Zulip Cloud Standard</a>
            {{else if is_plan_standard_sponsored_for_free}}
            <a href="/plans/" target="_blank" rel="noopener noreferrer" class="navigate-link-on-enter popover-menu-link">Zulip Cloud Standard (sponsored)</a>
            {{else if is_plan_plus}}
            <a href="/plans/" target="_blank" rel="noopener noreferrer" class="navigate-link-on-enter popover-menu-link">Zulip Cloud Plus</a>
            {{/if}}
        </div>
        {{/if}}
        {{#if (and (not is_self_hosted) user_has_billing_access (not is_plan_standard_sponsored_for_free)) }}
        {{#if sponsorship_pending }}
        <div class="org-info org-upgrade">
            <a href="/sponsorship/" target="_blank" rel="noopener noreferrer" class="navigate-link-on-enter popover-menu-link">{{t "Sponsorship request pending" }}</a>
        </div>
        {{else}}
        {{#if (and is_demo_organization is_owner) }}
        <div class="org-info org-upgrade">
            <a class="convert-demo-organization popover-menu-link">{{t "Convert into permanent organization" }}</a>
        </div>
        {{/if}}
        {{#if (and is_plan_limited (not is_demo_organization))}}
        <div class="org-info org-upgrade">
            <a href="/upgrade/" target="_blank" rel="noopener noreferrer" class="navigate-link-on-enter popover-menu-link">{{t "Upgrade to {standard_plan_name}" }}</a>
        </div>
        {{/if}}
        {{#unless (or is_org_on_paid_plan is_demo_organization)}}
        {{#if is_education_org }}
        <div class="org-info org-upgrade">
            <a href="/sponsorship/" target="_blank" rel="noopener noreferrer" class="navigate-link-on-enter popover-menu-link">{{t 'Request education pricing' }}</a>
        </div>
        {{else if (not is_business_org) }}
        <div class="org-info org-upgrade">
            <a href="/sponsorship/" target="_blank" rel="noopener noreferrer" class="navigate-link-on-enter popover-menu-link">{{t 'Request sponsorship' }}</a>
        </div>
        {{/if}}
        {{/unless}}
        {{/if}}
        {{/if}}
    </div>
    <ul role="menu" class="popover-menu-list">
        {{!-- Group 1 --}}
        <li role="none" class="link-item popover-menu-list-item hidden-for-spectators">
            <a role="menuitem" href="#channels/subscribed" class="navigate-link-on-enter popover-menu-link">
                <i class="popover-menu-icon zulip-icon zulip-icon-hash" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'Channel settings' }}</span>
            </a>
        </li>
        <li role="none" class="link-item popover-menu-list-item admin-menu-item hidden-for-spectators">
            <a role="menuitem" href="#organization" class="navigate-link-on-enter popover-menu-link">
                <i class="popover-menu-icon zulip-icon zulip-icon-building" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'Organization settings' }}</span>
            </a>
        </li>
        {{#unless is_guest}}
        <li role="none" class="link-item popover-menu-list-item hidden-for-spectators">
            <a role="menuitem" href="#groups/your" class="navigate-link-on-enter popover-menu-link">
                <i class="popover-menu-icon zulip-icon zulip-icon-user-group-cog" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'Group settings' }}</span>
            </a>
        </li>
        {{/unless}}
        <li role="none" class="link-item popover-menu-list-item hidden-for-spectators">
            <a role="menuitem" href="#settings" class="navigate-link-on-enter popover-menu-link">
                <i class="popover-menu-icon zulip-icon zulip-icon-tool" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'Personal settings' }}</span>
            </a>
        </li>
        {{#unless is_guest}}
        <li role="none" class="link-item popover-menu-list-item hidden-for-spectators">
            <a role="menuitem" href="/stats" target="_blank" rel="noopener noreferrer" class="navigate-link-on-enter popover-menu-link">
                <i class="popover-menu-icon zulip-icon zulip-icon-bar-chart" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'Usage statistics' }}</span>
            </a>
        </li>
        {{/unless}}
        <li role="none" class="popover-menu-list-item only-visible-for-spectators">
            <div role="group" class="theme-switcher tab-picker" aria-label="{{t 'App theme' }}">
                <input type="radio" id="select-automatic-theme" class="tab-option" name="theme-select" data-theme-code="{{color_scheme_values.automatic.code}}" {{#if (eq user_color_scheme color_scheme_values.automatic.code)}}checked{{/if}} />
                <label role="menuitemradio" class="tab-option-content tippy-zulip-delayed-tooltip" for="select-automatic-theme" aria-label="{{t 'Select automatic theme' }}" data-tooltip-template-id="automatic-theme-template" tabindex="0">
                    <i class="zulip-icon zulip-icon-monitor" aria-hidden="true"></i>
                </label>
                <input type="radio" id="select-light-theme" class="tab-option" name="theme-select" data-theme-code="{{color_scheme_values.light.code}}" {{#if (eq user_color_scheme color_scheme_values.light.code)}}checked{{/if}} />
                <label role="menuitemradio" class="tab-option-content tippy-zulip-delayed-tooltip" for="select-light-theme" aria-label="{{t 'Select light theme' }}" data-tippy-content="{{t 'Light theme' }}" tabindex="0">
                    <i class="zulip-icon zulip-icon-sun" aria-hidden="true"></i>
                </label>
                <input type="radio" id="select-dark-theme" class="tab-option" name="theme-select" data-theme-code="{{color_scheme_values.dark.code}}" {{#if (eq user_color_scheme color_scheme_values.dark.code)}}checked{{/if}} />
                <label role="menuitemradio" class="tab-option-content tippy-zulip-delayed-tooltip" for="select-dark-theme" aria-label="{{t 'Select dark theme' }}" data-tippy-content="{{t 'Dark theme' }}" tabindex="0">
                    <i class="zulip-icon zulip-icon-moon" aria-hidden="true"></i>
                </label>
                <span class="slider"></span>
            </div>
        </li>
        <li role="none" class="popover-menu-list-item only-visible-for-spectators">
            <div class="info-density-controls">
                {{> ../../settings/info_density_control_button_group
                  property="web_font_size_px"
                  default_icon_class="zulip-icon-type-big"
                  property_value=web_font_size_px
                  for_settings_ui=false
                  prefix="gear_menu_"
                  }}
                {{> ../../settings/info_density_control_button_group
                  property="web_line_height_percent"
                  default_icon_class="zulip-icon-line-height-big"
                  property_value=web_line_height_percent
                  for_settings_ui=false
                  prefix="gear_menu_"
                  }}
            </div>
        </li>
        <li role="none" class="link-item popover-menu-list-item only-visible-for-spectators">
            <a role="menuitem" tabindex="0" class="change-language-spectator popover-menu-link">
                <i class="popover-menu-icon zulip-icon zulip-icon-f-globe" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'Select language' }}</span>
            </a>
        </li>
        {{!-- Group 2 --}}
        <li role="separator" class="popover-menu-separator"></li>
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" href="{{ apps_page_url }}" target="_blank" rel="noopener noreferrer" class="navigate-link-on-enter popover-menu-link">
                <i class="popover-menu-icon zulip-icon zulip-icon-monitor" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'Desktop & mobile apps' }}</span>
            </a>
        </li>
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" href="/integrations/" target="_blank" rel="noopener noreferrer" class="navigate-link-on-enter popover-menu-link">
                <i class="popover-menu-icon zulip-icon zulip-icon-git-pull-request" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'Integrations' }}</span>
            </a>
        </li>
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" href="/api/" target="_blank" rel="noopener noreferrer" class="navigate-link-on-enter popover-menu-link">
                <i class="popover-menu-icon zulip-icon zulip-icon-file-text" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'API documentation' }}</span>
            </a>
        </li>
        {{#if (and user_has_billing_access show_billing)}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" href="/billing/" target="_blank" rel="noopener noreferrer" class="navigate-link-on-enter popover-menu-link">
                <i class="popover-menu-icon zulip-icon zulip-icon-credit-card" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'Billing' }}</span>
            </a>
        </li>
        {{/if}}
        {{#if promote_sponsoring_zulip}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" href="https://zulip.com/help/support-zulip-project" target="_blank" rel="noopener noreferrer" class="navigate-link-on-enter popover-menu-link">
                <i class="popover-menu-icon zulip-icon zulip-icon-heart" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'Support Zulip' }}</span>
            </a>
        </li>
        {{/if}}
        {{#if user_has_billing_access}}
        {{#if show_remote_billing }}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" href="/self-hosted-billing/" id="open-self-hosted-billing" target="_blank" rel="noopener noreferrer" class="navigate-link-on-enter popover-menu-link">
                <i class="popover-menu-icon zulip-icon zulip-icon-rocket" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'Plan management' }}</span>
            </a>
        </li>
        {{/if}}
        {{#if show_plans}}
        {{!-- This will be hidden for self hosted realms since they will have corporate disabled. --}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" href="/plans/" target="_blank" rel="noopener noreferrer" class="navigate-link-on-enter popover-menu-link">
                <i class="popover-menu-icon zulip-icon zulip-icon-rocket" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'Plans and pricing' }}</span>
            </a>
        </li>
        {{/if}}
        {{/if}}
        {{!-- Group 3 --}}
        {{#if (or can_invite_users_by_email can_create_multiuse_invite is_spectator)}}
        <li role="separator" class="popover-menu-separator"></li>
        {{/if}}
        {{#if (or can_invite_users_by_email can_create_multiuse_invite)}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" tabindex="0" class="invite-user-link popover-menu-link">
                <i class="popover-menu-icon zulip-icon zulip-icon-user-plus" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'Invite users' }}</span>
            </a>
        </li>
        {{/if}}
        <li role="none" class="link-item popover-menu-list-item only-visible-for-spectators">
            <a role="menuitem" href="{{login_link}}" class="navigate-link-on-enter popover-menu-link">
                <i class="popover-menu-icon zulip-icon zulip-icon-log-in" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'Log in' }}</span>
            </a>
        </li>
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: navbar_help_menu_popover.hbs]---
Location: zulip-main/web/templates/popovers/navbar/navbar_help_menu_popover.hbs

```text
<div class="popover-menu" id="help-menu-dropdown" aria-labelledby="help-menu" data-simplebar data-simplebar-tab-index="-1">
    <ul role="menu" class="popover-menu-list">
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" href="/help/" target="_blank" rel="noopener noreferrer" class="navigate-link-on-enter popover-menu-link">
                <i class="popover-menu-icon zulip-icon zulip-icon-help" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'Help center' }}</span>
            </a>
        </li>
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" tabindex="0" class="navigate-link-on-enter popover-menu-link" data-overlay-trigger="keyboard-shortcuts">
                <i class="popover-menu-icon zulip-icon zulip-icon-keyboard" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'Keyboard shortcuts' }}</span>
                {{popover_hotkey_hints "?"}}
            </a>
        </li>
        <li role="none" class="link-item popover-menu-list-item hidden-for-spectators">
            <a role="menuitem" tabindex="0" class="navigate-link-on-enter popover-menu-link" data-overlay-trigger="message-formatting">
                <i class="popover-menu-icon zulip-icon zulip-icon-edit" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'Message formatting' }}</span>
            </a>
        </li>
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" tabindex="0" class="navigate-link-on-enter popover-menu-link" data-overlay-trigger="search-operators">
                <i class="popover-menu-icon zulip-icon zulip-icon-manage-search" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'Search filters' }}</span>
            </a>
        </li>
        <li role="none" class="link-item popover-menu-list-item" id="gear_menu_about_zulip">
            <a role="menuitem" href="#about-zulip" class="navigate-link-on-enter popover-menu-link">
                <i class="popover-menu-icon zulip-icon zulip-icon-info" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t "About Zulip" }}</span>
            </a>
        </li>
        {{#if corporate_enabled}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" href="/help/contact-support" target="_blank" rel="noopener noreferrer" class="navigate-link-on-enter popover-menu-link">
                <i class="popover-menu-icon zulip-icon zulip-icon-life-buoy" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'Contact support' }}</span>
            </a>
        </li>
        {{#if (or is_admin is_owner)}}
        <li role="none" class="link-item popover-menu-list-item">
            <a role="menuitem" href="/contact-sales" target="_blank" rel="noopener noreferrer" class="navigate-link-on-enter popover-menu-link">
                <i class="popover-menu-icon zulip-icon zulip-icon-handshake" aria-hidden="true"></i>
                <span class="popover-menu-label">{{t 'Contact sales' }}</span>
            </a>
        </li>
        {{/if}}
        {{/if}}
    </ul>
</div>
```

--------------------------------------------------------------------------------

---[FILE: navbar_personal_menu_popover.hbs]---
Location: zulip-main/web/templates/popovers/navbar/navbar_personal_menu_popover.hbs

```text
<div class="popover-menu" id="personal-menu-dropdown" data-simplebar data-simplebar-tab-index="-1">
    <nav class="personal-menu-nav">
        <header class="personal-menu-header">
            <div class="avatar">
                <img class="avatar-image{{#if user_is_guest}} guest-avatar{{/if}}" src="{{user_avatar}}"/>

                {{#if is_active }}
                <span class="status-circle zulip-icon zulip-icon-{{user_circle_class}} {{user_circle_class}} user-circle hidden-for-spectators" data-tippy-placement="bottom" data-tippy-content="{{user_last_seen_time_status}}"></span>
                {{/if}}

            </div>
            <div class="text-area">
                <p class="full-name">{{user_full_name}}</p>
                <p class="user-type">{{user_type}}</p>
            </div>
        </header>
        <section class="dropdown-menu-list-section personal-menu-actions" data-user-id="{{user_id}}">
            <ul role="menu" class="popover-menu-list">
                {{#if status_content_available}}
                <li role="none" class="text-item popover-menu-list-item">
                    <span class="personal-menu-status-wrapper">
                        {{#if status_emoji_info}}
                            {{#if status_emoji_info.emoji_alt_code}}
                            <span class="emoji_alt_code">&nbsp;:{{status_emoji_info.emoji_name}}:</span>
                            {{else if status_emoji_info.url}}
                            <img src="{{status_emoji_info.url}}" class="emoji status_emoji" />
                            {{else}}
                            <span class="emoji status_emoji emoji-{{status_emoji_info.emoji_code}}"></span>
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
                    <a role="menuitem" tabindex="0" class="personal-menu-clear-status popover-menu-link" aria-label="{{t 'Clear status'}}" data-tippy-content="{{t 'Clear your status' }}">
                        <i class="personal-menu-clear-status-icon popover-menu-icon zulip-icon zulip-icon-x-circle" aria-hidden="true"></i>
                    </a>
                </li>
                {{!-- Group 1 --}}
                <li role="none" class="link-item popover-menu-list-item">
                    <a role="menuitem" tabindex="0" class="update_status_text popover-menu-link">
                        <i class="popover-menu-icon zulip-icon zulip-icon-smile-smaller" aria-hidden="true"></i>
                        <span class="popover-menu-label">{{t 'Edit status' }}</span>
                    </a>
                </li>
                {{else}}
                <li role="none" class="link-item hidden-for-spectators popover-menu-list-item">
                    <a role="menuitem" tabindex="0" class="update_status_text popover-menu-link">
                        <i class="popover-menu-icon zulip-icon zulip-icon-smile-smaller" aria-hidden="true"></i>
                        <span class="popover-menu-label">{{t 'Set status' }}</span>
                    </a>
                </li>
                {{/if}}
                {{#if invisible_mode}}
                <li role="none" class="link-item hidden-for-spectators popover-menu-list-item">
                    <a role="menuitem" tabindex="0" class="invisible_mode_turn_off popover-menu-link">
                        <i class="popover-menu-icon zulip-icon zulip-icon-play-circle" aria-hidden="true"></i>
                        <span class="popover-menu-label">{{t 'Turn off invisible mode' }}</span>
                    </a>
                </li>
                {{else}}
                <li role="none" class="link-item hidden-for-spectators popover-menu-list-item">
                    <a role="menuitem" tabindex="0" class="invisible_mode_turn_on popover-menu-link">
                        <i class="popover-menu-icon zulip-icon zulip-icon-stop-circle" aria-hidden="true"></i>
                        <span class="popover-menu-label">{{t 'Go invisible' }}</span>
                    </a>
                </li>
                {{/if}}
                {{!-- Group 2 --}}
                <li role="separator" class="popover-menu-separator"></li>
                <li role="none" class="link-item popover-menu-list-item">
                    <a role="menuitem" href="#user/{{user_id}}" tabindex="0" class="view_full_user_profile popover-menu-link navigate-link-on-enter">
                        <i class="popover-menu-icon zulip-icon zulip-icon-account" aria-hidden="true"></i>
                        <span class="popover-menu-label">{{t 'View your profile' }}</span>
                    </a>
                </li>
                <li role="none" class="link-item popover-menu-list-item">
                    <a role="menuitem" tabindex="0" class="narrow-self-direct-message popover-menu-link">
                        <i class="popover-menu-icon zulip-icon zulip-icon-users" aria-hidden="true"></i>
                        <span class="popover-menu-label">{{t 'View messages with yourself' }}</span>
                    </a>
                </li>
                <li role="none" class="link-item popover-menu-list-item">
                    <a role="menuitem" tabindex="0" class="narrow-messages-sent popover-menu-link">
                        <i class="popover-menu-icon zulip-icon zulip-icon-message-square" aria-hidden="true"></i>
                        <span class="popover-menu-label">{{t 'View messages sent' }}</span>
                    </a>
                </li>
                {{!-- Group 3 --}}
                <li role="separator" class="popover-menu-separator"></li>
                <li role="none" class="link-item popover-menu-list-item">
                    <a role="menuitem" href="#settings/profile" class="open-profile-settings popover-menu-link">
                        <i class="popover-menu-icon zulip-icon zulip-icon-tool" aria-hidden="true"></i>
                        <span class="popover-menu-label">{{t 'Settings' }}</span>
                    </a>
                </li>
                <li role="none" class="popover-menu-list-item">
                    <div role="group" class="tab-picker popover-menu-tab-group" aria-label="{{t 'App theme' }}">
                        <input type="radio" id="select-automatic-theme" class="tab-option" name="theme-select" data-theme-code="{{color_scheme_values.automatic.code}}" {{#if (eq user_color_scheme color_scheme_values.automatic.code)}}checked{{/if}} />
                        <label role="menuitemradio" class="tab-option-content tippy-zulip-delayed-tooltip" for="select-automatic-theme" aria-label="{{t 'Select automatic theme' }}" data-tooltip-template-id="automatic-theme-template" tabindex="0">
                            <i class="zulip-icon zulip-icon-monitor" aria-hidden="true"></i>
                        </label>
                        <input type="radio" id="select-light-theme" class="tab-option" name="theme-select" data-theme-code="{{color_scheme_values.light.code}}" {{#if (eq user_color_scheme color_scheme_values.light.code)}}checked{{/if}} />
                        <label role="menuitemradio" class="tab-option-content tippy-zulip-delayed-tooltip" for="select-light-theme" aria-label="{{t 'Select light theme' }}" data-tippy-content="{{t 'Light theme' }}" tabindex="0">
                            <i class="zulip-icon zulip-icon-sun" aria-hidden="true"></i>
                        </label>
                        <input type="radio" id="select-dark-theme" class="tab-option" name="theme-select" data-theme-code="{{color_scheme_values.dark.code}}" {{#if (eq user_color_scheme color_scheme_values.dark.code)}}checked{{/if}} />
                        <label role="menuitemradio" class="tab-option-content tippy-zulip-delayed-tooltip" for="select-dark-theme" aria-label="{{t 'Select dark theme' }}" data-tippy-content="{{t 'Dark theme' }}" tabindex="0">
                            <i class="zulip-icon zulip-icon-moon" aria-hidden="true"></i>
                        </label>
                        <span class="slider"></span>
                    </div>
                </li>
                <li role="none" class="popover-menu-list-item">
                    <div class="info-density-controls">
                        {{> ../../settings/info_density_control_button_group
                          property="web_font_size_px"
                          default_icon_class="zulip-icon-type-big"
                          property_value=web_font_size_px
                          for_settings_ui=false
                          prefix="personal_menu_"
                          }}
                        {{> ../../settings/info_density_control_button_group
                          property="web_line_height_percent"
                          default_icon_class="zulip-icon-line-height-big"
                          property_value=web_line_height_percent
                          for_settings_ui=false
                          prefix="personal_menu_"
                          }}
                    </div>
                </li>
                {{!-- Group 4 --}}
                <li role="separator" class="popover-menu-separator"></li>
                <li role="none" class="link-item popover-menu-list-item">
                    <a role="menuitem" class="logout_button hidden-for-spectators popover-menu-link" tabindex="0">
                        <i class="popover-menu-icon zulip-icon zulip-icon-log-out" aria-hidden="true"></i>
                        <span class="popover-menu-label">{{t 'Log out' }}</span>
                    </a>
                </li>
            </ul>
        </section>
    </nav>
</div>
```

--------------------------------------------------------------------------------

````
