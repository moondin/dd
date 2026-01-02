---
source_txt: fullstack_samples/obs-studio-master
converted_utc: 2025-12-18T10:36:59Z
part: 6
parts_total: 8
---

# FULLSTACK CODE DATABASE SAMPLES obs-studio-master

## Extracted Reusable Patterns (Non-verbatim) (Part 6 of 8)

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

---[FILE: DeckLinkAPI_v8_1.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPI_v8_1.h
Signals: N/A
Excerpt (<=80 chars):  class BMD_PUBLIC IDeckLinkDeckControlStatusCallback_v8_1 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPI_v9_2.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPI_v9_2.h
Signals: N/A
Excerpt (<=80 chars):  class BMD_PUBLIC IDeckLinkInput_v9_2 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPI_v9_9.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/DeckLinkAPI_v9_9.h
Signals: N/A
Excerpt (<=80 chars):  class BMD_PUBLIC IDeckLinkOutput_v9_9 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: LinuxCOM.h]---
Location: obs-studio-master/plugins/decklink/linux/decklink-sdk/LinuxCOM.h
Signals: N/A
Excerpt (<=80 chars):  struct REFIID

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- REFIID
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPI.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPI.h
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
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPIConfiguration.h
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
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPIConfiguration_v10_11.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkConfiguration_v10_11;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkConfiguration_v10_11
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIConfiguration_v10_2.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPIConfiguration_v10_2.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkConfiguration_v10_2;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkConfiguration_v10_2
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIConfiguration_v10_4.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPIConfiguration_v10_4.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkConfiguration_v10_4;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkConfiguration_v10_4
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIConfiguration_v10_5.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPIConfiguration_v10_5.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkConfiguration_v10_5;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkConfiguration_v10_5
- IDeckLinkEncoderConfiguration_v10_5
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIConfiguration_v10_9.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPIConfiguration_v10_9.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkConfiguration_v10_9;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkConfiguration_v10_9
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIDeckControl.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPIDeckControl.h
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
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPIDiscovery.h
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
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPIModes.h
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

