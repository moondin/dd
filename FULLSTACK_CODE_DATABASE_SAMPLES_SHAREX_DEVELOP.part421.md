---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 421
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 421 of 650)

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

---[FILE: ImageCombinerOptions.cs]---
Location: ShareX-develop/ShareX.MediaLib/ImageCombinerOptions.cs

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
using System.Windows.Forms;

namespace ShareX.MediaLib
{
    public class ImageCombinerOptions
    {
        public Orientation Orientation { get; set; } = Orientation.Vertical;
        public ImageCombinerAlignment Alignment { get; set; } = ImageCombinerAlignment.LeftOrTop;
        public int Space { get; set; } = 0;
        public int WrapAfter { get; set; } = 0;
        public bool AutoFillBackground { get; set; } = true;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ShareX.MediaLib.csproj]---
Location: ShareX-develop/ShareX.MediaLib/ShareX.MediaLib.csproj

```text
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net9.0-windows</TargetFramework>
    <OutputType>Library</OutputType>
    <PlatformTarget>x64</PlatformTarget>
    <RuntimeIdentifier>win-x64</RuntimeIdentifier>
    <UseWindowsForms>true</UseWindowsForms>
  </PropertyGroup>
  <ItemGroup>
    <ProjectReference Include="..\ShareX.HelpersLib\ShareX.HelpersLib.csproj" />
  </ItemGroup>
</Project>
```

--------------------------------------------------------------------------------

---[FILE: VideoConverterOptions.cs]---
Location: ShareX-develop/ShareX.MediaLib/VideoConverterOptions.cs

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
using System.Linq;
using System.Text;

namespace ShareX.MediaLib
{
    public class VideoConverterOptions
    {
        public string InputFilePath { get; set; }
        public string OutputFolderPath { get; set; }
        public string OutputFileName { get; set; }

        public string OutputFilePath
        {
            get
            {
                string path = "";

                if (!string.IsNullOrEmpty(OutputFolderPath) && !string.IsNullOrEmpty(OutputFileName))
                {
                    path = Path.Combine(OutputFolderPath, OutputFileName);

                    if (!Path.HasExtension(OutputFileName))
                    {
                        string extension = GetFileExtension();
                        path = Path.ChangeExtension(path, extension);
                    }
                }

                return path;
            }
        }

        private static readonly string[] AnimationOnlyFiles = new string[] { "gif", "webp", "png", "apng" };

        public bool IsInputFileAnimationOnly
        {
            get
            {
                return AnimationOnlyFiles.Any(x => InputFilePath.EndsWith("." + x, StringComparison.OrdinalIgnoreCase));
            }
        }

        public ConverterVideoCodecs VideoCodec { get; set; } = ConverterVideoCodecs.x264;
        public int VideoQuality { get; set; } = 23;
        public bool VideoQualityUseBitrate { get; set; } = false;
        public int VideoQualityBitrate { get; set; } = 3000;

        public bool UseCustomArguments { get; set; } = false;
        public string CustomArguments { get; set; } = "";

        public bool AutoOpenFolder { get; set; } = true;

        public string Arguments
        {
            get
            {
                if (UseCustomArguments)
                {
                    return CustomArguments;
                }

                return GetFFmpegArgs();
            }
        }

