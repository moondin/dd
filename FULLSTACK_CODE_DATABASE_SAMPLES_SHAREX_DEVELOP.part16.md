---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:46Z
part: 16
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 16 of 650)

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

---[FILE: UploadInfoParser.cs]---
Location: ShareX-develop/ShareX/UploadInfoParser.cs

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
using System.IO;

namespace ShareX
{
    public class UploadInfoParser : NameParser
    {
        public const string HTMLLink = "<a href=\"$url\">$url</a>";
        public const string HTMLImage = "<img src=\"$url\">";
        public const string HTMLLinkedImage = "<a href=\"$url\"><img src=\"$thumbnailurl\"></a>";
        public const string ForumLink = "[url]$url[/url]";
        public const string ForumImage = "[img]$url[/img]";
        public const string ForumLinkedImage = "[url=$url][img]$thumbnailurl[/img][/url]";
        public const string WikiImage = "[$url]";
        public const string WikiLinkedImage = "[$url $thumbnailurl]";
        public const string MarkdownLink = "[$url]($url)";
        public const string MarkdownImage = "![]($url)";
        public const string MarkdownLinkedImage = "[![]($thumbnailurl)]($url)";

        public string Parse(TaskInfo info, string pattern)
        {
            if (info != null && !string.IsNullOrEmpty(pattern))
            {
                pattern = Parse(pattern);

                if (info.Result != null)
                {
                    string result = info.Result.ToString();

                    if (string.IsNullOrEmpty(result) && !string.IsNullOrEmpty(info.FilePath))
                    {
                        result = info.FilePath;
                    }

                    pattern = pattern.Replace("$result", result ?? "");
                    pattern = pattern.Replace("$url", info.Result.URL ?? "");
                    pattern = pattern.Replace("$shorturl", info.Result.ShortenedURL ?? "");
                    pattern = pattern.Replace("$thumbnailurl", info.Result.ThumbnailURL ?? "");
                    pattern = pattern.Replace("$deletionurl", info.Result.DeletionURL ?? "");
                }

                pattern = pattern.Replace("$filenamenoext", !string.IsNullOrEmpty(info.FileName) ? Path.GetFileNameWithoutExtension(info.FileName) : "");
                pattern = pattern.Replace("$filename", info.FileName ?? "");
                pattern = pattern.Replace("$filepath", info.FilePath ?? "");
                pattern = pattern.Replace("$folderpath", !string.IsNullOrEmpty(info.FilePath) ? Path.GetDirectoryName(info.FilePath) : "");
                pattern = pattern.Replace("$foldername", !string.IsNullOrEmpty(info.FilePath) ? Path.GetFileName(Path.GetDirectoryName(info.FilePath)) : "");
                pattern = pattern.Replace("$thumbnailfilenamenoext", !string.IsNullOrEmpty(info.ThumbnailFilePath) ? Path.GetFileNameWithoutExtension(info.ThumbnailFilePath) : "");
                pattern = pattern.Replace("$thumbnailfilename", !string.IsNullOrEmpty(info.ThumbnailFilePath) ? Path.GetFileName(info.ThumbnailFilePath) : "");

                if (info.UploadDuration != null)
                {
                    pattern = pattern.Replace("$uploadtime", info.UploadDuration.ElapsedMilliseconds.ToString());
                }
            }

            return pattern;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: UploadInfoStatus.cs]---
Location: ShareX-develop/ShareX/UploadInfoStatus.cs

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
using System.IO;

namespace ShareX
{
    public class UploadInfoStatus
    {
        public WorkerTask Task { get; private set; }

        public TaskInfo Info => Task.Info;

        public bool IsURLExist { get; private set; }
        public bool IsShortenedURLExist { get; private set; }
        public bool IsThumbnailURLExist { get; private set; }
        public bool IsDeletionURLExist { get; private set; }
        public bool IsFileURL { get; private set; }
        public bool IsImageURL { get; private set; }
        public bool IsTextURL { get; private set; }
        public bool IsFilePathValid { get; private set; }
        public bool IsFileExist { get; private set; }
        public bool IsThumbnailFilePathValid { get; private set; }
        public bool IsThumbnailFileExist { get; private set; }
        public bool IsImageFile { get; private set; }
        public bool IsTextFile { get; private set; }

