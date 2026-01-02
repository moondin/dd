---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 367
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 367 of 650)

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

---[FILE: HistoryForm.cs]---
Location: ShareX-develop/ShareX.HistoryLib/Forms/HistoryForm.cs

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
using ShareX.HistoryLib.Forms;
using ShareX.HistoryLib.Properties;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ShareX.HistoryLib
{
    public partial class HistoryForm : Form
    {
        public HistoryManagerSQLite HistoryManager { get; private set; }
        public HistorySettings Settings { get; private set; }

        private HistoryItemManager him;
        private List<HistoryItem> allHistoryItems;
        private HistoryItem[] filteredHistoryItems;
        private string defaultTitle;
        private Dictionary<string, string> typeNamesLocaleLookup;
        private string[] allTypeNames;
        private ListViewItem[] listViewCache;
        private int listViewCacheStartIndex;
        private bool busy;

        public HistoryForm(HistoryManagerSQLite historyManager, HistorySettings settings, Action<string> uploadFile = null,
            Action<string> editImage = null, Action<string> pinToScreen = null, Action<string> analyzeImage = null)
        {
            HistoryManager = historyManager;
            Settings = settings;

            InitializeComponent();
            tsHistory.Renderer = new ToolStripRoundedEdgeRenderer();

            defaultTitle = Text;

            string[] typeNames = Enum.GetNames(typeof(EDataType));
            string[] typeTranslations = Helpers.GetLocalizedEnumDescriptions<EDataType>();
            typeNamesLocaleLookup = typeNames.Zip(typeTranslations, (key, val) => new { key, val }).ToDictionary(e => e.key, e => e.val);

            UpdateTitle();

            ImageList il = new ImageList();
            il.ColorDepth = ColorDepth.Depth32Bit;
            il.Images.Add(Resources.image);
            il.Images.Add(Resources.notebook);
            il.Images.Add(Resources.application_block);
            il.Images.Add(Resources.globe);
            il.Images.Add(Resources.star);
            lvHistory.SmallImageList = il;

            him = new HistoryItemManager(uploadFile, editImage, pinToScreen, analyzeImage);
            him.GetHistoryItems += him_GetHistoryItems;
            him.FavoriteRequested += him_FavoriteRequested;
            him.EditRequested += him_EditRequested;
            him.DeleteRequested += him_DeleteRequested;
            him.DeleteFileRequested += him_DeleteFileRequested;
            lvHistory.ContextMenuStrip = him.cmsHistory;

            pbThumbnail.Reset();
            lvHistory.FillLastColumn();

            tstbSearch.TextBox.HandleCreated += (sender, e) => tstbSearch.TextBox.SetWatermark(Resources.HistoryForm_Search_Watermark, true);

            if (Settings.RememberSearchText)
            {
                tstbSearch.Text = Settings.SearchText;
            }

            ShareXResources.ApplyTheme(this, true);

            if (Settings.RememberWindowState)
            {
                Settings.WindowState.ApplyFormState(this);

                if (Settings.SplitterDistance > 0)
                {
                    scMain.SplitterDistance = Settings.SplitterDistance;
                }
            }

            tsbFavorites.Checked = Settings.Favorites;
        }

        private void ResetFilters()
        {
            busy = true;

            txtFilenameFilter.ResetText();
            txtURLFilter.ResetText();
            cbDateFilter.Checked = false;
            dtpFilterFrom.ResetText();
            dtpFilterTo.ResetText();
            cbTypeFilter.Checked = false;
            if (cbTypeFilterSelection.Items.Count > 0)
            {
                cbTypeFilterSelection.SelectedIndex = 0;
            }
            cbHostFilter.Checked = false;
            cbHostFilterSelection.ResetText();

            busy = false;
        }

        private async Task RefreshHistoryItems(bool refreshItems = true)
        {
            if (refreshItems)
            {
                allHistoryItems = await GetHistoryItems();
            }

            cbTypeFilterSelection.Items.Clear();
            cbHostFilterSelection.Items.Clear();
            tstbSearch.AutoCompleteCustomSource.Clear();

            if (allHistoryItems.Count > 0)
            {
                allTypeNames = allHistoryItems.Select(x => x.Type).Where(x => !string.IsNullOrWhiteSpace(x)).Distinct().ToArray();
                cbTypeFilterSelection.Items.AddRange(allTypeNames.Select(x => typeNamesLocaleLookup.TryGetValue(x, out string value) ? value : x).ToArray());
                cbHostFilterSelection.Items.AddRange(allHistoryItems.Select(x => x.Host).Where(x => !string.IsNullOrWhiteSpace(x)).Distinct().ToArray());
                tstbSearch.AutoCompleteCustomSource.AddRange(allHistoryItems.Select(x => x.TagsProcessName).Where(x => !string.IsNullOrWhiteSpace(x)).Distinct().ToArray());
            }

            ApplyFilterSimple();

            ResetFilters();
        }

        private HistoryItem[] him_GetHistoryItems()
        {
            return lvHistory.SelectedIndices.Cast<int>().Select(i => filteredHistoryItems[i]).ToArray();
        }

        private void him_FavoriteRequested(HistoryItem[] historyItems)
        {
            foreach (HistoryItem hi in historyItems)
            {
                HistoryManager.Edit(hi);

                EditListViewItem(hi);
            }
        }

        private void him_EditRequested(HistoryItem hi)
        {
            HistoryManager.Edit(hi);

            EditListViewItem(hi);
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

        private async Task<List<HistoryItem>> GetHistoryItems()
        {
            List<HistoryItem> historyItems = await HistoryManager.GetHistoryItemsAsync();
            historyItems.Reverse();
            return historyItems;
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

        private void ApplyFilter(HistoryFilter filter)
        {
            if (allHistoryItems != null && allHistoryItems.Count > 0)
            {
                IEnumerable<HistoryItem> historyItems = filter.ApplyFilter(allHistoryItems);
                filteredHistoryItems = historyItems.ToArray();

                UpdateTitle(filteredHistoryItems);

                listViewCache = null;
                listViewCacheStartIndex = 0;
                lvHistory.VirtualListSize = 0;

                if (filteredHistoryItems.Length > 0)
                {
                    lvHistory.VirtualListSize = filteredHistoryItems.Length;
                    lvHistory.SelectedIndices.Add(0);
                }
            }
        }

        private void ApplyFilterSimple()
        {
            string searchText = tstbSearch.Text;

            if (Settings.RememberSearchText)
            {
                Settings.SearchText = searchText;
            }
            else
            {
                Settings.SearchText = "";
            }

            HistoryFilter filter = new HistoryFilter()
            {
                Filename = searchText,
                FilterFavorites = Settings.Favorites
            };

            ApplyFilter(filter);
        }

        private void ApplyFilterAdvanced()
        {
            HistoryFilter filter = new HistoryFilter()
            {
                Filename = txtFilenameFilter.Text,
                URL = txtURLFilter.Text,
                FilterDate = cbDateFilter.Checked,
                FromDate = dtpFilterFrom.Value.Date,
                ToDate = dtpFilterTo.Value.Date,
                FilterHost = cbHostFilter.Checked,
                Host = cbHostFilterSelection.Text
            };

            if (cbTypeFilter.Checked && allTypeNames.IsValidIndex(cbTypeFilterSelection.SelectedIndex))
            {
                filter.FilterType = true;
                filter.Type = allTypeNames[cbTypeFilterSelection.SelectedIndex];
            }

            ApplyFilter(filter);
        }

        private ListViewItem CreateListViewItem(int index)
        {
            HistoryItem hi = filteredHistoryItems[index];

            ListViewItem lvi = new ListViewItem();
            EditListViewItem(hi, lvi);
            return lvi;
        }

        private void EditListViewItem(HistoryItem hi)
        {
            for (int i = 0; i < lvHistory.Items.Count; i++)
            {
                ListViewItem lvi = lvHistory.Items[i];

                if ((HistoryItem)lvi.Tag == hi)
                {
                    EditListViewItem(hi, lvi);
                    lvHistory.Invalidate();
                    return;
                }
            }
        }

        private void EditListViewItem(HistoryItem hi, ListViewItem lvi)
        {
            if (hi.Favorite)
            {
                lvi.ImageIndex = 4;
            }
            else if (hi.Type.Equals("Image", StringComparison.InvariantCultureIgnoreCase))
            {
                lvi.ImageIndex = 0;
            }
            else if (hi.Type.Equals("Text", StringComparison.InvariantCultureIgnoreCase))
            {
                lvi.ImageIndex = 1;
            }
            else if (hi.Type.Equals("File", StringComparison.InvariantCultureIgnoreCase))
            {
                lvi.ImageIndex = 2;
            }
            else
            {
                lvi.ImageIndex = 3;
            }

            if (lvi.SubItems.Count > 0)
            {
                lvi.SubItems.Clear();
            }

            lvi.SubItems.Add(hi.DateTime.ToString());
            lvi.SubItems.Add(hi.FileName);
            lvi.SubItems.Add(hi.URL);
            lvi.Tag = hi;
        }

        private void UpdateTitle(HistoryItem[] historyItems = null)
        {
            string title = defaultTitle;

            if (historyItems != null)
            {
                StringBuilder status = new StringBuilder();

                status.Append(" (");
                status.AppendFormat(Resources.HistoryForm_UpdateItemCount_Total___0_, allHistoryItems.Count.ToString("N0"));

                if (allHistoryItems.Count > historyItems.Length)
                {
                    status.AppendFormat(" - " + Resources.HistoryForm_UpdateItemCount___Filtered___0_, historyItems.Length.ToString("N0"));
                }

                IEnumerable<string> types = historyItems.
                    GroupBy(x => x.Type).
                    OrderByDescending(x => x.Count()).
                    Select(x => string.Format(" - {0}: {1}", typeNamesLocaleLookup.TryGetValue(x.Key, out string value) ? value : x.Key, x.Count()));

                foreach (string type in types)
                {
                    status.Append(type);
                }

                status.Append(")");
                title += status.ToString();
            }

            Text = title;
        }

        private void UpdateControls()
        {
            HistoryItem previousHistoryItem = him.HistoryItem;
            HistoryItem historyItem = him.UpdateSelectedHistoryItem();

            if (historyItem == null)
            {
                pbThumbnail.Reset();
            }
            else if (historyItem != previousHistoryItem)
            {
                UpdatePictureBox();
            }
        }

        private void UpdatePictureBox()
        {
            pbThumbnail.Reset();

            if (him != null)
            {
                if (him.IsImageFile)
                {
                    pbThumbnail.LoadImageFromFileAsync(him.HistoryItem.FilePath);
                }
                else if (him.IsImageURL)
                {
                    pbThumbnail.LoadImageFromURLAsync(him.HistoryItem.URL);
                }
            }
        }

        #region Form events

        private async void HistoryForm_Shown(object sender, EventArgs e)
        {
            this.ForceActivate();

            await RefreshHistoryItems();
        }

        private void HistoryForm_Resize(object sender, EventArgs e)
        {
            Refresh();
        }

        private void HistoryForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (Settings.RememberWindowState)
            {
                Settings.WindowState.UpdateFormState(this);
                Settings.SplitterDistance = scMain.SplitterDistance;
            }
        }

        private async void HistoryForm_KeyDown(object sender, KeyEventArgs e)
        {
            switch (e.KeyData)
            {
                case Keys.F5:
                    e.SuppressKeyPress = true;
                    await RefreshHistoryItems();
                    break;
            }
        }

        private void tstbSearch_TextChanged(object sender, EventArgs e)
        {
            ApplyFilterSimple();
        }

        private void tsbSearch_Click(object sender, EventArgs e)
        {
            ApplyFilterSimple();
        }

        private void tsbAdvancedSearch_Click(object sender, EventArgs e)
        {
            bool isPanelVisible = gbAdvancedSearch.Visible;
            gbAdvancedSearch.Visible = !isPanelVisible;
            tsbAdvancedSearch.Checked = !isPanelVisible;
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
            using (HistorySettingsForm form = new HistorySettingsForm(Settings))
            {
                form.ShowDialog();
            }
        }

        private void AdvancedFilter_ValueChanged(object sender, EventArgs e)
        {
            if (!busy)
            {
                ApplyFilterAdvanced();
            }
        }

        private void btnAdvancedSearchReset_Click(object sender, EventArgs e)
        {
            ResetFilters();
            ApplyFilterAdvanced();
        }

        private void btnAdvancedSearchClose_Click(object sender, EventArgs e)
        {
            gbAdvancedSearch.Visible = false;
            tsbAdvancedSearch.Checked = false;
        }

        private void lvHistory_RetrieveVirtualItem(object sender, RetrieveVirtualItemEventArgs e)
        {
            if (listViewCache != null && e.ItemIndex >= listViewCacheStartIndex && e.ItemIndex < listViewCacheStartIndex + listViewCache.Length)
            {
                e.Item = listViewCache[e.ItemIndex - listViewCacheStartIndex];
            }
            else
            {
                e.Item = CreateListViewItem(e.ItemIndex);
            }
        }

        private void lvHistory_CacheVirtualItems(object sender, CacheVirtualItemsEventArgs e)
        {
            if (listViewCache != null && e.StartIndex >= listViewCacheStartIndex && e.EndIndex <= listViewCacheStartIndex + listViewCache.Length)
            {
                return;
            }

            listViewCacheStartIndex = e.StartIndex;
            int length = e.EndIndex - e.StartIndex + 1;
            listViewCache = new ListViewItem[length];

            for (int i = 0; i < length; i++)
            {
                listViewCache[i] = CreateListViewItem(e.StartIndex + i);
            }
        }

        private void lvHistory_ItemSelectionChanged(object sender, ListViewItemSelectionChangedEventArgs e)
        {
            UpdateControls();
        }

        private void lvHistory_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            if (him != null && e.Button == MouseButtons.Left)
            {
                him.TryOpen();
            }
        }

        private void lvHistory_KeyDown(object sender, KeyEventArgs e)
        {
            e.SuppressKeyPress = him.HandleKeyInput(e);
        }

        private void lvHistory_ItemDrag(object sender, ItemDragEventArgs e)
        {
            List<string> selection = new List<string>();

            foreach (int index in lvHistory.SelectedIndices)
            {
                HistoryItem hi = filteredHistoryItems[index];

                if (File.Exists(hi.FilePath))
                {
                    selection.Add(hi.FilePath);
                }
            }

            if (selection.Count > 0)
            {
                DataObject data = new DataObject(DataFormats.FileDrop, selection.ToArray());
                DoDragDrop(data, DragDropEffects.Copy);
            }
        }

        private void pbThumbnail_MouseDown(object sender, MouseEventArgs e)
        {
            int currentImageIndex = lvHistory.SelectedIndex;

            if (currentImageIndex > -1 && pbThumbnail.Image != null && filteredHistoryItems != null && filteredHistoryItems.Length > 0)
            {
                pbThumbnail.Enabled = false;

                int modifiedImageIndex = 0;
                int halfRange = 100;
                int startIndex = Math.Max(currentImageIndex - halfRange, 0);
                int endIndex = Math.Min(startIndex + (halfRange * 2) + 1, filteredHistoryItems.Length);

                List<string> filteredImages = new List<string>();

                for (int i = startIndex; i < endIndex; i++)
                {
                    string imageFilePath = filteredHistoryItems[i].FilePath;

                    if (i == currentImageIndex)
                    {
                        modifiedImageIndex = filteredImages.Count;
                    }

                    filteredImages.Add(imageFilePath);
                }

                ImageViewer.ShowImage(filteredImages.ToArray(), modifiedImageIndex);

                pbThumbnail.Enabled = true;
            }
        }

        #endregion Form events
    }
}
```

--------------------------------------------------------------------------------

---[FILE: HistoryForm.de.resx]---
Location: ShareX-develop/ShareX.HistoryLib/Forms/HistoryForm.de.resx

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
    <value>ShareX - Chronik</value>
  </data>
  <data name="cbDateFilter.Text" xml:space="preserve">
    <value>Datumsfilter:</value>
  </data>
  <data name="cbHostFilter.Text" xml:space="preserve">
    <value>Hostfilter:</value>
  </data>
  <data name="cbTypeFilter.Text" xml:space="preserve">
    <value>Dateitypfilter:</value>
  </data>
  <data name="chDateTime.Text" xml:space="preserve">
    <value>Datum &amp; Uhrzeit</value>
  </data>
  <data name="chFilename.Text" xml:space="preserve">
    <value>Dateiname</value>
  </data>
  <data name="lblFilterFrom.Text" xml:space="preserve">
    <value>Von:</value>
  </data>
  <data name="lblFilterTo.Text" xml:space="preserve">
    <value>An:</value>
  </data>
  <data name="lblFilenameFilter.Text" xml:space="preserve">
    <value>Dateiname:</value>
  </data>
  <data name="chURL.Text" xml:space="preserve">
    <value>URL</value>
  </data>
  <data name="lblURLFilter.Text" xml:space="preserve">
    <value>URL:</value>
  </data>
  <data name="tslSearch.Text" xml:space="preserve">
    <value>Suchen:</value>
  </data>
  <data name="tsbSearch.Text" xml:space="preserve">
    <value>Suche</value>
  </data>
  <data name="tsbAdvancedSearch.Text" xml:space="preserve">
    <value>Erweiterte Suche...</value>
  </data>
  <data name="tsbToggleMoreInfo.Text" xml:space="preserve">
    <value>mehr Infos umschalten</value>
  </data>
  <data name="tsbShowStats.Text" xml:space="preserve">
    <value>Zeige Statistiken...</value>
  </data>
  <data name="tsbSettings.Text" xml:space="preserve">
    <value>Einstellungen...</value>
  </data>
  <data name="gbAdvancedSearch.Text" xml:space="preserve">
    <value>Erweiterte Suche</value>
  </data>
  <data name="btnAdvancedSearchClose.Text" xml:space="preserve">
    <value>Schließen</value>
  </data>
  <data name="btnAdvancedSearchReset.Text" xml:space="preserve">
    <value>Zurücksetzen</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
