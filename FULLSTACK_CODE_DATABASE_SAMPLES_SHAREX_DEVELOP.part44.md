---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:46Z
part: 44
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 44 of 650)

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

---[FILE: AfterCaptureForm.cs]---
Location: ShareX-develop/ShareX/Forms/AfterCaptureForm.cs

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
using ShareX.Properties;
using System;
using System.IO;
using System.Linq;
using System.Windows.Forms;

namespace ShareX
{
    public partial class AfterCaptureForm : Form
    {
        public TaskSettings TaskSettings { get; private set; }
        public string FileName { get; private set; }

        private AfterCaptureForm(TaskSettings taskSettings)
        {
            TaskSettings = taskSettings;

            InitializeComponent();
            ShareXResources.ApplyTheme(this, true);

            ImageList imageList = new ImageList { ColorDepth = ColorDepth.Depth32Bit };
            imageList.Images.Add(Resources.checkbox_uncheck);
            imageList.Images.Add(Resources.checkbox_check);
            lvAfterCaptureTasks.SmallImageList = imageList;
            lvAfterUploadTasks.SmallImageList = imageList;

            ucBeforeUpload.InitCapture(TaskSettings);

            AddAfterCaptureItems(TaskSettings.AfterCaptureJob);
            AddAfterUploadItems(TaskSettings.AfterUploadJob);
        }

        public AfterCaptureForm(TaskMetadata metadata, TaskSettings taskSettings) : this(taskSettings)
        {
            if (metadata != null && metadata.Image != null)
            {
                pbImage.LoadImage(metadata.Image);
                btnCopy.Enabled = true;
            }

            FileName = TaskHelpers.GetFileName(TaskSettings, null, metadata);
            txtFileName.Text = FileName;
        }

        public AfterCaptureForm(string filePath, TaskSettings taskSettings) : this(taskSettings)
        {
            if (FileHelpers.IsImageFile(filePath))
            {
                pbImage.LoadImageFromFileAsync(filePath);
            }

            FileName = Path.GetFileNameWithoutExtension(filePath);
            txtFileName.Text = FileName;
        }

        private void AfterCaptureForm_Shown(object sender, EventArgs e)
        {
            this.ForceActivate();
        }

        private void Continue()
        {
            TaskSettings.AfterCaptureJob = GetAfterCaptureTasks();
            TaskSettings.AfterUploadJob = GetAfterUploadTasks();
            FileName = txtFileName.Text;
            DialogResult = DialogResult.OK;
            Close();
        }

        private void CheckItem(ListViewItem lvi, bool check)
        {
            lvi.ImageIndex = check ? 1 : 0;
        }

        private bool IsChecked(ListViewItem lvi)
        {
            return lvi.ImageIndex == 1;
        }

        private void AddAfterCaptureItems(AfterCaptureTasks afterCaptureTasks)
        {
            AfterCaptureTasks[] ignore = new AfterCaptureTasks[] { AfterCaptureTasks.None, AfterCaptureTasks.ShowQuickTaskMenu, AfterCaptureTasks.ShowAfterCaptureWindow };
            int itemHeight = 0;

            foreach (AfterCaptureTasks task in Helpers.GetEnums<AfterCaptureTasks>())
            {
                if (ignore.Any(x => x == task)) continue;
                ListViewItem lvi = new ListViewItem(task.GetLocalizedDescription());
                CheckItem(lvi, afterCaptureTasks.HasFlag(task));
                lvi.Tag = task;
                lvAfterCaptureTasks.Items.Add(lvi);

                if (itemHeight == 0)
                    itemHeight = lvi.Bounds.Height;
            }

            int newListViewHeight = lvAfterCaptureTasks.Items.Count * itemHeight;
            int listViewHeightDifference = newListViewHeight - lvAfterCaptureTasks.Height;
            if (listViewHeightDifference > 0)
                Height += listViewHeightDifference;
        }

        private AfterCaptureTasks GetAfterCaptureTasks()
        {
            AfterCaptureTasks afterCaptureTasks = AfterCaptureTasks.None;

            for (int i = 0; i < lvAfterCaptureTasks.Items.Count; i++)
            {
                ListViewItem lvi = lvAfterCaptureTasks.Items[i];

                if (IsChecked(lvi))
                {
                    afterCaptureTasks = afterCaptureTasks.Add((AfterCaptureTasks)lvi.Tag);
                }
            }

            return afterCaptureTasks;
        }

        private void lvAfterCaptureTasks_ItemSelectionChanged(object sender, ListViewItemSelectionChangedEventArgs e)
        {
            e.Item.Selected = false;
        }

