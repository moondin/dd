---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 295
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 295 of 650)

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

---[FILE: MyMessageBox.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Forms/MyMessageBox.cs

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
using System.Drawing;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public class MyMessageBox : Form
    {
        private const int LabelHorizontalPadding = 15;
        private const int LabelVerticalPadding = 20;
        private const int ButtonPadding = 10;

        private DialogResult button1Result = DialogResult.OK;
        private DialogResult button2Result = DialogResult.No;

        public bool IsChecked { get; private set; }

        public MyMessageBox(string text, string caption, MessageBoxButtons buttons = MessageBoxButtons.OK, string checkBoxText = null, bool isChecked = false)
        {
            Width = 180;
            Height = 100;
            Text = caption;
            BackColor = SystemColors.Window;
            FormBorderStyle = FormBorderStyle.FixedDialog;
            TopMost = true;
            StartPosition = FormStartPosition.CenterScreen;
            MinimizeBox = false;
            MaximizeBox = false;

            Shown += MyMessageBox_Shown;

            Label labelText = new Label();
            labelText.Margin = new Padding(0);
            labelText.Font = SystemFonts.MessageBoxFont;
            labelText.TextAlign = ContentAlignment.MiddleLeft;
            labelText.AutoSize = true;
            labelText.MinimumSize = new Size(125, 0);
            labelText.MaximumSize = new Size(400, 400);
            labelText.Location = new Point(0, 0);
            labelText.Text = text;

            Button button1 = new Button();
            button1.Margin = new Padding(0, ButtonPadding, ButtonPadding, ButtonPadding);
            button1.BackColor = Color.Transparent;
            button1.Size = new Size(80, 26);
            button1.UseVisualStyleBackColor = false;
            button1.Text = "button1";
            button1.TabIndex = 0;
            button1.Click += (sender, e) =>
            {
                DialogResult = button1Result;
                Close();
            };

            Button button2 = new Button();
            button2.Margin = new Padding(0, ButtonPadding, ButtonPadding, ButtonPadding);
            button2.BackColor = Color.Transparent;
            button2.Size = new Size(80, 26);
            button2.UseVisualStyleBackColor = false;
            button2.Text = "button2";
            button2.TabIndex = 1;
            button2.Click += (sender, e) =>
            {
                DialogResult = button2Result;
                Close();
            };

            switch (buttons)
            {
                default:
                case MessageBoxButtons.OK:
                    button1.Text = Resources.MyMessageBox_MyMessageBox_OK;
                    button1Result = DialogResult.OK;
                    button2.Visible = false;
                    break;
                case MessageBoxButtons.OKCancel:
                    button1.Text = Resources.MyMessageBox_MyMessageBox_OK;
                    button1Result = DialogResult.OK;
                    button2.Text = Resources.MyMessageBox_MyMessageBox_Cancel;
                    button2Result = DialogResult.Cancel;
                    break;
                case MessageBoxButtons.YesNo:
                    button1.Text = Resources.MyMessageBox_MyMessageBox_Yes;
                    button1Result = DialogResult.Yes;
                    button2.Text = Resources.MyMessageBox_MyMessageBox_No;
                    button2Result = DialogResult.No;
                    break;
            }

            FlowLayoutPanel panel = new FlowLayoutPanel();
            panel.BackColor = Color.FromArgb(240, 240, 240);
            panel.FlowDirection = FlowDirection.RightToLeft;

            FlowLayoutPanel labelPanel = new FlowLayoutPanel();
            labelPanel.FlowDirection = FlowDirection.TopDown;
            labelPanel.AutoSize = true;
            labelPanel.AutoSizeMode = AutoSizeMode.GrowAndShrink;
            labelPanel.Location = new Point(LabelHorizontalPadding, LabelVerticalPadding);

            labelPanel.Controls.Add(labelText);

            if (checkBoxText != null)
            {
                IsChecked = isChecked;

                CheckBox checkBox = new CheckBox();
                checkBox.Font = SystemFonts.MessageBoxFont;
                checkBox.Margin = new Padding(2, LabelVerticalPadding, 0, 0);
                checkBox.AutoSize = true;
                checkBox.Text = checkBoxText;
                checkBox.CheckedChanged += (sender, e) => IsChecked = checkBox.Checked;
                labelPanel.Controls.Add(checkBox);
            }

            panel.Controls.Add(button2);
            panel.Controls.Add(button1);
            Controls.Add(labelPanel);
            Controls.Add(panel);

            panel.Location = new Point(0, labelPanel.Bottom + LabelVerticalPadding);
            panel.Size = new Size(labelPanel.Width + (LabelHorizontalPadding * 2), button1.Height + (ButtonPadding * 2));
            ClientSize = new Size(panel.Width, labelPanel.Height + (LabelVerticalPadding * 2) + panel.Height);

            ShareXResources.ApplyTheme(this);

            panel.BackColor = ShareXResources.Theme.BorderColor;
        }

        private void MyMessageBox_Shown(object sender, EventArgs e)
        {
            this.ForceActivate();
        }

        public static DialogResult Show(string text, string caption, MessageBoxButtons buttons = MessageBoxButtons.OK)
        {
            using (MyMessageBox messageBox = new MyMessageBox(text, caption, buttons))
            {
                return messageBox.ShowDialog();
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: OutputBox.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Forms/OutputBox.cs

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
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public partial class OutputBox : Form
    {
        public bool ScrollToEnd { get; private set; }

        private OutputBox(string text, string title, bool scrollToEnd = false)
        {
            InitializeComponent();
            rtbText.AddContextMenu();
            ShareXResources.ApplyTheme(this, true);

            Text = "ShareX - " + title;
            rtbText.Text = text;
            ScrollToEnd = scrollToEnd;
        }

        public static void Show(string text, string title, bool scrollToEnd = false)
        {
            using (OutputBox outputBox = new OutputBox(text, title, scrollToEnd))
            {
                outputBox.ShowDialog();
            }
        }

        private void OutputBox_Shown(object sender, EventArgs e)
        {
            this.ForceActivate();

            rtbText.SelectionStart = rtbText.TextLength;

            if (ScrollToEnd)
            {
                NativeMethods.SendMessage(rtbText.Handle, (int)WindowsMessages.VSCROLL, (int)ScrollBarCommands.SB_BOTTOM, 0);
            }
            else
            {
                NativeMethods.SendMessage(rtbText.Handle, (int)WindowsMessages.VSCROLL, (int)ScrollBarCommands.SB_TOP, 0);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: OutputBox.Designer.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Forms/OutputBox.Designer.cs

```csharp
namespace ShareX.HelpersLib
{
    partial class OutputBox
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
            this.rtbText = new System.Windows.Forms.RichTextBox();
            this.SuspendLayout();
            // 
            // rtbText
            // 
            this.rtbText.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.rtbText.Dock = System.Windows.Forms.DockStyle.Fill;
            this.rtbText.Font = new System.Drawing.Font("Segoe UI", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rtbText.Location = new System.Drawing.Point(8, 8);
            this.rtbText.Name = "rtbText";
            this.rtbText.ReadOnly = true;
            this.rtbText.Size = new System.Drawing.Size(968, 745);
            this.rtbText.TabIndex = 1;
            this.rtbText.Text = "";
            // 
            // OutputBox
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(96F, 96F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            this.ClientSize = new System.Drawing.Size(984, 761);
            this.Controls.Add(this.rtbText);
            this.Name = "OutputBox";
            this.Padding = new System.Windows.Forms.Padding(8);
            this.SizeGripStyle = System.Windows.Forms.SizeGripStyle.Hide;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Shown += new System.EventHandler(this.OutputBox_Shown);
            this.ResumeLayout(false);

        }

        #endregion
        private System.Windows.Forms.RichTextBox rtbText;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: OutputBox.resx]---
Location: ShareX-develop/ShareX.HelpersLib/Forms/OutputBox.resx

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

---[FILE: PrintForm.ar-YE.resx]---
Location: ShareX-develop/ShareX.HelpersLib/Forms/PrintForm.ar-YE.resx

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
  <data name="btnCancel.Text" xml:space="preserve">
    <value>إلغاء</value>
  </data>
  <data name="cbCenterImage.Text" xml:space="preserve">
    <value>توسيط الصورة</value>
  </data>
  <data name="cbAllowEnlarge.Text" xml:space="preserve">
    <value>السماح للصور بالتوسّع</value>
  </data>
  <data name="btnPrint.Text" xml:space="preserve">
    <value>طباعة...</value>
  </data>
  <data name="cbAutoRotate.Text" xml:space="preserve">
    <value>تدوير تلقائي للصور</value>
  </data>
  <data name="cbAutoScale.Text" xml:space="preserve">
    <value>توسيع تلقائي للصور</value>
  </data>
  <data name="lblMargin.Text" xml:space="preserve">
    <value>حجم الهوامش:</value>
  </data>
  <data name="btnShowPreview.Text" xml:space="preserve">
    <value>معاينة...</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - إعدادات الطباعة</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: PrintForm.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Forms/PrintForm.cs

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
using System.Drawing;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public partial class PrintForm : Form
    {
        private PrintHelper printHelper;
        private PrintSettings printSettings;

        public PrintForm(Image img, PrintSettings settings, bool previewOnly = false)
        {
            InitializeComponent();
            ShareXResources.ApplyTheme(this, true);

            printHelper = new PrintHelper(img);
            printHelper.Settings = printSettings = settings;
            btnPrint.Enabled = !previewOnly;
            LoadSettings();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (components != null)
                {
                    components.Dispose();
                }

                if (printHelper != null)
                {
                    printHelper.Dispose();
                }
            }

            base.Dispose(disposing);
        }

        private void PrintForm_Shown(object sender, EventArgs e)
        {
            this.ForceActivate();
        }

        private void LoadSettings()
        {
            nudMargin.SetValue(printSettings.Margin);
            cbAutoRotate.Checked = printSettings.AutoRotateImage;
            cbAutoScale.Checked = printSettings.AutoScaleImage;
            cbAllowEnlarge.Checked = printSettings.AllowEnlargeImage;
            cbCenterImage.Checked = printSettings.CenterImage;
            cbAllowEnlarge.Enabled = printSettings.AutoScaleImage;
            cbCenterImage.Enabled = printSettings.AutoScaleImage;

            string printText = Resources.PrintForm_LoadSettings_Print;
            if (printSettings.ShowPrintDialog) printText += "...";
            btnPrint.Text = printText;
        }

        private void btnPrint_Click(object sender, EventArgs e)
        {
            printHelper.Print();

            DialogResult = DialogResult.OK;
            Close();
        }

        private void btnShowPreview_Click(object sender, EventArgs e)
        {
            printHelper.ShowPreview();
        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            DialogResult = DialogResult.Cancel;
            Close();
        }

        private void nudMargin_ValueChanged(object sender, EventArgs e)
        {
            printSettings.Margin = (int)nudMargin.Value;
        }

        private void cbAutoRotate_CheckedChanged(object sender, EventArgs e)
        {
            printSettings.AutoRotateImage = cbAutoRotate.Checked;
        }

        private void cbAutoScale_CheckedChanged(object sender, EventArgs e)
        {
            printSettings.AutoScaleImage = cbAutoScale.Checked;
            cbAllowEnlarge.Enabled = printSettings.AutoScaleImage;
            cbCenterImage.Enabled = printSettings.AutoScaleImage;
        }

        private void cbAllowEnlarge_CheckedChanged(object sender, EventArgs e)
        {
            printSettings.AllowEnlargeImage = cbAllowEnlarge.Checked;
        }

        private void cbCenterImage_CheckedChanged(object sender, EventArgs e)
        {
            printSettings.CenterImage = cbCenterImage.Checked;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: PrintForm.de.resx]---
Location: ShareX-develop/ShareX.HelpersLib/Forms/PrintForm.de.resx

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
    <value>ShareX - Druckeinstellungen</value>
  </data>
  <data name="btnCancel.Text" xml:space="preserve">
    <value>Abbrechen</value>
  </data>
  <data name="btnPrint.Text" xml:space="preserve">
    <value>Drucken...</value>
  </data>
  <data name="btnShowPreview.Text" xml:space="preserve">
    <value>Vorschau...</value>
  </data>
  <data name="cbAllowEnlarge.Text" xml:space="preserve">
    <value>Erlauben das Bild zu vergrößern</value>
  </data>
  <data name="cbAutoRotate.Text" xml:space="preserve">
    <value>Bild automatisch drehen</value>
  </data>
  <data name="cbAutoScale.Text" xml:space="preserve">
    <value>Bild automatisch skalieren</value>
  </data>
  <data name="lblMargin.Text" xml:space="preserve">
    <value>Rand:</value>
  </data>
  <data name="cbCenterImage.Text" xml:space="preserve">
    <value>Bildposition zentrieren</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
