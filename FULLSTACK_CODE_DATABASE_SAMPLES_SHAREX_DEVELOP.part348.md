---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 348
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 348 of 650)

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

---[FILE: SettingsBase.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Settings/SettingsBase.cs

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

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShareX.HelpersLib
{
    public abstract class SettingsBase<T> where T : SettingsBase<T>, new()
    {
        public delegate void SettingsSavedEventHandler(T settings, string filePath, bool result);
        public event SettingsSavedEventHandler SettingsSaved;

        public delegate void SettingsSaveFailedEventHandler(Exception e);
        public event SettingsSaveFailedEventHandler SettingsSaveFailed;

        [Browsable(false), JsonIgnore]
        public string FilePath { get; private set; }

        [Browsable(false)]
        public string ApplicationVersion { get; set; }

        [Browsable(false), JsonIgnore]
        public bool IsFirstTimeRun { get; private set; }

        [Browsable(false), JsonIgnore]
        public bool IsUpgrade { get; private set; }

        [Browsable(false), JsonIgnore]
        public string BackupFolder { get; set; }

        [Browsable(false), JsonIgnore]
        public bool CreateBackup { get; set; }

        [Browsable(false), JsonIgnore]
        public bool CreateWeeklyBackup { get; set; }

        [Browsable(false), JsonIgnore]
        public bool SupportDPAPIEncryption { get; set; }

        public bool IsUpgradeFrom(string version)
        {
            return IsUpgrade && Helpers.CompareVersion(ApplicationVersion, version) <= 0;
        }

        protected virtual void OnSettingsSaved(string filePath, bool result)
        {
            SettingsSaved?.Invoke((T)this, filePath, result);
        }

        protected virtual void OnSettingsSaveFailed(Exception e)
        {
            SettingsSaveFailed?.Invoke(e);
        }

        public bool Save(string filePath)
        {
            FilePath = filePath;
            ApplicationVersion = Helpers.GetApplicationVersion();

            bool result = SaveInternal(FilePath);

            OnSettingsSaved(FilePath, result);

            return result;
        }

        public bool Save()
        {
            return Save(FilePath);
        }

        public void SaveAsync(string filePath)
        {
            Task.Run(() => Save(filePath));
        }

        public void SaveAsync()
        {
            SaveAsync(FilePath);
        }

        public MemoryStream SaveToMemoryStream(bool supportDPAPIEncryption = false)
        {
            ApplicationVersion = Helpers.GetApplicationVersion();

            MemoryStream ms = new MemoryStream();
            SaveToStream(ms, supportDPAPIEncryption, true);
            return ms;
        }

        private bool SaveInternal(string filePath)
        {
            string typeName = GetType().Name;
            DebugHelper.WriteLine($"{typeName} save started: {filePath}");

            bool isSuccess = false;

            try
            {
                if (!string.IsNullOrEmpty(filePath))
                {
                    lock (this)
                    {
                        FileHelpers.CreateDirectoryFromFilePath(filePath);

                        string tempFilePath = filePath + ".temp";

                        using (FileStream fileStream = new FileStream(tempFilePath, FileMode.Create, FileAccess.Write, FileShare.Read, 4096, FileOptions.WriteThrough))
                        {
                            SaveToStream(fileStream, SupportDPAPIEncryption);
                        }

                        if (!JsonHelpers.QuickVerifyJsonFile(tempFilePath))
                        {
                            throw new Exception($"{typeName} file is corrupt: {tempFilePath}");
                        }

                        if (File.Exists(filePath))
                        {
                            string backupFilePath = null;

                            if (CreateBackup)
                            {
                                string fileName = Path.GetFileName(filePath);
                                backupFilePath = Path.Combine(BackupFolder, fileName);
                                FileHelpers.CreateDirectory(BackupFolder);
                            }

                            File.Replace(tempFilePath, filePath, backupFilePath, true);
                        }
                        else
                        {
                            File.Move(tempFilePath, filePath);
                        }

                        if (CreateWeeklyBackup && !string.IsNullOrEmpty(BackupFolder))
                        {
                            FileHelpers.BackupFileWeekly(filePath, BackupFolder);
                        }

                        isSuccess = true;
                    }
                }
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);

                OnSettingsSaveFailed(e);
            }
            finally
            {
                string status = isSuccess ? "successful" : "failed";
                DebugHelper.WriteLine($"{typeName} save {status}: {filePath}");
            }

            return isSuccess;
        }

        private void SaveToStream(Stream stream, bool supportDPAPIEncryption = false, bool leaveOpen = false)
        {
            using (StreamWriter streamWriter = new StreamWriter(stream, new UTF8Encoding(false, true), 1024, leaveOpen))
            using (JsonTextWriter jsonWriter = new JsonTextWriter(streamWriter))
            {
                JsonSerializer serializer = new JsonSerializer();

                if (supportDPAPIEncryption)
                {
                    serializer.ContractResolver = new DPAPIEncryptedStringPropertyResolver();
                }
                else
                {
                    serializer.ContractResolver = new WritablePropertiesOnlyResolver();
                }

                serializer.Converters.Add(new StringEnumConverter());
                serializer.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
                serializer.Formatting = Formatting.Indented;
                serializer.Serialize(jsonWriter, this);
                jsonWriter.Flush();
            }
        }

        public static T Load(string filePath, string backupFolder = null, bool fallbackSupport = true)
        {
            List<string> fallbackFilePaths = new List<string>();

            if (fallbackSupport && !string.IsNullOrEmpty(filePath))
            {
                string tempFilePath = filePath + ".temp";
                fallbackFilePaths.Add(tempFilePath);

                if (!string.IsNullOrEmpty(backupFolder) && Directory.Exists(backupFolder))
                {
                    string fileName = Path.GetFileName(filePath);
                    string backupFilePath = Path.Combine(backupFolder, fileName);
                    fallbackFilePaths.Add(backupFilePath);

                    string fileNameNoExt = Path.GetFileNameWithoutExtension(fileName);
                    string lastWeeklyBackupFilePath = Directory.GetFiles(backupFolder, fileNameNoExt + "-*").OrderBy(x => x).LastOrDefault();
                    if (!string.IsNullOrEmpty(lastWeeklyBackupFilePath))
                    {
                        fallbackFilePaths.Add(lastWeeklyBackupFilePath);
                    }
                }
            }

            T setting = LoadInternal(filePath, fallbackFilePaths);

            if (setting != null)
            {
                setting.FilePath = filePath;
                setting.IsFirstTimeRun = string.IsNullOrEmpty(setting.ApplicationVersion);
                setting.IsUpgrade = !setting.IsFirstTimeRun && Helpers.CompareApplicationVersion(setting.ApplicationVersion) < 0;
                setting.BackupFolder = backupFolder;
            }

            return setting;
        }

        private static T LoadInternal(string filePath, List<string> fallbackFilePaths = null)
        {
            string typeName = typeof(T).Name;

            if (!string.IsNullOrEmpty(filePath) && File.Exists(filePath))
            {
                DebugHelper.WriteLine($"{typeName} load started: {filePath}");

                try
                {
                    using (FileStream fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                    {
                        if (fileStream.Length > 0)
                        {
                            T settings;

                            using (StreamReader streamReader = new StreamReader(fileStream))
                            using (JsonTextReader jsonReader = new JsonTextReader(streamReader))
                            {
                                JsonSerializer serializer = new JsonSerializer();
                                serializer.ContractResolver = new DPAPIEncryptedStringPropertyResolver();
                                serializer.Converters.Add(new StringEnumConverter());
                                serializer.DateTimeZoneHandling = DateTimeZoneHandling.Local;
                                serializer.ObjectCreationHandling = ObjectCreationHandling.Replace;
                                serializer.Error += Serializer_Error;
                                settings = serializer.Deserialize<T>(jsonReader);
                            }

                            if (settings == null)
                            {
                                throw new Exception($"{typeName} object is null.");
                            }

                            DebugHelper.WriteLine($"{typeName} load finished: {filePath}");

                            return settings;
                        }
                        else
                        {
                            throw new Exception($"{typeName} file stream length is 0.");
                        }
                    }
                }
                catch (Exception e)
                {
                    DebugHelper.WriteException(e, $"{typeName} load failed: {filePath}");
                }
            }
            else
            {
                DebugHelper.WriteLine($"{typeName} file does not exist: {filePath}");
            }

            if (fallbackFilePaths != null && fallbackFilePaths.Count > 0)
            {
                filePath = fallbackFilePaths[0];
                fallbackFilePaths.RemoveAt(0);
                return LoadInternal(filePath, fallbackFilePaths);
            }

            DebugHelper.WriteLine($"Loading new {typeName} instance.");

            return new T();
        }

        private static void Serializer_Error(object sender, Newtonsoft.Json.Serialization.ErrorEventArgs e)
        {
            // Handle missing enum values
            if (e.ErrorContext.Error.Message.StartsWith("Error converting value"))
            {
                e.ErrorContext.Handled = true;
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: WritablePropertiesOnlyResolver.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Settings/WritablePropertiesOnlyResolver.cs

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

using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ShareX.HelpersLib
{
    public class WritablePropertiesOnlyResolver : DefaultContractResolver
    {
        protected override IList<JsonProperty> CreateProperties(Type type, MemberSerialization memberSerialization)
        {
            IList<JsonProperty> props = base.CreateProperties(type, memberSerialization);
            return props.Where(p => p.Writable).ToList();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CssFileNameEditor.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UITypeEditors/CssFileNameEditor.cs

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
using System;
using System.ComponentModel;
using System.Windows.Forms;
using System.Windows.Forms.Design;

namespace ShareX.HelpersLib
{
    public class CssFileNameEditor : FileNameEditor
    {
        public override object EditValue(ITypeDescriptorContext context, IServiceProvider provider, object value)
        {
            if (context == null || provider == null)
            {
                return base.EditValue(context, provider, value);
            }
            using (OpenFileDialog dlg = new OpenFileDialog())
            {
                dlg.FileName = "Default.css";
                dlg.Title = Resources.CssFileNameEditor_EditValue_Browse_for_a_Cascading_Style_Sheet___;
                dlg.Filter = "Cascading Style Sheets (*.css)|*.css";
                if (dlg.ShowDialog() == DialogResult.OK)
                {
                    value = dlg.FileName;
                }
            }
            return value;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: DirectoryNameEditor.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UITypeEditors/DirectoryNameEditor.cs

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
using System;
using System.ComponentModel;
using System.Windows.Forms.Design;

namespace ShareX.HelpersLib
{
    public class DirectoryNameEditor : FileNameEditor
    {
        public override object EditValue(ITypeDescriptorContext context, IServiceProvider provider, object value)
        {
            if (context == null || provider == null)
            {
                return base.EditValue(context, provider, value);
            }

            string selectedPath = FileHelpers.BrowseFolder(Resources.DirectoryNameEditor_EditValue_Browse_for_a_folder___);

            if (!string.IsNullOrEmpty(selectedPath))
            {
                value = FileHelpers.GetVariableFolderPath(selectedPath, true);
            }

            return value;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: EnumDescriptionConverter.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UITypeEditors/EnumDescriptionConverter.cs

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
using System.Globalization;
using System.Linq;

namespace ShareX.HelpersLib
{
    public class EnumDescriptionConverter : EnumConverter
    {
        private Type enumType;

        public EnumDescriptionConverter(Type type) : base(type)
        {
            enumType = type;
        }

        public override bool CanConvertTo(ITypeDescriptorContext context, Type destType)
        {
            return destType == typeof(string);
        }

        public override object ConvertTo(ITypeDescriptorContext context, CultureInfo culture, object value, Type destType)
        {
            return ((Enum)value).GetLocalizedDescription();
        }

        public override bool CanConvertFrom(ITypeDescriptorContext context, Type srcType)
        {
            return srcType == typeof(string);
        }

        public override object ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, object value)
        {
            foreach (Enum e in Enum.GetValues(enumType).OfType<Enum>())
            {
                if (e.GetLocalizedDescription() == (string)value)
                {
                    return e;
                }
            }

            return Enum.Parse(enumType, (string)value);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: EnumProperNameConverter.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UITypeEditors/EnumProperNameConverter.cs

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
using System.Globalization;
using System.Linq;

namespace ShareX.HelpersLib
{
    public class EnumProperNameConverter : EnumConverter
    {
        private Type enumType;

        public EnumProperNameConverter(Type type) : base(type)
        {
            enumType = type;
        }

        public override bool CanConvertTo(ITypeDescriptorContext context, Type destType)
        {
            return destType == typeof(string);
        }

        public override object ConvertTo(ITypeDescriptorContext context, CultureInfo culture, object value, Type destType)
        {
            return Helpers.GetProperName(value.ToString());
        }

        public override bool CanConvertFrom(ITypeDescriptorContext context, Type srcType)
        {
            return srcType == typeof(string);
        }

        public override object ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, object value)
        {
            foreach (Enum e in Enum.GetValues(enumType).OfType<Enum>())
            {
                if (Helpers.GetProperName(e.ToString()) == (string)value)
                {
                    return e;
                }
            }

            return Enum.Parse(enumType, (string)value);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: EnumProperNameKeepCaseConverter.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UITypeEditors/EnumProperNameKeepCaseConverter.cs

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
using System.Globalization;
using System.Linq;

namespace ShareX.HelpersLib
{
    public class EnumProperNameKeepCaseConverter : EnumConverter
    {
        private Type enumType;

        public EnumProperNameKeepCaseConverter(Type type) : base(type)
        {
            enumType = type;
        }

        public override bool CanConvertTo(ITypeDescriptorContext context, Type destType)
        {
            return destType == typeof(string);
        }

        public override object ConvertTo(ITypeDescriptorContext context, CultureInfo culture, object value, Type destType)
        {
            return Helpers.GetProperName(value.ToString(), true);
        }

        public override bool CanConvertFrom(ITypeDescriptorContext context, Type srcType)
        {
            return srcType == typeof(string);
        }

        public override object ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, object value)
        {
            foreach (Enum e in Enum.GetValues(enumType).OfType<Enum>())
            {
                if (Helpers.GetProperName(e.ToString(), true) == (string)value)
                {
                    return e;
                }
            }

            return Enum.Parse(enumType, (string)value);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ExeFileNameEditor.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UITypeEditors/ExeFileNameEditor.cs

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
using System;
using System.ComponentModel;
using System.Windows.Forms;
using System.Windows.Forms.Design;

namespace ShareX.HelpersLib
{
    public class ExeFileNameEditor : FileNameEditor
    {
        public override object EditValue(ITypeDescriptorContext context, IServiceProvider provider, object value)
        {
            if (context == null || provider == null)
            {
                return base.EditValue(context, provider, value);
            }
            using (OpenFileDialog dlg = new OpenFileDialog())
            {
                dlg.Title = Resources.ExeFileNameEditor_EditValue_Browse_for_executable___;
                dlg.Filter = "Applications (*.exe)|*.exe";
                if (dlg.ShowDialog() == DialogResult.OK)
                {
                    value = dlg.FileName;
                }
            }
            return value;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: GradientEditor.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UITypeEditors/GradientEditor.cs

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
using System.Windows.Forms.Design;

namespace ShareX.HelpersLib
{
    public class GradientEditor : UITypeEditor
    {
        public override UITypeEditorEditStyle GetEditStyle(ITypeDescriptorContext context)
        {
            return UITypeEditorEditStyle.Modal;
        }

        public override object EditValue(ITypeDescriptorContext context, IServiceProvider provider, object value)
        {
            if (value.GetType() != typeof(GradientInfo))
            {
                return value;
            }

            IWindowsFormsEditorService svc = (IWindowsFormsEditorService)provider.GetService(typeof(IWindowsFormsEditorService));

            if (svc != null)
            {
                GradientInfo gradient = (GradientInfo)value;

                using (GradientPickerForm form = new GradientPickerForm(gradient.Copy()))
                {
                    if (svc.ShowDialog(form) == DialogResult.OK)
                    {
                        return form.Gradient;
                    }
                }
            }

            return value;
        }

        public override bool GetPaintValueSupported(ITypeDescriptorContext context)
        {
            return true;
        }

        public override void PaintValue(PaintValueEventArgs e)
        {
            Graphics g = e.Graphics;
            GradientInfo gradient = (GradientInfo)e.Value;
            if (gradient != null)
            {
                gradient.Draw(g, e.Bounds);
            }
            g.DrawRectangleProper(Pens.Black, e.Bounds);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ImageFileNameEditor.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UITypeEditors/ImageFileNameEditor.cs

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
using System.IO;
using System.Windows.Forms.Design;

namespace ShareX.HelpersLib
{
    public class ImageFileNameEditor : FileNameEditor
    {
        public override object EditValue(ITypeDescriptorContext context, IServiceProvider provider, object value)
        {
            if (context == null || provider == null)
            {
                return base.EditValue(context, provider, value);
            }

            string filePath = value as string;
            string initialDirectory = null;

            if (!string.IsNullOrEmpty(filePath))
            {
                filePath = FileHelpers.ExpandFolderVariables(filePath, true);
                string directoryPath = Path.GetDirectoryName(filePath);

                if (!string.IsNullOrEmpty(directoryPath) && Directory.Exists(directoryPath))
                {
                    initialDirectory = directoryPath;
                }
            }

            filePath = ImageHelpers.OpenImageFileDialog(null, initialDirectory);

            if (!string.IsNullOrEmpty(filePath))
            {
                value = FileHelpers.GetVariableFolderPath(filePath, true);
            }

            return value;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: JsonFileNameEditor.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UITypeEditors/JsonFileNameEditor.cs

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
using System.Windows.Forms.Design;

namespace ShareX.HelpersLib
{
    public class JsonFileNameEditor : FileNameEditor
    {
        public override object EditValue(ITypeDescriptorContext context, IServiceProvider provider, object value)
        {
            if (context == null || provider == null)
            {
                return base.EditValue(context, provider, value);
            }
            using (OpenFileDialog dlg = new OpenFileDialog())
            {
                dlg.Filter = "JavaScript Object Notation files (*.json)|*.json";
                if (dlg.ShowDialog() == DialogResult.OK)
                {
                    value = dlg.FileName;
                }
            }
            return value;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: MyColorConverter.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UITypeEditors/MyColorConverter.cs

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

namespace ShareX.HelpersLib
{
    public class MyColorConverter : ColorConverter
    {
        public override bool GetStandardValuesSupported(ITypeDescriptorContext context)
        {
            return false;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: MyColorEditor.cs]---
Location: ShareX-develop/ShareX.HelpersLib/UITypeEditors/MyColorEditor.cs

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
using System.Windows.Forms.Design;

namespace ShareX.HelpersLib
{
    public class MyColorEditor : UITypeEditor
    {
        public override UITypeEditorEditStyle GetEditStyle(ITypeDescriptorContext context)
        {
            return UITypeEditorEditStyle.Modal;
        }

        public override object EditValue(ITypeDescriptorContext context, IServiceProvider provider, object value)
        {
            if (value.GetType() != typeof(Color))
            {
                return value;
            }

            IWindowsFormsEditorService svc = (IWindowsFormsEditorService)provider.GetService(typeof(IWindowsFormsEditorService));

            if (svc != null)
            {
                Color color = (Color)value;

                using (ColorPickerForm form = new ColorPickerForm(color))
                {
                    if (svc.ShowDialog(form) == DialogResult.OK)
                    {
                        return (Color)form.NewColor;
                    }
                }
            }

            return value;
        }

        public override bool GetPaintValueSupported(ITypeDescriptorContext context)
        {
            return true;
        }

        public override void PaintValue(PaintValueEventArgs e)
        {
            Graphics g = e.Graphics;
            Color color = (Color)e.Value;
            ImageHelpers.DrawColorPickerIcon(g, color, e.Bounds);
        }
    }
}
```

--------------------------------------------------------------------------------

````
