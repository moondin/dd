---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 225
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 225 of 650)

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

---[FILE: PinToScreenOptionsForm.Designer.cs]---
Location: ShareX-develop/ShareX/Tools/PinToScreen/PinToScreenOptionsForm.Designer.cs

```csharp
namespace ShareX
{
    partial class PinToScreenOptionsForm
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(PinToScreenOptionsForm));
            this.btnOK = new System.Windows.Forms.Button();
            this.btnCancel = new System.Windows.Forms.Button();
            this.lblPlacement = new System.Windows.Forms.Label();
            this.cbPlacement = new System.Windows.Forms.ComboBox();
            this.lblPlacementOffset = new System.Windows.Forms.Label();
            this.nudPlacementOffset = new System.Windows.Forms.NumericUpDown();
            this.cbTopMost = new System.Windows.Forms.CheckBox();
            this.cbKeepCenterLocation = new System.Windows.Forms.CheckBox();
            this.cbShadow = new System.Windows.Forms.CheckBox();
            this.cbBorder = new System.Windows.Forms.CheckBox();
            this.lblBorderSize = new System.Windows.Forms.Label();
            this.nudBorderSize = new System.Windows.Forms.NumericUpDown();
            this.btnBorderColor = new ShareX.HelpersLib.ColorButton();
            this.lblMinimizeSize = new System.Windows.Forms.Label();
            this.nudMinimizeSizeWidth = new System.Windows.Forms.NumericUpDown();
            this.nudMinimizeSizeHeight = new System.Windows.Forms.NumericUpDown();
            this.lblMinimizeSizeX = new System.Windows.Forms.Label();
            this.lblScaleStep = new System.Windows.Forms.Label();
            this.nudScaleStep = new System.Windows.Forms.NumericUpDown();
            ((System.ComponentModel.ISupportInitialize)(this.nudPlacementOffset)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudBorderSize)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudMinimizeSizeWidth)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudMinimizeSizeHeight)).BeginInit();
            this.SuspendLayout();
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
            // lblPlacement
            // 
            resources.ApplyResources(this.lblPlacement, "lblPlacement");
            this.lblPlacement.Name = "lblPlacement";
            // 
            // cbPlacement
            // 
            this.cbPlacement.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cbPlacement.FormattingEnabled = true;
            resources.ApplyResources(this.cbPlacement, "cbPlacement");
            this.cbPlacement.Name = "cbPlacement";
            // 
            // lblPlacementOffset
            // 
            resources.ApplyResources(this.lblPlacementOffset, "lblPlacementOffset");
            this.lblPlacementOffset.Name = "lblPlacementOffset";
            // 
            // nudPlacementOffset
            // 
            resources.ApplyResources(this.nudPlacementOffset, "nudPlacementOffset");
            this.nudPlacementOffset.Maximum = new decimal(new int[] {
            300,
            0,
            0,
            0});
            this.nudPlacementOffset.Name = "nudPlacementOffset";
            // 
            // cbTopMost
            // 
            resources.ApplyResources(this.cbTopMost, "cbTopMost");
            this.cbTopMost.Name = "cbTopMost";
            this.cbTopMost.UseVisualStyleBackColor = true;
            // 
            // cbKeepCenterLocation
            // 
            resources.ApplyResources(this.cbKeepCenterLocation, "cbKeepCenterLocation");
            this.cbKeepCenterLocation.Name = "cbKeepCenterLocation";
            this.cbKeepCenterLocation.UseVisualStyleBackColor = true;
            // 
            // cbShadow
            // 
            resources.ApplyResources(this.cbShadow, "cbShadow");
            this.cbShadow.Name = "cbShadow";
            this.cbShadow.UseVisualStyleBackColor = true;
            // 
            // cbBorder
            // 
            resources.ApplyResources(this.cbBorder, "cbBorder");
            this.cbBorder.Name = "cbBorder";
            this.cbBorder.UseVisualStyleBackColor = true;
            // 
            // lblBorderSize
            // 
            resources.ApplyResources(this.lblBorderSize, "lblBorderSize");
            this.lblBorderSize.Name = "lblBorderSize";
            // 
            // nudBorderSize
            // 
            resources.ApplyResources(this.nudBorderSize, "nudBorderSize");
            this.nudBorderSize.Maximum = new decimal(new int[] {
            30,
            0,
            0,
            0});
            this.nudBorderSize.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.nudBorderSize.Name = "nudBorderSize";
            this.nudBorderSize.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            // 
            // btnBorderColor
            // 
            this.btnBorderColor.Color = System.Drawing.Color.Empty;
            this.btnBorderColor.ColorPickerOptions = null;
            resources.ApplyResources(this.btnBorderColor, "btnBorderColor");
            this.btnBorderColor.Name = "btnBorderColor";
            this.btnBorderColor.UseVisualStyleBackColor = true;
            // 
            // lblMinimizeSize
            // 
            resources.ApplyResources(this.lblMinimizeSize, "lblMinimizeSize");
            this.lblMinimizeSize.Name = "lblMinimizeSize";
            // 
            // nudMinimizeSizeWidth
            // 
            resources.ApplyResources(this.nudMinimizeSizeWidth, "nudMinimizeSizeWidth");
            this.nudMinimizeSizeWidth.Maximum = new decimal(new int[] {
            1000,
            0,
            0,
            0});
            this.nudMinimizeSizeWidth.Name = "nudMinimizeSizeWidth";
            // 
            // nudMinimizeSizeHeight
            // 
            resources.ApplyResources(this.nudMinimizeSizeHeight, "nudMinimizeSizeHeight");
            this.nudMinimizeSizeHeight.Maximum = new decimal(new int[] {
            1000,
            0,
            0,
            0});
            this.nudMinimizeSizeHeight.Name = "nudMinimizeSizeHeight";
            // 
            // lblMinimizeSizeX
            // 
            resources.ApplyResources(this.lblMinimizeSizeX, "lblMinimizeSizeX");
            this.lblMinimizeSizeX.Name = "lblMinimizeSizeX";
            //
            // lblScaleStep
            //
            resources.ApplyResources(this.lblScaleStep, "lblScaleStep");
            this.lblScaleStep.Name = "lblScaleStep";
            //
            // nudScaleStep
            //
            resources.ApplyResources(this.nudScaleStep, "nudScaleStep");
            this.nudScaleStep.Maximum = new decimal(new int[] {
            100,
            0,
            0,
            0});
            this.nudScaleStep.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.nudScaleStep.Name = "nudScaleStep";
            this.nudScaleStep.Value = new decimal(new int[] {
            10,
            0,
            0,
            0});
            // 
            // PinToScreenOptionsForm
            // 
            resources.ApplyResources(this, "$this");
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.nudScaleStep);
            this.Controls.Add(this.lblScaleStep);
            this.Controls.Add(this.lblMinimizeSizeX);
            this.Controls.Add(this.nudMinimizeSizeHeight);
            this.Controls.Add(this.nudMinimizeSizeWidth);
            this.Controls.Add(this.lblMinimizeSize);
            this.Controls.Add(this.btnBorderColor);
            this.Controls.Add(this.nudBorderSize);
            this.Controls.Add(this.lblBorderSize);
            this.Controls.Add(this.cbBorder);
            this.Controls.Add(this.cbShadow);
            this.Controls.Add(this.cbKeepCenterLocation);
            this.Controls.Add(this.cbTopMost);
            this.Controls.Add(this.nudPlacementOffset);
            this.Controls.Add(this.lblPlacementOffset);
            this.Controls.Add(this.cbPlacement);
            this.Controls.Add(this.lblPlacement);
            this.Controls.Add(this.btnCancel);
            this.Controls.Add(this.btnOK);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Name = "PinToScreenOptionsForm";
            ((System.ComponentModel.ISupportInitialize)(this.nudPlacementOffset)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudBorderSize)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudMinimizeSizeWidth)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudMinimizeSizeHeight)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnOK;
        private System.Windows.Forms.Button btnCancel;
        private System.Windows.Forms.Label lblPlacement;
        private System.Windows.Forms.ComboBox cbPlacement;
        private System.Windows.Forms.Label lblPlacementOffset;
        private System.Windows.Forms.NumericUpDown nudPlacementOffset;
        private System.Windows.Forms.CheckBox cbTopMost;
        private System.Windows.Forms.CheckBox cbKeepCenterLocation;
        private System.Windows.Forms.CheckBox cbShadow;
        private System.Windows.Forms.CheckBox cbBorder;
        private System.Windows.Forms.Label lblBorderSize;
        private System.Windows.Forms.NumericUpDown nudBorderSize;
        private HelpersLib.ColorButton btnBorderColor;
        private System.Windows.Forms.Label lblMinimizeSize;
        private System.Windows.Forms.NumericUpDown nudMinimizeSizeWidth;
        private System.Windows.Forms.NumericUpDown nudMinimizeSizeHeight;
        private System.Windows.Forms.Label lblMinimizeSizeX;
        private System.Windows.Forms.Label lblScaleStep;
        private System.Windows.Forms.NumericUpDown nudScaleStep;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: PinToScreenOptionsForm.es-MX.resx]---
Location: ShareX-develop/ShareX/Tools/PinToScreen/PinToScreenOptionsForm.es-MX.resx

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
  <data name="btnOK.Text" xml:space="preserve">
    <value>Aceptar</value>
  </data>
  <data name="btnCancel.Text" xml:space="preserve">
    <value>Cancelar</value>
  </data>
  <data name="lblPlacement.Text" xml:space="preserve">
    <value>Posición:</value>
  </data>
  <data name="lblPlacementOffset.Text" xml:space="preserve">
    <value>Desplazamiento de posición:</value>
  </data>
  <data name="cbKeepCenterLocation.Text" xml:space="preserve">
    <value>Mantener ubicación del centro</value>
  </data>
  <data name="cbShadow.Text" xml:space="preserve">
    <value>Sombra</value>
  </data>
  <data name="cbBorder.Text" xml:space="preserve">
    <value>Borde</value>
  </data>
  <data name="lblBorderSize.Text" xml:space="preserve">
    <value>Tamaño de borde:</value>
  </data>
  <data name="btnBorderColor.Text" xml:space="preserve">
    <value>Color de borde:</value>
  </data>
  <data name="lblMinimizeSize.Text" xml:space="preserve">
    <value>Minimizar tamaño:</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - Ajustes de fijar a pantalla</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: PinToScreenOptionsForm.fr.resx]---
Location: ShareX-develop/ShareX/Tools/PinToScreen/PinToScreenOptionsForm.fr.resx

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
    <value>Annuler</value>
  </data>
  <data name="lblPlacement.Text" xml:space="preserve">
    <value>Positionnement :</value>
  </data>
  <data name="lblPlacementOffset.Text" xml:space="preserve">
    <value>Décalage du positionnement :</value>
  </data>
  <data name="cbTopMost.Text" xml:space="preserve">
    <value>Au premier-plan</value>
  </data>
  <data name="cbKeepCenterLocation.Text" xml:space="preserve">
    <value>Maintenir au centre</value>
  </data>
  <data name="cbShadow.Text" xml:space="preserve">
    <value>Ombre</value>
  </data>
  <data name="cbBorder.Text" xml:space="preserve">
    <value>Bord</value>
  </data>
  <data name="lblBorderSize.Text" xml:space="preserve">
    <value>Taille du bord :</value>
  </data>
  <data name="btnBorderColor.Text" xml:space="preserve">
    <value>Couleur du bord</value>
  </data>
  <data name="lblMinimizeSize.Text" xml:space="preserve">
    <value>Taille minimale :</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - Options épingler à l'écran</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: PinToScreenOptionsForm.ja-JP.resx]---
Location: ShareX-develop/ShareX/Tools/PinToScreen/PinToScreenOptionsForm.ja-JP.resx

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
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - 最前面に固定 オプション</value>
  </data>
  <data name="btnCancel.Text" xml:space="preserve">
    <value>キャンセル</value>
  </data>
  <data name="cbBorder.Text" xml:space="preserve">
    <value>枠線</value>
  </data>
  <data name="lblBorderSize.Text" xml:space="preserve">
    <value>枠線の大きさ:</value>
  </data>
  <data name="btnBorderColor.Text" xml:space="preserve">
    <value>枠線の色</value>
  </data>
  <data name="cbShadow.Text" xml:space="preserve">
    <value>影</value>
  </data>
  <data name="cbTopMost.Text" xml:space="preserve">
    <value>最前面に固定</value>
  </data>
  <data name="lblPlacement.Text" xml:space="preserve">
    <value>位置:</value>
  </data>
  <data name="lblPlacementOffset.Text" xml:space="preserve">
    <value>位置の補正:</value>
  </data>
  <data name="cbKeepCenterLocation.Text" xml:space="preserve">
    <value>中央の位置を保つ</value>
  </data>
  <data name="lblMinimizeSize.Text" xml:space="preserve">
    <value>最小の大きさ:</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
