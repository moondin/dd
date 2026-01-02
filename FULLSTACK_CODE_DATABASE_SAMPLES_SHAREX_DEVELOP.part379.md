---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 379
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 379 of 650)

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

---[FILE: ImageHistoryForm.cs]---
Location: ShareX-develop/ShareX.HistoryLib/Forms/ImageHistoryForm.cs

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

using Manina.Windows.Forms;
using ShareX.HelpersLib;
using ShareX.HistoryLib.Forms;
using ShareX.HistoryLib.Properties;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ShareX.HistoryLib
{
    public partial class ImageHistoryForm : Form
    {
        public HistoryManagerSQLite HistoryManager { get; private set; }
        public ImageHistorySettings Settings { get; private set; }
        public string SearchText { get; set; }
        public bool SearchInTags { get; set; } = true;

        private HistoryItemManager him;
        private string defaultTitle;
        private List<HistoryItem> allHistoryItems;
        private int index;

        public ImageHistoryForm(HistoryManagerSQLite historyManager, ImageHistorySettings settings, Action<string> uploadFile = null,
            Action<string> editImage = null, Action<string> pinToScreen = null, Action<string> analyzeImage = null)
        {
            InitializeComponent();
            tsMain.Renderer = new ToolStripRoundedEdgeRenderer();

            HistoryManager = historyManager;
            Settings = settings;

            ilvImages.SetRenderer(new HistoryImageListViewRenderer());
            ilvImages.ThumbnailSize = Settings.ThumbnailSize;
            ilvImages.BorderStyle = BorderStyle.None;

            him = new HistoryItemManager(uploadFile, editImage, pinToScreen, analyzeImage);
            him.GetHistoryItems += him_GetHistoryItems;
            him.FavoriteRequested += him_FavoriteRequested;
            him.EditRequested += him_EditRequested;
            him.DeleteRequested += him_DeleteRequested;
            him.DeleteFileRequested += him_DeleteFileRequested;
            ilvImages.ContextMenuStrip = him.cmsHistory;

            defaultTitle = Text;

            tstbSearch.TextBox.HandleCreated += (sender, e) => tstbSearch.TextBox.SetWatermark(Resources.HistoryForm_Search_Watermark, true);

            if (Settings.RememberSearchText)
            {
                tstbSearch.Text = Settings.SearchText;
            }

            ShareXResources.ApplyTheme(this, true);

            if (Settings.RememberWindowState)
            {
                Settings.WindowState.ApplyFormState(this);
            }

            tsbFavorites.Checked = Settings.Favorites;
        }

        private void UpdateTitle(int total, int filtered)
        {
            Text = $"{defaultTitle} ({Resources.Total}: {total:N0} - {Resources.Filtered}: {filtered:N0})";
        }

        private async Task RefreshHistoryItems(bool refreshItems = true)
        {
            if (refreshItems)
            {
                allHistoryItems = await GetHistoryItems();
            }

            tstbSearch.AutoCompleteCustomSource.Clear();

            if (allHistoryItems.Count > 0)
            {
                tstbSearch.AutoCompleteCustomSource.AddRange(allHistoryItems.Select(x => x.TagsProcessName).Where(x => !string.IsNullOrWhiteSpace(x)).Distinct().ToArray());
            }

            ApplyFilter();
        }

        private void DeleteHistoryItems(HistoryItem[] historyItems)
        {
            if (historyItems != null && historyItems.Length > 0)
            {
                foreach (HistoryItem hi in historyItems)
                {
                    if (hi != null)
                    {
                        allHistoryItems.Remove(hi);
                    }
                }
            }
        }

        private void UpdateSearchText()
        {
            SearchText = tstbSearch.Text;

            if (Settings.RememberSearchText)
            {
                Settings.SearchText = SearchText;
            }
            else
            {
                Settings.SearchText = "";
            }
        }

        private async Task<List<HistoryItem>> GetHistoryItems()
        {
            List<HistoryItem> historyItems = await HistoryManager.GetHistoryItemsAsync();
            historyItems.Reverse();
            return historyItems;
        }

        private void ApplyFilter(bool reset = true)
        {
            UpdateSearchText();

            if (reset)
            {
                ilvImages.Items.Clear();
            }

            List<HistoryItem> filteredHistoryItems = new List<HistoryItem>();

            Regex regex = null;

            if (!string.IsNullOrEmpty(SearchText))
            {
                string pattern = Regex.Escape(SearchText).Replace("\\?", ".").Replace("\\*", ".*");
                regex = new Regex(pattern, RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);
            }

            if (reset)
            {
                index = 0;
            }

            int i = index;

            for (; i < allHistoryItems.Count; i++)
            {
                HistoryItem hi = allHistoryItems[i];

                if (Settings.Favorites)
                {
                    if (hi.Favorite)
                    {
                        filteredHistoryItems.Add(hi);
                    }
                }
                else if (!string.IsNullOrEmpty(hi.FilePath) && (!Settings.ImageOnly || FileHelpers.IsImageFile(hi.FilePath)) &&
                    (regex == null || regex.IsMatch(hi.FileName) || (SearchInTags && hi.Tags != null &&
                    hi.Tags.Any(tag => !string.IsNullOrEmpty(tag.Value) && regex.IsMatch(tag.Value)))) &&
                    (!Settings.FilterMissingFiles || File.Exists(hi.FilePath)))
                {
                    filteredHistoryItems.Add(hi);

                    if (Settings.MaxItemCount > 0 && filteredHistoryItems.Count >= Settings.MaxItemCount)
                    {
                        break;
                    }
                }
            }

            if (filteredHistoryItems.Count > 0)
            {
                index = i + 1;

                ImageListViewItem[] ilvItems = filteredHistoryItems.Select(hi => new ImageListViewItem(hi.FilePath) { Tag = hi }).ToArray();
                ilvImages.Items.AddRange(ilvItems);

                UpdateTitle(allHistoryItems.Count, ilvImages.Items.Count);
            }
        }

        private HistoryItem[] him_GetHistoryItems()
        {
            return ilvImages.SelectedItems.Select(x => x.Tag as HistoryItem).ToArray();
        }

        private void him_FavoriteRequested(HistoryItem[] historyItems)
        {
            foreach (HistoryItem hi in historyItems)
            {
                HistoryManager.Edit(hi);
            }
        }

        private void him_EditRequested(HistoryItem hi)
        {
            HistoryManager.Edit(hi);
        }

        private async void him_DeleteRequested(HistoryItem[] historyItems)
        {
            HistoryManager.Delete(historyItems);

            DeleteHistoryItems(historyItems);
            await RefreshHistoryItems(false);
        }

        private async void him_DeleteFileRequested(HistoryItem[] historyItems)
        {
            foreach (HistoryItem historyItem in historyItems)
            {
                if (!string.IsNullOrEmpty(historyItem.FilePath) && File.Exists(historyItem.FilePath))
                {
                    File.Delete(historyItem.FilePath);
                }
            }

            HistoryManager.Delete(historyItems);

            DeleteHistoryItems(historyItems);
            await RefreshHistoryItems(false);
        }

        #region Form events

        private async void ImageHistoryForm_Shown(object sender, EventArgs e)
        {
            tstbSearch.Focus();
            this.ForceActivate();

            await RefreshHistoryItems();
        }

        private void ImageHistoryForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (Settings.RememberWindowState)
            {
                Settings.WindowState.UpdateFormState(this);
            }
        }

        private async void ImageHistoryForm_KeyDown(object sender, KeyEventArgs e)
        {
            switch (e.KeyData)
            {
                case Keys.F5:
                    await RefreshHistoryItems();
                    e.SuppressKeyPress = true;
                    break;
            }
        }

        private void ilvImages_SelectionChanged(object sender, EventArgs e)
        {
            him.UpdateSelectedHistoryItem();
        }

        private void ilvImages_ItemDoubleClick(object sender, ItemClickEventArgs e)
        {
            ImageListViewItem selectedItem = ilvImages.SelectedItems[0];
            HistoryItem hi = selectedItem.Tag as HistoryItem;

            if (FileHelpers.IsImageFile(hi.FilePath))
            {
                int currentImageIndex = selectedItem.Index;
                int modifiedImageIndex = 0;
                int halfRange = 100;
                int startIndex = Math.Max(currentImageIndex - halfRange, 0);
                int endIndex = Math.Min(startIndex + (halfRange * 2) + 1, ilvImages.Items.Count);

                List<string> filteredImages = new List<string>();

                for (int i = startIndex; i < endIndex; i++)
                {
                    string imageFilePath = ilvImages.Items[i].FileName;

                    if (i == currentImageIndex)
                    {
                        modifiedImageIndex = filteredImages.Count;
                    }

                    filteredImages.Add(imageFilePath);
                }

                ImageViewer.ShowImage(filteredImages.ToArray(), modifiedImageIndex);
            } // TODO: Translate
            else if (FileHelpers.IsTextFile(hi.FilePath) || FileHelpers.IsVideoFile(hi.FilePath) ||
                MessageBox.Show("Would you like to open this file?" + "\r\n\r\n" + hi.FilePath,
                "ShareX - Confirmation", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes)
            {
                FileHelpers.OpenFile(hi.FilePath);
            }
        }

        private void tstbSearch_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                ApplyFilter();

                e.SuppressKeyPress = true;
            }
        }

        private void tsbSearch_Click(object sender, EventArgs e)
        {
            ApplyFilter();
        }

        private async void tsbFavorites_Click(object sender, EventArgs e)
        {
            Settings.Favorites = tsbFavorites.Checked;

            await RefreshHistoryItems(false);
        }

        private void tsbShowStats_Click(object sender, EventArgs e)
        {
            string stats = HistoryHelpers.OutputStats(allHistoryItems);
            OutputBox.Show(stats, Resources.HistoryStats);
        }

        private async void tsbImportFolder_Click(object sender, EventArgs e)
        {
            using (HistoryImportForm historyImportForm = new HistoryImportForm(HistoryManager, allHistoryItems))
            {
                if (historyImportForm.ShowDialog() == DialogResult.OK)
                {
                    await RefreshHistoryItems();
                }
            }
        }

        private void tsbSettings_Click(object sender, EventArgs e)
        {
            using (ImageHistorySettingsForm form = new ImageHistorySettingsForm(Settings))
            {
                form.ShowDialog();
            }

            ilvImages.ThumbnailSize = Settings.ThumbnailSize;

            ApplyFilter();
        }

        private void ilvImages_KeyDown(object sender, KeyEventArgs e)
        {
            e.SuppressKeyPress = him.HandleKeyInput(e);
        }

        private void ilvImages_ThumbnailCached(object sender, ThumbnailCachedEventArgs e)
        {
            if (Settings.MaxItemCount > 0 && ilvImages.Items.Count >= Settings.MaxItemCount &&
                e.Item == ilvImages.Items[ilvImages.Items.Count - 1])
            {
                ApplyFilter(false);
            }
        }

        #endregion Form events
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ImageHistoryForm.de.resx]---
Location: ShareX-develop/ShareX.HistoryLib/Forms/ImageHistoryForm.de.resx

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
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - Bilderchronik</value>
  </data>
  <data name="tsbSearch.Text" xml:space="preserve">
    <value>Suchen</value>
  </data>
  <data name="tsbSearch.ToolTipText" xml:space="preserve">
    <value>Suchen</value>
  </data>
  <data name="tslSearch.Text" xml:space="preserve">
    <value>Suche:</value>
  </data>
  <data name="tsbSettings.Text" xml:space="preserve">
    <value>Einstellungen...</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

