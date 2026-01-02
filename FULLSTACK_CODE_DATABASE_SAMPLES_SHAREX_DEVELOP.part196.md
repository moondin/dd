---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 196
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 196 of 650)

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

---[FILE: MetadataForm.Designer.cs]---
Location: ShareX-develop/ShareX/Tools/MetadataForm.Designer.cs

```csharp
namespace ShareX
{
    partial class MetadataForm
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
            this.btnOpen = new System.Windows.Forms.Button();
            this.rtbMetadata = new System.Windows.Forms.RichTextBox();
            this.btnCopyAll = new System.Windows.Forms.Button();
            this.btnStripMetadata = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // btnOpen
            // 
            this.btnOpen.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.btnOpen.Location = new System.Drawing.Point(8, 520);
            this.btnOpen.Name = "btnOpen";
            this.btnOpen.Size = new System.Drawing.Size(120, 32);
            this.btnOpen.TabIndex = 1;
            this.btnOpen.Text = "Open...";
            this.btnOpen.UseVisualStyleBackColor = true;
            this.btnOpen.Click += new System.EventHandler(this.btnOpen_Click);
            // 
            // rtbMetadata
            // 
            this.rtbMetadata.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.rtbMetadata.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.rtbMetadata.Font = new System.Drawing.Font("Segoe UI", 9.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rtbMetadata.Location = new System.Drawing.Point(8, 8);
            this.rtbMetadata.Name = "rtbMetadata";
            this.rtbMetadata.ReadOnly = true;
            this.rtbMetadata.Size = new System.Drawing.Size(568, 504);
            this.rtbMetadata.TabIndex = 0;
            this.rtbMetadata.Text = "";
            this.rtbMetadata.LinkClicked += new System.Windows.Forms.LinkClickedEventHandler(this.rtbMetadata_LinkClicked);
            // 
            // btnCopyAll
            // 
            this.btnCopyAll.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.btnCopyAll.Location = new System.Drawing.Point(136, 520);
            this.btnCopyAll.Name = "btnCopyAll";
            this.btnCopyAll.Size = new System.Drawing.Size(120, 32);
            this.btnCopyAll.TabIndex = 2;
            this.btnCopyAll.Text = "Copy all";
            this.btnCopyAll.UseVisualStyleBackColor = true;
            this.btnCopyAll.Click += new System.EventHandler(this.btnCopyAll_Click);
            // 
            // btnStripMetadata
            // 
            this.btnStripMetadata.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.btnStripMetadata.Location = new System.Drawing.Point(264, 520);
            this.btnStripMetadata.Name = "btnStripMetadata";
            this.btnStripMetadata.Size = new System.Drawing.Size(160, 32);
            this.btnStripMetadata.TabIndex = 3;
            this.btnStripMetadata.Text = "Strip metadata...";
            this.btnStripMetadata.UseVisualStyleBackColor = true;
            this.btnStripMetadata.Click += new System.EventHandler(this.btnStripMetadata_Click);
            // 
            // MetadataForm
            // 
            this.AllowDrop = true;
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(584, 561);
            this.Controls.Add(this.btnStripMetadata);
            this.Controls.Add(this.btnCopyAll);
            this.Controls.Add(this.rtbMetadata);
            this.Controls.Add(this.btnOpen);
            this.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.Margin = new System.Windows.Forms.Padding(4);
            this.MinimumSize = new System.Drawing.Size(500, 500);
            this.Name = "MetadataForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "ShareX - Metadata";
            this.Shown += new System.EventHandler(this.MetadataForm_Shown);
            this.DragDrop += new System.Windows.Forms.DragEventHandler(this.MetadataForm_DragDrop);
            this.DragEnter += new System.Windows.Forms.DragEventHandler(this.MetadataForm_DragEnter);
            this.ResumeLayout(false);

        }

        #endregion
        private System.Windows.Forms.Button btnOpen;
        private System.Windows.Forms.RichTextBox rtbMetadata;
        private System.Windows.Forms.Button btnCopyAll;
        private System.Windows.Forms.Button btnStripMetadata;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: MetadataForm.resx]---
Location: ShareX-develop/ShareX/Tools/MetadataForm.resx

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
</root>
```

