---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 59
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 59 of 97)

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

---[FILE: main.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/main.scss

```text
/* stylelint-disable */
@use 'sass:meta';
@use 'codemirror/lib/codemirror';
@use 'codemirror/theme/hopscotch';

@use 'gjs_vars';
@use 'gjs_main_mixins';
@use 'gjs_status';

@use 'gjs_root';
@use 'gjs_traits';
@use 'gjs_canvas';
@use 'gjs_commands';
@use 'gjs_panels';
@use 'gjs_inputs';
@use 'gjs_devices';
@use 'gjs_style_manager';
@use 'gjs_category_general';
@use 'gjs_blocks';
@use 'gjs_layers';
@use 'gjs_selectors';
@use 'gjs_modal';
@use 'gjs_assets';
@use 'gjs_file_uploader';
@use 'gjs_code_manager';
@use 'gjs_rte';
@use 'gjs_spectrum';

// spectrum.scss is now called from _gjs_spectrum.scss
//@use 'spectrum.scss';

$colorsAll: (one, var(--gjs-primary-color)), (two, var(--gjs-secondary-color)), (three, var(--gjs-tertiary-color)),
  (four, var(--gjs-quaternary-color)), (danger, var(--gjs-color-red));

.#{gjs_vars.$prefix} {
  @each $cnum, $ccol in $colorsAll {
    &#{$cnum} {
      &-bg {
        background-color: $ccol;
      }

      &-color {
        color: $ccol;

        &-h:hover {
          color: $ccol;
        }
      }
    }
  }
}

.#{gjs_vars.$app-prefix}bdrag {
  pointer-events: none !important;
  position: absolute !important;
  z-index: 10 !important;
  width: auto;
}

.#{gjs_vars.$app-prefix}drag-helper {
  background-color: var(--gjs-color-blue) !important;
  pointer-events: none !important;
  position: absolute !important;
  z-index: 10 !important;
  transform: scale(0.3) !important;
  transform-origin: top left !important;
  -webkit-transform-origin: top left !important;
  margin: 15px !important;
  transition: none !important;
  outline: none !important;
}

.#{gjs_vars.$app-prefix}grabbing,
.#{gjs_vars.$app-prefix}grabbing * {
  @extend .#{gjs_vars.$app-prefix}no-user-select;

  cursor: grabbing !important;
  cursor: -webkit-grabbing !important;
}

.#{gjs_vars.$app-prefix}grabbing {
  overflow: hidden;
}

.#{gjs_vars.$app-prefix}off-prv {
  @extend .#{gjs_vars.$app-prefix}color-main;
  @extend .#{gjs_vars.$app-prefix}bg-main;
  position: relative;
  z-index: 10;
  padding: 5px;
  cursor: pointer;
}

// Custom scrollbars for Chrome
.#{gjs_vars.$app-prefix}editor-cont ::-webkit-scrollbar-track {
  background: var(--gjs-secondary-dark-color);
}

.#{gjs_vars.$app-prefix}editor-cont ::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}

.#{gjs_vars.$app-prefix}editor-cont ::-webkit-scrollbar {
  width: 8px;
}

/********************* MAIN ************************/
// @property --input-padding {
//   syntax: "<length>";
//   inherits: false;
//   initial-value: #{$inputPadding};
// }

.#{gjs_vars.$app-prefix} {
  &no-touch-actions {
    touch-action: none;
  }

  &disabled {
    @include gjs_main_mixins.user-select(none);
    @include gjs_main_mixins.opacity(0.5);
  }

  &editor {
    font-family: var(--gjs-main-font);
    font-size: var(--gjs-font-size);
    position: relative;
    box-sizing: border-box;
    height: 100%;
  }
}

.#{gjs_vars.$app-prefix}freezed,
.#{gjs_vars.$nv-prefix}freezed {
  @include gjs_main_mixins.opacity(0.5);
  pointer-events: none;
}

.#{gjs_vars.$app-prefix}hidden {
  display: none;
}

@keyframes #{gjs_vars.$app-prefix}slide-down {
  0% {
    transform: translate(0, -3rem);
    opacity: 0;
  }
  100% {
    transform: translate(0, 0);
    opacity: 1;
  }
}

@keyframes #{gjs_vars.$app-prefix}slide-up {
  0% {
    transform: translate(0, 0);
    opacity: 1;
  }
  100% {
    transform: translate(0, -3rem);
    opacity: 0;
  }
}

.cm-s-hopscotch span.cm-error {
  color: #ffffff;
}
```

--------------------------------------------------------------------------------

---[FILE: spectrum.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/spectrum.scss

```text
/***
Spectrum Colorpicker v1.8.1
https://github.com/bgrins/spectrum
Author: Brian Grinstead
License: MIT
***/

.sp-container {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  /* https://github.com/bgrins/spectrum/issues/40 */
  z-index: 9999994;
  overflow: hidden;
}
.sp-container.sp-flat {
  position: relative;
}

/* Fix for * { box-sizing: border-box; } */
.sp-container,
.sp-container * {
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}

/* http://ansciath.tumblr.com/post/7347495869/css-aspect-ratio */
.sp-top {
  position: relative;
  width: 100%;
  display: inline-block;
}
.sp-top-inner {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.sp-color {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 20%;
}
.sp-hue {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 84%;
  height: 100%;
}

.sp-clear-enabled .sp-hue {
  top: 33px;
  height: 77.5%;
}

.sp-fill {
  padding-top: 80%;
}
.sp-sat,
.sp-val {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.sp-alpha-enabled .sp-top {
  margin-bottom: 18px;
}
.sp-alpha-enabled .sp-alpha {
  display: block;
}
.sp-alpha-handle {
  position: absolute;
  top: -4px;
  bottom: -4px;
  width: 6px;
  left: 50%;
  cursor: pointer;
  border: 1px solid black;
  background: white;
  opacity: 0.8;
}
.sp-alpha {
  display: none;
  position: absolute;
  bottom: -14px;
  right: 0;
  left: 0;
  height: 8px;
}
.sp-alpha-inner {
  border: solid 1px #333;
}

.sp-clear {
  display: none;
}

.sp-clear.sp-clear-display {
  background-position: center;
}

.sp-clear-enabled .sp-clear {
  display: block;
  position: absolute;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 84%;
  height: 28px;
}

/* Don't allow text selection */
.sp-container,
.sp-replacer,
.sp-preview,
.sp-dragger,
.sp-slider,
.sp-alpha,
.sp-clear,
.sp-alpha-handle,
.sp-container.sp-dragging .sp-input,
.sp-container button {
  -webkit-user-select: none;
  -moz-user-select: -moz-none;
  -o-user-select: none;
  user-select: none;
}

.sp-container.sp-input-disabled .sp-input-container {
  display: none;
}
.sp-container.sp-buttons-disabled .sp-button-container {
  display: none;
}
.sp-container.sp-palette-buttons-disabled .sp-palette-button-container {
  display: none;
}
.sp-palette-only .sp-picker-container {
  display: none;
}
.sp-palette-disabled .sp-palette-container {
  display: none;
}

.sp-initial-disabled .sp-initial {
  display: none;
}

/* Gradients for hue, saturation and value instead of images.  Not pretty... but it works */
.sp-sat {
  background-image: -webkit-gradient(linear, 0 0, 100% 0, from(#fff), to(rgba(204, 154, 129, 0)));
  background-image: -webkit-linear-gradient(left, #fff, rgba(204, 154, 129, 0));
  background-image: -moz-linear-gradient(left, #fff, rgba(204, 154, 129, 0));
  background-image: -o-linear-gradient(left, #fff, rgba(204, 154, 129, 0));
  background-image: -ms-linear-gradient(left, #fff, rgba(204, 154, 129, 0));
  background-image: linear-gradient(to right, #fff, rgba(204, 154, 129, 0));
  -ms-filter: 'progid:DXImageTransform.Microsoft.gradient(GradientType = 1, startColorstr=#FFFFFFFF, endColorstr=#00CC9A81)';
  filter: progid:DXImageTransform.Microsoft.gradient(GradientType = 1, startColorstr='#FFFFFFFF', endColorstr='#00CC9A81');
}
.sp-val {
  background-image: -webkit-gradient(linear, 0 100%, 0 0, from(#000000), to(rgba(204, 154, 129, 0)));
  background-image: -webkit-linear-gradient(bottom, #000000, rgba(204, 154, 129, 0));
  background-image: -moz-linear-gradient(bottom, #000, rgba(204, 154, 129, 0));
  background-image: -o-linear-gradient(bottom, #000, rgba(204, 154, 129, 0));
  background-image: -ms-linear-gradient(bottom, #000, rgba(204, 154, 129, 0));
  background-image: linear-gradient(to top, #000, rgba(204, 154, 129, 0));
  -ms-filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr=#00CC9A81, endColorstr=#FF000000)';
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00CC9A81', endColorstr='#FF000000');
}

.sp-hue {
  background: -moz-linear-gradient(
    top,
    #ff0000 0%,
    #ffff00 17%,
    #00ff00 33%,
    #00ffff 50%,
    #0000ff 67%,
    #ff00ff 83%,
    #ff0000 100%
  );
  background: -ms-linear-gradient(
    top,
    #ff0000 0%,
    #ffff00 17%,
    #00ff00 33%,
    #00ffff 50%,
    #0000ff 67%,
    #ff00ff 83%,
    #ff0000 100%
  );
  background: -o-linear-gradient(
    top,
    #ff0000 0%,
    #ffff00 17%,
    #00ff00 33%,
    #00ffff 50%,
    #0000ff 67%,
    #ff00ff 83%,
    #ff0000 100%
  );
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#ff0000),
    color-stop(0.17, #ffff00),
    color-stop(0.33, #00ff00),
    color-stop(0.5, #00ffff),
    color-stop(0.67, #0000ff),
    color-stop(0.83, #ff00ff),
    to(#ff0000)
  );
  background: -webkit-linear-gradient(
    top,
    #ff0000 0%,
    #ffff00 17%,
    #00ff00 33%,
    #00ffff 50%,
    #0000ff 67%,
    #ff00ff 83%,
    #ff0000 100%
  );
  background: linear-gradient(
    to bottom,
    #ff0000 0%,
    #ffff00 17%,
    #00ff00 33%,
    #00ffff 50%,
    #0000ff 67%,
    #ff00ff 83%,
    #ff0000 100%
  );
}

/* IE filters do not support multiple color stops.
   Generate 6 divs, line them up, and do two color gradients for each.
   Yes, really.
 */
.sp-1 {
  height: 17%;
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff0000', endColorstr='#ffff00');
}
.sp-2 {
  height: 16%;
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffff00', endColorstr='#00ff00');
}
.sp-3 {
  height: 17%;
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00ff00', endColorstr='#00ffff');
}
.sp-4 {
  height: 17%;
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00ffff', endColorstr='#0000ff');
}
.sp-5 {
  height: 16%;
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#0000ff', endColorstr='#ff00ff');
}
.sp-6 {
  height: 17%;
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff00ff', endColorstr='#ff0000');
}

.sp-hidden {
  display: none !important;
}

/* Clearfix hack */
.sp-cf:before,
.sp-cf:after {
  content: '';
  display: table;
}
.sp-cf:after {
  clear: both;
}

/* Mobile devices, make hue slider bigger so it is easier to slide */
@media (max-device-width: 480px) {
  .sp-color {
    right: 40%;
  }
  .sp-hue {
    left: 63%;
  }
  .sp-fill {
    padding-top: 60%;
  }
}
.sp-dragger {
  border-radius: 5px;
  height: 5px;
  width: 5px;
  border: 1px solid #fff;
  background: #000;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
}
.sp-slider {
  position: absolute;
  top: 0;
  cursor: pointer;
  height: 3px;
  left: -1px;
  right: -1px;
  border: 1px solid #000;
  background: white;
  opacity: 0.8;
}

/*
Theme authors:
Here are the basic themeable display options (colors, fonts, global widths).
See http://bgrins.github.io/spectrum/themes/ for instructions.
*/

.sp-container {
  border-radius: 0;
  background-color: #ececec;
  border: solid 1px #f0c49b;
  padding: 0;
}
.sp-container,
.sp-container button,
.sp-container input,
.sp-color,
.sp-hue,
.sp-clear {
  font:
    normal 12px 'Lucida Grande',
    'Lucida Sans Unicode',
    'Lucida Sans',
    Geneva,
    Verdana,
    sans-serif;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
}
.sp-top {
  margin-bottom: 3px;
}
.sp-color,
.sp-hue,
.sp-clear {
  border: solid 1px #666;
}

/* Input */
.sp-input-container {
  float: right;
  width: 100px;
  margin-bottom: 4px;
}
.sp-initial-disabled .sp-input-container {
  width: 100%;
}
.sp-input {
  font-size: 12px !important;
  border: 1px inset;
  padding: 4px 5px;
  margin: 0;
  width: 100%;
  background: transparent;
  border-radius: 3px;
  color: #222;
}
.sp-input:focus {
  border: 1px solid orange;
}
.sp-input.sp-validation-error {
  border: 1px solid red;
  background: #fdd;
}
.sp-picker-container,
.sp-palette-container {
  float: left;
  position: relative;
  padding: 10px;
  padding-bottom: 300px;
  margin-bottom: -290px;
}
.sp-picker-container {
  width: 172px;
  border-left: solid 1px #fff;
}

/* Palettes */
.sp-palette-container {
  border-right: solid 1px #ccc;
}

.sp-palette-only .sp-palette-container {
  border: 0;
}

.sp-palette .sp-thumb-el {
  display: block;
  position: relative;
  float: left;
  width: 24px;
  height: 15px;
  margin: 3px;
  cursor: pointer;
  border: solid 2px transparent;
}
.sp-palette .sp-thumb-el:hover,
.sp-palette .sp-thumb-el.sp-thumb-active {
  border-color: orange;
}
.sp-thumb-el {
  position: relative;
}

/* Initial */
.sp-initial {
  float: left;
  border: solid 1px #333;
}
.sp-initial span {
  width: 30px;
  height: 25px;
  border: none;
  display: block;
  float: left;
  margin: 0;
}

.sp-initial .sp-clear-display {
  background-position: center;
}

/* Buttons */
.sp-palette-button-container,
.sp-button-container {
  float: right;
}

/* Replacer (the little preview div that shows up instead of the <input>) */
.sp-replacer {
  margin: 0;
  overflow: hidden;
  cursor: pointer;
  padding: 4px;
  display: inline-block;
  border: solid 1px #91765d;
  background: #eee;
  color: #333;
  vertical-align: middle;
}
.sp-replacer:hover,
.sp-replacer.sp-active {
  border-color: #f0c49b;
  color: #111;
}
.sp-replacer.sp-disabled {
  cursor: default;
  border-color: silver;
  color: silver;
}
.sp-dd {
  padding: 2px 0;
  height: 16px;
  line-height: 16px;
  float: left;
  font-size: 10px;
}
.sp-preview {
  position: relative;
  width: 25px;
  height: 20px;
  border: solid 1px #222;
  margin-right: 5px;
  float: left;
  z-index: 0;
}

.sp-palette {
  max-width: 220px;
}
.sp-palette .sp-thumb-el {
  width: 16px;
  height: 16px;
  margin: 2px 1px;
  border: solid 1px #d0d0d0;
}

.sp-container {
  padding-bottom: 0;
}

/* Buttons: http://hellohappy.org/css3-buttons/ */
.sp-container button {
  background-color: #eeeeee;
  background-image: -webkit-linear-gradient(top, #eeeeee, #cccccc);
  background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);
  background-image: -ms-linear-gradient(top, #eeeeee, #cccccc);
  background-image: -o-linear-gradient(top, #eeeeee, #cccccc);
  background-image: linear-gradient(to bottom, #eeeeee, #cccccc);
  border: 1px solid #ccc;
  border-bottom: 1px solid #bbb;
  border-radius: 3px;
  color: #333;
  font-size: 14px;
  line-height: 1;
  padding: 5px 4px;
  text-align: center;
  text-shadow: 0 1px 0 #eee;
  vertical-align: middle;
}
.sp-container button:hover {
  background-color: #dddddd;
  background-image: -webkit-linear-gradient(top, #dddddd, #bbbbbb);
  background-image: -moz-linear-gradient(top, #dddddd, #bbbbbb);
  background-image: -ms-linear-gradient(top, #dddddd, #bbbbbb);
  background-image: -o-linear-gradient(top, #dddddd, #bbbbbb);
  background-image: linear-gradient(to bottom, #dddddd, #bbbbbb);
  border: 1px solid #bbb;
  border-bottom: 1px solid #999;
  cursor: pointer;
  text-shadow: 0 1px 0 #ddd;
}
.sp-container button:active {
  border: 1px solid #aaa;
  border-bottom: 1px solid #888;
  -webkit-box-shadow:
    inset 0 0 5px 2px #aaaaaa,
    0 1px 0 0 #eeeeee;
  -moz-box-shadow:
    inset 0 0 5px 2px #aaaaaa,
    0 1px 0 0 #eeeeee;
  -ms-box-shadow:
    inset 0 0 5px 2px #aaaaaa,
    0 1px 0 0 #eeeeee;
  -o-box-shadow:
    inset 0 0 5px 2px #aaaaaa,
    0 1px 0 0 #eeeeee;
  box-shadow:
    inset 0 0 5px 2px #aaaaaa,
    0 1px 0 0 #eeeeee;
}
.sp-cancel {
  font-size: 11px;
  color: #d93f3f !important;
  margin: 0;
  padding: 2px;
  margin-right: 5px;
  vertical-align: middle;
  text-decoration: none;
}
.sp-cancel:hover {
  color: #d93f3f !important;
  text-decoration: underline;
}

.sp-palette span:hover,
.sp-palette span.sp-thumb-active {
  border-color: #000;
}

.sp-preview,
.sp-alpha,
.sp-thumb-el {
  position: relative;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);
}
.sp-preview-inner,
.sp-alpha-inner,
.sp-thumb-inner {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.sp-palette .sp-thumb-inner {
  background-position: 50% 50%;
  background-repeat: no-repeat;
}

.sp-palette .sp-thumb-light.sp-thumb-active .sp-thumb-inner {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAIVJREFUeNpiYBhsgJFMffxAXABlN5JruT4Q3wfi/0DsT64h8UD8HmpIPCWG/KemIfOJCUB+Aoacx6EGBZyHBqI+WsDCwuQ9mhxeg2A210Ntfo8klk9sOMijaURm7yc1UP2RNCMbKE9ODK1HM6iegYLkfx8pligC9lCD7KmRof0ZhjQACDAAceovrtpVBRkAAAAASUVORK5CYII=);
}

.sp-palette .sp-thumb-dark.sp-thumb-active .sp-thumb-inner {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAMdJREFUOE+tkgsNwzAMRMugEAahEAahEAZhEAqlEAZhEAohEAYh81X2dIm8fKpEspLGvudPOsUYpxE2BIJCroJmEW9qJ+MKaBFhEMNabSy9oIcIPwrB+afvAUFoK4H0tMaQ3XtlrggDhOVVMuT4E5MMG0FBbCEYzjYT7OxLEvIHQLY2zWwQ3D+9luyOQTfKDiFD3iUIfPk8VqrKjgAiSfGFPecrg6HN6m/iBcwiDAo7WiBeawa+Kwh7tZoSCGLMqwlSAzVDhoK+6vH4G0P5wdkAAAAASUVORK5CYII=);
}

.sp-clear-display {
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(data:image/gif;base64,R0lGODlhFAAUAPcAAAAAAJmZmZ2dnZ6enqKioqOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq/Hx8fLy8vT09PX19ff39/j4+Pn5+fr6+vv7+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAAUABQAAAihAP9FoPCvoMGDBy08+EdhQAIJCCMybCDAAYUEARBAlFiQQoMABQhKUJBxY0SPICEYHBnggEmDKAuoPMjS5cGYMxHW3IiT478JJA8M/CjTZ0GgLRekNGpwAsYABHIypcAgQMsITDtWJYBR6NSqMico9cqR6tKfY7GeBCuVwlipDNmefAtTrkSzB1RaIAoXodsABiZAEFB06gIBWC1mLVgBa0AAOw==);
}
```

--------------------------------------------------------------------------------

---[FILE: _gjs_assets.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/_gjs_assets.scss

```text
@use 'gjs_main_mixins';
@use 'gjs_vars';
@use 'gjs_category_general';

.#{gjs_vars.$app-prefix}dropzone {
  display: none;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 11;
  width: 100%;
  height: 100%;
  transition: opacity 0.25s;
  pointer-events: none;
}

.#{gjs_vars.$app-prefix}dropzone-active {
  .#{gjs_vars.$app-prefix}dropzone {
    display: block;
    opacity: 1;
  }
}

.#{gjs_vars.$am-prefix}assets {
  height: 290px;
  overflow: auto;
  clear: both;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
}

.#{gjs_vars.$am-prefix}assets-header {
  padding: 5px;
}

.#{gjs_vars.$am-prefix}add-asset {
  .#{gjs_vars.$am-prefix}add-field {
    width: 70%;
    float: left;
  }

  button {
    width: 25%;
    float: right;
  }
}

.#{gjs_vars.$am-prefix}preview-cont {
  position: relative;
  height: 70px;
  width: 30%;
  background-color: var(--gjs-main-color);
  border-radius: 2px;
  float: left;
  overflow: hidden;
}

.#{gjs_vars.$am-prefix}preview {
  position: absolute;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
  z-index: 1;
}

.#{gjs_vars.$am-prefix}preview-bg {
  @include gjs_main_mixins.opacity(0.5);

  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 0;
}

.#{gjs_vars.$am-prefix}dimensions {
  @include gjs_main_mixins.opacity(0.5);

  font-size: 10px;
}

.#{gjs_vars.$am-prefix}meta {
  width: 70%;
  float: left;
  font-size: 12px;
  padding: 5px 0 0 5px;
  box-sizing: border-box;

  > div {
    margin-bottom: 5px;
  }
}

.#{gjs_vars.$am-prefix}close {
  @extend .btn-cl;

  cursor: pointer;
  position: absolute;
  right: 5px;
  top: 0;
  display: none;
}

.#{gjs_vars.$am-prefix}asset {
  border-bottom: 1px solid gjs_main_mixins.darken-color(var(--gjs-main-dark-color), 3%);
  padding: 5px;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  width: 100%;

  &:hover .#{gjs_vars.$am-prefix}close {
    display: block;
  }
}

.#{gjs_vars.$am-prefix}highlight {
  background-color: var(--gjs-main-light-color);
}

.#{gjs_vars.$am-prefix}assets-cont {
  background-color: var(--gjs-secondary-dark-color);
  border-radius: 3px;
  box-sizing: border-box;
  padding: 10px;
  width: 45%;
  float: right;
  height: 325px;
  overflow: hidden;
}
```

--------------------------------------------------------------------------------

---[FILE: _gjs_blocks.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/_gjs_blocks.scss

```text
@use 'gjs_main_mixins';
@use 'gjs_vars';
@use 'gjs_category_general';

.#{gjs_vars.$app-prefix}blocks-c {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.#{gjs_vars.$app-prefix}block-categories {
  display: flex;
  flex-direction: column;
}

.#{gjs_vars.$app-prefix}block-category {
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

.#{gjs_vars.$app-prefix}block {
  @include gjs_main_mixins.user-select(none);

  width: 45%;
  min-width: 45px;
  padding: 1em;
  box-sizing: border-box;
  min-height: 90px;
  cursor: all-scroll;
  font-size: 11px;
  font-weight: lighter;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  margin: 10px 2.5% 5px;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease 0s;
  transition-property: box-shadow, color;

  &:hover {
    box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.15);
  }

  svg {
    fill: currentColor;
  }

  &__media {
    margin-bottom: 10px;
    pointer-events: none;
  }
}

.#{gjs_vars.$app-prefix}block-svg {
  width: 54px;
  fill: currentColor;
}

.#{gjs_vars.$app-prefix}block-svg-path {
  fill: currentColor;
}

.#{gjs_vars.$app-prefix}block.fa {
  font-size: 2em;
  line-height: 2em;
  padding: 11px;
}

.#{gjs_vars.$app-prefix}block-label {
  line-height: normal;
  font-size: 0.65rem;
  font-weight: normal;
  font-family: Helvetica, sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
}

.#{gjs_vars.$app-prefix}block.#{gjs_vars.$app-prefix}bdrag {
  width: auto;
  padding: 0;
}
```

--------------------------------------------------------------------------------

---[FILE: _gjs_canvas.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/_gjs_canvas.scss

```text
@use 'gjs_main_mixins';
@use 'gjs_vars';
@use 'gjs_category_general';

$frameAnimation: 0.35s ease !default;
$guide_pad: 5px !default;

.#{gjs_vars.$prefix} {
  &guide-info {
    position: absolute;

    &__content {
      position: absolute;
      height: 100%;
      display: flex;
      width: 100%;
      padding: 5px;
    }

    &__line {
      position: relative;
      margin: auto;

      &::before,
      &::after {
        content: '';
        display: block;
        position: absolute;
        background-color: inherit;
      }
    }

    &__y {
      padding: 0 $guide_pad;

      .#{gjs_vars.$prefix}guide-info {
        &__content {
          justify-content: center;
        }

        &__line {
          width: 100%;
          height: 1px;

          &::before,
          &::after {
            width: 1px;
            height: 10px;
            top: 0;
            bottom: 0;
            left: 0;
            margin: auto;
          }

          &::after {
            left: auto;
            right: 0;
          }
        }
      }
    }

    &__x {
      padding: $guide_pad 0;

      .#{gjs_vars.$prefix}guide-info {
        &__content {
          align-items: center;
        }

        &__line {
          height: 100%;
          width: 1px;

          &::before,
          &::after {
            width: 10px;
            height: 1px;
            left: 0;
            right: 0;
            top: 0;
            margin: auto;
            transform: translateX(-50%);
          }

          &::after {
            top: auto;
            bottom: 0;
          }
        }
      }
    }
  }

  &badge {
    white-space: nowrap;

    &__icon {
      vertical-align: middle;
      display: inline-block;
      width: 15px;
      height: 15px;

      svg {
        fill: currentColor;
      }
    }
    &__name {
      display: inline-block;
      vertical-align: middle;
    }
  }

  &frame-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    margin: auto;

    &--anim {
      transition:
        width $frameAnimation,
        height $frameAnimation;
    }

    &__top {
      transform: translateY(-100%) translateX(-50%);
      display: flex;
      padding: 5px 0;
      position: absolute;
      width: 100%;
      left: 50%;
      top: 0;

      &-r {
        margin-left: auto;
      }
    }

    &__left {
      position: absolute;
      left: 0;
      transform: translateX(-100%) translateY(-50%);
      height: 100%;
      top: 50%;
    }

    &__bottom {
      position: absolute;
      bottom: 0;
      transform: translateY(100%) translateX(-50%);
      width: 100%;
      left: 50%;
    }

    &__right {
      position: absolute;
      right: 0;
      transform: translateX(100%) translateY(-50%);
      height: 100%;
      top: 50%;
    }

    &__icon {
      width: 24px;
      cursor: pointer;

      > svg {
        fill: currentColor;
      }
    }
  }
}

.#{gjs_vars.$app-prefix} {
  &padding-v,
  &fixedpadding-v {
    &-top {
      width: 100%;
      top: 0;
      left: 0;
    }
    &-right {
      right: 0;
    }
    &-bottom {
      width: 100%;
      left: 0;
      bottom: 0;
    }
    &-left {
      left: 0;
    }
  }
}

.#{gjs_vars.$cv-prefix}canvas {
  box-sizing: border-box;
  width: calc(100% - var(--gjs-left-width));
  height: calc(100% - var(--gjs-canvas-top));
  bottom: 0;
  overflow: hidden;
  z-index: 1;
  position: absolute;
  left: 0;
  top: var(--gjs-canvas-top);

  &-bg {
    background-color: rgba(0, 0, 0, 0.15);
  }

  &.#{gjs_vars.$cui-cls} {
    width: 100%;
    height: 100%;
    top: 0;
  }

  &#{gjs_main_mixins.gjs-is(grab)},
  &#{gjs_main_mixins.gjs-is(grabbing)} {
    .#{gjs_vars.$cv-prefix}canvas__frames {
      pointer-events: none; // Need this in multi-frame mode
    }
  }

  &__frames {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__spots {
    position: absolute;
    pointer-events: none;
    z-index: 1;
  }

  .#{gjs_vars.$app-prefix}ghost {
    display: none;
    pointer-events: none;
    background-color: #5b5b5b;
    border: 2px dashed #ccc;
    position: absolute;
    z-index: 10;

    @include gjs_main_mixins.opacity(0.55);
  }

  .#{gjs_vars.$app-prefix}highlighter,
  .#{gjs_vars.$app-prefix}highlighter-sel {
    position: absolute;
    outline: 1px solid var(--gjs-color-blue);
    outline-offset: -1px;
    pointer-events: none;
    width: 100%;
    height: 100%;
  }

  .#{gjs_vars.$app-prefix}highlighter-warning {
    outline: 3px solid var(--gjs-color-yellow);
  }

  .#{gjs_vars.$app-prefix}highlighter-sel {
    outline: 2px solid var(--gjs-color-blue);
    outline-offset: -2px;
  }

  ##{gjs_vars.$app-prefix}tools,
  .#{gjs_vars.$app-prefix}tools {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    outline: none;
    z-index: 1;
  }
  /* Always place the tools above the highlighter */
  ##{gjs_vars.$app-prefix}tools {
    z-index: 2;
  }

  /* This simulate body behaviour */
  // > div:first-child {
  //   background-color: #fff;
  //   position: relative;
  //   height: 100%;
  //   overflow: auto;
  //   width: 100%;
  // }
}

.#{gjs_vars.$cv-prefix}canvas * {
  box-sizing: border-box;
}

.#{gjs_vars.$app-prefix}frame {
  outline: medium none;
  height: 100%;
  width: 100%;
  border: none;
  margin: auto;
  display: block;
  transition:
    width $frameAnimation,
    height $frameAnimation;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.#{gjs_vars.$app-prefix}toolbar {
  position: absolute;
  background-color: var(--gjs-color-blue);
  white-space: nowrap;
  color: white;
  z-index: 10;
  top: 0;
  left: 0;
}

.#{gjs_vars.$app-prefix}toolbar-item {
  width: 26px;
  padding: 5px;
  cursor: pointer;
  display: inline-block;

  svg {
    fill: currentColor;
    vertical-align: middle;
  }
}

.#{gjs_vars.$app-prefix}resizer-c {
  @extend .#{gjs_vars.$app-prefix}no-pointer-events;

  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
}

.#{gjs_vars.$app-prefix}margin-v-el,
.#{gjs_vars.$app-prefix}padding-v-el,
.#{gjs_vars.$app-prefix}fixedmargin-v-el,
.#{gjs_vars.$app-prefix}fixedpadding-v-el {
  @extend .#{gjs_vars.$app-prefix}no-pointer-events;

  @include gjs_main_mixins.opacity(0.1);

  position: absolute;
  background-color: yellow;
}

.#{gjs_vars.$app-prefix}fixedmargin-v-el,
.#{gjs_vars.$app-prefix}fixedpadding-v-el {
  @include gjs_main_mixins.opacity(0.2);
}

.#{gjs_vars.$app-prefix}padding-v-el,
.#{gjs_vars.$app-prefix}fixedpadding-v-el {
  background-color: navy;
}

.#{gjs_vars.$app-prefix}resizer-h {
  pointer-events: all;
  position: absolute;
  border: 3px solid var(--gjs-color-blue);
  width: 10px;
  height: 10px;
  background-color: #fff;
  margin: var(--gjs-handle-margin);
}

.#{gjs_vars.$app-prefix}resizer-h-tl {
  top: 0;
  left: 0;
  cursor: nwse-resize;
}

.#{gjs_vars.$app-prefix}resizer-h-tr {
  top: 0;
  right: 0;
  cursor: nesw-resize;
}

.#{gjs_vars.$app-prefix}resizer-h-tc {
  top: 0;
  margin: var(--gjs-handle-margin) auto;
  left: 0;
  right: 0;
  cursor: ns-resize;
}

.#{gjs_vars.$app-prefix}resizer-h-cl {
  left: 0;
  margin: auto var(--gjs-handle-margin);
  top: 0;
  bottom: 0;
  cursor: ew-resize;
}

.#{gjs_vars.$app-prefix}resizer-h-cr {
  margin: auto var(--gjs-handle-margin);
  top: 0;
  bottom: 0;
  right: 0;
  cursor: ew-resize;
}

.#{gjs_vars.$app-prefix}resizer-h-bl {
  bottom: 0;
  left: 0;
  cursor: nesw-resize;
}

.#{gjs_vars.$app-prefix}resizer-h-bc {
  bottom: 0;
  margin: var(--gjs-handle-margin) auto;
  left: 0;
  right: 0;
  cursor: ns-resize;
}

.#{gjs_vars.$app-prefix}resizer-h-br {
  bottom: 0;
  right: 0;
  cursor: nwse-resize;
}

.#{gjs_vars.$pn-prefix}panel {
  .#{gjs_vars.$app-prefix}resizer-h {
    background-color: rgba(0, 0, 0, 0.2);
    border: none;
    opacity: 0;
    transition: opacity 0.25s;

    &:hover {
      opacity: 1;
    }
  }

  .#{gjs_vars.$app-prefix}resizer-h-tc,
  .#{gjs_vars.$app-prefix}resizer-h-bc {
    margin: 0 auto;
    width: 100%;
  }

  .#{gjs_vars.$app-prefix}resizer-h-cr,
  .#{gjs_vars.$app-prefix}resizer-h-cl {
    margin: auto 0;
    height: 100%;
  }
}

.#{gjs_vars.$app-prefix}resizing .#{gjs_vars.$app-prefix}highlighter,
.#{gjs_vars.$app-prefix}resizing .#{gjs_vars.$app-prefix}badge {
  display: none !important;
}

.#{gjs_vars.$app-prefix}resizing-tl * {
  cursor: nwse-resize !important;
}

.#{gjs_vars.$app-prefix}resizing-tr * {
  cursor: nesw-resize !important;
}

.#{gjs_vars.$app-prefix}resizing-tc * {
  cursor: ns-resize !important;
}

.#{gjs_vars.$app-prefix}resizing-cl * {
  cursor: ew-resize !important;
}

.#{gjs_vars.$app-prefix}resizing-cr * {
  cursor: ew-resize !important;
}

.#{gjs_vars.$app-prefix}resizing-bl * {
  cursor: nesw-resize !important;
}

.#{gjs_vars.$app-prefix}resizing-bc * {
  cursor: ns-resize !important;
}

.#{gjs_vars.$app-prefix}resizing-br * {
  cursor: nwse-resize !important;
}

// .btn-cl {
//   @include gjs_main_mixins.opacity(0.3);

//   font-size: 25px;
//   cursor: pointer;

//   &:hover {
//     @include gjs_main_mixins.opacity(0.7);
//   }
// }
```

--------------------------------------------------------------------------------

---[FILE: _gjs_category_general.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/_gjs_category_general.scss

```text
@use 'gjs_vars';
@use 'gjs_main_mixins';

.#{gjs_vars.$app-prefix}bg {
  &-main {
    background-color: var(--gjs-main-color);
  }
}

.#{gjs_vars.$app-prefix}color {
  &-main {
    color: var(--gjs-font-color);
    fill: var(--gjs-font-color);
  }

  &-active {
    color: var(--gjs-font-color-active);
    fill: var(--gjs-font-color-active);
  }

  &-warn {
    color: var(--gjs-color-warn);
    fill: var(--gjs-color-warn);
  }

  &-hl {
    color: var(--gjs-color-highlight);
    fill: var(--gjs-color-highlight);
  }
}

.#{gjs_vars.$app-prefix}invis-invis,
.#{gjs_vars.$app-prefix}no-app {
  background-color: transparent;
  border: none;
  color: inherit;
}

.#{gjs_vars.$app-prefix}no-app {
  height: 10px;
}

.opac50 {
  @include gjs_main_mixins.opacity(0.5);
}

.#{gjs_vars.$app-prefix}checker-bg,
.checker-bg {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==');
}

.#{gjs_vars.$app-prefix}no-user-select {
  @include gjs_main_mixins.user-select(none);
}

.#{gjs_vars.$app-prefix}no-pointer-events {
  pointer-events: none;
}

.no-select {
  @include gjs_main_mixins.user-select(none);
}

.clear {
  clear: both;
}

.#{gjs_vars.$app-prefix}category-open {
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}

.#{gjs_vars.$app-prefix}category-title {
  @extend .no-select;

  font-weight: lighter;
  background-color: var(--gjs-secondary-dark-color);
  letter-spacing: 1px;
  padding: 9px 10px 9px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  text-align: left;
  position: relative;
  cursor: pointer;
}

.btn-cl {
  @include gjs_main_mixins.opacity(0.3);

  font-size: 25px;
  cursor: pointer;

  &:hover {
    @include gjs_main_mixins.opacity(0.7);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: _gjs_code_manager.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/_gjs_code_manager.scss

```text
@use 'gjs_vars';

.#{gjs_vars.$cm-prefix}editor-c {
  float: left;
  box-sizing: border-box;
  width: 50%;

  .CodeMirror {
    height: 450px;
  }
}
.#{gjs_vars.$cm-prefix}editor {
  font-size: 12px;

  &##{gjs_vars.$cm-prefix}htmlmixed {
    padding-right: 10px;
    border-right: 1px solid var(--gjs-main-dark-color);
    ##{gjs_vars.$cm-prefix}title {
      color: #a97d44;
    }
  }
  &##{gjs_vars.$cm-prefix}css {
    padding-left: 10px;
    ##{gjs_vars.$cm-prefix}title {
      color: #ddca7e;
    }
  }
  ##{gjs_vars.$cm-prefix}title {
    background-color: var(--gjs-main-dark-color);
    font-size: 12px;
    padding: 5px 10px 3px;
    text-align: right;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: _gjs_commands.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/_gjs_commands.scss

```text
@use 'gjs_vars';
@use 'gjs_category_general';

.no-dots,
.ui-resizable-handle {
  border: none !important;
  margin: 0 !important;
  outline: none !important;
}

.#{gjs_vars.$com-prefix}dashed * {
  outline: 1px dashed #888;
  outline-offset: -2px;
  box-sizing: border-box;
}

.#{gjs_vars.$com-prefix}no-select,
.#{gjs_vars.$com-prefix}no-select img {
  @extend .no-select;
}

.#{gjs_vars.$com-prefix}badge,
.#{gjs_vars.$app-prefix}badge {
  pointer-events: none;
  background-color: var(--gjs-color-blue);
  color: #fff;
  padding: 2px 5px;
  position: absolute;
  z-index: 1;
  font-size: 12px;
  outline: none;
  display: none;
}
.#{gjs_vars.$app-prefix}badge-warning {
  background-color: var(--gjs-color-yellow);
}
.#{gjs_vars.$app-prefix}placeholder,
.#{gjs_vars.$com-prefix}placeholder,
.#{gjs_vars.$nv-prefix}placeholder {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  display: none;
}

.#{gjs_vars.$app-prefix}placeholder,
.#{gjs_vars.$nv-prefix}placeholder {
  border-style: solid !important;
  outline: none;
  box-sizing: border-box;
  transition:
    top var(--gjs-animation-duration),
    left var(--gjs-animation-duration),
    width var(--gjs-animation-duration),
    height var(--gjs-animation-duration);
}

.#{gjs_vars.$app-prefix}placeholder.horizontal,
.#{gjs_vars.$com-prefix}placeholder.horizontal,
.#{gjs_vars.$nv-prefix}placeholder.horizontal {
  border-color: transparent var(--gjs-placeholder-background-color);
  border-width: 3px 5px;
  margin: -3px 0 0;
}

.#{gjs_vars.$app-prefix}placeholder.vertical,
.#{gjs_vars.$com-prefix}placeholder.vertical,
.#{gjs_vars.$nv-prefix}placeholder.vertical {
  border-color: var(--gjs-placeholder-background-color) transparent;
  border-width: 5px 3px;
  margin: 0 0 0 -3px;
}

.#{gjs_vars.$app-prefix}placeholder-int,
.#{gjs_vars.$com-prefix}placeholder-int,
.#{gjs_vars.$nv-prefix}placeholder-int {
  background-color: var(--gjs-placeholder-background-color);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  height: 100%;
  width: 100%;
  pointer-events: none;
  padding: 1.5px;
  outline: none;
}
```

--------------------------------------------------------------------------------

---[FILE: _gjs_devices.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/_gjs_devices.scss

```text
@use 'gjs_vars';

.#{gjs_vars.$app-prefix}devices-c {
  display: flex;
  align-items: center;
  padding: 2px 3px 3px 3px;

  .#{gjs_vars.$app-prefix}device-label {
    flex-grow: 2;
    text-align: left;
    margin-right: 10px;
  }

  .#{gjs_vars.$app-prefix}select {
    flex-grow: 20;
  }

  .#{gjs_vars.$app-prefix}add-trasp {
    flex-grow: 1;
    margin-left: 5px;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: _gjs_file_uploader.scss]---
Location: grapesjs-dev/packages/core/src/styles/scss/_gjs_file_uploader.scss

```text
@use 'gjs_main_mixins';
@use 'gjs_vars';

.#{gjs_vars.$am-prefix}file-uploader {
  width: 55%;
  float: left;

  > form {
    background-color: var(--gjs-secondary-dark-color);
    border: 2px dashed;
    border-radius: 3px;
    position: relative;
    text-align: center;
    margin-bottom: 15px;

    &.#{gjs_vars.$am-prefix}hover {
      border: 2px solid var(--gjs-color-green);
      color: gjs_main_mixins.lighten-color(var(--gjs-color-green), 5%);
    }

    &.#{gjs_vars.$am-prefix}disabled {
      border-color: red;
    }

    ##{gjs_vars.$am-prefix}uploadFile {
      @include gjs_main_mixins.opacity(0);
      padding: var(--gjs-upload-padding);
      width: 100%;
      box-sizing: border-box;
    }
  }

  ##{gjs_vars.$am-prefix}title {
    position: absolute;
    padding: var(--gjs-upload-padding);
    width: 100%;
  }
}
```

--------------------------------------------------------------------------------

````
