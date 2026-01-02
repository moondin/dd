---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 486
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 486 of 650)

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

---[FILE: RegionCaptureLightForm.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Forms/RegionCaptureLightForm.cs

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
using System.Drawing.Imaging;
using System.Windows.Forms;

namespace ShareX.ScreenCaptureLib
{
    public sealed class RegionCaptureLightForm : Form
    {
        private const int MinimumRectangleSize = 5;

        public static Rectangle LastSelectionRectangle { get; private set; }
        public static Rectangle LastScreenSelectionRectangle { get; private set; }

        public Rectangle ScreenRectangle { get; private set; }
        public Rectangle SelectionRectangle { get; private set; }
        public Rectangle ScreenSelectionRectangle { get; private set; }

        private Bitmap backgroundImage;
        private TextureBrush backgroundBrush;
        private Pen borderDotPen, borderDotPen2;
        private Point positionOnClick;
        private bool isMouseDown;
        private bool isTransparentBackground;

        public RegionCaptureLightForm(Bitmap background, bool activeMonitorMode = false)
        {
            borderDotPen = new Pen(Color.White, 1);
            borderDotPen2 = new Pen(Color.Black, 1);
            borderDotPen2.DashPattern = new float[] { 5, 5 };

            if (activeMonitorMode)
            {
                ScreenRectangle = CaptureHelpers.GetActiveScreenBounds();

                Helpers.LockCursorToWindow(this);
            }
            else
            {
                ScreenRectangle = CaptureHelpers.GetScreenBounds();
            }

            isTransparentBackground = background == null;

            if (!isTransparentBackground)
            {
                backgroundImage = background;
                backgroundBrush = new TextureBrush(backgroundImage);
            }
            else
            {
                backgroundImage = new Bitmap(ScreenRectangle.Width, ScreenRectangle.Height, PixelFormat.Format32bppArgb);
            }

            InitializeComponent();
        }

        private void InitializeComponent()
        {
            SuspendLayout();

            AutoScaleMode = AutoScaleMode.None;
            StartPosition = FormStartPosition.Manual;
            Bounds = ScreenRectangle;
            FormBorderStyle = FormBorderStyle.None;

            if (!isTransparentBackground)
            {
                SetStyle(ControlStyles.OptimizedDoubleBuffer | ControlStyles.UserPaint | ControlStyles.AllPaintingInWmPaint, true);
                Text = "ShareX - " + Resources.RectangleLight_InitializeComponent_Rectangle_capture_light;
            }
            else
            {
                Text = "ShareX - " + Resources.RectangleTransparent_RectangleTransparent_Rectangle_capture_transparent;
            }
            ShowInTaskbar = false;
#if !DEBUG
            TopMost = true;
#endif

            Shown += RegionCaptureLightForm_Shown;
            KeyUp += RegionCaptureLightForm_KeyUp;
            MouseDown += RegionCaptureLightForm_MouseDown;
            MouseUp += RegionCaptureLightForm_MouseUp;
            MouseMove += RegionCaptureLightForm_MouseMove;

            ResumeLayout(false);

            Icon = ShareXResources.Icon;
            Cursor = Helpers.CreateCursor(Resources.Crosshair);
        }

        protected override CreateParams CreateParams
        {
            get
            {
                CreateParams createParams = base.CreateParams;

                if (isTransparentBackground)
                {
                    createParams.ExStyle |= (int)WindowStyles.WS_EX_LAYERED;
                }

                return createParams;
            }
        }

        protected override void Dispose(bool disposing)
        {
            backgroundImage?.Dispose();
            backgroundBrush?.Dispose();
            borderDotPen?.Dispose();
            borderDotPen2?.Dispose();

            base.Dispose(disposing);
        }

        public void SelectBitmap(Bitmap bitmap, int opacity = 255)
        {
            if (bitmap.PixelFormat != PixelFormat.Format32bppArgb)
            {
                throw new ApplicationException("The bitmap must be 32bpp with alpha-channel.");
            }

            IntPtr screenDc = NativeMethods.GetDC(IntPtr.Zero);
            IntPtr memDc = NativeMethods.CreateCompatibleDC(screenDc);
            IntPtr hBitmap = IntPtr.Zero;
            IntPtr hOldBitmap = IntPtr.Zero;

            try
            {
                hBitmap = bitmap.GetHbitmap(Color.FromArgb(0));
                hOldBitmap = NativeMethods.SelectObject(memDc, hBitmap);

                SIZE newSize = new SIZE(bitmap.Width, bitmap.Height);
                POINT sourceLocation = new POINT(0, 0);
                POINT newLocation = new POINT(Left, Top);
                BLENDFUNCTION blend = new BLENDFUNCTION();
                blend.BlendOp = NativeConstants.AC_SRC_OVER;
                blend.BlendFlags = 0;
                blend.SourceConstantAlpha = (byte)opacity;
                blend.AlphaFormat = NativeConstants.AC_SRC_ALPHA;

                NativeMethods.UpdateLayeredWindow(Handle, screenDc, ref newLocation, ref newSize, memDc, ref sourceLocation, 0, ref blend, NativeConstants.ULW_ALPHA);
            }
            finally
            {
                NativeMethods.ReleaseDC(IntPtr.Zero, screenDc);
                if (hBitmap != IntPtr.Zero)
                {
                    NativeMethods.SelectObject(memDc, hOldBitmap);
                    NativeMethods.DeleteObject(hBitmap);
                }
                NativeMethods.DeleteDC(memDc);
            }
        }

        public Bitmap GetAreaImage()
        {
            Rectangle rect = SelectionRectangle;

            if (rect.Width > 0 && rect.Height > 0)
            {
                if (rect.X == 0 && rect.Y == 0 && rect.Width == backgroundImage.Width && rect.Height == backgroundImage.Height)
                {
                    return (Bitmap)backgroundImage.Clone();
                }

                return ImageHelpers.CropBitmap(backgroundImage, rect);
            }

            return null;
        }

        public Bitmap GetAreaImage(Screenshot screenshot)
        {
            Rectangle rect = ScreenSelectionRectangle;

            if (rect.Width > 0 && rect.Height > 0)
            {
                return screenshot.CaptureRectangle(rect);
            }

            return null;
        }

        private void DrawDottedRectangle(Graphics g, Pen pen1, Pen pen2, Rectangle rect)
        {
            g.DrawRectangleProper(pen1, rect);
            g.DrawLine(pen2, rect.X, rect.Y, rect.Right - 1, rect.Y);
            g.DrawLine(pen2, rect.X, rect.Y, rect.X, rect.Bottom - 1);
            g.DrawLine(pen2, rect.Right - 1, rect.Y, rect.Right - 1, rect.Bottom - 1);
            g.DrawLine(pen2, rect.X, rect.Bottom - 1, rect.Right - 1, rect.Bottom - 1);
        }

        private void RegionCaptureLightForm_Shown(object sender, EventArgs e)
        {
            this.ForceActivate();
        }

        private void RegionCaptureLightForm_KeyUp(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Escape)
            {
                DialogResult = DialogResult.Cancel;
                Close();
            }
        }

        private void RegionCaptureLightForm_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                positionOnClick = e.Location;
                isMouseDown = true;
            }
        }

        private void RegionCaptureLightForm_MouseUp(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                if (isMouseDown && SelectionRectangle.Width > MinimumRectangleSize && SelectionRectangle.Height > MinimumRectangleSize)
                {
                    LastSelectionRectangle = SelectionRectangle;
                    LastScreenSelectionRectangle = new Rectangle(LastSelectionRectangle.X + ScreenRectangle.X,
                        LastSelectionRectangle.Y + ScreenRectangle.Y, LastSelectionRectangle.Width, LastSelectionRectangle.Height);
                    DialogResult = DialogResult.OK;
                    Close();
                }
                else
                {
                    isMouseDown = false;
                }
            }
            else if (e.Button == MouseButtons.Right)
            {
                if (isMouseDown)
                {
                    isMouseDown = false;
                    Render();
                }
                else
                {
                    DialogResult = DialogResult.Cancel;
                    Close();
                }
            }
        }

        private void RegionCaptureLightForm_MouseMove(object sender, MouseEventArgs e)
        {
            SelectionRectangle = CaptureHelpers.CreateRectangle(positionOnClick.X, positionOnClick.Y, e.X, e.Y);
            ScreenSelectionRectangle = new Rectangle(SelectionRectangle.X + ScreenRectangle.X, SelectionRectangle.Y + ScreenRectangle.Y,
                SelectionRectangle.Width, SelectionRectangle.Height);

            Render();
        }

        protected override void OnPaintBackground(PaintEventArgs e)
        {
            //base.OnPaintBackground(e);
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            if (!isTransparentBackground)
            {
                Graphics g = e.Graphics;
                g.CompositingMode = CompositingMode.SourceCopy;
                g.SmoothingMode = SmoothingMode.None;
                g.FillRectangle(backgroundBrush, 0, 0, ScreenRectangle.Width, ScreenRectangle.Height);

                if (isMouseDown && SelectionRectangle.Width > MinimumRectangleSize && SelectionRectangle.Height > MinimumRectangleSize)
                {
                    DrawDottedRectangle(g, borderDotPen, borderDotPen2, SelectionRectangle);
                }
            }
        }

        private void Render()
        {
            if (isTransparentBackground)
            {
                UpdateLayeredSurface();
            }
            else
            {
                Invalidate();
            }
        }

        private void UpdateLayeredSurface()
        {
            using (Graphics g = Graphics.FromImage(backgroundImage))
            {
                g.CompositingMode = CompositingMode.SourceCopy;
                g.SmoothingMode = SmoothingMode.None;
                g.Clear(Color.FromArgb(1, 0, 0, 0));

                if (isMouseDown && SelectionRectangle.Width > MinimumRectangleSize && SelectionRectangle.Height > MinimumRectangleSize)
                {
                    DrawDottedRectangle(g, borderDotPen, borderDotPen2, SelectionRectangle);
                }
            }

            SelectBitmap(backgroundImage);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ScreenRecordForm.ar-YE.resx]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Forms/ScreenRecordForm.ar-YE.resx

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
  <data name="tsmiPause.Text" xml:space="preserve">
    <value>إيقاف مؤقت</value>
  </data>
  <data name="btnPause.Text" xml:space="preserve">
    <value>إيقاف مؤقت</value>
  </data>
  <data name="niTray.Text" xml:space="preserve">
    <value>ShareX</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - تسجيل الشاشة</value>
  </data>
  <data name="tsmiStart.Text" xml:space="preserve">
    <value>بدء</value>
  </data>
  <data name="btnStart.Text" xml:space="preserve">
    <value>بدء</value>
  </data>
  <data name="btnAbort.Text" xml:space="preserve">
    <value>إلغاء</value>
  </data>
  <data name="tsmiAbort.Text" xml:space="preserve">
    <value>إلغاء</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: ScreenRecordForm.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Forms/ScreenRecordForm.cs

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
using System.Diagnostics;
using System.Drawing;
using System.Threading;
using System.Windows.Forms;

