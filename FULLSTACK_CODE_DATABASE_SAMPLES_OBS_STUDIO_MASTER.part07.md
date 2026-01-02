---
source_txt: fullstack_samples/obs-studio-master
converted_utc: 2025-12-18T10:36:59Z
part: 7
parts_total: 8
---

# FULLSTACK CODE DATABASE SAMPLES obs-studio-master

## Extracted Reusable Patterns (Non-verbatim) (Part 7 of 8)

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

---[FILE: eq-filter.c]---
Location: obs-studio-master/plugins/obs-filters/eq-filter.c
Signals: N/A
Excerpt (<=80 chars):  struct eq_channel_state {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- eq_channel_state
- eq_data
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: expander-filter.c]---
Location: obs-studio-master/plugins/obs-filters/expander-filter.c
Signals: N/A
Excerpt (<=80 chars):  struct expander_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- expander_data
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: gain-filter.c]---
Location: obs-studio-master/plugins/obs-filters/gain-filter.c
Signals: N/A
Excerpt (<=80 chars):  struct gain_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gain_data
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: gpu-delay.c]---
Location: obs-studio-master/plugins/obs-filters/gpu-delay.c
Signals: N/A
Excerpt (<=80 chars):  struct frame {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- frame
- gpu_delay_filter_data
- deque
- obs_video_info
- vec4
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: hdr-tonemap-filter.c]---
Location: obs-studio-master/plugins/obs-filters/hdr-tonemap-filter.c
Signals: N/A
Excerpt (<=80 chars):  struct hdr_tonemap_filter_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hdr_tonemap_filter_data
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: invert-audio-polarity.c]---
Location: obs-studio-master/plugins/obs-filters/invert-audio-polarity.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_source_info invert_polarity_filter = {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: limiter-filter.c]---
Location: obs-studio-master/plugins/obs-filters/limiter-filter.c
Signals: N/A
Excerpt (<=80 chars):  struct limiter_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- limiter_data
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: luma-key-filter.c]---
Location: obs-studio-master/plugins/obs-filters/luma-key-filter.c
Signals: N/A
Excerpt (<=80 chars):  struct luma_key_filter_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- luma_key_filter_data
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: mask-filter.c]---
Location: obs-studio-master/plugins/obs-filters/mask-filter.c
Signals: N/A
Excerpt (<=80 chars):  struct mask_filter_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mask_filter_data
- vec4
- stat
- dstr
- vec2
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: noise-gate-filter.c]---
Location: obs-studio-master/plugins/obs-filters/noise-gate-filter.c
Signals: N/A
Excerpt (<=80 chars):  struct noise_gate_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- noise_gate_data
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: noise-suppress-filter.c]---
Location: obs-studio-master/plugins/obs-filters/noise-suppress-filter.c
Signals: N/A
Excerpt (<=80 chars):  struct noise_suppress_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- noise_suppress_data
- deque
- obs_audio_data
- resample_info
- ng_audio_info
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: nvafx-load.h]---
Location: obs-studio-master/plugins/obs-filters/nvafx-load.h
Signals: N/A
Excerpt (<=80 chars):  struct win_version_info nto_ver = {0};

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- win_version_info
```

--------------------------------------------------------------------------------

---[FILE: scale-filter.c]---
Location: obs-studio-master/plugins/obs-filters/scale-filter.c
Signals: N/A
Excerpt (<=80 chars):  struct scale_filter_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- scale_filter_data
- vec2
- obs_video_info
- gs_sampler_info
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: scroll-filter.c]---
Location: obs-studio-master/plugins/obs-filters/scroll-filter.c
Signals: N/A
Excerpt (<=80 chars):  struct scroll_filter_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- scroll_filter_data
- vec2
- gs_sampler_info
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: sharpness-filter.c]---
Location: obs-studio-master/plugins/obs-filters/sharpness-filter.c
Signals: N/A
Excerpt (<=80 chars):  struct sharpness_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sharpness_data
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: denoise.c]---
Location: obs-studio-master/plugins/obs-filters/rnnoise/src/denoise.c
Signals: N/A
Excerpt (<=80 chars):  struct DenoiseState {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DenoiseState
```

