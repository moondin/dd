---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 410
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 410 of 650)

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

---[FILE: Skew.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Manipulations/Skew.cs

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
    internal class Skew : ImageEffect
    {
        [DefaultValue(0), Description("How much pixel skew left to right.")]
        public int Horizontally { get; set; }

        [DefaultValue(0), Description("How much pixel skew top to bottom.")]
        public int Vertically { get; set; }

        public Skew()
        {
            this.ApplyDefaultPropertyValues();
        }

        public override Bitmap Apply(Bitmap bmp)
        {
            if (Horizontally == 0 && Vertically == 0)
            {
                return bmp;
            }

            return ImageHelpers.AddSkew(bmp, Horizontally, Vertically);
        }

        protected override string GetSummary()
        {
            return $"{Horizontally}px, {Vertically}px";
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Resources.ar-YE.resx]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Properties/Resources.ar-YE.resx

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
  <data name="WouldYouLikeToClearEffects" xml:space="preserve">
    <value>هل تريد إزالة المؤئرات؟</value>
  </data>
  <data name="ImageEffectsForm_EditorMode_Cancel" xml:space="preserve">
    <value>إلغاء</value>
  </data>
  <data name="Confirmation" xml:space="preserve">
    <value>التأكيد</value>
  </data>
  <data name="ImageEffectsForm_AddAllEffectsToTreeView_Drawings" xml:space="preserve">
    <value>الرّسومات</value>
  </data>
  <data name="ImageEffectsForm_AddAllEffectsToTreeView_Filters" xml:space="preserve">
    <value>المرشّحات</value>
  </data>
  <data name="AssetsFolderMustBeInsideShareXImageEffectsFolder" xml:space="preserve">
    <value>مجلد الوسائط يجب أن يكون داخل مجلد المؤثرات الخاص بـ ShareX.</value>
  </data>
  <data name="ImageEffectsForm_AddAllEffectsToTreeView_Manipulations" xml:space="preserve">
    <value>المعالجة</value>
  </data>
  <data name="MissingPresetName" xml:space="preserve">
    <value>لا يوجد اسم للتفضيلات</value>
  </data>
  <data name="PackageWithThisFileNameAlreadyExistsRNWouldYouLikeToOverwriteIt" xml:space="preserve">
    <value>هناك حزمة لديها الاسم نفسه.
هل تريد استبدالها؟</value>
  </data>
  <data name="PresetNameCannotBeEmpty" xml:space="preserve">
    <value>يجب إدخال اسم التفضيل.</value>
  </data>
  <data name="ImageEffectsForm_AddAllEffectsToTreeView_Adjustments" xml:space="preserve">
    <value>تعديلات</value>
  </data>
  <data name="ImageEffectsForm_UpdatePreview_Image_effects___Width___0___Height___1___Render_time___2__ms" xml:space="preserve">
    <value>مؤثرات الصور -  العرض: {0}, الارتفاع: {1}, مدة المعالجة: {2} ms</value>
  </data>
  <data name="InvalidAssetsFolderPath" xml:space="preserve">
    <value>مجلد ملفات التطبيق غير صالح</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: Resources.de.resx]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Properties/Resources.de.resx

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
  <data name="ImageEffectsForm_AddAllEffectsToTreeView_Adjustments" xml:space="preserve">
    <value>Anpassungen</value>
  </data>
  <data name="ImageEffectsForm_AddAllEffectsToTreeView_Drawings" xml:space="preserve">
    <value>Zeichnungen</value>
  </data>
  <data name="ImageEffectsForm_AddAllEffectsToTreeView_Filters" xml:space="preserve">
    <value>Filter</value>
  </data>
  <data name="ImageEffectsForm_AddAllEffectsToTreeView_Manipulations" xml:space="preserve">
    <value>Manipulationen</value>
  </data>
  <data name="ImageEffectsForm_UpdatePreview_Image_effects___Width___0___Height___1___Render_time___2__ms" xml:space="preserve">
    <value>Bildeffekte - Breite: {0}, Höhe: {1}, Renderzeit: {2} ms</value>
  </data>
  <data name="ImageEffectsForm_EditorMode_Cancel" xml:space="preserve">
    <value>Abbrechen</value>
  </data>
  <data name="AssetsFolderMustBeInsideShareXImageEffectsFolder" xml:space="preserve">
    <value>Der Ordner Assets muss sich im ShareX-Ordner für Bildeffekte befinden.</value>
  </data>
  <data name="InvalidAssetsFolderPath" xml:space="preserve">
    <value>Ungültiger Pfad zum Asset-Ordner</value>
  </data>
  <data name="PackageWithThisFileNameAlreadyExistsRNWouldYouLikeToOverwriteIt" xml:space="preserve">
    <value>Ein Paket mit diesem Dateinamen existiert bereits.
Möchten Sie es überschreiben?</value>
  </data>
  <data name="WouldYouLikeToClearEffects" xml:space="preserve">
    <value>Möchten Sie Effekte löschen?</value>
  </data>
  <data name="Confirmation" xml:space="preserve">
    <value>Bestätigung</value>
  </data>
  <data name="PresetNameCannotBeEmpty" xml:space="preserve">
    <value>Der Name der Voreinstellung darf nicht leer sein.</value>
  </data>
  <data name="MissingPresetName" xml:space="preserve">
    <value>Fehlender Name der Voreinstellung</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: Resources.Designer.cs]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Properties/Resources.Designer.cs