namespace ShareX.ScreenCaptureLib
{
    public partial class ScreenRecordForm : Form
    {
        public event Action StopRequested;

        private ScreenRecordingStatus status;

        public ScreenRecordingStatus Status
        {
            get
            {
                return status;
            }
            private set
            {
                status = value;
            }
        }

        public TimeSpan Countdown { get; set; }
        public bool IsCountdown { get; private set; }
        public Stopwatch Timer { get; private set; }
        public ManualResetEvent RecordResetEvent { get; set; }

        public bool ActivateWindow { get; set; } = true;
        public float Duration { get; set; } = 0;
        public bool AskConfirmationOnAbort { get; set; } = false;

        public Rectangle RecordingRegion
        {
            get
            {
                return GetRecordingRegion(Location);
            }
        }

        protected override bool ShowWithoutActivation
        {
            get
            {
                return !ActivateWindow;
            }
        }

        protected override CreateParams CreateParams
        {
            get
            {
                CreateParams createParams = base.CreateParams;
                createParams.ExStyle |= (int)(WindowStyles.WS_EX_TOPMOST | WindowStyles.WS_EX_TOOLWINDOW);
                return createParams;
            }
        }

        private Color borderColor = Color.Red;
        private Rectangle borderRectangle;
        private Rectangle borderRectangle0Based;
        private bool dragging;
        private Point initialLocation;
        private static int lastIconStatus = -1;
        private const int panelOffset = 3;

