---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 132
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 132 of 650)

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

---[FILE: NotificationForm.cs]---
Location: ShareX-develop/ShareX/Forms/NotificationForm.cs

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
using System.Drawing;
using System.IO;
using System.Windows.Forms;

namespace ShareX
{
    public class NotificationForm : LayeredForm
    {
        private static NotificationForm instance;

        public NotificationFormConfig Config { get; private set; }

        private bool isMouseInside;
        private bool isDurationEnd;
        private int fadeInterval = 50;
        private float opacityDecrement;
        private int urlPadding = 3;
        private int titleSpace = 3;
        private Size titleRenderSize;
        private Size textRenderSize;
        private Size totalRenderSize;
        private bool isMouseDragging;
        private Point dragStart;
        private float opacity = 255;
        private Bitmap buffer;
        private Graphics gBuffer;

        protected override CreateParams CreateParams
        {
            get
            {
                CreateParams createParams = base.CreateParams;
                createParams.ExStyle |= (int)WindowStyles.WS_EX_TOOLWINDOW;
                return createParams;
            }
        }

        private NotificationForm()
        {
            InitializeComponent();
        }

        public static void Show(NotificationFormConfig config)
        {
            if (config.IsValid)
            {
                if (config.Image == null)
                {
                    config.Image = ImageHelpers.LoadImage(config.FilePath);
                }

                if (config.Image != null || !string.IsNullOrEmpty(config.Text))
                {
                    if (instance == null || instance.IsDisposed)
                    {
                        instance = new NotificationForm();
                        instance.LoadConfig(config);

                        NativeMethods.ShowWindow(instance.Handle, (int)WindowShowStyle.ShowNoActivate);
                    }
                    else
                    {
                        instance.LoadConfig(config);
                    }
                }
            }
        }

        public static void CloseActiveForm()
        {
            if (instance != null && !instance.IsDisposed)
            {
                instance.Close();
            }
        }

        public void LoadConfig(NotificationFormConfig config)
        {
            Config?.Dispose();
            buffer?.Dispose();
            gBuffer?.Dispose();

            Config = config;
            opacityDecrement = (float)fadeInterval / Config.FadeDuration * 255;

            if (Config.Image != null)
            {
                Config.Image = ImageHelpers.ResizeImageLimit(Config.Image, Config.Size);
                Config.Size = new Size(Config.Image.Width + 2, Config.Image.Height + 2);
            }
            else if (!string.IsNullOrEmpty(Config.Text))
            {
                Size size = Config.Size.Offset(-Config.TextPadding * 2);
                textRenderSize = TextRenderer.MeasureText(Config.Text, Config.TextFont, size,
                    TextFormatFlags.WordBreak | TextFormatFlags.TextBoxControl | TextFormatFlags.EndEllipsis);
                textRenderSize = new Size(textRenderSize.Width, Math.Min(textRenderSize.Height, size.Height));
                totalRenderSize = textRenderSize;

                if (!string.IsNullOrEmpty(Config.Title))
                {
                    titleRenderSize = TextRenderer.MeasureText(Config.Title, Config.TitleFont, Config.Size.Offset(-Config.TextPadding * 2),
                        TextFormatFlags.Left | TextFormatFlags.EndEllipsis);
                    totalRenderSize = new Size(Math.Max(textRenderSize.Width, titleRenderSize.Width), titleRenderSize.Height + titleSpace + textRenderSize.Height);
                }

                Config.Size = new Size(totalRenderSize.Width + (Config.TextPadding * 2), totalRenderSize.Height + (Config.TextPadding * 2) + 2);
            }

            buffer = new Bitmap(Config.Size.Width, Config.Size.Height);
            gBuffer = Graphics.FromImage(buffer);

            Point position = Helpers.GetPosition(Config.Placement, Config.Offset, Screen.PrimaryScreen.WorkingArea, Config.Size);

            NativeMethods.SetWindowPos(Handle, (IntPtr)NativeConstants.HWND_TOPMOST, position.X, position.Y, Config.Size.Width, Config.Size.Height,
                SetWindowPosFlags.SWP_NOACTIVATE);

            tDuration.Stop();
            tOpacity.Stop();

            opacity = 255;
            Render(true);

            if (Config.Duration <= 0)
            {
                DurationEnd();
            }
            else
            {
                tDuration.Interval = Config.Duration;
                tDuration.Start();
            }
        }

