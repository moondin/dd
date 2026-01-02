---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 214
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 214 of 650)

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

---[FILE: OCRForm.cs]---
Location: ShareX-develop/ShareX/Tools/OCR/OCRForm.cs

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
using ShareX.ScreenCaptureLib;
using System;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ShareX
{
    public partial class OCRForm : Form
    {
        public OCROptions Options { get; set; }
        public string Result { get; private set; }

        private Bitmap bmpSource;
        private bool loaded;
        private bool busy;

        public OCRForm(Bitmap bmp, OCROptions options)
        {
            bmpSource = (Bitmap)bmp.Clone();
            Options = options;

            InitializeComponent();
            ShareXResources.ApplyTheme(this, true);

            OCRLanguage[] languages = OCRHelper.AvailableLanguages.OrderBy(x => x.DisplayName).ToArray();

            if (languages.Length > 0)
            {
                cbLanguages.Items.AddRange(languages);

                if (Options.Language == null)
                {
                    cbLanguages.SelectedIndex = 0;
                    Options.Language = languages[0].LanguageTag;
                }
                else
                {
                    int index = Array.FindIndex(languages, x => x.LanguageTag.Equals(Options.Language, StringComparison.OrdinalIgnoreCase));

                    if (index >= 0)
                    {
                        cbLanguages.SelectedIndex = index;
                    }
                    else
                    {
                        cbLanguages.SelectedIndex = 0;
                        Options.Language = languages[0].LanguageTag;
                    }
                }
            }
            else
            {
                cbLanguages.Enabled = false;
            }

            nudScaleFactor.SetValue((decimal)Options.ScaleFactor);
            cbSingleLine.Checked = Options.SingleLine;

            if (Helpers.IsDefaultSettings(Options.ServiceLinks, OCROptions.DefaultServiceLinks, (x, y) => x.Name == y.Name))
            {
                Options.ServiceLinks = OCROptions.DefaultServiceLinks;
            }

            if (Options.ServiceLinks.Count > 0)
            {
                cbServices.Items.AddRange(Options.ServiceLinks.ToArray());
                cbServices.SelectedIndex = Options.SelectedServiceLink;
            }
            else
            {
                cbServices.Enabled = false;
            }

            txtResult.SupportSelectAll();
            UpdateControls();

            loaded = true;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                components?.Dispose();
                bmpSource?.Dispose();
            }

            base.Dispose(disposing);
        }

        private void UpdateControls()
        {
            if (busy)
            {
                Cursor = Cursors.WaitCursor;
            }
            else
            {
                Cursor = Cursors.Default;
            }

            btnSelectRegion.Enabled = !busy;
            cbLanguages.Enabled = !busy;
            nudScaleFactor.Enabled = !busy;
            cbSingleLine.Enabled = !busy;
        }

        private async Task OCR(Bitmap bmp)
        {
            if (bmp != null && !string.IsNullOrEmpty(Options.Language))
            {
                busy = true;
                txtResult.Text = "";
                UpdateControls();

                try
                {
                    Result = await OCRHelper.OCR(bmp, Options.Language, Options.ScaleFactor, Options.SingleLine);

                    if (Options.AutoCopy && !string.IsNullOrEmpty(Result))
                    {
                        ClipboardHelpers.CopyText(Result);
                    }
                }
                catch (Exception e)
                {
                    e.ShowError(false);
                }

                if (!IsDisposed)
                {
                    busy = false;
                    txtResult.Text = Result;
                    txtResult.Focus();
                    txtResult.DeselectAll();
                    UpdateControls();
                }
            }
        }

        private async void OCRForm_Shown(object sender, EventArgs e)
        {
            await OCR(bmpSource);
        }

        private async void btnSelectRegion_Click(object sender, EventArgs e)
        {
            FormWindowState previousState = WindowState;
            WindowState = FormWindowState.Minimized;
            await Task.Delay(250);
            Bitmap regionImage = RegionCaptureTasks.GetRegionImage();
            WindowState = previousState;

            if (regionImage != null)
            {
                bmpSource?.Dispose();
                bmpSource = regionImage;
                await Task.Delay(250);
                await OCR(bmpSource);
            }
        }

        private async void cbLanguages_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (loaded)
            {
                Options.Language = ((OCRLanguage)cbLanguages.SelectedItem).LanguageTag;

                await OCR(bmpSource);
            }
        }

        private void btnOpenOCRHelp_Click(object sender, EventArgs e)
        {
            URLHelpers.OpenURL(Links.DocsOCR);
        }

        private async void nudScaleFactor_ValueChanged(object sender, EventArgs e)
        {
            if (loaded)
            {
                Options.ScaleFactor = (float)nudScaleFactor.Value;

                await OCR(bmpSource);
            }
        }

        private async void cbSingleLine_CheckedChanged(object sender, EventArgs e)
        {
            if (loaded)
            {
                Options.SingleLine = cbSingleLine.Checked;

                await OCR(bmpSource);
            }
        }

        private void cbServices_SelectedIndexChanged(object sender, EventArgs e)
        {
            Options.SelectedServiceLink = cbServices.SelectedIndex;
        }

        private void btnOpenServiceLink_Click(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(Result) && cbServices.SelectedItem is ServiceLink serviceLink)
            {
                serviceLink.OpenLink(Result);

                if (Options.CloseWindowAfterOpeningServiceLink)
                {
                    Close();
                }
            }
        }

        private void cbEditServices_Click(object sender, EventArgs e)
        {
            using (ServiceLinksForm form = new ServiceLinksForm(Options.ServiceLinks))
            {
                form.ShowDialog();

                cbServices.Items.Clear();

                if (Options.ServiceLinks.Count > 0)
                {
                    cbServices.Items.AddRange(Options.ServiceLinks.ToArray());
                    cbServices.SelectedIndex = 0;
                    Options.SelectedServiceLink = 0;
                }

                cbServices.Enabled = cbServices.Items.Count > 0;
            }
        }

        private void btnCopyAll_Click(object sender, EventArgs e)
        {
            ClipboardHelpers.CopyText(txtResult.Text);
        }

        private void txtResult_TextChanged(object sender, EventArgs e)
        {
            Result = txtResult.Text.Trim();
            btnOpenServiceLink.Enabled = btnCopyAll.Enabled = !string.IsNullOrEmpty(Result);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: OCRForm.de.resx]---
