---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 354
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 354 of 650)

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

---[FILE: GitHubUpdateChecker.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UpdateChecker/GitHubUpdateChecker.cs

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

using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShareX.HelpersLib
{
    public class GitHubUpdateChecker : UpdateChecker
    {
        public string Owner { get; private set; }
        public string Repo { get; private set; }
        public bool IncludePreRelease { get; set; }
        public bool IsPreRelease { get; protected set; }

        private const string APIURL = "https://api.github.com";

        private string ReleasesURL => $"{APIURL}/repos/{Owner}/{Repo}/releases";
        private string LatestReleaseURL => $"{ReleasesURL}/latest";

        public GitHubUpdateChecker(string owner, string repo)
        {
            Owner = owner;
            Repo = repo;
        }

        public override async Task CheckUpdateAsync()
        {
            try
            {
                GitHubRelease latestRelease = await GetLatestRelease(IncludePreRelease);

                if (UpdateReleaseInfo(latestRelease, IsPortable, IsPortable))
                {
                    RefreshStatus();
                    return;
                }
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e, "GitHub update check failed.");
            }

            Status = UpdateStatus.UpdateCheckFailed;
        }

        public virtual async Task<string> GetLatestDownloadURL(bool isBrowserDownloadURL)
        {
            try
            {
                GitHubRelease latestRelease = await GetLatestRelease(IncludePreRelease);

                if (UpdateReleaseInfo(latestRelease, IsPortable, isBrowserDownloadURL))
                {
                    return DownloadURL;
                }
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
            }

            return null;
        }

        protected async Task<List<GitHubRelease>> GetReleases()
        {
            List<GitHubRelease> releases = null;

            string response = await WebHelpers.DownloadStringAsync(ReleasesURL);

            if (!string.IsNullOrEmpty(response))
            {
                releases = JsonConvert.DeserializeObject<List<GitHubRelease>>(response);

                if (releases != null && releases.Count > 0)
                {
                    releases.Sort((x, y) => y.published_at.CompareTo(x.published_at));
                }
            }

            return releases;
        }

        protected async Task<GitHubRelease> GetLatestRelease()
        {
            GitHubRelease latestRelease = null;

            string response = await WebHelpers.DownloadStringAsync(LatestReleaseURL);

            if (!string.IsNullOrEmpty(response))
            {
                latestRelease = JsonConvert.DeserializeObject<GitHubRelease>(response);
            }

            return latestRelease;
        }

        protected async Task<GitHubRelease> GetLatestRelease(bool includePreRelease)
        {
            GitHubRelease latestRelease = null;

            if (includePreRelease)
            {
                List<GitHubRelease> releases = await GetReleases();

                if (releases != null && releases.Count > 0)
                {
                    latestRelease = releases[0];
                }
            }
            else
            {
                latestRelease = await GetLatestRelease();
            }

            return latestRelease;
        }

        protected virtual bool UpdateReleaseInfo(GitHubRelease release, bool isPortable, bool isBrowserDownloadURL)
        {
            if (release != null && !string.IsNullOrEmpty(release.tag_name) && release.tag_name.Length > 1 && release.tag_name[0] == 'v')
            {
                LatestVersion = new Version(release.tag_name.Substring(1));

                if (release.assets != null && release.assets.Length > 0)
                {
                    string endsWith;

                    if (isPortable)
                    {
                        endsWith = "portable.zip";
                    }
                    else
                    {
                        endsWith = ".exe";
                    }

                    foreach (GitHubAsset asset in release.assets)
                    {
                        if (asset != null && !string.IsNullOrEmpty(asset.name) && asset.name.EndsWith(endsWith, StringComparison.OrdinalIgnoreCase))
                        {
                            FileName = asset.name;

                            if (isBrowserDownloadURL)
                            {
                                DownloadURL = asset.browser_download_url;
                            }
                            else
                            {
                                DownloadURL = asset.url;
                            }

                            IsPreRelease = release.prerelease;

                            return true;
                        }
                    }
                }
            }

            return false;
        }

        protected class GitHubRelease
        {
            public string url { get; set; }
            public string assets_url { get; set; }
            public string upload_url { get; set; }
            public string html_url { get; set; }
            public long id { get; set; }
            //public GitHubAuthor author { get; set; }
            public string node_id { get; set; }
            public string tag_name { get; set; }
            public string target_commitish { get; set; }
            public string name { get; set; }
            public bool draft { get; set; }
            public bool prerelease { get; set; }
            public DateTime created_at { get; set; }
            public DateTime published_at { get; set; }
            public GitHubAsset[] assets { get; set; }
            public string tarball_url { get; set; }
            public string zipball_url { get; set; }
            public string body { get; set; }
            //public GitHubReactions reactions { get; set; }
        }

        protected class GitHubAsset
        {
            public string url { get; set; }
            public long id { get; set; }
            public string node_id { get; set; }
            public string name { get; set; }
            public string label { get; set; }
            //public GitHubUploader uploader { get; set; }
            public string content_type { get; set; }
            public string state { get; set; }
            public long size { get; set; }
            public long download_count { get; set; }
            public DateTime created_at { get; set; }
            public DateTime updated_at { get; set; }
            public string browser_download_url { get; set; }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: GitHubUpdateManager.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UpdateChecker/GitHubUpdateManager.cs

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
using System.Threading.Tasks;
using System.Windows.Forms;
using Timer = System.Threading.Timer;

namespace ShareX.HelpersLib
{
    public class GitHubUpdateManager : IDisposable
    {
        public bool AllowAutoUpdate { get; set; } // ConfigureAutoUpdate function must be called after change this
        public bool AutoUpdateEnabled { get; set; } = true;
        public TimeSpan UpdateCheckInterval { get; private set; } = TimeSpan.FromHours(1);
        public string GitHubOwner { get; set; }
        public string GitHubRepo { get; set; }
        public bool IsPortable { get; set; } // If current build is portable then download URL will be opened in browser instead of downloading it
        public bool CheckPreReleaseUpdates { get; set; }

        private bool firstUpdateCheck = true;
        private Timer updateTimer = null;
        private readonly object updateTimerLock = new object();

        public GitHubUpdateManager()
        {
        }

        public GitHubUpdateManager(string owner, string repo, bool portable = false)
        {
            GitHubOwner = owner;
            GitHubRepo = repo;
            IsPortable = portable;
        }

        public void ConfigureAutoUpdate()
        {
            lock (updateTimerLock)
            {
                if (AllowAutoUpdate)
                {
                    if (updateTimer == null)
                    {
                        updateTimer = new Timer(TimerCallback, null, TimeSpan.Zero, UpdateCheckInterval);
                    }
                }
                else
                {
                    Dispose();
                }
            }
        }

        private async void TimerCallback(object state)
        {
            await CheckUpdate();
        }

        private async Task CheckUpdate()
        {
            if (AutoUpdateEnabled && !UpdateMessageBox.IsOpen)
            {
                UpdateChecker updateChecker = CreateUpdateChecker();
                await updateChecker.CheckUpdateAsync();

                if (UpdateMessageBox.Start(updateChecker, firstUpdateCheck) == DialogResult.No)
                {
                    AutoUpdateEnabled = false;
                }

                firstUpdateCheck = false;
            }
        }

        public virtual GitHubUpdateChecker CreateUpdateChecker()
        {
            return new GitHubUpdateChecker(GitHubOwner, GitHubRepo)
            {
                IsPortable = IsPortable,
                IncludePreRelease = CheckPreReleaseUpdates
            };
        }

        public void Dispose()
        {
            if (updateTimer != null)
            {
                updateTimer.Dispose();
                updateTimer = null;
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: UpdateChecker.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UpdateChecker/UpdateChecker.cs

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
using System.Threading.Tasks;
using System.Web;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public abstract class UpdateChecker
    {
        /// <summary>For testing purposes.</summary>
        public static bool ForceUpdate { get; private set; } = false;

        public UpdateStatus Status { get; set; }
        public Version CurrentVersion { get; set; }
        public Version LatestVersion { get; set; }
        public ReleaseChannelType ReleaseType { get; set; }
        public bool IsDev { get; set; }
        public bool IsPortable { get; set; }
        public bool IgnoreRevision { get; set; }

        private string fileName;

        public string FileName
        {
            get
            {
                if (string.IsNullOrEmpty(fileName))
                {
                    return HttpUtility.UrlDecode(DownloadURL.Substring(DownloadURL.LastIndexOf('/') + 1));
                }

                return fileName;
            }
            set
            {
                fileName = value;
            }
        }

        public string DownloadURL { get; set; }

        public void RefreshStatus()
        {
            if (CurrentVersion == null)
            {
                CurrentVersion = Version.Parse(Application.ProductVersion);
            }

            if (Status != UpdateStatus.UpdateCheckFailed && CurrentVersion != null && LatestVersion != null && !string.IsNullOrEmpty(DownloadURL) &&
                (ForceUpdate || Helpers.CompareVersion(CurrentVersion, LatestVersion, IgnoreRevision) < 0))
            {
                Status = UpdateStatus.UpdateAvailable;
            }
            else
            {
                Status = UpdateStatus.UpToDate;
            }
        }

        public abstract Task CheckUpdateAsync();

        public void DownloadUpdate()
        {
            DebugHelper.WriteLine("Updating ShareX from version {0} to {1}", CurrentVersion, LatestVersion);

            if (IsPortable)
            {
                URLHelpers.OpenURL(DownloadURL);
            }
            else
            {
                using (DownloaderForm updaterForm = new DownloaderForm(this))
                {
                    updaterForm.ShowDialog();

                    if (updaterForm.Status == DownloaderFormStatus.InstallStarted)
                    {
                        Application.Exit();
                    }
                }
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: UpdateCheckerLabel.ar-YE.resx]---
Location: ShareX-develop/ShareX.HelpersLib/UpdateChecker/UpdateCheckerLabel.ar-YE.resx

```text
<?xml version="1.0" encoding="utf-8"?>
<root>
  <!-- 
    Microsoft ResX Schema 
    
    Version 2.0
    
    The primary goals of this format is to allow a simple XML format 
    that is mostly human readable. The generation and parsing of the 
    various data types are done through the TypeConverter classes 
    associated with the data types.
    
    Example:
    
    ... ado.net/XML headers & schema ...
    <resheader name="resmimetype">text/microsoft-resx</resheader>
    <resheader name="version">2.0</resheader>
    <resheader name="reader">System.Resources.ResXResourceReader, System.Windows.Forms, ...</resheader>
    <resheader name="writer">System.Resources.ResXResourceWriter, System.Windows.Forms, ...</resheader>
    <data name="Name1"><value>this is my long string</value><comment>this is a comment</comment></data>
    <data name="Color1" type="System.Drawing.Color, System.Drawing">Blue</data>
    <data name="Bitmap1" mimetype="application/x-microsoft.net.object.binary.base64">
        <value>[base64 mime encoded serialized .NET Framework object]</value>
    </data>
    <data name="Icon1" type="System.Drawing.Icon, System.Drawing" mimetype="application/x-microsoft.net.object.bytearray.base64">
        <value>[base64 mime encoded string representing a byte array form of the .NET Framework object]</value>
        <comment>This is a comment</comment>
    </data>
                
    There are any number of "resheader" rows that contain simple 
    name/value pairs.
    
    Each data row contains a name, and value. The row also contains a 
    type or mimetype. Type corresponds to a .NET class that support 
    text/value conversion through the TypeConverter architecture. 
    Classes that don't support this are serialized and stored with the 
    mimetype set.
    
    The mimetype is used for serialized objects, and tells the 
    ResXResourceReader how to depersist the object. This is currently not 
    extensible. For a given mimetype the value must be set accordingly:
    
    Note - application/x-microsoft.net.object.binary.base64 is the format 
    that the ResXResourceWriter will generate, however the reader can 
    read any of the formats listed below.
    
    mimetype: application/x-microsoft.net.object.binary.base64
    value   : The object must be serialized with 
            : System.Runtime.Serialization.Formatters.Binary.BinaryFormatter
            : and then encoded with base64 encoding.
    
    mimetype: application/x-microsoft.net.object.soap.base64
    value   : The object must be serialized with 
            : System.Runtime.Serialization.Formatters.Soap.SoapFormatter
            : and then encoded with base64 encoding.

    mimetype: application/x-microsoft.net.object.bytearray.base64
    value   : The object must be serialized into a byte array 
            : using a System.ComponentModel.TypeConverter
            : and then encoded with base64 encoding.
    -->
  <xsd:schema id="root" xmlns="" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xsd:import namespace="http://www.w3.org/XML/1998/namespace" />
    <xsd:element name="root" msdata:IsDataSet="true">
      <xsd:complexType>
        <xsd:choice maxOccurs="unbounded">
          <xsd:element name="metadata">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element name="value" type="xsd:string" minOccurs="0" />
              </xsd:sequence>
              <xsd:attribute name="name" use="required" type="xsd:string" />
              <xsd:attribute name="type" type="xsd:string" />
              <xsd:attribute name="mimetype" type="xsd:string" />
              <xsd:attribute ref="xml:space" />
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="assembly">
            <xsd:complexType>
              <xsd:attribute name="alias" type="xsd:string" />
              <xsd:attribute name="name" type="xsd:string" />
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="data">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element name="value" type="xsd:string" minOccurs="0" msdata:Ordinal="1" />
                <xsd:element name="comment" type="xsd:string" minOccurs="0" msdata:Ordinal="2" />
              </xsd:sequence>
              <xsd:attribute name="name" type="xsd:string" use="required" msdata:Ordinal="1" />
              <xsd:attribute name="type" type="xsd:string" msdata:Ordinal="3" />
              <xsd:attribute name="mimetype" type="xsd:string" msdata:Ordinal="4" />
              <xsd:attribute ref="xml:space" />
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="resheader">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element name="value" type="xsd:string" minOccurs="0" msdata:Ordinal="1" />
              </xsd:sequence>
              <xsd:attribute name="name" type="xsd:string" use="required" />
            </xsd:complexType>
          </xsd:element>
        </xsd:choice>
      </xsd:complexType>
    </xsd:element>
  </xsd:schema>
  <resheader name="resmimetype">
    <value>text/microsoft-resx</value>
  </resheader>
  <resheader name="version">
    <value>2.0</value>
  </resheader>
  <resheader name="reader">
    <value>System.Resources.ResXResourceReader, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value>
  </resheader>
  <resheader name="writer">
    <value>System.Resources.ResXResourceWriter, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value>
  </resheader>
  <data name="lblStatus.Text" xml:space="preserve">
    <value>... محدث بالفعل</value>
  </data>
  <data name="lblCheckingUpdates.Text" xml:space="preserve">
    <value>بحث عن تحديثات...</value>
  </data>
  <data name="llblUpdateAvailable.Text" xml:space="preserve">
    <value>إصدار جديد من البرنامج أصبح متاحًا</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: UpdateCheckerLabel.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UpdateChecker/UpdateCheckerLabel.cs

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
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public partial class UpdateCheckerLabel : UserControl
    {
        public bool IsBusy { get; private set; }

        private UpdateChecker updateChecker;

        public UpdateCheckerLabel()
        {
            InitializeComponent();
        }

        public async Task CheckUpdate(UpdateChecker updateChecker)
        {
            if (!IsBusy)
            {
                IsBusy = true;

                this.updateChecker = updateChecker;

                lblStatus.Visible = false;
                llblUpdateAvailable.Visible = false;

                pbLoading.Visible = true;
                lblCheckingUpdates.Visible = true;

                await CheckingUpdate();
            }
        }

        public void UpdateLoadingImage()
        {
            if (ShareXResources.IsDarkTheme)
            {
                pbLoading.Image = Resources.LoadingSmallWhite;
            }
            else
            {
                pbLoading.Image = Resources.LoadingSmallBlack;
            }
        }

        private async Task CheckingUpdate()
        {
            await updateChecker.CheckUpdateAsync();

            try
            {
                UpdateControls();
            }
            catch
            {
            }

            IsBusy = false;
        }

        private void UpdateControls()
        {
            this.InvokeSafe(() =>
            {
                pbLoading.Visible = false;
                lblCheckingUpdates.Visible = false;

                switch (updateChecker.Status)
                {
                    case UpdateStatus.UpdateCheckFailed:
                        lblStatus.Text = Resources.UpdateCheckerLabel_UpdateControls_Update_check_failed;
                        lblStatus.Visible = true;
                        break;
                    case UpdateStatus.UpdateAvailable:
                        llblUpdateAvailable.Text = string.Format(Resources.UpdateCheckerLabel_UpdateControls_A_newer_version_of_ShareX_is_available, Application.ProductName);
                        llblUpdateAvailable.Visible = true;
                        break;
                    case UpdateStatus.UpToDate:
                        lblStatus.Text = string.Format(Resources.UpdateCheckerLabel_UpdateControls_ShareX_is_up_to_date, Application.ProductName);
                        lblStatus.Visible = true;
                        break;
                }
            });
        }

        private void llblUpdateAvailable_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            UpdateMessageBox.Start(updateChecker);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: UpdateCheckerLabel.de.resx]---
Location: ShareX-develop/ShareX.HelpersLib/UpdateChecker/UpdateCheckerLabel.de.resx

```text
<?xml version="1.0" encoding="utf-8"?>
<root>
  <!-- 
    Microsoft ResX Schema 
    
    Version 2.0
    
    The primary goals of this format is to allow a simple XML format 
    that is mostly human readable. The generation and parsing of the 
    various data types are done through the TypeConverter classes 
    associated with the data types.
    
    Example:
    
    ... ado.net/XML headers & schema ...
    <resheader name="resmimetype">text/microsoft-resx</resheader>
    <resheader name="version">2.0</resheader>
    <resheader name="reader">System.Resources.ResXResourceReader, System.Windows.Forms, ...</resheader>
    <resheader name="writer">System.Resources.ResXResourceWriter, System.Windows.Forms, ...</resheader>
    <data name="Name1"><value>this is my long string</value><comment>this is a comment</comment></data>
    <data name="Color1" type="System.Drawing.Color, System.Drawing">Blue</data>
    <data name="Bitmap1" mimetype="application/x-microsoft.net.object.binary.base64">
        <value>[base64 mime encoded serialized .NET Framework object]</value>
    </data>
    <data name="Icon1" type="System.Drawing.Icon, System.Drawing" mimetype="application/x-microsoft.net.object.bytearray.base64">
        <value>[base64 mime encoded string representing a byte array form of the .NET Framework object]</value>
        <comment>This is a comment</comment>
    </data>
                
    There are any number of "resheader" rows that contain simple 
    name/value pairs.
    
    Each data row contains a name, and value. The row also contains a 
    type or mimetype. Type corresponds to a .NET class that support 
    text/value conversion through the TypeConverter architecture. 
    Classes that don't support this are serialized and stored with the 
    mimetype set.
    
    The mimetype is used for serialized objects, and tells the 
    ResXResourceReader how to depersist the object. This is currently not 
    extensible. For a given mimetype the value must be set accordingly:
    
    Note - application/x-microsoft.net.object.binary.base64 is the format 
    that the ResXResourceWriter will generate, however the reader can 
    read any of the formats listed below.
    
    mimetype: application/x-microsoft.net.object.binary.base64
    value   : The object must be serialized with 
            : System.Runtime.Serialization.Formatters.Binary.BinaryFormatter
            : and then encoded with base64 encoding.
    
    mimetype: application/x-microsoft.net.object.soap.base64
    value   : The object must be serialized with 
            : System.Runtime.Serialization.Formatters.Soap.SoapFormatter
            : and then encoded with base64 encoding.

    mimetype: application/x-microsoft.net.object.bytearray.base64
    value   : The object must be serialized into a byte array 
            : using a System.ComponentModel.TypeConverter
            : and then encoded with base64 encoding.
    -->
  <xsd:schema id="root" xmlns="" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xsd:import namespace="http://www.w3.org/XML/1998/namespace" />
    <xsd:element name="root" msdata:IsDataSet="true">
      <xsd:complexType>
        <xsd:choice maxOccurs="unbounded">
          <xsd:element name="metadata">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element name="value" type="xsd:string" minOccurs="0" />
              </xsd:sequence>
              <xsd:attribute name="name" use="required" type="xsd:string" />
              <xsd:attribute name="type" type="xsd:string" />
              <xsd:attribute name="mimetype" type="xsd:string" />
              <xsd:attribute ref="xml:space" />
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="assembly">
            <xsd:complexType>
              <xsd:attribute name="alias" type="xsd:string" />
              <xsd:attribute name="name" type="xsd:string" />
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="data">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element name="value" type="xsd:string" minOccurs="0" msdata:Ordinal="1" />
                <xsd:element name="comment" type="xsd:string" minOccurs="0" msdata:Ordinal="2" />
              </xsd:sequence>
              <xsd:attribute name="name" type="xsd:string" use="required" msdata:Ordinal="1" />
              <xsd:attribute name="type" type="xsd:string" msdata:Ordinal="3" />
              <xsd:attribute name="mimetype" type="xsd:string" msdata:Ordinal="4" />
              <xsd:attribute ref="xml:space" />
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="resheader">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element name="value" type="xsd:string" minOccurs="0" msdata:Ordinal="1" />
              </xsd:sequence>
              <xsd:attribute name="name" type="xsd:string" use="required" />
            </xsd:complexType>
          </xsd:element>
        </xsd:choice>
      </xsd:complexType>
    </xsd:element>
  </xsd:schema>
  <resheader name="resmimetype">
    <value>text/microsoft-resx</value>
  </resheader>
  <resheader name="version">
    <value>2.0</value>
  </resheader>
  <resheader name="reader">
    <value>System.Resources.ResXResourceReader, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value>
  </resheader>
  <resheader name="writer">
    <value>System.Resources.ResXResourceWriter, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value>
  </resheader>
  <data name="lblCheckingUpdates.Text" xml:space="preserve">
    <value>Nach Aktualisierungen suchen...</value>
  </data>
  <data name="lblStatus.Text" xml:space="preserve">
    <value>... ist aktuell</value>
  </data>
  <data name="llblUpdateAvailable.Text" xml:space="preserve">
    <value>Eine neuere Version von ShareX ist verfügbar</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: UpdateCheckerLabel.Designer.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UpdateChecker/UpdateCheckerLabel.Designer.cs

```csharp
namespace ShareX.HelpersLib
{
    partial class UpdateCheckerLabel
    {
        /// <summary> 
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Component Designer generated code

        /// <summary> 
        /// Required method for Designer support - do not modify 
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(UpdateCheckerLabel));
            this.pbLoading = new System.Windows.Forms.PictureBox();
            this.lblCheckingUpdates = new System.Windows.Forms.Label();
            this.lblStatus = new System.Windows.Forms.Label();
            this.llblUpdateAvailable = new System.Windows.Forms.LinkLabel();
            ((System.ComponentModel.ISupportInitialize)(this.pbLoading)).BeginInit();
            this.SuspendLayout();
            // 
            // pbLoading
            // 
            this.pbLoading.Image = global::ShareX.HelpersLib.Properties.Resources.LoadingSmallBlack;
            resources.ApplyResources(this.pbLoading, "pbLoading");
            this.pbLoading.Name = "pbLoading";
            this.pbLoading.TabStop = false;
            // 
            // lblCheckingUpdates
            // 
            resources.ApplyResources(this.lblCheckingUpdates, "lblCheckingUpdates");
            this.lblCheckingUpdates.ForeColor = System.Drawing.SystemColors.ControlDarkDark;
            this.lblCheckingUpdates.Name = "lblCheckingUpdates";
            // 
            // lblStatus
            // 
            resources.ApplyResources(this.lblStatus, "lblStatus");
            this.lblStatus.ForeColor = System.Drawing.SystemColors.ControlDarkDark;
            this.lblStatus.Name = "lblStatus";
            // 
            // llblUpdateAvailable
            // 
            resources.ApplyResources(this.llblUpdateAvailable, "llblUpdateAvailable");
            this.llblUpdateAvailable.Name = "llblUpdateAvailable";
            this.llblUpdateAvailable.TabStop = true;
            this.llblUpdateAvailable.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.llblUpdateAvailable_LinkClicked);
            // 
            // UpdateCheckerLabel
            // 
            resources.ApplyResources(this, "$this");
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.llblUpdateAvailable);
            this.Controls.Add(this.lblStatus);
            this.Controls.Add(this.lblCheckingUpdates);
            this.Controls.Add(this.pbLoading);
            this.Name = "UpdateCheckerLabel";
            ((System.ComponentModel.ISupportInitialize)(this.pbLoading)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.PictureBox pbLoading;
        private System.Windows.Forms.Label lblCheckingUpdates;
        private System.Windows.Forms.Label lblStatus;
        private System.Windows.Forms.LinkLabel llblUpdateAvailable;
    }
}
```

--------------------------------------------------------------------------------

````
