---
source_txt: fullstack_samples/obs-studio-master
converted_utc: 2025-12-18T10:36:59Z
part: 4
parts_total: 8
---

# FULLSTACK CODE DATABASE SAMPLES obs-studio-master

## Extracted Reusable Patterns (Non-verbatim) (Part 4 of 8)

````text
================================================================================
FULLSTACK SAMPLES PATTERN DATABASE - obs-studio-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/obs-studio-master
================================================================================

NOTES:
- This file intentionally avoids copying large verbatim third-party code.
- It captures reusable patterns, surfaces, and file references.
- Use the referenced file paths to view full implementations locally.

================================================================================

---[FILE: obs-output.c]---
Location: obs-studio-master/libobs/obs-output.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_output *output;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_output
- caption_track_data
- obs_core_video
- obs_encoder
- encoder_packet_time
- encoder_packet
- caption_text
- packet_callback
```

--------------------------------------------------------------------------------

---[FILE: obs-output.h]---
Location: obs-studio-master/libobs/obs-output.h
Signals: N/A
Excerpt (<=80 chars):  struct encoder_packet;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- encoder_packet
- obs_output_info
```

--------------------------------------------------------------------------------

---[FILE: obs-properties.c]---
Location: obs-studio-master/libobs/obs-properties.c
Signals: N/A
Excerpt (<=80 chars):  struct float_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- float_data
- int_data
- list_item
- path_data
- text_data
- list_data
- editable_list_data
- button_data
- frame_rate_option
- frame_rate_range
- media_frames_per_second
- frame_rate_data
- group_data
- obs_properties
- obs_property
```

--------------------------------------------------------------------------------

---[FILE: obs-properties.h]---
Location: obs-studio-master/libobs/obs-properties.h
Signals: N/A
Excerpt (<=80 chars):  struct obs_properties;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_properties
- obs_property
- media_frames_per_second
```

--------------------------------------------------------------------------------

---[FILE: obs-scene.c]---
Location: obs-studio-master/libobs/obs-scene.c
Signals: N/A
Excerpt (<=80 chars):  struct calldata params;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- calldata
- obs_scene
- obs_scene_item
- vec2
- matrix4
- vec4
```

--------------------------------------------------------------------------------

---[FILE: obs-scene.h]---
Location: obs-studio-master/libobs/obs-scene.h
Signals: N/A
Excerpt (<=80 chars):  struct item_action {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- item_action
- obs_scene_item
- obs_scene
- obs_source
- obs_sceneitem_crop
- vec2
- matrix4
```

--------------------------------------------------------------------------------

---[FILE: obs-service.c]---
Location: obs-studio-master/libobs/obs-service.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_service *service;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_service
```

--------------------------------------------------------------------------------

---[FILE: obs-service.h]---
Location: obs-studio-master/libobs/obs-service.h
Signals: N/A
Excerpt (<=80 chars):  struct obs_service_resolution {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_service_resolution
- obs_service_info
```

--------------------------------------------------------------------------------

---[FILE: obs-source-deinterlace.c]---
Location: obs-studio-master/libobs/obs-source-deinterlace.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_source_frame *next_frame = source->async_frames.array[0];

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_source_frame
- vec2
```

--------------------------------------------------------------------------------

---[FILE: obs-source-transition.c]---
Location: obs-studio-master/libobs/obs-source-transition.c
Signals: N/A
Excerpt (<=80 chars):  struct matrix4 mat;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- matrix4
- vec2
- transition_state
- vec4
- obs_source_audio_mix
- audio_output_data
```

--------------------------------------------------------------------------------

---[FILE: obs-source.c]---
Location: obs-studio-master/libobs/obs-source.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_source_info *get_source_info(const char *id)

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_source_info
- obs_source
- audio_action
- obs_core_audio
- calldata
- dstr
- video_frame
- obs_source_frame
- media_action
- audio_cb_info
```

--------------------------------------------------------------------------------

---[FILE: obs-source.h]---
Location: obs-studio-master/libobs/obs-source.h
Signals: N/A
Excerpt (<=80 chars):  struct obs_source_audio_mix {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_source_audio_mix
- audio_output_data
- obs_source_info
- obs_source_frame
- obs_audio_data
```

