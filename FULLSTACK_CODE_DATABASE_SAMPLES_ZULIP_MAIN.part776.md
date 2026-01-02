---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 776
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 776 of 1290)

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

---[FILE: user_group_creation_form.hbs]---
Location: zulip-main/web/templates/user_group_settings/user_group_creation_form.hbs

```text
<div class="hide two-pane-settings-right-simplebar-container" id="user-group-creation" tabindex="-1" role="dialog"
  aria-label="{{t 'User group creation' }}">
    <form id="user_group_creation_form">
        <div class="two-pane-settings-creation-simplebar-container" data-simplebar data-simplebar-tab-index="-1">
            <div class="alert user_group_create_info"></div>
            <div id="user_group_creating_indicator"></div>
            <div class="user-group-creation-body">
                <div class="configure_user_group_settings user_group_creation">
                    <section id="user-group-name-container">
                        <label for="create_user_group_name" class="settings-field-label">
                            {{t "User group name" }}
                        </label>
                        <input type="text" name="user_group_name" id="create_user_group_name" class="settings_text_input"
                          placeholder="{{t 'User group name' }}" value="" autocomplete="off" maxlength="{{ max_user_group_name_length }}"/>
                        <div id="user_group_name_error" class="user_group_creation_error"></div>
                        <a id="deactivated_group_rename"></a>
                    </section>
                    <section id="user-group-description-container">
                        <label for="create_user_group_description" class="settings-field-label">
                            {{t "User group description" }}
                        </label>
                        <input type="text" name="user_group_description" id="create_user_group_description" class="settings_text_input"
                          placeholder="{{t 'User group description' }}" value="" autocomplete="off" />
                    </section>
                    <section id="user-group-permission-container">
                        <div class="group-permissions settings-subsection-parent" id="new_group_permission_settings">
                            <div class="subsection-header">
                                <h3 class="user_group_setting_subsection_title">{{t "Group permissions" }}
                                </h3>
                            </div>

                            {{> group_permissions prefix="id_new_group_" group_setting_labels=all_group_setting_labels.group}}
                        </div>
                    </section>
                </div>
                <div class="user_group_members_container user_group_creation">
                    <section id="choose_member_section">
                        <h4 class="user_group_setting_subsection_title">
                            <label for="people_to_add_in_group">{{t "Choose members" }}</label>
                        </h4>
                        <div id="user_group_membership_error" class="user_group_creation_error"></div>
                        <div class="controls" id="people_to_add_in_group"></div>
                    </section>
                </div>
            </div>
        </div>
        <div class="settings-sticky-footer">
            <div class="settings-sticky-footer-left">
                {{> ../components/action_button
                  label=(t "Back to settings")
                  custom_classes="hide"
                  attention="quiet"
                  intent="brand"
                  id="user_group_go_to_configure_settings"
                  }}
            </div>
            <div class="settings-sticky-footer-right">
                {{> ../components/action_button
                  label=(t "Cancel")
                  custom_classes="create_user_group_cancel inline-block"
                  attention="quiet"
                  intent="neutral"
                  }}
                {{> ../components/action_button
                  label=(t "Create")
                  custom_classes="finalize_create_user_group hide"
                  attention="quiet"
                  intent="brand"
                  type="submit"
                  }}
                {{> ../components/action_button
                  label=(t "Continue to add members")
                  id="user_group_go_to_members"
                  custom_classes="inline-block"
                  attention="quiet"
                  intent="brand"
                  }}
            </div>
        </div>
    </form>
</div>
```

--------------------------------------------------------------------------------

---[FILE: user_group_members.hbs]---
Location: zulip-main/web/templates/user_group_settings/user_group_members.hbs

