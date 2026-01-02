---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:46Z
part: 8
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 8 of 650)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - ShareX-develop
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/ShareX-develop
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: EasterEggBounce.cs]---
Location: ShareX-develop/ShareX/EasterEggBounce.cs

```csharp
#region License Information (GPL v3)

/*
    ShareX - A program that allows you to take screenshots and share any file type
    Copyright (c) 2007-2025 ShareX Team

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

    Optionally you can also view the license at <http://www.gnu.org/licenses/>.
*/

#endregion License Information (GPL v3)

using ShareX.HelpersLib;
using System;
using System.Drawing;
using System.Windows.Forms;

namespace ShareX
{
    public class EasterEggBounce : IDisposable
    {
        public Form Form { get; private set; }
        public bool IsWorking { get; private set; }
        public Rectangle BounceRectangle { get; set; }
        public int Speed { get; set; } = 20;
        public bool ApplyGravity { get; set; } = true;
        public int GravityPower { get; set; } = 3;
        public int BouncePower { get; set; } = 50;

        private Timer timer;
        private Point velocity;

        public EasterEggBounce(Form form)
        {
            Form = form;

            timer = new Timer();
            timer.Interval = 20;
            timer.Tick += bounceTimer_Tick;

            BounceRectangle = CaptureHelpers.GetScreenWorkingArea();
        }

        public void Start()
        {
            if (!IsWorking)
            {
                IsWorking = true;

                velocity = new Point(RandomFast.Pick(-Speed, Speed), ApplyGravity ? GravityPower : RandomFast.Pick(-Speed, Speed));
                timer.Start();
            }
        }

        public void Stop()
        {
            if (IsWorking)
            {
                if (timer != null)
                {
                    timer.Stop();
                }

                IsWorking = false;
            }
        }

        private void bounceTimer_Tick(object sender, EventArgs e)
        {
            if (Form != null && !Form.IsDisposed)
            {
                int x = Form.Left + velocity.X;
                int windowRight = BounceRectangle.X + BounceRectangle.Width - Form.Width - 1;

                if (x <= BounceRectangle.X)
                {
                    x = BounceRectangle.X;
                    velocity.X = Speed;
                }
                else if (x >= windowRight)
                {
                    x = windowRight;
                    velocity.X = -Speed;
                }

                int y = Form.Top + velocity.Y;
                int windowBottom = BounceRectangle.Y + BounceRectangle.Height - Form.Height - 1;

                if (ApplyGravity)
                {
                    if (y >= windowBottom)
                    {
                        y = windowBottom;
                        velocity.Y = -BouncePower + RandomFast.Next(-10, 10);
                    }
                    else
                    {
                        velocity.Y += GravityPower;
                    }
                }
                else
                {
                    if (y <= BounceRectangle.Y)
                    {
                        y = BounceRectangle.Y;
                        velocity.Y = Speed;
                    }
                    else if (y >= windowBottom)
                    {
                        y = windowBottom;
                        velocity.Y = -Speed;
                    }
                }

                Form.Location = new Point(x, y);
            }
        }

        public void Dispose()
        {
            Stop();

            if (timer != null)
            {
                timer.Dispose();
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Enums.cs]---
Location: ShareX-develop/ShareX/Enums.cs

```csharp
#region License Information (GPL v3)

/*
    ShareX - A program that allows you to take screenshots and share any file type
    Copyright (c) 2007-2025 ShareX Team

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

    Optionally you can also view the license at <http://www.gnu.org/licenses/>.
*/

#endregion License Information (GPL v3)

using ShareX.HelpersLib;
using System;
using System.ComponentModel;

#if MicrosoftStore
using Windows.ApplicationModel;
#endif

namespace ShareX
{
    public enum ShareXBuild
    {
        Debug,
        Release,
        Steam,
        MicrosoftStore,
        Unknown
    }

    public enum UpdateChannel // Localized
    {
        Release,
        PreRelease,
        Dev
    }

