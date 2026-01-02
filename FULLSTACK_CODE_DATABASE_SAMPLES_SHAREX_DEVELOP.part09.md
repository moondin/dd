---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:46Z
part: 9
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 9 of 650)

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

---[FILE: IntegrationHelpers.cs]---
Location: ShareX-develop/ShareX/IntegrationHelpers.cs

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
using System.IO;
using System.Windows.Forms;

namespace ShareX
{
    public static class IntegrationHelpers
    {
        private static readonly string ApplicationPath = $"\"{Application.ExecutablePath}\"";
        private static readonly string FileIconPath = $"\"{FileHelpers.GetAbsolutePath("ShareX_File_Icon.ico")}\"";

        private static readonly string ShellExtMenuName = "ShareX";
        private static readonly string ShellExtMenuFiles = $@"Software\Classes\*\shell\{ShellExtMenuName}";
        private static readonly string ShellExtMenuFilesCmd = $@"{ShellExtMenuFiles}\command";
        private static readonly string ShellExtMenuDirectory = $@"Software\Classes\Directory\shell\{ShellExtMenuName}";
        private static readonly string ShellExtMenuDirectoryCmd = $@"{ShellExtMenuDirectory}\command";
        private static readonly string ShellExtDesc = Resources.IntegrationHelpers_UploadWithShareX;
        private static readonly string ShellExtIcon = $"{ApplicationPath},0";
        private static readonly string ShellExtPath = $"{ApplicationPath} \"%1\"";

        private static readonly string ShellExtEditName = "ShareXImageEditor";
        private static readonly string ShellExtEditImage = $@"Software\Classes\SystemFileAssociations\image\shell\{ShellExtEditName}";
        private static readonly string ShellExtEditImageCmd = $@"{ShellExtEditImage}\command";
        private static readonly string ShellExtEditDesc = Resources.IntegrationHelpers_EditWithShareX;
        private static readonly string ShellExtEditIcon = $"{ApplicationPath},0";
        private static readonly string ShellExtEditPath = $"{ApplicationPath} -ImageEditor \"%1\"";

        private static readonly string ShellCustomUploaderExtensionPath = @"Software\Classes\.sxcu";
        private static readonly string ShellCustomUploaderExtensionValue = "ShareX.sxcu";
        private static readonly string ShellCustomUploaderAssociatePath = $@"Software\Classes\{ShellCustomUploaderExtensionValue}";
        private static readonly string ShellCustomUploaderAssociateValue = "ShareX custom uploader";
        private static readonly string ShellCustomUploaderIconPath = $@"{ShellCustomUploaderAssociatePath}\DefaultIcon";
        private static readonly string ShellCustomUploaderIconValue = $"{FileIconPath}";
        private static readonly string ShellCustomUploaderCommandPath = $@"{ShellCustomUploaderAssociatePath}\shell\open\command";
        private static readonly string ShellCustomUploaderCommandValue = $"{ApplicationPath} -CustomUploader \"%1\"";

        private static readonly string ShellImageEffectExtensionPath = @"Software\Classes\.sxie";
        private static readonly string ShellImageEffectExtensionValue = "ShareX.sxie";
        private static readonly string ShellImageEffectAssociatePath = $@"Software\Classes\{ShellImageEffectExtensionValue}";
        private static readonly string ShellImageEffectAssociateValue = "ShareX image effect";
        private static readonly string ShellImageEffectIconPath = $@"{ShellImageEffectAssociatePath}\DefaultIcon";
        private static readonly string ShellImageEffectIconValue = $"{FileIconPath}";
        private static readonly string ShellImageEffectCommandPath = $@"{ShellImageEffectAssociatePath}\shell\open\command";
        private static readonly string ShellImageEffectCommandValue = $"{ApplicationPath} -ImageEffect \"%1\"";

        private static readonly string ChromeNativeMessagingHosts = @"SOFTWARE\Google\Chrome\NativeMessagingHosts\com.getsharex.sharex";
        private static readonly string FirefoxNativeMessagingHosts = @"SOFTWARE\Mozilla\NativeMessagingHosts\ShareX";
        private static readonly string ChromeHostManifestFilePath = FileHelpers.GetAbsolutePath("host-manifest-chrome.json");
        private static readonly string FirefoxHostManifestFilePath = FileHelpers.GetAbsolutePath("host-manifest-firefox.json");

