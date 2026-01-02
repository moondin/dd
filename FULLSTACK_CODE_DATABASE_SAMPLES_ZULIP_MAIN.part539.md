---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 539
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 539 of 1290)

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

---[FILE: banners.html]---
Location: zulip-main/templates/zerver/development/showroom/banners.html

```text
{% extends "zerver/base.html" %}
{% set entrypoint = "showroom" %}

{% block title %}
<title>{{ doc_root_title }} | Zulip Dev</title>
{% endblock %}

{% block content %}
<div class="portico-container" data-platform="{{ platform }}">
    <div class="portico-wrap">
        {% include 'zerver/portico-header.html' %}
        <div class="app portico-page">
            <div class="banner-wrapper" id="showroom_component_banner_navbar_alerts_wrapper"></div>
            <div class="app-main portico-page-container">
                <div class="showroom-wrapper">
                    <div class="banner-wrapper" id="showroom_component_banner_default_wrapper"></div>
                    <section class="showroom-controls-section">
                        <div class="showroom-controls-label">Theme Settings</div>
                        <div class="showroom-controls">
                            <div class="showroom-control">
                                <span class="showroom-control-label">Dark Theme</span>
                                <div role="group" class="tab-picker showroom-control-setting">
                                    <input type="radio" data-theme="dark" id="showroom_enable_dark_theme_banners" class="tab-option" name="showroom-dark-theme-select"/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="showroom_enable_dark_theme_banners" tabindex="0">
                                        <span>Enable</span>
                                    </label>
                                    <input type="radio" data-theme="light" id="showroom_disable_dark_theme_banners" class="tab-option" name="showroom-dark-theme-select" checked/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="showroom_disable_dark_theme_banners" tabindex="0">
                                        <span>Disable</span>
                                    </label>
                                    <span class="slider"></span>
                                </div>
                            </div>
                            <div class="showroom-control">
                                <span class="showroom-control-label">Select Background</span>
                                <select class="showroom-control-element showroom-control-setting select_background">
                                    {% for background in background_colors %}
                                        <option value="{{ background.css_var }}" {% if background.css_var == "--color-background" %}selected{% endif %}>{{ background.name }}</option>
                                    {% endfor %}
                                </select>
                            </div>
                        </div>

                        <div class="showroom-controls-label">Banner Settings</div>
                        <div class="showroom-controls">
                            <div class="showroom-control">
                                <span class="showroom-control-label">Alert Banner Type</span>
                                <select class="showroom-control-element showroom-control-setting" id="banner_select_type"></select>
                            </div>
                            <div class="showroom-control">
                                <span class="showroom-control-label">Banner Intent</span>
                                <select class="showroom-control-element showroom-control-setting" id="showroom_component_banner_select_intent"></select>
                            </div>
                            <div class="showroom-control">
                                <span class="showroom-control-label">Banner Label</span>
                                <input class="showroom-control-element showroom-control-setting" type="text" id="banner_label" />
                            </div>
                            <div class="showroom-control">
                                <span class="showroom-control-label">Banner Close Button</span>
                                <div role="group" class="tab-picker showroom-control-setting">
                                    <input type="radio" id="enable_banner_close_button" class="tab-option" name="banner-close-button-select"/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="enable_banner_close_button" tabindex="0">
                                        <span>Enable</span>
                                    </label>
                                    <input type="radio" id="disable_banner_close_button" class="tab-option" name="banner-close-button-select" checked/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="disable_banner_close_button" tabindex="0">
                                        <span>Disable</span>
                                    </label>
                                    <span class="slider"></span>
                                </div>
                            </div>
                        </div>

                        <div class="showroom-controls-label">Primary Button Settings</div>
                        <div class="showroom-controls">
                            <div class="showroom-control">
                                <span class="showroom-control-label">Button</span>
                                <div role="group" class="tab-picker showroom-control-setting">
                                    <input type="radio" id="enable_primary_button" class="tab-option" name="primary-button-select"/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="enable_primary_button" tabindex="0">
                                        <span>Enable</span>
                                    </label>
                                    <input type="radio" id="disable_primary_button" class="tab-option" name="primary-button-select" checked/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="disable_primary_button" tabindex="0">
                                        <span>Disable</span>
                                    </label>
                                    <span class="slider"></span>
                                </div>
                            </div>
                            <div class="showroom-control">
                                <span class="showroom-control-label">Button Icon</span>
                                <div role="group" class="tab-picker showroom-control-setting">
                                    <input type="radio" id="enable_primary_button_icon" class="tab-option" name="primary-button-icon-select"/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="enable_primary_button_icon" tabindex="0">
                                        <span>Enable</span>
                                    </label>
                                    <input type="radio" id="disable_primary_button_icon" class="tab-option" name="primary-button-icon-select" checked/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="disable_primary_button_icon" tabindex="0">
                                        <span>Disable</span>
                                    </label>
                                    <span class="slider"></span>
                                </div>
                            </div>
                            <div class="showroom-control">
                                <span class="showroom-control-label">Select Icon</span>
                                <select class="showroom-control-element showroom-control-setting" id="primary_button_select_icon">
                                    {% for icon in icons %}
                                        <option value="{{ icon }}" {% if icon == "move-alt" %}selected{% endif %}>{{ icon }}</option>
                                    {% endfor %}
                                </select>
                            </div>
                            <div class="showroom-control">
                                <span class="showroom-control-label">Button Text</span>
                                <input class="showroom-control-element showroom-control-setting" type="text" id="primary_button_text" />
                            </div>
                        </div>

                        <div class="showroom-controls-label">Quiet Button Settings</div>
                        <div class="showroom-controls">
                            <div class="showroom-control">
                                <span class="showroom-control-label">Button</span>
                                <div role="group" class="tab-picker showroom-control-setting">
                                    <input type="radio" id="enable_quiet_button" class="tab-option" name="quiet-button-select"/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="enable_quiet_button" tabindex="0">
                                        <span>Enable</span>
                                    </label>
                                    <input type="radio" id="disable_quiet_button" class="tab-option" name="quiet-button-select" checked/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="disable_quiet_button" tabindex="0">
                                        <span>Disable</span>
                                    </label>
                                    <span class="slider"></span>
                                </div>
                            </div>
                            <div class="showroom-control">
                                <span class="showroom-control-label">Button Icon</span>
                                <div role="group" class="tab-picker showroom-control-setting">
                                    <input type="radio" id="enable_quiet_button_icon" class="tab-option" name="quiet-button-icon-select"/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="enable_quiet_button_icon" tabindex="0">
                                        <span>Enable</span>
                                    </label>
                                    <input type="radio" id="disable_quiet_button_icon" class="tab-option" name="quiet-button-icon-select" checked/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="disable_quiet_button_icon" tabindex="0">
                                        <span>Disable</span>
                                    </label>
                                    <span class="slider"></span>
                                </div>
                            </div>
                            <div class="showroom-control">
                                <span class="showroom-control-label">Select Icon</span>
                                <select class="showroom-control-element showroom-control-setting" id="quiet_button_select_icon">
                                    {% for icon in icons %}
                                        <option value="{{ icon }}" {% if icon == "move-alt" %}selected{% endif %}>{{ icon }}</option>
                                    {% endfor %}
                                </select>
                            </div>
                            <div class="showroom-control">
                                <span class="showroom-control-label">Button Text</span>
                                <input class="showroom-control-element showroom-control-setting" type="text" id="quiet_button_text" />
                            </div>
                        </div>

                        <div class="showroom-controls-label">Borderless Button Settings</div>
                        <div class="showroom-controls">
                            <div class="showroom-control">
                                <span class="showroom-control-label">Button</span>
                                <div role="group" class="tab-picker showroom-control-setting">
                                    <input type="radio" id="enable_borderless_button" class="tab-option" name="borderless-button-select"/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="enable_borderless_button" tabindex="0">
                                        <span>Enable</span>
                                    </label>
                                    <input type="radio" id="disable_borderless_button" class="tab-option" name="borderless-button-select" checked/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="disable_borderless_button" tabindex="0">
                                        <span>Disable</span>
                                    </label>
                                    <span class="slider"></span>
                                </div>
                            </div>
                            <div class="showroom-control">
                                <span class="showroom-control-label">Button Icon</span>
                                <div role="group" class="tab-picker showroom-control-setting">
                                    <input type="radio" id="enable_borderless_button_icon" class="tab-option" name="borderless-button-icon-select"/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="enable_borderless_button_icon" tabindex="0">
                                        <span>Enable</span>
                                    </label>
                                    <input type="radio" id="disable_borderless_button_icon" class="tab-option" name="borderless-button-icon-select" checked/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="disable_borderless_button_icon" tabindex="0">
                                        <span>Disable</span>
                                    </label>
                                    <span class="slider"></span>
                                </div>
                            </div>
                            <div class="showroom-control">
                                <span class="showroom-control-label">Select Icon</span>
                                <select class="showroom-control-element showroom-control-setting" id="borderless_button_select_icon">
                                    {% for icon in icons %}
                                        <option value="{{ icon }}" {% if icon == "move-alt" %}selected{% endif %}>{{ icon }}</option>
                                    {% endfor %}
                                </select>
                            </div>
                            <div class="showroom-control">
                                <span class="showroom-control-label">Button Text</span>
                                <input class="showroom-control-element showroom-control-setting" type="text" id="borderless_button_text" />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: buttons.html]---
Location: zulip-main/templates/zerver/development/showroom/buttons.html

```text
{% extends "zerver/base.html" %}
{% set entrypoint = "showroom" %}

