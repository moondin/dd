---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:46Z
part: 70
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 70 of 650)

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

---[FILE: AutoCaptureForm.Designer.cs]---
Location: ShareX-develop/ShareX/Forms/AutoCaptureForm.Designer.cs

```csharp
namespace ShareX
{
    partial class AutoCaptureForm
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

            if (screenshotTimer != null)
            {
                screenshotTimer.Dispose();
            }

            if (statusTimer != null)
            {
                statusTimer.Dispose();
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
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(AutoCaptureForm));
            this.ssBar = new System.Windows.Forms.StatusStrip();
            this.tspbBar = new System.Windows.Forms.ToolStripProgressBar();
            this.tsslStatus = new System.Windows.Forms.ToolStripStatusLabel();
            this.btnExecute = new System.Windows.Forms.Button();
            this.cbWaitUploads = new System.Windows.Forms.CheckBox();
            this.cbAutoMinimize = new System.Windows.Forms.CheckBox();
            this.lblRegion = new System.Windows.Forms.Label();
            this.btnRegion = new System.Windows.Forms.Button();
            this.nudRepeatTime = new System.Windows.Forms.NumericUpDown();
            this.lblDuration = new System.Windows.Forms.Label();
            this.niTray = new System.Windows.Forms.NotifyIcon(this.components);
            this.lblDurationSeconds = new System.Windows.Forms.Label();
            this.gbRegion = new System.Windows.Forms.GroupBox();
            this.rbFullscreen = new System.Windows.Forms.RadioButton();
            this.rbCustomRegion = new System.Windows.Forms.RadioButton();
            this.ssBar.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudRepeatTime)).BeginInit();
            this.gbRegion.SuspendLayout();
            this.SuspendLayout();
            // 
            // ssBar
            // 
            this.ssBar.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.tspbBar,
            this.tsslStatus});
            resources.ApplyResources(this.ssBar, "ssBar");
            this.ssBar.Name = "ssBar";
            this.ssBar.SizingGrip = false;
            // 
            // tspbBar
            // 
            this.tspbBar.Name = "tspbBar";
            resources.ApplyResources(this.tspbBar, "tspbBar");
            // 
            // tsslStatus
            // 
            this.tsslStatus.BackColor = System.Drawing.Color.Transparent;
            this.tsslStatus.Name = "tsslStatus";
            resources.ApplyResources(this.tsslStatus, "tsslStatus");
            // 
            // btnExecute
            // 
            resources.ApplyResources(this.btnExecute, "btnExecute");
            this.btnExecute.Name = "btnExecute";
            this.btnExecute.UseVisualStyleBackColor = true;
            this.btnExecute.Click += new System.EventHandler(this.btnExecute_Click);
            // 
            // cbWaitUploads
            // 
            resources.ApplyResources(this.cbWaitUploads, "cbWaitUploads");
            this.cbWaitUploads.Name = "cbWaitUploads";
            this.cbWaitUploads.UseVisualStyleBackColor = true;
            this.cbWaitUploads.CheckedChanged += new System.EventHandler(this.cbWaitUploads_CheckedChanged);
            // 
            // cbAutoMinimize
            // 
            resources.ApplyResources(this.cbAutoMinimize, "cbAutoMinimize");
            this.cbAutoMinimize.Name = "cbAutoMinimize";
            this.cbAutoMinimize.UseVisualStyleBackColor = true;
            this.cbAutoMinimize.CheckedChanged += new System.EventHandler(this.cbAutoMinimize_CheckedChanged);
            // 
            // lblRegion
            // 
            resources.ApplyResources(this.lblRegion, "lblRegion");
            this.lblRegion.Name = "lblRegion";
            // 
            // btnRegion
            // 
            resources.ApplyResources(this.btnRegion, "btnRegion");
            this.btnRegion.Name = "btnRegion";
            this.btnRegion.UseVisualStyleBackColor = true;
            this.btnRegion.Click += new System.EventHandler(this.btnRegion_Click);
            // 
            // nudRepeatTime
            // 
            this.nudRepeatTime.DecimalPlaces = 1;
            resources.ApplyResources(this.nudRepeatTime, "nudRepeatTime");
            this.nudRepeatTime.Maximum = new decimal(new int[] {
            86400,
            0,
            0,
            0});
            this.nudRepeatTime.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.nudRepeatTime.Name = "nudRepeatTime";
            this.nudRepeatTime.Value = new decimal(new int[] {
            3,
            0,
            0,
            0});
            this.nudRepeatTime.ValueChanged += new System.EventHandler(this.nudDuration_ValueChanged);
            // 
            // lblDuration
            // 
            resources.ApplyResources(this.lblDuration, "lblDuration");
            this.lblDuration.Name = "lblDuration";
            // 
            // niTray
            // 
            resources.ApplyResources(this.niTray, "niTray");
            this.niTray.MouseClick += new System.Windows.Forms.MouseEventHandler(this.niTray_MouseClick);
            // 
            // lblDurationSeconds
            // 
            resources.ApplyResources(this.lblDurationSeconds, "lblDurationSeconds");
            this.lblDurationSeconds.Name = "lblDurationSeconds";
            // 
            // gbRegion
            // 
            this.gbRegion.Controls.Add(this.rbFullscreen);
            this.gbRegion.Controls.Add(this.rbCustomRegion);
            this.gbRegion.Controls.Add(this.btnRegion);
            this.gbRegion.Controls.Add(this.lblRegion);
            resources.ApplyResources(this.gbRegion, "gbRegion");
            this.gbRegion.Name = "gbRegion";
            this.gbRegion.TabStop = false;
            // 
            // rbFullscreen
            // 
            resources.ApplyResources(this.rbFullscreen, "rbFullscreen");
            this.rbFullscreen.Name = "rbFullscreen";
            this.rbFullscreen.UseVisualStyleBackColor = true;
            this.rbFullscreen.CheckedChanged += new System.EventHandler(this.rbFullscreen_CheckedChanged);
            // 
            // rbCustomRegion
            // 
            resources.ApplyResources(this.rbCustomRegion, "rbCustomRegion");
            this.rbCustomRegion.Checked = true;
            this.rbCustomRegion.Name = "rbCustomRegion";
            this.rbCustomRegion.TabStop = true;
            this.rbCustomRegion.UseVisualStyleBackColor = true;
            this.rbCustomRegion.CheckedChanged += new System.EventHandler(this.rbCustomRegion_CheckedChanged);
            // 
            // AutoCaptureForm
            // 
            resources.ApplyResources(this, "$this");
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            this.BackColor = System.Drawing.SystemColors.Window;
            this.Controls.Add(this.gbRegion);
            this.Controls.Add(this.lblDurationSeconds);
            this.Controls.Add(this.nudRepeatTime);
            this.Controls.Add(this.lblDuration);
            this.Controls.Add(this.cbAutoMinimize);
            this.Controls.Add(this.cbWaitUploads);
            this.Controls.Add(this.btnExecute);
            this.Controls.Add(this.ssBar);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Name = "AutoCaptureForm";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.AutoCapture_FormClosing);
            this.Resize += new System.EventHandler(this.AutoCapture_Resize);
            this.ssBar.ResumeLayout(false);
            this.ssBar.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudRepeatTime)).EndInit();
            this.gbRegion.ResumeLayout(false);
            this.gbRegion.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion Windows Form Designer generated code

        private System.Windows.Forms.StatusStrip ssBar;
        private System.Windows.Forms.ToolStripProgressBar tspbBar;
        private System.Windows.Forms.Button btnExecute;
        private System.Windows.Forms.CheckBox cbWaitUploads;
        private System.Windows.Forms.ToolStripStatusLabel tsslStatus;
        private System.Windows.Forms.CheckBox cbAutoMinimize;
        private System.Windows.Forms.Label lblRegion;
        private System.Windows.Forms.Button btnRegion;
        private System.Windows.Forms.NumericUpDown nudRepeatTime;
        private System.Windows.Forms.Label lblDuration;
        private System.Windows.Forms.NotifyIcon niTray;
        private System.Windows.Forms.Label lblDurationSeconds;
        private System.Windows.Forms.GroupBox gbRegion;
        private System.Windows.Forms.RadioButton rbFullscreen;
        private System.Windows.Forms.RadioButton rbCustomRegion;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: AutoCaptureForm.es-MX.resx]---
Location: ShareX-develop/ShareX/Forms/AutoCaptureForm.es-MX.resx

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
  <data name="ssBar.Text" xml:space="preserve">
    <value>Estado</value>
  </data>
  <data name="btnExecute.Text" xml:space="preserve">
    <value>Iniciar</value>
  </data>
  <data name="cbWaitUploads.Text" xml:space="preserve">
    <value>Esperar hasta que las tareas terminen</value>
  </data>
  <data name="cbAutoMinimize.Text" xml:space="preserve">
    <value>Minimizar al área de notificación automáticamente</value>
  </data>
  <data name="lblRegion.Text" xml:space="preserve">
    <value>Región</value>
  </data>
  <data name="btnRegion.Text" xml:space="preserve">
    <value>Seleccionar región</value>
  </data>
  <data name="lblDuration.Text" xml:space="preserve">
    <value>Tiempo de repetición:</value>
  </data>
  <data name="niTray.Text" xml:space="preserve">
    <value>Share X - Captura automática</value>
  </data>
  <data name="lblDurationSeconds.Text" xml:space="preserve">
    <value>segundos</value>
  </data>
  <data name="rbFullscreen.Text" xml:space="preserve">
    <value>Pantalla completa</value>
  </data>
  <data name="rbCustomRegion.Text" xml:space="preserve">
    <value>Región personalizada</value>
  </data>
  <data name="gbRegion.Text" xml:space="preserve">
    <value>Región</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>Share X - Captura automática</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: AutoCaptureForm.es.resx]---
Location: ShareX-develop/ShareX/Forms/AutoCaptureForm.es.resx

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
  <data name="btnExecute.Text" xml:space="preserve">
    <value>Iniciar</value>
  </data>
  <data name="btnRegion.Text" xml:space="preserve">
    <value>Seleccionar región</value>
  </data>
  <data name="gbRegion.Text" xml:space="preserve">
    <value>Región</value>
  </data>
  <data name="lblRegion.Text" xml:space="preserve">
    <value>Región</value>
  </data>
  <data name="ssBar.Text" xml:space="preserve">
    <value>Estado</value>
  </data>
  <data name="rbCustomRegion.Text" xml:space="preserve">
    <value>Región personalizada</value>
  </data>
  <data name="lblDurationSeconds.Text" xml:space="preserve">
    <value>segundos</value>
  </data>
  <data name="lblDuration.Text" xml:space="preserve">
    <value>Tiempo de repetición</value>
  </data>
  <data name="cbWaitUploads.Text" xml:space="preserve">
    <value>Espere hasta completar las tareas</value>
  </data>
  <data name="cbAutoMinimize.Text" xml:space="preserve">
    <value>Auto-minimizar a la bandeja</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - Capturar automáticamente</value>
  </data>
  <data name="niTray.Text" xml:space="preserve">
    <value>ShareX - Capturar automáticamente</value>
  </data>
  <data name="rbFullscreen.Text" xml:space="preserve">
    <value>Pantalla completa</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: AutoCaptureForm.fa-IR.resx]---
Location: ShareX-develop/ShareX/Forms/AutoCaptureForm.fa-IR.resx

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
  <data name="ssBar.Text" xml:space="preserve">
    <value>وضعیت</value>
  </data>
  <data name="btnExecute.Text" xml:space="preserve">
    <value>شروع</value>
  </data>
  <data name="cbWaitUploads.Text" xml:space="preserve">
    <value>صبر کنید تا وظایف پایان یابند</value>
  </data>
  <data name="lblRegion.Text" xml:space="preserve">
    <value>ناحیه</value>
  </data>
  <data name="btnRegion.Text" xml:space="preserve">
    <value>انتخاب ناحیه</value>
  </data>
  <data name="lblDuration.Text" xml:space="preserve">
    <value>تعداد تکرار:</value>
  </data>
  <data name="niTray.Text" xml:space="preserve">
    <value>ShareX - ضبط خودکار</value>
  </data>
  <data name="lblDurationSeconds.Text" xml:space="preserve">
    <value>ثانیه</value>
  </data>
  <data name="rbFullscreen.Text" xml:space="preserve">
    <value>تمام صفحه</value>
  </data>
  <data name="gbRegion.Text" xml:space="preserve">
    <value>ناحیه</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - ضبط خودکار</value>
  </data>
  <data name="cbAutoMinimize.Text" xml:space="preserve">
    <value>به صورت خودکار شیرایکس را به نواروظیفه کوچک کن</value>
  </data>
  <data name="rbCustomRegion.Text" xml:space="preserve">
    <value>ناحیه سفارشی</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: AutoCaptureForm.fr.resx]---
Location: ShareX-develop/ShareX/Forms/AutoCaptureForm.fr.resx

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
  <data name="cbAutoMinimize.Text" xml:space="preserve">
    <value>Réduire automatiquement dans la zone de notification</value>
  </data>
  <data name="rbCustomRegion.Text" xml:space="preserve">
    <value>Région personnalisée</value>
  </data>
  <data name="rbFullscreen.Text" xml:space="preserve">
    <value>Plein écran</value>
  </data>
  <data name="gbRegion.Text" xml:space="preserve">
    <value>Région</value>
  </data>
  <data name="lblRegion.Text" xml:space="preserve">
    <value>Région</value>
  </data>
  <data name="lblDuration.Text" xml:space="preserve">
    <value>Temps de répétition :</value>
  </data>
  <data name="lblDurationSeconds.Text" xml:space="preserve">
    <value>secondes</value>
  </data>
  <data name="btnRegion.Text" xml:space="preserve">
    <value>Sélectionner une région...</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - Capture automatique</value>
  </data>
  <data name="niTray.Text" xml:space="preserve">
    <value>ShareX - Capture automatique</value>
  </data>
  <data name="btnExecute.Text" xml:space="preserve">
    <value>Démarrer</value>
  </data>
  <data name="ssBar.Text" xml:space="preserve">
    <value>Statut</value>
  </data>
  <data name="cbWaitUploads.Text" xml:space="preserve">
    <value>Attendre que les tâches soient complétées</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
