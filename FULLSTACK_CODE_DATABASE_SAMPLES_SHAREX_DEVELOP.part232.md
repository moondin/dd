---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 232
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 232 of 650)

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

---[FILE: FileDownloader.cs]---
Location: ShareX-develop/ShareX.HelpersLib/FileDownloader.cs

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
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

namespace ShareX.HelpersLib
{
    public class FileDownloader
    {
        public event Action FileSizeReceived;
        public event Action ProgressChanged;

        public string URL { get; set; }
        public string DownloadLocation { get; set; }
        public string AcceptHeader { get; set; }

        public bool IsDownloading { get; private set; }
        public bool IsCanceled { get; private set; }
        public long FileSize { get; private set; } = -1;
        public long DownloadedSize { get; private set; }
        public double DownloadSpeed { get; private set; }

        public double DownloadPercentage
        {
            get
            {
                if (FileSize > 0)
                {
                    return (double)DownloadedSize / FileSize * 100;
                }

                return 0;
            }
        }

        private const int bufferSize = 32768;

        public FileDownloader()
        {
        }

        public FileDownloader(string url, string downloadLocation)
        {
            URL = url;
            DownloadLocation = downloadLocation;
        }

        public async Task<bool> StartDownload()
        {
            if (!IsDownloading && !string.IsNullOrEmpty(URL))
            {
                IsDownloading = true;
                IsCanceled = false;
                FileSize = -1;
                DownloadedSize = 0;
                DownloadSpeed = 0;

                return await DoWork();
            }

            return false;
        }

        public void StopDownload()
        {
            IsCanceled = true;
        }

        private async Task<bool> DoWork()
        {
            try
            {
                HttpClient client = HttpClientFactory.Create();

                using (HttpRequestMessage requestMessage = new HttpRequestMessage(HttpMethod.Get, URL))
                {
                    if (!string.IsNullOrEmpty(AcceptHeader))
                    {
                        requestMessage.Headers.Accept.ParseAdd(AcceptHeader);
                    }

                    using (HttpResponseMessage responseMessage = await client.SendAsync(requestMessage, HttpCompletionOption.ResponseHeadersRead))
                    {
                        responseMessage.EnsureSuccessStatusCode();

                        FileSize = responseMessage.Content.Headers.ContentLength ?? -1;

                        FileSizeReceived?.Invoke();

                        if (FileSize > 0)
                        {
                            Stopwatch timer = new Stopwatch();
                            Stopwatch progressEventTimer = new Stopwatch();
                            long speedTest = 0;

                            byte[] buffer = new byte[(int)Math.Min(bufferSize, FileSize)];
                            int bytesRead;

                            using (Stream responseStream = await responseMessage.Content.ReadAsStreamAsync())
                            using (FileStream fileStream = new FileStream(DownloadLocation, FileMode.Create, FileAccess.Write, FileShare.Read))
                            {
                                while (DownloadedSize < FileSize && !IsCanceled)
                                {
                                    if (!timer.IsRunning)
                                    {
                                        timer.Start();
                                    }

                                    if (!progressEventTimer.IsRunning)
                                    {
                                        progressEventTimer.Start();
                                    }

                                    bytesRead = await responseStream.ReadAsync(buffer, 0, buffer.Length);
                                    await fileStream.WriteAsync(buffer, 0, bytesRead);

                                    DownloadedSize += bytesRead;
                                    speedTest += bytesRead;

                                    if (timer.ElapsedMilliseconds > 500)
                                    {
                                        DownloadSpeed = (double)speedTest / timer.ElapsedMilliseconds * 1000;
                                        speedTest = 0;
                                        timer.Reset();
                                    }

                                    if (progressEventTimer.ElapsedMilliseconds > 100)
                                    {
                                        ProgressChanged?.Invoke();

                                        progressEventTimer.Reset();
                                    }
                                }

                                ProgressChanged?.Invoke();
                            }

                            return true;
                        }
                    }
                }
            }
            catch
            {
                if (!IsCanceled)
                {
                    throw;
                }
            }
            finally
            {
                if (IsCanceled)
                {
                    try
                    {
                        if (File.Exists(DownloadLocation))
                        {
                            File.Delete(DownloadLocation);
                        }
                    }
                    catch
                    {
                    }
                }

                IsDownloading = false;
            }

            return false;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: FixedSizedQueue.cs]---
Location: ShareX-develop/ShareX.HelpersLib/FixedSizedQueue.cs

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

namespace ShareX.HelpersLib
{
    public class FixedSizedQueue<T> : Queue<T>
    {
        public int Size { get; private set; }

