---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 416
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 416 of 650)

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

---[FILE: IndexerXml.cs]---
Location: ShareX-develop/ShareX.IndexerLib/IndexerXml.cs

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
using System.IO;
using System.Text;
using System.Xml;

namespace ShareX.IndexerLib
{
    public class IndexerXml : Indexer
    {
        protected XmlWriter xmlWriter;

        public IndexerXml(IndexerSettings indexerSettings) : base(indexerSettings)
        {
        }

        public override string Index(string folderPath)
        {
            FolderInfo folderInfo = GetFolderInfo(folderPath);
            folderInfo.Update();

            XmlWriterSettings xmlWriterSettings = new XmlWriterSettings();
            xmlWriterSettings.Encoding = new UTF8Encoding(false);
            xmlWriterSettings.ConformanceLevel = ConformanceLevel.Document;
            xmlWriterSettings.Indent = true;

            using (MemoryStream ms = new MemoryStream())
            {
                using (xmlWriter = XmlWriter.Create(ms, xmlWriterSettings))
                {
                    xmlWriter.WriteStartDocument();
                    IndexFolder(folderInfo);
                    xmlWriter.WriteEndDocument();
                    xmlWriter.Flush();
                }

                return Encoding.UTF8.GetString(ms.ToArray());
            }
        }