        public string GetFFmpegArgs()
        {
            StringBuilder args = new StringBuilder();

            // Input file path
            args.Append($"-i \"{InputFilePath}\" ");

            // Video encoder
            switch (VideoCodec)
            {
                case ConverterVideoCodecs.x264: // https://trac.ffmpeg.org/wiki/Encode/H.264
                    args.Append("-c:v libx264 ");
                    args.Append("-preset medium ");
                    if (VideoQualityUseBitrate)
                    {
                        args.Append($"-b:v {VideoQualityBitrate}k ");
                    }
                    else
                    {
                        args.Append($"-crf {VideoQuality.Clamp(FFmpegCLIManager.x264_min, FFmpegCLIManager.x264_max)} ");
                    }
                    args.Append("-pix_fmt yuv420p ");
                    args.Append("-movflags +faststart ");
                    break;
                case ConverterVideoCodecs.x265: // https://trac.ffmpeg.org/wiki/Encode/H.265
                    args.Append("-c:v libx265 ");
                    args.Append("-preset medium ");
                    if (VideoQualityUseBitrate)
                    {
                        args.Append($"-b:v {VideoQualityBitrate}k ");
                    }
                    else
                    {
                        args.Append($"-crf {VideoQuality.Clamp(FFmpegCLIManager.x265_min, FFmpegCLIManager.x265_max)} ");
                    }
                    break;
                case ConverterVideoCodecs.h264_nvenc: // https://trac.ffmpeg.org/wiki/HWAccelIntro#NVENC
                    args.Append("-c:v h264_nvenc ");
                    args.Append("-preset p4 ");
                    args.Append("-tune hq ");
                    args.Append("-profile:v high ");
                    args.Append($"-b:v {VideoQualityBitrate}k ");
                    break;
                case ConverterVideoCodecs.hevc_nvenc: // https://trac.ffmpeg.org/wiki/HWAccelIntro#NVENC
                    args.Append("-c:v hevc_nvenc ");
                    args.Append("-preset p4 ");
                    args.Append("-tune hq ");
                    args.Append("-profile:v main ");
                    args.Append($"-b:v {VideoQualityBitrate}k ");
                    break;
                case ConverterVideoCodecs.h264_amf:
                    args.Append("-c:v h264_amf ");
                    args.Append("-usage transcoding ");
                    args.Append("-profile main ");
                    args.Append("-quality balanced ");
                    args.Append($"-b:v {VideoQualityBitrate}k ");
                    break;
                case ConverterVideoCodecs.hevc_amf:
                    args.Append("-c:v hevc_amf ");
                    args.Append("-usage transcoding ");
                    args.Append("-profile main ");
                    args.Append("-quality balanced ");
                    args.Append($"-b:v {VideoQualityBitrate}k ");
                    break;
                case ConverterVideoCodecs.h264_qsv: // https://trac.ffmpeg.org/wiki/Hardware/QuickSync
                    args.Append("-c:v h264_qsv ");
                    args.Append("-preset medium ");
                    args.Append($"-b:v {VideoQualityBitrate}k ");
                    break;
                case ConverterVideoCodecs.hevc_qsv: // https://trac.ffmpeg.org/wiki/Hardware/QuickSync
                    args.Append("-c:v hevc_qsv ");
                    args.Append("-preset medium ");
                    args.Append($"-b:v {VideoQualityBitrate}k ");
                    break;
                case ConverterVideoCodecs.vp8: // https://trac.ffmpeg.org/wiki/Encode/VP8
                    args.Append("-c:v libvpx ");
                    if (VideoQualityUseBitrate)
                    {
                        args.Append($"-b:v {VideoQualityBitrate}k ");
                    }
                    else
                    {
                        args.Append($"-crf {VideoQuality.Clamp(FFmpegCLIManager.vp8_min, FFmpegCLIManager.vp8_max)} ");
                        args.Append("-b:v 100M ");
                    }
                    break;
                case ConverterVideoCodecs.vp9: // https://trac.ffmpeg.org/wiki/Encode/VP9
                    args.Append("-c:v libvpx-vp9 ");
                    if (VideoQualityUseBitrate)
                    {
                        args.Append($"-b:v {VideoQualityBitrate}k ");
                    }
                    else
                    {
                        args.Append($"-crf {VideoQuality.Clamp(FFmpegCLIManager.vp9_min, FFmpegCLIManager.vp9_max)} ");
                        args.Append("-b:v 0 ");
                    }
                    break;
                case ConverterVideoCodecs.av1: // https://trac.ffmpeg.org/wiki/Encode/AV1
                    args.Append("-c:v libsvtav1 ");
                    if (VideoQualityUseBitrate)
                    {
                        args.Append($"-b:v {VideoQualityBitrate}k ");
                    }
                    else
                    {
                        args.Append($"-crf {VideoQuality.Clamp(FFmpegCLIManager.av1_min, FFmpegCLIManager.av1_max)} ");
                    }
                    break;
                case ConverterVideoCodecs.xvid: // https://trac.ffmpeg.org/wiki/Encode/MPEG-4
                    args.Append("-c:v libxvid ");
                    if (VideoQualityUseBitrate)
                    {
                        args.Append($"-b:v {VideoQualityBitrate}k ");
                    }
                    else
                    {
                        args.Append($"-q:v {VideoQuality.Clamp(FFmpegCLIManager.xvid_min, FFmpegCLIManager.xvid_max)} ");
                    }
                    break;
                case ConverterVideoCodecs.gif: // https://ffmpeg.org/ffmpeg-filters.html#palettegen-1
                    args.Append("-lavfi \"palettegen=stats_mode=full[palette],[0:v][palette]paletteuse=dither=sierra2_4a\" ");
                    break;
                case ConverterVideoCodecs.webp: // https://www.ffmpeg.org/ffmpeg-codecs.html#libwebp
                    args.Append("-c:v libwebp ");
                    args.Append("-lossless 0 ");
                    args.Append("-preset default ");
                    args.Append("-loop 0 ");
                    break;
                case ConverterVideoCodecs.apng:
                    args.Append("-f apng ");
                    args.Append("-plays 0 ");
                    break;
            }

            switch (VideoCodec)
            {
                case ConverterVideoCodecs.x265:
                case ConverterVideoCodecs.hevc_nvenc:
                case ConverterVideoCodecs.hevc_amf:
                case ConverterVideoCodecs.hevc_qsv:
                    args.Append("-tag:v hvc1 "); // https://trac.ffmpeg.org/wiki/Encode/H.265#FinalCutandApplestuffcompatibility
                    break;
            }

            if (!IsInputFileAnimationOnly)
            {
                // Audio encoder
                switch (VideoCodec)
                {
                    case ConverterVideoCodecs.x264: // https://trac.ffmpeg.org/wiki/Encode/AAC
                    case ConverterVideoCodecs.x265:
                    case ConverterVideoCodecs.h264_nvenc:
                    case ConverterVideoCodecs.hevc_nvenc:
                    case ConverterVideoCodecs.h264_amf:
                    case ConverterVideoCodecs.hevc_amf:
                    case ConverterVideoCodecs.h264_qsv:
                    case ConverterVideoCodecs.hevc_qsv:
                        args.Append("-c:a aac ");
                        args.Append("-b:a 128k ");
                        break;
                    case ConverterVideoCodecs.vp8: // https://trac.ffmpeg.org/wiki/TheoraVorbisEncodingGuide
                    case ConverterVideoCodecs.vp9:
                        args.Append("-c:a libvorbis ");
                        args.Append("-q:a 3 ");
                        break;
                    case ConverterVideoCodecs.av1: // https://ffmpeg.org/ffmpeg-codecs.html#libopus-1
                        args.Append("-c:a libopus ");
                        args.Append("-b:a 128k ");
                        break;
                    case ConverterVideoCodecs.xvid: // https://trac.ffmpeg.org/wiki/Encode/MP3
                        args.Append("-c:a libmp3lame ");
                        args.Append("-q:a 4 ");
                        break;
                }
            }

            // Overwrite output files without asking
            args.Append($"-y ");

            // Output file path
            args.Append($"\"{OutputFilePath}\"");

            return args.ToString();
        }

