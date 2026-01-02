---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 246
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 246 of 650)

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

---[FILE: MyPictureBox.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/MyPictureBox.cs

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
using System.Drawing;
using System.IO;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public partial class MyPictureBox : UserControl
    {
        public Image Image
        {
            get
            {
                return pbMain.Image;
            }
            private set
            {
                pbMain.Image = value;
            }
        }

        private string text;

        [EditorBrowsable(EditorBrowsableState.Always), Browsable(true), DesignerSerializationVisibility(DesignerSerializationVisibility.Visible), Bindable(true)]
        public override string Text
        {
            get
            {
                return text;
            }
            set
            {
                text = value;

                if (string.IsNullOrEmpty(value))
                {
                    lblStatus.Visible = false;
                }
                else
                {
                    lblStatus.Text = value;
                    lblStatus.Visible = true;
                }
            }
        }

        public Color PictureBoxBackColor
        {
            get
            {
                return pbMain.BackColor;
            }
            set
            {
                pbMain.BackColor = value;
            }
        }

        private bool drawCheckeredBackground;

        [DefaultValue(false)]
        public bool DrawCheckeredBackground
        {
            get
            {
                return drawCheckeredBackground;
            }
            set
            {
                drawCheckeredBackground = value;
                UpdateCheckers();
            }
        }

        [DefaultValue(false)]
        public bool FullscreenOnClick { get; set; }

        [DefaultValue(false)]
        public bool EnableRightClickMenu { get; set; }

        [DefaultValue(false)]
        public bool ShowImageSizeLabel { get; set; }

        public new event MouseEventHandler MouseDown
        {
            add
            {
                pbMain.MouseDown += value;
                lblStatus.MouseDown += value;
            }
            remove
            {
                pbMain.MouseDown -= value;
                lblStatus.MouseDown -= value;
            }
        }

        public new event MouseEventHandler MouseUp
        {
            add
            {
                pbMain.MouseUp += value;
                lblStatus.MouseUp += value;
            }
            remove
            {
                pbMain.MouseUp -= value;
                lblStatus.MouseUp -= value;
            }
        }

        public new event MouseEventHandler MouseClick
        {
            add
            {
                pbMain.MouseClick += value;
                lblStatus.MouseClick += value;
            }
            remove
            {
                pbMain.MouseClick -= value;
                lblStatus.MouseClick -= value;
            }
        }

        public new event MouseEventHandler MouseMove
        {
            add
            {
                pbMain.MouseMove += value;
                lblStatus.MouseMove += value;
            }
            remove
            {
                pbMain.MouseMove -= value;
                lblStatus.MouseMove -= value;
            }
        }

        public bool IsValidImage
        {
            get
            {
                return !isImageLoading && pbMain.IsValidImage();
            }
        }

        private readonly object imageLoadLock = new object();

        private bool isImageLoading;

        public MyPictureBox()
        {
            InitializeComponent();
            Text = "";
            UpdateTheme();
            UpdateImageSizeLabel();
        }

        private void UpdateImageSizeLabel()
        {
            if (IsValidImage)
            {
                lblImageSize.Text = $"{Image.Width} x {Image.Height}";
                lblImageSize.Location = new Point((ClientSize.Width - lblImageSize.Width) / 2, ClientSize.Height - lblImageSize.Height + 1);
            }
        }

        public void UpdateTheme()
        {
            lblImageSize.BackColor = ShareXResources.Theme.BackgroundColor;
            lblImageSize.ForeColor = ShareXResources.Theme.TextColor;

            ShareXResources.ApplyCustomThemeToContextMenuStrip(cmsMenu);
        }

        public void UpdateCheckers(bool forceUpdate = false)
        {
            if (DrawCheckeredBackground)
            {
                if (forceUpdate || pbMain.BackgroundImage == null || pbMain.BackgroundImage.Size != pbMain.ClientSize)
                {
                    if (pbMain.BackgroundImage != null) pbMain.BackgroundImage.Dispose();

                    if (ShareXResources.Theme.CheckerSize > 0)
                    {
                        pbMain.BackgroundImage = ImageHelpers.CreateCheckerPattern(ShareXResources.Theme.CheckerSize, ShareXResources.Theme.CheckerSize,
                            ShareXResources.Theme.CheckerColor, ShareXResources.Theme.CheckerColor2);
                    }
                    else
                    {
                        pbMain.BackColor = ShareXResources.Theme.CheckerColor;
                        pbMain.BackgroundImage = null;
                    }
                }
            }
            else
            {
                if (pbMain.BackgroundImage != null) pbMain.BackgroundImage.Dispose();
                pbMain.BackgroundImage = null;
            }
        }

        public void LoadImage(Image img)
        {
            lock (imageLoadLock)
            {
                if (!isImageLoading)
                {
                    Reset();

                    if (img != null)
                    {
                        isImageLoading = true;
                        Image = (Image)img.Clone();
                        isImageLoading = false;
                    }
                    else
                    {
                        Image = null;
                    }

                    AutoSetSizeMode();
                }
            }
        }

        public void LoadImageFromFile(string filePath)
        {
            lock (imageLoadLock)
            {
                if (!isImageLoading)
                {
                    Reset();
                    isImageLoading = true;
                    Image = ImageHelpers.LoadImage(filePath);
                    isImageLoading = false;
                    AutoSetSizeMode();
                }
            }
        }

        public void LoadImageFromFileAsync(string filePath)
        {
            if (!string.IsNullOrEmpty(filePath) && File.Exists(filePath))
            {
                LoadImageAsync(filePath);
            }
        }

        public void LoadImageFromURLAsync(string url)
        {
            if (!string.IsNullOrEmpty(url) && !url.StartsWith("ftp://") && !url.StartsWith("ftps://"))
            {
                LoadImageAsync(url);
            }
        }

        private void LoadImageAsync(string path)
        {
            lock (imageLoadLock)
            {
                if (!isImageLoading)
                {
                    Reset();
                    isImageLoading = true;
                    Text = Resources.MyPictureBox_LoadImageAsync_Loading_image___;
                    lblStatus.Visible = true;

                    try
                    {
                        pbMain.LoadAsync(path);
                    }
                    catch
                    {
                        lblStatus.Visible = false;
                        isImageLoading = false;
                        Reset();
                    }
                }
            }
        }

        public void Reset()
        {
            if (!isImageLoading && Image != null)
            {
                Image temp = null;

                try
                {
                    temp = Image;
                    Image = null;
                }
                finally
                {
                    // If error happened in previous image load then PictureBox set image as error image and if we dispose it then error happens
                    if (temp != null && temp != pbMain.ErrorImage && temp != pbMain.InitialImage)
                    {
                        temp.Dispose();
                    }
                }
            }

            if (FullscreenOnClick && Cursor != Cursors.Default)
            {
                Cursor = Cursors.Default;
            }
        }

        private void AutoSetSizeMode()
        {
            if (IsValidImage)
            {
                if (Image.Width > pbMain.ClientSize.Width || Image.Height > pbMain.ClientSize.Height)
                {
                    pbMain.SizeMode = PictureBoxSizeMode.Zoom;
                }
                else
                {
                    pbMain.SizeMode = PictureBoxSizeMode.CenterImage;
                }

                if (FullscreenOnClick)
                {
                    Cursor = Cursors.Hand;
                }
            }

            UpdateImageSizeLabel();
        }

        private void PbMain_Resize(object sender, EventArgs e)
        {
            UpdateCheckers();
            AutoSetSizeMode();
        }

        private void PbMain_LoadCompleted(object sender, AsyncCompletedEventArgs e)
        {
            lblStatus.Visible = false;
            isImageLoading = false;
            if (e.Error == null) AutoSetSizeMode();
        }

        private void PbMain_LoadProgressChanged(object sender, ProgressChangedEventArgs e)
        {
            if (isImageLoading && e.ProgressPercentage < 100)
            {
                Text = string.Format(Resources.MyPictureBox_pbMain_LoadProgressChanged_Loading_image___0__, e.ProgressPercentage);
            }
        }

        private void PbMain_MouseDown(object sender, MouseEventArgs e)
        {
            if (FullscreenOnClick && e.Button == MouseButtons.Left && IsValidImage)
            {
                pbMain.Enabled = false;
                ImageViewer.ShowImage(Image);
                pbMain.Enabled = true;
            }
        }

        private void PbMain_MouseUp(object sender, MouseEventArgs e)
        {
            if (EnableRightClickMenu && e.Button == MouseButtons.Right && IsValidImage)
            {
                cmsMenu.Show(pbMain, e.X + 1, e.Y + 1);
            }
        }

        private void PbMain_MouseMove(object sender, MouseEventArgs e)
        {
            lblImageSize.Visible = ShowImageSizeLabel && IsValidImage && !new Rectangle(lblImageSize.Location, lblImageSize.Size).Contains(e.Location);
        }

        private void PbMain_MouseLeave(object sender, EventArgs e)
        {
            lblImageSize.Visible = false;
        }

        private void tsmiCopyImage_Click(object sender, EventArgs e)
        {
            if (IsValidImage)
            {
                ClipboardHelpers.CopyImage(Image);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: MyPictureBox.de.resx]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/MyPictureBox.de.resx

```text
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
    <value>Bildvorschau</value>
  </data>
  <data name="tsmiCopyImage.Text" xml:space="preserve">
    <value>Bild kopieren</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: MyPictureBox.Designer.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/MyPictureBox.Designer.cs

```csharp
namespace ShareX.HelpersLib
{
    partial class MyPictureBox
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
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MyPictureBox));
            this.lblStatus = new System.Windows.Forms.Label();
            this.pbMain = new System.Windows.Forms.PictureBox();
            this.cmsMenu = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.tsmiCopyImage = new System.Windows.Forms.ToolStripMenuItem();
            this.lblImageSize = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.pbMain)).BeginInit();
            this.cmsMenu.SuspendLayout();
            this.SuspendLayout();
            // 
            // lblStatus
            // 
            this.lblStatus.BackColor = System.Drawing.Color.DimGray;
            resources.ApplyResources(this.lblStatus, "lblStatus");
            this.lblStatus.ForeColor = System.Drawing.Color.White;
            this.lblStatus.Name = "lblStatus";
            // 
            // pbMain
            // 
            resources.ApplyResources(this.pbMain, "pbMain");
            this.pbMain.ErrorImage = global::ShareX.HelpersLib.Properties.Resources.cross;
            this.pbMain.InitialImage = global::ShareX.HelpersLib.Properties.Resources.Loading;
            this.pbMain.Name = "pbMain";
            this.pbMain.TabStop = false;
            this.pbMain.LoadCompleted += new System.ComponentModel.AsyncCompletedEventHandler(this.PbMain_LoadCompleted);
            this.pbMain.LoadProgressChanged += new System.ComponentModel.ProgressChangedEventHandler(this.PbMain_LoadProgressChanged);
            this.pbMain.MouseDown += new System.Windows.Forms.MouseEventHandler(this.PbMain_MouseDown);
            this.pbMain.MouseLeave += new System.EventHandler(this.PbMain_MouseLeave);
            this.pbMain.MouseMove += new System.Windows.Forms.MouseEventHandler(this.PbMain_MouseMove);
            this.pbMain.MouseUp += new System.Windows.Forms.MouseEventHandler(this.PbMain_MouseUp);
            this.pbMain.Resize += new System.EventHandler(this.PbMain_Resize);
            // 
            // cmsMenu
            // 
            this.cmsMenu.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.tsmiCopyImage});
            this.cmsMenu.Name = "cmsMenu";
            this.cmsMenu.ShowImageMargin = false;
            resources.ApplyResources(this.cmsMenu, "cmsMenu");
            // 
            // tsmiCopyImage
            // 
            this.tsmiCopyImage.Name = "tsmiCopyImage";
            resources.ApplyResources(this.tsmiCopyImage, "tsmiCopyImage");
            this.tsmiCopyImage.Click += new System.EventHandler(this.tsmiCopyImage_Click);
            // 
            // lblImageSize
            // 
            resources.ApplyResources(this.lblImageSize, "lblImageSize");
            this.lblImageSize.BackColor = System.Drawing.SystemColors.Window;
            this.lblImageSize.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.lblImageSize.Name = "lblImageSize";
            // 
            // MyPictureBox
            // 
            resources.ApplyResources(this, "$this");
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.SystemColors.Window;
            this.Controls.Add(this.lblImageSize);
            this.Controls.Add(this.lblStatus);
            this.Controls.Add(this.pbMain);
            this.Name = "MyPictureBox";
            ((System.ComponentModel.ISupportInitialize)(this.pbMain)).EndInit();
            this.cmsMenu.ResumeLayout(false);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion Component Designer generated code

        private System.Windows.Forms.Label lblStatus;
        private System.Windows.Forms.PictureBox pbMain;
        private System.Windows.Forms.ContextMenuStrip cmsMenu;
        private System.Windows.Forms.ToolStripMenuItem tsmiCopyImage;
        private System.Windows.Forms.Label lblImageSize;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: MyPictureBox.es-MX.resx]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/MyPictureBox.es-MX.resx

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
    <value>Vista previa de imagen</value>
  </data>
  <data name="tsmiCopyImage.Text" xml:space="preserve">
    <value>Copiar imagen</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: MyPictureBox.es.resx]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/MyPictureBox.es.resx

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
    <value>Previsualización de imagen</value>
  </data>
  <data name="tsmiCopyImage.Text" xml:space="preserve">
    <value>Copiar imagen</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
