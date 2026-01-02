---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 315
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 315 of 650)

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

---[FILE: CodeMenuEntryPixelInfo.cs]---
Location: ShareX-develop/ShareX.HelpersLib/NameParser/CodeMenuEntryPixelInfo.cs

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

namespace ShareX.HelpersLib
{
    public class CodeMenuEntryPixelInfo : CodeMenuEntry
    {
        protected override string Prefix { get; } = "$";

        // This shouldn't show up in the list of options, but will continue to work for backwards compatibility's sake.
        private static readonly CodeMenuEntryPixelInfo r = new CodeMenuEntryPixelInfo("r", "Red color (0-255)");
        private static readonly CodeMenuEntryPixelInfo g = new CodeMenuEntryPixelInfo("g", "Green color (0-255)");
        private static readonly CodeMenuEntryPixelInfo b = new CodeMenuEntryPixelInfo("b", "Blue color (0-255)");

        public static readonly CodeMenuEntryPixelInfo r255 = new CodeMenuEntryPixelInfo("r255", "Red color (0-255)");
        public static readonly CodeMenuEntryPixelInfo g255 = new CodeMenuEntryPixelInfo("g255", "Green color (0-255)");
        public static readonly CodeMenuEntryPixelInfo b255 = new CodeMenuEntryPixelInfo("b255", "Blue color (0-255)");
        public static readonly CodeMenuEntryPixelInfo r1 = new CodeMenuEntryPixelInfo("r1", "Red color (0-1). Specify decimal precision with {n}, defaults to 3.");
        public static readonly CodeMenuEntryPixelInfo g1 = new CodeMenuEntryPixelInfo("g1", "Green color (0-1). Specify decimal precision with {n}, defaults to 3.");
        public static readonly CodeMenuEntryPixelInfo b1 = new CodeMenuEntryPixelInfo("b1", "Blue color (0-1). Specify decimal precision with {n}, defaults to 3.");
        public static readonly CodeMenuEntryPixelInfo hex = new CodeMenuEntryPixelInfo("hex", "Hex color value (Lowercase)");
        public static readonly CodeMenuEntryPixelInfo rhex = new CodeMenuEntryPixelInfo("rhex", "Red hex color value (00-ff)");
        public static readonly CodeMenuEntryPixelInfo ghex = new CodeMenuEntryPixelInfo("ghex", "Green hex color value (00-ff)");
        public static readonly CodeMenuEntryPixelInfo bhex = new CodeMenuEntryPixelInfo("bhex", "Blue hex color value (00-ff)");
        public static readonly CodeMenuEntryPixelInfo HEX = new CodeMenuEntryPixelInfo("HEX", "Hex color value (Uppercase)");
        public static readonly CodeMenuEntryPixelInfo rHEX = new CodeMenuEntryPixelInfo("rHEX", "Red hex color value (00-FF)");
        public static readonly CodeMenuEntryPixelInfo gHEX = new CodeMenuEntryPixelInfo("gHEX", "Green hex color value (00-FF)");
        public static readonly CodeMenuEntryPixelInfo bHEX = new CodeMenuEntryPixelInfo("bHEX", "Blue hex color value (00-FF)");
        public static readonly CodeMenuEntryPixelInfo c100 = new CodeMenuEntryPixelInfo("c100", "Cyan color (0-100)");
        public static readonly CodeMenuEntryPixelInfo m100 = new CodeMenuEntryPixelInfo("m100", "Magenta color (0-100)");
        public static readonly CodeMenuEntryPixelInfo y100 = new CodeMenuEntryPixelInfo("y100", "Yellow color (0-100)");
        public static readonly CodeMenuEntryPixelInfo k100 = new CodeMenuEntryPixelInfo("k100", "Key color (0-100)");
        public static readonly CodeMenuEntryPixelInfo name = new CodeMenuEntryPixelInfo("name", "Color name");
        public static readonly CodeMenuEntryPixelInfo x = new CodeMenuEntryPixelInfo("x", "X position");
        public static readonly CodeMenuEntryPixelInfo y = new CodeMenuEntryPixelInfo("y", "Y position");
        public static readonly CodeMenuEntryPixelInfo n = new CodeMenuEntryPixelInfo("n", "New line");

        public CodeMenuEntryPixelInfo(string value, string description) : base(value, description)
        {
        }

