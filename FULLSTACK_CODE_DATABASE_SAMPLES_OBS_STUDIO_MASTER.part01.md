---
source_txt: fullstack_samples/obs-studio-master
converted_utc: 2025-12-18T10:36:59Z
part: 1
parts_total: 8
---

# FULLSTACK CODE DATABASE SAMPLES obs-studio-master

## Extracted Reusable Patterns (Non-verbatim) (Part 1 of 8)

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

---[FILE: check-jsonschema.py]---
Location: obs-studio-master/.github/scripts/utils.py/check-jsonschema.py
Signals: N/A
Excerpt (<=80 chars):  def discover_schema_file(filename: str) -> tuple[str | None, Any]:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- discover_schema_file
- validate_json_files
- main
```

--------------------------------------------------------------------------------

---[FILE: check-services.py]---
Location: obs-studio-master/.github/scripts/utils.py/check-services.py
Signals: N/A
Excerpt (<=80 chars):  def get_last_artifact():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- get_last_artifact
- find_people_to_blame
- set_output
```

--------------------------------------------------------------------------------

---[FILE: format-manifest.py]---
Location: obs-studio-master/build-aux/format-manifest.py
Signals: N/A
Excerpt (<=80 chars):  def main() -> int:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- main
```

--------------------------------------------------------------------------------

---[FILE: buildspec_common.cmake]---
Location: obs-studio-master/cmake/common/buildspec_common.cmake
Signals: N/A
Excerpt (<=80 chars): function(_check_deps_version version)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _check_deps_version
- _check_dependencies
```

--------------------------------------------------------------------------------

---[FILE: helpers_common.cmake]---
Location: obs-studio-master/cmake/common/helpers_common.cmake
Signals: N/A
Excerpt (<=80 chars): function(message_configuration)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- message_configuration
- target_enable_feature
- target_disable_feature
- target_disable
- _handle_generator_expression_dependency
- find_dependencies
- find_qt_plugins
- target_export
- check_uuid
- add_obs_plugin
```

--------------------------------------------------------------------------------

---[FILE: FindFFmpeg.cmake]---
Location: obs-studio-master/cmake/finders/FindFFmpeg.cmake
Signals: N/A
Excerpt (<=80 chars): macro(FFmpeg_find_component component)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FFmpeg_find_component
- FFmpeg_find_dll
- FFmpeg_check_version
- FFmpeg_set_soname
```

--------------------------------------------------------------------------------

---[FILE: Findjansson.cmake]---
Location: obs-studio-master/cmake/finders/Findjansson.cmake
Signals: N/A
Excerpt (<=80 chars): macro(jansson_set_soname)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- jansson_set_soname
```

--------------------------------------------------------------------------------

---[FILE: FindLibrist.cmake]---
Location: obs-studio-master/cmake/finders/FindLibrist.cmake
Signals: N/A
Excerpt (<=80 chars): macro(Librist_set_soname)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Librist_set_soname
```

--------------------------------------------------------------------------------

---[FILE: FindLibrnnoise.cmake]---
Location: obs-studio-master/cmake/finders/FindLibrnnoise.cmake
Signals: N/A
Excerpt (<=80 chars): macro(librnnoise_set_soname)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- librnnoise_set_soname
```

--------------------------------------------------------------------------------

---[FILE: FindLibspeexdsp.cmake]---
Location: obs-studio-master/cmake/finders/FindLibspeexdsp.cmake
Signals: N/A
Excerpt (<=80 chars): macro(libspeexdsp_set_soname)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- libspeexdsp_set_soname
```

--------------------------------------------------------------------------------

---[FILE: FindLibsrt.cmake]---
Location: obs-studio-master/cmake/finders/FindLibsrt.cmake
Signals: N/A
Excerpt (<=80 chars): macro(libsrt_set_soname)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- libsrt_set_soname
```

--------------------------------------------------------------------------------

---[FILE: FindLibx264.cmake]---
Location: obs-studio-master/cmake/finders/FindLibx264.cmake
Signals: N/A
Excerpt (<=80 chars): macro(Libx264_set_soname)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Libx264_set_soname
- Libx264_find_dll
```