---[FILE: DeckLinkAPIStreaming.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPIStreaming.h
Signals: N/A
Excerpt (<=80 chars):  class IBMDStreamingDeviceNotificationCallback;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IBMDStreamingDeviceNotificationCallback
- IBMDStreamingH264InputCallback
- IBMDStreamingDiscovery
- IBMDStreamingVideoEncodingMode
- IBMDStreamingMutableVideoEncodingMode
- IBMDStreamingVideoEncodingModePresetIterator
- IBMDStreamingDeviceInput
- IBMDStreamingH264NALPacket
- IBMDStreamingAudioPacket
- IBMDStreamingMPEG2TSPacket
- IBMDStreamingH264NALParser
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPITypes.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPITypes.h
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
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPIVideoEncoderInput_v10_11.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkEncoderInput_v10_11 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkEncoderInput_v10_11
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIVideoInput_v10_11.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPIVideoInput_v10_11.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkInput_v10_11 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkInput_v10_11
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIVideoInput_v11_4.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPIVideoInput_v11_4.h
Signals: N/A
Excerpt (<=80 chars):  class BMD_PUBLIC IDeckLinkInput_v11_4 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIVideoInput_v11_5_1.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPIVideoInput_v11_5_1.h
Signals: N/A
Excerpt (<=80 chars):  class BMD_PUBLIC IDeckLinkInputCallback_v11_5_1 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIVideoOutput_v10_11.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPIVideoOutput_v10_11.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkOutput_v10_11 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkOutput_v10_11
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPIVideoOutput_v11_4.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPIVideoOutput_v11_4.h
Signals: N/A
Excerpt (<=80 chars):  class BMD_PUBLIC IDeckLinkOutput_v11_4 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPI_v10_11.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPI_v10_11.h
Signals: N/A
Excerpt (<=80 chars):  class BMD_PUBLIC IDeckLinkAttributes_v10_11 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPI_v11_5.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPI_v11_5.h
Signals: N/A
Excerpt (<=80 chars):  class BMD_PUBLIC IDeckLinkVideoFrameMetadataExtensions_v11_5 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BMD_PUBLIC
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPI_v7_1.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPI_v7_1.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkVideoFrame_v7_1;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkVideoFrame_v7_1
- IDeckLinkDisplayModeIterator_v7_1
- IDeckLinkDisplayMode_v7_1
- IDeckLinkVideoInputFrame_v7_1
- IDeckLinkAudioInputPacket_v7_1
- IDeckLinkVideoOutputCallback_v7_1
- IDeckLinkInputCallback_v7_1
- IDeckLinkOutput_v7_1
- IDeckLinkInput_v7_1
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPI_v7_3.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPI_v7_3.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkVideoInputFrame_v7_3;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkVideoInputFrame_v7_3
- IDeckLinkOutput_v7_3
- IDeckLinkInputCallback_v7_3
- IDeckLinkInput_v7_3
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPI_v7_6.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPI_v7_6.h
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
- IDeckLinkCocoaScreenPreviewCallback_v7_6
- IDeckLinkGLScreenPreviewHelper_v7_6
- IDeckLinkVideoConversion_v7_6
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPI_v7_9.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPI_v7_9.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkDeckControl_v7_9;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkDeckControl_v7_9
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPI_v8_0.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPI_v8_0.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLink_v8_0 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLink_v8_0
- IDeckLinkIterator_v8_0
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPI_v8_1.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPI_v8_1.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkDeckControlStatusCallback_v8_1 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkDeckControlStatusCallback_v8_1
- IDeckLinkDeckControl_v8_1
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPI_v9_2.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPI_v9_2.h
Signals: N/A
Excerpt (<=80 chars):  class IDeckLinkInput_v9_2 : public IUnknown

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkInput_v9_2
```

--------------------------------------------------------------------------------

---[FILE: DeckLinkAPI_v9_9.h]---
Location: obs-studio-master/plugins/decklink/mac/decklink-sdk/DeckLinkAPI_v9_9.h
Signals: N/A
Excerpt (<=80 chars): class IDeckLinkOutput_v9_9;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDeckLinkOutput_v9_9
```

--------------------------------------------------------------------------------

---[FILE: color-source.c]---
Location: obs-studio-master/plugins/image-source/color-source.c
Signals: N/A
Excerpt (<=80 chars):  struct color_source {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- color_source
- vec4
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: image-source.c]---
Location: obs-studio-master/plugins/image-source/image-source.c
Signals: N/A
Excerpt (<=80 chars):  struct image_source {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- image_source
- stat
- gs_image_file
```

--------------------------------------------------------------------------------

---[FILE: obs-slideshow-mk2.c]---
Location: obs-studio-master/plugins/image-source/obs-slideshow-mk2.c
Signals: N/A
Excerpt (<=80 chars):  struct image_file_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- image_file_data
- source_data
- active_slides
- deque
- slideshow_data
- slideshow
```

--------------------------------------------------------------------------------

---[FILE: obs-slideshow.c]---
Location: obs-studio-master/plugins/image-source/obs-slideshow.c
Signals: N/A
Excerpt (<=80 chars):  struct image_file_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- image_file_data
- slideshow
- dstr
- os_dirent
```

--------------------------------------------------------------------------------

---[FILE: alsa-input.c]---
Location: obs-studio-master/plugins/linux-alsa/alsa-input.c
Signals: N/A
Excerpt (<=80 chars):  struct alsa_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- alsa_data
- obs_source_info
- obs_source_audio
```

--------------------------------------------------------------------------------

---[FILE: xcomposite-input.c]---
Location: obs-studio-master/plugins/linux-capture/xcomposite-input.c
Signals: N/A
Excerpt (<=80 chars):  struct xcompcap {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- xcompcap
- dstr
- darray
- reg_item
```

--------------------------------------------------------------------------------

---[FILE: xshm-input.c]---
Location: obs-studio-master/plugins/linux-capture/xshm-input.c
Signals: N/A
Excerpt (<=80 chars):  struct xshm_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- xshm_data
- dstr
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: jack-input.c]---
Location: obs-studio-master/plugins/linux-jack/jack-input.c
Signals: N/A
Excerpt (<=80 chars):  struct jack_data *data = (struct jack_data *)vptr;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- jack_data
- dstr
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: jack-wrapper.c]---
Location: obs-studio-master/plugins/linux-jack/jack-wrapper.c
Signals: N/A
Excerpt (<=80 chars):  struct jack_data *data = (struct jack_data *)arg;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- jack_data
- obs_source_audio
```

--------------------------------------------------------------------------------

---[FILE: jack-wrapper.h]---
Location: obs-studio-master/plugins/linux-jack/jack-wrapper.h
Signals: N/A
Excerpt (<=80 chars):  struct jack_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- jack_data
```

--------------------------------------------------------------------------------

---[FILE: camera-portal.c]---
Location: obs-studio-master/plugins/linux-pipewire/camera-portal.c
Signals: N/A
Excerpt (<=80 chars):  struct camera_portal_source {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- camera_portal_source
- obs_pw_video_format
- spa_rectangle
- spa_fraction
- pw_portal_connection
- camera_device
- pw_properties
- pw_proxy
- spa_hook
- pw_node
- pw_node_info
- spa_list
- param
- spa_pod
```

--------------------------------------------------------------------------------

---[FILE: formats.h]---
Location: obs-studio-master/plugins/linux-pipewire/formats.h
Signals: N/A
Excerpt (<=80 chars):  struct obs_pw_video_format {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_pw_video_format
```

--------------------------------------------------------------------------------

---[FILE: pipewire.c]---
Location: obs-studio-master/plugins/linux-pipewire/pipewire.c
Signals: N/A
Excerpt (<=80 chars):  struct spa_meta_videotransform {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- spa_meta_videotransform
- obs_pw_version
- format_info
- _obs_pipewire
- pw_thread_loop
- pw_context
- pw_core
- spa_hook
- pw_registry
- _obs_pipewire_stream
- pw_stream
- spa_source
- spa_video_info
- obs_video_info
- spa_rectangle
```

--------------------------------------------------------------------------------

---[FILE: pipewire.h]---
Location: obs-studio-master/plugins/linux-pipewire/pipewire.h
Signals: N/A
Excerpt (<=80 chars):  struct obs_pipewire_connect_stream_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_pipewire_connect_stream_info
- pw_properties
- pw_registry
```

--------------------------------------------------------------------------------

---[FILE: portal.c]---
Location: obs-studio-master/plugins/linux-pipewire/portal.c
Signals: N/A
Excerpt (<=80 chars):  struct portal_signal_call {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- portal_signal_call
- dstr
```

--------------------------------------------------------------------------------

---[FILE: screencast-portal.c]---
Location: obs-studio-master/plugins/linux-pipewire/screencast-portal.c
Signals: N/A
Excerpt (<=80 chars):  struct screencast_portal_capture {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- screencast_portal_capture
- obs_pipewire_connect_stream_info
```

--------------------------------------------------------------------------------

---[FILE: pulse-input.c]---
Location: obs-studio-master/plugins/linux-pulseaudio/pulse-input.c
Signals: N/A
Excerpt (<=80 chars):  struct pulse_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pulse_data
- obs_source_audio
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: v4l2-controls.c]---
Location: obs-studio-master/plugins/linux-v4l2/v4l2-controls.c
Signals: N/A
Excerpt (<=80 chars):  struct v4l2_control control;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- v4l2_control
- v4l2_querymenu
- v4l2_queryctrl
```

--------------------------------------------------------------------------------

---[FILE: v4l2-decoder.h]---
Location: obs-studio-master/plugins/linux-v4l2/v4l2-decoder.h
Signals: N/A
Excerpt (<=80 chars): struct v4l2_decoder {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- v4l2_decoder
```

--------------------------------------------------------------------------------

---[FILE: v4l2-helpers.c]---
Location: obs-studio-master/plugins/linux-v4l2/v4l2-helpers.c
Signals: N/A
Excerpt (<=80 chars):  struct v4l2_buffer enq;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- v4l2_buffer
- v4l2_requestbuffers
- v4l2_input
- v4l2_format
- v4l2_streamparm
- v4l2_enum_dv_timings
- v4l2_dv_timings
```

--------------------------------------------------------------------------------

---[FILE: v4l2-helpers.h]---
Location: obs-studio-master/plugins/linux-v4l2/v4l2-helpers.h
Signals: N/A
Excerpt (<=80 chars): struct v4l2_mmap_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- v4l2_mmap_info
- v4l2_buffer_data
```

--------------------------------------------------------------------------------

---[FILE: v4l2-input.c]---
Location: obs-studio-master/plugins/linux-v4l2/v4l2-input.c
Signals: N/A
Excerpt (<=80 chars): struct v4l2_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- v4l2_data
- v4l2_decoder
- v4l2_buffer_data
- timeval
- v4l2_buffer
- obs_source_frame
- dirent
- dstr
- v4l2_capability
- v4l2_input
- v4l2_fmtdesc
- v4l2_standard
- v4l2_dv_timings
- v4l2_frmsizeenum
- v4l2_frmivalenum
```

--------------------------------------------------------------------------------

---[FILE: v4l2-output.c]---
Location: obs-studio-master/plugins/linux-v4l2/v4l2-output.c
Signals: N/A
Excerpt (<=80 chars):  struct virtualcam_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- virtualcam_data
- dstr
- v4l2_capability
- v4l2_format
- v4l2_streamparm
- obs_video_info
- video_scale_info
- dirent
- obs_output_info
```

--------------------------------------------------------------------------------

---[FILE: v4l2-udev.c]---
Location: obs-studio-master/plugins/linux-v4l2/v4l2-udev.c
Signals: N/A
Excerpt (<=80 chars):  struct calldata data;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- calldata
- udev
- udev_monitor
- udev_device
- pollfd
```

--------------------------------------------------------------------------------

---[FILE: left-right.hpp]---
Location: obs-studio-master/plugins/mac-avcapture/legacy/left-right.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace left_right {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- namespace left_right
```

--------------------------------------------------------------------------------

---[FILE: scope-guard.hpp]---
Location: obs-studio-master/plugins/mac-avcapture/legacy/scope-guard.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace scope_guard_util {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- namespace scope_guard_util
- namespace detail
```

--------------------------------------------------------------------------------

---[FILE: audio-device-enum.c]---
Location: obs-studio-master/plugins/mac-capture/audio-device-enum.c
Signals: N/A
Excerpt (<=80 chars):  struct add_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- add_data
- device_list
- device_item
```

--------------------------------------------------------------------------------

---[FILE: audio-device-enum.h]---
Location: obs-studio-master/plugins/mac-capture/audio-device-enum.h
Signals: N/A
Excerpt (<=80 chars):  struct device_item {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- device_item
- dstr
- device_list
```

--------------------------------------------------------------------------------

---[FILE: mac-audio.c]---
Location: obs-studio-master/plugins/mac-capture/mac-audio.c
Signals: N/A
Excerpt (<=80 chars):  struct coreaudio_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- coreaudio_data
- device_list
- dstr
- obs_audio_info
- obs_source_audio
```

--------------------------------------------------------------------------------

---[FILE: mac-sck-common.h]---
Location: obs-studio-master/plugins/mac-capture/mac-sck-common.h
Signals: N/A
Excerpt (<=80 chars):  struct API_AVAILABLE(macos(12.5)) screen_capture {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- API_AVAILABLE
```

--------------------------------------------------------------------------------

---[FILE: window-utils.h]---
Location: obs-studio-master/plugins/mac-capture/window-utils.h
Signals: N/A
Excerpt (<=80 chars):  struct cocoa_window {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cocoa_window
```

--------------------------------------------------------------------------------

---[FILE: encoder.c]---
Location: obs-studio-master/plugins/mac-videotoolbox/encoder.c
Signals: N/A
Excerpt (<=80 chars):  struct vt_encoder_type_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- vt_encoder_type_data
- vt_prores_encoder_data
- vt_encoder
- mastering_display_colour_volume
- content_light_level_info
- darray
```

--------------------------------------------------------------------------------

---[FILE: nvafx-load.h]---
Location: obs-studio-master/plugins/nv-filters/nvafx-load.h
Signals: N/A
Excerpt (<=80 chars):  struct win_version_info nto_ver = {0};

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- win_version_info
```

--------------------------------------------------------------------------------

---[FILE: nvidia-audiofx-filter.c]---
Location: obs-studio-master/plugins/nv-filters/nvidia-audiofx-filter.c
Signals: N/A
Excerpt (<=80 chars):  struct nvidia_audio_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nvidia_audio_data
- deque
- obs_audio_data
- resample_info
- nv_audio_info
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: nvidia-videofx-filter.c]---
Location: obs-studio-master/plugins/nv-filters/nvidia-videofx-filter.c
Signals: N/A
Excerpt (<=80 chars): struct nvvfx_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nvvfx_data
- ID3D11Texture2D
- vec4
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: nvvfx-load.h]---
Location: obs-studio-master/plugins/nv-filters/nvvfx-load.h
Signals: N/A
Excerpt (<=80 chars):  struct CUstream_st *stream, NvCVImage *tmp);

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CUstream_st
- win_version_info
```

--------------------------------------------------------------------------------

---[FILE: obs-ffmpeg-audio-encoders.c]---
Location: obs-studio-master/plugins/obs-ffmpeg/obs-ffmpeg-audio-encoders.c
Signals: N/A
Excerpt (<=80 chars):  struct enc_encoder {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- enc_encoder
- dstr
- obs_encoder_info
```

--------------------------------------------------------------------------------

---[FILE: obs-ffmpeg-av1.c]---
Location: obs-studio-master/plugins/obs-ffmpeg/obs-ffmpeg-av1.c
Signals: N/A
Excerpt (<=80 chars):  struct av1_encoder {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- av1_encoder
- ffmpeg_video_encoder
- video_scale_info
- obs_encoder_info
```

--------------------------------------------------------------------------------

---[FILE: obs-ffmpeg-hls-mux.c]---
Location: obs-studio-master/plugins/obs-ffmpeg/obs-ffmpeg-hls-mux.c
Signals: N/A
Excerpt (<=80 chars):  struct ffmpeg_muxer *stream = data;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ffmpeg_muxer
- encoder_packet
- dstr
- deque
- obs_output_info
```

--------------------------------------------------------------------------------

---[FILE: obs-ffmpeg-logging.c]---
Location: obs-studio-master/plugins/obs-ffmpeg/obs-ffmpeg-logging.c
Signals: N/A
Excerpt (<=80 chars):  struct log_context *new_log_context = NULL;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- log_context
```

--------------------------------------------------------------------------------

---[FILE: obs-ffmpeg-mpegts.c]---
Location: obs-studio-master/plugins/obs-ffmpeg/obs-ffmpeg-mpegts.c
Signals: N/A
Excerpt (<=80 chars):  struct encoder_packet packet = {.type = OBS_ENCODER_AUDIO, .timebase_den = 1...

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- encoder_packet
- obs_video_info
- obs_audio_info
- dstr
- ffmpeg_output
- ffmpeg_data
- ffmpeg_cfg
- mpegts_cmd
```

--------------------------------------------------------------------------------

---[FILE: obs-ffmpeg-mux.c]---
Location: obs-studio-master/plugins/obs-ffmpeg/obs-ffmpeg-mux.c
Signals: N/A
Excerpt (<=80 chars):  struct encoder_packet pkt;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- encoder_packet
- ffmpeg_muxer
- dstr
- win_version_info
- ffm_packet_info
```

--------------------------------------------------------------------------------

---[FILE: obs-ffmpeg-mux.h]---
Location: obs-studio-master/plugins/obs-ffmpeg/obs-ffmpeg-mux.h
Signals: N/A
Excerpt (<=80 chars):  struct ffmpeg_muxer {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ffmpeg_muxer
- dstr
- deque
```

--------------------------------------------------------------------------------

---[FILE: obs-ffmpeg-nvenc.c]---
Location: obs-studio-master/plugins/obs-ffmpeg/obs-ffmpeg-nvenc.c
Signals: N/A
Excerpt (<=80 chars):  struct nvenc_encoder {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nvenc_encoder
- ffmpeg_video_encoder
- video_scale_info
- dstr
- obs_encoder_info
```

--------------------------------------------------------------------------------

---[FILE: obs-ffmpeg-openh264.c]---
Location: obs-studio-master/plugins/obs-ffmpeg/obs-ffmpeg-openh264.c
Signals: N/A
Excerpt (<=80 chars):  struct openh264_encoder {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- openh264_encoder
- ffmpeg_video_encoder
- video_scale_info
- obs_encoder_info
```

--------------------------------------------------------------------------------

---[FILE: obs-ffmpeg-output.c]---
Location: obs-studio-master/plugins/obs-ffmpeg/obs-ffmpeg-output.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_video_info ovi;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_video_info
- obs_audio_info
- dstr
- ffmpeg_output
- ffmpeg_data
- audio_data
- ffmpeg_cfg
- audio_convert_info
```

--------------------------------------------------------------------------------

---[FILE: obs-ffmpeg-output.h]---
Location: obs-studio-master/plugins/obs-ffmpeg/obs-ffmpeg-output.h
Signals: N/A
Excerpt (<=80 chars):  struct ffmpeg_cfg {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ffmpeg_cfg
- ffmpeg_audio_info
- ffmpeg_data
- SwsContext
- deque
- ffmpeg_output
- mpegts_cmd
```

--------------------------------------------------------------------------------

---[FILE: obs-ffmpeg-rist.h]---
Location: obs-studio-master/plugins/obs-ffmpeg/obs-ffmpeg-rist.h
Signals: N/A
Excerpt (<=80 chars):  struct rist_logging_settings logging_settings;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- rist_logging_settings
- rist_peer_config
- rist_peer
- rist_ctx
- rist_stats_sender_peer
- rist_data_block
```

--------------------------------------------------------------------------------

---[FILE: obs-ffmpeg-source.c]---
Location: obs-studio-master/plugins/obs-ffmpeg/obs-ffmpeg-source.c
Signals: N/A
Excerpt (<=80 chars):  struct ffmpeg_source {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ffmpeg_source
- dstr
- mp_media_info
```

--------------------------------------------------------------------------------

---[FILE: obs-ffmpeg-srt.h]---
Location: obs-studio-master/plugins/obs-ffmpeg/obs-ffmpeg-srt.h
Signals: N/A
Excerpt (<=80 chars):  struct srt_err {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- srt_err
- linger
- addrinfo
- sockaddr_in
- timeb
- timespec
```

--------------------------------------------------------------------------------

---[FILE: obs-ffmpeg-url.h]---
Location: obs-studio-master/plugins/obs-ffmpeg/obs-ffmpeg-url.h
Signals: N/A
Excerpt (<=80 chars): namespace srt_logging {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LogFA
- namespace srt_logging
- namespace LogLevel
```

--------------------------------------------------------------------------------

---[FILE: obs-ffmpeg-vaapi.c]---
Location: obs-studio-master/plugins/obs-ffmpeg/obs-ffmpeg-vaapi.c
Signals: N/A
Excerpt (<=80 chars):  struct vaapi_surface {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- vaapi_surface
- vaapi_encoder
- video_scale_info
- obs_options
- obs_option
- pci_filter
- pci_dev
- pci_access
- os_dirent
```

--------------------------------------------------------------------------------

---[FILE: obs-ffmpeg-video-encoders.c]---
Location: obs-studio-master/plugins/obs-ffmpeg/obs-ffmpeg-video-encoders.c
Signals: N/A
Excerpt (<=80 chars):  struct dstr error_message = {0};

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dstr
- obs_options
- obs_option
```

--------------------------------------------------------------------------------

---[FILE: obs-ffmpeg-video-encoders.h]---
Location: obs-studio-master/plugins/obs-ffmpeg/obs-ffmpeg-video-encoders.h
Signals: N/A
Excerpt (<=80 chars):  struct ffmpeg_video_encoder {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ffmpeg_video_encoder
- encoder_packet
```

--------------------------------------------------------------------------------

---[FILE: obs-ffmpeg.c]---
Location: obs-studio-master/plugins/obs-ffmpeg/obs-ffmpeg.c
Signals: N/A
Excerpt (<=80 chars):  struct os_dirent *dirent;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- os_dirent
```

--------------------------------------------------------------------------------

---[FILE: texture-amf.cpp]---
Location: obs-studio-master/plugins/obs-ffmpeg/texture-amf.cpp
Signals: N/A
Excerpt (<=80 chars):  struct amf_error {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- amf_error
- handle_tex
- adapter_caps
- codec_level_entry
- amf_base
- amf_texencode
- amf_fallback
- roi_params
- video_scale_info
- obs_options
- obs_encoder_info
```

--------------------------------------------------------------------------------

---[FILE: vaapi-utils.c]---
Location: obs-studio-master/plugins/obs-ffmpeg/vaapi-utils.c
Signals: N/A
Excerpt (<=80 chars):  struct dstr m;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dstr
```

--------------------------------------------------------------------------------

---[FILE: ffmpeg-mux.c]---
Location: obs-studio-master/plugins/obs-ffmpeg/ffmpeg-mux/ffmpeg-mux.c
Signals: N/A
Excerpt (<=80 chars):  struct resize_buf {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- resize_buf
- main_params
- dstr
- audio_params
- header
- audio_info
- io_header
- io_buffer
- deque
- ffmpeg_mux
```

--------------------------------------------------------------------------------

---[FILE: ffmpeg-mux.h]---
Location: obs-studio-master/plugins/obs-ffmpeg/ffmpeg-mux/ffmpeg-mux.h
Signals: N/A
Excerpt (<=80 chars):  struct ffm_packet_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ffm_packet_info
```

--------------------------------------------------------------------------------

---[FILE: obs-amf-test.cpp]---
Location: obs-studio-master/plugins/obs-ffmpeg/obs-amf-test/obs-amf-test.cpp
Signals: N/A
Excerpt (<=80 chars):  struct adapter_caps {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- adapter_caps
```

--------------------------------------------------------------------------------

---[FILE: async-delay-filter.c]---
Location: obs-studio-master/plugins/obs-filters/async-delay-filter.c
Signals: N/A
Excerpt (<=80 chars):  struct async_delay_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- async_delay_data
- deque
- obs_audio_data
- obs_source_frame
- obs_audio_info
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: chroma-key-filter.c]---
Location: obs-studio-master/plugins/obs-filters/chroma-key-filter.c
Signals: N/A
Excerpt (<=80 chars):  struct chroma_key_filter_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- chroma_key_filter_data
- vec4
- vec2
- chroma_key_filter_data_v2
```

--------------------------------------------------------------------------------

---[FILE: color-correction-filter.c]---
Location: obs-studio-master/plugins/obs-filters/color-correction-filter.c
Signals: N/A
Excerpt (<=80 chars):  struct color_correction_filter_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- color_correction_filter_data
- matrix4
- vec3
- color_correction_filter_data_v2
```

--------------------------------------------------------------------------------

---[FILE: color-grade-filter.c]---
Location: obs-studio-master/plugins/obs-filters/color-grade-filter.c
Signals: N/A
Excerpt (<=80 chars):  struct lut_filter_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- lut_filter_data
- vec3
- half
- dstr
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: color-key-filter.c]---
Location: obs-studio-master/plugins/obs-filters/color-key-filter.c
Signals: N/A
Excerpt (<=80 chars):  struct color_key_filter_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- color_key_filter_data
- vec4
- color_key_filter_data_v2
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: compressor-filter.c]---
Location: obs-studio-master/plugins/obs-filters/compressor-filter.c
Signals: N/A
Excerpt (<=80 chars):  struct compressor_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- compressor_data
- deque
- sidechain_prop_info
- obs_source_info
```

--------------------------------------------------------------------------------

---[FILE: crop-filter.c]---
Location: obs-studio-master/plugins/obs-filters/crop-filter.c
Signals: N/A
Excerpt (<=80 chars):  struct crop_filter_data {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- crop_filter_data
- vec2
- obs_source_info
```

--------------------------------------------------------------------------------

````
