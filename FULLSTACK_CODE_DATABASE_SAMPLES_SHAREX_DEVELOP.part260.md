---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 260
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 260 of 650)

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

---[FILE: ColorPickerForm.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Forms/ColorPickerForm.cs

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
using System.Drawing;
using System.Threading;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public partial class ColorPickerForm : Form
    {
        public Func<PointInfo> OpenScreenColorPicker;

        public MyColor NewColor { get; private set; }
        public MyColor OldColor { get; private set; }
        public bool IsScreenColorPickerMode { get; private set; }
        public ColorPickerOptions Options { get; private set; }

        private bool oldColorExist;
        private bool controlChangingColor;
        private ControlHider clipboardStatusHider;

        public ColorPickerForm(Color currentColor, bool isScreenColorPickerMode = false, bool checkClipboard = true, ColorPickerOptions options = null)
        {
            InitializeComponent();
            ShareXResources.ApplyTheme(this, true);
            clipboardStatusHider = new ControlHider(btnClipboardStatus, 2000);

            IsScreenColorPickerMode = isScreenColorPickerMode;
            Options = options;

            if (Options == null)
            {
                Options = new ColorPickerOptions();
            }

            if (Options.RecentColorsSelected)
            {
                rbRecentColors.Checked = true;
            }
            else
            {
                rbStandardColors.Checked = true;
            }

            PrepareColorPalette();
            SetCurrentColor(currentColor, !IsScreenColorPickerMode);

            if (checkClipboard)
            {
                CheckClipboard();
            }

            btnOK.Visible = btnCancel.Visible = !IsScreenColorPickerMode;
            mbCopy.Visible = btnClose.Visible = pCursorPosition.Visible = IsScreenColorPickerMode;
        }

        public void EnableScreenColorPickerButton(Func<PointInfo> openScreenColorPicker)
        {
            OpenScreenColorPicker = openScreenColorPicker;
            btnScreenColorPicker.Visible = true;
        }

        public bool CheckClipboard()
        {
            string text = ClipboardHelpers.GetText(true);

            if (!string.IsNullOrEmpty(text))
            {
                text = text.Trim();

                if (ColorHelpers.ParseColor(text, out Color clipboardColor))
                {
                    colorPicker.ChangeColor(clipboardColor);
                    btnClipboardStatus.Text = "Clipboard: " + text;
                    btnClipboardStatus.Location = new Point(btnClipboardColorPicker.Left + (btnClipboardColorPicker.Width / 2) - (btnClipboardStatus.Width / 2),
                        btnClipboardColorPicker.Top - btnClipboardStatus.Height - 5);
                    clipboardStatusHider.Show();
                    return true;
                }
            }

            return false;
        }

        public static bool PickColor(Color currentColor, out Color newColor, Form owner = null, Func<PointInfo> openScreenColorPicker = null, ColorPickerOptions options = null)
        {
            using (ColorPickerForm dialog = new ColorPickerForm(currentColor, options: options))
            {
                if (openScreenColorPicker != null)
                {
                    dialog.EnableScreenColorPickerButton(openScreenColorPicker);
                }

                if (dialog.ShowDialogTopMost(owner) == DialogResult.OK)
                {
                    newColor = dialog.NewColor;
                    return true;
                }
            }

            newColor = currentColor;
            return false;
        }

        private void PrepareColorPalette()
        {
            flpColorPalette.Controls.Clear();

            Color[] colors;

            if (Options.RecentColorsSelected)
            {
                colors = HelpersOptions.RecentColors.ToArray();
            }
            else
            {
                colors = ColorHelpers.StandardColors;
            }

            int length = Math.Min(colors.Length, HelpersOptions.RecentColorsMax);

            Color previousColor = Color.Empty;

            for (int i = 0; i < length; i++)
            {
                ColorButton colorButton = new ColorButton()
                {
                    Color = colors[i],
                    Size = new Size(16, 16),
                    Margin = new Padding(1),
                    BorderColor = Color.FromArgb(100, 100, 100),
                    Offset = 0,
                    HoverEffect = true,
                    ManualButtonClick = true
                };

                colorButton.MouseClick += (sender, e) =>
                {
                    if (e.Button == MouseButtons.Left)
                    {
                        SetCurrentColor(colorButton.Color, true);

                        if (!IsScreenColorPickerMode)
                        {
                            if (!previousColor.IsEmpty && previousColor == colorButton.Color)
                            {
                                CloseOK();
                            }
                            else
                            {
                                previousColor = colorButton.Color;
                            }
                        }
                    }
                };

                flpColorPalette.Controls.Add(colorButton);
                if ((i + 1) % 16 == 0) flpColorPalette.SetFlowBreak(colorButton, true);
            }
        }

        private void AddRecentColor(Color color)
        {
            HelpersOptions.RecentColors.Remove(color);

            if (HelpersOptions.RecentColors.Count >= HelpersOptions.RecentColorsMax)
            {
                HelpersOptions.RecentColors.RemoveRange(HelpersOptions.RecentColorsMax - 1, HelpersOptions.RecentColors.Count - HelpersOptions.RecentColorsMax + 1);
            }

            HelpersOptions.RecentColors.Insert(0, color);
        }

        public void SetCurrentColor(Color currentColor, bool keepPreviousColor)
        {
            oldColorExist = keepPreviousColor;
            lblOld.Visible = oldColorExist;
            NewColor = OldColor = currentColor;
            colorPicker.ChangeColor(currentColor);
            nudAlpha.SetValue(currentColor.A);
            DrawPreviewColors();
        }

        private void UpdateColor(int x, int y)
        {
            UpdateColor(x, y, CaptureHelpers.GetPixelColor(x, y));
        }

        private void UpdateColor(int x, int y, Color color)
        {
            txtX.Text = x.ToString();
            txtY.Text = y.ToString();
            colorPicker.ChangeColor(color);
        }

        private void UpdateControls(MyColor color, ColorType type)
        {
            DrawPreviewColors();
            controlChangingColor = true;

            if (type != ColorType.HSB)
            {
                nudHue.SetValue((decimal)Math.Round(color.HSB.Hue360));
                nudSaturation.SetValue((decimal)Math.Round(color.HSB.Saturation100));
                nudBrightness.SetValue((decimal)Math.Round(color.HSB.Brightness100));
            }

            if (type != ColorType.RGBA)
            {
                nudRed.SetValue(color.RGBA.Red);
                nudGreen.SetValue(color.RGBA.Green);
                nudBlue.SetValue(color.RGBA.Blue);
                nudAlpha.SetValue(color.RGBA.Alpha);
            }

            if (type != ColorType.CMYK)
            {
                nudCyan.SetValue((decimal)color.CMYK.Cyan100);
                nudMagenta.SetValue((decimal)color.CMYK.Magenta100);
                nudYellow.SetValue((decimal)color.CMYK.Yellow100);
                nudKey.SetValue((decimal)color.CMYK.Key100);
            }

            if (type != ColorType.Hex)
            {
                txtHex.Text = ColorHelpers.ColorToHex(color);
            }

            if (type != ColorType.Decimal)
            {
                txtDecimal.Text = ColorHelpers.ColorToDecimal(color).ToString();
            }

            lblNameValue.Text = ColorHelpers.GetColorName(color);

            controlChangingColor = false;
        }

        private void DrawPreviewColors()
        {
            Bitmap bmp = new Bitmap(pbColorPreview.ClientSize.Width, pbColorPreview.ClientSize.Height);

            using (Graphics g = Graphics.FromImage(bmp))
            {
                int bmpHeight = bmp.Height;

                if (oldColorExist)
                {
                    bmpHeight /= 2;

                    using (SolidBrush oldColorBrush = new SolidBrush(OldColor))
                    {
                        g.FillRectangle(oldColorBrush, new Rectangle(0, bmpHeight, bmp.Width, bmpHeight));
                    }
                }

                using (SolidBrush newColorBrush = new SolidBrush(NewColor))
                {
                    g.FillRectangle(newColorBrush, new Rectangle(0, 0, bmp.Width, bmpHeight));
                }
            }

            using (bmp)
            {
                pbColorPreview.LoadImage(bmp);
            }
        }

        private void CloseOK()
        {
            AddRecentColor(NewColor);
            DialogResult = DialogResult.OK;
            Close();
        }

        #region Events

        private void ColorPickerForm_Shown(object sender, EventArgs e)
        {
            this.ForceActivate();
        }

        private void colorPicker_ColorChanged(object sender, ColorEventArgs e)
        {
            NewColor = e.Color;
            UpdateControls(NewColor, e.ColorType);
        }

        private void rbRecentColors_CheckedChanged(object sender, EventArgs e)
        {
            Options.RecentColorsSelected = rbRecentColors.Checked;

            PrepareColorPalette();
        }

        private void btnOK_Click(object sender, EventArgs e)
        {
            CloseOK();
        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            DialogResult = DialogResult.Cancel;
            Close();
        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            Close();
        }

        private void rbHue_CheckedChanged(object sender, EventArgs e)
        {
            if (rbHue.Checked) colorPicker.DrawStyle = DrawStyle.Hue;
        }

        private void rbSaturation_CheckedChanged(object sender, EventArgs e)
        {
            if (rbSaturation.Checked) colorPicker.DrawStyle = DrawStyle.Saturation;
        }

        private void rbBrightness_CheckedChanged(object sender, EventArgs e)
        {
            if (rbBrightness.Checked) colorPicker.DrawStyle = DrawStyle.Brightness;
        }

        private void rbRed_CheckedChanged(object sender, EventArgs e)
        {
            if (rbRed.Checked) colorPicker.DrawStyle = DrawStyle.Red;
        }

        private void rbGreen_CheckedChanged(object sender, EventArgs e)
        {
            if (rbGreen.Checked) colorPicker.DrawStyle = DrawStyle.Green;
        }

        private void rbBlue_CheckedChanged(object sender, EventArgs e)
        {
            if (rbBlue.Checked) colorPicker.DrawStyle = DrawStyle.Blue;
        }

        private void RGB_ValueChanged(object sender, EventArgs e)
        {
            if (!controlChangingColor)
            {
                colorPicker.ChangeColor(Color.FromArgb((int)nudAlpha.Value, (int)nudRed.Value, (int)nudGreen.Value, (int)nudBlue.Value), ColorType.RGBA);
            }
        }

        private void cbTransparent_Click(object sender, EventArgs e)
        {
            if (nudAlpha.Value == 0)
            {
                nudAlpha.SetValue(255);
            }
            else
            {
                nudAlpha.SetValue(0);
            }
        }

        private void HSB_ValueChanged(object sender, EventArgs e)
        {
            if (!controlChangingColor)
            {
                colorPicker.ChangeColor(new HSB((int)nudHue.Value, (int)nudSaturation.Value, (int)nudBrightness.Value, (int)nudAlpha.Value).ToColor(), ColorType.HSB);
            }
        }

        private void CMYK_ValueChanged(object sender, EventArgs e)
        {
            if (!controlChangingColor)
            {
                colorPicker.ChangeColor(new CMYK((double)nudCyan.Value / 100, (double)nudMagenta.Value / 100, (double)nudYellow.Value / 100,
                    (double)nudKey.Value / 100, (int)nudAlpha.Value).ToColor(), ColorType.CMYK);
            }
        }

        private void txtHex_TextChanged(object sender, EventArgs e)
        {
            try
            {
                if (!controlChangingColor)
                {
                    colorPicker.ChangeColor(ColorHelpers.HexToColor(txtHex.Text), ColorType.Hex);
                }
            }
            catch
            {
            }
        }

        private void txtDecimal_TextChanged(object sender, EventArgs e)
        {
            try
            {
                if (!controlChangingColor && int.TryParse(txtDecimal.Text, out int dec))
                {
                    colorPicker.ChangeColor(ColorHelpers.DecimalToColor(dec), ColorType.Decimal);
                }
            }
            catch
            {
            }
        }

        private void pbColorPreview_MouseClick(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left && oldColorExist)
            {
                colorPicker.ChangeColor(OldColor);
            }
        }

        private void tsmiCopyAll_Click(object sender, EventArgs e)
        {
            string colors = colorPicker.SelectedColor.ToString();
            colors += Environment.NewLine + string.Format("Cursor position (X, Y) = {0}, {1}", txtX.Text, txtY.Text);
            ClipboardHelpers.CopyText(colors);
        }

        private void tsmiCopyRGB_Click(object sender, EventArgs e)
        {
            RGBA rgba = colorPicker.SelectedColor.RGBA;
            ClipboardHelpers.CopyText($"{rgba.Red}, {rgba.Green}, {rgba.Blue}");
        }

        private void tsmiCopyHexadecimal_Click(object sender, EventArgs e)
        {
            string hex = ColorHelpers.ColorToHex(colorPicker.SelectedColor, ColorFormat.RGB);
            ClipboardHelpers.CopyText("#" + hex);
        }

        private void tsmiCopyCMYK_Click(object sender, EventArgs e)
        {
            CMYK cmyk = colorPicker.SelectedColor.CMYK;
            ClipboardHelpers.CopyText($"{cmyk.Cyan100:0.0}%, {cmyk.Magenta100:0.0}%, {cmyk.Yellow100:0.0}%, {cmyk.Key100:0.0}%");
        }

        private void tsmiCopyHSB_Click(object sender, EventArgs e)
        {
            HSB hsb = colorPicker.SelectedColor.HSB;
            ClipboardHelpers.CopyText($"{hsb.Hue360:0.0}°, {hsb.Saturation100:0.0}%, {hsb.Brightness100:0.0}%");
        }

        private void tsmiCopyDecimal_Click(object sender, EventArgs e)
        {
            int dec = ColorHelpers.ColorToDecimal(colorPicker.SelectedColor, ColorFormat.RGB);
            ClipboardHelpers.CopyText(dec.ToString());
        }

        private void tsmiCopyPosition_Click(object sender, EventArgs e)
        {
            ClipboardHelpers.CopyText($"{txtX.Text}, {txtY.Text}");
        }

        private void btnScreenColorPicker_Click(object sender, EventArgs e)
        {
            try
            {
                SetCurrentColor(NewColor, true);

                Hide();
                Thread.Sleep(250);

                PointInfo pointInfo = OpenScreenColorPicker();

                if (pointInfo != null)
                {
                    UpdateColor(pointInfo.Position.X, pointInfo.Position.Y, pointInfo.Color);
                }
            }
            finally
            {
                this.ForceActivate();
            }
        }

        private void btnClipboardColorPicker_Click(object sender, EventArgs e)
        {
            CheckClipboard();
        }

        #endregion Events
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ColorPickerForm.de.resx]---
Location: ShareX-develop/ShareX.HelpersLib/Forms/ColorPickerForm.de.resx

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
    <value>ShareX - Farbauswähler</value>
  </data>
  <data name="btnCancel.Text" xml:space="preserve">
    <value>Abbrechen</value>
  </data>
  <data name="btnOK.Text" xml:space="preserve">
    <value>OK</value>
  </data>
  <data name="lblAlpha.Text" xml:space="preserve">
    <value>Alpha:</value>
  </data>
  <data name="lblCyan.Text" xml:space="preserve">
    <value>Cyan:</value>
  </data>
  <data name="lblDecimal.Text" xml:space="preserve">
    <value>Dezimal:</value>
  </data>
  <data name="lblKey.Text" xml:space="preserve">
    <value>Schlüssel:</value>
  </data>
  <data name="lblMagenta.Text" xml:space="preserve">
    <value>Magenta:</value>
  </data>
  <data name="lblNew.Text" xml:space="preserve">
    <value>Neu:</value>
  </data>
  <data name="lblOld.Text" xml:space="preserve">
    <value>Alt:</value>
  </data>
  <data name="lblYellow.Text" xml:space="preserve">
    <value>Gelb:</value>
  </data>
  <data name="rbBlue.Text" xml:space="preserve">
    <value>Blau:</value>
  </data>
  <data name="rbBrightness.Text" xml:space="preserve">
    <value>Helligkeit:</value>
  </data>
  <data name="rbGreen.Text" xml:space="preserve">
    <value>Grün:</value>
  </data>
  <data name="rbHue.Text" xml:space="preserve">
    <value>Färbung:</value>
  </data>
  <data name="rbRed.Text" xml:space="preserve">
    <value>Rot:</value>
  </data>
  <data name="rbSaturation.Text" xml:space="preserve">
    <value>Sättigung:</value>
  </data>
  <data name="btnClose.Text" xml:space="preserve">
    <value>Schließen</value>
  </data>
  <data name="lblCursorPosition.Text" xml:space="preserve">
    <value>Mauszeigerposition:</value>
  </data>
  <data name="lblHex.Text" xml:space="preserve">
    <value>Hex:</value>
  </data>
  <data name="tsmiCopyAll.Text" xml:space="preserve">
    <value>Alle kopieren</value>
  </data>
  <data name="tsmiCopyRGB.Text" xml:space="preserve">
    <value>RGB kopieren</value>
  </data>
  <data name="tsmiCopyHexadecimal.Text" xml:space="preserve">
    <value>Hexadezimal kopieren</value>
  </data>
  <data name="tsmiCopyCMYK.Text" xml:space="preserve">
    <value>CMYK kopieren</value>
  </data>
  <data name="tsmiCopyHSB.Text" xml:space="preserve">
    <value>HSB kopieren</value>
  </data>
  <data name="tsmiCopyDecimal.Text" xml:space="preserve">
    <value>Dezimal kopieren</value>
  </data>
  <data name="tsmiCopyPosition.Text" xml:space="preserve">
    <value>Position kopieren</value>
  </data>
  <data name="mbCopy.Text" xml:space="preserve">
    <value>Kopieren</value>
  </data>
  <data name="cbTransparent.ToolTip" xml:space="preserve">
    <value>Transparent</value>
  </data>
  <data name="btnScreenColorPicker.ToolTip" xml:space="preserve">
    <value>Farbe vom Bildschirm auswählen</value>
  </data>
  <data name="rbRecentColors.Text" xml:space="preserve">
    <value>Zuletzt verwendete Farben</value>
  </data>
  <data name="rbStandardColors.Text" xml:space="preserve">
    <value>Standardfarben</value>
  </data>
  <data name="btnClipboardColorPicker.ToolTip" xml:space="preserve">
    <value>Farbe von der Zwischenablage auswählen</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
