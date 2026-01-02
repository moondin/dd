---
source_txt: fullstack_samples/ImageMagick-main
converted_utc: 2025-12-18T11:25:35Z
part: 839
parts_total: 851
---

# FULLSTACK CODE DATABASE SAMPLES ImageMagick-main

## Verbatim Content (Part 839 of 851)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - ImageMagick-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/ImageMagick-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: Montage.html]---
Location: ImageMagick-main/www/Magick++/Montage.html

```text
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Magick++ API: Montage</title>
<link rel="stylesheet" href="magick.css" type="text/css" />
</head>
<body>
<div class="doc-section">
<h1 align="center">Magick::Montage Class</h1>
<p>A montage is a single image which is composed of thumbnail images composed in a uniform grid. The size of the montage image is determined by the size of the individual thumbnails and the number of rows and columns in the grid.</p>
<p>The following illustration shows a montage consisting of three columns and two rows of thumbnails rendered on a gray background:</p>
<p class="image"><img src="montage-sample-framed.jpg" name="Graphic1" align="bottom" width="378" height="238" border="0"/></p>
<p>Montages may be either "plain" (undecorated thumbnails) or "framed" (decorated thumbnails). In order to more easily understand the options supplied to <a href="STL.html#montageImages"><i>MontageImages()</i></a>, montage options are supplied by two different classes: <a href="Montage.html#Magick::Montage"><i>Magick::Montage</i></a> and <a href="Montage.html#Magick::MontageFramed"><i>Magick::MontageFramed</i></a>.</p>
<h3 align="center"><a name="PlainMontages"></a>Plain Montages</h3>
<p><a name="Magick::Montage"></a><i>Magick::Montage</i> is the base class to provide montage options and provides methods to set all options required to render simple (unframed) montages. See <a href="Montage.html#Magick::MontageFramed"><i>Magick::MontageFramed</i></a>if you would like to create a framed montage.</p>
<p>Unframed thumbnails consist of four components: the thumbnail image, the thumbnail border, an optional thumbnail shadow, and an optional thumbnail label area.</p>
<p class="image"><img src="thumbnail-anatomy-plain.jpg" name="Graphic2" align="middle" width="309" height="327" border="0"/></p>
<p style="margin-bottom: 0cm"> </p>
<p align="center" style="margin-bottom: 0cm"><b>Montage Methods</b></p>
<ul><table width="100%" border="1" cellpadding="2" cellspacing="2">
<tr>
<td>
<p align="center"><b>Method</b></p></td>
<td>
<p align="center"><b>Return Type</b></p></td>
<td>
<p align="center"><b>Signature(s)</b></p></td>
<td>
<p align="center"><b>Description</b></p></td></tr>
<tr>
<td>
<p align="center"><font size="2">Montage</font></p></td>
<td bgcolor="#666666"></td>
<td>
<p><font size="2">void</font></p></td>
<td>
<p><font size="2">Default constructor</font></p></td></tr>
<tr>
<td rowspan="2">
<p align="center"><a name="backgroundColor"></a><font size="2">backgroundColor</font></p></td>
<td>
<p><font size="2">void</font></p></td>
<td>
<p><font size="2">const <a href="Color.html">Color</a> &amp;backgroundColor_</font></p></td>
<td rowspan="2">
<p><font size="2">Specifies the background color that thumbnails are imaged upon.</font></p></td></tr>
<tr>
<td>
<p><a href="Color.html"><font size="2">Color</font></a></p></td>
<td>
<p><font size="2">void</font></p></td></tr>
<tr>
<td rowspan="2">
<p align="center"><a name="compose"></a><font size="2">compose</font></p></td>
<td>
<p><font size="2">void</font></p></td>
<td>
<p><font size="2"><a href="https://imagemagick.org/Magick++/Enumerations.html#CompositeOperator">CompositeOperator</a> compose_</font></p></td>
<td rowspan="2">
<p><font size="2">Specifies the image composition algorithm for thumbnails. This controls the algorithm by which the thumbnail image is placed on the background. Use of OverCompositeOp is recommended for use with images that have transparency. This option may have negative side-effects for images without transparency.</font></p></td></tr>
<tr>
<td>
<p><a href="https://imagemagick.org/Magick++/Enumerations.html#CompositeOperator"><font size="2">CompositeOperator</font></a></p></td>
<td>
<p><font size="2">void</font></p></td></tr>
<tr>
<td rowspan="2">
<p align="center"><a name="fileName"></a><font size="2">fileName</font></p></td>
<td>
<p><font size="2">void</font></p></td>
<td>
<p><font size="2">const std::string& fileName_</font></p></td>
<td rowspan="2">
<p><font size="2">Specifies the image filename to be used for the generated montage images. To handle the case were multiple montage images are generated, a <span lang="en-US">printf</span>-style format may be embedded within the filename. For example, a filename specification of image%02d.miff names the montage images as image00.miff, image01.miff, etc.</font></p></td></tr>
<tr>
<td>
<p><font size="2">std::string</font></p></td>
<td>
<p><font size="2">void</font></p></td></tr>
<tr>
<td rowspan="2">
<p align="center"><a name="fill"></a>fill</p></td>
<td>
<p><font size="2">void</font></p></td>
<td>
<p><font size="2">const <a href="Color.html">Color</a> &amp;pen_</font></p></td>
<td rowspan="2">
<p><font size="2">Specifies the fill color to use for the label text.</font></p></td></tr>
<tr>
<td>
<p><a href="Color.html"><font size="2">Color</font></a></p></td>
<td>
<p><font size="2">void</font></p></td></tr>
<tr>
<td rowspan="2">
<p align="center"><a name="font"></a><font size="2">font</font></p></td>
<td>
<p><font size="2">void</font></p></td>
<td>
<p><font size="2">const std::string& font_</font></p></td>
<td rowspan="2">
<p><font size="2">Specifies the thumbnail label font.</font></p></td></tr>
<tr>
<td>
<p><font size="2">std::string</font></p></td>
<td>
<p><font size="2">void</font></p></td></tr>
<tr>
<td rowspan="2">
<p align="center"><a name="geometry"></a><font size="2">geometry</font></p></td>
<td>
<p><font size="2">void</font></p></td>
<td>
<p><font size="2">const <a href="Geometry.html">Geometry</a> &amp;geometry_</font></p></td>
<td rowspan="2">
<p><font size="2">Specifies the size of the generated thumbnail.</font></p></td></tr>
<tr>
<td>
<p><a href="Geometry.html"><font size="2">Geometry</font></a></p></td>
<td>
<p><font size="2">void</font></p></td></tr>
<tr>
<td rowspan="2">
<p align="center"><a name="gravity"></a><font size="2">gravity</font></p></td>
<td>
<p><font size="2">void</font></p></td>
<td>
<p><font size="2"><a href="https://imagemagick.org/Magick++/Enumerations.html#GravityType">GravityType</a> gravity_</font></p></td>
<td rowspan="2">
<p><font size="2">Specifies the thumbnail positioning within the specified geometry area. If the thumbnail is smaller in any dimension than the geometry, then it is placed according to this specification.</font></p></td></tr>
<tr>
<td>
<p><a href="https://imagemagick.org/Magick++/Enumerations.html"><font size="2">GravityType</font></a></p></td>
<td>
<p><font size="2">void</font></p></td></tr>
<tr>
<td rowspan="2">
<p align="center"><a name="label"></a><font size="2">label</font></p></td>
<td>
<p><font size="2">void</font></p></td>
<td>
<p><font size="2">const std::string& label_</font></p></td>
<td rowspan="2">
<p><font size="2">Specifies the format used for the image label. Special <a href="https://imagemagick.org/Magick++/FormatCharacters.html">format characters</a> may be embedded in the format string to include information about the image.</font></p></td></tr>
<tr>
<td>
<p><font size="2">std::string</font></p></td>
<td>
<p><font size="2">void</font></p></td></tr>
<tr>
<td rowspan="2">
<p align="center"><a name="penColor"></a><font size="2">penColor</font></p></td>
<td>
<p><font size="2">void</font></p></td>
<td>
<p><font size="2">const <a href="Color.html">Color</a> &amp;pen_</font></p></td>
<td rowspan="2">
<p><font size="2">Specifies the pen color to use for the label text (same as <i>fill</i>).</font></p></td></tr>
<tr>
<td>
<p><a href="Color.html"><font size="2">Color</font></a></p></td>
<td>
<p><font size="2">void</font></p></td></tr>
<tr>
<td rowspan="2">
<p align="center"><a name="pointSize"></a><font size="2">pointSize</font></p></td>
<td>
<p><font size="2">void</font></p></td>
<td>
<p><font size="2">size_t pointSize_</font></p></td>
<td rowspan="2">
<p><font size="2">Specifies the thumbnail label font size.</font></p></td></tr>
<tr>
<td>
<p><font size="2">size_t</font></p></td>
<td>
<p><font size="2">void</font></p></td></tr>
<tr>
<td rowspan="2">
<p align="center"><a name="shadow"></a><font size="2">shadow</font></p></td>
<td>
<p><font size="2">void</font></p></td>
<td>
<p><font size="2">bool shadow_</font></p></td>
<td rowspan="2">
<p><font size="2">Enable/disable drop-shadow on thumbnails.</font></p></td></tr>
<tr>
<td>
<p><font size="2">bool</font></p></td>
<td>
<p><font size="2">void</font></p></td></tr>
<tr>
<td rowspan="2">
<p align="center"><a name="stroke"></a><font size="2">stroke</font></p></td>
<td>
<p>void</p></td>
<td>
<p><font size="2">const <a href="Color.html">Color</a> &amp;pen_</font></p></td>
<td rowspan="2">
<p><font size="2">Specifies the stroke color to use for the label text .</font></p></td></tr>
<tr>
<td>
<p><a href="Color.html"><font size="2">Color</font></a></p></td>
<td>
<p><font size="2">void</font></p></td></tr>
<tr>
<td rowspan="2">
<p align="center"><a name="texture"></a><font size="2">texture</font></p></td>
<td>
<p><font size="2">void</font></p></td>
<td>
<p><font size="2">const std::string& texture_</font></p></td>
<td rowspan="2">
<p><font size="2">Specifies a texture image to use as montage background. The built-in textures "<tt>granite:</tt>" and "<tt>plasma:</tt>" are available. A texture is the same as a background image.</font></p></td></tr>
<tr>
<td>
<p><font size="2">std::string</font></p></td>
<td>
<p><font size="2">void</font></p></td></tr>
<tr>
<td rowspan="2">
<p align="center"><a name="tile"></a><font size="2">tile</font></p></td>
<td>
<p><font size="2">void</font></p></td>
<td>
<p><font size="2">const <a href="Geometry.html">Geometry</a> &amp;tile_</font></p></td>
<td rowspan="2">
<p><font size="2">Specifies the maximum number of montage columns and rows in the montage. The montage is built by filling out all cells in a row before advancing to the next row. Once the montage has reached the maximum number of columns and rows, a new montage image is started.</font></p></td></tr>
<tr>
<td>
<p><a href="Geometry.html"><font size="2">Geometry</font></a></p></td>
<td>
<p><font size="2">void</font></p></td></tr>
<tr>
<td rowspan="2">
<p align="center"><a name="transparentColor"></a><font size="2">transparentColor</font></p></td>
<td>
<p><font size="2">void</font></p></td>
<td>
<p><font size="2">const <a href="Color.html">Color</a> &amp;transparentColor_</font></p></td>
<td rowspan="2">
<p><font size="2">Specifies a montage color to set transparent. This option can be set the same as the background color in order for the thumbnails to appear without a background when rendered on an HTML page. For best effect, ensure that the transparent color selected does not occur in the rendered thumbnail colors.</font></p></td></tr>
<tr>
<td>
<p><a href="Color.html"><font size="2">Color</font></a></p></td>
<td>
<p><font size="2">void</font></p></td></tr></table></ul>
<h3 align="center"><a name="FramedMontages"></a>Framed Montages</h3>
<p><a name="Magick::MontageFramed"></a><i>Magick::MontageFramed</i> provides the means to specify montage options when it is desired to have decorative frames around the image thumbnails. <i>MontageFramed</i> inherits from <i>Montage</i> and therefore provides all the methods of <i>Montage</i> as well as those shown in the table "MontageFramed Methods".</p>
<p>Framed thumbnails consist of four components: the thumbnail image, the thumbnail frame, the thumbnail border, an optional thumbnail shadow, and an optional thumbnail label area.</p>
<p class="image"><img src="thumbnail-anatomy-framed.jpg" name="Graphic3" align="middle" width="350" height="345" border="0" /></p>
<p style="margin-bottom: 0cm"> </p>
<p align="center" style="margin-bottom: 0cm"><b>MontageFramed Methods</b></p>
<ul><table width="100%" border="1" cellpadding="2" cellspacing="2">
<tr>
<td>
<p align="center"><b>Method</b></p></td>
<td>
<p align="center"><b>Return Type</b></p></td>
<td>
<p align="center"><b>Signature(s)</b></p></td>
<td>
<p align="center"><b>Description</b></p></td></tr>
<tr>
<td>
<p align="center"><font size="2">MontageFramed</font></p></td>
<td bgcolor="#666666"></td>
<td>
<p><font size="2">void</font></p></td>
<td>
<p><font size="2">Default constructor (enable frame via <i>frameGeometry</i>).</font></p></td></tr>
<tr>
<td rowspan="2">
<p align="center"><a name="borderColor"></a><font size="2">borderColor</font></p></td>
<td>
<p><font size="2">void</font></p></td>
<td>
<p><font size="2">const <a href="Color.html">Color</a> &amp;borderColor_</font></p></td>
<td rowspan="2">
<p><font size="2">Specifies the background color within the thumbnail frame.</font></p></td></tr>
<tr>
<td>
<p><a href="Color.html"><font size="2">Color</font></a></p></td>
<td>
<p><font size="2">void</font></p></td></tr>
<tr>
<td rowspan="2">
<p align="center"><a name="borderWidth"></a><font size="2">borderWidth</font></p></td>
<td>
<p><font size="2">void</font></p></td>
<td>
<p><font size="2">size_t borderWidth_</font></p></td>
<td rowspan="2">
<p><font size="2">Specifies the border (in pixels) to place between a thumbnail and its surrounding frame. This option only takes effect if thumbnail frames are enabled (via <i>frameGeometry</i>) and the thumbnail geometry specification doesn't also specify the thumbnail border width.</font></p></td></tr>
<tr>
<td>
<p><font size="2">size_t</font></p></td>
<td>
<p><font size="2">void</font></p></td></tr>
<tr>
<td rowspan="2">
<p align="center"><a name="frameGeometry"></a><font size="2">frameGeometry</font></p></td>
<td>
<p><font size="2">void</font></p></td>
<td>
<p><font size="2">const <a href="Geometry.html">Geometry</a> &amp;frame_</font></p></td>
<td rowspan="2">
<p><font size="2">Specifies the geometry specification for frame to place around thumbnail. If this parameter is not specified, then the montage is unframed.</font></p></td></tr>
<tr>
<td>
<p><a href="Geometry.html"><font size="2">Geometry</font></a></p></td>
<td>
<p><font size="2">void</font></p></td></tr>
<tr>
<td rowspan="2">
<p align="center"><a name="matteColor"></a><font size="2">matteColor</font></p></td>
<td>
<p><font size="2">void</font></p></td>
<td>
<p><font size="2">const <a href="Color.html">Color</a> &amp;matteColor_</font></p></td>
<td rowspan="2">
<p><font size="2">Specifies the thumbnail frame color.</font></p></td></tr>
<tr>
<td>
<p><a href="Color.html"><font size="2">Color</font></a></p></td>
<td>
<p><font size="2">void</font></p></td></tr></table></ul>
</div>
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: NEWS.html]---
Location: ImageMagick-main/www/Magick++/NEWS.html

```text
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="generator" content="HTML Tidy for Linux (vers 25 March 2009), see www.w3.org" />
<title></title>
</head>
<body>
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: PixelPacket.html]---
Location: ImageMagick-main/www/Magick++/PixelPacket.html

