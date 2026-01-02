---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 538
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 538 of 650)

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

---[FILE: ShareX-setup.iss]---
Location: ShareX-develop/ShareX.Setup/InnoSetup/ShareX-setup.iss

```text
#define MyAppName "ShareX"
#define MyAppRootDirectory "..\.."
#define MyAppOutputDirectory MyAppRootDirectory + "\Output"
#define MyAppReleaseDirectory MyAppRootDirectory + "\" + MyAppName + "\bin\Release\win-x64"
#define MyAppFileName MyAppName + ".exe"
#define MyAppFilePath MyAppReleaseDirectory + "\" + MyAppFileName
#define MyAppVersion GetStringFileInfo(MyAppFilePath, "ProductVersion")
#define MyAppPublisher "ShareX Team"
#define MyAppURL "https://getsharex.com"
#define MyAppId "82E6AC09-0FEF-4390-AD9F-0DD3F5561EFC"

[Setup]
AppCopyright=Copyright (c) 2007-2025 ShareX Team
AppId={#MyAppId}
AppMutex={#MyAppId}
AppName={#MyAppName}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppVerName={#MyAppName} {#MyAppVersion}
AppVersion={#MyAppVersion}
ArchitecturesAllowed=x64os arm64 x86
ArchitecturesInstallIn64BitMode=x64os
DefaultDirName={commonpf}\{#MyAppName}
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
LicenseFile={#MyAppRootDirectory}\LICENSE.txt
MinVersion=10.0.14393
OutputBaseFilename={#MyAppName}-{#MyAppVersion}-setup
OutputDir={#MyAppOutputDirectory}
PrivilegesRequired=none
SolidCompression=yes
UninstallDisplayIcon={app}\{#MyAppFileName}
UninstallDisplayName={#MyAppName}
VersionInfoCompany={#MyAppPublisher}
VersionInfoTextVersion={#MyAppVersion}
VersionInfoVersion={#MyAppVersion}

[Tasks]
Name: "CreateDesktopIcon"; Description: "Create a desktop shortcut"; GroupDescription: "Additional shortcuts:"; Check: not IsUpdating and not DesktopIconExists
Name: "CreateContextMenuButton"; Description: "Show ""Upload with ShareX"" button in Windows Explorer context menu"; GroupDescription: "Additional shortcuts:"; Check: not IsUpdating
Name: "CreateSendToIcon"; Description: "Create a send to shortcut"; GroupDescription: "Additional shortcuts:"; Check: not IsUpdating
Name: "CreateStartupIcon"; Description: "Run ShareX when Windows starts"; GroupDescription: "Other tasks:"; Check: not IsUpdating
Name: "EnableBrowserExtensionSupport"; Description: "Enable browser extension support"; GroupDescription: "Other tasks:"; Check: not IsUpdating
Name: "DisablePrintScreenKeyForSnippingTool"; Description: "Disable Print Screen key for Snipping Tool"; GroupDescription: "Other tasks:"; Check: not IsUpdating

[Files]
Source: "{#MyAppReleaseDirectory}\*.exe"; DestDir: {app}; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\*.dll"; DestDir: {app}; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\*.json"; DestDir: {app}; Flags: ignoreversion
Source: "{#MyAppRootDirectory}\Licenses\*.txt"; DestDir: {app}\Licenses; Flags: ignoreversion
Source: "{#MyAppOutputDirectory}\*.exe"; DestDir: {app}; Flags: ignoreversion
Source: "{#MyAppOutputDirectory}\exiftool_files\*"; DestDir: {app}\exiftool_files; Flags: ignoreversion recursesubdirs
Source: "{#MyAppReleaseDirectory}\ShareX_File_Icon.ico"; DestDir: {app}; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\ar-YE\*.resources.dll"; DestDir: {app}\Languages\ar-YE; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\de\*.resources.dll"; DestDir: {app}\Languages\de; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\es\*.resources.dll"; DestDir: {app}\Languages\es; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\es-MX\*.resources.dll"; DestDir: {app}\Languages\es-MX; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\fa-IR\*.resources.dll"; DestDir: {app}\Languages\fa-IR; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\fr\*.resources.dll"; DestDir: {app}\Languages\fr; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\he-IL\*.resources.dll"; DestDir: {app}\Languages\he-IL; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\hu\*.resources.dll"; DestDir: {app}\Languages\hu; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\id-ID\*.resources.dll"; DestDir: {app}\Languages\id-ID; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\it-IT\*.resources.dll"; DestDir: {app}\Languages\it-IT; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\ja-JP\*.resources.dll"; DestDir: {app}\Languages\ja-JP; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\ko-KR\*.resources.dll"; DestDir: {app}\Languages\ko-KR; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\nl-NL\*.resources.dll"; DestDir: {app}\Languages\nl-NL; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\pl\*.resources.dll"; DestDir: {app}\Languages\pl; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\pt-BR\*.resources.dll"; DestDir: {app}\Languages\pt-BR; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\pt-PT\*.resources.dll"; DestDir: {app}\Languages\pt-PT; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\ro\*.resources.dll"; DestDir: {app}\Languages\ro; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\ru\*.resources.dll"; DestDir: {app}\Languages\ru; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\tr\*.resources.dll"; DestDir: {app}\Languages\tr; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\uk\*.resources.dll"; DestDir: {app}\Languages\uk; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\vi-VN\*.resources.dll"; DestDir: {app}\Languages\vi-VN; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\zh-CN\*.resources.dll"; DestDir: {app}\Languages\zh-CN; Flags: ignoreversion
Source: "{#MyAppReleaseDirectory}\zh-TW\*.resources.dll"; DestDir: {app}\Languages\zh-TW; Flags: ignoreversion
Source: "{#MyAppRootDirectory}\ShareX.ScreenCaptureLib\Stickers\*"; DestDir: {app}\Stickers; Flags: ignoreversion recursesubdirs
Source: "puush"; DestDir: {app}; Check: IsPuushMode

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppFileName}"; WorkingDir: "{app}"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"; WorkingDir: "{app}"
Name: "{userdesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppFileName}"; WorkingDir: "{app}"; Tasks: CreateDesktopIcon
Name: "{usersendto}\{#MyAppName}"; Filename: "{app}\{#MyAppFileName}"; WorkingDir: "{app}"; Tasks: CreateSendToIcon
Name: "{userstartup}\{#MyAppName}"; Filename: "{app}\{#MyAppFileName}"; WorkingDir: "{app}"; Parameters: "-silent"; Tasks: CreateStartupIcon

[Run]
Filename: "{app}\{#MyAppFileName}"; Description: "{cm:LaunchProgram,{#MyAppName}}"; Flags: nowait postinstall; Check: not IsNoRun

[Registry]
Root: "HKCU"; Subkey: "Software\Classes\*\shell\{#MyAppName}"; ValueType: string; ValueData: "Upload with {#MyAppName}"; Tasks: CreateContextMenuButton
Root: "HKCU"; Subkey: "Software\Classes\*\shell\{#MyAppName}"; ValueType: string; ValueName: "Icon"; ValueData: """{app}\{#MyAppFileName}"",0"; Tasks: CreateContextMenuButton
Root: "HKCU"; Subkey: "Software\Classes\*\shell\{#MyAppName}\command"; ValueType: string; ValueData: """{app}\{#MyAppFileName}"" ""%1"""; Tasks: CreateContextMenuButton
Root: "HKCU"; Subkey: "Software\Classes\Directory\shell\{#MyAppName}"; ValueType: string; ValueData: "Upload with {#MyAppName}"; Tasks: CreateContextMenuButton
Root: "HKCU"; Subkey: "Software\Classes\Directory\shell\{#MyAppName}"; ValueType: string; ValueName: "Icon"; ValueData: """{app}\{#MyAppFileName}"",0"; Tasks: CreateContextMenuButton
Root: "HKCU"; Subkey: "Software\Classes\Directory\shell\{#MyAppName}\command"; ValueType: string; ValueData: """{app}\{#MyAppFileName}"" ""%1"""; Tasks: CreateContextMenuButton
Root: "HKCU"; Subkey: "Software\Classes\*\shell\{#MyAppName}"; Flags: dontcreatekey uninsdeletekey
Root: "HKCU"; Subkey: "Software\Classes\Directory\shell\{#MyAppName}"; Flags: dontcreatekey uninsdeletekey
Root: "HKCU"; Subkey: "Software\Classes\.sxcu"; Flags: dontcreatekey uninsdeletekey
Root: "HKCU"; Subkey: "Software\Classes\ShareX.sxcu"; Flags: dontcreatekey uninsdeletekey
Root: "HKCU"; Subkey: "Software\Classes\.sxie"; Flags: dontcreatekey uninsdeletekey
Root: "HKCU"; Subkey: "Software\Classes\ShareX.sxie"; Flags: dontcreatekey uninsdeletekey
Root: "HKCU"; Subkey: "Software\Classes\SystemFileAssociations\image\shell\ShareXImageEditor"; Flags: dontcreatekey uninsdeletekey
Root: "HKCU"; Subkey: "SOFTWARE\Google\Chrome\NativeMessagingHosts\com.getsharex.sharex"; ValueType: string; ValueData: "{app}\host-manifest-chrome.json"; Flags: uninsdeletekey; Tasks: EnableBrowserExtensionSupport
Root: "HKCU"; Subkey: "SOFTWARE\Mozilla\NativeMessagingHosts\ShareX"; ValueType: string; ValueData: "{app}\host-manifest-firefox.json"; Flags: uninsdeletekey; Tasks: EnableBrowserExtensionSupport
Root: "HKCU"; Subkey: "Control Panel\Keyboard"; ValueType: dword; ValueName: "PrintScreenKeyForSnippingEnabled"; ValueData: "0"; Flags: uninsdeletevalue; Tasks: DisablePrintScreenKeyForSnippingTool

[Code]
procedure InitializeWizard;
begin
  if not IsAdmin then
  begin
    WizardForm.DirEdit.Text := ExpandConstant('{userpf}\{#MyAppName}');
  end;
end;

function InitializeUninstall(): Boolean;
var
  ErrorCode: Integer;
begin
  if CheckForMutexes('{#MyAppId}') then
  begin
    if MsgBox('Uninstall has detected that {#MyAppName} is currently running.' + #13#10#13#10 + 'Would you like to close it?', mbError, MB_YESNO) = IDYES then
    begin
      Exec('taskkill.exe', '/f /im {#MyAppFileName}', '', SW_HIDE, ewWaitUntilTerminated, ErrorCode);
    end
    else
    begin
      Result := False;
      Exit;
    end;
  end;

  Result := True;
end;

function CmdLineParamExists(const value: string): Boolean;
var
  i: Integer;
begin
  Result := False;
  for i := 1 to ParamCount do
    if CompareText(ParamStr(i), value) = 0 then
    begin
      Result := True;
      Exit;
    end;
end;

function IsUpdating(): Boolean;
begin
  Result := CmdLineParamExists('/UPDATE');
end;

function IsNoRun(): Boolean;
begin
  Result := CmdLineParamExists('/NORUN');
end;

function IsPuushMode(): Boolean;
begin
  Result := CmdLineParamExists('-puush');
end;

function DesktopIconExists(): Boolean;
begin
  Result := FileExists(ExpandConstant('{userdesktop}\{#MyAppName}.lnk'));
end;
```