        private void lvAfterCaptureTasks_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                ListViewItem lvi = lvAfterCaptureTasks.GetItemAt(e.X, e.Y);

                if (lvi != null)
                {
                    CheckItem(lvi, !IsChecked(lvi));
                }
            }
        }

        private void AddAfterUploadItems(AfterUploadTasks afterUploadTasks)
        {
            AfterUploadTasks[] ignore = new AfterUploadTasks[] { AfterUploadTasks.None };

            foreach (AfterUploadTasks task in Helpers.GetEnums<AfterUploadTasks>())
            {
                if (ignore.Any(x => x == task)) continue;
                ListViewItem lvi = new ListViewItem(task.GetLocalizedDescription());
                CheckItem(lvi, afterUploadTasks.HasFlag(task));
                lvi.Tag = task;
                lvAfterUploadTasks.Items.Add(lvi);
            }
        }

        private AfterUploadTasks GetAfterUploadTasks()
        {
            AfterUploadTasks afterUploadTasks = AfterUploadTasks.None;

            for (int i = 0; i < lvAfterUploadTasks.Items.Count; i++)
            {
                ListViewItem lvi = lvAfterUploadTasks.Items[i];

                if (IsChecked(lvi))
                {
                    afterUploadTasks = afterUploadTasks.Add((AfterUploadTasks)lvi.Tag);
                }
            }

            return afterUploadTasks;
        }

        private void lvAfterUploadTasks_ItemSelectionChanged(object sender, ListViewItemSelectionChangedEventArgs e)
        {
            e.Item.Selected = false;
        }

        private void lvAfterUploadTasks_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                ListViewItem lvi = lvAfterUploadTasks.GetItemAt(e.X, e.Y);

                if (lvi != null)
                {
                    CheckItem(lvi, !IsChecked(lvi));
                }
            }
        }

        private void txtFileName_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyData == Keys.Enter)
            {
                e.SuppressKeyPress = true;
            }
        }

        private void txtFileName_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyData == Keys.Enter)
            {
                Continue();
            }
        }

        private void btnContinue_Click(object sender, EventArgs e)
        {
            Continue();
        }

        private void btnCopy_Click(object sender, EventArgs e)
        {
            TaskSettings.AfterCaptureJob = AfterCaptureTasks.CopyImageToClipboard;
            FileName = txtFileName.Text;
            DialogResult = DialogResult.OK;
            Close();
        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            DialogResult = DialogResult.Cancel;
            Close();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: AfterCaptureForm.de.resx]---
Location: ShareX-develop/ShareX/Forms/AfterCaptureForm.de.resx

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
    <value>ShareX - Nach der Aufnahme</value>
  </data>
  <data name="btnCancel.Text" xml:space="preserve">
    <value>Abbrechen</value>
  </data>
  <data name="btnContinue.Text" xml:space="preserve">
    <value>Weiter</value>
  </data>
  <data name="tpAfterCapture.Text" xml:space="preserve">
    <value>Nach der Aufnahme</value>
  </data>
  <data name="tpBeforeUpload.Text" xml:space="preserve">
    <value>Ziel</value>
  </data>
  <data name="lblFileName.Text" xml:space="preserve">
    <value>Dateiname:</value>
  </data>
  <data name="btnCopy.Text" xml:space="preserve">
    <value>Kopieren</value>
  </data>
  <data name="tpAfterUpload.Text" xml:space="preserve">
    <value>Nach dem Upload</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: AfterCaptureForm.Designer.cs]---
Location: ShareX-develop/ShareX/Forms/AfterCaptureForm.Designer.cs

