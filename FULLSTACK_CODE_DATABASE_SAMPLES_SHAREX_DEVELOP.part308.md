---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 308
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 308 of 650)

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

---[FILE: ClipboardHelpersEx.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Helpers/ClipboardHelpersEx.cs

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
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    internal class ClipboardHelpersEx
    {
        // Source: https://stackoverflow.com/a/46424800/264877

        /// <summary>
        /// Copies the given image to the clipboard as PNG, DIB and standard Bitmap format.
        /// </summary>
        /// <param name="image">Image to put on the clipboard.</param>
        /// <param name="imageNoTr">Optional specifically nontransparent version of the image to put on the clipboard.</param>
        /// <param name="data">Clipboard data object to put the image into. Might already contain other stuff. Leave null to create a new one.</param>
        public static void SetClipboardImage(Bitmap image, Bitmap imageNoTr, DataObject data)
        {
            Clipboard.Clear();
            if (data == null)
                data = new DataObject();
            if (imageNoTr == null)
                imageNoTr = image;
            using (MemoryStream pngMemStream = new MemoryStream())
            using (MemoryStream dibMemStream = new MemoryStream())
            {
                // As standard bitmap, without transparency support
                data.SetData(DataFormats.Bitmap, true, imageNoTr);
                // As PNG. Gimp will prefer this over the other two.
                image.Save(pngMemStream, ImageFormat.Png);
                data.SetData("PNG", false, pngMemStream);
                // As DIB. This is (wrongly) accepted as ARGB by many applications.
                byte[] dibData = ConvertToDib(image);
                dibMemStream.Write(dibData, 0, dibData.Length);
                data.SetData(DataFormats.Dib, false, dibMemStream);
                // The 'copy=true' argument means the MemoryStreams can be safely disposed after the operation.
                Clipboard.SetDataObject(data, true);
            }
        }

        /// <summary>
        /// Converts the image to Device Independent Bitmap format of type BITFIELDS.
        /// This is (wrongly) accepted by many applications as containing transparency,
        /// so I'm abusing it for that.
        /// </summary>
        /// <param name="image">Image to convert to DIB</param>
        /// <returns>The image converted to DIB, in bytes.</returns>
        public static byte[] ConvertToDib(Image image)
        {
            byte[] bm32bData;
            int width = image.Width;
            int height = image.Height;
            // Ensure image is 32bppARGB by painting it on a new 32bppARGB image.
            using (Bitmap bm32b = new Bitmap(image.Width, image.Height, PixelFormat.Format32bppPArgb))
            {
                using (Graphics gr = Graphics.FromImage(bm32b))
                    gr.DrawImage(image, new Rectangle(0, 0, bm32b.Width, bm32b.Height));
                // Bitmap format has its lines reversed.
                bm32b.RotateFlip(RotateFlipType.Rotate180FlipX);
                bm32bData = GetImageData(bm32b, out int stride);
            }
            // BITMAPINFOHEADER struct for DIB.
            int hdrSize = 0x28;
            byte[] fullImage = new byte[hdrSize + 12 + bm32bData.Length];
            //Int32 biSize;
            WriteIntToByteArray(fullImage, 0x00, 4, true, (uint)hdrSize);
            //Int32 biWidth;
            WriteIntToByteArray(fullImage, 0x04, 4, true, (uint)width);
            //Int32 biHeight;
            WriteIntToByteArray(fullImage, 0x08, 4, true, (uint)height);
            //Int16 biPlanes;
            WriteIntToByteArray(fullImage, 0x0C, 2, true, 1);
            //Int16 biBitCount;
            WriteIntToByteArray(fullImage, 0x0E, 2, true, 32);
            //BITMAPCOMPRESSION biCompression = BITMAPCOMPRESSION.BITFIELDS;
            WriteIntToByteArray(fullImage, 0x10, 4, true, 3);
            //Int32 biSizeImage;
            WriteIntToByteArray(fullImage, 0x14, 4, true, (uint)bm32bData.Length);
            // These are all 0. Since .net clears new arrays, don't bother writing them.
            //Int32 biXPelsPerMeter = 0;
            //Int32 biYPelsPerMeter = 0;
            //Int32 biClrUsed = 0;
            //Int32 biClrImportant = 0;

            // The aforementioned "BITFIELDS": colour masks applied to the Int32 pixel value to get the R, G and B values.
            WriteIntToByteArray(fullImage, hdrSize + 0, 4, true, 0x00FF0000);
            WriteIntToByteArray(fullImage, hdrSize + 4, 4, true, 0x0000FF00);
            WriteIntToByteArray(fullImage, hdrSize + 8, 4, true, 0x000000FF);
            Array.Copy(bm32bData, 0, fullImage, hdrSize + 12, bm32bData.Length);
            return fullImage;
        }

        /// <summary>
        /// Retrieves an image from the given clipboard data object, in the order PNG, DIB, Bitmap, Image object.
        /// </summary>
        /// <param name="retrievedData">The clipboard data.</param>
        /// <returns>The extracted image, or null if no supported image type was found.</returns>
        public static Bitmap GetClipboardImage(DataObject retrievedData)
        {
            Bitmap clipboardimage = null;
            // Order: try PNG, move on to try 32-bit ARGB DIB, then try the normal Bitmap and Image types.
            if (retrievedData.GetDataPresent("PNG", false) && retrievedData.GetData("PNG", false) is MemoryStream pngStream)
            {
                using (Bitmap bm = new Bitmap(pngStream))
                {
                    clipboardimage = CloneImage(bm);
                }
            }
            if (clipboardimage == null && retrievedData.GetDataPresent(DataFormats.Dib, false) && retrievedData.GetData(DataFormats.Dib, false) is MemoryStream dib)
            {
                clipboardimage = ImageFromClipboardDib(dib.ToArray());
            }
            if (clipboardimage == null && retrievedData.GetDataPresent(DataFormats.Bitmap))
                clipboardimage = new Bitmap(retrievedData.GetData(DataFormats.Bitmap) as Image);
            if (clipboardimage == null && retrievedData.GetDataPresent(typeof(Image)))
                clipboardimage = new Bitmap(retrievedData.GetData(typeof(Image)) as Image);
            return clipboardimage;
        }

        public static Bitmap ImageFromClipboardDib(byte[] dibBytes)
        {
            if (dibBytes == null || dibBytes.Length < 4)
                return null;
            try
            {
                int headerSize = (int)ReadIntFromByteArray(dibBytes, 0, 4, true);
                // Only supporting 40-byte DIB from clipboard
                if (headerSize != 40)
                    return null;
                byte[] header = new byte[40];
                Array.Copy(dibBytes, header, 40);
                int imageIndex = headerSize;
                int width = (int)ReadIntFromByteArray(header, 0x04, 4, true);
                int height = (int)ReadIntFromByteArray(header, 0x08, 4, true);
                short planes = (short)ReadIntFromByteArray(header, 0x0C, 2, true);
                short bitCount = (short)ReadIntFromByteArray(header, 0x0E, 2, true);
                //Compression: 0 = RGB; 3 = BITFIELDS.
                int compression = (int)ReadIntFromByteArray(header, 0x10, 4, true);
                // Not dealing with non-standard formats.
                if (planes != 1 || (compression != 0 && compression != 3))
                    return null;
                PixelFormat fmt;
                switch (bitCount)
                {
                    case 32:
                        fmt = PixelFormat.Format32bppRgb;
                        break;
                    case 24:
                        fmt = PixelFormat.Format24bppRgb;
                        break;
                    case 16:
                        fmt = PixelFormat.Format16bppRgb555;
                        break;
                    default:
                        return null;
                }
                if (compression == 3)
                    imageIndex += 12;
                if (dibBytes.Length < imageIndex)
                    return null;
                byte[] image = new byte[dibBytes.Length - imageIndex];
                Array.Copy(dibBytes, imageIndex, image, 0, image.Length);
                // Classic stride: fit within blocks of 4 bytes.
                int stride = (((((bitCount * width) + 7) / 8) + 3) / 4) * 4;
                if (compression == 3)
                {
                    uint redMask = ReadIntFromByteArray(dibBytes, headerSize + 0, 4, true);
                    uint greenMask = ReadIntFromByteArray(dibBytes, headerSize + 4, 4, true);
                    uint blueMask = ReadIntFromByteArray(dibBytes, headerSize + 8, 4, true);
                    // Fix for the undocumented use of 32bppARGB disguised as BITFIELDS. Despite lacking an alpha bit field,
                    // the alpha bytes are still filled in, without any header indication of alpha usage.
                    // Pure 32-bit RGB: check if a switch to ARGB can be made by checking for non-zero alpha.
                    // Admitted, this may give a mess if the alpha bits simply aren't cleared, but why the hell wouldn't it use 24bpp then?
                    if (bitCount == 32 && redMask == 0xFF0000 && greenMask == 0x00FF00 && blueMask == 0x0000FF)
                    {
                        // Stride is always a multiple of 4; no need to take it into account for 32bpp.
                        for (int pix = 3; pix < image.Length; pix += 4)
                        {
                            // 0 can mean transparent, but can also mean the alpha isn't filled in, so only check for non-zero alpha,
                            // which would indicate there is actual data in the alpha bytes.
                            if (image[pix] == 0)
                                continue;
                            fmt = PixelFormat.Format32bppPArgb;
                            break;
                        }
                    }
                    else
                        // Could be supported with a system that parses the colour masks,
                        // but I don't think the clipboard ever uses these anyway.
                        return null;
                }
                Bitmap bitmap = BuildImage(image, width, height, stride, fmt, null, null);
                // This is bmp; reverse image lines.
                bitmap.RotateFlip(RotateFlipType.Rotate180FlipX);
                return bitmap;
            }
            catch
            {
                return null;
            }
        }

        public static void WriteIntToByteArray(byte[] data, int startIndex, int bytes, bool littleEndian, uint value)
        {
            int lastByte = bytes - 1;
            if (data.Length < startIndex + bytes)
                throw new ArgumentOutOfRangeException("startIndex", "Data array is too small to write a " + bytes + "-byte value at offset " + startIndex + ".");
            for (int index = 0; index < bytes; index++)
            {
                int offs = startIndex + (littleEndian ? index : lastByte - index);
                data[offs] = (byte)(value >> (8 * index) & 0xFF);
            }
        }

        public static uint ReadIntFromByteArray(byte[] data, int startIndex, int bytes, bool littleEndian)
        {
            int lastByte = bytes - 1;
            if (data.Length < startIndex + bytes)
                throw new ArgumentOutOfRangeException("startIndex", "Data array is too small to read a " + bytes + "-byte value at offset " + startIndex + ".");
            uint value = 0;
            for (int index = 0; index < bytes; index++)
            {
                int offs = startIndex + (littleEndian ? index : lastByte - index);
                value += (uint)(data[offs] << (8 * index));
            }
            return value;
        }

        /// <summary>
        /// Gets the raw bytes from an image.
        /// </summary>
        /// <param name="sourceImage">The image to get the bytes from.</param>
        /// <param name="stride">Stride of the retrieved image data.</param>
        /// <returns>The raw bytes of the image</returns>
        public static byte[] GetImageData(Bitmap sourceImage, out int stride)
        {
            BitmapData sourceData = sourceImage.LockBits(new Rectangle(0, 0, sourceImage.Width, sourceImage.Height), ImageLockMode.ReadOnly, sourceImage.PixelFormat);
            stride = sourceData.Stride;
            byte[] data = new byte[stride * sourceImage.Height];
            Marshal.Copy(sourceData.Scan0, data, 0, data.Length);
            sourceImage.UnlockBits(sourceData);
            return data;
        }

        /// <summary>
        /// Creates a bitmap based on data, width, height, stride and pixel format.
        /// </summary>
        /// <param name="sourceData">Byte array of raw source data</param>
        /// <param name="width">Width of the image</param>
        /// <param name="height">Height of the image</param>
        /// <param name="stride">Scanline length inside the data</param>
        /// <param name="pixelFormat">Pixel format</param>
        /// <param name="palette">Color palette</param>
        /// <param name="defaultColor">Default color to fill in on the palette if the given colors don't fully fill it.</param>
        /// <returns>The new image</returns>
        public static Bitmap BuildImage(byte[] sourceData, int width, int height, int stride, PixelFormat pixelFormat, Color[] palette, Color? defaultColor)
        {
            Bitmap newImage = new Bitmap(width, height, pixelFormat);
            BitmapData targetData = newImage.LockBits(new Rectangle(0, 0, width, height), ImageLockMode.WriteOnly, newImage.PixelFormat);
            int newDataWidth = ((Image.GetPixelFormatSize(pixelFormat) * width) + 7) / 8;
            // Compensate for possible negative stride on BMP format.
            bool isFlipped = stride < 0;
            stride = Math.Abs(stride);
            // Cache these to avoid unnecessary getter calls.
            int targetStride = targetData.Stride;
            long scan0 = targetData.Scan0.ToInt64();
            for (int y = 0; y < height; y++)
                Marshal.Copy(sourceData, y * stride, new IntPtr(scan0 + (y * targetStride)), newDataWidth);
            newImage.UnlockBits(targetData);
            // Fix negative stride on BMP format.
            if (isFlipped)
                newImage.RotateFlip(RotateFlipType.Rotate180FlipX);
            // For indexed images, set the palette.
            if ((pixelFormat & PixelFormat.Indexed) != 0 && palette != null)
            {
                ColorPalette pal = newImage.Palette;
                for (int i = 0; i < pal.Entries.Length; i++)
                {
                    if (i < palette.Length)
                        pal.Entries[i] = palette[i];
                    else if (defaultColor.HasValue)
                        pal.Entries[i] = defaultColor.Value;
                    else
                        break;
                }
                newImage.Palette = pal;
            }
            return newImage;
        }

        /// <summary>
        /// Clones an image object to free it from any backing resources.
        /// Code taken from http://stackoverflow.com/a/3661892/ with some extra fixes.
        /// </summary>
        /// <param name="sourceImage">The image to clone</param>
        /// <returns>The cloned image</returns>
        public static Bitmap CloneImage(Bitmap sourceImage)
        {
            Rectangle rect = new Rectangle(0, 0, sourceImage.Width, sourceImage.Height);
            Bitmap targetImage = new Bitmap(rect.Width, rect.Height, sourceImage.PixelFormat);
            targetImage.SetResolution(sourceImage.HorizontalResolution, sourceImage.VerticalResolution);
            BitmapData sourceData = sourceImage.LockBits(rect, ImageLockMode.ReadOnly, sourceImage.PixelFormat);
            BitmapData targetData = targetImage.LockBits(rect, ImageLockMode.WriteOnly, targetImage.PixelFormat);
            int actualDataWidth = ((Image.GetPixelFormatSize(sourceImage.PixelFormat) * rect.Width) + 7) / 8;
            int h = sourceImage.Height;
            int origStride = sourceData.Stride;
            bool isFlipped = origStride < 0;
            origStride = Math.Abs(origStride); // Fix for negative stride in BMP format.
            int targetStride = targetData.Stride;
            byte[] imageData = new byte[actualDataWidth];
            IntPtr sourcePos = sourceData.Scan0;
            IntPtr destPos = targetData.Scan0;
            // Copy line by line, skipping by stride but copying actual data width
            for (int y = 0; y < h; y++)
            {
                Marshal.Copy(sourcePos, imageData, 0, actualDataWidth);
                Marshal.Copy(imageData, 0, destPos, actualDataWidth);
                sourcePos = new IntPtr(sourcePos.ToInt64() + origStride);
                destPos = new IntPtr(destPos.ToInt64() + targetStride);
            }
            targetImage.UnlockBits(targetData);
            sourceImage.UnlockBits(sourceData);
            // Fix for negative stride on BMP format.
            if (isFlipped)
                targetImage.RotateFlip(RotateFlipType.Rotate180FlipX);
            // For indexed images, restore the palette. This is not linking to a referenced
            // object in the original image; the getter of Palette creates a new object when called.
            if ((sourceImage.PixelFormat & PixelFormat.Indexed) != 0)
                targetImage.Palette = sourceImage.Palette;
            // Restore DPI settings
            targetImage.SetResolution(sourceImage.HorizontalResolution, sourceImage.VerticalResolution);
            return targetImage;
        }

        public static Bitmap DIBV5ToBitmap(byte[] data)
        {
            GCHandle handle = GCHandle.Alloc(data, GCHandleType.Pinned);
            BITMAPV5HEADER bmi = (BITMAPV5HEADER)Marshal.PtrToStructure(handle.AddrOfPinnedObject(), typeof(BITMAPV5HEADER));
            int stride = -(int)(bmi.bV5SizeImage / bmi.bV5Height);
            long offset = bmi.bV5Size + ((bmi.bV5Height - 1) * (int)(bmi.bV5SizeImage / bmi.bV5Height));
            if (bmi.bV5Compression == (uint)BitmapCompressionMode.BI_BITFIELDS)
            {
                offset += 12;
            }
            IntPtr scan0 = new IntPtr(handle.AddrOfPinnedObject().ToInt64() + offset);
            Bitmap bitmap = new Bitmap(bmi.bV5Width, bmi.bV5Height, stride, PixelFormat.Format32bppPArgb, scan0);
            handle.Free();
            return bitmap;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ColorHelpers.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Helpers/ColorHelpers.cs

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
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text.RegularExpressions;

namespace ShareX.HelpersLib
{
    public static class ColorHelpers
    {
        public static Color[] StandardColors = new Color[]
        {
            Color.FromArgb(0, 0, 0),
            Color.FromArgb(64, 64, 64),
            Color.FromArgb(255, 0, 0),
            Color.FromArgb(255, 106, 0),
            Color.FromArgb(255, 216, 0),
            Color.FromArgb(182, 255, 0),
            Color.FromArgb(76, 255, 0),
            Color.FromArgb(0, 255, 33),
            Color.FromArgb(0, 255, 144),
            Color.FromArgb(0, 255, 255),
            Color.FromArgb(0, 148, 255),
            Color.FromArgb(0, 38, 255),
            Color.FromArgb(72, 0, 255),
            Color.FromArgb(178, 0, 255),
            Color.FromArgb(255, 0, 220),
            Color.FromArgb(255, 0, 110),
            Color.FromArgb(255, 255, 255),
            Color.FromArgb(128, 128, 128),
            Color.FromArgb(127, 0, 0),
            Color.FromArgb(127, 51, 0),
            Color.FromArgb(127, 106, 0),
            Color.FromArgb(91, 127, 0),
            Color.FromArgb(38, 127, 0),
            Color.FromArgb(0, 127, 14),
            Color.FromArgb(0, 127, 70),
            Color.FromArgb(0, 127, 127),
            Color.FromArgb(0, 74, 127),
            Color.FromArgb(0, 19, 127),
            Color.FromArgb(33, 0, 127),
            Color.FromArgb(87, 0, 127),
            Color.FromArgb(127, 0, 110),
            Color.FromArgb(127, 0, 55)
        };

        #region Convert Color to ...

        public static string ColorToHex(Color color, ColorFormat format = ColorFormat.RGB)
        {
            switch (format)
            {
                default:
                case ColorFormat.RGB:
                    return string.Format("{0:X2}{1:X2}{2:X2}", color.R, color.G, color.B);
                case ColorFormat.RGBA:
                    return string.Format("{0:X2}{1:X2}{2:X2}{3:X2}", color.R, color.G, color.B, color.A);
                case ColorFormat.ARGB:
                    return string.Format("{0:X2}{1:X2}{2:X2}{3:X2}", color.A, color.R, color.G, color.B);
            }
        }

        public static int ColorToDecimal(Color color, ColorFormat format = ColorFormat.RGB)
        {
            switch (format)
            {
                default:
                case ColorFormat.RGB:
                    return color.R << 16 | color.G << 8 | color.B;
                case ColorFormat.RGBA:
                    return color.R << 24 | color.G << 16 | color.B << 8 | color.A;
                case ColorFormat.ARGB:
                    return color.A << 24 | color.R << 16 | color.G << 8 | color.B;
            }
        }

        public static HSB ColorToHSB(Color color)
        {
            HSB hsb = new HSB();

            int Max, Min;

            if (color.R > color.G)
            {
                Max = color.R;
                Min = color.G;
            }
            else
            {
                Max = color.G;
                Min = color.R;
            }

            if (color.B > Max) Max = color.B;
            else if (color.B < Min) Min = color.B;

            int Diff = Max - Min;

            hsb.Brightness = (double)Max / 255;

            if (Max == 0) hsb.Saturation = 0;
            else hsb.Saturation = (double)Diff / Max;

            double q;
            if (Diff == 0) q = 0;
            else q = (double)60 / Diff;

            if (Max == color.R)
            {
                if (color.G < color.B) hsb.Hue = (360 + (q * (color.G - color.B))) / 360;
                else hsb.Hue = q * (color.G - color.B) / 360;
            }
            else if (Max == color.G) hsb.Hue = (120 + (q * (color.B - color.R))) / 360;
            else if (Max == color.B) hsb.Hue = (240 + (q * (color.R - color.G))) / 360;
            else hsb.Hue = 0.0;

            hsb.Alpha = color.A;

            return hsb;
        }

        public static CMYK ColorToCMYK(Color color)
        {
            if (color.R == 0 && color.G == 0 && color.B == 0)
            {
                return new CMYK(0, 0, 0, 1, color.A);
            }

            double c = 1 - (color.R / 255d);
            double m = 1 - (color.G / 255d);
            double y = 1 - (color.B / 255d);
            double k = Math.Min(c, Math.Min(m, y));

            c = (c - k) / (1 - k);
            m = (m - k) / (1 - k);
            y = (y - k) / (1 - k);

            return new CMYK(c, m, y, k, color.A);
        }

        #endregion Convert Color to ...

        #region Convert Hex to ...

        public static Color HexToColor(string hex, ColorFormat format = ColorFormat.RGB)
        {
            if (string.IsNullOrEmpty(hex))
            {
                return Color.Empty;
            }

            if (hex[0] == '#')
            {
                hex = hex.Remove(0, 1);
            }
            else if (hex.StartsWith("0x", StringComparison.OrdinalIgnoreCase))
            {
                hex = hex.Remove(0, 2);
            }

            if (((format == ColorFormat.RGBA || format == ColorFormat.ARGB) && hex.Length != 8) ||
                (format == ColorFormat.RGB && hex.Length != 6))
            {
                return Color.Empty;
            }

            int r, g, b, a;

            switch (format)
            {
                default:
                case ColorFormat.RGB:
                    r = HexToDecimal(hex.Substring(0, 2));
                    g = HexToDecimal(hex.Substring(2, 2));
                    b = HexToDecimal(hex.Substring(4, 2));
                    a = 255;
                    break;
                case ColorFormat.RGBA:
                    r = HexToDecimal(hex.Substring(0, 2));
                    g = HexToDecimal(hex.Substring(2, 2));
                    b = HexToDecimal(hex.Substring(4, 2));
                    a = HexToDecimal(hex.Substring(6, 2));
                    break;
                case ColorFormat.ARGB:
                    a = HexToDecimal(hex.Substring(0, 2));
                    r = HexToDecimal(hex.Substring(2, 2));
                    g = HexToDecimal(hex.Substring(4, 2));
                    b = HexToDecimal(hex.Substring(6, 2));
                    break;
            }

            return Color.FromArgb(a, r, g, b);
        }

        public static int HexToDecimal(string hex)
        {
            return Convert.ToInt32(hex, 16);
        }

        #endregion Convert Hex to ...

        #region Convert Decimal to ...

        public static Color DecimalToColor(int dec, ColorFormat format = ColorFormat.RGB)
        {
            switch (format)
            {
                default:
                case ColorFormat.RGB:
                    return Color.FromArgb((dec >> 16) & 0xFF, (dec >> 8) & 0xFF, dec & 0xFF);
                case ColorFormat.RGBA:
                    return Color.FromArgb(dec & 0xFF, (dec >> 24) & 0xFF, (dec >> 16) & 0xFF, (dec >> 8) & 0xFF);
                case ColorFormat.ARGB:
                    return Color.FromArgb((dec >> 24) & 0xFF, (dec >> 16) & 0xFF, (dec >> 8) & 0xFF, dec & 0xFF);
            }
        }

        public static string DecimalToHex(int dec)
        {
            return dec.ToString("X6");
        }

        #endregion Convert Decimal to ...

        #region Convert HSB to ...

        public static Color HSBToColor(HSB hsb)
        {
            int Mid;
            int Max = (int)Math.Round(hsb.Brightness * 255);
            int Min = (int)Math.Round((1.0 - hsb.Saturation) * (hsb.Brightness / 1.0) * 255);
            double q = (double)(Max - Min) / 255;

            if (hsb.Hue >= 0 && hsb.Hue <= (double)1 / 6)
            {
                Mid = (int)Math.Round((((hsb.Hue - 0) * q) * 1530) + Min);
                return Color.FromArgb(hsb.Alpha, Max, Mid, Min);
            }

            if (hsb.Hue <= (double)1 / 3)
            {
                Mid = (int)Math.Round((-((hsb.Hue - ((double)1 / 6)) * q) * 1530) + Max);
                return Color.FromArgb(hsb.Alpha, Mid, Max, Min);
            }

            if (hsb.Hue <= 0.5)
            {
                Mid = (int)Math.Round((((hsb.Hue - ((double)1 / 3)) * q) * 1530) + Min);
                return Color.FromArgb(hsb.Alpha, Min, Max, Mid);
            }

            if (hsb.Hue <= (double)2 / 3)
            {
                Mid = (int)Math.Round((-((hsb.Hue - 0.5) * q) * 1530) + Max);
                return Color.FromArgb(hsb.Alpha, Min, Mid, Max);
            }

            if (hsb.Hue <= (double)5 / 6)
            {
                Mid = (int)Math.Round((((hsb.Hue - ((double)2 / 3)) * q) * 1530) + Min);
                return Color.FromArgb(hsb.Alpha, Mid, Min, Max);
            }

            if (hsb.Hue <= 1.0)
            {
                Mid = (int)Math.Round((-((hsb.Hue - ((double)5 / 6)) * q) * 1530) + Max);
                return Color.FromArgb(hsb.Alpha, Max, Min, Mid);
            }

            return Color.FromArgb(hsb.Alpha, 0, 0, 0);
        }

        #endregion Convert HSB to ...

        #region Convert CMYK to ...

        public static Color CMYKToColor(CMYK cmyk)
        {
            if (cmyk.Cyan == 0 && cmyk.Magenta == 0 && cmyk.Yellow == 0 && cmyk.Key == 1)
            {
                return Color.FromArgb(cmyk.Alpha, 0, 0, 0);
            }

            double c = (cmyk.Cyan * (1 - cmyk.Key)) + cmyk.Key;
            double m = (cmyk.Magenta * (1 - cmyk.Key)) + cmyk.Key;
            double y = (cmyk.Yellow * (1 - cmyk.Key)) + cmyk.Key;

            int r = (int)Math.Round((1 - c) * 255);
            int g = (int)Math.Round((1 - m) * 255);
            int b = (int)Math.Round((1 - y) * 255);

            return Color.FromArgb(cmyk.Alpha, r, g, b);
        }

        #endregion Convert CMYK to ...

        public static double ValidColor(double number)
        {
            return number.Clamp(0, 1);
        }

        public static int ValidColor(int number)
        {
            return number.Clamp(0, 255);
        }

        public static byte ValidColor(byte number)
        {
            return number.Clamp<byte>(0, 255);
        }

        public static Color RandomColor()
        {
            return Color.FromArgb(RandomFast.Next(255), RandomFast.Next(255), RandomFast.Next(255));
        }

        public static bool ParseColor(string text, out Color color)
        {
            if (!string.IsNullOrEmpty(text))
            {
                text = text.Trim();

                if (text.Length <= 20)
                {
                    Match matchHex = Regex.Match(text, @"^(?:#|0x)?((?:[0-9A-F]{2}){3})$", RegexOptions.IgnoreCase);

                    if (matchHex.Success)
                    {
                        color = HexToColor(matchHex.Groups[1].Value);
                        return true;
                    }
                    else
                    {
                        Match matchRGB = Regex.Match(text, @"^(?:rgb\()?([1]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])(?:\s|,)+([1]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])(?:\s|,)+([1]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\)?$");

                        if (matchRGB.Success)
                        {
                            color = Color.FromArgb(int.Parse(matchRGB.Groups[1].Value), int.Parse(matchRGB.Groups[2].Value), int.Parse(matchRGB.Groups[3].Value));
                            return true;
                        }
                    }
                }
            }

            color = Color.Empty;
            return false;
        }

        public static int PerceivedBrightness(Color color)
        {
            return (int)Math.Sqrt((color.R * color.R * .299) + (color.G * color.G * .587) + (color.B * color.B * .114));
        }

        public static Color VisibleColor(Color color)
        {
            return VisibleColor(color, Color.White, Color.Black);
        }

        public static Color VisibleColor(Color color, Color lightColor, Color darkColor)
        {
            if (IsLightColor(color))
            {
                return darkColor;
            }

            return lightColor;
        }

        public static bool IsLightColor(Color color)
        {
            return PerceivedBrightness(color) > 130;
        }

        public static bool IsDarkColor(Color color)
        {
            return !IsLightColor(color);
        }

        public static Color Lerp(Color from, Color to, float amount)
        {
            return Color.FromArgb((int)MathHelpers.Lerp(from.R, to.R, amount), (int)MathHelpers.Lerp(from.G, to.G, amount), (int)MathHelpers.Lerp(from.B, to.B, amount));
        }

        public static Color DeterministicStringToColor(string text)
        {
            int hash = text.GetHashCode();
            int r = (hash & 0xFF0000) >> 16;
            int g = (hash & 0x00FF00) >> 8;
            int b = hash & 0x0000FF;
            return Color.FromArgb(r, g, b);
        }

        public static int ColorDifference(Color color1, Color color2)
        {
            int rDiff = Math.Abs(color1.R - color2.R);
            int gDiff = Math.Abs(color1.G - color2.G);
            int bDiff = Math.Abs(color1.B - color2.B);
            return rDiff + gDiff + bDiff;
        }

        public static bool ColorsAreClose(Color color1, Color color2, int threshold)
        {
            return ColorDifference(color1, color2) <= threshold;
        }

        public static Color LighterColor(Color color, float amount)
        {
            return Lerp(color, Color.White, amount);
        }

        public static Color DarkerColor(Color color, float amount)
        {
            return Lerp(color, Color.Black, amount);
        }

        public static List<Color> GetKnownColors()
        {
            List<Color> colors = new List<Color>();

            for (KnownColor knownColor = KnownColor.AliceBlue; knownColor <= KnownColor.YellowGreen; knownColor++)
            {
                Color color = Color.FromKnownColor(knownColor);
                colors.Add(color);
            }

            return colors;
        }

        public static Color FindClosestKnownColor(Color color)
        {
            List<Color> colors = GetKnownColors();
            return colors.Aggregate(Color.Black, (accu, curr) => ColorDifference(color, curr) < ColorDifference(color, accu) ? curr : accu);
        }

        public static string GetColorName(Color color)
        {
            Color knownColor = FindClosestKnownColor(color);
            return Helpers.GetProperName(knownColor.Name);
        }
    }
}
```

--------------------------------------------------------------------------------

````