--------------------------------------------------------------------------------

---[FILE: rnn_data.h]---
Location: obs-studio-master/plugins/obs-filters/rnnoise/src/rnn_data.h
Signals: N/A
Excerpt (<=80 chars):  struct RNNModel {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RNNModel
- RNNState
```

--------------------------------------------------------------------------------

---[FILE: obs-libfdk.c]---
Location: obs-studio-master/plugins/obs-libfdk/obs-libfdk.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_encoder_info obs_libfdk_encoder = {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_encoder_info
```

--------------------------------------------------------------------------------

---[FILE: cuda-helpers.c]---
Location: obs-studio-master/plugins/obs-nvenc/cuda-helpers.c
Signals: N/A
Excerpt (<=80 chars):  struct dstr message = {0};

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dstr
```

--------------------------------------------------------------------------------

---[FILE: cuda-helpers.h]---
Location: obs-studio-master/plugins/obs-nvenc/cuda-helpers.h
Signals: N/A
Excerpt (<=80 chars):  struct nvenc_data;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nvenc_data
```

--------------------------------------------------------------------------------

---[FILE: nvenc-compat.c]---
Location: obs-studio-master/plugins/obs-nvenc/nvenc-compat.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_encoder_info compat_h264_nvenc_info = {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_encoder_info
```

--------------------------------------------------------------------------------

---[FILE: nvenc-cuda.c]---
Location: obs-studio-master/plugins/obs-nvenc/nvenc-cuda.c
Signals: N/A
Excerpt (<=80 chars):  struct nv_cuda_surface buf;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nv_cuda_surface
- nvenc_data
- nv_bitstream
```

--------------------------------------------------------------------------------

---[FILE: nvenc-d3d11.c]---
Location: obs-studio-master/plugins/obs-nvenc/nvenc-d3d11.c
Signals: N/A
Excerpt (<=80 chars):  struct nv_texture texture;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nv_texture
- handle_tex
- encoder_packet
- nvenc_data
- nv_bitstream
```

--------------------------------------------------------------------------------

---[FILE: nvenc-helpers.c]---
Location: obs-studio-master/plugins/obs-nvenc/nvenc-helpers.c
Signals: N/A
Excerpt (<=80 chars):  struct dstr message = {0};

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dstr
- encoder_caps
```

--------------------------------------------------------------------------------

---[FILE: nvenc-helpers.h]---
Location: obs-studio-master/plugins/obs-nvenc/nvenc-helpers.h
Signals: N/A
Excerpt (<=80 chars):  struct encoder_caps {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- encoder_caps
```

--------------------------------------------------------------------------------

---[FILE: nvenc-internal.h]---
Location: obs-studio-master/plugins/obs-nvenc/nvenc-internal.h
Signals: N/A
Excerpt (<=80 chars):  struct nvenc_properties {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nvenc_properties
- obs_options
- nvenc_data
- deque
- handle_tex
- nv_bitstream
- nv_cuda_surface
- nv_texture
- encoder_packet
```

--------------------------------------------------------------------------------

---[FILE: nvenc-opengl.c]---
Location: obs-studio-master/plugins/obs-nvenc/nvenc-opengl.c
Signals: N/A
Excerpt (<=80 chars):  struct handle_tex *ht = &enc->input_textures.array[idx];

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handle_tex
- encoder_packet
- nvenc_data
- nv_cuda_surface
- nv_bitstream
```

--------------------------------------------------------------------------------

---[FILE: nvenc-opts-parser.c]---
Location: obs-studio-master/plugins/obs-nvenc/nvenc-opts-parser.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_option *opt = &enc->props.opts.options[idx];

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_option
```

--------------------------------------------------------------------------------

---[FILE: nvenc-properties.c]---
Location: obs-studio-master/plugins/obs-nvenc/nvenc-properties.c
Signals: N/A
Excerpt (<=80 chars):  struct encoder_caps *caps = get_encoder_caps(codec);

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- encoder_caps
```

--------------------------------------------------------------------------------

---[FILE: nvenc.c]---
Location: obs-studio-master/plugins/obs-nvenc/nvenc.c
Signals: N/A
Excerpt (<=80 chars):  struct nvenc_data *enc = data;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nvenc_data
- dstr
- nv_bitstream
- nv_texture
- nv_cuda_surface
- roi_params
- encoder_packet
- obs_encoder_info
```

--------------------------------------------------------------------------------

---[FILE: obs-nvenc-test.cpp]---
Location: obs-studio-master/plugins/obs-nvenc/obs-nvenc-test/obs-nvenc-test.cpp
Signals: N/A
Excerpt (<=80 chars):  struct device_info {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- device_info
- NVML
- CUDACtx
- NVSession
```

--------------------------------------------------------------------------------

---[FILE: flv-mux.c]---
Location: obs-studio-master/plugins/obs-outputs/flv-mux.c
Signals: N/A
Excerpt (<=80 chars):  struct dstr encoder_name = {0};

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dstr
- array_output_data
- serializer
```

--------------------------------------------------------------------------------

---[FILE: flv-output.c]---
Location: obs-studio-master/plugins/obs-outputs/flv-output.c
Signals: N/A
Excerpt (<=80 chars):  struct flv_output {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- flv_output
- dstr
- encoder_packet
- obs_output_info
```

--------------------------------------------------------------------------------

---[FILE: mp4-mux-internal.h]---
Location: obs-studio-master/plugins/obs-outputs/mp4-mux-internal.h
Signals: N/A
Excerpt (<=80 chars):  struct chunk {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- chunk
- sample_delta
- sample_offset
- fragment_sample
- mp4_track
- deque
- mp4_mux
- serializer
```

--------------------------------------------------------------------------------

---[FILE: mp4-mux.c]---
Location: obs-studio-master/plugins/obs-outputs/mp4-mux.c
Signals: N/A
Excerpt (<=80 chars):  struct serializer *s = mux->serializer;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- serializer
- mp4_track
- encoder_packet
```

--------------------------------------------------------------------------------

---[FILE: mp4-mux.h]---
Location: obs-studio-master/plugins/obs-outputs/mp4-mux.h
Signals: N/A
Excerpt (<=80 chars):  struct mp4_mux;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mp4_mux
```

--------------------------------------------------------------------------------

---[FILE: mp4-output.c]---
Location: obs-studio-master/plugins/obs-outputs/mp4-output.c
Signals: N/A
Excerpt (<=80 chars):  struct chapter {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- chapter
- mp4_output
- dstr
- serializer
- mp4_mux
- deque
- obs_options
- obs_option
```

--------------------------------------------------------------------------------

---[FILE: net-if.c]---
Location: obs-studio-master/plugins/obs-outputs/net-if.c
Signals: N/A
Excerpt (<=80 chars):  struct netif_saddr_item item;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- netif_saddr_item
- dstr
- sockaddr_storage
- ifaddrs
```

--------------------------------------------------------------------------------

---[FILE: net-if.h]---
Location: obs-studio-master/plugins/obs-outputs/net-if.h
Signals: N/A
Excerpt (<=80 chars):  struct netif_saddr_item {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- netif_saddr_item
- netif_saddr_data
```

--------------------------------------------------------------------------------

---[FILE: null-output.c]---
Location: obs-studio-master/plugins/obs-outputs/null-output.c
Signals: N/A
Excerpt (<=80 chars):  struct null_output {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- null_output
- obs_output_info
```

--------------------------------------------------------------------------------

---[FILE: rtmp-av1.c]---
Location: obs-studio-master/plugins/obs-outputs/rtmp-av1.c
Signals: N/A
Excerpt (<=80 chars):  struct array_output_data output;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- array_output_data
- serializer
```

--------------------------------------------------------------------------------

---[FILE: rtmp-av1.h]---
Location: obs-studio-master/plugins/obs-outputs/rtmp-av1.h
Signals: N/A
Excerpt (<=80 chars):  struct encoder_packet;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- encoder_packet
```

--------------------------------------------------------------------------------

---[FILE: rtmp-hevc.c]---
Location: obs-studio-master/plugins/obs-outputs/rtmp-hevc.c
Signals: N/A
Excerpt (<=80 chars):  struct array_output_data nalUnitData;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- array_output_data
- serializer
```

--------------------------------------------------------------------------------

---[FILE: rtmp-stream.c]---
Location: obs-studio-master/plugins/obs-outputs/rtmp-stream.c
Signals: N/A
Excerpt (<=80 chars):  struct encoder_packet packet;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- encoder_packet
- rtmp_stream
- droptest_info
- dbr_frame
- dstr
- deque
```

--------------------------------------------------------------------------------

---[FILE: rtmp-stream.h]---
Location: obs-studio-master/plugins/obs-outputs/rtmp-stream.h
Signals: N/A
Excerpt (<=80 chars):  struct droptest_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- droptest_info
- dbr_frame
- rtmp_stream
- deque
- dstr
```

--------------------------------------------------------------------------------

---[FILE: rtmp-windows.c]---
Location: obs-studio-master/plugins/obs-outputs/rtmp-windows.c
Signals: N/A
Excerpt (<=80 chars):  struct rtmp_stream *stream = data;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- rtmp_stream
```

--------------------------------------------------------------------------------

---[FILE: amf.h]---
Location: obs-studio-master/plugins/obs-outputs/librtmp/amf.h
Signals: N/A
Excerpt (<=80 chars):  struct AMFObjectProperty;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AMFObjectProperty
```

--------------------------------------------------------------------------------

---[FILE: hashswf.c]---
Location: obs-studio-master/plugins/obs-outputs/librtmp/hashswf.c
Signals: N/A
Excerpt (<=80 chars):  struct sockaddr_in sa;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sockaddr_in
- hostent
- info
- tm
- HTTP_ctx
```

--------------------------------------------------------------------------------

---[FILE: http.h]---
Location: obs-studio-master/plugins/obs-outputs/librtmp/http.h
Signals: N/A
Excerpt (<=80 chars):  struct HTTP_ctx

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HTTP_ctx
```

--------------------------------------------------------------------------------

---[FILE: rtmp.c]---
Location: obs-studio-master/plugins/obs-outputs/librtmp/rtmp.c
Signals: N/A
Excerpt (<=80 chars):  struct tms t;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tms
- addrinfo
- happy_eyeballs_ctx
- sockaddr_storage
- linger
```

--------------------------------------------------------------------------------

---[FILE: rtmp.h]---
Location: obs-studio-master/plugins/obs-outputs/librtmp/rtmp.h
Signals: N/A
Excerpt (<=80 chars):  struct sockaddr_storage sb_addr; /* address of remote */

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sockaddr_storage
- sockaddr
```

--------------------------------------------------------------------------------

---[FILE: common_directx11.cpp]---
Location: obs-studio-master/plugins/obs-qsv11/common_directx11.cpp
Signals: N/A
Excerpt (<=80 chars):  struct encoder_texture *ptex = (struct encoder_texture *)tex;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- encoder_texture
```

--------------------------------------------------------------------------------

---[FILE: common_utils.cpp]---
Location: obs-studio-master/plugins/obs-qsv11/common_utils.cpp
Signals: N/A
Excerpt (<=80 chars):  struct adapter_info adapters[MAX_ADAPTERS] = {0};

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- adapter_info
```

--------------------------------------------------------------------------------

---[FILE: common_utils.h]---
Location: obs-studio-master/plugins/obs-qsv11/common_utils.h
Signals: N/A
Excerpt (<=80 chars):  struct adapter_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- adapter_info
```

--------------------------------------------------------------------------------

---[FILE: common_utils_linux.cpp]---
Location: obs-studio-master/plugins/obs-qsv11/common_utils_linux.cpp
Signals: N/A
Excerpt (<=80 chars):  struct linux_data {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- linux_data
- surface_info
- encoder_texture
- get_drm_device_params
- vaapi_device
- adapter_info
```

--------------------------------------------------------------------------------

---[FILE: common_utils_windows.cpp]---
Location: obs-studio-master/plugins/obs-qsv11/common_utils_windows.cpp
Signals: N/A
Excerpt (<=80 chars):  struct dstr *cmd = (struct dstr *)param;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dstr
- adapter_info
```

--------------------------------------------------------------------------------

---[FILE: obs-qsv11-plugin-main.c]---
Location: obs-studio-master/plugins/obs-qsv11/obs-qsv11-plugin-main.c
Signals: N/A
Excerpt (<=80 chars):  struct adapter_info *adapter = &adapters[i];

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- adapter_info
```

--------------------------------------------------------------------------------

---[FILE: obs-qsv11.c]---
Location: obs-studio-master/plugins/obs-qsv11/obs-qsv11.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_qsv {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_qsv
- obs_video_info
- darray
- obs_encoder_info
```

--------------------------------------------------------------------------------

---[FILE: QSV_Encoder.h]---
Location: obs-studio-master/plugins/obs-qsv11/QSV_Encoder.h
Signals: N/A
Excerpt (<=80 chars):  struct qsv_rate_control_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- qsv_rate_control_info
```

--------------------------------------------------------------------------------

---[FILE: QSV_Encoder_Internal.h]---
Location: obs-studio-master/plugins/obs-qsv11/QSV_Encoder_Internal.h
Signals: N/A
Excerpt (<=80 chars):  class QSV_Encoder_Internal {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QSV_Encoder_Internal
```

--------------------------------------------------------------------------------

---[FILE: obs-qsv-test.cpp]---
Location: obs-studio-master/plugins/obs-qsv11/obs-qsv-test/obs-qsv-test.cpp
Signals: N/A
Excerpt (<=80 chars):  struct adapter_caps {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- adapter_caps
```

--------------------------------------------------------------------------------

---[FILE: obs-text.cpp]---
Location: obs-studio-master/plugins/obs-text/gdiplus/obs-text.cpp
Signals: N/A
Excerpt (<=80 chars):  struct TextSource {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TextSource
- stat
```

--------------------------------------------------------------------------------

---[FILE: transition-cut.c]---
Location: obs-studio-master/plugins/obs-transitions/transition-cut.c
Signals: N/A
Excerpt (<=80 chars):  struct cut_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cut_info
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: transition-fade-to-color.c]---
Location: obs-studio-master/plugins/obs-transitions/transition-fade-to-color.c
Signals: N/A
Excerpt (<=80 chars):  struct fade_to_color_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- fade_to_color_info
- vec4
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: transition-fade.c]---
Location: obs-studio-master/plugins/obs-transitions/transition-fade.c
Signals: N/A
Excerpt (<=80 chars):  struct fade_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- fade_info
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: transition-luma-wipe.c]---
Location: obs-studio-master/plugins/obs-transitions/transition-luma-wipe.c
Signals: N/A
Excerpt (<=80 chars):  struct luma_wipe_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- luma_wipe_info
- dstr
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: transition-slide.c]---
Location: obs-studio-master/plugins/obs-transitions/transition-slide.c
Signals: N/A
Excerpt (<=80 chars):  struct slide_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- slide_info
- vec2
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: transition-stinger.c]---
Location: obs-studio-master/plugins/obs-transitions/transition-stinger.c
Signals: N/A
Excerpt (<=80 chars):  struct stinger_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- stinger_info
- dstr
- vec4
- obs_source_audio_mix
```

--------------------------------------------------------------------------------

---[FILE: transition-swipe.c]---
Location: obs-studio-master/plugins/obs-transitions/transition-swipe.c
Signals: N/A
Excerpt (<=80 chars):  struct swipe_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- swipe_info
- vec2
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: obs-vst.cpp]---
Location: obs-studio-master/plugins/obs-vst/obs-vst.cpp
Signals: N/A
Excerpt (<=80 chars):  struct obs_source_info vst_filter = {};

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: EditorWidget.h]---
Location: obs-studio-master/plugins/obs-vst/headers/EditorWidget.h
Signals: N/A
Excerpt (<=80 chars):  class VSTPlugin;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VSTPlugin
- VstRect
- EditorWidget
```

--------------------------------------------------------------------------------

---[FILE: VSTPlugin.h]---
Location: obs-studio-master/plugins/obs-vst/headers/VSTPlugin.h
Signals: N/A
Excerpt (<=80 chars):  class EditorWidget;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EditorWidget
- VSTPlugin
```

--------------------------------------------------------------------------------

---[FILE: aeffectx.h]---
Location: obs-studio-master/plugins/obs-vst/vst_header/aeffectx.h
Signals: N/A
Excerpt (<=80 chars):  class RemoteVstPlugin;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoteVstPlugin
- VstMidiEvent
- VstEvent
- VstEvents
- VstParameterProperties
- AEffect
- VstTimeInfo
- VstPatchChunkInfo
```

--------------------------------------------------------------------------------

---[FILE: whip-output.cpp]---
Location: obs-studio-master/plugins/obs-webrtc/whip-output.cpp
Signals: N/A
Excerpt (<=80 chars):  struct curl_slist *headers = NULL;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- curl_slist
- dstr
- obs_output_info
```

--------------------------------------------------------------------------------

---[FILE: whip-output.h]---
Location: obs-studio-master/plugins/obs-webrtc/whip-output.h
Signals: N/A
Excerpt (<=80 chars):  struct videoLayerState {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- videoLayerState
- WHIPOutput
```

--------------------------------------------------------------------------------

---[FILE: whip-service.cpp]---
Location: obs-studio-master/plugins/obs-webrtc/whip-service.cpp
Signals: N/A
Excerpt (<=80 chars):  struct obs_service_info info = {};

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_service_info
```

--------------------------------------------------------------------------------

---[FILE: whip-service.h]---
Location: obs-studio-master/plugins/obs-webrtc/whip-service.h
Signals: N/A
Excerpt (<=80 chars):  struct WHIPService {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WHIPService
```

--------------------------------------------------------------------------------

---[FILE: obs-x264-test.c]---
Location: obs-studio-master/plugins/obs-x264/obs-x264-test.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_options options;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_options
```

--------------------------------------------------------------------------------

---[FILE: obs-x264.c]---
Location: obs-studio-master/plugins/obs-x264/obs-x264.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_x264 {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_x264
- video_scale_info
- obs_options
- roi_params
- obs_encoder_info
```

--------------------------------------------------------------------------------

---[FILE: oss-input.c]---
Location: obs-studio-master/plugins/oss-audio/oss-input.c
Signals: N/A
Excerpt (<=80 chars): struct oss_input_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- oss_input_data
- rate_option
- pollfd
- obs_source_audio
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: rtmp-common.c]---
Location: obs-studio-master/plugins/rtmp-services/rtmp-common.c
Signals: N/A
Excerpt (<=80 chars):  struct rtmp_common {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- rtmp_common
- obs_service_resolution
- ingest
- dstr
- showroom_ingest
```

--------------------------------------------------------------------------------

---[FILE: rtmp-custom.c]---
Location: obs-studio-master/plugins/rtmp-services/rtmp-custom.c
Signals: N/A
Excerpt (<=80 chars):  struct rtmp_custom {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- rtmp_custom
- obs_service_info
```

--------------------------------------------------------------------------------

---[FILE: amazon-ivs.c]---
Location: obs-studio-master/plugins/rtmp-services/service-specific/amazon-ivs.c
Signals: N/A
Excerpt (<=80 chars):  struct ingest def = {.name = bstrdup("Default"),

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ingest
```

--------------------------------------------------------------------------------

---[FILE: dacast.c]---
Location: obs-studio-master/plugins/rtmp-services/service-specific/dacast.c
Signals: N/A
Excerpt (<=80 chars):  struct dacast_ingest_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dacast_ingest_info
- dacast_ingest
- dstr
```

--------------------------------------------------------------------------------

---[FILE: dacast.h]---
Location: obs-studio-master/plugins/rtmp-services/service-specific/dacast.h
Signals: N/A
Excerpt (<=80 chars):  struct dacast_ingest {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dacast_ingest
```

--------------------------------------------------------------------------------

---[FILE: nimotv.c]---
Location: obs-studio-master/plugins/rtmp-services/service-specific/nimotv.c
Signals: N/A
Excerpt (<=80 chars):  struct nimotv_mem_struct {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nimotv_mem_struct
- dstr
```

--------------------------------------------------------------------------------

---[FILE: service-ingest.c]---
Location: obs-studio-master/plugins/rtmp-services/service-specific/service-ingest.c
Signals: N/A
Excerpt (<=80 chars):  struct ingest *ingest = si->cur_ingests.array + i;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ingest
- dstr
- service_ingests
```

--------------------------------------------------------------------------------

---[FILE: service-ingest.h]---
Location: obs-studio-master/plugins/rtmp-services/service-specific/service-ingest.h
Signals: N/A
Excerpt (<=80 chars):  struct ingest {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ingest
- service_ingests
```

--------------------------------------------------------------------------------

---[FILE: showroom.c]---
Location: obs-studio-master/plugins/rtmp-services/service-specific/showroom.c
Signals: N/A
Excerpt (<=80 chars):  struct showroom_ingest_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- showroom_ingest_info
- showroom_ingest
- dstr
```

--------------------------------------------------------------------------------

---[FILE: showroom.h]---
Location: obs-studio-master/plugins/rtmp-services/service-specific/showroom.h
Signals: N/A
Excerpt (<=80 chars):  struct showroom_ingest {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- showroom_ingest
```

--------------------------------------------------------------------------------

---[FILE: twitch.c]---
Location: obs-studio-master/plugins/rtmp-services/service-specific/twitch.c
Signals: N/A
Excerpt (<=80 chars):  struct ingest twitch_ingest(size_t idx)

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ingest
```

--------------------------------------------------------------------------------

---[FILE: sndio-input.c]---
Location: obs-studio-master/plugins/sndio/sndio-input.c
Signals: N/A
Excerpt (<=80 chars):  struct sndio_thr_data *thrdata = attr;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sndio_thr_data
- pollfd
- sio_par
- obs_source_audio
- sndio_data
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: sndio-input.h]---
Location: obs-studio-master/plugins/sndio/sndio-input.h
Signals: N/A
Excerpt (<=80 chars):  struct sndio_thr_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sndio_thr_data
- obs_source_audio
- sio_hdl
- sio_par
- sndio_data
```

--------------------------------------------------------------------------------

---[FILE: find-font-iconv.c]---
Location: obs-studio-master/plugins/text-freetype2/find-font-iconv.c
Signals: N/A
Excerpt (<=80 chars):  struct mac_font_mapping {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mac_font_mapping
```

--------------------------------------------------------------------------------

---[FILE: find-font-windows.c]---
Location: obs-studio-master/plugins/text-freetype2/find-font-windows.c
Signals: N/A
Excerpt (<=80 chars):  struct mac_font_mapping {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mac_font_mapping
- dstr
```

--------------------------------------------------------------------------------

---[FILE: find-font.c]---
Location: obs-studio-master/plugins/text-freetype2/find-font.c
Signals: N/A
Excerpt (<=80 chars):  struct font_path_info *info = &font_list.array[i];

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- font_path_info
- serializer
- dstr
```

--------------------------------------------------------------------------------

---[FILE: find-font.h]---
Location: obs-studio-master/plugins/text-freetype2/find-font.h
Signals: N/A
Excerpt (<=80 chars):  struct font_path_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- font_path_info
```

--------------------------------------------------------------------------------

---[FILE: obs-convenience.c]---
Location: obs-studio-master/plugins/text-freetype2/obs-convenience.c
Signals: N/A
Excerpt (<=80 chars):  struct gs_vb_data *vrect = NULL;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_vb_data
```

--------------------------------------------------------------------------------

---[FILE: text-freetype2.c]---
Location: obs-studio-master/plugins/text-freetype2/text-freetype2.c
Signals: N/A
Excerpt (<=80 chars):  struct ft2_source *srcdata = data;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ft2_source
```

--------------------------------------------------------------------------------

---[FILE: text-freetype2.h]---
Location: obs-studio-master/plugins/text-freetype2/text-freetype2.h
Signals: N/A
Excerpt (<=80 chars):  struct glyph_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- glyph_info
- ft2_source
```

--------------------------------------------------------------------------------

---[FILE: text-functionality.c]---
Location: obs-studio-master/plugins/text-freetype2/text-functionality.c
Signals: N/A
Excerpt (<=80 chars):  struct gs_vb_data *vdata = gs_vertexbuffer_get_data(srcdata->vbuf);

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gs_vb_data
- vec2
- glyph_info
- stat
```

--------------------------------------------------------------------------------

---[FILE: CMakeLists.txt]---
Location: obs-studio-master/plugins/vlc-video/CMakeLists.txt
Signals: N/A
Excerpt (<=80 chars): cmake_minimum_required(VERSION 3.28...3.30)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- check_vlc_path
```

--------------------------------------------------------------------------------

---[FILE: vlc-video-source.c]---
Location: obs-studio-master/plugins/vlc-video/vlc-video-source.c
Signals: N/A
Excerpt (<=80 chars):  struct media_file_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- media_file_data
- vlc_source
- obs_source_frame
- obs_source_audio
- obs_audio_info
- dstr
```

--------------------------------------------------------------------------------

---[FILE: audio-helpers.c]---
Location: obs-studio-master/plugins/win-capture/audio-helpers.c
Signals: N/A
Excerpt (<=80 chars):  struct dstr name = {0};

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dstr
```

--------------------------------------------------------------------------------

---[FILE: compat-helpers.c]---
Location: obs-studio-master/plugins/win-capture/compat-helpers.c
Signals: N/A
Excerpt (<=80 chars): struct compat_result *check_compatibility(const char *win_title, const char *...

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- compat_result
- dstr
```

--------------------------------------------------------------------------------

---[FILE: compat-helpers.h]---
Location: obs-studio-master/plugins/win-capture/compat-helpers.h
Signals: N/A
Excerpt (<=80 chars):  struct compat_result {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- compat_result
```

--------------------------------------------------------------------------------

---[FILE: cursor-capture.c]---
Location: obs-studio-master/plugins/win-capture/cursor-capture.c
Signals: N/A
Excerpt (<=80 chars):  struct cached_cursor cc;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cached_cursor
```

--------------------------------------------------------------------------------

---[FILE: cursor-capture.h]---
Location: obs-studio-master/plugins/win-capture/cursor-capture.h
Signals: N/A
Excerpt (<=80 chars):  struct cached_cursor {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cached_cursor
- cursor_data
```

--------------------------------------------------------------------------------

---[FILE: dc-capture.h]---
Location: obs-studio-master/plugins/win-capture/dc-capture.h
Signals: N/A
Excerpt (<=80 chars):  struct dc_capture {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dc_capture
```

--------------------------------------------------------------------------------

---[FILE: duplicator-monitor-capture.c]---
Location: obs-studio-master/plugins/win-capture/duplicator-monitor-capture.c
Signals: N/A
Excerpt (<=80 chars):  struct winrt_exports {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- winrt_exports
- duplicator_capture
- cursor_data
- winrt_capture
- duplicator_monitor_info
- gs_monitor_info
```

--------------------------------------------------------------------------------

---[FILE: game-capture-file-init.c]---
Location: obs-studio-master/plugins/win-capture/game-capture-file-init.c
Signals: N/A
Excerpt (<=80 chars):  struct win_version_info ver_src = {0};

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- win_version_info
```

--------------------------------------------------------------------------------

````
