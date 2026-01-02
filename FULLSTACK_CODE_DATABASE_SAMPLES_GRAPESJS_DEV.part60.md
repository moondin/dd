---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 60
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 60 of 97)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - grapesjs-dev
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/grapesjs-dev
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: _gjs_inputs.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/_gjs_inputs.scss

```text
@use 'gjs_main_mixins';
@use 'gjs_vars';
@use 'gjs_category_general';

/********* Input style **********/

@mixin rangeThumbStyle() {
  height: 10px;
  width: 10px;
  border: 1px solid var(--gjs-main-dark-color);
  border-radius: 100%;
  background-color: var(--gjs-font-color);
  cursor: pointer;
}

@mixin rangeTrackStyle() {
  background-color: var(--gjs-main-dark-color);
  border-radius: 1px;
  margin-top: 3px;
  height: 3px;
}

.#{gjs_vars.$app-prefix} {
  &label {
    line-height: 18px;
  }

  &fields {
    display: flex;
  }

  &select {
    padding: 0;
    width: 100%;

    select {
      padding-right: 10px;
    }
  }

  &select:-moz-focusring,
  &select select:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 var(--gjs-secondary-light-color);
  }

  &input:focus,
  &button:focus,
  &btn-prim:focus,
  &select:focus,
  &select select:focus {
    outline: none;
  }

  &field {
    input,
    select,
    textarea {
      @include gjs_main_mixins.appearance(none);

      color: inherit;
      border: none;
      background-color: transparent;
      box-sizing: border-box;
      width: 100%;
      position: relative;
      padding: var(--gjs-input-padding);
      z-index: 1;

      &:focus {
        outline: none;
      }
    }

    input[type='number'] {
      -moz-appearance: textfield;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }

    &-range {
      flex: 9 1 auto;
    }

    &-integer {
      input {
        padding-right: 30px;
      }
    }
  }
}

.#{gjs_vars.$app-prefix}select option,
.#{gjs_vars.$app-prefix}field-select option,
.#{gjs_vars.$clm-prefix}select option,
.#{gjs_vars.$sm-prefix}select option,
.#{gjs_vars.$app-prefix}fields option,
.#{gjs_vars.$sm-prefix}unit option {
  background-color: var(--gjs-main-color);
  color: var(--gjs-font-color);
}

.#{gjs_vars.$app-prefix}field {
  background-color: var(--gjs-main-dark-color);
  border: none;
  box-shadow: none;
  border-radius: 2px;
  box-sizing: border-box;
  padding: 0;
  position: relative;

  textarea {
    resize: vertical;
  }

  .#{gjs_vars.$app-prefix}sel-arrow {
    height: 100%;
    width: 9px;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 0;
  }

  .#{gjs_vars.$app-prefix}d-s-arrow {
    bottom: 0;
    top: 0;
    margin: auto;
    right: var(--gjs-input-padding);
    border-top: 4px solid var(--gjs-arrow-color);
    position: absolute;
    height: 0;
    width: 0;
    border-left: 3px solid transparent;
    border-right: 4px solid transparent;
    cursor: pointer;
  }

  &-arrows {
    position: absolute;
    cursor: ns-resize;
    margin: auto;
    height: 20px;
    width: 9px;
    z-index: 10;
    bottom: 0;
    right: calc(var(--gjs-input-padding) - 2px);
    top: 0;
  }

  &-color,
  &-radio {
    width: 100%;
  }
}

.#{gjs_vars.$app-prefix}field-color {
  input {
    padding-right: var(--gjs-color-input-padding);
    box-sizing: border-box;
  }
}

.#{gjs_vars.$app-prefix}field-colorp {
  border-left: 1px solid var(--gjs-main-dark-color);
  box-sizing: border-box;
  height: 100%;
  padding: 2px;
  position: absolute;
  right: 0;
  top: 0;
  width: var(--gjs-color-input-padding);
  z-index: 10;

  .#{gjs_vars.$app-prefix}checker-bg {
    height: 100%;
    width: 100%;
    border-radius: 1px;
  }
}

.#{gjs_vars.$app-prefix}field-colorp-c {
  @extend .#{gjs_vars.$app-prefix}checker-bg;

  height: 100%;
  position: relative;
  width: 100%;
}

.#{gjs_vars.$app-prefix}field-color-picker {
  background-color: var(--gjs-font-color);
  cursor: pointer;
  height: 100%;
  width: 100%;
  box-shadow: 0 0 1px var(--gjs-main-dark-color);
  border-radius: 1px;
  position: absolute;
  top: 0;
}

/* ??? */
.#{gjs_vars.$app-prefix}field-checkbox {
  padding: 0;
  width: 17px;
  height: 17px;
  display: block;
  cursor: pointer;

  input {
    display: none;
  }

  input:checked + .#{gjs_vars.$app-prefix}chk-icon {
    border-color: rgba(255, 255, 255, 0.5);
    border-width: 0 2px 2px 0;
    border-style: solid;
  }
}

.#{gjs_vars.$app-prefix}radio-item {
  flex: 1 1 auto;
  text-align: center;
  border-left: 1px solid var(--gjs-dark-text-shadow);

  &:first-child {
    border: none;
  }

  &:hover {
    background: var(--gjs-main-dark-color);
  }

  input {
    display: none;
  }

  input:checked + .#{gjs_vars.$app-prefix}radio-item-label {
    background-color: rgba(255, 255, 255, 0.2);
  }

  &s {
    display: flex;
  }
}

.#{gjs_vars.$app-prefix}radio-item-label {
  cursor: pointer;
  display: block;
  padding: var(--gjs-input-padding);
}

.#{gjs_vars.$app-prefix}field-units {
  position: absolute;
  margin: auto;
  right: 10px;
  bottom: 0;
  top: 0;
}

.#{gjs_vars.$app-prefix}field-unit {
  position: absolute;
  right: 10px;
  top: 3px;
  font-size: 10px;
  color: var(--gjs-arrow-color);
  cursor: pointer;
}

.#{gjs_vars.$app-prefix}input-unit {
  text-align: center;
}

.#{gjs_vars.$app-prefix}field-arrow-u,
.#{gjs_vars.$app-prefix}field-arrow-d {
  position: absolute;
  height: 0;
  width: 0;
  border-left: 3px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid var(--gjs-arrow-color);
  bottom: 4px;
  cursor: pointer;
}

.#{gjs_vars.$app-prefix}field-arrow-u {
  border-bottom: 4px solid var(--gjs-arrow-color);
  border-top: none;
  top: 4px;
}

.#{gjs_vars.$app-prefix}field-select {
  padding: 0;
}

.#{gjs_vars.$app-prefix}field-range {
  background-color: transparent;
  border: none;
  box-shadow: none;
  padding: 0;

  input {
    margin: 0;
    height: 100%;

    &:focus {
      outline: none;
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      margin-top: -4px;

      @include rangeThumbStyle();
    }

    &::-moz-range-thumb {
      @include rangeThumbStyle();
    }

    &::-ms-thumb {
      @include rangeThumbStyle();
    }

    /* -moz-range-progress */
    &::-moz-range-track {
      @include rangeTrackStyle();
    }

    &::-webkit-slider-runnable-track {
      @include rangeTrackStyle();
    }

    &::-ms-track {
      @include rangeTrackStyle();
    }
  }
}

.#{gjs_vars.$app-prefix}btn {
  &-prim {
    color: inherit;
    background-color: var(--gjs-main-light-color);
    border-radius: 2px;
    padding: 3px 6px;
    padding: var(--gjs-input-padding);
    cursor: pointer;
    border: none;

    &:active {
      background-color: var(--gjs-main-light-color);
    }
  }

  &--full {
    width: 100%;
  }
}

.#{gjs_vars.$app-prefix}chk-icon {
  @include gjs_main_mixins.transform(rotate(45deg));

  box-sizing: border-box;
  display: block;
  height: 14px;
  margin: 0 5px;
  width: 6px;
}

.#{gjs_vars.$app-prefix}add-trasp {
  background: none;
  border: none;
  color: var(--gjs-font-color);
  cursor: pointer;
  font-size: 1em;
  border-radius: 2px;

  @include gjs_main_mixins.opacity(0.75);

  &:hover {
    @include gjs_main_mixins.opacity(1);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.2);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: _gjs_layers.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/_gjs_layers.scss

```text
@use 'gjs_main_mixins';
@use 'gjs_vars';
@use 'gjs_category_general';