{% block title %}
<title>{{ doc_root_title }} | Zulip Dev</title>
{% endblock %}

{% block content %}
<div class="portico-container" data-platform="{{ platform }}">
    <div class="portico-wrap">
        {% include 'zerver/portico-header.html' %}
        <div class="app portico-page">
            <div class="app-main portico-page-container">
                <div class="showroom-wrapper">
                    <div class="showroom-button-grid">
                        <div class="showroom-component-button-intent-group">
                            <div class="showroom-component-action-button-label">Action Buttons</div>
                            <div class="showroom-component-icon-button-label">Icon Buttons</div>
                        </div>
                        <div class="showroom-component-button-intent-group">
                            <div class="showroom-component-button-intent-label">Neutral Variant</div>
                            <div class="showroom-component-action-button-group">
                                <button class="action-button action-button-primary-neutral" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                    <span class="action-button-label">Button joy</span>
                                </button>
                                <button class="action-button action-button-quiet-neutral" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                    <span class="action-button-label">Button joy</span>
                                </button>
                                <button class="action-button action-button-borderless-neutral" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                    <span class="action-button-label">Button joy</span>
                                </button>
                            </div>
                            <div class="showroom-component-icon-button-group">
                                <button class="icon-button icon-button-neutral" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                </button>
                                <button class="icon-button icon-button-square icon-button-neutral" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                </button>
                            </div>
                        </div>
                        <div class="showroom-component-button-intent-group">
                            <div class="showroom-component-button-intent-label">Brand Variant</div>
                            <div class="showroom-component-action-button-group">
                                <button class="action-button action-button-primary-brand" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                    <span class="action-button-label">Button joy</span>
                                </button>
                                <button class="action-button action-button-quiet-brand" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                    <span class="action-button-label">Button joy</span>
                                </button>
                                <button class="action-button action-button-borderless-brand" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                    <span class="action-button-label">Button joy</span>
                                </button>
                            </div>
                            <div class="showroom-component-icon-button-group">
                                <button class="icon-button icon-button-brand" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                </button>
                                <button class="icon-button icon-button-square icon-button-brand" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                </button>
                            </div>
                        </div>
                        <div class="showroom-component-button-intent-group">
                            <div class="showroom-component-button-intent-label">Info Variant</div>
                            <div class="showroom-component-action-button-group">
                                <button class="action-button action-button-primary-info" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                    <span class="action-button-label">Button joy</span>
                                </button>
                                <button class="action-button action-button-quiet-info" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                    <span class="action-button-label">Button joy</span>
                                </button>
                                <button class="action-button action-button-borderless-info" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                    <span class="action-button-label">Button joy</span>
                                </button>
                            </div>
                            <div class="showroom-component-icon-button-group">
                                <button class="icon-button icon-button-info" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                </button>
                                <button class="icon-button icon-button-square icon-button-info" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                </button>
                            </div>
                        </div>
                        <div class="showroom-component-button-intent-group">
                            <div class="showroom-component-button-intent-label">Success Variant</div>
                            <div class="showroom-component-action-button-group">
                                <button class="action-button action-button-primary-success" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                    <span class="action-button-label">Button joy</span>
                                </button>
                                <button class="action-button action-button-quiet-success" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                    <span class="action-button-label">Button joy</span>
                                </button>
                                <button class="action-button action-button-borderless-success" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                    <span class="action-button-label">Button joy</span>
                                </button>
                            </div>
                            <div class="showroom-component-icon-button-group">
                                <button class="icon-button icon-button-success" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                </button>
                                <button class="icon-button icon-button-square icon-button-success" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                </button>
                            </div>
                        </div>
                        <div class="showroom-component-button-intent-group">
                            <div class="showroom-component-button-intent-label">Warning Variant</div>
                            <div class="showroom-component-action-button-group">
                                <button class="action-button action-button-primary-warning" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                    <span class="action-button-label">Button joy</span>
                                </button>
                                <button class="action-button action-button-quiet-warning" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                    <span class="action-button-label">Button joy</span>
                                </button>
                                <button class="action-button action-button-borderless-warning" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                    <span class="action-button-label">Button joy</span>
                                </button>
                            </div>
                            <div class="showroom-component-icon-button-group">
                                <button class="icon-button icon-button-warning" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                </button>
                                <button class="icon-button icon-button-square icon-button-warning" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                </button>
                            </div>
                        </div>
                        <div class="showroom-component-button-intent-group">
                            <div class="showroom-component-button-intent-label">Danger Variant</div>
                            <div class="showroom-component-action-button-group">
                                <button class="action-button action-button-primary-danger" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                    <span class="action-button-label">Button joy</span>
                                </button>
                                <button class="action-button action-button-quiet-danger" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                    <span class="action-button-label">Button joy</span>
                                </button>
                                <button class="action-button action-button-borderless-danger" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                    <span class="action-button-label">Button joy</span>
                                </button>
                            </div>
                            <div class="showroom-component-icon-button-group">
                                <button class="icon-button icon-button-danger" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                </button>
                                <button class="icon-button icon-button-square icon-button-danger" tabindex=0>
                                    <i class="zulip-icon zulip-icon-move-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <section class="showroom-controls-section">
                        <div class="showroom-controls-label">Controls</div>
                        <div class="showroom-controls">
                            <div class="showroom-control">
                                <span class="showroom-control-label">Dark Theme</span>
                                <div role="group" class="tab-picker">
                                    <input type="radio" data-theme="dark" id="showroom_enable_dark_theme_buttons" class="tab-option" name="showroom-dark-theme-select"/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="showroom_enable_dark_theme_buttons" tabindex="0">
                                        <span>Enable</span>
                                    </label>
                                    <input type="radio" data-theme="light" id="showroom_disable_dark_theme_buttons" class="tab-option" name="showroom-dark-theme-select" checked/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="showroom_disable_dark_theme_buttons" tabindex="0">
                                        <span>Disable</span>
                                    </label>
                                    <span class="slider"></span>
                                </div>
                            </div>
                            <div class="showroom-control">
                                <span class="showroom-control-label">Select Background</span>
                                <select class="showroom-control-element select_background">
                                    {% for background in background_colors %}
                                        <option value="{{ background.css_var }}" {% if background.css_var == "--color-background" %}selected{% endif %}>{{ background.name }}</option>
                                    {% endfor %}
                                </select>
                            </div>
                            <div class="showroom-control">
                                <span class="showroom-control-label">Action Button Icon</span>
                                <div role="group" class="tab-picker">
                                    <input type="radio" id="enable_button_icon" class="tab-option" name="button-icon-select" checked/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="enable_button_icon" tabindex="0">
                                        <span>Enable</span>
                                    </label>
                                    <input type="radio" id="disable_button_icon" class="tab-option" name="button-icon-select"/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="disable_button_icon" tabindex="0">
                                        <span>Disable</span>
                                    </label>
                                    <span class="slider"></span>
                                </div>
                            </div>
                            <div class="showroom-control">
                                <span class="showroom-control-label">Select Icon</span>
                                <select class="showroom-control-element" id="button_select_icon">
                                    {% for icon in icons %}
                                        <option value="{{ icon }}" {% if icon == "move-alt" %}selected{% endif %}>{{ icon }}</option>
                                    {% endfor %}
                                </select>
                            </div>
                            <div class="showroom-control">
                                <span class="showroom-control-label">Action Button Text</span>
                                <div class="showroom-control-setting showroom-control-setting-multiple">
                                    <input class="showroom-control-element" type="text" id="button_text" />
                                    <button class="showroom-control-element" id="clear_button_text">Reset</button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: inputs.html]---