--------------------------------------------------------------------------------

---[FILE: AppxManifest.xml]---
Location: ShareX-develop/ShareX.Setup/MicrosoftStore/AppxManifest.xml

```text
<?xml version="1.0" encoding="utf-8"?>
<Package xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10" xmlns:uap="http://schemas.microsoft.com/appx/manifest/uap/windows10" xmlns:uap2="http://schemas.microsoft.com/appx/manifest/uap/windows10/2" xmlns:uap3="http://schemas.microsoft.com/appx/manifest/uap/windows10/3" xmlns:rescap="http://schemas.microsoft.com/appx/manifest/foundation/windows10/restrictedcapabilities" xmlns:desktop="http://schemas.microsoft.com/appx/manifest/desktop/windows10" xmlns:desktop2="http://schemas.microsoft.com/appx/manifest/desktop/windows10/2" IgnorableNamespaces="desktop2">
  <Identity Name="19568ShareX.ShareX" ProcessorArchitecture="x64" Publisher="CN=366A5DE5-2EC7-43FD-B559-05986578C4CC" Version="18.0.1.0" />
  <Properties>
    <DisplayName>ShareX</DisplayName>
    <PublisherDisplayName>ShareX Team</PublisherDisplayName>
    <Logo>Assets\StoreLogo.png</Logo>
  </Properties>
  <Resources>
    <Resource Language="en-us" />
    <Resource uap:Scale="100" />
    <Resource uap:Scale="125" />
    <Resource uap:Scale="150" />
    <Resource uap:Scale="200" />
    <Resource uap:Scale="400" />
  </Resources>
  <Dependencies>
    <TargetDeviceFamily Name="Windows.Desktop" MinVersion="10.0.18362.0" MaxVersionTested="10.0.18362.0" />
  </Dependencies>
  <Capabilities>
    <rescap:Capability Name="runFullTrust" />
  </Capabilities>
  <Applications>
    <Application Id="ShareX" Executable="ShareX.exe" EntryPoint="Windows.FullTrustApplication">
      <uap:VisualElements DisplayName="ShareX" Description="ShareX" BackgroundColor="#242424" Square150x150Logo="Assets\Square150x150Logo.png" Square44x44Logo="Assets\Square44x44Logo.png">
        <uap:DefaultTile Wide310x150Logo="Assets\Wide310x150Logo.png" Square310x310Logo="Assets\LargeTile.png" Square71x71Logo="Assets\SmallTile.png">
          <uap:ShowNameOnTiles>
            <uap:ShowOn Tile="square150x150Logo" />
            <uap:ShowOn Tile="wide310x150Logo" />
            <uap:ShowOn Tile="square310x310Logo" />
          </uap:ShowNameOnTiles>
        </uap:DefaultTile>
      </uap:VisualElements>
      <Extensions>
        <desktop:Extension Category="windows.startupTask" Executable="ShareX.exe" EntryPoint="Windows.FullTrustApplication">
          <desktop:StartupTask TaskId="ShareX" Enabled="true" DisplayName="ShareX" />
        </desktop:Extension>
        <uap:Extension Category="windows.fileTypeAssociation">
          <uap3:FileTypeAssociation Name="sharex-custom-uploader" desktop2:UseUrl="false" Parameters='-CustomUploader "%1"'>
            <uap:DisplayName>ShareX custom uploader</uap:DisplayName>
            <uap:SupportedFileTypes>
              <uap:FileType>.sxcu</uap:FileType>
            </uap:SupportedFileTypes>
          </uap3:FileTypeAssociation>
        </uap:Extension>
        <uap:Extension Category="windows.fileTypeAssociation">
          <uap3:FileTypeAssociation Name="sharex-image-effect" desktop2:UseUrl="false" Parameters='-ImageEffect "%1"'>
            <uap:DisplayName>ShareX image effect</uap:DisplayName>
            <uap:SupportedFileTypes>
              <uap:FileType>.sxie</uap:FileType>
            </uap:SupportedFileTypes>
          </uap3:FileTypeAssociation>
        </uap:Extension>
      </Extensions>
    </Application>
  </Applications>
</Package>
```

