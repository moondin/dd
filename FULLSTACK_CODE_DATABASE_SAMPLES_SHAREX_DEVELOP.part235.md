---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 235
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 235 of 650)

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

---[FILE: MutexManager.cs]---
Location: ShareX-develop/ShareX.HelpersLib/MutexManager.cs

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
using System.Threading;

namespace ShareX.HelpersLib
{
    public class MutexManager : IDisposable
    {
        public bool HasHandle { get; private set; }

        private Mutex mutex;

        public MutexManager(string mutexName) : this(mutexName, Timeout.Infinite)
        {
        }

        public MutexManager(string mutexName, int timeout)
        {
            mutex = new Mutex(false, mutexName);

            try
            {
                HasHandle = mutex.WaitOne(timeout, false);
            }
            catch (AbandonedMutexException)
            {
                HasHandle = true;
            }
        }

        public static bool IsRunning(string mutexName)
        {
            try
            {
                using (Mutex mutex = new Mutex(false, mutexName, out bool createdNew))
                {
                    return !createdNew;
                }
            }
            catch
            {
            }

            return false;
        }

        public void Dispose()
        {
            if (mutex != null)
            {
                if (HasHandle)
                {
                    mutex.ReleaseMutex();
                }

                mutex.Dispose();
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: NativeMessagingHost.cs]---
Location: ShareX-develop/ShareX.HelpersLib/NativeMessagingHost.cs

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
using System.Text;

namespace ShareX.HelpersLib
{
    public class NativeMessagingHost
    {
        public string Read()
        {
            string input = null;

            Stream inputStream = Console.OpenStandardInput();

            byte[] bytesLength = new byte[4];
            inputStream.ReadExactly(bytesLength);
            int inputLength = BitConverter.ToInt32(bytesLength, 0);

            if (inputLength > 0)
            {
                byte[] bytesInput = new byte[inputLength];
                inputStream.ReadExactly(bytesInput);
                input = Encoding.UTF8.GetString(bytesInput);
            }

            return input;
        }

        public void Write(string data)
        {
            Stream outputStream = Console.OpenStandardOutput();

            byte[] bytesData = Encoding.UTF8.GetBytes(data);
            byte[] bytesLength = BitConverter.GetBytes(bytesData.Length);

            outputStream.Write(bytesLength, 0, bytesLength.Length);

            if (bytesData.Length > 0)
            {
                outputStream.Write(bytesData, 0, bytesData.Length);
            }

            outputStream.Flush();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: PingHelper.cs]---
Location: ShareX-develop/ShareX.HelpersLib/PingHelper.cs

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
using System.Net;
using System.Net.NetworkInformation;
using System.Threading;

namespace ShareX.HelpersLib
{
    public static class PingHelper
    {
        public static PingResult PingHost(string host, int timeout = 1000, int pingCount = 4, int waitTime = 100)
        {
            PingResult pingResult = new PingResult();
            IPAddress address = GetIpFromHost(host);
            byte[] buffer = new byte[32];
            PingOptions pingOptions = new PingOptions(128, true);

            using (Ping ping = new Ping())
            {
                for (int i = 0; i < pingCount; i++)
                {
                    try
                    {
                        PingReply pingReply = ping.Send(address, timeout, buffer, pingOptions);

                        if (pingReply != null)
                        {
                            pingResult.PingReplyList.Add(pingReply);
                        }
                    }
                    catch (Exception e)
                    {
                        DebugHelper.WriteException(e);
                    }

                    if (waitTime > 0 && i + 1 < pingCount)
                    {
                        Thread.Sleep(waitTime);
                    }
                }
            }

            return pingResult;
        }

        private static IPAddress GetIpFromHost(string host)
        {
            if (!IPAddress.TryParse(host, out IPAddress address))
            {
                try
                {
                    address = Dns.GetHostEntry(host).AddressList[0];
                }
                catch (Exception e)
                {
                    DebugHelper.WriteException(e);
                }
            }

            return address;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: PingResult.cs]---
Location: ShareX-develop/ShareX.HelpersLib/PingResult.cs

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

using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;

namespace ShareX.HelpersLib
{
    public class PingResult
    {
        public List<PingReply> PingReplyList { get; private set; }

        public int Min
        {
            get
            {
                return (int)PingReplyList.Where(x => x.Status == IPStatus.Success).Min(x => x.RoundtripTime);
            }
        }

        public int Max
        {
            get
            {
                return (int)PingReplyList.Where(x => x.Status == IPStatus.Success).Max(x => x.RoundtripTime);
            }
        }

        public int Average
        {
            get
            {
                return (int)PingReplyList.Where(x => x.Status == IPStatus.Success).Average(x => x.RoundtripTime);
            }
        }

        public PingResult()
        {
            PingReplyList = new List<PingReply>();
        }

        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();

            foreach (PingReply pingReply in PingReplyList)
            {
                if (pingReply != null)
                {
                    switch (pingReply.Status)
                    {
                        case IPStatus.Success:
                            sb.AppendLine(string.Format("Reply from {0}: bytes={1} time={2}ms TTL={3}", pingReply.Address, pingReply.Buffer.Length, pingReply.RoundtripTime, pingReply.Options.Ttl));
                            break;
                        case IPStatus.TimedOut:
                            sb.AppendLine("Request timed out.");
                            break;
                        default:
                            sb.AppendLine(string.Format("Ping failed: {0}", pingReply.Status.ToString()));
                            break;
                    }
                }
            }

            if (PingReplyList.Any(x => x.Status == IPStatus.Success))
            {
                sb.AppendLine(string.Format("Minimum = {0}ms, Maximum = {1}ms, Average = {2}ms", Min, Max, Average));
            }

            return sb.ToString().Trim();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: PointInfo.cs]---
Location: ShareX-develop/ShareX.HelpersLib/PointInfo.cs

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

namespace ShareX.HelpersLib
{
    public class PointInfo
    {
        public Point Position { get; set; }
        public Color Color { get; set; }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ProxyInfo.cs]---
Location: ShareX-develop/ShareX.HelpersLib/ProxyInfo.cs

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
using System.Net;
using System.Reflection;

namespace ShareX.HelpersLib
{
    public class ProxyInfo
    {
        public ProxyMethod ProxyMethod { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }

        public ProxyInfo()
        {
            ProxyMethod = ProxyMethod.Manual;
        }

        public bool IsValidProxy()
        {
            if (ProxyMethod == ProxyMethod.Manual)
            {
                return !string.IsNullOrEmpty(Host) && Port > 0;
            }

            if (ProxyMethod == ProxyMethod.Automatic)
            {
                WebProxy systemProxy = GetDefaultWebProxy();

                if (systemProxy != null && systemProxy.Address != null && !string.IsNullOrEmpty(systemProxy.Address.Host) && systemProxy.Address.Port > 0)
                {
                    Host = systemProxy.Address.Host;
                    Port = systemProxy.Address.Port;
                    return true;
                }
            }

            return false;
        }

        public IWebProxy GetWebProxy()
        {
            try
            {
                if (IsValidProxy())
                {
                    NetworkCredential credentials = new NetworkCredential(Username, Password);
                    string address = string.Format("{0}:{1}", Host, Port);
                    return new WebProxy(address, true, null, credentials);
                }
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e, "GetWebProxy failed.");
            }

            return null;
        }

        private WebProxy GetDefaultWebProxy()
        {
            try
            {
                // Need better solution
                return (WebProxy)typeof(WebProxy).GetConstructor(BindingFlags.Instance | BindingFlags.NonPublic,
                    null, new Type[] { typeof(bool) }, null).Invoke(new object[] { true });
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e, "Reflection failed.");
            }

            return null;
        }

        public override string ToString()
        {
            return string.Format("{0} - {1}:{2}", Username, Host, Port);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: SevenZipManager.cs]---
Location: ShareX-develop/ShareX.HelpersLib/SevenZipManager.cs

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

using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;

namespace ShareX.HelpersLib
{
    public class SevenZipManager
    {
        public string SevenZipPath { get; set; }

        public SevenZipManager()
        {
            SevenZipPath = FileHelpers.GetAbsolutePath("7za.exe");
        }

        public SevenZipManager(string sevenZipPath)
        {
            SevenZipPath = sevenZipPath;
        }

        public bool Extract(string archivePath, string destination)
        {
            string arguments = $"x \"{archivePath}\" -o\"{destination}\" -y";
            return Run(arguments) == 0;
        }

        public bool Extract(string archivePath, string destination, List<string> files)
        {
            string fileArgs = string.Join(" ", files.Select(x => $"\"{x}\""));
            string arguments = $"e \"{archivePath}\" -o\"{destination}\" {fileArgs} -r -y";
            return Run(arguments) == 0;
        }

        public bool Compress(string archivePath, List<string> files, string workingDirectory = "")
        {
            if (File.Exists(archivePath))
            {
                File.Delete(archivePath);
            }

            string fileArgs = string.Join(" ", files.Select(x => $"\"{x}\""));
            string arguments = $"a -tzip \"{archivePath}\" {fileArgs} -mx=9";
            return Run(arguments, workingDirectory) == 0;
        }

        private int Run(string arguments, string workingDirectory = "")
        {
            using (Process process = new Process())
            {
                ProcessStartInfo psi = new ProcessStartInfo()
                {
                    FileName = SevenZipPath,
                    Arguments = arguments,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                if (!string.IsNullOrEmpty(workingDirectory))
                {
                    psi.WorkingDirectory = workingDirectory;
                }

                process.StartInfo = psi;
                process.Start();
                process.WaitForExit();

                return process.ExitCode;
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ShareX.HelpersLib.csproj]---
Location: ShareX-develop/ShareX.HelpersLib/ShareX.HelpersLib.csproj

```text
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net9.0-windows</TargetFramework>
    <OutputType>Library</OutputType>
    <PlatformTarget>x64</PlatformTarget>
    <RuntimeIdentifier>win-x64</RuntimeIdentifier>
    <UseWindowsForms>true</UseWindowsForms>
    <UseWPF>true</UseWPF>
    <AllowUnsafeBlocks>true</AllowUnsafeBlocks>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Newtonsoft.Json" Version="13.0.4" />
  </ItemGroup>
</Project>
```

--------------------------------------------------------------------------------

---[FILE: ShareXResources.cs]---
Location: ShareX-develop/ShareX.HelpersLib/ShareXResources.cs

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
using System.ComponentModel;
using System.Drawing;
using System.Reflection;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public static class ShareXResources
    {
        public static string Name { get; set; } = "ShareX";

        public static string UserAgent
        {
            get
            {
                return $"{Name}/{Helpers.GetApplicationVersion()}";
            }
        }

        public static bool IsDarkTheme => Theme.IsDarkTheme;

        private static bool useWhiteIcon;

        public static bool UseWhiteIcon
        {
            get
            {
                return useWhiteIcon;
            }
            set
            {
                if (useWhiteIcon != value)
                {
                    useWhiteIcon = value;

                    if (useWhiteIcon)
                    {
                        Icon = Resources.ShareX_Icon_White;
                    }
                    else
                    {
                        Icon = Resources.ShareX_Icon;
                    }
                }
            }
        }

        private static Icon icon = Resources.ShareX_Icon;

        public static Icon Icon
        {
            get
            {
                return icon.CloneSafe();
            }
            set
            {
                if (icon != value)
                {
                    icon?.Dispose();
                    icon = value;
                }
            }
        }

        private static Bitmap logo = Resources.ShareX_Logo;

        public static Bitmap Logo
        {
            get
            {
                return logo.CloneSafe();
            }
            set
            {
                if (logo != value)
                {
                    logo?.Dispose();
                    logo = value;
                }
            }
        }

        public static ShareXTheme Theme { get; set; } = ShareXTheme.DarkTheme;

        public static void ApplyTheme(Form form, bool closeOnEscape = false, bool setIcon = true)
        {
            if (closeOnEscape)
            {
                form.CloseOnEscape();
            }

            if (setIcon)
            {
                form.Icon = Icon;
            }

            ApplyCustomThemeToControl(form);

            IContainer components = form.GetType().GetField("components", BindingFlags.NonPublic | BindingFlags.Instance)?.GetValue(form) as IContainer;
            ApplyCustomThemeToComponents(components);

            if (form.IsHandleCreated)
            {
                NativeMethods.UseImmersiveDarkMode(form.Handle, Theme.IsDarkTheme);
            }
            else
            {
                form.HandleCreated += (s, e) => NativeMethods.UseImmersiveDarkMode(form.Handle, Theme.IsDarkTheme);
            }
        }

        public static void ApplyCustomThemeToControl(Control control)
        {
            if (control.ContextMenuStrip != null)
            {
                ApplyCustomThemeToContextMenuStrip(control.ContextMenuStrip);
            }

            if (control is MenuButton mb && mb.Menu != null)
            {
                ApplyCustomThemeToContextMenuStrip(mb.Menu);
            }

            switch (control)
            {
                case ColorButton colorButton:
                    colorButton.FlatStyle = FlatStyle.Flat;
                    colorButton.FlatAppearance.BorderColor = Theme.BorderColor;
                    colorButton.ForeColor = Theme.TextColor;
                    colorButton.BackColor = Theme.LightBackgroundColor;
                    colorButton.BorderColor = Theme.BorderColor;
                    return;
                case Button btn:
                    btn.FlatStyle = FlatStyle.Flat;
                    btn.FlatAppearance.BorderColor = Theme.BorderColor;
                    btn.ForeColor = Theme.TextColor;
                    btn.BackColor = Theme.LightBackgroundColor;
                    return;
                case CheckBox cb when cb.Appearance == Appearance.Button:
                    cb.FlatStyle = FlatStyle.Flat;
                    cb.FlatAppearance.BorderColor = Theme.BorderColor;
                    cb.ForeColor = Theme.TextColor;
                    cb.BackColor = Theme.LightBackgroundColor;
                    return;
                case TextBox tb:
                    tb.ForeColor = Theme.TextColor;
                    tb.BackColor = Theme.LightBackgroundColor;
                    tb.BorderStyle = BorderStyle.FixedSingle;
                    return;
                case ComboBox cb:
                    cb.FlatStyle = FlatStyle.Flat;
                    cb.ForeColor = Theme.TextColor;
                    cb.BackColor = Theme.LightBackgroundColor;
                    return;
                case ListBox lb:
                    lb.ForeColor = Theme.TextColor;
                    lb.BackColor = Theme.LightBackgroundColor;
                    return;
                case ListView lv:
                    lv.ForeColor = Theme.TextColor;
                    lv.BackColor = Theme.LightBackgroundColor;
                    lv.SupportCustomTheme();
                    return;
                case SplitContainerCustomSplitter sccs:
                    sccs.SplitterColor = Theme.BackgroundColor;
                    sccs.SplitterLineColor = Theme.BorderColor;
                    sccs.Panel1.BackColor = Theme.BackgroundColor;
                    sccs.Panel2.BackColor = Theme.BackgroundColor;
                    break;
                case SplitContainer sc:
                    sc.Panel1.BackColor = Theme.BackgroundColor;
                    sc.Panel2.BackColor = Theme.BackgroundColor;
                    break;
                case PropertyGrid pg:
                    pg.CategoryForeColor = Theme.TextColor;
                    pg.CategorySplitterColor = Theme.BackgroundColor;
                    pg.LineColor = Theme.BackgroundColor;
                    pg.SelectedItemWithFocusForeColor = Theme.BackgroundColor;
                    pg.SelectedItemWithFocusBackColor = Theme.TextColor;
                    pg.ViewForeColor = Theme.TextColor;
                    pg.ViewBackColor = Theme.LightBackgroundColor;
                    pg.ViewBorderColor = Theme.BorderColor;
                    pg.HelpForeColor = Theme.TextColor;
                    pg.HelpBackColor = Theme.BackgroundColor;
                    pg.HelpBorderColor = Theme.BorderColor;
                    return;
                case DataGridView dgv:
                    dgv.BackgroundColor = Theme.LightBackgroundColor;
                    dgv.GridColor = Theme.BorderColor;
                    dgv.DefaultCellStyle.BackColor = Theme.LightBackgroundColor;
                    dgv.DefaultCellStyle.SelectionBackColor = Theme.LightBackgroundColor;
                    dgv.DefaultCellStyle.ForeColor = Theme.TextColor;
                    dgv.DefaultCellStyle.SelectionForeColor = Theme.TextColor;
                    dgv.ColumnHeadersDefaultCellStyle.BackColor = Theme.BackgroundColor;
                    dgv.ColumnHeadersDefaultCellStyle.SelectionBackColor = Theme.BackgroundColor;
                    dgv.ColumnHeadersDefaultCellStyle.ForeColor = Theme.TextColor;
                    dgv.ColumnHeadersDefaultCellStyle.SelectionForeColor = Theme.TextColor;
                    dgv.EnableHeadersVisualStyles = false;
                    break;
                case ContextMenuStrip cms:
                    ApplyCustomThemeToContextMenuStrip(cms);
                    return;
                case ToolStrip ts:
                    ts.Font = Theme.MenuFont;
                    ts.Renderer = new ToolStripDarkRenderer();
                    ApplyCustomThemeToToolStripItemCollection(ts.Items);
                    return;
                case LinkLabel ll:
                    ll.LinkColor = Theme.LinkColor;
                    break;
            }

            control.ForeColor = Theme.TextColor;
            control.BackColor = Theme.BackgroundColor;

            foreach (Control child in control.Controls)
            {
                ApplyCustomThemeToControl(child);
            }

            switch (control)
            {
                case TabToTreeView tttv:
                    tttv.LeftPanelBackColor = Theme.DarkBackgroundColor;
                    tttv.SeparatorColor = Theme.SeparatorDarkColor;
                    break;
            }
        }

        private static void ApplyCustomThemeToComponents(IContainer container)
        {
            if (container != null)
            {
                foreach (IComponent component in container.Components)
                {
                    switch (component)
                    {
                        case ContextMenuStrip cms:
                            ApplyCustomThemeToContextMenuStrip(cms);
                            break;
                        case ToolTip tt:
                            tt.ForeColor = Theme.TextColor;
                            tt.BackColor = Theme.BackgroundColor;
                            tt.OwnerDraw = true;
                            tt.Draw -= ToolTip_Draw;
                            tt.Draw += ToolTip_Draw;
                            break;
                    }
                }
            }
        }

        private static void ToolTip_Draw(object sender, DrawToolTipEventArgs e)
        {
            e.DrawBackground();
            e.DrawBorder();
            e.DrawText(TextFormatFlags.VerticalCenter | TextFormatFlags.LeftAndRightPadding);
        }

        public static void ApplyCustomThemeToContextMenuStrip(ContextMenuStrip cms)
        {
            if (cms != null)
            {
                cms.Renderer = new ToolStripDarkRenderer();
                cms.Font = Theme.ContextMenuFont;
                cms.Opacity = Theme.ContextMenuOpacityDouble;
                ApplyCustomThemeToToolStripItemCollection(cms.Items);
            }
        }

        private static void ApplyCustomThemeToToolStripItemCollection(ToolStripItemCollection collection)
        {
            foreach (ToolStripItem tsi in collection)
            {
                switch (tsi)
                {
                    case ToolStripControlHost tsch:
                        ApplyCustomThemeToControl(tsch.Control);
                        break;
                    case ToolStripDropDownItem tsddi:
                        if (tsddi.DropDown != null)
                        {
                            tsddi.DropDown.Opacity = Theme.ContextMenuOpacityDouble;
                            ApplyCustomThemeToToolStripItemCollection(tsddi.DropDownItems);
                        }
                        break;
                }
            }
        }
    }
}
```

--------------------------------------------------------------------------------

````
