---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:48Z
part: 650
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 650 of 650)

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

---[FILE: TinyURLShortener.cs]---
Location: ShareX-develop/ShareX.UploadersLib/URLShorteners/TinyURLShortener.cs

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
    public class TinyURLShortenerService : URLShortenerService
    {
        public override UrlShortenerType EnumValue { get; } = UrlShortenerType.TINYURL;

        public override bool CheckConfig(UploadersConfig config) => true;

        public override URLShortener CreateShortener(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new TinyURLShortener();
        }
    }

    public sealed class TinyURLShortener : URLShortener
    {
        public override UploadResult ShortenURL(string url)
        {
            UploadResult result = new UploadResult { URL = url };

            if (!string.IsNullOrEmpty(url))
            {
                Dictionary<string, string> arguments = new Dictionary<string, string>();
                arguments.Add("url", url);

                result.Response = result.ShortenedURL = SendRequest(HttpMethod.GET, "http://tinyurl.com/api-create.php", arguments);
            }

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: TurlURLShortener.cs]---
Location: ShareX-develop/ShareX.UploadersLib/URLShorteners/TurlURLShortener.cs

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
    public class TurlURLShortenerService : URLShortenerService
    {
        public override UrlShortenerType EnumValue { get; } = UrlShortenerType.TURL;

        public override bool CheckConfig(UploadersConfig config) => true;

        public override URLShortener CreateShortener(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new TurlURLShortener();
        }
    }

    public sealed class TurlURLShortener : URLShortener
    {
        public override UploadResult ShortenURL(string url)
        {
            UploadResult result = new UploadResult { URL = url };

            if (!string.IsNullOrEmpty(url))
            {
                Dictionary<string, string> arguments = new Dictionary<string, string>();
                arguments.Add("url", url);

                result.Response = SendRequest(HttpMethod.GET, "http://turl.ca/api.php", arguments);

                if (!string.IsNullOrEmpty(result.Response))
                {
                    if (result.Response.StartsWith("SUCCESS:"))
                    {
                        result.ShortenedURL = "http://turl.ca/" + result.Response.Substring(8);
                    }

                    if (result.Response.StartsWith("ERROR:"))
                    {
                        Errors.Add(result.Response.Substring(6));
                    }
                }
            }

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: TwoGPURLShortener.cs]---
Location: ShareX-develop/ShareX.UploadersLib/URLShorteners/TwoGPURLShortener.cs

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
    public class TwoGPURLShortenerService : URLShortenerService
    {
        public override UrlShortenerType EnumValue { get; } = UrlShortenerType.TwoGP;

        public override bool CheckConfig(UploadersConfig config) => true;

        public override URLShortener CreateShortener(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new TwoGPURLShortener();
        }
    }

    public sealed class TwoGPURLShortener : URLShortener
    {
        private const string API_ENDPOINT = "http://2.gp/api/short";

        public override UploadResult ShortenURL(string url)
        {
            UploadResult result = new UploadResult { URL = url };

            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("longurl", url);

            string response = SendRequest(HttpMethod.GET, API_ENDPOINT, args);

            if (!string.IsNullOrEmpty(response))
            {
                TwoGPURLShortenerResponse jsonResponse = JsonConvert.DeserializeObject<TwoGPURLShortenerResponse>(response);

                if (jsonResponse != null)
                {
                    result.ShortenedURL = jsonResponse.url;
                }
            }

            return result;
        }
    }

    public class TwoGPURLShortenerResponse
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

---[FILE: VgdURLShortener.cs]---
Location: ShareX-develop/ShareX.UploadersLib/URLShorteners/VgdURLShortener.cs

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

namespace ShareX.UploadersLib.URLShorteners
{
    public class VgdURLShortenerService : URLShortenerService
    {
        public override UrlShortenerType EnumValue { get; } = UrlShortenerType.VGD;

        public override bool CheckConfig(UploadersConfig config) => true;

        public override URLShortener CreateShortener(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new VgdURLShortener();
        }
    }

    public class VgdURLShortener : IsgdURLShortener
    {
        protected override string APIURL { get { return "http://v.gd/create.php"; } }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: VURLShortener.cs]---
Location: ShareX-develop/ShareX.UploadersLib/URLShorteners/VURLShortener.cs

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
    public class VURLShortenerService : URLShortenerService
    {
        public override UrlShortenerType EnumValue { get; } = UrlShortenerType.VURL;

        public override bool CheckConfig(UploadersConfig config) => true;

        public override URLShortener CreateShortener(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new VURLShortener();
        }
    }

    public sealed class VURLShortener : URLShortener
    {
        private const string API_ENDPOINT = "http://vurl.com/api.php";

        public override UploadResult ShortenURL(string url)
        {
            UploadResult result = new UploadResult { URL = url };

            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("url", url);

            string response = SendRequest(HttpMethod.GET, API_ENDPOINT, args);

            if (!string.IsNullOrEmpty(response) && response != "Invalid URL")
            {
                result.ShortenedURL = response;
            }

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: YourlsURLShortener.cs]---
Location: ShareX-develop/ShareX.UploadersLib/URLShorteners/YourlsURLShortener.cs

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
using System.Drawing;
using System.Windows.Forms;

namespace ShareX.UploadersLib.URLShorteners
{
    public class YourlsURLShortenerService : URLShortenerService
    {
        public override UrlShortenerType EnumValue { get; } = UrlShortenerType.YOURLS;

        public override Icon ServiceIcon => Resources.Yourls;

        public override bool CheckConfig(UploadersConfig config)
        {
            return !string.IsNullOrEmpty(config.YourlsAPIURL) && (!string.IsNullOrEmpty(config.YourlsSignature) ||
                (!string.IsNullOrEmpty(config.YourlsUsername) && !string.IsNullOrEmpty(config.YourlsPassword)));
        }

        public override URLShortener CreateShortener(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new YourlsURLShortener
            {
                APIURL = config.YourlsAPIURL,
                Signature = config.YourlsSignature,
                Username = config.YourlsUsername,
                Password = config.YourlsPassword
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpYourls;
    }

    public sealed class YourlsURLShortener : URLShortener
    {
        public string APIURL { get; set; }
        public string Signature { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }

        public override UploadResult ShortenURL(string url)
        {
            UploadResult result = new UploadResult { URL = url };

            if (!string.IsNullOrEmpty(url))
            {
                Dictionary<string, string> arguments = new Dictionary<string, string>();

                if (!string.IsNullOrEmpty(Signature))
                {
                    arguments.Add("signature", Signature);
                }
                else if (!string.IsNullOrEmpty(Username) && !string.IsNullOrEmpty(Password))
                {
                    arguments.Add("username", Username);
                    arguments.Add("password", Password);
                }
                else
                {
                    throw new Exception("Signature or Username/Password is missing.");
                }

                arguments.Add("action", "shorturl");
                arguments.Add("url", url);
                //arguments.Add("keyword", "");
                //arguments.Add("title", "");
                arguments.Add("format", "simple");

                result.Response = SendRequestMultiPart(APIURL, arguments);
                result.ShortenedURL = result.Response;
            }

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ZeroWidthURLShortener.cs]---
Location: ShareX-develop/ShareX.UploadersLib/URLShorteners/ZeroWidthURLShortener.cs

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
    public class ZeroWidthURLShortenerService : URLShortenerService
    {
        public override UrlShortenerType EnumValue { get; } = UrlShortenerType.ZeroWidthShortener;

        public override Image ServiceImage => Resources.ZeroWidthShortener;

        public override bool CheckConfig(UploadersConfig config) => true;

        public override URLShortener CreateShortener(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new ZeroWidthURLShortener()
            {
                RequestURL = config.ZeroWidthShortenerURL,
                Token = config.ZeroWidthShortenerToken
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpZeroWidthShortener;
    }

    public sealed class ZeroWidthURLShortener : URLShortener
    {
        public string RequestURL { get; set; }
        public string Token { get; set; }

        private NameValueCollection GetAuthHeaders()
        {
            if (!string.IsNullOrEmpty(Token))
            {
                NameValueCollection headers = new NameValueCollection();
                headers.Add("Authorization", "Bearer " + Token);
                return headers;
            }

            return null;
        }

        public override UploadResult ShortenURL(string url)
        {
            UploadResult result = new UploadResult { URL = url };

            string json = JsonConvert.SerializeObject(new
            {
                url = url
            });

            if (string.IsNullOrEmpty(RequestURL))
            {
                RequestURL = "https://api.zws.im";
            }

            NameValueCollection headers = GetAuthHeaders();

            string response = SendRequest(HttpMethod.POST, RequestURL, json, RequestHelpers.ContentTypeJSON, null, headers);

            if (!string.IsNullOrEmpty(response))
            {
                ZeroWidthURLShortenerResponse jsonResponse = JsonConvert.DeserializeObject<ZeroWidthURLShortenerResponse>(response);

                if (jsonResponse != null)
                {
                    if (!string.IsNullOrEmpty(jsonResponse.URL))
                    {
                        result.ShortenedURL = jsonResponse.URL;
                    }
                    else
                    {
                        result.ShortenedURL = URLHelpers.CombineURL("https://zws.im", jsonResponse.Short);
                    }
                }
            }

            return result;
        }
    }

    public class ZeroWidthURLShortenerResponse
    {
        public string Short { get; set; }
        public string URL { get; set; }
    }
}
```

--------------------------------------------------------------------------------

````
