---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 312
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 312 of 650)

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

---[FILE: JsonHelpers.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Helpers/JsonHelpers.cs

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
using Newtonsoft.Json.Serialization;
using System.IO;
using System.Text;

namespace ShareX.HelpersLib
{
    public static class JsonHelpers
    {
        public static void Serialize<T>(T obj, TextWriter textWriter, DefaultValueHandling defaultValueHandling = DefaultValueHandling.Include,
            NullValueHandling nullValueHandling = NullValueHandling.Include, ISerializationBinder serializationBinder = null)
        {
            if (textWriter != null)
            {
                using (JsonTextWriter jsonTextWriter = new JsonTextWriter(textWriter))
                {
                    jsonTextWriter.Formatting = Formatting.Indented;

                    JsonSerializer serializer = new JsonSerializer();
                    serializer.ContractResolver = new WritablePropertiesOnlyResolver();
                    serializer.Converters.Add(new StringEnumConverter());
                    serializer.DefaultValueHandling = defaultValueHandling;
                    serializer.NullValueHandling = nullValueHandling;
                    if (serializationBinder != null) serializer.SerializationBinder = serializationBinder;
                    serializer.Serialize(jsonTextWriter, obj);
                }
            }
        }

        public static string SerializeToString<T>(T obj, DefaultValueHandling defaultValueHandling = DefaultValueHandling.Include,
            NullValueHandling nullValueHandling = NullValueHandling.Include, ISerializationBinder serializationBinder = null)
        {
            StringBuilder sb = new StringBuilder();

            using (StringWriter stringWriter = new StringWriter(sb))
            {
                Serialize(obj, stringWriter, defaultValueHandling, nullValueHandling, serializationBinder);
            }

            return sb.ToString();
        }

        public static void SerializeToStream<T>(T obj, Stream stream, DefaultValueHandling defaultValueHandling = DefaultValueHandling.Include,
            NullValueHandling nullValueHandling = NullValueHandling.Include, ISerializationBinder serializationBinder = null)
        {
            if (stream != null)
            {
                using (StreamWriter streamWriter = new StreamWriter(stream))
                {
                    Serialize(obj, streamWriter, defaultValueHandling, nullValueHandling, serializationBinder);
                }
            }
        }

        public static MemoryStream SerializeToMemoryStream<T>(T obj, DefaultValueHandling defaultValueHandling = DefaultValueHandling.Include,
            NullValueHandling nullValueHandling = NullValueHandling.Include, ISerializationBinder serializationBinder = null)
        {
            MemoryStream memoryStream = new MemoryStream();
            SerializeToStream(obj, memoryStream, defaultValueHandling, nullValueHandling, serializationBinder);
            return memoryStream;
        }

        public static void SerializeToFile<T>(T obj, string filePath, DefaultValueHandling defaultValueHandling = DefaultValueHandling.Include,
            NullValueHandling nullValueHandling = NullValueHandling.Include, ISerializationBinder serializationBinder = null)
        {
            if (!string.IsNullOrEmpty(filePath))
            {
                FileHelpers.CreateDirectoryFromFilePath(filePath);

                using (FileStream fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.Read, 4096, FileOptions.WriteThrough))
                {
                    SerializeToStream(obj, fileStream, defaultValueHandling, nullValueHandling, serializationBinder);
                }
            }
        }

        public static T Deserialize<T>(TextReader textReader, ISerializationBinder serializationBinder = null)
        {
            if (textReader != null)
            {
                using (JsonTextReader jsonTextReader = new JsonTextReader(textReader))
                {
                    JsonSerializer serializer = new JsonSerializer();
                    serializer.Converters.Add(new StringEnumConverter());
                    serializer.ObjectCreationHandling = ObjectCreationHandling.Replace;
                    if (serializationBinder != null) serializer.SerializationBinder = serializationBinder;
                    serializer.Error += (sender, e) => e.ErrorContext.Handled = true;
                    return serializer.Deserialize<T>(jsonTextReader);
                }
            }

            return default;
        }

        public static T DeserializeFromString<T>(string json, ISerializationBinder serializationBinder = null)
        {
            if (!string.IsNullOrEmpty(json))
            {
                using (StringReader stringReader = new StringReader(json))
                {
                    return Deserialize<T>(stringReader, serializationBinder);
                }
            }

            return default;
        }

        public static T DeserializeFromStream<T>(Stream stream, ISerializationBinder serializationBinder = null)
        {
            if (stream != null)
            {
                using (StreamReader streamReader = new StreamReader(stream))
                {
                    return Deserialize<T>(streamReader, serializationBinder);
                }
            }

            return default;
        }

        public static T DeserializeFromFile<T>(string filePath, ISerializationBinder serializationBinder = null)
        {
            if (!string.IsNullOrEmpty(filePath) && File.Exists(filePath))
            {
                using (FileStream fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                {
                    if (fileStream.Length > 0)
                    {
                        return DeserializeFromStream<T>(fileStream, serializationBinder);
                    }
                }
            }

            return default;
        }

        public static bool QuickVerifyJsonFile(string filePath)
        {
            try
            {
                if (!string.IsNullOrEmpty(filePath) && File.Exists(filePath))
                {
                    using (FileStream fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                    {
                        if (fileStream.Length > 1 && fileStream.ReadByte() == (byte)'{')
                        {
                            fileStream.Seek(-1, SeekOrigin.End);
                            return fileStream.ReadByte() == (byte)'}';
                        }
                    }
                }
            }
            catch
            {
            }

            return false;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: MathHelpers.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Helpers/MathHelpers.cs

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

namespace ShareX.HelpersLib
{
    public static class MathHelpers
    {
        public const float RadianPI = 57.29578f; // 180.0 / Math.PI
        public const float DegreePI = 0.01745329f; // Math.PI / 180.0
        public const float TwoPI = 6.28319f; // Math.PI * 2

        public static T Min<T>(T num, T min) where T : IComparable<T>
        {
            if (num.CompareTo(min) > 0) return min;
            return num;
        }

        public static T Max<T>(T num, T max) where T : IComparable<T>
        {
            if (num.CompareTo(max) < 0) return max;
            return num;
        }

        public static T Clamp<T>(T num, T min, T max) where T : IComparable<T>
        {
            if (num.CompareTo(min) <= 0) return min;
            if (num.CompareTo(max) >= 0) return max;
            return num;
        }

        public static bool IsBetween<T>(T num, T min, T max) where T : IComparable<T>
        {
            return num.CompareTo(min) >= 0 && num.CompareTo(max) <= 0;
        }

        public static T BetweenOrDefault<T>(T num, T min, T max, T defaultValue = default) where T : IComparable<T>
        {
            if (num.CompareTo(min) >= 0 && num.CompareTo(max) <= 0) return num;
            return defaultValue;
        }

        public static float Remap(float value, float from1, float to1, float from2, float to2)
        {
            return ((value - from1) / (to1 - from1) * (to2 - from2)) + from2;
        }

        public static bool IsEvenNumber(int num)
        {
            return num % 2 == 0;
        }

        public static bool IsOddNumber(int num)
        {
            return num % 2 != 0;
        }

        public static float Lerp(float value1, float value2, float amount)
        {
            return value1 + ((value2 - value1) * amount);
        }

        public static Vector2 Lerp(Vector2 pos1, Vector2 pos2, float amount)
        {
            float x = Lerp(pos1.X, pos2.X, amount);
            float y = Lerp(pos1.Y, pos2.Y, amount);
            return new Vector2(x, y);
        }

        public static float RadianToDegree(float radian)
        {
            return radian * RadianPI;
        }

        public static float DegreeToRadian(float degree)
        {
            return degree * DegreePI;
        }

        public static Vector2 RadianToVector2(float radian)
        {
            return new Vector2((float)Math.Cos(radian), (float)Math.Sin(radian));
        }

        public static Vector2 RadianToVector2(float radian, float length)
        {
            return RadianToVector2(radian) * length;
        }

        public static Vector2 DegreeToVector2(float degree)
        {
            return RadianToVector2(DegreeToRadian(degree));
        }

        public static Vector2 DegreeToVector2(float degree, float length)
        {
            return RadianToVector2(DegreeToRadian(degree), length);
        }

        public static float Vector2ToRadian(Vector2 direction)
        {
            return (float)Math.Atan2(direction.Y, direction.X);
        }

        public static float Vector2ToDegree(Vector2 direction)
        {
            return RadianToDegree(Vector2ToRadian(direction));
        }

        public static float LookAtRadian(Vector2 pos1, Vector2 pos2)
        {
            return (float)Math.Atan2(pos2.Y - pos1.Y, pos2.X - pos1.X);
        }

        public static float LookAtRadian(PointF pos1, PointF pos2)
        {
            return (float)Math.Atan2(pos2.Y - pos1.Y, pos2.X - pos1.X);
        }

        public static Vector2 LookAtVector2(Vector2 pos1, Vector2 pos2)
        {
            return RadianToVector2(LookAtRadian(pos1, pos2));
        }

        public static float LookAtDegree(Vector2 pos1, Vector2 pos2)
        {
            return RadianToDegree(LookAtRadian(pos1, pos2));
        }

        public static float LookAtDegree(PointF pos1, PointF pos2)
        {
            return RadianToDegree(LookAtRadian(pos1, pos2));
        }

        public static float Distance(Vector2 pos1, Vector2 pos2)
        {
            return (float)Math.Sqrt(Math.Pow(pos2.X - pos1.X, 2) + Math.Pow(pos2.Y - pos1.Y, 2));
        }

        public static float Distance(PointF pos1, PointF pos2)
        {
            return (float)Math.Sqrt(Math.Pow(pos2.X - pos1.X, 2) + Math.Pow(pos2.Y - pos1.Y, 2));
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: RegistryHelpers.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Helpers/RegistryHelpers.cs

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

using Microsoft.Win32;
using System;
using System.IO;

namespace ShareX.HelpersLib
{
    public static class RegistryHelpers
    {
        public static void CreateRegistry(string path, string value, RegistryHive root = RegistryHive.CurrentUser)
        {
            CreateRegistry(path, null, value, root);
        }

        public static void CreateRegistry(string path, string name, string value, RegistryHive root = RegistryHive.CurrentUser)
        {
            using (RegistryKey rk = RegistryKey.OpenBaseKey(root, RegistryView.Default).CreateSubKey(path))
            {
                if (rk != null)
                {
                    rk.SetValue(name, value, RegistryValueKind.String);
                }
            }
        }

        public static void CreateRegistry(string path, int value, RegistryHive root = RegistryHive.CurrentUser)
        {
            CreateRegistry(path, null, value, root);
        }

        public static void CreateRegistry(string path, string name, int value, RegistryHive root = RegistryHive.CurrentUser)
        {
            using (RegistryKey rk = RegistryKey.OpenBaseKey(root, RegistryView.Default).CreateSubKey(path))
            {
                if (rk != null)
                {
                    rk.SetValue(name, value, RegistryValueKind.DWord);
                }
            }
        }

        public static void RemoveRegistry(string path, RegistryHive root = RegistryHive.CurrentUser)
        {
            if (!string.IsNullOrEmpty(path))
            {
                using (RegistryKey rk = RegistryKey.OpenBaseKey(root, RegistryView.Default))
                {
                    rk.DeleteSubKeyTree(path, false);
                }
            }
        }

        public static object GetValue(string path, string name = null, RegistryHive root = RegistryHive.CurrentUser, RegistryView view = RegistryView.Default)
        {
            try
            {
                using (RegistryKey baseKey = RegistryKey.OpenBaseKey(root, view))
                using (RegistryKey rk = baseKey.OpenSubKey(path))
                {
                    if (rk != null)
                    {
                        return rk.GetValue(name);
                    }
                }
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
            }

            return null;
        }

        public static string GetValueString(string path, string name = null, RegistryHive root = RegistryHive.CurrentUser, RegistryView view = RegistryView.Default)
        {
            return GetValue(path, name, root, view) as string;
        }

        public static int? GetValueDWord(string path, string name = null, RegistryHive root = RegistryHive.CurrentUser, RegistryView view = RegistryView.Default)
        {
            return (int?)GetValue(path, name, root, view);
        }

        public static bool CheckStringValue(string path, string name = null, string value = null, RegistryHive root = RegistryHive.CurrentUser, RegistryView view = RegistryView.Default)
        {
            string registryValue = GetValueString(path, name, root, view);

            return registryValue != null && (value == null || registryValue.Equals(value, StringComparison.OrdinalIgnoreCase));
        }

        public static string SearchProgramPath(string fileName)
        {
            // First method: HKEY_CLASSES_ROOT\Applications\{fileName}\shell\{command}\command

            string[] commands = new string[] { "open", "edit" };

            foreach (string command in commands)
            {
                string path = $@"HKEY_CLASSES_ROOT\Applications\{fileName}\shell\{command}\command";
                string value = Registry.GetValue(path, null, null) as string;

                if (!string.IsNullOrEmpty(value))
                {
                    string filePath = value.ParseQuoteString();

                    if (File.Exists(filePath))
                    {
                        DebugHelper.WriteLine("Found program with first method: " + filePath);
                        return filePath;
                    }
                }
            }

            // Second method: HKEY_CURRENT_USER\Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\MuiCache

            using (RegistryKey programs = Registry.CurrentUser.OpenSubKey(@"Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\MuiCache"))
            {
                if (programs != null)
                {
                    foreach (string filePath in programs.GetValueNames())
                    {
                        string programPath = filePath;

                        if (!string.IsNullOrEmpty(programPath))
                        {
                            foreach (string trim in new string[] { ".ApplicationCompany", ".FriendlyAppName" })
                            {
                                if (programPath.EndsWith(trim, StringComparison.OrdinalIgnoreCase))
                                {
                                    programPath = programPath.Remove(programPath.Length - trim.Length);
                                }
                            }

                            if (programPath.EndsWith(fileName, StringComparison.OrdinalIgnoreCase) && File.Exists(programPath))
                            {
                                DebugHelper.WriteLine("Found program with second method: " + programPath);
                                return programPath;
                            }
                        }
                    }
                }
            }

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ShortcutHelpers.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Helpers/ShortcutHelpers.cs

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
using System.IO;
using File = System.IO.File;

namespace ShareX.HelpersLib
{
    public static class ShortcutHelpers
    {
        public static bool SetShortcut(bool create, Environment.SpecialFolder specialFolder, string shortcutName, string targetPath, string arguments = "")
        {
            string shortcutPath = GetShortcutPath(specialFolder, shortcutName);
            return SetShortcut(create, shortcutPath, targetPath, arguments);
        }

        public static bool SetShortcut(bool create, string shortcutPath, string targetPath, string arguments = "")
        {
            try
            {
                if (create)
                {
                    return CreateShortcut(shortcutPath, targetPath, arguments);
                }
                else
                {
                    return DeleteShortcut(shortcutPath);
                }
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
                e.ShowError();
            }

            return false;
        }

        public static bool CheckShortcut(Environment.SpecialFolder specialFolder, string shortcutName, string targetPath)
        {
            string shortcutPath = GetShortcutPath(specialFolder, shortcutName);
            return CheckShortcut(shortcutPath, targetPath);
        }

        public static bool CheckShortcut(string shortcutPath, string targetPath)
        {
            if (!string.IsNullOrEmpty(shortcutPath) && !string.IsNullOrEmpty(targetPath) && File.Exists(shortcutPath))
            {
                try
                {
                    string shortcutTargetPath = GetShortcutTargetPath(shortcutPath);
                    return !string.IsNullOrEmpty(shortcutTargetPath) && shortcutTargetPath.Equals(targetPath, StringComparison.OrdinalIgnoreCase);
                }
                catch (Exception e)
                {
                    DebugHelper.WriteException(e);
                }
            }

            return false;
        }

        private static string GetShortcutPath(Environment.SpecialFolder specialFolder, string shortcutName)
        {
            string folderPath = Environment.GetFolderPath(specialFolder);

            if (!shortcutName.EndsWith(".lnk", StringComparison.OrdinalIgnoreCase))
            {
                shortcutName += ".lnk";
            }

            return Path.Combine(folderPath, shortcutName);
        }

        private static bool CreateShortcut(string shortcutPath, string targetPath, string arguments = "")
        {
            if (!string.IsNullOrEmpty(shortcutPath) && !string.IsNullOrEmpty(targetPath) && File.Exists(targetPath))
            {
                DeleteShortcut(shortcutPath);

                WshShell shell = new WshShell();
                IWshShortcut shortcut = ((IWshShell)shell).CreateShortcut(shortcutPath);
                shortcut.TargetPath = targetPath;
                shortcut.Arguments = arguments;
                shortcut.WorkingDirectory = Path.GetDirectoryName(targetPath);
                shortcut.Save();

                return true;
            }

            return false;
        }

        private static string GetShortcutTargetPath(string shortcutPath)
        {
            WshShell shell = new WshShell();
            IWshShortcut shortcut = ((IWshShell)shell).CreateShortcut(shortcutPath);
            return shortcut.TargetPath;
        }

        private static bool DeleteShortcut(string shortcutPath)
        {
            if (!string.IsNullOrEmpty(shortcutPath) && File.Exists(shortcutPath))
            {
                File.Delete(shortcutPath);
                return true;
            }

            return false;
        }
    }
}
```

--------------------------------------------------------------------------------

````
