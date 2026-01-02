---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 440
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 440 of 650)

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

---[FILE: VideoConverterForm.Designer.cs]---
Location: ShareX-develop/ShareX.MediaLib/Forms/VideoConverterForm.Designer.cs

```csharp
namespace ShareX.MediaLib
{
    partial class VideoConverterForm
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(VideoConverterForm));
            this.lblInputFilePath = new System.Windows.Forms.Label();
            this.txtInputFilePath = new System.Windows.Forms.TextBox();
            this.btnInputFilePathBrowse = new System.Windows.Forms.Button();
            this.txtOutputFolder = new System.Windows.Forms.TextBox();
            this.lblOutputFolder = new System.Windows.Forms.Label();
            this.btnOutputFolderBrowse = new System.Windows.Forms.Button();
            this.lblOutputFileName = new System.Windows.Forms.Label();
            this.txtOutputFileName = new System.Windows.Forms.TextBox();
            this.cbVideoEncoder = new System.Windows.Forms.ComboBox();
            this.lblVideoQuality = new System.Windows.Forms.Label();
            this.btnEncode = new System.Windows.Forms.Button();
            this.txtArguments = new System.Windows.Forms.TextBox();
            this.cbAutoOpenFolder = new System.Windows.Forms.CheckBox();
            this.pbProgress = new ShareX.HelpersLib.BlackStyleProgressBar();
            this.cbUseCustomArguments = new System.Windows.Forms.CheckBox();
            this.lblVideoEncoder = new System.Windows.Forms.Label();
            this.tbVideoQuality = new System.Windows.Forms.TrackBar();
            this.lblVideoQualityValue = new System.Windows.Forms.Label();
            this.lblVideoQualityHigher = new System.Windows.Forms.Label();
            this.lblVideoQualityLower = new System.Windows.Forms.Label();
            this.nudVideoQualityBitrate = new System.Windows.Forms.NumericUpDown();
            this.lblVideoQualityBitrateHint = new System.Windows.Forms.Label();
            this.cbVideoQualityUseBitrate = new System.Windows.Forms.CheckBox();
            ((System.ComponentModel.ISupportInitialize)(this.tbVideoQuality)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudVideoQualityBitrate)).BeginInit();
            this.SuspendLayout();
            // 
            // lblInputFilePath
            // 
            resources.ApplyResources(this.lblInputFilePath, "lblInputFilePath");
            this.lblInputFilePath.Name = "lblInputFilePath";
            // 
            // txtInputFilePath
            // 
            resources.ApplyResources(this.txtInputFilePath, "txtInputFilePath");
            this.txtInputFilePath.Name = "txtInputFilePath";
            this.txtInputFilePath.TextChanged += new System.EventHandler(this.txtInputFilePath_TextChanged);
            // 
            // btnInputFilePathBrowse
            // 
            resources.ApplyResources(this.btnInputFilePathBrowse, "btnInputFilePathBrowse");
            this.btnInputFilePathBrowse.Name = "btnInputFilePathBrowse";
            this.btnInputFilePathBrowse.UseVisualStyleBackColor = true;
            this.btnInputFilePathBrowse.Click += new System.EventHandler(this.btnInputFilePathBrowse_Click);
            // 
            // txtOutputFolder
            // 
            resources.ApplyResources(this.txtOutputFolder, "txtOutputFolder");
            this.txtOutputFolder.Name = "txtOutputFolder";
            this.txtOutputFolder.TextChanged += new System.EventHandler(this.txtOutputFolder_TextChanged);
            // 
            // lblOutputFolder
            // 
            resources.ApplyResources(this.lblOutputFolder, "lblOutputFolder");
            this.lblOutputFolder.Name = "lblOutputFolder";
            // 
            // btnOutputFolderBrowse
            // 
            resources.ApplyResources(this.btnOutputFolderBrowse, "btnOutputFolderBrowse");
            this.btnOutputFolderBrowse.Name = "btnOutputFolderBrowse";
            this.btnOutputFolderBrowse.UseVisualStyleBackColor = true;
            this.btnOutputFolderBrowse.Click += new System.EventHandler(this.btnOutputFolderBrowse_Click);
            // 
            // lblOutputFileName
            // 
            resources.ApplyResources(this.lblOutputFileName, "lblOutputFileName");
            this.lblOutputFileName.Name = "lblOutputFileName";
            // 
            // txtOutputFileName
            // 
            resources.ApplyResources(this.txtOutputFileName, "txtOutputFileName");
            this.txtOutputFileName.Name = "txtOutputFileName";
            this.txtOutputFileName.TextChanged += new System.EventHandler(this.txtOutputFileName_TextChanged);
            // 
            // cbVideoEncoder
            // 
            this.cbVideoEncoder.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cbVideoEncoder.FormattingEnabled = true;
            resources.ApplyResources(this.cbVideoEncoder, "cbVideoEncoder");
            this.cbVideoEncoder.Name = "cbVideoEncoder";
            this.cbVideoEncoder.SelectedIndexChanged += new System.EventHandler(this.cbVideoEncoder_SelectedIndexChanged);
            // 
            // lblVideoQuality
            // 
            resources.ApplyResources(this.lblVideoQuality, "lblVideoQuality");
            this.lblVideoQuality.Name = "lblVideoQuality";
            // 
            // btnEncode
            // 
            resources.ApplyResources(this.btnEncode, "btnEncode");
            this.btnEncode.Name = "btnEncode";
            this.btnEncode.UseVisualStyleBackColor = true;
            this.btnEncode.Click += new System.EventHandler(this.btnEncode_Click);
            // 
            // txtArguments
            // 
            resources.ApplyResources(this.txtArguments, "txtArguments");
            this.txtArguments.Name = "txtArguments";
            this.txtArguments.TextChanged += new System.EventHandler(this.txtArguments_TextChanged);
            // 
            // cbAutoOpenFolder
            // 
            resources.ApplyResources(this.cbAutoOpenFolder, "cbAutoOpenFolder");
            this.cbAutoOpenFolder.Name = "cbAutoOpenFolder";
            this.cbAutoOpenFolder.UseVisualStyleBackColor = true;
            this.cbAutoOpenFolder.CheckedChanged += new System.EventHandler(this.cbAutoOpenFolder_CheckedChanged);
            // 
            // pbProgress
            // 
            resources.ApplyResources(this.pbProgress, "pbProgress");
            this.pbProgress.ForeColor = System.Drawing.Color.White;
            this.pbProgress.Name = "pbProgress";
            this.pbProgress.ShowPercentageText = true;
            // 
            // cbUseCustomArguments
            // 
            resources.ApplyResources(this.cbUseCustomArguments, "cbUseCustomArguments");
            this.cbUseCustomArguments.Name = "cbUseCustomArguments";
            this.cbUseCustomArguments.UseVisualStyleBackColor = true;
            this.cbUseCustomArguments.CheckedChanged += new System.EventHandler(this.cbUseCustomArguments_CheckedChanged);
            // 
            // lblVideoEncoder
            // 
            resources.ApplyResources(this.lblVideoEncoder, "lblVideoEncoder");
            this.lblVideoEncoder.Name = "lblVideoEncoder";
            // 
            // tbVideoQuality
            // 
            resources.ApplyResources(this.tbVideoQuality, "tbVideoQuality");
            this.tbVideoQuality.BackColor = System.Drawing.SystemColors.Window;
            this.tbVideoQuality.Name = "tbVideoQuality";
            this.tbVideoQuality.TickStyle = System.Windows.Forms.TickStyle.None;
            this.tbVideoQuality.ValueChanged += new System.EventHandler(this.tbVideoQuality_ValueChanged);
            // 
            // lblVideoQualityValue
            // 
            resources.ApplyResources(this.lblVideoQualityValue, "lblVideoQualityValue");
            this.lblVideoQualityValue.Name = "lblVideoQualityValue";
            // 
            // lblVideoQualityHigher
            // 
            resources.ApplyResources(this.lblVideoQualityHigher, "lblVideoQualityHigher");
            this.lblVideoQualityHigher.Name = "lblVideoQualityHigher";
            // 
            // lblVideoQualityLower
            // 
            resources.ApplyResources(this.lblVideoQualityLower, "lblVideoQualityLower");
            this.lblVideoQualityLower.Name = "lblVideoQualityLower";
            // 
            // nudVideoQualityBitrate
            // 
            resources.ApplyResources(this.nudVideoQualityBitrate, "nudVideoQualityBitrate");
            this.nudVideoQualityBitrate.Maximum = new decimal(new int[] {
            100000,
            0,
            0,
            0});
            this.nudVideoQualityBitrate.Minimum = new decimal(new int[] {
            100,
            0,
            0,
            0});
            this.nudVideoQualityBitrate.Name = "nudVideoQualityBitrate";
            this.nudVideoQualityBitrate.Value = new decimal(new int[] {
            3000,
            0,
            0,
            0});
            this.nudVideoQualityBitrate.ValueChanged += new System.EventHandler(this.nudVideoQualityBitrate_ValueChanged);
            // 
            // lblVideoQualityBitrateHint
            // 
            resources.ApplyResources(this.lblVideoQualityBitrateHint, "lblVideoQualityBitrateHint");
            this.lblVideoQualityBitrateHint.Name = "lblVideoQualityBitrateHint";
            // 
            // cbVideoQualityUseBitrate
            // 
            resources.ApplyResources(this.cbVideoQualityUseBitrate, "cbVideoQualityUseBitrate");
            this.cbVideoQualityUseBitrate.Name = "cbVideoQualityUseBitrate";
            this.cbVideoQualityUseBitrate.UseVisualStyleBackColor = true;
            this.cbVideoQualityUseBitrate.CheckedChanged += new System.EventHandler(this.cbVideoQualityUseBitrate_CheckedChanged);
            // 
            // VideoConverterForm
            // 
            this.AllowDrop = true;
            resources.ApplyResources(this, "$this");
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            this.BackColor = System.Drawing.SystemColors.Window;
            this.Controls.Add(this.cbVideoQualityUseBitrate);
            this.Controls.Add(this.lblVideoQualityBitrateHint);
            this.Controls.Add(this.nudVideoQualityBitrate);
            this.Controls.Add(this.lblVideoEncoder);
            this.Controls.Add(this.lblVideoQualityValue);
            this.Controls.Add(this.cbUseCustomArguments);
            this.Controls.Add(this.cbAutoOpenFolder);
            this.Controls.Add(this.lblVideoQualityHigher);
            this.Controls.Add(this.lblVideoQualityLower);
            this.Controls.Add(this.txtOutputFileName);
            this.Controls.Add(this.lblOutputFileName);
            this.Controls.Add(this.tbVideoQuality);
            this.Controls.Add(this.btnOutputFolderBrowse);
            this.Controls.Add(this.cbVideoEncoder);
            this.Controls.Add(this.lblOutputFolder);
            this.Controls.Add(this.lblVideoQuality);
            this.Controls.Add(this.txtOutputFolder);
            this.Controls.Add(this.btnInputFilePathBrowse);
            this.Controls.Add(this.txtInputFilePath);
            this.Controls.Add(this.lblInputFilePath);
            this.Controls.Add(this.btnEncode);
            this.Controls.Add(this.pbProgress);
            this.Controls.Add(this.txtArguments);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Name = "VideoConverterForm";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.VideoConverterForm_FormClosing);
            this.DragDrop += new System.Windows.Forms.DragEventHandler(this.VideoConverterForm_DragDrop);
            this.DragEnter += new System.Windows.Forms.DragEventHandler(this.VideoConverterForm_DragEnter);
            ((System.ComponentModel.ISupportInitialize)(this.tbVideoQuality)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudVideoQualityBitrate)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label lblInputFilePath;
        private System.Windows.Forms.TextBox txtInputFilePath;
        private System.Windows.Forms.Button btnInputFilePathBrowse;
        private System.Windows.Forms.TextBox txtOutputFolder;
        private System.Windows.Forms.Label lblOutputFolder;
        private System.Windows.Forms.Button btnOutputFolderBrowse;
        private System.Windows.Forms.Label lblOutputFileName;
        private System.Windows.Forms.TextBox txtOutputFileName;
        private System.Windows.Forms.ComboBox cbVideoEncoder;
        private System.Windows.Forms.Label lblVideoQuality;
        private System.Windows.Forms.Button btnEncode;
        private System.Windows.Forms.TextBox txtArguments;
        private HelpersLib.BlackStyleProgressBar pbProgress;
        private System.Windows.Forms.CheckBox cbAutoOpenFolder;
        private System.Windows.Forms.CheckBox cbUseCustomArguments;
        private System.Windows.Forms.Label lblVideoEncoder;
        private System.Windows.Forms.TrackBar tbVideoQuality;
        private System.Windows.Forms.Label lblVideoQualityValue;
        private System.Windows.Forms.Label lblVideoQualityHigher;
        private System.Windows.Forms.Label lblVideoQualityLower;
        private System.Windows.Forms.NumericUpDown nudVideoQualityBitrate;
        private System.Windows.Forms.Label lblVideoQualityBitrateHint;
        private System.Windows.Forms.CheckBox cbVideoQualityUseBitrate;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: VideoConverterForm.es-MX.resx]---
Location: ShareX-develop/ShareX.MediaLib/Forms/VideoConverterForm.es-MX.resx

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
  <data name="lblInputFilePath.Text" xml:space="preserve">
    <value>Ruta de archivo de entrada:</value>
  </data>
  <data name="lblOutputFolder.Text" xml:space="preserve">
    <value>Carpeta de salida:</value>
  </data>
  <data name="lblOutputFileName.Text" xml:space="preserve">
    <value>Nombre de archivo de salida:</value>
  </data>
  <data name="lblVideoQuality.Text" xml:space="preserve">
    <value>Calidad de video:</value>
  </data>
  <data name="btnEncode.Text" xml:space="preserve">
    <value>Iniciar codificación</value>
  </data>
  <data name="cbAutoOpenFolder.Text" xml:space="preserve">
    <value>Abrir carpeta luego de codificar</value>
  </data>
  <data name="cbUseCustomArguments.Text" xml:space="preserve">
    <value>Usar argumentos personalizados:</value>
  </data>
  <data name="lblVideoEncoder.Text" xml:space="preserve">
    <value>Codificador de video:</value>
  </data>
  <data name="cbVideoQualityUseBitrate.Text" xml:space="preserve">
    <value>Usar bitrate</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - Conversor de video</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: VideoConverterForm.fr.resx]---
Location: ShareX-develop/ShareX.MediaLib/Forms/VideoConverterForm.fr.resx

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
  <data name="btnInputFilePathBrowse.Text" xml:space="preserve">
    <value>...</value>
  </data>
  <data name="lblVideoQualityValue.Text" xml:space="preserve">
    <value>0</value>
  </data>
  <data name="cbUseCustomArguments.Text" xml:space="preserve">
    <value>Utiliser des arguments personnalisés :</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - Convertisseur vidéo</value>
  </data>
  <data name="cbAutoOpenFolder.Text" xml:space="preserve">
    <value>Ouvrir le dossier après l'encodage</value>
  </data>
  <data name="btnOutputFolderBrowse.Text" xml:space="preserve">
    <value>...</value>
  </data>
  <data name="btnEncode.Text" xml:space="preserve">
    <value>Démarrer l'encodage</value>
  </data>
  <data name="lblVideoQuality.Text" xml:space="preserve">
    <value>Qualité vidéo :</value>
  </data>
  <data name="lblVideoCodec.Text" xml:space="preserve">
    <value>Codec vidéo :</value>
  </data>
  <data name="lblOutputFileName.Text" xml:space="preserve">
    <value>Nom du fichier de sortie :</value>
  </data>
  <data name="lblOutputFolder.Text" xml:space="preserve">
    <value>Dossier de sortie :</value>
  </data>
  <data name="lblInputFilePath.Text" xml:space="preserve">
    <value>Chemin du fichier d'entrée :</value>
  </data>
  <data name="cbVideoQualityUseBitrate.Text" xml:space="preserve">
    <value>Utiliser le bitrate</value>
  </data>
  <data name="lblVideoEncoder.Text" xml:space="preserve">
    <value>Encodeur vidéo :</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: VideoConverterForm.he-IL.resx]---
Location: ShareX-develop/ShareX.MediaLib/Forms/VideoConverterForm.he-IL.resx

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
    <value>ShareX - ממיר וידאו</value>
  </data>
  <data name="btnEncode.Text" xml:space="preserve">
    <value>התחל קידוד</value>
  </data>
  <data name="cbAutoOpenFolder.Text" xml:space="preserve">
    <value>פתח תיקייה לאחר הקידוד</value>
  </data>
  <data name="cbUseCustomArguments.Text" xml:space="preserve">
    <value>השתמש בארגומנטים מותאמים אישית:</value>
  </data>
  <data name="lblInputFilePath.Text" xml:space="preserve">
    <value>נתיב קובץ קלט:</value>
  </data>
  <data name="lblOutputFileName.Text" xml:space="preserve">
    <value>שם קובץ פלט:</value>
  </data>
  <data name="lblOutputFolder.Text" xml:space="preserve">
    <value>תיקיית פלט:</value>
  </data>
  <data name="lblVideoCodec.Text" xml:space="preserve">
    <value>קידוד וידאו:</value>
  </data>
  <data name="lblVideoQuality.Text" xml:space="preserve">
    <value>איכות וידאו:</value>
  </data>
  <data name="lblVideoEncoder.Text" xml:space="preserve">
    <value>מקודד וידאו:</value>
  </data>
  <data name="cbVideoQualityUseBitrate.Text" xml:space="preserve">
    <value>השתמש בקצב סיביות</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
