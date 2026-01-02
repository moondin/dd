---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:46Z
part: 29
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 29 of 650)

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

---[FILE: TaskThumbnailView.cs]---
Location: ShareX-develop/ShareX/Controls/TaskThumbnailView.cs

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
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;

namespace ShareX
{
    public partial class TaskThumbnailView : UserControl
    {
        public delegate void TaskViewMouseEventHandler(object sender, MouseEventArgs e);
        public event TaskViewMouseEventHandler ContextMenuRequested;

        public event EventHandler SelectedPanelChanged;

        public List<TaskThumbnailPanel> Panels { get; private set; }
        public List<TaskThumbnailPanel> SelectedPanels { get; private set; }

        public TaskThumbnailPanel SelectedPanel
        {
            get
            {
                if (SelectedPanels.Count > 0)
                {
                    return SelectedPanels[SelectedPanels.Count - 1];
                }

                return null;
            }
        }

        private bool titleVisible = true;

        public bool TitleVisible
        {
            get
            {
                return titleVisible;
            }
            set
            {
                if (titleVisible != value)
                {
                    titleVisible = value;

                    foreach (TaskThumbnailPanel panel in Panels)
                    {
                        panel.TitleVisible = titleVisible;
                    }
                }
            }
        }

        private ThumbnailTitleLocation titleLocation;

        public ThumbnailTitleLocation TitleLocation
        {
            get
            {
                return titleLocation;
            }
            set
            {
                if (titleLocation != value)
                {
                    titleLocation = value;

                    foreach (TaskThumbnailPanel panel in Panels)
                    {
                        panel.TitleLocation = titleLocation;
                    }
                }
            }
        }

        private Size thumbnailSize = new Size(200, 150);

        public Size ThumbnailSize
        {
            get
            {
                return thumbnailSize;
            }
            set
            {
                if (thumbnailSize != value)
                {
                    thumbnailSize = value;

                    foreach (TaskThumbnailPanel panel in Panels)
                    {
                        panel.ThumbnailSize = thumbnailSize;
                    }

                    UpdateAllThumbnails(true);
                }
            }
        }

        private ThumbnailViewClickAction clickAction = ThumbnailViewClickAction.Default;

        public ThumbnailViewClickAction ClickAction
        {
            get
            {
                return clickAction;
            }
            set
            {
                if (clickAction != value)
                {
                    clickAction = value;

                    foreach (TaskThumbnailPanel panel in Panels)
                    {
                        panel.ClickAction = clickAction;
                    }
                }
            }
        }

        protected override CreateParams CreateParams
        {
            get
            {
                CreateParams createParams = base.CreateParams;
                createParams.ExStyle |= (int)WindowStyles.WS_EX_COMPOSITED;
                return createParams;
            }
        }

        public TaskThumbnailView()
        {
            Panels = new List<TaskThumbnailPanel>();
            SelectedPanels = new List<TaskThumbnailPanel>();

            InitializeComponent();
            UpdateTheme();
        }

        protected override Point ScrollToControl(Control activeControl)
        {
            return AutoScrollPosition;
        }

        public void UpdateTheme()
        {
            BackColor = ShareXResources.Theme.BackgroundColor;

            foreach (TaskThumbnailPanel panel in Panels)
            {
                panel.UpdateTheme();
            }
        }

        private TaskThumbnailPanel CreatePanel(WorkerTask task)
        {
            TaskThumbnailPanel panel = new TaskThumbnailPanel(task);
            panel.ThumbnailSize = ThumbnailSize;
            panel.ClickAction = ClickAction;
            panel.TitleVisible = TitleVisible;
            panel.TitleLocation = TitleLocation;
            panel.MouseEnter += Panel_MouseEnter;
            panel.MouseDown += (object sender, MouseEventArgs e) => Panel_MouseDown(e, panel);
            panel.MouseUp += Panel_MouseUp;
            panel.ImagePreviewRequested += Panel_ImagePreviewRequested;
            return panel;
        }

        public TaskThumbnailPanel AddPanel(WorkerTask task)
        {
            TaskThumbnailPanel panel = CreatePanel(task);
            Panels.Add(panel);
            flpMain.Controls.Add(panel);
            flpMain.Controls.SetChildIndex(panel, 0);
            UpdateScrollBar();
            return panel;
        }

