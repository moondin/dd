---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 222
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 222 of 650)

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

---[FILE: PinToScreenForm.cs]---
Location: ShareX-develop/ShareX/Tools/PinToScreen/PinToScreenForm.cs

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
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Threading;
using System.Windows.Forms;

namespace ShareX
{
    public partial class PinToScreenForm : Form
    {
        private static readonly object syncLock = new object();
        private static readonly List<PinToScreenForm> forms = new List<PinToScreenForm>();

        public Image Image { get; private set; }

        private int imageScale = 100;

        public int ImageScale
        {
            get
            {
                return imageScale;
            }
            set
            {
                int newImageScale = value.Clamp(20, 500);

                if (imageScale != newImageScale)
                {
                    imageScale = newImageScale;

                    if (loaded)
                    {
                        AutoSizeForm();
                    }

                    UpdateControls();
                }
            }
        }

        public Size ImageSize
        {
            get
            {
                return new Size((int)Math.Round(Image.Width * (ImageScale / 100f)), (int)Math.Round(Image.Height * (ImageScale / 100f)));
            }
        }

        public Size FormSize
        {
            get
            {
                Size size;

                if (Minimized)
                {
                    size = Options.MinimizeSize;
                }
                else
                {
                    size = ImageSize;
                }

                if (Options.Border)
                {
                    size = size.Offset(Options.BorderSize * 2);
                }

                return size;
            }
        }

        private int imageOpacity = 100;

        public int ImageOpacity
        {
            get
            {
                return imageOpacity;
            }
            set
            {
                int newImageOpacity = value.Clamp(10, 100);

                if (imageOpacity != newImageOpacity)
                {
                    imageOpacity = newImageOpacity;

                    Opacity = imageOpacity / 100f;
                }
            }
        }

        public bool Minimized { get; private set; }

        public PinToScreenOptions Options { get; private set; }

        private bool isDWMEnabled, loaded, dragging;
        private Point initialLocation;
        private Cursor openHandCursor, closedHandCursor;

        protected override CreateParams CreateParams
        {
            get
            {
                CreateParams createParams = base.CreateParams;
                createParams.ExStyle |= (int)WindowStyles.WS_EX_TOOLWINDOW;
                return createParams;
            }
        }

        private PinToScreenForm(PinToScreenOptions options)
        {
            Options = options;

            ImageScale = Options.InitialScale;
            ImageOpacity = Options.InitialOpacity;

            InitializeComponent();
            ShareXResources.ApplyTheme(this, true);
            TopMost = Options.TopMost;
            SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.OptimizedDoubleBuffer | ControlStyles.UserPaint, true);

            tsMain.Cursor = Cursors.Arrow;
            openHandCursor = Helpers.CreateCursor(Resources.openhand);
            closedHandCursor = Helpers.CreateCursor(Resources.closedhand);
            SetHandCursor(false);

            isDWMEnabled = NativeMethods.IsDWMEnabled();

            UpdateControls();

            loaded = true;
        }

        private PinToScreenForm(Image image, PinToScreenOptions options, Point? location = null) : this(options)
        {
            Image = image;
            AutoSizeForm();

            if (location == null)
            {
                location = Helpers.GetPosition(Options.Placement, Options.PlacementOffset, CaptureHelpers.GetActiveScreenWorkingArea(), FormSize);
            }
            else if (Options.Border)
            {
                location = location.Value.Add(-Options.BorderSize);
            }

            Location = location.Value;
        }

        public static void PinToScreenAsync(Image image, PinToScreenOptions options = null, Point? location = null)
        {
            if (image != null)
            {
                if (options == null)
                {
                    options = new PinToScreenOptions();
                }

                Thread thread = new Thread(() =>
                {
                    using (PinToScreenForm form = new PinToScreenForm(image, options, location))
                    {
                        lock (syncLock)
                        {
                            forms.Add(form);
                        }

                        form.ShowDialog();

                        lock (syncLock)
                        {
                            forms.Remove(form);
                        }
                    }
                });

                thread.IsBackground = true;
                thread.SetApartmentState(ApartmentState.STA);
                thread.Start();
            }
        }

        public static void CloseAll()
        {
            lock (syncLock)
            {
                foreach (PinToScreenForm form in forms)
                {
                    form.InvokeSafe(form.Close);
                }
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                components?.Dispose();
                Image?.Dispose();
                openHandCursor?.Dispose();
                closedHandCursor?.Dispose();
            }

            base.Dispose(disposing);
        }

        private void UpdateControls()
        {
            int toolbarMargin = 20;
            tsMain.Visible = ClientRectangle.Contains(PointToClient(MousePosition)) &&
                ClientRectangle.Contains(new Rectangle(0, 0, (Options.Border ? Options.BorderSize * 2 : 0) + tsMain.Width + toolbarMargin,
                (Options.Border ? Options.BorderSize * 2 : 0) + tsMain.Height + toolbarMargin));
            tslScale.Text = ImageScale + "%";
        }

