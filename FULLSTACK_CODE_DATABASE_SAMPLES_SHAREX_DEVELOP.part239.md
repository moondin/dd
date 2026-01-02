---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 239
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 239 of 650)

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

---[FILE: MyColor.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Colors/MyColor.cs

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

namespace ShareX.HelpersLib
{
    public struct MyColor
    {
        public RGBA RGBA;
        public HSB HSB;
        public CMYK CMYK;

        public bool IsTransparent
        {
            get
            {
                return RGBA.Alpha < 255;
            }
        }

        public MyColor(Color color)
        {
            RGBA = color;
            HSB = color;
            CMYK = color;
        }

        public static implicit operator MyColor(Color color)
        {
            return new MyColor(color);
        }

        public static implicit operator Color(MyColor color)
        {
            return color.RGBA;
        }

        public static bool operator ==(MyColor left, MyColor right)
        {
            return (left.RGBA == right.RGBA) && (left.HSB == right.HSB) && (left.CMYK == right.CMYK);
        }

        public static bool operator !=(MyColor left, MyColor right)
        {
            return !(left == right);
        }

        public void RGBAUpdate()
        {
            HSB = RGBA;
            CMYK = RGBA;
        }

        public void HSBUpdate()
        {
            RGBA = HSB;
            CMYK = HSB;
        }

        public void CMYKUpdate()
        {
            RGBA = CMYK;
            HSB = CMYK;
        }

        public override string ToString()
        {
            return string.Format(
@"RGBA (Red, Green, Blue, Alpha) = {0}, {1}, {2}, {3}
HSB (Hue, Saturation, Brightness) = {4:0.0}°, {5:0.0}%, {6:0.0}%
CMYK (Cyan, Magenta, Yellow, Key) = {7:0.0}%, {8:0.0}%, {9:0.0}%, {10:0.0}%
Hex (RGB, RGBA, ARGB) = #{11}, #{12}, #{13}
Decimal (RGB, RGBA, ARGB) = {14}, {15}, {16}",
                RGBA.Red, RGBA.Green, RGBA.Blue, RGBA.Alpha,
                HSB.Hue360, HSB.Saturation100, HSB.Brightness100,
                CMYK.Cyan100, CMYK.Magenta100, CMYK.Yellow100, CMYK.Key100,
                ColorHelpers.ColorToHex(this), ColorHelpers.ColorToHex(this, ColorFormat.RGBA), ColorHelpers.ColorToHex(this, ColorFormat.ARGB),
                ColorHelpers.ColorToDecimal(this), ColorHelpers.ColorToDecimal(this, ColorFormat.RGBA), ColorHelpers.ColorToDecimal(this, ColorFormat.ARGB));
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

---[FILE: RGBA.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Colors/RGBA.cs

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

namespace ShareX.HelpersLib
{
    public struct RGBA
    {
        private int red, green, blue, alpha;

        public int Red
        {
            get
            {
                return red;
            }
            set
            {
                red = ColorHelpers.ValidColor(value);
            }
        }

        public int Green
        {
            get
            {
                return green;
            }
            set
            {
                green = ColorHelpers.ValidColor(value);
            }
        }

        public int Blue
        {
            get
            {
                return blue;
            }
            set
            {
                blue = ColorHelpers.ValidColor(value);
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

        public RGBA(int red, int green, int blue, int alpha = 255) : this()
        {
            Red = red;
            Green = green;
            Blue = blue;
            Alpha = alpha;
        }

        public RGBA(Color color) : this(color.R, color.G, color.B, color.A)
        {
        }

        public static implicit operator RGBA(Color color)
        {
            return new RGBA(color);
        }

        public static implicit operator Color(RGBA color)
        {
            return color.ToColor();
        }

        public static implicit operator HSB(RGBA color)
        {
            return color.ToHSB();
        }

        public static implicit operator CMYK(RGBA color)
        {
            return color.ToCMYK();
        }

        public static bool operator ==(RGBA left, RGBA right)
        {
            return (left.Red == right.Red) && (left.Green == right.Green) && (left.Blue == right.Blue) && (left.Alpha == right.Alpha);
        }

        public static bool operator !=(RGBA left, RGBA right)
        {
            return !(left == right);
        }

        public override string ToString()
        {
            return $"R: {Red}, G: {Green}, B: {Blue}, A: {Alpha}";
        }

        public Color ToColor()
        {
            return Color.FromArgb(Alpha, Red, Green, Blue);
        }

        public string ToHex(ColorFormat format = ColorFormat.RGB)
        {
            return ColorHelpers.ColorToHex(this, format);
        }

        public int ToDecimal(ColorFormat format = ColorFormat.RGB)
        {
            return ColorHelpers.ColorToDecimal(this, format);
        }

        public HSB ToHSB()
        {
            return ColorHelpers.ColorToHSB(this);
        }

        public CMYK ToCMYK()
        {
            return ColorHelpers.ColorToCMYK(this);
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

---[FILE: Canvas.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/Canvas.cs

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
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public class Canvas : UserControl
    {
        public delegate void DrawEventHandler(Graphics g);

        public event DrawEventHandler Draw;

        public int Interval { get; set; }

        private Timer timer;
        private bool needPaint;

        public Canvas()
        {
            Interval = 100;
            SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);
        }

        public void Start()
        {
            if (timer == null || !timer.Enabled)
            {
                Stop();

                timer = new Timer();
                timer.Interval = Interval;
                timer.Tick += timer_Tick;
                timer.Start();
            }
        }

        public void Start(int interval)
        {
            Interval = interval;
            Start();
        }

        public void Stop()
        {
            if (timer != null)
            {
                timer.Stop();
                timer.Dispose();
            }
        }

        protected override void Dispose(bool disposing)
        {
            Stop();
            base.Dispose(disposing);
        }

        private void timer_Tick(object sender, EventArgs e)
        {
            needPaint = true;
            Invalidate();
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            if (needPaint)
            {
                OnDraw(e.Graphics);
                needPaint = false;
            }
        }

        protected void OnDraw(Graphics g)
        {
            Draw?.Invoke(g);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ColorButton.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/ColorButton.cs

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
using System.ComponentModel;
using System.Drawing;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    [DefaultEvent("ColorChanged")]
    public class ColorButton : Button
    {
        public delegate void ColorChangedEventHandler(Color color);
        public event ColorChangedEventHandler ColorChanged;

        private Color color;

        public Color Color
        {
            get
            {
                return color;
            }
            set
            {
                color = value;

                OnColorChanged(color);

                Invalidate();
            }
        }

        [DefaultValue(typeof(Color), "DarkGray")]
        public Color BorderColor { get; set; } = Color.DarkGray;

        [DefaultValue(3)]
        public int Offset { get; set; } = 3;

        [DefaultValue(false)]
        public bool HoverEffect { get; set; } = false;

        [DefaultValue(false)]
        public bool ManualButtonClick { get; set; }

        public ColorPickerOptions ColorPickerOptions { get; set; }

        private bool isMouseHover;

        protected void OnColorChanged(Color color)
        {
            ColorChanged?.Invoke(color);
        }

        protected override void OnMouseClick(MouseEventArgs mevent)
        {
            base.OnMouseClick(mevent);

            if (!ManualButtonClick)
            {
                ShowColorDialog();
            }
        }

        public void ShowColorDialog()
        {
            if (ColorPickerForm.PickColor(Color, out Color newColor, FindForm(), null, ColorPickerOptions))
            {
                Color = newColor;
            }
        }

        protected override void OnMouseEnter(EventArgs e)
        {
            isMouseHover = true;

            base.OnMouseEnter(e);
        }

        protected override void OnMouseLeave(EventArgs e)
        {
            isMouseHover = false;

            base.OnMouseLeave(e);
        }

        protected override void OnPaint(PaintEventArgs pevent)
        {
            base.OnPaint(pevent);

            int boxSize = ClientRectangle.Height - (Offset * 2);
            Rectangle boxRectangle = new Rectangle(ClientRectangle.Width - Offset - boxSize, Offset, boxSize, boxSize);

            Graphics g = pevent.Graphics;

            if (Color.IsTransparent())
            {
                using (Image checker = ImageHelpers.CreateCheckerPattern(boxSize, boxSize))
                {
                    g.DrawImage(checker, boxRectangle);
                }
            }

            if (Color.A > 0)
            {
                using (Brush brush = new SolidBrush(Color))
                {
                    g.FillRectangle(brush, boxRectangle);
                }
            }

            if (HoverEffect && isMouseHover)
            {
                using (Brush hoverBrush = new SolidBrush(Color.FromArgb(100, 255, 255, 255)))
                {
                    g.FillRectangle(hoverBrush, boxRectangle);
                }
            }

            using (Pen borderPen = new Pen(BorderColor))
            {
                g.DrawRectangleProper(borderPen, boxRectangle);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CustomVScrollBar.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/CustomVScrollBar.cs

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
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public class CustomVScrollBar : Control
    {
        public event EventHandler ValueChanged;

        private int minimum;

        public int Minimum
        {
            get
            {
                return minimum;
            }
            set
            {
                minimum = value;
                Invalidate();
            }
        }

        private int maximum;

        public int Maximum
        {
            get
            {
                return maximum;
            }
            set
            {
                maximum = value;
                Invalidate();
            }
        }

        private int currentValue;

        public int Value
        {
            get
            {
                return currentValue;
            }
            set
            {
                int newValue = Math.Max(Minimum, Math.Min(value, Maximum));

                if (currentValue != newValue)
                {
                    currentValue = newValue;
                    Invalidate();
                    ValueChanged?.Invoke(this, EventArgs.Empty);
                }
            }
        }

        private int pageSize;

        public int PageSize
        {
            get
            {
                return pageSize;
            }
            set
            {
                pageSize = value;
                Invalidate();
            }
        }

        public int SmallScrollStep { get; set; } = 20;
        public int LargeScrollStep { get; set; } = 100;

        private bool isDragging;
        private bool isThumbHovered;
        private int dragOffset = 0;

        public CustomVScrollBar()
        {
            SetStyle(ControlStyles.OptimizedDoubleBuffer | ControlStyles.AllPaintingInWmPaint | ControlStyles.ResizeRedraw | ControlStyles.UserPaint, true);
        }

        private Rectangle GetThumbRectangle()
        {
            int trackHeight = ClientRectangle.Height;
            int thumbHeight = (int)((float)trackHeight * PageSize / (Maximum + PageSize));
            thumbHeight = Math.Max(thumbHeight, 20);

            int movementRange = trackHeight - thumbHeight;
            int thumbTop = Maximum > 0 ? (int)((float)Value / Maximum * movementRange) : 0;

            return new Rectangle(0, thumbTop, ClientRectangle.Width, thumbHeight);
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);

            using (SolidBrush trackBrush = new SolidBrush(ShareXResources.Theme.DarkBackgroundColor))
            {
                e.Graphics.FillRectangle(trackBrush, ClientRectangle);
            }

            int effectivePageSize = Math.Max(PageSize, 1);
            int effectiveMaximum = Math.Max(Maximum, 0);
            int sum = Math.Max(effectiveMaximum + effectivePageSize, 1);

            int thumbHeight = (int)((float)ClientRectangle.Height * effectivePageSize / sum);
            thumbHeight = Math.Max(thumbHeight, 20);

            int movementRange = Math.Max(ClientRectangle.Height - thumbHeight, 0);

            int thumbTop = effectiveMaximum > 0 ? movementRange * Value / effectiveMaximum : 0;
            Rectangle thumbRect = new Rectangle(0, thumbTop, ClientRectangle.Width, thumbHeight);

            Color thumbColor = isThumbHovered ? ColorHelpers.LighterColor(ShareXResources.Theme.LightBackgroundColor, 0.1f) : ShareXResources.Theme.LightBackgroundColor;
            using (SolidBrush thumbBrush = new SolidBrush(thumbColor))
            {
                e.Graphics.FillRectangle(thumbBrush, thumbRect);
            }

            using (Pen borderPen = new Pen(ColorHelpers.DarkerColor(ShareXResources.Theme.DarkBackgroundColor, 0.03f)))
            {
                e.Graphics.DrawLine(borderPen, thumbRect.X, thumbRect.Y, thumbRect.Right - 1, thumbRect.Y);
                e.Graphics.DrawLine(borderPen, thumbRect.X, thumbRect.Bottom - 1, thumbRect.Right - 1, thumbRect.Bottom - 1);
                e.Graphics.DrawLine(borderPen, ClientRectangle.X, ClientRectangle.Y, 0, ClientRectangle.Height);
                e.Graphics.DrawLine(borderPen, ClientRectangle.Right - 1, ClientRectangle.Y, ClientRectangle.Right - 1, ClientRectangle.Bottom - 1);
            }
        }

        protected override void OnMouseDown(MouseEventArgs e)
        {
            int thumbHeight = (int)((float)ClientRectangle.Height * PageSize / (Maximum + PageSize));
            thumbHeight = Math.Max(thumbHeight, 20);
            int movementRange = ClientRectangle.Height - thumbHeight;
            int thumbTop = movementRange * Value / Maximum;
            Rectangle thumbRect = new Rectangle(0, thumbTop, ClientRectangle.Width, thumbHeight);

            if (thumbRect.Contains(e.Location))
            {
                isDragging = true;
                dragOffset = e.Y - thumbTop;
            }
            else
            {
                int clickPosition = e.Y;

                if (clickPosition < thumbTop)
                {
                    Value = Math.Max(Minimum, Value - PageSize);
                }
                else if (clickPosition > thumbTop + thumbHeight)
                {
                    Value = Math.Min(Maximum, Value + PageSize);
                }
            }
        }

        protected override void OnMouseMove(MouseEventArgs e)
        {
            if (isDragging)
            {
                Rectangle thumbRect = GetThumbRectangle();

                int movementRange = ClientRectangle.Height - thumbRect.Height;
                int newThumbTop = e.Y - dragOffset;
                newThumbTop = Math.Max(0, Math.Min(newThumbTop, movementRange));

                Value = Maximum > 0 ? newThumbTop * Maximum / movementRange : 0;
            }
            else
            {
                Rectangle thumbRect = GetThumbRectangle();
                bool hovered = thumbRect.Contains(e.Location);

                if (isThumbHovered != hovered)
                {
                    isThumbHovered = hovered;
                    Invalidate();
                }
            }
        }

        protected override void OnMouseUp(MouseEventArgs e)
        {
            isDragging = false;
        }

        protected override void OnMouseLeave(EventArgs e)
        {
            base.OnMouseLeave(e);

            if (isThumbHovered)
            {
                isThumbHovered = false;
                Invalidate();
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: DarkColorTable.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/DarkColorTable.cs

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
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public class DarkColorTable : ProfessionalColorTable
    {
        public override Color ButtonSelectedHighlight => ShareXResources.Theme.MenuHighlightColor;
        public override Color ButtonSelectedHighlightBorder => ShareXResources.Theme.MenuHighlightBorderColor;
        public override Color ButtonPressedHighlight => ShareXResources.Theme.MenuHighlightColor;
        public override Color ButtonPressedHighlightBorder => ShareXResources.Theme.MenuHighlightBorderColor;
        public override Color ButtonCheckedHighlight => ShareXResources.Theme.MenuCheckBackgroundColor;
        public override Color ButtonCheckedHighlightBorder => ShareXResources.Theme.MenuHighlightBorderColor;
        public override Color ButtonPressedBorder => ShareXResources.Theme.MenuHighlightBorderColor;
        public override Color ButtonSelectedBorder => ShareXResources.Theme.MenuHighlightBorderColor;
        public override Color ButtonCheckedGradientBegin => ShareXResources.Theme.MenuCheckBackgroundColor;
        public override Color ButtonCheckedGradientMiddle => ShareXResources.Theme.MenuCheckBackgroundColor;
        public override Color ButtonCheckedGradientEnd => ShareXResources.Theme.MenuCheckBackgroundColor;
        public override Color ButtonSelectedGradientBegin => ShareXResources.Theme.MenuHighlightColor;
        public override Color ButtonSelectedGradientMiddle => ShareXResources.Theme.MenuHighlightColor;
        public override Color ButtonSelectedGradientEnd => ShareXResources.Theme.MenuHighlightColor;
        public override Color ButtonPressedGradientBegin => ShareXResources.Theme.MenuHighlightColor;
        public override Color ButtonPressedGradientMiddle => ShareXResources.Theme.MenuHighlightColor;
        public override Color ButtonPressedGradientEnd => ShareXResources.Theme.MenuHighlightColor;
        public override Color CheckBackground => ShareXResources.Theme.MenuCheckBackgroundColor;
        public override Color CheckSelectedBackground => ShareXResources.Theme.MenuCheckBackgroundColor;
        public override Color CheckPressedBackground => ShareXResources.Theme.MenuCheckBackgroundColor;
        public override Color GripDark => ShareXResources.Theme.SeparatorDarkColor;
        public override Color GripLight => ShareXResources.Theme.SeparatorLightColor;
        public override Color ImageMarginGradientBegin => ShareXResources.Theme.BackgroundColor;
        public override Color ImageMarginGradientMiddle => ShareXResources.Theme.BackgroundColor;
        public override Color ImageMarginGradientEnd => ShareXResources.Theme.BackgroundColor;
        public override Color ImageMarginRevealedGradientBegin => ShareXResources.Theme.BackgroundColor;
        public override Color ImageMarginRevealedGradientMiddle => ShareXResources.Theme.BackgroundColor;
        public override Color ImageMarginRevealedGradientEnd => ShareXResources.Theme.BackgroundColor;
        public override Color MenuStripGradientBegin => ShareXResources.Theme.BackgroundColor;
        public override Color MenuStripGradientEnd => ShareXResources.Theme.BackgroundColor;
        public override Color MenuItemSelected => ShareXResources.Theme.MenuHighlightColor;
        public override Color MenuItemBorder => ShareXResources.Theme.MenuBorderColor;
        public override Color MenuBorder => ShareXResources.Theme.MenuBorderColor;
        public override Color MenuItemSelectedGradientBegin => ShareXResources.Theme.MenuHighlightColor;
        public override Color MenuItemSelectedGradientEnd => ShareXResources.Theme.MenuHighlightColor;
        public override Color MenuItemPressedGradientBegin => ShareXResources.Theme.MenuHighlightColor;
        public override Color MenuItemPressedGradientMiddle => ShareXResources.Theme.MenuHighlightColor;
        public override Color MenuItemPressedGradientEnd => ShareXResources.Theme.MenuHighlightColor;
        public override Color RaftingContainerGradientBegin => ShareXResources.Theme.BackgroundColor;
        public override Color RaftingContainerGradientEnd => ShareXResources.Theme.BackgroundColor;
        public override Color SeparatorDark => ShareXResources.Theme.SeparatorDarkColor;
        public override Color SeparatorLight => ShareXResources.Theme.SeparatorLightColor;
        public override Color StatusStripGradientBegin => ShareXResources.Theme.BackgroundColor;
        public override Color StatusStripGradientEnd => ShareXResources.Theme.BackgroundColor;
        public override Color ToolStripBorder => ShareXResources.Theme.BackgroundColor;
        public override Color ToolStripDropDownBackground => ShareXResources.Theme.BackgroundColor;
        public override Color ToolStripGradientBegin => ShareXResources.Theme.BackgroundColor;
        public override Color ToolStripGradientMiddle => ShareXResources.Theme.BackgroundColor;
        public override Color ToolStripGradientEnd => ShareXResources.Theme.BackgroundColor;
        public override Color ToolStripContentPanelGradientBegin => ShareXResources.Theme.BackgroundColor;
        public override Color ToolStripContentPanelGradientEnd => ShareXResources.Theme.BackgroundColor;
        public override Color ToolStripPanelGradientBegin => ShareXResources.Theme.BackgroundColor;
        public override Color ToolStripPanelGradientEnd => ShareXResources.Theme.BackgroundColor;
        public override Color OverflowButtonGradientBegin => ShareXResources.Theme.BackgroundColor;
        public override Color OverflowButtonGradientMiddle => ShareXResources.Theme.BackgroundColor;
        public override Color OverflowButtonGradientEnd => ShareXResources.Theme.BackgroundColor;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: DoubleLabeledNumericUpDown.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/DoubleLabeledNumericUpDown.cs

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
    public partial class DoubleLabeledNumericUpDown : UserControl
    {
        public new string Text
        {
            get
            {
                return lblText.Text;
            }
            set
            {
                lblText.Text = value;
            }
        }

        public string Text2
        {
            get
            {
                return lblText2.Text;
            }
            set
            {
                lblText2.Text = value;
            }
        }

        public decimal Value
        {
            get
            {
                return nudValue.Value;
            }
            set
            {
                nudValue.SetValue(value);
            }
        }

        public decimal Value2
        {
            get
            {
                return nudValue2.Value;
            }
            set
            {
                nudValue2.SetValue(value);
            }
        }

        public decimal Maximum
        {
            get
            {
                return nudValue.Maximum;
            }
            set
            {
                nudValue.Maximum = nudValue2.Maximum = value;
            }
        }

        public decimal Minimum
        {
            get
            {
                return nudValue.Minimum;
            }
            set
            {
                nudValue.Minimum = nudValue2.Minimum = value;
            }
        }

        public decimal Increment
        {
            get
            {
                return nudValue.Increment;
            }
            set
            {
                nudValue.Increment = nudValue2.Increment = value;
            }
        }

        public EventHandler ValueChanged;

        public DoubleLabeledNumericUpDown()
        {
            InitializeComponent();
            nudValue.ValueChanged += OnValueChanged;
            nudValue2.ValueChanged += OnValueChanged;
        }

        private void OnValueChanged(object sender, EventArgs e)
        {
            ValueChanged?.Invoke(sender, e);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: DoubleLabeledNumericUpDown.Designer.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/DoubleLabeledNumericUpDown.Designer.cs

```csharp
namespace ShareX.HelpersLib
{
    partial class DoubleLabeledNumericUpDown
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

        #region Component Designer generated code

        /// <summary> 
        /// Required method for Designer support - do not modify 
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.flpMain = new System.Windows.Forms.FlowLayoutPanel();
            this.lblText = new System.Windows.Forms.Label();
            this.nudValue = new System.Windows.Forms.NumericUpDown();
            this.lblText2 = new System.Windows.Forms.Label();
            this.nudValue2 = new System.Windows.Forms.NumericUpDown();
            this.flpMain.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudValue)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudValue2)).BeginInit();
            this.SuspendLayout();
            // 
            // flpMain
            // 
            this.flpMain.AutoSize = true;
            this.flpMain.AutoSizeMode = System.Windows.Forms.AutoSizeMode.GrowAndShrink;
            this.flpMain.Controls.Add(this.lblText);
            this.flpMain.Controls.Add(this.nudValue);
            this.flpMain.Controls.Add(this.lblText2);
            this.flpMain.Controls.Add(this.nudValue2);
            this.flpMain.Location = new System.Drawing.Point(0, 0);
            this.flpMain.Margin = new System.Windows.Forms.Padding(0);
            this.flpMain.Name = "flpMain";
            this.flpMain.Size = new System.Drawing.Size(191, 20);
            this.flpMain.TabIndex = 0;
            this.flpMain.WrapContents = false;
            // 
            // lblText
            // 
            this.lblText.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.lblText.AutoSize = true;
            this.lblText.Location = new System.Drawing.Point(0, 3);
            this.lblText.Margin = new System.Windows.Forms.Padding(0, 0, 3, 0);
            this.lblText.Name = "lblText";
            this.lblText.Size = new System.Drawing.Size(35, 13);
            this.lblText.TabIndex = 0;
            this.lblText.Text = "label1";
            // 
            // nudValue
            // 
            this.nudValue.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.nudValue.Location = new System.Drawing.Point(38, 0);
            this.nudValue.Margin = new System.Windows.Forms.Padding(0);
            this.nudValue.Name = "nudValue";
            this.nudValue.Size = new System.Drawing.Size(55, 20);
            this.nudValue.TabIndex = 1;
            this.nudValue.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            // 
            // lblText2
            // 
            this.lblText2.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.lblText2.AutoSize = true;
            this.lblText2.Location = new System.Drawing.Point(98, 3);
            this.lblText2.Margin = new System.Windows.Forms.Padding(5, 0, 3, 0);
            this.lblText2.Name = "lblText2";
            this.lblText2.Size = new System.Drawing.Size(35, 13);
            this.lblText2.TabIndex = 2;
            this.lblText2.Text = "label2";
            // 
            // nudValue2
            // 
            this.nudValue2.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.nudValue2.Location = new System.Drawing.Point(136, 0);
            this.nudValue2.Margin = new System.Windows.Forms.Padding(0);
            this.nudValue2.Name = "nudValue2";
            this.nudValue2.Size = new System.Drawing.Size(55, 20);
            this.nudValue2.TabIndex = 3;
            this.nudValue2.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            // 
            // DoubleLabeledNumericUpDown
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.Transparent;
            this.Controls.Add(this.flpMain);
            this.Name = "DoubleLabeledNumericUpDown";
            this.Size = new System.Drawing.Size(195, 23);
            this.flpMain.ResumeLayout(false);
            this.flpMain.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudValue)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudValue2)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.FlowLayoutPanel flpMain;
        private System.Windows.Forms.Label lblText;
        private System.Windows.Forms.NumericUpDown nudValue;
        private System.Windows.Forms.Label lblText2;
        private System.Windows.Forms.NumericUpDown nudValue2;
    }
}
```

--------------------------------------------------------------------------------

````