--------------------------------------------------------------------------------

---[FILE: ShareX.ShareX.installer.yaml]---
Location: ShareX-develop/ShareX.Setup/WinGet/ShareX.ShareX.installer.yaml

```yaml
# Created using wingetcreate 1.6.1.0
# yaml-language-server: $schema=https://aka.ms/winget-manifest.installer.1.6.0.schema.json

PackageIdentifier: ShareX.ShareX
PackageVersion: {PackageVersion}
MinimumOSVersion: 6.1.7601.0
InstallerType: inno
InstallerSwitches:
  Silent: /VERYSILENT /NORUN
  SilentWithProgress: /SILENT /NORUN
UpgradeBehavior: install
Installers:
- Architecture: neutral
  Scope: machine
  InstallerUrl: {InstallerUrl}
  InstallerSha256: {InstallerSha256}
ManifestType: installer
ManifestVersion: 1.6.0
```

--------------------------------------------------------------------------------

---[FILE: ShareX.ShareX.locale.en-US.yaml]---
Location: ShareX-develop/ShareX.Setup/WinGet/ShareX.ShareX.locale.en-US.yaml

```yaml
# Created using wingetcreate 1.6.1.0
# yaml-language-server: $schema=https://aka.ms/winget-manifest.defaultLocale.1.6.0.schema.json

PackageIdentifier: ShareX.ShareX
PackageVersion: {PackageVersion}
PackageLocale: en-US
Publisher: ShareX Team
PublisherUrl: https://getsharex.com
PublisherSupportUrl: https://github.com/ShareX/ShareX/issues
PrivacyUrl: https://getsharex.com/privacy-policy
Author: ShareX Team
PackageName: ShareX
PackageUrl: https://github.com/ShareX/ShareX
License: GNU General Public License v3.0
LicenseUrl: https://github.com/ShareX/ShareX/blob/master/LICENSE.txt
Copyright: Copyright (c) 2007-2025 ShareX Team
ShortDescription: ShareX is a free and open-source screen capture and file sharing software.
Description: |-
  ShareX is a free and open source program that lets you capture or record any area of your screen and share it with a single press of a key.
  It also allows uploading images, text or other types of files to many supported destinations you can choose from.
Moniker: sharex
Tags:
- capture
- color-picker
- file-sharing
- file-upload
- foss
- gif-recorder
- image-annotation
- ocr
- productivity
- region-capture
- screen-capture
- screen-recorder
- screenshot
- share
- uploader
- url-shortener
ManifestType: defaultLocale
ManifestVersion: 1.6.0
```