        public static bool CheckShellContextMenuButton()
        {
            try
            {
                return RegistryHelpers.CheckStringValue(ShellExtMenuFilesCmd, null, ShellExtPath) &&
                    RegistryHelpers.CheckStringValue(ShellExtMenuDirectoryCmd, null, ShellExtPath);
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
            }

            return false;
        }

        public static void CreateShellContextMenuButton(bool create)
        {
            try
            {
                if (create)
                {
                    UnregisterShellContextMenuButton();
                    RegisterShellContextMenuButton();
                }
                else
                {
                    UnregisterShellContextMenuButton();
                }
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
            }
        }

        private static void RegisterShellContextMenuButton()
        {
            RegistryHelpers.CreateRegistry(ShellExtMenuFiles, ShellExtDesc);
            RegistryHelpers.CreateRegistry(ShellExtMenuFiles, "Icon", ShellExtIcon);
            RegistryHelpers.CreateRegistry(ShellExtMenuFilesCmd, ShellExtPath);

            RegistryHelpers.CreateRegistry(ShellExtMenuDirectory, ShellExtDesc);
            RegistryHelpers.CreateRegistry(ShellExtMenuDirectory, "Icon", ShellExtIcon);
            RegistryHelpers.CreateRegistry(ShellExtMenuDirectoryCmd, ShellExtPath);
        }

        private static void UnregisterShellContextMenuButton()
        {
            RegistryHelpers.RemoveRegistry(ShellExtMenuFiles);
            RegistryHelpers.RemoveRegistry(ShellExtMenuDirectory);
        }

        public static bool CheckEditShellContextMenuButton()
        {
            try
            {
                return RegistryHelpers.CheckStringValue(ShellExtEditImageCmd, null, ShellExtEditPath);
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
            }

            return false;
        }

        public static void CreateEditShellContextMenuButton(bool create)
        {
            try
            {
                if (create)
                {
                    UnregisterEditShellContextMenuButton();
                    RegisterEditShellContextMenuButton();
                }
                else
                {
                    UnregisterEditShellContextMenuButton();
                }
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
            }
        }

        private static void RegisterEditShellContextMenuButton()
        {
            RegistryHelpers.CreateRegistry(ShellExtEditImage, ShellExtEditDesc);
            RegistryHelpers.CreateRegistry(ShellExtEditImage, "Icon", ShellExtEditIcon);
            RegistryHelpers.CreateRegistry(ShellExtEditImageCmd, ShellExtEditPath);
        }

        private static void UnregisterEditShellContextMenuButton()
        {
            RegistryHelpers.RemoveRegistry(ShellExtEditImage);
        }

        public static bool CheckCustomUploaderExtension()
        {
            try
            {
                return RegistryHelpers.CheckStringValue(ShellCustomUploaderExtensionPath, null, ShellCustomUploaderExtensionValue) &&
                    RegistryHelpers.CheckStringValue(ShellCustomUploaderCommandPath, null, ShellCustomUploaderCommandValue);
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
            }

            return false;
        }

        public static void CreateCustomUploaderExtension(bool create)
        {
            try
            {
                if (create)
                {
                    UnregisterCustomUploaderExtension();
                    RegisterCustomUploaderExtension();
                }
                else
                {
                    UnregisterCustomUploaderExtension();
                }
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
            }
        }

        private static void RegisterCustomUploaderExtension()
        {
            RegistryHelpers.CreateRegistry(ShellCustomUploaderExtensionPath, ShellCustomUploaderExtensionValue);
            RegistryHelpers.CreateRegistry(ShellCustomUploaderAssociatePath, ShellCustomUploaderAssociateValue);
            RegistryHelpers.CreateRegistry(ShellCustomUploaderIconPath, ShellCustomUploaderIconValue);
            RegistryHelpers.CreateRegistry(ShellCustomUploaderCommandPath, ShellCustomUploaderCommandValue);

            NativeMethods.SHChangeNotify(HChangeNotifyEventID.SHCNE_ASSOCCHANGED, HChangeNotifyFlags.SHCNF_FLUSH, IntPtr.Zero, IntPtr.Zero);
        }

