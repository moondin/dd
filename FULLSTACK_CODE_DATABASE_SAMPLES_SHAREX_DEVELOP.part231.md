---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 231
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 231 of 650)

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

---[FILE: CursorData.cs]---
Location: ShareX-develop/ShareX.HelpersLib/CursorData.cs

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

using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

namespace ShareX.HelpersLib
{
    public class CursorData
    {
        public IntPtr Handle { get; private set; }
        public Point Position { get; private set; }
        public Size Size { get; private set; }
        public float SizeMultiplier { get; private set; }
        public bool IsDefaultSize => SizeMultiplier == 1f;
        public Point Hotspot { get; private set; }
        public Point DrawPosition => new Point(Position.X - Hotspot.X, Position.Y - Hotspot.Y);
        public bool IsVisible { get; private set; }

        public CursorData()
        {
            UpdateCursorData();
        }

        public void UpdateCursorData()
        {
            Handle = IntPtr.Zero;
            Position = Point.Empty;
            IsVisible = false;

            CursorInfo cursorInfo = new CursorInfo();
            cursorInfo.cbSize = Marshal.SizeOf(cursorInfo);

            if (NativeMethods.GetCursorInfo(out cursorInfo))
            {
                Handle = cursorInfo.hCursor;
                Position = cursorInfo.ptScreenPos;
                Size = Size.Empty;
                SizeMultiplier = GetCursorSizeMultiplier();
                IsVisible = cursorInfo.flags == NativeConstants.CURSOR_SHOWING;

                if (IsVisible)
                {
                    IntPtr iconHandle = NativeMethods.CopyIcon(Handle);

                    if (iconHandle != IntPtr.Zero)
                    {
                        if (NativeMethods.GetIconInfo(iconHandle, out IconInfo iconInfo))
                        {
                            if (IsDefaultSize)
                            {
                                Hotspot = new Point(iconInfo.xHotspot, iconInfo.yHotspot);
                            }
                            else
                            {
                                Hotspot = new Point((int)Math.Round(iconInfo.xHotspot * SizeMultiplier), (int)Math.Round(iconInfo.yHotspot * SizeMultiplier));
                            }

                            if (iconInfo.hbmColor != IntPtr.Zero)
                            {
                                NativeMethods.DeleteObject(iconInfo.hbmColor);
                            }

                            if (iconInfo.hbmMask != IntPtr.Zero)
                            {
                                if (!IsDefaultSize)
                                {
                                    using (Bitmap bmpMask = Image.FromHbitmap(iconInfo.hbmMask))
                                    {
                                        int cursorWidth = bmpMask.Width;
                                        int cursorHeight = iconInfo.hbmColor != IntPtr.Zero ? bmpMask.Height : bmpMask.Height / 2;
                                        Size = new Size((int)Math.Round(cursorWidth * SizeMultiplier), (int)Math.Round(cursorHeight * SizeMultiplier));
                                    }
                                }

                                NativeMethods.DeleteObject(iconInfo.hbmMask);
                            }
                        }

                        NativeMethods.DestroyIcon(iconHandle);
                    }
                }
            }
        }

        public static float GetCursorSizeMultiplier()
        {
            float sizeMultiplier = 1f;

            int? cursorSize = RegistryHelpers.GetValueDWord(@"SOFTWARE\Microsoft\Accessibility", "CursorSize");

            if (cursorSize != null && cursorSize > 1)
            {
                sizeMultiplier = 1f + ((cursorSize.Value - 1) * 0.5f);
            }

            return sizeMultiplier;
        }

        public void DrawCursor(IntPtr hdcDest)
        {
            DrawCursor(hdcDest, Point.Empty);
        }

        public void DrawCursor(IntPtr hdcDest, Point offset)
        {
            if (IsVisible)
            {
                Point drawPosition = new Point(DrawPosition.X - offset.X, DrawPosition.Y - offset.Y);
                drawPosition = CaptureHelpers.ScreenToClient(drawPosition);

                NativeMethods.DrawIconEx(hdcDest, drawPosition.X, drawPosition.Y, Handle, Size.Width, Size.Height, 0, IntPtr.Zero, NativeConstants.DI_NORMAL);
            }
        }

        public void DrawCursor(Image img)
        {
            DrawCursor(img, Point.Empty);
        }

        public void DrawCursor(Image img, Point offset)
        {
            if (IsVisible)
            {
                using (Graphics g = Graphics.FromImage(img))
                {
                    IntPtr hdcDest = g.GetHdc();

                    DrawCursor(hdcDest, offset);

                    g.ReleaseHdc(hdcDest);
                }
            }
        }

