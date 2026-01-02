---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 366
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 366 of 650)

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

---[FILE: HistoryManager.cs]---
Location: ShareX-develop/ShareX.HistoryLib/HistoryManager.cs

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
using ShareX.HistoryLib.Properties;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ShareX.HistoryLib
{
    public abstract class HistoryManager
    {
        public string FilePath { get; private set; }
        public string BackupFolder { get; set; }
        public bool CreateBackup { get; set; }
        public bool CreateWeeklyBackup { get; set; }

        public HistoryManager(string filePath)
        {
            FilePath = filePath;
        }

        public List<HistoryItem> GetHistoryItems()
        {
            try
            {
                return Load();
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);

                MessageBox.Show(Resources.ErrorOccuredWhileReadingHistoryFile + " " + FilePath + "\r\n\r\n" + e,
                    "ShareX - " + Resources.HistoryManager_GetHistoryItems_Error, MessageBoxButtons.OK, MessageBoxIcon.Error);
            }

            return new List<HistoryItem>();
        }

        public async Task<List<HistoryItem>> GetHistoryItemsAsync()
        {
            return await Task.Run(GetHistoryItems);
        }

        public bool AppendHistoryItem(HistoryItem historyItem)
        {
            return AppendHistoryItems(new HistoryItem[] { historyItem });
        }

        public bool AppendHistoryItems(IEnumerable<HistoryItem> historyItems)
        {
            try
            {
                return Append(historyItems.Where(IsValidHistoryItem));
            }
            catch (Exception e)
            {
                DebugHelper.WriteException(e);
            }

            return false;
        }

        private bool IsValidHistoryItem(HistoryItem historyItem)
        {
            return historyItem != null && !string.IsNullOrEmpty(historyItem.FileName) && historyItem.DateTime != DateTime.MinValue &&
                (!string.IsNullOrEmpty(historyItem.URL) || !string.IsNullOrEmpty(historyItem.FilePath));
        }

        internal List<HistoryItem> Load()
        {
            return Load(FilePath);
        }

        internal abstract List<HistoryItem> Load(string filePath);

        protected bool Append(IEnumerable<HistoryItem> historyItems)
        {
            return Append(FilePath, historyItems);
        }

        protected abstract bool Append(string filePath, IEnumerable<HistoryItem> historyItems);

        protected void Backup(string filePath)
        {
            if (!string.IsNullOrEmpty(BackupFolder))
            {
                if (CreateBackup)
                {
                    FileHelpers.CopyFile(filePath, BackupFolder);
                }

                if (CreateWeeklyBackup)
                {
                    FileHelpers.BackupFileWeekly(filePath, BackupFolder);
                }
            }
        }

        public void Test(int itemCount)
        {
            Test(FilePath, itemCount);
        }

        public void Test(string filePath, int itemCount)
        {
            HistoryItem historyItem = new HistoryItem()
            {
                FileName = "Example.png",
                FilePath = @"C:\ShareX\Screenshots\Example.png",
                DateTime = DateTime.Now,
                Type = "Image",
                Host = "Imgur",
                URL = "https://example.com/Example.png",
                ThumbnailURL = "https://example.com/Example.png",
                DeletionURL = "https://example.com/Example.png",
                ShortenedURL = "https://example.com/Example.png"
            };

            HistoryItem[] historyItems = new HistoryItem[itemCount];
            for (int i = 0; i < itemCount; i++)
            {
                historyItems[i] = historyItem;
            }

            Thread.Sleep(1000);

            DebugTimer saveTimer = new DebugTimer($"Saved {itemCount} items");
            Append(filePath, historyItems);
            saveTimer.WriteElapsedMilliseconds();

            Thread.Sleep(1000);

            DebugTimer loadTimer = new DebugTimer($"Loaded {itemCount} items");
            Load(filePath);
            loadTimer.WriteElapsedMilliseconds();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: HistoryManagerJSON.cs]---
Location: ShareX-develop/ShareX.HistoryLib/HistoryManagerJSON.cs

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
using Newtonsoft.Json.Linq;
using ShareX.HelpersLib;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace ShareX.HistoryLib
{
    public class HistoryManagerJSON : HistoryManager
    {
        private static readonly object thisLock = new object();

        public HistoryManagerJSON(string filePath) : base(filePath)
        {
        }

        internal override List<HistoryItem> Load(string filePath)
        {
            if (!string.IsNullOrEmpty(filePath) && File.Exists(filePath))
            {
                lock (thisLock)
                {
                    string json = File.ReadAllText(filePath, Encoding.UTF8);

                    if (!string.IsNullOrEmpty(json))
                    {
                        json = "[" + json + "]";

                        return JsonConvert.DeserializeObject<List<HistoryItem>>(json);
                    }
                }
            }

            return new List<HistoryItem>();
        }

        protected override bool Append(string filePath, IEnumerable<HistoryItem> historyItems)
        {
            if (!string.IsNullOrEmpty(filePath))
            {
                lock (thisLock)
                {
                    FileHelpers.CreateDirectoryFromFilePath(filePath);

                    using (FileStream fileStream = new FileStream(filePath, FileMode.Append, FileAccess.Write, FileShare.Read, 4096, FileOptions.WriteThrough))
                    using (StreamWriter streamWriter = new StreamWriter(fileStream))
                    {
                        JsonSerializer serializer = new JsonSerializer();
                        serializer.DefaultValueHandling = DefaultValueHandling.Ignore;

                        bool firstObject = fileStream.Length == 0;

                        foreach (HistoryItem historyItem in historyItems)
                        {
                            string json = "";

                            if (!firstObject)
                            {
                                json += ",\r\n";
                            }

                            json += JObject.FromObject(historyItem, serializer).ToString();

                            streamWriter.Write(json);

                            firstObject = false;
                        }
                    }

                    Backup(FilePath);
                }

                return true;
            }

            return false;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: HistoryManagerMock.cs]---
Location: ShareX-develop/ShareX.HistoryLib/HistoryManagerMock.cs

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
using System.Linq;

namespace ShareX.HistoryLib
{
    public class HistoryManagerMock : HistoryManager
    {
        private int itemCount = 10000;

        public HistoryManagerMock(string filePath) : base(filePath)
        {
        }

        internal override List<HistoryItem> Load(string filePath)
        {
            List<HistoryItem> items = new List<HistoryItem>();

            for (int i = 0; i < itemCount; i++)
            {
                items.Add(CreateMockHistoryItem());
            }

            return items.OrderBy(x => x.DateTime).ToList();
        }

        private HistoryItem CreateMockHistoryItem()
        {
            string fileName = $"ShareX_{Helpers.GetRandomAlphanumeric(10)}.png";

            HistoryItem historyItem = new HistoryItem()
            {
                FileName = fileName,
                FilePath = @"..\..\..\ShareX.HelpersLib\Resources\ShareX_Logo.png",
                DateTime = DateTime.Now.AddSeconds(-RandomFast.Next(0, 1000000)),
                Type = "Image",
                Host = "Amazon S3",
                URL = "https://i.example.com/" + fileName,
                ThumbnailURL = "https://t.example.com/" + fileName,
                DeletionURL = "https://d.example.com/" + fileName,
                ShortenedURL = "https://s.example.com/" + fileName
            };

            return historyItem;
        }

        protected override bool Append(string filePath, IEnumerable<HistoryItem> historyItems)
        {
            return true;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: HistoryManagerSQLite.cs]---
Location: ShareX-develop/ShareX.HistoryLib/HistoryManagerSQLite.cs

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

using Microsoft.Data.Sqlite;
using Newtonsoft.Json;
using ShareX.HelpersLib;
using System;
using System.Collections.Generic;

namespace ShareX.HistoryLib
{
    public class HistoryManagerSQLite : HistoryManager, IDisposable
    {
        private SqliteConnection connection;

        public HistoryManagerSQLite(string filePath) : base(filePath)
        {
            Connect(filePath);
            EnsureDatabase();
        }

        private void Connect(string filePath)
        {
            FileHelpers.CreateDirectoryFromFilePath(filePath);

            string connectionString = $"Data Source={filePath}";
            connection = new SqliteConnection(connectionString);
            connection.Open();

            SetBusyTimeout(5000);
        }

        private void SetBusyTimeout(int milliseconds)
        {
            using (SqliteCommand cmd = connection.CreateCommand())
            {
                cmd.CommandText = $"PRAGMA busy_timeout = {milliseconds};";
                cmd.ExecuteNonQuery();
            }
        }

        private void EnsureDatabase()
        {
            using (SqliteCommand cmd = connection.CreateCommand())
            {
                cmd.CommandText = @"
CREATE TABLE IF NOT EXISTS History (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    FileName TEXT,
    FilePath TEXT,
    DateTime TEXT,
    Type TEXT,
    Host TEXT,
    URL TEXT,
    ThumbnailURL TEXT,
    DeletionURL TEXT,
    ShortenedURL TEXT,
    Tags TEXT
);
";
                cmd.ExecuteNonQuery();
            }
        }

        internal override List<HistoryItem> Load(string dbPath)
        {
            List<HistoryItem> items = new List<HistoryItem>();

            using (SqliteCommand cmd = new SqliteCommand("SELECT * FROM History;", connection))
            using (SqliteDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    HistoryItem item = new HistoryItem()
                    {
                        Id = (long)reader["Id"],
                        FileName = reader["FileName"].ToString(),
                        FilePath = reader["FilePath"].ToString(),
                        DateTime = DateTime.Parse(reader["DateTime"].ToString()),
                        Type = reader["Type"].ToString(),
                        Host = reader["Host"].ToString(),
                        URL = reader["URL"].ToString(),
                        ThumbnailURL = reader["ThumbnailURL"].ToString(),
                        DeletionURL = reader["DeletionURL"].ToString(),
                        ShortenedURL = reader["ShortenedURL"].ToString(),
                        Tags = JsonConvert.DeserializeObject<Dictionary<string, string>>(reader["Tags"]?.ToString() ?? "{}")
                    };

                    items.Add(item);
                }
            }

            return items;
        }

        protected override bool Append(string dbPath, IEnumerable<HistoryItem> historyItems)
        {
            using (SqliteTransaction transaction = connection.BeginTransaction())
            {
                foreach (HistoryItem item in historyItems)
                {
                    using (SqliteCommand cmd = connection.CreateCommand())
                    {
                        cmd.CommandText = @"
INSERT INTO History
(FileName, FilePath, DateTime, Type, Host, URL, ThumbnailURL, DeletionURL, ShortenedURL, Tags)
VALUES (@FileName, @FilePath, @DateTime, @Type, @Host, @URL, @ThumbnailURL, @DeletionURL, @ShortenedURL, @Tags);
SELECT last_insert_rowid();";
                        cmd.Parameters.AddWithValue("@FileName", item.FileName ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@FilePath", item.FilePath ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@DateTime", item.DateTime.ToString("o") ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Type", item.Type ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Host", item.Host ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@URL", item.URL ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@ThumbnailURL", item.ThumbnailURL ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@DeletionURL", item.DeletionURL ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@ShortenedURL", item.ShortenedURL ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Tags", item.Tags != null ? JsonConvert.SerializeObject(item.Tags) : (object)DBNull.Value);
                        item.Id = (long)cmd.ExecuteScalar();
                    }
                }

                transaction.Commit();
            }

            return true;
        }

        public void Edit(HistoryItem item)
        {
            using (SqliteTransaction transaction = connection.BeginTransaction())
            using (SqliteCommand cmd = connection.CreateCommand())
            {
                cmd.CommandText = @"
UPDATE History SET
FileName = @FileName,
FilePath = @FilePath,
DateTime = @DateTime,
Type = @Type,
Host = @Host,
URL = @URL,
ThumbnailURL = @ThumbnailURL,
DeletionURL = @DeletionURL,
ShortenedURL = @ShortenedURL,
Tags = @Tags
WHERE Id = @Id;";
                cmd.Parameters.AddWithValue("@FileName", item.FileName ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@FilePath", item.FilePath ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@DateTime", item.DateTime.ToString("o") ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Type", item.Type ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Host", item.Host ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@URL", item.URL ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@ThumbnailURL", item.ThumbnailURL ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@DeletionURL", item.DeletionURL ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@ShortenedURL", item.ShortenedURL ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Tags", item.Tags != null ? JsonConvert.SerializeObject(item.Tags) : (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Id", item.Id);
                cmd.ExecuteNonQuery();

                transaction.Commit();
            }
        }

        public void Delete(params HistoryItem[] items)
        {
            if (items != null && items.Length > 0)
            {
                using (SqliteTransaction transaction = connection.BeginTransaction())
                using (SqliteCommand cmd = connection.CreateCommand())
                {
                    cmd.CommandText = "DELETE FROM History WHERE Id = @Id;";
                    SqliteParameter idParam = cmd.CreateParameter();
                    idParam.ParameterName = "@Id";
                    cmd.Parameters.Add(idParam);

                    foreach (HistoryItem item in items)
                    {
                        idParam.Value = item.Id;
                        cmd.ExecuteNonQuery();
                    }

                    transaction.Commit();
                }
            }
        }

        public void MigrateFromJSON(string jsonFilePath)
        {
            HistoryManagerJSON jsonManager = new HistoryManagerJSON(jsonFilePath);
            List<HistoryItem> items = jsonManager.Load(jsonFilePath);

            if (items.Count > 0)
            {
                Append(items);
            }
        }

        public void Dispose()
        {
            connection?.Dispose();
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: HistoryManagerXML.cs]---
Location: ShareX-develop/ShareX.HistoryLib/HistoryManagerXML.cs

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
using System.Text;
using System.Xml;
using System.Xml.Linq;

namespace ShareX.HistoryLib
{
    public class HistoryManagerXML : HistoryManager
    {
        private static readonly object thisLock = new object();

        public HistoryManagerXML(string filePath) : base(filePath)
        {
        }

        internal override List<HistoryItem> Load(string filePath)
        {
            List<HistoryItem> historyItemList = new List<HistoryItem>();

            if (!string.IsNullOrEmpty(filePath) && File.Exists(filePath))
            {
                lock (thisLock)
                {
                    XmlReaderSettings settings = new XmlReaderSettings
                    {
                        ConformanceLevel = ConformanceLevel.Auto,
                        IgnoreWhitespace = true
                    };

                    using (StreamReader streamReader = new StreamReader(filePath, Encoding.UTF8))
                    using (XmlReader reader = XmlReader.Create(streamReader, settings))
                    {
                        reader.MoveToContent();

                        while (!reader.EOF)
                        {
                            if (reader.NodeType == XmlNodeType.Element && reader.Name == "HistoryItem")
                            {
                                if (XNode.ReadFrom(reader) is XElement element)
                                {
                                    HistoryItem hi = ParseHistoryItem(element);
                                    historyItemList.Add(hi);
                                }
                            }
                            else
                            {
                                reader.Read();
                            }
                        }
                    }
                }
            }

            return historyItemList;
        }

        private HistoryItem ParseHistoryItem(XElement element)
        {
            HistoryItem hi = new HistoryItem();

            foreach (XElement child in element.Elements())
            {
                string name = child.Name.LocalName;

                switch (name)
                {
                    case "Filename":
                        hi.FileName = child.Value;
                        break;
                    case "Filepath":
                        hi.FilePath = child.Value;
                        break;
                    case "DateTimeUtc":
                        DateTime dateTime;
                        if (DateTime.TryParse(child.Value, out dateTime))
                        {
                            hi.DateTime = dateTime;
                        }
                        break;
                    case "Type":
                        hi.Type = child.Value;
                        break;
                    case "Host":
                        hi.Host = child.Value;
                        break;
                    case "URL":
                        hi.URL = child.Value;
                        break;
                    case "ThumbnailURL":
                        hi.ThumbnailURL = child.Value;
                        break;
                    case "DeletionURL":
                        hi.DeletionURL = child.Value;
                        break;
                    case "ShortenedURL":
                        hi.ShortenedURL = child.Value;
                        break;
                }
            }

            return hi;
        }

        protected override bool Append(string filePath, IEnumerable<HistoryItem> historyItems)
        {
            if (!string.IsNullOrEmpty(filePath))
            {
                lock (thisLock)
                {
                    FileHelpers.CreateDirectoryFromFilePath(filePath);

                    using (FileStream fileStream = new FileStream(filePath, FileMode.Append, FileAccess.Write, FileShare.Read, 4096, FileOptions.WriteThrough))
                    using (XmlTextWriter writer = new XmlTextWriter(fileStream, Encoding.UTF8))
                    {
                        writer.Formatting = Formatting.Indented;
                        writer.Indentation = 4;

                        foreach (HistoryItem historyItem in historyItems)
                        {
                            writer.WriteStartElement("HistoryItem");
                            writer.WriteElementIfNotEmpty("Filename", historyItem.FileName);
                            writer.WriteElementIfNotEmpty("Filepath", historyItem.FilePath);
                            writer.WriteElementIfNotEmpty("DateTimeUtc", historyItem.DateTime.ToString("o"));
                            writer.WriteElementIfNotEmpty("Type", historyItem.Type);
                            writer.WriteElementIfNotEmpty("Host", historyItem.Host);
                            writer.WriteElementIfNotEmpty("URL", historyItem.URL);
                            writer.WriteElementIfNotEmpty("ThumbnailURL", historyItem.ThumbnailURL);
                            writer.WriteElementIfNotEmpty("DeletionURL", historyItem.DeletionURL);
                            writer.WriteElementIfNotEmpty("ShortenedURL", historyItem.ShortenedURL);
                            writer.WriteEndElement();
                        }

                        writer.WriteWhitespace(Environment.NewLine);
                    }

                    Backup(FilePath);
                }

                return true;
            }

            return false;
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: HistorySettings.cs]---
Location: ShareX-develop/ShareX.HistoryLib/HistorySettings.cs

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

namespace ShareX.HistoryLib
{
    public class HistorySettings
    {
        public bool RememberWindowState { get; set; } = true;
        public WindowState WindowState { get; set; } = new WindowState();
        public int SplitterDistance { get; set; } = 550;
        public bool RememberSearchText { get; set; } = false;
        public string SearchText { get; set; } = "";
        public bool Favorites { get; set; } = false;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ImageHistorySettings.cs]---
Location: ShareX-develop/ShareX.HistoryLib/ImageHistorySettings.cs

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
using System.Drawing;

namespace ShareX.HistoryLib
{
    public class ImageHistorySettings
    {
        public bool RememberWindowState { get; set; } = true;
        public WindowState WindowState { get; set; } = new WindowState();
        public Size ThumbnailSize { get; set; } = new Size(250, 250);
        public int MaxItemCount { get; set; } = 500;
        public bool FilterMissingFiles { get; set; } = false;
        public bool ImageOnly { get; set; } = true;
        public bool RememberSearchText { get; set; } = false;
        public string SearchText { get; set; } = "";
        public bool Favorites { get; set; } = false;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ShareX.HistoryLib.csproj]---
Location: ShareX-develop/ShareX.HistoryLib/ShareX.HistoryLib.csproj

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
    <PackageReference Include="Microsoft.Data.Sqlite" Version="10.0.0" />
    <PackageReference Include="Microsoft.Data.Sqlite.Core" Version="10.0.0" />
  </ItemGroup>
  <ItemGroup>
    <ProjectReference Include="..\ShareX.HelpersLib\ShareX.HelpersLib.csproj" />
  </ItemGroup>
  <ItemGroup>
    <Reference Include="ImageListView">
      <HintPath>..\Libs\ImageListView.dll</HintPath>
    </Reference>
  </ItemGroup>
</Project>
```

--------------------------------------------------------------------------------

---[FILE: HistoryForm.ar-YE.resx]---
Location: ShareX-develop/ShareX.HistoryLib/Forms/HistoryForm.ar-YE.resx

```text
<?xml version="1.0" encoding="utf-8"?>
<root>
  <!-- 
    Microsoft ResX Schema 
    
    Version 2.0
    
    The primary goals of this format is to allow a simple XML format 
    that is mostly human readable. The generation and parsing of the 
    various data types are done through the TypeConverter classes 
    associated with the data types.
    
    Example:
    
    ... ado.net/XML headers & schema ...
    <resheader name="resmimetype">text/microsoft-resx</resheader>
    <resheader name="version">2.0</resheader>
    <resheader name="reader">System.Resources.ResXResourceReader, System.Windows.Forms, ...</resheader>
    <resheader name="writer">System.Resources.ResXResourceWriter, System.Windows.Forms, ...</resheader>
    <data name="Name1"><value>this is my long string</value><comment>this is a comment</comment></data>
    <data name="Color1" type="System.Drawing.Color, System.Drawing">Blue</data>
    <data name="Bitmap1" mimetype="application/x-microsoft.net.object.binary.base64">
        <value>[base64 mime encoded serialized .NET Framework object]</value>
    </data>
    <data name="Icon1" type="System.Drawing.Icon, System.Drawing" mimetype="application/x-microsoft.net.object.bytearray.base64">
        <value>[base64 mime encoded string representing a byte array form of the .NET Framework object]</value>
        <comment>This is a comment</comment>
    </data>
                
    There are any number of "resheader" rows that contain simple 
    name/value pairs.
    
    Each data row contains a name, and value. The row also contains a 
    type or mimetype. Type corresponds to a .NET class that support 
    text/value conversion through the TypeConverter architecture. 
    Classes that don't support this are serialized and stored with the 
    mimetype set.
    
    The mimetype is used for serialized objects, and tells the 
    ResXResourceReader how to depersist the object. This is currently not 
    extensible. For a given mimetype the value must be set accordingly:
    
    Note - application/x-microsoft.net.object.binary.base64 is the format 
    that the ResXResourceWriter will generate, however the reader can 
    read any of the formats listed below.
    
    mimetype: application/x-microsoft.net.object.binary.base64
    value   : The object must be serialized with 
            : System.Runtime.Serialization.Formatters.Binary.BinaryFormatter
            : and then encoded with base64 encoding.
    
    mimetype: application/x-microsoft.net.object.soap.base64
    value   : The object must be serialized with 
            : System.Runtime.Serialization.Formatters.Soap.SoapFormatter
            : and then encoded with base64 encoding.

    mimetype: application/x-microsoft.net.object.bytearray.base64
    value   : The object must be serialized into a byte array 
            : using a System.ComponentModel.TypeConverter
            : and then encoded with base64 encoding.
    -->
  <xsd:schema id="root" xmlns="" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
    <xsd:import namespace="http://www.w3.org/XML/1998/namespace" />
    <xsd:element name="root" msdata:IsDataSet="true">
      <xsd:complexType>
        <xsd:choice maxOccurs="unbounded">
          <xsd:element name="metadata">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element name="value" type="xsd:string" minOccurs="0" />
              </xsd:sequence>
              <xsd:attribute name="name" use="required" type="xsd:string" />
              <xsd:attribute name="type" type="xsd:string" />
              <xsd:attribute name="mimetype" type="xsd:string" />
              <xsd:attribute ref="xml:space" />
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="assembly">
            <xsd:complexType>
              <xsd:attribute name="alias" type="xsd:string" />
              <xsd:attribute name="name" type="xsd:string" />
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="data">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element name="value" type="xsd:string" minOccurs="0" msdata:Ordinal="1" />
                <xsd:element name="comment" type="xsd:string" minOccurs="0" msdata:Ordinal="2" />
              </xsd:sequence>
              <xsd:attribute name="name" type="xsd:string" use="required" msdata:Ordinal="1" />
              <xsd:attribute name="type" type="xsd:string" msdata:Ordinal="3" />
              <xsd:attribute name="mimetype" type="xsd:string" msdata:Ordinal="4" />
              <xsd:attribute ref="xml:space" />
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="resheader">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element name="value" type="xsd:string" minOccurs="0" msdata:Ordinal="1" />
              </xsd:sequence>
              <xsd:attribute name="name" type="xsd:string" use="required" />
            </xsd:complexType>
          </xsd:element>
        </xsd:choice>
      </xsd:complexType>
    </xsd:element>
  </xsd:schema>
  <resheader name="resmimetype">
    <value>text/microsoft-resx</value>
  </resheader>
  <resheader name="version">
    <value>2.0</value>
  </resheader>
  <resheader name="reader">
    <value>System.Resources.ResXResourceReader, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value>
  </resheader>
  <resheader name="writer">
    <value>System.Resources.ResXResourceWriter, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value>
  </resheader>
  <data name="lblFilterFrom.Text" xml:space="preserve">
    <value>من:</value>
  </data>
  <data name="gbAdvancedSearch.Text" xml:space="preserve">
    <value>بحث متقدّم</value>
  </data>
  <data name="tsbAdvancedSearch.Text" xml:space="preserve">
    <value>بحث متقدّم...</value>
  </data>
  <data name="btnAdvancedSearchClose.Text" xml:space="preserve">
    <value>إغلاق</value>
  </data>
  <data name="chDateTime.Text" xml:space="preserve">
    <value>التأريخ</value>
  </data>
  <data name="cbDateFilter.Text" xml:space="preserve">
    <value>التأريخ:</value>
  </data>
  <data name="chFilename.Text" xml:space="preserve">
    <value>اسم الملف</value>
  </data>
  <data name="lblFilenameFilter.Text" xml:space="preserve">
    <value>اسم الملف:</value>
  </data>
  <data name="tsbSettings.Text" xml:space="preserve">
    <value>الإعدادات...</value>
  </data>
  <data name="tsbSearch.Text" xml:space="preserve">
    <value>بحث</value>
  </data>
  <data name="tslSearch.Text" xml:space="preserve">
    <value>بحث:</value>
  </data>
  <data name="btnAdvancedSearchReset.Text" xml:space="preserve">
    <value>إعادة تعيين</value>
  </data>
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - السجل</value>
  </data>
  <data name="lblFilterTo.Text" xml:space="preserve">
    <value>إلى:</value>
  </data>
  <data name="tsbToggleMoreInfo.Text" xml:space="preserve">
    <value>عرض/إخفاء المعلومات الإضافية</value>
  </data>
  <data name="cbTypeFilter.Text" xml:space="preserve">
    <value>النوع:</value>
  </data>
  <data name="cbHostFilter.Text" xml:space="preserve">
    <value>المضيف:</value>
  </data>
  <data name="lblURLFilter.Text" xml:space="preserve">
    <value>عنوان URL:</value>
  </data>
  <data name="chURL.Text" xml:space="preserve">
    <value>عنوان URL</value>
  </data>
  <data name="tsbShowStats.Text" xml:space="preserve">
    <value>عرض الإحصائيات...</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