```text
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Magick++ API: PixelPacket</title>
<link rel="stylesheet" href="magick.css" type="text/css" />
</head>
<body>
<div class="doc-section">
<h1 align="center">PixelPacket Structure</h1>
<p style="margin-bottom: 0cm">The <i>PixelPacket</i> structure is used to represent pixels in ImageMagick. ImageMagick may be compiled to support 32 or 64 bit pixels. The size of PixelPacket is controlled by the value of the <i>QuantumDepth</i> define. The default is 64 bit pixels, which provide the best accuracy. If memory consumption must be minimized, or processing time must be minimized, then ImageMagick may be compiled with QuantumDepth=8. The following table shows the relationship between <i>QuantumDepth</i>, the type of <i>Quantum</i>, and the overall <i>PixelPacket</i> size.</p>
<br />
<p align="center" style="margin-bottom: 0cm"><b>Effect Of QuantumDepth Values</b></p>
<center>
<table width="336" border="1" cellpadding="2" cellspacing="3" bgcolor="#CCCCCC">
<col width="101" />
<col width="99" />
<col width="110" />
<tr>
<td width="101">
<p align="center"><b>QuantumDepth</b></p></td>
<td width="99">
<p align="center"><b>Quantum Type</b></p></td>
<td width="110">
<p align="center"><b>PixelPacket Size</b></p></td></tr>
<tr>
<td width="101">
<p align="center">8</p></td>
<td width="99">
<p align="center">unsigned char</p></td>
<td width="110">
<p align="center">32 bits</p></td></tr>
<tr>
<td width="101">
<p align="center">16</p></td>
<td width="99">
<p align="center">unsigned short</p></td>
<td width="110">
<p align="center">64 bits</p></td></tr></table></center>
<p style="margin-bottom: 0cm">The members of the <i>PixelPacket</i> structure, and their interpretation, are shown in the following table:</p>
<br />
<p align="center" style="margin-bottom: 0cm"><b>PixelPacket Structure Members</b></p>
<center>
<table width="523" border="1" cellpadding="2" cellspacing="3" bgcolor="#CCCCCC">
<col width="58" />
<col width="50" />
<col width="102" />
<col width="152" />
<col width="119" />
<tr>
<td rowspan="2" width="58">
<p align="center"><b>Member</b></p></td>
<td rowspan="2" width="50">
<p align="center"><b>Type</b></p></td>
<td colspan="3" width="388">
<p align="center"><b>Interpretation</b></p></td></tr>
<tr>
<td width="102">
<p align="center"><a href="Enumerations.html#ColorspaceType">RGBColorspace</a></p></td>
<td width="152">
<p align="center"><a href="Enumerations.html#ColorspaceType">RGBColorspace</a> + <a href="Image++.html#matte">matte</a></p></td>
<td width="119">
<p align="center"><a href="Enumerations.html#ColorspaceType">CMYKColorspace</a></p></td></tr>
<tr>
<td width="58">
<p><font size="2">red</font></p></td>
<td width="50">
<p><font size="2">Quantum</font></p></td>
<td width="102">
<p><font size="2">Red</font></p></td>
<td width="152">
<p><font size="2">Red</font></p></td>
<td width="119">
<p><font size="2">Cyan</font></p></td></tr>
<tr>
<td width="58">
<p><font size="2">green</font></p></td>
<td width="50">
<p><font size="2">Quantum</font></p></td>
<td width="102">
<p><font size="2">Green</font></p></td>
<td width="152">
<p><font size="2">Green</font></p></td>
<td width="119">
<p><font size="2">Magenta</font></p></td></tr>
<tr>
<td width="58">
<p><font size="2">blue</font></p></td>
<td width="50">
<p><font size="2">Quantum</font></p></td>
<td width="102">
<p><font size="2">Blue</font></p></td>
<td width="152">
<p><font size="2">Blue</font></p></td>
<td width="119">
<p><font size="2">Yellow</font></p></td></tr>
<tr>
<td width="58">
<p><font size="2">opacity</font></p></td>
<td width="50">
<p><font size="2">Quantum</font></p></td>
<td width="102">
<p><font size="2">Ignored</font></p></td>
<td width="152">
<p><font size="2">Opacity</font></p></td>
<td width="119">
<p><font size="2">Ignored</font></p></td></tr></table></center>
</div>
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: Pixels.html]---
Location: ImageMagick-main/www/Magick++/Pixels.html

```text
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Magick++ API: Working with Pixels </title>
<link rel="stylesheet" href="magick.css" type="text/css" />
</head>
<body>
<div class="doc-section">
<h1 align="center">Magick::Pixels</h1>
<p>The <i>Pixels</i> class provides efficient access to raw image
pixels. Image pixels (of type <a href="https://imagemagick.org/Magick++/Quantum.html"><i>Quantum</i></a>)
may be accessed directly via the <i>Image Pixel Cache</i>. The image
pixel cache is a rectangular window (a view) into the actual image
pixels (which may be in memory, memory-mapped from a disk file, or
entirely on disk). Obtain existing image pixels via <i>get()</i>.
Create a new pixel region using <i>set().</i> </p>
<p>Depending on the capabilities of the operating system, and the
relationship of the window to the image, the pixel cache may be a copy
of the pixels in the selected window, or it may be the actual image
pixels. In any case calling <i>sync()</i> insures that the base image
is updated with the contents of the modified pixel cache. The method <i>decode()</i>supports
copying foreign pixel data formats into the pixel cache according to
the <i>QuantumTypes</i>. The method <i>encode()</i> supports copying
the pixels in the cache to a foreign pixel representation according to
the format specified by <i>QuantumTypes</i>. </p>
<p>Setting a view using the Pixels class does not cause the number of
references to the underlying image to be reduced to one. Therefore, in
order to ensure that only the current generation of the image is
modified, the Image's <a href="Image++.html#modifyImage">modifyImage()</a>
method should be invoked to reduce the reference count on the underlying
image to one. If this is not done, then it is possible for a previous
generation of the image to be modified due to the use of reference
counting when copying or constructing an Image. </p>
<p>The <i>Quantum</i>* returned by the <i>set</i> and <i>get</i>
methods, and the <i>void</i>* returned by the <i>indexes</i>
method point to pixel data managed by the <i>Pixels</i> class. The <i>Pixels</i>
class is responsible for releasing resources associated with the pixel
view. This means that the pointer should never be passed to delete() or
free(). </p>
<p style="margin-bottom: 0cm;">The pixel view is a small image in which
the pixels may be accessed, addressed, and updated, as shown in the
following example, which produces an image similar to the one on the
right (minus lines and text): </p>
<p class="image"><img class="icon" src="Cache.png" name="Graphic1" align="bottom" width="254" border="0" /></p>
<div class="viewport">
#include &lt;Magick++.h> 
#include &lt;iostream> 

