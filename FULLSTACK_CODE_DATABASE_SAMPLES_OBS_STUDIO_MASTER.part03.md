---
source_txt: fullstack_samples/obs-studio-master
converted_utc: 2025-12-18T10:36:59Z
part: 3
parts_total: 8
---

# FULLSTACK CODE DATABASE SAMPLES obs-studio-master

## Extracted Reusable Patterns (Non-verbatim) (Part 3 of 8)

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

---[FILE: FFmpegCodec.hpp]---
Location: obs-studio-master/frontend/utility/FFmpegCodec.hpp
Signals: N/A
Excerpt (<=80 chars):  struct FFmpegFormat;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FFmpegFormat
- FFmpegCodec
```

--------------------------------------------------------------------------------

---[FILE: FFmpegFormat.hpp]---
Location: obs-studio-master/frontend/utility/FFmpegFormat.hpp
Signals: N/A
Excerpt (<=80 chars):  struct FFmpegCodec;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FFmpegCodec
- FFmpegFormat
```

--------------------------------------------------------------------------------

---[FILE: GoLiveAPI_Network.hpp]---
Location: obs-studio-master/frontend/utility/GoLiveAPI_Network.hpp
Signals: N/A
Excerpt (<=80 chars):  class QWidget;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QWidget
```

--------------------------------------------------------------------------------

---[FILE: item-widget-helpers.hpp]---
Location: obs-studio-master/frontend/utility/item-widget-helpers.hpp
Signals: N/A
Excerpt (<=80 chars):  class QListWidget;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QListWidget
- QListWidgetItem
```

--------------------------------------------------------------------------------