        public ScreenRecordForm(Rectangle regionRectangle)
        {
            InitializeComponent();
            ShareXResources.ApplyTheme(this);
            niTray.Icon = ShareXResources.Icon;

            borderRectangle = regionRectangle.Offset(1);
            borderRectangle0Based = new Rectangle(0, 0, borderRectangle.Width, borderRectangle.Height);

            Location = borderRectangle.Location;
            int windowWidth = Math.Max(borderRectangle.Width, pInfo.Width);
            Size = new Size(windowWidth, borderRectangle.Height + panelOffset + pInfo.Height);
            pInfo.Location = new Point(0, borderRectangle.Height + panelOffset);

            Region region = new Region(ClientRectangle);
            region.Exclude(borderRectangle0Based.Offset(-1));
            region.Exclude(new Rectangle(0, borderRectangle.Height, windowWidth, panelOffset));
            if (borderRectangle.Width < pInfo.Width)
            {
                region.Exclude(new Rectangle(borderRectangle.Width, 0, pInfo.Width - borderRectangle.Width, borderRectangle.Height));
            }
            else if (borderRectangle.Width > pInfo.Width)
            {
                region.Exclude(new Rectangle(pInfo.Width, borderRectangle.Height + panelOffset, borderRectangle.Width - pInfo.Width, pInfo.Height));
            }
            Region = region;

            Timer = new Stopwatch();
            UpdateTimer();

            RecordResetEvent = new ManualResetEvent(false);

            ChangeState(ScreenRecordState.Waiting);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (components != null)
                {
                    components.Dispose();
                }

                if (RecordResetEvent != null)
                {
                    RecordResetEvent.Dispose();
                }
            }

