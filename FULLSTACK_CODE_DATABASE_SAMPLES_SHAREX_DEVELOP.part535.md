---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 535
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 535 of 650)

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

---[FILE: LineDrawingShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Drawing/LineDrawingShape.cs

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
using System.Drawing.Drawing2D;

namespace ShareX.ScreenCaptureLib
{
    public class LineDrawingShape : BaseDrawingShape
    {
        public const int MaximumCenterPointCount = 5;
        private const int MinimumCollisionSize = 10;

        public override ShapeType ShapeType { get; } = ShapeType.DrawingLine;

        public PointF[] Points { get; private set; } = new PointF[2];
        public bool CenterNodeActive { get; private set; }
        public int CenterPointCount { get; private set; }

        public override bool IsValidShape => Rectangle.Width >= Options.MinimumSize || Rectangle.Height >= Options.MinimumSize;

        protected override void UseLightResizeNodes()
        {
            ChangeNodeShape(NodeShape.Circle);
        }

        private void AdjustPoints(int centerPointCount)
        {
            PointF[] newPoints = new PointF[2 + centerPointCount];

            if (Points != null)
            {
                newPoints[0] = Points[0];
                newPoints[newPoints.Length - 1] = Points[Points.Length - 1];
            }

            Points = newPoints;
        }

        private void AutoPositionCenterPoints()
        {
            if (!CenterNodeActive)
            {
                for (int i = 1; i < Points.Length - 1; i++)
                {
                    Points[i] = new PointF(MathHelpers.Lerp(Points[0].X, Points[Points.Length - 1].X, i / (CenterPointCount + 1f)),
                        MathHelpers.Lerp(Points[0].Y, Points[Points.Length - 1].Y, i / (CenterPointCount + 1f)));
                }
            }
        }

        public override void OnConfigLoad()
        {
            base.OnConfigLoad();

            int previousCenterPointCount = CenterPointCount;
            CenterPointCount = AnnotationOptions.LineCenterPointCount.Clamp(0, MaximumCenterPointCount);

            if (CenterPointCount != previousCenterPointCount)
            {
                AdjustPoints(CenterPointCount);
                CenterNodeActive = false;
                AutoPositionCenterPoints();
            }

            if (Manager.NodesVisible)
            {
                OnNodeVisible();
            }
        }

        public override void OnConfigSave()
        {
            base.OnConfigSave();
            AnnotationOptions.LineCenterPointCount = CenterPointCount;
        }

        public override void OnUpdate()
        {
            base.OnUpdate();

            if (Manager.IsCreating)
            {
                Points[0] = StartPosition;
                Points[Points.Length - 1] = EndPosition;
            }
            else
            {
                AutoPositionCenterPoints();
                CalculateRectangle();
            }
        }

        private void CalculateRectangle()
        {
            Rectangle = Points.CreateRectangle();

            if (Rectangle.Width < MinimumCollisionSize)
            {
                Rectangle = new RectangleF(Rectangle.X - (MinimumCollisionSize / 2), Rectangle.Y, Rectangle.Width + MinimumCollisionSize, Rectangle.Height);
            }

            if (Rectangle.Height < MinimumCollisionSize)
            {
                Rectangle = new RectangleF(Rectangle.X, Rectangle.Y - (MinimumCollisionSize / 2), Rectangle.Width, Rectangle.Height + MinimumCollisionSize);
            }
        }

        public override void OnDraw(Graphics g)
        {
            DrawLine(g);
        }

        protected void DrawLine(Graphics g)
        {
            int borderSize = Math.Max(BorderSize, 1);

            if (Shadow)
            {
                PointF[] shadowPoints = new PointF[Points.Length];

                for (int i = 0; i < shadowPoints.Length; i++)
                {
                    shadowPoints[i] = Points[i].Add(ShadowOffset);
                }

                DrawLine(g, ShadowColor, borderSize, BorderStyle, shadowPoints);
            }

            DrawLine(g, BorderColor, borderSize, BorderStyle, Points);
        }

        protected void DrawLine(Graphics g, Color borderColor, int borderSize, BorderStyle borderStyle, PointF[] points)
        {
            if (borderSize > 0 && borderColor.A > 0)
            {
                g.SmoothingMode = SmoothingMode.HighQuality;

                if (borderSize.IsEvenNumber())
                {
                    g.PixelOffsetMode = PixelOffsetMode.Half;
                }

                using (Pen pen = CreatePen(borderColor, borderSize, borderStyle))
                {
                    if (CenterNodeActive && points.Length > 2)
                    {
                        g.DrawCurve(pen, points);
                    }
                    else
                    {
                        g.DrawLine(pen, points[0], points[points.Length - 1]);
                    }
                }

                g.SmoothingMode = SmoothingMode.None;
                g.PixelOffsetMode = PixelOffsetMode.Default;
            }
        }

        protected virtual Pen CreatePen(Color borderColor, int borderSize, BorderStyle borderStyle)
        {
            return new Pen(borderColor, borderSize)
            {
                StartCap = LineCap.Round,
                EndCap = LineCap.Round,
                LineJoin = LineJoin.Round,
                DashStyle = (DashStyle)borderStyle
            };
        }

        public override void Move(float x, float y)
        {
            base.Move(x, y);

            for (int i = 0; i < Points.Length; i++)
            {
                Points[i] = Points[i].Add(x, y);
            }
        }

        public override void Resize(int x, int y, bool fromBottomRight)
        {
            if (fromBottomRight)
            {
                Points[Points.Length - 1] = Points[Points.Length - 1].Add(x, y);
            }
            else
            {
                Points[0] = Points[0].Add(x, y);
            }
        }

        public override void OnNodeVisible()
        {
            for (int i = 0; i < Manager.ResizeNodes.Length; i++)
            {
                Manager.ResizeNodes[i].Visible = i < Points.Length;
            }
        }

        public override void OnNodeUpdate()
        {
            for (int i = 0; i < Points.Length; i++)
            {
                if (Manager.ResizeNodes[i].IsDragging)
                {
                    Manager.IsResizing = true;

                    if (i > 0 && i < Points.Length - 1)
                    {
                        CenterNodeActive = true;
                    }

                    Points[i] = Manager.Form.ScaledClientMousePosition;
                }
            }
        }

        public override void OnNodePositionUpdate()
        {
            for (int i = 0; i < Points.Length; i++)
            {
                Manager.ResizeNodes[i].Position = Points[i];

                if (i < Points.Length - 1)
                {
                    Manager.ResizeNodes[i].Visible = !Manager.ResizeNodes[i].Rectangle.IntersectsWith(Manager.ResizeNodes[Points.Length - 1].Rectangle);
                }
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: MagnifyDrawingShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Drawing/MagnifyDrawingShape.cs

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
using System.Drawing.Drawing2D;

namespace ShareX.ScreenCaptureLib
{
    public class MagnifyDrawingShape : EllipseDrawingShape
    {
        public override ShapeType ShapeType { get; } = ShapeType.DrawingMagnify;

        public int MagnifyStrength { get; set; } = 200;
        public ImageInterpolationMode ImageInterpolationMode { get; set; }

        public MagnifyDrawingShape()
        {
            ForceProportionalResizing = true;
        }

        public override void OnConfigLoad()
        {
            base.OnConfigLoad();
            MagnifyStrength = AnnotationOptions.MagnifyStrength;
            ImageInterpolationMode = AnnotationOptions.ImageInterpolationMode;
        }

        public override void OnConfigSave()
        {
            base.OnConfigSave();
            AnnotationOptions.MagnifyStrength = MagnifyStrength;
            AnnotationOptions.ImageInterpolationMode = ImageInterpolationMode;
        }

        public override void OnDraw(Graphics g)
        {
            g.PixelOffsetMode = PixelOffsetMode.Half;
            g.InterpolationMode = ImageHelpers.GetInterpolationMode(ImageInterpolationMode);

            using (GraphicsPath gp = new GraphicsPath())
            {
                gp.AddEllipse(Rectangle);
                g.SetClip(gp);

                float magnify = Math.Max(MagnifyStrength, 100) / 100f;
                int newWidth = (int)(Rectangle.Width / magnify);
                int newHeight = (int)(Rectangle.Height / magnify);

                g.DrawImage(Manager.Form.Canvas, Rectangle,
                    new RectangleF(Rectangle.X + (Rectangle.Width / 2) - (newWidth / 2) - Manager.Form.CanvasRectangle.X + Manager.RenderOffset.X,
                    Rectangle.Y + (Rectangle.Height / 2) - (newHeight / 2) - Manager.Form.CanvasRectangle.Y + Manager.RenderOffset.Y,
                    newWidth, newHeight), GraphicsUnit.Pixel);

                g.ResetClip();
            }

            g.PixelOffsetMode = PixelOffsetMode.Default;
            g.InterpolationMode = InterpolationMode.Bilinear;

            DrawEllipse(g);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: RectangleDrawingShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Drawing/RectangleDrawingShape.cs

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
    public class RectangleDrawingShape : BaseDrawingShape
    {
        public override ShapeType ShapeType { get; } = ShapeType.DrawingRectangle;

        public int CornerRadius { get; set; }

        public override void OnConfigLoad()
        {
            base.OnConfigLoad();
            CornerRadius = AnnotationOptions.DrawingCornerRadius;
        }

        public override void OnConfigSave()
        {
            base.OnConfigSave();
            AnnotationOptions.DrawingCornerRadius = CornerRadius;
        }

        public override void OnDraw(Graphics g)
        {
            DrawRectangle(g);
        }

        protected void DrawRectangle(Graphics g)
        {
            if (Shadow)
            {
                if (IsBorderVisible)
                {
                    DrawRectangle(g, ShadowColor, BorderSize, BorderStyle, Color.Transparent, Rectangle.LocationOffset(ShadowOffset), CornerRadius);
                }
                else if (FillColor.A == 255)
                {
                    DrawRectangle(g, Color.Transparent, 0, BorderStyle, ShadowColor, Rectangle.LocationOffset(ShadowOffset), CornerRadius);
                }
            }

            DrawRectangle(g, BorderColor, BorderSize, BorderStyle, FillColor, Rectangle, CornerRadius);
        }

        protected void DrawRectangle(Graphics g, Color borderColor, int borderSize, BorderStyle borderStyle, Color fillColor, RectangleF rect, int cornerRadius)
        {
            Brush brush = null;
            Pen pen = null;

            try
            {
                if (fillColor.A > 0)
                {
                    brush = new SolidBrush(fillColor);
                }

                if (borderSize > 0 && borderColor.A > 0)
                {
                    pen = new Pen(borderColor, borderSize);
                    pen.DashStyle = (DashStyle)borderStyle;
                }

                if (cornerRadius > 0)
                {
                    g.SmoothingMode = SmoothingMode.HighQuality;

                    if (borderSize.IsEvenNumber())
                    {
                        g.PixelOffsetMode = PixelOffsetMode.Half;
                    }
                }

                g.DrawRoundedRectangle(brush, pen, rect, cornerRadius);

                g.SmoothingMode = SmoothingMode.None;
                g.PixelOffsetMode = PixelOffsetMode.Default;
            }
            finally
            {
                if (brush != null) brush.Dispose();
                if (pen != null) pen.Dispose();
            }
        }

        public override void OnShapePathRequested(GraphicsPath gp, RectangleF rect)
        {
            gp.AddRoundedRectangle(rect, CornerRadius);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: SmartEraserDrawingShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Drawing/SmartEraserDrawingShape.cs

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
    public class SmartEraserDrawingShape : BaseDrawingShape
    {
        public override ShapeType ShapeType { get; } = ShapeType.DrawingSmartEraser;

        private Color eraserColor;
        private Color eraserDimmedColor;

        public override void OnConfigLoad()
        {
        }

        public override void OnConfigSave()
        {
        }

        public override void OnCreating()
        {
            base.OnCreating();

            eraserColor = Manager.GetCurrentColor();

            if (eraserColor.IsEmpty)
            {
                eraserColor = Color.White;
            }

            if (Manager.Form.DimmedCanvas != null)
            {
                eraserDimmedColor = Manager.GetCurrentColor(Manager.Form.DimmedCanvas);
            }
        }

        public override void OnDraw(Graphics g)
        {
            Color color;

            if (!Manager.IsRenderingOutput && !eraserDimmedColor.IsEmpty)
            {
                color = eraserDimmedColor;
            }
            else
            {
                color = eraserColor;
            }

            using (Brush brush = new SolidBrush(color))
            {
                g.FillRectangle(brush, Rectangle);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: SpeechBalloonDrawingShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Drawing/SpeechBalloonDrawingShape.cs

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
using System.Drawing.Drawing2D;

namespace ShareX.ScreenCaptureLib
{
    public class SpeechBalloonDrawingShape : TextDrawingShape
    {
        public override ShapeType ShapeType { get; } = ShapeType.DrawingSpeechBalloon;

        private PointF tailPosition;

        public PointF TailPosition
        {
            get
            {
                return tailPosition;
            }
            private set
            {
                tailPosition = value;
                TailNode.Position = tailPosition;
            }
        }

        public bool TailVisible => !Rectangle.Contains(TailPosition);

        internal ResizeNode TailNode => Manager.ResizeNodes[(int)NodePosition.Extra];

        protected const float TailWidthMultiplier = 0.3f;

        public override void OnCreated()
        {
            AutoSize(true);
            TailPosition = Rectangle.Location.Add(0, Rectangle.Height + 30);
            OnCreated(false);
        }

        protected override void UseLightResizeNodes()
        {
            ChangeNodeShape(NodeShape.Square);
            Manager.ResizeNodes[(int)NodePosition.Extra].Shape = NodeShape.Circle;
        }

        public override void OnNodeVisible()
        {
            base.OnNodeVisible();

            TailNode.Position = TailPosition;
            TailNode.Visible = true;
        }

        public override void OnNodeUpdate()
        {
            base.OnNodeUpdate();

            if (TailNode.IsDragging)
            {
                TailPosition = Manager.Form.ScaledClientMousePosition;
            }
        }

        public override void Move(float x, float y)
        {
            base.Move(x, y);

            TailPosition = TailPosition.Add(x, y);
        }

        public override void OnDraw(Graphics g)
        {
            if (Rectangle.Width > 10 && Rectangle.Height > 10)
            {
                DrawSpeechBalloon(g);
                DrawText(g);
            }
        }

        protected void DrawSpeechBalloon(Graphics g)
        {
            if (Shadow)
            {
                if (IsBorderVisible)
                {
                    DrawSpeechBalloon(g, ShadowColor, BorderSize, Color.Transparent, Rectangle.LocationOffset(ShadowOffset), TailPosition.Add(ShadowOffset));
                }
                else if (FillColor.A == 255)
                {
                    DrawSpeechBalloon(g, Color.Transparent, 0, ShadowColor, Rectangle.LocationOffset(ShadowOffset), TailPosition.Add(ShadowOffset));
                }
            }

            DrawSpeechBalloon(g, BorderColor, BorderSize, FillColor, Rectangle, TailPosition);
        }

        protected void DrawSpeechBalloon(Graphics g, Color borderColor, int borderSize, Color fillColor, RectangleF rect, PointF tailPosition)
        {
            GraphicsPath gpTail = null;

            if (TailVisible)
            {
                gpTail = CreateTailPath(rect, tailPosition);
            }

            if (fillColor.A > 0)
            {
                using (Brush brush = new SolidBrush(fillColor))
                {
                    g.FillRectangle(brush, rect);
                }
            }

            if (gpTail != null)
            {
                g.SmoothingMode = SmoothingMode.HighQuality;

                if (fillColor.A > 0)
                {
                    g.ExcludeClip(rect.Round());

                    using (Brush brush = new SolidBrush(fillColor))
                    {
                        g.FillPath(brush, gpTail);
                    }

                    g.ResetClip();
                }

                if (borderSize > 0 && borderColor.A > 0)
                {
                    g.ExcludeClip(rect.Offset(-1).Round());

                    using (Pen pen = new Pen(borderColor, borderSize))
                    {
                        g.DrawPath(pen, gpTail);
                    }

                    g.ResetClip();
                }

                g.SmoothingMode = SmoothingMode.None;
            }

            if (borderSize > 0 && borderColor.A > 0)
            {
                if (gpTail != null)
                {
                    using (Region region = new Region(gpTail))
                    {
                        g.ExcludeClip(region);
                    }
                }

                using (Pen pen = new Pen(borderColor, borderSize) { Alignment = PenAlignment.Inset })
                {
                    g.DrawRectangleProper(pen, rect.Offset(borderSize - 1));
                }

                g.ResetClip();
            }

            if (gpTail != null)
            {
                gpTail.Dispose();
            }
        }

        protected GraphicsPath CreateTailPath(RectangleF rect, PointF tailPosition)
        {
            GraphicsPath gpTail = new GraphicsPath();
            PointF center = rect.Center();
            float rectAverageSize = (rect.Width + rect.Height) / 2;
            float tailWidth = TailWidthMultiplier * rectAverageSize;
            tailWidth = Math.Min(Math.Min(tailWidth, rect.Width), rect.Height);
            float tailOrigin = tailWidth / 2;
            int tailLength = (int)MathHelpers.Distance(center, tailPosition);
            gpTail.AddLine(0, -tailOrigin, 0, tailOrigin);
            gpTail.AddLine(0, tailOrigin, tailLength, 0);
            gpTail.CloseFigure();
            using (Matrix matrix = new Matrix())
            {
                matrix.Translate(center.X, center.Y);
                float tailDegree = MathHelpers.LookAtDegree(center, tailPosition);
                matrix.Rotate(tailDegree);
                gpTail.Transform(matrix);
            }
            return gpTail;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: StepDrawingShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Drawing/StepDrawingShape.cs

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
using System.Drawing.Drawing2D;
using System.Drawing.Text;

namespace ShareX.ScreenCaptureLib
{
    public class StepDrawingShape : EllipseDrawingShape
    {
        private const int DefaultSize = 30;

        public override ShapeType ShapeType { get; } = ShapeType.DrawingStep;

        public int FontSize { get; set; }
        public int Number { get; set; }
        public StepType StepType { get; set; } = StepType.Numbers;
        public bool IsTailActive { get; set; }

        private PointF tailPosition;

        public PointF TailPosition
        {
            get
            {
                return tailPosition;
            }
            private set
            {
                tailPosition = value;
                TailNode.Position = tailPosition;
            }
        }

        public bool TailVisible => !Rectangle.Contains(TailPosition);

        internal ResizeNode TailNode => Manager.ResizeNodes[(int)NodePosition.Extra];

        protected const float TailWidthMultiplier = 1f;

        public StepDrawingShape()
        {
            Rectangle = new Rectangle(0, 0, DefaultSize, DefaultSize);
        }

        public override void OnCreating()
        {
            Manager.IsMoving = true;
            PointF pos = Manager.Form.ScaledClientMousePosition;
            Rectangle = new RectangleF(new PointF(pos.X - (Rectangle.Width / 2), pos.Y - (Rectangle.Height / 2)), Rectangle.Size);
            int tailOffset = 5;
            TailPosition = Rectangle.Location.Add(Rectangle.Width + tailOffset, Rectangle.Height + tailOffset);
            OnCreated();
        }

        protected override void UseLightResizeNodes()
        {
            Manager.ResizeNodes[(int)NodePosition.Extra].Shape = NodeShape.Circle;
        }

        public override void OnNodeVisible()
        {
            TailNode.Position = TailPosition;
            TailNode.Visible = true;
        }

        public override void OnNodeUpdate()
        {
            if (TailNode.IsDragging)
            {
                IsTailActive = true;
                TailPosition = Manager.Form.ScaledClientMousePosition;
            }
        }

        public override void OnNodePositionUpdate()
        {
        }

        public override void OnConfigLoad()
        {
            BorderColor = AnnotationOptions.StepBorderColor;
            BorderSize = AnnotationOptions.StepBorderSize;
            FillColor = AnnotationOptions.StepFillColor;
            Shadow = AnnotationOptions.Shadow;
            ShadowColor = AnnotationOptions.ShadowColor;
            ShadowOffset = AnnotationOptions.ShadowOffset;
            FontSize = AnnotationOptions.StepFontSize;
            StepType = AnnotationOptions.StepType;
        }

        public override void OnConfigSave()
        {
            AnnotationOptions.StepBorderColor = BorderColor;
            AnnotationOptions.StepBorderSize = BorderSize;
            AnnotationOptions.StepFillColor = FillColor;
            AnnotationOptions.Shadow = Shadow;
            AnnotationOptions.ShadowColor = ShadowColor;
            AnnotationOptions.ShadowOffset = ShadowOffset;
            AnnotationOptions.StepFontSize = FontSize;
            AnnotationOptions.StepType = StepType;
        }

        public override void OnDraw(Graphics g)
        {
            DrawNumber(g);
        }

        private string GetText()
        {
            switch (StepType)
            {
                case StepType.LettersUppercase:
                    return Helpers.NumberToLetters(Number);
                case StepType.LettersLowercase:
                    return Helpers.NumberToLetters(Number).ToLowerInvariant();
                case StepType.RomanNumeralsUppercase:
                    return Helpers.NumberToRomanNumeral(Number);
                case StepType.RomanNumeralsLowercase:
                    return Helpers.NumberToRomanNumeral(Number).ToLowerInvariant();
                default:
                    return Number.ToString();
            }
        }

        protected void DrawNumber(Graphics g)
        {
            string text = GetText();

            using (Font font = new Font(FontFamily.GenericSansSerif, FontSize, FontStyle.Bold))
            {
                Size textSize = g.MeasureString(text, font).ToSize();
                int maxSize = Math.Max(textSize.Width, textSize.Height);
                int padding = 3;

                PointF center = Rectangle.Center();
                Rectangle = new RectangleF(center.X - (maxSize / 2f) - padding, center.Y - (maxSize / 2f) - padding, maxSize + (padding * 2), maxSize + (padding * 2));

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

                if (IsTailActive && TailVisible)
                {
                    if (Shadow)
                    {
                        DrawTail(g, ShadowColor, Rectangle.Offset(BorderSize / 2).LocationOffset(ShadowOffset), TailPosition.Add(ShadowOffset));
                    }

                    Color tailColor;

                    if (IsBorderVisible)
                    {
                        tailColor = BorderColor;
                    }
                    else
                    {
                        tailColor = FillColor;
                    }

                    DrawTail(g, tailColor, Rectangle.Offset(BorderSize / 2), TailPosition);
                }

                DrawEllipse(g, BorderColor, BorderSize, BorderStyle, FillColor, Rectangle);

                if (Shadow)
                {
                    DrawNumber(g, text, font, ShadowColor, Rectangle.LocationOffset(ShadowOffset));
                }

                DrawNumber(g, text, font, BorderColor, Rectangle);
            }
        }

        protected void DrawNumber(Graphics g, string text, Font font, Color textColor, RectangleF rect)
        {
            using (StringFormat sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center })
            using (Brush textBrush = new SolidBrush(textColor))
            {
                g.TextRenderingHint = TextRenderingHint.AntiAliasGridFit;
                rect = rect.LocationOffset(0, 1);
                g.DrawString(text, font, textBrush, rect, sf);
                g.TextRenderingHint = TextRenderingHint.SystemDefault;
            }
        }

        private void DrawTail(Graphics g, Color tailColor, RectangleF rectangle, PointF tailPosition)
        {
            using (GraphicsPath gpTail = CreateTailPath(rectangle, tailPosition))
            {
                if (gpTail != null)
                {
                    g.SmoothingMode = SmoothingMode.HighQuality;

                    using (Brush brush = new SolidBrush(tailColor))
                    {
                        g.FillPath(brush, gpTail);
                    }

                    g.SmoothingMode = SmoothingMode.None;
                }
            }
        }

        public override void Move(float x, float y)
        {
            base.Move(x, y);

            TailPosition = TailPosition.Add(x, y);
        }

        public override void Resize(int x, int y, bool fromBottomRight)
        {
            Move(x, y);
        }

        protected GraphicsPath CreateTailPath(RectangleF rect, PointF tailPosition)
        {
            GraphicsPath gpTail = new GraphicsPath();
            PointF center = rect.Center();
            float rectAverageSize = (rect.Width + rect.Height) / 2;
            float tailWidth = TailWidthMultiplier * rectAverageSize;
            tailWidth = Math.Min(Math.Min(tailWidth, rect.Width), rect.Height);
            float tailOrigin = tailWidth / 2;
            float tailLength = MathHelpers.Distance(center, tailPosition);
            gpTail.AddLine(0, -tailOrigin, 0, tailOrigin);
            gpTail.AddLine(0, tailOrigin, tailLength, 0);
            gpTail.CloseFigure();
            using (Matrix matrix = new Matrix())
            {
                matrix.Translate(center.X, center.Y);
                float tailDegree = MathHelpers.LookAtDegree(center, tailPosition);
                matrix.Rotate(tailDegree);
                gpTail.Transform(matrix);
            }
            return gpTail;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: StickerDrawingShape.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/Drawing/StickerDrawingShape.cs

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
using System.Windows.Forms;

namespace ShareX.ScreenCaptureLib
{
    public class StickerDrawingShape : ImageDrawingShape
    {
        public override ShapeType ShapeType { get; } = ShapeType.DrawingSticker;

        public override void OnConfigLoad()
        {
            ImageInterpolationMode = ImageInterpolationMode.NearestNeighbor;
        }

        public override void OnConfigSave()
        {
        }

        public override void ShowNodes()
        {
        }

        public override void OnCreating()
        {
            PointF pos = Manager.Form.ScaledClientMousePosition;
            Rectangle = new RectangleF(pos.X, pos.Y, 1, 1);

            if (Manager.IsCtrlModifier && LoadSticker(AnnotationOptions.LastStickerPath, AnnotationOptions.StickerSize))
            {
                OnCreated();
                Manager.IsMoving = true;
            }
            else if (OpenStickerForm())
            {
                OnCreated();
            }
            else
            {
                Remove();
            }
        }

        public override void OnDoubleClicked()
        {
            OpenStickerForm();
        }

        public override void Resize(int x, int y, bool fromBottomRight)
        {
            RotateFlipType rotateFlipType = RotateFlipType.RotateNoneFlipNone;

            if (x > 0)
            {
                rotateFlipType = RotateFlipType.Rotate90FlipNone;
            }
            else if (x < 0)
            {
                rotateFlipType = RotateFlipType.Rotate270FlipNone;
            }
            else if (y > 0)
            {
                rotateFlipType = RotateFlipType.RotateNoneFlipX;
            }
            else if (y < 0)
            {
                rotateFlipType = RotateFlipType.RotateNoneFlipY;
            }

            if (rotateFlipType != RotateFlipType.RotateNoneFlipNone)
            {
                PointF center = new PointF(Rectangle.X + Rectangle.Width / 2, Rectangle.Y + Rectangle.Height / 2);
                Bitmap flippedBmp = (Bitmap)Image.Clone();
                flippedBmp.RotateFlip(rotateFlipType);
                SetImage(flippedBmp, true);
                Rectangle = new RectangleF(center.X - flippedBmp.Width / 2, center.Y - flippedBmp.Height / 2, flippedBmp.Width, flippedBmp.Height);
            }
        }

        private bool OpenStickerForm()
        {
            Manager.Form.Pause();

            try
            {
                using (StickerForm stickerForm = new StickerForm(AnnotationOptions.StickerPacks, AnnotationOptions.SelectedStickerPack, AnnotationOptions.StickerSize))
                {
                    if (stickerForm.ShowDialogTopMost(Manager.Form) == DialogResult.OK)
                    {
                        AnnotationOptions.SelectedStickerPack = stickerForm.SelectedStickerPack;
                        AnnotationOptions.StickerSize = stickerForm.StickerSize;

                        return LoadSticker(stickerForm.SelectedImageFile, stickerForm.StickerSize);
                    }
                }
            }
            finally
            {
                Manager.Form.Resume();
            }

            return false;
        }

        private bool LoadSticker(string filePath, int stickerSize)
        {
            if (!string.IsNullOrEmpty(filePath))
            {
                Bitmap bmp = ImageHelpers.LoadImage(filePath);

                if (bmp != null)
                {
                    AnnotationOptions.LastStickerPath = filePath;

                    bmp = ImageHelpers.ResizeImageLimit(bmp, stickerSize);

                    SetImage(bmp, true);

                    return true;
                }
            }

            return false;
        }
    }
}
```

--------------------------------------------------------------------------------

````