    public enum SupportedLanguage
    {
        Automatic, // Localized
        [Description("العربية (Arabic)")]
        Arabic,
        [Description("Nederlands (Dutch)")]
        Dutch,
        [Description("English")]
        English,
        [Description("Français (French)")]
        French,
        [Description("Deutsch (German)")]
        German,
        [Description("עִברִית (Hebrew)")]
        Hebrew,
        [Description("Magyar (Hungarian)")]
        Hungarian,
        [Description("Bahasa Indonesia (Indonesian)")]
        Indonesian,
        [Description("Italiano (Italian)")]
        Italian,
        [Description("日本語 (Japanese)")]
        Japanese,
        [Description("한국어 (Korean)")]
        Korean,
        [Description("Español mexicano (Mexican Spanish)")]
        MexicanSpanish,
        [Description("فارسی (Persian)")]
        Persian,
        [Description("Polski (Polish)")]
        Polish,
        [Description("Português (Portuguese)")]
        Portuguese,
        [Description("Português-Brasil (Portuguese-Brazil)")]
        PortugueseBrazil,
        [Description("Română (Romanian)")]
        Romanian,
        [Description("Русский (Russian)")]
        Russian,
        [Description("简体中文 (Simplified Chinese)")]
        SimplifiedChinese,
        [Description("Español (Spanish)")]
        Spanish,
        [Description("繁體中文 (Traditional Chinese)")]
        TraditionalChinese,
        [Description("Türkçe (Turkish)")]
        Turkish,
        [Description("Українська (Ukrainian)")]
        Ukrainian,
        [Description("Tiếng Việt (Vietnamese)")]
        Vietnamese
    }

    public enum TaskJob
    {
        Job,
        DataUpload,
        FileUpload,
        TextUpload,
        ShortenURL,
        ShareURL,
        Download,
        DownloadUpload
    }

    public enum TaskStatus
    {
        InQueue,
        Preparing,
        Working,
        Stopping,
        Stopped,
        Failed,
        Completed,
        History
    }

    [Flags]
    public enum AfterCaptureTasks // Localized
    {
        None = 0,
        ShowQuickTaskMenu = 1,
        ShowAfterCaptureWindow = 1 << 1,
        BeautifyImage = 1 << 2,
        AddImageEffects = 1 << 3,
        AnnotateImage = 1 << 4,
        CopyImageToClipboard = 1 << 5,
        PinToScreen = 1 << 6,
        SendImageToPrinter = 1 << 7,
        SaveImageToFile = 1 << 8,
        SaveImageToFileWithDialog = 1 << 9,
        SaveThumbnailImageToFile = 1 << 10,
        PerformActions = 1 << 11,
        CopyFileToClipboard = 1 << 12,
        CopyFilePathToClipboard = 1 << 13,
        ShowInExplorer = 1 << 14,
        AnalyzeImage = 1 << 15,
        ScanQRCode = 1 << 16,
        DoOCR = 1 << 17,
        ShowBeforeUploadWindow = 1 << 18,
        UploadImageToHost = 1 << 19,
        DeleteFile = 1 << 20
    }

    [Flags]
    public enum AfterUploadTasks // Localized
    {
        None = 0,
        ShowAfterUploadWindow = 1,
        UseURLShortener = 1 << 1,
        ShareURL = 1 << 2,
        CopyURLToClipboard = 1 << 3,
        OpenURL = 1 << 4,
        ShowQRCode = 1 << 5
    }

    public enum CaptureType
    {
        Fullscreen,
        Monitor,
        ActiveMonitor,
        Window,
        ActiveWindow,
        Region,
        CustomRegion,
        LastRegion
    }

    public enum ScreenRecordStartMethod
    {
        Region,
        ActiveWindow,
        CustomRegion,
        LastRegion
    }

