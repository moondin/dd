---
source_txt: fullstack_samples/obs-studio-master
converted_utc: 2025-12-18T10:36:59Z
part: 2
parts_total: 8
---

# FULLSTACK CODE DATABASE SAMPLES obs-studio-master

## Extracted Reusable Patterns (Non-verbatim) (Part 2 of 8)

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

---[FILE: Multiview.hpp]---
Location: obs-studio-master/frontend/components/Multiview.hpp
Signals: N/A
Excerpt (<=80 chars):  class Multiview {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Multiview
```

--------------------------------------------------------------------------------

---[FILE: MuteCheckBox.hpp]---
Location: obs-studio-master/frontend/components/MuteCheckBox.hpp
Signals: N/A
Excerpt (<=80 chars):  class MuteCheckBox : public QCheckBox {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MuteCheckBox
```

--------------------------------------------------------------------------------

---[FILE: OBSAdvAudioCtrl.hpp]---
Location: obs-studio-master/frontend/components/OBSAdvAudioCtrl.hpp
Signals: N/A
Excerpt (<=80 chars):  class BalanceSlider;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BalanceSlider
- QCheckBox
- QComboBox
- QDoubleSpinBox
- QGridLayout
- QLabel
- QSpinBox
- QStackedWidget
- QWidget
- OBSAdvAudioCtrl
```

--------------------------------------------------------------------------------

---[FILE: OBSPreviewScalingComboBox.hpp]---
Location: obs-studio-master/frontend/components/OBSPreviewScalingComboBox.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSPreviewScalingComboBox : public QComboBox {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSPreviewScalingComboBox
```

--------------------------------------------------------------------------------

---[FILE: OBSPreviewScalingLabel.hpp]---
Location: obs-studio-master/frontend/components/OBSPreviewScalingLabel.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSPreviewScalingLabel : public QLabel {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSPreviewScalingLabel
```

--------------------------------------------------------------------------------

---[FILE: OBSSourceLabel.hpp]---
Location: obs-studio-master/frontend/components/OBSSourceLabel.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSSourceLabel : public QLabel {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSSourceLabel
```

--------------------------------------------------------------------------------

---[FILE: SceneTree.hpp]---
Location: obs-studio-master/frontend/components/SceneTree.hpp
Signals: N/A
Excerpt (<=80 chars):  class SceneTree : public QListWidget {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SceneTree
```

--------------------------------------------------------------------------------

---[FILE: SilentUpdateCheckBox.hpp]---
Location: obs-studio-master/frontend/components/SilentUpdateCheckBox.hpp
Signals: N/A
Excerpt (<=80 chars):  class SilentUpdateCheckBox : public QCheckBox {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SilentUpdateCheckBox
```

--------------------------------------------------------------------------------

---[FILE: SilentUpdateSpinBox.hpp]---
Location: obs-studio-master/frontend/components/SilentUpdateSpinBox.hpp
Signals: N/A
Excerpt (<=80 chars):  class SilentUpdateSpinBox : public QSpinBox {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SilentUpdateSpinBox
```

--------------------------------------------------------------------------------

---[FILE: SourceToolbar.hpp]---
Location: obs-studio-master/frontend/components/SourceToolbar.hpp
Signals: N/A
Excerpt (<=80 chars):  class SourceToolbar : public QWidget {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceToolbar
```

--------------------------------------------------------------------------------

---[FILE: SourceTree.cpp]---
Location: obs-studio-master/frontend/components/SourceTree.cpp
Signals: N/A
Excerpt (<=80 chars):  struct obs_sceneitem_order_info info;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_sceneitem_order_info
```

--------------------------------------------------------------------------------

---[FILE: SourceTree.hpp]---
Location: obs-studio-master/frontend/components/SourceTree.hpp
Signals: N/A
Excerpt (<=80 chars):  class SourceTree : public QListView {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceTree
```

--------------------------------------------------------------------------------

---[FILE: SourceTreeDelegate.hpp]---
Location: obs-studio-master/frontend/components/SourceTreeDelegate.hpp
Signals: N/A
Excerpt (<=80 chars):  class SourceTreeDelegate : public QStyledItemDelegate {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceTreeDelegate
```

--------------------------------------------------------------------------------

---[FILE: SourceTreeItem.hpp]---
Location: obs-studio-master/frontend/components/SourceTreeItem.hpp
Signals: N/A
Excerpt (<=80 chars):  class QSpacerItem;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QSpacerItem
- QCheckBox
- QLabel
- QHBoxLayout
- OBSSourceLabel
- QLineEdit
- SourceTree
- SourceTreeItem
```

--------------------------------------------------------------------------------

---[FILE: SourceTreeModel.hpp]---
Location: obs-studio-master/frontend/components/SourceTreeModel.hpp
Signals: N/A
Excerpt (<=80 chars):  class SourceTree;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceTree
- SourceTreeModel
```

--------------------------------------------------------------------------------

---[FILE: TextSourceToolbar.hpp]---
Location: obs-studio-master/frontend/components/TextSourceToolbar.hpp
Signals: N/A
Excerpt (<=80 chars):  class Ui_TextSourceToolbar;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Ui_TextSourceToolbar
- TextSourceToolbar
```

--------------------------------------------------------------------------------

---[FILE: UIValidation.hpp]---
Location: obs-studio-master/frontend/components/UIValidation.hpp
Signals: N/A
Excerpt (<=80 chars):  class UIValidation : public QObject {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UIValidation
```

--------------------------------------------------------------------------------

---[FILE: UrlPushButton.hpp]---
Location: obs-studio-master/frontend/components/UrlPushButton.hpp
Signals: N/A
Excerpt (<=80 chars):  class UrlPushButton : public QPushButton {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UrlPushButton
```

--------------------------------------------------------------------------------

---[FILE: VisibilityItemDelegate.hpp]---
Location: obs-studio-master/frontend/components/VisibilityItemDelegate.hpp
Signals: N/A
Excerpt (<=80 chars):  class QObject;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QObject
- VisibilityItemDelegate
```

--------------------------------------------------------------------------------

---[FILE: VisibilityItemWidget.hpp]---
Location: obs-studio-master/frontend/components/VisibilityItemWidget.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSSourceLabel;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSSourceLabel
- QCheckBox
- VisibilityItemWidget
```

--------------------------------------------------------------------------------

---[FILE: VolumeSlider.hpp]---
Location: obs-studio-master/frontend/components/VolumeSlider.hpp
Signals: N/A
Excerpt (<=80 chars):  class VolumeSlider : public AbsoluteSlider {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VolumeSlider
```

--------------------------------------------------------------------------------

---[FILE: WindowCaptureToolbar.hpp]---
Location: obs-studio-master/frontend/components/WindowCaptureToolbar.hpp
Signals: N/A
Excerpt (<=80 chars):  class WindowCaptureToolbar : public ComboSelectToolbar {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WindowCaptureToolbar
```

--------------------------------------------------------------------------------

---[FILE: LogUploadDialog.cpp]---
Location: obs-studio-master/frontend/dialogs/LogUploadDialog.cpp
Signals: N/A
Excerpt (<=80 chars):  struct DialogPage {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DialogPage
- namespace OBS
```

--------------------------------------------------------------------------------

---[FILE: LogUploadDialog.hpp]---
Location: obs-studio-master/frontend/dialogs/LogUploadDialog.hpp
Signals: N/A
Excerpt (<=80 chars):  class QTimer;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QTimer
- LogUploadDialog
- namespace OBS
```

--------------------------------------------------------------------------------

---[FILE: NameDialog.hpp]---
Location: obs-studio-master/frontend/dialogs/NameDialog.hpp
Signals: N/A
Excerpt (<=80 chars):  class QCheckBox;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QCheckBox
- QLabel
- QLineEdit
- QString
- NameDialog
```

--------------------------------------------------------------------------------

---[FILE: OAuthLogin.hpp]---
Location: obs-studio-master/frontend/dialogs/OAuthLogin.hpp
Signals: N/A
Excerpt (<=80 chars):  class QCefWidget;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QCefWidget
- OAuthLogin
```

--------------------------------------------------------------------------------

---[FILE: OBSAbout.hpp]---
Location: obs-studio-master/frontend/dialogs/OBSAbout.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSAbout : public QDialog {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSAbout
```

--------------------------------------------------------------------------------

---[FILE: OBSBasicAdvAudio.hpp]---
Location: obs-studio-master/frontend/dialogs/OBSBasicAdvAudio.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSAdvAudioCtrl;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSAdvAudioCtrl
- Ui_OBSAdvAudio
- OBSBasicAdvAudio
```

--------------------------------------------------------------------------------

---[FILE: OBSBasicFilters.cpp]---
Location: obs-studio-master/frontend/dialogs/OBSBasicFilters.cpp
Signals: N/A
Excerpt (<=80 chars):  struct FilterOrderInfo {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilterOrderInfo
- FilterInfo
```

--------------------------------------------------------------------------------

---[FILE: OBSBasicFilters.hpp]---
Location: obs-studio-master/frontend/dialogs/OBSBasicFilters.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSBasic;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSBasic
- OBSPropertiesView
- OBSBasicFilters
```

--------------------------------------------------------------------------------

---[FILE: OBSBasicInteraction.cpp]---
Location: obs-studio-master/frontend/dialogs/OBSBasicInteraction.cpp
Signals: N/A
Excerpt (<=80 chars):  struct obs_mouse_event mouseEvent = {};

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_mouse_event
- obs_key_event
```

--------------------------------------------------------------------------------

---[FILE: OBSBasicInteraction.hpp]---
Location: obs-studio-master/frontend/dialogs/OBSBasicInteraction.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSBasic;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSBasic
- OBSEventFilter
- OBSBasicInteraction
```

--------------------------------------------------------------------------------

---[FILE: OBSBasicProperties.hpp]---
Location: obs-studio-master/frontend/dialogs/OBSBasicProperties.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSBasic;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSBasic
- OBSPropertiesView
- OBSBasicProperties
```

--------------------------------------------------------------------------------

---[FILE: OBSBasicSourceSelect.cpp]---
Location: obs-studio-master/frontend/dialogs/OBSBasicSourceSelect.cpp
Signals: N/A
Excerpt (<=80 chars):  struct AddSourceData {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AddSourceData
- dstr
```

--------------------------------------------------------------------------------

---[FILE: OBSBasicSourceSelect.hpp]---
Location: obs-studio-master/frontend/dialogs/OBSBasicSourceSelect.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSBasicSourceSelect : public QDialog {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSBasicSourceSelect
```

--------------------------------------------------------------------------------

---[FILE: OBSBasicTransform.hpp]---
Location: obs-studio-master/frontend/dialogs/OBSBasicTransform.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSBasic;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSBasic
- QListWidgetItem
- OBSBasicTransform
```

--------------------------------------------------------------------------------

---[FILE: OBSBasicVCamConfig.hpp]---
Location: obs-studio-master/frontend/dialogs/OBSBasicVCamConfig.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSBasicVCamConfig : public QDialog {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSBasicVCamConfig
```

--------------------------------------------------------------------------------

---[FILE: OBSExtraBrowsers.hpp]---
Location: obs-studio-master/frontend/dialogs/OBSExtraBrowsers.hpp
Signals: N/A
Excerpt (<=80 chars):  class Ui_OBSExtraBrowsers;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Ui_OBSExtraBrowsers
- OBSExtraBrowsers
```

--------------------------------------------------------------------------------

---[FILE: OBSIdianPlayground.hpp]---
Location: obs-studio-master/frontend/dialogs/OBSIdianPlayground.hpp
Signals: N/A
Excerpt (<=80 chars): class OBSIdianPlayground : public QDialog {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSIdianPlayground
```

--------------------------------------------------------------------------------

---[FILE: OBSLogViewer.hpp]---
Location: obs-studio-master/frontend/dialogs/OBSLogViewer.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSLogViewer : public QDialog {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSLogViewer
```

--------------------------------------------------------------------------------

---[FILE: OBSMissingFiles.hpp]---
Location: obs-studio-master/frontend/dialogs/OBSMissingFiles.hpp
Signals: N/A
Excerpt (<=80 chars):  class MissingFilesModel;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MissingFilesModel
- OBSMissingFiles
```

--------------------------------------------------------------------------------

---[FILE: OBSPermissions.hpp]---
Location: obs-studio-master/frontend/dialogs/OBSPermissions.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSPermissions : public QDialog {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSPermissions
```

--------------------------------------------------------------------------------

---[FILE: OBSRemux.hpp]---
Location: obs-studio-master/frontend/dialogs/OBSRemux.hpp
Signals: N/A
Excerpt (<=80 chars):  class RemuxQueueModel;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemuxQueueModel
- RemuxWorker
- OBSRemux
```

--------------------------------------------------------------------------------

---[FILE: OBSUpdate.hpp]---
Location: obs-studio-master/frontend/dialogs/OBSUpdate.hpp
Signals: N/A
Excerpt (<=80 chars):  class Ui_OBSUpdate;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Ui_OBSUpdate
- OBSUpdate
```

--------------------------------------------------------------------------------

---[FILE: OBSWhatsNew.hpp]---
Location: obs-studio-master/frontend/dialogs/OBSWhatsNew.hpp
Signals: N/A
Excerpt (<=80 chars):  class QCefWidget;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QCefWidget
- OBSWhatsNew
```

--------------------------------------------------------------------------------

---[FILE: OBSYoutubeActions.hpp]---
Location: obs-studio-master/frontend/dialogs/OBSYoutubeActions.hpp
Signals: N/A
Excerpt (<=80 chars):  class WorkerThread : public QThread {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkerThread
- OBSYoutubeActions
```

--------------------------------------------------------------------------------

---[FILE: BrowserDock.hpp]---
Location: obs-studio-master/frontend/docks/BrowserDock.hpp
Signals: N/A
Excerpt (<=80 chars):  class BrowserDock : public OBSDock {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BrowserDock
```

--------------------------------------------------------------------------------

---[FILE: OBSDock.hpp]---
Location: obs-studio-master/frontend/docks/OBSDock.hpp
Signals: N/A
Excerpt (<=80 chars):  class QCloseEvent;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QCloseEvent
- QShowEvent
- QString
- OBSDock
```

--------------------------------------------------------------------------------

---[FILE: YouTubeAppDock.hpp]---
Location: obs-studio-master/frontend/docks/YouTubeAppDock.hpp
Signals: N/A
Excerpt (<=80 chars):  class QAction;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QAction
- QCefWidget
- YoutubeApiWrappers
- YouTubeAppDock
```

--------------------------------------------------------------------------------

---[FILE: YouTubeChatDock.hpp]---
Location: obs-studio-master/frontend/docks/YouTubeChatDock.hpp
Signals: N/A
Excerpt (<=80 chars):  class YoutubeChatDock : public BrowserDock {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- YoutubeChatDock
```

--------------------------------------------------------------------------------

---[FILE: ImporterEntryPathItemDelegate.hpp]---
Location: obs-studio-master/frontend/importer/ImporterEntryPathItemDelegate.hpp
Signals: N/A
Excerpt (<=80 chars):  class ImporterEntryPathItemDelegate : public QStyledItemDelegate {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImporterEntryPathItemDelegate
```

--------------------------------------------------------------------------------

---[FILE: ImporterModel.hpp]---
Location: obs-studio-master/frontend/importer/ImporterModel.hpp
Signals: N/A
Excerpt (<=80 chars):  class ImporterModel : public QAbstractTableModel {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImporterModel
- ImporterEntry
```

--------------------------------------------------------------------------------

---[FILE: OBSImporter.hpp]---
Location: obs-studio-master/frontend/importer/OBSImporter.hpp
Signals: N/A
Excerpt (<=80 chars):  class ImporterModel;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImporterModel
- OBSImporter
```

--------------------------------------------------------------------------------

---[FILE: classic.cpp]---
Location: obs-studio-master/frontend/importers/classic.cpp
Signals: N/A
Excerpt (<=80 chars):  struct os_dirent *ent;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- os_dirent
```

--------------------------------------------------------------------------------

---[FILE: importers.hpp]---
Location: obs-studio-master/frontend/importers/importers.hpp
Signals: N/A
Excerpt (<=80 chars):  class Importer {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Importer
- ClassicImporter
- StudioImporter
- SLImporter
- XSplitImporter
```

--------------------------------------------------------------------------------

---[FILE: sl.cpp]---
Location: obs-studio-master/frontend/importers/sl.cpp
Signals: N/A
Excerpt (<=80 chars):  struct os_dirent *ent;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- os_dirent
```

--------------------------------------------------------------------------------

---[FILE: xsplit.cpp]---
Location: obs-studio-master/frontend/importers/xsplit.cpp
Signals: N/A
Excerpt (<=80 chars):  struct obs_video_info ovi;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_video_info
- os_dirent
```

--------------------------------------------------------------------------------

---[FILE: Rect.cpp]---
Location: obs-studio-master/frontend/models/Rect.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace OBS {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- namespace OBS
```

--------------------------------------------------------------------------------

---[FILE: Rect.hpp]---
Location: obs-studio-master/frontend/models/Rect.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Rect
- namespace OBS
```

--------------------------------------------------------------------------------

---[FILE: SceneCollection.cpp]---
Location: obs-studio-master/frontend/models/SceneCollection.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace OBS {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- namespace OBS
```

--------------------------------------------------------------------------------

---[FILE: SceneCollection.hpp]---
Location: obs-studio-master/frontend/models/SceneCollection.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace OBS {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SceneCollection
- namespace OBS
```

--------------------------------------------------------------------------------

---[FILE: Auth.cpp]---
Location: obs-studio-master/frontend/oauth/Auth.cpp
Signals: N/A
Excerpt (<=80 chars):  struct AuthInfo {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AuthInfo
```

--------------------------------------------------------------------------------

---[FILE: Auth.hpp]---
Location: obs-studio-master/frontend/oauth/Auth.hpp
Signals: N/A
Excerpt (<=80 chars):  class Auth : public QObject {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Auth
- ErrorInfo
- Def
```

--------------------------------------------------------------------------------

---[FILE: AuthListener.hpp]---
Location: obs-studio-master/frontend/oauth/AuthListener.hpp
Signals: N/A
Excerpt (<=80 chars):  class QTcpServer;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QTcpServer
- AuthListener
```

--------------------------------------------------------------------------------

---[FILE: OAuth.cpp]---
Location: obs-studio-master/frontend/oauth/OAuth.cpp
Signals: N/A
Excerpt (<=80 chars):  struct OAuthInfo {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OAuthInfo
```

--------------------------------------------------------------------------------

---[FILE: OAuth.hpp]---
Location: obs-studio-master/frontend/oauth/OAuth.hpp
Signals: N/A
Excerpt (<=80 chars):  class OAuth : public Auth {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OAuth
- OAuthStreamKey
```

--------------------------------------------------------------------------------

---[FILE: RestreamAuth.hpp]---
Location: obs-studio-master/frontend/oauth/RestreamAuth.hpp
Signals: N/A
Excerpt (<=80 chars):  class RestreamAuth : public OAuthStreamKey {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RestreamAuth
```

--------------------------------------------------------------------------------

---[FILE: TwitchAuth.hpp]---
Location: obs-studio-master/frontend/oauth/TwitchAuth.hpp
Signals: N/A
Excerpt (<=80 chars):  class TwitchAuth : public OAuthStreamKey {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TwitchAuth
```

--------------------------------------------------------------------------------

---[FILE: YoutubeAuth.hpp]---
Location: obs-studio-master/frontend/oauth/YoutubeAuth.hpp
Signals: N/A
Excerpt (<=80 chars): class YoutubeChatDock;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- YoutubeChatDock
- YoutubeAuth
```

--------------------------------------------------------------------------------

---[FILE: PluginManager.cpp]---
Location: obs-studio-master/frontend/plugin-manager/PluginManager.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace OBS {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- namespace OBS
```

--------------------------------------------------------------------------------

---[FILE: PluginManager.hpp]---
Location: obs-studio-master/frontend/plugin-manager/PluginManager.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace OBS {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ModuleInfo
- PluginManager
- namespace OBS
```

--------------------------------------------------------------------------------

---[FILE: PluginManagerWindow.cpp]---
Location: obs-studio-master/frontend/plugin-manager/PluginManagerWindow.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace OBS {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- namespace OBS
```

--------------------------------------------------------------------------------

---[FILE: PluginManagerWindow.hpp]---
Location: obs-studio-master/frontend/plugin-manager/PluginManagerWindow.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace OBS {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PluginManagerWindow
- namespace OBS
```

--------------------------------------------------------------------------------

---[FILE: aja-ui-main.cpp]---
Location: obs-studio-master/frontend/plugins/aja-output-ui/aja-ui-main.cpp
Signals: N/A
Excerpt (<=80 chars):  struct preview_output {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- preview_output
- vec4
- video_frame
```

--------------------------------------------------------------------------------

---[FILE: aja-ui-main.h]---
Location: obs-studio-master/frontend/plugins/aja-output-ui/aja-ui-main.h
Signals: N/A
Excerpt (<=80 chars): namespace aja {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CardManager
- namespace aja
```

--------------------------------------------------------------------------------

---[FILE: AJAOutputUI.h]---
Location: obs-studio-master/frontend/plugins/aja-output-ui/AJAOutputUI.h
Signals: N/A
Excerpt (<=80 chars):  namespace aja {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CardManager
- AJAOutputUI
- namespace aja
```

--------------------------------------------------------------------------------

---[FILE: decklink-captions.cpp]---
Location: obs-studio-master/frontend/plugins/decklink-captions/decklink-captions.cpp
Signals: N/A
Excerpt (<=80 chars):  struct obs_captions {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_captions
```

--------------------------------------------------------------------------------

---[FILE: decklink-captions.h]---
Location: obs-studio-master/frontend/plugins/decklink-captions/decklink-captions.h
Signals: N/A
Excerpt (<=80 chars):  class DecklinkCaptionsUI : public QDialog {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DecklinkCaptionsUI
```

--------------------------------------------------------------------------------

---[FILE: decklink-ui-main.cpp]---
Location: obs-studio-master/frontend/plugins/decklink-output-ui/decklink-ui-main.cpp
Signals: N/A
Excerpt (<=80 chars):  struct decklink_ui_output {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- decklink_ui_output
- vec4
- video_frame
```

--------------------------------------------------------------------------------

---[FILE: DecklinkOutputUI.h]---
Location: obs-studio-master/frontend/plugins/decklink-output-ui/DecklinkOutputUI.h
Signals: N/A
Excerpt (<=80 chars):  class DecklinkOutputUI : public QDialog {

```c
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DecklinkOutputUI
```

--------------------------------------------------------------------------------

---[FILE: auto-scene-switcher.cpp]---
Location: obs-studio-master/frontend/plugins/frontend-tools/auto-scene-switcher.cpp
Signals: N/A
Excerpt (<=80 chars):  struct SceneSwitch {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SceneSwitch
- SwitcherData
```

--------------------------------------------------------------------------------

---[FILE: auto-scene-switcher.hpp]---
Location: obs-studio-master/frontend/plugins/frontend-tools/auto-scene-switcher.hpp
Signals: N/A
Excerpt (<=80 chars):  struct obs_weak_source;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_weak_source
- QCloseEvent
- SceneSwitcher
```

--------------------------------------------------------------------------------

---[FILE: captions-handler.hpp]---
Location: obs-studio-master/frontend/plugins/frontend-tools/captions-handler.hpp
Signals: N/A
Excerpt (<=80 chars):  class resampler_obj {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- resampler_obj
- captions_handler
- captions_handler_info
```

--------------------------------------------------------------------------------

---[FILE: captions-mssapi-stream.hpp]---
Location: obs-studio-master/frontend/plugins/frontend-tools/captions-mssapi-stream.hpp
Signals: N/A
Excerpt (<=80 chars):  class Deque {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Deque
- mssapi_captions
- CaptionStream
```

--------------------------------------------------------------------------------

---[FILE: captions-mssapi.hpp]---
Location: obs-studio-master/frontend/plugins/frontend-tools/captions-mssapi.hpp
Signals: N/A
Excerpt (<=80 chars):  class mssapi_captions : public captions_handler {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mssapi_captions
```

--------------------------------------------------------------------------------

---[FILE: captions.cpp]---
Location: obs-studio-master/frontend/plugins/frontend-tools/captions.cpp
Signals: N/A
Excerpt (<=80 chars):  struct obs_captions {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_captions
- locale_info
```

--------------------------------------------------------------------------------

---[FILE: captions.hpp]---
Location: obs-studio-master/frontend/plugins/frontend-tools/captions.hpp
Signals: N/A
Excerpt (<=80 chars):  class CaptionsDialog : public QDialog {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CaptionsDialog
```

--------------------------------------------------------------------------------

---[FILE: output-timer.hpp]---
Location: obs-studio-master/frontend/plugins/frontend-tools/output-timer.hpp
Signals: N/A
Excerpt (<=80 chars):  class QCloseEvent;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QCloseEvent
- OutputTimer
```

--------------------------------------------------------------------------------

---[FILE: scripts.cpp]---
Location: obs-studio-master/frontend/plugins/frontend-tools/scripts.cpp
Signals: N/A
Excerpt (<=80 chars):  struct ScriptData {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ScriptData
```

--------------------------------------------------------------------------------

---[FILE: scripts.hpp]---
Location: obs-studio-master/frontend/plugins/frontend-tools/scripts.hpp
Signals: N/A
Excerpt (<=80 chars):  class Ui_ScriptsTool;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Ui_ScriptsTool
- ScriptLogWindow
- ScriptsTool
```

--------------------------------------------------------------------------------

---[FILE: url-text.py]---
Location: obs-studio-master/frontend/plugins/frontend-tools/data/scripts/url-text.py
Signals: N/A
Excerpt (<=80 chars):  def update_text():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- update_text
- refresh_pressed
- script_description
- script_update
- script_defaults
- script_properties
```

--------------------------------------------------------------------------------

---[FILE: OBSBasicSettings.cpp]---
Location: obs-studio-master/frontend/settings/OBSBasicSettings.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace std {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- namespace std
```

--------------------------------------------------------------------------------

---[FILE: OBSBasicSettings.hpp]---
Location: obs-studio-master/frontend/settings/OBSBasicSettings.hpp
Signals: N/A
Excerpt (<=80 chars):  class Auth;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Auth
- OBSBasic
- OBSHotkeyWidget
- OBSPropertiesView
- FFmpegFormat
- OBSTheme
- OBSBasicSettings
```

--------------------------------------------------------------------------------

---[FILE: OBSBasicSettings_Stream.cpp]---
Location: obs-studio-master/frontend/settings/OBSBasicSettings_Stream.cpp
Signals: N/A
Excerpt (<=80 chars):  struct QCef;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QCef
- QCefCookieManager
```

--------------------------------------------------------------------------------

---[FILE: OBSHotkeyEdit.hpp]---
Location: obs-studio-master/frontend/settings/OBSHotkeyEdit.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSBasicSettings;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSBasicSettings
- QWidget
- OBSHotkeyEdit
```

--------------------------------------------------------------------------------

---[FILE: OBSHotkeyLabel.hpp]---
Location: obs-studio-master/frontend/settings/OBSHotkeyLabel.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSHotkeyWidget;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSHotkeyWidget
- OBSHotkeyLabel
```

--------------------------------------------------------------------------------

---[FILE: OBSHotkeyWidget.hpp]---
Location: obs-studio-master/frontend/settings/OBSHotkeyWidget.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSBasicSettings;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSBasicSettings
- OBSHotkeyLabel
- OBSHotkeyWidget
```

--------------------------------------------------------------------------------

---[FILE: manifest.hpp]---
Location: obs-studio-master/frontend/updater/manifest.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace updater {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- File
- Package
- Manifest
- PatchRequest
- PatchResponse
- namespace updater
```

--------------------------------------------------------------------------------

---[FILE: updater.cpp]---
Location: obs-studio-master/frontend/updater/updater.cpp
Signals: N/A
Excerpt (<=80 chars):  struct LastError {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LastError
- update_t
- deletion_t
```

--------------------------------------------------------------------------------

---[FILE: updater.hpp]---
Location: obs-studio-master/frontend/updater/updater.hpp
Signals: N/A
Excerpt (<=80 chars):  class ZSTDDCtx {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ZSTDDCtx
```

--------------------------------------------------------------------------------

---[FILE: AdvancedOutput.hpp]---
Location: obs-studio-master/frontend/utility/AdvancedOutput.hpp
Signals: N/A
Excerpt (<=80 chars):  struct AdvancedOutput : BasicOutputHandler {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AdvancedOutput
```

--------------------------------------------------------------------------------

---[FILE: audio-encoders.cpp]---
Location: obs-studio-master/frontend/utility/audio-encoders.cpp
Signals: N/A
Excerpt (<=80 chars):  struct obs_audio_info aoi;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- obs_audio_info
```

--------------------------------------------------------------------------------

---[FILE: AutoUpdateThread.cpp]---
Location: obs-studio-master/frontend/utility/AutoUpdateThread.cpp
Signals: N/A
Excerpt (<=80 chars):  struct FinishedTrigger {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FinishedTrigger
```

--------------------------------------------------------------------------------

---[FILE: AutoUpdateThread.hpp]---
Location: obs-studio-master/frontend/utility/AutoUpdateThread.hpp
Signals: N/A
Excerpt (<=80 chars):  class AutoUpdateThread : public QThread {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AutoUpdateThread
```

--------------------------------------------------------------------------------

---[FILE: BaseLexer.hpp]---
Location: obs-studio-master/frontend/utility/BaseLexer.hpp
Signals: N/A
Excerpt (<=80 chars):  struct BaseLexer {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseLexer
```

--------------------------------------------------------------------------------

---[FILE: BasicOutputHandler.hpp]---
Location: obs-studio-master/frontend/utility/BasicOutputHandler.hpp
Signals: N/A
Excerpt (<=80 chars):  class OBSBasic;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OBSBasic
- BasicOutputHandler
```

--------------------------------------------------------------------------------

---[FILE: CrashHandler.cpp]---
Location: obs-studio-master/frontend/utility/CrashHandler.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- namespace OBS
```

--------------------------------------------------------------------------------

---[FILE: CrashHandler.hpp]---
Location: obs-studio-master/frontend/utility/CrashHandler.hpp
Signals: N/A
Excerpt (<=80 chars):  namespace OBS {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CrashHandler
- namespace OBS
```

--------------------------------------------------------------------------------

---[FILE: CrashHandler_FreeBSD.cpp]---
Location: obs-studio-master/frontend/utility/CrashHandler_FreeBSD.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace OBS {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- namespace OBS
```

--------------------------------------------------------------------------------

---[FILE: CrashHandler_Linux.cpp]---
Location: obs-studio-master/frontend/utility/CrashHandler_Linux.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace OBS {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- namespace OBS
```

--------------------------------------------------------------------------------

---[FILE: CrashHandler_Windows.cpp]---
Location: obs-studio-master/frontend/utility/CrashHandler_Windows.cpp
Signals: N/A
Excerpt (<=80 chars):  namespace OBS {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- namespace OBS
```

--------------------------------------------------------------------------------

---[FILE: ExtraBrowsersDelegate.hpp]---
Location: obs-studio-master/frontend/utility/ExtraBrowsersDelegate.hpp
Signals: N/A
Excerpt (<=80 chars):  class ExtraBrowsersModel;

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExtraBrowsersModel
- ExtraBrowsersDelegate
```

--------------------------------------------------------------------------------

---[FILE: ExtraBrowsersModel.hpp]---
Location: obs-studio-master/frontend/utility/ExtraBrowsersModel.hpp
Signals: N/A
Excerpt (<=80 chars):  class ExtraBrowsersModel : public QAbstractTableModel {

```cpp
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExtraBrowsersModel
- Item
```

--------------------------------------------------------------------------------

````