        public Bitmap ToBitmap()
        {
            if (IsDefaultSize || Size.IsEmpty)
            {
                Icon icon = Icon.FromHandle(Handle);
                return icon.ToBitmap();
            }

            Bitmap bmp = new Bitmap(Size.Width, Size.Height, PixelFormat.Format32bppArgb);

            using (Graphics g = Graphics.FromImage(bmp))
            {
                IntPtr hdcDest = g.GetHdc();

                NativeMethods.DrawIconEx(hdcDest, 0, 0, Handle, Size.Width, Size.Height, 0, IntPtr.Zero, NativeConstants.DI_NORMAL);

                g.ReleaseHdc(hdcDest);
            }

            return bmp;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: DebugHelper.cs]---
Location: ShareX-develop/ShareX.HelpersLib/DebugHelper.cs

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

using System;
using System.Diagnostics;

namespace ShareX.HelpersLib
{
    public static class DebugHelper
    {
        public static Logger Logger { get; private set; }

        public static void Init(string logFilePath)
        {
            Logger = new Logger(logFilePath);
        }

        public static void WriteLine(string message = "")
        {
            if (Logger != null)
            {
                Logger.WriteLine(message);
            }
            else
            {
                Debug.WriteLine(message);
            }
        }

        public static void WriteLine(string format, params object[] args)
        {
            WriteLine(string.Format(format, args));
        }

        public static void WriteException(string exception, string message = "Exception")
        {
            if (Logger != null)
            {
                Logger.WriteException(exception, message);
            }
            else
            {
                Debug.WriteLine(exception);
            }
        }

        public static void WriteException(Exception exception, string message = "Exception")
        {
            WriteException(exception.ToString(), message);
        }

        public static void Flush()
        {
            Logger?.ProcessMessageQueue();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: DebugTimer.cs]---
Location: ShareX-develop/ShareX.HelpersLib/DebugTimer.cs

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

using System;
using System.Diagnostics;
using System.Globalization;

namespace ShareX.HelpersLib
{
    public class DebugTimer : IDisposable
    {
        public string Text { get; set; }

        public TimeSpan Elapsed => timer.Elapsed;

        private Stopwatch timer;

        public DebugTimer(string text = null)
        {
            Text = text;
            timer = Stopwatch.StartNew();
        }

        private void Write(string time, string text = null)
        {
            if (string.IsNullOrEmpty(text))
            {
                text = Text;
            }

            if (!string.IsNullOrEmpty(text))
            {
                Debug.WriteLine(text + ": " + time);
            }
            else
            {
                Debug.WriteLine(time);
            }
        }

        public void WriteElapsedMilliseconds(string text = null)
        {
            Write(Elapsed.TotalMilliseconds.ToString("0.000", CultureInfo.InvariantCulture) + " milliseconds.", text);
        }

        public void WriteElapsedSeconds(string text = null)
        {
            Write(Elapsed.TotalSeconds.ToString("0.000", CultureInfo.InvariantCulture) + " seconds.", text);
        }

        public void Dispose()
        {
            WriteElapsedMilliseconds();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: DesktopIconManager.cs]---
Location: ShareX-develop/ShareX.HelpersLib/DesktopIconManager.cs

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

using System;

namespace ShareX.HelpersLib
{
    public static class DesktopIconManager
    {
        public static bool AreDesktopIconsVisible()
        {
            IntPtr hIcons = GetDesktopListViewHandle();

            return hIcons != IntPtr.Zero && NativeMethods.IsWindowVisible(hIcons);
        }

        public static bool SetDesktopIconsVisibility(bool show)
        {
            IntPtr hIcons = GetDesktopListViewHandle();

            if (hIcons != IntPtr.Zero)
            {
                NativeMethods.ShowWindow(hIcons, show ? (int)WindowShowStyle.Show : (int)WindowShowStyle.Hide);

                return true;
            }

            return false;
        }