    public enum HotkeyType // Localized
    {
        None,
        // Upload
        [Category(EnumExtensions.HotkeyType_Category_Upload)]
        FileUpload,
        [Category(EnumExtensions.HotkeyType_Category_Upload)]
        FolderUpload,
        [Category(EnumExtensions.HotkeyType_Category_Upload)]
        ClipboardUpload,
        [Category(EnumExtensions.HotkeyType_Category_Upload)]
        ClipboardUploadWithContentViewer,
        [Category(EnumExtensions.HotkeyType_Category_Upload)]
        UploadText,
        [Category(EnumExtensions.HotkeyType_Category_Upload)]
        UploadURL,
        [Category(EnumExtensions.HotkeyType_Category_Upload)]
        DragDropUpload,
        [Category(EnumExtensions.HotkeyType_Category_Upload)]
        ShortenURL,
        [Category(EnumExtensions.HotkeyType_Category_Upload)]
        StopUploads,
        // Screen capture
        [Category(EnumExtensions.HotkeyType_Category_ScreenCapture)]
        PrintScreen,
        [Category(EnumExtensions.HotkeyType_Category_ScreenCapture)]
        ActiveWindow,
        [Category(EnumExtensions.HotkeyType_Category_ScreenCapture)]
        CustomWindow,
        [Category(EnumExtensions.HotkeyType_Category_ScreenCapture)]
        ActiveMonitor,
        [Category(EnumExtensions.HotkeyType_Category_ScreenCapture)]
        RectangleRegion,
        [Category(EnumExtensions.HotkeyType_Category_ScreenCapture)]
        RectangleLight,
        [Category(EnumExtensions.HotkeyType_Category_ScreenCapture)]
        RectangleTransparent,
        [Category(EnumExtensions.HotkeyType_Category_ScreenCapture)]
        CustomRegion,
        [Category(EnumExtensions.HotkeyType_Category_ScreenCapture)]
        LastRegion,
        [Category(EnumExtensions.HotkeyType_Category_ScreenCapture)]
        ScrollingCapture,
        [Category(EnumExtensions.HotkeyType_Category_ScreenCapture)]
        AutoCapture,
        [Category(EnumExtensions.HotkeyType_Category_ScreenCapture)]
        StartAutoCapture,
        [Category(EnumExtensions.HotkeyType_Category_ScreenCapture)]
        StopAutoCapture,
        // Screen record
        [Category(EnumExtensions.HotkeyType_Category_ScreenRecord)]
        ScreenRecorder,
        [Category(EnumExtensions.HotkeyType_Category_ScreenRecord)]
        ScreenRecorderActiveWindow,
        [Category(EnumExtensions.HotkeyType_Category_ScreenRecord)]
        ScreenRecorderCustomRegion,
        [Category(EnumExtensions.HotkeyType_Category_ScreenRecord)]
        StartScreenRecorder,
        [Category(EnumExtensions.HotkeyType_Category_ScreenRecord)]
        ScreenRecorderGIF,
        [Category(EnumExtensions.HotkeyType_Category_ScreenRecord)]
        ScreenRecorderGIFActiveWindow,
        [Category(EnumExtensions.HotkeyType_Category_ScreenRecord)]
        ScreenRecorderGIFCustomRegion,
        [Category(EnumExtensions.HotkeyType_Category_ScreenRecord)]
        StartScreenRecorderGIF,
        [Category(EnumExtensions.HotkeyType_Category_ScreenRecord)]
        StopScreenRecording,
        [Category(EnumExtensions.HotkeyType_Category_ScreenRecord)]
        PauseScreenRecording,
        [Category(EnumExtensions.HotkeyType_Category_ScreenRecord)]
        AbortScreenRecording,
        // Tools
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        ColorPicker,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        ScreenColorPicker,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        Ruler,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        PinToScreen,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        PinToScreenFromScreen,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        PinToScreenFromClipboard,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        PinToScreenFromFile,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        PinToScreenCloseAll,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        ImageEditor,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        ImageBeautifier,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        ImageEffects,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        ImageViewer,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        ImageCombiner,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        ImageSplitter,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        ImageThumbnailer,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        VideoConverter,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        VideoThumbnailer,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        AnalyzeImage,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        OCR,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        QRCode,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        QRCodeDecodeFromScreen,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        QRCodeScanRegion,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        HashCheck,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        Metadata,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        StripMetadata,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        IndexFolder,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        ClipboardViewer,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        BorderlessWindow,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        ActiveWindowBorderless,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        ActiveWindowTopMost,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        InspectWindow,
        [Category(EnumExtensions.HotkeyType_Category_Tools)]
        MonitorTest,
        // Other
        [Category(EnumExtensions.HotkeyType_Category_Other)]
        DisableHotkeys,
        [Category(EnumExtensions.HotkeyType_Category_Other)]
        OpenMainWindow,
        [Category(EnumExtensions.HotkeyType_Category_Other)]
        OpenScreenshotsFolder,
        [Category(EnumExtensions.HotkeyType_Category_Other)]
        OpenHistory,
        [Category(EnumExtensions.HotkeyType_Category_Other)]
        OpenImageHistory,
        [Category(EnumExtensions.HotkeyType_Category_Other)]
        ToggleActionsToolbar,
        [Category(EnumExtensions.HotkeyType_Category_Other)]
        ToggleTrayMenu,
        [Category(EnumExtensions.HotkeyType_Category_Other)]
        ExitShareX
    }