$layerIconSize: 15px !default;

.#{gjs_vars.$nv-prefix} {
  &selected-parent {
    border: 1px solid var(--gjs-color-yellow);
  }

  &opac50 {
    @include gjs_main_mixins.opacity(0.5);
  }

  &layer {
    font-weight: lighter;
    text-align: left;
    position: relative;
    font-size: var(--gjs-font-size);
    display: grid;

    &-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 10px;
      border-bottom: 1px solid var(--gjs-main-dark-color);
      background-color: var(--gjs-secondary-dark-color);
      gap: var(--gjs-flex-item-gap);
      cursor: pointer;

      &-left,
      &-right {
        display: flex;
        align-items: center;
        gap: var(--gjs-flex-item-gap);
      }

      &-left {
        width: 100%;
      }
    }

    &-hidden {
      @include gjs_main_mixins.opacity(0.55);
    }

    &-vis {
      box-sizing: content-box;
      cursor: pointer;
      z-index: 1;

      &-on,
      &-off {
        display: flex;
        width: 13px;
        height: 13px;
      }

      &-off {
        display: none;
      }

      &.#{gjs_vars.$nv-prefix}layer-off {
        .#{gjs_vars.$nv-prefix}layer-vis-on {
          display: none;
        }
        .#{gjs_vars.$nv-prefix}layer-vis-off {
          display: flex;
        }
      }
    }

    &-caret {
      width: 15px;
      height: 15px;
      cursor: pointer;
      box-sizing: content-box;
      transform: rotate(90deg);
      display: flex;
      @include gjs_main_mixins.opacity(0.7);

      &:hover {
        @include gjs_main_mixins.opacity(1);
      }
    }

    &.open > &-item &-caret {
      transform: rotate(180deg);
    }

    &-title {
      @extend .#{gjs_vars.$app-prefix}category-title;

      padding: 0;
      display: flex;
      align-items: center;
      background-color: transparent !important;
      border-bottom: none;

      &-inn {
        align-items: center;
        position: relative;
        display: flex;
        gap: var(--gjs-flex-item-gap);
      }

      &-c {
        width: 100%;
      }
    }

    &__icon {
      display: block;
      width: 100%;
      max-width: $layerIconSize;
      max-height: $layerIconSize;
      padding-left: 5px;

      svg {
        fill: currentColor;
      }
    }

    &-name {
      display: inline-block;
      box-sizing: content-box;
      overflow: hidden;
      white-space: nowrap;
      max-width: 170px;
      height: auto;
      @extend .#{gjs_vars.$app-prefix}no-user-select;

      &--no-edit {
        text-overflow: ellipsis;
      }
    }

    > .#{gjs_vars.$nv-prefix}layer-children {
      display: none;
    }

    &.open > .#{gjs_vars.$nv-prefix}layer-children {
      display: block;
    }

    &-no-chld > .#{gjs_vars.$nv-prefix}layer-title-inn > .#{gjs_vars.$nv-prefix}layer-caret {
      visibility: hidden;
    }

    &-move {
      display: flex;
      width: 13px;
      height: 13px;
      box-sizing: content-box;
      cursor: move;
    }

    &.#{gjs_vars.$nv-prefix}hovered .#{gjs_vars.$nv-prefix}layer-item {
      background-color: var(--gjs-soft-light-color);
    }

    &.#{gjs_vars.$nv-prefix}selected .#{gjs_vars.$nv-prefix}layer-item {
      background-color: var(--gjs-main-light-color);
    }
  }
}