```csharp
namespace ShareX
{
    partial class AfterCaptureForm
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(AfterCaptureForm));
            btnContinue = new System.Windows.Forms.Button();
            btnCancel = new System.Windows.Forms.Button();
            btnCopy = new System.Windows.Forms.Button();
            tcTasks = new System.Windows.Forms.TabControl();
            tpAfterCapture = new System.Windows.Forms.TabPage();
            lvAfterCaptureTasks = new ShareX.HelpersLib.MyListView();
            chAfterCapture = new System.Windows.Forms.ColumnHeader();
            tpBeforeUpload = new System.Windows.Forms.TabPage();
            ucBeforeUpload = new BeforeUploadControl();
            tpAfterUpload = new System.Windows.Forms.TabPage();
            lvAfterUploadTasks = new ShareX.HelpersLib.MyListView();
            chAfterUpload = new System.Windows.Forms.ColumnHeader();
            lblFileName = new System.Windows.Forms.Label();
            txtFileName = new System.Windows.Forms.TextBox();
            pbImage = new ShareX.HelpersLib.MyPictureBox();
            tcTasks.SuspendLayout();
            tpAfterCapture.SuspendLayout();
            tpBeforeUpload.SuspendLayout();
            tpAfterUpload.SuspendLayout();
            SuspendLayout();
            // 
            // btnContinue
            // 
            resources.ApplyResources(btnContinue, "btnContinue");
            btnContinue.Name = "btnContinue";
            btnContinue.UseVisualStyleBackColor = true;
            btnContinue.Click += btnContinue_Click;
            // 
            // btnCancel
            // 
            resources.ApplyResources(btnCancel, "btnCancel");
            btnCancel.Name = "btnCancel";
            btnCancel.UseVisualStyleBackColor = true;
            btnCancel.Click += btnCancel_Click;
            // 
            // btnCopy
            // 
            resources.ApplyResources(btnCopy, "btnCopy");
            btnCopy.Name = "btnCopy";
            btnCopy.UseVisualStyleBackColor = true;
            btnCopy.Click += btnCopy_Click;
            // 
            // tcTasks
            // 
            resources.ApplyResources(tcTasks, "tcTasks");
            tcTasks.Controls.Add(tpAfterCapture);
            tcTasks.Controls.Add(tpBeforeUpload);
            tcTasks.Controls.Add(tpAfterUpload);
            tcTasks.Name = "tcTasks";
            tcTasks.SelectedIndex = 0;
            // 
            // tpAfterCapture
            // 
            tpAfterCapture.BackColor = System.Drawing.SystemColors.Window;
            tpAfterCapture.Controls.Add(lvAfterCaptureTasks);
            resources.ApplyResources(tpAfterCapture, "tpAfterCapture");
            tpAfterCapture.Name = "tpAfterCapture";
            // 
            // lvAfterCaptureTasks
            // 
            lvAfterCaptureTasks.AutoFillColumn = true;
            lvAfterCaptureTasks.BorderStyle = System.Windows.Forms.BorderStyle.None;
            lvAfterCaptureTasks.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] { chAfterCapture });
            resources.ApplyResources(lvAfterCaptureTasks, "lvAfterCaptureTasks");
            lvAfterCaptureTasks.FullRowSelect = true;
            lvAfterCaptureTasks.HeaderStyle = System.Windows.Forms.ColumnHeaderStyle.None;
            lvAfterCaptureTasks.MultiSelect = false;
            lvAfterCaptureTasks.Name = "lvAfterCaptureTasks";
            lvAfterCaptureTasks.UseCompatibleStateImageBehavior = false;
            lvAfterCaptureTasks.View = System.Windows.Forms.View.Details;
            lvAfterCaptureTasks.ItemSelectionChanged += lvAfterCaptureTasks_ItemSelectionChanged;
            lvAfterCaptureTasks.MouseDown += lvAfterCaptureTasks_MouseDown;
            // 
            // tpBeforeUpload
            // 
            tpBeforeUpload.BackColor = System.Drawing.SystemColors.Window;
            tpBeforeUpload.Controls.Add(ucBeforeUpload);
            resources.ApplyResources(tpBeforeUpload, "tpBeforeUpload");
            tpBeforeUpload.Name = "tpBeforeUpload";
            // 
            // ucBeforeUpload
            // 
            resources.ApplyResources(ucBeforeUpload, "ucBeforeUpload");
            ucBeforeUpload.Name = "ucBeforeUpload";
            // 
            // tpAfterUpload
            // 
            tpAfterUpload.BackColor = System.Drawing.SystemColors.Window;
            tpAfterUpload.Controls.Add(lvAfterUploadTasks);
            resources.ApplyResources(tpAfterUpload, "tpAfterUpload");
            tpAfterUpload.Name = "tpAfterUpload";
            // 
            // lvAfterUploadTasks
            // 
            lvAfterUploadTasks.AutoFillColumn = true;
            lvAfterUploadTasks.BorderStyle = System.Windows.Forms.BorderStyle.None;
            lvAfterUploadTasks.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] { chAfterUpload });
            resources.ApplyResources(lvAfterUploadTasks, "lvAfterUploadTasks");
            lvAfterUploadTasks.FullRowSelect = true;
            lvAfterUploadTasks.HeaderStyle = System.Windows.Forms.ColumnHeaderStyle.None;
            lvAfterUploadTasks.MultiSelect = false;
            lvAfterUploadTasks.Name = "lvAfterUploadTasks";
            lvAfterUploadTasks.UseCompatibleStateImageBehavior = false;
            lvAfterUploadTasks.View = System.Windows.Forms.View.Details;
            lvAfterUploadTasks.ItemSelectionChanged += lvAfterUploadTasks_ItemSelectionChanged;
            lvAfterUploadTasks.MouseDown += lvAfterUploadTasks_MouseDown;
            // 
            // lblFileName
            // 
            resources.ApplyResources(lblFileName, "lblFileName");
            lblFileName.Name = "lblFileName";
            // 
            // txtFileName
            // 
            resources.ApplyResources(txtFileName, "txtFileName");
            txtFileName.Name = "txtFileName";
            txtFileName.KeyDown += txtFileName_KeyDown;
            txtFileName.KeyUp += txtFileName_KeyUp;
            // 
            // pbImage
            // 
            resources.ApplyResources(pbImage, "pbImage");
            pbImage.BackColor = System.Drawing.SystemColors.Window;
            pbImage.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            pbImage.DrawCheckeredBackground = true;
            pbImage.EnableRightClickMenu = true;
            pbImage.FullscreenOnClick = true;
            pbImage.Name = "pbImage";
            pbImage.PictureBoxBackColor = System.Drawing.SystemColors.Window;
            pbImage.ShowImageSizeLabel = true;
            // 
            // AfterCaptureForm
            // 
            resources.ApplyResources(this, "$this");
            AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            BackColor = System.Drawing.SystemColors.Window;
            Controls.Add(txtFileName);
            Controls.Add(lblFileName);
            Controls.Add(tcTasks);
            Controls.Add(btnCopy);
            Controls.Add(btnCancel);
            Controls.Add(btnContinue);
            Controls.Add(pbImage);
            Name = "AfterCaptureForm";
            SizeGripStyle = System.Windows.Forms.SizeGripStyle.Hide;
            TopMost = true;
            Shown += AfterCaptureForm_Shown;
            tcTasks.ResumeLayout(false);
            tpAfterCapture.ResumeLayout(false);
            tpBeforeUpload.ResumeLayout(false);
            tpAfterUpload.ResumeLayout(false);
            ResumeLayout(false);
            PerformLayout();

        }

        #endregion

        private HelpersLib.MyPictureBox pbImage;
        private System.Windows.Forms.Button btnContinue;
        private System.Windows.Forms.Button btnCancel;
        private System.Windows.Forms.Button btnCopy;
        private System.Windows.Forms.TabControl tcTasks;
        private System.Windows.Forms.TabPage tpAfterCapture;
        private System.Windows.Forms.TabPage tpBeforeUpload;
        private BeforeUploadControl ucBeforeUpload;
        private System.Windows.Forms.Label lblFileName;
        private System.Windows.Forms.TextBox txtFileName;
        private System.Windows.Forms.TabPage tpAfterUpload;
        private HelpersLib.MyListView lvAfterCaptureTasks;
        private System.Windows.Forms.ColumnHeader chAfterCapture;
        private HelpersLib.MyListView lvAfterUploadTasks;
        private System.Windows.Forms.ColumnHeader chAfterUpload;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: AfterCaptureForm.es-MX.resx]---
Location: ShareX-develop/ShareX/Forms/AfterCaptureForm.es-MX.resx

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
  <data name="btnContinue.Text" xml:space="preserve">
    <value>Continuar</value>
  </data>
  <data name="btnCancel.Text" xml:space="preserve">
    <value>Cancelar</value>
  </data>
  <data name="btnCopy.Text" xml:space="preserve">
    <value>Copiar</value>
  </data>
  <data name="tpAfterCapture.Text" xml:space="preserve">
    <value>Después de capturar</value>
  </data>
  <data name="tpBeforeUpload.Text" xml:space="preserve">
    <value>Destinos</value>
  </data>
  <data name="tpAfterUpload.Text" xml:space="preserve">
    <value>Después de subir</value>
  </data>
  <data name="lblFileName.Text" xml:space="preserve">
    <value>Nombre de archivo:</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - Después de capturar</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: AfterCaptureForm.es.resx]---
Location: ShareX-develop/ShareX/Forms/AfterCaptureForm.es.resx

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
  <data name="btnContinue.Text" xml:space="preserve">
    <value>Continuar</value>
  </data>
  <data name="btnCancel.Text" xml:space="preserve">
    <value>Cancelar</value>
  </data>
  <data name="btnCopy.Text" xml:space="preserve">
    <value>Copiar</value>
  </data>
  <data name="tpAfterCapture.Text" xml:space="preserve">
    <value>Después de capturar</value>
  </data>
  <data name="tpBeforeUpload.Text" xml:space="preserve">
    <value>Antes de subir</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - Tareas después de capturar</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