        public UploadInfoStatus(WorkerTask task)
        {
            Task = task;
            Update();
        }

        public void Update()
        {
            if (Info.Result != null)
            {
                IsURLExist = !string.IsNullOrEmpty(Info.Result.URL);
                IsShortenedURLExist = !string.IsNullOrEmpty(Info.Result.ShortenedURL);
                IsThumbnailURLExist = !string.IsNullOrEmpty(Info.Result.ThumbnailURL);
                IsDeletionURLExist = !string.IsNullOrEmpty(Info.Result.DeletionURL);
                IsFileURL = IsURLExist && URLHelpers.IsFileURL(Info.Result.URL);
                IsImageURL = IsFileURL && FileHelpers.IsImageFile(Info.Result.URL);
                IsTextURL = IsFileURL && FileHelpers.IsTextFile(Info.Result.URL);
            }

            IsFilePathValid = !string.IsNullOrEmpty(Info.FilePath) && Path.HasExtension(Info.FilePath);
            IsFileExist = IsFilePathValid && File.Exists(Info.FilePath);
            IsThumbnailFilePathValid = !string.IsNullOrEmpty(Info.ThumbnailFilePath) && Path.HasExtension(Info.ThumbnailFilePath);
            IsThumbnailFileExist = IsThumbnailFilePathValid && File.Exists(Info.ThumbnailFilePath);
            IsImageFile = IsFileExist && FileHelpers.IsImageFile(Info.FilePath);
            IsTextFile = IsFileExist && FileHelpers.IsTextFile(Info.FilePath);
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: UploadManager.cs]---
Location: ShareX-develop/ShareX/UploadManager.cs

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
using ShareX.IndexerLib;
using ShareX.Properties;
using ShareX.UploadersLib;
using System;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using System.Web;
using System.Windows.Forms;

namespace ShareX
{
    public static class UploadManager
    {
        public static void UploadFile(string filePath, TaskSettings taskSettings = null)
        {
            if (taskSettings == null) taskSettings = TaskSettings.GetDefaultTaskSettings();

            if (!string.IsNullOrEmpty(filePath))
            {
                if (File.Exists(filePath))
                {
                    WorkerTask task = WorkerTask.CreateFileUploaderTask(filePath, taskSettings);
                    TaskManager.Start(task);
                }
                else if (Directory.Exists(filePath))
                {
                    string[] files = Directory.GetFiles(filePath, "*.*", SearchOption.AllDirectories);
                    UploadFile(files, taskSettings);
                }
            }
        }

        public static void UploadFile(string[] files, TaskSettings taskSettings = null)
        {
            if (taskSettings == null) taskSettings = TaskSettings.GetDefaultTaskSettings();

            if (files != null && files.Length > 0)
            {
                if (files.Length <= 10 || IsUploadConfirmed(files.Length))
                {
                    foreach (string file in files)
                    {
                        UploadFile(file, taskSettings);
                    }
                }
            }
        }

        private static bool IsUploadConfirmed(int length)
        {
            if (Program.Settings.ShowMultiUploadWarning)
            {
                using (MyMessageBox msgbox = new MyMessageBox(string.Format(Resources.UploadManager_IsUploadConfirmed_Are_you_sure_you_want_to_upload__0__files_, length),
                    "ShareX - " + Resources.UploadManager_IsUploadConfirmed_Upload_files,
                    MessageBoxButtons.YesNo, Resources.UploadManager_IsUploadConfirmed_Don_t_show_this_message_again_))
                {
                    msgbox.ShowDialog();
                    Program.Settings.ShowMultiUploadWarning = !msgbox.IsChecked;
                    return msgbox.DialogResult == DialogResult.Yes;
                }
            }

            return true;
        }