Location: ShareX-develop/ShareX/Tools/OCR/OCRForm.de.resx

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
    <value>ShareX - Optische Zeichenerkennung</value>
  </data>
  <data name="lblLanguage.Text" xml:space="preserve">
    <value>Sprache:</value>
  </data>
  <data name="lblResult.Text" xml:space="preserve">
    <value>Ergebnis:</value>
  </data>
  <data name="lblScaleFactor.Text" xml:space="preserve">
    <value>Skalierungsfaktor:</value>
  </data>
  <data name="btnOpenServiceLink.Text" xml:space="preserve">
    <value>Service-Link öffnen...</value>
  </data>
  <data name="lblService.Text" xml:space="preserve">
    <value>Service:</value>
  </data>
  <data name="btnSelectRegion.Text" xml:space="preserve">
    <value>Region für OCR wählen...</value>
  </data>
  <data name="cbSingleLine.Text" xml:space="preserve">
    <value>Einzelne Linie</value>
  </data>
  <data name="btnCopyAll.Text" xml:space="preserve">
    <value>Alles kopieren</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: OCRForm.Designer.cs]---
Location: ShareX-develop/ShareX/Tools/OCR/OCRForm.Designer.cs

```csharp
namespace ShareX
{
    partial class OCRForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(OCRForm));
            this.lblLanguage = new System.Windows.Forms.Label();
            this.cbLanguages = new System.Windows.Forms.ComboBox();
            this.lblResult = new System.Windows.Forms.Label();
            this.txtResult = new System.Windows.Forms.TextBox();
            this.lblScaleFactor = new System.Windows.Forms.Label();
            this.nudScaleFactor = new System.Windows.Forms.NumericUpDown();
            this.cbServices = new System.Windows.Forms.ComboBox();
            this.btnOpenServiceLink = new System.Windows.Forms.Button();
            this.cbEditServices = new System.Windows.Forms.Button();
            this.btnOpenOCRHelp = new System.Windows.Forms.Button();
            this.lblService = new System.Windows.Forms.Label();
            this.btnSelectRegion = new System.Windows.Forms.Button();
            this.cbSingleLine = new System.Windows.Forms.CheckBox();
            this.btnCopyAll = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.nudScaleFactor)).BeginInit();
            this.SuspendLayout();
            // 
            // lblLanguage
            // 
            resources.ApplyResources(this.lblLanguage, "lblLanguage");
            this.lblLanguage.Name = "lblLanguage";
            // 
            // cbLanguages
            // 
            this.cbLanguages.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            resources.ApplyResources(this.cbLanguages, "cbLanguages");
            this.cbLanguages.FormattingEnabled = true;
            this.cbLanguages.Name = "cbLanguages";
            this.cbLanguages.SelectedIndexChanged += new System.EventHandler(this.cbLanguages_SelectedIndexChanged);
            // 
            // lblResult
            // 
            resources.ApplyResources(this.lblResult, "lblResult");
            this.lblResult.Name = "lblResult";
            // 
            // txtResult
            // 
            resources.ApplyResources(this.txtResult, "txtResult");
            this.txtResult.Name = "txtResult";
            this.txtResult.TextChanged += new System.EventHandler(this.txtResult_TextChanged);
            // 
            // lblScaleFactor
            // 
            resources.ApplyResources(this.lblScaleFactor, "lblScaleFactor");
            this.lblScaleFactor.Name = "lblScaleFactor";
            // 
            // nudScaleFactor
            // 
            this.nudScaleFactor.DecimalPlaces = 1;
            resources.ApplyResources(this.nudScaleFactor, "nudScaleFactor");
            this.nudScaleFactor.Increment = new decimal(new int[] {
            5,
            0,
            0,
            65536});
            this.nudScaleFactor.Maximum = new decimal(new int[] {
            4,
            0,
            0,
            0});
            this.nudScaleFactor.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.nudScaleFactor.Name = "nudScaleFactor";
            this.nudScaleFactor.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.nudScaleFactor.ValueChanged += new System.EventHandler(this.nudScaleFactor_ValueChanged);
            // 
            // cbServices
            // 
            this.cbServices.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            resources.ApplyResources(this.cbServices, "cbServices");
            this.cbServices.FormattingEnabled = true;
            this.cbServices.Name = "cbServices";
            this.cbServices.SelectedIndexChanged += new System.EventHandler(this.cbServices_SelectedIndexChanged);
            // 
            // btnOpenServiceLink
            // 
            resources.ApplyResources(this.btnOpenServiceLink, "btnOpenServiceLink");
            this.btnOpenServiceLink.Name = "btnOpenServiceLink";
            this.btnOpenServiceLink.UseVisualStyleBackColor = true;
            this.btnOpenServiceLink.Click += new System.EventHandler(this.btnOpenServiceLink_Click);
            // 
            // cbEditServices
            // 
            this.cbEditServices.Image = global::ShareX.Properties.Resources.gear;
            resources.ApplyResources(this.cbEditServices, "cbEditServices");
            this.cbEditServices.Name = "cbEditServices";
            this.cbEditServices.UseVisualStyleBackColor = true;
            this.cbEditServices.Click += new System.EventHandler(this.cbEditServices_Click);
            // 
            // btnOpenOCRHelp
            // 
            resources.ApplyResources(this.btnOpenOCRHelp, "btnOpenOCRHelp");
            this.btnOpenOCRHelp.Image = global::ShareX.Properties.Resources.question;
            this.btnOpenOCRHelp.Name = "btnOpenOCRHelp";
            this.btnOpenOCRHelp.UseVisualStyleBackColor = true;
            this.btnOpenOCRHelp.Click += new System.EventHandler(this.btnOpenOCRHelp_Click);
            // 
            // lblService
            // 
            resources.ApplyResources(this.lblService, "lblService");
            this.lblService.Name = "lblService";
            // 
            // btnSelectRegion
            // 
            resources.ApplyResources(this.btnSelectRegion, "btnSelectRegion");
            this.btnSelectRegion.Name = "btnSelectRegion";
            this.btnSelectRegion.UseVisualStyleBackColor = true;
            this.btnSelectRegion.Click += new System.EventHandler(this.btnSelectRegion_Click);
            // 
            // cbSingleLine
            // 
            resources.ApplyResources(this.cbSingleLine, "cbSingleLine");
            this.cbSingleLine.Name = "cbSingleLine";
            this.cbSingleLine.UseVisualStyleBackColor = true;
            this.cbSingleLine.CheckedChanged += new System.EventHandler(this.cbSingleLine_CheckedChanged);
            // 
            // btnCopyAll
            // 
            resources.ApplyResources(this.btnCopyAll, "btnCopyAll");
            this.btnCopyAll.Name = "btnCopyAll";
            this.btnCopyAll.UseVisualStyleBackColor = true;
            this.btnCopyAll.Click += new System.EventHandler(this.btnCopyAll_Click);
            // 
            // OCRForm
            // 
            resources.ApplyResources(this, "$this");
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.btnCopyAll);
            this.Controls.Add(this.cbSingleLine);
            this.Controls.Add(this.lblService);
            this.Controls.Add(this.btnOpenOCRHelp);
            this.Controls.Add(this.btnSelectRegion);
            this.Controls.Add(this.cbEditServices);
            this.Controls.Add(this.btnOpenServiceLink);
            this.Controls.Add(this.cbServices);
            this.Controls.Add(this.nudScaleFactor);
            this.Controls.Add(this.lblScaleFactor);
            this.Controls.Add(this.txtResult);
            this.Controls.Add(this.lblResult);
            this.Controls.Add(this.cbLanguages);
            this.Controls.Add(this.lblLanguage);
            this.Name = "OCRForm";
            this.SizeGripStyle = System.Windows.Forms.SizeGripStyle.Hide;
            this.Shown += new System.EventHandler(this.OCRForm_Shown);
            ((System.ComponentModel.ISupportInitialize)(this.nudScaleFactor)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label lblLanguage;
        private System.Windows.Forms.ComboBox cbLanguages;
        private System.Windows.Forms.Label lblResult;
        private System.Windows.Forms.TextBox txtResult;
        private System.Windows.Forms.Label lblScaleFactor;
        private System.Windows.Forms.NumericUpDown nudScaleFactor;
        private System.Windows.Forms.ComboBox cbServices;
        private System.Windows.Forms.Button btnOpenServiceLink;
        private System.Windows.Forms.Button cbEditServices;
        private System.Windows.Forms.Button btnOpenOCRHelp;
        private System.Windows.Forms.Label lblService;
        private System.Windows.Forms.Button btnSelectRegion;
        private System.Windows.Forms.CheckBox cbSingleLine;
        private System.Windows.Forms.Button btnCopyAll;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: OCRForm.es-MX.resx]---
Location: ShareX-develop/ShareX/Tools/OCR/OCRForm.es-MX.resx

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
  <data name="lblLanguage.Text" xml:space="preserve">
    <value>Idioma:</value>
  </data>
  <data name="lblResult.Text" xml:space="preserve">
    <value>Resultado:</value>
  </data>
  <data name="lblScaleFactor.Text" xml:space="preserve">
    <value>Factor de escalado:</value>
  </data>
  <data name="btnOpenServiceLink.Text" xml:space="preserve">
    <value>Abrir enlace de servicio...</value>
  </data>
  <data name="lblService.Text" xml:space="preserve">
    <value>Servicio:</value>
  </data>
  <data name="btnSelectRegion.Text" xml:space="preserve">
    <value>Seleccionar región para OCR...</value>
  </data>
  <data name="cbSingleLine.Text" xml:space="preserve">
    <value>Línea única</value>
  </data>
  <data name="btnCopyAll.Text" xml:space="preserve">
    <value>Copiar todo</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - Reconocimiento óptico de caracteres</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: OCRForm.fr.resx]---
Location: ShareX-develop/ShareX/Tools/OCR/OCRForm.fr.resx

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
  <data name="lblLanguage.Text" xml:space="preserve">
    <value>Langue :</value>
  </data>
  <data name="lblResult.Text" xml:space="preserve">
    <value>Résultat :</value>
  </data>
  <data name="lblScaleFactor.Text" xml:space="preserve">
    <value>Echelle :</value>
  </data>
  <data name="btnOpenServiceLink.Text" xml:space="preserve">
    <value>Ouvrir le lien du service...</value>
  </data>
  <data name="lblService.Text" xml:space="preserve">
    <value>Service :</value>
  </data>
  <data name="btnSelectRegion.Text" xml:space="preserve">
    <value>Sélectionner la région pour l'OCR...</value>
  </data>
  <data name="cbSingleLine.Text" xml:space="preserve">
    <value>Ligne simple</value>
  </data>
  <data name="btnCopyAll.Text" xml:space="preserve">
    <value>Copier tout</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - Reconnaissance optique de caractères</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
