---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 540
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 540 of 650)

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

---[FILE: APIKeys.cs]---
Location: ShareX-develop/ShareX.UploadersLib/APIKeys/APIKeys.cs

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

namespace ShareX.UploadersLib
{
    internal static partial class APIKeys
    {
        // Image uploaders
        public static readonly string ImgurClientID = "";
        public static readonly string ImgurClientSecret = "";
        public static readonly string ImageShackKey = "";
        public static readonly string FlickrKey = "";
        public static readonly string FlickrSecret = "";
        public static readonly string PhotobucketConsumerKey = "";
        public static readonly string PhotobucketConsumerSecret = "";

        // Text uploaders
        public static readonly string PastebinKey = "";
        public static readonly string GitHubID = "";
        public static readonly string GitHubSecret = "";
        public static readonly string Paste_eeApplicationKey = "";

        // File uploaders
        public static readonly string DropboxConsumerKey = "";
        public static readonly string DropboxConsumerSecret = "";
        public static readonly string BoxClientID = "";
        public static readonly string BoxClientSecret = "";
        public static readonly string SendSpaceKey = "";
        public static readonly string MediaFireAppId = "";
        public static readonly string MediaFireApiKey = "";
        public static readonly string OneDriveClientID = "";
        public static readonly string OneDriveClientSecret = "";

        // URL shorteners
        public static readonly string BitlyClientID = "";
        public static readonly string BitlyClientSecret = "";

        // Other services
        public static readonly string GoogleClientID = "";
        public static readonly string GoogleClientSecret = "";
    }
}
```

--------------------------------------------------------------------------------

---[FILE: FileUploaderService.cs]---
Location: ShareX-develop/ShareX.UploadersLib/BaseServices/FileUploaderService.cs

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

namespace ShareX.UploadersLib
{
    public abstract class FileUploaderService : UploaderService<FileDestination>, IGenericUploaderService
    {
        public abstract GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo);
    }
}
```

--------------------------------------------------------------------------------

---[FILE: IGenericUploaderService.cs]---
Location: ShareX-develop/ShareX.UploadersLib/BaseServices/IGenericUploaderService.cs

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

namespace ShareX.UploadersLib
{
    public interface IGenericUploaderService : IUploaderService
    {
        GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo);
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ImageUploaderService.cs]---
Location: ShareX-develop/ShareX.UploadersLib/BaseServices/ImageUploaderService.cs

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

namespace ShareX.UploadersLib
{
    public abstract class ImageUploaderService : UploaderService<ImageDestination>, IGenericUploaderService
    {
        public abstract GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo);
    }
}
```

--------------------------------------------------------------------------------

---[FILE: IUploaderService.cs]---
Location: ShareX-develop/ShareX.UploadersLib/BaseServices/IUploaderService.cs

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

namespace ShareX.UploadersLib
{
    public interface IUploaderService
    {
        string ServiceIdentifier { get; }

        string ServiceName { get; }

        Icon ServiceIcon { get; }

        Image ServiceImage { get; }

        bool CheckConfig(UploadersConfig config);

        TabPage GetUploadersConfigTabPage(UploadersConfigForm form);
    }
}
```

--------------------------------------------------------------------------------

---[FILE: TextUploaderService.cs]---
Location: ShareX-develop/ShareX.UploadersLib/BaseServices/TextUploaderService.cs

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

namespace ShareX.UploadersLib
{
    public abstract class TextUploaderService : UploaderService<TextDestination>, IGenericUploaderService
    {
        public abstract GenericUploader CreateUploader(UploadersConfig config, TaskReferenceHelper taskInfo);
    }
}
```

--------------------------------------------------------------------------------

---[FILE: UploaderService.cs]---
Location: ShareX-develop/ShareX.UploadersLib/BaseServices/UploaderService.cs

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
using System.Drawing;
using System.Windows.Forms;

namespace ShareX.UploadersLib
{
    public abstract class UploaderService<T> : IUploaderService
    {
        public abstract T EnumValue { get; }

        // Unique identifier
        public string ServiceIdentifier => EnumValue.ToString();

        public string ServiceName => ((Enum)(object)EnumValue).GetLocalizedDescription();

        public virtual Icon ServiceIcon { get; }

        public virtual Image ServiceImage { get; }

        public abstract bool CheckConfig(UploadersConfig config);

        public virtual TabPage GetUploadersConfigTabPage(UploadersConfigForm form)
        {
            return null;
        }

        public override string ToString()
        {
            return ServiceName;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: URLSharingService.cs]---
Location: ShareX-develop/ShareX.UploadersLib/BaseServices/URLSharingService.cs

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

namespace ShareX.UploadersLib
{
    public abstract class URLSharingService : UploaderService<URLSharingServices>
    {
        public abstract URLSharer CreateSharer(UploadersConfig config, TaskReferenceHelper taskInfo);
    }
}
```

--------------------------------------------------------------------------------

---[FILE: URLShortenerService.cs]---
Location: ShareX-develop/ShareX.UploadersLib/BaseServices/URLShortenerService.cs

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

namespace ShareX.UploadersLib
{
    public abstract class URLShortenerService : UploaderService<UrlShortenerType>
    {
        public abstract URLShortener CreateShortener(UploadersConfig config, TaskReferenceHelper taskInfo);
    }
}
```

--------------------------------------------------------------------------------

---[FILE: FileUploader.cs]---
Location: ShareX-develop/ShareX.UploadersLib/BaseUploaders/FileUploader.cs

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

using System.IO;

namespace ShareX.UploadersLib
{
    public abstract class FileUploader : GenericUploader
    {
        public UploadResult UploadFile(string filePath)
        {
            if (!string.IsNullOrEmpty(filePath) && File.Exists(filePath))
            {
                using (FileStream stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                {
                    return Upload(stream, Path.GetFileName(filePath));
                }
            }

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: GenericUploader.cs]---
Location: ShareX-develop/ShareX.UploadersLib/BaseUploaders/GenericUploader.cs

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

using System.IO;

namespace ShareX.UploadersLib
{
    public abstract class GenericUploader : Uploader
    {
        public abstract UploadResult Upload(Stream stream, string fileName);
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ImageUploader.cs]---
Location: ShareX-develop/ShareX.UploadersLib/BaseUploaders/ImageUploader.cs

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
using System.IO;

namespace ShareX.UploadersLib
{
    public abstract class ImageUploader : FileUploader
    {
        public UploadResult UploadImage(Image image, string fileName)
        {
            using (MemoryStream stream = new MemoryStream())
            {
                image.Save(stream, image.RawFormat);

                return Upload(stream, fileName);
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: TextUploader.cs]---
Location: ShareX-develop/ShareX.UploadersLib/BaseUploaders/TextUploader.cs

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

using System.IO;
using System.Text;

namespace ShareX.UploadersLib
{
    public abstract class TextUploader : GenericUploader
    {
        public override UploadResult Upload(Stream stream, string fileName)
        {
            using (StreamReader sr = new StreamReader(stream, Encoding.UTF8))
            {
                return UploadText(sr.ReadToEnd(), fileName);
            }
        }

        public abstract UploadResult UploadText(string text, string fileName);

        public UploadResult UploadTextFile(string filePath)
        {
            if (File.Exists(filePath))
            {
                using (FileStream stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                {
                    return Upload(stream, Path.GetFileName(filePath));
                }
            }

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

````