        public static void UploadFile(TaskSettings taskSettings = null)
        {
            using (OpenFileDialog ofd = new OpenFileDialog())
            {
                ofd.Title = "ShareX - " + Resources.UploadManager_UploadFile_File_upload;

                if (!string.IsNullOrEmpty(Program.Settings.FileUploadDefaultDirectory) && Directory.Exists(Program.Settings.FileUploadDefaultDirectory))
                {
                    ofd.InitialDirectory = Program.Settings.FileUploadDefaultDirectory;
                }
                else
                {
                    ofd.InitialDirectory = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
                }

                ofd.Multiselect = true;

                if (ofd.ShowDialog() == DialogResult.OK)
                {
                    if (!string.IsNullOrEmpty(ofd.FileName))
                    {
                        Program.Settings.FileUploadDefaultDirectory = Path.GetDirectoryName(ofd.FileName);
                    }

                    UploadFile(ofd.FileNames, taskSettings);
                }
            }
        }

        public static void UploadFolder(TaskSettings taskSettings = null)
        {
            string initialDirectory;
            if (!string.IsNullOrEmpty(Program.Settings.FileUploadDefaultDirectory) && Directory.Exists(Program.Settings.FileUploadDefaultDirectory))
            {
                initialDirectory = Program.Settings.FileUploadDefaultDirectory;
            }
            else
            {
                initialDirectory = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
            }
            string selectedPath = FileHelpers.BrowseFolder("ShareX - " + Resources.UploadManager_UploadFolder_Folder_upload, initialDirectory);

            if (!string.IsNullOrEmpty(selectedPath))
            {
                Program.Settings.FileUploadDefaultDirectory = selectedPath;
                UploadFile(selectedPath, taskSettings);
            }
        }

        public static void ProcessImageUpload(Bitmap bmp, TaskSettings taskSettings)
        {
            if (bmp != null)
            {
                if (!taskSettings.AdvancedSettings.ProcessImagesDuringClipboardUpload)
                {
                    taskSettings.AfterCaptureJob = AfterCaptureTasks.UploadImageToHost;
                }

                RunImageTask(bmp, taskSettings);
            }
        }

        public static void ProcessTextUpload(string text, TaskSettings taskSettings)
        {
            if (!string.IsNullOrEmpty(text))
            {
                string url = text.Trim();

                if (URLHelpers.IsValidURL(url))
                {
                    if (taskSettings.UploadSettings.ClipboardUploadURLContents)
                    {
                        DownloadAndUploadFile(url, taskSettings);
                        return;
                    }

                    if (taskSettings.UploadSettings.ClipboardUploadShortenURL)
                    {
                        ShortenURL(url, taskSettings);
                        return;
                    }

                    if (taskSettings.UploadSettings.ClipboardUploadShareURL)
                    {
                        ShareURL(url, taskSettings);
                        return;
                    }
                }

                if (taskSettings.UploadSettings.ClipboardUploadAutoIndexFolder && text.Length <= 260 && Directory.Exists(text))
                {
                    IndexFolder(text, taskSettings);
                }
                else
                {
                    UploadText(text, taskSettings, true);
                }
            }
        }

        public static void ProcessFilesUpload(string[] files, TaskSettings taskSettings)
        {
            if (files != null && files.Length > 0)
            {
                UploadFile(files, taskSettings);
            }
        }