using namespace std; 
using namespace Magick; 
int main(int argc,char **argv) 
{ 
  InitializeMagick(*argv);

  // Create base image 
  Image image(Geometry(254,218), "white");


  // Set the image type to TrueColor DirectClass representation.
  image.type(TrueColorType);
  // Ensure that there is only one reference to underlying image 
  // If this is not done, then image pixels will not be modified.
  image.modifyImage();

  // Allocate pixel view 
  Pixels view(image);

  // Set all pixels in region anchored at 38x36, with size 160x230 to green. 
  size_t columns = 196; size_t rows = 162; 
  Color green("green"); 
  Quantum *pixels = view.get(38,36,columns,rows); 
  for ( ssize_t row = 0; row &lt; rows ; ++row ) 
    for ( ssize_t column = 0; column &lt; columns ; ++column ) 
    {
      *pixels++=QuantumRange*green.quantumRed();
      *pixels++=QuantumRange*green.quantumGreen();
      *pixels++=QuantumRange*green.quantumBlue();
    }

  // Save changes to image.
  view.sync();

  // Set all pixels in region anchored at 86x72, with size 108x67 to yellow. 
  columns = 108; rows = 67; 
  Color yellow("yellow"); 
  pixels = view.get(86,72,columns,rows); 
  for ( ssize_t row = 0; row &lt; rows ; ++row ) 
    for ( ssize_t column = 0; column &lt; columns ; ++column ) 
    {
      *pixels++=QuantumRange*yellow.quantumRed();
      *pixels++=QuantumRange*yellow.quantumGreen();
      *pixels++=QuantumRange*yellow.quantumBlue();
    }
   view.sync();

  // Set pixel at position 108,94 to red 
  Color red("red");
  pixels = view.get(108,94,1,1);
  *pixels++=QuantumRange*red.quantumRed();
  *pixels++=QuantumRange*red.quantumGreen();
  *pixels++=QuantumRange*red.quantumBlue();

  // Save changes to image.
  view.sync();
  image.write( "logo.png" );
}
</div>
<p style="margin-bottom: 0cm;"><i>Pixels</i> supports the following
methods: </p>
<p align="center" style="margin-bottom: 0cm;"><b>Pixel Cache Methods</b></p>
<table width="100%" border="1" cellpadding="2" cellspacing="2">
	<tbody>
    <tr>
		<td> 			
      <p align="center"><b>Method</b></p>
		</td>
		<td> 			
      <p align="center"><b>Returns</b></p>
		</td>
		<td> 			
      <p align="center"><b>Signature</b></p>
		</td>
		<td> 			
      <p align="center"><b>Description</b></p>
		</td>
	</tr>
	<tr>
		<td> 			
      <p align="center"><a name="get"></a><font size="2">get</font></p>
		</td>
		<td> 			
      <p><font size="2"><a href="https://imagemagick.org/Magick++/Quantum.html">Quantum</a>*</font></p>
		</td>
		<td> 			
      <p><font size="2">const ssize_t x_, const ssize_t y_, const size_t