.#{gjs_vars.$app-prefix}layers {
  position: relative;
  height: 100%;

  ##{gjs_vars.$nv-prefix}placeholder {
    width: 100%;
    position: absolute;

    ##{gjs_vars.$nv-prefix}plh-int {
      height: 100%;
      padding: 1px;

      &.#{gjs_vars.$nv-prefix}insert {
        background-color: var(--gjs-color-green);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: _gjs_main_mixins.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/_gjs_main_mixins.scss

```text
@use 'gjs_vars';

$gjs-is-prefix: '.#{gjs_vars.$app-prefix}is__';

@function gjs-is($name) {
  @return '#{$gjs-is-prefix}#{$name}';
}

@function darken-color($color, $percentage) {
  @return color-mix(in srgb, $color, black $percentage);
}

@function lighten-color($color, $percentage) {
  @return color-mix(in srgb, $color, white $percentage);
}

@mixin user-select($v) {
  -moz-user-select: $v;
  -khtml-user-select: $v;
  -webkit-user-select: $v;
  -ms-user-select: $v;
  -o-user-select: $v;
  user-select: $v;
}

@mixin opacity($v) {
  opacity: $v;
  filter: alpha(opacity=$v * 100);
}

@mixin appearance($v) {
  -webkit-appearance: $v;
  -moz-appearance: $v;
  appearance: $v;
}

@mixin transform($v) {
  -ms-transform: $v;
  -webkit-transform: $v;
  -moz-transform: $v;
  transform: $v;
}
```

--------------------------------------------------------------------------------