Location: zulip-main/templates/zerver/development/showroom/inputs.html

```text
{% extends "zerver/base.html" %}
{% set entrypoint = "showroom" %}

{% block title %}
<title>{{ doc_root_title }} | Zulip Dev</title>
{% endblock %}

{% block content %}
<div class="portico-container" data-platform="{{ platform }}">
    <div class="portico-wrap">
        {% include 'zerver/portico-header.html' %}
        <div class="app portico-page">
            <div class="app-main portico-page-container">
                <div class="showroom-wrapper">
                    <div class="showroom-filter-input-container"></div>
                    <section class="showroom-controls-section">
                        <div class="showroom-controls-label">Theme Settings</div>
                        <div class="showroom-controls">
                            <div class="showroom-control">
                                <span class="showroom-control-label">Dark Theme</span>
                                <div role="group" class="tab-picker showroom-control-setting">
                                    <input type="radio" data-theme="dark" id="showroom_enable_dark_theme_inputs" class="tab-option" name="showroom-dark-theme-select"/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="showroom_enable_dark_theme_inputs" tabindex="0">
                                        <span>Enable</span>
                                    </label>
                                    <input type="radio" data-theme="light" id="showroom_disable_dark_theme_inputs" class="tab-option" name="showroom-dark-theme-select" checked/>
                                    <label role="menuitemradio" class="tab-option-content showroom-control-element" for="showroom_disable_dark_theme_inputs" tabindex="0">
                                        <span>Disable</span>
                                    </label>
                                    <span class="slider"></span>
                                </div>
                            </div>
                            <div class="showroom-control">
                                <span class="showroom-control-label">Select Background</span>
                                <select class="showroom-control-element showroom-control-setting select_background">
                                    {% for background in background_colors %}
                                        <option value="{{ background.css_var }}" {% if background.css_var == "--color-background" %}selected{% endif %}>{{ background.name }}</option>
                                    {% endfor %}
                                </select>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: zulip-main/templates/zerver/emails/.gitignore

```text
custom
```

--------------------------------------------------------------------------------

---[FILE: account_registered.html]---
Location: zulip-main/templates/zerver/emails/account_registered.html

```text
{% extends "zerver/emails/email_base_default.html" %}

