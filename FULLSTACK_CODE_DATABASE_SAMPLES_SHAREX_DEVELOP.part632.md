---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:48Z
part: 632
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 632 of 650)

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

---[FILE: RequestHelpers.cs]---
Location: ShareX-develop/ShareX.UploadersLib/Helpers/RequestHelpers.cs

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
using System.Collections.Specialized;
using System.IO;
using System.Net;
using System.Net.Cache;
using System.Text;

namespace ShareX.UploadersLib
{
    internal static class RequestHelpers
    {
        public const string ContentTypeMultipartFormData = "multipart/form-data";
        public const string ContentTypeJSON = "application/json";
        public const string ContentTypeXML = "application/xml";
        public const string ContentTypeURLEncoded = "application/x-www-form-urlencoded";
        public const string ContentTypeOctetStream = "application/octet-stream";

        public static HttpWebRequest CreateWebRequest(HttpMethod method, string url, NameValueCollection headers = null, CookieCollection cookies = null,
            string contentType = null, long contentLength = 0)
        {
#pragma warning disable SYSLIB0014
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
#pragma warning restore SYSLIB0014

            string accept = null;
            string referer = null;
            string userAgent = ShareXResources.UserAgent;

            if (headers != null)
            {
                if (headers["Accept"] != null)
                {
                    accept = headers["Accept"];
                    headers.Remove("Accept");
                }

                if (headers["Content-Length"] != null)
                {
                    if (long.TryParse(headers["Content-Length"], out contentLength))
                    {
                        request.ContentLength = contentLength;
                    }

                    headers.Remove("Content-Length");
                }

                if (headers["Content-Type"] != null)
                {
                    contentType = headers["Content-Type"];
                    headers.Remove("Content-Type");
                }

                if (headers["Cookie"] != null)
                {
                    string cookieHeader = headers["Cookie"];

                    if (cookies == null)
                    {
                        cookies = new CookieCollection();
                    }

                    foreach (string cookie in cookieHeader.Split(new string[] { "; " }, StringSplitOptions.RemoveEmptyEntries))
                    {
                        string[] cookieValues = cookie.Split(new char[] { '=' }, StringSplitOptions.RemoveEmptyEntries);

                        if (cookieValues.Length == 2)
                        {
                            cookies.Add(new Cookie(cookieValues[0], cookieValues[1], "/", request.Host.Split(':')[0]));
                        }
                    }

                    headers.Remove("Cookie");
                }

                if (headers["Referer"] != null)
                {
                    referer = headers["Referer"];
                    headers.Remove("Referer");
                }

                if (headers["User-Agent"] != null)
                {
                    userAgent = headers["User-Agent"];
                    headers.Remove("User-Agent");
                }

                request.Headers.Add(headers);
            }

            request.Accept = accept;
            request.ContentType = contentType;
            request.CookieContainer = new CookieContainer();
            if (cookies != null) request.CookieContainer.Add(cookies);
            request.Method = method.ToString();
            IWebProxy proxy = HelpersOptions.CurrentProxy.GetWebProxy();
            if (proxy != null) request.Proxy = proxy;
            request.Referer = referer;
            request.UserAgent = userAgent;

            if (contentLength > 0)
            {
                request.AllowWriteStreamBuffering = HelpersOptions.CurrentProxy.IsValidProxy();

                if (method == HttpMethod.GET)
                {
                    request.CachePolicy = new HttpRequestCachePolicy(HttpRequestCacheLevel.NoCacheNoStore);
                }

                request.ContentLength = contentLength;
                request.Pipelined = false;
                request.Timeout = -1;
            }
            else
            {
                request.KeepAlive = false;
            }

            return request;
        }

        public static string CreateBoundary()
        {
            return new string('-', 20) + DateTime.Now.Ticks.ToString("x");
        }