--------------------------------------------------------------------------------

---[FILE: FindLuajit.cmake]---
Location: obs-studio-master/cmake/finders/FindLuajit.cmake
Signals: N/A
Excerpt (<=80 chars): macro(Luajit_set_soname)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Luajit_set_soname
```

--------------------------------------------------------------------------------

---[FILE: FindMbedTLS.cmake]---
Location: obs-studio-master/cmake/finders/FindMbedTLS.cmake
Signals: N/A
Excerpt (<=80 chars): macro(MbedTLS_set_soname component)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MbedTLS_set_soname
```

--------------------------------------------------------------------------------

---[FILE: Findqrcodegencpp.cmake]---
Location: obs-studio-master/cmake/finders/Findqrcodegencpp.cmake
Signals: N/A
Excerpt (<=80 chars): macro(qrcodegencpp_set_soname)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- qrcodegencpp_set_soname
- qrcodegencpp_find_dll
```

--------------------------------------------------------------------------------

---[FILE: helpers.cmake]---
Location: obs-studio-master/cmake/linux/helpers.cmake
Signals: N/A
Excerpt (<=80 chars): function(set_target_properties_obs target)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- set_target_properties_obs
- target_install_resources
- target_add_resource
- target_export
```

--------------------------------------------------------------------------------

---[FILE: buildspec.cmake]---
Location: obs-studio-master/cmake/macos/buildspec.cmake
Signals: N/A
Excerpt (<=80 chars): function(_check_dependencies_macos)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _check_dependencies_macos
```

--------------------------------------------------------------------------------

---[FILE: compilerconfig.cmake]---
Location: obs-studio-master/cmake/macos/compilerconfig.cmake
Signals: N/A
Excerpt (<=80 chars): function(check_sdk_requirements)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- check_sdk_requirements
```

--------------------------------------------------------------------------------

---[FILE: helpers.cmake]---
Location: obs-studio-master/cmake/macos/helpers.cmake
Signals: N/A
Excerpt (<=80 chars): function(set_target_xcode_properties target)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- set_target_xcode_properties
- set_target_properties_obs
- _check_entitlements
- _add_entitlements
- target_export
- target_install_resources
- target_add_resource
- _bundle_dependencies
```

--------------------------------------------------------------------------------

---[FILE: architecture.cmake]---
Location: obs-studio-master/cmake/windows/architecture.cmake
Signals: N/A
Excerpt (<=80 chars):  macro(target_disable_feature)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- target_disable_feature
- target_disable
- target_add_resource
- target_export
- set_target_properties_obs
- check_uuid
```

--------------------------------------------------------------------------------

---[FILE: buildspec.cmake]---
Location: obs-studio-master/cmake/windows/buildspec.cmake
Signals: N/A
Excerpt (<=80 chars): function(_handle_qt_cross_compile architecture)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _handle_qt_cross_compile
- _check_dependencies_windows
```

--------------------------------------------------------------------------------

---[FILE: helpers.cmake]---
Location: obs-studio-master/cmake/windows/helpers.cmake
Signals: N/A
Excerpt (<=80 chars): function(set_target_properties_obs target)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- set_target_properties_obs
- _target_install_obs
- target_export
- target_install_resources
- target_add_resource
- _bundle_dependencies
- _check_library_location
```

--------------------------------------------------------------------------------

---[FILE: idlfilehelper.cmake]---
Location: obs-studio-master/cmake/windows/idlfilehelper.cmake
Signals: N/A
Excerpt (<=80 chars): function(target_add_idl_files target)

```cmake
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- target_add_idl_files
```

--------------------------------------------------------------------------------

