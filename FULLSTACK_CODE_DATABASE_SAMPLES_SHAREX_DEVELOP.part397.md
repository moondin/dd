---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 397
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 397 of 650)

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

---[FILE: DrawTextEx.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Drawings/DrawTextEx.cs

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
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Design;
using System.Drawing.Drawing2D;

namespace ShareX.ImageEffectsLib
{
    [Description("Text")]
    public class DrawTextEx : ImageEffect
    {
        [DefaultValue("Text"), Editor(typeof(NameParserEditor), typeof(UITypeEditor))]
        public string Text { get; set; }

        [DefaultValue(ContentAlignment.TopLeft), TypeConverter(typeof(EnumProperNameConverter))]
        public ContentAlignment Placement { get; set; }

        [DefaultValue(typeof(Point), "0, 0")]
        public Point Offset { get; set; }

        [DefaultValue(0)]
        public int Angle { get; set; }

        [DefaultValue(false), Description("If text size bigger than source image then don't draw it.")]
        public bool AutoHide { get; set; }

        private FontSafe fontSafe = new FontSafe();

        // Workaround for "System.AccessViolationException: Attempted to read or write protected memory. This is often an indication that other memory is corrupt."
        [DefaultValue(typeof(Font), "Arial, 36pt")]
        public Font Font
        {
            get
            {
                return fontSafe.GetFont();
            }
            set
            {
                using (value)
                {
                    fontSafe.SetFont(value);
                }
            }
        }

        [DefaultValue(typeof(Color), "235, 235, 235"), Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color Color { get; set; }

        [DefaultValue(false)]
        public bool UseGradient { get; set; }

        [Editor(typeof(GradientEditor), typeof(UITypeEditor))]
        public GradientInfo Gradient { get; set; }

        [DefaultValue(false)]
        public bool Outline { get; set; }

        [DefaultValue(5)]
        public int OutlineSize { get; set; }

        [DefaultValue(typeof(Color), "235, 0, 0"), Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color OutlineColor { get; set; }

        [DefaultValue(false)]
        public bool OutlineUseGradient { get; set; }

        [Editor(typeof(GradientEditor), typeof(UITypeEditor))]
        public GradientInfo OutlineGradient { get; set; }

        [DefaultValue(false)]
        public bool Shadow { get; set; }

        [DefaultValue(typeof(Point), "0, 5")]
        public Point ShadowOffset { get; set; }

        [DefaultValue(typeof(Color), "125, 0, 0, 0"), Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color ShadowColor { get; set; }

        [DefaultValue(false)]
        public bool ShadowUseGradient { get; set; }

        [Editor(typeof(GradientEditor), typeof(UITypeEditor))]
        public GradientInfo ShadowGradient { get; set; }

        public DrawTextEx()
        {
            this.ApplyDefaultPropertyValues();
            Gradient = AddDefaultGradient();
            OutlineGradient = AddDefaultGradient();
            ShadowGradient = AddDefaultGradient();
        }

        private GradientInfo AddDefaultGradient()
        {
            GradientInfo gradientInfo = new GradientInfo();
            gradientInfo.Type = LinearGradientMode.Horizontal;

            switch (RandomFast.Next(0, 2))
            {
                case 0:
                    gradientInfo.Colors.Add(new GradientStop(Color.FromArgb(0, 187, 138), 0f));
                    gradientInfo.Colors.Add(new GradientStop(Color.FromArgb(0, 105, 163), 100f));
                    break;
                case 1:
                    gradientInfo.Colors.Add(new GradientStop(Color.FromArgb(255, 3, 135), 0f));
                    gradientInfo.Colors.Add(new GradientStop(Color.FromArgb(255, 143, 3), 100f));
                    break;
                case 2:
                    gradientInfo.Colors.Add(new GradientStop(Color.FromArgb(184, 11, 195), 0f));
                    gradientInfo.Colors.Add(new GradientStop(Color.FromArgb(98, 54, 255), 100f));
                    break;
            }

            return gradientInfo;
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            if (string.IsNullOrEmpty(Text))
            {
                return bmp;
            }

            using (Font font = Font)
            {
                if (font == null || font.Size < 1)
                {
                    return bmp;
                }

                NameParser parser = new NameParser(NameParserType.Text);
                parser.ImageWidth = bmp.Width;
                parser.ImageHeight = bmp.Height;

                string parsedText = parser.Parse(Text);

                using (Graphics g = Graphics.FromImage(bmp))
                using (GraphicsPath gp = new GraphicsPath())
                {
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.PixelOffsetMode = PixelOffsetMode.Half;

                    gp.FillMode = FillMode.Winding;
                    float emSize = g.DpiY * font.SizeInPoints / 72;
                    gp.AddString(parsedText, font.FontFamily, (int)font.Style, emSize, Point.Empty, StringFormat.GenericDefault);

                    if (Angle != 0)
                    {
                        using (Matrix matrix = new Matrix())
                        {
                            matrix.Rotate(Angle);
                            gp.Transform(matrix);
                        }
                    }

                    RectangleF pathRect = gp.GetBounds();

                    if (pathRect.IsEmpty)
                    {
                        return bmp;
                    }

                    Size textSize = pathRect.Size.ToSize().Offset(1);
                    Point textPosition = Helpers.GetPosition(Placement, Offset, bmp.Size, textSize);
                    Rectangle textRectangle = new Rectangle(textPosition, textSize);

                    if (AutoHide && !new Rectangle(0, 0, bmp.Width, bmp.Height).Contains(textRectangle))
                    {
                        return bmp;
                    }

                    using (Matrix matrix = new Matrix())
                    {
                        matrix.Translate(textRectangle.X - pathRect.X, textRectangle.Y - pathRect.Y);
                        gp.Transform(matrix);
                    }

                    // Draw text shadow
                    if (Shadow && ((!ShadowUseGradient && ShadowColor.A > 0) || (ShadowUseGradient && ShadowGradient.IsVisible)))
                    {
                        using (Matrix matrix = new Matrix())
                        {
                            matrix.Translate(ShadowOffset.X, ShadowOffset.Y);
                            gp.Transform(matrix);

                            if (Outline && OutlineSize > 0)
                            {
                                if (ShadowUseGradient)
                                {
                                    using (LinearGradientBrush textShadowBrush = ShadowGradient.GetGradientBrush(
                                        Rectangle.Round(textRectangle).Offset(OutlineSize + 1).LocationOffset(ShadowOffset)))
                                    using (Pen textShadowPen = new Pen(textShadowBrush, OutlineSize) { LineJoin = LineJoin.Round })
                                    {
                                        g.DrawPath(textShadowPen, gp);
                                    }
                                }
                                else
                                {
                                    using (Pen textShadowPen = new Pen(ShadowColor, OutlineSize) { LineJoin = LineJoin.Round })
                                    {
                                        g.DrawPath(textShadowPen, gp);
                                    }
                                }
                            }
                            else
                            {
                                if (ShadowUseGradient)
                                {
                                    using (Brush textShadowBrush = ShadowGradient.GetGradientBrush(
                                        Rectangle.Round(textRectangle).Offset(1).LocationOffset(ShadowOffset)))
                                    {
                                        g.FillPath(textShadowBrush, gp);
                                    }
                                }
                                else
                                {
                                    using (Brush textShadowBrush = new SolidBrush(ShadowColor))
                                    {
                                        g.FillPath(textShadowBrush, gp);
                                    }
                                }
                            }

                            matrix.Reset();
                            matrix.Translate(-ShadowOffset.X, -ShadowOffset.Y);
                            gp.Transform(matrix);
                        }
                    }

                    // Draw text outline
                    if (Outline && OutlineSize > 0)
                    {
                        if (OutlineUseGradient)
                        {
                            if (OutlineGradient.IsVisible)
                            {
                                using (LinearGradientBrush textOutlineBrush = OutlineGradient.GetGradientBrush(Rectangle.Round(textRectangle).Offset(OutlineSize + 1)))
                                using (Pen textOutlinePen = new Pen(textOutlineBrush, OutlineSize) { LineJoin = LineJoin.Round })
                                {
                                    g.DrawPath(textOutlinePen, gp);
                                }
                            }
                        }
                        else if (OutlineColor.A > 0)
                        {
                            using (Pen textOutlinePen = new Pen(OutlineColor, OutlineSize) { LineJoin = LineJoin.Round })
                            {
                                g.DrawPath(textOutlinePen, gp);
                            }
                        }
                    }

                    // Draw text
                    if (UseGradient)
                    {
                        if (Gradient.IsVisible)
                        {
                            using (Brush textBrush = Gradient.GetGradientBrush(Rectangle.Round(textRectangle).Offset(1)))
                            {
                                g.FillPath(textBrush, gp);
                            }
                        }
                    }
                    else if (Color.A > 0)
                    {
                        using (Brush textBrush = new SolidBrush(Color))
                        {
                            g.FillPath(textBrush, gp);
                        }
                    }
                }

                return bmp;
            }
        }

        protected override string GetSummary()
        {
            if (!string.IsNullOrEmpty(Text))
            {
                return Text.Truncate(20, "...");
            }

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Blur.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Filters/Blur.cs

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
using System.ComponentModel;
using System.Drawing;

namespace ShareX.ImageEffectsLib
{
    internal class Blur : ImageEffect
    {
        private int radius;

        [DefaultValue(15)]
        public int Radius
        {
            get
            {
                return radius;
            }
            set
            {
                radius = value.Max(3);

                if (radius.IsEvenNumber())
                {
                    radius++;
                }
            }
        }

        public Blur()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            ImageHelpers.BoxBlur(bmp, Radius);
            return bmp;
        }

        protected override string GetSummary()
        {
            return Radius.ToString();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ColorDepth.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Filters/ColorDepth.cs

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
using System.ComponentModel;
using System.Drawing;

namespace ShareX.ImageEffectsLib
{
    [Description("Color depth")]
    internal class ColorDepth : ImageEffect
    {
        private int bitsPerChannel;

        [DefaultValue(4)]
        public int BitsPerChannel
        {
            get
            {
                return bitsPerChannel;
            }
            set
            {
                bitsPerChannel = MathHelpers.Clamp(value, 1, 8);
            }
        }

        public ColorDepth()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            ImageHelpers.ColorDepth(bmp, BitsPerChannel);
            return bmp;
        }

        protected override string GetSummary()
        {
            string summary = BitsPerChannel + " bit";

            if (BitsPerChannel > 1)
            {
                summary += "s";
            }

            return summary;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: EdgeDetect.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Filters/EdgeDetect.cs

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
using System.ComponentModel;
using System.Drawing;

namespace ShareX.ImageEffectsLib
{
    [Description("Edge detect")]
    internal class EdgeDetect : ImageEffect
    {
        public override Bitmap Apply(Bitmap bmp)
        {
            using (bmp)
            {
                return ConvolutionMatrixManager.EdgeDetect().Apply(bmp);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Emboss.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Filters/Emboss.cs

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
using System.Drawing;

namespace ShareX.ImageEffectsLib
{
    internal class Emboss : ImageEffect
    {
        public override Bitmap Apply(Bitmap bmp)
        {
            using (bmp)
            {
                return ConvolutionMatrixManager.Emboss().Apply(bmp);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: GaussianBlur.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Filters/GaussianBlur.cs

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
using System;
using System.ComponentModel;
using System.Drawing;

namespace ShareX.ImageEffectsLib
{
    [Description("Gaussian blur")]
    internal class GaussianBlur : ImageEffect
    {
        private int radius;

        [DefaultValue(15)]
        public int Radius
        {
            get
            {
                return radius;
            }
            set
            {
                radius = Math.Max(value, 1);
            }
        }

        public GaussianBlur()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            using (bmp)
            {
                return ImageHelpers.GaussianBlur(bmp, Radius);
            }
        }

        protected override string GetSummary()
        {
            return Radius.ToString();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Glow.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Filters/Glow.cs

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
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Design;
using System.Drawing.Drawing2D;
using System.Linq;

namespace ShareX.ImageEffectsLib
{
    internal class Glow : ImageEffect
    {
        private int size;

        [DefaultValue(20)]
        public int Size
        {
            get
            {
                return size;
            }
            set
            {
                size = value.Max(0);
            }
        }

        private float strength;

        [DefaultValue(1f)]
        public float Strength
        {
            get
            {
                return strength;
            }
            set
            {
                strength = value.Max(0.1f);
            }
        }

        [DefaultValue(typeof(Color), "White"), Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color Color { get; set; }

        [DefaultValue(false)]
        public bool UseGradient { get; set; }

        [Editor(typeof(GradientEditor), typeof(UITypeEditor))]
        public GradientInfo Gradient { get; set; }

        [DefaultValue(typeof(Point), "0, 0")]
        public Point Offset { get; set; }

        public Glow()
        {
            this.ApplyDefaultPropertyValues();
            Gradient = AddDefaultGradient();
        }

        private GradientInfo AddDefaultGradient()
        {
            GradientInfo gradientInfo = new GradientInfo();
            gradientInfo.Type = LinearGradientMode.ForwardDiagonal;

            switch (RandomFast.Next(0, 2))
            {
                case 0:
                    gradientInfo.Colors.Add(new GradientStop(Color.FromArgb(0, 187, 138), 0f));
                    gradientInfo.Colors.Add(new GradientStop(Color.FromArgb(0, 105, 163), 100f));
                    break;
                case 1:
                    gradientInfo.Colors.Add(new GradientStop(Color.FromArgb(255, 3, 135), 0f));
                    gradientInfo.Colors.Add(new GradientStop(Color.FromArgb(255, 143, 3), 100f));
                    break;
                case 2:
                    gradientInfo.Colors.Add(new GradientStop(Color.FromArgb(184, 11, 195), 0f));
                    gradientInfo.Colors.Add(new GradientStop(Color.FromArgb(98, 54, 255), 100f));
                    break;
            }

            return gradientInfo;
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            return ImageHelpers.AddGlow(bmp, Size, Strength, Color, Offset, UseGradient ? Gradient : null);
        }

        protected override string GetSummary()
        {
            return Size.ToString();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: MatrixConvolution.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Filters/MatrixConvolution.cs

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
using System.ComponentModel;
using System.Drawing;

namespace ShareX.ImageEffectsLib
{
    [Description("Convolution matrix")]
    internal class MatrixConvolution : ImageEffect
    {
        [DefaultValue(0)]
        public int X0Y0 { get; set; }
        [DefaultValue(0)]
        public int X1Y0 { get; set; }
        [DefaultValue(0)]
        public int X2Y0 { get; set; }

        [DefaultValue(0)]
        public int X0Y1 { get; set; }
        [DefaultValue(1)]
        public int X1Y1 { get; set; }
        [DefaultValue(0)]
        public int X2Y1 { get; set; }

        [DefaultValue(0)]
        public int X0Y2 { get; set; }
        [DefaultValue(0)]
        public int X1Y2 { get; set; }
        [DefaultValue(0)]
        public int X2Y2 { get; set; }

        [DefaultValue(1.0)]
        public double Factor { get; set; }

        [DefaultValue((byte)0)]
        public byte Offset { get; set; }

        public MatrixConvolution()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            using (bmp)
            {
                ConvolutionMatrix cm = new ConvolutionMatrix();
                cm[0, 0] = X0Y0 / Factor;
                cm[0, 1] = X1Y0 / Factor;
                cm[0, 2] = X2Y0 / Factor;
                cm[1, 0] = X0Y1 / Factor;
                cm[1, 1] = X1Y1 / Factor;
                cm[1, 2] = X2Y1 / Factor;
                cm[2, 0] = X0Y2 / Factor;
                cm[2, 1] = X1Y2 / Factor;
                cm[2, 2] = X2Y2 / Factor;
                cm.Offset = Offset;
                return cm.Apply(bmp);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: MeanRemoval.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Filters/MeanRemoval.cs

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
using System.ComponentModel;
using System.Drawing;

namespace ShareX.ImageEffectsLib
{
    [Description("Mean removal")]
    internal class MeanRemoval : ImageEffect
    {
        public override Bitmap Apply(Bitmap bmp)
        {
            using (bmp)
            {
                return ConvolutionMatrixManager.MeanRemoval().Apply(bmp);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Outline.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Filters/Outline.cs

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
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Design;

namespace ShareX.ImageEffectsLib
{
    internal class Outline : ImageEffect
    {
        private int size;

        [DefaultValue(1)]
        public int Size
        {
            get
            {
                return size;
            }
            set
            {
                size = value.Max(1);
            }
        }

        private int padding;

        [DefaultValue(0)]
        public int Padding
        {
            get
            {
                return padding;
            }
            set
            {
                padding = value.Max(0);
            }
        }

        [DefaultValue(typeof(Color), "Black"), Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color Color { get; set; }

        [DefaultValue(false)]
        public bool OutlineOnly { get; set; }

        public Outline()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            return ImageHelpers.Outline(bmp, Size, Color, Padding, OutlineOnly);
        }

        protected override string GetSummary()
        {
            return Size.ToString();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Pixelate.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Filters/Pixelate.cs

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
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Design;

namespace ShareX.ImageEffectsLib
{
    internal class Pixelate : ImageEffect
    {
        private int size;

        [DefaultValue(10)]
        public int Size
        {
            get
            {
                return size;
            }
            set
            {
                size = value.Max(2);
            }
        }

        private int borderSize;

        [DefaultValue(0)]
        public int BorderSize
        {
            get
            {
                return borderSize;
            }
            set
            {
                borderSize = value.Max(0);
            }
        }

        [DefaultValue(typeof(Color), "Black"), Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color BorderColor { get; set; }

        public Pixelate()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            ImageHelpers.Pixelate(bmp, Size, BorderSize, BorderColor);
            return bmp;
        }

        protected override string GetSummary()
        {
            return Size.ToString();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Reflection.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Filters/Reflection.cs

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
using System.ComponentModel;
using System.Drawing;

namespace ShareX.ImageEffectsLib
{
    internal class Reflection : ImageEffect
    {
        private int percentage;

        [DefaultValue(20), Description("Reflection height size relative to screenshot height.\nValue need to be between 1 to 100.")]
        public int Percentage
        {
            get
            {
                return percentage;
            }
            set
            {
                percentage = value.Clamp(1, 100);
            }
        }

        private int maxAlpha;

        [DefaultValue(255), Description("Reflection transparency start from this value to MinAlpha.\nValue need to be between 0 to 255.")]
        public int MaxAlpha
        {
            get
            {
                return maxAlpha;
            }
            set
            {
                maxAlpha = value.Clamp(0, 255);
            }
        }

        private int minAlpha;

        [DefaultValue(0), Description("Reflection transparency start from MaxAlpha to this value.\nValue need to be between 0 to 255.")]
        public int MinAlpha
        {
            get
            {
                return minAlpha;
            }
            set
            {
                minAlpha = value.Clamp(0, 255);
            }
        }

        [DefaultValue(0), Description("Reflection start position will be: Screenshot height + Offset")]
        public int Offset { get; set; }

        [DefaultValue(false), Description("Adding skew to reflection from bottom left to bottom right.")]
        public bool Skew { get; set; }

        [DefaultValue(25), Description("How much pixel skew left to right.")]
        public int SkewSize { get; set; }

        public Reflection()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            return ImageHelpers.DrawReflection(bmp, Percentage, MaxAlpha, MinAlpha, Offset, Skew, SkewSize);
        }

        protected override string GetSummary()
        {
            return Percentage.ToString();
        }
    }
}
```

--------------------------------------------------------------------------------

````