        private static void UnregisterCustomUploaderExtension()
        {
            RegistryHelpers.RemoveRegistry(ShellCustomUploaderExtensionPath);
            RegistryHelpers.RemoveRegistry(ShellCustomUploaderAssociatePath);
        }

        public static bool CheckImageEffectExtension()
        {
            try
            {
                return RegistryHelpers.CheckStringValue(ShellImageEffectExtensionPath, null, ShellImageEffectExtensionValue) &&
                    RegistryHelpers.CheckStringValue(ShellImageEffectCommandPath, null, ShellImageEffectCommandValue);
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
            }

            return false;
        }

        public static void CreateImageEffectExtension(bool create)
        {
            try
            {
                if (create)
                {
                    UnregisterImageEffectExtension();
                    RegisterImageEffectExtension();
                }
                else
                {
                    UnregisterImageEffectExtension();
                }
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
            }
        }

        private static void RegisterImageEffectExtension()
        {
            RegistryHelpers.CreateRegistry(ShellImageEffectExtensionPath, ShellImageEffectExtensionValue);
            RegistryHelpers.CreateRegistry(ShellImageEffectAssociatePath, ShellImageEffectAssociateValue);
            RegistryHelpers.CreateRegistry(ShellImageEffectIconPath, ShellImageEffectIconValue);
            RegistryHelpers.CreateRegistry(ShellImageEffectCommandPath, ShellImageEffectCommandValue);

            NativeMethods.SHChangeNotify(HChangeNotifyEventID.SHCNE_ASSOCCHANGED, HChangeNotifyFlags.SHCNF_FLUSH, IntPtr.Zero, IntPtr.Zero);
        }

        private static void UnregisterImageEffectExtension()
        {
            RegistryHelpers.RemoveRegistry(ShellImageEffectExtensionPath);
            RegistryHelpers.RemoveRegistry(ShellImageEffectAssociatePath);
        }

        public static bool CheckChromeExtensionSupport()
        {
            try
            {
                return RegistryHelpers.CheckStringValue(ChromeNativeMessagingHosts, null, ChromeHostManifestFilePath) && File.Exists(ChromeHostManifestFilePath);
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
            }

            return false;
        }

        public static void CreateChromeExtensionSupport(bool create)
        {
            try
            {
                if (create)
                {
                    UnregisterChromeExtensionSupport();
                    RegisterChromeExtensionSupport();
                }
                else
                {
                    UnregisterChromeExtensionSupport();
                }
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
            }
        }

        private static void RegisterChromeExtensionSupport()
        {
            RegistryHelpers.CreateRegistry(ChromeNativeMessagingHosts, ChromeHostManifestFilePath);
        }

        private static void UnregisterChromeExtensionSupport()
        {
            RegistryHelpers.RemoveRegistry(ChromeNativeMessagingHosts);
        }

        public static bool CheckFirefoxAddonSupport()
        {
            try
            {
                return RegistryHelpers.CheckStringValue(FirefoxNativeMessagingHosts, null, FirefoxHostManifestFilePath) && File.Exists(FirefoxHostManifestFilePath);
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
            }

            return false;
        }

        public static void CreateFirefoxAddonSupport(bool create)
        {
            try
            {
                if (create)
                {
                    UnregisterFirefoxAddonSupport();
                    RegisterFirefoxAddonSupport();
                }
                else
                {
                    UnregisterFirefoxAddonSupport();
                }
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
            }
        }

        private static void RegisterFirefoxAddonSupport()
        {
            RegistryHelpers.CreateRegistry(FirefoxNativeMessagingHosts, FirefoxHostManifestFilePath);
        }

        private static void UnregisterFirefoxAddonSupport()
        {
            RegistryHelpers.RemoveRegistry(FirefoxNativeMessagingHosts);
        }

