---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:46Z
part: 49
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 49 of 650)

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

---[FILE: AfterUploadForm.cs]---
Location: ShareX-develop/ShareX/Forms/AfterUploadForm.cs

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
using ShareX.UploadersLib;
using System;
using System.IO;
using System.Windows.Forms;

namespace ShareX
{
    public partial class AfterUploadForm : Form
    {
        public TaskInfo Info { get; private set; }

        private UploadInfoParser parser = new UploadInfoParser();

        private ListViewGroup lvgForums = new ListViewGroup("Forums");
        private ListViewGroup lvgHtml = new ListViewGroup("HTML");
        private ListViewGroup lvgWiki = new ListViewGroup("Wiki");
        private ListViewGroup lvgLocal = new ListViewGroup("Local");
        private ListViewGroup lvgCustom = new ListViewGroup("Custom");

        public AfterUploadForm(TaskInfo info)
        {
            InitializeComponent();
            ShareXResources.ApplyTheme(this, true);

            Info = info;

            if (Info.TaskSettings.AdvancedSettings.AutoCloseAfterUploadForm)
            {
                tmrClose.Start();
            }

            bool isFileExist = !string.IsNullOrEmpty(info.FilePath) && File.Exists(info.FilePath);

            if (info.DataType == EDataType.Image)
            {
                if (isFileExist)
                {
                    pbPreview.LoadImageFromFileAsync(info.FilePath);
                }
                else
                {
                    pbPreview.LoadImageFromURLAsync(info.Result.URL);
                }
            }

            Text = "ShareX - " + (isFileExist ? info.FilePath : info.FileName);

            lvClipboardFormats.Groups.Add(lvgForums);
            lvClipboardFormats.Groups.Add(lvgHtml);
            lvClipboardFormats.Groups.Add(lvgWiki);
            lvClipboardFormats.Groups.Add(lvgLocal);
            lvClipboardFormats.Groups.Add(lvgCustom);

            foreach (LinkFormatEnum type in Helpers.GetEnums<LinkFormatEnum>())
            {
                if (!FileHelpers.IsImageFile(Info.Result.URL) &&
                    (type == LinkFormatEnum.HTMLImage || type == LinkFormatEnum.HTMLLinkedImage ||
                    type == LinkFormatEnum.ForumImage || type == LinkFormatEnum.ForumLinkedImage ||
                    type == LinkFormatEnum.WikiImage || type == LinkFormatEnum.WikiLinkedImage))
                    continue;

                AddFormat(type.GetLocalizedDescription(), GetUrlByType(type));
            }

            if (FileHelpers.IsImageFile(Info.Result.URL))
            {
                foreach (ClipboardFormat cf in Program.Settings.ClipboardContentFormats)
                {
                    AddFormat(cf.Description, parser.Parse(Info, cf.Format), lvgCustom);
                }
            }
        }

        private void AddFormat(string description, string text, ListViewGroup group = null)
        {
            if (!string.IsNullOrEmpty(text))
            {
                ListViewItem lvi = new ListViewItem(description);

                if (group == null)
                {
                    if (description.Contains("HTML"))
                    {
                        lvi.Group = lvgHtml;
                    }
                    else if (description.Contains("Forums"))
                    {
                        lvi.Group = lvgForums;
                    }
                    else if (description.Contains("Local"))
                    {
                        lvi.Group = lvgLocal;
                    }
                    else if (description.Contains("Wiki"))
                    {
                        lvi.Group = lvgWiki;
                    }
                }
                else
                {
                    lvi.Group = group;
                }

                lvi.SubItems.Add(text);
                lvClipboardFormats.Items.Add(lvi);
                lvClipboardFormats.FillLastColumn();
            }
        }

        private void tmrClose_Tick(object sender, EventArgs e)
        {
            Close();
        }

        private void btnCopyImage_Click(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(Info.FilePath) && FileHelpers.IsImageFile(Info.FilePath) && File.Exists(Info.FilePath))
            {
                ClipboardHelpers.CopyImageFromFile(Info.FilePath);
            }
        }