        public static string Parse(string input, Color color, Point position)
        {
            input = input.Replace(r255.ToPrefixString(), color.R.ToString(), StringComparison.InvariantCultureIgnoreCase).
                Replace(g255.ToPrefixString(), color.G.ToString(), StringComparison.InvariantCultureIgnoreCase).
                Replace(b255.ToPrefixString(), color.B.ToString(), StringComparison.InvariantCultureIgnoreCase).
                Replace(rHEX.ToPrefixString(), color.R.ToString("X2"), StringComparison.InvariantCulture).
                Replace(gHEX.ToPrefixString(), color.G.ToString("X2"), StringComparison.InvariantCulture).
                Replace(bHEX.ToPrefixString(), color.B.ToString("X2"), StringComparison.InvariantCulture).
                Replace(rhex.ToPrefixString(), color.R.ToString("X2").ToLowerInvariant(), StringComparison.InvariantCultureIgnoreCase).
                Replace(ghex.ToPrefixString(), color.G.ToString("X2").ToLowerInvariant(), StringComparison.InvariantCultureIgnoreCase).
                Replace(bhex.ToPrefixString(), color.B.ToString("X2").ToLowerInvariant(), StringComparison.InvariantCultureIgnoreCase).
                Replace(HEX.ToPrefixString(), ColorHelpers.ColorToHex(color), StringComparison.InvariantCulture).
                Replace(hex.ToPrefixString(), ColorHelpers.ColorToHex(color).ToLowerInvariant(), StringComparison.InvariantCultureIgnoreCase).
                Replace(c100.ToPrefixString(), Math.Round(ColorHelpers.ColorToCMYK(color).Cyan100, 2, MidpointRounding.AwayFromZero).ToString(), StringComparison.InvariantCultureIgnoreCase).
                Replace(m100.ToPrefixString(), Math.Round(ColorHelpers.ColorToCMYK(color).Magenta100, 2, MidpointRounding.AwayFromZero).ToString(), StringComparison.InvariantCultureIgnoreCase).
                Replace(y100.ToPrefixString(), Math.Round(ColorHelpers.ColorToCMYK(color).Yellow100, 2, MidpointRounding.AwayFromZero).ToString(), StringComparison.InvariantCultureIgnoreCase).
                Replace(k100.ToPrefixString(), Math.Round(ColorHelpers.ColorToCMYK(color).Key100, 2, MidpointRounding.AwayFromZero).ToString(), StringComparison.InvariantCultureIgnoreCase).
                Replace(name.ToPrefixString(), ColorHelpers.GetColorName(color), StringComparison.InvariantCultureIgnoreCase).
                Replace(x.ToPrefixString(), position.X.ToString(), StringComparison.InvariantCultureIgnoreCase).
                Replace(y.ToPrefixString(), position.Y.ToString(), StringComparison.InvariantCultureIgnoreCase).
                Replace(n.ToPrefixString(), Environment.NewLine, StringComparison.InvariantCultureIgnoreCase);

            foreach (Tuple<string, int> entry in ListEntryWithValue(input, r1.ToPrefixString()))
            {
                input = input.Replace(entry.Item1, Math.Round(color.R / 255d, MathHelpers.Clamp(entry.Item2, 0, 15), MidpointRounding.AwayFromZero).ToString(), StringComparison.InvariantCultureIgnoreCase);
            }

            foreach (Tuple<string, int> entry in ListEntryWithValue(input, g1.ToPrefixString()))
            {
                input = input.Replace(entry.Item1, Math.Round(color.G / 255d, MathHelpers.Clamp(entry.Item2, 0, 15), MidpointRounding.AwayFromZero).ToString(), StringComparison.InvariantCultureIgnoreCase);
            }

            foreach (Tuple<string, int> entry in ListEntryWithValue(input, b1.ToPrefixString()))
            {
                input = input.Replace(entry.Item1, Math.Round(color.B / 255d, MathHelpers.Clamp(entry.Item2, 0, 15), MidpointRounding.AwayFromZero).ToString(), StringComparison.InvariantCultureIgnoreCase);
            }

            input = input.Replace(r1.ToPrefixString(), Math.Round(color.R / 255d, 3, MidpointRounding.AwayFromZero).ToString(), StringComparison.InvariantCultureIgnoreCase).
                Replace(g1.ToPrefixString(), Math.Round(color.G / 255d, 3, MidpointRounding.AwayFromZero).ToString(), StringComparison.InvariantCultureIgnoreCase).
                Replace(b1.ToPrefixString(), Math.Round(color.B / 255d, 3, MidpointRounding.AwayFromZero).ToString(), StringComparison.InvariantCultureIgnoreCase);

            input = input.Replace(r.ToPrefixString(), color.R.ToString(), StringComparison.InvariantCultureIgnoreCase).
                Replace(g.ToPrefixString(), color.G.ToString(), StringComparison.InvariantCultureIgnoreCase).
                Replace(b.ToPrefixString(), color.B.ToString(), StringComparison.InvariantCultureIgnoreCase);

            return input;
        }