{% block illustration %}
<img src="{{ email_images_base_url }}/email_logo.png" alt=""/>
{% endblock %}

{% block content %}
{% if realm_creation %}
<p>
    {% trans %}Congratulations, you have created a new Zulip
    organization: <b>{{ realm_name }}</b>.{% endtrans %}
</p>
{% else %}
<p>{{ _('Welcome to Zulip!') }}</p>
<p>
    {% trans %}You've joined the Zulip organization <b>{{ realm_name }}</b>.
    {% endtrans %}
</p>
{% endif %}

<p>
    {% trans apps_page_link="https://zulip.com/apps/" %}You will use the following info to log into the Zulip web, <a href="{{ apps_page_link }}">mobile and desktop</a> apps:{% endtrans %}
</p>
<ul>
    <li>{% trans organization_url=macros.link_tag(realm_url) %}Organization URL: {{ organization_url }}{% endtrans %}<br /></li>
    {% if ldap %}
        {% if ldap_username %}
        <li>{% trans %}Your username: {{ ldap_username }}{% endtrans %}<br /></li>
        {% else %}
        <li>{{ _('Use your LDAP account to log in') }}<br /></li>
        {% endif %}
    {% else %}
        <li>{% trans email=macros.email_tag(email) %}Your account email: {{ email }}{% endtrans %}<br /></li>
    {% endif %}
