---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 251
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 251 of 650)

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

---[FILE: TabToListView.Designer.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/TabToListView.Designer.cs

```csharp
namespace ShareX.HelpersLib
{
    partial class TabToListView
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
            this.scMain = new System.Windows.Forms.SplitContainer();
            this.tcMain = new System.Windows.Forms.TabControl();
            this.lvMain = new HelpersLib.MyListView();
            this.columnHeader2 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            ((System.ComponentModel.ISupportInitialize)(this.scMain)).BeginInit();
            this.scMain.Panel1.SuspendLayout();
            this.scMain.Panel2.SuspendLayout();
            this.scMain.SuspendLayout();
            this.SuspendLayout();
            // 
            // scMain
            // 
            this.scMain.Dock = System.Windows.Forms.DockStyle.Fill;
            this.scMain.FixedPanel = System.Windows.Forms.FixedPanel.Panel1;
            this.scMain.IsSplitterFixed = true;
            this.scMain.Location = new System.Drawing.Point(0, 0);
            this.scMain.Margin = new System.Windows.Forms.Padding(0);
            this.scMain.Name = "scMain";
            // 
            // scMain.Panel1
            // 
            this.scMain.Panel1.Controls.Add(this.lvMain);
            // 
            // scMain.Panel2
            // 
            this.scMain.Panel2.Controls.Add(this.tcMain);
            this.scMain.Size = new System.Drawing.Size(700, 500);
            this.scMain.SplitterDistance = 237;
            this.scMain.SplitterWidth = 3;
            this.scMain.TabIndex = 0;
            // 
            // tcMain
            // 
            this.tcMain.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tcMain.Location = new System.Drawing.Point(0, 0);
            this.tcMain.Name = "tcMain";
            this.tcMain.SelectedIndex = 0;
            this.tcMain.Size = new System.Drawing.Size(460, 500);
            this.tcMain.TabIndex = 0;
            // 
            // lvMain
            // 
            this.lvMain.AutoFillColumn = true;
            this.lvMain.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.columnHeader2});
            this.lvMain.Dock = System.Windows.Forms.DockStyle.Fill;
            this.lvMain.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(162)));
            this.lvMain.FullRowSelect = true;
            this.lvMain.HeaderStyle = System.Windows.Forms.ColumnHeaderStyle.None;
            this.lvMain.HideSelection = false;
            this.lvMain.Location = new System.Drawing.Point(0, 0);
            this.lvMain.MultiSelect = false;
            this.lvMain.Name = "lvMain";
            this.lvMain.Size = new System.Drawing.Size(237, 500);
            this.lvMain.TabIndex = 0;
            this.lvMain.UseCompatibleStateImageBehavior = false;
            this.lvMain.View = System.Windows.Forms.View.Details;
            this.lvMain.SelectedIndexChanged += new System.EventHandler(this.lvMain_SelectedIndexChanged);
            this.lvMain.MouseUp += new System.Windows.Forms.MouseEventHandler(this.lvMain_MouseUp);
            // 
            // TabToListView
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(96F, 96F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            this.Controls.Add(this.scMain);
            this.Margin = new System.Windows.Forms.Padding(0);
            this.Name = "TabToListView";
            this.Size = new System.Drawing.Size(700, 500);
            this.scMain.Panel1.ResumeLayout(false);
            this.scMain.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.scMain)).EndInit();
            this.scMain.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.SplitContainer scMain;
        private MyListView lvMain;
        private System.Windows.Forms.ColumnHeader columnHeader2;
        private System.Windows.Forms.TabControl tcMain;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: TabToTreeView.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/TabToTreeView.cs

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
using System.ComponentModel;
using System.Drawing;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public partial class TabToTreeView : UserControl
    {
        public delegate void TabChangedEventHandler(TabPage tabPage);
        public event TabChangedEventHandler TabChanged;

        private TabControl mainTabControl;

        [Browsable(false)]
        public TabControl MainTabControl
        {
            get
            {
                return mainTabControl;
            }
            set
            {
                if (mainTabControl != value)
                {
                    mainTabControl = value;
                    FillTreeView(tvMain.Nodes, mainTabControl);
                    tvMain.ExpandAll();
                }
            }
        }

        private int treeViewSize;

        public int TreeViewSize
        {
            get
            {
                return treeViewSize;
            }
            set
            {
                treeViewSize = value;
                scMain.SplitterDistance = treeViewSize;
            }
        }

        public Font TreeViewFont
        {
            get
            {
                return tvMain.Font;
            }
            set
            {
                tvMain.Font = value;
            }
        }

        public ImageList ImageList
        {
            get
            {
                return tvMain.ImageList;
            }
            set
            {
                tvMain.ImageList = value;
            }
        }

        public Color LeftPanelBackColor
        {
            get
            {
                return scMain.Panel1.BackColor;
            }
            set
            {
                pLeft.BackColor = value;
                tvMain.BackColor = value;
            }
        }

        public Color SeparatorColor
        {
            get
            {
                return pSeparator.BackColor;
            }
            set
            {
                pSeparator.BackColor = value;
            }
        }

        [DefaultValue(false)]
        public bool AutoSelectChild { get; set; }

        public TabToTreeView()
        {
            InitializeComponent();
            TreeViewSize = 150;
        }

        private void FillTreeView(TreeNodeCollection nodeCollection, TabControl tab, TreeNode parent = null)
        {
            if (nodeCollection != null && tab != null)
            {
                foreach (TabPage tabPage in tab.TabPages)
                {
                    if (parent != null && string.IsNullOrEmpty(tabPage.Text))
                    {
                        parent.Tag = tabPage;
                        continue;
                    }

                    TreeNode treeNode = new TreeNode(tabPage.Text);
                    if (!string.IsNullOrEmpty(tabPage.ImageKey))
                    {
                        treeNode.ImageKey = treeNode.SelectedImageKey = tabPage.ImageKey;
                    }
                    treeNode.Tag = tabPage;
                    nodeCollection.Add(treeNode);

                    foreach (Control control in tabPage.Controls)
                    {
                        if (control is TabControl)
                        {
                            FillTreeView(treeNode.Nodes, control as TabControl, treeNode);
                            break;
                        }
                    }
                }
            }
        }

        private void tvMain_BeforeCollapse(object sender, TreeViewCancelEventArgs e)
        {
            e.Cancel = true;
        }

        private void tvMain_AfterSelect(object sender, TreeViewEventArgs e)
        {
            if (e.Node.Tag is TabPage tabPage)
            {
                if (AutoSelectChild && tabPage.Controls.Count == 1 && tabPage.Controls[0] is TabControl)
                {
                    SelectChildNode();
                }
                else
                {
                    SelectTabPage(tabPage);
                }
            }
        }

        private void SelectTabPage(TabPage tabPage)
        {
            if (tabPage != null)
            {
                tcMain.Visible = true;
                tcMain.TabPages.Clear();
                tcMain.TabPages.Add(tabPage);
                tvMain.Focus();

                OnTabChanged(tabPage);
            }
        }

        public void NavigateToTabPage(TabPage tabPage)
        {
            if (tabPage != null)
            {
                foreach (TreeNode node in tvMain.Nodes.All())
                {
                    TabPage nodeTabPage = node.Tag as TabPage;

                    if (nodeTabPage == tabPage)
                    {
                        tvMain.SelectedNode = node;
                        return;
                    }
                }
            }
        }

        public void SelectChildNode()
        {
            TreeNode node = tvMain.SelectedNode;

            if (node != null && node.Nodes.Count > 0)
            {
                tvMain.SelectedNode = node.Nodes[0];
            }
        }

        protected void OnTabChanged(TabPage tabPage)
        {
            TabChanged?.Invoke(tabPage);
        }

        protected override void ScaleControl(SizeF factor, BoundsSpecified specified)
        {
            base.ScaleControl(factor, specified);
            scMain.SplitterDistance = (int)Math.Round(scMain.SplitterDistance * factor.Width);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: TabToTreeView.Designer.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/TabToTreeView.Designer.cs

```csharp
namespace ShareX.HelpersLib
{
    partial class TabToTreeView
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
            this.tvMain = new System.Windows.Forms.TreeView();
            this.scMain = new System.Windows.Forms.SplitContainer();
            this.pSeparator = new System.Windows.Forms.Panel();
            this.tcMain = new ShareX.HelpersLib.TablessControl();
            this.pLeft = new System.Windows.Forms.Panel();
            ((System.ComponentModel.ISupportInitialize)(this.scMain)).BeginInit();
            this.scMain.Panel1.SuspendLayout();
            this.scMain.Panel2.SuspendLayout();
            this.scMain.SuspendLayout();
            this.pLeft.SuspendLayout();
            this.SuspendLayout();
            // 
            // tvMain
            // 
            this.tvMain.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.tvMain.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tvMain.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(162)));
            this.tvMain.FullRowSelect = true;
            this.tvMain.HideSelection = false;
            this.tvMain.ItemHeight = 25;
            this.tvMain.Location = new System.Drawing.Point(8, 8);
            this.tvMain.Name = "tvMain";
            this.tvMain.ShowLines = false;
            this.tvMain.ShowPlusMinus = false;
            this.tvMain.Size = new System.Drawing.Size(221, 484);
            this.tvMain.TabIndex = 0;
            this.tvMain.BeforeCollapse += new System.Windows.Forms.TreeViewCancelEventHandler(this.tvMain_BeforeCollapse);
            this.tvMain.AfterSelect += new System.Windows.Forms.TreeViewEventHandler(this.tvMain_AfterSelect);
            // 
            // scMain
            // 
            this.scMain.Dock = System.Windows.Forms.DockStyle.Fill;
            this.scMain.FixedPanel = System.Windows.Forms.FixedPanel.Panel1;
            this.scMain.IsSplitterFixed = true;
            this.scMain.Location = new System.Drawing.Point(0, 0);
            this.scMain.Margin = new System.Windows.Forms.Padding(0);
            this.scMain.Name = "scMain";
            // 
            // scMain.Panel1
            // 
            this.scMain.Panel1.Controls.Add(this.pSeparator);
            this.scMain.Panel1.Controls.Add(this.pLeft);
            // 
            // scMain.Panel2
            // 
            this.scMain.Panel2.Controls.Add(this.tcMain);
            this.scMain.Size = new System.Drawing.Size(700, 500);
            this.scMain.SplitterDistance = 237;
            this.scMain.SplitterWidth = 3;
            this.scMain.TabIndex = 0;
            // 
            // pSeparator
            // 
            this.pSeparator.BackColor = System.Drawing.SystemColors.ControlDark;
            this.pSeparator.Dock = System.Windows.Forms.DockStyle.Right;
            this.pSeparator.Location = new System.Drawing.Point(236, 0);
            this.pSeparator.MaximumSize = new System.Drawing.Size(1, 0);
            this.pSeparator.Name = "pSeparator";
            this.pSeparator.Size = new System.Drawing.Size(1, 500);
            this.pSeparator.TabIndex = 1;
            // 
            // tcMain
            // 
            this.tcMain.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tcMain.Location = new System.Drawing.Point(0, 0);
            this.tcMain.Name = "tcMain";
            this.tcMain.SelectedIndex = 0;
            this.tcMain.Size = new System.Drawing.Size(460, 500);
            this.tcMain.TabIndex = 0;
            this.tcMain.Visible = false;
            // 
            // pLeft
            // 
            this.pLeft.Controls.Add(this.tvMain);
            this.pLeft.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pLeft.Location = new System.Drawing.Point(0, 0);
            this.pLeft.Name = "pLeft";
            this.pLeft.Padding = new System.Windows.Forms.Padding(8);
            this.pLeft.Size = new System.Drawing.Size(237, 500);
            this.pLeft.TabIndex = 2;
            // 
            // TabToTreeView
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(96F, 96F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            this.Controls.Add(this.scMain);
            this.Margin = new System.Windows.Forms.Padding(0);
            this.Name = "TabToTreeView";
            this.Size = new System.Drawing.Size(700, 500);
            this.scMain.Panel1.ResumeLayout(false);
            this.scMain.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.scMain)).EndInit();
            this.scMain.ResumeLayout(false);
            this.pLeft.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TreeView tvMain;
        private System.Windows.Forms.SplitContainer scMain;
        private TablessControl tcMain;
        private System.Windows.Forms.Panel pSeparator;
        private System.Windows.Forms.Panel pLeft;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: TabToTreeView.resx]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/TabToTreeView.resx

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