--------------------------------------------------------------------------------

---[FILE: MonitorTestForm.ar-YE.resx]---
Location: ShareX-develop/ShareX/Tools/MonitorTestForm.ar-YE.resx

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
  <data name="cbShapes.Items1" xml:space="preserve">
    <value>خطوط رأسية</value>
  </data>
  <data name="btnClose.Text" xml:space="preserve">
    <value>إغلاق</value>
  </data>
  <data name="btnGradientColor1.Text" xml:space="preserve">
    <value>اللون 1</value>
  </data>
  <data name="btnGradientColor2.Text" xml:space="preserve">
    <value>اللون 2</value>
  </data>
  <data name="btnColorDialog.Text" xml:space="preserve">
    <value>نافذة الألوان...</value>
  </data>
  <data name="lblBlue.Text" xml:space="preserve">
    <value>أزرق:</value>
  </data>
  <data name="rbBlackWhite.Text" xml:space="preserve">
    <value>أسود، أبيض:</value>
  </data>
  <data name="lblRed.Text" xml:space="preserve">
    <value>أحمر:</value>
  </data>
  <data name="rbRedGreenBlue.Text" xml:space="preserve">
    <value>أحمر، أخضر، أزرق:</value>
  </data>
  <data name="rbShapes.Text" xml:space="preserve">
    <value>الشكل:</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - اختبار الشاشة</value>
  </data>
  <data name="lblShapeSize.Text" xml:space="preserve">
    <value>الحجم:</value>
  </data>
  <data name="btnScreenTearingTest.Text" xml:space="preserve">
    <value>بدء حركة الاختبار</value>
  </data>
  <data name="lblTip.Text" xml:space="preserve">
    <value>تلميح: انقر خارج الحدود لـ عرض/إخفاء هذه اللوحة.</value>
  </data>
  <data name="cbShapes.Items2" xml:space="preserve">
    <value>الفاحص</value>
  </data>
  <data name="lblGreen.Text" xml:space="preserve">
    <value>أخضر:</value>
  </data>
  <data name="rbGradient.Text" xml:space="preserve">
    <value>تدرج:</value>
  </data>
  <data name="cbShapes.Items" xml:space="preserve">
    <value>خطوط أأفقية</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: MonitorTestForm.cs]---