---[FILE: _gjs_modal.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/_gjs_modal.scss

```text
@use 'gjs_vars';
@use 'gjs_category_general';

.#{gjs_vars.$mdl-prefix} {
  &container {
    font-family: var(--gjs-main-font);
    overflow-y: auto;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
  }

  &dialog {
    text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.05);
    animation: #{gjs_vars.$app-prefix}slide-down 0.215s;
    margin: auto;
    max-width: 850px;
    width: 90%;
    border-radius: 3px;
    font-weight: lighter;
    position: relative;
    z-index: 2;
  }

  &title {
    font-size: 1rem;
  }

  &btn-close {
    @extend .btn-cl;

    position: absolute;
    right: 15px;
    top: 5px;
  }

  &active .#{gjs_vars.$mdl-prefix}dialog {
    animation: #{gjs_vars.$mdl-prefix}slide-down 0.216s;
  }

  &header,
  &content {
    padding: 10px 15px;
    clear: both;
  }

  &header {
    position: relative;
    border-bottom: 1px solid var(--gjs-main-dark-color);
    padding: 15px 15px 7px;
  }
}

.#{gjs_vars.$app-prefix}export-dl::after {
  content: '';
  clear: both;
  display: block;
  margin-bottom: 10px;
}
```

--------------------------------------------------------------------------------

---[FILE: _gjs_panels.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/_gjs_panels.scss

```text
@use 'gjs_vars';

.#{gjs_vars.$pn-prefix} {
  &panel {
    display: inline-block;
    position: absolute;
    box-sizing: border-box;
    text-align: center;
    padding: 5px;
    z-index: 3;

    .icon-undo,
    .icon-redo {
      font-size: 20px;
      height: 30px;
      width: 25px;
    }
  }

  &commands {
    width: calc(100% - var(--gjs-left-width));
    left: 0;
    top: 0;
    box-shadow: 0 0 5px var(--gjs-main-dark-color);
  }

  &options {
    right: var(--gjs-left-width);
    top: 0;
  }

  &views {
    border-bottom: 2px solid var(--gjs-main-dark-color);
    right: 0;
    width: var(--gjs-left-width);
    z-index: 4;

    &-container {
      height: 100%;
      padding: 42px 0 0;
      right: 0;
      width: var(--gjs-left-width);
      overflow: auto;
      box-shadow: 0 0 5px var(--gjs-main-dark-color);
    }
  }

  &buttons {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  &btn {
    box-sizing: border-box;
    min-height: 30px;
    min-width: 30px;
    line-height: 21px;
    background-color: transparent;
    border: none;
    font-size: 18px;
    margin-right: 5px;
    border-radius: 2px;
    padding: 4px;
    position: relative;
    cursor: pointer;

    &.#{gjs_vars.$pn-prefix}active {
      background-color: rgba(0, 0, 0, 0.15);
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.25) inset;
    }

    svg {
      fill: currentColor;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: _gjs_root.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/_gjs_root.scss

```text
@use 'gjs_vars';

:root {
  --gjs-main-color: #{gjs_vars.$mainColor};
  --gjs-primary-color: #{gjs_vars.$primaryColor};
  --gjs-secondary-color: #{gjs_vars.$secondaryColor};
  --gjs-tertiary-color: #{gjs_vars.$tertiaryColor};
  --gjs-quaternary-color: #{gjs_vars.$quaternaryColor};
  --gjs-font-color: #{gjs_vars.$fontColor};
  --gjs-font-color-active: #{gjs_vars.$fontColorActive};
  --gjs-main-dark-color: #{gjs_vars.$mainDkColor};
  --gjs-secondary-dark-color: #{gjs_vars.$mainDklColor};
  --gjs-main-light-color: #{gjs_vars.$mainLhColor};
  --gjs-secondary-light-color: #{gjs_vars.$mainLhlColor};
  --gjs-soft-light-color: #{gjs_vars.$softLhColor};
  --gjs-color-blue: #{gjs_vars.$colorBlue};
  --gjs-color-red: #{gjs_vars.$colorRed};
  --gjs-color-yellow: #{gjs_vars.$colorYell};
  --gjs-color-green: #{gjs_vars.$colorGreen};
  --gjs-left-width: #{gjs_vars.$leftWidth};
  --gjs-color-highlight: #{gjs_vars.$colorHighlight};
  --gjs-color-warn: #{gjs_vars.$colorWarn};
  --gjs-handle-margin: #{gjs_vars.$hndlMargin};
  --gjs-light-border: #{gjs_vars.$lightBorder};
  --gjs-arrow-color: #{gjs_vars.$arrowColor};
  --gjs-dark-text-shadow: #{gjs_vars.$darkTextShadow};
  --gjs-color-input-padding: #{gjs_vars.$colorpSize};
  --gjs-input-padding: #{gjs_vars.$inputPadding}; // Has to be a single value
  --gjs-padding-elem-classmanager: #{gjs_vars.$paddElClm};
  --gjs-upload-padding: #{gjs_vars.$uploadPadding};
  --gjs-animation-duration: #{gjs_vars.$animSpeed};
  --gjs-main-font: #{gjs_vars.$mainFont};
  --gjs-font-size: #{gjs_vars.$fontSize};
  --gjs-placeholder-background-color: #{gjs_vars.$placeholderColor};
  --gjs-canvas-top: #{gjs_vars.$canvasTop};
  --gjs-flex-item-gap: 5px;
}
```

--------------------------------------------------------------------------------

---[FILE: _gjs_rte.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/_gjs_rte.scss

```text
@use 'gjs_vars';
@use 'gjs_category_general';

.#{gjs_vars.$rte-prefix} {
  &toolbar {
    @extend .#{gjs_vars.$app-prefix}no-user-select;

    position: absolute;
    z-index: 10;
  }

  &toolbar-ui {
    border: 1px solid var(--gjs-main-dark-color);
    border-radius: 3px;
  }

  &actionbar {
    display: flex;
  }

  &action {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    width: 25px;
    border-right: 1px solid var(--gjs-main-dark-color);
    text-align: center;
    cursor: pointer;
    outline: none;

    &:last-child {
      border-right: none;
    }

    &:hover {
      background-color: var(--gjs-main-light-color);
    }
  }

  &active {
    background-color: var(--gjs-main-light-color);
  }
  &disabled {
    color: var(--gjs-main-light-color);
    cursor: not-allowed;
    &:hover {
      background-color: unset;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: _gjs_selectors.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/_gjs_selectors.scss

```text
@use 'gjs_main_mixins';
@use 'gjs_vars';
@use 'gjs_style_manager';

.#{gjs_vars.$clm-prefix}field {
  @extend .#{gjs_vars.$sm-prefix}field;
}

.#{gjs_vars.$clm-prefix}select {
  @extend .#{gjs_vars.$sm-prefix}field, .#{gjs_vars.$sm-prefix}select;
}

##{gjs_vars.$clm-prefix}add-tag,
.#{gjs_vars.$clm-prefix}tags-btn {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  padding: 3px;
  margin-right: 3px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  width: 24px;
  height: 24px;
  box-sizing: border-box;
  cursor: pointer;
}

.#{gjs_vars.$clm-prefix} {
  &tags-btn svg {
    fill: currentColor;
    display: block;
  }

  &header {
    display: flex;
    align-items: center;
    margin: 7px 0;

    &-status {
      flex-shrink: 1;
      margin-left: auto;
    }
  }

  &tag {
    display: flex;
    overflow: hidden;
    align-items: center;
    border-radius: 3px;
    margin: 0 3px 3px 0;
    padding: 5px;
    cursor: default;

    &-status,
    &-close {
      width: 12px;
      height: 12px;
      flex-shrink: 1;

      svg {
        vertical-align: middle;
        fill: currentColor;
      }
    }
  }

  &sels-info {
    margin: 7px 0;
    text-align: left;
  }

  &sel-id {
    font-size: 0.9em;
    @include gjs_main_mixins.opacity(0.5);
  }

  &label-sel {
    float: left;
    padding-right: 5px;
  }
}

.#{gjs_vars.$clm-prefix}tags {
  font-size: var(--gjs-font-size);
  padding: 10px 5px;

  ##{gjs_vars.$clm-prefix}sel {
    padding: 7px 0;
    float: left;
  }

  ##{gjs_vars.$clm-prefix}sel {
    font-style: italic;
    margin-left: 5px;
  }

  ##{gjs_vars.$clm-prefix}tags-field {
    clear: both;
    padding: 5px;
    margin-bottom: 5px;
    display: flex;
    flex-wrap: wrap;
  }

  ##{gjs_vars.$clm-prefix}tags-c {
    display: flex;
    flex-wrap: wrap;
    vertical-align: top;
    overflow: hidden;
  }

  ##{gjs_vars.$clm-prefix}new {
    @extend .#{gjs_vars.$app-prefix}invis-invis;

    color: var(--gjs-font-color);
    padding: var(--gjs-padding-elem-classmanager);
    display: none;
  }

  ##{gjs_vars.$clm-prefix}close {
    @include gjs_main_mixins.opacity(0.85);
    font-size: 20px;
    line-height: 0;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.9);
    @extend .no-select;

    &:hover {
      @include gjs_main_mixins.opacity(1);
    }
  }

  ##{gjs_vars.$clm-prefix}checkbox {
    color: rgba(255, 255, 255, 0.9);
    vertical-align: middle;
    cursor: pointer;
    font-size: 9px;
  }

  ##{gjs_vars.$clm-prefix}tag-label {
    flex-grow: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 0 3px;
    cursor: text;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: _gjs_spectrum.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/_gjs_spectrum.scss

```text
@use 'gjs_vars';
@use 'spectrum.scss';

.#{gjs_vars.$app-prefix}editor-sp {
  border: 1px solid var(--gjs-main-dark-color);
  box-shadow: 0 0 7px var(--gjs-main-dark-color);
  border-radius: 3px;
}

.#{gjs_vars.$app-prefix}editor-sp {
  .sp-hue,
  .sp-slider {
    cursor: row-resize;
  }
  .sp-color,
  .sp-dragger {
    cursor: crosshair;
  }
  .sp-alpha-inner,
  .sp-alpha-handle {
    cursor: col-resize;
  }
  .sp-hue {
    left: 90%;
  }
  .sp-color {
    right: 15%;
  }
  .sp-picker-container {
    border: none;
  }
  .colpick_dark .colpick_color {
    outline: 1px solid var(--gjs-main-dark-color);
  }
  .sp-cancel,
  .sp-cancel:hover {
    bottom: -8px;
    color: #777 !important;
    font-size: 25px;
    left: 0;
    position: absolute;
    text-decoration: none;
  }
  .sp-alpha-handle {
    background-color: #ccc;
    border: 1px solid #555;
    width: 4px;
  }
  .sp-color,
  .sp-hue {
    border: 1px solid #333333;
  }
  .sp-slider {
    background-color: #ccc;
    border: 1px solid #555;
    height: 3px;
    left: -4px;
    width: 22px;
  }
  .sp-dragger {
    background: transparent;
    box-shadow: 0 0 0 1px #111;
  }
  .sp-button-container {
    float: none;
    width: 100%;
    position: relative;
    text-align: right;

    .sp-choose,
    .sp-choose:hover,
    .sp-choose:active {
      background: var(--gjs-main-dark-color);
      border-color: var(--gjs-main-dark-color);
      color: var(--gjs-font-color);
      text-shadow: none;
      box-shadow: none;
      padding: 3px 5px;
    }
  }
  .sp-palette-container {
    border: none;
    float: none;
    margin: 0;
    padding: 5px 10px 0;
  }
  .sp-palette .sp-thumb-el,
  .sp-palette .sp-thumb-el:hover {
    border: 1px solid rgba(0, 0, 0, 0.9);
  }

  .sp-palette .sp-thumb-el:hover,
  .sp-palette .sp-thumb-el.sp-thumb-active {
    border-color: rgba(0, 0, 0, 0.9);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: _gjs_status.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/_gjs_status.scss

```text
@use 'gjs_main_mixins';
@use 'gjs_vars';

@function gjs-is($name) {
  @return '#{gjs_main_mixins.$gjs-is-prefix}#{$name}';
}

#{gjs_main_mixins.$gjs-is-prefix} {
  &grab,
  &grab * {
    cursor: grab !important;
  }

  &grabbing,
  &grabbing * {
    @include gjs_main_mixins.user-select(none);
    cursor: grabbing !important;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: _gjs_style_manager.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/_gjs_style_manager.scss

```text
@use 'gjs_main_mixins';
@use 'gjs_vars';
@use 'gjs_category_general';

.#{gjs_vars.$sm-prefix} {
  &clear {
    cursor: pointer;
    width: 14px;
    min-width: 14px;
    height: 14px;
    margin-left: 3px;
  }

  &header {
    font-weight: lighter;
    padding: 10px;
  }

  // Sector
  &sector {
    clear: both;
    font-weight: lighter;
    text-align: left;

    &-title {
      @extend .#{gjs_vars.$app-prefix}category-title;
      display: flex;
      align-items: center;
    }

    &-caret {
      width: 17px;
      height: 17px;
      min-width: 17px;
      transform: rotate(-90deg);
    }

    &-label {
      margin-left: 5px;
    }

    &.#{gjs_vars.$sm-prefix}open {
      @extend .#{gjs_vars.$app-prefix}category-open;

      .#{gjs_vars.$sm-prefix}sector-caret {
        transform: none;
      }
    }
  }

  &properties {
    font-size: var(--gjs-font-size);
    padding: 10px 5px;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    box-sizing: border-box;
    width: 100%;
  }
  // Sector END

  &label {
    margin: 5px 5px 3px 0;
    display: flex;
    align-items: center;
  }
}

.#{gjs_vars.$sm-prefix}close-btn {
  display: block;
  font-size: 23px;
  position: absolute;
  cursor: pointer;
  right: 5px;
  top: 0;

  @include gjs_main_mixins.opacity(0.7);

  &:hover {
    @include gjs_main_mixins.opacity(0.9);
  }
}