        private void AutoSizeForm()
        {
            Size previousSize = Size;
            Size newSize = FormSize;

            Point newLocation = Location;
            IntPtr insertAfter = Options.TopMost ? (IntPtr)NativeConstants.HWND_TOPMOST : (IntPtr)NativeConstants.HWND_TOP;
            SetWindowPosFlags flags = SetWindowPosFlags.SWP_NOACTIVATE | SetWindowPosFlags.SWP_NOSENDCHANGING;

            if (Options.KeepCenterLocation)
            {
                Point locationOffset = new Point((previousSize.Width - newSize.Width) / 2, (previousSize.Height - newSize.Height) / 2);
                newLocation = new Point(newLocation.X + locationOffset.X, newLocation.Y + locationOffset.Y);
            }
            else
            {
                flags |= SetWindowPosFlags.SWP_NOMOVE;
            }

            NativeMethods.SetWindowPos(Handle, insertAfter, newLocation.X, newLocation.Y, newSize.Width, newSize.Height, flags);

            tsMain.Location = new Point(Width / 2 - tsMain.Width / 2, Options.Border ? Options.BorderSize : 0);

            UpdateControls();

            Refresh();
        }

        private void SetHandCursor(bool grabbing)
        {
            if (grabbing)
            {
                if (Cursor != closedHandCursor)
                {
                    Cursor = closedHandCursor;
                }
            }
            else
            {
                if (Cursor != openHandCursor)
                {
                    Cursor = openHandCursor;
                }
            }
        }

        private void ResetImage()
        {
            ImageScale = 100;
            ImageOpacity = 100;
        }

        private void ToggleMinimize()
        {
            Minimized = !Minimized;

            if (ImageOpacity < 100)
            {
                if (Minimized)
                {
                    Opacity = 1f;
                }
                else
                {
                    Opacity = ImageOpacity / 100f;
                }
            }

            AutoSizeForm();
        }

        private void tsbCopy_Click(object sender, EventArgs e)
        {
            ClipboardHelpers.CopyImage(Image);
        }

        private void tslScale_Click(object sender, EventArgs e)
        {
            if (!Minimized)
            {
                ImageScale = 100;
            }
        }

        private void tsbOptions_Click(object sender, EventArgs e)
        {
            tsMain.Visible = false;

            using (PinToScreenOptionsForm pinToScreenOptionsForm = new PinToScreenOptionsForm(Options))
            {
                if (pinToScreenOptionsForm.ShowDialogTopMost(this) == DialogResult.OK)
                {
                    if (TopMost != Options.TopMost)
                    {
                        TopMost = Options.TopMost;
                    }

                    AutoSizeForm();
                }
            }
        }

        private void tsbClose_Click(object sender, EventArgs e)
        {
            Close();
        }

        protected override void WndProc(ref Message m)
        {
            if (Options.Shadow && m.Msg == (int)WindowsMessages.NCPAINT && isDWMEnabled)
            {
                NativeMethods.SetNCRenderingPolicy(Handle, DWMNCRENDERINGPOLICY.DWMNCRP_ENABLED);

                if (Helpers.IsWindows11OrGreater())
                {
                    NativeMethods.SetWindowCornerPreference(Handle, DWM_WINDOW_CORNER_PREFERENCE.DWMWCP_DONOTROUND);
                }

                MARGINS margins = new MARGINS()
                {
                    bottomHeight = 1,
                    leftWidth = 1,
                    rightWidth = 1,
                    topHeight = 1
                };

                NativeMethods.DwmExtendFrameIntoClientArea(Handle, ref margins);
            }

            base.WndProc(ref m);
        }

        protected override void OnPaintBackground(PaintEventArgs e)
        {
            //base.OnPaintBackground(e);
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            Graphics g = e.Graphics;

            g.Clear(Options.BackgroundColor);

            if (Image != null)
            {
                Point position = new Point(0, 0);

                if (Options.Border)
                {
                    using (Pen pen = new Pen(Options.BorderColor, Options.BorderSize) { Alignment = PenAlignment.Inset })
                    {
                        g.DrawRectangleProper(pen, new Rectangle(position, FormSize));
                    }

                    position = position.Add(Options.BorderSize);
                }

                if (Minimized)
                {
                    g.InterpolationMode = InterpolationMode.NearestNeighbor;
                    g.DrawImage(Image, new Rectangle(position, Options.MinimizeSize), 0, 0, Options.MinimizeSize.Width, Options.MinimizeSize.Height, GraphicsUnit.Pixel);
                }
                else
                {
                    if (ImageScale == 100)
                    {
                        g.InterpolationMode = InterpolationMode.NearestNeighbor;
                        g.DrawImage(Image, new Rectangle(position, Image.Size));
                    }
                    else
                    {
                        if (Options.HighQualityScale)
                        {
                            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                        }
                        else
                        {
                            g.InterpolationMode = InterpolationMode.NearestNeighbor;
                        }

                        using (ImageAttributes ia = new ImageAttributes())
                        {
                            ia.SetWrapMode(WrapMode.TileFlipXY);
                            g.DrawImage(Image, new Rectangle(position, ImageSize), 0, 0, Image.Width, Image.Height, GraphicsUnit.Pixel, ia);
                        }
                    }
                }
            }
        }

