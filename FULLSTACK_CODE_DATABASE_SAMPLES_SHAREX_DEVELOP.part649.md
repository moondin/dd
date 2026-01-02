---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:48Z
part: 649
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 649 of 650)

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

---[FILE: Slexy.cs]---
Location: ShareX-develop/ShareX.UploadersLib/TextUploaders/Slexy.cs

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
using System.ComponentModel;

namespace ShareX.UploadersLib.TextUploaders
{
    public class SlexyTextUploaderService : TextUploaderService
    {
        public override TextDestination EnumValue { get; } = TextDestination.Slexy;

        public override bool CheckConfig(UploadersConfig config) => true;

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            SlexySettings settings = new SlexySettings()
            {
                TextFormat = taskInfo.TextFormat
            };

            return new Slexy(settings);
        }
    }

    public sealed class Slexy : TextUploader
    {
        private const string APIURL = "http://slexy.org/index.php/submit";

        private SlexySettings settings;

        public Slexy()
        {
            settings = new SlexySettings();
        }

        public Slexy(SlexySettings settings)
        {
            this.settings = settings;
        }

        public override UploadResult UploadText(string text, string fileName)
        {
            UploadResult ur = new UploadResult();

            if (!string.IsNullOrEmpty(text))
            {
                Dictionary<string, string> arguments = new Dictionary<string, string>();
                arguments.Add("raw_paste", text);
                arguments.Add("author", settings.Author);
                arguments.Add("comment", "");
                arguments.Add("desc", settings.Description);
                arguments.Add("expire", settings.Expiration);
                arguments.Add("language", settings.TextFormat);
                arguments.Add("linenumbers", settings.LineNumbers ? "1" : "0");
                arguments.Add("permissions", settings.Visibility == Privacy.Private ? "1" : "0");
                arguments.Add("submit", "Submit Paste");
                arguments.Add("tabbing", "true");
                arguments.Add("tabtype", "real");

                SendRequestMultiPart(APIURL, arguments);
                ur.URL = LastResponseInfo.ResponseURL;
            }

            return ur;
        }
    }

    public class SlexySettings
    {
        /// <summary>language</summary>
        public string TextFormat { get; set; }

        /// <summary>author</summary>
        public string Author { get; set; }

        /// <summary>permissions</summary>
        public Privacy Visibility { get; set; }

        /// <summary>desc</summary>
        public string Description { get; set; }

        /// <summary>linenumbers</summary>
        public bool LineNumbers { get; set; }

        /// <summary>expire</summary>
        [Description("Expiration time with seconds. Example: 0 = Forever, 60 = 1 minutes, 3600 = 1 hour, 2592000 = 1 month")]
        public string Expiration { get; set; }

        public SlexySettings()
        {
            TextFormat = "text";
            Author = "";
            Visibility = Privacy.Private;
            Description = "";
            LineNumbers = true;
            Expiration = "2592000";
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Upaste.cs]---
Location: ShareX-develop/ShareX.UploadersLib/TextUploaders/Upaste.cs

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
using ShareX.UploadersLib.Properties;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;

namespace ShareX.UploadersLib.TextUploaders
{
    public class UpasteTextUploaderService : TextUploaderService
    {
        public override TextDestination EnumValue { get; } = TextDestination.Upaste;

        public override Icon ServiceIcon => Resources.Upaste;

        public override bool CheckConfig(UploadersConfig config) => true;

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new Upaste(config.UpasteUserKey)
            {
                IsPublic = config.UpasteIsPublic
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpUpaste;
    }

    public sealed class Upaste : TextUploader
    {
        private const string APIURL = "http://upaste.me/api";

        public string UserKey { get; private set; }
        public bool IsPublic { get; set; }

        public Upaste(string userKey)
        {
            UserKey = userKey;
        }

        public override UploadResult UploadText(string text, string fileName)
        {
            UploadResult ur = new UploadResult();

            if (!string.IsNullOrEmpty(text))
            {
                Dictionary<string, string> arguments = new Dictionary<string, string>();
                if (!string.IsNullOrEmpty(UserKey))
                {
                    arguments.Add("api_key", UserKey);
                }
                arguments.Add("paste", text);
                //arguments.Add("syntax", "");
                //arguments.Add("name", "");
                arguments.Add("privacy", IsPublic ? "0" : "1"); // 0 public 1 private
                arguments.Add("expire", "0");
                arguments.Add("json", "true");

                ur.Response = SendRequestMultiPart(APIURL, arguments);

                if (!string.IsNullOrEmpty(ur.Response))
                {
                    UpasteResponse response = JsonConvert.DeserializeObject<UpasteResponse>(ur.Response);

                    if (response != null)
                    {
                        if (response.status.Equals("success", StringComparison.OrdinalIgnoreCase))
                        {
                            ur.URL = response.paste.link;
                        }
                        else
                        {
                            Errors.Add(response.error);
                        }
                    }
                }
            }

            return ur;
        }

        public class UpastePaste
        {
            public string id { get; set; }
            public string link { get; set; }
            public string raw { get; set; }
            public string download { get; set; }
        }

        public class UpasteResponse
        {
            public UpastePaste paste { get; set; }
            public int errorcode { get; set; }
            public string error { get; set; }
            public string status { get; set; }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: BitlyURLShortener.cs]---
Location: ShareX-develop/ShareX.UploadersLib/URLShorteners/BitlyURLShortener.cs

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
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Drawing;
using System.Web;
using System.Windows.Forms;

namespace ShareX.UploadersLib.URLShorteners
{
    public class BitlyURLShortenerService : URLShortenerService
    {
        public override UrlShortenerType EnumValue { get; } = UrlShortenerType.BITLY;

        public override Icon ServiceIcon => Resources.Bitly;

        public override bool CheckConfig(UploadersConfig config)
        {
            return OAuth2Info.CheckOAuth(config.BitlyOAuth2Info);
        }

        public override URLShortener CreateShortener(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            if (config.BitlyOAuth2Info == null)
            {
                config.BitlyOAuth2Info = new OAuth2Info(APIKeys.BitlyClientID, APIKeys.BitlyClientSecret);
            }

            return new BitlyURLShortener(config.BitlyOAuth2Info)
            {
                Domain = config.BitlyDomain
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpBitly;
    }

    public sealed class BitlyURLShortener : URLShortener, IOAuth2Basic
    {
        private const string URLAPI = "https://api-ssl.bitly.com/";
        private const string URLAccessToken = URLAPI + "oauth/access_token";
        private const string URLShorten = URLAPI + "v4/shorten";

        public OAuth2Info AuthInfo { get; private set; }
        public string Domain { get; set; }

        public BitlyURLShortener(OAuth2Info oauth)
        {
            AuthInfo = oauth;
        }

        public string GetAuthorizationURL()
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("client_id", AuthInfo.Client_ID);
            args.Add("redirect_uri", Links.Callback);

            return URLHelpers.CreateQueryString("https://bitly.com/oauth/authorize", args);
        }

        public bool GetAccessToken(string code)
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("client_id", AuthInfo.Client_ID);
            args.Add("client_secret", AuthInfo.Client_Secret);
            args.Add("code", code);
            args.Add("redirect_uri", Links.Callback);

            string response = SendRequestURLEncoded(HttpMethod.POST, URLAccessToken, args);

            if (!string.IsNullOrEmpty(response))
            {
                string token = HttpUtility.ParseQueryString(response)["access_token"];

                if (!string.IsNullOrEmpty(token))
                {
                    AuthInfo.Token = new OAuth2Token { access_token = token };
                    return true;
                }
            }

            return false;
        }

        private NameValueCollection GetAuthHeaders()
        {
            NameValueCollection headers = new NameValueCollection();
            headers.Add("Authorization", "Bearer " + AuthInfo.Token.access_token);
            return headers;
        }

        public override UploadResult ShortenURL(string url)
        {
            UploadResult result = new UploadResult { URL = url };

            if (!string.IsNullOrEmpty(url))
            {
                BitlyShortenRequestBody requestBody = new BitlyShortenRequestBody();
                requestBody.long_url = url;
                if (!string.IsNullOrEmpty(Domain)) requestBody.domain = Domain;
                string json = JsonConvert.SerializeObject(requestBody);

                NameValueCollection headers = GetAuthHeaders();

                result.Response = SendRequest(HttpMethod.POST, URLShorten, json, RequestHelpers.ContentTypeJSON, null, headers);

                BitlyShortenResponse responseData = JsonConvert.DeserializeObject<BitlyShortenResponse>(result.Response);

                if (responseData != null && !string.IsNullOrEmpty(responseData.link))
                {
                    result.ShortenedURL = responseData.link;
                }
            }

            return result;
        }

        private class BitlyShortenRequestBody
        {
            public string long_url { get; set; }
            public string domain { get; set; } = "bit.ly";
        }

        private class BitlyShortenResponse
        {
            public DateTime created_at { get; set; }
            public string id { get; set; }
            public string link { get; set; }
            public string long_url { get; set; }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CustomURLShortener.cs]---
Location: ShareX-develop/ShareX.UploadersLib/URLShorteners/CustomURLShortener.cs

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

namespace ShareX.UploadersLib.URLShorteners
{
    public class CustomURLShortenerService : URLShortenerService
    {
        public override UrlShortenerType EnumValue { get; } = UrlShortenerType.CustomURLShortener;

        public override bool CheckConfig(UploadersConfig config)
        {
            return config.CustomUploadersList != null && config.CustomUploadersList.IsValidIndex(config.CustomURLShortenerSelected);
        }

        public override URLShortener CreateShortener(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            int index;

            if (taskInfo.OverrideCustomUploader)
            {
                index = taskInfo.CustomUploaderIndex.BetweenOrDefault(0, config.CustomUploadersList.Count - 1);
            }
            else
            {
                index = config.CustomURLShortenerSelected;
            }

            CustomUploaderItem customUploader = config.CustomUploadersList.ReturnIfValidIndex(index);

            if (customUploader != null)
            {
                return new CustomURLShortener(customUploader);
            }

            return null;
        }
    }

    public sealed class CustomURLShortener : URLShortener
    {
        private CustomUploaderItem uploader;

        public CustomURLShortener(CustomUploaderItem customUploaderItem)
        {
            uploader = customUploaderItem;
        }

        public override UploadResult ShortenURL(string url)
        {
            UploadResult result = new UploadResult { URL = url };
            CustomUploaderInput input = new CustomUploaderInput("", url);

            if (uploader.Body == CustomUploaderBody.None)
            {
                result.Response = SendRequest(uploader.RequestMethod, uploader.GetRequestURL(input), null, uploader.GetHeaders(input));
            }
            else if (uploader.Body == CustomUploaderBody.MultipartFormData)
            {
                result.Response = SendRequestMultiPart(uploader.GetRequestURL(input), uploader.GetArguments(input), uploader.GetHeaders(input), null, uploader.RequestMethod);
            }
            else if (uploader.Body == CustomUploaderBody.FormURLEncoded)
            {
                result.Response = SendRequestURLEncoded(uploader.RequestMethod, uploader.GetRequestURL(input), uploader.GetArguments(input), uploader.GetHeaders(input));
            }
            else if (uploader.Body == CustomUploaderBody.JSON || uploader.Body == CustomUploaderBody.XML)
            {
                result.Response = SendRequest(uploader.RequestMethod, uploader.GetRequestURL(input), uploader.GetData(input), uploader.GetContentType(),
                    null, uploader.GetHeaders(input));
            }
            else
            {
                throw new Exception("Unsupported request format: " + uploader.Body);
            }

            uploader.TryParseResponse(result, LastResponseInfo, Errors, input, true);

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: FirebaseDynamicLinksURLShortener.cs]---
Location: ShareX-develop/ShareX.UploadersLib/URLShorteners/FirebaseDynamicLinksURLShortener.cs

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
using System.Windows.Forms;

namespace ShareX.UploadersLib.URLShorteners
{
    public class FirebaseDynamicLinksURLShortenerService : URLShortenerService
    {
        public override UrlShortenerType EnumValue { get; } = UrlShortenerType.FirebaseDynamicLinks;

        public override Icon ServiceIcon => Resources.Firebase;

        public override bool CheckConfig(UploadersConfig config)
        {
            return !string.IsNullOrEmpty(config.FirebaseWebAPIKey) && !string.IsNullOrEmpty(config.FirebaseDynamicLinkDomain);
        }

        public override URLShortener CreateShortener(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new FirebaseDynamicLinksURLShortener
            {
                WebAPIKey = config.FirebaseWebAPIKey,
                DynamicLinkDomain = config.FirebaseDynamicLinkDomain,
                IsShort = config.FirebaseIsShort
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpFirebaseDynamicLinks;
    }

    public class FirebaseRequest
    {
        public DynamicLinkInfo dynamicLinkInfo { get; set; }
        public FirebaseSuffix suffix { get; set; }
    }

    public class DynamicLinkInfo
    {
        public string dynamicLinkDomain { get; set; }
        public string link { get; set; }
    }

    public class FirebaseSuffix
    {
        public string option { get; set; }
    }

    public class FirebaseResponse
    {
        public string shortLink { get; set; }
        public string previewLink { get; set; }
    }

    public sealed class FirebaseDynamicLinksURLShortener : URLShortener
    {
        public string WebAPIKey { get; set; }
        public string DynamicLinkDomain { get; set; }
        public bool IsShort { get; set; }

        public override UploadResult ShortenURL(string url)
        {
            UploadResult result = new UploadResult { URL = url };

            FirebaseRequest requestOptions = new FirebaseRequest
            {
                dynamicLinkInfo = new DynamicLinkInfo
                {
                    dynamicLinkDomain = URLHelpers.RemovePrefixes(DynamicLinkDomain),
                    link = url
                }
            };

            if (IsShort)
            {
                requestOptions.suffix = new FirebaseSuffix
                {
                    option = "SHORT"
                };
            }

            Dictionary<string, string> args = new Dictionary<string, string>
            {
                { "key", WebAPIKey },
                { "fields", "shortLink" }
            };

            string serializedRequestOptions = JsonConvert.SerializeObject(requestOptions);
            result.Response = SendRequest(HttpMethod.POST, "https://firebasedynamiclinks.googleapis.com/v1/shortLinks", serializedRequestOptions, RequestHelpers.ContentTypeJSON, args);

            FirebaseResponse firebaseResponse = JsonConvert.DeserializeObject<FirebaseResponse>(result.Response);

            if (firebaseResponse != null)
            {
                result.ShortenedURL = firebaseResponse.shortLink;
            }

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: IsgdURLShortener.cs]---
Location: ShareX-develop/ShareX.UploadersLib/URLShorteners/IsgdURLShortener.cs

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

namespace ShareX.UploadersLib.URLShorteners
{
    public class IsgdURLShortenerService : URLShortenerService
    {
        public override UrlShortenerType EnumValue { get; } = UrlShortenerType.ISGD;

        public override bool CheckConfig(UploadersConfig config) => true;

        public override URLShortener CreateShortener(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new IsgdURLShortener();
        }
    }

    public class IsgdURLShortener : URLShortener
    {
        protected virtual string APIURL { get { return "http://is.gd/create.php"; } }

        public override UploadResult ShortenURL(string url)
        {
            UploadResult result = new UploadResult { URL = url };

            if (!string.IsNullOrEmpty(url))
            {
                Dictionary<string, string> arguments = new Dictionary<string, string>();
                arguments.Add("format", "simple");
                arguments.Add("url", url);

                result.Response = SendRequest(HttpMethod.GET, APIURL, arguments);

                if (!result.Response.StartsWith("Error:", StringComparison.OrdinalIgnoreCase))
                {
                    result.ShortenedURL = result.Response;
                }
            }

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: KuttURLShortener.cs]---
Location: ShareX-develop/ShareX.UploadersLib/URLShorteners/KuttURLShortener.cs

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
using System.Collections.Specialized;
using System.Drawing;
using System.Windows.Forms;

namespace ShareX.UploadersLib.URLShorteners
{
    public class KuttURLShortenerService : URLShortenerService
    {
        public override UrlShortenerType EnumValue { get; } = UrlShortenerType.Kutt;

        public override Image ServiceImage => Resources.Kutt;

        public override bool CheckConfig(UploadersConfig config)
        {
            return !string.IsNullOrEmpty(config.KuttSettings.APIKey);
        }

        public override URLShortener CreateShortener(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new KuttURLShortener(config.KuttSettings);
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpKutt;
    }

    public sealed class KuttURLShortener : URLShortener
    {
        public KuttSettings Settings { get; set; }

        public KuttURLShortener(KuttSettings settings)
        {
            Settings = settings;
        }

        public override UploadResult ShortenURL(string url)
        {
            UploadResult result = new UploadResult { URL = url };
            result.ShortenedURL = Submit(url);
            return result;
        }

        public string Submit(string url)
        {
            if (string.IsNullOrEmpty(Settings.Host))
            {
                Settings.Host = "https://kutt.it";
            }
            else
            {
                Settings.Host = URLHelpers.FixPrefix(Settings.Host);
            }

            string requestURL = URLHelpers.CombineURL(Settings.Host, "/api/v2/links");

            KuttShortenLinkBody body = new KuttShortenLinkBody()
            {
                target = url,
                password = Settings.Password,
                customurl = null,
                reuse = Settings.Reuse,
                domain = Settings.Domain
            };

            string json = JsonConvert.SerializeObject(body);

            NameValueCollection headers = new NameValueCollection();
            headers.Add("X-API-KEY", Settings.APIKey);

            string response = SendRequest(HttpMethod.POST, requestURL, json, RequestHelpers.ContentTypeJSON, headers: headers);

            if (!string.IsNullOrEmpty(response))
            {
                KuttShortenLinkResponse shortenLinkResponse = JsonConvert.DeserializeObject<KuttShortenLinkResponse>(response);

                if (shortenLinkResponse != null)
                {
                    return shortenLinkResponse.link;
                }
            }

            return null;
        }

        private class KuttShortenLinkBody
        {
            /// <summary>Original long URL to be shortened.</summary>
            public string target { get; set; }

            /// <summary>(optional) Set a password.</summary>
            public string password { get; set; }

            /// <summary>(optional) Set a custom URL.</summary>
            public string customurl { get; set; }

            /// <summary>(optional) If a URL with the specified target exists returns it, otherwise will send a new shortened URL.</summary>
            public bool reuse { get; set; }

            public string domain { get; set; }
        }

        private class KuttShortenLinkResponse
        {
            /// <summary>Unique ID of the URL</summary>
            public string id { get; set; }

            /// <summary>The shortened link</summary>
            public string link { get; set; }
        }
    }

    public class KuttSettings
    {
        public string Host { get; set; } = "https://kutt.it";
        [JsonEncrypt]
        public string APIKey { get; set; }
        [JsonEncrypt]
        public string Password { get; set; }
        public bool Reuse { get; set; }
        public string Domain { get; set; }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: NlcmURLShortener.cs]---
Location: ShareX-develop/ShareX.UploadersLib/URLShorteners/NlcmURLShortener.cs

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

namespace ShareX.UploadersLib.URLShorteners
{
    public sealed class NlcmURLShortener : URLShortener
    {
        public override UploadResult ShortenURL(string url)
        {
            UploadResult result = new UploadResult { URL = url };

            if (!string.IsNullOrEmpty(url))
            {
                Dictionary<string, string> arguments = new Dictionary<string, string>();
                arguments.Add("url", url);

                result.Response = result.ShortenedURL = SendRequest(HttpMethod.GET, "http://nl.cm/api/", arguments);
            }

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: PolrURLShortener.cs]---
Location: ShareX-develop/ShareX.UploadersLib/URLShorteners/PolrURLShortener.cs

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
using ShareX.UploadersLib.Properties;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;

namespace ShareX.UploadersLib.URLShorteners
{
    public class PolrURLShortenerService : URLShortenerService
    {
        public override UrlShortenerType EnumValue { get; } = UrlShortenerType.Polr;

        public override Icon ServiceIcon => Resources.Polr;

        public override bool CheckConfig(UploadersConfig config)
        {
            return !string.IsNullOrEmpty(config.PolrAPIHostname) && !string.IsNullOrEmpty(config.PolrAPIKey);
        }

        public override URLShortener CreateShortener(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new PolrURLShortener
            {
                Host = config.PolrAPIHostname,
                Key = config.PolrAPIKey,
                IsSecret = config.PolrIsSecret,
                UseAPIv1 = config.PolrUseAPIv1
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpPolr;
    }

    public sealed class PolrURLShortener : URLShortener
    {
        public string Host { get; set; }
        public string Key { get; set; }
        public bool IsSecret { get; set; }
        public bool UseAPIv1 { get; set; }

        public override UploadResult ShortenURL(string url)
        {
            UploadResult result = new UploadResult { URL = url };

            Host = URLHelpers.FixPrefix(Host);

            Dictionary<string, string> args = new Dictionary<string, string>();

            if (!string.IsNullOrEmpty(Key))
            {
                if (UseAPIv1)
                {
                    args.Add("apikey", Key);
                }
                else
                {
                    args.Add("key", Key);
                }
            }

            if (UseAPIv1)
            {
                args.Add("action", "shorten");
            }

            args.Add("url", url);

            if (IsSecret && !UseAPIv1)
            {
                args.Add("is_secret", "true");
            }

            string response = SendRequest(HttpMethod.GET, Host, args);

            if (!string.IsNullOrEmpty(response))
            {
                result.ShortenedURL = response;
            }

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: QRnetURLShortener.cs]---
Location: ShareX-develop/ShareX.UploadersLib/URLShorteners/QRnetURLShortener.cs

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
using System.Collections.Generic;

namespace ShareX.UploadersLib.URLShorteners
{
    public class QRnetURLShortenerService : URLShortenerService
    {
        public override UrlShortenerType EnumValue { get; } = UrlShortenerType.QRnet;

        public override bool CheckConfig(UploadersConfig config) => true;

        public override URLShortener CreateShortener(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new QRnetURLShortener();
        }
    }

    public sealed class QRnetURLShortener : URLShortener
    {
        private const string API_ENDPOINT = "http://qr.net/api/short";

        public override UploadResult ShortenURL(string url)
        {
            UploadResult result = new UploadResult { URL = url };

            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("longurl", url);

            string response = SendRequest(HttpMethod.GET, API_ENDPOINT, args);

            if (!string.IsNullOrEmpty(response))
            {
                QRnetURLShortenerResponse jsonResponse = JsonConvert.DeserializeObject<QRnetURLShortenerResponse>(response);

                if (jsonResponse != null)
                {
                    result.ShortenedURL = jsonResponse.url;
                }
            }

            return result;
        }
    }

    public class QRnetURLShortenerResponse
    {
        public string facebook_url { get; set; }
        public string stat_url { get; set; }
        public string twitter_url { get; set; }
        public string url { get; set; }
        public string target_host { get; set; }
        public string host { get; set; }
    }
}
```

--------------------------------------------------------------------------------

````