---[FILE: eglplatform.h]---
Location: obs-studio-master/deps/glad/include/EGL/eglplatform.h
Signals: N/A
Excerpt (<=80 chars):  struct ANativeWindow;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ANativeWindow
- egl_native_pixmap_t
```

--------------------------------------------------------------------------------

---[FILE: glad.h]---
Location: obs-studio-master/deps/glad/include/glad/glad.h
Signals: N/A
Excerpt (<=80 chars): struct _cl_context;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _cl_context
- _cl_event
```

--------------------------------------------------------------------------------

---[FILE: glad_egl.h]---
Location: obs-studio-master/deps/glad/include/glad/glad_egl.h
Signals: N/A
Excerpt (<=80 chars): struct AHardwareBuffer;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AHardwareBuffer
- wl_buffer
- wl_display
- wl_resource
- EGLClientPixmapHI
```

--------------------------------------------------------------------------------

---[FILE: glad_wgl.h]---
Location: obs-studio-master/deps/glad/include/glad/glad_wgl.h
Signals: N/A
Excerpt (<=80 chars):  struct _GPU_DEVICE {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _GPU_DEVICE
```

--------------------------------------------------------------------------------

---[FILE: glad.c]---
Location: obs-studio-master/deps/glad/src/glad.c
Signals: N/A
Excerpt (<=80 chars):  struct gladGLversionStruct GLVersion;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gladGLversionStruct
```

--------------------------------------------------------------------------------

---[FILE: json11.cpp]---
Location: obs-studio-master/deps/json11/json11.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace json11 {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NullStruct
- Value
- JsonDouble
- JsonInt
- JsonBoolean
- JsonString
- JsonArray
- JsonObject
- JsonNull
- Statics
- JsonParser
- namespace json11
```

--------------------------------------------------------------------------------

---[FILE: json11.hpp]---
Location: obs-studio-master/deps/json11/json11.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace json11 {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JsonValue
- Json
- namespace json11
```

--------------------------------------------------------------------------------

---[FILE: dvtcc.h]---
Location: obs-studio-master/deps/libcaption/caption/dvtcc.h
Signals: N/A
Excerpt (<=80 chars): struct dtvcc_packet_t {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dtvcc_packet_t
```

--------------------------------------------------------------------------------

---[FILE: mpeg.h]---
Location: obs-studio-master/deps/libcaption/caption/mpeg.h
Signals: N/A
Excerpt (<=80 chars):  struct _sei_message_t* next;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _sei_message_t
```

--------------------------------------------------------------------------------

---[FILE: vtt.h]---
Location: obs-studio-master/deps/libcaption/caption/vtt.h
Signals: N/A
Excerpt (<=80 chars):  struct _vtt_block_t* next;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _vtt_block_t
```

--------------------------------------------------------------------------------

---[FILE: dvtcc.c]---
Location: obs-studio-master/deps/libcaption/src/dvtcc.c
Signals: N/A
Excerpt (<=80 chars):  struct dtvcc_packet_t* dtvcc_packet_start(uint8_t cc_data1, uint8_t cc_data2)

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dtvcc_packet_t
```

--------------------------------------------------------------------------------

---[FILE: mpeg.c]---
Location: obs-studio-master/deps/libcaption/src/mpeg.c
Signals: N/A
Excerpt (<=80 chars):  struct _sei_message_t* msg = (struct _sei_message_t*)malloc(sizeof(struct _s...

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _sei_message_t
```

--------------------------------------------------------------------------------

---[FILE: implement.h]---
Location: obs-studio-master/deps/w32-pthreads/implement.h
Signals: N/A
Excerpt (<=80 chars):  struct ptw32_thread_t_

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ptw32_thread_t_
- pthread_attr_t_
- sched_param
- sem_t_
- pthread_mutex_t_
- ptw32_robust_node_t_
- pthread_mutexattr_t_
- pthread_spinlock_t_
- ptw32_mcs_node_t_
- pthread_barrier_t_
- pthread_barrierattr_t_
- pthread_key_t_
- ThreadParms
- pthread_cond_t_
- pthread_condattr_t_
- pthread_rwlock_t_
```

--------------------------------------------------------------------------------

---[FILE: pthread.h]---
Location: obs-studio-master/deps/w32-pthreads/pthread.h
Signals: N/A
Excerpt (<=80 chars): struct timespec {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- timespec
- pthread_once_t_
- ptw32_cleanup_t
- PThreadCleanup
- sched_param
- ptw32_exception
- ptw32_exception_cancel
- ptw32_exception_exit
```

--------------------------------------------------------------------------------

---[FILE: pthread_attr_getschedparam.c]---
Location: obs-studio-master/deps/w32-pthreads/pthread_attr_getschedparam.c
Signals: N/A
Excerpt (<=80 chars):  struct sched_param *param)

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sched_param
```

--------------------------------------------------------------------------------

---[FILE: pthread_getschedparam.c]---
Location: obs-studio-master/deps/w32-pthreads/pthread_getschedparam.c
Signals: N/A
Excerpt (<=80 chars):  struct sched_param *param)

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sched_param
```