        private void PinToScreenForm_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                if (e.Clicks > 1)
                {
                    ToggleMinimize();
                }
                else
                {
                    dragging = true;
                    initialLocation = e.Location;
                    SetHandCursor(true);
                }
            }
        }

        private void PinToScreenForm_MouseMove(object sender, MouseEventArgs e)
        {
            if (dragging)
            {
                Location = new Point(Location.X + e.X - initialLocation.X, Location.Y + e.Y - initialLocation.Y);
                Update();
            }
        }

        private void PinToScreenForm_MouseUp(object sender, MouseEventArgs e)
        {
            switch (e.Button)
            {
                case MouseButtons.Left:
                    dragging = false;
                    SetHandCursor(false);
                    break;
                case MouseButtons.Right:
                    Close();
                    break;
            }

            if (!Minimized)
            {
                switch (e.Button)
                {
                    case MouseButtons.Middle:
                        ResetImage();
                        break;
                }
            }
        }

        private void PinToScreenForm_MouseWheel(object sender, MouseEventArgs e)
        {
            if (!Minimized)
            {
                switch (ModifierKeys)
                {
                    case Keys.None:
                        if (e.Delta > 0)
                        {
                            ImageScale += Options.ScaleStep;
                        }
                        else if (e.Delta < 0)
                        {
                            ImageScale -= Options.ScaleStep;
                        }
                        break;
                    case Keys.Control:
                        if (e.Delta > 0)
                        {
                            ImageOpacity += Options.OpacityStep;
                        }
                        else if (e.Delta < 0)
                        {
                            ImageOpacity -= Options.OpacityStep;
                        }
                        break;
                }
            }
        }

        private void PinToScreenForm_MouseEnter(object sender, EventArgs e)
        {
            UpdateControls();
        }

        private void PinToScreenForm_MouseLeave(object sender, EventArgs e)
        {
            UpdateControls();
        }

        private void tsMain_MouseLeave(object sender, EventArgs e)
        {
            UpdateControls();
        }

        private void PinToScreenForm_KeyDown(object sender, KeyEventArgs e)
        {
            int speed = e.Shift ? 10 : 1;

            switch (e.KeyCode)
            {
                case Keys.Left:
                    Location = new Point(Location.X - speed, Location.Y);
                    break;
                case Keys.Right:
                    Location = new Point(Location.X + speed, Location.Y);
                    break;
                case Keys.Up:
                    Location = new Point(Location.X, Location.Y - speed);
                    break;
                case Keys.Down:
                    Location = new Point(Location.X, Location.Y + speed);
                    break;
            }
        }

        private void PinToScreenForm_KeyUp(object sender, KeyEventArgs e)
        {
            switch (e.KeyData)
            {
                case Keys.Control | Keys.C:
                    ClipboardHelpers.CopyImage(Image);
                    break;
            }

            if (!Minimized)
            {
                switch (e.KeyData)
                {
                    case Keys.Oemplus:
                    case Keys.Add:
                        ImageScale += Options.ScaleStep;
                        break;
                    case Keys.OemMinus:
                    case Keys.Subtract:
                        ImageScale -= Options.ScaleStep;
                        break;
                    case Keys.Control | Keys.Oemplus:
                    case Keys.Control | Keys.Add:
                        ImageOpacity += Options.OpacityStep;
                        break;
                    case Keys.Control | Keys.OemMinus:
                    case Keys.Control | Keys.Subtract:
                        ImageOpacity -= Options.OpacityStep;
                        break;
                }
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: PinToScreenForm.de.resx]---
Location: ShareX-develop/ShareX/Tools/PinToScreen/PinToScreenForm.de.resx

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
  <data name="tsbCopy.Text" xml:space="preserve">
    <value>Kopieren</value>
  </data>
  <data name="tslScale.ToolTipText" xml:space="preserve">
    <value>Skalieren</value>
  </data>
  <data name="tsbOptions.Text" xml:space="preserve">
    <value>Optionen...</value>
  </data>
  <data name="tsbClose.Text" xml:space="preserve">
    <value>Schließen</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - An Bildschirm anheften</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: PinToScreenForm.Designer.cs]---