        public void RemovePanel(WorkerTask task)
        {
            TaskThumbnailPanel panel = FindPanel(task);

            if (panel != null)
            {
                Panels.Remove(panel);
                SelectedPanels.Remove(panel);
                flpMain.Controls.Remove(panel);
                panel.Dispose();
                UpdateScrollBar();
            }
        }

        public TaskThumbnailPanel FindPanel(WorkerTask task)
        {
            return Panels.FirstOrDefault(x => x.Task == task);
        }

        public void UpdateAllThumbnails(bool forceUpdate = false)
        {
            foreach (TaskThumbnailPanel panel in Panels)
            {
                if (forceUpdate || !panel.ThumbnailExists)
                {
                    panel.UpdateThumbnail();
                }
            }
        }

        public void UnselectAllPanels(TaskThumbnailPanel ignorePanel = null)
        {
            SelectedPanels.Clear();

            foreach (TaskThumbnailPanel panel in Panels)
            {
                if (panel != ignorePanel)
                {
                    panel.Selected = false;
                }
            }

            OnSelectedPanelChanged();
        }

        protected void OnContextMenuRequested(object sender, MouseEventArgs e)
        {
            ContextMenuRequested?.Invoke(sender, e);
        }

        protected void OnSelectedPanelChanged()
        {
            SelectedPanelChanged?.Invoke(this, EventArgs.Empty);
        }

        private void Panel_MouseEnter(object sender, EventArgs e)
        {
            // Workaround to handle mouse wheel scrolling in Windows 7
            if (NativeMethods.GetForegroundWindow() == ParentForm.Handle && !flpMain.Focused)
            {
                flpMain.Focus();
            }
        }

        private void Panel_MouseDown(object sender, MouseEventArgs e)
        {
            Panel_MouseDown(e, null);
        }

        private void Panel_MouseDown(MouseEventArgs e, TaskThumbnailPanel panel)
        {
            if (panel == null)
            {
                UnselectAllPanels();
            }
            else
            {
                if (ModifierKeys == Keys.Control)
                {
                    if (panel.Selected)
                    {
                        panel.Selected = false;
                        SelectedPanels.Remove(panel);
                    }
                    else
                    {
                        panel.Selected = true;
                        SelectedPanels.Add(panel);
                    }
                }
                else if (ModifierKeys == Keys.Shift)
                {
                    if (SelectedPanels.Count > 0)
                    {
                        TaskThumbnailPanel firstPanel = SelectedPanels[0];

                        UnselectAllPanels();

                        foreach (TaskThumbnailPanel p in Panels.Range(firstPanel, panel))
                        {
                            p.Selected = true;
                            SelectedPanels.Add(p);
                        }
                    }
                    else
                    {
                        panel.Selected = true;
                        SelectedPanels.Add(panel);
                    }
                }
                else
                {
                    if (!panel.Selected || e.Button == MouseButtons.Left)
                    {
                        UnselectAllPanels(panel);
                        panel.Selected = true;
                        SelectedPanels.Add(panel);
                    }
                }
            }

            OnSelectedPanelChanged();
        }

        private void Panel_MouseUp(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Right)
            {
                OnContextMenuRequested(sender, e);
            }
        }

        private void Panel_ImagePreviewRequested(TaskThumbnailPanel panel)
        {
            string[] images = Panels.Select(x => x.Task.Info.FilePath).Reverse().ToArray();
            int currentImageIndex = Panels.Count - Panels.IndexOf(panel) - 1;
            ImageViewer.ShowImage(images, currentImageIndex);
        }

        protected override bool ProcessCmdKey(ref Message msg, Keys keyData)
        {
            OnKeyDown(new KeyEventArgs(keyData));

            return base.ProcessCmdKey(ref msg, keyData);
        }

        protected override void OnMouseWheel(MouseEventArgs e)
        {
            base.OnMouseWheel(e);

            if (sbMain.Visible)
            {
                int systemLines = SystemInformation.MouseWheelScrollLines;
                if (systemLines <= 0) systemLines = 3;
                int scrollAmount = systemLines * 16;
                int delta = Math.Sign(-e.Delta) * scrollAmount;
                int newValue = Math.Max(0, Math.Min(sbMain.Maximum, sbMain.Value + delta));
                sbMain.Value = newValue;

                ScrollContent();
            }
        }