    public enum ToastClickAction // Localized
    {
        CloseNotification,
        AnnotateImage,
        CopyImageToClipboard,
        CopyFile,
        CopyFilePath,
        CopyUrl,
        OpenFile,
        OpenFolder,
        OpenUrl,
        Upload,
        PinToScreen,
        DeleteFile
    }

    public enum ThumbnailViewClickAction // Localized
    {
        Default,
        Select,
        OpenImageViewer,
        OpenFile,
        OpenFolder,
        OpenURL,
        EditImage
    }

    public enum FileExistAction // Localized
    {
        Ask,
        Overwrite,
        UniqueName,
        Cancel
    }

    public enum ImagePreviewVisibility // Localized
    {
        Show, Hide, Automatic
    }

    public enum ImagePreviewLocation // Localized
    {
        Side, Bottom
    }

    public enum ThumbnailTitleLocation // Localized
    {
        Top, Bottom
    }

    public enum RegionCaptureType
    {
        Default, Light, Transparent
    }

    public enum ScreenTearingTestMode
    {
        VerticalLines,
        HorizontalLines
    }

#if !MicrosoftStore
    public enum StartupState
    {
        Disabled,
        DisabledByUser,
        Enabled,
        DisabledByPolicy,
        EnabledByPolicy
    }
#else
    public enum StartupState
    {
        Disabled = StartupTaskState.Disabled,
        DisabledByUser = StartupTaskState.DisabledByUser,
        Enabled = StartupTaskState.Enabled,
        DisabledByPolicy = StartupTaskState.DisabledByPolicy,
        EnabledByPolicy = StartupTaskState.EnabledByPolicy
    }
#endif

    public enum BalloonTipClickAction
    {
        None,
        OpenURL,
        OpenDebugLog
    }

    public enum TaskViewMode // Localized
    {
        ListView,
        ThumbnailView
    }

    public enum NativeMessagingAction
    {
        None,
        UploadImage,
        UploadVideo,
        UploadAudio,
        UploadText,
        ShortenURL
    }