---[FILE: ToolStripBorderRight.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/ToolStripBorderRight.cs

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
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public class ToolStripBorderRight : ToolStrip
    {
        public bool DrawCustomBorder { get; set; } = true;

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);

            if (DrawCustomBorder)
            {
                using (Pen pen = new Pen(ProfessionalColors.SeparatorDark))
                {
                    e.Graphics.DrawLine(pen, new Point(ClientSize.Width - 1, 0), new Point(ClientSize.Width - 1, ClientSize.Height - 1));
                }
            }
        }

        protected override void OnPaintBackground(PaintEventArgs e)
        {
            base.OnPaintBackground(e);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ToolStripButtonColorAnimation.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/ToolStripButtonColorAnimation.cs

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
using System.ComponentModel;
using System.Drawing;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public class ToolStripButtonColorAnimation : ToolStripButton
    {
        [DefaultValue(typeof(Color), "ControlText")]
        public Color FromColor { get; set; }

        [DefaultValue(typeof(Color), "Red")]
        public Color ToColor { get; set; }

        [DefaultValue(1f)]
        public float AnimationSpeed { get; set; }

        private Timer timer;
        private float progress;
        private float direction = 1;
        private float speed;

        public ToolStripButtonColorAnimation()
        {
            timer = new Timer();
            timer.Interval = 100;
            timer.Tick += timer_Tick;

            FromColor = SystemColors.ControlText;
            ToColor = Color.Red;
            AnimationSpeed = 1f;
        }

        public void StartAnimation()
        {
            speed = AnimationSpeed / (1000f / timer.Interval);
            timer.Start();
        }

        public void StopAnimation()
        {
            timer.Stop();
        }

        public void ResetAnimation()
        {
            StopAnimation();
            ForeColor = FromColor;
        }

        private void timer_Tick(object sender, EventArgs e)
        {
            progress += direction * speed;

            if (progress < 0)
            {
                progress = 0;
                direction = -direction;
            }
            else if (progress > 1)
            {
                progress = 1;
                direction = -direction;
            }

            ForeColor = ColorHelpers.Lerp(FromColor, ToColor, progress);
        }

        protected override void Dispose(bool disposing)
        {
            if (timer != null)
            {
                timer.Dispose();
            }

            base.Dispose(disposing);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ToolStripButtonCounter.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/ToolStripButtonCounter.cs

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
using System.Drawing.Drawing2D;

namespace ShareX.HelpersLib
{
    public class ToolStripButtonCounter : ToolStripButtonExtraImage
    {
        private int counter;

        public int Counter
        {
            get
            {
                return counter;
            }
            set
            {
                counter = value;
                UpdateImage();
            }
        }

        private void UpdateImage()
        {
            if (counter <= 0)
            {
                ShowExtraImage = false;

                if (ExtraImage != null)
                {
                    ExtraImage.Dispose();
                }

                ExtraImage = null;
            }
            else
            {
                int size = Height - (ExtraImagePadding * 2);
                Bitmap bmp = new Bitmap(size, size);

                using (Graphics g = Graphics.FromImage(bmp))
                using (Brush shadowBrush = new SolidBrush(Color.FromArgb(150, 0, 0, 0)))
                using (Brush brush = new SolidBrush(Color.FromArgb(230, 0, 0)))
                using (Font font = new Font("Arial", 9, FontStyle.Bold))
                using (StringFormat stringFormat = new StringFormat())
                {
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.PixelOffsetMode = PixelOffsetMode.Half;
                    g.DrawRoundedRectangle(shadowBrush, new Rectangle(0, 1, bmp.Width, bmp.Height), 3);
                    g.DrawRoundedRectangle(brush, new Rectangle(0, 0, bmp.Width, bmp.Height), 3);
                    stringFormat.Alignment = StringAlignment.Center;
                    stringFormat.LineAlignment = StringAlignment.Center;
                    string text;
                    if (Counter > 9)
                    {
                        text = "+";
                    }
                    else
                    {
                        text = Counter.ToString();
                    }
                    g.DrawString(text, font, Brushes.White, new Rectangle(0, 0, bmp.Width, bmp.Height), stringFormat);
                }

                if (ExtraImage != null)
                {
                    ExtraImage.Dispose();
                }

                ExtraImage = bmp;
                ShowExtraImage = true;
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ToolStripButtonExtraImage.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/ToolStripButtonExtraImage.cs

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

using System.ComponentModel;
using System.Drawing;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public class ToolStripButtonExtraImage : ToolStripButton
    {
        [DefaultValue(false)]
        public bool ShowExtraImage { get; set; }

        private Image extraImage;

        [DefaultValue(null)]
        public Image ExtraImage
        {
            get
            {
                return extraImage;
            }
            set
            {
                extraImage = value;
                Invalidate();
            }
        }

        [DefaultValue(2)]
        public int ExtraImagePadding { get; set; } = 2;

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);

            if (ShowExtraImage && ExtraImage != null)
            {
                e.Graphics.DrawImage(ExtraImage, new Point(Width - ExtraImage.Width - ExtraImagePadding, ExtraImagePadding));
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (ExtraImage != null)
                {
                    ExtraImage.Dispose();
                }
            }

            base.Dispose(disposing);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ToolStripCustomRenderer.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/ToolStripCustomRenderer.cs

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
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public class ToolStripCustomRenderer : ToolStripRoundedEdgeRenderer
    {
        public ToolStripCustomRenderer()
        {
        }

        public ToolStripCustomRenderer(ProfessionalColorTable professionalColorTable) : base(professionalColorTable)
        {
        }

        protected override void OnRenderItemText(ToolStripItemTextRenderEventArgs e)
        {
            if (e.Item is ToolStripMenuItem tsmi && tsmi.Checked)
            {
                e.TextFont = new Font(tsmi.Font, FontStyle.Bold);
            }

            base.OnRenderItemText(e);
        }

        protected override void OnRenderArrow(ToolStripArrowRenderEventArgs e)
        {
            if (e.Item is ToolStripDropDownButton tsddb && tsddb.Owner is ToolStripBorderRight)
            {
                e.Direction = ArrowDirection.Right;
            }

            base.OnRenderArrow(e);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ToolStripDarkRenderer.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/ToolStripDarkRenderer.cs

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

using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public class ToolStripDarkRenderer : ToolStripCustomRenderer
    {
        public ToolStripDarkRenderer() : base(new DarkColorTable())
        {
        }

        protected override void OnRenderItemText(ToolStripItemTextRenderEventArgs e)
        {
            e.TextColor = ShareXResources.Theme.TextColor;

            base.OnRenderItemText(e);
        }

        protected override void OnRenderArrow(ToolStripArrowRenderEventArgs e)
        {
            e.ArrowColor = ShareXResources.Theme.TextColor;

            base.OnRenderArrow(e);
        }
    }
}
```

--------------------------------------------------------------------------------

````