Location: ShareX-develop/ShareX/Tools/PinToScreen/PinToScreenForm.Designer.cs

```csharp
namespace ShareX
{
    partial class PinToScreenForm
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(PinToScreenForm));
            this.tsMain = new ShareX.HelpersLib.ToolStripEx();
            this.tsbCopy = new System.Windows.Forms.ToolStripButton();
            this.tslScale = new System.Windows.Forms.ToolStripLabel();
            this.tsbOptions = new System.Windows.Forms.ToolStripButton();
            this.tsbClose = new System.Windows.Forms.ToolStripButton();
            this.tsMain.SuspendLayout();
            this.SuspendLayout();
            // 
            // tsMain
            // 
            this.tsMain.ClickThrough = true;
            resources.ApplyResources(this.tsMain, "tsMain");
            this.tsMain.GripStyle = System.Windows.Forms.ToolStripGripStyle.Hidden;
            this.tsMain.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.tsbCopy,
            this.tslScale,
            this.tsbOptions,
            this.tsbClose});
            this.tsMain.Name = "tsMain";
            this.tsMain.MouseLeave += new System.EventHandler(this.tsMain_MouseLeave);
            // 
            // tsbCopy
            // 
            this.tsbCopy.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbCopy.Image = global::ShareX.Properties.Resources.document_copy;
            resources.ApplyResources(this.tsbCopy, "tsbCopy");
            this.tsbCopy.Name = "tsbCopy";
            this.tsbCopy.Padding = new System.Windows.Forms.Padding(4);
            this.tsbCopy.Click += new System.EventHandler(this.tsbCopy_Click);
            // 
            // tslScale
            // 
            resources.ApplyResources(this.tslScale, "tslScale");
            this.tslScale.Name = "tslScale";
            this.tslScale.Padding = new System.Windows.Forms.Padding(4);
            this.tslScale.Click += new System.EventHandler(this.tslScale_Click);
            // 
            // tsbOptions
            // 
            this.tsbOptions.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbOptions.Image = global::ShareX.Properties.Resources.gear;
            resources.ApplyResources(this.tsbOptions, "tsbOptions");
            this.tsbOptions.Name = "tsbOptions";
            this.tsbOptions.Padding = new System.Windows.Forms.Padding(4);
            this.tsbOptions.Click += new System.EventHandler(this.tsbOptions_Click);
            // 
            // tsbClose
            // 
            this.tsbClose.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.tsbClose.Image = global::ShareX.Properties.Resources.cross_button;
            resources.ApplyResources(this.tsbClose, "tsbClose");
            this.tsbClose.Name = "tsbClose";
            this.tsbClose.Padding = new System.Windows.Forms.Padding(4);
            this.tsbClose.Click += new System.EventHandler(this.tsbClose_Click);
            // 
            // PinToScreenForm
            // 
            resources.ApplyResources(this, "$this");
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.tsMain);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Name = "PinToScreenForm";
            this.ShowInTaskbar = false;
            this.KeyDown += new System.Windows.Forms.KeyEventHandler(this.PinToScreenForm_KeyDown);
            this.KeyUp += new System.Windows.Forms.KeyEventHandler(this.PinToScreenForm_KeyUp);
            this.MouseDown += new System.Windows.Forms.MouseEventHandler(this.PinToScreenForm_MouseDown);
            this.MouseEnter += new System.EventHandler(this.PinToScreenForm_MouseEnter);
            this.MouseLeave += new System.EventHandler(this.PinToScreenForm_MouseLeave);
            this.MouseMove += new System.Windows.Forms.MouseEventHandler(this.PinToScreenForm_MouseMove);
            this.MouseUp += new System.Windows.Forms.MouseEventHandler(this.PinToScreenForm_MouseUp);
            this.MouseWheel += new System.Windows.Forms.MouseEventHandler(this.PinToScreenForm_MouseWheel);
            this.tsMain.ResumeLayout(false);
            this.tsMain.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private HelpersLib.ToolStripEx tsMain;
        private System.Windows.Forms.ToolStripButton tsbOptions;
        private System.Windows.Forms.ToolStripButton tsbClose;
        private System.Windows.Forms.ToolStripLabel tslScale;
        private System.Windows.Forms.ToolStripButton tsbCopy;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: PinToScreenForm.es-MX.resx]---
Location: ShareX-develop/ShareX/Tools/PinToScreen/PinToScreenForm.es-MX.resx

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
  <data name="tsbCopy.Text" xml:space="preserve">
    <value>Copiar</value>
  </data>
  <data name="tslScale.ToolTipText" xml:space="preserve">
    <value>Escalar</value>
  </data>
  <data name="tsbOptions.Text" xml:space="preserve">
    <value>Opciones...</value>
  </data>
  <data name="tsbClose.Text" xml:space="preserve">
    <value>Cerrar</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - Fijar a la pantalla</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