---[FILE: ImageHistoryForm.Designer.cs]---
Location: ShareX-develop/ShareX.HistoryLib/Forms/ImageHistoryForm.Designer.cs

```csharp
namespace ShareX.HistoryLib
{
    partial class ImageHistoryForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            components = new System.ComponentModel.Container();
            Manina.Windows.Forms.ImageListView.ImageListViewColumnHeader imageListViewColumnHeader1 = new Manina.Windows.Forms.ImageListView.ImageListViewColumnHeader(Manina.Windows.Forms.ColumnType.Name, "Name", 100, 0, true);
            Manina.Windows.Forms.ImageListView.ImageListViewColumnHeader imageListViewColumnHeader2 = new Manina.Windows.Forms.ImageListView.ImageListViewColumnHeader(Manina.Windows.Forms.ColumnType.FileSize, "Size", 100, 1, true);
            Manina.Windows.Forms.ImageListView.ImageListViewColumnHeader imageListViewColumnHeader3 = new Manina.Windows.Forms.ImageListView.ImageListViewColumnHeader(Manina.Windows.Forms.ColumnType.Dimensions, "Dimensions", 100, 2, true);
            Manina.Windows.Forms.ImageListView.ImageListViewColumnHeader imageListViewColumnHeader4 = new Manina.Windows.Forms.ImageListView.ImageListViewColumnHeader(Manina.Windows.Forms.ColumnType.FilePath, "Path", 100, 3, true);
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(ImageHistoryForm));
            tscMain = new System.Windows.Forms.ToolStripContainer();
            pMain = new System.Windows.Forms.Panel();
            ilvImages = new Manina.Windows.Forms.ImageListView();
            tsMain = new System.Windows.Forms.ToolStrip();
            tslSearch = new System.Windows.Forms.ToolStripLabel();
            tstbSearch = new System.Windows.Forms.ToolStripTextBox();
            tsbSearch = new System.Windows.Forms.ToolStripButton();
            tss1 = new System.Windows.Forms.ToolStripSeparator();
            tsbFavorites = new System.Windows.Forms.ToolStripButton();
            tsbShowStats = new System.Windows.Forms.ToolStripButton();
            tsbImportFolder = new System.Windows.Forms.ToolStripButton();
            tss2 = new System.Windows.Forms.ToolStripSeparator();
            tsbSettings = new System.Windows.Forms.ToolStripButton();
            ttMain = new System.Windows.Forms.ToolTip(components);
            tscMain.ContentPanel.SuspendLayout();
            tscMain.TopToolStripPanel.SuspendLayout();
            tscMain.SuspendLayout();
            pMain.SuspendLayout();
            tsMain.SuspendLayout();
            SuspendLayout();
            // 
            // tscMain
            // 
            // 
            // tscMain.ContentPanel
            // 
            tscMain.ContentPanel.Controls.Add(pMain);
            resources.ApplyResources(tscMain.ContentPanel, "tscMain.ContentPanel");
            resources.ApplyResources(tscMain, "tscMain");
            tscMain.Name = "tscMain";
            // 
            // tscMain.TopToolStripPanel
            // 
            tscMain.TopToolStripPanel.Controls.Add(tsMain);
            // 
            // pMain
            // 
            pMain.Controls.Add(ilvImages);
            resources.ApplyResources(pMain, "pMain");
            pMain.Name = "pMain";
            // 
            // ilvImages
            // 
            ilvImages.AllowDrag = true;
            ilvImages.AllowDuplicateFileNames = true;
            ilvImages.AllowItemReorder = false;
            ilvImages.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            ilvImages.CacheLimit = "100MB";
            imageListViewColumnHeader1.Comparer = null;
            imageListViewColumnHeader1.DisplayIndex = 0;
            imageListViewColumnHeader1.Grouper = null;
            imageListViewColumnHeader1.Key = "";
            imageListViewColumnHeader1.Type = Manina.Windows.Forms.ColumnType.Name;
            imageListViewColumnHeader2.Comparer = null;
            imageListViewColumnHeader2.DisplayIndex = 1;
            imageListViewColumnHeader2.Grouper = null;
            imageListViewColumnHeader2.Key = "";
            imageListViewColumnHeader2.Type = Manina.Windows.Forms.ColumnType.FileSize;
            imageListViewColumnHeader3.Comparer = null;
            imageListViewColumnHeader3.DisplayIndex = 2;
            imageListViewColumnHeader3.Grouper = null;
            imageListViewColumnHeader3.Key = "";
            imageListViewColumnHeader3.Type = Manina.Windows.Forms.ColumnType.Dimensions;
            imageListViewColumnHeader4.Comparer = null;
            imageListViewColumnHeader4.DisplayIndex = 3;
            imageListViewColumnHeader4.Grouper = null;
            imageListViewColumnHeader4.Key = "";
            imageListViewColumnHeader4.Type = Manina.Windows.Forms.ColumnType.FilePath;
            ilvImages.Columns.AddRange(new Manina.Windows.Forms.ImageListView.ImageListViewColumnHeader[] { imageListViewColumnHeader1, imageListViewColumnHeader2, imageListViewColumnHeader3, imageListViewColumnHeader4 });
            resources.ApplyResources(ilvImages, "ilvImages");
            ilvImages.Name = "ilvImages";
            ilvImages.ThumbnailSize = new System.Drawing.Size(100, 100);
            ilvImages.UseWIC = true;
            ilvImages.ItemDoubleClick += ilvImages_ItemDoubleClick;
            ilvImages.SelectionChanged += ilvImages_SelectionChanged;
            ilvImages.ThumbnailCached += ilvImages_ThumbnailCached;
            ilvImages.KeyDown += ilvImages_KeyDown;
            // 
            // tsMain
            // 
            resources.ApplyResources(tsMain, "tsMain");
            tsMain.GripStyle = System.Windows.Forms.ToolStripGripStyle.Hidden;
            tsMain.Items.AddRange(new System.Windows.Forms.ToolStripItem[] { tslSearch, tstbSearch, tsbSearch, tss1, tsbFavorites, tsbShowStats, tsbImportFolder, tss2, tsbSettings });
            tsMain.Name = "tsMain";
            // 
            // tslSearch
            // 
            tslSearch.Name = "tslSearch";
            resources.ApplyResources(tslSearch, "tslSearch");
            // 
            // tstbSearch
            // 
            tstbSearch.AutoCompleteMode = System.Windows.Forms.AutoCompleteMode.Suggest;
            tstbSearch.AutoCompleteSource = System.Windows.Forms.AutoCompleteSource.CustomSource;
            tstbSearch.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            tstbSearch.Name = "tstbSearch";
            resources.ApplyResources(tstbSearch, "tstbSearch");
            tstbSearch.KeyDown += tstbSearch_KeyDown;
            // 
            // tsbSearch
            // 
            tsbSearch.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            tsbSearch.Image = Properties.Resources.magnifier;
            resources.ApplyResources(tsbSearch, "tsbSearch");
            tsbSearch.Name = "tsbSearch";
            tsbSearch.Click += tsbSearch_Click;
            // 
            // tss1
            // 
            tss1.Name = "tss1";
            resources.ApplyResources(tss1, "tss1");
            // 
            // tsbFavorites
            // 
            tsbFavorites.CheckOnClick = true;
            tsbFavorites.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            tsbFavorites.Image = Properties.Resources.star;
            resources.ApplyResources(tsbFavorites, "tsbFavorites");
            tsbFavorites.Name = "tsbFavorites";
            tsbFavorites.Click += tsbFavorites_Click;
            // 
            // tsbShowStats
            // 
            tsbShowStats.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            tsbShowStats.Image = Properties.Resources.chart;
            resources.ApplyResources(tsbShowStats, "tsbShowStats");
            tsbShowStats.Name = "tsbShowStats";
            tsbShowStats.Click += tsbShowStats_Click;
            // 
            // tsbImportFolder
            // 
            tsbImportFolder.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            tsbImportFolder.Image = Properties.Resources.folder_search_result;
            resources.ApplyResources(tsbImportFolder, "tsbImportFolder");
            tsbImportFolder.Name = "tsbImportFolder";
            tsbImportFolder.Click += tsbImportFolder_Click;
            // 
            // tss2
            // 
            tss2.Name = "tss2";
            resources.ApplyResources(tss2, "tss2");
            // 
            // tsbSettings
            // 
            tsbSettings.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            tsbSettings.Image = Properties.Resources.gear;
            resources.ApplyResources(tsbSettings, "tsbSettings");
            tsbSettings.Name = "tsbSettings";
            tsbSettings.Click += tsbSettings_Click;
            // 
            // ImageHistoryForm
            // 
            resources.ApplyResources(this, "$this");
            AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            BackColor = System.Drawing.SystemColors.Window;
            Controls.Add(tscMain);
            Name = "ImageHistoryForm";
            FormClosing += ImageHistoryForm_FormClosing;
            Shown += ImageHistoryForm_Shown;
            KeyDown += ImageHistoryForm_KeyDown;
            tscMain.ContentPanel.ResumeLayout(false);
            tscMain.TopToolStripPanel.ResumeLayout(false);
            tscMain.TopToolStripPanel.PerformLayout();
            tscMain.ResumeLayout(false);
            tscMain.PerformLayout();
            pMain.ResumeLayout(false);
            tsMain.ResumeLayout(false);
            tsMain.PerformLayout();
            ResumeLayout(false);

        }

        #endregion

        private Manina.Windows.Forms.ImageListView ilvImages;
        private System.Windows.Forms.ToolStripContainer tscMain;
        private System.Windows.Forms.ToolStrip tsMain;
        private System.Windows.Forms.ToolStripLabel tslSearch;
        private System.Windows.Forms.ToolStripTextBox tstbSearch;
        private System.Windows.Forms.ToolStripButton tsbSearch;
        private System.Windows.Forms.ToolStripSeparator tss1;
        private System.Windows.Forms.ToolStripButton tsbSettings;
        private System.Windows.Forms.ToolStripButton tsbFavorites;
        private System.Windows.Forms.ToolStripSeparator tss2;
        private System.Windows.Forms.ToolStripButton tsbShowStats;
        private System.Windows.Forms.ToolStripButton tsbImportFolder;
        private System.Windows.Forms.Panel pMain;
        private System.Windows.Forms.ToolTip ttMain;
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ImageHistoryForm.es-MX.resx]---
Location: ShareX-develop/ShareX.HistoryLib/Forms/ImageHistoryForm.es-MX.resx

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
  <data name="$this.Text" xml:space="preserve">
    <value>ShareX - Historial de imagen</value>
  </data>
  <data name="tsbSearch.Text" xml:space="preserve">
    <value>Buscar</value>
  </data>
  <data name="tsbSearch.ToolTipText" xml:space="preserve">
    <value>Buscar</value>
  </data>
  <data name="tsbSettings.Text" xml:space="preserve">
    <value>Configuración...</value>
  </data>
  <data name="tslSearch.Text" xml:space="preserve">
    <value>Buscar:</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