--------------------------------------------------------------------------------

---[FILE: obs-video-gpu-encode.c]---
Location: obs-studio-master/libobs/obs-video-gpu-encode.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_core_video_mix *video = data;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_core_video_mix
- obs_tex_frame
- encoder_packet
- obs_encoder_group
- encoder_texture
- encoder_packet_time
```

--------------------------------------------------------------------------------

---[FILE: obs-video.c]---
Location: obs-studio-master/libobs/obs-video.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_core_data *data = &obs->data;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_core_data
- obs_source
- tick_callback
- obs_display
- vec4
- draw_callback
- rendered_callback
- obs_core_video
- obs_video_info
- vec2
- obs_tex_frame
- obs_vframe_info
- video_frame
```

--------------------------------------------------------------------------------

---[FILE: obs-view.c]---
Location: obs-studio-master/libobs/obs-view.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_view *view = bzalloc(sizeof(struct obs_view));

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_view
- obs_source
- obs_core_video_mix
```

--------------------------------------------------------------------------------

---[FILE: obs-win-crash-handler.c]---
Location: obs-studio-master/libobs/obs-win-crash-handler.c
Signals: N/A
Excerpt (<=80 chars):  struct stack_trace {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- stack_trace
- exception_handler_data
- win_version_info
- dstr
- tm
- module_info
```

--------------------------------------------------------------------------------

---[FILE: obs-windows.c]---
Location: obs-studio-master/libobs/obs-windows.c
Signals: N/A
Excerpt (<=80 chars):  struct dstr path;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dstr
- win_version_info
- reg_dword
- obs_hotkeys_platform
- obs_module
```

--------------------------------------------------------------------------------

---[FILE: obs.c]---
Location: obs-studio-master/libobs/obs.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_core *obs = NULL;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_core
- obs_core_video
- gs_sampler_info
- matrix4
- vec4
- video_output_info
- obs_video_info
- obs_core_video_mix
- obs_context_data
- obs_core_audio
- obs_task_info
```

--------------------------------------------------------------------------------

---[FILE: obs.h]---
Location: obs-studio-master/libobs/obs.h
Signals: N/A
Excerpt (<=80 chars):  struct matrix4;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- matrix4
- obs_context_data
- obs_display
- obs_view
- obs_source
- obs_scene
- obs_scene_item
- obs_output
- obs_encoder
- obs_encoder_group
- obs_service
- obs_module
- obs_module_metadata
- obs_fader
- obs_volmeter
- obs_canvas
- obs_transform_info
- vec2
```

--------------------------------------------------------------------------------

---[FILE: obs.hpp]---
Location: obs-studio-master/libobs/obs.hpp
Signals: N/A
Excerpt (<=80 chars):  struct TakeOwnership {};

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TakeOwnership
- OBSSignal
```

--------------------------------------------------------------------------------

---[FILE: null-audio-monitoring.c]---
Location: obs-studio-master/libobs/audio-monitoring/null/null-audio-monitoring.c
Signals: N/A
Excerpt (<=80 chars):  struct audio_monitor *audio_monitor_create(obs_source_t *source)

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- audio_monitor
```

--------------------------------------------------------------------------------

---[FILE: coreaudio-enum-devices.c]---
Location: obs-studio-master/libobs/audio-monitoring/osx/coreaudio-enum-devices.c
Signals: N/A
Excerpt (<=80 chars):  struct device_name_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- device_name_info
```

--------------------------------------------------------------------------------

