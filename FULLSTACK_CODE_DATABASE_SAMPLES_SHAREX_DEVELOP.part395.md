---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 395
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 395 of 650)

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

---[FILE: ImageEffectPreset.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/ImageEffectPreset.cs

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

using Newtonsoft.Json;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;

namespace ShareX.ImageEffectsLib
{
    public class ImageEffectPreset
    {
        public string Name { get; set; } = "";

        [JsonProperty(ItemTypeNameHandling = TypeNameHandling.Auto)]
        public List<ImageEffect> Effects { get; set; } = new List<ImageEffect>();

        public Bitmap ApplyEffects(Bitmap bmp)
        {
            Bitmap result = (Bitmap)bmp.Clone();
            result.SetResolution(96f, 96f);

            if (Effects != null && Effects.Count > 0)
            {
                foreach (ImageEffect effect in Effects.Where(x => x.Enabled))
                {
                    result = effect.Apply(result);

                    if (result == null)
                    {
                        break;
                    }
                }
            }

            return result;
        }

        public override string ToString()
        {
            if (!string.IsNullOrEmpty(Name))
            {
                return Name;
            }

            return "Name";
        }

        public static ImageEffectPreset GetDefaultPreset()
        {
            ImageEffectPreset preset = new ImageEffectPreset();

            Canvas canvas = new Canvas();
            canvas.Margin = new Padding(0, 0, 0, 30);
            preset.Effects.Add(canvas);

            DrawText text = new DrawText();
            text.Offset = new Point(0, 0);
            text.UseGradient = true;
            preset.Effects.Add(text);

            return preset;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ImageEffectsSerializationBinder.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/ImageEffectsSerializationBinder.cs

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

namespace ShareX.ImageEffectsLib
{
    public class ImageEffectsSerializationBinder : KnownTypesSerializationBinder
    {
        public ImageEffectsSerializationBinder()
        {
            KnownTypes = Helpers.FindSubclassesOf<ImageEffect>();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ShareX.ImageEffectsLib.csproj]---
Location: ShareX-develop/ShareX.ImageEffectsLib/ShareX.ImageEffectsLib.csproj

```text
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net9.0-windows</TargetFramework>
    <OutputType>Library</OutputType>
    <PlatformTarget>x64</PlatformTarget>
    <RuntimeIdentifier>win-x64</RuntimeIdentifier>
    <UseWindowsForms>true</UseWindowsForms>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Newtonsoft.Json" Version="13.0.4" />
  </ItemGroup>
  <ItemGroup>
    <ProjectReference Include="..\ShareX.HelpersLib\ShareX.HelpersLib.csproj" />
  </ItemGroup>
</Project>
```

--------------------------------------------------------------------------------

---[FILE: WatermarkConfig.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/WatermarkConfig.cs

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

namespace ShareX.ImageEffectsLib
{
    public class WatermarkConfig
    {
        public WatermarkType Type = WatermarkType.Text;
        public ContentAlignment Placement = ContentAlignment.BottomRight;
        public int Offset = 5;
        public DrawText Text = new DrawText { DrawTextShadow = false };
        public DrawImage Image = new DrawImage();

        public Bitmap Apply(Bitmap bmp)
        {
            Text.Placement = Image.Placement = Placement;
            Text.Offset = Image.Offset = new Point(Offset, Offset);

            switch (Type)
            {
                default:
                case WatermarkType.Text:
                    return Text.Apply(bmp);
                case WatermarkType.Image:
                    return Image.Apply(bmp);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Alpha.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Adjustments/Alpha.cs

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
    internal class Alpha : ImageEffect
    {
        [DefaultValue(1f), Description("Pixel alpha = Pixel alpha * Value\r\nExample 0.5 will decrease alpha of pixel 50%")]
        public float Value { get; set; }

        [DefaultValue(0f), Description("Pixel alpha = Pixel alpha + Addition\r\nExample 0.5 will increase alpha of pixel 127.5")]
        public float Addition { get; set; }

        public Alpha()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            using (bmp)
            {
                return ColorMatrixManager.Alpha(Value, Addition).Apply(bmp);
            }
        }

        protected override string GetSummary()
        {
            return $"{Value}, {Addition}";
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: BlackWhite.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Adjustments/BlackWhite.cs

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
    [Description("Black & white")]
    internal class BlackWhite : ImageEffect
    {
        public override Bitmap Apply(Bitmap bmp)
        {
            using (bmp)
            {
                return ColorMatrixManager.BlackWhite().Apply(bmp);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Brightness.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Adjustments/Brightness.cs

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
    internal class Brightness : ImageEffect
    {
        [DefaultValue(0f), Description("Pixel color = Pixel color + Value\r\nExample 0.5 will increase color of pixel 127.5")]
        public float Value { get; set; }

        public Brightness()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            using (bmp)
            {
                return ColorMatrixManager.Brightness(Value).Apply(bmp);
            }
        }

        protected override string GetSummary()
        {
            return Value.ToString();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Colorize.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Adjustments/Colorize.cs

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
    internal class Colorize : ImageEffect
    {
        [DefaultValue(typeof(Color), "Red"), Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color Color { get; set; }

        [DefaultValue(0f)]
        public float Value { get; set; }

        public Colorize()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            using (bmp)
            {
                return ColorMatrixManager.Colorize(Color, Value).Apply(bmp);
            }
        }

        protected override string GetSummary()
        {
            return $"{Color.R}, {Color.G}, {Color.B}";
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Contrast.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Adjustments/Contrast.cs

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
    internal class Contrast : ImageEffect
    {
        [DefaultValue(1f), Description("Pixel color = Pixel color * Value\r\nExample 1.5 will increase color of pixel 50%")]
        public float Value { get; set; }

        public Contrast()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            using (bmp)
            {
                return ColorMatrixManager.Contrast(Value).Apply(bmp);
            }
        }

        protected override string GetSummary()
        {
            return Value.ToString();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Gamma.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Adjustments/Gamma.cs

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
    internal class Gamma : ImageEffect
    {
        [DefaultValue(1f), Description("Min 0.1, Max 5.0")]
        public float Value { get; set; }

        public Gamma()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            using (bmp)
            {
                return ColorMatrixManager.ChangeGamma(bmp, Value);
            }
        }

        protected override string GetSummary()
        {
            return Value.ToString();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Grayscale.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Adjustments/Grayscale.cs

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
    internal class Grayscale : ImageEffect
    {
        [DefaultValue(1f)]
        public float Value { get; set; }

        public Grayscale()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            using (bmp)
            {
                return ColorMatrixManager.Grayscale(Value).Apply(bmp);
            }
        }

        protected override string GetSummary()
        {
            return Value.ToString();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Hue.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Adjustments/Hue.cs

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
    internal class Hue : ImageEffect
    {
        [DefaultValue(0f), Description("From 0 to 360")]
        public float Angle { get; set; }

        public Hue()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            using (bmp)
            {
                return ColorMatrixManager.Hue(Angle).Apply(bmp);
            }
        }

        protected override string GetSummary()
        {
            return Angle + "°";
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Inverse.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Adjustments/Inverse.cs

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
    internal class Inverse : ImageEffect
    {
        public override Bitmap Apply(Bitmap bmp)
        {
            using (bmp)
            {
                return ColorMatrixManager.Inverse().Apply(bmp);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: MatrixColor.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Adjustments/MatrixColor.cs

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
using System.Drawing.Imaging;

namespace ShareX.ImageEffectsLib
{
    [Description("Color matrix")]
    internal class MatrixColor : ImageEffect
    {
        [DefaultValue(1f), Description("Red = (Red * Rr) + (Green * Rg) + (Blue * Rb) + (Alpha * Ra) + Ro")]
        public float Rr { get; set; }
        [DefaultValue(0f)]
        public float Rg { get; set; }
        [DefaultValue(0f)]
        public float Rb { get; set; }
        [DefaultValue(0f)]
        public float Ra { get; set; }
        [DefaultValue(0f)]
        public float Ro { get; set; }

        [DefaultValue(0f)]
        public float Gr { get; set; }
        [DefaultValue(1f)]
        public float Gg { get; set; }
        [DefaultValue(0f)]
        public float Gb { get; set; }
        [DefaultValue(0f)]
        public float Ga { get; set; }
        [DefaultValue(0f)]
        public float Go { get; set; }

        [DefaultValue(0f)]
        public float Br { get; set; }
        [DefaultValue(0f)]
        public float Bg { get; set; }
        [DefaultValue(1f)]
        public float Bb { get; set; }
        [DefaultValue(0f)]
        public float Ba { get; set; }
        [DefaultValue(0f)]
        public float Bo { get; set; }

        [DefaultValue(0f)]
        public float Ar { get; set; }
        [DefaultValue(0f)]
        public float Ag { get; set; }
        [DefaultValue(0f)]
        public float Ab { get; set; }
        [DefaultValue(1f)]
        public float Aa { get; set; }
        [DefaultValue(0f)]
        public float Ao { get; set; }

        public MatrixColor()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            ColorMatrix colorMatrix = new ColorMatrix(new[]
            {
                new float[] { Rr, Gr, Br, Ar, 0 },
                new float[] { Rg, Gg, Bg, Ag, 0 },
                new float[] { Rb, Gb, Bb, Ab, 0 },
                new float[] { Ra, Ga, Ba, Aa, 0 },
                new float[] { Ro, Go, Bo, Ao, 1 }
            });

            using (bmp)
            {
                return colorMatrix.Apply(bmp);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Polaroid.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Adjustments/Polaroid.cs

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
    internal class Polaroid : ImageEffect
    {
        public override Bitmap Apply(Bitmap bmp)
        {
            using (bmp)
            {
                return ColorMatrixManager.Polaroid().Apply(bmp);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ReplaceColor.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Adjustments/ReplaceColor.cs

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
    [Description("Replace color")]
    internal class ReplaceColor : ImageEffect
    {
        [DefaultValue(typeof(Color), "White"), Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color SourceColor { get; set; }

        [DefaultValue(false)]
        public bool AutoSourceColor { get; set; }

        [DefaultValue(typeof(Color), "Transparent"), Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color TargetColor { get; set; }

        [DefaultValue(0)]
        public int Threshold { get; set; }

        public ReplaceColor()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            ImageHelpers.ReplaceColor(bmp, SourceColor, TargetColor, AutoSourceColor, Threshold);
            return bmp;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Saturation.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Adjustments/Saturation.cs

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
    internal class Saturation : ImageEffect
    {
        [DefaultValue(1f)]
        public float Value { get; set; }

        public Saturation()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            using (bmp)
            {
                return ColorMatrixManager.Saturation(Value).Apply(bmp);
            }
        }

        protected override string GetSummary()
        {
            return Value.ToString();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: SelectiveColor.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Adjustments/SelectiveColor.cs

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
    [Description("Selective color")]
    internal class SelectiveColor : ImageEffect
    {
        [DefaultValue(typeof(Color), "White"), Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color LightColor { get; set; }

        [DefaultValue(typeof(Color), "Black"), Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color DarkColor { get; set; }

        [DefaultValue(10)]
        public int PaletteSize { get; set; }

        public SelectiveColor()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            ImageHelpers.SelectiveColor(bmp, LightColor, DarkColor, MathHelpers.Clamp(PaletteSize, 2, 100));
            return bmp;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Sepia.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Adjustments/Sepia.cs

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
    internal class Sepia : ImageEffect
    {
        [DefaultValue(1f)]
        public float Value { get; set; }

        public Sepia()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            using (bmp)
            {
                return ColorMatrixManager.Sepia(Value).Apply(bmp);
            }
        }

        protected override string GetSummary()
        {
            return Value.ToString();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: DrawBackground.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Drawings/DrawBackground.cs

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
    [Description("Background")]
    public class DrawBackground : ImageEffect
    {
        [DefaultValue(typeof(Color), "Black"), Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color Color { get; set; }

        [DefaultValue(false)]
        public bool UseGradient { get; set; }

        [Editor(typeof(GradientEditor), typeof(UITypeEditor))]
        public GradientInfo Gradient { get; set; }

        public DrawBackground()
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
            using (bmp)
            {
                if (UseGradient && Gradient != null && Gradient.IsValid)
                {
                    return ImageHelpers.FillBackground(bmp, Gradient);
                }

                return ImageHelpers.FillBackground(bmp, Color);
            }
        }

        protected override string GetSummary()
        {
            if (!UseGradient)
            {
                return $"{Color.R}, {Color.G}, {Color.B}";
            }

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

````