/* ------------------Field-------------------- */

.#{gjs_vars.$sm-prefix}field {
  width: 100%;
  position: relative;

  input,
  select {
    background-color: transparent;
    color: gjs_vars.$mainLhlColor;
    border: none;
    width: 100%;
  }

  input {
    box-sizing: border-box;
  }

  select {
    position: relative;
    z-index: 1;

    @include gjs_main_mixins.appearance(none);

    &::-ms-expand {
      display: none;
    }
  }

  select:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 var(--gjs-secondary-light-color);
  }

  input:focus,
  select:focus {
    outline: none;
  }

  .#{gjs_vars.$sm-prefix}unit {
    position: absolute;
    right: 10px;
    top: 3px;
    font-size: 10px;
    color: var(--gjs-secondary-light-color);
    cursor: pointer;
  }

  .#{gjs_vars.$clm-prefix}sel-arrow,
  .#{gjs_vars.$sm-prefix}int-arrows,
  .#{gjs_vars.$sm-prefix}sel-arrow {
    height: 100%;
    width: 9px;
    position: absolute;
    right: 0;
    top: 0;
    cursor: ns-resize;
  }

  .#{gjs_vars.$sm-prefix}sel-arrow {
    cursor: pointer;
  }

  .#{gjs_vars.$clm-prefix}d-s-arrow,
  .#{gjs_vars.$sm-prefix}d-arrow,
  .#{gjs_vars.$sm-prefix}d-s-arrow,
  .#{gjs_vars.$sm-prefix}u-arrow {
    position: absolute;
    height: 0;
    width: 0;
    border-left: 3px solid transparent;
    border-right: 4px solid transparent;
    cursor: pointer;
  }

  .#{gjs_vars.$sm-prefix}u-arrow {
    border-bottom: 4px solid var(--gjs-secondary-light-color);
    top: 4px;
  }

  .#{gjs_vars.$clm-prefix}d-s-arrow,
  .#{gjs_vars.$sm-prefix}d-arrow,
  .#{gjs_vars.$sm-prefix}d-s-arrow {
    border-top: 4px solid var(--gjs-secondary-light-color);
    bottom: 4px;
  }

  .#{gjs_vars.$clm-prefix}d-s-arrow,
  .#{gjs_vars.$sm-prefix}d-s-arrow {
    bottom: 7px;
  }

  &.#{gjs_vars.$sm-prefix}color,
  &.#{gjs_vars.$sm-prefix}input,
  &.#{gjs_vars.$sm-prefix}integer,
  &.#{gjs_vars.$sm-prefix}list,
  &.#{gjs_vars.$sm-prefix}select {
    background-color: var(--gjs-main-dark-color);
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 1px 1px 0 var(--gjs-main-light-color);
    color: var(--gjs-secondary-light-color);
    border-radius: 2px;
    box-sizing: border-box;
    padding: 0 5px;
  }

  &.#{gjs_vars.$sm-prefix}composite {
    border-radius: 2px;
  }

  &.#{gjs_vars.$sm-prefix}select {
    padding: 0;
  }

  &.#{gjs_vars.$sm-prefix}select select {
    height: 20px;
  }

  &.#{gjs_vars.$sm-prefix}select option {
    padding: 3px 0;
  }

  &.#{gjs_vars.$sm-prefix}composite {
    background-color: var(--gjs-secondary-dark-color);
    border: 1px solid rgba(0, 0, 0, 0.25);
  }

  &.#{gjs_vars.$sm-prefix}list {
    width: auto;
    padding: 0;
    overflow: hidden;
    float: left;

    input {
      display: none;
    }

    label {
      cursor: pointer;
      padding: 5px;
      display: block;
    }

    .#{gjs_vars.$sm-prefix}radio:checked + label {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .#{gjs_vars.$sm-prefix}icon {
      background-repeat: no-repeat;
      background-position: center;
      text-shadow: none;
      line-height: normal;
      //padding: 5px 19px;
    }
  }

  &.#{gjs_vars.$sm-prefix}integer select {
    width: auto;
    padding: 0;
  }
}