        public static void ClipboardUpload(TaskSettings taskSettings = null)
        {
            if (taskSettings == null) taskSettings = TaskSettings.GetDefaultTaskSettings();

            try
            {
                if (Clipboard.ContainsImage())
                {
                    Bitmap image;

                    if (HelpersOptions.UseAlternativeClipboardGetImage)
                    {
                        image = ClipboardHelpers.GetImageAlternative2();
                    }
                    else
                    {
                        image = (Bitmap)Clipboard.GetImage();
                    }

                    ProcessImageUpload(image, taskSettings);
                }
                else if (Clipboard.ContainsText())
                {
                    string text = Clipboard.GetText();

                    ProcessTextUpload(text, taskSettings);
                }
                else if (Clipboard.ContainsFileDropList())
                {
                    string[] files = Clipboard.GetFileDropList().Cast<string>().ToArray();

                    ProcessFilesUpload(files, taskSettings);
                }
            }
            catch (ExternalException e)
            {
                DebugHelper.WriteException(e);

                if (MessageBox.Show("\"" + e.Message + "\"\r\n\r\n" + Resources.WouldYouLikeToRetryClipboardUpload, "ShareX - " + Resources.ClipboardUpload,
                    MessageBoxButtons.YesNo, MessageBoxIcon.Warning) == DialogResult.Yes)
                {
                    ClipboardUpload(taskSettings);
                }
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
            }
        }

        public static void ClipboardUploadWithContentViewer(TaskSettings taskSettings = null)
        {
            if (taskSettings == null) taskSettings = TaskSettings.GetDefaultTaskSettings();

            using (ClipboardUploadForm clipboardUploadForm = new ClipboardUploadForm(taskSettings))
            {
                clipboardUploadForm.ShowDialog();
            }
        }

        public static void ClipboardUploadMainWindow(TaskSettings taskSettings = null)
        {
            if (taskSettings == null) taskSettings = TaskSettings.GetDefaultTaskSettings();

            if (Program.Settings.ShowClipboardContentViewer)
            {
                using (ClipboardUploadForm clipboardUploadForm = new ClipboardUploadForm(taskSettings, true))
                {
                    clipboardUploadForm.ShowDialog();
                    Program.Settings.ShowClipboardContentViewer = !clipboardUploadForm.DontShowThisWindow;
                }
            }
            else
            {
                ClipboardUpload(taskSettings);
            }
        }

        public static void ShowTextUploadDialog(TaskSettings taskSettings = null)
        {
            if (taskSettings == null) taskSettings = TaskSettings.GetDefaultTaskSettings();

            using (TextUploadForm form = new TextUploadForm())
            {
                if (form.ShowDialog() == DialogResult.OK)
                {
                    string text = form.Content;

                    if (!string.IsNullOrEmpty(text))
                    {
                        UploadText(text, taskSettings);
                    }
                }
            }
        }

        public static void DragDropUpload(IDataObject data, TaskSettings taskSettings = null)
        {
            if (taskSettings == null) taskSettings = TaskSettings.GetDefaultTaskSettings();

            if (data.GetDataPresent(DataFormats.FileDrop, false))
            {
                string[] files = data.GetData(DataFormats.FileDrop, false) as string[];
                UploadFile(files, taskSettings);
            }
            else if (data.GetDataPresent(DataFormats.Bitmap, false))
            {
                Bitmap bmp = data.GetData(DataFormats.Bitmap, false) as Bitmap;
                RunImageTask(bmp, taskSettings);
            }
            else if (data.GetDataPresent(DataFormats.Text, false))
            {
                string text = data.GetData(DataFormats.Text, false) as string;
                UploadText(text, taskSettings, true);
            }
        }

        public static void UploadURL(TaskSettings taskSettings = null)
        {
            if (taskSettings == null) taskSettings = TaskSettings.GetDefaultTaskSettings();

            string inputText = null;

            string text = ClipboardHelpers.GetText(true);

            if (URLHelpers.IsValidURL(text))
            {
                inputText = text;
            }

            string url = InputBox.Show(Resources.UploadManager_UploadURL_URL_to_download_from_and_upload, inputText);

            if (!string.IsNullOrEmpty(url))
            {
                DownloadAndUploadFile(url, taskSettings);
            }
        }

