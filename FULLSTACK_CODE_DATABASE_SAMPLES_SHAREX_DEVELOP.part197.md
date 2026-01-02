---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 197
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 197 of 650)

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

---[FILE: MonitorTestForm.Designer.cs]---
Location: ShareX-develop/ShareX/Tools/MonitorTestForm.Designer.cs

```csharp
namespace ShareX
{
    partial class MonitorTestForm
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MonitorTestForm));
            pSettings = new System.Windows.Forms.Panel();
            btnScreenTearingTest = new System.Windows.Forms.Button();
            btnGradientColor2 = new HelpersLib.ColorButton();
            btnGradientColor1 = new HelpersLib.ColorButton();
            lblTip = new System.Windows.Forms.Label();
            cbGradient = new System.Windows.Forms.ComboBox();
            rbGradient = new System.Windows.Forms.RadioButton();
            btnClose = new System.Windows.Forms.Button();
            lblShapeSize = new System.Windows.Forms.Label();
            lblShapeSizeValue = new System.Windows.Forms.Label();
            tbShapeSize = new System.Windows.Forms.TrackBar();
            btnColorDialog = new System.Windows.Forms.Button();
            cbShapes = new System.Windows.Forms.ComboBox();
            rbShapes = new System.Windows.Forms.RadioButton();
            lblBlue = new System.Windows.Forms.Label();
            lblBlueValue = new System.Windows.Forms.Label();
            tbBlue = new System.Windows.Forms.TrackBar();
            lblGreen = new System.Windows.Forms.Label();
            lblGreenValue = new System.Windows.Forms.Label();
            tbGreen = new System.Windows.Forms.TrackBar();
            lblRed = new System.Windows.Forms.Label();
            lblRedValue = new System.Windows.Forms.Label();
            tbRed = new System.Windows.Forms.TrackBar();
            rbRedGreenBlue = new System.Windows.Forms.RadioButton();
            lblBlackWhiteValue = new System.Windows.Forms.Label();
            tbBlackWhite = new System.Windows.Forms.TrackBar();
            rbBlackWhite = new System.Windows.Forms.RadioButton();
            pSettings.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)tbShapeSize).BeginInit();
            ((System.ComponentModel.ISupportInitialize)tbBlue).BeginInit();
            ((System.ComponentModel.ISupportInitialize)tbGreen).BeginInit();
            ((System.ComponentModel.ISupportInitialize)tbRed).BeginInit();
            ((System.ComponentModel.ISupportInitialize)tbBlackWhite).BeginInit();
            SuspendLayout();
            // 
            // pSettings
            // 
            pSettings.BackColor = System.Drawing.SystemColors.Window;
            pSettings.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            pSettings.Controls.Add(btnScreenTearingTest);
            pSettings.Controls.Add(btnGradientColor2);
            pSettings.Controls.Add(btnGradientColor1);
            pSettings.Controls.Add(lblTip);
            pSettings.Controls.Add(cbGradient);
            pSettings.Controls.Add(rbGradient);
            pSettings.Controls.Add(btnClose);
            pSettings.Controls.Add(lblShapeSize);
            pSettings.Controls.Add(lblShapeSizeValue);
            pSettings.Controls.Add(tbShapeSize);
            pSettings.Controls.Add(btnColorDialog);
            pSettings.Controls.Add(cbShapes);
            pSettings.Controls.Add(rbShapes);
            pSettings.Controls.Add(lblBlue);
            pSettings.Controls.Add(lblBlueValue);
            pSettings.Controls.Add(tbBlue);
            pSettings.Controls.Add(lblGreen);
            pSettings.Controls.Add(lblGreenValue);
            pSettings.Controls.Add(tbGreen);
            pSettings.Controls.Add(lblRed);
            pSettings.Controls.Add(lblRedValue);
            pSettings.Controls.Add(tbRed);
            pSettings.Controls.Add(rbRedGreenBlue);
            pSettings.Controls.Add(lblBlackWhiteValue);
            pSettings.Controls.Add(tbBlackWhite);
            pSettings.Controls.Add(rbBlackWhite);
            resources.ApplyResources(pSettings, "pSettings");
            pSettings.Name = "pSettings";
            // 
            // btnScreenTearingTest
            // 
            resources.ApplyResources(btnScreenTearingTest, "btnScreenTearingTest");
            btnScreenTearingTest.Name = "btnScreenTearingTest";
            btnScreenTearingTest.UseVisualStyleBackColor = true;
            btnScreenTearingTest.Click += btnScreenTearingTest_Click;
            // 
            // btnGradientColor2
            // 
            btnGradientColor2.Color = System.Drawing.Color.Empty;
            btnGradientColor2.ColorPickerOptions = null;
            resources.ApplyResources(btnGradientColor2, "btnGradientColor2");
            btnGradientColor2.Name = "btnGradientColor2";
            btnGradientColor2.UseVisualStyleBackColor = true;
            btnGradientColor2.ColorChanged += btnGradientColor2_ColorChanged;
            // 
            // btnGradientColor1
            // 
            btnGradientColor1.Color = System.Drawing.Color.Empty;
            btnGradientColor1.ColorPickerOptions = null;
            resources.ApplyResources(btnGradientColor1, "btnGradientColor1");
            btnGradientColor1.Name = "btnGradientColor1";
            btnGradientColor1.UseVisualStyleBackColor = true;
            btnGradientColor1.ColorChanged += btnGradientColor1_ColorChanged;
            // 
            // lblTip
            // 
            lblTip.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            resources.ApplyResources(lblTip, "lblTip");
            lblTip.Name = "lblTip";
            // 
            // cbGradient
            // 
            cbGradient.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            cbGradient.FormattingEnabled = true;
            resources.ApplyResources(cbGradient, "cbGradient");
            cbGradient.Name = "cbGradient";
            cbGradient.SelectedIndexChanged += cbGradient_SelectedIndexChanged;
            // 
            // rbGradient
            // 
            resources.ApplyResources(rbGradient, "rbGradient");
            rbGradient.Name = "rbGradient";
            rbGradient.UseVisualStyleBackColor = true;
            rbGradient.CheckedChanged += rbGradient_CheckedChanged;
            // 
            // btnClose
            // 
            resources.ApplyResources(btnClose, "btnClose");
            btnClose.Name = "btnClose";
            btnClose.UseVisualStyleBackColor = true;
            btnClose.Click += btnClose_Click;
            // 
            // lblShapeSize
            // 
            resources.ApplyResources(lblShapeSize, "lblShapeSize");
            lblShapeSize.Name = "lblShapeSize";
            // 
            // lblShapeSizeValue
            // 
            resources.ApplyResources(lblShapeSizeValue, "lblShapeSizeValue");
            lblShapeSizeValue.Name = "lblShapeSizeValue";
            // 
            // tbShapeSize
            // 
            resources.ApplyResources(tbShapeSize, "tbShapeSize");
            tbShapeSize.Maximum = 100;
            tbShapeSize.Minimum = 1;
            tbShapeSize.Name = "tbShapeSize";
            tbShapeSize.TickStyle = System.Windows.Forms.TickStyle.None;
            tbShapeSize.Value = 1;
            tbShapeSize.ValueChanged += tbShapeSize_ValueChanged;
            // 
            // btnColorDialog
            // 
            resources.ApplyResources(btnColorDialog, "btnColorDialog");
            btnColorDialog.Name = "btnColorDialog";
            btnColorDialog.UseVisualStyleBackColor = true;
            btnColorDialog.Click += btnColorDialog_Click;
            // 
            // cbShapes
            // 
            cbShapes.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            cbShapes.FormattingEnabled = true;
            cbShapes.Items.AddRange(new object[] { resources.GetString("cbShapes.Items"), resources.GetString("cbShapes.Items1"), resources.GetString("cbShapes.Items2") });
            resources.ApplyResources(cbShapes, "cbShapes");
            cbShapes.Name = "cbShapes";
            cbShapes.SelectedIndexChanged += cbShapes_SelectedIndexChanged;
            // 
            // rbShapes
            // 
            resources.ApplyResources(rbShapes, "rbShapes");
            rbShapes.Name = "rbShapes";
            rbShapes.UseVisualStyleBackColor = true;
            rbShapes.CheckedChanged += rbShapes_CheckedChanged;
            // 
            // lblBlue
            // 
            resources.ApplyResources(lblBlue, "lblBlue");
            lblBlue.Name = "lblBlue";
            // 
            // lblBlueValue
            // 
            resources.ApplyResources(lblBlueValue, "lblBlueValue");
            lblBlueValue.Name = "lblBlueValue";
            // 
            // tbBlue
            // 
            resources.ApplyResources(tbBlue, "tbBlue");
            tbBlue.Maximum = 255;
            tbBlue.Name = "tbBlue";
            tbBlue.TickStyle = System.Windows.Forms.TickStyle.None;
            tbBlue.ValueChanged += tbRedGreenBlue_ValueChanged;
            // 
            // lblGreen
            // 
            resources.ApplyResources(lblGreen, "lblGreen");
            lblGreen.Name = "lblGreen";
            // 
            // lblGreenValue
            // 
            resources.ApplyResources(lblGreenValue, "lblGreenValue");
            lblGreenValue.Name = "lblGreenValue";
            // 
            // tbGreen
            // 
            resources.ApplyResources(tbGreen, "tbGreen");
            tbGreen.Maximum = 255;
            tbGreen.Name = "tbGreen";
            tbGreen.TickStyle = System.Windows.Forms.TickStyle.None;
            tbGreen.ValueChanged += tbRedGreenBlue_ValueChanged;
            // 
            // lblRed
            // 
            resources.ApplyResources(lblRed, "lblRed");
            lblRed.Name = "lblRed";
            // 
            // lblRedValue
            // 
            resources.ApplyResources(lblRedValue, "lblRedValue");
            lblRedValue.Name = "lblRedValue";
            // 
            // tbRed
            // 
            resources.ApplyResources(tbRed, "tbRed");
            tbRed.Maximum = 255;
            tbRed.Name = "tbRed";
            tbRed.TickStyle = System.Windows.Forms.TickStyle.None;
            tbRed.ValueChanged += tbRedGreenBlue_ValueChanged;
            // 
            // rbRedGreenBlue
            // 
            resources.ApplyResources(rbRedGreenBlue, "rbRedGreenBlue");
            rbRedGreenBlue.Name = "rbRedGreenBlue";
            rbRedGreenBlue.UseVisualStyleBackColor = true;
            rbRedGreenBlue.CheckedChanged += rbRedGreenBlue_CheckedChanged;
            // 
            // lblBlackWhiteValue
            // 
            resources.ApplyResources(lblBlackWhiteValue, "lblBlackWhiteValue");
            lblBlackWhiteValue.Name = "lblBlackWhiteValue";
            // 
            // tbBlackWhite
            // 
            resources.ApplyResources(tbBlackWhite, "tbBlackWhite");
            tbBlackWhite.Maximum = 255;
            tbBlackWhite.Name = "tbBlackWhite";
            tbBlackWhite.TickStyle = System.Windows.Forms.TickStyle.None;
            tbBlackWhite.ValueChanged += tbBlackWhite_ValueChanged;
            // 
            // rbBlackWhite
            // 
            resources.ApplyResources(rbBlackWhite, "rbBlackWhite");
            rbBlackWhite.Name = "rbBlackWhite";
            rbBlackWhite.UseVisualStyleBackColor = true;
            rbBlackWhite.CheckedChanged += rbBlackWhite_CheckedChanged;
            // 
            // MonitorTestForm
            // 
            resources.ApplyResources(this, "$this");
            AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            BackColor = System.Drawing.Color.White;
            Controls.Add(pSettings);
            DoubleBuffered = true;
            FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            Name = "MonitorTestForm";
            TopMost = true;
            MouseDown += MonitorTestForm_MouseDown;
            pSettings.ResumeLayout(false);
            pSettings.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)tbShapeSize).EndInit();
            ((System.ComponentModel.ISupportInitialize)tbBlue).EndInit();
            ((System.ComponentModel.ISupportInitialize)tbGreen).EndInit();
            ((System.ComponentModel.ISupportInitialize)tbRed).EndInit();
            ((System.ComponentModel.ISupportInitialize)tbBlackWhite).EndInit();
            ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Panel pSettings;
        private System.Windows.Forms.Label lblBlackWhiteValue;
        private System.Windows.Forms.TrackBar tbBlackWhite;
        private System.Windows.Forms.RadioButton rbBlackWhite;
        private System.Windows.Forms.Label lblBlue;
        private System.Windows.Forms.Label lblBlueValue;
        private System.Windows.Forms.TrackBar tbBlue;
        private System.Windows.Forms.Label lblGreen;
        private System.Windows.Forms.Label lblGreenValue;
        private System.Windows.Forms.TrackBar tbGreen;
        private System.Windows.Forms.Label lblRed;
        private System.Windows.Forms.Label lblRedValue;
        private System.Windows.Forms.TrackBar tbRed;
        private System.Windows.Forms.RadioButton rbRedGreenBlue;
        private System.Windows.Forms.ComboBox cbShapes;
        private System.Windows.Forms.RadioButton rbShapes;
        private System.Windows.Forms.Button btnColorDialog;
        private System.Windows.Forms.Label lblShapeSize;
        private System.Windows.Forms.Label lblShapeSizeValue;
        private System.Windows.Forms.TrackBar tbShapeSize;
        private System.Windows.Forms.Button btnClose;
        private System.Windows.Forms.ComboBox cbGradient;
        private System.Windows.Forms.RadioButton rbGradient;
        private System.Windows.Forms.Label lblTip;
        private HelpersLib.ColorButton btnGradientColor2;
        private HelpersLib.ColorButton btnGradientColor1;
        private System.Windows.Forms.Button btnScreenTearingTest;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: MonitorTestForm.es-MX.resx]---
Location: ShareX-develop/ShareX/Tools/MonitorTestForm.es-MX.resx

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
  <data name="btnScreenTearingTest.Text" xml:space="preserve">
    <value>Iniciar prueba de animación</value>
  </data>
  <data name="btnGradientColor2.Text" xml:space="preserve">
    <value>Color 2</value>
  </data>
  <data name="btnGradientColor1.Text" xml:space="preserve">
    <value>Color 1</value>
  </data>
  <data name="lblTip.Text" xml:space="preserve">
    <value>Clic fuera de este panel para ocultarlo o mostrarlo.</value>
  </data>
  <data name="rbGradient.Text" xml:space="preserve">
    <value>Degradado:</value>
  </data>
  <data name="btnClose.Text" xml:space="preserve">
    <value>Cerrar</value>
  </data>
  <data name="lblShapeSize.Text" xml:space="preserve">
    <value>Tamaño:</value>
  </data>
  <data name="btnColorDialog.Text" xml:space="preserve">
    <value>Seleccionar color...</value>
  </data>
  <data name="cbShapes.Items" xml:space="preserve">
    <value>Líneas horizontales</value>
  </data>
  <data name="cbShapes.Items1" xml:space="preserve">
    <value>Líneas verticales</value>
  </data>
  <data name="cbShapes.Items2" xml:space="preserve">
    <value>Cuadrícula bicolor</value>
  </data>
  <data name="rbShapes.Text" xml:space="preserve">
    <value>Forma:</value>
  </data>
  <data name="lblBlue.Text" xml:space="preserve">
    <value>A:</value>
  </data>
  <data name="lblGreen.Text" xml:space="preserve">
    <value>V:</value>
  </data>
  <data name="lblRed.Text" xml:space="preserve">
    <value>R:</value>
  </data>
  <data name="rbRedGreenBlue.Text" xml:space="preserve">
    <value>Rojo, Verde, Azul:</value>
  </data>
  <data name="rbBlackWhite.Text" xml:space="preserve">
    <value>Negro, Blanco:</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - Prueba de monitor</value>
  </data>
  <data name="lblBlackWhiteValue.Text" xml:space="preserve">
    <value>0</value>
  </data>
  <data name="lblBlueValue.Text" xml:space="preserve">
    <value>0</value>
  </data>
  <data name="lblGreenValue.Text" xml:space="preserve">
    <value>0</value>
  </data>
  <data name="lblRedValue.Text" xml:space="preserve">
    <value>0</value>
  </data>
  <data name="lblShapeSizeValue.Text" xml:space="preserve">
    <value>1</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: MonitorTestForm.es.resx]---
Location: ShareX-develop/ShareX/Tools/MonitorTestForm.es.resx

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
  <data name="btnClose.Text" xml:space="preserve">
    <value>Cerrar</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>Prueba del monitor</value>
  </data>
  <data name="btnGradientColor1.Text" xml:space="preserve">
    <value>Color 1</value>
  </data>
  <data name="btnGradientColor2.Text" xml:space="preserve">
    <value>Color 2</value>
  </data>
  <data name="btnColorDialog.Text" xml:space="preserve">
    <value>Diálogo de color...</value>
  </data>
  <data name="cbShapes.Items" xml:space="preserve">
    <value>Verificador</value>
  </data>
  <data name="cbShapes.Items1" xml:space="preserve">
    <value>Líneas horizontales</value>
  </data>
  <data name="cbShapes.Items2" xml:space="preserve">
    <value>Líneas verticales</value>
  </data>
  <data name="lblBlue.Text" xml:space="preserve">
    <value>B:</value>
  </data>
  <data name="lblGreen.Text" xml:space="preserve">
    <value>G:</value>
  </data>
  <data name="lblRed.Text" xml:space="preserve">
    <value>R:</value>
  </data>
  <data name="lblShapeSize.Text" xml:space="preserve">
    <value>Tamaño:</value>
  </data>
  <data name="rbGradient.Text" xml:space="preserve">
    <value>Gradiente:</value>
  </data>
  <data name="rbRedGreenBlue.Text" xml:space="preserve">
    <value>Rojo, Verde, Azul:</value>
  </data>
  <data name="rbBlackWhite.Text" xml:space="preserve">
    <value>Negro, Blanco:</value>
  </data>
  <data name="lblTip.Text" xml:space="preserve">
    <value>Puede hacer clic fuera para ocultar / mostrar este panel.</value>
  </data>
  <data name="rbShapes.Text" xml:space="preserve">
    <value>Forma:</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: MonitorTestForm.fa-IR.resx]---
Location: ShareX-develop/ShareX/Tools/MonitorTestForm.fa-IR.resx

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
  <data name="btnScreenTearingTest.Text" xml:space="preserve">
    <value>تست انمیشین را شروع کن</value>
  </data>
  <data name="btnClose.Text" xml:space="preserve">
    <value>بستن</value>
  </data>
  <assembly alias="System.Drawing" name="System.Drawing, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a" />
  <data name="lblShapeSize.Size" type="System.Drawing.Size, System.Drawing">
    <value>32, 13</value>
  </data>
  <data name="lblShapeSize.Text" xml:space="preserve">
    <value>سایز:</value>
  </data>
  <data name="rbShapes.Size" type="System.Drawing.Size, System.Drawing">
    <value>51, 17</value>
  </data>
  <data name="rbShapes.Text" xml:space="preserve">
    <value>شکل:</value>
  </data>
  <data name="rbRedGreenBlue.Size" type="System.Drawing.Size, System.Drawing">
    <value>101, 17</value>
  </data>
  <data name="rbRedGreenBlue.Text" xml:space="preserve">
    <value>قرمز، سبز، آبی:</value>
  </data>
  <data name="rbBlackWhite.Size" type="System.Drawing.Size, System.Drawing">
    <value>82, 17</value>
  </data>
  <data name="rbBlackWhite.Text" xml:space="preserve">
    <value>سیاه، سفید:</value>
  </data>
  <data name="cbShapes.Items1" xml:space="preserve">
    <value>خطوط عمودی</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - تست صفحه نمایش</value>
  </data>
  <data name="lblBlackWhiteValue.Text" xml:space="preserve">
    <value>۰</value>
  </data>
  <data name="lblRedValue.Text" xml:space="preserve">
    <value>۰</value>
  </data>
  <data name="lblBlueValue.Text" xml:space="preserve">
    <value>۰</value>
  </data>
  <data name="lblGreenValue.Text" xml:space="preserve">
    <value>۰</value>
  </data>
  <data name="lblShapeSizeValue.Text" xml:space="preserve">
    <value>۱</value>
  </data>
  <data name="btnColorDialog.Text" xml:space="preserve">
    <value>پنجره رنگ ...</value>
  </data>
  <data name="btnGradientColor2.Text" xml:space="preserve">
    <value>رنگ ۲</value>
  </data>
  <data name="lblTip.Text" xml:space="preserve">
    <value>راهنما: برای مخفی کردن/نمایش این پنجره، خارج این پنجره کلیک کنید.</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