        public static bool CheckSendToMenuButton()
        {
            return ShortcutHelpers.CheckShortcut(Environment.SpecialFolder.SendTo, "ShareX", Application.ExecutablePath);
        }

        public static bool CreateSendToMenuButton(bool create)
        {
            return ShortcutHelpers.SetShortcut(create, Environment.SpecialFolder.SendTo, "ShareX", Application.ExecutablePath);
        }

        public static bool CheckSteamShowInApp()
        {
            return File.Exists(Program.SteamInAppFilePath);
        }

        public static void SteamShowInApp(bool showInApp)
        {
            string path = Program.SteamInAppFilePath;

            try
            {
                if (showInApp)
                {
                    FileHelpers.CreateEmptyFile(path);
                }
                else if (File.Exists(path))
                {
                    File.Delete(path);
                }
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
                e.ShowError();
                return;
            }

            MessageBox.Show(Resources.ApplicationSettingsForm_cbSteamShowInApp_CheckedChanged_For_settings_to_take_effect_ShareX_needs_to_be_reopened_from_Steam_,
                "ShareX", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        public static void Uninstall()
        {
            StartupManager.State = StartupState.Disabled;
            CreateShellContextMenuButton(false);
            CreateEditShellContextMenuButton(false);
            CreateCustomUploaderExtension(false);
            CreateImageEffectExtension(false);
            CreateSendToMenuButton(false);
            UnregisterChromeExtensionSupport();
            UnregisterFirefoxAddonSupport();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: LanguageHelper.cs]---
Location: ShareX-develop/ShareX/LanguageHelper.cs

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
using System.ComponentModel;
using System.Drawing;
using System.Globalization;
using System.Threading;
using System.Windows.Forms;

namespace ShareX
{
    public static class LanguageHelper
    {
        public static bool ChangeLanguage(SupportedLanguage language, params Form[] forms)
        {
            CultureInfo currentCulture;

            if (language == SupportedLanguage.Automatic)
            {
                currentCulture = CultureInfo.InstalledUICulture;
            }
            else
            {
                string cultureName = GetCultureName(language);
                currentCulture = CultureInfo.GetCultureInfo(cultureName);
            }

            if (!currentCulture.Equals(Thread.CurrentThread.CurrentUICulture))
            {
                Helpers.SetDefaultUICulture(currentCulture);
                DebugHelper.WriteLine("Language changed to: " + currentCulture.DisplayName);

                foreach (Form form in forms)
                {
                    ComponentResourceManager resources = new ComponentResourceManager(form.GetType());
                    ApplyResourceToControl(form, resources, currentCulture);
                    resources.ApplyResources(form, "$this", currentCulture);
                }

                return true;
            }

            return false;
        }

        public static Image GetLanguageIcon(SupportedLanguage language)
        {
            Image icon;

            switch (language)
            {
                default:
                case SupportedLanguage.Automatic:
                    icon = Resources.globe;
                    break;
                case SupportedLanguage.Arabic:
                    icon = Resources.ye;
                    break;
                case SupportedLanguage.Dutch:
                    icon = Resources.nl;
                    break;
                case SupportedLanguage.English:
                    icon = Resources.us;
                    break;
                case SupportedLanguage.French:
                    icon = Resources.fr;
                    break;
                case SupportedLanguage.German:
                    icon = Resources.de;
                    break;
                case SupportedLanguage.Hebrew:
                    icon = Resources.il;
                    break;
                case SupportedLanguage.Hungarian:
                    icon = Resources.hu;
                    break;
                case SupportedLanguage.Indonesian:
                    icon = Resources.id;
                    break;
                case SupportedLanguage.Italian:
                    icon = Resources.it;
                    break;
                case SupportedLanguage.Japanese:
                    icon = Resources.jp;
                    break;
                case SupportedLanguage.Korean:
                    icon = Resources.kr;
                    break;
                case SupportedLanguage.MexicanSpanish:
                    icon = Resources.mx;
                    break;
                case SupportedLanguage.Persian:
                    icon = Resources.ir;
                    break;
                case SupportedLanguage.Polish:
                    icon = Resources.pl;
                    break;
                case SupportedLanguage.Portuguese:
                    icon = Resources.pt;
                    break;
                case SupportedLanguage.PortugueseBrazil:
                    icon = Resources.br;
                    break;
                case SupportedLanguage.Romanian:
                    icon = Resources.ro;
                    break;
                case SupportedLanguage.Russian:
                    icon = Resources.ru;
                    break;
                case SupportedLanguage.SimplifiedChinese:
                    icon = Resources.cn;
                    break;
                case SupportedLanguage.Spanish:
                    icon = Resources.es;
                    break;
                case SupportedLanguage.TraditionalChinese:
                    icon = Resources.tw;
                    break;
                case SupportedLanguage.Turkish:
                    icon = Resources.tr;
                    break;
                case SupportedLanguage.Ukrainian:
                    icon = Resources.ua;
                    break;
                case SupportedLanguage.Vietnamese:
                    icon = Resources.vn;
                    break;
            }

            return icon;
        }

        public static string GetCultureName(SupportedLanguage language)
        {
            string cultureName;

            switch (language)
            {
                case SupportedLanguage.Arabic:
                    cultureName = "ar-YE";
                    break;
                case SupportedLanguage.Dutch:
                    cultureName = "nl-NL";
                    break;
                default:
                case SupportedLanguage.English:
                    cultureName = "en-US";
                    break;
                case SupportedLanguage.French:
                    cultureName = "fr-FR";
                    break;
                case SupportedLanguage.German:
                    cultureName = "de-DE";
                    break;
                case SupportedLanguage.Hebrew:
                    cultureName = "he-IL";
                    break;
                case SupportedLanguage.Hungarian:
                    cultureName = "hu-HU";
                    break;
                case SupportedLanguage.Indonesian:
                    cultureName = "id-ID";
                    break;
                case SupportedLanguage.Italian:
                    cultureName = "it-IT";
                    break;
                case SupportedLanguage.Japanese:
                    cultureName = "ja-JP";
                    break;
                case SupportedLanguage.Korean:
                    cultureName = "ko-KR";
                    break;
                case SupportedLanguage.MexicanSpanish:
                    cultureName = "es-MX";
                    break;
                case SupportedLanguage.Persian:
                    cultureName = "fa-IR";
                    break;
                case SupportedLanguage.Polish:
                    cultureName = "pl-PL";
                    break;
                case SupportedLanguage.Portuguese:
                    cultureName = "pt-PT";
                    break;
                case SupportedLanguage.PortugueseBrazil:
                    cultureName = "pt-BR";
                    break;
                case SupportedLanguage.Romanian:
                    cultureName = "ro-RO";
                    break;
                case SupportedLanguage.Russian:
                    cultureName = "ru-RU";
                    break;
                case SupportedLanguage.SimplifiedChinese:
                    cultureName = "zh-CN";
                    break;
                case SupportedLanguage.Spanish:
                    cultureName = "es-ES";
                    break;
                case SupportedLanguage.TraditionalChinese:
                    cultureName = "zh-TW";
                    break;
                case SupportedLanguage.Turkish:
                    cultureName = "tr-TR";
                    break;
                case SupportedLanguage.Ukrainian:
                    cultureName = "uk-UA";
                    break;
                case SupportedLanguage.Vietnamese:
                    cultureName = "vi-VN";
                    break;
            }

            return cultureName;
        }

        private static void ApplyResourceToControl(Control control, ComponentResourceManager resource, CultureInfo culture)
        {
            if (control is ToolStrip ts)
            {
                ApplyResourceToToolStripItemCollection(ts.Items, resource, culture);
            }
            else
            {
                foreach (Control child in control.Controls)
                {
                    ApplyResourceToControl(child, resource, culture);
                }
            }

            resource.ApplyResources(control, control.Name, culture);
        }

        private static void ApplyResourceToToolStripItemCollection(ToolStripItemCollection collection, ComponentResourceManager resource, CultureInfo culture)
        {
            foreach (ToolStripItem item in collection)
            {
                if (item is ToolStripDropDownItem tsddi)
                {
                    ApplyResourceToToolStripItemCollection(tsddi.DropDownItems, resource, culture);
                }

                resource.ApplyResources(item, item.Name, culture);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: NativeMessageInput.cs]---
Location: ShareX-develop/ShareX/NativeMessageInput.cs

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

namespace ShareX
{
    public class NativeMessagingInput
    {
        public NativeMessagingAction Action { get; set; }
        public string URL { get; set; }
        public string Text { get; set; }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: NewsItem.cs]---
Location: ShareX-develop/ShareX/NewsItem.cs

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
using System;

namespace ShareX
{
    public class NewsItem
    {
        public DateTime DateTime { get; set; }
        public string Text { get; set; }
        public string URL { get; set; }

        [JsonIgnore]
        public bool IsUnread { get; set; }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: NewsManager.cs]---
Location: ShareX-develop/ShareX/NewsManager.cs

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
using ShareX.HelpersLib;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ShareX
{
    public class NewsManager
    {
        public List<NewsItem> NewsItems { get; private set; } = new List<NewsItem>();
        public DateTime LastReadDate { get; set; }
        public bool IsUnread => UnreadCount > 0;
        public int UnreadCount => NewsItems != null ? NewsItems.Count(x => x.IsUnread) : 0;

        public async Task UpdateNews()
        {
            try
            {
                NewsItems = await GetNews();
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
            }
        }

        public void UpdateUnread()
        {
            if (NewsItems != null)
            {
                foreach (NewsItem newsItem in NewsItems)
                {
                    newsItem.IsUnread = newsItem.DateTime > LastReadDate;
                }
            }
        }

        private async Task<List<NewsItem>> GetNews()
        {
            string url = URLHelpers.CombineURL(Links.Website, "news.json");
            string response = await WebHelpers.DownloadStringAsync(url);

            if (!string.IsNullOrEmpty(response))
            {
                JsonSerializerSettings settings = new JsonSerializerSettings
                {
                    DateTimeZoneHandling = DateTimeZoneHandling.Local
                };

                return JsonConvert.DeserializeObject<List<NewsItem>>(response, settings);
            }

            return null;
        }

        private void ExportNews(List<NewsItem> newsItems)
        {
            JsonSerializerSettings settings = new JsonSerializerSettings
            {
                DateTimeZoneHandling = DateTimeZoneHandling.Utc,
                Formatting = Formatting.Indented,
                NullValueHandling = NullValueHandling.Ignore
            };

            string json = JsonConvert.SerializeObject(newsItems, settings);
            File.WriteAllText("news.json", json);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: NotificationFormConfig.cs]---
Location: ShareX-develop/ShareX/NotificationFormConfig.cs

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

namespace ShareX
{
    public class NotificationFormConfig : IDisposable
    {
        public int Duration { get; set; }
        public int FadeDuration { get; set; }
        public ContentAlignment Placement { get; set; }
        public int Offset { get; set; } = 5;
        public Size Size { get; set; }
        public bool IsValid => (Duration > 0 || FadeDuration > 0) && Size.Width > 0 && Size.Height > 0;
        public Color BackgroundColor { get; set; } = Color.FromArgb(50, 50, 50);
        public Color BorderColor { get; set; } = Color.FromArgb(40, 40, 40);
        public int TextPadding { get; set; } = 10;
        public Font TextFont { get; set; } = new Font("Arial", 11);
        public Color TextColor { get; set; } = Color.FromArgb(210, 210, 210);
        public Font TitleFont { get; set; } = new Font("Arial", 11, FontStyle.Bold);
        public Color TitleColor { get; set; } = Color.FromArgb(240, 240, 240);

        public Bitmap Image { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public string FilePath { get; set; }
        public string URL { get; set; }
        public ToastClickAction LeftClickAction { get; set; }
        public ToastClickAction RightClickAction { get; set; }
        public ToastClickAction MiddleClickAction { get; set; }

        public void Dispose()
        {
            TextFont?.Dispose();
            TitleFont?.Dispose();
            Image?.Dispose();
        }
    }
}
```

--------------------------------------------------------------------------------

````