columns_, const size_t rows_</font></p>
		</td>
		<td> 			
      <p><font size="2">Transfers read-write pixels from the image to
the 			pixel cache as defined by the specified rectangular region.
			Modified pixels may be subsequently transferred back to the image
			via <i>sync</i>. The value returned is intended for pixel access
			only. It should never be deallocated.</font></p>
		</td>
	</tr>
	<tr>
		<td> 			
      <p align="center"><a name="getConst"></a><font size="2">getConst</font></p>
		</td>
		<td> 			
      <p><font size="2">const <a href="https://imagemagick.org/Magick++/Quantum.html">Quantum</a>*</font></p>
		</td>
		<td> 			
      <p><font size="2">const ssize_t x_, const ssize_t y_, const size_t
			columns_, const size_t rows_</font></p>
		</td>
		<td> 			
      <p><font size="2">Transfers read-only pixels from the image to
the 			pixel cache as defined by the specified rectangular region.</font></p>
		</td>
	</tr>
	<tr>
		<td> 			
      <p align="center"><a name="set"></a><font size="2">set</font></p>
		</td>
		<td> 			
      <p><font size="2"><a href="https://imagemagick.org/Magick++/Quantum.html">Quantum</a>*</font></p>
		</td>
		<td> 			
      <p><font size="2">const ssize_t x_, const ssize_t y_, const size_t
			columns_, const size_t rows_</font></p>
		</td>
		<td> 			
      <p><font size="2">Allocates a pixel cache region to store image
			pixels as defined by the region rectangle.  This area is
			subsequently transferred from the pixel cache to the image via 			<i>sync</i>.