        private void btnCopyLink_Click(object sender, EventArgs e)
        {
            if (lvClipboardFormats.Items.Count > 0)
            {
                string url;

                if (lvClipboardFormats.SelectedItems.Count == 0)
                {
                    url = lvClipboardFormats.Items[0].SubItems[1].Text;
                }
                else
                {
                    url = lvClipboardFormats.SelectedItems[0].SubItems[1].Text;
                }

                if (!string.IsNullOrEmpty(url))
                {
                    ClipboardHelpers.CopyText(url);
                }
            }
        }

        private void btnOpenLink_Click(object sender, EventArgs e)
        {
            string url = Info.Result.URL;

            if (!string.IsNullOrEmpty(url))
            {
                URLHelpers.OpenURL(url);
            }
        }

        private void btnOpenFile_Click(object sender, EventArgs e)
        {
            FileHelpers.OpenFile(Info.FilePath);
        }

        private void btnFolderOpen_Click(object sender, EventArgs e)
        {
            FileHelpers.OpenFolderWithFile(Info.FilePath);
        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            DialogResult = DialogResult.Cancel;
            Close();
        }

        #region TaskInfo helper methods

        public string GetUrlByType(LinkFormatEnum type)
        {
            switch (type)
            {
                case LinkFormatEnum.URL:
                    return Info.Result.URL;
                case LinkFormatEnum.ShortenedURL:
                    return Info.Result.ShortenedURL;
                case LinkFormatEnum.ForumImage:
                    return parser.Parse(Info, UploadInfoParser.ForumImage);
                case LinkFormatEnum.HTMLImage:
                    return parser.Parse(Info, UploadInfoParser.HTMLImage);
                case LinkFormatEnum.WikiImage:
                    return parser.Parse(Info, UploadInfoParser.WikiImage);
                case LinkFormatEnum.ForumLinkedImage:
                    return parser.Parse(Info, UploadInfoParser.ForumLinkedImage);
                case LinkFormatEnum.HTMLLinkedImage:
                    return parser.Parse(Info, UploadInfoParser.HTMLLinkedImage);
                case LinkFormatEnum.WikiLinkedImage:
                    return parser.Parse(Info, UploadInfoParser.WikiLinkedImage);
                case LinkFormatEnum.ThumbnailURL:
                    return Info.Result.ThumbnailURL;
                case LinkFormatEnum.LocalFilePath:
                    return Info.FilePath;
                case LinkFormatEnum.LocalFilePathUri:
                    return GetLocalFilePathAsUri(Info.FilePath);
            }

            return Info.Result.URL;
        }

        public string GetLocalFilePathAsUri(string fp)
        {
            if (!string.IsNullOrEmpty(fp) && File.Exists(fp))
            {
                try
                {
                    return new Uri(fp).AbsoluteUri;
                }
                catch (Exception ex)
                {
                    DebugHelper.WriteException(ex);
                }
            }

            return "";
        }

        #endregion TaskInfo helper methods

        private void lvClipboardFormats_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left && lvClipboardFormats.SelectedItems.Count > 0)
            {
                ListViewItem lvi = lvClipboardFormats.SelectedItems[0];
                string txt = lvi.SubItems[1].Text;
                if (!string.IsNullOrEmpty(txt))
                {
                    ClipboardHelpers.CopyText(txt);
                }
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: AfterUploadForm.de.resx]---
Location: ShareX-develop/ShareX/Forms/AfterUploadForm.de.resx

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
    <value>Share X - Nach dem Upload</value>
  </data>
  <data name="btnClose.Text" xml:space="preserve">
    <value>Schließen</value>
  </data>
  <data name="btnCopyImage.Text" xml:space="preserve">
    <value>Bild kopieren</value>
  </data>
  <data name="btnCopyLink.Text" xml:space="preserve">
    <value>Link kopieren</value>
  </data>
  <data name="btnOpenFile.Text" xml:space="preserve">
    <value>Datei öffnen...</value>
  </data>
  <data name="btnOpenFolder.Text" xml:space="preserve">
    <value>Ordner öffnen...</value>
  </data>
  <data name="btnOpenLink.Text" xml:space="preserve">
    <value>Link öffnen...</value>
  </data>
  <data name="chDescription.Text" xml:space="preserve">
    <value>Beschreibung</value>
  </data>
  <data name="chFormat.Text" xml:space="preserve">
    <value>Format</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: AfterUploadForm.designer.cs]---