</ul>
<p>
    <a class="button" href="{{ realm_url }}">{{ _('Go to organization') }}</a>
</p>

<p>
    {% trans %}If you are new to Zulip, check out our <a href="{{ getting_user_started_link }}">getting started guide</a>!{% endtrans %}
    {% if is_realm_admin %}
    {% trans %}We also have a guide for <a href="{{ getting_organization_started_link }}">moving your organization to Zulip</a>.{% endtrans %}
    {% endif %}
</p>

<p>
    {% if corporate_enabled %}
        {% trans %}Questions? <a href="mailto:{{ support_email }}">Contact us</a> — we'd love to help!{% endtrans %}
    {% else %}
        {{macros.contact_us_self_hosted(support_email)}}
    {% endif %}
</p>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: account_registered.subject.txt]---
Location: zulip-main/templates/zerver/emails/account_registered.subject.txt

```text
{% if realm_creation %}
{% trans -%}
{{ realm_name }} on Zulip: Your new organization details
{%- endtrans %}
{% else %}
{% trans -%}
{{ realm_name }} on Zulip: Your new account details
{%- endtrans %}
{% endif %}
```

--------------------------------------------------------------------------------

---[FILE: account_registered.txt]---
Location: zulip-main/templates/zerver/emails/account_registered.txt

