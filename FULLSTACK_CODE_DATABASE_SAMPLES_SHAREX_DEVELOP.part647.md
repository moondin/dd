---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:48Z
part: 647
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 647 of 650)

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

---[FILE: CustomURLSharingService.cs]---
Location: ShareX-develop/ShareX.UploadersLib/SharingServices/CustomURLSharingService.cs

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

namespace ShareX.UploadersLib.SharingServices
{
    public class CustomURLSharingService : URLSharingService
    {
        public override URLSharingServices EnumValue { get; } = URLSharingServices.CustomURLSharingService;

        public override bool CheckConfig(UploadersConfig config)
        {
            return config.CustomUploadersList != null && config.CustomUploadersList.IsValidIndex(config.CustomURLSharingServiceSelected);
        }

        public override URLSharer CreateSharer(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            int index;

            if (taskInfo.OverrideCustomUploader)
            {
                index = taskInfo.CustomUploaderIndex.BetweenOrDefault(0, config.CustomUploadersList.Count - 1);
            }
            else
            {
                index = config.CustomURLSharingServiceSelected;
            }

            CustomUploaderItem customUploader = config.CustomUploadersList.ReturnIfValidIndex(index);

            if (customUploader != null)
            {
                return new CustomURLSharer(customUploader);
            }

            return null;
        }
    }

    public sealed class CustomURLSharer : URLSharer
    {
        private CustomUploaderItem uploader;

        public CustomURLSharer(CustomUploaderItem customUploaderItem)
        {
            uploader = customUploaderItem;
        }

