---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 534
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 534 of 650)

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

---[FILE: StickerPackInfo.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/StickerPackInfo.cs

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

using System.IO;

namespace ShareX.ScreenCaptureLib
{
    public class StickerPackInfo
    {
        public string FolderPath { get; set; }
        public string Name { get; set; }

        public StickerPackInfo(string folderPath = "", string name = "")
        {
            FolderPath = folderPath;
            Name = name;
        }

        public override string ToString()
        {
            if (!string.IsNullOrEmpty(Name))
            {
                return Name;
            }

            if (!string.IsNullOrEmpty(FolderPath))
            {
                return Path.GetFileName(FolderPath);
            }

            return "";
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: TextDrawingOptions.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/TextDrawingOptions.cs

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
    public class TextDrawingOptions
    {
        public string Font { get; set; } = AnnotationOptions.DefaultFont;
        public int Size { get; set; } = 18;
        public Color Color { get; set; } = Color.White;
        public bool Bold { get; set; } = false;
        public bool Italic { get; set; } = false;
        public bool Underline { get; set; } = false;
        public StringAlignment AlignmentHorizontal { get; set; } = StringAlignment.Center;
        public StringAlignment AlignmentVertical { get; set; } = StringAlignment.Center;

        public FontStyle Style
        {
            get
            {
                FontStyle style = FontStyle.Regular;

                if (Bold)
                {
                    style |= FontStyle.Bold;
                }

                if (Italic)
                {
                    style |= FontStyle.Italic;
                }

                if (Underline)
                {
                    style |= FontStyle.Underline;
                }

                return style;
            }
        }

        public bool Gradient { get; set; } = false;
        public Color Color2 { get; set; } = Color.FromArgb(240, 240, 240);
        public LinearGradientMode GradientMode { get; set; } = LinearGradientMode.Vertical;
        public bool EnterKeyNewLine { get; set; } = false;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ArrowDrawingShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Drawing/ArrowDrawingShape.cs

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
    public class ArrowDrawingShape : LineDrawingShape
    {
        public override ShapeType ShapeType { get; } = ShapeType.DrawingArrow;

        public ArrowHeadDirection ArrowHeadDirection { get; set; }

        public override void OnConfigLoad()
        {
            base.OnConfigLoad();
            ArrowHeadDirection = AnnotationOptions.ArrowHeadDirection;
        }

        public override void OnConfigSave()
        {
            base.OnConfigSave();
            AnnotationOptions.ArrowHeadDirection = ArrowHeadDirection;
        }

        protected override Pen CreatePen(Color borderColor, int borderSize, BorderStyle borderStyle)
        {
            using (GraphicsPath gp = new GraphicsPath())
            {
                int arrowWidth = 2, arrowHeight = 6, arrowCurve = 1;
                gp.AddLine(new Point(0, 0), new Point(-arrowWidth, -arrowHeight));
                gp.AddCurve(new Point[] { new Point(-arrowWidth, -arrowHeight), new Point(0, -arrowHeight + arrowCurve), new Point(arrowWidth, -arrowHeight) });
                gp.CloseFigure();

                CustomLineCap lineCap = new CustomLineCap(gp, null)
                {
                    BaseInset = arrowHeight - arrowCurve
                };

                Pen pen = new Pen(borderColor, borderSize);

                if (ArrowHeadDirection == ArrowHeadDirection.Both && MathHelpers.Distance(Points[0], Points[Points.Length - 1]) > arrowHeight * borderSize * 2)
                {
                    pen.CustomEndCap = pen.CustomStartCap = lineCap;
                }
                else if (ArrowHeadDirection == ArrowHeadDirection.Start)
                {
                    pen.CustomStartCap = lineCap;
                }
                else
                {
                    pen.CustomEndCap = lineCap;
                }

                pen.LineJoin = LineJoin.Round;
                pen.DashStyle = (DashStyle)borderStyle;
                return pen;
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: BaseDrawingShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Drawing/BaseDrawingShape.cs

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
    public abstract class BaseDrawingShape : BaseShape
    {
        public override ShapeCategory ShapeCategory { get; } = ShapeCategory.Drawing;

        public Color BorderColor { get; set; }
        public int BorderSize { get; set; }
        public BorderStyle BorderStyle { get; set; }
        public Color FillColor { get; set; }

        public bool Shadow { get; set; }
        public Color ShadowColor { get; set; }
        public Point ShadowOffset { get; set; }

        public bool IsShapeVisible => IsBorderVisible || IsFillVisible;
        public bool IsBorderVisible => BorderSize > 0 && BorderColor.A > 0;
        public bool IsFillVisible => FillColor.A > 0;

        public override void OnConfigLoad()
        {
            BorderColor = AnnotationOptions.BorderColor;
            BorderSize = AnnotationOptions.BorderSize;
            BorderStyle = AnnotationOptions.BorderStyle;
            FillColor = AnnotationOptions.FillColor;
            Shadow = AnnotationOptions.Shadow;
            ShadowColor = AnnotationOptions.ShadowColor;
            ShadowOffset = AnnotationOptions.ShadowOffset;
        }

        public override void OnConfigSave()
        {
            AnnotationOptions.BorderColor = BorderColor;
            AnnotationOptions.BorderSize = BorderSize;
            AnnotationOptions.BorderStyle = BorderStyle;
            AnnotationOptions.FillColor = FillColor;
            AnnotationOptions.Shadow = Shadow;
            AnnotationOptions.ShadowColor = ShadowColor;
            AnnotationOptions.ShadowOffset = ShadowOffset;
        }

        public abstract void OnDraw(Graphics g);
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CursorDrawingShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Drawing/CursorDrawingShape.cs

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
using System.Drawing;

namespace ShareX.ScreenCaptureLib
{
    public class CursorDrawingShape : ImageDrawingShape
    {
        public override ShapeType ShapeType { get; } = ShapeType.DrawingCursor;

        public void UpdateCursor(IntPtr cursorHandle, Point position)
        {
            Icon icon = Icon.FromHandle(cursorHandle);
            Bitmap bmpCursor = icon.ToBitmap();
            UpdateCursor(bmpCursor, position);
        }

        public void UpdateCursor(Bitmap bmpCursor, Point position)
        {
            Dispose();
            Image = bmpCursor;
            Rectangle = new Rectangle(position, Image.Size);
        }

        public override void ShowNodes()
        {
        }

        public override void OnCreating()
        {
            Manager.IsMoving = true;
            UpdateCursor(Manager.GetSelectedCursor().Handle, Manager.Form.ScaledClientMousePosition.Round());
            OnCreated();
        }

        public override void OnDraw(Graphics g)
        {
            if (Image != null)
            {
                g.DrawImage(Image, Rectangle);

                if (!Manager.IsRenderingOutput && Manager.CurrentTool == ShapeType.DrawingCursor)
                {
                    Manager.DrawRegionArea(g, Rectangle.Round(), false);
                }
            }
        }

        public override void Resize(int x, int y, bool fromBottomRight)
        {
            Move(x, y);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: EllipseDrawingShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Drawing/EllipseDrawingShape.cs

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
    public class EllipseDrawingShape : BaseDrawingShape
    {
        public override ShapeType ShapeType { get; } = ShapeType.DrawingEllipse;

        public override void OnDraw(Graphics g)
        {
            DrawEllipse(g);
        }

        protected void DrawEllipse(Graphics g)
        {
            if (Shadow)
            {
                if (IsBorderVisible)
                {
                    DrawEllipse(g, ShadowColor, BorderSize, BorderStyle, Color.Transparent, Rectangle.LocationOffset(ShadowOffset));
                }
                else if (FillColor.A == 255)
                {
                    DrawEllipse(g, Color.Transparent, 0, BorderStyle, ShadowColor, Rectangle.LocationOffset(ShadowOffset));
                }
            }

            DrawEllipse(g, BorderColor, BorderSize, BorderStyle, FillColor, Rectangle);
        }

        protected void DrawEllipse(Graphics g, Color borderColor, int borderSize, BorderStyle borderStyle, Color fillColor, RectangleF rect)
        {
            g.SmoothingMode = SmoothingMode.HighQuality;

            if (fillColor.A > 0)
            {
                using (Brush brush = new SolidBrush(fillColor))
                {
                    g.FillEllipse(brush, rect);
                }
            }

            if (borderSize > 0 && borderColor.A > 0)
            {
                using (Pen pen = new Pen(borderColor, borderSize))
                {
                    pen.DashStyle = (DashStyle)borderStyle;

                    g.DrawEllipse(pen, rect);
                }
            }

            g.SmoothingMode = SmoothingMode.None;
        }

        public override void OnShapePathRequested(GraphicsPath gp, RectangleF rect)
        {
            gp.AddEllipse(rect);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: FreehandArrowDrawingShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Drawing/FreehandArrowDrawingShape.cs

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
    public class FreehandArrowDrawingShape : FreehandDrawingShape
    {
        public override ShapeType ShapeType { get; } = ShapeType.DrawingFreehandArrow;

        public ArrowHeadDirection ArrowHeadDirection { get; set; }

        public override void OnConfigLoad()
        {
            base.OnConfigLoad();
            ArrowHeadDirection = AnnotationOptions.ArrowHeadDirection;
        }

        public override void OnConfigSave()
        {
            base.OnConfigSave();
            AnnotationOptions.ArrowHeadDirection = ArrowHeadDirection;
        }

        protected override Pen CreatePen(Color borderColor, int borderSize, BorderStyle borderStyle)
        {
            using (GraphicsPath gp = new GraphicsPath())
            {
                int arrowWidth = 2, arrowHeight = 6, arrowCurve = 1;
                gp.AddLine(new Point(0, 0), new Point(-arrowWidth, -arrowHeight));
                gp.AddCurve(new Point[] { new Point(-arrowWidth, -arrowHeight), new Point(0, -arrowHeight + arrowCurve), new Point(arrowWidth, -arrowHeight) });
                gp.CloseFigure();

                CustomLineCap lineCap = new CustomLineCap(gp, null)
                {
                    BaseInset = arrowHeight - arrowCurve
                };

                Pen pen = new Pen(borderColor, borderSize);

                if (ArrowHeadDirection == ArrowHeadDirection.Both && MathHelpers.Distance(positions[0], positions[positions.Count - 1]) > arrowHeight * borderSize * 2)
                {
                    pen.CustomEndCap = pen.CustomStartCap = lineCap;
                }
                else if (ArrowHeadDirection == ArrowHeadDirection.Start)
                {
                    pen.CustomStartCap = lineCap;
                }
                else
                {
                    pen.CustomEndCap = lineCap;
                }

                pen.LineJoin = LineJoin.Round;
                pen.DashStyle = (DashStyle)borderStyle;
                return pen;
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: FreehandDrawingShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Drawing/FreehandDrawingShape.cs

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
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Linq;

namespace ShareX.ScreenCaptureLib
{
    public class FreehandDrawingShape : BaseDrawingShape
    {
        public override ShapeType ShapeType { get; } = ShapeType.DrawingFreehand;

        public override bool IsValidShape => positions.Count > 0;

        public override bool IsSelectable => Manager.CurrentTool == ShapeType.ToolSelect;

        public PointF LastPosition
        {
            get
            {
                if (positions.Count > 0)
                {
                    return positions[positions.Count - 1];
                }

                return Point.Empty;
            }
            set
            {
                if (positions.Count > 0)
                {
                    positions[positions.Count - 1] = value;
                }
            }
        }

        protected List<PointF> positions = new List<PointF>();
        private bool isPolygonMode;

        public override void ShowNodes()
        {
        }

        public override void OnUpdate()
        {
            if (Manager.IsCreating)
            {
                if (Manager.IsCornerMoving && !Manager.IsPanning)
                {
                    Move(Manager.Form.ScaledClientMouseVelocity);
                }
                else
                {
                    PointF pos = Manager.Form.ScaledClientMousePosition;

                    if (positions.Count == 0 || (!Manager.IsProportionalResizing && LastPosition != pos))
                    {
                        positions.Add(pos);
                    }

                    if (Manager.IsProportionalResizing)
                    {
                        if (!isPolygonMode)
                        {
                            positions.Add(pos);
                        }

                        LastPosition = pos;
                    }

                    isPolygonMode = Manager.IsProportionalResizing;

                    Rectangle = positions.CreateRectangle();
                }
            }
            else if (Manager.IsMoving)
            {
                Move(Manager.Form.ScaledClientMouseVelocity);
            }
        }

        public override void OnDraw(Graphics g)
        {
            DrawFreehand(g);
        }

        protected void DrawFreehand(Graphics g)
        {
            int borderSize = Math.Max(BorderSize, 1);

            if (Shadow)
            {
                DrawFreehand(g, ShadowColor, borderSize, BorderStyle, positions.Select(x => x.Add(ShadowOffset)).ToArray());
            }

            DrawFreehand(g, BorderColor, borderSize, BorderStyle, positions.ToArray());
        }

        protected void DrawFreehand(Graphics g, Color borderColor, int borderSize, BorderStyle borderStyle, PointF[] points)
        {
            if (points.Length > 0 && borderSize > 0 && borderColor.A > 0)
            {
                if (Manager.IsRenderingOutput)
                {
                    g.SmoothingMode = SmoothingMode.HighQuality;
                }
                else
                {
                    g.SmoothingMode = SmoothingMode.HighSpeed;
                }

                if (points.Length == 1)
                {
                    using (Brush brush = new SolidBrush(borderColor))
                    {
                        Rectangle rect = new Rectangle((int)(points[0].X - (borderSize / 2f)), (int)(points[0].Y - (borderSize / 2f)), borderSize, borderSize);
                        g.FillEllipse(brush, rect);
                    }
                }
                else
                {
                    using (Pen pen = CreatePen(borderColor, borderSize, borderStyle))
                    {
                        g.DrawLines(pen, points.ToArray());
                    }
                }

                g.SmoothingMode = SmoothingMode.None;
            }
        }

        protected virtual Pen CreatePen(Color borderColor, int borderSize, BorderStyle borderStyle)
        {
            Pen pen = new Pen(borderColor, borderSize);
            pen.StartCap = LineCap.Round;
            pen.EndCap = LineCap.Round;
            pen.LineJoin = LineJoin.Round;
            pen.DashStyle = (DashStyle)borderStyle;
            return pen;
        }

        public override void Move(float x, float y)
        {
            for (int i = 0; i < positions.Count; i++)
            {
                positions[i] = positions[i].Add(x, y);
            }

            Rectangle = Rectangle.LocationOffset(x, y);
        }

        public override void Resize(int x, int y, bool fromBottomRight)
        {
            Move(x, y);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ImageDrawingShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Drawing/ImageDrawingShape.cs

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
    public class ImageDrawingShape : BaseDrawingShape
    {
        public override ShapeType ShapeType { get; } = ShapeType.DrawingImage;

        public Image Image { get; protected set; }
        public ImageInterpolationMode ImageInterpolationMode { get; protected set; }

        public override BaseShape Duplicate()
        {
            Image imageTemp = Image;
            Image = null;
            ImageDrawingShape shape = (ImageDrawingShape)base.Duplicate();
            shape.Image = imageTemp.CloneSafe();
            Image = imageTemp;
            return shape;
        }

        public override void OnConfigLoad()
        {
            ImageInterpolationMode = AnnotationOptions.ImageInterpolationMode;
        }

        public override void OnConfigSave()
        {
            AnnotationOptions.ImageInterpolationMode = ImageInterpolationMode;
        }

        public void SetImage(Image img, bool centerImage)
        {
            Dispose();

            Image = img;

            if (Image != null)
            {
                PointF location;
                Size size = Image.Size;

                if (centerImage)
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

        public override void OnDraw(Graphics g)
        {
            DrawImage(g);
        }

        protected void DrawImage(Graphics g)
        {
            if (Image != null)
            {
                g.PixelOffsetMode = PixelOffsetMode.Half;
                g.InterpolationMode = ImageHelpers.GetInterpolationMode(ImageInterpolationMode);

                g.DrawImage(Image, Rectangle);

                g.PixelOffsetMode = PixelOffsetMode.Default;
                g.InterpolationMode = InterpolationMode.Bilinear;
            }
        }

        public override void OnMoved()
        {
            /*if (Manager.Form.IsEditorMode)
            {
                Manager.AutoResizeCanvas();
            }*/
        }

        public override void Dispose()
        {
            if (Image != null)
            {
                Image.Dispose();
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ImageFileDrawingShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Drawing/ImageFileDrawingShape.cs

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

namespace ShareX.ScreenCaptureLib
{
    public class ImageFileDrawingShape : ImageDrawingShape
    {
        public override void OnCreating()
        {
            PointF pos = Manager.Form.ScaledClientMousePosition;
            Rectangle = new RectangleF(pos.X, pos.Y, 1, 1);

            if (Manager.IsCtrlModifier && LoadImageFile(AnnotationOptions.LastImageFilePath, true))
            {
                OnCreated();
                Manager.IsMoving = true;
            }
            else if (OpenImageDialog(true))
            {
                OnCreated();
                ShowNodes();
            }
            else
            {
                Remove();
            }
        }

        public override void OnDoubleClicked()
        {
            OpenImageDialog(false);
        }

        private bool OpenImageDialog(bool centerImage)
        {
            Manager.IsMoving = false;
            Manager.Form.Pause();
            string filePath = ImageHelpers.OpenImageFileDialog(Manager.Form);
            Manager.Form.Resume();
            return LoadImageFile(filePath, centerImage);
        }

        private bool LoadImageFile(string filePath, bool centerImage)
        {
            if (!string.IsNullOrEmpty(filePath))
            {
                Bitmap bmp = ImageHelpers.LoadImage(filePath);

                if (bmp != null)
                {
                    AnnotationOptions.LastImageFilePath = filePath;

                    SetImage(bmp, centerImage);

                    return true;
                }
            }

            return false;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ImageScreenDrawingShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Drawing/ImageScreenDrawingShape.cs

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
    public class ImageScreenDrawingShape : ImageDrawingShape
    {
        public override ShapeType ShapeType { get; } = ShapeType.DrawingImageScreen;

        public override void OnCreated()
        {
            if (IsValidShape)
            {
                Rectangle = RectangleInsideCanvas;
                Image = Manager.CropImage(Rectangle);
            }

            if (Image == null)
            {
                Remove();
            }
            else
            {
                base.OnCreated();
            }
        }

        public override void OnDraw(Graphics g)
        {
            if (Image == null)
            {
                if (IsValidShape)
                {
                    Manager.DrawRegionArea(g, RectangleInsideCanvas, true);
                }
            }
            else
            {
                base.OnDraw(g);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

````