Location: ShareX-develop/ShareX/Tools/MonitorTestForm.cs

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
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace ShareX
{
    public partial class MonitorTestForm : Form
    {
        public MonitorTestForm()
        {
            InitializeComponent();
            ShareXResources.ApplyTheme(this, true);

            Rectangle screenBounds = CaptureHelpers.GetScreenBounds();
            Location = screenBounds.Location;
            Size = screenBounds.Size;

            rbBlackWhite.Checked = true;
            tbBlackWhite.Value = 255;
            tbRed.Value = 255;
            cbGradient.Items.AddRange(Helpers.GetLocalizedEnumDescriptions<LinearGradientMode>());
            cbGradient.SelectedIndex = 1;
            btnGradientColor1.Color = Color.White;
            btnGradientColor2.Color = Color.Black;
            cbShapes.SelectedIndex = 0;
            tbShapeSize.Value = 5;
        }

        private void SetBackColor()
        {
            SetBackColor(Color.White);
        }

        private void SetBackColor(Color color)
        {
            if (BackgroundImage != null)
            {
                Image temp = BackgroundImage;
                BackgroundImage = null;
                temp.Dispose();
            }

            BackColor = color;
        }

        private void DrawBlackWhite(int value)
        {
            Color color = Color.FromArgb(value, value, value);
            SetBackColor(color);
        }

        private void DrawRedGreenBlue(int red, int green, int blue)
        {
            Color color = Color.FromArgb(red, green, blue);
            SetBackColor(color);
        }

        private Bitmap DrawGradient(Color fromColor, Color toColor, LinearGradientMode gradientMode)
        {
            Bitmap bmp = new Bitmap(Width, Height);
            Rectangle rect = new Rectangle(0, 0, bmp.Width, bmp.Height);

            using (Graphics g = Graphics.FromImage(bmp))
            using (LinearGradientBrush brush = new LinearGradientBrush(rect, fromColor, toColor, gradientMode))
            {
                g.FillRectangle(brush, rect);
            }

            return bmp;
        }

        private Bitmap DrawHorizontalLine(int size, Color color)
        {
            Bitmap bmp = new Bitmap(1, size * 2);

            for (int i = 0; i < size; i++)
            {
                bmp.SetPixel(0, i, color);
            }

            return bmp;
        }

        private Bitmap DrawVerticalLine(int size, Color color)
        {
            Bitmap bmp = new Bitmap(size * 2, 1);

            for (int i = 0; i < size; i++)
            {
                bmp.SetPixel(i, 0, color);
            }

            return bmp;
        }

        private Bitmap DrawChecker(int size, Color color)
        {
            Bitmap bmp = new Bitmap(size * 2, size * 2);

            using (Graphics g = Graphics.FromImage(bmp))
            using (Brush brush = new SolidBrush(color))
            {
                g.FillRectangle(brush, new Rectangle(0, 0, size, size));
                g.FillRectangle(brush, new Rectangle(size, size, size, size));
            }

            return bmp;
        }

        private void DrawBlackWhite()
        {
            if (rbBlackWhite.Checked)
            {
                DrawBlackWhite(tbBlackWhite.Value);
            }
        }

        private void DrawRedGreenBlue()
        {
            if (rbRedGreenBlue.Checked)
            {
                DrawRedGreenBlue(tbRed.Value, tbGreen.Value, tbBlue.Value);
            }
        }

        private void DrawGradient()
        {
            if (rbGradient.Checked)
            {
                SetBackColor();

                Color color1 = btnGradientColor1.Color;
                Color color2 = btnGradientColor2.Color;
                LinearGradientMode gradientMode = (LinearGradientMode)cbGradient.SelectedIndex;
                BackgroundImage = DrawGradient(color1, color2, gradientMode);
            }
        }

        private void DrawSelectedShape()
        {
            if (rbShapes.Checked)
            {
                SetBackColor();

                int shapeSize = Math.Max(tbShapeSize.Value, 1);

                switch (cbShapes.SelectedIndex)
                {
                    case 0:
                        BackgroundImage = DrawHorizontalLine(shapeSize, Color.Black);
                        break;
                    case 1:
                        BackgroundImage = DrawVerticalLine(shapeSize, Color.Black);
                        break;
                    case 2:
                        BackgroundImage = DrawChecker(shapeSize, Color.Black);
                        break;
                }
            }
        }

        #region Form events

        private void MonitorTestForm_MouseDown(object sender, MouseEventArgs e)
        {
            bool visible = !pSettings.Visible;
            if (visible) pSettings.Location = e.Location;
            pSettings.Visible = visible;
        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            Close();
        }

        private void rbBlackWhite_CheckedChanged(object sender, EventArgs e)
        {
            DrawBlackWhite();
        }

        private void tbBlackWhite_ValueChanged(object sender, EventArgs e)
        {
            lblBlackWhiteValue.Text = tbBlackWhite.Value.ToString();
            DrawBlackWhite();
        }

        private void rbRedGreenBlue_CheckedChanged(object sender, EventArgs e)
        {
            DrawRedGreenBlue();
        }

        private void btnColorDialog_Click(object sender, EventArgs e)
        {
            Color currentColor = Color.FromArgb(tbRed.Value, tbGreen.Value, tbBlue.Value);

            if (ColorPickerForm.PickColor(currentColor, out Color newColor, this))
            {
                tbRed.Value = newColor.R;
                tbGreen.Value = newColor.G;
                tbBlue.Value = newColor.B;
                DrawRedGreenBlue();
            }
        }

        private void tbRedGreenBlue_ValueChanged(object sender, EventArgs e)
        {
            lblRedValue.Text = tbRed.Value.ToString();
            lblGreenValue.Text = tbGreen.Value.ToString();
            lblBlueValue.Text = tbBlue.Value.ToString();
            DrawRedGreenBlue();
        }

        private void rbGradient_CheckedChanged(object sender, EventArgs e)
        {
            DrawGradient();
        }

        private void cbGradient_SelectedIndexChanged(object sender, EventArgs e)
        {
            DrawGradient();
        }

        private void btnGradientColor1_ColorChanged(Color color)
        {
            DrawGradient();
        }

        private void btnGradientColor2_ColorChanged(Color color)
        {
            DrawGradient();
        }

        private void rbShapes_CheckedChanged(object sender, EventArgs e)
        {
            DrawSelectedShape();
        }

        private void cbShapes_SelectedIndexChanged(object sender, EventArgs e)
        {
            DrawSelectedShape();
        }

        private void tbShapeSize_ValueChanged(object sender, EventArgs e)
        {
            lblShapeSizeValue.Text = tbShapeSize.Value.ToString();
            DrawSelectedShape();
        }

        private void btnScreenTearingTest_Click(object sender, EventArgs e)
        {
            using (ScreenTearingTestForm screenTearingTestForm = new ScreenTearingTestForm())
            {
                screenTearingTestForm.ShowDialog();
            }
        }

        #endregion Form events
    }
}
```

--------------------------------------------------------------------------------

---[FILE: MonitorTestForm.de.resx]---
Location: ShareX-develop/ShareX/Tools/MonitorTestForm.de.resx

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
    <value>ShareX - Monitortest</value>
  </data>
  <data name="btnClose.Text" xml:space="preserve">
    <value>Schließen</value>
  </data>
  <data name="btnColorDialog.Text" xml:space="preserve">
    <value>Farben Dialog...</value>
  </data>
  <data name="btnGradientColor1.Text" xml:space="preserve">
    <value>Farbe 1</value>
  </data>
  <data name="btnGradientColor2.Text" xml:space="preserve">
    <value>Farbe 2</value>
  </data>
  <data name="cbShapes.Items" xml:space="preserve">
    <value>Horizontalelinien</value>
  </data>
  <data name="cbShapes.Items1" xml:space="preserve">
    <value>Vertikalelinien</value>
  </data>
  <data name="cbShapes.Items2" xml:space="preserve">
    <value>Schachbrettmuster</value>
  </data>
  <data name="lblBlue.Text" xml:space="preserve">
    <value>B:</value>
  </data>
  <data name="lblGreen.Text" xml:space="preserve">
    <value>G:</value>
  </data>
  <data name="lblRed.Text" xml:space="preserve">
    <value>Rot:</value>
  </data>
  <data name="lblShapeSize.Text" xml:space="preserve">
    <value>Größe:</value>
  </data>
  <data name="lblTip.Text" xml:space="preserve">
    <value>Tipp: Du kannst außerhalb klicken, um dieses Feld zu zeigen/verstecken.</value>
  </data>
  <data name="rbBlackWhite.Text" xml:space="preserve">
    <value>Schwarz, Weiß:</value>
  </data>
  <data name="rbGradient.Text" xml:space="preserve">
    <value>Neigung:</value>
  </data>
  <data name="rbRedGreenBlue.Text" xml:space="preserve">
    <value>Rot, Grün, Blau:</value>
  </data>
  <data name="rbShapes.Text" xml:space="preserve">
    <value>Form:</value>
  </data>
  <data name="btnScreenTearingTest.Text" xml:space="preserve">
    <value>Testanimation starten</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
