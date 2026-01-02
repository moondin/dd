---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 537
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 537 of 650)

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

---[FILE: CropTool.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Tool/CropTool.cs

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
using System.Windows.Forms;

namespace ShareX.ScreenCaptureLib
{
    public class CropTool : BaseTool
    {
        public override ShapeType ShapeType { get; } = ShapeType.ToolCrop;

        public override bool LimitRectangleToInsideCanvas { get; } = true;

        private ImageEditorButton confirmButton, cancelButton;
        private Size buttonSize = new Size(50, 40);
        private int buttonOffset = 15;

        public override void OnUpdate()
        {
            base.OnUpdate();

            if (confirmButton != null && cancelButton != null)
            {
                if (Rectangle.Bottom + buttonOffset + buttonSize.Height > Manager.Form.ClientArea.Bottom &&
                    Rectangle.Width > (buttonSize.Width * 2) + (buttonOffset * 3) &&
                    Rectangle.Height > buttonSize.Height + (buttonOffset * 2))
                {
                    confirmButton.Rectangle = new RectangleF(Rectangle.Right - (buttonOffset * 2) - (buttonSize.Width * 2),
                        Rectangle.Bottom - buttonOffset - buttonSize.Height, buttonSize.Width, buttonSize.Height);
                    cancelButton.Rectangle = new RectangleF(Rectangle.Right - buttonOffset - buttonSize.Width,
                        Rectangle.Bottom - buttonOffset - buttonSize.Height, buttonSize.Width, buttonSize.Height);
                }
                else
                {
                    confirmButton.Rectangle = new RectangleF(Rectangle.Right - (buttonSize.Width * 2) - buttonOffset,
                        Rectangle.Bottom + buttonOffset, buttonSize.Width, buttonSize.Height);
                    cancelButton.Rectangle = new RectangleF(Rectangle.Right - buttonSize.Width,
                        Rectangle.Bottom + buttonOffset, buttonSize.Width, buttonSize.Height);
                }
            }
        }

        public override void OnDraw(Graphics g)
        {
            if (IsValidShape)
            {
                Manager.DrawRegionArea(g, Rectangle, true, Manager.Options.ShowInfo);
                g.DrawCross(Pens.Black, Rectangle.Center().Add(-1, -1), 10);
                g.DrawCross(Pens.White, Rectangle.Center(), 10);
            }
        }

        public override void OnCreated()
        {
            confirmButton = new ImageEditorButton()
            {
                Text = "\u2714",
                ButtonColor = ShareXResources.Theme.LightBackgroundColor,
                IconColor = Color.ForestGreen,
                Rectangle = new Rectangle(new Point(), buttonSize),
                Visible = true
            };
            confirmButton.MouseDown += ConfirmButton_MousePressed;
            confirmButton.MouseEnter += () => Manager.Form.Cursor = Cursors.Hand;
            confirmButton.MouseLeave += () => Manager.Form.SetDefaultCursor();
            Manager.DrawableObjects.Add(confirmButton);

            cancelButton = new ImageEditorButton()
            {
                Text = "\u2716",
                ButtonColor = ShareXResources.Theme.LightBackgroundColor,
                IconColor = Color.FromArgb(227, 45, 45),
                Rectangle = new Rectangle(new Point(), buttonSize),
                Visible = true
            };
            cancelButton.MouseDown += CancelButton_MousePressed;
            cancelButton.MouseEnter += () => Manager.Form.Cursor = Cursors.Hand;
            cancelButton.MouseLeave += () => Manager.Form.SetDefaultCursor();
            Manager.DrawableObjects.Add(cancelButton);
        }

        private void ConfirmButton_MousePressed(object sender, MouseEventArgs e)
        {
            Manager.CropArea(Rectangle);
            Remove();
        }

        private void CancelButton_MousePressed(object sender, MouseEventArgs e)
        {
            Remove();
        }

        public override void Remove()
        {
            base.Remove();

            if (Options.SwitchToSelectionToolAfterDrawing)
            {
                Manager.CurrentTool = ShapeType.ToolSelect;
            }
        }

        public override void Dispose()
        {
            base.Dispose();

            if ((confirmButton != null && confirmButton.IsCursorHover) || (cancelButton != null && cancelButton.IsCursorHover))
            {
                Manager.Form.SetDefaultCursor();
            }

            if (confirmButton != null)
            {
                Manager.DrawableObjects.Remove(confirmButton);
            }

            if (cancelButton != null)
            {
                Manager.DrawableObjects.Remove(cancelButton);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CutOutTool.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Tool/CutOutTool.cs

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
    public class CutOutTool : BaseTool
    {
        public override ShapeType ShapeType { get; } = ShapeType.ToolCutOut;

        public override bool LimitRectangleToInsideCanvas { get; } = true;

        public bool IsHorizontalTrim => Rectangle.Width >= Options.MinimumSize && Rectangle.Width > Rectangle.Height;
        public bool IsVerticalTrim => Rectangle.Height >= Options.MinimumSize && Rectangle.Height >= Rectangle.Width;

        public override bool IsValidShape
        {
            get
            {
                if (!IsHorizontalTrim && !IsVerticalTrim) return false;
                if (IsHorizontalTrim && Rectangle.Left <= Manager.Form.CanvasRectangle.Left && Rectangle.Right >= Manager.Form.CanvasRectangle.Right) return false;
                if (IsVerticalTrim && Rectangle.Top <= Manager.Form.CanvasRectangle.Top && Rectangle.Bottom >= Manager.Form.CanvasRectangle.Bottom) return false;
                return true;
            }
        }

        public RectangleF CutOutRectangle
        {
            get
            {
                if (IsHorizontalTrim)
                {
                    return new RectangleF(Rectangle.X, Manager.Form.CanvasRectangle.Y, Rectangle.Width, Manager.Form.CanvasRectangle.Height);
                }

                if (IsVerticalTrim)
                {
                    return new RectangleF(Manager.Form.CanvasRectangle.X, Rectangle.Y, Manager.Form.CanvasRectangle.Width, Rectangle.Height);
                }

                return RectangleF.Empty;
            }
        }

        private ImageEditorButton confirmButton, cancelButton;
        private Size buttonSize = new Size(50, 40);
        private int buttonOffset = 15;

        public override void ShowNodes()
        {
        }

        public override void OnUpdate()
        {
            base.OnUpdate();

            if (confirmButton != null && cancelButton != null)
            {
                if (IsVerticalTrim)
                {
                    float spaceBelow = Manager.Form.ClientArea.Bottom - Rectangle.Bottom;
                    bool positionBelow = spaceBelow >= buttonSize.Height + 2 * buttonOffset;
                    float buttonsTop = positionBelow ? Rectangle.Bottom + buttonOffset : Rectangle.Top - buttonOffset - buttonSize.Height;
                    float buttonsLeft = Rectangle.Left + Rectangle.Width / 2 - (2 * buttonSize.Width + buttonOffset) / 2;
                    float buttonsRight = buttonsLeft + 2 * buttonSize.Width + buttonOffset;
                    bool overflowsLeft = buttonsLeft < Manager.Form.ClientArea.Left + buttonOffset;
                    bool overflowsRight = buttonsRight >= Manager.Form.ClientArea.Right - buttonOffset;
                    if (overflowsLeft && overflowsRight)
                    {
                        // can't fix
                    }
                    else if (overflowsLeft)
                    {
                        buttonsLeft = Manager.Form.ClientArea.Left + buttonOffset;
                    }
                    else if (overflowsRight)
                    {
                        buttonsRight = Manager.Form.ClientArea.Right - buttonOffset;
                        buttonsLeft = buttonsRight - 2 * buttonSize.Width - buttonOffset;
                    }
                    confirmButton.Rectangle = new RectangleF(buttonsLeft, buttonsTop, buttonSize.Width, buttonSize.Height);
                    cancelButton.Rectangle = confirmButton.Rectangle.LocationOffset(buttonSize.Width + buttonOffset, 0);
                }
                else
                {
                    float spaceRight = Manager.Form.ClientArea.Right - Rectangle.Right;
                    bool positionRight = spaceRight >= buttonSize.Width + 2 * buttonOffset;
                    float buttonsLeft = positionRight ? Rectangle.Right + buttonOffset : Rectangle.Left - buttonOffset - buttonSize.Width;
                    float buttonsTop = Rectangle.Top + Rectangle.Height / 2 - (2 * buttonSize.Height + buttonOffset) / 2;
                    float buttonsBottom = buttonsTop + 2 * buttonSize.Height + buttonOffset;
                    bool overflowsTop = buttonsTop < Manager.Form.ClientArea.Top + buttonOffset;
                    bool overflowsBottom = buttonsBottom >= Manager.Form.ClientArea.Bottom - buttonOffset;
                    if (overflowsTop && overflowsBottom)
                    {
                        // can't fix
                    }
                    else if (overflowsTop)
                    {
                        buttonsTop = Manager.Form.ClientArea.Top + buttonOffset;
                    }
                    else if (overflowsBottom)
                    {
                        buttonsBottom = Manager.Form.ClientArea.Bottom - buttonOffset;
                        buttonsTop = buttonsBottom - 2 * buttonSize.Height - buttonOffset;
                    }
                    confirmButton.Rectangle = new RectangleF(buttonsLeft, buttonsTop, buttonSize.Width, buttonSize.Height);
                    cancelButton.Rectangle = confirmButton.Rectangle.LocationOffset(0, buttonSize.Height + buttonOffset);
                }
            }
        }

        public override void OnDraw(Graphics g)
        {
            using (Image selectionHighlightPattern = ImageHelpers.CreateCheckerPattern(1, 1, Color.FromArgb(128, Color.LightGray), Color.FromArgb(128, Color.Gray)))
            using (Brush selectionHighlightBrush = new TextureBrush(selectionHighlightPattern, WrapMode.Tile))
            {
                g.FillRectangle(selectionHighlightBrush, CutOutRectangle);
            }
        }

        public override void OnCreated()
        {
            confirmButton = new ImageEditorButton()
            {
                Text = "\u2714",
                ButtonColor = ShareXResources.Theme.LightBackgroundColor,
                IconColor = Color.ForestGreen,
                Rectangle = new Rectangle(new Point(), buttonSize),
                Visible = true
            };
            confirmButton.MouseDown += ConfirmButton_MousePressed;
            confirmButton.MouseEnter += () => Manager.Form.Cursor = Cursors.Hand;
            confirmButton.MouseLeave += () => Manager.Form.SetDefaultCursor();
            Manager.DrawableObjects.Add(confirmButton);

            cancelButton = new ImageEditorButton()
            {
                Text = "\u2716",
                ButtonColor = ShareXResources.Theme.LightBackgroundColor,
                IconColor = Color.FromArgb(227, 45, 45),
                Rectangle = new Rectangle(new Point(), buttonSize),
                Visible = true
            };
            cancelButton.MouseDown += CancelButton_MousePressed;
            cancelButton.MouseEnter += () => Manager.Form.Cursor = Cursors.Hand;
            cancelButton.MouseLeave += () => Manager.Form.SetDefaultCursor();
            Manager.DrawableObjects.Add(cancelButton);
        }

        private void ConfirmButton_MousePressed(object sender, MouseEventArgs e)
        {
            Manager.CutOut(Rectangle);
            Remove();
        }

        private void CancelButton_MousePressed(object sender, MouseEventArgs e)
        {
            Remove();
        }

        public override void Remove()
        {
            base.Remove();

            if (Options.SwitchToSelectionToolAfterDrawing)
            {
                Manager.CurrentTool = ShapeType.ToolSelect;
            }
        }

        public override void Dispose()
        {
            base.Dispose();

            if ((confirmButton != null && confirmButton.IsCursorHover) || (cancelButton != null && cancelButton.IsCursorHover))
            {
                Manager.Form.SetDefaultCursor();
            }

            if (confirmButton != null)
            {
                Manager.DrawableObjects.Remove(confirmButton);
            }

            if (cancelButton != null)
            {
                Manager.DrawableObjects.Remove(cancelButton);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: SpotlightTool.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Tool/SpotlightTool.cs

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
using System.Windows.Forms;

namespace ShareX.ScreenCaptureLib
{
    public class SpotlightTool : BaseTool
    {
        public override ShapeType ShapeType { get; } = ShapeType.ToolSpotlight;

        public override bool LimitRectangleToInsideCanvas { get; } = true;
        public int Dim { get; set; }
        public int Blur { get; set; }
        public bool Ellipse { get; set; }

        public override void OnConfigLoad()
        {
            base.OnConfigLoad();
            Dim = AnnotationOptions.SpotlightDim;
            Blur = AnnotationOptions.SpotlightBlur;
            Ellipse = AnnotationOptions.SpotlightEllipse;
        }

        public override void OnConfigSave()
        {
            base.OnConfigSave();
            AnnotationOptions.SpotlightDim = Dim;
            AnnotationOptions.SpotlightBlur = Blur;
            AnnotationOptions.SpotlightEllipse = Ellipse;
        }

        public override void OnDraw(Graphics g)
        {
            if (IsValidShape)
            {
                Manager.DrawRegionArea(g, Rectangle, true, Manager.Options.ShowInfo, Ellipse);
                g.DrawCross(Pens.Black, Rectangle.Center().Add(-1, -1), 10);
                g.DrawCross(Pens.White, Rectangle.Center(), 10);
            }
        }

        public override void OnCreated()
        {
            base.OnCreated();

            if (IsValidShape)
            {
                Manager.Form.Cursor = Cursors.WaitCursor;

                Manager.SpotlightArea(Rectangle, Dim, Blur, Ellipse);

                Manager.Form.SetDefaultCursor();
            }

            Remove();
        }

        public override void Remove()
        {
            base.Remove();

            if (Options.SwitchToSelectionToolAfterDrawing)
            {
                Manager.CurrentTool = ShapeType.ToolSelect;
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: app.config]---
Location: ShareX-develop/ShareX.Setup/app.config

```text
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <startup>
    <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.8"/>
  </startup>
</configuration>
```

--------------------------------------------------------------------------------

---[FILE: Program.cs]---
Location: ShareX-develop/ShareX.Setup/Program.cs

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

using Microsoft.Win32;
using ShareX.HelpersLib;
using System;
using System.Diagnostics;
using System.IO;
using System.Text.RegularExpressions;

namespace ShareX.Setup
{
    internal class Program
    {
        [Flags]
        private enum SetupJobs
        {
            None = 0,
            CreateSetup = 1,
            CreatePortable = 1 << 1,
            CreateDebug = 1 << 2,
            CreateSteamFolder = 1 << 3,
            CreateMicrosoftStoreFolder = 1 << 4,
            CreateMicrosoftStoreDebugFolder = 1 << 5,
            CompileAppx = 1 << 6,
            DownloadTools = 1 << 7,
            CreateChecksumFile = 1 << 8,
            OpenOutputDirectory = 1 << 9,

            Release = CreateSetup | CreatePortable | DownloadTools | OpenOutputDirectory,
            Debug = CreateDebug | DownloadTools | OpenOutputDirectory,
            Steam = CreateSteamFolder | DownloadTools | OpenOutputDirectory,
            MicrosoftStore = CreateMicrosoftStoreFolder | CompileAppx | DownloadTools | OpenOutputDirectory,
            MicrosoftStoreDebug = CreateMicrosoftStoreDebugFolder | CompileAppx | DownloadTools | OpenOutputDirectory
        }

        private static SetupJobs Job { get; set; } = SetupJobs.Release;
        private static bool Silent { get; set; } = false;

        private static string ParentDir;
        private static string Configuration;
        private static string AppVersion;
        private static string WindowsKitsDir;

        private static string SolutionPath => Path.Combine(ParentDir, "ShareX.sln");
        private static string BinDir => Path.Combine(ParentDir, "ShareX", "bin", Configuration, "win-x64");
        private static string SteamLauncherDir => Path.Combine(ParentDir, "ShareX.Steam", "bin", Configuration);
        private static string ExecutablePath => Path.Combine(BinDir, "ShareX.exe");

        private static string OutputDir => Path.Combine(ParentDir, "Output");
        private static string PortableOutputDir => Path.Combine(OutputDir, "ShareX-portable");
        private static string DebugOutputDir => Path.Combine(OutputDir, "ShareX-debug");
        private static string SteamOutputDir => Path.Combine(OutputDir, "ShareX-Steam");
        private static string MicrosoftStoreOutputDir => Path.Combine(OutputDir, "ShareX-MicrosoftStore");
        private static string MicrosoftStoreDebugOutputDir => Path.Combine(OutputDir, "ShareX-MicrosoftStore-debug");

        private static string SetupDir => Path.Combine(ParentDir, "ShareX.Setup");
        private static string InnoSetupDir => Path.Combine(SetupDir, "InnoSetup");
        private static string MicrosoftStorePackageFilesDir => Path.Combine(SetupDir, "MicrosoftStore");

        private static string SetupPath => Path.Combine(OutputDir, $"ShareX-{AppVersion}-setup.exe");
        private static string PortableZipPath => Path.Combine(OutputDir, $"ShareX-{AppVersion}-portable.zip");
        private static string DebugZipPath => Path.Combine(OutputDir, $"ShareX-{AppVersion}-debug.zip");
        private static string SteamUpdatesDir => Path.Combine(SteamOutputDir, "Updates");
        private static string SteamZipPath => Path.Combine(OutputDir, $"ShareX-{AppVersion}-Steam.zip");
        private static string MicrosoftStoreAppxPath => Path.Combine(OutputDir, $"ShareX-{AppVersion}.appx");
        private static string MicrosoftStoreDebugAppxPath => Path.Combine(OutputDir, $"ShareX-{AppVersion}-debug.appx");
        private static string FFmpegPath => Path.Combine(OutputDir, "ffmpeg.exe");
        private static string RecorderDevicesSetupPath => Path.Combine(OutputDir, $"recorder-devices-{RecorderDevicesVersion}-setup.exe");
        private static string ExifToolPath => Path.Combine(OutputDir, "exiftool.exe");
        private static string MakeAppxPath => Path.Combine(WindowsKitsDir, "x64", "makeappx.exe");

        private const string InnoSetupCompilerPath = @"C:\Program Files (x86)\Inno Setup 6\ISCC.exe";
        private const string FFmpegVersion = "8.0";
        private static string FFmpegDownloadURL = $"https://github.com/ShareX/FFmpeg/releases/download/v{FFmpegVersion}/ffmpeg-{FFmpegVersion}-win-x64.zip";
        private const string RecorderDevicesVersion = "0.12.10";
        private static string RecorderDevicesDownloadURL = $"https://github.com/ShareX/RecorderDevices/releases/download/v{RecorderDevicesVersion}/recorder-devices-{RecorderDevicesVersion}-setup.exe";
        private const string ExifToolVersion = "13.29";
        private static string ExifToolDownloadURL = $"https://github.com/ShareX/ExifTool/releases/download/v{ExifToolVersion}/exiftool-{ExifToolVersion}-win64.zip";

        private static void Main(string[] args)
        {
            Console.WriteLine("ShareX setup started.");

            CheckArgs(args);

            Console.WriteLine("Job: " + Job);

            UpdatePaths();

            if (Directory.Exists(OutputDir))
            {
                Console.WriteLine("Cleaning output directory: " + OutputDir);

                Directory.Delete(OutputDir, true);
            }

            if (Job.HasFlag(SetupJobs.DownloadTools))
            {
                DownloadFFmpeg();
                DownloadRecorderDevices();
                DownloadExifTool();
            }

            if (Job.HasFlag(SetupJobs.CreateSetup))
            {
                CompileSetup();
            }

            if (Job.HasFlag(SetupJobs.CreatePortable))
            {
                CreateFolder(BinDir, PortableOutputDir, SetupJobs.CreatePortable);

                CreateZipFile(PortableOutputDir, PortableZipPath);
            }

            if (Job.HasFlag(SetupJobs.CreateDebug))
            {
                CreateFolder(BinDir, DebugOutputDir, SetupJobs.CreateDebug);

                CreateZipFile(DebugOutputDir, DebugZipPath);
            }

            if (Job.HasFlag(SetupJobs.CreateSteamFolder))
            {
                CreateSteamFolder();

                CreateZipFile(SteamOutputDir, SteamZipPath);
            }

            if (Job.HasFlag(SetupJobs.CreateMicrosoftStoreFolder))
            {
                CreateFolder(BinDir, MicrosoftStoreOutputDir, SetupJobs.CreateMicrosoftStoreFolder);

                if (Job.HasFlag(SetupJobs.CompileAppx))
                {
                    CompileAppx(MicrosoftStoreOutputDir, MicrosoftStoreAppxPath);
                }
            }

            if (Job.HasFlag(SetupJobs.CreateMicrosoftStoreDebugFolder))
            {
                CreateFolder(BinDir, MicrosoftStoreDebugOutputDir, SetupJobs.CreateMicrosoftStoreDebugFolder);

                if (Job.HasFlag(SetupJobs.CompileAppx))
                {
                    CompileAppx(MicrosoftStoreDebugOutputDir, MicrosoftStoreDebugAppxPath);
                }
            }

            if (!Silent && Job.HasFlag(SetupJobs.OpenOutputDirectory))
            {
                FileHelpers.OpenFolder(OutputDir, false);
            }

            Console.WriteLine("ShareX setup successfully completed.");
        }

        private static void CheckArgs(string[] args)
        {
            CLIManager cli = new CLIManager(args);
            cli.ParseCommands();

            Silent = cli.IsCommandExist("Silent");

            if (Silent)
            {
                Console.WriteLine("Silent: " + Silent);
            }

            CLICommand command = cli.GetCommand("Job");

            if (command != null)
            {
                string parameter = command.Parameter;

                if (Enum.TryParse(parameter, out SetupJobs job))
                {
                    Job = job;
                }
                else
                {
                    Console.WriteLine("Invalid job: " + parameter);

                    Environment.Exit(0);
                }
            }
        }

        private static void UpdatePaths()
        {
            ParentDir = Directory.GetCurrentDirectory();

            if (!File.Exists(SolutionPath))
            {
                Console.WriteLine("Invalid parent directory: " + ParentDir);

                ParentDir = FileHelpers.GetAbsolutePath(@"..\..\..\..\");

                if (!File.Exists(SolutionPath))
                {
                    Console.WriteLine("Invalid parent directory: " + ParentDir);

                    Environment.Exit(0);
                }
            }

            Console.WriteLine("Parent directory: " + ParentDir);

            if (Job.HasFlag(SetupJobs.CreateDebug))
            {
                Configuration = "Debug";
            }
            else if (Job.HasFlag(SetupJobs.CreateSteamFolder))
            {
                Configuration = "Steam";
            }
            else if (Job.HasFlag(SetupJobs.CreateMicrosoftStoreFolder))
            {
                Configuration = "MicrosoftStore";
            }
            else if (Job.HasFlag(SetupJobs.CreateMicrosoftStoreDebugFolder))
            {
                Configuration = "MicrosoftStoreDebug";
            }
            else
            {
                Configuration = "Release";
            }

            Console.WriteLine("Configuration: " + Configuration);

            FileVersionInfo versionInfo = FileVersionInfo.GetVersionInfo(ExecutablePath);
            AppVersion = versionInfo.ProductVersion;

            Console.WriteLine("Application version: " + AppVersion);

            if (Job.HasFlag(SetupJobs.CompileAppx))
            {
                string sdkInstallationFolder = RegistryHelpers.GetValueString(@"SOFTWARE\WOW6432Node\Microsoft\Microsoft SDKs\Windows\v10.0",
                    "InstallationFolder", RegistryHive.LocalMachine);
                string sdkProductVersion = RegistryHelpers.GetValueString(@"SOFTWARE\WOW6432Node\Microsoft\Microsoft SDKs\Windows\v10.0",
                    "ProductVersion", RegistryHive.LocalMachine);
                WindowsKitsDir = Path.Combine(sdkInstallationFolder, "bin", Helpers.NormalizeVersion(sdkProductVersion).ToString());

                Console.WriteLine("Windows Kits directory: " + WindowsKitsDir);
            }
        }

        private static void CompileSetup()
        {
            CompileISSFile("ShareX-setup.iss");
            CreateChecksumFile(SetupPath);
        }

        private static void CompileISSFile(string fileName)
        {
            if (File.Exists(InnoSetupCompilerPath))
            {
                Console.WriteLine("Compiling setup file: " + fileName);

                using (Process process = new Process())
                {
                    ProcessStartInfo psi = new ProcessStartInfo()
                    {
                        FileName = InnoSetupCompilerPath,
                        WorkingDirectory = InnoSetupDir,
                        Arguments = $"/Q \"{fileName}\"",
                        UseShellExecute = false
                    };

                    process.StartInfo = psi;
                    process.Start();
                    process.WaitForExit();
                }

                Console.WriteLine("Setup file compiled: " + fileName);
            }
            else
            {
                Console.WriteLine("InnoSetup compiler is missing: " + InnoSetupCompilerPath);
            }
        }

        private static void CompileAppx(string contentDirectory, string outputPackageName)
        {
            Console.WriteLine("Compiling appx file: " + contentDirectory);

            using (Process process = new Process())
            {
                ProcessStartInfo psi = new ProcessStartInfo()
                {
                    FileName = MakeAppxPath,
                    Arguments = $"pack /d \"{contentDirectory}\" /p \"{outputPackageName}\" /l /o",
                    UseShellExecute = false
                };

                process.StartInfo = psi;
                process.Start();
                process.WaitForExit();
            }

            Console.WriteLine("Appx file compiled: " + outputPackageName);

            CreateChecksumFile(outputPackageName);
        }

        private static void CreateSteamFolder()
        {
            Console.WriteLine("Creating Steam folder: " + SteamOutputDir);

            if (Directory.Exists(SteamOutputDir))
            {
                Directory.Delete(SteamOutputDir, true);
            }

            Directory.CreateDirectory(SteamOutputDir);

            FileHelpers.CopyFiles(Path.Combine(SteamLauncherDir, "ShareX_Launcher.exe"), SteamOutputDir);
            FileHelpers.CopyFiles(Path.Combine(SteamLauncherDir, "steam_appid.txt"), SteamOutputDir);
            FileHelpers.CopyFiles(Path.Combine(SteamLauncherDir, "installscript.vdf"), SteamOutputDir);
            FileHelpers.CopyFiles(SteamLauncherDir, SteamOutputDir, "*.dll");

            CreateFolder(BinDir, SteamUpdatesDir, SetupJobs.CreateSteamFolder);
        }

        private static void CreateFolder(string source, string destination, SetupJobs job)
        {
            Console.WriteLine("Creating folder: " + destination);

            if (Directory.Exists(destination))
            {
                Directory.Delete(destination, true);
            }

            Directory.CreateDirectory(destination);

            FileHelpers.CopyFiles(source, destination, "*.exe");
            FileHelpers.CopyFiles(source, destination, "*.dll");
            FileHelpers.CopyFiles(source, destination, "*.json");

            if (job == SetupJobs.CreateDebug || job == SetupJobs.CreateMicrosoftStoreDebugFolder)
            {
                FileHelpers.CopyFiles(source, destination, "*.pdb");
            }

            FileHelpers.CopyFiles(Path.Combine(ParentDir, "Licenses"), Path.Combine(destination, "Licenses"), "*.txt");

            if (job != SetupJobs.CreateMicrosoftStoreFolder && job != SetupJobs.CreateMicrosoftStoreDebugFolder)
            {
                if (File.Exists(RecorderDevicesSetupPath))
                {
                    FileHelpers.CopyFiles(RecorderDevicesSetupPath, destination);
                }
            }

            FileHelpers.CopyFiles(Path.Combine(source, "ShareX_File_Icon.ico"), destination);

            foreach (string directory in Directory.GetDirectories(source))
            {
                string language = Path.GetFileName(directory);

                if (Regex.IsMatch(language, "^[a-z]{2}(?:-[A-Z]{2})?$"))
                {
                    FileHelpers.CopyFiles(Path.Combine(source, language), Path.Combine(destination, "Languages", language), "*.resources.dll");
                }
            }

            if (File.Exists(FFmpegPath))
            {
                FileHelpers.CopyFiles(FFmpegPath, destination);
            }

            if (File.Exists(ExifToolPath))
            {
                FileHelpers.CopyFiles(ExifToolPath, destination);
                FileHelpers.CopyAll(Path.Combine(OutputDir, "exiftool_files"), Path.Combine(destination, "exiftool_files"));
            }

            FileHelpers.CopyAll(Path.Combine(ParentDir, @"ShareX.ScreenCaptureLib\Stickers"), Path.Combine(destination, "Stickers"));

            if (job == SetupJobs.CreatePortable)
            {
                FileHelpers.CreateEmptyFile(Path.Combine(destination, "Portable"));
            }
            else if (job == SetupJobs.CreateMicrosoftStoreFolder || job == SetupJobs.CreateMicrosoftStoreDebugFolder)
            {
                FileHelpers.CopyAll(MicrosoftStorePackageFilesDir, destination);
            }

            Console.WriteLine("Folder created: " + destination);
        }

        private static void CreateZipFile(string source, string archivePath)
        {
            Console.WriteLine("Creating zip file: " + archivePath);

            ZipManager.Compress(source, archivePath);
            CreateChecksumFile(archivePath);
        }

        private static void DownloadFFmpeg()
        {
            if (!File.Exists(FFmpegPath))
            {
                string fileName = Path.GetFileName(FFmpegDownloadURL);
                string filePath = Path.Combine(OutputDir, fileName);

                Console.WriteLine("Downloading: " + FFmpegDownloadURL);
                WebHelpers.DownloadFileAsync(FFmpegDownloadURL, filePath).GetAwaiter().GetResult();

                Console.WriteLine("Extracting: " + filePath);
                ZipManager.Extract(filePath, OutputDir, false, entry => entry.Name.Equals("ffmpeg.exe", StringComparison.OrdinalIgnoreCase));
            }
        }

        private static void DownloadRecorderDevices()
        {
            if (!File.Exists(RecorderDevicesSetupPath))
            {
                string fileName = Path.GetFileName(RecorderDevicesDownloadURL);
                string filePath = Path.Combine(OutputDir, fileName);

                Console.WriteLine("Downloading: " + RecorderDevicesDownloadURL);
                WebHelpers.DownloadFileAsync(RecorderDevicesDownloadURL, filePath).GetAwaiter().GetResult();
            }
        }

        private static void DownloadExifTool()
        {
            if (!File.Exists(ExifToolPath))
            {
                string fileName = Path.GetFileName(ExifToolDownloadURL);
                string filePath = Path.Combine(OutputDir, fileName);

                Console.WriteLine("Downloading: " + ExifToolDownloadURL);
                WebHelpers.DownloadFileAsync(ExifToolDownloadURL, filePath).GetAwaiter().GetResult();

                Console.WriteLine("Extracting: " + filePath);
                ZipManager.Extract(filePath, OutputDir);
            }
        }

        private static void CreateChecksumFile(string filePath)
        {
            if (Job.HasFlag(SetupJobs.CreateChecksumFile))
            {
                Console.WriteLine("Creating checksum file: " + filePath);

                Helpers.CreateChecksumFile(filePath);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ShareX.Setup.csproj]---
Location: ShareX-develop/ShareX.Setup/ShareX.Setup.csproj

```text
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net9.0-windows</TargetFramework>
    <OutputType>Exe</OutputType>
    <PlatformTarget>x64</PlatformTarget>
    <RuntimeIdentifier>win-x64</RuntimeIdentifier>
  </PropertyGroup>
  <ItemGroup>
    <ProjectReference Include="..\ShareX.HelpersLib\ShareX.HelpersLib.csproj" />
  </ItemGroup>
</Project>
```

--------------------------------------------------------------------------------

````