        private void UpdateBuffer()
        {
            Rectangle rect = new Rectangle(0, 0, buffer.Width, buffer.Height);

            gBuffer.Clear(Config.BackgroundColor);

            if (Config.Image != null)
            {
                gBuffer.DrawImage(Config.Image, 1, 1, Config.Image.Width, Config.Image.Height);

                if (isMouseInside && !string.IsNullOrEmpty(Config.URL))
                {
                    Rectangle textRect = new Rectangle(0, 0, rect.Width, 40);

                    using (SolidBrush brush = new SolidBrush(Color.FromArgb(100, 0, 0, 0)))
                    {
                        gBuffer.FillRectangle(brush, textRect);
                    }

                    TextRenderer.DrawText(gBuffer, Config.URL, Config.TextFont, textRect.Offset(-urlPadding), Color.White, TextFormatFlags.Left | TextFormatFlags.EndEllipsis);
                }
            }
            else if (!string.IsNullOrEmpty(Config.Text))
            {
                Rectangle textRect;

                if (!string.IsNullOrEmpty(Config.Title))
                {
                    Rectangle titleRect = new Rectangle(Config.TextPadding, Config.TextPadding, titleRenderSize.Width + 2, titleRenderSize.Height + 2);
                    TextRenderer.DrawText(gBuffer, Config.Title, Config.TitleFont, titleRect, Config.TitleColor, TextFormatFlags.Left | TextFormatFlags.EndEllipsis);
                    textRect = new Rectangle(Config.TextPadding, Config.TextPadding + titleRect.Height + titleSpace, textRenderSize.Width + 2, textRenderSize.Height + 2);
                }
                else
                {
                    textRect = new Rectangle(Config.TextPadding, Config.TextPadding, textRenderSize.Width + 2, textRenderSize.Height + 2);
                }

                TextRenderer.DrawText(gBuffer, Config.Text, Config.TextFont, textRect, Config.TextColor,
                    TextFormatFlags.WordBreak | TextFormatFlags.TextBoxControl | TextFormatFlags.EndEllipsis);
            }

            using (Pen borderPen = new Pen(Config.BorderColor))
            {
                gBuffer.DrawRectangleProper(borderPen, rect);
            }
        }

        private void Render(bool updateBuffer)
        {
            if (updateBuffer)
            {
                UpdateBuffer();
            }

            SelectBitmap(buffer, (int)opacity);
        }

        private void DurationEnd()
        {
            isDurationEnd = true;
            tDuration.Stop();

            if (!isMouseInside)
            {
                StartFade();
            }
        }

        private void StartFade()
        {
            if (Config.FadeDuration <= 0)
            {
                Close();
            }
            else
            {
                opacity = 255;
                Render(false);

                tOpacity.Interval = fadeInterval;
                tOpacity.Start();
            }
        }

        private void tDuration_Tick(object sender, EventArgs e)
        {
            DurationEnd();
        }

        private void tOpacity_Tick(object sender, EventArgs e)
        {
            if (opacity > opacityDecrement)
            {
                opacity -= opacityDecrement;
                Render(false);
            }
            else
            {
                Close();
            }
        }

        private void NotificationForm_MouseEnter(object sender, EventArgs e)
        {
            isMouseInside = true;
            tOpacity.Stop();

            if (!IsDisposed)
            {
                opacity = 255;
                Render(true);
            }
        }

        private void NotificationForm_MouseLeave(object sender, EventArgs e)
        {
            isMouseInside = false;
            isMouseDragging = false;
            Render(true);

            if (isDurationEnd)
            {
                StartFade();
            }
        }