---[FILE: coreaudio-output.c]---
Location: obs-studio-master/libobs/audio-monitoring/osx/coreaudio-output.c
Signals: N/A
Excerpt (<=80 chars):  struct audio_monitor {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- audio_monitor
- deque
- resample_info
```

--------------------------------------------------------------------------------

---[FILE: pulseaudio-enum-devices.c]---
Location: obs-studio-master/libobs/audio-monitoring/pulse/pulseaudio-enum-devices.c
Signals: N/A
Excerpt (<=80 chars):  struct enum_cb *ecb = (struct enum_cb *)userdata;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- enum_cb
```

--------------------------------------------------------------------------------

---[FILE: pulseaudio-output.c]---
Location: obs-studio-master/libobs/audio-monitoring/pulse/pulseaudio-output.c
Signals: N/A
Excerpt (<=80 chars):  struct audio_monitor {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- audio_monitor
- deque
- resample_info
```

--------------------------------------------------------------------------------

---[FILE: pulseaudio-wrapper.c]---
Location: obs-studio-master/libobs/audio-monitoring/pulse/pulseaudio-wrapper.c
Signals: N/A
Excerpt (<=80 chars):  struct pulseaudio_default_output *d = (struct pulseaudio_default_output *)us...

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pulseaudio_default_output
```

--------------------------------------------------------------------------------

---[FILE: pulseaudio-wrapper.h]---
Location: obs-studio-master/libobs/audio-monitoring/pulse/pulseaudio-wrapper.h
Signals: N/A
Excerpt (<=80 chars):  struct pulseaudio_default_output {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pulseaudio_default_output
- enum_cb
```

--------------------------------------------------------------------------------

---[FILE: wasapi-output.c]---
Location: obs-studio-master/libobs/audio-monitoring/win32/wasapi-output.c
Signals: N/A
Excerpt (<=80 chars):  struct audio_monitor {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- audio_monitor
- deque
- resample_info
```

--------------------------------------------------------------------------------

---[FILE: calldata.h]---
Location: obs-studio-master/libobs/callback/calldata.h
Signals: N/A
Excerpt (<=80 chars):  struct calldata {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- calldata
```

--------------------------------------------------------------------------------

---[FILE: decl.c]---
Location: obs-studio-master/libobs/callback/decl.c
Signals: N/A
Excerpt (<=80 chars):  struct strref ref;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- strref
- decl_param
- cf_token
- cf_parser
```

--------------------------------------------------------------------------------

---[FILE: decl.h]---
Location: obs-studio-master/libobs/callback/decl.h
Signals: N/A
Excerpt (<=80 chars):  struct decl_param {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- decl_param
- decl_info
```

--------------------------------------------------------------------------------

---[FILE: proc.c]---
Location: obs-studio-master/libobs/callback/proc.c
Signals: N/A
Excerpt (<=80 chars):  struct proc_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- proc_info
- decl_info
- proc_handler
```

--------------------------------------------------------------------------------

---[FILE: proc.h]---
Location: obs-studio-master/libobs/callback/proc.h
Signals: N/A
Excerpt (<=80 chars):  struct proc_handler;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- proc_handler
```

--------------------------------------------------------------------------------

---[FILE: signal.c]---
Location: obs-studio-master/libobs/callback/signal.c
Signals: N/A
Excerpt (<=80 chars):  struct signal_callback {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- signal_callback
- signal_info
- decl_info
- global_callback_info
- signal_handler
```

--------------------------------------------------------------------------------

---[FILE: signal.h]---
Location: obs-studio-master/libobs/callback/signal.h
Signals: N/A
Excerpt (<=80 chars):  struct signal_handler;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- signal_handler
```

--------------------------------------------------------------------------------

---[FILE: axisang.h]---
Location: obs-studio-master/libobs/graphics/axisang.h
Signals: N/A
Excerpt (<=80 chars):  struct quat;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- quat
- axisang
```

--------------------------------------------------------------------------------

---[FILE: bounds.c]---
Location: obs-studio-master/libobs/graphics/bounds.c
Signals: N/A
Excerpt (<=80 chars):  struct bounds temp;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bounds
- vec3
- matrix4
- matrix3
```

--------------------------------------------------------------------------------

---[FILE: bounds.h]---
Location: obs-studio-master/libobs/graphics/bounds.h
Signals: N/A
Excerpt (<=80 chars):  struct bounds {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bounds
- vec3
```

--------------------------------------------------------------------------------

---[FILE: effect-parser.c]---
Location: obs-studio-master/libobs/graphics/effect-parser.c
Signals: N/A
Excerpt (<=80 chars):  struct ep_struct eps;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ep_struct
- ep_var
- ep_param
- cf_token
- ep_technique
- ep_pass
- dstr
- ep_sampler
- ep_func
```

--------------------------------------------------------------------------------

---[FILE: effect-parser.h]---
Location: obs-studio-master/libobs/graphics/effect-parser.h
Signals: N/A
Excerpt (<=80 chars):  struct dstr;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dstr
- ep_var
- ep_param
- gs_effect_param
- ep_struct
- ep_sampler
- ep_pass
- gs_effect_pass
- ep_technique
- ep_func
- effect_parser
- cf_parser
```

--------------------------------------------------------------------------------

---[FILE: effect.c]---
Location: obs-studio-master/libobs/graphics/effect.c
Signals: N/A
Excerpt (<=80 chars):  struct gs_effect_technique *tech = effect->techniques.array + i;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_effect_technique
- gs_effect
- gs_effect_param
- pass_shaderparam
- gs_effect_pass
- gs_shader_param_info
```

--------------------------------------------------------------------------------

---[FILE: effect.h]---
Location: obs-studio-master/libobs/graphics/effect.h
Signals: N/A
Excerpt (<=80 chars):  struct gs_effect_param {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_effect_param
- pass_shaderparam
- gs_effect_pass
- gs_effect_technique
- gs_effect
```

--------------------------------------------------------------------------------

---[FILE: graphics-ffmpeg.c]---
Location: obs-studio-master/libobs/graphics/graphics-ffmpeg.c
Signals: N/A
Excerpt (<=80 chars):  struct ffmpeg_image {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ffmpeg_image
- SwsContext
- half
```

--------------------------------------------------------------------------------

---[FILE: graphics-internal.h]---
Location: obs-studio-master/libobs/graphics/graphics-internal.h
Signals: N/A
Excerpt (<=80 chars):  struct gs_exports {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_exports
- gs_vb_data
- gs_monitor_info
- gs_texture
- blend_state
- graphics_subsystem
- matrix4
- gs_effect
```

--------------------------------------------------------------------------------

---[FILE: graphics.c]---
Location: obs-studio-master/libobs/graphics/graphics.c
Signals: N/A
Excerpt (<=80 chars):  struct gs_vb_data *vbd;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_vb_data
- vec2
- matrix4
- gs_effect
- axisang
```

--------------------------------------------------------------------------------

---[FILE: graphics.h]---
Location: obs-studio-master/libobs/graphics/graphics.h
Signals: N/A
Excerpt (<=80 chars):  struct vec2;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- vec2
- vec3
- vec4
- quat
- axisang
- plane
- matrix3
- matrix4
- gs_device_loss
- gs_monitor_info
- gs_tvertarray
- gs_vb_data
- gs_sampler_info
- gs_display_mode
```

--------------------------------------------------------------------------------

---[FILE: half.h]---
Location: obs-studio-master/libobs/graphics/half.h
Signals: N/A
Excerpt (<=80 chars):  struct half {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- half
```

--------------------------------------------------------------------------------

---[FILE: image-file.h]---
Location: obs-studio-master/libobs/graphics/image-file.h
Signals: N/A
Excerpt (<=80 chars):  struct gs_image_file {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_image_file
- gs_image_file2
- gs_image_file3
- gs_image_file4
```

--------------------------------------------------------------------------------

---[FILE: input.h]---
Location: obs-studio-master/libobs/graphics/input.h
Signals: N/A
Excerpt (<=80 chars): struct input_subsystem;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- input_subsystem
```

--------------------------------------------------------------------------------

---[FILE: math-extra.c]---
Location: obs-studio-master/libobs/graphics/math-extra.c
Signals: N/A
Excerpt (<=80 chars):  struct vec3 cart;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- vec3
```

--------------------------------------------------------------------------------

---[FILE: math-extra.h]---
Location: obs-studio-master/libobs/graphics/math-extra.h
Signals: N/A
Excerpt (<=80 chars):  struct vec2;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- vec2
- vec3
```

--------------------------------------------------------------------------------

---[FILE: matrix3.c]---
Location: obs-studio-master/libobs/graphics/matrix3.c
Signals: N/A
Excerpt (<=80 chars):  struct quat q;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- quat
- matrix3
- matrix4
```

--------------------------------------------------------------------------------

---[FILE: matrix3.h]---
Location: obs-studio-master/libobs/graphics/matrix3.h
Signals: N/A
Excerpt (<=80 chars):  struct matrix4;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- matrix4
- matrix3
- vec3
- axisang
```

--------------------------------------------------------------------------------

---[FILE: matrix4.c]---
Location: obs-studio-master/libobs/graphics/matrix4.c
Signals: N/A
Excerpt (<=80 chars):  struct quat q;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- quat
- matrix4
- vec4
```

--------------------------------------------------------------------------------

---[FILE: matrix4.h]---
Location: obs-studio-master/libobs/graphics/matrix4.h
Signals: N/A
Excerpt (<=80 chars):  struct matrix3;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- matrix3
- matrix4
- vec4
- vec3
- axisang
```

--------------------------------------------------------------------------------

---[FILE: plane.c]---
Location: obs-studio-master/libobs/graphics/plane.c
Signals: N/A
Excerpt (<=80 chars):  struct vec3 temp;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- vec3
```

--------------------------------------------------------------------------------

---[FILE: plane.h]---
Location: obs-studio-master/libobs/graphics/plane.h
Signals: N/A
Excerpt (<=80 chars):  struct matrix3;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- matrix3
- matrix4
- plane
- vec3
```

--------------------------------------------------------------------------------

---[FILE: quat.c]---
Location: obs-studio-master/libobs/graphics/quat.c
Signals: N/A
Excerpt (<=80 chars):  struct vec3 q1axis, q2axis;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- vec3
- f4x4
- matrix3
- quat
- axisang
```

--------------------------------------------------------------------------------

---[FILE: quat.h]---
Location: obs-studio-master/libobs/graphics/quat.h
Signals: N/A
Excerpt (<=80 chars):  struct matrix3;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- matrix3
- matrix4
- axisang
- quat
- vec3
```

--------------------------------------------------------------------------------

---[FILE: shader-parser.c]---
Location: obs-studio-master/libobs/graphics/shader-parser.c
Signals: N/A
Excerpt (<=80 chars):  struct shader_sampler ss;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- shader_sampler
- cf_token
- shader_struct
- shader_var
- shader_func
```

--------------------------------------------------------------------------------

---[FILE: shader-parser.h]---
Location: obs-studio-master/libobs/graphics/shader-parser.h
Signals: N/A
Excerpt (<=80 chars):  struct shader_var {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- shader_var
- shader_sampler
- shader_struct
- shader_func
- cf_token
- shader_parser
- cf_parser
```

--------------------------------------------------------------------------------

---[FILE: texture-render.c]---
Location: obs-studio-master/libobs/graphics/texture-render.c
Signals: N/A
Excerpt (<=80 chars):  struct gs_texture_render {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_texture_render
```

--------------------------------------------------------------------------------

---[FILE: vec2.h]---
Location: obs-studio-master/libobs/graphics/vec2.h
Signals: N/A
Excerpt (<=80 chars):  struct vec2 {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- vec2
```

--------------------------------------------------------------------------------

---[FILE: vec3.c]---
Location: obs-studio-master/libobs/graphics/vec3.c
Signals: N/A
Excerpt (<=80 chars):  struct vec3 temp;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- vec3
- vec4
```

--------------------------------------------------------------------------------

---[FILE: vec3.h]---
Location: obs-studio-master/libobs/graphics/vec3.h
Signals: N/A
Excerpt (<=80 chars):  struct plane;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- plane
- matrix3
- matrix4
- quat
- vec3
```

--------------------------------------------------------------------------------

---[FILE: vec4.c]---
Location: obs-studio-master/libobs/graphics/vec4.c
Signals: N/A
Excerpt (<=80 chars):  struct vec4 temp;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- vec4
- matrix4
```

--------------------------------------------------------------------------------

---[FILE: vec4.h]---
Location: obs-studio-master/libobs/graphics/vec4.h
Signals: N/A
Excerpt (<=80 chars):  struct vec3;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- vec3
- matrix4
- vec4
```

--------------------------------------------------------------------------------

---[FILE: libnsgif.c]---
Location: obs-studio-master/libobs/graphics/libnsgif/libnsgif.c
Signals: N/A
Excerpt (<=80 chars):  struct bitmap *buffer;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bitmap
```

--------------------------------------------------------------------------------

---[FILE: audio-io.c]---
Location: obs-studio-master/libobs/media-io/audio-io.c
Signals: N/A
Excerpt (<=80 chars):  struct audio_input {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- audio_input
- audio_convert_info
- audio_mix
- audio_output
- audio_output_info
- audio_data
- audio_output_data
- resample_info
```

--------------------------------------------------------------------------------

---[FILE: audio-io.h]---
Location: obs-studio-master/libobs/media-io/audio-io.h
Signals: N/A
Excerpt (<=80 chars):  struct audio_output;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- audio_output
- audio_data
- audio_output_data
- audio_output_info
- audio_convert_info
```

--------------------------------------------------------------------------------

---[FILE: audio-resampler-ffmpeg.c]---
Location: obs-studio-master/libobs/media-io/audio-resampler-ffmpeg.c
Signals: N/A
Excerpt (<=80 chars):  struct audio_resampler {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- audio_resampler
- SwrContext
```

--------------------------------------------------------------------------------

---[FILE: audio-resampler.h]---
Location: obs-studio-master/libobs/media-io/audio-resampler.h
Signals: N/A
Excerpt (<=80 chars):  struct audio_resampler;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- audio_resampler
- resample_info
```

--------------------------------------------------------------------------------

---[FILE: frame-rate.h]---
Location: obs-studio-master/libobs/media-io/frame-rate.h
Signals: N/A
Excerpt (<=80 chars):  struct media_frames_per_second {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- media_frames_per_second
```

--------------------------------------------------------------------------------

---[FILE: media-remux.c]---
Location: obs-studio-master/libobs/media-io/media-remux.c
Signals: N/A
Excerpt (<=80 chars):  struct media_remux_job {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- media_remux_job
- _stat64
- stat
```

--------------------------------------------------------------------------------

---[FILE: media-remux.h]---
Location: obs-studio-master/libobs/media-io/media-remux.h
Signals: N/A
Excerpt (<=80 chars):  struct media_remux_job;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- media_remux_job
```

--------------------------------------------------------------------------------

---[FILE: video-frame.h]---
Location: obs-studio-master/libobs/media-io/video-frame.h
Signals: N/A
Excerpt (<=80 chars):  struct video_frame {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- video_frame
```

--------------------------------------------------------------------------------

---[FILE: video-io.c]---
Location: obs-studio-master/libobs/media-io/video-io.c
Signals: N/A
Excerpt (<=80 chars):  struct cached_frame_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cached_frame_info
- video_data
- video_input
- video_scale_info
- video_frame
- video_output
- video_output_info
```

--------------------------------------------------------------------------------

---[FILE: video-io.h]---
Location: obs-studio-master/libobs/media-io/video-io.h
Signals: N/A
Excerpt (<=80 chars):  struct video_frame;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- video_frame
- video_output
- video_data
- video_output_info
- video_scale_info
```

--------------------------------------------------------------------------------

---[FILE: video-matrices.c]---
Location: obs-studio-master/libobs/media-io/video-matrices.c
Signals: N/A
Excerpt (<=80 chars):  struct matrix3 color_matrix;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- matrix3
- vec3
```

--------------------------------------------------------------------------------

---[FILE: video-scaler-ffmpeg.c]---
Location: obs-studio-master/libobs/media-io/video-scaler-ffmpeg.c
Signals: N/A
Excerpt (<=80 chars):  struct video_scaler {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- video_scaler
- SwsContext
```

--------------------------------------------------------------------------------

---[FILE: video-scaler.h]---
Location: obs-studio-master/libobs/media-io/video-scaler.h
Signals: N/A
Excerpt (<=80 chars):  struct video_scaler;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- video_scaler
```

--------------------------------------------------------------------------------

---[FILE: array-serializer.c]---
Location: obs-studio-master/libobs/util/array-serializer.c
Signals: N/A
Excerpt (<=80 chars):  struct array_output_data *output = param;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- array_output_data
```

--------------------------------------------------------------------------------

---[FILE: array-serializer.h]---
Location: obs-studio-master/libobs/util/array-serializer.h
Signals: N/A
Excerpt (<=80 chars):  struct array_output_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- array_output_data
```

--------------------------------------------------------------------------------

---[FILE: bitstream.h]---
Location: obs-studio-master/libobs/util/bitstream.h
Signals: N/A
Excerpt (<=80 chars):  struct bitstream_reader {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bitstream_reader
```

--------------------------------------------------------------------------------

---[FILE: bmem.h]---
Location: obs-studio-master/libobs/util/bmem.h
Signals: N/A
Excerpt (<=80 chars):  struct base_allocator {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- base_allocator
```

--------------------------------------------------------------------------------

---[FILE: buffered-file-serializer.c]---
Location: obs-studio-master/libobs/util/buffered-file-serializer.c
Signals: N/A
Excerpt (<=80 chars):  struct io_header {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- io_header
- io_buffer
- deque
- file_output_data
- dstr
```

--------------------------------------------------------------------------------

---[FILE: cf-lexer.c]---
Location: obs-studio-master/libobs/util/cf-lexer.c
Signals: N/A
Excerpt (<=80 chars):  struct cf_token *token = lex->tokens.array + (i - 1);

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cf_token
- base_token
- macro_param
- macro_params
- dstr
- cf_lexer
```

--------------------------------------------------------------------------------

---[FILE: cf-lexer.h]---
Location: obs-studio-master/libobs/util/cf-lexer.h
Signals: N/A
Excerpt (<=80 chars):  struct cf_token {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cf_token
- strref
- cf_lexer
- lexer
- cf_def
- cf_preprocessor
- error_data
```

--------------------------------------------------------------------------------

---[FILE: cf-parser.c]---
Location: obs-studio-master/libobs/util/cf-parser.c
Signals: N/A
Excerpt (<=80 chars):  struct dstr formatted;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dstr
```

--------------------------------------------------------------------------------

---[FILE: cf-parser.h]---
Location: obs-studio-master/libobs/util/cf-parser.h
Signals: N/A
Excerpt (<=80 chars):  struct cf_parser {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cf_parser
- cf_lexer
- cf_preprocessor
- error_data
- cf_token
```

--------------------------------------------------------------------------------

---[FILE: config-file.c]---
Location: obs-studio-master/libobs/util/config-file.c
Signals: N/A
Excerpt (<=80 chars):  struct config_item {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- config_item
- config_section
- config_data
- base_token
- dstr
- strref
- lexer
```

--------------------------------------------------------------------------------

---[FILE: config-file.h]---
Location: obs-studio-master/libobs/util/config-file.h
Signals: N/A
Excerpt (<=80 chars):  struct config_data;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- config_data
```

--------------------------------------------------------------------------------

---[FILE: darray.h]---
Location: obs-studio-master/libobs/util/darray.h
Signals: N/A
Excerpt (<=80 chars):  struct darray {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- darray
```

--------------------------------------------------------------------------------

---[FILE: deque.h]---
Location: obs-studio-master/libobs/util/deque.h
Signals: N/A
Excerpt (<=80 chars):  struct deque {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- deque
```

--------------------------------------------------------------------------------

---[FILE: dstr.c]---
Location: obs-studio-master/libobs/util/dstr.c
Signals: N/A
Excerpt (<=80 chars):  struct dstr temp;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dstr
```

--------------------------------------------------------------------------------

---[FILE: dstr.h]---
Location: obs-studio-master/libobs/util/dstr.h
Signals: N/A
Excerpt (<=80 chars):  struct strref;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- strref
- dstr
```

--------------------------------------------------------------------------------

---[FILE: dstr.hpp]---
Location: obs-studio-master/libobs/util/dstr.hpp
Signals: N/A
Excerpt (<=80 chars):  class DStr {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DStr
```

--------------------------------------------------------------------------------

---[FILE: file-serializer.c]---
Location: obs-studio-master/libobs/util/file-serializer.c
Signals: N/A
Excerpt (<=80 chars):  struct file_output_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- file_output_data
- dstr
```

--------------------------------------------------------------------------------

---[FILE: lexer.c]---
Location: obs-studio-master/libobs/util/lexer.c
Signals: N/A
Excerpt (<=80 chars):  struct error_item item;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- error_item
- dstr
```

--------------------------------------------------------------------------------

---[FILE: lexer.h]---
Location: obs-studio-master/libobs/util/lexer.h
Signals: N/A
Excerpt (<=80 chars):  struct strref {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- strref
- base_token
- error_item
- error_data
- lexer
```

--------------------------------------------------------------------------------

---[FILE: pipe-posix.c]---
Location: obs-studio-master/libobs/util/pipe-posix.c
Signals: N/A
Excerpt (<=80 chars):  struct os_process_pipe {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- os_process_pipe
```

--------------------------------------------------------------------------------

---[FILE: pipe-windows.c]---
Location: obs-studio-master/libobs/util/pipe-windows.c
Signals: N/A
Excerpt (<=80 chars):  struct os_process_pipe {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- os_process_pipe
- dstr
```

--------------------------------------------------------------------------------

---[FILE: pipe.c]---
Location: obs-studio-master/libobs/util/pipe.c
Signals: N/A
Excerpt (<=80 chars):  struct os_process_args {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- os_process_args
- dstr
```

--------------------------------------------------------------------------------

---[FILE: pipe.h]---
Location: obs-studio-master/libobs/util/pipe.h
Signals: N/A
Excerpt (<=80 chars):  struct os_process_pipe;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- os_process_pipe
- os_process_args
```

--------------------------------------------------------------------------------

---[FILE: platform-nix-dbus.c]---
Location: obs-studio-master/libobs/util/platform-nix-dbus.c
Signals: N/A
Excerpt (<=80 chars):  struct service_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- service_info
- dbus_sleep_info
```

--------------------------------------------------------------------------------

---[FILE: platform-nix-portal.c]---
Location: obs-studio-master/libobs/util/platform-nix-portal.c
Signals: N/A
Excerpt (<=80 chars):  struct portal_inhibit_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- portal_inhibit_info
- dstr
```

--------------------------------------------------------------------------------

---[FILE: platform-nix.c]---
Location: obs-studio-master/libobs/util/platform-nix.c
Signals: N/A
Excerpt (<=80 chars):  struct dstr dylib_name;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dstr
- os_cpu_usage_info
- tms
- timespec
- stat
- os_dir
- dirent
- os_dirent
- statvfs
```

--------------------------------------------------------------------------------

---[FILE: platform-windows.c]---
Location: obs-studio-master/libobs/util/platform-windows.c
Signals: N/A
Excerpt (<=80 chars):  struct win_version_info ver;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- win_version_info
- dstr
- os_cpu_usage_info
- os_dir
- os_dirent
- os_globent
- reg_dword
```

--------------------------------------------------------------------------------

---[FILE: platform.c]---
Location: obs-studio-master/libobs/util/platform.c
Signals: N/A
Excerpt (<=80 chars):  struct _stat st_w32;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _stat
- dstr
- tm
- obs_video_info
- timespec
```

--------------------------------------------------------------------------------

---[FILE: platform.h]---
Location: obs-studio-master/libobs/util/platform.h
Signals: N/A
Excerpt (<=80 chars):  struct os_cpu_usage_info;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- os_cpu_usage_info
- os_dir
- os_dirent
- os_globent
- os_glob_info
- os_inhibit_info
- os_proc_memory_usage
- timespec
```

--------------------------------------------------------------------------------

---[FILE: profiler.c]---
Location: obs-studio-master/libobs/util/profiler.c
Signals: N/A
Excerpt (<=80 chars):  struct profiler_snapshot {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- profiler_snapshot
- profiler_snapshot_entry
- profile_call
- profile_times_table_entry
- profile_times_table
- profile_entry
- profile_root_entry
- dstr
- profiler_name_store
```

--------------------------------------------------------------------------------

---[FILE: profiler.h]---
Location: obs-studio-master/libobs/util/profiler.h
Signals: N/A
Excerpt (<=80 chars):  struct profiler_time_entry {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- profiler_time_entry
```

--------------------------------------------------------------------------------

````