        private static IntPtr GetDesktopListViewHandle()
        {
            IntPtr progman = NativeMethods.FindWindow("Progman", null);
            IntPtr desktopWnd = IntPtr.Zero;

            IntPtr defView = NativeMethods.FindWindowEx(progman, IntPtr.Zero, "SHELLDLL_DefView", null);

            if (defView == IntPtr.Zero)
            {
                IntPtr desktopHandle = IntPtr.Zero;

                while ((desktopHandle = NativeMethods.FindWindowEx(IntPtr.Zero, desktopHandle, "WorkerW", null)) != IntPtr.Zero)
                {
                    defView = NativeMethods.FindWindowEx(desktopHandle, IntPtr.Zero, "SHELLDLL_DefView", null);

                    if (defView != IntPtr.Zero)
                    {
                        break;
                    }
                }
            }

            if (defView != IntPtr.Zero)
            {
                IntPtr sysListView = NativeMethods.FindWindowEx(defView, IntPtr.Zero, "SysListView32", "FolderView");
                return sysListView;
            }

            return IntPtr.Zero;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: DWMManager.cs]---
Location: ShareX-develop/ShareX.HelpersLib/DWMManager.cs

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

using System;

namespace ShareX.HelpersLib
{
    public class DWMManager : IDisposable
    {
        private bool isDWMEnabled;
        private bool autoEnable;

        public DWMManager()
        {
            isDWMEnabled = NativeMethods.IsDWMEnabled();
        }

        public bool AutoDisable()
        {
            if (isDWMEnabled)
            {
                ChangeComposition(false);
                autoEnable = true;
                return true;
            }

            return false;
        }

        public void ChangeComposition(bool enable)
        {
            try
            {
                NativeMethods.DwmEnableComposition(enable ? DWM_EC.DWM_EC_ENABLECOMPOSITION : DWM_EC.DWM_EC_DISABLECOMPOSITION);
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
            }
        }

