---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 313
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 313 of 650)

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

---[FILE: URLHelpers.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Helpers/URLHelpers.cs

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
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Security;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;

namespace ShareX.HelpersLib
{
    public static class URLHelpers
    {
        public const string URLCharacters = Helpers.Alphanumeric + "-._~"; // 45 46 95 126
        public const string URLPathCharacters = URLCharacters + "/"; // 47
        public const string ValidURLCharacters = URLPathCharacters + ":?#[]@!$&'()*+,;= ";

        private static readonly string[] URLPrefixes = new string[] { "http://", "https://", "ftp://", "ftps://", "file://", "//" };
        private static readonly char[] BidiControlCharacters = new char[] { '\u200E', '\u200F', '\u202A', '\u202B', '\u202C', '\u202D', '\u202E' };

        public static void OpenURL(string url)
        {
            if (!string.IsNullOrEmpty(url))
            {
                Task.Run(() =>
                {
                    try
                    {
                        using (Process process = new Process())
                        {
                            ProcessStartInfo psi = new ProcessStartInfo();
                            psi.UseShellExecute = true;

                            if (!string.IsNullOrEmpty(HelpersOptions.BrowserPath))
                            {
                                psi.FileName = HelpersOptions.BrowserPath;
                                psi.Arguments = url;
                            }
                            else
                            {
                                psi.FileName = url;
                            }

                            process.StartInfo = psi;
                            process.Start();
                        }

                        DebugHelper.WriteLine("URL opened: " + url);
                    }
                    catch (Exception e)
                    {
                        DebugHelper.WriteException(e, $"OpenURL({url}) failed");
                    }
                });
            }
        }

        public static string URLEncode(string text, bool isPath = false, bool ignoreEmoji = false)
        {
            if (ignoreEmoji)
            {
                return URLEncodeIgnoreEmoji(text, isPath);
            }

            StringBuilder sb = new StringBuilder();

            if (!string.IsNullOrEmpty(text))
            {
                string unreservedCharacters;

                if (isPath)
                {
                    unreservedCharacters = URLPathCharacters;
                }
                else
                {
                    unreservedCharacters = URLCharacters;
                }

                foreach (char c in Encoding.UTF8.GetBytes(text))
                {
                    if (unreservedCharacters.IndexOf(c) != -1)
                    {
                        sb.Append(c);
                    }
                    else
                    {
                        sb.AppendFormat(CultureInfo.InvariantCulture, "%{0:X2}", (int)c);
                    }
                }
            }

            return sb.ToString();
        }

        public static string URLEncodeIgnoreEmoji(string text, bool isPath = false)
        {
            StringBuilder sb = new StringBuilder();

            for (int i = 0; i < text.Length; i++)
            {
                string remainingText = text.Substring(i);

                int emojiLength = Emoji.SearchEmoji(remainingText);

                if (emojiLength > 0)
                {
                    sb.Append(remainingText.Substring(0, emojiLength));
                    i += emojiLength - 1;
                }
                else
                {
                    sb.Append(URLEncode(remainingText.Substring(0, 1), isPath));
                }
            }

            return sb.ToString();
        }

        public static string RemoveBidiControlCharacters(string text)
        {
            return new string(text.Where(c => !BidiControlCharacters.Contains(c)).ToArray());
        }

        public static string ReplaceReservedCharacters(string text, string replace)
        {
            StringBuilder sb = new StringBuilder();

            string last = null;

            foreach (char c in text)
            {
                if (URLCharacters.Contains(c))
                {
                    last = c.ToString();
                }
                else if (last != replace)
                {
                    last = replace;
                }
                else
                {
                    continue;
                }

                sb.Append(last);
            }

            return sb.ToString();
        }

        public static string HtmlEncode(string text)
        {
            char[] chars = HttpUtility.HtmlEncode(text).ToCharArray();
            StringBuilder result = new StringBuilder(chars.Length + (int)(chars.Length * 0.1));

            foreach (char c in chars)
            {
                int value = Convert.ToInt32(c);

                if (value > 127)
                {
                    result.AppendFormat("&#{0};", value);
                }
                else
                {
                    result.Append(c);
                }
            }

            return result.ToString();
        }

        public static string JSONEncode(string text)
        {
            text = JsonConvert.ToString(text);
            return text.Substring(1, text.Length - 2);
        }

        public static string XMLEncode(string text)
        {
            return SecurityElement.Escape(text);
        }

        public static string URLDecode(string url, int count = 1)
        {
            string temp = null;

            for (int i = 0; i < count && url != temp; i++)
            {
                temp = url;
                url = HttpUtility.UrlDecode(url);
            }

            return url;
        }

        public static string CombineURL(string url1, string url2)
        {
            bool url1Empty = string.IsNullOrEmpty(url1);
            bool url2Empty = string.IsNullOrEmpty(url2);

            if (url1Empty && url2Empty)
            {
                return "";
            }

            if (url1Empty)
            {
                return url2;
            }

            if (url2Empty)
            {
                return url1;
            }

            if (url1.EndsWith("/"))
            {
                url1 = url1.Substring(0, url1.Length - 1);
            }

            if (url2.StartsWith("/"))
            {
                url2 = url2.Remove(0, 1);
            }

            return url1 + "/" + url2;
        }

        public static string CombineURL(params string[] urls)
        {
            return urls.Aggregate(CombineURL);
        }

        public static bool IsValidURL(string url, bool useRegex = true)
        {
            if (string.IsNullOrEmpty(url)) return false;

            url = url.Trim();

            if (useRegex)
            {
                // Source: https://gist.github.com/729294
                string pattern =
                    "^" +
                    // protocol identifier
                    "(?:(?:https?|ftp)://)" +
                    // user:pass authentication
                    "(?:\\S+(?::\\S*)?@)?" +
                    "(?:" +
                    // IP address exclusion
                    // private & local networks
                    "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
                    "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
                    "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
                    // IP address dotted notation octets
                    // excludes loopback network 0.0.0.0
                    // excludes reserved space >= 224.0.0.0
                    // excludes network & broacast addresses
                    // (first & last IP address of each class)
                    "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
                    "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
                    "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
                    "|" +
                    // host name
                    "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
                    // domain name
                    "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
                    // TLD identifier
                    "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
                    // TLD may end with dot
                    "\\.?" +
                    ")" +
                    // port number
                    "(?::\\d{2,5})?" +
                    // resource path
                    "(?:[/?#]\\S*)?" +
                    "$";

                return Regex.IsMatch(url, pattern, RegexOptions.IgnoreCase);
            }

            return !url.StartsWith("file://") && Uri.IsWellFormedUriString(url, UriKind.Absolute);
        }

        public static string AddSlash(string url, SlashType slashType)
        {
            return AddSlash(url, slashType, 1);
        }

        public static string AddSlash(string url, SlashType slashType, int count)
        {
            if (slashType == SlashType.Prefix)
            {
                if (url.StartsWith("/"))
                {
                    url = url.Remove(0, 1);
                }

                for (int i = 0; i < count; i++)
                {
                    url = "/" + url;
                }
            }
            else
            {
                if (url.EndsWith("/"))
                {
                    url = url.Substring(0, url.Length - 1);
                }

                for (int i = 0; i < count; i++)
                {
                    url += "/";
                }
            }

            return url;
        }

        public static string GetFileName(string path)
        {
            if (path.Contains('/'))
            {
                path = path.Substring(path.LastIndexOf('/') + 1);
            }

            if (path.Contains('?'))
            {
                path = path.Remove(path.IndexOf('?'));
            }

            if (path.Contains('#'))
            {
                path = path.Remove(path.IndexOf('#'));
            }

            return path;
        }

        public static bool IsFileURL(string url)
        {
            int index = url.LastIndexOf('/');

            if (index < 0)
            {
                return false;
            }

            string path = url.Substring(index + 1);

            return !string.IsNullOrEmpty(path) && path.Contains(".");
        }

        public static string GetDirectoryPath(string path)
        {
            if (path.Contains("/"))
            {
                path = path.Substring(0, path.LastIndexOf('/'));
            }

            return path;
        }

        public static List<string> GetPaths(string path)
        {
            List<string> paths = new List<string>();

            for (int i = 0; i < path.Length; i++)
            {
                if (path[i] == '/')
                {
                    string currentPath = path.Remove(i);

                    if (!string.IsNullOrEmpty(currentPath))
                    {
                        paths.Add(currentPath);
                    }
                }
                else if (i == path.Length - 1)
                {
                    paths.Add(path);
                }
            }

            return paths;
        }

        public static bool HasPrefix(string url)
        {
            return URLPrefixes.Any(x => url.StartsWith(x, StringComparison.OrdinalIgnoreCase));
        }

        public static string GetPrefix(string url)
        {
            return URLPrefixes.FirstOrDefault(x => url.StartsWith(x, StringComparison.OrdinalIgnoreCase));
        }

        public static string FixPrefix(string url, string prefix = "https://")
        {
            if (!string.IsNullOrEmpty(url) && !HasPrefix(url))
            {
                return prefix + url;
            }

            return url;
        }

        public static string ForcePrefix(string url, string prefix = "https://")
        {
            if (!string.IsNullOrEmpty(url))
            {
                url = prefix + RemovePrefixes(url);
            }

            return url;
        }

        public static string RemovePrefixes(string url)
        {
            foreach (string prefix in URLPrefixes)
            {
                if (url.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
                {
                    url = url.Remove(0, prefix.Length);
                    break;
                }
            }

            return url;
        }

        public static string GetHostName(string url)
        {
            if (!string.IsNullOrEmpty(url) && Uri.TryCreate(url, UriKind.Absolute, out Uri uri))
            {
                string host = uri.Host;

                if (!string.IsNullOrEmpty(host))
                {
                    if (host.StartsWith("www.", StringComparison.OrdinalIgnoreCase))
                    {
                        host = host.Substring(4);
                    }

                    return host;
                }
            }

            return url;
        }

        public static string CreateQueryString(Dictionary<string, string> args, bool customEncoding = false)
        {
            if (args != null && args.Count > 0)
            {
                List<string> pairs = new List<string>();

                foreach (KeyValuePair<string, string> arg in args)
                {
                    string pair;

                    if (string.IsNullOrEmpty(arg.Value))
                    {
                        pair = arg.Key;
                    }
                    else
                    {
                        string value;

                        if (customEncoding)
                        {
                            value = URLEncode(arg.Value);
                        }
                        else
                        {
                            value = HttpUtility.UrlEncode(arg.Value);
                        }

                        pair = arg.Key + "=" + value;
                    }

                    pairs.Add(pair);
                }

                return string.Join("&", pairs);
            }

            return "";
        }

        public static string CreateQueryString(string url, Dictionary<string, string> args, bool customEncoding = false)
        {
            string query = CreateQueryString(args, customEncoding);

            if (!string.IsNullOrEmpty(query))
            {
                if (url.Contains("?"))
                {
                    return url + "&" + query;
                }
                else
                {
                    return url + "?" + query;
                }
            }

            return url;
        }

        public static string RemoveQueryString(string url)
        {
            if (!string.IsNullOrEmpty(url))
            {
                int index = url.IndexOf("?");

                if (index > -1)
                {
                    return url.Remove(index);
                }
            }

            return url;
        }

        public static NameValueCollection ParseQueryString(string url)
        {
            if (!string.IsNullOrEmpty(url))
            {
                int index = url.IndexOf("?");

                if (index > -1 && index + 1 < url.Length)
                {
                    string query = url.Substring(index + 1);
                    return HttpUtility.ParseQueryString(query);
                }
            }

            return null;
        }

        public static string BuildUri(string root, string path, string query = null)
        {
            UriBuilder builder = new UriBuilder(root);
            builder.Path = path;
            builder.Query = query;
            return builder.Uri.AbsoluteUri;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: WebHelpers.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Helpers/WebHelpers.cs

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
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Sockets;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace ShareX.HelpersLib
{
    public static class WebHelpers
    {
        public static async Task DownloadFileAsync(string url, string filePath)
        {
            if (!string.IsNullOrEmpty(url) && !string.IsNullOrEmpty(filePath))
            {
                FileHelpers.CreateDirectoryFromFilePath(filePath);

                HttpClient client = HttpClientFactory.Create();

                using (HttpResponseMessage responseMessage = await client.GetAsync(url))
                {
                    if (responseMessage.IsSuccessStatusCode)
                    {
                        using (Stream responseStream = await responseMessage.Content.ReadAsStreamAsync())
                        using (FileStream fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write))
                        {
                            await responseStream.CopyToAsync(fileStream);
                        }
                    }
                }
            }
        }

        public static async Task<string> DownloadStringAsync(string url)
        {
            string response = null;

            if (!string.IsNullOrEmpty(url))
            {
                HttpClient client = HttpClientFactory.Create();

                using (HttpResponseMessage responseMessage = await client.GetAsync(url))
                {
                    if (responseMessage.IsSuccessStatusCode)
                    {
                        response = await responseMessage.Content.ReadAsStringAsync();
                    }
                }
            }

            return response;
        }

        public static async Task<Bitmap> DownloadImageAsync(string url)
        {
            Bitmap bmp = null;

            if (!string.IsNullOrEmpty(url))
            {
                HttpClient client = HttpClientFactory.Create();

                using (HttpResponseMessage responseMessage = await client.GetAsync(url, HttpCompletionOption.ResponseHeadersRead))
                {
                    if (responseMessage.IsSuccessStatusCode && responseMessage.Content.Headers.ContentType != null)
                    {
                        string mediaType = responseMessage.Content.Headers.ContentType.MediaType;

                        if (MimeTypes.IsImageMimeType(mediaType))
                        {
                            byte[] data = await responseMessage.Content.ReadAsByteArrayAsync();
                            MemoryStream memoryStream = new MemoryStream(data);

                            try
                            {
                                bmp = new Bitmap(memoryStream);
                            }
                            catch
                            {
                                memoryStream.Dispose();
                            }
                        }
                    }
                }
            }

            return bmp;
        }

        public static async Task<string> GetFileNameFromWebServerAsync(string url)
        {
            string fileName = null;

            if (!string.IsNullOrEmpty(url))
            {
                HttpClient client = HttpClientFactory.Create();

                using (HttpRequestMessage requestMessage = new HttpRequestMessage(HttpMethod.Head, url))
                using (HttpResponseMessage responseMessage = await client.SendAsync(requestMessage))
                {
                    if (responseMessage.Content.Headers.ContentDisposition != null)
                    {
                        string contentDisposition = responseMessage.Content.Headers.ContentDisposition.ToString();

                        if (!string.IsNullOrEmpty(contentDisposition))
                        {
                            string fileNameMarker = "filename=\"";
                            int beginIndex = contentDisposition.IndexOf(fileNameMarker, StringComparison.OrdinalIgnoreCase);
                            contentDisposition = contentDisposition.Substring(beginIndex + fileNameMarker.Length);
                            int fileNameLength = contentDisposition.IndexOf("\"");
                            fileName = contentDisposition.Substring(0, fileNameLength);
                        }
                    }
                }
            }

            return fileName;
        }

        // https://en.wikipedia.org/wiki/Data_URI_scheme
        public static Bitmap DataURLToImage(string url)
        {
            if (!string.IsNullOrEmpty(url) && url.StartsWith("data:", StringComparison.OrdinalIgnoreCase))
            {
                Match match = Regex.Match(url, @"^data:(?<mediaType>[\w\/]+);base64,(?<data>.+)$", RegexOptions.IgnoreCase);

                if (match.Success)
                {
                    string mediaType = match.Groups["mediaType"].Value;

                    if (MimeTypes.IsImageMimeType(mediaType))
                    {
                        string data = match.Groups["data"].Value;

                        if (!string.IsNullOrEmpty(data))
                        {
                            try
                            {
                                byte[] dataBytes = Convert.FromBase64String(data);

                                using (MemoryStream ms = new MemoryStream(dataBytes))
                                {
                                    return new Bitmap(ms);
                                }
                            }
                            catch
                            {
                            }
                        }
                    }
                }
            }

            return null;
        }

        public static bool IsSuccessStatusCode(HttpStatusCode statusCode)
        {
            int statusCodeNum = (int)statusCode;
            return statusCodeNum >= 200 && statusCodeNum <= 299;
        }

        public static int GetRandomUnusedPort()
        {
            TcpListener listener = new TcpListener(IPAddress.Loopback, 0);

            try
            {
                listener.Start();
                return ((IPEndPoint)listener.LocalEndpoint).Port;
            }
            finally
            {
                listener.Stop();
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: HotkeyForm.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Input/HotkeyForm.cs

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

using System.Diagnostics;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public class HotkeyForm : Form
    {
        public delegate void HotkeyEventHandler(ushort id, Keys key, Modifiers modifier);

        public event HotkeyEventHandler HotkeyPress;

        public int HotkeyRepeatLimit { get; set; }

        private Stopwatch repeatLimitTimer;

        public HotkeyForm()
        {
            HotkeyRepeatLimit = 1000;
            repeatLimitTimer = Stopwatch.StartNew();
        }

        public void RegisterHotkey(HotkeyInfo hotkeyInfo)
        {
            if (hotkeyInfo != null && hotkeyInfo.Status != HotkeyStatus.Registered)
            {
                if (!hotkeyInfo.IsValidHotkey)
                {
                    hotkeyInfo.Status = HotkeyStatus.NotConfigured;
                    return;
                }

                if (hotkeyInfo.ID == 0)
                {
                    string uniqueID = Helpers.GetUniqueID();
                    hotkeyInfo.ID = NativeMethods.GlobalAddAtom(uniqueID);

                    if (hotkeyInfo.ID == 0)
                    {
                        DebugHelper.WriteLine("Unable to generate unique hotkey ID: " + hotkeyInfo);
                        hotkeyInfo.Status = HotkeyStatus.Failed;
                        return;
                    }
                }

                if (!NativeMethods.RegisterHotKey(Handle, hotkeyInfo.ID, (uint)hotkeyInfo.ModifiersEnum, (uint)hotkeyInfo.KeyCode))
                {
                    NativeMethods.GlobalDeleteAtom(hotkeyInfo.ID);
                    DebugHelper.WriteLine("Unable to register hotkey: " + hotkeyInfo);
                    hotkeyInfo.ID = 0;
                    hotkeyInfo.Status = HotkeyStatus.Failed;
                    return;
                }

                hotkeyInfo.Status = HotkeyStatus.Registered;
            }
        }

        public bool UnregisterHotkey(HotkeyInfo hotkeyInfo)
        {
            if (hotkeyInfo != null)
            {
                if (hotkeyInfo.ID > 0)
                {
                    bool result = NativeMethods.UnregisterHotKey(Handle, hotkeyInfo.ID);

                    if (result)
                    {
                        NativeMethods.GlobalDeleteAtom(hotkeyInfo.ID);
                        hotkeyInfo.ID = 0;
                        hotkeyInfo.Status = HotkeyStatus.NotConfigured;
                        return true;
                    }
                }

                hotkeyInfo.Status = HotkeyStatus.Failed;
            }

            return false;
        }

        protected override void WndProc(ref Message m)
        {
            if (m.Msg == (int)WindowsMessages.HOTKEY && CheckRepeatLimitTime())
            {
                ushort id = (ushort)m.WParam;
                Keys key = (Keys)(((int)m.LParam >> 16) & 0xFFFF);
                Modifiers modifier = (Modifiers)((int)m.LParam & 0xFFFF);
                OnKeyPressed(id, key, modifier);
                return;
            }

            base.WndProc(ref m);
        }

        protected void OnKeyPressed(ushort id, Keys key, Modifiers modifier)
        {
            HotkeyPress?.Invoke(id, key, modifier);
        }

        private bool CheckRepeatLimitTime()
        {
            if (HotkeyRepeatLimit > 0)
            {
                if (repeatLimitTimer.ElapsedMilliseconds >= HotkeyRepeatLimit)
                {
                    repeatLimitTimer.Reset();
                    repeatLimitTimer.Start();
                }
                else
                {
                    return false;
                }
            }

            return true;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: HotkeyInfo.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Input/HotkeyInfo.cs

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
using System.Text;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    public class HotkeyInfo
    {
        public Keys Hotkey { get; set; }

        [JsonIgnore]
        public ushort ID { get; set; }

        [JsonIgnore]
        public HotkeyStatus Status { get; set; }

        public Keys KeyCode => Hotkey & Keys.KeyCode;

        public Keys ModifiersKeys => Hotkey & Keys.Modifiers;

        public bool Control => Hotkey.HasFlag(Keys.Control);

        public bool Shift => Hotkey.HasFlag(Keys.Shift);

        public bool Alt => Hotkey.HasFlag(Keys.Alt);

        public bool Win { get; set; }

        public Modifiers ModifiersEnum
        {
            get
            {
                Modifiers modifiers = Modifiers.None;

                if (Alt) modifiers |= Modifiers.Alt;
                if (Control) modifiers |= Modifiers.Control;
                if (Shift) modifiers |= Modifiers.Shift;
                if (Win) modifiers |= Modifiers.Win;

                return modifiers;
            }
        }

        public bool IsOnlyModifiers => KeyCode == Keys.ControlKey || KeyCode == Keys.ShiftKey || KeyCode == Keys.Menu || (KeyCode == Keys.None && Win);

        public bool IsValidHotkey => KeyCode != Keys.None && !IsOnlyModifiers;

        public HotkeyInfo()
        {
            Status = HotkeyStatus.NotConfigured;
        }

        public HotkeyInfo(Keys hotkey) : this()
        {
            Hotkey = hotkey;
        }

        public HotkeyInfo(Keys hotkey, ushort id) : this(hotkey)
        {
            ID = id;
        }

        public override string ToString()
        {
            string text = "";

            if (Control)
            {
                text += "Ctrl + ";
            }

            if (Shift)
            {
                text += "Shift + ";
            }

            if (Alt)
            {
                text += "Alt + ";
            }

            if (Win)
            {
                text += "Win + ";
            }

            if (IsOnlyModifiers)
            {
                text += "...";
            }
            else if (KeyCode == Keys.Back)
            {
                text += "Backspace";
            }
            else if (KeyCode == Keys.Return)
            {
                text += "Enter";
            }
            else if (KeyCode == Keys.Capital)
            {
                text += "Caps Lock";
            }
            else if (KeyCode == Keys.Next)
            {
                text += "Page Down";
            }
            else if (KeyCode == Keys.Scroll)
            {
                text += "Scroll Lock";
            }
            else if (KeyCode >= Keys.D0 && KeyCode <= Keys.D9)
            {
                text += (KeyCode - Keys.D0).ToString();
            }
            else if (KeyCode >= Keys.NumPad0 && KeyCode <= Keys.NumPad9)
            {
                text += "Numpad " + (KeyCode - Keys.NumPad0).ToString();
            }
            else
            {
                text += ToStringWithSpaces(KeyCode);
            }

            return text;
        }

        private string ToStringWithSpaces(Keys key)
        {
            string name = key.ToString();

            StringBuilder result = new StringBuilder();

            for (int i = 0; i < name.Length; i++)
            {
                if (i > 0 && char.IsUpper(name[i]))
                {
                    result.Append(" " + name[i]);
                }
                else
                {
                    result.Append(name[i]);
                }
            }

            return result.ToString();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: InputHelpers.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Input/InputHelpers.cs

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
    public static class InputHelpers
    {
        public static bool SendKeyDown(VirtualKeyCode keyCode)
        {
            InputManager inputManager = new InputManager();
            inputManager.AddKeyDown(keyCode);
            return inputManager.SendInputs();
        }

        public static bool SendKeyUp(VirtualKeyCode keyCode)
        {
            InputManager inputManager = new InputManager();
            inputManager.AddKeyUp(keyCode);
            return inputManager.SendInputs();
        }

        public static bool SendKeyPress(VirtualKeyCode keyCode)
        {
            InputManager inputManager = new InputManager();
            inputManager.AddKeyPress(keyCode);
            return inputManager.SendInputs();
        }

        public static bool SendKeyPressModifiers(VirtualKeyCode keyCode, params VirtualKeyCode[] modifiers)
        {
            InputManager inputManager = new InputManager();
            inputManager.AddKeyPressModifiers(keyCode, modifiers);
            return inputManager.SendInputs();
        }

        public static bool SendKeyPressText(string text)
        {
            InputManager inputManager = new InputManager();
            inputManager.AddKeyPressText(text);
            return inputManager.SendInputs();
        }

        public static bool SendMouseDown(MouseButtons button = MouseButtons.Left)
        {
            InputManager inputManager = new InputManager();
            inputManager.AddMouseDown(button);
            return inputManager.SendInputs();
        }

        public static bool SendMouseUp(MouseButtons button = MouseButtons.Left)
        {
            InputManager inputManager = new InputManager();
            inputManager.AddMouseUp(button);
            return inputManager.SendInputs();
        }

        public static bool SendMouseClick(MouseButtons button = MouseButtons.Left)
        {
            InputManager inputManager = new InputManager();
            inputManager.AddMouseClick(button);
            return inputManager.SendInputs();
        }

        public static bool SendMouseClick(int x, int y, MouseButtons button = MouseButtons.Left)
        {
            InputManager inputManager = new InputManager();
            inputManager.AddMouseClick(x, y, button);
            return inputManager.SendInputs();
        }

        public static bool SendMouseClick(Point position, MouseButtons button = MouseButtons.Left)
        {
            return SendMouseClick(position.X, position.Y, button);
        }

        public static bool SendMouseMove(int x, int y)
        {
            InputManager inputManager = new InputManager();
            inputManager.AddMouseMove(x, y);
            return inputManager.SendInputs();
        }

        public static bool SendMouseMove(Point position)
        {
            return SendMouseMove(position.X, position.Y);
        }

        public static bool SendMouseWheel(int delta)
        {
            InputManager inputManager = new InputManager();
            inputManager.AddMouseWheel(delta);
            return inputManager.SendInputs();
        }
    }
}
```

--------------------------------------------------------------------------------

````
