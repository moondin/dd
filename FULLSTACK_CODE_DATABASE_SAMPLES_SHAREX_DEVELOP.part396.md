---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 396
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 396 of 650)

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

---[FILE: DrawBackgroundImage.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Drawings/DrawBackgroundImage.cs

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
    [Description("Background image")]
    public class DrawBackgroundImage : ImageEffect
    {
        [DefaultValue(""), Editor(typeof(ImageFileNameEditor), typeof(UITypeEditor))]
        public string ImageFilePath { get; set; }

        [DefaultValue(true)]
        public bool Center { get; set; }

        [DefaultValue(false)]
        public bool Tile { get; set; }

        public DrawBackgroundImage()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            return ImageHelpers.DrawBackgroundImage(bmp, ImageFilePath, Center, Tile);
        }

        protected override string GetSummary()
        {
            if (!string.IsNullOrEmpty(ImageFilePath))
            {
                return FileHelpers.GetFileNameSafe(ImageFilePath);
            }

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: DrawBorder.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Drawings/DrawBorder.cs

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
    [Description("Border")]
    public class DrawBorder : ImageEffect
    {
        [DefaultValue(BorderType.Outside)]
        public BorderType Type { get; set; }

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

        [DefaultValue(DashStyle.Solid), TypeConverter(typeof(EnumProperNameConverter))]
        public DashStyle DashStyle { get; set; }

        [DefaultValue(typeof(Color), "Black"), Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color Color { get; set; }

        [DefaultValue(false)]
        public bool UseGradient { get; set; }

        [Editor(typeof(GradientEditor), typeof(UITypeEditor))]
        public GradientInfo Gradient { get; set; }

        public DrawBorder()
        {
            this.ApplyDefaultPropertyValues();
            AddDefaultGradient();
        }

        private void AddDefaultGradient()
        {
            Gradient = new GradientInfo();
            Gradient.Colors.Add(new GradientStop(Color.FromArgb(68, 120, 194), 0f));
            Gradient.Colors.Add(new GradientStop(Color.FromArgb(13, 58, 122), 50f));
            Gradient.Colors.Add(new GradientStop(Color.FromArgb(6, 36, 78), 50f));
            Gradient.Colors.Add(new GradientStop(Color.FromArgb(23, 89, 174), 100f));
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            if (UseGradient && Gradient != null && Gradient.IsValid)
            {
                return ImageHelpers.DrawBorder(bmp, Gradient, Size, Type, DashStyle);
            }

            return ImageHelpers.DrawBorder(bmp, Color, Size, Type, DashStyle);
        }

        protected override string GetSummary()
        {
            return Size + "px";
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: DrawCheckerboard.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Drawings/DrawCheckerboard.cs

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
    [Description("Checkerboard")]
    public class DrawCheckerboard : ImageEffect
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
                size = value.Max(1);
            }
        }

        [DefaultValue(typeof(Color), "LightGray"), Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color Color { get; set; }

        [DefaultValue(typeof(Color), "White"), Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color Color2 { get; set; }

        public DrawCheckerboard()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            return ImageHelpers.DrawCheckers(bmp, Size, Color, Color2);
        }

        protected override string GetSummary()
        {
            return $"{Size}x{Size}";
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: DrawImage.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Drawings/DrawImage.cs

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
using System.Drawing.Design;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

namespace ShareX.ImageEffectsLib
{
    [Description("Image")]
    public class DrawImage : ImageEffect
    {
        [DefaultValue(""), Editor(typeof(ImageFileNameEditor), typeof(UITypeEditor))]
        public string ImageLocation { get; set; }

        [DefaultValue(ContentAlignment.TopLeft), TypeConverter(typeof(EnumProperNameConverter))]
        public ContentAlignment Placement { get; set; }

        [DefaultValue(typeof(Point), "0, 0")]
        public Point Offset { get; set; }

        [DefaultValue(DrawImageSizeMode.DontResize), Description("How the image watermark should be rescaled, if at all."), TypeConverter(typeof(EnumDescriptionConverter))]
        public DrawImageSizeMode SizeMode { get; set; }

        [DefaultValue(typeof(Size), "0, 0")]
        public Size Size { get; set; }

        [DefaultValue(ImageRotateFlipType.None), TypeConverter(typeof(EnumProperNameKeepCaseConverter))]
        public ImageRotateFlipType RotateFlip { get; set; }

        [DefaultValue(false)]
        public bool Tile { get; set; }

        [DefaultValue(false), Description("If image watermark size bigger than source image then don't draw it.")]
        public bool AutoHide { get; set; }

        [DefaultValue(ImageInterpolationMode.HighQualityBicubic), TypeConverter(typeof(EnumProperNameConverter))]
        public ImageInterpolationMode InterpolationMode { get; set; }

        [DefaultValue(CompositingMode.SourceOver), TypeConverter(typeof(EnumProperNameConverter))]
        public CompositingMode CompositingMode { get; set; }

        private int opacity;

        [DefaultValue(100)]
        public int Opacity
        {
            get
            {
                return opacity;
            }
            set
            {
                opacity = value.Clamp(0, 100);
            }
        }

        public DrawImage()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            if (Opacity < 1 || (SizeMode != DrawImageSizeMode.DontResize && Size.Width <= 0 && Size.Height <= 0))
            {
                return bmp;
            }

            string imageFilePath = FileHelpers.ExpandFolderVariables(ImageLocation, true);

            if (!string.IsNullOrEmpty(imageFilePath) && File.Exists(imageFilePath))
            {
                using (Bitmap bmpWatermark = ImageHelpers.LoadImage(imageFilePath))
                {
                    if (bmpWatermark != null)
                    {
                        if (RotateFlip != ImageRotateFlipType.None)
                        {
                            bmpWatermark.RotateFlip((RotateFlipType)RotateFlip);
                        }

                        Size imageSize;

                        if (SizeMode == DrawImageSizeMode.AbsoluteSize)
                        {
                            int width = Size.Width == -1 ? bmp.Width : Size.Width;
                            int height = Size.Height == -1 ? bmp.Height : Size.Height;
                            imageSize = ImageHelpers.ApplyAspectRatio(width, height, bmpWatermark);
                        }
                        else if (SizeMode == DrawImageSizeMode.PercentageOfWatermark)
                        {
                            int width = (int)Math.Round(Size.Width / 100f * bmpWatermark.Width);
                            int height = (int)Math.Round(Size.Height / 100f * bmpWatermark.Height);
                            imageSize = ImageHelpers.ApplyAspectRatio(width, height, bmpWatermark);
                        }
                        else if (SizeMode == DrawImageSizeMode.PercentageOfCanvas)
                        {
                            int width = (int)Math.Round(Size.Width / 100f * bmp.Width);
                            int height = (int)Math.Round(Size.Height / 100f * bmp.Height);
                            imageSize = ImageHelpers.ApplyAspectRatio(width, height, bmpWatermark);
                        }
                        else
                        {
                            imageSize = bmpWatermark.Size;
                        }

                        Point imagePosition = Helpers.GetPosition(Placement, Offset, bmp.Size, imageSize);
                        Rectangle imageRectangle = new Rectangle(imagePosition, imageSize);

                        if (AutoHide && !new Rectangle(0, 0, bmp.Width, bmp.Height).Contains(imageRectangle))
                        {
                            return bmp;
                        }

                        using (Graphics g = Graphics.FromImage(bmp))
                        {
                            g.InterpolationMode = ImageHelpers.GetInterpolationMode(InterpolationMode);
                            g.PixelOffsetMode = PixelOffsetMode.Half;
                            g.CompositingMode = CompositingMode;

                            if (Tile)
                            {
                                using (TextureBrush brush = new TextureBrush(bmpWatermark, WrapMode.Tile))
                                {
                                    brush.TranslateTransform(imageRectangle.X, imageRectangle.Y);
                                    g.FillRectangle(brush, imageRectangle);
                                }
                            }
                            else if (Opacity < 100)
                            {
                                using (ImageAttributes ia = new ImageAttributes())
                                {
                                    ColorMatrix matrix = ColorMatrixManager.Alpha(Opacity / 100f);
                                    ia.SetColorMatrix(matrix, ColorMatrixFlag.Default, ColorAdjustType.Bitmap);
                                    g.DrawImage(bmpWatermark, imageRectangle, 0, 0, bmpWatermark.Width, bmpWatermark.Height, GraphicsUnit.Pixel, ia);
                                }
                            }
                            else
                            {
                                g.DrawImage(bmpWatermark, imageRectangle);
                            }
                        }
                    }
                }
            }

            return bmp;
        }

        protected override string GetSummary()
        {
            if (!string.IsNullOrEmpty(ImageLocation))
            {
                return FileHelpers.GetFileNameSafe(ImageLocation);
            }

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: DrawParticles.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Drawings/DrawParticles.cs

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
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Design;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;

namespace ShareX.ImageEffectsLib
{
    [Description("Particles")]
    public class DrawParticles : ImageEffect
    {
        [DefaultValue(""), Editor(typeof(DirectoryNameEditor), typeof(UITypeEditor))]
        public string ImageFolder { get; set; }

        private int imageCount;

        [DefaultValue(1)]
        public int ImageCount
        {
            get
            {
                return imageCount;
            }
            set
            {
                imageCount = value.Clamp(1, 1000);
            }
        }

        [DefaultValue(false)]
        public bool Background { get; set; }

        [DefaultValue(false)]
        public bool RandomSize { get; set; }

        [DefaultValue(64)]
        public int RandomSizeMin { get; set; }

        [DefaultValue(128)]
        public int RandomSizeMax { get; set; }

        [DefaultValue(false)]
        public bool RandomAngle { get; set; }

        [DefaultValue(0)]
        public int RandomAngleMin { get; set; }

        [DefaultValue(360)]
        public int RandomAngleMax { get; set; }

        [DefaultValue(false)]
        public bool RandomOpacity { get; set; }

        [DefaultValue(0)]
        public int RandomOpacityMin { get; set; }

        [DefaultValue(100)]
        public int RandomOpacityMax { get; set; }

        [DefaultValue(false)]
        public bool NoOverlap { get; set; }

        [DefaultValue(0)]
        public int NoOverlapOffset { get; set; }

        [DefaultValue(false)]
        public bool EdgeOverlap { get; set; }

        private List<Rectangle> imageRectangles = new List<Rectangle>();

        public DrawParticles()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            if (Background)
            {
                Bitmap result = bmp.CreateEmptyBitmap();

                DrawParticlesFromFolder(result, ImageFolder);

                using (Graphics g = Graphics.FromImage(result))
                {
                    g.DrawImage(bmp, 0, 0, bmp.Width, bmp.Height);
                }

                bmp.Dispose();

                return result;
            }
            else
            {
                DrawParticlesFromFolder(bmp, ImageFolder);

                return bmp;
            }
        }

        private void DrawParticlesFromFolder(Bitmap bmp, string imageFolder)
        {
            imageFolder = FileHelpers.ExpandFolderVariables(imageFolder, true);

            if (!string.IsNullOrEmpty(imageFolder) && Directory.Exists(imageFolder))
            {
                string[] files = FileHelpers.GetFilesByExtensions(imageFolder, ".png", ".jpg").ToArray();

                if (files.Length > 0)
                {
                    imageRectangles.Clear();

                    using (Graphics g = Graphics.FromImage(bmp))
                    using (ImageFilesCache imageCache = new ImageFilesCache())
                    {
                        g.InterpolationMode = InterpolationMode.HighQualityBicubic;

                        for (int i = 0; i < ImageCount; i++)
                        {
                            string file = RandomFast.Pick(files);
                            Bitmap bmpCached = imageCache.GetImage(file);

                            if (bmpCached != null)
                            {
                                DrawImage(bmp, bmpCached, g);
                            }
                        }
                    }
                }
            }
        }

        private void DrawImage(Image img, Image img2, Graphics g)
        {
            int width, height;

            if (RandomSize)
            {
                int size = RandomFast.Next(Math.Min(RandomSizeMin, RandomSizeMax), Math.Max(RandomSizeMin, RandomSizeMax));
                width = size;
                height = size;

                if (img2.Width > img2.Height)
                {
                    height = (int)Math.Round(size * ((double)img2.Height / img2.Width));
                }
                else if (img2.Width < img2.Height)
                {
                    width = (int)Math.Round(size * ((double)img2.Width / img2.Height));
                }
            }
            else
            {
                width = img2.Width;
                height = img2.Height;
            }

            if (width < 1 || height < 1)
            {
                return;
            }

            int minOffsetX = EdgeOverlap ? -width + 1 : 0;
            int minOffsetY = EdgeOverlap ? -height + 1 : 0;
            int maxOffsetX = img.Width - (EdgeOverlap ? 0 : width) - 1;
            int maxOffsetY = img.Height - (EdgeOverlap ? 0 : height) - 1;

            Rectangle rect, overlapRect;
            int attemptCount = 0;

            do
            {
                attemptCount++;

                if (attemptCount > 1000)
                {
                    return;
                }

                int x = RandomFast.Next(Math.Min(minOffsetX, maxOffsetX), Math.Max(minOffsetX, maxOffsetX));
                int y = RandomFast.Next(Math.Min(minOffsetY, maxOffsetY), Math.Max(minOffsetY, maxOffsetY));
                rect = new Rectangle(x, y, width, height);

                overlapRect = rect.Offset(NoOverlapOffset);
            } while (NoOverlap && imageRectangles.Any(x => x.IntersectsWith(overlapRect)));

            imageRectangles.Add(rect);

            if (RandomAngle)
            {
                float moveX = rect.X + (rect.Width / 2f);
                float moveY = rect.Y + (rect.Height / 2f);
                int rotate = RandomFast.Next(Math.Min(RandomAngleMin, RandomAngleMax), Math.Max(RandomAngleMin, RandomAngleMax));

                g.TranslateTransform(moveX, moveY);
                g.RotateTransform(rotate);
                g.TranslateTransform(-moveX, -moveY);
            }

            g.PixelOffsetMode = PixelOffsetMode.Half;

            if (RandomOpacity)
            {
                float opacity = RandomFast.Next(Math.Min(RandomOpacityMin, RandomOpacityMax), Math.Max(RandomOpacityMin, RandomOpacityMax)).Clamp(0, 100) / 100f;

                ColorMatrix matrix = new ColorMatrix();
                matrix.Matrix33 = opacity;
                using (ImageAttributes attributes = new ImageAttributes())
                {
                    attributes.SetColorMatrix(matrix);
                    g.DrawImage(img2, rect, 0, 0, img2.Width, img2.Height, GraphicsUnit.Pixel, attributes);
                }
            }
            else
            {
                g.DrawImage(img2, rect);
            }

            if (RandomAngle)
            {
                g.ResetTransform();
            }

            g.PixelOffsetMode = PixelOffsetMode.Default;
        }

        protected override string GetSummary()
        {
            if (!string.IsNullOrEmpty(ImageFolder))
            {
                return FileHelpers.GetFileNameSafe(ImageFolder);
            }

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: DrawText.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Drawings/DrawText.cs

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
using System.Drawing.Text;
using System.Linq;
using System.Windows.Forms;

namespace ShareX.ImageEffectsLib
{
    [Description("Text watermark")]
    public class DrawText : ImageEffect
    {
        [DefaultValue("Text watermark"), Editor(typeof(NameParserEditor), typeof(UITypeEditor))]
        public string Text { get; set; }

        [DefaultValue(ContentAlignment.BottomRight), TypeConverter(typeof(EnumProperNameConverter))]
        public ContentAlignment Placement { get; set; }

        [DefaultValue(typeof(Point), "5, 5")]
        public Point Offset { get; set; }

        [DefaultValue(false), Description("If text watermark size bigger than source image then don't draw it.")]
        public bool AutoHide { get; set; }

        private FontSafe textFontSafe = new FontSafe();

        // Workaround for "System.AccessViolationException: Attempted to read or write protected memory. This is often an indication that other memory is corrupt."
        [DefaultValue(typeof(Font), "Arial, 11.25pt")]
        public Font TextFont
        {
            get
            {
                return textFontSafe.GetFont();
            }
            set
            {
                using (value)
                {
                    textFontSafe.SetFont(value);
                }
            }
        }

        [DefaultValue(TextRenderingHint.SystemDefault), TypeConverter(typeof(EnumProperNameConverter))]
        public TextRenderingHint TextRenderingMode { get; set; }

        [DefaultValue(typeof(Color), "235, 235, 235"), Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color TextColor { get; set; }

        [DefaultValue(true)]
        public bool DrawTextShadow { get; set; }

        [DefaultValue(typeof(Color), "Black"), Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color TextShadowColor { get; set; }

        [DefaultValue(typeof(Point), "-1, -1")]
        public Point TextShadowOffset { get; set; }

        private int cornerRadius;

        [DefaultValue(4)]
        public int CornerRadius
        {
            get
            {
                return cornerRadius;
            }
            set
            {
                cornerRadius = value.Max(0);
            }
        }

        [DefaultValue(typeof(Padding), "5, 5, 5, 5")]
        public Padding Padding { get; set; }

        [DefaultValue(true)]
        public bool DrawBorder { get; set; }

        [DefaultValue(typeof(Color), "Black"), Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color BorderColor { get; set; }

        [DefaultValue(1)]
        public int BorderSize { get; set; }

        [DefaultValue(true)]
        public bool DrawBackground { get; set; }

        [DefaultValue(typeof(Color), "42, 47, 56"), Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color BackgroundColor { get; set; }

        [DefaultValue(false)]
        public bool UseGradient { get; set; }

        [Editor(typeof(GradientEditor), typeof(UITypeEditor))]
        public GradientInfo Gradient { get; set; }

        public DrawText()
        {
            this.ApplyDefaultPropertyValues();
            AddDefaultGradient();
        }

        private void AddDefaultGradient()
        {
            Gradient = new GradientInfo();
            Gradient.Colors.Add(new GradientStop(Color.FromArgb(68, 120, 194), 0f));
            Gradient.Colors.Add(new GradientStop(Color.FromArgb(13, 58, 122), 50f));
            Gradient.Colors.Add(new GradientStop(Color.FromArgb(6, 36, 78), 50f));
            Gradient.Colors.Add(new GradientStop(Color.FromArgb(23, 89, 174), 100f));
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            if (string.IsNullOrEmpty(Text))
            {
                return bmp;
            }

            using (Font textFont = TextFont)
            {
                if (textFont == null || textFont.Size < 1)
                {
                    return bmp;
                }

                NameParser parser = new NameParser(NameParserType.Text);

                if (bmp != null)
                {
                    parser.ImageWidth = bmp.Width;
                    parser.ImageHeight = bmp.Height;
                }

                string parsedText = parser.Parse(Text);

                Size textSize = Helpers.MeasureText(parsedText, textFont);
                Size watermarkSize = new Size(Padding.Left + textSize.Width + Padding.Right, Padding.Top + textSize.Height + Padding.Bottom);
                Point watermarkPosition = Helpers.GetPosition(Placement, Offset, bmp.Size, watermarkSize);
                Rectangle watermarkRectangle = new Rectangle(watermarkPosition, watermarkSize);

                if (AutoHide && !new Rectangle(0, 0, bmp.Width, bmp.Height).Contains(watermarkRectangle))
                {
                    return bmp;
                }

                using (Graphics g = Graphics.FromImage(bmp))
                {
                    g.SmoothingMode = SmoothingMode.HighQuality;

                    using (GraphicsPath gp = new GraphicsPath())
                    {
                        gp.AddRoundedRectangleProper(watermarkRectangle, CornerRadius);

                        if (DrawBackground)
                        {
                            Brush backgroundBrush = null;

                            try
                            {
                                if (UseGradient && Gradient != null && Gradient.IsValid)
                                {
                                    backgroundBrush = Gradient.GetGradientBrush(watermarkRectangle);
                                }
                                else
                                {
                                    backgroundBrush = new SolidBrush(BackgroundColor);
                                }

                                g.FillPath(backgroundBrush, gp);
                            }
                            finally
                            {
                                if (backgroundBrush != null) backgroundBrush.Dispose();
                            }
                        }

                        if (DrawBorder)
                        {
                            int borderSize = BorderSize.Max(1);

                            if (borderSize.IsEvenNumber())
                            {
                                g.PixelOffsetMode = PixelOffsetMode.Half;
                            }

                            using (Pen borderPen = new Pen(BorderColor, borderSize))
                            {
                                g.DrawPath(borderPen, gp);
                            }

                            g.PixelOffsetMode = PixelOffsetMode.Default;
                        }
                    }

                    g.TextRenderingHint = TextRenderingMode;

                    if (DrawTextShadow)
                    {
                        using (Brush textShadowBrush = new SolidBrush(TextShadowColor))
                        {
                            g.DrawString(parsedText, textFont, textShadowBrush, watermarkRectangle.X + Padding.Left + TextShadowOffset.X,
                                watermarkRectangle.Y + Padding.Top + TextShadowOffset.Y);
                        }
                    }

                    using (Brush textBrush = new SolidBrush(TextColor))
                    {
                        g.DrawString(parsedText, textFont, textBrush, watermarkRectangle.X + Padding.Left, watermarkRectangle.Y + Padding.Top);
                    }
                }
            }

            return bmp;
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

````