    public enum NotificationSound
    {
        Capture,
        TaskCompleted,
        ActionCompleted,
        Error
    }
}
```

--------------------------------------------------------------------------------

---[FILE: host-manifest-chrome.json]---
Location: ShareX-develop/ShareX/host-manifest-chrome.json

```json
{
  "name": "com.getsharex.sharex",
  "description": "ShareX",
  "path": "ShareX_NativeMessagingHost.exe",
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://nlkoigbdolhchiicbonbihbphgamnaoc/"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: host-manifest-firefox.json]---
Location: ShareX-develop/ShareX/host-manifest-firefox.json

```json
{
  "name": "ShareX",
  "description": "ShareX",
  "path": "ShareX_NativeMessagingHost.exe",
  "type": "stdio",
  "allowed_extensions": [
    "firefox@getsharex.com"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: HotkeyManager.cs]---
Location: ShareX-develop/ShareX/HotkeyManager.cs

```csharp
#region License Information (GPL v3)

/*
    ShareX - A program that allows you to take screenshots and share any file type
    Copyright (c) 2007-2025 ShareX Team

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

    Optionally you can also view the license at <http://www.gnu.org/licenses/>.
*/

#endregion License Information (GPL v3)

using ShareX.HelpersLib;
using ShareX.Properties;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;

namespace ShareX
{
    public class HotkeyManager
    {
        public List<HotkeySettings> Hotkeys { get; private set; }
        public bool IgnoreHotkeys { get; set; }

        public delegate void HotkeyTriggerEventHandler(HotkeySettings hotkeySetting);
        public delegate void HotkeysToggledEventHandler(bool hotkeysEnabled);

        public HotkeyTriggerEventHandler HotkeyTrigger;
        public HotkeysToggledEventHandler HotkeysToggledTrigger;

        private HotkeyForm hotkeyForm;

        public HotkeyManager(HotkeyForm form)
        {
            hotkeyForm = form;
            hotkeyForm.HotkeyPress += HotkeyForm_HotkeyPress;
            hotkeyForm.FormClosed += HotkeyForm_FormClosed;
        }

        private void HotkeyForm_HotkeyPress(ushort id, Keys key, Modifiers modifier)
        {
            if (!IgnoreHotkeys && (!Program.Settings.DisableHotkeysOnFullscreen || !CaptureHelpers.IsActiveWindowFullscreen()))
            {
                HotkeySettings hotkeySetting = Hotkeys.Find(x => x.HotkeyInfo.ID == id);

                if (hotkeySetting != null)
                {
                    OnHotkeyTrigger(hotkeySetting);
                }
            }
        }

        private void HotkeyForm_FormClosed(object sender, FormClosedEventArgs e)
        {
            if (hotkeyForm != null && !hotkeyForm.IsDisposed)
            {
                UnregisterAllHotkeys(false);
            }
        }

        public void UpdateHotkeys(List<HotkeySettings> hotkeys, bool showFailedHotkeys)
        {
            if (Hotkeys != null)
            {
                UnregisterAllHotkeys();
            }

            Hotkeys = hotkeys;

            RegisterAllHotkeys();

            if (showFailedHotkeys)
            {
                ShowFailedHotkeys();
            }
        }

        protected void OnHotkeyTrigger(HotkeySettings hotkeySetting)
        {
            HotkeyTrigger?.Invoke(hotkeySetting);
        }

        public void RegisterHotkey(HotkeySettings hotkeySetting)
        {
            if (!Program.Settings.DisableHotkeys || hotkeySetting.TaskSettings.Job == HotkeyType.DisableHotkeys)
            {
                UnregisterHotkey(hotkeySetting, false);

                if (hotkeySetting.HotkeyInfo.Status != HotkeyStatus.Registered && hotkeySetting.HotkeyInfo.IsValidHotkey)
                {
                    hotkeyForm.RegisterHotkey(hotkeySetting.HotkeyInfo);

                    if (hotkeySetting.HotkeyInfo.Status == HotkeyStatus.Registered)
                    {
                        DebugHelper.WriteLine("Hotkey registered: " + hotkeySetting);
                    }
                    else if (hotkeySetting.HotkeyInfo.Status == HotkeyStatus.Failed)
                    {
                        DebugHelper.WriteLine("Hotkey register failed: " + hotkeySetting);
                    }
                }
                else
                {
                    hotkeySetting.HotkeyInfo.Status = HotkeyStatus.NotConfigured;
                }
            }

            if (!Hotkeys.Contains(hotkeySetting))
            {
                Hotkeys.Add(hotkeySetting);
            }
        }

        public void RegisterAllHotkeys()
        {
            foreach (HotkeySettings hotkeySetting in Hotkeys.ToArray())
            {
                RegisterHotkey(hotkeySetting);
            }
        }

        public void RegisterFailedHotkeys()
        {
            foreach (HotkeySettings hotkeySetting in Hotkeys.Where(x => x.HotkeyInfo.Status == HotkeyStatus.Failed))
            {
                RegisterHotkey(hotkeySetting);
            }
        }

        public void UnregisterHotkey(HotkeySettings hotkeySetting, bool removeFromList = true)
        {
            if (hotkeySetting.HotkeyInfo.Status == HotkeyStatus.Registered)
            {
                hotkeyForm.UnregisterHotkey(hotkeySetting.HotkeyInfo);

                if (hotkeySetting.HotkeyInfo.Status == HotkeyStatus.NotConfigured)
                {
                    DebugHelper.WriteLine("Hotkey unregistered: " + hotkeySetting);
                }
                else if (hotkeySetting.HotkeyInfo.Status == HotkeyStatus.Failed)
                {
                    DebugHelper.WriteLine("Hotkey unregister failed: " + hotkeySetting);
                }
            }

            if (removeFromList)
            {
                Hotkeys.Remove(hotkeySetting);
            }
        }

        public void UnregisterAllHotkeys(bool removeFromList = true, bool temporary = false)
        {
            if (Hotkeys != null)
            {
                foreach (HotkeySettings hotkeySetting in Hotkeys.ToArray())
                {
                    if (!temporary || hotkeySetting.TaskSettings.Job != HotkeyType.DisableHotkeys)
                    {
                        UnregisterHotkey(hotkeySetting, removeFromList);
                    }
                }
            }
        }

        public void ToggleHotkeys(bool hotkeysDisabled)
        {
            if (!hotkeysDisabled)
            {
                RegisterAllHotkeys();
            }
            else
            {
                UnregisterAllHotkeys(false, true);
            }

            HotkeysToggledTrigger?.Invoke(hotkeysDisabled);
        }

        public void ShowFailedHotkeys()
        {
            List<HotkeySettings> failedHotkeysList = Hotkeys.Where(x => x.HotkeyInfo.Status == HotkeyStatus.Failed).ToList();

            if (failedHotkeysList.Count > 0)
            {
                string failedHotkeys = string.Join("\r\n", failedHotkeysList.Select(x => $"[{x.HotkeyInfo}] {x.TaskSettings}"));
                string hotkeyText = failedHotkeysList.Count > 1 ? Resources.HotkeyManager_ShowFailedHotkeys_hotkeys : Resources.HotkeyManager_ShowFailedHotkeys_hotkey;
                string text = string.Format(Resources.HotkeyManager_ShowFailedHotkeys_Unable_to_register_hotkey, hotkeyText, failedHotkeys);

                MessageBox.Show(text, "ShareX - " + Resources.HotkeyManager_ShowFailedHotkeys_Hotkey_registration_failed, MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        }

        public void ResetHotkeys()
        {
            UnregisterAllHotkeys();
            Hotkeys.AddRange(GetDefaultHotkeyList());
            RegisterAllHotkeys();

            if (Program.Settings.DisableHotkeys)
            {
                TaskHelpers.ToggleHotkeys();
            }
        }

        public static List<HotkeySettings> GetDefaultHotkeyList()
        {
            return new List<HotkeySettings>
            {
                new HotkeySettings(HotkeyType.RectangleRegion, Keys.Control | Keys.PrintScreen),
                new HotkeySettings(HotkeyType.PrintScreen, Keys.PrintScreen),
                new HotkeySettings(HotkeyType.ActiveWindow, Keys.Alt | Keys.PrintScreen),
                new HotkeySettings(HotkeyType.ScreenRecorder, Keys.Shift | Keys.PrintScreen),
                new HotkeySettings(HotkeyType.ScreenRecorderGIF, Keys.Control | Keys.Shift | Keys.PrintScreen)
            };
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: HotkeysConfig.cs]---
Location: ShareX-develop/ShareX/HotkeysConfig.cs

```csharp
#region License Information (GPL v3)

/*
    ShareX - A program that allows you to take screenshots and share any file type
    Copyright (c) 2007-2025 ShareX Team

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

    Optionally you can also view the license at <http://www.gnu.org/licenses/>.
*/

#endregion License Information (GPL v3)

using ShareX.HelpersLib;
using System.Collections.Generic;

namespace ShareX
{
    public class HotkeysConfig : SettingsBase<HotkeysConfig>
    {
        public List<HotkeySettings> Hotkeys = HotkeyManager.GetDefaultHotkeyList();
    }
}
```

--------------------------------------------------------------------------------

---[FILE: HotkeySettings.cs]---
Location: ShareX-develop/ShareX/HotkeySettings.cs

```csharp
#region License Information (GPL v3)

/*
    ShareX - A program that allows you to take screenshots and share any file type
    Copyright (c) 2007-2025 ShareX Team

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

    Optionally you can also view the license at <http://www.gnu.org/licenses/>.
*/

#endregion License Information (GPL v3)

using ShareX.HelpersLib;
using System.Windows.Forms;

namespace ShareX
{
    public class HotkeySettings
    {
        public HotkeyInfo HotkeyInfo { get; set; }

        public TaskSettings TaskSettings { get; set; }

        public HotkeySettings()
        {
            HotkeyInfo = new HotkeyInfo();
        }

        public HotkeySettings(HotkeyType job, Keys hotkey = Keys.None) : this()
        {
            TaskSettings = TaskSettings.GetDefaultTaskSettings();
            TaskSettings.Job = job;
            HotkeyInfo = new HotkeyInfo(hotkey);
        }

        public override string ToString()
        {
            if (HotkeyInfo != null && TaskSettings != null)
            {
                return string.Format("Hotkey: {0}, Description: {1}, Job: {2}", HotkeyInfo, TaskSettings, TaskSettings.Job);
            }

            return "";
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ImageData.cs]---
Location: ShareX-develop/ShareX/ImageData.cs

```csharp
#region License Information (GPL v3)

/*
    ShareX - A program that allows you to take screenshots and share any file type
    Copyright (c) 2007-2025 ShareX Team

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

    Optionally you can also view the license at <http://www.gnu.org/licenses/>.
*/

#endregion License Information (GPL v3)

using ShareX.HelpersLib;
using ShareX.Properties;
using System;
using System.IO;
using System.Windows.Forms;

namespace ShareX
{
    public class ImageData : IDisposable
    {
        public MemoryStream ImageStream { get; set; }
        public EImageFormat ImageFormat { get; set; }

        public bool Write(string filePath)
        {
            try
            {
                if (ImageStream != null && !string.IsNullOrEmpty(filePath))
                {
                    return ImageStream.WriteToFile(filePath);
                }
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);

                string message = $"{Resources.ImageData_Write_Error_Message}\r\n\"{filePath}\"";

                if (e is UnauthorizedAccessException || e is FileNotFoundException)
                {
                    message += "\r\n\r\n" + Resources.YourAntiVirusSoftwareOrTheControlledFolderAccessFeatureInWindowsCouldBeBlockingShareX;
                }

                MessageBox.Show(message, "ShareX - " + Resources.Error, MessageBoxButtons.OK, MessageBoxIcon.Error);
            }

            return false;
        }

        public void Dispose()
        {
            ImageStream?.Dispose();
        }
    }
}
```

--------------------------------------------------------------------------------

````