Location: ShareX-develop/ShareX/Forms/AfterUploadForm.designer.cs

```csharp
namespace ShareX
{
    partial class AfterUploadForm
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
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(AfterUploadForm));
            this.pbPreview = new ShareX.HelpersLib.MyPictureBox();
            this.btnCopyImage = new System.Windows.Forms.Button();
            this.btnCopyLink = new System.Windows.Forms.Button();
            this.btnOpenLink = new System.Windows.Forms.Button();
            this.btnOpenFile = new System.Windows.Forms.Button();
            this.btnOpenFolder = new System.Windows.Forms.Button();
            this.tmrClose = new System.Windows.Forms.Timer(this.components);
            this.btnClose = new System.Windows.Forms.Button();
            this.lvClipboardFormats = new ShareX.HelpersLib.MyListView();
            this.chDescription = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.chFormat = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.SuspendLayout();
            // 
            // pbPreview
            // 
            resources.ApplyResources(this.pbPreview, "pbPreview");
            this.pbPreview.BackColor = System.Drawing.SystemColors.Window;
            this.pbPreview.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.pbPreview.DrawCheckeredBackground = true;
            this.pbPreview.EnableRightClickMenu = true;
            this.pbPreview.FullscreenOnClick = true;
            this.pbPreview.Name = "pbPreview";
            this.pbPreview.PictureBoxBackColor = System.Drawing.SystemColors.Window;
            this.pbPreview.ShowImageSizeLabel = true;
            // 
            // btnCopyImage
            // 
            resources.ApplyResources(this.btnCopyImage, "btnCopyImage");
            this.btnCopyImage.Name = "btnCopyImage";
            this.btnCopyImage.UseVisualStyleBackColor = true;
            this.btnCopyImage.Click += new System.EventHandler(this.btnCopyImage_Click);
            // 
            // btnCopyLink
            // 
            resources.ApplyResources(this.btnCopyLink, "btnCopyLink");
            this.btnCopyLink.Name = "btnCopyLink";
            this.btnCopyLink.UseVisualStyleBackColor = true;
            this.btnCopyLink.Click += new System.EventHandler(this.btnCopyLink_Click);
            // 
            // btnOpenLink
            // 
            resources.ApplyResources(this.btnOpenLink, "btnOpenLink");
            this.btnOpenLink.Name = "btnOpenLink";
            this.btnOpenLink.UseVisualStyleBackColor = true;
            this.btnOpenLink.Click += new System.EventHandler(this.btnOpenLink_Click);
            // 
            // btnOpenFile
            // 
            resources.ApplyResources(this.btnOpenFile, "btnOpenFile");
            this.btnOpenFile.Name = "btnOpenFile";
            this.btnOpenFile.UseVisualStyleBackColor = true;
            this.btnOpenFile.Click += new System.EventHandler(this.btnOpenFile_Click);
            // 
            // btnOpenFolder
            // 
            resources.ApplyResources(this.btnOpenFolder, "btnOpenFolder");
            this.btnOpenFolder.Name = "btnOpenFolder";
            this.btnOpenFolder.UseVisualStyleBackColor = true;
            this.btnOpenFolder.Click += new System.EventHandler(this.btnFolderOpen_Click);
            // 
            // tmrClose
            // 
            this.tmrClose.Interval = 60000;
            this.tmrClose.Tick += new System.EventHandler(this.tmrClose_Tick);
            // 
            // btnClose
            // 
            resources.ApplyResources(this.btnClose, "btnClose");
            this.btnClose.Name = "btnClose";
            this.btnClose.UseVisualStyleBackColor = true;
            this.btnClose.Click += new System.EventHandler(this.btnClose_Click);
            // 
            // lvClipboardFormats
            // 
            resources.ApplyResources(this.lvClipboardFormats, "lvClipboardFormats");
            this.lvClipboardFormats.AutoFillColumn = true;
            this.lvClipboardFormats.AutoFillColumnIndex = 1;
            this.lvClipboardFormats.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.chDescription,
            this.chFormat});
            this.lvClipboardFormats.FullRowSelect = true;
            this.lvClipboardFormats.GridLines = true;
            this.lvClipboardFormats.HideSelection = false;
            this.lvClipboardFormats.Name = "lvClipboardFormats";
            this.lvClipboardFormats.UseCompatibleStateImageBehavior = false;
            this.lvClipboardFormats.View = System.Windows.Forms.View.Details;
            this.lvClipboardFormats.MouseDoubleClick += new System.Windows.Forms.MouseEventHandler(this.lvClipboardFormats_MouseDoubleClick);
            // 
            // chDescription
            // 
            resources.ApplyResources(this.chDescription, "chDescription");
            // 
            // chFormat
            // 
            resources.ApplyResources(this.chFormat, "chFormat");
            // 
            // AfterUploadForm
            // 
            resources.ApplyResources(this, "$this");
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            this.BackColor = System.Drawing.SystemColors.Window;
            this.Controls.Add(this.lvClipboardFormats);
            this.Controls.Add(this.btnClose);
            this.Controls.Add(this.btnOpenLink);
            this.Controls.Add(this.btnOpenFile);
            this.Controls.Add(this.btnOpenFolder);
            this.Controls.Add(this.btnCopyLink);
            this.Controls.Add(this.btnCopyImage);
            this.Controls.Add(this.pbPreview);
            this.Name = "AfterUploadForm";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private HelpersLib.MyPictureBox pbPreview;
        private System.Windows.Forms.Timer tmrClose;
        private System.Windows.Forms.Button btnOpenFolder;
        private System.Windows.Forms.Button btnCopyImage;
        private System.Windows.Forms.Button btnOpenLink;
        private System.Windows.Forms.Button btnCopyLink;
        private System.Windows.Forms.Button btnOpenFile;
        private System.Windows.Forms.Button btnClose;
        private HelpersLib.MyListView lvClipboardFormats;
        private System.Windows.Forms.ColumnHeader chDescription;
        private System.Windows.Forms.ColumnHeader chFormat;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: AfterUploadForm.es-MX.resx]---
Location: ShareX-develop/ShareX/Forms/AfterUploadForm.es-MX.resx

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
  <data name="btnCopyImage.Text" xml:space="preserve">
    <value>Copiar imagen</value>
  </data>
  <data name="btnCopyLink.Text" xml:space="preserve">
    <value>Copiar enlace</value>
  </data>
  <data name="btnOpenLink.Text" xml:space="preserve">
    <value>Abrir enlace...</value>
  </data>
  <data name="btnOpenFile.Text" xml:space="preserve">
    <value>Abrir archivo...</value>
  </data>
  <data name="btnOpenFolder.Text" xml:space="preserve">
    <value>Abrir carpeta...</value>
  </data>
  <data name="btnClose.Text" xml:space="preserve">
    <value>Cerrar</value>
  </data>
  <data name="chDescription.Text" xml:space="preserve">
    <value>Descripción</value>
  </data>
  <data name="chFormat.Text" xml:space="preserve">
    <value>Formato</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - Después de subir</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: AfterUploadForm.es.resx]---
Location: ShareX-develop/ShareX/Forms/AfterUploadForm.es.resx

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
    <value>ShareX - Después de subir</value>
  </data>
  <data name="btnClose.Text" xml:space="preserve">
    <value>Cerrar</value>
  </data>
  <data name="btnCopyImage.Text" xml:space="preserve">
    <value>Copiar imagen</value>
  </data>
  <data name="btnCopyLink.Text" xml:space="preserve">
    <value>Copiar el enlace</value>
  </data>
  <data name="btnOpenFile.Text" xml:space="preserve">
    <value>Abrir archivo...</value>
  </data>
  <data name="btnOpenFolder.Text" xml:space="preserve">
    <value>Abrir carpeta...</value>
  </data>
  <data name="chDescription.Text" xml:space="preserve">
    <value>Descripción</value>
  </data>
  <data name="chFormat.Text" xml:space="preserve">
    <value>Formato</value>
  </data>
  <data name="btnOpenLink.Text" xml:space="preserve">
    <value>Abrir enlace...</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