--------------------------------------------------------------------------------

---[FILE: ShareX.ShareX.yaml]---
Location: ShareX-develop/ShareX.Setup/WinGet/ShareX.ShareX.yaml

```yaml
# Created using wingetcreate 1.6.1.0
# yaml-language-server: $schema=https://aka.ms/winget-manifest.version.1.6.0.schema.json

PackageIdentifier: ShareX.ShareX
PackageVersion: {PackageVersion}
DefaultLocale: en-US
ManifestType: version
ManifestVersion: 1.6.0
```

--------------------------------------------------------------------------------

---[FILE: app.config]---
Location: ShareX-develop/ShareX.Steam/app.config

```text
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <startup>
    <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.8"/>
  </startup>
</configuration>
```

--------------------------------------------------------------------------------

---[FILE: Helpers.cs]---
Location: ShareX-develop/ShareX.Steam/Helpers.cs

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
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows.Forms;

namespace ShareX.Steam
{
    public static class Helpers
    {
        [DllImport("kernel32.dll")]
        public static extern uint WinExec(string lpCmdLine, uint uCmdShow);

        public static string GetAbsolutePath(string path)
        {
            if (!Path.IsPathRooted(path)) // Is relative path?
            {
                path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, path);
            }

            return Path.GetFullPath(path);
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

