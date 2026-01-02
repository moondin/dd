---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 398
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 398 of 650)

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

---[FILE: RGBSplit.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Filters/RGBSplit.cs

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
    [Description("RGB split")]
    internal class RGBSplit : ImageEffect
    {
        [DefaultValue(typeof(Point), "-5, 0")]
        public Point OffsetRed { get; set; } = new Point(-5, 0);

        [DefaultValue(typeof(Point), "0, 0")]
        public Point OffsetGreen { get; set; }

        [DefaultValue(typeof(Point), "5, 0")]
        public Point OffsetBlue { get; set; } = new Point(5, 0);

        public override Bitmap Apply(Bitmap bmp)
        {
            Bitmap bmpResult = bmp.CreateEmptyBitmap();

            using (UnsafeBitmap source = new UnsafeBitmap(bmp, true, ImageLockMode.ReadOnly))
            using (UnsafeBitmap dest = new UnsafeBitmap(bmpResult, true, ImageLockMode.WriteOnly))
            {
                int right = source.Width - 1;
                int bottom = source.Height - 1;

                for (int y = 0; y < source.Height; y++)
                {
                    for (int x = 0; x < source.Width; x++)
                    {
                        ColorBgra colorR = source.GetPixel(MathHelpers.Clamp(x - OffsetRed.X, 0, right), MathHelpers.Clamp(y - OffsetRed.Y, 0, bottom));
                        ColorBgra colorG = source.GetPixel(MathHelpers.Clamp(x - OffsetGreen.X, 0, right), MathHelpers.Clamp(y - OffsetGreen.Y, 0, bottom));
                        ColorBgra colorB = source.GetPixel(MathHelpers.Clamp(x - OffsetBlue.X, 0, right), MathHelpers.Clamp(y - OffsetBlue.Y, 0, bottom));
                        ColorBgra shiftedColor = new ColorBgra((byte)(colorB.Blue * colorB.Alpha / 255), (byte)(colorG.Green * colorG.Alpha / 255),
                            (byte)(colorR.Red * colorR.Alpha / 255), (byte)((colorR.Alpha + colorG.Alpha + colorB.Alpha) / 3));
                        dest.SetPixel(x, y, shiftedColor);
                    }
                }
            }

            return bmpResult;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Shadow.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Filters/Shadow.cs

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
    internal class Shadow : ImageEffect
    {
        private float opacity;

        [DefaultValue(0.6f), Description("Choose a value between 0.1 and 1.0")]
        public float Opacity
        {
            get
            {
                return opacity;
            }
            set
            {
                opacity = value.Clamp(0.1f, 1.0f);
            }
        }

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
                size = value.Max(0);
            }
        }

        [DefaultValue(0f)]
        public float Darkness { get; set; }

        [DefaultValue(typeof(Color), "Black"), Editor(typeof(MyColorEditor), typeof(UITypeEditor)), TypeConverter(typeof(MyColorConverter))]
        public Color Color { get; set; }

        [DefaultValue(typeof(Point), "0, 0")]
        public Point Offset { get; set; }

        [DefaultValue(true)]
        public bool AutoResize { get; set; }

        public Shadow()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            return ImageHelpers.AddShadow(bmp, Opacity, Size, Darkness + 1, Color, Offset, AutoResize);
        }

        protected override string GetSummary()
        {
            return Size.ToString();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Sharpen.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Filters/Sharpen.cs

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
    internal class Sharpen : ImageEffect
    {
        public override Bitmap Apply(Bitmap bmp)
        {
            //return ImageHelpers.Sharpen(bmp, Strength);

            using (bmp)
            {
                return ConvolutionMatrixManager.Sharpen().Apply(bmp);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Slice.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Filters/Slice.cs

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

namespace ShareX.ImageEffectsLib
{
    [Description("Slice")]
    internal class Slice : ImageEffect
    {
        private int minSliceHeight;

        [DefaultValue(10)]
        public int MinSliceHeight
        {
            get
            {
                return minSliceHeight;
            }
            set
            {
                minSliceHeight = value.Max(1);
            }
        }

        private int maxSliceHeight;

        [DefaultValue(100)]
        public int MaxSliceHeight
        {
            get
            {
                return maxSliceHeight;
            }
            set
            {
                maxSliceHeight = value.Max(1);
            }
        }

        [DefaultValue(0)]
        public int MinSliceShift { get; set; }

        [DefaultValue(10)]
        public int MaxSliceShift { get; set; }

        public Slice()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            int minSliceHeight = Math.Min(MinSliceHeight, MaxSliceHeight);
            int maxSliceHeight = Math.Max(MinSliceHeight, MaxSliceHeight);
            int minSliceShift = Math.Min(MinSliceShift, MaxSliceShift);
            int maxSliceShift = Math.Max(MinSliceShift, MaxSliceShift);

            using (bmp)
            {
                return ImageHelpers.Slice(bmp, minSliceHeight, maxSliceHeight, minSliceShift, maxSliceShift);
            }
        }

        protected override string GetSummary()
        {
            return $"{MinSliceHeight}, {MaxSliceHeight}";
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Smooth.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Filters/Smooth.cs

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
    internal class Smooth : ImageEffect
    {
        public override Bitmap Apply(Bitmap bmp)
        {
            using (bmp)
            {
                return ConvolutionMatrixManager.Smooth().Apply(bmp);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: TornEdge.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Filters/TornEdge.cs

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
using System.Windows.Forms;

namespace ShareX.ImageEffectsLib
{
    [Description("Torn edge")]
    internal class TornEdge : ImageEffect
    {
        [DefaultValue(15)]
        public int Depth { get; set; }

        [DefaultValue(20)]
        public int Range { get; set; }

        [DefaultValue(AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right)]
        public AnchorStyles Sides { get; set; }

        [DefaultValue(true)]
        public bool CurvedEdges { get; set; }

        public TornEdge()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            return ImageHelpers.TornEdges(bmp, Depth, Range, Sides, CurvedEdges, true);
        }

        protected override string GetSummary()
        {
            return $"{Depth}, {Range}";
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: WaveEdge.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Filters/WaveEdge.cs

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
using System.Windows.Forms;

namespace ShareX.ImageEffectsLib
{
    [Description("Wave edge")]
    internal class WaveEdge : ImageEffect
    {
        [DefaultValue(15)]
        public int Depth { get; set; }

        [DefaultValue(20)]
        public int Range { get; set; }

        [DefaultValue(AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right)]
        public AnchorStyles Sides { get; set; }

        public WaveEdge()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            return ImageHelpers.WavyEdges(bmp, Depth, Range, Sides);
        }

        protected override string GetSummary()
        {
            return $"{Depth}, {Range}";
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ImageEffectPackagerForm.ar-YE.resx]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Forms/ImageEffectPackagerForm.ar-YE.resx

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
  <data name="lblAssetsFolderPath.Text" xml:space="preserve">
    <value>مسار مجلد الوسائط:</value>
  </data>
  <data name="btnOpenImageEffectsFolder.Text" xml:space="preserve">
    <value>فتح مجلد مؤثرات الصور...</value>
  </data>
  <data name="btnPackage.Text" xml:space="preserve">
    <value>إنشاء حزمة</value>
  </data>
  <data name="lblPackageFilePath.Text" xml:space="preserve">
    <value>مسار ملف الحزمة:</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - محزّم تأثيرات الصور</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: ImageEffectPackagerForm.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Forms/ImageEffectPackagerForm.cs

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
using ShareX.ImageEffectsLib.Properties;
using System;
using System.IO;
using System.Windows.Forms;

namespace ShareX.ImageEffectsLib
{
    public partial class ImageEffectPackagerForm : Form
    {
        public string ImageEffectJson { get; private set; }
        public string ImageEffectName { get; private set; }
        public string ShareXImageEffectsFolderPath { get; private set; }
        public string AssetsFolderPath { get; set; }
        public string PackageFilePath { get; set; }

        public ImageEffectPackagerForm(string json, string name, string imageEffectsFolderPath)
        {
            ImageEffectJson = json;
            ImageEffectName = name;
            ShareXImageEffectsFolderPath = imageEffectsFolderPath;

            InitializeComponent();
            ShareXResources.ApplyTheme(this, true);

            AssetsFolderPath = Path.Combine(ShareXImageEffectsFolderPath, ImageEffectName);
            txtAssetsFolderPath.Text = AssetsFolderPath;
            PackageFilePath = AssetsFolderPath + ".sxie";
            txtPackageFilePath.Text = PackageFilePath;
        }

        private void btnOpenImageEffectsFolder_Click(object sender, EventArgs e)
        {
            FileHelpers.OpenFolder(ShareXImageEffectsFolderPath);
        }

        private void txtAssetsFolderPath_TextChanged(object sender, EventArgs e)
        {
            AssetsFolderPath = txtAssetsFolderPath.Text;
        }

        private void btnAssetsFolderPathBrowse_Click(object sender, EventArgs e)
        {
            FileHelpers.BrowseFolder(txtAssetsFolderPath, ShareXImageEffectsFolderPath);
        }

        private void txtPackageFilePath_TextChanged(object sender, EventArgs e)
        {
            PackageFilePath = txtPackageFilePath.Text;
        }

        private void btnPackageFilePathBrowse_Click(object sender, EventArgs e)
        {
            using (SaveFileDialog sfd = new SaveFileDialog())
            {
                sfd.DefaultExt = "sxie";
                sfd.FileName = ImageEffectName + ".sxie";
                sfd.Filter = "ShareX image effect (*.sxie)|*.sxie";
                sfd.InitialDirectory = ShareXImageEffectsFolderPath;

                if (sfd.ShowDialog() == DialogResult.OK)
                {
                    txtPackageFilePath.Text = sfd.FileName;
                }
            }
        }

        private void btnPackage_Click(object sender, EventArgs e)
        {
            try
            {
                if (!string.IsNullOrEmpty(AssetsFolderPath) && !AssetsFolderPath.StartsWith(ShareXImageEffectsFolderPath + "\\", StringComparison.OrdinalIgnoreCase))
                {
                    MessageBox.Show(Resources.AssetsFolderMustBeInsideShareXImageEffectsFolder, "ShareX - " + Resources.InvalidAssetsFolderPath,
                        MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
                else if (!File.Exists(PackageFilePath) || MessageBox.Show(Resources.PackageWithThisFileNameAlreadyExistsRNWouldYouLikeToOverwriteIt, "ShareX",
                    MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes)
                {
                    string outputFilePath = ImageEffectPackager.Package(PackageFilePath, ImageEffectJson, AssetsFolderPath);

                    if (!string.IsNullOrEmpty(outputFilePath) && File.Exists(outputFilePath))
                    {
                        FileHelpers.OpenFolderWithFile(outputFilePath);
                    }
                }
            }
            catch (Exception ex)
            {
                ex.ShowError();
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ImageEffectPackagerForm.de.resx]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Forms/ImageEffectPackagerForm.de.resx

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
  <data name="btnPackage.Text" xml:space="preserve">
    <value>Paket</value>
  </data>
  <data name="lblAssetsFolderPath.Text" xml:space="preserve">
    <value>Pfad zum Assets-Ordner:</value>
  </data>
  <data name="lblPackageFilePath.Text" xml:space="preserve">
    <value>Pfad zu den Paketdateien:</value>
  </data>
  <data name="btnOpenImageEffectsFolder.Text" xml:space="preserve">
    <value>Öffne den Ordner für Bildeffekte...</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - Bild-Effekt-Paketierer</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: ImageEffectPackagerForm.Designer.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Forms/ImageEffectPackagerForm.Designer.cs

```csharp
namespace ShareX.ImageEffectsLib
{
    partial class ImageEffectPackagerForm
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(ImageEffectPackagerForm));
            this.btnPackage = new System.Windows.Forms.Button();
            this.lblAssetsFolderPath = new System.Windows.Forms.Label();
            this.lblPackageFilePath = new System.Windows.Forms.Label();
            this.txtPackageFilePath = new System.Windows.Forms.TextBox();
            this.btnPackageFilePathBrowse = new System.Windows.Forms.Button();
            this.txtAssetsFolderPath = new System.Windows.Forms.TextBox();
            this.btnAssetsFolderPathBrowse = new System.Windows.Forms.Button();
            this.btnOpenImageEffectsFolder = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // btnPackage
            // 
            resources.ApplyResources(this.btnPackage, "btnPackage");
            this.btnPackage.Name = "btnPackage";
            this.btnPackage.UseVisualStyleBackColor = true;
            this.btnPackage.Click += new System.EventHandler(this.btnPackage_Click);
            // 
            // lblAssetsFolderPath
            // 
            resources.ApplyResources(this.lblAssetsFolderPath, "lblAssetsFolderPath");
            this.lblAssetsFolderPath.Name = "lblAssetsFolderPath";
            // 
            // lblPackageFilePath
            // 
            resources.ApplyResources(this.lblPackageFilePath, "lblPackageFilePath");
            this.lblPackageFilePath.Name = "lblPackageFilePath";
            // 
            // txtPackageFilePath
            // 
            resources.ApplyResources(this.txtPackageFilePath, "txtPackageFilePath");
            this.txtPackageFilePath.Name = "txtPackageFilePath";
            this.txtPackageFilePath.TextChanged += new System.EventHandler(this.txtPackageFilePath_TextChanged);
            // 
            // btnPackageFilePathBrowse
            // 
            resources.ApplyResources(this.btnPackageFilePathBrowse, "btnPackageFilePathBrowse");
            this.btnPackageFilePathBrowse.Name = "btnPackageFilePathBrowse";
            this.btnPackageFilePathBrowse.UseVisualStyleBackColor = true;
            this.btnPackageFilePathBrowse.Click += new System.EventHandler(this.btnPackageFilePathBrowse_Click);
            // 
            // txtAssetsFolderPath
            // 
            resources.ApplyResources(this.txtAssetsFolderPath, "txtAssetsFolderPath");
            this.txtAssetsFolderPath.Name = "txtAssetsFolderPath";
            this.txtAssetsFolderPath.TextChanged += new System.EventHandler(this.txtAssetsFolderPath_TextChanged);
            // 
            // btnAssetsFolderPathBrowse
            // 
            resources.ApplyResources(this.btnAssetsFolderPathBrowse, "btnAssetsFolderPathBrowse");
            this.btnAssetsFolderPathBrowse.Name = "btnAssetsFolderPathBrowse";
            this.btnAssetsFolderPathBrowse.UseVisualStyleBackColor = true;
            this.btnAssetsFolderPathBrowse.Click += new System.EventHandler(this.btnAssetsFolderPathBrowse_Click);
            // 
            // btnOpenImageEffectsFolder
            // 
            resources.ApplyResources(this.btnOpenImageEffectsFolder, "btnOpenImageEffectsFolder");
            this.btnOpenImageEffectsFolder.Name = "btnOpenImageEffectsFolder";
            this.btnOpenImageEffectsFolder.UseVisualStyleBackColor = true;
            this.btnOpenImageEffectsFolder.Click += new System.EventHandler(this.btnOpenImageEffectsFolder_Click);
            // 
            // ImageEffectPackagerForm
            // 
            resources.ApplyResources(this, "$this");
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            this.Controls.Add(this.btnOpenImageEffectsFolder);
            this.Controls.Add(this.btnAssetsFolderPathBrowse);
            this.Controls.Add(this.txtAssetsFolderPath);
            this.Controls.Add(this.btnPackageFilePathBrowse);
            this.Controls.Add(this.txtPackageFilePath);
            this.Controls.Add(this.lblPackageFilePath);
            this.Controls.Add(this.lblAssetsFolderPath);
            this.Controls.Add(this.btnPackage);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Name = "ImageEffectPackagerForm";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.Button btnPackage;
        private System.Windows.Forms.Label lblAssetsFolderPath;
        private System.Windows.Forms.Label lblPackageFilePath;
        private System.Windows.Forms.TextBox txtPackageFilePath;
        private System.Windows.Forms.Button btnPackageFilePathBrowse;
        private System.Windows.Forms.TextBox txtAssetsFolderPath;
        private System.Windows.Forms.Button btnAssetsFolderPathBrowse;
        private System.Windows.Forms.Button btnOpenImageEffectsFolder;
    }
}
```

--------------------------------------------------------------------------------

````
