---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 536
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 536 of 650)

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

---[FILE: TextDrawingShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Drawing/TextDrawingShape.cs

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
using System.Drawing.Text;
using System.Windows.Forms;

namespace ShareX.ScreenCaptureLib
{
    public class TextDrawingShape : RectangleDrawingShape
    {
        public override ShapeType ShapeType { get; } = ShapeType.DrawingTextBackground;

        public string Text { get; set; }
        public TextDrawingOptions TextOptions { get; set; }
        public virtual bool SupportGradient { get; }

        public override void OnConfigLoad()
        {
            TextOptions = AnnotationOptions.TextOptions.Copy();
            BorderColor = AnnotationOptions.TextBorderColor;
            BorderSize = AnnotationOptions.TextBorderSize;
            FillColor = AnnotationOptions.TextFillColor;
            CornerRadius = AnnotationOptions.DrawingCornerRadius;
            Shadow = AnnotationOptions.Shadow;
            ShadowColor = AnnotationOptions.ShadowColor;
            ShadowOffset = AnnotationOptions.ShadowOffset;
        }

        public override void OnConfigSave()
        {
            AnnotationOptions.TextOptions = TextOptions;
            AnnotationOptions.TextBorderColor = BorderColor;
            AnnotationOptions.TextBorderSize = BorderSize;
            AnnotationOptions.TextFillColor = FillColor;
            AnnotationOptions.DrawingCornerRadius = CornerRadius;
            AnnotationOptions.Shadow = Shadow;
            AnnotationOptions.ShadowColor = ShadowColor;
            AnnotationOptions.ShadowOffset = ShadowOffset;
        }

        public override void OnDraw(Graphics g)
        {
            DrawRectangle(g);
            DrawText(g);
        }

        protected void DrawText(Graphics g)
        {
            if (Shadow)
            {
                DrawText(g, Text, ShadowColor, TextOptions, Rectangle.LocationOffset(ShadowOffset));
            }

            DrawText(g, Text, TextOptions, Rectangle);
        }

        protected void DrawText(Graphics g, string text, TextDrawingOptions options, RectangleF rect)
        {
            DrawText(g, text, options.Color, options, rect);
        }

        protected void DrawText(Graphics g, string text, Color textColor, TextDrawingOptions options, RectangleF rect)
        {
            if (!string.IsNullOrEmpty(text) && rect.Width > 10 && rect.Height > 10)
            {
                using (Font font = new Font(options.Font, options.Size, options.Style))
                using (Brush textBrush = new SolidBrush(textColor))
                using (StringFormat sf = new StringFormat { Alignment = options.AlignmentHorizontal, LineAlignment = options.AlignmentVertical })
                {
                    g.TextRenderingHint = TextRenderingHint.AntiAliasGridFit;
                    g.DrawString(text, font, textBrush, rect, sf);
                    g.TextRenderingHint = TextRenderingHint.SystemDefault;
                }
            }
        }

        public override void OnCreating()
        {
            PointF pos = Manager.Form.ScaledClientMousePosition;
            Rectangle = new RectangleF(pos.X, pos.Y, 1, 1);

            if (ShowTextInputBox())
            {
                OnCreated();
            }
            else
            {
                Remove();
            }
        }

        public override void OnCreated()
        {
            OnCreated(true);
        }

        protected void OnCreated(bool autoSize)
        {
            if (autoSize)
            {
                AutoSize(true);
            }

            base.OnCreated();
            ShowNodes();
        }

        public override void OnDoubleClicked()
        {
            ShowTextInputBox();
        }

        private bool ShowTextInputBox()
        {
            bool result;

            Manager.Form.Pause();

            using (TextDrawingInputBox inputBox = new TextDrawingInputBox(Text, TextOptions, SupportGradient, Manager.Options.ColorPickerOptions))
            {
                result = inputBox.ShowDialogTopMost(Manager.Form) == DialogResult.OK;
                Text = inputBox.InputText;
                OnConfigSave();
            }

            Manager.Form.Resume();

            return result;
        }

        public void AutoSize(bool center)
        {
            Size size;

            if (!string.IsNullOrEmpty(Text))
            {
                using (Font font = new Font(TextOptions.Font, TextOptions.Size, TextOptions.Style))
                {
                    size = Helpers.MeasureText(Text, font).Offset(15, 20);
                }
            }
            else
            {
                size = new Size(100, 60);
            }

            PointF location;

            if (center)
            {
                location = new PointF(Rectangle.X - (size.Width / 2), Rectangle.Y - (size.Height / 2));
            }
            else
            {
                location = Rectangle.Location;
            }

            Rectangle = new RectangleF(location, size);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: TextOutlineDrawingShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Drawing/TextOutlineDrawingShape.cs

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
using System.Drawing.Drawing2D;

namespace ShareX.ScreenCaptureLib
{
    public class TextOutlineDrawingShape : TextDrawingShape
    {
        public override ShapeType ShapeType { get; } = ShapeType.DrawingTextOutline;

        public override bool SupportGradient { get; } = true;

        public override void OnConfigLoad()
        {
            TextOptions = AnnotationOptions.TextOutlineOptions.Copy();
            BorderColor = AnnotationOptions.TextOutlineBorderColor;
            BorderSize = AnnotationOptions.TextOutlineBorderSize;
            Shadow = AnnotationOptions.Shadow;
            ShadowColor = AnnotationOptions.ShadowColor;
            ShadowOffset = AnnotationOptions.ShadowOffset;
        }

        public override void OnConfigSave()
        {
            AnnotationOptions.TextOutlineOptions = TextOptions;
            AnnotationOptions.TextOutlineBorderColor = BorderColor;
            AnnotationOptions.TextOutlineBorderSize = BorderSize;
            AnnotationOptions.Shadow = Shadow;
            AnnotationOptions.ShadowColor = ShadowColor;
            AnnotationOptions.ShadowOffset = ShadowOffset;
        }

        public override void OnDraw(Graphics g)
        {
            DrawTextWithOutline(g, Text, TextOptions, TextOptions.Color, BorderColor, BorderSize, Rectangle);
        }

        protected void DrawTextWithOutline(Graphics g, string text, TextDrawingOptions options, Color textColor, Color borderColor, int borderSize, RectangleF rect)
        {
            if (!string.IsNullOrEmpty(text) && rect.Width > 10 && rect.Height > 10)
            {
                using (GraphicsPath gp = new GraphicsPath())
                {
                    gp.FillMode = FillMode.Winding;

                    using (Font font = new Font(options.Font, options.Size, options.Style))
                    using (StringFormat sf = new StringFormat { Alignment = options.AlignmentHorizontal, LineAlignment = options.AlignmentVertical })
                    {
                        float emSize = g.DpiY * font.SizeInPoints / 72;
                        gp.AddString(text, font.FontFamily, (int)font.Style, emSize, rect, sf);
                    }

                    RectangleF pathRect = gp.GetBounds();

                    if (pathRect.IsEmpty) return;

                    g.SmoothingMode = SmoothingMode.HighQuality;

                    if (Shadow)
                    {
                        using (Matrix matrix = new Matrix())
                        {
                            matrix.Translate(ShadowOffset.X, ShadowOffset.Y);
                            gp.Transform(matrix);

                            if (IsBorderVisible)
                            {
                                using (Pen shadowPen = new Pen(ShadowColor, borderSize) { LineJoin = LineJoin.Round })
                                {
                                    g.DrawPath(shadowPen, gp);
                                }
                            }
                            else
                            {
                                using (Brush shadowBrush = new SolidBrush(ShadowColor))
                                {
                                    g.FillPath(shadowBrush, gp);
                                }
                            }

                            matrix.Reset();
                            matrix.Translate(-ShadowOffset.X, -ShadowOffset.Y);
                            gp.Transform(matrix);
                        }
                    }

                    if (IsBorderVisible)
                    {
                        using (Pen borderPen = new Pen(borderColor, borderSize) { LineJoin = LineJoin.Round })
                        {
                            g.DrawPath(borderPen, gp);
                        }
                    }

                    Brush textBrush = null;

                    try
                    {
                        if (TextOptions.Gradient)
                        {
                            textBrush = new LinearGradientBrush(pathRect.Round().Offset(1), textColor, TextOptions.Color2, TextOptions.GradientMode);
                        }
                        else
                        {
                            textBrush = new SolidBrush(textColor);
                        }

                        g.FillPath(textBrush, gp);
                    }
                    finally
                    {
                        if (textBrush != null)
                        {
                            textBrush.Dispose();
                        }
                    }

                    g.SmoothingMode = SmoothingMode.None;
                }
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: BaseEffectShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Effect/BaseEffectShape.cs

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
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Threading.Tasks;

namespace ShareX.ScreenCaptureLib
{
    public abstract class BaseEffectShape : BaseShape
    {
        public override ShapeCategory ShapeCategory { get; } = ShapeCategory.Effect;

        public abstract string OverlayText { get; }

        private bool drawCache, isEffectCaching, isCachePending, isDisposePending;
        private Bitmap cachedEffect;

        public abstract void ApplyEffect(Bitmap bmp);

        public override BaseShape Duplicate()
        {
            Bitmap cachedEffectTemp = cachedEffect;
            cachedEffect = null;
            BaseEffectShape shape = (BaseEffectShape)base.Duplicate();
            cachedEffect = cachedEffectTemp;
            return shape;
        }

        public override void OnUpdate()
        {
            base.OnUpdate();

            if (isCachePending)
            {
                CacheEffect();
            }
        }

        public virtual void OnDraw(Graphics g)
        {
            if (drawCache && isEffectCaching)
            {
                OnDrawOverlay(g, Resources.Processing);
            }
            else if (drawCache && cachedEffect != null)
            {
                g.CompositingMode = CompositingMode.SourceCopy;
                g.InterpolationMode = InterpolationMode.NearestNeighbor;

                g.DrawImage(cachedEffect, RectangleInsideCanvas);

                g.CompositingMode = CompositingMode.SourceOver;
                g.InterpolationMode = InterpolationMode.Bilinear;
            }
            else
            {
                OnDrawOverlay(g);
            }
        }

        public virtual void OnDrawOverlay(Graphics g)
        {
            OnDrawOverlay(g, OverlayText);
        }

        public void OnDrawOverlay(Graphics g, string overlayText)
        {
            using (Brush brush = new SolidBrush(Color.FromArgb(150, Color.Black)))
            {
                g.FillRectangle(brush, Rectangle);
            }

            g.DrawCornerLines(Rectangle.Offset(1), Pens.White, 25);

            using (Font font = new Font("Verdana", 12))
            {
                Size textSize = g.MeasureString(overlayText, font).ToSize();

                if (Rectangle.Width > textSize.Width && Rectangle.Height > textSize.Height)
                {
                    using (StringFormat sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center })
                    {
                        g.DrawString(overlayText, font, Brushes.White, Rectangle, sf);
                    }
                }
            }
        }

        public virtual void OnDrawFinal(Graphics g, Bitmap bmp)
        {
            Rectangle cropRect = System.Drawing.Rectangle.Intersect(new Rectangle(0, 0, bmp.Width, bmp.Height), Rectangle.Round());

            if (!cropRect.IsEmpty)
            {
                using (Bitmap croppedImage = ImageHelpers.CropBitmap(bmp, cropRect))
                {
                    ApplyEffect(croppedImage);

                    g.CompositingMode = CompositingMode.SourceCopy;

                    g.DrawImage(croppedImage, cropRect);

                    g.CompositingMode = CompositingMode.SourceOver;
                }
            }
        }

        public override void OnCreated()
        {
            base.OnCreated();
            CacheEffect();
        }

        public override void OnMoving()
        {
            StopDrawCache();
        }

        public override void OnMoved()
        {
            CacheEffect();
        }

        public override void OnResizing()
        {
            StopDrawCache();
        }

        public override void OnResized()
        {
            CacheEffect();
        }

        private void CacheEffect()
        {
            if (!isEffectCaching)
            {
                isCachePending = false;
                drawCache = true;

                ClearCache();

                if (IsInsideCanvas)
                {
                    isEffectCaching = true;

                    cachedEffect = Manager.CropImage(RectangleInsideCanvas);

                    Task.Run(() =>
                    {
                        ApplyEffect(cachedEffect);

                        isEffectCaching = false;

                        if (isDisposePending)
                        {
                            Dispose();
                        }
                    });
                }
            }
            else
            {
                isCachePending = true;
            }
        }

        private void StopDrawCache()
        {
            drawCache = false;
            isCachePending = false;
        }

        private void ClearCache()
        {
            if (!isEffectCaching && cachedEffect != null)
            {
                cachedEffect.Dispose();
                cachedEffect = null;
            }
        }

        public override void Dispose()
        {
            if (isEffectCaching)
            {
                isDisposePending = true;
            }
            else
            {
                ClearCache();
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: BlurEffectShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Effect/BlurEffectShape.cs

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
using System.Drawing;

namespace ShareX.ScreenCaptureLib
{
    public class BlurEffectShape : BaseEffectShape
    {
        public override ShapeType ShapeType { get; } = ShapeType.EffectBlur;

        public override string OverlayText => Resources.Blur + $" [{BlurRadius}]";

        public int BlurRadius { get; set; }

        public override void OnConfigLoad()
        {
            BlurRadius = AnnotationOptions.BlurRadius;
        }

        public override void OnConfigSave()
        {
            AnnotationOptions.BlurRadius = BlurRadius;
        }

        public override void ApplyEffect(Bitmap bmp)
        {
            ImageHelpers.BoxBlur(bmp, BlurRadius);
        }

        public override void OnDrawFinal(Graphics g, Bitmap bmp)
        {
            if (BlurRadius > 1)
            {
                base.OnDrawFinal(g, bmp);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: HighlightEffectShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Effect/HighlightEffectShape.cs

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
using System.Drawing;

namespace ShareX.ScreenCaptureLib
{
    public class HighlightEffectShape : BaseEffectShape
    {
        public override ShapeType ShapeType { get; } = ShapeType.EffectHighlight;

        public override string OverlayText => Resources.Highlight;

        public Color HighlightColor { get; set; }

        public override void OnConfigLoad()
        {
            HighlightColor = AnnotationOptions.HighlightColor;
        }

        public override void OnConfigSave()
        {
            AnnotationOptions.HighlightColor = HighlightColor;
        }

        public override void ApplyEffect(Bitmap bmp)
        {
            ImageHelpers.HighlightImage(bmp, HighlightColor);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: PixelateEffectShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Effect/PixelateEffectShape.cs

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
using System.Drawing;

namespace ShareX.ScreenCaptureLib
{
    public class PixelateEffectShape : BaseEffectShape
    {
        public override ShapeType ShapeType { get; } = ShapeType.EffectPixelate;

        public override string OverlayText => Resources.Pixelate + $" [{PixelSize}]";

        public int PixelSize { get; set; }

        public override void OnConfigLoad()
        {
            PixelSize = AnnotationOptions.PixelateSize;
        }

        public override void OnConfigSave()
        {
            AnnotationOptions.PixelateSize = PixelSize;
        }

        public override void ApplyEffect(Bitmap bmp)
        {
            ImageHelpers.Pixelate(bmp, PixelSize);
        }

        public override void OnDrawFinal(Graphics g, Bitmap bmp)
        {
            if (PixelSize > 1)
            {
                base.OnDrawFinal(g, bmp);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: BaseRegionShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Region/BaseRegionShape.cs

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

namespace ShareX.ScreenCaptureLib
{
    public abstract class BaseRegionShape : BaseShape
    {
        public override ShapeCategory ShapeCategory { get; } = ShapeCategory.Region;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: EllipseRegionShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Region/EllipseRegionShape.cs

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

namespace ShareX.ScreenCaptureLib
{
    public class EllipseRegionShape : BaseRegionShape
    {
        public override ShapeType ShapeType { get; } = ShapeType.RegionEllipse;

        public override void OnShapePathRequested(GraphicsPath gp, RectangleF rect)
        {
            gp.AddEllipse(rect);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: FreehandRegionShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Region/FreehandRegionShape.cs

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
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;

namespace ShareX.ScreenCaptureLib
{
    public class FreehandRegionShape : BaseRegionShape
    {
        public override ShapeType ShapeType { get; } = ShapeType.RegionFreehand;

        public PointF LastPosition
        {
            get
            {
                if (points.Count > 0)
                {
                    return points[points.Count - 1];
                }

                return PointF.Empty;
            }
            set
            {
                if (points.Count > 0)
                {
                    points[points.Count - 1] = value;
                }
            }
        }

        private List<PointF> points = new List<PointF>();
        private bool isPolygonMode;

        protected override void UseLightResizeNodes()
        {
            ChangeNodeShape(NodeShape.Circle);
        }

        public override void OnUpdate()
        {
            if (Manager.IsCreating)
            {
                if (Manager.IsCornerMoving)
                {
                    Move(Manager.Form.ScaledClientMouseVelocity);
                }
                else
                {
                    PointF pos = Manager.Form.ScaledClientMousePosition;

                    if (points.Count == 0 || (!Manager.IsProportionalResizing && LastPosition != pos))
                    {
                        points.Add(pos);
                    }

                    if (Manager.IsProportionalResizing)
                    {
                        if (!isPolygonMode)
                        {
                            points.Add(pos);
                        }

                        LastPosition = pos;
                    }

                    isPolygonMode = Manager.IsProportionalResizing;

                    Rectangle = points.CreateRectangle();
                }
            }
            else if (Manager.IsMoving)
            {
                Move(Manager.Form.ScaledClientMouseVelocity);
            }
        }

        public override void OnShapePathRequested(GraphicsPath gp, RectangleF rect)
        {
            if (points.Count > 2)
            {
                gp.AddPolygon(points.ToArray());
            }
            else if (points.Count == 2)
            {
                gp.AddLine(points[0], points[1]);
            }
        }

        public override void Move(float x, float y)
        {
            for (int i = 0; i < points.Count; i++)
            {
                points[i] = points[i].Add(x, y);
            }

            Rectangle = Rectangle.LocationOffset(x, y);
        }

        public override void Resize(int x, int y, bool fromBottomRight)
        {
            Move(x, y);
        }

        public override void OnNodeVisible()
        {
            Manager.ResizeNodes[(int)NodePosition.TopLeft].Visible = true;
        }

        public override void OnNodeUpdate()
        {
            if (Manager.ResizeNodes[(int)NodePosition.TopLeft].IsDragging)
            {
                Manager.IsCreating = true;
                Manager.NodesVisible = false;
            }
        }

        public override void OnNodePositionUpdate()
        {
            Manager.ResizeNodes[(int)NodePosition.TopLeft].Position = LastPosition;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: RectangleRegionShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Region/RectangleRegionShape.cs

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
using System.Drawing.Drawing2D;

namespace ShareX.ScreenCaptureLib
{
    public class RectangleRegionShape : BaseRegionShape
    {
        public override ShapeType ShapeType { get; } = ShapeType.RegionRectangle;

        public int CornerRadius { get; set; }

        public override void OnConfigLoad()
        {
            CornerRadius = AnnotationOptions.RegionCornerRadius;
        }

        public override void OnConfigSave()
        {
            AnnotationOptions.RegionCornerRadius = CornerRadius;
        }

        public override void OnShapePathRequested(GraphicsPath gp, RectangleF rect)
        {
            gp.AddRoundedRectangle(rect, CornerRadius);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: BaseTool.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Tool/BaseTool.cs

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

namespace ShareX.ScreenCaptureLib
{
    public abstract class BaseTool : BaseShape
    {
        public override ShapeCategory ShapeCategory { get; } = ShapeCategory.Tool;

        public virtual void OnDraw(Graphics g)
        {
        }
    }
}
```

--------------------------------------------------------------------------------

````