The value returned is intended for pixel access only. 			It should
never be deallocated.</font></p>
		</td>
	</tr>
	<tr>
		<td> 			
      <p align="center"><a name="sync"></a><font size="2">sync</font></p>
		</td>
		<td> 			
      <p><font size="2">void</font></p>
		</td>
		<td> 			
      <p><font size="2">void</font></p>
		</td>
		<td> 			
      <p><font size="2">Transfers the image cache pixels to the image.</font></p>
		</td>
	</tr>
	<tr>
		<td> 			
      <p align="center"><a name="indexes"></a><font size="2">indexes</font></p>
		</td>
		<td> 			
      <p><font size="2">void*</font></p>
		</td>
		<td> 			
      <p><font size="2">void</font></p>
		</td>
		<td> 			
      <p><font size="2">Returns the PsuedoColor pixel indexes
			corresponding to the pixel region defined by the last <a href="Pixels.html#get">get</a>
			, <a href="Pixels.html#getConst">getConst</a>, or <a href="Pixels.html#set">set</a>
			call. Only valid for PseudoColor and CMYKA images. The pixel
			indexes (an array of type <i>void</i>, which is typedef 			<i>Quantum</i>,
which is itself typedef <i>unsigned char</i>, or 			<i>unsigned short</i>,
depending on the value of the <i>QuantumDepth 			</i>define) provide
the <span lang="en-US">colormap</span> index 			(see <a
 href="Image++.html#colorMap">colorMap</a>) for each pixel in 			the
