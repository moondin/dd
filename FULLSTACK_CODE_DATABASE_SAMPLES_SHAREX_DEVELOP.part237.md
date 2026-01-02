---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 237
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 237 of 650)

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

---[FILE: WindowState.cs]---
Location: ShareX-develop/ShareX.HelpersLib/WindowState.cs

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
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public class WindowState
    {
        public Point Location { get; set; }
        public Size Size { get; set; }
        public bool IsMaximized { get; set; }

        public void ApplyFormState(Form form)
        {
            if (!Location.IsEmpty && !Size.IsEmpty && CaptureHelpers.GetScreenWorkingArea().Contains(new Rectangle(Location, Size)))
            {
                form.StartPosition = FormStartPosition.Manual;
                form.Location = Location;
                form.Size = Size;
            }

            if (IsMaximized)
            {
                form.WindowState = FormWindowState.Maximized;
            }
        }

        public void UpdateFormState(Form form)
        {
            WINDOWPLACEMENT wp = new WINDOWPLACEMENT();
            wp.length = Marshal.SizeOf(wp);

            if (NativeMethods.GetWindowPlacement(form.Handle, ref wp))
            {
                Location = wp.rcNormalPosition.Location;
                Size = wp.rcNormalPosition.Size;
                IsMaximized = wp.showCmd == WindowShowStyle.Maximize;
            }
        }

        public void AutoHandleFormState(Form form)
        {
            ApplyFormState(form);
            form.FormClosing += (sender, e) => UpdateFormState(form);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: XmlColor.cs]---
Location: ShareX-develop/ShareX.HelpersLib/XmlColor.cs

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

namespace ShareX.HelpersLib
{
    [Serializable]
    public class XmlColor
    {
        public byte A { get; set; }
        public byte R { get; set; }
        public byte G { get; set; }
        public byte B { get; set; }

        public XmlColor() : this(0, 0, 0)
        {
        }

        public XmlColor(byte r, byte g, byte b) : this(255, r, g, b)
        {
        }

        public XmlColor(byte a, byte r, byte g, byte b)
        {
            A = a;
            R = r;
            G = g;
            B = b;
        }

        public XmlColor(Color color) : this(color.A, color.R, color.G, color.B)
        {
        }

        public Color ToColor()
        {
            return Color.FromArgb(A, R, G, B);
        }

        public int ToArgb()
        {
            return (A << 24) | (R << 16) | (G << 8) | B;
        }

        public override string ToString()
        {
            return string.Format("A:{0}, R:{1}, G:{2}, B:{3}", A, R, G, B);
        }

        public static implicit operator Color(XmlColor color)
        {
            return color.ToColor();
        }

        public static implicit operator XmlColor(Color color)
        {
            return new XmlColor(color);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: XmlFont.cs]---
Location: ShareX-develop/ShareX.HelpersLib/XmlFont.cs

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

namespace ShareX.HelpersLib
{
    [Serializable]
    public class XmlFont
    {
        public string FontFamily { get; set; }
        public float Size { get; set; }
        public FontStyle Style { get; set; }
        public GraphicsUnit GraphicsUnit { get; set; }

        public XmlFont()
        {
        }

        public XmlFont(Font font)
        {
            Init(font);
        }

        public XmlFont(string fontName, float fontSize, FontStyle fontStyle = FontStyle.Regular)
        {
            Font font = CreateFont(fontName, fontSize, fontStyle);
            Init(font);
        }

        private void Init(Font font)
        {
            using (font)
            {
                FontFamily = font.FontFamily.Name;
                Size = font.Size;
                Style = font.Style;
                GraphicsUnit = font.Unit;
            }
        }

        private Font CreateFont(string fontName, float fontSize, FontStyle fontStyle)
        {
            try
            {
                return new Font(fontName, fontSize, fontStyle);
            }
            catch
            {
                return new Font(SystemFonts.DefaultFont.FontFamily, fontSize, fontStyle);
            }
        }

        public static implicit operator Font(XmlFont font)
        {
            return font.ToFont();
        }

        public static implicit operator XmlFont(Font font)
        {
            return new XmlFont(font);
        }

        public Font ToFont()
        {
            return new Font(FontFamily, Size, Style, GraphicsUnit);
        }

        public override string ToString()
        {
            string text = string.Format("{0}; {1}", FontFamily, Size);

            if (Style != FontStyle.Regular)
            {
                text += "; " + Style;
            }

            return text;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CLICommand.cs]---
Location: ShareX-develop/ShareX.HelpersLib/CLI/CLICommand.cs

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
    public class CLICommand
    {
        public string Command { get; set; }
        public string Parameter { get; set; }
        public bool IsCommand { get; set; } // Starts with hyphen?

        public CLICommand(string command = null, string parameter = null)
        {
            Command = command;
            Parameter = parameter;
        }

        public bool CheckCommand(string command, StringComparison comparisonType = StringComparison.OrdinalIgnoreCase)
        {
            return !string.IsNullOrEmpty(Command) && Command.Equals(command, comparisonType);
        }

        public override string ToString()
        {
            string text = "";

            if (IsCommand)
            {
                text += "-";
            }

            text += Command;

            if (!string.IsNullOrEmpty(Parameter))
            {
                text += " \"" + Parameter + "\"";
            }

            return text;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CLICommandAction.cs]---
Location: ShareX-develop/ShareX.HelpersLib/CLI/CLICommandAction.cs

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
using System.Collections.Generic;

namespace ShareX.HelpersLib
{
    public class CLICommandAction
    {
        public string[] Commands;
        public Action DefaultAction;
        public Action<string> TextAction;
        public Action<int> NumberAction;

        public CLICommandAction(params string[] commands)
        {
            Commands = commands;
        }

        public bool CheckCommands(List<CLICommand> commands)
        {
            foreach (CLICommand command in commands)
            {
                foreach (string text in Commands)
                {
                    if (command.CheckCommand(text))
                    {
                        ExecuteAction(command.Parameter);
                        return true;
                    }
                }
            }

            return false;
        }

        private void ExecuteAction(string parameter)
        {
            if (DefaultAction != null)
            {
                DefaultAction();
            }
            else if (!string.IsNullOrEmpty(parameter))
            {
                if (TextAction != null)
                {
                    TextAction(parameter);
                }
                else if (NumberAction != null)
                {
                    if (int.TryParse(parameter, out int num))
                    {
                        NumberAction(num);
                    }
                }
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CLIManager.cs]---
Location: ShareX-develop/ShareX.HelpersLib/CLI/CLIManager.cs

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
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ShareX.HelpersLib
{
    public class CLIManager
    {
        public string[] Arguments { get; private set; }
        public List<CLICommand> Commands { get; private set; }
        public List<CLICommandAction> Actions { get; private set; }

        public CLIManager()
        {
            Commands = new List<CLICommand>();
            Actions = new List<CLICommandAction>();
        }

        public CLIManager(string[] arguments) : this()
        {
            Arguments = arguments;
        }

        public CLIManager(string arguments) : this()
        {
            Arguments = ParseCLI(arguments);
        }

        public bool ParseCommands()
        {
            try
            {
                CLICommand lastCommand = null;

                foreach (string argument in Arguments)
                {
                    if (lastCommand == null || argument[0] == '-')
                    {
                        CLICommand command = new CLICommand();

                        if (argument[0] == '-')
                        {
                            command.IsCommand = true;
                            command.Command = argument.Substring(1);
                            lastCommand = command;
                        }
                        else
                        {
                            command.Command = argument;
                        }

                        Commands.Add(command);
                    }
                    else
                    {
                        lastCommand.Parameter = argument;
                        lastCommand = null;
                    }
                }

                return true;
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
            }

            return false;
        }

        private string[] ParseCLI(string arguments)
        {
            List<string> commands = new List<string>();

            bool inDoubleQuotes = false;

            for (int i = 0, start = 0; i < arguments.Length; i++)
            {
                if ((!inDoubleQuotes && char.IsWhiteSpace(arguments[i])) || (inDoubleQuotes && arguments[i] == '"'))
                {
                    string command = arguments.Substring(start, i - start);

                    if (!string.IsNullOrEmpty(command))
                    {
                        commands.Add(command);
                    }

                    if (inDoubleQuotes) inDoubleQuotes = false;
                    start = i + 1;
                }
                else if (arguments[i] == '"')
                {
                    inDoubleQuotes = true;
                    start = i + 1;
                }
            }

            return commands.ToArray();
        }

        public bool IsCommandExist(params string[] commands)
        {
            if (Commands != null && commands != null)
            {
                foreach (string command in commands.Where(x => !string.IsNullOrEmpty(x)))
                {
                    string command1 = command;

                    if (command1[0] == '-')
                    {
                        command1 = command1.Substring(1);
                    }

                    foreach (CLICommand command2 in Commands.Where(x => x != null && x.IsCommand))
                    {
                        if (command2.CheckCommand(command1))
                        {
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        public CLICommand GetCommand(string command)
        {
            return Commands.Find(x => x.CheckCommand(command));
        }

        public string GetParameter(string command)
        {
            CLICommand cliCommand = GetCommand(command);

            if (cliCommand != null)
            {
                return cliCommand.Parameter;
            }

            return null;
        }

        public void ExecuteActions()
        {
            foreach (CLICommandAction action in Actions)
            {
                action.CheckCommands(Commands);
            }
        }

        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();

            foreach (CLICommand command in Commands)
            {
                if (sb.Length > 0)
                {
                    sb.AppendLine();
                }

                sb.Append(command);
            }

            return sb.ToString();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ExternalCLIManager.cs]---
Location: ShareX-develop/ShareX.HelpersLib/CLI/ExternalCLIManager.cs

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
using System.Text;

namespace ShareX.HelpersLib
{
    public abstract class ExternalCLIManager : IDisposable
    {
        public event DataReceivedEventHandler OutputDataReceived;
        public event DataReceivedEventHandler ErrorDataReceived;

        public bool IsProcessRunning { get; private set; }

        protected Process process;

        public virtual int Open(string path, string args = null)
        {
            if (File.Exists(path))
            {
                using (process = new Process())
                {
                    ProcessStartInfo psi = new ProcessStartInfo()
                    {
                        FileName = path,
                        WorkingDirectory = Path.GetDirectoryName(path),
                        Arguments = args,
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        RedirectStandardInput = true,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        StandardOutputEncoding = Encoding.UTF8,
                        StandardErrorEncoding = Encoding.UTF8
                    };

                    process.EnableRaisingEvents = true;
                    if (psi.RedirectStandardOutput) process.OutputDataReceived += cli_OutputDataReceived;
                    if (psi.RedirectStandardError) process.ErrorDataReceived += cli_ErrorDataReceived;
                    process.StartInfo = psi;

                    DebugHelper.WriteLine($"CLI: \"{psi.FileName}\" {psi.Arguments}");
                    process.Start();

                    if (psi.RedirectStandardOutput) process.BeginOutputReadLine();
                    if (psi.RedirectStandardError) process.BeginErrorReadLine();

                    try
                    {
                        IsProcessRunning = true;
                        process.WaitForExit();
                    }
                    finally
                    {
                        IsProcessRunning = false;
                    }

                    return process.ExitCode;
                }
            }

            return -1;
        }

        private void cli_OutputDataReceived(object sender, DataReceivedEventArgs e)
        {
            if (e.Data != null)
            {
                OutputDataReceived?.Invoke(sender, e);
            }
        }

        private void cli_ErrorDataReceived(object sender, DataReceivedEventArgs e)
        {
            if (e.Data != null)
            {
                ErrorDataReceived?.Invoke(sender, e);
            }
        }

        public void WriteInput(string input)
        {
            if (IsProcessRunning && process != null && process.StartInfo != null && process.StartInfo.RedirectStandardInput)
            {
                process.StandardInput.WriteLine(input);
            }
        }

        public virtual void Close()
        {
            if (IsProcessRunning && process != null)
            {
                process.CloseMainWindow();
            }
        }

        public void Dispose()
        {
            if (process != null)
            {
                process.Dispose();
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CMYK.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Colors/CMYK.cs

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

using ShareX.HelpersLib.Properties;
using System.Drawing;

namespace ShareX.HelpersLib
{
    public struct CMYK
    {
        private double cyan;
        private double magenta;
        private double yellow;
        private double key;
        private int alpha;

        public double Cyan
        {
            get
            {
                return cyan;
            }
            set
            {
                cyan = ColorHelpers.ValidColor(value);
            }
        }

        public double Cyan100
        {
            get
            {
                return cyan * 100;
            }
            set
            {
                cyan = ColorHelpers.ValidColor(value / 100);
            }
        }

        public double Magenta
        {
            get
            {
                return magenta;
            }
            set
            {
                magenta = ColorHelpers.ValidColor(value);
            }
        }

        public double Magenta100
        {
            get
            {
                return magenta * 100;
            }
            set
            {
                magenta = ColorHelpers.ValidColor(value / 100);
            }
        }

        public double Yellow
        {
            get
            {
                return yellow;
            }
            set
            {
                yellow = ColorHelpers.ValidColor(value);
            }
        }

        public double Yellow100
        {
            get
            {
                return yellow * 100;
            }
            set
            {
                yellow = ColorHelpers.ValidColor(value / 100);
            }
        }

        public double Key
        {
            get
            {
                return key;
            }
            set
            {
                key = ColorHelpers.ValidColor(value);
            }
        }

        public double Key100
        {
            get
            {
                return key * 100;
            }
            set
            {
                key = ColorHelpers.ValidColor(value / 100);
            }
        }

        public int Alpha
        {
            get
            {
                return alpha;
            }
            set
            {
                alpha = ColorHelpers.ValidColor(value);
            }
        }

        public CMYK(double cyan, double magenta, double yellow, double key, int alpha = 255) : this()
        {
            Cyan = cyan;
            Magenta = magenta;
            Yellow = yellow;
            Key = key;
            Alpha = alpha;
        }

        public CMYK(int cyan, int magenta, int yellow, int key, int alpha = 255) : this()
        {
            Cyan100 = cyan;
            Magenta100 = magenta;
            Yellow100 = yellow;
            Key100 = key;
            Alpha = alpha;
        }

        public CMYK(Color color)
        {
            this = ColorHelpers.ColorToCMYK(color);
        }

        public static implicit operator CMYK(Color color)
        {
            return ColorHelpers.ColorToCMYK(color);
        }

        public static implicit operator Color(CMYK color)
        {
            return color.ToColor();
        }

        public static implicit operator RGBA(CMYK color)
        {
            return color.ToColor();
        }

        public static implicit operator HSB(CMYK color)
        {
            return color.ToColor();
        }

        public static bool operator ==(CMYK left, CMYK right)
        {
            return (left.Cyan == right.Cyan) && (left.Magenta == right.Magenta) && (left.Yellow == right.Yellow) && (left.Key == right.Key);
        }

        public static bool operator !=(CMYK left, CMYK right)
        {
            return !(left == right);
        }

        public override string ToString()
        {
            return string.Format(Resources.CMYK_ToString_Cyan___0_0_0____Magenta___1_0_0____Yellow___2_0_0____Key___3_0_0__, Cyan100, Magenta100, Yellow100, Key100);
        }

        public Color ToColor()
        {
            return ColorHelpers.CMYKToColor(this);
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        public override bool Equals(object obj)
        {
            return base.Equals(obj);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ColorBox.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Colors/ColorBox.cs

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
using System.Drawing.Drawing2D;

namespace ShareX.HelpersLib
{
    public class ColorBox : ColorUserControl
    {
        public ColorBox()
        {
            Initialize();
        }

        protected override void Initialize()
        {
            Name = "ColorBox";
            ClientSize = new Size(256, 256);
            base.Initialize();
        }

        protected override void DrawCrosshair(Graphics g)
        {
            DrawCrosshair(g, Pens.Black, 6);
            DrawCrosshair(g, Pens.White, 5);
        }

        private void DrawCrosshair(Graphics g, Pen pen, int size)
        {
            g.DrawEllipse(pen, new Rectangle(new Point(lastPos.X - size, lastPos.Y - size), new Size(size * 2, size * 2)));
        }

        // X = Saturation 0 -> 100
        // Y = Brightness 100 -> 0
        protected override void DrawHue()
        {
            using (Graphics g = Graphics.FromImage(bmp))
            {
                HSB start = new HSB(SelectedColor.HSB.Hue, 0.0, 0.0, SelectedColor.RGBA.Alpha);
                HSB end = new HSB(SelectedColor.HSB.Hue, 1.0, 0.0, SelectedColor.RGBA.Alpha);

                for (int y = 0; y < clientHeight; y++)
                {
                    start.Brightness = end.Brightness = 1.0 - ((double)y / (clientHeight - 1));

                    using (LinearGradientBrush brush = new LinearGradientBrush(new Rectangle(0, 0, clientWidth, 1), start, end, LinearGradientMode.Horizontal))
                    {
                        g.FillRectangle(brush, new Rectangle(0, y, clientWidth, 1));
                    }
                }
            }
        }

        // X = Hue 0 -> 360
        // Y = Brightness 100 -> 0
        protected override void DrawSaturation()
        {
            using (Graphics g = Graphics.FromImage(bmp))
            {
                HSB start = new HSB(0.0, SelectedColor.HSB.Saturation, 1.0, SelectedColor.RGBA.Alpha);
                HSB end = new HSB(0.0, SelectedColor.HSB.Saturation, 0.0, SelectedColor.RGBA.Alpha);

                for (int x = 0; x < clientWidth; x++)
                {
                    start.Hue = end.Hue = (double)x / (clientHeight - 1);

                    using (LinearGradientBrush brush = new LinearGradientBrush(new Rectangle(0, 0, 1, clientHeight), start, end, LinearGradientMode.Vertical))
                    {
                        g.FillRectangle(brush, new Rectangle(x, 0, 1, clientHeight));
                    }
                }
            }
        }

        // X = Hue 0 -> 360
        // Y = Saturation 100 -> 0
        protected override void DrawBrightness()
        {
            using (Graphics g = Graphics.FromImage(bmp))
            {
                HSB start = new HSB(0.0, 1.0, SelectedColor.HSB.Brightness, SelectedColor.RGBA.Alpha);
                HSB end = new HSB(0.0, 0.0, SelectedColor.HSB.Brightness, SelectedColor.RGBA.Alpha);

                for (int x = 0; x < clientWidth; x++)
                {
                    start.Hue = end.Hue = (double)x / (clientHeight - 1);

                    using (LinearGradientBrush brush = new LinearGradientBrush(new Rectangle(0, 0, 1, clientHeight), start, end, LinearGradientMode.Vertical))
                    {
                        g.FillRectangle(brush, new Rectangle(x, 0, 1, clientHeight));
                    }
                }
            }
        }

        // X = Blue 0 -> 255
        // Y = Green 255 -> 0
        protected override void DrawRed()
        {
            using (Graphics g = Graphics.FromImage(bmp))
            {
                RGBA start = new RGBA(SelectedColor.RGBA.Red, 0, 0, SelectedColor.RGBA.Alpha);
                RGBA end = new RGBA(SelectedColor.RGBA.Red, 0, 255, SelectedColor.RGBA.Alpha);

                for (int y = 0; y < clientHeight; y++)
                {
                    start.Green = end.Green = Round(255 - (255 * (double)y / (clientHeight - 1)));

                    using (LinearGradientBrush brush = new LinearGradientBrush(new Rectangle(0, 0, clientWidth, 1), start, end, LinearGradientMode.Horizontal))
                    {
                        g.FillRectangle(brush, new Rectangle(0, y, clientWidth, 1));
                    }
                }
            }
        }

        // X = Blue 0 -> 255
        // Y = Red 255 -> 0
        protected override void DrawGreen()
        {
            using (Graphics g = Graphics.FromImage(bmp))
            {
                RGBA start = new RGBA(0, SelectedColor.RGBA.Green, 0, SelectedColor.RGBA.Alpha);
                RGBA end = new RGBA(0, SelectedColor.RGBA.Green, 255, SelectedColor.RGBA.Alpha);

                for (int y = 0; y < clientHeight; y++)
                {
                    start.Red = end.Red = Round(255 - (255 * (double)y / (clientHeight - 1)));

                    using (LinearGradientBrush brush = new LinearGradientBrush(new Rectangle(0, 0, clientWidth, 1), start, end, LinearGradientMode.Horizontal))
                    {
                        g.FillRectangle(brush, new Rectangle(0, y, clientWidth, 1));
                    }
                }
            }
        }

        // X = Red 0 -> 255
        // Y = Green 255 -> 0
        protected override void DrawBlue()
        {
            using (Graphics g = Graphics.FromImage(bmp))
            {
                RGBA start = new RGBA(0, 0, SelectedColor.RGBA.Blue, SelectedColor.RGBA.Alpha);
                RGBA end = new RGBA(255, 0, SelectedColor.RGBA.Blue, SelectedColor.RGBA.Alpha);

                for (int y = 0; y < clientHeight; y++)
                {
                    start.Green = end.Green = Round(255 - (255 * (double)y / (clientHeight - 1)));

                    using (LinearGradientBrush brush = new LinearGradientBrush(new Rectangle(0, 0, clientWidth, 1), start, end, LinearGradientMode.Horizontal))
                    {
                        g.FillRectangle(brush, new Rectangle(0, y, clientWidth, 1));
                    }
                }
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ColorEventHandler.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Colors/ColorEventHandler.cs

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
    public delegate void ColorEventHandler(object sender, ColorEventArgs e);

    public class ColorEventArgs : EventArgs
    {
        public ColorEventArgs(MyColor color, ColorType colorType)
        {
            Color = color;
            ColorType = colorType;
        }

        public ColorEventArgs(MyColor color, DrawStyle drawStyle)
        {
            Color = color;
            DrawStyle = drawStyle;
        }

        public MyColor Color;
        public ColorType ColorType;
        public DrawStyle DrawStyle;
    }
}
```

--------------------------------------------------------------------------------

````