        public override UploadResult ShareURL(string url)
        {
            UploadResult result = new UploadResult { URL = url, IsURLExpected = false };
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
                result.Response = SendRequest(uploader.RequestMethod, uploader.GetRequestURL(input), uploader.GetData(input), uploader.GetContentType(), null,
                    uploader.GetHeaders(input));
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

---[FILE: DeliciousSharingService.cs]---
Location: ShareX-develop/ShareX.UploadersLib/SharingServices/DeliciousSharingService.cs

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

namespace ShareX.UploadersLib.SharingServices
{
    public class DeliciousSharingService : SimpleURLSharingService
    {
        public override URLSharingServices EnumValue { get; } = URLSharingServices.Delicious;

        protected override string URLFormatString { get; } = "https://delicious.com/save?v=5&url={0}";
    }
}
```

--------------------------------------------------------------------------------

---[FILE: EmailSharingService.cs]---
Location: ShareX-develop/ShareX.UploadersLib/SharingServices/EmailSharingService.cs

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

using ShareX.UploadersLib.FileUploaders;
using System.Windows.Forms;

namespace ShareX.UploadersLib.SharingServices
{
    public class EmailSharingService : URLSharingService
    {
        public override URLSharingServices EnumValue { get; } = URLSharingServices.Email;

        public override bool CheckConfig(UploadersConfig config)
        {
            return !string.IsNullOrEmpty(config.EmailSmtpServer) && config.EmailSmtpPort > 0 && !string.IsNullOrEmpty(config.EmailFrom) && !string.IsNullOrEmpty(config.EmailPassword);
        }

        public override URLSharer CreateSharer(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new EmailSharer(config);
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpEmail;
    }

    public sealed class EmailSharer : URLSharer
    {
        private UploadersConfig config;

        public EmailSharer(UploadersConfig config)
        {
            this.config = config;
        }

        public override UploadResult ShareURL(string url)
        {
            UploadResult result = new UploadResult { URL = url, IsURLExpected = false };

            if (config.EmailAutomaticSend && !string.IsNullOrEmpty(config.EmailAutomaticSendTo))
            {
                Email email = new Email()
                {
                    SmtpServer = config.EmailSmtpServer,
                    SmtpPort = config.EmailSmtpPort,
                    FromEmail = config.EmailFrom,
                    Password = config.EmailPassword,
                    ToEmail = config.EmailAutomaticSendTo,
                    Subject = config.EmailDefaultSubject,
                    Body = url
                };

                email.Send();
            }
            else
            {
                using (EmailForm emailForm = new EmailForm(config.EmailRememberLastTo ? config.EmailLastTo : "", config.EmailDefaultSubject, url))
                {
                    if (emailForm.ShowDialog() == DialogResult.OK)
                    {
                        if (config.EmailRememberLastTo)
                        {
                            config.EmailLastTo = emailForm.ToEmail;
                        }

                        Email email = new Email()
                        {
                            SmtpServer = config.EmailSmtpServer,
                            SmtpPort = config.EmailSmtpPort,
                            FromEmail = config.EmailFrom,
                            Password = config.EmailPassword,
                            ToEmail = emailForm.ToEmail,
                            Subject = emailForm.Subject,
                            Body = emailForm.Body
                        };

                        email.Send();
                    }
                }
            }

            //URLHelpers.OpenURL("mailto:?body=" + URLHelpers.URLEncode(url));

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: FacebookSharingService.cs]---
Location: ShareX-develop/ShareX.UploadersLib/SharingServices/FacebookSharingService.cs

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

namespace ShareX.UploadersLib.SharingServices
{
    public class FacebookSharingService : SimpleURLSharingService
    {
        public override URLSharingServices EnumValue { get; } = URLSharingServices.Facebook;

        protected override string URLFormatString { get; } = "https://www.facebook.com/sharer/sharer.php?u={0}";
    }
}
```

--------------------------------------------------------------------------------

---[FILE: GoogleLensSharingService.cs]---
Location: ShareX-develop/ShareX.UploadersLib/SharingServices/GoogleLensSharingService.cs

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

namespace ShareX.UploadersLib.SharingServices
{
    public class GoogleLensSharingService : SimpleURLSharingService
    {
        public override URLSharingServices EnumValue { get; } = URLSharingServices.GoogleImageSearch;

        protected override string URLFormatString { get; } = "https://lens.google.com/uploadbyurl?url={0}";
    }
}
```

--------------------------------------------------------------------------------

---[FILE: LinkedInSharingService.cs]---
Location: ShareX-develop/ShareX.UploadersLib/SharingServices/LinkedInSharingService.cs

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

namespace ShareX.UploadersLib.SharingServices
{
    public class LinkedInSharingService : SimpleURLSharingService
    {
        public override URLSharingServices EnumValue { get; } = URLSharingServices.LinkedIn;

        protected override string URLFormatString { get; } = "https://www.linkedin.com/shareArticle?url={0}";
    }
}
```

--------------------------------------------------------------------------------

---[FILE: PinterestSharingService.cs]---
Location: ShareX-develop/ShareX.UploadersLib/SharingServices/PinterestSharingService.cs

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

namespace ShareX.UploadersLib.SharingServices
{
    public class PinterestSharingService : SimpleURLSharingService
    {
        public override URLSharingServices EnumValue { get; } = URLSharingServices.Pinterest;

        protected override string URLFormatString { get; } = "http://pinterest.com/pin/create/button/?url={0}&media={0}";
    }
}
```

--------------------------------------------------------------------------------

---[FILE: PushbulletSharingService.cs]---
Location: ShareX-develop/ShareX.UploadersLib/SharingServices/PushbulletSharingService.cs

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
using ShareX.UploadersLib.FileUploaders;
using System.Windows.Forms;

namespace ShareX.UploadersLib.SharingServices
{
    public class PushbulletSharingService : URLSharingService
    {
        public override URLSharingServices EnumValue { get; } = URLSharingServices.Pushbullet;

        public override bool CheckConfig(UploadersConfig config)
        {
            PushbulletSettings pushbulletSettings = config.PushbulletSettings;

            return pushbulletSettings != null && !string.IsNullOrEmpty(pushbulletSettings.UserAPIKey) && pushbulletSettings.DeviceList != null &&
                pushbulletSettings.DeviceList.IsValidIndex(pushbulletSettings.SelectedDevice);
        }

        public override URLSharer CreateSharer(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new PushbulletSharer(config.PushbulletSettings);
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpPushbullet;
    }

    public sealed class PushbulletSharer : URLSharer
    {
        public PushbulletSettings Settings { get; private set; }

        public PushbulletSharer(PushbulletSettings settings)
        {
            Settings = settings;
        }

        public override UploadResult ShareURL(string url)
        {
            UploadResult result = new UploadResult { URL = url, IsURLExpected = false };

            new Pushbullet(Settings).PushLink(url, "ShareX: URL share");

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: RedditSharingService.cs]---
Location: ShareX-develop/ShareX.UploadersLib/SharingServices/RedditSharingService.cs

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

namespace ShareX.UploadersLib.SharingServices
{
    public class RedditSharingService : SimpleURLSharingService
    {
        public override URLSharingServices EnumValue { get; } = URLSharingServices.Reddit;

        protected override string URLFormatString { get; } = "http://www.reddit.com/submit?url={0}";
    }
}
```

--------------------------------------------------------------------------------

---[FILE: SimpleURLSharingService.cs]---
Location: ShareX-develop/ShareX.UploadersLib/SharingServices/SimpleURLSharingService.cs

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

namespace ShareX.UploadersLib.SharingServices
{
    public abstract class SimpleURLSharingService : URLSharingService
    {
        protected abstract string URLFormatString { get; }

        public override URLSharer CreateSharer(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new SimpleURLSharer(URLFormatString);
        }

        public override bool CheckConfig(UploadersConfig config) => true;
    }

    public sealed class SimpleURLSharer : URLSharer
    {
        public string URLFormatString { get; private set; }

        public SimpleURLSharer(string urlFormatString)
        {
            URLFormatString = urlFormatString;
        }

        public override UploadResult ShareURL(string url)
        {
            UploadResult result = new UploadResult { URL = url, IsURLExpected = false };

            string encodedURL = URLHelpers.URLEncode(url);
            string resultURL = string.Format(URLFormatString, encodedURL);
            URLHelpers.OpenURL(resultURL);

            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: StumbleUponSharingService.cs]---
Location: ShareX-develop/ShareX.UploadersLib/SharingServices/StumbleUponSharingService.cs

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

namespace ShareX.UploadersLib.SharingServices
{
    public class StumbleUponSharingService : SimpleURLSharingService
    {
        public override URLSharingServices EnumValue { get; } = URLSharingServices.StumbleUpon;

        protected override string URLFormatString { get; } = "http://www.stumbleupon.com/submit?url={0}";
    }
}
```

--------------------------------------------------------------------------------

---[FILE: TumblrSharingService.cs]---
Location: ShareX-develop/ShareX.UploadersLib/SharingServices/TumblrSharingService.cs

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

namespace ShareX.UploadersLib.SharingServices
{
    public class TumblrSharingService : SimpleURLSharingService
    {
        public override URLSharingServices EnumValue { get; } = URLSharingServices.Tumblr;

        protected override string URLFormatString { get; } = "https://www.tumblr.com/share?v=3&u={0}";
    }
}
```

--------------------------------------------------------------------------------

---[FILE: VkSharingService.cs]---
Location: ShareX-develop/ShareX.UploadersLib/SharingServices/VkSharingService.cs

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

namespace ShareX.UploadersLib.SharingServices
{
    public class VkSharingService : SimpleURLSharingService
    {
        public override URLSharingServices EnumValue { get; } = URLSharingServices.VK;

        protected override string URLFormatString { get; } = "http://vk.com/share.php?url={0}";
    }
}
```

--------------------------------------------------------------------------------

---[FILE: CustomTextUploader.cs]---
Location: ShareX-develop/ShareX.UploadersLib/TextUploaders/CustomTextUploader.cs

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
using System.Text;

namespace ShareX.UploadersLib.TextUploaders
{
    public class CustomTextUploaderService : TextUploaderService
    {
        public override TextDestination EnumValue { get; } = TextDestination.CustomTextUploader;

        public override bool CheckConfig(UploadersConfig config)
        {
            return config.CustomUploadersList != null && config.CustomUploadersList.IsValidIndex(config.CustomTextUploaderSelected);
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
                index = config.CustomTextUploaderSelected;
            }

            CustomUploaderItem customUploader = config.CustomUploadersList.ReturnIfValidIndex(index);

            if (customUploader != null)
            {
                return new CustomTextUploader(customUploader);
            }

            return null;
        }
    }

    public sealed class CustomTextUploader : TextUploader
    {
        private CustomUploaderItem uploader;

        public CustomTextUploader(CustomUploaderItem customUploaderItem)
        {
            uploader = customUploaderItem;
        }

        public override UploadResult UploadText(string text, string fileName)
        {
            UploadResult result = new UploadResult();
            CustomUploaderInput input = new CustomUploaderInput(fileName, text);

            if (uploader.Body == CustomUploaderBody.None)
            {
                result.Response = SendRequest(uploader.RequestMethod, uploader.GetRequestURL(input), null, uploader.GetHeaders(input));
            }
            else if (uploader.Body == CustomUploaderBody.MultipartFormData)
            {
                if (string.IsNullOrEmpty(uploader.FileFormName))
                {
                    result.Response = SendRequestMultiPart(uploader.GetRequestURL(input), uploader.GetArguments(input), uploader.GetHeaders(input),
                        null, uploader.RequestMethod);
                }
                else
                {
                    byte[] bytes = Encoding.UTF8.GetBytes(text);
                    using (MemoryStream stream = new MemoryStream(bytes))
                    {
                        result = SendRequestFile(uploader.GetRequestURL(input), stream, fileName, uploader.GetFileFormName(), uploader.GetArguments(input),
                            uploader.GetHeaders(input), null, uploader.RequestMethod);
                    }
                }
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
            else if (uploader.Body == CustomUploaderBody.Binary)
            {
                byte[] bytes = Encoding.UTF8.GetBytes(text);
                using (MemoryStream stream = new MemoryStream(bytes))
                {
                    result.Response = SendRequest(uploader.RequestMethod, uploader.GetRequestURL(input), stream, MimeTypes.GetMimeTypeFromFileName(fileName),
                        null, uploader.GetHeaders(input));
                }
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

---[FILE: GitHubGist.cs]---
Location: ShareX-develop/ShareX.UploadersLib/TextUploaders/GitHubGist.cs

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
using System.Collections.Specialized;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Windows.Forms;

namespace ShareX.UploadersLib.TextUploaders
{
    public class GitHubGistTextUploaderService : TextUploaderService
    {
        public override TextDestination EnumValue { get; } = TextDestination.Gist;

        public override Icon ServiceIcon => Resources.GitHub;

        public override bool CheckConfig(UploadersConfig config)
        {
            return OAuth2Info.CheckOAuth(config.GistOAuth2Info);
        }

        public override GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo)
        {
            return new GitHubGist(config.GistOAuth2Info)
            {
                PublicUpload = config.GistPublishPublic,
                RawURL = config.GistRawURL,
                CustomURLAPI = config.GistCustomURL
            };
        }

        public override TabPage GetUploadersConfigTabPage(UploadersConfigForm form) => form.tpGist;
    }

    public sealed class GitHubGist : TextUploader, IOAuth2Basic
    {
        private const string URLAPI = "https://api.github.com";

        public OAuth2Info AuthInfo { get; private set; }

        public bool PublicUpload { get; set; }
        public bool RawURL { get; set; }
        public string CustomURLAPI { get; set; }

        public GitHubGist(OAuth2Info oAuthInfos)
        {
            AuthInfo = oAuthInfos;
        }

        public string GetAuthorizationURL()
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("client_id", AuthInfo.Client_ID);
            args.Add("redirect_uri", Links.Callback);
            args.Add("scope", "gist");

            return URLHelpers.CreateQueryString("https://github.com/login/oauth/authorize", args);
        }

        public bool GetAccessToken(string code)
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("client_id", AuthInfo.Client_ID);
            args.Add("client_secret", AuthInfo.Client_Secret);
            args.Add("code", code);

            WebHeaderCollection headers = new WebHeaderCollection();
            headers.Add("Accept", RequestHelpers.ContentTypeJSON);

            string response = SendRequestMultiPart("https://github.com/login/oauth/access_token", args, headers);

            if (!string.IsNullOrEmpty(response))
            {
                OAuth2Token token = JsonConvert.DeserializeObject<OAuth2Token>(response);

                if (token != null && !string.IsNullOrEmpty(token.access_token))
                {
                    AuthInfo.Token = token;
                    return true;
                }
            }

            return false;
        }

        public override UploadResult UploadText(string text, string fileName)
        {
            UploadResult ur = new UploadResult();

            if (!string.IsNullOrEmpty(text) && !string.IsNullOrEmpty(fileName))
            {
                string url;

                if (!string.IsNullOrEmpty(CustomURLAPI))
                {
                    url = CustomURLAPI;
                }
                else
                {
                    url = URLAPI;
                }

                url = URLHelpers.CombineURL(url, "gists");

                GistUpload gistUpload = new GistUpload()
                {
                    description = "",
                    @public = PublicUpload,
                    files = new Dictionary<string, GistUploadFileInfo>()
                    {
                        { fileName, new GistUploadFileInfo() { content = text } }
                    }
                };

                string json = JsonConvert.SerializeObject(gistUpload);

                NameValueCollection headers = new NameValueCollection();
                headers.Add("Authorization", "token " + AuthInfo.Token.access_token);

                string response = SendRequest(HttpMethod.POST, url, json, RequestHelpers.ContentTypeJSON, null, headers);

                GistResponse gistResponse = JsonConvert.DeserializeObject<GistResponse>(response);

                if (response != null)
                {
                    if (RawURL)
                    {
                        ur.URL = gistResponse.files.First().Value.raw_url;
                    }
                    else
                    {
                        ur.URL = gistResponse.html_url;
                    }
                }
            }

            return ur;
        }

        private class GistUpload
        {
            public string description { get; set; }
            public bool @public { get; set; }
            public Dictionary<string, GistUploadFileInfo> files { get; set; }
        }

        private class GistUploadFileInfo
        {
            public string content { get; set; }
        }

        private class GistResponse
        {
            public string html_url { get; set; }
            public Dictionary<string, GistResponseFileInfo> files { get; set; }
        }

        private class GistResponseFileInfo
        {
            public string filename { get; set; }
            public string raw_url { get; set; }
        }
    }
}
```

--------------------------------------------------------------------------------

````