        public static void ShowShortenURLDialog(TaskSettings taskSettings = null)
        {
            if (taskSettings == null) taskSettings = TaskSettings.GetDefaultTaskSettings();

            string inputText = null;

            string text = ClipboardHelpers.GetText(true);

            if (URLHelpers.IsValidURL(text))
            {
                inputText = text;
            }

            string url = InputBox.Show(Resources.UploadManager_ShowShortenURLDialog_ShortenURL, inputText, Resources.UploadManager_ShowShortenURLDialog_Shorten);

            if (!string.IsNullOrEmpty(url))
            {
                ShortenURL(url, taskSettings);
            }
        }

        public static void RunImageTask(Bitmap bmp, TaskSettings taskSettings, bool skipQuickTaskMenu = false, bool skipAfterCaptureWindow = false)
        {
            TaskMetadata metadata = new TaskMetadata(bmp);
            RunImageTask(metadata, taskSettings, skipQuickTaskMenu, skipAfterCaptureWindow);
        }

        public static void RunImageTask(TaskMetadata metadata, TaskSettings taskSettings, bool skipQuickTaskMenu = false, bool skipAfterCaptureWindow = false)
        {
            if (taskSettings == null) taskSettings = TaskSettings.GetDefaultTaskSettings();

            if (metadata != null && metadata.Image != null && taskSettings != null)
            {
                if (!skipQuickTaskMenu && taskSettings.AfterCaptureJob.HasFlag(AfterCaptureTasks.ShowQuickTaskMenu))
                {
                    QuickTaskMenu quickTaskMenu = new QuickTaskMenu();

                    quickTaskMenu.TaskInfoSelected += taskInfo =>
                    {
                        if (taskInfo == null)
                        {
                            RunImageTask(metadata, taskSettings, true);
                        }
                        else if (taskInfo.IsValid)
                        {
                            taskSettings.AfterCaptureJob = taskInfo.AfterCaptureTasks;
                            taskSettings.AfterUploadJob = taskInfo.AfterUploadTasks;
                            RunImageTask(metadata, taskSettings, true);
                        }
                    };

                    quickTaskMenu.ShowMenu();

                    return;
                }

                string customFileName = null;

                if (!skipAfterCaptureWindow && !TaskHelpers.ShowAfterCaptureForm(taskSettings, out customFileName, metadata))
                {
                    return;
                }

                WorkerTask task = WorkerTask.CreateImageUploaderTask(metadata, taskSettings, customFileName);
                TaskManager.Start(task);
            }
        }

        public static void UploadImage(Bitmap bmp, TaskSettings taskSettings = null)
        {
            if (bmp != null)
            {
                if (taskSettings == null)
                {
                    taskSettings = TaskSettings.GetDefaultTaskSettings();
                }

                if (taskSettings.IsSafeTaskSettings)
                {
                    taskSettings.UseDefaultAfterCaptureJob = false;
                    taskSettings.AfterCaptureJob = AfterCaptureTasks.UploadImageToHost;
                }

                RunImageTask(bmp, taskSettings);
            }
        }

        public static void UploadImage(Bitmap bmp, ImageDestination imageDestination, FileDestination imageFileDestination, TaskSettings taskSettings = null)
        {
            if (bmp != null)
            {
                if (taskSettings == null)
                {
                    taskSettings = TaskSettings.GetDefaultTaskSettings();
                }

                if (taskSettings.IsSafeTaskSettings)
                {
                    taskSettings.UseDefaultAfterCaptureJob = false;
                    taskSettings.AfterCaptureJob = AfterCaptureTasks.UploadImageToHost;
                    taskSettings.UseDefaultDestinations = false;
                    taskSettings.ImageDestination = imageDestination;
                    taskSettings.ImageFileDestination = imageFileDestination;
                }

                RunImageTask(bmp, taskSettings);
            }
        }

        public static void UploadText(string text, TaskSettings taskSettings = null, bool allowCustomText = false)
        {
            if (taskSettings == null) taskSettings = TaskSettings.GetDefaultTaskSettings();

            if (!string.IsNullOrEmpty(text))
            {
                if (allowCustomText)
                {
                    string input = taskSettings.AdvancedSettings.TextCustom;

                    if (!string.IsNullOrEmpty(input))
                    {
                        if (taskSettings.AdvancedSettings.TextCustomEncodeInput)
                        {
                            text = HttpUtility.HtmlEncode(text);
                        }

                        text = input.Replace("%input", text);
                    }
                }

                WorkerTask task = WorkerTask.CreateTextUploaderTask(text, taskSettings);
                TaskManager.Start(task);
            }
        }