/* ------------------END Field-------------------- */

.#{gjs_vars.$sm-prefix}list .#{gjs_vars.$sm-prefix}el {
  float: left;
  border-left: 1px solid var(--gjs-main-dark-color);

  &:first-child {
    border: none;
  }

  &:hover {
    background: var(--gjs-main-dark-color);
  }
}

/* ------------------Property-------------------- */

.#{gjs_vars.$sm-prefix} {
  &slider {
    .#{gjs_vars.$app-prefix}field-integer {
      flex: 1 1 65px;
    }
  }
}

.#{gjs_vars.$sm-prefix}property {
  box-sizing: border-box;
  float: left;
  width: 50%;
  margin-bottom: 5px;
  padding: 0 5px;

  &--full,
  &.#{gjs_vars.$sm-prefix}composite,
  &.#{gjs_vars.$sm-prefix}file,
  &.#{gjs_vars.$sm-prefix}list,
  &.#{gjs_vars.$sm-prefix}stack,
  &.#{gjs_vars.$sm-prefix}slider,
  &.#{gjs_vars.$sm-prefix}color {
    width: 100%;
  }

  .#{gjs_vars.$sm-prefix}btn {
    background-color: gjs_main_mixins.lighten-color(var(--gjs-main-dark-color), 13%);
    border-radius: 2px;
    box-shadow:
      1px 1px 0 gjs_main_mixins.lighten-color(var(--gjs-main-dark-color), 2%),
      1px 1px 0 gjs_main_mixins.lighten-color(var(--gjs-main-dark-color), 17%) inset;
    padding: 5px;
    position: relative;
    text-align: center;
    height: auto;
    width: 100%;
    cursor: pointer;
    color: var(--gjs-font-color);
    box-sizing: border-box;
    text-shadow: -1px -1px 0 var(--gjs-main-dark-color);
    border: none;

    @include gjs_main_mixins.opacity(0.85);
  }

  .#{gjs_vars.$sm-prefix}btn-c {
    box-sizing: border-box;
    float: left;
    width: 100%;
  }

  &__text-shadow .#{gjs_vars.$sm-prefix}layer-preview-cnt::after {
    color: #000;
    content: 'T';
    font-weight: 900;
    line-height: 17px;
    padding: 0 4px;
  }
}