        public FixedSizedQueue(int size)
        {
            Size = size;
        }

        public new void Enqueue(T obj)
        {
            base.Enqueue(obj);

            while (Count > Size)
            {
                Dequeue();
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: FontSafe.cs]---
Location: ShareX-develop/ShareX.HelpersLib/FontSafe.cs

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

namespace ShareX.HelpersLib
{
    public class FontSafe
    {
        public string Font { get; set; }

        public FontSafe()
        {
        }

        public FontSafe(Font font)
        {
            SetFont(font);
        }

        public void SetFont(Font font)
        {
            Font = new FontConverter().ConvertToInvariantString(font);
        }

        public Font GetFont()
        {
            if (!string.IsNullOrEmpty(Font))
            {
                return new FontConverter().ConvertFromInvariantString(Font) as Font;
            }

            return null;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: FPSManager.cs]---
Location: ShareX-develop/ShareX.HelpersLib/FPSManager.cs

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
using System.Threading;

namespace ShareX.HelpersLib
{
    public class FPSManager
    {
        public event Action FPSUpdated;

        public int FPS { get; private set; }
        public int FPSLimit { get; set; }

        private int frameCount;
        private Stopwatch fpsTimer, frameTimer;

        public FPSManager()
        {
            fpsTimer = new Stopwatch();
            frameTimer = new Stopwatch();
        }

        public FPSManager(int fpsLimit) : this()
        {
            FPSLimit = fpsLimit;
        }

        protected void OnFPSUpdated()
        {
            FPSUpdated?.Invoke();
        }

        public void Update()
        {
            frameCount++;

            if (!fpsTimer.IsRunning)
            {
                fpsTimer.Start();
            }
            else if (fpsTimer.ElapsedMilliseconds >= 1000)
            {
                FPS = (int)Math.Round(frameCount / fpsTimer.Elapsed.TotalSeconds);

                OnFPSUpdated();

                frameCount = 0;
                fpsTimer.Restart();
            }

            if (FPSLimit > 0)
            {
                if (!frameTimer.IsRunning)
                {
                    frameTimer.Start();
                }
                else
                {
                    double currentFrameDuration = frameTimer.Elapsed.TotalMilliseconds;
                    double targetFrameDuration = 1000d / FPSLimit;

                    if (currentFrameDuration < targetFrameDuration)
                    {
                        int sleepDuration = (int)Math.Round(targetFrameDuration - currentFrameDuration);

                        if (sleepDuration > 0)
                        {
                            Thread.Sleep(sleepDuration);
                        }
                    }

                    frameTimer.Restart();
                }
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: GraphicsQualityManager.cs]---
Location: ShareX-develop/ShareX.HelpersLib/GraphicsQualityManager.cs

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
using System.Drawing.Drawing2D;

namespace ShareX.HelpersLib
{
    public class GraphicsQualityManager : IDisposable
    {
        private CompositingQuality previousCompositingQuality;
        private InterpolationMode previousInterpolationMode;
        private SmoothingMode previousSmoothingMode;
        private PixelOffsetMode previousPixelOffsetMode;
        private Graphics g;

        public GraphicsQualityManager(Graphics g, bool highQuality)
        {
            this.g = g;

            previousCompositingQuality = g.CompositingQuality;
            previousInterpolationMode = g.InterpolationMode;
            previousSmoothingMode = g.SmoothingMode;
            previousPixelOffsetMode = g.PixelOffsetMode;

            if (highQuality)
            {
                SetHighQuality();
            }
            else
            {
                SetLowQuality();
            }
        }

        public void SetHighQuality()
        {
            if (g != null)
            {
                g.CompositingQuality = CompositingQuality.HighQuality;
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.SmoothingMode = SmoothingMode.HighQuality;
            }
        }

        public void SetLowQuality()
        {
            if (g != null)
            {
                g.CompositingQuality = CompositingQuality.HighSpeed;
                g.InterpolationMode = InterpolationMode.NearestNeighbor;
                g.SmoothingMode = SmoothingMode.HighSpeed;
                g.PixelOffsetMode = PixelOffsetMode.HighSpeed;
            }
        }

        public void Dispose()
        {
            if (g != null)
            {
                g.CompositingQuality = previousCompositingQuality;
                g.InterpolationMode = previousInterpolationMode;
                g.SmoothingMode = previousSmoothingMode;
                g.PixelOffsetMode = previousPixelOffsetMode;
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: HelpersOptions.cs]---
Location: ShareX-develop/ShareX.HelpersLib/HelpersOptions.cs

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
using System.Drawing;

namespace ShareX.HelpersLib
{
    public static class HelpersOptions
    {
        public const int RecentColorsMax = 32;

        public static ProxyInfo CurrentProxy { get; set; } = new ProxyInfo();
        public static bool DefaultCopyImageFillBackground { get; set; } = true;
        public static bool UseAlternativeClipboardCopyImage { get; set; } = false;
        public static bool UseAlternativeClipboardGetImage { get; set; } = false;
        public static bool RotateImageByExifOrientationData { get; set; } = true;
        public static string BrowserPath { get; set; } = "";
        public static List<Color> RecentColors { get; set; } = new List<Color>();
        public static string LastSaveDirectory { get; set; } = "";
        public static bool URLEncodeIgnoreEmoji { get; set; } = false;
        public static Dictionary<string, string> ShareXSpecialFolders { get; set; } = new Dictionary<string, string>();
        public static bool DevMode { get; set; } = false;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: HttpClientFactory.cs]---
Location: ShareX-develop/ShareX.HelpersLib/HttpClientFactory.cs

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

using System.Net.Http;
using System.Net.Http.Headers;

namespace ShareX.HelpersLib
{
    public static class HttpClientFactory
    {
        private static readonly object lockObject = new object();

        private static HttpClient client;

        public static HttpClient Create()
        {
            if (client == null)
            {
                lock (lockObject)
                {
                    if (client == null)
                    {
                        HttpClientHandler clientHandler = new HttpClientHandler()
                        {
                            Proxy = HelpersOptions.CurrentProxy.GetWebProxy()
                        };

                        client = new HttpClient(clientHandler);
                        client.DefaultRequestHeaders.UserAgent.ParseAdd(ShareXResources.UserAgent);
                        client.DefaultRequestHeaders.CacheControl = new CacheControlHeaderValue()
                        {
                            NoCache = true
                        };
                    }
                }
            }

            return client;
        }

        public static void Reset()
        {
            lock (lockObject)
            {
                if (client != null)
                {
                    client.Dispose();
                    client = null;
                }
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ImageFilesCache.cs]---
Location: ShareX-develop/ShareX.HelpersLib/ImageFilesCache.cs

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

namespace ShareX.HelpersLib
{
    public class ImageFilesCache : IDisposable
    {
        private Dictionary<string, Bitmap> images = new Dictionary<string, Bitmap>();

        public Bitmap GetImage(string filePath)
        {
            Bitmap bmp = null;

            if (!string.IsNullOrEmpty(filePath))
            {
                if (images.ContainsKey(filePath))
                {
                    return images[filePath];
                }

                bmp = ImageHelpers.LoadImage(filePath);

                if (bmp != null)
                {
                    images.Add(filePath, bmp);
                }
            }

            return bmp;
        }

        public Bitmap GetFileIconAsImage(string filePath, bool isSmallIcon = true)
        {
            Bitmap bmp = null;

            if (!string.IsNullOrEmpty(filePath))
            {
                if (images.ContainsKey(filePath))
                {
                    return images[filePath];
                }

                using (Icon icon = NativeMethods.GetFileIcon(filePath, isSmallIcon))
                {
                    if (icon != null && icon.Width > 0 && icon.Height > 0)
                    {
                        bmp = icon.ToBitmap();

                        if (bmp != null)
                        {
                            images.Add(filePath, bmp);
                        }
                    }
                }
            }

            return bmp;
        }

        public void Clear()
        {
            if (images != null)
            {
                Dispose();

                images.Clear();
            }
        }

        public void Dispose()
        {
            if (images != null)
            {
                foreach (Bitmap bmp in images.Values)
                {
                    if (bmp != null)
                    {
                        bmp.Dispose();
                    }
                }
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Links.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Links.cs

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
    public static class Links
    {
        public const string Website = "https://getsharex.com";
        public const string Callback = Website + "/callback/";
        public const string Changelog = Website + "/changelog";
        public const string Donate = Website + "/donate";
        public const string PrivacyPolicy = Website + "/privacy-policy";
        public const string ImageEffects = Website + "/image-effects";
        public const string Actions = Website + "/actions";
        private const string Docs = Website + "/docs";
        public const string DocsCustomUploader = Docs + "/custom-uploader";
        public const string DocsKeybinds = Docs + "/keybinds";
        public const string DocsOCR = Docs + "/ocr";
        public const string DocsScrollingScreenshot = Docs + "/scrolling-screenshot";

        public const string GitHub = "https://github.com/ShareX/ShareX";
        public const string GitHubIssues = GitHub + "/issues?q=is%3Aissue";
        public const string Jaex = "https://github.com/Jaex";
        public const string McoreD = "https://github.com/McoreD";
        public const string Discord = "https://discord.gg/ShareX";
        public const string X = "https://x.com/ShareX";
        public const string XFollow = "https://x.com/intent/follow?screen_name=ShareX";
        public const string Reddit = "https://www.reddit.com/r/sharex";
        public const string Steam = "https://store.steampowered.com/app/400040/ShareX/";
        public const string MicrosoftStore = "https://apps.microsoft.com/detail/9nblggh4z1sp";
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ListViewColumnSorter.cs]---
Location: ShareX-develop/ShareX.HelpersLib/ListViewColumnSorter.cs

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
using System.Collections;
using System.Windows.Forms;

namespace ShareX.HelpersLib
{
    /// <summary>
    /// This class is an implementation of the 'IComparer' interface.
    /// </summary>
    public class ListViewColumnSorter : IComparer
    {
        /// <summary>
        /// Specifies the column to be sorted
        /// </summary>
        private int ColumnToSort;
        /// <summary>
        /// Specifies the order in which to sort (i.e. 'Ascending').
        /// </summary>
        private SortOrder OrderOfSort;
        /// <summary>
        /// Specifies whether to sort as a date
        /// </summary>
        public bool SortByDate { get; set; }
        /// <summary>
        /// Case insensitive comparer object
        /// </summary>
        private CaseInsensitiveComparer ObjectCompare;

        /// <summary>
        /// Class constructor.  Initializes various elements
        /// </summary>
        public ListViewColumnSorter()
        {
            // Initialize the column to '0'
            ColumnToSort = 0;

            // Initialize the sort order to 'none'
            OrderOfSort = SortOrder.None;

            SortByDate = false;

            // Initialize the CaseInsensitiveComparer object
            ObjectCompare = new CaseInsensitiveComparer();
        }

        /// <summary>
        /// This method is inherited from the IComparer interface.  It compares the two objects passed using a case insensitive comparison.
        /// </summary>
        /// <param name="x">First object to be compared</param>
        /// <param name="y">Second object to be compared</param>
        /// <returns>The result of the comparison. "0" if equal, negative if 'x' is less than 'y' and positive if 'x' is greater than 'y'</returns>
        public int Compare(object x, object y)
        {
            int compareResult;
            ListViewItem listviewX, listviewY;

            // Cast the objects to be compared to ListViewItem objects
            listviewX = (ListViewItem)x;
            listviewY = (ListViewItem)y;

            // Compare the two items
            if (SortByDate)
            {
                compareResult = DateTime.Compare((DateTime)listviewX.SubItems[ColumnToSort].Tag, (DateTime)listviewY.SubItems[ColumnToSort].Tag);
            }
            else
            {
                compareResult = ObjectCompare.Compare(listviewX.SubItems[ColumnToSort].Text, listviewY.SubItems[ColumnToSort].Text);
            }

            // Calculate correct return value based on object comparison
            if (OrderOfSort == SortOrder.Ascending)
            {
                // Ascending sort is selected, return normal result of compare operation
                return compareResult;
            }
            else if (OrderOfSort == SortOrder.Descending)
            {
                // Descending sort is selected, return negative result of compare operation
                return -compareResult;
            }
            else
            {
                // Return '0' to indicate they are equal
                return 0;
            }
        }

        /// <summary>
        /// Gets or sets the number of the column to which to apply the sorting operation (Defaults to '0').
        /// </summary>
        public int SortColumn
        {
            set
            {
                ColumnToSort = value;
            }
            get
            {
                return ColumnToSort;
            }
        }

        /// <summary>
        /// Gets or sets the order of sorting to apply (for example, 'Ascending' or 'Descending').
        /// </summary>
        public SortOrder Order
        {
            set
            {
                OrderOfSort = value;
            }
            get
            {
                return OrderOfSort;
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: Logger.cs]---
Location: ShareX-develop/ShareX.HelpersLib/Logger.cs

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
using System.Collections.Concurrent;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace ShareX.HelpersLib
{
    public class Logger
    {
        public delegate void MessageAddedEventHandler(string message);

        public event MessageAddedEventHandler MessageAdded;

        public string MessageFormat { get; set; } = "{0:yyyy-MM-dd HH:mm:ss.fff} - {1}";
        public bool AsyncWrite { get; set; } = true;
        public bool DebugWrite { get; set; } = true;
        public bool StringWrite { get; set; } = true;
        public bool FileWrite { get; set; } = false;
        public string LogFilePath { get; private set; }

        private readonly object loggerLock = new object();
        private ConcurrentQueue<string> messageQueue = new ConcurrentQueue<string>();
        private StringBuilder sbMessages = new StringBuilder();

        public Logger()
        {
        }

        public Logger(string logFilePath)
        {
            if (!string.IsNullOrEmpty(logFilePath))
            {
                FileWrite = true;
                LogFilePath = logFilePath;
                FileHelpers.CreateDirectoryFromFilePath(LogFilePath);
            }
        }

        protected void OnMessageAdded(string message)
        {
            MessageAdded?.Invoke(message);
        }

        public void ProcessMessageQueue()
        {
            lock (loggerLock)
            {
                while (messageQueue.TryDequeue(out string message))
                {
                    if (DebugWrite)
                    {
                        Debug.Write(message);
                    }

                    if (StringWrite && sbMessages != null)
                    {
                        sbMessages.Append(message);
                    }

                    if (FileWrite && !string.IsNullOrEmpty(LogFilePath))
                    {
                        try
                        {
                            File.AppendAllText(LogFilePath, message, Encoding.UTF8);
                        }
                        catch (Exception e)
                        {
                            Debug.WriteLine(e);
                        }
                    }

                    OnMessageAdded(message);
                }
            }
        }

        public void Write(string message)
        {
            if (message != null)
            {
                message = string.Format(MessageFormat, DateTime.Now, message);
                messageQueue.Enqueue(message);

                if (AsyncWrite)
                {
                    Task.Run(() => ProcessMessageQueue());
                }
                else
                {
                    ProcessMessageQueue();
                }
            }
        }

        public void Write(string format, params object[] args)
        {
            Write(string.Format(format, args));
        }

        public void WriteLine(string message)
        {
            Write(message + Environment.NewLine);
        }

        public void WriteLine(string format, params object[] args)
        {
            WriteLine(string.Format(format, args));
        }

        public void WriteException(string exception, string message = "Exception")
        {
            WriteLine($"{message}:{Environment.NewLine}{exception}");
        }

        public void WriteException(Exception exception, string message = "Exception")
        {
            WriteException(exception.ToString(), message);
        }

        public void Clear()
        {
            lock (loggerLock)
            {
                if (sbMessages != null)
                {
                    sbMessages.Clear();
                }
            }
        }

        public override string ToString()
        {
            lock (loggerLock)
            {
                if (sbMessages != null && sbMessages.Length > 0)
                {
                    return sbMessages.ToString();
                }

                return null;
            }
        }
    }
}
```

--------------------------------------------------------------------------------

````
