---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 252
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 252 of 650)

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

---[FILE: ToolStripDoubleLabeledNumericUpDown.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/ToolStripDoubleLabeledNumericUpDown.cs

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
using System.Windows.Forms.Design;

namespace ShareX.HelpersLib
{
    [ToolStripItemDesignerAvailability(ToolStripItemDesignerAvailability.MenuStrip | ToolStripItemDesignerAvailability.ContextMenuStrip)]
    public class ToolStripDoubleLabeledNumericUpDown : ToolStripControlHost
    {
        public DoubleLabeledNumericUpDown Content
        {
            get
            {
                return Control as DoubleLabeledNumericUpDown;
            }
        }

        public ToolStripDoubleLabeledNumericUpDown(string text, string text2) : base(new DoubleLabeledNumericUpDown())
        {
            Content.Text = text;
            Content.Text2 = text2;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ToolStripEx.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/ToolStripEx.cs

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
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    // https://blogs.msdn.microsoft.com/rickbrew/2006/01/09/how-to-enable-click-through-for-net-2-0-toolstrip-and-menustrip/
    public class ToolStripEx : ToolStrip
    {
        private bool clickThrough = false;

        [DefaultValue(false)]
        public bool ClickThrough
        {
            get
            {
                return clickThrough;
            }
            set
            {
                clickThrough = value;
            }
        }

        protected override void WndProc(ref Message m)
        {
            base.WndProc(ref m);

            if (clickThrough && m.Msg == (int)WindowsMessages.MOUSEACTIVATE && m.Result == (IntPtr)NativeConstants.MA_ACTIVATEANDEAT)
            {
                m.Result = (IntPtr)NativeConstants.MA_ACTIVATE;
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ToolStripLabeledComboBox.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/ToolStripLabeledComboBox.cs

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
using System.Windows.Forms.Design;

namespace ShareX.HelpersLib
{
    [ToolStripItemDesignerAvailability(ToolStripItemDesignerAvailability.MenuStrip | ToolStripItemDesignerAvailability.ContextMenuStrip)]
    public class ToolStripLabeledComboBox : ToolStripControlHost
    {
        public LabeledComboBox Content => Control as LabeledComboBox;

        public ToolStripLabeledComboBox(string text) : base(new LabeledComboBox())
        {
            Content.Text = text;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ToolStripLabeledNumericUpDown.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/ToolStripLabeledNumericUpDown.cs

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
using System.Windows.Forms.Design;

namespace ShareX.HelpersLib
{
    [ToolStripItemDesignerAvailability(ToolStripItemDesignerAvailability.MenuStrip | ToolStripItemDesignerAvailability.ContextMenuStrip)]
    public class ToolStripLabeledNumericUpDown : ToolStripControlHost
    {
        public LabeledNumericUpDown Content => Control as LabeledNumericUpDown;

        public ToolStripLabeledNumericUpDown(string text) : base(new LabeledNumericUpDown())
        {
            Content.Text = text;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ToolStripNumericUpDown.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/ToolStripNumericUpDown.cs

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
using System.Windows.Forms;
using System.Windows.Forms.Design;

namespace ShareX.HelpersLib
{
    [ToolStripItemDesignerAvailability(ToolStripItemDesignerAvailability.ToolStrip)]
    public class ToolStripNumericUpDown : ToolStripControlHost
    {
        public event EventHandler ValueChanged;

        public NumericUpDown NumericUpDownControl
        {
            get
            {
                return Control as NumericUpDown;
            }
        }

        public ToolStripNumericUpDown() : base(new NumericUpDown())
        {
        }

        protected override void OnSubscribeControlEvents(Control control)
        {
            base.OnSubscribeControlEvents(control);

            ((NumericUpDown)control).ValueChanged += new EventHandler(OnValueChanged);
        }

        protected override void OnUnsubscribeControlEvents(Control control)
        {
            base.OnUnsubscribeControlEvents(control);

            ((NumericUpDown)control).ValueChanged -= new EventHandler(OnValueChanged);
        }

        public void OnValueChanged(object sender, EventArgs e)
        {
            ValueChanged?.Invoke(this, e);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ToolStripRadioButtonMenuItem.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/ToolStripRadioButtonMenuItem.cs

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
using System.Drawing;
using System.Windows.Forms;
using System.Windows.Forms.VisualStyles;

namespace ShareX.HelpersLib
{
    public class ToolStripRadioButtonMenuItem : ToolStripMenuItem
    {
        public ToolStripRadioButtonMenuItem()
        {
            Initialize();
        }

        public ToolStripRadioButtonMenuItem(string text) : base(text, null, (EventHandler)null)
        {
            Initialize();
        }

        public ToolStripRadioButtonMenuItem(Image image) : base(null, image, (EventHandler)null)
        {
            Initialize();
        }

        public ToolStripRadioButtonMenuItem(string text, Image image) : base(text, image, (EventHandler)null)
        {
            Initialize();
        }

        public ToolStripRadioButtonMenuItem(string text, Image image, EventHandler onClick) : base(text, image, onClick)
        {
            Initialize();
        }

        public ToolStripRadioButtonMenuItem(string text, Image image, EventHandler onClick, string name) : base(text, image, onClick, name)
        {
            Initialize();
        }

        public ToolStripRadioButtonMenuItem(string text, Image image, params ToolStripItem[] dropDownItems) : base(text, image, dropDownItems)
        {
            Initialize();
        }

        public ToolStripRadioButtonMenuItem(string text, Image image, EventHandler onClick, Keys shortcutKeys) : base(text, image, onClick)
        {
            Initialize();
            ShortcutKeys = shortcutKeys;
        }

        // Called by all constructors to initialize CheckOnClick.
        private void Initialize()
        {
            CheckOnClick = true;
        }

        protected override void OnCheckedChanged(EventArgs e)
        {
            base.OnCheckedChanged(e);

            if (Checked && Parent != null)
            {
                // Clear the checked state for all siblings.
                foreach (ToolStripItem item in Parent.Items)
                {
                    if (item is ToolStripRadioButtonMenuItem radioItem && radioItem != this && radioItem.Checked)
                    {
                        radioItem.Checked = false;

                        // Only one item can be selected at a time,
                        // so there is no need to continue.
                        return;
                    }
                }
            }
        }

        protected override void OnClick(EventArgs e)
        {
            // If the item is already in the checked state, do not call
            // the base method, which would toggle the value.
            if (Checked) return;

            base.OnClick(e);
        }

        // Let the item paint itself, and then paint the RadioButton
        // where the check mark is displayed, covering the check mark
        // if it is present.
        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);

            // If the client sets the Image property, the selection behavior
            // remains unchanged, but the RadioButton is not displayed and the
            // selection is indicated only by the selection rectangle.
            if (Image != null) return;

            // Determine the correct state of the RadioButton.
            RadioButtonState buttonState = RadioButtonState.UncheckedNormal;
            if (Enabled)
            {
                if (mouseDownState)
                {
                    if (Checked) buttonState = RadioButtonState.CheckedPressed;
                    else buttonState = RadioButtonState.UncheckedPressed;
                }
                else if (mouseHoverState)
                {
                    if (Checked) buttonState = RadioButtonState.CheckedHot;
                    else buttonState = RadioButtonState.UncheckedHot;
                }
                else
                {
                    if (Checked) buttonState = RadioButtonState.CheckedNormal;
                }
            }
            else
            {
                if (Checked) buttonState = RadioButtonState.CheckedDisabled;
                else buttonState = RadioButtonState.UncheckedDisabled;
            }

            // Calculate the position at which to display the RadioButton.
            int offset = (ContentRectangle.Height - RadioButtonRenderer.GetGlyphSize(e.Graphics, buttonState).Height) / 2;
            Point imageLocation = new Point(ContentRectangle.Location.X + 4, ContentRectangle.Location.Y + offset);

            // If the item is selected and the RadioButton paints with partial
            // transparency, such as when theming is enabled, the check mark
            // shows through the RadioButton image. In this case, paint a
            // non-transparent background first to cover the check mark.
            if (Checked && RadioButtonRenderer.IsBackgroundPartiallyTransparent(buttonState))
            {
                Size glyphSize = RadioButtonRenderer.GetGlyphSize(e.Graphics, buttonState);
                glyphSize.Height--;
                glyphSize.Width--;
                Rectangle backgroundRectangle = new Rectangle(imageLocation, glyphSize);
                e.Graphics.FillEllipse(SystemBrushes.Control, backgroundRectangle);
            }

            RadioButtonRenderer.DrawRadioButton(e.Graphics, imageLocation, buttonState);
        }

        private bool mouseHoverState;

        protected override void OnMouseEnter(EventArgs e)
        {
            mouseHoverState = true;

            // Force the item to repaint with the new RadioButton state.
            Invalidate();

            base.OnMouseEnter(e);
        }

        protected override void OnMouseLeave(EventArgs e)
        {
            mouseHoverState = false;
            base.OnMouseLeave(e);
        }

        private bool mouseDownState;

        protected override void OnMouseDown(MouseEventArgs e)
        {
            mouseDownState = true;

            // Force the item to repaint with the new RadioButton state.
            Invalidate();

            base.OnMouseDown(e);
        }

        protected override void OnMouseUp(MouseEventArgs e)
        {
            mouseDownState = false;
            base.OnMouseUp(e);
        }

        // Enable the item only if its parent item is in the checked state
        // and its Enabled property has not been explicitly set to false.
        public override bool Enabled
        {
            get
            {
                // Use the base value in design mode to prevent the designer
                // from setting the base value to the calculated value.
                if (!DesignMode && OwnerItem is ToolStripMenuItem ownerMenuItem && ownerMenuItem.CheckOnClick)
                {
                    return base.Enabled && ownerMenuItem.Checked;
                }

                return base.Enabled;
            }
            set
            {
                base.Enabled = value;
            }
        }

        // When OwnerItem becomes available, if it is a ToolStripMenuItem
        // with a CheckOnClick property value of true, subscribe to its
        // CheckedChanged event.
        protected override void OnOwnerChanged(EventArgs e)
        {
            if (OwnerItem is ToolStripMenuItem ownerMenuItem && ownerMenuItem.CheckOnClick)
            {
                ownerMenuItem.CheckedChanged += OwnerMenuItem_CheckedChanged;
            }

            base.OnOwnerChanged(e);
        }

        // When the checked state of the parent item changes,
        // repaint the item so that the new Enabled state is displayed.
        private void OwnerMenuItem_CheckedChanged(object sender, EventArgs e)
        {
            Invalidate();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ToolStripRoundedEdgeRenderer.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/ToolStripRoundedEdgeRenderer.cs

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
    public class ToolStripRoundedEdgeRenderer : ToolStripProfessionalRenderer
    {
        public ToolStripRoundedEdgeRenderer()
        {
            RoundedEdges = false;
        }

        public ToolStripRoundedEdgeRenderer(ProfessionalColorTable professionalColorTable) : base(professionalColorTable)
        {
            RoundedEdges = false;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: BlackStyleButton.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/BlackStyle/BlackStyleButton.cs

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
using System.Drawing.Design;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    [DefaultEvent("MouseClick")]
    public class BlackStyleButton : Control
    {
        [Editor("System.ComponentModel.Design.MultilineStringEditor, System.Design, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a", typeof(UITypeEditor))]
        public override string Text
        {
            get
            {
                return text;
            }
            set
            {
                if (value == null)
                {
                    value = "";
                }

                if (text != value)
                {
                    text = value;

                    Invalidate();
                }
            }
        }

        private string text;
        private bool isHover;
        private LinearGradientBrush backgroundBrush, backgroundHoverBrush, innerBorderBrush;
        private Pen innerBorderPen, borderPen;

        public BlackStyleButton()
        {
            SetStyle(ControlStyles.UserPaint | ControlStyles.AllPaintingInWmPaint | ControlStyles.ResizeRedraw | ControlStyles.OptimizedDoubleBuffer | ControlStyles.SupportsTransparentBackColor, true);
            ForeColor = Color.White;
            Font = new Font("Arial", 12);
            borderPen = new Pen(Color.FromArgb(30, 30, 30));
            Prepare();
        }

        private void Prepare()
        {
            backgroundBrush = new LinearGradientBrush(new Rectangle(2, 2, ClientSize.Width - 4, ClientSize.Height - 4), Color.FromArgb(105, 105, 105), Color.FromArgb(65, 65, 65), LinearGradientMode.Vertical);
            backgroundHoverBrush = new LinearGradientBrush(new Rectangle(2, 2, ClientSize.Width - 4, ClientSize.Height - 4), Color.FromArgb(115, 115, 115), Color.FromArgb(75, 75, 75), LinearGradientMode.Vertical);
            innerBorderBrush = new LinearGradientBrush(new Rectangle(1, 1, ClientSize.Width - 2, ClientSize.Height - 2), Color.FromArgb(125, 125, 125), Color.FromArgb(75, 75, 75), LinearGradientMode.Vertical);
            innerBorderPen = new Pen(innerBorderBrush);
        }

        protected override void OnPaint(PaintEventArgs pe)
        {
            base.OnPaint(pe);

            Graphics g = pe.Graphics;

            DrawBackground(g);

            if (!string.IsNullOrEmpty(Text))
            {
                DrawText(g);
            }
        }

        protected override void OnMouseEnter(EventArgs e)
        {
            base.OnMouseEnter(e);

            isHover = true;
            Invalidate();
        }

        protected override void OnMouseLeave(EventArgs e)
        {
            base.OnMouseLeave(e);

            isHover = false;
            Invalidate();
        }

        protected override void OnResize(EventArgs e)
        {
            base.OnResize(e);

            Prepare();
        }

        private void DrawBackground(Graphics g)
        {
            if (isHover)
            {
                g.FillRectangle(backgroundHoverBrush, new Rectangle(2, 2, ClientSize.Width - 4, ClientSize.Height - 4));
            }
            else
            {
                g.FillRectangle(backgroundBrush, new Rectangle(2, 2, ClientSize.Width - 4, ClientSize.Height - 4));
            }

            g.DrawRectangle(innerBorderPen, new Rectangle(1, 1, ClientSize.Width - 3, ClientSize.Height - 3));
            g.DrawRectangle(borderPen, new Rectangle(0, 0, ClientSize.Width - 1, ClientSize.Height - 1));
        }

        private void DrawText(Graphics g)
        {
            TextRenderer.DrawText(g, Text, Font, new Rectangle(ClientRectangle.X, ClientRectangle.Y + 1, ClientRectangle.Width, ClientRectangle.Height), Color.Black);
            TextRenderer.DrawText(g, Text, Font, ClientRectangle, ForeColor);
        }

        protected override void Dispose(bool disposing)
        {
            if (backgroundBrush != null) backgroundBrush.Dispose();
            if (backgroundHoverBrush != null) backgroundHoverBrush.Dispose();
            if (innerBorderBrush != null) innerBorderBrush.Dispose();
            if (innerBorderPen != null) innerBorderPen.Dispose();
            if (borderPen != null) borderPen.Dispose();

            base.Dispose(disposing);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: BlackStyleCheckBox.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/BlackStyle/BlackStyleCheckBox.cs

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
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    [DefaultEvent("CheckedChanged")]
    public class BlackStyleCheckBox : Control
    {
        [DefaultValue(false)]
        public bool Checked
        {
            get
            {
                return isChecked;
            }
            set
            {
                if (isChecked != value)
                {
                    isChecked = value;

                    OnCheckedChanged(EventArgs.Empty);

                    Invalidate();
                }
            }
        }

        public override string Text
        {
            get
            {
                return text;
            }
            set
            {
                if (value == null)
                {
                    value = "";
                }

                if (text != value)
                {
                    text = value;

                    Invalidate();
                }
            }
        }

        [DefaultValue(3)]
        public int SpaceAfterCheckBox { get; set; }

        [DefaultValue(false)]
        public bool IgnoreClick { get; set; }

        private bool isChecked, isHover;
        private string text;

        private LinearGradientBrush backgroundBrush, backgroundCheckedBrush, innerBorderBrush, innerBorderCheckedBrush;
        private Pen innerBorderPen, innerBorderCheckedPen, borderPen;

        private const int checkBoxSize = 13;

        public event EventHandler CheckedChanged;

        public BlackStyleCheckBox()
        {
            SpaceAfterCheckBox = 3;

            SetStyle(ControlStyles.UserPaint | ControlStyles.AllPaintingInWmPaint | ControlStyles.ResizeRedraw | ControlStyles.OptimizedDoubleBuffer | ControlStyles.SupportsTransparentBackColor, true);

            BackColor = Color.Transparent;
            ForeColor = Color.White;

            // http://connect.microsoft.com/VisualStudio/feedback/details/348321/bug-in-fillrectangle-using-lineargradientbrush
            backgroundBrush = new LinearGradientBrush(new Rectangle(2, 2, checkBoxSize - 4, checkBoxSize - 3), Color.FromArgb(105, 105, 105), Color.FromArgb(55, 55, 55), LinearGradientMode.Vertical);

            innerBorderBrush = new LinearGradientBrush(new Rectangle(1, 1, checkBoxSize - 2, checkBoxSize - 2), Color.FromArgb(125, 125, 125), Color.FromArgb(65, 75, 75), LinearGradientMode.Vertical);
            innerBorderPen = new Pen(innerBorderBrush);

            backgroundCheckedBrush = new LinearGradientBrush(new Rectangle(2, 2, checkBoxSize - 4, checkBoxSize - 3), Color.Black, Color.Black, LinearGradientMode.Vertical);
            ColorBlend cb = new ColorBlend();
            cb.Positions = new float[] { 0, 0.49f, 0.50f, 1 };
            cb.Colors = new Color[] { Color.FromArgb(102, 163, 226), Color.FromArgb(83, 135, 186), Color.FromArgb(75, 121, 175), Color.FromArgb(56, 93, 135) };
            backgroundCheckedBrush.InterpolationColors = cb;

            innerBorderCheckedBrush = new LinearGradientBrush(new Rectangle(1, 1, checkBoxSize - 2, checkBoxSize - 2), Color.FromArgb(133, 192, 241), Color.FromArgb(76, 119, 163), LinearGradientMode.Vertical);
            innerBorderCheckedPen = new Pen(innerBorderCheckedBrush);

            borderPen = new Pen(Color.FromArgb(30, 30, 30));

            Font = new Font("Arial", 8);
        }

        protected override void OnPaint(PaintEventArgs pe)
        {
            base.OnPaint(pe);

            Graphics g = pe.Graphics;

            DrawBackground(g);

            if (!string.IsNullOrEmpty(Text))
            {
                DrawText(g);
            }
        }

        protected override void OnMouseEnter(EventArgs e)
        {
            base.OnMouseEnter(e);

            isHover = true;
            Invalidate();
        }

        protected override void OnMouseLeave(EventArgs e)
        {
            base.OnMouseLeave(e);

            isHover = false;
            Invalidate();
        }

        protected override void OnClick(EventArgs e)
        {
            base.OnClick(e);

            if (!IgnoreClick)
            {
                Checked = !Checked;
            }
        }

        protected virtual void OnCheckedChanged(EventArgs e)
        {
            CheckedChanged?.Invoke(this, e);
        }

        private void DrawBackground(Graphics g)
        {
            if (Checked)
            {
                g.FillRectangle(backgroundCheckedBrush, new Rectangle(2, 2, checkBoxSize - 4, checkBoxSize - 4));
                g.DrawRectangle(innerBorderCheckedPen, new Rectangle(1, 1, checkBoxSize - 3, checkBoxSize - 3));
            }
            else
            {
                g.FillRectangle(backgroundBrush, new Rectangle(2, 2, checkBoxSize - 4, checkBoxSize - 4));

                if (isHover)
                {
                    g.DrawRectangle(innerBorderCheckedPen, new Rectangle(1, 1, checkBoxSize - 3, checkBoxSize - 3));
                }
                else
                {
                    g.DrawRectangle(innerBorderPen, new Rectangle(1, 1, checkBoxSize - 3, checkBoxSize - 3));
                }
            }

            g.DrawRectangle(borderPen, new Rectangle(0, 0, checkBoxSize - 1, checkBoxSize - 1));
        }

        private void DrawText(Graphics g)
        {
            Rectangle rect = new Rectangle(checkBoxSize + SpaceAfterCheckBox, 0, ClientRectangle.Width - checkBoxSize + SpaceAfterCheckBox, ClientRectangle.Height);
            TextFormatFlags tff = TextFormatFlags.Left | TextFormatFlags.Top | TextFormatFlags.WordBreak;
            TextRenderer.DrawText(g, Text, Font, new Rectangle(rect.X, rect.Y + 1, rect.Width, rect.Height + 1), Color.Black, tff);
            TextRenderer.DrawText(g, Text, Font, rect, ForeColor, tff);
        }

        protected override void Dispose(bool disposing)
        {
            if (backgroundBrush != null) backgroundBrush.Dispose();
            if (backgroundCheckedBrush != null) backgroundCheckedBrush.Dispose();
            if (innerBorderBrush != null) innerBorderBrush.Dispose();
            if (innerBorderPen != null) innerBorderPen.Dispose();
            if (innerBorderCheckedBrush != null) innerBorderCheckedBrush.Dispose();
            if (innerBorderCheckedPen != null) innerBorderCheckedPen.Dispose();
            if (borderPen != null) borderPen.Dispose();

            base.Dispose(disposing);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: BlackStyleLabel.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Controls/BlackStyle/BlackStyleLabel.cs

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
using System.Drawing.Design;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public class BlackStyleLabel : Control
    {
        private string text;

        [Editor("System.ComponentModel.Design.MultilineStringEditor, System.Design, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a", typeof(UITypeEditor))]
        [SettingsBindable(true)]
        public override string Text
        {
            get
            {
                return text;
            }
            set
            {
                if (value == null)
                {
                    value = "";
                }

                if (text != value)
                {
                    text = value;

                    OnTextChanged(EventArgs.Empty);

                    Invalidate();
                }
            }
        }

        private ContentAlignment textAlign;

        [DefaultValue(ContentAlignment.TopLeft)]
        public ContentAlignment TextAlign
        {
            get
            {
                return textAlign;
            }
            set
            {
                textAlign = value;

                Invalidate();
            }
        }

        private Color textShadowColor;

        [DefaultValue(typeof(Color), "Black")]
        public Color TextShadowColor
        {
            get
            {
                return textShadowColor;
            }
            set
            {
                textShadowColor = value;

                Invalidate();
            }
        }

        private bool drawBorder;

        [DefaultValue(false)]
        public bool DrawBorder
        {
            get
            {
                return drawBorder;
            }
            set
            {
                drawBorder = value;

                Invalidate();
            }
        }

        private Color borderColor = Color.Black;

        [DefaultValue(typeof(Color), "Black")]
        public Color BorderColor
        {
            get
            {
                return borderColor;
            }
            set
            {
                borderColor = value;

                Invalidate();
            }
        }

        private bool autoEllipsis;

        [DefaultValue(false)]
        public bool AutoEllipsis
        {
            get
            {
                return autoEllipsis;
            }
            set
            {
                autoEllipsis = value;

                Invalidate();
            }
        }

        public BlackStyleLabel()
        {
            DoubleBuffered = true;
            SetStyle(ControlStyles.UserPaint | ControlStyles.AllPaintingInWmPaint | ControlStyles.ResizeRedraw | ControlStyles.OptimizedDoubleBuffer | ControlStyles.SupportsTransparentBackColor, true);
            TextAlign = ContentAlignment.TopLeft;
            BackColor = Color.Transparent;
            ForeColor = Color.White;
            TextShadowColor = Color.Black;
            Font = new Font("Arial", 12);
        }

        protected override void OnPaint(PaintEventArgs pe)
        {
            Graphics g = pe.Graphics;

            if (!string.IsNullOrEmpty(Text))
            {
                DrawText(g);

                if (drawBorder)
                {
                    using (Pen pen = new Pen(BorderColor, 1))
                    {
                        g.DrawRectangleProper(pen, ClientRectangle);
                    }
                }
            }
        }

        private void DrawText(Graphics g)
        {
            TextFormatFlags tff;

            switch (TextAlign)
            {
                case ContentAlignment.TopLeft:
                    tff = TextFormatFlags.Top | TextFormatFlags.Left;
                    break;
                case ContentAlignment.MiddleLeft:
                    tff = TextFormatFlags.VerticalCenter | TextFormatFlags.Left;
                    break;
                case ContentAlignment.BottomLeft:
                    tff = TextFormatFlags.Bottom | TextFormatFlags.Left;
                    break;
                case ContentAlignment.TopCenter:
                    tff = TextFormatFlags.Top | TextFormatFlags.HorizontalCenter;
                    break;
                default:
                case ContentAlignment.MiddleCenter:
                    tff = TextFormatFlags.VerticalCenter | TextFormatFlags.HorizontalCenter;
                    break;
                case ContentAlignment.BottomCenter:
                    tff = TextFormatFlags.Bottom | TextFormatFlags.HorizontalCenter;
                    break;
                case ContentAlignment.TopRight:
                    tff = TextFormatFlags.Top | TextFormatFlags.Right;
                    break;
                case ContentAlignment.MiddleRight:
                    tff = TextFormatFlags.VerticalCenter | TextFormatFlags.Right;
                    break;
                case ContentAlignment.BottomRight:
                    tff = TextFormatFlags.Bottom | TextFormatFlags.Right;
                    break;
            }

            if (AutoEllipsis)
            {
                tff |= TextFormatFlags.EndEllipsis;
            }

            if (TextShadowColor.A > 0)
            {
                TextRenderer.DrawText(g, Text, Font, ClientRectangle.LocationOffset(0, 1), TextShadowColor, tff);
            }

            TextRenderer.DrawText(g, Text, Font, ClientRectangle, ForeColor, tff);
        }
    }
}
```

--------------------------------------------------------------------------------

````
