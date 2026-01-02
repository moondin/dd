---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 238
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 238 of 650)

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

---[FILE: ColorPicker.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Colors/ColorPicker.cs

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

using System.ComponentModel;
using System.Drawing;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    [DefaultEvent("ColorChanged")]
    public class ColorPicker : UserControl
    {
        public event ColorEventHandler ColorChanged;

        private MyColor selectedColor;

        public MyColor SelectedColor
        {
            get
            {
                return selectedColor;
            }
            private set
            {
                if (selectedColor != value)
                {
                    selectedColor = value;
                    colorBox.SelectedColor = selectedColor;
                    colorSlider.SelectedColor = selectedColor;
                }
            }
        }

        private DrawStyle drawStyle;

        public DrawStyle DrawStyle
        {
            get
            {
                return drawStyle;
            }
            set
            {
                if (drawStyle != value)
                {
                    drawStyle = value;
                    colorBox.DrawStyle = value;
                    colorSlider.DrawStyle = value;
                }
            }
        }

        public bool CrosshairVisible
        {
            set
            {
                colorBox.CrosshairVisible = value;
                colorSlider.CrosshairVisible = value;
            }
        }

        private ColorBox colorBox;
        private ColorSlider colorSlider;

        public ColorPicker()
        {
            InitializeComponent();
            DrawStyle = DrawStyle.Hue;
            colorBox.ColorChanged += colorBox_ColorChanged;
            colorSlider.ColorChanged += colorSlider_ColorChanged;
        }

        private void colorBox_ColorChanged(object sender, ColorEventArgs e)
        {
            selectedColor = e.Color;
            colorSlider.SelectedColor = SelectedColor;
            OnColorChanged();
        }

        private void colorSlider_ColorChanged(object sender, ColorEventArgs e)
        {
            selectedColor = e.Color;
            colorBox.SelectedColor = SelectedColor;
            OnColorChanged();
        }

        public void ChangeColor(Color color, ColorType colorType = ColorType.None)
        {
            SelectedColor = color;
            OnColorChanged(colorType);
        }

        private void OnColorChanged(ColorType colorType = ColorType.None)
        {
            ColorChanged?.Invoke(this, new ColorEventArgs(SelectedColor, colorType));
        }

        #region Component Designer generated code

        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            colorBox = new HelpersLib.ColorBox();
            colorSlider = new HelpersLib.ColorSlider();
            SuspendLayout();
            //
            // colorBox
            //
            colorBox.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            colorBox.DrawStyle = HelpersLib.DrawStyle.Hue;
            colorBox.Location = new System.Drawing.Point(0, 0);
            colorBox.Name = "colorBox";
            colorBox.Size = new System.Drawing.Size(258, 258);
            colorBox.TabIndex = 0;
            //
            // colorSlider
            //
            colorSlider.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            colorSlider.DrawStyle = HelpersLib.DrawStyle.Hue;
            colorSlider.Location = new System.Drawing.Point(257, 0);
            colorSlider.Name = "colorSlider";
            colorSlider.Size = new System.Drawing.Size(32, 258);
            colorSlider.TabIndex = 1;
            //
            // ColorPicker
            //
            AutoSize = true;
            Controls.Add(colorBox);
            Controls.Add(colorSlider);
            Name = "ColorPicker";
            Size = new System.Drawing.Size(292, 261);
            ResumeLayout(false);
        }

        #endregion Component Designer generated code
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ColorSlider.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Colors/ColorSlider.cs

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

using System.Drawing;
using System.Drawing.Drawing2D;

namespace ShareX.HelpersLib
{
    public class ColorSlider : ColorUserControl
    {
        public ColorSlider()
        {
            Initialize();
        }

        protected override void Initialize()
        {
            Name = "ColorSlider";
            ClientSize = new Size(30, 256);
            base.Initialize();
        }

        protected override void DrawCrosshair(Graphics g)
        {
            DrawCrosshair(g, Pens.Black, 3, 11);
            DrawCrosshair(g, Pens.White, 4, 9);
        }

        private void DrawCrosshair(Graphics g, Pen pen, int offset, int height)
        {
            g.DrawRectangleProper(pen, new Rectangle(offset, lastPos.Y - (height / 2), clientWidth - (offset * 2), height));
        }

        // Y = Hue 360 -> 0
        protected override void DrawHue()
        {
            using (Graphics g = Graphics.FromImage(bmp))
            {
                HSB color = new HSB(0.0, 1.0, 1.0, SelectedColor.RGBA.Alpha);

                for (int y = 0; y < clientHeight; y++)
                {
                    color.Hue = 1.0 - ((double)y / (clientHeight - 1));

                    using (Pen pen = new Pen(color))
                    {
                        g.DrawLine(pen, 0, y, clientWidth, y);
                    }
                }
            }
        }

        // Y = Saturation 100 -> 0
        protected override void DrawSaturation()
        {
            using (Graphics g = Graphics.FromImage(bmp))
            {
                HSB start = new HSB(SelectedColor.HSB.Hue, 1.0, SelectedColor.HSB.Brightness, SelectedColor.RGBA.Alpha);
                HSB end = new HSB(SelectedColor.HSB.Hue, 0.0, SelectedColor.HSB.Brightness, SelectedColor.RGBA.Alpha);

                using (LinearGradientBrush brush = new LinearGradientBrush(new Rectangle(0, 0, clientWidth, clientHeight), start, end, LinearGradientMode.Vertical))
                {
                    g.FillRectangle(brush, new Rectangle(0, 0, clientWidth, clientHeight));
                }
            }
        }

        // Y = Brightness 100 -> 0
        protected override void DrawBrightness()
        {
            using (Graphics g = Graphics.FromImage(bmp))
            {
                HSB start = new HSB(SelectedColor.HSB.Hue, SelectedColor.HSB.Saturation, 1.0, SelectedColor.RGBA.Alpha);
                HSB end = new HSB(SelectedColor.HSB.Hue, SelectedColor.HSB.Saturation, 0.0, SelectedColor.RGBA.Alpha);

                using (LinearGradientBrush brush = new LinearGradientBrush(new Rectangle(0, 0, clientWidth, clientHeight), start, end, LinearGradientMode.Vertical))
                {
                    g.FillRectangle(brush, new Rectangle(0, 0, clientWidth, clientHeight));
                }
            }
        }

        // Y = Red 255 -> 0
        protected override void DrawRed()
        {
            using (Graphics g = Graphics.FromImage(bmp))
            {
                RGBA start = new RGBA(255, SelectedColor.RGBA.Green, SelectedColor.RGBA.Blue, SelectedColor.RGBA.Alpha);
                RGBA end = new RGBA(0, SelectedColor.RGBA.Green, SelectedColor.RGBA.Blue, SelectedColor.RGBA.Alpha);

                using (LinearGradientBrush brush = new LinearGradientBrush(new Rectangle(0, 0, clientWidth, clientHeight), start, end, LinearGradientMode.Vertical))
                {
                    g.FillRectangle(brush, new Rectangle(0, 0, clientWidth, clientHeight));
                }
            }
        }

        // Y = Green 255 -> 0
        protected override void DrawGreen()
        {
            using (Graphics g = Graphics.FromImage(bmp))
            {
                RGBA start = new RGBA(SelectedColor.RGBA.Red, 255, SelectedColor.RGBA.Blue, SelectedColor.RGBA.Alpha);
                RGBA end = new RGBA(SelectedColor.RGBA.Red, 0, SelectedColor.RGBA.Blue, SelectedColor.RGBA.Alpha);

                using (LinearGradientBrush brush = new LinearGradientBrush(new Rectangle(0, 0, clientWidth, clientHeight), start, end, LinearGradientMode.Vertical))
                {
                    g.FillRectangle(brush, new Rectangle(0, 0, clientWidth, clientHeight));
                }
            }
        }

        // Y = Blue 255 -> 0
        protected override void DrawBlue()
        {
            using (Graphics g = Graphics.FromImage(bmp))
            {
                RGBA start = new RGBA(SelectedColor.RGBA.Red, SelectedColor.RGBA.Green, 255, SelectedColor.RGBA.Alpha);
                RGBA end = new RGBA(SelectedColor.RGBA.Red, SelectedColor.RGBA.Green, 0, SelectedColor.RGBA.Alpha);

                using (LinearGradientBrush brush = new LinearGradientBrush(new Rectangle(0, 0, clientWidth, clientHeight), start, end, LinearGradientMode.Vertical))
                {
                    g.FillRectangle(brush, new Rectangle(0, 0, clientWidth, clientHeight));
                }
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ColorUserControl.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Colors/ColorUserControl.cs

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
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Imaging;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public abstract class ColorUserControl : UserControl
    {
        public event ColorEventHandler ColorChanged;

        public bool CrosshairVisible { get; set; } = true;

        public MyColor SelectedColor
        {
            get
            {
                return selectedColor;
            }
            set
            {
                selectedColor = value;

                if (this is ColorBox)
                {
                    SetBoxMarker();
                }
                else
                {
                    SetSliderMarker();
                }

                Invalidate();
            }
        }

        public DrawStyle DrawStyle
        {
            get
            {
                return drawStyle;
            }
            set
            {
                drawStyle = value;

                if (this is ColorBox)
                {
                    SetBoxMarker();
                }
                else
                {
                    SetSliderMarker();
                }

                Invalidate();
            }
        }

        protected Bitmap bmp;
        protected int clientWidth, clientHeight;
        protected DrawStyle drawStyle;
        protected MyColor selectedColor;
        protected bool mouseDown;
        protected Point lastPos;
        protected Timer mouseMoveTimer;

        #region Component Designer generated code

        private IContainer components = null;

        protected virtual void Initialize()
        {
            SuspendLayout();

            DoubleBuffered = true;
            clientWidth = ClientRectangle.Width;
            clientHeight = ClientRectangle.Height;
            bmp = new Bitmap(clientWidth, clientHeight, PixelFormat.Format32bppArgb);
            SelectedColor = Color.Red;
            DrawStyle = DrawStyle.Hue;

            mouseMoveTimer = new Timer();
            mouseMoveTimer.Interval = 10;
            mouseMoveTimer.Tick += new EventHandler(MouseMoveTimer_Tick);

            ClientSizeChanged += new EventHandler(EventClientSizeChanged);
            MouseDown += new MouseEventHandler(EventMouseDown);
            MouseEnter += new EventHandler(EventMouseEnter);
            MouseUp += new MouseEventHandler(EventMouseUp);
            Paint += new PaintEventHandler(EventPaint);

            ResumeLayout(false);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
                if (bmp != null) bmp.Dispose();
            }
            base.Dispose(disposing);
        }

        #endregion Component Designer generated code

        #region Events

        private void EventClientSizeChanged(object sender, EventArgs e)
        {
            clientWidth = ClientRectangle.Width;
            clientHeight = ClientRectangle.Height;
            if (bmp != null) bmp.Dispose();
            bmp = new Bitmap(clientWidth, clientHeight, PixelFormat.Format32bppArgb);
            DrawColors();
        }

        private void EventMouseDown(object sender, MouseEventArgs e)
        {
            CrosshairVisible = true;
            mouseDown = true;
            mouseMoveTimer.Start();
        }

        private void EventMouseEnter(object sender, EventArgs e)
        {
            if (this is ColorBox)
            {
                Cursor = Helpers.CreateCursor(Resources.Crosshair);
            }
        }

        private void EventMouseUp(object sender, MouseEventArgs e)
        {
            mouseDown = false;
            mouseMoveTimer.Stop();
        }

        private void EventPaint(object sender, PaintEventArgs e)
        {
            Graphics g = e.Graphics;

            if (!mouseDown)
            {
                if (SelectedColor.IsTransparent)
                {
                    if (bmp != null) bmp.Dispose();
                    bmp = ImageHelpers.DrawCheckers(clientWidth, clientHeight);
                }

                DrawColors();
            }

            g.DrawImage(bmp, ClientRectangle);

            if (CrosshairVisible)
            {
                DrawCrosshair(g);
            }
        }

        private void MouseMoveTimer_Tick(object sender, EventArgs e)
        {
            Point mousePosition = GetPoint(PointToClient(MousePosition));

            if (mouseDown && lastPos != mousePosition)
            {
                GetPointColor(mousePosition);
                OnColorChanged();
                Refresh();
            }
        }

        #endregion Events

        #region Protected Methods

        protected void OnColorChanged()
        {
            ColorChanged?.Invoke(this, new ColorEventArgs(SelectedColor, DrawStyle));
        }

        protected void DrawColors()
        {
            switch (DrawStyle)
            {
                case DrawStyle.Hue:
                    DrawHue();
                    break;
                case DrawStyle.Saturation:
                    DrawSaturation();
                    break;
                case DrawStyle.Brightness:
                    DrawBrightness();
                    break;
                case DrawStyle.Red:
                    DrawRed();
                    break;
                case DrawStyle.Green:
                    DrawGreen();
                    break;
                case DrawStyle.Blue:
                    DrawBlue();
                    break;
            }
        }

        protected void SetBoxMarker()
        {
            switch (DrawStyle)
            {
                case DrawStyle.Hue:
                    lastPos.X = Round((clientWidth - 1) * SelectedColor.HSB.Saturation);
                    lastPos.Y = Round((clientHeight - 1) * (1.0 - SelectedColor.HSB.Brightness));
                    break;
                case DrawStyle.Saturation:
                    lastPos.X = Round((clientWidth - 1) * SelectedColor.HSB.Hue);
                    lastPos.Y = Round((clientHeight - 1) * (1.0 - SelectedColor.HSB.Brightness));
                    break;
                case DrawStyle.Brightness:
                    lastPos.X = Round((clientWidth - 1) * SelectedColor.HSB.Hue);
                    lastPos.Y = Round((clientHeight - 1) * (1.0 - SelectedColor.HSB.Saturation));
                    break;
                case DrawStyle.Red:
                    lastPos.X = Round((clientWidth - 1) * (double)SelectedColor.RGBA.Blue / 255);
                    lastPos.Y = Round((clientHeight - 1) * (1.0 - ((double)SelectedColor.RGBA.Green / 255)));
                    break;
                case DrawStyle.Green:
                    lastPos.X = Round((clientWidth - 1) * (double)SelectedColor.RGBA.Blue / 255);
                    lastPos.Y = Round((clientHeight - 1) * (1.0 - ((double)SelectedColor.RGBA.Red / 255)));
                    break;
                case DrawStyle.Blue:
                    lastPos.X = Round((clientWidth - 1) * (double)SelectedColor.RGBA.Red / 255);
                    lastPos.Y = Round((clientHeight - 1) * (1.0 - ((double)SelectedColor.RGBA.Green / 255)));
                    break;
            }

            lastPos = GetPoint(lastPos);
        }

        protected void GetBoxColor()
        {
            switch (DrawStyle)
            {
                case DrawStyle.Hue:
                    selectedColor.HSB.Saturation = (double)lastPos.X / (clientWidth - 1);
                    selectedColor.HSB.Brightness = 1.0 - ((double)lastPos.Y / (clientHeight - 1));
                    selectedColor.HSBUpdate();
                    break;
                case DrawStyle.Saturation:
                    selectedColor.HSB.Hue = (double)lastPos.X / (clientWidth - 1);
                    selectedColor.HSB.Brightness = 1.0 - ((double)lastPos.Y / (clientHeight - 1));
                    selectedColor.HSBUpdate();
                    break;
                case DrawStyle.Brightness:
                    selectedColor.HSB.Hue = (double)lastPos.X / (clientWidth - 1);
                    selectedColor.HSB.Saturation = 1.0 - ((double)lastPos.Y / (clientHeight - 1));
                    selectedColor.HSBUpdate();
                    break;
                case DrawStyle.Red:
                    selectedColor.RGBA.Blue = Round(255 * (double)lastPos.X / (clientWidth - 1));
                    selectedColor.RGBA.Green = Round(255 * (1.0 - ((double)lastPos.Y / (clientHeight - 1))));
                    selectedColor.RGBAUpdate();
                    break;
                case DrawStyle.Green:
                    selectedColor.RGBA.Blue = Round(255 * (double)lastPos.X / (clientWidth - 1));
                    selectedColor.RGBA.Red = Round(255 * (1.0 - ((double)lastPos.Y / (clientHeight - 1))));
                    selectedColor.RGBAUpdate();
                    break;
                case DrawStyle.Blue:
                    selectedColor.RGBA.Red = Round(255 * (double)lastPos.X / (clientWidth - 1));
                    selectedColor.RGBA.Green = Round(255 * (1.0 - ((double)lastPos.Y / (clientHeight - 1))));
                    selectedColor.RGBAUpdate();
                    break;
            }
        }

        protected void SetSliderMarker()
        {
            switch (DrawStyle)
            {
                case DrawStyle.Hue:
                    lastPos.Y = (clientHeight - 1) - Round((clientHeight - 1) * SelectedColor.HSB.Hue);
                    break;
                case DrawStyle.Saturation:
                    lastPos.Y = (clientHeight - 1) - Round((clientHeight - 1) * SelectedColor.HSB.Saturation);
                    break;
                case DrawStyle.Brightness:
                    lastPos.Y = (clientHeight - 1) - Round((clientHeight - 1) * SelectedColor.HSB.Brightness);
                    break;
                case DrawStyle.Red:
                    lastPos.Y = (clientHeight - 1) - Round((clientHeight - 1) * (double)SelectedColor.RGBA.Red / 255);
                    break;
                case DrawStyle.Green:
                    lastPos.Y = (clientHeight - 1) - Round((clientHeight - 1) * (double)SelectedColor.RGBA.Green / 255);
                    break;
                case DrawStyle.Blue:
                    lastPos.Y = (clientHeight - 1) - Round((clientHeight - 1) * (double)SelectedColor.RGBA.Blue / 255);
                    break;
            }
            lastPos = GetPoint(lastPos);
        }

        protected void GetSliderColor()
        {
            switch (DrawStyle)
            {
                case DrawStyle.Hue:
                    selectedColor.HSB.Hue = 1.0 - ((double)lastPos.Y / (clientHeight - 1));
                    selectedColor.HSBUpdate();
                    break;
                case DrawStyle.Saturation:
                    selectedColor.HSB.Saturation = 1.0 - ((double)lastPos.Y / (clientHeight - 1));
                    selectedColor.HSBUpdate();
                    break;
                case DrawStyle.Brightness:
                    selectedColor.HSB.Brightness = 1.0 - ((double)lastPos.Y / (clientHeight - 1));
                    selectedColor.HSBUpdate();
                    break;
                case DrawStyle.Red:
                    selectedColor.RGBA.Red = 255 - Round(255 * (double)lastPos.Y / (clientHeight - 1));
                    selectedColor.RGBAUpdate();
                    break;
                case DrawStyle.Green:
                    selectedColor.RGBA.Green = 255 - Round(255 * (double)lastPos.Y / (clientHeight - 1));
                    selectedColor.RGBAUpdate();
                    break;
                case DrawStyle.Blue:
                    selectedColor.RGBA.Blue = 255 - Round(255 * (double)lastPos.Y / (clientHeight - 1));
                    selectedColor.RGBAUpdate();
                    break;
            }
        }

        protected abstract void DrawCrosshair(Graphics g);

        protected abstract void DrawHue();

        protected abstract void DrawSaturation();

        protected abstract void DrawBrightness();

        protected abstract void DrawRed();

        protected abstract void DrawGreen();

        protected abstract void DrawBlue();

        #endregion Protected Methods

        #region Protected Helpers

        protected void GetPointColor(Point point)
        {
            lastPos = point;
            if (this is ColorBox)
            {
                GetBoxColor();
            }
            else
            {
                GetSliderColor();
            }
        }

        protected Point GetPoint(Point point)
        {
            return new Point(point.X.Clamp(0, clientWidth - 1), point.Y.Clamp(0, clientHeight - 1));
        }

        protected int Round(double val)
        {
            int ret_val = (int)val;

            int temp = (int)(val * 100);

            if ((temp % 100) >= 50)
                ret_val += 1;

            return ret_val;
        }

        #endregion Protected Helpers
    }
}
```

--------------------------------------------------------------------------------

---[FILE: GradientInfo.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Colors/GradientInfo.cs

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

using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Linq;

namespace ShareX.HelpersLib
{
    public class GradientInfo
    {
        [DefaultValue(LinearGradientMode.Vertical)]
        public LinearGradientMode Type { get; set; }

        public List<GradientStop> Colors { get; set; }

        [JsonIgnore]
        public bool IsValid => Colors != null && Colors.Count > 0;

        [JsonIgnore]
        public bool IsVisible => IsValid && Colors.Any(x => x.Color.A > 0);

        [JsonIgnore]
        public bool IsTransparent => IsValid && Colors.Any(x => x.Color.IsTransparent());

        public GradientInfo() : this(LinearGradientMode.Vertical)
        {
        }

        public GradientInfo(LinearGradientMode type)
        {
            Type = type;
            Colors = new List<GradientStop>();
        }

        public GradientInfo(LinearGradientMode type, params GradientStop[] colors) : this(type)
        {
            Colors = colors.ToList();
        }

        public GradientInfo(LinearGradientMode type, params Color[] colors) : this(type)
        {
            for (int i = 0; i < colors.Length; i++)
            {
                Colors.Add(new GradientStop(colors[i], (int)Math.Round(100f / (colors.Length - 1) * i)));
            }
        }

        public GradientInfo(params GradientStop[] colors) : this(LinearGradientMode.Vertical, colors)
        {
        }

        public GradientInfo(params Color[] colors) : this(LinearGradientMode.Vertical, colors)
        {
        }

        public void Clear()
        {
            Colors.Clear();
        }

        public void Sort()
        {
            Colors.Sort((x, y) => x.Location.CompareTo(y.Location));
        }

        public void Reverse()
        {
            Colors.Reverse();

            foreach (GradientStop color in Colors)
            {
                color.Location = 100 - color.Location;
            }
        }

        public ColorBlend GetColorBlend()
        {
            List<GradientStop> colors = new List<GradientStop>(Colors.OrderBy(x => x.Location));

            if (!colors.Any(x => x.Location == 0))
            {
                colors.Insert(0, new GradientStop(colors[0].Color, 0f));
            }

            if (!colors.Any(x => x.Location == 100))
            {
                colors.Add(new GradientStop(colors[colors.Count - 1].Color, 100f));
            }

            ColorBlend colorBlend = new ColorBlend();
            colorBlend.Colors = colors.Select(x => x.Color).ToArray();
            colorBlend.Positions = colors.Select(x => x.Location / 100).ToArray();
            return colorBlend;
        }

        public LinearGradientBrush GetGradientBrush(Rectangle rect)
        {
            LinearGradientBrush brush = new LinearGradientBrush(rect, Color.Transparent, Color.Transparent, Type);
            brush.InterpolationColors = GetColorBlend();
            return brush;
        }

        public void Draw(Graphics g, Rectangle rect)
        {
            if (IsValid)
            {
                try
                {
                    using (LinearGradientBrush brush = GetGradientBrush(new Rectangle(0, 0, rect.Width, rect.Height)))
                    {
                        g.FillRectangle(brush, rect);
                    }
                }
                catch
                {
                }
            }
        }

        public void Draw(Image img)
        {
            if (IsValid)
            {
                using (Graphics g = Graphics.FromImage(img))
                {
                    Draw(g, new Rectangle(0, 0, img.Width, img.Height));
                }
            }
        }

        public Bitmap CreateGradientPreview(int width, int height, bool border = false, bool checkers = false)
        {
            Bitmap bmp = new Bitmap(width, height);
            Rectangle rect = new Rectangle(0, 0, width, height);

            using (Graphics g = Graphics.FromImage(bmp))
            {
                if (checkers && IsTransparent)
                {
                    using (Image checker = ImageHelpers.CreateCheckerPattern())
                    using (Brush checkerBrush = new TextureBrush(checker, WrapMode.Tile))
                    {
                        g.FillRectangle(checkerBrush, rect);
                    }
                }

                Draw(g, rect);

                if (border)
                {
                    g.DrawRectangleProper(Pens.Black, rect);
                }
            }

            return bmp;
        }

        public override string ToString()
        {
            return "Gradient";
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: GradientStop.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Colors/GradientStop.cs

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

using System.ComponentModel;
using System.Drawing;
using System.Drawing.Design;

namespace ShareX.HelpersLib
{
    public class GradientStop
    {
        [DefaultValue(typeof(Color), "Black"), Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color Color { get; set; } = Color.Black;

        private float location;

        [DefaultValue(0f)]
        public float Location
        {
            get
            {
                return location;
            }
            set
            {
                location = value.Clamp(0f, 100f);
            }
        }

        public GradientStop()
        {
        }

        public GradientStop(Color color, float offset)
        {
            Color = color;
            Location = offset;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: HSB.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Colors/HSB.cs

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
using System.Drawing;

namespace ShareX.HelpersLib
{
    public struct HSB
    {
        private double hue;
        private double saturation;
        private double brightness;
        private int alpha;

        public double Hue
        {
            get
            {
                return hue;
            }
            set
            {
                hue = ColorHelpers.ValidColor(value);
            }
        }

        public double Hue360
        {
            get
            {
                return hue * 360;
            }
            set
            {
                hue = ColorHelpers.ValidColor(value / 360);
            }
        }

        public double Saturation
        {
            get
            {
                return saturation;
            }
            set
            {
                saturation = ColorHelpers.ValidColor(value);
            }
        }

        public double Saturation100
        {
            get
            {
                return saturation * 100;
            }
            set
            {
                saturation = ColorHelpers.ValidColor(value / 100);
            }
        }

        public double Brightness
        {
            get
            {
                return brightness;
            }
            set
            {
                brightness = ColorHelpers.ValidColor(value);
            }
        }

        public double Brightness100
        {
            get
            {
                return brightness * 100;
            }
            set
            {
                brightness = ColorHelpers.ValidColor(value / 100);
            }
        }

        public int Alpha
        {
            get
            {
                return alpha;
            }
            set
            {
                alpha = ColorHelpers.ValidColor(value);
            }
        }

        public HSB(double hue, double saturation, double brightness, int alpha = 255) : this()
        {
            Hue = hue;
            Saturation = saturation;
            Brightness = brightness;
            Alpha = alpha;
        }

        public HSB(int hue, int saturation, int brightness, int alpha = 255) : this()
        {
            Hue360 = hue;
            Saturation100 = saturation;
            Brightness100 = brightness;
            Alpha = alpha;
        }

        public HSB(Color color)
        {
            this = ColorHelpers.ColorToHSB(color);
        }

        public static implicit operator HSB(Color color)
        {
            return ColorHelpers.ColorToHSB(color);
        }

        public static implicit operator Color(HSB color)
        {
            return color.ToColor();
        }

        public static implicit operator RGBA(HSB color)
        {
            return color.ToColor();
        }

        public static implicit operator CMYK(HSB color)
        {
            return color.ToColor();
        }

        public static bool operator ==(HSB left, HSB right)
        {
            return (left.Hue == right.Hue) && (left.Saturation == right.Saturation) && (left.Brightness == right.Brightness);
        }

        public static bool operator !=(HSB left, HSB right)
        {
            return !(left == right);
        }

        public override string ToString()
        {
            return string.Format(Resources.HSB_ToString_, Hue360, Saturation100, Brightness100);
        }

        public Color ToColor()
        {
            return ColorHelpers.HSBToColor(this);
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        public override bool Equals(object obj)
        {
            return base.Equals(obj);
        }
    }
}
```

--------------------------------------------------------------------------------

````