```csharp
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ShareX.ImageEffectsLib.Properties {
    using System;
    
    
    /// <summary>
    ///   A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "17.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    internal class Resources {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal Resources() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("ShareX.ImageEffectsLib.Properties.Resources", typeof(Resources).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   Overrides the current thread's CurrentUICulture property for all
        ///   resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Looks up a localized resource of type System.Drawing.Bitmap.
        /// </summary>
        internal static System.Drawing.Bitmap arrow_circle_double_135 {
            get {
                object obj = ResourceManager.GetObject("arrow-circle-double-135", resourceCulture);
                return ((System.Drawing.Bitmap)(obj));
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Assets folder must be inside ShareX image effects folder..
        /// </summary>
        internal static string AssetsFolderMustBeInsideShareXImageEffectsFolder {
            get {
                return ResourceManager.GetString("AssetsFolderMustBeInsideShareXImageEffectsFolder", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Confirmation.
        /// </summary>
        internal static string Confirmation {
            get {
                return ResourceManager.GetString("Confirmation", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized resource of type System.Drawing.Bitmap.
        /// </summary>
        internal static System.Drawing.Bitmap document_copy {
            get {
                object obj = ResourceManager.GetObject("document-copy", resourceCulture);
                return ((System.Drawing.Bitmap)(obj));
            }
        }
        
        /// <summary>
        ///   Looks up a localized resource of type System.Drawing.Bitmap.
        /// </summary>
        internal static System.Drawing.Bitmap eraser {
            get {
                object obj = ResourceManager.GetObject("eraser", resourceCulture);
                return ((System.Drawing.Bitmap)(obj));
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Adjustments.
        /// </summary>
        internal static string ImageEffectsForm_AddAllEffectsToTreeView_Adjustments {
            get {
                return ResourceManager.GetString("ImageEffectsForm_AddAllEffectsToTreeView_Adjustments", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Drawings.
        /// </summary>
        internal static string ImageEffectsForm_AddAllEffectsToTreeView_Drawings {
            get {
                return ResourceManager.GetString("ImageEffectsForm_AddAllEffectsToTreeView_Drawings", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Filters.
        /// </summary>
        internal static string ImageEffectsForm_AddAllEffectsToTreeView_Filters {
            get {
                return ResourceManager.GetString("ImageEffectsForm_AddAllEffectsToTreeView_Filters", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Manipulations.
        /// </summary>
        internal static string ImageEffectsForm_AddAllEffectsToTreeView_Manipulations {
            get {
                return ResourceManager.GetString("ImageEffectsForm_AddAllEffectsToTreeView_Manipulations", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Cancel.
        /// </summary>
        internal static string ImageEffectsForm_EditorMode_Cancel {
            get {
                return ResourceManager.GetString("ImageEffectsForm_EditorMode_Cancel", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Image effects - Width: {0}, Height: {1}, Render time: {2} ms.
        /// </summary>
        internal static string ImageEffectsForm_UpdatePreview_Image_effects___Width___0___Height___1___Render_time___2__ms {
            get {
                return ResourceManager.GetString("ImageEffectsForm_UpdatePreview_Image_effects___Width___0___Height___1___Render_ti" +
                        "me___2__ms", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Invalid assets folder path.
        /// </summary>
        internal static string InvalidAssetsFolderPath {
            get {
                return ResourceManager.GetString("InvalidAssetsFolderPath", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized resource of type System.Drawing.Bitmap.
        /// </summary>
        internal static System.Drawing.Bitmap minus {
            get {
                object obj = ResourceManager.GetObject("minus", resourceCulture);
                return ((System.Drawing.Bitmap)(obj));
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Missing preset name.
        /// </summary>
        internal static string MissingPresetName {
            get {
                return ResourceManager.GetString("MissingPresetName", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Package with this file name already exists.
        ///Would you like to overwrite it?.
        /// </summary>
        internal static string PackageWithThisFileNameAlreadyExistsRNWouldYouLikeToOverwriteIt {
            get {
                return ResourceManager.GetString("PackageWithThisFileNameAlreadyExistsRNWouldYouLikeToOverwriteIt", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized resource of type System.Drawing.Bitmap.
        /// </summary>
        internal static System.Drawing.Bitmap plus {
            get {
                object obj = ResourceManager.GetObject("plus", resourceCulture);
                return ((System.Drawing.Bitmap)(obj));
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Preset name cannot be empty..
        /// </summary>
        internal static string PresetNameCannotBeEmpty {
            get {
                return ResourceManager.GetString("PresetNameCannotBeEmpty", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Would you like to clear effects?.
        /// </summary>
        internal static string WouldYouLikeToClearEffects {
            get {
                return ResourceManager.GetString("WouldYouLikeToClearEffects", resourceCulture);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Resources.es-MX.resx]---
Location: ShareX-develop/ShareX.ImageEffectsLib/Properties/Resources.es-MX.resx

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
  <data name="ImageEffectsForm_AddAllEffectsToTreeView_Adjustments" xml:space="preserve">
    <value>Ajustes</value>
  </data>
  <data name="ImageEffectsForm_AddAllEffectsToTreeView_Drawings" xml:space="preserve">
    <value>Dibujos</value>
  </data>
  <data name="ImageEffectsForm_AddAllEffectsToTreeView_Filters" xml:space="preserve">
    <value>Filtros</value>
  </data>
  <data name="ImageEffectsForm_AddAllEffectsToTreeView_Manipulations" xml:space="preserve">
    <value>Transformación</value>
  </data>
  <data name="ImageEffectsForm_EditorMode_Cancel" xml:space="preserve">
    <value>Cancelar</value>
  </data>
  <data name="ImageEffectsForm_UpdatePreview_Image_effects___Width___0___Height___1___Render_time___2__ms" xml:space="preserve">
    <value>Efectos de imágenes - Ancho: {0}, Alto: {1}, Tiempo de procesamiento: {2} ms</value>
  </data>
  <data name="AssetsFolderMustBeInsideShareXImageEffectsFolder" xml:space="preserve">
    <value>La carpeta de recursos debe estar dentro de la carpeta de efectos de imagen de ShareX.</value>
  </data>
  <data name="InvalidAssetsFolderPath" xml:space="preserve">
    <value>Ruta de carpeta de recursos inválida</value>
  </data>
  <data name="PackageWithThisFileNameAlreadyExistsRNWouldYouLikeToOverwriteIt" xml:space="preserve">
    <value>Ya existe un paquete con este nombre de archivo.
¿Quieres sobreescribirlo?</value>
  </data>
  <data name="WouldYouLikeToClearEffects" xml:space="preserve">
    <value>¿Quieres limpiar los efectos?</value>
  </data>
  <data name="Confirmation" xml:space="preserve">
    <value>Confirmación</value>
  </data>
  <data name="PresetNameCannotBeEmpty" xml:space="preserve">
    <value>El nombre del preajuste no puede estar vacío.</value>
  </data>
  <data name="MissingPresetName" xml:space="preserve">
    <value>Nombre del preajuste no encontrado</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
