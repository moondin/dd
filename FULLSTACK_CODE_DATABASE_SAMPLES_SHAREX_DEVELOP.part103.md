---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 103
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 103 of 650)

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

---[FILE: InspectWindowForm.cs]---
Location: ShareX-develop/ShareX/Forms/InspectWindowForm.cs

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
using ShareX.Properties;
using ShareX.ScreenCaptureLib;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;

namespace ShareX
{
    public partial class InspectWindowForm : Form
    {
        public WindowInfo SelectedWindow { get; private set; }
        public bool IsWindow { get; private set; }

        private bool updating;

        public InspectWindowForm()
        {
            InitializeComponent();
            rtbInfo.AddContextMenu();
            ShareXResources.ApplyTheme(this, true);
            SelectHandle(true);
        }

        private void UpdateWindowListMenu()
        {
            cmsWindowList.Items.Clear();

            WindowsList windowsList = new WindowsList();
            List<WindowInfo> windows = windowsList.GetVisibleWindowsList();

            if (windows != null && windows.Count > 0)
            {
                List<ToolStripMenuItem> items = new List<ToolStripMenuItem>();

                foreach (WindowInfo window in windows)
                {
                    try
                    {
                        string title = window.Text;
                        string shortTitle = title.Truncate(50, "...");
                        ToolStripMenuItem tsmi = new ToolStripMenuItem(shortTitle);
                        tsmi.Click += (sender, e) => SelectWindow(window.Handle, true);

                        using (Icon icon = window.Icon)
                        {
                            if (icon != null && icon.Width > 0 && icon.Height > 0)
                            {
                                tsmi.Image = icon.ToBitmap();
                            }
                        }

                        items.Add(tsmi);
                    }
                    catch (Exception e)
                    {
                        DebugHelper.WriteException(e);
                    }
                }

                cmsWindowList.Items.AddRange(items.OrderBy(x => x.Text).ToArray());
            }
        }

        private void SelectWindow(IntPtr handle, bool isWindow)
        {
            SelectedWindow = new WindowInfo(handle);
            IsWindow = isWindow;

            UpdateWindowInfo();
        }

        private bool SelectHandle(bool isWindow)
        {
            RegionCaptureOptions options = new RegionCaptureOptions()
            {
                DetectControls = !isWindow
            };

            SelectedWindow = null;

            SimpleWindowInfo simpleWindowInfo = RegionCaptureTasks.GetWindowInfo(options);

            if (simpleWindowInfo != null)
            {
                SelectWindow(simpleWindowInfo.Handle, isWindow);

                return true;
            }

            UpdateWindowInfo();

            return false;
        }

        private void UpdateWindowInfo()
        {
            updating = true;

            btnRefresh.Enabled = SelectedWindow != null;

            if (SelectedWindow != null && IsWindow)
            {
                cbTopMost.Visible = true;
                cbTopMost.Checked = SelectedWindow.TopMost;

                nudOpacity.Visible = true;
                nudOpacity.SetValue((int)Math.Round(SelectedWindow.Opacity / 255.0 * 100));
                lblOpacity.Visible = true;
                lblOpacityTip.Visible = true;
            }
            else
            {
                cbTopMost.Visible = false;
                nudOpacity.Visible = false;
                lblOpacity.Visible = false;
                lblOpacityTip.Visible = false;
            }

            rtbInfo.ResetText();

            if (SelectedWindow != null)
            {
                try
                {
                    AddInfo(Resources.InspectWindow_WindowHandle, SelectedWindow.Handle.ToString("X8"));
                    AddInfo(Resources.InspectWindow_WindowTitle, SelectedWindow.Text);
                    AddInfo(Resources.InspectWindow_ClassName, SelectedWindow.ClassName);
                    AddInfo(Resources.InspectWindow_ProcessName, SelectedWindow.ProcessName);
                    AddInfo(Resources.InspectWindow_ProcessFileName, SelectedWindow.ProcessFileName);
                    AddInfo(Resources.InspectWindow_ProcessIdentifier, SelectedWindow.ProcessId.ToString());
                    AddInfo(Resources.InspectWindow_WindowRectangle, SelectedWindow.Rectangle.ToStringProper());
                    AddInfo(Resources.InspectWindow_ClientRectangle, SelectedWindow.ClientRectangle.ToStringProper());
                    AddInfo(Resources.InspectWindow_WindowStyles, SelectedWindow.Style.ToString().Replace(", ", "\r\n"));
                    AddInfo(Resources.InspectWindow_ExtendedWindowStyles, SelectedWindow.ExStyle.ToString().Replace(", ", "\r\n"));
                }
                catch
                {
                }
            }

            updating = false;
        }