        protected override void IndexFolder(FolderInfo dir, int level = 0)
        {
            xmlWriter.WriteStartElement("Folder");

            if (settings.UseAttribute)
            {
                xmlWriter.WriteAttributeString("Name", dir.FolderName);

                if (settings.ShowSizeInfo && !dir.IsEmpty)
                {
                    xmlWriter.WriteAttributeString("Size", dir.Size.ToSizeString(settings.BinaryUnits));
                }
            }
            else
            {
                xmlWriter.WriteElementString("Name", dir.FolderName);

                if (settings.ShowSizeInfo && !dir.IsEmpty)
                {
                    xmlWriter.WriteElementString("Size", dir.Size.ToSizeString(settings.BinaryUnits));
                }
            }

            if (dir.Files.Count > 0)
            {
                xmlWriter.WriteStartElement("Files");

                foreach (FileInfo fi in dir.Files)
                {
                    xmlWriter.WriteStartElement("File");

                    if (settings.UseAttribute)
                    {
                        xmlWriter.WriteAttributeString("Name", fi.Name);

                        if (settings.ShowSizeInfo)
                        {
                            xmlWriter.WriteAttributeString("Size", fi.Length.ToSizeString(settings.BinaryUnits));
                        }
                    }
                    else
                    {
                        xmlWriter.WriteElementString("Name", fi.Name);

                        if (settings.ShowSizeInfo)
                        {
                            xmlWriter.WriteElementString("Size", fi.Length.ToSizeString(settings.BinaryUnits));
                        }
                    }

                    xmlWriter.WriteEndElement();
                }

                xmlWriter.WriteEndElement();
            }

            if (dir.Folders.Count > 0)
            {
                xmlWriter.WriteStartElement("Folders");

                foreach (FolderInfo subdir in dir.Folders)
                {
                    IndexFolder(subdir);
                }

                xmlWriter.WriteEndElement();
            }

            xmlWriter.WriteEndElement();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ShareX.IndexerLib.csproj]---
Location: ShareX-develop/ShareX.IndexerLib/ShareX.IndexerLib.csproj

```text
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net9.0-windows</TargetFramework>
    <OutputType>Library</OutputType>
    <PlatformTarget>x64</PlatformTarget>
    <RuntimeIdentifier>win-x64</RuntimeIdentifier>
    <UseWindowsForms>true</UseWindowsForms>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Newtonsoft.Json" Version="13.0.4" />
  </ItemGroup>
  <ItemGroup>
    <ProjectReference Include="..\ShareX.HelpersLib\ShareX.HelpersLib.csproj" />
  </ItemGroup>
</Project>
```

--------------------------------------------------------------------------------

---[FILE: DirectoryIndexerForm.ar-YE.resx]---
Location: ShareX-develop/ShareX.IndexerLib/Forms/DirectoryIndexerForm.ar-YE.resx

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
  <data name="tpSettings.Text" xml:space="preserve">
    <value>الإعدادات</value>
  </data>
  <data name="tpPreview.Text" xml:space="preserve">
    <value>المعاينة</value>
  </data>
  <data name="btnSaveAs.Text" xml:space="preserve">
    <value>حفظ النتيجة وإغلاق النافذة...</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - مفهرس المجلدات</value>
  </data>
  <data name="btnUpload.Text" xml:space="preserve">
    <value>رفع النتيجة وإغلاق النافذة</value>
  </data>
  <data name="btnBrowseFolder.Text" xml:space="preserve">
    <value>تحديد المجلد...</value>
  </data>
  <data name="btnIndexFolder.Text" xml:space="preserve">
    <value>فهرسة المجلد المحدد</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: DirectoryIndexerForm.cs]---
Location: ShareX-develop/ShareX.IndexerLib/Forms/DirectoryIndexerForm.cs

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
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ShareX.IndexerLib
{
    public partial class DirectoryIndexerForm : Form
    {
        public delegate void UploadRequestedEventHandler(string source);
        public event UploadRequestedEventHandler UploadRequested;

        public IndexerSettings Settings { get; set; }
        public string Source { get; private set; }

        public DirectoryIndexerForm(IndexerSettings settings)
        {
            InitializeComponent();
            ShareXResources.ApplyTheme(this, true);

            Settings = settings;
            pgSettings.SelectedObject = Settings;
        }

        private async void DirectoryIndexerForm_Load(object sender, EventArgs e)
        {
            await BrowseFolder();
        }

        private async void btnBrowseFolder_Click(object sender, EventArgs e)
        {
            await BrowseFolder();
        }

        private async Task BrowseFolder()
        {
            if (FileHelpers.BrowseFolder(txtFolderPath))
            {
                await IndexFolder();
            }
        }

        private void txtFolderPath_TextChanged(object sender, EventArgs e)
        {
            btnIndexFolder.Enabled = txtFolderPath.TextLength > 0;
        }

        private async void btnIndexFolder_Click(object sender, EventArgs e)
        {
            await IndexFolder();
        }

        private async Task IndexFolder()
        {
            string folderPath = txtFolderPath.Text;

            if (!string.IsNullOrEmpty(folderPath) && Directory.Exists(folderPath))
            {
                btnIndexFolder.Enabled = false;
                btnUpload.Enabled = false;
                btnSaveAs.Enabled = false;

                await Task.Run(() =>
                {
                    Source = Indexer.Index(folderPath, Settings);
                });

                if (!IsDisposed)
                {
                    if (!string.IsNullOrEmpty(Source))
                    {
                        tcMain.SelectedTab = tpPreview;

                        if (Settings.Output == IndexerOutput.Html)
                        {
                            txtPreview.Visible = false;
                            wbPreview.Visible = true;
                            wbPreview.DocumentText = Source;
                        }
                        else
                        {
                            wbPreview.Visible = false;
                            txtPreview.Visible = true;
                            txtPreview.Text = Source;
                        }

                        btnUpload.Enabled = true;
                    }

                    btnIndexFolder.Enabled = true;
                    btnSaveAs.Enabled = true;
                }
            }
        }

        private void btnUpload_Click(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(Source))
            {
                OnUploadRequested(Source);
                Close();
            }
        }

        protected void OnUploadRequested(string source)
        {
            UploadRequested?.Invoke(source);
        }

        private void btnSaveAs_Click(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(Source))
            {
                using (SaveFileDialog sfd = new SaveFileDialog())
                {
                    string indexType = Settings.Output.ToString().ToLower();
                    sfd.FileName = "Index for " + Path.GetFileNameWithoutExtension(txtFolderPath.Text);
                    sfd.DefaultExt = indexType;
                    sfd.Filter = string.Format("*.{0}|*.{0}|All files (*.*)|*.*", indexType);

                    if (!string.IsNullOrEmpty(HelpersOptions.LastSaveDirectory) && Directory.Exists(HelpersOptions.LastSaveDirectory))
                    {
                        sfd.InitialDirectory = HelpersOptions.LastSaveDirectory;
                    }

                    if (sfd.ShowDialog() == DialogResult.OK)
                    {
                        File.WriteAllText(sfd.FileName, Source, Encoding.UTF8);
                        Close();
                    }
                }
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: DirectoryIndexerForm.de.resx]---
Location: ShareX-develop/ShareX.IndexerLib/Forms/DirectoryIndexerForm.de.resx

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
    <value>ShareX - Verzeichnisindizierer</value>
  </data>
  <data name="btnBrowseFolder.Text" xml:space="preserve">
    <value>Ordner durchsuchen...</value>
  </data>
  <data name="btnUpload.Text" xml:space="preserve">
    <value>Hochladen und dieses Fenster schließen</value>
  </data>
  <data name="tpPreview.Text" xml:space="preserve">
    <value>Vorschau</value>
  </data>
  <data name="tpSettings.Text" xml:space="preserve">
    <value>Einstellungen</value>
  </data>
  <data name="btnIndexFolder.Text" xml:space="preserve">
    <value>Ausgewählten Ordner indizieren</value>
  </data>
  <data name="btnSaveAs.Text" xml:space="preserve">
    <value>Speichern unter und dieses Fenster schließen...</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: DirectoryIndexerForm.Designer.cs]---
Location: ShareX-develop/ShareX.IndexerLib/Forms/DirectoryIndexerForm.Designer.cs

```csharp
namespace ShareX.IndexerLib
{
    partial class DirectoryIndexerForm
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(DirectoryIndexerForm));
            txtFolderPath = new System.Windows.Forms.TextBox();
            btnBrowseFolder = new System.Windows.Forms.Button();
            btnIndexFolder = new System.Windows.Forms.Button();
            btnUpload = new System.Windows.Forms.Button();
            tcMain = new System.Windows.Forms.TabControl();
            tpPreview = new System.Windows.Forms.TabPage();
            txtPreview = new System.Windows.Forms.TextBox();
            wbPreview = new System.Windows.Forms.WebBrowser();
            tpSettings = new System.Windows.Forms.TabPage();
            pgSettings = new System.Windows.Forms.PropertyGrid();
            btnSaveAs = new System.Windows.Forms.Button();
            tcMain.SuspendLayout();
            tpPreview.SuspendLayout();
            tpSettings.SuspendLayout();
            SuspendLayout();
            // 
            // txtFolderPath
            // 
            resources.ApplyResources(txtFolderPath, "txtFolderPath");
            txtFolderPath.Name = "txtFolderPath";
            txtFolderPath.TextChanged += txtFolderPath_TextChanged;
            // 
            // btnBrowseFolder
            // 
            resources.ApplyResources(btnBrowseFolder, "btnBrowseFolder");
            btnBrowseFolder.Name = "btnBrowseFolder";
            btnBrowseFolder.UseVisualStyleBackColor = true;
            btnBrowseFolder.Click += btnBrowseFolder_Click;
            // 
            // btnIndexFolder
            // 
            resources.ApplyResources(btnIndexFolder, "btnIndexFolder");
            btnIndexFolder.Name = "btnIndexFolder";
            btnIndexFolder.UseVisualStyleBackColor = true;
            btnIndexFolder.Click += btnIndexFolder_Click;
            // 
            // btnUpload
            // 
            resources.ApplyResources(btnUpload, "btnUpload");
            btnUpload.Name = "btnUpload";
            btnUpload.UseVisualStyleBackColor = true;
            btnUpload.Click += btnUpload_Click;
            // 
            // tcMain
            // 
            resources.ApplyResources(tcMain, "tcMain");
            tcMain.Controls.Add(tpPreview);
            tcMain.Controls.Add(tpSettings);
            tcMain.Name = "tcMain";
            tcMain.SelectedIndex = 0;
            // 
            // tpPreview
            // 
            tpPreview.BackColor = System.Drawing.SystemColors.Window;
            tpPreview.Controls.Add(txtPreview);
            tpPreview.Controls.Add(wbPreview);
            resources.ApplyResources(tpPreview, "tpPreview");
            tpPreview.Name = "tpPreview";
            // 
            // txtPreview
            // 
            txtPreview.BorderStyle = System.Windows.Forms.BorderStyle.None;
            resources.ApplyResources(txtPreview, "txtPreview");
            txtPreview.Name = "txtPreview";
            // 
            // wbPreview
            // 
            resources.ApplyResources(wbPreview, "wbPreview");
            wbPreview.Name = "wbPreview";
            // 
            // tpSettings
            // 
            tpSettings.BackColor = System.Drawing.SystemColors.Window;
            tpSettings.Controls.Add(pgSettings);
            resources.ApplyResources(tpSettings, "tpSettings");
            tpSettings.Name = "tpSettings";
            // 
            // pgSettings
            // 
            pgSettings.BackColor = System.Drawing.SystemColors.Window;
            resources.ApplyResources(pgSettings, "pgSettings");
            pgSettings.Name = "pgSettings";
            pgSettings.PropertySort = System.Windows.Forms.PropertySort.Categorized;
            pgSettings.ToolbarVisible = false;
            // 
            // btnSaveAs
            // 
            resources.ApplyResources(btnSaveAs, "btnSaveAs");
            btnSaveAs.Name = "btnSaveAs";
            btnSaveAs.UseVisualStyleBackColor = true;
            btnSaveAs.Click += btnSaveAs_Click;
            // 
            // DirectoryIndexerForm
            // 
            resources.ApplyResources(this, "$this");
            AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            BackColor = System.Drawing.SystemColors.Window;
            Controls.Add(btnSaveAs);
            Controls.Add(tcMain);
            Controls.Add(btnUpload);
            Controls.Add(btnIndexFolder);
            Controls.Add(btnBrowseFolder);
            Controls.Add(txtFolderPath);
            Name = "DirectoryIndexerForm";
            Load += DirectoryIndexerForm_Load;
            tcMain.ResumeLayout(false);
            tpPreview.ResumeLayout(false);
            tpPreview.PerformLayout();
            tpSettings.ResumeLayout(false);
            ResumeLayout(false);
            PerformLayout();

        }

        #endregion

        private System.Windows.Forms.WebBrowser wbPreview;
        private System.Windows.Forms.TextBox txtFolderPath;
        private System.Windows.Forms.Button btnBrowseFolder;
        private System.Windows.Forms.Button btnIndexFolder;
        private System.Windows.Forms.Button btnUpload;
        private System.Windows.Forms.TabControl tcMain;
        private System.Windows.Forms.TabPage tpSettings;
        private System.Windows.Forms.PropertyGrid pgSettings;
        private System.Windows.Forms.TabPage tpPreview;
        private System.Windows.Forms.TextBox txtPreview;
        private System.Windows.Forms.Button btnSaveAs;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: DirectoryIndexerForm.es-MX.resx]---
Location: ShareX-develop/ShareX.IndexerLib/Forms/DirectoryIndexerForm.es-MX.resx

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
    <value>ShareX - Indizador de carpetas</value>
  </data>
  <data name="btnBrowseFolder.Text" xml:space="preserve">
    <value>Examinar carpeta...</value>
  </data>
  <data name="btnIndexFolder.Text" xml:space="preserve">
    <value>Indizar carpeta seleccionada</value>
  </data>
  <data name="btnUpload.Text" xml:space="preserve">
    <value>Subir y cerrar esta ventana</value>
  </data>
  <data name="tpPreview.Text" xml:space="preserve">
    <value>Vista previa</value>
  </data>
  <data name="tpSettings.Text" xml:space="preserve">
    <value>Configuración</value>
  </data>
  <data name="btnSaveAs.Text" xml:space="preserve">
    <value>Guardar como y cerrar esta ventana...</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