        public static void UploadImageStream(Stream stream, string fileName, TaskSettings taskSettings = null)
        {
            if (taskSettings == null) taskSettings = TaskSettings.GetDefaultTaskSettings();

            if (stream != null && stream.Length > 0 && !string.IsNullOrEmpty(fileName))
            {
                WorkerTask task = WorkerTask.CreateDataUploaderTask(EDataType.Image, stream, fileName, taskSettings);
                TaskManager.Start(task);
            }
        }

        public static void ShortenURL(string url, TaskSettings taskSettings = null)
        {
            if (!string.IsNullOrEmpty(url))
            {
                if (taskSettings == null) taskSettings = TaskSettings.GetDefaultTaskSettings();

                WorkerTask task = WorkerTask.CreateURLShortenerTask(url, taskSettings);
                TaskManager.Start(task);
            }
        }

        public static void ShortenURL(string url, UrlShortenerType urlShortener)
        {
            if (!string.IsNullOrEmpty(url))
            {
                TaskSettings taskSettings = TaskSettings.GetDefaultTaskSettings();
                taskSettings.URLShortenerDestination = urlShortener;

                WorkerTask task = WorkerTask.CreateURLShortenerTask(url, taskSettings);
                TaskManager.Start(task);
            }
        }

        public static void ShareURL(string url, TaskSettings taskSettings = null)
        {
            if (!string.IsNullOrEmpty(url))
            {
                if (taskSettings == null) taskSettings = TaskSettings.GetDefaultTaskSettings();

                WorkerTask task = WorkerTask.CreateShareURLTask(url, taskSettings);
                TaskManager.Start(task);
            }
        }

        public static void ShareURL(string url, URLSharingServices urlSharingService)
        {
            if (!string.IsNullOrEmpty(url))
            {
                TaskSettings taskSettings = TaskSettings.GetDefaultTaskSettings();
                taskSettings.URLSharingServiceDestination = urlSharingService;

                WorkerTask task = WorkerTask.CreateShareURLTask(url, taskSettings);
                TaskManager.Start(task);
            }
        }

        public static void DownloadFile(string url, TaskSettings taskSettings = null)
        {
            DownloadFile(url, false, taskSettings);
        }

        public static void DownloadAndUploadFile(string url, TaskSettings taskSettings = null)
        {
            DownloadFile(url, true, taskSettings);
        }

        private static void DownloadFile(string url, bool upload, TaskSettings taskSettings = null)
        {
            if (!string.IsNullOrEmpty(url))
            {
                if (taskSettings == null) taskSettings = TaskSettings.GetDefaultTaskSettings();

                WorkerTask task = WorkerTask.CreateDownloadTask(url, upload, taskSettings);

                if (task != null)
                {
                    TaskManager.Start(task);
                }
            }
        }

        public static void IndexFolder(TaskSettings taskSettings = null)
        {
            string selectedPath = FileHelpers.BrowseFolder();

            if (!string.IsNullOrEmpty(selectedPath))
            {
                IndexFolder(selectedPath, taskSettings);
            }
        }

