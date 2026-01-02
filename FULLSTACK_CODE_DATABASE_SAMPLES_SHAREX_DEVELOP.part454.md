---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 454
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 454 of 650)

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

---[FILE: ScrollingCaptureOptions.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/ScrollingCaptureOptions.cs

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
    public class ScrollingCaptureOptions
    {
        public int StartDelay { get; set; } = 300;
        public bool AutoScrollTop { get; set; } = false;
        public int ScrollDelay { get; set; } = 300;
        public ScrollMethod ScrollMethod { get; set; } = ScrollMethod.MouseWheel;
        public int ScrollAmount { get; set; } = 2;
        public bool AutoIgnoreBottomEdge { get; set; } = true;
        public bool AutoUpload { get; set; } = false;
        public bool ShowRegion { get; set; } = true;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ShareX.ScreenCaptureLib.csproj]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/ShareX.ScreenCaptureLib.csproj

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
    <ProjectReference Include="..\ShareX.HelpersLib\ShareX.HelpersLib.csproj" />
    <ProjectReference Include="..\ShareX.ImageEffectsLib\ShareX.ImageEffectsLib.csproj" />
    <ProjectReference Include="..\ShareX.MediaLib\ShareX.MediaLib.csproj" />
  </ItemGroup>
  <ItemGroup>
    <Reference Include="ImageListView">
      <HintPath>..\Libs\ImageListView.dll</HintPath>
    </Reference>
  </ItemGroup>
</Project>
```

--------------------------------------------------------------------------------

---[FILE: BaseAnimation.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Animations/BaseAnimation.cs

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
using System.Diagnostics;

namespace ShareX.ScreenCaptureLib
{
    internal class BaseAnimation
    {
        public virtual bool IsActive { get; protected set; }

        protected Stopwatch Timer { get; private set; }
        protected TimeSpan TotalElapsed { get; private set; }
        protected TimeSpan Elapsed { get; private set; }

        protected TimeSpan previousElapsed;

        public BaseAnimation()
        {
            Timer = new Stopwatch();
        }

        public virtual void Start()
        {
            IsActive = true;
            Timer.Restart();
        }

        public virtual void Stop()
        {
            Timer.Stop();
            IsActive = false;
        }

        public virtual bool Update()
        {
            if (IsActive)
            {
                TotalElapsed = Timer.Elapsed;
                Elapsed = TotalElapsed - previousElapsed;
                previousElapsed = TotalElapsed;
            }

            return IsActive;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ColorBlinkAnimation.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Animations/ColorBlinkAnimation.cs

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
    internal class ColorBlinkAnimation : BaseAnimation
    {
        public Color FromColor { get; set; }
        public Color ToColor { get; set; }
        public TimeSpan Duration { get; set; }

        public Color CurrentColor { get; set; }

        private bool backward;

        public override bool Update()
        {
            if (IsActive)
            {
                base.Update();

                float amount = (float)Timer.Elapsed.Ticks / Duration.Ticks;

                if (backward)
                {
                    amount = 1 - amount;
                }

                if (amount > 1)
                {
                    amount = 1;
                    backward = true;
                    Start();
                }
                else if (amount < 0)
                {
                    amount = 0;
                    backward = false;
                    Start();
                }

                CurrentColor = ColorHelpers.Lerp(FromColor, ToColor, amount);
            }

            return IsActive;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: OpacityAnimation.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Animations/OpacityAnimation.cs

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

namespace ShareX.ScreenCaptureLib
{
    internal class OpacityAnimation : BaseAnimation
    {
        private double opacity;

        public double Opacity
        {
            get
            {
                return opacity;
            }
            private set
            {
                opacity = value.Clamp(0, 1);
            }
        }

        public TimeSpan FadeInDuration { get; set; }
        public TimeSpan Duration { get; set; }
        public TimeSpan FadeOutDuration { get; set; }

        public TimeSpan TotalDuration => FadeInDuration + Duration + FadeOutDuration;

        public override bool Update()
        {
            if (IsActive)
            {
                if (Timer.Elapsed < FadeInDuration)
                {
                    Opacity = Timer.Elapsed.TotalMilliseconds / FadeInDuration.TotalMilliseconds;
                }
                else
                {
                    Opacity = 1 - ((Timer.Elapsed - (FadeInDuration + Duration)).TotalMilliseconds / FadeOutDuration.TotalMilliseconds);
                }

                if (Opacity == 0)
                {
                    Timer.Stop();
                }
            }

            return IsActive;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: PointAnimation.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Animations/PointAnimation.cs

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
    internal class PointAnimation : BaseAnimation
    {
        public Point FromPosition { get; set; }
        public Point ToPosition { get; set; }
        public TimeSpan Duration { get; set; }

        public Point CurrentPosition { get; private set; }

        public override bool Update()
        {
            if (IsActive)
            {
                base.Update();

                float amount = (float)Timer.Elapsed.Ticks / Duration.Ticks;
                amount = Math.Min(amount, 1);

                CurrentPosition = (Point)MathHelpers.Lerp(FromPosition, ToPosition, amount);

                if (amount >= 1)
                {
                    Stop();
                }
            }

            return IsActive;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: RectangleAnimation.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Animations/RectangleAnimation.cs

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
    internal class RectangleAnimation : BaseAnimation
    {
        public RectangleF FromRectangle { get; set; }
        public RectangleF ToRectangle { get; set; }
        public TimeSpan Duration { get; set; }

        public RectangleF CurrentRectangle { get; private set; }

        public override bool Update()
        {
            if (IsActive)
            {
                base.Update();

                float amount = (float)Timer.Elapsed.Ticks / Duration.Ticks;
                amount = Math.Min(amount, 1);

                float x = MathHelpers.Lerp(FromRectangle.X, ToRectangle.X, amount);
                float y = MathHelpers.Lerp(FromRectangle.Y, ToRectangle.Y, amount);
                float width = MathHelpers.Lerp(FromRectangle.Width, ToRectangle.Width, amount);
                float height = MathHelpers.Lerp(FromRectangle.Height, ToRectangle.Height, amount);

                CurrentRectangle = new RectangleF(x, y, width, height);

                if (amount >= 1)
                {
                    Stop();
                }
            }

            return IsActive;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: TextAnimation.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Animations/TextAnimation.cs

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
    internal class TextAnimation : OpacityAnimation
    {
        public string Text { get; set; }
        public Point Position { get; set; }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CanvasSizeForm.ar-YE.resx]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Forms/CanvasSizeForm.ar-YE.resx

```text
<?xml version="1.0" encoding="utf-8"?>
<root>
  <!-- 
    Microsoft ResX Schema 
    
    Version 2.0
    
    The primary goals of this format is to allow a simple XML format 
    that is mostly human readable. The generation and parsing of the 
    various data types are done through the TypeConverter classes 
    associated with the data types.
    
    Example:
    
    ... ado.net/XML headers & schema ...
    <resheader name="resmimetype">text/microsoft-resx</resheader>
    <resheader name="version">2.0</resheader>
    <resheader name="reader">System.Resources.ResXResourceReader, System.Windows.Forms, ...</resheader>
    <resheader name="writer">System.Resources.ResXResourceWriter, System.Windows.Forms, ...</resheader>
    <data name="Name1"><value>this is my long string</value><comment>this is a comment</comment></data>
    <data name="Color1" type="System.Drawing.Color, System.Drawing">Blue</data>
    <data name="Bitmap1" mimetype="application/x-microsoft.net.object.binary.base64">
        <value>[base64 mime encoded serialized .NET Framework object]</value>
    </data>
    <data name="Icon1" type="System.Drawing.Icon, System.Drawing" mimetype="application/x-microsoft.net.object.bytearray.base64">
        <value>[base64 mime encoded string representing a byte array form of the .NET Framework object]</value>
        <comment>This is a comment</comment>
    </data>
                
    There are any number of "resheader" rows that contain simple 
    name/value pairs.
    
    Each data row contains a name, and value. The row also contains a 
    type or mimetype. Type corresponds to a .NET class that support 
    text/value conversion through the TypeConverter architecture. 
    Classes that don't support this are serialized and stored with the 
    mimetype set.
    
    The mimetype is used for serialized objects, and tells the 
    ResXResourceReader how to depersist the object. This is currently not 
    extensible. For a given mimetype the value must be set accordingly:
    
    Note - application/x-microsoft.net.object.binary.base64 is the format 
    that the ResXResourceWriter will generate, however the reader can 
    read any of the formats listed below.
    
    mimetype: application/x-microsoft.net.object.binary.base64
    value   : The object must be serialized with 
            : System.Runtime.Serialization.Formatters.Binary.BinaryFormatter
            : and then encoded with base64 encoding.
    
    mimetype: application/x-microsoft.net.object.soap.base64
    value   : The object must be serialized with 
            : System.Runtime.Serialization.Formatters.Soap.SoapFormatter
            : and then encoded with base64 encoding.

    mimetype: application/x-microsoft.net.object.bytearray.base64
    value   : The object must be serialized into a byte array 
            : using a System.ComponentModel.TypeConverter
            : and then encoded with base64 encoding.
    -->
  <xsd:schema id="root" xmlns="" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xsd:import namespace="http://www.w3.org/XML/1998/namespace" />
    <xsd:element name="root" msdata:IsDataSet="true">
      <xsd:complexType>
        <xsd:choice maxOccurs="unbounded">
          <xsd:element name="metadata">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element name="value" type="xsd:string" minOccurs="0" />
              </xsd:sequence>
              <xsd:attribute name="name" use="required" type="xsd:string" />
              <xsd:attribute name="type" type="xsd:string" />
              <xsd:attribute name="mimetype" type="xsd:string" />
              <xsd:attribute ref="xml:space" />
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="assembly">
            <xsd:complexType>
              <xsd:attribute name="alias" type="xsd:string" />
              <xsd:attribute name="name" type="xsd:string" />
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="data">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element name="value" type="xsd:string" minOccurs="0" msdata:Ordinal="1" />
                <xsd:element name="comment" type="xsd:string" minOccurs="0" msdata:Ordinal="2" />
              </xsd:sequence>
              <xsd:attribute name="name" type="xsd:string" use="required" msdata:Ordinal="1" />
              <xsd:attribute name="type" type="xsd:string" msdata:Ordinal="3" />
              <xsd:attribute name="mimetype" type="xsd:string" msdata:Ordinal="4" />
              <xsd:attribute ref="xml:space" />
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="resheader">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element name="value" type="xsd:string" minOccurs="0" msdata:Ordinal="1" />
              </xsd:sequence>
              <xsd:attribute name="name" type="xsd:string" use="required" />
            </xsd:complexType>
          </xsd:element>
        </xsd:choice>
      </xsd:complexType>
    </xsd:element>
  </xsd:schema>
  <resheader name="resmimetype">
    <value>text/microsoft-resx</value>
  </resheader>
  <resheader name="version">
    <value>2.0</value>
  </resheader>
  <resheader name="reader">
    <value>System.Resources.ResXResourceReader, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value>
  </resheader>
  <resheader name="writer">
    <value>System.Resources.ResXResourceWriter, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value>
  </resheader>
  <data name="btnCancel.Text" xml:space="preserve">
    <value>إلغاء</value>
  </data>
  <data name="cbtnCanvasColor.Text" xml:space="preserve">
    <value>لون الصفحة...</value>
  </data>
  <data name="lblBottom.Text" xml:space="preserve">
    <value>أسفل:</value>
  </data>
  <data name="btnOK.Text" xml:space="preserve">
    <value>حسنًا</value>
  </data>
  <data name="lblRight.Text" xml:space="preserve">
    <value>يمين:</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - حجم لوحة الرسم</value>
  </data>
  <data name="lblTop.Text" xml:space="preserve">
    <value>أعلى:</value>
  </data>
  <data name="lblLeft.Text" xml:space="preserve">
    <value>يسار:</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: CanvasSizeForm.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Forms/CanvasSizeForm.cs

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
using System.Windows.Forms;

namespace ShareX.ScreenCaptureLib
{
    public partial class CanvasSizeForm : Form
    {
        public Padding Canvas { get; private set; }
        public Color CanvasColor { get; private set; }

        public CanvasSizeForm()
        {
            InitializeComponent();
            ShareXResources.ApplyTheme(this, true);
        }

        public CanvasSizeForm(Padding canvas, Color canvasColor) : this()
        {
            Canvas = canvas;
            CanvasColor = canvasColor;

            nudLeft.SetValue(Canvas.Left);
            nudTop.SetValue(Canvas.Top);
            nudRight.SetValue(Canvas.Right);
            nudBottom.SetValue(Canvas.Bottom);
            cbtnCanvasColor.Color = CanvasColor;
        }

        private void CanvasSizeForm_Shown(object sender, EventArgs e)
        {
            this.ForceActivate();
        }

        private void btnOK_Click(object sender, EventArgs e)
        {
            Canvas = new Padding((int)nudLeft.Value, (int)nudTop.Value, (int)nudRight.Value, (int)nudBottom.Value);
            CanvasColor = cbtnCanvasColor.Color;

            DialogResult = DialogResult.OK;
            Close();
        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            DialogResult = DialogResult.Cancel;
            Close();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CanvasSizeForm.de.resx]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Forms/CanvasSizeForm.de.resx

```text
<?xml version="1.0" encoding="utf-8"?>
<root>
  <!-- 
    Microsoft ResX Schema 
    
    Version 2.0
    
    The primary goals of this format is to allow a simple XML format 
    that is mostly human readable. The generation and parsing of the 
    various data types are done through the TypeConverter classes 
    associated with the data types.
    
    Example:
    
    ... ado.net/XML headers & schema ...
    <resheader name="resmimetype">text/microsoft-resx</resheader>
    <resheader name="version">2.0</resheader>
    <resheader name="reader">System.Resources.ResXResourceReader, System.Windows.Forms, ...</resheader>
    <resheader name="writer">System.Resources.ResXResourceWriter, System.Windows.Forms, ...</resheader>
    <data name="Name1"><value>this is my long string</value><comment>this is a comment</comment></data>
    <data name="Color1" type="System.Drawing.Color, System.Drawing">Blue</data>
    <data name="Bitmap1" mimetype="application/x-microsoft.net.object.binary.base64">
        <value>[base64 mime encoded serialized .NET Framework object]</value>
    </data>
    <data name="Icon1" type="System.Drawing.Icon, System.Drawing" mimetype="application/x-microsoft.net.object.bytearray.base64">
        <value>[base64 mime encoded string representing a byte array form of the .NET Framework object]</value>
        <comment>This is a comment</comment>
    </data>
                
    There are any number of "resheader" rows that contain simple 
    name/value pairs.
    
    Each data row contains a name, and value. The row also contains a 
    type or mimetype. Type corresponds to a .NET class that support 
    text/value conversion through the TypeConverter architecture. 
    Classes that don't support this are serialized and stored with the 
    mimetype set.
    
    The mimetype is used for serialized objects, and tells the 
    ResXResourceReader how to depersist the object. This is currently not 
    extensible. For a given mimetype the value must be set accordingly:
    
    Note - application/x-microsoft.net.object.binary.base64 is the format 
    that the ResXResourceWriter will generate, however the reader can 
    read any of the formats listed below.
    
    mimetype: application/x-microsoft.net.object.binary.base64
    value   : The object must be serialized with 
            : System.Runtime.Serialization.Formatters.Binary.BinaryFormatter
            : and then encoded with base64 encoding.
    
    mimetype: application/x-microsoft.net.object.soap.base64
    value   : The object must be serialized with 
            : System.Runtime.Serialization.Formatters.Soap.SoapFormatter
            : and then encoded with base64 encoding.

    mimetype: application/x-microsoft.net.object.bytearray.base64
    value   : The object must be serialized into a byte array 
            : using a System.ComponentModel.TypeConverter
            : and then encoded with base64 encoding.
    -->
  <xsd:schema id="root" xmlns="" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xsd:import namespace="http://www.w3.org/XML/1998/namespace" />
    <xsd:element name="root" msdata:IsDataSet="true">
      <xsd:complexType>
        <xsd:choice maxOccurs="unbounded">
          <xsd:element name="metadata">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element name="value" type="xsd:string" minOccurs="0" />
              </xsd:sequence>
              <xsd:attribute name="name" use="required" type="xsd:string" />
              <xsd:attribute name="type" type="xsd:string" />
              <xsd:attribute name="mimetype" type="xsd:string" />
              <xsd:attribute ref="xml:space" />
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="assembly">
            <xsd:complexType>
              <xsd:attribute name="alias" type="xsd:string" />
              <xsd:attribute name="name" type="xsd:string" />
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="data">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element name="value" type="xsd:string" minOccurs="0" msdata:Ordinal="1" />
                <xsd:element name="comment" type="xsd:string" minOccurs="0" msdata:Ordinal="2" />
              </xsd:sequence>
              <xsd:attribute name="name" type="xsd:string" use="required" msdata:Ordinal="1" />
              <xsd:attribute name="type" type="xsd:string" msdata:Ordinal="3" />
              <xsd:attribute name="mimetype" type="xsd:string" msdata:Ordinal="4" />
              <xsd:attribute ref="xml:space" />
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="resheader">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element name="value" type="xsd:string" minOccurs="0" msdata:Ordinal="1" />
              </xsd:sequence>
              <xsd:attribute name="name" type="xsd:string" use="required" />
            </xsd:complexType>
          </xsd:element>
        </xsd:choice>
      </xsd:complexType>
    </xsd:element>
  </xsd:schema>
  <resheader name="resmimetype">
    <value>text/microsoft-resx</value>
  </resheader>
  <resheader name="version">
    <value>2.0</value>
  </resheader>
  <resheader name="reader">
    <value>System.Resources.ResXResourceReader, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value>
  </resheader>
  <resheader name="writer">
    <value>System.Resources.ResXResourceWriter, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value>
  </resheader>
  <data name="lblLeft.Text" xml:space="preserve">
    <value>Links:</value>
  </data>
  <data name="lblRight.Text" xml:space="preserve">
    <value>Rechts:</value>
  </data>
  <data name="lblTop.Text" xml:space="preserve">
    <value>Oben:</value>
  </data>
  <data name="lblBottom.Text" xml:space="preserve">
    <value>Unten:</value>
  </data>
  <data name="btnCancel.Text" xml:space="preserve">
    <value>Abbrechen</value>
  </data>
  <data name="cbtnCanvasColor.Text" xml:space="preserve">
    <value>Leinwandfarbe...</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - Leinwandgröße</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: CanvasSizeForm.Designer.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Forms/CanvasSizeForm.Designer.cs

```csharp
namespace ShareX.ScreenCaptureLib
{
    partial class CanvasSizeForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(CanvasSizeForm));
            this.nudLeft = new System.Windows.Forms.NumericUpDown();
            this.lblLeft = new System.Windows.Forms.Label();
            this.lblRight = new System.Windows.Forms.Label();
            this.nudRight = new System.Windows.Forms.NumericUpDown();
            this.lblTop = new System.Windows.Forms.Label();
            this.nudTop = new System.Windows.Forms.NumericUpDown();
            this.lblBottom = new System.Windows.Forms.Label();
            this.nudBottom = new System.Windows.Forms.NumericUpDown();
            this.btnOK = new System.Windows.Forms.Button();
            this.btnCancel = new System.Windows.Forms.Button();
            this.cbtnCanvasColor = new ShareX.HelpersLib.ColorButton();
            ((System.ComponentModel.ISupportInitialize)(this.nudLeft)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudRight)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudTop)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudBottom)).BeginInit();
            this.SuspendLayout();
            // 
            // nudLeft
            // 
            resources.ApplyResources(this.nudLeft, "nudLeft");
            this.nudLeft.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.nudLeft.Minimum = new decimal(new int[] {
            10000,
            0,
            0,
            -2147483648});
            this.nudLeft.Name = "nudLeft";
            // 
            // lblLeft
            // 
            resources.ApplyResources(this.lblLeft, "lblLeft");
            this.lblLeft.Name = "lblLeft";
            // 
            // lblRight
            // 
            resources.ApplyResources(this.lblRight, "lblRight");
            this.lblRight.Name = "lblRight";
            // 
            // nudRight
            // 
            resources.ApplyResources(this.nudRight, "nudRight");
            this.nudRight.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.nudRight.Minimum = new decimal(new int[] {
            10000,
            0,
            0,
            -2147483648});
            this.nudRight.Name = "nudRight";
            // 
            // lblTop
            // 
            resources.ApplyResources(this.lblTop, "lblTop");
            this.lblTop.Name = "lblTop";
            // 
            // nudTop
            // 
            resources.ApplyResources(this.nudTop, "nudTop");
            this.nudTop.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.nudTop.Minimum = new decimal(new int[] {
            10000,
            0,
            0,
            -2147483648});
            this.nudTop.Name = "nudTop";
            // 
            // lblBottom
            // 
            resources.ApplyResources(this.lblBottom, "lblBottom");
            this.lblBottom.Name = "lblBottom";
            // 
            // nudBottom
            // 
            resources.ApplyResources(this.nudBottom, "nudBottom");
            this.nudBottom.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.nudBottom.Minimum = new decimal(new int[] {
            10000,
            0,
            0,
            -2147483648});
            this.nudBottom.Name = "nudBottom";
            // 
            // btnOK
            // 
            resources.ApplyResources(this.btnOK, "btnOK");
            this.btnOK.Name = "btnOK";
            this.btnOK.UseVisualStyleBackColor = true;
            this.btnOK.Click += new System.EventHandler(this.btnOK_Click);
            // 
            // btnCancel
            // 
            resources.ApplyResources(this.btnCancel, "btnCancel");
            this.btnCancel.Name = "btnCancel";
            this.btnCancel.UseVisualStyleBackColor = true;
            this.btnCancel.Click += new System.EventHandler(this.btnCancel_Click);
            // 
            // cbtnCanvasColor
            // 
            this.cbtnCanvasColor.Color = System.Drawing.Color.Transparent;
            this.cbtnCanvasColor.ColorPickerOptions = null;
            resources.ApplyResources(this.cbtnCanvasColor, "cbtnCanvasColor");
            this.cbtnCanvasColor.Name = "cbtnCanvasColor";
            this.cbtnCanvasColor.UseVisualStyleBackColor = true;
            // 
            // CanvasSizeForm
            // 
            this.AcceptButton = this.btnOK;
            resources.ApplyResources(this, "$this");
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.SystemColors.Window;
            this.Controls.Add(this.cbtnCanvasColor);
            this.Controls.Add(this.btnCancel);
            this.Controls.Add(this.btnOK);
            this.Controls.Add(this.lblBottom);
            this.Controls.Add(this.nudBottom);
            this.Controls.Add(this.lblTop);
            this.Controls.Add(this.nudTop);
            this.Controls.Add(this.lblRight);
            this.Controls.Add(this.nudRight);
            this.Controls.Add(this.lblLeft);
            this.Controls.Add(this.nudLeft);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "CanvasSizeForm";
            this.Shown += new System.EventHandler(this.CanvasSizeForm_Shown);
            ((System.ComponentModel.ISupportInitialize)(this.nudLeft)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudRight)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudTop)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudBottom)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.NumericUpDown nudLeft;
        private System.Windows.Forms.Label lblLeft;
        private System.Windows.Forms.Label lblRight;
        private System.Windows.Forms.NumericUpDown nudRight;
        private System.Windows.Forms.Label lblTop;
        private System.Windows.Forms.NumericUpDown nudTop;
        private System.Windows.Forms.Label lblBottom;
        private System.Windows.Forms.NumericUpDown nudBottom;
        private System.Windows.Forms.Button btnOK;
        private System.Windows.Forms.Button btnCancel;
        private HelpersLib.ColorButton cbtnCanvasColor;
    }
}
```

--------------------------------------------------------------------------------

````
