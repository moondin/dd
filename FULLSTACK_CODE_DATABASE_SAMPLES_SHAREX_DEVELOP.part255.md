---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 255
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 255 of 650)

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

---[FILE: GraphicsExtensions.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Extensions/GraphicsExtensions.cs

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
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public static class GraphicsExtensions
    {
        public static void DrawRectangleProper(this Graphics g, Pen pen, RectangleF rect)
        {
            if (pen.Width == 1)
            {
                rect = rect.SizeOffset(-1);
            }

            if (rect.Width > 0 && rect.Height > 0)
            {
                g.DrawRectangle(pen, rect.X, rect.Y, rect.Width, rect.Height);
            }
        }

        public static void DrawRectangleProper(this Graphics g, Pen pen, int x, int y, int width, int height)
        {
            DrawRectangleProper(g, pen, new Rectangle(x, y, width, height));
        }

        public static void DrawRectangleShadow(this Graphics g, Rectangle rect, Color shadowColor, int shadowDepth, int shadowMaxAlpha, int shadowMinAlpha, Padding shadowDirection)
        {
            for (int i = 0; i < shadowDepth; i++)
            {
                int currentAlpha = (int)MathHelpers.Lerp(shadowMaxAlpha, shadowMinAlpha, (float)i / (shadowDepth - 1));

                if (currentAlpha > 0)
                {
                    using (Pen pen = new Pen(Color.FromArgb(currentAlpha, shadowColor)))
                    {
                        Rectangle shadowRect = new Rectangle(rect.X + (-shadowDirection.Left * i), rect.Y + (-shadowDirection.Top * i),
                            rect.Width + ((shadowDirection.Left + shadowDirection.Right) * i), rect.Height + ((shadowDirection.Top + shadowDirection.Bottom) * i));

                        g.DrawRectangleProper(pen, shadowRect);
                    }
                }
            }
        }

        public static void DrawRoundedRectangle(this Graphics g, Pen pen, RectangleF rect, float radius)
        {
            g.DrawRoundedRectangle(null, pen, rect, radius);
        }

        public static void DrawRoundedRectangle(this Graphics g, Brush brush, RectangleF rect, float radius)
        {
            g.DrawRoundedRectangle(brush, null, rect, radius);
        }

        public static void DrawRoundedRectangle(this Graphics g, Brush brush, Pen pen, int x, int y, int width, int height, float radius)
        {
            DrawRoundedRectangle(g, brush, pen, new Rectangle(x, y, width, height), radius);
        }

        public static void DrawRoundedRectangle(this Graphics g, Brush brush, Pen pen, RectangleF rect, float radius)
        {
            using (GraphicsPath gp = new GraphicsPath())
            {
                gp.AddRoundedRectangleProper(rect, radius);
                if (brush != null) g.FillPath(brush, gp);
                if (pen != null) g.DrawPath(pen, gp);
            }
        }

        public static void FillRoundedRectangle(this Graphics g, Brush brush, int x, int y, int width, int height, float radius)
        {
            FillRoundedRectangle(g, brush, new Rectangle(x, y, width, height), radius);
        }

        public static void FillRoundedRectangle(this Graphics g, Brush brush, RectangleF rect, float radius)
        {
            if (rect.Width > 0 && rect.Height > 0)
            {
                using (GraphicsPath gp = new GraphicsPath())
                {
                    gp.AddRoundedRectangle(rect, radius);
                    g.FillPath(brush, gp);
                }
            }
        }

        public static void DrawCapsule(this Graphics g, Brush brush, RectangleF rect)
        {
            using (GraphicsPath gp = new GraphicsPath())
            {
                gp.AddCapsule(rect);
                g.FillPath(brush, gp);
            }
        }

        public static void DrawDiamond(this Graphics g, Pen pen, Rectangle rect)
        {
            using (GraphicsPath gp = new GraphicsPath())
            {
                gp.AddDiamond(rect);
                g.DrawPath(pen, gp);
            }
        }

        public static void DrawCross(this Graphics g, Pen pen, PointF center, int crossSize)
        {
            if (crossSize > 0)
            {
                // Horizontal
                g.DrawLine(pen, center.X - crossSize, center.Y, center.X + crossSize, center.Y);

                // Vertical
                g.DrawLine(pen, center.X, center.Y - crossSize, center.X, center.Y + crossSize);
            }
        }

        public static void DrawCrossRectangle(this Graphics g, Pen pen, RectangleF rect, int crossSize)
        {
            rect = rect.SizeOffset(-1);

            if (rect.Width > 0 && rect.Height > 0)
            {
                // Top
                g.DrawLine(pen, rect.X - crossSize, rect.Y, rect.Right + crossSize, rect.Y);

                // Right
                g.DrawLine(pen, rect.Right, rect.Y - crossSize, rect.Right, rect.Bottom + crossSize);

                // Bottom
                g.DrawLine(pen, rect.X - crossSize, rect.Bottom, rect.Right + crossSize, rect.Bottom);

                // Left
                g.DrawLine(pen, rect.X, rect.Y - crossSize, rect.X, rect.Bottom + crossSize);
            }
        }

        public static void DrawCornerLines(this Graphics g, RectangleF rect, Pen pen, int lineSize)
        {
            if (rect.Width <= lineSize * 2)
            {
                g.DrawLine(pen, rect.X, rect.Y, rect.Right - 1, rect.Y);
                g.DrawLine(pen, rect.X, rect.Bottom - 1, rect.Right - 1, rect.Bottom - 1);
            }
            else
            {
                // Top left
                g.DrawLine(pen, rect.X, rect.Y, rect.X + lineSize, rect.Y);

                // Top right
                g.DrawLine(pen, rect.Right - 1, rect.Y, rect.Right - 1 - lineSize, rect.Y);

                // Bottom left
                g.DrawLine(pen, rect.X, rect.Bottom - 1, rect.X + lineSize, rect.Bottom - 1);

                // Bottom right
                g.DrawLine(pen, rect.Right - 1, rect.Bottom - 1, rect.Right - 1 - lineSize, rect.Bottom - 1);
            }

            if (rect.Height <= lineSize * 2)
            {
                g.DrawLine(pen, rect.X, rect.Y, rect.X, rect.Bottom - 1);
                g.DrawLine(pen, rect.Right - 1, rect.Y, rect.Right - 1, rect.Bottom - 1);
            }
            else
            {
                // Top left
                g.DrawLine(pen, rect.X, rect.Y, rect.X, rect.Y + lineSize);

                // Top right
                g.DrawLine(pen, rect.Right - 1, rect.Y, rect.Right - 1, rect.Y + lineSize);

                // Bottom left
                g.DrawLine(pen, rect.X, rect.Bottom - 1, rect.X, rect.Bottom - 1 - lineSize);

                // Bottom right
                g.DrawLine(pen, rect.Right - 1, rect.Bottom - 1, rect.Right - 1, rect.Bottom - 1 - lineSize);
            }
        }

        public static void SetHighQuality(this Graphics g)
        {
            g.CompositingQuality = CompositingQuality.HighQuality;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.SmoothingMode = SmoothingMode.HighQuality;
        }

        public static void DrawTextWithOutline(this Graphics g, string text, PointF position, Font font, Color textColor, Color borderColor, int borderSize = 2)
        {
            SmoothingMode tempMode = g.SmoothingMode;

            g.SmoothingMode = SmoothingMode.HighQuality;

            using (GraphicsPath gp = new GraphicsPath())
            {
                using (StringFormat sf = new StringFormat())
                {
                    float emSize = g.DpiY * font.SizeInPoints / 72;
                    gp.AddString(text, font.FontFamily, (int)font.Style, emSize, position, sf);
                }

                if (borderSize > 0)
                {
                    using (Pen borderPen = new Pen(borderColor, borderSize) { LineJoin = LineJoin.Round })
                    {
                        g.DrawPath(borderPen, gp);
                    }
                }

                using (Brush textBrush = new SolidBrush(textColor))
                {
                    g.FillPath(textBrush, gp);
                }
            }

            g.SmoothingMode = tempMode;
        }

        public static void DrawTextWithShadow(this Graphics g, string text, PointF position, Font font, Brush textBrush, Brush shadowBrush)
        {
            DrawTextWithShadow(g, text, position, font, textBrush, shadowBrush, new Point(1, 1));
        }

        public static void DrawTextWithShadow(this Graphics g, string text, PointF position, Font font, Brush textBrush, Brush shadowBrush, Point shadowOffset)
        {
            g.DrawString(text, font, shadowBrush, position.X + shadowOffset.X, position.Y + shadowOffset.Y);
            g.DrawString(text, font, textBrush, position.X, position.Y);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: GraphicsPathExtensions.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Extensions/GraphicsPathExtensions.cs

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
using System.Drawing.Drawing2D;
using System.Reflection;
using System.Runtime.InteropServices;

namespace ShareX.HelpersLib
{
    public static class GraphicsPathExtensions
    {
        public static void AddRectangleProper(this GraphicsPath graphicsPath, RectangleF rect, float penWidth = 1)
        {
            if (penWidth == 1)
            {
                rect = new RectangleF(rect.X, rect.Y, rect.Width - 1, rect.Height - 1);
            }

            if (rect.Width > 0 && rect.Height > 0)
            {
                graphicsPath.AddRectangle(rect);
            }
        }

        public static void AddRoundedRectangleProper(this GraphicsPath graphicsPath, RectangleF rect, float radius, float penWidth = 1)
        {
            if (penWidth == 1)
            {
                rect = new RectangleF(rect.X, rect.Y, rect.Width - 1, rect.Height - 1);
            }

            if (rect.Width > 0 && rect.Height > 0)
            {
                graphicsPath.AddRoundedRectangle(rect, radius);
            }
        }

        public static void AddRoundedRectangle(this GraphicsPath gp, RectangleF rect, float radius)
        {
            if (radius <= 0f)
            {
                gp.AddRectangle(rect);
            }
            else
            {
                // If the corner radius is greater than or equal to
                // half the width, or height (whichever is shorter)
                // then return a capsule instead of a lozenge
                if (radius >= (Math.Min(rect.Width, rect.Height) / 2.0f))
                {
                    gp.AddCapsule(rect);
                }
                else
                {
                    // Create the arc for the rectangle sides and declare
                    // a graphics path object for the drawing
                    float diameter = radius * 2.0f;
                    SizeF size = new SizeF(diameter, diameter);
                    RectangleF arc = new RectangleF(rect.Location, size);

                    // Top left arc
                    gp.AddArc(arc, 180, 90);

                    // Top right arc
                    arc.X = rect.Right - diameter;
                    gp.AddArc(arc, 270, 90);

                    // Bottom right arc
                    arc.Y = rect.Bottom - diameter;
                    gp.AddArc(arc, 0, 90);

                    // Bottom left arc
                    arc.X = rect.Left;
                    gp.AddArc(arc, 90, 90);

                    gp.CloseFigure();
                }
            }
        }

        public static void AddCapsule(this GraphicsPath gp, RectangleF rect)
        {
            float diameter;
            RectangleF arc;

            try
            {
                if (rect.Width > rect.Height)
                {
                    // Horizontal capsule
                    diameter = rect.Height;
                    SizeF sizeF = new SizeF(diameter, diameter);
                    arc = new RectangleF(rect.Location, sizeF);
                    gp.AddArc(arc, 90, 180);
                    arc.X = rect.Right - diameter;
                    gp.AddArc(arc, 270, 180);
                }
                else if (rect.Width < rect.Height)
                {
                    // Vertical capsule
                    diameter = rect.Width;
                    SizeF sizeF = new SizeF(diameter, diameter);
                    arc = new RectangleF(rect.Location, sizeF);
                    gp.AddArc(arc, 180, 180);
                    arc.Y = rect.Bottom - diameter;
                    gp.AddArc(arc, 0, 180);
                }
                else
                {
                    // Circle
                    gp.AddEllipse(rect);
                }
            }
            catch
            {
                gp.AddEllipse(rect);
            }

            gp.CloseFigure();
        }

        public static void AddDiamond(this GraphicsPath graphicsPath, RectangleF rect)
        {
            PointF p1 = new PointF(rect.X + (rect.Width / 2.0f), rect.Y);
            PointF p2 = new PointF(rect.X + rect.Width, rect.Y + (rect.Height / 2.0f));
            PointF p3 = new PointF(rect.X + (rect.Width / 2.0f), rect.Y + rect.Height);
            PointF p4 = new PointF(rect.X, rect.Y + (rect.Height / 2.0f));

            graphicsPath.AddPolygon(new PointF[] { p1, p2, p3, p4 });
        }

        public static void AddPolygon(this GraphicsPath graphicsPath, RectangleF rect, int sideCount)
        {
            PointF[] points = new PointF[sideCount];

            float a = 0;

            for (int i = 0; i < sideCount; i++)
            {
                points[i] = new PointF(rect.X + ((rect.Width / 2.0f) * (float)Math.Cos(a)) + (rect.Width / 2.0f),
                    rect.Y + ((rect.Height / 2.0f) * (float)Math.Sin(a)) + (rect.Height / 2.0f));

                a += (float)Math.PI * 2.0f / sideCount;
            }

            graphicsPath.AddPolygon(points);
        }

        public static void WindingModeOutline(this GraphicsPath graphicsPath)
        {
            IntPtr handle = (IntPtr)graphicsPath.GetType().GetField("nativePath", BindingFlags.NonPublic | BindingFlags.Instance).GetValue(graphicsPath);
            HandleRef path = new HandleRef(graphicsPath, handle);
            NativeMethods.GdipWindingModeOutline(path, IntPtr.Zero, 0.25F);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: NumberExtensions.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Extensions/NumberExtensions.cs

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

namespace ShareX.HelpersLib
{
    public static class NumberExtensions
    {
        private static readonly string[] suffixDecimal = new[] { "B", "KB", "MB", "GB", "TB", "PB", "EB" };
        private static readonly string[] suffixBinary = new[] { "B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB" };

        public static T Min<T>(this T num, T min) where T : IComparable<T>
        {
            return MathHelpers.Min(num, min);
        }

        public static T Max<T>(this T num, T max) where T : IComparable<T>
        {
            return MathHelpers.Max(num, max);
        }

        public static T Clamp<T>(this T num, T min, T max) where T : IComparable<T>
        {
            return MathHelpers.Clamp(num, min, max);
        }

        public static bool IsBetween<T>(this T num, T min, T max) where T : IComparable<T>
        {
            return MathHelpers.IsBetween(num, min, max);
        }

        public static T BetweenOrDefault<T>(this T num, T min, T max, T defaultValue = default) where T : IComparable<T>
        {
            return MathHelpers.BetweenOrDefault(num, min, max, defaultValue);
        }

        public static float Remap(this float value, float from1, float to1, float from2, float to2)
        {
            return MathHelpers.Remap(value, from1, to1, from2, to2);
        }

        public static bool IsEvenNumber(this int num)
        {
            return MathHelpers.IsEvenNumber(num);
        }

        public static bool IsOddNumber(this int num)
        {
            return MathHelpers.IsOddNumber(num);
        }

        public static string ToSizeString(this long size, bool binary = false, int decimalPlaces = 2)
        {
            int bytes = binary ? 1024 : 1000;
            if (size < bytes) return Math.Max(size, 0) + " B";
            int place = (int)Math.Floor(Math.Log(size, bytes));
            double num = size / Math.Pow(bytes, place);
            string suffix = binary ? suffixBinary[place] : suffixDecimal[place];
            return num.ToDecimalString(decimalPlaces.Clamp(0, 3)) + " " + suffix;
        }

        public static string ToDecimalString(this double number, int decimalPlaces)
        {
            string format = "0";
            if (decimalPlaces > 0) format += "." + new string('0', decimalPlaces);
            return number.ToString(format);
        }

        public static string ToBase(this int value, int radix, string digits)
        {
            if (string.IsNullOrEmpty(digits))
            {
                throw new ArgumentNullException("digits", string.Format("Digits must contain character value representations"));
            }

            radix = Math.Abs(radix);
            if (radix > digits.Length || radix < 2)
            {
                throw new ArgumentOutOfRangeException("radix", radix, string.Format("Radix has to be > 2 and < {0}", digits.Length));
            }

            string result = "";
            int quotient = Math.Abs(value);
            while (quotient > 0)
            {
                int temp = quotient % radix;
                result = digits[temp] + result;
                quotient /= radix;
            }
            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ObjectExtensions.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Extensions/ObjectExtensions.cs

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

// Source: https://github.com/Burtsev-Alexey/net-object-deep-copy

using System;
using System.Collections.Generic;
using System.Reflection;

namespace ShareX.HelpersLib
{
    public static class ObjectExtensions
    {
        private static readonly MethodInfo CloneMethod = typeof(object).GetMethod("MemberwiseClone", BindingFlags.NonPublic | BindingFlags.Instance);

        public static bool IsPrimitive(this Type type)
        {
            if (type == typeof(string)) return true;
            return type.IsValueType && type.IsPrimitive;
        }

        public static object Copy(this object originalObject)
        {
            return InternalCopy(originalObject, new Dictionary<object, object>(new ReferenceEqualityComparer()));
        }

        private static object InternalCopy(object originalObject, IDictionary<object, object> visited)
        {
            if (originalObject == null) return null;
            Type typeToReflect = originalObject.GetType();
            if (IsPrimitive(typeToReflect)) return originalObject;
            if (visited.ContainsKey(originalObject)) return visited[originalObject];
            if (typeof(Delegate).IsAssignableFrom(typeToReflect)) return null;
            object cloneObject = CloneMethod.Invoke(originalObject, null);
            if (typeToReflect.IsArray)
            {
                Type arrayType = typeToReflect.GetElementType();
                if (IsPrimitive(arrayType) == false)
                {
                    Array clonedArray = (Array)cloneObject;
                    clonedArray.ForEach((array, indices) => array.SetValue(InternalCopy(clonedArray.GetValue(indices), visited), indices));
                }
            }
            visited.Add(originalObject, cloneObject);
            CopyFields(originalObject, visited, cloneObject, typeToReflect);
            RecursiveCopyBaseTypePrivateFields(originalObject, visited, cloneObject, typeToReflect);
            return cloneObject;
        }

        private static void RecursiveCopyBaseTypePrivateFields(object originalObject, IDictionary<object, object> visited, object cloneObject, Type typeToReflect)
        {
            if (typeToReflect.BaseType != null)
            {
                RecursiveCopyBaseTypePrivateFields(originalObject, visited, cloneObject, typeToReflect.BaseType);
                CopyFields(originalObject, visited, cloneObject, typeToReflect.BaseType, BindingFlags.Instance | BindingFlags.NonPublic, info => info.IsPrivate);
            }
        }

        private static void CopyFields(object originalObject, IDictionary<object, object> visited, object cloneObject, Type typeToReflect, BindingFlags bindingFlags = BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public | BindingFlags.FlattenHierarchy, Func<FieldInfo, bool> filter = null)
        {
            foreach (FieldInfo fieldInfo in typeToReflect.GetFields(bindingFlags))
            {
                if (filter != null && filter(fieldInfo) == false) continue;
                if (IsPrimitive(fieldInfo.FieldType)) continue;
                object originalFieldValue = fieldInfo.GetValue(originalObject);
                object clonedFieldValue = InternalCopy(originalFieldValue, visited);
                fieldInfo.SetValue(cloneObject, clonedFieldValue);
            }
        }

        public static T Copy<T>(this T original)
        {
            return (T)Copy((object)original);
        }
    }

    public class ReferenceEqualityComparer : EqualityComparer<object>
    {
        public override bool Equals(object x, object y)
        {
            return ReferenceEquals(x, y);
        }

        public override int GetHashCode(object obj)
        {
            if (obj == null) return 0;
            return obj.GetHashCode();
        }
    }

    public static class ArrayExtensions
    {
        public static void ForEach(this Array array, Action<Array, int[]> action)
        {
            if (array.LongLength == 0) return;
            ArrayTraverse walker = new ArrayTraverse(array);
            do action(array, walker.Position);
            while (walker.Step());
        }
    }

    internal class ArrayTraverse
    {
        public int[] Position;
        private int[] maxLengths;

        public ArrayTraverse(Array array)
        {
            maxLengths = new int[array.Rank];
            for (int i = 0; i < array.Rank; ++i)
            {
                maxLengths[i] = array.GetLength(i) - 1;
            }
            Position = new int[array.Rank];
        }

        public bool Step()
        {
            for (int i = 0; i < Position.Length; ++i)
            {
                if (Position[i] < maxLengths[i])
                {
                    Position[i]++;
                    for (int j = 0; j < i; j++)
                    {
                        Position[j] = 0;
                    }
                    return true;
                }
            }
            return false;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: StreamExtensions.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Extensions/StreamExtensions.cs

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
using System.IO;
using System.Runtime.InteropServices;

namespace ShareX.HelpersLib
{
    public static class StreamExtensions
    {
        private const int DefaultBufferSize = 4096;

        public static void CopyStreamTo(this Stream fromStream, Stream toStream, int bufferSize = DefaultBufferSize)
        {
            if (fromStream.CanSeek)
            {
                fromStream.Position = 0;
            }

            byte[] buffer = new byte[bufferSize];
            int bytesRead;

            while ((bytesRead = fromStream.Read(buffer, 0, buffer.Length)) > 0)
            {
                toStream.Write(buffer, 0, bytesRead);
            }
        }

        public static int CopyStreamTo(this Stream fromStream, Stream toStream, int offset, int length, int bufferSize = DefaultBufferSize)
        {
            fromStream.Position = offset;

            byte[] buffer = new byte[bufferSize];
            int bytesRead;

            int totalBytesRead = 0;
            int positionLimit = length - bufferSize;
            int readLength = bufferSize;

            do
            {
                if (totalBytesRead > positionLimit)
                {
                    readLength = length - totalBytesRead;
                }

                bytesRead = fromStream.Read(buffer, 0, readLength);
                toStream.Write(buffer, 0, bytesRead);
                totalBytesRead += bytesRead;
            }
            while (bytesRead > 0 && totalBytesRead < length);

            return totalBytesRead;
        }

        public static int CopyStreamTo64(this FileStream fromStream, Stream toStream, long offset, int length, int bufferSize = DefaultBufferSize)
        {
            fromStream.Position = offset;

            byte[] buffer = new byte[bufferSize];
            int bytesRead;

            int totalBytesRead = 0;
            int positionLimit = length - bufferSize;
            int readLength = bufferSize;

            do
            {
                if (totalBytesRead > positionLimit)
                {
                    readLength = length - totalBytesRead;
                }

                bytesRead = fromStream.Read(buffer, 0, readLength);
                toStream.Write(buffer, 0, bytesRead);
                totalBytesRead += bytesRead;
            }
            while (bytesRead > 0 && totalBytesRead < length);

            return totalBytesRead;
        }

        public static bool WriteToFile(this Stream stream, string filePath)
        {
            if (stream.Length > 0 && !string.IsNullOrEmpty(filePath))
            {
                FileHelpers.CreateDirectoryFromFilePath(filePath);

                using (FileStream fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.Read))
                {
                    stream.CopyStreamTo(fileStream);
                }

                return true;
            }

            return false;
        }

        public static byte[] GetBytes(this Stream stream)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                stream.CopyStreamTo(ms);
                return ms.ToArray();
            }
        }

        public static byte[] GetBytes(this Stream stream, int offset, int length)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                stream.CopyStreamTo(ms, offset, length);
                return ms.ToArray();
            }
        }

        public static T Read<T>(this Stream stream)
        {
            byte[] buffer = new byte[Marshal.SizeOf(typeof(T))];
            int bytes = stream.Read(buffer, 0, buffer.Length);
            if (bytes == 0) throw new InvalidOperationException("End-of-file reached");
            if (bytes != buffer.Length) throw new ArgumentException("File contains bad data");
            T retval;
            GCHandle hdl = GCHandle.Alloc(buffer, GCHandleType.Pinned);

            try
            {
                retval = (T)Marshal.PtrToStructure(hdl.AddrOfPinnedObject(), typeof(T));
            }
            finally
            {
                hdl.Free();
            }

            return retval;
        }

        public static void Write(this FileStream stream, byte[] array)
        {
            stream.Write(array, 0, array.Length);
        }
    }
}
```

--------------------------------------------------------------------------------

````