--------------------------------------------------------------------------------

---[FILE: ptw32_OLL_lock.c]---
Location: obs-studio-master/deps/w32-pthreads/ptw32_OLL_lock.c
Signals: N/A
Excerpt (<=80 chars):  struct {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ptw32_oll_snziRoot_t_
- ptw32_oll_queryResult_t_
- ptw32_oll_snziNode_t_
- ptw32_oll_ticket_t_
- ptw32_oll_csnzi_t_
- ptw32_foll_node_t_
- ptw32_foll_local_t_
- ptw32_foll_rwlock_t_
- ptw32_srwl_rwlock_t_
- ptw32_srwl_node_t_
- ptw32_srwl_local_t_
```

--------------------------------------------------------------------------------

---[FILE: ptw32_relmillisecs.c]---
Location: obs-studio-master/deps/w32-pthreads/ptw32_relmillisecs.c
Signals: N/A
Excerpt (<=80 chars):  struct timespec currSysTime;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- timespec
- __timeb64
- _timeb
```

--------------------------------------------------------------------------------

---[FILE: sched.h]---
Location: obs-studio-master/deps/w32-pthreads/sched.h
Signals: N/A
Excerpt (<=80 chars):  struct sched_param {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sched_param
```

--------------------------------------------------------------------------------

---[FILE: benchtest.h]---
Location: obs-studio-master/deps/w32-pthreads/tests/benchtest.h
Signals: N/A
Excerpt (<=80 chars):  struct old_mutex_t_ {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- old_mutex_t_
- old_mutexattr_t_
```

--------------------------------------------------------------------------------

---[FILE: cancel1.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/cancel1.c
Signals: N/A
Excerpt (<=80 chars): struct bag_t_ {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bag_t_
```

--------------------------------------------------------------------------------

---[FILE: cancel2.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/cancel2.c
Signals: N/A
Excerpt (<=80 chars): struct bag_t_ {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bag_t_
```

--------------------------------------------------------------------------------

---[FILE: cancel3.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/cancel3.c
Signals: N/A
Excerpt (<=80 chars): struct bag_t_

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bag_t_
```

--------------------------------------------------------------------------------

---[FILE: cancel4.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/cancel4.c
Signals: N/A
Excerpt (<=80 chars): struct bag_t_ {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bag_t_
```

--------------------------------------------------------------------------------

---[FILE: cancel5.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/cancel5.c
Signals: N/A
Excerpt (<=80 chars): struct bag_t_

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bag_t_
```

--------------------------------------------------------------------------------

---[FILE: cancel6a.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/cancel6a.c
Signals: N/A
Excerpt (<=80 chars): struct bag_t_ {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bag_t_
```

--------------------------------------------------------------------------------

---[FILE: cancel6d.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/cancel6d.c
Signals: N/A
Excerpt (<=80 chars): struct bag_t_ {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bag_t_
```

--------------------------------------------------------------------------------

---[FILE: cancel7.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/cancel7.c
Signals: N/A
Excerpt (<=80 chars): struct bag_t_ {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bag_t_
```

--------------------------------------------------------------------------------

---[FILE: cancel8.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/cancel8.c
Signals: N/A
Excerpt (<=80 chars): struct bag_t_ {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bag_t_
```

--------------------------------------------------------------------------------

---[FILE: cancel9.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/cancel9.c
Signals: N/A
Excerpt (<=80 chars):  struct sockaddr_in serverAddress;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sockaddr_in
```

--------------------------------------------------------------------------------

---[FILE: cleanup0.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/cleanup0.c
Signals: N/A
Excerpt (<=80 chars): struct bag_t_ {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bag_t_
```

--------------------------------------------------------------------------------

---[FILE: cleanup1.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/cleanup1.c
Signals: N/A
Excerpt (<=80 chars): struct bag_t_ {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bag_t_
```

--------------------------------------------------------------------------------

---[FILE: cleanup2.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/cleanup2.c
Signals: N/A
Excerpt (<=80 chars): struct bag_t_ {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bag_t_
```

--------------------------------------------------------------------------------

---[FILE: cleanup3.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/cleanup3.c
Signals: N/A
Excerpt (<=80 chars): struct bag_t_ {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bag_t_
```

--------------------------------------------------------------------------------

---[FILE: condvar2.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/condvar2.c
Signals: N/A
Excerpt (<=80 chars):  struct timespec abstime = { 0, 0 };

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- timespec
```

--------------------------------------------------------------------------------

---[FILE: condvar3.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/condvar3.c
Signals: N/A
Excerpt (<=80 chars):  struct timespec abstime = { 0, 0 };

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- timespec
```

--------------------------------------------------------------------------------

---[FILE: condvar3_3.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/condvar3_3.c
Signals: N/A
Excerpt (<=80 chars):  struct timespec abstime = { 0, 0 };

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- timespec
```

--------------------------------------------------------------------------------

---[FILE: condvar4.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/condvar4.c
Signals: N/A
Excerpt (<=80 chars):  struct cvthing_t_ {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cvthing_t_
- timespec
```

--------------------------------------------------------------------------------

---[FILE: condvar5.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/condvar5.c
Signals: N/A
Excerpt (<=80 chars):  struct cvthing_t_ {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cvthing_t_
- timespec
```

--------------------------------------------------------------------------------

---[FILE: condvar6.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/condvar6.c
Signals: N/A
Excerpt (<=80 chars): struct bag_t_ {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bag_t_
- cvthing_t_
```

--------------------------------------------------------------------------------

---[FILE: condvar7.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/condvar7.c
Signals: N/A
Excerpt (<=80 chars): struct bag_t_ {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bag_t_
- cvthing_t_
```

--------------------------------------------------------------------------------

---[FILE: condvar8.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/condvar8.c
Signals: N/A
Excerpt (<=80 chars): struct bag_t_ {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bag_t_
- cvthing_t_
```

--------------------------------------------------------------------------------

---[FILE: condvar9.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/condvar9.c
Signals: N/A
Excerpt (<=80 chars): struct bag_t_ {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bag_t_
- cvthing_t_
```

--------------------------------------------------------------------------------

---[FILE: delay1.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/delay1.c
Signals: N/A
Excerpt (<=80 chars):  struct timespec interval = {1L, 500000000L};

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- timespec
```

--------------------------------------------------------------------------------

---[FILE: delay2.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/delay2.c
Signals: N/A
Excerpt (<=80 chars):  struct timespec interval = {5, 500000000L};

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- timespec
```

--------------------------------------------------------------------------------

---[FILE: errno1.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/errno1.c
Signals: N/A
Excerpt (<=80 chars): struct bag_t_ {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bag_t_
```

--------------------------------------------------------------------------------

---[FILE: exit4.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/exit4.c
Signals: N/A
Excerpt (<=80 chars): struct bag_t_ {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bag_t_
```

--------------------------------------------------------------------------------

---[FILE: exit5.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/exit5.c
Signals: N/A
Excerpt (<=80 chars): struct bag_t_ {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- bag_t_
```

--------------------------------------------------------------------------------

---[FILE: eyal1.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/eyal1.c
Signals: N/A
Excerpt (<=80 chars):  struct thread_control {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- thread_control
```

--------------------------------------------------------------------------------

---[FILE: inherit1.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/inherit1.c
Signals: N/A
Excerpt (<=80 chars):  struct sched_param param;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sched_param
```

--------------------------------------------------------------------------------

---[FILE: mutex8.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/mutex8.c
Signals: N/A
Excerpt (<=80 chars):  struct timespec abstime = { 0, 0 };

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- timespec
```

--------------------------------------------------------------------------------

---[FILE: mutex8e.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/mutex8e.c
Signals: N/A
Excerpt (<=80 chars):  struct timespec abstime = { 0, 0 };

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- timespec
```

--------------------------------------------------------------------------------

---[FILE: mutex8n.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/mutex8n.c
Signals: N/A
Excerpt (<=80 chars):  struct timespec abstime = { 0, 0 };

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- timespec
```

--------------------------------------------------------------------------------

---[FILE: mutex8r.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/mutex8r.c
Signals: N/A
Excerpt (<=80 chars):  struct timespec abstime = { 0, 0 };

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- timespec
```

--------------------------------------------------------------------------------

---[FILE: once4.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/once4.c
Signals: N/A
Excerpt (<=80 chars):  struct sched_param param;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sched_param
```

--------------------------------------------------------------------------------

---[FILE: priority1.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/priority1.c
Signals: N/A
Excerpt (<=80 chars):  struct sched_param param;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sched_param
```

--------------------------------------------------------------------------------

---[FILE: priority2.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/priority2.c
Signals: N/A
Excerpt (<=80 chars):  struct sched_param param;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sched_param
```

--------------------------------------------------------------------------------

---[FILE: rwlock2_t.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/rwlock2_t.c
Signals: N/A
Excerpt (<=80 chars):  struct timespec abstime = { 0, 0 };

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- timespec
```

--------------------------------------------------------------------------------

---[FILE: rwlock3_t.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/rwlock3_t.c
Signals: N/A
Excerpt (<=80 chars):  struct timespec abstime = { 0, 0 };

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- timespec
```

--------------------------------------------------------------------------------

---[FILE: rwlock4_t.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/rwlock4_t.c
Signals: N/A
Excerpt (<=80 chars):  struct timespec abstime = { 0, 0 };

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- timespec
```

--------------------------------------------------------------------------------

---[FILE: rwlock5_t.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/rwlock5_t.c
Signals: N/A
Excerpt (<=80 chars):  struct timespec abstime = { 0, 0 };

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- timespec
```

--------------------------------------------------------------------------------

---[FILE: rwlock6_t.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/rwlock6_t.c
Signals: N/A
Excerpt (<=80 chars):  struct timespec abstime = { 0, 0 };

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- timespec
```

--------------------------------------------------------------------------------

---[FILE: rwlock6_t2.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/rwlock6_t2.c
Signals: N/A
Excerpt (<=80 chars): struct timespec abstime = { 0, 0 };

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- timespec
```

--------------------------------------------------------------------------------

---[FILE: stress1.c]---
Location: obs-studio-master/deps/w32-pthreads/tests/stress1.c
Signals: N/A
Excerpt (<=80 chars): struct timespec *

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- timespec
```

--------------------------------------------------------------------------------

---[FILE: obs-main.cpp]---
Location: obs-studio-master/frontend/obs-main.cpp
Signals: N/A
Excerpt (<=80 chars):  struct tm tstruct;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tm
- os_dirent
- sigaction
```

--------------------------------------------------------------------------------

---[FILE: OBSApp.cpp]---
Location: obs-studio-master/frontend/OBSApp.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tm
```

--------------------------------------------------------------------------------

---[FILE: OBSApp.hpp]---
Location: obs-studio-master/frontend/OBSApp.hpp
Signals: N/A
Excerpt (<=80 chars):  class QFileSystemWatcher;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QFileSystemWatcher
- QSocketNotifier
- CrashHandler
- PluginManager
- UpdateBranch
- OBSApp
- namespace OBS
```

--------------------------------------------------------------------------------

---[FILE: OBSApp_Themes.cpp]---
Location: obs-studio-master/frontend/OBSApp_Themes.cpp
Signals: N/A
Excerpt (<=80 chars):  struct CFParser {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CFParser
```

--------------------------------------------------------------------------------

---[FILE: OBSStudioAPI.hpp]---
Location: obs-studio-master/frontend/OBSStudioAPI.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSBasic;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSBasic
- OBSStudioAPI
```

--------------------------------------------------------------------------------

---[FILE: obs-frontend-api.cpp]---
Location: obs-studio-master/frontend/api/obs-frontend-api.cpp
Signals: N/A
Excerpt (<=80 chars):  struct obs_frontend_source_list sources = {};

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_frontend_source_list
```

--------------------------------------------------------------------------------

---[FILE: obs-frontend-api.h]---
Location: obs-studio-master/frontend/api/obs-frontend-api.h
Signals: N/A
Excerpt (<=80 chars):  struct config_data;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- config_data
- obs_data
- obs_frontend_source_list
- obs_frontend_canvas_list
```

--------------------------------------------------------------------------------

---[FILE: obs-frontend-internal.hpp]---
Location: obs-studio-master/frontend/api/obs-frontend-internal.hpp
Signals: N/A
Excerpt (<=80 chars):  struct obs_frontend_callbacks {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_frontend_callbacks
```

--------------------------------------------------------------------------------

---[FILE: AbsoluteSlider.hpp]---
Location: obs-studio-master/frontend/components/AbsoluteSlider.hpp
Signals: N/A
Excerpt (<=80 chars):  class AbsoluteSlider : public SliderIgnoreScroll {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AbsoluteSlider
```

--------------------------------------------------------------------------------

---[FILE: ApplicationAudioCaptureToolbar.hpp]---
Location: obs-studio-master/frontend/components/ApplicationAudioCaptureToolbar.hpp
Signals: N/A
Excerpt (<=80 chars):  class ApplicationAudioCaptureToolbar : public ComboSelectToolbar {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ApplicationAudioCaptureToolbar
```

--------------------------------------------------------------------------------

---[FILE: AudioCaptureToolbar.hpp]---
Location: obs-studio-master/frontend/components/AudioCaptureToolbar.hpp
Signals: N/A
Excerpt (<=80 chars):  class AudioCaptureToolbar : public ComboSelectToolbar {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AudioCaptureToolbar
```

--------------------------------------------------------------------------------

---[FILE: BalanceSlider.hpp]---
Location: obs-studio-master/frontend/components/BalanceSlider.hpp
Signals: N/A
Excerpt (<=80 chars):  class BalanceSlider : public QSlider {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BalanceSlider
```

--------------------------------------------------------------------------------

---[FILE: BrowserToolbar.hpp]---
Location: obs-studio-master/frontend/components/BrowserToolbar.hpp
Signals: N/A
Excerpt (<=80 chars):  class Ui_BrowserSourceToolbar;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Ui_BrowserSourceToolbar
- BrowserToolbar
```

--------------------------------------------------------------------------------

---[FILE: ClickableLabel.hpp]---
Location: obs-studio-master/frontend/components/ClickableLabel.hpp
Signals: N/A
Excerpt (<=80 chars):  class ClickableLabel : public QLabel {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ClickableLabel
```

--------------------------------------------------------------------------------

---[FILE: ColorSourceToolbar.hpp]---
Location: obs-studio-master/frontend/components/ColorSourceToolbar.hpp
Signals: N/A
Excerpt (<=80 chars):  class Ui_ColorSourceToolbar;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Ui_ColorSourceToolbar
- ColorSourceToolbar
```

--------------------------------------------------------------------------------

---[FILE: ComboSelectToolbar.hpp]---
Location: obs-studio-master/frontend/components/ComboSelectToolbar.hpp
Signals: N/A
Excerpt (<=80 chars):  class Ui_DeviceSelectToolbar;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Ui_DeviceSelectToolbar
- ComboSelectToolbar
```

--------------------------------------------------------------------------------

---[FILE: DelButton.hpp]---
Location: obs-studio-master/frontend/components/DelButton.hpp
Signals: N/A
Excerpt (<=80 chars):  class DelButton : public QPushButton {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DelButton
```

--------------------------------------------------------------------------------

---[FILE: DeviceCaptureToolbar.hpp]---
Location: obs-studio-master/frontend/components/DeviceCaptureToolbar.hpp
Signals: N/A
Excerpt (<=80 chars):  class Ui_DeviceSelectToolbar;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Ui_DeviceSelectToolbar
- DeviceCaptureToolbar
```

--------------------------------------------------------------------------------

---[FILE: DisplayCaptureToolbar.hpp]---
Location: obs-studio-master/frontend/components/DisplayCaptureToolbar.hpp
Signals: N/A
Excerpt (<=80 chars):  class DisplayCaptureToolbar : public ComboSelectToolbar {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DisplayCaptureToolbar
```

--------------------------------------------------------------------------------

---[FILE: EditWidget.hpp]---
Location: obs-studio-master/frontend/components/EditWidget.hpp
Signals: N/A
Excerpt (<=80 chars):  class QPersistentModelIndex;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QPersistentModelIndex
- EditWidget
```

--------------------------------------------------------------------------------

---[FILE: FocusList.hpp]---
Location: obs-studio-master/frontend/components/FocusList.hpp
Signals: N/A
Excerpt (<=80 chars):  class FocusList : public QListWidget {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FocusList
```

--------------------------------------------------------------------------------

---[FILE: GameCaptureToolbar.hpp]---
Location: obs-studio-master/frontend/components/GameCaptureToolbar.hpp
Signals: N/A
Excerpt (<=80 chars):  class Ui_GameCaptureToolbar;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Ui_GameCaptureToolbar
- GameCaptureToolbar
```

--------------------------------------------------------------------------------

---[FILE: HScrollArea.hpp]---
Location: obs-studio-master/frontend/components/HScrollArea.hpp
Signals: N/A
Excerpt (<=80 chars):  class QResizeEvent;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QResizeEvent
- HScrollArea
```

--------------------------------------------------------------------------------

---[FILE: ImageSourceToolbar.hpp]---
Location: obs-studio-master/frontend/components/ImageSourceToolbar.hpp
Signals: N/A
Excerpt (<=80 chars):  class Ui_ImageSourceToolbar;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Ui_ImageSourceToolbar
- ImageSourceToolbar
```

--------------------------------------------------------------------------------

---[FILE: MediaControls.hpp]---
Location: obs-studio-master/frontend/components/MediaControls.hpp
Signals: N/A
Excerpt (<=80 chars):  class Ui_MediaControls;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Ui_MediaControls
- MediaControls
```

--------------------------------------------------------------------------------

---[FILE: MenuButton.hpp]---
Location: obs-studio-master/frontend/components/MenuButton.hpp
Signals: N/A
Excerpt (<=80 chars):  class MenuButton : public QPushButton {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MenuButton
```

--------------------------------------------------------------------------------

---[FILE: Multiview.cpp]---
Location: obs-studio-master/frontend/components/Multiview.cpp
Signals: N/A
Excerpt (<=80 chars):  struct obs_video_info ovi;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_video_info
- obs_frontend_source_list
```

--------------------------------------------------------------------------------

````
