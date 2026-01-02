---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:46Z
part: 19
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 19 of 650)

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

---[FILE: CaptureActiveMonitor.cs]---
Location: ShareX-develop/ShareX/CaptureHelpers/CaptureActiveMonitor.cs

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
using System.Drawing;

namespace ShareX
{
    public class CaptureActiveMonitor : CaptureBase
    {
        protected override TaskMetadata Execute(TaskSettings taskSettings)
        {
            Rectangle rect = CaptureHelpers.GetActiveScreenWorkingArea();
            TaskMetadata metadata = CreateMetadata(rect);
            metadata.Image = TaskHelpers.GetScreenshot(taskSettings).CaptureActiveMonitor();
            return metadata;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CaptureActiveWindow.cs]---
Location: ShareX-develop/ShareX/CaptureHelpers/CaptureActiveWindow.cs

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

namespace ShareX
{
    public class CaptureActiveWindow : CaptureBase
    {
        protected override TaskMetadata Execute(TaskSettings taskSettings)
        {
            TaskMetadata metadata = CreateMetadata();

            if (taskSettings.CaptureSettings.CaptureTransparent && !taskSettings.CaptureSettings.CaptureClientArea)
            {
                metadata.Image = TaskHelpers.GetScreenshot(taskSettings).CaptureActiveWindowTransparent();
            }
            else
            {
                metadata.Image = TaskHelpers.GetScreenshot(taskSettings).CaptureActiveWindow();
            }

            return metadata;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CaptureBase.cs]---
Location: ShareX-develop/ShareX/CaptureHelpers/CaptureBase.cs

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
using System.Threading;
using System.Threading.Tasks;

namespace ShareX
{
    public abstract class CaptureBase
    {
        public bool AllowAutoHideForm { get; set; } = true;
        public bool AllowAnnotation { get; set; } = true;

        public void Capture(bool autoHideForm)
        {
            Capture(null, autoHideForm);
        }

        public void Capture(TaskSettings taskSettings = null, bool autoHideForm = false)
        {
            if (taskSettings == null) taskSettings = TaskSettings.GetDefaultTaskSettings();

            if (taskSettings.GeneralSettings.ToastWindowAutoHide)
            {
                NotificationForm.CloseActiveForm();
            }

            if (taskSettings.CaptureSettings.ScreenshotDelay > 0)
            {
                int delay = (int)(taskSettings.CaptureSettings.ScreenshotDelay * 1000);

                Task.Delay(delay).ContinueInCurrentContext(() =>
                {
                    CaptureInternal(taskSettings, autoHideForm);
                });
            }
            else
            {
                CaptureInternal(taskSettings, autoHideForm);
            }
        }

        protected abstract TaskMetadata Execute(TaskSettings taskSettings);

        private void CaptureInternal(TaskSettings taskSettings, bool autoHideForm)
        {
            bool wait = false;
            bool showDesktopIcons = false;
            bool showMainForm = false;

            if (taskSettings.CaptureSettings.CaptureAutoHideDesktopIcons && !CaptureHelpers.IsActiveWindowFullscreen() && DesktopIconManager.AreDesktopIconsVisible())
            {
                DesktopIconManager.SetDesktopIconsVisibility(false);
                showDesktopIcons = true;
                wait = true;
            }

            if (autoHideForm && AllowAutoHideForm)
            {
                Program.MainForm.Hide();
                showMainForm = true;
                wait = true;
            }

            if (wait)
            {
                Thread.Sleep(250);
            }

            TaskMetadata metadata = null;

            try
            {
                AllowAnnotation = true;
                metadata = Execute(taskSettings);
            }
            catch (Exception ex)
            {
                DebugHelper.WriteException(ex);
            }
            finally
            {
                if (showDesktopIcons)
                {
                    DesktopIconManager.SetDesktopIconsVisibility(true);
                }

                if (showMainForm)
                {
                    Program.MainForm.ForceActivate();
                }

                AfterCapture(metadata, taskSettings);
            }
        }