        private void ScrollContent()
        {
            pMain.SuspendLayout();

            flpMain.Location = new Point(0, -sbMain.Value);

            pMain.ResumeLayout();
        }

        private void UpdateScrollBar()
        {
            int scrollbarWidth = sbMain.Visible ? sbMain.Width : 0;
            flpMain.Size = new Size(pMain.ClientSize.Width - scrollbarWidth, flpMain.PreferredSize.Height);

            int viewportHeight = pMain.ClientSize.Height;
            int contentHeight = flpMain.PreferredSize.Height;

            if (contentHeight <= viewportHeight)
            {
                sbMain.Visible = false;
                flpMain.Location = new Point(0, 0);
            }
            else
            {
                sbMain.Visible = true;
                sbMain.Maximum = contentHeight - viewportHeight;
                sbMain.PageSize = viewportHeight;
                sbMain.Value = Math.Min(sbMain.Value, sbMain.Maximum);
            }
        }

        private void TaskThumbnailView_VisibleChanged(object sender, EventArgs e)
        {
            if (Visible)
            {
                UpdateScrollBar();
            }
        }

        private void TaskThumbnailView_SizeChanged(object sender, EventArgs e)
        {
            UpdateScrollBar();
        }

        private void pMain_Resize(object sender, EventArgs e)
        {
            int scrollbarWidth = sbMain.Visible ? sbMain.Width : 0;
            flpMain.Size = new Size(pMain.ClientSize.Width - scrollbarWidth, flpMain.PreferredSize.Height);
            flpMain.MaximumSize = new Size(pMain.ClientSize.Width, 0);

            UpdateScrollBar();
        }

        private void flpMain_SizeChanged(object sender, EventArgs e)
        {
            UpdateScrollBar();
        }

        private void sbMain_ValueChanged(object sender, EventArgs e)
        {
            ScrollContent();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: TaskThumbnailView.Designer.cs]---
Location: ShareX-develop/ShareX/Controls/TaskThumbnailView.Designer.cs

```csharp
namespace ShareX
{
    partial class TaskThumbnailView
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

        #region Component Designer generated code

        /// <summary> 
        /// Required method for Designer support - do not modify 
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.flpMain = new System.Windows.Forms.FlowLayoutPanel();
            this.pMain = new System.Windows.Forms.Panel();
            this.sbMain = new ShareX.HelpersLib.CustomVScrollBar();
            this.pMain.SuspendLayout();
            this.SuspendLayout();
            // 
            // flpMain
            // 
            this.flpMain.AutoSize = true;
            this.flpMain.Location = new System.Drawing.Point(0, 0);
            this.flpMain.Name = "flpMain";
            this.flpMain.Padding = new System.Windows.Forms.Padding(5, 3, 5, 5);
            this.flpMain.Size = new System.Drawing.Size(128, 128);
            this.flpMain.TabIndex = 0;
            this.flpMain.SizeChanged += new System.EventHandler(this.flpMain_SizeChanged);
            this.flpMain.MouseDown += new System.Windows.Forms.MouseEventHandler(this.Panel_MouseDown);
            this.flpMain.MouseEnter += new System.EventHandler(this.Panel_MouseEnter);
            this.flpMain.MouseUp += new System.Windows.Forms.MouseEventHandler(this.Panel_MouseUp);
            // 
            // pMain
            // 
            this.pMain.Controls.Add(this.flpMain);
            this.pMain.Controls.Add(this.sbMain);
            this.pMain.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pMain.Location = new System.Drawing.Point(0, 0);
            this.pMain.Name = "pMain";
            this.pMain.Size = new System.Drawing.Size(242, 228);
            this.pMain.TabIndex = 1;
            this.pMain.MouseDown += new System.Windows.Forms.MouseEventHandler(this.Panel_MouseDown);
            this.pMain.MouseEnter += new System.EventHandler(this.Panel_MouseEnter);
            this.pMain.MouseUp += new System.Windows.Forms.MouseEventHandler(this.Panel_MouseUp);
            this.pMain.Resize += new System.EventHandler(this.pMain_Resize);
            // 
            // sbMain
            // 
            this.sbMain.Dock = System.Windows.Forms.DockStyle.Right;
            this.sbMain.LargeScrollStep = 100;
            this.sbMain.Location = new System.Drawing.Point(224, 0);
            this.sbMain.Maximum = 0;
            this.sbMain.Minimum = 0;
            this.sbMain.Name = "sbMain";
            this.sbMain.PageSize = 0;
            this.sbMain.Size = new System.Drawing.Size(18, 228);
            this.sbMain.SmallScrollStep = 20;
            this.sbMain.TabIndex = 2;
            this.sbMain.Text = "customVScrollBar1";
            this.sbMain.Value = 0;
            this.sbMain.ValueChanged += new System.EventHandler(this.sbMain_ValueChanged);
            // 
            // TaskThumbnailView
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(42)))), ((int)(((byte)(47)))), ((int)(((byte)(56)))));
            this.Controls.Add(this.pMain);
            this.Name = "TaskThumbnailView";
            this.Size = new System.Drawing.Size(242, 228);
            this.SizeChanged += new System.EventHandler(this.TaskThumbnailView_SizeChanged);
            this.VisibleChanged += new System.EventHandler(this.TaskThumbnailView_VisibleChanged);
            this.MouseDown += new System.Windows.Forms.MouseEventHandler(this.Panel_MouseDown);
            this.MouseEnter += new System.EventHandler(this.Panel_MouseEnter);
            this.MouseUp += new System.Windows.Forms.MouseEventHandler(this.Panel_MouseUp);
            this.pMain.ResumeLayout(false);
            this.pMain.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.FlowLayoutPanel flpMain;
        private System.Windows.Forms.Panel pMain;
        private HelpersLib.CustomVScrollBar sbMain;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: TaskThumbnailView.resx]---
Location: ShareX-develop/ShareX/Controls/TaskThumbnailView.resx

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
</root>
```

--------------------------------------------------------------------------------

---[FILE: AboutForm.ar-YE.resx]---
Location: ShareX-develop/ShareX/Forms/AboutForm.ar-YE.resx

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
  <data name="lblBuild.Text" xml:space="preserve">
    <value>البناء</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>Sharex - حول التطبيق</value>
  </data>
  <data name="lblProductName.Text" xml:space="preserve">
    <value>ShareX</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: AboutForm.cs]---