        public string GetFileExtension()
        {
            switch (VideoCodec)
            {
                default:
                case ConverterVideoCodecs.x264:
                case ConverterVideoCodecs.x265:
                case ConverterVideoCodecs.h264_nvenc:
                case ConverterVideoCodecs.hevc_nvenc:
                case ConverterVideoCodecs.h264_amf:
                case ConverterVideoCodecs.hevc_amf:
                case ConverterVideoCodecs.h264_qsv:
                case ConverterVideoCodecs.hevc_qsv:
                    return "mp4";
                case ConverterVideoCodecs.vp8:
                case ConverterVideoCodecs.vp9:
                    return "webm";
                case ConverterVideoCodecs.av1:
                    return "mkv";
                case ConverterVideoCodecs.xvid:
                    return "avi";
                case ConverterVideoCodecs.gif:
                    return "gif";
                case ConverterVideoCodecs.webp:
                    return "webp";
                case ConverterVideoCodecs.apng:
                    return "apng";
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: VideoInfo.cs]---
Location: ShareX-develop/ShareX.MediaLib/VideoInfo.cs

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
using System.Globalization;
using System.IO;

namespace ShareX.MediaLib
{
    public class VideoInfo
    {
        public string FilePath { get; set; }

        public TimeSpan Duration { get; set; }
        public TimeSpan Start { get; set; }
        public int Bitrate { get; set; }

        public string VideoCodec { get; set; }
        public Size VideoResolution { get; set; }
        public double VideoFPS { get; set; }

        public string AudioCodec { get; set; }

        public override string ToString()
        {
            string text = string.Format("Filename: {0}, Duration: {1}, Bitrate: {2} kb/s", Path.GetFileName(FilePath), Duration.ToString(@"hh\:mm\:s"), Bitrate);

            if (!string.IsNullOrEmpty(VideoCodec))
            {
                text += string.Format(", Video codec: {0}, Resolution: {1}x{2}, FPS: {3}", VideoCodec, VideoResolution.Width, VideoResolution.Height,
                    VideoFPS.ToString("0.##", CultureInfo.InvariantCulture));
            }

            if (!string.IsNullOrEmpty(AudioCodec))
            {
                text += string.Format(", Audio codec: {0}", AudioCodec);
            }

            return text;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: VideoThumbnailer.cs]---
Location: ShareX-develop/ShareX.MediaLib/VideoThumbnailer.cs

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
using System.Diagnostics;
using System.Drawing;
using System.IO;

namespace ShareX.MediaLib
{
    public class VideoThumbnailer
    {
        public delegate void ProgressChangedEventHandler(int current, int length);
        public event ProgressChangedEventHandler ProgressChanged;

        public string FFmpegPath { get; private set; }
        public VideoThumbnailOptions Options { get; private set; }
        public string MediaPath { get; private set; }
        public VideoInfo VideoInfo { get; private set; }

        public VideoThumbnailer(string ffmpegPath, VideoThumbnailOptions options)
        {
            FFmpegPath = ffmpegPath;
            Options = options;
        }

        private void UpdateVideoInfo()
        {
            using (FFmpegCLIManager ffmpeg = new FFmpegCLIManager(FFmpegPath))
            {
                VideoInfo = ffmpeg.GetVideoInfo(MediaPath);
            }
        }

        public List<VideoThumbnailInfo> TakeThumbnails(string mediaPath)
        {
            MediaPath = mediaPath;

            UpdateVideoInfo();

            if (VideoInfo == null || VideoInfo.Duration == TimeSpan.Zero)
            {
                return null;
            }

            List<VideoThumbnailInfo> tempThumbnails = new List<VideoThumbnailInfo>();

            for (int i = 0; i < Options.ThumbnailCount; i++)
            {
                string mediaFileName = Path.GetFileNameWithoutExtension(MediaPath);

                int timeSliceElapsed;

                if (Options.RandomFrame)
                {
                    timeSliceElapsed = GetRandomTimeSlice(i);
                }
                else
                {
                    timeSliceElapsed = GetTimeSlice(Options.ThumbnailCount) * (i + 1);
                }

                string fileName = string.Format("{0}-{1}.{2}", mediaFileName, timeSliceElapsed, Options.ImageFormat.GetDescription());
                string tempThumbnailPath = Path.Combine(GetOutputDirectory(), fileName);

                using (Process process = new Process())
                {
                    ProcessStartInfo psi = new ProcessStartInfo()
                    {
                        FileName = FFmpegPath,
                        Arguments = $"-ss {timeSliceElapsed} -i \"{MediaPath}\" -f image2 -vframes 1 -y \"{tempThumbnailPath}\"",
                        UseShellExecute = false,
                        CreateNoWindow = true
                    };

                    process.StartInfo = psi;
                    process.Start();
                    process.WaitForExit(1000 * 30);
                }

                if (File.Exists(tempThumbnailPath))
                {
                    VideoThumbnailInfo screenshotInfo = new VideoThumbnailInfo(tempThumbnailPath)
                    {
                        Timestamp = TimeSpan.FromSeconds(timeSliceElapsed)
                    };

                    tempThumbnails.Add(screenshotInfo);
                }

                OnProgressChanged(i + 1, Options.ThumbnailCount);
            }

            return Finish(tempThumbnails);
        }

        private List<VideoThumbnailInfo> Finish(List<VideoThumbnailInfo> tempThumbnails)
        {
            List<VideoThumbnailInfo> thumbnails = new List<VideoThumbnailInfo>();

            if (tempThumbnails != null && tempThumbnails.Count > 0)
            {
                if (Options.CombineScreenshots)
                {
                    using (Image img = CombineScreenshots(tempThumbnails))
                    {
                        string tempFilePath = Path.Combine(GetOutputDirectory(), Path.GetFileNameWithoutExtension(MediaPath) + Options.FilenameSuffix + "." + Options.ImageFormat.GetDescription());
                        ImageHelpers.SaveImage(img, tempFilePath);
                        thumbnails.Add(new VideoThumbnailInfo(tempFilePath));
                    }

                    if (!Options.KeepScreenshots)
                    {
                        tempThumbnails.ForEach(x => File.Delete(x.FilePath));
                    }
                }
                else
                {
                    thumbnails.AddRange(tempThumbnails);
                }

                if (Options.OpenDirectory && thumbnails.Count > 0)
                {
                    FileHelpers.OpenFolderWithFile(thumbnails[0].FilePath);
                }
            }

            return thumbnails;
        }

        protected void OnProgressChanged(int current, int length)
        {
            ProgressChanged?.Invoke(current, length);
        }

        private string GetOutputDirectory()
        {
            string directory;

            switch (Options.OutputLocation)
            {
                default:
                case ThumbnailLocationType.DefaultFolder:
                    directory = Options.DefaultOutputDirectory;
                    break;
                case ThumbnailLocationType.ParentFolder:
                    directory = Path.GetDirectoryName(MediaPath);
                    break;
                case ThumbnailLocationType.CustomFolder:
                    directory = FileHelpers.ExpandFolderVariables(Options.CustomOutputDirectory);
                    break;
            }

            FileHelpers.CreateDirectory(directory);

            return directory;
        }

        private int GetTimeSlice(int count)
        {
            return (int)(VideoInfo.Duration.TotalSeconds / count);
        }

        private int GetRandomTimeSlice(int start)
        {
            List<int> mediaSeekTimes = new List<int>();

            for (int i = 1; i < Options.ThumbnailCount + 2; i++)
            {
                mediaSeekTimes.Add(GetTimeSlice(Options.ThumbnailCount + 2) * i);
            }

            return (int)((RandomFast.NextDouble() * (mediaSeekTimes[start + 1] - mediaSeekTimes[start])) + mediaSeekTimes[start]);
        }

        private Image CombineScreenshots(List<VideoThumbnailInfo> thumbnails)
        {
            List<Bitmap> images = new List<Bitmap>();
            Image finalImage = null;

            try
            {
                string infoString = "";
                int infoStringHeight = 0;

                if (Options.AddVideoInfo)
                {
                    infoString = VideoInfo.ToString();

                    using (Font font = new Font("Arial", 12))
                    {
                        infoStringHeight = Helpers.MeasureText(infoString, font).Height;
                    }
                }

                foreach (VideoThumbnailInfo thumbnail in thumbnails)
                {
                    Bitmap bmp = ImageHelpers.LoadImage(thumbnail.FilePath);

                    if (Options.MaxThumbnailWidth > 0 && bmp.Width > Options.MaxThumbnailWidth)
                    {
                        int maxThumbnailHeight = (int)((float)Options.MaxThumbnailWidth / bmp.Width * bmp.Height);
                        bmp = ImageHelpers.ResizeImage(bmp, Options.MaxThumbnailWidth, maxThumbnailHeight);
                    }

                    images.Add(bmp);
                }

                int columnCount = Options.ColumnCount;

                int thumbWidth = images[0].Width;

                int width = (Options.Padding * 2) +
                            (thumbWidth * columnCount) +
                            ((columnCount - 1) * Options.Spacing);

                int rowCount = (int)Math.Ceiling(images.Count / (float)columnCount);

                int thumbHeight = images[0].Height;

                int height = (Options.Padding * 3) +
                             infoStringHeight +
                             (thumbHeight * rowCount) +
                             ((rowCount - 1) * Options.Spacing);

                finalImage = new Bitmap(width, height);

                using (Graphics g = Graphics.FromImage(finalImage))
                {
                    g.Clear(Color.WhiteSmoke);

                    if (!string.IsNullOrEmpty(infoString))
                    {
                        using (Font font = new Font("Arial", 12))
                        {
                            g.DrawString(infoString, font, Brushes.Black, Options.Padding, Options.Padding);
                        }
                    }

                    int i = 0;
                    int offsetY = (Options.Padding * 2) + infoStringHeight;

                    for (int y = 0; y < rowCount; y++)
                    {
                        int offsetX = Options.Padding;

                        for (int x = 0; x < columnCount; x++)
                        {
                            if (Options.DrawShadow)
                            {
                                int shadowOffset = 3;

                                using (Brush shadowBrush = new SolidBrush(Color.FromArgb(75, Color.Black)))
                                {
                                    g.FillRectangle(shadowBrush, offsetX + shadowOffset, offsetY + shadowOffset, thumbWidth, thumbHeight);
                                }
                            }

                            g.DrawImage(images[i], offsetX, offsetY, thumbWidth, thumbHeight);

                            if (Options.DrawBorder)
                            {
                                g.DrawRectangleProper(Pens.Black, offsetX, offsetY, thumbWidth, thumbHeight);
                            }

                            if (Options.AddTimestamp)
                            {
                                int timestampOffset = 10;

                                using (Font font = new Font("Arial", 10, FontStyle.Bold))
                                {
                                    g.DrawTextWithShadow(thumbnails[i].Timestamp.ToString(), new Point(offsetX + timestampOffset, offsetY + timestampOffset), font, Brushes.White, Brushes.Black);
                                }
                            }

                            i++;

                            if (i >= images.Count)
                            {
                                return finalImage;
                            }

                            offsetX += thumbWidth + Options.Spacing;
                        }

                        offsetY += thumbHeight + Options.Spacing;
                    }
                }

                return finalImage;
            }
            catch
            {
                if (finalImage != null)
                {
                    finalImage.Dispose();
                }

                throw;
            }
            finally
            {
                foreach (Bitmap image in images)
                {
                    if (image != null)
                    {
                        image.Dispose();
                    }
                }
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: VideoThumbnailInfo.cs]---
Location: ShareX-develop/ShareX.MediaLib/VideoThumbnailInfo.cs

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

namespace ShareX.MediaLib
{
    public class VideoThumbnailInfo
    {
        public string FilePath { get; set; }
        public TimeSpan Timestamp { get; set; }

        public VideoThumbnailInfo(string filePath)
        {
            FilePath = filePath;
        }

        public override string ToString()
        {
            return Path.GetFileName(FilePath);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: VideoThumbnailOptions.cs]---
Location: ShareX-develop/ShareX.MediaLib/VideoThumbnailOptions.cs

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
using System.ComponentModel;
using System.Drawing.Design;

namespace ShareX.MediaLib
{
    public class VideoThumbnailOptions
    {
        [Category("Thumbnails"), DefaultValue(ThumbnailLocationType.DefaultFolder), Description("Create thumbnails in default screenshot folder, same folder as the media file or in a custom folder.")]
        public ThumbnailLocationType OutputLocation { get; set; }

        [Category("Thumbnails"), DefaultValue(""), Description("Output folder where thumbnails will get saved."), Editor(typeof(DirectoryNameEditor), typeof(UITypeEditor))]
        public string CustomOutputDirectory { get; set; }

        [Category("Thumbnails"), DefaultValue(EImageFormat.PNG), Description("Thumbnail image format to save.")]
        public EImageFormat ImageFormat { get; set; }

        [Category("Thumbnails"), DefaultValue(9), Description("Total number of thumbnails to take.")]
        public int ThumbnailCount { get; set; }

        [Category("Thumbnails"), DefaultValue("_Thumbnail"), Description("Suffix to append to the thumbnail filename.")]
        public string FilenameSuffix { get; set; }

        [Category("Thumbnails"), DefaultValue(false), Description("Choose random frame each time a media file is processed.")]
        public bool RandomFrame { get; set; }

        [Category("Thumbnails"), DefaultValue(true), Description("Upload thumbnails.")]
        public bool UploadThumbnails { get; set; }

        [Category("Thumbnails"), DefaultValue(false), Description("After combine thumbnails keep single image files.")]
        public bool KeepScreenshots { get; set; }

        [Category("Thumbnails"), DefaultValue(false), Description("After all thumbnails taken open output directory automatically.")]
        public bool OpenDirectory { get; set; }

        [Category("Thumbnails"), DefaultValue(512), Description("Maximum thumbnail width size, 0 means don't resize.")]
        public int MaxThumbnailWidth { get; set; }

        [Category("Thumbnails / Combined"), DefaultValue(true), Description("Combine all thumbnails to one large thumbnail.")]
        public bool CombineScreenshots { get; set; }

        [Category("Thumbnails / Combined"), DefaultValue(10), Description("Space between border and content as pixel.")]
        public int Padding { get; set; }

        [Category("Thumbnails / Combined"), DefaultValue(10), Description("Space between thumbnails as pixel.")]
        public int Spacing { get; set; }

        [Category("Thumbnails / Combined"), DefaultValue(3), Description("Number of thumbnails per row.")]
        public int ColumnCount { get; set; }

        [Category("Thumbnails / Combined"), DefaultValue(true), Description("Add video information to the combined thumbnail.")]
        public bool AddVideoInfo { get; set; }

        [Category("Thumbnails / Combined"), DefaultValue(true), Description("Add timestamp of thumbnail at corner of image.")]
        public bool AddTimestamp { get; set; }

        [Category("Thumbnails / Combined"), DefaultValue(true), Description("Draw rectangle shadow behind thumbnails.")]
        public bool DrawShadow { get; set; }

        [Category("Thumbnails / Combined"), DefaultValue(true), Description("Draw border around thumbnails.")]
        public bool DrawBorder { get; set; }

        public string DefaultOutputDirectory, LastVideoPath;

        public VideoThumbnailOptions()
        {
            this.ApplyDefaultPropertyValues();
        }
    }
}
```

--------------------------------------------------------------------------------

````
