---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 314
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 314 of 650)

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

---[FILE: InputManager.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Input/InputManager.cs

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
using System.Collections.Generic;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Text;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public class InputManager
    {
        public List<INPUT> InputList { get; private set; }

        public bool AutoClearAfterSend { get; set; }

        public InputManager()
        {
            InputList = new List<INPUT>();
        }

        public bool SendInputs()
        {
            INPUT[] inputList = InputList.ToArray();
            uint len = (uint)inputList.Length;
            uint successfulInputs = NativeMethods.SendInput(len, inputList, Marshal.SizeOf(typeof(INPUT)));
            if (AutoClearAfterSend) ClearInputs();
            return successfulInputs == len;
        }

        public void ClearInputs()
        {
            InputList.Clear();
        }

        private void AddKeyInput(VirtualKeyCode keyCode, bool isKeyUp)
        {
            INPUT input = new INPUT();
            input.Type = InputType.InputKeyboard;
            input.Data.Keyboard = new KEYBDINPUT();
            input.Data.Keyboard.wVk = keyCode;
            if (isKeyUp) input.Data.Keyboard.dwFlags = KeyboardEventFlags.KEYEVENTF_KEYUP;
            InputList.Add(input);
        }

        public void AddKeyDown(VirtualKeyCode keyCode)
        {
            AddKeyInput(keyCode, false);
        }

        public void AddKeyUp(VirtualKeyCode keyCode)
        {
            AddKeyInput(keyCode, true);
        }

        public void AddKeyPress(VirtualKeyCode keyCode)
        {
            AddKeyInput(keyCode, false);
            AddKeyInput(keyCode, true);
        }

        public void AddKeyPressModifiers(VirtualKeyCode keyCode, params VirtualKeyCode[] modifiers)
        {
            foreach (VirtualKeyCode modifier in modifiers)
            {
                AddKeyDown(modifier);
            }

            AddKeyPress(keyCode);

            foreach (VirtualKeyCode modifier in modifiers)
            {
                AddKeyUp(modifier);
            }
        }

        public void AddKeyPressText(string text)
        {
            byte[] chars = Encoding.ASCII.GetBytes(text);

            for (int i = 0; i < chars.Length; i++)
            {
                ushort scanCode = chars[i];

                INPUT input = new INPUT();
                input.Type = InputType.InputKeyboard;
                input.Data.Keyboard = new KEYBDINPUT();
                input.Data.Keyboard.wScan = scanCode;
                input.Data.Keyboard.dwFlags = KeyboardEventFlags.KEYEVENTF_UNICODE;
                if ((scanCode & 0xFF00) == 0xE000) input.Data.Keyboard.dwFlags |= KeyboardEventFlags.KEYEVENTF_EXTENDEDKEY;
                InputList.Add(input);

                input.Data.Keyboard.dwFlags |= KeyboardEventFlags.KEYEVENTF_KEYUP;
                InputList.Add(input);
            }
        }

        private void AddMouseInput(MouseButtons button, bool isMouseUp)
        {
            INPUT input = new INPUT();
            input.Type = InputType.InputMouse;
            input.Data.Mouse = new MOUSEINPUT();

            if (button == MouseButtons.Left)
            {
                input.Data.Mouse.dwFlags = isMouseUp ? MouseEventFlags.MOUSEEVENTF_LEFTUP : MouseEventFlags.MOUSEEVENTF_LEFTDOWN;
            }
            else if (button == MouseButtons.Right)
            {
                input.Data.Mouse.dwFlags = isMouseUp ? MouseEventFlags.MOUSEEVENTF_RIGHTUP : MouseEventFlags.MOUSEEVENTF_RIGHTDOWN;
            }
            else if (button == MouseButtons.Middle)
            {
                input.Data.Mouse.dwFlags = isMouseUp ? MouseEventFlags.MOUSEEVENTF_MIDDLEUP : MouseEventFlags.MOUSEEVENTF_MIDDLEDOWN;
            }
            else if (button == MouseButtons.XButton1)
            {
                input.Data.Mouse.mouseData = (uint)MouseEventDataXButtons.XBUTTON1;
                input.Data.Mouse.dwFlags = isMouseUp ? MouseEventFlags.MOUSEEVENTF_XUP : MouseEventFlags.MOUSEEVENTF_XDOWN;
            }
            else if (button == MouseButtons.XButton2)
            {
                input.Data.Mouse.mouseData = (uint)MouseEventDataXButtons.XBUTTON2;
                input.Data.Mouse.dwFlags = isMouseUp ? MouseEventFlags.MOUSEEVENTF_XUP : MouseEventFlags.MOUSEEVENTF_XDOWN;
            }

            InputList.Add(input);
        }

        public void AddMouseDown(MouseButtons button = MouseButtons.Left)
        {
            AddMouseInput(button, false);
        }

        public void AddMouseUp(MouseButtons button = MouseButtons.Left)
        {
            AddMouseInput(button, true);
        }

        public void AddMouseClick(MouseButtons button = MouseButtons.Left)
        {
            AddMouseDown(button);
            AddMouseUp(button);
        }

        public void AddMouseClick(int x, int y, MouseButtons button = MouseButtons.Left)
        {
            AddMouseMove(x, y);
            AddMouseClick(button);
        }

        public void AddMouseClick(Point position, MouseButtons button = MouseButtons.Left)
        {
            AddMouseMove(position);
            AddMouseClick(button);
        }

        public void AddMouseMove(int x, int y)
        {
            INPUT input = new INPUT();
            input.Type = InputType.InputMouse;
            input.Data.Mouse = new MOUSEINPUT();
            input.Data.Mouse.dx = (int)Math.Ceiling((double)(x * 65535) / NativeMethods.GetSystemMetrics(SystemMetric.SM_CXSCREEN)) + 1;
            input.Data.Mouse.dy = (int)Math.Ceiling((double)(y * 65535) / NativeMethods.GetSystemMetrics(SystemMetric.SM_CYSCREEN)) + 1;
            input.Data.Mouse.dwFlags = MouseEventFlags.MOUSEEVENTF_MOVE | MouseEventFlags.MOUSEEVENTF_ABSOLUTE;
            InputList.Add(input);
        }

        public void AddMouseMove(Point position)
        {
            AddMouseMove(position.X, position.Y);
        }

        public void AddMouseWheel(int delta)
        {
            INPUT input = new INPUT();
            input.Type = InputType.InputMouse;
            input.Data.Mouse = new MOUSEINPUT();
            input.Data.Mouse.dwFlags = MouseEventFlags.MOUSEEVENTF_WHEEL;
            input.Data.Mouse.mouseData = (uint)delta;
            InputList.Add(input);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: KeyboardHook.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Input/KeyboardHook.cs

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
using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public class KeyboardHook : IDisposable
    {
        public event KeyEventHandler KeyDown, KeyUp;

        private HookProc keyboardHookProc;
        private IntPtr keyboardHookHandle = IntPtr.Zero;

        public KeyboardHook()
        {
            keyboardHookProc = KeyboardHookProc;
            keyboardHookHandle = SetHook(NativeConstants.WH_KEYBOARD_LL, keyboardHookProc);
        }

        ~KeyboardHook()
        {
            Dispose();
        }

        private static IntPtr SetHook(int hookType, HookProc hookProc)
        {
            using (Process currentProcess = Process.GetCurrentProcess())
            using (ProcessModule currentModule = currentProcess.MainModule)
            {
                IntPtr moduleHandle = NativeMethods.GetModuleHandle(currentModule.ModuleName);
                return NativeMethods.SetWindowsHookEx(hookType, hookProc, moduleHandle, 0);
            }
        }

        [MethodImpl(MethodImplOptions.NoInlining)]
        private IntPtr KeyboardHookProc(int nCode, IntPtr wParam, IntPtr lParam)
        {
            if (nCode >= 0)
            {
                bool handled = false;

                switch ((KeyEvent)wParam)
                {
                    case KeyEvent.WM_KEYDOWN:
                    case KeyEvent.WM_SYSKEYDOWN:
                        handled = OnKeyDown(lParam);
                        break;
                    case KeyEvent.WM_KEYUP:
                    case KeyEvent.WM_SYSKEYUP:
                        handled = OnKeyUp(lParam);
                        break;
                }

                if (handled)
                {
                    return keyboardHookHandle;
                }
            }

            return NativeMethods.CallNextHookEx(keyboardHookHandle, nCode, wParam, lParam);
        }

        private bool OnKeyDown(IntPtr key)
        {
            if (KeyDown != null)
            {
                KeyEventArgs keyEventArgs = GetKeyEventArgs(key);
                KeyDown(this, keyEventArgs);
                return keyEventArgs.Handled || keyEventArgs.SuppressKeyPress;
            }

            return false;
        }

        private bool OnKeyUp(IntPtr key)
        {
            if (KeyUp != null)
            {
                KeyEventArgs keyEventArgs = GetKeyEventArgs(key);
                KeyUp(this, keyEventArgs);
                return keyEventArgs.Handled || keyEventArgs.SuppressKeyPress;
            }

            return false;
        }

        private KeyEventArgs GetKeyEventArgs(IntPtr key)
        {
            Keys keyData = (Keys)Marshal.ReadInt32(key) | Control.ModifierKeys;
            return new KeyEventArgs(keyData);
        }

        public void Dispose()
        {
            NativeMethods.UnhookWindowsHookEx(keyboardHookHandle);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CodeMenu.cs]---
Location: ShareX-develop/ShareX.HelpersLib/NameParser/CodeMenu.cs

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

using ShareX.HelpersLib.Properties;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public class CodeMenu : ContextMenuStrip
    {
        public Point MenuLocation
        {
            get
            {
                if (MenuLocationBottom)
                {
                    return new Point(MenuLocationOffset.X, textBoxBase.Height + MenuLocationOffset.Y + 1);
                }

                return new Point(textBoxBase.Width + MenuLocationOffset.X + 1, MenuLocationOffset.Y);
            }
        }

        public Point MenuLocationOffset { get; set; }

        public bool MenuLocationBottom { get; set; }

        private TextBoxBase textBoxBase;

        public CodeMenu(TextBoxBase tbb, CodeMenuItem[] items)
        {
            textBoxBase = tbb;

            Font = new Font("Lucida Console", 8);
            AutoClose = textBoxBase == null;
            ShowImageMargin = false;

            foreach (CodeMenuItem item in items)
            {
                ToolStripMenuItem tsmi = new ToolStripMenuItem { Text = $"{item.Name} - {item.Description}", Tag = item.Name };

                tsmi.MouseUp += (sender, e) =>
                {
                    if (textBoxBase != null && e.Button == MouseButtons.Left)
                    {
                        string text = ((ToolStripMenuItem)sender).Tag.ToString();
                        textBoxBase.AppendTextToSelection(text);
                    }
                    else
                    {
                        Close();
                    }
                };

                if (string.IsNullOrWhiteSpace(item.Category))
                {
                    Items.Add(tsmi);
                }
                else
                {
                    ToolStripMenuItem tsmiParent;
                    int index = Items.IndexOfKey(item.Category);
                    if (index < 0)
                    {
                        tsmiParent = new ToolStripMenuItem { Text = item.Category, Tag = item.Category, Name = item.Category };
                        tsmiParent.HideImageMargin();
                        Items.Add(tsmiParent);
                    }
                    else
                    {
                        tsmiParent = Items[index] as ToolStripMenuItem;
                    }
                    tsmiParent.DropDownItems.Add(tsmi);
                }
            }

            Items.Add(new ToolStripSeparator());

            ToolStripMenuItem tsmiClose = new ToolStripMenuItem(Resources.CodeMenu_Create_Close);
            tsmiClose.Click += (sender, e) => Close();
            Items.Add(tsmiClose);

            ShareXResources.ApplyCustomThemeToContextMenuStrip(this);

            if (textBoxBase != null)
            {
                textBoxBase.MouseDown += (sender, e) =>
                {
                    if (Items.Count > 0) Show(textBoxBase, MenuLocation);
                };

                textBoxBase.GotFocus += (sender, e) =>
                {
                    if (Items.Count > 0) Show(textBoxBase, MenuLocation);
                };

                textBoxBase.LostFocus += (sender, e) =>
                {
                    if (Visible) Close();
                };

                textBoxBase.KeyDown += (sender, e) =>
                {
                    if ((e.KeyCode == Keys.Enter || e.KeyCode == Keys.Escape) && Visible)
                    {
                        Close();
                        e.SuppressKeyPress = true;
                    }
                };

                textBoxBase.Disposed += (sender, e) => Dispose();
            }
        }

        public static CodeMenu Create<TEntry>(TextBoxBase tb, TEntry[] ignoreList, CodeMenuItem[] extraItems) where TEntry : CodeMenuEntry
        {
            List<CodeMenuItem> items = new List<CodeMenuItem>();

            if (extraItems != null)
            {
                items.AddRange(extraItems);
            }

            IEnumerable<CodeMenuItem> codeMenuItems = Helpers.GetValueFields<TEntry>().Where(x => !ignoreList.Contains(x)).
                Select(x => new CodeMenuItem(x.ToPrefixString(), x.Description, x.Category));

            items.AddRange(codeMenuItems);

            return new CodeMenu(tb, items.ToArray());
        }

        public static CodeMenu Create<TEntry>(TextBoxBase tb, params TEntry[] ignoreList) where TEntry : CodeMenuEntry
        {
            return Create(tb, ignoreList, (CodeMenuItem[])null);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CodeMenuEntry.cs]---
Location: ShareX-develop/ShareX.HelpersLib/NameParser/CodeMenuEntry.cs

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

namespace ShareX.HelpersLib
{
    public abstract class CodeMenuEntry
    {
        protected abstract string Prefix { get; }

        public string Value { get; private set; }
        public string Description { get; private set; }
        public string Category { get; private set; }

        public CodeMenuEntry(string value, string description, string category = null)
        {
            Value = value;
            Description = description;
            Category = category;
        }

        public string ToPrefixString()
        {
            return ToPrefixString(Prefix);
        }

        public string ToPrefixString(string prefix)
        {
            return prefix + Value;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CodeMenuEntryActions.cs]---
Location: ShareX-develop/ShareX.HelpersLib/NameParser/CodeMenuEntryActions.cs

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

using ShareX.HelpersLib.Properties;

namespace ShareX.HelpersLib
{
    public class CodeMenuEntryActions : CodeMenuEntry
    {
        protected override string Prefix { get; } = "$";

        public static readonly CodeMenuEntryActions input = new CodeMenuEntryActions("input", Resources.ActionsCodeMenuEntry_FilePath_File_path);
        public static readonly CodeMenuEntryActions output = new CodeMenuEntryActions("output", Resources.ActionsCodeMenuEntry_OutputFilePath_File_path_without_extension____Output_file_name_extension_);

        public CodeMenuEntryActions(string value, string description) : base(value, description)
        {
        }

        public static string Parse(string pattern, string inputPath, string outputPath)
        {
            string result = pattern;

            if (inputPath != null)
            {
                result = result.Replace(input.ToPrefixString("%"), '"' + inputPath + '"');
                result = result.Replace(input.ToPrefixString(), inputPath);
            }

            if (outputPath != null)
            {
                result = result.Replace(output.ToPrefixString("%"), '"' + outputPath + '"');
                result = result.Replace(output.ToPrefixString(), outputPath);
            }

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CodeMenuEntryFilename.cs]---
Location: ShareX-develop/ShareX.HelpersLib/NameParser/CodeMenuEntryFilename.cs

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

using ShareX.HelpersLib.Properties;

namespace ShareX.HelpersLib
{
    public class CodeMenuEntryFilename : CodeMenuEntry
    {
        protected override string Prefix { get; } = "%";

        public static readonly CodeMenuEntryFilename t = new CodeMenuEntryFilename("t", Resources.ReplCodeMenuEntry_t_Title_of_active_window, Resources.ReplCodeMenuCategory_Window);
        public static readonly CodeMenuEntryFilename pn = new CodeMenuEntryFilename("pn", Resources.ReplCodeMenuEntry_pn_Process_name_of_active_window, Resources.ReplCodeMenuCategory_Window);
        public static readonly CodeMenuEntryFilename y = new CodeMenuEntryFilename("y", Resources.ReplCodeMenuEntry_y_Current_year, Resources.ReplCodeMenuCategory_Date_and_Time);
        public static readonly CodeMenuEntryFilename yy = new CodeMenuEntryFilename("yy", Resources.ReplCodeMenuEntry_yy_Current_year__2_digits_, Resources.ReplCodeMenuCategory_Date_and_Time);
        public static readonly CodeMenuEntryFilename mo = new CodeMenuEntryFilename("mo", Resources.ReplCodeMenuEntry_mo_Current_month, Resources.ReplCodeMenuCategory_Date_and_Time);
        public static readonly CodeMenuEntryFilename mon = new CodeMenuEntryFilename("mon", Resources.ReplCodeMenuEntry_mon_Current_month_name__Local_language_, Resources.ReplCodeMenuCategory_Date_and_Time);
        public static readonly CodeMenuEntryFilename mon2 = new CodeMenuEntryFilename("mon2", Resources.ReplCodeMenuEntry_mon2_Current_month_name__English_, Resources.ReplCodeMenuCategory_Date_and_Time);
        public static readonly CodeMenuEntryFilename w = new CodeMenuEntryFilename("w", Resources.ReplCodeMenuEntry_w_Current_week_name__Local_language_, Resources.ReplCodeMenuCategory_Date_and_Time);
        public static readonly CodeMenuEntryFilename w2 = new CodeMenuEntryFilename("w2", Resources.ReplCodeMenuEntry_w2_Current_week_name__English_, Resources.ReplCodeMenuCategory_Date_and_Time);
        public static readonly CodeMenuEntryFilename wy = new CodeMenuEntryFilename("wy", Resources.ReplCodeMenuEntry_wy_Week_of_year, Resources.ReplCodeMenuCategory_Date_and_Time);
        public static readonly CodeMenuEntryFilename d = new CodeMenuEntryFilename("d", Resources.ReplCodeMenuEntry_d_Current_day, Resources.ReplCodeMenuCategory_Date_and_Time);
        public static readonly CodeMenuEntryFilename h = new CodeMenuEntryFilename("h", Resources.ReplCodeMenuEntry_h_Current_hour, Resources.ReplCodeMenuCategory_Date_and_Time);
        public static readonly CodeMenuEntryFilename mi = new CodeMenuEntryFilename("mi", Resources.ReplCodeMenuEntry_mi_Current_minute, Resources.ReplCodeMenuCategory_Date_and_Time);
        public static readonly CodeMenuEntryFilename s = new CodeMenuEntryFilename("s", Resources.ReplCodeMenuEntry_s_Current_second, Resources.ReplCodeMenuCategory_Date_and_Time);
        public static readonly CodeMenuEntryFilename ms = new CodeMenuEntryFilename("ms", Resources.ReplCodeMenuEntry_ms_Current_millisecond, Resources.ReplCodeMenuCategory_Date_and_Time);
        public static readonly CodeMenuEntryFilename pm = new CodeMenuEntryFilename("pm", Resources.ReplCodeMenuEntry_pm_Gets_AM_PM, Resources.ReplCodeMenuCategory_Date_and_Time);
        public static readonly CodeMenuEntryFilename unix = new CodeMenuEntryFilename("unix", Resources.ReplCodeMenuEntry_unix_Unix_timestamp, Resources.ReplCodeMenuCategory_Date_and_Time);
        public static readonly CodeMenuEntryFilename i = new CodeMenuEntryFilename("i", Resources.ReplCodeMenuEntry_i_Auto_increment_number, Resources.ReplCodeMenuCategory_Incremental);
        public static readonly CodeMenuEntryFilename ia = new CodeMenuEntryFilename("ia", Resources.ReplCodeMenuEntry_ia_Auto_increment_alphanumeric, Resources.ReplCodeMenuCategory_Incremental);
        public static readonly CodeMenuEntryFilename iAa = new CodeMenuEntryFilename("iAa", Resources.ReplCodeMenuEntry_iAa_Auto_increment_alphanumeric_all, Resources.ReplCodeMenuCategory_Incremental);
        public static readonly CodeMenuEntryFilename ib = new CodeMenuEntryFilename("ib", Resources.ReplCodeMenuEntry_ib_Auto_increment_base_alphanumeric, Resources.ReplCodeMenuCategory_Incremental);
        public static readonly CodeMenuEntryFilename ix = new CodeMenuEntryFilename("ix", Resources.ReplCodeMenuEntry_ix_Auto_increment_hexadecimal, Resources.ReplCodeMenuCategory_Incremental);
        public static readonly CodeMenuEntryFilename rn = new CodeMenuEntryFilename("rn", Resources.ReplCodeMenuEntry_rn_Random_number_0_to_9, Resources.ReplCodeMenuCategory_Random);
        public static readonly CodeMenuEntryFilename ra = new CodeMenuEntryFilename("ra", Resources.ReplCodeMenuEntry_ra_Random_alphanumeric_char, Resources.ReplCodeMenuCategory_Random);
        public static readonly CodeMenuEntryFilename rna = new CodeMenuEntryFilename("rna", Resources.RandomNonAmbiguousAlphanumericCharRepeatUsingN, Resources.ReplCodeMenuCategory_Random);
        public static readonly CodeMenuEntryFilename rx = new CodeMenuEntryFilename("rx", Resources.ReplCodeMenuEntry_rx_Random_hexadecimal, Resources.ReplCodeMenuCategory_Random);
        public static readonly CodeMenuEntryFilename guid = new CodeMenuEntryFilename("guid", Resources.ReplCodeMenuEntry_guid_Random_guid, Resources.ReplCodeMenuCategory_Random);
        public static readonly CodeMenuEntryFilename radjective = new CodeMenuEntryFilename("radjective", Resources.CodeMenuEntryFilename_RandomAdjective, Resources.ReplCodeMenuCategory_Random);
        public static readonly CodeMenuEntryFilename ranimal = new CodeMenuEntryFilename("ranimal", Resources.CodeMenuEntryFilename_RandomAnimal, Resources.ReplCodeMenuCategory_Random);
        public static readonly CodeMenuEntryFilename remoji = new CodeMenuEntryFilename("remoji", Resources.RandomEmojiRepeatUsingN, Resources.ReplCodeMenuCategory_Random);
        public static readonly CodeMenuEntryFilename rf = new CodeMenuEntryFilename("rf", Resources.ReplCodeMenuEntry_rf_Random_line_from_file, Resources.ReplCodeMenuCategory_Random);
        public static readonly CodeMenuEntryFilename width = new CodeMenuEntryFilename("width", Resources.ReplCodeMenuEntry_width_Gets_image_width, Resources.ReplCodeMenuCategory_Image);
        public static readonly CodeMenuEntryFilename height = new CodeMenuEntryFilename("height", Resources.ReplCodeMenuEntry_height_Gets_image_height, Resources.ReplCodeMenuCategory_Image);
        public static readonly CodeMenuEntryFilename un = new CodeMenuEntryFilename("un", Resources.ReplCodeMenuEntry_un_User_name, Resources.ReplCodeMenuCategory_Computer);
        public static readonly CodeMenuEntryFilename uln = new CodeMenuEntryFilename("uln", Resources.ReplCodeMenuEntry_uln_User_login_name, Resources.ReplCodeMenuCategory_Computer);
        public static readonly CodeMenuEntryFilename cn = new CodeMenuEntryFilename("cn", Resources.ReplCodeMenuEntry_cn_Computer_name, Resources.ReplCodeMenuCategory_Computer);
        public static readonly CodeMenuEntryFilename n = new CodeMenuEntryFilename("n", Resources.ReplCodeMenuEntry_n_New_line);

        public CodeMenuEntryFilename(string value, string description, string category = null) : base(value, description, category)
        {
        }
    }
}
```

--------------------------------------------------------------------------------

````