Location: ShareX-develop/ShareX/Forms/AboutForm.cs

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
using System;
using System.Drawing;
using System.Windows.Forms;

namespace ShareX
{
    public partial class AboutForm : Form
    {
        private EasterEggAboutAnimation easterEgg;
        private bool checkUpdate = false;

        public AboutForm()
        {
            InitializeComponent();
            lblProductName.Text = Program.Title;
            ShareXResources.ApplyTheme(this, true);
            pLogo.BackColor = Color.FromArgb(35, 35, 35);
            cLogo.BackColor = Color.FromArgb(35, 35, 35);

#if STEAM
            uclUpdate.Visible = false;
            lblBuild.Text = "Steam build";
            lblBuild.Visible = true;
#elif MicrosoftStore
            uclUpdate.Visible = false;
            lblBuild.Text = "Microsoft Store build";
            lblBuild.Visible = true;
#else
            if (!SystemOptions.DisableUpdateCheck)
            {
                uclUpdate.UpdateLoadingImage();
                checkUpdate = true;
            }
            else
            {
                uclUpdate.Visible = false;
            }
#endif

            rtbInfo.AppendLine(Resources.AboutForm_AboutForm_Links, FontStyle.Bold, 13);
            rtbInfo.AppendLine($@"{Resources.AboutForm_AboutForm_Website}: {Links.Website}
{Resources.AboutForm_AboutForm_Project_page}: {Links.GitHub}
{Resources.AboutForm_AboutForm_Changelog}: {Links.Changelog}
{Resources.AboutForm_AboutForm_Privacy_policy}: {Links.PrivacyPolicy}
{Resources.AboutForm_AboutForm_Donate}: {Links.Donate}
X: {Links.X}
Discord: {Links.Discord}
Reddit: {Links.Reddit}
Steam: {Links.Steam}
Microsoft Store: {Links.MicrosoftStore}
", FontStyle.Regular);

            rtbInfo.AppendLine(Resources.AboutForm_AboutForm_Team, FontStyle.Bold, 13);
            rtbInfo.AppendLine($@"Jaex: {Links.Jaex}
McoreD: {Links.McoreD}
", FontStyle.Regular);

            rtbInfo.AppendLine(Resources.AboutForm_AboutForm_Translators, FontStyle.Bold, 13);
            rtbInfo.AppendLine($@"{Resources.AboutForm_AboutForm_Language_tr}: https://github.com/Jaex
{Resources.AboutForm_AboutForm_Language_de}: https://github.com/Starbug2 & https://github.com/Kaeltis
{Resources.AboutForm_AboutForm_Language_fr}: https://github.com/nwies & https://github.com/Shadorc
{Resources.AboutForm_AboutForm_Language_zh_CH}: https://github.com/jiajiechan
{Resources.AboutForm_AboutForm_Language_hu}: https://github.com/devBluestar
{Resources.AboutForm_AboutForm_Language_ko_KR}: https://github.com/123jimin
{Resources.AboutForm_AboutForm_Language_es}: https://github.com/ovnisoftware
{Resources.AboutForm_AboutForm_Language_nl_NL}: https://github.com/canihavesomecoffee
{Resources.AboutForm_AboutForm_Language_pt_BR}: https://github.com/RockyTV & https://github.com/athosbr99
{Resources.AboutForm_AboutForm_Language_vi_VN}: https://github.com/thanhpd
{Resources.AboutForm_AboutForm_Language_ru}: https://github.com/L1Q
{Resources.AboutForm_AboutForm_Language_zh_TW}: https://github.com/alantsai
{Resources.AboutForm_AboutForm_Language_it_IT}: https://github.com/pjammo
{Resources.AboutForm_AboutForm_Language_uk}: https://github.com/6c6c6
{Resources.AboutForm_AboutForm_Language_id_ID}: https://github.com/Nicedward
{Resources.AboutForm_AboutForm_Language_es_MX}: https://github.com/absay
{Resources.AboutForm_AboutForm_Language_fa_IR}: https://github.com/pourmand1376
{Resources.AboutForm_AboutForm_Language_pt_PT}: https://github.com/FarewellAngelina
{Resources.AboutForm_AboutForm_Language_ja_JP}: https://github.com/kanaxx
{Resources.AboutForm_AboutForm_Language_ro}: https://github.com/Edward205
{Resources.AboutForm_AboutForm_Language_pl}: https://github.com/RikoDEV
{Resources.AboutForm_AboutForm_Language_he_IL}: https://github.com/erelado
{Resources.AboutForm_AboutForm_Language_ar_YE}: https://github.com/OthmanAliModaes
", FontStyle.Regular);

            rtbInfo.AppendLine(Resources.AboutForm_AboutForm_Credits, FontStyle.Bold, 13);
            rtbInfo.AppendLine(@"Json.NET: https://github.com/JamesNK/Newtonsoft.Json
SSH.NET: https://github.com/sshnet/SSH.NET
Icons: http://p.yusukekamiyamane.com
ImageListView: https://github.com/oozcitak/imagelistview
FFmpeg: https://www.ffmpeg.org
Recorder devices: https://github.com/rdp/screen-capture-recorder-to-video-windows-free
FluentFTP: https://github.com/robinrodricks/FluentFTP
ZXing.Net: https://github.com/micjahn/ZXing.Net
MegaApiClient: https://github.com/gpailler/MegaApiClient
Blob Emoji: http://blobs.gg
ExifTool: https://exiftool.org
", FontStyle.Regular);

            rtbInfo.AppendText("Copyright (c) 2007-2025 ShareX Team", FontStyle.Bold, 13);

            easterEgg = new EasterEggAboutAnimation(cLogo, this);
        }

        private async void AboutForm_Shown(object sender, EventArgs e)
        {
            this.ForceActivate();

            if (checkUpdate)
            {
                UpdateChecker updateChecker = Program.UpdateManager.CreateUpdateChecker();
                await uclUpdate.CheckUpdate(updateChecker);
            }
        }

        private void pbLogo_MouseDown(object sender, MouseEventArgs e)
        {
            easterEgg.Start();
            pbLogo.Visible = false;
            TaskHelpers.PlayNotificationSoundAsync(NotificationSound.ActionCompleted);
        }

        private void rtb_LinkClicked(object sender, LinkClickedEventArgs e)
        {
            URLHelpers.OpenURL(e.LinkText);
        }
    }
}
```

--------------------------------------------------------------------------------

````
