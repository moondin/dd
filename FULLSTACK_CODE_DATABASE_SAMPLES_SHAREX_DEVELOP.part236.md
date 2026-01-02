---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 236
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 236 of 650)

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

---[FILE: ShareXTheme.cs]---
Location: ShareX-develop/ShareX.HelpersLib/ShareXTheme.cs

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
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Design;

namespace ShareX.HelpersLib
{
    public class ShareXTheme
    {
        public string Name { get; set; }

        private Color backgroundColor;

        [Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color BackgroundColor
        {
            get
            {
                return backgroundColor;
            }
            set
            {
                if (!value.IsTransparent()) backgroundColor = value;
            }
        }

        private Color lightBackgroundColor;

        [Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color LightBackgroundColor
        {
            get
            {
                return lightBackgroundColor;
            }
            set
            {
                if (!value.IsTransparent()) lightBackgroundColor = value;
            }
        }

        private Color darkBackgroundColor;

        [Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color DarkBackgroundColor
        {
            get
            {
                return darkBackgroundColor;
            }
            set
            {
                if (!value.IsTransparent()) darkBackgroundColor = value;
            }
        }

        private Color textColor;

        [Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color TextColor
        {
            get
            {
                return textColor;
            }
            set
            {
                if (!value.IsTransparent()) textColor = value;
            }
        }

        private Color borderColor;

        [Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color BorderColor
        {
            get
            {
                return borderColor;
            }
            set
            {
                if (!value.IsTransparent()) borderColor = value;
            }
        }

        [Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color CheckerColor { get; set; }

        [Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color CheckerColor2 { get; set; }

        public int CheckerSize { get; set; } = 15;

        [Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color LinkColor { get; set; }

        [Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color MenuHighlightColor { get; set; }

        [Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color MenuHighlightBorderColor { get; set; }

        [Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color MenuBorderColor { get; set; }

        [Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color MenuCheckBackgroundColor { get; set; }

        public Font MenuFont { get; set; } = new Font("Segoe UI", 9.75f);

        public Font ContextMenuFont { get; set; } = new Font("Segoe UI", 9.75f);

        public int ContextMenuOpacity { get; set; } = 100;

        [Browsable(false)]
        public double ContextMenuOpacityDouble => ContextMenuOpacity.Clamp(10, 100) / 100d;

        [Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color SeparatorLightColor { get; set; }

        [Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color SeparatorDarkColor { get; set; }

        [Browsable(false)]
        public bool IsDarkTheme => ColorHelpers.IsDarkColor(BackgroundColor);

        private ShareXTheme()
        {
        }

        public static ShareXTheme DarkTheme => new ShareXTheme()
        {
            Name = "Dark",
            BackgroundColor = Color.FromArgb(39, 39, 39),
            LightBackgroundColor = Color.FromArgb(46, 46, 46),
            DarkBackgroundColor = Color.FromArgb(34, 34, 34),
            TextColor = Color.FromArgb(231, 233, 234),
            BorderColor = Color.FromArgb(31, 31, 31),
            CheckerColor = Color.FromArgb(46, 46, 46),
            CheckerColor2 = Color.FromArgb(39, 39, 39),
            LinkColor = Color.FromArgb(166, 212, 255),
            MenuHighlightColor = Color.FromArgb(46, 46, 46),
            MenuHighlightBorderColor = Color.FromArgb(63, 63, 63),
            MenuBorderColor = Color.FromArgb(63, 63, 63),
            MenuCheckBackgroundColor = Color.FromArgb(51, 51, 51),
            SeparatorLightColor = Color.FromArgb(44, 44, 44),
            SeparatorDarkColor = Color.FromArgb(31, 31, 31)
        };

        public static ShareXTheme LightTheme => new ShareXTheme()
        {
            Name = "Light",
            BackgroundColor = Color.FromArgb(242, 242, 242),
            LightBackgroundColor = Color.FromArgb(247, 247, 247),
            DarkBackgroundColor = Color.FromArgb(235, 235, 235),
            TextColor = Color.FromArgb(69, 69, 69),
            BorderColor = Color.FromArgb(201, 201, 201),
            CheckerColor = Color.FromArgb(247, 247, 247),
            CheckerColor2 = Color.FromArgb(235, 235, 235),
            LinkColor = Color.FromArgb(166, 212, 255),
            MenuHighlightColor = Color.FromArgb(247, 247, 247),
            MenuHighlightBorderColor = Color.FromArgb(96, 143, 226),
            MenuBorderColor = Color.FromArgb(201, 201, 201),
            MenuCheckBackgroundColor = Color.FromArgb(225, 233, 244),
            SeparatorLightColor = Color.FromArgb(253, 253, 253),
            SeparatorDarkColor = Color.FromArgb(189, 189, 189)
        };

        public static ShareXTheme NightTheme => new ShareXTheme()
        {
            Name = "Night",
            BackgroundColor = Color.FromArgb(42, 47, 56),
            LightBackgroundColor = Color.FromArgb(52, 57, 65),
            DarkBackgroundColor = Color.FromArgb(28, 32, 38),
            TextColor = Color.FromArgb(235, 235, 235),
            BorderColor = Color.FromArgb(28, 32, 38),
            CheckerColor = Color.FromArgb(60, 60, 60),
            CheckerColor2 = Color.FromArgb(50, 50, 50),
            LinkColor = Color.FromArgb(166, 212, 255),
            MenuHighlightColor = Color.FromArgb(30, 34, 40),
            MenuHighlightBorderColor = Color.FromArgb(116, 129, 152),
            MenuBorderColor = Color.FromArgb(22, 26, 31),
            MenuCheckBackgroundColor = Color.FromArgb(56, 64, 75),
            SeparatorLightColor = Color.FromArgb(56, 64, 75),
            SeparatorDarkColor = Color.FromArgb(22, 26, 31)
        };

        // https://www.nordtheme.com
        public static ShareXTheme NordDarkTheme => new ShareXTheme()
        {
            Name = "Nord Dark",
            BackgroundColor = Color.FromArgb(46, 52, 64),
            LightBackgroundColor = Color.FromArgb(59, 66, 82),
            DarkBackgroundColor = Color.FromArgb(38, 44, 57),
            TextColor = Color.FromArgb(229, 233, 240),
            BorderColor = Color.FromArgb(30, 38, 54),
            CheckerColor = Color.FromArgb(46, 52, 64),
            CheckerColor2 = Color.FromArgb(36, 42, 54),
            LinkColor = Color.FromArgb(136, 192, 208),
            MenuHighlightColor = Color.FromArgb(36, 42, 54),
            MenuHighlightBorderColor = Color.FromArgb(24, 30, 42),
            MenuBorderColor = Color.FromArgb(24, 30, 42),
            MenuCheckBackgroundColor = Color.FromArgb(59, 66, 82),
            SeparatorLightColor = Color.FromArgb(59, 66, 82),
            SeparatorDarkColor = Color.FromArgb(30, 38, 54)
        };

        // https://www.nordtheme.com
        public static ShareXTheme NordLightTheme => new ShareXTheme()
        {
            Name = "Nord Light",
            BackgroundColor = Color.FromArgb(229, 233, 240),
            LightBackgroundColor = Color.FromArgb(236, 239, 244),
            DarkBackgroundColor = Color.FromArgb(216, 222, 233),
            TextColor = Color.FromArgb(59, 66, 82),
            BorderColor = Color.FromArgb(207, 216, 233),
            CheckerColor = Color.FromArgb(229, 233, 240),
            CheckerColor2 = Color.FromArgb(216, 222, 233),
            LinkColor = Color.FromArgb(106, 162, 178),
            MenuHighlightColor = Color.FromArgb(236, 239, 244),
            MenuHighlightBorderColor = Color.FromArgb(207, 216, 233),
            MenuBorderColor = Color.FromArgb(216, 222, 233),
            MenuCheckBackgroundColor = Color.FromArgb(229, 233, 240),
            SeparatorLightColor = Color.FromArgb(236, 239, 244),
            SeparatorDarkColor = Color.FromArgb(207, 216, 233)
        };

        // https://draculatheme.com
        public static ShareXTheme DraculaTheme => new ShareXTheme()
        {
            Name = "Dracula",
            BackgroundColor = Color.FromArgb(40, 42, 54),
            LightBackgroundColor = Color.FromArgb(68, 71, 90),
            DarkBackgroundColor = Color.FromArgb(36, 38, 48),
            TextColor = Color.FromArgb(248, 248, 242),
            BorderColor = Color.FromArgb(33, 35, 43),
            CheckerColor = Color.FromArgb(40, 42, 54),
            CheckerColor2 = Color.FromArgb(36, 38, 48),
            LinkColor = Color.FromArgb(98, 114, 164),
            MenuHighlightColor = Color.FromArgb(36, 38, 48),
            MenuHighlightBorderColor = Color.FromArgb(255, 121, 198),
            MenuBorderColor = Color.FromArgb(33, 35, 43),
            MenuCheckBackgroundColor = Color.FromArgb(45, 47, 61),
            SeparatorLightColor = Color.FromArgb(45, 47, 61),
            SeparatorDarkColor = Color.FromArgb(33, 35, 43)
        };

        public static List<ShareXTheme> GetDefaultThemes()
        {
            return new List<ShareXTheme>() { DarkTheme, LightTheme, NightTheme, NordDarkTheme, NordLightTheme, DraculaTheme };
        }

        public override string ToString()
        {
            return Name;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: SingleInstanceManager.cs]---
Location: ShareX-develop/ShareX.HelpersLib/SingleInstanceManager.cs

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
using System.IO.Pipes;
using System.Security.AccessControl;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ShareX.HelpersLib
{
    public class SingleInstanceManager : IDisposable
    {
        public event Action<string[]> ArgumentsReceived;

        public string MutexName { get; private set; }
        public string PipeName { get; private set; }
        public bool IsSingleInstance { get; private set; }
        public bool IsFirstInstance { get; private set; }

        private const int MaxArgumentsLength = 100;
        private const int ConnectTimeout = 5000;

        private readonly MutexManager mutex;
        private CancellationTokenSource cts;

        public SingleInstanceManager(string mutexName, string pipeName, string[] args) : this(mutexName, pipeName, true, args)
        {
        }

        public SingleInstanceManager(string mutexName, string pipeName, bool isSingleInstance, string[] args)
        {
            MutexName = mutexName;
            PipeName = pipeName;
            IsSingleInstance = isSingleInstance;

            mutex = new MutexManager(MutexName, 0);
            IsFirstInstance = mutex.HasHandle;

            if (IsSingleInstance)
            {
                if (IsFirstInstance)
                {
                    cts = new CancellationTokenSource();

                    Task.Run(ListenForConnectionsAsync, cts.Token);
                }
                else
                {
                    RedirectArgumentsToFirstInstance(args);
                }
            }
        }

        protected virtual void OnArgumentsReceived(string[] arguments)
        {
            if (ArgumentsReceived != null)
            {
                Task.Run(() => ArgumentsReceived?.Invoke(arguments));
            }
        }

        private async Task ListenForConnectionsAsync()
        {
            while (!cts.IsCancellationRequested)
            {
                bool namedPipeServerCreated = false;

                try
                {
                    PipeSecurity pipeSecurity = new PipeSecurity();

                    using (WindowsIdentity identity = WindowsIdentity.GetCurrent())
                    {
                        pipeSecurity.AddAccessRule(new PipeAccessRule(identity.User, PipeAccessRights.ReadWrite, AccessControlType.Allow));
                    }

                    using (NamedPipeServerStream namedPipeServer = NamedPipeServerStreamAcl.Create(PipeName, PipeDirection.InOut, 1, PipeTransmissionMode.Byte, PipeOptions.Asynchronous, 0, 0, pipeSecurity))
                    {
                        namedPipeServerCreated = true;

                        await namedPipeServer.WaitForConnectionAsync(cts.Token).ConfigureAwait(false);

                        using (BinaryReader reader = new BinaryReader(namedPipeServer, Encoding.UTF8))
                        {
                            int length = reader.ReadInt32();

                            if (length < 0 || length > MaxArgumentsLength)
                            {
                                throw new Exception("Invalid length: " + length);
                            }

                            string[] args = new string[length];

                            for (int i = 0; i < length; i++)
                            {
                                args[i] = reader.ReadString();
                            }

                            OnArgumentsReceived(args);
                        }
                    }
                }
                catch (OperationCanceledException)
                {
                }
                catch (Exception e)
                {
                    DebugHelper.WriteException(e);

                    if (!namedPipeServerCreated)
                    {
                        break;
                    }
                }
            }
        }

        private void RedirectArgumentsToFirstInstance(string[] args)
        {
            try
            {
                using (NamedPipeClientStream namedPipeClient = new NamedPipeClientStream(".", PipeName, PipeDirection.Out))
                {
                    namedPipeClient.Connect(ConnectTimeout);

                    using (BinaryWriter writer = new BinaryWriter(namedPipeClient, Encoding.UTF8))
                    {
                        writer.Write(args.Length);

                        foreach (string argument in args)
                        {
                            writer.Write(argument);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
            }
        }

        public void Dispose()
        {
            if (cts != null)
            {
                cts.Cancel();
                cts.Dispose();
            }

            mutex?.Dispose();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: StringLineReader.cs]---
Location: ShareX-develop/ShareX.HelpersLib/StringLineReader.cs

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
using System.Text;

namespace ShareX.HelpersLib
{
    public class StringLineReader
    {
        public string Text { get; private set; }
        public int Position { get; private set; }
        public int Length { get; private set; }

        public StringLineReader(string text)
        {
            Text = text;
            Length = Text.Length;
        }

        public string ReadLine()
        {
            StringBuilder builder = new StringBuilder();

            while (!string.IsNullOrEmpty(Text) && Position < Length)
            {
                char ch = Text[Position];
                builder.Append(ch);
                Position++;

                if (ch == '\r' || ch == '\n' || Position == Length)
                {
                    if (ch == '\r' && Position < Length && Text[Position] == '\n')
                    {
                        continue;
                    }

                    return builder.ToString();
                }
            }

            return null;
        }

        public string[] ReadAllLines(bool autoTrim = true)
        {
            List<string> lines = new List<string>();

            string line;

            while ((line = ReadLine()) != null)
            {
                if (autoTrim) line = line.Trim();
                lines.Add(line);
            }

            return lines.ToArray();
        }

        public void Reset()
        {
            Position = 0;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: TaskEx.cs]---
Location: ShareX-develop/ShareX.HelpersLib/TaskEx.cs

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
using System.Threading.Tasks;

namespace ShareX.HelpersLib
{
    public class TaskEx<T>
    {
        public delegate void ProgressChangedEventHandler(T progress);
        public event ProgressChangedEventHandler ProgressChanged;

        public bool IsRunning { get; private set; }
        public bool IsCanceled { get; private set; }

        private Progress<T> p;
        private CancellationTokenSource cts;

        public async Task Run(Action action)
        {
            if (IsRunning)
            {
                throw new InvalidOperationException();
            }

            IsRunning = true;
            IsCanceled = false;

            p = new Progress<T>(OnProgressChanged);

            using (cts = new CancellationTokenSource())
            {
                try
                {
                    await Task.Run(action, cts.Token);
                }
                catch (OperationCanceledException)
                {
                    IsCanceled = true;
                }
                finally
                {
                    IsRunning = false;
                }
            }
        }

        public void Report(T progress)
        {
            if (p != null)
            {
                ((IProgress<T>)p).Report(progress);
            }
        }

        public void Cancel()
        {
            cts?.Cancel();
        }

        public void ThrowIfCancellationRequested()
        {
            cts?.Token.ThrowIfCancellationRequested();
        }

        private void OnProgressChanged(T progress)
        {
            ProgressChanged?.Invoke(progress);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: TextBoxTraceListener.cs]---
Location: ShareX-develop/ShareX.HelpersLib/TextBoxTraceListener.cs

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
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public class TextBoxTraceListener : TraceListener
    {
        private TextBox textBox;

        public TextBoxTraceListener(TextBox textBox)
        {
            this.textBox = textBox;
        }

        public override void Write(string message)
        {
            textBox.InvokeSafe(() =>
            {
                string text = string.Format("{0} - {1}", DateTime.Now.ToLongTimeString(), message);
                textBox.AppendText(text);
            });
        }

        public override void WriteLine(string message)
        {
            Write(message + "\r\n");
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ThreadWorker.cs]---
Location: ShareX-develop/ShareX.HelpersLib/ThreadWorker.cs

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
    public class ThreadWorker
    {
        public event Action DoWork;
        public event Action Completed;

        private SynchronizationContext context;
        private Thread thread;

        public ThreadWorker()
        {
            context = SynchronizationContext.Current ?? new SynchronizationContext();
        }

        public void Start(ApartmentState state = ApartmentState.MTA)
        {
            if (thread == null)
            {
                thread = new Thread(WorkThread);
                thread.IsBackground = true;
                thread.SetApartmentState(state);
                thread.Start();
            }
        }

        private void WorkThread()
        {
            OnDoWork();
            OnCompleted();
        }

        private void OnDoWork()
        {
            DoWork?.Invoke();
        }

        private void OnCompleted()
        {
            if (Completed != null)
            {
                InvokeAsync(Completed);
            }
        }

        public void Invoke(Action action)
        {
            context.Send(state => action(), null);
        }

        public void InvokeAsync(Action action)
        {
            context.Post(state => action(), null);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: TimerResolutionManager.cs]---
Location: ShareX-develop/ShareX.HelpersLib/TimerResolutionManager.cs

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
    public class TimerResolutionManager : IDisposable
    {
        private static readonly object thisLock = new object();

        private static bool enabled;
        private static uint lastPeriod;

        public TimerResolutionManager(uint period = 1)
        {
            Enable(period);
        }

        public void Dispose()
        {
            Disable();
        }

        public static bool Enable(uint period = 1)
        {
            lock (thisLock)
            {
                if (!enabled)
                {
                    TimeCaps timeCaps = new TimeCaps();
                    uint result = NativeMethods.TimeGetDevCaps(ref timeCaps, (uint)Marshal.SizeOf(typeof(TimeCaps)));

                    if (result == 0)
                    {
                        period = Math.Max(period, timeCaps.wPeriodMin);
                        result = NativeMethods.TimeBeginPeriod(period);

                        if (result == 0)
                        {
                            lastPeriod = period;
                            enabled = true;
                        }
                    }
                }

                return enabled;
            }
        }

        public static bool Disable()
        {
            lock (thisLock)
            {
                if (enabled)
                {
                    uint result = NativeMethods.TimeEndPeriod(lastPeriod);

                    if (result == 0)
                    {
                        enabled = false;
                    }
                }

                return !enabled;
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: UnsafeBitmap.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UnsafeBitmap.cs

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

namespace ShareX.HelpersLib
{
    public unsafe class UnsafeBitmap : IDisposable
    {
        public ColorBgra* Pointer { get; private set; }
        public bool IsLocked { get; private set; }
        public int Width { get; private set; }
        public int Height { get; private set; }

        public int PixelCount => Width * Height;

        private Bitmap bitmap;
        private BitmapData bitmapData;

        public UnsafeBitmap(Bitmap bitmap, bool lockBitmap = false, ImageLockMode imageLockMode = ImageLockMode.ReadWrite)
        {
            this.bitmap = bitmap;
            Width = bitmap.Width;
            Height = bitmap.Height;

            if (lockBitmap)
            {
                Lock(imageLockMode);
            }
        }

        public void Lock(ImageLockMode imageLockMode = ImageLockMode.ReadWrite)
        {
            if (!IsLocked)
            {
                IsLocked = true;
                bitmapData = bitmap.LockBits(new Rectangle(0, 0, Width, Height), imageLockMode, PixelFormat.Format32bppArgb);
                Pointer = (ColorBgra*)bitmapData.Scan0.ToPointer();
            }
        }

        public void Unlock()
        {
            if (IsLocked)
            {
                bitmap.UnlockBits(bitmapData);
                bitmapData = null;
                Pointer = null;
                IsLocked = false;
            }
        }

        public static bool operator ==(UnsafeBitmap bmp1, UnsafeBitmap bmp2)
        {
            return ReferenceEquals(bmp1, bmp2) || bmp1.Equals(bmp2);
        }

        public static bool operator !=(UnsafeBitmap bmp1, UnsafeBitmap bmp2)
        {
            return !(bmp1 == bmp2);
        }

        public override bool Equals(object obj)
        {
            return obj is UnsafeBitmap unsafeBitmap && Compare(unsafeBitmap, this);
        }

        public override int GetHashCode()
        {
            return PixelCount;
        }

        public static bool Compare(UnsafeBitmap bmp1, UnsafeBitmap bmp2)
        {
            int pixelCount = bmp1.PixelCount;

            if (pixelCount != bmp2.PixelCount)
            {
                return false;
            }

            bmp1.Lock(ImageLockMode.ReadOnly);
            bmp2.Lock(ImageLockMode.ReadOnly);

            ColorBgra* pointer1 = bmp1.Pointer;
            ColorBgra* pointer2 = bmp2.Pointer;

            for (int i = 0; i < pixelCount; i++)
            {
                if (pointer1->Bgra != pointer2->Bgra)
                {
                    return false;
                }

                pointer1++;
                pointer2++;
            }

            return true;
        }

        public bool IsTransparent()
        {
            int pixelCount = PixelCount;

            ColorBgra* pointer = Pointer;

            for (int i = 0; i < pixelCount; i++)
            {
                if (pointer->Alpha < 255)
                {
                    return true;
                }

                pointer++;
            }

            return false;
        }

        public ColorBgra GetPixel(int i)
        {
            return Pointer[i];
        }

        public ColorBgra GetPixel(int x, int y)
        {
            return Pointer[x + (y * Width)];
        }

        public void SetPixel(int i, ColorBgra color)
        {
            Pointer[i] = color;
        }

        public void SetPixel(int i, uint color)
        {
            Pointer[i] = color;
        }

        public void SetPixel(int x, int y, ColorBgra color)
        {
            Pointer[x + (y * Width)] = color;
        }

        public void SetPixel(int x, int y, uint color)
        {
            Pointer[x + (y * Width)] = color;
        }

        public void ClearPixel(int i)
        {
            Pointer[i] = 0;
        }

        public void ClearPixel(int x, int y)
        {
            Pointer[x + (y * Width)] = 0;
        }

        public void Dispose()
        {
            Unlock();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Vector2.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Vector2.cs

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
    public struct Vector2
    {
        private float x, y;

        public float X
        {
            get
            {
                return x;
            }
            set
            {
                x = value;
            }
        }

        public float Y
        {
            get
            {
                return y;
            }
            set
            {
                y = value;
            }
        }

        public static readonly Vector2 Empty = new Vector2();

        public Vector2(float x, float y)
        {
            this.x = x;
            this.y = y;
        }

        public override bool Equals(object obj)
        {
            if (obj is Vector2 v)
            {
                return v.x == x && v.y == y;
            }

            return false;
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        public override string ToString()
        {
            return $"X={x}, Y={y}";
        }

        public static bool operator ==(Vector2 u, Vector2 v)
        {
            return u.x == v.x && u.y == v.y;
        }

        public static bool operator !=(Vector2 u, Vector2 v)
        {
            return !(u == v);
        }

        public static Vector2 operator +(Vector2 u, Vector2 v)
        {
            return new Vector2(u.x + v.x, u.y + v.y);
        }

        public static Vector2 operator -(Vector2 u, Vector2 v)
        {
            return new Vector2(u.x - v.x, u.y - v.y);
        }

        public static Vector2 operator *(Vector2 u, float a)
        {
            return new Vector2(a * u.x, a * u.y);
        }

        public static Vector2 operator /(Vector2 u, float a)
        {
            return new Vector2(u.x / a, u.y / a);
        }

        public static Vector2 operator -(Vector2 u)
        {
            return new Vector2(-u.x, -u.y);
        }

        public static explicit operator Point(Vector2 u)
        {
            return new Point((int)Math.Round(u.x), (int)Math.Round(u.y));
        }

        public static explicit operator PointF(Vector2 u)
        {
            return new PointF(u.x, u.y);
        }

        public static implicit operator Vector2(Point p)
        {
            return new Vector2(p.X, p.Y);
        }
    }
}
```

--------------------------------------------------------------------------------

````