        public static byte[] MakeInputContent(string boundary, string name, string value)
        {
            string content = $"--{boundary}\r\nContent-Disposition: form-data; name=\"{name}\"\r\n\r\n{value}\r\n";
            return Encoding.UTF8.GetBytes(content);
        }

        public static byte[] MakeInputContent(string boundary, Dictionary<string, string> contents, bool isFinal = true)
        {
            using (MemoryStream stream = new MemoryStream())
            {
                if (string.IsNullOrEmpty(boundary)) boundary = CreateBoundary();

                if (contents != null)
                {
                    byte[] bytes;

                    foreach (KeyValuePair<string, string> content in contents)
                    {
                        if (!string.IsNullOrEmpty(content.Key))
                        {
                            bytes = MakeInputContent(boundary, content.Key, content.Value);
                            stream.Write(bytes, 0, bytes.Length);
                        }
                    }

                    if (isFinal)
                    {
                        bytes = Encoding.UTF8.GetBytes($"--{boundary}--\r\n");
                        stream.Write(bytes, 0, bytes.Length);
                    }
                }

                return stream.ToArray();
            }
        }

        public static byte[] MakeFileInputContentOpen(string boundary, string fileFormName, string fileName)
        {
            string mimeType = MimeTypes.GetMimeTypeFromFileName(fileName);
            string content = $"--{boundary}\r\nContent-Disposition: form-data; name=\"{fileFormName}\"; filename=\"{fileName}\"\r\nContent-Type: {mimeType}\r\n\r\n";
            return Encoding.UTF8.GetBytes(content);
        }

        public static byte[] MakeRelatedFileInputContentOpen(string boundary, string contentType, string relatedData, string fileName)
        {
            string mimeType = MimeTypes.GetMimeTypeFromFileName(fileName);
            string content = $"--{boundary}\r\nContent-Type: {contentType}\r\n\r\n{relatedData}\r\n\r\n";
            content += $"--{boundary}\r\nContent-Type: {mimeType}\r\n\r\n";
            return Encoding.UTF8.GetBytes(content);
        }

        public static byte[] MakeFileInputContentClose(string boundary)
        {
            return Encoding.UTF8.GetBytes($"\r\n--{boundary}--\r\n");
        }

        public static string ResponseToString(WebResponse response)
        {
            if (response != null)
            {
                using (Stream responseStream = response.GetResponseStream())
                using (StreamReader reader = new StreamReader(responseStream, Encoding.UTF8))
                {
                    return reader.ReadToEnd();
                }
            }

            return null;
        }

        public static NameValueCollection CreateAuthenticationHeader(string username, string password)
        {
            string authorization = TranslatorHelper.TextToBase64(username + ":" + password);
            NameValueCollection headers = new NameValueCollection();
            headers["Authorization"] = "Basic " + authorization;
            return headers;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ResponseInfo.cs]---
Location: ShareX-develop/ShareX.UploadersLib/Helpers/ResponseInfo.cs

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
using System.Net;
using System.Text;

namespace ShareX.UploadersLib
{
    public class ResponseInfo
    {
        public HttpStatusCode StatusCode { get; set; }
        public string StatusDescription { get; set; }
        public bool IsSuccess => WebHelpers.IsSuccessStatusCode(StatusCode);
        public string ResponseURL { get; set; }
        public WebHeaderCollection Headers { get; set; }
        public string ResponseText { get; set; }