        public static void IndexFolder(string folderPath, TaskSettings taskSettings = null)
        {
            if (!string.IsNullOrEmpty(folderPath) && Directory.Exists(folderPath))
            {
                if (taskSettings == null) taskSettings = TaskSettings.GetDefaultTaskSettings();

                taskSettings.ToolsSettings.IndexerSettings.BinaryUnits = Program.Settings.BinaryUnits;

                string source = null;

                Task.Run(() =>
                {
                    source = Indexer.Index(folderPath, taskSettings.ToolsSettings.IndexerSettings);
                }).ContinueInCurrentContext(() =>
                {
                    if (!string.IsNullOrEmpty(source))
                    {
                        WorkerTask task = WorkerTask.CreateTextUploaderTask(source, taskSettings);
                        task.Info.FileName = Path.ChangeExtension(task.Info.FileName, taskSettings.ToolsSettings.IndexerSettings.Output.ToString().ToLower());
                        TaskManager.Start(task);
                    }
                });
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: WatchFolder.cs]---
Location: ShareX-develop/ShareX/WatchFolder.cs

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
using System.IO;
using System.Threading;

namespace ShareX
{
    public class WatchFolder : IDisposable
    {
        public WatchFolderSettings Settings { get; set; }
        public TaskSettings TaskSettings { get; set; }

        public delegate void FileWatcherTriggerEventHandler(string path);

        public event FileWatcherTriggerEventHandler FileWatcherTrigger;

        private SynchronizationContext context;
        private FileSystemWatcher fileWatcher;
        private List<WatchFolderDuplicateEventTimer> timers = new List<WatchFolderDuplicateEventTimer>();

        public virtual void Enable()
        {
            Dispose();

            string folderPath = FileHelpers.ExpandFolderVariables(Settings.FolderPath);

            if (!string.IsNullOrEmpty(folderPath) && Directory.Exists(folderPath))
            {
                context = SynchronizationContext.Current ?? new SynchronizationContext();

                fileWatcher = new FileSystemWatcher(folderPath);
                if (!string.IsNullOrEmpty(Settings.Filter)) fileWatcher.Filter = Settings.Filter;
                fileWatcher.IncludeSubdirectories = Settings.IncludeSubdirectories;
                fileWatcher.Created += fileWatcher_Created;
                fileWatcher.EnableRaisingEvents = true;
            }
        }

        protected void OnFileWatcherTrigger(string path)
        {
            FileWatcherTrigger?.Invoke(path);
        }

        private async void fileWatcher_Created(object sender, FileSystemEventArgs e)
        {
            CleanElapsedTimers();

            string path = e.FullPath;

            foreach (WatchFolderDuplicateEventTimer timer in timers)
            {
                if (timer.IsDuplicateEvent(path))
                {
                    return;
                }
            }

            timers.Add(new WatchFolderDuplicateEventTimer(path));

            int successCount = 0;
            long previousSize = -1;

            await Helpers.WaitWhileAsync(() =>
            {
                if (!FileHelpers.IsFileLocked(path))
                {
                    long currentSize = FileHelpers.GetFileSize(path);

                    if (currentSize > 0 && currentSize == previousSize)
                    {
                        successCount++;
                    }

                    previousSize = currentSize;
                    return successCount < 4;
                }

                previousSize = -1;
                return true;
            }, 250, 5000, () =>
            {
                context.Post(state => OnFileWatcherTrigger(path), null);
            }, 1000);
        }

        protected void CleanElapsedTimers()
        {
            for (int i = 0; i < timers.Count; i++)
            {
                if (timers[i].IsElapsed)
                {
                    timers.Remove(timers[i]);
                }
            }
        }

        public void Dispose()
        {
            if (fileWatcher != null)
            {
                fileWatcher.Dispose();
            }
        }
    }

    public class WatchFolderDuplicateEventTimer
    {
        private const int expireTime = 1000;

        private Stopwatch timer;
        private string path;

        public bool IsElapsed
        {
            get
            {
                return timer.ElapsedMilliseconds >= expireTime;
            }
        }

        public WatchFolderDuplicateEventTimer(string path)
        {
            timer = Stopwatch.StartNew();
            this.path = path;
        }

        public bool IsDuplicateEvent(string path)
        {
            bool result = path == this.path && !IsElapsed;
            if (result)
            {
                timer = Stopwatch.StartNew();
            }
            return result;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: WatchFolderManager.cs]---
Location: ShareX-develop/ShareX/WatchFolderManager.cs

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
using System.IO;
using System.Linq;

namespace ShareX
{
    public class WatchFolderManager : IDisposable
    {
        public List<WatchFolder> WatchFolders { get; private set; }

        public void UpdateWatchFolders()
        {
            if (WatchFolders != null)
            {
                UnregisterAllWatchFolders();
            }

            WatchFolders = new List<WatchFolder>();

            foreach (WatchFolderSettings defaultWatchFolderSetting in Program.DefaultTaskSettings.WatchFolderList)
            {
                AddWatchFolder(defaultWatchFolderSetting, Program.DefaultTaskSettings);
            }

            foreach (HotkeySettings hotkeySetting in Program.HotkeysConfig.Hotkeys)
            {
                foreach (WatchFolderSettings watchFolderSetting in hotkeySetting.TaskSettings.WatchFolderList)
                {
                    AddWatchFolder(watchFolderSetting, hotkeySetting.TaskSettings);
                }
            }
        }

        private WatchFolder FindWatchFolder(WatchFolderSettings watchFolderSetting)
        {
            return WatchFolders.FirstOrDefault(watchFolder => watchFolder.Settings == watchFolderSetting);
        }

        private bool IsExist(WatchFolderSettings watchFolderSetting)
        {
            return FindWatchFolder(watchFolderSetting) != null;
        }

        public void AddWatchFolder(WatchFolderSettings watchFolderSetting, TaskSettings taskSettings)
        {
            if (!IsExist(watchFolderSetting))
            {
                if (!taskSettings.WatchFolderList.Contains(watchFolderSetting))
                {
                    taskSettings.WatchFolderList.Add(watchFolderSetting);
                }

                WatchFolder watchFolder = new WatchFolder();
                watchFolder.Settings = watchFolderSetting;
                watchFolder.TaskSettings = taskSettings;

                watchFolder.FileWatcherTrigger += origPath =>
                {
                    TaskSettings taskSettingsCopy = TaskSettings.GetSafeTaskSettings(taskSettings);
                    string destPath = origPath;

                    if (watchFolderSetting.MoveFilesToScreenshotsFolder)
                    {
                        string screenshotsFolder = TaskHelpers.GetScreenshotsFolder(taskSettingsCopy);
                        string fileName = Path.GetFileName(origPath);
                        destPath = TaskHelpers.HandleExistsFile(screenshotsFolder, fileName, taskSettingsCopy);
                        FileHelpers.CreateDirectoryFromFilePath(destPath);
                        File.Move(origPath, destPath);
                    }

                    UploadManager.UploadFile(destPath, taskSettingsCopy);
                };

                WatchFolders.Add(watchFolder);

                if (taskSettings.WatchFolderEnabled)
                {
                    watchFolder.Enable();
                }
            }
        }

        public void RemoveWatchFolder(WatchFolderSettings watchFolderSetting)
        {
            using (WatchFolder watchFolder = FindWatchFolder(watchFolderSetting))
            {
                if (watchFolder != null)
                {
                    watchFolder.TaskSettings.WatchFolderList.Remove(watchFolderSetting);
                    WatchFolders.Remove(watchFolder);
                }
            }
        }

        public void UpdateWatchFolderState(WatchFolderSettings watchFolderSetting)
        {
            WatchFolder watchFolder = FindWatchFolder(watchFolderSetting);
            if (watchFolder != null)
            {
                if (watchFolder.TaskSettings.WatchFolderEnabled)
                {
                    watchFolder.Enable();
                }
                else
                {
                    watchFolder.Dispose();
                }
            }
        }

        public void UnregisterAllWatchFolders()
        {
            if (WatchFolders != null)
            {
                foreach (WatchFolder watchFolder in WatchFolders)
                {
                    if (watchFolder != null)
                    {
                        watchFolder.Dispose();
                    }
                }
            }
        }

        public void Dispose()
        {
            UnregisterAllWatchFolders();
        }
    }
}
```

--------------------------------------------------------------------------------

````