            base.Dispose(disposing);
        }

        private Rectangle GetRecordingRegion(Point windowLocation)
        {
            return new Rectangle(windowLocation.X + 1, windowLocation.Y + 1, borderRectangle.Width - 2, borderRectangle.Height - 2);
        }

        public void StartStopRecording()
        {
            if (Status == ScreenRecordingStatus.Working)
            {
                AbortRecording();
            }
            else if (Status == ScreenRecordingStatus.Recording)
            {
                Status = ScreenRecordingStatus.Stopped;
                OnStopRequested();
            }
            else if (Status == ScreenRecordingStatus.Paused)
            {
                Status = ScreenRecordingStatus.Stopped;
                RecordResetEvent?.Set();
            }
            else
            {
                RecordResetEvent?.Set();
            }
        }

        public void PauseResumeRecording()
        {
            if (Status == ScreenRecordingStatus.Recording)
            {
                Status = ScreenRecordingStatus.Paused;
                RecordResetEvent?.Reset();
                OnStopRequested();
            }
            else
            {
                RecordResetEvent?.Set();
            }
        }

        public void AbortRecording()
        {
            Status = ScreenRecordingStatus.Aborted;
            OnStopRequested();
            RecordResetEvent?.Set();
        }

        protected void OnStopRequested()
        {
            StopRequested?.Invoke();
        }