        public string ToReadableString(bool includeResponseText)
        {
            StringBuilder sbResponseInfo = new StringBuilder();

            sbResponseInfo.AppendLine("Status code:");
            sbResponseInfo.Append($"({(int)StatusCode}) {StatusDescription}");

            if (!string.IsNullOrEmpty(ResponseURL))
            {
                sbResponseInfo.AppendLine();
                sbResponseInfo.AppendLine();
                sbResponseInfo.AppendLine("Response URL:");
                sbResponseInfo.Append(ResponseURL);
            }

            if (Headers != null && Headers.Count > 0)
            {
                sbResponseInfo.AppendLine();
                sbResponseInfo.AppendLine();
                sbResponseInfo.AppendLine("Headers:");
                sbResponseInfo.Append(Headers.ToString().TrimEnd());
            }

            if (includeResponseText && !string.IsNullOrEmpty(ResponseText))
            {
                sbResponseInfo.AppendLine();
                sbResponseInfo.AppendLine();
                sbResponseInfo.AppendLine("Response text:");
                sbResponseInfo.Append(ResponseText);
            }

            return sbResponseInfo.ToString();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: TaskReferenceHelper.cs]---
Location: ShareX-develop/ShareX.UploadersLib/Helpers/TaskReferenceHelper.cs

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

namespace ShareX.UploadersLib
{
    public class TaskReferenceHelper
    {
        public EDataType DataType { get; set; }
        public bool StopRequested { get; set; }
        public bool OverrideFTP { get; set; }
        public int FTPIndex { get; set; }
        public bool OverrideCustomUploader { get; set; }
        public int CustomUploaderIndex { get; set; }
        public string TextFormat { get; set; }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: UploaderErrorInfo.cs]---
Location: ShareX-develop/ShareX.UploadersLib/Helpers/UploaderErrorInfo.cs

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

namespace ShareX.UploadersLib
{
    public class UploaderErrorInfo
    {
        public string Title { get; set; }
        public string Text { get; set; }
        public Exception Exception { get; set; }

