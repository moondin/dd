---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:46Z
part: 12
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 12 of 650)

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

---[FILE: SettingManager.cs]---
Location: ShareX-develop/ShareX/SettingManager.cs

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
using ShareX.HistoryLib;
using ShareX.Properties;
using ShareX.ScreenCaptureLib;
using ShareX.UploadersLib;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ShareX
{
    internal static class SettingManager
    {
        private const string ApplicationConfigFileName = "ApplicationConfig.json";

        private static string ApplicationConfigFilePath
        {
            get
            {
                if (Program.Sandbox) return null;

                return Path.Combine(Program.PersonalFolder, ApplicationConfigFileName);
            }
        }

        private const string UploadersConfigFileNamePrefix = "UploadersConfig";
        private const string UploadersConfigFileNameExtension = "json";
        private const string UploadersConfigFileName = UploadersConfigFileNamePrefix + "." + UploadersConfigFileNameExtension;

        private static string UploadersConfigFilePath
        {
            get
            {
                if (Program.Sandbox) return null;

                string uploadersConfigFolder;

                if (Settings != null && !string.IsNullOrEmpty(Settings.CustomUploadersConfigPath))
                {
                    uploadersConfigFolder = FileHelpers.ExpandFolderVariables(Settings.CustomUploadersConfigPath);
                }
                else
                {
                    uploadersConfigFolder = Program.PersonalFolder;
                }

                string uploadersConfigFileName = GetUploadersConfigFileName(uploadersConfigFolder);

                return Path.Combine(uploadersConfigFolder, uploadersConfigFileName);
            }
        }

        private const string HotkeysConfigFileName = "HotkeysConfig.json";

        private static string HotkeysConfigFilePath
        {
            get
            {
                if (Program.Sandbox) return null;

                string hotkeysConfigFolder;

                if (Settings != null && !string.IsNullOrEmpty(Settings.CustomHotkeysConfigPath))
                {
                    hotkeysConfigFolder = FileHelpers.ExpandFolderVariables(Settings.CustomHotkeysConfigPath);
                }
                else
                {
                    hotkeysConfigFolder = Program.PersonalFolder;
                }

                return Path.Combine(hotkeysConfigFolder, HotkeysConfigFileName);
            }
        }

        public static string BackupFolder => Path.Combine(Program.PersonalFolder, "Backup");

        private static ApplicationConfig Settings { get => Program.Settings; set => Program.Settings = value; }
        private static TaskSettings DefaultTaskSettings { get => Program.DefaultTaskSettings; set => Program.DefaultTaskSettings = value; }
        private static UploadersConfig UploadersConfig { get => Program.UploadersConfig; set => Program.UploadersConfig = value; }
        private static HotkeysConfig HotkeysConfig { get => Program.HotkeysConfig; set => Program.HotkeysConfig = value; }

        private static ManualResetEvent uploadersConfigResetEvent = new ManualResetEvent(false);
        private static ManualResetEvent hotkeysConfigResetEvent = new ManualResetEvent(false);

        public static void LoadInitialSettings()
        {
            LoadApplicationConfig();

            Task.Run(() =>
            {
                LoadUploadersConfig();
                uploadersConfigResetEvent.Set();

                LoadHotkeysConfig();
                hotkeysConfigResetEvent.Set();
            });
        }

        public static void WaitUploadersConfig()
        {
            if (UploadersConfig == null)
            {
                uploadersConfigResetEvent.WaitOne();
            }
        }

        public static void WaitHotkeysConfig()
        {
            if (HotkeysConfig == null)
            {
                hotkeysConfigResetEvent.WaitOne();
            }
        }

        public static void LoadApplicationConfig(bool fallbackSupport = true)
        {
            Settings = ApplicationConfig.Load(ApplicationConfigFilePath, BackupFolder, fallbackSupport);
            Settings.CreateBackup = true;
            Settings.CreateWeeklyBackup = true;
            Settings.SettingsSaveFailed += Settings_SettingsSaveFailed;
            DefaultTaskSettings = Settings.DefaultTaskSettings;
            ApplicationConfigBackwardCompatibilityTasks();
            MigrateHistoryFile();
            HistoryConnect();
        }

        private static void Settings_SettingsSaveFailed(Exception e)
        {
            string message;

            if (e is UnauthorizedAccessException || e is FileNotFoundException)
            {
                message = Resources.YourAntiVirusSoftwareOrTheControlledFolderAccessFeatureInWindowsCouldBeBlockingShareX;
            }
            else
            {
                message = e.Message;
            }

            TaskHelpers.ShowNotificationTip(message, "ShareX - " + Resources.FailedToSaveSettings, 5000);
        }

        public static void LoadUploadersConfig(bool fallbackSupport = true)
        {
            UploadersConfig = UploadersConfig.Load(UploadersConfigFilePath, BackupFolder, fallbackSupport);
            UploadersConfig.CreateBackup = true;
            UploadersConfig.CreateWeeklyBackup = true;
            UploadersConfig.SupportDPAPIEncryption = true;
            UploadersConfigBackwardCompatibilityTasks();
        }

        public static void LoadHotkeysConfig(bool fallbackSupport = true)
        {
            HotkeysConfig = HotkeysConfig.Load(HotkeysConfigFilePath, BackupFolder, fallbackSupport);
            HotkeysConfig.CreateBackup = true;
            HotkeysConfig.CreateWeeklyBackup = true;
            HotkeysConfigBackwardCompatibilityTasks();
        }

        public static void LoadAllSettings()
        {
            LoadApplicationConfig();
            LoadUploadersConfig();
            LoadHotkeysConfig();
        }

        private static string GetUploadersConfigFileName(string destinationFolder)
        {
            if (string.IsNullOrEmpty(destinationFolder))
            {
                return UploadersConfigFileName;
            }

            if (Settings != null && Settings.UseMachineSpecificUploadersConfig)
            {
                string sanitizedMachineName = FileHelpers.SanitizeFileName(Environment.MachineName);

                if (!string.IsNullOrEmpty(sanitizedMachineName))
                {
                    string machineSpecificFileName = $"{UploadersConfigFileNamePrefix}-{sanitizedMachineName}.{UploadersConfigFileNameExtension}";
                    string machineSpecificPath = Path.Combine(destinationFolder, machineSpecificFileName);

                    if (!File.Exists(machineSpecificPath))
                    {
                        string defaultFilePath = Path.Combine(destinationFolder, UploadersConfigFileName);

                        if (File.Exists(defaultFilePath))
                        {
                            try
                            {
                                File.Copy(defaultFilePath, machineSpecificPath, false);
                            }
                            catch (IOException)
                            {
                                // Ignore copy issues; file may have been created in the meantime.
                            }
                        }
                    }

                    return machineSpecificFileName;
                }
            }

            return UploadersConfigFileName;
        }

        private static void ApplicationConfigBackwardCompatibilityTasks()
        {
            if (SystemOptions.DisableUpload)
            {
                DefaultTaskSettings.AfterCaptureJob = DefaultTaskSettings.AfterCaptureJob.Remove(AfterCaptureTasks.UploadImageToHost);
            }

            if (Settings.IsUpgradeFrom("14.1.1"))
            {
                if (Helpers.IsDefaultSettings(Settings.Themes, ShareXTheme.GetDefaultThemes(), (x, y) => x.Name == y.Name))
                {
                    if (!Settings.Themes.IsValidIndex(Settings.SelectedTheme))
                    {
                        Settings.SelectedTheme = 0;
                    }

                    ShareXTheme selectedTheme = Settings.Themes[Settings.SelectedTheme];

                    Settings.Themes = ShareXTheme.GetDefaultThemes();

                    int index = Settings.Themes.FindIndex(x => x.Name.Equals(selectedTheme.Name, StringComparison.OrdinalIgnoreCase));

                    if (index >= 0)
                    {
                        Settings.SelectedTheme = index;
                    }
                    else
                    {
                        Settings.SelectedTheme = 0;
                    }
                }
            }

            if (Settings.IsUpgradeFrom("14.1.2"))
            {
                if (!Environment.Is64BitOperatingSystem && !string.IsNullOrEmpty(DefaultTaskSettings.CaptureSettings.FFmpegOptions.CLIPath))
                {
                    DefaultTaskSettings.CaptureSettings.FFmpegOptions.OverrideCLIPath = true;
                }
            }

            if (Settings.IsUpgradeFrom("15.0.1"))
            {
                DefaultTaskSettings.CaptureSettings.ScrollingCaptureOptions = new ScrollingCaptureOptions();
                DefaultTaskSettings.CaptureSettings.FFmpegOptions.FixSources();
            }

            if (Settings.IsUpgradeFrom("16.0.2"))
            {
                if (Settings.CheckPreReleaseUpdates)
                {
                    Settings.UpdateChannel = UpdateChannel.PreRelease;
                }

                if (!DefaultTaskSettings.CaptureSettings.SurfaceOptions.UseDimming)
                {
                    DefaultTaskSettings.CaptureSettings.SurfaceOptions.BackgroundDimStrength = 0;
                }
            }
        }

        public static void HistoryConnect()
        {
            HistoryClose();
            Program.HistoryManager = new HistoryManagerSQLite(Program.HistoryFilePath);
        }

        public static void HistoryClose()
        {
            if (Program.HistoryManager != null)
            {
                Program.HistoryManager.Dispose();
                Program.HistoryManager = null;
            }
        }

        private static void MigrateHistoryFile()
        {
            if (File.Exists(Program.HistoryFilePathOld))
            {
                try
                {
                    if (!File.Exists(Program.HistoryFilePath))
                    {
                        DebugHelper.WriteLine($"Migrating JSON history file \"{Program.HistoryFilePathOld}\" to SQLite history file \"{Program.HistoryFilePath}\"");

                        using (HistoryManagerSQLite historyManager = new HistoryManagerSQLite(Program.HistoryFilePath))
                        {
                            historyManager.MigrateFromJSON(Program.HistoryFilePathOld);
                        }
                    }

                    FileHelpers.MoveFile(Program.HistoryFilePathOld, BackupFolder);
                }
                catch (Exception e)
                {
                    DebugHelper.WriteException(e);
                    e.ShowError();
                }
            }
        }

        private static void UploadersConfigBackwardCompatibilityTasks()
        {
            if (UploadersConfig.CustomUploadersList != null)
            {
                foreach (CustomUploaderItem cui in UploadersConfig.CustomUploadersList)
                {
                    try
                    {
                        cui.CheckBackwardCompatibility();
                    }
                    catch
                    {
                    }
                }
            }
        }

        private static void HotkeysConfigBackwardCompatibilityTasks()
        {
            if (SystemOptions.DisableUpload)
            {
                foreach (TaskSettings taskSettings in HotkeysConfig.Hotkeys.Select(x => x.TaskSettings))
                {
                    if (taskSettings != null)
                    {
                        taskSettings.AfterCaptureJob = taskSettings.AfterCaptureJob.Remove(AfterCaptureTasks.UploadImageToHost);
                    }
                }
            }

            if (Settings.IsUpgradeFrom("15.0.1"))
            {
                foreach (TaskSettings taskSettings in HotkeysConfig.Hotkeys.Select(x => x.TaskSettings))
                {
                    if (taskSettings != null && taskSettings.CaptureSettings != null)
                    {
                        taskSettings.CaptureSettings.ScrollingCaptureOptions = new ScrollingCaptureOptions();
                        taskSettings.CaptureSettings.FFmpegOptions.FixSources();
                    }
                }
            }
        }

        public static void CleanupHotkeysConfig()
        {
            foreach (TaskSettings taskSettings in HotkeysConfig.Hotkeys.Select(x => x.TaskSettings))
            {
                taskSettings.Cleanup();
            }
        }

        public static void SaveAllSettings()
        {
            if (Settings != null)
            {
                Settings.Save(ApplicationConfigFilePath);
            }

            if (UploadersConfig != null)
            {
                UploadersConfig.Save(UploadersConfigFilePath);
            }

            if (HotkeysConfig != null)
            {
                CleanupHotkeysConfig();
                HotkeysConfig.Save(HotkeysConfigFilePath);
            }
        }

        public static void SaveApplicationConfigAsync()
        {
            if (Settings != null)
            {
                Settings.SaveAsync(ApplicationConfigFilePath);
            }
        }

        public static void SaveUploadersConfigAsync()
        {
            if (UploadersConfig != null)
            {
                UploadersConfig.SaveAsync(UploadersConfigFilePath);
            }
        }

        public static void SaveHotkeysConfigAsync()
        {
            if (HotkeysConfig != null)
            {
                CleanupHotkeysConfig();
                HotkeysConfig.SaveAsync(HotkeysConfigFilePath);
            }
        }

        public static void SaveAllSettingsAsync()
        {
            SaveApplicationConfigAsync();
            SaveUploadersConfigAsync();
            SaveHotkeysConfigAsync();
        }

        public static void ResetSettings()
        {
            if (File.Exists(ApplicationConfigFilePath)) File.Delete(ApplicationConfigFilePath);
            LoadApplicationConfig(false);

            if (File.Exists(UploadersConfigFilePath)) File.Delete(UploadersConfigFilePath);
            LoadUploadersConfig(false);

            if (File.Exists(HotkeysConfigFilePath)) File.Delete(HotkeysConfigFilePath);
            LoadHotkeysConfig(false);
        }

        public static bool Export(string archivePath, bool settings, bool history)
        {
            MemoryStream msApplicationConfig = null, msUploadersConfig = null, msHotkeysConfig = null;

            try
            {
                List<ZipEntryInfo> entries = new List<ZipEntryInfo>();

                if (settings)
                {
                    msApplicationConfig = Settings.SaveToMemoryStream(false);
                    entries.Add(new ZipEntryInfo(msApplicationConfig, ApplicationConfigFileName));

                    msUploadersConfig = UploadersConfig.SaveToMemoryStream(false);
                    entries.Add(new ZipEntryInfo(msUploadersConfig, UploadersConfigFileName));

                    msHotkeysConfig = HotkeysConfig.SaveToMemoryStream(false);
                    entries.Add(new ZipEntryInfo(msHotkeysConfig, HotkeysConfigFileName));
                }

                if (history)
                {
                    entries.Add(new ZipEntryInfo(Program.HistoryFilePath));
                    HistoryClose();
                }

                ZipManager.Compress(archivePath, entries);
                return true;
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
                MessageBox.Show("Error while exporting backup:\r\n" + e, "ShareX - Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                msApplicationConfig?.Dispose();
                msUploadersConfig?.Dispose();
                msHotkeysConfig?.Dispose();

                if (history)
                {
                    HistoryConnect();
                }
            }

            return false;
        }

        public static bool Import(string archivePath)
        {
            try
            {
                HistoryClose();

                ZipManager.Extract(archivePath, Program.PersonalFolder, true, entry =>
                {
                    return FileHelpers.CheckExtension(entry.Name, new string[] { "json", "xml" });
                }, 1_000_000_000);

                return true;
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
                MessageBox.Show("Error while importing backup:\r\n" + e, "ShareX - Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                HistoryConnect();
            }

            return false;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ShareX.csproj]---
Location: ShareX-develop/ShareX/ShareX.csproj

```text
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net9.0-windows10.0.22621.0</TargetFramework>
    <OutputType>WinExe</OutputType>
    <PlatformTarget>x64</PlatformTarget>
    <RuntimeIdentifier>win-x64</RuntimeIdentifier>
    <ApplicationIcon>ShareX_Icon.ico</ApplicationIcon>
    <UseWindowsForms>true</UseWindowsForms>
    <ApplicationManifest>app.manifest</ApplicationManifest>
    <Description>Screen capture, file sharing and productivity tool</Description>
    <SupportedOSPlatformVersion>10.0.22621.0</SupportedOSPlatformVersion>
    <ApplicationHighDpiMode>PerMonitorV2</ApplicationHighDpiMode>
    <ForceDesignerDpiUnaware>true</ForceDesignerDpiUnaware>
    <ApplicationVisualStyles>true</ApplicationVisualStyles>
    <ApplicationUseCompatibleTextRendering>false</ApplicationUseCompatibleTextRendering>
    <ApplicationDefaultFont>Microsoft Sans Serif, 8.25pt</ApplicationDefaultFont>
    <CETCompat>false</CETCompat>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Newtonsoft.Json" Version="13.0.4" />
    <PackageReference Include="ZXing.Net" Version="0.16.11" />
    <PackageReference Include="ZXing.Net.Bindings.Windows.Compatibility" Version="0.16.14" />
  </ItemGroup>
  <ItemGroup>
    <ProjectReference Include="..\ShareX.HistoryLib\ShareX.HistoryLib.csproj" />
    <ProjectReference Include="..\ShareX.ImageEffectsLib\ShareX.ImageEffectsLib.csproj" />
    <ProjectReference Include="..\ShareX.IndexerLib\ShareX.IndexerLib.csproj" />
    <ProjectReference Include="..\ShareX.MediaLib\ShareX.MediaLib.csproj" />
    <ProjectReference Include="..\ShareX.ScreenCaptureLib\ShareX.ScreenCaptureLib.csproj" />
    <ProjectReference Include="..\ShareX.HelpersLib\ShareX.HelpersLib.csproj" />
    <ProjectReference Include="..\ShareX.UploadersLib\ShareX.UploadersLib.csproj" />
  </ItemGroup>
  <ItemGroup>
    <None Update="host-manifest-chrome.json">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </None>
    <None Update="host-manifest-firefox.json">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </None>
    <None Update="ShareX_File_Icon.ico">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </None>
  </ItemGroup>
  <ItemGroup>
    <RuntimeHostConfigurationOption Include="System.Globalization.UseNls" Value="true" />
  </ItemGroup>
</Project>
```

--------------------------------------------------------------------------------

---[FILE: ShareXCLIManager.cs]---
Location: ShareX-develop/ShareX/ShareXCLIManager.cs

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
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ShareX
{
    public class ShareXCLIManager : CLIManager
    {
        public ShareXCLIManager(string[] arguments) : base(arguments)
        {
        }

        public async Task UseCommandLineArgs()
        {
            await UseCommandLineArgs(Commands);
        }

        public async Task UseCommandLineArgs(List<CLICommand> commands)
        {
            if (commands != null && commands.Count > 0)
            {
                TaskSettings taskSettings = FindCLITask(commands);

                foreach (CLICommand command in commands)
                {
                    DebugHelper.WriteLine("CommandLine: " + command);

                    if (command.IsCommand)
                    {
                        if (CheckCustomUploader(command) || CheckImageEffect(command) || await CheckCLIHotkey(command) || await CheckCLIWorkflow(command) ||
                            await CheckNativeMessagingInput(command))
                        {
                        }

                        continue;
                    }

                    if (URLHelpers.IsValidURL(command.Command))
                    {
                        UploadManager.DownloadAndUploadFile(command.Command, taskSettings);
                    }
                    else
                    {
                        UploadManager.UploadFile(command.Command, taskSettings);
                    }
                }
            }
        }

        private TaskSettings FindCLITask(List<CLICommand> commands)
        {
            if (Program.HotkeysConfig != null)
            {
                CLICommand command = commands.FirstOrDefault(x => x.CheckCommand("task") && !string.IsNullOrEmpty(x.Parameter));

                if (command != null)
                {
                    foreach (HotkeySettings hotkeySetting in Program.HotkeysConfig.Hotkeys)
                    {
                        if (command.Parameter == hotkeySetting.TaskSettings.ToString())
                        {
                            return TaskSettings.GetSafeTaskSettings(hotkeySetting.TaskSettings);
                        }
                    }
                }
            }

            return null;
        }

        private bool CheckCustomUploader(CLICommand command)
        {
            if (command.Command.Equals("CustomUploader", StringComparison.OrdinalIgnoreCase))
            {
                if (!string.IsNullOrEmpty(command.Parameter) && command.Parameter.EndsWith(".sxcu", StringComparison.OrdinalIgnoreCase))
                {
                    TaskHelpers.ImportCustomUploader(command.Parameter);
                }

                return true;
            }

            return false;
        }

        private bool CheckImageEffect(CLICommand command)
        {
            if (command.Command.Equals("ImageEffect", StringComparison.OrdinalIgnoreCase))
            {
                if (!string.IsNullOrEmpty(command.Parameter) && command.Parameter.EndsWith(".sxie", StringComparison.OrdinalIgnoreCase))
                {
                    TaskHelpers.ImportImageEffect(command.Parameter);
                }

                return true;
            }

            return false;
        }

        private async Task<bool> CheckCLIHotkey(CLICommand command)
        {
            foreach (HotkeyType job in Helpers.GetEnums<HotkeyType>())
            {
                if (command.CheckCommand(job.ToString()))
                {
                    string filePath = null;

                    try
                    {
                        filePath = CheckParameterForFilePath(command);
                    }
                    catch (Exception e)
                    {
                        DebugHelper.WriteException(e);

                        return true;
                    }

                    await TaskHelpers.ExecuteJob(job, filePath);

                    return true;
                }
            }

            return false;
        }

        private string CheckParameterForFilePath(CLICommand command)
        {
            if (command != null && !string.IsNullOrEmpty(command.Parameter))
            {
                string filePath = FileHelpers.GetAbsolutePath(command.Parameter);

                if (!File.Exists(filePath))
                {
                    throw new FileNotFoundException();
                }

                return filePath;
            }

            return null;
        }

        private async Task<bool> CheckCLIWorkflow(CLICommand command)
        {
            if (Program.HotkeysConfig != null && command.CheckCommand("workflow") && !string.IsNullOrEmpty(command.Parameter))
            {
                foreach (HotkeySettings hotkeySetting in Program.HotkeysConfig.Hotkeys)
                {
                    if (hotkeySetting.TaskSettings.Job != HotkeyType.None)
                    {
                        if (command.Parameter == hotkeySetting.TaskSettings.ToString())
                        {
                            await TaskHelpers.ExecuteJob(hotkeySetting.TaskSettings);

                            return true;
                        }
                    }
                }
            }

            return false;
        }

        private async Task<bool> CheckNativeMessagingInput(CLICommand command)
        {
            if (command.Command.Equals("NativeMessagingInput", StringComparison.OrdinalIgnoreCase))
            {
                if (!string.IsNullOrEmpty(command.Parameter) && command.Parameter.EndsWith(".json", StringComparison.OrdinalIgnoreCase))
                {
                    await TaskHelpers.HandleNativeMessagingInput(command.Parameter);
                }

                return true;
            }

            return false;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ShareXUpdateManager.cs]---
Location: ShareX-develop/ShareX/ShareXUpdateManager.cs

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

namespace ShareX
{
    internal class ShareXUpdateManager : GitHubUpdateManager
    {
        public UpdateChannel UpdateChannel { get; set; }

        public override GitHubUpdateChecker CreateUpdateChecker()
        {
            if (UpdateChannel == UpdateChannel.Dev)
            {
                return new GitHubUpdateChecker("ShareX", "DevBuilds")
                {
                    IsDev = true,
                    IsPortable = Program.Portable,
                    IgnoreRevision = true
                };
            }
            else
            {
                return new GitHubUpdateChecker("ShareX", "ShareX")
                {
                    IsPortable = Program.Portable,
                    IncludePreRelease = UpdateChannel == UpdateChannel.PreRelease,
                    IgnoreRevision = true
                };
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: StartupManager.cs]---
Location: ShareX-develop/ShareX/StartupManager.cs

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
using System.Windows.Forms;

#if MicrosoftStore
using Windows.ApplicationModel;
#endif

namespace ShareX
{
    public static class StartupManager
    {
#if MicrosoftStore
        private const int StartupTargetIndex = 0;
        private static readonly StartupTask packageTask = StartupTask.GetForCurrentPackageAsync().GetAwaiter().GetResult()[StartupTargetIndex];
#endif

        public static string StartupTargetPath
        {
            get
            {
#if STEAM
                return FileHelpers.GetAbsolutePath("../ShareX_Launcher.exe");
#else
                return Application.ExecutablePath;
#endif
            }
        }

        public static StartupState State
        {
            get
            {
#if MicrosoftStore
                return (StartupState)packageTask.State;
#else
                if (ShortcutHelpers.CheckShortcut(Environment.SpecialFolder.Startup, "ShareX", StartupTargetPath))
                {
                    if (Registry.GetValue(@"HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\StartupFolder",
                        "ShareX.lnk", null) is byte[] status && status.Length > 0 && status[0] == 3)
                    {
                        return StartupState.DisabledByUser;
                    }
                    else
                    {
                        return StartupState.Enabled;
                    }
                }
                else
                {
                    return StartupState.Disabled;
                }
#endif
            }
            set
            {
#if MicrosoftStore
                if (value == StartupState.Enabled)
                {
                    packageTask.RequestEnableAsync().GetAwaiter().GetResult();
                }
                else if (value == StartupState.Disabled)
                {
                    packageTask.Disable();
                }
                else
                {
                    throw new NotSupportedException();
                }
#else
                if (value == StartupState.Enabled || value == StartupState.Disabled)
                {
                    ShortcutHelpers.SetShortcut(value == StartupState.Enabled, Environment.SpecialFolder.Startup, "ShareX", StartupTargetPath, "-silent");
                }
                else
                {
                    throw new NotSupportedException();
                }
#endif
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: SystemOptions.cs]---
Location: ShareX-develop/ShareX/SystemOptions.cs

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

namespace ShareX
{
    public static class SystemOptions
    {
        private const string RegistryPath = @"SOFTWARE\ShareX";

        public static bool DisableUpdateCheck { get; private set; }
        public static bool DisableUpload { get; private set; }
        public static bool DisableLogging { get; private set; }
        public static string PersonalPath { get; private set; }

        public static void UpdateSystemOptions()
        {
            DisableUpdateCheck = GetSystemOptionBoolean("DisableUpdateCheck");
            DisableUpload = GetSystemOptionBoolean("DisableUpload");
            DisableLogging = GetSystemOptionBoolean("DisableLogging");
            PersonalPath = GetSystemOptionString("PersonalPath");
        }

        private static bool GetSystemOptionBoolean(string name)
        {
            object value = RegistryHelpers.GetValue(RegistryPath, name, RegistryHive.LocalMachine);

            if (value != null)
            {
                try
                {
                    return Convert.ToBoolean(value);
                }
                catch
                {
                }
            }

            value = RegistryHelpers.GetValue(RegistryPath, name, RegistryHive.CurrentUser);

            if (value != null)
            {
                try
                {
                    return Convert.ToBoolean(value);
                }
                catch
                {
                }
            }

            return false;
        }

        private static string GetSystemOptionString(string name)
        {
            string value = RegistryHelpers.GetValueString(RegistryPath, name, RegistryHive.LocalMachine);

            if (value == null)
            {
                value = RegistryHelpers.GetValueString(RegistryPath, name, RegistryHive.CurrentUser);
            }

            return value;
        }
    }
}
```

--------------------------------------------------------------------------------

````