        public void StartCountdown(int milliseconds)
        {
            IsCountdown = true;
            Countdown = TimeSpan.FromMilliseconds(milliseconds);

            Timer.Start();
            timerRefresh.Start();
            UpdateTimer();
        }

        public void StartRecordingTimer()
        {
            if (IsCountdown)
            {
                Timer.Reset();
                IsCountdown = false;
            }

            if (Duration > 0)
            {
                IsCountdown = true;
                Countdown = TimeSpan.FromSeconds(Duration);
            }

            borderColor = Color.Lime;
            Refresh();

            Timer.Start();
            timerRefresh.Start();
            UpdateTimer();
        }

        public void StopRecordingTimer()
        {
            Timer.Stop();
            timerRefresh.Stop();
            UpdateTimer();
        }

        private void UpdateTimer()
        {
            if (!IsDisposed)
            {
                TimeSpan timer;

                if (IsCountdown)
                {
                    timer = Countdown - Timer.Elapsed;
                    if (timer.Ticks < 0) timer = TimeSpan.Zero;
                }
                else
                {
                    timer = Timer.Elapsed;
                }

                lblTimer.Text = timer.ToString("mm\\:ss\\:ff");
            }
        }

        private void UpdateUI()
        {
            switch (Status)
            {
                case ScreenRecordingStatus.Working:
                    string trayTextWorking = "ShareX - " + Resources.ScreenRecordForm_StartRecording_Click_tray_icon_to_stop_recording_;
                    niTray.Text = trayTextWorking.Truncate(63);
                    niTray.Icon = Resources.control_record.ToIcon();
                    btnStart.Text = Resources.ScreenRecordForm_Stop;
                    tsmiStart.Text = Resources.ScreenRecordForm_Stop;
                    tsmiStart.Image = Resources.tick;
                    break;
                case ScreenRecordingStatus.Waiting:
                case ScreenRecordingStatus.Paused:
                    if (Status == ScreenRecordingStatus.Paused)
                    {
                        string trayTextWaiting = "ShareX - " + Resources.ScreenRecordForm_StartRecording_Click_tray_icon_to_stop_recording_;
                        niTray.Text = trayTextWaiting.Truncate(63);
                    }
                    else
                    {
                        string trayTextBeforeStart = "ShareX - " + Resources.ScreenRecordForm_StartRecording_Click_tray_icon_to_start_recording_;
                        niTray.Text = trayTextBeforeStart.Truncate(63);
                    }
                    niTray.Icon = Resources.control_record_yellow.ToIcon();
                    btnPause.Text = Resources.Resume;
                    tsmiPause.Text = Resources.Resume;
                    tsmiPause.Image = Resources.control;
                    lblTimer.Cursor = Cursors.SizeAll;
                    borderColor = Color.FromArgb(241, 196, 27);
                    Refresh();
                    break;
                case ScreenRecordingStatus.Recording:
                    niTray.Icon = Resources.control_record.ToIcon();
                    btnPause.Text = Resources.Pause;
                    tsmiPause.Text = Resources.Pause;
                    tsmiPause.Image = Resources.control_pause;
                    lblTimer.Cursor = Cursors.Default;
                    break;
            }
        }

        public void ChangeState(ScreenRecordState state)
        {
            this.InvokeSafe(() =>
            {
                switch (state)
                {
                    case ScreenRecordState.Waiting:
                        string trayTextWaiting = "ShareX - " + Resources.ScreenRecordForm_StartRecording_Waiting___;
                        niTray.Text = trayTextWaiting.Truncate(63);
                        niTray.Icon = Resources.control_record_yellow.ToIcon();
                        cmsMain.Enabled = false;
                        niTray.Visible = true;
                        break;
                    case ScreenRecordState.BeforeStart:
                        cmsMain.Enabled = true;
                        UpdateUI();
                        break;
                    case ScreenRecordState.AfterStart:
                        dragging = false;
                        Status = ScreenRecordingStatus.Working;
                        UpdateUI();
                        break;
                    case ScreenRecordState.AfterRecordingStart:
                        Status = ScreenRecordingStatus.Recording;
                        StartRecordingTimer();
                        UpdateUI();
                        break;
                    case ScreenRecordState.RecordingEnd:
                        StopRecordingTimer();
                        UpdateUI();
                        break;
                    case ScreenRecordState.Encoding:
                        Hide();
                        cmsMain.Enabled = false;
                        string trayTextAfterStop = "ShareX - " + Resources.ScreenRecordForm_StartRecording_Encoding___;
                        niTray.Text = trayTextAfterStop.Truncate(63);
                        niTray.Icon = Resources.camcorder__pencil.ToIcon();
                        break;
                }
            });
        }