        public UploaderErrorInfo(string title, string text)
        {
            Title = title;
            Text = text;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: UploaderErrorManager.cs]---
Location: ShareX-develop/ShareX.UploadersLib/Helpers/UploaderErrorManager.cs

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

using ShareX.UploadersLib.Properties;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ShareX.UploadersLib
{
    public class UploaderErrorManager
    {
        public List<UploaderErrorInfo> Errors { get; private set; }

        public int Count => Errors.Count;

        public string DefaultTitle { get; set; } = Resources.Error;

        public UploaderErrorManager()
        {
            Errors = new List<UploaderErrorInfo>();
        }

        public void Add(string text)
        {
            Add(DefaultTitle, text);
        }

        private void Add(string title, string text)
        {
            Errors.Add(new UploaderErrorInfo(title, text));
        }

        public void Add(UploaderErrorManager manager)
        {
            Errors.AddRange(manager.Errors);
        }

        public void AddFirst(string text)
        {
            AddFirst(DefaultTitle, text);
        }

        private void AddFirst(string title, string text)
        {
            Errors.Insert(0, new UploaderErrorInfo(title, text));
        }

        public override string ToString()
        {
            return string.Join(Environment.NewLine + Environment.NewLine, Errors.Select(x => x.Text));
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Chevereto.cs]---
Location: ShareX-develop/ShareX.UploadersLib/ImageUploaders/Chevereto.cs

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
using ShareX.UploadersLib.Properties;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Windows.Forms;

namespace ShareX.UploadersLib.ImageUploaders
{
    public class CheveretoImageUploaderService : ImageUploaderService
    {
        public override ImageDestination EnumValue { get; } = ImageDestination.Chevereto;

        public override Image ServiceImage => Resources.Chevereto;

        public override bool CheckConfig(UploadersConfig config)
        {
            return config.CheveretoUploader != null && !string.IsNullOrEmpty(config.CheveretoUploader.UploadURL) &&
                !string.IsNullOrEmpty(config.CheveretoUploader.APIKey);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new Chevereto(config.CheveretoUploader)
            {
                DirectURL = config.CheveretoDirectURL
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpChevereto;
    }

    public sealed class Chevereto : ImageUploader
    {
        public CheveretoUploader Uploader { get; private set; }

        public bool DirectURL { get; set; }

        public Chevereto(CheveretoUploader uploader)
        {
            Uploader = uploader;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("key", Uploader.APIKey);
            args.Add("format", "json");

            string url = URLHelpers.FixPrefix(Uploader.UploadURL);

            UploadResult result = SendRequestFile(url, stream, fileName, "source", args);

            if (result.IsSuccess)
            {
                CheveretoResponse response = JsonConvert.DeserializeObject<CheveretoResponse>(result.Response);

                if (response != null && response.Image != null)
                {
                    result.URL = DirectURL ? response.Image.URL : response.Image.URL_Viewer;

                    if (response.Image.Thumb != null)
                    {
                        result.ThumbnailURL = response.Image.Thumb.URL;
                    }
                }
            }

            return result;
        }

        private class CheveretoResponse
        {
            public CheveretoImage Image { get; set; }
        }

        private class CheveretoImage
        {
            public string URL { get; set; }
            public string URL_Viewer { get; set; }
            public CheveretoThumb Thumb { get; set; }
        }

        private class CheveretoThumb
        {
            public string URL { get; set; }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CheveretoUploader.cs]---
Location: ShareX-develop/ShareX.UploadersLib/ImageUploaders/CheveretoUploader.cs

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

namespace ShareX.UploadersLib
{
    public class CheveretoUploader
    {
        public string UploadURL { get; set; }
        [JsonEncrypt]
        public string APIKey { get; set; }

        public CheveretoUploader()
        {
        }

        public CheveretoUploader(string uploadURL, string apiKey)
        {
            UploadURL = uploadURL;
            APIKey = apiKey;
        }

        public override string ToString()
        {
            return URLHelpers.GetHostName(UploadURL);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CustomImageUploader.cs]---
Location: ShareX-develop/ShareX.UploadersLib/ImageUploaders/CustomImageUploader.cs

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
using System.IO;

namespace ShareX.UploadersLib.ImageUploaders
{
    public class CustomImageUploaderService : ImageUploaderService
    {
        public override ImageDestination EnumValue { get; } = ImageDestination.CustomImageUploader;

        public override bool CheckConfig(UploadersConfig config)
        {
            return config.CustomUploadersList != null && config.CustomUploadersList.IsValidIndex(config.CustomImageUploaderSelected);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            int index;

            if (taskInfo.OverrideCustomUploader)
            {
                index = taskInfo.CustomUploaderIndex.BetweenOrDefault(0, config.CustomUploadersList.Count - 1);
            }
            else
            {
                index = config.CustomImageUploaderSelected;
            }

            CustomUploaderItem customUploader = config.CustomUploadersList.ReturnIfValidIndex(index);

            if (customUploader != null)
            {
                return new CustomImageUploader(customUploader);
            }

            return null;
        }
    }

    public sealed class CustomImageUploader : ImageUploader
    {
        private CustomUploaderItem uploader;

        public CustomImageUploader(CustomUploaderItem customUploaderItem)
        {
            uploader = customUploaderItem;
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            UploadResult result = new UploadResult();
            CustomUploaderInput input = new CustomUploaderInput(fileName, "");

            if (uploader.Body == CustomUploaderBody.MultipartFormData)
            {
                result = SendRequestFile(uploader.GetRequestURL(input), stream, fileName, uploader.GetFileFormName(), uploader.GetArguments(input),
                    uploader.GetHeaders(input), null, uploader.RequestMethod);
            }
            else if (uploader.Body == CustomUploaderBody.Binary)
            {
                result.Response = SendRequest(uploader.RequestMethod, uploader.GetRequestURL(input), stream, MimeTypes.GetMimeTypeFromFileName(fileName),
                    null, uploader.GetHeaders(input));
            }
            else
            {
                throw new Exception("Unsupported request format: " + uploader.Body);
            }

            uploader.TryParseResponse(result, LastResponseInfo, Errors, input);

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: FlickrUploader.cs]---
Location: ShareX-develop/ShareX.UploadersLib/ImageUploaders/FlickrUploader.cs

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
using ShareX.UploadersLib.Properties;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.IO;
using System.Windows.Forms;
using System.Xml.Linq;

namespace ShareX.UploadersLib.ImageUploaders
{
    public class FlickrImageUploaderService : ImageUploaderService
    {
        public override ImageDestination EnumValue { get; } = ImageDestination.Flickr;

        public override Icon ServiceIcon => Resources.Flickr;

        public override bool CheckConfig(UploadersConfig config)
        {
            return OAuthInfo.CheckOAuth(config.FlickrOAuthInfo);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new FlickrUploader(config.FlickrOAuthInfo, config.FlickrSettings);
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpFlickr;
    }

    public class FlickrUploader : ImageUploader, IOAuth
    {
        public OAuthInfo AuthInfo { get; set; }
        public FlickrSettings Settings { get; set; } = new FlickrSettings();

        public FlickrUploader(OAuthInfo oauth)
        {
            AuthInfo = oauth;
        }

        public FlickrUploader(OAuthInfo oauth, FlickrSettings settings)
        {
            AuthInfo = oauth;
            Settings = settings;
        }

        public string GetAuthorizationURL()
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("oauth_callback", Links.Callback);

            string url = GetAuthorizationURL("https://www.flickr.com/services/oauth/request_token", "https://www.flickr.com/services/oauth/authorize", AuthInfo, args);

            return url + "&perms=write";
        }

        public bool GetAccessToken(string verificationCode = null)
        {
            AuthInfo.AuthVerifier = verificationCode;
            return GetAccessToken("https://www.flickr.com/services/oauth/access_token", AuthInfo);
        }

        public FlickrPhotosGetSizesResponse PhotosGetSizes(string photoid)
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("nojsoncallback", "1");
            args.Add("format", "json");
            args.Add("method", "flickr.photos.getSizes");
            args.Add("photo_id", photoid);

            string query = OAuthManager.GenerateQuery("https://api.flickr.com/services/rest", args, HttpMethod.POST, AuthInfo);

            string response = SendRequest(HttpMethod.GET, query);

            return JsonConvert.DeserializeObject<FlickrPhotosGetSizesResponse>(response);
        }

        public override UploadResult Upload(Stream stream, string fileName)
        {
            string url = "https://up.flickr.com/services/upload/";

            Dictionary<string, string> args = new Dictionary<string, string>();

            if (!string.IsNullOrEmpty(Settings.Title)) args.Add("title", Settings.Title);
            if (!string.IsNullOrEmpty(Settings.Description)) args.Add("description", Settings.Description);
            if (!string.IsNullOrEmpty(Settings.Tags)) args.Add("tags", Settings.Tags);
            if (!string.IsNullOrEmpty(Settings.IsPublic)) args.Add("is_public", Settings.IsPublic);
            if (!string.IsNullOrEmpty(Settings.IsFriend)) args.Add("is_friend", Settings.IsFriend);
            if (!string.IsNullOrEmpty(Settings.IsFamily)) args.Add("is_family", Settings.IsFamily);
            if (!string.IsNullOrEmpty(Settings.SafetyLevel)) args.Add("safety_level", Settings.SafetyLevel);
            if (!string.IsNullOrEmpty(Settings.ContentType)) args.Add("content_type", Settings.ContentType);
            if (!string.IsNullOrEmpty(Settings.Hidden)) args.Add("hidden", Settings.Hidden);

            OAuthManager.GenerateQuery(url, args, HttpMethod.POST, AuthInfo, out Dictionary<string, string> parameters);

            UploadResult result = SendRequestFile(url, stream, fileName, "photo", parameters);

            if (result.IsSuccess)
            {
                XElement xele = ParseResponse(result.Response, "photoid");

                if (xele != null)
                {
                    string photoid = xele.Value;
                    FlickrPhotosGetSizesResponse photos = PhotosGetSizes(photoid);
                    if (photos != null && photos.sizes != null && photos.sizes.size != null && photos.sizes.size.Length > 0)
                    {
                        FlickrPhotosGetSizesSize photo = photos.sizes.size[photos.sizes.size.Length - 1];

                        if (Settings.DirectLink)
                        {
                            result.URL = photo.source;
                        }
                        else
                        {
                            result.URL = photo.url;
                        }
                    }
                }
            }

            return result;
        }

        private XElement ParseResponse(string response, string field)
        {
            if (!string.IsNullOrEmpty(response))
            {
                XDocument xdoc = XDocument.Parse(response);
                XElement xele = xdoc.Element("rsp");

                if (xele != null)
                {
                    switch (xele.GetAttributeFirstValue("status", "stat"))
                    {
                        case "ok":
                            return xele.Element(field);
                        case "fail":
                            XElement err = xele.Element("err");
                            //string code = err.GetAttributeValue("code");
                            string msg = err.GetAttributeValue("msg");
                            Errors.Add(msg);
                            break;
                    }
                }
            }

            return null;
        }
    }

    public class FlickrSettings
    {
        public bool DirectLink { get; set; } = true;

        [Description("The title of the photo.")]
        public string Title { get; set; }

        [Description("A description of the photo. May contain some limited HTML.")]
        public string Description { get; set; }

        [Description("A space-seperated list of tags to apply to the photo.")]
        public string Tags { get; set; }

        [Description("Set to 0 for no, 1 for yes. Specifies who can view the photo.")]
        public string IsPublic { get; set; }

        [Description("Set to 0 for no, 1 for yes. Specifies who can view the photo.")]
        public string IsFriend { get; set; }

        [Description("Set to 0 for no, 1 for yes. Specifies who can view the photo.")]
        public string IsFamily { get; set; }

        [Description("Set to 1 for Safe, 2 for Moderate, or 3 for Restricted.")]
        public string SafetyLevel { get; set; }

        [Description("Set to 1 for Photo, 2 for Screenshot, or 3 for Other.")]
        public string ContentType { get; set; }

        [Description("Set to 1 to keep the photo in global search results, 2 to hide from public searches.")]
        public string Hidden { get; set; }
    }

    public class FlickrPhotosGetSizesResponse
    {
        public FlickrPhotosGetSizesSizes sizes { get; set; }
        public string stat { get; set; }
    }

    public class FlickrPhotosGetSizesSizes
    {
        public int canblog { get; set; }
        public bool canprint { get; set; }
        public int candownload { get; set; }
        public FlickrPhotosGetSizesSize[] size { get; set; }
    }

    public class FlickrPhotosGetSizesSize
    {
        public string label { get; set; }
        public int width { get; set; }
        public int height { get; set; }
        public string source { get; set; }
        public string url { get; set; }
        public string media { get; set; }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ImageBin.cs]---
Location: ShareX-develop/ShareX.UploadersLib/ImageUploaders/ImageBin.cs

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

using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;

namespace ShareX.UploadersLib.ImageUploaders
{
    public sealed class ImageBin : ImageUploader
    {
        public override UploadResult Upload(Stream stream, string fileName)
        {
            Dictionary<string, string> arguments = new Dictionary<string, string>();
            arguments.Add("t", "file");
            arguments.Add("name", "ShareX");
            arguments.Add("tags", "ShareX");
            arguments.Add("description", "test");
            arguments.Add("adult", "t");
            arguments.Add("sfile", "Upload");
            arguments.Add("url", "");

            UploadResult result = SendRequestFile("http://imagebin.ca/upload.php", stream, fileName, "f", arguments);

            if (result.IsSuccess)
            {
                Match match = Regex.Match(result.Response, @"(?<=ca/view/).+(?=\.html'>)");
                if (match != null)
                {
                    string url = "http://imagebin.ca/img/" + match.Value + Path.GetExtension(fileName);
                    result.URL = url;
                }
            }

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

````