image. For CMYKA images, the indexes represent the black 			
channel. The value returned is intended for pixel access 			only. It
should never be deallocated.</font></p>
		</td>
	</tr>
	<tr>
		<td> 			
      <p align="center"><a name="x"></a><font size="2">x</font></p>
		</td>
		<td> 			
      <p><font size="2">ssize_t</font></p>
		</td>
		<td> 			
      <p><font size="2">void</font></p>
		</td>
		<td> 			
      <p><font size="2">Left ordinate of view</font></p>
		</td>
	</tr>
	<tr>
		<td> 			
      <p align="center"><a name="y"></a><font size="2">y</font></p>
		</td>
		<td> 			
      <p><font size="2">ssize_t</font></p>
		</td>
		<td> 			
      <p><font size="2">void</font></p>
		</td>
		<td> 			
      <p><font size="2">Top ordinate of view</font></p>
		</td>
	</tr>
	<tr>
		<td> 			
      <p align="center"><a name="columns"></a><font size="2">columns</font></p>
		</td>
		<td> 			
      <p><font size="2">size_t</font></p>
		</td>
		<td> 			
      <p><font size="2">void</font></p>
		</td>
		<td> 			
      <p><font size="2">Width of view</font></p>
		</td>
	</tr>
	<tr>
		<td> 			
      <p align="center"><a name="rows"></a><font size="2">rows</font></p>
		</td>
		<td> 			
      <p><font size="2">size_t</font></p>
		</td>
		<td> 			
      <p><font size="2">void</font></p>
		</td>
		<td> 			
      <p><font size="2">Height of view</font></p>
		</td>
	</tr>
  </tbody>
