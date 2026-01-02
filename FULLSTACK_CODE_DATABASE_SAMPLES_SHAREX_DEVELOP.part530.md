---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 530
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 530 of 650)

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

---[FILE: ScreenRecorder.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/ScreenRecording/ScreenRecorder.cs

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
using ShareX.MediaLib;
using System;
using System.Diagnostics;
using System.Drawing;
using System.Text;
using System.Threading;

namespace ShareX.ScreenCaptureLib
{
    public class ScreenRecorder : IDisposable
    {
        public bool IsRecording { get; private set; }

        public int FPS
        {
            get
            {
                return fps;
            }
            set
            {
                if (!IsRecording)
                {
                    fps = value;
                    UpdateInfo();
                }
            }
        }

        public float DurationSeconds
        {
            get
            {
                return durationSeconds;
            }
            set
            {
                if (!IsRecording)
                {
                    durationSeconds = value;
                    UpdateInfo();
                }
            }
        }

        public Rectangle CaptureRectangle
        {
            get
            {
                return captureRectangle;
            }
            private set
            {
                if (!IsRecording)
                {
                    captureRectangle = value;
                }
            }
        }

        public string CachePath { get; private set; }

        public ScreenRecordOutput OutputType { get; private set; }

        public ScreenRecordingOptions Options { get; set; }

        public event Action RecordingStarted;

        public delegate void ProgressEventHandler(int progress);
        public event ProgressEventHandler EncodingProgressChanged;

        private int fps, delay, frameCount, previousProgress;
        private float durationSeconds;
        private Screenshot screenshot;
        private Rectangle captureRectangle;
        private ImageCache imgCache;
        private FFmpegCLIManager ffmpeg;
        private bool stopRequested;

        public ScreenRecorder(ScreenRecordOutput outputType, ScreenRecordingOptions options, Screenshot screenshot, Rectangle captureRectangle)
        {
            if (string.IsNullOrEmpty(options.OutputPath))
            {
                throw new Exception("Screen recorder cache path is empty.");
            }

            FPS = options.FPS;
            DurationSeconds = options.Duration;
            CaptureRectangle = captureRectangle;
            CachePath = options.OutputPath;
            OutputType = outputType;

            Options = options;

            switch (OutputType)
            {
                default:
                case ScreenRecordOutput.FFmpeg:
                    FileHelpers.CreateDirectoryFromFilePath(Options.OutputPath);
                    ffmpeg = new FFmpegCLIManager(Options.FFmpeg.FFmpegPath);
                    ffmpeg.ShowError = true;
                    ffmpeg.EncodeStarted += OnRecordingStarted;
                    ffmpeg.EncodeProgressChanged += OnEncodingProgressChanged;
                    break;
                case ScreenRecordOutput.GIF:
                    imgCache = new HardDiskCache(Options);
                    break;
            }

            this.screenshot = screenshot;
        }

        private void UpdateInfo()
        {
            delay = 1000 / fps;
            frameCount = (int)(fps * durationSeconds);
        }

        public void StartRecording()
        {
            if (!IsRecording)
            {
                IsRecording = true;
                stopRequested = false;

                if (OutputType == ScreenRecordOutput.FFmpeg)
                {
                    ffmpeg.Run(Options.GetFFmpegCommands());
                }
                else
                {
                    OnRecordingStarted();
                    RecordUsingCache();
                }
            }

            IsRecording = false;
        }

        private void RecordUsingCache()
        {
            try
            {
                for (int i = 0; !stopRequested && (frameCount == 0 || i < frameCount); i++)
                {
                    Stopwatch timer = Stopwatch.StartNew();

                    Image img = screenshot.CaptureRectangle(CaptureRectangle);
                    //DebugHelper.WriteLine("Screen capture: " + (int)timer.ElapsedMilliseconds);

                    imgCache.AddImageAsync(img);

                    if (!stopRequested && (frameCount == 0 || i + 1 < frameCount))
                    {
                        int sleepTime = delay - (int)timer.ElapsedMilliseconds;

                        if (sleepTime > 0)
                        {
                            Thread.Sleep(sleepTime);
                        }
                        else if (sleepTime < 0)
                        {
                            // Need to handle FPS drops
                        }
                    }
                }
            }
            finally
            {
                imgCache.Finish();
            }
        }

        public void StopRecording()
        {
            stopRequested = true;

            if (ffmpeg != null)
            {
                ffmpeg.Close();
            }
        }

        public void SaveAsGIF(string path, GIFQuality quality)
        {
            if (imgCache != null && imgCache is HardDiskCache && !IsRecording)
            {
                FileHelpers.CreateDirectoryFromFilePath(path);

                HardDiskCache hdCache = imgCache as HardDiskCache;

                using (AnimatedGifCreator gifEncoder = new AnimatedGifCreator(path, delay))
                {
                    int i = 0;
                    int count = hdCache.Count;

                    foreach (Image img in hdCache.GetImageEnumerator())
                    {
                        i++;
                        OnEncodingProgressChanged((int)((float)i / count * 100));

                        using (img)
                        {
                            gifEncoder.AddFrame(img, quality);
                        }
                    }
                }
            }
        }

        public bool FFmpegEncodeVideo(string input, string output)
        {
            FileHelpers.CreateDirectoryFromFilePath(output);

            Options.IsRecording = false;
            Options.IsLossless = false;
            Options.InputPath = input;
            Options.OutputPath = output;

            try
            {
                ffmpeg.TrackEncodeProgress = true;

                return ffmpeg.Run(Options.GetFFmpegCommands());
            }
            finally
            {
                ffmpeg.TrackEncodeProgress = false;
            }
        }

        public bool FFmpegEncodeAsGIF(string input, string output)
        {
            FileHelpers.CreateDirectoryFromFilePath(output);

            try
            {
                ffmpeg.TrackEncodeProgress = true;

                StringBuilder args = new StringBuilder();

                args.Append($"-i \"{input}\" ");

                // https://ffmpeg.org/ffmpeg-filters.html#palettegen-1
                args.Append($"-lavfi \"palettegen=stats_mode={Options.FFmpeg.GIFStatsMode}[palette],");

                // https://ffmpeg.org/ffmpeg-filters.html#paletteuse
                args.Append($"[0:v][palette]paletteuse=dither={Options.FFmpeg.GIFDither}");

                if (Options.FFmpeg.GIFDither == FFmpegPaletteUseDither.bayer)
                {
                    args.Append($":bayer_scale={Options.FFmpeg.GIFBayerScale}");
                }

                if (Options.FFmpeg.GIFStatsMode == FFmpegPaletteGenStatsMode.single)
                {
                    args.Append(":new=1");
                }

                // https://ffmpeg.org/ffmpeg-filters.html#mpdecimate
                args.Append(",mpdecimate");

                args.Append("\" ");
                args.Append("-y ");
                args.Append($"\"{output}\"");

                return ffmpeg.Run(args.ToString());
            }
            finally
            {
                ffmpeg.TrackEncodeProgress = false;
            }
        }

        protected void OnRecordingStarted()
        {
            RecordingStarted?.Invoke();
        }

        protected void OnEncodingProgressChanged(float progress)
        {
            int currentProgress = (int)progress;

            if (EncodingProgressChanged != null && currentProgress != previousProgress)
            {
                EncodingProgressChanged(currentProgress);
                previousProgress = currentProgress;
            }
        }

        public void Dispose()
        {
            if (ffmpeg != null)
            {
                ffmpeg.Dispose();
            }

            if (imgCache != null)
            {
                imgCache.Dispose();
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ScreenRecordingOptions.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/ScreenRecording/ScreenRecordingOptions.cs

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
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace ShareX.ScreenCaptureLib
{
    public class ScreenRecordingOptions
    {
        public bool IsRecording { get; set; }
        public bool IsLossless { get; set; }
        public string InputPath { get; set; }
        public string OutputPath { get; set; }
        public int FPS { get; set; }
        public Rectangle CaptureArea { get; set; }
        public float Duration { get; set; }
        public bool DrawCursor { get; set; }
        public FFmpegOptions FFmpeg { get; set; } = new FFmpegOptions();

        public string GetFFmpegCommands()
        {
            string commands;

            if (IsRecording && !string.IsNullOrEmpty(FFmpeg.VideoSource) &&
                FFmpeg.VideoSource.Equals(FFmpegCaptureDevice.ScreenCaptureRecorder.Value, StringComparison.OrdinalIgnoreCase))
            {
                // https://github.com/rdp/screen-capture-recorder-to-video-windows-free
                string registryPath = "Software\\screen-capture-recorder";
                RegistryHelpers.CreateRegistry(registryPath, "start_x", CaptureArea.X);
                RegistryHelpers.CreateRegistry(registryPath, "start_y", CaptureArea.Y);
                RegistryHelpers.CreateRegistry(registryPath, "capture_width", CaptureArea.Width);
                RegistryHelpers.CreateRegistry(registryPath, "capture_height", CaptureArea.Height);
                RegistryHelpers.CreateRegistry(registryPath, "default_max_fps", 60);
                RegistryHelpers.CreateRegistry(registryPath, "capture_mouse_default_1", DrawCursor ? 1 : 0);
            }

            if (!IsLossless && FFmpeg.UseCustomCommands && !string.IsNullOrEmpty(FFmpeg.CustomCommands))
            {
                commands = FFmpeg.CustomCommands.
                    Replace("$fps$", FPS.ToString(), StringComparison.OrdinalIgnoreCase).
                    Replace("$area_x$", CaptureArea.X.ToString(), StringComparison.OrdinalIgnoreCase).
                    Replace("$area_y$", CaptureArea.Y.ToString(), StringComparison.OrdinalIgnoreCase).
                    Replace("$area_width$", CaptureArea.Width.ToString(), StringComparison.OrdinalIgnoreCase).
                    Replace("$area_height$", CaptureArea.Height.ToString(), StringComparison.OrdinalIgnoreCase).
                    Replace("$cursor$", DrawCursor ? "1" : "0", StringComparison.OrdinalIgnoreCase).
                    Replace("$duration$", Duration.ToString("0.0", CultureInfo.InvariantCulture), StringComparison.OrdinalIgnoreCase).
                    Replace("$output$", Path.ChangeExtension(OutputPath, FFmpeg.Extension), StringComparison.OrdinalIgnoreCase);
            }
            else
            {
                commands = GetFFmpegArgs();
            }

            return commands.Trim();
        }

        public string GetFFmpegArgs(bool isCustom = false)
        {
            if (IsRecording && !FFmpeg.IsVideoSourceSelected && !FFmpeg.IsAudioSourceSelected)
            {
                return null;
            }

            StringBuilder args = new StringBuilder();

            string framerate = isCustom ? "$fps$" : FPS.ToString();

            if (IsRecording)
            {
                if (FFmpeg.IsVideoSourceSelected)
                {
                    if (FFmpeg.VideoSource.Equals(FFmpegCaptureDevice.GDIGrab.Value, StringComparison.OrdinalIgnoreCase))
                    {
                        if (FFmpeg.IsAudioSourceSelected)
                        {
                            AppendInputDevice(args, "dshow", true);
                            args.Append($"-i audio={Helpers.EscapeCLIText(FFmpeg.AudioSource)} ");
                        }

                        string x = isCustom ? "$area_x$" : CaptureArea.X.ToString();
                        string y = isCustom ? "$area_y$" : CaptureArea.Y.ToString();
                        string width = isCustom ? "$area_width$" : CaptureArea.Width.ToString();
                        string height = isCustom ? "$area_height$" : CaptureArea.Height.ToString();
                        string cursor = isCustom ? "$cursor$" : DrawCursor ? "1" : "0";

                        // https://ffmpeg.org/ffmpeg-devices.html#gdigrab
                        AppendInputDevice(args, "gdigrab", false);
                        args.Append($"-framerate {framerate} ");
                        args.Append($"-offset_x {x} ");
                        args.Append($"-offset_y {y} ");
                        args.Append($"-video_size {width}x{height} ");
                        args.Append($"-draw_mouse {cursor} ");
                        args.Append("-i desktop ");
                    }
                    else if (FFmpeg.VideoSource.Equals(FFmpegCaptureDevice.DDAGrab.Value, StringComparison.OrdinalIgnoreCase))
                    {
                        if (FFmpeg.IsAudioSourceSelected)
                        {
                            AppendInputDevice(args, "dshow", true);
                            args.Append($"-i audio={Helpers.EscapeCLIText(FFmpeg.AudioSource)} ");
                        }

                        Screen[] screens = Screen.AllScreens.OrderBy(x => !x.Primary).ToArray();
                        int monitorIndex = 0;
                        Rectangle captureArea = screens[0].Bounds;
                        int maxIntersectionArea = 0;

                        for (int i = 0; i < screens.Length; i++)
                        {
                            Screen screen = screens[i];
                            Rectangle intersection = Rectangle.Intersect(screen.Bounds, CaptureArea);
                            int intersectionArea = intersection.Width * intersection.Height;

                            if (intersectionArea > maxIntersectionArea)
                            {
                                maxIntersectionArea = intersectionArea;

                                monitorIndex = i;
                                captureArea = new Rectangle(intersection.X - screen.Bounds.X, intersection.Y - screen.Bounds.Y, intersection.Width, intersection.Height);
                            }
                        }

                        if (FFmpeg.IsEvenSizeRequired)
                        {
                            captureArea = CaptureHelpers.EvenRectangleSize(captureArea);
                        }

                        // https://ffmpeg.org/ffmpeg-filters.html#ddagrab
                        AppendInputDevice(args, "lavfi", false);
                        args.Append("-i ddagrab=");
                        args.Append($"output_idx={monitorIndex}:"); // DXGI Output Index to capture.
                        args.Append($"draw_mouse={DrawCursor.ToString().ToLowerInvariant()}:"); // Whether to draw the mouse cursor.
                        args.Append($"framerate={framerate}:"); // Framerate at which the desktop will be captured.
                        args.Append($"offset_x={captureArea.X}:"); // Horizontal offset of the captured video.
                        args.Append($"offset_y={captureArea.Y}:"); // Vertical offset of the captured video.
                        args.Append($"video_size={captureArea.Width}x{captureArea.Height}:"); // Specify the size of the captured video.
                        args.Append("output_fmt=bgra"); // Desired filter output format.

                        if (FFmpeg.VideoCodec != FFmpegVideoCodec.h264_nvenc && FFmpeg.VideoCodec != FFmpegVideoCodec.hevc_nvenc)
                        {
                            args.Append(",hwdownload");
                            args.Append(",format=bgra");
                        }

                        args.Append(" ");
                    }
                    else
                    {
                        // https://ffmpeg.org/ffmpeg-devices.html#dshow
                        AppendInputDevice(args, "dshow", FFmpeg.IsAudioSourceSelected);
                        args.Append($"-framerate {framerate} ");
                        args.Append($"-i video={Helpers.EscapeCLIText(FFmpeg.VideoSource)}");

                        if (FFmpeg.IsAudioSourceSelected)
                        {
                            args.Append($":audio={Helpers.EscapeCLIText(FFmpeg.AudioSource)} ");
                        }
                        else
                        {
                            args.Append(" ");
                        }
                    }
                }
                else if (FFmpeg.IsAudioSourceSelected)
                {
                    AppendInputDevice(args, "dshow", true);
                    args.Append($"-i audio={Helpers.EscapeCLIText(FFmpeg.AudioSource)} ");
                }
            }
            else
            {
                args.Append($"-i \"{InputPath}\" ");
            }

            if (!string.IsNullOrEmpty(FFmpeg.UserArgs))
            {
                args.Append(FFmpeg.UserArgs + " ");
            }

            if (FFmpeg.IsVideoSourceSelected)
            {
                if (IsLossless || FFmpeg.VideoCodec != FFmpegVideoCodec.apng)
                {
                    string videoCodec;

                    if (IsLossless)
                    {
                        videoCodec = FFmpegVideoCodec.libx264.ToString();
                    }
                    else if (FFmpeg.VideoCodec == FFmpegVideoCodec.libvpx_vp9)
                    {
                        videoCodec = "libvpx-vp9";
                    }
                    else
                    {
                        videoCodec = FFmpeg.VideoCodec.ToString();
                    }

                    args.Append($"-c:v {videoCodec} ");
                    args.Append($"-r {framerate} "); // output FPS
                }

                if (IsLossless)
                {
                    args.Append($"-preset {FFmpegPreset.ultrafast} ");
                    args.Append($"-tune {FFmpegTune.zerolatency} ");
                    args.Append("-qp 0 ");
                }
                else
                {
                    switch (FFmpeg.VideoCodec)
                    {
                        case FFmpegVideoCodec.libx264: // https://trac.ffmpeg.org/wiki/Encode/H.264
                        case FFmpegVideoCodec.libx265: // https://trac.ffmpeg.org/wiki/Encode/H.265
                            args.Append($"-preset {FFmpeg.x264_Preset} ");
                            if (IsRecording) args.Append($"-tune {FFmpegTune.zerolatency} ");
                            if (FFmpeg.x264_Use_Bitrate)
                            {
                                args.Append($"-b:v {FFmpeg.x264_Bitrate}k ");
                            }
                            else
                            {
                                args.Append($"-crf {FFmpeg.x264_CRF} ");
                            }
                            args.Append("-pix_fmt yuv420p "); // -pix_fmt yuv420p required otherwise can't stream in Chrome
                            args.Append("-movflags +faststart "); // This will move some information to the beginning of your file and allow the video to begin playing before it is completely downloaded by the viewer
                            break;
                        case FFmpegVideoCodec.libvpx: // https://trac.ffmpeg.org/wiki/Encode/VP8
                        case FFmpegVideoCodec.libvpx_vp9: // https://trac.ffmpeg.org/wiki/Encode/VP9
                            if (IsRecording) args.Append("-deadline realtime ");
                            args.Append($"-b:v {FFmpeg.VPx_Bitrate}k ");
                            args.Append("-pix_fmt yuv420p "); // -pix_fmt yuv420p required otherwise causing issues in Chrome related to WebM transparency support
                            break;
                        case FFmpegVideoCodec.libxvid: // https://trac.ffmpeg.org/wiki/Encode/MPEG-4
                            args.Append($"-qscale:v {FFmpeg.XviD_QScale} ");
                            break;
                        case FFmpegVideoCodec.h264_nvenc: // https://trac.ffmpeg.org/wiki/HWAccelIntro#NVENC
                        case FFmpegVideoCodec.hevc_nvenc:
                            args.Append($"-preset {FFmpeg.NVENC_Preset} ");
                            args.Append($"-tune {FFmpeg.NVENC_Tune} ");
                            args.Append($"-b:v {FFmpeg.NVENC_Bitrate}k ");
                            args.Append("-movflags +faststart "); // This will move some information to the beginning of your file and allow the video to begin playing before it is completely downloaded by the viewer
                            break;
                        case FFmpegVideoCodec.h264_amf:
                        case FFmpegVideoCodec.hevc_amf:
                            args.Append($"-usage {FFmpeg.AMF_Usage} ");
                            args.Append($"-quality {FFmpeg.AMF_Quality} ");
                            args.Append($"-b:v {FFmpeg.AMF_Bitrate}k ");
                            args.Append("-pix_fmt yuv420p ");
                            break;
                        case FFmpegVideoCodec.h264_qsv: // https://trac.ffmpeg.org/wiki/Hardware/QuickSync
                        case FFmpegVideoCodec.hevc_qsv:
                            args.Append($"-preset {FFmpeg.QSV_Preset} ");
                            args.Append($"-b:v {FFmpeg.QSV_Bitrate}k ");
                            break;
                        case FFmpegVideoCodec.libwebp: // https://www.ffmpeg.org/ffmpeg-codecs.html#libwebp
                            args.Append("-lossless 0 ");
                            args.Append("-preset default ");
                            args.Append("-loop 0 ");
                            break;
                        case FFmpegVideoCodec.apng:
                            args.Append("-f apng ");
                            args.Append("-plays 0 ");
                            break;
                    }

                    switch (FFmpeg.VideoCodec)
                    {
                        case FFmpegVideoCodec.libx265:
                        case FFmpegVideoCodec.hevc_nvenc:
                        case FFmpegVideoCodec.hevc_amf:
                        case FFmpegVideoCodec.hevc_qsv:
                            args.Append("-tag:v hvc1 "); // https://trac.ffmpeg.org/wiki/Encode/H.265#FinalCutandApplestuffcompatibility
                            break;
                    }
                }
            }

            if (FFmpeg.IsAudioSourceSelected)
            {
                switch (FFmpeg.AudioCodec)
                {
                    case FFmpegAudioCodec.libvoaacenc: // http://trac.ffmpeg.org/wiki/Encode/AAC
                        args.Append($"-c:a aac -ac 2 -b:a {FFmpeg.AAC_Bitrate}k "); // -ac 2 required otherwise failing with 7.1
                        break;
                    case FFmpegAudioCodec.libopus: // https://www.ffmpeg.org/ffmpeg-codecs.html#libopus-1
                        args.Append($"-c:a libopus -b:a {FFmpeg.Opus_Bitrate}k ");
                        break;
                    case FFmpegAudioCodec.libvorbis: // http://trac.ffmpeg.org/wiki/TheoraVorbisEncodingGuide
                        args.Append($"-c:a libvorbis -qscale:a {FFmpeg.Vorbis_QScale} ");
                        break;
                    case FFmpegAudioCodec.libmp3lame: // http://trac.ffmpeg.org/wiki/Encode/MP3
                        args.Append($"-c:a libmp3lame -qscale:a {FFmpeg.MP3_QScale} ");
                        break;
                }
            }

            if (Duration > 0)
            {
                string duration = isCustom ? "$duration$" : Duration.ToString("0.0", CultureInfo.InvariantCulture);
                args.Append($"-t {duration} "); // duration limit
            }

            args.Append("-y "); // overwrite file

            string output = isCustom ? "$output$" : Path.ChangeExtension(OutputPath, IsLossless ? "mp4" : FFmpeg.Extension);
            args.Append($"\"{output}\"");

            return args.ToString();
        }

        private void AppendInputDevice(StringBuilder args, string inputDevice, bool audioSource)
        {
            args.Append($"-f {inputDevice} ");
            args.Append("-thread_queue_size 1024 "); // This option sets the maximum number of queued packets when reading from the file or device.
            args.Append("-rtbufsize 256M "); // Default real time buffer size is 3041280 (3M)

            if (audioSource)
            {
                args.Append("-audio_buffer_size 80 "); // Set audio device buffer size in milliseconds (which can directly impact latency, depending on the device).
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: AnnotationOptions.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Shapes/AnnotationOptions.cs

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
using System.Collections.Generic;
using System.Drawing;

namespace ShareX.ScreenCaptureLib
{
    public class AnnotationOptions
    {
        public static readonly string DefaultFont = "Arial";
        public static readonly Color PrimaryColor = Color.FromArgb(242, 60, 60);
        public static readonly Color SecondaryColor = Color.White;
        public static readonly Color TransparentColor = Color.FromArgb(0, 0, 0, 0);

        // Region
        public int RegionCornerRadius { get; set; } = 0;

        // Drawing
        public Color BorderColor { get; set; } = PrimaryColor;
        public int BorderSize { get; set; } = 4;
        public BorderStyle BorderStyle { get; set; } = BorderStyle.Solid;
        public Color FillColor { get; set; } = TransparentColor;
        public int DrawingCornerRadius { get; set; } = 3;
        public bool Shadow { get; set; } = true;
        public Color ShadowColor { get; set; } = Color.FromArgb(125, 0, 0, 0);
        public Point ShadowOffset { get; set; } = new Point(0, 1);

        // Line, arrow drawing
        public int LineCenterPointCount { get; set; } = 1;

        // Arrow drawing
        public ArrowHeadDirection ArrowHeadDirection { get; set; } = ArrowHeadDirection.End;

        // Text (Outline) drawing
        public TextDrawingOptions TextOutlineOptions { get; set; } = new TextDrawingOptions()
        {
            Color = SecondaryColor,
            Size = 25,
            Bold = true
        };
        public Color TextOutlineBorderColor { get; set; } = PrimaryColor;
        public int TextOutlineBorderSize { get; set; } = 5;

        // Text (Background) drawing
        public TextDrawingOptions TextOptions { get; set; } = new TextDrawingOptions()
        {
            Color = SecondaryColor,
            Size = 18
        };
        public Color TextBorderColor { get; set; } = SecondaryColor;
        public int TextBorderSize { get; set; } = 0;
        public Color TextFillColor { get; set; } = PrimaryColor;

        // Image drawing
        public ImageInterpolationMode ImageInterpolationMode = ImageInterpolationMode.NearestNeighbor;
        public string LastImageFilePath { get; set; }

        // Step drawing
        public Color StepBorderColor { get; set; } = SecondaryColor;
        public int StepBorderSize { get; set; } = 0;
        public Color StepFillColor { get; set; } = PrimaryColor;
        public int StepFontSize { get; set; } = 18;
        public StepType StepType { get; set; } = StepType.Numbers;

        // Magnify drawing
        public int MagnifyStrength { get; set; } = 200;

        // Sticker drawing
        public List<StickerPackInfo> StickerPacks = new List<StickerPackInfo>()
        {
            new StickerPackInfo(@"Stickers\BlobEmoji", "Blob Emoji")
        };
        public int SelectedStickerPack = 0;
        public int StickerSize { get; set; } = 64;
        public string LastStickerPath { get; set; }

        // Blur effect
        public int BlurRadius { get; set; } = 35;

        // Pixelate effect
        public int PixelateSize { get; set; } = 15;

        // Highlight effect
        public Color HighlightColor { get; set; } = Color.Yellow;

        // Spotlight tool
        public int SpotlightDim { get; set; } = 30;
        public int SpotlightBlur { get; set; } = 10;
        public bool SpotlightEllipse { get; set; } = false;

        // Cut out tool
        public CutOutEffectType CutOutEffectType { get; set; } = CutOutEffectType.None;
        public int CutOutEffectSize { get; set; } = 10;
        public Color CutOutBackgroundColor { get; set; } = Color.Transparent;
    }
}
```

--------------------------------------------------------------------------------

````