        /// <summary>
        /// If version1 newer than version2 = 1
        /// If version1 equal to version2 = 0
        /// If version1 older than version2 = -1
        /// </summary>
        public static int CompareVersion(string version1, string version2)
        {
            return ParseVersion(version1).CompareTo(ParseVersion(version2));
        }

        private static Version ParseVersion(string version)
        {
            return NormalizeVersion(Version.Parse(version));
        }

        private static Version NormalizeVersion(Version version)
        {
            return new Version(Math.Max(version.Major, 0), Math.Max(version.Minor, 0), Math.Max(version.Build, 0), Math.Max(version.Revision, 0));
        }

        public static void ShowError(Exception e)
        {
            MessageBox.Show(e.ToString(), "ShareX - Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }

        public static void CopyAll(string sourceDirectory, string targetDirectory)
        {
            DirectoryInfo diSource = new DirectoryInfo(sourceDirectory);
            DirectoryInfo diTarget = new DirectoryInfo(targetDirectory);

            CopyAll(diSource, diTarget);
        }

        public static void CopyAll(DirectoryInfo source, DirectoryInfo target)
        {
            if (!Directory.Exists(target.FullName))
            {
                Directory.CreateDirectory(target.FullName);
            }

            foreach (FileInfo fi in source.GetFiles())
            {
                fi.CopyTo(Path.Combine(target.FullName, fi.Name), true);
            }

            foreach (DirectoryInfo diSourceSubDir in source.GetDirectories())
            {
                DirectoryInfo nextTargetSubDir = target.CreateSubdirectory(diSourceSubDir.Name);
                CopyAll(diSourceSubDir, nextTargetSubDir);
            }
        }

        public static bool IsCommandExist(string[] args, string command)
        {
            if (args != null && !string.IsNullOrEmpty(command))
            {
                return args.Any(arg => !string.IsNullOrEmpty(arg) && arg.Equals(command, StringComparison.OrdinalIgnoreCase));
            }

            return false;
        }

        public static void CreateEmptyFile(string path)
        {
            File.Create(path).Dispose();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: installscript.vdf]---
Location: ShareX-develop/ShareX.Steam/installscript.vdf

```text
"InstallScript"
{
	"Run Process On Uninstall"
	{
		"Uninstaller"
		{
			"Process 1" "%INSTALLDIR%\\ShareX_Launcher.exe"
			"Command 1" "-uninstall"
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: Launcher.cs]---
Location: ShareX-develop/ShareX.Steam/Launcher.cs

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
using System.Management;
using System.Threading;
using System.Windows.Forms;

namespace ShareX.Steam
{
    public static class Launcher
    {
        private static string ContentFolderPath = Helpers.GetAbsolutePath("ShareX");
        private static string ContentExecutablePath = Path.Combine(ContentFolderPath, "ShareX.exe");
        private static string ContentSteamFilePath = Path.Combine(ContentFolderPath, "Steam");
        private static string UpdatingTempFilePath = Path.Combine(ContentFolderPath, "Updating");

        private static string UpdateFolderPath = Helpers.GetAbsolutePath("Updates");
        private static string UpdateExecutablePath = Path.Combine(UpdateFolderPath, "ShareX.exe");

        private static bool IsFirstTimeRunning, IsStartupRun, ShowInApp, IsSteamInit;
        private static Stopwatch SteamInitStopwatch;

        public static void Run(string[] args)
        {
            if (Helpers.IsCommandExist(args, "-uninstall"))
            {
                UninstallShareX();
                return;
            }

            IsStartupRun = Helpers.IsCommandExist(args, "-silent");

            ShowInApp = File.Exists(ContentSteamFilePath);

            if (!IsShareXRunning())
            {
                // If running on startup and need to show "In-app" then wait for Steam to run.
                if (IsStartupRun && ShowInApp)
                {
                    for (int i = 0; i < 30 && !SteamAPI.IsSteamRunning(); i++)
                    {
                        Thread.Sleep(1000);
                    }
                }

                if (SteamAPI.IsSteamRunning())
                {
                    // Even "IsSteamRunning" is true still Steam API init can fail, therefore need to give more time for Steam to launch.
                    for (int i = 0; i < 10; i++)
                    {
                        IsSteamInit = SteamAPI.Init();

                        if (IsSteamInit)
                        {
                            SteamInitStopwatch = Stopwatch.StartNew();
                            break;
                        }

                        Thread.Sleep(1000);
                    }
                }

                if (IsUpdateRequired())
                {
                    UpdateShareX();
                }

                if (IsSteamInit)
                {
                    SteamAPI.Shutdown();
                }
            }

            if (File.Exists(ContentExecutablePath))
            {
                string arguments = "";

                if (IsFirstTimeRunning)
                {
                    // Show first time config window.
                    arguments = "-SteamConfig";
                }
                else if (IsStartupRun)
                {
                    // Don't show ShareX main window.
                    arguments = "-silent";
                }

                RunShareX(arguments);

                if (IsSteamInit)
                {
                    // Reason for this workaround is because Steam only allows writing review if user is played the game at least 5 minutes.
                    // For this reason ShareX launcher will stay on for at least 10 seconds to let users eventually reach 5 minutes play time.
                    int waitTime = 10000;

                    if (SteamInitStopwatch != null)
                    {
                        waitTime -= (int)SteamInitStopwatch.ElapsedMilliseconds;
                    }

                    if (waitTime > 0)
                    {
                        Thread.Sleep(waitTime);
                    }
                }
            }
        }

        private static bool IsShareXRunning()
        {
            // Check ShareX mutex.
            return Helpers.IsRunning("82E6AC09-0FEF-4390-AD9F-0DD3F5561EFC");
        }

        private static bool IsUpdateRequired()
        {
            try
            {
                // Update not exists?
                if (!File.Exists(UpdateExecutablePath))
                {
                    return false;
                }

                // First time running?
                if (!File.Exists(ContentExecutablePath))
                {
                    IsFirstTimeRunning = true;
                    return true;
                }

                // Need repair?
                if (File.Exists(UpdatingTempFilePath))
                {
                    return true;
                }

                // Need update?
                FileVersionInfo contentVersionInfo = FileVersionInfo.GetVersionInfo(ContentExecutablePath);
                FileVersionInfo updateVersionInfo = FileVersionInfo.GetVersionInfo(UpdateExecutablePath);

                return Helpers.CompareVersion(contentVersionInfo.FileVersion, updateVersionInfo.FileVersion) < 0;
            }
            catch (Exception e)
            {
                Helpers.ShowError(e);
            }

            return false;
        }

        private static void UpdateShareX()
        {
            try
            {
                if (!Directory.Exists(ContentFolderPath))
                {
                    Directory.CreateDirectory(ContentFolderPath);
                }

                // In case updating process terminate middle of it, allow launcher to repair ShareX.
                Helpers.CreateEmptyFile(UpdatingTempFilePath);
                Helpers.CopyAll(UpdateFolderPath, ContentFolderPath);
                File.Delete(UpdatingTempFilePath);

                if (IsFirstTimeRunning)
                {
                    Helpers.CreateEmptyFile(ContentSteamFilePath);
                }
            }
            catch (Exception e)
            {
                Helpers.ShowError(e);
            }
        }

        private static void RunShareX(string arguments = "")
        {
            try
            {
                if (!ShowInApp)
                {
                    // Workarounds to not show "In-Game" on Steam.

                    // Workaround 1.
                    try
                    {
                        using (ManagementClass managementClass = new ManagementClass("Win32_Process"))
                        {
                            ManagementClass processInfo = new ManagementClass("Win32_ProcessStartup");
                            processInfo.Properties["CreateFlags"].Value = 0x00000008;

                            ManagementBaseObject inParameters = managementClass.GetMethodParameters("Create");
                            inParameters["CommandLine"] = $"\"{ContentExecutablePath}\" {arguments}";
                            inParameters["ProcessStartupInformation"] = processInfo;

                            ManagementBaseObject result = managementClass.InvokeMethod("Create", inParameters, null);
                            // Returns a value of 0 (zero) if the process was successfully created, and any other number to indicate an error.
                            if (result != null && (uint)result.Properties["ReturnValue"].Value == 0)
                            {
                                return;
                            }
                        }
                    }
                    catch
                    {
                    }

                    // Workaround 2.
                    try
                    {
                        uint result = Helpers.WinExec($"\"{ContentExecutablePath}\" {arguments}", 5);

                        // If the function succeeds, the return value is greater than 31.
                        if (result > 31)
                        {
                            return;
                        }
                    }
                    catch
                    {
                    }

                    // Workaround 3.
                    try
                    {
                        string path = Path.Combine(Environment.SystemDirectory, "cmd.exe");

                        if (!File.Exists(path))
                        {
                            path = "cmd.exe";
                        }

                        using (Process process = new Process())
                        {
                            ProcessStartInfo psi = new ProcessStartInfo()
                            {
                                FileName = path,
                                Arguments = $"/C start \"\" \"{ContentExecutablePath}\" {arguments}",
                                UseShellExecute = false,
                                CreateNoWindow = true
                            };

                            process.StartInfo = psi;
                            bool result = process.Start();

                            if (result)
                            {
                                return;
                            }
                        }
                    }
                    catch
                    {
                    }
                }

                using (Process process = new Process())
                {
                    ProcessStartInfo psi = new ProcessStartInfo()
                    {
                        FileName = ContentExecutablePath,
                        Arguments = arguments,
                        UseShellExecute = true
                    };

                    process.StartInfo = psi;
                    process.Start();
                }
            }
            catch (Exception e)
            {
                Helpers.ShowError(e);
            }
        }

        private static void UninstallShareX()
        {
            try
            {
                while (IsShareXRunning())
                {
                    if (MessageBox.Show("ShareX is currently running.\r\n\r\nPlease close ShareX and press \"Retry\" button after it is closed.", "ShareX - Uninstaller",
                        MessageBoxButtons.RetryCancel, MessageBoxIcon.Warning) == DialogResult.Cancel)
                    {
                        return;
                    }
                }

                if (Directory.Exists(ContentFolderPath))
                {
                    if (File.Exists(ContentExecutablePath))
                    {
                        using (Process process = new Process())
                        {
                            ProcessStartInfo psi = new ProcessStartInfo()
                            {
                                FileName = ContentExecutablePath,
                                Arguments = "-uninstall"
                            };

                            process.StartInfo = psi;
                            process.Start();
                            process.WaitForExit();
                        }
                    }

                    Directory.Delete(ContentFolderPath, true);
                }
            }
            catch (Exception e)
            {
                Helpers.ShowError(e);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Program.cs]---
Location: ShareX-develop/ShareX.Steam/Program.cs

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

using System.Windows.Forms;

namespace ShareX.Steam
{
    internal static class Program
    {
        private static void Main(string[] args)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            Launcher.Run(args);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ShareX.Steam.csproj]---
Location: ShareX-develop/ShareX.Steam/ShareX.Steam.csproj

```text
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net48</TargetFramework>
    <OutputType>WinExe</OutputType>
    <PlatformTarget>x86</PlatformTarget>
    <AssemblyName>ShareX_Launcher</AssemblyName>
    <ApplicationIcon>ShareX_Icon.ico</ApplicationIcon>
    <UseWindowsForms>true</UseWindowsForms>
  </PropertyGroup>
  <ItemGroup>
    <Reference Include="System.Management" />
  </ItemGroup>
  <ItemGroup>
    <None Update="steam_appid.txt">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </None>
    <None Update="installscript.vdf">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </None>
    <None Update="steam_api.dll">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </None>
  </ItemGroup>
</Project>
```

--------------------------------------------------------------------------------

---[FILE: SteamAPI.cs]---
Location: ShareX-develop/ShareX.Steam/SteamAPI.cs

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

using System.Runtime.InteropServices;

namespace ShareX.Steam
{
    internal static class SteamAPI
    {
        private const string LibraryName = "steam_api";

        /// <summary>
        /// Initialize the Steamworks SDK.
        /// </summary>
        [DllImport(LibraryName, EntryPoint = "SteamAPI_Init", CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool Init();

        /// <summary>
        /// SteamAPI_Shutdown should be called during process shutdown if possible.
        /// </summary>
        [DllImport(LibraryName, EntryPoint = "SteamAPI_Shutdown", CallingConvention = CallingConvention.Cdecl)]
        public static extern void Shutdown();

        /// <summary>
        /// SteamAPI_IsSteamRunning() returns true if Steam is currently running.
        /// </summary>
        [DllImport(LibraryName, EntryPoint = "SteamAPI_IsSteamRunning", CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool IsSteamRunning();
    }
}
```

--------------------------------------------------------------------------------

---[FILE: steam_appid.txt]---
Location: ShareX-develop/ShareX.Steam/steam_appid.txt

```text
400040
```

--------------------------------------------------------------------------------

````
