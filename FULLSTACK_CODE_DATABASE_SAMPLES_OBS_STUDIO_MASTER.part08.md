---
source_txt: fullstack_samples/obs-studio-master
converted_utc: 2025-12-18T10:36:59Z
part: 8
parts_total: 8
---

# FULLSTACK CODE DATABASE SAMPLES obs-studio-master

## Extracted Reusable Patterns (Non-verbatim) (Part 8 of 8)

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

---[FILE: game-capture.c]---
Location: obs-studio-master/plugins/win-capture/game-capture.c
Signals: N/A
Excerpt (<=80 chars):  struct game_capture_config {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- game_capture_config
- game_capture
- cursor_data
- dstr
- hook_info
- shmem_data
- shtex_data
- graphics_offsets
```

--------------------------------------------------------------------------------

---[FILE: load-graphics-offsets.c]---
Location: obs-studio-master/plugins/win-capture/load-graphics-offsets.c
Signals: N/A
Excerpt (<=80 chars):  struct win_version_info config_ver;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- win_version_info
- dstr
```

--------------------------------------------------------------------------------

---[FILE: monitor-capture.c]---
Location: obs-studio-master/plugins/win-capture/monitor-capture.c
Signals: N/A
Excerpt (<=80 chars):  struct monitor_capture {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- monitor_capture
- dc_capture
- monitor_info
- dstr
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: plugin-main.c]---
Location: obs-studio-master/plugins/win-capture/plugin-main.c
Signals: N/A
Excerpt (<=80 chars):  struct win_version_info ver;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- win_version_info
```

--------------------------------------------------------------------------------

---[FILE: window-capture.c]---
Location: obs-studio-master/plugins/win-capture/window-capture.c
Signals: N/A
Excerpt (<=80 chars):  struct winrt_exports {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- winrt_exports
- window_capture
- dc_capture
- winrt_capture
- dstr
- compat_result
```

--------------------------------------------------------------------------------

---[FILE: d3d8-offsets.cpp]---
Location: obs-studio-master/plugins/win-capture/get-graphics-offsets/d3d8-offsets.cpp
Signals: N/A
Excerpt (<=80 chars):  struct d3d8_info {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- d3d8_info
```

--------------------------------------------------------------------------------

---[FILE: d3d9-offsets.cpp]---
Location: obs-studio-master/plugins/win-capture/get-graphics-offsets/d3d9-offsets.cpp
Signals: N/A
Excerpt (<=80 chars):  struct d3d9_info {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- d3d9_info
```

--------------------------------------------------------------------------------

---[FILE: dxgi-offsets.cpp]---
Location: obs-studio-master/plugins/win-capture/get-graphics-offsets/dxgi-offsets.cpp
Signals: N/A
Excerpt (<=80 chars):  struct dxgi_info {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dxgi_info
```

--------------------------------------------------------------------------------

---[FILE: get-graphics-offsets.c]---
Location: obs-studio-master/plugins/win-capture/get-graphics-offsets/get-graphics-offsets.c
Signals: N/A
Excerpt (<=80 chars):  struct d3d8_offsets d3d8 = {0};

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- d3d8_offsets
- d3d9_offsets
- dxgi_offsets
- dxgi_offsets2
```

--------------------------------------------------------------------------------

---[FILE: d3d10-capture.cpp]---
Location: obs-studio-master/plugins/win-capture/graphics-hook/d3d10-capture.cpp
Signals: N/A
Excerpt (<=80 chars):  struct d3d10_data {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- d3d10_data
- shtex_data
- shmem_data
```

--------------------------------------------------------------------------------

---[FILE: d3d11-capture.cpp]---
Location: obs-studio-master/plugins/win-capture/graphics-hook/d3d11-capture.cpp
Signals: N/A
Excerpt (<=80 chars):  struct d3d11_data {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- d3d11_data
- shtex_data
- shmem_data
```

--------------------------------------------------------------------------------

---[FILE: d3d12-capture.cpp]---
Location: obs-studio-master/plugins/win-capture/graphics-hook/d3d12-capture.cpp
Signals: N/A
Excerpt (<=80 chars):  struct d3d12_data {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- d3d12_data
- shtex_data
```

--------------------------------------------------------------------------------

---[FILE: d3d8-capture.cpp]---
Location: obs-studio-master/plugins/win-capture/graphics-hook/d3d8-capture.cpp
Signals: N/A
Excerpt (<=80 chars):  struct d3d8_data {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- d3d8_data
- shmem_data
```

--------------------------------------------------------------------------------

---[FILE: d3d9-capture.cpp]---
Location: obs-studio-master/plugins/win-capture/graphics-hook/d3d9-capture.cpp
Signals: N/A
Excerpt (<=80 chars):  struct d3d9_data {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- d3d9_data
- shtex_data
- shmem_data
- d3d9_offsets
```

--------------------------------------------------------------------------------

---[FILE: d3d9-patches.hpp]---
Location: obs-studio-master/plugins/win-capture/graphics-hook/d3d9-patches.hpp
Signals: N/A
Excerpt (<=80 chars):  struct patch_info {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- patch_info
```

--------------------------------------------------------------------------------

---[FILE: dxgi-capture.cpp]---
Location: obs-studio-master/plugins/win-capture/graphics-hook/dxgi-capture.cpp
Signals: N/A
Excerpt (<=80 chars): struct ID3D12CommandQueue *dxgi_possible_swap_queues[8]{};

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ID3D12CommandQueue
- dxgi_swap_data
```

--------------------------------------------------------------------------------

---[FILE: gl-capture.c]---
Location: obs-studio-master/plugins/win-capture/graphics-hook/gl-capture.c
Signals: N/A
Excerpt (<=80 chars):  struct gl_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gl_data
- shtex_data
- shmem_data
```

--------------------------------------------------------------------------------

---[FILE: graphics-hook.c]---
Location: obs-studio-master/plugins/win-capture/graphics-hook/graphics-hook.c
Signals: N/A
Excerpt (<=80 chars):  struct thread_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- thread_data
- hook_info
- shmem_data
```

--------------------------------------------------------------------------------

---[FILE: graphics-hook.h]---
Location: obs-studio-master/plugins/win-capture/graphics-hook/graphics-hook.h
Signals: N/A
Excerpt (<=80 chars):  struct vertex {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- vertex
```

--------------------------------------------------------------------------------

---[FILE: vulkan-capture.c]---
Location: obs-studio-master/plugins/win-capture/graphics-hook/vulkan-capture.c
Signals: N/A
Excerpt (<=80 chars):  struct vk_obj_node {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- vk_obj_node
- vk_obj_list
- vk_swap_data
- shtex_data
- vk_queue_data
- vk_frame_data
- vk_swap_view_data
- vk_framebuffer_data
- vk_surf_data
- vk_inst_data
```

--------------------------------------------------------------------------------

---[FILE: vulkan-capture.h]---
Location: obs-studio-master/plugins/win-capture/graphics-hook/vulkan-capture.h
Signals: N/A
Excerpt (<=80 chars):  struct vk_inst_funcs {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- vk_inst_funcs
- vk_device_funcs
```

--------------------------------------------------------------------------------

---[FILE: ffmpeg-decode.h]---
Location: obs-studio-master/plugins/win-dshow/ffmpeg-decode.h
Signals: N/A
Excerpt (<=80 chars):  struct ffmpeg_decode {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ffmpeg_decode
- obs_source_audio
```

--------------------------------------------------------------------------------

---[FILE: shared-memory-queue.c]---
Location: obs-studio-master/plugins/win-dshow/shared-memory-queue.c
Signals: N/A
Excerpt (<=80 chars):  struct queue_header {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- queue_header
- video_queue
```

--------------------------------------------------------------------------------

---[FILE: shared-memory-queue.h]---
Location: obs-studio-master/plugins/win-dshow/shared-memory-queue.h
Signals: N/A
Excerpt (<=80 chars):  struct video_queue;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- video_queue
- nv12_scale
```

--------------------------------------------------------------------------------

---[FILE: tiny-nv12-scale.h]---
Location: obs-studio-master/plugins/win-dshow/tiny-nv12-scale.h
Signals: N/A
Excerpt (<=80 chars):  struct nv12_scale {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nv12_scale
```

--------------------------------------------------------------------------------

---[FILE: virtualcam.c]---
Location: obs-studio-master/plugins/win-dshow/virtualcam.c
Signals: N/A
Excerpt (<=80 chars):  struct virtualcam_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- virtualcam_data
- obs_video_info
- video_scale_info
- obs_output_info
```

--------------------------------------------------------------------------------

---[FILE: win-dshow-encoder.cpp]---
Location: obs-studio-master/plugins/win-dshow/win-dshow-encoder.cpp
Signals: N/A
Excerpt (<=80 chars):  struct DShowEncoder {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DShowEncoder
```

--------------------------------------------------------------------------------

---[FILE: win-dshow.cpp]---
Location: obs-studio-master/plugins/win-dshow/win-dshow.cpp
Signals: N/A
Excerpt (<=80 chars):  class Decoder {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Decoder
- ffmpeg_decode
- CriticalSection
- CriticalScope
- DShowInput
- PropertiesData
- Resolution
- FPSFormat
- VideoFormatName
```

--------------------------------------------------------------------------------

---[FILE: virtualcam-filter.hpp]---
Location: obs-studio-master/plugins/win-dshow/virtualcam-module/virtualcam-filter.hpp
Signals: N/A
Excerpt (<=80 chars):  class VCamFilter : public DShow::OutputFilter {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VCamFilter
```

--------------------------------------------------------------------------------

---[FILE: virtualcam-module.cpp]---
Location: obs-studio-master/plugins/win-dshow/virtualcam-module/virtualcam-module.cpp
Signals: N/A
Excerpt (<=80 chars):  class VCamFactory : public IClassFactory {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VCamFactory
```

--------------------------------------------------------------------------------

---[FILE: enum-wasapi.hpp]---
Location: obs-studio-master/plugins/win-wasapi/enum-wasapi.hpp
Signals: N/A
Excerpt (<=80 chars):  struct AudioDeviceInfo {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AudioDeviceInfo
```

--------------------------------------------------------------------------------

---[FILE: plugin-main.cpp]---
Location: obs-studio-master/plugins/win-wasapi/plugin-main.cpp
Signals: N/A
Excerpt (<=80 chars):  struct win_version_info ver;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- win_version_info
```

--------------------------------------------------------------------------------

---[FILE: wasapi-notify.cpp]---
Location: obs-studio-master/plugins/win-wasapi/wasapi-notify.cpp
Signals: N/A
Excerpt (<=80 chars):  class NotificationClient : public IMMNotificationClient {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NotificationClient
```

--------------------------------------------------------------------------------

---[FILE: wasapi-notify.hpp]---
Location: obs-studio-master/plugins/win-wasapi/wasapi-notify.hpp
Signals: N/A
Excerpt (<=80 chars):  class NotificationClient;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NotificationClient
- WASAPINotify
```

--------------------------------------------------------------------------------

---[FILE: win-wasapi.cpp]---
Location: obs-studio-master/plugins/win-wasapi/win-wasapi.cpp
Signals: N/A
Excerpt (<=80 chars):  class WASAPIActivateAudioInterfaceCompletionHandler

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WASAPIActivateAudioInterfaceCompletionHandler
- ARtwqAsyncCallback
- WASAPISource
- CallbackStartCapture
- CallbackSampleReady
- CallbackRestart
- UpdateParams
- win_version_info
- obs_audio_info
- dstr
```

--------------------------------------------------------------------------------

---[FILE: bpm-internal.h]---
Location: obs-studio-master/shared/bpm/bpm-internal.h
Signals: N/A
Excerpt (<=80 chars):  struct counter_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- counter_data
- metrics_time
- timespec
- metrics_data
- array_output_data
- output_metrics_link
```

--------------------------------------------------------------------------------

---[FILE: bpm.c]---
Location: obs-studio-master/shared/bpm/bpm.c
Signals: N/A
Excerpt (<=80 chars):  struct serializer s;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- serializer
- metrics_data
- encoder_packet
- output_metrics_link
```

--------------------------------------------------------------------------------

---[FILE: file-updater.c]---
Location: obs-studio-master/shared/file-updater/file-updater/file-updater.c
Signals: N/A
Excerpt (<=80 chars):  struct update_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- update_info
- curl_slist
- dstr
- file_update_data
- file_download_data
```

--------------------------------------------------------------------------------

---[FILE: file-updater.h]---
Location: obs-studio-master/shared/file-updater/file-updater/file-updater.h
Signals: N/A
Excerpt (<=80 chars):  struct update_info;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- update_info
- file_download_data
```

--------------------------------------------------------------------------------

---[FILE: happy-eyeballs.c]---
Location: obs-studio-master/shared/happy-eyeballs/happy-eyeballs.c
Signals: N/A
Excerpt (<=80 chars):  struct happy_eyeballs_candidate {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- happy_eyeballs_candidate
- happy_eyeballs_ctx
- sockaddr_storage
- addrinfo
- happy_connect_worker_args
- dstr
- mode
```

--------------------------------------------------------------------------------

---[FILE: happy-eyeballs.h]---
Location: obs-studio-master/shared/happy-eyeballs/happy-eyeballs.h
Signals: N/A
Excerpt (<=80 chars):  struct happy_eyeballs_ctx;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- happy_eyeballs_ctx
- sockaddr_storage
```

--------------------------------------------------------------------------------

---[FILE: pipe-windows.h]---
Location: obs-studio-master/shared/ipc-util/ipc-util/pipe-windows.h
Signals: N/A
Excerpt (<=80 chars):  struct ipc_pipe_server {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ipc_pipe_server
- ipc_pipe_client
```

--------------------------------------------------------------------------------

---[FILE: pipe.h]---
Location: obs-studio-master/shared/ipc-util/ipc-util/pipe.h
Signals: N/A
Excerpt (<=80 chars):  struct ipc_pipe_server;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ipc_pipe_server
- ipc_pipe_client
```

--------------------------------------------------------------------------------

---[FILE: cache.c]---
Location: obs-studio-master/shared/media-playback/media-playback/cache.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_source_frame *v;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_source_frame
- obs_source_audio
- mp_media_info
```

--------------------------------------------------------------------------------

---[FILE: cache.h]---
Location: obs-studio-master/shared/media-playback/media-playback/cache.h
Signals: N/A
Excerpt (<=80 chars):  struct mp_cache {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mp_cache
```

--------------------------------------------------------------------------------

---[FILE: decode.c]---
Location: obs-studio-master/shared/media-playback/media-playback/decode.c
Signals: N/A
Excerpt (<=80 chars):  struct mp_decode *d = type == AVMEDIA_TYPE_VIDEO ? &m->v : &m->a;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mp_decode
```

--------------------------------------------------------------------------------

---[FILE: decode.h]---
Location: obs-studio-master/shared/media-playback/media-playback/decode.h
Signals: N/A
Excerpt (<=80 chars):  struct mp_media;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mp_media
- mp_decode
- deque
```

--------------------------------------------------------------------------------

---[FILE: media-playback.c]---
Location: obs-studio-master/shared/media-playback/media-playback/media-playback.c
Signals: N/A
Excerpt (<=80 chars):  struct media_playback {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- media_playback
```

--------------------------------------------------------------------------------

---[FILE: media-playback.h]---
Location: obs-studio-master/shared/media-playback/media-playback/media-playback.h
Signals: N/A
Excerpt (<=80 chars):  struct media_playback;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- media_playback
- mp_media_info
```

--------------------------------------------------------------------------------

---[FILE: media.c]---
Location: obs-studio-master/shared/media-playback/media-playback/media.c
Signals: N/A
Excerpt (<=80 chars):  struct mp_decode *d = get_packet_decoder(media, pkt);

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mp_decode
- obs_source_audio
- obs_source_frame
```

--------------------------------------------------------------------------------

---[FILE: media.h]---
Location: obs-studio-master/shared/media-playback/media-playback/media.h
Signals: N/A
Excerpt (<=80 chars):  struct mp_media {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mp_media
- SwsContext
- mp_decode
- obs_source_frame
```

--------------------------------------------------------------------------------

---[FILE: graphics-hook-info.h]---
Location: obs-studio-master/shared/obs-hook-config/graphics-hook-info.h
Signals: N/A
Excerpt (<=80 chars):  struct d3d8_offsets {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- d3d8_offsets
- d3d9_offsets
- d3d12_offsets
- dxgi_offsets
- dxgi_offsets2
- ddraw_offsets
- shmem_data
- shtex_data
- graphics_offsets
- hook_info
```

--------------------------------------------------------------------------------

---[FILE: cstrcache.cpp]---
Location: obs-studio-master/shared/obs-scripting/cstrcache.cpp
Signals: N/A
Excerpt (<=80 chars):  struct const_string_table {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- const_string_table
```

--------------------------------------------------------------------------------

---[FILE: obs-scripting-callback.h]---
Location: obs-studio-master/shared/obs-scripting/obs-scripting-callback.h
Signals: N/A
Excerpt (<=80 chars):  struct script_callback {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- script_callback
```

--------------------------------------------------------------------------------

---[FILE: obs-scripting-internal.h]---
Location: obs-studio-master/shared/obs-scripting/obs-scripting-internal.h
Signals: N/A
Excerpt (<=80 chars):  struct obs_script {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_script
- dstr
- script_callback
```

--------------------------------------------------------------------------------

---[FILE: obs-scripting-lua-frontend.c]---
Location: obs-studio-master/shared/obs-scripting/obs-scripting-lua-frontend.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_frontend_source_list list = {0};

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_frontend_source_list
- lua_obs_callback
```

--------------------------------------------------------------------------------

---[FILE: obs-scripting-lua-source.c]---
Location: obs-studio-master/shared/obs-scripting/obs-scripting-lua-source.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_lua_data;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_lua_data
- obs_lua_source
- obs_lua_script
```

--------------------------------------------------------------------------------

---[FILE: obs-scripting-lua.c]---
Location: obs-studio-master/shared/obs-scripting/obs-scripting-lua.c
Signals: N/A
Excerpt (<=80 chars):  struct dstr str = {0};

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dstr
- obs_lua_script
- lua_obs_timer
- lua_obs_callback
```

--------------------------------------------------------------------------------

---[FILE: obs-scripting-lua.h]---
Location: obs-studio-master/shared/obs-scripting/obs-scripting-lua.h
Signals: N/A
Excerpt (<=80 chars):  struct obs_lua_script;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_lua_script
- lua_obs_callback
- dstr
- script_callback
```

--------------------------------------------------------------------------------

---[FILE: obs-scripting-python-frontend.c]---
Location: obs-studio-master/shared/obs-scripting/obs-scripting-python-frontend.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_frontend_source_list list = {0};

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_frontend_source_list
- python_obs_callback
- obs_python_script
```

--------------------------------------------------------------------------------

---[FILE: obs-scripting-python-import.c]---
Location: obs-studio-master/shared/obs-scripting/obs-scripting-python-import.c
Signals: N/A
Excerpt (<=80 chars):  struct dstr lib_path;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dstr
```

--------------------------------------------------------------------------------

---[FILE: obs-scripting-python.c]---
Location: obs-studio-master/shared/obs-scripting/obs-scripting-python.c
Signals: N/A
Excerpt (<=80 chars): class stdout_logger(object):\n\

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- stdout_logger
- stderr_logger
- obs_python_script
- python_obs_callback
- python_obs_timer
```

--------------------------------------------------------------------------------

---[FILE: obs-scripting-python.h]---
Location: obs-studio-master/shared/obs-scripting/obs-scripting-python.h
Signals: N/A
Excerpt (<=80 chars):  struct python_obs_callback;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- python_obs_callback
- obs_python_script
- dstr
- script_callback
- py_source
```

--------------------------------------------------------------------------------

---[FILE: obs-scripting.c]---
Location: obs-studio-master/shared/obs-scripting/obs-scripting.c
Signals: N/A
Excerpt (<=80 chars): struct script_callback *detached_callbacks;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- script_callback
- defer_call
```

--------------------------------------------------------------------------------

---[FILE: obs-scripting.h]---
Location: obs-studio-master/shared/obs-scripting/obs-scripting.h
Signals: N/A
Excerpt (<=80 chars):  struct obs_script;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_script
```

--------------------------------------------------------------------------------

---[FILE: shared-memory-queue.c]---
Location: obs-studio-master/shared/obs-shared-memory-queue/shared-memory-queue.c
Signals: N/A
Excerpt (<=80 chars):  struct queue_header {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- queue_header
- video_queue
```

--------------------------------------------------------------------------------

---[FILE: shared-memory-queue.h]---
Location: obs-studio-master/shared/obs-shared-memory-queue/shared-memory-queue.h
Signals: N/A
Excerpt (<=80 chars):  struct video_queue;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- video_queue
- nv12_scale
```

--------------------------------------------------------------------------------

---[FILE: tiny-nv12-scale.h]---
Location: obs-studio-master/shared/obs-tiny-nv12-scale/tiny-nv12-scale.h
Signals: N/A
Excerpt (<=80 chars):  struct nv12_scale {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nv12_scale
```

--------------------------------------------------------------------------------

---[FILE: opts-parser.c]---
Location: obs-studio-master/shared/opts-parser/opts-parser.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_options obs_parse_options(const char *options_string)

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_options
- obs_option
```

--------------------------------------------------------------------------------

---[FILE: opts-parser.h]---
Location: obs-studio-master/shared/opts-parser/opts-parser.h
Signals: N/A
Excerpt (<=80 chars):  struct obs_option {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_option
- obs_options
```

--------------------------------------------------------------------------------

---[FILE: double-slider.hpp]---
Location: obs-studio-master/shared/properties-view/double-slider.hpp
Signals: N/A
Excerpt (<=80 chars):  class DoubleSlider : public SliderIgnoreScroll {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DoubleSlider
```

--------------------------------------------------------------------------------

---[FILE: properties-view.cpp]---
Location: obs-studio-master/shared/properties-view/properties-view.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- frame_rate_tag
- common_frame_rate
- EditableItemDialog
- namespace std
```

--------------------------------------------------------------------------------

---[FILE: properties-view.hpp]---
Location: obs-studio-master/shared/properties-view/properties-view.hpp
Signals: N/A
Excerpt (<=80 chars):  class QFormLayout;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QFormLayout
- OBSPropertiesView
- QLabel
- WidgetInfo
```

--------------------------------------------------------------------------------

---[FILE: properties-view.moc.hpp]---
Location: obs-studio-master/shared/properties-view/properties-view.moc.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSFrameRatePropertyWidget : public QWidget {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSFrameRatePropertyWidget
```

--------------------------------------------------------------------------------

---[FILE: spinbox-ignorewheel.hpp]---
Location: obs-studio-master/shared/properties-view/spinbox-ignorewheel.hpp
Signals: N/A
Excerpt (<=80 chars):  class SpinBoxIgnoreScroll : public QSpinBox {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SpinBoxIgnoreScroll
```

--------------------------------------------------------------------------------

---[FILE: IconLabel.hpp]---
Location: obs-studio-master/shared/qt/icon-label/IconLabel.hpp
Signals: N/A
Excerpt (<=80 chars): class IconLabel : public QLabel {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IconLabel
```

--------------------------------------------------------------------------------

---[FILE: CheckBox.hpp]---
Location: obs-studio-master/shared/qt/idian/include/Idian/CheckBox.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace idian {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CheckBox
- namespace idian
```

--------------------------------------------------------------------------------

---[FILE: ComboBox.hpp]---
Location: obs-studio-master/shared/qt/idian/include/Idian/ComboBox.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace idian {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ComboBox
- namespace idian
```

--------------------------------------------------------------------------------

---[FILE: DoubleSpinBox.hpp]---
Location: obs-studio-master/shared/qt/idian/include/Idian/DoubleSpinBox.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace idian {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DoubleSpinBox
- namespace idian
```

--------------------------------------------------------------------------------

---[FILE: Group.hpp]---
Location: obs-studio-master/shared/qt/idian/include/Idian/Group.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace idian {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Group
- namespace idian
```

--------------------------------------------------------------------------------

---[FILE: PropertiesList.hpp]---
Location: obs-studio-master/shared/qt/idian/include/Idian/PropertiesList.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace idian {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenericRow
- PropertiesList
- PropertiesListSpacer
- namespace idian
```

--------------------------------------------------------------------------------

---[FILE: Row.hpp]---
Location: obs-studio-master/shared/qt/idian/include/Idian/Row.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace idian {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GenericRow
- Row
- ExpandButton
- RowFrame
- CollapsibleRow
- namespace idian
```

--------------------------------------------------------------------------------

---[FILE: SpinBox.hpp]---
Location: obs-studio-master/shared/qt/idian/include/Idian/SpinBox.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace idian {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SpinBox
- namespace idian
```

--------------------------------------------------------------------------------

---[FILE: ToggleSwitch.hpp]---
Location: obs-studio-master/shared/qt/idian/include/Idian/ToggleSwitch.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace idian {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ToggleSwitch
- namespace idian
```

--------------------------------------------------------------------------------

---[FILE: Utils.hpp]---
Location: obs-studio-master/shared/qt/idian/include/Idian/Utils.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace idian {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Utils
- namespace idian
```

--------------------------------------------------------------------------------

---[FILE: Row.cpp]---
Location: obs-studio-master/shared/qt/idian/widgets/Row.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace idian {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- namespace idian
```

--------------------------------------------------------------------------------

---[FILE: plain-text-edit.hpp]---
Location: obs-studio-master/shared/qt/plain-text-edit/plain-text-edit.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSPlainTextEdit : public QPlainTextEdit {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSPlainTextEdit
```

--------------------------------------------------------------------------------

---[FILE: slider-ignorewheel.hpp]---
Location: obs-studio-master/shared/qt/slider-ignorewheel/slider-ignorewheel.hpp
Signals: N/A
Excerpt (<=80 chars):  class SliderIgnoreScroll : public QSlider {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SliderIgnoreScroll
- SliderIgnoreClick
```

--------------------------------------------------------------------------------

---[FILE: vertical-scroll-area.hpp]---
Location: obs-studio-master/shared/qt/vertical-scroll-area/vertical-scroll-area.hpp
Signals: N/A
Excerpt (<=80 chars):  class QResizeEvent;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QResizeEvent
- VScrollArea
```

--------------------------------------------------------------------------------

---[FILE: qt-wrappers.cpp]---
Location: obs-studio-master/shared/qt/wrappers/qt-wrappers.cpp
Signals: N/A
Excerpt (<=80 chars):  class QuickThread : public QThread {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QuickThread
```

--------------------------------------------------------------------------------

---[FILE: qt-wrappers.hpp]---
Location: obs-studio-master/shared/qt/wrappers/qt-wrappers.hpp
Signals: N/A
Excerpt (<=80 chars):  class QDataStream;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QDataStream
- QComboBox
- QWidget
- QLayout
- QString
- QLabel
- QToolBar
- OBSMessageBox
```

--------------------------------------------------------------------------------

---[FILE: test_bitstream.c]---
Location: obs-studio-master/test/cmocka/test_bitstream.c
Signals: N/A
Excerpt (<=80 chars):  struct bitstream_reader reader;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bitstream_reader
```

--------------------------------------------------------------------------------

---[FILE: test_os_path.c]---
Location: obs-studio-master/test/cmocka/test_os_path.c
Signals: N/A
Excerpt (<=80 chars):  struct testcase {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- testcase
```

--------------------------------------------------------------------------------

---[FILE: test_serializer.c]---
Location: obs-studio-master/test/cmocka/test_serializer.c
Signals: N/A
Excerpt (<=80 chars):  struct array_output_data output;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- array_output_data
- serializer
```

--------------------------------------------------------------------------------

---[FILE: sync-async-source.c]---
Location: obs-studio-master/test/test-input/sync-async-source.c
Signals: N/A
Excerpt (<=80 chars):  struct async_sync_test {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- async_sync_test
- obs_source_frame
- obs_source_audio
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: sync-audio-buffering.c]---
Location: obs-studio-master/test/test-input/sync-audio-buffering.c
Signals: N/A
Excerpt (<=80 chars):  struct buffering_async_sync_test {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buffering_async_sync_test
- obs_source_frame
- obs_source_audio
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: sync-pair-aud.c]---
Location: obs-studio-master/test/test-input/sync-pair-aud.c
Signals: N/A
Excerpt (<=80 chars):  struct sync_pair_aud {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sync_pair_aud
- obs_source_audio
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: sync-pair-vid.c]---
Location: obs-studio-master/test/test-input/sync-pair-vid.c
Signals: N/A
Excerpt (<=80 chars):  struct sync_pair_vid {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sync_pair_vid
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: test-filter.c]---
Location: obs-studio-master/test/test-input/test-filter.c
Signals: N/A
Excerpt (<=80 chars):  struct test_filter {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_filter
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: test-random.c]---
Location: obs-studio-master/test/test-input/test-random.c
Signals: N/A
Excerpt (<=80 chars):  struct random_tex {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- random_tex
- obs_source_frame
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: test-sinewave.c]---
Location: obs-studio-master/test/test-input/test-sinewave.c
Signals: N/A
Excerpt (<=80 chars):  struct sinewave_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sinewave_data
- obs_source_audio
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: test.cpp]---
Location: obs-studio-master/test/win/test.cpp
Signals: N/A
Excerpt (<=80 chars):  class SourceContext {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceContext
- SceneContext
- DisplayContext
- obs_video_info
- vec2
```

--------------------------------------------------------------------------------

````
