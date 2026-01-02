---
source_txt: fullstack_samples/ShareX-develop
converted_utc: 2025-12-18T13:05:47Z
part: 463
parts_total: 650
---

# FULLSTACK CODE DATABASE SAMPLES ShareX-develop

## Verbatim Content (Part 463 of 650)

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

---[FILE: FFmpegOptionsForm.cs]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Forms/FFmpegOptionsForm.cs

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
using ShareX.ScreenCaptureLib.Properties;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ShareX.ScreenCaptureLib
{
    public partial class FFmpegOptionsForm : Form
    {
        public ScreenRecordingOptions Options { get; private set; }

        private bool settingsLoaded;

        public FFmpegOptionsForm(ScreenRecordingOptions options)
        {
            Options = options;

            InitializeComponent();
            ShareXResources.ApplyTheme(this, true);

            cbVideoCodec.Items.AddRange(Helpers.GetEnumDescriptions<FFmpegVideoCodec>());
            cbAudioCodec.Items.AddRange(Helpers.GetEnumDescriptions<FFmpegAudioCodec>());
            cbx264Preset.Items.AddRange(Helpers.GetEnumDescriptions<FFmpegPreset>());
            cbGIFStatsMode.Items.AddRange(Helpers.GetEnumDescriptions<FFmpegPaletteGenStatsMode>());
            cbNVENCPreset.Items.AddRange(Helpers.GetEnumDescriptions<FFmpegNVENCPreset>());
            cbNVENCTune.Items.AddRange(Helpers.GetEnumDescriptions<FFmpegNVENCTune>());
            cbGIFDither.Items.AddRange(Helpers.GetEnumDescriptions<FFmpegPaletteUseDither>());
            cbAMFUsage.Items.AddRange(Helpers.GetEnumDescriptions<FFmpegAMFUsage>());
            cbAMFQuality.Items.AddRange(Helpers.GetEnumDescriptions<FFmpegAMFQuality>());
            cbQSVPreset.Items.AddRange(Helpers.GetEnumDescriptions<FFmpegQSVPreset>());

            cbAACBitrate.Items.AddRange(Helpers.Range(64, 320, 32).Cast<object>().ToArray());
            cbOpusBitrate.Items.AddRange(Helpers.Range(32, 512, 32).Cast<object>().ToArray());
            cbVorbisQuality.Items.AddRange(Helpers.Range(0, 10).Cast<object>().ToArray());
            cbMP3Quality.Items.AddRange(Helpers.Range(9, 0).Cast<object>().ToArray());
        }

        private async Task LoadSettings()
        {
            settingsLoaded = false;

            cbUseCustomFFmpegPath.Checked = Options.FFmpeg.OverrideCLIPath;
            txtFFmpegPath.Enabled = btnFFmpegBrowse.Enabled = Options.FFmpeg.OverrideCLIPath;
            txtFFmpegPath.Text = Options.FFmpeg.CLIPath;
            txtFFmpegPath.SelectionStart = txtFFmpegPath.TextLength;

            await RefreshSourcesAsync();

#if MicrosoftStore
            btnInstallHelperDevices.Visible = false;
            btnHelperDevicesHelp.Visible = false;
            lblHelperDevices.Visible = false;
#endif

            cbVideoCodec.SelectedIndex = (int)Options.FFmpeg.VideoCodec;
            cbAudioCodec.SelectedIndex = (int)Options.FFmpeg.AudioCodec;

            txtUserArgs.Text = Options.FFmpeg.UserArgs;

            // x264
            nudx264CRF.SetValue(Options.FFmpeg.x264_CRF);
            nudx264Bitrate.SetValue(Options.FFmpeg.x264_Bitrate);
            cbx264UseBitrate.Checked = Options.FFmpeg.x264_Use_Bitrate;
            cbx264Preset.SelectedIndex = (int)Options.FFmpeg.x264_Preset;

            // VPx
            nudVP8Bitrate.SetValue(Options.FFmpeg.VPx_Bitrate);

            // Xvid
            nudXvidQscale.SetValue(Options.FFmpeg.XviD_QScale);

            // NVENC
            nudNVENCBitrate.SetValue(Options.FFmpeg.NVENC_Bitrate);
            cbNVENCPreset.SelectedIndex = (int)Options.FFmpeg.NVENC_Preset;
            cbNVENCTune.SelectedIndex = (int)Options.FFmpeg.NVENC_Tune;

            // GIF
            cbGIFStatsMode.SelectedIndex = (int)Options.FFmpeg.GIFStatsMode;
            cbGIFDither.SelectedIndex = (int)Options.FFmpeg.GIFDither;
            nudGIFBayerScale.SetValue(Options.FFmpeg.GIFBayerScale);

            // AMF
            cbAMFUsage.SelectedIndex = (int)Options.FFmpeg.AMF_Usage;
            cbAMFQuality.SelectedIndex = (int)Options.FFmpeg.AMF_Quality;
            nudAMFBitrate.SetValue(Options.FFmpeg.AMF_Bitrate);

            // QuickSync
            cbQSVPreset.SelectedIndex = (int)Options.FFmpeg.QSV_Preset;
            nudQSVBitrate.SetValue(Options.FFmpeg.QSV_Bitrate);

            // AAC
            int indexAACBitrate = cbAACBitrate.Items.IndexOf(Options.FFmpeg.AAC_Bitrate);

            if (indexAACBitrate > -1)
            {
                cbAACBitrate.SelectedIndex = indexAACBitrate;
            }
            else
            {
                cbAACBitrate.SelectedIndex = cbAACBitrate.Items.IndexOf(128);
            }

            // Opus
            int indexOpusBitrate = cbOpusBitrate.Items.IndexOf(Options.FFmpeg.Opus_Bitrate);

            if (indexOpusBitrate > -1)
            {
                cbOpusBitrate.SelectedIndex = indexOpusBitrate;
            }
            else
            {
                cbOpusBitrate.SelectedIndex = cbOpusBitrate.Items.IndexOf(128);
            }

            // Vorbis
            int indexVorbisQuality = cbVorbisQuality.Items.IndexOf(Options.FFmpeg.Vorbis_QScale);

            if (indexVorbisQuality > -1)
            {
                cbVorbisQuality.SelectedIndex = indexVorbisQuality;
            }
            else
            {
                cbVorbisQuality.SelectedIndex = cbVorbisQuality.Items.IndexOf(3);
            }

            // MP3
            int indexMP3Quality = cbMP3Quality.Items.IndexOf(Options.FFmpeg.MP3_QScale);

            if (indexMP3Quality > -1)
            {
                cbMP3Quality.SelectedIndex = indexMP3Quality;
            }
            else
            {
                cbMP3Quality.SelectedIndex = cbMP3Quality.Items.IndexOf(4);
            }

            cbCustomCommands.Checked = Options.FFmpeg.UseCustomCommands;

            if (Options.FFmpeg.UseCustomCommands)
            {
                txtCommandLinePreview.Text = Options.FFmpeg.CustomCommands;
            }

            settingsLoaded = true;

            UpdateUI();
        }

        private async Task RefreshSourcesAsync(bool selectDevices = false)
        {
            DirectShowDevices devices = null;

            await Task.Run(() =>
            {
                if (File.Exists(Options.FFmpeg.FFmpegPath))
                {
                    using (FFmpegCLIManager ffmpeg = new FFmpegCLIManager(Options.FFmpeg.FFmpegPath))
                    {
                        devices = ffmpeg.GetDirectShowDevices();
                    }
                }
            });

            if (!IsDisposed)
            {
                cbVideoSource.Items.Clear();
                cbVideoSource.Items.Add(FFmpegCaptureDevice.None);
                cbVideoSource.Items.Add(FFmpegCaptureDevice.GDIGrab);

                if (Helpers.IsWindows10OrGreater())
                {
                    cbVideoSource.Items.Add(FFmpegCaptureDevice.DDAGrab);
                }

                cbAudioSource.Items.Clear();
                cbAudioSource.Items.Add(FFmpegCaptureDevice.None);

                if (devices != null)
                {
                    cbVideoSource.Items.AddRange(devices.VideoDevices.Select(x => new FFmpegCaptureDevice(x, $"dshow ({x})")).ToArray());
                    cbAudioSource.Items.AddRange(devices.AudioDevices.Select(x => new FFmpegCaptureDevice(x, $"dshow ({x})")).ToArray());
                }

                if (selectDevices && cbVideoSource.Items.Cast<FFmpegCaptureDevice>().
                    Any(x => x.Value.Equals(FFmpegCaptureDevice.ScreenCaptureRecorder.Value, StringComparison.OrdinalIgnoreCase)))
                {
                    Options.FFmpeg.VideoSource = FFmpegCaptureDevice.ScreenCaptureRecorder.Value;
                }
                else if (!cbVideoSource.Items.Cast<FFmpegCaptureDevice>().Any(x => x.Value.Equals(Options.FFmpeg.VideoSource, StringComparison.OrdinalIgnoreCase)))
                {
                    Options.FFmpeg.VideoSource = FFmpegCaptureDevice.GDIGrab.Value;
                }

                foreach (FFmpegCaptureDevice device in cbVideoSource.Items)
                {
                    if (device.Value.Equals(Options.FFmpeg.VideoSource, StringComparison.OrdinalIgnoreCase))
                    {
                        cbVideoSource.SelectedItem = device;
                        break;
                    }
                }

                if (selectDevices && cbAudioSource.Items.Cast<FFmpegCaptureDevice>().
                    Any(x => x.Value.Equals(FFmpegCaptureDevice.VirtualAudioCapturer.Value, StringComparison.OrdinalIgnoreCase)))
                {
                    Options.FFmpeg.AudioSource = FFmpegCaptureDevice.VirtualAudioCapturer.Value;
                }
                else if (!cbAudioSource.Items.Cast<FFmpegCaptureDevice>().Any(x => x.Value.Equals(Options.FFmpeg.AudioSource, StringComparison.OrdinalIgnoreCase)))
                {
                    Options.FFmpeg.AudioSource = FFmpegCaptureDevice.None.Value;
                }

                foreach (FFmpegCaptureDevice device in cbAudioSource.Items)
                {
                    if (device.Value.Equals(Options.FFmpeg.AudioSource, StringComparison.OrdinalIgnoreCase))
                    {
                        cbAudioSource.SelectedItem = device;
                        break;
                    }
                }
            }
        }

        private void UpdateUI()
        {
            if (settingsLoaded)
            {
                lblx264CRF.Text = Options.FFmpeg.x264_Use_Bitrate ? Resources.Bitrate : Resources.CRF;
                nudx264CRF.Visible = !Options.FFmpeg.x264_Use_Bitrate;
                nudx264Bitrate.Visible = lblx264BitrateK.Visible = Options.FFmpeg.x264_Use_Bitrate;
                pbx264PresetWarning.Visible = (FFmpegPreset)cbx264Preset.SelectedIndex > FFmpegPreset.fast;

                if (!Options.FFmpeg.UseCustomCommands)
                {
                    txtCommandLinePreview.Text = Options.GetFFmpegArgs();
                }

                nudGIFBayerScale.Visible = Options.FFmpeg.GIFDither == FFmpegPaletteUseDither.bayer;
            }
        }

        private async void FFmpegOptionsForm_Load(object sender, EventArgs e)
        {
            await LoadSettings();
        }

        private void cbUseCustomFFmpegPath_CheckedChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.OverrideCLIPath = cbUseCustomFFmpegPath.Checked;
            txtFFmpegPath.Enabled = btnFFmpegBrowse.Enabled = Options.FFmpeg.OverrideCLIPath;
        }

        private void txtFFmpegPath_TextChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.CLIPath = txtFFmpegPath.Text;
        }

        private async void buttonFFmpegBrowse_Click(object sender, EventArgs e)
        {
            if (FileHelpers.BrowseFile(Resources.FFmpegOptionsForm_buttonFFmpegBrowse_Click_Browse_for_ffmpeg_exe, txtFFmpegPath, Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), true))
            {
                await RefreshSourcesAsync();
            }
        }

        private void cbVideoSource_SelectedIndexChanged(object sender, EventArgs e)
        {
            FFmpegCaptureDevice device = cbVideoSource.SelectedItem as FFmpegCaptureDevice;
            Options.FFmpeg.VideoSource = device?.Value;
            UpdateUI();
        }

        private void cbAudioSource_SelectedIndexChanged(object sender, EventArgs e)
        {
            FFmpegCaptureDevice device = cbAudioSource.SelectedItem as FFmpegCaptureDevice;
            Options.FFmpeg.AudioSource = device?.Value;
            UpdateUI();
        }

        private async void btnInstallHelperDevices_Click(object sender, EventArgs e)
        {
            string version = "0.12.10";
            string filePath = FileHelpers.GetAbsolutePath($"recorder-devices-{version}-setup.exe");

            if (!string.IsNullOrEmpty(filePath) && File.Exists(filePath))
            {
                bool result = false;

                await Task.Run(() =>
                {
                    try
                    {
                        using (Process process = new Process())
                        {
                            ProcessStartInfo psi = new ProcessStartInfo()
                            {
                                FileName = filePath
                            };

                            process.StartInfo = psi;
                            process.Start();
                            result = process.WaitForExit(1000 * 60 * 5) && process.ExitCode == 0;
                        }
                    }
                    catch { }
                });

                if (result)
                {
                    await RefreshSourcesAsync(true);
                }
            }
            else
            {
                MessageBox.Show("File not exists: \"" + filePath + "\"", "ShareX", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btnHelperDevicesHelp_Click(object sender, EventArgs e)
        {
            URLHelpers.OpenURL("https://github.com/rdp/screen-capture-recorder-to-video-windows-free");
        }

        private void cbVideoCodec_SelectedIndexChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.VideoCodec = (FFmpegVideoCodec)cbVideoCodec.SelectedIndex;

            tcFFmpegVideoCodecs.Visible = Options.FFmpeg.VideoCodec != FFmpegVideoCodec.libwebp && Options.FFmpeg.VideoCodec != FFmpegVideoCodec.apng;

            if (cbVideoCodec.SelectedIndex >= 0)
            {
                switch (Options.FFmpeg.VideoCodec)
                {
                    case FFmpegVideoCodec.libx264:
                    case FFmpegVideoCodec.libx265:
                        tcFFmpegVideoCodecs.SelectTabWithoutFocus(tpX264);
                        break;
                    case FFmpegVideoCodec.libvpx:
                    case FFmpegVideoCodec.libvpx_vp9:
                        tcFFmpegVideoCodecs.SelectTabWithoutFocus(tpVpx);
                        break;
                    case FFmpegVideoCodec.libxvid:
                        tcFFmpegVideoCodecs.SelectTabWithoutFocus(tpXvid);
                        break;
                    case FFmpegVideoCodec.h264_nvenc:
                    case FFmpegVideoCodec.hevc_nvenc:
                        tcFFmpegVideoCodecs.SelectTabWithoutFocus(tpNVENC);
                        break;
                    case FFmpegVideoCodec.gif:
                        tcFFmpegVideoCodecs.SelectTabWithoutFocus(tpGIF);
                        break;
                    case FFmpegVideoCodec.h264_amf:
                    case FFmpegVideoCodec.hevc_amf:
                        tcFFmpegVideoCodecs.SelectTabWithoutFocus(tpAMF);
                        break;
                    case FFmpegVideoCodec.h264_qsv:
                    case FFmpegVideoCodec.hevc_qsv:
                        tcFFmpegVideoCodecs.SelectTabWithoutFocus(tpQSV);
                        break;
                }
            }

            UpdateUI();
        }

        private void cbAudioCodec_SelectedIndexChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.AudioCodec = (FFmpegAudioCodec)cbAudioCodec.SelectedIndex;

            if (cbAudioCodec.SelectedIndex >= 0)
            {
                switch (Options.FFmpeg.AudioCodec)
                {
                    case FFmpegAudioCodec.libvoaacenc:
                        tcFFmpegAudioCodecs.SelectTabWithoutFocus(tpAAC);
                        break;
                    case FFmpegAudioCodec.libopus:
                        tcFFmpegAudioCodecs.SelectTabWithoutFocus(tpOpus);
                        break;
                    case FFmpegAudioCodec.libvorbis:
                        tcFFmpegAudioCodecs.SelectTabWithoutFocus(tpVorbis);
                        break;
                    case FFmpegAudioCodec.libmp3lame:
                        tcFFmpegAudioCodecs.SelectTabWithoutFocus(tpMP3);
                        break;
                }
            }

            UpdateUI();
        }

        private void nudx264CRF_ValueChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.x264_CRF = (int)nudx264CRF.Value;
            UpdateUI();
        }

        private void nudx264Bitrate_ValueChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.x264_Bitrate = (int)nudx264Bitrate.Value;
            UpdateUI();
        }

        private void cbx264UseBitrate_CheckedChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.x264_Use_Bitrate = cbx264UseBitrate.Checked;
            UpdateUI();
        }

        private void cbPreset_SelectedIndexChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.x264_Preset = (FFmpegPreset)cbx264Preset.SelectedIndex;
            UpdateUI();
        }

        private void nudVP8Bitrate_ValueChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.VPx_Bitrate = (int)nudVP8Bitrate.Value;
            UpdateUI();
        }

        private void nudQscale_ValueChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.XviD_QScale = (int)nudXvidQscale.Value;
            UpdateUI();
        }

        private void nudNVENCBitrate_ValueChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.NVENC_Bitrate = (int)nudNVENCBitrate.Value;
            UpdateUI();
        }

        private void cbNVENCPreset_SelectedIndexChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.NVENC_Preset = (FFmpegNVENCPreset)cbNVENCPreset.SelectedIndex;
            UpdateUI();
        }

        private void cbNVENCTune_SelectedIndexChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.NVENC_Tune = (FFmpegNVENCTune)cbNVENCTune.SelectedIndex;
            UpdateUI();
        }

        private void cbGIFStatsMode_SelectedIndexChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.GIFStatsMode = (FFmpegPaletteGenStatsMode)cbGIFStatsMode.SelectedIndex;
            UpdateUI();
        }

        private void cbGIFDither_SelectedIndexChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.GIFDither = (FFmpegPaletteUseDither)cbGIFDither.SelectedIndex;
            UpdateUI();
        }

        private void nudGIFBayerScale_SelectedIndexChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.GIFBayerScale = (int)nudGIFBayerScale.Value;
            UpdateUI();
        }

        private void cbAMFUsage_SelectedIndexChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.AMF_Usage = (FFmpegAMFUsage)cbAMFUsage.SelectedIndex;
            UpdateUI();
        }

        private void cbAMFQuality_SelectedIndexChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.AMF_Quality = (FFmpegAMFQuality)cbAMFQuality.SelectedIndex;
            UpdateUI();
        }

        private void nudAMFBitrate_ValueChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.AMF_Bitrate = (int)nudAMFBitrate.Value;
            UpdateUI();
        }

        private void cbQSVPreset_SelectedIndexChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.QSV_Preset = (FFmpegQSVPreset)cbQSVPreset.SelectedIndex;
            UpdateUI();
        }

        private void nudQSVBitrate_ValueChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.QSV_Bitrate = (int)nudQSVBitrate.Value;
            UpdateUI();
        }

        private void cbAACBitrate_SelectedIndexChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.AAC_Bitrate = (int)cbAACBitrate.SelectedItem;
            UpdateUI();
        }

        private void cbOpusBitrate_SelectedIndexChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.Opus_Bitrate = (int)cbOpusBitrate.SelectedItem;
            UpdateUI();
        }

        private void cbVorbisQuality_SelectedIndexChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.Vorbis_QScale = (int)cbVorbisQuality.SelectedItem;
            UpdateUI();
        }

        private void cbMP3Quality_SelectedIndexChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.MP3_QScale = (int)cbMP3Quality.SelectedItem;
            UpdateUI();
        }

        private void txtUserArgs_TextChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.UserArgs = txtUserArgs.Text;
            UpdateUI();
        }

        private void cbCustomCommands_CheckedChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.UseCustomCommands = cbCustomCommands.Checked;
            txtCommandLinePreview.ReadOnly = !Options.FFmpeg.UseCustomCommands;

            if (settingsLoaded)
            {
                if (Options.FFmpeg.UseCustomCommands)
                {
                    txtCommandLinePreview.Text = Options.GetFFmpegArgs(true);

                    txtCommandLinePreview.Focus();
                    txtCommandLinePreview.SelectionStart = txtCommandLinePreview.TextLength;
                    txtCommandLinePreview.ScrollToCaret();
                }
                else
                {
                    txtCommandLinePreview.Text = Options.GetFFmpegArgs();
                }
            }
        }

        private void txtCommandLinePreview_TextChanged(object sender, EventArgs e)
        {
            Options.FFmpeg.CustomCommands = txtCommandLinePreview.Text;
        }

        private async void btnResetOptions_Click(object sender, EventArgs e)
        {
            if (MessageBox.Show(Resources.WouldYouLikeToResetOptions, "ShareX - " + Resources.Confirmation, MessageBoxButtons.YesNo,
                MessageBoxIcon.Information) == DialogResult.Yes)
            {
                bool overrideCLIPath = Options.FFmpeg.OverrideCLIPath;
                string cliPath = Options.FFmpeg.CLIPath;

                Options.FFmpeg = new FFmpegOptions();
                Options.FFmpeg.OverrideCLIPath = overrideCLIPath;
                Options.FFmpeg.CLIPath = cliPath;

                await LoadSettings();
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: FFmpegOptionsForm.de.resx]---
Location: ShareX-develop/ShareX.ScreenCaptureLib/Forms/FFmpegOptionsForm.de.resx

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
    <value>ShareX - Bildschirmaufzeichnungsoptionen</value>
  </data>
  <data name="btnCopyPreview.Text" xml:space="preserve">
    <value>Kopieren</value>
  </data>
  <data name="btnRefreshSources.Text" xml:space="preserve">
    <value>Erneuern</value>
  </data>
  <data name="btnTest.Text" xml:space="preserve">
    <value>Mit CMD austesten</value>
  </data>
  <data name="cbCustomCommands.Text" xml:space="preserve">
    <value>Eigene Befehle verwenden:</value>
  </data>
  <data name="lblAACQuality.Text" xml:space="preserve">
    <value>Bitrate:</value>
  </data>
  <data name="lblAudioCodec.Text" xml:space="preserve">
    <value>Audiocodec:</value>
  </data>
  <data name="lblAudioSource.Text" xml:space="preserve">
    <value>Audioquelle:</value>
  </data>
  <data name="lblCodec.Text" xml:space="preserve">
    <value>Videocodec:</value>
  </data>
  <data name="lblMP3Quality.Text" xml:space="preserve">
    <value>Qualität:</value>
  </data>
  <data name="lblVideoSource.Text" xml:space="preserve">
    <value>Videoquelle:</value>
  </data>
  <data name="lblVorbisQuality.Text" xml:space="preserve">
    <value>Qualität:</value>
  </data>
  <data name="nudx264CRF.ToolTip" xml:space="preserve">
    <value>Constant Rate Factor (CRF): Die Spanne des Multiplikators ist 0-51: wobei 0 verlustfrei ist; 23 standard; und 51 das schlechteste
Ein kleinerer Wert heißt bessere Qualität und die subjektiv angemessenste Weite ist 18-28.
Man kann annehmen das 18 augenscheinlicherweise verlustfrei ist, oder fast: es sollte ganz oder fast wie der Input aussehen, ist aber theoretisch nicht verlustfrei.
Der Bereich ist exponentiell, also wenn man den Wert um +6 erhöht entspricht das grob der halben Bitrate, während -6 der Doppelten entspricht.
Normalerweise wählt man den höchsten CRF Wert, der noch akzeptable Ergebnisse erzielt.
Wenn der Output gut aussieht, dann versuche einen höheren Wert und wenn es dann schlecht aussieht benutze wieder den niedrigeren Wert.</value>
  </data>
  <data name="tbAACBitrate.ToolTip" xml:space="preserve">
    <value>Standard sind 128k.</value>
  </data>
  <data name="tbMP3_qscale.ToolTip" xml:space="preserve">
    <value>Die Spanne ist 0-9, wobei ein kleinerer Wert höherer Qualität entspricht. 0-3 produzieren normalerweise transparente Ergebnisse. 4 (Standard) sollte wahrnehmbar nahezu Transparenz entsprechen, 6 produziert "annehmbare Ergebnisse"</value>
  </data>
  <data name="tbVorbis_qscale.ToolTip" xml:space="preserve">
    <value>Die Spanne ist 0-10, wobei 10 die höchste Qualität ist. 3-6 ist eine gute Spanne zum Versuchen. Standard ist 3</value>
  </data>
  <data name="btnInstallHelperDevices.Text" xml:space="preserve">
    <value>Aufnahmegeräte Installieren...</value>
  </data>
  <data name="cbGIFStatsMode.ToolTip" xml:space="preserve">
    <value>Standard ist "full".</value>
  </data>
  <data name="cbGIFDither.ToolTip" xml:space="preserve">
    <value>Standard ist "sierra2_4a".</value>
  </data>
  <data name="cbOverrideFFmpegPath.Text" xml:space="preserve">
    <value>Angepassten Pfad verwenden</value>
  </data>
  <data name="lblGIFDither.Text" xml:space="preserve">
    <value>Dithering Modus:</value>
  </data>
  <data name="lblGIFStatsMode.Text" xml:space="preserve">
    <value>Palette Modus:</value>
  </data>
  <data name="lblHelperDevices.Text" xml:space="preserve">
    <value>Installiert die "screen-capture-recorder" und "virtual-audio-capturer" Video/Audio Quellen.</value>
  </data>
  <data name="lblVP8Bitrate.Text" xml:space="preserve">
    <value>Variable Bitrate:</value>
  </data>
  <data name="lblXvidQscale.Text" xml:space="preserve">
    <value>Variable Bitrate:</value>
  </data>
  <data name="lblx264Preset.Text" xml:space="preserve">
    <value>Voreinstellung:</value>
  </data>
  <data name="nudXvidQscale.ToolTip" xml:space="preserve">
    <value>1 ist die höchste Qualität/Dateigröße und 31 die niedrigste Qualität/kleinste Dateigröße.</value>
  </data>
  <data name="cbx264Preset.ToolTip" xml:space="preserve">
    <value>Schnellere Voreinstellung = Schnelle Encodierung, aber größere Dateien.
Langsamere Voreinstellung = Langsamere Encodierung, aber kleinere Dateien.
Für Echtzeitencodierung (z. B. Bildschirmaufzeichnungen) muss die Voreinstellung so schnell wie möglich sein.</value>
  </data>
  <data name="pbAudioCodecWarning.ToolTip" xml:space="preserve">
    <value>Dieser Audiocodec wird vom ausgewählten Videocontainer nicht unterstützt.</value>
  </data>
  <data name="pbx264PresetWarning.ToolTip" xml:space="preserve">
    <value>Für Echtzeitencodierungen wie Bildschirmaufnahmen sollte die Voreinstellung so schnell wie möglich sein.
Ansonsten kann es zu vielen Framedrops kommen.</value>
  </data>
  <data name="nudGIFBayerScale.ToolTip" xml:space="preserve">
    <value>Steuert den Index der Bayer-Skala. Je höher die Skala, desto mehr Streifen werden angezeigt. Standard ist 2.</value>
  </data>
  <data name="lblCommandLineArgs.Text" xml:space="preserve">
    <value>Zusätzliche Befehlszeilenargumente:</value>
  </data>
  <data name="cbUseCustomFFmpegPath.Text" xml:space="preserve">
    <value>Benutzerdefinierten FFmpeg-Pfad verwenden:</value>
  </data>
  <data name="lblVideoEncoder.Text" xml:space="preserve">
    <value>Videokodierer:</value>
  </data>
  <data name="lblAudioEncoder.Text" xml:space="preserve">
    <value>Audiokodierer:</value>
  </data>
  <data name="cbx264UseBitrate.Text" xml:space="preserve">
    <value>Bitrate verwenden</value>
  </data>
  <data name="lblNVENCTune.Text" xml:space="preserve">
    <value>Abstimmung:</value>
  </data>
  <data name="lblNVENCPreset.Text" xml:space="preserve">
    <value>Voreinstellung:</value>
  </data>
  <data name="lblAMFQuality.Text" xml:space="preserve">
    <value>Qualität:</value>
  </data>
  <data name="lblAMFUsage.Text" xml:space="preserve">
    <value>Verwendung:</value>
  </data>
  <data name="lblQSVPreset.Text" xml:space="preserve">
    <value>Voreinstellung:</value>
  </data>
  <data name="btnResetOptions.Text" xml:space="preserve">
    <value>Optionen zurücksetzen...</value>
  </data>
</root>
```

--------------------------------------------------------------------------------

````
