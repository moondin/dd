---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 512
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 512 of 650)

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

---[FILE: ImageEditorScrollbar.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Helpers/ImageEditorScrollbar.cs

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
using System.Windows.Forms;

namespace ShareX.ScreenCaptureLib
{
    internal class ImageEditorScrollbar : ImageEditorControl
    {
        public Orientation Orientation { get; set; }
        public int Thickness { get; set; } = 15;
        public int Margin { get; set; } = 5;
        public int Padding { get; set; } = 1;
        public bool IsCapsule { get; set; } = true;
        public Color TrackColor { get; set; } = Color.FromArgb(49, 54, 66);
        public Color ThumbColor { get; set; } = Color.FromArgb(90, 94, 104);
        public Color ActiveThumbColor { get; set; } = Color.FromArgb(111, 115, 123);
        public bool AutoHide { get; set; } = true;
        public RectangleF ThumbRectangle { get; private set; }

        private RegionCaptureForm form;

        public ImageEditorScrollbar(Orientation orientation, RegionCaptureForm form)
        {
            Orientation = orientation;
            this.form = form;
        }

        public void Update()
        {
            if (AutoHide)
            {
                RectangleF imageRectangle = form.CanvasRectangle.Scale(form.ZoomFactor);
                bool isScrollbarNeeded;

                if (Orientation == Orientation.Horizontal)
                {
                    isScrollbarNeeded = imageRectangle.Left < form.ClientArea.Left ||
                        (imageRectangle.Right * form.ZoomFactor) > form.ClientArea.Right;
                }
                else
                {
                    isScrollbarNeeded = imageRectangle.Top < form.ClientArea.Top ||
                        (imageRectangle.Bottom * form.ZoomFactor) > form.ClientArea.Bottom;
                }

                Visible = isScrollbarNeeded || IsDragging;
            }
            else
            {
                Visible = true;
            }

            if (Visible)
            {
                if (IsDragging)
                {
                    Scroll(form.ShapeManager.InputManager.ClientMousePosition);
                }

                RectangleF imageRectangle = form.CanvasRectangle.Scale(form.ZoomFactor);
                RectangleF imageRectangleVisible = imageRectangle;
                imageRectangleVisible.Intersect(form.ClientArea);

                float inClientAreaSize, inImageVisibleSize, inImageSize, sideOffsetBase;
                float inCanvasCenterOffset;

                if (Orientation == Orientation.Horizontal)
                {
                    inClientAreaSize = form.ClientArea.Width;
                    inImageVisibleSize = imageRectangleVisible.Width;
                    inImageSize = imageRectangle.Width;
                    sideOffsetBase = form.ClientArea.Bottom;
                    inCanvasCenterOffset = form.CanvasCenterOffset.X;
                }
                else
                {
                    inClientAreaSize = form.ClientArea.Height;
                    inImageVisibleSize = imageRectangleVisible.Height;
                    inImageSize = imageRectangle.Height;
                    sideOffsetBase = form.ClientArea.Right;
                    inCanvasCenterOffset = form.CanvasCenterOffset.Y;
                }

                float trackLength = inClientAreaSize - (Margin * 2) - (Padding * 2) - Thickness;
                float trackLengthInternal = trackLength - (Padding * 2);

                int thumbLength = Math.Max(Thickness, (int)Math.Round((float)inImageVisibleSize / inImageSize * trackLengthInternal));
                double thumbLimit = (trackLengthInternal - thumbLength) / 2.0f;
                int thumbPosition = (int)Math.Round(Margin + (trackLength / 2.0f) - (thumbLength / 2.0f) -
                    Math.Min(thumbLimit, Math.Max(-thumbLimit, inCanvasCenterOffset / inImageSize * trackLengthInternal)));

                int trackWidth = (Padding * 2) + Thickness;
                float thumbSideOffset = sideOffsetBase - Margin - Padding - Thickness;
                float trackSideOffset = thumbSideOffset - Padding;

                if (Orientation == Orientation.Horizontal)
                {
                    Rectangle = new RectangleF(Margin, trackSideOffset, trackLength, trackWidth);
                    ThumbRectangle = new RectangleF(thumbPosition, thumbSideOffset, thumbLength, Thickness);
                }
                else
                {
                    Rectangle = new RectangleF(trackSideOffset, Margin, trackWidth, trackLength);
                    ThumbRectangle = new RectangleF(thumbSideOffset, thumbPosition, Thickness, thumbLength);
                }
            }
        }

        public override void OnDraw(Graphics g)
        {
            Color thumbColor;

            if (IsDragging || form.ShapeManager.IsPanning || IsCursorHover)
            {
                thumbColor = ActiveThumbColor;
            }
            else
            {
                thumbColor = ThumbColor;
            }

            using (Brush trackBrush = new SolidBrush(TrackColor))
            using (Brush thumbBrush = new SolidBrush(thumbColor))
            {
                Matrix savedTransform = g.Transform;
                form.ZoomTransform(g, true);

                if (IsCapsule)
                {
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.PixelOffsetMode = PixelOffsetMode.Half;

                    g.DrawCapsule(trackBrush, Rectangle);
                    g.DrawCapsule(thumbBrush, ThumbRectangle);

                    g.SmoothingMode = SmoothingMode.None;
                    g.PixelOffsetMode = PixelOffsetMode.Default;
                }
                else
                {
                    g.FillRectangle(trackBrush, Rectangle);
                    g.FillRectangle(thumbBrush, ThumbRectangle);
                }

                g.Transform = savedTransform;
            }
        }

        private void Scroll(Point position)
        {
            RectangleF imageRectangle = form.CanvasRectangle.Scale(form.ZoomFactor);
            float inMousePosition, inClientAreaSize, inImageSize;

            if (Orientation == Orientation.Horizontal)
            {
                inMousePosition = position.X;
                inClientAreaSize = form.ClientArea.Width;
                inImageSize = imageRectangle.Width;
            }
            else
            {
                inMousePosition = position.Y;
                inClientAreaSize = form.ClientArea.Height;
                inImageSize = imageRectangle.Height;
            }

            float mousePositionLocal = inMousePosition - Margin - Padding;

            float trackLength = inClientAreaSize - (Margin * 2) - (Padding * 2) - Thickness;
            float trackLengthInternal = trackLength - (Padding * 2);

            float centerOffsetNew = ((trackLengthInternal / 2.0f) - mousePositionLocal) / trackLengthInternal * inImageSize;

            Vector2 canvasCenterOffset = Orientation == Orientation.Horizontal ?
                new Vector2(centerOffsetNew, form.CanvasCenterOffset.Y) :
                new Vector2(form.CanvasCenterOffset.X, centerOffsetNew);
            form.PanToOffset(canvasCenterOffset);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: InputManager.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Helpers/InputManager.cs

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

namespace ShareX.ScreenCaptureLib
{
    public class InputManager
    {
        public Point MousePosition => mouseState.Position;

        public Point PreviousMousePosition => oldMouseState.Position;

        public Point ClientMousePosition => mouseState.ClientPosition;

        public Point PreviousClientMousePosition => oldMouseState.ClientPosition;

        public Point MouseVelocity => new Point(ClientMousePosition.X - PreviousClientMousePosition.X, ClientMousePosition.Y - PreviousClientMousePosition.Y);

        public bool IsMouseMoved => MouseVelocity.X != 0 || MouseVelocity.Y != 0;

        private MouseState mouseState = new MouseState();
        private MouseState oldMouseState;

        public void Update(Control control)
        {
            oldMouseState = mouseState;
            mouseState.Update(control);
        }

        public bool IsMouseDown(MouseButtons button)
        {
            return mouseState.Buttons.HasFlag(button);
        }

        public bool IsBeforeMouseDown(MouseButtons button)
        {
            return oldMouseState.Buttons.HasFlag(button);
        }

        public bool IsMousePressed(MouseButtons button)
        {
            return IsMouseDown(button) && !IsBeforeMouseDown(button);
        }

        public bool IsMouseReleased(MouseButtons button)
        {
            return !IsMouseDown(button) && IsBeforeMouseDown(button);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: LocationInfo.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Helpers/LocationInfo.cs

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
    public class LocationInfo
    {
        public long Location { get; set; }
        public long Length { get; set; }

        public LocationInfo(long location, long length)
        {
            Location = location;
            Length = length;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: MouseState.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Helpers/MouseState.cs

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
    public struct MouseState
    {
        public MouseButtons Buttons { get; private set; }
        public Point Position { get; private set; }
        public Point ClientPosition { get; private set; }

        public void Update(Control control)
        {
            Buttons = Control.MouseButtons;
            Position = Control.MousePosition;

            if (control != null)
            {
                ClientPosition = control.PointToClient(Position);
            }
            else
            {
                ClientPosition = CaptureHelpers.ScreenToClient(Position);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ResizeNode.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Helpers/ResizeNode.cs

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
    internal class ResizeNode : ImageEditorControl
    {
        public const int DefaultSize = 13;

        private PointF position;

        public PointF Position
        {
            get
            {
                return position;
            }
            set
            {
                position = value;

                Rectangle = new RectangleF(position.X - ((Size - 1) / 2), position.Y - ((Size - 1) / 2), Size, Size);
            }
        }

        public int Size { get; set; }

        public bool AutoSetSize { get; set; } = true;

        private NodeShape shape;

        public NodeShape Shape
        {
            get
            {
                return shape;
            }
            set
            {
                shape = value;

                if (AutoSetSize)
                {
                    if (shape == NodeShape.CustomNode && CustomNodeImage != null)
                    {
                        Size = Math.Max(CustomNodeImage.Width, CustomNodeImage.Height);
                    }
                    else
                    {
                        Size = DefaultSize;
                    }
                }
            }
        }

        public Image CustomNodeImage { get; private set; }

        public ResizeNode(float x = 0, float y = 0)
        {
            Shape = NodeShape.Square;
            Position = new PointF(x, y);
        }

        public void SetCustomNode(Image customNodeImage)
        {
            CustomNodeImage = customNodeImage;
            Shape = NodeShape.CustomNode;
        }

        public override void OnDraw(Graphics g)
        {
            RectangleF rect = Rectangle.SizeOffset(-1);

            switch (Shape)
            {
                case NodeShape.Square:
                    g.DrawRectangle(Pens.White, rect.Round().Offset(-1));
                    g.DrawRectangle(Pens.Black, rect.Round());
                    break;
                default:
                case NodeShape.Circle:
                    g.DrawEllipse(Pens.White, rect.Offset(-1));
                    g.DrawEllipse(Pens.Black, rect);
                    break;
                case NodeShape.Diamond:
                    g.DrawDiamond(Pens.White, rect.Round().Offset(-1));
                    g.DrawDiamond(Pens.Black, rect.Round());
                    break;
                case NodeShape.CustomNode when CustomNodeImage != null:
                    g.DrawImage(CustomNodeImage, Rectangle);
                    break;
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ScrollbarManager.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Helpers/ScrollbarManager.cs

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

using System.Windows.Forms;

namespace ShareX.ScreenCaptureLib
{
    internal class ScrollbarManager
    {
        public bool Visible => horizontalScrollbar.Visible || verticalScrollbar.Visible;

        private RegionCaptureForm form;
        private ImageEditorScrollbar horizontalScrollbar, verticalScrollbar;

        public ScrollbarManager(RegionCaptureForm regionCaptureForm, ShapeManager shapeManager)
        {
            form = regionCaptureForm;
            horizontalScrollbar = new ImageEditorScrollbar(Orientation.Horizontal, form);
            shapeManager.DrawableObjects.Add(horizontalScrollbar);
            verticalScrollbar = new ImageEditorScrollbar(Orientation.Vertical, form);
            shapeManager.DrawableObjects.Add(verticalScrollbar);
        }

        public void Update()
        {
            horizontalScrollbar.Update();
            verticalScrollbar.Update();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: SimpleWindowInfo.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Helpers/SimpleWindowInfo.cs

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
    public class SimpleWindowInfo
    {
        public IntPtr Handle { get; set; }
        public Rectangle Rectangle { get; set; }
        public bool IsWindow { get; set; }

        public WindowInfo WindowInfo
        {
            get
            {
                return new WindowInfo(Handle);
            }
        }

        public SimpleWindowInfo(IntPtr handle)
        {
            Handle = handle;
        }

        public SimpleWindowInfo(IntPtr handle, Rectangle rect)
        {
            Handle = handle;
            Rectangle = rect;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: SnapSize.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Helpers/SnapSize.cs

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

namespace ShareX.ScreenCaptureLib
{
    public class SnapSize
    {
        private const int MinimumWidth = 2;

        private int width;

        public int Width
        {
            get
            {
                return width;
            }
            set
            {
                width = Math.Max(value, MinimumWidth);
            }
        }

        private const int MinimumHeight = 2;

        private int height;

        public int Height
        {
            get
            {
                return height;
            }
            set
            {
                height = Math.Max(value, MinimumHeight);
            }
        }

        public SnapSize()
        {
            width = MinimumWidth;
            height = MinimumHeight;
        }

        public SnapSize(int width, int height)
        {
            Width = width;
            Height = height;
        }

        public static implicit operator Size(SnapSize size)
        {
            return new Size(size.Width, size.Height);
        }

        public override string ToString()
        {
            return $"{Width}x{Height}";
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: StickerImageListViewRenderer.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Helpers/StickerImageListViewRenderer.cs

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

using Manina.Windows.Forms;
using ShareX.HelpersLib;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.Windows.Forms;

namespace ShareX.ScreenCaptureLib
{
    public class StickerImageListViewRenderer : ImageListView.ImageListViewRenderer
    {
        public override void InitializeGraphics(Graphics g)
        {
            base.InitializeGraphics(g);

            ItemDrawOrder = ItemDrawOrder.NormalSelectedHovered;

            ImageListView.Colors.SelectedColor1 = ImageListView.Colors.HoverColor1 = ImageListView.Colors.UnFocusedColor1 = Color.FromArgb(252, 221, 132);
            ImageListView.Colors.SelectedColor2 = ImageListView.Colors.HoverColor2 = ImageListView.Colors.UnFocusedColor2 = Color.Transparent;

            ImageListView.BackColor = ShareXResources.Theme.BackgroundColor;
            ImageListView.Colors.BackColor = ShareXResources.Theme.LightBackgroundColor;
            ImageListView.Colors.BorderColor = ShareXResources.Theme.BorderColor;
            ImageListView.Colors.ForeColor = ShareXResources.Theme.TextColor;
            ImageListView.Colors.SelectedForeColor = ShareXResources.Theme.TextColor;
            ImageListView.Colors.UnFocusedForeColor = ShareXResources.Theme.TextColor;
        }

        public override void DrawItem(Graphics g, ImageListViewItem item, ItemState state, Rectangle bounds)
        {
            Clip = false;

            Size itemPadding = new Size(4, 4);
            Rectangle imageBounds = bounds;

            string text = Path.GetFileNameWithoutExtension(item.Text);
            Size szt = TextRenderer.MeasureText(text, ImageListView.Font);
            int textWidth = szt.Width + (itemPadding.Width * 2);

            if ((state & ItemState.Hovered) != ItemState.None && textWidth > bounds.Width)
            {
                bounds = new Rectangle(bounds.X + (bounds.Width / 2) - (textWidth / 2), bounds.Y, textWidth, bounds.Height);
            }

            // Paint background
            if (ImageListView.Enabled)
            {
                using (Brush bItemBack = new SolidBrush(ImageListView.Colors.BackColor))
                {
                    g.FillRectangle(bItemBack, bounds);
                }
            }
            else
            {
                using (Brush bItemBack = new SolidBrush(ImageListView.Colors.DisabledBackColor))
                {
                    g.FillRectangle(bItemBack, bounds);
                }
            }

            if ((state & ItemState.Disabled) != ItemState.None) // Paint background Disabled
            {
                using (Brush bDisabled = new LinearGradientBrush(bounds.Offset(1), ImageListView.Colors.DisabledColor1, ImageListView.Colors.DisabledColor2, LinearGradientMode.Vertical))
                {
                    g.FillRectangle(bDisabled, bounds);
                }
            }
            else if ((ImageListView.Focused && ((state & ItemState.Selected) != ItemState.None)) ||
                (!ImageListView.Focused && ((state & ItemState.Selected) != ItemState.None) && ((state & ItemState.Hovered) != ItemState.None))) // Paint background Selected
            {
                using (Brush bSelected = new LinearGradientBrush(bounds.Offset(1), ImageListView.Colors.SelectedColor1, ImageListView.Colors.SelectedColor2, LinearGradientMode.Vertical))
                {
                    g.FillRectangle(bSelected, bounds);
                }
            }
            else if (!ImageListView.Focused && ((state & ItemState.Selected) != ItemState.None)) // Paint background unfocused
            {
                using (Brush bGray64 = new LinearGradientBrush(bounds.Offset(1), ImageListView.Colors.UnFocusedColor1, ImageListView.Colors.UnFocusedColor2, LinearGradientMode.Vertical))
                {
                    g.FillRectangle(bGray64, bounds);
                }
            }

            // Paint background Hovered
            if ((state & ItemState.Hovered) != ItemState.None)
            {
                using (Brush bHovered = new LinearGradientBrush(bounds.Offset(1), ImageListView.Colors.HoverColor1, ImageListView.Colors.HoverColor2, LinearGradientMode.Vertical))
                {
                    g.FillRectangle(bHovered, bounds);
                }
            }

            // Draw the image
            Image img = item.GetCachedImage(CachedImageType.Thumbnail);
            if (img != null)
            {
                Rectangle pos = Utility.GetSizedImageBounds(img, new Rectangle(imageBounds.Location + itemPadding, ImageListView.ThumbnailSize));
                g.DrawImage(img, pos);
            }

            // Draw item text
            Color foreColor = ImageListView.Colors.ForeColor;
            if ((state & ItemState.Disabled) != ItemState.None)
            {
                foreColor = ImageListView.Colors.DisabledForeColor;
            }
            else if ((state & ItemState.Selected) != ItemState.None)
            {
                if (ImageListView.Focused)
                {
                    foreColor = ImageListView.Colors.SelectedForeColor;
                }
                else
                {
                    foreColor = ImageListView.Colors.UnFocusedForeColor;
                }
            }

            Rectangle rt = new Rectangle(bounds.Left, bounds.Top + (2 * itemPadding.Height) + ImageListView.ThumbnailSize.Height, bounds.Width, szt.Height);
            TextFormatFlags flags;

            if ((state & ItemState.Hovered) != ItemState.None)
            {
                flags = TextFormatFlags.HorizontalCenter | TextFormatFlags.VerticalCenter | TextFormatFlags.SingleLine | TextFormatFlags.NoClipping;
            }
            else
            {
                flags = TextFormatFlags.HorizontalCenter | TextFormatFlags.VerticalCenter | TextFormatFlags.SingleLine | TextFormatFlags.WordEllipsis;
            }

            TextRenderer.DrawText(g, text, ImageListView.Font, rt, foreColor, flags);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: WindowsList.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Helpers/WindowsList.cs

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
using System.Linq;

namespace ShareX.ScreenCaptureLib
{
    public class WindowsList
    {
        public List<IntPtr> IgnoreWindows { get; set; }

        private string[] ignoreList = new string[] { "Progman", "Button" };
        private List<WindowInfo> windows;

        public WindowsList()
        {
            IgnoreWindows = new List<IntPtr>();
        }

        public WindowsList(IntPtr ignoreWindow) : this()
        {
            IgnoreWindows.Add(ignoreWindow);
        }

        public List<WindowInfo> GetWindowsList()
        {
            windows = new List<WindowInfo>();
            EnumWindowsProc ewp = EvalWindows;
            NativeMethods.EnumWindows(ewp, IntPtr.Zero);
            return windows;
        }

        public List<WindowInfo> GetVisibleWindowsList()
        {
            List<WindowInfo> windows = GetWindowsList();

            return windows.Where(IsValidWindow).ToList();
        }

        private bool IsValidWindow(WindowInfo window)
        {
            return window != null && window.IsVisible && !string.IsNullOrEmpty(window.Text) && IsClassNameAllowed(window) && window.Rectangle.IsValid();
        }

        private bool IsClassNameAllowed(WindowInfo window)
        {
            string className = window.ClassName;

            if (!string.IsNullOrEmpty(className))
            {
                return ignoreList.All(ignore => !className.Equals(ignore, StringComparison.OrdinalIgnoreCase));
            }

            return true;
        }

        private bool EvalWindows(IntPtr hWnd, IntPtr lParam)
        {
            if (IgnoreWindows.Any(window => hWnd == window))
            {
                return true;
            }

            windows.Add(new WindowInfo(hWnd));

            return true;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: WindowsRectangleList.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Helpers/WindowsRectangleList.cs

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
using System.Threading;

namespace ShareX.ScreenCaptureLib
{
    public class WindowsRectangleList
    {
        public IntPtr IgnoreHandle { get; set; }
        public bool IncludeChildWindows { get; set; }
        public int Timeout { get; set; }

        private List<SimpleWindowInfo> windows;
        private HashSet<IntPtr> parentHandles;
        private CancellationTokenSource cts;

        public List<SimpleWindowInfo> GetWindowInfoList()
        {
            windows = new List<SimpleWindowInfo>();
            parentHandles = new HashSet<IntPtr>();

            try
            {
                if (Timeout > 0)
                {
                    cts = new CancellationTokenSource();
                    cts.CancelAfter(Timeout);
                }

                bool EvalWindow(IntPtr hWnd, IntPtr _)
                {
                    return CheckHandle(hWnd, null);
                }

                NativeMethods.EnumWindows(EvalWindow, IntPtr.Zero);
            }
            catch
            {
            }
            finally
            {
                cts?.Dispose();
            }

            List<SimpleWindowInfo> result = new List<SimpleWindowInfo>();

            foreach (SimpleWindowInfo window in windows)
            {
                bool rectVisible = true;

                if (!window.IsWindow)
                {
                    foreach (SimpleWindowInfo window2 in result)
                    {
                        if (window2.Rectangle.Contains(window.Rectangle))
                        {
                            rectVisible = false;
                            break;
                        }
                    }
                }

                if (rectVisible)
                {
                    result.Add(window);
                }
            }

            return result;
        }

        private bool CheckHandle(IntPtr handle, Rectangle? clipRect)
        {
            bool isWindow = clipRect == null;

            if (cts != null && cts.IsCancellationRequested)
            {
                return false;
            }

            if (handle == IgnoreHandle || !NativeMethods.IsWindowVisible(handle) || (isWindow && NativeMethods.IsWindowCloaked(handle)))
            {
                return true;
            }

            SimpleWindowInfo windowInfo = new SimpleWindowInfo(handle);

            if (isWindow)
            {
                windowInfo.IsWindow = true;
                windowInfo.Rectangle = CaptureHelpers.GetWindowRectangle(handle);
            }
            else
            {
                Rectangle rect = NativeMethods.GetWindowRect(handle);
                windowInfo.Rectangle = Rectangle.Intersect(rect, clipRect.Value);
            }

            if (!windowInfo.Rectangle.IsValid())
            {
                return true;
            }

            if (IncludeChildWindows && !parentHandles.Contains(handle))
            {
                parentHandles.Add(handle);

                bool EvalControl(IntPtr hWnd, IntPtr _)
                {
                    return CheckHandle(hWnd, windowInfo.Rectangle);
                }

                NativeMethods.EnumChildWindows(handle, EvalControl, IntPtr.Zero);
            }

            if (isWindow)
            {
                Rectangle clientRect = NativeMethods.GetClientRect(handle);

                if (clientRect.IsValid() && clientRect != windowInfo.Rectangle)
                {
                    windows.Add(new SimpleWindowInfo(handle, clientRect));
                }
            }

            windows.Add(windowInfo);

            return true;
        }
    }
}
```

--------------------------------------------------------------------------------

````