.#{gjs_vars.$sm-prefix}preview-file {
  background-color: var(--gjs-light-border);
  border-radius: 2px;
  margin-top: 5px;
  position: relative;
  overflow: hidden;
  border: 1px solid gjs_main_mixins.darken-color(var(--gjs-light-border), 1%);
  padding: 3px 20px;

  &-cnt {
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: center center;
    height: 50px;
  }

  &-close {
    @extend .#{gjs_vars.$sm-prefix}close-btn;

    top: -5px;
    width: 14px;
    height: 14px;
  }
}

// Layers

.#{gjs_vars.$sm-prefix}layers {
  margin-top: 5px;
  padding: 1px 3px;
  min-height: 30px;
}

.#{gjs_vars.$sm-prefix}layer {
  background-color: rgba(255, 255, 255, 0.055);
  border-radius: 2px;
  margin: 2px 0;
  padding: 7px;
  position: relative;

  &.#{gjs_vars.$sm-prefix}active {
    background-color: rgba(255, 255, 255, 0.12);
  }

  .#{gjs_vars.$sm-prefix}label-wrp {
    display: flex;
    align-items: center;
  }

  ##{gjs_vars.$sm-prefix}move {
    height: 14px;
    width: 14px;
    min-width: 14px;
    cursor: grab;
  }

  ##{gjs_vars.$sm-prefix}label {
    flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0 5px;
  }

  &-preview {
    @extend .checker-bg;

    height: 15px;
    width: 15px;
    min-width: 15px;
    margin-right: 5px;
    border-radius: 2px;

    &-cnt {
      border-radius: 2px;
      background-color: white;
      height: 100%;
      width: 100%;
      background-size: cover !important;
    }
  }

  ##{gjs_vars.$sm-prefix}close-layer {
    display: block;
    cursor: pointer;
    height: 14px;
    width: 14px;
    min-width: 14px;

    @include gjs_main_mixins.opacity(0.5);

    &:hover {
      @include gjs_main_mixins.opacity(0.8);
    }
  }
}

/* ------------------END Property-------------------- */

.#{gjs_vars.$sm-prefix}stack .#{gjs_vars.$sm-prefix}properties {
  padding: 5px 0 0;
}

.#{gjs_vars.$sm-prefix}stack ##{gjs_vars.$sm-prefix}add {
  @extend .#{gjs_vars.$app-prefix}color-main;

  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  position: absolute;
  right: 0;
  top: -17px;
  opacity: 0.75;
  padding: 0;
  width: 18px;
  height: 18px;

  &:hover {
    @include gjs_main_mixins.opacity(1);
  }
}

.#{gjs_vars.$sm-prefix}colorp-c {
  @extend .#{gjs_vars.$app-prefix}bg-main;

  height: 100%;
  width: 20px;
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  border-radius: 2px;
  padding: 2px;

  // adding reference to .gjs-field-colorp-c to match rendered CSS before removing the use of @imports
  .#{gjs_vars.$app-prefix}field-colorp-c,
  .#{gjs_vars.$app-prefix}checker-bg {
    height: 100%;
    width: 100%;
    border-radius: 1px;
  }
}

.#{gjs_vars.$sm-prefix}color-picker {
  background-color: var(--gjs-font-color);
  cursor: pointer;
  height: 16px;
  width: 100%;
  margin-top: -16px;
  box-shadow: 0 0 1px var(--gjs-main-dark-color);
  border-radius: 1px;
}