        public void ChangeStateProgress(int progress)
        {
            niTray.Text = $"ShareX - {Resources.ScreenRecordForm_StartRecording_Encoding___} {progress}%";

            if (niTray.Visible && lastIconStatus != progress)
            {
                Icon icon;

                if (progress >= 0)
                {
                    try
                    {
                        icon = Helpers.GetProgressIcon(progress, Color.FromArgb(140, 0, 36));
                    }
                    catch (Exception e)
                    {
                        DebugHelper.WriteException(e);
                        progress = -1;
                        if (lastIconStatus == progress) return;
                        icon = Resources.camcorder__pencil.ToIcon();
                    }
                }
                else
                {
                    icon = Resources.camcorder__pencil.ToIcon();
                }

                using (Icon oldIcon = niTray.Icon)
                {
                    niTray.Icon = icon;
                    oldIcon.DisposeHandle();
                }

                lastIconStatus = progress;
            }
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            using (Pen pen1 = new Pen(ShareXResources.Theme.BorderColor) { DashPattern = new float[] { 5, 5 } })
            using (Pen pen2 = new Pen(borderColor) { DashPattern = new float[] { 5, 5 }, DashOffset = 5 })
            {
                e.Graphics.DrawRectangleProper(pen1, borderRectangle0Based);
                e.Graphics.DrawRectangleProper(pen2, borderRectangle0Based);
            }

            base.OnPaint(e);
        }

        private void ScreenRegionForm_Shown(object sender, EventArgs e)
        {
            if (ActivateWindow)
            {
                this.ForceActivate();
            }
        }

        private void ScreenRecordForm_FormClosed(object sender, FormClosedEventArgs e)
        {
            if (Status != ScreenRecordingStatus.Stopped)
            {
                AbortRecording();
            }
        }

        private void timerRefresh_Tick(object sender, EventArgs e)
        {
            UpdateTimer();
        }

        private void btnStart_MouseClick(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                StartStopRecording();
            }
        }

        private void btnPause_MouseClick(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                PauseResumeRecording();
            }
        }

        private void btnAbort_MouseClick(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                if (!AskConfirmationOnAbort || MessageBox.Show(Resources.ScreenRecordForm_ConfirmCancel, "ShareX", MessageBoxButtons.YesNo,
                    MessageBoxIcon.Warning) == DialogResult.Yes)
                {
                    AbortRecording();
                }
            }
        }

        private void lblTimer_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left && (Status == ScreenRecordingStatus.Waiting || Status == ScreenRecordingStatus.Paused))
            {
                dragging = true;
                initialLocation = e.Location;
            }
        }

        private void lblTimer_MouseMove(object sender, MouseEventArgs e)
        {
            if (dragging)
            {
                Point newLocation = new Point(Location.X + e.X - initialLocation.X, Location.Y + e.Y - initialLocation.Y);
                Rectangle recordingRegion = GetRecordingRegion(newLocation);
                if (CaptureHelpers.GetScreenBounds().Contains(recordingRegion))
                {
                    Location = newLocation;
                    Update();
                }
                else
                {
                    initialLocation = e.Location;
                }
            }
        }

        private void lblTimer_MouseUp(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                dragging = false;
            }
        }
    }
}
```

--------------------------------------------------------------------------------

````