        private static IEnumerable<Tuple<string, string[]>> ListEntryWithArguments(string text, string entry, int elements)
        {
            foreach (Tuple<string, string> o in text.ForEachBetween(entry + "{", "}"))
            {
                string[] s = o.Item2.Split(',');
                if (elements > s.Length)
                {
                    Array.Resize(ref s, elements);
                }
                yield return new Tuple<string, string[]>(o.Item1, s);
            }
        }

        private static IEnumerable<Tuple<string, int[]>> ListEntryWithValues(string text, string entry, int elements)
        {
            foreach (Tuple<string, string[]> o in ListEntryWithArguments(text, entry, elements))
            {
                int[] a = new int[o.Item2.Length];
                for (int i = o.Item2.Length - 1; i >= 0; --i)
                {
                    if (int.TryParse(o.Item2[i], out int n))
                    {
                        a[i] = n;
                    }
                }
                yield return new Tuple<string, int[]>(o.Item1, a);
            }
        }

        private static IEnumerable<Tuple<string, int>> ListEntryWithValue(string text, string entry)
        {
            foreach (Tuple<string, int[]> o in ListEntryWithValues(text, entry, 1))
            {
                yield return new Tuple<string, int>(o.Item1, o.Item2[0]);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CodeMenuItem.cs]---
Location: ShareX-develop/ShareX.HelpersLib/NameParser/CodeMenuItem.cs

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

namespace ShareX.HelpersLib
{
    public class CodeMenuItem
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }

        public CodeMenuItem(string name, string description, string category = null)
        {
            Name = name;
            Description = description;
            Category = category;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: NameParser.cs]---
Location: ShareX-develop/ShareX.HelpersLib/NameParser/NameParser.cs

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
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace ShareX.HelpersLib
{
    public enum NameParserType
    {
        Default,
        Text, // Allows new line
        FileName,
        FilePath,
        URL // URL path encodes
    }

    public class NameParser
    {
        public NameParserType Type { get; private set; }
        public int MaxNameLength { get; set; }
        public int MaxTitleLength { get; set; }
        public int AutoIncrementNumber { get; set; } // %i, %ia, %ib, %iAa, %ix
        public int ImageWidth { get; set; } // %width
        public int ImageHeight { get; set; } // %height
        public string WindowText { get; set; } // %t
        public string ProcessName { get; set; } // %pn
        public TimeZoneInfo CustomTimeZone { get; set; }

        // If we're trying to preview via TaskSettings or not
        // Used so that %rf throws "File not found" exceptions and brings up a popup on upload
        // But only returns an error message when previewing to avoid popup spam
        public bool IsPreviewMode { get; set; } = false;

        protected NameParser()
        {
        }

        public NameParser(NameParserType nameParserType)
        {
            Type = nameParserType;
        }

        public static string Parse(NameParserType nameParserType, string pattern)
        {
            return new NameParser(nameParserType).Parse(pattern);
        }

        public string Parse(string pattern)
        {
            if (string.IsNullOrEmpty(pattern))
            {
                return "";
            }

            StringBuilder sb = new StringBuilder(pattern);

            if (WindowText != null)
            {
                string windowText = SanitizeInput(WindowText);

                if (MaxTitleLength > 0)
                {
                    windowText = windowText.Truncate(MaxTitleLength);
                }

                sb.Replace(CodeMenuEntryFilename.t.ToPrefixString(), windowText);
            }

            if (ProcessName != null)
            {
                string processName = SanitizeInput(ProcessName);

                sb.Replace(CodeMenuEntryFilename.pn.ToPrefixString(), processName);
            }

            string width = "", height = "";

            if (ImageWidth > 0)
            {
                width = ImageWidth.ToString();
            }

            if (ImageHeight > 0)
            {
                height = ImageHeight.ToString();
            }

            sb.Replace(CodeMenuEntryFilename.width.ToPrefixString(), width);
            sb.Replace(CodeMenuEntryFilename.height.ToPrefixString(), height);

            DateTime dt = DateTime.Now;

            if (CustomTimeZone != null)
            {
                dt = TimeZoneInfo.ConvertTime(dt, CustomTimeZone);
            }

            sb.Replace(CodeMenuEntryFilename.mon2.ToPrefixString(), CultureInfo.InvariantCulture.DateTimeFormat.GetMonthName(dt.Month))
                .Replace(CodeMenuEntryFilename.mon.ToPrefixString(), CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(dt.Month))
                .Replace(CodeMenuEntryFilename.yy.ToPrefixString(), dt.ToString("yy"))
                .Replace(CodeMenuEntryFilename.y.ToPrefixString(), dt.Year.ToString())
                .Replace(CodeMenuEntryFilename.mo.ToPrefixString(), Helpers.AddZeroes(dt.Month))
                .Replace(CodeMenuEntryFilename.d.ToPrefixString(), Helpers.AddZeroes(dt.Day));

            string hour;

            if (sb.ToString().Contains(CodeMenuEntryFilename.pm.ToPrefixString()))
            {
                hour = Helpers.HourTo12(dt.Hour);
            }
            else
            {
                hour = Helpers.AddZeroes(dt.Hour);
            }

            sb.Replace(CodeMenuEntryFilename.h.ToPrefixString(), hour)
                .Replace(CodeMenuEntryFilename.mi.ToPrefixString(), Helpers.AddZeroes(dt.Minute))
                .Replace(CodeMenuEntryFilename.s.ToPrefixString(), Helpers.AddZeroes(dt.Second))
                .Replace(CodeMenuEntryFilename.ms.ToPrefixString(), Helpers.AddZeroes(dt.Millisecond, 3))
                .Replace(CodeMenuEntryFilename.wy.ToPrefixString(), dt.WeekOfYear().ToString())
                .Replace(CodeMenuEntryFilename.w2.ToPrefixString(), CultureInfo.InvariantCulture.DateTimeFormat.GetDayName(dt.DayOfWeek))
                .Replace(CodeMenuEntryFilename.w.ToPrefixString(), CultureInfo.CurrentCulture.DateTimeFormat.GetDayName(dt.DayOfWeek))
                .Replace(CodeMenuEntryFilename.pm.ToPrefixString(), dt.Hour >= 12 ? "PM" : "AM");

            sb.Replace(CodeMenuEntryFilename.unix.ToPrefixString(), DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString());

            if (sb.ToString().Contains(CodeMenuEntryFilename.i.ToPrefixString())
                || sb.ToString().Contains(CodeMenuEntryFilename.ib.ToPrefixString())
                || sb.ToString().Contains(CodeMenuEntryFilename.ib.ToPrefixString().Replace('b', 'B'))
                || sb.ToString().Contains(CodeMenuEntryFilename.iAa.ToPrefixString())
                || sb.ToString().Contains(CodeMenuEntryFilename.iAa.ToPrefixString().Replace("Aa", "aA"))
                || sb.ToString().Contains(CodeMenuEntryFilename.ia.ToPrefixString())
                || sb.ToString().Contains(CodeMenuEntryFilename.ia.ToPrefixString().Replace('a', 'A'))
                || sb.ToString().Contains(CodeMenuEntryFilename.ix.ToPrefixString())
                || sb.ToString().Contains(CodeMenuEntryFilename.ix.ToPrefixString().Replace('x', 'X')))
            {
                AutoIncrementNumber++;

                // Base
                try
                {
                    foreach (Tuple<string, int[]> entry in ListEntryWithValues(sb.ToString(), CodeMenuEntryFilename.ib.ToPrefixString(), 2))
                    {
                        sb.Replace(entry.Item1, Helpers.AddZeroes(AutoIncrementNumber.ToBase(entry.Item2[0], Helpers.AlphanumericInverse), entry.Item2[1]));
                    }
                    foreach (Tuple<string, int[]> entry in ListEntryWithValues(sb.ToString(), CodeMenuEntryFilename.ib.ToPrefixString().Replace('b', 'B'), 2))
                    {
                        sb.Replace(entry.Item1, Helpers.AddZeroes(AutoIncrementNumber.ToBase(entry.Item2[0], Helpers.Alphanumeric), entry.Item2[1]));
                    }
                }
                catch
                {
                }

                // Alphanumeric Dual Case (Base 62)
                foreach (Tuple<string, int> entry in ListEntryWithValue(sb.ToString(), CodeMenuEntryFilename.iAa.ToPrefixString()))
                {
                    sb.Replace(entry.Item1, Helpers.AddZeroes(AutoIncrementNumber.ToBase(62, Helpers.Alphanumeric), entry.Item2));
                }
                sb.Replace(CodeMenuEntryFilename.iAa.ToPrefixString(), AutoIncrementNumber.ToBase(62, Helpers.Alphanumeric));

                // Alphanumeric Dual Case (Base 62)
                foreach (Tuple<string, int> entry in ListEntryWithValue(sb.ToString(), CodeMenuEntryFilename.iAa.ToPrefixString().Replace("Aa", "aA")))
                {
                    sb.Replace(entry.Item1, Helpers.AddZeroes(AutoIncrementNumber.ToBase(62, Helpers.AlphanumericInverse), entry.Item2));
                }
                sb.Replace(CodeMenuEntryFilename.iAa.ToPrefixString().Replace("Aa", "aA"), AutoIncrementNumber.ToBase(62, Helpers.AlphanumericInverse));

                // Alphanumeric Single Case (Base 36)
                foreach (Tuple<string, int> entry in ListEntryWithValue(sb.ToString(), CodeMenuEntryFilename.ia.ToPrefixString()))
                {
                    sb.Replace(entry.Item1, Helpers.AddZeroes(AutoIncrementNumber.ToBase(36, Helpers.Alphanumeric), entry.Item2).ToLowerInvariant());
                }
                sb.Replace(CodeMenuEntryFilename.ia.ToPrefixString(), AutoIncrementNumber.ToBase(36, Helpers.Alphanumeric).ToLowerInvariant());

                // Alphanumeric Single Case Capital (Base 36)
                foreach (Tuple<string, int> entry in ListEntryWithValue(sb.ToString(), CodeMenuEntryFilename.ia.ToPrefixString().Replace('a', 'A')))
                {
                    sb.Replace(entry.Item1, Helpers.AddZeroes(AutoIncrementNumber.ToBase(36, Helpers.Alphanumeric), entry.Item2).ToUpperInvariant());
                }
                sb.Replace(CodeMenuEntryFilename.ia.ToPrefixString().Replace('a', 'A'), AutoIncrementNumber.ToBase(36, Helpers.Alphanumeric).ToUpperInvariant());

                // Hexadecimal (Base 16)
                foreach (Tuple<string, int> entry in ListEntryWithValue(sb.ToString(), CodeMenuEntryFilename.ix.ToPrefixString()))
                {
                    sb.Replace(entry.Item1, AutoIncrementNumber.ToString("x" + entry.Item2.ToString()));
                }
                sb.Replace(CodeMenuEntryFilename.ix.ToPrefixString(), AutoIncrementNumber.ToString("x"));

                // Hexadecimal Capital (Base 16)
                foreach (Tuple<string, int> entry in ListEntryWithValue(sb.ToString(), CodeMenuEntryFilename.ix.ToPrefixString().Replace('x', 'X')))
                {
                    sb.Replace(entry.Item1, AutoIncrementNumber.ToString("X" + entry.Item2.ToString()));
                }
                sb.Replace(CodeMenuEntryFilename.ix.ToPrefixString().Replace('x', 'X'), AutoIncrementNumber.ToString("X"));

                // Number (Base 10)
                foreach (Tuple<string, int> entry in ListEntryWithValue(sb.ToString(), CodeMenuEntryFilename.i.ToPrefixString()))
                {
                    sb.Replace(entry.Item1, AutoIncrementNumber.ToString("d" + entry.Item2.ToString()));
                }
                sb.Replace(CodeMenuEntryFilename.i.ToPrefixString(), AutoIncrementNumber.ToString("d"));
            }

            sb.Replace(CodeMenuEntryFilename.un.ToPrefixString(), Environment.UserName);
            sb.Replace(CodeMenuEntryFilename.uln.ToPrefixString(), Environment.UserDomainName);
            sb.Replace(CodeMenuEntryFilename.cn.ToPrefixString(), Environment.MachineName);

            if (Type == NameParserType.Text)
            {
                sb.Replace(CodeMenuEntryFilename.n.ToPrefixString(), Environment.NewLine);
            }

            string result = sb.ToString();

            result = result.ReplaceAll(CodeMenuEntryFilename.radjective.ToPrefixString(),
                () => CultureInfo.InvariantCulture.TextInfo.ToTitleCase(Helpers.GetRandomLine(Resources.adjectives)));
            result = result.ReplaceAll(CodeMenuEntryFilename.ranimal.ToPrefixString(),
                () => CultureInfo.InvariantCulture.TextInfo.ToTitleCase(Helpers.GetRandomLine(Resources.animals)));

            foreach (Tuple<string, string> entry in ListEntryWithArgument(result, CodeMenuEntryFilename.rf.ToPrefixString()))
            {
                result = result.ReplaceAll(entry.Item1, () =>
                {
                    try
                    {
                        string path = entry.Item2;

                        if (FileHelpers.IsTextFile(path))
                        {
                            return Helpers.GetRandomLineFromFile(path);
                        }
                        else
                        {
                            throw new Exception("Valid text file path is required.");
                        }
                    }
                    catch (Exception e) when (IsPreviewMode)
                    {
                        return e.Message;
                    }
                });
            }

            foreach (Tuple<string, int> entry in ListEntryWithValue(result, CodeMenuEntryFilename.rna.ToPrefixString()))
            {
                result = result.ReplaceAll(entry.Item1, () => Helpers.RepeatGenerator(entry.Item2, () => Helpers.GetRandomChar(Helpers.Base56).ToString()));
            }

            foreach (Tuple<string, int> entry in ListEntryWithValue(result, CodeMenuEntryFilename.rn.ToPrefixString()))
            {
                result = result.ReplaceAll(entry.Item1, () => Helpers.RepeatGenerator(entry.Item2, () => Helpers.GetRandomChar(Helpers.Numbers).ToString()));
            }

            foreach (Tuple<string, int> entry in ListEntryWithValue(result, CodeMenuEntryFilename.ra.ToPrefixString()))
            {
                result = result.ReplaceAll(entry.Item1, () => Helpers.RepeatGenerator(entry.Item2, () => Helpers.GetRandomChar(Helpers.Alphanumeric).ToString()));
            }

            foreach (Tuple<string, int> entry in ListEntryWithValue(result, CodeMenuEntryFilename.rx.ToPrefixString()))
            {
                result = result.ReplaceAll(entry.Item1, () => Helpers.RepeatGenerator(entry.Item2, () => Helpers.GetRandomChar(Helpers.Hexadecimal.ToLowerInvariant()).ToString()));
            }

            foreach (Tuple<string, int> entry in ListEntryWithValue(result, CodeMenuEntryFilename.rx.ToPrefixString().Replace('x', 'X')))
            {
                result = result.ReplaceAll(entry.Item1, () => Helpers.RepeatGenerator(entry.Item2, () => Helpers.GetRandomChar(Helpers.Hexadecimal.ToUpperInvariant()).ToString()));
            }

            foreach (Tuple<string, int> entry in ListEntryWithValue(result, CodeMenuEntryFilename.remoji.ToPrefixString()))
            {
                result = result.ReplaceAll(entry.Item1, () => Helpers.RepeatGenerator(entry.Item2, () => RandomCrypto.Pick(Emoji.Emojis)));
            }

            result = result.ReplaceAll(CodeMenuEntryFilename.rna.ToPrefixString(), () => Helpers.GetRandomChar(Helpers.Base56).ToString());
            result = result.ReplaceAll(CodeMenuEntryFilename.rn.ToPrefixString(), () => Helpers.GetRandomChar(Helpers.Numbers).ToString());
            result = result.ReplaceAll(CodeMenuEntryFilename.ra.ToPrefixString(), () => Helpers.GetRandomChar(Helpers.Alphanumeric).ToString());
            result = result.ReplaceAll(CodeMenuEntryFilename.rx.ToPrefixString(), () => Helpers.GetRandomChar(Helpers.Hexadecimal.ToLowerInvariant()).ToString());
            result = result.ReplaceAll(CodeMenuEntryFilename.rx.ToPrefixString().Replace('x', 'X'), () => Helpers.GetRandomChar(Helpers.Hexadecimal.ToUpperInvariant()).ToString());
            result = result.ReplaceAll(CodeMenuEntryFilename.guid.ToPrefixString().ToLowerInvariant(), () => Guid.NewGuid().ToString().ToLowerInvariant());
            result = result.ReplaceAll(CodeMenuEntryFilename.guid.ToPrefixString().ToUpperInvariant(), () => Guid.NewGuid().ToString().ToUpperInvariant());
            result = result.ReplaceAll(CodeMenuEntryFilename.remoji.ToPrefixString(), () => RandomCrypto.Pick(Emoji.Emojis));

            if (Type == NameParserType.FileName)
            {
                result = FileHelpers.SanitizeFileName(result);
            }
            else if (Type == NameParserType.FilePath)
            {
                result = FileHelpers.SanitizePath(result);
            }
            else if (Type == NameParserType.URL)
            {
                result = Helpers.GetValidURL(result);
            }

            if (MaxNameLength > 0)
            {
                result = result.Truncate(MaxNameLength);
            }

            return result;
        }

        private string SanitizeInput(string input)
        {
            input = input.Trim().Replace(' ', '_');

            if (Type == NameParserType.FileName || Type == NameParserType.FilePath)
            {
                input = FileHelpers.SanitizeFileName(input);
            }

            return input;
        }

        private IEnumerable<Tuple<string, string[]>> ListEntryWithArguments(string text, string entry, int elements)
        {
            foreach (Tuple<string, string> o in text.ForEachBetween(entry + "{", "}"))
            {
                string[] s = o.Item2.Split(',');
                if (elements > s.Length)
                {
                    Array.Resize(ref s, elements);
                }
                yield return new Tuple<string, string[]>(o.Item1, s);
            }
        }

        private IEnumerable<Tuple<string, string>> ListEntryWithArgument(string text, string entry)
        {
            foreach (Tuple<string, string[]> o in ListEntryWithArguments(text, entry, 1))
            {
                yield return new Tuple<string, string>(o.Item1, o.Item2[0]);
            }
        }

        private IEnumerable<Tuple<string, int[]>> ListEntryWithValues(string text, string entry, int elements)
        {
            foreach (Tuple<string, string[]> o in ListEntryWithArguments(text, entry, elements))
            {
                int[] a = new int[o.Item2.Length];
                for (int i = o.Item2.Length - 1; i >= 0; --i)
                {
                    if (int.TryParse(o.Item2[i], out int n))
                    {
                        a[i] = n;
                    }
                }
                yield return new Tuple<string, int[]>(o.Item1, a);
            }
        }

        private IEnumerable<Tuple<string, int>> ListEntryWithValue(string text, string entry)
        {
            foreach (Tuple<string, int[]> o in ListEntryWithValues(text, entry, 1))
            {
                yield return new Tuple<string, int>(o.Item1, o.Item2[0]);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: LayeredForm.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Native/LayeredForm.cs

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
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public class LayeredForm : Form
    {
        public LayeredForm()
        {
            SuspendLayout();
            AutoScaleDimensions = new SizeF(6F, 13F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(300, 300);
            FormBorderStyle = FormBorderStyle.None;
            Icon = ShareXResources.Icon;
            Name = "LayeredForm";
            ShowInTaskbar = false;
            Text = "LayeredForm";
            ResumeLayout(false);
        }

        protected override CreateParams CreateParams
        {
            get
            {
                CreateParams createParams = base.CreateParams;
                createParams.ExStyle |= (int)WindowStyles.WS_EX_LAYERED;
                return createParams;
            }
        }

        public void SelectBitmap(Bitmap bitmap, int opacity = 255)
        {
            if (bitmap.PixelFormat != PixelFormat.Format32bppArgb)
            {
                throw new ApplicationException("The bitmap must be 32bpp with alpha-channel.");
            }

            IntPtr screenDc = NativeMethods.GetDC(IntPtr.Zero);
            IntPtr memDc = NativeMethods.CreateCompatibleDC(screenDc);
            IntPtr hBitmap = IntPtr.Zero;
            IntPtr hOldBitmap = IntPtr.Zero;

            try
            {
                hBitmap = bitmap.GetHbitmap(Color.FromArgb(0));
                hOldBitmap = NativeMethods.SelectObject(memDc, hBitmap);

                SIZE newSize = new SIZE(bitmap.Width, bitmap.Height);
                POINT sourceLocation = new POINT(0, 0);
                POINT newLocation = new POINT(Left, Top);
                BLENDFUNCTION blend = new BLENDFUNCTION();
                blend.BlendOp = NativeConstants.AC_SRC_OVER;
                blend.BlendFlags = 0;
                blend.SourceConstantAlpha = (byte)opacity;
                blend.AlphaFormat = NativeConstants.AC_SRC_ALPHA;

                NativeMethods.UpdateLayeredWindow(Handle, screenDc, ref newLocation, ref newSize, memDc, ref sourceLocation, 0, ref blend, NativeConstants.ULW_ALPHA);
            }
            finally
            {
                NativeMethods.ReleaseDC(IntPtr.Zero, screenDc);
                if (hBitmap != IntPtr.Zero)
                {
                    NativeMethods.SelectObject(memDc, hOldBitmap);
                    NativeMethods.DeleteObject(hBitmap);
                }
                NativeMethods.DeleteDC(memDc);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: NativeConstants.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Native/NativeConstants.cs

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

namespace ShareX.HelpersLib
{
    public static class NativeConstants
    {
        /// <summary>
        /// Places the window at the top of the Z order.
        /// </summary>
        public const int HWND_TOP = 0;

        /// <summary>
        /// Places the window at the bottom of the Z order.
        /// If the hWnd parameter identifies a topmost window, the window loses its topmost status and is placed at the bottom of all other windows.
        /// </summary>
        public const int HWND_BOTTOM = 1;

        /// <summary>
        /// Places the window above all non-topmost windows. The window maintains its topmost position even when it is deactivated.
        /// </summary>
        public const int HWND_TOPMOST = -1;

        /// <summary>
        /// Places the window above all non-topmost windows (that is, behind all topmost windows). This flag has no effect if the window is already a non-topmost window.
        /// </summary>
        public const int HWND_NOTOPMOST = -2;

        public const int GWL_WNDPROC = -4;
        public const int GWL_HINSTANCE = -6;
        public const int GWL_HWNDPARENT = -8;
        public const int GWL_STYLE = -16;
        public const int GWL_EXSTYLE = -20;
        public const int GWL_USERDATA = -21;
        public const int GWL_ID = -12;

        public const int GCL_HICONSM = -34;
        public const int GCL_HICON = -14;
        public const int ICON_SMALL = 0;
        public const int ICON_BIG = 1;
        public const int ICON_SMALL2 = 2;
        public const int SC_MINIMIZE = 0xF020;
        public const int CURSOR_SHOWING = 1;
        public const int DWM_TNP_RECTDESTINATION = 0x1;
        public const int DWM_TNP_RECTSOURCE = 0x2;
        public const int DWM_TNP_OPACITY = 0x4;
        public const int DWM_TNP_VISIBLE = 0x8;
        public const int DWM_TNP_SOURCECLIENTAREAONLY = 0x10;
        public const int WH_KEYBOARD_LL = 13;
        public const int WH_MOUSE_LL = 14;
        public const int ULW_ALPHA = 0x02;
        public const byte AC_SRC_OVER = 0x00;
        public const byte AC_SRC_ALPHA = 0x01;

        /// <summary>
        /// Draws the icon or cursor using the mask.
        /// </summary>
        public const int DI_MASK = 0x0001;

        /// <summary>
        /// Draws the icon or cursor using the image.
        /// </summary>
        public const int DI_IMAGE = 0x0002;

        /// <summary>
        /// Combination of DI_IMAGE and DI_MASK.
        /// </summary>
        public const int DI_NORMAL = 0x0003;

        /// <summary>
        /// Draws the icon or cursor using the system default image rather than the user-specified image.
        /// For more information, see About Cursors. Windows NT4.0 and later: This flag is ignored.
        /// </summary>
        public const int DI_COMPAT = 0x0004;

        /// <summary>
        /// Draws the icon or cursor using the width and height specified by the system metric values for cursors or icons,
        /// if the cxWidth and cyWidth parameters are set to zero. If this flag is not specified and cxWidth and cyWidth are set to zero,
        /// the function uses the actual resource size.
        /// </summary>
        public const int DI_DEFAULTSIZE = 0x0008;

        /// <summary>
        /// Windows XP: Draws the icon as an unmirrored icon. By default, the icon is drawn as a mirrored icon if hdc is mirrored.
        /// </summary>
        public const int DI_NOMIRROR = 0x0010;

        public const uint ECM_FIRST = 0x1500;
        public const uint EM_SETCUEBANNER = ECM_FIRST + 1;
        public const uint MA_ACTIVATE = 1;
        public const uint MA_ACTIVATEANDEAT = 2;
        public const uint MA_NOACTIVATE = 3;
        public const uint MA_NOACTIVATEANDEAT = 4;
        public const uint MOUSE_MOVE = 0xF012;

        public const string IID_IImageList = "46EB5926-582E-4017-9FDF-E8998DAA0950";
        public const string IID_IImageList2 = "192B9D83-50FC-457B-90A0-2B82A8B5DAE1";

        public const int SHIL_LARGE = 0x0;
        public const int SHIL_SMALL = 0x1;
        public const int SHIL_EXTRALARGE = 0x2;
        public const int SHIL_SYSSMALL = 0x3;
        public const int SHIL_JUMBO = 0x4;
        public const int SHIL_LAST = 0x4;

        public const int ILD_TRANSPARENT = 0x00000001;
        public const int ILD_IMAGE = 0x00000020;

        public const int LWA_COLORKEY = 0x1;
        public const int LWA_ALPHA = 0x2;
    }
}
```

--------------------------------------------------------------------------------

````