.#{gjs_vars.$sm-prefix}btn-upload ##{gjs_vars.$sm-prefix}upload {
  left: 0;
  top: 0;
  position: absolute;
  width: 100%;
  opacity: 0;
  cursor: pointer;
}

.#{gjs_vars.$sm-prefix}btn-upload ##{gjs_vars.$sm-prefix}label {
  padding: 2px 0;
}

.#{gjs_vars.$sm-prefix}layer > ##{gjs_vars.$sm-prefix}move {
  @include gjs_main_mixins.opacity(0.7);

  cursor: move;
  font-size: 12px;
  float: left;
  margin: 0 5px 0 0;

  &:hover {
    @include gjs_main_mixins.opacity(0.9);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: _gjs_traits.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/_gjs_traits.scss

```text
@use 'gjs_vars';
@use 'gjs_category_general';

.#{gjs_vars.$app-prefix} {
  &traits-label {
    border-bottom: 1px solid var(--gjs-main-dark-color);
    font-weight: lighter;
    margin-bottom: 5px;
    padding: 10px;
    text-align: left;
  }

  &label {
    &-wrp {
      width: 30%;
      min-width: 30%;
    }
  }

  &field {
    &-wrp {
      flex-grow: 1;
    }
  }

  &traits-c,
  &traits-cs {
    display: flex;
    flex-direction: column;
  }

  &trait-categories {
    display: flex;
    flex-direction: column;
  }

  &trait-category {
    width: 100%;

    &.#{gjs_vars.$app-prefix}open {
      @extend .#{gjs_vars.$app-prefix}category-open;
    }

    .#{gjs_vars.$app-prefix}title {
      @extend .#{gjs_vars.$app-prefix}category-title;
    }

    .#{gjs_vars.$app-prefix}caret-icon {
      margin-right: 5px;
    }
  }
}

.#{gjs_vars.$trt-prefix}header {
  font-weight: lighter;
  padding: 10px;
}

.#{gjs_vars.$trt-prefix}trait {
  display: flex;
  justify-content: flex-start;
  padding: 5px 10px;
  font-weight: lighter;
  align-items: center;
  text-align: left;
  gap: 5px;

  &s {
    font-size: var(--gjs-font-size);
  }

  .#{gjs_vars.$app-prefix}label {
    text-align: left;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: _gjs_vars.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/_gjs_vars.scss

```text
/* Class names prefixes */

$app-prefix: 'gjs-' !default;
$nv-prefix: $app-prefix !default;
$rte-prefix: $app-prefix + 'rte-' !default;
$mdl-prefix: $app-prefix + 'mdl-' !default;
$am-prefix: $app-prefix + 'am-' !default;
$cm-prefix: $app-prefix + 'cm-' !default;
$pn-prefix: $app-prefix + 'pn-' !default;
$com-prefix: $app-prefix + 'com-' !default;
$sm-prefix: $app-prefix + 'sm-' !default;
$cv-prefix: $app-prefix + 'cv-' !default;
$clm-prefix: $app-prefix + 'clm-' !default;
$trt-prefix: $app-prefix + 'trt-' !default;
$cui-cls: $app-prefix + 'cui' !default;

/*
  New Pattern Color System
  With this should be easier to overwrite colors
  not only in SCSS but even CSS
*/
$primaryColor: #444 !default;
$secondaryColor: #ddd !default;
$tertiaryColor: #804f7b !default;
$quaternaryColor: #d278c9 !default;

/* Dark theme */
$mainColor: #444 !default; /* Light: #573454 Dark: #3b2639 -moz-linear-gradient(top, #fca99b 0%, #6e2842 100%) */
$fontColor: #ddd !default; /* l: #d8d7db */
$fontColorActive: #f8f8f8 !default;

$mainDkColor: rgba(0, 0, 0, 0.2) !default; /* darken($mainColor, 4%) - #383838 */
$mainDklColor: rgba(0, 0, 0, 0.1) !default;
$mainLhColor: rgba(255, 255, 255, 0.1) !default; /* #515151 */
$mainLhlColor: rgba(255, 255, 255, 0.7) !default;
$softLhColor: rgba(255, 255, 255, 0.015) !default;
$colorBlue: #3b97e3 !default;
$colorRed: #dd3636 !default;
$colorYell: #ffca6f !default;
$colorGreen: #62c462 !default;
$leftWidth: 15% !default;

/* Color Helpers */
$colorHighlight: #71b7f1 !default;
$colorWarn: #ffca6f !default;

/* Canvas */
$hndlMargin: -5px !default;
$canvasTop: 40px !default;

/* Components / Inputs */
$lightBorder: rgba(255, 255, 255, 0.05) !default;
$arrowColor: $mainLhlColor !default; /* b1b1b1 */
$darkTextShadow: $mainDkColor !default; /* #252525 */
$colorpSize: 22px !default;
$inputPadding: 5px !default; // Has to be a single value

/* Class manager */
$paddElClm: 5px 6px !default;

/* File uploader */
$uploadPadding: 150px 10px !default;

/* Commands */
$animSpeed: 0.2s !default;

/* Fonts */
$mainFont: Helvetica, sans-serif !default;
$fontSize: 0.75rem !default;

/* Tools */
$placeholderColor: var(--gjs-color-green) !default;

$prefix: $app-prefix;
```

--------------------------------------------------------------------------------

````
