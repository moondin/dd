---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 349
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 349 of 650)

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

---[FILE: NameParserEditor.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UITypeEditors/NameParserEditor.cs

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
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Design;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public class NameParserEditor : UITypeEditor
    {
        public override UITypeEditorEditStyle GetEditStyle(ITypeDescriptorContext context)
        {
            return UITypeEditorEditStyle.Modal;
        }

        public override object EditValue(ITypeDescriptorContext context, IServiceProvider provider, object value)
        {
            Point pos = Cursor.Position;
            CodeMenu.Create<CodeMenuEntryFilename>(null, CodeMenuEntryFilename.t, CodeMenuEntryFilename.pn).Show(pos.X, pos.Y);
            return value;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: StringCollectionToStringTypeConverter.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UITypeEditors/StringCollectionToStringTypeConverter.cs

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
using System.ComponentModel;
using System.Globalization;

namespace ShareX.HelpersLib
{
    public class StringCollectionToStringTypeConverter : TypeConverter
    {
        public override object ConvertTo(ITypeDescriptorContext context, CultureInfo culture, object value, Type destinationType)
        {
            if (destinationType == typeof(string))
            {
                List<string> list = (List<string>)value;
                return string.Join(", ", list);
            }

            return base.ConvertTo(context, culture, value, destinationType);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: WavFileNameEditor.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UITypeEditors/WavFileNameEditor.cs

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
using System;
using System.ComponentModel;
using System.Windows.Forms;
using System.Windows.Forms.Design;

namespace ShareX.HelpersLib
{
    public class WavFileNameEditor : FileNameEditor
    {
        public override object EditValue(ITypeDescriptorContext context, IServiceProvider provider, object value)
        {
            if (context == null || provider == null)
            {
                return base.EditValue(context, provider, value);
            }
            using (OpenFileDialog dlg = new OpenFileDialog())
            {
                dlg.Title = Resources.WavFileNameEditor_EditValue_Browse_for_a_sound_file___;
                dlg.Filter = "Sound file (*.wav)|*.wav";
                if (dlg.ShowDialog() == DialogResult.OK)
                {
                    value = dlg.FileName;
                }
            }
            return value;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: AppVeyor.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UpdateChecker/AppVeyor.cs

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
using System.Threading.Tasks;

namespace ShareX.HelpersLib
{
    public class AppVeyor
    {
        public string AccountName { get; set; }
        public string ProjectSlug { get; set; }

        private const string APIURL = "https://ci.appveyor.com/api";

        public async Task<AppVeyorProject> GetProjectByBranch(string branch = "master")
        {
            string url = $"{APIURL}/projects/{AccountName}/{ProjectSlug}/branch/{branch}";
            string response = await WebHelpers.DownloadStringAsync(url);

            if (!string.IsNullOrEmpty(response))
            {
                return JsonConvert.DeserializeObject<AppVeyorProject>(response);
            }

            return null;
        }

        public async Task<AppVeyorProjectArtifact[]> GetArtifacts(string jobId)
        {
            string url = $"{APIURL}/buildjobs/{jobId}/artifacts";
            string response = await WebHelpers.DownloadStringAsync(url);

            if (!string.IsNullOrEmpty(response))
            {
                return JsonConvert.DeserializeObject<AppVeyorProjectArtifact[]>(response);
            }

            return null;
        }

        public string GetArtifactDownloadURL(string jobId, string fileName)
        {
            return $"{APIURL}/buildjobs/{jobId}/artifacts/{fileName}";
        }
    }

    public class AppVeyorProject
    {
        public AppVeyorProjectInfo project { get; set; }
        public AppVeyorProjectBuild build { get; set; }
    }

    public class AppVeyorProjectInfo
    {
    }

    public class AppVeyorProjectBuild
    {
        public AppVeyorProjectJob[] jobs { get; set; }
        public string version { get; set; }
        public string status { get; set; }
    }

    public class AppVeyorProjectJob
    {
        public string jobId { get; set; }
        public string name { get; set; }
        public string osType { get; set; }
        public string status { get; set; }
    }

    public class AppVeyorProjectArtifact
    {
        public string fileName { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public long size { get; set; }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: AppVeyorUpdateChecker.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UpdateChecker/AppVeyorUpdateChecker.cs

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
using System.Linq;
using System.Threading.Tasks;

namespace ShareX.HelpersLib
{
    public class AppVeyorUpdateChecker : UpdateChecker
    {
        public string Branch { get; set; } = "master";

        public override async Task CheckUpdateAsync()
        {
            try
            {
                AppVeyor appveyor = new AppVeyor()
                {
                    AccountName = "ShareX",
                    ProjectSlug = "sharex"
                };

                AppVeyorProject project = await appveyor.GetProjectByBranch(Branch);

                if (!project.build.status.Equals("success", StringComparison.OrdinalIgnoreCase) &&
                    !project.build.status.Equals("running", StringComparison.OrdinalIgnoreCase))
                {
                    throw new Exception("Latest project build is not successful.");
                }

                AppVeyorProjectJob job = project.build.jobs.FirstOrDefault(x =>
                    x.name.Equals("Configuration: Release", StringComparison.OrdinalIgnoreCase) &&
                    x.osType.Equals("Windows", StringComparison.OrdinalIgnoreCase) &&
                    x.status.Equals("success", StringComparison.OrdinalIgnoreCase));

                if (job == null)
                {
                    throw new Exception("Unable to find successful release build.");
                }

                AppVeyorProjectArtifact[] artifacts = await appveyor.GetArtifacts(job.jobId);

                string deploymentName;

                if (IsPortable)
                {
                    deploymentName = "Portable";
                }
                else
                {
                    deploymentName = "Setup";
                }

                AppVeyorProjectArtifact artifact = artifacts.FirstOrDefault(x => x.name.Equals(deploymentName, StringComparison.OrdinalIgnoreCase));

                if (artifact == null)
                {
                    throw new Exception($"Unable to find \"{deploymentName}\" file.");
                }

                FileName = artifact.fileName;
                DownloadURL = appveyor.GetArtifactDownloadURL(job.jobId, artifact.fileName);
                if (Version.TryParse(project.build.version, out Version version))
                {
                    LatestVersion = version;
                }
                RefreshStatus();
                Status = UpdateStatus.UpdateAvailable;
                return;
            }
            catch (Exception e)
            {
                e.ShowError();
            }

            Status = UpdateStatus.UpdateCheckFailed;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: DownloaderForm.ar-YE.resx]---
Location: ShareX-develop/ShareX.HelpersLib/UpdateChecker/DownloaderForm.ar-YE.resx

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
  <data name="btnAction.Text" xml:space="preserve">
    <value>تنزيل</value>
  </data>
  <data name="lblFilename.Text" xml:space="preserve">
    <value>اسم الملف:</value>
  </data>
  <data name="lblProgress.Text" xml:space="preserve">
    <value>التقدّم:</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - منزّل الملفات</value>
  </data>
  <data name="lblStatus.Text" xml:space="preserve">
    <value>الحالة:</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: DownloaderForm.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UpdateChecker/DownloaderForm.cs

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
using System;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public partial class DownloaderForm : Form
    {
        public delegate void DownloaderInstallEventHandler(string filePath);
        public event DownloaderInstallEventHandler InstallRequested;

        public string URL { get; set; }
        public string FileName { get; set; }
        public string DownloadLocation { get; private set; }
        public string AcceptHeader { get; set; }
        public bool AutoStartDownload { get; set; }
        public InstallType InstallType { get; set; }
        public bool AutoStartInstall { get; set; }
        public DownloaderFormStatus Status { get; private set; }
        public bool RunInstallerInBackground { get; set; }

        private FileDownloader fileDownloader;

        private DownloaderForm()
        {
            InitializeComponent();
            ShareXResources.ApplyTheme(this);

            ChangeStatus(Resources.DownloaderForm_DownloaderForm_Waiting_);
            Status = DownloaderFormStatus.Waiting;
            AutoStartDownload = true;
            InstallType = InstallType.Silent;
            AutoStartInstall = true;
            RunInstallerInBackground = true;
        }

        public DownloaderForm(string url, string fileName) : this()
        {
            URL = url;
            FileName = fileName;
            lblFilename.Text = Helpers.SafeStringFormat(Resources.DownloaderForm_DownloaderForm_Filename___0_, FileName);
        }

        public DownloaderForm(UpdateChecker updateChecker) : this(updateChecker.DownloadURL, updateChecker.FileName)
        {
            if (updateChecker is GitHubUpdateChecker)
            {
                AcceptHeader = "application/octet-stream";
            }
        }

        private async void DownloaderForm_Shown(object sender, EventArgs e)
        {
            if (AutoStartDownload)
            {
                await StartDownload();
            }
        }

        private async void btnAction_MouseClick(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                if (Status == DownloaderFormStatus.Waiting)
                {
                    await StartDownload();
                }
                else if (Status == DownloaderFormStatus.DownloadCompleted)
                {
                    DialogResult = DialogResult.OK;
                    Install();
                }
                else
                {
                    DialogResult = DialogResult.Cancel;
                    Close();
                }
            }
        }

        public void Install()
        {
            if (Status == DownloaderFormStatus.DownloadCompleted)
            {
                Status = DownloaderFormStatus.InstallStarted;
                btnAction.Enabled = false;
                RunInstallerWithDelay();
                Close();
            }
        }

        // This function will give time for ShareX to close so installer won't tell ShareX is already running
        private void RunInstallerWithDelay(int delay = 1000)
        {
            if (RunInstallerInBackground)
            {
                Thread thread = new Thread(() =>
                {
                    Thread.Sleep(delay);
                    RunInstaller();
                });

                thread.Start();
            }
            else
            {
                Hide();
                RunInstaller();
            }
        }

        private void RunInstaller()
        {
            if (InstallType == InstallType.Event)
            {
                OnInstallRequested();
            }
            else
            {
                try
                {
                    using (Process process = new Process())
                    {
                        ProcessStartInfo psi = new ProcessStartInfo()
                        {
                            FileName = DownloadLocation,
                            Arguments = "/UPDATE",
                            UseShellExecute = true
                        };

                        if (InstallType == InstallType.Silent)
                        {
                            psi.Arguments += " /SILENT";
                        }
                        else if (InstallType == InstallType.VerySilent)
                        {
                            psi.Arguments += " /VERYSILENT";
                        }

                        if (Helpers.IsDefaultInstallDir() && !Helpers.IsMemberOfAdministratorsGroup())
                        {
                            psi.Verb = "runas";
                        }

                        process.StartInfo = psi;
                        process.Start();
                    }
                }
                catch
                {
                }
            }
        }

        protected void OnInstallRequested()
        {
            if (InstallRequested != null)
            {
                DialogResult = DialogResult.OK;
                InstallRequested(DownloadLocation);
            }
        }

        private void ChangeStatus(string status)
        {
            lblStatus.Text = Helpers.SafeStringFormat(Resources.DownloaderForm_ChangeStatus_Status___0_, status);
        }

        private async Task StartDownload()
        {
            if (!string.IsNullOrEmpty(URL) && Status == DownloaderFormStatus.Waiting)
            {
                Status = DownloaderFormStatus.DownloadStarted;
                btnAction.Text = Resources.DownloaderForm_StartDownload_Cancel;

                string folderPath = Path.Combine(Path.GetTempPath(), "ShareX");
                FileHelpers.CreateDirectory(folderPath);
                DownloadLocation = Path.Combine(folderPath, FileName);

                DebugHelper.WriteLine($"Downloading: \"{URL}\" -> \"{DownloadLocation}\"");

                fileDownloader = new FileDownloader(URL, DownloadLocation);
                fileDownloader.AcceptHeader = AcceptHeader;
                fileDownloader.FileSizeReceived += FileDownloader_FileSizeReceived;
                fileDownloader.ProgressChanged += FileDownloader_ProgressChanged;

                ChangeStatus(Resources.DownloaderForm_StartDownload_Getting_file_size_);

                try
                {
                    bool downloadStatus = await fileDownloader.StartDownload();

                    if (downloadStatus)
                    {
                        ChangeStatus(Resources.DownloaderForm_fileDownloader_DownloadCompleted_Download_completed_);
                        Status = DownloaderFormStatus.DownloadCompleted;
                        btnAction.Text = Resources.DownloaderForm_fileDownloader_DownloadCompleted_Install;

                        if (AutoStartInstall)
                        {
                            Install();
                        }
                    }
                }
                catch (Exception e)
                {
                    ChangeStatus(e.Message);
                }
            }
        }

        private void FileDownloader_FileSizeReceived()
        {
            ChangeStatus(Resources.DownloaderForm_StartDownload_Downloading_);

            FileDownloader_ProgressChanged();
        }

        private void FileDownloader_ProgressChanged()
        {
            if (fileDownloader != null)
            {
                pbProgress.Value = (int)Math.Round(fileDownloader.DownloadPercentage);

                lblProgress.Text = $@"{Resources.DownloaderForm_FileDownloader_ProgressChanged_Progress}: {fileDownloader.DownloadPercentage:0.0}%
{Resources.DownloaderForm_FileDownloader_ProgressChanged_DownloadSpeed}: {((long)fileDownloader.DownloadSpeed).ToSizeString()}/s
{Resources.DownloaderForm_FileDownloader_ProgressChanged_FileSize}: {fileDownloader.DownloadedSize.ToSizeString()} / {fileDownloader.FileSize.ToSizeString()}";
            }
        }

        private void DownloaderForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (Status == DownloaderFormStatus.DownloadStarted && fileDownloader != null)
            {
                fileDownloader.StopDownload();
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: DownloaderForm.de.resx]---
Location: ShareX-develop/ShareX.HelpersLib/UpdateChecker/DownloaderForm.de.resx

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
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - Dateidownloader</value>
  </data>
  <data name="btnAction.Text" xml:space="preserve">
    <value>Herunterladen</value>
  </data>
  <data name="lblFilename.Text" xml:space="preserve">
    <value>Dateiname:</value>
  </data>
  <data name="lblProgress.Text" xml:space="preserve">
    <value>Fortschritt:</value>
  </data>
  <data name="lblStatus.Text" xml:space="preserve">
    <value>Status:</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: DownloaderForm.Designer.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UpdateChecker/DownloaderForm.Designer.cs

```csharp
namespace ShareX.HelpersLib
{
    partial class DownloaderForm
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

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(DownloaderForm));
            this.lblProgress = new System.Windows.Forms.Label();
            this.lblStatus = new System.Windows.Forms.Label();
            this.lblFilename = new System.Windows.Forms.Label();
            this.btnAction = new System.Windows.Forms.Button();
            this.pbProgress = new ShareX.HelpersLib.BlackStyleProgressBar();
            this.SuspendLayout();
            // 
            // lblProgress
            // 
            resources.ApplyResources(this.lblProgress, "lblProgress");
            this.lblProgress.Name = "lblProgress";
            // 
            // lblStatus
            // 
            resources.ApplyResources(this.lblStatus, "lblStatus");
            this.lblStatus.Name = "lblStatus";
            // 
            // lblFilename
            // 
            resources.ApplyResources(this.lblFilename, "lblFilename");
            this.lblFilename.Name = "lblFilename";
            // 
            // btnAction
            // 
            resources.ApplyResources(this.btnAction, "btnAction");
            this.btnAction.Name = "btnAction";
            this.btnAction.UseVisualStyleBackColor = true;
            this.btnAction.MouseClick += new System.Windows.Forms.MouseEventHandler(this.btnAction_MouseClick);
            // 
            // pbProgress
            // 
            resources.ApplyResources(this.pbProgress, "pbProgress");
            this.pbProgress.Name = "pbProgress";
            // 
            // DownloaderForm
            // 
            resources.ApplyResources(this, "$this");
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            this.BackColor = System.Drawing.SystemColors.Window;
            this.Controls.Add(this.lblProgress);
            this.Controls.Add(this.lblStatus);
            this.Controls.Add(this.lblFilename);
            this.Controls.Add(this.btnAction);
            this.Controls.Add(this.pbProgress);
            this.DoubleBuffered = true;
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.Name = "DownloaderForm";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.DownloaderForm_FormClosing);
            this.Shown += new System.EventHandler(this.DownloaderForm_Shown);
            this.ResumeLayout(false);

        }

        #endregion
        private BlackStyleProgressBar pbProgress;
        private System.Windows.Forms.Button btnAction;
        private System.Windows.Forms.Label lblFilename;
        private System.Windows.Forms.Label lblStatus;
        private System.Windows.Forms.Label lblProgress;
    }
}
```

--------------------------------------------------------------------------------

````
