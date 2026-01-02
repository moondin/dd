---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 505
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 505 of 650)

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

---[FILE: TextDrawingInputBox.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Forms/TextDrawingInputBox.cs

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
using ShareX.ScreenCaptureLib.Properties;
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Linq;
using System.Windows.Forms;

namespace ShareX.ScreenCaptureLib
{
    internal partial class TextDrawingInputBox : Form
    {
        public string InputText { get; private set; }
        public TextDrawingOptions Options { get; private set; }
        public ColorPickerOptions ColorPickerOptions { get; private set; }

        private int processKeyCount;

        public TextDrawingInputBox(string text, TextDrawingOptions options, bool supportGradient, ColorPickerOptions colorPickerOptions)
        {
            InitializeComponent();
            ShareXResources.ApplyTheme(this, true);

            InputText = text;
            Options = options;
            ColorPickerOptions = colorPickerOptions;

            if (InputText != null)
            {
                txtInput.Text = InputText;
            }

            UpdateInputBox();

            cbFonts.Items.AddRange(FontFamily.Families.Select(x => x.Name).ToArray());

            if (cbFonts.Items.Contains(Options.Font))
            {
                cbFonts.SelectedItem = Options.Font;
            }
            else
            {
                cbFonts.SelectedItem = AnnotationOptions.DefaultFont;
            }

            nudTextSize.SetValue(Options.Size);

            btnTextColor.ColorPickerOptions = ColorPickerOptions;
            btnTextColor.Color = Options.Color;

            btnGradient.Visible = supportGradient;

            if (supportGradient)
            {
                tsmiEnableGradient.Checked = Options.Gradient;

                tsmiSecondColor.Image = ImageHelpers.CreateColorPickerIcon(Options.Color2, new Rectangle(0, 0, 16, 16));

                switch (Options.GradientMode)
                {
                    case LinearGradientMode.Horizontal:
                        tsrbmiGradientHorizontal.Checked = true;
                        break;
                    case LinearGradientMode.Vertical:
                        tsrbmiGradientVertical.Checked = true;
                        break;
                    case LinearGradientMode.ForwardDiagonal:
                        tsrbmiGradientForwardDiagonal.Checked = true;
                        break;
                    case LinearGradientMode.BackwardDiagonal:
                        tsrbmiGradientBackwardDiagonal.Checked = true;
                        break;
                }
            }

            cbBold.Checked = Options.Bold;
            cbItalic.Checked = Options.Italic;
            cbUnderline.Checked = Options.Underline;

            UpdateButtonImages();
            UpdateEnterTip();

            txtInput.SupportSelectAll();
        }

        private void Close(DialogResult result)
        {
            DialogResult = result;

            if (result == DialogResult.OK)
            {
                InputText = txtInput.Text;
            }

            Close();
        }

        private void UpdateEnterTip()
        {
            if (Options.EnterKeyNewLine)
            {
                lblTip.Text = Resources.NewLineEnterOKCtrlEnter;
            }
            else
            {
                lblTip.Text = Resources.NewLineCtrlEnterOKEnter;
            }
        }

        private void TextDrawingInputBox_Shown(object sender, EventArgs e)
        {
            this.ForceActivate();
        }

        private void cbFonts_SelectedIndexChanged(object sender, EventArgs e)
        {
            Options.Font = cbFonts.SelectedItem as string;
            UpdateInputBox();
        }

        private void nudTextSize_ValueChanged(object sender, EventArgs e)
        {
            Options.Size = (int)nudTextSize.Value;
            UpdateInputBox();
        }

        private void btnTextColor_ColorChanged(Color color)
        {
            Options.Color = btnTextColor.Color;
            UpdateInputBox();
        }

        private void btnGradient_Click(object sender, EventArgs e)
        {
            cmsGradient.Show(btnGradient, 1, btnGradient.Height + 1);
        }

        private void tsmiEnableGradient_Click(object sender, EventArgs e)
        {
            Options.Gradient = tsmiEnableGradient.Checked;
        }

        private void tsmiSecondColor_Click(object sender, EventArgs e)
        {
            ColorPickerForm.PickColor(Options.Color2, out Color newColor, this, null, ColorPickerOptions);
            Options.Color2 = newColor;
            if (tsmiSecondColor.Image != null) tsmiSecondColor.Image.Dispose();
            tsmiSecondColor.Image = ImageHelpers.CreateColorPickerIcon(Options.Color2, new Rectangle(0, 0, 16, 16));
        }

        private void tsrbmiGradientHorizontal_Click(object sender, EventArgs e)
        {
            Options.GradientMode = LinearGradientMode.Horizontal;
        }

        private void tsrbmiGradientVertical_Click(object sender, EventArgs e)
        {
            Options.GradientMode = LinearGradientMode.Vertical;
        }

        private void tsrbmiGradientForwardDiagonal_Click(object sender, EventArgs e)
        {
            Options.GradientMode = LinearGradientMode.ForwardDiagonal;
        }

        private void tsrbmiGradientBackwardDiagonal_Click(object sender, EventArgs e)
        {
            Options.GradientMode = LinearGradientMode.BackwardDiagonal;
        }

        private void cbBold_CheckedChanged(object sender, EventArgs e)
        {
            Options.Bold = cbBold.Checked;
            UpdateInputBox();
        }

        private void cbItalic_CheckedChanged(object sender, EventArgs e)
        {
            Options.Italic = cbItalic.Checked;
            UpdateInputBox();
        }

        private void cbUnderline_CheckedChanged(object sender, EventArgs e)
        {
            Options.Underline = cbUnderline.Checked;
            UpdateInputBox();
        }

        private void btnAlignmentHorizontal_Click(object sender, EventArgs e)
        {
            cmsAlignmentHorizontal.Show(btnAlignmentHorizontal, 1, btnAlignmentHorizontal.Height + 1);
        }

        private void tsmiAlignmentLeft_Click(object sender, EventArgs e)
        {
            Options.AlignmentHorizontal = StringAlignment.Near;
            UpdateHorizontalAlignmentImage();
            UpdateInputBox();
        }

        private void tsmiAlignmentCenter_Click(object sender, EventArgs e)
        {
            Options.AlignmentHorizontal = StringAlignment.Center;
            UpdateHorizontalAlignmentImage();
            UpdateInputBox();
        }

        private void tsmiAlignmentRight_Click(object sender, EventArgs e)
        {
            Options.AlignmentHorizontal = StringAlignment.Far;
            UpdateHorizontalAlignmentImage();
            UpdateInputBox();
        }

        private void btnAlignmentVertical_Click(object sender, EventArgs e)
        {
            cmsAlignmentVertical.Show(btnAlignmentVertical, 1, btnAlignmentVertical.Height + 1);
        }

        private void tsmiAlignmentTop_Click(object sender, EventArgs e)
        {
            Options.AlignmentVertical = StringAlignment.Near;
            UpdateVerticalAlignmentImage();
        }

        private void tsmiAlignmentMiddle_Click(object sender, EventArgs e)
        {
            Options.AlignmentVertical = StringAlignment.Center;
            UpdateVerticalAlignmentImage();
        }

        private void tsmiAlignmentBottom_Click(object sender, EventArgs e)
        {
            Options.AlignmentVertical = StringAlignment.Far;
            UpdateVerticalAlignmentImage();
        }

        private void txtInput_KeyDown(object sender, KeyEventArgs e)
        {
            Keys keyOK = Options.EnterKeyNewLine ? Keys.Control | Keys.Enter : Keys.Enter;

            // If we get VK_PROCESSKEY, the next KeyUp event will be fired by the IME
            // we should ignore these when checking if enter is pressed (GH-3621)
            if (e.KeyCode == Keys.ProcessKey)
            {
                processKeyCount += 1;
            }

            if (e.KeyData == keyOK || e.KeyData == Keys.Escape)
            {
                e.SuppressKeyPress = true;
            }
        }

        private void txtInput_KeyUp(object sender, KeyEventArgs e)
        {
            // If processKeyCount != 0, then this KeyUp event was fired by the
            // IME suggestion box, not by the user intentionally pressing Enter
            if (processKeyCount == 0)
            {
                Keys keyOK = Options.EnterKeyNewLine ? Keys.Control | Keys.Enter : Keys.Enter;

                if (e.KeyData == keyOK)
                {
                    Close(DialogResult.OK);
                }
                else if (e.KeyData == Keys.Escape)
                {
                    Close(DialogResult.Cancel);
                }
            }

            processKeyCount = Math.Max(0, processKeyCount - 1);
        }

        private void btnSwapEnterKey_Click(object sender, EventArgs e)
        {
            Options.EnterKeyNewLine = !Options.EnterKeyNewLine;
            UpdateEnterTip();
        }

        private void btnOK_Click(object sender, EventArgs e)
        {
            Close(DialogResult.OK);
        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            Close(DialogResult.Cancel);
        }

        private void UpdateInputBox()
        {
            Font font;

            try
            {
                font = new Font(Options.Font, Options.Size, Options.Style);
            }
            catch
            {
                Options.Font = AnnotationOptions.DefaultFont;
                font = new Font(Options.Font, Options.Size, Options.Style);
            }

            txtInput.Font = font;

            txtInput.ForeColor = Options.Color;
            txtInput.BackColor = ColorHelpers.VisibleColor(Options.Color, Color.White, Color.FromArgb(50, 50, 50));

            HorizontalAlignment horizontalAlignment;

            switch (Options.AlignmentHorizontal)
            {
                default:
                case StringAlignment.Near:
                    horizontalAlignment = HorizontalAlignment.Left;
                    break;
                case StringAlignment.Center:
                    horizontalAlignment = HorizontalAlignment.Center;
                    break;
                case StringAlignment.Far:
                    horizontalAlignment = HorizontalAlignment.Right;
                    break;
            }

            txtInput.TextAlign = horizontalAlignment;
        }

        private void UpdateButtonImages()
        {
            cbBold.Image = ShareXResources.IsDarkTheme ? Resources.edit_bold_white : Resources.edit_bold;
            cbItalic.Image = ShareXResources.IsDarkTheme ? Resources.edit_italic_white : Resources.edit_italic;
            cbUnderline.Image = ShareXResources.IsDarkTheme ? Resources.edit_underline_white : Resources.edit_underline;
            UpdateHorizontalAlignmentImage();
            UpdateVerticalAlignmentImage();
            tsmiAlignmentLeft.Image = ShareXResources.IsDarkTheme ? Resources.edit_alignment_white : Resources.edit_alignment;
            tsmiAlignmentCenter.Image = ShareXResources.IsDarkTheme ? Resources.edit_alignment_center_white : Resources.edit_alignment_center;
            tsmiAlignmentRight.Image = ShareXResources.IsDarkTheme ? Resources.edit_alignment_right_white : Resources.edit_alignment_right;
            tsmiAlignmentTop.Image = ShareXResources.IsDarkTheme ? Resources.edit_vertical_alignment_top_white : Resources.edit_vertical_alignment_top;
            tsmiAlignmentMiddle.Image = ShareXResources.IsDarkTheme ? Resources.edit_vertical_alignment_middle_white : Resources.edit_vertical_alignment_middle;
            tsmiAlignmentBottom.Image = ShareXResources.IsDarkTheme ? Resources.edit_vertical_alignment_white : Resources.edit_vertical_alignment;
        }

        private void UpdateHorizontalAlignmentImage()
        {
            switch (Options.AlignmentHorizontal)
            {
                default:
                case StringAlignment.Near:
                    btnAlignmentHorizontal.Image = ShareXResources.IsDarkTheme ? Resources.edit_alignment_white : Resources.edit_alignment;
                    break;
                case StringAlignment.Center:
                    btnAlignmentHorizontal.Image = ShareXResources.IsDarkTheme ? Resources.edit_alignment_center_white : Resources.edit_alignment_center;
                    break;
                case StringAlignment.Far:
                    btnAlignmentHorizontal.Image = ShareXResources.IsDarkTheme ? Resources.edit_alignment_right_white : Resources.edit_alignment_right;
                    break;
            }
        }

        private void UpdateVerticalAlignmentImage()
        {
            switch (Options.AlignmentVertical)
            {
                default:
                case StringAlignment.Near:
                    btnAlignmentVertical.Image = ShareXResources.IsDarkTheme ? Resources.edit_vertical_alignment_top_white : Resources.edit_vertical_alignment_top;
                    break;
                case StringAlignment.Center:
                    btnAlignmentVertical.Image = ShareXResources.IsDarkTheme ? Resources.edit_vertical_alignment_middle_white : Resources.edit_vertical_alignment_middle;
                    break;
                case StringAlignment.Far:
                    btnAlignmentVertical.Image = ShareXResources.IsDarkTheme ? Resources.edit_vertical_alignment_white : Resources.edit_vertical_alignment;
                    break;
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: TextDrawingInputBox.de.resx]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Forms/TextDrawingInputBox.de.resx

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
    <value>ShareX - Texteingabe</value>
  </data>
  <data name="lblFont.Text" xml:space="preserve">
    <value>Schriftart:</value>
  </data>
  <data name="lblTextSize.Text" xml:space="preserve">
    <value>Größe:</value>
  </data>
  <data name="btnTextColor.ToolTip" xml:space="preserve">
    <value>Textfarbe</value>
  </data>
  <data name="btnGradient.ToolTip" xml:space="preserve">
    <value>Gradient</value>
  </data>
  <data name="cbBold.ToolTip" xml:space="preserve">
    <value>Fett</value>
  </data>
  <data name="cbItalic.ToolTip" xml:space="preserve">
    <value>Kursiv</value>
  </data>
  <data name="cbUnderline.ToolTip" xml:space="preserve">
    <value>Unterstrichen</value>
  </data>
  <data name="btnAlignmentHorizontal.ToolTip" xml:space="preserve">
    <value>Horizontale Ausrichtung</value>
  </data>
  <data name="btnAlignmentVertical.ToolTip" xml:space="preserve">
    <value>Vertikale Ausrichtung</value>
  </data>
  <data name="btnOK.Text" xml:space="preserve">
    <value>Ok</value>
  </data>
  <data name="tsmiAlignmentLeft.Text" xml:space="preserve">
    <value>Links</value>
  </data>
  <data name="tsmiAlignmentCenter.Text" xml:space="preserve">
    <value>Zentriert</value>
  </data>
  <data name="tsmiAlignmentRight.Text" xml:space="preserve">
    <value>Rechts</value>
  </data>
  <data name="tsmiAlignmentTop.Text" xml:space="preserve">
    <value>Oben</value>
  </data>
  <data name="tsmiAlignmentMiddle.Text" xml:space="preserve">
    <value>Mittig</value>
  </data>
  <data name="tsmiAlignmentBottom.Text" xml:space="preserve">
    <value>Unten</value>
  </data>
  <data name="btnCancel.Text" xml:space="preserve">
    <value>Abbrechen</value>
  </data>
  <data name="tsmiEnableGradient.Text" xml:space="preserve">
    <value>Verlauf aktivieren</value>
  </data>
  <data name="tsmiSecondColor.Text" xml:space="preserve">
    <value>Sekundäre Textfarbe...</value>
  </data>
  <data name="tsrbmiGradientVertical.Text" xml:space="preserve">
    <value>Vertikal</value>
  </data>
  <data name="tsrbmiGradientForwardDiagonal.Text" xml:space="preserve">
    <value>Vorwärtsdiagonale</value>
  </data>
  <data name="tsrbmiGradientBackwardDiagonal.Text" xml:space="preserve">
    <value>Rückwärtsdiagonale</value>
  </data>
  <data name="tsmiGradientMode.Text" xml:space="preserve">
    <value>Verlaufsmodus</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
