---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 320
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 320 of 650)

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

---[FILE: WindowInfo.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Native/WindowInfo.cs

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
using System.Drawing;

namespace ShareX.HelpersLib
{
    public class WindowInfo
    {
        public IntPtr Handle { get; }

        public bool IsHandleCreated => Handle != IntPtr.Zero;

        public string Text => NativeMethods.GetWindowText(Handle);

        public string ClassName => NativeMethods.GetClassName(Handle);

        public Process Process => NativeMethods.GetProcessByWindowHandle(Handle);

        public string ProcessName
        {
            get
            {
                using (Process process = Process)
                {
                    return process?.ProcessName;
                }
            }
        }

        public string ProcessFilePath
        {
            get
            {
                using (Process process = Process)
                {
                    return process?.MainModule?.FileName;
                }
            }
        }

        public string ProcessFileName => FileHelpers.GetFileNameSafe(ProcessFilePath);

        public int ProcessId
        {
            get
            {
                using (Process process = Process)
                {
                    return process.Id;
                }
            }
        }

        public IntPtr Parent => NativeMethods.GetParent(Handle);

        public Rectangle Rectangle => CaptureHelpers.GetWindowRectangle(Handle);

        public Rectangle ClientRectangle => NativeMethods.GetClientRect(Handle);

        public WindowStyles Style
        {
            get
            {
                return (WindowStyles)(ulong)NativeMethods.GetWindowLong(Handle, NativeConstants.GWL_STYLE);
            }
            set
            {
                NativeMethods.SetWindowLong(Handle, NativeConstants.GWL_STYLE, (IntPtr)value);
            }
        }

        public WindowStyles ExStyle
        {
            get
            {
                return (WindowStyles)(ulong)NativeMethods.GetWindowLong(Handle, NativeConstants.GWL_EXSTYLE);
            }
            set
            {
                NativeMethods.SetWindowLong(Handle, NativeConstants.GWL_EXSTYLE, (IntPtr)value);
            }
        }

        public bool Layered
        {
            get
            {
                return ExStyle.HasFlag(WindowStyles.WS_EX_LAYERED);
            }
            set
            {
                if (value)
                {
                    ExStyle |= WindowStyles.WS_EX_LAYERED;
                }
                else
                {
                    ExStyle &= ~WindowStyles.WS_EX_LAYERED;
                }
            }
        }

        public bool TopMost
        {
            get
            {
                return ExStyle.HasFlag(WindowStyles.WS_EX_TOPMOST);
            }
            set
            {
                SetWindowPos(value ? (IntPtr)NativeConstants.HWND_TOPMOST : (IntPtr)NativeConstants.HWND_NOTOPMOST,
                    SetWindowPosFlags.SWP_NOMOVE | SetWindowPosFlags.SWP_NOSIZE);
            }
        }

        public byte Opacity
        {
            get
            {
                if (Layered)
                {
                    NativeMethods.GetLayeredWindowAttributes(Handle, out _, out byte alpha, out _);
                    return alpha;
                }

                return 255;
            }
            set
            {
                if (value < 255)
                {
                    Layered = true;
                    NativeMethods.SetLayeredWindowAttributes(Handle, 0, value, NativeConstants.LWA_ALPHA);
                }
                else
                {
                    Layered = false;
                }
            }
        }

        public Icon Icon => NativeMethods.GetApplicationIcon(Handle);

        public bool IsMaximized => NativeMethods.IsZoomed(Handle);

        public bool IsMinimized => NativeMethods.IsIconic(Handle);

        public bool IsVisible => NativeMethods.IsWindowVisible(Handle) && !IsCloaked;

        public bool IsCloaked => NativeMethods.IsWindowCloaked(Handle);

        public bool IsActive => NativeMethods.IsActive(Handle);

        public WindowInfo(IntPtr handle)
        {
            Handle = handle;
        }

        public void Activate()
        {
            if (IsHandleCreated)
            {
                NativeMethods.SetForegroundWindow(Handle);
            }
        }

        public void BringToFront()
        {
            if (IsHandleCreated)
            {
                SetWindowPos(SetWindowPosFlags.SWP_NOMOVE | SetWindowPosFlags.SWP_NOSIZE);
            }
        }

        public void Restore()
        {
            if (IsHandleCreated)
            {
                NativeMethods.ShowWindow(Handle, (int)WindowShowStyle.Restore);
            }
        }

        public void SetWindowPos(SetWindowPosFlags flags)
        {
            SetWindowPos((IntPtr)NativeConstants.HWND_TOP, 0, 0, 0, 0, flags);
        }

        public void SetWindowPos(Rectangle rect, SetWindowPosFlags flags)
        {
            SetWindowPos((IntPtr)NativeConstants.HWND_TOP, rect.X, rect.Y, rect.Width, rect.Height, flags);
        }

        public void SetWindowPos(IntPtr insertAfter, SetWindowPosFlags flags)
        {
            SetWindowPos(insertAfter, 0, 0, 0, 0, flags);
        }

        public void SetWindowPos(IntPtr insertAfter, int x, int y, int width, int height, SetWindowPosFlags flags)
        {
            NativeMethods.SetWindowPos(Handle, insertAfter, x, y, width, height, flags);
        }

        public override string ToString()
        {
            return Text;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: WshShell.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Native/WshShell.cs

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
using System.Runtime.InteropServices;

namespace ShareX.HelpersLib
{
    [ComImport, Guid("72C24DD5-D70A-438B-8A42-98424B88AFB8")]
    public class WshShell
    {
    }

    [ComImport, InterfaceType(ComInterfaceType.InterfaceIsIDispatch), Guid("F935DC21-1CF0-11D0-ADB9-00C04FD58A0B")]
    public interface IWshShell
    {
        [DispId(0x3ea)]
        IWshShortcut CreateShortcut(string pathLink);
    }

    [ComImport, InterfaceType(ComInterfaceType.InterfaceIsIDispatch), Guid("F935DC23-1CF0-11D0-ADB9-00C04FD58A0B")]
    public interface IWshShortcut
    {
        [DispId(0)]
        string FullName { get; }

        [DispId(0x3e8)]
        string Arguments { get; set; }

        [DispId(0x3e9)]
        string Description { get; set; }

        [DispId(0x3ea)]
        string Hotkey { get; set; }

        [DispId(0x3eb)]
        string IconLocation { get; set; }

        [DispId(0x3ec)]
        string RelativePath { set; }

        [DispId(0x3ed)]
        string TargetPath { get; set; }

        [DispId(0x3ee)]
        int WindowStyle { get; set; }

        [DispId(0x3ef)]
        string WorkingDirectory { get; set; }

        [DispId(0x7d0)]
        void Load([In] string pathLink);

        [DispId(0x7d1)]
        void Save();
    }
}
```

--------------------------------------------------------------------------------

---[FILE: PrintHelper.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Printer/PrintHelper.cs

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
using System.Drawing.Printing;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public class PrintHelper : IDisposable
    {
        public PrintType PrintType { get; private set; }
        public Image Image { get; private set; }
        public string Text { get; private set; }
        public PrintSettings Settings { get; set; }

        public bool Printable
        {
            get
            {
                return Settings != null && ((PrintType == PrintType.Image && Image != null) ||
                    (PrintType == PrintType.Text && !string.IsNullOrEmpty(Text) && Settings.TextFont != null));
            }
        }

        private PrintDocument printDocument;
        private PrintDialog printDialog;
        private PrintPreviewDialog printPreviewDialog;
        private PrintTextHelper printTextHelper;

        public PrintHelper(Image image)
        {
            PrintType = PrintType.Image;
            Image = image;
            InitPrint();
        }

        public PrintHelper(string text)
        {
            PrintType = PrintType.Text;
            Text = text;
            printTextHelper = new PrintTextHelper();
            printTextHelper.Text = Text;
            InitPrint();
        }

        private void InitPrint()
        {
            printDocument = new PrintDocument();
            printDocument.BeginPrint += printDocument_BeginPrint;
            printDocument.PrintPage += printDocument_PrintPage;
            printDialog = new PrintDialog();
            printDialog.Document = printDocument;
            printDialog.UseEXDialog = true;
            printPreviewDialog = new PrintPreviewDialog();
            printPreviewDialog.Document = printDocument;
        }

        public void Dispose()
        {
            if (printDocument != null) printDocument.Dispose();
            if (printDialog != null) printDialog.Dispose();
            if (printPreviewDialog != null) printPreviewDialog.Dispose();
        }

        public void ShowPreview()
        {
            if (Printable)
            {
                printPreviewDialog.ShowDialog();
            }
        }

        public void TryDefaultPrinterOverride()
        {
            string defaultPrinterName = printDocument.PrinterSettings.PrinterName;

            if (!string.IsNullOrEmpty(Settings.DefaultPrinterOverride))
            {
                printDocument.PrinterSettings.PrinterName = Settings.DefaultPrinterOverride;
            }

            if (!printDocument.PrinterSettings.IsValid)
            {
                printDocument.PrinterSettings.PrinterName = defaultPrinterName;

                MessageBox.Show("Printer \"" + Settings.DefaultPrinterOverride + "\" does not exist. Continuing with Windows default printer, you can set the default printer override in application settings.",
                    "Invalid printer name", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
        }

        public bool Print()
        {
            if (Printable && (!Settings.ShowPrintDialog || printDialog.ShowDialog() == DialogResult.OK))
            {
                if (PrintType == PrintType.Text)
                {
                    printTextHelper.Font = Settings.TextFont;
                }

                TryDefaultPrinterOverride();
                printDocument.Print();
                return true;
            }

            return false;
        }

        private void printDocument_BeginPrint(object sender, PrintEventArgs e)
        {
            if (PrintType == PrintType.Text)
            {
                printTextHelper.BeginPrint();
            }
        }

        private void printDocument_PrintPage(object sender, PrintPageEventArgs e)
        {
            if (PrintType == PrintType.Image)
            {
                PrintImage(e);
            }
            else if (PrintType == PrintType.Text)
            {
                printTextHelper.Font = Settings.TextFont;
                printTextHelper.PrintPage(e);
            }
        }

        private void PrintImage(PrintPageEventArgs e)
        {
            Rectangle rect = e.PageBounds;
            rect.Inflate(-Settings.Margin, -Settings.Margin);

            Image img;

            if (Settings.AutoRotateImage && ((rect.Width > rect.Height && Image.Width < Image.Height) ||
                (rect.Width < rect.Height && Image.Width > Image.Height)))
            {
                img = (Image)Image.Clone();
                img.RotateFlip(RotateFlipType.Rotate90FlipNone);
            }
            else
            {
                img = Image;
            }

            if (Settings.AutoScaleImage)
            {
                DrawAutoScaledImage(e.Graphics, img, rect, Settings.AllowEnlargeImage, Settings.CenterImage);
            }
            else
            {
                e.Graphics.DrawImage(img, rect, new Rectangle(0, 0, rect.Width, rect.Height), GraphicsUnit.Pixel);
            }
        }

        private void DrawAutoScaledImage(Graphics g, Image img, Rectangle rect, bool allowEnlarge = false, bool centerImage = false)
        {
            double ratio;
            int newWidth, newHeight;

            if (!allowEnlarge && img.Width <= rect.Width && img.Height <= rect.Height)
            {
                ratio = 1.0;
                newWidth = img.Width;
                newHeight = img.Height;
            }
            else
            {
                double ratioX = (double)rect.Width / img.Width;
                double ratioY = (double)rect.Height / img.Height;
                ratio = ratioX < ratioY ? ratioX : ratioY;
                newWidth = (int)(img.Width * ratio);
                newHeight = (int)(img.Height * ratio);
            }

            int newX = rect.X;
            int newY = rect.Y;

            if (centerImage)
            {
                newX += (int)((rect.Width - (img.Width * ratio)) / 2);
                newY += (int)((rect.Height - (img.Height * ratio)) / 2);
            }

            g.SetHighQuality();
            g.DrawImage(img, newX, newY, newWidth, newHeight);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: PrintSettings.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Printer/PrintSettings.cs

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
    [Serializable]
    public class PrintSettings
    {
        public int Margin { get; set; }
        public bool AutoRotateImage { get; set; }
        public bool AutoScaleImage { get; set; }
        public bool AllowEnlargeImage { get; set; }
        public bool CenterImage { get; set; }
        public XmlFont TextFont { get; set; }
        public bool ShowPrintDialog { get; set; }
        public string DefaultPrinterOverride { get; set; }

        public PrintSettings()
        {
            Margin = 5;
            AutoRotateImage = true;
            AutoScaleImage = true;
            AllowEnlargeImage = false;
            CenterImage = false;
            TextFont = new XmlFont("Arial", 10);
            ShowPrintDialog = true;
            DefaultPrinterOverride = "";
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: PrintTextHelper.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Printer/PrintTextHelper.cs

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
using System.Drawing.Printing;
using System.Text;

namespace ShareX.HelpersLib
{
    internal class PrintTextHelper
    {
        private const int Eos = -1;
        private const int NewLine = -2;

        private string text = "";
        private Font font;
        private int offset;
        private int page;

        public string Text
        {
            get
            {
                return text;
            }
            set
            {
                text = value;
            }
        }

        public Font Font
        {
            get
            {
                return font;
            }
            set
            {
                font = value;
            }
        }

        public void BeginPrint()
        {
            offset = 0;
            page = 1;
        }

        public void PrintPage(PrintPageEventArgs e)
        {
            float pagewidth = e.MarginBounds.Width * 3.0f;
            float pageheight = e.MarginBounds.Height * 3.0f;

            float textwidth = 0.0f;
            float textheight = 0.0f;

            float offsetx = e.MarginBounds.Left * 3.0f;
            float offsety = e.MarginBounds.Top * 3.0f;

            float x = offsetx;
            float y = offsety;

            StringBuilder line = new StringBuilder(256);
            StringFormat sf = StringFormat.GenericTypographic;
            sf.FormatFlags = StringFormatFlags.DisplayFormatControl;
            sf.SetTabStops(0.0f, new float[] { 300.0f });

            RectangleF r;

            Graphics g = e.Graphics;
            g.PageUnit = GraphicsUnit.Document;

            SizeF size = g.MeasureString("X", font, 1, sf);
            float lineheight = size.Height;

            // make sure we can print at least 1 line (font too big?)
            if (lineheight + (lineheight * 3) > pageheight)
            {
                // cannot print at least 1 line and footer
                g.Dispose();

                e.HasMorePages = false;

                return;
            }

            // don't include footer
            pageheight -= lineheight * 3;

            // last whitespace in line buffer
            int lastws = -1;

            // next character
            int c;

            while (true)
            {
                // get next character
                c = NextChar();

                // append c to line if not NewLine or Eos
                if ((c != NewLine) && (c != Eos))
                {
                    char ch = Convert.ToChar(c);
                    line.Append(ch);

                    // if ch is whitespace, remember pos and continue
                    if (ch == ' ' || ch == '\t')
                    {
                        lastws = line.Length - 1;
                        continue;
                    }
                }

                // measure string if line is not empty
                if (line.Length > 0)
                {
                    size = g.MeasureString(line.ToString(), font, int.MaxValue, StringFormat.GenericTypographic);
                    textwidth = size.Width;
                }

                // draw line if line is full, if NewLine or if last line
                if (c == Eos || (textwidth > pagewidth) || (c == NewLine))
                {
                    if (textwidth > pagewidth)
                    {
                        if (lastws != -1)
                        {
                            offset -= line.Length - lastws - 1;
                            line.Length = lastws + 1;
                        }
                        else
                        {
                            line.Length--;
                            offset--;
                        }
                    }

                    // there's something to draw
                    if (line.Length > 0)
                    {
                        r = new RectangleF(x, y, pagewidth, lineheight);
                        sf.Alignment = StringAlignment.Near;
                        g.DrawString(line.ToString(), font, Brushes.Black, r, sf);
                    }

                    // increase ypos
                    y += lineheight;
                    textheight += lineheight;

                    // empty line buffer
                    line.Length = 0;
                    textwidth = 0.0f;
                    lastws = -1;
                }

                // if next line doesn't fit on page anymore, exit loop
                if (textheight > (pageheight - lineheight) || c == Eos)
                {
                    break;
                }
            }

            // print footer
            x = offsetx;
            y = offsety + pageheight + (lineheight * 2);
            r = new RectangleF(x, y, pagewidth, lineheight);
            sf.Alignment = StringAlignment.Center;
            g.DrawString(page.ToString(), font, Brushes.Black, r, sf);

            g.Dispose();

            page++;

            e.HasMorePages = c != Eos;
        }

        private bool NextCharIsNewLine()
        {
            int nl = Environment.NewLine.Length;
            int tl = text.Length - offset;

            if (tl < nl) return false;

            string newline = Environment.NewLine;

            for (int i = 0; i < nl; i++)
            {
                if (text[offset + i] != newline[i])
                    return false;
            }

            return true;
        }

        private int NextChar()
        {
            if (offset >= text.Length)
                return -1;

            if (NextCharIsNewLine())
            {
                offset += Environment.NewLine.Length;
                return -2;
            }

            return text[offset++];
        }
    }
}
```

--------------------------------------------------------------------------------

````