---[FILE: MacUpdateThread.hpp]---
Location: obs-studio-master/frontend/utility/MacUpdateThread.hpp
Signals: N/A
Excerpt (<=80 chars):  class MacUpdateThread : public QThread {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MacUpdateThread
```

--------------------------------------------------------------------------------

---[FILE: MissingFilesModel.cpp]---
Location: obs-studio-master/frontend/utility/MissingFilesModel.cpp
Signals: N/A
Excerpt (<=80 chars):  struct os_dirent *ent;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- os_dirent
```

--------------------------------------------------------------------------------

---[FILE: MissingFilesModel.hpp]---
Location: obs-studio-master/frontend/utility/MissingFilesModel.hpp
Signals: N/A
Excerpt (<=80 chars):  class MissingFilesModel : public QAbstractTableModel {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MissingFilesModel
- MissingFileEntry
```

--------------------------------------------------------------------------------

---[FILE: MissingFilesPathItemDelegate.hpp]---
Location: obs-studio-master/frontend/utility/MissingFilesPathItemDelegate.hpp
Signals: N/A
Excerpt (<=80 chars):  class MissingFilesPathItemDelegate : public QStyledItemDelegate {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MissingFilesPathItemDelegate
```

--------------------------------------------------------------------------------

---[FILE: MultitrackVideoError.hpp]---
Location: obs-studio-master/frontend/utility/MultitrackVideoError.hpp
Signals: N/A
Excerpt (<=80 chars):  class QWidget;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QWidget
- MultitrackVideoError
```

--------------------------------------------------------------------------------

---[FILE: MultitrackVideoOutput.cpp]---
Location: obs-studio-master/frontend/utility/MultitrackVideoOutput.cpp
Signals: N/A
Excerpt (<=80 chars):  struct OBSOutputs {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSOutputs
```

--------------------------------------------------------------------------------

---[FILE: MultitrackVideoOutput.hpp]---
Location: obs-studio-master/frontend/utility/MultitrackVideoOutput.hpp
Signals: N/A
Excerpt (<=80 chars):  class QString;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QString
- QWidget
- MultitrackVideoOutput
- OBSOutputObjects
```

--------------------------------------------------------------------------------

---[FILE: NativeEventFilter.cpp]---
Location: obs-studio-master/frontend/utility/NativeEventFilter.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace OBS {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- namespace OBS
```

--------------------------------------------------------------------------------

---[FILE: NativeEventFilter.hpp]---
Location: obs-studio-master/frontend/utility/NativeEventFilter.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace OBS {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NativeEventFilter
- namespace OBS
```

--------------------------------------------------------------------------------

---[FILE: NativeEventFilter_Windows.cpp]---
Location: obs-studio-master/frontend/utility/NativeEventFilter_Windows.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace OBS {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- namespace OBS
```

--------------------------------------------------------------------------------

---[FILE: OBSCanvas.cpp]---
Location: obs-studio-master/frontend/utility/OBSCanvas.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace OBS {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- namespace OBS
```

--------------------------------------------------------------------------------

---[FILE: OBSCanvas.hpp]---
Location: obs-studio-master/frontend/utility/OBSCanvas.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace OBS {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Canvas
- namespace OBS
```

--------------------------------------------------------------------------------

---[FILE: OBSEventFilter.hpp]---
Location: obs-studio-master/frontend/utility/OBSEventFilter.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSEventFilter : public QObject {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSEventFilter
```

--------------------------------------------------------------------------------

---[FILE: OBSProxyStyle.hpp]---
Location: obs-studio-master/frontend/utility/OBSProxyStyle.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSProxyStyle : public QProxyStyle {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSProxyStyle
- OBSInvisibleCursorProxyStyle
```

--------------------------------------------------------------------------------

---[FILE: OBSSparkle.hpp]---
Location: obs-studio-master/frontend/utility/OBSSparkle.hpp
Signals: N/A
Excerpt (<=80 chars):  class QAction;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QAction
- OBSSparkle
```

--------------------------------------------------------------------------------

---[FILE: OBSTheme.hpp]---
Location: obs-studio-master/frontend/utility/OBSTheme.hpp
Signals: N/A
Excerpt (<=80 chars):  struct OBSTheme {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSTheme
```

--------------------------------------------------------------------------------

---[FILE: OBSThemeVariable.hpp]---
Location: obs-studio-master/frontend/utility/OBSThemeVariable.hpp
Signals: N/A
Excerpt (<=80 chars):  struct OBSThemeVariable {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSThemeVariable
```

--------------------------------------------------------------------------------

---[FILE: OBSTranslator.hpp]---
Location: obs-studio-master/frontend/utility/OBSTranslator.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSTranslator : public QTranslator {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSTranslator
```

--------------------------------------------------------------------------------

---[FILE: platform-windows.cpp]---
Location: obs-studio-master/frontend/utility/platform-windows.cpp
Signals: N/A
Excerpt (<=80 chars):  struct win_version_info ver_info;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- win_version_info
- RunOnceMutexData
- MonitorData
```

--------------------------------------------------------------------------------

---[FILE: platform-x11.cpp]---
Location: obs-studio-master/frontend/utility/platform-x11.cpp
Signals: N/A
Excerpt (<=80 chars):  struct sockaddr_un bindInfo;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sockaddr_un
- RunOnce
```

--------------------------------------------------------------------------------

---[FILE: platform.hpp]---
Location: obs-studio-master/frontend/utility/platform.hpp
Signals: N/A
Excerpt (<=80 chars):  class QWidget;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QWidget
- RunOnceMutex
- RunOnceMutexData
```

--------------------------------------------------------------------------------

---[FILE: QuickTransition.hpp]---
Location: obs-studio-master/frontend/utility/QuickTransition.hpp
Signals: N/A
Excerpt (<=80 chars):  class QPushButton;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QPushButton
- QuickTransition
```

--------------------------------------------------------------------------------

---[FILE: RemoteTextThread.cpp]---
Location: obs-studio-master/frontend/utility/RemoteTextThread.cpp
Signals: N/A
Excerpt (<=80 chars):  struct curl_slist *header = nullptr;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- curl_slist
```

--------------------------------------------------------------------------------

---[FILE: RemoteTextThread.hpp]---
Location: obs-studio-master/frontend/utility/RemoteTextThread.hpp
Signals: N/A
Excerpt (<=80 chars):  class RemoteTextThread : public QThread {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemoteTextThread
```

--------------------------------------------------------------------------------

---[FILE: RemuxEntryPathItemDelegate.hpp]---
Location: obs-studio-master/frontend/utility/RemuxEntryPathItemDelegate.hpp
Signals: N/A
Excerpt (<=80 chars):  class RemuxEntryPathItemDelegate : public QStyledItemDelegate {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemuxEntryPathItemDelegate
```

--------------------------------------------------------------------------------

---[FILE: RemuxQueueModel.hpp]---
Location: obs-studio-master/frontend/utility/RemuxQueueModel.hpp
Signals: N/A
Excerpt (<=80 chars):  class RemuxQueueModel : public QAbstractTableModel {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemuxQueueModel
- RemuxQueueEntry
```

--------------------------------------------------------------------------------

---[FILE: RemuxWorker.hpp]---
Location: obs-studio-master/frontend/utility/RemuxWorker.hpp
Signals: N/A
Excerpt (<=80 chars):  class RemuxWorker : public QObject {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemuxWorker
```

--------------------------------------------------------------------------------

---[FILE: SceneRenameDelegate.hpp]---
Location: obs-studio-master/frontend/utility/SceneRenameDelegate.hpp
Signals: N/A
Excerpt (<=80 chars):  class SceneRenameDelegate : public QStyledItemDelegate {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SceneRenameDelegate
```

--------------------------------------------------------------------------------

---[FILE: ScreenshotObj.hpp]---
Location: obs-studio-master/frontend/utility/ScreenshotObj.hpp
Signals: N/A
Excerpt (<=80 chars):  class ScreenshotObj : public QObject {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ScreenshotObj
```

--------------------------------------------------------------------------------

---[FILE: SettingsEventFilter.hpp]---
Location: obs-studio-master/frontend/utility/SettingsEventFilter.hpp
Signals: N/A
Excerpt (<=80 chars):  class SettingsEventFilter : public QObject {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SettingsEventFilter
```

--------------------------------------------------------------------------------

---[FILE: SimpleOutput.hpp]---
Location: obs-studio-master/frontend/utility/SimpleOutput.hpp
Signals: N/A
Excerpt (<=80 chars):  struct SimpleOutput : BasicOutputHandler {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SimpleOutput
```

--------------------------------------------------------------------------------

---[FILE: StartMultiTrackVideoStreamingGuard.hpp]---
Location: obs-studio-master/frontend/utility/StartMultiTrackVideoStreamingGuard.hpp
Signals: N/A
Excerpt (<=80 chars):  struct StartMultitrackVideoStreamingGuard {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StartMultitrackVideoStreamingGuard
```

--------------------------------------------------------------------------------

---[FILE: SurfaceEventFilter.hpp]---
Location: obs-studio-master/frontend/utility/SurfaceEventFilter.hpp
Signals: N/A
Excerpt (<=80 chars):  class SurfaceEventFilter : public QObject {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SurfaceEventFilter
```

--------------------------------------------------------------------------------

---[FILE: system-info-posix.cpp]---
Location: obs-studio-master/frontend/utility/system-info-posix.cpp
Signals: N/A
Excerpt (<=80 chars): namespace {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- drm_card_info
- os_dirent
- pci_access
- pci_dev
- pci_filter
- utsname
```

--------------------------------------------------------------------------------

---[FILE: system-info-windows.cpp]---
Location: obs-studio-master/frontend/utility/system-info-windows.cpp
Signals: N/A
Excerpt (<=80 chars):  struct feature_mapping_s {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- feature_mapping_s
- reg_dword
- win_version_info
```

--------------------------------------------------------------------------------

---[FILE: undo_stack.hpp]---
Location: obs-studio-master/frontend/utility/undo_stack.hpp
Signals: N/A
Excerpt (<=80 chars):  class undo_stack : public QObject {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- undo_stack
- undo_redo_t
```

--------------------------------------------------------------------------------

---[FILE: VCamConfig.hpp]---
Location: obs-studio-master/frontend/utility/VCamConfig.hpp
Signals: N/A
Excerpt (<=80 chars):  struct VCamConfig {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VCamConfig
```

--------------------------------------------------------------------------------

---[FILE: VolumeMeterTimer.hpp]---
Location: obs-studio-master/frontend/utility/VolumeMeterTimer.hpp
Signals: N/A
Excerpt (<=80 chars):  class VolumeMeter;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VolumeMeter
- VolumeMeterTimer
```

--------------------------------------------------------------------------------

---[FILE: WhatsNewBrowserInitThread.cpp]---
Location: obs-studio-master/frontend/utility/WhatsNewBrowserInitThread.cpp
Signals: N/A
Excerpt (<=80 chars): struct QCef;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QCef
```

--------------------------------------------------------------------------------

---[FILE: WhatsNewBrowserInitThread.hpp]---
Location: obs-studio-master/frontend/utility/WhatsNewBrowserInitThread.hpp
Signals: N/A
Excerpt (<=80 chars):  class WhatsNewBrowserInitThread : public QThread {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WhatsNewBrowserInitThread
```

--------------------------------------------------------------------------------

---[FILE: WhatsNewInfoThread.hpp]---
Location: obs-studio-master/frontend/utility/WhatsNewInfoThread.hpp
Signals: N/A
Excerpt (<=80 chars):  class WhatsNewInfoThread : public QThread {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WhatsNewInfoThread
```

--------------------------------------------------------------------------------

---[FILE: WHIPSimulcastEncoders.hpp]---
Location: obs-studio-master/frontend/utility/WHIPSimulcastEncoders.hpp
Signals: N/A
Excerpt (<=80 chars):  struct WHIPSimulcastEncoders {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WHIPSimulcastEncoders
```

--------------------------------------------------------------------------------

---[FILE: YoutubeApiWrappers.hpp]---
Location: obs-studio-master/frontend/utility/YoutubeApiWrappers.hpp
Signals: N/A
Excerpt (<=80 chars):  struct ChannelDescription {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChannelDescription
- StreamDescription
- CategoryDescription
- BroadcastDescription
- YoutubeApiWrappers
```

--------------------------------------------------------------------------------

---[FILE: branches.hpp]---
Location: obs-studio-master/frontend/utility/models/branches.hpp
Signals: N/A
Excerpt (<=80 chars):  struct JsonBranch {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JsonBranch
```

--------------------------------------------------------------------------------

---[FILE: multitrack-video.hpp]---
Location: obs-studio-master/frontend/utility/models/multitrack-video.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace GoLiveApi {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Client
- Cpu
- Memory
- Gpu
- GamingFeatures
- System
- Capabilities
- Canvas
- Preferences
- PostData
- Meta
- Status
- IngestEndpoint
- VideoEncoderConfiguration
- AudioEncoderConfiguration
- AudioConfigurations
- Config
- namespace GoLiveApi
```

--------------------------------------------------------------------------------

---[FILE: whatsnew.hpp]---
Location: obs-studio-master/frontend/utility/models/whatsnew.hpp
Signals: N/A
Excerpt (<=80 chars):  struct WhatsNewPlatforms {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WhatsNewPlatforms
- WhatsNewItem
```

--------------------------------------------------------------------------------

---[FILE: ColorSelect.hpp]---
Location: obs-studio-master/frontend/widgets/ColorSelect.hpp
Signals: N/A
Excerpt (<=80 chars):  class ColorSelect : public QWidget {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ColorSelect
```

--------------------------------------------------------------------------------

---[FILE: OBSBasic.cpp]---
Location: obs-studio-master/frontend/widgets/OBSBasic.cpp
Signals: N/A
Excerpt (<=80 chars):  struct QCef;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QCef
- obs_video_info
- obs_module_failure_info
- obs_audio_info2
```

--------------------------------------------------------------------------------

---[FILE: OBSBasic.hpp]---
Location: obs-studio-master/frontend/widgets/OBSBasic.hpp
Signals: N/A
Excerpt (<=80 chars):  class ColorSelect;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ColorSelect
- OBSAbout
- OBSBasicAdvAudio
- OBSBasicFilters
- OBSBasicInteraction
- OBSBasicProperties
- OBSBasicTransform
- OBSLogViewer
- OBSMissingFiles
- OBSProjector
- VolControl
- YouTubeAppDock
- QMessageBox
- QWidgetAction
- QuickTransition
- SceneCollection
- Rect
- SavedProjectorInfo
```

--------------------------------------------------------------------------------

---[FILE: OBSBasicControls.hpp]---
Location: obs-studio-master/frontend/widgets/OBSBasicControls.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSBasic;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSBasic
- OBSBasicControls
```

--------------------------------------------------------------------------------

---[FILE: OBSBasicPreview.cpp]---
Location: obs-studio-master/frontend/widgets/OBSBasicPreview.cpp
Signals: N/A
Excerpt (<=80 chars):  struct SceneFindData {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SceneFindData
- SceneFindBoxData
- HandleFindData
- SelectedItemBounds
- OffsetData
- vec3
- matrix4
- vec2
```

--------------------------------------------------------------------------------

---[FILE: OBSBasicPreview.hpp]---
Location: obs-studio-master/frontend/widgets/OBSBasicPreview.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSBasicPreview : public OBSQTDisplay {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSBasicPreview
```

--------------------------------------------------------------------------------

---[FILE: OBSBasicStats.cpp]---
Location: obs-studio-master/frontend/widgets/OBSBasicStats.cpp
Signals: N/A
Excerpt (<=80 chars):  struct obs_video_info ovi = {};

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_video_info
```

--------------------------------------------------------------------------------

---[FILE: OBSBasicStats.hpp]---
Location: obs-studio-master/frontend/widgets/OBSBasicStats.hpp
Signals: N/A
Excerpt (<=80 chars):  class QLabel;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QLabel
- QGridLayout
- OBSBasicStats
- OutputLabels
```

--------------------------------------------------------------------------------

---[FILE: OBSBasicStatusBar.cpp]---
Location: obs-studio-master/frontend/widgets/OBSBasicStatusBar.cpp
Signals: N/A
Excerpt (<=80 chars):  struct obs_video_info ovi;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_video_info
```

--------------------------------------------------------------------------------

---[FILE: OBSBasicStatusBar.hpp]---
Location: obs-studio-master/frontend/widgets/OBSBasicStatusBar.hpp
Signals: N/A
Excerpt (<=80 chars):  class QTimer;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QTimer
- OBSBasicStatusBar
```

--------------------------------------------------------------------------------

---[FILE: OBSBasic_Browser.cpp]---
Location: obs-studio-master/frontend/widgets/OBSBasic_Browser.cpp
Signals: N/A
Excerpt (<=80 chars):  struct QCef;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QCef
- QCefCookieManager
```

--------------------------------------------------------------------------------

---[FILE: OBSBasic_Hotkeys.cpp]---
Location: obs-studio-master/frontend/widgets/OBSBasic_Hotkeys.cpp
Signals: N/A
Excerpt (<=80 chars):  struct obs_hotkeys_translations t = {};

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_hotkeys_translations
```

--------------------------------------------------------------------------------

---[FILE: OBSBasic_MainControls.cpp]---
Location: obs-studio-master/frontend/widgets/OBSBasic_MainControls.cpp
Signals: N/A
Excerpt (<=80 chars):  struct QCef;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QCef
- QCefCookieManager
```

--------------------------------------------------------------------------------

---[FILE: OBSBasic_Preview.cpp]---
Location: obs-studio-master/frontend/widgets/OBSBasic_Preview.cpp
Signals: N/A
Excerpt (<=80 chars):  struct vec2 &offset = *static_cast<struct vec2 *>(param);

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- vec2
- vec3
- matrix4
```

--------------------------------------------------------------------------------

---[FILE: OBSBasic_SceneCollections.cpp]---
Location: obs-studio-master/frontend/widgets/OBSBasic_SceneCollections.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace DataKeys {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- namespace DataKeys
- namespace L10N
```

--------------------------------------------------------------------------------

---[FILE: OBSBasic_Scenes.cpp]---
Location: obs-studio-master/frontend/widgets/OBSBasic_Scenes.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- other_scenes_cb_data
```

--------------------------------------------------------------------------------

---[FILE: OBSBasic_StudioMode.cpp]---
Location: obs-studio-master/frontend/widgets/OBSBasic_StudioMode.cpp
Signals: N/A
Excerpt (<=80 chars):  struct obs_video_info ovi;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_video_info
```

--------------------------------------------------------------------------------

---[FILE: OBSBasic_Updater.cpp]---
Location: obs-studio-master/frontend/widgets/OBSBasic_Updater.cpp
Signals: N/A
Excerpt (<=80 chars):  struct QCef;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QCef
- QCefCookieManager
```

--------------------------------------------------------------------------------

---[FILE: OBSMainWindow.hpp]---
Location: obs-studio-master/frontend/widgets/OBSMainWindow.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSMainWindow : public QMainWindow {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSMainWindow
```

--------------------------------------------------------------------------------

---[FILE: OBSProjector.cpp]---
Location: obs-studio-master/frontend/widgets/OBSProjector.cpp
Signals: N/A
Excerpt (<=80 chars):  struct obs_video_info ovi;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_video_info
```

--------------------------------------------------------------------------------

---[FILE: OBSProjector.hpp]---
Location: obs-studio-master/frontend/widgets/OBSProjector.hpp
Signals: N/A
Excerpt (<=80 chars):  class Multiview;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Multiview
- OBSProjector
```

--------------------------------------------------------------------------------

---[FILE: OBSQTDisplay.hpp]---
Location: obs-studio-master/frontend/widgets/OBSQTDisplay.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSQTDisplay : public QWidget {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSQTDisplay
```

--------------------------------------------------------------------------------

---[FILE: StatusBarWidget.hpp]---
Location: obs-studio-master/frontend/widgets/StatusBarWidget.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSBasicStatusBar;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSBasicStatusBar
- Ui_StatusBarWidget
- StatusBarWidget
```

--------------------------------------------------------------------------------

---[FILE: VolControl.hpp]---
Location: obs-studio-master/frontend/widgets/VolControl.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSSourceLabel;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSSourceLabel
- VolumeMeter
- VolumeSlider
- MuteCheckBox
- QLabel
- QPushButton
- VolControl
```

--------------------------------------------------------------------------------

---[FILE: VolumeAccessibleInterface.hpp]---
Location: obs-studio-master/frontend/widgets/VolumeAccessibleInterface.hpp
Signals: N/A
Excerpt (<=80 chars):  class VolumeSlider;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VolumeSlider
- VolumeAccessibleInterface
```

--------------------------------------------------------------------------------

---[FILE: VolumeMeter.cpp]---
Location: obs-studio-master/frontend/widgets/VolumeMeter.cpp
Signals: N/A
Excerpt (<=80 chars):  struct obs_audio_info oai;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_audio_info
```

--------------------------------------------------------------------------------

---[FILE: VolumeMeter.hpp]---
Location: obs-studio-master/frontend/widgets/VolumeMeter.hpp
Signals: N/A
Excerpt (<=80 chars):  class VolumeMeterTimer;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VolumeMeterTimer
- VolumeMeter
```

--------------------------------------------------------------------------------

---[FILE: AutoConfig.hpp]---
Location: obs-studio-master/frontend/wizards/AutoConfig.hpp
Signals: N/A
Excerpt (<=80 chars):  class AutoConfigStreamPage;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AutoConfigStreamPage
- AutoConfig
- StreamServer
```

--------------------------------------------------------------------------------

---[FILE: AutoConfigStartPage.hpp]---
Location: obs-studio-master/frontend/wizards/AutoConfigStartPage.hpp
Signals: N/A
Excerpt (<=80 chars):  class Ui_AutoConfigStartPage;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Ui_AutoConfigStartPage
- AutoConfigStartPage
```

--------------------------------------------------------------------------------

---[FILE: AutoConfigStreamPage.cpp]---
Location: obs-studio-master/frontend/wizards/AutoConfigStreamPage.cpp
Signals: N/A
Excerpt (<=80 chars):  struct QCef;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QCef
```

--------------------------------------------------------------------------------

---[FILE: AutoConfigStreamPage.hpp]---
Location: obs-studio-master/frontend/wizards/AutoConfigStreamPage.hpp
Signals: N/A
Excerpt (<=80 chars):  class Auth;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Auth
- Ui_AutoConfigStreamPage
- AutoConfigStreamPage
```

--------------------------------------------------------------------------------

---[FILE: AutoConfigTestPage.cpp]---
Location: obs-studio-master/frontend/wizards/AutoConfigTestPage.cpp
Signals: N/A
Excerpt (<=80 chars):  struct Result {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Result
- obs_service_resolution
```

--------------------------------------------------------------------------------

---[FILE: AutoConfigTestPage.hpp]---
Location: obs-studio-master/frontend/wizards/AutoConfigTestPage.hpp
Signals: N/A
Excerpt (<=80 chars):  class QFormLayout;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QFormLayout
- Ui_AutoConfigTestPage
- AutoConfigTestPage
- ServerInfo
```

--------------------------------------------------------------------------------

---[FILE: AutoConfigVideoPage.hpp]---
Location: obs-studio-master/frontend/wizards/AutoConfigVideoPage.hpp
Signals: N/A
Excerpt (<=80 chars):  class Ui_AutoConfigVideoPage;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Ui_AutoConfigVideoPage
- AutoConfigVideoPage
```

--------------------------------------------------------------------------------

---[FILE: TestMode.hpp]---
Location: obs-studio-master/frontend/wizards/TestMode.hpp
Signals: N/A
Excerpt (<=80 chars):  class TestMode {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestMode
- vec4
```

--------------------------------------------------------------------------------

---[FILE: obs-audio-controls.c]---
Location: obs-studio-master/libobs/obs-audio-controls.c
Signals: N/A
Excerpt (<=80 chars):  struct fader_cb {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- fader_cb
- obs_fader
- meter_cb
- obs_volmeter
- obs_audio_info
```

--------------------------------------------------------------------------------

---[FILE: obs-audio.c]---
Location: obs-studio-master/libobs/obs-audio.c
Signals: N/A
Excerpt (<=80 chars):  struct ts_info {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ts_info
- obs_core_audio
- obs_source
- obs_task_info
- audio_output_data
- obs_core_data
- obs_view
```

--------------------------------------------------------------------------------

---[FILE: obs-avc.c]---
Location: obs-studio-master/libobs/obs-avc.c
Signals: N/A
Excerpt (<=80 chars):  struct array_output_data output;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- array_output_data
- serializer
- bitstream_reader
```

--------------------------------------------------------------------------------

---[FILE: obs-avc.h]---
Location: obs-studio-master/libobs/obs-avc.h
Signals: N/A
Excerpt (<=80 chars):  struct encoder_packet;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- encoder_packet
```

--------------------------------------------------------------------------------

---[FILE: obs-canvas.c]---
Location: obs-studio-master/libobs/obs-canvas.c
Signals: N/A
Excerpt (<=80 chars):  struct calldata data;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- calldata
- obs_canvas
- obs_core_video_mix
- obs_context_data
- obs_view
- obs_source
```

--------------------------------------------------------------------------------

---[FILE: obs-data.c]---
Location: obs-studio-master/libobs/obs-data.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_data_item {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_data_item
- obs_data
- obs_data_array
- obs_data_number
- dstr
```

--------------------------------------------------------------------------------

---[FILE: obs-data.h]---
Location: obs-studio-master/libobs/obs-data.h
Signals: N/A
Excerpt (<=80 chars):  struct vec2;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- vec2
- vec3
- vec4
- quat
- obs_data
- obs_data_item
- obs_data_array
- media_frames_per_second
```

--------------------------------------------------------------------------------

---[FILE: obs-display.c]---
Location: obs-studio-master/libobs/obs-display.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_display *display = bzalloc(sizeof(struct obs_display));

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_display
- draw_callback
- vec4
```

--------------------------------------------------------------------------------

---[FILE: obs-encoder.c]---
Location: obs-studio-master/libobs/obs-encoder.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_encoder_info *find_encoder(const char *id)

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_encoder_info
- obs_encoder
- obs_core_video_mix
- obs_video_info
- audio_convert_info
- video_scale_info
- obs_output
- encoder_callback
- obs_encoder_group
```

--------------------------------------------------------------------------------

---[FILE: obs-encoder.h]---
Location: obs-studio-master/libobs/obs-encoder.h
Signals: N/A
Excerpt (<=80 chars):  struct obs_encoder;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_encoder
- encoder_packet_time
- encoder_packet
- encoder_frame
- obs_encoder_roi
- gs_texture
- encoder_texture
- obs_encoder_info
```

--------------------------------------------------------------------------------

---[FILE: obs-hevc.c]---
Location: obs-studio-master/libobs/obs-hevc.c
Signals: N/A
Excerpt (<=80 chars):  struct array_output_data output;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- array_output_data
- serializer
```

--------------------------------------------------------------------------------

---[FILE: obs-hevc.h]---
Location: obs-studio-master/libobs/obs-hevc.h
Signals: N/A
Excerpt (<=80 chars):  struct encoder_packet;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- encoder_packet
```

--------------------------------------------------------------------------------

---[FILE: obs-hotkey-name-map.c]---
Location: obs-studio-master/libobs/obs-hotkey-name-map.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_hotkey_name_map;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_hotkey_name_map
- obs_hotkey_name_map_item
```

--------------------------------------------------------------------------------

---[FILE: obs-hotkey.c]---
Location: obs-studio-master/libobs/obs-hotkey.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_context_data *context, const char *name,

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_context_data
- save_bindings_helper_t
- binding_find_data
- obs_hotkey_internal_inject
- obs_query_hotkeys_helper
- obs_hotkeys_translations
- dstr
```

--------------------------------------------------------------------------------

---[FILE: obs-hotkey.h]---
Location: obs-studio-master/libobs/obs-hotkey.h
Signals: N/A
Excerpt (<=80 chars):  struct obs_key_combination {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_key_combination
- obs_hotkeys_translations
- dstr
```

--------------------------------------------------------------------------------

---[FILE: obs-interaction.h]---
Location: obs-studio-master/libobs/obs-interaction.h
Signals: N/A
Excerpt (<=80 chars):  struct obs_mouse_event {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_mouse_event
- obs_key_event
```

--------------------------------------------------------------------------------

---[FILE: obs-internal.h]---
Location: obs-studio-master/libobs/obs-internal.h
Signals: N/A
Excerpt (<=80 chars):  struct tick_callback {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tick_callback
- draw_callback
- rendered_callback
- packet_callback
- reconnect_callback
- obs_module
- obs_module_metadata
- obs_disabled_module
- obs_module_path
- obs_hotkey
- obs_hotkey_pair
- obs_core_hotkeys
- obs_context_data
- obs_hotkey_binding
```

--------------------------------------------------------------------------------

---[FILE: obs-missing-files.c]---
Location: obs-studio-master/libobs/obs-missing-files.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_missing_file {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_missing_file
- obs_missing_files
```

--------------------------------------------------------------------------------

---[FILE: obs-missing-files.h]---
Location: obs-studio-master/libobs/obs-missing-files.h
Signals: N/A
Excerpt (<=80 chars):  struct obs_missing_file;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_missing_file
- obs_missing_files
```

--------------------------------------------------------------------------------

---[FILE: obs-module.c]---
Location: obs-studio-master/libobs/obs-module.c
Signals: N/A
Excerpt (<=80 chars):  struct dstr name = {0};

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dstr
- obs_module_metadata
- obs_module
- obs_module_path
- fail_info
- obs_module_info2
```

--------------------------------------------------------------------------------

---[FILE: obs-nix-wayland.c]---
Location: obs-studio-master/libobs/obs-nix-wayland.c
Signals: N/A
Excerpt (<=80 chars):  struct obs_hotkeys_platform {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_hotkeys_platform
- wl_display
- wl_seat
- wl_keyboard
- xkb_context
- xkb_keymap
- xkb_state
- wl_surface
- wl_registry
```

--------------------------------------------------------------------------------

---[FILE: obs-nix-x11.c]---
Location: obs-studio-master/libobs/obs-nix-x11.c
Signals: N/A
Excerpt (<=80 chars):  struct keycode_list {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- keycode_list
- obs_hotkeys_platform
```

--------------------------------------------------------------------------------

---[FILE: obs-nix.c]---
Location: obs-studio-master/libobs/obs-nix.c
Signals: N/A
Excerpt (<=80 chars):  struct dstr output;

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dstr
- sysinfo
- utsname
```

--------------------------------------------------------------------------------

---[FILE: obs-nix.h]---
Location: obs-studio-master/libobs/obs-nix.h
Signals: N/A
Excerpt (<=80 chars):  struct obs_nix_hotkeys_vtable {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_nix_hotkeys_vtable
```

--------------------------------------------------------------------------------

---[FILE: obs-output-delay.c]---
Location: obs-studio-master/libobs/obs-output-delay.c
Signals: N/A
Excerpt (<=80 chars):  struct encoder_packet_time *packet_time, uint64_t t)

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- encoder_packet_time
- delay_data
- obs_output
```

--------------------------------------------------------------------------------

````
