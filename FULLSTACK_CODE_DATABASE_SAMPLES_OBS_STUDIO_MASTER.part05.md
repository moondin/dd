---
source_txt: fullstack_samples/obs-studio-master
converted_utc: 2025-12-18T10:36:59Z
part: 5
parts_total: 8
---

# FULLSTACK CODE DATABASE SAMPLES obs-studio-master

## Extracted Reusable Patterns (Non-verbatim) (Part 5 of 8)

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

---[FILE: profiler.hpp]---
Location: obs-studio-master/libobs/util/profiler.hpp
Signals: N/A
Excerpt (<=80 chars):  struct ScopeProfiler {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ScopeProfiler
```

--------------------------------------------------------------------------------

---[FILE: serializer.h]---
Location: obs-studio-master/libobs/util/serializer.h
Signals: N/A
Excerpt (<=80 chars):  struct serializer {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- serializer
```

--------------------------------------------------------------------------------

---[FILE: source-profiler.c]---
Location: obs-studio-master/libobs/util/source-profiler.c
Signals: N/A
Excerpt (<=80 chars):  struct frame_sample {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- frame_sample
- source_samples
- ucirclebuf
- profiler_entry
```

--------------------------------------------------------------------------------

---[FILE: task.c]---
Location: obs-studio-master/libobs/util/task.c
Signals: N/A
Excerpt (<=80 chars):  struct os_task_queue {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- os_task_queue
- deque
- os_task_info
```

--------------------------------------------------------------------------------

---[FILE: task.h]---
Location: obs-studio-master/libobs/util/task.h
Signals: N/A
Excerpt (<=80 chars):  struct os_task_queue;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- os_task_queue
```

--------------------------------------------------------------------------------

---[FILE: text-lookup.c]---
Location: obs-studio-master/libobs/util/text-lookup.c
Signals: N/A
Excerpt (<=80 chars):  struct text_item {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- text_item
- text_lookup
- base_token
- strref
- dstr
- lexer
```

--------------------------------------------------------------------------------

---[FILE: text-lookup.h]---
Location: obs-studio-master/libobs/util/text-lookup.h
Signals: N/A
Excerpt (<=80 chars): struct text_lookup;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- text_lookup
```

--------------------------------------------------------------------------------

---[FILE: threading-posix.c]---
Location: obs-studio-master/libobs/util/threading-posix.c
Signals: N/A
Excerpt (<=80 chars):  struct os_event_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- os_event_data
- timespec
- timeval
- os_sem_data
```

--------------------------------------------------------------------------------

---[FILE: threading-windows.c]---
Location: obs-studio-master/libobs/util/threading-windows.c
Signals: N/A
Excerpt (<=80 chars): struct vs_threadname_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- vs_threadname_info
```

--------------------------------------------------------------------------------

---[FILE: threading.h]---
Location: obs-studio-master/libobs/util/threading.h
Signals: N/A
Excerpt (<=80 chars):  struct os_event_data;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- os_event_data
- os_sem_data
```

--------------------------------------------------------------------------------

---[FILE: util.hpp]---
Location: obs-studio-master/libobs/util/util.hpp
Signals: N/A
Excerpt (<=80 chars):  class ConfigFile {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConfigFile
- TextLookup
```

--------------------------------------------------------------------------------

---[FILE: util_uint128.h]---
Location: obs-studio-master/libobs/util/util_uint128.h
Signals: N/A
Excerpt (<=80 chars):  struct util_uint128 {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- util_uint128
```

--------------------------------------------------------------------------------

---[FILE: HRError.hpp]---
Location: obs-studio-master/libobs/util/windows/HRError.hpp
Signals: N/A
Excerpt (<=80 chars):  struct HRError {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HRError
```

--------------------------------------------------------------------------------

---[FILE: win-registry.h]---
Location: obs-studio-master/libobs/util/windows/win-registry.h
Signals: N/A
Excerpt (<=80 chars):  struct reg_dword {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- reg_dword
```

--------------------------------------------------------------------------------

---[FILE: win-version.h]---
Location: obs-studio-master/libobs/util/windows/win-version.h
Signals: N/A
Excerpt (<=80 chars):  struct win_version_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- win_version_info
```

--------------------------------------------------------------------------------

---[FILE: window-helpers.c]---
Location: obs-studio-master/libobs/util/windows/window-helpers.c
Signals: N/A
Excerpt (<=80 chars):  struct dstr str = {0};

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dstr
- top_level_enum_data
```

--------------------------------------------------------------------------------

---[FILE: WinHandle.hpp]---
Location: obs-studio-master/libobs/util/windows/WinHandle.hpp
Signals: N/A
Excerpt (<=80 chars):  class WinHandle {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WinHandle
- WinModule
```

--------------------------------------------------------------------------------

---[FILE: d3d11-shader.cpp]---
Location: obs-studio-master/libobs-d3d11/d3d11-shader.cpp
Signals: N/A
Excerpt (<=80 chars):  struct gs_shader_texture shader_tex;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_shader_texture
- matrix4
```

--------------------------------------------------------------------------------

---[FILE: d3d11-shaderprocessor.hpp]---
Location: obs-studio-master/libobs-d3d11/d3d11-shaderprocessor.hpp
Signals: N/A
Excerpt (<=80 chars):  struct ShaderParser : shader_parser {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ShaderParser
- ShaderProcessor
```

--------------------------------------------------------------------------------

---[FILE: d3d11-subsystem.cpp]---
Location: obs-studio-master/libobs-d3d11/d3d11-subsystem.cpp
Signals: N/A
Excerpt (<=80 chars):  struct UnsupportedHWError : HRError {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UnsupportedHWError
- VertInOut
- HagsStatus
- gs_vb_data
```

--------------------------------------------------------------------------------

---[FILE: d3d11-subsystem.hpp]---
Location: obs-studio-master/libobs-d3d11/d3d11-subsystem.hpp
Signals: N/A
Excerpt (<=80 chars):  struct shader_var;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- shader_var
- shader_sampler
- gs_vertex_shader
- win_version_info
- VBDataPtr
- gs_obj
- gs_vertex_buffer
- DataPtr
- gs_index_buffer
- gs_timer
- gs_timer_range
- gs_texture
- gs_texture_2d
- gs_texture_3d
- gs_zstencil_buffer
- gs_stage_surface
- gs_sampler_state
- gs_shader_param
```

--------------------------------------------------------------------------------

---[FILE: d3d11-vertexbuffer.cpp]---
Location: obs-studio-master/libobs-d3d11/d3d11-vertexbuffer.cpp
Signals: N/A
Excerpt (<=80 chars):  struct gs_tvertarray *tverts = vbd.data->tvarray + i;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_tvertarray
```

--------------------------------------------------------------------------------

---[FILE: gl-egl-common.c]---
Location: obs-studio-master/libobs-opengl/gl-egl-common.c
Signals: N/A
Excerpt (<=80 chars):  struct gs_texture *gl_egl_create_texture_from_eglimage(EGLDisplay egl_displa...

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_texture
```

--------------------------------------------------------------------------------

---[FILE: gl-egl-common.h]---
Location: obs-studio-master/libobs-opengl/gl-egl-common.h
Signals: N/A
Excerpt (<=80 chars):  struct gs_texture *gl_egl_create_dmabuf_image(EGLDisplay egl_display, unsign...

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_texture
```

--------------------------------------------------------------------------------

---[FILE: gl-helpers.c]---
Location: obs-studio-master/libobs-opengl/gl-helpers.c
Signals: N/A
Excerpt (<=80 chars):  struct fbo_info *fbo = get_fbo(src, width, height);

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- fbo_info
- gs_texture
```

--------------------------------------------------------------------------------

---[FILE: gl-helpers.h]---
Location: obs-studio-master/libobs-opengl/gl-helpers.h
Signals: N/A
Excerpt (<=80 chars):  struct gs_texture *src, uint32_t src_x, uint32_t src_y, uint32_t width, uint...

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_texture
```

--------------------------------------------------------------------------------

---[FILE: gl-indexbuffer.c]---
Location: obs-studio-master/libobs-opengl/gl-indexbuffer.c
Signals: N/A
Excerpt (<=80 chars):  struct gs_index_buffer *ib = bzalloc(sizeof(struct gs_index_buffer));

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_index_buffer
```

--------------------------------------------------------------------------------

---[FILE: gl-nix.c]---
Location: obs-studio-master/libobs-opengl/gl-nix.c
Signals: N/A
Excerpt (<=80 chars):  struct gs_texture *device_texture_create_from_pixmap(gs_device_t *device, ui...

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_texture
```

--------------------------------------------------------------------------------

---[FILE: gl-nix.h]---
Location: obs-studio-master/libobs-opengl/gl-nix.h
Signals: N/A
Excerpt (<=80 chars):  struct gl_winsys_vtable {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gl_winsys_vtable
- gl_windowinfo
- gl_platform
- gs_texture
```

--------------------------------------------------------------------------------

---[FILE: gl-shader.c]---
Location: obs-studio-master/libobs-opengl/gl-shader.c
Signals: N/A
Excerpt (<=80 chars):  struct gs_shader_param param = {0};

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_shader_param
- gs_sampler_info
- shader_sampler
- shader_attrib
- gl_parser_attrib
- gs_shader
- gl_shader_parser
- gs_program
- matrix4
- program_param
```

--------------------------------------------------------------------------------

---[FILE: gl-shaderparser.c]---
Location: obs-studio-master/libobs-opengl/gl-shaderparser.c
Signals: N/A
Excerpt (<=80 chars):  struct shader_var *param = glsp->parser.params.array + i;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- shader_var
- shader_sampler
- dstr
- shader_struct
- gl_parser_attrib
- cf_parser
- cf_token
```

--------------------------------------------------------------------------------

---[FILE: gl-shaderparser.h]---
Location: obs-studio-master/libobs-opengl/gl-shaderparser.h
Signals: N/A
Excerpt (<=80 chars):  struct gl_parser_attrib {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gl_parser_attrib
- dstr
- gl_shader_parser
- shader_parser
```

--------------------------------------------------------------------------------

---[FILE: gl-stagesurf.c]---
Location: obs-studio-master/libobs-opengl/gl-stagesurf.c
Signals: N/A
Excerpt (<=80 chars):  struct gs_stage_surface *surf;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_stage_surface
- gs_texture_2d
- fbo_info
```

--------------------------------------------------------------------------------

---[FILE: gl-subsystem.c]---
Location: obs-studio-master/libobs-opengl/gl-subsystem.c
Signals: N/A
Excerpt (<=80 chars):  struct gs_device *device = bzalloc(sizeof(struct gs_device));

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_device
- gs_sampler_info
- gs_swap_chain
- gs_sampler_state
- gs_timer
- gs_shader
- gs_shader_param
- gs_texture
- gs_texture_2d
- gs_texture_cube
- fbo_info
```

--------------------------------------------------------------------------------

---[FILE: gl-subsystem.h]---
Location: obs-studio-master/libobs-opengl/gl-subsystem.h
Signals: N/A
Excerpt (<=80 chars):  struct gl_platform;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gl_platform
- gl_windowinfo
- gs_sampler_state
- vec4
- gs_timer
- gs_shader_param
- gs_texture
- shader_attrib
- gs_shader
- program_param
- gs_program
```

--------------------------------------------------------------------------------

---[FILE: gl-texture2d.c]---
Location: obs-studio-master/libobs-opengl/gl-texture2d.c
Signals: N/A
Excerpt (<=80 chars):  struct gs_texture_2d *tex = bzalloc(sizeof(struct gs_texture_2d));

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_texture_2d
- gs_texture_3d
```

--------------------------------------------------------------------------------

---[FILE: gl-texture3d.c]---
Location: obs-studio-master/libobs-opengl/gl-texture3d.c
Signals: N/A
Excerpt (<=80 chars):  struct gs_texture_3d *tex = bzalloc(sizeof(struct gs_texture_3d));

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_texture_3d
```

--------------------------------------------------------------------------------

---[FILE: gl-texturecube.c]---
Location: obs-studio-master/libobs-opengl/gl-texturecube.c
Signals: N/A
Excerpt (<=80 chars):  struct gs_texture_cube *tex = bzalloc(sizeof(struct gs_texture_cube));

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_texture_cube
```

--------------------------------------------------------------------------------

---[FILE: gl-vertexbuffer.c]---
Location: obs-studio-master/libobs-opengl/gl-vertexbuffer.c
Signals: N/A
Excerpt (<=80 chars):  struct gs_tvertarray *tv = vb->data->tvarray + i;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_tvertarray
- gs_vertex_buffer
- gs_vb_data
- gs_shader
- shader_attrib
```

--------------------------------------------------------------------------------

---[FILE: gl-wayland-egl.c]---
Location: obs-studio-master/libobs-opengl/gl-wayland-egl.c
Signals: N/A
Excerpt (<=80 chars):  struct gl_windowinfo {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gl_windowinfo
- wl_egl_window
- gl_platform
- wl_display
```

--------------------------------------------------------------------------------

---[FILE: gl-windows.c]---
Location: obs-studio-master/libobs-opengl/gl-windows.c
Signals: N/A
Excerpt (<=80 chars): struct gl_windowinfo {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gl_windowinfo
- gl_platform
- dummy_context
- darray
- gs_init_data
```

--------------------------------------------------------------------------------

---[FILE: gl-x11-egl.c]---
Location: obs-studio-master/libobs-opengl/gl-x11-egl.c
Signals: N/A
Excerpt (<=80 chars):  struct gl_windowinfo {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gl_windowinfo
- gl_platform
```

--------------------------------------------------------------------------------

---[FILE: gl-zstencil.c]---
Location: obs-studio-master/libobs-opengl/gl-zstencil.c
Signals: N/A
Excerpt (<=80 chars):  struct gs_zstencil_buffer *zs;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_zstencil_buffer
```

--------------------------------------------------------------------------------

---[FILE: winrt-capture.cpp]---
Location: obs-studio-master/libobs-winrt/winrt-capture.cpp
Signals: N/A
Excerpt (<=80 chars):  struct winrt_capture {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- winrt_capture
```

--------------------------------------------------------------------------------

---[FILE: winrt-dispatch.cpp]---
Location: obs-studio-master/libobs-winrt/winrt-dispatch.cpp
Signals: N/A
Excerpt (<=80 chars):  struct winrt_disaptcher {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- winrt_disaptcher
```

--------------------------------------------------------------------------------

---[FILE: CMakeLists.txt]---
Location: obs-studio-master/plugins/CMakeLists.txt
Signals: N/A
Excerpt (<=80 chars): cmake_minimum_required(VERSION 3.28...3.30)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- check_obs_browser
- check_obs_websocket
```

--------------------------------------------------------------------------------

---[FILE: aja-card-manager.cpp]---
Location: obs-studio-master/plugins/aja/aja-card-manager.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace aja {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- namespace aja
```

--------------------------------------------------------------------------------

---[FILE: aja-card-manager.hpp]---
Location: obs-studio-master/plugins/aja/aja-card-manager.hpp
Signals: N/A
Excerpt (<=80 chars):  class CNTV2Card;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CNTV2Card
- AJAOutput
- AJASource
- CardEntry
- CardManager
- namespace aja
```

--------------------------------------------------------------------------------

---[FILE: aja-common.cpp]---
Location: obs-studio-master/plugins/aja/aja-common.cpp
Signals: N/A
Excerpt (<=80 chars):  struct obs_video_info ovi;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_video_info
- namespace aja
```

--------------------------------------------------------------------------------

---[FILE: aja-common.hpp]---
Location: obs-studio-master/plugins/aja/aja-common.hpp
Signals: N/A
Excerpt (<=80 chars): namespace aja {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- namespace aja
```

--------------------------------------------------------------------------------

---[FILE: aja-output.cpp]---
Location: obs-studio-master/plugins/aja/aja-output.cpp
Signals: N/A
Excerpt (<=80 chars):  struct video_scale_info scaler = {};

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- video_scale_info
- audio_convert_info
- obs_output_info
```

--------------------------------------------------------------------------------

---[FILE: aja-output.hpp]---
Location: obs-studio-master/plugins/aja/aja-output.hpp
Signals: N/A
Excerpt (<=80 chars):  struct VideoFrame {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VideoFrame
- video_data
- AudioFrames
- audio_data
- CNTV2Card
- AJAOutput
```

--------------------------------------------------------------------------------

---[FILE: aja-presets.cpp]---
Location: obs-studio-master/plugins/aja/aja-presets.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace aja {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- namespace aja
```

--------------------------------------------------------------------------------

---[FILE: aja-presets.hpp]---
Location: obs-studio-master/plugins/aja/aja-presets.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace aja {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RoutingPreset
- RoutingConfigurator
- namespace aja
```

--------------------------------------------------------------------------------

---[FILE: aja-props.hpp]---
Location: obs-studio-master/plugins/aja/aja-props.hpp
Signals: N/A
Excerpt (<=80 chars): class SourceProps {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceProps
- OutputProps
```

--------------------------------------------------------------------------------

---[FILE: aja-routing.cpp]---
Location: obs-studio-master/plugins/aja/aja-routing.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace aja {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- namespace aja
```

--------------------------------------------------------------------------------

---[FILE: aja-routing.hpp]---
Location: obs-studio-master/plugins/aja/aja-routing.hpp
Signals: N/A
Excerpt (<=80 chars):  class CNTV2Card;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CNTV2Card
- RoutingConfig
- Routing
- namespace aja
```

--------------------------------------------------------------------------------

---[FILE: aja-source.cpp]---
Location: obs-studio-master/plugins/aja/aja-source.cpp
Signals: N/A
Excerpt (<=80 chars):  struct AudioOffsets {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AudioOffsets
- obs_source_frame2
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: aja-source.hpp]---
Location: obs-studio-master/plugins/aja/aja-source.hpp
Signals: N/A
Excerpt (<=80 chars):  class CNTV2Card;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CNTV2Card
- AJASource
```

--------------------------------------------------------------------------------

---[FILE: aja-ui-props.hpp]---
Location: obs-studio-master/plugins/aja/aja-ui-props.hpp
Signals: N/A
Excerpt (<=80 chars):  struct UIProperty {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UIProperty
```

--------------------------------------------------------------------------------

---[FILE: aja-vpid-data.hpp]---
Location: obs-studio-master/plugins/aja/aja-vpid-data.hpp
Signals: N/A
Excerpt (<=80 chars): class VPIDData {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VPIDData
```

--------------------------------------------------------------------------------

---[FILE: aja-widget-io.hpp]---
Location: obs-studio-master/plugins/aja/aja-widget-io.hpp
Signals: N/A
Excerpt (<=80 chars): struct WidgetInputSocket {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WidgetInputSocket
- WidgetOutputSocket
```

--------------------------------------------------------------------------------

---[FILE: audio-repack.h]---
Location: obs-studio-master/plugins/aja/audio-repack.h
Signals: N/A
Excerpt (<=80 chars):  struct audio_repack;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- audio_repack
```

--------------------------------------------------------------------------------

---[FILE: audio-repack.hpp]---
Location: obs-studio-master/plugins/aja/audio-repack.hpp
Signals: N/A
Excerpt (<=80 chars):  class AudioRepacker {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AudioRepacker
- audio_repack
```

--------------------------------------------------------------------------------

---[FILE: main.cpp]---
Location: obs-studio-master/plugins/aja/main.cpp
Signals: N/A
Excerpt (<=80 chars):  struct calldata params = {0};

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- calldata
```

--------------------------------------------------------------------------------

---[FILE: encoder.cpp]---
Location: obs-studio-master/plugins/coreaudio-encoder/encoder.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- asbd_builder
- ca_encoder
- obs_audio_info
- obs_encoder_info
- namespace std
```

--------------------------------------------------------------------------------

---[FILE: windows-imports.h]---
Location: obs-studio-master/plugins/coreaudio-encoder/windows-imports.h
Signals: N/A
Excerpt (<=80 chars):  struct OpaqueAudioConverter;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OpaqueAudioConverter
- AudioValueRange
- AudioBuffer
- AudioBufferList
- AudioStreamBasicDescription
- AudioStreamPacketDescription
- AudioChannelDescription
- AudioChannelLayout
- AudioConverterPrimeInfo
- path_list_t
```

--------------------------------------------------------------------------------

---[FILE: audio-repack.h]---
Location: obs-studio-master/plugins/decklink/audio-repack.h
Signals: N/A
Excerpt (<=80 chars):  struct audio_repack;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- audio_repack
```

--------------------------------------------------------------------------------

---[FILE: audio-repack.hpp]---
Location: obs-studio-master/plugins/decklink/audio-repack.hpp
Signals: N/A
Excerpt (<=80 chars):  class AudioRepacker {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AudioRepacker
- audio_repack
```

--------------------------------------------------------------------------------

---[FILE: decklink-device-discovery.hpp]---
Location: obs-studio-master/plugins/decklink/decklink-device-discovery.hpp
Signals: N/A
Excerpt (<=80 chars):  class DeckLinkDevice;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeckLinkDevice
- DeviceChangeInfo
- DeckLinkDeviceDiscovery
```

--------------------------------------------------------------------------------

---[FILE: decklink-device-instance.cpp]---
Location: obs-studio-master/plugins/decklink/decklink-device-instance.cpp
Signals: N/A
Excerpt (<=80 chars):  struct bitstream_reader reader;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bitstream_reader
- obs_video_info
```

--------------------------------------------------------------------------------

---[FILE: decklink-device-instance.hpp]---
Location: obs-studio-master/plugins/decklink/decklink-device-instance.hpp
Signals: N/A
Excerpt (<=80 chars):  class AudioRepacker;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AudioRepacker
- DecklinkBase
- FrameQueue
- Node
- alignas
- DeckLinkDeviceInstance
- obs_source_frame2
- obs_source_audio
- obs_source_cea_708
```

--------------------------------------------------------------------------------

---[FILE: decklink-device-mode.hpp]---
Location: obs-studio-master/plugins/decklink/decklink-device-mode.hpp
Signals: N/A
Excerpt (<=80 chars):  class DeckLinkDeviceMode {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeckLinkDeviceMode
```

--------------------------------------------------------------------------------

---[FILE: decklink-device.hpp]---
Location: obs-studio-master/plugins/decklink/decklink-device.hpp
Signals: N/A
Excerpt (<=80 chars):  class DeckLinkDevice {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeckLinkDevice
```

--------------------------------------------------------------------------------

---[FILE: decklink-output.cpp]---
Location: obs-studio-master/plugins/decklink/decklink-output.cpp
Signals: N/A
Excerpt (<=80 chars):  struct video_scale_info to = {};

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- video_scale_info
- obs_audio_info
- obs_video_info
- audio_convert_info
- audio_data
- obs_output_info
```

--------------------------------------------------------------------------------

---[FILE: decklink-source.cpp]---
Location: obs-studio-master/plugins/decklink/decklink-source.cpp
Signals: N/A
Excerpt (<=80 chars):  struct obs_source_info create_decklink_source_info()

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: DecklinkBase.h]---
Location: obs-studio-master/plugins/decklink/DecklinkBase.h
Signals: N/A
Excerpt (<=80 chars):  class DecklinkBase {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DecklinkBase
```

--------------------------------------------------------------------------------

---[FILE: DecklinkInput.hpp]---
Location: obs-studio-master/plugins/decklink/DecklinkInput.hpp
Signals: N/A
Excerpt (<=80 chars):  class DeckLinkInput : public DecklinkBase {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeckLinkInput
```

--------------------------------------------------------------------------------

---[FILE: DecklinkOutput.hpp]---
Location: obs-studio-master/plugins/decklink/DecklinkOutput.hpp
Signals: N/A
Excerpt (<=80 chars):  class DeckLinkOutput : public DecklinkBase {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeckLinkOutput
```

--------------------------------------------------------------------------------

---[FILE: OBSVideoFrame.h]---
Location: obs-studio-master/plugins/decklink/OBSVideoFrame.h
Signals: N/A
Excerpt (<=80 chars):  class OBSVideoFrame : public IDeckLinkMutableVideoFrame {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSVideoFrame
- HDRVideoFrame
```

--------------------------------------------------------------------------------

---[FILE: plugin-main.cpp]---
Location: obs-studio-master/plugins/decklink/plugin-main.cpp
Signals: N/A
Excerpt (<=80 chars): struct obs_source_info decklink_source_info;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_source_info
- obs_output_info
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPI.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPI.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkVideoOutputCallback;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkVideoOutputCallback
- IDeckLinkInputCallback
- IDeckLinkEncoderInputCallback
- IDeckLinkMemoryAllocator
- IDeckLinkAudioOutputCallback
- IDeckLinkIterator
- IDeckLinkAPIInformation
- IDeckLinkOutput
- IDeckLinkInput
- IDeckLinkHDMIInputEDID
- IDeckLinkEncoderInput
- IDeckLinkVideoFrame
- IDeckLinkMutableVideoFrame
- IDeckLinkVideoFrame3DExtensions
- IDeckLinkVideoFrameMetadataExtensions
- IDeckLinkVideoInputFrame
- IDeckLinkAncillaryPacket
- IDeckLinkAncillaryPacketIterator
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIConfiguration.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPIConfiguration.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkConfiguration;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkConfiguration
- IDeckLinkEncoderConfiguration
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIConfiguration_v10_11.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPIConfiguration_v10_11.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkConfiguration_v10_11;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkConfiguration_v10_11
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIConfiguration_v10_2.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPIConfiguration_v10_2.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkConfiguration_v10_2;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkConfiguration_v10_2
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIConfiguration_v10_4.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPIConfiguration_v10_4.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkConfiguration_v10_4;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkConfiguration_v10_4
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIConfiguration_v10_5.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPIConfiguration_v10_5.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkEncoderConfiguration_v10_5;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkEncoderConfiguration_v10_5
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIConfiguration_v10_9.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPIConfiguration_v10_9.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkConfiguration_v10_9;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkConfiguration_v10_9
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIDeckControl.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPIDeckControl.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkDeckControlStatusCallback;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkDeckControlStatusCallback
- IDeckLinkDeckControl
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIDiscovery.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPIDiscovery.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLink;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLink
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIModes.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPIModes.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkDisplayModeIterator;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkDisplayModeIterator
- IDeckLinkDisplayMode
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPITypes.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPITypes.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkTimecode;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkTimecode
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIVideoEncoderInput_v10_11.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPIVideoEncoderInput_v10_11.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkEncoderInput_v10_11 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkEncoderInput_v10_11
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIVideoInput_v10_11.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPIVideoInput_v10_11.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkInput_v10_11 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkInput_v10_11
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIVideoInput_v11_4.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPIVideoInput_v11_4.h
Signals: N/A
Excerpt (<=80 chars):  class BMD_PUBLIC IDeckLinkInput_v11_4 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIVideoInput_v11_5_1.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPIVideoInput_v11_5_1.h
Signals: N/A
Excerpt (<=80 chars):  class BMD_PUBLIC IDeckLinkInputCallback_v11_5_1 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIVideoOutput_v10_11.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPIVideoOutput_v10_11.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkOutput_v10_11 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkOutput_v10_11
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIVideoOutput_v11_4.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPIVideoOutput_v11_4.h
Signals: N/A
Excerpt (<=80 chars):  class BMD_PUBLIC IDeckLinkOutput_v11_4 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPI_v10_11.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPI_v10_11.h
Signals: N/A
Excerpt (<=80 chars):  class BMD_PUBLIC IDeckLinkAttributes_v10_11 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPI_v11_5.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPI_v11_5.h
Signals: N/A
Excerpt (<=80 chars):  class BMD_PUBLIC IDeckLinkVideoFrameMetadataExtensions_v11_5 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPI_v7_1.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPI_v7_1.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkDisplayModeIterator_v7_1;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkDisplayModeIterator_v7_1
- IDeckLinkDisplayMode_v7_1
- IDeckLinkVideoFrame_v7_1
- IDeckLinkVideoInputFrame_v7_1
- IDeckLinkAudioInputPacket_v7_1
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPI_v7_3.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPI_v7_3.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkVideoInputFrame_v7_3;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkVideoInputFrame_v7_3
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPI_v7_6.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPI_v7_6.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkVideoOutputCallback_v7_6;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkVideoOutputCallback_v7_6
- IDeckLinkInputCallback_v7_6
- IDeckLinkDisplayModeIterator_v7_6
- IDeckLinkDisplayMode_v7_6
- IDeckLinkOutput_v7_6
- IDeckLinkInput_v7_6
- IDeckLinkTimecode_v7_6
- IDeckLinkVideoFrame_v7_6
- IDeckLinkMutableVideoFrame_v7_6
- IDeckLinkVideoInputFrame_v7_6
- IDeckLinkScreenPreviewCallback_v7_6
- IDeckLinkGLScreenPreviewHelper_v7_6
- IDeckLinkVideoConversion_v7_6
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPI_v7_9.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPI_v7_9.h
Signals: N/A
Excerpt (<=80 chars): class IDeckLinkDeckControl_v7_9;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkDeckControl_v7_9
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPI_v8_0.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPI_v8_0.h
Signals: N/A
Excerpt (<=80 chars):  class BMD_PUBLIC IDeckLink_v8_0 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

````