```text
<div class="member_list_settings_container">
    <div class="membership-status">
        {{> user_group_membership_status .}}
    </div>
    <h4 class="user_group_setting_subsection_title">
        {{t "Add members" }}
    </h4>
    <div class="user_group_subscription_request_result banner-wrapper"></div>
    <div class="member_list_settings">
        <div class="member_list_add float-left">
            {{> add_members_form .}}
        </div>
        <div class="clear-float"></div>
    </div>
    <div>
        <h4 class="inline-block user_group_setting_subsection_title">{{t "Members"}}</h4>
        <span class="member-search float-right">
            <input type="text" class="search filter_text_input" placeholder="{{t 'Filter' }}" />
        </span>
    </div>
    <div class="add-group-member-loading-spinner"></div>
    <div class="member-list-box">
        {{> user_group_members_table .}}
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: user_group_membership_request_result.hbs]---
Location: zulip-main/web/templates/user_group_settings/user_group_membership_request_result.hbs

```text
{{#if error_message}}
    {{error_message}}
{{else}}
    {{#if (and (eq newly_added_member_count 0) (eq ignored_deactivated_member_count 0))}}
        {{#if (and already_added_user_count already_added_subgroups_count)}}
            {{t "All users and groups were already members."}}
        {{else if already_added_user_count}}
            {{t "All users were already members."}}
        {{else}}
            {{t "All groups were already members."}}
        {{/if}}
    {{else}}
        {{#if (not total_member_count_exceeds_five)}}
            {{#if addition_success_messages.newly_added_members_message_html}}
                {{t "Added:" }} {{{addition_success_messages.newly_added_members_message_html}}}.&nbsp;
            {{/if}}
            {{#if addition_success_messages.already_added_members_message_html}}
                {{t "Already a member:"}} {{{addition_success_messages.already_added_members_message_html}}}.
            {{/if}}
            {{#if addition_success_messages.ignored_deactivated_users_message_html}}
                {{t "Ignored deactivated users:"}} {{{addition_success_messages.ignored_deactivated_users_message_html}}}.
            {{/if}}
            {{#if addition_success_messages.ignored_deactivated_groups_message_html}}
                {{t "Ignored deactivated groups:"}} {{{addition_success_messages.ignored_deactivated_groups_message_html}}}.
            {{/if}}
        {{else}}
            {{#if newly_added_member_count}}
                {{t "Added:"}}
                {{#if (and newly_added_user_count newly_added_subgroups_count)}}
                    {{t "{newly_added_user_count, plural, one {# user} other {# users}} and {newly_added_subgroups_count, plural, one {# group.} other {# groups.}}"}}
                {{else if newly_added_user_count}}
                    {{t "{newly_added_user_count, plural, one {# user.} other {# users.}}"}}
                {{else if newly_added_subgroups_count}}
                    {{t "{newly_added_subgroups_count, plural, one {# group.} other {# groups.}}"}}
                {{/if}}
            {{/if}}
            {{#if already_added_member_count}}
                {{t "Already a member:"}}
                {{#if (and already_added_user_count already_added_subgroups_count)}}
                    {{t "{already_added_user_count, plural, one {# user} other {# users}} and {already_added_subgroups_count, plural, one {# group.} other {# groups.}}"}}
                {{else if already_added_user_count}}
                    {{t "{already_added_user_count, plural, one {# user.} other {# users.}}"}}
                {{else if already_added_subgroups_count}}
                    {{t "{already_added_subgroups_count, plural, one {# group.} other {# groups.}}"}}
                {{/if}}
            {{/if}}
            {{#if ignored_deactivated_member_count}}
                {{t "Ignored deactivated:"}}
                {{#if (and ignored_deactivated_users_count ignored_deactivated_groups_count)}}
                    {{t "{ignored_deactivated_users_count, plural, one {# user} other {# users}} and {ignored_deactivated_groups_count, plural, one {# group.} other {# groups.}}"}}
                {{else if ignored_deactivated_users_count}}
                    {{t "{ignored_deactivated_users_count, plural, one {# user.} other {# users.}}"}}
                {{else if ignored_deactivated_groups_count}}
                    {{t "{ignored_deactivated_groups_count, plural, one {# group.} other {# groups.}}"}}
                {{/if}}
            {{/if}}
        {{/if}}
    {{/if}}
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: user_group_membership_status.hbs]---
Location: zulip-main/web/templates/user_group_settings/user_group_membership_status.hbs

```text
{{#if is_direct_member}}
    {{t "You are a member of this group."}}
{{else if (not is_member)}}
    {{t "You are not a member of this group."}}
{{else}}
    {{#tr}}
        You are a member of this group because you are a member of a subgroup (<z-subgroup-names></z-subgroup-names>).
        {{#*inline "z-subgroup-names"}}{{{associated_subgroup_names_html}}}{{/inline}}
    {{/tr}}
{{/if}}
```

--------------------------------------------------------------------------------

---[FILE: user_group_members_table.hbs]---
Location: zulip-main/web/templates/user_group_settings/user_group_members_table.hbs

```text
<div class="member_list_container" data-simplebar data-simplebar-tab-index="-1">
    <div class="member_list_loading_indicator"></div>
    <table class="member-list table table-striped">
        <thead class="table-sticky-headers">
            <tr>
                <th class="panel_user_list" data-sort="name">{{t "Name" }}
                    <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                </th>
                <th class="settings-email-column" data-sort="email">{{t "Email" }}
                    <i class="table-sortable-arrow zulip-icon zulip-icon-sort-arrow-down"></i>
                </th>
                <th class="remove-button-column" {{#unless can_remove_members}}style="display:none"{{/unless}}></th>
            </tr>
        </thead>
        <tbody class="member_table" data-empty="{{t 'This group has no members.' }}" data-search-results-empty="{{t 'No group members match your current filter.'}}"></tbody>
    </table>
</div>
```

--------------------------------------------------------------------------------

---[FILE: user_group_permission_settings.hbs]---
Location: zulip-main/web/templates/user_group_settings/user_group_permission_settings.hbs

```text
<div class="settings-subsection-parent" data-group-id="{{group_id}}">
    <div class="subsection-header">
        <h3>{{group_name}}</h3>
        {{> ../settings/settings_save_discard_widget show_only_indicator=false }}
    </div>

    <div class="subsection-settings">
        {{#each assigned_permissions}}
            {{> ../settings/settings_checkbox
              setting_name=setting_name
              prefix=../id_prefix
              is_checked=true
              label=(lookup ../setting_labels setting_name)
              is_disabled=(not can_edit)
              tooltip_message=tooltip_message
              }}
        {{/each}}
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: user_group_settings.hbs]---
Location: zulip-main/web/templates/user_group_settings/user_group_settings.hbs

```text
<div class="group_settings_header" data-group-id="{{group.id}}">
    <div class="tab-container"></div>
    <div class="button-group">
        <div class="join_leave_button_wrapper inline-block">
            {{#if is_direct_member}}
            {{> ../components/action_button label=(t "Leave group") custom_classes="join_leave_button" type="button"
              attention="quiet" intent="neutral" }}
            {{else}}
            {{> ../components/action_button label=(t "Join group") custom_classes="join_leave_button" type="button"
              attention="quiet" intent="brand" }}
            {{/if}}
        </div>
        {{> ../components/icon_button icon="user-group-x" intent="danger" custom_classes="deactivate-group-button deactivate tippy-zulip-delayed-tooltip"
          data-tippy-content=(t 'Deactivate group') }}
        {{> ../components/icon_button icon="user-group-plus" intent="success" custom_classes="reactivate-group-button reactivate tippy-zulip-delayed-tooltip"
          data-tippy-content=(t 'Reactivate group') }}
    </div>
</div>
<div class="user_group_settings_wrapper" data-group-id="{{group.id}}">
    <div class="inner-box">

        <div class="group_general_settings group_setting_section" data-group-section="general">
            <div class="group-reactivation-error-banner"></div>
            <div class="group-banner"></div>
            <div class="group-header">
                <div class="group-name-wrapper">
                    <span class="group-name" data-tippy-content="{{group.name}}">{{group.name}}</span>
                </div>
                <div class="group_change_property_info alert-notification"></div>
                <div class="button-group">
                    {{> ../components/icon_button icon="user-group-edit" intent="neutral" custom_classes="tippy-zulip-delayed-tooltip"
                      data-tippy-content=(t 'Change group info') id="open_group_info_modal" }}
                </div>
            </div>
            <div class="group-description-wrapper">
                <span class="group-description">
                    {{group.description}}
                </span>
            </div>

            <div class="creator_details group_detail_box">
                {{> ../creator_details .
                  group_id=group.id }}
            </div>

            <div class="group-permissions settings-subsection-parent" id="group_permission_settings">
                <div class="subsection-header">
                    <h3 class="user_group_setting_subsection_title">
                        {{t "Group permissions" }}
                        {{> ../help_link_widget link="/help/manage-user-groups#configure-group-permissions"}}
                    </h3>
                    {{> ../settings/settings_save_discard_widget section_name="group-permissions" }}
                </div>

                {{> group_permissions prefix="id_" group_setting_labels=all_group_setting_labels.group}}
            </div>
        </div>

        <div class="group_member_settings group_setting_section" data-group-section="members">
            <div class="edit_members_for_user_group">
                {{> user_group_members .}}
            </div>
        </div>

        <div class="group_setting_section" data-group-section="permissions">
            <div class="group-assigned-permissions">
                <span class="no-permissions-for-group-text {{#unless group_has_no_permissions}}hide{{/unless}}">
                    {{t 'This group has no assigned permissions.'}}
                </span>
                {{> group_permission_settings .}}
            </div>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: user_group_settings_empty_notice.hbs]---
Location: zulip-main/web/templates/user_group_settings/user_group_settings_empty_notice.hbs

```text
<div class="no-groups-to-show-message">
    <span class="settings-empty-option-text">
        {{empty_user_group_list_message}}
        {{#if all_groups_tab}}
            {{#if can_create_user_groups}}
                <a href="#groups/new">{{t "Create a user group"}}</a>
            {{/if}}
        {{else}}
            <a href="#groups/all">{{t "View all user groups"}}</a>
        {{/if}}
    </span>
</div>
```

--------------------------------------------------------------------------------

---[FILE: user_group_settings_overlay.hbs]---
Location: zulip-main/web/templates/user_group_settings/user_group_settings_overlay.hbs

```text
<div id="groups_overlay" class="two-pane-settings-overlay overlay" data-overlay="group_subscriptions">
    <div class="flex overlay-content">
        <div class="two-pane-settings-container overlay-container">
            <div class="two-pane-settings-header">
                <div class="fa fa-chevron-left"></div>
                <span class="user-groups-title">{{t 'User groups' }}</span>
                <div class="exit">
                    <span class="exit-sign">&times;</span>
                </div>
            </div>
            <div class="two-pane-settings-content">
                <div class="left">
                    <div class="two-pane-settings-subheader">
                        <div class="list-toggler-container">
                            <div id="add_new_user_group">
                                <button class="create_user_group_button two-pane-settings-plus-button">
                                    <i class="create_button_plus_sign zulip-icon zulip-icon-user-group-plus" aria-hidden="true"></i>
                                </button>
                                <div class="float-clear"></div>
                            </div>
                        </div>
                    </div>
                    <div class="two-pane-settings-body">
                        <div class="input-append group_name_search_section two-pane-settings-search" id="group_filter">
                            <input type="text" name="group_name" id="search_group_name" class="filter_text_input" autocomplete="off"
                              placeholder="{{t 'Filter' }}" value=""/>
                            <button type="button" class="clear_search_button" id="clear_search_group_name">
                                <i class="zulip-icon zulip-icon-close" aria-hidden="true"></i>
                            </button>
                            <span>
                                <label class="checkbox" id="user-group-edit-filter-options">
                                    {{> ../dropdown_widget widget_name="user_group_visibility_settings"}}
                                </label>
                            </span>
                        </div>
                        <div class="no-groups-to-show">
                        </div>
                        <div class="user-groups-list-wrapper two-pane-settings-left-simplebar-container" data-simplebar data-simplebar-tab-index="-1">
                            <div class="user-groups-list"></div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="two-pane-settings-subheader">
                        <div class="display-type">
                            <div id="user_group_settings_title" class="user-group-info-title">{{t 'User group settings' }}</div>
                            <i class="fa fa-ban deactivated-user-icon deactivated-user-group-icon-right"></i>
                        </div>
                    </div>
                    <div class="two-pane-settings-body">
                        <div class="nothing-selected">
                            <div class="group-info-banner banner-wrapper"></div>
                            <div class="create-group-button-container">
                                {{> ../settings/upgrade_tip_widget . }}
                                <button type="button" class="create_user_group_button animated-purple-button">{{t 'Create user group' }}</button>
                                <span class="settings-empty-option-text creation-permission-text">
                                    {{t 'You do not have permission to create user groups.' }}
                                </span>
                            </div>
                        </div>
                        <div id="user_group_settings" class="two-pane-settings-right-simplebar-container settings" data-simplebar data-simplebar-tab-index="-1" data-simplebar-auto-hide="false">
                            {{!-- edit user group here --}}
                        </div>
                        {{> user_group_creation_form . }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: user_group_subgroup_entry.hbs]---
Location: zulip-main/web/templates/user_group_settings/user_group_subgroup_entry.hbs

```text
<tr data-subgroup-id="{{group_id}}" class="hidden-remove-button-row">
    <td class="subgroup-name panel_user_list">
        {{> ../user_group_display_only_pill .}}
    </td>
    <td class="empty-email-col-for-user-group"></td>
    {{#if can_remove_members}}
    <td class="remove remove-button-wrapper remove-button-column">
        {{> ../components/icon_button icon="close" custom_classes="hidden-remove-button remove-subgroup-button tippy-zulip-delayed-tooltip" intent="danger" aria-label=(t "Remove") data-tippy-content=(t "Remove") }}
    </td>
    {{/if}}
</tr>
```

--------------------------------------------------------------------------------

---[FILE: poll_widget.hbs]---
Location: zulip-main/web/templates/widgets/poll_widget.hbs

```text
<div class="poll-widget">
    <div class="poll-widget-header-area">
        <h4 class="poll-question-header"></h4>
        <i class="fa fa-pencil poll-edit-question"></i>
        <div class="poll-question-bar">
            <input type="text" class="poll-question" placeholder="{{t 'Add question'}}" />
            <button class="poll-question-remove"><i class="fa fa-remove"></i></button>
            <button class="poll-question-check"><i class="fa fa-check"></i></button>
        </div>
    </div>
    <div class="poll-please-wait">
        {{t 'We are about to have a poll.  Please wait for the question.'}}
    </div>
    <ul class="poll-widget">
    </ul>
    <div class="poll-option-bar">
        <input type="text" class="poll-option" placeholder="{{t 'New option'}}" />
        <button class="poll-option">{{t "Add option" }}</button>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: poll_widget_results.hbs]---
Location: zulip-main/web/templates/widgets/poll_widget_results.hbs

```text
{{#each options}}
    <li>
        <label class="poll-option-label">
            <button class="poll-vote {{#if current_user_vote}}current-user-vote{{/if}}" data-key="{{ key }}">
                {{ count }}
            </button>
            <span class="poll-option-text">{{ option }}</span>
        </label>
        {{#if names}}
        <span class="poll-names">({{ names }})</span>
        {{/if}}
    </li>
{{/each}}
```

--------------------------------------------------------------------------------

---[FILE: todo_widget.hbs]---
Location: zulip-main/web/templates/widgets/todo_widget.hbs

```text
<div class="todo-widget">
    <div class="todo-widget-header-area">
        <h4 class="todo-task-list-title-header">{{t "Task list" }}</h4>
        <i class="fa fa-pencil todo-edit-task-list-title"></i>
        <div class="todo-task-list-title-bar">
            <input type="text" class="todo-task-list-title" placeholder="{{t 'Add todo task list title'}}" />
            <button class="todo-task-list-title-remove"><i class="fa fa-remove"></i></button>
            <button class="todo-task-list-title-check"><i class="fa fa-check"></i></button>
        </div>
    </div>
    <ul class="todo-widget">
    </ul>
    <div class="add-task-bar">
        <input type="text" class="add-task" placeholder="{{t 'New task'}}" />
        <input type="text" class="add-desc" placeholder="{{t 'Description'}}" />
        <div class="add-task-wrapper">
            <button class="add-task">{{t "Add task" }}</button>
        </div>
        <div class="widget-error"></div>
    </div>
</div>
```

--------------------------------------------------------------------------------

---[FILE: todo_widget_tasks.hbs]---
Location: zulip-main/web/templates/widgets/todo_widget_tasks.hbs

```text
{{#each all_tasks}}
    <li>
        <label class="checkbox">
            <span class="todo-checkbox">
                <input type="checkbox" class="task" data-key="{{ key }}" {{#if completed}}checked{{/if}}/>
                <span class="custom-checkbox"></span>
            </span>
            <span class="todo-task">
                {{#if completed}}
                <s><strong>{{ task }}</strong>{{#if desc }}: {{ desc }}{{/if}}</s>
                {{else}}
                <strong>{{ task }}</strong>{{#if desc }}: {{ desc }}{{/if}}
                {{/if}}
            </span>
        </label>
    </li>
{{/each}}
```

--------------------------------------------------------------------------------

---[FILE: zform_choices.hbs]---
Location: zulip-main/web/templates/widgets/zform_choices.hbs

```text
<div class="widget-choices">
    <div class="widget-choices-heading">{{ heading }}</div>
    <ul>
        {{#each choices}}
            <li>
                <button data-idx="{{ this.idx }}">{{ this.short_name }}</button>
                &nbsp;
                {{ this.long_name }}
            </li>
        {{/each}}
    </ul>
</div>
```

--------------------------------------------------------------------------------

````