        public void Dispose()
        {
            if (isDWMEnabled && autoEnable)
            {
                ChangeComposition(true);
                autoEnable = false;
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Emoji.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Emoji.cs

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

using System;
using System.IO;
using System.Linq;
using System.Text;

namespace ShareX.HelpersLib
{
    public static class Emoji
    {
        public static string[] Smileys = new string[] { "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "☺️", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "🥵", "🥶", "😳", "🤪", "😵", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🤠", "🤡", "🥳", "🥴", "🥺", "🤥", "🤫", "🤭", "🧐", "🤓", "😈", "👿", "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾" };

        public static string[] AnimalsNature = new string[] { "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🦝", "🐻", "🐼", "🦘", "🦡", "🐨", "🐯", "🦁", "🐮", "🐷", "🐽", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦢", "🦅", "🦉", "🦚", "🦜", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐚", "🐞", "🐜", "🦗", "🕷", "🕸", "🦂", "🦟", "🦠", "🐢", "🐍", "🦎", "🦖", "🦕", "🐙", "🦑", "🦐", "🦀", "🐡", "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍", "🐘", "🦏", "🦛", "🐪", "🐫", "🦙", "🦒", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🐐", "🦌", "🐕", "🐩", "🐈", "🐓", "🦃", "🕊", "🐇", "🐁", "🐀", "🐿", "🦔", "🐾", "🐉", "🐲", "🌵", "🎄", "🌲", "🌳", "🌴", "🌱", "🌿", "☘️", "🍀", "🎍", "🎋", "🍃", "🍂", "🍁", "🍄", "🌾", "💐", "🌷", "🌹", "🥀", "🌺", "🌸", "🌼", "🌻", "🌞", "🌝", "🌛", "🌜", "🌚", "🌕", "🌖", "🌗", "🌘", "🌑", "🌒", "🌓", "🌔", "🌙", "🌎", "🌍", "🌏", "💫", "⭐️", "🌟", "✨", "⚡️", "☄️", "💥", "🔥", "🌪", "🌈", "☀️", "🌤", "⛅️", "🌥", "☁️", "🌦", "🌧", "⛈", "🌩", "🌨", "❄️", "☃️", "⛄️", "🌬", "💨", "💧", "💦", "☔️", "☂️", "🌊", "🌫" };

        public static string[] FoodDrink = new string[] { "🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🍍", "🥭", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥒", "🥬", "🌶", "🌽", "🥕", "🥔", "🍠", "🥐", "🍞", "🥖", "🥨", "🥯", "🧀", "🥚", "🍳", "🥞", "🥓", "🥩", "🍗", "🍖", "🌭", "🍔", "🍟", "🍕", "🥪", "🥙", "🌮", "🌯", "🥗", "🥘", "🥫", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🍤", "🍙", "🍚", "🍘", "🍥", "🥮", "🥠", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🧂", "🍩", "🍪", "🌰", "🥜", "🍯", "🥛", "🍼", "☕️", "🍵", "🥤", "🍶", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸", "🍹", "🍾", "🥄", "🍴", "🍽", "🥣", "🥡", "🥢" };

        public static string[] TravelPlaces = new string[] { "🚗", "🚕", "🚙", "🚌", "🚎", "🏎", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🛴", "🚲", "🛵", "🏍", "🚨", "🚔", "🚍", "🚘", "🚖", "🚡", "🚠", "🚟", "🚃", "🚋", "🚞", "🚝", "🚄", "🚅", "🚈", "🚂", "🚆", "🚇", "🚊", "🚉", "✈️", "🛫", "🛬", "🛩", "💺", "🛰", "🚀", "🛸", "🚁", "🛶", "⛵️", "🚤", "🛥", "🛳", "⛴", "🚢", "⚓️", "⛽️", "🚧", "🚦", "🚥", "🚏", "🗺", "🗿", "🗽", "🗼", "🏰", "🏯", "🏟", "🎡", "🎢", "🎠", "⛲️", "⛱", "🏖", "🏝", "🏜", "🌋", "⛰", "🏔", "🗻", "🏕", "⛺️", "🏠", "🏡", "🏘", "🏚", "🏗", "🏭", "🏢", "🏬", "🏣", "🏤", "🏥", "🏦", "🏨", "🏪", "🏫", "🏩", "💒", "🏛", "⛪️", "🕌", "🕍", "🕋", "⛩", "🛤", "🛣", "🗾", "🎑", "🏞", "🌅", "🌄", "🌠", "🎇", "🎆", "🌇", "🌆", "🏙", "🌃", "🌌", "🌉", "🌁" };

        public static string[] Objects = new string[] { "⌚️", "📱", "📲", "💻", "⌨️", "🖥", "🖨", "🖱", "🖲", "🕹", "🗜", "💽", "💾", "💿", "📀", "📼", "📷", "📸", "📹", "🎥", "📽", "🎞", "📞", "☎️", "📟", "📠", "📺", "📻", "🎙", "🎚", "🎛", "⏱", "⏲", "⏰", "🕰", "⌛️", "⏳", "📡", "🔋", "🔌", "💡", "🔦", "🕯", "🗑", "🛢", "💸", "💵", "💴", "💶", "💷", "💰", "💳", "🧾", "💎", "⚖️", "🔧", "🔨", "⚒", "🛠", "⛏", "🔩", "⚙️", "⛓", "🔫", "💣", "🔪", "🗡", "⚔️", "🛡", "🚬", "⚰️", "⚱️", "🏺", "🧭", "🧱", "🔮", "🧿", "🧸", "📿", "💈", "⚗️", "🔭", "🧰", "🧲", "🧪", "🧫", "🧬", "🧯", "🔬", "🕳", "💊", "💉", "🌡", "🚽", "🚰", "🚿", "🛁", "🛀", "🛀🏻", "🛀🏼", "🛀🏽", "🛀🏾", "🛀🏿", "🧴", "🧵", "🧶", "🧷", "🧹", "🧺", "🧻", "🧼", "🧽", "🛎", "🔑", "🗝", "🚪", "🛋", "🛏", "🛌", "🖼", "🛍", "🧳", "🛒", "🎁", "🎈", "🎏", "🎀", "🎊", "🎉", "🧨", "🎎", "🏮", "🎐", "🧧", "✉️", "📩", "📨", "📧", "💌", "📥", "📤", "📦", "🏷", "📪", "📫", "📬", "📭", "📮", "📯", "📜", "📃", "📄", "📑", "📊", "📈", "📉", "🗒", "🗓", "📆", "📅", "📇", "🗃", "🗳", "🗄", "📋", "📁", "📂", "🗂", "🗞", "📰", "📓", "📔", "📒", "📕", "📗", "📘", "📙", "📚", "📖", "🔖", "🔗", "📎", "🖇", "📐", "📏", "📌", "📍", "✂️", "🖊", "🖋", "✒️", "🖌", "🖍", "📝", "✏️", "🔍", "🔎", /*"🔏", "🔐", "🔒", "🔓"*/ };

        public static string[] Emojis = Smileys.Concat(AnimalsNature).Concat(FoodDrink).Concat(TravelPlaces).Concat(Objects).ToArray();

        public static int SearchEmoji(string text)
        {
            int emojiLength = 0;

            foreach (string emoji in Emojis)
            {
                if (text.StartsWith(emoji, StringComparison.Ordinal))
                {
                    emojiLength = Math.Max(emojiLength, emoji.Length);
                }
            }

            return emojiLength;
        }

        public static void SaveEmojiList(string filePath)
        {
            File.WriteAllText(filePath, string.Join(Environment.NewLine, Emojis), Encoding.UTF8);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: EnumInfo.cs]---
Location: ShareX-develop/ShareX.HelpersLib/EnumInfo.cs

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

using System;

namespace ShareX.HelpersLib
{
    public class EnumInfo
    {
        public Enum Value { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }

        public EnumInfo(Enum value)
        {
            Value = value;
            Description = Value.GetLocalizedDescription();
            Category = Value.GetLocalizedCategory();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Enums.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Enums.cs

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

using System.ComponentModel;

namespace ShareX.HelpersLib
{
    public enum EDataType // Localized
    {
        Default,
        File,
        Image,
        Text,
        URL
    }

    public enum PNGBitDepth // Localized
    {
        Default,
        Automatic,
        Bit32,
        Bit24
    }

    public enum GIFQuality // Localized
    {
        Default,
        Bit8,
        Bit4,
        Grayscale
    }

    public enum EImageFormat
    {
        [Description("png")]
        PNG,
        [Description("jpg")]
        JPEG,
        [Description("gif")]
        GIF,
        [Description("bmp")]
        BMP,
        [Description("tif")]
        TIFF
    }

    public enum HashType
    {
        [Description("CRC-32")]
        CRC32,
        [Description("MD5")]
        MD5,
        [Description("SHA-1")]
        SHA1,
        [Description("SHA-256")]
        SHA256,
        [Description("SHA-384")]
        SHA384,
        [Description("SHA-512")]
        SHA512
    }

    public enum BorderType
    {
        Outside,
        Inside
    }

    public enum DownloaderFormStatus
    {
        Waiting,
        DownloadStarted,
        DownloadCompleted,
        InstallStarted
    }

    public enum InstallType
    {
        Default,
        Silent,
        VerySilent,
        Event
    }

    public enum ReleaseChannelType
    {
        [Description("Stable version")]
        Stable,
        [Description("Beta version")]
        Beta,
        [Description("Dev version")]
        Dev
    }

    public enum UpdateStatus
    {
        None,
        UpdateCheckFailed,
        UpdateAvailable,
        UpToDate
    }

    public enum PrintType
    {
        Image,
        Text
    }

    public enum DrawStyle
    {
        Hue,
        Saturation,
        Brightness,
        Red,
        Green,
        Blue
    }

    public enum ColorType
    {
        None, RGBA, HSB, CMYK, Hex, Decimal
    }

    public enum ColorFormat
    {
        RGB, RGBA, ARGB
    }

    public enum ProxyMethod // Localized
    {
        None,
        Manual,
        Automatic
    }

    public enum SlashType
    {
        Prefix,
        Suffix
    }

    public enum HotkeyStatus
    {
        Registered,
        Failed,
        NotConfigured
    }

    public enum ImageCombinerAlignment
    {
        LeftOrTop,
        Center,
        RightOrBottom
    }

    public enum ImageInterpolationMode
    {
        HighQualityBicubic,
        Bicubic,
        HighQualityBilinear,
        Bilinear,
        NearestNeighbor
    }

    public enum ArrowHeadDirection // Localized
    {
        End,
        Start,
        Both
    }

    public enum FFmpegArchitecture
    {
        win64,
        win32,
        macos64
    }

    public enum StepType // Localized
    {
        Numbers,
        LettersUppercase,
        LettersLowercase,
        RomanNumeralsUppercase,
        RomanNumeralsLowercase
    }

    public enum CutOutEffectType // Localized
    {
        None,
        ZigZag,
        TornEdge,
        Wave
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ExternalProgram.cs]---
Location: ShareX-develop/ShareX.HelpersLib/ExternalProgram.cs

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

using System;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;

namespace ShareX.HelpersLib
{
    public class ExternalProgram
    {
        public bool IsActive { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
        public string Args { get; set; }
        public string OutputExtension { get; set; }
        public string Extensions { get; set; }
        public bool HiddenWindow { get; set; }
        public bool DeleteInputFile { get; set; }

        private string pendingInputFilePath;

        public ExternalProgram()
        {
            Args = '"' + CodeMenuEntryActions.input.ToPrefixString() + '"';
        }

        public ExternalProgram(string name, string path) : this()
        {
            Name = name;
            Path = path;
        }

        public string GetFullPath()
        {
            return FileHelpers.ExpandFolderVariables(Path);
        }

        public string Run(string inputPath)
        {
            pendingInputFilePath = null;
            string path = GetFullPath();

            if (!string.IsNullOrEmpty(path) && File.Exists(path) && !string.IsNullOrWhiteSpace(inputPath))
            {
                inputPath = inputPath.Trim('"');

                if (CheckExtension(inputPath))
                {
                    try
                    {
                        string outputPath = inputPath;

                        string arguments;

                        if (string.IsNullOrEmpty(Args))
                        {
                            arguments = '"' + inputPath + '"';
                        }
                        else
                        {
                            if (!string.IsNullOrWhiteSpace(OutputExtension))
                            {
                                outputPath = System.IO.Path.Combine(System.IO.Path.GetDirectoryName(inputPath), System.IO.Path.GetFileNameWithoutExtension(inputPath));

                                if (!OutputExtension.StartsWith("."))
                                {
                                    outputPath += ".";
                                }

                                outputPath += OutputExtension;
                            }

                            arguments = CodeMenuEntryActions.Parse(Args, inputPath, outputPath);
                        }

                        using (Process process = new Process())
                        {
                            ProcessStartInfo psi = new ProcessStartInfo()
                            {
                                FileName = path,
                                Arguments = arguments,
                                UseShellExecute = false,
                                CreateNoWindow = HiddenWindow
                            };

                            DebugHelper.WriteLine($"Action input: \"{inputPath}\" [{FileHelpers.GetFileSizeReadable(inputPath)}]");
                            DebugHelper.WriteLine($"Action run: \"{psi.FileName}\" {psi.Arguments}");

                            process.StartInfo = psi;
                            process.Start();
                            process.WaitForExit();
                        }

                        if (!string.IsNullOrEmpty(outputPath) && File.Exists(outputPath))
                        {
                            DebugHelper.WriteLine($"Action output: \"{outputPath}\" [{FileHelpers.GetFileSizeReadable(outputPath)}]");

                            if (DeleteInputFile && !inputPath.Equals(outputPath, StringComparison.OrdinalIgnoreCase))
                            {
                                pendingInputFilePath = inputPath;
                            }

                            return outputPath;
                        }

                        return inputPath;
                    }
                    catch (Exception e)
                    {
                        DebugHelper.WriteException(e);
                    }
                }
            }

            return null;
        }

        public Task<string> RunAsync(string inputPath)
        {
            return Task.Run(() => Run(inputPath));
        }

        public bool CheckExtension(string path)
        {
            return CheckExtension(path, Extensions);
        }

        public bool CheckExtension(string path, string extensions)
        {
            if (!string.IsNullOrWhiteSpace(path))
            {
                if (string.IsNullOrWhiteSpace(extensions))
                {
                    return true;
                }

                int index = 0;

                for (int i = 0; i <= extensions.Length; ++i)
                {
                    if (i == extensions.Length || !char.IsLetterOrDigit(extensions[i]))
                    {
                        if (i > index)
                        {
                            string extension = "." + extensions.Substring(index, i - index);

                            if (path.EndsWith(extension, StringComparison.OrdinalIgnoreCase))
                            {
                                return true;
                            }
                        }

                        index = i + 1;
                    }
                }
            }

            return false;
        }

        public void DeletePendingInputFile()
        {
            string inputPath = pendingInputFilePath;

            if (!string.IsNullOrEmpty(inputPath) && File.Exists(inputPath))
            {
                DebugHelper.WriteLine($"Deleting input file: \"{inputPath}\"");

                try
                {
                    File.Delete(inputPath);
                    pendingInputFilePath = null;
                }
                catch (Exception e)
                {
                    DebugHelper.WriteException(e);
                }
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: FastDateTime.cs]---
Location: ShareX-develop/ShareX.HelpersLib/FastDateTime.cs

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

using System;

namespace ShareX.HelpersLib
{
    public static class FastDateTime
    {
        public static TimeSpan LocalUtcOffset { get; private set; }

        public static DateTime Now
        {
            get
            {
                return ToLocalTime(DateTime.UtcNow);
            }
        }

        public static long NowUnix
        {
            get
            {
                return (DateTime.UtcNow.Ticks - 621355968000000000) / 10000000;
            }
        }

        static FastDateTime()
        {
            LocalUtcOffset = TimeZoneInfo.Local.GetUtcOffset(DateTime.Now);
        }

        public static DateTime ToLocalTime(DateTime dateTime)
        {
            return dateTime + LocalUtcOffset;
        }
    }
}
```

--------------------------------------------------------------------------------

````