        private void AfterCapture(TaskMetadata metadata, TaskSettings taskSettings)
        {
            if (metadata != null && metadata.Image != null)
            {
                TaskHelpers.PlayNotificationSoundAsync(NotificationSound.Capture, taskSettings);

                if (taskSettings.AfterCaptureJob.HasFlag(AfterCaptureTasks.AnnotateImage) && !AllowAnnotation)
                {
                    taskSettings.AfterCaptureJob = taskSettings.AfterCaptureJob.Remove(AfterCaptureTasks.AnnotateImage);
                }

                if (taskSettings.ImageSettings.ImageEffectOnlyRegionCapture &&
                    GetType() != typeof(CaptureRegion) && GetType() != typeof(CaptureLastRegion))
                {
                    taskSettings.AfterCaptureJob = taskSettings.AfterCaptureJob.Remove(AfterCaptureTasks.AddImageEffects);
                }

                UploadManager.RunImageTask(metadata, taskSettings);
            }
        }

        protected TaskMetadata CreateMetadata()
        {
            return CreateMetadata(Rectangle.Empty, null);
        }

        protected TaskMetadata CreateMetadata(Rectangle insideRect)
        {
            return CreateMetadata(insideRect, "explorer");
        }

        protected TaskMetadata CreateMetadata(Rectangle insideRect, string ignoreProcess)
        {
            TaskMetadata metadata = new TaskMetadata();

            IntPtr handle = NativeMethods.GetForegroundWindow();
            WindowInfo windowInfo = new WindowInfo(handle);

            if ((ignoreProcess == null || !windowInfo.ProcessName.Equals(ignoreProcess, StringComparison.OrdinalIgnoreCase)) &&
                (insideRect.IsEmpty || windowInfo.Rectangle.Contains(insideRect)))
            {
                metadata.UpdateInfo(windowInfo);
            }

            return metadata;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CaptureCustomRegion.cs]---
Location: ShareX-develop/ShareX/CaptureHelpers/CaptureCustomRegion.cs

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

using System.Drawing;

namespace ShareX
{
    public class CaptureCustomRegion : CaptureBase
    {
        protected override TaskMetadata Execute(TaskSettings taskSettings)
        {
            Rectangle rect = taskSettings.CaptureSettings.CaptureCustomRegion;
            TaskMetadata metadata = CreateMetadata(rect);
            metadata.Image = TaskHelpers.GetScreenshot(taskSettings).CaptureRectangle(rect);
            return metadata;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CaptureCustomWindow.cs]---
Location: ShareX-develop/ShareX/CaptureHelpers/CaptureCustomWindow.cs

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
using System.Windows.Forms;

namespace ShareX
{
    public class CaptureCustomWindow : CaptureWindow
    {
        protected override TaskMetadata Execute(TaskSettings taskSettings)
        {
            string windowTitle = taskSettings.CaptureSettings.CaptureCustomWindow;

            if (!string.IsNullOrEmpty(windowTitle))
            {
                IntPtr hWnd = NativeMethods.SearchWindow(windowTitle);

                if (hWnd == IntPtr.Zero)
                {
                    MessageBox.Show(Resources.UnableToFindAWindowWithSpecifiedWindowTitle, "ShareX", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                else
                {
                    WindowHandle = hWnd;

                    return base.Execute(taskSettings);
                }
            }

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CaptureFullscreen.cs]---
Location: ShareX-develop/ShareX/CaptureHelpers/CaptureFullscreen.cs

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
using System.Drawing;

namespace ShareX
{
    public class CaptureFullscreen : CaptureBase
    {
        protected override TaskMetadata Execute(TaskSettings taskSettings)
        {
            Rectangle rect = CaptureHelpers.GetScreenWorkingArea();
            TaskMetadata metadata = CreateMetadata(rect);
            metadata.Image = TaskHelpers.GetScreenshot(taskSettings).CaptureFullscreen();
            return metadata;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CaptureLastRegion.cs]---
Location: ShareX-develop/ShareX/CaptureHelpers/CaptureLastRegion.cs

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

using ShareX.ScreenCaptureLib;
using System.Drawing;

namespace ShareX
{
    public class CaptureLastRegion : CaptureRegion
    {
        protected override TaskMetadata Execute(TaskSettings taskSettings)
        {
            switch (lastRegionCaptureType)
            {
                default:
                case RegionCaptureType.Default:
                    if (RegionCaptureForm.LastRegionFillPath != null)
                    {
                        using (Bitmap screenshot = TaskHelpers.GetScreenshot(taskSettings).CaptureFullscreen())
                        {
                            Bitmap bmp = RegionCaptureTasks.ApplyRegionPathToImage(screenshot, RegionCaptureForm.LastRegionFillPath, out _);
                            return new TaskMetadata(bmp);
                        }
                    }
                    else
                    {
                        return ExecuteRegionCapture(taskSettings);
                    }
                case RegionCaptureType.Light:
                    if (!RegionCaptureLightForm.LastScreenSelectionRectangle.IsEmpty)
                    {
                        Bitmap bmp = TaskHelpers.GetScreenshot(taskSettings).CaptureRectangle(RegionCaptureLightForm.LastScreenSelectionRectangle);
                        return new TaskMetadata(bmp);
                    }
                    else
                    {
                        return ExecuteRegionCaptureLight(taskSettings);
                    }
                case RegionCaptureType.Transparent:
                    if (!RegionCaptureLightForm.LastScreenSelectionRectangle.IsEmpty)
                    {
                        Bitmap bmp = TaskHelpers.GetScreenshot(taskSettings).CaptureRectangle(RegionCaptureLightForm.LastScreenSelectionRectangle);
                        return new TaskMetadata(bmp);
                    }
                    else
                    {
                        return ExecuteRegionCaptureTransparent(taskSettings);
                    }
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CaptureMonitor.cs]---
Location: ShareX-develop/ShareX/CaptureHelpers/CaptureMonitor.cs

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

using System.Drawing;

namespace ShareX
{
    public class CaptureMonitor : CaptureBase
    {
        public Rectangle MonitorRectangle { get; private set; }

        public CaptureMonitor(Rectangle monitorRectangle)
        {
            MonitorRectangle = monitorRectangle;
        }

        protected override TaskMetadata Execute(TaskSettings taskSettings)
        {
            TaskMetadata metadata = CreateMetadata(MonitorRectangle);
            metadata.Image = TaskHelpers.GetScreenshot().CaptureRectangle(MonitorRectangle);
            return metadata;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CaptureRegion.cs]---
Location: ShareX-develop/ShareX/CaptureHelpers/CaptureRegion.cs

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
using ShareX.ScreenCaptureLib;
using System.Drawing;
using System.Windows.Forms;

namespace ShareX
{
    public class CaptureRegion : CaptureBase
    {
        protected static RegionCaptureType lastRegionCaptureType = RegionCaptureType.Default;

        public RegionCaptureType RegionCaptureType { get; protected set; }

        public CaptureRegion()
        {
        }

        public CaptureRegion(RegionCaptureType regionCaptureType)
        {
            RegionCaptureType = regionCaptureType;
        }

        protected override TaskMetadata Execute(TaskSettings taskSettings)
        {
            switch (RegionCaptureType)
            {
                default:
                case RegionCaptureType.Default:
                    return ExecuteRegionCapture(taskSettings);
                case RegionCaptureType.Light:
                    return ExecuteRegionCaptureLight(taskSettings);
                case RegionCaptureType.Transparent:
                    return ExecuteRegionCaptureTransparent(taskSettings);
            }
        }

        protected TaskMetadata ExecuteRegionCapture(TaskSettings taskSettings)
        {
            RegionCaptureMode mode;

            if (taskSettings.AdvancedSettings.RegionCaptureDisableAnnotation)
            {
                mode = RegionCaptureMode.Default;
            }
            else
            {
                mode = RegionCaptureMode.Annotation;
            }

            Bitmap canvas;
            Screenshot screenshot = TaskHelpers.GetScreenshot(taskSettings);
            screenshot.CaptureCursor = false;

            if (taskSettings.CaptureSettings.SurfaceOptions.ActiveMonitorMode)
            {
                canvas = screenshot.CaptureActiveMonitor();
            }
            else
            {
                canvas = screenshot.CaptureFullscreen();
            }

            CursorData cursorData = null;

            if (taskSettings.CaptureSettings.ShowCursor)
            {
                cursorData = new CursorData();
            }

            using (RegionCaptureForm form = new RegionCaptureForm(mode, taskSettings.CaptureSettingsReference.SurfaceOptions, canvas))
            {
                if (cursorData != null && cursorData.IsVisible)
                {
                    form.AddCursor(cursorData.ToBitmap(), form.PointToClient(cursorData.DrawPosition));
                }

                form.ShowDialog();

                Bitmap result = form.GetResultImage();

                if (result != null)
                {
                    TaskMetadata metadata = new TaskMetadata(result);

                    if (form.IsImageModified)
                    {
                        AllowAnnotation = false;
                    }

                    if (form.Result == RegionResult.Region)
                    {
                        WindowInfo windowInfo = form.GetWindowInfo();
                        metadata.UpdateInfo(windowInfo);
                    }

                    lastRegionCaptureType = RegionCaptureType.Default;

                    return metadata;
                }
            }

            return null;
        }

        protected TaskMetadata ExecuteRegionCaptureLight(TaskSettings taskSettings)
        {
            Bitmap canvas;
            Screenshot screenshot = TaskHelpers.GetScreenshot(taskSettings);

            if (taskSettings.CaptureSettings.SurfaceOptions.ActiveMonitorMode)
            {
                canvas = screenshot.CaptureActiveMonitor();
            }
            else
            {
                canvas = screenshot.CaptureFullscreen();
            }

            bool activeMonitorMode = taskSettings.CaptureSettings.SurfaceOptions.ActiveMonitorMode;

            using (RegionCaptureLightForm rectangleLight = new RegionCaptureLightForm(canvas, activeMonitorMode))
            {
                if (rectangleLight.ShowDialog() == DialogResult.OK)
                {
                    Bitmap result = rectangleLight.GetAreaImage();

                    if (result != null)
                    {
                        lastRegionCaptureType = RegionCaptureType.Light;

                        return new TaskMetadata(result);
                    }
                }
            }

            return null;
        }

        protected TaskMetadata ExecuteRegionCaptureTransparent(TaskSettings taskSettings)
        {
            bool activeMonitorMode = taskSettings.CaptureSettings.SurfaceOptions.ActiveMonitorMode;

            using (RegionCaptureLightForm rectangleTransparent = new RegionCaptureLightForm(null, activeMonitorMode))
            {
                if (rectangleTransparent.ShowDialog() == DialogResult.OK)
                {
                    Screenshot screenshot = TaskHelpers.GetScreenshot(taskSettings);
                    Bitmap result = rectangleTransparent.GetAreaImage(screenshot);

                    if (result != null)
                    {
                        lastRegionCaptureType = RegionCaptureType.Transparent;

                        return new TaskMetadata(result);
                    }
                }
            }

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CaptureWindow.cs]---
Location: ShareX-develop/ShareX/CaptureHelpers/CaptureWindow.cs

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
using System.Threading;

namespace ShareX
{
    public class CaptureWindow : CaptureBase
    {
        public IntPtr WindowHandle { get; protected set; }

        public CaptureWindow()
        {
        }

        public CaptureWindow(IntPtr windowHandle)
        {
            WindowHandle = windowHandle;

            AllowAutoHideForm = WindowHandle != Program.MainForm.Handle;
        }

        protected override TaskMetadata Execute(TaskSettings taskSettings)
        {
            WindowInfo windowInfo = new WindowInfo(WindowHandle);

            if (windowInfo.IsMinimized)
            {
                windowInfo.Restore();
                Thread.Sleep(250);
            }

            if (!windowInfo.IsActive)
            {
                windowInfo.Activate();
                Thread.Sleep(100);
            }

            TaskMetadata metadata = new TaskMetadata();
            metadata.UpdateInfo(windowInfo);

            if (taskSettings.CaptureSettings.CaptureTransparent && !taskSettings.CaptureSettings.CaptureClientArea)
            {
                metadata.Image = TaskHelpers.GetScreenshot(taskSettings).CaptureWindowTransparent(WindowHandle);
            }
            else
            {
                metadata.Image = TaskHelpers.GetScreenshot(taskSettings).CaptureWindow(WindowHandle);
            }

            return metadata;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: BeforeUploadControl.cs]---
Location: ShareX-develop/ShareX/Controls/BeforeUploadControl.cs

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
using ShareX.UploadersLib;
using System;
using System.Linq;
using System.Windows.Forms;

namespace ShareX
{
    public partial class BeforeUploadControl : UserControl
    {
        public delegate void EventHandler(string currentDestination);
        public event EventHandler InitCompleted;

        public BeforeUploadControl()
        {
            InitializeComponent();
        }

        public void Init(TaskInfo info)
        {
            switch (info.DataType)
            {
                case EDataType.Image:
                    InitCapture(info.TaskSettings);
                    break;
                case EDataType.Text:
                    Helpers.GetEnums<TextDestination>().ForEach(x =>
                    {
                        if (x != TextDestination.FileUploader)
                        {
                            string overrideText = null;

                            if (x == TextDestination.CustomTextUploader)
                            {
                                overrideText = GetCustomUploaderName(Program.UploadersConfig.CustomTextUploaderSelected, info.TaskSettings);
                            }

                            AddDestination<TextDestination>((int)x, EDataType.Text, info.TaskSettings, overrideText);
                        }
                    });

                    Helpers.GetEnums<FileDestination>().ForEach(x =>
                    {
                        string overrideText = null;

                        if (x == FileDestination.CustomFileUploader)
                        {
                            overrideText = GetCustomUploaderName(Program.UploadersConfig.CustomFileUploaderSelected, info.TaskSettings);
                        }

                        AddDestination<FileDestination>((int)x, EDataType.Text, info.TaskSettings, overrideText);
                    });

                    flp.Controls.OfType<RadioButton>().ForEach(x =>
                    {
                        if (info.TaskSettings.TextDestination != TextDestination.FileUploader)
                        {
                            x.Checked = x.Tag is TextDestination textDestination && textDestination == info.TaskSettings.TextDestination;
                        }
                        else
                        {
                            x.Checked = x.Tag is FileDestination fileDestination && fileDestination == info.TaskSettings.TextFileDestination;
                        }
                    });
                    break;
                case EDataType.File:
                    Helpers.GetEnums<FileDestination>().ForEach(x =>
                    {
                        string overrideText = null;

                        if (x == FileDestination.CustomFileUploader)
                        {
                            overrideText = GetCustomUploaderName(Program.UploadersConfig.CustomFileUploaderSelected, info.TaskSettings);
                        }

                        AddDestination<FileDestination>((int)x, EDataType.File, info.TaskSettings, overrideText);
                    });

                    flp.Controls.OfType<RadioButton>().ForEach(x =>
                    {
                        x.Checked = x.Tag is FileDestination fileDestination && fileDestination == info.TaskSettings.FileDestination;
                    });
                    break;
                case EDataType.URL:
                    Helpers.GetEnums<UrlShortenerType>().ForEach(x =>
                    {
                        string overrideText = null;

                        if (x == UrlShortenerType.CustomURLShortener)
                        {
                            overrideText = GetCustomUploaderName(Program.UploadersConfig.CustomURLShortenerSelected, info.TaskSettings);
                        }

                        AddDestination<UrlShortenerType>((int)x, EDataType.URL, info.TaskSettings, overrideText);
                    });

                    flp.Controls.OfType<RadioButton>().ForEach(x =>
                    {
                        x.Checked = x.Tag is UrlShortenerType urlShortenerType && urlShortenerType == info.TaskSettings.URLShortenerDestination;
                    });

                    break;
            }

            OnInitCompleted();
        }

        public void InitCapture(TaskSettings taskSettings)
        {
            Helpers.GetEnums<ImageDestination>().ForEach(x =>
            {
                if (x != ImageDestination.FileUploader)
                {
                    string overrideText = null;

                    if (x == ImageDestination.CustomImageUploader)
                    {
                        overrideText = GetCustomUploaderName(Program.UploadersConfig.CustomImageUploaderSelected, taskSettings);
                    }

                    AddDestination<ImageDestination>((int)x, EDataType.Image, taskSettings, overrideText);
                }
            });

            Helpers.GetEnums<FileDestination>().ForEach(x =>
            {
                string overrideText = null;

                if (x == FileDestination.CustomFileUploader)
                {
                    overrideText = GetCustomUploaderName(Program.UploadersConfig.CustomFileUploaderSelected, taskSettings);
                }

                AddDestination<FileDestination>((int)x, EDataType.File, taskSettings, overrideText);
            });

            flp.Controls.OfType<RadioButton>().ForEach(x =>
            {
                if (taskSettings.ImageDestination != ImageDestination.FileUploader)
                {
                    x.Checked = x.Tag is ImageDestination imageDestination && imageDestination == taskSettings.ImageDestination;
                }
                else
                {
                    x.Checked = x.Tag is FileDestination fileDestination && fileDestination == taskSettings.ImageFileDestination;
                }
            });
        }

        private void OnInitCompleted()
        {
            if (InitCompleted != null)
            {
                RadioButton rbDestination = flp.Controls.OfType<RadioButton>().FirstOrDefault(x => x.Checked);
                string currentDestination = "";
                if (rbDestination != null)
                {
                    currentDestination = rbDestination.Text;
                }
                InitCompleted(currentDestination);
            }
        }

        private void AddDestination<T>(int index, EDataType dataType, TaskSettings taskSettings, string overrideText = null)
        {
            Enum destination = (Enum)Enum.ToObject(typeof(T), index);

            if (UploadersConfigValidator.Validate<T>(index, Program.UploadersConfig))
            {
                RadioButton rb = new RadioButton() { AutoSize = true };

                rb.Text = string.IsNullOrEmpty(overrideText) ? destination.GetLocalizedDescription() :
                    string.Format("{0} [{1}]", Resources.BeforeUploadControl_AddDestination_Custom, overrideText);
                rb.Tag = destination;
                rb.CheckedChanged += (sender, e) => SetDestinations(rb.Checked, dataType, rb.Tag, taskSettings);

                flp.Controls.Add(rb);
            }
        }

        private void SetDestinations(bool isActive, EDataType dataType, object destination, TaskSettings taskSettings)
        {
            if (!isActive) return;

            switch (dataType)
            {
                case EDataType.Image:
                    if (destination is ImageDestination imageDestination)
                    {
                        taskSettings.ImageDestination = imageDestination;
                    }
                    else if (destination is FileDestination imageFileDestination)
                    {
                        taskSettings.ImageDestination = ImageDestination.FileUploader;
                        taskSettings.ImageFileDestination = imageFileDestination;
                    }
                    break;
                case EDataType.Text:
                    if (destination is TextDestination textDestination)
                    {
                        taskSettings.TextDestination = textDestination;
                    }
                    else if (destination is FileDestination textFileDestination)
                    {
                        taskSettings.TextDestination = TextDestination.FileUploader;
                        taskSettings.TextFileDestination = textFileDestination;
                    }
                    break;
                case EDataType.File:
                    if (destination is FileDestination fileDestination)
                    {
                        taskSettings.ImageDestination = ImageDestination.FileUploader;
                        taskSettings.TextDestination = TextDestination.FileUploader;
                        taskSettings.ImageFileDestination = taskSettings.TextFileDestination = taskSettings.FileDestination = fileDestination;
                    }
                    break;
                case EDataType.URL:
                    if (destination is UrlShortenerType urlShortenerDestination)
                    {
                        taskSettings.URLShortenerDestination = urlShortenerDestination;
                    }
                    break;
            }
        }

        private string GetCustomUploaderName(int index, TaskSettings taskSettings)
        {
            if (taskSettings.OverrideCustomUploader)
            {
                index = taskSettings.CustomUploaderIndex.BetweenOrDefault(0, Program.UploadersConfig.CustomUploadersList.Count - 1);
            }

            CustomUploaderItem cui = Program.UploadersConfig.CustomUploadersList.ReturnIfValidIndex(index);

            if (cui != null)
            {
                return cui.ToString();
            }

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

````