</table>
</div>
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: Quantum.html]---
Location: ImageMagick-main/www/Magick++/Quantum.html

```text
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Magick++ API: Quantum</title>
<link rel="stylesheet" href="magick.css" type="text/css" />
</head>
<body>
<div class="doc-section">
<h1 align="center">Quantum Structure</h1>
<p style="margin-bottom: 0cm">The <i>Quantum</i> structure is used to represent pixels in ImageMagick. ImageMagick may be compiled to support 32 or 64 bit pixels. The size of Quantum is controlled by the value of the <i>QuantumDepth</i> define. The default is 64 bit pixels, which provide the best accuracy. If memory consumption must be minimized, or processing time must be minimized, then ImageMagick may be compiled with QuantumDepth=8. The following table shows the relationship between <i>QuantumDepth</i>, the type of <i>Quantum</i>, and the overall <i>Quantum</i> size.</p>
<br />
<p align="center" style="margin-bottom: 0cm"><b>Effect Of QuantumDepth Values</b></p>
<center>
<table width="336" border="1" cellpadding="2" cellspacing="3" bgcolor="#CCCCCC">
<col width="101" />
<col width="99" />
<col width="110" />
<tr>
<td width="101">
<p align="center"><b>QuantumDepth</b></p></td>
<td width="99">
<p align="center"><b>Quantum Type</b></p></td>
<td width="110">
<p align="center"><b>Quantum Size</b></p></td></tr>
<tr>
<td width="101">
<p align="center">8</p></td>
<td width="99">
<p align="center">unsigned char</p></td>
<td width="110">
<p align="center">32 bits</p></td></tr>
<tr>
<td width="101">
<p align="center">16</p></td>
<td width="99">
<p align="center">unsigned short</p></td>
<td width="110">
<p align="center">64 bits</p></td></tr></table></center>
<p style="margin-bottom: 0cm">The members of the <i>Quantum</i> structure, and their interpretation, are shown in the following table:</p>
<br />
<p align="center" style="margin-bottom: 0cm"><b>Quantum Pixel Layout</b></p>
<center>
<table width="523" border="1" cellpadding="2" cellspacing="3" bgcolor="#CCCCCC">
<col width="58" />
<col width="50" />
<col width="102" />
<col width="152" />
<col width="119" />
<tr>
<td rowspan="2" width="58">
<p align="center"><b>Member</b></p></td>
<td rowspan="2" width="50">
<p align="center"><b>Type</b></p></td>
<td colspan="3" width="388">
<p align="center"><b>Interpretation</b></p></td></tr>
<tr>
<td width="102">
<p align="center"><a href="Enumerations.html#ColorspaceType">RGBColorspace</a></p></td>
<td width="152">
<p align="center"><a href="Enumerations.html#ColorspaceType">RGBColorspace</a> + <a href="Image++.html#matte">matte</a></p></td>
<td width="119">
<p align="center"><a href="Enumerations.html#ColorspaceType">CMYKColorspace</a></p></td></tr>
<tr>
<td width="58">
<p><font size="2">red</font></p></td>
<td width="50">
<p><font size="2">Quantum</font></p></td>
<td width="102">
<p><font size="2">Red</font></p></td>
<td width="152">
<p><font size="2">Red</font></p></td>
<td width="119">
<p><font size="2">Cyan</font></p></td></tr>
<tr>
<td width="58">
<p><font size="2">green</font></p></td>
<td width="50">
<p><font size="2">Quantum</font></p></td>
<td width="102">
<p><font size="2">Green</font></p></td>
<td width="152">
<p><font size="2">Green</font></p></td>
<td width="119">
<p><font size="2">Magenta</font></p></td></tr>
<tr>
<td width="58">
<p><font size="2">blue</font></p></td>
<td width="50">
<p><font size="2">Quantum</font></p></td>
<td width="102">
<p><font size="2">Blue</font></p></td>
<td width="152">
<p><font size="2">Blue</font></p></td>
<td width="119">
<p><font size="2">Yellow</font></p></td></tr>
<tr>
<td width="58">
<p><font size="2">opacity</font></p></td>
<td width="50">
<p><font size="2">Quantum</font></p></td>
<td width="102">
<p><font size="2">Ignored</font></p></td>
<td width="152">
<p><font size="2">Opacity</font></p></td>
<td width="119">
<p><font size="2">Ignored</font></p></td></tr></table></center>
</div>
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: README.txt]---
Location: ImageMagick-main/www/Magick++/README.txt

```text
This directory contains the Magick++ documentation.

The file NEWS.html is generated from Magick++ source directory via
 txt2html -t 'Magick++ News' < NEWS  > ../www/Magick++/NEWS.html
using Seth Golub's fantastic txt2html translator.
```

--------------------------------------------------------------------------------

````