```text
{{ _('Welcome to Zulip!') }}

{% if realm_creation %}
    {% trans %}Congratulations, you have created a new Zulip organization: {{ realm_name }}.{% endtrans %}
{% else %}
{% trans %}You've joined the Zulip organization {{ realm_name }}.{% endtrans %}
{% endif %}


{% trans apps_page_link="https://zulip.com/apps/" %}You will use the following info to log into the Zulip web, mobile and desktop apps ({{ apps_page_link}}):{% endtrans %}

* {% trans organization_url=realm_url %}Organization URL: {{ organization_url }}{% endtrans %}

{% if ldap %}
{% if ldap_username %}
* {% trans %}Your username: {{ ldap_username }}{% endtrans %}
{% else %}
* {{ _('Use your LDAP account to log in') }}
{% endif %}
{% else %}
* {% trans %}Your account email: {{ email }}{% endtrans %}
{% endif %}


{% trans %}If you are new to Zulip, check out our getting started guide ({{ getting_user_started_link }})!{% endtrans %}
{% if is_realm_admin %}
{% trans %} We also have a guide for moving your organization to Zulip ({{ getting_organization_started_link }}).{% endtrans %}
{% endif %}


{% if corporate_enabled %}
    {% trans %}Questions? Contact us at {{ support_email }} — we'd love to help!{% endtrans %}
{% else %}
    {% trans %}If you have any questions, please contact this Zulip server's administrators at {{ support_email }}.{% endtrans %}
{% endif %}
```

--------------------------------------------------------------------------------

---[FILE: confirm_demo_organization_email.html]---
Location: zulip-main/templates/zerver/emails/confirm_demo_organization_email.html

```text
{% extends "zerver/emails/email_base_default.html" %}

{% block illustration %}
<img src="{{ email_images_base_url }}/email_logo.png" alt=""/>
{% endblock %}

{% block content %}
<p>{% trans %}Hi,{% endtrans %}</p>

<p>{% trans realm_url=macros.link_tag(realm_url), new_email=macros.email_tag(new_email) %}We received a request to add the email address {{ new_email }} to your Zulip demo organization account on {{ realm_url }}. To confirm this update and set a password for this account, please click below:{% endtrans %}
    <a class="button" href="{{ activate_url }}">{{_('Confirm and set password') }}</a></p>

<p>{% trans support_email=macros.email_tag(support_email) %}If you did not request this change, please contact us immediately at {{ support_email }}.{% endtrans %}</p>
{% endblock %}
```

--------------------------------------------------------------------------------

---[FILE: confirm_demo_organization_email.subject.txt]---
Location: zulip-main/templates/zerver/emails/confirm_demo_organization_email.subject.txt

```text
{{ _("Verify your email address for your Zulip demo organization") }}
```

--------------------------------------------------------------------------------

````