        private void NotificationForm_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                dragStart = e.Location;
                isMouseDragging = true;
            }
        }

        private void NotificationForm_MouseMove(object sender, MouseEventArgs e)
        {
            if (isMouseDragging)
            {
                int dragThreshold = 20;

                Rectangle dragThresholdRectangle = new Rectangle(dragStart.X - dragThreshold, dragStart.Y - dragThreshold, dragThreshold * 2, dragThreshold * 2);

                bool isOverThreshold = !dragThresholdRectangle.Contains(e.Location);
                if (isOverThreshold && !string.IsNullOrEmpty(Config.FilePath) && File.Exists(Config.FilePath))
                {
                    IDataObject dataObject = new DataObject(DataFormats.FileDrop, new string[] { Config.FilePath });
                    DoDragDrop(dataObject, DragDropEffects.Copy | DragDropEffects.Move);

                    isMouseDragging = false;
                }
            }
        }

        private void NotificationForm_MouseUp(object sender, MouseEventArgs e)
        {
            isMouseDragging = false;
        }

        private void NotificationForm_MouseClick(object sender, MouseEventArgs e)
        {
            tDuration.Stop();

            Close();

            ToastClickAction action = ToastClickAction.CloseNotification;

            if (e.Button == MouseButtons.Left)
            {
                action = Config.LeftClickAction;
            }
            else if (e.Button == MouseButtons.Right)
            {
                action = Config.RightClickAction;
            }
            else if (e.Button == MouseButtons.Middle)
            {
                action = Config.MiddleClickAction;
            }

            ExecuteAction(action);
        }

        private void ExecuteAction(ToastClickAction action)
        {
            switch (action)
            {
                case ToastClickAction.AnnotateImage:
                    if (!string.IsNullOrEmpty(Config.FilePath) && FileHelpers.IsImageFile(Config.FilePath))
                    {
                        TaskHelpers.AnnotateImageFromFile(Config.FilePath);
                    }
                    break;
                case ToastClickAction.CopyImageToClipboard:
                    if (!string.IsNullOrEmpty(Config.FilePath))
                    {
                        ClipboardHelpers.CopyImageFromFile(Config.FilePath);
                    }
                    break;
                case ToastClickAction.CopyFile:
                    if (!string.IsNullOrEmpty(Config.FilePath))
                    {
                        ClipboardHelpers.CopyFile(Config.FilePath);
                    }
                    break;
                case ToastClickAction.CopyFilePath:
                    if (!string.IsNullOrEmpty(Config.FilePath))
                    {
                        ClipboardHelpers.CopyText(Config.FilePath);
                    }
                    break;
                case ToastClickAction.CopyUrl:
                    if (!string.IsNullOrEmpty(Config.URL))
                    {
                        ClipboardHelpers.CopyText(Config.URL);
                    }
                    break;
                case ToastClickAction.OpenFile:
                    if (!string.IsNullOrEmpty(Config.FilePath))
                    {
                        FileHelpers.OpenFile(Config.FilePath);
                    }
                    break;
                case ToastClickAction.OpenFolder:
                    if (!string.IsNullOrEmpty(Config.FilePath))
                    {
                        FileHelpers.OpenFolderWithFile(Config.FilePath);
                    }
                    break;
                case ToastClickAction.OpenUrl:
                    if (!string.IsNullOrEmpty(Config.URL))
                    {
                        URLHelpers.OpenURL(Config.URL);
                    }
                    break;
                case ToastClickAction.Upload:
                    if (!string.IsNullOrEmpty(Config.FilePath))
                    {
                        UploadManager.UploadFile(Config.FilePath);
                    }
                    break;
                case ToastClickAction.PinToScreen:
                    if (!string.IsNullOrEmpty(Config.FilePath) && FileHelpers.IsImageFile(Config.FilePath))
                    {
                        TaskHelpers.PinToScreen(Config.FilePath);
                    }
                    break;
                case ToastClickAction.DeleteFile:
                    if (!string.IsNullOrEmpty(Config.FilePath) &&
                        MessageBox.Show(Resources.MainForm_tsmiDeleteSelectedFile_Click_Do_you_really_want_to_delete_this_file_,
                        "ShareX - " + Resources.MainForm_tsmiDeleteSelectedFile_Click_File_delete_confirmation, MessageBoxButtons.YesNo) == DialogResult.Yes)
                    {
                        FileHelpers.DeleteFile(Config.FilePath, true);
                    }
                    break;
            }
        }

        #region Windows Form Designer generated code

        private Timer tDuration;
        private Timer tOpacity;

        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }

            Config?.Dispose();
            buffer?.Dispose();
            gBuffer?.Dispose();

            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            components = new System.ComponentModel.Container();
            tDuration = new Timer(components);
            tOpacity = new Timer(components);
            SuspendLayout();
            tDuration.Tick += new EventHandler(tDuration_Tick);
            tOpacity.Tick += new EventHandler(tOpacity_Tick);
            AutoScaleDimensions = new SizeF(96F, 96F);
            AutoScaleMode = AutoScaleMode.Dpi;
            ClientSize = new Size(400, 300);
            Cursor = Cursors.Hand;
            FormBorderStyle = FormBorderStyle.None;
            Name = "NotificationForm";
            ShowInTaskbar = false;
            StartPosition = FormStartPosition.Manual;
            Text = "NotificationForm";
            MouseClick += new MouseEventHandler(NotificationForm_MouseClick);
            MouseEnter += new EventHandler(NotificationForm_MouseEnter);
            MouseLeave += new EventHandler(NotificationForm_MouseLeave);
            MouseDown += new MouseEventHandler(NotificationForm_MouseDown);
            MouseMove += new MouseEventHandler(NotificationForm_MouseMove);
            MouseUp += new MouseEventHandler(NotificationForm_MouseUp);
            ResumeLayout(false);
        }

        #endregion Windows Form Designer generated code
    }
}
```

--------------------------------------------------------------------------------

---[FILE: QRCodeForm.ar-YE.resx]---
Location: ShareX-develop/ShareX/Forms/QRCodeForm.ar-YE.resx

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
    <value>نسخ الصورة</value>
  </data>
  <data name="lblQRCodeSize.Text" xml:space="preserve">
    <value>حجم رمز QR:</value>
  </data>
  <data name="lblQRCode.Text" xml:space="preserve">
    <value>رمز QR:</value>
  </data>
  <data name="lblQRCodeSizeHint.Text" xml:space="preserve">
    <value>px</value>
  </data>
  <data name="btnSaveImage.Text" xml:space="preserve">
    <value>حفظ الصورة...</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - رمز QR</value>
  </data>
  <data name="lblText.Text" xml:space="preserve">
    <value>النص:</value>
  </data>
  <data name="btnUploadImage.Text" xml:space="preserve">
    <value>رفع الصورة</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: QRCodeForm.cs]---
Location: ShareX-develop/ShareX/Forms/QRCodeForm.cs

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
using ShareX.ScreenCaptureLib;
using System;
using System.Drawing;
using System.IO;
using System.Text;
using System.Threading;
using System.Windows.Forms;
using ZXing;
using ZXing.QrCode;
using ZXing.Rendering;

namespace ShareX
{
    public partial class QRCodeForm : Form
    {
        private static QRCodeForm instance;

        public static QRCodeForm Instance
        {
            get
            {
                if (instance == null || instance.IsDisposed)
                {
                    instance = new QRCodeForm();
                }

                return instance;
            }
        }

        private bool isReady;

        public QRCodeForm(string text = null)
        {
            InitializeComponent();
            ShareXResources.ApplyTheme(this, true);

            if (!string.IsNullOrEmpty(text))
            {
                txtText.Text = text;
            }
        }

        public static QRCodeForm GenerateQRCodeFromClipboard()
        {
            string text = ClipboardHelpers.GetText(true);

            if (!string.IsNullOrEmpty(text) && TaskHelpers.CheckQRCodeContent(text))
            {
                return new QRCodeForm(text);
            }

            return new QRCodeForm();
        }

        public static QRCodeForm OpenFormScanFromImageFile(string filePath)
        {
            QRCodeForm form = new QRCodeForm();
            form.ScanFromImageFile(filePath);
            return form;
        }

        public static QRCodeForm OpenFormScanScreen()
        {
            QRCodeForm form = Instance;
            form.ScanScreen();
            return form;
        }

        public static QRCodeForm OpenFormScanRegion()
        {
            QRCodeForm form = Instance;
            form.ScanRegion();
            return form;
        }

        private void ClearQRCode()
        {
            if (pbQRCode.Image != null)
            {
                Image temp = pbQRCode.Image;
                pbQRCode.Reset();
                temp.Dispose();

                pbQRCode.PictureBoxBackColor = BackColor;
            }
        }

        private void GenerateQRCode(string text)
        {
            if (isReady)
            {
                ClearQRCode();

                if (!string.IsNullOrEmpty(text))
                {
                    int size;

                    if (nudQRCodeSize.Value > 0)
                    {
                        size = (int)nudQRCodeSize.Value;
                    }
                    else
                    {
                        size = Math.Min(pbQRCode.Width, pbQRCode.Height);
                    }

                    size = Math.Max(size, 64);

                    Image qrCode = TaskHelpers.GenerateQRCode(text, size);

                    pbQRCode.PictureBoxBackColor = Color.White;
                    pbQRCode.LoadImage(qrCode);
                }
            }
        }

        private void ScanImage(Bitmap bmp)
        {
            if (bmp != null)
            {
                string output = "";

                string[] results = TaskHelpers.BarcodeScan(bmp);

                if (results != null)
                {
                    output = string.Join(Environment.NewLine + Environment.NewLine, results);
                }

                txtText.Text = output;
            }
        }

        private void ScanScreen()
        {
            try
            {
                if (Visible)
                {
                    Hide();
                    Thread.Sleep(250);
                }

                using (Bitmap bmp = new Screenshot().CaptureFullscreen())
                {
                    ScanImage(bmp);
                }
            }
            finally
            {
                this.ForceActivate();

                TaskHelpers.PlayNotificationSoundAsync(NotificationSound.ActionCompleted);
            }
        }

        private void ScanRegion()
        {
            try
            {
                if (Visible)
                {
                    Hide();
                    Thread.Sleep(250);
                }

                TaskSettings taskSettings = TaskSettings.GetDefaultTaskSettings();

                using (Bitmap bmp = RegionCaptureTasks.GetRegionImage(taskSettings.CaptureSettings.SurfaceOptions))
                {
                    ScanImage(bmp);
                }
            }
            finally
            {
                this.ForceActivate();

                TaskHelpers.PlayNotificationSoundAsync(NotificationSound.ActionCompleted);
            }
        }

        private void ScanFromImageFile(string filePath)
        {
            if (!string.IsNullOrEmpty(filePath))
            {
                using (Bitmap bmp = ImageHelpers.LoadImage(filePath))
                {
                    if (bmp != null)
                    {
                        ScanImage(bmp);
                    }
                }
            }
        }

        private void QRCodeForm_Shown(object sender, EventArgs e)
        {
            isReady = true;

            txtText.SetWatermark(Resources.QRCodeForm_InputTextToEncode);

            GenerateQRCode(txtText.Text);
        }

        private void QRCodeForm_Resize(object sender, EventArgs e)
        {
            if (nudQRCodeSize.Value == 0)
            {
                GenerateQRCode(txtText.Text);
            }
        }

        private void txtText_TextChanged(object sender, EventArgs e)
        {
            GenerateQRCode(txtText.Text);
        }

        private void nudQRCodeSize_ValueChanged(object sender, EventArgs e)
        {
            GenerateQRCode(txtText.Text);
        }

        private void btnCopyImage_Click(object sender, EventArgs e)
        {
            if (pbQRCode.Image != null)
            {
                ClipboardHelpers.CopyImage(pbQRCode.Image);
            }
        }

        private void btnSaveImage_Click(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(txtText.Text))
            {
                using (SaveFileDialog sfd = new SaveFileDialog())
                {
                    sfd.Filter = @"PNG (*.png)|*.png|JPEG (*.jpg)|*.jpg|Bitmap (*.bmp)|*.bmp|SVG (*.svg)|*.svg";
                    sfd.FileName = txtText.Text;
                    sfd.DefaultExt = "png";

                    if (sfd.ShowDialog() == DialogResult.OK)
                    {
                        string filePath = sfd.FileName;

                        if (filePath.EndsWith("svg", StringComparison.OrdinalIgnoreCase))
                        {
                            BarcodeWriterSvg writer = new BarcodeWriterSvg()
                            {
                                Format = BarcodeFormat.QR_CODE,
                                Options = new QrCodeEncodingOptions()
                                {
                                    Width = pbQRCode.Width,
                                    Height = pbQRCode.Height,
                                    CharacterSet = "UTF-8"
                                }
                            };
                            SvgRenderer.SvgImage svgImage = writer.Write(txtText.Text);
                            File.WriteAllText(filePath, svgImage.Content, Encoding.UTF8);
                        }
                        else
                        {
                            if (pbQRCode.Image != null)
                            {
                                ImageHelpers.SaveImage(pbQRCode.Image, filePath);
                            }
                        }
                    }
                }
            }
        }

        private void btnUploadImage_Click(object sender, EventArgs e)
        {
            if (pbQRCode.Image != null)
            {
                Bitmap bmp = (Bitmap)pbQRCode.Image.Clone();
                TaskHelpers.MainFormUploadImage(bmp);
            }
        }

        private void btnScanScreen_Click(object sender, EventArgs e)
        {
            txtText.ResetText();

            ScanScreen();
        }

        private void btnScanRegion_Click(object sender, EventArgs e)
        {
            txtText.ResetText();

            ScanRegion();
        }

        private void btnScanImageFile_Click(object sender, EventArgs e)
        {
            txtText.ResetText();

            string filePath = ImageHelpers.OpenImageFileDialog();

            ScanFromImageFile(filePath);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: QRCodeForm.de.resx]---
Location: ShareX-develop/ShareX/Forms/QRCodeForm.de.resx

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
    <value>ShareX - QR-Code</value>
  </data>
  <data name="lblQRCodeSize.Text" xml:space="preserve">
    <value>Größe QR-Code:</value>
  </data>
  <data name="lblQRCode.Text" xml:space="preserve">
    <value>QR-Code:</value>
  </data>
  <data name="btnSaveImage.Text" xml:space="preserve">
    <value>Bild speichern...</value>
  </data>
  <data name="btnUploadImage.Text" xml:space="preserve">
    <value>Bild hochladen</value>
  </data>
  <data name="btnCopyImage.Text" xml:space="preserve">
    <value>Bild kopieren</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
