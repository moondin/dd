---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 492
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 492 of 650)

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

---[FILE: ScrollingCaptureForm.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Forms/ScrollingCaptureForm.cs

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
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ShareX.ScreenCaptureLib
{
    public partial class ScrollingCaptureForm : Form
    {
        private static readonly object lockObject = new object();

        private static ScrollingCaptureForm instance;

        public event Action<Bitmap> UploadRequested;
        public event Action PlayNotificationSound;

        public ScrollingCaptureOptions Options { get; private set; }

        private ScrollingCaptureManager manager;
        private Point dragStartPosition;

        private ScrollingCaptureForm(ScrollingCaptureOptions options)
        {
            Options = options;

            InitializeComponent();
            ShareXResources.ApplyTheme(this, true);

            manager = new ScrollingCaptureManager(Options);
        }

        public static async Task StartStopScrollingCapture(ScrollingCaptureOptions options, Action<Bitmap> uploadRequested = null, Action playNotificationSound = null)
        {
            if (instance == null || instance.IsDisposed)
            {
                lock (lockObject)
                {
                    if (instance == null || instance.IsDisposed)
                    {
                        instance = new ScrollingCaptureForm(options);

                        if (uploadRequested != null)
                        {
                            instance.UploadRequested += uploadRequested;
                        }

                        if (playNotificationSound != null)
                        {
                            instance.PlayNotificationSound += playNotificationSound;
                        }

                        instance.Show();
                    }
                }
            }
            else
            {
                await instance.StartStopScrollingCapture();
            }
        }

        public async Task StartStopScrollingCapture()
        {
            if (manager.IsCapturing)
            {
                manager.StopCapture();
            }
            else
            {
                await SelectWindow();
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                components?.Dispose();
                manager?.Dispose();
            }

            base.Dispose(disposing);
        }

        private void ResetPictureBox()
        {
            Image temp = pbOutput.Image;
            pbOutput.Image = null;
            temp?.Dispose();
        }

        private async Task StartCapture()
        {
            WindowState = FormWindowState.Minimized;
            btnCapture.Enabled = false;
            btnUpload.Enabled = false;
            btnCopy.Enabled = false;
            btnOptions.Enabled = false;
            lblResultSize.Text = "";
            ResetPictureBox();

            try
            {
                ScrollingCaptureStatus status = await manager.StartCapture();

                switch (status)
                {
                    case ScrollingCaptureStatus.Failed:
                        pbStatus.Image = Resources.control_record;
                        break;
                    case ScrollingCaptureStatus.PartiallySuccessful:
                        pbStatus.Image = Resources.control_record_yellow;
                        break;
                    case ScrollingCaptureStatus.Successful:
                        pbStatus.Image = Resources.control_record_green;
                        break;
                }

                OnPlayNotificationSound();
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);

                e.ShowError();
            }

            btnCapture.Enabled = true;
            btnOptions.Enabled = true;

            LoadImage(manager.Result);

            this.ForceActivate();

            if (Options.AutoUpload)
            {
                UploadResult();
            }
        }

        private void LoadImage(Bitmap bmp)
        {
            if (bmp != null)
            {
                btnUpload.Enabled = true;
                btnCopy.Enabled = true;
                pbOutput.Image = bmp;
                pOutput.AutoScrollPosition = new Point(0, 0);
                lblResultSize.Text = $"{bmp.Width}x{bmp.Height}";
            }
        }

        private async Task SelectWindow()
        {
            WindowState = FormWindowState.Minimized;
            Thread.Sleep(250);

            if (manager.SelectWindow())
            {
                await StartCapture();
            }
            else
            {
                this.ForceActivate();
            }
        }

        private void UploadResult()
        {
            if (manager.Result != null)
            {
                OnUploadRequested((Bitmap)manager.Result.Clone());
            }
        }

        private void CopyResult()
        {
            if (manager.Result != null)
            {
                ClipboardHelpers.CopyImage(manager.Result);
            }
        }

        protected void OnUploadRequested(Bitmap bmp)
        {
            UploadRequested?.Invoke(bmp);
        }

        protected void OnPlayNotificationSound()
        {
            PlayNotificationSound?.Invoke();
        }

        private async void ScrollingCaptureForm_Load(object sender, EventArgs e)
        {
            await SelectWindow();
        }

        private void ScrollingCaptureForm_Activated(object sender, EventArgs e)
        {
            manager.StopCapture();
        }

        private async void btnCapture_Click(object sender, EventArgs e)
        {
            await SelectWindow();
        }

        private void btnUpload_Click(object sender, EventArgs e)
        {
            UploadResult();
        }

        private void btnCopy_Click(object sender, EventArgs e)
        {
            CopyResult();
        }

        private void btnOptions_Click(object sender, EventArgs e)
        {
            using (ScrollingCaptureOptionsForm scrollingCaptureOptionsForm = new ScrollingCaptureOptionsForm(Options))
            {
                scrollingCaptureOptionsForm.ShowDialog();
            }
        }

        private void btnHelp_Click(object sender, EventArgs e)
        {
            URLHelpers.OpenURL(Links.DocsScrollingScreenshot);
        }

        private void pbOutput_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left && (pOutput.HorizontalScroll.Visible || pOutput.VerticalScroll.Visible))
            {
                pOutput.Cursor = Cursors.SizeAll;
                dragStartPosition = e.Location;
            }
        }

        private void pbOutput_MouseMove(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left && (pOutput.HorizontalScroll.Visible || pOutput.VerticalScroll.Visible))
            {
                Point scrollOffset = new Point(e.X - dragStartPosition.X, e.Y - dragStartPosition.Y);
                pOutput.AutoScrollPosition = new Point(-pOutput.AutoScrollPosition.X - scrollOffset.X, -pOutput.AutoScrollPosition.Y - scrollOffset.Y);
                pOutput.Update();
            }
        }

        private void pbOutput_MouseUp(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                pOutput.Cursor = Cursors.Default;
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ScrollingCaptureForm.Designer.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Forms/ScrollingCaptureForm.Designer.cs

```csharp
namespace ShareX.ScreenCaptureLib
{
    partial class ScrollingCaptureForm
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(ScrollingCaptureForm));
            this.btnCapture = new System.Windows.Forms.Button();
            this.pOutput = new System.Windows.Forms.Panel();
            this.pbOutput = new System.Windows.Forms.PictureBox();
            this.btnOptions = new System.Windows.Forms.Button();
            this.btnUpload = new System.Windows.Forms.Button();
            this.lblResultSize = new System.Windows.Forms.Label();
            this.pbStatus = new System.Windows.Forms.PictureBox();
            this.btnHelp = new System.Windows.Forms.Button();
            this.btnCopy = new System.Windows.Forms.Button();
            this.pOutput.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pbOutput)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pbStatus)).BeginInit();
            this.SuspendLayout();
            // 
            // btnCapture
            // 
            resources.ApplyResources(this.btnCapture, "btnCapture");
            this.btnCapture.Name = "btnCapture";
            this.btnCapture.UseVisualStyleBackColor = true;
            this.btnCapture.Click += new System.EventHandler(this.btnCapture_Click);
            // 
            // pOutput
            // 
            resources.ApplyResources(this.pOutput, "pOutput");
            this.pOutput.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.pOutput.Controls.Add(this.pbOutput);
            this.pOutput.Name = "pOutput";
            // 
            // pbOutput
            // 
            resources.ApplyResources(this.pbOutput, "pbOutput");
            this.pbOutput.Name = "pbOutput";
            this.pbOutput.TabStop = false;
            this.pbOutput.MouseDown += new System.Windows.Forms.MouseEventHandler(this.pbOutput_MouseDown);
            this.pbOutput.MouseMove += new System.Windows.Forms.MouseEventHandler(this.pbOutput_MouseMove);
            this.pbOutput.MouseUp += new System.Windows.Forms.MouseEventHandler(this.pbOutput_MouseUp);
            // 
            // btnOptions
            // 
            resources.ApplyResources(this.btnOptions, "btnOptions");
            this.btnOptions.Name = "btnOptions";
            this.btnOptions.UseVisualStyleBackColor = true;
            this.btnOptions.Click += new System.EventHandler(this.btnOptions_Click);
            // 
            // btnUpload
            // 
            resources.ApplyResources(this.btnUpload, "btnUpload");
            this.btnUpload.Name = "btnUpload";
            this.btnUpload.UseVisualStyleBackColor = true;
            this.btnUpload.Click += new System.EventHandler(this.btnUpload_Click);
            // 
            // lblResultSize
            // 
            resources.ApplyResources(this.lblResultSize, "lblResultSize");
            this.lblResultSize.Name = "lblResultSize";
            // 
            // pbStatus
            // 
            resources.ApplyResources(this.pbStatus, "pbStatus");
            this.pbStatus.Name = "pbStatus";
            this.pbStatus.TabStop = false;
            // 
            // btnHelp
            // 
            resources.ApplyResources(this.btnHelp, "btnHelp");
            this.btnHelp.Name = "btnHelp";
            this.btnHelp.UseVisualStyleBackColor = true;
            this.btnHelp.Click += new System.EventHandler(this.btnHelp_Click);
            // 
            // btnCopy
            // 
            resources.ApplyResources(this.btnCopy, "btnCopy");
            this.btnCopy.Name = "btnCopy";
            this.btnCopy.UseVisualStyleBackColor = true;
            this.btnCopy.Click += new System.EventHandler(this.btnCopy_Click);
            // 
            // ScrollingCaptureForm
            // 
            resources.ApplyResources(this, "$this");
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            this.Controls.Add(this.btnCopy);
            this.Controls.Add(this.btnHelp);
            this.Controls.Add(this.pbStatus);
            this.Controls.Add(this.lblResultSize);
            this.Controls.Add(this.btnUpload);
            this.Controls.Add(this.btnOptions);
            this.Controls.Add(this.pOutput);
            this.Controls.Add(this.btnCapture);
            this.Name = "ScrollingCaptureForm";
            this.WindowState = System.Windows.Forms.FormWindowState.Minimized;
            this.Activated += new System.EventHandler(this.ScrollingCaptureForm_Activated);
            this.Load += new System.EventHandler(this.ScrollingCaptureForm_Load);
            this.pOutput.ResumeLayout(false);
            this.pOutput.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pbOutput)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pbStatus)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button btnCapture;
        private System.Windows.Forms.Panel pOutput;
        private System.Windows.Forms.PictureBox pbOutput;
        private System.Windows.Forms.Button btnOptions;
        private System.Windows.Forms.Button btnUpload;
        private System.Windows.Forms.Label lblResultSize;
        private System.Windows.Forms.PictureBox pbStatus;
        private System.Windows.Forms.Button btnHelp;
        private System.Windows.Forms.Button btnCopy;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ScrollingCaptureForm.fr.resx]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Forms/ScrollingCaptureForm.fr.resx

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
  <data name="btnCapture.Text" xml:space="preserve">
    <value>Capturer...</value>
  </data>
  <data name="btnOptions.Text" xml:space="preserve">
    <value>Options...</value>
  </data>
  <data name="btnUpload.Text" xml:space="preserve">
    <value>Mettre en ligne / Enregistrer</value>
  </data>
  <data name="btnCopy.Text" xml:space="preserve">
    <value>Copier</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - Capture par défilement</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: ScrollingCaptureForm.he-IL.resx]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Forms/ScrollingCaptureForm.he-IL.resx

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
    <value>ShareX - צילום מסך נגלל</value>
  </data>
  <data name="btnCapture.Text" xml:space="preserve">
    <value>התחל צילום נגלל</value>
  </data>
  <data name="btnGuessCombineAdjustments.Text" xml:space="preserve">
    <value>נחש התאמות מיזוג ומזג</value>
  </data>
  <data name="btnGuessEdges.Text" xml:space="preserve">
    <value>נחשו ערכי קצה לקיצוץ</value>
  </data>
  <data name="btnResetCombine.Text" xml:space="preserve">
    <value>אפס את אפשרויות הפלט</value>
  </data>
  <data name="btnSelectHandle.Text" xml:space="preserve">
    <value>בחר חלון או פקד כדי לגלול...</value>
  </data>
  <data name="btnSelectRectangle.Text" xml:space="preserve">
    <value>(אופציונלי) בחר אזור מותאם אישית בחלון...</value>
  </data>
  <data name="btnStartTask.Text" xml:space="preserve">
    <value>העלה/שמור בהתאם להגדרות לאחר צילום מסך</value>
  </data>
  <data name="cbAutoCombine.Text" xml:space="preserve">
    <value>נחש קיזוז ומזג תמונות</value>
  </data>
  <data name="cbAutoDetectScrollEnd.Text" xml:space="preserve">
    <value>זהה את סוף הגלילה</value>
  </data>
  <data name="cbAutoUpload.Text" xml:space="preserve">
    <value>העלה/שמור בהתאם להגדרות לאחר צילום מסך</value>
  </data>
  <data name="cbRemoveDuplicates.Text" xml:space="preserve">
    <value>הסר תמונות כפולות</value>
  </data>
  <data name="cbStartCaptureAutomatically.Text" xml:space="preserve">
    <value>התחל צילום נגלל מיד לאחר בחירת אזור הצילום</value>
  </data>
  <data name="cbStartSelectionAutomatically.Text" xml:space="preserve">
    <value>התחל לבחור אזור צילום לפני פתיחת חלון זה</value>
  </data>
  <data name="lblNote.Text" xml:space="preserve">
    <value>לתשומת ליבך שבעוד ש-ShareX עושה את מיטב המאמצים בצילום מסך נגלל מדויק, עדיין לא כל תוכן הגלילה ייקלט כשורה. הסיבות מערכות יכולות לגרום לבעיות בזמן המיזוג הן תנועות על המסך בזמן צילום. לדוגמה: אם לדף אינטרנט יש GIF מונפש או אובייקטים סטטיים על המסך בזמן גלילה. דוגמה נוספת: דף באינטרנט בעל תפריט או כפתורים סטטים אשר אינם משנים את מיקומם אך שאר דף האינטרנט נע.</value>
  </data>
  <data name="gbAfterCapture.Text" xml:space="preserve">
    <value>לאחר צילום מסך</value>
  </data>
  <data name="gbBeforeCapture.Text" xml:space="preserve">
    <value>לפני צילום מסך</value>
  </data>
  <data name="gbCombineAdjustments.Text" xml:space="preserve">
    <value>מזג התאמות</value>
  </data>
  <data name="gbImages.Text" xml:space="preserve">
    <value>תמונות</value>
  </data>
  <data name="gbTrimEdges.Text" xml:space="preserve">
    <value>חתוך קצוות</value>
  </data>
  <data name="gbWhileCapturing.Text" xml:space="preserve">
    <value>בזמן צילום</value>
  </data>
  <data name="lblCombineLastVertical.Text" xml:space="preserve">
    <value>אנכי אחרון:</value>
  </data>
  <data name="lblCombineVertical.Text" xml:space="preserve">
    <value>אנכי:</value>
  </data>
  <data name="lblIgnoreLast.Text" xml:space="preserve">
    <value>הסר אחרון:</value>
  </data>
  <data name="lblImageCount.Text" xml:space="preserve">
    <value>ספירת תמונות:</value>
  </data>
  <data name="lblMaximumScrollCount.Text" xml:space="preserve">
    <value>ספירת גלילה מקסימלית:</value>
  </data>
  <data name="lblProcessing.Text" xml:space="preserve">
    <value>מעבד...</value>
  </data>
  <data name="lblScrollDelay.Text" xml:space="preserve">
    <value>השהיית גלילה:</value>
  </data>
  <data name="lblScrollMethod.Text" xml:space="preserve">
    <value>שיטת גלילה:</value>
  </data>
  <data name="lblScrollTopMethodBeforeCapture.Text" xml:space="preserve">
    <value>שיטת הגלילה מעלה לפני הצילום:</value>
  </data>
  <data name="lblStartDelay.Text" xml:space="preserve">
    <value>עיכוב התחלה:</value>
  </data>
  <data name="lblTrimBottom.Text" xml:space="preserve">
    <value>למטה:</value>
  </data>
  <data name="lblTrimLeft.Text" xml:space="preserve">
    <value>שמאל:</value>
  </data>
  <data name="lblTrimRight.Text" xml:space="preserve">
    <value>ימין:</value>
  </data>
  <data name="lblTrimTop.Text" xml:space="preserve">
    <value>למעלה:</value>
  </data>
  <data name="tpCapture.Text" xml:space="preserve">
    <value>צלם מסך</value>
  </data>
  <data name="tpOutput.Text" xml:space="preserve">
    <value>פלט</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: ScrollingCaptureForm.ja-JP.resx]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Forms/ScrollingCaptureForm.ja-JP.resx

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
  <data name="btnCopy.Text" xml:space="preserve">
    <value>コピー</value>
  </data>
  <data name="btnOptions.Text" xml:space="preserve">
    <value>オプション...</value>
  </data>
  <data name="btnCapture.Text" xml:space="preserve">
    <value>キャプチャ...</value>
  </data>
  <data name="btnUpload.Text" xml:space="preserve">
    <value>アップロード/保存</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - スクロールキャプチャ</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