        private void AddInfo(string name, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                if (rtbInfo.TextLength > 0)
                {
                    rtbInfo.AppendLine();
                    rtbInfo.AppendLine();
                }

                rtbInfo.SetFontBold();
                rtbInfo.AppendLine(name);
                rtbInfo.SetFontRegular();
                rtbInfo.AppendText(value);
            }
        }

        private void mbWindowList_MouseDown(object sender, MouseEventArgs e)
        {
            UpdateWindowListMenu();
        }

        private void btnInspectWindow_Click(object sender, EventArgs e)
        {
            SelectHandle(true);
        }

        private void btnInspectControl_Click(object sender, EventArgs e)
        {
            SelectHandle(false);
        }

        private void btnRefresh_Click(object sender, EventArgs e)
        {
            UpdateWindowInfo();
        }

        private void cbTopMost_CheckedChanged(object sender, EventArgs e)
        {
            if (!updating && SelectedWindow != null)
            {
                try
                {
                    WindowInfo windowInfo = new WindowInfo(SelectedWindow.Handle);
                    windowInfo.TopMost = cbTopMost.Checked;

                    UpdateWindowInfo();
                }
                catch
                {
                }
            }
        }

        private void nudOpacity_ValueChanged(object sender, EventArgs e)
        {
            if (!updating && SelectedWindow != null)
            {
                try
                {
                    WindowInfo windowInfo = new WindowInfo(SelectedWindow.Handle);
                    windowInfo.Opacity = (byte)Math.Round(nudOpacity.Value / 100 * 255);

                    UpdateWindowInfo();
                }
                catch
                {
                }
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: InspectWindowForm.de.resx]---
Location: ShareX-develop/ShareX/Forms/InspectWindowForm.de.resx

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
    <value>ShareX - Fenster überprüfen</value>
  </data>
  <data name="mbWindowList.Text" xml:space="preserve">
    <value>Fensterliste</value>
  </data>
  <data name="lblOpacity.Text" xml:space="preserve">
    <value>Deckkraft:</value>
  </data>
  <data name="btnRefresh.Text" xml:space="preserve">
    <value>Aktualisieren</value>
  </data>
  <data name="btnInspectControl.Text" xml:space="preserve">
    <value>Steuerung überprüfen...</value>
  </data>
  <data name="btnInspectWindow.Text" xml:space="preserve">
    <value>Fenster überprüfen...</value>
  </data>
  <data name="cbTopMost.Text" xml:space="preserve">
    <value>in Vordergrund</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: InspectWindowForm.Designer.cs]---
Location: ShareX-develop/ShareX/Forms/InspectWindowForm.Designer.cs

```csharp

namespace ShareX
{
    partial class InspectWindowForm
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
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(InspectWindowForm));
            this.rtbInfo = new System.Windows.Forms.RichTextBox();
            this.pInfo = new System.Windows.Forms.Panel();
            this.btnInspectWindow = new System.Windows.Forms.Button();
            this.btnInspectControl = new System.Windows.Forms.Button();
            this.btnRefresh = new System.Windows.Forms.Button();
            this.cmsWindowList = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.cbTopMost = new System.Windows.Forms.CheckBox();
            this.lblOpacity = new System.Windows.Forms.Label();
            this.nudOpacity = new System.Windows.Forms.NumericUpDown();
            this.lblOpacityTip = new System.Windows.Forms.Label();
            this.mbWindowList = new ShareX.HelpersLib.MenuButton();
            this.pInfo.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.nudOpacity)).BeginInit();
            this.SuspendLayout();
            // 
            // rtbInfo
            // 
            this.rtbInfo.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.rtbInfo.DetectUrls = false;
            resources.ApplyResources(this.rtbInfo, "rtbInfo");
            this.rtbInfo.Name = "rtbInfo";
            this.rtbInfo.ReadOnly = true;
            // 
            // pInfo
            // 
            resources.ApplyResources(this.pInfo, "pInfo");
            this.pInfo.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.pInfo.Controls.Add(this.rtbInfo);
            this.pInfo.Name = "pInfo";
            // 
            // btnInspectWindow
            // 
            resources.ApplyResources(this.btnInspectWindow, "btnInspectWindow");
            this.btnInspectWindow.Name = "btnInspectWindow";
            this.btnInspectWindow.UseVisualStyleBackColor = true;
            this.btnInspectWindow.Click += new System.EventHandler(this.btnInspectWindow_Click);
            // 
            // btnInspectControl
            // 
            resources.ApplyResources(this.btnInspectControl, "btnInspectControl");
            this.btnInspectControl.Name = "btnInspectControl";
            this.btnInspectControl.UseVisualStyleBackColor = true;
            this.btnInspectControl.Click += new System.EventHandler(this.btnInspectControl_Click);
            // 
            // btnRefresh
            // 
            resources.ApplyResources(this.btnRefresh, "btnRefresh");
            this.btnRefresh.Name = "btnRefresh";
            this.btnRefresh.UseVisualStyleBackColor = true;
            this.btnRefresh.Click += new System.EventHandler(this.btnRefresh_Click);
            // 
            // cmsWindowList
            // 
            this.cmsWindowList.Name = "cmsWindowList";
            resources.ApplyResources(this.cmsWindowList, "cmsWindowList");
            // 
            // cbTopMost
            // 
            resources.ApplyResources(this.cbTopMost, "cbTopMost");
            this.cbTopMost.Name = "cbTopMost";
            this.cbTopMost.UseVisualStyleBackColor = true;
            this.cbTopMost.CheckedChanged += new System.EventHandler(this.cbTopMost_CheckedChanged);
            // 
            // lblOpacity
            // 
            resources.ApplyResources(this.lblOpacity, "lblOpacity");
            this.lblOpacity.Name = "lblOpacity";
            // 
            // nudOpacity
            // 
            this.nudOpacity.Increment = new decimal(new int[] {
            10,
            0,
            0,
            0});
            resources.ApplyResources(this.nudOpacity, "nudOpacity");
            this.nudOpacity.Minimum = new decimal(new int[] {
            10,
            0,
            0,
            0});
            this.nudOpacity.Name = "nudOpacity";
            this.nudOpacity.Value = new decimal(new int[] {
            100,
            0,
            0,
            0});
            this.nudOpacity.ValueChanged += new System.EventHandler(this.nudOpacity_ValueChanged);
            // 
            // lblOpacityTip
            // 
            resources.ApplyResources(this.lblOpacityTip, "lblOpacityTip");
            this.lblOpacityTip.Name = "lblOpacityTip";
            // 
            // mbWindowList
            // 
            resources.ApplyResources(this.mbWindowList, "mbWindowList");
            this.mbWindowList.Menu = this.cmsWindowList;
            this.mbWindowList.Name = "mbWindowList";
            this.mbWindowList.UseVisualStyleBackColor = true;
            this.mbWindowList.MouseDown += new System.Windows.Forms.MouseEventHandler(this.mbWindowList_MouseDown);
            // 
            // InspectWindowForm
            // 
            resources.ApplyResources(this, "$this");
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.lblOpacityTip);
            this.Controls.Add(this.nudOpacity);
            this.Controls.Add(this.lblOpacity);
            this.Controls.Add(this.cbTopMost);
            this.Controls.Add(this.mbWindowList);
            this.Controls.Add(this.btnRefresh);
            this.Controls.Add(this.btnInspectControl);
            this.Controls.Add(this.btnInspectWindow);
            this.Controls.Add(this.pInfo);
            this.Name = "InspectWindowForm";
            this.pInfo.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.nudOpacity)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.RichTextBox rtbInfo;
        private System.Windows.Forms.Panel pInfo;
        private System.Windows.Forms.Button btnInspectWindow;
        private System.Windows.Forms.Button btnInspectControl;
        private System.Windows.Forms.Button btnRefresh;
        private HelpersLib.MenuButton mbWindowList;
        private System.Windows.Forms.ContextMenuStrip cmsWindowList;
        private System.Windows.Forms.CheckBox cbTopMost;
        private System.Windows.Forms.Label lblOpacity;
        private System.Windows.Forms.NumericUpDown nudOpacity;
        private System.Windows.Forms.Label lblOpacityTip;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: InspectWindowForm.es-MX.resx]---
Location: ShareX-develop/ShareX/Forms/InspectWindowForm.es-MX.resx

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
  <data name="btnInspectWindow.Text" xml:space="preserve">
    <value>Inspeccionar ventana...</value>
  </data>
  <data name="btnInspectControl.Text" xml:space="preserve">
    <value>Inspeccionar control...</value>
  </data>
  <data name="btnRefresh.Text" xml:space="preserve">
    <value>Actualizar</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - Inspeccionar ventana</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: InspectWindowForm.he-IL.resx]---
Location: ShareX-develop/ShareX/Forms/InspectWindowForm.he-IL.resx

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
  <data name="btnInspectWindow.Text" xml:space="preserve">
    <value>בדוק את החלון...</value>
  </data>
  <data name="btnInspectControl.Text" xml:space="preserve">
    <value>בדוק את הבקרה...</value>
  </data>
  <data name="btnRefresh.Text" xml:space="preserve">
    <value>רענן</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - חלון בדיקה</value>
  </data>
  <data name="lblOpacity.Text" xml:space="preserve">
    <value>שקיפות:</value>
  </data>
  <data name="cbTopMost.Text" xml:space="preserve">
    <value>הכי גבוה</value>
  </data>
  <data name="mbWindowList.Text" xml:space="preserve">
    <value>רשימת חלונות</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
