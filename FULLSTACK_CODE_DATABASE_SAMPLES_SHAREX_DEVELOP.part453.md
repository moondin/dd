---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 453
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 453 of 650)

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

---[FILE: RegionCaptureTasks.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/RegionCaptureTasks.cs

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
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace ShareX.ScreenCaptureLib
{
    public static class RegionCaptureTasks
    {
        public static Bitmap GetRegionImage(RegionCaptureOptions options = null)
        {
            RegionCaptureOptions newOptions = GetRegionCaptureOptions(options);

            using (RegionCaptureForm form = new RegionCaptureForm(RegionCaptureMode.Default, newOptions))
            {
                form.ShowDialog();

                return form.GetResultImage();
            }
        }

        public static Bitmap GetRegionImage(out Rectangle rect, RegionCaptureOptions options = null)
        {
            RegionCaptureOptions newOptions = GetRegionCaptureOptions(options);

            using (RegionCaptureForm form = new RegionCaptureForm(RegionCaptureMode.Default, newOptions))
            {
                form.ShowDialog();

                rect = form.GetSelectedRectangle();
                return form.GetResultImage();
            }
        }

        public static bool GetRectangleRegion(out Rectangle rect, RegionCaptureOptions options = null)
        {
            RegionCaptureOptions newOptions = GetRegionCaptureOptions(options);

            using (RegionCaptureForm form = new RegionCaptureForm(RegionCaptureMode.Default, newOptions))
            {
                form.ShowDialog();

                rect = form.GetSelectedRectangle();
            }

            return !rect.IsEmpty;
        }

        public static bool GetRectangleRegion(out Rectangle rect, out WindowInfo windowInfo, RegionCaptureOptions options = null)
        {
            RegionCaptureOptions newOptions = GetRegionCaptureOptions(options);

            using (RegionCaptureForm form = new RegionCaptureForm(RegionCaptureMode.Default, newOptions))
            {
                form.ShowDialog();

                rect = form.GetSelectedRectangle();
                windowInfo = form.GetWindowInfo();
            }

            return !rect.IsEmpty;
        }

        public static bool GetRectangleRegionTransparent(out Rectangle rect)
        {
            using (RegionCaptureLightForm regionCaptureTransparentForm = new RegionCaptureLightForm(null))
            {
                if (regionCaptureTransparentForm.ShowDialog() == DialogResult.OK)
                {
                    rect = regionCaptureTransparentForm.ScreenSelectionRectangle;
                    return true;
                }
            }

            rect = Rectangle.Empty;
            return false;
        }

        public static PointInfo GetPointInfo(RegionCaptureOptions options, Bitmap canvas = null)
        {
            RegionCaptureOptions newOptions = GetRegionCaptureOptions(options);
            newOptions.DetectWindows = false;
            newOptions.BackgroundDimStrength = 0;

            using (RegionCaptureForm form = new RegionCaptureForm(RegionCaptureMode.ScreenColorPicker, newOptions, canvas))
            {
                form.ShowDialog();

                if (form.Result == RegionResult.Region)
                {
                    PointInfo pointInfo = new PointInfo();
                    pointInfo.Position = form.CurrentPosition;
                    pointInfo.Color = form.ShapeManager.GetCurrentColor();
                    return pointInfo;
                }
            }

            return null;
        }

        public static SimpleWindowInfo GetWindowInfo(RegionCaptureOptions options)
        {
            RegionCaptureOptions newOptions = GetRegionCaptureOptions(options);
            newOptions.BackgroundDimStrength = 0;
            newOptions.ShowMagnifier = false;

            using (RegionCaptureForm form = new RegionCaptureForm(RegionCaptureMode.OneClick, newOptions))
            {
                form.ShowDialog();

                if (form.Result == RegionResult.Region)
                {
                    return form.SelectedWindow;
                }
            }

            return null;
        }

        public static void ShowScreenColorPickerDialog(RegionCaptureOptions options)
        {
            Color color = Color.Red;
            ColorPickerForm colorPickerForm = new ColorPickerForm(color, true, true, options.ColorPickerOptions);
            colorPickerForm.EnableScreenColorPickerButton(() => GetPointInfo(options));
            colorPickerForm.Show();
        }

        public static void ShowScreenRuler(RegionCaptureOptions options)
        {
            RegionCaptureOptions newOptions = GetRegionCaptureOptions(options);
            newOptions.QuickCrop = false;
            newOptions.UseLightResizeNodes = true;

            using (RegionCaptureForm form = new RegionCaptureForm(RegionCaptureMode.Ruler, newOptions))
            {
                form.ShowDialog();
            }
        }

        public static Bitmap ApplyRegionPathToImage(Bitmap bmp, GraphicsPath gp, out Rectangle resultArea)
        {
            if (bmp != null && gp != null)
            {
                Rectangle regionArea = Rectangle.Round(gp.GetBounds());
                Rectangle screenRectangle = CaptureHelpers.GetScreenBounds();
                resultArea = Rectangle.Intersect(regionArea, new Rectangle(0, 0, screenRectangle.Width, screenRectangle.Height));

                if (resultArea.IsValid())
                {
                    using (Bitmap bmpResult = bmp.CreateEmptyBitmap())
                    using (Graphics g = Graphics.FromImage(bmpResult))
                    using (TextureBrush brush = new TextureBrush(bmp))
                    {
                        g.PixelOffsetMode = PixelOffsetMode.Half;
                        g.SmoothingMode = SmoothingMode.HighQuality;

                        g.FillPath(brush, gp);

                        return ImageHelpers.CropBitmap(bmpResult, resultArea);
                    }
                }
            }

            resultArea = Rectangle.Empty;
            return null;
        }

        private static RegionCaptureOptions GetRegionCaptureOptions(RegionCaptureOptions options)
        {
            if (options == null)
            {
                return new RegionCaptureOptions();
            }
            else
            {
                return new RegionCaptureOptions()
                {
                    DetectControls = options.DetectControls,
                    SnapSizes = options.SnapSizes,
                    ShowMagnifier = options.ShowMagnifier,
                    UseSquareMagnifier = options.UseSquareMagnifier,
                    MagnifierPixelCount = options.MagnifierPixelCount,
                    MagnifierPixelSize = options.MagnifierPixelSize,
                    ShowCrosshair = options.ShowCrosshair,
                    AnnotationOptions = options.AnnotationOptions,
                    ScreenColorPickerInfoText = options.ScreenColorPickerInfoText
                };
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Screenshot.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Screenshot.cs

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
using System.Drawing.Imaging;

namespace ShareX.ScreenCaptureLib
{
    public partial class Screenshot
    {
        public bool CaptureCursor { get; set; } = false;
        public bool CaptureClientArea { get; set; } = false;
        public bool RemoveOutsideScreenArea { get; set; } = true;
        public bool CaptureShadow { get; set; } = false;
        public int ShadowOffset { get; set; } = 20;
        public bool AutoHideTaskbar { get; set; } = false;

        public Bitmap CaptureRectangle(Rectangle rect)
        {
            if (RemoveOutsideScreenArea)
            {
                Rectangle bounds = CaptureHelpers.GetScreenBounds();
                rect = Rectangle.Intersect(bounds, rect);
            }

            return CaptureRectangleNative(rect, CaptureCursor);
        }

        public Bitmap CaptureFullscreen()
        {
            Rectangle bounds = CaptureHelpers.GetScreenBounds();

            return CaptureRectangle(bounds);
        }

        public Bitmap CaptureWindow(IntPtr handle)
        {
            if (handle.ToInt32() > 0)
            {
                Rectangle rect;

                if (CaptureClientArea)
                {
                    rect = NativeMethods.GetClientRect(handle);
                }
                else
                {
                    rect = CaptureHelpers.GetWindowRectangle(handle);
                }

                bool isTaskbarHide = false;

                try
                {
                    if (AutoHideTaskbar)
                    {
                        isTaskbarHide = NativeMethods.SetTaskbarVisibilityIfIntersect(false, rect);
                    }

                    return CaptureRectangle(rect);
                }
                finally
                {
                    if (isTaskbarHide)
                    {
                        NativeMethods.SetTaskbarVisibility(true);
                    }
                }
            }

            return null;
        }

        public Bitmap CaptureActiveWindow()
        {
            IntPtr handle = NativeMethods.GetForegroundWindow();

            return CaptureWindow(handle);
        }

        public Bitmap CaptureActiveMonitor()
        {
            Rectangle bounds = CaptureHelpers.GetActiveScreenBounds();

            return CaptureRectangle(bounds);
        }

        private Bitmap CaptureRectangleNative(Rectangle rect, bool captureCursor = false)
        {
            IntPtr handle = NativeMethods.GetDesktopWindow();
            return CaptureRectangleNative(handle, rect, captureCursor);
        }

        private Bitmap CaptureRectangleNative(IntPtr handle, Rectangle rect, bool captureCursor = false)
        {
            if (rect.Width == 0 || rect.Height == 0)
            {
                return null;
            }

            IntPtr hdcSrc = NativeMethods.GetWindowDC(handle);
            IntPtr hdcDest = NativeMethods.CreateCompatibleDC(hdcSrc);
            IntPtr hBitmap = NativeMethods.CreateCompatibleBitmap(hdcSrc, rect.Width, rect.Height);
            IntPtr hOld = NativeMethods.SelectObject(hdcDest, hBitmap);
            NativeMethods.BitBlt(hdcDest, 0, 0, rect.Width, rect.Height, hdcSrc, rect.X, rect.Y, CopyPixelOperation.SourceCopy | CopyPixelOperation.CaptureBlt);

            if (captureCursor)
            {
                try
                {
                    CursorData cursorData = new CursorData();
                    cursorData.DrawCursor(hdcDest, rect.Location);
                }
                catch (Exception e)
                {
                    DebugHelper.WriteException(e, "Cursor capture failed.");
                }
            }

            NativeMethods.SelectObject(hdcDest, hOld);
            NativeMethods.DeleteDC(hdcDest);
            NativeMethods.ReleaseDC(handle, hdcSrc);
            Bitmap bmp = Image.FromHbitmap(hBitmap);
            NativeMethods.DeleteObject(hBitmap);

            return bmp;
        }

        private Bitmap CaptureRectangleManaged(Rectangle rect)
        {
            if (rect.Width == 0 || rect.Height == 0)
            {
                return null;
            }

            Bitmap bmp = new Bitmap(rect.Width, rect.Height, PixelFormat.Format24bppRgb);

            using (Graphics g = Graphics.FromImage(bmp))
            {
                // Managed can't use SourceCopy | CaptureBlt because of .NET bug
                g.CopyFromScreen(rect.Location, Point.Empty, rect.Size, CopyPixelOperation.SourceCopy);
            }

            return bmp;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Screenshot_Transparent.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Screenshot_Transparent.cs

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
using System.Drawing.Imaging;
using System.Linq;
using System.Threading;
using System.Windows.Forms;

namespace ShareX.ScreenCaptureLib
{
    public partial class Screenshot
    {
        public Bitmap CaptureWindowTransparent(IntPtr handle)
        {
            if (handle.ToInt32() > 0)
            {
                Rectangle rect = CaptureHelpers.GetWindowRectangle(handle);

                if (CaptureShadow && !NativeMethods.IsZoomed(handle) && NativeMethods.IsDWMEnabled())
                {
                    rect.Inflate(ShadowOffset, ShadowOffset);
                    Rectangle intersectBounds = Screen.AllScreens.Select(x => x.Bounds).Where(x => x.IntersectsWith(rect)).Combine();
                    rect.Intersect(intersectBounds);
                }

                Bitmap whiteBackground = null, blackBackground = null, whiteBackground2 = null;
                CursorData cursorData = null;
                bool isTransparent = false, isTaskbarHide = false;

                try
                {
                    if (AutoHideTaskbar)
                    {
                        isTaskbarHide = NativeMethods.SetTaskbarVisibilityIfIntersect(false, rect);
                    }

                    if (CaptureCursor)
                    {
                        try
                        {
                            cursorData = new CursorData();
                        }
                        catch (Exception e)
                        {
                            DebugHelper.WriteException(e, "Cursor capture failed.");
                        }
                    }

                    using (Form form = new Form())
                    {
                        form.BackColor = Color.White;
                        form.FormBorderStyle = FormBorderStyle.None;
                        form.ShowInTaskbar = false;
                        form.StartPosition = FormStartPosition.Manual;
                        form.Location = new Point(rect.X, rect.Y);
                        form.Size = new Size(rect.Width, rect.Height);

                        NativeMethods.ShowWindow(form.Handle, (int)WindowShowStyle.ShowNoActivate);

                        if (!NativeMethods.SetWindowPos(form.Handle, handle, 0, 0, 0, 0,
                            SetWindowPosFlags.SWP_NOMOVE | SetWindowPosFlags.SWP_NOSIZE | SetWindowPosFlags.SWP_NOACTIVATE))
                        {
                            form.Close();
                            DebugHelper.WriteLine("Transparent capture failed. Reason: SetWindowPos fail.");
                            return CaptureWindow(handle);
                        }

                        Application.DoEvents();
                        Thread.Sleep(10);

                        whiteBackground = CaptureRectangleNative(rect);

                        form.BackColor = Color.Black;
                        Application.DoEvents();
                        Thread.Sleep(10);

                        blackBackground = CaptureRectangleNative(rect);

                        form.BackColor = Color.White;
                        Application.DoEvents();
                        Thread.Sleep(10);

                        whiteBackground2 = CaptureRectangleNative(rect);

                        form.Close();
                    }

                    Bitmap transparentImage;

                    if (ImageHelpers.CompareImages(whiteBackground, whiteBackground2))
                    {
                        transparentImage = CreateTransparentImage(whiteBackground, blackBackground);
                        isTransparent = true;
                    }
                    else
                    {
                        DebugHelper.WriteLine("Transparent capture failed. Reason: Images not equal.");
                        transparentImage = whiteBackground2;
                    }

                    if (cursorData != null)
                    {
                        cursorData.DrawCursor(transparentImage, rect.Location);
                    }

                    if (isTransparent)
                    {
                        transparentImage = ImageHelpers.AutoCropImage(transparentImage);

                        if (!CaptureShadow)
                        {
                            TrimShadow(transparentImage);
                        }
                    }

                    return transparentImage;
                }
                finally
                {
                    if (isTaskbarHide)
                    {
                        NativeMethods.SetTaskbarVisibility(true);
                    }

                    if (whiteBackground != null) whiteBackground.Dispose();
                    if (blackBackground != null) blackBackground.Dispose();
                    if (isTransparent && whiteBackground2 != null) whiteBackground2.Dispose();
                }
            }

            return null;
        }

        public Bitmap CaptureActiveWindowTransparent()
        {
            IntPtr handle = NativeMethods.GetForegroundWindow();

            return CaptureWindowTransparent(handle);
        }

        private Bitmap CreateTransparentImage(Bitmap whiteBackground, Bitmap blackBackground)
        {
            if (whiteBackground != null && blackBackground != null && whiteBackground.Size == blackBackground.Size)
            {
                Bitmap result = new Bitmap(whiteBackground.Width, whiteBackground.Height, PixelFormat.Format32bppArgb);

                using (UnsafeBitmap whiteBitmap = new UnsafeBitmap(whiteBackground, true, ImageLockMode.ReadOnly))
                using (UnsafeBitmap blackBitmap = new UnsafeBitmap(blackBackground, true, ImageLockMode.ReadOnly))
                using (UnsafeBitmap resultBitmap = new UnsafeBitmap(result, true, ImageLockMode.WriteOnly))
                {
                    int pixelCount = blackBitmap.PixelCount;

                    for (int i = 0; i < pixelCount; i++)
                    {
                        ColorBgra white = whiteBitmap.GetPixel(i);
                        ColorBgra black = blackBitmap.GetPixel(i);

                        double alpha = (black.Red - white.Red + 255) / 255.0;

                        if (alpha == 1)
                        {
                            resultBitmap.SetPixel(i, white);
                        }
                        else if (alpha > 0)
                        {
                            white.Blue = (byte)(black.Blue / alpha);
                            white.Green = (byte)(black.Green / alpha);
                            white.Red = (byte)(black.Red / alpha);
                            white.Alpha = (byte)(255 * alpha);

                            resultBitmap.SetPixel(i, white);
                        }
                    }
                }

                return result;
            }

            return whiteBackground;
        }

        private void TrimShadow(Bitmap bitmap)
        {
            int cornerSize = 10;
            int alphaOffset = 200;

            using (UnsafeBitmap unsafeBitmap = new UnsafeBitmap(bitmap, true))
            {
                for (int i = 0; i < cornerSize; i++)
                {
                    int y = i;
                    int width = bitmap.Width;

                    if (Helpers.IsWindows11OrGreater())
                    {
                        alphaOffset = 75;
                    }

                    // Left top
                    for (int x = 0; x < cornerSize; x++)
                    {
                        if (unsafeBitmap.GetPixel(x, y).Alpha < alphaOffset)
                        {
                            unsafeBitmap.ClearPixel(x, y);
                        }
                        else
                        {
                            break;
                        }
                    }

                    // Right top
                    for (int x = width - 1; x > width - cornerSize - 1; x--)
                    {
                        if (unsafeBitmap.GetPixel(x, y).Alpha < alphaOffset)
                        {
                            unsafeBitmap.ClearPixel(x, y);
                        }
                        else
                        {
                            break;
                        }
                    }

                    if (Helpers.IsWindows11OrGreater())
                    {
                        alphaOffset = 123;
                    }

                    y = bitmap.Height - i - 1;

                    // Left bottom
                    for (int x = 0; x < cornerSize; x++)
                    {
                        if (unsafeBitmap.GetPixel(x, y).Alpha < alphaOffset)
                        {
                            unsafeBitmap.ClearPixel(x, y);
                        }
                        else
                        {
                            break;
                        }
                    }

                    // Right bottom
                    for (int x = width - 1; x > width - cornerSize - 1; x--)
                    {
                        if (unsafeBitmap.GetPixel(x, y).Alpha < alphaOffset)
                        {
                            unsafeBitmap.ClearPixel(x, y);
                        }
                        else
                        {
                            break;
                        }
                    }
                }
            }
        }

        #region Not in use

        private byte[,] windows7Corner = new byte[,]
        {
            { 0, 0 }, { 1, 0 }, { 2, 0 }, { 3, 0 }, { 4, 0 },
            { 0, 1 }, { 1, 1 }, { 2, 1 },
            { 0, 2 }, { 1, 2 },
            { 0, 3 },
            { 0, 4 }
        };

        private byte[,] windowsVistaCorner = new byte[,]
        {
            { 0, 0 }, { 1, 0 }, { 2, 0 }, { 3, 0 },
            { 0, 1 }, { 1, 1 },
            { 0, 2 },
            { 0, 3 }
        };

        private Bitmap RemoveCorners(Image img)
        {
            byte[,] corner;

            if (Helpers.IsWindows7())
            {
                corner = windows7Corner;
            }
            else if (Helpers.IsWindowsVista())
            {
                corner = windowsVistaCorner;
            }
            else
            {
                return null;
            }

            return RemoveCorners(img, corner);
        }

        private Bitmap RemoveCorners(Image img, byte[,] cornerData)
        {
            Bitmap bmp = new Bitmap(img);

            for (int i = 0; i < cornerData.GetLength(0); i++)
            {
                // Left top corner
                bmp.SetPixel(cornerData[i, 0], cornerData[i, 1], Color.Transparent);

                // Right top corner
                bmp.SetPixel(bmp.Width - cornerData[i, 0] - 1, cornerData[i, 1], Color.Transparent);

                // Left bottom corner
                bmp.SetPixel(cornerData[i, 0], bmp.Height - cornerData[i, 1] - 1, Color.Transparent);

                // Right bottom corner
                bmp.SetPixel(bmp.Width - cornerData[i, 0] - 1, bmp.Height - cornerData[i, 1] - 1, Color.Transparent);
            }

            return bmp;
        }

        #endregion Not in use
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ScrollingCaptureManager.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/ScrollingCaptureManager.cs

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
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Threading.Tasks;

namespace ShareX.ScreenCaptureLib
{
    internal class ScrollingCaptureManager : IDisposable
    {
        public ScrollingCaptureOptions Options { get; private set; }
        public Bitmap Result { get; private set; }
        public bool IsCapturing { get; private set; }

        private Bitmap lastScreenshot;
        private Bitmap previousScreenshot;
        private bool stopRequested;
        private ScrollingCaptureStatus status;
        private int bestMatchCount, bestMatchIndex, bestIgnoreBottomOffset;
        private WindowInfo selectedWindow;
        private Rectangle selectedRectangle;

        public ScrollingCaptureManager(ScrollingCaptureOptions options)
        {
            Options = options;
        }

        public void Dispose()
        {
            Reset();
        }

        private void Reset(bool keepResult = false)
        {
            if (lastScreenshot != null)
            {
                lastScreenshot.Dispose();
                lastScreenshot = null;
            }

            if (previousScreenshot != null)
            {
                previousScreenshot.Dispose();
                previousScreenshot = null;
            }

            if (!keepResult && Result != null)
            {
                Result.Dispose();
                Result = null;
            }
        }

        public async Task<ScrollingCaptureStatus> StartCapture()
        {
            if (!IsCapturing && selectedWindow != null && !selectedRectangle.IsEmpty)
            {
                IsCapturing = true;
                stopRequested = false;
                status = ScrollingCaptureStatus.Failed;
                bestMatchCount = 0;
                bestMatchIndex = 0;
                bestIgnoreBottomOffset = 0;
                Reset();

                ScrollingCaptureRegionForm regionForm = null;

                if (Options.ShowRegion)
                {
                    regionForm = new ScrollingCaptureRegionForm(selectedRectangle);
                    regionForm.Show();
                }

                try
                {
                    selectedWindow.Activate();

                    await Task.Delay(Options.StartDelay);

                    if (Options.AutoScrollTop)
                    {
                        InputHelpers.SendKeyPress(VirtualKeyCode.HOME);
                        NativeMethods.SendMessage(selectedWindow.Handle, (int)WindowsMessages.VSCROLL, (int)ScrollBarCommands.SB_TOP, 0);

                        await Task.Delay(Options.ScrollDelay);
                    }

                    Screenshot screenshot = new Screenshot()
                    {
                        CaptureCursor = false
                    };

                    while (!stopRequested)
                    {
                        lastScreenshot = screenshot.CaptureRectangle(selectedRectangle);

                        if (CompareLastTwoImages())
                        {
                            break;
                        }

                        switch (Options.ScrollMethod)
                        {
                            case ScrollMethod.MouseWheel:
                                InputHelpers.SendMouseWheel(-120 * Options.ScrollAmount);
                                break;
                            case ScrollMethod.DownArrow:
                                for (int i = 0; i < Options.ScrollAmount; i++)
                                {
                                    InputHelpers.SendKeyPress(VirtualKeyCode.DOWN);
                                }
                                break;
                            case ScrollMethod.PageDown:
                                InputHelpers.SendKeyPress(VirtualKeyCode.NEXT);
                                break;
                            case ScrollMethod.ScrollMessage:
                                for (int i = 0; i < Options.ScrollAmount; i++)
                                {
                                    NativeMethods.SendMessage(selectedWindow.Handle, (int)WindowsMessages.VSCROLL, (int)ScrollBarCommands.SB_LINEDOWN, 0);
                                }
                                break;
                        }

                        Stopwatch timer = Stopwatch.StartNew();

                        if (lastScreenshot != null)
                        {
                            Bitmap newResult = await CombineImagesAsync(Result, lastScreenshot);

                            if (newResult != null)
                            {
                                Result?.Dispose();
                                Result = newResult;
                            }
                            else
                            {
                                break;
                            }
                        }

                        if (stopRequested)
                        {
                            break;
                        }

                        if (lastScreenshot != null)
                        {
                            if (previousScreenshot != null)
                            {
                                previousScreenshot.Dispose();
                            }

                            previousScreenshot = lastScreenshot;
                            lastScreenshot = null;
                        }

                        int delay = Options.ScrollDelay - (int)timer.ElapsedMilliseconds;

                        if (delay > 0)
                        {
                            await Task.Delay(delay);
                        }
                    }
                }
                finally
                {
                    regionForm?.Close();

                    Reset(true);
                    IsCapturing = false;
                }
            }

            return status;
        }

        public void StopCapture()
        {
            if (IsCapturing)
            {
                stopRequested = true;
            }
        }

        public bool SelectWindow()
        {
            return RegionCaptureTasks.GetRectangleRegion(out selectedRectangle, out selectedWindow, new RegionCaptureOptions());
        }

        private bool IsScrollReachedBottom(IntPtr handle)
        {
            SCROLLINFO scrollInfo = new SCROLLINFO();
            scrollInfo.cbSize = (uint)Marshal.SizeOf(scrollInfo);
            scrollInfo.fMask = (uint)(ScrollInfoMask.SIF_RANGE | ScrollInfoMask.SIF_PAGE | ScrollInfoMask.SIF_TRACKPOS);

            if (NativeMethods.GetScrollInfo(handle, (int)SBOrientation.SB_VERT, ref scrollInfo))
            {
                return scrollInfo.nMax == scrollInfo.nTrackPos + scrollInfo.nPage - 1;
            }

            return CompareLastTwoImages();
        }

        private bool CompareLastTwoImages()
        {
            if (lastScreenshot != null && previousScreenshot != null)
            {
                return ImageHelpers.CompareImages(lastScreenshot, previousScreenshot);
            }

            return false;
        }

        private async Task<Bitmap> CombineImagesAsync(Bitmap result, Bitmap currentImage)
        {
            return await Task.Run(() => CombineImages(result, currentImage));
        }

        private Bitmap CombineImages(Bitmap result, Bitmap currentImage)
        {
            if (result == null)
            {
                status = ScrollingCaptureStatus.Successful;

                return (Bitmap)currentImage.Clone();
            }

            int matchCount = 0;
            int matchIndex = 0;
            int matchLimit = currentImage.Height / 2;

            int ignoreSideOffset = Math.Max(50, currentImage.Width / 20);
            ignoreSideOffset = Math.Min(ignoreSideOffset, currentImage.Width / 3);

            Rectangle rect = new Rectangle(ignoreSideOffset, result.Height - currentImage.Height, currentImage.Width - ignoreSideOffset * 2, currentImage.Height);

            BitmapData bdResult = result.LockBits(new Rectangle(0, 0, result.Width, result.Height), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            BitmapData bdCurrentImage = currentImage.LockBits(new Rectangle(0, 0, currentImage.Width, currentImage.Height), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            int stride = bdResult.Stride;
            int pixelSize = stride / result.Width;
            IntPtr resultScan0 = bdResult.Scan0 + pixelSize * ignoreSideOffset;
            IntPtr currentImageScan0 = bdCurrentImage.Scan0 + pixelSize * ignoreSideOffset;
            int compareLength = pixelSize * rect.Width;

            int ignoreBottomOffsetMax = currentImage.Height / 3;
            int ignoreBottomOffset = Math.Max(50, currentImage.Height / 10);

            if (Options.AutoIgnoreBottomEdge)
            {
                IntPtr resultScan0Last = resultScan0 + (result.Height - 1) * stride;
                IntPtr currentImageScan0Last = currentImageScan0 + (currentImage.Height - 1) * stride;

                for (int i = 0; i <= ignoreBottomOffsetMax; i++)
                {
                    if (NativeMethods.memcmp(resultScan0Last - i * stride, currentImageScan0Last - i * stride, compareLength) != 0)
                    {
                        ignoreBottomOffset += i;
                        break;
                    }
                }

                ignoreBottomOffset = Math.Max(ignoreBottomOffset, bestIgnoreBottomOffset);
            }

            ignoreBottomOffset = Math.Min(ignoreBottomOffset, ignoreBottomOffsetMax);

            int rectBottom = rect.Bottom - ignoreBottomOffset - 1;

            for (int currentImageY = currentImage.Height - 1; currentImageY >= 0 && matchCount < matchLimit; currentImageY--)
            {
                int currentMatchCount = 0;

                for (int y = 0; currentImageY - y >= 0 && currentMatchCount < matchLimit; y++)
                {
                    if (NativeMethods.memcmp(resultScan0 + ((rectBottom - y) * stride), currentImageScan0 + ((currentImageY - y) * stride), compareLength) == 0)
                    {
                        currentMatchCount++;
                    }
                    else
                    {
                        break;
                    }
                }

                if (currentMatchCount > matchCount)
                {
                    matchCount = currentMatchCount;
                    matchIndex = currentImageY;
                }
            }

            result.UnlockBits(bdResult);
            currentImage.UnlockBits(bdCurrentImage);

            bool bestGuess = false;

            if (matchCount == 0 && bestMatchCount > 0)
            {
                matchCount = bestMatchCount;
                matchIndex = bestMatchIndex;
                ignoreBottomOffset = bestIgnoreBottomOffset;
                bestGuess = true;
            }

            if (matchCount > 0)
            {
                int matchHeight = currentImage.Height - matchIndex - 1;

                if (matchHeight > 0)
                {
                    if (matchCount > bestMatchCount)
                    {
                        bestMatchCount = matchCount;
                        bestMatchIndex = matchIndex;
                        bestIgnoreBottomOffset = ignoreBottomOffset;
                    }

                    Bitmap newResult = new Bitmap(result.Width, result.Height - ignoreBottomOffset + matchHeight);

                    using (Graphics g = Graphics.FromImage(newResult))
                    {
                        g.CompositingMode = CompositingMode.SourceCopy;
                        g.InterpolationMode = InterpolationMode.NearestNeighbor;

                        g.DrawImage(result, new Rectangle(0, 0, result.Width, result.Height - ignoreBottomOffset),
                            new Rectangle(0, 0, result.Width, result.Height - ignoreBottomOffset), GraphicsUnit.Pixel);
                        g.DrawImage(currentImage, new Rectangle(0, result.Height - ignoreBottomOffset, currentImage.Width, matchHeight),
                            new Rectangle(0, matchIndex + 1, currentImage.Width, matchHeight), GraphicsUnit.Pixel);
                    }

                    if (bestGuess)
                    {
                        status = ScrollingCaptureStatus.PartiallySuccessful;
                    }
                    else if (status != ScrollingCaptureStatus.PartiallySuccessful)
                    {
                        status = ScrollingCaptureStatus.Successful;
                    }

                    return newResult;
                }
            }

            status = ScrollingCaptureStatus.Failed;

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

````
